/* Unit 3 — المولدات التزامنية ثلاثية الأوجه (ص 90–123) */
(function(B){
/* =====================================================================
   إضافة من خارج الكتاب (بانتظار قرار المستخدم):
   سلوك المولد بعد ربطه بالقضيب اللانهائي عند تغيير تيار المجال أو عزم المحرك الأولي.
   الكتاب لا يشرحه رغم أن أسئلة الفصل الثاني (5–7) تسأل عنه.
   كل ما يخص هذه الإضافة (قسم الشرح في الدرس 6 + وضع «بعد الربط» في مختبره + خطوتاه + إشارات الإجابات) مربوط بهذا الثابت.
   اجعله false لإخفائها كلها.
   ===================================================================== */
const EXTRA_INFINITE_BUS = true;

const PI=Math.PI,D=PI/180,SQ3=Math.sqrt(3),SQ2=Math.SQRT2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fm=(x,d)=>B.fmtN(x,d);
const lt=s=>`<span class="ltr">${s}</span>`;
const fx=v=>(+v).toFixed(1);
const wrap180=d=>((d+180)%360+360)%360-180;

/* ---------- styles used only by this unit (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('u3sg-css'))return;const s=document.createElement('style');s.id='u3sg-css';s.textContent=`
.sg-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px}
.sg-sl .sg-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.sg-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.sg-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.sg-sl input[type=range]:disabled{opacity:.4}
.sg-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.sg-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.sg-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:5px}
.sg-leg i.d{background:none!important;border-top:3px dashed currentColor;height:0}
.sg-chart{position:relative;height:230px;margin-top:8px}.sg-chart canvas{position:absolute;inset:0;width:100%;height:100%}
.sg-chart.sm{height:180px}
.sg-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.sg-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.sg-q ol,.sg-q ul{margin:6px 0}
.sg-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.sg-msg{margin-top:10px}
.sg-tbl{overflow-x:auto;margin-top:10px}
.sg-tbl table{border-collapse:collapse;width:100%;font-size:13px;direction:ltr}
.sg-tbl th,.sg-tbl td{border:1px solid var(--line);padding:4px 8px;text-align:center;font-family:var(--mono)}
.sg-tbl th{background:var(--surface-2);font-family:var(--font)}
.sg-tbl td.bad{color:var(--stop);font-weight:700}
.sg-extra{border:2px dashed var(--live);border-radius:14px;padding:12px 14px;margin-top:16px;background:var(--surface)}
.sg-extra>.sg-tag,.sg-tag{display:inline-block;background:var(--live-soft);color:var(--fg);border:1px solid var(--live);border-radius:999px;padding:2px 10px;font-size:12.5px;font-weight:700}
.sg-big{font-size:15px}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${typeof s.x==='function'?s.x():s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="sg-sl"><span class="sg-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segOn=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const legend=items=>`<div class="sg-leg">${items.map(([c,l,d])=>`<span><i class="${d?'d':''}" style="${d?'color':'background'}:var(${c})"></i>${l}</span>`).join('')}</div>`;
const svgbox=(svg,max,min)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${min?`<div style="min-width:${min}px">${svg}</div>`:svg}</div>`;
function cssv(){const cs=getComputedStyle(document.documentElement);return n=>cs.getPropertyValue(n).trim()||'#888'}
function niceStep(range,n){const raw=range/n,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return (m<1.5?1:m<3?2:m<7?5:10)*p}
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${fx(x)}" y="${fx(y)}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const laT=(x,y,s,o)=>{o=o||{};return `<text class="txt${o.cls?' '+o.cls:''}" x="${fx(x)}" y="${fx(y)}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* canvas x-y plot (as in the small-machines course) */
function plot(cv,o){
  const r=cv.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width||!r.height)return;
  const Wd=Math.round(r.width*dpr),Hd=Math.round(r.height*dpr);if(cv.width!==Wd||cv.height!==Hd){cv.width=Wd;cv.height=Hd}
  const g=cv.getContext('2d'),w=r.width,h=r.height,col=cssv();g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);g.direction='ltr';
  const l=o.left||50,rt=12,t=12,bm=34,pw=w-l-rt,ph=h-t-bm;
  const x0=o.xmin||0,x1=o.xmax,y0=o.ymin||0,y1=o.ymax;
  const X=x=>l+(x-x0)/(x1-x0)*pw,Y=y=>t+ph-(y-y0)/(y1-y0)*ph;
  const font='monospace';g.font='11px '+font;
  (o.shade||[]).forEach(s=>{const a=Math.max(s.x0,x0),b=Math.min(s.x1,x1);if(b<=a)return;g.fillStyle=col(s.color);g.globalAlpha=s.alpha||.14;g.fillRect(X(a),t,X(b)-X(a),ph);g.globalAlpha=1});
  g.strokeStyle=col('--line');g.lineWidth=1;g.fillStyle=col('--muted');
  const xs=o.xstep||niceStep(x1-x0,6),ys=o.ystep||niceStep(y1-y0,5);
  g.textAlign='center';g.textBaseline='top';
  for(let v=Math.ceil(x0/xs-1e-9)*xs;v<=x1+1e-9;v+=xs){const xx=X(v);g.beginPath();g.moveTo(xx,t);g.lineTo(xx,t+ph);g.stroke();g.fillText(String(+v.toFixed(6)),xx,t+ph+4)}
  g.textAlign='right';g.textBaseline='middle';
  for(let v=Math.ceil(y0/ys-1e-9)*ys;v<=y1+1e-9;v+=ys){const yy=Y(v);g.beginPath();g.moveTo(l,yy);g.lineTo(l+pw,yy);g.stroke();g.fillText(String(+v.toFixed(6)),l-5,yy)}
  g.strokeStyle=col('--fg');g.lineWidth=1.3;g.beginPath();g.moveTo(l,t);g.lineTo(l,t+ph);g.lineTo(l+pw,t+ph);g.stroke();
  if(y0<0&&y1>0){g.beginPath();g.moveTo(l,Y(0));g.lineTo(l+pw,Y(0));g.stroke()}
  if(x0<0&&x1>0){g.beginPath();g.moveTo(X(0),t);g.lineTo(X(0),t+ph);g.stroke()}
  g.fillStyle=col('--muted');g.textAlign='right';g.textBaseline='bottom';if(o.xlabel)g.fillText(o.xlabel,l+pw,h-1);
  g.save();g.beginPath();g.rect(l,t,pw,ph);g.clip();
  (o.shade||[]).forEach(s=>{if(s.label&&s.x1>s.x0){g.fillStyle=col(s.color);g.textAlign='left';g.textBaseline='bottom';g.fillText(s.label,X(Math.max(s.x0,x0))+3,t+ph-3)}});
  (o.series||[]).forEach(s=>{if(!s.pts||!s.pts.length)return;g.strokeStyle=col(s.color);g.lineWidth=s.width||2.4;g.setLineDash(s.dash||[]);g.beginPath();s.pts.forEach((p,i)=>{const xx=X(p[0]),yy=Y(p[1]);i?g.lineTo(xx,yy):g.moveTo(xx,yy)});g.stroke();g.setLineDash([])});
  (o.texts||[]).forEach(s=>{g.fillStyle=col(s.color||'--fg');g.font='bold 12px '+font;g.textAlign=s.align||'left';g.textBaseline='middle';g.fillText(s.t,X(s.x),Y(s.y));g.font='11px '+font});
  (o.points||[]).forEach(p=>{g.fillStyle=col(p.color||'--fg');g.beginPath();g.arc(X(p.x),Y(p.y),p.r||5,0,7);g.fill();g.strokeStyle=col('--surface');g.lineWidth=2;g.stroke()});
  g.restore();
  if(o.ylabel){g.fillStyle=col('--muted');g.textAlign='left';g.textBaseline='top';g.fillText(o.ylabel,l+5,t+2)}
}
/* monotone cubic interpolation (Fritsch–Carlson) through points [[x,y]] sorted by x */
function mono(P){const n=P.length,dx=[],m=[],t=[];for(let i=0;i<n-1;i++){dx[i]=P[i+1][0]-P[i][0];m[i]=(P[i+1][1]-P[i][1])/dx[i]}
  t[0]=m[0];t[n-1]=m[n-2];for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2;
  for(let i=0;i<n-1;i++){if(m[i]===0){t[i]=t[i+1]=0;continue}const a=t[i]/m[i],b=t[i+1]/m[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);t[i]=k*a*m[i];t[i+1]=k*b*m[i]}}
  return x=>{if(x<=P[0][0])return P[0][1];if(x>=P[n-1][0])return P[n-1][1];let i=0;while(x>P[i+1][0])i++;const h=dx[i],u=(x-P[i][0])/h,u2=u*u,u3=u2*u;
    return (2*u3-3*u2+1)*P[i][1]+(u3-2*u2+u)*h*t[i]+(-2*u3+3*u2)*P[i+1][1]+(u3-u2)*h*t[i+1]}}
const linInterp=P=>x=>{if(x<=P[0][0])return P[0][1];for(let i=0;i<P.length-1;i++)if(x<=P[i+1][0])return P[i][1]+(P[i+1][1]-P[i][1])*(x-P[i][0])/(P[i+1][0]-P[i][0]);return P[P.length-1][1]};
function invert(f,y,a,b){if(y<=f(a))return a;if(y>=f(b))return null;let lo=a,hi=b;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(f(m)<y)lo=m;else hi=m}return (lo+hi)/2}
const samp=(f,a,b,n)=>{const p=[];n=n||80;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;p.push([x,f(x)])}return p};

/* ---------- complex helpers ---------- */
const Cx=(re,im)=>({re,im:im||0}),cadd=(...a)=>a.reduce((s,b)=>Cx(s.re+b.re,s.im+b.im),Cx(0)),csub=(a,b)=>Cx(a.re-b.re,a.im-b.im),
  cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},
  cabs=a=>Math.hypot(a.re,a.im),cang=a=>Math.atan2(a.im,a.re)/D,cpol=(m,d)=>Cx(m*Math.cos(d*D),m*Math.sin(d*D));
const pol=(m,a,md,ad)=>`${fm(m,md==null?2:md)}\\angle ${fm(a,ad==null?2:ad)}^\\circ`;
const sgn=v=>(v<0?'-':'+');

/* ---------- O.C.C of the example machine — الشكل (3-19) ص 114 ----------
   القيم مقروءة تقريبياً بالنظر من الشكل المطبوع (لا يطبع الكتاب أرقامها)،
   والنقاط الثلاث التي يستعملها الحل (4.1 A↔451 V، 4.5 A↔480 V، 5.7 A↔532 V) مطابقة للكتاب. */
const OCC_PTS=[[0,0],[1,120],[2,240],[3,355],[4,443],[4.1,451],[4.5,480],[5,505],[5.7,532],[6,543],[7,565],[8,578],[9,585],[10,590]];
const occ=mono(OCC_PTS);
const occInv=E=>invert(occ,E,0,10);
const AIRGAP=120;              // V per A — slope of the linear part (خط الثغرة الهوائية)
/* O.C.C table of exercise 10 (ص 122) */
const Q10_PTS=[[0,0],[1,600],[2,1200],[3,1800],[4,2230],[5,2520],[6,2700],[7,2800],[8,2850]];
const q10=linInterp(Q10_PTS),q10Inv=E=>invert(q10,E,0,8);

/* ================= drawings ================= */
const P2=(cx,cy,r,a)=>[cx+r*Math.sin(a*D),cy-r*Math.cos(a*D)];   // a in degrees, clockwise from 12 o'clock
const pp=(r,a)=>P2(0,0,r,a);
function statorSVG(cx,cy,o){o=o||{};const R0=o.R0||160,Rb=o.Rb||118,ns=o.ns||36;
  let s=`<path d="M${cx-R0} ${cy}a${R0} ${R0} 0 1 0 ${2*R0} 0a${R0} ${R0} 0 1 0 ${-2*R0} 0ZM${cx-Rb} ${cy}a${Rb} ${Rb} 0 1 0 ${2*Rb} 0a${Rb} ${Rb} 0 1 0 ${-2*Rb} 0Z" fill="var(--surface-2)" fill-rule="evenodd" stroke="var(--fg)" stroke-width="1.6"/>`;
  if(o.slots!==false)for(let i=0;i<ns;i++){const a=i*360/ns+180/ns;const c=o.slotFill?o.slotFill(i,a):'var(--surface)';s+=`<rect x="-3.5" y="${-(Rb+13)}" width="7" height="13" rx="1.5" transform="translate(${cx} ${cy}) rotate(${fx(a)})" fill="${c}" stroke="var(--fg)" stroke-width="1"/>`}
  return s}
const condSym=(x,y,dot,r)=>{r=r||4;return `<circle cx="${fx(x)}" cy="${fx(y)}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/>`+(dot?`<circle cx="${fx(x)}" cy="${fx(y)}" r="1.4" fill="var(--fg)"/>`:`<path d="M${fx(x-r*.6)} ${fx(y-r*.6)}L${fx(x+r*.6)} ${fx(y+r*.6)}M${fx(x+r*.6)} ${fx(y-r*.6)}L${fx(x-r*.6)} ${fx(y+r*.6)}" stroke="var(--fg)" stroke-width="1.1"/>`)};
/* flux paths between neighbouring poles (local coordinates, rotor at 0°) */
function fluxPaths(P,o){o=o||{};const tau=360/P,e=tau*0.14,Ro=o.Ro||146,Ri=o.Ri||100,Rh=o.Rh||50;let s='';
  for(let i=0;i<P;i++){const a=i*tau+e,b=(i+1)*tau-e;const p1=pp(Ri,a),p2=pp(Ro,a),p3=pp(Ro,b),p4=pp(Ri,b),q1=pp(Rh,b),q2=pp(Rh,a);
    const big=(b-a)>180?1:0;
    s+=`<path d="M${fx(p1[0])} ${fx(p1[1])}L${fx(p2[0])} ${fx(p2[1])}A${Ro} ${Ro} 0 ${big} 1 ${fx(p3[0])} ${fx(p3[1])}L${fx(p4[0])} ${fx(p4[1])}M${fx(q1[0])} ${fx(q1[1])}A${Rh} ${Rh} 0 ${big} 0 ${fx(q2[0])} ${fx(q2[1])}" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    // arrowheads: out of N (even), into S (odd)
    const Nfirst=i%2===0;const out=Nfirst?a:b,inn=Nfirst?b:a;const o1=pp(116,out),o2=pp(134,out),i1=pp(134,inn),i2=pp(116,inn);
    s+=arrow(o1[0],o1[1],o2[0],o2[1],'--blue',1.6)+arrow(i1[0],i1[1],i2[0],i2[1],'--blue',1.6)}
  return s}
function salientRotor(P,o){o=o||{};const Rs=111,Rh=40,tau=360/P,beta=tau*0.34,wb=Math.min(40,2*60*Math.sin(tau/2*D)*0.62),ang=o.ang||0;let s='';
  for(let i=0;i<P;i++){const a=i*tau,N=i%2===0;
    let g=`<rect x="${fx(-wb/2)}" y="-92" width="${fx(wb)}" height="${92-Rh+4}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
    const a1=pp(86,-beta),a2=pp(Rs,-beta),a3=pp(Rs,beta),a4=pp(86,beta);
    g+=`<path d="M${fx(a1[0])} ${fx(a1[1])}L${fx(a2[0])} ${fx(a2[1])}A${Rs} ${Rs} 0 0 1 ${fx(a3[0])} ${fx(a3[1])}L${fx(a4[0])} ${fx(a4[1])}Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
    const cf=o.hot?'var(--live)':'var(--live-soft)';
    g+=`<rect x="${fx(-wb/2-11)}" y="-80" width="11" height="32" rx="2" fill="${cf}" stroke="var(--live)" stroke-width="1.2"/><rect x="${fx(wb/2)}" y="-80" width="11" height="32" rx="2" fill="${cf}" stroke="var(--live)" stroke-width="1.2"/>`;
    g+=condSym(-wb/2-5.5,-64,N,3.6)+condSym(wb/2+5.5,-64,!N,3.6);
    const lp=pp(66,0);g+=`<text class="txt" x="0" y="${fx(lp[1]+4)}" text-anchor="middle" font-size="13" transform="rotate(${fx(-a-ang)} 0 ${fx(lp[1])})" style="fill:var(${N?'--stop':'--blue-ink'})">${N?'N':'S'}</text>`;
    s+=`<g transform="rotate(${fx(a)})">${g}</g>`}
  s+=`<circle r="${Rh+4}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><circle r="12" fill="var(--muted)"/>`;
  if(o.flux)s=fluxPaths(P)+s;
  return s}
function cylRotor(P,o){o=o||{};const Rs=111,tau=360/P,ns=32,ang=o.ang||0;let s=`<circle r="${Rs}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let k=0;k<ns;k++){const a=k*360/ns+180/ns;const kk=Math.floor(a/tau);const dpole=Math.min(Math.abs(a-kk*tau),Math.abs((kk+1)*tau-a));if(dpole<tau*0.22)continue;
    const dot=kk%2===1;const c=pp(Rs-7,a);
    s+=`<rect x="-3.6" y="${-Rs}" width="7.2" height="15" rx="1" transform="rotate(${fx(a)})" fill="${o.hot?'var(--live-soft)':'var(--surface)'}" stroke="var(--fg)" stroke-width="1"/>`+condSym(c[0],c[1],dot,2.8)}
  if(o.flux){if(P===2){[-46,0,46].forEach(x=>{const yy=Math.sqrt(Rs*Rs-x*x)-18;s+=`<path d="M${x} ${fx(yy)}V${fx(-yy)}" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="5 4"/>`+arrow(x,10,x,-10,'--blue',1.6)})}
    s=s+fluxPaths(P,{Rh:P===2?0.01:50})}
  for(let i=0;i<P;i++){const N=i%2===0,lp=pp(P===2?78:72,i*tau);s+=`<text class="txt" x="${fx(lp[0])}" y="${fx(lp[1]+5)}" text-anchor="middle" font-size="14" transform="rotate(${fx(-ang)} ${fx(lp[0])} ${fx(lp[1])})" style="fill:var(${N?'--stop':'--blue-ink'})">${N?'N':'S'}</text>`}
  s+=`<circle r="12" fill="var(--muted)"/>`;
  return s}
/* الشكل (3-1) / (3-3) with Arabic labels */
function machineFig(kind){const cx=300,cy=185;let s=`<svg viewBox="0 0 600 370" role="img" aria-label="${kind==='sal'?'آلة تزامنية ذات عضو دوار ذو أقطاب بارزة':'آلة تزامنية ذات عضو دوار اسطواني'}">`;
  s+=statorSVG(cx,cy);s+=`<g transform="translate(${cx} ${cy})">${kind==='sal'?salientRotor(6,{flux:1}):cylRotor(2,{flux:1})}</g>`;
  const lab=(tx,ty,px,py,t)=>{const left=tx<cx;return `<path d="M${fx(left?tx+6:tx-6)} ${fx(ty-4)}L${fx(px)} ${fx(py)}" stroke="var(--muted)" stroke-width="1"/><circle cx="${fx(px)}" cy="${fx(py)}" r="2.2" fill="var(--muted)"/>`+arT(left?tx:tx,ty,t,{a:left?'end':'start',fs:13})};
  const g=(r,a)=>P2(cx,cy,r,a);let p;
  p=g(152,40);s+=lab(500,40,p[0],p[1],'العضو الثابت');
  p=g(124,82);s+=lab(512,128,p[0],p[1],'الأسنان');
  p=g(125,95);s+=lab(512,170,p[0],p[1],'مجاري الملفات');
  p=g(115,128);s+=lab(505,262,p[0],p[1],'الثغرة الهوائية');
  p=g(146,150);s+=lab(470,335,p[0],p[1],'مسار الفيض المغناطيسي');
  if(kind==='sal'){p=[cx-25,cy-64];s+=lab(95,48,p[0],p[1],'ملفات العضو الدوار');p=g(104,300);s+=lab(95,108,p[0],p[1],'أقطاب العضو الدوار');p=g(30,240);s+=lab(95,300,p[0],p[1],'العضو الدوار')}
  else{p=g(104,300);s+=lab(95,108,p[0],p[1],'ملفات العضو الدوار');p=g(60,235);s+=lab(95,300,p[0],p[1],'العضو الدوار')}
  return s+'</svg>'}
/* الشكل (3-2): simplified redraw of the photo */
function fig32SVG(){let s=`<svg viewBox="0 0 300 300" role="img" aria-label="عضو دوار ذو أقطاب بارزة">`;
  s+=`<circle cx="150" cy="150" r="140" fill="none" stroke="var(--muted)" stroke-width="10"/>`;
  s+=`<g transform="translate(150 150) scale(1.12)">${salientRotor(6,{hot:1})}</g>`;
  return s+'</svg>'}
/* الشكل (3-4): simplified side view of a turbo-generator rotor */
function fig34SVG(){let s=`<svg viewBox="0 0 620 250" role="img" aria-label="عضو دوار اسطواني">`;
  s+=`<rect x="10" y="112" width="600" height="22" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  s+=`<rect x="170" y="62" width="280" height="122" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let i=0;i<7;i++){const y=72+i*16;s+=`<rect x="172" y="${y}" width="276" height="7" fill="var(--live-soft)" stroke="var(--live)" stroke-width="1"/><rect x="172" y="${y}" width="276" height="2.5" fill="var(--muted)"/>`}
  [[110,170],[450,510]].forEach(([a,b])=>{for(let i=0;i<5;i++){const y=74+i*20,m=a<300?a+8:b-8;s+=`<path d="M${a<300?b:a} ${y}C${m} ${y} ${m} ${y+10} ${a<300?b:a} ${y+12}" fill="none" stroke="var(--live)" stroke-width="5" opacity=".9"/>`}
    s+=`<rect x="${a}" y="56" width="${b-a}" height="134" rx="10" fill="var(--surface)" fill-opacity=".55" stroke="var(--fg)" stroke-width="1.6"/>`});
  const L=(tx,ty,px,py,t,anc)=>`<path d="M${tx} ${ty+4}L${px} ${py}" stroke="var(--muted)" stroke-width="1"/>`+laT(tx,ty,t,{a:anc||'middle',fs:12});
  s+=L(300,24,300,72,'Locking Key')+L(420,36,420,92,'Fitted Blocks','start')+L(140,24,140,60,'Retaining Ring')+L(530,226,480,150,'End Turn Bends')+L(240,226,240,170,'Slip Layer');
  return s+'</svg>'}

/* ============================== Lesson 3.1 ============================== */
B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'90–96',
 title:'تركيب الآلة التزامنية وكيف يولّد المولد الجهد',
 summary:'العضو الثابت (المنتج) والعضو الدوار (ملفات المجال بتيار مستمر)، ونوعا العضو الدوار: ذو الأقطاب البارزة للسرعات المنخفضة والإسطواني للسرعات العالية. ثم كيف يتولد جهد ثلاثي الأوجه يتحدد تردده بالسرعة وعدد الأقطاب، وقيمته بالتردد والفيض (تيار المجال).',
 stations:[
  {intro:true},

  {st:1,short:'أهداف الوحدة',title:'أهداف الوحدة الثالثة: المولدات التزامنية ثلاثية الأوجه',ref:'ص 91',
   q:'محطة الكهرباء التي تغذي مدينتك فيها مولدات ضخمة… ما الذي يجب أن تعرفه عنها لتفهم كيف تعمل وكيف تُربط بالشبكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أحد عشر هدفاً تفصيلياً للوحدة في بطاقات مرقمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="52" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">الأهداف التفصيلية</text>
<g data-tip="الهدف 1: أن يلم المتدرب بأنواع وتركيب الآلات التزامنية."><rect x="52" y="70" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="78" y="103" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">1</text></g>
<g data-tip="الهدف 2: أن يلم المتدرب بنظرية عمل المولدات التزامنية."><rect x="118" y="70" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="144" y="103" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">2</text></g>
<g data-tip="الهدف 3: أن يلم المتدرب بكيفية ضبط جهد وتردد المولدات التزامنية."><rect x="184" y="70" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="210" y="103" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">3</text></g>
<g data-tip="الهدف 4: أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المولدات التزامنية ثلاثية الأوجه."><rect x="250" y="70" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="276" y="103" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">4</text></g>
<g data-tip="الهدف 5: أن يتمكن المتدرب من إجراء الاختبارات الروتينية على المولدات التزامنية ثلاثية الأوجه."><rect x="52" y="136" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="78" y="169" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">5</text></g>
<g data-tip="الهدف 6: أن يتمكن المتدرب من تحديد عناصر الدائرة المكافئة للمولدات التزامنية."><rect x="118" y="136" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="144" y="169" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">6</text></g>
<g data-tip="الهدف 7: أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمولدات التزامنية."><rect x="184" y="136" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="210" y="169" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">7</text></g>
<g data-tip="الهدف 8: أن يتمكن المتدرب من حساب معامل تنظيم الجهد للمولدات التزامنية."><rect x="250" y="136" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="276" y="169" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">8</text></g>
<g data-tip="الهدف 9: أن يتمكن المتدرب من إجراء عملية ربط للمولد التزامني على الشبكة العامة."><rect x="85" y="202" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="111" y="235" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">9</text></g>
<g data-tip="الهدف 10: أن يتمكن المتدرب من استنتاج وفهم المنحنيات المميزة لهذه المولدات."><rect x="151" y="202" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="177" y="235" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">10</text></g>
<g data-tip="الهدف 11: أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المولدات."><rect x="217" y="202" width="52" height="52" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="243" y="235" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700">11</text></g>
<text x="180" y="286" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">التركيب، التشغيل، الأداء</text></svg>`,
   cap:'أحد عشر هدفاً تفصيلياً تخدم الهدف العام للوحدة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ الهدف كاملاً.</b>',
   side:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> الإلمام الشامل بتركيب وأساسيات تشغيل وأداء المولدات التزامنية ثلاثية الأوجه.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol>
     <li>أن يلم المتدرب بأنواع وتركيب الآلات التزامنية.</li><li>أن يلم المتدرب بنظرية عمل المولدات التزامنية.</li><li>أن يلم المتدرب بكيفية ضبط جهد وتردد المولدات التزامنية.</li><li>أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المولدات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من إجراء الاختبارات الروتينية على المولدات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من تحديد عناصر الدائرة المكافئة للمولدات التزامنية.</li><li>أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمولدات التزامنية.</li><li>أن يتمكن المتدرب من حساب معامل تنظيم الجهد للمولدات التزامنية.</li><li>أن يتمكن المتدرب من إجراء عملية ربط للمولد التزامني على الشبكة العامة.</li><li>أن يتمكن المتدرب من استنتاج وفهم المنحنيات المميزة لهذه المولدات.</li><li>أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المولدات.</li></ol>`,ref:'ص 91'}
   ],
   body:[
    {tip:String.raw`<p>الوحدة في الكتاب فصلان: الفصل الأول «التركيب ونظرية العمل والدائرة المكافئة ومنحنيات الخواص» (ص 92–106)، والفصل الثاني «مخطط توزيع القدرة – التشغيل على التوازي» (ص 107–123). في هذا الموقع قُسّمت إلى سبعة دروس: التركيب وتوليد الجهد (هذا الدرس)، ثم رد فعل المنتج والدائرة المكافئة، ثم المخطط الاتجاهي، ثم الاختبارات وتنظيم الجهد، ثم القدرة والكفاءة، ثم الربط على التوازي، وأخيراً الأمثلة المحلولة والأسئلة.</p>`,title:'خريطة الوحدة'},
    {predict:{q:'أيّ مما يلي <b>ليس</b> من أهداف هذه الوحدة؟',opts:[
     ['حساب معامل تنظيم الجهد للمولد',false,'هذا الهدف 8 في القائمة.'],
     ['ربط المولد التزامني على الشبكة العامة',false,'هذا الهدف 9 في القائمة.'],
     ['حساب الانزلاق بين سرعة الدوار وسرعة المجال',true,'الانزلاق من موضوعات المحرك الحثي (الوحدة الأولى). أما الآلة التزامنية فيدور فيها الدوار بسرعة المجال نفسها كما ستعرف في المحطة التالية.'],
     ['رسم المخطط الاتجاهي واستخدامه',false,'هذا الهدف 11 في القائمة.']]}}
   ]},

  {st:2,short:'تمهيد',title:'تمهيد: لماذا «تزامنية»؟',ref:'ص 92',
   q:'من أين تأتي الكهرباء التي تصل إلى بيتك؟ وما الآلة التي تولّد معظمها في العالم؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حلقة ممتلئة بنسبة ثمانية وتسعين بالمئة تمثل نصيب الآلة التزامنية من توليد الكهرباء في العالم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle data-tip="الجزء الصغير الباقي من الطاقة الكهربائية تنتجه وسائل أخرى غير الآلة التزامنية." cx="180" cy="150" r="95" fill="none" stroke="#CFC6B4" stroke-width="28"/><path data-tip="أكثر من ⟦98%⟧ من الطاقة الكهربائية المنتجة في العالم يتم توليدها باستخدام الآلة التزامنية (ص 92)." d="M180 55 A95 95 0 1 1 168.1 55.8" fill="none" stroke="#E8735A" stroke-width="28"/><text x="180" y="150" text-anchor="middle" font-size="46" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">98%</text><text x="180" y="180" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">وأكثر</text><text x="180" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">من الكهرباء في العالم تولّدها الآلة التزامنية</text></svg>`,
   cap:'الجزء البرتقالي من الحلقة = نصيب الآلة التزامنية من توليد الكهرباء في العالم.<br><b>مرّر المؤشر على جزأي الحلقة (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>أكثر من <b>98%</b> من الطاقة الكهربائية المنتجة في العالم يتم توليدها باستخدام الآلة التزامنية، فهي الأكثر استخداماً لغرض تحويل الطاقة الميكانيكية إلى كهربائية. والآلة التزامنية كما أنها تستخدم كمولد تزامني تستخدم أيضاً كمحرك تزامني كما سيأتي في الوحدة القادمة.</p>`,ref:'ص 92'},
    {predict:{q:'لماذا سُمّيت هذه الآلة «تزامنية»؟',opts:[
     ['لأنها تُربط مع مولدات أخرى في الوقت نفسه',false,'الربط على التوازي موضوع في آخر الوحدة، وليس سبب التسمية.'],
     ['لأن العضو الدوار يدور بسرعة دوران المجال المغناطيسي نفسها تماماً',true,'هذا تعليل الكتاب في ص 92: «التزامن أو التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار».'],
     ['لأنها تنتج ثلاثة أوجه في الوقت نفسه',false,'المحرك الحثي ثلاثي الأوجه أيضاً، ومع ذلك ليس تزامنياً.']]}}
   ],
   body:[
    {book:String.raw`<p>اكتسبت تسمية <b>(التزامنية)</b> بسبب <b>التزامن أو التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار</b>، ولذلك تسمى بالآلة التزامنية أو التوافقية.</p>`,ref:'ص 92'},
    {tip:String.raw`<p>تذكّر المحرك الحثي في الوحدة الأولى: هناك يتأخر العضو الدوار دائماً عن المجال الدوار بمقدار الانزلاق. أما في الآلة التزامنية فلا يوجد انزلاق: <b>الدوار والمجال يدوران معاً بالسرعة نفسها</b>.</p>`,title:'الفرق عن المحرك الحثي'},
    {add:String.raw`<p>المولد الاحتياطي (مولد الديزل) في مستشفى أو مبنى كبير، ومولدات محطات الكهرباء الضخمة التي تديرها التوربينات… كلها مولدات تزامنية. تختلف في الحجم كثيراً، لكن فكرتها واحدة وهي موضوع هذه الوحدة.</p>`,title:'أين تراها؟'}
   ]},

  {st:3,short:'التركيب',title:'تركيب الآلة التزامنية ثلاثية الأوجه',ref:'ص 92',
   q:'في الآلة عضوان: واحد يحمل ملفات إنتاج الكهرباء، وآخر يحمل ملفات المجال. أيّهما الأفضل أن يدور؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منظر جانبي: المنتج على العضو الثابت تخرج منه ثلاثة أوجه مباشرة، وملفات المجال على العضو الدوار تُغذّى بتيار مستمر عبر حلقتي انزلاق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="ثلاثة أوجه تخرج من المنتج الثابت مباشرةً إلى الحمل: التيار المسحوب كبير، فلا يمر في حلقات انزلاق."><line x1="150" y1="64" x2="150" y2="34" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><line x1="180" y1="64" x2="180" y2="34" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><line x1="210" y1="64" x2="210" y2="34" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><rect x="138" y="20" width="84" height="20" fill="transparent"/></g>
<text x="270" y="44" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">إلى الحمل</text>
<g data-tip="العضو الثابت: يحمل ملفات إنتاج الطاقة الكهربائية، ويسمى المنتج ⟦Armature⟧."><rect x="100" y="64" width="160" height="34" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><rect x="100" y="220" width="160" height="34" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></g>
<text x="180" y="86" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">المنتج (ثابت)</text>
<rect x="28" y="152" width="300" height="16" rx="4" fill="#2C4A40"/>
<g data-tip="العضو الدوار: يحمل ملفات المجال المغناطيسي، ويُغذّى بتيار مستمر."><rect x="118" y="108" width="124" height="104" rx="10" fill="#E9B949" stroke="#2C4A40" stroke-width="2.5"/><path d="M128 124H232M128 138H232M128 182H232M128 196H232" stroke="#B9852A" stroke-width="5"/></g>
<text x="180" y="165" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">ملفات المجال</text>
<g data-tip="حلقتا انزلاق فقط: تُدخلان التيار المستمر إلى ملفات المجال على العضو الدوار. لو وُضع المنتج على الدوار لاحتجنا ⟦6⟧ حلقات يمر فيها تيار الحمل الكبير."><rect x="270" y="138" width="12" height="44" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="296" y="138" width="12" height="44" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="الفرشتان ومصدر الجهد المستمر: يدخل التيار المستمر من الفرشتين إلى الحلقتين ثم إلى ملفات المجال."><rect x="270" y="118" width="12" height="18" fill="#2C4A40"/><rect x="296" y="118" width="12" height="18" fill="#2C4A40"/><text x="276" y="112" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">+</text><text x="302" y="112" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700">−</text></g>
<text x="289" y="204" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">حلقتا انزلاق</text>
<text x="180" y="244" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">المنتج (ثابت)</text>
<text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">المنتج ثابت… والمجال هو الذي يدور</text></svg>`,
   cap:'الأخضر المزرق = العضو الثابت (المنتج)، والذهبي = العضو الدوار (ملفات المجال)، والخطوط البرتقالية = الأوجه الثلاثة الخارجة إلى الحمل.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف دور كل جزء.</b>',
   side:[
    {book:String.raw`<p>تتكون الآلة التزامنية <span class="ltr">Synchronous Machine</span> من عضوين رئيسين: عضو ثابت وعضو دوار؛ أحدهما يحمل ملفات إنتاج الطاقة الكهربائية ويسمى <b>المنتج <span class="ltr">Armature</span></b>، والآخر يحمل ملفات المجال المغناطيسي.</p>`,ref:'ص 92'},
    {predict:{q:'لو وضعنا ملفات المنتج (ثلاثة أوجه) على العضو الدوار، كم حلقة انزلاق نحتاج لإخراج الكهرباء منها؟',opts:[
     ['حلقتان',false,'حلقتان تكفيان لملفات المجال (طرف موجب وطرف سالب) فقط.'],
     ['ثلاث حلقات',false,'كل ملف من الملفات الثلاثة له طرفان، فالمجموع ستة أطراف.'],
     ['ست حلقات',true,'ثلاثة ملفات × طرفان = ستة أطراف، أي ست حلقات يمر فيها تيار الحمل الكبير. لذلك يفضل الكتاب أن يكون المنتج ثابتاً.']]}}
   ],
   body:[
    {book:String.raw`<p>ويُفضَّل أن تكون ملفات إنتاج الطاقة الكهربائية مثبتة على العضو الثابت بينما ملفات المجال المغناطيسي مثبتة على العضو الدوار لعدة أسباب أهمها:</p>
     <ol><li>التيار المسحوب من الآلة كبير لذا يفضل أن يؤخذ مباشرةً وليس عن طريق حلقات انزلاق.</li><li>التخلص من حلقات الانزلاق أو تقليلها إلى (2) بدلاً من (6) حلقات.</li><li>سهولة تبريد ملفات إنتاج الطاقة الكهربائية عندما تكون ثابتة.</li><li>حماية ملفات إنتاج الطاقة الكهربائية من قوة الطرد المركزية بسبب وزنها الكبير.</li></ol>
     <p>لذا فإننا في دراستنا لهذه الآلة سيكون العضو الثابت حاملاً لملفات إنتاج الطاقة الكهربائية بينما يكون العضو الدوار حاملاً لملفات المجال المغناطيسي.</p>`,ref:'ص 92'},
    {tip:String.raw`<p>لماذا <b>6</b> حلقات مقابل <b>2</b>؟ لو كان المنتج يدور لاحتجنا ستة أطراف (ثلاثة ملفات × طرفين) تخرج عبر حلقات انزلاق ويمر فيها تيار الحمل الكبير. أما ملفات المجال فتحتاج طرفين فقط (موجب وسالب) وتيارها صغير نسبياً.</p>`},
    {watch:String.raw`<p>في المحرك الحثي كانت كلمة «العضو الدوار» تعني الموصلات التي يتولد فيها التيار بالحث. هنا العضو الدوار يحمل <b>ملفات المجال</b> ويُغذّى بتيار مستمر من الخارج، والتيار المتردد الذي نستعمله يتولد في <b>العضو الثابت</b>.</p>`}
   ]},

  {st:4,short:'العضو الثابت',title:'العضو الثابت',ref:'ص 93',
   q:'العضو الثابت للمولد التزامني… هل هو جزء جديد علينا، أم رأيناه من قبل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="علبة أطراف فيها ستة أطراف، وتحتها طريقتا التوصيل نجمة ودلتا" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="علبة الأطراف: يخرج إليها ستة أطراف من العضو الثابت (ثلاثة ملفات، لكل ملف طرفان)."><rect x="88" y="38" width="184" height="92" rx="12" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/></g>
<g data-tip="طرفا ملف الوجه الأول (اللون البرتقالي)."><circle cx="130" cy="66" r="11" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="130" cy="104" r="11" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="طرفا ملف الوجه الثاني (اللون الأصفر)."><circle cx="180" cy="66" r="11" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="104" r="11" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="طرفا ملف الوجه الثالث (اللون الفيروزي)."><circle cx="230" cy="66" r="11" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="230" cy="104" r="11" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="توصيل نجمة: تُجمع نهايات الملفات الثلاثة في نقطة واحدة (نقطة التعادل)، وتخرج بدايتها إلى الخطوط."><line x1="110" y1="214" x2="110" y2="166" stroke="#E8735A" stroke-width="7" stroke-linecap="round"/><line x1="110" y1="214" x2="151.6" y2="238" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><line x1="110" y1="214" x2="68.4" y2="238" stroke="#4FB3A9" stroke-width="7" stroke-linecap="round"/><circle cx="110" cy="214" r="6" fill="#2C4A40"/><rect x="60" y="158" width="100" height="90" fill="transparent"/></g>
<g data-tip="توصيل دلتا: تُوصل نهاية كل ملف ببداية الملف التالي فتتكون حلقة على شكل مثلث."><line x1="250" y1="166" x2="291.6" y2="238" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><line x1="291.6" y1="238" x2="208.4" y2="238" stroke="#4FB3A9" stroke-width="7" stroke-linecap="round"/><line x1="208.4" y1="238" x2="250" y2="166" stroke="#E8735A" stroke-width="7" stroke-linecap="round"/><circle cx="250" cy="166" r="5" fill="#2C4A40"/><circle cx="291.6" cy="238" r="5" fill="#2C4A40"/><circle cx="208.4" cy="238" r="5" fill="#2C4A40"/></g>
<text x="110" y="270" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">نجمة</text><text x="250" y="270" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">دلتا</text>
<text x="180" y="150" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ستة أطراف… طريقتان للتوصيل</text></svg>`,
   cap:'كل لون = ملف وجه واحد وطرفاه. الأطراف الستة تُوصل نجمة أو دلتا.<br><b>مرّر المؤشر على الأطراف والتوصيلتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>العضو الثابت يكون مشابهاً تماماً للعضو الثابت في المحرك الحثي ثلاثي الأوجه من حيث التركيب وطريقة اللف، بحيث يخرج في النهاية <b>ستة أطراف</b> يمكن توصيلها على شكل <b>نجمة أو دلتا</b>. للتفاصيل يراجع تركيب العضو الثابت للمحرك الحثي ثلاثي الأوجه في الوحدة الأولى.</p>`,ref:'ص 93'}
   ],
   body:[
    {predict:{q:'كم طرفاً يخرج من العضو الثابت للمولد التزامني ثلاثي الأوجه؟',opts:[
     ['ثلاثة أطراف',false,'ثلاثة هي عدد الخطوط بعد التوصيل، أما الملفات نفسها فلكل ملف طرفان.'],
     ['ستة أطراف',true,'ثلاثة ملفات × طرفان = ستة أطراف، ثم توصل نجمة أو دلتا (ص 93).'],
     ['طرفان فقط',false,'الطرفان لملفات المجال على العضو الدوار، لا للعضو الثابت.']]}},
    {tip:String.raw`<p>ما تعلمته عن العضو الثابت للمحرك الحثي في الوحدة الأولى (القلب من رقائق حديد، المجاري، الملفات الثلاثة المتباعدة) يصلح هنا كما هو. الفرق في <b>الدور</b> فقط: في المحرك يأخذ الكهرباء من المصدر، وفي المولد يعطي الكهرباء للحمل.</p>`},
    {watch:String.raw`<p>نوع التوصيل يغيّر حساباتك لاحقاً: في توصيل <b>دلتا</b> جهد الوجه = جهد الخط، وفي <b>نجمة</b> تيار الوجه = تيار الخط. ستستعمل ذلك في مثالي الكتاب (3-1) و(3-2).</p>`}
   ]},

  {st:5,short:'العضو الدوار',title:'العضو الدوار: أقطاب بارزة أم إسطواني؟',ref:'ص 93–95',
   q:'مولد في سد مائي يدور ببطء، ومولد في محطة بخارية يدور بسرعة كبيرة… هل يصلح لهما العضو الدوار نفسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نوعا العضو الدوار: ذو أقطاب بارزة بستة أقطاب، وإسطواني بقطبين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/>
<g data-tip="عضو دوار ذو أقطاب بارزة ⟦Salient Pole Rotor⟧: أقطاب تبرز من المحور، على كل قطب ملف واحد. للسرعات المنخفضة (عادةً أقل من ⟦1000⟧ لفة في الدقيقة) مثل الآلات المركبة على مساقط المياه.">
<circle cx="255" cy="150" r="74" fill="transparent"/>
<g transform="rotate(0 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<g transform="rotate(60 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<g transform="rotate(120 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<g transform="rotate(180 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<g transform="rotate(240 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<g transform="rotate(300 255 150)"><rect x="246" y="92" width="18" height="40" fill="#2C4A40"/><rect x="232" y="82" width="46" height="12" rx="4" fill="#2C4A40"/><rect x="236" y="98" width="9" height="26" rx="2" fill="#E9B949"/><rect x="265" y="98" width="9" height="26" rx="2" fill="#E9B949"/></g>
<circle cx="255" cy="150" r="26" fill="#2C4A40"/><circle cx="255" cy="150" r="9" fill="#FBF6EE"/></g>
<g data-tip="عضو دوار إسطواني ⟦Cylindrical Rotor⟧: أسطوانة ملساء، والملفات في مجارٍ على محيطها. للسرعات العالية (⟦1500⟧ أو ⟦1800⟧ أو ⟦3000⟧ أو ⟦3600⟧ لفة في الدقيقة) مع التوربينات الغازية أو البخارية.">
<circle cx="102" cy="150" r="62" fill="#2C4A40"/>
<g fill="#E9B949"><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(40 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(60 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(80 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(100 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(120 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(140 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(220 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(240 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(260 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(280 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(300 102 150)"/><rect x="96" y="88" width="12" height="13" rx="2" transform="rotate(320 102 150)"/></g>
<circle cx="102" cy="150" r="9" fill="#FBF6EE"/></g>
<g data-tip="القطبان: ⟦N⟧ قطب شمالي و⟦S⟧ قطب جنوبي. لا مجاري عند منتصف القطب، والملفات حوله تصنع المجال."><text x="102" y="112" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">N</text><text x="102" y="200" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">S</text></g>
<text x="255" y="252" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">أقطاب بارزة</text><text x="255" y="272" text-anchor="middle" font-size="12.5" fill="#2C4A40">سرعات منخفضة</text>
<text x="102" y="252" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">إسطواني</text><text x="102" y="272" text-anchor="middle" font-size="12.5" fill="#2C4A40">سرعات عالية</text></svg>`,
   cap:'يميناً: دوار بستة أقطاب بارزة كالشكلين <span class="ltr">(3-1)</span> و<span class="ltr">(3-2)</span>. يساراً: دوار إسطواني بقطبين كالشكلين <span class="ltr">(3-3)</span> و<span class="ltr">(3-4)</span>. الذهبي = ملفات المجال.<br><b>مرّر المؤشر على كل دوار (أو المسه في الجوال) لتعرف استخدامه وسرعاته.</b>',
   side:[
    {book:String.raw`<ul><li>العضو الدوار يحمل ملفات المجال المغناطيسي ويُغذّى بتيار مستمر عن طريق <b>حلقتي انزلاق</b>.</li>
     <li>وحيث إن التيار المار في ملفات العضو الدوار تيار مستمر لذا <b>لا يلزم تصنيع العضو الدوار على شكل شرائح حديدية بل يصنع من حديد مصمت</b>، وذلك لعدم وجود تيارات دوامية في هذه الحالة.</li>
     <li>طريقة اللف مشابهة لطريقة لف أقطاب العضو الثابت في آلات التيار المستمر بحيث يحمل كل قطب ملفاً واحداً، ثم توصل ملفات الأقطاب على التوالي وفي النهاية يخرج طرفان إلى حلقتي الانزلاق لتغذية الملفات بالتيار المستمر.</li></ul>`,ref:'ص 93'}
   ],
   body:[
    {book:String.raw`<p>هناك نوعان من العضو الدوار:</p>
     <ol><li><b>عضو دوار ذو أقطاب بارزة <span class="ltr">Salient Pole Rotor</span>:</b> يستخدم مع الآلات التزامنية ذات السرعات المنخفضة مثل الآلات المركبة على مساقط المياه، وذلك لأن سرعتها عادةً تقل عن <b>1000 لفة لكل دقيقة</b>. انظر الشكل (3-1) والشكل (3-2).</li>
     <li><b>عضو دوار إسطواني <span class="ltr">Cylindrical Rotor</span>:</b> يستخدم في الآلات التزامنية ذات السرعات العالية التي تدار بواسطة توربينات غازية أو بخارية، حيث تكون السرعة إما <b>1500 أو 1800 أو 3000 أو 3600 لفة لكل دقيقة</b> حسب التردد المطلوب وعدد الأقطاب. ويلاحظ أنه <b>يجب أن يكون عدد أقطاب العضو الدوار مساوياً لعدد الأقطاب في العضو الثابت</b>. انظر الشكل (3-3) والشكل (3-4).</li></ol>`,ref:'ص 93–95'},
    {predict:{q:'مولد تديره توربينة بخارية بسرعة <span class="ltr">3000</span> لفة في الدقيقة. أيّ عضو دوار يناسبه؟',opts:[
     ['عضو دوار ذو أقطاب بارزة',false,'الأقطاب البارزة للسرعات المنخفضة (عادةً أقل من 1000 لفة في الدقيقة) مثل مساقط المياه.'],
     ['عضو دوار إسطواني',true,'السرعة 3000 من السرعات العالية التي ذكرها الكتاب للدوار الإسطواني مع التوربينات الغازية أو البخارية.'],
     ['أيّ نوع منهما، فلا فرق',false,'الكتاب يربط كل نوع بمجال سرعات محدد.']]}},
    {tip:String.raw`<p>لماذا حديد مصمت؟ التيارات الدوامية تنشأ عندما يتغير الفيض في الحديد. تيار المجال مستمر والدوار يدور مع مجاله نفسه، فالفيض داخل الدوار لا يتغير، ولا حاجة إلى الرقائق المعزولة التي نستعملها في القلوب ذات الفيض المتغير.</p>`,title:'الحديد المصمت'},
    {add:String.raw`<p>لماذا الأقطاب البارزة مع البطء؟ لكي يعطي المولد البطيء التردد المطلوب يحتاج أقطاباً كثيرة (ستعرف السبب من المعادلة <span class="ltr">(3-1)</span> في المحطة القادمة)، والأقطاب البارزة يسهل تركيب عدد كبير منها على محيط واسع. أما الدوار الإسطواني فأملس ومتين ويتحمل قوة الطرد المركزية عند السرعات العالية، ويكون عادةً بقطبين أو أربعة.</p>`,title:'لماذا هذا لهذا؟'},
    {watch:String.raw`<p>عدد أقطاب العضو الدوار <b>يجب</b> أن يساوي عدد الأقطاب في العضو الثابت (ص 95). لا يمكن أن تركّب دواراً بستة أقطاب داخل عضو ثابت ملفوف لأربعة أقطاب.</p>`}
   ]},

  {st:6,short:'كيف يولّد؟',title:'كيفية عمل المولد التزامني',ref:'ص 95–96',
   q:'نُدير الدوار ونغذّي ملفاته بتيار مستمر… فكيف يخرج من العضو الثابت جهد متردد ثلاثي الأوجه؟ وما الذي يحدد تردده وقيمته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك الأولي يدير المولد، والمولد يعطي ثلاث موجات جهد بين كل موجة والتي تليها مئة وعشرون درجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="المحرك الأولي: وسيلة تدير العضو الدوار، مثل محرك ديزل أو توربينة غازية أو بخارية أو مائية أو محرك تيار مستمر."><rect x="36" y="58" width="104" height="60" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="88" y="84" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المحرك</text><text x="88" y="102" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الأولي</text></g>
<g data-tip="عمود الإدارة: يدير العضو الدوار بالسرعة التزامنية ⟦n⟧."><rect x="140" y="82" width="58" height="12" fill="#2C4A40"/><path d="M162 72 a12 12 0 1 1 0 32" fill="none" stroke="#2C4A40" stroke-width="2"/><polygon points="160,100 168,108 156,110" fill="#2C4A40"/></g>
<g data-tip="المولد التزامني: الدوار (ملفات المجال بتيار مستمر) يدور، فيدور معه مجاله ويقطع ملفات العضو الثابت فيتولد فيها جهد متردد بالحث."><circle cx="244" cy="88" r="46" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="244" cy="88" r="26" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><text x="244" y="94" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">G</text></g>
<g data-tip="تيار المجال ⟦IF⟧: تيار مستمر يدخل ملفات الدوار. زيادته تقوّي المجال فيزيد الجهد، وهو الطريقة الوحيدة للتحكم في الجهد."><path d="M244 42V26H300" stroke="#2C4A40" stroke-width="2.5" fill="none"/><rect x="292" y="16" width="34" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="309" y="31" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">=</text></g>
<path d="M244 134V178" stroke="#2C4A40" stroke-width="2.5"/><polygon points="244,186 237,174 251,174" fill="#2C4A40"/>
<g data-tip="الوجه الأول من القوة الدافعة الكهربائية المتولدة في المنتج."><path d="M46 232 L52 225 L57 219 L63 214 L68 209 L74 207 L80 206 L85 207 L91 209 L96 214 L102 219 L107 225 L113 232 L119 239 L124 245 L130 250 L135 255 L141 257 L146 258 L152 257 L158 255 L163 250 L169 245 L174 239 L180 232 L186 225 L191 219 L197 214 L202 209 L208 207 L214 206 L219 207 L225 209 L230 214 L236 219 L241 225 L247 232 L253 239 L258 245 L264 250 L269 255 L275 257 L280 258 L286 257 L292 255 L297 250 L303 245 L308 239 L314 232" fill="none" stroke="transparent" stroke-width="14"/><path d="M46 232 L52 225 L57 219 L63 214 L68 209 L74 207 L80 206 L85 207 L91 209 L96 214 L102 219 L107 225 L113 232 L119 239 L124 245 L130 250 L135 255 L141 257 L146 258 L152 257 L158 255 L163 250 L169 245 L174 239 L180 232 L186 225 L191 219 L197 214 L202 209 L208 207 L214 206 L219 207 L225 209 L230 214 L236 219 L241 225 L247 232 L253 239 L258 245 L264 250 L269 255 L275 257 L280 258 L286 257 L292 255 L297 250 L303 245 L308 239 L314 232" fill="none" stroke="#E8735A" stroke-width="3"/></g>
<g data-tip="الوجه الثاني: متأخر عن الأول ⟦120°⟧ لأن ملفاته مزاحة ⟦120°⟧ في العضو الثابت."><path d="M46 255 L52 257 L57 258 L63 257 L68 255 L74 250 L80 245 L85 239 L91 232 L96 225 L102 219 L107 214 L113 209 L119 207 L124 206 L130 207 L135 209 L141 214 L146 219 L152 225 L158 232 L163 239 L169 245 L174 250 L180 255 L186 257 L191 258 L197 257 L202 255 L208 250 L214 245 L219 239 L225 232 L230 225 L236 219 L241 214 L247 209 L253 207 L258 206 L264 207 L269 209 L275 214 L280 219 L286 225 L292 232 L297 239 L303 245 L308 250 L314 255" fill="none" stroke="transparent" stroke-width="14"/><path d="M46 255 L52 257 L57 258 L63 257 L68 255 L74 250 L80 245 L85 239 L91 232 L96 225 L102 219 L107 214 L113 209 L119 207 L124 206 L130 207 L135 209 L141 214 L146 219 L152 225 L158 232 L163 239 L169 245 L174 250 L180 255 L186 257 L191 258 L197 257 L202 255 L208 250 L214 245 L219 239 L225 232 L230 225 L236 219 L241 214 L247 209 L253 207 L258 206 L264 207 L269 209 L275 214 L280 219 L286 225 L292 232 L297 239 L303 245 L308 250 L314 255" fill="none" stroke="#C99A1E" stroke-width="3"/></g>
<g data-tip="الوجه الثالث: متأخر عن الثاني ⟦120°⟧ أخرى."><path d="M46 209 L52 214 L57 219 L63 225 L68 232 L74 239 L80 245 L85 250 L91 255 L96 257 L102 258 L107 257 L113 255 L119 250 L124 245 L130 239 L135 232 L141 225 L146 219 L152 214 L158 209 L163 207 L169 206 L174 207 L180 209 L186 214 L191 219 L197 225 L202 232 L208 239 L214 245 L219 250 L225 255 L230 257 L236 258 L241 257 L247 255 L253 250 L258 245 L264 239 L269 232 L275 225 L280 219 L286 214 L292 209 L297 207 L303 206 L308 207 L314 209" fill="none" stroke="transparent" stroke-width="14"/><path d="M46 209 L52 214 L57 219 L63 225 L68 232 L74 239 L80 245 L85 250 L91 255 L96 257 L102 258 L107 257 L113 255 L119 250 L124 245 L130 239 L135 232 L141 225 L146 219 L152 214 L158 209 L163 207 L169 206 L174 207 L180 209 L186 214 L191 219 L197 225 L202 232 L208 239 L214 245 L219 250 L225 255 L230 257 L236 258 L241 257 L247 255 L253 250 L258 245 L264 239 L269 232 L275 225 L280 219 L286 214 L292 209 L297 207 L303 206 L308 207 L314 209" fill="none" stroke="#2E8C83" stroke-width="3"/></g>
<path d="M80 196H124" stroke="#2C4A40" stroke-width="1.5"/><path d="M80 191V201M124 191V201" stroke="#2C4A40" stroke-width="1.5"/><text x="102" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">120°</text>
<text x="180" y="294" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثلاثة أوجه متساوية ومتباعدة</text></svg>`,
   cap:'المحرك الأولي يدير الدوار، وتيار المجال المستمر يصنع المجال، فتخرج من العضو الثابت ثلاث موجات متباعدة <span class="ltr">120°</span>.<br><b>مرّر المؤشر على أجزاء الرسمة والموجات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يتم تدوير العضو الدوار للآلة التزامنية بواسطة وسيلة مناسبة (محرك ديزل أو توربينة غازية أو بخارية مائية أو محرك تيار مستمر)، وعندما تصل سرعته إلى السرعة التزامنية يتم تغذية ملفات العضو الدوار من مصدر جهد مستمر، وبالتالي ينتج في الثغرة الهوائية مجال مغناطيسي دوار يدور بنفس سرعة العضو الدوار (السرعة التزامنية) ولذلك سميت هذه الآلة بالآلة التزامنية.</p>
     <p>هذا المجال المغناطيسي الدوار سيقطع ملفات العضو الثابت ويولد فيها قوة دافعة كهربائية متناوبة طبقاً لمبدأ الحث الكهرومغناطيسي.</p>`,ref:'ص 95'}
   ],
   body:[
    {book:String.raw`<p>القوة الدافعة الكهربائية المتولدة في المنتج (العضو الثابت) ستكون قوة دافعة كهربائية ثلاثية الأوجه بين كل وجه وآخر <b>120°</b>، وذلك لأن العضو الثابت يحمل ثلاثة ملفات بين كل ملف وآخر زاوية قدرها 120°.</p>
     <p>تعتمد قيمة القوة الدافعة الكهربائية على <b>شدة المجال المغناطيسي وسرعة العضو الدوار</b>، وحيث أن سرعة العضو الدوار يجب أن تكون ثابتة للحصول على تردد ثابت، لذا فإن <b>الخيار الوحيد للتحكم بمقدار القوة الدافعة الكهربائية هو التحكم في شدة المجال المغناطيسي وذلك بتغيير قيمة التيار المستمر الداخل إلى ملفات العضو الدوار</b>.</p>
     <p>أما تردد القوة الدافعة الكهربائية المتولدة في المنتج فيعتمد على سرعة العضو الدوار وعدد الأقطاب ويحسب من المعادلة:</p>
     <div class="eq">$$f=\frac{n\times p}{120}$$<span class="eqno">(3-1)</span></div>
     <p>وتحسب القوة الدافعة الكهربائية المتولدة في ملفات المنتج لكل وجه من المعادلة:</p>
     <div class="eq">$$E_{ph}=\sqrt{2}\times\pi\times f\times\phi\times T_{ph}\times k_W$$<span class="eqno">(3-2)</span></div>
     <p>حيث: \(f\) التردد، \(\phi\) شدة الفيض المغناطيسي، \(T_{ph}\) عدد اللفات في كل وجه، \(k_W\) معامل اللف (أصغر من 1).</p>`,ref:'ص 96'},
    {watch:String.raw`<p>المعادلة <span class="ltr">(3-1)</span> في الكتاب لا تعرّف الرمزين: من السياق \(n\) سرعة العضو الدوار بالدورة في الدقيقة <span class="ltr">(rpm)</span> و\(p\) <b>عدد الأقطاب</b> (وليس أزواج الأقطاب). والأمثلة تكتب الحرف كبيراً \(P\) وهو الرمز نفسه. ومعامل اللف مطبوع «(1 &gt;)» ويقصد به «أصغر من 1».</p>`,fix:true},
    {title:'احسب التردد من السرعة وعدد الأقطاب',widget:(el,B)=>{
      let p=4,n=1800;
      const fm=(x,d)=>B.fmtN(x,d);
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر عدد الأقطاب وحرّك السرعة، وشاهد التردد من المعادلة <span class="ltr">(3-1)</span>.</p>
       <div class="w-row" style="margin-top:0"><span class="w-l">عدد الأقطاب <span class="ltr">p</span></span><span class="mseg">${[2,4,6,8,12].map(v=>`<button type="button" data-v="${v}" aria-pressed="${v===p}">${v}</button>`).join('')}</span></div>
       <label class="w-sl"><span>سرعة العضو الدوار <span class="ltr">n = <b data-o="n"></b> rpm</span></span><input type="range" min="0" max="3600" step="10" dir="ltr" value="${n}"></label>
       <div class="w-row"><span class="w-l">من أمثلة الكتاب:</span><button class="btn" type="button" data-ex="4,1800">مثال <span class="ltr">(3-1)</span> أ: <span class="ltr">4</span> أقطاب</button><button class="btn" type="button" data-ex="6,1200">مثال <span class="ltr">(3-2)</span> أ: <span class="ltr">6</span> أقطاب</button></div>
       <div class="w-facts"><div><span>التردد <bdi dir="ltr">f</bdi></span><b data-o="f"></b></div><div><span>السرعة اللازمة لـ <bdi dir="ltr">60 Hz</bdi></span><b data-o="n60"></b></div><div><span>السرعة اللازمة لـ <bdi dir="ltr">50 Hz</bdi></span><b data-o="n50"></b></div><div><span>الدوار المناسب لهذه السرعة</span><b data-o="t" style="font-family:var(--font);direction:rtl;text-align:start;font-size:14px"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const f=n*p/120;
        o('n').textContent=n;o('f').textContent=fm(f,2)+' Hz';o('n60').textContent=fm(7200/p,0)+' rpm';o('n50').textContent=fm(6000/p,0)+' rpm';
        o('t').textContent=n===0?'الدوار واقف':n<1000?'أقطاب بارزة (أقل من 1000)':[1500,1800,3000,3600].includes(n)?'إسطواني (سرعة عالية)':'—';
        el.querySelectorAll('.mseg button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===p))};
      el.querySelectorAll('.mseg button').forEach(b=>b.onclick=()=>{p=+b.dataset.v;draw()});
      el.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{const v=b.dataset.ex.split(',');p=+v[0];n=+v[1];rg.value=n;draw()});
      rg.oninput=()=>{n=+rg.value;draw()};
      draw();
    }},
    {predict:{q:'تريد رفع جهد المولد دون أن يتغير تردده. ماذا تغيّر؟',opts:[
     ['تزيد سرعة دوران المحرك الأولي',false,'الجهد يرتفع فعلاً، لكن التردد يرتفع معه حسب <span class="ltr">(3-1)</span>، والسرعة يجب أن تبقى ثابتة لثبات التردد.'],
     ['تزيد عدد الأقطاب',false,'عدد الأقطاب ثابت في الآلة المصنوعة، ولو تغير لتغير التردد.'],
     ['تزيد التيار المستمر الداخل إلى ملفات العضو الدوار',true,String.raw`يقوى المجال فيزيد الفيض \(\phi\) في <span class="ltr">(3-2)</span> فيرتفع الجهد، والسرعة والتردد كما هما. هذا «الخيار الوحيد» في الكتاب (ص 96).`]]}},
    {tip:String.raw`<p>\(\sqrt2\times\pi\approx4.44\)، لذلك تجد المعادلة <span class="ltr">(3-2)</span> في كتب أخرى بالصورة \(E=4.44\,f\phi T k_W\). ومن <span class="ltr">(3-1)</span> نحسب السرعة اللازمة لتردد معين: \(n=120f/p\)؛ كلما زاد عدد الأقطاب قلّت السرعة المطلوبة، ولهذا تكثر الأقطاب في الدوار البارز البطيء.</p>`}
   ]},

  {recap:[
   String.raw`المنتج (ملفات إنتاج الكهرباء) على العضو الثابت ويخرج منه ستة أطراف توصل نجمة أو دلتا، وملفات المجال على العضو الدوار وتُغذّى بتيار مستمر عبر حلقتي انزلاق (ص 92–93).`,
   String.raw`الدوار ذو الأقطاب البارزة للسرعات المنخفضة (عادةً أقل من 1000 لفة في الدقيقة)، والإسطواني للسرعات العالية (1500 أو 1800 أو 3000 أو 3600)، وعدد أقطاب الدوار يساوي عدد أقطاب الثابت.`,
   String.raw`التردد، المعادلة (3-1): \(f=\dfrac{n\times p}{120}\)`,
   String.raw`الجهد لكل وجه، المعادلة (3-2): \(E_{ph}=\sqrt2\,\pi f\phi T_{ph}k_W\)، والتحكم فيه يكون بتيار المجال المستمر فقط لأن السرعة ثابتة.`]}
],
 theory:[
  {h:'الهدف العام والأهداف التفصيلية',ref:'ص 91',html:`<p><b>الهدف العام للوحدة:</b> الإلمام الشامل بتركيب وأساسيات تشغيل وأداء المولدات التزامنية ثلاثية الأوجه.</p><p><b>الأهداف التفصيلية:</b></p><ol>
   <li>أن يلم المتدرب بأنواع وتركيب الآلات التزامنية.</li><li>أن يلم المتدرب بنظرية عمل المولدات التزامنية.</li><li>أن يلم المتدرب بكيفية ضبط جهد وتردد المولدات التزامنية.</li><li>أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المولدات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من إجراء الاختبارات الروتينية على المولدات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من تحديد عناصر الدائرة المكافئة للمولدات التزامنية.</li><li>أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمولدات التزامنية.</li><li>أن يتمكن المتدرب من حساب معامل تنظيم الجهد للمولدات التزامنية.</li><li>أن يتمكن المتدرب من إجراء عملية ربط للمولد التزامني على الشبكة العامة.</li><li>أن يتمكن المتدرب من استنتاج وفهم المنحنيات المميزة لهذه المولدات.</li><li>أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المولدات.</li></ol>
   <p class="sub">الوحدة في الكتاب فصلان: الفصل الأول «التركيب ونظرية العمل والدائرة المكافئة ومنحنيات الخواص» (ص 92–106)، والفصل الثاني «مخطط توزيع القدرة – التشغيل على التوازي» (ص 107–123).</p>`},
  {h:'تمهيد',ref:'ص 92',html:`<p>«أكثر من <b>98%</b> من الطاقة الكهربائية المنتجة في العالم يتم توليدها باستخدام الآلة التزامنية»، فهي الأكثر استخداماً لتحويل الطاقة الميكانيكية إلى كهربائية. والآلة التزامنية كما تستخدم كمولد تزامني تستخدم أيضاً كمحرك تزامني (الوحدة القادمة).</p>
   <p>اكتسبت تسمية <b>(التزامنية)</b> «بسبب التزامن أو التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار، ولذلك تسمى بالآلة التزامنية أو التوافقية».</p>`},
  {h:'تركيب الآلة التزامنية ثلاثية الأوجه',ref:'ص 92',html:`<p>تتكون الآلة التزامنية <span class="ltr">Synchronous Machine</span> من عضوين رئيسين: عضو ثابت وعضو دوار؛ أحدهما يحمل ملفات إنتاج الطاقة الكهربائية ويسمى <b>المنتج <span class="ltr">Armature</span></b>، والآخر يحمل ملفات المجال المغناطيسي. ويُفضَّل أن تكون ملفات إنتاج الطاقة (المنتج) على <b>العضو الثابت</b> وملفات المجال على <b>العضو الدوار</b> لعدة أسباب أهمها:</p>
   <ol><li>التيار المسحوب من الآلة كبير لذا يفضل أن يؤخذ مباشرةً وليس عن طريق حلقات انزلاق.</li><li>التخلص من حلقات الانزلاق أو تقليلها إلى (2) بدلاً من (6) حلقات.</li><li>سهولة تبريد ملفات إنتاج الطاقة الكهربائية عندما تكون ثابتة.</li><li>حماية ملفات إنتاج الطاقة الكهربائية من قوة الطرد المركزية بسبب وزنها الكبير.</li></ol>
   <p>«لذا فإننا في دراستنا لهذه الآلة سيكون العضو الثابت حاملاً لملفات إنتاج الطاقة الكهربائية بينما يكون العضو الدوار حاملاً لملفات المجال المغناطيسي».</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا 6 حلقات مقابل 2؟ لو كان المنتج يدور لاحتجنا ستة أطراف (ثلاثة ملفات × طرفين) تخرج عبر حلقات انزلاق ويمر فيها تيار الحمل الكبير. أما ملفات المجال فتحتاج طرفين فقط (موجب وسالب) وتيارها صغير نسبياً.'},
  {h:'العضو الثابت',ref:'ص 93',html:`<p>العضو الثابت «يكون مشابهاً تماماً للعضو الثابت في المحرك الحثي ثلاثي الأوجه من حيث التركيب وطريقة اللف، بحيث يخرج في النهاية <b>ستة أطراف</b> يمكن توصيلها على شكل <b>نجمة أو دلتا</b>». للتفاصيل يراجع تركيب العضو الثابت للمحرك الحثي ثلاثي الأوجه في الوحدة الأولى.</p>`},
  {h:'العضو الدوار',ref:'ص 93–95',html:`<ul><li>العضو الدوار يحمل ملفات المجال المغناطيسي و<b>يُغذّى بتيار مستمر عن طريق حلقتي انزلاق</b>.</li>
   <li>وحيث إن التيار المار في ملفاته تيار مستمر «<b>لا يلزم تصنيع العضو الدوار على شكل شرائح حديدية بل يصنع من حديد مصمت</b>، وذلك لعدم وجود تيارات دوامية في هذه الحالة».</li>
   <li>طريقة اللف مشابهة لطريقة لف أقطاب العضو الثابت في آلات التيار المستمر: كل قطب يحمل ملفاً واحداً، ثم توصل ملفات الأقطاب على التوالي ويخرج طرفان إلى حلقتي الانزلاق.</li></ul>
   <p>هناك نوعان من العضو الدوار:</p>
   <ol><li><b>عضو دوار ذو أقطاب بارزة <span class="ltr">Salient Pole Rotor</span>:</b> يستخدم مع الآلات ذات <b>السرعات المنخفضة</b> مثل الآلات المركبة على مساقط المياه، لأن سرعتها عادةً <b>تقل عن 1000 لفة لكل دقيقة</b>. انظر الشكلين (3-1) و(3-2).</li>
   <li><b>عضو دوار إسطواني <span class="ltr">Cylindrical Rotor</span>:</b> يستخدم في الآلات ذات <b>السرعات العالية</b> التي تدار بتوربينات غازية أو بخارية، حيث تكون السرعة إما <span class="ltr">1500</span> أو <span class="ltr">1800</span> أو <span class="ltr">3000</span> أو <span class="ltr">3600</span> لفة لكل دقيقة حسب التردد المطلوب وعدد الأقطاب. ويلاحظ أنه «<b>يجب أن يكون عدد أقطاب العضو الدوار مساوياً لعدد الأقطاب في العضو الثابت</b>». انظر الشكلين (3-3) و(3-4).</li></ol>`},
  {fig:'(3-1)',ref:'ص 93',caption:'آلة تزامنية ذات عضو دوار ذو أقطاب بارزة: ستة أقطاب متناوبة (N وS) على كل منها ملف، والخطوط الزرقاء المتقطعة مسارات الفيض من القطب عبر الثغرة الهوائية إلى العضو الثابت ثم إلى القطب المجاور (أُعيد رسمه)',draw:()=>svgbox(machineFig('sal'),600)},
  {fig:'(3-2)',ref:'ص 94',caption:'عضو دوار ذو أقطاب بارزة: ستة أقطاب يلتف على كل منها ملف نحاسي (رسم مبسط يقابل الصورة المطبوعة)',draw:()=>svgbox(fig32SVG(),300)},
  {fig:'(3-3)',ref:'ص 94',caption:'آلة تزامنية ذات عضو دوار اسطواني: دوار أملس بمجارٍ على محيطه فيها الملفات (⊙ في نصف و⊗ في النصف الآخر) وقطبان N في الأعلى وS في الأسفل (أُعيد رسمه)',draw:()=>svgbox(machineFig('cyl'),600)},
  {fig:'(3-4)',ref:'ص 95',caption:'عضو دوار اسطواني لمولد توربيني: ملفات النحاس في المجاري ونهايات اللف، بتسميات الكتاب الإنجليزية (رسم مبسط يقابل الصورة المطبوعة)',draw:()=>svgbox(fig34SVG(),620)},
  {h:'كيفية عمل المولد التزامني',ref:'ص 95–96',html:`<ul><li>يُدار العضو الدوار بوسيلة مناسبة (محرك ديزل أو توربينة غازية أو بخارية أو مائية أو محرك تيار مستمر)، و<b>عندما تصل سرعته إلى السرعة التزامنية</b> تُغذّى ملفاته من مصدر جهد مستمر، فينتج في الثغرة الهوائية <b>مجال مغناطيسي دوار يدور بنفس سرعة العضو الدوار</b> (السرعة التزامنية) ولذلك سميت بالآلة التزامنية.</li>
   <li>هذا المجال الدوار يقطع ملفات العضو الثابت ويولد فيها قوة دافعة كهربائية متناوبة طبقاً لمبدأ الحث الكهرومغناطيسي.</li>
   <li>القوة الدافعة المتولدة في المنتج <b>ثلاثية الأوجه بين كل وجه وآخر 120°</b>، لأن العضو الثابت يحمل ثلاثة ملفات بين كل ملف وآخر زاوية قدرها 120°.</li>
   <li>تعتمد قيمة القوة الدافعة على <b>شدة المجال المغناطيسي وسرعة العضو الدوار</b>، وحيث إن السرعة يجب أن تكون ثابتة للحصول على تردد ثابت «فإن <b>الخيار الوحيد</b> للتحكم بمقدار القوة الدافعة الكهربائية هو التحكم في شدة المجال المغناطيسي وذلك <b>بتغيير قيمة التيار المستمر الداخل إلى ملفات العضو الدوار</b>».</li>
   <li>أما التردد فيعتمد على سرعة العضو الدوار وعدد الأقطاب:</li></ul>
   $$f=\\frac{n\\times p}{120}\\qquad(3\\text{-}1)$$
   <p>وتحسب القوة الدافعة الكهربائية المتولدة في ملفات المنتج لكل وجه من المعادلة:</p>
   $$E_{ph}=\\sqrt{2}\\times\\pi\\times f\\times\\phi\\times T_{ph}\\times k_W\\qquad(3\\text{-}2)$$
   <p>حيث: \\(f\\) التردد، \\(\\phi\\) شدة الفيض المغناطيسي، \\(T_{ph}\\) عدد اللفات في كل وجه، \\(k_W\\) معامل اللف (أصغر من 1).</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'المعادلة (3-1) ص 96 لا تعرّف الرمزين: من السياق \\(n\\) سرعة العضو الدوار بالدورة في الدقيقة <span class="ltr">(rpm)</span> و\\(p\\) عدد الأقطاب (وليس أزواج الأقطاب). وتكتب الحرف صغيراً \\(p\\) بينما تكتبه الأمثلة كبيراً \\(P\\). ومعامل اللف مطبوع «(1 &gt;)» ويقصد به «أصغر من 1».'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> \\(\\sqrt2\\times\\pi\\approx4.44\\)، لذلك تجد المعادلة (3-2) في كتب أخرى بالصورة \\(E=4.44\\,f\\phi T k_W\\). ومن (3-1) نحسب السرعة اللازمة لتردد معين: \\(n=120f/p\\)؛ فمولد بقطبين يعطي <span class="ltr">60 Hz</span> عند <span class="ltr">3600 rpm</span>، وبأربعة أقطاب عند <span class="ltr">1800 rpm</span>، وبستة أقطاب عند <span class="ltr">1200 rpm</span>. كلما زاد عدد الأقطاب قلت السرعة المطلوبة، ولهذا تكثر الأقطاب في الدوار البارز البطيء.'},
  {note:'في تبويب «المختبر» تدير مولداً بنفسك وتختار نوع الدوار وعدد الأقطاب والسرعة وتيار المجال، وترى موجات الجهد الثلاث. وفي «الأمثلة المحلولة» حاسبة المعادلة (3-1) بأرقام مثالي الكتاب.'}
 ],
 lab:(el)=>{
  let type='sal',P=6,n=1200,If=4.5,ang=0,lastS='';
  let TP=null;const TK=()=>TP.v.TK;               // T_ph·k_W  (رقم توضيحي — قيم المدرب)
  const phi=I=>occ(I)/(SQ2*PI*60*100);             // Wb — flux per field current from the O.C.C of الشكل (3-19) at the default T_ph·k_W = 100; E then scales with T_ph·k_W
  el.innerHTML=`<div id="l1tp"></div><div class="grid">
   <div class="panel c6"><h2>المولد التزامني <small>مبنية على الشكلين (3-1) و(3-3) ص 93–94</small></h2>
    <div class="sg-row">${segHTML('ty',[['sal','دوار ذو أقطاب بارزة'],['cyl','دوار إسطواني']],type)}</div>
    <div class="sg-row"><span>عدد الأقطاب p:</span><span id="l1pp"></span></div>
    <div id="l1svg" class="svgbox" style="max-width:380px;margin-inline:auto"></div>
    <p class="sub" style="text-align:center">الدوران مُبطّأ 60 مرة للرؤية. الخطوط الزرقاء المتقطعة = الفيض، يدور مع الدوار.</p></div>
   <div class="panel c6"><h2>التحكم والقراءات</h2>
    ${sl('l1n','سرعة العضو الدوار <span class="ltr">n</span>',0,3600,10,n)}
    <div class="sg-row"><button class="btn" data-dn="-10">−10</button><button class="btn" data-dn="-1">−1</button><button class="btn" data-dn="1">+1</button><button class="btn" data-dn="10">+10</button></div>
    ${sl('l1f','تيار المجال (التيار المستمر في ملفات الدوار) <span class="ltr">I<sub>F</sub></span>',0,10,0.1,If)}
    <div class="sg-row"><button class="btn primary" id="l1e1">مثال (3-1) أ: 4 أقطاب و 60 Hz</button><button class="btn primary" id="l1e2">مثال (3-2) أ: 6 أقطاب و 60 Hz</button></div>
    <div class="facts">${fact('التردد <bdi dir="ltr">f = n·p/120</bdi>','l1fr')}${fact('الفيض لكل قطب φ','l1ph')}${fact('<bdi dir="ltr">E<sub>ph</sub></bdi> (فعّال) من (3-2)','l1e')}${fact('السرعة اللازمة لـ 60 Hz','l1n60')}</div>
    <div id="l1msg" class="sg-msg"></div></div>
   <div class="panel c12"><h2>القوة الدافعة الكهربائية في الأوجه الثلاثة <small>آخر 50 ms (الموجات تتحرك مُبطّأة مع الدوار)</small></h2><div class="sg-chart"><canvas id="l1w"></canvas></div>
    ${legend([['--stop','الوجه a'],['--live','الوجه b'],['--blue','الوجه c']])}
    <p class="sub">\\(T_{ph}k_W\\) = <span class="ltr" id="l1tk"></span> والفيض \\(\\phi\\) مقابل تيار المجال <b>أرقام توضيحية</b> (إلا إذا وضع المدرب قيمته)، والفيض مأخوذ من منحنى اللاحمل لمثال (3-1) (الشكل 3-19 ص 114). عدد اللفات يغيّر الجهد: إذا ضاعفت \\(T_{ph}k_W\\) تضاعف \\(E_{ph}\\) بنفس الفيض.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  TP=B.params($('#l1tp'),'u3-l1',[
   {k:'TK',label:'عدد لفات الوجه × معامل اللف T<sub>ph</sub>·k<sub>W</sub>',unit:'',value:100,min:1,max:100000}],()=>{$('#l1tk').textContent=fm(TK());lastS=''});
  $('#l1tk').textContent=fm(TK());
  const POLES={sal:[6,8,12],cyl:[2,4]};
  const drawPoles=()=>{$('#l1pp').innerHTML=segHTML('pp',POLES[type].map(v=>[v,String(v)]),P);segOn($('#l1pp'),'pp',v=>{P=+v;lastS=''})};
  segOn(el,'ty',v=>{type=v;P=POLES[type][0];drawPoles();lastS=''});drawPoles();
  const setN=v=>{n=clamp(Math.round(v),0,3600);$('#l1n').value=n};
  $('#l1n').oninput=e=>{n=+e.target.value};$('#l1f').oninput=e=>{If=+e.target.value};
  el.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>setN(n+ +b.dataset.dn));
  $('#l1e1').onclick=()=>{type='cyl';P=4;segSet(el,'ty','cyl');drawPoles();setN(1800);lastS=''};
  $('#l1e2').onclick=()=>{type='sal';P=6;segSet(el,'ty','sal');drawPoles();setN(1200);lastS=''};
  const f=()=>n*P/120;
  let movedN=0,lastN=n;
  const steps=stepsUI($('#l1st'),[
   {t:'مثال (3-2) أ',x:'اختر «دوار ذو أقطاب بارزة» بستة أقطاب، واضبط السرعة حتى يصبح التردد <span class="ltr">60 Hz</span>. السرعة اللازمة <span class="ltr">n = 120×60/6 = 1200 rpm</span>.',done:()=>type==='sal'&&P===6&&Math.abs(f()-60)<0.05},
   {t:'تردد 50 Hz',x:'بنفس الأقطاب الستة، أنقص السرعة حتى <span class="ltr">50 Hz</span> (أي <span class="ltr">1000 rpm</span>). لاحظ أن الموجات اتسعت (الدورة أطول) وأن الجهد قلّ قليلاً لأن \\(E\\propto f\\,\\phi\\).',done:()=>type==='sal'&&P===6&&Math.abs(f()-50)<0.05},
   {t:'التحكم بالجهد',x:'أعد السرعة إلى <span class="ltr">1200 rpm</span> ثم غيّر تيار المجال \\(I_F\\) إلى <span class="ltr">6 A</span> أو أكثر: يرتفع الجهد والتردد ثابت. هذا هو «الخيار الوحيد» للتحكم في الجهد (ص 96).',done:()=>Math.abs(f()-60)<0.05&&If>=6},
   {t:'لماذا لا نغيّر الجهد بالسرعة؟',x:'حرّك السرعة قليلاً: يتغير الجهد، لكن يتغير التردد معه أيضاً، والتردد يجب أن يبقى ثابتاً.',done:()=>movedN>3},
   {t:'مثال (3-1) أ',x:'اختر «دوار إسطواني» بأربعة أقطاب، واضبط <span class="ltr">60 Hz</span>: السرعة <span class="ltr">1800 rpm</span>.',done:()=>type==='cyl'&&P===4&&Math.abs(f()-60)<0.05},
   {t:'قطبان',x:'اختر قطبين واضبط <span class="ltr">50 Hz</span>: السرعة <span class="ltr">3000 rpm</span>، وهي من السرعات العالية التي ذكرها الكتاب للدوار الإسطواني.',done:()=>type==='cyl'&&P===2&&Math.abs(f()-50)<0.05}
  ]);
  loopOn(el,dt=>{if(n!==lastN){movedN++;lastN=n}
   ang=(ang+n/60*360*dt/60)%360;
   const fr=f(),Ph=phi(If),E=SQ2*PI*fr*Ph*TK();
   $('#l1n-v').textContent=n+' rpm';$('#l1f-v').textContent=fm(If,1)+' A';
   $('#l1svg').innerHTML=`<svg viewBox="0 0 360 360" role="img" aria-label="مقطع المولد">${statorSVG(180,180)}<g transform="translate(180 180) rotate(${fx(ang)})">${type==='sal'?salientRotor(P,{flux:If>0.05,ang,hot:If>0.05}):cylRotor(P,{flux:If>0.05,ang,hot:If>0.05})}</g></svg>`;
   const sg=[type,P,n,If].join();
   if(sg!==lastS){lastS=sg;
    $('#l1fr').textContent=fm(fr,2)+' Hz';$('#l1ph').textContent=fm(Ph*1000,2)+' mWb';$('#l1e').textContent=fm(E,1)+' V';$('#l1n60').textContent=fm(7200/P,0)+' rpm';
    let m='';
    const near=v=>Math.abs(fr-v)<0.05;
    if(n===0)m='<div class="callout">الدوار واقف: لا يقطع المجالُ ملفاتِ العضو الثابت فلا يتولد جهد.</div>';
    else if(If<0.05)m='<div class="callout err">تيار المجال صفر: لا يوجد مجال مغناطيسي فلا يتولد جهد رغم الدوران.</div>';
    else if(!near(50)&&!near(60))m=`<div class="callout err">التردد <span class="ltr">${fm(fr,2)} Hz</span> ليس 50 ولا 60 Hz. لتردد 60 Hz يلزم <span class="ltr">${fm(7200/P,0)} rpm</span>، ولـ 50 Hz يلزم <span class="ltr">${fm(6000/P,0)} rpm</span> (من المعادلة 3-1).</div>`;
    else m=`<div class="callout">التردد <span class="ltr">${near(50)?50:60} Hz</span> عند <span class="ltr">${n} rpm</span> و <span class="ltr">${P}</span> أقطاب.</div>`;
    if(n>0)m+=type==='sal'?(n>=1000?'<div class="callout err">الكتاب (ص 93): الدوار ذو الأقطاب البارزة للسرعات المنخفضة التي تقل عادةً عن 1000 لفة/دقيقة (مثل مساقط المياه).</div>':'<div class="callout">سرعة منخفضة تناسب الدوار ذا الأقطاب البارزة (أقل من 1000 لفة/دقيقة عادةً).</div>')
      :([1500,1800,3000,3600].includes(n)?'<div class="callout">سرعة من السرعات العالية التي ذكرها الكتاب للدوار الإسطواني: 1500 أو 1800 أو 3000 أو 3600 لفة/دقيقة.</div>':'<div class="callout err">الكتاب (ص 93): الدوار الإسطواني للسرعات العالية: 1500 أو 1800 أو 3000 أو 3600 لفة/دقيقة حسب التردد وعدد الأقطاب.</div>');
    $('#l1msg').innerHTML=m}
   // three-phase waves (scroll with the slowed rotor angle)
   const pk=SQ2*E,ymax=Math.max(200,Math.ceil(pk*1.15/200)*200),th0=ang*P/2*D,we=2*PI*fr;
   const wave=sh=>{const p=[];for(let i=0;i<=200;i++){const t=i/200*0.05;p.push([t*1000,pk*Math.sin(we*t-th0-sh)])}return p};
   plot($('#l1w'),{xmax:50,ymin:-ymax,ymax,xlabel:'t (ms)',ylabel:'e (V)',series:[{pts:wave(0),color:'--stop'},{pts:wave(2*PI/3),color:'--live'},{pts:wave(4*PI/3),color:'--blue'}]});
   steps.check()});
 },
 examples:[
  {title:'مثال (3-1) أ — سرعة العضو الدوار',ref:'ص 114',
   q:'<p>«مولد تزامني ذو أربعة أقطاب … والتردد <span class="ltr">60 Hz</span> … احسب: أ) سرعة العضو الدوار».</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'P',label:'عدد الأقطاب',sym:'P',unit:'',value:4}],
   solve:(g)=>[{t:'من المعادلة (3-1):',f:`n=\\frac{120f}{P}=\\frac{120\\times ${g.f}}{${g.P}}`,v:B.round(120*g.f/g.P,2),unit:'rpm',final:true}]},
  {title:'مثال (3-2) أ — سرعة دوران المولد',ref:'ص 117',
   q:'<p>«مولد تزامني ذو ستة أقطاب … عند تردد <span class="ltr">60 Hz</span> … احسب: أ) سرعة دوران هذا المولد».</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'P',label:'عدد الأقطاب',sym:'P',unit:'',value:6}],
   solve:(g)=>[{t:'من المعادلة (3-1):',f:`n=\\frac{120f}{P}=\\frac{120\\times ${g.f}}{${g.P}}`,v:B.round(120*g.f/g.P,2),unit:'rpm',final:true}]},
  {title:'حاسبة المعادلة (3-2) — أرقام توضيحية (ليست مثالاً من الكتاب)',ref:'ص 96',
   q:'<p>الكتاب لا يعطي مثالاً عددياً على المعادلة (3-2). هذه حاسبة للتدريب بأرقام توضيحية: احسب القوة الدافعة لكل وجه.</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'ph',label:'الفيض لكل قطب',sym:'\\phi',unit:'Wb',value:0.018},{id:'T',label:'عدد اللفات في كل وجه',sym:'T_{ph}',unit:'',value:110},{id:'k',label:'معامل اللف',sym:'k_W',unit:'',value:0.9}],
   solve:(g)=>{const E=SQ2*PI*g.f*g.ph*g.T*g.k;return [
    {t:'المعادلة (3-2):',f:'E_{ph}=\\sqrt{2}\\times\\pi\\times f\\times\\phi\\times T_{ph}\\times k_W'},
    {t:'بالتعويض:',f:`E_{ph}=\\sqrt{2}\\times\\pi\\times ${g.f}\\times ${g.ph}\\times ${g.T}\\times ${g.k}`,v:B.round(E,1),dp:1,unit:'V',final:true},
    {t:'لاحظ: مضاعفة التردد (السرعة) أو الفيض (تيار المجال) تضاعف الجهد.'}]}}
 ],
 quiz:[
  {q:'سبب تسمية الآلة «تزامنية»:',o:['التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار','لأنها تعمل على التوازي','لأنها ثلاثية الأوجه','لأن الانزلاق فيها كبير'],c:0,e:'ص 92.'},
  {q:'في دراستنا للآلة التزامنية، ملفات المنتج (إنتاج الطاقة) توضع على:',o:['العضو الدوار','العضو الثابت','حلقات الانزلاق','العمود'],c:1,e:'ص 92: يفضل أن تكون ثابتة لأسباب منها التيار الكبير وسهولة التبريد.'},
  {q:'يُصنع العضو الدوار من حديد مصمت وليس شرائح لأن:',o:['تياره مستمر فلا توجد تيارات دوامية','تياره متردد','وزنه خفيف','عدد أقطابه كبير'],c:0,e:'ص 93.'},
  {q:'الدوار ذو الأقطاب البارزة يستخدم مع:',o:['السرعات العالية والتوربينات البخارية','السرعات المنخفضة مثل مساقط المياه','المحركات الحثية فقط','التيار المستمر فقط'],c:1,e:'ص 93: سرعتها عادة تقل عن 1000 لفة/دقيقة.'},
  {q:'مولد بأربعة أقطاب يعطي 60 Hz. سرعته:',o:['1200 rpm','1500 rpm','1800 rpm','3600 rpm'],c:2,e:'n = 120 × 60 ÷ 4 = 1800 rpm (مثال 3-1 أ).'},
  {q:'الطريقة الوحيدة للتحكم في مقدار القوة الدافعة الكهربائية للمولد التزامني (والتردد ثابت):',o:['تغيير السرعة','تغيير تيار المجال المستمر','تغيير عدد الأقطاب','تغيير نوع التوصيل'],c:1,e:'ص 96: لأن السرعة يجب أن تبقى ثابتة لثبات التردد.'},
  {q:'الزاوية بين القوى الدافعة للأوجه الثلاثة:',o:['90°','120°','180°','60°'],c:1,e:'ص 96: لأن الملفات الثلاثة بين كل منها والآخر 120°.'},
  {q:'كم حلقة انزلاق تلزم لتغذية ملفات المجال على الدوار؟',o:['2','3','6','لا شيء'],c:0,e:'ص 92–93: حلقتا انزلاق للتيار المستمر بدلاً من 6.'}
 ]
});

/* ---------- الشكل (3-5): fields during loading ---------- */
function fig35SVG(o){o=o||{};const I=o.I==null?0.6:o.I,psi=o.psi==null?40:o.psi,BR=o.BR==null?1:o.BR,rot=o.rot||0;const cx=180,cy=168;
  const S=(L,a)=>[cx+L*Math.cos((a+rot)*D),cy-L*Math.sin((a+rot)*D)];
  let s=`<svg viewBox="-30 -22 420 380" role="img" aria-label="المجالات المغناطيسية في المولد أثناء التحميل">`;
  s+=statorSVG(cx,cy,{R0:155,Rb:120,slots:false});
  const aI=90-psi;
  for(let k=0;k<24;k++){const a=k*15+7.5,p=[cx+136*Math.cos(a*D),cy-136*Math.sin(a*D)];const i=Math.cos((a-aI-rot)*D);
    if(I>0.02&&Math.abs(i)>0.35)s+=condSym(p[0],p[1],i>0,5);else s+=`<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="5" fill="var(--surface)" stroke="var(--muted)" stroke-width="1"/>`}
  // 2-pole salient rotor (vertical), rotated with the field
  const sh=(sgn)=>{const a1=pp(92,sgn>0?-38:142),a2=pp(110,sgn>0?-38:142),a3=pp(110,sgn>0?38:218),a4=pp(92,sgn>0?38:218);return `<path d="M${fx(a1[0])} ${fx(a1[1])}L${fx(a2[0])} ${fx(a2[1])}A110 110 0 0 1 ${fx(a3[0])} ${fx(a3[1])}L${fx(a4[0])} ${fx(a4[1])}Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`};
  s+=`<g transform="translate(${cx} ${cy}) rotate(${fx(-rot)})"><rect x="-22" y="-96" width="44" height="192" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>${sh(1)}${sh(-1)}<text class="txt" x="0" y="-74" text-anchor="middle" font-size="13" style="fill:var(--stop)">N</text><text class="txt" x="0" y="84" text-anchor="middle" font-size="13" style="fill:var(--blue-ink)">S</text></g>`;
  // dashed directions of maximum values
  const dl=(a,lab,col)=>{const p=S(150,a),q=S(172,a);return `<path d="M${cx} ${cy}L${fx(p[0])} ${fx(p[1])}" stroke="var(${col})" stroke-width="1.2" stroke-dasharray="4 4"/>`+laT(q[0],q[1]+4,lab,{fs:11,col})};
  const Btot=cadd(cpol(90*BR,90),cpol(70*I,-psi)),aV=cang(Btot);
  s+=dl(90,'Eph max','--muted');if(I>0.02){s+=dl(aI,'Iph max','--blue');s+=dl(-psi,'EAR max','--on')}s+=dl(aV,'Vph','--live');
  const v=(L,a,col,lab,w)=>{const p=S(L,a);return arrow(cx,cy,p[0],p[1],col,w||3)+(lab?laT(p[0]+(Math.cos((a+rot)*D)>0?8:-8),p[1]-6,lab,{a:Math.cos((a+rot)*D)>0?'start':'end',fs:13,col}):'')};
  s+=v(90*BR,90,'--stop','BR');if(I>0.02)s+=v(70*I,-psi,'--on','BS');s+=v(cabs(Btot),aV,'--live','BTotal',3.4);
  s+=`<path d="M${cx-60} ${cy-128}A140 140 0 0 0 ${cx-110} ${cy-80}" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+arrow(cx-104,cy-88,cx-112,cy-76,'--fg',1.6)+laT(cx-96,cy-118,'n',{fs:14});
  return s+'</svg>'}
/* ---------- الأشكال (3-6)، (3-7)، (3-8): per-phase circuits ---------- */
function coilP(x1,y,x2,n){const st=(x2-x1)/n;let p=`M${x1} ${y}`;for(let i=1;i<=n;i++)p+=`A${fx(st/2)} ${fx(st/2)} 0 0 1 ${fx(x1+st*i)} ${y}`;return p}
function zigP(x1,y,x2){const n=6,st=(x2-x1)/n;let p=`M${x1} ${y}`;for(let i=0;i<n;i++)p+=`L${fx(x1+st*(i+.5))} ${y+(i%2?7:-7)}`;return p+`L${x2} ${y}`}
function circSVG(kind,v){v=v||{};const R=kind==='3-7',X=kind==='3-6'?'jX':'jXS';const live=v.live?'w live':'w';
  let s=`<svg viewBox="0 0 560 240" role="img" aria-label="الدائرة المكافئة لكل وجه">`;
  s+=`<path class="${live}" d="M60 96V44H${R?150:250}"/>`;
  if(R)s+=`<path class="${live}" d="${zigP(150,44,220)}"/><path class="${live}" d="M220 44H250"/>`;
  s+=`<path class="${live}" d="${coilP(250,44,340,5)}"/><path class="${live}" d="M340 44H480V82M480 162V200H60V144"/>`;
  s+=`<circle cx="60" cy="120" r="24" class="coil"/><path d="M46 120q7 -12 14 0t14 0" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+arrow(24,140,24,98,'--fg',1.6)+laT(20,170,'Eph',{fs:13});
  s+=`<path class="w" d="${zigP(470,82,490).replace(/^M470 82/,'M480 82')}" style="display:none"/>`;
  // variable load resistor (vertical zigzag) with arrow
  let z='M480 82';for(let i=0;i<6;i++)z+=`L${i%2?473:487} ${fx(82+80/6*(i+.5))}`;z+='L480 162';s+=`<path class="${live}" d="${z}"/>`+arrow(458,170,504,76,'--fg',1.4);
  s+=arrow(530,172,530,70,'--fg',1.6)+laT(536,124,'Vph',{a:'start',fs:13});
  s+=arrow(84,30,120,30,'--blue',2)+laT(102,22,'Iph',{fs:12,col:'--blue'});
  if(R){s+=laT(185,22,'RA',{fs:13})+arrow(215,72,155,72,'--muted',1.6)+laT(185,90,'RA·Iph',{fs:11,col:'--muted'})}
  s+=laT(295,22,X,{fs:13})+arrow(330,72,260,72,'--muted',1.6)+laT(295,90,X+'·Iph',{fs:11,col:'--muted'});
  if(v.E){s+=laT(70,226,v.E,{fs:12,col:'--live'});if(R)s+=laT(175,108,v.R,{fs:11,col:'--blue'});s+=laT(305,126,v.X,{fs:11,col:'--blue'});s+=laT(480,226,v.V,{fs:12,col:'--live'});s+=laT(270,226,'Iph = '+v.I,{fs:12,col:'--blue'})}
  return s+'</svg>'}

/* ============================== Lesson 3.2 ============================== */
B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'96–100',
 title:'رد فعل المنتج والدائرة المكافئة لكل وجه',
 summary:'لماذا يختلف جهد الأطراف V عن الجهد الداخلي E عند التحميل: رد فعل المنتج ومقاومة الملفات وممانعة التسرب. ثم دمج الممانعتين في الممانعة التزامنية Xs والوصول إلى الدائرة المكافئة (3-7) والتقريبية (3-8).',
 stations:[
  {intro:true},

  {st:1,short:'لماذا يختلف V عن E؟',title:'الدائرة المكافئة لكل وجه: الجهد الداخلي والجهد الخارجي',ref:'ص 96–97',
   q:String.raw`المولد يولّد داخل ملفاته جهداً قيمته \(E_{ph}\)… فهل يصل هذا الجهد كما هو إلى الحمل عندما نشغّل الأجهزة؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="داخل المولد: مصدر الجهد الداخلي ثم ثلاثة عوامل على التوالي قبل أطراف المولد والحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<rect x="24" y="58" width="246" height="160" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2" stroke-dasharray="7 5"/>
<text x="147" y="240" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">داخل المولد (وجه واحد)</text>
<path d="M62 112V90H300V118M300 172V196H62V160" fill="none" stroke="#2C4A40" stroke-width="3"/>
<g data-tip="الجهد الداخلي ⟦Eph⟧: يتولد في ملفات المنتج حسب المعادلة (3-2)، ولا يظهر على الأطراف كما هو إلا عند اللاحمل."><circle cx="62" cy="136" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M50 136q6 -11 12 0t12 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="142" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan></text></g>
<g data-tip="العامل الأول: رد فعل المنتج ⟦Armature Reaction⟧ — تيارات المنتج تشوّه الفيض في الثغرة الهوائية."><rect x="98" y="78" width="42" height="24" rx="5" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="119" y="95" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">1</text></g>
<g data-tip="العامل الثاني: مقاومة ملفات المنتج."><rect x="150" y="78" width="42" height="24" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="171" y="95" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">2</text></g>
<g data-tip="العامل الثالث: الممانعة الحثية الذاتية لملفات المنتج."><rect x="202" y="78" width="42" height="24" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="223" y="95" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">3</text></g>
<g data-tip="أطراف المنتج: عليها يظهر الجهد الخارجي ⟦Vph⟧ الذي يصل إلى الحمل فعلاً."><circle cx="270" cy="90" r="5" fill="#2C4A40"/><circle cx="270" cy="196" r="5" fill="#2C4A40"/><text x="248" y="150" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan></text></g>
<g data-tip="الحمل: عندما يمر فيه تيار يظهر أثر العوامل الثلاثة، فيختلف ⟦Vph⟧ عن ⟦Eph⟧."><rect x="286" y="118" width="28" height="54" rx="4" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/></g>
<text x="300" y="234" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الحمل</text>
<text x="180" y="286" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثلاثة عوامل تفصل بين الجهدين</text></svg>`,
   cap:'المربعات الملونة المرقمة = العوامل الثلاثة التي يذكرها الكتاب، وتقع بين الجهد الداخلي وأطراف المولد.<br><b>مرّر المؤشر على المصدر والمربعات والأطراف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>إن وجود ثغرة هوائية غير منتظمة في المولد التزامني ذو الأقطاب البارزة سيضفي بعض التعقيد على الدائرة المكافئة، لذا سنفترض هنا أن الثغرة الهوائية منتظمة، أي أننا سنستخدم <b>نموذج المولد التزامني ذو العضو الدوار الاسطواني</b>، كما أن هذا الافتراض يعطي نتائج مقبولة في حالة المولد ذو الأقطاب البارزة عندما يعمل في حالة الاستقرار <span class="ltr">steady state</span>.</p>`,ref:'ص 96'}
   ],
   body:[
    {book:String.raw`<p>الجهد المتولد في ملفات المنتج \(E_{ph}\) والمعطى بالمعادلة (3-2) يعتبر <b>الجهد الداخلي</b> للمولد ولا يظهر على أطراف المنتج إلا في حالة عدم مرور تيار في ملفات المنتج (حالة اللاحمل)، أما في حالة تحميل المولد فإنه سيظهر جهد آخر مختلف على أطراف المنتج يسمى <b>الجهد الخارجي \(V_{ph}\)</b>.</p>
     <p>من أهم العوامل التي تسبب الاختلاف بين \(E_{ph}\) و\(V_{ph}\) عند التحميل:</p>
     <ol><li>تشوه الفيض المغناطيسي في الثغرة الهوائية بسبب مرور تيارات في ملفات المنتج وهو ما يسمى بظاهرة <b>رد فعل المنتج <span class="ltr">Armature Reaction</span></b>.</li><li>وجود مقاومة لملفات المنتج.</li><li>وجود ممانعة حثية ذاتية لملفات المنتج.</li></ol>`,ref:'ص 96–97'},
    {predict:{q:String.raw`مولد يدور وأطرافه مفتوحة (بلا حمل). ما العلاقة بين جهد أطرافه \(V_{ph}\) وجهده الداخلي \(E_{ph}\)؟`,opts:[
     [String.raw`\(V_{ph}\) أقل من \(E_{ph}\) دائماً`,false,'لا يمر تيار عند اللاحمل، فلا تسبب العوامل الثلاثة أي فرق.'],
     [String.raw`\(V_{ph}=E_{ph}\)`,true,'الكتاب: الجهد الداخلي لا يظهر على الأطراف إلا في حالة عدم مرور تيار (حالة اللاحمل). العوامل الثلاثة كلها تحتاج تياراً لتؤثر.'],
     [String.raw`\(V_{ph}=0\)`,false,'الجهد يتولد بالدوران والمجال، ولا يحتاج حملاً ليظهر.']]}},
    {tip:String.raw`<p>العوامل الثلاثة لا «تعمل» إلا عندما يمر تيار في ملفات المنتج. لذلك: بلا حمل \(V_{ph}=E_{ph}\)، ومع الحمل يظهر الفرق، وكلما كبر تيار الحمل كبر الفرق. هذا الدرس يحوّل العوامل الثلاثة إلى عناصر دائرة كهربائية بسيطة نحسب بها.</p>`}
   ]},

  {st:2,short:'رد فعل المنتج',title:'ما هو رد فعل المنتج؟',ref:'ص 97–98',
   q:'تيارات الحمل تمر في ملفات العضو الثابت الثلاثة… ألا تصنع هي أيضاً مجالاً مغناطيسياً؟ وماذا يفعل هذا المجال بمجال الدوار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مجال العضو الدوار ومجال العضو الثابت ومحصلتهما في الثغرة الهوائية، كالشكل ثلاثة-خمسة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/>
<g data-tip="العضو الثابت: تمر في ملفاته تيارات الحمل الثلاثة فتصنع مجالاً دواراً جديداً."><circle cx="180" cy="150" r="124" fill="#4FB3A9"/><circle cx="180" cy="150" r="104" fill="#FBF6EE"/></g>
<g data-tip="العضو الدوار (قطبان بارزان): يغذّى بتيار مستمر ويدور بالسرعة التزامنية ⟦n⟧."><rect x="166" y="50" width="28" height="200" rx="6" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="180" y="68" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">N</text><text x="180" y="243" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">S</text></g>
<g data-tip="⟦BR⟧: مجال العضو الدوار. يولّد في ملفات العضو الثابت الجهد الداخلي ⟦Eph⟧."><line x1="180" y1="150" x2="180" y2="94" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><polygon points="180,78 170,96 190,96" fill="#E8735A"/><text x="148" y="98" text-anchor="middle" font-size="15" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">B<tspan font-size="10" dy="4">R</tspan></text></g>
<g data-tip="⟦BS⟧: مجال العضو الثابت الناتج عن تيارات الحمل، وهذا هو رد فعل المنتج. يولّد في ملفات العضو الثابت الجهد ⟦EAR⟧."><line x1="180" y1="150" x2="221" y2="184" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><polygon points="233,194 217,191 227,179" fill="#2C4A40"/><text x="248" y="214" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">B<tspan font-size="10" dy="4">S</tspan></text></g>
<path d="M180 78 L233 122" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 4"/>
<g data-tip="⟦BTotal⟧: محصلة المجالين في الثغرة الهوائية، وهي التي تحدد جهد الأطراف ⟦Vph⟧."><line x1="180" y1="150" x2="221" y2="128" stroke="#12855A" stroke-width="6" stroke-linecap="round"/><polygon points="233,122 224,136 217,121" fill="#12855A"/><text x="262" y="114" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">B<tspan font-size="10" dy="4">Total</tspan></text></g>
<g data-tip="اتجاه دوران العضو الدوار ومعه المجالان (السرعة نفسها والاتجاه نفسه)."><path d="M152 97 A60 60 0 0 0 123 136" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="119,148 115,133 129,137" fill="#2C4A40"/><text x="126" y="104" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">n</text></g>
<text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مجالان يدوران معاً… والمحصلة في الثغرة</text></svg>`,
   cap:'السهم البرتقالي = مجال الدوار، والداكن = مجال تيارات المنتج (رد فعل المنتج)، والأخضر = محصلتهما. الخط المتقطع يبيّن جمع السهمين.<br><b>مرّر المؤشر على الأسهم والأعضاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>عند تحميل المولد التزامني سيمر في كل وجه من أوجه العضو الثابت تيار كهربائي، وحيث أن ملفات العضو الثابت رتبت بحيث يفصل بين كل وجه وآخر زاوية فراغية مقدارها 120°، فإن التيارات المارة في هذه الأوجه ستفصل بين كل تيار وآخر زاوية طور مقدارها 120°، ونتيجة لمرور هذه التيارات مجتمعة بهذه الصفة سيتولد مجال مغناطيسي دوار في العضو الثابت يدور بنفس سرعة واتجاه المجال المغناطيسي الدوار الناتج من ملفات العضو الدوار. <b>هذا المجال المغناطيسي الجديد هو رد فعل المنتج</b> كنتيجة لمرور تيارات كهربائية في ملفاته أثناء التحميل.</p>`,ref:'ص 97'}
   ],
   body:[
    {book:String.raw`<p>المجال المغناطيسي المؤثر في الثغرة الهوائية هو محصلة المجالين المتولدين من العضو الدوار والعضو الثابت. المجال من العضو الدوار ينتج جهداً في ملفات العضو الثابت هو \(E_{ph}\)، كذلك المجال الناتج بسبب رد فعل المنتج سينتج جهداً في ملفات العضو الثابت هو \(E_{AR}\)، ولذا فإن الجهد الذي سيظهر على أطراف المولد \(V_{ph}\) هو محصلة هذين الجهدين، أو لنقل هو الجهد المتولد بسبب محصلة الفيض المغناطيسي في الثغرة الهوائية \(B_{Total}\). انظر الشكل (3-5).</p>
     <div class="eq">$$B_{total}=B_R+B_S$$<span class="eqno">(3-3)</span></div>
     <div class="eq">$$V_{ph}=E_{ph}+E_{AR}$$<span class="eqno">(3-4)</span></div>`,ref:'ص 97–98'},
    {book:String.raw`<p>في الشكل (3-5) نجد أن التيار \(I_{Ph}\) نتج بسبب تحميل المولد بحمل حثي وذلك لأنه متأخر عن الجهد \(E_{Ph}\) بزاوية ما، هذا التيار بدوره تسبب في المجال المغناطيسي \(B_S\) الذي بدوره أنتج جهداً في ملفات المنتج هو \(E_{AR}\). هذا الجهد \(E_{AR}\) الناتج بسبب رد فعل المنتج <b>يتناسب طردياً مع التيار المسبب له كما أنه متأخر عنه بزاوية قدرها 90°</b>، وبناءً على ذلك نستطيع أن نعبر عن هذا الجهد كما يلي:</p>
     <div class="eq">$$E_{AR}=-jXI_{ph}$$<span class="eqno">(3-5)</span></div>
     <p>وبعد التعويض في المعادلة (3-4):</p>
     <div class="eq">$$V_{ph}=E_{ph}-jXI_{ph}$$<span class="eqno">(3-6)</span></div>`,ref:'ص 98'},
    {predict:{q:String.raw`جهد يتناسب طردياً مع التيار ومتأخر عنه <span class="ltr">90°</span>… أيّ عنصر في الدوائر الكهربائية يتصرف بهذه الطريقة؟`,opts:[
     ['مقاومة',false,'هبوط الجهد على المقاومة في نفس طور التيار، لا متأخر عنه.'],
     ['مكثف',false,'المكثف عكس الملف في علاقة الطور بين جهده وتياره.'],
     ['ملف (محاثة)',true,String.raw`لذلك يمثّل الكتاب رد فعل المنتج بملف \(jX\) على التوالي مع \(E_{ph}\) كما في الشكل (3-6)، وهذا ما تعنيه المعادلة (3-6).`]]}},
    {tip:String.raw`<p>الحرف \(j\) يعني «دوران <span class="ltr">90°</span> للأمام»، و\(-j\) يعني «تأخر <span class="ltr">90°</span>». فالمعادلة (3-5) تقول بالضبط: \(E_{AR}\) مقداره \(X\times I\) ومتأخر عن التيار <span class="ltr">90°</span>. وهذا هو سلوك الملف (المحاثة) تماماً، لذلك نستبدل رد فعل المنتج بملف \(jX\) في الدائرة.</p>`,title:'ماذا يعني j؟'},
    {watch:String.raw`<p>رد فعل المنتج <b>ليس</b> عيباً في التصنيع ولا ملفاً إضافياً في الآلة؛ هو أثر طبيعي لمرور تيار الحمل في ملفات المنتج. لذلك يختفي تماماً عند اللاحمل \((I_{ph}=0)\).</p>`}
   ]},

  {st:3,short:'الممانعة التزامنية',title:'المقاومة وممانعة التسرب والممانعة التزامنية',ref:'ص 99',
   q:'لدينا ملف يمثل رد فعل المنتج، وللملفات أيضاً مقاومة وممانعة تسرب… هل نستطيع تبسيطها في عنصرين فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة المكافئة: المصدر ثم مقاومة المنتج ثم ملف رد فعل المنتج ثم ملف ممانعة التسرب، والملفان معاً هما الممانعة التزامنية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<path d="M44 130V100H90M140 100H160M216 100H226M282 100H318V136M318 194V232H44V176" fill="none" stroke="#2C4A40" stroke-width="3"/>
<g data-tip="الجهد الداخلي ⟦Eph⟧ لكل وجه."><circle cx="44" cy="153" r="23" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M33 153q5.5 -10 11 0t11 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="84" y="160" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan></text></g>
<g data-tip="⟦RA⟧: مقاومة ملفات المنتج. هبوط الجهد عليها ⟦RA·Iph⟧ في نفس طور التيار."><path d="M90 100 L95 92 L103 108 L111 92 L119 108 L127 92 L135 108 L140 100" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linejoin="round"/><rect x="88" y="70" width="54" height="44" fill="transparent"/><text x="115" y="80" text-anchor="middle" font-size="14" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">A</tspan></text></g>
<g data-tip="⟦jX⟧: الممانعة الحثية التي تمثل رد فعل المنتج، من المعادلة (3-5)."><path d="M160 100 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" fill="none" stroke="#2C4A40" stroke-width="3.5"/><rect x="158" y="70" width="60" height="38" fill="transparent"/><text x="188" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">jX</text></g>
<g data-tip="⟦jXA⟧: ممانعة التسرب الحثية لملفات المنتج."><path d="M226 100 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" fill="none" stroke="#2C4A40" stroke-width="3.5"/><rect x="224" y="70" width="60" height="38" fill="transparent"/><text x="254" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">A</tspan></text></g>
<g data-tip="الممانعة التزامنية ⟦XS = X + XA⟧ من المعادلة (3-8): الملفان على التوالي يُجمعان في ملف واحد."><path d="M160 116V126H282V116" fill="none" stroke="#12855A" stroke-width="2.5"/><path d="M221 126V136" stroke="#12855A" stroke-width="2.5"/><rect x="186" y="138" width="70" height="28" rx="8" fill="#12855A"/><text x="221" y="158" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan></text></g>
<g data-tip="الحمل، وعليه جهد الأطراف ⟦Vph⟧."><rect x="304" y="136" width="28" height="58" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="286" y="214" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan></text></g>
<g data-tip="تيار الوجه ⟦Iph⟧: يمر في كل العناصر على التوالي."><line x1="62" y1="88" x2="82" y2="88" stroke="#E8735A" stroke-width="2.5"/><polygon points="88,88 78,83 78,93" fill="#E8735A"/><text x="66" y="80" text-anchor="middle" font-size="12" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="3">ph</tspan></text></g>
<text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ملفان على التوالي = ملف واحد</text></svg>`,
   cap:'الدائرة التي تمثل المعادلة <span class="ltr">(3-7)</span>، والقوس الأخضر يجمع الملفين في الممانعة التزامنية <span class="ltr">(3-8)</span>.<br><b>مرّر المؤشر على كل عنصر (أو المسه في الجوال) لتعرف اسمه ودوره.</b>',
   side:[
    {book:String.raw`<p>إذاً يمكن التعبير عن الجهد المتولد بسبب رد فعل المنتج بمحاثة موصلة على التوالي مع مصدر الجهد الداخلي. بالإضافة إلى تأثير رد فعل المنتج هناك أيضاً تأثير مقاومة وممانعة التسرب الحثية لملفات المنتج. فإذا اعتبرنا أن مقاومة ملفات المنتج هي \(R_A\) وممانعة التسرب الحثية لملفات المنتج هي \(X_A\) فإن جهد أطراف المولد يصبح:</p>
     <div class="eq">$$V_{ph}=E_{ph}-R_AI_{ph}-jXI_{ph}-jX_AI_{ph}$$<span class="eqno">(3-7)</span></div>`,ref:'ص 99'}
   ],
   body:[
    {book:String.raw`<p>من أجل تبسيط المعادلة (3-7) يمكننا دمج ممانعة التسرب الحثية لملفات المنتج \((X_A)\) مع الممانعة الحثية التي تمثل رد فعل المنتج \((X)\) لتصبح ممانعة حثية واحدة تسمى <b>الممانعة التزامنية \((X_S)\)</b>:</p>
     <div class="eq">$$X_S=X+X_A$$<span class="eqno">(3-8)</span></div>
     <p>وبالتالي:</p>
     <div class="eq">$$V_{ph}=E_{ph}-R_AI_{ph}-jX_SI_{ph}$$<span class="eqno">(3-9)</span></div>
     <p>المعادلة (3-9) هي <b>المعادلة النهائية</b> التي يحسب منها جهد أطراف المولد لكل وجه، ومنها نرسم الدائرة المكافئة للمولد التزامني كما في الشكل (3-7)، مع ملاحظة أنها تمثل وجه واحد فقط من أوجه المنتج وذلك للتشابه التام بين الأوجه الثلاثة.</p>`,ref:'ص 99'},
    {predict:{q:String.raw`الممانعة التزامنية \(X_S\) تجمع أيّ عنصرين؟`,opts:[
     [String.raw`مقاومة المنتج \(R_A\) وممانعة التسرب \(X_A\)`,false,'المقاومة لا تُجمع مع الممانعة الحثية بهذه البساطة، وتبقى وحدها في المعادلة (3-9).'],
     [String.raw`ممانعة رد فعل المنتج \(X\) وممانعة التسرب \(X_A\)`,true,String.raw`كلاهما ممانعة حثية على التوالي، فيُجمعان: \(X_S=X+X_A\) (3-8).`],
     [String.raw`مقاومة المنتج \(R_A\) وممانعة رد فعل المنتج \(X\)`,false,'رد فعل المنتج يُجمع مع ممانعة التسرب لا مع المقاومة.']]}},
    {tip:String.raw`<p>اقرأ المعادلة (3-9) كأنك تسير في الدائرة من المصدر إلى الحمل: تبدأ بالجهد الداخلي \(E_{ph}\)، ثم «تخسر» هبوط الجهد على المقاومة \(R_AI_{ph}\)، ثم هبوط الجهد على الممانعة التزامنية \(jX_SI_{ph}\)، فيبقى للحمل \(V_{ph}\). الطرح هنا <b>طرح اتجاهي</b> (مقادير وزوايا)، وسترى كيف يُرسم في الدرس القادم.</p>`},
    {watch:String.raw`<p>الدائرة المكافئة <b>لوجه واحد</b> فقط. القيم فيها قيم الوجه \((E_{ph},V_{ph},I_{ph})\)، فإذا أعطاك السؤال جهد الخط أو تيار الخط فحوّله أولاً حسب نوع التوصيل (نجمة أو دلتا).</p>`}
   ]},

  {st:4,short:'الدائرة التقريبية',title:'الدائرة المكافئة التقريبية',ref:'ص 100',
   q:'إذا كان أحد العناصر صغيراً جداً بالنسبة لغيره، هل نحتاج أن نحمله معنا في كل حساب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة التقريبية بلا مقاومة المنتج، وتحتها شريطان يقارنان مقاومة المنتج والممانعة التزامنية في مثال ثلاثة-واحد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<path d="M62 110V78H120M144 78H170M226 78H300V100M300 152V176H62V158" fill="none" stroke="#2C4A40" stroke-width="3"/>
<g data-tip="الجهد الداخلي ⟦Eph⟧."><circle cx="62" cy="134" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M51 134q5.5 -10 11 0t11 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g>
<g data-tip="مقاومة المنتج ⟦RA⟧ أُهملت لأنها صغيرة مقارنةً بالممانعة التزامنية، فصار مكانها سلكاً فقط."><path d="M120 78H144" stroke="#2C4A40" stroke-width="3"/><path d="M118 64L146 92M146 64L118 92" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><text x="132" y="58" text-anchor="middle" font-size="13" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="9" dy="3">A</tspan></text></g>
<g data-tip="الممانعة التزامنية ⟦jXS⟧: العنصر الوحيد الباقي بين ⟦Eph⟧ و⟦Vph⟧."><path d="M170 78 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0" fill="none" stroke="#12855A" stroke-width="3.5"/><rect x="168" y="50" width="60" height="36" fill="transparent"/><text x="198" y="60" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan></text></g>
<g data-tip="الحمل، وعليه جهد الأطراف ⟦Vph⟧."><rect x="287" y="100" width="26" height="52" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g>
<g data-tip="من مثال (3-1) ص 114: مقاومة ملفات المنتج ⟦RA = 0.015 Ω⟧."><rect x="110" y="208" width="15" height="20" rx="3" fill="#E8735A"/><text x="100" y="223" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="9" dy="3">A</tspan></text><text x="132" y="223" font-size="12.5" fill="#2C4A40" direction="ltr" font-family="var(--mono)">0.015 Ω</text></g>
<g data-tip="من مثال (3-1) ص 114: الممانعة التزامنية ⟦XS = 0.1 Ω⟧، أي أكبر من ⟦RA⟧ بنحو سبع مرات."><rect x="110" y="238" width="100" height="20" rx="3" fill="#12855A"/><text x="100" y="253" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="9" dy="3">S</tspan></text><text x="217" y="253" font-size="12.5" fill="#2C4A40" direction="ltr" font-family="var(--mono)">0.1 Ω</text></g>
<text x="180" y="290" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">أرقام مثال الكتاب بالمقياس نفسه</text></svg>`,
   cap:'فوق: الدائرة التقريبية <span class="ltr">(3-8)</span> بعد حذف <span class="ltr">R<sub>A</sub></span>. تحت: طولا الشريطين بمقياس واحد لقيمتي مثال <span class="ltr">(3-1)</span>.<br><b>مرّر المؤشر على العناصر والشريطين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>الشكل (3-7) يمثل الدائرة المكافئة النهائية لكل وجه للمولد التزامني ذو العضو الدوار الإسطواني، كما أنه يمكن تبسيط هذه الدائرة وذلك <b>بإهمال مقاومة ملفات المنتج لأنها صغيرة مقارنةً بالممانعة التزامنية خصوصاً في المولدات الكبيرة</b>، فتصبح الدائرة المكافئة التقريبية لكل وجه كما في الشكل (3-8).</p>
     <div class="eq">$$V_{ph}=E_{ph}-jX_SI_{ph}$$<span class="eqno">(3-10)</span></div>`,ref:'ص 100'}
   ],
   body:[
    {predict:{q:String.raw`على أي أساس نهمل مقاومة ملفات المنتج \(R_A\) في الدائرة التقريبية؟`,opts:[
     ['لأن التيار لا يمر فيها',false,'تيار الحمل يمر فيها، فهي على التوالي مع بقية العناصر.'],
     ['لأنها صغيرة مقارنةً بالممانعة التزامنية، خصوصاً في المولدات الكبيرة',true,'هذا أساس التقريب في الكتاب (ص 100)، وهو السؤال 7 من أسئلة الفصل الأول.'],
     ['لأنها تساوي الممانعة التزامنية فتُلغى معها',false,String.raw`لا تُلغى العناصر بهذه الطريقة؛ الحذف سببه صِغَر \(R_A\) فقط.`]]}},
    {tip:String.raw`<p>في مثال (3-1) من الكتاب \(R_A=0.015\ \Omega\) و\(X_S=0.1\ \Omega\): المقاومة أصغر من الممانعة التزامنية بنحو سبع مرات، لذلك يكون إهمالها مقبولاً. وستستعمل الدائرة التقريبية في الدرس الخامس لاشتقاق معادلة القدرة، وفي مثال (3-2) الذي يقول نصه: «ومقاومة ملفات المنتج مهملة».</p>`},
    {watch:String.raw`<p>الإهمال تقريب، وليس حذفاً لعنصر غير موجود. إذا أعطاك السؤال قيمة \(R_A\) (كما في مثال 3-1) فاستعمل المعادلة الكاملة (3-9)؛ واستعمل (3-10) عندما يقول السؤال إن المقاومة مهملة.</p>`}
   ]},

  {recap:[
   String.raw`عند التحميل يختلف جهد الأطراف \(V_{ph}\) عن الجهد الداخلي \(E_{ph}\) بسبب رد فعل المنتج ومقاومة الملفات وممانعتها الحثية (ص 96–97).`,
   String.raw`رد فعل المنتج مجال دوار تصنعه تيارات المنتج: المعادلتان (3-3) \(B_{total}=B_R+B_S\) و(3-4) \(V_{ph}=E_{ph}+E_{AR}\)، و(3-5) \(E_{AR}=-jXI_{ph}\).`,
   String.raw`الممانعة التزامنية، المعادلة (3-8): \(X_S=X+X_A\)، ومعادلة جهد الأطراف النهائية (3-9): \(V_{ph}=E_{ph}-R_AI_{ph}-jX_SI_{ph}\)`,
   String.raw`بإهمال \(R_A\) لصغرها: الدائرة التقريبية والمعادلة (3-10): \(V_{ph}=E_{ph}-jX_SI_{ph}\)`]}
],
 theory:[
  {h:'الدائرة المكافئة لكل وجه للمولد التزامني ثلاثي الأوجه',ref:'ص 96',html:`<p>«إن وجود ثغرة هوائية غير منتظمة في المولد التزامني ذو الأقطاب البارزة سيضفي بعض التعقيد على الدائرة المكافئة، لذا سنفترض هنا أن الثغرة الهوائية منتظمة، أي أننا سنستخدم <b>نموذج المولد التزامني ذو العضو الدوار الاسطواني</b>»، وهذا الافتراض يعطي نتائج مقبولة للمولد ذي الأقطاب البارزة في حالة الاستقرار <span class="ltr">steady state</span>.</p>
   <p>الجهد المتولد في ملفات المنتج \\(E_{ph}\\) (المعادلة 3-2) هو <b>الجهد الداخلي</b> للمولد، ولا يظهر على أطراف المنتج إلا عند عدم مرور تيار (اللاحمل). أما عند التحميل فيظهر على الأطراف جهد آخر يسمى <b>الجهد الخارجي \\(V_{ph}\\)</b>.</p>
   <p>من أهم العوامل التي تسبب الاختلاف بين \\(E_{ph}\\) و\\(V_{ph}\\) عند التحميل <span class="ref">ص 97</span>:</p>
   <ol><li>تشوه الفيض المغناطيسي في الثغرة الهوائية بسبب مرور تيارات في ملفات المنتج وهو ما يسمى <b>رد فعل المنتج <span class="ltr">Armature Reaction</span></b>.</li><li>وجود مقاومة لملفات المنتج.</li><li>وجود ممانعة حثية ذاتية لملفات المنتج.</li></ol>`},
  {h:'ما هو رد فعل المنتج؟',ref:'ص 97–98',html:`<p>عند تحميل المولد يمر في كل وجه من أوجه العضو الثابت تيار، وحيث إن الأوجه بينها زاوية فراغية 120° فإن التيارات بينها زاوية طور 120°، فيتولد منها مجتمعةً <b>مجال مغناطيسي دوار في العضو الثابت يدور بنفس سرعة واتجاه مجال العضو الدوار</b>. «هذا المجال المغناطيسي الجديد هو رد فعل المنتج».</p>
   <p>المجال المؤثر في الثغرة الهوائية هو محصلة المجالين: مجال الدوار ينتج في ملفات الثابت الجهد \\(E_{ph}\\)، ومجال رد فعل المنتج ينتج الجهد \\(E_{AR}\\)، فالجهد على الأطراف \\(V_{ph}\\) هو محصلتهما (أي الجهد الناتج عن محصلة الفيض \\(B_{Total}\\)):</p>
   $$B_{total}=B_R+B_S\\qquad(3\\text{-}3)$$ $$V_{ph}=E_{ph}+E_{AR}\\qquad(3\\text{-}4)$$
   <p>\\(B_R\\): مجال العضو الدوار، \\(B_S\\): مجال العضو الثابت (رد فعل المنتج)، \\(B_{total}\\): المحصلة.</p>`},
  {fig:'(3-5)',ref:'ص 98',caption:'المجالات المغناطيسية المؤثرة في المولد التزامني أثناء التحميل: \\(B_R\\) من الدوار، و\\(B_S\\) من تيارات المنتج، و\\(B_{Total}\\) محصلتهما؛ والخطوط المتقطعة اتجاهات القيم العظمى (أُعيد رسمه، حمل حثي)',draw:()=>svgbox(fig35SVG({I:0.6,psi:40}),380)},
  {html:`<p>في الشكل (3-5) التيار \\(I_{Ph}\\) نتج عن تحميل المولد بحمل حثي لأنه متأخر عن \\(E_{Ph}\\) بزاوية ما؛ هذا التيار سبب المجال \\(B_S\\) الذي أنتج في ملفات المنتج الجهد \\(E_{AR}\\). هذا الجهد «<b>يتناسب طردياً مع التيار المسبب له كما أنه متأخر عنه بزاوية قدرها 90°</b>»، ولذلك نعبر عنه:</p>
   $$E_{AR}=-jXI_{ph}\\qquad(3\\text{-}5)$$ <p>وبالتعويض في (3-4):</p> $$V_{ph}=E_{ph}-jXI_{ph}\\qquad(3\\text{-}6)$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الحرف \\(j\\) يعني «دوران 90° للأمام»، و\\(-j\\) يعني «تأخر 90°». فالمعادلة (3-5) تقول بالضبط: \\(E_{AR}\\) مقداره \\(X\\times I\\) ومتأخر عن التيار 90°. وهذا هو سلوك الملف (المحاثة) تماماً، لذلك نستبدل رد فعل المنتج بملف \\(jX\\) في الدائرة.'},
  {fig:'(3-6)',ref:'ص 98',caption:'دائرة تمثل المعادلة (3-6): المصدر \\(E_{ph}\\) ثم الملف \\(jX\\) وعليه هبوط الجهد \\(jXI_{ph}\\) ثم الحمل وعليه \\(V_{ph}\\)',draw:()=>svgbox(circSVG('3-6'),560)},
  {h:'المقاومة وممانعة التسرب والممانعة التزامنية',ref:'ص 99',html:`<p>«إذاً يمكن التعبير عن الجهد المتولد بسبب رد فعل المنتج بمحاثة موصلة على التوالي مع مصدر الجهد الداخلي». وبالإضافة إلى ذلك هناك تأثير مقاومة ملفات المنتج \\(R_A\\) وممانعة التسرب الحثية \\(X_A\\)، فيصبح جهد الأطراف:</p>
   $$V_{ph}=E_{ph}-R_AI_{ph}-jXI_{ph}-jX_AI_{ph}\\qquad(3\\text{-}7)$$
   <p>ولتبسيط (3-7) ندمج \\(X_A\\) مع \\(X\\) في ممانعة حثية واحدة تسمى <b>الممانعة التزامنية \\(X_S\\)</b>:</p>
   $$X_S=X+X_A\\qquad(3\\text{-}8)$$ $$V_{ph}=E_{ph}-R_AI_{ph}-jX_SI_{ph}\\qquad(3\\text{-}9)$$
   <p>المعادلة (3-9) هي <b>المعادلة النهائية</b> لجهد أطراف المولد لكل وجه، ومنها نرسم الدائرة المكافئة في الشكل (3-7) — لوجه واحد فقط لتشابه الأوجه الثلاثة.</p>`},
  {fig:'(3-7)',ref:'ص 99',caption:'الدائرة المكافئة لكل وجه للمولد التزامني: \\(E_{ph}\\) ثم \\(R_A\\) ثم \\(jX_S\\) ثم الحمل',draw:()=>svgbox(circSVG('3-7'),560)},
  {h:'الدائرة المكافئة التقريبية',ref:'ص 100',html:`<p>الشكل (3-7) هو الدائرة المكافئة النهائية للمولد ذي الدوار الإسطواني، ويمكن تبسيطها «<b>بإهمال مقاومة ملفات المنتج لأنها صغيرة مقارنةً بالممانعة التزامنية خصوصاً في المولدات الكبيرة</b>»، فتصبح كما في الشكل (3-8):</p>
   $$V_{ph}=E_{ph}-jX_SI_{ph}\\qquad(3\\text{-}10)$$`},
  {fig:'(3-8)',ref:'ص 100',caption:'الدائرة المكافئة التقريبية لكل وجه (بدون \\(R_A\\))',draw:()=>svgbox(circSVG('3-8'),560)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في مثال (3-1) من الكتاب \\(R_A=0.015\\ \\Omega\\) و\\(X_S=0.1\\ \\Omega\\): المقاومة أصغر من الممانعة التزامنية بنحو 7 مرات، لذلك يكون إهمالها مقبولاً. في «المختبر» تجد هذه الدائرة بأرقام المثال، ومفتاحاً يحذف \\(R_A\\) لترى الفرق بنفسك.'}
 ],
 lab:(el)=>{
  let I=0.6,psi=40,BR=1,anim=0,rot=0,lastA='';
  let Ib=692.8,pf=0.8,kind='lag',Xr=0.08,Xa=0.02,noR=0,lastB='';const RA=0.015,V=480;
  el.innerHTML=`<div class="grid">
   <div class="panel c6"><h2>الشكل (3-5) متحركاً <small>مبنية على الشكل (3-5) ص 98</small></h2>
    <div id="l2f" class="svgbox" style="max-width:380px;margin-inline:auto"></div>
    <p class="sub" style="text-align:center">⊙ و⊗ اتجاه التيار في موصلات العضو الثابت في هذه اللحظة.</p></div>
   <div class="panel c6"><h2>التحكم</h2>
    ${sl('l2i','تيار الحمل في المنتج (نسبة من المقنن)',0,1,0.01,I)}
    ${sl('l2p','زاوية تأخر التيار عن <span class="ltr">E<sub>ph</sub></span> (سالبة = تقدّم)',-90,90,1,psi)}
    ${sl('l2b','مجال العضو الدوار <span class="ltr">B<sub>R</sub></span> (تيار المجال)',0.3,1,0.01,BR)}
    <div class="sg-row">${swHTML('l2an','n','دوران المجالات معاً',0)}</div>
    <div class="facts">${fact('<bdi dir="ltr">|B<sub>Total</sub>| ÷ |B<sub>R</sub>|</bdi> = <bdi dir="ltr">V<sub>ph</sub>/E<sub>ph</sub></bdi>','l2r')}${fact('الزاوية بين E<sub>ph</sub> و V<sub>ph</sub>','l2d')}</div>
    <div id="l2m" class="sg-msg"></div>
    <p class="sub">الأطوال <b>أرقام توضيحية</b> (نسب فقط). الرسم يتبع (3-3) و(3-4) و(3-5): \\(E_{AR}\\) متأخر 90° عن التيار.</p></div>
   <div class="panel c12"><h2>الدائرة المكافئة بأرقام مثال (3-1) <small>مبنية على الشكلين (3-7) و(3-8) والمعادلة (3-9)</small></h2>
    <div id="l2c" class="svgbox" style="max-width:640px;margin-inline:auto"></div>
    <div class="grid" style="margin-top:0"><div class="c6">
     ${sl('l2ib','تيار الوجه <span class="ltr">I<sub>ph</sub></span>',0,1000,0.1,Ib)}
     ${sl('l2pf','معامل القدرة <span class="ltr">cos θ</span>',0.5,1,0.01,pf)}
     <div class="sg-row">${segHTML('k2',[['lag','متأخر (حثي)'],['lead','متقدم (سعوي)']],kind)}${swHTML('l2nr','RA','إهمال R<sub>A</sub> (الشكل 3-8)',0)}</div></div>
     <div class="c6">${sl('l2x','ممانعة رد فعل المنتج <span class="ltr">X</span>',0,0.2,0.005,Xr)}${sl('l2xa','ممانعة التسرب <span class="ltr">X<sub>A</sub></span>',0,0.1,0.005,Xa)}
     <div class="facts">${fact('<bdi dir="ltr">X<sub>S</sub> = X + X<sub>A</sub></bdi> (3-8)','l2xs')}${fact('<bdi dir="ltr">E<sub>ph</sub></bdi> اللازم','l2e')}</div></div></div>
    <p class="sub"><span class="ltr">V<sub>ph</sub> = 480 V</span> و<span class="ltr">R<sub>A</sub> = 0.015 Ω</span> و<span class="ltr">X<sub>S</sub> = 0.1 Ω</span> من مثال (3-1). تقسيم \\(X_S\\) إلى <span class="ltr">0.08 + 0.02</span> <b>توضيحي</b> (الكتاب لا يعطيه). الجهد الداخلي من (3-9) بعد نقل الحدود: \\(E_{ph}=V_{ph}+R_AI_{ph}+jX_SI_{ph}\\).</p>
    <div id="l2cm" class="sg-msg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  $('#l2i').oninput=e=>{I=+e.target.value};$('#l2p').oninput=e=>{psi=+e.target.value};$('#l2b').oninput=e=>{BR=+e.target.value};
  $('#l2an').onclick=()=>{anim=anim?0:1;$('#l2an').setAttribute('aria-pressed',anim?'true':'false')};
  $('#l2ib').oninput=e=>{Ib=+e.target.value};$('#l2pf').oninput=e=>{pf=+e.target.value};$('#l2x').oninput=e=>{Xr=+e.target.value};$('#l2xa').oninput=e=>{Xa=+e.target.value};
  segOn(el,'k2',v=>{kind=v});
  $('#l2nr').onclick=()=>{noR=noR?0:1;$('#l2nr').setAttribute('aria-pressed',noR?'true':'false')};
  let usedLag=0,usedLead=0,xsUp=0;
  const steps=stepsUI($('#l2st'),[
   {t:'اللاحمل',x:'اجعل التيار صفراً: يختفي \\(B_S\\) فتكون \\(B_{Total}=B_R\\) أي \\(V_{ph}=E_{ph}\\).',done:()=>I<0.02},
   {t:'حمل حثي (كالشكل 3-5)',x:'ارفع التيار فوق 0.6 واجعل التأخر 60° أو أكثر: يتجه \\(B_S\\) ضد \\(B_R\\) جزئياً فتصغر المحصلة ويقل \\(V_{ph}\\) عن \\(E_{ph}\\).',done:()=>usedLag},
   {t:'حمل سعوي',x:'اجعل الزاوية −60° أو أقل (التيار متقدم): يساعد \\(B_S\\) مجال الدوار فيزيد \\(V_{ph}\\) عن \\(E_{ph}\\).',done:()=>usedLead},
   {t:'دوران المجالات',x:'شغّل «دوران المجالات معاً»: \\(B_R\\) و\\(B_S\\) يدوران بالسرعة نفسها والاتجاه نفسه، فتبقى الزاوية بينهما ثابتة (ص 97).',done:()=>anim},
   {t:'الممانعة التزامنية',x:'في الدائرة المكافئة ارفع \\(X\\) أو \\(X_A\\): تكبر \\(X_S=X+X_A\\) ويكبر هبوط الجهد \\(jX_SI_{ph}\\)، فيلزم جهد داخلي أكبر ليبقى \\(V_{ph}=480\\ V\\).',done:()=>xsUp},
   {t:'الدائرة التقريبية',x:'شغّل «إهمال R<sub>A</sub>»: تتحول الدائرة إلى الشكل (3-8) ويتغير \\(E_{ph}\\) تغيراً صغيراً فقط، ولذلك يقبل الكتاب الإهمال.',done:()=>noR}
  ]);
  loopOn(el,dt=>{if(anim)rot=(rot+40*dt)%360;
   if(I>0.6&&psi>=60)usedLag=1;if(I>0.3&&psi<=-60)usedLead=1;if(Xr+Xa>0.105)xsUp=1;
   $('#l2i-v').textContent=fm(I,2);$('#l2p-v').textContent=psi+'°';$('#l2b-v').textContent=fm(BR,2);
   const sa=[I,psi,BR,rot.toFixed(1)].join();if(sa!==lastA){lastA=sa;$('#l2f').innerHTML=fig35SVG({I,psi,BR,rot});
    const Bt=cadd(cpol(BR,90),cpol(0.7*I/0.9,-psi)),r=cabs(Bt)/BR;$('#l2r').textContent=fm(r,3);$('#l2d').textContent=fm(90-cang(Bt),1)+'°';
    $('#l2m').innerHTML=I<0.02?'<div class="callout">لا تيار في المنتج: لا رد فعل، و\\(V_{ph}=E_{ph}\\).</div>':
     `<div class="callout${r<1?' err':''}">${r<0.995?'<b>V<sub>ph</sub> أصغر من E<sub>ph</sub></b>':r>1.005?'<b>V<sub>ph</sub> أكبر من E<sub>ph</sub></b>':'<b>V<sub>ph</sub> ≈ E<sub>ph</sub></b> في المقدار'}: \\(V_{ph}=E_{ph}+E_{AR}\\) (3-4). ${psi>20?'التيار متأخر (حمل حثي): \\(B_S\\) يضعف مجال الدوار (توضيح).':psi<-20?'التيار متقدم (حمل سعوي): \\(B_S\\) يقوي مجال الدوار (توضيح).':'التيار قريب من طور \\(E_{ph}\\): \\(B_S\\) شبه عمودي على \\(B_R\\) فيُميل المحصلة دون تغيير كبير في مقدارها (توضيح).'}</div>`;B.math($('#l2m'))}
   $('#l2ib-v').textContent=fm(Ib,1)+' A';$('#l2pf-v').textContent=fm(pf,2);$('#l2x-v').textContent=fm(Xr,3)+' Ω';$('#l2xa-v').textContent=fm(Xa,3)+' Ω';
   const sb2=[Ib,pf,kind,Xr,Xa,noR].join();if(sb2!==lastB){lastB=sb2;const Xs=Xr+Xa,ra=noR?0:RA,th=(kind==='lag'?-1:1)*Math.acos(pf)/D;
    const Ic=cpol(Ib,th),dR=cmul(Cx(ra),Ic),dX=cmul(Cx(0,Xs),Ic),E=cadd(Cx(V),dR,dX);
    $('#l2c').innerHTML=circSVG(noR?'3-8':'3-7',{live:Ib>0,E:`${fm(cabs(E),1)}∠${fm(cang(E),2)}° V`,R:`${fm(cabs(dR),2)}∠${fm(th,2)}° V`,X:`${fm(cabs(dX),2)}∠${fm(th+90,2)}° V`,V:'480∠0° V',I:`${fm(Ib,1)}∠${fm(th,2)}° A`});
    $('#l2xs').textContent=fm(Xs,3)+' Ω';$('#l2e').textContent=fm(cabs(E),1)+' V';
    $('#l2cm').innerHTML=`<div class="callout">لكي يبقى جهد الأطراف <span class="ltr">480 V</span> يجب أن يكون الجهد الداخلي <span class="ltr">${fm(cabs(E),1)} V</span> (${cabs(E)>V?'أكبر':'أصغر'} من جهد الأطراف). ${Math.abs(Ib-692.8)<0.05&&pf===0.8&&kind==='lag'&&Math.abs(Xs-0.1)<1e-9&&!noR?'هذه أرقام مثال (3-1) جـ: الكتاب يعطي <span class="ltr">532∠5.3 V</span>.':''}${Math.abs(Ib-692.8)<0.05&&pf===0.8&&kind==='lead'&&Math.abs(Xs-0.1)<1e-9&&!noR?'هذه أرقام مثال (3-1) و: الكتاب يعطي <span class="ltr">451∠7.9 V</span>.':''}</div>`}
   steps.check()});
 },
 examples:[
  {title:'حاسبة الدائرة المكافئة (بأرقام مثال 3-1 جـ)',ref:'ص 99 و 115',
   q:'<p>احسب الممانعة التزامنية من (3-8) ثم الجهد الداخلي اللازم لكي يبقى جهد الأطراف ثابتاً، من (3-9) بعد نقل الحدود: \\(E_{ph}=V_{ph}+R_AI_{ph}+jX_SI_{ph}\\). القيم الافتراضية من مثال (3-1) جـ، وتقسيم \\(X_S\\) إلى \\(X\\) و\\(X_A\\) <b>توضيحي</b>. اكتب معامل القدرة موجباً، و«النوع» 1 للمتأخر أو 2 للمتقدم.</p>',
   given:[{id:'V',label:'جهد الأطراف لكل وجه',sym:'V_{ph}',unit:'V',value:480},{id:'I',label:'تيار الوجه',sym:'I_{ph}',unit:'A',value:692.8},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8},{id:'k',label:'النوع (1 متأخر، 2 متقدم)',sym:'',unit:'',value:1},
    {id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015},{id:'X',label:'ممانعة رد فعل المنتج',sym:'X',unit:'Ω',value:0.08},{id:'XA',label:'ممانعة التسرب',sym:'X_A',unit:'Ω',value:0.02}],
   solve:(g)=>{const Xs=B.round(g.X+g.XA,4),th=(g.k===2?1:-1)*B.round(Math.acos(g.pf)/D,2),dR=B.round(g.RA*g.I,2),dX=B.round(Xs*g.I,2);
    const E=cadd(Cx(g.V),cpol(dR,th),cpol(dX,th+90));return [
    {t:'الممانعة التزامنية (3-8):',f:`X_S=X+X_A=${g.X}+${g.XA}`,v:Xs,unit:'Ω'},
    {t:'زاوية التيار:',f:`\\theta=${g.k===2?'+':'-'}\\cos^{-1}(${g.pf})`,v:th,dp:2,unit:'°'},
    {t:'هبوط الجهد على المقاومة والممانعة:',f:`R_AI_{ph}=${pol(dR,th)}\\quad,\\quad jX_SI_{ph}=${pol(dX,th+90)}`},
    {t:'الجهد الداخلي:',f:`E_{ph}=${g.V}\\angle 0+${pol(dR,th)}+${pol(dX,th+90)}=${fm(E.re,1)}${sgn(E.im)}j${fm(Math.abs(E.im),1)}`},
    {t:'بالصورة القطبية:',v:`${fm(B.round(cabs(E),0),0)} ∠ ${fm(cang(E),1)}°`,unit:'V',final:true}]},
   note:'بالقيم الافتراضية تحصل على نتيجة الكتاب في مثال (3-1) جـ: <span class="ltr">529.9 + j49.2 = 532∠5.3 V</span>. جرّب جعل R<sub>A</sub> = 0 (الدائرة التقريبية 3-8) وقارن.'}
 ],
 quiz:[
  {q:'الجهد الداخلي E<sub>ph</sub> يظهر على أطراف المنتج:',o:['دائماً','عند اللاحمل فقط (لا تيار في المنتج)','عند القصر فقط','عند الحمل الكامل'],c:1,e:'ص 96.'},
  {q:'رد فعل المنتج هو:',o:['مجال مغناطيسي دوار تولده تيارات المنتج أثناء التحميل','مقاومة ملفات الدوار','جهد البطارية','احتكاك المحامل'],c:0,e:'ص 97.'},
  {q:'مجال رد فعل المنتج يدور:',o:['بعكس اتجاه مجال الدوار','بنفس سرعة واتجاه مجال الدوار','بنصف سرعة الدوار','لا يدور'],c:1,e:'ص 97.'},
  {q:'الجهد E<sub>AR</sub>:',o:['متقدم عن التيار 90°','في طور التيار','متأخر عن التيار 90° ويتناسب معه','لا يعتمد على التيار'],c:2,e:'ص 98: لذلك E_AR = −jXI_ph.'},
  {q:'الممانعة التزامنية X<sub>S</sub> تساوي:',o:['X − X<sub>A</sub>','X + X<sub>A</sub>','R<sub>A</sub> + X','X × X<sub>A</sub>'],c:1,e:'المعادلة (3-8) ص 99.'},
  {q:'المعادلة النهائية لجهد أطراف المولد لكل وجه:',o:['V = E + R<sub>A</sub>I','V = E − R<sub>A</sub>I − jX<sub>S</sub>I','V = E × X<sub>S</sub>','V = E'],c:1,e:'المعادلة (3-9).'},
  {q:'نهمل R<sub>A</sub> في الدائرة التقريبية لأن:',o:['قيمتها صغيرة مقارنةً بالممانعة التزامنية خصوصاً في المولدات الكبيرة','قيمتها كبيرة جداً','لا تمر فيها تيارات','الكتاب لا يذكرها'],c:0,e:'ص 100.'},
  {q:'لماذا يستخدم الكتاب نموذج الدوار الإسطواني للدائرة المكافئة؟',o:['لأن الثغرة الهوائية فيه منتظمة','لأنه أرخص','لأنه أسرع','لأن له قطبين فقط'],c:0,e:'ص 96: الثغرة غير المنتظمة في الأقطاب البارزة تعقّد الدائرة.'}
 ]
});

/* ---------- phasor diagram helper (الشكل 3-9 / 3-20) ---------- */
function phasorSVG(o){const V=o.V,I=o.I,RA=o.RA,XS=o.XS,Iref=o.Iref||cabs(I)||1,W=o.W||520,H=o.H||300,m=36;
  const mg=o.mag||1,RI=cmul(Cx(RA*mg),I),XI=cmul(Cx(0,XS*mg),I),A=Cx(V),Bp=cadd(A,RI),E=cadd(Bp,XI);const Iv=cmul(cdiv(I,Cx(Iref)),Cx(0.42*V));
  const P=[Cx(0),A,Bp,E,Iv];const xs=P.map(p=>p.re),ys=P.map(p=>p.im);let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const s=Math.min((W-2*m)/Math.max(1e-9,x1-x0),(H-2*m)/Math.max(1e-9,y1-y0));const ox=m+((W-2*m)-(x1-x0)*s)/2,oy=H-m-((H-2*m)-(y1-y0)*s)/2;
  const T=p=>[ox+(p.re-x0)*s,oy-(p.im-y0)*s];const O=T(Cx(0)),a=T(A),b=T(Bp),e=T(E),iv=T(Iv);
  let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="المخطط الاتجاهي">`;
  g+=`<path d="M${fx(O[0])} ${fx(O[1])}H${W-6}" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  const lab=(p,q,t,col,off)=>{const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<14)return '';const nx=-(q[1]-p[1])/L,ny=(q[0]-p[0])/L,k=off||14;return laT(mx+nx*k,my+ny*k+4,t,{fs:12,col})};
  g+=arrow(O[0],O[1],iv[0],iv[1],'--blue',2.2)+laT(iv[0]+(iv[0]>O[0]?6:-6),iv[1]+(iv[1]>O[1]?14:-6),'Iph',{fs:12,col:'--blue',a:iv[0]>O[0]?'start':'end'});
  g+=arrow(O[0],O[1],a[0],a[1],'--fg',2.6)+lab(O,a,'Vph','--fg',14);
  if(RA>0)g+=arrow(a[0],a[1],b[0],b[1],'--muted',2.2)+lab(a,b,'Iph·RA','--muted',-12);
  g+=arrow(b[0],b[1],e[0],e[1],'--on',2.4)+lab(b,e,'jXs·Iph','--on',-16);
  g+=arrow(O[0],O[1],e[0],e[1],'--live',3.2)+lab(O,e,'Eph','--live',-14);
  const dE=cang(E);if(Math.abs(dE)>0.3){const r=Math.min(60,Math.hypot(e[0]-O[0],e[1]-O[1])*0.45);g+=`<path d="M${fx(O[0]+r)} ${fx(O[1])}A${fx(r)} ${fx(r)} 0 0 ${dE>0?0:1} ${fx(O[0]+r*Math.cos(dE*D))} ${fx(O[1]-r*Math.sin(dE*D))}" fill="none" stroke="var(--live)" stroke-width="1.4"/>`+laT(O[0]+r+8,O[1]-(dE>0?6:-14),'δ',{fs:13,col:'--live',a:'start'})}
  const th=cang(I);if(Math.abs(th)>0.5&&cabs(I)>0){const r=30;g+=`<path d="M${fx(O[0]+r)} ${fx(O[1])}A${r} ${r} 0 0 ${th>0?0:1} ${fx(O[0]+r*Math.cos(th*D))} ${fx(O[1]-r*Math.sin(th*D))}" fill="none" stroke="var(--blue)" stroke-width="1.2"/>`+laT(O[0]+r+4,O[1]+(th>0?-14:22),'θ',{fs:12,col:'--blue',a:'start'})}
  if(o.title)g+=laT(W/2,16,o.title,{fs:13});
  if(mg!==1)g+=laT(W-8,H-8,'drops drawn ×'+mg,{fs:11,col:'--muted',a:'end'});
  return g+'</svg>'}
const fig39=(ra)=>{ra=typeof ra==='number'?ra:0.12;return `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;direction:ltr">${[['(a)',0],['(b)',-36.87],['(c)',36.87]].map(([t,a])=>`<div style="flex:1 1 220px;max-width:300px">${svgbox(phasorSVG({V:1,I:cpol(0.5,a),RA:ra,XS:0.7,W:300,H:220,title:t}))}</div>`).join('')}</div>`};

/* ---------- example (3-1) جـ / و procedure with the book's rounding ---------- */
function ex31E(g,lead){const Iph=B.round(g.IL/SQ3,1),th=(lead?1:-1)*B.round(Math.acos(g.pf)/D,2),dR=B.round(g.RA*Iph,2),dX=B.round(g.XS*Iph,2);
  const E=cadd(Cx(g.V),cpol(dR,th),cpol(dX,B.round(th+90,2)));const re=B.round(E.re,1),im=B.round(E.im,1),Em=B.round(cabs(E),0),Ea=B.round(cang(E),1);
  const IF=occInv(Em);return {Iph,th,dR,dX,re,im,Em,Ea,IF:IF==null?null:B.round(IF,1)}}
function ex31Steps(g,lead,label){const r=ex31E(g,lead);return [
  {t:`تيار الوجه (التوصيل دلتا: \\(I_{Ph}=I_{Line}/\\sqrt3\\)):`,f:`I_{Ph}=\\frac{${g.IL}}{\\sqrt3}`,v:r.Iph,dp:1,unit:'A'},
  {t:`زاوية التيار (${lead?'متقدم':'متأخر'} عن الجهد):`,f:`\\theta=${lead?'':'-'}\\cos^{-1}(${g.pf})`,v:r.th,dp:2,unit:'°'},
  {t:'بتطبيق المعادلة (3-9) بعد نقل الحدود:',f:`E_{Ph}=V_{Ph}+R_AI_{Ph}+jX_SI_{Ph}`},
  {t:'',f:`=${g.V}\\angle 0+(${g.RA})(${fm(r.Iph,1)}\\angle ${fm(r.th,2)})+(j${g.XS})(${fm(r.Iph,1)}\\angle ${fm(r.th,2)})`},
  {t:'',f:`=${g.V}\\angle 0+${pol(r.dR,r.th)}+${pol(r.dX,r.th+90)}`},
  {t:'',f:`=${fm(r.re,1)}${sgn(r.im)}j${fm(Math.abs(r.im),1)}`},
  {t:label||'الجهد الداخلي:',v:`${fm(r.Em,0)} ∠ ${fm(r.Ea,1)}°`,unit:'V',final:true},
  {t:`ومن منحنى اللاحمل (الشكل 3-19) نقرأ تيار المجال المقابل للجهد ${lt(fm(r.Em,0)+' V')}:`,v:r.IF==null?'خارج المنحنى':r.IF,dp:1,unit:r.IF==null?'':'A',final:true}]}

/* ============================== Lesson 3.3 ============================== */
B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'100–101',
 title:'المخطط الاتجاهي للمولد التزامني',
 summary:'رسم الجهود والتيار متجهات: جهد الأطراف مرجع، ثم I·RA موازياً للتيار، ثم jXs·I عمودياً عليه، والمحصلة E. في الحمل المادي والحثي يكون E أكبر من V، وفي الحمل السعوي قد يكون أصغر.',
 stations:[
  {intro:true},

  {st:1,short:'ما المخطط الاتجاهي؟',title:'المخطط الاتجاهي للمولد التزامني <span class="ltr">Phasor Diagram</span>',ref:'ص 100',
   q:'المعادلة (3-9) فيها طرح جهود لها زوايا مختلفة… كيف نرى هذا الطرح بأعيننا بدل أن نحسبه بالأعداد المركبة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط اتجاهي لمولد يغذي حملاً حثياً: جهد الأطراف أفقي، والتيار متأخر تحته، ثم هبوط الجهد على المقاومة ثم على الممانعة التزامنية، والمحصلة هي الجهد الداخلي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="140" fill="#E6E2F8"/><g data-tip="جهد الأطراف ⟦Vph⟧: المرجع، يُرسم أفقياً."><line x1="46.0" y1="206.0" x2="226.0" y2="206.0" stroke="transparent" stroke-width="14"/><line x1="46.0" y1="206.0" x2="215.0" y2="206.0" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><polygon points="226.0,206.0 215.0,210.9 215.0,201.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph⟧: يُرسم بزاوية معامل القدرة θ عن ⟦Vph⟧."><line x1="46.0" y1="206.0" x2="123.9" y2="251.0" stroke="transparent" stroke-width="14"/><line x1="46.0" y1="206.0" x2="114.4" y2="245.5" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><polygon points="123.9,251.0 111.9,249.8 116.9,241.2" fill="#E8735A"/></g><g data-tip="هبوط الجهد على مقاومة المنتج ⟦Iph·RA⟧: يُرسم من رأس ⟦Vph⟧ موازياً للتيار."><line x1="226.0" y1="206.0" x2="252.0" y2="221.0" stroke="transparent" stroke-width="14"/><line x1="226.0" y1="206.0" x2="244.2" y2="216.5" stroke="#C99A1E" stroke-width="3.5" stroke-linecap="round"/><polygon points="252.0,221.0 242.2,220.0 246.2,213.0" fill="#C99A1E"/></g><g data-tip="هبوط الجهد على الممانعة التزامنية ⟦jXS·Iph⟧: يُرسم من رأس السهم السابق عمودياً على التيار (متقدماً عليه ⟦90°⟧)."><line x1="252.0" y1="221.0" x2="307.0" y2="125.7" stroke="transparent" stroke-width="14"/><line x1="252.0" y1="221.0" x2="301.5" y2="135.3" stroke="#2E8C83" stroke-width="3.5" stroke-linecap="round"/><polygon points="307.0,125.7 305.8,137.7 297.2,132.8" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: محصلة الأسهم كلها، من الأصل إلى رأس آخر سهم. والزاوية بينه وبين ⟦Vph⟧ هي δ."><line x1="46.0" y1="206.0" x2="307.0" y2="125.7" stroke="transparent" stroke-width="14"/><line x1="46.0" y1="206.0" x2="296.5" y2="129.0" stroke="#12855A" stroke-width="4.5" stroke-linecap="round"/><polygon points="307.0,125.7 297.9,133.7 295.0,124.2" fill="#12855A"/></g><g data-tip="زاوية القدرة δ: بين ⟦Vph⟧ و⟦Eph⟧."><path d="M108 206 A62 62 0 0 0 105.3 187.8" fill="none" stroke="#12855A" stroke-width="2"/><text x="120" y="198" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">δ</text></g><g data-tip="زاوية معامل القدرة θ بين التيار والجهد. في الحمل الحثي يتأخر التيار تحت ⟦Vph⟧."><path d="M86 206 A40 40 0 0 1 80.6 226.0" fill="none" stroke="#E8735A" stroke-width="2"/><text x="96" y="226" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">θ</text></g><text x="172" y="228" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan></text><text x="117.94228634059948" y="273.0" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">ph</tspan></text><text x="255.98076211353316" y="245.0" text-anchor="middle" font-size="13" fill="#C99A1E" font-weight="700" direction="ltr" font-family="var(--mono)">IR<tspan font-size="9" dy="4">A</tspan></text><text x="310.98076211353316" y="179.36860279185586" text-anchor="start" font-size="13" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="9" dy="4">S</tspan></text><text x="150" y="128" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan></text><g data-tip="الأصل: نقطة بداية ⟦Vph⟧ و⟦Iph⟧ و⟦Eph⟧."><circle cx="46" cy="206" r="5" fill="#2C4A40"/></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">حمل حثي: التيار متأخر عن الجهد</text></svg>`,
   cap:'سهم لكل حدّ في المعادلة <span class="ltr">(3-9)</span>: الداكن جهد الأطراف (المرجع)، والبرتقالي التيار، والذهبي هبوط الجهد على المقاومة، والفيروزي هبوط الجهد على الممانعة التزامنية، والأخضر الجهد الداخلي. الأطوال للتوضيح فقط.<br><b>مرّر المؤشر على الأسهم والزاويتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>بما أن الجهود والتيارات المتولدة في المولدات التزامنية هي كميات اتجاهية (ذات مقدار وزاوية) لذلك يستحسن رسم هذه الكميات مع بعضها البعض بشكل اتجاهي لنحصل على ما يسمى <b>بالمخطط الاتجاهي <span class="ltr">Phasor Diagram</span></b> للمولد التزامني. هذا المخطط يعتبر أداةً مهمة جداً لأنه يسهل فهم ودراسة وتحليل أداء المولد التزامني.</p>`,ref:'ص 100'},
    {predict:{q:'في المخطط الاتجاهي للمولد، أيّ كمية نرسمها أولاً أفقياً لتكون مرجع جميع القيم؟',opts:[
     [String.raw`الجهد الداخلي \(E_{ph}\)`,false,String.raw`\(E_{ph}\) هو آخر ما نرسمه: محصلة كل الجهود.`],
     [String.raw`تيار الوجه \(I_{ph}\)`,false,'التيار يُرسم بزاوية بالنسبة للمرجع، وزاويته هي زاوية معامل القدرة.'],
     [String.raw`جهد الأطراف \(V_{ph}\)`,true,'الكتاب: «جهد الأطراف يعتبر مرجع جميع القيم في المخطط الاتجاهي» (ص 100).']]}}
   ],
   body:[
    {tip:String.raw`<p>انقل حدود المعادلة (3-9) إلى طرف واحد فتصبح جمعاً:</p>
     <div class="eq">$$E_{ph}=V_{ph}+R_AI_{ph}+jX_SI_{ph}$$</div>
     <p>والجمع الاتجاهي معناه: ارسم الأسهم متتابعة، رأس كل سهم هو بداية الذي بعده، ثم صِل الأصل برأس آخر سهم. هذه هي الصورة التي استعملها الكتاب في حل مثال (3-1).</p>`,title:'من المعادلة إلى الرسم'},
    {title:'ارسم المخطط بنفسك خطوة خطوة',widget:(el,B)=>{
      let k='lag',st=1;
      const TH={unity:0,lag:-35,lead:35},C={V:'#2C4A40',I:'#E8735A',R:'#C99A1E',X:'#2E8C83',E:'#12855A'};
      const MSG=[
       'اختر نوع الحمل، ثم اضغط «الخطوة التالية».',
       'الخطوة 1: ارسم جهد الأطراف <i>V<sub>ph</sub></i> أفقياً. هو المرجع لكل ما بعده.',
       'الخطوة 2: ارسم التيار <i>I<sub>ph</sub></i> بزاوية θ: تحت المرجع للحمل الحثي، فوقه للحمل السعوي، وعليه للحمل المادي.',
       'الخطوة 3: من رأس <i>V<sub>ph</sub></i> ارسم <i>I<sub>ph</sub>R<sub>A</sub></i> <b>موازياً</b> للتيار (هبوط الجهد على المقاومة في طور التيار).',
       'الخطوة 4: من رأسه ارسم <i>jX<sub>S</sub>I<sub>ph</sub></i> <b>عمودياً</b> على التيار ومتقدماً عليه <span class="ltr">90°</span> (هذا معنى <i>j</i>).',
       'الخطوة 5: صِل الأصل برأس آخر سهم: هذا <i>E<sub>ph</sub></i>، والزاوية بينه وبين <i>V<sub>ph</sub></i> هي δ.'];
      el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">نوع الحمل</span><span class="mseg"><button type="button" data-k="unity">مادي</button><button type="button" data-k="lag">حثي</button><button type="button" data-k="lead">سعوي</button></span></div>
       <div data-o="svg" style="max-width:420px;margin:8px auto 0"></div>
       <p data-o="msg" style="min-height:3.2em;margin:6px 0 0"></p>
       <div class="w-row"><button class="btn pri" type="button" data-go>الخطوة التالية</button><button class="btn" type="button" data-rs>من البداية</button></div>`;
      const o=s=>el.querySelector(`[data-o="${s}"]`),go=el.querySelector('[data-go]');
      const ar=(x1,y1,x2,y2,c,w)=>{const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1),h=Math.min(11,L*.6),bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*.45,py=Math.cos(a)*h*.45;
        return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${c}" stroke-width="${w||3.5}" stroke-linecap="round"/><polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx+px).toFixed(1)},${(by+py).toFixed(1)} ${(bx-px).toFixed(1)},${(by-py).toFixed(1)}" fill="${c}"/>`};
      const tx=(x,y,b,s,c)=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="${c}" direction="ltr" font-family="var(--mono)">${b}<tspan font-size="10" dy="4">${s}</tspan></text>`;
      const draw=()=>{const t=TH[k]*Math.PI/180,ox=40,oy=130,P=(x,y,L,a)=>[x+L*Math.cos(a),y-L*Math.sin(a)];
        const Vt=[ox+150,oy],It=P(ox,oy,70,t),Rt=P(Vt[0],Vt[1],22,t),Xt=P(Rt[0],Rt[1],95,t+Math.PI/2);
        let s=`<svg viewBox="0 0 360 215" role="img" aria-label="مخطط اتجاهي يُرسم خطوة خطوة" style="font-family:var(--font);width:100%;height:auto"><rect x="0" y="0" width="360" height="215" rx="16" fill="#F3EEFB"/><circle cx="${ox}" cy="${oy}" r="4" fill="#2C4A40"/>`;
        if(st>=1)s+=ar(ox,oy,Vt[0],Vt[1],C.V,4)+tx(ox+95,oy+22,'V','ph',C.V);
        if(st>=2)s+=ar(ox,oy,It[0],It[1],C.I)+tx(It[0]-4,It[1]+(TH[k]>0?-10:TH[k]<0?22:-10),'I','ph',C.I);
        if(st>=3)s+=ar(Vt[0],Vt[1],Rt[0],Rt[1],C.R,3.5)+tx(Rt[0]+16,Rt[1]+(TH[k]>0?-8:20),'IR','A',C.R);
        if(st>=4)s+=ar(Rt[0],Rt[1],Xt[0],Xt[1],C.X)+tx((Rt[0]+Xt[0])/2+(TH[k]>0?-30:34),(Rt[1]+Xt[1])/2+4,'jX','S',C.X);
        if(st>=5){s+=ar(ox,oy,Xt[0],Xt[1],C.E,4.5)+tx((ox+Xt[0])/2-14,(oy+Xt[1])/2-10,'E','ph',C.E);
          const d=Math.atan2(oy-Xt[1],Xt[0]-ox),r=58;s+=`<path d="M${ox+r} ${oy} A${r} ${r} 0 0 0 ${(ox+r*Math.cos(d)).toFixed(1)} ${(oy-r*Math.sin(d)).toFixed(1)}" fill="none" stroke="${C.E}" stroke-width="2"/><text x="${ox+r+12}" y="${oy-6}" font-size="14" font-weight="700" fill="${C.E}">δ</text>`}
        o('svg').innerHTML=s+'</svg>';
        let m=MSG[st];
        if(st>=5){const E=Math.hypot(Xt[0]-ox,Xt[1]-oy);m+=E>150?' <b>لاحظ: \\(E_{ph}\\) أطول من \\(V_{ph}\\).</b>':' <b>لاحظ: \\(E_{ph}\\) هنا أقصر من \\(V_{ph}\\).</b>'}
        o('msg').innerHTML=m;B.math(o('msg'));go.disabled=st>=5;
        el.querySelectorAll('.mseg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k))};
      el.querySelectorAll('.mseg button').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
      go.onclick=()=>{st=Math.min(5,st+1);draw()};
      el.querySelector('[data-rs]').onclick=()=>{st=0;draw()};
      draw();
    }},
    {watch:String.raw`<p>اتجاه \(I_{ph}R_A\) هو اتجاه <b>التيار</b> لا اتجاه \(V_{ph}\). في الحمل المادي فقط يقعان على خط واحد، أما في الحمل الحثي أو السعوي فيميل \(I_{ph}R_A\) مع التيار. وكذلك \(jX_SI_{ph}\) عمودي على <b>التيار</b>، لا على \(V_{ph}\).</p>`}
   ]},

  {st:2,short:'ثلاثة أحمال',title:'المخطط الاتجاهي في الأحمال الثلاثة: مادي وحثي وسعوي',ref:'ص 100–101',
   q:'هل يحتاج المولد جهداً داخلياً أكبر أم أصغر ليحافظ على جهد أطرافه؟ وهل يتوقف الجواب على نوع الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة مخططات اتجاهية كالشكل ثلاثة-تسعة: حمل مادي وحمل حثي وحمل سعوي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="140" fill="#FBE6C4"/><path d="M30 134H330M30 226H330" stroke="#CFC6B4" stroke-width="1.5"/><g data-tip="جهد الأطراف ⟦Vph⟧: المرجع، يُرسم أفقياً."><line x1="50.0" y1="96.0" x2="160.0" y2="96.0" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="96.0" x2="149.0" y2="96.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="160.0,96.0 149.0,101.0 149.0,91.0" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph⟧: يُرسم بزاوية معامل القدرة θ عن ⟦Vph⟧."><line x1="50.0" y1="96.0" x2="90.0" y2="96.0" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="96.0" x2="81.0" y2="96.0" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="90.0,96.0 81.0,100.0 81.0,92.0" fill="#E8735A"/></g><g data-tip="هبوط الجهد على مقاومة المنتج ⟦Iph·RA⟧: يُرسم من رأس ⟦Vph⟧ موازياً للتيار."><line x1="160.0" y1="96.0" x2="172.0" y2="96.0" stroke="transparent" stroke-width="14"/><line x1="160.0" y1="96.0" x2="165.0" y2="96.0" stroke="#C99A1E" stroke-width="3" stroke-linecap="round"/><polygon points="172.0,96.0 165.0,99.2 165.0,92.8" fill="#C99A1E"/></g><g data-tip="هبوط الجهد على الممانعة التزامنية ⟦jXS·Iph⟧: يُرسم من رأس السهم السابق عمودياً على التيار (متقدماً عليه ⟦90°⟧)."><line x1="172.0" y1="96.0" x2="172.0" y2="41.0" stroke="transparent" stroke-width="14"/><line x1="172.0" y1="96.0" x2="172.0" y2="50.0" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="172.0,41.0 176.1,50.0 167.9,50.0" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: محصلة الأسهم كلها، من الأصل إلى رأس آخر سهم. والزاوية بينه وبين ⟦Vph⟧ هي δ."><line x1="50.0" y1="96.0" x2="172.0" y2="41.0" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="96.0" x2="162.0" y2="45.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="172.0,41.0 164.0,50.0 159.9,41.0" fill="#12855A"/></g><g data-tip="جهد الأطراف ⟦Vph⟧: المرجع، يُرسم أفقياً."><line x1="50.0" y1="184.0" x2="160.0" y2="184.0" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="184.0" x2="149.0" y2="184.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="160.0,184.0 149.0,188.9 149.0,179.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph⟧: يُرسم بزاوية معامل القدرة θ عن ⟦Vph⟧."><line x1="50.0" y1="184.0" x2="82.8" y2="206.9" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="184.0" x2="75.4" y2="201.8" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="82.8,206.9 73.1,205.1 77.7,198.5" fill="#E8735A"/></g><g data-tip="هبوط الجهد على مقاومة المنتج ⟦Iph·RA⟧: يُرسم من رأس ⟦Vph⟧ موازياً للتيار."><line x1="160.0" y1="184.0" x2="169.8" y2="190.9" stroke="transparent" stroke-width="14"/><line x1="160.0" y1="184.0" x2="164.1" y2="186.9" stroke="#C99A1E" stroke-width="3" stroke-linecap="round"/><polygon points="169.8,190.9 162.3,189.4 165.9,184.3" fill="#C99A1E"/></g><g data-tip="هبوط الجهد على الممانعة التزامنية ⟦jXS·Iph⟧: يُرسم من رأس السهم السابق عمودياً على التيار (متقدماً عليه ⟦90°⟧)."><line x1="169.8" y1="190.9" x2="201.4" y2="145.8" stroke="transparent" stroke-width="14"/><line x1="169.8" y1="190.9" x2="196.2" y2="153.2" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="201.4,145.8 199.5,155.5 192.9,150.9" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: محصلة الأسهم كلها، من الأصل إلى رأس آخر سهم. والزاوية بينه وبين ⟦Vph⟧ هي δ."><line x1="50.0" y1="184.0" x2="201.4" y2="145.8" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="184.0" x2="190.7" y2="148.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="201.4,145.8 191.9,153.3 189.5,143.7" fill="#12855A"/></g><g data-tip="جهد الأطراف ⟦Vph⟧: المرجع، يُرسم أفقياً."><line x1="50.0" y1="276.0" x2="160.0" y2="276.0" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="276.0" x2="149.0" y2="276.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="160.0,276.0 149.0,280.9 149.0,271.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph⟧: يُرسم بزاوية معامل القدرة θ عن ⟦Vph⟧."><line x1="50.0" y1="276.0" x2="82.8" y2="253.1" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="276.0" x2="75.4" y2="258.2" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="82.8,253.1 77.7,261.5 73.1,254.9" fill="#E8735A"/></g><g data-tip="هبوط الجهد على مقاومة المنتج ⟦Iph·RA⟧: يُرسم من رأس ⟦Vph⟧ موازياً للتيار."><line x1="160.0" y1="276.0" x2="169.8" y2="269.1" stroke="transparent" stroke-width="14"/><line x1="160.0" y1="276.0" x2="164.1" y2="273.1" stroke="#C99A1E" stroke-width="3" stroke-linecap="round"/><polygon points="169.8,269.1 165.9,275.7 162.3,270.6" fill="#C99A1E"/></g><g data-tip="هبوط الجهد على الممانعة التزامنية ⟦jXS·Iph⟧: يُرسم من رأس السهم السابق عمودياً على التيار (متقدماً عليه ⟦90°⟧)."><line x1="169.8" y1="269.1" x2="138.3" y2="224.1" stroke="transparent" stroke-width="14"/><line x1="169.8" y1="269.1" x2="143.4" y2="231.4" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="138.3,224.1 146.8,229.1 140.1,233.8" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: محصلة الأسهم كلها، من الأصل إلى رأس آخر سهم. والزاوية بينه وبين ⟦Vph⟧ هي δ."><line x1="50.0" y1="276.0" x2="138.3" y2="224.1" stroke="transparent" stroke-width="14"/><line x1="50.0" y1="276.0" x2="128.8" y2="229.6" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="138.3,224.1 131.3,233.9 126.3,225.4" fill="#12855A"/></g>
<text x="282" y="80" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">حمل مادي</text><text x="282" y="98" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(a)</text>
<text x="282" y="172" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">حمل حثي</text><text x="282" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(b)</text>
<text x="282" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">حمل سعوي</text><text x="282" y="280" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(c)</text></svg>`,
   cap:'الحالات الثلاث للشكل <span class="ltr">(3-9)</span> بالألوان نفسها: الداكن <span class="ltr">V<sub>ph</sub></span>، والبرتقالي التيار، والذهبي <span class="ltr">I<sub>ph</sub>R<sub>A</sub></span>، والفيروزي <span class="ltr">jX<sub>S</sub>I<sub>ph</sub></span>، والأخضر <span class="ltr">E<sub>ph</sub></span>. قارن طول الأخضر بالداكن في كل حالة.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>الشكل (3-9) يوضح المخطط الاتجاهي المصاحب للمعادلة (3-9) في ثلاث حالات عند تحميل المولد (حمل مادي أو حمل حثي أو حمل سعوي)، ويلاحظ أن <b>جهد الأطراف يعتبر مرجع جميع القيم</b> في المخطط الاتجاهي و\(E_{ph}\) هو أيضاً محصلة جميع الجهود داخل المولد، وهذا مطابق تماماً للدائرة المكافئة في الشكل (3-7).</p>`,ref:'ص 100'}
   ],
   body:[
    {tip:String.raw`<ul><li><b>(a) حمل مادي (معامل القدرة = 1):</b> \(I_{ph}\) على اتجاه \(V_{ph}\) نفسه، فيأتي \(I_{ph}R_A\) امتداداً أفقياً لـ\(V_{ph}\)، ثم \(jX_SI_{ph}\) رأسياً لأعلى.</li>
     <li><b>(b) حمل حثي (التيار متأخر):</b> \(I_{ph}\) تحت \(V_{ph}\)، فيميل \(jX_SI_{ph}\) إلى الأعلى واليمين، ويخرج \(E_{ph}\) <b>أطول بكثير</b> من \(V_{ph}\).</li>
     <li><b>(c) حمل سعوي (التيار متقدم):</b> \(I_{ph}\) فوق \(V_{ph}\)، فيتجه \(jX_SI_{ph}\) إلى الأعلى واليسار، و\(E_{ph}\) <b>قد يكون أصغر</b> من \(V_{ph}\).</li></ul>
     <p>والنتيجة العملية: كلما كان \(E_{ph}\) المطلوب أكبر احتجنا تيار مجال أكبر للمحافظة على جهد الأطراف.</p>`,title:'ماذا ترى في الشكل (3-9)؟'},
    {predict:{q:String.raw`في أيّ نوع من الأحمال قد يكون الجهد الداخلي \(E_{ph}\) <b>أصغر</b> من جهد الأطراف \(V_{ph}\)؟`,opts:[
     ['الحمل الحثي',false,String.raw`في الحثي يميل \(jX_SI_{ph}\) إلى الخارج فيطول \(E_{ph}\) كثيراً.`],
     ['الحمل السعوي',true,String.raw`التيار المتقدم يجعل \(jX_SI_{ph}\) يتجه إلى الخلف (أعلى-يسار) فيقصر \(E_{ph}\). ستراه بالأرقام في مثال (3-1) و: \(E_{ph}=451\ \text{V}\) بينما \(V_{ph}=480\ \text{V}\).`],
     ['الحمل المادي',false,String.raw`في المادي يضاف \(jX_SI_{ph}\) عمودياً فيكون \(E_{ph}\) أطول من \(V_{ph}\) دائماً (وتر المثلث القائم).`]]}},
    {add:String.raw`<p>هذا يفسّر ما يحدث في الشبكات: الأحمال الحثية (المحركات والمكيفات) تتطلب من المولد تيار مجال أكبر ليحافظ على الجهد، والأحمال السعوية (مثل المكثفات التي تُركّب لتحسين معامل القدرة) تقلل الحاجة إليه.</p>`,title:'في الواقع'}
   ]},

  {recap:[
   String.raw`المخطط الاتجاهي يرسم الجهود والتيار كأسهم ذات مقدار وزاوية، وجهد الأطراف \(V_{ph}\) هو المرجع (ص 100).`,
   String.raw`من المعادلة (3-9): \(E_{ph}=V_{ph}+R_AI_{ph}+jX_SI_{ph}\) — نرسم \(I_{ph}R_A\) موازياً للتيار، و\(jX_SI_{ph}\) عمودياً عليه، والمحصلة \(E_{ph}\) بزاوية δ عن \(V_{ph}\).`,
   String.raw`الحمل المادي والحثي: \(E_{ph}\) أكبر من \(V_{ph}\) (وفي الحثي أكبر بكثير)، والحمل السعوي: قد يكون \(E_{ph}\) أصغر من \(V_{ph}\) — الشكل (3-9).`]}
],
 theory:[
  {h:'المخطط الاتجاهي Phasor Diagram',ref:'ص 100',html:`<p>«بما أن الجهود والتيارات المتولدة في المولدات التزامنية هي كميات اتجاهية (ذات مقدار وزاوية) لذلك يستحسن رسم هذه الكميات مع بعضها البعض بشكل اتجاهي لنحصل على ما يسمى <b>بالمخطط الاتجاهي <span class="ltr">Phasor Diagram</span></b>». هذا المخطط «أداة مهمة جداً لأنه يسهل فهم ودراسة وتحليل أداء المولد التزامني».</p>
   <p>الشكل (3-9) يوضح المخطط الاتجاهي المصاحب للمعادلة (3-9) في ثلاث حالات للتحميل (حمل مادي أو حثي أو سعوي). ويلاحظ أن <b>جهد الأطراف يعتبر مرجع جميع القيم</b> في المخطط، و\\(E_{ph}\\) هو محصلة جميع الجهود داخل المولد، «وهذا مطابق تماماً للدائرة المكافئة في الشكل (3-7)».</p>
   $$E_{ph}=V_{ph}+R_AI_{ph}+jX_SI_{ph}$$`},
  {fig:'(3-9)',ref:'ص 101',caption:'المخطط الاتجاهي للمولد التزامني عندما يكون الحمل مادي (a) وعندما يكون الحمل حثي (b) وعندما يكون الحمل سعوي (c) — أُعيد رسمه بمقادير مكبّرة للوضوح',draw:fig39},
  {html:`<ul><li><b>(a) حمل مادي (معامل قدرة = 1):</b> \\(I_{Ph}\\) في نفس اتجاه \\(V_{Ph}\\)، يليه \\(I_{Ph}R_A\\) أفقياً امتداداً لـ\\(V_{Ph}\\)، ثم \\(jX_SI_{Ph}\\) رأسياً لأعلى؛ \\(E_{Ph}\\) من الأصل إلى رأس \\(jX_SI_{Ph}\\)، والزاوية \\(\\delta\\) بين \\(V_{Ph}\\) و\\(E_{Ph}\\).</li>
   <li><b>(b) حمل حثي (التيار متأخر):</b> \\(I_{Ph}\\) تحت \\(V_{Ph}\\)؛ \\(I_{Ph}R_A\\) من رأس \\(V_{Ph}\\) موازياً لـ\\(I_{Ph}\\)، ثم \\(jX_SI_{Ph}\\) عمودياً على \\(I_{Ph}\\)؛ و\\(E_{Ph}\\) أطول بكثير من \\(V_{Ph}\\).</li>
   <li><b>(c) حمل سعوي (التيار متقدم):</b> \\(I_{Ph}\\) فوق \\(V_{Ph}\\)؛ \\(jX_SI_{Ph}\\) يتجه لأعلى-يسار؛ و\\(E_{Ph}\\) قد يكون أصغر من \\(V_{Ph}\\).</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف ترسمه بيدك:</b> (1) ارسم \\(V_{ph}\\) أفقياً. (2) ارسم اتجاه التيار بزاوية θ (تحت للحثي، فوق للسعوي). (3) من رأس \\(V_{ph}\\) ارسم \\(I R_A\\) <b>موازياً</b> للتيار. (4) من رأسه ارسم \\(X_S I\\) <b>عمودياً</b> على التيار (دوران 90° للأمام). (5) صِل الأصل برأس الخط الأخير: هذا \\(E_{ph}\\). كلما كان طول \\(E_{ph}\\) أكبر من \\(V_{ph}\\) احتجنا تيار مجال أكبر.'},
  {note:'في «المختبر» مخطط حي بأرقام مثالي (3-1) و(3-2): غيّر معامل القدرة والتيار وشاهد الحالات الثلاث، ومعامل تنظيم الجهد (المعادلة 3-13، الدرس التالي). وفي «الأمثلة المحلولة» حاسبة مثال (3-1) جـ و و.'}
 ],
 lab:(el)=>{
  const PR={ex31:{V:480,RA:0.015,XS:0.1,Ir:692.8,E:532,ram:0.05,xsm:0.3,lab:'مثال (3-1): دلتا 480 V'},ex32:{V:277,RA:0,XS:1,Ir:60,E:277,ram:0.5,xsm:3,lab:'مثال (3-2): نجمة 480 V'}};
  let pr='ex31',mag=4,mode='V',I=692.8,pf=0.8,kind='lag',RA=0.015,XS=0.1,lastS='',seen={a:0,b:0,c:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>المخطط الاتجاهي الحي <small>مبنية على الشكل (3-9) ص 101</small></h2>
    <div class="sg-row">${segHTML('pr',[['ex31','أرقام مثال (3-1)'],['ex32','أرقام مثال (3-2)']],pr)}</div>
    <div class="sg-row">${segHTML('md',[['V','جهد الأطراف ثابت (نحسب E)'],['E','الجهد الداخلي ثابت (نحسب V)']],mode)}</div>
    <div class="sg-row"><span>رسم أسهم الهبوط:</span>${segHTML('mg',[[1,'بمقياسها الحقيقي'],[4,'مكبّرة ×4 للوضوح']],4)}</div><div id="l3s" class="svgbox" style="max-width:560px;margin-inline:auto"></div>
    <div id="l3c" class="sg-msg"></div></div>
   <div class="panel c5"><h2>التحكم والقراءات</h2>
    <div id="l3ctl"></div>
    <div class="sg-row">${segHTML('k3',[['lag','متأخر (حثي)'],['unity','مادي (1)'],['lead','متقدم (سعوي)']],kind)}</div>
    <div class="facts">${fact('<bdi dir="ltr">V<sub>ph</sub></bdi>','l3v')}${fact('<bdi dir="ltr">E<sub>ph</sub></bdi>','l3e')}${fact('زاوية القدرة δ','l3d')}${fact('معامل تنظيم الجهد (3-13)','l3r')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const ctl=()=>{const p=PR[pr];$('#l3ctl').innerHTML=sl('l3i','تيار الوجه <span class="ltr">I<sub>ph</sub></span>',0,+(p.Ir*1.5).toFixed(1),0.1,I)+sl('l3p','معامل القدرة <span class="ltr">cos θ</span>',0.3,1,0.01,pf)+sl('l3ra','مقاومة المنتج <span class="ltr">R<sub>A</sub></span>',0,p.ram,p.ram/100,RA)+sl('l3x','الممانعة التزامنية <span class="ltr">X<sub>S</sub></span>',0,p.xsm,p.xsm/100,XS)+`<p class="sub">${p.lab}. في وضع «E ثابت» يبقى <span class="ltr">E<sub>ph</sub> = ${p.E} V</span> كما ضُبط عند اللاحمل أو في الحمل.</p>`;
   $('#l3i').oninput=e=>{I=+e.target.value};$('#l3p').oninput=e=>{pf=+e.target.value};$('#l3ra').oninput=e=>{RA=+e.target.value};$('#l3x').oninput=e=>{XS=+e.target.value};lastS=''};
  segOn(el,'pr',v=>{pr=v;const p=PR[pr];mag=pr==='ex31'?4:1;segSet(el,'mg',mag);I=p.Ir;RA=p.RA;XS=p.XS;pf=0.8;mode=pr==='ex32'?'E':'V';segSet(el,'md',mode);kind='lag';segSet(el,'k3','lag');ctl()});
  segOn(el,'mg',v=>{mag=+v;lastS=''});segOn(el,'md',v=>{mode=v;lastS=''});segOn(el,'k3',v=>{kind=v;lastS=''});ctl();
  const calc=()=>{const p=PR[pr],th=kind==='unity'?0:(kind==='lag'?-1:1)*Math.acos(pf)/D,Ic=cpol(I,th);
   if(mode==='V'){const E=cadd(Cx(p.V),cmul(Cx(RA,XS),Ic));return {ok:1,V:p.V,E,th,Ic}}
   const z=cmul(Cx(RA,XS),Ic),E0=p.E;if(E0*E0<z.im*z.im)return {ok:0,th};const V=Math.sqrt(E0*E0-z.im*z.im)-z.re;if(V<=0)return {ok:0,th};return {ok:1,V,E:cadd(Cx(V),z),th,Ic}};
  const steps=stepsUI($('#l3st'),[
   {t:'الحالة (a)',x:'اختر «مادي (1)»: التيار في اتجاه \\(V_{ph}\\) و\\(jX_SI\\) رأسي. \\(E_{ph}\\) أكبر قليلاً من \\(V_{ph}\\).',done:()=>seen.a},
   {t:'الحالة (b)',x:'اختر «متأخر»: \\(E_{ph}\\) أطول بكثير من \\(V_{ph}\\). بأرقام مثال (3-1) و<span class="ltr">cos θ = 0.8</span> تحصل على <span class="ltr">532∠5.3 V</span>.',done:()=>seen.b},
   {t:'الحالة (c)',x:'اختر «متقدم» واخفض معامل القدرة إلى <span class="ltr">0.8</span> أو أقل: يصبح \\(E_{ph}\\) <b>أصغر</b> من \\(V_{ph}\\) ومعامل تنظيم الجهد سالباً.',done:()=>seen.c},
   {t:'الجهد الداخلي ثابت',x:'اختر «أرقام مثال (3-2)» (وضع E ثابت = <span class="ltr">277 V</span>). بدّل بين الحالات الثلاث: جهد الأطراف <span class="ltr">236.8</span> ثم <span class="ltr">270.4</span> ثم <span class="ltr">308.8 V</span>، وهي أرقام الكتاب.',done:()=>pr==='ex32'&&mode==='E'&&kind==='lead'},
   {t:'أثر التيار',x:'قلّل التيار إلى الصفر: تختفي أسهم الهبوط ويصبح \\(E_{ph}=V_{ph}\\) (اللاحمل).',done:()=>I<1}
  ]);
  loopOn(el,()=>{const p=PR[pr];$('#l3i-v').textContent=fm(I,1)+' A';$('#l3p-v').textContent=kind==='unity'?'1 (مادي)':fm(pf,2);$('#l3ra-v').textContent=fm(RA,4)+' Ω';$('#l3x-v').textContent=fm(XS,3)+' Ω';
   const sg=[pr,mag,mode,I,pf,kind,RA,XS].join();if(sg===lastS){steps.check();return}lastS=sg;
   const r=calc();if(!r.ok){$('#l3s').innerHTML='';$('#l3c').innerHTML='<div class="callout err">لا يستطيع هذا الجهد الداخلي أن يمرر هذا التيار في هذه الممانعة: قلّل التيار أو \\(X_S\\).</div>';B.math($('#l3c'));['l3v','l3e','l3d','l3r'].forEach(i=>$('#'+i).textContent='—');steps.check();return}
   $('#l3s').innerHTML=phasorSVG({V:r.V,I:r.Ic,RA,XS,Iref:p.Ir,mag});
   const Em=cabs(r.E),dl=cang(r.E),VR=(Em-r.V)/r.V*100;
   $('#l3v').textContent=fm(r.V,1)+' V';$('#l3e').textContent=fm(Em,1)+' V';$('#l3d').textContent=fm(dl,2)+'°';$('#l3r').textContent=fm(VR,2)+' %';
   if(I>1){if(kind==='unity')seen.a=1;if(kind==='lag'&&Em>r.V)seen.b=1;if(kind==='lead'&&Em<r.V)seen.c=1}
   const cs=kind==='unity'?'(a) مادي':kind==='lag'?'(b) حثي':'(c) سعوي';
   $('#l3c').innerHTML=`<div class="callout${Em<r.V?' err':''}">الحالة ${cs}: \\(E_{ph}\\) ${Em>r.V+0.05?'<b>أكبر</b> من':Em<r.V-0.05?'<b>أصغر</b> من':'يساوي تقريباً'} \\(V_{ph}\\). ${mode==='V'?`لكي يبقى \\(V_{ph}=${p.V}\\ V\\) نضبط تيار المجال ليعطي <span class="ltr">E<sub>ph</sub> = ${fm(Em,1)} V</span>.`:`الجهد الداخلي ثابت <span class="ltr">${p.E} V</span> فيتغير جهد الأطراف إلى <span class="ltr">${fm(r.V,1)} V</span> (الخطي <span class="ltr">${fm(r.V*SQ3,1)} V</span>).`}</div>`;B.math($('#l3c'));
   steps.check()});
 },
 examples:[
  {title:'مثال (3-1) جـ — تيار المجال عند حمل 0.8 متأخر',ref:'ص 115',
   q:'<p>«مولد تزامني ذو أربعة أقطاب ملفاته موصلة على شكل دلتا، جهد الأطراف له <span class="ltr">480 V</span> … الممانعة التزامنية له <span class="ltr">0.1 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.015 Ω</span> … جـ) تيار المجال لكي يحافظ المولد على جهد الأطراف عند <span class="ltr">480 V</span> إذا كان يغذي حمل بتيار مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر».</p>',
   given:[{id:'V',label:'جهد الأطراف (دلتا: جهد الوجه = الخطي)',sym:'V_{Ph}',unit:'V',value:480},{id:'IL',label:'تيار الخط',sym:'I_L',unit:'A',value:1200},{id:'pf',label:'معامل القدرة (متأخر)',sym:'\\cos\\theta',unit:'',value:0.8},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:0.1}],
   solve:(g)=>ex31Steps(g,false),
   note:'تيار المجال يُقرأ من منحنى اللاحمل (الشكل 3-19 ص 114). المنحنى هنا مرسوم من قراءات تقريبية للشكل، لكنه يمر بالنقاط التي استعملها الكتاب: <span class="ltr">480 V ↔ 4.5 A</span> و <span class="ltr">532 V ↔ 5.7 A</span> و <span class="ltr">451 V ↔ 4.1 A</span>.'},
  {title:'مثال (3-1) و — تيار المجال عند حمل 0.8 متقدم',ref:'ص 116',
   q:'<p>«و) تيار المجال لكي يبقى جهد الأطراف عند <span class="ltr">480 V</span> إذا كان المولد يغذي حمل بتيار قدره <span class="ltr">1200 A</span> عند معامل [قدرة] <span class="ltr">0.8</span> متقدم».</p>',
   given:[{id:'V',label:'جهد الأطراف',sym:'V_{Ph}',unit:'V',value:480},{id:'IL',label:'تيار الخط',sym:'I_L',unit:'A',value:1200},{id:'pf',label:'معامل القدرة (متقدم)',sym:'\\cos\\theta',unit:'',value:0.8},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:0.1}],
   solve:(g)=>ex31Steps(g,true),
   note:'الكتاب: <span class="ltr">446.7 + j61.7 = 451∠7.9 V</span> وتيار المجال <span class="ltr">4.1 A</span>. لاحظ أن الحمل المتقدم يحتاج تيار مجال <b>أقل</b> من اللاحمل (4.5 A).'}
 ],
 quiz:[
  {q:'في المخطط الاتجاهي للمولد، مرجع جميع القيم هو:',o:['الجهد الداخلي E<sub>ph</sub>','جهد الأطراف V<sub>ph</sub>','تيار المجال','الممانعة التزامنية'],c:1,e:'ص 100.'},
  {q:'السهم I<sub>ph</sub>R<sub>A</sub> يُرسم:',o:['عمودياً على التيار','موازياً للتيار','موازياً لـ E','بعكس V'],c:1,e:'الشكل (3-9): هبوط المقاومة في طور التيار.'},
  {q:'السهم jX<sub>S</sub>I<sub>ph</sub> يُرسم:',o:['موازياً للتيار','عمودياً على التيار (متقدم عليه 90°)','عمودياً على V دائماً','بعكس التيار'],c:1,e:'الحرف j يعني دوران 90°.'},
  {q:'في الحمل الحثي يكون:',o:['E<sub>ph</sub> أكبر بكثير من V<sub>ph</sub>','E<sub>ph</sub> أصغر من V<sub>ph</sub>','E<sub>ph</sub> = 0','V<sub>ph</sub> = 0'],c:0,e:'الشكل (3-9 b).'},
  {q:'الحالة التي قد يكون فيها E<sub>ph</sub> أصغر من V<sub>ph</sub>:',o:['حمل مادي','حمل حثي','حمل سعوي','اللاحمل'],c:2,e:'الشكل (3-9 c).'},
  {q:'الزاوية δ في المخطط هي الزاوية بين:',o:['V و I','E و V','I و E<sub>AR</sub>','R<sub>A</sub> و X<sub>S</sub>'],c:1,e:'الشكل (3-9).'},
  {q:'في مثال (3-1) جـ الجهد الداخلي اللازم:',o:['480 V','451∠7.9 V','532∠5.3 V','277 V'],c:2,e:'529.9 + j49.2 = 532∠5.3 V.'}
 ]
});

/* ---------- simple SVG x-y plot ---------- */
function svgPlot(o){const W=o.w||520,H=o.h||280,L=o.left||50,R=16,T=16,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">`;
  if(o.under)s+=o.under(X,Y);
  (o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+laT(L-6,Y(v)+4,o.yf?o.yf(v):v,{a:'end',cls:'m'})});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+laT(X(v),H-Bm+15,o.xf?o.xf(v):v,{cls:'m'})});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1.2"/>`;
  if(o.x0<0&&o.x1>0)s+=`<path d="M${fx(X(0))} ${T}V${H-Bm}" stroke="var(--fg)" stroke-width="1.2"/>`;
  if(o.xl)s+=laT(W-R,H-6,o.xl,{a:'end'});if(o.yl)s+=laT(L+6,T+10,o.yl,{a:'start'});
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return s+'</svg>'}

/* ---------- الشكلان (3-10) و(3-12): test set-up ---------- */
function testSVG(mode,o){o=o||{};const sc=mode==='short',live=o.live&&o.If>0;
  let s=`<svg viewBox="0 0 560 250" role="img" aria-label="${sc?'الآلة التزامنية أثناء اختبار الدائرة المقصورة':'الآلة التزامنية أثناء اختبار اللاحمل'}">`;
  s+=`<path d="M20 95L110 110V160L20 175Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`+arT(65,200,'التربينة',{fs:13});
  s+=`<rect x="110" y="128" width="64" height="9" fill="var(--wire)"/>`+`<path d="M130 116A16 8 0 1 1 150 116" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`+arrow(146,112,152,117,'--fg',1.4)+laT(142,104,'ns',{fs:12});
  s+=`<circle cx="220" cy="133" r="46" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+laT(220,138,'G',{fs:16})+arT(220,200,'المولد',{fs:13});
  // field circuit
  const fc=live?'w flow':'w';
  s+=`<path class="${fc}" d="M60 30H190M250 30H300V58H40V30H60"/>`;
  s+=`<path class="${fc}" d="${coilP(190,30,250,4)}"/>`+laT(220,18,'Φ',{fs:13});
  s+=`<rect x="70" y="44" width="2" height="28" fill="var(--fg)"/><rect x="78" y="50" width="4" height="16" fill="var(--fg)"/>`;
  s+=`<path d="M40 30V58" class="${fc}"/>`;
  s+=arrow(58,74,96,40,'--fg',1.2)+laT(88,84,'+ −',{fs:11,cls:'m'});
  s+=`<circle cx="150" cy="30" r="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+laT(150,34,'A',{fs:12})+laT(150,12,`IF${o.If!=null?' = '+fm(o.If,2)+' A':''}`,{fs:11,col:'--blue'});
  s+=`<path d="M220 87V58" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  // terminals
  const ty=[96,120,144,168],tl=['1','2','3','N'];const ac=live&&sc?'w flow':live?'w live':'w';
  ty.forEach((y,i)=>{const x0=220+Math.sqrt(46*46-(y-133)**2);s+=`<path class="${i<3||!sc?ac:'w'}" d="M${fx(x0)} ${y}H${sc&&i<3?370:340}"/>`+laT(330,y-4,tl[i],{fs:11,cls:'m'});if(!(sc&&i<3))s+=`<circle cx="340" cy="${y}" r="3.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`});
  if(sc){s+=`<path class="${ac}" d="M370 96V144"/><circle cx="300" cy="96" r="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+laT(300,100,'A',{fs:12})+laT(400,124,`ISC${o.Isc!=null?' = '+fm(o.Isc,1)+' A':''}`,{a:'start',fs:12,col:o.over?'--stop':'--blue'})}
  else{s+=`<path class="${live?'w live':'w'}" d="M340 144H420V140M340 168H420V172"/><circle cx="420" cy="156" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+laT(420,160,'V',{fs:12})+laT(442,160,`Eph${o.E!=null?' = '+fm(o.E,1)+' V':''}`,{a:'start',fs:12,col:'--blue'})}
  return s+'</svg>'}
const KSC=AIRGAP/Math.hypot(0.1,0.015),IRATED=692.8,RA31=0.015;   // S.C.C slope (A per A of field) — توضيحي
const xsOf=If=>{const Zs=occ(If)/(KSC*If);return Math.sqrt(Math.max(0,Zs*Zs-RA31*RA31))};
function fig311(){return svgPlot({x0:0,x1:10,y0:0,y1:700,xt:[],yt:[],xl:'IF',yl:'EPh',aria:'منحنى اللاحمل',
  under:(X,Y)=>`<rect x="${X(0)}" y="${Y(700)}" width="${X(3.2)-X(0)}" height="${Y(0)-Y(700)}" fill="var(--blue-soft)" opacity=".5"/>`,
  series:[{pts:[[0,0],[5.6,672]],col:'--muted',dash:'6 5',w:1.8},{pts:samp(occ,0,10),col:'--live'}],
  extra:(X,Y)=>laT(X(1.4),Y(60),'(1)',{fs:14,col:'--blue'})+laT(X(7),Y(500),'(2)',{fs:14,col:'--blue'})+laT(X(8.2),Y(605),'O.C.C',{fs:12,col:'--live'})+arT(X(5.5),Y(690),'خط الثغرة الهوائية',{fs:12,a:'start',col:'--muted'})})}
function fig313(){return svgPlot({x0:0,x1:10,y0:0,y1:10,xt:[],yt:[],xl:'IF',yl:'Isc',aria:'منحنى الدائرة المقصورة',series:[{pts:[[0,0],[9.5,9]],col:'--blue'}],extra:(X,Y)=>laT(X(7),Y(7.6),'S.C.C',{fs:12,col:'--blue'})})}
function fig314(){return svgPlot({x0:0,x1:10,y0:0,y1:1.15,xt:[],yt:[],xl:'IF',yl:'Xs , Isc , EPh',aria:'العلاقة بين الممانعة التزامنية وتيار المجال',
  series:[{pts:[[0,0],[5.6,672/600]],col:'--muted',dash:'6 5',w:1.6},{pts:samp(x=>occ(x)/600,0,10),col:'--live'},{pts:[[0,0],[10,0.95]],col:'--blue'},{pts:samp(x=>xsOf(Math.max(0.05,x))/0.1*0.5,0.05,10),col:'--on',w:2.8}],
  extra:(X,Y)=>laT(X(9.3),Y(1.02),'O.C.C',{fs:12,col:'--live',a:'end'})+laT(X(9.3),Y(0.83),'S.C.C',{fs:12,col:'--blue',a:'end'})+laT(X(9.3),Y(0.3),'Xs',{fs:13,col:'--on',a:'end'})})}

/* ============================== Lesson 3.4 ============================== */
B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'101–105',
 title:'اختبارا اللاحمل والقصر، والممانعة التزامنية، ومعامل تنظيم الجهد',
 summary:'منحنى الدائرة المفتوحة O.C.C بمنطقتيه وخط الثغرة الهوائية، ومنحنى القصر S.C.C، وحساب Zs ثم Xs عند كل تيار مجال، ثم معامل تنظيم الجهد ومعناه.',
 stations:[
  {intro:true},

  {st:1,short:'لماذا نختبر؟',title:'اختبارات المولد التزامني',ref:'ص 101',
   q:'كيف نعرف قيمة الممانعة التزامنية لمولد حقيقي لا نعرف تفاصيل لفّه؟ هل نفكّه، أم نكتفي بقياسات من الخارج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="اختباران: اللاحمل بأطراف مفتوحة وفولتميتر، والقصر بأطراف مقصورة وأميتر، ونتيجتهما منحنيات الخواص وعناصر الدائرة المكافئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="اختبار اللاحمل (الدائرة المفتوحة): الأطراف مفتوحة، ونقيس الجهد المتولد ⟦Eph⟧ مقابل تيار المجال ⟦IF⟧."><rect x="196" y="40" width="130" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="261" cy="92" r="24" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="261" y="99" text-anchor="middle" font-size="19" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text><path d="M224 168 Q246 120 300 126" fill="none" stroke="#E8735A" stroke-width="3"/><text x="261" y="64" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">اللاحمل</text></g>
<g data-tip="اختبار القصر (الدائرة المقصورة): الأطراف مقصورة معاً، ونقيس تيار القصر ⟦Isc⟧ مقابل تيار المجال ⟦IF⟧."><rect x="34" y="40" width="130" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="99" cy="92" r="24" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="99" y="99" text-anchor="middle" font-size="19" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">A</text><path d="M62 168 L136 126" fill="none" stroke="#2E8C83" stroke-width="3"/><text x="99" y="64" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">القصر</text></g>
<path d="M261 192V214H99V192M180 214V230" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="180,238 173,226 187,226" fill="#2C4A40"/>
<g data-tip="ما نستفيده من الاختبارين: منحنيات خواص المولد، وحساب عناصر الدائرة المكافئة (مثل الممانعة التزامنية ⟦XS⟧)."><rect x="72" y="240" width="216" height="40" rx="10" fill="#12855A"/><text x="180" y="265" text-anchor="middle" font-size="13.5" fill="#FBF6EE" font-weight="700">منحنيات الخواص + الدائرة المكافئة</text></g></svg>`,
   cap:'الفولتميتر = اختبار اللاحمل، والأميتر = اختبار القصر، والخط في كل بطاقة شكل المنحنى الذي يعطيه.<br><b>مرّر المؤشر على البطاقتين والشريط الأخضر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يستفاد من اختبار اللاحمل واختبار القصر في تحديد منحنيات الخواص للمولد وحساب عناصر الدائرة المكافئة.</p>`,ref:'ص 101'},
    {predict:{q:'ما الفائدة من إجراء اختبار اللاحمل واختبار القصر على المولد؟',opts:[
     ['تشغيل المولد على التوازي مع الشبكة',false,'الربط على التوازي له طريقة أخرى (التزامن) في الدرس السادس.'],
     ['تحديد منحنيات الخواص وحساب عناصر الدائرة المكافئة',true,String.raw`هذا نص الكتاب ص 101: من الاختبارين نحسب مثلاً الممانعة التزامنية \(X_S\).`],
     ['قياس كفاءة المولد عند الحمل الكامل',false,'الكفاءة تحتاج القدرة الخارجة والمفاقيد، وهي في الدرس الخامس.']]}}
   ],
   body:[
    {tip:String.raw`<p>كل عنصر في الدائرة المكافئة (الدرس الثاني) يحتاج رقماً لنحسب به. المقاومة \(R_A\) نقيسها بالأوممتر، أما الممانعة التزامنية \(X_S\) فلا يقيسها جهاز مباشرة؛ نستخرجها من اختبارين بسيطين: واحد بأطراف مفتوحة وآخر بأطراف مقصورة. المحطات التالية تشرح كل اختبار ثم طريقة الحساب.</p>`}
   ]},

  {st:2,short:'اختبار اللاحمل',title:'أولاً: اختبار اللاحمل (الدائرة المفتوحة <span class="ltr">Open Circuit</span>)',ref:'ص 101–103',
   q:'نرفع تيار المجال خطوة خطوة والأطراف مفتوحة… هل يرتفع الجهد بالمقدار نفسه في كل خطوة إلى ما لا نهاية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى اللاحمل: جزء خطي في المنطقة الأولى ثم انحناء وتشبع في المنطقة الثانية، وخط الثغرة الهوائية مستقيم من الأصل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#FBE6C4"/>
<rect data-tip="المنطقة (1): الفيض منخفض فممانعة الحديد صغيرة جداً، فيتغير الجهد تغيراً خطياً مع تيار المجال." x="62" y="60" width="50" height="190" fill="#FBF6EE" opacity=".55"/>
<path d="M62 250H330M62 250V40" stroke="#2C4A40" stroke-width="2.5" fill="none"/><polygon points="336,250 326,245 326,255" fill="#2C4A40"/><polygon points="62,34 57,44 67,44" fill="#2C4A40"/>
<text x="326" y="274" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">F</tspan></text><text x="40" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan></text>
<g data-tip="خط الثغرة الهوائية: امتداد الجزء الخطي من المنحنى. يمثل الجهد لو بقيت ممانعة الهواء وحدها (بلا تشبع)."><path d="M62 250 L169 61" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 5"/><path d="M62 250 L169 61" stroke="transparent" stroke-width="14"/></g>
<text x="190" y="62" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">خط الثغرة الهوائية</text>
<g data-tip="منحنى المغنطة ⟦Magnetization Curve⟧ أو منحنى الدائرة المفتوحة ⟦O.C.C⟧: الجهد المتولد على الأطراف المفتوحة مقابل تيار المجال."><path d="M62 250 L68 239 L75 227 L81 216 L88 204 L94 193 L101 182 L107 170 L114 159 L120 148 L126 137 L133 126 L139 117 L146 108 L152 100 L159 93 L165 87 L172 82 L178 78 L185 74 L191 71 L197 69 L204 67 L210 65 L217 63 L223 62 L230 61 L236 61 L243 60 L249 60 L256 59 L262 59 L268 59 L275 58 L281 58 L288 58 L294 58 L301 58 L307 58 L314 58 L320 58" fill="none" stroke="transparent" stroke-width="14"/><path d="M62 250 L68 239 L75 227 L81 216 L88 204 L94 193 L101 182 L107 170 L114 159 L120 148 L126 137 L133 126 L139 117 L146 108 L152 100 L159 93 L165 87 L172 82 L178 78 L185 74 L191 71 L197 69 L204 67 L210 65 L217 63 L223 62 L230 61 L236 61 L243 60 L249 60 L256 59 L262 59 L268 59 L275 58 L281 58 L288 58 L294 58 L301 58 L307 58 L314 58 L320 58" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/></g>
<text x="300" y="68" text-anchor="middle" font-size="13" fill="#B4472F" font-weight="700" font-family="var(--mono)">O.C.C</text>
<g data-tip="المنطقة (1): الجزء الخطي."><circle cx="87" cy="228" r="13" fill="#2C4A40"/><text x="87" y="233" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">1</text></g>
<g data-tip="المنطقة (2): يزداد الفيض فتزداد ممانعة الحديد، أي أن الحديد بدأ يصل إلى حالة التشبع، فيتناقص معدل ارتفاع الجهد مقابل تيار المجال."><circle cx="250" cy="120" r="13" fill="#2C4A40"/><text x="250" y="125" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">2</text></g>
<text x="190" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">خطي أولاً… ثم يتشبع الحديد</text></svg>`,
   cap:'المنحنى البرتقالي = منحنى اللاحمل كالشكل <span class="ltr">(3-11)</span>، والمتقطع = خط الثغرة الهوائية، والجزء الفاتح = المنطقة (1). الشكل بلا أرقام كما في الكتاب.<br><b>مرّر المؤشر على المنحنى والخط والمنطقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>في هذا الاختبار تترك أطراف المنتج <b>مفتوحة</b> وتدار الآلة حتى تصل إلى سرعتها التزامنية، ثم يتم زيادة تيار المجال تدريجياً ابتداءً من الصفر. هذه الزيادة في تيار المجال تؤدي إلى زيادة الفيض المغناطيسي وبالتالي زيادة الجهد المتولد على أطراف المنتج المفتوحة، وتسجل قيم التيار والجهد في جدول ثم ترسم العلاقة بينهما كما في الشكل (3-11)، هذه العلاقة تسمى <b>منحنى المغنطة <span class="ltr">Magnetization Curve</span></b> أو <b>منحنى الدائرة المفتوحة <span class="ltr">Open Circuit Characteristic (O.C.C)</span></b>.</p>`,ref:'ص 101–102'}
   ],
   body:[
    {book:String.raw`<p>يلاحظ أن المنحنى ينقسم إلى منطقتين واضحتين: <b>في المنطقة (1)</b> الفيض المغناطيسي منخفض ولذا فإن ممانعة الحديد تكون صغيرة جداً، وهذا يعني أن الممانعة الموجودة هي ممانعة الهواء فقط وهذا يؤدي إلى أن الجهد يتغير تغيراً خطياً مع تيار المجال. يمثل امتداد المنحنى في هذه المنطقة الخط الفاصل بين المنطقتين ويسمى <b>خط الثغرة الهوائية</b>. <b>في المنطقة (2)</b> يزداد الفيض المغناطيسي مما يؤدي إلى زيادة ممانعة الحديد، أي أن الحديد بدأ يصل إلى <b>حالة التشبع</b>، مما يؤدي إلى تناقص معدل الارتفاع في جهد أطراف المنتج مقابل تيار المجال كما هو ملاحظ من المنحنى.</p>`,ref:'ص 103'},
    {predict:{q:'في المنطقة (2) من منحنى اللاحمل، لماذا يرتفع الجهد ببطء رغم زيادة تيار المجال؟',opts:[
     ['لأن سرعة الآلة تقل عند زيادة تيار المجال',false,'السرعة ثابتة عند السرعة التزامنية طوال الاختبار.'],
     ['لأن الحديد بدأ يصل إلى حالة التشبع فزادت ممانعته',true,'كما في الكتاب ص 103: زيادة الفيض تزيد ممانعة الحديد فيتناقص معدل ارتفاع الجهد.'],
     ['لأن تياراً يمر في الأطراف فيهبط الجهد',false,'الأطراف مفتوحة في هذا الاختبار، فلا يمر تيار في المنتج.']]}},
    {tip:String.raw`<p>كلمة «ممانعة» هنا تعني الممانعة المغناطيسية <span class="ltr">(reluctance)</span>: صعوبة مرور الفيض. الحديد غير المشبع يمرر الفيض بسهولة، فتكون الثغرة الهوائية هي «العائق» الوحيد ويكون الجهد متناسباً مع تيار المجال. عند التشبع يحتاج كل فولت إضافي تيار مجال أكبر.</p>`,title:'ما معنى «ممانعة الحديد»؟'},
    {add:String.raw`<p>تشبه هذه الظاهرة إسفنجة تمتص الماء: في البداية تمتص كل ما تصبه عليها، ثم تمتلئ فلا تأخذ إلا قليلاً مهما زدت. الحديد كذلك «يمتلئ» بالفيض.</p>`,title:'تشبيه'},
    {watch:String.raw`<p>عند اللاحمل لا يمر تيار في المنتج، لذلك الجهد الذي نقيسه على الأطراف هو نفسه الجهد الداخلي \(E_{ph}\). ولهذا يُكتب المحور الرأسي \(E_{ph}\) لا \(V_{ph}\).</p>`}
   ]},

  {st:3,short:'اختبار القصر',title:'ثانياً: اختبار القصر <span class="ltr">Short Circuit Test</span>',ref:'ص 103',
   q:'نقصر أطراف المولد معاً عن قصد… أليس هذا خطراً؟ وما الذي يجعله اختباراً آمناً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المولد تديره التربينة، وأطرافه الثلاثة مقصورة معاً عبر أميتر تيار القصر، وملف المجال يُغذّى من مصدر مستمر متغير عبر أميتر تيار المجال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="التربينة: تدير المولد بالسرعة التزامنية ⟦ns⟧ طوال الاختبار."><path d="M30 76 L84 92 V132 L30 148Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="56" y="168" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">التربينة</text></g>
<rect x="84" y="106" width="44" height="12" fill="#2C4A40"/>
<g data-tip="المولد التزامني."><circle cx="166" cy="112" r="38" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="166" y="118" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text></g>
<g data-tip="الأطراف الثلاثة مقصورة معاً: تيار القصر يمر فيها وفي الأميتر."><path d="M196 88H262M204 112H262M196 136H262" stroke="#E8735A" stroke-width="3.5"/><path d="M262 84V140" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/></g>
<g data-tip="أميتر تيار القصر ⟦Isc⟧: يقيس تيار المنتج. يجب ألا يُترك يزيد عن القيمة المقننة."><path d="M262 112H284" stroke="#2C4A40" stroke-width="2.5"/><circle cx="302" cy="112" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="302" y="118" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text><text x="302" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="3">SC</tspan></text></g>
<path d="M166 150V188" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 4"/>
<path d="M112 196H140M192 196H212V215M212 243V262H112V234M112 224V196" fill="none" stroke="#2C4A40" stroke-width="2.5"/>
<g data-tip="ملف المجال ⟦Φ⟧ على العضو الدوار: تياره المستمر ⟦IF⟧ نرفعه تدريجياً."><path d="M140 196 a6.5 6.5 0 0 1 13 0 a6.5 6.5 0 0 1 13 0 a6.5 6.5 0 0 1 13 0 a6.5 6.5 0 0 1 13 0" fill="none" stroke="#C99A1E" stroke-width="4"/><rect x="138" y="180" width="56" height="22" fill="transparent"/><text x="166" y="178" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Φ</text></g>
<g data-tip="أميتر تيار المجال ⟦IF⟧."><circle cx="212" cy="229" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="212" y="234" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text><text x="244" y="234" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="3">F</tspan></text></g>
<g data-tip="مصدر جهد مستمر متغير: به نرفع تيار المجال خطوة خطوة ابتداءً من الصفر."><path d="M98 224H126" stroke="#2C4A40" stroke-width="3.5"/><path d="M105 234H119" stroke="#2C4A40" stroke-width="3.5"/><path d="M90 252L130 208" stroke="#E8735A" stroke-width="2"/><polygon points="134,203 124,207 130,213" fill="#E8735A"/><rect x="86" y="204" width="50" height="50" fill="transparent"/></g>
<text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الأطراف مقصورة… والتيار تحت المراقبة</text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-12)</span>: الأطراف البرتقالية الثلاثة مقصورة عبر الأميتر، وتحت المولد دائرة المجال.<br><b>مرّر المؤشر على الأجهزة والأجزاء (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>في هذا الاختبار تقصر أطراف المنتج الثلاثة مع بعضها البعض وتدار الآلة حتى تصل إلى السرعة التزامنية، ثم يتم زيادة تيار المجال تدريجياً وتسجل قيمة تيار المنتج وقيمة تيار المجال المقابلة في جدول، ثم ترسم العلاقة بينهما كما في الشكل (3-13)، هذه العلاقة تسمى <b>منحنى القصر <span class="ltr">Short Circuit Characteristic (S.C.C)</span></b>، و<b>يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة</b>.</p>`,ref:'ص 103'}
   ],
   body:[
    {predict:{q:'إلى أي حد نرفع تيار المجال في اختبار القصر؟',opts:[
     ['حتى يتشبع الحديد كما في اختبار اللاحمل',false,'في هذا الاختبار القيد هو تيار المنتج، لا التشبع.'],
     ['حتى يصل تيار القصر إلى قيمته المقننة، ولا يتجاوزها',true,'الكتاب ص 103: «يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة». وهذا السؤال 10 من أسئلة الفصل الأول.'],
     ['إلى أقصى قيمة يعطيها المصدر المستمر',false,'هذا قد يرفع تيار المنتج فوق المقنن فيتلف الملفات.']]}},
    {tip:String.raw`<p>الشكل (3-13) في الكتاب خط مستقيم يبدأ من الأصل. معنى ذلك أن تيار القصر يتناسب مع تيار المجال: إذا ضاعفت \(I_F\) تضاعف \(I_{SC}\). ولأن تيار القصر يبلغ قيمته المقننة عند تيار مجال صغير، تبقى الآلة في هذا الاختبار بعيدة عن التشبع.</p>`,title:'منحنى القصر خط مستقيم'},
    {watch:String.raw`<p>لا يُجرى هذا الاختبار وتيار المجال كبير ثم تُقصر الأطراف فجأة! نبدأ دائماً من تيار مجال صغير ونرفعه تدريجياً ونحن نراقب أميتر تيار القصر.</p>`}
   ]},

  {st:4,short:'حساب Xs',title:'حساب الممانعة التزامنية باستخدام منحنيي <span class="ltr">O.C.C</span> و<span class="ltr">S.C.C</span>',ref:'ص 104',
   q:'عند تيار المجال نفسه: الأطراف المفتوحة تعطينا جهداً، والأطراف المقصورة تعطينا تياراً… ماذا نحصل لو قسمنا أحدهما على الآخر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة منحنيات مقابل تيار المجال: منحنى اللاحمل مع خط الثغرة الهوائية، ومنحنى القصر المستقيم، والممانعة التزامنية الثابتة ثم الهابطة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#DDEFE6"/>
<path d="M62 250H330M62 250V40" stroke="#2C4A40" stroke-width="2.5" fill="none"/><polygon points="336,250 326,245 326,255" fill="#2C4A40"/><polygon points="62,34 57,44 67,44" fill="#2C4A40"/>
<text x="326" y="274" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">F</tspan></text>
<path d="M62 250 L169 61" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="6 5"/>
<g data-tip="منحنى اللاحمل ⟦O.C.C⟧: الجهد ⟦Eph⟧ عند كل تيار مجال (ومعه خط الثغرة الهوائية المتقطع)."><path d="M62 250 L68 239 L75 227 L81 216 L88 204 L94 193 L101 182 L107 170 L114 159 L120 148 L126 137 L133 126 L139 117 L146 108 L152 100 L159 93 L165 87 L172 82 L178 78 L185 74 L191 71 L197 69 L204 67 L210 65 L217 63 L223 62 L230 61 L236 61 L243 60 L249 60 L256 59 L262 59 L268 59 L275 58 L281 58 L288 58 L294 58 L301 58 L307 58 L314 58 L320 58" fill="none" stroke="transparent" stroke-width="14"/><path d="M62 250 L68 239 L75 227 L81 216 L88 204 L94 193 L101 182 L107 170 L114 159 L120 148 L126 137 L133 126 L139 117 L146 108 L152 100 L159 93 L165 87 L172 82 L178 78 L185 74 L191 71 L197 69 L204 67 L210 65 L217 63 L223 62 L230 61 L236 61 L243 60 L249 60 L256 59 L262 59 L268 59 L275 58 L281 58 L288 58 L294 58 L301 58 L307 58 L314 58 L320 58" fill="none" stroke="#E8735A" stroke-width="3.5"/><text x="300" y="70" text-anchor="middle" font-size="13" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="3">ph</tspan></text></g>
<g data-tip="منحنى القصر ⟦S.C.C⟧: تيار القصر ⟦Isc⟧ عند كل تيار مجال، خط مستقيم."><path d="M62 250 L320 110" stroke="transparent" stroke-width="14"/><path d="M62 250 L320 110" stroke="#2E8C83" stroke-width="3.5"/><text x="314" y="134" text-anchor="middle" font-size="13" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="3">sc</tspan></text></g>
<g data-tip="الممانعة التزامنية ⟦XS⟧ عند كل تيار مجال: ثابتة في منطقة التغير الخطي لمنحنى ⟦O.C.C⟧، وتقل مع التشبع."><path d="M64 154 L68 154 L75 154 L81 154 L88 154 L94 154 L101 154 L107 154 L114 154 L120 154 L126 154 L133 155 L139 156 L146 158 L152 159 L159 162 L165 164 L172 166 L178 169 L185 172 L191 174 L197 177 L204 179 L210 182 L217 184 L223 186 L230 189 L236 191 L243 193 L249 194 L256 196 L262 198 L268 199 L275 201 L281 202 L288 204 L294 205 L301 206 L307 207 L314 208 L320 209" fill="none" stroke="transparent" stroke-width="14"/><path d="M64 154 L68 154 L75 154 L81 154 L88 154 L94 154 L101 154 L107 154 L114 154 L120 154 L126 154 L133 155 L139 156 L146 158 L152 159 L159 162 L165 164 L172 166 L178 169 L185 172 L191 174 L197 177 L204 179 L210 182 L217 184 L223 186 L230 189 L236 191 L243 193 L249 194 L256 196 L262 198 L268 199 L275 201 L281 202 L288 204 L294 205 L301 206 L307 207 L314 208 L320 209" fill="none" stroke="#12855A" stroke-width="3.5" stroke-dasharray="1 0"/><text x="314" y="226" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="9" dy="3">S</tspan></text></g>
<text x="190" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثابتة… ثم تقل مع التشبع</text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-14)</span>: البرتقالي <span class="ltr">E<sub>ph</sub></span>، والفيروزي <span class="ltr">I<sub>sc</sub></span>، والأخضر <span class="ltr">X<sub>S</sub></span>، كلٌّ بمقياسه الرأسي الخاص كما في الكتاب.<br><b>مرّر المؤشر على المنحنيات الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يمكن حساب الممانعة التزامنية \((X_S)\) للآلة التزامنية باستخدام منحنى O.C.C ومنحنى S.C.C كما يلي:</p>
     <p>1. عند كل قيمة من قيم تيار المجال \((I_F)\) تحسب \((Z_S)\) من المعادلة:</p>
     <div class="eq">$$Z_S=\frac{E_{ph}}{I_{SC}}$$<span class="eqno">(3-11)</span></div>
     <p>2. تحسب \((X_S)\) من المعادلة:</p>
     <div class="eq">$$X_S=\sqrt{Z_S^2-R_A^2}$$<span class="eqno">(3-12)</span></div>`,ref:'ص 104'}
   ],
   body:[
    {book:String.raw`<p>حيث \(R_A\) هي مقاومة ملفات المنتج ويمكن قياسها مباشرة باستخدام الأوممتر أو عن طريق اختبار التيار المستمر. يمكن أيضاً أن ترسم العلاقة بين \(I_F\) و\(X_S\) كما في الشكل (3-14)، ويلاحظ أن <b>قيمة \(X_S\) تكون ثابتة في منطقة التغير الخطي لمنحنى O.C.C وتقل كلما زادت الممانعة المغناطيسية للحديد</b>.</p>`,ref:'ص 104'},
    {watch:String.raw`<p>عبارة «تقل كلما زادت الممانعة المغناطيسية للحديد» مقصودها: تقل \(X_S\) مع دخول الحديد في التشبع (المنطقة 2 من منحنى اللاحمل).</p>`},
    {predict:{q:String.raw`عند تيار مجال واحد قِسنا \(E_{ph}\) من اختبار اللاحمل و\(I_{SC}\) من اختبار القصر. ماذا يعطينا \(E_{ph}/I_{SC}\)؟`,opts:[
     [String.raw`الممانعة التزامنية \(X_S\) مباشرة`,false,String.raw`القسمة تعطي \(Z_S\) التي تشمل المقاومة أيضاً، ثم نطرح أثر \(R_A\) بالمعادلة (3-12).`],
     [String.raw`المعاوقة التزامنية \(Z_S\)، ومنها نحسب \(X_S\)`,true,String.raw`المعادلة (3-11) تعطي \(Z_S\)، ثم \(X_S=\sqrt{Z_S^2-R_A^2}\) (3-12).`],
     [String.raw`مقاومة ملفات المنتج \(R_A\)`,false,String.raw`\(R_A\) تُقاس مباشرة بالأوممتر أو باختبار التيار المستمر، كما يقول الكتاب.`]]}},
    {tip:String.raw`<p>لماذا تقل \(X_S\) عند التشبع؟ منحنى القصر خط مستقيم، أما \(E_{ph}\) فينحني عند التشبع. القسمة \(E_{ph}/I_{SC}\) تبقى ثابتة ما دام O.C.C مستقيماً، ثم تصغر عندما يبدأ O.C.C بالانحناء. ولأن تيار القصر يبلغ قيمته المقننة عند تيار مجال صغير، نقرأ \(I_{SC}\) عند تيارات المجال الأكبر من <b>امتداد</b> خط S.C.C المستقيم.</p>`,title:'لماذا يهبط المنحنى الأخضر؟'}
   ]},

  {st:5,short:'تنظيم الجهد',title:'معامل تنظيم الجهد',ref:'ص 105',
   q:'تُشغّل مكيفاً كبيراً فيخفت ضوء المصابيح لحظة… كيف نقيس بنسبة واحدة مقدار تغيّر جهد المولد بين اللاحمل والحمل الكامل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="فولتميتران: الأول عند اللاحمل يقرأ أربعمئة وثمانين فولت، والثاني عند الحمل الكامل يقرأ أربعمئة وعشرة فولت، ومعامل التنظيم سبعة عشر فاصلة واحد بالمئة من مثال ثلاثة-اثنين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/>
<g data-tip="عند اللاحمل: جهد الأطراف يساوي الجهد الداخلي. في مثال (3-2) ضُبط تيار المجال ليكون ⟦480 V⟧ (جهد خط)."><circle cx="256" cy="118" r="58" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M214 140 A46 46 0 0 1 298 140" fill="none" stroke="#CFC6B4" stroke-width="6"/><line x1="256" y1="122" x2="284" y2="86" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><circle cx="256" cy="122" r="6" fill="#2C4A40"/><text x="256" y="156" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">480 V</text><text x="256" y="200" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">اللاحمل</text></g>
<g data-tip="عند الحمل الكامل بمعامل قدرة ⟦0.8⟧ متأخر في مثال (3-2): هبط جهد الخط إلى ⟦410 V⟧ وتيار المجال كما هو."><circle cx="104" cy="118" r="58" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M62 140 A46 46 0 0 1 146 140" fill="none" stroke="#CFC6B4" stroke-width="6"/><line x1="104" y1="122" x2="118" y2="80" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><circle cx="104" cy="122" r="6" fill="#2C4A40"/><text x="104" y="156" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">410 V</text><text x="104" y="200" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الحمل الكامل</text></g>
<path d="M196 118H172" stroke="#2C4A40" stroke-width="3"/><polygon points="164,118 176,111 176,125" fill="#2C4A40"/>
<g data-tip="معامل تنظيم الجهد في مثال (3-2) هـ للحالة (1): ⟦(480 − 410) ÷ 410 × 100 = 17.1%⟧."><rect x="104" y="224" width="152" height="42" rx="12" fill="#2C4A40"/><text x="180" y="252" text-anchor="middle" font-size="17" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="11" dy="4">R</tspan><tspan dy="-4"> = 17.1%</tspan></text></g>
<text x="180" y="298" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">أرقام مثال الكتاب</text></svg>`,
   cap:'أرقام الحالة (1) من مثال <span class="ltr">(3-2)</span> هـ: الجهد ينزل من <span class="ltr">480 V</span> بلا حمل إلى <span class="ltr">410 V</span> عند الحمل الكامل.<br><b>مرّر المؤشر على الجهازين والنتيجة (أو المسها في الجوال) لتعرف مصدر كل رقم.</b>',
   side:[
    {book:String.raw`<p>يعتبر معامل تنظيم الجهد <span class="ltr">Voltage Regulation</span> من المعاملات الهامة في الآلة التزامنية، وذلك لأنه يعطي فكرة واضحة عن مدى التغير الذي يحدث في قيمة الجهد على أطراف الآلة عند تحميلها أو عندما تتغير الأحمال بشكل كبير، كما أنه يعتبر مؤشراً جيداً للدلالة على جودة المولد.</p>
     <p><b>يعرف بأنه التغير في جهد الأطراف من حالة اللاحمل إلى حالة الحمل الكامل منسوباً إلى قيمة الجهد في حالة الحمل الكامل.</b></p>
     <div class="eq">$$V_R\%=\frac{E_{ph}-V_{ph}}{V_{ph}}\times100$$<span class="eqno">(3-13)</span></div>`,ref:'ص 105'}
   ],
   body:[
    {book:String.raw`<p>\(E_{ph}\) جهد اللاحمل، \(V_{ph}\) جهد الحمل الكامل. وهناك عدة طرق تستخدم لتعيين معامل تنظيم الجهد تعتمد على نوعية البيانات المتوفرة عن الآلة والتي تكون عادةً إما نتائج اختبارات أجريت على الآلة أو بيانات التصميم.</p>`,ref:'ص 105'},
    {watch:String.raw`<p>يذكر الكتاب «عدة طرق تستخدم لتعيين معامل تنظيم الجهد» دون أن يشرح أياً منها. في هذا الكتاب نحسبه دائماً بالدائرة المكافئة والمخطط الاتجاهي كما في مثال (3-2) هـ.</p>`,fix:true},
    {title:'احسب معامل تنظيم الجهد',widget:(el,B)=>{
      const CASES=[['الحالة (1): 0.8 متأخر',480,410],['الحالة (2): معامل قدرة 1',480,468],['الحالة (3): 0.8 متقدم',480,535]];
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">أرقام الحالات الثلاث من مثال <span class="ltr">(3-2)</span> هـ (ص 121)، أو اكتب أرقامك.</p>
       <div class="w-row" style="margin-top:0">${CASES.map((c,i)=>`<button class="btn" type="button" data-c="${i}">${c[0].replace(/(\d[\d.]*)/g,'<span class="ltr">$1</span>')}</button>`).join('')}</div>
       <div class="w-row"><label>جهد اللاحمل <span class="ltr">E</span>: <input type="number" data-i="E" value="480" step="any" min="0" dir="ltr" style="width:6.5em"> <span class="ltr">V</span></label><label>جهد الحمل الكامل <span class="ltr">V</span>: <input type="number" data-i="V" value="410" step="any" min="0" dir="ltr" style="width:6.5em"> <span class="ltr">V</span></label></div>
       <div class="w-facts"><div><span>التغير <bdi dir="ltr">E − V</bdi></span><b data-o="d"></b></div><div><span>معامل التنظيم <bdi dir="ltr">(3-13)</bdi></span><b data-o="r"></b></div><div style="grid-column:span 2"><span>المعنى</span><b data-o="m" style="font-family:var(--font);direction:rtl;text-align:start;font-size:14px;line-height:1.6"></b></div></div>`;
      const iE=el.querySelector('[data-i="E"]'),iV=el.querySelector('[data-i="V"]'),o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const E=+iE.value,V=+iV.value;
        if(!(V>0)||!(E>=0)){o('d').textContent='—';o('r').textContent='—';o('m').textContent='أدخل جهداً موجباً للحمل الكامل.';return}
        const r=(E-V)/V*100;o('d').textContent=B.fmtN(E-V,1)+' V';o('r').textContent=B.fmtN(r,1)+' %';
        o('m').textContent=Math.abs(r)<0.05?'الجهد لا يتغير بين اللاحمل والحمل الكامل.':r>0?'الجهد يهبط عند التحميل (موجب)، كالحمل الحثي.':'الجهد يرتفع عند التحميل (سالب)، كالحمل السعوي.'};
      el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const c=CASES[+b.dataset.c];iE.value=c[1];iV.value=c[2];draw()});
      iE.oninput=draw;iV.oninput=draw;draw();
    }},
    {predict:{q:'أيهما أفضل للمولد: معامل تنظيم جهد كبير أم صغير؟',opts:[
     ['كبير، لأنه يعني أن المولد قوي',false,'المعامل الكبير يعني أن الجهد يتغير كثيراً عند التحميل، وهذا ما لا نريده للمستهلك.'],
     ['صغير، لأن الجهد يبقى قريباً من قيمته مع تغير الأحمال',true,'هذا استنتاج من تعريف الكتاب ص 105 (وهو السؤال 13 من أسئلة الفصل الأول): المعامل مؤشر على جودة المولد، وكلما صغر كان الجهد أثبت.'],
     ['لا فرق، فهو رقم للمعلومة فقط',false,'الكتاب يقول إنه «مؤشر جيد للدلالة على جودة المولد».']]}},
    {tip:String.raw`<p>معامل التنظيم الصغير يعني أن الجهد لا يتغير كثيراً بين اللاحمل والحمل الكامل (مولد جيد). يكون موجباً مع الحمل الحثي (الجهد يهبط عند التحميل) وقد يكون سالباً مع الحمل السعوي (الجهد يرتفع عند التحميل)، كما في مثال (3-2) هـ: <span class="ltr">17.1%</span> و <span class="ltr">2.6%</span> و <span class="ltr">−10.3%</span>. والكتاب عوّض هناك بجهد الخط (480 و410…) بدل جهد الوجه؛ النتيجة واحدة لأن \(\sqrt3\) يُختصر من البسط والمقام.</p>`}
   ]},

  {recap:[
   String.raw`اختبار اللاحمل (أطراف مفتوحة) يعطي منحنى O.C.C: خطي في المنطقة (1) ثم يتشبع في المنطقة (2)، وامتداد الجزء الخطي خط الثغرة الهوائية (ص 101–103).`,
   String.raw`اختبار القصر (أطراف مقصورة) يعطي منحنى S.C.C المستقيم، ولا يُترك تيار القصر يزيد عن القيمة المقننة (ص 103).`,
   String.raw`المعادلة (3-11): \(Z_S=E_{ph}/I_{SC}\) والمعادلة (3-12): \(X_S=\sqrt{Z_S^2-R_A^2}\)؛ و\(X_S\) ثابتة في المنطقة الخطية وتقل مع التشبع.`,
   String.raw`معامل تنظيم الجهد، المعادلة (3-13): \(V_R\%=\dfrac{E_{ph}-V_{ph}}{V_{ph}}\times100\) — كلما صغر كان المولد أفضل.`]}
],
 theory:[
  {h:'اختبارات المولد التزامني',ref:'ص 101',html:'<p>«يستفاد من اختبار اللاحمل واختبار القصر في تحديد منحنيات الخواص للمولد وحساب عناصر الدائرة المكافئة».</p>'},
  {h:'أولاً: اختبار اللاحمل (الدائرة المفتوحة <span class="ltr">Open Circuit</span>)',ref:'ص 101–102',html:`<p>تترك أطراف المنتج <b>مفتوحة</b> وتدار الآلة حتى تصل إلى سرعتها التزامنية، ثم يزاد تيار المجال تدريجياً ابتداءً من الصفر. هذه الزيادة تزيد الفيض وبالتالي الجهد المتولد على الأطراف المفتوحة، وتسجل قيم التيار والجهد في جدول ثم ترسم العلاقة بينهما كما في الشكل (3-11)، وتسمى <b>منحنى المغنطة <span class="ltr">Magnetization Curve</span></b> أو <b>منحنى الدائرة المفتوحة <span class="ltr">O.C.C</span></b>.</p>`},
  {fig:'(3-10)',ref:'ص 102',caption:'الآلة التزامنية أثناء اختبار اللاحمل: التربينة تدير المولد بسرعة \\(n_s\\)، والأطراف 1، 2، 3 مفتوحة، وفولتميتر \\(E_{ph}\\) بين الطرف 3 وN، وملف المجال يغذى من مصدر مستمر متغير عبر أميتر \\(I_F\\)',draw:()=>svgbox(testSVG('open'),560)},
  {fig:'(3-11)',ref:'ص 102',caption:'منحنى اللاحمل للآلة التزامنية: المنطقة (1) خطية والمنطقة (2) منطقة التشبع، والخط المتقطع «خط الثغرة الهوائية» (أُعيد رسمه)',draw:()=>svgbox(fig311(),520)},
  {html:`<p>يلاحظ أن المنحنى ينقسم إلى منطقتين <span class="ref">ص 103</span>:</p><ul><li><b>المنطقة (1):</b> الفيض منخفض فممانعة الحديد صغيرة جداً، أي أن الممانعة الموجودة هي ممانعة الهواء فقط، فيتغير الجهد <b>تغيراً خطياً</b> مع تيار المجال. امتداد المنحنى في هذه المنطقة يسمى <b>خط الثغرة الهوائية</b>.</li>
   <li><b>المنطقة (2):</b> يزداد الفيض فتزداد ممانعة الحديد، أي أن الحديد بدأ يصل إلى <b>حالة التشبع</b>، فيتناقص معدل ارتفاع الجهد مقابل تيار المجال.</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> كلمة «ممانعة» هنا تعني الممانعة المغناطيسية <span class="ltr">(reluctance)</span>: صعوبة مرور الفيض. الحديد غير المشبع يمرر الفيض بسهولة، فتكون الثغرة الهوائية هي «العائق» الوحيد ويكون الجهد متناسباً مع تيار المجال. عند التشبع يحتاج كل فولت إضافي تيار مجال أكبر.'},
  {h:'ثانياً: اختبار القصر <span class="ltr">Short Circuit Test</span>',ref:'ص 103',html:`<p>تُقصر أطراف المنتج الثلاثة مع بعضها وتدار الآلة حتى السرعة التزامنية، ثم يزاد تيار المجال تدريجياً وتسجل قيمة تيار المنتج وتيار المجال المقابل، وترسم العلاقة بينهما كما في الشكل (3-13) وتسمى <b>منحنى القصر <span class="ltr">S.C.C</span></b>. و«<b>يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة</b>».</p>`},
  {fig:'(3-12)',ref:'ص 103',caption:'الآلة التزامنية أثناء اختبار الدائرة المقصورة: الأطراف مقصورة معاً عبر أميتر \\(I_{SC}\\)',draw:()=>svgbox(testSVG('short'),560)},
  {fig:'(3-13)',ref:'ص 103',caption:'منحنى الدائرة المقصورة للآلة التزامنية: خط مستقيم من الأصل',draw:()=>svgbox(fig313(),420)},
  {h:'حساب الممانعة التزامنية من O.C.C و S.C.C',ref:'ص 104',html:`<ol><li>عند كل قيمة من قيم تيار المجال \\(I_F\\) تحسب \\(Z_S\\):</li></ol>
   $$Z_S=\\frac{E_{ph}}{I_{SC}}\\qquad(3\\text{-}11)$$
   <ol start="2"><li>ثم تحسب \\(X_S\\):</li></ol>
   $$X_S=\\sqrt{Z_S^2-R_A^2}\\qquad(3\\text{-}12)$$
   <p>حيث \\(R_A\\) مقاومة ملفات المنتج، وتقاس مباشرة بالأوممتر أو باختبار التيار المستمر. ويمكن رسم العلاقة بين \\(I_F\\) و\\(X_S\\) كما في الشكل (3-14)، ويلاحظ أن «<b>قيمة \\(X_S\\) تكون ثابتة في منطقة التغير الخطي لمنحنى O.C.C وتقل كلما زادت الممانعة المغناطيسية للحديد</b>».</p>`},
  {fig:'(3-14)',ref:'ص 104',caption:'العلاقة بين الممانعة التزامنية وتيار المجال: O.C.C مع خط الثغرة الهوائية، وS.C.C، ومنحنى \\(X_S\\) ثابت ثم يهبط (المنحنيات الثلاثة بمقاييس رأسية مختلفة كما في الشكل المطبوع)',draw:()=>svgbox(fig314(),520)},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 104: عبارة «تقل [X<sub>S</sub>] كلما زادت الممانعة المغناطيسية للحديد» مقصودها: تقل مع دخول الحديد في التشبع (المنطقة 2).'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — لماذا يحدث ذلك؟</b> منحنى القصر خط مستقيم (لأن الآلة المقصورة لا تتشبع)، أما \\(E_{ph}\\) فينحني عند التشبع. القسمة \\(E_{ph}/I_{SC}\\) تبقى ثابتة ما دام O.C.C مستقيماً، ثم تصغر عندما يبدأ O.C.C بالانحناء. ولأن تيار القصر يبلغ قيمته المقننة عند تيار مجال صغير، نقرأ \\(I_{SC}\\) عند تيارات المجال الأكبر من <b>امتداد</b> خط S.C.C المستقيم.'},
  {h:'معامل تنظيم الجهد',ref:'ص 105',html:`<p>يعتبر معامل تنظيم الجهد <span class="ltr">Voltage Regulation</span> من المعاملات الهامة لأنه «يعطي فكرة واضحة عن مدى التغير الذي يحدث في قيمة الجهد على أطراف الآلة عند تحميلها أو عندما تتغير الأحمال بشكل كبير، كما أنه يعتبر مؤشراً جيداً للدلالة على جودة المولد».</p>
   <p>«<b>يعرف بأنه التغير في جهد الأطراف من حالة اللاحمل إلى حالة الحمل الكامل منسوباً إلى قيمة الجهد في حالة الحمل الكامل</b>»:</p>
   $$V_R\\%=\\frac{E_{ph}-V_{ph}}{V_{ph}}\\times100\\qquad(3\\text{-}13)$$
   <p>\\(E_{ph}\\) جهد اللاحمل، \\(V_{ph}\\) جهد الحمل الكامل. وهناك عدة طرق لتعيين معامل تنظيم الجهد تعتمد على نوعية البيانات المتوفرة عن الآلة (نتائج اختبارات أو بيانات التصميم).</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 105: يذكر الكتاب «عدة طرق تستخدم لتعيين معامل تنظيم الجهد» دون أن يشرح أياً منها. في هذا الكتاب نحسبه دائماً بالدائرة المكافئة والمخطط الاتجاهي كما في مثال (3-2) هـ.'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> معامل التنظيم الصغير يعني أن الجهد لا يتغير كثيراً بين اللاحمل والحمل الكامل (مولد جيد). يكون موجباً مع الحمل الحثي (الجهد يهبط عند التحميل) وقد يكون سالباً مع الحمل السعوي (الجهد يرتفع عند التحميل)، كما في مثال (3-2) هـ: <span class="ltr">17.1%</span> و <span class="ltr">2.6%</span> و <span class="ltr">−10.3%</span>.'}
 ],
 lab:(el)=>{
  let mode='open',If=0,occR=[],sccR=[],warn=0,lastS='',vrI=692.8,vrPf=0.8,vrK='lag';
  el.innerHTML=`<div id="l4tp"></div><div class="grid">
   <div class="panel c7"><h2>منصة الاختبارين <small>مبنية على الشكلين (3-10) و(3-12) ص 102–103</small></h2>
    <div class="sg-row">${segHTML('tm',[['open','اختبار اللاحمل (أطراف مفتوحة)'],['short','اختبار القصر (أطراف مقصورة)']],mode)}</div>
    <div id="l4s" class="svgbox" style="max-width:560px;margin-inline:auto"></div>
    <div id="l4sl"></div>
    <div class="sg-row"><button class="btn primary" id="l4take">سجّل القراءة</button><button class="btn" id="l4auto">قراءات تلقائية</button><button class="btn" id="l4clr">امسح القراءات</button></div>
    <div id="l4m" class="sg-msg"></div>
    <p class="sub">منحنى اللاحمل من الشكل (3-19) ص 114 (<b>قراءات تقريبية</b> بالنظر، ويمر بنقاط الحل 4.1/4.5/5.7 A)، و<span class="ltr">R<sub>A</sub> = 0.015 Ω</span> والتيار المقنن <span class="ltr">692.8 A</span> لكل وجه من مثال (3-1). ميل خط S.C.C <b>توضيحي</b> (<span class="ltr" id="l4kv"></span>)؛ القيمة التوضيحية اختيرت لتعطي <span class="ltr">X<sub>S</sub> = 0.1 Ω</span> في المنطقة الخطية كما في المثال.</p></div>
   <div class="panel c5"><h2><span>جدول القراءات وحساب X<sub>S</sub></span> <small>(3-11) و(3-12)</small></h2><div id="l4t" class="sg-tbl"></div></div>
   <div class="panel c4"><h2>O.C.C <small>الشكل (3-11)</small></h2><div class="sg-chart sm"><canvas id="l4o"></canvas></div>${legend([['--live','القراءات'],['--muted','خط الثغرة الهوائية',1]])}</div>
   <div class="panel c4"><h2>S.C.C <small>الشكل (3-13)</small></h2><div class="sg-chart sm"><canvas id="l4c"></canvas></div>${legend([['--blue','القراءات وامتدادها',1],['--stop','التيار المقنن',1]])}</div>
   <div class="panel c4"><h2><span>X<sub>S</sub> مع I<sub>F</sub></span> <small>الشكل (3-14)</small></h2><div class="sg-chart sm"><canvas id="l4x"></canvas></div></div>
   <div class="panel c12"><h2>من الاختبار إلى معامل تنظيم الجهد <small>المعادلة (3-13) ص 105</small></h2>
    <div class="grid" style="margin-top:0"><div class="c6">${sl('l4vi','تيار الحمل لكل وجه',0,1000,0.1,vrI)}${sl('l4vp','معامل القدرة',0.5,1,0.01,vrPf)}<div class="sg-row">${segHTML('vk',[['lag','متأخر'],['unity','1'],['lead','متقدم']],vrK)}</div></div>
    <div class="c6"><div class="facts">${fact('<bdi dir="ltr">X<sub>S</sub></bdi> المستعملة (من قراءاتك)','l4xs')}${fact('<bdi dir="ltr">E<sub>ph</sub></bdi> (جهد اللاحمل)','l4ve')}${fact('<bdi dir="ltr">V<sub>R</sub>%</bdi>','l4vr')}</div><p class="sub">جهد الحمل الكامل <span class="ltr">V<sub>ph</sub> = 480 V</span>. نحسب الجهد الداخلي اللازم بالمعادلة (3-9) ثم \\(V_R\\%\\).</p></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l4tp'),'u3-l4',[
   {k:'K',label:'ميل خط S.C.C: تيار القصر لكل 1 A من تيار المجال',unit:'A/A',value:KSC,dp:2,min:10,max:1e6}],()=>{sccR=[];warn=0;If=Math.min(If,scMax());mkSl();kTxt();steps.redraw()});
  const K=()=>TP.v.K;
  const scMax=()=>Math.max(1,Math.ceil(1.2*IRATED/K()*100)/100);   // أعلى تيار مجال في اختبار القصر (1 A بالقيم التوضيحية)
  const kTxt=()=>{$('#l4kv').textContent=fm(K(),1)+' A/A'};kTxt();
  const mkSl=()=>{$('#l4sl').innerHTML=mode==='open'?sl('l4f','تيار المجال <span class="ltr">I<sub>F</sub></span>',0,10,0.05,If):sl('l4f','تيار المجال <span class="ltr">I<sub>F</sub></span> (ارفعه ببطء)',0,scMax(),0.01,If);$('#l4f').oninput=e=>{If=+e.target.value};lastS=''};
  segOn(el,'tm',v=>{mode=v;If=0;mkSl()});mkSl();
  const kfit=()=>{if(!sccR.length)return null;let a=0,b=0;sccR.forEach(([x,y])=>{a+=x*y;b+=x*x});return b?a/b:null};
  const take=(x)=>{x=x==null?If:x;if(mode==='open'){occR=occR.filter(r=>Math.abs(r[0]-x)>1e-6);occR.push([x,B.round(occ(x),1)]);occR.sort((a,b)=>a[0]-b[0])}else{const I=K()*x;if(I>IRATED*1.0001){warn=1}sccR=sccR.filter(r=>Math.abs(r[0]-x)>1e-6);sccR.push([x,B.round(I,1)]);sccR.sort((a,b)=>a[0]-b[0])}lastS=''};
  $('#l4take').onclick=()=>take();
  $('#l4auto').onclick=()=>{if(mode==='open')[1,2,3,4,5,6,7,8,9,10].forEach(take);else[0.1,0.2,0.3,0.4,0.5].map(v=>K()===KSC?v:Math.max(0.01,B.round(v*KSC/K(),2))).forEach(take)};
  $('#l4clr').onclick=()=>{occR=[];sccR=[];lastS=''};
  $('#l4vi').oninput=e=>{vrI=+e.target.value};$('#l4vp').oninput=e=>{vrPf=+e.target.value};segOn(el,'vk',v=>{vrK=v;lastS=''});
  let sawVRneg=0;
  const xsLin=()=>{const Zs=AIRGAP/K();return fm(+Math.sqrt(Math.max(0,Zs*Zs-RA31*RA31)).toPrecision(3))};   // X_S في المنطقة الخطية (0.1 Ω بالقيم التوضيحية)
  const steps=stepsUI($('#l4st'),[
   {t:'اختبار اللاحمل',x:'في وضع «أطراف مفتوحة» ارفع تيار المجال على مراحل وسجّل خمس قراءات على الأقل، منها قراءة فوق <span class="ltr">6 A</span>.',done:()=>occR.length>=5&&occR.some(r=>r[0]>=6)},
   {t:'المنطقتان',x:'انظر إلى منحنى O.C.C: القراءات الأولى على خط الثغرة الهوائية (المنطقة 1)، ثم تنحني تحته عند التشبع (المنطقة 2).'},
   {t:'اختبار القصر',x:'اختر «أطراف مقصورة» وابدأ من الصفر. ارفع تيار المجال <b>ببطء</b> وسجّل قراءتين على الأقل دون تجاوز التيار المقنن.',done:()=>sccR.filter(r=>r[1]<=IRATED).length>=2},
   {t:'لا تتجاوز التيار المقنن',x:'لاحظ التحذير الأحمر إذا تجاوز \\(I_{SC}\\) القيمة المقننة <span class="ltr">692.8 A</span>: الكتاب يمنع ذلك.'},
   {t:'X<sub>S</sub> من الاختبارين',x:()=>`في الجدول: عند كل تيار مجال \\(Z_S=E_{ph}/I_{SC}\\) ثم \\(X_S=\\sqrt{Z_S^2-R_A^2}\\). القيمة ثابتة (≈ <span class="ltr">${xsLin()} Ω</span>) في المنطقة الخطية ثم تقل مع التشبع (الشكل 3-14).`,done:()=>occR.length>=5&&sccR.length>=1},
   {t:'تنظيم الجهد',x:'في اللوحة الأخيرة اختر «متقدم» وخفّض معامل القدرة: يصبح \\(V_R\\%\\) سالباً، أي أن جهد اللاحمل أصغر من جهد الحمل.',done:()=>sawVRneg}
  ]);
  loopOn(el,()=>{const I=mode==='short'?K()*If:0,E=mode==='open'?occ(If):0,over=mode==='short'&&I>IRATED;
   $('#l4f-v').textContent=fm(If,2)+' A';$('#l4vi-v').textContent=fm(vrI,1)+' A';$('#l4vp-v').textContent=fm(vrPf,2);
   const sg=[mode,If,occR.length,sccR.length,vrI,vrPf,vrK,warn,K()].join();if(sg===lastS){steps.check();return}lastS=sg;
   $('#l4s').innerHTML='<div style="min-width:470px">'+testSVG(mode,{live:1,If,E:mode==='open'?E:null,Isc:mode==='short'?I:null,over})+'</div>';
   $('#l4m').innerHTML=over?`<div class="callout err"><b>تحذير:</b> تيار القصر <span class="ltr">${fm(I,1)} A</span> تجاوز القيمة المقننة <span class="ltr">692.8 A</span>. «يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة» (ص 103). أنقص تيار المجال.</div>`:
     mode==='open'?`<div class="callout">أطراف مفتوحة: لا تيار في المنتج، والفولتميتر يقرأ \\(E_{ph}\\) = <span class="ltr">${fm(E,1)} V</span>.</div>`:`<div class="callout">أطراف مقصورة: الجهد على الأطراف صفر، والأميتر يقرأ <span class="ltr">I<sub>SC</sub> = ${fm(I,1)} A</span>. لاحظ كم يكفي تيار مجال صغير ليصل تيار القصر إلى قيمته المقننة.</div>`;B.math($('#l4m'));
   const k=kfit();
   const rows=occR.map(([x,e])=>{if(!k||x===0)return `<tr><td>${fm(x,2)}</td><td>${fm(e,1)}</td><td>—</td><td>—</td><td>—</td></tr>`;const isc=k*x,Zs=e/isc,Xs=Math.sqrt(Math.max(0,Zs*Zs-RA31*RA31));return `<tr><td>${fm(x,2)}</td><td>${fm(e,1)}</td><td>${fm(isc,1)}</td><td>${fm(Zs,4)}</td><td>${fm(Xs,4)}</td></tr>`}).join('');
   $('#l4t').innerHTML=`<table><thead><tr><th>I<sub>F</sub> (A)</th><th>E<sub>ph</sub> (V)</th><th>I<sub>SC</sub> (A)</th><th>Z<sub>S</sub> (Ω)</th><th>X<sub>S</sub> (Ω)</th></tr></thead><tbody>${rows||'<tr><td colspan="5">لا قراءات بعد</td></tr>'}</tbody></table>`+
     (sccR.length?`<p class="sub">قراءات القصر: ${sccR.map(([x,y])=>`<span class="ltr" style="${y>IRATED?'color:var(--stop)':''}">${fm(x,2)} A → ${fm(y,1)} A</span>`).join('، ')}. \\(I_{SC}\\) في الجدول من خط S.C.C المستقيم وامتداده (ميله <span class="ltr">${fm(k,1)} A/A</span>).</p>`:'<p class="sub">أجرِ اختبار القصر لتظهر أعمدة \\(I_{SC}\\) و\\(Z_S\\) و\\(X_S\\).</p>');B.math($('#l4t'));
   const lin=occR.filter(r=>r[0]>0&&r[0]<=2.5);const sl0=lin.length?lin.reduce((a,r)=>a+r[1]/r[0],0)/lin.length:null;
   plot($('#l4o'),{xmax:10,ymax:700,xlabel:'IF (A)',ylabel:'Eph (V)',shade:occR.length>=4?[{x0:0,x1:3,color:'--blue',label:'(1)'},{x0:3,x1:10,color:'--live',label:'(2)',alpha:.06}]:[],
    series:(sl0?[{pts:[[0,0],[700/sl0,700]],color:'--muted',dash:[6,4],width:1.6}]:[]).concat([{pts:[[0,0]].concat(occR),color:'--live'}]),points:occR.map(r=>({x:r[0],y:r[1],color:'--live',r:4})).concat(mode==='open'?[{x:If,y:E,color:'--fg',r:3}]:[])});
   const scX=scMax(),scY=Math.ceil(Math.max(K()*scX,IRATED*1.2)/200)*200;
   plot($('#l4c'),{xmax:scX,ymax:scY,xlabel:'IF (A)',ylabel:'Isc (A)',series:[{pts:[[0,IRATED],[scX,IRATED]],color:'--stop',dash:[5,4],width:1.5}].concat(k?[{pts:[[0,0],[scX,k*scX]],color:'--blue',dash:[6,4],width:1.6}]:[]),points:sccR.map(r=>({x:r[0],y:r[1],color:r[1]>IRATED?'--stop':'--blue',r:4})).concat(mode==='short'?[{x:If,y:I,color:'--fg',r:3}]:[])});
   const xsPts=k?occR.filter(r=>r[0]>0).map(([x,e])=>{const Zs=e/(k*x);return [x,Math.sqrt(Math.max(0,Zs*Zs-RA31*RA31))]}):[];
   const xsY=Math.max(0.12,Math.ceil(1.1*AIRGAP/K()*50)/50);
   plot($('#l4x'),{xmax:10,ymax:xsY,ystep:xsY===0.12?0.02:xsY/6,xlabel:'IF (A)',ylabel:'Xs (Ω)',series:[{pts:xsPts,color:'--on'}],points:xsPts.map(p=>({x:p[0],y:p[1],color:'--on',r:4}))});
   // regulation
   const xsl=xsPts.filter(p=>p[0]<=2.5);const Xs=xsl.length?xsl.reduce((a,p)=>a+p[1],0)/xsl.length:null;
   if(Xs){const th=vrK==='unity'?0:(vrK==='lag'?-1:1)*Math.acos(vrPf)/D,Ev=cadd(Cx(480),cmul(Cx(RA31,Xs),cpol(vrI,th))),Em=cabs(Ev),VR=(Em-480)/480*100;if(VR<0)sawVRneg=1;
    $('#l4xs').textContent=fm(Xs,4)+' Ω';$('#l4ve').textContent=fm(Em,1)+' V';$('#l4vr').textContent=fm(VR,2)+' %'}
   else{$('#l4xs').textContent='أجرِ الاختبارين';$('#l4ve').textContent='—';$('#l4vr').textContent='—'}
   steps.check()});
 },
 examples:[
  {title:'حساب Z<sub>S</sub> و X<sub>S</sub> من الاختبارين — أرقام توضيحية',ref:'ص 104',
   q:'<p>الكتاب لا يعطي مثالاً عددياً على (3-11) و(3-12). هذه حاسبة بقراءة من مختبر هذا الدرس: عند تيار مجال <span class="ltr">2 A</span> أعطى اختبار اللاحمل <span class="ltr">240 V</span> لكل وجه، وأعطى خط القصر <span class="ltr">2373.4 A</span>، و<span class="ltr">R<sub>A</sub> = 0.015 Ω</span>.</p>',
   given:[{id:'E',label:'جهد اللاحمل لكل وجه عند I_F',sym:'E_{ph}',unit:'V',value:240},{id:'I',label:'تيار القصر عند نفس I_F',sym:'I_{SC}',unit:'A',value:2373.4},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015}],
   solve:(g)=>{const Zs=B.round(g.E/g.I,4),Xs=B.round(Math.sqrt(Math.max(0,Zs*Zs-g.RA*g.RA)),4);return [
    {t:'المعادلة (3-11):',f:`Z_S=\\frac{E_{ph}}{I_{SC}}=\\frac{${g.E}}{${g.I}}`,v:Zs,dp:4,unit:'Ω'},
    {t:'المعادلة (3-12):',f:`X_S=\\sqrt{Z_S^2-R_A^2}=\\sqrt{${fm(Zs,4)}^2-${g.RA}^2}`,v:Xs,dp:4,unit:'Ω',final:true},
    {t:'لاحظ أن X<sub>S</sub> قريبة جداً من Z<sub>S</sub> لأن R<sub>A</sub> صغيرة.'}]}},
  {title:'مثال (3-2) هـ — معامل تنظيم الجهد (الحالة 1)',ref:'ص 121',
   q:'<p>«هـ) معامل تنظيم الجهد في حالات التحميل الثلاث» — الحالة (1): جهد اللاحمل الخطي <span class="ltr">480 V</span> وجهد الحمل الكامل الخطي <span class="ltr">410 V</span> (عند 0.8 متأخر). الحالتان الأخريان في حاسبة مثال (3-2) الكاملة في الدرس 3.7.</p>',
   given:[{id:'E',label:'جهد اللاحمل',sym:'E',unit:'V',value:480},{id:'V',label:'جهد الحمل الكامل',sym:'V',unit:'V',value:410}],
   solve:(g)=>[{t:'المعادلة (3-13) (عوّض الكتاب بالجهود الخطية):',f:`V_R\\%=\\frac{E-V}{V}\\times100=\\frac{${g.E}-${g.V}}{${g.V}}\\times100`,v:B.round((g.E-g.V)/g.V*100,1),dp:1,unit:'%',final:true}],
   note:'غيّر جهد الحمل إلى <span class="ltr">468</span> ثم <span class="ltr">535</span> لتحصل على <span class="ltr">2.6%</span> و <span class="ltr">−10.3%</span> كما في الكتاب.'}
 ],
 quiz:[
  {q:'في اختبار اللاحمل تكون أطراف المنتج:',o:['مقصورة','مفتوحة','موصولة بحمل','موصولة بالشبكة'],c:1,e:'ص 101.'},
  {q:'منحنى O.C.C هو العلاقة بين:',o:['تيار القصر وتيار المجال','جهد الأطراف المفتوحة وتيار المجال','القدرة والزاوية','السرعة والتردد'],c:1,e:'ص 102: ويسمى منحنى المغنطة.'},
  {q:'في المنطقة (1) من منحنى اللاحمل:',o:['الحديد مشبع','الجهد يتغير خطياً مع تيار المجال','الجهد ثابت','لا يوجد فيض'],c:1,e:'ص 103: ممانعة الحديد صغيرة جداً والممانعة الموجودة ممانعة الهواء فقط.'},
  {q:'في اختبار القصر يجب ألا يتجاوز تيار القصر:',o:['ضعف القيمة المقننة','القيمة المقننة','10% من المقنن','لا يوجد حد'],c:1,e:'ص 103.'},
  {q:'Z<sub>S</sub> = 0.101 Ω و R<sub>A</sub> = 0.015 Ω، فإن X<sub>S</sub> تقريباً:',o:['0.116 Ω','0.1 Ω','0.086 Ω','0.015 Ω'],c:1,e:'X_S = √(0.101² − 0.015²) ≈ 0.0999 Ω (المعادلة 3-12).'},
  {q:'كيف تتغير X<sub>S</sub> مع زيادة تيار المجال؟',o:['تزيد دائماً','ثابتة في المنطقة الخطية ثم تقل مع التشبع','تقل ثم تزيد','لا تتغير أبداً'],c:1,e:'ص 104 والشكل (3-14).'},
  {q:'معامل تنظيم الجهد يُنسب إلى:',o:['جهد اللاحمل','جهد الحمل الكامل','تيار الحمل','التردد'],c:1,e:'المعادلة (3-13): القسمة على V_ph جهد الحمل الكامل.'},
  {q:'جهد اللاحمل 480 V وجهد الحمل الكامل 410 V. معامل التنظيم:',o:['14.6%','17.1%','−17.1%','70%'],c:1,e:'(480 − 410) ÷ 410 × 100 = 17.1% (مثال 3-2 هـ).'}
 ]
});

/* ---------- الشكل (3-15) ---------- */
function fig315(){const ox=50,oy=200,Vl=260,th=35,XI=150;const a=[ox+Vl,oy],cA=90-th,c=[a[0]+XI*Math.cos(cA*D),a[1]-XI*Math.sin(cA*D)],b=[c[0],oy];
  const Il=120,ie=[ox+Il*Math.cos(th*D),oy+Il*Math.sin(th*D)];const foot=(()=>{const ux=Math.cos(th*D),uy=Math.sin(th*D),t=(a[0]-ox)*ux+(a[1]-oy)*uy;return [ox+t*ux,oy+t*uy]})();
  let s=`<svg viewBox="0 0 520 290" role="img" aria-label="المخطط الاتجاهي في حالة الحمل الحثي مع إهمال RA">`;
  s+=`<path d="M${fx(ie[0])} ${fx(ie[1])}L${fx(foot[0]+20*Math.cos(th*D))} ${fx(foot[1]+20*Math.sin(th*D))}" stroke="var(--blue)" stroke-dasharray="5 4" stroke-width="1.4"/><path d="M${a[0]} ${a[1]}L${fx(foot[0])} ${fx(foot[1])}" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
  s+=`<path d="M${a[0]} ${a[1]}H${b[0]+20}" stroke="var(--muted)" stroke-dasharray="4 4"/><path d="M${fx(c[0])} ${fx(c[1])}V${oy}" stroke="var(--fg)" stroke-width="1.6"/><path d="M${fx(b[0]-10)} ${oy}V${oy-10}H${fx(b[0])}" fill="none" stroke="var(--fg)"/>`;
  s+=arrow(ox,oy,a[0],a[1],'--fg',2.6)+arrow(ox,oy,ie[0],ie[1],'--blue',2.4)+arrow(a[0],a[1],c[0],c[1],'--on',2.4)+arrow(ox,oy,c[0],c[1],'--live',3);
  s+=laT(ox-8,oy+4,'o',{a:'end'})+laT(a[0]-4,a[1]+16,'a')+laT(b[0]+8,b[1]+16,'b')+laT(c[0]+8,c[1]-4,'c',{a:'start'});
  s+=laT((ox+a[0])/2,oy+16,'VPh')+laT(ie[0]-8,ie[1]+6,'IPh',{a:'end',col:'--blue'})+laT((a[0]+c[0])/2-10,(a[1]+c[1])/2,'jXs·IPh',{a:'end',col:'--on'})+laT((ox+c[0])/2-10,(oy+c[1])/2-10,'EPh',{col:'--live'});
  s+=laT(ox+60,oy-10,'δ',{col:'--live'})+laT(ox+44,oy+28,'θ',{col:'--blue'})+laT(c[0]-14,c[1]+34,'θ',{col:'--on'});
  s+=laT(c[0]+10,(c[1]+oy)/2,'EPh sinδ = Xs IPh cosθ',{a:'start',fs:11});
  return s+'</svg>'}
function fig316(){return svgPlot({x0:-180,x1:180,y0:-1.25,y1:1.25,xt:[-180,-90,0,90,180],yt:[],xf:v=>v+'°',xl:'δ',yl:'Po',aria:'العلاقة بين القدرة وزاوية القدرة',
  under:(X,Y)=>`<rect x="${X(0)}" y="${Y(1.25)}" width="${X(90)-X(0)}" height="${Y(-1.25)-Y(1.25)}" fill="var(--on-soft)"/><rect x="${X(-90)}" y="${Y(1.25)}" width="${X(0)-X(-90)}" height="${Y(-1.25)-Y(1.25)}" fill="var(--blue-soft)"/>`,
  series:[{pts:samp(d=>Math.sin(d*D),-180,180,120),col:'--live'}],
  extra:(X,Y)=>arT(X(45),Y(-0.6),'مولد تزامني',{fs:12})+arT(X(-45),Y(0.6),'محرك تزامني',{fs:12})+laT(X(90),Y(1.12),'Pmax')+laT(X(-90),Y(-1.12),'-Pmax')+arT(X(135),Y(-0.9),'غير مستقر',{fs:11,col:'--muted'})+arT(X(-135),Y(0.9),'غير مستقر',{fs:11,col:'--muted'})})}
function flowSVG(v){const W=560,H=330,x=70,wIn=150,k=wIn/Math.max(1e-9,v.Pin);let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط سريان القدرة">`;
  let w=wIn,y=44;const br=[['PF',v.PF,'PF'],['Pcor',v.Pcor,'Pcor'],['Pcu1',v.Pcu,'Pcu1 = 3RA·Iph²']];const ys=[96,160,224];
  s+=laT(x,26,`Pin = Po + Pcu1 + Pcor + PF = ${fm(v.Pin,1)} kW`,{a:'start',fs:12});
  br.forEach(([n,val,lab],i)=>{const yk=ys[i];s+=`<rect x="${x}" y="${y}" width="${fx(w)}" height="${yk-y}" fill="var(--blue-soft)" stroke="none"/>`;const wl=Math.max(2,val*k);
    s+=`<rect x="${x}" y="${yk}" width="${fx(w)}" height="${fx(Math.max(wl,2))}" fill="var(--blue-soft)"/><rect x="${fx(x+w)}" y="${yk}" width="${fx(250-w+30)}" height="${fx(wl)}" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="1"/>`;
    s+=`<path d="M${fx(x+280)} ${fx(yk-5)}L${fx(x+300)} ${fx(yk+wl/2)}L${fx(x+280)} ${fx(yk+wl+5)}Z" fill="var(--stop)"/>`+laT(x+308,yk+wl/2+4,`${lab} = ${fm(val,1)} kW`,{a:'start',fs:12,col:'--stop'});
    y=yk+Math.max(wl,2);w=Math.max(2,w-val*k)});
  s+=`<rect x="${x}" y="${fx(y)}" width="${fx(w)}" height="${fx(H-50-y)}" fill="var(--blue-soft)"/><path d="M${x-8} ${H-50}H${fx(x+w+8)}L${fx(x+w/2)} ${H-30}Z" fill="var(--blue)"/>`;
  s+=`<path d="M${x} 44V${H-50}" stroke="var(--blue)" stroke-width="1.6"/>`;
  s+=laT(x,H-10,`Po = 3·Vph·Iph·cosθ = ${fm(v.Po,1)} kW`,{a:'start',fs:12,col:'--blue'});
  return s+'</svg>'}

/* ============================== Lesson 3.5 ============================== */
B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'107–109',
 title:'القدرة وزاوية القدرة ومخطط سريان القدرة والكفاءة',
 summary:'القدرة الخارجة Po = 3·V·I·cosθ، ومع إهمال RA تصبح Po = 3·V·E·sinδ/Xs؛ أكبر قدرة عند δ = 90° ومنطقة التشغيل المستقر. ثم المفاقيد (الاحتكاك والحديد والنحاس) والكفاءة والعزم الداخل.',
 stations:[
  {intro:true},

  {st:1,short:'القدرة الخارجة',title:'مخطط توزيع القدرة: القدرة الخارجة وزاوية القدرة',ref:'ص 107–108',
   q:String.raw`نعرف أن القدرة الخارجة \(3\,VI\cos\theta\)… لكن هل يمكن أن نكتبها بدلالة الجهد الداخلي والزاوية بينه وبين جهد الأطراف؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المخطط الاتجاهي للمولد في الحمل الحثي مع إهمال مقاومة المنتج، بالنقاط o و a و b و c كالشكل ثلاثة-خمسة عشر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="170" r="140" fill="#DDEFE6"/><path d="M200 226H282.8" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 4"/><path d="M105.5 271.9 L162.9 312.0" stroke="#E8735A" stroke-width="1.5" stroke-dasharray="5 4"/><g data-tip="الضلع ⟦bc⟧: مشترك بين المثلثين ⟦abc⟧ و⟦obc⟧، فطوله ⟦Eph·sinδ⟧ ويساوي أيضاً ⟦XS·Iph·cosθ⟧."><path d="M268.8 127.7V226" stroke="transparent" stroke-width="14"/><path d="M268.8 127.7V226" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><path d="M259.8 226V217H268.8" fill="none" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="جهد الأطراف ⟦Vph⟧ (من ⟦o⟧ إلى ⟦a⟧): المرجع."><line x1="40.0" y1="226.0" x2="200.0" y2="226.0" stroke="transparent" stroke-width="14"/><line x1="40.0" y1="226.0" x2="189.0" y2="226.0" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><polygon points="200.0,226.0 189.0,230.9 189.0,221.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph⟧ متأخر عن ⟦Vph⟧ بالزاوية θ (حمل حثي)."><line x1="40.0" y1="226.0" x2="105.5" y2="271.9" stroke="transparent" stroke-width="14"/><line x1="40.0" y1="226.0" x2="96.5" y2="265.6" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><polygon points="105.5,271.9 93.7,269.6 99.4,261.5" fill="#E8735A"/></g><g data-tip="⟦jXS·Iph⟧ (من ⟦a⟧ إلى ⟦c⟧): عمودي على التيار. لا يوجد سهم ⟦Iph·RA⟧ لأننا أهملنا ⟦RA⟧."><line x1="200.0" y1="226.0" x2="268.8" y2="127.7" stroke="transparent" stroke-width="14"/><line x1="200.0" y1="226.0" x2="262.5" y2="136.7" stroke="#2E8C83" stroke-width="3.5" stroke-linecap="round"/><polygon points="268.8,127.7 266.6,139.6 258.5,133.9" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧ (من ⟦o⟧ إلى ⟦c⟧)، والزاوية بينه وبين ⟦Vph⟧ هي زاوية القدرة δ."><line x1="40.0" y1="226.0" x2="268.8" y2="127.7" stroke="transparent" stroke-width="14"/><line x1="40.0" y1="226.0" x2="258.7" y2="132.0" stroke="#12855A" stroke-width="4.5" stroke-linecap="round"/><polygon points="268.8,127.7 260.7,136.6 256.8,127.5" fill="#12855A"/></g><path d="M110 226 A70 70 0 0 0 104.3 198.4" fill="none" stroke="#12855A" stroke-width="2"/><text x="120" y="217" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">δ</text><path d="M74 226 A34 34 0 0 1 67.9 245.5" fill="none" stroke="#E8735A" stroke-width="2"/><text x="83" y="244" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">θ</text><path d="M253.9 149.0 A26 26 0 0 0 268.8 153.7" fill="none" stroke="#E8735A" stroke-width="2"/><text x="256.8291723621255" y="171.70175468532096" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">θ</text><text x="34" y="244" text-anchor="middle" font-size="14" fill="#2C4A40" font-style="italic" font-family="var(--mono)">o</text><text x="196" y="244" text-anchor="middle" font-size="14" fill="#2C4A40" font-style="italic" font-family="var(--mono)">a</text><text x="277" y="244" text-anchor="middle" font-size="14" fill="#2C4A40" font-style="italic" font-family="var(--mono)">b</text><text x="279" y="124" text-anchor="middle" font-size="14" fill="#2C4A40" font-style="italic" font-family="var(--mono)">c</text><text x="168" y="218" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan></text><text x="109.53216354311934" y="291.8861149080837" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">ph</tspan></text><text x="246" y="202" text-anchor="middle" font-size="13" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="9" dy="4">S</tspan></text><text x="140" y="160" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan></text><text x="334" y="268" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E sinδ = X<tspan font-size="9" dy="3">S</tspan><tspan dy="-3"> I cosθ</tspan></text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-15)</span>: الضلع المتقطع <span class="ltr">bc</span> مشترك بين المثلثين <span class="ltr">abc</span> و<span class="ltr">obc</span>.<br><b>مرّر المؤشر على الأسهم والضلع <span class="ltr">bc</span> (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>القدرة الفعالة الخارجة من المولد التزامني:</p>
     <div class="eq">$$P_o=3\,V_{ph}I_{ph}\cos\theta$$<span class="eqno">(3-14)</span></div>
     <p>حيث \(\theta\) هي الزاوية بين الجهد والتيار، وجيب تمامها هو معامل القدرة.</p>
     <p>إذا أهملنا مقاومة ملفات المنتج \(R_A\) وذلك لصغر قيمتها عندما تقارن بالممانعة التزامنية \(X_S\) كما في الشكل (3-8) فإننا نستطيع إيجاد معادلة مهمة جداً لحساب القدرة الخارجة من الآلة التزامنية. لكي نوجد هذه المعادلة نستعين بالمخطط الاتجاهي في حالة الحمل الحثي الموضح في الشكل (3-15).</p>`,ref:'ص 107'}
   ],
   body:[
    {book:String.raw`<p>نلاحظ أن المستقيم bc يمكن أن يعبر عنه بـ\((E_{Ph}\sin\delta)\) أو بـ\((X_SI_{Ph}\cos\theta)\) وذلك لكونه ضلعاً مشتركاً في المثلثين abc وobc، وبالتالي:</p>
     <div class="eq">$$I_{Ph}\cos\theta=\frac{E_{Ph}\sin\delta}{X_S}$$</div>
     <p>وبعد التعويض في (3-14):</p>
     <div class="eq">$$P_o=\frac{3\,V_{ph}E_{ph}\sin\delta}{X_S}$$<span class="eqno">(3-15)</span></div>`,ref:'ص 107–108'},
    {tip:String.raw`<p>في المثلث القائم \(obc\): الوتر \(oc=E_{Ph}\) والزاوية عند \(o\) هي \(\delta\)، فالضلع المقابل \(bc=E_{Ph}\sin\delta\).<br>
     وفي المثلث القائم \(abc\): الوتر \(ac=X_SI_{Ph}\)، والزاوية بينه وبين \(bc\) هي \(\theta\) (لأن \(ac\) عمودي على التيار و\(bc\) عمودي على \(V_{ph}\))، فالضلع المجاور \(bc=X_SI_{Ph}\cos\theta\).<br>
     نساوي الطولين، ثم نعوّض \(I_{Ph}\cos\theta\) في (3-14) فنحصل على (3-15).</p>`,title:'الاشتقاق خطوة خطوة'},
    {predict:{q:String.raw`من المعادلة (3-15)، إذا بقي \(V_{ph}\) و\(E_{ph}\) و\(X_S\) ثابتة، فما الذي يحدد مقدار القدرة الخارجة؟`,opts:[
     [String.raw`الزاوية \(\delta\) بين \(V_{ph}\) و\(E_{ph}\)`,true,'الكتاب يسميها زاوية القدرة أو زاوية العزم (ص 108)، وهي موضوع المحطة التالية.'],
     ['تردد المولد',false,'التردد لا يظهر في المعادلة (3-15)، وهو ثابت أصلاً.'],
     [String.raw`مقاومة المنتج \(R_A\)`,false,String.raw`المعادلة (3-15) اشتُقت بعد إهمال \(R_A\)، فلا تظهر فيها.`]]}},
    {watch:String.raw`<p>المعادلة (3-15) <b>تقريبية</b>: صحيحة عندما نهمل \(R_A\) كما في الدائرة التقريبية (3-8). وفيها جهود <b>الوجه</b>، والرقم 3 لأن للمولد ثلاثة أوجه.</p>`}
   ]},

  {st:2,short:'زاوية القدرة',title:'زاوية القدرة وأكبر قدرة ومنطقة التشغيل المستقر',ref:'ص 108–109',
   q:String.raw`إذا زدنا الزاوية \(\delta\) تزيد القدرة… فهل تبقى تزيد إلى ما لا نهاية؟ وماذا يحدث بعد ذلك؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى القدرة الخارجة مقابل زاوية القدرة: جيبي، قمته عند تسعين درجة، ومنطقتا التشغيل المستقر للمولد والمحرك مظللتان كالشكل ثلاثة-ستة عشر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<g data-tip="منطقة التشغيل المستقر كمولد تزامني: ⟦0 < δ < 90°⟧."><rect x="180" y="56" width="70" height="188" fill="#4FB3A9" opacity=".35"/></g>
<g data-tip="منطقة التشغيل المستقر كمحرك تزامني: ⟦−90° < δ < 0⟧."><rect x="110" y="56" width="70" height="188" fill="#E8735A" opacity=".3"/></g>
<g data-tip="منطقة التشغيل غير المستقر: بعد ⟦90°⟧ (أو قبل ⟦−90°⟧) تقل القدرة كلما زادت الزاوية."><rect x="250" y="56" width="70" height="188" fill="transparent"/><rect x="40" y="56" width="70" height="188" fill="transparent"/></g>
<path d="M40 150H330M180 250V44" stroke="#2C4A40" stroke-width="2"/><polygon points="336,150 326,145 326,155" fill="#2C4A40"/><polygon points="180,38 175,48 185,48" fill="#2C4A40"/>
<path d="M110 56V244M250 56V244M40 56V244M320 56V244" stroke="#2C4A40" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>
<g data-tip="⟦Po = 3·Vph·Eph·sinδ / XS⟧ (3-15): القدرة الخارجة تتغير مع جيب الزاوية δ."><path d="M40 150 L46 161 L52 172 L58 183 L63 192 L69 202 L75 210 L81 217 L87 224 L92 229 L98 232 L104 234 L110 235 L116 234 L122 232 L128 229 L133 224 L139 217 L145 210 L151 202 L157 192 L162 183 L168 172 L174 161 L180 150 L186 139 L192 128 L198 117 L203 108 L209 98 L215 90 L221 83 L227 76 L232 71 L238 68 L244 66 L250 65 L256 66 L262 68 L268 71 L273 76 L279 83 L285 90 L291 98 L297 108 L302 117 L308 128 L314 139 L320 150" fill="none" stroke="transparent" stroke-width="14"/><path d="M40 150 L46 161 L52 172 L58 183 L63 192 L69 202 L75 210 L81 217 L87 224 L92 229 L98 232 L104 234 L110 235 L116 234 L122 232 L128 229 L133 224 L139 217 L145 210 L151 202 L157 192 L162 183 L168 172 L174 161 L180 150 L186 139 L192 128 L198 117 L203 108 L209 98 L215 90 L221 83 L227 76 L232 71 L238 68 L244 66 L250 65 L256 66 L262 68 L268 71 L273 76 L279 83 L285 90 L291 98 L297 108 L302 117 L308 128 L314 139 L320 150" fill="none" stroke="#2C4A40" stroke-width="3.5"/></g>
<g data-tip="أكبر قدرة ⟦Pmax⟧ عند ⟦δ = 90°⟧ لأن ⟦sinδ = 1⟧ — المعادلة (3-16)."><circle cx="250" cy="65" r="6" fill="#12855A"/><text x="250" y="50" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">max</tspan></text></g>
<text x="215" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مولد</text><text x="145" y="118" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">محرك</text>
<text x="338" y="172" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">δ</text><text x="200" y="44" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">o</tspan></text>
<g font-size="11.5" fill="#2C4A40" direction="ltr" font-family="var(--mono)" text-anchor="middle"><text x="40" y="266">−180°</text><text x="110" y="266">−90°</text><text x="180" y="266">0</text><text x="250" y="266">90°</text><text x="318" y="266">180°</text></g>
<text x="180" y="296" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">الملوّن = تشغيل مستقر</text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-16)</span>: الفيروزي منطقة المولد المستقرة، والبرتقالي منطقة المحرك المستقرة، والباقي غير مستقر.<br><b>مرّر المؤشر على المناطق والمنحنى والقمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>من خلال المعادلة (3-15) يمكن رسم العلاقة بين \(P_o\) و\(\delta\) كما في الشكل (3-16). العلاقة (3-15) توضح أن القدرة الخارجة من المولد التزامني تعتمد على الزاوية \(\delta\) بين \(V_{Ph}\) و\(E_{Ph}\)، هذه الزاوية \(\delta\) تسمى <b>زاوية القدرة <span class="ltr">Power angle</span></b> أو <b>زاوية العزم <span class="ltr">Torque angle</span></b>. كما يلاحظ أيضاً أن <b>أكبر قدرة يمكن أن تؤخذ من المولد نظرياً عندما تكون قيمة الزاوية \(\delta\) تسعون درجة، أي أن \((\sin\delta=1)\)</b>، وبالتالي:</p>
     <div class="eq">$$P_{max}=\frac{3\,V_{ph}E_{ph}}{X_S}$$<span class="eqno">(3-16)</span></div>`,ref:'ص 108'}
   ],
   body:[
    {book:String.raw`<p>منطقة التشغيل الآمن أو المستقر للآلة التزامنية عندما تكون \((\delta\lt 90)\) في حالة التشغيل كمولد، أو عندما تكون \((\delta\gt -90)\) في حالة التشغيل كمحرك، كما هو موضح في الشكل (3-16).</p>`,ref:'ص 109'},
    {watch:String.raw`<p>الشرط مطبوع في الكتاب «<span class="ltr">(90-&lt; δ)</span>» والمقصود \(\delta\gt -90^\circ\) لتشغيل المحرك، كما في الشكل (3-16).</p>`,fix:true},
    {title:'حرّك زاوية القدرة',widget:(el,B)=>{
      let d=30;
      const X=v=>40+(v+180)/360*280,Y=p=>95-p*70;
      let curve='';for(let i=0;i<=72;i++){const v=-180+i*5;curve+=(i?'L':'M')+X(v).toFixed(1)+' '+Y(Math.sin(v*Math.PI/180)).toFixed(1)}
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">النسبة \\(P_o/P_{max}=\\sin\\delta\\) من المعادلتين (3-15) و(3-16)، فلا نحتاج أي أرقام للآلة.</p>
       <div data-o="svg" style="max-width:440px;margin:0 auto"></div>
       <label class="w-sl"><span>زاوية القدرة <span class="ltr">δ = <b data-o="d"></b>°</span></span><input type="range" min="-180" max="180" step="1" dir="ltr" value="${d}"></label>
       <div class="w-row"><button class="btn" type="button" data-v="30"><span class="ltr">30°</span></button><button class="btn" type="button" data-v="90"><span class="ltr">90°</span></button><button class="btn" type="button" data-v="120"><span class="ltr">120°</span></button><button class="btn" type="button" data-v="-30"><span class="ltr">−30°</span></button></div>
       <div class="w-facts"><div><span>القدرة نسبةً إلى <bdi dir="ltr">P<sub>max</sub></bdi></span><b data-o="p"></b></div><div><span>تعمل الآلة</span><b data-o="m" style="font-family:var(--font);direction:rtl;text-align:start;font-size:14px"></b></div><div style="grid-column:span 2"><span>الحالة</span><b data-o="s" style="font-family:var(--font);direction:rtl;text-align:start;font-size:14px;line-height:1.6"></b></div></div>`;
      B.math(el);
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const p=Math.sin(d*Math.PI/180),st=Math.abs(d)<90,on=Math.abs(d)<0.5;
        o('svg').innerHTML=`<svg viewBox="0 0 360 190" role="img" aria-label="منحنى القدرة مع نقطة التشغيل" style="width:100%;height:auto;font-family:var(--font)"><rect x="180" y="20" width="70" height="150" fill="#4FB3A9" opacity=".3"/><rect x="110" y="20" width="70" height="150" fill="#E8735A" opacity=".25"/><path d="M40 95H330M180 170V15" stroke="#2C4A40" stroke-width="1.5"/><path d="${curve}" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="${X(d).toFixed(1)}" y1="95" x2="${X(d).toFixed(1)}" y2="${Y(p).toFixed(1)}" stroke="${st?'#12855A':'#C0392B'}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${X(d).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="8" fill="${st?'#12855A':'#C0392B'}" stroke="#FBF6EE" stroke-width="2"/><g font-size="11" fill="#2C4A40" direction="ltr" font-family="var(--mono)" text-anchor="middle"><text x="40" y="186">−180°</text><text x="110" y="186">−90°</text><text x="180" y="186">0</text><text x="250" y="186">90°</text><text x="318" y="186">180°</text></g></svg>`;
        o('d').textContent=d;o('p').textContent=B.fmtN(p*100,0)+' %';
        o('m').textContent=on?'لا قدرة فعالة':d>0?'مولداً (تعطي قدرة)':'محركاً (تأخذ قدرة)';
        o('s').textContent=on?'الزاوية صفر: لا تنتقل قدرة فعالة.':st?(Math.abs(d)>=80?'مستقرة لكنها قريبة جداً من الحد ⟵ زيادة صغيرة أخرى قد تُخرجها من التزامن.':'منطقة التشغيل المستقر.'):(Math.abs(d)===90?'عند الحد تماماً: أكبر قدرة نظرياً.':'منطقة التشغيل غير المستقر: القدرة تقل مع زيادة الزاوية، فتفقد الآلة التزامن.');
        if(Math.abs(d)===90)o('s').textContent='عند الحد تماماً: أكبر قدرة نظرياً — المعادلة (3-16).'};
      rg.oninput=()=>{d=+rg.value;draw()};
      el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{d=+b.dataset.v;rg.value=d;draw()});
      draw();
    }},
    {predict:{q:String.raw`مولد يعمل عند \(\delta=60^\circ\). طلبنا منه قدرة أكبر فزادت الزاوية إلى \(120^\circ\). ماذا يحدث للقدرة التي يعطيها؟`,opts:[
     ['تزيد، لأن الزاوية زادت',false,String.raw`القدرة تزيد مع الزاوية حتى \(90^\circ\) فقط. بعدها ينزل المنحنى.`],
     [String.raw`تقل، ويدخل المولد منطقة التشغيل غير المستقر`,true,String.raw`\(\sin120^\circ=\sin60^\circ\)، لكن المولد الآن بعد القمة: كل زيادة في الزاوية تُنقص القدرة، فلا يستطيع موازنة القدرة الداخلة ويخرج من التزامن.`],
     ['تبقى ثابتة عند أكبر قدرة',false,String.raw`أكبر قدرة عند \(90^\circ\) فقط، لا عند \(120^\circ\).`]]}},
    {tip:String.raw`<p>كلما زادت القدرة المطلوبة من المولد زادت \(\delta\). حتى <span class="ltr">90°</span> تزيد القدرة مع \(\delta\) (مستقر). بعد <span class="ltr">90°</span> تقل القدرة مع زيادة \(\delta\)، فلا يستطيع المولد موازنة القدرة الداخلة فيتسارع ويخرج من التزامن. لذلك تُشغّل المولدات بزاوية أقل بكثير من <span class="ltr">90°</span>.</p>`,title:'لماذا 90° حدّ؟'}
   ]},

  {st:3,short:'سريان القدرة والكفاءة',title:'مخطط سريان القدرة داخل المولد، والكفاءة',ref:'ص 109',
   q:'التوربينة تعطي المولد قدرة ميكانيكية… هل تخرج كلها كهرباء؟ وأين يذهب الباقي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط سريان القدرة بأرقام مثال ثلاثة-واحد: قدرة داخلة ثمانمئة وتسعة وثمانون فاصلة ستة كيلوواط، تخرج منها مفاقيد الاحتكاك والحديد والنحاس، والباقي سبعمئة وثمانية وتسعون كيلوواط قدرة خارجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="القدرة الداخلة ⟦Pin⟧: قدرة ميكانيكية من المحرك الأولي. في مثال (3-1): ⟦Pin = 798 + 21.6 + 30 + 40 = 889.6 kW⟧."><path d="M70 26H170V70H70Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="120" y="45" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">in</tspan></text><text x="120" y="63" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">889.6 kW</text></g>
<path d="M80 70H160V258H80Z" fill="#F2C14E" opacity=".55"/>
<g data-tip="مفاقيد الاحتكاك ⟦PF⟧: فقد ميكانيكي. في مثال (3-1): ⟦40 kW⟧."><path d="M160 90C200 90 210 96 236 96" fill="none" stroke="#E8735A" stroke-width="10"/><polygon points="250,96 234,86 234,106" fill="#E8735A"/><text x="296" y="101" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">F</tspan><tspan dy="-3"> 40 kW</tspan></text></g>
<g data-tip="المفاقيد الحديدية ⟦Pcor⟧: فقد في الدائرة المغناطيسية. في مثال (3-1): ⟦30 kW⟧."><path d="M160 136C200 136 210 142 236 142" fill="none" stroke="#9B7BD0" stroke-width="8"/><polygon points="250,142 234,133 234,151" fill="#9B7BD0"/><text x="296" y="147" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">cor</tspan><tspan dy="-3"> 30 kW</tspan></text></g>
<g data-tip="المفاقيد النحاسية ⟦Pcu1 = 3·RA·Iph²⟧: فقد في الدائرة الكهربائية (ملفات المنتج). في مثال (3-1): ⟦21.6 kW⟧."><path d="M160 182C200 182 210 188 236 188" fill="none" stroke="#2E8C83" stroke-width="7"/><polygon points="250,188 234,180 234,196" fill="#2E8C83"/><text x="296" y="193" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">cu1</tspan><tspan dy="-3"> 21.6 kW</tspan></text></g>
<g data-tip="القدرة الخارجة ⟦Po = 3·Vph·Iph·cosθ⟧ (3-14): قدرة كهربائية إلى الحمل. في مثال (3-1): ⟦798 kW⟧."><polygon points="120,290 76,250 164,250" fill="#12855A"/><text x="120" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="9" dy="3">o</tspan><tspan dy="-3"> 798 kW</tspan></text></g>
<text x="270" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الكفاءة</text><text x="270" y="272" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">89.7%</text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-17)</span> بأرقام مثال <span class="ltr">(3-1)</span> د (ص 116). القدرة تدخل من الأعلى، وتخرج المفاقيد يميناً، والباقي يخرج من الأسفل كهرباء.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف اسم كل جزء وقيمته.</b>',
   side:[
    {book:String.raw`<p>أثناء تحويل الطاقة الميكانيكية \((P_{in})\) إلى طاقة كهربائية \((P_o)\) بواسطة المولد، يفقد جزء من الطاقة في الدائرة المغناطيسية \((P_{cor})\) وجزء في الدائرة الكهربائية \((P_{cu1})\)، علاوة على ذلك يفقد جزء في صورة فقد ميكانيكي \((P_F)\). يلخص الشكل (3-17) كيفية انتقال القدرة داخل المولد التزامني ثلاثي الأوجه.</p>`,ref:'ص 109'}
   ],
   body:[
    {book:String.raw`<p>المعادلات المستعملة في الشكل (3-17) وفي حل الأمثلة:</p>
     <div class="eq">$$P_{in}=P_o+P_{cu1}+P_{cor}+P_F\qquad P_{cu1}=3I_{ph}^2R_A$$</div>
     <div class="eq">$$\eta\%=\frac{P_o}{P_{in}}\times100\qquad T_{in}=\frac{P_{in}}{\omega}\qquad \omega=\frac{2\pi n}{60}$$</div>
     <p class="sub">\(P_{cor}\) المفاقيد الحديدية، \(P_F\) مفاقيد الاحتكاك، \(T\) بالنيوتن·متر، \(\omega\) بالراديان/ثانية.</p>`,ref:'ص 109، 116، 121'},
    {title:'احسب القدرة الداخلة والكفاءة',widget:(el,B)=>{
      const EX={a:{t:'مثال (3-1) د',Po:798,Pcu:21.6,Pcor:30,PF:40},b:{t:'مثال (3-2) جـ',Po:34.1,Pcu:0,Pcor:1,PF:1.5}};
      const F=[['Po','القدرة الخارجة','P<sub>o</sub>'],['Pcu','المفاقيد النحاسية','P<sub>cu1</sub>'],['Pcor','المفاقيد الحديدية','P<sub>cor</sub>'],['PF','مفاقيد الاحتكاك','P<sub>F</sub>']];
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">أرقام مثالي الكتاب بالكيلوواط، أو اكتب أرقامك.</p>
       <div class="w-row" style="margin-top:0">${Object.keys(EX).map(k=>`<button class="btn" type="button" data-e="${k}">${EX[k].t.replace(/\((\d-\d)\)/,'<span class="ltr">($1)</span>')}</button>`).join('')}</div>
       <div class="w-row">${F.map(f=>`<label>${f[1]} <span class="ltr">${f[2]}</span>: <input type="number" data-i="${f[0]}" step="any" min="0" dir="ltr" style="width:5.5em"> <span class="ltr">kW</span></label>`).join('')}</div>
       <div class="w-facts"><div><span>القدرة الداخلة <bdi dir="ltr">P<sub>in</sub></bdi></span><b data-o="in"></b></div><div><span>مجموع المفاقيد</span><b data-o="l"></b></div><div><span>الكفاءة <bdi dir="ltr">η</bdi></span><b data-o="e"></b></div><div><span>المفاقيد نسبةً إلى الداخلة</span><b data-o="k"></b></div></div>`;
      const v=k=>Math.max(0,+el.querySelector(`[data-i="${k}"]`).value||0),o=k=>el.querySelector(`[data-o="${k}"]`);
      const set=k=>{F.forEach(f=>el.querySelector(`[data-i="${f[0]}"]`).value=EX[k][f[0]]);draw()};
      const draw=()=>{const Po=v('Po'),L=v('Pcu')+v('Pcor')+v('PF'),Pin=Po+L;
        o('in').textContent=B.fmtN(Pin,1)+' kW';o('l').textContent=B.fmtN(L,1)+' kW';
        o('e').textContent=Pin>0?B.fmtN(Po/Pin*100,1)+' %':'—';o('k').textContent=Pin>0?B.fmtN(L/Pin*100,1)+' %':'—'};
      el.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>set(b.dataset.e));
      el.querySelectorAll('[data-i]').forEach(i=>i.oninput=draw);
      set('a');
    }},
    {predict:{q:String.raw`في مثال (3-2) أُهملت مقاومة ملفات المنتج. ماذا يعني ذلك للمفاقيد النحاسية \(P_{cu1}\)؟`,opts:[
     ['تساوي مفاقيد الحديد',false,'لا علاقة بين النوعين؛ مفاقيد الحديد في الدائرة المغناطيسية.'],
     [String.raw`تساوي صفراً، لأن \(P_{cu1}=3I_{ph}^2R_A\) و\(R_A\) مهملة`,true,String.raw`هذا ما فعله الكتاب في مثال (3-2) جـ: \(P_{in}=34.1+0+1.0+1.5=36.6\ \text{kW}\).`],
     ['تساوي مفاقيد الاحتكاك',false,'مفاقيد الاحتكاك ميكانيكية، وقيمتها معطاة مستقلة في نص المثال.']]}},
    {watch:String.raw`<p>في مثال (3-2) جـ ص 120 كُتب \(P_o=3\times308.8\times60\times0.8=34.1\ \text{kW}\)، والعدد 308.8 جهد حالة الحمل المتقدم. الحالة المطلوبة (0.8 متأخر) جهدها <span class="ltr">236.8 V</span>، والناتج <span class="ltr">34.1 kW</span> صحيح لـ 236.8 (أما 308.8 فتعطي <span class="ltr">44.47 kW</span>).<br>وفي مثال (3-2) د ص 121 كُتب \(T_{in}=36.6\times10^3/125.7=191.2\ \text{Nm}\)، والقسمة الصحيحة <b><span class="ltr">291.2 Nm</span></b> تقريباً.</p>`,fix:true},
    {add:String.raw`<p>مفاقيد المولد كلها تتحول إلى حرارة داخله. لهذا تحتاج المولدات الكبيرة أنظمة تبريد قوية، ولهذا أيضاً كان من أسباب وضع المنتج على العضو الثابت «سهولة تبريد ملفات إنتاج الطاقة الكهربائية» (الدرس الأول).</p>`,title:'أين تذهب المفاقيد؟'}
   ]},

  {recap:[
   String.raw`القدرة الفعالة الخارجة، المعادلة (3-14): \(P_o=3\,V_{ph}I_{ph}\cos\theta\)`,
   String.raw`مع إهمال \(R_A\)، المعادلة (3-15): \(P_o=\dfrac{3\,V_{ph}E_{ph}\sin\delta}{X_S}\)، و\(\delta\) زاوية القدرة (زاوية العزم).`,
   String.raw`أكبر قدرة عند \(\delta=90^\circ\)، المعادلة (3-16): \(P_{max}=\dfrac{3\,V_{ph}E_{ph}}{X_S}\)؛ والتشغيل المستقر \(\delta\lt90\) للمولد و\(\delta\gt-90\) للمحرك (ص 109).`,
   String.raw`\(P_{in}=P_o+P_{cu1}+P_{cor}+P_F\)، و\(\eta\%=\dfrac{P_o}{P_{in}}\times100\)، و\(T_{in}=P_{in}/\omega\) (الشكل 3-17 والأمثلة).`]}
],
 theory:[
  {h:'مخطط توزيع القدرة في الآلة التزامنية',ref:'ص 107',html:`<p>القدرة الفعالة الخارجة من المولد التزامني:</p>
   $$P_o=3V_{ph}I_{ph}\\cos\\theta\\qquad(3\\text{-}14)$$
   <p>حيث \\(\\theta\\) الزاوية بين الجهد والتيار، وجيب تمامها معامل القدرة. إذا أهملنا \\(R_A\\) لصغرها مقارنة بـ\\(X_S\\) (الشكل 3-8) نستطيع إيجاد معادلة مهمة جداً للقدرة الخارجة، مستعينين بالمخطط الاتجاهي للحمل الحثي في الشكل (3-15).</p>`},
  {fig:'(3-15)',ref:'ص 107',caption:'المخطط الاتجاهي للمولد التزامني في حالة الحمل الحثي مع إهمال \\(R_A\\) (أُعيد رسمه)',draw:()=>svgbox(fig315(),520)},
  {html:`<p>نلاحظ أن المستقيم bc يمكن أن يعبر عنه بـ\\((E_{Ph}\\sin\\delta)\\) أو بـ\\((X_SI_{Ph}\\cos\\theta)\\) لكونه ضلعاً مشتركاً في المثلثين abc وobc، وبالتالي:</p>
   $$I_{Ph}\\cos\\theta=\\frac{E_{Ph}\\sin\\delta}{X_S}$$ <p>وبالتعويض في (3-14) <span class="ref">ص 108</span>:</p>
   $$P_o=\\frac{3V_{ph}E_{ph}\\sin\\delta}{X_S}\\qquad(3\\text{-}15)$$
   <p>العلاقة (3-15) توضح أن القدرة الخارجة تعتمد على الزاوية \\(\\delta\\) بين \\(V_{Ph}\\) و\\(E_{Ph}\\)، وتسمى <b>زاوية القدرة <span class="ltr">Power angle</span></b> أو <b>زاوية العزم <span class="ltr">Torque angle</span></b>. و«أكبر قدرة يمكن أن تؤخذ من المولد نظرياً عندما تكون قيمة الزاوية \\(\\delta\\) تسعون درجة، أي أن \\(\\sin\\delta=1\\)»:</p>
   $$P_{max}=\\frac{3V_{ph}E_{ph}}{X_S}\\qquad(3\\text{-}16)$$`},
  {fig:'(3-16)',ref:'ص 108',caption:'العلاقة بين القدرة الخارجة وزاوية القدرة δ: المنطقة الملونة منطقة التشغيل المستقر (مولد تزامني بين 0 و90°، ومحرك تزامني بين −90° و0)، والبيضاء منطقة التشغيل غير المستقر',draw:()=>svgbox(fig316(),520)},
  {html:`<p>«منطقة التشغيل الآمن أو المستقر للآلة التزامنية عندما تكون \\((\\delta\\lt 90)\\) في حالة التشغيل كمولد، أو عندما تكون \\((\\delta\\gt -90)\\) في حالة التشغيل كمحرك» <span class="ref">ص 109</span>.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 109: الشرط مطبوع «(90-&lt; δ)» والمقصود \\(\\delta\\gt -90^\\circ\\) لتشغيل المحرك، كما في الشكل (3-16).'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> كلما زادت القدرة المطلوبة من المولد زادت δ. حتى 90° تزيد القدرة مع δ (مستقر). بعد 90° تقل القدرة مع زيادة δ، فلا يستطيع المولد موازنة القدرة الداخلة فيتسارع ويخرج من التزامن. لذلك تُشغّل المولدات بزاوية أقل بكثير من 90°.'},
  {h:'مخطط سريان القدرة والكفاءة',ref:'ص 109',html:`<p>أثناء تحويل الطاقة الميكانيكية \\(P_{in}\\) إلى كهربائية \\(P_o\\) يفقد جزء في الدائرة المغناطيسية \\(P_{cor}\\) (المفاقيد الحديدية) وجزء في الدائرة الكهربائية \\(P_{cu1}\\) (المفاقيد النحاسية)، وجزء في صورة فقد ميكانيكي \\(P_F\\) (مفاقيد الاحتكاك). الشكل (3-17) يلخص انتقال القدرة.</p>`},
  {fig:'(3-17)',ref:'ص 109',caption:'مخطط سريان القدرة داخل المولد التزامني ثلاثي الأوجه (الأرقام هنا من مثال 3-1 د)',draw:()=>svgbox(flowSVG({Pin:889.6,PF:40,Pcor:30,Pcu:21.6,Po:798}),560)},
  {html:`<p>المعادلات المستعملة (من الشكل والأمثلة):</p>
   $$P_{in}=P_o+P_{cu1}+P_{cor}+P_F\\qquad P_{cu1}=3I_{ph}^2R_A$$
   $$\\eta\\%=\\frac{P_o}{P_{in}}\\times100\\qquad T_{in}=\\frac{P_{in}}{\\omega}\\qquad \\omega=\\frac{2\\pi n}{60}$$
   <p>\\(T\\) بالنيوتن·متر و\\(\\omega\\) بالراديان/ثانية.</p>`},
  {note:'<b>ملاحظة على العنوان:</b> «مخطط توزيع القدرة» في الكتاب يشمل علاقة القدرة بزاوية δ (3-15، 3-16) ومخطط سريان القدرة والمفاقيد (3-17).'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مثال (3-2) جـ ص 120: كُتب \\(P_o=3\\times308.8\\times60\\times0.8=34.1\\ kW\\)، والعدد 308.8 جهد حالة الحمل المتقدم. الحالة المطلوبة (0.8 متأخر) جهدها <span class="ltr">236.8 V</span>، والناتج <span class="ltr">34.1 kW</span> صحيح لـ 236.8 (أما 308.8 فتعطي <span class="ltr">44.47 kW</span>). الحاسبة تستعمل 236.8.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مثال (3-2) د ص 121: كُتب \\(T_{in}=36.6\\times10^3/125.7=191.2\\ Nm\\)، والقسمة الصحيحة <b><span class="ltr">291.2 Nm</span></b> تقريباً. في المختبر والحاسبة مفتاح «كما في الكتاب / المصحح».'+'</div>'}
 ],
 lab:(el)=>{
  let dl=9.98,E=277,V=236.8,Xs=1,lastA='';
  const PR={ex31:{V:480,Ir:692.8,pf:0.8,RA:0.015,PF:40,Pcor:30,n:1800,lab:'مثال (3-1) د'},ex32:{V:236.8,Ir:60,pf:0.8,RA:0,PF:1.5,Pcor:1,n:1200,lab:'مثال (3-2) جـ و د'}};
  let pr='ex32',ld=100,pf=0.8,tv='book',lastB='';
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>القدرة مع زاوية القدرة <small>مبنية على الشكل (3-16) والمعادلتين (3-15) و(3-16)</small></h2><div class="sg-chart"><canvas id="l5p"></canvas></div>
    ${legend([['--live','\\(P_o=3VE\\sin\\delta/X_S\\)'],['--on','منطقة المولد المستقرة'],['--blue','منطقة المحرك المستقرة']])}<div id="l5m" class="sg-msg"></div></div>
   <div class="panel c5"><h2>التحكم</h2>
    ${sl('l5d','زاوية القدرة <span class="ltr">δ</span>',-180,180,0.01,dl)}${sl('l5e','الجهد الداخلي <span class="ltr">E<sub>ph</sub></span>',50,400,0.1,E)}${sl('l5v','جهد الأطراف <span class="ltr">V<sub>ph</sub></span>',50,400,0.1,V)}${sl('l5x','الممانعة التزامنية <span class="ltr">X<sub>S</sub></span>',0.2,3,0.01,Xs)}
    <div class="facts">${fact('<bdi dir="ltr">P<sub>o</sub></bdi>','l5po')}${fact('<bdi dir="ltr">P<sub>max</sub></bdi> (3-16)','l5pm')}</div>
    <p class="sub">القيم الابتدائية من مثال (3-2) الحالة (1): <span class="ltr">V<sub>ph</sub> = 236.8 V</span>، <span class="ltr">E<sub>ph</sub> = 277 V</span>، <span class="ltr">X<sub>S</sub> = 1 Ω</span>؛ و δ ≈ 9.98° محسوبة من المخطط الاتجاهي (توضيح).</p></div>
   <div class="panel c12"><h2>مخطط سريان القدرة والكفاءة والعزم <small>مبنية على الشكل (3-17) ص 109</small></h2>
    <div class="sg-row">${segHTML('fp',[['ex31','مثال (3-1) د'],['ex32','مثال (3-2) جـ، د']],pr)}<span id="l5tv"></span></div>
    <div class="grid" style="margin-top:0"><div class="c7"><div id="l5f" class="svgbox" style="max-width:560px;margin-inline:auto"></div></div>
    <div class="c5">${sl('l5ld','الحمل (نسبة من تيار الحمل الكامل)',0,120,1,ld)}${sl('l5pf','معامل القدرة',0.5,1,0.01,pf)}
     <div class="facts">${fact('الكفاءة η','l5eta')}${fact('ω','l5w')}${fact('العزم الداخل <bdi dir="ltr">T<sub>in</sub></bdi>','l5t')}</div><div id="l5tm" class="sg-msg"></div>
     <p class="sub">جهد الأطراف والمفاقيد الحديدية والاحتكاك ثابتة عند قيم المثال. المفاقيد النحاسية \\(3I^2R_A\\) تتغير مع الحمل (وهي صفر في مثال 3-2 لأن \\(R_A\\) مهملة).</p></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  $('#l5d').oninput=e=>{dl=+e.target.value};$('#l5e').oninput=e=>{E=+e.target.value};$('#l5v').oninput=e=>{V=+e.target.value};$('#l5x').oninput=e=>{Xs=+e.target.value};
  $('#l5ld').oninput=e=>{ld=+e.target.value};$('#l5pf').oninput=e=>{pf=+e.target.value};
  const tvUI=()=>{$('#l5tv').innerHTML=pr==='ex32'?segHTML('tv',[['book','كما في الكتاب'],['fixed','المصحح']],tv):'';if(pr==='ex32')segOn($('#l5tv'),'tv',v=>{tv=v;lastB=''})};
  segOn(el,'fp',v=>{pr=v;ld=100;pf=PR[pr].pf;$('#l5ld').value=ld;$('#l5pf').value=pf;tvUI();lastB=''});tvUI();
  let saw90=0,sawUn=0,sawMot=0;
  const steps=stepsUI($('#l5st'),[
   {t:'قدرة مثال (3-2)',x:'بالقيم الابتدائية \\(P_o\\) ≈ <span class="ltr">34.1 kW</span>، وهي القدرة الخارجة في مثال (3-2) جـ — المعادلتان (3-14) و(3-15) تعطيان الرقم نفسه.',done:()=>{const P=3*V*E*Math.sin(dl*D)/Xs/1000;return Math.abs(P-34.1)<0.2}},
   {t:'أكبر قدرة',x:'حرّك δ إلى <span class="ltr">90°</span>: تبلغ القدرة \\(P_{max}=3VE/X_S\\).',done:()=>saw90},
   {t:'المنطقة غير المستقرة',x:'تجاوز <span class="ltr">90°</span>: تقل القدرة مع زيادة δ ويظهر تحذير فقد التزامن.',done:()=>sawUn},
   {t:'التشغيل كمحرك',x:'اجعل δ سالبة: القدرة سالبة، أي أن الآلة تأخذ قدرة كهربائية (محرك تزامني).',done:()=>sawMot},
   {t:'زيادة P<sub>max</sub>',x:'ارفع \\(E_{ph}\\) (تيار المجال) أو أنقص \\(X_S\\): يرتفع المنحنى كله وتكبر \\(P_{max}\\).'},
   {t:'الكفاءة والعزم',x:'في مخطط سريان القدرة اختر «مثال (3-2)» وبدّل بين «كما في الكتاب» و«المصحح» لترى العزم <span class="ltr">191.2</span> مقابل <span class="ltr">291.2 N·m</span>.',done:()=>pr==='ex32'&&tv==='fixed'}
  ]);
  loopOn(el,()=>{$('#l5d-v').textContent=fm(dl,2)+'°';$('#l5e-v').textContent=fm(E,1)+' V';$('#l5v-v').textContent=fm(V,1)+' V';$('#l5x-v').textContent=fm(Xs,2)+' Ω';
   $('#l5ld-v').textContent=ld+' %';$('#l5pf-v').textContent=fm(pf,2);
   const sa=[dl,E,V,Xs].join();if(sa!==lastA){lastA=sa;const Pm=3*V*E/Xs/1000,P=Pm*Math.sin(dl*D);
    if(Math.abs(dl-90)<0.6)saw90=1;if(Math.abs(dl)>90.5)sawUn=1;if(dl<-1&&dl>-90)sawMot=1;
    const ym=Math.max(50,Math.ceil(Pm*1.15/50)*50);
    plot($('#l5p'),{xmin:-180,xmax:180,xstep:45,ymin:-ym,ymax:ym,xlabel:'δ (°)',ylabel:'Po (kW)',shade:[{x0:0,x1:90,color:'--on',alpha:.18},{x0:-90,x1:0,color:'--blue',alpha:.14}],series:[{pts:samp(d=>Pm*Math.sin(d*D),-180,180,180),color:'--live'}],points:[{x:dl,y:P,color:Math.abs(dl)>90?'--stop':'--fg'}]});
    $('#l5po').textContent=fm(P,2)+' kW';$('#l5pm').textContent=fm(Pm,2)+' kW';
    $('#l5m').innerHTML=Math.abs(dl)>90?'<div class="callout err"><b>منطقة تشغيل غير مستقر:</b> بعد 90° تقل القدرة مع زيادة δ؛ الآلة تفقد التزامن (الشكل 3-16).</div>':dl>=0?`<div class="callout">تشغيل مستقر <b>كمولد</b> (\\(0\\lt \\delta\\lt 90^\\circ\\)): القدرة تخرج من الآلة.</div>`:`<div class="callout">تشغيل مستقر <b>كمحرك</b> (\\(-90^\\circ\\lt \\delta\\lt 0\\)): القدرة سالبة، أي تدخل الآلة.</div>`;B.math($('#l5m'))}
   const sb3=[pr,ld,pf,tv].join();if(sb3!==lastB){lastB=sb3;const p=PR[pr],I=p.Ir*ld/100,Po=3*p.V*I*pf/1000,Pcu=3*I*I*p.RA/1000,Pin=Po+Pcu+p.Pcor+p.PF,w=2*PI*p.n/60,T=Pin*1000/w;
    $('#l5f').innerHTML=flowSVG({Pin,PF:p.PF,Pcor:p.Pcor,Pcu,Po});$('#l5eta').textContent=fm(Po/Pin*100,2)+' %';$('#l5w').textContent=fm(w,2)+' rad/s';
    const atBook=pr==='ex32'&&ld===100&&Math.abs(pf-0.8)<1e-9;
    if(pr==='ex32'&&tv==='book'&&atBook){$('#l5t').textContent='191.2 N·m';$('#l5tm').innerHTML='<div class="callout err"><b>كما في الكتاب:</b> <span class="ltr">T<sub>in</sub> = 36.6×10³ ÷ 125.7 = 191.2 N·m</span>.<br>هذه القسمة خاطئة، والصحيح <span class="ltr">291.2 N·m</span>. اختر «المصحح».</div>'}
    else{$('#l5t').textContent=fm(T,1)+' N·m';$('#l5tm').innerHTML=pr==='ex32'&&tv==='book'?'<div class="callout">الخطأ المطبوع يخص أرقام المثال فقط؛ بقيم أخرى تُعرض القيمة المحسوبة.</div>':pr==='ex32'?'<div class="callout fixnote">المصحح: \\(T_{in}=P_{in}/\\omega\\) بقسمة صحيحة.</div>':''}
    B.math($('#l5tm'))}
   steps.check()});
 },
 examples:[
  {title:'مثال (3-1) د — كفاءة المولد',ref:'ص 115–116',
   q:'<p>«… جهد الأطراف له <span class="ltr">480 V</span> [دلتا] … الممانعة التزامنية <span class="ltr">0.1 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.015 Ω</span>، عند الحمل الكامل يعطي تياراً مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، فإذا كانت مفاقيد الاحتكاك <span class="ltr">40 kw</span> والمفاقيد الحديدية <span class="ltr">30 kw</span> عند الحمل الكامل … د) كفاءة المولد».</p>',
   given:[{id:'V',label:'جهد الوجه (دلتا)',sym:'V_{ph}',unit:'V',value:480},{id:'IL',label:'تيار الخط',sym:'I_L',unit:'A',value:1200},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:40},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:30}],
   solve:(g)=>ex31Eff(g)},
  {title:'مثال (3-2) جـ، د — الكفاءة والعزم الداخل',ref:'ص 120–121',
   q:'<p>«… تيار الحمل الكامل له <span class="ltr">60 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، مفاقيد الاحتكاك <span class="ltr">1.5 kw</span> والمفاقيد الحديدية <span class="ltr">1 kw</span> … المفاقيد النحاسية مهملة … جـ) كفاءة المولد عند الحمل الكامل إذا كان معامل القدرة 0.8 متأخر. د) العزم الداخل إلى المولد». جهد الوجه عند هذا الحمل من الفقرة (ب) الحالة (1): <span class="ltr">236.8 V</span>.</p>',
   given:[{id:'V',label:'جهد الوجه عند الحمل (ب-1)',sym:'V_{ph}',unit:'V',value:236.8},{id:'I',label:'تيار الوجه (نجمة)',sym:'I_{ph}',unit:'A',value:60},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:1.5},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:1},{id:'n',label:'السرعة',sym:'n',unit:'rpm',value:1200}],
   solve:(g,B,isBook)=>ex32Eff(g,isBook),
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> (جـ) طبع الكتاب 308.8 بدل 236.8 والناتج 34.1 kW صحيح؛ (د) طبع 191.2 N·m والصحيح 291.2 N·m.</span>'},
  {title:'تطبيق على (3-15) و(3-16) بأرقام مثال (3-2) — ليس من حلول الكتاب',ref:'ص 108',
   q:'<p>بأرقام مثال (3-2) الحالة (1): احسب القدرة الخارجة من المعادلة (3-15) وأكبر قدرة من (3-16). الزاوية δ محسوبة من المخطط: \\(\\sin\\delta = X_SI\\cos\\theta/E = 48/277\\).</p>',
   given:[{id:'V',label:'جهد الوجه',sym:'V_{ph}',unit:'V',value:236.8},{id:'E',label:'الجهد الداخلي',sym:'E_{ph}',unit:'V',value:277},{id:'X',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:1},{id:'d',label:'زاوية القدرة',sym:'\\delta',unit:'°',value:9.98}],
   solve:(g)=>{const P=B.round(3*g.V*g.E*Math.sin(g.d*D)/g.X/1000,1),Pm=B.round(3*g.V*g.E/g.X/1000,1);return [
    {t:'المعادلة (3-15):',f:`P_o=\\frac{3\\times ${g.V}\\times ${g.E}\\times\\sin ${g.d}^\\circ}{${g.X}}`,v:P,dp:1,unit:'kW',final:true},
    {t:'المعادلة (3-16):',f:`P_{max}=\\frac{3\\times ${g.V}\\times ${g.E}}{${g.X}}`,v:Pm,dp:1,unit:'kW',final:true},
    {t:'النتيجة الأولى تساوي القدرة الخارجة في مثال (3-2) جـ (34.1 kW)، فالمعادلتان (3-14) و(3-15) متفقتان.'}]}}
 ],
 quiz:[
  {q:'القدرة الفعالة الخارجة من المولد ثلاثي الأوجه:',o:['V·I','3·V<sub>ph</sub>·I<sub>ph</sub>·cosθ','3·V·I·sinθ','V²/X'],c:1,e:'المعادلة (3-14).'},
  {q:'الزاوية δ في المعادلة (3-15) هي الزاوية بين:',o:['V<sub>ph</sub> و I<sub>ph</sub>','V<sub>ph</sub> و E<sub>ph</sub>','E<sub>ph</sub> و I<sub>ph</sub>','I<sub>F</sub> و E'],c:1,e:'ص 108: وتسمى زاوية القدرة أو زاوية العزم.'},
  {q:'أكبر قدرة نظرياً تؤخذ من المولد عندما:',o:['δ = 0','δ = 45°','δ = 90°','δ = 180°'],c:2,e:'sinδ = 1 (المعادلة 3-16).'},
  {q:'منطقة التشغيل المستقر للمولد:',o:['δ < 90°','δ > 90°','δ = 180°','δ < −90°'],c:0,e:'ص 109.'},
  {q:'المفاقيد النحاسية في المنتج:',o:['P<sub>F</sub>','3·I<sub>ph</sub>²·R<sub>A</sub>','P<sub>cor</sub>','3·V·I'],c:1,e:'الشكل (3-17).'},
  {q:'في مثال (3-1) د الكفاءة:',o:['93.2%','89.7%','79.8%','100%'],c:1,e:'798 ÷ 889.6 × 100 = 89.7%.'},
  {q:'العزم الداخل T<sub>in</sub> =',o:['P<sub>o</sub> × ω','P<sub>in</sub> ÷ ω','P<sub>in</sub> ÷ n','ω ÷ P<sub>in</sub>'],c:1,e:'ω = 2πn/60 بالراديان/ثانية.'},
  {q:'في مثال (3-2) د، القيمة الصحيحة للعزم 36600 ÷ 125.7 تقريباً:',o:['191.2 N·m','291.2 N·m','2912 N·m','29.1 N·m'],c:1,e:'الكتاب طبع 191.2 وهو خطأ حسابي.'}
 ]
});

/* ---------- efficiency procedures (book rounding) ---------- */
function ex31Eff(g){const Iph=B.round(g.IL/SQ3,1),Po=B.round(3*g.V*Iph*g.pf/1000,0),Pcu=B.round(3*Iph*Iph*g.RA/1000,1),Pin=B.round(Po+Pcu+g.Pc+g.PF,1),eta=B.round(Po/Pin*100,1);return [
  {t:'تيار الوجه (دلتا):',f:`I_{ph}=\\frac{${g.IL}}{\\sqrt3}`,v:Iph,dp:1,unit:'A'},
  {t:'القدرة الخارجة:',f:`P_o=3V_{ph}I_{ph}\\cos\\theta=3\\times ${g.V}\\times ${fm(Iph,1)}\\times ${g.pf}`,v:Po,dp:0,unit:'kW'},
  {t:'المفاقيد النحاسية:',f:`P_{Cu1}=3I_{Ph}^2R_A=3(${fm(Iph,1)})^2(${g.RA})`,v:Pcu,dp:1,unit:'kW'},
  {t:'القدرة الداخلة:',f:`P_{in}=P_o+P_{cu1}+P_{cor}+P_F=${fm(Po,0)}+${fm(Pcu,1)}+${g.Pc}+${g.PF}`,v:Pin,dp:1,unit:'kW'},
  {t:'الكفاءة:',f:`\\eta\\%=\\frac{P_o}{P_{in}}\\times100=\\frac{${fm(Po,0)}}{${fm(Pin,1)}}\\times100`,v:eta,dp:1,unit:'%',final:true}]}
function ex32Eff(g,isBook){const Po=B.round(3*g.V*g.I*g.pf/1000,1),Pin=B.round(Po+0+g.Pc+g.PF,1),eta=B.round(Po/Pin*100,1),w=B.round(2*PI*g.n/60,1),T=B.round(Pin*1000/w,1);
  const out=[
  {t:'جـ) القدرة الخارجة عند الحمل الكامل و 0.8 متأخر:',f:`P_o=3V_{ph}I_{ph}\\cos\\theta=3\\times ${g.V}\\times ${g.I}\\times ${g.pf}`,v:Po,dp:1,unit:'kW'}];
  if(isBook)out.push({t:'<span style="color:var(--stop)">ملاحظة: الكتاب طبع العدد 308.8 هنا (جهد الحالة المتقدمة)، والصحيح 236.8 الذي يعطي الناتج المطبوع 34.1 kW.</span>'});
  out.push({t:'المفاقيد النحاسية مهملة لإهمال مقاومة ملفات العضو الثابت، إذاً:',f:`P_{in}=${fm(Po,1)}+0+${g.Pc}+${g.PF}`,v:Pin,dp:1,unit:'kW'},
  {t:'الكفاءة:',f:`\\eta\\%=\\frac{${fm(Po,1)}}{${fm(Pin,1)}}\\times100`,v:eta,dp:1,unit:'%',final:true},
  {t:'د) السرعة الزاوية:',f:`\\omega=\\frac{2\\pi n}{60}=\\frac{2\\pi\\times ${g.n}}{60}`,v:w,dp:1,unit:'rad/s'},
  {t:'العزم الداخل:',f:`T_{in}=\\frac{P_{in}}{\\omega}=\\frac{${fm(Pin,1)}\\times10^3}{${fm(w,1)}}`});
  if(isBook)out.push({t:'كما طُبع في الكتاب (خطأ حسابي):',v:191.2,dp:1,unit:'N·m'},{t:'المصحح:',v:T,dp:1,unit:'N·m',final:true});
  else out.push({t:'العزم الداخل:',v:T,dp:1,unit:'N·m',final:true});
  return out}

/* ---------- الشكل (3-18): synchronising with lamps ---------- */
const LAMP='#ffd36b';
function lampG(x,y,b,n){b=clamp(b,0,1);return `<circle cx="${x}" cy="${y}" r="22" fill="${LAMP}" opacity="${fx(b*0.35)}"/><circle cx="${x}" cy="${y}" r="13" fill="${b>0.03?LAMP:'var(--lamp-off)'}" fill-opacity="${fx(0.25+0.75*b)}" stroke="var(--fg)" stroke-width="1.4"/><path d="M${x-7} ${y-7}L${x+7} ${y+7}M${x+7} ${y-7}L${x-7} ${y+7}" stroke="var(--fg)" stroke-width="1"/>`+laT(x,y-18,n,{fs:12})}
function fig318(o){o=o||{};const L=o.lamps||[0.2,0.8,0.8],cl=!!o.closed;const lv=o.live?'w live':'w';
  let s=`<svg viewBox="0 0 600 340" role="img" aria-label="عملية التزامن بطريقة المصابيح">`;
  [['a',30],['b',45],['c',60]].forEach(([n,y])=>{s+=`<path d="M20 ${y}H580" stroke="var(--live)" stroke-width="3"/>`+laT(14,y+4,n,{a:'end',fs:12})});
  s+=laT(300,14,'Infinite bus bar',{fs:11,cls:'m'})+arT(470,14,'القضيب اللانهائي',{fs:12});
  // bus-side PT and low-voltage lines a b c
  [[150,30],[165,45],[180,60]].forEach(([x,y])=>{s+=`<path d="M${x} ${y}V90" stroke="var(--live)" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="2.5" fill="var(--fg)"/>`});
  s+=`<rect x="135" y="90" width="60" height="34" rx="5" fill="var(--surface-2)" stroke="var(--fg)"/>`+arT(165,111,'محول جهد',{fs:11});
  [[150,'a'],[165,'b'],[180,'c']].forEach(([x,n])=>{s+=`<path class="${lv}" d="M${x} 124V262"/>`+laT(x,276,n,{fs:11})});
  // breaker + generator
  const bx=[470,490,510],by=[30,45,60];
  bx.forEach((x,i)=>{s+=`<path d="M${x} ${by[i]}V86" stroke="var(--live)" stroke-width="2"/><circle cx="${x}" cy="${by[i]}" r="2.5" fill="var(--fg)"/>`;s+=cl?`<path d="M${x} 86V118" stroke="var(--fg)" stroke-width="2.6"/>`:`<path d="M${x} 118L${x-12} 90" stroke="var(--fg)" stroke-width="2.6"/>`;
    s+=`<circle cx="${x}" cy="86" r="2.5" fill="var(--fg)"/><circle cx="${x}" cy="118" r="2.5" fill="var(--fg)"/><path class="${lv}" d="M${x} 118V${226+Math.abs(x-490)/3}"/>`});
  s+=`<path d="M462 80H518" stroke="var(--muted)" stroke-dasharray="3 3"/>`+arT(560,102,'القاطع',{fs:12})+arT(560,118,'الرئيسي',{fs:12});
  s+=`<circle cx="490" cy="262" r="30" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+laT(490,267,'G',{fs:16})+arT(490,312,'المولد التزامني',{fs:12});
  ['a\'','b\'','c\''].forEach((n,i)=>s+=laT(bx[i]+(i===2?12:i===0?-10:4),210,n,{fs:11}));
  // generator-side PT and lines a' b' c'
  s+=`<rect x="395" y="140" width="56" height="34" rx="5" fill="var(--surface-2)" stroke="var(--fg)"/>`+arT(423,161,'محول جهد',{fs:11})+`<path class="${lv}" d="M451 157H470"/>`;
  [[360,"a'"],[375,"b'"],[390,"c'"]].forEach(([x,n],i)=>{s+=`<path class="${lv}" d="M${x} 262V${150+i*8}H395"/>`+laT(x,276,n,{fs:11})});
  // lamps 1: a–a', 2: b–c', 3: c–b'
  const rows=[[160,150,360,'1'],[200,165,390,'2'],[240,180,375,'3']];
  rows.forEach(([y,xl,xr,n],i)=>{s+=`<path class="${lv}" d="M${xl} ${y}H257M283 ${y}H${xr}"/><circle cx="${xl}" cy="${y}" r="2.6" fill="var(--fg)"/><circle cx="${xr}" cy="${y}" r="2.6" fill="var(--fg)"/>`+lampG(270,y,L[i],n)});
  s+=`<path class="${lv}" d="M150 300H255M285 300H360V262M150 262V300"/><circle cx="270" cy="300" r="13" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`+laT(270,304,'V',{fs:12})+laT(270,326,'Vs'+(o.Vs!=null?' = '+fm(o.Vs,1)+' V':''),{fs:12,col:'--blue'});
  s+=laT(20,90,'Vb'+(o.Vb!=null?' = '+fm(o.Vb,1)+' V':''),{a:'start',fs:12,col:'--blue'})+laT(20,108,'Fb'+(o.Fb!=null?' = '+fm(o.Fb,2)+' Hz':''),{a:'start',fs:12,col:'--blue'});
  s+=laT(452,300,'Vm'+(o.Vm!=null?' = '+fm(o.Vm,1)+' V':''),{a:'end',fs:12,col:'--blue'})+laT(452,318,'Fm'+(o.Fm!=null?' = '+fm(o.Fm,2)+' Hz':''),{a:'end',fs:12,col:'--blue'});
  return s+'</svg>'}
/* ---------- الشكل (3-19) الأول: synchroscope ---------- */
function syncSVG(a){const cx=110,cy=104,R=78;let s=`<svg viewBox="0 0 220 220" role="img" aria-label="جهاز التزامن">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R+12}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--surface)" stroke="var(--line)"/>`;
  for(let i=0;i<12;i++){const p1=P2(cx,cy,R,i*30),p2=P2(cx,cy,R-(i===0?16:8),i*30);s+=`<path d="M${fx(p1[0])} ${fx(p1[1])}L${fx(p2[0])} ${fx(p2[1])}" stroke="var(${i===0?'--on':'--fg'})" stroke-width="${i===0?4:1.6}"/>`}
  s+=`<path d="M${cx-40} ${cy+30}A50 50 0 0 1 ${cx-50} ${cy-10}" fill="none" stroke="var(--muted)" stroke-width="1.6"/>`+arrow(cx-48,cy-2,cx-49,cy-14,'--muted',1.6)+laT(cx-44,cy+50,'Slow',{fs:12});
  s+=`<path d="M${cx+40} ${cy+30}A50 50 0 0 0 ${cx+50} ${cy-10}" fill="none" stroke="var(--muted)" stroke-width="1.6"/>`+arrow(cx+48,cy-2,cx+49,cy-14,'--muted',1.6)+laT(cx+44,cy+50,'Fast',{fs:12});
  const p=P2(cx,cy,R-6,a);s+=`<path d="M${cx} ${cy}L${fx(p[0])} ${fx(p[1])}" stroke="var(--stop)" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="9" fill="var(--fg)"/>`;
  s+=laT(cx,212,'Synchroscope',{fs:13});
  return s+'</svg>'}

/* ============================== Lesson 3.6 ============================== */
const EXTRA_THEORY=[
  {h:'<span class="sg-tag">إضافة من خارج الكتاب</span> المولد بعد ربطه بالقضيب اللانهائي',ref:'تكملة لأسئلة ص 122',html:`<div class="sg-extra"><p><b>هذا القسم كله ليس من الكتاب.</b> أُضيف لأن أسئلة الفصل الثاني (5 و6 و7، ص 122) تسأل عنه والكتاب لا يشرحه. يُبنى على معادلة الكتاب (3-15) والشكل (3-16) فقط.</p>
   <ol><li><b>السرعة والتردد:</b> بعد إغلاق القاطع يفرض القضيب اللانهائي تردده على المولد، فيبقى المولد دائراً بالسرعة التزامنية \\(n=120f/p\\) <b>مهما تغير عزم المحرك الأولي</b>. أي لا يمكن التحكم في سرعة المولد بعد الربط.</li>
   <li><b>زيادة عزم المحرك الأولي</b> (وقود أكثر للتوربينة) لا تزيد السرعة، بل تزيد زاوية القدرة \\(\\delta\\)، فتزيد القدرة الفعالة التي يدفعها المولد إلى القضيب حسب \\(P_o=3VE\\sin\\delta/X_S\\) (3-15).</li>
   <li><b>اتجاه انتقال القدرة:</b> إذا كانت قدرة المحرك الأولي أكبر من المفاقيد كانت \\(\\delta\\) موجبة وانتقلت القدرة من المولد إلى القضيب (منطقة المولد في الشكل 3-16). وإذا قلّت عن المفاقيد صارت \\(\\delta\\) سالبة وأخذت الآلة قدرة من القضيب فعملت كمحرك (منطقة المحرك).</li>
   <li><b>تغيير تيار المجال</b> يغير \\(E_{ph}\\) ولا يغير القدرة الفعالة (ما دام عزم المحرك الأولي ثابتاً)، بل يغير <b>القدرة غير الفعالة</b> ومعامل القدرة: مع زيادة المجال (\\(E\\cos\\delta\\gt V\\)) يعطي المولد قدرة غير فعالة للقضيب ويكون تياره متأخراً؛ ومع إنقاصه (\\(E\\cos\\delta\\lt V\\)) يأخذ قدرة غير فعالة ويكون تياره متقدماً. جهد القضيب لا يتغير.</li>
   <li><b>فقد التزامن:</b> إذا طُلب من المولد قدرة أكبر من \\(P_{max}=3VE/X_S\\) (3-16)، بزيادة العزم كثيراً أو بإضعاف المجال كثيراً، تتجاوز \\(\\delta\\) الزاوية 90° فيدخل منطقة التشغيل غير المستقر ويفقد التزامن.</li></ol>
   <p>جرّب ذلك في المختبر بعد أن تنجح في إغلاق القاطع (وضع «بعد الربط»).</p></div>`}
];
B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'110–113',
 title:'التشغيل على التوازي والتزامن مع القضيب اللانهائي',
 summary:'لماذا تربط المولدات على التوازي، وشروط الربط الأربعة وأخطار مخالفتها، ثم طريقة المصابيح (مصباح بين a و\'a ومصباحان متقاطعان) وجهاز التزامن: نغلق القاطع عندما ينطفئ المصباح الأول ويقف المؤشر عند الساعة 12.',
 stations:[
  {intro:true},

  {st:1,short:'لماذا التوازي؟',title:'تشغيل المولدات التزامنية على التوازي',ref:'ص 110',
   q:'محطة كهرباء فيها عدة مولدات بدل مولد واحد ضخم… ما الذي نكسبه من ذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة مولدات مربوطة على التوازي بقضبان مشتركة تغذي عدة أحمال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="القضبان المشتركة: كل المولدات تصب فيها وكل الأحمال تأخذ منها."><rect x="40" y="146" width="280" height="12" rx="4" fill="#2C4A40"/></g>
<g data-tip="مولد تزامني مربوط على التوازي مع غيره. إذا تعطل أو أُوقف للصيانة تقاسمت المولدات الأخرى حصته."><circle cx="90" cy="76" r="26" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="90" y="82" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text><path d="M90 102V146" stroke="#2C4A40" stroke-width="3"/></g>
<g data-tip="مولد تزامني مربوط على التوازي مع غيره. إذا تعطل أو أُوقف للصيانة تقاسمت المولدات الأخرى حصته."><circle cx="180" cy="76" r="26" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="82" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text><path d="M180 102V146" stroke="#2C4A40" stroke-width="3"/></g>
<g data-tip="مولد تزامني مربوط على التوازي مع غيره. إذا تعطل أو أُوقف للصيانة تقاسمت المولدات الأخرى حصته."><circle cx="270" cy="76" r="26" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="270" y="82" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text><path d="M270 102V146" stroke="#2C4A40" stroke-width="3"/></g>
<g data-tip="الأحمال: تأخذ من القضبان المشتركة ما تحتاجه من القدرة، وقد تكون أكبر من قدرة مولد واحد."><path d="M110 158V196M180 158V196M250 158V196" stroke="#2C4A40" stroke-width="3"/><path d="M92 226V206L110 192L128 206V226Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M162 226V206L180 192L198 206V226Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M232 226V206L250 192L268 206V226Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g>
<text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الأحمال</text>
<text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">عدة مولدات تتقاسم الحمل</text></svg>`,
   cap:'الدوائر = مولدات، والشريط الداكن = القضبان المشتركة، والبيوت = الأحمال.<br><b>مرّر المؤشر على المولدات والقضبان والأحمال (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>من النادر جداً أن يوجد مولد وحيد يغذي حملاً مستقلاً ماعدا حالات خاصة كالمولدات المعدة لأعمال الطوارئ، وفي كثير من التطبيقات يوجد أكثر من مولد مربوطة على التوازي لإمداد الأحمال بالقدرة المطلوبة، وأقرب مثال على ذلك نجده في أي منطقة من مناطق المملكة حيث يوجد العشرات من المولدات التزامنية في أماكن مختلفة مربوطة مع بعضها البعض على التوازي لتغذية تلك المنطقة بما تحتاجه من القدرة الكهربائية.</p>`,ref:'ص 110'}
   ],
   body:[
    {book:String.raw`<p><b>مميزات التشغيل على التوازي:</b></p><ol><li>المولدات المربوطة على التوازي تستطيع أن تغذي أحمال أكبر من الحمل الذي يغذيه مولد واحد.</li><li>وجود عدة مولدات مربوطة على التوازي يزيد موثوقية النظام، لأنه في حالة تعطل أي مولد فإن المولدات الأخرى تتقاسم حصة ذلك المولد.</li><li>وجود عدة مولدات مربوطة على التوازي يسمح بإجراء أعمال الصيانة لمولد أو أكثر دون قطع القدرة عن الأحمال.</li><li>وجود عدة مولدات صغيرة مربوطة على التوازي أكبر كفاءة من مولد وحيد مكافئ لها خصوصاً عندما تكون الأحمال صغيرة.</li></ol>`,ref:'ص 110'},
    {predict:{q:'محطة فيها أربعة مولدات على التوازي، ونريد صيانة أحدها. ماذا يحدث للأحمال؟',opts:[
     ['تنقطع الكهرباء عنها حتى تنتهي الصيانة',false,'هذا يحدث مع مولد وحيد، لا مع مولدات على التوازي.'],
     ['تبقى الكهرباء، وتتقاسم المولدات الثلاثة الأخرى حصته',true,'من مميزات التوازي في الكتاب (الميزتان 2 و3): الموثوقية والصيانة دون قطع القدرة.'],
     ['تبقى الكهرباء لكن بتردد أقل',false,'المولدات المربوطة على التوازي تعمل كلها بالتردد نفسه.']]}},
    {tip:String.raw`<p>لماذا تكون عدة مولدات صغيرة أكفأ «خصوصاً عندما تكون الأحمال صغيرة»؟ لأننا نستطيع أن نشغّل منها العدد الذي يكفي الحمل فقط، فيعمل كل مولد قريباً من حمله الكامل. أما المولد الكبير الوحيد فيعمل جزءاً صغيراً من طاقته عندما يقل الحمل.</p>`,title:'الميزة الرابعة'}
   ]},

  {st:2,short:'شروط الربط',title:'شروط الربط على التوازي',ref:'ص 110–111',
   q:'نريد أن نوصل مولداً جديداً بمولد يعمل… ما الذي يجب أن يتطابق بين الاثنين قبل أن نغلق القاطع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لشروط الربط: تساوي الجهد، وتساوي التردد، ونفس تتابع الأطوار، والجهود في نفس الطور" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<g data-tip="الشرط 1: القيمة الفعالة ⟦(rms)⟧ لجهد الأطراف في المولدين متساوية — عمودان متساويان."><rect x="190" y="40" width="130" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="302" cy="58" r="11" fill="#2C4A40"/><text x="302" y="63" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">1</text><rect x="222" y="74" width="22" height="50" fill="#E8735A"/><rect x="262" y="74" width="22" height="50" fill="#4FB3A9"/><text x="255" y="144" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">الجهد نفسه</text></g>
<g data-tip="الشرط 2: التردد متساوٍ في المولدين — الموجتان بالطول نفسه."><rect x="40" y="40" width="130" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="152" cy="58" r="11" fill="#2C4A40"/><text x="152" y="63" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">2</text><path d="M54 96 C66 70 78 70 90 96 S114 122 126 96 S150 70 158 90" fill="none" stroke="#E8735A" stroke-width="3"/><path d="M54 104 C66 78 78 78 90 104 S114 130 126 104 S150 78 158 98" fill="none" stroke="#2E8C83" stroke-width="3"/><text x="105" y="144" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">التردد نفسه</text></g>
<g data-tip="الشرط 3: نفس تتابع الأطوار في المولدين، إما ⟦ABC⟧ أو ⟦ACB⟧."><rect x="190" y="166" width="130" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="302" cy="184" r="11" fill="#2C4A40"/><text x="302" y="189" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">3</text><text x="255" y="222" text-anchor="middle" font-size="19" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A→B→C</text><text x="255" y="270" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">التتابع نفسه</text></g>
<g data-tip="الشرط 4: الجهود في نفس الطور (زاوية الطور للوجه ⟦a⟧ متساوية للمولدين) — الموجتان منطبقتان."><rect x="40" y="166" width="130" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="152" cy="184" r="11" fill="#2C4A40"/><text x="152" y="189" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">4</text><path d="M54 222 C66 196 78 196 90 222 S114 248 126 222 S150 196 158 216" fill="none" stroke="#E8735A" stroke-width="5"/><path d="M54 222 C66 196 78 196 90 222 S114 248 126 222 S150 196 158 216" fill="none" stroke="#2E8C83" stroke-width="2" stroke-dasharray="5 4"/><text x="105" y="270" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">الطور نفسه</text></g></svg>`,
   cap:'البرتقالي = المولد الأول، والفيروزي = المولد الثاني. يجب أن تتحقق الشروط الأربعة معاً لحظة الإغلاق.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتقرأ الشرط.</b>',
   side:[
    {book:String.raw`<p><b>شروط الربط على التوازي:</b></p><ol><li>القيمة الفعالة (<span class="ltr">rms value</span>) لجهد الأطراف في كلا المولدين يجب أن تتساوى.</li><li>التردد يجب أن يكون متساوياً في كلا المولدين.</li><li>نفس تتابع الأطوار لكلا المولدين إما <span class="ltr">ABC</span> أو <span class="ltr">ACB</span>.</li><li>يجب أن تكون الجهود في نفس الطور (زاوية الطور للوجه a متساوية لكلا المولدين).</li></ol>`,ref:'ص 110'}
   ],
   body:[
    {book:String.raw`<p>عند تحقق هذه الشروط يمكن توصيل المولدين على التوازي بأمان، أما عند توصيل المولدين مع عدم تحقق شرط أو أكثر من هذه الشروط فإن ذلك يؤدي إلى حدوث أضرار كبيرة مثل <b>إتلاف ملفات المولد بسبب مرور تيار كبير فيها أو إلى كسر عمود الدوران بسبب تحوله إلى محرك يدور باتجاه معاكس لدوران التوربينة</b>.</p>`,ref:'ص 111'},
    {predict:{q:'أغلق فنيٌّ القاطع والجهدان غير متطابقين في الطور. ما الخطر الذي يذكره الكتاب؟',opts:[
     ['ينخفض التردد قليلاً ثم يعود',false,'الكتاب يتحدث عن أضرار كبيرة، لا عن تغير بسيط.'],
     ['تتلف ملفات المولد بسبب تيار كبير، أو ينكسر عمود الدوران',true,'هذه الأضرار التي يذكرها الكتاب ص 111 عند عدم تحقق شرط أو أكثر.'],
     ['لا شيء، فالمولد يضبط نفسه',false,'لهذا السبب بالذات نُجري عملية التزامن قبل الإغلاق.']]}},
    {tip:String.raw`<p>عند لحظة الإغلاق يتصل كل وجه في المولد بنظيره في الشبكة مباشرة. إذا اختلف الجهدان في المقدار أو الطور فإن الفرق بينهما يقع على ممانعة صغيرة جداً (الملفات)، فيمر تيار هائل. لهذا نريد أن يكون الفرق بين الطرفين المتماثلين صفراً تماماً لحظة الإغلاق: \(V_S=0\).</p>`,title:'لماذا يمر تيار كبير؟'}
   ]},

  {st:3,short:'القضبان اللانهائية',title:'توصيل المولدات التزامنية إلى قضبان لا نهائية',ref:'ص 111',
   q:'مولد واحد أمام شبكة فيها عشرات المولدات… هل يستطيع أن يغيّر جهدها أو ترددها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد صغير يتصل عبر القاطع الرئيسي بقضبان كبيرة تمثل شبكة من مولدات كثيرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="القضبان اللانهائية ⟦Infinite bus bars⟧: شبكة كبيرة جداً تعتبر كأنها مولد ذو قدرة غير محدودة."><rect x="40" y="70" width="280" height="44" rx="10" fill="#2C4A40"/><text x="180" y="98" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">القضيب اللانهائي</text>
<g opacity=".45"><circle cx="70" cy="40" r="14" fill="#4FB3A9"/><circle cx="110" cy="40" r="14" fill="#4FB3A9"/><circle cx="150" cy="40" r="14" fill="#4FB3A9"/><circle cx="190" cy="40" r="14" fill="#4FB3A9"/><circle cx="230" cy="40" r="14" fill="#4FB3A9"/><circle cx="270" cy="40" r="14" fill="#4FB3A9"/><path d="M70 54V70M110 54V70M150 54V70M190 54V70M230 54V70M270 54V70" stroke="#2C4A40" stroke-width="2"/></g></g>
<g data-tip="القاطع الرئيسي: لا يُغلق إلا بعد التأكد من تحقق شروط الربط الأربعة (عملية التزامن)."><path d="M180 114V146" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="148" r="4" fill="#2C4A40"/><path d="M180 184L162 152" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><circle cx="180" cy="186" r="4" fill="#2C4A40"/><rect x="150" y="140" width="50" height="52" fill="transparent"/><text x="232" y="172" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">القاطع</text></g>
<g data-tip="المولد التزامني الذي نريد ربطه: قدرته صغيرة جداً بالنسبة للشبكة."><path d="M180 186V214" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="236" r="22" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="242" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text></g>
<text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مولد صغير أمام شبكة كبيرة جداً</text></svg>`,
   cap:'الدوائر الباهتة فوق القضبان = مولدات الشبكة الكثيرة، والدائرة السفلى = المولد الذي نريد ربطه.<br><b>مرّر المؤشر على القضبان والقاطع والمولد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>إن عملية توصيل المولد التزامني إلى قضبان لا نهائية <span class="ltr">Infinite bus bars</span> تعتبر عملية مشابهة لتوصيل المولد التزامني على التوازي مع مولد آخر كبير جداً، وذلك لأن القضبان اللانهائية تعتبر كأنها <b>مولد ذو قدرة غير محدودة</b>. ولإتمام هذه العملية يجب أن تتحقق الشروط السابقة قبل عملية التوصيل، وللتأكد من تحقق تلك الشروط تجرى عملية التزامن باستخدام عدة طرق نذكر منها طريقتين:</p>`,ref:'ص 111'}
   ],
   body:[
    {predict:{q:'لماذا يُعامَل القضيب اللانهائي كأنه «مولد ذو قدرة غير محدودة»؟',opts:[
     ['لأنه لا يحتاج محركاً أولياً',false,'وراء الشبكة مولدات كثيرة لكل منها محركه الأولي.'],
     ['لأن الشبكة كبيرة جداً بالنسبة للمولد الواحد، فلا يستطيع تغيير جهدها أو ترددها',true,'هذا معنى «لا نهائي» هنا: المولد الذي نربطه صغير جداً بالنسبة لمجموع مولدات الشبكة.'],
     ['لأن قضبانه مصنوعة من موصلات بلا مقاومة',false,'التسمية تخص حجم الشبكة، لا مادة القضبان.']]}},
    {tip:String.raw`<p>القضيب اللانهائي في الواقع هو الشبكة العامة نفسها (مثل شبكة المنطقة التي يذكرها الكتاب في المحطة الأولى). عندما نربط به مولداً، نحن الذين نضبط المولد ليطابق الشبكة، لا العكس. الطريقتان اللتان يشرحهما الكتاب للتأكد من الشروط: <b>المصابيح</b> و<b>جهاز التزامن</b> (المحطات التالية).</p>`}
   ]},

  {st:4,short:'طريقة المصابيح',title:'طريقة المصابيح المضيئة',ref:'ص 111–112',
   q:'ثلاثة مصابيح عادية بين المولد والشبكة… كيف تخبرنا بالتردد والطور وتتابع الأطوار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة خطوط للقضبان وثلاثة للمولد، والمصباح الأول بين a و a شرطة، والثاني بين b و c شرطة، والثالث بين c و b شرطة، والمصباح الأول منطفئ والآخران مضاءان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/>
<text x="62" y="40" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">القضيب</text><text x="298" y="40" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">المولد</text>
<g data-tip="خطوط القضبان اللانهائية ⟦a⟧ و⟦b⟧ و⟦c⟧ (بعد محول الجهد)."><path d="M44 60V250M64 60V250M84 60V250" stroke="#2C4A40" stroke-width="3"/><text x="44" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">a</text><text x="64" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">b</text><text x="84" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">c</text></g>
<g data-tip="خطوط المولد ⟦a'⟧ و⟦b'⟧ و⟦c'⟧ (بعد محول الجهد)."><path d="M276 60V250M296 60V250M316 60V250" stroke="#2C4A40" stroke-width="3"/><text x="276" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">a'</text><text x="296" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">b'</text><text x="316" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">c'</text></g>
<g data-tip="المصباح 1 بين ⟦a⟧ و⟦a'⟧ (وجهان متماثلان): ينطفئ عندما يكون فرق الجهد بينهما صفراً ⟦VS = 0⟧."><path d="M44 90H164M196 90H276" stroke="#2C4A40" stroke-width="2"/><circle cx="44" cy="90" r="4" fill="#2C4A40"/><circle cx="276" cy="90" r="4" fill="#2C4A40"/><circle cx="180" cy="90" r="16" fill="#CFC6B4" stroke="#2C4A40" stroke-width="2.5"/><path d="M169 79L191 101M191 79L169 101" stroke="#2C4A40" stroke-width="1.5"/><text x="180" y="66" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">1</text></g>
<g data-tip="المصباح 2 بين ⟦b⟧ و⟦c'⟧ (موصل متقاطعاً): مضاء لحظة التزامن."><path d="M64 140H164M196 140H316" stroke="#2C4A40" stroke-width="2"/><circle cx="64" cy="140" r="4" fill="#2C4A40"/><circle cx="316" cy="140" r="4" fill="#2C4A40"/><circle cx="180" cy="140" r="24" fill="#F2C14E" opacity=".45"/><circle cx="180" cy="140" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M169 129L191 151M191 129L169 151" stroke="#2C4A40" stroke-width="1.5"/><text x="210" y="128" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">2</text></g>
<g data-tip="المصباح 3 بين ⟦c⟧ و⟦b'⟧ (موصل متقاطعاً): مضاء لحظة التزامن."><path d="M84 190H164M196 190H296" stroke="#2C4A40" stroke-width="2"/><circle cx="84" cy="190" r="4" fill="#2C4A40"/><circle cx="296" cy="190" r="4" fill="#2C4A40"/><circle cx="180" cy="190" r="24" fill="#F2C14E" opacity=".45"/><circle cx="180" cy="190" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M169 179L191 201M191 179L169 201" stroke="#2C4A40" stroke-width="1.5"/><text x="210" y="178" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">3</text></g>
<g data-tip="الفولتميتر ⟦VS⟧ بين الوجهين ⟦a⟧ و⟦a'⟧: قراءته صفر تعني تحقق الشرط الرابع."><path d="M44 236H164M196 236H276" stroke="#2C4A40" stroke-width="2"/><circle cx="44" cy="236" r="4" fill="#2C4A40"/><circle cx="276" cy="236" r="4" fill="#2C4A40"/><circle cx="180" cy="236" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="242" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="9" dy="3">S</tspan></text></g>
<text x="180" y="300" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">لحظة التزامن: الأول منطفئ والآخران مضاءان</text></svg>`,
   cap:'رسم مبسّط للجزء الأوسط من الشكل <span class="ltr">(3-18)</span> (بلا محولي الجهد والقاطع وأجهزة <span class="ltr">V<sub>m</sub></span> و<span class="ltr">V<sub>b</sub></span> والتردد). المصباح الرمادي منطفئ، والأصفر مضاء.<br><b>مرّر المؤشر على المصابيح والخطوط والفولتميتر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>في هذه الطريقة توصل ثلاث لمبات بين الآلة والقضبان اللانهائية كما في الشكل (3-18) بحيث <b>توصل الأولى بين الخطين a و a'، والثانية بين الخطين b و c'، والثالثة بين الخطين c و b'</b>. كما يوصل ثلاثة أجهزة فولتميتر: \(V_S\) بين الوجهين a و a'، و\(V_m\) لقياس جهد المولد، و\(V_b\) لقياس جهد القضبان اللانهائية، كذلك يتم توصيل جهازين لقياس تردد المولد والقضبان اللانهائية كما في الشكل (3-18).</p>`,ref:'ص 111–112'}
   ],
   body:[
    {book:String.raw`<p>وبهذه الطريقة يمكن التأكد من تحقق شروط التزامن الأربعة كما يلي:</p>
     <ol><li>لكي يتحقق الشرط الأول يجب أن تتساوى قراءة أجهزة قياس الجهد \((V_m=V_b)\).</li><li>لكي يتحقق الشرط الثاني يجب أن تتساوى قراءة أجهزة قياس التردد \((F_m=F_b)\).</li><li>الشرط الثالث يتحقق عندما يكون انطفاء واشتعال المصابيح بشكل منتظم.</li><li>الشرط الرابع يتحقق عندما يكون فرق الجهد بين وجهين متماثلين في الآلة والقضيب مساوياً للصفر \((V_S=0)\).</li></ol>`,ref:'ص 112'},
    {predict:{q:'أيّ شرط من شروط الربط نتأكد منه بأن يكون انطفاء المصابيح واشتعالها منتظماً؟',opts:[
     ['تساوي الجهدين',false,String.raw`الجهدان نتأكد منهما بالفولتميترين \(V_m=V_b\).`],
     ['تتابع الأطوار',true,'الشرط الثالث في الكتاب (ص 112): الانتظام يعني أن تتابع الأطوار متماثل.'],
     ['تساوي الترددين',false,String.raw`الترددان نتأكد منهما بجهازي التردد \(F_m=F_b\)، ويظهر الفرق بينهما في سرعة تتابع الإضاءة.`]]}},
    {watch:String.raw`<p>عنوان الطريقة في الكتاب «طريقة المصابيح المضيئة»، لكن التوصيلة الموصوفة (مصباح بين a و'a ومصباحان متقاطعان، وشرط الإغلاق: الأول منطفئ والآخران مضاءان) تُعرف أيضاً بطريقة <b>المصابيح الدوارة</b>. والكتاب لا يذكر طريقتي «المصابيح المطفأة» و«المصابيح المضيئة» منفصلتين.</p>`,fix:true}
   ]},

  {st:5,short:'خطوات التزامن',title:'خطوات عملية التزامن',ref:'ص 112–113',
   q:'المصابيح تومض أمامك… متى بالضبط تضغط زر الإغلاق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع خطوات مرقمة لعملية التزامن: الجهد ثم التردد ثم تتابع الأطوار ثم لحظة الإغلاق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الخطوة 1: نرفع جهد أطراف المولد حتى يساوي جهد القضيب ⟦Vm = Vb⟧ بزيادة تيار المجال تدريجياً."><rect x="60" y="30" width="240" height="46" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="53" r="13" fill="#E8735A"/><text x="278" y="58" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">1</text><text x="160" y="59" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">الجهد: تيار المجال</text></g>
<g data-tip="الخطوة 2: نضبط تردد المولد قريباً من تردد القضيب بزيادة سرعة الدوران."><rect x="60" y="92" width="240" height="46" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="115" r="13" fill="#F2C14E"/><text x="278" y="120" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">2</text><text x="160" y="121" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">التردد: سرعة الدوران</text></g>
<g data-tip="الخطوة 3: إذا أضاءت المصابيح وانطفأت بشكل عشوائي فتتابع الأطوار مختلف: نبادل بين أي طرفين من أطراف المولد. وإذا كانت منتظمة متتابعة فالتتابع متماثل."><rect x="60" y="154" width="240" height="46" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="177" r="13" fill="#4FB3A9"/><text x="278" y="182" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">3</text><text x="160" y="183" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">التتابع: انتظام المصابيح</text></g>
<g data-tip="الخطوة 4: نجعل تتابع الإضاءة بطيئاً قدر الإمكان، وفي لحظة ⟦VS = 0⟧ (المصباح الأول منطفئ والآخران مضاءان) نغلق القاطع الرئيسي."><rect x="60" y="216" width="240" height="46" rx="12" fill="#12855A" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="239" r="13" fill="#FBF6EE"/><text x="278" y="244" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700">4</text><text x="160" y="245" text-anchor="middle" font-size="13.5" fill="#FBF6EE" font-weight="700">اللحظة: أغلق القاطع</text></g>
<text x="180" y="292" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">بالترتيب… ثم الإغلاق في اللحظة المناسبة</text></svg>`,
   cap:'الخطوات الأربع في الكتاب، والخطوة الأخيرة (الخضراء) هي الإغلاق.<br><b>مرّر المؤشر على كل خطوة (أو المسها في الجوال) لتقرأها كاملة.</b>',
   side:[
    {book:String.raw`<p><b>أما عملية التزامن فيتم إجراؤها كما يلي:</b></p>
     <ol><li>يرفع جهد أطراف المولد حتى يصبح مساوياً لجهد القضيب \((V_m=V_b)\) وذلك بزيادة تيار المجال تدريجياً.</li><li>يضبط تردد المولد بحيث يكون قريباً من تردد القضيب وذلك بزيادة سرعة الدوران.</li></ol>`,ref:'ص 112'}
   ],
   body:[
    {book:String.raw`<ol start="3"><li>عند محاولة ضبط سرعة الدوران يحدث إحدى حالتين بالنسبة للمصابيح:
      <ul><li><b>الحالة الأولى:</b> جميع المصابيح تضيء وتنطفئ بشكل عشوائي، وهذا يعني أن شرط تتابع الأطوار للمولد والقضبان مختلف، وعندها يجب المبادلة بين أي طرفين من أطراف المولد من أجل عكس تتابع أطوار المولد، وبعدها نلاحظ أن إضاءة المصابيح أصبحت بشكل منتظم ومتتابع.</li>
      <li><b>الحالة الثانية:</b> جميع المصابيح تضاء وتنطفئ بشكل منتظم ومتتابع، وهذا يعني أن تتابع الأطوار للمولد والقضيب اللانهائي متماثل.</li></ul></li>
     <li>إذا تحققت الحالة الثانية يبقى ضبط التردد وذلك عن طريق التحكم في السرعة التزامنية للآلة، ويتضح ذلك في سرعة تتابع الإضاءة؛ فإذا زادت سرعة تتابع إضاءة المصابيح يلزم زيادة أو تقليل سرعة المولد بحيث يكون تتابع إضاءة المصابيح بطيئاً قدر الإمكان، وفي اللحظة التي يكون فيها \((V_S=0)\) <b>أو المصباح الأول منطفئاً بينما الثاني والثالث مضاءان</b> يكون الشرط الرابع قد تحقق، في هذه اللحظة تكون الآلة في لحظة تزامن مع القضيب اللانهائي وعندها يمكن إغلاق القاطع الرئيسي بأمان.</li></ol>`,ref:'ص 112–113'},
    {watch:String.raw`<p>الخطوة 4 في الكتاب تقول «إذا تحققت <b>الحالة الثالثة</b>»، ولا توجد حالة ثالثة؛ المقصود الحالة الثانية (التتابع المنتظم)، وكتبناها هنا «الثانية».</p>`,fix:true},
    {title:'شاهد الحالتين على المصابيح الثلاثة',widget:(el,B)=>{
      let mode='ok',t=0,raf=0;
      el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">تتابع الأطوار</span><span class="mseg"><button type="button" data-m="bad">مختلف (الحالة الأولى)</button><button type="button" data-m="ok">متماثل (الحالة الثانية)</button></span></div>
       <div data-o="svg" style="max-width:360px;margin:8px auto 0"></div>
       <p data-o="msg" style="margin:6px 0 0;min-height:3em"></p>
       <p class="sub" style="margin:4px 0 0">الحركة مبطّأة للتوضيح.</p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      const lamp=(x,b,n)=>`<circle cx="${x}" cy="60" r="${(26).toFixed(0)}" fill="#F2C14E" opacity="${(b*0.45).toFixed(2)}"/><circle cx="${x}" cy="60" r="18" fill="${b>0.05?'#F2C14E':'#CFC6B4'}" fill-opacity="${(0.25+0.75*b).toFixed(2)}" stroke="#2C4A40" stroke-width="2.5"/><text x="${x}" y="108" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">${n}</text>`;
      const msg={bad:'الحالة الأولى: المصابيح الثلاثة تضيء وتنطفئ <b>معاً</b> بلا تتابع — تتابع الأطوار مختلف. الحل: بادل بين أي طرفين من أطراف المولد.',
                 ok:'الحالة الثانية: الإضاءة «تدور» على المصابيح بانتظام — التتابع متماثل. انتظر اللحظة التي ينطفئ فيها المصباح 1 ويضيء 2 و3.'};
      const frame=()=>{if(!document.body.contains(el)){cancelAnimationFrame(raf);return}
        t+=0.012;const ph=t*2*Math.PI;let b;
        if(mode==='bad'){const v=Math.abs(Math.sin(ph/2));b=[v,v,v]}
        else b=[Math.abs(Math.sin(ph/2)),Math.abs(Math.sin(ph/2+Math.PI/3)),Math.abs(Math.sin(ph/2-Math.PI/3))];
        o('svg').innerHTML=`<svg viewBox="0 0 360 120" role="img" aria-label="ثلاثة مصابيح" style="width:100%;height:auto;font-family:var(--font)">${lamp(80,b[0],'1')}${lamp(180,b[1],'2')}${lamp(280,b[2],'3')}</svg>`;
        raf=requestAnimationFrame(frame)};
      const set=m=>{mode=m;o('msg').innerHTML=msg[m];el.querySelectorAll('.mseg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===m))};
      el.querySelectorAll('.mseg button').forEach(x=>x.onclick=()=>set(x.dataset.m));
      set('bad');frame();
    }},
    {predict:{q:'المصابيح «تدور» بانتظام لكن بسرعة كبيرة. ماذا يعني ذلك، وماذا تفعل؟',opts:[
     ['تتابع الأطوار مختلف، فأبدّل طرفين',false,'الدوران المنتظم يعني أن التتابع متماثل (الحالة الثانية).'],
     ['الفرق بين الترددين كبير، فأغيّر سرعة المولد حتى يبطؤ التتابع',true,'الكتاب: «إذا زادت سرعة تتابع إضاءة المصابيح يلزم زيادة أو تقليل سرعة المولد بحيث يكون تتابع إضاءة المصابيح بطيئاً قدر الإمكان».'],
     ['التزامن تحقق، فأغلق القاطع فوراً',false,String.raw`لا نغلق إلا في لحظة \(V_S=0\) والتتابع بطيء، وإلا لم تتحقق الشروط.`]]}},
    {tip:String.raw`<p>عندما يكون تتابع الأطوار مختلفاً تضيء المصابيح الثلاثة وتنطفئ <b>معاً</b> بدل أن تتتابع واحداً بعد الآخر؛ هذا هو المقصود بعبارة الكتاب «بشكل عشوائي» (أي غير متتابع)، وهكذا تظهر في التجربة أعلاه وفي المختبر. وعندما يكون التتابع صحيحاً «تدور» الإضاءة على المصابيح الثلاثة، وكلما اقترب التردد من تردد القضيب صار الدوران أبطأ.</p>`,title:'ما معنى «عشوائي»؟'}
   ]},

  {st:6,short:'جهاز التزامن',title:'باستخدام جهاز التزامن <span class="ltr">(Synchroscope)</span>',ref:'ص 113',
   q:'بدل أن نراقب ثلاثة مصابيح… هل يمكن لمؤشر واحد أن يخبرنا: أسرع أم أبطأ، ومتى نغلق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهاز التزامن: مؤشر رأسي عند الساعة الثانية عشرة، وكلمة Slow يساراً بسهم عكس عقارب الساعة وكلمة Fast يميناً بسهم مع عقارب الساعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<circle cx="180" cy="150" r="104" fill="#2C4A40"/><circle cx="180" cy="150" r="92" fill="#FBF6EE"/>
<g stroke="#2C4A40" stroke-width="2"><path d="M180 58V70" stroke-width="5" stroke="#12855A"/><path d="M226 70.3L222 77.2M259.7 104L252.8 108M272 150H260M259.7 196L252.8 192M226 229.7L222 222.8M180 242V230M134 229.7L138 222.8M100.3 196L107.2 192M88 150H100M100.3 104L107.2 108M134 70.3L138 77.2"/></g>
<g data-tip="المؤشر: مركّب على العضو الدوار لمحرك حثي صغير داخل الجهاز. عندما يقف عمودياً (مكان الساعة 12) يكون جهد المولد في نفس الطور مع جهد القضبان: هذه لحظة الإغلاق."><line x1="180" y1="150" x2="180" y2="74" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><circle cx="180" cy="150" r="12" fill="#2C4A40"/></g>
<g data-tip="⟦Slow⟧: يدور المؤشر عكس عقارب الساعة عندما يكون تردد المولد أقل من تردد القضبان، فنزيد سرعة المولد."><path d="M130 196 A62 62 0 0 1 120 128" fill="none" stroke="#2E8C83" stroke-width="3"/><polygon points="121,116 114,131 128,130" fill="#2E8C83"/><text x="146" y="210" text-anchor="middle" font-size="14" fill="#2E8C83" font-weight="700" font-family="var(--mono)">Slow</text></g>
<g data-tip="⟦Fast⟧: يدور المؤشر مع عقارب الساعة عندما يكون تردد المولد أعلى من تردد القضبان، فنقلل سرعة المولد."><path d="M230 196 A62 62 0 0 0 240 128" fill="none" stroke="#B4472F" stroke-width="3"/><polygon points="239,116 232,130 246,131" fill="#B4472F"/><text x="214" y="210" text-anchor="middle" font-size="14" fill="#B4472F" font-weight="700" font-family="var(--mono)">Fast</text></g>
<text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Synchroscope</text></svg>`,
   cap:'رسم مبسّط لجهاز التزامن في الشكل <span class="ltr">(3-19)</span> ص 113: العلامة الخضراء في الأعلى = مكان الساعة 12.<br><b>مرّر المؤشر على المؤشر الأحمر والكلمتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>جهاز التزامن (<span class="ltr">Synchroscope</span>) الشكل رقم (3-19) يستخدم للتأكد من أن جهد المولد في نفس الطور مع جهد القضبان اللانهائية وأن لهما نفس التردد، أي أنه يعتبر بديلاً للمصابيح في الشكل (3-18)، وهو <b>عبارة عن محرك حثي يتعرض لمجالين مغناطيسيين؛ الأول من القضبان اللانهائية والآخر من المولد التزامني، والعضو الدوار مركب عليه مؤشر يتحرك باتجاه عقارب الساعة وعكس عقارب الساعة يعتمد على تردد المولد التزامني أهو أعلى أم أقل من تردد القضبان اللانهائية</b>، وعندما يقف المؤشر بشكل عمودي (في مكان الساعة 12) فهذا يعني أن جهد المولد في نفس الطور مع جهد القضبان اللانهائية، في هذه الحالة يمكن توصيل المولد التزامني بالقضبان اللانهائية بأمان عن طريق القاطع الرئيسي.</p>`,ref:'ص 113'}
   ],
   body:[
    {predict:{q:'المؤشر يدور مع عقارب الساعة نحو «Fast». ماذا يعني ذلك؟',opts:[
     ['تردد المولد أقل من تردد القضبان',false,'الدوران عكس عقارب الساعة (Slow) هو الذي يعني أن المولد أبطأ.'],
     ['تردد المولد أعلى من تردد القضبان',true,'المؤشر يتحرك مع عقارب الساعة أو عكسها حسب تردد المولد «أهو أعلى أم أقل» من تردد القضبان، والسهم المكتوب عليه Fast مع عقارب الساعة في الشكل (3-19).'],
     ['المولد في لحظة تزامن، فأغلق القاطع',false,'لحظة التزامن عندما يقف المؤشر عمودياً عند الساعة 12، لا وهو يدور.']]}},
    {tip:String.raw`<p>المؤشر هو «المصابيح» نفسها في صورة أوضح: سرعة دورانه تقابل سرعة تتابع الإضاءة (فرق الترددين)، واتجاهه يخبرك أيّ الترددين أكبر، ووقوفه عند الساعة 12 يقابل انطفاء المصباح الأول \((V_S=0)\).</p>`},
    {watch:String.raw`<p>رقم الشكل (3-19) مكرر في الكتاب: «جهاز التزامن» ص 113 و«منحنى اللاحمل» لمثال (3-1) ص 114 يحملان الرقم نفسه، ونص المثال وحله يقصدان منحنى اللاحمل.</p>`,fix:true}
   ]},
  ...(EXTRA_INFINITE_BUS?[
  {st:7,short:'بعد الربط (إضافة)',title:'<span class="sg-tag">إضافة من خارج الكتاب</span> المولد بعد ربطه بالقضيب اللانهائي',ref:'تكملة لأسئلة ص 122',
   q:'أغلقنا القاطع ونجح الربط… الآن لو زدنا وقود التوربينة، هل تزيد سرعة المولد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك الأولي يدير المولد المربوط بالقضيب اللانهائي، وسهم القدرة الفعالة من المولد إلى القضيب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="القضيب اللانهائي: يفرض تردده وجهده على المولد بعد الربط."><rect x="40" y="46" width="280" height="40" rx="10" fill="#2C4A40"/><text x="180" y="72" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">القضيب اللانهائي</text></g>
<g data-tip="القدرة الفعالة ⟦P⟧: تزيد بزيادة عزم المحرك الأولي، لأن زاوية القدرة δ تزيد (المعادلة 3-15)، والسرعة لا تتغير."><path d="M250 206V110" stroke="#12855A" stroke-width="10"/><polygon points="250,92 236,114 264,114" fill="#12855A"/><text x="282" y="160" text-anchor="middle" font-size="16" fill="#12855A" font-weight="700" font-family="var(--mono)">P</text></g>
<g data-tip="القدرة غير الفعالة ⟦Q⟧: تتغير بتغيير تيار المجال، والقدرة الفعالة كما هي."><path d="M110 206V110" stroke="#C99A1E" stroke-width="6" stroke-dasharray="8 5"/><polygon points="110,94 99,114 121,114" fill="#C99A1E"/><text x="80" y="160" text-anchor="middle" font-size="16" fill="#C99A1E" font-weight="700" font-family="var(--mono)">Q</text></g>
<path d="M180 86V204" stroke="#2C4A40" stroke-width="3"/>
<g data-tip="المولد بعد الربط: يدور بالسرعة التزامنية ⟦n = 120f/p⟧ مهما تغير عزم المحرك الأولي."><circle cx="180" cy="230" r="28" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="236" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">G</text></g>
<g data-tip="المحرك الأولي (التوربينة): زيادة عزمه تزيد القدرة المرسلة لا السرعة."><rect x="226" y="222" width="34" height="16" fill="#2C4A40"/><path d="M260 210 L310 196 V264 L260 250Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g>
<text x="180" y="294" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">السرعة ثابتة… والقدرة هي التي تتغير</text></svg>`,
   cap:'السهم الأخضر = القدرة الفعالة، والمتقطع الذهبي = القدرة غير الفعالة. <b>هذه المحطة كلها ليست من الكتاب.</b><br><b>مرّر المؤشر على الأسهم والأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {add:String.raw`<p><b>هذا القسم كله ليس من الكتاب.</b> أُضيف لأن أسئلة الفصل الثاني (5 و6 و7، ص 122) تسأل عنه والكتاب لا يشرحه. يُبنى على معادلة الكتاب (3-15) والشكل (3-16) فقط.</p>
     <ol><li><b>السرعة والتردد:</b> بعد إغلاق القاطع يفرض القضيب اللانهائي تردده على المولد، فيبقى المولد دائراً بالسرعة التزامنية \(n=120f/p\) <b>مهما تغير عزم المحرك الأولي</b>. أي لا يمكن التحكم في سرعة المولد بعد الربط.</li>
     <li><b>زيادة عزم المحرك الأولي</b> (وقود أكثر للتوربينة) لا تزيد السرعة، بل تزيد زاوية القدرة \(\delta\)، فتزيد القدرة الفعالة التي يدفعها المولد إلى القضيب حسب \(P_o=3\,VE\sin\delta/X_S\) (3-15).</li></ol>`,title:'السرعة والقدرة الفعالة'}
   ],
   body:[
    {add:String.raw`<ol start="3"><li><b>اتجاه انتقال القدرة:</b> إذا كانت قدرة المحرك الأولي أكبر من المفاقيد كانت \(\delta\) موجبة وانتقلت القدرة من المولد إلى القضيب (منطقة المولد في الشكل 3-16). وإذا قلّت عن المفاقيد صارت \(\delta\) سالبة وأخذت الآلة قدرة من القضيب فعملت كمحرك (منطقة المحرك).</li>
     <li><b>تغيير تيار المجال</b> يغير \(E_{ph}\) ولا يغير القدرة الفعالة (ما دام عزم المحرك الأولي ثابتاً)، بل يغير <b>القدرة غير الفعالة</b> ومعامل القدرة: مع زيادة المجال \((E\cos\delta\gt V)\) يعطي المولد قدرة غير فعالة للقضيب ويكون تياره متأخراً؛ ومع إنقاصه \((E\cos\delta\lt V)\) يأخذ قدرة غير فعالة ويكون تياره متقدماً. جهد القضيب لا يتغير.</li>
     <li><b>فقد التزامن:</b> إذا طُلب من المولد قدرة أكبر من \(P_{max}=3\,VE/X_S\) (3-16)، بزيادة العزم كثيراً أو بإضعاف المجال كثيراً، تتجاوز \(\delta\) الزاوية 90° فيدخل منطقة التشغيل غير المستقر ويفقد التزامن.</li></ol>
     <p>جرّب ذلك في المختبر بعد أن تنجح في إغلاق القاطع (وضع «بعد الربط»).</p>`,title:'اتجاه القدرة، والمجال، وفقد التزامن'},
    {predict:{q:'بعد ربط المولد بالقضيب اللانهائي زدنا وقود التوربينة. ماذا يتغير؟',opts:[
     ['تزيد سرعة المولد وتردده',false,'القضيب اللانهائي يفرض تردده، فتبقى السرعة تزامنية.'],
     [String.raw`تزيد زاوية القدرة \(\delta\) فتزيد القدرة الفعالة المرسلة إلى القضيب`,true,'هذا ما تقوله المعادلة (3-15): السرعة ثابتة، والزاوية هي التي تتغير.'],
     ['يزيد جهد القضيب',false,'جهد القضيب اللانهائي لا يتغير بمولد واحد.']]}}
   ]}
  ]:[]),

  {recap:[
   String.raw`التشغيل على التوازي يغذي أحمالاً أكبر، ويزيد الموثوقية، ويسمح بالصيانة دون قطع، ويرفع الكفاءة مع الأحمال الصغيرة (ص 110).`,
   String.raw`شروط الربط الأربعة: تساوي الجهد الفعال، وتساوي التردد، ونفس تتابع الأطوار، والجهود في نفس الطور؛ ومخالفتها تتلف الملفات أو تكسر العمود (ص 110–111).`,
   String.raw`طريقة المصابيح: الأول بين a و'a والآخران متقاطعان؛ الإضاءة المنتظمة تعني تتابعاً صحيحاً، ونغلق القاطع عندما \(V_S=0\) (الأول منطفئ والآخران مضاءان) (ص 111–113).`,
   String.raw`جهاز التزامن: مؤشر يدور Fast أو Slow حسب تردد المولد، ونغلق القاطع عندما يقف عند الساعة 12 (ص 113).`]}
],
 theory:[
  {h:'تشغيل المولدات التزامنية على التوازي',ref:'ص 110',html:`<p>«من النادر جداً أن يوجد مولد وحيد يغذي حملاً مستقلاً ماعدا حالات خاصة كالمولدات المعدة لأعمال الطوارئ»، وفي كثير من التطبيقات يوجد أكثر من مولد مربوطة على التوازي، وأقرب مثال على ذلك أي منطقة من مناطق المملكة حيث توجد العشرات من المولدات التزامنية في أماكن مختلفة مربوطة على التوازي لتغذية تلك المنطقة.</p>
   <p><b>مميزات التشغيل على التوازي:</b></p><ol><li>المولدات المربوطة على التوازي تستطيع أن تغذي أحمالاً أكبر من الحمل الذي يغذيه مولد واحد.</li><li>تزيد موثوقية النظام، لأنه في حالة تعطل أي مولد فإن المولدات الأخرى تتقاسم حصته.</li><li>تسمح بإجراء أعمال الصيانة لمولد أو أكثر دون قطع القدرة عن الأحمال.</li><li>عدة مولدات صغيرة على التوازي أكبر كفاءة من مولد وحيد مكافئ لها خصوصاً عندما تكون الأحمال صغيرة.</li></ol>
   <p><b>شروط الربط على التوازي:</b></p><ol><li>القيمة الفعالة <span class="ltr">(rms value)</span> لجهد الأطراف في كلا المولدين يجب أن تتساوى.</li><li>التردد يجب أن يكون متساوياً في كلا المولدين.</li><li>نفس تتابع الأطوار لكلا المولدين إما <span class="ltr">ABC</span> أو <span class="ltr">ACB</span>.</li><li>يجب أن تكون الجهود في نفس الطور (زاوية الطور للوجه a متساوية لكلا المولدين).</li></ol>
   <p>عند تحقق هذه الشروط يمكن توصيل المولدين على التوازي بأمان، أما عند عدم تحقق شرط أو أكثر فإن ذلك يؤدي إلى أضرار كبيرة مثل «<b>إتلاف ملفات المولد بسبب مرور تيار كبير فيها أو إلى كسر عمود الدوران بسبب تحوله إلى محرك يدور باتجاه معاكس لدوران التوربينة</b>» <span class="ref">ص 111</span>.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عند لحظة الإغلاق يتصل كل وجه في المولد بنظيره في الشبكة مباشرة. إذا اختلف الجهدان في المقدار أو الطور فإن الفرق بينهما يقع على ممانعة صغيرة جداً (الملفات)، فيمر تيار هائل. لهذا نريد أن يكون الفرق بين الطرفين المتماثلين صفراً تماماً لحظة الإغلاق: \\(V_S=0\\).'},
  {h:'توصيل المولدات التزامنية إلى قضبان لا نهائية',ref:'ص 111',html:`<p>«إن عملية توصيل المولد التزامني إلى قضبان لا نهائية <span class="ltr">Infinite bus bars</span> تعتبر عملية مشابهة لتوصيل المولد التزامني على التوازي مع مولد آخر كبير جداً، وذلك لأن القضبان اللانهائية تعتبر كأنها <b>مولد ذو قدرة غير محدودة</b>». ولإتمام العملية يجب أن تتحقق الشروط السابقة قبل التوصيل، وللتأكد منها تجرى عملية التزامن بطرق منها طريقتان:</p>`},
  {h:'طريقة المصابيح المضيئة',ref:'ص 111–112',html:`<p>توصل ثلاث لمبات بين الآلة والقضبان اللانهائية كما في الشكل (3-18) بحيث: <b>الأولى بين الخطين a و'a، والثانية بين الخطين b و'c، والثالثة بين الخطين c و'b</b>. ويوصل ثلاثة أجهزة فولتميتر: \\(V_S\\) بين الوجهين a و'a، و\\(V_m\\) لجهد المولد، و\\(V_b\\) لجهد القضبان، وجهازان لقياس تردد المولد والقضبان. وبهذه الطريقة نتأكد من الشروط الأربعة:</p>
   <ol><li>الشرط الأول: تتساوى قراءة أجهزة قياس الجهد \\(V_m=V_b\\).</li><li>الشرط الثاني: تتساوى قراءة أجهزة قياس التردد \\(F_m=F_b\\).</li><li>الشرط الثالث: يتحقق عندما يكون انطفاء واشتعال المصابيح بشكل منتظم.</li><li>الشرط الرابع: يتحقق عندما يكون فرق الجهد بين وجهين متماثلين في الآلة والقضيب صفراً \\(V_S=0\\).</li></ol>`},
  {fig:'(3-18)',ref:'ص 112',caption:'عملية التزامن بطريقة المصابيح المضيئة: القضيب اللانهائي في الأعلى، والقاطع الرئيسي والمولد يميناً، ومحولا الجهد، والمصابيح 1 (a–\'a) و2 (b–\'c) و3 (c–\'b)، والفولتميتر \\(V_s\\) (أُعيد رسمه)',draw:()=>svgbox(fig318({lamps:[0.05,0.85,0.85]}),600,500)},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوان الطريقة «طريقة المصابيح المضيئة» (ص 111)، لكن التوصيلة الموصوفة (مصباح بين a و\'a ومصباحان متقاطعان، وشرط الإغلاق: الأول منطفئ والآخران مضاءان) تعرف أيضاً بطريقة <b>المصابيح الدوارة</b> (مصباح مطفأ ومصباحان مضيئان). والكتاب لا يذكر طريقتي «المصابيح المطفأة» و«المصابيح المضيئة» منفصلتين.'+'</div>'},
  {h:'خطوات عملية التزامن',ref:'ص 112–113',html:`<ol><li>يرفع جهد أطراف المولد حتى يساوي جهد القضيب \\(V_m=V_b\\) بزيادة تيار المجال تدريجياً.</li><li>يضبط تردد المولد قريباً من تردد القضيب بزيادة سرعة الدوران.</li>
   <li>عند محاولة ضبط السرعة تحدث إحدى حالتين للمصابيح:<ul><li><b>الحالة الأولى:</b> جميع المصابيح تضيء وتنطفئ بشكل عشوائي: تتابع الأطوار مختلف، فيجب <b>المبادلة بين أي طرفين من أطراف المولد</b> لعكس تتابع أطواره، وبعدها تصبح الإضاءة منتظمة ومتتابعة.</li><li><b>الحالة الثانية:</b> جميع المصابيح تضاء وتنطفئ بشكل منتظم ومتتابع: تتابع الأطوار متماثل.</li></ul></li>
   <li>إذا تحققت الحالة [الثانية] يبقى ضبط التردد بالتحكم في سرعة الآلة، ويتضح ذلك في سرعة تتابع الإضاءة: إذا زادت سرعة التتابع يلزم زيادة أو تقليل سرعة المولد بحيث يكون التتابع بطيئاً قدر الإمكان. وفي اللحظة التي يكون فيها \\(V_S=0\\) <b>أو المصباح الأول منطفئاً بينما الثاني والثالث مضاءان</b> يكون الشرط الرابع قد تحقق، والآلة في لحظة تزامن مع القضيب، <b>وعندها يمكن إغلاق القاطع الرئيسي بأمان</b>.</li></ol>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الخطوة 4 ص 113 تقول «إذا تحققت <b>الحالة الثالثة</b>»، ولا توجد حالة ثالثة؛ المقصود الحالة الثانية (التتابع المنتظم).'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عندما يكون تتابع الأطوار مختلفاً تضيء المصابيح الثلاثة وتنطفئ <b>معاً</b> بدل أن تتتابع واحداً بعد الآخر؛ هذا هو المقصود بعبارة الكتاب «بشكل عشوائي» (أي غير متتابع)، وهكذا تظهر في المختبر. وعندما يكون التتابع صحيحاً «تدور» الإضاءة على المصابيح الثلاثة، وكلما اقترب التردد من تردد القضيب صار الدوران أبطأ.'},
  {h:'باستخدام جهاز التزامن',ref:'ص 113',html:`<p>جهاز التزامن <span class="ltr">(Synchroscope)</span> الشكل (3-19) يستخدم للتأكد من أن جهد المولد في نفس الطور مع جهد القضبان وأن لهما نفس التردد، أي أنه بديل للمصابيح. وهو «عبارة عن <b>محرك حثي يتعرض لمجالين مغناطيسيين</b>؛ الأول من القضبان اللانهائية والآخر من المولد التزامني، والعضو الدوار مركب عليه مؤشر يتحرك باتجاه عقارب الساعة وعكس عقارب الساعة يعتمد على تردد المولد التزامني أهو أعلى أم أقل من تردد القضبان اللانهائية». و«<b>عندما يقف المؤشر بشكل عمودي (في مكان الساعة 12)</b> فهذا يعني أن جهد المولد في نفس الطور مع جهد القضبان»، وعندها يوصل المولد بأمان عن طريق القاطع الرئيسي.</p>`},
  {fig:'(3-19)',ref:'ص 113',caption:'جهاز التزامن: المؤشر عند الساعة 12، و«Slow» يساراً بسهم عكس عقارب الساعة و«Fast» يميناً بسهم مع عقارب الساعة',draw:()=>svgbox(syncSVG(0),240)},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'رقم الشكل (3-19) مكرر في الكتاب: «جهاز التزامن» ص 113 و«منحنى اللاحمل» لمثال (3-1) ص 114 يحملان الرقم نفسه، ونص المثال وحله يحيلان إلى «الشكل (3-19)» قاصدين منحنى اللاحمل.'+'</div>'},
  {note:'الكتاب لا يشرح ما يحدث للمولد <b>بعد</b> ربطه بالقضيب اللانهائي (أثر تغيير تيار المجال أو عزم المحرك الأولي)، مع أن أسئلة الفصل (5–7) ص 122 تسأل عنه.'+(EXTRA_INFINITE_BUS?' لذلك أضفنا القسم التالي، وهو معلَّم بوضوح أنه من خارج الكتاب.':'')}
 ].concat(EXTRA_INFINITE_BUS?EXTRA_THEORY:[]),
 lab:(el)=>{
  let Fb=60,VbL=380,Vbp=VbL/SQ3,XS6=1,PLOSS=3,TOLV=5,TOLF=0.2,TOLP=12;   // bus 380 V 60 Hz, Xs, losses and closing limits: أرقام توضيحية (قيم المدرب)
  const NS=()=>30*Fb;                                 // السرعة التزامنية لمولد 4 أقطاب (1800 rpm بالقيم التوضيحية)
  let If=2,n=1740,seq=0,phi=Math.random()*360,closed=0,flash='',lastS='',bad=0,Pin=PLOSS,If2=4.5,swaps=0,seenQp=0,seenQn=0,lostSync=0;
  const Vm=()=>VbL*occ(If)/occ(4.5)*(n/30/Fb),Fm=()=>n/30;
  el.innerHTML=`<div id="l6tp"></div><div class="grid">
   <div class="panel c8"><h2>لوحة التزامن <small>مبنية على الشكل (3-18) ص 112</small></h2>
    <div id="l6d" class="svgbox" style="max-width:620px;margin-inline:auto"></div>
    <div id="l6msg" class="sg-msg"></div></div>
   <div class="panel c4"><h2>جهاز التزامن <small>الشكل (3-19) ص 113</small></h2><div id="l6sy" class="svgbox" style="max-width:220px;margin-inline:auto"></div>
    <div class="facts">${fact('<bdi dir="ltr">V<sub>m</sub> − V<sub>b</sub></bdi>','l6dv')}${fact('<bdi dir="ltr">F<sub>m</sub> − F<sub>b</sub></bdi>','l6df')}</div></div>
   <div class="panel c12"><h2>التحكم</h2>
    <div class="grid" style="margin-top:0"><div class="c6">${sl('l6f','تيار المجال <span class="ltr">I<sub>F</sub></span> (يغيّر V<sub>m</sub>)',0,8,0.01,If)}
     ${sl('l6n','سرعة المحرك الأولي <span class="ltr">n</span> (4 أقطاب، يغيّر F<sub>m</sub>)',1500,1950,0.5,n)}
     <div class="sg-row"><button class="btn" data-dn="-5">−5</button><button class="btn" data-dn="-0.5">−0.5</button><button class="btn" data-dn="0.5">+0.5</button><button class="btn" data-dn="5">+5</button><span class="sub">rpm</span></div></div>
     <div class="c6"><div class="sg-row"><button class="btn" id="l6sw">بادل طرفين من أطراف المولد</button><span id="l6sq" class="sub"></span></div>
     <div class="sg-row"><button class="btn primary sg-big" id="l6cb">أغلق القاطع الرئيسي</button><button class="btn" id="l6op">افتح القاطع</button></div>
     <p class="sub">القضيب: <span class="ltr"><span data-t6="vb"></span> V</span> خطي و<span class="ltr"><span data-t6="fb"></span> Hz</span> (<b>أرقام توضيحية</b>). جهد المولد يتبع منحنى اللاحمل لمثال (3-1) مقيساً بحيث يعطي <span class="ltr"><span data-t6="vb"></span> V</span> عند <span class="ltr">4.5 A</span> و<span class="ltr"><span data-t6="ns"></span> rpm</span>. شرط الإغلاق الناجح في المحاكاة: فرق جهد ≤ <span class="ltr"><span data-t6="tv"></span>%</span>، فرق تردد ≤ <span class="ltr"><span data-t6="tf"></span> Hz</span>، وفرق الطور ≤ <span class="ltr"><span data-t6="tp"></span>°</span> (حدود توضيحية).</p></div></div></div>
   ${EXTRA_INFINITE_BUS?`<div class="panel c12" id="l6x"><h2><span class="sg-tag">إضافة من خارج الكتاب</span> <span>بعد الربط بالقضيب اللانهائي</span></h2><div id="l6xb"></div></div>`:''}
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l6st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l6tp'),'u3-l6',[
   {k:'VbL',label:'الجهد الخطي للقضيب',unit:'V',value:380,min:1,max:1e6},
   {k:'Fb',label:'تردد القضيب',unit:'Hz',value:60,min:10,max:400,step:0.1},
   {k:'TOLV',label:'أكبر فرق جهد يُسمح معه بالإغلاق',unit:'%',value:5,min:0.1,max:50,step:0.1},
   {k:'TOLF',label:'أكبر فرق تردد يُسمح معه بالإغلاق',unit:'Hz',value:0.2,min:0.01,max:5,step:0.01},
   {k:'TOLP',label:'أكبر فرق طور يُسمح معه بالإغلاق',unit:'°',value:12,min:0.5,max:90,step:0.5}].concat(EXTRA_INFINITE_BUS?[
   {k:'XS6',label:'الممانعة التزامنية X<sub>S</sub> (بعد الربط)',unit:'Ω',value:1,min:0.001,max:1e4},
   {k:'PLOSS',label:'مفاقيد المولد (بعد الربط)',unit:'kW',value:3,min:0,max:1e5}]:[]),()=>{const F0=Fb;applyTP();
     const sl6=$('#l6n');sl6.min=25*Fb;sl6.max=32.5*Fb;n=closed?NS():clamp(n*Fb/F0,25*Fb,32.5*Fb);sl6.value=n;if(closed){If2=If;xUI()}lastS='';steps.redraw()});
  function applyTP(){const v=TP.v;VbL=v.VbL;Fb=v.Fb;Vbp=VbL/SQ3;TOLV=v.TOLV;TOLF=v.TOLF;TOLP=v.TOLP;if(EXTRA_INFINITE_BUS){XS6=v.XS6;PLOSS=v.PLOSS}
   el.querySelectorAll('[data-t6]').forEach(x=>{x.textContent=fm({vb:VbL,fb:Fb,ns:NS(),tv:TOLV,tf:TOLF,tp:TOLP}[x.dataset.t6])})}
  applyTP();Pin=PLOSS;
  {const sl6=$('#l6n');sl6.min=25*Fb;sl6.max=32.5*Fb;n=clamp(n*Fb/60,25*Fb,32.5*Fb);sl6.value=n}
  const setN=v=>{n=clamp(v,25*Fb,32.5*Fb);$('#l6n').value=n};
  $('#l6f').oninput=e=>{If=+e.target.value;if(closed)If2=If};$('#l6n').oninput=e=>{if(!closed)n=+e.target.value;else $('#l6n').value=n};
  el.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>{if(!closed)setN(n+ +b.dataset.dn)});
  $('#l6sw').onclick=()=>{if(closed){flash='<div class="callout err">افتح القاطع أولاً قبل تغيير توصيل الأطراف.</div>';return}seq=seq?0:1;swaps++;lastS=''};
  const conds=()=>{const dv=Math.abs(Vm()-VbL)/VbL,df=Fm()-Fb,dp=Math.abs(wrap180(phi));return {seq:!!seq,v:dv<=TOLV/100,f:Math.abs(df)<=TOLF,p:dp<=TOLP,df,dp}};
  $('#l6cb').onclick=()=>{if(closed)return;const c=conds();
   if(c.seq&&c.v&&c.f&&c.p){closed=1;phi=0;n=NS();$('#l6n').value=n;If2=If;Pin=PLOSS;flash='<div class="callout"><b>تم الربط بنجاح.</b> أُغلق القاطع لحظة التزامن: المصباح الأول منطفئ والمؤشر عند الساعة 12. أصبح المولد مربوطاً بالقضيب اللانهائي.</div>'}
   else{bad++;const L=[];if(!c.seq)L.push('تتابع الأطوار مختلف (الشرط 3)');if(!c.v)L.push('الجهدان غير متساويين (الشرط 1)');if(!c.f)L.push(`الترددان غير متساويين (الشرط 2)${c.df<0?' — المولد أبطأ من القضيب':''}`);if(!c.p)L.push(`الجهدان ليسا في نفس الطور: فرق الطور ${fm(c.dp,0)}° (الشرط 4)`);
    flash=`<div class="callout err"><b>تحذير: إغلاق خاطئ!</b> الشروط غير المتحققة: <ul>${L.map(x=>`<li>${x}</li>`).join('')}</ul>الكتاب (ص 111): مخالفة الشروط تؤدي إلى «إتلاف ملفات المولد بسبب مرور تيار كبير فيها أو إلى كسر عمود الدوران بسبب تحوله إلى محرك يدور باتجاه معاكس لدوران التوربينة». في المحاكاة لم يُغلق القاطع؛ صحّح الشروط وحاول مجدداً.</div>`}
   lastS=''};
  $('#l6op').onclick=()=>{if(!closed)return;closed=0;flash='<div class="callout">فُتح القاطع: المولد منفصل عن القضيب، ويمكنك تغيير سرعته مجدداً.</div>';lastS=''};
  // عتبات خطوات «جرّب» مشتقة من حدود الإغلاق (تساوي 2% و 0.5 Hz و 0.1 Hz و 60 kW بالقيم التوضيحية)
  const thV=()=>TOLV*2/5,thF1=()=>2.5*TOLF,thF2=()=>0.5*TOLF,thP=()=>60*(VbL/380)*(VbL/380)/XS6;
  const lt6=x=>`<span class="ltr">${x}</span>`;
  const st=[
   {t:'ساوِ الجهدين',x:()=>`ارفع تيار المجال تدريجياً حتى يتساوى \\(V_m\\) مع \\(V_b\\) (الفرق أقل من ${lt6(fm(+thV().toPrecision(4))+'%')}).`,done:()=>Math.abs(Vm()-VbL)/VbL<thV()/100},
   {t:'قرّب التردد',x:()=>`اضبط سرعة الدوران حتى يصبح فرق التردد أقل من ${lt6(fm(+thF1().toPrecision(4))+' Hz')} (نحو السرعة التزامنية: ${lt6(fm(NS())+' rpm')}).`,done:()=>Math.abs(Fm()-Fb)<thF1()},
   {t:'تتابع الأطوار',x:'راقب المصابيح: إذا كانت تضيء وتنطفئ <b>معاً</b> (الحالة الأولى) فتتابع الأطوار مختلف. اضغط «بادل طرفين» حتى تتتابع الإضاءة (الحالة الثانية).',done:()=>seq===1},
   {t:'دقّق التردد',x:()=>`اجعل فرق التردد صغيراً جداً (≤ ${lt6(fm(+thF2().toPrecision(4))+' Hz')}): يتباطأ تتابع المصابيح ودوران مؤشر جهاز التزامن. المؤشر يدور نحو Fast إذا كان المولد أسرع ونحو Slow إذا كان أبطأ.`,done:()=>seq&&Math.abs(Fm()-Fb)<=thF2()},
   {t:'أغلق القاطع',x:'انتظر اللحظة التي ينطفئ فيها المصباح الأول ويضيء الثاني والثالث، ويقف المؤشر عند الساعة 12 (\\(V_S\\approx0\\))، ثم اضغط «أغلق القاطع الرئيسي». جرّب أيضاً الإغلاق في لحظة خاطئة لترى التحذير.',done:()=>closed}];
  if(EXTRA_INFINITE_BUS)st.push(
   {t:'(إضافة) زد عزم المحرك الأولي',x:()=>`في لوحة «بعد الربط» زد قدرة المحرك الأولي فوق ${lt6(fm(+thP().toPrecision(4))+' kW')}: تبقى السرعة ثابتة عند السرعة التزامنية (${lt6(fm(NS())+' rpm')}) وتزيد δ والقدرة المرسلة إلى القضيب.`,done:()=>closed&&Pin>=thP()},
   {t:'(إضافة) غيّر تيار المجال',x:'غيّر تيار المجال صعوداً وهبوطاً: القدرة الفعالة ثابتة تقريباً، والقدرة غير الفعالة تغير إشارتها (المولد يعطي ثم يأخذ قدرة غير فعالة).',done:()=>seenQp&&seenQn},
   {t:'(إضافة) فقد التزامن',x:'زد قدرة المحرك الأولي كثيراً أو أضعف المجال جداً حتى تتجاوز δ الزاوية 90°: يفقد المولد التزامن.',done:()=>lostSync});
  const steps=stepsUI($('#l6st'),st);
  const xb=EXTRA_INFINITE_BUS?$('#l6xb'):null;
  const xUI=()=>{if(!xb)return;if(!closed){xb.innerHTML='<p class="sub">أغلق القاطع بنجاح أولاً (اتبع خطوات التزامن). بعدها تظهر هنا تجربة تغيير عزم المحرك الأولي وتيار المجال. السلوك المعروض هنا <b>ليس من الكتاب</b>.</p>';return}
   const pMax=Math.max(200,Math.ceil(1.15*3*Vbp*Vbp*occ(8)/occ(4.5)/XS6/1000/10)*10);Pin=Math.min(Pin,pMax);
   xb.innerHTML=`<div class="grid" style="margin-top:0"><div class="c6">${sl('l6p','قدرة المحرك الأولي (العزم × السرعة)',0,pMax,0.5,Pin)}<p class="sub">تيار المجال: استعمل المنزلق في لوحة «التحكم». السرعة مقفلة على تردد القضيب ولا تتحرك.</p>
    <div class="facts">${fact('السرعة','l6xn')}${fact('زاوية القدرة δ','l6xd')}${fact('القدرة الفعالة إلى القضيب','l6xp')}${fact('القدرة غير الفعالة','l6xq')}${fact('تيار الخط','l6xi')}${fact('معامل القدرة','l6xf')}</div><div id="l6xm" class="sg-msg"></div></div>
    <div class="c6"><div id="l6xph" class="svgbox" style="max-width:480px;margin-inline:auto"></div><p class="sub">المخطط الاتجاهي لوجه واحد مع إهمال \\(R_A\\). <span class="ltr">X<sub>S</sub> = ${fm(XS6)} Ω</span> والمفاقيد <span class="ltr">${fm(PLOSS)} kW</span> <b>أرقام توضيحية</b>.</p></div></div>`;
   B.math(xb);$('#l6p').oninput=e=>{Pin=+e.target.value}};
  let wasClosed=-1;
  loopOn(el,dt=>{
   if(!closed)phi=(phi+360*(Fm()-Fb)*dt)%360;
   $('#l6f-v').textContent=fm(If,2)+' A';$('#l6n-v').textContent=fm(n,1)+' rpm'+(closed?' (مقفلة)':'');
   $('#l6n').disabled=!!closed;
   if(closed!==wasClosed){wasClosed=closed;xUI()}
   const vm=Vm(),vmp=vm/SQ3,fmv=Fm();
   const a=cpol(Vbp,0),b=cpol(Vbp,-120),c=cpol(Vbp,120),a2=cpol(vmp,phi),b2=cpol(vmp,seq?phi-120:phi+120),c2=cpol(vmp,seq?phi+120:phi-120);
   const L1=cabs(csub(a,a2)),L2=cabs(csub(b,c2)),L3=cabs(csub(c,b2)),nm=SQ3*Vbp;
   const lamps=closed?[0,1,1]:[L1/nm,L2/nm,L3/nm];
   $('#l6d').innerHTML='<div style="min-width:500px">'+fig318({lamps,closed,live:1,Vb:VbL,Fb,Vm:closed?VbL*occ(If2)/occ(4.5):vm,Fm:closed?Fb:fmv,Vs:closed?0:L1})+'</div>';
   $('#l6sy').innerHTML=syncSVG(closed?0:wrap180(phi));
   $('#l6dv').textContent=fm((closed?VbL*occ(If2)/occ(4.5):vm)-VbL,1)+' V';$('#l6df').textContent=fm(closed?0:fmv-Fb,2)+' Hz';
   $('#l6sq').innerHTML=seq?'تتابع المولد مطابق للقضيب':'تتابع المولد معكوس';
   let extraMsg='';
   if(closed&&EXTRA_INFINITE_BUS&&$('#l6p')){$('#l6p-v').textContent=fm(Pin,1)+' kW';If2=If;
    const E=Vbp*occ(If2)/occ(4.5),Pe=(Pin-PLOSS)*1000,arg=Pe*XS6/(3*Vbp*Math.max(E,1e-6));
    if(Math.abs(arg)>1||E<1){closed=0;lostSync=1;flash='<div class="callout err"><b>فقد التزامن (إضافة من خارج الكتاب):</b> القدرة المطلوبة تجاوزت \\(P_{max}=3VE/X_S\\) فتجاوزت δ الزاوية 90°. فُتح القاطع في المحاكاة. أعد التزامن من جديد.</div>';n=NS()+12*Fb/60;$('#l6n').value=n;lastS=''}
    else{const d=Math.asin(arg)/D,Ev=cpol(E,d),Ic=cdiv(csub(Ev,Cx(Vbp)),Cx(0,XS6)),S=cmul(Cx(3*Vbp),Cx(Ic.re,-Ic.im)),P=S.re/1000,Q=S.im/1000,pfv=Math.abs(P)/Math.max(1e-9,Math.hypot(P,Q));
     if(Q>2)seenQp=1;if(Q<-2)seenQn=1;
     $('#l6xn').textContent=fm(NS(),0)+' rpm';$('#l6xd').textContent=fm(d,2)+'°';$('#l6xp').textContent=fm(P,1)+' kW';$('#l6xq').textContent=fm(Q,1)+' kVAr';$('#l6xi').textContent=fm(cabs(Ic),1)+' A';
     $('#l6xf').textContent=cabs(Ic)<0.5?'—':fm(pfv,3)+(Math.abs(Q)<0.5?'':Q>0?' متأخر':' متقدم');
     const sx=[Math.round(Pin*2),Math.round(If2*100)].join();if(sx!==$('#l6xph').dataset.s){$('#l6xph').dataset.s=sx;$('#l6xph').innerHTML=phasorSVG({V:Vbp,I:Ic,RA:0,XS:XS6,Iref:Math.max(50,cabs(Ic))});
      $('#l6xm').innerHTML=`<div class="callout">${P>0.5?'القدرة تنتقل <b>من المولد إلى القضيب</b> (δ موجبة).':P<-0.5?'القدرة تنتقل <b>من القضيب إلى الآلة</b>: قدرة المحرك الأولي أقل من المفاقيد، فالآلة تعمل كمحرك (δ سالبة).':'لا تقريباً قدرة فعالة متبادلة: المحرك الأولي يغطي المفاقيد فقط.'} ${Q>0.5?'تيار المجال كبير: المولد يعطي القضيب قدرة غير فعالة وتياره متأخر.':Q<-0.5?'تيار المجال صغير: المولد يأخذ قدرة غير فعالة من القضيب وتياره متقدم.':''}</div>`}}}
   const sg=[closed,flash,seq].join();if(sg!==lastS){lastS=sg;$('#l6msg').innerHTML=flash||'<div class="callout">القاطع مفتوح. حقق الشروط الأربعة ثم أغلقه.</div>';B.math($('#l6msg'));if(closed!==wasClosed){wasClosed=closed;xUI()}}
   steps.check()});
 },
 quiz:[
  {q:'من مميزات تشغيل المولدات على التوازي:',o:['زيادة موثوقية النظام وإمكان الصيانة دون قطع الأحمال','تقليل عدد الأقطاب','إلغاء الحاجة إلى تيار المجال','رفع التردد'],c:0,e:'ص 110.'},
  {q:'أيٌّ مما يلي <b>ليس</b> من شروط الربط على التوازي؟',o:['تساوي الجهد الفعال','تساوي التردد','تساوي القدرة المقننة للمولدين','نفس تتابع الأطوار'],c:2,e:'الشروط الأربعة: الجهد، التردد، تتابع الأطوار، الطور.'},
  {q:'القضبان اللانهائية تعتبر:',o:['مولداً ذا قدرة غير محدودة','حملاً صغيراً','محولاً','مقاومة لا نهائية'],c:0,e:'ص 111.'},
  {q:'في طريقة المصابيح بالكتاب، المصباح الثاني يوصل بين:',o:['a و \'a','b و \'c','c و \'c','b و \'b'],c:1,e:'الأول a–\'a، والثاني b–\'c، والثالث c–\'b.'},
  {q:'إذا أضاءت المصابيح وانطفأت بشكل عشوائي (معاً) فهذا يعني:',o:['التردد متساوٍ','تتابع الأطوار مختلف ويجب المبادلة بين طرفين','الجهد متساوٍ','يمكن الإغلاق فوراً'],c:1,e:'الحالة الأولى ص 112.'},
  {q:'اللحظة المناسبة لإغلاق القاطع بطريقة المصابيح:',o:['كل المصابيح مضاءة','المصباح الأول منطفئ والثاني والثالث مضاءان','كل المصابيح منطفئة','المصباح الأول مضاء فقط'],c:1,e:'ص 113: وعندها V_S = 0.'},
  {q:'مؤشر جهاز التزامن يدور مع عقارب الساعة (Fast) يعني:',o:['تردد المولد أعلى من تردد القضبان','تردد المولد أقل','الجهدان متساويان','تتابع الأطوار معكوس'],c:0,e:'ص 113 والشكل (3-19).'},
  {q:'يمكن إغلاق القاطع بأمان عندما يقف مؤشر جهاز التزامن:',o:['عند الساعة 3','عند الساعة 6','عند الساعة 12','في أي مكان'],c:2,e:'ص 113.'}
 ]
});

/* ---------- constant-E procedure of مثال (3-2) ب (book rounding) ---------- */
function constE(E,XS,I,pf,dp){dp=dp==null?1:dp;const sn=Math.sin(Math.acos(pf)),XIs=B.round(XS*I*sn,dp),XIc=B.round(XS*I*pf,dp),E2=B.round(E*E,0),XIc2=B.round(XIc*XIc,dp===1?0:2),d1=B.round(E2-XIc2,2),r1=B.round(Math.sqrt(d1),1),XI=B.round(XS*I,dp),d2=B.round(E2-XI*XI,2),r2=B.round(Math.sqrt(d2),1);
  return {sn,XIs,XIc,E2,XIc2,d1,r1,XI,d2,V1:B.round(r1-XIs,1),V2:r2,V3:B.round(r1+XIs,1)}}
function constESteps(E,XS,I,pf,lab){const r=constE(E,XS,I,pf);const th=fm(Math.acos(pf)/D,2);return {r,steps:[
  {t:`<b>الحالة (1): ${lab[0]}</b> — التيار متأخر بزاوية \\(\\theta=\\cos^{-1}(${pf})=-${th}^\\circ\\). من المثلث القائم oab:`,f:`E_{Ph}^2=(V_{Ph}+X_SI_{Ph}\\sin\\theta)^2+(X_SI_{Ph}\\cos\\theta)^2`},
  {t:'',f:`(${fm(E,1)})^2=(V_{Ph}+${XS}\\times ${I}\\times\\sin ${th})^2+(${XS}\\times ${I}\\times\\cos ${th})^2`},
  {t:'',f:`${fm(r.E2,0)}=(V_{Ph}+${fm(r.XIs,1)})^2+${fm(r.XIc2,2)}\;\\Rightarrow\;${fm(r.d1,2)}=(V_{Ph}+${fm(r.XIs,1)})^2`},
  {t:'',f:`${fm(r.r1,1)}=V_{Ph}+${fm(r.XIs,1)}`},
  {t:'جهد الأطراف لكل وجه:',v:r.V1,dp:1,unit:'V',final:true},
  {t:`<b>الحالة (2): ${lab[1]}</b> — التيار في طور الجهد:`,f:`E_{Ph}^2=V_{Ph}^2+(X_SI_{Ph})^2\;\\Rightarrow\;${fm(r.E2,0)}=V_{Ph}^2+${fm(r.XI*r.XI,2)}\;\\Rightarrow\;V_{Ph}^2=${fm(r.d2,2)}`},
  {t:'جهد الأطراف لكل وجه:',v:r.V2,dp:1,unit:'V',final:true},
  {t:`<b>الحالة (3): ${lab[2]}</b> — التيار متقدم:`,f:`E_{Ph}^2=(V_{Ph}-X_SI_{Ph}\\sin\\theta)^2+(X_SI_{Ph}\\cos\\theta)^2\;\\Rightarrow\;${fm(r.r1,1)}=V_{Ph}-${fm(r.XIs,1)}`},
  {t:'جهد الأطراف لكل وجه:',v:r.V3,dp:1,unit:'V',final:true}]}}
const EX32_PRINTED={VL1:410,VL2:468.4,VL3:535};
function ex32Full(g,isBook){const n=B.round(120*g.f/g.P,2),E=B.round(g.VL/SQ3,0);const cs=constESteps(E,g.XS,g.IL,g.pf,['معامل القدرة '+g.pf+' متأخر','معامل القدرة 1.0','معامل القدرة '+g.pf+' متقدماً']),r=cs.r;
  const VL1=B.round(SQ3*r.V1,0),VL2=B.round(SQ3*Math.sqrt(r.d2),1),VL3=B.round(SQ3*r.V3,0);
  const out=[{t:'أ) من المعادلة (3-1):',f:`n=\\frac{120f}{P}=\\frac{120\\times ${g.f}}{${g.P}}`,v:n,unit:'rpm',final:true},
   {t:'ب) التوصيل نجمة: \\(V_{ph}=V_L/\\sqrt3\\) و \\(I_{ph}=I_L\\). عند عدم الحمل:',f:`V_{Ph}=E_{Ph}=\\frac{${g.VL}}{\\sqrt3}`,v:E,dp:0,unit:'V'}].concat(cs.steps);
  out.splice(7,0,{t:'الجهد الخطي:',f:`V_L=\\sqrt3\\times ${fm(r.V1,1)}`,v:VL1,dp:0,unit:'V'});
  out.splice(10,0,{t:'الجهد الخطي:',f:`V_L=\\sqrt3\\times ${fm(r.V2,1)}`,v:VL2,dp:1,unit:'V'});
  out.push({t:'الجهد الخطي:',f:`V_L=\\sqrt3\\times ${fm(r.V3,1)}`,v:VL3,dp:0,unit:'V'});
  const eff=ex32Eff({V:r.V1,I:g.IL,pf:g.pf,PF:g.PF,Pc:g.Pc,n},isBook);
  out.push(...eff);
  const VR=v=>B.round((g.VL-v)/v*100,1),a=B.round(VL1,0),b=B.round(VL2,0),c=B.round(VL3,0);
  out.push({t:'هـ) معامل تنظيم الجهد (3-13) بالجهود الخطية (قرّبها الكتاب لأقرب فولت):',f:`V_R\\%=\\frac{${g.VL}-${a}}{${a}}\\times100`,v:VR(a),dp:1,unit:'% (الحالة 1)',final:true},
   {t:'',f:`V_R\\%=\\frac{${g.VL}-${b}}{${b}}\\times100`,v:VR(b),dp:1,unit:'% (الحالة 2)',final:true},
   {t:'',f:`V_R\\%=\\frac{${g.VL}-${c}}{${c}}\\times100`,v:VR(c),dp:1,unit:'% (الحالة 3)',final:true});
  if(isBook)out.push({t:`للمقارنة (ليس من الكتاب): بالجهد ${lt('468.4 V')} دون تقريب يكون معامل الحالة (2) ${lt(fm((g.VL-VL2)/VL2*100,2)+' %')} بدل 2.6%.`});
  return out}
/* generic E = V + RA·I + jXS·I for the exercises (suggested solutions) */
function eSteps(V,I,pf,lead,RA,XS){const th=(lead===0?0:(lead?1:-1)*B.round(Math.acos(pf)/D,2)),dR=B.round(RA*I,2),dX=B.round(XS*I,2),E=cadd(Cx(V),cpol(dR,th),cpol(dX,th+90));
  return {E,steps:[{t:'',f:`E_{Ph}=${fm(V,1)}\\angle 0+(${RA})(${fm(I,1)}\\angle ${fm(th,2)})+(j${XS})(${fm(I,1)}\\angle ${fm(th,2)})`},
   {t:'',f:`=${fm(V,1)}\\angle 0+${pol(dR,th)}+${pol(dX,th+90)}=${fm(E.re,1)}${sgn(E.im)}j${fm(Math.abs(E.im),1)}`},
   {t:'الجهد الداخلي لكل وجه:',v:`${fm(cabs(E),1)} ∠ ${fm(cang(E),2)}°`,unit:'V',final:true}]}}

/* ---------- الشكل (3-19) الثاني: O.C.C of example (3-1) ---------- */
function fig319b(){return svgPlot({x0:0,x1:10,y0:0,y1:600,xt:[1,2,3,4,5,6,7,8,9,10],yt:[100,200,300,400,500,600],xl:'IF (A)',yl:'EPh (V)',aria:'منحنى اللاحمل لمثال 3-1',
  series:[{pts:samp(occ,0,10,100),col:'--live',w:2.6}],
  extra:(X,Y)=>[[4.1,451],[4.5,480],[5.7,532]].map(([x,y])=>`<path d="M${X(0)} ${fx(Y(y))}H${fx(X(x))}V${Y(0)}" fill="none" stroke="var(--blue)" stroke-dasharray="4 3" stroke-width="1.2"/><circle cx="${fx(X(x))}" cy="${fx(Y(y))}" r="4" fill="var(--blue)"/>`).join('')+laT(X(8.5),Y(560),'O.C.C',{col:'--live'})})}
const fig320=()=>{const E=277,I=60,X=1;const cs=[['(1)',-36.87],['(2)',0],['(3)',36.87]];return `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;direction:ltr">${cs.map(([t,a])=>{const z=cmul(Cx(0,X),cpol(I,a)),V=Math.sqrt(E*E-z.im*z.im)-z.re;return `<div style="flex:1 1 220px;max-width:300px">${svgbox(phasorSVG({V,I:cpol(I,a),RA:0,XS:X,Iref:I,W:300,H:220,title:t+'  Vph = '+fm(V,1)+' V'}))}</div>`}).join('')}</div>`};

/* ============================== Lesson 3.7 ============================== */
const Q7=(n,q,ans,ref)=>`<details class="sg-q"><summary>${n}. ${q}${ref?` <span class="ref">${ref}</span>`:''}</summary><div class="sg-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const OUT='<span class="sg-tag">من خارج الكتاب</span> ';
B.lesson({
 id:'u3-l7',unit:3,order:7,pages:'106، 114–123',
 title:'أمثلة محلولة وأسئلة الوحدة وتمارينها',
 summary:'مثالا الكتاب (3-1) و(3-2) كاملين بحاسبات تعيد أرقام الكتاب، ومولد تحت الحمل يقرأ تيار المجال من منحنى اللاحمل، ثم أسئلة الفصلين (ص 106 وص 122–123) بإجابات مقترحة وحلول مقترحة للتمارين 8–11.',
 stations:[
  {intro:true},

  {st:1,short:'مثال (3-1)',title:'مثال <span class="ltr">(3-1)</span>: مولد دلتا ومنحنى اللاحمل',ref:'ص 114–116',
   q:'كيف نعرف كم يجب أن يكون تيار المجال لكي يبقى الجهد ثابتاً مهما تغيّر الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى اللاحمل لمثال ثلاثة-واحد، وعليه النقاط الثلاث: أربعمئة وواحد وخمسون فولت عند أربعة فاصلة واحد أمبير، وأربعمئة وثمانون فولت عند أربعة فاصلة خمسة، وخمسمئة واثنان وثلاثون فولت عند خمسة فاصلة سبعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#FBE6C4"/><rect x="66" y="42" width="260" height="216" fill="#FBF6EE" opacity=".7"/><path d="M92 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M118 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M144 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M170 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M196 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M222 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M248 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M274 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M300 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M326 42V258" stroke="#CFC6B4" stroke-width="1"/><path d="M66 222H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 186H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 150H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 114H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 78H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 42H326" stroke="#CFC6B4" stroke-width="1"/><path d="M66 258H330M66 258V36" stroke="#2C4A40" stroke-width="2"/><text x="66" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">0</text><text x="92" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">1</text><text x="118" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">2</text><text x="144" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">3</text><text x="170" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">4</text><text x="196" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">5</text><text x="222" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">6</text><text x="248" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">7</text><text x="274" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">8</text><text x="300" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">9</text><text x="326" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">10</text><text x="60" y="262" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">0</text><text x="60" y="226" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">100</text><text x="60" y="190" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">200</text><text x="60" y="154" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">300</text><text x="60" y="118" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">400</text><text x="60" y="82" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">500</text><text x="60" y="46" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">600</text><g data-tip="منحنى اللاحمل لمولد مثال (3-1)، الشكل (3-19) ص 114: الجهد الداخلي ⟦EPh⟧ مقابل تيار المجال ⟦IF⟧."><path d="M66.0 258.0 L72.5 247.2 L79.0 236.4 L85.5 225.6 L92.0 214.8 L98.5 204.0 L105.0 193.1 L111.5 182.3 L118.0 171.6 L124.5 160.9 L131.0 150.2 L137.5 139.8 L144.0 130.2 L150.5 121.5 L157.0 113.6 L163.5 106.0 L170.0 98.5 L176.5 91.5 L183.0 85.2 L189.5 80.3 L196.0 76.2 L202.5 72.5 L209.0 69.1 L215.5 65.8 L222.0 62.5 L228.5 60.1 L235.0 58.0 L241.5 56.2 L248.0 54.6 L254.5 53.2 L261.0 51.9 L267.5 50.9 L274.0 49.9 L280.5 49.1 L287.0 48.5 L293.5 47.9 L300.0 47.4 L306.5 46.9 L313.0 46.5 L319.5 46.0 L326.0 45.6" fill="none" stroke="transparent" stroke-width="14"/><path d="M66.0 258.0 L72.5 247.2 L79.0 236.4 L85.5 225.6 L92.0 214.8 L98.5 204.0 L105.0 193.1 L111.5 182.3 L118.0 171.6 L124.5 160.9 L131.0 150.2 L137.5 139.8 L144.0 130.2 L150.5 121.5 L157.0 113.6 L163.5 106.0 L170.0 98.5 L176.5 91.5 L183.0 85.2 L189.5 80.3 L196.0 76.2 L202.5 72.5 L209.0 69.1 L215.5 65.8 L222.0 62.5 L228.5 60.1 L235.0 58.0 L241.5 56.2 L248.0 54.6 L254.5 53.2 L261.0 51.9 L267.5 50.9 L274.0 49.9 L280.5 49.1 L287.0 48.5 L293.5 47.9 L300.0 47.4 L306.5 46.9 L313.0 46.5 L319.5 46.0 L326.0 45.6" fill="none" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="(و) حمل ⟦0.8⟧ متقدم: يلزم ⟦EPh = 451 V⟧ فيُضبط تيار المجال عند ⟦4.1 A⟧."><path d="M66 95.6H172.6V258" fill="none" stroke="#2E8C83" stroke-width="2" stroke-dasharray="5 4"/><circle cx="172.6" cy="95.6" r="6.5" fill="#2E8C83" stroke="#FBF6EE" stroke-width="2"/><rect x="164.6" y="87.6" width="16" height="16" fill="transparent"/></g><g data-tip="(ب) اللاحمل: ⟦EPh = VPh = 480 V⟧ فتيار المجال ⟦4.5 A⟧."><path d="M66 85.2H183.0V258" fill="none" stroke="#C99A1E" stroke-width="2" stroke-dasharray="5 4"/><circle cx="183.0" cy="85.2" r="6.5" fill="#C99A1E" stroke="#FBF6EE" stroke-width="2"/><rect x="175.0" y="77.2" width="16" height="16" fill="transparent"/></g><g data-tip="(جـ) حمل ⟦0.8⟧ متأخر: يلزم ⟦EPh = 532 V⟧ فيُرفع تيار المجال إلى ⟦5.7 A⟧. وهو أيضاً جهد الأطراف في (هـ) إذا فُصل الحمل فجأة."><path d="M66 66.5H214.2V258" fill="none" stroke="#E8735A" stroke-width="2" stroke-dasharray="5 4"/><circle cx="214.2" cy="66.5" r="6.5" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/><rect x="206.2" y="58.5" width="16" height="16" fill="transparent"/></g><text x="224" y="84" font-size="11.5" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">532</text><text x="193" y="101" font-size="11.5" fill="#8A6A10" font-weight="700" direction="ltr" font-family="var(--mono)">480</text><text x="165" y="114" text-anchor="end" font-size="11.5" fill="#1F6F68" font-weight="700" direction="ltr" font-family="var(--mono)">451</text><text x="322" y="294" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="3">F</tspan><tspan dy="-3"> (A)</tspan></text><text x="70" y="28" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="3">Ph</tspan><tspan dy="-3"> (V)</tspan></text></svg>`,
   cap:'منحنى اللاحمل كالشكل <span class="ltr">(3-19)</span> ص 114 (أعيد رسمه من قراءات تقريبية للشكل المطبوع، والنقاط الثلاث من حل الكتاب). الأصفر = اللاحمل، والبرتقالي = الحمل المتأخر، والفيروزي = الحمل المتقدم.<br><b>مرّر المؤشر على النقاط الثلاث (أو المسها في الجوال) لتعرف ماذا تمثل كل نقطة.</b>',
   side:[
    {book:String.raw`<p>مولد تزامني ذو أربعة أقطاب ملفاته موصلة على شكل دلتا، جهد الأطراف له <span class="ltr">480 V</span> والتردد <span class="ltr">60 Hz</span>، منحنى اللاحمل موضح في الشكل (3-19)، الممانعة التزامنية له <span class="ltr">0.1 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.015 Ω</span>، عند الحمل الكامل يعطي تياراً مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، فإذا كانت مفاقيد الاحتكاك <span class="ltr">40 kw</span> والمفاقيد الحديدية <span class="ltr">30 kw</span> عند الحمل الكامل احسب ما يلي:</p>
     <p>أ) سرعة العضو الدوار<br>ب) تيار المجال لكي يحافظ المولد على جهد الأطراف عند <span class="ltr">480 V</span><br>جـ) تيار المجال لكي يحافظ المولد على جهد الأطراف عند <span class="ltr">480 V</span> إذا كان يغذي حمل بتيار مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر<br>د) كفاءة المولد<br>هـ) جهد الأطراف إذا فصل الحمل عن المولد فجأة<br>و) تيار المجال لكي يبقى جهد الأطراف عند <span class="ltr">480 V</span> إذا كان المولد يغذي حمل بتيار قدره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متقدم</p>`,ref:'ص 114'}
   ],
   body:[
    {book:String.raw`<p>بما أن ملفات المولد موصلة على شكل دلتا إذاً: \(V_{Ph}=V_{Line}\) و\(I_{Ph}=\dfrac{I_{Line}}{\sqrt3}\)</p>
     <p>ب) عند عدم الحمل \(I_{Ph}=0\) وبالتالي فإن \(V_{Ph}=E_{Ph}\)، وبعد الرجوع إلى منحنى اللاحمل للمولد في الشكل (3-19) نجد أن تيار المجال المقابل هو <b><span class="ltr">4.5 A</span></b>.</p>
     <p>جـ) … لكي يبقى جهد الأطراف \(V_{Ph}\) عند <span class="ltr">480 V</span> يجب أن نضبط الجهد الداخلي \(E_{Ph}\) عند <span class="ltr">532 V</span>، ولكي يتحقق ذلك يجب زيادة تيار المجال \(I_F\) إلى <b><span class="ltr">5.7 A</span></b> طبقاً لمنحنى الدائرة المفتوحة للمولد الموضح في الشكل (3-19).</p>
     <p>هـ) إذا فصل الحمل بشكل مفاجئ عن المولد يعني أن التيار سيصبح صفراً، وهذا يعني أن \((E_{Ph}=V_{Ph})\) طبقاً للمعادلة (3-9)، وإذا لم يعاد ضبط تيار المجال فإن جهد الأطراف سيرتفع إلى قيمة الجهد الداخلي أي أن \((V_{Ph}=532\ \text{V})\).</p>
     <p>و) … إذاً لكي يبقى جهد الأطراف \(V_{Ph}\) عند <span class="ltr">480 V</span> عندما يكون معامل القدرة <span class="ltr">0.8</span> متقدماً يجب أن يضبط الجهد الداخلي \(E_{Ph}\) عند <span class="ltr">451 V</span> وذلك بضبط تيار المجال عند <b><span class="ltr">4.1 A</span></b>.</p>`,ref:'ص 114–116'},
    {html:String.raw`<div class="exl"><div class="exc"><header>نتائج مثال (3-1) <span class="ref">ص 114–116</span></header>
      <div class="kv-row"><small>أ، ب</small><span class="kv res ltr">\(n=1800\ \text{rpm}\)</span><span class="kv res ltr">\(I_F=4.5\ \text{A}\)</span></div>
      <div class="kv-row"><small>جـ</small><span class="kv ltr">\(I_{Ph}=692.8\ \text{A}\)</span><span class="kv res ltr">\(E_{Ph}=532\angle5.3^\circ\ \text{V}\)</span><span class="kv res ltr">\(I_F=5.7\ \text{A}\)</span></div>
      <div class="kv-row"><small>د</small><span class="kv ltr">\(P_o=798\ \text{kW}\)</span><span class="kv ltr">\(P_{cu1}=21.6\ \text{kW}\)</span><span class="kv ltr">\(P_{in}=889.6\ \text{kW}\)</span><span class="kv res ltr">\(\eta=89.7\%\)</span></div>
      <div class="kv-row"><small>هـ، و</small><span class="kv res ltr">\(V_{Ph}=532\ \text{V}\)</span><span class="kv ltr">\(E_{Ph}=451\angle7.9^\circ\ \text{V}\)</span><span class="kv res ltr">\(I_F=4.1\ \text{A}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل الكامل في «الأمثلة المحلولة»</button></div></div>`},
    {predict:{q:String.raw`المولد يغذي الحمل المتأخر وتيار مجاله <span class="ltr">5.7 A</span>، ثم فُصل الحمل فجأة ولم يغيّر أحد تيار المجال. كم يصبح جهد الأطراف؟`,opts:[
     [String.raw`<span class="ltr">480 V</span> كما كان`,false,String.raw`الـ <span class="ltr">480 V</span> كانت نتيجة طرح هبوط الجهد على \(R_A\) و\(X_S\)، وهذا الهبوط يختفي عندما يصبح التيار صفراً.`],
     [String.raw`<span class="ltr">532 V</span>`,true,String.raw`الكتاب (هـ): التيار يصبح صفراً فيكون \(V_{Ph}=E_{Ph}\) من (3-9)، والجهد الداخلي عند <span class="ltr">5.7 A</span> هو <span class="ltr">532 V</span>.`],
     [String.raw`<span class="ltr">451 V</span>`,false,String.raw`<span class="ltr">451 V</span> هو الجهد الداخلي المطلوب للحمل المتقدم في (و)، لا علاقة له بفصل الحمل.`]]}},
    {watch:String.raw`<p>رقم الشكل (3-19) مكرر في الكتاب: «جهاز التزامن» ص 113 و«منحنى اللاحمل» هذا ص 114، ونص المثال وحله يقصدان منحنى اللاحمل. وفي نص المثال ص 114 جاءت عبارة «كم يجب أن يكون» في آخر الفقرة (جـ) في غير موضعها، وفي (و) «معامل قدره» والمقصود «معامل قدرة»؛ كُتب النص هنا مرتباً.</p>`,fix:true},
    {tip:String.raw`<p>لاحظ الترتيب: نحسب \(E_{Ph}\) المطلوب من المعادلة (3-9) (أو المخطط الاتجاهي)، ثم ننتقل إلى <b>منحنى اللاحمل</b> لنقرأ تيار المجال الذي يعطي هذا الجهد. الحمل المتأخر يحتاج أكبر تيار مجال <span class="ltr">(5.7 A)</span>، والمتقدم أقلّه <span class="ltr">(4.1 A)</span> — كما توقعنا من المخطط الاتجاهي في الدرس الثالث.</p>`,title:'طريقة الحل في سطرين'}
   ]},

  {st:2,short:'مثال (3-2)',title:'مثال <span class="ltr">(3-2)</span>: جهد الأطراف في ثلاث حالات تحميل',ref:'ص 117–121',
   q:'تيار المجال ثابت والجهد الداخلي ثابت… فهل يبقى جهد الأطراف ثابتاً إذا غيّرنا نوع الحمل فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة مخططات اتجاهية لمثال ثلاثة-اثنين: الجهد الداخلي ثابت مئتان وسبعة وسبعون فولت، وجهد الأطراف مئتان وستة وثلاثون فاصلة ثمانية ثم مئتان وسبعون فاصلة أربعة ثم ثلاثمئة وثمانية فاصلة ثمانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="140" fill="#DDEFE6"/><path d="M24 136H336M24 228H336" stroke="#CFC6B4" stroke-width="1.5"/><g data-tip="جهد الأطراف ⟦Vph = 236.8 V⟧ في الحالة (1)."><line x1="36.0" y1="92.0" x2="166.2" y2="92.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="92.0" x2="155.2" y2="92.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="166.2,92.0 155.2,97.0 155.2,87.0" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph = 60 A⟧ متأخر ⟦36.87°⟧."><line x1="36.0" y1="92.0" x2="68.0" y2="116.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="92.0" x2="60.8" y2="110.6" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="68.0,116.0 58.4,113.8 63.2,107.4" fill="#E8735A"/></g><g data-tip="⟦jXS·Iph⟧: مقداره ⟦1 × 60 = 60 V⟧، ومركّبتاه ⟦XS·Iph·sinθ = 36 V⟧ و⟦XS·Iph·cosθ = 48 V⟧."><line x1="166.2" y1="92.0" x2="186.0" y2="65.6" stroke="transparent" stroke-width="14"/><line x1="166.2" y1="92.0" x2="180.6" y2="72.8" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="186.0,65.6 183.9,75.2 177.4,70.4" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ثابت ⟦EPh = 277 V⟧ في الحالات الثلاث (ضُبط تيار المجال عند اللاحمل)."><line x1="36.0" y1="92.0" x2="186.0" y2="65.6" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="92.0" x2="175.2" y2="67.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="186.0,65.6 176.1,72.4 174.3,62.6" fill="#12855A"/></g><text x="174" y="108" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">236.8</text><text x="306" y="78" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">(1)</text><g data-tip="جهد الأطراف ⟦Vph = 270.4 V⟧ في الحالة (2)."><line x1="36.0" y1="184.0" x2="184.7" y2="184.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="184.0" x2="173.7" y2="184.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="184.7,184.0 173.7,188.9 173.7,179.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph = 60 A⟧ في نفس طور الجهد."><line x1="36.0" y1="184.0" x2="76.0" y2="184.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="184.0" x2="67.0" y2="184.0" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="76.0,184.0 67.0,188.1 67.0,179.9" fill="#E8735A"/></g><g data-tip="⟦jXS·Iph = 60 V⟧ رأسي."><line x1="184.7" y1="184.0" x2="184.7" y2="151.0" stroke="transparent" stroke-width="14"/><line x1="184.7" y1="184.0" x2="184.7" y2="160.0" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="184.7,151.0 188.8,160.0 180.7,160.0" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ثابت ⟦EPh = 277 V⟧ في الحالات الثلاث (ضُبط تيار المجال عند اللاحمل)."><line x1="36.0" y1="184.0" x2="184.7" y2="151.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="184.0" x2="174.0" y2="153.4" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="184.7,151.0 175.1,158.2 172.9,148.6" fill="#12855A"/></g><text x="193" y="200" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">270.4</text><text x="306" y="170" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">(2)</text><g data-tip="جهد الأطراف ⟦Vph = 308.8 V⟧ في الحالة (3)."><line x1="36.0" y1="272.0" x2="205.8" y2="272.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="272.0" x2="194.8" y2="272.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="205.8,272.0 194.8,276.9 194.8,267.1" fill="#2C4A40"/></g><g data-tip="التيار ⟦Iph = 60 A⟧ متقدم ⟦36.87°⟧."><line x1="36.0" y1="272.0" x2="68.0" y2="248.0" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="272.0" x2="60.8" y2="253.4" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="68.0,248.0 63.2,256.6 58.4,250.2" fill="#E8735A"/></g><g data-tip="⟦jXS·Iph⟧: مقداره ⟦1 × 60 = 60 V⟧، ومركّبتاه ⟦XS·Iph·sinθ = 36 V⟧ و⟦XS·Iph·cosθ = 48 V⟧."><line x1="205.8" y1="272.0" x2="186.0" y2="245.6" stroke="transparent" stroke-width="14"/><line x1="205.8" y1="272.0" x2="191.4" y2="252.8" stroke="#2E8C83" stroke-width="3" stroke-linecap="round"/><polygon points="186.0,245.6 194.7,250.4 188.2,255.2" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ثابت ⟦EPh = 277 V⟧ في الحالات الثلاث (ضُبط تيار المجال عند اللاحمل)."><line x1="36.0" y1="272.0" x2="186.0" y2="245.6" stroke="transparent" stroke-width="14"/><line x1="36.0" y1="272.0" x2="175.2" y2="247.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><polygon points="186.0,245.6 176.1,252.4 174.3,242.6" fill="#12855A"/></g><text x="214" y="288" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">308.8</text><text x="306" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">(3)</text>
<text x="306" y="96" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">متأخر</text><text x="306" y="188" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">مادي</text><text x="306" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">متقدم</text>
<text x="180" y="306" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الأخضر ثابت… والداكن يتغير</text></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(3-20)</span> بمقياس واحد لأرقام المثال: الأخضر <span class="ltr">E<sub>Ph</sub> = 277 V</span> ثابت، والداكن جهد الأطراف بالفولت.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف قيمة كل منها.</b>',
   side:[
    {book:String.raw`<p>مولد تزامني ذو ستة أقطاب ملفاته موصلة على شكل نجمة جهد الأطراف له <span class="ltr">480 V</span> عند تردد <span class="ltr">60 Hz</span>، الممانعة التزامنية <span class="ltr">1Ω</span> لكل وجه ومقاومة ملفات المنتج مهملة، تيار الحمل الكامل له <span class="ltr">60 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، مفاقيد الاحتكاك <span class="ltr">1.5 kw</span> والمفاقيد الحديدية <span class="ltr">1 kw</span> عند الحمل الكامل، وبما أن مقاومة ملفات المنتج مهملة افترض أن المفاقيد النحاسية في ملفات المنتج مهملة أيضاً، تيار المجال ضبط بحيث يكون جهد الأطراف <span class="ltr">480 V</span> عند عدم الحمل. احسب ما يلي:</p>
     <p>أ) سرعة دوران هذا المولد<br>ب) جهد الأطراف عند الحمل الكامل في الحالات التالية: 1- معامل القدرة 0.8 متأخر، 2- معامل القدرة 1.0، 3- معامل القدرة 0.8 متقدماً<br>جـ) كفاءة المولد عند الحمل الكامل إذا كان معامل القدرة 0.8 متأخر<br>د) العزم الداخل إلى المولد<br>هـ) معامل تنظيم الجهد في حالات التحميل الثلاث المذكورة في الفقرة (ب)</p>`,ref:'ص 117'}
   ],
   body:[
    {book:String.raw`<p>ب) لحساب جهد الأطراف عند تحميل المولد يستحسن استخدام المخطط الاتجاهي لذلك بدلاً من استخدام المعادلة (3-9) لأنها في هذه الحالة ستحتوي على مجهولين هما زاوية الجهد الداخلي \((\delta)\) بالإضافة إلى جهد الأطراف \(V_{Ph}\).</p>
     <p>بما أن ملفات المولد موصلة على شكل نجمة: \(V_{ph}=\dfrac{V_L}{\sqrt3}\)، \(I_{ph}=I_L\)، وعند عدم الحمل: \(V_{Ph}=E_{Ph}=\dfrac{480}{\sqrt3}=277\ \text{V}\)</p>
     <p><b>الحالة (1):</b> … بالرجوع إلى المخطط الاتجاهي وباعتبار المثلث القائم الزاوية oab يمكن حساب جهد الأطراف:</p>
     <div class="eq">$$E_{Ph}^2=(V_{Ph}+X_SI_{Ph}\sin\theta)^2+(X_SI_{Ph}\cos\theta)^2$$</div>
     <div class="eq">$$\begin{aligned}(277)^2&=(V_{Ph}+1.0\times60\times\sin36.87)^2+(1.0\times60\times\cos36.87)^2\\76729&=(V_{Ph}+36)^2+2304\\74425&=(V_{Ph}+36)^2\\272.8&=V_{Ph}+36\\V_{Ph}&=236.8\ \text{V}\end{aligned}$$</div>
     <p>\(V_L=\sqrt3\,V_{ph}=\sqrt3\times236.8=410\ \text{V}\)</p>
     <p><b>الحالة (2):</b> \(E_{Ph}^2=V_{Ph}^2+(X_SI_{Ph})^2\) … \(V_{Ph}=270.4\ \text{V}\)، \(V_L=\sqrt3\times270.4=468.4\ \text{V}\)</p>
     <p><b>الحالة (3):</b> \(E_{Ph}^2=(V_{Ph}-X_SI_{Ph}\sin\theta)^2+(X_SI_{Ph}\cos\theta)^2\) … \(V_{Ph}=308.8\ \text{V}\)، \(V_L=\sqrt3\times308.8=535\ \text{V}\)</p>`,ref:'ص 118–120'},
    {html:String.raw`<div class="exl"><div class="exc"><header>بقية نتائج مثال (3-2) <span class="ref">ص 117–121</span></header>
      <div class="kv-row"><small>أ</small><span class="kv res ltr">\(n=1200\ \text{rpm}\)</span></div>
      <div class="kv-row"><small>جـ</small><span class="kv ltr">\(P_o=34.1\ \text{kW}\)</span><span class="kv ltr">\(P_{in}=36.6\ \text{kW}\)</span><span class="kv res ltr">\(\eta=93.2\%\)</span></div>
      <div class="kv-row"><small>هـ</small><span class="kv res ltr">\(17.1\%\)</span><span class="kv res ltr">\(2.6\%\)</span><span class="kv res ltr">\(-10.3\%\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل الكامل في «الأمثلة المحلولة»</button></div></div>`},
    {title:'العزم الداخل في مثال (3-2) د',widget:(el,B)=>{
      let v='book';
      const draw=()=>{el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg"><button type="button" data-v="book" aria-pressed="${v==='book'}">كما في الكتاب</button><button type="button" data-v="fixed" aria-pressed="${v==='fixed'}">المصحح</button></span></div>
        <div class="callout${v==='book'?' err':''}" style="margin-top:8px">${B.tex('\\omega=\\frac{2\\pi n}{60}=\\frac{2\\pi\\times1200}{60}=125.7\\ rad/s',true)}${B.tex(v==='book'?'T_{in}=\\frac{36.6\\times10^3}{125.7}=191.2\\ Nm':'T_{in}=\\frac{36.6\\times10^3}{125.7}=291.2\\ Nm',true)}${v==='book'?'هذا الرقم مطبوع في الكتاب (ص 121)، والقسمة خاطئة.':'<span class="fixnote">القسمة الصحيحة: <span class="ltr">36600 ÷ 125.7 = 291.17 ≈ 291.2 N·m</span>.</span>'}</div>`;
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()})};
      draw();
    }},
    {watch:String.raw`<p>في (جـ) ص 120 طُبع \(P_o=3\times308.8\times60\times0.8=34.1\ \text{kW}\)، والعدد المقصود 236.8 (جهد حالة <span class="ltr">0.8</span> متأخر)، والناتج <span class="ltr">34.1 kW</span> صحيح له؛ أما 308.8 فتعطي <span class="ltr">44.47 kW</span>. وفي (هـ) ص 121 حُسبت الحالة (2) بالجهد 468 بدل 468.4 فطُبع <span class="ltr">2.6%</span>، وبالجهد 468.4 تكون <span class="ltr">2.48%</span>.</p>`,fix:true},
    {predict:{q:String.raw`في الحالة (3) صار جهد الأطراف <span class="ltr">308.8 V</span> أكبر من الجهد الداخلي <span class="ltr">277 V</span>. لماذا؟`,opts:[
     ['لأن تيار المجال زاد في هذه الحالة',false,'تيار المجال ثابت في المثال كله؛ ضُبط مرة واحدة عند اللاحمل.'],
     ['لأن الحمل سعوي (التيار متقدم)، فيتجه هبوط الجهد على الممانعة التزامنية إلى الخلف',true,String.raw`كما رأيت في الشكل (3-9) الحالة (c): مع التيار المتقدم قد يكون \(E_{ph}\) أصغر من \(V_{ph}\). ولهذا خرج معامل التنظيم سالباً <span class="ltr">(−10.3%)</span>.`],
     ['لأن مقاومة المنتج أُهملت',false,'المقاومة مهملة في الحالات الثلاث، والفرق جاء من نوع الحمل.']]}}
   ]},

  {st:3,short:'أسئلة الفصل الأول',title:'أسئلة وتمارين الفصل الأول',ref:'ص 106',
   q:'هل تستطيع أن تجيب عن أسئلة الكتاب بكلماتك قبل أن تفتح الإجابة المقترحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مجموعات لأسئلة الفصل الأول: التسمية والتحكم، رد فعل المنتج والدائرة المكافئة، الاختبارات وتنظيم الجهد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/>
<g data-tip="الأسئلة 1–4: سبب التسمية، والتحكم في القوة الدافعة الكهربائية، والتحكم في التردد (الدرس الأول)."><rect x="56" y="44" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="56" width="56" height="38" rx="10" fill="#E8735A"/><text x="264" y="81" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1–4</text><text x="146" y="81" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">التسمية والتحكم</text></g>
<g data-tip="الأسئلة 5–8: رد فعل المنتج، والممانعة التزامنية، والدائرة المكافئة التقريبية، والمخطط الاتجاهي (الدرسان الثاني والثالث)."><rect x="56" y="122" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="134" width="56" height="38" rx="10" fill="#F2C14E"/><text x="264" y="159" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5–8</text><text x="146" y="159" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">الدائرة والمخطط</text></g>
<g data-tip="الأسئلة 9–13: التشبع، وحدود تيار المجال في الاختبارين، ومعامل تنظيم الجهد (الدرس الرابع)."><rect x="56" y="200" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="212" width="56" height="38" rx="10" fill="#4FB3A9"/><text x="264" y="237" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">9–13</text><text x="146" y="237" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">الاختبارات والتنظيم</text></g>
<text x="180" y="292" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">ثلاث مجموعات من الأسئلة</text></svg>`,
   cap:'أسئلة الفصل الأول مقسمة حسب الدروس التي تجيب عنها.<br><b>مرّر المؤشر على كل مجموعة (أو المسها في الجوال) لتعرف موضوعها.</b>',
   side:[
    {book:String.raw`<ol><li>ممَّ اكتسبت الآلة التزامنية تسميتها؟</li><li>كيف يمكن التحكم في مقدار القوة الدافعة الكهربائية المتولدة في ملفات المنتج؟</li><li>هل من المناسب زيادة القوة الدافعة الكهربائية المتولدة في ملفات المنتج عن طريق زيادة سرعة الدوران؟</li><li>كيف يمكن التحكم في تردد الآلة التزامنية؟</li><li>ما المقصود برد فعل المنتج؟</li><li>ما هي الممانعة التزامنية؟</li><li>ارسم الدائرة المكافئة التقريبية للآلة التزامنية، واذكر الأساس الذي تم عليه التقريب؟</li><li>ارسم المخطط الاتجاهي للآلة التزامنية المصاحب للدائرة المكافئة التقريبية في حالة الأحمال الثلاثة (حمل مادي، حمل حثي و حمل سعوي)</li><li>ما المقصود بالتشبع المغناطيسي في الحديد؟</li><li>إلى أي مدى يمكن زيادة تيار المجال في اختباري عدم الحمل و الدائرة المقصورة؟</li><li>ما هو معامل تنظيم الجهد؟</li><li>ما أهمية معرفة معامل تنظيم الجهد للمولد؟</li><li>أيهما أفضل أن يكون معامل تنظيم الجهد كبيراً أم صغيراً؟</li></ol>`,ref:'ص 106'}
   ],
   body:[
    {predict:{q:'السؤال 3: هل من المناسب زيادة القوة الدافعة الكهربائية عن طريق زيادة سرعة الدوران؟',opts:[
     ['نعم، لأن الجهد يتناسب مع السرعة',false,'صحيح أن الجهد يعتمد على السرعة، لكن هذا ليس كل الجواب.'],
     ['لا، لأن زيادة السرعة تغيّر التردد أيضاً، والتردد يجب أن يبقى ثابتاً',true,String.raw`من (3-1): \(f=np/120\). والكتاب ص 96: السرعة «يجب أن تكون ثابتة للحصول على تردد ثابت»، فالتحكم يكون بتيار المجال.`],
     ['لا، لأن السرعة لا تؤثر في الجهد إطلاقاً',false,'السرعة تؤثر في الجهد (عبر التردد في المعادلة 3-2)، لكنها تؤثر في التردد أيضاً.']]}},
    {tip:String.raw`<p class="sub">الكتاب لا يعطي إجابات. حاول أولاً، ثم افتح الإجابة المقترحة.</p>
     <details class="sg-q"><summary>إجابة السؤال 1</summary><div class="sg-ans">من «التزامن أو التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار» (ص 92)، ولذلك تسمى أيضاً الآلة التوافقية.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 2</summary><div class="sg-ans">بالتحكم في شدة المجال المغناطيسي، أي <b>بتغيير قيمة التيار المستمر الداخل إلى ملفات العضو الدوار</b> (تيار المجال). هذا هو «الخيار الوحيد» لأن السرعة يجب أن تبقى ثابتة (ص 96).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 3</summary><div class="sg-ans">لا. صحيح أن القوة الدافعة تعتمد على السرعة، لكن زيادة السرعة تغير التردد أيضاً (\(f=np/120\))، والسرعة «يجب أن تكون ثابتة للحصول على تردد ثابت» (ص 96).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 4</summary><div class="sg-ans">التردد يعتمد على سرعة العضو الدوار وعدد الأقطاب (المعادلة 3-1). وعدد الأقطاب ثابت في الآلة، فيُتحكم في التردد بسرعة دوران المحرك الأولي (ص 96، وخطوة التزامن 2 ص 112).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 5</summary><div class="sg-ans">عند التحميل تمر في الأوجه الثلاثة تيارات بينها 120° فتولد <b>مجالاً مغناطيسياً دواراً في العضو الثابت</b> يدور بنفس سرعة واتجاه مجال الدوار؛ هذا المجال هو رد فعل المنتج، وهو يشوه الفيض في الثغرة الهوائية وينتج جهداً \(E_{AR}=-jXI_{ph}\) (ص 97–98).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 6</summary><div class="sg-ans">ممانعة حثية واحدة تجمع ممانعة رد فعل المنتج \(X\) وممانعة التسرب الحثية لملفات المنتج \(X_A\): \(X_S=X+X_A\) (المعادلة 3-8 ص 99).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 7</summary><div class="sg-ans">الدائرة: المصدر \(E_{ph}\) على التوالي مع \(jX_S\) ثم الحمل وعليه \(V_{ph}\) (الشكل 3-8، المحطة الرابعة في الدرس الثاني)، ومعادلتها \(V_{ph}=E_{ph}-jX_SI_{ph}\) (3-10). أساس التقريب: <b>إهمال مقاومة ملفات المنتج لأنها صغيرة مقارنة بالممانعة التزامنية خصوصاً في المولدات الكبيرة</b> (ص 100).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 8</summary><div class="sg-ans">مثل الشكل (3-9) لكن بدون السهم \(I_{ph}R_A\): \(V_{ph}\) أفقي مرجعاً، ومن رأسه \(jX_SI_{ph}\) عمودي على التيار، و\(E_{ph}\) من الأصل إلى رأسه. (a) مادي: \(jX_SI\) رأسي. (b) حثي: \(E\) أطول بكثير من \(V\). (c) سعوي: قد يكون \(E\) أقصر من \(V\). (ارسمه بالتجربة التفاعلية في الدرس الثالث.)</div></details>
     <details class="sg-q"><summary>إجابة السؤال 9</summary><div class="sg-ans">في المنطقة (2) من منحنى اللاحمل يزداد الفيض فتزداد ممانعة الحديد المغناطيسية، أي أن الحديد «بدأ يصل إلى حالة التشبع»، فيتناقص معدل ارتفاع الجهد مقابل زيادة تيار المجال (ص 103).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 10</summary><div class="sg-ans"><b>في اختبار القصر:</b> حتى يصل تيار القصر إلى قيمته المقننة فقط، لأن الكتاب ينص: «يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة» (ص 103). <b>في اختبار اللاحمل:</b> الكتاب لا يحدد حداً؛ يزاد تيار المجال تدريجياً من الصفر حتى تظهر منطقة التشبع (المنطقة 2) في المنحنى (ص 101–103). <span class="sg-tag">من خارج الكتاب</span> وعملياً لا يُتجاوز كثيراً جهد الآلة المقنن.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 11</summary><div class="sg-ans">«التغير في جهد الأطراف من حالة اللاحمل إلى حالة الحمل الكامل منسوباً إلى قيمة الجهد في حالة الحمل الكامل»: \(V_R\%=\frac{E_{ph}-V_{ph}}{V_{ph}}\times100\) (3-13 ص 105).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 12</summary><div class="sg-ans">يعطي فكرة واضحة عن مدى تغير جهد الأطراف عند تحميل الآلة أو عند تغير الأحمال بشكل كبير، ويعتبر مؤشراً جيداً للدلالة على جودة المولد (ص 105).</div></details>
     <details class="sg-q"><summary>إجابة السؤال 13</summary><div class="sg-ans"><b>صغيراً.</b> المعامل الصغير يعني أن جهد الأطراف يتغير قليلاً بين اللاحمل والحمل الكامل، فيبقى الجهد عند المستهلك قريباً من قيمته مع تغير الأحمال. (استنتاج من تعريف الكتاب ص 105.)</div></details>`,title:'إجابات مقترحة (ليست من الكتاب)'}
   ]},

  {st:4,short:'أسئلة الفصل الثاني',title:'أسئلة وتمارين الفصل الثاني',ref:'ص 122–123',
   q:'سبعة أسئلة نظرية وأربعة تمارين حسابية… أيّها تستطيع حله الآن بطريقة مثالي الكتاب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مجموعات لأسئلة الفصل الثاني: التوازي وشروطه، ما بعد الربط بالقضيب اللانهائي، التمارين الحسابية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الأسئلة 1–4: لماذا التوازي، وشروط الربط، ومخاطر مخالفتها، والقضيب اللانهائي (الدرس السادس)."><rect x="56" y="44" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="56" width="56" height="38" rx="10" fill="#E8735A"/><text x="264" y="81" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1–4</text><text x="146" y="81" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">التوازي وشروطه</text></g>
<g data-tip="الأسئلة 5–7: السرعة واتجاه القدرة وفقد التزامن بعد الربط. الكتاب لا يشرح ذلك مباشرة؛ نجيب عنها من المعادلة (3-15) والشكل (3-16)."><rect x="56" y="122" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="134" width="56" height="38" rx="10" fill="#F2C14E"/><text x="264" y="159" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5–7</text><text x="146" y="159" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">بعد الربط</text></g>
<g data-tip="التمارين 8–11: حسابات بطريقة مثالي الكتاب (3-1) و(3-2). الكتاب لا يعطي إجاباتها."><rect x="56" y="200" width="248" height="62" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="236" y="212" width="56" height="38" rx="10" fill="#4FB3A9"/><text x="264" y="237" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">8–11</text><text x="146" y="237" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">تمارين حسابية</text></g>
<text x="180" y="292" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600">ثلاث مجموعات من الأسئلة</text></svg>`,
   cap:'أسئلة الفصل الثاني مقسمة حسب موضوعها.<br><b>مرّر المؤشر على كل مجموعة (أو المسها في الجوال) لتعرف موضوعها.</b>',
   side:[
    {book:String.raw`<ol><li>لماذا يفضل ربط المولدات التزامنية على التوازي؟</li><li>ما شروط ربط المولدات التزامنية على التوازي؟</li><li>ما مخاطر توصيل المولد التزامني على التوازي بدون تحقق شرط أو أكثر من شروط التزامن؟</li><li>ما المقصود بالقضيب اللانهائي؟</li><li>بعد توصيل المولد بالقضيب اللانهائي، هل يمكن التحكم في سرعة المولد؟</li><li>بعد توصيل المولد بالقضيب اللانهائي، هل القدرة تنتقل من المولد إلى القضيب أو العكس؟</li><li>متى تفقد الآلة التزامن؟</li></ol>`,ref:'ص 122'}
   ],
   body:[
    {book:String.raw`<ol start="8"><li>مولد تزامني ثلاثي الأوجه <span class="ltr">10MW</span> ملفاته موصلة على شكل نجمة، جهد أطرافه <span class="ltr">11kV</span> والتردد <span class="ltr">60 Hz</span>، ممانعته التزامنية <span class="ltr">0.66 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.1 Ω</span>، احسب الجهد الداخلي \(E_{Ph}\) عند الحمل الكامل و معامل قدرة <span class="ltr">0.85</span> متأخر</li>
     <li>مولد تزامني ثلاثي الأوجه <span class="ltr">180 kVA</span> ملفاته موصلة على شكل دلتا، جهد أطرافه <span class="ltr">220 V</span> والتردد <span class="ltr">50 Hz</span>، ممانعته التزامنية <span class="ltr">0.07 Ω</span> و مقاومة ملفات المنتج <span class="ltr">0.016 Ω</span>، احسب الجهد الداخلي \(E_{Ph}\) عند الحمل الكامل و معامل قدرة: أ) <span class="ltr">0.72</span> متأخر، ب) <span class="ltr">0.72</span> متقدماً، جـ) مساوياً للواحد</li>
     <li>مولد تزامني ذو قطبين ملفاته موصلة على شكل نجمة، جهد الأطراف له <span class="ltr">2300 V</span> والتردد <span class="ltr">60 Hz</span>، اختبار الدائرة المفتوحة له أعطى القراءات الموضحة في الجدول التالي:
      <div class="sg-tbl"><table><tbody><tr><th>I<sub>F</sub> (A)</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><th>E<sub>Ph</sub> (V)</th><td>600</td><td>1200</td><td>1800</td><td>2230</td><td>2520</td><td>2700</td><td>2800</td><td>2850</td></tr></tbody></table></div>
      ممانعته التزامنية <span class="ltr">1.1 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.15 Ω</span>، عند الحمل الكامل يعطي تياراً مقداره <span class="ltr">250 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، فإذا كانت مفاقيد الاحتكاك <span class="ltr">24 kw</span> و المفاقيد الحديدية <span class="ltr">18 kw</span> عند الحمل الكامل: أ) ارسم منحنى الدائرة المفتوحة للمولد ب) كم يجب أن يكون تيار المجال لكي يكون جهد الأطراف <span class="ltr">2300 V</span> بدون حمل جـ) إذا كان المولد يغذي حملاً بتيار مقداره <span class="ltr">250 A</span> عند معامل قدرة <span class="ltr">0.85</span> متأخر، كم يجب أن يكون تيار المجال لكي يحافظ على جهد الأطراف عند <span class="ltr">2300 V</span> د) احسب القدرة الداخلة للمولد هـ) افترض أن المولد يغذي حملاً بتيار مقداره <span class="ltr">250 A</span> عند معامل قدرة <span class="ltr">0.8</span> متقدماً، كم يجب أن يكون تيار المجال لكي يبقى جهد الأطراف عند <span class="ltr">2300 V</span></li>
     <li>مولد تزامني ذو أربعة أقطاب ملفاته موصلة على شكل دلتا جهد أطرافه <span class="ltr">280V</span> عند تردد <span class="ltr">60 Hz</span>، الممانعة التزامنية <span class="ltr">1.05 Ω</span> لكل وجه و مقاومة ملفات المنتج مهملة، تيار حمله الكامل <span class="ltr">100 A</span> عند معامل قدرة <span class="ltr">0.78</span> متأخر و مفاقيد الاحتكاك <span class="ltr">1.75 kw</span> والمفاقيد الحديدية <span class="ltr">1.2 kw</span> عند الحمل الكامل و تيار المجال ضبط بحيث يكون جهد الأطراف <span class="ltr">280 V</span> عند عدم الحمل. احسب ما يلي: أ) سرعة دوران هذا المولد ب) جهد الأطراف عند الحمل الكامل في الحالات التالية: 1- معامل القدرة 0.78 متأخر، 2- معامل القدرة 1.0، 3- معامل القدرة 0.78 متقدم جـ) كفاءة المولد عند الحمل الكامل إذا كان معامل القدرة 0.78 متأخر د) العزم الداخل للمولد هـ) معامل تنظيم الجهد في حالات التحميل الثلاثة المذكورة في الفقرة (ب)</li></ol>`,ref:'ص 122–123'},
    {watch:String.raw`<p>التمرين 10: قيم \(E_{Ph}\) في الجدول تصل إلى <span class="ltr">2850 V</span>، بينما جهد الوجه لمولد نجمة <span class="ltr">2300 V</span> هو <span class="ltr">1328 V</span> فقط؛ فلا يتضح هل الجدول بجهد الوجه (كما كُتب) أم بالجهد الخطي. كما أن الفقرة (جـ) تستعمل <span class="ltr">0.85</span> متأخر بينما معطيات الحمل الكامل <span class="ltr">0.8</span> متأخر. والتمرين 11 جـ في الكتاب «كفاءة <b>المحرك</b>» والسؤال عن مولد، فكُتب هنا «المولد».</p>`,fix:true},
    {predict:{q:'السؤال 7: متى تفقد الآلة التزامنية التزامن؟',opts:[
     [String.raw`عندما تصل زاوية القدرة \(\delta\) إلى الصفر`,false,String.raw`عند \(\delta=0\) لا تنتقل قدرة فعالة، لكن الآلة ما زالت متزامنة.`],
     [String.raw`عندما تتجاوز زاوية القدرة \(90^\circ\) فتدخل منطقة التشغيل غير المستقر`,true,String.raw`الشكل (3-16) وص 109: التشغيل المستقر \(\delta\lt90\) للمولد. بعدها لا تستطيع الآلة موازنة القدرة فتخرج من التزامن.`],
     ['عندما يقل تردد الشبكة قليلاً',false,'المولد المربوط يتبع تردد القضيب اللانهائي، ولا يفقد التزامن بذلك.']]}},
    {tip:String.raw`<p class="sub">الكتاب لا يعطي إجابات. حاول أولاً، ثم افتح الإجابة المقترحة.</p>
     <details class="sg-q"><summary>إجابة السؤال 1</summary><div class="sg-ans">(ص 110) 1) تغذي أحمالاً أكبر من حمل مولد واحد. 2) تزيد موثوقية النظام: إذا تعطل مولد تقاسم الآخرون حصته. 3) تسمح بصيانة مولد أو أكثر دون قطع القدرة عن الأحمال. 4) عدة مولدات صغيرة أكبر كفاءة من مولد وحيد مكافئ خصوصاً مع الأحمال الصغيرة.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 2</summary><div class="sg-ans">(ص 110) 1) تساوي القيمة الفعالة لجهد الأطراف. 2) تساوي التردد. 3) نفس تتابع الأطوار (ABC أو ACB). 4) الجهود في نفس الطور.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 3</summary><div class="sg-ans">(ص 111) أضرار كبيرة مثل إتلاف ملفات المولد بسبب مرور تيار كبير فيها، أو كسر عمود الدوران بسبب تحوله إلى محرك يدور باتجاه معاكس لدوران التوربينة.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 4</summary><div class="sg-ans">(ص 111) قضبان تمثل شبكة كبيرة جداً تعتبر «كأنها مولد ذو قدرة غير محدودة»، فتوصيل المولد إليها يشبه توصيله على التوازي مع مولد آخر كبير جداً.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 5</summary><div class="sg-ans"><span class="sg-tag">من خارج الكتاب</span> لا. الكتاب لا يشرح ذلك مباشرة، لكن القضيب اللانهائي «مولد ذو قدرة غير محدودة» يفرض تردده، والسرعة مرتبطة بالتردد (\(n=120f/p\))، فيبقى المولد بالسرعة التزامنية. زيادة عزم المحرك الأولي تزيد القدرة المرسلة (وزاوية δ) لا السرعة.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 6</summary><div class="sg-ans">يعتمد على إشارة زاوية القدرة δ (الشكل 3-16 ص 108): إذا كانت δ موجبة (\(E\) متقدم على \(V\)) تعمل الآلة مولداً وتنتقل القدرة من المولد إلى القضيب؛ وإذا كانت سالبة تعمل محركاً وتنتقل القدرة من القضيب إلى الآلة. <span class="sg-tag">من خارج الكتاب</span> وإشارة δ تحددها قدرة المحرك الأولي: أكبر من المفاقيد ⇐ مولد، وأقل منها ⇐ محرك.</div></details>
     <details class="sg-q"><summary>إجابة السؤال 7</summary><div class="sg-ans">عندما تتجاوز زاوية القدرة 90° (منطقة التشغيل غير المستقر في الشكل 3-16)، أي عندما يُطلب منها قدرة أكبر من \(P_{max}=3\,V_{ph}E_{ph}/X_S\) (3-16). منطقة التشغيل المستقر: \(\delta\lt 90\) للمولد و\(\delta\gt -90\) للمحرك (ص 109). <span class="sg-tag">من خارج الكتاب</span> ويحدث ذلك بزيادة عزم المحرك الأولي كثيراً أو بإضعاف تيار المجال كثيراً.</div></details>
     <details class="sg-q"><summary>حل مقترح للتمرين 8</summary><div class="sg-ans">بافتراض أن <span class="ltr">10 MW</span> قدرة فعالة خارجة: \(V_{ph}=6350.9\ \text{V}\)، \(I=617.5\ \text{A}\)، و\(E_{Ph}\approx6625.5\angle2.72^\circ\ \text{V}\). الحل كاملاً في حاسبة «التمرين 8» في «الأمثلة المحلولة».</div></details>
     <details class="sg-q"><summary>حل مقترح للتمرين 9</summary><div class="sg-ans">بافتراض أن <span class="ltr">180 kVA</span> قدرة ظاهرية: \(I_{ph}=272.7\ \text{A}\)؛ أ) ≈ <span class="ltr">236.6∠2.60° V</span>، ب) ≈ <span class="ltr">210.6∠4.57° V</span>، جـ) ≈ <span class="ltr">225.2∠4.86° V</span>. الحل في حاسبة «التمرين 9».</div></details>
     <details class="sg-q"><summary>حل مقترح للتمرين 10</summary><div class="sg-ans">أ) المنحنى مرسوم في «المختبر» (اختر «التمرين 10»). ب–هـ) \(V_{ph}=1327.9\ \text{V}\)؛ عند 0.85 متأخر \(E_{ph}\approx1519.8\ \text{V}\)، وعند 0.8 متقدم \(E_{ph}\approx1217.3\ \text{V}\)؛ والقدرة الداخلة عند الحمل الكامل 0.8 متأخر ≈ <span class="ltr">866.8 kW</span>. <b>تيار المجال يعتمد على تفسير الجدول</b>: إذا كان الجدول بجهد الوجه: ب) 2.21 A، جـ) 2.53 A، هـ) 2.03 A؛ وإذا كان بالجهد الخطي: ب) 4.24 A، جـ) 5.62 A، هـ) 3.72 A. الحل في حاسبة «التمرين 10».</div></details>
     <details class="sg-q"><summary>حل مقترح للتمرين 11</summary><div class="sg-ans">بطريقة مثال (3-2)، وبافتراض أن <span class="ltr">100 A</span> تيار خط (\(I_{ph}=57.74\ \text{A}\)): أ) <span class="ltr">1800 rpm</span>؛ ب) ≈ <span class="ltr">238.1</span> و<span class="ltr">273.4</span> و<span class="ltr">313.9 V</span>؛ جـ) ≈ <span class="ltr">91.6%</span>؛ د) ≈ <span class="ltr">186.3 N·m</span>؛ هـ) ≈ <span class="ltr">17.6%</span> و<span class="ltr">2.4%</span> و<span class="ltr">−10.8%</span>. الحل في حاسبة «التمرين 11».</div></details>
     <p class="sub"><b>افتراضات الحلول المقترحة (ليست من الكتاب):</b> س8: <span class="ltr">10 MW</span> قدرة فعالة خارجة. س9: <span class="ltr">180 kVA</span> قدرة ظاهرية. س10: القدرة الداخلة (د) عند الحمل الكامل 0.8 متأخر، وتيار المجال يُقرأ من الجدول بالاستيفاء الخطي بين نقطتين. س11: <span class="ltr">100 A</span> تيار خط فيكون تيار الوجه \(100/\sqrt3\). التقريب بطريقة مثال (3-2).</p>`,title:'إجابات وحلول مقترحة (ليست من الكتاب)'}
   ]},

  {recap:[
   String.raw`مثال (3-1): نحسب \(E_{Ph}\) المطلوب من المعادلة (3-9)، ثم نقرأ تيار المجال من منحنى اللاحمل: 4.5 A بلا حمل، و5.7 A للحمل المتأخر، و4.1 A للمتقدم.`,
   String.raw`مثال (3-2): مع ثبات \(E_{Ph}=277\ \text{V}\) يتغير جهد الأطراف حسب نوع الحمل (236.8 و270.4 و308.8 V)، ويُحسب بالمثلث القائم في المخطط الاتجاهي بدل المعادلة (3-9).`,
   String.raw`معامل تنظيم الجهد، المعادلة (3-13): موجب مع الحمل المتأخر (17.1%) وسالب مع المتقدم (−10.3%) في مثال (3-2).`,
   String.raw`أخطاء الكتاب في مثال (3-2): العدد 308.8 في (جـ) صوابه 236.8، والعزم في (د) صوابه 291.2 N·m لا 191.2.`]}
],
 theory:[
  {h:'الأمثلة المحلولة',ref:'ص 114–121',html:`<p>يحل الكتاب مثالين كبيرين يجمعان كل ما سبق في الوحدة:</p><ul><li><b>مثال (3-1)</b> (ص 114–116): مولد بأربعة أقطاب، دلتا، <span class="ltr">480 V</span>، <span class="ltr">60 Hz</span>، \\(X_S=0.1\\ \\Omega\\)، \\(R_A=0.015\\ \\Omega\\)، حمل كامل <span class="ltr">1200 A</span> عند 0.8 متأخر، مفاقيد احتكاك <span class="ltr">40 kW</span> وحديد <span class="ltr">30 kW</span>. المطلوب: السرعة، وتيار المجال عند اللاحمل وعند الحمل المتأخر والمتقدم (يُقرأ من منحنى اللاحمل)، والكفاءة، والجهد إذا فُصل الحمل فجأة.</li>
   <li><b>مثال (3-2)</b> (ص 117–121): مولد بستة أقطاب، نجمة، <span class="ltr">480 V</span>، <span class="ltr">60 Hz</span>، \\(X_S=1\\ \\Omega\\)، \\(R_A\\) مهملة، حمل كامل <span class="ltr">60 A</span> عند 0.8 متأخر، احتكاك <span class="ltr">1.5 kW</span> وحديد <span class="ltr">1 kW</span>، وتيار المجال ضُبط ليكون الجهد <span class="ltr">480 V</span> عند عدم الحمل. المطلوب: السرعة، وجهد الأطراف في الحالات الثلاث، والكفاءة، والعزم، ومعامل تنظيم الجهد.</li></ul>
   <p>الحلان كاملان في تبويب «الأمثلة المحلولة» بأرقام الكتاب وتقريبه، ويمكنك تغيير المعطيات.</p>`},
  {fig:'(3-19)',ref:'ص 114',caption:'منحنى اللاحمل لمولد مثال (3-1): الجهد الداخلي \\(E_{Ph}\\) مقابل تيار المجال \\(I_F\\)، مع النقاط التي استعملها الحل (<span class="ltr">451 V ↔ 4.1 A</span>، <span class="ltr">480 V ↔ 4.5 A</span>، <span class="ltr">532 V ↔ 5.7 A</span>). أُعيد رسم المنحنى من قراءات تقريبية للشكل المطبوع',draw:()=>svgbox(fig319b(),520)},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'هذا الشكل يحمل الرقم (3-19) نفسه الذي يحمله «جهاز التزامن» في ص 113؛ ونص المثال وحله يقصدان منحنى اللاحمل هذا.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'نص مثال (3-1) ص 114: الفقرة (جـ) تنتهي بعبارة «كم يجب أن يكون» في غير موضعها (ترتيب مضطرب)، وفي الفقرة (و) «عند معامل قدره 0.8» والصواب «معامل قدرة».'+'</div>'},
  {html:`<p><b>هـ) في مثال (3-1):</b> «إذا فصل الحمل بشكل مفاجئ عن المولد يعني أن التيار سيصبح صفراً، وهذا يعني أن \\((E_{Ph}=V_{Ph})\\) طبقاً للمعادلة (3-9)، وإذا لم يعاد ضبط تيار المجال فإن جهد الأطراف سيرتفع إلى قيمة الجهد الداخلي أي أن \\((V_{Ph}=532\\ V)\\)» <span class="ref">ص 116</span>.</p>
   <p><b>ب) في مثال (3-2):</b> «لحساب جهد الأطراف عند تحميل المولد يستحسن استخدام المخطط الاتجاهي … بدلاً من استخدام المعادلة (3-9) لأنها في هذه الحالة ستحتوي على مجهولين هما زاوية الجهد الداخلي \\((\\delta)\\) بالإضافة إلى جهد الأطراف \\(V_{Ph}\\)» <span class="ref">ص 118</span>. لذلك يحل الكتاب بالمثلث القائم oab في الشكل (3-20).</p>`},
  {fig:'(3-20)',ref:'ص 120',caption:'المخطط الاتجاهي للمولد التزامني في حالات تحميل مختلفة بأرقام مثال (3-2): (1) 0.8 متأخر، (2) معامل قدرة 1، (3) 0.8 متقدم. الجهد الداخلي ثابت 277 V في الحالات الثلاث (أُعيد رسمه)',draw:fig320},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مثال (3-2) جـ ص 120: \\(P_o=3\\times308.8\\times60\\times0.8=34.1\\ kW\\) — العدد المقصود 236.8 (جهد حالة 0.8 متأخر)، والناتج 34.1 kW صحيح له. والعدد 308.8 يعطي 44.47 kW.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مثال (3-2) هـ ص 121: الحالة (2) حُسبت بالجهد 468 بدل 468.4، فطُبع \\(V_R=2.6\\%\\)؛ وبالجهد 468.4 تكون <span class="ltr">2.48%</span>. نعرض رقم الكتاب ومعه هذه الملاحظة.'+'</div>'},
  {h:'العزم الداخل في مثال (3-2) د',ref:'ص 121',widget:(el)=>{let v='book';const draw=()=>{el.innerHTML=`<div class="sg-row">${segHTML('tq',[['book','كما في الكتاب'],['fixed','المصحح']],v)}</div><div class="callout${v==='book'?' err':''}" style="margin-top:8px">${B.tex('\\omega=\\frac{2\\pi n}{60}=\\frac{2\\pi\\times1200}{60}=125.7\\ rad/s',true)}${B.tex(v==='book'?'T_{in}=\\frac{36.6\\times10^3}{125.7}=191.2\\ Nm':'T_{in}=\\frac{36.6\\times10^3}{125.7}=291.2\\ Nm',true)}${v==='book'?'هذا الرقم مطبوع في الكتاب، والقسمة خاطئة.':'<span class="fixnote">القسمة الصحيحة: 36600 ÷ 125.7 = 291.17 ≈ 291.2 N·m.</span>'}</div>`;segOn(el,'tq',x=>{v=x;draw()})};draw()}},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مثال (3-2) د ص 121: \\(T_{in}=36.6\\times10^3/125.7\\) طُبع ناتجها <span class="ltr">191.2 Nm</span>، والصحيح <span class="ltr">291.2 Nm</span> تقريباً.'+'</div>'},
  {h:'أسئلة وتمارين الفصل الأول',ref:'ص 106',html:`<p class="sub">الكتاب لا يعطي إجابات. اضغط السؤال لترى إجابة مقترحة مكتوبة من نص الكتاب.</p>
   ${Q7(1,'ممَّ اكتسبت الآلة التزامنية تسميتها؟','من «التزامن أو التوافق التام بين سرعة دوران المجال المغناطيسي والعضو الدوار» (ص 92)، ولذلك تسمى أيضاً الآلة التوافقية.')}
   ${Q7(2,'كيف يمكن التحكم في مقدار القوة الدافعة الكهربائية المتولدة في ملفات المنتج؟','بالتحكم في شدة المجال المغناطيسي، أي <b>بتغيير قيمة التيار المستمر الداخل إلى ملفات العضو الدوار</b> (تيار المجال). هذا هو «الخيار الوحيد» لأن السرعة يجب أن تبقى ثابتة (ص 96).')}
   ${Q7(3,'هل من المناسب زيادة القوة الدافعة الكهربائية المتولدة في ملفات المنتج عن طريق زيادة سرعة الدوران؟','لا. صحيح أن القوة الدافعة تعتمد على السرعة، لكن زيادة السرعة تغير التردد أيضاً (\\(f=np/120\\))، والسرعة «يجب أن تكون ثابتة للحصول على تردد ثابت» (ص 96).')}
   ${Q7(4,'كيف يمكن التحكم في تردد الآلة التزامنية؟','التردد يعتمد على سرعة العضو الدوار وعدد الأقطاب (المعادلة 3-1). وعدد الأقطاب ثابت في الآلة، فيُتحكم في التردد بسرعة دوران المحرك الأولي (ص 96، وخطوة التزامن 2 ص 112).')}
   ${Q7(5,'ما المقصود برد فعل المنتج؟','عند التحميل تمر في الأوجه الثلاثة تيارات بينها 120° فتولد <b>مجالاً مغناطيسياً دواراً في العضو الثابت</b> يدور بنفس سرعة واتجاه مجال الدوار؛ هذا المجال هو رد فعل المنتج، وهو يشوه الفيض في الثغرة الهوائية وينتج جهداً \\(E_{AR}=-jXI_{ph}\\) (ص 97–98).')}
   ${Q7(6,'ما هي الممانعة التزامنية؟','ممانعة حثية واحدة تجمع ممانعة رد فعل المنتج \\(X\\) وممانعة التسرب الحثية لملفات المنتج \\(X_A\\): \\(X_S=X+X_A\\) (المعادلة 3-8 ص 99).')}
   ${Q7(7,'ارسم الدائرة المكافئة التقريبية للآلة التزامنية، واذكر الأساس الذي تم عليه التقريب؟','الدائرة: المصدر \\(E_{ph}\\) على التوالي مع \\(jX_S\\) ثم الحمل وعليه \\(V_{ph}\\) (الشكل 3-8)، ومعادلتها \\(V_{ph}=E_{ph}-jX_SI_{ph}\\) (3-10). أساس التقريب: <b>إهمال مقاومة ملفات المنتج لأنها صغيرة مقارنة بالممانعة التزامنية خصوصاً في المولدات الكبيرة</b> (ص 100).'+svgbox(circSVG('3-8'),460))}
   ${Q7(8,'ارسم المخطط الاتجاهي للآلة التزامنية المصاحب للدائرة المكافئة التقريبية في حالة الأحمال الثلاثة (حمل مادي، حمل حثي و حمل سعوي)','مثل الشكل (3-9) لكن بدون السهم \\(I_{ph}R_A\\): \\(V_{ph}\\) أفقي مرجعاً، ومن رأسه \\(jX_SI_{ph}\\) عمودي على التيار، و\\(E_{ph}\\) من الأصل إلى رأسه. (a) مادي: \\(jX_SI\\) رأسي. (b) حثي: \\(E\\) أطول بكثير من \\(V\\). (c) سعوي: قد يكون \\(E\\) أقصر من \\(V\\).'+fig39(0))}
   ${Q7(9,'ما المقصود بالتشبع المغناطيسي في الحديد؟','في المنطقة (2) من منحنى اللاحمل يزداد الفيض فتزداد ممانعة الحديد المغناطيسية، أي أن الحديد «بدأ يصل إلى حالة التشبع»، فيتناقص معدل ارتفاع الجهد مقابل زيادة تيار المجال (ص 103).')}
   ${Q7(10,'إلى أي مدى يمكن زيادة تيار المجال في اختباري عدم الحمل و الدائرة المقصورة؟','<b>في اختبار القصر:</b> حتى يصل تيار القصر إلى قيمته المقننة فقط، لأن الكتاب ينص: «يجب أن لا يترك تيار القصر يزداد عن القيمة المقننة» (ص 103). <b>في اختبار اللاحمل:</b> الكتاب لا يحدد حداً؛ يزاد تيار المجال تدريجياً من الصفر حتى تظهر منطقة التشبع (المنطقة 2) في المنحنى (ص 101–103). '+OUT+'وعملياً لا يُتجاوز كثيراً جهد الآلة المقنن.')}
   ${Q7(11,'ما هو معامل تنظيم الجهد؟','«التغير في جهد الأطراف من حالة اللاحمل إلى حالة الحمل الكامل منسوباً إلى قيمة الجهد في حالة الحمل الكامل»: \\(V_R\\%=\\frac{E_{ph}-V_{ph}}{V_{ph}}\\times100\\) (3-13 ص 105).')}
   ${Q7(12,'ما أهمية معرفة معامل تنظيم الجهد للمولد؟','يعطي فكرة واضحة عن مدى تغير جهد الأطراف عند تحميل الآلة أو عند تغير الأحمال بشكل كبير، ويعتبر مؤشراً جيداً للدلالة على جودة المولد (ص 105).')}
   ${Q7(13,'أيهما أفضل أن يكون معامل تنظيم الجهد كبيراً أم صغيراً؟','<b>صغيراً.</b> المعامل الصغير يعني أن جهد الأطراف يتغير قليلاً بين اللاحمل والحمل الكامل، فيبقى الجهد عند المستهلك قريباً من قيمته مع تغير الأحمال. (استنتاج من تعريف الكتاب ص 105.)')}`},
  {h:'أسئلة وتمارين الفصل الثاني',ref:'ص 122–123',html:`
   ${Q7(1,'لماذا يفضل ربط المولدات التزامنية على التوازي؟','(ص 110) 1) تغذي أحمالاً أكبر من حمل مولد واحد. 2) تزيد موثوقية النظام: إذا تعطل مولد تقاسم الآخرون حصته. 3) تسمح بصيانة مولد أو أكثر دون قطع القدرة عن الأحمال. 4) عدة مولدات صغيرة أكبر كفاءة من مولد وحيد مكافئ خصوصاً مع الأحمال الصغيرة.')}
   ${Q7(2,'ما شروط ربط المولدات التزامنية على التوازي؟','(ص 110) 1) تساوي القيمة الفعالة لجهد الأطراف. 2) تساوي التردد. 3) نفس تتابع الأطوار (ABC أو ACB). 4) الجهود في نفس الطور.')}
   ${Q7(3,'ما مخاطر توصيل المولد التزامني على التوازي بدون تحقق شرط أو أكثر من شروط التزامن؟','(ص 111) أضرار كبيرة مثل إتلاف ملفات المولد بسبب مرور تيار كبير فيها، أو كسر عمود الدوران بسبب تحوله إلى محرك يدور باتجاه معاكس لدوران التوربينة.')}
   ${Q7(4,'ما المقصود بالقضيب اللانهائي؟','(ص 111) قضبان تمثل شبكة كبيرة جداً تعتبر «كأنها مولد ذو قدرة غير محدودة»، فتوصيل المولد إليها يشبه توصيله على التوازي مع مولد آخر كبير جداً.')}
   ${Q7(5,'بعد توصيل المولد بالقضيب اللانهائي، هل يمكن التحكم في سرعة المولد؟',(EXTRA_INFINITE_BUS?OUT:'')+'لا. الكتاب لا يشرح ذلك مباشرة، لكن القضيب اللانهائي «مولد ذو قدرة غير محدودة» يفرض تردده، والسرعة مرتبطة بالتردد (\\(n=120f/p\\))، فيبقى المولد بالسرعة التزامنية. زيادة عزم المحرك الأولي تزيد القدرة المرسلة (وزاوية δ) لا السرعة.'+(EXTRA_INFINITE_BUS?' (انظر قسم «إضافة من خارج الكتاب» في الدرس 3.6 ومختبره.)':''))}
   ${Q7(6,'بعد توصيل المولد بالقضيب اللانهائي، هل القدرة تنتقل من المولد إلى القضيب أو العكس؟','يعتمد على إشارة زاوية القدرة δ (الشكل 3-16 ص 108): إذا كانت δ موجبة (\\(E\\) متقدم على \\(V\\)) تعمل الآلة مولداً وتنتقل القدرة من المولد إلى القضيب؛ وإذا كانت سالبة تعمل محركاً وتنتقل القدرة من القضيب إلى الآلة.'+(EXTRA_INFINITE_BUS?' '+OUT+'وإشارة δ تحددها قدرة المحرك الأولي: أكبر من المفاقيد ⇐ مولد، وأقل منها ⇐ محرك.':''))}
   ${Q7(7,'متى تفقد الآلة التزامن؟','عندما تتجاوز زاوية القدرة 90° (منطقة التشغيل غير المستقر في الشكل 3-16)، أي عندما يُطلب منها قدرة أكبر من \\(P_{max}=3V_{ph}E_{ph}/X_S\\) (3-16). منطقة التشغيل المستقر: \\(\\delta\\lt 90\\) للمولد و\\(\\delta\\gt -90\\) للمحرك (ص 109).'+(EXTRA_INFINITE_BUS?' '+OUT+'ويحدث ذلك بزيادة عزم المحرك الأولي كثيراً أو بإضعاف تيار المجال كثيراً.':''))}
   ${Q7(8,'مولد تزامني ثلاثي الأوجه 10MW ملفاته موصلة على شكل نجمة، جهد أطرافه 11kV والتردد 60 Hz، ممانعته التزامنية 0.66 Ω ومقاومة ملفات المنتج 0.1 Ω، احسب الجهد الداخلي \\(E_{Ph}\\) عند الحمل الكامل و معامل قدرة 0.85 متأخر','بافتراض أن <span class="ltr">10 MW</span> قدرة فعالة خارجة: \\(V_{ph}=6350.9\\ V\\)، \\(I=617.5\\ A\\)، و\\(E_{Ph}\\approx6625.5\\angle2.72^\\circ\\ V\\). الحل كاملاً في حاسبة «التمرين 8».')}
   ${Q7(9,'مولد تزامني ثلاثي الأوجه 180 kVA ملفاته موصلة على شكل دلتا، جهد أطرافه 220 V والتردد 50 Hz، ممانعته التزامنية 0.07 Ω و مقاومة ملفات المنتج 0.016 Ω، احسب الجهد الداخلي \\(E_{Ph}\\) عند الحمل الكامل و معامل قدرة: أ) 0.72 متأخر، ب) 0.72 متقدماً، جـ) مساوياً للواحد','بافتراض أن <span class="ltr">180 kVA</span> قدرة ظاهرية: \\(I_{ph}=272.7\\ A\\)؛ أ) ≈ <span class="ltr">236.6∠2.60° V</span>، ب) ≈ <span class="ltr">210.6∠4.57° V</span>، جـ) ≈ <span class="ltr">225.2∠4.86° V</span>. الحل في حاسبة «التمرين 9».')}
   ${Q7(10,'مولد تزامني ذو قطبين ملفاته موصلة على شكل نجمة، جهد الأطراف له 2300 V والتردد 60 Hz، اختبار الدائرة المفتوحة له أعطى القراءات الموضحة في الجدول التالي: <table class="tt"><tbody><tr><td>I<sub>F</sub> (A)</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>E<sub>Ph</sub> (V)</td><td>600</td><td>1200</td><td>1800</td><td>2230</td><td>2520</td><td>2700</td><td>2800</td><td>2850</td></tr></tbody></table> ممانعته التزامنية 1.1 Ω ومقاومة ملفات المنتج 0.15 Ω، عند الحمل الكامل يعطي تياراً مقداره 250 A عند معامل قدرة 0.8 متأخر، فإذا كانت مفاقيد الاحتكاك 24 kw و المفاقيد الحديدية 18 kw عند الحمل الكامل: أ) ارسم منحنى الدائرة المفتوحة للمولد ب) كم يجب أن يكون تيار المجال لكي يكون جهد الأطراف 2300 V بدون حمل جـ) إذا كان المولد يغذي حملاً بتيار مقداره 250 A عند معامل قدرة 0.85 متأخر، كم يجب أن يكون تيار المجال لكي يحافظ على جهد الأطراف عند 2300 V د) احسب القدرة الداخلة للمولد هـ) افترض أن المولد يغذي حملاً بتيار مقداره 250 A عند معامل قدرة 0.8 متقدماً، كم يجب أن يكون تيار المجال لكي يبقى جهد الأطراف عند 2300 V','أ) المنحنى مرسوم في «المختبر» (اختر «التمرين 10»). ب–هـ) \\(V_{ph}=1327.9\\ V\\)؛ عند 0.85 متأخر \\(E_{ph}\\approx1519.8\\ V\\)، وعند 0.8 متقدم \\(E_{ph}\\approx1217.3\\ V\\)؛ والقدرة الداخلة عند الحمل الكامل 0.8 متأخر ≈ <span class="ltr">866.8 kW</span>. <b>تيار المجال يعتمد على تفسير الجدول</b> (انظر الملاحظة التالية): إذا كان الجدول بجهد الوجه: ب) 2.21 A، جـ) 2.53 A، هـ) 2.03 A؛ وإذا كان بالجهد الخطي: ب) 4.24 A، جـ) 5.62 A، هـ) 3.72 A. الحل في حاسبة «التمرين 10».')}
   ${Q7(11,'مولد تزامني ذو أربعة أقطاب ملفاته موصلة على شكل دلتا جهد أطرافه 280V عند تردد 60 Hz، الممانعة التزامنية 1.05 Ω لكل وجه و مقاومة ملفات المنتج مهملة، تيار حمله الكامل 100 A عند معامل قدرة 0.78 متأخر و مفاقيد الاحتكاك 1.75 kw والمفاقيد الحديدية 1.2 kw عند الحمل الكامل و تيار المجال ضبط بحيث يكون جهد الأطراف 280 V عند عدم الحمل. احسب ما يلي: أ) سرعة دوران هذا المولد ب) جهد الأطراف عند الحمل الكامل في الحالات التالية: 1- معامل القدرة 0.78 متأخر، 2- معامل القدرة 1.0، 3- معامل القدرة 0.78 متقدم جـ) كفاءة المحرك عند الحمل الكامل إذا كان معامل القدرة 0.78 متأخر د) العزم الداخل للمولد هـ) معامل تنظيم الجهد في حالات التحميل الثلاثة المذكورة في الفقرة (ب)','بطريقة مثال (3-2)، وبافتراض أن <span class="ltr">100 A</span> تيار خط (\\(I_{ph}=57.74\\ A\\)): أ) <span class="ltr">1800 rpm</span>؛ ب) ≈ <span class="ltr">238.1</span> و<span class="ltr">273.4</span> و<span class="ltr">313.9 V</span>؛ جـ) ≈ <span class="ltr">91.6%</span>؛ د) ≈ <span class="ltr">186.3 N·m</span>؛ هـ) ≈ <span class="ltr">17.6%</span> و<span class="ltr">2.4%</span> و<span class="ltr">−10.8%</span>. الحل في حاسبة «التمرين 11».')}`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'التمرين 10 ص 122–123: قيم \\(E_{Ph}\\) في الجدول تصل إلى <span class="ltr">2850 V</span>، بينما جهد الوجه لمولد نجمة <span class="ltr">2300 V</span> هو <span class="ltr">1328 V</span> فقط؛ فلا يتضح هل الجدول بجهد الوجه (كما كُتب) أم بالجهد الخطي. لذلك نعرض قراءتي تيار المجال كلتيهما في الحاسبة والمختبر («كما في الكتاب» = جهد وجه، و«المصحح» = جهد خطي). كما أن الفقرة (جـ) تستعمل 0.85 متأخر بينما معطيات الحمل الكامل 0.8 متأخر.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'التمرين 11 جـ ص 123: «كفاءة <b>المحرك</b>» والسؤال عن مولد.'+'</div>'},
  {note:'<b>افتراضات الحلول المقترحة للتمارين 8–11 (ليست من الكتاب):</b> س8: <span class="ltr">10 MW</span> قدرة فعالة خارجة. س9: <span class="ltr">180 kVA</span> قدرة ظاهرية. س10: القدرة الداخلة (د) عند الحمل الكامل 0.8 متأخر، وتيار المجال يُقرأ من الجدول بالاستيفاء الخطي بين نقطتين. س11: <span class="ltr">100 A</span> تيار خط فيكون تيار الوجه \\(100/\\sqrt3\\) (لو اعتُبر تيار وجه لتغيرت النتائج). التقريب بطريقة مثال (3-2).'}
 ],
 lab:(el)=>{
  let mach='ex31',tbl='book',ld='lag',pf=0.8,Iload=692.8,lastA='',k32='lag',lastB='';
  const M={ex31:{V:480,RA:0.015,XS:0.1,Ir:692.8,pf:0.8,book:{none:4.5,lag:5.7,lead:4.1},lab:'مثال (3-1)'},q10:{V:2300/SQ3,RA:0.15,XS:1.1,Ir:250,pf:0.8,lab:'التمرين 10'}};
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>قراءة تيار المجال من منحنى اللاحمل <small>مبنية على الشكل (3-19) ص 114 والمعادلة (3-9)</small></h2>
    <div class="sg-row">${segHTML('mc',[['ex31','مثال (3-1)'],['q10','التمرين 10']],mach)}<span id="l7tb"></span></div>
    <div class="sg-chart"><canvas id="l7o"></canvas></div>${legend([['--live','منحنى اللاحمل'],['--blue','E المطلوب وتيار المجال المقابل',1]])}
    <div id="l7m" class="sg-msg"></div></div>
   <div class="panel c5"><h2><span>الحمل والجهد ثابت عند الأطراف</span></h2>
    <div class="sg-row">${segHTML('ld',[['none','بلا حمل'],['lag','متأخر'],['unity','1'],['lead','متقدم']],ld)}</div>
    ${sl('l7i','تيار الحمل لكل وجه',0,1000,0.1,Iload)}${sl('l7p','معامل القدرة',0.5,1,0.01,pf)}
    <div class="facts">${fact('<bdi dir="ltr">V<sub>ph</sub></bdi> المطلوب','l7v')}${fact('<bdi dir="ltr">E<sub>ph</sub></bdi> اللازم (3-9)','l7e')}${fact('تيار المجال من المنحنى','l7f')}${fact('قيمة الكتاب','l7bk')}</div></div>
   <div class="panel c12"><h2>الجهد الداخلي ثابت: مثال (3-2) ب <small>مبنية على الشكل (3-20) ص 120</small></h2>
    <div class="grid" style="margin-top:0"><div class="c7"><div class="sg-row">${segHTML('k32',[['lag','0.8 متأخر (1)'],['unity','1.0 (2)'],['lead','0.8 متقدم (3)']],k32)}</div><div id="l7ph" class="svgbox" style="max-width:520px;margin-inline:auto"></div></div>
    <div class="c5"><div class="facts">${fact('<bdi dir="ltr">E<sub>ph</sub></bdi> (ثابت)','l7e2')}${fact('<bdi dir="ltr">V<sub>ph</sub></bdi>','l7v2')}${fact('<bdi dir="ltr">V<sub>L</sub></bdi>','l7vl')}${fact('<bdi dir="ltr">V<sub>R</sub>%</bdi>','l7vr')}</div><div id="l7m2" class="sg-msg"></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l7st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const tbUI=()=>{$('#l7tb').innerHTML=mach==='q10'?segHTML('tb',[['book','كما في الكتاب (الجدول جهد وجه)'],['fixed','المصحح (الجدول جهد خطي)']],tbl):'';if(mach==='q10')segOn($('#l7tb'),'tb',v=>{tbl=v;lastA=''})};
  const setSl=()=>{const m=M[mach];const s=$('#l7i');s.max=+(m.Ir*1.4).toFixed(1);Iload=m.Ir;s.value=Iload;pf=mach==='q10'&&ld==='lag'?0.85:0.8;$('#l7p').value=pf};
  segOn(el,'mc',v=>{mach=v;tbUI();setSl();lastA=''});tbUI();
  segOn(el,'ld',v=>{ld=v;if(mach==='q10')pf=v==='lag'?0.85:0.8;$('#l7p').value=pf;lastA=''});
  $('#l7i').oninput=e=>{Iload=+e.target.value};$('#l7p').oninput=e=>{pf=+e.target.value};
  segOn(el,'k32',v=>{k32=v;lastB=''});
  const seenA={},seenB={};let seenQ=0;
  const steps=stepsUI($('#l7st'),[
   {t:'مثال (3-1) ب',x:'اختر «مثال (3-1)» و«بلا حمل»: \\(E_{ph}=V_{ph}=480\\ V\\) وتيار المجال من المنحنى <span class="ltr">4.5 A</span>.',done:()=>seenA.none},
   {t:'مثال (3-1) جـ',x:'اختر «متأخر» (1200 A خطي = 692.8 A للوجه، 0.8): يلزم <span class="ltr">E = 532 V</span> وتيار مجال <span class="ltr">5.7 A</span>.',done:()=>seenA.lag},
   {t:'مثال (3-1) و',x:'اختر «متقدم»: يلزم <span class="ltr">451 V</span> فقط وتيار مجال <span class="ltr">4.1 A</span>.',done:()=>seenA.lead},
   {t:'مثال (3-1) هـ',x:'ماذا لو كان تيار المجال مضبوطاً على 5.7 A ثم فُصل الحمل فجأة؟ يرتفع جهد الأطراف إلى الجهد الداخلي <span class="ltr">532 V</span> (ص 116).'},
   {t:'مثال (3-2) ب',x:'في اللوحة السفلية بدّل بين الحالات الثلاث: <span class="ltr">236.8</span> و<span class="ltr">270.4</span> و<span class="ltr">308.8 V</span> لكل وجه (<span class="ltr">410</span> و<span class="ltr">468.4</span> و<span class="ltr">535 V</span> خطي).',done:()=>seenB.lag&&seenB.unity&&seenB.lead},
   {t:'التمرين 10',x:'اختر «التمرين 10» وبدّل بين تفسيري الجدول: تيار المجال المقروء يتغير كثيراً، لذلك يحتاج السؤال توضيحاً من المعلم.',done:()=>seenQ}
  ]);
  loopOn(el,()=>{const m=M[mach];$('#l7i-v').textContent=fm(Iload,1)+' A';$('#l7p-v').textContent=fm(pf,2);
   const sa=[mach,tbl,ld,Iload,pf].join();if(sa!==lastA){lastA=sa;
    const th=ld==='unity'?0:(ld==='lag'?-1:1)*Math.acos(pf)/D,I=ld==='none'?0:Iload,E=cabs(cadd(Cx(m.V),cmul(Cx(m.RA,m.XS),cpol(I,th))));
    let f,inv,Ered=E,xmax=10,ymax=700,lab='Eph (V)';
    if(mach==='ex31'){f=occ;inv=occInv;Ered=B.round(E,0)}else{xmax=8;ymax=3000;if(tbl==='book'){f=q10;inv=q10Inv}else{f=q10;inv=q10Inv;Ered=E*SQ3;lab='E line (V)'}seenQ|=tbl==='fixed'?2:1;if(seenQ===3)seenQ=3}
    const IF=inv(Ered);
    $('#l7v').textContent=fm(m.V,1)+' V';$('#l7e').textContent=fm(E,1)+' V'+(mach==='q10'&&tbl==='fixed'?` (خطي ${fm(Ered,1)})`:'');$('#l7f').textContent=IF==null?'خارج المنحنى':fm(IF,2)+' A';
    const bk=mach==='ex31'&&Math.abs(Iload-692.8)<0.05&&Math.abs(pf-0.8)<1e-9?m.book[ld]:null;$('#l7bk').textContent=bk!=null?fm(bk,1)+' A':mach==='ex31'&&ld==='none'?'4.5 A':'—';
    if(mach==='ex31'&&IF!=null&&(ld==='none'||bk!=null))seenA[ld]=1;
    plot($('#l7o'),{xmax,ymax,xlabel:'IF (A)',ylabel:lab,series:[{pts:mach==='ex31'?samp(occ,0,10,100):Q10_PTS,color:'--live'}].concat(IF!=null?[{pts:[[0,Ered],[IF,Ered],[IF,0]],color:'--blue',dash:[6,4],width:1.8}]:[]),points:(mach==='q10'?Q10_PTS.slice(1).map(p=>({x:p[0],y:p[1],color:'--live',r:3.5})):[]).concat(IF!=null?[{x:IF,y:Ered,color:'--blue'}]:[])});
    $('#l7m').innerHTML=mach==='ex31'?`<div class="callout">لكي يبقى <span class="ltr">V<sub>ph</sub> = 480 V</span> يلزم <span class="ltr">E<sub>ph</sub> = ${fm(Ered,0)} V</span>، فنمد خطاً أفقياً إلى المنحنى ثم رأسياً إلى محور تيار المجال: <span class="ltr">I<sub>F</sub> ≈ ${IF==null?'—':fm(IF,1)} A</span>. ${ld==='unity'?'(حالة معامل القدرة 1 ليست في الكتاب.)':''} المنحنى من قراءات تقريبية للشكل.</div>`:
     `<div class="callout${tbl==='book'?' err':''}">${tbl==='book'?'<b>كما في الكتاب:</b> الجدول يُقرأ بجهد الوجه (كما كُتب فوقه \\(E_{Ph}\\)).':'<span class="fixnote"><b>المصحح (تفسير):</b> الجدول بالجهد الخطي، فنقارن به \\(\\sqrt3\\,E_{ph}\\).</span>'} القراءة بالاستيفاء الخطي بين نقطتي الجدول. ${ld==='lag'?'الفقرة (جـ) تستعمل 0.85 متأخر.':''}</div>`;B.math($('#l7m'))}
   if(k32!==lastB){lastB=k32;const E=277,X=1,I=60,a=k32==='lag'?-36.87:k32==='lead'?36.87:0,z=cmul(Cx(0,X),cpol(I,a)),V=Math.sqrt(E*E-z.im*z.im)-z.re;seenB[k32]=1;
    $('#l7ph').innerHTML=phasorSVG({V,I:cpol(I,a),RA:0,XS:X,Iref:I});const VL=V*SQ3;
    $('#l7e2').textContent='277 V';$('#l7v2').textContent=fm(V,1)+' V';$('#l7vl').textContent=fm(VL,1)+' V';$('#l7vr').textContent=fm((480-VL)/VL*100,2)+' %';
    const pr={lag:['236.8','410','17.1'],unity:['270.4','468.4','2.6'],lead:['308.8','535','−10.3']}[k32];
    $('#l7m2').innerHTML=`<div class="callout">أرقام الكتاب: <span class="ltr">V<sub>ph</sub> = ${pr[0]} V</span>، <span class="ltr">V<sub>L</sub> = ${pr[1]} V</span>، <span class="ltr">V<sub>R</sub> = ${pr[2]}%</span>${k32==='unity'?' (حسبه الكتاب بـ 468 بدل 468.4؛ بدون تقريب 2.48%)':''}. الفروق الصغيرة هنا لأن الكتاب قرّب 480/√3 إلى 277 والجهد الخطي إلى أقرب فولت.</div>`}
   steps.check()});
 },
 examples:[
  {title:'مثال (3-1) كاملاً',ref:'ص 114–116',
   q:'<p>«مولد تزامني ذو أربعة أقطاب ملفاته موصلة على شكل دلتا، جهد الأطراف له <span class="ltr">480 V</span> والتردد <span class="ltr">60 Hz</span>، منحنى اللاحمل موضح في الشكل (3-19)، الممانعة التزامنية له <span class="ltr">0.1 Ω</span> ومقاومة ملفات المنتج <span class="ltr">0.015 Ω</span>، عند الحمل الكامل يعطي تياراً مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، فإذا كانت مفاقيد الاحتكاك <span class="ltr">40 kw</span> والمفاقيد الحديدية <span class="ltr">30 kw</span> عند الحمل الكامل احسب ما يلي: أ) سرعة العضو الدوار ب) تيار المجال لكي يحافظ المولد على جهد الأطراف عند <span class="ltr">480 V</span> جـ) تيار المجال لكي يحافظ المولد على جهد الأطراف عند <span class="ltr">480 V</span> إذا كان يغذي حمل بتيار مقداره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر د) كفاءة المولد هـ) جهد الأطراف إذا فصل الحمل عن المولد فجأة و) تيار المجال لكي يبقى جهد الأطراف عند <span class="ltr">480 V</span> إذا كان المولد يغذي حمل بتيار قدره <span class="ltr">1200 A</span> عند معامل قدرة <span class="ltr">0.8</span> متقدم».</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'P',label:'عدد الأقطاب',sym:'P',unit:'',value:4},{id:'V',label:'جهد الأطراف (دلتا)',sym:'V_{Ph}',unit:'V',value:480},{id:'IL',label:'تيار الخط',sym:'I_L',unit:'A',value:1200},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.015},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:0.1},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:40},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:30}],
   solve:(g)=>{const IF0=occInv(g.V),lag=ex31Steps(g,false,'الجهد الداخلي:'),Em=ex31E(g,false).Em;return [
    {t:'التوصيل دلتا: \\(V_{Ph}=V_{Line}\\) و \\(I_{Ph}=I_{Line}/\\sqrt3\\).'},
    {t:'أ) من المعادلة (3-1):',f:`n=\\frac{120f}{P}=\\frac{120\\times ${g.f}}{${g.P}}`,v:B.round(120*g.f/g.P,2),unit:'rpm',final:true},
    {t:`ب) عند عدم الحمل \\(I_{Ph}=0\\) فإن \\(V_{Ph}=E_{Ph}=${g.V}\\ V\\)، ومن منحنى اللاحمل (الشكل 3-19) تيار المجال المقابل:`,v:IF0==null?'خارج المنحنى':B.round(IF0,1),dp:1,unit:IF0==null?'':'A',final:true},
    {t:'<b>جـ)</b>'}].concat(lag,[{t:'<b>د)</b>'}],ex31Eff(g),[
    {t:'هـ) إذا فُصل الحمل فجأة يصبح التيار صفراً فيكون \\(V_{Ph}=E_{Ph}\\) (3-9)، وإذا لم يُعَد ضبط تيار المجال يرتفع جهد الأطراف إلى:',v:Em,dp:0,unit:'V',final:true},
    {t:'<b>و)</b> نعيد حساب \\(E_{Ph}\\) كما في (جـ) مع تغيير إشارة زاوية التيار لأنه أصبح متقدماً:'}],ex31Steps(g,true,'الجهد الداخلي:'))},
   note:'منحنى اللاحمل هنا من قراءات تقريبية للشكل (3-19) ويمر بنقاط الكتاب (4.1، 4.5، 5.7 A)، فإذا غيّرت المعطيات فقراءة تيار المجال تقريبية.'},
  {title:'مثال (3-2) كاملاً',ref:'ص 117–121',
   q:'<p>«مولد تزامني ذو ستة أقطاب ملفاته موصلة على شكل نجمة جهد الأطراف له <span class="ltr">480 V</span> عند تردد <span class="ltr">60 Hz</span>، الممانعة التزامنية <span class="ltr">1Ω</span> لكل وجه ومقاومة ملفات المنتج مهملة، تيار الحمل الكامل له <span class="ltr">60 A</span> عند معامل قدرة <span class="ltr">0.8</span> متأخر، مفاقيد الاحتكاك <span class="ltr">1.5 kw</span> والمفاقيد الحديدية <span class="ltr">1 kw</span> عند الحمل الكامل، وبما أن مقاومة ملفات المنتج مهملة افترض أن المفاقيد النحاسية في ملفات المنتج مهملة أيضاً، تيار المجال ضبط بحيث يكون جهد الأطراف <span class="ltr">480 V</span> عند عدم الحمل. احسب: أ) سرعة دوران هذا المولد ب) جهد الأطراف عند الحمل الكامل في الحالات: 1- معامل القدرة 0.8 متأخر، 2- معامل القدرة 1.0، 3- معامل القدرة 0.8 متقدماً جـ) كفاءة المولد عند الحمل الكامل إذا كان معامل القدرة 0.8 متأخر د) العزم الداخل إلى المولد هـ) معامل تنظيم الجهد في حالات التحميل الثلاث».</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'P',label:'عدد الأقطاب',sym:'P',unit:'',value:6},{id:'VL',label:'جهد الأطراف الخطي (نجمة)',sym:'V_L',unit:'V',value:480},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:1},{id:'IL',label:'تيار الحمل الكامل',sym:'I_L',unit:'A',value:60},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:1.5},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:1}],
   solve:(g,B,isBook)=>ex32Full(g,isBook),
   note:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> (جـ) طُبع 308.8 بدل 236.8 والناتج 34.1 kW صحيح. (د) طُبع 191.2 N·m والصحيح 291.2 N·m (الحاسبة تعرض الرقمين). (هـ) الحالة 2: 2.6% بتقريب 468.4 إلى 468، وبدونه 2.48%.</span>'},
  {title:'التمرين 8 — حل مقترح (ليس من الكتاب)',ref:'ص 122',
   q:'<p>«مولد تزامني ثلاثي الأوجه 10MW ملفاته موصلة على شكل نجمة، جهد أطرافه 11kV والتردد 60 Hz، ممانعته التزامنية 0.66 Ω ومقاومة ملفات المنتج 0.1 Ω، احسب الجهد الداخلي \\(E_{Ph}\\) عند الحمل الكامل و معامل قدرة 0.85 متأخر». <b>افتراض:</b> 10 MW قدرة فعالة خارجة.</p>',
   given:[{id:'P',label:'القدرة الفعالة',sym:'P',unit:'MW',value:10},{id:'VL',label:'الجهد الخطي',sym:'V_L',unit:'kV',value:11},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:0.66},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.1},{id:'pf',label:'معامل القدرة (متأخر)',sym:'\\cos\\theta',unit:'',value:0.85}],
   solve:(g)=>{const V=B.round(g.VL*1000/SQ3,1),I=B.round(g.P*1e6/(SQ3*g.VL*1000*g.pf),1);const r=eSteps(V,I,g.pf,false,g.RA,g.XS);return [
    {t:'جهد الوجه (نجمة):',f:`V_{ph}=\\frac{${g.VL}\\times10^3}{\\sqrt3}`,v:V,dp:1,unit:'V'},
    {t:'تيار الحمل الكامل:',f:`I=\\frac{P}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${g.P}\\times10^6}{\\sqrt3\\times ${g.VL}\\times10^3\\times ${g.pf}}`,v:I,dp:1,unit:'A'},
    {t:'بطريقة مثال (3-1) جـ:',f:'E_{Ph}=V_{Ph}+R_AI_{Ph}+jX_SI_{Ph}'}].concat(r.steps)}},
  {title:'التمرين 9 — حل مقترح (ليس من الكتاب)',ref:'ص 122',
   q:'<p>«مولد تزامني ثلاثي الأوجه 180 kVA ملفاته موصلة على شكل دلتا، جهد أطرافه 220 V والتردد 50 Hz، ممانعته التزامنية 0.07 Ω و مقاومة ملفات المنتج 0.016 Ω، احسب الجهد الداخلي \\(E_{Ph}\\) عند الحمل الكامل و معامل قدرة: أ) 0.72 متأخر، ب) 0.72 متقدماً، جـ) مساوياً للواحد». <b>افتراض:</b> 180 kVA قدرة ظاهرية.</p>',
   given:[{id:'S',label:'القدرة الظاهرية',sym:'S',unit:'kVA',value:180},{id:'V',label:'جهد الأطراف (دلتا)',sym:'V_{ph}',unit:'V',value:220},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:0.07},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.016},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.72}],
   solve:(g)=>{const I=B.round(g.S*1000/(3*g.V),1);return [{t:'تيار الوجه (دلتا):',f:`I_{ph}=\\frac{S}{3V_{ph}}=\\frac{${g.S}\\times10^3}{3\\times ${g.V}}`,v:I,dp:1,unit:'A'},{t:'<b>أ) متأخر:</b>'}].concat(eSteps(g.V,I,g.pf,false,g.RA,g.XS).steps,[{t:'<b>ب) متقدم:</b>'}],eSteps(g.V,I,g.pf,true,g.RA,g.XS).steps,[{t:'<b>جـ) معامل قدرة 1:</b>'}],eSteps(g.V,I,1,0,g.RA,g.XS).steps)}},
  {title:'التمرين 10 — حل مقترح (ليس من الكتاب)',ref:'ص 122–123',
   q:'<p>مولد نجمة <span class="ltr">2300 V</span>، <span class="ltr">X<sub>S</sub> = 1.1 Ω</span>، <span class="ltr">R<sub>A</sub> = 0.15 Ω</span>، حمل كامل <span class="ltr">250 A</span> عند 0.8 متأخر، احتكاك <span class="ltr">24 kW</span> وحديد <span class="ltr">18 kW</span>، وجدول اللاحمل في نص السؤال. تيار المجال يُقرأ من الجدول بالاستيفاء الخطي، <b>بتفسيرين</b> لأن الجدول غامض (جهد وجه أم خطي).</p>',
   given:[{id:'VL',label:'الجهد الخطي',sym:'V_L',unit:'V',value:2300},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:1.1},{id:'RA',label:'مقاومة المنتج',sym:'R_A',unit:'Ω',value:0.15},{id:'I',label:'تيار الحمل',sym:'I',unit:'A',value:250},{id:'pfc',label:'معامل القدرة في (جـ) متأخر',sym:'\\cos\\theta_c',unit:'',value:0.85},{id:'pf',label:'معامل القدرة عند الحمل الكامل وفي (هـ)',sym:'\\cos\\theta',unit:'',value:0.8},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:24},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:18}],
   solve:(g)=>{const V=B.round(g.VL/SQ3,1);const rd=E=>{const a=q10Inv(E),b=q10Inv(E*SQ3);return `جدول بجهد الوجه: ${a==null?'خارج الجدول':fm(a,2)+' A'}   |   جدول بالجهد الخطي (${fm(E*SQ3,1)} V): ${b==null?'خارج الجدول':fm(b,2)+' A'}`};
    const c=eSteps(V,g.I,g.pfc,false,g.RA,g.XS),e=eSteps(V,g.I,g.pf,true,g.RA,g.XS);const Po=B.round(3*V*g.I*g.pf/1000,1),Pcu=B.round(3*g.I*g.I*g.RA/1000,1),Pin=B.round(Po+Pcu+g.PF+g.Pc,1);
    return [{t:'أ) ارسم المنحنى من الجدول (انظر «المختبر»، اختر «التمرين 10»).'},
     {t:'ب) بدون حمل: \\(E_{ph}=V_{ph}\\):',f:`V_{ph}=\\frac{${g.VL}}{\\sqrt3}`,v:V,dp:1,unit:'V'},{t:'تيار المجال:',v:rd(V),final:true},
     {t:'<b>جـ)</b> عند '+g.pfc+' متأخر:'}].concat(c.steps,[{t:'تيار المجال:',v:rd(cabs(c.E)),final:true},
     {t:'<b>د)</b> القدرة الداخلة عند الحمل الكامل ('+g.pf+' متأخر — افتراض):',f:`P_o=3\\times ${fm(V,1)}\\times ${g.I}\\times ${g.pf}`,v:Po,dp:1,unit:'kW'},
     {t:'',f:`P_{cu1}=3\\times ${g.I}^2\\times ${g.RA}`,v:Pcu,dp:1,unit:'kW'},{t:'',f:`P_{in}=${fm(Po,1)}+${fm(Pcu,1)}+${g.PF}+${g.Pc}`,v:Pin,dp:1,unit:'kW',final:true},
     {t:'<b>هـ)</b> عند '+g.pf+' متقدم:'}],e.steps,[{t:'تيار المجال:',v:rd(cabs(e.E)),final:true}])},
   note:'<b>ملاحظة على الكتاب:</b> قيم الجدول (حتى 2850 V) لا تتسق مع جهد الوجه 1328 V لمولد نجمة 2300 V. نعرض قراءتي تيار المجال، والقرار للمعلم.'},
  {title:'التمرين 11 — حل مقترح (ليس من الكتاب)',ref:'ص 123',
   q:'<p>مولد بأربعة أقطاب، دلتا، <span class="ltr">280 V</span>، <span class="ltr">60 Hz</span>، <span class="ltr">X<sub>S</sub> = 1.05 Ω</span>، \\(R_A\\) مهملة، حمل كامل <span class="ltr">100 A</span> عند 0.78 متأخر، احتكاك <span class="ltr">1.75 kW</span> وحديد <span class="ltr">1.2 kW</span>، وتيار المجال مضبوط ليكون الجهد 280 V عند عدم الحمل. <b>افتراض:</b> 100 A تيار خط. الحل بطريقة مثال (3-2).</p>',
   given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'P',label:'عدد الأقطاب',sym:'P',unit:'',value:4},{id:'V',label:'جهد الأطراف (دلتا)',sym:'V_{ph}',unit:'V',value:280},{id:'XS',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:1.05},{id:'IL',label:'تيار الخط',sym:'I_L',unit:'A',value:100},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.78},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:1.75},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kW',value:1.2}],
   solve:(g)=>{const n=B.round(120*g.f/g.P,2),I=B.round(g.IL/SQ3,2);const cs=constESteps(g.V,g.XS,I,g.pf,['0.78 متأخر','1.0','0.78 متقدم']),r=cs.r;
    const Po=B.round(3*r.V1*I*g.pf/1000,2),Pin=B.round(Po+g.PF+g.Pc,2),eta=B.round(Po/Pin*100,1),w=B.round(2*PI*n/60,1),T=B.round(Pin*1000/w,1);const VR=v=>B.round((g.V-v)/v*100,1);
    return [{t:'أ) السرعة:',f:`n=\\frac{120\\times ${g.f}}{${g.P}}`,v:n,unit:'rpm',final:true},{t:'ب) دلتا: \\(V_{ph}=V_L\\) و \\(I_{ph}=I_L/\\sqrt3\\):',f:`I_{ph}=\\frac{${g.IL}}{\\sqrt3}`,v:I,dp:2,unit:'A'}].concat(cs.steps,[
     {t:'جـ) كفاءة المولد (السؤال يقول «المحرك»):',f:`P_o=3\\times ${fm(r.V1,1)}\\times ${fm(I,2)}\\times ${g.pf}`,v:Po,dp:2,unit:'kW'},{t:'',f:`P_{in}=${fm(Po,2)}+0+${g.PF}+${g.Pc}`,v:Pin,dp:2,unit:'kW'},{t:'',f:`\\eta\\%=\\frac{${fm(Po,2)}}{${fm(Pin,2)}}\\times100`,v:eta,dp:1,unit:'%',final:true},
     {t:'د) العزم الداخل:',f:`\\omega=\\frac{2\\pi\\times ${n}}{60}=${fm(w,1)}\\quad T_{in}=\\frac{${fm(Pin,2)}\\times10^3}{${fm(w,1)}}`,v:T,dp:1,unit:'N·m',final:true},
     {t:'هـ) معامل تنظيم الجهد:',v:`${fm(VR(r.V1),1)} %   ,   ${fm(VR(r.V2),1)} %   ,   ${fm(VR(r.V3),1)} %`,final:true}])}}
 ],
 quiz:[
  {q:'في مثال (3-1) تيار المجال عند اللاحمل (480 V):',o:['4.1 A','4.5 A','5.7 A','10 A'],c:1,e:'من منحنى اللاحمل (الشكل 3-19).'},
  {q:'لماذا يحتاج الحمل المتأخر في مثال (3-1) تيار مجال أكبر (5.7 A)؟',o:['لأن E المطلوب أكبر (532 V)','لأن السرعة أكبر','لأن R_A مهملة','لأن التردد أقل'],c:0,e:'في الحمل الحثي E أكبر من V (المخطط 3-9 b).'},
  {q:'إذا فُصل الحمل فجأة عن مولد مثال (3-1) دون تغيير تيار المجال، يصبح جهد الأطراف:',o:['480 V','451 V','532 V','صفراً'],c:2,e:'ص 116: يرتفع إلى الجهد الداخلي.'},
  {q:'في مثال (3-2) التوصيل نجمة، فجهد الوجه عند اللاحمل:',o:['480 V','277 V','830 V','160 V'],c:1,e:'480 ÷ √3 ≈ 277 V.'},
  {q:'لماذا حل الكتاب مثال (3-2) ب بالمثلث oab بدل (3-9) مباشرة؟',o:['لأن (3-9) فيها مجهولان: δ و V<sub>Ph</sub>','لأن R_A كبيرة','لأن التيار مجهول','لأن التردد مجهول'],c:0,e:'ص 118.'},
  {q:'جهد الأطراف في مثال (3-2) عند 0.8 متقدم:',o:['236.8 V','270.4 V','308.8 V','277 V'],c:2,e:'272.8 + 36 = 308.8 V: أكبر من E لأن الحمل سعوي.'},
  {q:'معامل تنظيم الجهد السالب (−10.3%) في مثال (3-2) يعني:',o:['الجهد يرتفع عند التحميل بحمل سعوي','الجهد يهبط كثيراً','المولد معطل','التردد يتغير'],c:0,e:'جهد الحمل الكامل (535 V) أكبر من جهد اللاحمل (480 V).'},
  {q:'الكفاءة في مثال (3-2) جـ:',o:['89.7%','93.2%','97%','85%'],c:1,e:'34.1 ÷ 36.6 × 100 = 93.2%.'}
 ]
});
})(PLCBOOK);
