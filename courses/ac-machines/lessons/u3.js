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
  {err:'المعادلة (3-1) ص 96 لا تعرّف الرمزين: من السياق \\(n\\) سرعة العضو الدوار بالدورة في الدقيقة <span class="ltr">(rpm)</span> و\\(p\\) عدد الأقطاب (وليس أزواج الأقطاب). وتكتب الحرف صغيراً \\(p\\) بينما تكتبه الأمثلة كبيراً \\(P\\). ومعامل اللف مطبوع «(1 &gt;)» ويقصد به «أصغر من 1».'},
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
  {err:'ص 104: عبارة «تقل [X<sub>S</sub>] كلما زادت الممانعة المغناطيسية للحديد» مقصودها: تقل مع دخول الحديد في التشبع (المنطقة 2).'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — لماذا يحدث ذلك؟</b> منحنى القصر خط مستقيم (لأن الآلة المقصورة لا تتشبع)، أما \\(E_{ph}\\) فينحني عند التشبع. القسمة \\(E_{ph}/I_{SC}\\) تبقى ثابتة ما دام O.C.C مستقيماً، ثم تصغر عندما يبدأ O.C.C بالانحناء. ولأن تيار القصر يبلغ قيمته المقننة عند تيار مجال صغير، نقرأ \\(I_{SC}\\) عند تيارات المجال الأكبر من <b>امتداد</b> خط S.C.C المستقيم.'},
  {h:'معامل تنظيم الجهد',ref:'ص 105',html:`<p>يعتبر معامل تنظيم الجهد <span class="ltr">Voltage Regulation</span> من المعاملات الهامة لأنه «يعطي فكرة واضحة عن مدى التغير الذي يحدث في قيمة الجهد على أطراف الآلة عند تحميلها أو عندما تتغير الأحمال بشكل كبير، كما أنه يعتبر مؤشراً جيداً للدلالة على جودة المولد».</p>
   <p>«<b>يعرف بأنه التغير في جهد الأطراف من حالة اللاحمل إلى حالة الحمل الكامل منسوباً إلى قيمة الجهد في حالة الحمل الكامل</b>»:</p>
   $$V_R\\%=\\frac{E_{ph}-V_{ph}}{V_{ph}}\\times100\\qquad(3\\text{-}13)$$
   <p>\\(E_{ph}\\) جهد اللاحمل، \\(V_{ph}\\) جهد الحمل الكامل. وهناك عدة طرق لتعيين معامل تنظيم الجهد تعتمد على نوعية البيانات المتوفرة عن الآلة (نتائج اختبارات أو بيانات التصميم).</p>`},
  {err:'ص 105: يذكر الكتاب «عدة طرق تستخدم لتعيين معامل تنظيم الجهد» دون أن يشرح أياً منها. في هذا الكتاب نحسبه دائماً بالدائرة المكافئة والمخطط الاتجاهي كما في مثال (3-2) هـ.'},
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
  {err:'ص 109: الشرط مطبوع «(90-&lt; δ)» والمقصود \\(\\delta\\gt -90^\\circ\\) لتشغيل المحرك، كما في الشكل (3-16).'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> كلما زادت القدرة المطلوبة من المولد زادت δ. حتى 90° تزيد القدرة مع δ (مستقر). بعد 90° تقل القدرة مع زيادة δ، فلا يستطيع المولد موازنة القدرة الداخلة فيتسارع ويخرج من التزامن. لذلك تُشغّل المولدات بزاوية أقل بكثير من 90°.'},
  {h:'مخطط سريان القدرة والكفاءة',ref:'ص 109',html:`<p>أثناء تحويل الطاقة الميكانيكية \\(P_{in}\\) إلى كهربائية \\(P_o\\) يفقد جزء في الدائرة المغناطيسية \\(P_{cor}\\) (المفاقيد الحديدية) وجزء في الدائرة الكهربائية \\(P_{cu1}\\) (المفاقيد النحاسية)، وجزء في صورة فقد ميكانيكي \\(P_F\\) (مفاقيد الاحتكاك). الشكل (3-17) يلخص انتقال القدرة.</p>`},
  {fig:'(3-17)',ref:'ص 109',caption:'مخطط سريان القدرة داخل المولد التزامني ثلاثي الأوجه (الأرقام هنا من مثال 3-1 د)',draw:()=>svgbox(flowSVG({Pin:889.6,PF:40,Pcor:30,Pcu:21.6,Po:798}),560)},
  {html:`<p>المعادلات المستعملة (من الشكل والأمثلة):</p>
   $$P_{in}=P_o+P_{cu1}+P_{cor}+P_F\\qquad P_{cu1}=3I_{ph}^2R_A$$
   $$\\eta\\%=\\frac{P_o}{P_{in}}\\times100\\qquad T_{in}=\\frac{P_{in}}{\\omega}\\qquad \\omega=\\frac{2\\pi n}{60}$$
   <p>\\(T\\) بالنيوتن·متر و\\(\\omega\\) بالراديان/ثانية.</p>`},
  {note:'<b>ملاحظة على العنوان:</b> «مخطط توزيع القدرة» في الكتاب يشمل علاقة القدرة بزاوية δ (3-15، 3-16) ومخطط سريان القدرة والمفاقيد (3-17).'},
  {err:'مثال (3-2) جـ ص 120: كُتب \\(P_o=3\\times308.8\\times60\\times0.8=34.1\\ kW\\)، والعدد 308.8 جهد حالة الحمل المتقدم. الحالة المطلوبة (0.8 متأخر) جهدها <span class="ltr">236.8 V</span>، والناتج <span class="ltr">34.1 kW</span> صحيح لـ 236.8 (أما 308.8 فتعطي <span class="ltr">44.47 kW</span>). الحاسبة تستعمل 236.8.'},
  {err:'مثال (3-2) د ص 121: كُتب \\(T_{in}=36.6\\times10^3/125.7=191.2\\ Nm\\)، والقسمة الصحيحة <b><span class="ltr">291.2 Nm</span></b> تقريباً. في المختبر والحاسبة مفتاح «كما في الكتاب / المصحح».'}
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
    else{$('#l5t').textContent=fm(T,1)+' N·m';$('#l5tm').innerHTML=pr==='ex32'&&tv==='book'?'<div class="callout">الخطأ المطبوع يخص أرقام المثال فقط؛ بقيم أخرى تُعرض القيمة المحسوبة.</div>':pr==='ex32'?'<div class="callout">المصحح: \\(T_{in}=P_{in}/\\omega\\) بقسمة صحيحة.</div>':''}
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
   note:'<b>ملاحظة على الكتاب:</b> (جـ) طبع الكتاب 308.8 بدل 236.8 والناتج 34.1 kW صحيح؛ (د) طبع 191.2 N·m والصحيح 291.2 N·m.'},
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
  {err:'عنوان الطريقة «طريقة المصابيح المضيئة» (ص 111)، لكن التوصيلة الموصوفة (مصباح بين a و\'a ومصباحان متقاطعان، وشرط الإغلاق: الأول منطفئ والآخران مضاءان) تعرف أيضاً بطريقة <b>المصابيح الدوارة</b> (مصباح مطفأ ومصباحان مضيئان). والكتاب لا يذكر طريقتي «المصابيح المطفأة» و«المصابيح المضيئة» منفصلتين.'},
  {h:'خطوات عملية التزامن',ref:'ص 112–113',html:`<ol><li>يرفع جهد أطراف المولد حتى يساوي جهد القضيب \\(V_m=V_b\\) بزيادة تيار المجال تدريجياً.</li><li>يضبط تردد المولد قريباً من تردد القضيب بزيادة سرعة الدوران.</li>
   <li>عند محاولة ضبط السرعة تحدث إحدى حالتين للمصابيح:<ul><li><b>الحالة الأولى:</b> جميع المصابيح تضيء وتنطفئ بشكل عشوائي: تتابع الأطوار مختلف، فيجب <b>المبادلة بين أي طرفين من أطراف المولد</b> لعكس تتابع أطواره، وبعدها تصبح الإضاءة منتظمة ومتتابعة.</li><li><b>الحالة الثانية:</b> جميع المصابيح تضاء وتنطفئ بشكل منتظم ومتتابع: تتابع الأطوار متماثل.</li></ul></li>
   <li>إذا تحققت الحالة [الثانية] يبقى ضبط التردد بالتحكم في سرعة الآلة، ويتضح ذلك في سرعة تتابع الإضاءة: إذا زادت سرعة التتابع يلزم زيادة أو تقليل سرعة المولد بحيث يكون التتابع بطيئاً قدر الإمكان. وفي اللحظة التي يكون فيها \\(V_S=0\\) <b>أو المصباح الأول منطفئاً بينما الثاني والثالث مضاءان</b> يكون الشرط الرابع قد تحقق، والآلة في لحظة تزامن مع القضيب، <b>وعندها يمكن إغلاق القاطع الرئيسي بأمان</b>.</li></ol>`},
  {err:'الخطوة 4 ص 113 تقول «إذا تحققت <b>الحالة الثالثة</b>»، ولا توجد حالة ثالثة؛ المقصود الحالة الثانية (التتابع المنتظم).'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عندما يكون تتابع الأطوار مختلفاً تضيء المصابيح الثلاثة وتنطفئ <b>معاً</b> بدل أن تتتابع واحداً بعد الآخر؛ هذا هو المقصود بعبارة الكتاب «بشكل عشوائي» (أي غير متتابع)، وهكذا تظهر في المختبر. وعندما يكون التتابع صحيحاً «تدور» الإضاءة على المصابيح الثلاثة، وكلما اقترب التردد من تردد القضيب صار الدوران أبطأ.'},
  {h:'باستخدام جهاز التزامن',ref:'ص 113',html:`<p>جهاز التزامن <span class="ltr">(Synchroscope)</span> الشكل (3-19) يستخدم للتأكد من أن جهد المولد في نفس الطور مع جهد القضبان وأن لهما نفس التردد، أي أنه بديل للمصابيح. وهو «عبارة عن <b>محرك حثي يتعرض لمجالين مغناطيسيين</b>؛ الأول من القضبان اللانهائية والآخر من المولد التزامني، والعضو الدوار مركب عليه مؤشر يتحرك باتجاه عقارب الساعة وعكس عقارب الساعة يعتمد على تردد المولد التزامني أهو أعلى أم أقل من تردد القضبان اللانهائية». و«<b>عندما يقف المؤشر بشكل عمودي (في مكان الساعة 12)</b> فهذا يعني أن جهد المولد في نفس الطور مع جهد القضبان»، وعندها يوصل المولد بأمان عن طريق القاطع الرئيسي.</p>`},
  {fig:'(3-19)',ref:'ص 113',caption:'جهاز التزامن: المؤشر عند الساعة 12، و«Slow» يساراً بسهم عكس عقارب الساعة و«Fast» يميناً بسهم مع عقارب الساعة',draw:()=>svgbox(syncSVG(0),240)},
  {err:'رقم الشكل (3-19) مكرر في الكتاب: «جهاز التزامن» ص 113 و«منحنى اللاحمل» لمثال (3-1) ص 114 يحملان الرقم نفسه، ونص المثال وحله يحيلان إلى «الشكل (3-19)» قاصدين منحنى اللاحمل.'},
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
 theory:[
  {h:'الأمثلة المحلولة',ref:'ص 114–121',html:`<p>يحل الكتاب مثالين كبيرين يجمعان كل ما سبق في الوحدة:</p><ul><li><b>مثال (3-1)</b> (ص 114–116): مولد بأربعة أقطاب، دلتا، <span class="ltr">480 V</span>، <span class="ltr">60 Hz</span>، \\(X_S=0.1\\ \\Omega\\)، \\(R_A=0.015\\ \\Omega\\)، حمل كامل <span class="ltr">1200 A</span> عند 0.8 متأخر، مفاقيد احتكاك <span class="ltr">40 kW</span> وحديد <span class="ltr">30 kW</span>. المطلوب: السرعة، وتيار المجال عند اللاحمل وعند الحمل المتأخر والمتقدم (يُقرأ من منحنى اللاحمل)، والكفاءة، والجهد إذا فُصل الحمل فجأة.</li>
   <li><b>مثال (3-2)</b> (ص 117–121): مولد بستة أقطاب، نجمة، <span class="ltr">480 V</span>، <span class="ltr">60 Hz</span>، \\(X_S=1\\ \\Omega\\)، \\(R_A\\) مهملة، حمل كامل <span class="ltr">60 A</span> عند 0.8 متأخر، احتكاك <span class="ltr">1.5 kW</span> وحديد <span class="ltr">1 kW</span>، وتيار المجال ضُبط ليكون الجهد <span class="ltr">480 V</span> عند عدم الحمل. المطلوب: السرعة، وجهد الأطراف في الحالات الثلاث، والكفاءة، والعزم، ومعامل تنظيم الجهد.</li></ul>
   <p>الحلان كاملان في تبويب «الأمثلة المحلولة» بأرقام الكتاب وتقريبه، ويمكنك تغيير المعطيات.</p>`},
  {fig:'(3-19)',ref:'ص 114',caption:'منحنى اللاحمل لمولد مثال (3-1): الجهد الداخلي \\(E_{Ph}\\) مقابل تيار المجال \\(I_F\\)، مع النقاط التي استعملها الحل (<span class="ltr">451 V ↔ 4.1 A</span>، <span class="ltr">480 V ↔ 4.5 A</span>، <span class="ltr">532 V ↔ 5.7 A</span>). أُعيد رسم المنحنى من قراءات تقريبية للشكل المطبوع',draw:()=>svgbox(fig319b(),520)},
  {err:'هذا الشكل يحمل الرقم (3-19) نفسه الذي يحمله «جهاز التزامن» في ص 113؛ ونص المثال وحله يقصدان منحنى اللاحمل هذا.'},
  {err:'نص مثال (3-1) ص 114: الفقرة (جـ) تنتهي بعبارة «كم يجب أن يكون» في غير موضعها (ترتيب مضطرب)، وفي الفقرة (و) «عند معامل قدره 0.8» والصواب «معامل قدرة».'},
  {html:`<p><b>هـ) في مثال (3-1):</b> «إذا فصل الحمل بشكل مفاجئ عن المولد يعني أن التيار سيصبح صفراً، وهذا يعني أن \\((E_{Ph}=V_{Ph})\\) طبقاً للمعادلة (3-9)، وإذا لم يعاد ضبط تيار المجال فإن جهد الأطراف سيرتفع إلى قيمة الجهد الداخلي أي أن \\((V_{Ph}=532\\ V)\\)» <span class="ref">ص 116</span>.</p>
   <p><b>ب) في مثال (3-2):</b> «لحساب جهد الأطراف عند تحميل المولد يستحسن استخدام المخطط الاتجاهي … بدلاً من استخدام المعادلة (3-9) لأنها في هذه الحالة ستحتوي على مجهولين هما زاوية الجهد الداخلي \\((\\delta)\\) بالإضافة إلى جهد الأطراف \\(V_{Ph}\\)» <span class="ref">ص 118</span>. لذلك يحل الكتاب بالمثلث القائم oab في الشكل (3-20).</p>`},
  {fig:'(3-20)',ref:'ص 120',caption:'المخطط الاتجاهي للمولد التزامني في حالات تحميل مختلفة بأرقام مثال (3-2): (1) 0.8 متأخر، (2) معامل قدرة 1، (3) 0.8 متقدم. الجهد الداخلي ثابت 277 V في الحالات الثلاث (أُعيد رسمه)',draw:fig320},
  {err:'مثال (3-2) جـ ص 120: \\(P_o=3\\times308.8\\times60\\times0.8=34.1\\ kW\\) — العدد المقصود 236.8 (جهد حالة 0.8 متأخر)، والناتج 34.1 kW صحيح له. والعدد 308.8 يعطي 44.47 kW.'},
  {err:'مثال (3-2) هـ ص 121: الحالة (2) حُسبت بالجهد 468 بدل 468.4، فطُبع \\(V_R=2.6\\%\\)؛ وبالجهد 468.4 تكون <span class="ltr">2.48%</span>. نعرض رقم الكتاب ومعه هذه الملاحظة.'},
  {h:'العزم الداخل في مثال (3-2) د',ref:'ص 121',widget:(el)=>{let v='book';const draw=()=>{el.innerHTML=`<div class="sg-row">${segHTML('tq',[['book','كما في الكتاب'],['fixed','المصحح']],v)}</div><div class="callout${v==='book'?' err':''}" style="margin-top:8px">${B.tex('\\omega=\\frac{2\\pi n}{60}=\\frac{2\\pi\\times1200}{60}=125.7\\ rad/s',true)}${B.tex(v==='book'?'T_{in}=\\frac{36.6\\times10^3}{125.7}=191.2\\ Nm':'T_{in}=\\frac{36.6\\times10^3}{125.7}=291.2\\ Nm',true)}${v==='book'?'هذا الرقم مطبوع في الكتاب، والقسمة خاطئة.':'القسمة الصحيحة: 36600 ÷ 125.7 = 291.17 ≈ 291.2 N·m.'}</div>`;segOn(el,'tq',x=>{v=x;draw()})};draw()}},
  {err:'مثال (3-2) د ص 121: \\(T_{in}=36.6\\times10^3/125.7\\) طُبع ناتجها <span class="ltr">191.2 Nm</span>، والصحيح <span class="ltr">291.2 Nm</span> تقريباً.'},
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
  {err:'التمرين 10 ص 122–123: قيم \\(E_{Ph}\\) في الجدول تصل إلى <span class="ltr">2850 V</span>، بينما جهد الوجه لمولد نجمة <span class="ltr">2300 V</span> هو <span class="ltr">1328 V</span> فقط؛ فلا يتضح هل الجدول بجهد الوجه (كما كُتب) أم بالجهد الخطي. لذلك نعرض قراءتي تيار المجال كلتيهما في الحاسبة والمختبر («كما في الكتاب» = جهد وجه، و«المصحح» = جهد خطي). كما أن الفقرة (جـ) تستعمل 0.85 متأخر بينما معطيات الحمل الكامل 0.8 متأخر.'},
  {err:'التمرين 11 جـ ص 123: «كفاءة <b>المحرك</b>» والسؤال عن مولد.'},
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
     `<div class="callout${tbl==='book'?' err':''}">${tbl==='book'?'<b>كما في الكتاب:</b> الجدول يُقرأ بجهد الوجه (كما كُتب فوقه \\(E_{Ph}\\)).':'<b>المصحح (تفسير):</b> الجدول بالجهد الخطي، فنقارن به \\(\\sqrt3\\,E_{ph}\\).'} القراءة بالاستيفاء الخطي بين نقطتي الجدول. ${ld==='lag'?'الفقرة (جـ) تستعمل 0.85 متأخر.':''}</div>`;B.math($('#l7m'))}
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
   note:'<b>ملاحظات على الكتاب:</b> (جـ) طُبع 308.8 بدل 236.8 والناتج 34.1 kW صحيح. (د) طُبع 191.2 N·m والصحيح 291.2 N·m (الحاسبة تعرض الرقمين). (هـ) الحالة 2: 2.6% بتقريب 468.4 إلى 468، وبدونه 2.48%.'},
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
