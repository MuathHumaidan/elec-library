/* Unit 2 — مولدات التاكو (ص 27–42) */
(function(B){
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const PI=Math.PI,N2W=PI/30,W2N=30/PI;            // rpm <-> rad/s
const fm=(x,d)=>B.fmtN(x,d);
const lt=s=>`<span class="ltr">${s}</span>`;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());
const K_EX=12/(1000*N2W*0.1);                      // من مثال (٢-١): 12 V عند 0.1 A و 1000 rpm  =>  K_E = 1.1459·I_f

/* ---------- styles used only by this unit (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('u2tk-css'))return;const s=document.createElement('style');s.id='u2tk-css';s.textContent=`
.tk-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px}
.tk-sl .tk-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.tk-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.tk-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.tk-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.tk-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.tk-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:5px}
.tk-leg i.d{background:none!important;border-top:3px dashed currentColor;height:0}
.tk-chart{position:relative;height:230px;margin-top:8px}.tk-chart canvas{position:absolute;inset:0;width:100%;height:100%}
.tk-chart.sm{height:170px}
.tk-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.tk-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.tk-q ol{margin:6px 0}
.tk-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.tk-svg{max-width:440px;margin-inline:auto}
.tk-msg{margin-top:10px}
.tk-try{margin:6px 0 0;padding-inline-start:22px;font-size:14px;line-height:1.8}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}};}
const sl=(id,label,min,max,step,val)=>`<label class="tk-sl"><span class="tk-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
function cssv(){const cs=getComputedStyle(document.documentElement);return n=>cs.getPropertyValue(n).trim()||'#888'}
function niceStep(range,n){const raw=range/n,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return (m<1.5?1:m<3?2:m<7?5:10)*p}
const logR=p=>Math.pow(10,1+4*p/100);              // slider 0..100  ->  10 Ω .. 100 kΩ
const fmtR=r=>r>=1000?fm(r/1000,r>=10000?0:1)+' kΩ':fm(r,0)+' Ω';

/* canvas x-y plot:  o={xmin,xmax,ymin,ymax,xlabel,ylabel,series:[{pts,color,width,dash}],points:[{x,y,color}],shade:[{x0,x1,color,label}],arrows:[{x,y0,y1,color,label}]} */
function plot(cv,o){
  const r=cv.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width||!r.height)return;
  const Wd=Math.round(r.width*dpr),Hd=Math.round(r.height*dpr);if(cv.width!==Wd||cv.height!==Hd){cv.width=Wd;cv.height=Hd}
  const g=cv.getContext('2d'),w=r.width,h=r.height,col=cssv();g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);g.direction='ltr';
  const l=46,rt=12,t=12,bm=34,pw=w-l-rt,ph=h-t-bm;
  const x0=o.xmin||0,x1=o.xmax,y0=o.ymin||0,y1=o.ymax;
  const X=x=>l+(x-x0)/(x1-x0)*pw,Y=y=>t+ph-(y-y0)/(y1-y0)*ph;
  const font=(col('--mono')||'monospace');g.font='11px '+font;
  (o.shade||[]).forEach(s=>{if(s.x1<=s.x0)return;g.fillStyle=col(s.color);g.globalAlpha=.16;g.fillRect(X(s.x0),t,X(Math.min(s.x1,x1))-X(s.x0),ph);g.globalAlpha=1});
  g.strokeStyle=col('--line');g.lineWidth=1;g.fillStyle=col('--muted');
  const xs=o.xstep||niceStep(x1-x0,6),ys=o.ystep||niceStep(y1-y0,5);
  g.textAlign='center';g.textBaseline='top';
  for(let v=Math.ceil(x0/xs-1e-9)*xs;v<=x1+1e-9;v+=xs){const xx=X(v);g.beginPath();g.moveTo(xx,t);g.lineTo(xx,t+ph);g.stroke();g.fillText(String(+v.toFixed(6)),xx,t+ph+4)}
  g.textAlign='right';g.textBaseline='middle';
  for(let v=Math.ceil(y0/ys-1e-9)*ys;v<=y1+1e-9;v+=ys){const yy=Y(v);g.beginPath();g.moveTo(l,yy);g.lineTo(l+pw,yy);g.stroke();g.fillText(String(+v.toFixed(6)),l-5,yy)}
  g.strokeStyle=col('--fg');g.lineWidth=1.3;g.beginPath();g.moveTo(l,t);g.lineTo(l,t+ph);g.lineTo(l+pw,t+ph);g.stroke();
  if(y0<0&&y1>0){g.beginPath();g.moveTo(l,Y(0));g.lineTo(l+pw,Y(0));g.stroke()}
  g.fillStyle=col('--muted');g.textAlign='right';g.textBaseline='bottom';if(o.xlabel)g.fillText(o.xlabel,l+pw,h-1);
  g.save();g.beginPath();g.rect(l,t,pw,ph);g.clip();
  (o.shade||[]).forEach(s=>{if(s.label&&s.x1>s.x0){g.fillStyle=col(s.color);g.textAlign='left';g.textBaseline='bottom';g.fillText(s.label,X(s.x0)+3,t+ph-3)}});
  (o.series||[]).forEach(s=>{if(!s.pts||!s.pts.length)return;g.strokeStyle=col(s.color);g.lineWidth=s.width||2.4;g.setLineDash(s.dash||[]);g.beginPath();s.pts.forEach((p,i)=>{const xx=X(p[0]),yy=Y(p[1]);i?g.lineTo(xx,yy):g.moveTo(xx,yy)});g.stroke();g.setLineDash([])});
  (o.arrows||[]).forEach(a=>{if(Math.abs(Y(a.y1)-Y(a.y0))<4)return;const xx=X(a.x),ya=Y(a.y0),yb=Y(a.y1),c=col(a.color||'--stop');g.strokeStyle=c;g.fillStyle=c;g.lineWidth=1.8;g.setLineDash([4,3]);g.beginPath();g.moveTo(xx,ya);g.lineTo(xx,yb);g.stroke();g.setLineDash([]);
    [[ya,yb],[yb,ya]].forEach(([p,q])=>{const d=q>p?1:-1;g.beginPath();g.moveTo(xx,q);g.lineTo(xx-4,q-6*d);g.lineTo(xx+4,q-6*d);g.closePath();g.fill()});
    if(a.label){g.textAlign=xx>l+pw-60?'right':'left';g.textBaseline='middle';g.font='bold 12px '+font;g.fillText(a.label,xx+(g.textAlign==='right'?-7:7),(ya+yb)/2);g.font='11px '+font}});
  (o.points||[]).forEach(p=>{g.fillStyle=col(p.color||'--fg');g.beginPath();g.arc(X(p.x),Y(p.y),p.r||5,0,7);g.fill();g.strokeStyle=col('--surface');g.lineWidth=2;g.stroke()});
  g.restore();
  if(o.ylabel){g.fillStyle=col('--muted');g.textAlign='left';g.textBaseline='top';g.fillText(o.ylabel,l+5,t+2)}
}
const legend=items=>`<div class="tk-leg">${items.map(([c,l,d])=>`<span><i class="${d?'d':''}" style="${d?'color':'background'}:var(${c})"></i>${l}</span>`).join('')}</div>`;

/* analog voltmeter (DC) */
function meterSVG(v,vmax,lbl,sub){
  const cx=110,cy=112,R=84,a=clamp(v/vmax,0,1.03),th=PI-a*PI;
  let s=`<svg viewBox="0 0 220 150" role="img" aria-label="جهاز قياس"><rect x="4" y="4" width="212" height="142" rx="12" fill="var(--surface-2)" stroke="var(--line)"/>`;
  s+=`<path d="M${cx-R} ${cy}A${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
  for(let i=0;i<=10;i++){const t=PI-i/10*PI,r1=i%2?R-6:R-11;s+=`<path d="M${(cx+R*Math.cos(t)).toFixed(1)} ${(cy-R*Math.sin(t)).toFixed(1)}L${(cx+r1*Math.cos(t)).toFixed(1)} ${(cy-r1*Math.sin(t)).toFixed(1)}" stroke="var(--fg)" stroke-width="1.4"/>`;
    if(i%2===0)s+=`<text class="txt m" x="${(cx+(R-22)*Math.cos(t)).toFixed(1)}" y="${(cy-(R-22)*Math.sin(t)+4).toFixed(1)}" text-anchor="middle">${+(vmax*i/10).toFixed(2)}</text>`}
  s+=`<text class="txt" x="${cx}" y="${cy-30}" text-anchor="middle" font-size="16">${lbl||'V'}</text>`;
  s+=`<path d="M${cx} ${cy}L${(cx+(R-4)*Math.cos(th)).toFixed(1)} ${(cy-(R-4)*Math.sin(th)).toFixed(1)}" stroke="var(--stop)" stroke-width="2.6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="var(--fg)"/>`;
  s+=`<text class="txt" x="${cx}" y="${cy+26}" text-anchor="middle" font-size="15">${sub||''}</text>`;
  return s+'</svg>';
}
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"></tspan>`;
/* zig-zag resistor */
function zig(x1,y1,x2,y2,n){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.18,seg=(len-2*lead)/n;let p=`M${x1} ${y1}L${(x1+ux*lead).toFixed(1)} ${(y1+uy*lead).toFixed(1)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${(x1+ux*m+nx*s).toFixed(1)} ${(y1+uy*m+ny*s).toFixed(1)}`}
  return p+`L${(x2-ux*lead).toFixed(1)} ${(y2-uy*lead).toFixed(1)}L${x2} ${y2}`}
function arrowP(x1,y1,x2,y2,color,w){const L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const ux=(x2-x1)/L,uy=(y2-y1)/L,h=Math.min(10,L*.5);
  return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${(x2-ux*h*.8).toFixed(1)} ${(y2-uy*h*.8).toFixed(1)}" stroke="var(${color})" stroke-width="${w||3}" stroke-linecap="round"/><path d="M${x2.toFixed(1)} ${y2.toFixed(1)}L${(x2-ux*h-uy*h*.5).toFixed(1)} ${(y2-uy*h+ux*h*.5).toFixed(1)}L${(x2-ux*h+uy*h*.5).toFixed(1)} ${(y2-uy*h-ux*h*.5).toFixed(1)}Z" fill="var(${color})"/>`}

/* ---------- الشكل (٢-١): DC tacho with separately excited field ---------- */
function dcCircuitSVG(o){o=o||{};const live=!!o.live,If=o.If||0,sw=o.sw!==false,Va=o.Va||0,Ia=o.Ia||0;
  const fc=live?(If>0?'w flow':'w'):'w',ac=live?(Va>0.01?(sw&&Ia>1e-6?'w flow':'w live'):'w'):'w',lc=live?(sw&&Ia>1e-6?'w flow':''):'';
  let s=`<svg viewBox="0 0 520 240" role="img" aria-label="مولد التاكو للتيار المستمر ذو التغذية المستقلة">`;
  // field circuit
  s+=`<path class="${fc}" d="M50 99V40H150V62M150 168V196H50V131"/><path class="${fc}" d="${zig(150,62,150,168,8)}"/>`;
  s+=`<circle cx="50" cy="115" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`+arrowP(50,128,50,102,'--fg',2);
  s+=`<text class="txt" x="28" y="119" text-anchor="end">${sb('V','f')}</text>`;
  s+=arrowP(80,30,118,30,'--blue',2)+`<text class="txt b" x="99" y="22" text-anchor="middle">${sb('I','f')}</text>`;
  s+=`<text class="txt" x="166" y="119">R</text>`;
  if(live)s+=`<text class="txt b" x="100" y="216" text-anchor="middle">${sb('I','f')} = ${fm(If,3)} A</text>`;
  // armature circuit
  s+=`<path class="${ac}" d="M250 89V40H282"/><path class="${ac}" d="${zig(282,40,348,40,6)}"/><path class="${ac}" d="M348 40H392"/>`;
  s+=`<path class="${ac}" d="M250 141V196H372"/>`;
  s+=`<path class="${live?(sw&&Ia>1e-6?'w flow':''):'w'}" d="M432 40H470V62M470 168V196H372"/><path class="${live?(sw&&Ia>1e-6?'w flow':'w'):'w'}" d="${zig(470,62,470,168,8)}"/>`;
  // switch
  s+=`<circle cx="392" cy="40" r="3.5" fill="var(--fg)"/><circle cx="432" cy="40" r="3.5" fill="var(--fg)"/>`;
  s+=sw?`<path d="M392 40L432 40" stroke="var(--fg)" stroke-width="2.4"/>`:`<path d="M392 40L428 20" stroke="var(--fg)" stroke-width="2.4"/>`;
  s+=`<text class="txt m" x="412" y="62" text-anchor="middle">switch</text>`;
  // generator
  s+=`<circle cx="250" cy="115" r="26" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><rect x="243" y="83" width="14" height="8" fill="var(--fg)"/><rect x="243" y="139" width="14" height="8" fill="var(--fg)"/>`;
  s+=`<text class="txt" x="250" y="119" text-anchor="middle">${sb('E','a')}</text>`;
  s+=arrowP(232,52,232,80,'--blue',2)+`<text class="txt b" x="226" y="68" text-anchor="end">${sb('I','a')}</text>`;
  s+=`<text class="txt" x="315" y="24" text-anchor="middle">${sb('R','a')}</text>`;
  // terminals + Va
  s+=`<circle cx="372" cy="40" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="372" cy="196" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
  s+=arrowP(372,170,372,66,'--fg',1.6)+`<text class="txt" x="364" y="112" text-anchor="end">${sb('V','a')} = ${sb('V','T')}</text>`;
  s+=arrowP(490,82,490,118,'--blue',2)+`<text class="txt b" x="496" y="104" text-anchor="start">${sb('I','L')}</text><text class="txt" x="452" y="119" text-anchor="end">${sb('R','L')}</text>`;
  if(live)s+=`<text class="txt b" x="372" y="226" text-anchor="middle">${sb('V','a')} = ${fm(Va,2)} V · ${sb('I','a')} = ${Ia<0.01?fm(Ia*1000,2)+' mA':fm(Ia,3)+' A'}</text>`;
  return s+'</svg>';
}
/* ---------- الشكل (٢-٢): ideal vs actual characteristic ---------- */
function fig22SVG(){
  const ox=60,oy=230,Wx=380,Hy=200;let s=`<svg viewBox="0 0 470 270" role="img" aria-label="العلاقة بين الجهد المتولد وسرعة الدوران">`;
  s+=`<path d="M${ox} ${oy}H${ox+Wx}M${ox} ${oy}V${oy-Hy}" stroke="var(--fg)" stroke-width="1.8" fill="none"/>`+arrowP(ox+Wx-4,oy,ox+Wx+6,oy,'--fg',1.8)+arrowP(ox,oy-Hy+4,ox,oy-Hy-6,'--fg',1.8);
  s+=`<text class="txt" x="${ox+Wx}" y="${oy+22}" text-anchor="end">Speed (ω)</text><text class="txt" x="${ox+6}" y="${oy-Hy-2}" text-anchor="start">Generated Voltage (${sb('V','a')})</text>`;
  // ideal line
  s+=`<path d="M${ox} ${oy}L${ox+330} ${oy-185}" stroke="var(--blue)" stroke-width="2.6" fill="none"/>`;
  s+=`<text class="txt b" x="${ox+212}" y="${oy-150}" text-anchor="end">Ideal Characteristic</text><text class="txt b" x="${ox+212}" y="${oy-136}" text-anchor="end">${sb('R','L')} = ∞</text>`;
  // actual curve: starts at dead zone, bends down
  let p='';const dz=34;for(let i=0;i<=40;i++){const x=dz+i*(330-dz)/40,u=(x-dz),y=0.56*u/(1+u/700)*1.0;p+=(i?'L':'M')+(ox+x).toFixed(1)+' '+(oy-y).toFixed(1)}
  s+=`<path d="${p}" stroke="var(--live)" stroke-width="2.6" fill="none"/>`;
  s+=`<text class="txt" x="${ox+300}" y="${oy-88}" text-anchor="start" style="fill:var(--live)">Actual</text><text class="txt" x="${ox+300}" y="${oy-74}" text-anchor="start" style="fill:var(--live)">Characteristic</text><text class="txt" x="${ox+300}" y="${oy-60}" text-anchor="start" style="fill:var(--live)">${sb('R','L')} = small</text>`;
  // dead zone
  s+=`<rect x="${ox}" y="${oy-Hy}" width="${dz}" height="${Hy}" fill="var(--stop)" opacity=".1"/>`;
  s+=`<path d="M${ox} ${oy+10}H${ox+dz}" stroke="var(--stop)" stroke-width="1.6"/><path d="M${ox} ${oy+5}V${oy+15}M${ox+dz} ${oy+5}V${oy+15}" stroke="var(--stop)" stroke-width="1.6"/>`;
  s+=`<text class="txt" x="${ox+dz/2}" y="${oy+28}" text-anchor="middle" style="fill:var(--stop)">Δω</text><text class="txt" x="${ox+dz+4}" y="${oy-8}" text-anchor="start" style="fill:var(--stop)">Dead zone</text>`;
  // ΔV
  const xv=ox+280,yi=oy-280*185/330,u=280-dz,ya=oy-0.56*u/(1+u/700);
  s+=`<path d="M${xv} ${yi}V${ya}" stroke="var(--stop)" stroke-width="1.8" stroke-dasharray="5 4"/>`+arrowP(xv,(yi+ya)/2,xv,yi+1,'--stop',1.6)+arrowP(xv,(yi+ya)/2,xv,ya-1,'--stop',1.6);
  s+=`<text class="txt" x="${xv+8}" y="${(yi+ya)/2+4}" style="fill:var(--stop)">ΔV</text>`;
  return s+'</svg>';
}
/* ---------- الشكل (٢-٣): induction tacho ---------- */
function indSVG(o){o=o||{};const cx=160,cy=160,ang=o.ang||0,pf=o.pf==null?0.8:o.pf,pg=o.pg||0,mis=(o.mis||0);
  let s=`<svg viewBox="0 0 320 330" role="img" aria-label="رسم توضيحي لمولد تاكو حثي">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="118" fill="none" stroke="var(--line)" stroke-width="16"/>`;
  const coil=(x,y,vert,cls,lab)=>{let p='';const n=5;for(let i=0;i<n;i++){const k=i*9-18;p+=vert?`M${x-20} ${y+k}h40`:`M${x+k} ${y-20}v40`}
    return `<rect x="${vert?x-24:x-26}" y="${vert?y-26:y-24}" width="${vert?48:52}" height="${vert?52:48}" rx="6" fill="var(--surface)" stroke="var(${cls})" stroke-width="2"/><path d="${p}" stroke="var(${cls})" stroke-width="3" stroke-linecap="round"/>`};
  // field winding m (horizontal axis) — left & right
  s+=coil(cx-98,cy,false,'--blue')+coil(cx+98,cy,false,'--blue');
  // generating winding a (vertical axis) — top & bottom, optionally misaligned
  s+=`<g transform="rotate(${(mis).toFixed(2)} ${cx} ${cy})">`+coil(cx,cy-98,true,'--live')+coil(cx,cy+98,true,'--live')+`</g>`;
  // rotor (drag cup) with 8 small circles as printed + centre
  s+=`<g id="indRot" transform="rotate(${ang.toFixed(1)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="58" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
  for(let i=0;i<8;i++){const t=i*PI/4;s+=`<circle cx="${(cx+46*Math.cos(t)).toFixed(1)}" cy="${(cy+46*Math.sin(t)).toFixed(1)}" r="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`}
  s+=`<circle cx="${cx}" cy="${cy}" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/></g>`;
  // flux arrows
  if(o.arrows){const lf=pf*62,lg=pg*62;
    if(Math.abs(lf)>3)s+=arrowP(cx-lf,cy,cx+lf,cy,'--blue',3.4);
    if(Math.abs(lg)>3)s+=arrowP(cx,cy+lg,cx,cy-lg,'--live',3.4);
    s+=`<text class="txt b" x="${cx+44}" y="${cy-8}">${sb('φ','f')}</text>`;if(Math.abs(lg)>3)s+=`<text class="txt" x="${cx+8}" y="${cy-40}" style="fill:var(--live)">${sb('φ','g')}</text>`}
  s+=`<text class="txt" x="${cx}" y="${cy-132}" text-anchor="middle" style="fill:var(--live)">a  Generating Winding</text>`;
  s+=`<text class="txt b" x="${cx}" y="${cy+150}" text-anchor="middle">m  Field Winding (left/right)</text>`;
  s+=`<text class="txt m" x="${cx}" y="${cy+166}" text-anchor="middle">Stator Windings · Rotor</text>`;
  return s+'</svg>';
}

/* ---------- complex helpers (for الشكل ٢-٣ model and مثال ٢-٤) ---------- */
const Cx=(re,im)=>({re,im:im||0}),cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im),csub=(a,b)=>Cx(a.re-b.re,a.im-b.im),cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},cabs=a=>Math.hypot(a.re,a.im),cang=a=>Math.atan2(a.im,a.re)*180/PI,cpol=(m,d)=>Cx(m*Math.cos(d*PI/180),m*Math.sin(d*PI/180)),
  cpar=(a,b)=>cdiv(cmul(a,b),cadd(a,b));
const wrap180=d=>{d=((d+180)%360+360)%360-180;return d};
/* single-phase-motor equivalent circuit used as an induction tacho (أرقام توضيحية) */
const IND={V:115,f:50,ns:3000,R1:30,X1:25,Xm:250,R2:200,X2:25};
function indModel(nr,n,P){P=P||IND;const s=1-nr/P.ns;const Zr=x=>Cx(P.R2/x,P.X2);const Zf=cpar(Cx(0,P.Xm),Zr(s)),Zb=cpar(Cx(0,P.Xm),Zr(2-s));
  const Zin=cadd(cadd(Cx(P.R1,P.X1),cmul(Cx(.5),Zf)),cmul(Cx(.5),Zb));const I1=cdiv(Cx(P.V),Zin);
  const Ea=cmul(cmul(Cx(0,.5*n),I1),csub(Zf,Zb));return {s,Zf,Zb,I1,Ea}}

/* ---------- مثال (٢-٤) solver, book procedure (shared with س٢-٣) ---------- */
function solveInd(g,isBook,labels){
  const k=B.round(0.5*g.n*g.I1m,3);                       // 1.436
  const dR=B.round(g.Rf-g.Rb,2),dX=B.round(g.Xf-g.Xb,2);   // 29.92 , 38.18
  const dZ=Cx(g.Rf-g.Rb,g.Xf-g.Xb),zm=B.round(cabs(dZ),1),za=B.round(cang(dZ),2);   // 48.5 , 51.92
  const Em=B.round(k*zm,2),Ea=B.round(g.I1a+za+90,2);
  const exact=cmul(cmul(Cx(0,.5*g.n),cpol(g.I1m,g.I1a)),dZ);
  const sg=v=>(v<0?'-':'+')+' j'+fm(Math.abs(v),2);
  return [
   {t:'الجهد المتولد على الملف المساعد (المعادلة ٢-١٣):',f:'E_a = j\\,0.5\\times n\\,I_1\\cdot(Z_f - Z_b)'},
   {t:'بالتعويض:',f:`= j\\,0.5\\times ${g.n}\\times ${g.I1m}\\angle ${g.I1a}^\\circ\\,(${g.Rf} + j${g.Xf} - ${g.Rb} - j${g.Xb})`},
   {t:'نضرب الأعداد الحقيقية: 0.5 × n × |I<sub>1</sub>|',v:k,dp:3,unit:`∠ ${fm(g.I1a,1)}°`},
   {t:'نطرح المعاوقتين ثم نحوّل الناتج إلى الصورة القطبية (المقدار بتقريب الكتاب لخانة واحدة):',f:`Z_f - Z_b = ${fm(dR,2)} ${sg(dX)} = ${fm(zm,1)}\\angle ${fm(za,2)}^\\circ`},
   {t:'نضرب (المقادير تُضرب والزوايا تُجمع، و j تضيف 90°):',f:`= j\\,(${fm(k,3)}\\angle ${fm(g.I1a,1)}^\\circ)\\times(${fm(zm,1)}\\angle ${fm(za,2)}^\\circ)`},
   {t:labels.final,v:`${fm(Em,2)} ∠ ${fm(Ea,2)}°`,unit:'volt',final:true},
   {t:labels.say(fm(Em,2),fm(Ea,2))},
   {t:'للمقارنة (ليس من الكتاب): الحساب بلا تقريب للخطوات يعطي',v:`${fm(cabs(exact),2)} ∠ ${fm(cang(exact),2)}°`,unit:'V'}
  ];
}

/* ============================== Lesson 2.1 ============================== */
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'28–29',
 title:'مولدات التاكو: التعريف والمتطلبات الرئيسية',
 summary:'مولد التاكو مولد صغير يحوّل سرعة الدوران إلى جهد يتناسب معها (Va = Kg·ω)، وأنواعه الثلاثة، والمتطلبات الخمس التي تراعى عند تصميمه (ΔV و Δβ و Kg والقصور الذاتي والثابت الزمني).',
 stations:[
  (/*DCML-BEGIN*/(window.DCML=window.DCML||(function(){
/* «مختبر مصغّر» — أدوات صغيرة مشتركة لمحطات الأسلوب التفاعلي في مقرر آلات التيار المستمر والمحولات.
   تُعرَّف مرة واحدة (أول درس في كل ملف وحدة يحمل نسخة مطابقة، والأولى التي تُحمَّل هي المستعملة). */
const css=`
.ml{--mlh:42px}
.ml .ml-in{margin:0 0 10px;color:var(--muted);font-size:14px;line-height:1.8}
.ml .ml-b{font:inherit;font-size:14px;min-height:var(--mlh);padding:7px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--fg);cursor:pointer;line-height:1.5;text-align:start}
.ml .ml-b:hover:not(:disabled){border-color:var(--blue)}
.ml .ml-b:disabled{cursor:default}
.ml .ml-b[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.ml .ml-b.ok{border-color:var(--on);background:var(--on-soft);color:var(--fg)}
.ml .ml-b.no{border-color:var(--stop);background:var(--stop-soft);color:var(--fg)}
.ml .ml-b.dim{opacity:.55}
.ml .ml-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.ml .ml-fb{margin-top:10px;font-size:14.5px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px}
.ml .ml-fb.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.ml .ml-fb.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.ml .ml-fb:empty,.ml [hidden]{display:none}
.ml .ml-it{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:8px;background:var(--surface)}
.ml .ml-it p{margin:0 0 8px;line-height:1.75}
.ml .ml-it .ml-row{margin-top:0}
.ml .ml-why{margin-top:8px;font-size:14px;line-height:1.75}
.ml .ml-score{margin-top:10px;font-weight:700}
.ml .ml-ord{margin:10px 0 0;padding-inline-start:22px}
.ml .ml-ord li{margin:6px 0;padding:6px 10px;border-radius:10px;background:var(--on-soft);border:1px solid var(--on);line-height:1.6}
.ml .ml-pool{display:grid;gap:8px;margin-top:10px}
.ml .ml-sl{display:block;margin-top:12px;font-size:14px}
.ml .ml-sl .ml-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ml .ml-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:15px;white-space:nowrap}
.ml .ml-sl input{width:100%;accent-color:var(--blue);direction:ltr;margin:6px 0 0;height:28px}
.ml .ml-seg{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ml .ml-seg .ml-b{padding:6px 12px;min-height:40px}
.ml .ml-lbl{font-size:14px;margin-top:12px}
.ml .ml-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:8px;margin-top:12px}
.ml .ml-facts div{background:var(--surface-2);border-radius:12px;padding:8px 10px;min-width:0}
.ml .ml-facts span{display:block;font-size:12.5px;color:var(--muted);line-height:1.5}
.ml .ml-facts b{display:block;font-family:var(--mono);font-size:17px;direction:ltr;text-align:end;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ml .ml-facts div.hi{background:var(--blue-soft)}
.ml .ml-facts div.bad{background:var(--stop-soft)}
.ml .ml-bar{margin-top:10px}
.ml .ml-bar .ml-h{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--muted)}
.ml .ml-bar .ml-h b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--fg)}
.ml .ml-bar .ml-t{height:14px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin-top:4px;direction:ltr}
.ml .ml-bar .ml-t i{display:block;height:100%;border-radius:99px;transition:width .2s}
.ml .ml-plot{margin-top:12px;max-width:440px;margin-inline:auto}
.ml .ml-plot svg{width:100%;height:auto;display:block;touch-action:pan-y}
.ml .ml-pic{margin-top:10px;max-width:520px;margin-inline:auto}
.ml .ml-pic svg{width:100%;height:auto;display:block}
.ml .ml-lock{opacity:.45;pointer-events:none;filter:grayscale(.4)}
.ml .ml-pd{border:1.5px dashed var(--blue);border-radius:12px;padding:10px 12px;background:var(--bg)}
.ml .ml-pd .ml-q{font-weight:600;margin-bottom:8px;line-height:1.7}
.ml .ml-pd .ml-pool{margin-top:0}
.ml .ml-tag{display:inline-block;font-size:12px;font-weight:700;padding:1px 9px;border-radius:999px;background:var(--live-soft);color:var(--live);margin-inline-end:6px}
.ml .ml-ill{font-size:12.5px;color:var(--muted);margin-top:8px}
.ml .ltr{direction:ltr;unicode-bidi:isolate;white-space:nowrap}
`;
const addCss=()=>{if(document.getElementById('dcml-css'))return;const s=document.createElement('style');s.id='dcml-css';s.textContent=css;document.head.appendChild(s)};
const lt=s=>`<span class="ltr">${s}</span>`;
const fm=(B,x,d)=>{const s=B.fmtN(x,d);return /^-0(\.0+)?$/.test(s)?s.slice(1):String(s).replace(/^-/,'−')};
const q=(el,s)=>el.querySelector(s),qa=(el,s)=>[...el.querySelectorAll(s)];
const start=(el,B,intro)=>{addCss();el.classList.add('ml');return intro?`<p class="ml-in">${intro}</p>`:''};
const RX=/(\(\d+-\d+\)|\d[\d.,]*\s?(?:rpm|kHz|Hz|kV|V|mA|A|kW|W|Ω|%|N\.m|VA)(?![A-Za-z]))/g;
/* يثبّت اتجاه «رقم + وحدة» داخل النص العربي (مثل 0.3 A و 1000 rpm) حتى لا ينقلب */
function bidi(root){if(!root)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('svg,.katex,.ltr,.ml-facts b,.ml-sl b,.ml-bar b'))return 3;RX.lastIndex=0;return RX.test(n.data)?1:3}});const L=[];while(tw.nextNode())L.push(tw.currentNode);
 L.forEach(n=>{RX.lastIndex=0;const parts=n.data.split(RX);if(parts.length<2)return;const f=document.createDocumentFragment();parts.forEach((p,i)=>{if(!p)return;if(i%2){const sp=document.createElement('span');sp.className='ltr';sp.textContent=p;f.appendChild(sp)}else f.appendChild(document.createTextNode(p))});n.replaceWith(f)})}
const fin=(el,B)=>{try{B.math(el)}catch(e){}bidi(el)};
/* ترتيب ثابت «مخلوط» للعناصر (لا عشوائي حتى تبقى الصفحة نفسها في كل مرة)، ولا يساوي الترتيب الصحيح */
const mix=n=>{const a=[...Array(n).keys()];let s=n*7+3;for(let i=n-1;i>0;i--){s=(s*48271)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}
 if(a.every((v,i)=>v===i)&&n>1)a.push(a.shift());return a};

/* ---- صح أم خطأ: items [[العبارة, true|false, السبب], …] ---- */
function tf(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row"><button type="button" class="ml-b" data-a="1">صح</button><button type="button" class="ml-b" data-a="0">خطأ</button></div><div class="ml-why" hidden></div></div>`).join('');
 h+=`<div class="ml-score" hidden></div>`;el.innerHTML=h;fin(el,B);
 const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-a]').forEach(b=>b.onclick=()=>{const ans=b.dataset.a==='1',ok=ans===!!it[1];
   qa(box,'[data-a]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');if((x.dataset.a==='1')===!!it[1])x.classList.add('ok');else x.classList.add(x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> العبارة ${it[1]?'صحيحة':'خاطئة'}: ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   const n=Object.keys(done).length;if(n===o.items.length){const s=q(el,'.ml-score');const k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+n)}. ${k===n?'ممتاز.':''} <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;
    q(s,'[data-rs]').onclick=()=>tf(el,B,o)}})})}

/* ---- رتّب الخطوات: steps [نص | [نص, لماذا ليست الآن]] بالترتيب الصحيح ---- */
function order(el,B,o){const S=o.steps.map(s=>Array.isArray(s)?s:[s,'']);const m=mix(S.length);let nx=0;
 el.innerHTML=start(el,B,o.intro||'اضغط الخطوات بالترتيب الذي تنفذها به.')+`<ol class="ml-ord"></ol><div class="ml-pool">${m.map(i=>`<button type="button" class="ml-b" data-i="${i}">${S[i][0]}</button>`).join('')}</div><div class="ml-fb"></div><div class="ml-row"><button type="button" class="ml-b" data-rs>ابدأ من جديد</button></div>`;
 fin(el,B);const ol=q(el,'.ml-ord'),fb=q(el,'.ml-fb');
 qa(el,'.ml-pool [data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
  if(i===nx){const li=document.createElement('li');li.innerHTML=S[i][0];ol.appendChild(li);fin(li,B);b.hidden=true;nx++;fb.className='ml-fb';
   fb.innerHTML=nx===S.length?`<b>أحسنت، الترتيب كامل.</b> ${o.done||''}`:(o.after&&o.after[i]?o.after[i]:'');fin(fb,B)}
  else{fb.className='ml-fb bad';fb.innerHTML=`<b>ليست هذه الخطوة التالية.</b> ${S[i][1]||''}${o.hint?' '+o.hint(nx):''}`;fin(fb,B)}});
 q(el,'[data-rs]').onclick=()=>order(el,B,o)}

/* ---- صنّف: cats [اسم, …]; items [[نص, رقم الصنف, السبب], …] ---- */
function sort(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row">${o.cats.map((c,j)=>`<button type="button" class="ml-b" data-c="${j}">${c}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('')+`<div class="ml-score" hidden></div>`;
 el.innerHTML=h;fin(el,B);const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-c]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.c===it[1];
   qa(box,'[data-c]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(+x.dataset.c===it[1]?'ok':x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   if(Object.keys(done).length===o.items.length){const s=q(el,'.ml-score'),k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+o.items.length)}. <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;q(s,'[data-rs]').onclick=()=>sort(el,B,o)}})})}

/* ---- مواقف قصيرة: cases [{q, opts:[[نص, صحيح؟, السبب]]}] ---- */
function cases(el,B,o){let h=start(el,B,o.intro);
 h+=o.cases.map((c,i)=>`<div class="ml-it" data-i="${i}"><p><b>${o.cases.length>1?(i+1)+'. ':''}</b>${c.q}</p><div class="ml-pool">${c.opts.map((x,j)=>`<button type="button" class="ml-b" data-j="${j}">${x[0]}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('');
 el.innerHTML=h;fin(el,B);
 qa(el,'.ml-it').forEach(box=>{const c=o.cases[+box.dataset.i],w=q(box,'.ml-why'),bs=qa(box,'[data-j]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.j,ok=!!c.opts[j][1];
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(c.opts[+x.dataset.j][1]?'ok':x===b?'no':'dim')});
   const right=c.opts.find(x=>x[1]);w.innerHTML=`<b>${ok?'صحيح.':'ليس هذا.'}</b> ${c.opts[j][2]||''}${!ok&&right&&right[2]?'<br>'+right[2]:''} <button type="button" class="ml-b" data-r style="min-height:34px;padding:3px 10px">حاول مرة أخرى</button>`;w.hidden=false;fin(w,B);
   q(w,'[data-r]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});w.hidden=true}})})}

/* ---- رسم بياني صغير: {xr:[a,b], yr:[a,b], xl, yl, curves:[{f|pts, col, dash, w}], dots:[[x,y,col]], cur:[x,y], xt:[...], yt:[...], fx, fy} ---- */
function plot(B,o){const W=o.w||340,H=o.h||210,L=46,R=12,T=26,Bm=34,[x0,x1]=o.xr,[y0,y1]=o.yr;
 const X=x=>L+(x-x0)/((x1-x0)||1)*(W-L-R),Y=y=>H-Bm-(y-y0)/((y1-y0)||1)*(H-T-Bm);const f1=v=>(+v).toFixed(1);
 const tk=(a,b)=>{const sp=(b-a)||1,e=Math.pow(10,Math.floor(Math.log10(sp/4))),st=[1,2,2.5,5,10].map(k=>k*e).find(k=>sp/k<=5.01);const r=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st)r.push(+v.toFixed(10));return r};
 const xt=o.xt||tk(x0,x1),yt=o.yt||tk(y0,y1),fx=o.fx||(v=>fm(B,v)),fy=o.fy||(v=>fm(B,v));
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'رسم بياني'}" style="font-family:var(--font)" direction="ltr">`;
 s+=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${f1(Y(v))}" y2="${f1(Y(v))}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${f1(Y(v)+4)}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noYt?'':fy(v)}</text>`).join('');
 s+=xt.map(v=>`<text x="${f1(X(v))}" y="${H-Bm+15}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noXt?'':fx(v)}</text>`).join('');
 s+=`<path d="M${L} ${T-4}V${H-Bm}H${W-R+4}" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;
 (o.curves||[]).forEach(c=>{let p=c.pts;if(!p){p=[];const n=c.n||80;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=c.f(x);if(isFinite(y))p.push([x,y])}}
  const cl=v=>Math.max(y0-(y1-y0)*0.04,Math.min(y1+(y1-y0)*0.04,v));
  s+=`<path d="${p.map((q,i)=>(i?'L':'M')+f1(X(q[0]))+' '+f1(Y(cl(q[1])))).join('')}" fill="none" stroke="var(${c.col||'--blue'})" stroke-width="${c.w||2.6}" ${c.dash?`stroke-dasharray="${c.dash}"`:''} stroke-linejoin="round" stroke-linecap="round"/>`;
  if(c.lab){const q=p[p.length-1];s+=`<text x="${f1(X(q[0])-4)}" y="${f1(Y(cl(q[1]))-7)}" text-anchor="end" font-size="11.5" fill="var(${c.col||'--blue'})" font-weight="700" ${/[؀-ۿ]/.test(c.lab)?'direction="rtl"':''}>${c.lab}</text>`}});
 (o.dots||[]).forEach(d=>{s+=`<circle cx="${f1(X(d[0]))}" cy="${f1(Y(d[1]))}" r="3.6" fill="var(${d[2]||'--fg'})"/>`});
 if(o.cur){const [cx,cy]=o.cur;if(isFinite(cx)&&isFinite(cy)){const yy=Math.max(y0,Math.min(y1,cy));s+=`<path d="M${f1(X(cx))} ${H-Bm}V${f1(Y(yy))}H${L}" fill="none" stroke="var(--live)" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${f1(X(cx))}" cy="${f1(Y(yy))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`}}
 const ar=t=>/[\u0600-\u06FF]/.test(t||'');s+=`<text x="${W-R}" y="${H-4}" text-anchor="${ar(o.xl)?'start':'end'}" ${ar(o.xl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.xl||''}</text>`;
 s+=`<text x="${L-40}" y="13" text-anchor="${ar(o.yl)?'end':'start'}" ${ar(o.yl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.yl||''}</text>`;
 return s+'</svg>'}

/* ---- المختبر المصغّر: منزلقات/أزرار + نتيجة حية + «توقّع أولاً» ----
 o={intro, predict:{q,opts:[[t,ok,why]]}, ins:[{k,l,u,min,max,step,v,dp} | {k,l,seg:[[v,label]],v} | {k,l,sw:true,v,on,off}],
    tp:{id,defs} (قيم توضيحية من تبويب المختبر), ill:true (ينبّه أن القيم توضيحية), calc:(s,P,B)=>({facts:[[label,html,cls]], bars:[{l,v,max,u,dp,col}], plot:{…}, pic:svg, msg:html, cls:'bad'|'warn'})} */
function lab(el,B,o){let h=start(el,B,o.intro);let P={v:{},trainer:false};
 if(o.tp){const hid=document.createElement('div');const dfl=()=>({v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false});try{P=(B.chOn&&B.chOn())?dfl():B.params(hid,o.tp.id,o.tp.defs)}catch(e){P={v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false}}}
 const s={};o.ins.forEach(i=>s[i.k]=i.v);
 if(o.predict)h+=`<div class="ml-pd"><div class="ml-q"><span class="ml-tag">توقّع أولاً</span>${o.predict.q}</div><div class="ml-pool">${o.predict.opts.map((x,j)=>`<button type="button" class="ml-b" data-pj="${j}">${x[0]}</button>`).join('')}</div><div class="ml-fb" data-pfb hidden></div></div>`;
 h+=`<div class="ml-body${o.predict?' ml-lock':''}">`;
 h+=o.ins.map(i=>i.seg?`<div class="ml-lbl">${i.l}</div><div class="ml-seg" data-k="${i.k}">${i.seg.map(([v,l])=>`<button type="button" class="ml-b" data-v="${v}">${l}</button>`).join('')}</div>`
   :i.sw?`<div class="ml-row"><button type="button" class="ml-b" data-sw="${i.k}">${i.l}</button></div>`
   :`<label class="ml-sl"><span class="ml-h"><span>${i.l}</span><b data-ov="${i.k}"></b></span><input type="range" data-k="${i.k}" min="${i.min}" max="${i.max}" step="${i.step||'any'}" value="${i.v}" aria-label="${String(i.l).replace(/<[^>]+>/g,'')}"></label>`).join('');
 h+=`<div data-pic></div><div class="ml-facts" data-facts></div><div data-bars></div><div class="ml-plot" data-plot></div><div class="ml-fb" data-msg></div>`;
 h+=(o.tp||o.ill)?`<p class="ml-ill">${P.trainer?'الأرقام هنا <b>قيم المدرب</b> (من تبويب «المختبر»).':'الأرقام هنا <b>قيم توضيحية</b> ليست من الكتاب'+(o.tp?'، ويستطيع المدرب تغييرها من «قيم المدرب» في تبويب «المختبر».':'.')}</p>`:'';
 h+=`</div>`;el.innerHTML=h;fin(el,B);
 const body=q(el,'.ml-body');
 const draw=()=>{o.ins.forEach(i=>{if(i.seg)qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset.v)===String(s[i.k]))));
   else if(i.sw){const b=q(el,`[data-sw="${i.k}"]`);b.setAttribute('aria-pressed',String(!!s[i.k]));if(i.on){b.innerHTML=s[i.k]?i.on:i.off;bidi(b)}}
   else{const ov=q(el,`[data-ov="${i.k}"]`);ov.textContent=(i.fmt?i.fmt(s[i.k]):fm(B,+s[i.k],i.dp))+(i.u?' '+i.u:'')}});
  let r={};try{r=o.calc(s,P.v,B)||{}}catch(e){console.error(e);r={msg:''}}
  q(el,'[data-pic]').innerHTML=r.pic?`<div class="ml-pic">${r.pic}</div>`:'';
  q(el,'[data-facts]').innerHTML=(r.facts||[]).map(f=>`<div class="${f[2]||''}"><span>${f[0]}</span><b>${f[1]}</b></div>`).join('');
  q(el,'[data-bars]').innerHTML=(r.bars||[]).map(b=>{const k=Math.max(0,Math.min(1,b.v/(b.max||1)));return `<div class="ml-bar"><div class="ml-h"><span>${b.l}</span><b>${b.txt!=null?b.txt:fm(B,b.v,b.dp)+(b.u?' '+b.u:'')}</b></div><div class="ml-t"><i style="width:${(k*100).toFixed(1)}%;background:var(${b.col||'--blue'})"></i></div></div>`}).join('');
  q(el,'[data-plot]').innerHTML=r.plot?plot(B,r.plot):'';
  const m=q(el,'[data-msg]');m.className='ml-fb'+(r.cls?' '+r.cls:'');m.innerHTML=r.msg||'';if(r.msg)fin(m,B);bidi(q(el,'[data-facts]'));bidi(q(el,'[data-bars]'))};
 qa(el,'input[data-k]').forEach(inp=>inp.oninput=()=>{s[inp.dataset.k]=+inp.value;draw()});
 o.ins.filter(i=>i.seg).forEach(i=>qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.onclick=()=>{const v=b.dataset.v;s[i.k]=isNaN(+v)?v:+v;draw()}));
 qa(el,'[data-sw]').forEach(b=>b.onclick=()=>{const k=b.dataset.sw;s[k]=s[k]?0:1;draw()});
 if(o.predict){const bs=qa(el,'[data-pj]'),fb=q(el,'[data-pfb]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.pj,op=o.predict.opts[j],ok=!!op[1],right=o.predict.opts.find(x=>x[1]);
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(o.predict.opts[+x.dataset.pj][1]?'ok':x===b?'no':'dim')});
   fb.className='ml-fb'+(ok?'':' warn');fb.innerHTML=`<b>${ok?'توقّعك صحيح.':'ليس هذا.'}</b> ${op[2]||''}${!ok&&right[2]?'<br>'+right[2]:''}<br><b>الآن جرّب بنفسك في الأسفل وتأكد.</b> <button type="button" class="ml-b" data-pr style="min-height:34px;padding:3px 10px">غيّر توقّعك</button>`;fb.hidden=false;fin(fb,B);
   body.classList.remove('ml-lock');
   q(fb,'[data-pr]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true}})}
 draw();return {s,draw,P}}

/* ---- جهاز قياس بمؤشر: {v, max, lab:'V', txt, zero:'c' (صفر في المنتصف للقطبية)} ---- */
function gauge(B,o){const cx=110,cy=104,r=82,c=o.zero==='c';const k=Math.max(c?-1.06:-0.03,Math.min(1.06,(o.v||0)/(o.max||1)));
 const a=c?(-90+k*60)*Math.PI/180:(-150+k*120)*Math.PI/180,a0=c?-150:-150,a1=-30;const P=(ang,R)=>[cx+R*Math.cos(ang*Math.PI/180),cy+R*Math.sin(ang*Math.PI/180)];
 const [x0,y0]=P(a0,r),[x1,y1]=P(a1,r);let t='';for(let i=0;i<=8;i++){const g=a0+(a1-a0)*i/8,[p,q]=P(g,r),[u,w]=P(g,r-(i%4?7:12));t+=`<line x1="${p.toFixed(1)}" y1="${q.toFixed(1)}" x2="${u.toFixed(1)}" y2="${w.toFixed(1)}" stroke="var(--fg)" stroke-width="1.4"/>`}
 const nx=cx+(r-10)*Math.cos(a),ny=cy+(r-10)*Math.sin(a);
 return `<svg viewBox="0 0 220 132" role="img" aria-label="جهاز قياس" style="font-family:var(--font);max-width:240px;display:block;margin-inline:auto" direction="ltr"><path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="var(--fg)" stroke-width="2"/>${t}${c?`<text x="${cx}" y="${cy-r-6}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--mono)">0</text><text x="${(x0+8).toFixed(1)}" y="${(y0+16).toFixed(1)}" font-size="14" fill="var(--stop)" font-family="var(--mono)">−</text><text x="${(x1-16).toFixed(1)}" y="${(y1+16).toFixed(1)}" font-size="14" fill="var(--on)" font-family="var(--mono)">+</text>`:''}<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--live)" stroke-width="3.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/><text x="${cx}" y="${cy+24}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--fg)" font-family="var(--mono)">${o.lab||''}</text>${o.txt!=null?`<text x="${cx}" y="${cy-28}" text-anchor="middle" font-size="14" fill="var(--blue-ink)" font-family="var(--mono)" font-weight="700">${o.txt}</text>`:''}</svg>`}

return {tf,order,sort,cases,lab,plot,gauge,lt,fm,mix};
})())/*DCML-END*/,{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'ماذا ستتعلم في هذه الوحدة؟',ref:'ص 28',
   q:'كيف تعرف سرعة عمود يدور بآلاف اللفات في الدقيقة، وأنت لا تستطيع أن تعدّها بعينك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة أهداف الوحدة الثانية: التمييز بين أنواع التاكومترات، وأسباب الخطأ في قراءتها، ومعايرتها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الهدف العام: معرفة تركيب وأنواع مولدات التاكو</text><rect x="52" y="74" width="256" height="56" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="282" cy="102" r="15" fill="#4FB3A9"/><text x="282" y="107" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">1</text><text x="256" y="107" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="600">يميّز بين أنواع التاكومترات</text><rect x="52" y="142" width="256" height="56" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="282" cy="170" r="15" fill="#E8735A"/><text x="282" y="175" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">2</text><text x="256" y="166" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="600">يحدد أسباب الخطأ في القراءة</text><text x="256" y="186" text-anchor="end" font-size="13" fill="#2C4A40">وطرق تلافيها</text><rect x="52" y="210" width="256" height="56" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="282" cy="238" r="15" fill="#F2C14E"/><text x="282" y="243" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">3</text><text x="256" y="243" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="600">يتمكن من معايرة التاكومترات</text><text x="180" y="295" text-anchor="middle" font-size="13" fill="#2C4A40">الأهداف التفصيلية للوحدة</text></svg>`,
   cap:'الهدف العام للوحدة وأهدافها التفصيلية الثلاثة كما في ص 28.',
   side:[
    {add:String.raw`<p>في المصانع تجد محركات تدير سيوراً ناقلة ومضخات وآلات تغليف، ويجب أن تبقى سرعتها ثابتة مهما تغير الحمل. دائرة التحكم لا «ترى» العمود، فتحتاج جهازاً صغيراً على العمود يحوّل سرعته إلى إشارة كهربائية تقرؤها. هذا الجهاز هو <b>مولد التاكو</b>، موضوع هذه الوحدة.</p>`,title:'لماذا هذه الوحدة؟'},
    {predict:{q:'أي هدف من أهداف الوحدة يتعلق بالتأكد من أن قراءة التاكومتر ما زالت صحيحة بعد مدة من الاستعمال؟',opts:[
     ['التمييز بين أنواع التاكومترات',false,'هذا عن معرفة الأنواع (مستمر، حثي، تزامني)، لا عن صحة القراءة مع الزمن.'],
     ['تحديد أسباب الخطأ في القراءة وطرق تلافيها',false,'هذا عن أخطاء تأتي من تصميم المولد نفسه وطريقة توصيله، وهو قريب، لكن التأكد الدوري من القراءة له اسم آخر.'],
     ['معايرة التاكومترات',true,'المعايرة تعني مقارنة قراءة التاكومتر بجهاز أدق وتصحيحها، وسيأتي في الكتاب أنها تتم كل فترة زمنية محددة (ص 40).']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة تركيب وأنواع مولدات التاكو.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يميز المتدرب بين أنواع التاكومترات.</li><li>أن يحدد المتدرب أسباب الخطأ في قراءة التاكومترات وطرق تلافيها.</li><li>أن يتمكن المتدرب من معايرة التاكومترات.</li></ol>`,ref:'ص 28'},
    {tip:String.raw`<p>الكلمتان بمعنى واحد في هذه الوحدة: <b>مولد التاكو</b> و<b>التاكومتر</b>. الهدف الأول تجده في الدروس 2.1 و2.2 و2.4 و2.5، والثاني في الدرس 2.3، والثالث في الدرس 2.5.</p>`,title:'خريطة الوحدة'},
    {title:'مختبر مصغّر: أي هدف يخدمه هذا السؤال؟',widget:(el,B)=>DCML.sort(el,B,{intro:'أهداف الوحدة ثلاثة. اختر الهدف الذي يخدمه كل سؤال، ثم اقرأ السبب.',cats:['التمييز بين الأنواع','أسباب الخطأ وتلافيها','المعايرة'],items:[
 ['في أي نوع من التاكومترات يزداد تردد الجهد الخارج مع السرعة؟',0,'سؤال يفرّق بين التاكو الحثي والتزامني (الدرسان 2.4 و2.5).'],
 ['لماذا يبقى الفولتميتر على الصفر والعمود يدور ببطء شديد؟',1,'هذه «المنطقة الميتة» بسبب جهد التلامس عند الفرش (الدرس 2.3).'],
 ['لماذا تُصنع الفرش في بعض التاكومترات من الفضة؟',1,'هذه من طرق تلافي الخطأ في تاكومترات التيار المستمر (الدرس 2.3).'],
 ['كيف تتأكد بالإستروبوسكوب أن قراءة التاكومتر ما زالت صحيحة؟',2,'هذه معايرة التاكومتر بمقارنته بوسيلة أخرى دقيقة (الدرس 2.5).']]})}
   ]},

  {st:2,short:'ما مولد التاكو؟',title:'ما هو مولد التاكو؟',ref:'ص 29',
   q:'لو ربطنا مولداً صغيراً على عمود المحرك، ماذا يحدث لجهده عندما تزيد سرعة العمود؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك يدير عموداً مركّباً عليه مولد تاكو، وأطراف المولد موصولة بفولتميتر يقيس جهد الخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الآلة التي نريد قياس سرعتها (محرك مثلاً). مولد التاكو يُركّب على عمودها نفسه."><rect x="34" y="132" width="78" height="76" rx="12" fill="#2C4A40"/><text x="73" y="178" text-anchor="middle" font-size="22" fill="#FBF6EE" font-weight="700">M</text></g><rect x="112" y="164" width="128" height="12" rx="3" fill="#8A9A94"/><g data-tip="سرعة دوران العمود ⟦ω⟧. في المعادلة (٢-١) تُكتب بالراديان في الثانية ⟦rad/s⟧."><path d="M160 140 A26 32 0 1 1 160 200" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="160,206 150,196 166,192" fill="#E8735A"/><text x="200" y="134" text-anchor="middle" font-size="20" fill="#E8735A" font-weight="700" font-family="var(--mono)">ω</text></g><g data-tip="مولد التاكو ⟦(Tacho-Generator)⟧: مولد صغير القدرة يحوّل سرعة الدوران إلى جهد يتناسب معها."><rect x="240" y="138" width="82" height="64" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="281" y="177" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">TG</text></g><path d="M262 138 V106 M300 138 V106" stroke="#2C4A40" stroke-width="3"/><g data-tip="الفولتميتر يقيس جهد الخرج ⟦Va⟧. كلما زادت السرعة زادت قراءته، فنعرف السرعة من الجهد."><circle cx="281" cy="76" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M257 82 A26 26 0 0 1 305 82" fill="none" stroke="#2C4A40" stroke-width="2"/><line x1="281" y1="86" x2="296" y2="62" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><circle cx="281" cy="86" r="4" fill="#2C4A40"/><text x="281" y="104" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">V</text></g><text x="228" y="80" text-anchor="end" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="12" dy="4">a</tspan></text><text x="180" y="262" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">سرعة الدوران ← جهد يتناسب معها</text></svg>`,
   cap:'المحرك يدير العمود، ومولد التاكو على العمود نفسه، والفولتميتر يقرأ جهد خرجه.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>مولدات التاكو أو <b>التاكومترات</b> هي أجهزة لقياس السرعة الدورانية، وهي عبارة عن مولدات صغيرة القدرة تعمل على تحويل السرعة الدورانية إلى إشارة كهربائية متناسبة معها يمكن قياسها. تعتمد علاقة التحويل على العلاقة بين سرعة الدوران والقوة الدافعة الكهربائية المتولدة حيث أن العلاقة العامة لخرج مولد التاكو هي:</p>
     <div class="eq">$$V_a = K_g\cdot\omega$$<span class="eqno" style="direction:rtl">(٢-١)</span></div>
     <div class="eq">$$\omega=\frac{d\theta}{dt}$$<span></span></div>
     <p>حيث <b>\(\omega\)</b> هي سرعة الدوران <b>بالراديان في الثانية</b> و <b>\(K_g\)</b> هو <b>ثابت توليد الجهد أو ميل الخط</b> الذي يمثل العلاقة بين \(\omega\) و \(V_a\).</p>`,ref:'ص 29'}
   ],
   body:[
    {tip:String.raw`<p>المعادلة (٢-١) تقول: الجهد = ثابت × السرعة. فإذا عرفنا \(K_g\) وقسنا الجهد، عرفنا السرعة: \(\omega = V_a / K_g\). هذا هو كل عمل التاكومتر.</p>
     <p>و \(\omega=\dfrac{d\theta}{dt}\) معناها: السرعة الزاوية = الزاوية التي يقطعها العمود في كل ثانية. والدورة الكاملة = \(2\pi\) راديان، لذلك نحوّل السرعة من الدورة في الدقيقة إلى الراديان في الثانية هكذا: \(\omega=\dfrac{2\pi\,n}{60}\).</p>`,title:'المعادلة بكلمات بسيطة'},
    {title:'حوّل السرعة من rpm إلى rad/s',widget:(el,B)=>{
      const f=(x,d)=>{let s=(+x).toFixed(d);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');return s};
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">حرّك المنزلق وتابع خطوات التحويل. السرعة الابتدائية <span class="ltr">1000 rpm</span> من أمثلة الكتاب (ص 34).</p>
       <label class="w-sl"><span>سرعة العمود <span class="ltr">n = <b data-o="n"></b> rpm</span></span><input type="range" min="0" max="3000" step="10" value="1000" dir="ltr" aria-label="سرعة العمود"></label>
       <div class="w-facts"><div><span>دورات في الثانية <span class="ltr">n ÷ 60</span></span><b data-o="rps"></b></div><div><span>راديان في الدورة</span><b>2π ≈ 6.283</b></div><div><span>السرعة <span class="ltr">ω</span></span><b data-o="w"></b></div><div><span>لو ضاعفت السرعة</span><b data-o="w2"></b></div></div>
       <p class="sub" style="margin-top:8px">لاحظ: ضعف السرعة يعطي ضعف <span class="ltr">ω</span>، فيتضاعف الجهد <span class="ltr">V<sub>a</sub></span> في المعادلة (٢-١) لأن العلاقة خطية.</p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const n=+rg.value,w=2*Math.PI*n/60;o('n').textContent=n;o('rps').textContent=f(n/60,2)+' rev/s';o('w').textContent=f(w,2)+' rad/s';o('w2').textContent=f(2*w,2)+' rad/s'};
      rg.oninput=draw;draw();
    }},
    {predict:{q:String.raw`في مولد تاكو مثالي يتبع المعادلة (٢-١)، تضاعفت سرعة العمود. ماذا يحدث لجهد الخرج \(V_a\)؟`,opts:[
     ['يبقى كما هو، لأن \\(K_g\\) ثابت',false,'ثبات \\(K_g\\) يعني أن الجهد يتغير مع السرعة بالنسبة نفسها، لا أنه يبقى ثابتاً.'],
     ['يزيد إلى أربعة أمثاله',false,'هذا يحدث لو كان الجهد يتناسب مع مربع السرعة، والمعادلة (٢-١) ليس فيها مربع.'],
     ['يتضاعف',true,'\\(V_a = K_g\\cdot\\omega\\): ضعف \\(\\omega\\) يعطي ضعف \\(V_a\\)، والعلاقة خط مستقيم ميله \\(K_g\\).']]}},
    {watch:String.raw`<p>لا تعوّض السرعة بالدورة في الدقيقة <span class="ltr">(rpm)</span> مكان \(\omega\) في المعادلة (٢-١): الكتاب ينص على أن \(\omega\) بالراديان في الثانية. حوّل أولاً.</p>`}
   ]},

  {st:3,short:'الأنواع',title:'أنواع مولدات التاكو',ref:'ص 29',
   q:'كلها تحوّل السرعة إلى جهد… فما الذي يجعلها ثلاثة أنواع مختلفة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أنواع مولدات التاكو الثلاثة: للتيار المستمر، والحثية، والتزامنية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="58" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">مولدات التاكو</text><path d="M180 66 V84 M64 84 H296 M64 84 V102 M180 84 V102 M296 84 V102" stroke="#2C4A40" stroke-width="2.5" fill="none"/><g transform="translate(232 0)" data-tip="مولد التاكو للتيار المستمر: مولد تيار مستمر صغير، فيه مبدل وفرش كربونية (المستطيلان)، ومجاله من ملف بتغذية مستقلة أو من مغناطيس دائم. خرجه جهد مستمر."><rect x="20" y="106" width="88" height="110" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="64" cy="150" r="24" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><rect x="56" y="118" width="16" height="10" rx="2" fill="#2C4A40"/><rect x="56" y="172" width="16" height="10" rx="2" fill="#2C4A40"/><line x1="40" y1="150" x2="88" y2="150" stroke="#2C4A40" stroke-width="1.5"/><line x1="64" y1="126" x2="64" y2="174" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="مولد التاكو الحثي: ملفان متعامدان على العضو الثابت، ودوار على شكل قفص أو كأس نحاسي. خرجه جهد متردد."><rect x="136" y="106" width="88" height="110" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="150" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="146" y="141" width="12" height="18" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><rect x="202" y="141" width="12" height="18" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><rect x="171" y="118" width="18" height="12" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><rect x="171" y="170" width="18" height="12" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/></g><g transform="translate(-232 0)" data-tip="مولد التاكو التزامني: مولد تزامني صغير مجاله من مغناطيسات دائمة على العضو الدوار. خرجه جهد متردد يتغير تردده مع السرعة."><rect x="252" y="106" width="88" height="110" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="296" cy="150" r="26" fill="none" stroke="#2C4A40" stroke-width="2.5"/><rect x="284" y="130" width="24" height="20" fill="#E8735A"/><rect x="284" y="150" width="24" height="20" fill="#4FB3A9"/><text x="296" y="145" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">N</text><text x="296" y="165" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">S</text></g><text x="296" y="200" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">للتيار المستمر</text><text x="180" y="200" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">حثية</text><text x="64" y="200" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">تزامنية</text><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">التصنيف حسب التصميم ونظرية العمل</text></svg>`,
   cap:'الأنواع الثلاثة التي يذكرها الكتاب، ولكل منها درس في هذه الوحدة.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف شيئاً عن تركيبها.</b>',
   side:[
    {book:String.raw`<p>تصنف مولدات التاكو حسب تصميمها ونظرية عملها من حيث إنها <b>مولدات للتيار المستمر</b> أو <b>مولدات حثيه</b> أو <b>تزامنية</b>.</p>`,ref:'ص 29'},
    {predict:{q:'على أي أساس صنّف الكتاب مولدات التاكو إلى ثلاثة أنواع؟',opts:[
     ['حسب قدرتها: صغيرة ومتوسطة وكبيرة',false,'كلها «مولدات صغيرة القدرة» كما في تعريف ص 29، فالقدرة ليست أساس التصنيف.'],
     ['حسب تصميمها ونظرية عملها',true,'هذا نص الكتاب: مستمر وحثي وتزامني يختلف كل منها في تركيبه وفي طريقة توليد الجهد.'],
     ['حسب السرعة التي تقيسها',false,'كل نوع يستطيع قياس مدى من السرعات؛ الفرق في التركيب ونظرية العمل.']]}}
   ],
   body:[
    {tip:String.raw`<table class="tt"><thead><tr><th>النوع</th><th>البند في الكتاب</th><th>الدرس هنا</th></tr></thead><tbody>
     <tr><td>مولدات التاكو للتيار المستمر</td><td>٢-٢ (ص 30–35)</td><td>2.2 و 2.3</td></tr>
     <tr><td>مولدات التاكو الحثية</td><td>٢-٣ (ص 36–39)</td><td>2.4</td></tr>
     <tr><td>مولدات التاكو التزامنية</td><td>٢-٤ (ص 40)</td><td>2.5</td></tr></tbody></table>`,title:'أين تدرس كل نوع؟'},
    {title:'مختبر مصغّر: أي نوع هذا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر نوع مولد التاكو المناسب لكل وصف. ستدرس كل نوع بالتفصيل في دروس الوحدة.',cats:['تيار مستمر','حثي','تزامني'],items:[
 ['مولد تيار مستمر صغير، فيه مبدل وفرش كربونية',0,'«هي في الأساس مولدات للتيار المستمر صغيرة الحجم» (ص 30).'],
 ['ملفان متعامدان على الثابت، ودوار على شكل كأس رفيع من النحاس',1,'هذا تركيب مولد التاكو الحثي (ص 36).'],
 ['مغناطيسات دائمة على الدوار، وعلى الثابت ملف أحادي الوجه أو ملفات ثلاثية',2,'هذا تركيب مولد التاكو التزامني (ص 40).'],
 ['تردد الجهد الخارج يزداد مع السرعة',2,'في التزامني «يزداد الجهد والتردد معاً» مع السرعة (ص 40)، أما الحثي فتردده يساوي تردد ملف المجال.']]})}
   ]},

  {st:4,short:'المتطلبات الرئيسية',title:'٢-١ المتطلبات الرئيسية لمولدات التاكو',ref:'ص 29',
   q:'التاكومتر جهاز قياس… فما الذي يجعله جهاز قياس «جيداً»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="في الأعلى: الخط المثالي والمنحنى الفعلي للجهد مع السرعة والفرق بينهما خطأ القيمة. في الأسفل: متجه جهد الخرج المثالي والفعلي والفرق بين زاويتيهما خطأ زاوية الوجه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M60 170 H322 M60 170 V34" stroke="#2C4A40" stroke-width="2.5" fill="none"/><polygon points="330,170 320,165 320,175" fill="#2C4A40"/><polygon points="60,26 55,36 65,36" fill="#2C4A40"/><text x="336" y="188" text-anchor="end" font-size="16" fill="#2C4A40" font-family="var(--mono)">ω</text><text x="50" y="42" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">a</tspan></text><g data-tip="الخط المثالي ⟦Va = Kg·ω⟧: خط مستقيم من نقطة الأصل، ميله ⟦Kg⟧."><path d="M60 170 L300 50" stroke="transparent" stroke-width="16"/><path d="M60 170 L300 50" stroke="#12855A" stroke-width="3.5"/></g><text x="300" y="44" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700">مثالي</text><g data-tip="المنحنى الفعلي: جهد المولد الحقيقي، ينحرف قليلاً عن الخط المستقيم."><path d="M60 170 Q200 110 300 78" fill="none" stroke="transparent" stroke-width="16"/><path d="M60 170 Q200 110 300 78" fill="none" stroke="#E8735A" stroke-width="3.5"/></g><text x="322" y="84" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">فعلي</text><g data-tip="الخطأ في القيمة العددية للجهد ⟦ΔV⟧: الفرق بين الجهد الفعلي والجهد من العلاقة المثالية عند السرعة نفسها. المطلوب أن يكون أقل ما يمكن."><rect x="246" y="66" width="34" height="56" fill="transparent"/><path d="M258 72 V91" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 3"/><polygon points="258,70 254,77 262,77" fill="#2C4A40"/><polygon points="258,93 254,86 262,86" fill="#2C4A40"/><text x="262" y="116" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ΔV</text></g><g data-tip="اتجاه المجال: المحور الذي تُقاس منه زاوية متجه جهد الخرج."><line x1="70" y1="292" x2="318" y2="292" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="7 5"/></g><text x="318" y="284" text-anchor="end" font-size="12" fill="#2C4A40">اتجاه المجال</text><g data-tip="متجه جهد الخرج في العلاقة المثالية، يصنع الزاوية ⟦β⟧ مع اتجاه المجال."><line x1="70" y1="292" x2="186" y2="238" stroke="#12855A" stroke-width="4" stroke-linecap="round"/></g><g data-tip="متجه جهد الخرج الفعلي: ينحرف عن الاتجاه المثالي بزاوية صغيرة."><line x1="70" y1="292" x2="178" y2="222" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/></g><path d="M110 292 A40 40 0 0 0 106.3 275.1" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="122" y="287" text-anchor="middle" font-size="14" fill="#2C4A40" font-family="var(--mono)">β</text><g data-tip="الخطأ في زاوية الوجه ⟦Δβ⟧: الفرق بين زاوية متجه الجهد الفعلي وزاويته في العلاقة المثالية. المطلوب أن يكون أقل ما يمكن."><path d="M151.6 254.1 A90 90 0 0 0 145.5 243" fill="none" stroke="#2C4A40" stroke-width="3"/><rect x="112" y="224" width="40" height="24" fill="transparent"/><text x="142" y="240" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Δβ</text></g></svg>`,
   cap:'في الأعلى خطأ القيمة <span class="ltr">ΔV</span>، وفي الأسفل خطأ زاوية الوجه <span class="ltr">Δβ</span> (الانحرافات مكبّرة للتوضيح).<br><b>مرّر المؤشر على الخطوط والرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>هناك متطلبات تجب مراعاتها عند تصميم التاكومترات وهي:</p>
     <ol style="list-style:none;padding-inline-start:6px"><li>أ. أقل خطأ ممكن في القيمة العددية للجهد المتولد (<span class="ltr">ΔV</span>). ويقصد به أقل انحراف لخصائص المولد عن العلاقة الخطية.</li>
     <li>ب. أقل خطأ ممكن في زاوية الوجه (<span class="ltr">Δβ</span>).</li>
     <li>ج. أكبر معامل تكبير ممكن \(K_g\).</li>
     <li>د. أقل قصور ذاتي للمحرك.</li>
     <li>هـ. أقل ثابت زمني للنظام الكهروميكانيكي.</li></ol>`,ref:'ص 29'}
   ],
   body:[
    {book:String.raw`<p>يعرف <b>الخطأ في القيمة العددية للجهد (<span class="ltr">ΔV</span>)</b>، بأنه الفرق بين الجهد المتولد بالفعل عند سرعة معينة والجهد المعطى من العلاقة المثالية لجهد الخرج عند نفس السرعة.</p>
     <p>يعرف <b>الخطأ في زاوية الوجه لجهد الخرج (<span class="ltr">Δβ</span>)</b>، بأنه الفرق بين الزاوية β التي ينحرف بها متجه جهد الخرج عن اتجاه المجال عن نفس الزاوية في العلاقة المثالية.</p>`,ref:'ص 29'},
    {tip:String.raw`<ul>
     <li><b><span class="ltr">ΔV</span> صغير:</b> الجهد الحقيقي يكاد ينطبق على الخط المستقيم \(V_a=K_g\omega\)، فتكون السرعة المحسوبة من الجهد صحيحة.</li>
     <li><b><span class="ltr">Δβ</span> صغير:</b> يهم في التاكو الذي يعطي جهداً متردداً (مثل الحثي في الدرس 2.4): زاوية الخرج يجب أن تبقى ثابتة مهما تغيرت السرعة.</li>
     <li><b>\(K_g\) كبير:</b> فولتات أكثر لكل وحدة سرعة، فتظهر التغيرات الصغيرة في السرعة بوضوح على جهاز القياس.</li>
     <li><b>قصور ذاتي صغير:</b> الجزء الدوار خفيف فلا يُثقل العمود الذي نقيس سرعته، ويتبع تغيراتها بسرعة.</li>
     <li><b>ثابت زمني صغير:</b> القراءة تلحق بالسرعة الحقيقية بسرعة عندما تتغير.</li></ul>`,title:'المتطلبات الخمسة بكلمات بسيطة'},
    {title:'صنّف المتطلبات: أقل ما يمكن أم أكبر ما يمكن؟',widget:(el,B)=>{
      const R=[['الخطأ في القيمة العددية للجهد <span class="ltr">ΔV</span>',0],['الخطأ في زاوية الوجه <span class="ltr">Δβ</span>',0],['معامل التكبير <span class="ltr">K<sub>g</sub></span>',1],['القصور الذاتي',0],['الثابت الزمني للنظام الكهروميكانيكي',0]];
      const ch=R.map(()=>-1);
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر لكل بند ما يطلبه الكتاب، ثم اضغط «تحقّق».</p>`+R.map((r,i)=>`<div class="w-row" style="margin-top:8px;justify-content:space-between" data-r="${i}"><span>${r[0]} <b data-m="${i}"></b></span><span class="mseg"><button type="button" data-v="0" style="font-family:inherit">أقل ما يمكن</button><button type="button" data-v="1" style="font-family:inherit">أكبر ما يمكن</button></span></div>`).join('')+`<div class="w-row"><button class="btn pri" type="button" data-ck>تحقّق</button><button class="btn" type="button" data-rs>إعادة</button><span data-msg></span></div>`;
      const paint=(chk)=>{R.forEach((r,i)=>{el.querySelectorAll(`[data-r="${i}"] button`).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===ch[i]));const m=el.querySelector(`[data-m="${i}"]`);m.textContent=chk&&ch[i]>=0?(ch[i]===r[1]?'✓':'✗'):'';m.style.color=ch[i]===r[1]?'var(--on)':'var(--stop)'})};
      el.querySelectorAll('[data-r] button').forEach(b=>b.onclick=()=>{ch[+b.closest('[data-r]').dataset.r]=+b.dataset.v;paint(false);el.querySelector('[data-msg]').textContent=''});
      el.querySelector('[data-ck]').onclick=()=>{paint(true);const ok=R.filter((r,i)=>ch[i]===r[1]).length;el.querySelector('[data-msg]').textContent=ok===R.length?'أحسنت: كل البنود «أقل ما يمكن» إلا معامل التكبير.':`صحيح ${ok} من ${R.length}. راجع نص الكتاب في الأعلى.`};
      el.querySelector('[data-rs]').onclick=()=>{ch.fill(-1);paint(false);el.querySelector('[data-msg]').textContent=''};
      paint(false);
    }},
    {predict:{q:'تاكومتر قراءته تتأخر كثيراً عن السرعة الحقيقية كلما تغيرت سرعة العمود فجأة. أي متطلب من المتطلبات لم يتحقق جيداً؟',opts:[
     ['أقل ثابت زمني للنظام الكهروميكانيكي',true,'الثابت الزمني الصغير يعني أن القراءة تلحق بالتغير بسرعة؛ والتأخر الكبير علامة على ثابت زمني كبير (ومعه غالباً قصور ذاتي كبير).'],
     ['أكبر معامل تكبير \\(K_g\\)',false,'\\(K_g\\) يحدد كم فولتاً لكل وحدة سرعة، أي حجم القراءة، لا سرعة لحاقها بالتغير.'],
     ['أقل خطأ في زاوية الوجه \\(\\Delta\\beta\\)',false,'\\(\\Delta\\beta\\) يخص زاوية متجه الجهد، لا زمن الاستجابة.']]}},
    {watch:String.raw`<p>كل المتطلبات «أقل» إلا واحداً: <b>أكبر</b> معامل تكبير \(K_g\). سؤال «أي مما يلي ليس من المتطلبات؟» يأتي كثيراً بخيار «أكبر قصور ذاتي».</p>`}
   ]},

  {recap:[
   String.raw`مولد التاكو مولد صغير القدرة يحوّل سرعة الدوران إلى جهد يتناسب معها، المعادلة (٢-١): \(V_a=K_g\cdot\omega\)، و \(\omega\) بالراديان في الثانية.`,
   String.raw`\(K_g\) هو ثابت توليد الجهد أو ميل الخط بين \(\omega\) و \(V_a\).`,
   String.raw`تصنف مولدات التاكو حسب تصميمها ونظرية عملها: للتيار المستمر، وحثية، وتزامنية.`,
   String.raw`المتطلبات الرئيسية: أقل <span class="ltr">ΔV</span>، وأقل <span class="ltr">Δβ</span>، وأكبر \(K_g\)، وأقل قصور ذاتي، وأقل ثابت زمني.`]}
],
 theory:[
  {h:'الهدف العام والأهداف التفصيلية',ref:'ص 28',html:`<p><b>الهدف العام للوحدة:</b> معرفة تركيب وأنواع مولدات التاكو.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يميز المتدرب بين أنواع التاكومترات.</li><li>أن يحدد المتدرب أسباب الخطأ في قراءة التاكومترات وطرق تلافيها.</li><li>أن يتمكن المتدرب من معايرة التاكومترات.</li></ol>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الهدف الثالث (ص 28) كُتب «أن يتمكن <b>المتدر</b> من معايرة التاكومترات»، والصحيح «المتدرب» (خطأ مطبعي).'+'</div>'},
  {h:'ما هو مولد التاكو؟',ref:'ص 29',html:`<p>«مولدات التاكو أو <b>التاكومترات</b> هي أجهزة لقياس السرعة الدورانية، وهي عبارة عن مولدات صغيرة القدرة تعمل على تحويل السرعة الدورانية إلى إشارة كهربائية متناسبة معها يمكن قياسها. تعتمد علاقة التحويل على العلاقة بين سرعة الدوران والقوة الدافعة الكهربائية المتولدة حيث أن العلاقة العامة لخرج مولد التاكو هي:»</p>
   $$V_a = K_g\\cdot\\omega \\qquad (٢-١)$$
   $$\\omega=\\frac{d\\theta}{dt}$$
   <p>«حيث <b>\\(\\omega\\)</b> هي سرعة الدوران <b>بالراديان في الثانية</b> و <b>\\(K_g\\)</b> هو <b>ثابت توليد الجهد أو ميل الخط</b> الذي يمثل العلاقة بين \\(\\omega\\) و \\(V_a\\).»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> السرعة تُكتب عادة بالدورة في الدقيقة <span class="ltr">(rpm)</span>، ونحوّلها إلى راديان في الثانية هكذا: $$\\omega=\\frac{2\\pi\\,n}{60}$$ فمثلاً <span class="ltr">1000 rpm ≈ 104.72 rad/s</span>. وحدة \\(K_g\\) هي <span class="ltr">V/(rad/s)</span>. إذا كان <span class="ltr">K<sub>g</sub> = 0.1</span> فعند <span class="ltr">1000 rpm</span> يكون <span class="ltr">V<sub>a</sub> ≈ 10.47 V</span>. وبالعكس: نقيس الجهد فنعرف السرعة \\(\\omega=V_a/K_g\\). هذا هو كل عمل التاكومتر.`},
  {h:'أنواع مولدات التاكو',ref:'ص 29',html:`<p>«تصنف مولدات التاكو حسب تصميمها ونظرية عملها من حيث إنها <b>مولدات للتيار المستمر</b> أو <b>مولدات حثيه</b> أو <b>تزامنية</b>.»</p>
   <table class="tt"><thead><tr><th>النوع</th><th>البند في الكتاب</th><th>الدرس هنا</th></tr></thead><tbody>
   <tr><td>مولدات التاكو للتيار المستمر</td><td>٢-٢ (ص 30–35)</td><td>2.2 و 2.3</td></tr>
   <tr><td>مولدات التاكو الحثية</td><td>٢-٣ (ص 36–39)</td><td>2.4</td></tr>
   <tr><td>مولدات التاكو التزامنية</td><td>٢-٤ (ص 40)</td><td>2.5</td></tr></tbody></table>`},
  {h:'٢-١ المتطلبات الرئيسية لمولدات التاكو',ref:'ص 29',html:`<p>«هناك متطلبات تجب مراعاتها عند تصميم التاكومترات وهي:»</p>
   <ol type="a" style="list-style:none;padding-inline-start:6px"><li>أ. أقل خطأ ممكن في القيمة العددية للجهد المتولد (<span class="ltr">ΔV</span>). ويقصد به أقل انحراف لخصائص المولد عن العلاقة الخطية.</li>
   <li>ب. أقل خطأ ممكن في زاوية الوجه (<span class="ltr">Δβ</span>).</li>
   <li>ج. أكبر معامل تكبير ممكن \\(K_g\\).</li>
   <li>د. أقل قصور ذاتي للمحرك.</li>
   <li>هـ. أقل ثابت زمني للنظام الكهروميكانيكي.</li></ol>
   <p>«يعرف <b>الخطأ في القيمة العددية للجهد (<span class="ltr">ΔV</span>)</b>، بأنه الفرق بين الجهد المتولد بالفعل عند سرعة معينة والجهد المعطى من العلاقة المثالية لجهد الخرج عند نفس السرعة.»</p>
   <p>«يعرف <b>الخطأ في زاوية الوجه لجهد الخرج (<span class="ltr">Δβ</span>)</b>، بأنه الفرق بين الزاوية β التي ينحرف بها متجه جهد الخرج عن اتجاه المجال عن نفس الزاوية في العلاقة المثالية.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — المتطلبات بكلمات بسيطة:</b><ul>
   <li><b>ΔV صغير:</b> الجهد الحقيقي يكاد ينطبق على الخط المستقيم \\(V_a=K_g\\omega\\). لو كان المثالي <span class="ltr">10 V</span> والفعلي <span class="ltr">9.8 V</span> فإن <span class="ltr">ΔV = 0.2 V</span>.</li>
   <li><b>Δβ صغير:</b> يهم في التاكو الذي يعطي جهداً متردداً (الحثي): زاوية طور الخرج يجب أن تبقى ثابتة مهما تغيرت السرعة.</li>
   <li><b>K<sub>g</sub> كبير:</b> فولتات أكثر لكل وحدة سرعة، فتظهر التغيرات الصغيرة في السرعة بوضوح.</li>
   <li><b>قصور ذاتي صغير:</b> المقصود الجزء الدوار للتاكو (الكتاب يقول «للمحرك»): خفيف فلا يُثقل العمود الذي نقيس سرعته.</li>
   <li><b>ثابت زمني صغير:</b> القراءة تلحق بالسرعة الحقيقية بسرعة عندما تتغير.</li></ul>جرّب كل ذلك في تبويب «المختبر».`}
 ],
 lab:(el)=>{
  let n=1000,Kg=0.1,tau=0.1,act=0,read=0,t=0,ang=0,jumped=0,lastS='';const hist=[];
  el.innerHTML=`<div id="l1tp"></div><div class="grid">
   <div class="panel c7"><h2>عمود يدور وعليه مولد تاكو <small>مبنية على المعادلة (٢-١) ص 29</small></h2>
    <div class="svgbox" style="max-width:520px;margin-inline:auto"><svg viewBox="0 0 420 150" role="img" aria-label="عمود ومولد تاكو">
     <rect x="8" y="38" width="96" height="74" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><text class="txt" x="56" y="80" text-anchor="middle" font-size="18">M</text>
     <rect x="104" y="69" width="176" height="12" fill="var(--wire)"/>
     <g id="l1disk"><circle cx="186" cy="75" r="32" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M186 75L186 45" stroke="var(--live)" stroke-width="4" stroke-linecap="round"/><circle cx="186" cy="75" r="4" fill="var(--fg)"/></g>
     <rect x="280" y="46" width="78" height="58" rx="8" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><text class="txt b" x="319" y="80" text-anchor="middle" font-size="16">TG</text>
     <path class="w live" d="M330 46V22H412"/><path class="w live" d="M308 104V128H412"/><text class="txt" x="404" y="16" text-anchor="end">+</text><text class="txt" x="404" y="144" text-anchor="end">−</text>
     <text class="txt m" x="186" y="132" text-anchor="middle">shaft (drawn 50× slower)</text></svg></div>
    ${sl('l1n','سرعة العمود <span class="ltr">n</span>',0,3000,10,n)}
    ${sl('l1k','ثابت توليد الجهد <span class="ltr">K<sub>g</sub></span> (ميل الخط)',0.02,0.2,0.005,Kg)}
    ${sl('l1t','الثابت الزمني للتاكو <span class="ltr">τ</span>',0.02,1.5,0.02,tau)}
    <div class="tk-row">${swHTML('l1act','ΔV و Δβ','مولد فعلي (<span class="l1tpw">توضيحي</span>)',0)}<button class="btn" id="l1jump">قفزة سرعة 1000 ⇄ 2000 rpm</button></div>
    <div class="facts">${fact('السرعة بالراديان ω','l1w')}${fact('الجهد المثالي <bdi dir="ltr">K<sub>g</sub>ω</bdi>','l1vi')}${fact('قراءة الفولتميتر','l1vr')}${fact('السرعة المحسوبة من القراءة','l1nr')}</div></div>
   <div class="panel c5"><h2>الفولتميتر على أطراف التاكو</h2><div class="svgbox tk-svg" id="l1m"></div>
    <div id="l1ph"></div></div>
   <div class="panel c6"><h2><span>العلاقة بين <bdi dir="ltr">V<sub>a</sub></bdi> و <bdi dir="ltr">ω</bdi></span></h2><div class="tk-chart"><canvas id="l1c"></canvas></div>
    ${legend([['--blue','الخط المثالي <span class="ltr">V<sub>a</sub> = K<sub>g</sub>ω</span>'],['--live','المولد الفعلي (<span class="l1tpw">أرقام توضيحية</span>)'],['--stop','ΔV']])}</div>
   <div class="panel c6"><h2>القراءة مع الزمن <small>آخر 8 ثوانٍ</small></h2><div class="tk-chart"><canvas id="l1h"></canvas></div>
    ${legend([['--muted','الجهد المطابق للسرعة الحقيقية',1],['--blue','قراءة الفولتميتر (تتأخر بالثابت الزمني τ)']])}</div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l1tp'),'u2-l1',[
   {k:'dv',label:'نقص جهد المولد الفعلي عن الخط المستقيم عند ω = 100 rad/s',unit:'%',value:5.5,min:0,max:15,step:0.1},
   {k:'b0',label:'خطأ زاوية الوجه Δβ عند السرعات الصغيرة جدًا',unit:'°',value:0.4,min:0,max:5,step:0.1},
   {k:'b1',label:'زيادة Δβ لكل 100 rad/s',unit:'°',value:1.2,min:0,max:3,step:0.1}],()=>{tpw();lastS=''});
  const tpw=()=>el.querySelectorAll('.l1tpw').forEach(x=>x.textContent=TP.trainer?'قيم المدرب':x.closest('.sw')?'توضيحي':'أرقام توضيحية');tpw();
  // الافتراضي: 5.5/10000 = 0.00055 و 0.4 + 0.012ω كما كانت
  const actV=w=>Kg*w*(1-TP.v.dv/10000*w),actB=w=>TP.v.b0+TP.v.b1/100*w;
  const ideal=w=>Kg*w;
  $('#l1n').oninput=e=>{n=+e.target.value};$('#l1k').oninput=e=>{Kg=+e.target.value};$('#l1t').oninput=e=>{tau=+e.target.value};
  $('#l1act').onclick=()=>{act=act?0:1;$('#l1act').setAttribute('aria-pressed',act?'true':'false');lastS=''};
  $('#l1jump').onclick=()=>{n=Math.abs(n-1000)<Math.abs(n-2000)?2000:1000;$('#l1n').value=n;jumped=1};
  const steps=stepsUI($('#l1st'),[
   {t:'حوّل السرعة إلى راديان',x:'اضبط السرعة على <span class="ltr">1000 rpm</span>. لاحظ أن <span class="ltr">ω ≈ 104.7 rad/s</span>، وأن الجهد = K<sub>g</sub> × ω.',done:()=>Math.abs(n-1000)<15},
   {t:'ضاعف السرعة',x:'ارفع السرعة إلى <span class="ltr">2000 rpm</span>: يتضاعف الجهد لأن العلاقة (٢-١) خطية.',done:()=>Math.abs(n-2000)<15},
   {t:'غيّر ميل الخط K<sub>g</sub>',x:'زد K<sub>g</sub> إلى <span class="ltr">0.15</span> أو أكثر: الخط يصبح أشد ميلاً والجهد أكبر عند نفس السرعة (المتطلب ج).',done:()=>Kg>=0.15},
   {t:'المولد الفعلي و ΔV',x:'شغّل «مولد فعلي». المنحنى البرتقالي ينحرف عن الخط المستقيم، والسهم الأحمر هو <span class="ltr">ΔV</span> عند السرعة الحالية. ويظهر أيضاً خطأ زاوية الوجه <span class="ltr">Δβ</span>.',done:()=>act},
   {t:'الثابت الزمني',x:'اجعل <span class="ltr">τ</span> أكبر من <span class="ltr">0.8 s</span> ثم اضغط «قفزة سرعة»: القراءة الزرقاء تتأخر عن الحقيقية. أعد τ صغيراً وكرر: تلحق القراءة فوراً (المتطلب هـ).',done:()=>tau>0.8&&jumped}
  ],()=>({}));
  loopOn(el,dt=>{t+=dt;const w=n*N2W,Vt=act?Math.max(0,actV(w)):ideal(w);read+=(Vt-read)*(1-Math.exp(-dt/tau));
   ang=(ang+n/60*360*dt/50)%360;$('#l1disk').setAttribute('transform',`rotate(${ang.toFixed(1)} 186 75)`);
   hist.push([t,Vt,read]);while(hist.length&&t-hist[0][0]>8)hist.shift();
   $('#l1n-v').textContent=n+' rpm';$('#l1k-v').textContent=fm(Kg,3)+' V/(rad/s)';$('#l1t-v').textContent=fm(tau,2)+' s';
   $('#l1w').textContent=fm(w,2)+' rad/s';$('#l1vi').textContent=fm(ideal(w),2)+' V';$('#l1vr').textContent=fm(read,2)+' V';$('#l1nr').textContent=fm(read/Kg*W2N,0)+' rpm';
   const sg=[n,Kg,act,Math.round(read*20)].join();if(sg!==lastS){lastS=sg;$('#l1m').innerHTML=meterSVG(read,70,'V',fm(read,2)+' V');
    $('#l1ph').innerHTML=act?phasorDB(actB(w)):`<p class="sub">في المولد المثالي لا يوجد خطأ في القيمة ولا في زاوية الوجه. شغّل «مولد فعلي» لترى <span class="ltr">ΔV</span> و <span class="ltr">Δβ</span>.</p>`}
   const ws=[];for(let i=0;i<=60;i++)ws.push(i*330/60);
   plot($('#l1c'),{xmax:330,ymax:70,xlabel:'ω (rad/s)',ylabel:'Va (V)',series:[{pts:ws.map(x=>[x,ideal(x)]),color:'--blue'}].concat(act?[{pts:ws.map(x=>[x,actV(x)]),color:'--live'}]:[]),
    arrows:act?[{x:w,y0:ideal(w),y1:actV(w),label:'ΔV = '+fm(ideal(w)-actV(w),2)+' V'}]:[],points:[{x:w,y:act?actV(w):ideal(w),color:act?'--live':'--blue'}]});
   plot($('#l1h'),{xmin:Math.max(0,t-8),xmax:Math.max(8,t),ymax:70,xlabel:'t (s)',ylabel:'V (V)',series:[{pts:hist.map(h=>[h[0],h[1]]),color:'--muted',dash:[5,4],width:2},{pts:hist.map(h=>[h[0],h[2]]),color:'--blue'}]});
   steps.check()});
  function phasorDB(db){const cx=40,cy=96,R=78,b0=60,b1=b0+db*3;const P=d=>[cx+R*Math.cos(d*PI/180),cy-R*Math.sin(d*PI/180)];const p0=P(b0),p1=P(b1);
   return `<h3 class="sm">خطأ زاوية الوجه <span class="ltr">Δβ</span> (${TP.trainer?'قيم المدرب':'أرقام توضيحية'}، والزاوية مكبّرة 3 مرات في الرسم)</h3><div class="svgbox tk-svg"><svg viewBox="0 0 260 120" role="img" aria-label="متجه جهد الخرج">
    ${arrowP(cx,cy,cx+200,cy,'--muted',1.6)}<text class="txt m" x="${cx+200}" y="${cy+16}" text-anchor="end">field axis</text>
    ${arrowP(cx,cy,p0[0],p0[1],'--blue',2.6)}${arrowP(cx,cy,p1[0],p1[1],'--live',2.6)}
    <text class="txt b" x="${p0[0]+6}" y="${p0[1]+4}">ideal β</text><text class="txt" x="${p1[0]-6}" y="${p1[1]}" text-anchor="end" style="fill:var(--live)">actual</text>
    <text class="txt" x="150" y="40" style="fill:var(--stop)">Δβ = ${fm(db,2)}°</text></svg></div>`}
 },
 quiz:[
  {q:'مولد التاكو جهاز يحوّل:',o:['السرعة الدورانية إلى إشارة كهربائية متناسبة معها','الجهد الكهربائي إلى سرعة دورانية','التيار إلى عزم','الحرارة إلى جهد'],c:0,e:'ص 29: «مولدات صغيرة القدرة تعمل على تحويل السرعة الدورانية إلى إشارة كهربائية متناسبة معها يمكن قياسها».'},
  {q:'في المعادلة V<sub>a</sub> = K<sub>g</sub>·ω تقاس السرعة ω بوحدة:',o:['rpm','rad/s (راديان في الثانية)','Hz','درجة'],c:1,e:'ص 29: ω هي سرعة الدوران بالراديان في الثانية.'},
  {q:'ماذا يسمي الكتاب الثابت K<sub>g</sub>؟',o:['مقاومة المنتج','ثابت توليد الجهد أو ميل الخط','الثابت الزمني','تيار المجال'],c:1,e:'K_g هو ثابت توليد الجهد أو ميل الخط الذي يمثل العلاقة بين ω و V_a.'},
  {q:'عمود يدور بسرعة 1500 rpm. سرعته بالراديان في الثانية تقريباً:',o:['25 rad/s','157.1 rad/s','1500 rad/s','9425 rad/s'],c:1,e:'ω = 2π × 1500 ÷ 60 ≈ 157.1 rad/s (تحويل توضيحي).'},
  {q:'الخطأ في القيمة العددية للجهد ΔV هو:',o:['الفرق بين الجهد الفعلي والجهد من العلاقة المثالية عند نفس السرعة','الفرق بين سرعتين','الجهد عند السكون','زاوية متجه الخرج'],c:0,e:'تعريف الكتاب ص 29.'},
  {q:'أي مما يلي <b>ليس</b> من متطلبات تصميم التاكومترات في الكتاب؟',o:['أقل خطأ في زاوية الوجه','أكبر معامل تكبير K_g','أكبر قصور ذاتي','أقل ثابت زمني'],c:2,e:'المطلوب أقل قصور ذاتي، لا أكبر.'},
  {q:'تصنف مولدات التاكو حسب تصميمها ونظرية عملها إلى:',o:['مستمر وحثي وتزامني','نجمة ودلتا','خطوة وهجين','تنافري وعام'],c:0,e:'ص 29: مولدات للتيار المستمر أو مولدات حثية أو تزامنية.'},
  {q:'في مولد تاكو مثالي، إذا تضاعفت السرعة فإن الجهد:',o:['يبقى ثابتاً','يقل للنصف','يتضاعف','يزيد أربع مرات'],c:2,e:'V_a = K_g·ω علاقة خطية: ضعف ω يعطي ضعف V_a.'}
 ]
});

/* ============================== Lesson 2.2 ============================== */
B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'30–32، 34–35',
 title:'مولد التاكو للتيار المستمر: التركيب وتأثير مقاومة الحمل',
 summary:'تركيب مولد التاكو للتيار المستمر ذي التغذية المستقلة (الشكل ٢-١)، والعلاقة الخطية عند اللاحمل، ثم كيف تُنقص مقاومة الحمل الجهد على الأطراف، مع المثالين (٢-١) و (٢-٢).',
 stations:[
  {intro:true},

  {st:1,short:'التركيب',title:'٢-٢ مولدات التاكو للتيار المستمر',ref:'ص 30',
   q:'مولد التيار المستمر الذي درسته في آلات التيار المستمر… كيف يصبح جهاز قياس للسرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="إعادة رسم الشكل ٢-١: دائرة المجال بمصدرها المستقل وملفها، ودائرة المنتج بقوته الدافعة ومقاومته والمفتاح ومقاومة الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g fill="none" stroke="#2C4A40" stroke-width="2.5"><path d="M48 152 V84 H112 V118"/><path d="M112 222 V250 H48 V184"/><path d="M190 146 V84 H212"/><path d="M262 84 H286"/><path d="M314 84 H330 V118"/><path d="M330 222 V250 H190 V194"/></g><g data-tip="مصدر جهد المجال ⟦Vf⟧: مصدر تيار مستمر خارجي مستقل (بطاريات أو مصدر قدرة ساكن) يغذي ملف المجال."><circle cx="48" cy="168" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M48 178 V160" stroke="#2C4A40" stroke-width="2.5"/><polygon points="48,155 43,163 53,163" fill="#2C4A40"/></g><text x="26" y="173" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">f</tspan></text><g data-tip="تيار المجال ⟦If⟧: يمر في ملف المجال فيصنع الفيض المغناطيسي φ."><path d="M66 74 H94" stroke="#E8735A" stroke-width="3"/><polygon points="100,74 92,69 92,79" fill="#E8735A"/><text x="82" y="64" text-anchor="middle" font-size="15" fill="#E8735A" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">f</tspan></text></g><g data-tip="ملف المجال ومقاومته ⟦R⟧: يُغذّى من المصدر المستقل، ومنه يأتي الفيض المغناطيسي للمولد."><path d="M112 118 V128 L104 136 L120 150 L104 164 L120 178 L104 192 L120 206 L112 212 V222" fill="none" stroke="#2C4A40" stroke-width="2.5"/><rect x="98" y="118" width="28" height="104" fill="transparent"/></g><text x="132" y="174" font-size="15" fill="#2C4A40" font-family="var(--mono)">R</text><g data-tip="المنتج: يدور مع العمود فتتولد فيه القوة الدافعة الكهربائية ⟦Ea⟧. المستطيلان الداكنان هما الفرشتان على المبدل."><circle cx="190" cy="170" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="183" y="140" width="14" height="8" fill="#2C4A40"/><rect x="183" y="192" width="14" height="8" fill="#2C4A40"/><text x="190" y="175" text-anchor="middle" font-size="14" fill="#2C4A40" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">a</tspan></text></g><g data-tip="تيار المنتج ⟦Ia⟧: يخرج من المنتج إلى الحمل عندما يكون المفتاح مغلقاً."><path d="M178 132 V106" stroke="#E8735A" stroke-width="3"/><polygon points="178,100 173,108 183,108" fill="#E8735A"/><text x="170" y="122" text-anchor="end" font-size="15" fill="#E8735A" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">a</tspan></text></g><g data-tip="⟦Ra⟧: مقاومة ملفات المنتج مضافاً إليها مقاومة التلامس بين المبدل والفرش الكربونية."><path d="M212 84 H218 L222 76 L230 92 L238 76 L246 92 L254 76 L258 84 H262" fill="none" stroke="#2C4A40" stroke-width="2.5"/><rect x="212" y="70" width="50" height="28" fill="transparent"/></g><text x="237" y="66" text-anchor="middle" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">a</tspan></text><g data-tip="المفتاح ⟦(switch)⟧: مفتوح = لا حمل ⟦(RL = ∞)⟧، ومغلق = الحمل موصول ويمر تيار."><circle cx="286" cy="84" r="3.5" fill="#2C4A40"/><circle cx="314" cy="84" r="3.5" fill="#2C4A40"/><path d="M286 84 L314 84" stroke="#2C4A40" stroke-width="3"/><rect x="280" y="72" width="40" height="24" fill="transparent"/></g><g data-tip="مقاومة الحمل ⟦RL⟧: الجهاز الموصول على أطراف المنتج، مثل جهاز قياس الجهد."><path d="M330 118 V128 L322 136 L338 150 L322 164 L338 178 L322 192 L338 206 L330 212 V222" fill="none" stroke="#2C4A40" stroke-width="2.5"/><rect x="316" y="118" width="28" height="104" fill="transparent"/></g><text x="314" y="174" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">L</tspan></text><g data-tip="تيار الحمل ⟦IL⟧: في التغذية المستقلة يساوي تيار المنتج ⟦Ia⟧."><path d="M346 120 V140" stroke="#E8735A" stroke-width="3"/><polygon points="346,146 341,138 351,138" fill="#E8735A"/><text x="346" y="114" text-anchor="middle" font-size="13" fill="#E8735A" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">L</tspan></text></g><g data-tip="الجهد على أطراف المنتج ⟦Va = VT⟧: هو ما يقرؤه جهاز القياس، ومنه نعرف السرعة."><circle cx="272" cy="84" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="272" cy="250" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M272 232 V106" stroke="#12855A" stroke-width="2.5"/><polygon points="272,100 267,110 277,110" fill="#12855A"/><text x="266" y="196" text-anchor="end" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="9" dy="4">a</tspan><tspan dy="-4"> = V</tspan><tspan font-size="9" dy="4">T</tspan></text></g><text x="80" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">دائرة المجال</text><text x="262" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">دائرة المنتج</text></svg>`,
   cap:'إعادة رسم الشكل (٢-١): مولد التاكو للتيار المستمر ذو التغذية المستقلة لملفات المجال. دائرة المجال لا تتصل بدائرة المنتج.<br><b>مرّر المؤشر على الرموز والعناصر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>مولدات التاكو للتيار المستمر، هي في الأساس مولدات للتيار المستمر صغيرة الحجم، فتركيبها ونظرية عملها تمامًا كما في آلات التيار المستمر، وأغلب الأنواع انتشارًا هي مولدات التاكو للتيار المستمر ذات <b>التغذية المستقلة لملفات المجال</b> أو ذات <b>مغناطيسات طبيعية دائمة</b> لتوليد المجال المغناطيسي.</p>`,ref:'ص 30'},
    {predict:{q:'في مولد التاكو ذي التغذية المستقلة، من أين يأتي جهد ملفات المجال؟',opts:[
     ['من جهد المنتج نفسه بعد أن يبدأ المولد بالتوليد',false,'هذا هو المولد ذاتي التغذية. «مستقلة» تعني أن دائرة المجال منفصلة عن المنتج، كما في الشكل (٢-١).'],
     ['من مغناطيس دائم على العضو الدوار',false,'المغناطيس الدائم هو النوع الآخر الذي يذكره الكتاب، وفيه لا يوجد ملف مجال أصلاً.'],
     ['من مصدر تيار مستمر خارجي أو بطاريات أو مصادر القدرة الساكنة',true,'هذا ما ينص عليه الكتاب في ص 30، ويظهر في الشكل كمصدر \\(V_f\\) في دائرة منفصلة.']]}}
   ],
   body:[
    {book:String.raw`<p>وفي حالة مولدات التاكو للتيار المستمر ذات التغذية المستقلة لملفات المجال فإن الجهد المغذي للمجال يكون من مصدر تيار مستمر خارجي أو بطاريات أو مصادر القدرة الساكنة ذات التيار المستمر <span class="ltr">(Solid-states d c power supply)</span> كما هو واضح من الشكل (٢-١).</p>`,ref:'ص 30'},
    {tip:String.raw`<p>اقرأ الشكل من جهتين: <b>دائرة المجال</b> (المصدر \(V_f\) والتيار \(I_f\) وملف المجال R) تصنع الفيض المغناطيسي. و<b>دائرة المنتج</b> (القوة الدافعة \(E_a\) ومقاومة المنتج \(R_a\) والمفتاح ومقاومة الحمل \(R_L\)) هي التي نأخذ منها الجهد \(V_a\) لنعرف السرعة.</p>`,title:'دائرتان منفصلتان'},
    {add:String.raw`<p>كثير من محركات التيار المستمر المستعملة في آلات التحكم تُباع ومعها مولد تاكو صغير بمغناطيس دائم مركّب على طرف عمودها نفسه، فتصل إشارة السرعة إلى دائرة التحكم مباشرة دون مصدر إضافي للمجال.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: إلى أي دائرة ينتمي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'في الشكل <span class="ltr">(٢-١)</span> دائرتان منفصلتان. اختر الدائرة التي ينتمي إليها كل جزء.',cats:['دائرة المجال','دائرة المنتج'],items:[
 ['المصدر <span class="ltr">V<sub>f</sub></span> (مصدر خارجي أو بطاريات)',0,'«الجهد المغذي للمجال يكون من مصدر تيار مستمر خارجي أو بطاريات» (ص 30).'],
 ['القوة الدافعة <span class="ltr">E<sub>a</sub></span>',1,'تتولد في المنتج عند دورانه في الفيض.'],
 ['مقاومة الحمل <span class="ltr">R<sub>L</sub></span> (جهاز القياس)',1,'نأخذ الجهد من أطراف المنتج إلى الحمل.'],
 ['التيار <span class="ltr">I<sub>f</sub></span> الذي يصنع الفيض',0,'تيار المجال يصنع الفيض المغناطيسي، وهو مستقل عن تيار الحمل.'],
 ['مقاومة المنتج <span class="ltr">R<sub>a</sub></span>',1,'مقاومة ملفات المنتج ومقاومة التلامس بين المبدل والفرش (ص 31).']]})}
   ]},

  {st:2,short:'خصائص الخرج',title:'خصائص الخرج: الجهد يتناسب مع السرعة',ref:'ص 30–31',
   q:'ما الذي يجب أن يبقى ثابتاً حتى يصبح الجهد مقياساً صادقاً للسرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطان مستقيمان من نقطة الأصل للقوة الدافعة مع السرعة: الأشد ميلاً لتيار مجال أكبر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M64 250 H320 M64 250 V48" stroke="#2C4A40" stroke-width="2.5" fill="none"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><polygon points="64,40 59,50 69,50" fill="#2C4A40"/><text x="334" y="270" text-anchor="end" font-size="16" fill="#2C4A40" font-family="var(--mono)">ω</text><text x="56" y="56" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">a</tspan></text><g data-tip="تيار مجال أكبر ⟦If⟧ يعني فيضاً أكبر φ، فيكبر ⟦KE = K·φ⟧ ويصبح الخط أشد ميلاً: جهد أكبر عند السرعة نفسها."><path d="M64 250 L250 70" stroke="transparent" stroke-width="16"/><path d="M64 250 L250 70" stroke="#E8735A" stroke-width="4"/></g><text x="254" y="62" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">تيار مجال أكبر</text><g data-tip="عند ثبات تيار المجال (أي ثبات الفيض φ) يكون ⟦Ea = KE·ω⟧: خط مستقيم يبدأ من نقطة الأصل."><path d="M64 250 L300 130" stroke="transparent" stroke-width="16"/><path d="M64 250 L300 130" stroke="#12855A" stroke-width="4"/></g><text x="300" y="120" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700">تيار مجال أصغر</text><g data-tip="السرعة نفسها على الخطين: الجهد مختلف لأن تيار المجال مختلف. لذلك يجب أن يبقى الفيض ثابتاً حتى نقرأ السرعة من الجهد."><line x1="200" y1="250" x2="200" y2="118" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><circle cx="200" cy="181" r="6" fill="#12855A" stroke="#FBF6EE" stroke-width="2"/><circle cx="200" cy="118" r="6" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">بلا حمل: خطوط مستقيمة من نقطة الأصل</text></svg>`,
   cap:'عند ثبات الفيض تكون العلاقة خطاً مستقيماً، وتيار المجال يغيّر ميل الخط فقط (رسم توضيحي بلا أرقام).<br><b>مرّر المؤشر على الخطين والخط المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>خصائص الخرج لمولدات التاكو للتيار المستمر، هي العلاقة بين الجهد على أطراف المنتج \(V_a\) وسرعة الدوران \(\omega\)، عند ثبات الفيض المغناطيسي \(\phi\)، وثبات مقاومة الحمل \(R_L\)</p>
     <div class="eq">$$E_a \propto N\,\phi$$<span></span></div><div class="eq">$$E_a \propto \omega\,\phi = K\,\omega\,\phi$$<span></span></div>
     <div class="eq">$$\text{but }\ \phi = \text{constant}$$<span></span></div><div class="eq">$$E_a \propto \omega$$<span></span></div>
     <div class="eq">$$E_a = K_E\cdot\omega$$<span class="eqno" style="direction:rtl">(٢-٢)</span></div><div class="eq">$$\text{where }\ K_E = K\cdot\phi$$<span></span></div>`,ref:'ص 30'}
   ],
   body:[
    {book:String.raw`<p>ويلاحظ أن الجهد يمكن التحكم فيه عن طريق السرعة \(\omega\) وكذلك تيار المجال \(I_f\) وعند ثبات المجال المغناطيسي \(\Phi\) يمكن التحكم في الجهد عن طريق السرعة فقط.</p>`,ref:'ص 31'},
    {tip:String.raw`<p>القوة الدافعة تعتمد على شيئين: السرعة والفيض. إذا ثبّتنا الفيض (بتثبيت تيار المجال أو باستعمال مغناطيس دائم) يصبح \(K\cdot\phi\) رقماً ثابتاً نسميه \(K_E\)، ويبقى الجهد معتمداً على السرعة وحدها. هنا فقط يصلح المولد مقياساً للسرعة.</p>`,title:'لماذا نثبّت الفيض؟'},
    {predict:{q:'مولد تاكو ذو تغذية مستقلة، ضعُف مصدر المجال قليلاً فنقص تيار المجال، والسرعة لم تتغير. ماذا يحدث لقراءة الجهد؟',opts:[
     ['لا تتغير، لأن السرعة ثابتة',false,'الجهد يعتمد على السرعة والفيض معاً \\((E_a \\propto \\omega\\,\\phi)\\)، والفيض نقص.'],
     ['تقل، فيظن من يقرأ الجهاز أن السرعة قلّت',true,'نقص \\(I_f\\) يُنقص الفيض فيصغر \\(K_E\\)؛ لذلك يشترط الكتاب ثبات المجال حتى يتحكم في الجهد عن طريق السرعة فقط.'],
     ['تزيد، لأن المجال الأضعف يقاوم الدوران أقل',false,'المجال الأضعف يعطي قوة دافعة أقل عند السرعة نفسها، لا أكبر.']]}},
    {watch:String.raw`<p>المعادلة (٢-٢) تخص <b>اللاحمل</b> كما سيأتي في المحطة التالية. ولاحظ أن الكتاب يكتب \(N\) (السرعة بالدورة في الدقيقة) في السطر الأول ثم \(\omega\) بعده؛ كلاهما يعبّر عن السرعة، والتناسب واحد.</p>`},
    {title:'مختبر مصغّر: السرعة وتيار المجال',widget:(el,B)=>DCML.lab(el,B,{intro:'المرجع من مثال <span class="ltr">(٢-١)</span>: <span class="ltr">12 V</span> عند <span class="ltr">0.1 A</span> و<span class="ltr">1000 rpm</span>. الجهاز يحوّل الجهد إلى سرعة على أساس <span class="ltr">0.1 A</span>. حرّك السرعة وتيار المجال (أرقام تختارها أنت).',
 predict:{q:'الجهاز معاير على تيار مجال <span class="ltr">0.1 A</span>. نقص تيار المجال إلى <span class="ltr">0.08 A</span> والعمود يدور <span class="ltr">1000 rpm</span>. ماذا يعرض الجهاز؟',opts:[
  ['<span class="ltr">1000 rpm</span>، لأن السرعة لم تتغير',false,'الجهاز لا يرى السرعة؛ يرى الجهد فقط، والجهد نقص مع الفيض.'],
  ['سرعة أقل من <span class="ltr">1000 rpm</span>',true,'الجهد يتناسب مع الفيض والسرعة معاً: <span class="ltr">12 × 0.8 = 9.6 V</span>، فيظنها الجهاز <span class="ltr">800 rpm</span>. لذلك يجب ثبات الفيض.'],
  ['سرعة أكبر من <span class="ltr">1000 rpm</span>',false,'المجال الأضعف يعطي جهداً أقل لا أكبر.']]},
 ins:[{k:'n',l:'السرعة الحقيقية N',min:0,max:2000,step:50,v:1000,dp:0,u:'rpm'},{k:'f',l:'تيار المجال I<sub>f</sub>',seg:[[0.08,'0.08 A'],[0.1,'0.1 A'],[0.12,'0.12 A']],v:0.1}],
 calc:(s,P,B)=>{const E=12*(s.f/0.1)*(s.n/1000),rd=E/12*1000,bad=Math.abs(rd-s.n)>0.5;
  return {facts:[['الجهد E<sub>a</sub>',DCML.fm(B,E,2)+' V','hi'],['السرعة التي يعرضها الجهاز',DCML.fm(B,rd,0)+' rpm',bad?'bad':''],['الخطأ',DCML.fm(B,rd-s.n,0)+' rpm',bad?'bad':'']],
   plot:{xr:[0,2000],yr:[0,30],xl:'N (rpm)',yl:'E<tspan font-size="9" dy="3">a</tspan><tspan dy="-3"> (V)</tspan>',curves:[{f:x=>12*x/1000,col:'--muted',dash:'5 4',w:2},{f:x=>12*(s.f/0.1)*x/1000,col:'--blue'}],cur:[s.n,E]},
   msg:bad?'تيار المجال تغيّر، فتغيّر ميل الخط: الجهاز يخطئ في السرعة مع أنه يقرأ الجهد صحيحاً.':'الفيض ثابت عند قيمة المعايرة: الجهد يتبع السرعة وحدها، والقراءة صحيحة.',cls:bad?'warn':''}}})}
   ]},

  {st:3,short:'توصيل الحمل',title:'تأثير توصيل الحمل',ref:'ص 31',
   q:'عندما نوصل جهاز قياس على أطراف المولد، هل يقرأ القوة الدافعة كاملة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="إعادة رسم الشكل ٢-٢: الخاصية المثالية خط مستقيم من الأصل، والخاصية الفعلية تبدأ بعد منطقة ميتة وتنحني تحت الخط المثالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المنطقة الميتة ⟦(Dead zone)⟧: سرعات صغيرة لا يظهر عندها أي جهد على أطراف المولد. سببها في الدرس التالي."><rect x="60" y="40" width="30" height="210" fill="#E8735A" opacity=".18"/><text x="75" y="34" text-anchor="middle" font-size="12" fill="#B4472F" font-weight="700" font-family="var(--mono)">Dead zone</text></g><path d="M60 250 H322 M60 250 V44" stroke="#2C4A40" stroke-width="2.5" fill="none"/><polygon points="330,250 320,245 320,255" fill="#2C4A40"/><polygon points="60,36 55,46 65,46" fill="#2C4A40"/><text x="338" y="256" text-anchor="end" font-size="15" fill="#2C4A40" font-family="var(--mono)">ω</text><text x="52" y="58" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">a</tspan></text><g data-tip="الخاصية المثالية ⟦(Ideal Characteristic)⟧ عند اللاحمل ⟦RL = ∞⟧: خط مستقيم من نقطة الأصل."><path d="M60 250 L312 68" stroke="transparent" stroke-width="16"/><path d="M60 250 L312 68" stroke="#12855A" stroke-width="3.5"/></g><text x="150" y="140" text-anchor="end" font-size="12.5" fill="#12855A" font-weight="700" font-family="var(--mono)">Ideal</text><text x="150" y="156" text-anchor="end" font-size="12.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="9" dy="4">L</tspan><tspan dy="-4"> = ∞</tspan></text><g data-tip="الخاصية الفعلية ⟦(Actual Characteristic)⟧ عندما تكون ⟦RL⟧ صغيرة: تبدأ بعد المنطقة الميتة، وتبقى تحت الخط المثالي، وتنحني عند السرعات العالية."><path d="M90 250 Q230 150 315 125" fill="none" stroke="transparent" stroke-width="16"/><path d="M90 250 Q230 150 315 125" fill="none" stroke="#E8735A" stroke-width="3.5"/></g><text x="290" y="162" text-anchor="middle" font-size="12.5" fill="#B4472F" font-weight="700" font-family="var(--mono)">Actual</text><text x="290" y="178" text-anchor="middle" font-size="12.5" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="9" dy="4">L</tspan><tspan dy="-4"> = small</tspan></text><g data-tip="⟦ΔV⟧: الفرق بين الجهد الفعلي والجهد المثالي عند السرعة نفسها، أي الخطأ في القيمة العددية للجهد."><rect x="280" y="80" width="40" height="56" fill="transparent"/><path d="M288 92 V127" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 3"/><polygon points="288,88 284,96 292,96" fill="#2C4A40"/><polygon points="288,131 284,123 292,123" fill="#2C4A40"/><text x="296" y="114" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ΔV</text></g><g data-tip="⟦Δω⟧: عرض المنطقة الميتة على محور السرعة."><path d="M60 262 H90 M60 257 V267 M90 257 V267" stroke="#B4472F" stroke-width="2"/><text x="75" y="282" text-anchor="middle" font-size="14" fill="#B4472F" font-weight="700" font-family="var(--mono)">Δω</text></g></svg>`,
   cap:'إعادة رسم الشكل (٢-٢): العلاقة بين الجهد المتولد وسرعة الدوران لمولد تاكو تيار مستمر ذي تغذية مستقلة.<br><b>مرّر المؤشر على المنحنيين والرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>المعادلة (٢-٢) تمثل العلاقة بين الجهد المتولد \(E_a\) وسرعة الدوران \(\omega\) <b>عند اللاحمل (\(R_L=\infty\))</b> وهي علاقة خطية، ولكن عند توصيل أطراف المنتج لأي جهاز له مقاومة داخلية \(R_L\) فإن فرق الجهد على الأطراف يصبح كالتالي:</p>
     <div class="eq">$$V_a = E_a - I_a R_a$$<span class="eqno" style="direction:rtl">(٢-٣)</span></div>`,ref:'ص 31'}
   ],
   body:[
    {book:String.raw`<p>حيث \(I_a\) هو تيار المنتج، \(R_a\) هي <b>مقاومة ملفات المنتج بالإضافة إلى مقاومة التلامس بين مبدل التيار (الموحد) والفرش الكربونية</b>.</p>
     <p>من خلال الشكل (٢-٢) وكذلك المعادلة (٢-٣) يمكن إثبات أن مولد التاكو للتيار المستمر له علاقة خطية بين الجهد والسرعة.</p>`,ref:'ص 31'},
    {tip:String.raw`<p>بلا حمل لا يمر تيار، فالجهد على الأطراف = القوة الدافعة كاملة. عند توصيل جهاز يمر تيار \(I_a\)، فيضيع جزء من الجهد داخل المولد نفسه على \(R_a\) (هبوط قدره \(I_aR_a\))، ويصل الباقي فقط إلى الأطراف.</p>
     <p>في الشكل: الخط الأخضر هو اللاحمل، والمنحنى البرتقالي هو المولد مع حمل مقاومته صغيرة. أما المنطقة الميتة والانحناء فسببهما في الدرس التالي.</p>`,title:'أين يذهب جزء من الجهد؟'},
    {predict:{q:'ماذا تشمل \\(R_a\\) في المعادلة (٢-٣) حسب الكتاب؟',opts:[
     ['مقاومة الحمل الموصول على الأطراف',false,'مقاومة الحمل رمزها \\(R_L\\)، وهي خارج المولد.'],
     ['مقاومة ملف المجال',false,'ملف المجال في دائرة منفصلة (الشكل ٢-١)، وتيار المنتج لا يمر فيه.'],
     ['مقاومة ملفات المنتج ومقاومة التلامس بين المبدل والفرش الكربونية',true,'هذا تعريف الكتاب في ص 31. وسيتبين في الدرس التالي أن مقاومة التلامس هذه لا تبقى ثابتة.']]}},
    {title:'مختبر مصغّر: أغلق المفتاح واقرأ الأطراف',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام مثال <span class="ltr">(٢-٢)</span>: <span class="ltr">R<sub>a</sub> = 0.025 Ω</span>، والحمل <span class="ltr">40 W</span> عند <span class="ltr">20 V</span>، فالقوة الدافعة <span class="ltr">20.05 V</span>. افتح المفتاح وأغلقه وقارن.',
 predict:{q:'المولد يدور بسرعة ثابتة. أغلقنا المفتاح فمرّ تيار في الحمل. ماذا يحدث لجهد الأطراف <span class="ltr">V<sub>a</sub></span>؟',opts:[
  ['يبقى مساوياً للقوة الدافعة <span class="ltr">E<sub>a</sub></span>',false,'هذا صحيح عند اللاحمل فقط، حين لا يمر تيار.'],
  ['يقل قليلاً عن <span class="ltr">E<sub>a</sub></span>',true,'المعادلة <span class="ltr">(٢-٣)</span>: <span class="ltr">V<sub>a</sub> = E<sub>a</sub> − I<sub>a</sub>R<sub>a</sub></span>؛ جزء من الجهد يضيع داخل المولد.'],
  ['يزيد عن <span class="ltr">E<sub>a</sub></span>',false,'لا يزيد جهد الأطراف عن القوة الدافعة في المولد.']]},
 ins:[{k:'sw',l:'المفتاح',seg:[[0,'مفتوح (لا حمل)'],[1,'مغلق (حمل 40 W)']],v:0}],
 calc:(s,P,B)=>{const E=20.05,I=s.sw?2:0,V=E-I*0.025;
  return {pic:dcCircuitSVG({sw:!!s.sw}),
   facts:[['E<sub>a</sub>',DCML.fm(B,E,2)+' V'],['I<sub>a</sub>',DCML.fm(B,I,0)+' A'],['الهبوط I<sub>a</sub>R<sub>a</sub>',DCML.fm(B,I*0.025,2)+' V'],['V<sub>a</sub>',DCML.fm(B,V,2)+' V','hi']],
   msg:s.sw?'مرّ تيار <span class="ltr">2 A</span>، فضاع <span class="ltr">0.05 V</span> على <span class="ltr">R<sub>a</sub></span>، ووصل الباقي إلى الأطراف.':'لا تيار: جهد الأطراف يساوي القوة الدافعة كاملة (<span class="ltr">R<sub>L</sub> = ∞</span>).'}}})}
   ]},

  {st:4,short:'تأثير مقاومة الحمل',title:'اشتقاق تأثير مقاومة الحمل',ref:'ص 32',
   q:'هل يكفي أن نقول «الحمل يُنقص الجهد»؟ أم نستطيع أن نحسب كم ينقص؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عمود القوة الدافعة يساوي مجموع الهبوط داخل المنتج والجهد على الأطراف" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="القوة الدافعة الكهربائية ⟦Ea⟧ المتولدة داخل المنتج."><rect x="70" y="60" width="70" height="200" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="166" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="12" dy="5">a</tspan></text></g><text x="180" y="166" text-anchor="middle" font-size="26" fill="#2C4A40" font-weight="700">=</text><g data-tip="الهبوط داخل المولد ⟦Ia·Ra⟧: يكبر كلما زاد تيار المنتج، أي كلما صغرت مقاومة الحمل ⟦RL⟧."><rect x="220" y="60" width="70" height="44" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="255" y="88" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">a</tspan><tspan dy="-4">R</tspan><tspan font-size="10" dy="4">a</tspan></text></g><g data-tip="الجهد على الأطراف ⟦Va⟧: ما يصل إلى جهاز القياس. ⟦Ia = Va/RL⟧ في المعادلة (٢-٤)."><rect x="220" y="108" width="70" height="152" rx="8" fill="#12855A" stroke="#2C4A40" stroke-width="2.5"/><text x="255" y="190" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="12" dy="5">a</tspan></text></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">القوة الدافعة = الهبوط في المنتج + جهد الأطراف</text></svg>`,
   cap:'المعادلة (٢-٣) في صورة أعمدة: كلما كبر الجزء البرتقالي صغر ما يصل إلى الأطراف (الأطوال توضيحية).<br><b>مرّر المؤشر على الأعمدة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<div class="eq">$$I_a = \frac{V_a}{R_L}$$<span class="eqno" style="direction:rtl">(٢-٤)</span></div>
     <div class="eq">$$V_a = E_a - \frac{V_a}{R_L}\cdot R_a$$<span></span></div>
     <div class="eq">$$V_a\left(1+\frac{R_a}{R_L}\right) = E_a$$<span></span></div>
     <div class="eq">$$V_a = \frac{E_a}{\left(1+\dfrac{R_a}{R_L}\right)}$$<span></span></div>
     <div class="eq">$$V_a = \frac{K_E\cdot\omega}{\left(1+\dfrac{R_a}{R_L}\right)}$$<span class="eqno" style="direction:rtl">(٢-٥)</span></div>`,ref:'ص 32'}
   ],
   body:[
    {book:String.raw`<p>المعادلة (٢-٥) تبين أن تاكومترات التيار المستمر لها علاقة خطية بين \(V_a\) و \(\omega\)، طالما أن كلًا من \(R_a\) و \(\phi\) ثابتان في القيمة. كلما تغيرت قيمة \(R_a\) أو قيمة \(\phi\) ابتعدت هذه العلاقة عن العلاقة الخطية. أيضًا هذه العلاقة تكون خطية عندما تكون <b>\(R_L\) كبيرة القيمة</b>. ولكن إذا انخفضت هذه المقاومة فإن العلاقة تكون غير خطية كما هو واضح من شكل (٢-٢)، أي أنه يمكن أن يحدث خطأ في قراءة السرعة وهذا يرجع لسببين:</p>`,ref:'ص 32'},
    {tip:String.raw`<p>خطوات الاشتقاق: نعوّض تيار المنتج من (٢-٤) في (٢-٣)، ثم نجمع حدود \(V_a\) في طرف واحد، ثم نقسم على القوس، ثم نعوّض \(E_a\) من (٢-٢).</p>
     <p>القوس \(\left(1+R_a/R_L\right)\) هو «المقسوم عليه»: إذا كانت \(R_L\) كبيرة جداً بالنسبة لـ \(R_a\) يقترب القوس من 1 فيقترب \(V_a\) من \(E_a\). والسببان اللذان يذكرهما الكتاب في آخر الفقرة هما موضوع الدرس التالي.</p>`,title:'ماذا تقول (٢-٥)؟'},
    {title:'كم يصل إلى الأطراف؟',widget:(el,B)=>{
      const f=(x,d)=>{let s=(+x).toFixed(d);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');return s};
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">حرّك المنزلق لتغيّر مقاومة الحمل <span class="ltr">R<sub>L</sub></span> بالنسبة لمقاومة المنتج <span class="ltr">R<sub>a</sub></span>، وشاهد نسبة ما يصل إلى الأطراف حسب المعادلة (٢-٥). لا نحتاج أرقاماً للمولد: النسبة وحدها تكفي.</p>
       <label class="w-sl"><span><span class="ltr">R<sub>L</sub> = <b data-o="k"></b> × R<sub>a</sub></span></span><input type="range" min="0" max="100" step="1" value="50" dir="ltr" aria-label="نسبة مقاومة الحمل إلى مقاومة المنتج"></label>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i><i class="spd-gap"></i></div><div class="spd-ax"><span>0</span><span>E<sub>a</sub></span></div></div>
       <p class="sub" style="margin-top:4px">الأزرق = الجهد على الأطراف <span class="ltr">V<sub>a</sub></span>، والأصفر = الهبوط داخل المنتج <span class="ltr">I<sub>a</sub>R<sub>a</sub></span>.</p>
       <div class="w-facts"><div><span>القوس <span class="ltr">1 + R<sub>a</sub>/R<sub>L</sub></span></span><b data-o="d"></b></div><div><span><span class="ltr">V<sub>a</sub> ÷ E<sub>a</sub></span></span><b data-o="p"></b></div><div><span>الهبوط <span class="ltr">I<sub>a</sub>R<sub>a</sub> ÷ E<sub>a</sub></span></span><b data-o="q"></b></div><div><span>النتيجة</span><b data-o="m" style="font-family:var(--font);font-size:14px;direction:rtl;text-align:start"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const k=Math.pow(10,+rg.value/25),d=1+1/k,p=1/d;
        o('k').textContent=f(k,k<10?2:0);o('d').textContent=f(d,4);o('p').textContent=f(p*100,2)+' %';o('q').textContent=f((1-p)*100,2)+' %';
        o('m').innerHTML=(p>0.99?'يكاد يساوي ':p>0.9?'أقل قليلاً من ':'أقل بوضوح من ')+'E<sub>a</sub>';
        el.querySelector('.spd-n').style.width=p*100+'%';el.querySelector('.spd-gap').style.width=(1-p)*100+'%'};
      rg.oninput=draw;draw();
    }},
    {predict:{q:'السرعة ثابتة، واستبدلنا جهاز القياس بآخر مقاومته الداخلية \\(R_L\\) أصغر. ماذا يحدث للجهد \\(V_a\\)؟',opts:[
     ['يزيد، لأن المقاومة الأصغر تمرر تياراً أكبر',false,'التيار الأكبر يزيد الهبوط \\(I_aR_a\\) داخل المولد، فيصل إلى الأطراف أقل.'],
     ['لا يتغير، لأن السرعة ثابتة',false,'\\(E_a\\) لا يتغير، لكن \\(V_a\\) يعتمد أيضاً على القوس \\(1+R_a/R_L\\).'],
     ['يقل، لأن القوس \\(1+R_a/R_L\\) يكبر',true,'من المعادلة (٢-٥): المقام يكبر عندما تصغر \\(R_L\\)، فيقل \\(V_a\\)؛ لذلك نريد جهاز قياس بمقاومة كبيرة.']]}},
    {watch:String.raw`<p>المعادلة (٢-٥) وحدها ما زالت <b>خطاً مستقيماً</b> (ميله أقل فقط) ما دامت \(R_a\) و \(\phi\) ثابتتين. الانحناء الحقيقي في الشكل (٢-٢) يأتي من «السببين» اللذين يذكرهما الكتاب بعد ذلك: رد فعل المنتج وجهد التلامس عند الفرش.</p>`}
   ]},

  {st:5,short:'المثالان',title:'مثالا الكتاب (٢-١) و (٢-٢)',ref:'ص 34–35',
   q:'مثالان يطبّقان أفكار هذا الدرس بأرقام. الحل الكامل خطوة بخطوة في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جدول حالات مثال ٢-١: القوة الدافعة وتيار المجال والسرعة في الحالات الثلاث" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="34" y="66" width="292" height="190" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="52" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">مثال (٢-١)</text><rect x="34" y="66" width="292" height="40" rx="14" fill="#2C4A40"/><rect x="34" y="92" width="292" height="14" fill="#2C4A40"/><text x="258" y="92" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">a</tspan></text><text x="172" y="92" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">f</tspan></text><text x="86" y="92" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">N</text><text x="312" y="140" text-anchor="end" font-size="12" fill="#2C4A40">معطى</text><text x="312" y="190" text-anchor="end" font-size="12" fill="#2C4A40">(ا)</text><text x="312" y="240" text-anchor="end" font-size="12" fill="#2C4A40">(ب)</text><line x1="34" y1="156" x2="326" y2="156" stroke="#2C4A40" stroke-width="1" opacity=".4"/><line x1="34" y1="206" x2="326" y2="206" stroke="#2C4A40" stroke-width="1" opacity=".4"/><g font-size="14" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle" direction="ltr"><text x="258" y="140">12 V</text><text x="172" y="140">0.1 A</text><text x="86" y="140">1000 rpm</text><text x="172" y="190">0.15 A</text><text x="86" y="190">1000 rpm</text><text x="172" y="240">0.1 A</text><text x="86" y="240">1400 rpm</text></g><g data-tip="(ا) زاد تيار المجال من ⟦0.1 A⟧ إلى ⟦0.15 A⟧ والسرعة ثابتة، فزاد الجهد بالنسبة نفسها: ⟦12 × 0.15/0.1 = 18 V⟧."><rect x="222" y="168" width="72" height="32" rx="8" fill="#12855A"/><text x="258" y="190" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">18 V</text></g><g data-tip="(ب) ثبت تيار المجال وزادت السرعة من ⟦1000⟧ إلى ⟦1400 rpm⟧، فزاد الجهد بالنسبة نفسها: ⟦12 × 1400/1000 = 16.8 V⟧."><rect x="222" y="218" width="72" height="32" rx="8" fill="#12855A"/><text x="258" y="240" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">16.8 V</text></g><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الجهد يتناسب مع تيار المجال × السرعة</text></svg>`,
   cap:'معطيات مثال (٢-١) ونتيجتاه (الخانتان الخضراوان).<br><b>مرّر المؤشر على النتيجتين (أو المسهما في الجوال) لترى كيف حُسبتا.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٢-١) <span class="ref">ص 34</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(E_{a1}=12\,\text{V}\)</span><span class="kv ltr">\(I_{f1}=0.1\,\text{A}\)</span><span class="kv ltr">\(N_1=1000\,\text{rpm}\)</span></div>
      <div class="kv-row"><small>المطلوب</small><span class="kv">(ا) <span class="ltr">\(I_f=0.15\,\text{A}\)</span> و <span class="ltr">\(1000\,\text{rpm}\)</span></span><span class="kv">(ب) <span class="ltr">\(I_f=0.1\,\text{A}\)</span> و <span class="ltr">\(1400\,\text{rpm}\)</span></span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(E_{a2}=18\,\text{V}\)</span><span class="kv res ltr">\(E_{a3}=16.8\,\text{V}\)</span></div></div>
     <div class="exc"><header>مثال (٢-٢) <span class="ref">ص 34–35</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(40\,\text{W}\)</span><span class="kv ltr">\(20\,\text{V}\)</span><span class="kv ltr">\(R_a=0.025\,\Omega\)</span><span class="kv">ثم <span class="ltr">\(50\,\text{W}\)</span></span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(I_a=2\,\text{A}\)</span><span class="kv res ltr">\(E_a=20.05\,\text{V}\)</span><span class="kv res ltr">\(I_a=2.5\,\text{A}\)</span><span class="kv res ltr">\(E_a=20.0625\,\text{V}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {book:String.raw`<p>من المثال السابق يلاحظ أن الجهد المتولد \(E_a\) والجهد على أطراف المنتج \(V_a\) يمكن التحكم فيها عن طريق السرعة \(\omega\) وكذلك تيار المجال \(I_f\) ولكن عند ثبات المجال المغناطيسي \(\Phi\) يمكن التحكم في الجهد عن طريق السرعة فقط.</p>`,ref:'ص 34'},
    {predict:{q:String.raw`في مثال (٢-١): بنفس تيار المجال <span class="ltr">0.1 A</span>، ارتفعت السرعة من <span class="ltr">1000 rpm</span> إلى <span class="ltr">1400 rpm</span>. كم تصبح القوة الدافعة؟`,opts:[
     [String.raw`<span class="ltr">12 V</span>`,false,'السرعة تغيرت، والقوة الدافعة تتناسب معها عند ثبات تيار المجال.'],
     [String.raw`<span class="ltr">8.57 V</span>`,false,'هذا ناتج القسمة بالمقلوب (12 × 1000 ÷ 1400). السرعة زادت فيجب أن يزيد الجهد لا أن يقل.'],
     [String.raw`<span class="ltr">16.8 V</span>`,true,'\\(E_{a3}=12\\times\\dfrac{0.1\\times1400}{0.1\\times1000}=16.8\\ \\text{V}\\) كما في حل الكتاب.'],
     [String.raw`<span class="ltr">18 V</span>`,false,'هذا ناتج الفرع (ا) الذي تغيّر فيه تيار المجال إلى 0.15 A، لا السرعة.']]}},
    {tip:String.raw`<p>في مثال (٢-٢) لا توجد سرعة؛ المطلوب فيه تطبيق المعادلة (٢-٣) بعد ترتيبها: \(E_a = V_T + I_aR_a\)، مع \(I_L=I_a=P_{out}/V_T\). لاحظ أن زيادة الحمل من <span class="ltr">40 W</span> إلى <span class="ltr">50 W</span> زادت التيار، فزاد الفرق بين \(E_a\) و \(V_T\) (وهو \(I_aR_a\)).</p>`,title:'وفي مثال (٢-٢)؟'},
    {watch:String.raw`<p>في مثال (٢-١) ص 34 يكتب جدول المعطيات <span class="ltr">I<sub>f2</sub> = 0.2 A</span>، بينما نص السؤال والحساب يستعملان <span class="ltr">0.15 A</span>، والناتج <span class="ltr">18 V</span> صحيح لـ <span class="ltr">0.15 A</span> (لو كانت <span class="ltr">0.2 A</span> لكان الناتج <span class="ltr">24 V</span>). اعتمد <span class="ltr">0.15 A</span> كما في السؤال والحل.</p>`,fix:true},
    {title:'مختبر مصغّر: مثال (٢-٢) بحملين',widget:(el,B)=>DCML.lab(el,B,{intro:'جهد الأطراف <span class="ltr">20 V</span> و<span class="ltr">R<sub>a</sub> = 0.025 Ω</span> كما في المثال. اختر الحمل وتابع الحساب.',
 predict:{q:'زاد الحمل من <span class="ltr">40 W</span> إلى <span class="ltr">50 W</span> وجهد الأطراف <span class="ltr">20 V</span>. كم يصبح تيار المنتج؟',opts:[
  ['<span class="ltr">2 A</span>',false,'هذا تيار حمل <span class="ltr">40 W</span>.'],
  ['<span class="ltr">2.5 A</span>',true,'<span class="ltr">I<sub>a</sub> = P ÷ V<sub>T</sub> = 50 ÷ 20 = 2.5 A</span> (ص 35).'],
  ['<span class="ltr">0.4 A</span>',false,'قسمنا الجهد على القدرة بالمقلوب؛ التيار = القدرة ÷ الجهد.']]},
 ins:[{k:'p',l:'قدرة الحمل',seg:[[40,'40 W'],[50,'50 W']],v:40}],
 calc:(s,P,B)=>{const I=s.p/20,dv=I*0.025;
  return {facts:[['<span class="ltr">I<sub>a</sub> = P ÷ V<sub>T</sub></span>',DCML.fm(B,I,1)+' A'],['I<sub>a</sub>R<sub>a</sub>',DCML.fm(B,dv,4)+' V'],['<span class="ltr">E<sub>a</sub> = V<sub>T</sub> + I<sub>a</sub>R<sub>a</sub></span>',DCML.fm(B,20+dv,4)+' V','hi']],
   bars:[{l:'الفرق بين E<sub>a</sub> و V<sub>T</sub>',v:dv,max:0.1,txt:DCML.fm(B,dv,4)+' V',col:'--live'}],
   msg:'الحمل الأكبر يعني تياراً أكبر، فيكبر الهبوط داخل المولد والفرق بين <span class="ltr">E<sub>a</sub></span> و<span class="ltr">V<sub>T</sub></span>.'}}})}
   ]},

  {recap:[
   String.raw`مولد التاكو للتيار المستمر مولد تيار مستمر صغير، مجاله بتغذية مستقلة (الشكل ٢-١) أو بمغناطيس دائم.`,
   String.raw`عند ثبات الفيض وبلا حمل، المعادلة (٢-٢): \(E_a = K_E\cdot\omega\) و \(K_E = K\cdot\phi\). والجهد يتحكم فيه بالسرعة وتيار المجال، وعند ثبات المجال بالسرعة فقط.`,
   String.raw`مع الحمل، المعادلة (٢-٣): \(V_a = E_a - I_aR_a\)، و \(R_a\) تشمل مقاومة التلامس بين المبدل والفرش.`,
   String.raw`المعادلتان (٢-٤) و (٢-٥): \(I_a=V_a/R_L\) و \(V_a = \dfrac{K_E\,\omega}{1+R_a/R_L}\): العلاقة خطية ما دامت \(R_a\) و \(\phi\) ثابتتين و \(R_L\) كبيرة.`]}
],
 theory:[
  {h:'٢-٢ مولدات التاكو للتيار المستمر (Direct Current Tacho-Generators)',ref:'ص 30',html:`<p>«مولدات التاكو للتيار المستمر، هي في الأساس مولدات للتيار المستمر صغيرة الحجم، فتركيبها ونظرية عملها تمامًا كما في آلات التيار المستمر، وأغلب الأنواع انتشارًا هي مولدات التاكو للتيار المستمر ذات <b>التغذية المستقلة لملفات المجال</b> أو ذات <b>مغناطيسات طبيعية دائمة</b> لتوليد المجال المغناطيسي.»</p>
   <p>«وفي حالة مولدات التاكو للتيار المستمر ذات التغذية المستقلة لملفات المجال فإن الجهد المغذي للمجال يكون من مصدر تيار مستمر خارجي أو بطاريات أو مصادر القدرة الساكنة ذات التيار المستمر <span class="ltr">(Solid-states d c power supply)</span> كما هو واضح من الشكل (٢-١).»</p>`},
  {fig:'(٢-١)',ref:'ص 30',caption:'مولد التاكو للتيار المستمر ذات التغذية المستقلة لملفات المجال: يسارًا دائرة المجال (المصدر \\(V_f\\) والتيار \\(I_f\\) في ملف المجال R)، ويمينًا دائرة المنتج (\\(E_a\\) و \\(R_a\\) والمفتاح ومقاومة الحمل \\(R_L\\))',draw:()=>`<div class="svgbox" style="max-width:600px;margin-inline:auto">${dcCircuitSVG()}</div>`},
  {h:'خصائص الخرج',ref:'ص 30',html:`<p>«خصائص الخرج لمولدات التاكو للتيار المستمر، هي العلاقة بين الجهد على أطراف المنتج \\(V_a\\) وسرعة الدوران \\(\\omega\\)، عند ثبات الفيض المغناطيسي \\(\\phi\\)، وثبات مقاومة الحمل \\(R_L\\)»</p>
   $$E_a \\propto N\\,\\phi$$ $$E_a \\propto \\omega\\,\\phi = K\\,\\omega\\,\\phi$$ $$\\text{but }\\ \\phi = \\text{constant}$$ $$E_a \\propto \\omega$$
   $$E_a = K_E\\cdot\\omega \\qquad (٢-٢)$$ $$\\text{where }\\ K_E = K\\cdot\\phi$$`},
  {html:`<p>«ويلاحظ أن الجهد يمكن التحكم فيه عن طريق السرعة \\(\\omega\\) وكذلك تيار المجال \\(I_f\\) وعند ثبات المجال المغناطيسي \\(\\Phi\\) يمكن التحكم في الجهد عن طريق السرعة فقط.» <span class="ref">ص 31</span></p>`},
  {h:'تأثير توصيل الحمل',ref:'ص 31',html:`<p>«المعادلة (٢-٢) تمثل العلاقة بين الجهد المتولد \\(E_a\\) وسرعة الدوران \\(\\omega\\) <b>عند اللاحمل (\\(R_L=\\infty\\))</b> وهي علاقة خطية، ولكن عند توصيل أطراف المنتج لأي جهاز له مقاومة داخلية \\(R_L\\) فإن فرق الجهد على الأطراف يصبح كالتالي:»</p>
   $$V_a = E_a - I_a R_a \\qquad (٢-٣)$$
   <p>«حيث \\(I_a\\) هو تيار المنتج، \\(R_a\\) هي <b>مقاومة ملفات المنتج بالإضافة إلى مقاومة التلامس بين مبدل التيار (الموحد) والفرش الكربونية</b>.» «من خلال الشكل (٢-٢) وكذلك المعادلة (٢-٣) يمكن إثبات أن مولد التاكو للتيار المستمر له علاقة خطية بين الجهد والسرعة.»</p>`},
  {fig:'(٢-٢)',ref:'ص 31',caption:'العلاقة بين الجهد المتولد وسرعة الدوران لمولد تاكو تيار مستمر ذات التغذية المستقلة وتظهر فيها المنطقة الميتة منحنى الحمل',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${fig22SVG()}</div>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'كُتب على الخط المستقيم في الشكل (٢-٢) «<span class="ltr">Idial Characteristic</span>»، والصحيح «<span class="ltr">Ideal Characteristic</span>» (الخاصية المثالية). وعنوان الشكل «… وتظهر فيها المنطقة الميتة منحني الحمل» كما طُبع.'+'</div>'},
  {h:'اشتقاق تأثير مقاومة الحمل',ref:'ص 32',html:`<p>تيار المنتج هو نفسه تيار الحمل:</p>
   $$I_a = \\frac{V_a}{R_L} \\qquad (٢-٤)$$
   $$V_a = E_a - \\frac{V_a}{R_L}\\cdot R_a$$ $$V_a\\left(1+\\frac{R_a}{R_L}\\right) = E_a$$ $$V_a = \\frac{E_a}{\\left(1+\\dfrac{R_a}{R_L}\\right)}$$
   $$V_a = \\frac{K_E\\cdot\\omega}{\\left(1+\\dfrac{R_a}{R_L}\\right)} \\qquad (٢-٥)$$
   <p>«المعادلة (٢-٥) تبين أن تاكومترات التيار المستمر لها علاقة خطية بين \\(V_a\\) و \\(\\omega\\)، طالما أن كلًا من \\(R_a\\) و \\(\\phi\\) ثابتان في القيمة. كلما تغيرت قيمة \\(R_a\\) أو قيمة \\(\\phi\\) ابتعدت هذه العلاقة عن العلاقة الخطية. أيضًا هذه العلاقة تكون خطية عندما تكون <b>\\(R_L\\) كبيرة القيمة</b>. ولكن إذا انخفضت هذه المقاومة فإن العلاقة تكون غير خطية كما هو واضح من شكل (٢-٢)، أي أنه يمكن أن يحدث خطأ في قراءة السرعة وهذا يرجع لسببين» — وهما موضوع الدرس التالي.</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في (٢-٥) القوس \\(1+R_a/R_L\\) يقسم الجهد. إذا كانت \\(R_L\\) كبيرة جداً (فولتميتر جيد) يصبح القوس ≈ 1 فيكون \\(V_a\\approx E_a\\). مثال: <span class="ltr">E<sub>a</sub> = 20 V</span>، <span class="ltr">R<sub>a</sub> = 1 Ω</span>، <span class="ltr">R<sub>L</sub> = 99 Ω</span> ⇒ <span class="ltr">V<sub>a</sub> = 20 ÷ 1.0101 ≈ 19.8 V</span>. الخط يبقى مستقيماً لكن ميله يقل؛ وانحناؤه الحقيقي يأتي من الأسباب في الدرس التالي.`},
  {h:'مثالا الكتاب (٢-١) و (٢-٢)',ref:'ص 34–35',html:`<p>المثالان محلولان في تبويب «الأمثلة المحلولة» بأرقام الكتاب، ويمكنك تغيير الأرقام. وتعليق الكتاب بعد المثال (٢-١): «من المثال السابق يلاحظ أن الجهد المتولد \\(E_a\\) والجهد على أطراف المنتج \\(V_a\\) يمكن التحكم فيها عن طريق السرعة \\(\\omega\\) وكذلك تيار المجال \\(I_f\\) ولكن عند ثبات المجال المغناطيسي \\(\\Phi\\) يمكن التحكم في الجهد عن طريق السرعة فقط.»</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في مثال (٢-١) ص 34 يكتب جدول المعطيات <span class="ltr">I<sub>f2</sub> = 0.2 A</span>، بينما نص السؤال والحساب يستعملان <span class="ltr">0.15 A</span>، والناتج <span class="ltr">18 V</span> صحيح لـ <span class="ltr">0.15 A</span> (لو كانت 0.2 A لكان الناتج <span class="ltr">24 V</span>). الحاسبة تستعمل 0.15 A كما في السؤال والحل.'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> قانون المثال \\(E_a=K_E\\cdot N\\cdot I_f\\) يفترض أن الفيض \\(\\phi\\) يتناسب مع تيار المجال \\(I_f\\)، وأن السرعة N بالدورة في الدقيقة. لذلك تكفي النسبة بين حالتين ولا نحتاج قيمة \\(K_E\\). المختبر يستعمل أرقام هذا المثال نفسه: <span class="ltr">12 V</span> عند <span class="ltr">0.1 A</span> و <span class="ltr">1000 rpm</span>.'}
 ],
 lab:(el)=>{
  let n=1000,If=0.1,Ra=20,RLp=50,sw=1,lastS='';
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>دائرة الشكل (٢-١) حيّة <small>مبنية على الشكل (٢-١) ص 30 والمعادلات (٢-٢) إلى (٢-٥)</small></h2>
    <p class="sub">الخط البرتقالي = عليه جهد، والمتقطع المتحرك = يمر فيه تيار.</p>
    <div class="svgbox" id="l2c" style="max-width:620px;margin-inline:auto"></div>
    <div class="tk-row">${swHTML('l2sw','المفتاح','مغلق: الحمل R<sub>L</sub> موصول',1)}</div>
    <div class="facts">${fact('ω','l2w')}${fact('<bdi dir="ltr">K<sub>E</sub> = Kφ</bdi>','l2ke')}${fact('<bdi dir="ltr">E<sub>a</sub> = K<sub>E</sub>ω</bdi>','l2ea')}${fact('<bdi dir="ltr">I<sub>a</sub> R<sub>a</sub></bdi>','l2drop')}${fact('<bdi dir="ltr">V<sub>a</sub></bdi> على الأطراف','l2va')}${fact('الانخفاض عن <bdi dir="ltr">E<sub>a</sub></bdi>','l2pc')}</div></div>
   <div class="panel c5"><h2>المتغيرات</h2>
    ${sl('l2n','السرعة <span class="ltr">n</span>',0,3000,10,n)}
    ${sl('l2if','تيار المجال <span class="ltr">I<sub>f</sub></span>',0,0.2,0.005,If)}
    ${sl('l2ra','مقاومة المنتج <span class="ltr">R<sub>a</sub></span> (ملفات + تلامس الفرش)',0,100,1,Ra)}
    ${sl('l2rl','مقاومة الحمل <span class="ltr">R<sub>L</sub></span>',0,100,1,RLp)}
    <div class="svgbox tk-svg" id="l2m" style="max-width:260px"></div>
    <p class="sub">ثابت الآلة مأخوذ من مثال (٢-١): <span class="ltr">E<sub>a</sub> = 12 V</span> عند <span class="ltr">I<sub>f</sub> = 0.1 A</span> و <span class="ltr">1000 rpm</span>. قيم R<sub>a</sub> و R<sub>L</sub> توضيحية.</p></div>
   <div class="panel c12"><h2><span><bdi dir="ltr">V<sub>a</sub></bdi> مع <bdi dir="ltr">ω</bdi>: عند اللاحمل وتحت الحمل</span></h2><div class="tk-chart"><canvas id="l2p"></canvas></div>
    ${legend([['--blue','اللاحمل <span class="ltr">R<sub>L</sub> = ∞</span>: <span class="ltr">E<sub>a</sub> = K<sub>E</sub>ω</span> (٢-٢)'],['--live','تحت الحمل: <span class="ltr">V<sub>a</sub> = K<sub>E</sub>ω/(1+R<sub>a</sub>/R<sub>L</sub>)</span> (٢-٥)'],['--stop','الفرق بين الخطين عند السرعة الحالية']])}</div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  $('#l2n').oninput=e=>{n=+e.target.value};$('#l2if').oninput=e=>{If=+e.target.value};$('#l2ra').oninput=e=>{Ra=+e.target.value};$('#l2rl').oninput=e=>{RLp=+e.target.value};
  $('#l2sw').onclick=()=>{sw=sw?0:1;const b=$('#l2sw');b.setAttribute('aria-pressed',sw?'true':'false');b.querySelector('small').innerHTML=sw?'مغلق: الحمل R<sub>L</sub> موصول':'مفتوح: لا حمل (R<sub>L</sub> = ∞)'};
  /* أعطال مخفية: fopen دائرة المجال مفتوحة، kF حلقات مقصورة في ملف المجال (فيض أقل)، frev أطراف المجال معكوسة، brush تلامس رديء عند الفرش (مقاومة إضافية في دائرة المنتج) */
  const calc=()=>{const w=n*N2W,IfA=chF('fopen')?0:If,KE=K_EX*IfA*(chF('kF')?0.7:1)*(chF('frev')?-1:1),Ea=KE*w,RL=logR(RLp),RaA=chF('brush')?Ra+80:Ra;const Va=sw?Ea/(1+RaA/RL):Ea,Ia=sw?Va/RL:0;return {w,KE,Ea,RL,Va,Ia,IfA}};
  const steps=stepsUI($('#l2st'),[
   {t:'اللاحمل',x:'افتح المفتاح. لا يمر تيار في المنتج فيكون <span class="ltr">V<sub>a</sub> = E<sub>a</sub></span> تماماً، والنقطة على الخط الأزرق (٢-٢).',done:()=>!sw},
   {t:'وصّل حملاً صغير المقاومة',x:'أغلق المفتاح واجعل <span class="ltr">R<sub>L</sub></span> أقل من <span class="ltr">200 Ω</span>. يمر تيار ويهبط جهد على R<sub>a</sub>: الخط البرتقالي ينخفض تحت الأزرق.',done:()=>sw&&logR(RLp)<200},
   {t:'مقاومة حمل كبيرة',x:'ارفع <span class="ltr">R<sub>L</sub></span> فوق <span class="ltr">20 kΩ</span>: ينطبق الخطان تقريباً، لأن <span class="ltr">R<sub>a</sub>/R<sub>L</sub></span> صغيرة جداً.',done:()=>sw&&logR(RLp)>20000},
   {t:'مثال (٢-١) (أ)',x:'افتح المفتاح، واضبط <span class="ltr">1000 rpm</span> و <span class="ltr">I<sub>f</sub> = 0.15 A</span>: يصبح <span class="ltr">E<sub>a</sub> = 18 V</span> كما في الكتاب.',done:()=>Math.abs(n-1000)<5&&Math.abs(If-0.15)<0.001},
   {t:'مثال (٢-١) (ب)',x:'أعد <span class="ltr">I<sub>f</sub> = 0.1 A</span> وارفع السرعة إلى <span class="ltr">1400 rpm</span>: يصبح <span class="ltr">E<sub>a</sub> = 16.8 V</span>.',done:()=>Math.abs(n-1400)<5&&Math.abs(If-0.1)<0.001},
   {t:'أطفئ المجال',x:'اجعل <span class="ltr">I<sub>f</sub> = 0</span>: لا فيض ولا جهد مهما كانت السرعة. لاحظ أن الجهد يتحكم فيه ω و I<sub>f</sub> معاً.',done:()=>If===0}
  ],()=>({}));
  loopOn(el,()=>{const c=calc();
   $('#l2n-v').textContent=n+' rpm';$('#l2if-v').textContent=fm(If,3)+' A';$('#l2ra-v').textContent=Ra+' Ω';$('#l2rl-v').textContent=sw?fmtR(c.RL):'∞ (مفتوح)';
   const sg=[n,If,Ra,RLp,sw].join();if(sg!==lastS){lastS=sg;
    $('#l2c').innerHTML=dcCircuitSVG({live:1,If:c.IfA,sw:!!sw,Va:c.Va,Ia:c.Ia});$('#l2m').innerHTML=meterSVG(c.Va,80,'V',fm(c.Va,2)+' V');
    $('#l2w').textContent=fm(c.w,2)+' rad/s';$('#l2ke').textContent=fm(c.KE,4)+' V·s';$('#l2ea').textContent=fm(c.Ea,2)+' V';$('#l2drop').textContent=fm(c.Ia*Ra,2)+' V';$('#l2va').textContent=fm(c.Va,2)+' V';
    $('#l2pc').textContent=c.Ea>0?fm((1-c.Va/c.Ea)*100,1)+' %':'—';
    const ws=[0,330],kl=sw?c.KE/(1+Ra/c.RL):c.KE;
    plot($('#l2p'),{xmax:330,ymax:80,xlabel:'ω (rad/s)',ylabel:'Va (V)',series:[{pts:ws.map(x=>[x,c.KE*x]),color:'--blue'}].concat(sw?[{pts:ws.map(x=>[x,kl*x]),color:'--live'}]:[]),
     arrows:sw?[{x:c.w,y0:c.Ea,y1:c.Va,label:fm(c.Ea-c.Va,2)+' V'}]:[],points:[{x:c.w,y:c.Va,color:sw?'--live':'--blue'}]})}
   steps.check()});
 },
 examples:[
  {title:'مثال (٢-١)',ref:'ص 34',
   q:'<p>«مولد تاكو للتيار المستمر ذو التغذية المستقلة يعطي قوة دافعة كهربية للمنتج <span class="ltr">(E<sub>a</sub> = 12 V)</span> عندما يكون تيار المجال <span class="ltr">(I<sub>f</sub> = 0.1 A)</span> وتكون السرعة <span class="ltr">(1000 rpm)</span>. أوجد:<br>(ا) القوة الدافعة الكهربائية E<sub>a</sub> عندما يكون تيار المجال <span class="ltr">(0.15 A)</span> والسرعة <span class="ltr">(1000 rpm)</span>.<br>(ب) القوة الدافعة الكهربائية E<sub>a</sub> عندما يكون تيار المجال <span class="ltr">(0.1 A)</span> والسرعة <span class="ltr">(1400 rpm)</span>.»</p>',
   given:[{id:'Ea1',label:'القوة الدافعة الأولى',sym:'E_{a1}',unit:'V',value:12},{id:'If1',label:'تيار المجال الأول',sym:'I_{f1}',unit:'A',value:0.1},{id:'n1',label:'السرعة الأولى',sym:'N_1',unit:'rpm',value:1000},
    {id:'If2',label:'تيار المجال في (ا)',sym:'I_{f2}',unit:'A',value:0.15},{id:'n2',label:'السرعة في (ا)',sym:'N_2',unit:'rpm',value:1000},
    {id:'If3',label:'تيار المجال في (ب)',sym:'I_{f3}',unit:'A',value:0.1},{id:'n3',label:'السرعة في (ب)',sym:'N_3',unit:'rpm',value:1400}],
   solve:(g)=>{const E2=B.round(g.Ea1*(g.If2*g.n2)/(g.If1*g.n1),4),E3=B.round(g.Ea1*(g.If3*g.n3)/(g.If1*g.n1),4);return [
    {t:'العلاقة المستعملة في الحل:',f:'E_a = K_E\\cdot N\\cdot I_f'},
    {t:'بقسمة حالتين على بعضهما يختفي K<sub>E</sub>:',f:'\\frac{E_{a2}}{E_{a1}} = \\frac{I_{f2}\\cdot N_2}{I_{f1}\\cdot N_1}'},
    {t:'(ا) تيار المجال الجديد مع السرعة الجديدة:',f:`E_{a2} = E_{a1}\\,\\frac{I_{f2}\\cdot N_2}{I_{f1}\\cdot N_1} = ${g.Ea1}\\,\\frac{${g.If2}\\times ${g.n2}}{${g.If1}\\times ${g.n1}}`,v:E2,unit:'V',final:true},
    {t:'(ب) بنفس الطريقة:',f:`E_{a3} = E_{a1}\\,\\frac{I_{f3}\\cdot N_3}{I_{f1}\\cdot N_1} = ${g.Ea1}\\,\\frac{${g.If3}\\times ${g.n3}}{${g.If1}\\times ${g.n1}}`,v:E3,unit:'V',final:true}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> جدول المعطيات في ص 34 يكتب <span class="ltr">I<sub>f2</sub> = 0.2 A</span>، بينما السؤال والحساب يستعملان <span class="ltr">0.15 A</span> والناتج <span class="ltr">18 V</span> صحيح لها. لو أدخلت <span class="ltr">0.2</span> هنا ستحصل على <span class="ltr">24 V</span>.</span>'},
  {title:'مثال (٢-٢)',ref:'ص 34–35',
   q:'<p>«مولد تاكو للتيار المستمر ذو التغذية المستقلة <span class="ltr">(40 W, 20 V, R<sub>a</sub> = 0.025 Ω)</span> يعمل على الجهد المعتاد والحمل المعتاد. أوجد تيار المنتج وكذلك القوة الدافعة الكهربائية للمنتج E<sub>a</sub> في هذه الحالة. ثم أوجد القوة الدافعة الكهربائية للمنتج E<sub>a</sub> عندما يثبت جهد الأطراف عند <span class="ltr">20 V</span> ولكن خرج المولد يتغير إلى <span class="ltr">50 W</span>.»</p>',
   given:[{id:'P1',label:'القدرة الخارجة المعتادة',sym:'P_{out}',unit:'W',value:40},{id:'VT',label:'جهد الأطراف',sym:'V_T',unit:'V',value:20},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.025},{id:'P2',label:'القدرة في الحالة الثانية',sym:'P_{out2}',unit:'W',value:50}],
   solve:(g)=>{const I1=B.round(g.P1/g.VT,4),E1=B.round(g.VT+I1*g.Ra,4),I2=B.round(g.P2/g.VT,4),E2=B.round(g.VT+I2*g.Ra,4);return [
    {t:'القدرة الخارجة:',f:'P_{out} = V_T\\,I_L'},
    {t:'تيار الحمل = تيار المنتج (تغذية مستقلة):',f:`I_L = I_a = \\frac{${g.P1}}{${g.VT}}`,v:I1,unit:'A',final:true},
    {t:'القوة الدافعة للمنتج:',f:`E_a = V_T + I_a R_a = ${g.VT} + ${fm(I1)}\\times ${g.Ra}`,v:E1,unit:'V',final:true},
    {t:'<b>في الحالة الثانية</b>:',f:`I_L = I_a = \\frac{${g.P2}}{${g.VT}}`,v:I2,unit:'A'},
    {t:'',f:`E_a = V_T + I_a R_a = ${g.VT} + ${fm(I2)}\\times ${g.Ra}`,v:E2,unit:'V',final:true}]},
   note:'كل أرقام الحل في الكتاب صحيحة: <span class="ltr">2 A</span> و <span class="ltr">20.05 V</span>، ثم <span class="ltr">2.5 A</span> و <span class="ltr">20.0625 V</span>. لاحظ أن زيادة الحمل (التيار) تزيد الفرق بين E<sub>a</sub> و V<sub>T</sub> = I<sub>a</sub>R<sub>a</sub>.'}
 ],
 quiz:[
  {q:'أغلب أنواع مولدات التاكو للتيار المستمر انتشاراً هي ذات:',o:['التغذية المستقلة لملفات المجال أو المغناطيس الدائم','التغذية التوالية','التغذية المركبة','بلا مجال'],c:0,e:'ص 30.'},
  {q:'المعادلة E<sub>a</sub> = K<sub>E</sub>·ω (٢-٢) صحيحة عند:',o:['القصر R<sub>L</sub> = 0','اللاحمل R<sub>L</sub> = ∞','أي حمل','السكون فقط'],c:1,e:'ص 31: تمثل العلاقة عند اللاحمل (R_L = ∞) وهي علاقة خطية.'},
  {q:'حسب الكتاب، R<sub>a</sub> في المعادلة (٢-٣) تشمل:',o:['مقاومة الحمل فقط','مقاومة ملفات المنتج ومقاومة التلامس بين المبدل والفرش','مقاومة ملف المجال','مقاومة الفولتميتر'],c:1,e:'ص 31.'},
  {q:'ماذا يحدث للجهد V<sub>a</sub> عند تقليل مقاومة الحمل R<sub>L</sub> والسرعة ثابتة؟',o:['يزيد','يقل','لا يتغير','يصبح صفراً دائماً'],c:1,e:'من (٢-٥): القوس (1 + R<sub>a</sub>/R<sub>L</sub>) يكبر فيقل V<sub>a</sub>.'},
  {q:'متى يتحكم في الجهد عن طريق السرعة فقط؟',o:['عند ثبات المجال المغناطيسي','عند فتح المفتاح','عند زيادة R_a','دائماً'],c:0,e:'ص 31 و 34: عند ثبات Φ يمكن التحكم في الجهد عن طريق السرعة فقط.'},
  {q:'مولد تاكو يعطي 12 V عند 1000 rpm. بنفس تيار المجال وعند 1500 rpm يعطي:',o:['12 V','15 V','18 V','24 V'],c:2,e:'بطريقة مثال (٢-١): 12 × 1500 ÷ 1000 = 18 V.'},
  {q:'E<sub>a</sub> = 20 V و R<sub>a</sub> = 1 Ω و R<sub>L</sub> = 99 Ω. جهد الأطراف تقريباً:',o:['20 V','19.8 V','10 V','0.2 V'],c:1,e:'V_a = 20 ÷ (1 + 1/99) ≈ 19.8 V (المعادلة ٢-٥).'},
  {q:'في مثال (٢-٢)، تيار المنتج عند 40 W و 20 V:',o:['0.5 A','2 A','20 A','800 A'],c:1,e:'I = P ÷ V_T = 40 ÷ 20 = 2 A.'}
 ]
});

/* ============================== Lesson 2.3 ============================== */
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'32–35',
 title:'أسباب الخطأ في تاكو التيار المستمر: رد فعل المنتج وجهد الفرش والمنطقة الميتة',
 summary:'لماذا لا يكون منحنى التاكو الحقيقي خطاً مستقيماً: رد فعل المنتج يُضعف الفيض، وجهد التلامس عند الفرش ثابت فيصنع منطقة ميتة Δω؛ المعادلة (٢-٨)، وطريقتا التقليل من الخطأ، والمثال (٢-٣).',
 stations:[
  {intro:true},

  {st:1,short:'رد فعل المنتج',title:'السبب الأول: رد فعل المنتج',ref:'ص 32',
   q:'تيار المنتج نفسه يصنع مجالاً… فهل يبقى فيض المولد كما كان عند اللاحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قطبا المولد والمنتج بينهما، وتحتهما أعمدة: الفيض عند اللاحمل ناقص النقص بسبب رد فعل المنتج يساوي الفيض عند الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الفيض المغناطيسي للمولد بين القطبين. عند اللاحمل قيمته φ."><path d="M92 84 H268 M92 104 H268 M92 124 H268" stroke="#4FB3A9" stroke-width="2.5" stroke-dasharray="7 5"/></g><g data-tip="قطبا المجال: منهما الفيض المغناطيسي للمولد."><rect x="40" y="58" width="52" height="92" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="66" y="110" text-anchor="middle" font-size="20" fill="#FBF6EE" font-weight="700">N</text><rect x="268" y="58" width="52" height="92" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="110" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700">S</text></g><g data-tip="المنتج: عندما يوصل الحمل يمر فيه التيار ⟦Ia⟧، وهذا التيار يصنع مجالاً يؤثر في فيض المولد (رد فعل المنتج)."><circle cx="180" cy="104" r="42" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="180" y="110" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">a</tspan></text></g><g data-tip="الفيض عند اللاحمل φ."><rect x="80" y="184" width="200" height="22" rx="5" fill="#4FB3A9"/><text x="70" y="201" text-anchor="end" font-size="16" fill="#2C4A40" font-family="var(--mono)">φ</text></g><g data-tip="النقص في الفيض بسبب رد فعل المنتج ⟦Δφr = Kr·Ia⟧: يكبر كلما كبر تيار المنتج."><rect x="230" y="216" width="50" height="22" rx="5" fill="#E8735A"/><text x="70" y="233" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">Δφ<tspan font-size="10" dy="4">r</tspan></text><text x="222" y="233" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">K<tspan font-size="10" dy="4">r</tspan><tspan dy="-4">·I</tspan><tspan font-size="10" dy="4">a</tspan><tspan dy="-4"> =</tspan></text></g><g data-tip="الفيض عند الحمل ⟦φL = φ − Δφr⟧: أصغر من فيض اللاحمل، فتصغر القوة الدافعة ⟦EaL⟧."><rect x="80" y="248" width="150" height="22" rx="5" fill="#12855A"/><text x="70" y="265" text-anchor="end" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">φ<tspan font-size="10" dy="4">L</tspan></text></g><path d="M230 210 V278" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 3"/><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">رد فعل المنتج يُضعف الفيض</text></svg>`,
   cap:'الفيض عند الحمل = فيض اللاحمل ناقص ما يأخذه رد فعل المنتج، المعادلة (٢-٦) (الأطوال توضيحية).<br><b>مرّر المؤشر على الأقطاب والأعمدة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>أولًا: <b>رد فعل المنتج</b>، وهو يضعف من الفيض المغناطيسي للمولد.</p>
     <div class="eq">$$\phi_L = \phi - \Delta\phi_r$$<span class="eqno" style="direction:rtl">(٢-٦)</span></div><div class="eq">$$\text{where }\ \Delta\phi_r = K_r\cdot I_a$$<span></span></div>`,ref:'ص 32'}
   ],
   body:[
    {book:String.raw`<p>حيث \(\phi\) هو الفيض المغناطيسي عند اللاحمل، \(\Delta\phi_r\) هو النقص في الفيض المغناطيسي، بسبب رد فعل المنتج، ويعتمد على قيمة تيار المنتج، \(K_r\) هو ثابت التناسب بين \(I_a\) و \(\Delta\phi_r\)، أي أن القوة الدافعة الكهربائية المتولدة عند الحمل ليست ثابتة، بل تعتمد على قيمة الفيض المغناطيسي عند الحمل.</p>
     <div class="eq">$$E_{aL} = K\cdot\omega\cdot\phi_L$$<span class="eqno" style="direction:rtl">(٢-٧)</span></div>`,ref:'ص 32'},
    {title:'تابع السلسلة خطوة خطوة',widget:(el,B)=>{
      const S=['قلّت مقاومة الحمل <span class="ltr">R<sub>L</sub></span>','زاد تيار المنتج <span class="ltr">I<sub>a</sub></span>','زاد النقص في الفيض <span class="ltr">Δφ<sub>r</sub> = K<sub>r</sub>·I<sub>a</sub></span>','قلّ الفيض عند الحمل <span class="ltr">φ<sub>L</sub></span>','قلّت القوة الدافعة <span class="ltr">E<sub>aL</sub></span> (٢-٧)','ابتعد الجهد عن الخط المستقيم: خطأ في قراءة السرعة'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «قلّل مقاومة الحمل» وتابع كيف ينتقل الأثر من حلقة إلى التي بعدها.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>قلّل مقاومة الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {predict:{q:'تضاعف تيار المنتج \\(I_a\\) بسبب زيادة الحمل. ماذا يحدث للنقص في الفيض \\(\\Delta\\phi_r\\)؟',opts:[
     ['يتضاعف',true,'\\(\\Delta\\phi_r = K_r\\cdot I_a\\) و \\(K_r\\) ثابت تناسب، فضعف التيار يعطي ضعف النقص في الفيض.'],
     ['لا يتغير، لأنه يعتمد على تيار المجال فقط',false,'الكتاب يقول إن \\(\\Delta\\phi_r\\) «يعتمد على قيمة تيار المنتج»، لا تيار المجال.'],
     ['يصبح صفراً',false,'يصبح صفراً عندما لا يمر تيار في المنتج (اللاحمل)، والتيار هنا تضاعف.']]}},
    {tip:String.raw`<p>عند اللاحمل لا يمر تيار في المنتج، فلا يوجد رد فعل والفيض = \(\phi\). كلما زاد الحمل (قلّت \(R_L\)) زاد التيار فزاد ما «يأكله» رد فعل المنتج من الفيض. لذلك القوة الدافعة عند الحمل \(E_{aL}\) أصغر من \(K\omega\phi\)، والفرق يكبر مع التيار.</p>`,title:'الفكرة ببساطة'}
   ]},

  {st:2,short:'جهد الفرش',title:'السبب الثاني: جهد التلامس عند الفرش',ref:'ص 33',
   q:'لماذا يبقى الفولتميتر على الصفر رغم أن العمود بدأ يدور ببطء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="فرشة كربونية تلامس مبدلاً نحاسياً، وعند نقطة التلامس جهد ثابت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M180 30 V72" stroke="#2C4A40" stroke-width="3"/><g data-tip="الفرشة الكربونية: تنزلق على المبدل وتنقل التيار من المنتج إلى الأطراف."><rect x="154" y="70" width="52" height="72" rx="4" fill="#3D3D3D" stroke="#2C4A40" stroke-width="2"/></g><text x="146" y="110" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">فرشة كربونية</text><g data-tip="المبدل (موحد التيار): قطع من النحاس معزولة عن بعضها، تدور مع المنتج."><circle cx="180" cy="217" r="75" fill="#D98B4E" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#2C4A40" stroke-width="2"><line x1="180" y1="142" x2="180" y2="187"/><line x1="217.5" y1="152" x2="195" y2="191"/><line x1="245" y1="179.5" x2="206" y2="202"/><line x1="255" y1="217" x2="210" y2="217"/><line x1="245" y1="254.5" x2="206" y2="232"/><line x1="142.5" y1="152" x2="165" y2="191"/><line x1="115" y1="179.5" x2="154" y2="202"/><line x1="105" y1="217" x2="150" y2="217"/><line x1="115" y1="254.5" x2="154" y2="232"/></g><circle cx="180" cy="217" r="30" fill="#2C4A40"/></g><text x="180" y="312" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المبدل (نحاس)</text><g data-tip="جهد التلامس ⟦Vbrush⟧ بين النحاس والكربون: يظل ثابتاً تقريباً مهما تغير التيار، ويُطرح من الجهد المتولد."><rect x="208" y="122" width="100" height="40" fill="transparent"/><path d="M214 130 H222 V154 H214" fill="none" stroke="#E8735A" stroke-width="3"/><text x="228" y="148" font-size="15" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">brush</tspan></text></g></svg>`,
   cap:'التلامس بين مادتين مختلفتين (نحاس المبدل وكربون الفرشة) ينتج جهد تلامس ثابتاً تقريباً.<br><b>مرّر المؤشر على الفرشة والمبدل والرمز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>ثانيًا: مقاومة التلامس بين المبدل والفرش الكربونية ليست ثابتة بل تتغير بتغير تيار الحمل، فهي من نوع المقاومات غير الخطية التي تتغير قيمتها بتغير التيار المار بها، وذلك بسبب التلامس بين مادتين مختلفتين هما النحاس والكربون.</p>
     <p>في الواقع أن <b>جهد التلامس \(V_{brush}\)</b> هو الذي يظل ثابتًا وليس مقاومة التلامس، مما يستدعي تصحيح المعادلة (٢-٣) لتصبح كالآتي:</p>
     <div class="eq">$$V_a = E_a - I_a R_a - V_{brush}$$<span></span></div>
     <div class="eq">$$V_a = \frac{K_E\cdot\omega - V_{brush}}{\left(1+\dfrac{K\cdot K_r\cdot\omega + R_a}{R_L}\right)}$$<span class="eqno" style="direction:rtl">(٢-٨)</span></div>`,ref:'ص 33'}
   ],
   body:[
    {tip:String.raw`<p>نعوّض \(E_{aL}=K\omega(\phi-K_rI_a)=K_E\omega-K K_r\omega\,I_a\) من (٢-٦) و (٢-٧)، و \(I_a=V_a/R_L\) من (٢-٤)، في \(V_a=E_{aL}-I_aR_a-V_{brush}\)، ثم نجمع حدود \(V_a\) في طرف واحد فنصل إلى (٢-٨).</p>
     <p>في البسط: \(V_{brush}\) يُطرح من الجهد المتولد. وفي المقام: الحد \(K K_r\omega\) يكبر مع السرعة، فينحني المنحنى للأسفل عند السرعات العالية.</p>`,title:'من أين جاءت (٢-٨)؟'},
    {book:String.raw`<p>المعادلة (٢-٨) تبين أن العلاقة بين \(V_a\) و \(\omega\) ليست خطية إذا أخذنا في الاعتبار النقص في الفيض المغناطيسي الناشئ عن رد فعل المنتج وقيمة جهد التلامس \(V_{brush}\). وتوضح المعادلة أيضًا أن المنحنى بين \(V_a\) و \(\omega\) <b>لا يبدأ من نقطة الأصل</b>، لأن الجهد على الأطراف لا يبدأ بالظهور إلا بعد تخطي سرعة معينة، هذا بسبب أن الجهد المتولد يكون أقل من جهد التلامس، فعند ازدياد السرعة وبالتالي ازدياد الجهد المتولد عن جهد التلامس يبدأ بعدها الجهد بالظهور على أطراف المنتج. هذا يعني أن هناك <b>منطقة ميتة (Dead Zone = Δω)</b>، لا يظهر عندها أي جهد على أطراف مولد التاكو. الشكل (٢-٢) يوضح العلاقة بين الجهد المتولد وسرعة الدوران لتاكومترات التيار المستمر حسب المعادلة ٢-٨.</p>`,ref:'ص 33'},
    {title:'ارفع السرعة من الصفر وراقب الأطراف',widget:(el,B)=>{
      const VB=0.18;
      const bar=(lab,col,key)=>`<div style="margin-top:12px"><div class="sub" style="margin:0 0 4px">${lab}</div><div style="position:relative;height:22px;border-radius:8px;background:var(--surface-2);overflow:hidden" dir="ltr"><i data-b="${key}" style="display:block;height:100%;width:0;background:${col};transition:width .15s"></i>${key==='E'?`<i style="position:absolute;top:0;bottom:0;left:${VB*100}%;border-left:3px dashed var(--stop)"></i>`:''}</div></div>`;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">الخط الأحمر المتقطع = جهد التلامس <span class="ltr">V<sub>brush</sub></span> (ثابت). الأطوال توضيحية بلا أرقام.</p>
       <label class="w-sl"><span>سرعة الدوران <span class="ltr">ω</span>: <b data-o="s"></b></span><input type="range" min="0" max="100" step="1" value="0" dir="ltr" aria-label="سرعة الدوران"></label>
       ${bar('الجهد المتولد داخل المنتج','#4FB3A9','E')}${bar('الجهد على أطراف المنتج <span class="ltr">V<sub>a</sub></span>','#12855A','V')}
       <p data-o="m" style="margin:12px 0 0;font-weight:600"></p>`;
      const rg=el.querySelector('input'),o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const x=+rg.value/100,v=Math.max(0,x-VB);
        el.querySelector('[data-b="E"]').style.width=x*100+'%';el.querySelector('[data-b="V"]').style.width=v*100+'%';
        o('s').textContent=x===0?'متوقف':x<0.1?'بطيئة جداً':x<0.4?'بطيئة':x<0.75?'متوسطة':'عالية';
        o('m').innerHTML=x===0?'العمود متوقف: لا جهد.':x<=VB?'<span style="color:var(--stop)">المنطقة الميتة: العمود يدور لكن الجهد المتولد أقل من جهد التلامس، فلا يظهر جهد على الأطراف.</span>':'<span style="color:var(--on)">تخطّى الجهد المتولد جهد التلامس، فبدأ الجهد يظهر على الأطراف.</span>'};
      rg.oninput=draw;draw();
    }},
    {predict:{q:'مولد تاكو تيار مستمر يدور ببطء شديد، والفولتميتر على أطرافه يقرأ صفراً. ما السبب حسب الكتاب؟',opts:[
     ['الجهد المتولد عند هذه السرعة أقل من جهد التلامس عند الفرش',true,'هذه هي المنطقة الميتة \\(\\Delta\\omega\\): لا يظهر جهد على الأطراف حتى يتخطى الجهد المتولد جهد التلامس.'],
     ['رد فعل المنتج ألغى الفيض تماماً',false,'رد فعل المنتج يُضعف الفيض ويعتمد على التيار، وعند هذه السرعة البطيئة لا يمر تيار يُذكر أصلاً.'],
     ['ملف المجال مفصول',false,'لو كان المجال مفصولاً لما ظهر جهد عند أي سرعة؛ أما هنا فالجهد يظهر عندما تزيد السرعة.']]}},
    {tip:String.raw`<p>البسط في (٢-٨) يصبح صفراً عندما \(K_E\,\omega = V_{brush}\)، فحافة المنطقة الميتة عند \(\Delta\omega = V_{brush}/K_E\) (استنتاج من المعادلة، لا يكتبه الكتاب). كلما كبر جهد التلامس اتسعت المنطقة الميتة.</p>`,title:'أين تنتهي المنطقة الميتة؟'}
   ]},

  {st:3,short:'تقليل الخطأ',title:'٢-٢-١ كيفية التقليل من الخطأ في قراءة تاكومترات التيار المستمر',ref:'ص 33',
   q:'عرفنا سببي الخطأ… فما الذي نغيّره في التصميم لنقلّل كل سبب منهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="طريقتا الكتاب لتقليل الخطأ: جهاز قياس بمقاومة كبيرة، وفرش معدنية من الفضة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="190" y="56" width="140" height="210" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="30" y="56" width="140" height="210" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="260" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">أولاً</text><text x="100" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">ثانياً</text><g data-tip="جهاز قياس الجهد: مقاومته الداخلية هي مقاومة الحمل ⟦RL⟧. كلما كبرت قلّ تيار المنتج ⟦Ia⟧ فقلّ رد فعل المنتج."><circle cx="260" cy="134" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M236 140 A24 24 0 0 1 284 140" fill="none" stroke="#2C4A40" stroke-width="2"/><line x1="260" y1="144" x2="274" y2="120" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><circle cx="260" cy="144" r="4" fill="#2C4A40"/><text x="260" y="160" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">V</text><text x="260" y="206" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="12" dy="5">L</tspan><tspan dy="-5"> ↑</tspan></text></g><text x="260" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600">مقاومة كبيرة</text><text x="260" y="254" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600">لجهاز القياس</text><g data-tip="فرشة معدنية من الفضة بدل الكربون: جهد التلامس ⟦Vbrush⟧ أقل، فتصغر المنطقة الميتة ⟦Δω⟧."><path d="M40 210 A80 80 0 0 1 160 210" fill="#D98B4E" stroke="#2C4A40" stroke-width="2.5"/><rect x="78" y="118" width="44" height="58" rx="4" fill="#C9CED6" stroke="#2C4A40" stroke-width="2.5"/><path d="M100 98 V118" stroke="#2C4A40" stroke-width="3"/></g><text x="100" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600">فرش معدنية</text><text x="100" y="254" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600">من الفضة</text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لكل سبب علاج</text></svg>`,
   cap:'العلاج الأول للسبب الأول (رد فعل المنتج)، والثاني للسبب الثاني (جهد التلامس).<br><b>مرّر المؤشر على الجهاز والفرشة (أو المسهما في الجوال) لتعرف كيف يقلل كل منهما الخطأ.</b>',
   side:[
    {book:String.raw`<ul><li><b>أولًا:</b> تستعمل <b>مقاومة مادية كبيرة</b> بقدر الإمكان لجهاز قياس الجهد المستعمل للقراءة للتقليل من تيار ورد فعل المنتج.</li>
     <li><b>ثانيًا:</b> تستخدم <b>فرش معدنية مصنوعة من الفضة</b> للتقليل من جهد التلامس وبالتالي تقل المنطقة الميتة.</li></ul>`,ref:'ص 33'},
    {predict:{q:'أي الطريقتين تصغّر المنطقة الميتة \\(\\Delta\\omega\\)؟',opts:[
     ['جهاز قياس بمقاومة كبيرة',false,'هذه تقلل تيار المنتج ورد فعله، فيقل انحناء المنحنى؛ لكن المنطقة الميتة سببها جهد التلامس.'],
     ['فرش معدنية من الفضة',true,'الفضة تقلل جهد التلامس \\(V_{brush}\\)، فيتخطاه الجهد المتولد عند سرعة أصغر، فتصغر المنطقة الميتة.'],
     ['تقليل مقاومة جهاز القياس',false,'هذا يزيد تيار المنتج ورد فعله، فيزيد الخطأ بدل أن يقلله.']]}}
   ],
   body:[
    {title:'كل علاج وماذا يقطع من السلسلة',widget:(el,B)=>{
      const C={a:['مقاومة جهاز القياس كبيرة','تيار المنتج <span class="ltr">I<sub>a</sub></span> صغير','رد فعل المنتج <span class="ltr">Δφ<sub>r</sub> = K<sub>r</sub>·I<sub>a</sub></span> صغير','الفيض <span class="ltr">φ<sub>L</sub></span> قريب من <span class="ltr">φ</span>','المنحنى قريب من الخط المستقيم'],
               b:['فرش معدنية من الفضة','جهد التلامس <span class="ltr">V<sub>brush</sub></span> أقل','الجهد يظهر على الأطراف عند سرعة أصغر','المنطقة الميتة <span class="ltr">Δω</span> أصغر']};
      el.innerHTML=`<div class="w-row" style="margin-top:0"><button class="btn pri" type="button" data-k="a">أولاً: مقاومة كبيرة</button><button class="btn pri" type="button" data-k="b">ثانياً: فرش الفضة</button></div><div class="chain" data-ch style="margin-top:12px"></div>`;
      const ch=el.querySelector('[data-ch]');let tm=[];
      el.querySelectorAll('[data-k]').forEach(bt=>bt.onclick=()=>{tm.forEach(clearTimeout);tm=[];const S=C[bt.dataset.k];
        ch.innerHTML=S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('');
        [...ch.querySelectorAll('.ck')].forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))});
    }},
    {add:String.raw`<p>لهذا السبب تجد في مواصفات بعض مولدات التاكو الصناعية فرشاً من الفضة أو من سبائكها بدل الكربون العادي، وتجد أن جهاز القراءة الموصول بها (أو دائرة التحكم) له مقاومة دخل كبيرة جداً.</p>`,title:'من الواقع'},
    {watch:String.raw`<p>لا تخلط بين العلاجين: المقاومة الكبيرة لجهاز القياس تعالج <b>رد فعل المنتج</b> (التيار)، والفضة تعالج <b>جهد التلامس</b> (المنطقة الميتة).</p>`}
   ]},

  {st:4,short:'مثال (٢-٣)',title:'مثال الكتاب (٢-٣)',ref:'ص 35',
   q:'جهد الأطراف مجهول، والتيار أيضاً يعتمد عليه… كيف نحل معادلة فيها المجهول في الطرفين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة حل مثال ٢-٣: المعادلة من الدرجة الثانية ومعاملاتها والنتيجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="36" y="44" width="288" height="236" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="72" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">مثال (٢-٣)</text><text x="180" y="100" text-anchor="middle" font-size="13.5" fill="#2C4A40" direction="ltr" font-family="var(--mono)">50 W ,  R<tspan font-size="9" dy="4">a</tspan><tspan dy="-4"> = 0.03 Ω ,  E</tspan><tspan font-size="9" dy="4">a</tspan><tspan dy="-4"> = 25 V</tspan></text><line x1="56" y1="114" x2="304" y2="114" stroke="#2C4A40" stroke-width="1" opacity=".35"/><g data-tip="بعد تعويض ⟦Ia = 50/VT⟧ في ⟦VT = Ea − Ia·Ra⟧ والضرب في ⟦VT⟧ نحصل على معادلة من الدرجة الثانية في ⟦VT⟧."><rect x="56" y="124" width="248" height="34" rx="8" fill="#E6E2F8"/><text x="180" y="147" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">T</tspan><tspan font-size="10" dy="-10">2</tspan><tspan dy="6"> − 25 V</tspan><tspan font-size="10" dy="4">T</tspan><tspan dy="-4"> + 1.5 = 0</tspan></text></g><g data-tip="معاملات المعادلة للقانون العام. الحد الثابت ⟦c = 50 × 0.03 = 1.5⟧ أي القدرة × مقاومة المنتج."><text x="180" y="184" text-anchor="middle" font-size="14" fill="#2C4A40" direction="ltr" font-family="var(--mono)">a = 1    b = −25    c = 1.5</text><rect x="70" y="168" width="220" height="24" fill="transparent"/></g><g data-tip="جهد الأطراف كما طبعه الكتاب (الجذر الكبير للمعادلة). بالتقريب الصحيح ⟦24.94 V⟧."><rect x="84" y="200" width="192" height="32" rx="8" fill="#12855A"/><text x="180" y="222" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">T</tspan><tspan dy="-4"> = 24.93 V</tspan></text></g><g data-tip="تيار الحمل = تيار المنتج ⟦= 50/24.93⟧، قرّبه الكتاب إلى ⟦2 A⟧ (الدقيق ⟦2.006 A⟧)."><rect x="84" y="238" width="192" height="32" rx="8" fill="#12855A"/><text x="180" y="260" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">L</tspan><tspan dy="-4"> = I</tspan><tspan font-size="10" dy="4">a</tspan><tspan dy="-4"> = 2 A</tspan></text></g></svg>`,
   cap:'خطوات حل مثال (٢-٣) باختصار.<br><b>مرّر المؤشر على المعادلة والمعاملات والنتيجتين (أو المسها في الجوال) لتعرف من أين جاءت.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٢-٣) <span class="ref">ص 35</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(P_{out}=50\,\text{W}\)</span><span class="kv ltr">\(R_a=0.03\,\Omega\)</span><span class="kv ltr">\(E_a=25\,\text{V}\)</span></div>
      <div class="kv-row"><small>المطلوب</small><span class="kv">جهد الأطراف \(V_T\)</span><span class="kv">تيار المنتج \(I_a\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(V_T=24.93\,\text{V}\)</span><span class="kv res ltr">\(I_L=I_a=2\,\text{A}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة وغيّر الأرقام</button></div></div>`},
    {predict:{q:String.raw`المعادلة \(V_T^2-25\,V_T+1.5=0\) لها جذران: <span class="ltr">24.94</span> تقريباً و <span class="ltr">0.06</span> تقريباً. أيهما جهد الأطراف؟`,opts:[
     [String.raw`<span class="ltr">0.06 V</span>`,false,'هذا الجذر يعني تياراً هائلاً (50 ÷ 0.06) وهبوطاً داخل المنتج يساوي تقريباً كل القوة الدافعة؛ لا يحدث في التشغيل المعتاد.'],
     [String.raw`<span class="ltr">24.94 V</span> تقريباً (الكتاب: <span class="ltr">24.93 V</span>)`,true,'الجذر الكبير قريب من \\(E_a = 25\\ \\text{V}\\) كما نتوقع، لأن الهبوط \\(I_aR_a\\) صغير. الكتاب أخذه دون أن يذكر السبب.'],
     ['كلاهما صحيح بالقدر نفسه',false,'رياضياً كلاهما حل، لكن واحداً فقط يناسب مولداً يعمل بحمله المعتاد.']]}}
   ],
   body:[
    {tip:String.raw`<p>المجهول \(V_T\) في طرفي المعادلة: في \(V_T = E_a - I_aR_a\) والتيار نفسه \(I_a = P/V_T\). عندما نعوّض ونضرب الطرفين في \(V_T\) تظهر \(V_T^2\)، فنستعمل القانون العام \(V_T=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}\).</p>`,title:'لماذا معادلة من الدرجة الثانية؟'},
    {watch:String.raw`<p>كتب الكتاب <span class="ltr">V<sub>T</sub> = 24.93 V</span>، والقيمة الدقيقة <span class="ltr">24.9399 V</span> أي <b><span class="ltr">24.94 V</span></b> بالتقريب الصحيح (الكتاب بتر الرقم). وكتب <span class="ltr">I = 50 ÷ 24.93 = 2 A</span> والدقيق <span class="ltr">2.006 A</span>. والمعادلة لها جذر ثانٍ <span class="ltr">≈ 0.06 V</span> أهمله الكتاب دون ذكر السبب.</p>`,fix:true},
    {title:'مختبر مصغّر: غيّر القدرة وحلّ المعادلة',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">E<sub>a</sub> = 25 V</span> و<span class="ltr">R<sub>a</sub> = 0.03 Ω</span> من المثال. القيمة <span class="ltr">50 W</span> من الكتاب، وغيرها أرقام تختارها أنت. شاهد جذري المعادلة <span class="ltr">V<sub>T</sub>² − E<sub>a</sub>V<sub>T</sub> + R<sub>a</sub>P = 0</span> (في المثال: <span class="ltr">V<sub>T</sub>² − 25 V<sub>T</sub> + 1.5 = 0</span>).',
 predict:{q:'إذا ضاعفنا القدرة من <span class="ltr">50 W</span> إلى <span class="ltr">100 W</span>، كم يتغير جهد الأطراف تقريباً؟',opts:[
  ['ينقص إلى النصف تقريباً',false,'الهبوط <span class="ltr">I<sub>a</sub>R<sub>a</sub></span> صغير جداً لأن <span class="ltr">R<sub>a</sub></span> صغيرة؛ الجهد لا ينهار.'],
  ['ينقص أجزاء قليلة من الفولت',true,'التيار يتضاعف تقريباً إلى <span class="ltr">4 A</span>، والهبوط <span class="ltr">4 × 0.03 = 0.12 V</span> فقط.'],
  ['يزيد قليلاً',false,'زيادة التيار تزيد الهبوط داخل المولد، فينقص جهد الأطراف.']]},
 ins:[{k:'p',l:'قدرة الحمل P',min:0,max:200,step:5,v:50,dp:0,u:'W'}],
 calc:(s,P,B)=>{const E=25,R=0.03;
  /* المعادلة بعد الضرب في V_T: V_T² − 25 V_T + 0.03·P = 0 (المعامل a = 1 كما في الكتاب) */
  const c=R*s.p,dd=E*E-4*c,V=(E+Math.sqrt(dd))/2,v2=(E-Math.sqrt(dd))/2,I=V>0?s.p/V:0;
  return {facts:[['V<sub>T</sub> (الجذر المقبول)',DCML.fm(B,V,2)+' V','hi'],['<span class="ltr">I<sub>a</sub> = P ÷ V<sub>T</sub></span>',DCML.fm(B,I,3)+' A'],['الهبوط I<sub>a</sub>R<sub>a</sub>',DCML.fm(B,I*R,3)+' V'],['الجذر الثاني',DCML.fm(B,v2,3)+' V','bad']],
   plot:{xr:[0,200],yr:[24.5,25.05],xt:[0,50,100,150,200],yt:[24.6,24.8,25],xl:'P (W)',yl:'V<tspan font-size="9" dy="3">T</tspan><tspan dy="-3"> (V)</tspan>',curves:[{f:x=>(E+Math.sqrt(E*E-4*R*x))/2}],cur:[s.p,V],fy:v=>v.toFixed(1)},
   msg:`الجذر الثاني <span class="ltr">${DCML.fm(B,v2,3)} V</span> يعني تياراً <span class="ltr">${v2>0?DCML.fm(B,s.p/v2,0):'—'} A</span> تقريباً، وهذا غير منطقي لمولد تاكو صغير؛ لذلك نأخذ الجذر القريب من <span class="ltr">E<sub>a</sub></span>.`}}})}
   ]},

  {recap:[
   String.raw`السبب الأول للخطأ رد فعل المنتج، المعادلة (٢-٦): \(\phi_L = \phi - K_r I_a\)، فتصبح القوة الدافعة عند الحمل، المعادلة (٢-٧): \(E_{aL} = K\omega\phi_L\).`,
   String.raw`السبب الثاني جهد التلامس \(V_{brush}\) بين المبدل النحاسي والفرش الكربونية، وهو الثابت لا مقاومة التلامس.`,
   String.raw`المعادلة (٢-٨): \(V_a = \dfrac{K_E\omega - V_{brush}}{1+\frac{K K_r\omega + R_a}{R_L}}\): غير خطية، ولا تبدأ من الأصل؛ فتوجد منطقة ميتة \(\Delta\omega\).`,
   String.raw`للتقليل من الخطأ: جهاز قياس بمقاومة كبيرة (يقلل تيار ورد فعل المنتج)، وفرش معدنية من الفضة (تقلل جهد التلامس والمنطقة الميتة).`]}
],
 theory:[
  {h:'السبب الأول: رد فعل المنتج',ref:'ص 32',html:`<p>«أولًا: <b>رد فعل المنتج</b>، وهو يضعف من الفيض المغناطيسي للمولد.»</p>
   $$\\phi_L = \\phi - \\Delta\\phi_r \\qquad (٢-٦)$$ $$\\text{where }\\ \\Delta\\phi_r = K_r\\cdot I_a$$
   <p>«حيث \\(\\phi\\) هو الفيض المغناطيسي عند اللاحمل، \\(\\Delta\\phi_r\\) هو النقص في الفيض المغناطيسي، بسبب رد فعل المنتج، ويعتمد على قيمة تيار المنتج، \\(K_r\\) هو ثابت التناسب بين \\(I_a\\) و \\(\\Delta\\phi_r\\)، أي أن القوة الدافعة الكهربائية المتولدة عند الحمل ليست ثابتة، بل تعتمد على قيمة الفيض المغناطيسي عند الحمل.»</p>
   $$E_{aL} = K\\cdot\\omega\\cdot\\phi_L \\qquad (٢-٧)$$`},
  {h:'السبب الثاني: جهد التلامس عند الفرش',ref:'ص 33',html:`<p>«مقاومة التلامس بين المبدل والفرش الكربونية ليست ثابتة بل تتغير بتغير تيار الحمل، فهي من نوع المقاومات غير الخطية التي تتغير قيمتها بتغير التيار المار بها، وذلك بسبب التلامس بين مادتين مختلفتين هما النحاس والكربون.»</p>
   <p>«في الواقع أن <b>جهد التلامس \\(V_{brush}\\)</b> هو الذي يظل ثابتًا وليس مقاومة التلامس، مما يستدعي تصحيح المعادلة (٢-٣) لتصبح كالآتي:»</p>
   $$V_a = E_a - I_a R_a - V_{brush}$$
   $$V_a = \\frac{K_E\\cdot\\omega - V_{brush}}{\\left(1+\\dfrac{K\\cdot K_r\\cdot\\omega + R_a}{R_L}\\right)} \\qquad (٢-٨)$$`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — من أين جاءت (٢-٨)؟</b> نعوّض \\(E_{aL}=K\\omega(\\phi-K_rI_a)=K_E\\omega-K K_r\\omega\\,I_a\\) و \\(I_a=V_a/R_L\\) في \\(V_a=E_{aL}-I_aR_a-V_{brush}\\) ثم نجمع حدود \\(V_a\\) في طرف واحد. الحد \\(K K_r\\omega\\) في المقام يكبر مع السرعة، لذلك ينحني المنحنى للأسفل عند السرعات العالية.`},
  {html:`<p>«المعادلة (٢-٨) تبين أن العلاقة بين \\(V_a\\) و \\(\\omega\\) ليست خطية إذا أخذنا في الاعتبار النقص في الفيض المغناطيسي الناشئ عن رد فعل المنتج وقيمة جهد التلامس \\(V_{brush}\\). وتوضح المعادلة أيضًا أن المنحنى بين \\(V_a\\) و \\(\\omega\\) <b>لا يبدأ من نقطة الأصل</b>، لأن الجهد على الأطراف لا يبدأ بالظهور إلا بعد تخطي سرعة معينة، هذا بسبب أن الجهد المتولد يكون أقل من جهد التلامس، فعند ازدياد السرعة وبالتالي ازدياد الجهد المتولد عن جهد التلامس يبدأ بعدها الجهد بالظهور على أطراف المنتج. هذا يعني أن هناك <b>منطقة ميتة (Dead Zone = Δω)</b>، لا يظهر عندها أي جهد على أطراف مولد التاكو. الشكل (٢-٢) يوضح العلاقة بين الجهد المتولد وسرعة الدوران لتاكومترات التيار المستمر حسب المعادلة ٢-٨.»</p>`},
  {fig:'(٢-٢)',ref:'ص 31',caption:'الخاصية المثالية (\\(R_L=\\infty\\)) والخاصية الفعلية (\\(R_L\\) صغيرة) مع المنطقة الميتة Δω والخطأ ΔV',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${fig22SVG()}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> بسط (٢-٨) يصبح صفراً عندما \\(K_E\\,\\omega = V_{brush}\\)، فحافة المنطقة الميتة عند $$\\Delta\\omega = \\frac{V_{brush}}{K_E}$$ مثال: <span class="ltr">K<sub>E</sub> = 0.1 V/(rad/s)</span> و <span class="ltr">V<sub>brush</sub> = 1 V</span> ⇒ <span class="ltr">Δω = 10 rad/s ≈ 95 rpm</span>: تحت هذه السرعة يقرأ الفولتميتر صفراً.'},
  {h:'٢-٢-١ كيفية التقليل من الخطأ في قراءة تاكومترات التيار المستمر',ref:'ص 33',html:`<ul><li><b>أولًا:</b> تستعمل <b>مقاومة مادية كبيرة</b> بقدر الإمكان لجهاز قياس الجهد المستعمل للقراءة للتقليل من تيار ورد فعل المنتج.</li>
   <li><b>ثانيًا:</b> تستخدم <b>فرش معدنية مصنوعة من الفضة</b> للتقليل من جهد التلامس وبالتالي تقل المنطقة الميتة.</li></ul>
   <p>جرّب الطريقتين بزرين في تبويب «المختبر».</p>`},
  {h:'مثال الكتاب (٢-٣)',ref:'ص 35',html:'<p>في المثال يكون جهد الأطراف مجهولاً في طرفي المعادلة، فنصل إلى <b>معادلة من الدرجة الثانية</b>. الحل كاملاً في تبويب «الأمثلة المحلولة».</p>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في مثال (٢-٣) ص 35 كتب الكتاب <span class="ltr">V<sub>T</sub> = 24.93 V</span>، والقيمة الدقيقة <span class="ltr">24.9399 V</span> أي <b><span class="ltr">24.94 V</span></b> بالتقريب الصحيح (الكتاب بتر الرقم). وكتب <span class="ltr">I = 50 ÷ 24.93 = 2 A</span> والدقيق <span class="ltr">2.006 A</span>. الحاسبة تعرض أرقام الكتاب ومعها القيم الدقيقة. والمعادلة لها جذر ثانٍ <span class="ltr">≈ 0.06 V</span> أهمله الكتاب دون ذكر السبب.'+'</div>'}
 ],
 lab:(el)=>{
  const KE=K_EX*0.1;  // 0.1146 V/(rad/s) — مثال (٢-١)
  const D={n:2000,Vb:2,kk:0.3,RLp:56,Ra:20};let {n,Vb,kk,RLp,Ra}=D,lastS='',usedRL=0,usedAg=0;
  el.innerHTML=`<div id="l3tp"></div><div class="grid">
   <div class="panel c12"><h2>الشكل (٢-٢) تفاعلياً حسب المعادلة (٢-٨) <small>مبنية على الشكل (٢-٢) ص 31 والمعادلة (٢-٨) ص 33</small></h2>
    <div class="tk-chart"><canvas id="l3p"></canvas></div>
    ${legend([['--blue','الخاصية المثالية (<span class="ltr">R<sub>L</sub> = ∞</span> وبلا جهد فرش)'],['--live','الخاصية الفعلية حسب (٢-٨)'],['--stop','المنطقة الميتة Δω والخطأ ΔV']])}</div>
   <div class="panel c5"><h2>المتغيرات</h2>
    ${sl('l3n','السرعة <span class="ltr">n</span>',0,3000,10,n)}
    ${sl('l3vb','جهد التلامس عند الفرش <span class="ltr">V<sub>brush</sub></span>',0,5,0.1,Vb)}
    ${sl('l3kk','رد فعل المنتج <span class="ltr">K·K<sub>r</sub></span>',0,0.8,0.02,kk)}
    ${sl('l3rl','مقاومة جهاز القياس <span class="ltr">R<sub>L</sub></span>',0,100,1,RLp)}
    ${sl('l3ra','مقاومة المنتج <span class="ltr">R<sub>a</sub></span>',0,100,1,Ra)}
    <div class="tk-row"><button class="btn primary" id="l3big">الطريقة الأولى: جهاز قياس بمقاومة كبيرة</button><button class="btn primary" id="l3ag">الطريقة الثانية: فرش من الفضة</button><button class="btn" id="l3c">فرش كربونية</button><button class="btn" id="l3r">القيم الابتدائية</button></div>
    <p class="sub"><span class="ltr">K<sub>E</sub></span> من مثال (٢-١): <span class="ltr">0.1146 V/(rad/s)</span>. باقي القيم <b id="l3tpw">أرقام توضيحية</b> (الكتاب لا يعطي قيماً لـ V<sub>brush</sub> و K<sub>r</sub>): جهد التلامس للفرش الكربونية <span class="ltr" id="l3vcT"></span> وللفرش الفضية <span class="ltr" id="l3vaT"></span>.</p></div>
   <div class="panel c7"><h2>عند السرعة المختارة</h2>
    <div class="facts">${fact('Δω (حافة المنطقة الميتة)','l3dz')}${fact('الجهد المثالي <bdi dir="ltr">K<sub>E</sub>ω</bdi>','l3vi')}${fact('الجهد الفعلي <bdi dir="ltr">V<sub>a</sub></bdi>','l3va')}${fact('ΔV','l3dv')}${fact('تيار المنتج <bdi dir="ltr">I<sub>a</sub></bdi>','l3ia')}${fact('السرعة التي «يقرؤها» التاكو','l3nr')}</div>
    <h3 class="sm" style="margin-top:14px">أين يذهب الجهد المتولد؟</h3><div class="svgbox" id="l3bar"></div><div id="l3msg" class="tk-msg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l3tp'),'u2-l3',[
   {k:'Vc',label:'جهد التلامس للفرش الكربونية (زر «فرش كربونية» والقيم الابتدائية)',unit:'V',value:2,min:0,max:5,step:0.1},
   {k:'Vag',label:'جهد التلامس للفرش الفضية (زر «فرش من الفضة»)',unit:'V',value:0.2,min:0,max:5,step:0.05}],()=>{tpw();lastS=''});
  const tpw=()=>{$('#l3tpw').textContent=TP.trainer?'من قيم المدرب':'أرقام توضيحية';$('#l3vcT').textContent=fm(TP.v.Vc,2)+' V';$('#l3vaT').textContent=fm(TP.v.Vag,2)+' V'};tpw();
  Vb=TP.v.Vc;
  const sync=()=>{$('#l3n').value=n;$('#l3vb').value=Vb;$('#l3kk').value=kk;$('#l3rl').value=RLp;$('#l3ra').value=Ra};
  sync();
  $('#l3n').oninput=e=>{n=+e.target.value};$('#l3vb').oninput=e=>{Vb=+e.target.value};$('#l3kk').oninput=e=>{kk=+e.target.value};$('#l3rl').oninput=e=>{RLp=+e.target.value};$('#l3ra').oninput=e=>{Ra=+e.target.value};
  $('#l3big').onclick=()=>{RLp=100;usedRL=1;sync()};$('#l3ag').onclick=()=>{Vb=TP.v.Vag;usedAg=1;sync()};$('#l3c').onclick=()=>{Vb=TP.v.Vc;sync()};$('#l3r').onclick=()=>{({n,Vb,kk,RLp,Ra}=D);Vb=TP.v.Vc;sync()};
  const Va=(w,RL)=>Math.max(0,(KE*w-Vb)/(1+(kk*w+Ra)/RL));
  const steps=stepsUI($('#l3st'),[
   {t:'المنطقة الميتة',x:'اخفض السرعة حتى تدخل المنطقة الحمراء (تحت Δω): الفولتميتر يقرأ صفراً رغم أن العمود يدور، لأن <span class="ltr">E<sub>a</sub></span> أقل من جهد التلامس.',done:()=>Vb>0&&n*N2W<Vb/KE&&n>0},
   {t:'جهد الفرش يكبّر المنطقة الميتة',x:'ارفع <span class="ltr">V<sub>brush</sub></span> إلى <span class="ltr">4 V</span> أو أكثر: تتسع المنطقة الميتة (Δω = V<sub>brush</sub>/K<sub>E</sub>).',done:()=>Vb>=4},
   {t:'رد فعل المنتج يحني المنحنى',x:'ارفع <span class="ltr">K·K<sub>r</sub></span> إلى <span class="ltr">0.6</span> أو أكثر واترك R<sub>L</sub> صغيرة: المنحنى البرتقالي ينحني للأسفل عند السرعات العالية ويكبر ΔV.',done:()=>kk>=0.6},
   {t:'الطريقة الأولى',x:'اضغط «جهاز قياس بمقاومة كبيرة»: يقل تيار المنتج جداً فيختفي أثر رد فعل المنتج وهبوط R<sub>a</sub>، ويستقيم المنحنى (لكن المنطقة الميتة تبقى).',done:()=>usedRL},
   {t:'الطريقة الثانية',x:'اضغط «فرش من الفضة»: يقل جهد التلامس فتصغر المنطقة الميتة كثيراً.',done:()=>usedAg&&Vb<=Math.max(0.3,TP.v.Vag)},
   {t:'قارن مع فرش الكربون',x:'اضغط «فرش كربونية» ثم «فرش من الفضة» مرة أخرى وراقب حافة المنطقة الميتة Δω في البطاقات.'}
  ],()=>({}));
  loopOn(el,()=>{const RL=logR(RLp),w=n*N2W,va=Va(w,RL),vi=KE*w,Ia=va/RL,dz=Vb/KE;
   $('#l3n-v').textContent=n+' rpm';$('#l3vb-v').textContent=fm(Vb,1)+' V';$('#l3kk-v').textContent=fm(kk,2)+' Ω·s';$('#l3rl-v').textContent=fmtR(RL);$('#l3ra-v').textContent=Ra+' Ω';
   const sg=[n,Vb,kk,RLp,Ra].join();if(sg===lastS){steps.check();return}lastS=sg;
   $('#l3dz').textContent=fm(dz,1)+' rad/s ('+fm(dz*W2N,0)+' rpm)';$('#l3vi').textContent=fm(vi,2)+' V';$('#l3va').textContent=fm(va,2)+' V';$('#l3dv').textContent=fm(vi-va,2)+' V';
   $('#l3ia').textContent=Ia<0.01?fm(Ia*1000,2)+' mA':fm(Ia,3)+' A';$('#l3nr').textContent=fm(va/KE*W2N,0)+' rpm';
   const ws=[];for(let i=0;i<=120;i++)ws.push(i*340/120);
   plot($('#l3p'),{xmax:340,ymax:40,xlabel:'ω (rad/s)',ylabel:'Va (V)',shade:[{x0:0,x1:dz,color:'--stop',label:'Dead zone Δω'}],
    series:[{pts:[[0,0],[340,KE*340]],color:'--blue'},{pts:ws.map(x=>[x,Va(x,RL)]),color:'--live'}],arrows:[{x:w,y0:vi,y1:va,label:'ΔV'}],points:[{x:w,y:va,color:'--live'}]});
   // drop bar: E = armature-reaction drop + Ia·Ra + Vbrush + Va
   const E=vi;let parts;if(E<=Vb)parts=[['--stop',E,'Vbrush']];else{const ar=kk*w*Ia,rr=Ia*Ra;parts=[['--blue',va,'Va'],['--live',ar,'K·Kr·ω·Ia'],['--muted',rr,'Ia·Ra'],['--stop',Vb,'Vbrush']]}
   const tot=Math.max(E,0.001);let x=10,s=`<svg viewBox="0 0 520 74" role="img" aria-label="توزيع الجهد المتولد">`;
   parts.forEach(([c,v,lab])=>{const wd=Math.max(0,v/tot*500);if(wd<0.5)return;s+=`<rect x="${x.toFixed(1)}" y="8" width="${wd.toFixed(1)}" height="26" fill="var(${c})" opacity=".85"/>`;if(wd>46)s+=`<text class="txt" x="${(x+wd/2).toFixed(1)}" y="52" text-anchor="middle">${lab}</text><text class="txt m" x="${(x+wd/2).toFixed(1)}" y="66" text-anchor="middle">${fm(v,2)} V</text>`;x+=wd});
   s+=`<rect x="10" y="8" width="500" height="26" fill="none" stroke="var(--fg)"/></svg>`;$('#l3bar').innerHTML=s;
   $('#l3msg').innerHTML=n===0?'':E<=Vb?`<div class="callout err">الجهد المتولد <span class="ltr">${fm(E,2)} V</span> أقل من جهد التلامس <span class="ltr">${fm(Vb,1)} V</span>: نحن داخل <b>المنطقة الميتة</b>، والقراءة صفر.</div>`:
    `<div class="callout">من <span class="ltr">E<sub>a</sub> = ${fm(E,2)} V</span>: يضيع <span class="ltr">${fm(kk*w*Ia,2)} V</span> برد فعل المنتج، و <span class="ltr">${fm(Ia*Ra,2)} V</span> على R<sub>a</sub>، و <span class="ltr">${fm(Vb,1)} V</span> عند الفرش، ويصل إلى الأطراف <span class="ltr">${fm(va,2)} V</span>.</div>`;
   steps.check()});
 },
 examples:[
  {title:'مثال (٢-٣)',ref:'ص 35',
   q:'<p>«مولد تاكو للتيار المستمر ذو التغذية المستقلة <span class="ltr">(50 W, R<sub>a</sub> = 0.03 Ω)</span> يعمل على القوة الدافعة الكهربية <span class="ltr">(E<sub>a</sub> = 25 V)</span> والخرج المعتاد. أوجد جهد الأطراف وكذلك تيار المنتج.»</p>',
   given:[{id:'P',label:'القدرة الخارجة',sym:'P_{out}',unit:'W',value:50},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.03},{id:'Ea',label:'القوة الدافعة للمنتج',sym:'E_a',unit:'V',value:25}],
   solve:(g,B,isBook)=>{const a=1,b=-g.Ea,c=B.round(g.P*g.Ra,6),D=b*b-4*a*c;if(D<0)return [{t:'المميز سالب: لا يوجد جهد أطراف حقيقي بهذه القيم (القدرة المطلوبة أكبر من قدرة المولد).'}];
    const r1=(-b+Math.sqrt(D))/(2*a),r2=(-b-Math.sqrt(D))/(2*a);const VT=isBook?Math.floor(r1*100+1e-9)/100:B.round(r1,2);const I=g.P/VT;
    return [
    {t:'القدرة الخارجة:',f:'P_{out} = V_T\\,I_L'},
    {t:'',f:`I_L = I_a = \\frac{${g.P}}{V_T}`},
    {t:'جهد الأطراف:',f:'V_T = E_a - I_a R_a'},
    {t:'نعوّض التيار بدلالة V<sub>T</sub>:',f:`V_T = ${g.Ea} - \\frac{${g.P}\\times ${g.Ra}}{V_T}`},
    {t:'نضرب الطرفين في V<sub>T</sub> فنحصل على معادلة من الدرجة الثانية:',f:`V_T^2 - ${g.Ea}\\,V_T + ${fm(c)} = 0`},
    {t:'معاملات المعادلة:',v:`a = ${a} ,  b = ${fm(b)} ,  c = ${fm(c)}`},
    {t:'القانون العام:',f:'V_T = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'},
    {t:isBook?'جهد الأطراف كما طبعه الكتاب:':'جهد الأطراف (الجذر الكبير):',v:VT,unit:'V',dp:2,final:true},
    {t:'تيار الحمل = تيار المنتج:',f:`I_L = I_a = \\frac{${g.P}}{${fm(VT,2)}}`,v:isBook?B.round(I,0):B.round(I,2),dp:isBook?0:2,unit:'A',final:true},
    {t:'للمقارنة (ليس من الكتاب): الجذران الدقيقان للمعادلة',v:`V_T = ${fm(r1,4)} V   أو   V_T = ${fm(r2,4)} V`},
    {t:`نأخذ الجذر الكبير لأن الجذر الصغير يعني تياراً هائلاً (≈ ${fm(g.P/r2,0)} A) وهبوطاً في R<sub>a</sub> يساوي تقريباً كل E<sub>a</sub>؛ والتيار الدقيق للجذر الكبير ${lt(fm(g.P/r1,3)+' A')}. (توضيح، ليس من الكتاب)`}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> الكتاب طبع <span class="ltr">V<sub>T</sub> = 24.93 V</span> والدقيق <span class="ltr">24.9399</span> أي <span class="ltr">24.94 V</span> بالتقريب الصحيح؛ وطبع <span class="ltr">I = 2 A</span> والدقيق <span class="ltr">2.006 A</span>. </span>بقيم الكتاب تعرض الحاسبة رقمي الكتاب (24.93 و 2)، وإذا غيّرت المعطيات تعرض التقريب الصحيح لخانتين.'}
 ],
 quiz:[
  {q:'حسب الكتاب، الخطأ في قراءة تاكو التيار المستمر يرجع لسببين هما:',o:['رد فعل المنتج، وجهد التلامس بين المبدل والفرش','الحرارة والرطوبة','التردد والجهد','القصور الذاتي والاحتكاك'],c:0,e:'ص 32–33.'},
  {q:'رد فعل المنتج:',o:['يقوي الفيض المغناطيسي','يضعف الفيض المغناطيسي','لا يؤثر في الفيض','يعكس اتجاه الدوران'],c:1,e:'ص 32: «وهو يضعف من الفيض المغناطيسي للمولد».'},
  {q:'النقص في الفيض Δφ<sub>r</sub> يعتمد على:',o:['تيار المنتج I<sub>a</sub>','تيار المجال فقط','مقاومة الفرش','عدد الأقطاب'],c:0,e:'Δφ_r = K_r · I_a (المعادلة ٢-٦).'},
  {q:'حسب الكتاب، ما الذي يظل ثابتاً عند الفرش؟',o:['مقاومة التلامس','جهد التلامس V<sub>brush</sub>','تيار الفرش','حرارة الفرش'],c:1,e:'ص 33: «في الواقع أن جهد التلامس V_brush هو الذي يظل ثابتًا وليس مقاومة التلامس».'},
  {q:'لماذا توجد منطقة ميتة Δω لا يظهر فيها جهد؟',o:['لأن الجهد المتولد أقل من جهد التلامس','لأن المجال مفصول','لأن الحمل مفتوح','لأن رد فعل المنتج كبير'],c:0,e:'ص 33: الجهد على الأطراف لا يبدأ بالظهور إلا بعد أن يزيد الجهد المتولد عن جهد التلامس.'},
  {q:'لتصغير المنطقة الميتة يستخدم الكتاب:',o:['فرشاً من الفضة','فرشاً كربونية أكبر','مقاومة حمل صغيرة','زيادة R_a'],c:0,e:'ص 33: فرش معدنية من الفضة تقلل جهد التلامس.'},
  {q:'استعمال جهاز قياس بمقاومة كبيرة جداً يقلل:',o:['جهد التلامس','تيار المنتج ورد فعله','سرعة العمود','تردد الجهد'],c:1,e:'ص 33: «للتقليل من تيار ورد فعل المنتج».'},
  {q:'K<sub>E</sub> = 0.1 V/(rad/s) و V<sub>brush</sub> = 1 V. حافة المنطقة الميتة عند:',o:['0.1 rad/s','1 rad/s','10 rad/s','100 rad/s'],c:2,e:'توضيح من بسط (٢-٨): Δω = V_brush ÷ K_E = 1 ÷ 0.1 = 10 rad/s.'}
 ]
});

/* ============================== Lesson 2.4 ============================== */
B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'36–39',
 title:'مولد التاكو الحثي: التركيب ونظرية العمل والحساب',
 summary:'ملف مجال وملف توليد متعامدان ودوار كأس نحاسي (الشكل ٢-٣): عند السكون يعمل كمحول ولا جهد على ملف التوليد، وعند الدوران يظهر جهد بنفس تردد المصدر يتناسب مع السرعة؛ والحساب بالدائرة المكافئة للمحرك أحادي الوجه والمثال (٢-٤).',
 stations:[
  {intro:true},

  {st:1,short:'التركيب',title:'٢-٣ مولدات التاكو الحثية (Induction Tacho-Generators)',ref:'ص 36',
   q:'بلا فرش ولا مبدل ولا مغناطيس… كيف يمكن لملفين ثابتين ودوار من النحاس أن يقيسوا السرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="إعادة رسم الشكل ٢-٣: ملف المجال أفقي وملف التوليد رأسي متعامدان على العضو الثابت، والدوار في الوسط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="ملفات العضو الثابت ⟦(Stator Windings)⟧: الحلقة الداكنة هي العضو الثابت وعليه الملفان."><circle cx="180" cy="150" r="118" fill="none" stroke="#2C4A40" stroke-width="14"/></g><path d="M100 150 H260 M180 70 V230" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 5" opacity=".5"/><g data-tip="ملف المجال ⟦m (Field Winding)⟧: يوصل مع مصدر ثابت الجهد والتردد."><rect x="70" y="122" width="30" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><path d="M76 122 V178 M85 122 V178 M94 122 V178" stroke="#2C4A40" stroke-width="1.5"/><rect x="260" y="122" width="30" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><path d="M266 122 V178 M275 122 V178 M284 122 V178" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="ملف التوليد ⟦a (Generating Winding)⟧: يتولد عليه الجهد الذي نقيس منه السرعة."><rect x="152" y="40" width="56" height="30" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M152 46 H208 M152 55 H208 M152 64 H208" stroke="#2C4A40" stroke-width="1.5"/><rect x="152" y="230" width="56" height="30" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M152 236 H208 M152 245 H208 M152 254 H208" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="الزاوية بين الملفين تسعون درجة كهربائية: الملفان متعامدان."><path d="M180 82 A68 68 0 0 1 248 150" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="238" y="98" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">90°</text></g><g data-tip="العضو الدوار ⟦(Rotor)⟧: قفص سنجابي (الدوائر الصغيرة قضبانه)، ويفضّل أن يكون كأساً رفيعاً من النحاس ⟦(Drag-Cup)⟧ لأصغر قصور ذاتي."><circle cx="180" cy="150" r="52" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><g fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"><circle cx="220" cy="150" r="6"/><circle cx="208.3" cy="178.3" r="6"/><circle cx="180" cy="190" r="6"/><circle cx="151.7" cy="178.3" r="6"/><circle cx="140" cy="150" r="6"/><circle cx="151.7" cy="121.7" r="6"/><circle cx="180" cy="110" r="6"/><circle cx="208.3" cy="121.7" r="6"/><circle cx="180" cy="150" r="9"/></g></g><text x="222" y="62" font-size="15" fill="#B4472F" font-weight="700" font-family="var(--mono)">a</text><text x="304" y="192" text-anchor="middle" font-size="15" fill="#1F7A72" font-weight="700" font-family="var(--mono)">m</text><text x="180" y="18" text-anchor="middle" font-size="12.5" fill="#B4472F" font-weight="700" font-family="var(--mono)">Generating Winding</text><text x="180" y="296" text-anchor="middle" font-size="12.5" fill="#1F7A72" font-weight="700" font-family="var(--mono)">Field Winding</text></svg>`,
   cap:'إعادة رسم الشكل (٢-٣): رسم توضيحي لمولد تاكو حثي. البرتقالي ملف التوليد a، والفيروزي ملف المجال m، والدوار في الوسط.<br><b>مرّر المؤشر على الملفات والدوار والزاوية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>جميع أنظمة التحكم غالبًا ما تحتوي على مولد حثي لقياس السرعة الزاوية، وتوليد إشارة كهربائية متناسبة مع السرعة، يتكون مولد التاكو الحثي من <b>ملفين</b>، بينهما <b>زاوية مقدارها تسعون درجة كهربائية</b>، على عضوه الثابت، أحد الملفين يُوصل مع مصدر ثابت الجهد والتردد ويسمى <b>ملف الجهد أو ملف المجال <span class="ltr">(Field winding)</span></b> بينما يتولد جهد على الملف الآخر ويسمى <b>ملف التوليد <span class="ltr">(Generating winding)</span></b>.</p>`,ref:'ص 36'}
   ],
   body:[
    {book:String.raw`<p>العضو الدائر ذو <b>قفص سنجابي</b> ويفضل أن يكون على شكل <b>كأس رفيع من النحاس <span class="ltr">(Drag-Cup Rotor)</span></b> للحفاظ على أصغر قصور ذاتي وأصغر ثابت زمن ميكانيكي للدوار للوصول لسرعة لحالة الاستقرار، وهي من أهم متطلبات نظم التحكم، الشكل (٢-٣) يبين رسمًا توضيحيًا لمولد تاكو حثي.</p>`,ref:'ص 36'},
    {predict:{q:'لماذا يُفضَّل أن يكون الدوار كأساً رفيعاً من النحاس؟',opts:[
     ['لأن النحاس يزيد الجهد المتولد كثيراً',false,'سبب الكتاب لا يتعلق بمقدار الجهد، بل بخفة الدوار.'],
     ['لأنه أرخص من القفص السنجابي',false,'الكتاب لا يذكر التكلفة؛ يذكر القصور الذاتي والثابت الزمني.'],
     ['للحفاظ على أصغر قصور ذاتي وأصغر ثابت زمن ميكانيكي',true,'الكأس الرفيع خفيف، فيصل إلى سرعة الاستقرار بسرعة؛ وهذان من متطلبات التاكو في البند ٢-١ (الدرس 2.1).']]}},
    {tip:String.raw`<p>تذكّر متطلبات البند ٢-١: «أقل قصور ذاتي» و«أقل ثابت زمني». الكأس النحاسي الرفيع يحققهما معاً: كتلته صغيرة فلا يُثقل العمود الذي نقيس سرعته، وتلحق سرعته بسرعة العمود فوراً.</p>`,title:'ربط بالدرس الأول'},
    {add:String.raw`<p>هذا التركيب نفسه (ملفان متعامدان ودوار خفيف) تراه في محركات التحكم الصغيرة ثنائية الوجه المستعملة في أجهزة القياس والتحكم الآلي، وستدرس محركات التحكم في الوحدة الثالثة.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: أي جزء هذا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'مولد التاكو الحثي ثلاثة أجزاء رئيسية. اختر الجزء المناسب لكل وصف (ص 36).',cats:['ملف المجال','ملف التوليد','الدوار'],items:[
 ['يُوصل مع مصدر ثابت الجهد والتردد، ويسمى أيضاً ملف الجهد',0,'«أحد الملفين يُوصل مع مصدر ثابت الجهد والتردد ويسمى ملف الجهد أو ملف المجال».'],
 ['يتولد عليه الجهد الذي نقيس منه السرعة',1,'«يتولد جهد على الملف الآخر ويسمى ملف التوليد».'],
 ['كأس رفيع من النحاس (Drag-Cup)',2,'يُفضَّل الدوار على هذا الشكل للحفاظ على أصغر قصور ذاتي وأصغر ثابت زمن.'],
 ['ذو قفص سنجابي',2,'«العضو الدائر ذو قفص سنجابي ويفضل أن يكون على شكل كأس رفيع من النحاس» (ص 36).']]})}
   ]},

  {st:2,short:'عند السكون',title:'٢-٣-١ نظرية عمل التاكومترات الحثية — عند السكون',ref:'ص 37',
   q:'ملف المجال موصول بالمصدر والفيض موجود… فلماذا لا يظهر أي جهد على ملف التوليد والدوار ساكن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدوار ساكن: محصلة الفيض أفقية على محور ملف المجال، متعامدة مع ملف التوليد، والفولتميتر على ملف التوليد يقرأ صفراً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="180" cy="160" r="112" fill="none" stroke="#2C4A40" stroke-width="12"/><g data-tip="ملف المجال: موصول مع مصدر ثابت الجهد والتردد. يعمل هنا مثل الملف الابتدائي في المحول."><rect x="76" y="132" width="28" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="256" y="132" width="28" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="ملف التوليد: مفتوح الدائرة، ولا يتولد عليه جهد لأن محصلة الفيض متعامدة معه."><rect x="152" y="56" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="152" y="236" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="العضو الدوار الساكن: يعمل مثل ملف ثانوي مقصور على نفسه، يتولد فيه جهد التحويل وتيار يعاكس فيضه الفيض الأصلي (قاعدة لنز)."><circle cx="180" cy="160" r="50" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="محصلة الفيض ⟦φf⟧: الفرق بين فيض ملف المجال وفيض الدوار المعاكس، في اتجاه فيض ملف المجال وبنفس التردد. متعامدة مع ملف التوليد."><path d="M112 160 H238" stroke="#1F7A72" stroke-width="6" stroke-linecap="round"/><polygon points="252,160 236,151 236,169" fill="#1F7A72"/><text x="214" y="148" font-size="16" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">φ<tspan font-size="11" dy="4">f</tspan></text></g><path d="M196 56 V40 H286" stroke="#2C4A40" stroke-width="2.5" fill="none"/><g data-tip="فولتميتر على ملف التوليد: يقرأ صفراً والدوار ساكن."><rect x="286" y="22" width="56" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="314" y="47" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">0</text></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الدوار ساكن: يعمل مثل المحول</text></svg>`,
   cap:'عند السكون تكون محصلة الفيض على محور ملف المجال فقط، فلا تقطع ملف التوليد.<br><b>مرّر المؤشر على الملفات والدوار والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>لشرح نظرية عمل مولدات التاكو الحثية، نفترض أن ملف المجال موصل مع مصدر جهد ثابت القيمة والتردد وأن ملف التوليد مفتوح. <b>عند سكون العضو الدوار، يمكن اعتبار مولد التاكو عبارة عن محول</b>، ملفه الابتدائي هو ملف المجال وملفه الثانوي مقصور على نفسه، ممثلًا في أسطوانة العضو الدوار.</p>`,ref:'ص 37'},
    {predict:{q:'الدوار ساكن وملف المجال موصول بالمصدر. ماذا يقرأ فولتميتر موصول على ملف التوليد؟',opts:[
     ['صفراً، لأن محصلة الفيض متعامدة مع ملف التوليد',true,'هذا نص الكتاب: محصلة الفيض \\(\\phi_f\\) لا تولد أي جهد في ملف التوليد لأنها متعامدة معه.'],
     ['جهداً يساوي جهد المصدر، لأنه يعمل كمحول',false,'المحول هنا بين ملف المجال والدوار (الثانوي المقصور)، لا بين ملف المجال وملف التوليد.'],
     ['جهداً صغيراً يتناسب مع جهد التحويل',false,'جهد التحويل يتولد في الدوار نفسه، والفيض الناتج يبقى على محور ملف المجال، فلا يصل شيء إلى ملف التوليد.']]}}
   ],
   body:[
    {book:String.raw`<p>الفيض المغناطيسي الثابت الناتج عن ملف المجال يقطع العضو الدوار فيولد به جهدًا كما في المحولات ويسمى <b>بجهد التحويل</b>. جهد التحويل المتولد في ملفات العضو الدوار يتسبب في توليد تيار وفيض مغناطيسي يعاكس الفيض الأصلي لملف المجال طبقًا لقاعدة لنز، المحصلة الكلية للفيض المغناطيسي (\(\phi_f\)) هي الفرق بين المجالين وفي نفس اتجاه الفيض الأصلي لملف المجال وبنفس التردد. محصلة الفيض المغناطيسي (\(\phi_f\)) <b>لا تولد أي جهد في ملف التوليد لأنها متعامدة معه</b>.</p>`,ref:'ص 37'},
    {tip:String.raw`<p>الجهد يتولد في الملف عندما يمر الفيض <b>خلاله</b> ويتغير. ملف التوليد واقف «بالعرض» بالنسبة لمحور الفيض \(\phi_f\)، فالفيض يمر بجانبه لا خلاله، مثل ريح تهب موازية لشراع السفينة فلا تدفعه.</p>`,title:'لماذا التعامد يعني صفراً؟'},
    {title:'تحقق سريع: المولد الساكن محوّل',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب (ص 37).',items:[
 ['عند سكون الدوار يمكن اعتبار المولد محولاً ملفه الابتدائي هو ملف المجال.',true,'هذا نص الكتاب.'],
 ['الملف الثانوي لهذا المحول هو ملف التوليد.',false,'الثانوي «مقصور على نفسه، ممثلاً في أسطوانة العضو الدوار»، وملف التوليد مفتوح.'],
 ['فيض تيار الدوار يعاكس الفيض الأصلي لملف المجال طبقاً لقاعدة لنز.',true,'والمحصلة <span class="ltr">φ<sub>f</sub></span> هي الفرق بينهما، في اتجاه الفيض الأصلي.'],
 ['محصلة الفيض تولد جهداً صغيراً على ملف التوليد والدوار ساكن.',false,'«لا تولد أي جهد في ملف التوليد لأنها متعامدة معه».']]})}
   ]},

  {st:3,short:'عند الدوران',title:'عند الدوران: جهد يتناسب مع السرعة',ref:'ص 37–38',
   q:'ما الذي يتغير عندما يبدأ الدوار بالدوران، حتى يظهر جهد على ملف التوليد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدوار يدور: يظهر فيض جديد على محور ملف التوليد فيتولد عليه جهد متردد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="180" cy="160" r="112" fill="none" stroke="#2C4A40" stroke-width="12"/><rect x="76" y="132" width="28" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="256" y="132" width="28" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><g data-tip="ملف التوليد: الفيض ⟦φg⟧ على محوره يولد فيه الجهد ⟦Ea⟧."><rect x="152" y="56" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="152" y="236" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="العضو الدوار يدور بالسرعة ⟦ω⟧، فيتولد فيه جهد دوراني ⟦Erot⟧ لأنه يدور في محصلة الفيض ⟦φf⟧."><circle cx="180" cy="160" r="50" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><g class="spin spin-r" style="transform-origin:180px 160px"><circle cx="180" cy="122" r="5" fill="#2C4A40"/></g><path d="M222 196 A56 56 0 0 1 180 216" fill="none" stroke="#2C4A40" stroke-width="3"/><polygon points="172,216 184,209 184,223" fill="#2C4A40"/><text x="222" y="226" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ω</text></g><g data-tip="محصلة الفيض ⟦φf⟧ على محور ملف المجال: باقية كما هي، ويبقى جهد التحويل كما هو."><path d="M112 160 H238" stroke="#1F7A72" stroke-width="5" stroke-linecap="round"/><polygon points="252,160 236,152 236,168" fill="#1F7A72"/><text x="118" y="152" font-size="15" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">φ<tspan font-size="10" dy="4">f</tspan></text></g><g data-tip="الفيض ⟦φg⟧: ينتج عن تيار الجهد الدوراني، وهو في اتجاه محور ملف التوليد، ويتناسب مع السرعة ⟦ω⟧."><path d="M180 206 V112" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><polygon points="180,98 171,114 189,114" fill="#E8735A"/><text x="190" y="118" font-size="15" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">φ<tspan font-size="10" dy="4">g</tspan></text></g><path d="M196 56 V40 H282" stroke="#2C4A40" stroke-width="2.5" fill="none"/><g data-tip="الجهد على ملف التوليد ⟦Ea⟧: متردد بنفس تردد ملف المجال، ومقداره يتناسب مع السرعة."><rect x="282" y="20" width="62" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M290 40 C298 22 306 22 313 40 S328 58 336 40" fill="none" stroke="#E8735A" stroke-width="2.5"/></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الدوار يدور: يظهر فيض على محور ملف التوليد</text></svg>`,
   cap:'الدوران يصنع فيضاً جديداً <span class="ltr">φ<sub>g</sub></span> على محور ملف التوليد، فيظهر عليه جهد متردد.<br><b>مرّر المؤشر على الأسهم والملفات والشاشة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>عند دوران العضو الدوار بسرعة مقدارها \(\omega\) يتولد <b>جهد دوراني</b> في العضو الدوار (\(E_{rot}\))، نتيجة لدوران الدوار في محصلة الفيض (\(\phi_f\)) السابق ذكرها، يتناسب مع سرعة الدوران \(\omega\) وله نفس تردد جهد ملف المجال ويكون متعامدًا مع اتجاه الفيض المغناطيسي (\(\phi_f\)) المسبب له، بينما يبقى جهد التحويل كما هو.</p>
     <div class="eq">$$E_{rot} = K\cdot\omega\cdot\phi_f$$<span class="eqno" style="direction:rtl">(٢-٩)</span></div>`,ref:'ص 37'}
   ],
   body:[
    {book:String.raw`<p>الجهد الدوراني (\(E_{rot}\)) المتولد في العضو الدوار، ينتج تيارًا وفيضًا مغناطيسيًا (\(\phi_g\)) في اتجاه محور ملف التوليد، الفيض المغناطيسي الناتج (\(\phi_g\)) يولد جهدًا \(E_a\) في ملف التوليد، الجهد المتولد \(E_a\) يكون متناسبًا مع سرعة دوران العضو الدوار وله نفس تردد ملف المجال.</p>
     <div class="eq">$$E_{rot}\ \text{directly proportional to}\ \omega$$<span></span></div>
     <div class="eq">$$\phi_g\ \text{directly proportional to}\ E_{rot}$$<span></span></div>
     <div class="eq">$$\text{therefore}\ \phi_g\ \text{is directly proportional to}\ \omega$$<span></span></div>
     <div class="eq">$$\phi_g = \text{const.}\times\omega$$<span></span></div><div class="eq">$$E_a = \text{const.}\times\phi_g$$<span></span></div><div class="eq">$$E_a = K_g\times\omega$$<span></span></div>`,ref:'ص 37'},
    {title:'تابع السلسلة خطوة خطوة',widget:(el,B)=>{
      const S=['يدور الدوار بالسرعة <span class="ltr">ω</span>','جهد دوراني <span class="ltr">E<sub>rot</sub> = K·ω·φ<sub>f</sub></span> (٢-٩)','تيار وفيض <span class="ltr">φ<sub>g</sub></span> على محور ملف التوليد','جهد <span class="ltr">E<sub>a</sub></span> على ملف التوليد','<span class="ltr">E<sub>a</sub> = K<sub>g</sub>·ω</span> وبنفس تردد ملف المجال'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «أدِر الدوار» وتابع كيف يصل أثر الدوران إلى ملف التوليد.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>أدِر الدوار</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {book:String.raw`<p>حيث إن ملف التوليد موصل مع معاوقة خارجية كبيرة جدًا، فيمكننا اعتباره مفتوح الدائرة ويتولد على أطرافه جهد، في الحالة المثالية لمولد التاكو الحثي يكون الجهد المتولد متناسبًا تناسبًا طرديًا مع سرعة دوران الدوار ويصنع زاوية ثابتة مع جهد المصدر. يجب توخي الدقة عند تصميم وتركيب مولدات التاكو الحثية بحيث يكون ملف المجال وملف التوليد <b>متعامدين في الفراغ بشكل دقيق</b>، حتى لا يتولد أي جهد في ملف التوليد في حالة سكون الدوار نتيجة للمجال المغناطيسي المتسرب من ملف الجهد.</p>`,ref:'ص 38'},
    {predict:{q:'تضاعفت سرعة دوار مولد التاكو الحثي. ماذا يحدث لجهد ملف التوليد \\(E_a\\)؟',opts:[
     ['يتضاعف مقداره ويتضاعف تردده',false,'هذا ما يحدث في المولد التزامني (الدرس 2.5). في الحثي يبقى التردد مساوياً لتردد ملف المجال.'],
     ['يتضاعف مقداره ويبقى تردده مساوياً لتردد ملف المجال',true,'\\(E_a = K_g\\times\\omega\\) «وله نفس تردد ملف المجال» (ص 37). فالسرعة تُقرأ من مقدار الجهد.'],
     ['يبقى مقداره ثابتاً ويتضاعف تردده',false,'المقدار هو الذي يتناسب مع السرعة، والتردد ثابت يساوي تردد المصدر.']]}},
    {watch:String.raw`<p>إذا لم يكن الملفان متعامدين بدقة، يمر جزء من فيض ملف المجال (المتسرب) خلال ملف التوليد، فيظهر عليه جهد <b>حتى والدوار ساكن</b>، وهذا خطأ في القراءة. لذلك يشدد الكتاب على التعامد الدقيق عند التصميم والتركيب.</p>`}
   ]},

  {st:4,short:'الدائرة المكافئة',title:'الحساب بالدائرة المكافئة للمحرك أحادي الوجه',ref:'ص 38–39',
   q:'نعرف أن الجهد يزداد مع السرعة… فكيف نحسب مقداره وزاويته بالأرقام؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقارنة: عند بدء الحركة تتساوى معاوقة المجال الأمامي والخلفي فينعدم الجهد، ومع زيادة السرعة تكبر الأمامية وتصغر الخلفية فيظهر الجهد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="190" y="42" width="140" height="256" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="30" y="42" width="140" height="256" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="260" y="68" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">عند بدء الحركة</text><text x="260" y="88" text-anchor="middle" font-size="14" fill="#2C4A40" font-family="var(--mono)">s = 1</text><text x="100" y="68" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">كلما زادت السرعة</text><text x="100" y="88" text-anchor="middle" font-size="13" fill="#2C4A40">وقلّ الانزلاق</text><g data-tip="معاوقة المجال الأمامي ⟦Zf⟧."><rect x="214" y="130" width="34" height="110" rx="4" fill="#4FB3A9"/><rect x="58" y="100" width="34" height="140" rx="4" fill="#4FB3A9"/></g><g data-tip="معاوقة المجال الخلفي ⟦Zb⟧."><rect x="272" y="130" width="34" height="110" rx="4" fill="#E8735A"/><rect x="108" y="212" width="34" height="28" rx="4" fill="#E8735A"/></g><g font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" text-anchor="middle" direction="ltr"><text x="231" y="258">Z<tspan font-size="9" dy="4">f</tspan></text><text x="289" y="258">Z<tspan font-size="9" dy="4">b</tspan></text><text x="75" y="258">Z<tspan font-size="9" dy="4">f</tspan></text><text x="125" y="258">Z<tspan font-size="9" dy="4">b</tspan></text></g><g data-tip="الفرق ⟦Zf − Zb⟧ يكبر مع السرعة، والجهد ⟦Ea⟧ يتناسب معه حسب المعادلة (٢-١٣)."><path d="M150 100 H158 V212 H150" fill="none" stroke="#2C4A40" stroke-width="2.5"/><rect x="144" y="96" width="22" height="120" fill="transparent"/></g><g data-tip="تتساوى المعاوقتان عند بدء الحركة، فالفرق صفر والجهد صفر."><text x="260" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">a</tspan><tspan dy="-4"> = 0</tspan></text></g><text x="100" y="284" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700">يزداد الجهد</text></svg>`,
   cap:'الجهد على ملف التوليد يتبع الفرق بين المعاوقتين (الأطوال توضيحية، والأرقام الفعلية في المثال).<br><b>مرّر المؤشر على الأعمدة والقوس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>مما سبق شرحه عن تركيب مولد التاكو الحثي، يتضح أنه يمكن اعتباره <b>مكافئًا لمحرك حثي أحادي الوجه</b> ملفه الرئيسي موصل مع مصدر ثابت الجهد والتردد وملفه المساعد مفتوح، إذًا يمكن استخدام الدائرة المكافئة للمحرك أحادي الوجه لحساب الجهد المتولد على الملف المساعد (أو ملف التوليد في حالة التاكومترات الحثية). حيث إن الجهود على كل من (\(0.5Z_f,\ 0.5Z_b\)) هي الجهود المتولدة في الملف الرئيسي بواسطة المجال الأمامي والمجال الخلفي على الترتيب، نفس هذه المجالات الدوارة ستولد جهودًا أيضًا في الملف المساعد. إذا افترضنا أن (\(n\)) تمثل النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي، فإن الجهد المتولد على الملف المساعد يساوي الجهد المتولد على الملف الرئيسي مضروبًا في المعامل (\(n\))، وحيث إن (\(E_{af}\)) يسبق (\(E_{mf}\)) بتسعين درجة، إذًا:</p>`,ref:'ص 38'}
   ],
   body:[
    {book:String.raw`<div class="eq">$$E_{af} = j\,n\,E_{mf} = j\,n\,I_1\cdot(0.5Z_f)$$<span class="eqno" style="direction:rtl">(٢-١٠)</span></div><div class="eq">$$\text{where }\ n=\frac{N_a}{N_m}$$<span></span></div>
     <p>وأن (\(E_{ab}\)) يتأخر عن (\(E_{mb}\)) بتسعين درجة، إذًا:</p>
     <div class="eq">$$E_{ab}=-jnE_{mb}=-jnI_1\cdot(0.5Z_b)$$<span class="eqno" style="direction:rtl">(٢-١١)</span></div>
     <p>الجهد الكلي المتولد على الملف المساعد</p>
     <div class="eq">$$\bar{E}_a = \bar{E}_{af} + \bar{E}_{ab}$$<span class="eqno" style="direction:rtl">(٢-١٢)</span></div>
     <div class="eq">$$\bar{E}_a = j\,0.5\times n\,I_1\cdot(Z_f - Z_b)$$<span class="eqno" style="direction:rtl">(٢-١٣)</span></div>
     <p><b>عند بدء الحركة (\(s=1\)) فإن (\(Z_f=Z_b\)) و (\(E_a=0\))</b></p>`,ref:'ص 38'},
    {tip:String.raw`<ul><li>\(E_{af},\ E_{ab}\): الجهد المتولد في الملف المساعد (التوليد) بالمجال الأمامي / الخلفي، و \(E_{mf},\ E_{mb}\): نظيراهما في الملف الرئيسي.</li><li>\(I_1\): تيار الدخل (الملف الرئيسي)، و \(Z_f,\ Z_b\): معاوقة المجال الأمامي والخلفي، و \(N_a,\ N_m\): عدد لفات الملف المساعد والرئيسي.</li><li>\(j\) تعني إزاحة <span class="ltr">90°</span> للأمام، و \(-j\) إزاحة <span class="ltr">90°</span> للخلف. لذلك يُطرح \(Z_b\) من \(Z_f\) في (٢-١٣).</li></ul>`,title:'معاني الرموز'},
    {book:String.raw`<p>الجهد المتولد على ملف التوليد (\(E_a\)) يعتمد على الفرق بين قيمتي \(Z_f\) و \(Z_b\) فإذا تساوت القيمتان تلاشى الجهد المتولد، وكلما ازدادت السرعة وقلت قيمة الانزلاق، تزداد قيمة \(Z_f\) وتقل قيمة \(Z_b\) فيزداد الفرق بين القيمتين، ويزداد الجهد المتولد على ملف التوليد بما يتناسب مع الزيادة في السرعة تناسبًا طرديًا.</p>`,ref:'ص 39'},
    {predict:{q:'الدوار ساكن، أي الانزلاق \\(s=1\\). ماذا تعطي المعادلة (٢-١٣)؟',opts:[
     ['\\(E_a\\) أكبر ما يمكن، لأن الانزلاق أكبر ما يمكن',false,'الجهد يعتمد على الفرق \\(Z_f-Z_b\\)، لا على الانزلاق مباشرة.'],
     ['\\(E_a = j\\,0.5\\,n\\,I_1\\cdot Z_f\\)',false,'هذا يهمل \\(Z_b\\)؛ والمعاوقتان متساويتان عند السكون فتُلغي إحداهما الأخرى.'],
     ['\\(E_a=0\\)، لأن \\(Z_f=Z_b\\) فالفرق صفر',true,'هذا نص الكتاب (ص 38)، وهو يتفق مع المحطة الثانية: لا جهد على ملف التوليد والدوار ساكن.']]}},
    {tip:String.raw`<p>الانزلاق \(s=(n_s-n)/n_s\): عند السكون \(s=1\)، وكلما زادت السرعة قلّ \(s\). و \(Z_f\) يُحسب بالانزلاق \(s\)، و \(Z_b\) بالانزلاق \(2-s\)؛ لذلك يتساويان عند السكون فقط.</p>`,title:'الانزلاق باختصار'},
    {title:'مختبر مصغّر: Zf و Zb مع السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك سرعة الدوار وشاهد معاوقتي المجال الأمامي والخلفي والفرق بينهما الذي يعطي <span class="ltr">E<sub>a</sub></span> في المعادلة <span class="ltr">(٢-١٣)</span>، بنسبة لفات <span class="ltr">n = 0.8</span>.',
 tp:{id:'u2-l4',defs:[
   {k:'V',label:'جهد مصدر ملف المجال',unit:'V',value:115,min:1,max:1000,step:1},
   {k:'R1',label:'مقاومة ملف المجال R<sub>1</sub>',unit:'Ω',value:30,min:0,max:1000,step:0.1},
   {k:'X1',label:'ممانعة تسرب ملف المجال X<sub>1</sub>',unit:'Ω',value:25,min:0,max:1000,step:0.1},
   {k:'Xm',label:'ممانعة المغنطة X<sub>m</sub>',unit:'Ω',value:250,min:1,max:10000,step:1},
   {k:'R2',label:'مقاومة الدوار (الكأس) R<sub>2</sub>',unit:'Ω',value:200,min:1,max:10000,step:1},
   {k:'X2',label:'ممانعة تسرب الدوار X<sub>2</sub>',unit:'Ω',value:25,min:0,max:1000,step:0.1}]},
 predict:{q:'بدأ الدوار يدور وزادت سرعته. ماذا يحدث لـ <span class="ltr">Z<sub>f</sub></span> و<span class="ltr">Z<sub>b</sub></span>؟',opts:[
  ['تزيد الاثنتان معاً بالقدر نفسه',false,'لو زادتا بالقدر نفسه لبقي الفرق صفراً ولما تولد جهد.'],
  ['تزيد <span class="ltr">Z<sub>f</sub></span> وتقل <span class="ltr">Z<sub>b</sub></span>، فيزداد الفرق بينهما',true,'«كلما ازدادت السرعة وقلت قيمة الانزلاق، تزداد قيمة Zf وتقل قيمة Zb» (ص 39).'],
  ['تقل <span class="ltr">Z<sub>f</sub></span> وتزيد <span class="ltr">Z<sub>b</sub></span>',false,'العكس هو الصحيح.']]},
 ins:[{k:'n',l:'سرعة الدوار',min:0,max:2700,step:50,v:0,dp:0,u:'rpm'}],
 calc:(s,P,B)=>{const PP=Object.assign({},IND,P),m=indModel(s.n,0.8,PP),zf=cabs(m.Zf),zb=cabs(m.Zb),dz=cabs(csub(m.Zf,m.Zb)),E=cabs(m.Ea),mx=Math.max(cabs(indModel(2700,0.8,PP).Zf),1);
  return {facts:[['الانزلاق s',DCML.fm(B,m.s,3)],['<span class="ltr">|Z<sub>f</sub> − Z<sub>b</sub>|</span>',DCML.fm(B,dz,1)+' Ω'],['<span class="ltr">|E<sub>a</sub>|</span>',DCML.fm(B,E,1)+' V','hi']],
   bars:[{l:'<span class="ltr">|Z<sub>f</sub>|</span>',v:zf,max:mx,txt:DCML.fm(B,zf,1)+' Ω',col:'--blue'},{l:'<span class="ltr">|Z<sub>b</sub>|</span>',v:zb,max:mx,txt:DCML.fm(B,zb,1)+' Ω',col:'--live'}],
   msg:s.n===0?'الدوار ساكن (<span class="ltr">s = 1</span>): <span class="ltr">Z<sub>f</sub> = Z<sub>b</sub></span>، فالفرق صفر و<span class="ltr">E<sub>a</sub> = 0</span>.':'كلما زادت السرعة كبر الفرق بين المعاوقتين، فكبر الجهد على ملف التوليد.'}}})}
   ]},

  {st:5,short:'مثال ٢-٤',title:'مثال الكتاب ٢-٤',ref:'ص 39',
   q:'محرك أحادي الوجه نستعمله مولد تاكو: كم الجهد على ملفه المساعد، وكم زاويته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط متجهات مثال ٢-٤: تيار الدخل بزاوية سالب 51.7، والفرق بين المعاوقتين بزاوية 51.92، والجهد الناتج بزاوية 90.22" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المحور المرجعي (زاوية الصفر): منه تُقاس زاوية تيار الدخل ⟦I1⟧، وزاوية الجهد الناتج."><line x1="56" y1="190" x2="326" y2="190" stroke="#2C4A40" stroke-width="2" stroke-dasharray="7 5"/></g><g data-tip="تيار الدخل ⟦I1 = 3.59∠−51.7°⟧ من معطيات المثال."><line x1="120" y1="190" x2="182" y2="268" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="187,275 172,268 184,258" fill="#4FB3A9"/><text x="194" y="270" font-size="13" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">1</tspan><tspan dy="-4"> = 3.59∠−51.7°</tspan></text></g><g data-tip="الفرق بين المعاوقتين ⟦Zf − Zb = 29.92 + j38.18⟧ بالصورة القطبية ⟦48.5∠51.92°⟧."><line x1="120" y1="190" x2="186" y2="106" stroke="#2C4A40" stroke-width="3" stroke-dasharray="6 4"/><polygon points="191,99 179,104 189,112" fill="#2C4A40"/><text x="196" y="112" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="9" dy="4">f</tspan><tspan dy="-4"> − Z</tspan><tspan font-size="9" dy="4">b</tspan><tspan dy="-4"> = 48.5∠51.92°</tspan></text></g><g data-tip="الجهد على الملف المساعد ⟦Ea = 69.65∠90.22° V⟧: المقادير تُضرب ⟦(1.436 × 48.5)⟧ والزوايا تُجمع مع ⟦90°⟧ من ⟦j⟧."><line x1="120" y1="190" x2="120" y2="52" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="120,40 111,56 129,56" fill="#E8735A"/><text x="132" y="50" font-size="13" fill="#B4472F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">a</tspan><tspan dy="-4"> = 69.65∠90.22° V</tspan></text></g><path d="M150 190 A30 30 0 0 0 120 160" fill="none" stroke="#B4472F" stroke-width="2"/><text x="180" y="304" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الأطوال غير مرسومة بمقياس</text></svg>`,
   cap:'متجهات مثال ٢-٤ بأرقام الكتاب: الجهد الناتج يتقدم عن المحور المرجعي بزاوية <span class="ltr">90.22°</span>.<br><b>مرّر المؤشر على المتجهات والمحور (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال ٢-٤ <span class="ref">ص 39</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(I_1=3.59\angle-51.7^\circ\)</span><span class="kv ltr">\(Z_f=31.9+j40.3\)</span><span class="kv ltr">\(Z_b=1.98+j2.12\)</span><span class="kv ltr">\(n=0.8\)</span><span class="kv ltr">\(S=0.05\)</span></div>
      <div class="kv-row"><small>الخطوات</small><span class="kv ltr">\(0.5\times0.8\times3.59=1.436\)</span><span class="kv ltr">\(Z_f-Z_b=48.5\angle51.92^\circ\)</span></div>
      <div class="kv-row"><small>النتيجة</small><span class="kv res ltr">\(E_a=69.65\angle90.22^\circ\ \text{volt}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة وغيّر الأرقام</button></div></div>`},
    {predict:{q:String.raw`في الخطوة الأخيرة نضرب \(j(1.436\angle-51.7^\circ)\times(48.5\angle51.92^\circ)\). كيف نتعامل مع المقادير والزوايا؟`,opts:[
     ['نضرب المقادير ونضرب الزوايا',false,'الزوايا لا تُضرب في الصورة القطبية؛ هذا يعطي زاوية لا معنى لها.'],
     ['نجمع المقادير ونجمع الزوايا',false,'المقادير تُضرب عند الضرب، ولا تُجمع.'],
     [String.raw`نضرب المقادير ونجمع الزوايا، ثم نضيف <span class="ltr">90°</span> بسبب \(j\)`,true,'\\(1.436\\times48.5=69.65\\) و \\(-51.7+51.92+90=90.22^\\circ\\)، وهو ناتج الكتاب.']]}}
   ],
   body:[
    {book:String.raw`<p>الجهد المتولد في الملف المساعد 69.65 ومتقدم عن جهد الملف الرئيسي بزاوية مقدارها 90.22</p>`,ref:'ص 39'},
    {watch:String.raw`<p>أعطى الكتاب الانزلاق <span class="ltr">S = 0.05</span> لكنه لا يُستعمل في الحل (لأن Z<sub>f</sub> و Z<sub>b</sub> معطاتان عند هذا الانزلاق). والناتج <span class="ltr">69.65 V</span> جاء من تقريب <span class="ltr">|Z<sub>f</sub> − Z<sub>b</sub>| = 48.507</span> إلى <span class="ltr">48.5</span>؛ بلا تقريب يكون <span class="ltr">69.66 V</span>. والزاوية <span class="ltr">90.22°</span> محسوبة من زاوية I<sub>1</sub> المرجعية، بينما يقول النص «مع جهد الملف الرئيسي».</p>`,fix:true},
    {title:'مختبر مصغّر: غيّر نسبة اللفات n',widget:(el,B)=>DCML.lab(el,B,{intro:'باقي أرقام المثال كما في الكتاب: <span class="ltr">I<sub>1</sub> = 3.59∠−51.7°</span> و<span class="ltr">Z<sub>f</sub> − Z<sub>b</sub> = 48.5∠51.92°</span>. القيمة <span class="ltr">n = 0.8</span> من الكتاب، وغيرها أرقام تختارها أنت.',
 predict:{q:'إذا زادت نسبة اللفات <span class="ltr">n</span>، ماذا يحدث لزاوية <span class="ltr">E<sub>a</sub></span> (<span class="ltr">90.22°</span> في المثال)؟',opts:[
  ['تزيد مع <span class="ltr">n</span>',false,'<span class="ltr">n</span> عدد حقيقي بلا زاوية؛ يضرب المقدار فقط.'],
  ['لا تتغير',true,'الزاوية مجموع زاويتي <span class="ltr">I<sub>1</sub></span> و<span class="ltr">(Z<sub>f</sub> − Z<sub>b</sub>)</span> مع <span class="ltr">90°</span> من <span class="ltr">j</span>؛ و<span class="ltr">n</span> لا تدخل فيها.'],
  ['تنقص إلى الصفر',false,'الزاوية لا تعتمد على <span class="ltr">n</span>.']]},
 ins:[{k:'n',l:'نسبة اللفات n',min:0.2,max:1.5,step:0.05,v:0.8,dp:2}],
 calc:(s,P,B)=>{const k=0.5*s.n*3.59,E=k*48.5,a=-51.7+51.92+90;
  return {facts:[['<span class="ltr">0.5 × n × |I<sub>1</sub>|</span>',DCML.fm(B,k,3)],['<span class="ltr">|E<sub>a</sub>| = 48.5 × 0.5 n |I<sub>1</sub>|</span>',DCML.fm(B,E,2)+' V','hi'],['زاوية <span class="ltr">E<sub>a</sub></span>',DCML.fm(B,a,2)+'°']],
   bars:[{l:'<span class="ltr">|E<sub>a</sub>|</span>',v:E,max:130,txt:DCML.fm(B,E,2)+' V'}],
   msg:Math.abs(s.n-0.8)<1e-9?'عند <span class="ltr">n = 0.8</span> نحصل على ناتج الكتاب: <span class="ltr">69.65∠90.22° V</span>.':'المقدار يتناسب مع <span class="ltr">n</span>، والزاوية ثابتة.'}}})}
   ]},

  {recap:[
   String.raw`مولد التاكو الحثي: ملف مجال على مصدر ثابت الجهد والتردد، وملف توليد متعامد معه بزاوية تسعين درجة كهربائية، ودوار قفص سنجابي أو كأس نحاسي رفيع (الشكل ٢-٣).`,
   String.raw`عند السكون يعمل كمحول، ومحصلة الفيض \(\phi_f\) متعامدة مع ملف التوليد فلا يتولد عليه جهد.`,
   String.raw`عند الدوران، المعادلة (٢-٩): \(E_{rot}=K\omega\phi_f\)، فيظهر \(\phi_g\) على محور ملف التوليد ويكون \(E_a=K_g\omega\) بنفس تردد ملف المجال.`,
   String.raw`بالدائرة المكافئة، المعادلة (٢-١٣): \(E_a=j\,0.5\,n\,I_1(Z_f-Z_b)\)؛ عند \(s=1\) يكون \(Z_f=Z_b\) و \(E_a=0\).`]}
],
 theory:[
  {h:'٢-٣ مولدات التاكو الحثية (Induction Tacho-Generators)',ref:'ص 36',html:`<p>«جميع أنظمة التحكم غالبًا ما تحتوي على مولد حثي لقياس السرعة الزاوية، وتوليد إشارة كهربائية متناسبة مع السرعة، يتكون مولد التاكو الحثي من <b>ملفين</b>، بينهما <b>زاوية مقدارها تسعون درجة كهربائية</b>، على عضوه الثابت، أحد الملفين يُوصل مع مصدر ثابت الجهد والتردد ويسمى <b>ملف الجهد أو ملف المجال <span class="ltr">(Field winding)</span></b> بينما يتولد جهد على الملف الآخر ويسمى <b>ملف التوليد <span class="ltr">(Generating winding)</span></b>.»</p>
   <p>«العضو الدائر ذو <b>قفص سنجابي</b> ويفضل أن يكون على شكل <b>كأس رفيع من النحاس <span class="ltr">(Drag-Cup Rotor)</span></b> للحفاظ على أصغر قصور ذاتي وأصغر ثابت زمن ميكانيكي للدوار للوصول لسرعة لحالة الاستقرار، وهي من أهم متطلبات نظم التحكم، الشكل (٢-٣) يبين رسمًا توضيحيًا لمولد تاكو حثي.»</p>`},
  {fig:'(٢-٣)',ref:'ص 36',caption:'رسم توضيحي لمولد تاكو حثي: ملف التوليد a (رأسي) وملف المجال m (أفقي) على العضو الثابت، والدوار',draw:()=>`<div class="svgbox" style="max-width:340px;margin-inline:auto">${indSVG({})}</div>`},
  {h:'٢-٣-١ نظرية عمل التاكومترات الحثية — عند السكون',ref:'ص 37',html:`<p>«لشرح نظرية عمل مولدات التاكو الحثية، نفترض أن ملف المجال موصل مع مصدر جهد ثابت القيمة والتردد وأن ملف التوليد مفتوح. <b>عند سكون العضو الدوار، يمكن اعتبار مولد التاكو عبارة عن محول</b>، ملفه الابتدائي هو ملف المجال وملفه الثانوي مقصور على نفسه، ممثلًا في أسطوانة العضو الدوار.»</p>
   <p>«الفيض المغناطيسي الثابت الناتج عن ملف المجال يقطع العضو الدوار فيولد به جهدًا كما في المحولات ويسمى <b>بجهد التحويل</b>. جهد التحويل المتولد في ملفات العضو الدوار يتسبب في توليد تيار وفيض مغناطيسي يعاكس الفيض الأصلي لملف المجال طبقًا لقاعدة لنز، المحصلة الكلية للفيض المغناطيسي (\\(\\phi_f\\)) هي الفرق بين المجالين وفي نفس اتجاه الفيض الأصلي لملف المجال وبنفس التردد. محصلة الفيض المغناطيسي (\\(\\phi_f\\)) <b>لا تولد أي جهد في ملف التوليد لأنها متعامدة معه</b>.»</p>`},
  {h:'عند الدوران',ref:'ص 37',html:`<p>«عند دوران العضو الدوار بسرعة مقدارها \\(\\omega\\) يتولد <b>جهد دوراني</b> في العضو الدوار (\\(E_{rot}\\))، نتيجة لدوران الدوار في محصلة الفيض (\\(\\phi_f\\)) السابق ذكرها، يتناسب مع سرعة الدوران \\(\\omega\\) وله نفس تردد جهد ملف المجال ويكون متعامدًا مع اتجاه الفيض المغناطيسي (\\(\\phi_f\\)) المسبب له، بينما يبقى جهد التحويل كما هو.»</p>
   $$E_{rot} = K\\cdot\\omega\\cdot\\phi_f \\qquad (٢-٩)$$
   <p>«الجهد الدوراني (\\(E_{rot}\\)) المتولد في العضو الدوار، ينتج تيارًا وفيضًا مغناطيسيًا (\\(\\phi_g\\)) في اتجاه محور ملف التوليد، الفيض المغناطيسي الناتج (\\(\\phi_g\\)) يولد جهدًا \\(E_a\\) في ملف التوليد، الجهد المتولد \\(E_a\\) يكون متناسبًا مع سرعة دوران العضو الدوار وله نفس تردد ملف المجال.»</p>
   $$E_{rot}\\ \\text{directly proportional to}\\ \\omega$$ $$\\phi_g\\ \\text{directly proportional to}\\ E_{rot}$$ $$\\text{therefore}\\ \\phi_g\\ \\text{is directly proportional to}\\ \\omega$$ $$\\phi_g = \\text{const.}\\times\\omega$$ $$E_a = \\text{const.}\\times\\phi_g$$ $$E_a = K_g\\times\\omega$$`},
  {html:`<p>«حيث إن ملف التوليد موصل مع معاوقة خارجية كبيرة جدًا، فيمكننا اعتباره مفتوح الدائرة ويتولد على أطرافه جهد، في الحالة المثالية لمولد التاكو الحثي يكون الجهد المتولد متناسبًا تناسبًا طرديًا مع سرعة دوران الدوار ويصنع زاوية ثابتة مع جهد المصدر. يجب توخي الدقة عند تصميم وتركيب مولدات التاكو الحثية بحيث يكون ملف المجال وملف التوليد <b>متعامدين في الفراغ بشكل دقيق</b>، حتى لا يتولد أي جهد في ملف التوليد في حالة سكون الدوار نتيجة للمجال المغناطيسي المتسرب من ملف الجهد.» <span class="ref">ص 38</span></p>`},
  {h:'الحساب بالدائرة المكافئة للمحرك أحادي الوجه',ref:'ص 38',html:`<p>«مما سبق شرحه عن تركيب مولد التاكو الحثي، يتضح أنه يمكن اعتباره <b>مكافئًا لمحرك حثي أحادي الوجه</b> ملفه الرئيسي موصل مع مصدر ثابت الجهد والتردد وملفه المساعد مفتوح، إذًا يمكن استخدام الدائرة المكافئة للمحرك أحادي الوجه لحساب الجهد المتولد على الملف المساعد (أو ملف التوليد في حالة التاكومترات الحثية). حيث إن الجهود على كل من (\\(0.5Z_f,\\ 0.5Z_b\\)) هي الجهود المتولدة في الملف الرئيسي بواسطة المجال الأمامي والمجال الخلفي على الترتيب، نفس هذه المجالات الدوارة ستولد جهودًا أيضًا في الملف المساعد. إذا افترضنا أن (\\(n\\)) تمثل النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي، فإن الجهد المتولد على الملف المساعد يساوي الجهد المتولد على الملف الرئيسي مضروبًا في المعامل (\\(n\\))، وحيث إن (\\(E_{af}\\)) يسبق (\\(E_{mf}\\)) بتسعين درجة، إذًا:»</p>
   $$E_{af} = j\\,n\\,E_{mf} = j\\,n\\,I_1\\cdot(0.5Z_f) \\qquad (٢-١٠)$$ $$\\text{where }\\ n=\\frac{N_a}{N_m}$$
   <p>«وأن (\\(E_{ab}\\)) يتأخر عن (\\(E_{mb}\\)) بتسعين درجة، إذًا:»</p>
   $$E_{ab} = -j\\,n\\,E_{mb} = -j\\,n\\,I_1\\cdot(0.5Z_b) \\qquad (٢-١١)$$
   <p>«الجهد الكلي المتولد على الملف المساعد»</p>
   $$\\bar{E}_a = \\bar{E}_{af} + \\bar{E}_{ab} \\qquad (٢-١٢)$$ $$\\quad = j\\,0.5\\times n\\,I_1\\cdot(Z_f - Z_b) \\qquad (٢-١٣)$$
   <ul><li>\\(E_{af},\\ E_{ab}\\): الجهد المتولد في الملف المساعد (التوليد) بالمجال الأمامي / الخلفي، و \\(E_{mf},\\ E_{mb}\\): نظيراهما في الملف الرئيسي.</li><li>\\(I_1\\): تيار الدخل (الملف الرئيسي)، و \\(Z_f,\\ Z_b\\): معاوقة المجال الأمامي والخلفي، و \\(N_a,\\ N_m\\): عدد لفات الملف المساعد والرئيسي.</li></ul>
   <p>«<b>عند بدء الحركة (\\(s=1\\)) فإن (\\(Z_f=Z_b\\)) و (\\(E_a=0\\))</b>»</p>
   <p>«الجهد المتولد على ملف التوليد (\\(E_a\\)) يعتمد على الفرق بين قيمتي \\(Z_f\\) و \\(Z_b\\) فإذا تساوت القيمتان تلاشى الجهد المتولد، وكلما ازدادت السرعة وقلت قيمة الانزلاق، تزداد قيمة \\(Z_f\\) وتقل قيمة \\(Z_b\\) فيزداد الفرق بين القيمتين، ويزداد الجهد المتولد على ملف التوليد بما يتناسب مع الزيادة في السرعة تناسبًا طرديًا.» <span class="ref">ص 39</span></p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الانزلاق \\(s=(n_s-n)/n_s\\): عند السكون \\(s=1\\)، وكلما زادت السرعة قل s. و \\(Z_f\\) معاوقة يحسبها الكتاب بالانزلاق s، و \\(Z_b\\) بالانزلاق \\(2-s\\)؛ لذلك يتساويان عند السكون فقط. في المختبر ترى الرقمين يتغيران مع السرعة.'},
  {h:'مثال الكتاب ٢-٤',ref:'ص 39',html:'<p>محرك أحادي الوجه يُستعمل مولد تاكو حثياً: معطى \\(I_1\\) و \\(Z_f\\) و \\(Z_b\\) و n، والمطلوب الجهد على الملف المساعد وزاوية طوره. الحل بالأعداد المركبة في تبويب «الأمثلة المحلولة».</p>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في مثال ٢-٤ ص 39 أعطى الكتاب الانزلاق <span class="ltr">S = 0.05</span> لكنه لا يُستعمل في الحل (لأن Z<sub>f</sub> و Z<sub>b</sub> معطاتان عند هذا الانزلاق). والناتج <span class="ltr">69.65 V</span> جاء من تقريب <span class="ltr">|Z<sub>f</sub> − Z<sub>b</sub>| = 48.507</span> إلى <span class="ltr">48.5</span>؛ بلا تقريب يكون <span class="ltr">69.66 V</span>. والزاوية <span class="ltr">90.22°</span> محسوبة من زاوية I<sub>1</sub> المرجعية، بينما يقول النص «مع جهد الملف الرئيسي».'+'</div>'}
 ],
 lab:(el)=>{
  let nr=0,dir=1,ratio=0.8,mis=0,t=0,ang=0,lastS='',rev=0;
  el.innerHTML=`<div id="l4tp"></div><div class="grid">
   <div class="panel c5"><h2>المولد الحثي <small>مبنية على الشكل (٢-٣) ص 36</small></h2>
    <div class="svgbox" id="l4s" style="max-width:340px;margin-inline:auto"></div>
    <p class="sub">السهم الأزرق <span class="ltr">φ<sub>f</sub></span> على محور ملف المجال m، والبرتقالي <span class="ltr">φ<sub>g</sub></span> على محور ملف التوليد a. الأسهم والدوران مبطّأة جداً للرؤية.</p></div>
   <div class="panel c7"><h2>التحكم والقراءات</h2>
    ${sl('l4n','سرعة الدوار <span class="ltr">n</span>',0,2700,10,nr)}
    <div class="tk-row"><span>اتجاه الدوران:</span>${segHTML('dir',[[1,'⟳ أمامي'],[-1,'⟲ عكسي']],1)}</div>
    ${sl('l4r','نسبة اللفات <span class="ltr">n = N<sub>a</sub>/N<sub>m</sub></span>',0.5,1.2,0.05,ratio)}
    ${sl('l4m','خطأ في تعامد الملفين <span class="ltr">δ</span> (توضيحي)',0,5,0.1,mis)}
    <div class="facts">${fact('الانزلاق s','l4s1')}${fact('|Z<sub>f</sub>|','l4zf')}${fact('|Z<sub>b</sub>|','l4zb')}${fact('|Z<sub>f</sub> − Z<sub>b</sub>|','l4dz')}${fact('E<sub>a</sub> (فعّال)','l4ea')}${fact('زاوية E<sub>a</sub> عن جهد المصدر','l4ph')}${fact('تردد E<sub>a</sub>','l4f')}${fact('Δβ (تغيّر الزاوية)','l4db')}</div>
    <div id="l4msg" class="tk-msg"></div></div>
   <div class="panel c6"><h2>راسم الإشارة: جهد المصدر وجهد ملف التوليد</h2><div class="tk-chart"><canvas id="l4o"></canvas></div>
    ${legend([['--muted','جهد ملف المجال (المصدر <span class="ltr l4vT">115 V</span>، 50 Hz)',1],['--live','الجهد على ملف التوليد a']])}</div>
   <div class="panel c6"><h2><span><bdi dir="ltr">E<sub>a</sub></bdi> مع السرعة من (٢-١٣)</span></h2><div class="tk-chart"><canvas id="l4p"></canvas></div>
    ${legend([['--live','<span class="ltr">|E<sub>a</sub>|</span> من الدائرة المكافئة'],['--blue','خط مستقيم مثالي <span class="ltr">E<sub>a</sub> = K<sub>g</sub>ω</span>',1]])}
    <p class="sub">ثوابت الدائرة المكافئة <b id="l4tpw">أرقام توضيحية</b>: <span class="ltr" id="l4cT"></span>. المحور الرأسي في الرسمين يتكبر تلقائياً مع القيم.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  $('#l4n').oninput=e=>{nr=+e.target.value};$('#l4r').oninput=e=>{ratio=+e.target.value};$('#l4m').oninput=e=>{mis=+e.target.value};
  el.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{dir=+b.dataset.dir;if(dir<0&&nr>200)rev=1;el.querySelectorAll('[data-dir]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  const E0=cabs(indModel(2700,1.2).Ea);  // أكبر جهد بالقيم التوضيحية (لتكبير المحاور تلقائياً)
  let PI4=Object.assign({},IND),refPh=0;
  const TP=B.params($('#l4tp'),'u2-l4',[
   {k:'V',label:'جهد مصدر ملف المجال',unit:'V',value:115,min:1,max:1000,step:1},
   {k:'R1',label:'مقاومة ملف المجال R<sub>1</sub>',unit:'Ω',value:30,min:0,max:1000,step:0.1},
   {k:'X1',label:'ممانعة تسرب ملف المجال X<sub>1</sub>',unit:'Ω',value:25,min:0,max:1000,step:0.1},
   {k:'Xm',label:'ممانعة المغنطة X<sub>m</sub>',unit:'Ω',value:250,min:1,max:10000,step:1},
   {k:'R2',label:'مقاومة الدوار (الكأس) R<sub>2</sub>',unit:'Ω',value:200,min:1,max:10000,step:1},
   {k:'X2',label:'ممانعة تسرب الدوار X<sub>2</sub>',unit:'Ω',value:25,min:0,max:1000,step:0.1}],()=>{upd4();lastS=''});
  function upd4(){PI4=Object.assign({},IND,TP.v);refPh=cang(indModel(100,1,PI4).Ea);  // reference phase at low speed (forward)
   const q=TP.v;el.querySelectorAll('.l4vT').forEach(x=>x.textContent=fm(q.V)+' V');$('#l4tpw').textContent=TP.trainer?'من قيم المدرب':'أرقام توضيحية';
   $('#l4cT').innerHTML=`V = ${fm(q.V)} V, 50 Hz, 2 poles (n<sub>s</sub> = 3000 rpm), R<sub>1</sub> = ${fm(q.R1)}, X<sub>1</sub> = ${fm(q.X1)}, X<sub>m</sub> = ${fm(q.Xm)}, R<sub>2</sub> = ${fm(q.R2)}, X<sub>2</sub> = ${fm(q.X2)} Ω`}
  upd4();
  const steps=stepsUI($('#l4st'),[
   {t:'السكون = محول',x:'اجعل السرعة صفراً و δ = 0. يوجد فيض <span class="ltr">φ<sub>f</sub></span> متردد على محور ملف المجال، لكن الجهد على ملف التوليد صفر لأنه متعامد مع الفيض. لاحظ أن <span class="ltr">Z<sub>f</sub> = Z<sub>b</sub></span> عند <span class="ltr">s = 1</span>.',done:()=>nr===0&&mis===0},
   {t:'ابدأ الدوران',x:'ارفع السرعة إلى نحو <span class="ltr">1000 rpm</span>: يظهر <span class="ltr">φ<sub>g</sub></span> على محور ملف التوليد، ويظهر على راسم الإشارة جهد <b>بنفس تردد المصدر 50 Hz</b>.',done:()=>Math.abs(nr-1000)<40},
   {t:'ضاعف السرعة',x:'ارفعها إلى نحو <span class="ltr">2000 rpm</span>: تتضاعف سعة الجهد تقريباً، والتردد يبقى 50 Hz. لاحظ أن <span class="ltr">|Z<sub>f</sub>|</span> زاد و <span class="ltr">|Z<sub>b</sub>|</span> نقص.',done:()=>Math.abs(nr-2000)<40},
   {t:'اعكس الاتجاه',x:'اختر «⟲ عكسي» والسرعة فوق 200 rpm: السعة نفسها لكن الجهد ينقلب <b>180°</b> في الطور (توضيح من المعادلة ٢-١٣، ليس من نص الكتاب).',done:()=>rev},
   {t:'خطأ التعامد',x:'أوقف الدوار (سرعة صفر) واجعل δ أكبر من <span class="ltr">2°</span>: يظهر جهد على ملف التوليد رغم السكون، وهذا ما يحذر منه الكتاب ص 38.',done:()=>nr===0&&mis>2},
   {t:'زاوية الطور',x:'أعد δ = 0 وحرّك السرعة من الصغيرة إلى الكبيرة وراقب «Δβ»: في هذا النموذج تتغير زاوية الخرج قليلاً مع السرعة، وهذا هو خطأ زاوية الوجه من متطلبات الدرس 2.1.'}
  ],()=>({}));
  /* أعطال مخفية: mis الملفان غير متعامدين (زاوية إضافية)، gopen ملف التوليد مقطوع، grev أطراف ملف التوليد معكوسة */
  loopOn(el,dt=>{t+=dt;const sp=nr*dir,m=indModel(sp,ratio,PI4);const res=cmul(Cx(ratio*Math.sin((mis+(chF('mis')?2:0))*PI/180)),Cx(PI4.V));let Et=cadd(m.Ea,res);if(chF('grev'))Et=Cx(-Et.re,-Et.im);if(chF('gopen'))Et=Cx(0);
   const Em=cabs(Et),ph=Em>1e-6?wrap180(cang(Et)):0;
   ang=(ang+sp/60*360*dt/60)%360;const vis=Math.cos(2*PI*1.0*t);
   $('#l4n-v').textContent=nr+' rpm';$('#l4r-v').textContent=fm(ratio,2);$('#l4m-v').textContent=fm(mis,1)+'°';
   const maxE=cabs(indModel(2700,1.2,PI4).Ea);
   $('#l4s').innerHTML=indSVG({ang,arrows:1,pf:0.85*vis,pg:clamp(Em/maxE,0,1)*0.95*Math.cos(2*PI*t+ph*PI/180),mis:mis*4});
   const sg=[nr,dir,ratio,mis].join();
   if(sg!==lastS){lastS=sg;
    $('#l4s1').textContent=fm(m.s,3);$('#l4zf').textContent=fm(cabs(m.Zf),1)+' Ω';$('#l4zb').textContent=fm(cabs(m.Zb),1)+' Ω';$('#l4dz').textContent=fm(cabs(csub(m.Zf,m.Zb)),1)+' Ω';
    $('#l4ea').textContent=fm(Em,2)+' V';$('#l4ph').textContent=Em>0.005?fm(ph,1)+'°':'—';$('#l4f').textContent=Em>0.005?'50 Hz':'—';
    $('#l4db').textContent=Em>0.005&&mis===0?fm(wrap180(ph-refPh-(dir<0?180:0)),2)+'°':'—';
    $('#l4msg').innerHTML=nr===0&&mis===0?'<div class="callout">الدوار ساكن: مولد التاكو «محول» ثانويه مقصور (الكأس)، والفيض المحصل <span class="ltr">φ<sub>f</sub></span> متعامد مع ملف التوليد فلا يتولد عليه جهد: <span class="ltr">E<sub>a</sub> = 0</span>.</div>':
     nr===0&&mis>0?`<div class="callout err">الملفان غير متعامدين بدقة: يصل جزء من فيض ملف المجال إلى ملف التوليد فيظهر جهد <span class="ltr">${fm(Em,2)} V</span> والدوار ساكن! (${TP.trainer?'من قيم المدرب':'الرقم توضيحي'})</div>`:'';
    B.math($('#l4msg'));
    const ns=[];for(let i=0;i<=54;i++)ns.push(i*50);const kL=cabs(indModel(100,ratio,PI4).Ea)/100;
    const yE=maxE===E0?70:70*maxE/Math.max(E0,1e-9);   // بالقيم التوضيحية 70 V تماماً
    plot($('#l4p'),{xmax:2700,ymax:yE,xlabel:'n (rpm)',ylabel:'|Ea| (V)',series:[{pts:[[0,0],[2700,kL*2700]],color:'--blue',dash:[6,4],width:2},{pts:ns.map(x=>[x,cabs(indModel(x,ratio,PI4).Ea)]),color:'--live'}],points:[{x:nr,y:cabs(m.Ea),color:'--live'}]});
   }
   const pts1=[],pts2=[],T=0.04;for(let i=0;i<=160;i++){const tt=i/160*T,w=2*PI*50*tt;pts1.push([tt*1000,PI4.V*Math.SQRT2*Math.sin(w)]);pts2.push([tt*1000,Em*Math.SQRT2*Math.sin(w+ph*PI/180)])}
   const yO=PI4.V===IND.V&&Em*Math.SQRT2<=180?180:60*Math.ceil(Math.max(PI4.V,Em)*Math.SQRT2*1.05/60);   // بالقيم التوضيحية ±180 V
   plot($('#l4o'),{xmax:40,ymin:-yO,ymax:yO,ystep:yO/3,xlabel:'t (ms)',ylabel:'v (V)',series:[{pts:pts1,color:'--muted',dash:[5,4],width:2},{pts:pts2,color:'--live'}]});
   steps.check()});
 },
 examples:[
  {title:'مثال ٢-٤',ref:'ص 39',
   q:'<p>«إذا استخدم المحرك أحادي الوجه كمولد تاكو حثي لقياس السرعة، حيث إن تيار الدخل ومعاوقة المجال الأمامي والخلفي كالتالي: <span class="ltr">I<sub>1</sub> = 3.59∠−51.7</span> ، <span class="ltr">Z<sub>f</sub> = 31.9 + j40.3</span> ، <span class="ltr">Z<sub>b</sub> = 1.98 + j2.12</span>. احسب الجهد المتولد على الملفات المساعدة وزاوية طوره مع جهد الملف الرئيسي عند انزلاق <span class="ltr">S = 0.05</span>. إذا كانت النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي <span class="ltr">n = 0.8</span>.»</p>',
   given:[{id:'I1m',label:'مقدار تيار الدخل',sym:'|I_1|',unit:'A',value:3.59},{id:'I1a',label:'زاوية تيار الدخل',sym:'\\angle I_1',unit:'°',value:-51.7},
    {id:'Rf',label:'الجزء الحقيقي لـ Z_f',sym:'R_f',unit:'Ω',value:31.9},{id:'Xf',label:'الجزء التخيلي لـ Z_f',sym:'X_f',unit:'Ω',value:40.3},
    {id:'Rb',label:'الجزء الحقيقي لـ Z_b',sym:'R_b',unit:'Ω',value:1.98},{id:'Xb',label:'الجزء التخيلي لـ Z_b',sym:'X_b',unit:'Ω',value:2.12},
    {id:'n',label:'نسبة اللفات',sym:'n',unit:'',value:0.8},{id:'s',label:'الانزلاق (لا يدخل في الحل)',sym:'S',unit:'',value:0.05}],
   solve:(g,B,isBook)=>solveInd(g,isBook,{final:'الجهد المتولد على الملف المساعد:',say:(m,a)=>`«الجهد المتولد في الملف المساعد ${lt(m)} ومتقدم عن جهد الملف الرئيسي بزاوية مقدارها ${lt(a+'°')}»`}),
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> الانزلاق <span class="ltr">S = 0.05</span> معطى ولا يُستعمل (Z<sub>f</sub> و Z<sub>b</sub> محسوبتان عنده مسبقاً). والناتج <span class="ltr">69.65</span> سببه تقريب <span class="ltr">48.507</span> إلى <span class="ltr">48.5</span>؛ بلا تقريب يكون <span class="ltr">69.66 V</span> (السطر الأخير). </span>الزاوية <span class="ltr">90.22°</span> مقيسة من زاوية I<sub>1</sub> المرجعية.'}
 ],
 quiz:[
  {q:'الزاوية بين ملفي مولد التاكو الحثي:',o:['45 درجة كهربائية','90 درجة كهربائية','120 درجة كهربائية','180 درجة كهربائية'],c:1,e:'ص 36: بينهما زاوية مقدارها تسعون درجة كهربائية.'},
  {q:'ملف المجال في مولد التاكو الحثي يوصل مع:',o:['مصدر ثابت الجهد والتردد','الفولتميتر','بطارية','لا يوصل بشيء'],c:0,e:'ص 36. والملف الآخر (التوليد) يتولد عليه الجهد.'},
  {q:'لماذا يفضل أن يكون الدوار كأساً رفيعاً من النحاس (Drag-Cup)؟',o:['لزيادة الجهد','لأصغر قصور ذاتي وأصغر ثابت زمن ميكانيكي','لتقليل التردد','لأنه أرخص'],c:1,e:'ص 36.'},
  {q:'عند سكون الدوار، الجهد على ملف التوليد يساوي صفراً لأن:',o:['المصدر مفصول','محصلة الفيض φ<sub>f</sub> متعامدة مع ملف التوليد','الدوار مقصور','التردد صفر'],c:1,e:'ص 37: محصلة الفيض لا تولد أي جهد في ملف التوليد لأنها متعامدة معه.'},
  {q:'تردد الجهد المتولد E<sub>a</sub> على ملف التوليد:',o:['يتناسب مع السرعة','نفس تردد ملف المجال','ضعف تردد المصدر','صفر'],c:1,e:'ص 37: له نفس تردد ملف المجال، وقيمته تتناسب مع السرعة.'},
  {q:'عند بدء الحركة (s = 1):',o:['Z<sub>f</sub> &gt; Z<sub>b</sub>','Z<sub>f</sub> = Z<sub>b</sub> و E<sub>a</sub> = 0','E<sub>a</sub> أكبر ما يمكن','Z<sub>b</sub> = 0'],c:1,e:'ص 38.'},
  {q:'لماذا يجب أن يكون الملفان متعامدين في الفراغ بدقة؟',o:['حتى لا يتولد جهد في ملف التوليد عند السكون بسبب الفيض المتسرب','لزيادة السرعة','لتقليل التيار','لعكس الاتجاه'],c:0,e:'ص 38.'},
  {q:'في مثال ٢-٤ الجهد المتولد على الملف المساعد:',o:['48.5∠51.92° V','1.436∠−51.7° V','69.65∠90.22° V','3.59∠−51.7° V'],c:2,e:'1.436 × 48.5 = 69.65، والزاوية −51.7 + 51.92 + 90 = 90.22°.'}
 ]
});

/* ============================== Lesson 2.5 ============================== */
B.lesson({
 id:'u2-l5',unit:2,order:5,pages:'40',
 title:'مولد التاكو التزامني ومعايرة التاكومترات',
 summary:'المولد التزامني الصغير بمغناطيس دائم على الدوار: الجهد والتردد يزدادان معاً مع السرعة، والقياس بالتردد أدق. ثم معايرة التاكومتر بمقارنته بالإستروبوسكوب وتصحيح ثابت توليد الجهد.',
 stations:[
  {intro:true},

  {st:1,short:'التاكو التزامني',title:'٢-٤ مولدات التاكو التزامنية (Synchronous Tacho-generators)',ref:'ص 40',
   q:'إذا كان الجهد والتردد يزدادان معاً مع السرعة… فأيهما نقيس لنعرف السرعة بدقة أكبر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد تاكو تزامني: مغناطيس دائم على العضو الدوار داخل ملف العضو الثابت، وأطراف الملف تعطي جهداً متردداً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="العضو الثابت: عليه ملف أحادي الوجه (كما هنا) أو ملفات ثلاثية متماثلة."><circle cx="180" cy="150" r="112" fill="none" stroke="#2C4A40" stroke-width="12"/></g><g data-tip="ملف العضو الثابت: يتولد فيه جهد متردد يتناسب مع سرعة الدوران في القيمة والتردد."><rect x="152" y="44" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="152" y="228" width="56" height="28" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="العضو الدوار: مغناطيس دائم يصنع المجال المغناطيسي، فلا يحتاج المولد ملف مجال ولا فرشاً."><circle cx="180" cy="150" r="54" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><g class="spin spin-r"><rect x="164" y="104" width="32" height="46" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="164" y="150" width="32" height="46" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="180" y="133" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700">N</text><text x="180" y="180" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">S</text></g></g><path d="M196 44 V30 H262" stroke="#2C4A40" stroke-width="2.5" fill="none"/><g data-tip="الجهد على أطراف الملف: متردد. عند زيادة السرعة تزيد قيمته ويزيد تردده معاً بنفس المعدل."><rect x="262" y="10" width="86" height="42" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M270 31 C276 15 282 15 287 31 S298 47 304 31 S315 15 321 31 S332 47 340 31" fill="none" stroke="#E8735A" stroke-width="2.5"/></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الجهد والتردد يزدادان معاً مع السرعة</text></svg>`,
   cap:'المغناطيس الدائم يدور داخل ملف العضو الثابت، فيتولد على الملف جهد متردد.<br><b>مرّر المؤشر على المغناطيس والملف والشاشة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>هي عبارة عن مولدات تزامنية صغيرة الحجم، يتم الحصول على المجال المغناطيسي بواسطة <b>مغناطيسات دائمة على العضو الدوار</b>، العضو الثابت يتكون من <b>ملف أحادي الوجه أو من ملفات ثلاثية متماثلة</b>.</p>`,ref:'ص 40'},
    {predict:{q:'ما الفرق الأساسي بين الجهد الخارج من التاكو التزامني والجهد الخارج من التاكو الحثي (الدرس 2.4) عند زيادة السرعة؟',opts:[
     ['في التزامني يزداد التردد مع السرعة، وفي الحثي يبقى التردد مساوياً لتردد ملف المجال',true,'التزامني: «يزداد الجهد والتردد معًا بنفس المعدل» (ص 40). الحثي: الجهد «له نفس تردد ملف المجال» (ص 37).'],
     ['لا فرق، كلاهما يعطي جهداً مستمراً',false,'كلاهما يعطي جهداً متردداً؛ الجهد المستمر من تاكو التيار المستمر.'],
     ['في التزامني يبقى الجهد ثابتاً ويتغير التردد فقط',false,'قيمة الجهد في التزامني تتناسب مع السرعة أيضاً، لا تبقى ثابتة.']]}}
   ],
   body:[
    {book:String.raw`<p>عند دوران العضو الدوار يتولد جهد متردد في الملف الثابت يتناسب مع سرعة الدوران في القيمة والتردد، يزداد الجهد والتردد معًا بنفس المعدل مع ازدياد سرعة الدوار. فيمكن قياس السرعة، إما بقياس قيمة الجهد المتولد أو بقياس تردد هذا الجهد. <b>قياس السرعة بواسطة قياس التردد يكون عادة أكثر دقة</b>، وسبب ذلك، أن التردد لا يتأثر بتغير ممانعة الدائرة المغناطيسية أو كثافة المجال المغناطيسي، ولا يتأثر أيضًا بتغير الحمل أو تأثيرات درجة الحرارة.</p>`,ref:'ص 40'},
    {title:'ماذا يغيّر ماذا؟',widget:(el,B)=>{
      const C=[['زادت السرعة','يزداد','يزداد'],['تغيّر الحمل','قد يتغير','لا يتأثر'],['تغيّرت درجة الحرارة','قد يتغير','لا يتأثر'],['ضعُف المغناطيس (كثافة المجال)','قد يتغير','لا يتأثر'],['تغيّرت ممانعة الدائرة المغناطيسية','قد يتغير','لا يتأثر']];
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">اختر ما تغيّر، وانظر أثره في قيمة الجهد وفي تردده.</p><div class="w-row" style="margin-top:0">${C.map((c,i)=>`<button class="btn" type="button" data-i="${i}" aria-pressed="false">${c[0]}</button>`).join('')}</div>
       <div class="w-facts" style="grid-template-columns:1fr 1fr"><div><span>قيمة الجهد</span><b data-o="v" style="font-family:var(--font);direction:rtl;text-align:start;font-size:15px">—</b></div><div><span>تردد الجهد</span><b data-o="f" style="font-family:var(--font);direction:rtl;text-align:start;font-size:15px">—</b></div></div><p class="sub" data-o="m" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const c=C[+b.dataset.i];el.querySelectorAll('[data-i]').forEach(x=>x.setAttribute('aria-pressed',x===b));
        o('v').textContent=c[1];o('f').textContent=c[2];o('f').style.color=c[2]==='لا يتأثر'?'var(--on)':'';
        o('m').textContent=+b.dataset.i===0?'السرعة وحدها تغيّر التردد؛ لذلك التردد مقياس «نظيف» للسرعة.':'التردد لم يتأثر (نص الكتاب)، أما قيمة الجهد فقد تتغير مع أن السرعة ثابتة، فتعطي قراءة سرعة خاطئة إذا قسنا بالجهد.'});
    }},
    {tip:String.raw`<p>التردد يحدده عدد مرات مرور أقطاب المغناطيس أمام الملف في الثانية فقط، أي السرعة وعدد الأقطاب: \(f=\dfrac{p\,n}{60}\) حيث \(p\) عدد أزواج الأقطاب و \(n\) بالدورة في الدقيقة. لا يدخل في ذلك قوة المغناطيس ولا الحمل ولا الحرارة. أما قيمة الجهد فتعتمد على قوة المجال وعلى الحمل أيضاً، فتتغير معها.</p>`,title:'لماذا التردد أدق؟'},
    {watch:String.raw`<p>لا تخلط بين النوعين المترددين: في <b>التزامني</b> نقرأ السرعة من التردد (أو الجهد)، وفي <b>الحثي</b> التردد ثابت ولا نقرأ السرعة إلا من مقدار الجهد.</p>`}
   ]},

  {st:2,short:'المعايرة',title:'٢-٥ معايرة التاكومترات',ref:'ص 40',
   q:'تاكومتر يعمل منذ سنوات… كيف تتأكد أن ما يقرؤه ما زال صحيحاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قرص على العمود عليه علامة، يضيئه إستروبوسكوب بومضات، والتاكومتر على العمود نفسه لمقارنة القراءتين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="ضوء الومضات: يضيء القرص لحظة قصيرة في كل ومضة. إذا كان عدد الومضات في الدقيقة مساوياً لعدد الدورات في الدقيقة تظهر العلامة ثابتة في مكانها."><polygon points="268,78 120,112 140,250" fill="#F2C14E" opacity=".35"/></g><g data-tip="قرص على العمود الذي نقيس سرعته، وعليه علامة واضحة."><circle cx="130" cy="180" r="70" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><line x1="130" y1="180" x2="130" y2="116" stroke="#FBF6EE" stroke-width="7" stroke-linecap="round"/><circle cx="130" cy="180" r="9" fill="#2C4A40"/></g><g data-tip="الإستروبوسكوب: وسيلة دقيقة لقياس السرعة، مصباح يومض بعدد ومضات نختاره ونقرؤه منه."><rect x="262" y="52" width="70" height="48" rx="10" fill="#2C4A40"/><circle cx="270" cy="76" r="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/></g><text x="297" y="124" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الإستروبوسكوب</text><g data-tip="التاكومتر المراد معايرته: نقارن قراءته بقراءة الإستروبوسكوب، ونصحح ثابت توليد الجهد ⟦Kg⟧ إذا لزم."><rect x="246" y="206" width="86" height="54" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="289" y="240" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">TG</text></g><text x="289" y="280" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">التاكومتر</text><path d="M200 180 H246" stroke="#8A9A94" stroke-width="8"/><text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">نقارن القراءتين ونصحح</text></svg>`,
   cap:'المعايرة: نقيس السرعة نفسها بوسيلة أدق (الإستروبوسكوب) ونقارنها بقراءة التاكومتر.<br><b>مرّر المؤشر على القرص والمصباح والضوء والتاكومتر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>حيث إن التاكومترات تعتبر من أجهزة القياس، فيجب الحرص على دقة قياس السرعة بواسطتها، ذلك يستلزم <b>معايرتها كل فترة زمنية محددة</b> للتأكد من صحة قراءة السرعة المقاسة بواسطتها. ذلك يتحقق بمقارنة نتائجها مع نتائج وسيلة أخرى دقيقة لقياس السرعة، مثل <b>الإستروبوسكوب</b>، وتصحيح ثابت توليد الجهد كلما لزم الأمر.</p>`,ref:'ص 40'},
    {predict:{q:'التاكومتر يقرأ دائماً سرعة أقل قليلاً مما يقيسه الإستروبوسكوب. ماذا نصحح حسب الكتاب؟',opts:[
     ['نغيّر سرعة المحرك حتى تتفق القراءتان',false,'المعايرة تصحح جهاز القياس، لا الآلة التي نقيس سرعتها.'],
     ['ثابت توليد الجهد \\(K_g\\)',true,'الكتاب: «وتصحيح ثابت توليد الجهد كلما لزم الأمر». السرعة تُحسب من \\(V_a/K_g\\)، فتصحيح \\(K_g\\) يصحح القراءة.'],
     ['نستبدل الإستروبوسكوب',false,'الإستروبوسكوب هو المرجع الأدق في المعايرة، والتاكومتر هو الذي يُصحَّح.']]}}
   ],
   body:[
    {tip:String.raw`<ol><li>نضع علامة واضحة على العمود (أو على قرص مثبت عليه).</li><li>نوجّه ضوء الإستروبوسكوب نحو العلامة ونغيّر عدد الومضات في الدقيقة.</li><li>عندما يتساوى عدد الومضات في الدقيقة مع عدد الدورات في الدقيقة، تظهر العلامة <b>ثابتة</b> لأن الضوء يلتقطها في الموضع نفسه في كل دورة. نقرأ السرعة من الإستروبوسكوب.</li><li>نقارنها بقراءة التاكومتر، ونصحح ثابت توليد الجهد: \(K_g\ (\text{الجديد}) = \dfrac{V_a}{\omega_{\text{الإستروبوسكوب}}}\).</li></ol>`,title:'المعايرة خطوة خطوة'},
    {watch:String.raw`<p>العلامة تبدو ثابتة أيضاً إذا كانت الومضات نصف عدد الدورات أو ثلثها (يلتقطها الضوء كل دورتين أو ثلاث). لذلك نبدأ بعدد ومضات كبير وننزل حتى <b>أول</b> مرة تظهر فيها علامة واحدة ثابتة.</p>`},
    {predict:{q:'متى يجب معايرة التاكومتر حسب الكتاب؟',opts:[
     ['مرة واحدة فقط عند شرائه',false,'القراءة قد تتغير مع الزمن (ضعف المغناطيس، تآكل الفرش…)، لذلك لا تكفي مرة واحدة.'],
     ['عندما يتعطل فقط',false,'المعايرة تكشف الخطأ قبل أن يصبح عطلاً واضحاً.'],
     ['كل فترة زمنية محددة',true,'نص الكتاب: «يستلزم معايرتها كل فترة زمنية محددة للتأكد من صحة قراءة السرعة».']]}},
    {add:String.raw`<p>في المصانع يوجد عادة جدول معايرة لأجهزة القياس، يُسجَّل فيه تاريخ آخر معايرة لكل جهاز وتاريخ المعايرة القادمة، وتُلصق على الجهاز بطاقة بهذا التاريخ.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: رتّب خطوات المعايرة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات معايرة التاكومتر بالإستروبوسكوب بالترتيب الذي تنفذها به (الخطوات من «المعايرة خطوة خطوة» أعلاه).',steps:[
 ['ضع علامة واضحة على العمود أو على قرص مثبت عليه.','لا يمكن أن «تثبت» علامة في الضوء قبل أن توجد علامة.'],
 ['وجّه ضوء الإستروبوسكوب نحو العلامة، وابدأ بعدد ومضات كبير.','الضوء يجب أن يكون على العلامة قبل ضبط الومضات.'],
 ['أنقص عدد الومضات حتى أول مرة تظهر فيها علامة واحدة ثابتة.','لا تقرأ قبل أن تثبت العلامة؛ وابدأ من الأعلى حتى لا تخدعك الومضات التي هي نصف عدد الدورات أو ثلثه.'],
 ['اقرأ عدد الومضات في الدقيقة: هو السرعة الحقيقية بالدورة في الدقيقة.','القراءة تأتي بعد أن تثبت العلامة.'],
 ['قارن بقراءة التاكومتر، وصحّح ثابت توليد الجهد <span class="ltr">K<sub>g</sub></span> إن اختلفتا.','التصحيح هو الخطوة الأخيرة، بعد معرفة السرعة الحقيقية.']],
 done:'هذا هو معنى «مقارنة نتائجها مع نتائج وسيلة أخرى دقيقة» (ص 40).'})}
   ]},

  {recap:[
   String.raw`مولد التاكو التزامني: مغناطيسات دائمة على العضو الدوار، والعضو الثابت ملف أحادي الوجه أو ملفات ثلاثية متماثلة.`,
   String.raw`عند الدوران يتولد جهد متردد تزداد قيمته وتردده معاً بنفس المعدل مع السرعة؛ فنقيس السرعة بقيمة الجهد أو بتردده.`,
   String.raw`القياس بالتردد أدق عادة، لأن التردد لا يتأثر بممانعة الدائرة المغناطيسية ولا كثافة المجال ولا الحمل ولا الحرارة.`,
   String.raw`معايرة التاكومتر كل فترة زمنية محددة: نقارن قراءته بوسيلة دقيقة مثل الإستروبوسكوب، ونصحح ثابت توليد الجهد \(K_g\).`]}
],
 theory:[
  {h:'٢-٤ مولدات التاكو التزامنية (Synchronous Tacho-generators)',ref:'ص 40',html:`<p>«هي عبارة عن مولدات تزامنية صغيرة الحجم، يتم الحصول على المجال المغناطيسي بواسطة <b>مغناطيسات دائمة على العضو الدوار</b>، العضو الثابت يتكون من <b>ملف أحادي الوجه أو من ملفات ثلاثية متماثلة</b>.»</p>
   <p>«عند دوران العضو الدوار يتولد جهد متردد في الملف الثابت يتناسب مع سرعة الدوران في القيمة والتردد، يزداد الجهد والتردد معًا بنفس المعدل مع ازدياد سرعة الدوار. فيمكن قياس السرعة، إما بقياس قيمة الجهد المتولد أو بقياس تردد هذا الجهد. <b>قياس السرعة بواسطة قياس التردد يكون عادة أكثر دقة</b>، وسبب ذلك، أن التردد لا يتأثر بتغير ممانعة الدائرة المغناطيسية أو كثافة المجال المغناطيسي، ولا يتأثر أيضًا بتغير الحمل أو تأثيرات درجة الحرارة.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> تردد الجهد في المولد التزامني $$f=\\frac{p\\,n}{60}$$ حيث p عدد أزواج الأقطاب و n بالدورة في الدقيقة. فمغناطيس بزوج أقطاب واحد عند <span class="ltr">3000 rpm</span> يعطي <span class="ltr">50 Hz</span>. من التردد نعرف السرعة مباشرة: \\(n = 60f/p\\)، ولا يدخل في ذلك أي ثابت يتغير مع ضعف المغناطيس أو الحرارة.'},
  {h:'٢-٥ معايرة التاكومترات',ref:'ص 40',html:`<p>«حيث إن التاكومترات تعتبر من أجهزة القياس، فيجب الحرص على دقة قياس السرعة بواسطتها، ذلك يستلزم <b>معايرتها كل فترة زمنية محددة</b> للتأكد من صحة قراءة السرعة المقاسة بواسطتها. ذلك يتحقق بمقارنة نتائجها مع نتائج وسيلة أخرى دقيقة لقياس السرعة، مثل <b>الإستروبوسكوب</b>، وتصحيح ثابت توليد الجهد كلما لزم الأمر.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف يقيس الإستروبوسكوب السرعة؟</b> مصباح يومض بعدد ومضات نختاره في الدقيقة. نضع علامة على العمود. إذا كان عدد الومضات في الدقيقة = عدد الدورات في الدقيقة، تظهر العلامة <b>ثابتة</b> في مكان واحد لأن الضوء يلتقطها في نفس الموضع كل مرة. عندها نقرأ السرعة من الجهاز مباشرة. ثم نصحح ثابت التاكو: $$K_g(\\text{الجديد}) = \\frac{V_a}{\\omega_{\\text{الإستروبوسكوب}}}$$ <b>تنبيه:</b> العلامة تبدو ثابتة أيضاً إذا كانت الومضات نصف السرعة أو ثلثها؛ لذلك نبدأ بعدد ومضات كبير وننزل حتى أول مرة تظهر فيها علامة واحدة ثابتة.'}
 ],
 lab:(el)=>{
  const errs=[-0.08,-0.06,0.05,0.07],rndErr=chOn()?-0.06:errs[Math.floor(Math.random()*errs.length)];  // وضع التحدي: الفرق نفسه على كل الجوالات
  let Ks=0.02,Knom=0.1,Ktrue=Knom*(1+rndErr);  // أرقام توضيحية (تتبع «قيم المدرب» أدناه)
  let n=1500,p=1,ph3=0,fac=1,F=2000,Kuse=Knom,t=0,ang=0,lastS='',fixed=0,fixedOK=0;
  el.innerHTML=`<div id="l5tp"></div><div class="grid">
   <div class="panel c5"><h2>أ) المولد التزامني <small>مبنية على نص ص 40 (لا يوجد شكل في الكتاب)</small></h2>
    <div class="svgbox" id="l5g" style="max-width:280px;margin-inline:auto"></div>
    ${sl('l5n','سرعة العمود <span class="ltr">n</span>',0,3000,10,n)}
    <div class="tk-row"><span>أزواج الأقطاب p:</span>${segHTML('pp',[[1,'1'],[2,'2']],1)}<span>ملفات الثابت:</span>${segHTML('ph',[[0,'أحادي'],[1,'ثلاثي']],0)}</div>
    ${sl('l5f','تغيّر كثافة المجال أو الحمل أو الحرارة (توضيحي)',70,110,1,100)}</div>
   <div class="panel c7"><h2>الجهد المتولد على الثابت <small>آخر 100 ms</small></h2><div class="tk-chart"><canvas id="l5o"></canvas></div>
    <div class="facts">${fact('القيمة العظمى للجهد','l5e')}${fact('التردد f','l5fr')}${fact('السرعة من الجهد','l5nv')}${fact('السرعة من التردد','l5nf')}</div>
    <p class="sub">«السرعة من الجهد» تفترض الثابت الأصلي للمولد <span class="ltr" id="l5ksT">0.02 V/rpm</span> (<span id="l5tpw">رقم توضيحي</span>)، و«السرعة من التردد» = <span class="ltr">60f/p</span>.</p><div id="l5msg"></div></div>
   <div class="panel c7"><h2>ب) معايرة تاكو تيار مستمر بالإستروبوسكوب <small>مبنية على البند ٢-٥ ص 40</small></h2>
    <p class="sub">على نفس العمود تاكو تيار مستمر مكتوب على لوحته <span class="ltr">K<sub>g</sub> = <span id="l5knT">0.1</span> V/(rad/s)</span>، لكن ثابته الحقيقي تغيّر مع الزمن (قيمة مخفية، <span id="l5tpw2">أرقام توضيحية</span>). وُجّه الإستروبوسكوب إلى علامة على العمود.</p>
    ${sl('l5s','ومضات الإستروبوسكوب في الدقيقة',200,4000,1,F)}
    <div class="tk-row"><button class="btn" data-fd="-10">−10</button><button class="btn" data-fd="-1">−1</button><button class="btn" data-fd="1">+1</button><button class="btn" data-fd="10">+10</button><button class="btn primary" id="l5fix">صحّح ثابت توليد الجهد</button><button class="btn" id="l5undo">أعد ثابت اللوحة</button></div>
    <div class="facts">${fact('جهد التاكو V<sub>a</sub>','l5va')}${fact('K<sub>g</sub> المستعمل في القراءة','l5ku')}${fact('قراءة التاكو','l5nt')}${fact('قراءة الإستروبوسكوب','l5ns')}${fact('خطأ التاكو','l5er')}</div><div id="l5cm" class="tk-msg"></div></div>
   <div class="panel c5"><h2>العلامة تحت ضوء الإستروبوسكوب</h2><div class="svgbox" id="l5d" style="max-width:240px;margin-inline:auto"></div><p class="sub" id="l5ds" style="text-align:center"></p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l5tp'),'u2-l5',[
   {k:'Ks',label:'ثابت المولد التزامني (القيمة العظمى للجهد لكل 1 rpm)',unit:'V/rpm',value:0.02,min:0.001,max:1,step:0.001},
   {k:'Knom',label:'ثابت توليد الجهد المكتوب على لوحة تاكو التيار المستمر K<sub>g</sub>',unit:'V/(rad/s)',value:0.1,min:0.005,max:2,step:0.001},
   {k:'err',label:'فرق الثابت الحقيقي عن ثابت اللوحة',hint:'إذا تركته 0 يختار المختبر في كل مرة فرقاً عشوائياً (−8 أو −6 أو +5 أو +7 %) حتى يكتشفه المتدرب بنفسه بالمعايرة. وإذا كتبت رقماً آخر يصبح هو الفرق.',unit:'%',value:0,min:-50,max:50,step:0.5}],()=>{upd5();Kuse=Knom;fixed=0;fixedOK=0;lastS=''});
  function upd5(){Ks=TP.v.Ks;Knom=TP.v.Knom;Ktrue=Knom*(1+(TP.v.err?TP.v.err/100:rndErr));
   $('#l5ksT').textContent=fm(Ks)+' V/rpm';$('#l5knT').textContent=fm(Knom);$('#l5tpw').textContent=TP.trainer?'من قيم المدرب':'رقم توضيحي';$('#l5tpw2').textContent=TP.trainer?'من قيم المدرب':'أرقام توضيحية'}
  upd5();Kuse=Knom;
  $('#l5n').oninput=e=>{n=+e.target.value};$('#l5f').oninput=e=>{fac=+e.target.value/100};$('#l5s').oninput=e=>{F=+e.target.value};
  el.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>{p=+b.dataset.pp;el.querySelectorAll('[data-pp]').forEach(x=>x.setAttribute('aria-pressed',x===b));lastS=''});
  el.querySelectorAll('[data-ph]').forEach(b=>b.onclick=()=>{ph3=+b.dataset.ph;el.querySelectorAll('[data-ph]').forEach(x=>x.setAttribute('aria-pressed',x===b));lastS=''});
  el.querySelectorAll('[data-fd]').forEach(b=>b.onclick=()=>{F=clamp(F+ +b.dataset.fd,200,4000);$('#l5s').value=F});
  $('#l5fix').onclick=()=>{const w=n*N2W,V=Ktrue*w;if(F>0&&n>0){Kuse=V/(F*N2W);fixed=1;fixedOK=Math.abs(F-n)<=Math.max(2,n*0.002)}};
  $('#l5undo').onclick=()=>{Kuse=Knom;fixed=0;fixedOK=0};
  const steps=stepsUI($('#l5st'),[
   {t:'الجهد والتردد معاً',x:'في الجزء (أ) غيّر السرعة: تزداد قيمة الجهد وتردده معاً بنفس المعدل. عند <span class="ltr">3000 rpm</span> وزوج أقطاب واحد يكون التردد <span class="ltr">50 Hz</span>.',done:()=>n>=2990&&p===1},
   {t:'ما الذي يخدع قياس الجهد؟',x:'حرّك منزلق «تغيّر كثافة المجال أو الحمل أو الحرارة» إلى أقل من <span class="ltr">90 %</span>: السرعة المحسوبة من الجهد تصبح خطأ، أما المحسوبة من التردد فتبقى صحيحة.',done:()=>fac<0.9},
   {t:'جهّز المعايرة',x:'أعد المنزلق إلى <span class="ltr">100 %</span> واضبط سرعة العمود على <span class="ltr">1500 rpm</span>. لاحظ أن قراءة التاكو (ب) لا تساوي 1500 تماماً.',done:()=>Math.abs(n-1500)<5&&fac===1},
   {t:'جمّد العلامة',x:'ابدأ بومضات كثيرة ثم أنقصها (المنزلق ثم أزرار ±1) حتى ترى <b>علامة واحدة ثابتة</b>. هذه هي السرعة الحقيقية.',done:()=>Math.abs(F-n)<=Math.max(2,n*0.002)},
   {t:'صحّح الثابت',x:'اضغط «صحّح ثابت توليد الجهد»: يحسب <span class="ltr">K<sub>g</sub> = V<sub>a</sub>/ω</span> من قراءة الإستروبوسكوب، فتصبح قراءة التاكو صحيحة.',done:()=>fixed&&fixedOK},
   {t:'تحقق',x:'غيّر سرعة العمود إلى أي قيمة أخرى: قراءة التاكو الآن صحيحة عند كل السرعات (جمّد العلامة من جديد لتتأكد).'},
   {t:'فخ نصف السرعة',x:'اضبط الومضات على نصف سرعة العمود: تبدو العلامة ثابتة أيضاً! إذا صححت الثابت هنا ستضاعف الخطأ. لذلك نبدأ من الومضات الكثيرة (توضيح).'}
  ],()=>({}));
  function genSVG(a){const cx=140,cy=140;let s=`<svg viewBox="0 0 280 280" role="img" aria-label="مولد تزامني بمغناطيس دائم"><circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="var(--line)" stroke-width="16"/>`;
   const coils=ph3?[0,120,240]:[0];coils.forEach((d,i)=>{const t=(d-90)*PI/180,x=cx+104*Math.cos(t),y=cy+104*Math.sin(t);s+=`<g transform="rotate(${d} ${x.toFixed(1)} ${y.toFixed(1)})"><rect x="${(x-22).toFixed(1)}" y="${(y-12).toFixed(1)}" width="44" height="24" rx="5" fill="var(--surface)" stroke="var(--live)" stroke-width="2"/></g><text class="txt" x="${(cx+78*Math.cos(t)).toFixed(1)}" y="${(cy+78*Math.sin(t)+4).toFixed(1)}" text-anchor="middle" style="fill:var(--live)">${ph3?['A','B','C'][i]:'coil'}</text>`});
   s+=`<g transform="rotate(${a.toFixed(1)} ${cx} ${cy})">`;const k=2*p;for(let i=0;i<k;i++){const a0=i*360/k-90-180/k,a1=a0+360/k,r=60;const P=d=>[cx+r*Math.cos(d*PI/180),cy+r*Math.sin(d*PI/180)];const A=P(a0),Bp=P(a1),m=P((a0+a1)/2);
    s+=`<path d="M${cx} ${cy}L${A[0].toFixed(1)} ${A[1].toFixed(1)}A${r} ${r} 0 0 1 ${Bp[0].toFixed(1)} ${Bp[1].toFixed(1)}Z" fill="var(${i%2?'--blue-soft':'--stop-soft'})" stroke="var(--fg)" stroke-width="1.2"/><text class="txt" x="${(cx+(m[0]-cx)*.62).toFixed(1)}" y="${(cy+(m[1]-cy)*.62+4).toFixed(1)}" text-anchor="middle">${i%2?'S':'N'}</text>`}
   s+=`<circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/></g></svg>`;return s}
  function diskSVG(imgs){const cx=110,cy=110;let s=`<svg viewBox="0 0 220 220" role="img" aria-label="العلامة على العمود"><circle cx="${cx}" cy="${cy}" r="96" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="8" fill="var(--fg)"/>`;
   imgs.forEach(([a,op])=>{const t=(a-90)*PI/180;s+=`<path d="M${cx} ${cy}L${(cx+86*Math.cos(t)).toFixed(1)} ${(cy+86*Math.sin(t)).toFixed(1)}" stroke="var(--live)" stroke-width="7" stroke-linecap="round" opacity="${op}"/>`});
   return s+'</svg>'}
  /* أعطال مخفية: slip وصلة المولد التزامني بالعمود تنزلق (يدور أبطأ من العمود)، weak ضعف المغناطيس الدائم، cB ملف الوجه B في الثابت مقطوع */
  const nGen=()=>chF('slip')?0.95*n:n;
  loopOn(el,dt=>{t+=dt;const f=p*nGen()/60,Epk=Ks*nGen()*fac*(chF('weak')?0.85:1);ang=(ang+n/60*360*dt/50)%360;
   $('#l5g').innerHTML=genSVG(ang);
   $('#l5n-v').textContent=n+' rpm';$('#l5f-v').textContent=Math.round(fac*100)+' %';$('#l5s-v').textContent=F+' /min';
   // strobe: images at the last three flashes (true shaft angle at each flash)
   const k=Math.floor(t*F/60),imgs=[];for(let j=0;j<3;j++){const kk=k-j;imgs.push([((360*kk*n/F)%360+360)%360,[1,.45,.2][j]])}
   $('#l5d').innerHTML=diskSVG(imgs);
   const rr=n/F,near=Math.round(rr),dev=Math.abs(rr-near);let txt;
   if(n===0)txt='العمود متوقف.';else if(near>=1&&dev<0.002)txt=near===1?'<b>علامة واحدة ثابتة</b>: الومضات = سرعة العمود.':`العلامة ثابتة، لكن السرعة = ${near} × الومضات! (فخ)`;
   else{const inv=F/n,ni=Math.round(inv);txt=ni>=2&&Math.abs(inv-ni)<0.004?`تظهر ${ni} علامات ثابتة: الومضات ${ni} أضعاف السرعة.`:'العلامة تتحرك: الومضات لا تطابق السرعة.'}
   $('#l5ds').innerHTML=txt;
   const w=n*N2W,Va=Ktrue*w,nt=Kuse>0?Va/Kuse*W2N:0;
   $('#l5va').textContent=fm(Va,2)+' V';$('#l5ku').textContent=fm(Kuse,4);$('#l5nt').textContent=fm(nt,0)+' rpm';$('#l5ns').textContent=F+' rpm';$('#l5er').textContent=n>0?fm((nt-n)/n*100,1)+' %':'—';
   $('#l5cm').innerHTML=fixed?(fixedOK?'<div class="callout">تم تصحيح ثابت توليد الجهد بمقارنة التاكو بالإستروبوسكوب: القراءة صحيحة الآن.</div>':'<div class="callout err">صححت الثابت والعلامة غير مجمّدة على السرعة الحقيقية، فصار الثابت خطأً. أعد ثابت اللوحة وجمّد العلامة أولاً.</div>'):'';
   const sg=[n,p,ph3,fac].join();if(sg!==lastS){lastS=sg;
    $('#l5e').textContent=fm(Epk,1)+' V';$('#l5fr').textContent=fm(f,1)+' Hz';$('#l5nv').textContent=fm(Epk/Ks,0)+' rpm';$('#l5nf').textContent=fm(60*f/p,0)+' rpm';
    $('#l5msg').innerHTML=Math.abs(fac-1)>0.005&&n>0?`<div class="callout err">${fac<1?'ضعف':'زاد'} المجال بنسبة <span class="ltr">${fm(Math.abs(fac-1)*100,0)} %</span>: القراءة من الجهد خاطئة بنفس النسبة، والقراءة من التردد صحيحة. لهذا «قياس السرعة بواسطة قياس التردد يكون عادة أكثر دقة» (ص 40).</div>`:'';
    const ser=[],ph=ph3?[0,120,240]:[0],cols=['--live','--blue','--muted'];ph.forEach((d,i)=>{const pts=[],Ei=i===1&&chF('cB')?0:Epk;for(let j=0;j<=300;j++){const tt=j/300*0.1;pts.push([tt*1000,Ei*Math.sin(2*PI*f*tt-d*PI/180)])}ser.push({pts,color:cols[i],width:2})});
    const yG=Ks===0.02?70:70*Ks/0.02;   // بالقيم التوضيحية ±70 V تماماً
    plot($('#l5o'),{xmax:100,ymin:-yG,ymax:yG,ystep:yG/2,xlabel:'t (ms)',ylabel:'e (V)',series:ser})}
   steps.check()});
 },
 quiz:[
  {q:'المجال المغناطيسي في مولد التاكو التزامني يأتي من:',o:['ملف مجال على الثابت','مغناطيسات دائمة على العضو الدوار','تيار الحمل','الفرش'],c:1,e:'ص 40.'},
  {q:'العضو الثابت للمولد التزامني يتكون من:',o:['ملف أحادي الوجه أو ملفات ثلاثية متماثلة','مغناطيس دائم','قفص سنجابي','مبدل وفرش'],c:0,e:'ص 40.'},
  {q:'عند زيادة سرعة الدوار في المولد التزامني:',o:['يزيد الجهد ويبقى التردد ثابتاً','يزيد التردد ويبقى الجهد ثابتاً','يزداد الجهد والتردد معاً بنفس المعدل','يقل الجهد'],c:2,e:'ص 40.'},
  {q:'أي طريقة لقياس السرعة بالمولد التزامني أدق عادة؟',o:['قياس قيمة الجهد','قياس التردد','قياس التيار','قياس المقاومة'],c:1,e:'ص 40: قياس السرعة بواسطة قياس التردد يكون عادة أكثر دقة.'},
  {q:'لماذا القياس بالتردد أدق؟',o:['لأن التردد لا يتأثر بتغير ممانعة الدائرة المغناطيسية وكثافة المجال والحمل والحرارة','لأن التردد أكبر من الجهد','لأن أجهزة التردد أرخص','لأن الجهد صفر دائماً'],c:0,e:'ص 40.'},
  {q:'كيف تتم معايرة التاكومتر حسب الكتاب؟',o:['بمقارنة قراءته بوسيلة دقيقة مثل الإستروبوسكوب وتصحيح ثابت توليد الجهد','بتغيير الفرش','بعكس اتجاه الدوران','بزيادة مقاومة الحمل'],c:0,e:'ص 40.'},
  {q:'متى تعاير التاكومترات؟',o:['مرة واحدة فقط','كل فترة زمنية محددة','عند تعطلها فقط','لا تحتاج معايرة'],c:1,e:'ص 40: معايرتها كل فترة زمنية محددة.'},
  {q:'مولد تزامني بزوج أقطاب واحد يعطي جهداً تردده 25 Hz. سرعته:',o:['25 rpm','750 rpm','1500 rpm','3000 rpm'],c:2,e:'توضيح: n = 60 f / p = 60 × 25 ÷ 1 = 1500 rpm.'}
 ]
});

/* ============================== Lesson 2.6 — questions ============================== */
const Q=(n,q,opts,ans)=>`<details class="tk-q"><summary>${n}: ${q}</summary>${opts?`<ol style="list-style:none;padding-inline-start:6px">${opts.map((o,i)=>`<li>${'أبجد'[i]}. ${o}</li>`).join('')}</ol>`:''}<div class="tk-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
B.lesson({
 id:'u2-l6',unit:2,order:6,pages:'41–42',
 title:'أسئلة الوحدة واختبارها الذاتي',
 summary:'الاختبار الذاتي (اختر الإجابة أو الإجابات الصحيحة) والأسئلة المتنوعة للوحدة الثانية كما في الكتاب، تحت كل سؤال إجابة مقترحة من نص الكتاب، وحاسبة للسؤال الحسابي س٢-٣.',
 stations:[
  {intro:true},

  {st:1,short:'اختبار ذاتي',title:'اختبار ذاتي — اختر الإجابة أو الإجابات الصحيحة',ref:'ص 41–42',
   q:'خمسة أسئلة تغطي الوحدة كلها. أجب عن كل سؤال قبل أن تضغط، ثم اقرأ السبب.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة مراجعة: موضوع كل سؤال من أسئلة الاختبار الذاتي والدرس الذي يراجَع فيه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="38" y="40" width="284" height="246" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="300" y="68" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">السؤال وموضوعه</text><text x="74" y="68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الدرس</text><line x1="54" y1="80" x2="306" y2="80" stroke="#2C4A40" stroke-width="1.5"/><g font-size="13.5" fill="#2C4A40"><text x="300" y="110" text-anchor="end">س١ خصائص مولد التاكو</text><text x="300" y="148" text-anchor="end">س٢ أنواع مولدات التاكو</text><text x="300" y="186" text-anchor="end">س٣ علاقة السرعة والجهد</text><text x="300" y="224" text-anchor="end">س٤ تقليل الخطأ في القراءة</text><text x="300" y="262" text-anchor="end">س٥ معايرة مولدات التاكو</text></g><g font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" text-anchor="middle"><rect x="52" y="94" width="44" height="24" rx="12" fill="#4FB3A9"/><text x="74" y="111">2.1</text><rect x="52" y="132" width="44" height="24" rx="12" fill="#4FB3A9"/><text x="74" y="149">2.1</text><rect x="52" y="170" width="44" height="24" rx="12" fill="#E8735A"/><text x="74" y="187">2.2</text><rect x="52" y="208" width="44" height="24" rx="12" fill="#E8735A"/><text x="74" y="225">2.3</text><rect x="52" y="246" width="44" height="24" rx="12" fill="#12855A"/><text x="74" y="263">2.5</text></g></svg>`,
   cap:'موضوع كل سؤال، والدرس الذي تراجعه إذا أخطأت فيه.',
   side:[
    {book:String.raw`<p><b>س١:</b> من أهم خصائص مولد التاكو ……… أ. كبير الحجم. ب. القصور الذاتي قوي. ج. ثابت الزمن الميكانيكي صغير. د. جميع ما سبق.</p>
     <p><b>س٢:</b> من أهم أنواع مولدات التاكو ……… أ. مولدات التاكو للتيار المستمر. ب. مولدات التاكو الحثية. ج. مولدات التاكو التزامنية. د. جميع ما سبق.</p>
     <p><b>س٣:</b> علاقة السرعة والجهد المتولد في مولدات التاكو للتيار المستمر …… أ. خطية. ب. غير خطية. ج. شبه خطية. د. لا توجد أي علاقة.</p>
     <p><b>س٤:</b> للتقليل من الخطأ في قراءة تاكومترات التيار المستمر…… أ. تستعمل مقاومة مادية كبيرة. ب. تستخدم فرش معدنية مصنوعة من الفضة. ج. تستخدم مولدات تاكو حثية. د. جميع ما سبق.</p>
     <p><b>س٥:</b> يتم معايرة مولدات التاكو …… أ. كل فترة زمنية معينة. ب. عند الاستخدام. ج. كل عام. د. مرة واحدة فقط.</p>`,ref:'ص 41–42'}
   ],
   body:[
    {tip:String.raw`<p>الكتاب لا يعطي إجابات لهذه الأسئلة. الإجابات في الأسئلة التالية مأخوذة من نص الكتاب نفسه، وتحت كل اختيار سبب صحته أو خطئه.</p>`},
    {predict:{q:'س١: من أهم خصائص مولد التاكو ………',opts:[
     ['أ. كبير الحجم',false,'الكتاب يصف مولدات التاكو بأنها «صغيرة القدرة» (ص 29) و«صغيرة الحجم» (ص 30 و 40).'],
     ['ب. القصور الذاتي قوي',false,'من المتطلبات (ص 29): «أقل قصور ذاتي».'],
     ['ج. ثابت الزمن الميكانيكي صغير',true,'من المتطلبات (ص 29): «أقل ثابت زمني»، ويذكره الكتاب سبباً لاختيار الدوار الكأسي (ص 36).'],
     ['د. جميع ما سبق',false,'لا يصح لأن أ و ب عكس ما يطلبه الكتاب.']]}},
    {predict:{q:'س٢: من أهم أنواع مولدات التاكو ………',opts:[
     ['أ. مولدات التاكو للتيار المستمر',false,'صحيح لكنه ناقص: الكتاب يذكر ثلاثة أنواع.'],
     ['ب. مولدات التاكو الحثية',false,'صحيح لكنه ناقص: الكتاب يذكر ثلاثة أنواع.'],
     ['ج. مولدات التاكو التزامنية',false,'صحيح لكنه ناقص: الكتاب يذكر ثلاثة أنواع.'],
     ['د. جميع ما سبق',true,'ص 29: «مولدات للتيار المستمر أو مولدات حثية أو تزامنية».']]}},
    {tip:String.raw`<p>السؤال يحتمل أكثر من إجابة: <b>أ</b> إذا قُصدت العلاقة المثالية (المعادلتان (٢-٢) و (٢-٥): خطية طالما \(R_a\) و \(\phi\) ثابتان و \(R_L\) كبيرة)، و<b>ب</b> إذا قُصد الواقع (المعادلة (٢-٨): «العلاقة بين \(V_a\) و \(\omega\) ليست خطية» بسبب رد فعل المنتج وجهد التلامس). يحدد المدرب الإجابة المعتمدة.</p>`,title:'س٣: انتبه لصياغة السؤال'},
    {predict:{q:'س٤: للتقليل من الخطأ في قراءة تاكومترات التيار المستمر…… (قد تكون الإجابة أكثر من اختيار)',opts:[
     ['أ فقط',false,'المقاومة الكبيرة طريقة صحيحة، لكن الكتاب يذكر طريقة ثانية أيضاً.'],
     ['أ و ب',true,'البند ٢-٢-١ ص 33: مقاومة كبيرة لجهاز القياس، وفرش معدنية من الفضة.'],
     ['ج فقط',false,'استعمال مولد حثي ليس طريقة لتقليل خطأ تاكو التيار المستمر؛ هو نوع آخر من التاكو.'],
     ['د. جميع ما سبق',false,'لا يصح لأن ج ليس من طرق الكتاب.']]}},
    {predict:{q:'س٥: يتم معايرة مولدات التاكو ……',opts:[
     ['ب. عند الاستخدام',false,'الكتاب لا يربط المعايرة بكل استخدام.'],
     ['د. مرة واحدة فقط',false,'القراءة تحتاج تأكداً متكرراً، فمرة واحدة لا تكفي.'],
     ['ج. كل عام',false,'الكتاب لم يحدد سنة؛ قال «فترة زمنية محددة».'],
     ['أ. كل فترة زمنية معينة',true,'ص 40: «يستلزم معايرتها كل فترة زمنية محددة».']]}},
    {title:'تحقق سريع: س٣ (هل العلاقة خطية؟)',widget:(el,B)=>DCML.tf(el,B,{intro:'س٣ يحتمل أكثر من إجابة. هذه العبارات تساعدك أن تختار وتبرر.',items:[
 ['في المعادلة <span class="ltr">(٢-٥)</span> العلاقة بين <span class="ltr">V<sub>a</sub></span> و<span class="ltr">ω</span> خطية ما دامت <span class="ltr">R<sub>a</sub></span> و<span class="ltr">φ</span> ثابتتين.',true,'هذا نص الكتاب (ص 32).'],
 ['بإدخال رد فعل المنتج وجهد التلامس عند الفرش (المعادلة <span class="ltr">(٢-٨)</span>) تصبح العلاقة غير خطية.',true,'«العلاقة بين Va و ω ليست خطية إذا أخذنا في الاعتبار…» (ص 33).'],
 ['المنطقة الميتة تعني أن جهداً يظهر على الأطراف والعمود ساكن.',false,'العكس: في المنطقة الميتة يدور العمود ببطء ولا يظهر جهد، لأن الجهد المتولد أقل من جهد التلامس.']]})}
   ]},

  {st:2,short:'أسئلة متنوعة',title:'أسئلة متنوعة',ref:'ص 42',
   q:'أسئلة مقالية وسؤال حسابي: أين تجد إجابة كل واحد منها في دروس الوحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خريطة الأسئلة المتنوعة: أسئلة تاكو التيار المستمر، والحثي، والتزامني، والمعايرة والمتطلبات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="190" y="44" width="140" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="190" y="168" width="140" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="30" y="44" width="140" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="30" y="168" width="140" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="190" y="44" width="140" height="30" rx="14" fill="#E8735A"/><rect x="190" y="168" width="140" height="30" rx="14" fill="#4FB3A9"/><rect x="30" y="44" width="140" height="30" rx="14" fill="#F2C14E"/><rect x="30" y="168" width="140" height="30" rx="14" fill="#12855A"/><g font-size="13" font-weight="700" text-anchor="middle"><text x="260" y="64" fill="#FBF6EE">تاكو التيار المستمر</text><text x="260" y="188" fill="#2C4A40">التاكو الحثي</text><text x="100" y="64" fill="#2C4A40">التاكو التزامني</text><text x="100" y="188" fill="#FBF6EE">المتطلبات والمعايرة</text></g><g font-size="13" fill="#2C4A40" text-anchor="middle"><text x="260" y="100">س ٢-٢  ·  س ٢-٤</text><text x="260" y="124">س٢-١ (المجموعة الثانية)</text><text x="260" y="224">س ٢-٤ (المكرر)</text><text x="260" y="248">س٢-٢  ·  س٢-٣</text><text x="100" y="110">س ٢-٤ (الأخير)</text><text x="100" y="224">س ٢-١</text><text x="100" y="248">س ٢-٣</text></g></svg>`,
   cap:'الأسئلة مقسمة حسب موضوعها. الكتاب يكرر «س ٢-٤» ثلاث مرات ثم يعيد الترقيم من ١ (انظر «انتبه» أدناه).',
   side:[
    {book:String.raw`<p><b>س ٢-١:</b> ما هي المتطلبات الواجب مراعاتها في تصميم مولدات التاكو؟</p>
     <p><b>س ٢-٢:</b> ما هي أسباب الخطأ الذي يمكن أن يحدث في قراءة السرعة المقاسة بواسطة تاكومترات التيار المستمر؟ وما هي الإجراءات المتخذة عند التصميم للتقليل من هذا الخطأ؟</p>
     <p><b>س ٢-٣:</b> كيف تتم معايرة التاكومترات؟</p>
     <p><b>س ٢-٤:</b> اشرح مع الرسم تركيب ونظرية عمل مولد التاكو للتيار المستمر.</p>
     <p><b>س ٢-٤:</b> اشرح مع الرسم تركيب ونظرية عمل مولد التاكو الحثي.</p>
     <p><b>س ٢-٤:</b> اشرح تركيب ونظرية عمل مولد التاكو التزامني.</p>`,ref:'ص 42'}
   ],
   body:[
    {book:String.raw`<p><b>س٢-١:</b> أثبت العلاقة الرياضية التي تربط بين الجهد المتولد على أطراف مولدات التاكو للتيار المستمر وسرعة الدوران المراد قياسها (المعادلة ٢-٨). ارسم هذه العلاقة ووضح أنها غير خطية.</p>
     <p><b>س٢-٢:</b> أثبت أن الجهد المتولد على ملف التوليد في مولدات التاكو الحثية يتناسب طرديا مع سرعة الدوار وبنفس تردد جهد ملف المجال.</p>
     <p><b>س٢-٣:</b> إذا استخدم المحرك أحادي الوجه كمولد تاكو حثي لقياس السرعة، حيث إن تيار الدخل ومعاوقة المجال الأمامي والخلفي كالتالي: <span class="ltr">I<sub>1</sub> = 2.5∠−50.4</span> ، <span class="ltr">Z<sub>f</sub> = 64 + j80.3</span> ، <span class="ltr">Z<sub>b</sub> = 4 + j4.2</span>. احسب الجهد المتولد على الملفات المساعدة وزاوية الطور مع جهد الملف الرئيسي عند انزلاق <span class="ltr">s = 0.04</span>. إذا كانت النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي <span class="ltr">n = 0.9</span>.</p>`,ref:'ص 42'},
    {tip:String.raw`<table class="tt"><thead><tr><th>السؤال</th><th>أين تجد الإجابة؟</th></tr></thead><tbody>
     <tr><td>س ٢-١ (المتطلبات)</td><td>الدرس 2.1، المحطة الرابعة</td></tr>
     <tr><td>س ٢-٢ (أسباب الخطأ وتقليله)</td><td>الدرس 2.3، المحطات 1–3</td></tr>
     <tr><td>س ٢-٣ (المعايرة)</td><td>الدرس 2.5، المحطة الثانية</td></tr>
     <tr><td>س ٢-٤ (التاكو المستمر)</td><td>الدرس 2.2 كله، والشكلان (٢-١) و (٢-٢)</td></tr>
     <tr><td>س ٢-٤ (التاكو الحثي)</td><td>الدرس 2.4، المحطات 1–3 والشكل (٢-٣)</td></tr>
     <tr><td>س ٢-٤ (التاكو التزامني)</td><td>الدرس 2.5، المحطة الأولى</td></tr>
     <tr><td>س٢-١ (إثبات المعادلة ٢-٨)</td><td>الدرس 2.3، المحطة الثانية («من أين جاءت (٢-٨)؟»)</td></tr>
     <tr><td>س٢-٢ (تناسب جهد التاكو الحثي مع السرعة)</td><td>الدرس 2.4، المحطة الثالثة</td></tr>
     <tr><td>س٢-٣ (حسابي)</td><td>بطريقة مثال ٢-٤ (الدرس 2.4)، والحل المقترح في تبويب «الأمثلة المحلولة» لهذا الدرس</td></tr></tbody></table>`,title:'دليل الإجابات'},
    {predict:{q:'بأي معادلة نبدأ حل السؤال الحسابي س٢-٣؟',opts:[
     ['المعادلة (٢-٨)',false,'هذه معادلة تاكو التيار المستمر، والسؤال عن محرك أحادي الوجه يعمل كتاكو حثي.'],
     ['المعادلة (٢-١٣): \\(E_a=j\\,0.5\\times n\\,I_1\\cdot(Z_f-Z_b)\\)',true,'السؤال يطابق مثال ٢-٤ تماماً بأرقام أخرى، وحله بالمعادلة (٢-١٣). والانزلاق المعطى لا يدخل في الحل كما في المثال.'],
     ['المعادلة (٢-١): \\(V_a=K_g\\cdot\\omega\\)',false,'لا نعرف \\(K_g\\) ولا \\(\\omega\\) في السؤال؛ المعطى هو التيار والمعاوقات ونسبة اللفات.']]}},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل المقترح لـ س٢-٣</button></div>`},
    {watch:String.raw`<p>ترقيم الأسئلة في ص 42 مضطرب: «س ٢-٤» مكرر ثلاث مرات (للتاكو المستمر والحثي والتزامني)، ثم يبدأ الكتاب مجموعة ثانية بالأرقام س٢-١ و س٢-٢ و س٢-٣ فتتكرر أرقام المجموعة الأولى. نقلنا الأرقام كما طُبعت.</p>`,fix:true},
    {title:'مختبر مصغّر: طريقة مثال (٢-٤) على أرقام س٢-٣',widget:(el,B)=>{const G={ex:{n:0.8,I1m:3.59,I1a:-51.7,Rf:31.9,Xf:40.3,Rb:1.98,Xb:2.12},q:{n:0.9,I1m:2.5,I1a:-50.4,Rf:64,Xf:80.3,Rb:4,Xb:4.2}};
 return DCML.lab(el,B,{intro:'الخطوات نفسها، والأرقام تتغير. بدّل بين المثال والسؤال وقارن كل خطوة.',
 predict:{q:'في المثال كان الجهد متقدماً عن جهد الملف الرئيسي بزاوية <span class="ltr">90.22°</span>. ماذا تتوقع في س٢-٣؟',opts:[
  ['زاوية قريبة من <span class="ltr">90°</span> أيضاً',true,'زاوية <span class="ltr">I<sub>1</sub></span> وزاوية <span class="ltr">(Z<sub>f</sub> − Z<sub>b</sub>)</span> متقاربتان ومتعاكستان، فيبقى تقريباً <span class="ltr">90°</span> من <span class="ltr">j</span>.'],
  ['زاوية قريبة من الصفر',false,'<span class="ltr">j</span> تضيف <span class="ltr">90°</span> دائماً في المعادلة <span class="ltr">(٢-١٣)</span>.'],
  ['زاوية قريبة من <span class="ltr">180°</span>',false,'الزاويتان الأخريان تكادان تلغيان بعضهما، فلا تضيفان <span class="ltr">90°</span> أخرى.']]},
 ins:[{k:'d',l:'الأرقام',seg:[['ex','مثال (٢-٤) ص 39'],['q','س٢-٣ ص 42']],v:'ex'}],
 calc:(s,P,B)=>{const g=G[s.d],st=solveInd(g,true,{final:'',say:()=>''});
  return {facts:[['<span class="ltr">0.5 × n × |I<sub>1</sub>|</span>',String(st[2].v!=null?DCML.fm(B,st[2].v,3):'')],['زاوية I<sub>1</sub>',DCML.fm(B,g.I1a,1)+'°'],['E<sub>a</sub> (V)',String(st[5].v),'hi']],
   msg:s.d==='ex'?'هذا ناتج الكتاب في المثال (ص 39).':'هذا حل مقترح بطريقة الكتاب نفسها (الكتاب لا يعطي جواب السؤال)، ويطابق الحل المقترح أعلاه.'}}})}}
   ]},

  {recap:[
   String.raw`المتطلبات (البند ٢-١): أقل <span class="ltr">ΔV</span> وأقل <span class="ltr">Δβ</span> وأكبر \(K_g\) وأقل قصور ذاتي وأقل ثابت زمني.`,
   String.raw`تاكو التيار المستمر، المعادلة (٢-٥) خطية مثالياً، والمعادلة (٢-٨) غير خطية بسبب رد فعل المنتج وجهد التلامس؛ والعلاج مقاومة قياس كبيرة وفرش من الفضة.`,
   String.raw`التاكو الحثي: المعادلة (٢-١٣) \(E_a=j\,0.5\,n\,I_1(Z_f-Z_b)\)، والتزامني يُقرأ بالتردد بدقة أكبر، والمعايرة بالإستروبوسكوب كل فترة زمنية محددة.`]}
],
 theory:[
  {h:'اختبار ذاتي — اختر الإجابة أو الإجابات الصحيحة',ref:'ص 41–42',html:`<p class="sub">الكتاب لا يعطي إجابات. اضغط على السؤال لترى إجابة مقترحة مكتوبة من نص الكتاب.</p>
   ${Q('س١','من أهم خصائص مولد التاكو ………',['كبير الحجم.','القصور الذاتي قوي.','ثابت الزمن الميكانيكي صغير.','جميع ما سبق.'],'<b>ج</b>. من المتطلبات (ص 29): «أقل قصور ذاتي» و«أقل ثابت زمني»، ومولدات التاكو «صغيرة القدرة» (ص 29) و«صغيرة الحجم» (ص 30، 40)؛ لذلك أ و ب خطأ، فلا تصح د.')}
   ${Q('س٢','من أهم أنواع مولدات التاكو ………',['مولدات التاكو للتيار المستمر.','مولدات التاكو الحثية.','مولدات التاكو التزامنية.','جميع ما سبق.'],'<b>د</b>. ص 29: «تصنف مولدات التاكو … من حيث إنها مولدات للتيار المستمر أو مولدات حثية أو تزامنية».')}
   ${Q('س٣','علاقة السرعة والجهد المتولد في مولدات التاكو للتيار المستمر ……',['خطية.','غير خطية.','شبه خطية.','لا توجد أي علاقة.'],'السؤال يحتمل أكثر من إجابة: <b>أ</b> إذا قُصدت العلاقة المثالية (المعادلتان ٢-٢ و ٢-٥: خطية طالما R<sub>a</sub> و φ ثابتان و R<sub>L</sub> كبيرة)، و<b>ب</b> إذا قُصد الواقع (المعادلة ٢-٨: «العلاقة بين V<sub>a</sub> و ω ليست خطية» بسبب رد فعل المنتج وجهد التلامس). يحدد المدرب الإجابة المعتمدة.')}
   ${Q('س٤','للتقليل من الخطأ في قراءة تاكومترات التيار المستمر……',['تستعمل مقاومة مادية كبيرة.','تستخدم فرش معدنية مصنوعة من الفضة.','تستخدم مولدات تاكو حثية.','جميع ما سبق.'],'<b>أ و ب</b> (البند ٢-٢-١ ص 33). البند ج ليس من طرق الكتاب لتقليل خطأ تاكو التيار المستمر، فلا تصح د.')}
   ${Q('س٥','يتم معايرة مولدات التاكو ……',['كل فترة زمنية معينة.','عند الاستخدام.','كل عام.','مرة واحدة فقط.'],'<b>أ</b>. ص 40: «يستلزم معايرتها كل فترة زمنية محددة».')}`},
  {h:'أسئلة متنوعة',ref:'ص 42',html:`
   ${Q('س ٢-١','ما هي المتطلبات الواجب مراعاتها في تصميم مولدات التاكو؟',null,'(ص 29) أ. أقل خطأ ممكن في القيمة العددية للجهد المتولد ΔV (أقل انحراف عن العلاقة الخطية). ب. أقل خطأ ممكن في زاوية الوجه Δβ. ج. أكبر معامل تكبير ممكن K<sub>g</sub>. د. أقل قصور ذاتي. هـ. أقل ثابت زمني للنظام الكهروميكانيكي.')}
   ${Q('س ٢-٢','ما هي أسباب الخطأ الذي يمكن أن يحدث في قراءة السرعة المقاسة بواسطة تاكومترات التيار المستمر؟ وما هي الإجراءات المتخذة عند التصميم للتقليل من هذا الخطأ؟',null,'<b>الأسباب</b> (ص 32–33): أولاً رد فعل المنتج الذي يضعف الفيض (φ<sub>L</sub> = φ − K<sub>r</sub>I<sub>a</sub>)؛ ثانياً جهد التلامس بين المبدل والفرش الكربونية V<sub>brush</sub> الذي يظل ثابتاً فيسبب منطقة ميتة Δω. <b>الإجراءات</b> (ص 33): جهاز قياس جهد بمقاومة كبيرة لتقليل تيار المنتج ورد فعله، وفرش معدنية من الفضة لتقليل جهد التلامس والمنطقة الميتة.')}
   ${Q('س ٢-٣','كيف تتم معايرة التاكومترات؟',null,'(ص 40) بمقارنة نتائجها مع نتائج وسيلة أخرى دقيقة لقياس السرعة مثل الإستروبوسكوب، وتصحيح ثابت توليد الجهد كلما لزم الأمر، وذلك كل فترة زمنية محددة.')}
   ${Q('س ٢-٤','اشرح مع الرسم تركيب ونظرية عمل مولد التاكو للتيار المستمر.',null,'(ص 30–33) مولد تيار مستمر صغير بتغذية مستقلة لملفات المجال (الشكل ٢-١) أو بمغناطيس دائم. عند ثبات الفيض: E<sub>a</sub> = K<sub>E</sub>ω (٢-٢)، وتحت الحمل V<sub>a</sub> = E<sub>a</sub> − I<sub>a</sub>R<sub>a</sub> فيكون V<sub>a</sub> = K<sub>E</sub>ω/(1 + R<sub>a</sub>/R<sub>L</sub>) (٢-٥). ارسم الشكل (٢-١) والشكل (٢-٢) واذكر سببي الخطأ والمنطقة الميتة.')}
   ${Q('س ٢-٤','اشرح مع الرسم تركيب ونظرية عمل مولد التاكو الحثي.',null,'(ص 36–39) ملفان متعامدان 90° كهربائية على الثابت: ملف مجال على مصدر ثابت الجهد والتردد وملف توليد، ودوار قفص سنجابي أو كأس نحاسي رفيع (الشكل ٢-٣). عند السكون كالمحول والفيض φ<sub>f</sub> متعامد مع ملف التوليد فلا جهد. عند الدوران يتولد E<sub>rot</sub> = Kωφ<sub>f</sub> (٢-٩) فيظهر فيض φ<sub>g</sub> على محور ملف التوليد يولد E<sub>a</sub> = K<sub>g</sub>ω بنفس تردد المصدر.')}
   ${Q('س ٢-٤','اشرح تركيب ونظرية عمل مولد التاكو التزامني.',null,'(ص 40) مولد تزامني صغير بمغناطيسات دائمة على الدوار، وثابت بملف أحادي الوجه أو ثلاثي. عند الدوران يتولد جهد متردد تتناسب قيمته وتردده مع السرعة؛ تقاس السرعة بقيمة الجهد أو بتردده، والتردد أدق لأنه لا يتأثر بالدائرة المغناطيسية وكثافة المجال والحمل والحرارة.')}
   <p class="sub" style="margin-top:14px">(مجموعة ثانية يعيد الكتاب ترقيمها من ١:)</p>
   ${Q('س٢-١','أثبت العلاقة الرياضية التي تربط بين الجهد المتولد على أطراف مولدات التاكو للتيار المستمر وسرعة الدوران المراد قياسها (المعادلة ٢-٨). ارسم هذه العلاقة ووضح أنها غير خطية.',null,'نبدأ من V<sub>a</sub> = E<sub>aL</sub> − I<sub>a</sub>R<sub>a</sub> − V<sub>brush</sub> مع E<sub>aL</sub> = Kω(φ − K<sub>r</sub>I<sub>a</sub>) = K<sub>E</sub>ω − KK<sub>r</sub>ωI<sub>a</sub> و I<sub>a</sub> = V<sub>a</sub>/R<sub>L</sub>، فنجمع حدود V<sub>a</sub>: V<sub>a</sub>(1 + (KK<sub>r</sub>ω + R<sub>a</sub>)/R<sub>L</sub>) = K<sub>E</sub>ω − V<sub>brush</sub>، ومنها (٢-٨). العلاقة غير خطية لأن ω موجودة في المقام، والمنحنى لا يبدأ من الأصل (منطقة ميتة). الرسم: الشكل (٢-٢). جرّبه في مختبر الدرس 2.3.')}
   ${Q('س٢-٢','أثبت أن الجهد المتولد على ملف التوليد في مولدات التاكو الحثية يتناسب طرديا مع سرعة الدوار وبنفس تردد جهد ملف المجال.',null,'(ص 37) E<sub>rot</sub> = Kωφ<sub>f</sub> يتناسب مع ω وله نفس تردد ملف المجال؛ φ<sub>g</sub> يتناسب مع E<sub>rot</sub> فهو يتناسب مع ω؛ و E<sub>a</sub> = const × φ<sub>g</sub>، إذن E<sub>a</sub> = K<sub>g</sub>ω وبنفس التردد. ويمكن الاستدلال أيضاً بـ (٢-١٣): E<sub>a</sub> = j0.5nI<sub>1</sub>(Z<sub>f</sub> − Z<sub>b</sub>)، صفر عند s = 1 ويزداد مع السرعة.')}
   ${Q('س٢-٣','إذا استخدم المحرك أحادي الوجه كمولد تاكو حثي لقياس السرعة، حيث إن تيار الدخل ومعاوقة المجال الأمامي والخلفي كالتالي: <span class="ltr">I<sub>1</sub> = 2.5∠−50.4</span> ، <span class="ltr">Z<sub>f</sub> = 64 + j80.3</span> ، <span class="ltr">Z<sub>b</sub> = 4 + j4.2</span>. احسب الجهد المتولد على الملفات المساعدة وزاوية الطور مع جهد الملف الرئيسي عند انزلاق <span class="ltr">s = 0.04</span>. إذا كانت النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي <span class="ltr">n = 0.9</span>.',null,'بطريقة مثال ٢-٤ وتقريبه: <span class="ltr">0.5 × 0.9 × 2.5 = 1.125∠−50.4°</span>، <span class="ltr">Z<sub>f</sub> − Z<sub>b</sub> = 60 + j76.1 = 96.9∠51.75°</span>، إذن <span class="ltr">E<sub>a</sub> ≈ 109.01∠91.35° V</span> (بلا تقريب الخطوات <span class="ltr">109.02 V</span>). الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».')}`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ترقيم الأسئلة في ص 42 مضطرب: «س ٢-٤» مكرر ثلاث مرات (للتاكو المستمر والحثي والتزامني)، ثم يبدأ الكتاب مجموعة ثانية بالأرقام س٢-١ و س٢-٢ و س٢-٣ فتتكرر أرقام المجموعة الأولى. نقلنا الأرقام كما طُبعت.'+'</div>'}
 ],
 examples:[
  {title:'س٢-٣ (حل مقترح بطريقة مثال ٢-٤ — ليس من الكتاب)',ref:'ص 42',
   q:'<p>«إذا استخدم المحرك أحادي الوجه كمولد تاكو حثي لقياس السرعة، حيث إن تيار الدخل ومعاوقة المجال الأمامي والخلفي كالتالي: <span class="ltr">I<sub>1</sub> = 2.5∠−50.4</span> ، <span class="ltr">Z<sub>f</sub> = 64 + j80.3</span> ، <span class="ltr">Z<sub>b</sub> = 4 + j4.2</span>. احسب الجهد المتولد على الملفات المساعدة وزاوية الطور مع جهد الملف الرئيسي عند انزلاق <span class="ltr">s = 0.04</span>. إذا كانت النسبة بين عدد لفات الملف المساعد إلى عدد لفات الملف الرئيسي <span class="ltr">n = 0.9</span>.»</p>',
   given:[{id:'I1m',label:'مقدار تيار الدخل',sym:'|I_1|',unit:'A',value:2.5},{id:'I1a',label:'زاوية تيار الدخل',sym:'\\angle I_1',unit:'°',value:-50.4},
    {id:'Rf',label:'الجزء الحقيقي لـ Z_f',sym:'R_f',unit:'Ω',value:64},{id:'Xf',label:'الجزء التخيلي لـ Z_f',sym:'X_f',unit:'Ω',value:80.3},
    {id:'Rb',label:'الجزء الحقيقي لـ Z_b',sym:'R_b',unit:'Ω',value:4},{id:'Xb',label:'الجزء التخيلي لـ Z_b',sym:'X_b',unit:'Ω',value:4.2},
    {id:'n',label:'نسبة اللفات',sym:'n',unit:'',value:0.9},{id:'s',label:'الانزلاق (لا يدخل في الحل)',sym:'s',unit:'',value:0.04}],
   solve:(g,B,isBook)=>solveInd(g,isBook,{final:'الجهد المتولد على الملف المساعد (حل مقترح):',say:(m,a)=>`الجهد على الملف المساعد ${lt(m+' V')} ومتقدم بزاوية ${lt(a+'°')} (مقيسة من زاوية I<sub>1</sub> المرجعية كما في مثال ٢-٤).`}),
   note:'الكتاب لا يعطي ناتج هذا السؤال. الحاسبة تتبع خطوات مثال ٢-٤ وتقريبه نفسه (المقدار 3 خانات، |Z<sub>f</sub> − Z<sub>b</sub>| خانة واحدة، النتيجة خانتان).'}
 ],
 quiz:[
  {q:'أي مولدات التاكو يعطي جهداً مستمراً؟',o:['مولد التاكو للتيار المستمر','مولد التاكو الحثي','مولد التاكو التزامني','لا شيء منها'],c:0,e:'الحثي والتزامني يعطيان جهداً متردداً (ص 37 و 40).'},
  {q:'في أي نوع يتساوى Z<sub>f</sub> و Z<sub>b</sub> عند السكون فيكون الخرج صفراً؟',o:['التاكو الحثي','التاكو المستمر','التاكو التزامني','كل الأنواع'],c:0,e:'ص 38: عند s = 1 فإن Z_f = Z_b و E_a = 0.'},
  {q:'المنطقة الميتة Δω تظهر في:',o:['تاكو التيار المستمر بسبب جهد الفرش','التاكو الحثي بسبب الكأس','التاكو التزامني بسبب المغناطيس','لا تظهر أبداً'],c:0,e:'ص 33.'},
  {q:'التردد يتغير مع السرعة في:',o:['التاكو التزامني','التاكو الحثي','تاكو التيار المستمر','لا شيء'],c:0,e:'التزامني: الجهد والتردد يزدادان معاً (ص 40). أما الحثي فتردده نفس تردد ملف المجال (ص 37).'},
  {q:'جهاز يستعمل لمعايرة التاكومترات حسب الكتاب:',o:['الإستروبوسكوب','الأوميتر','الواطميتر','المحول'],c:0,e:'ص 40.'},
  {q:'من متطلبات التاكو «أكبر معامل تكبير»، والمقصود:',o:['أكبر K<sub>g</sub>','أكبر حجم','أكبر قصور ذاتي','أكبر ثابت زمني'],c:0,e:'ص 29: أكبر معامل تكبير ممكن K_g.'},
  {q:'في المعادلة (٢-٥) تكون العلاقة خطية تقريباً عندما تكون:',o:['R<sub>L</sub> كبيرة القيمة','R<sub>L</sub> صغيرة جداً','R<sub>a</sub> متغيرة','φ متغيرة'],c:0,e:'ص 32.'}
 ]
});

})(PLCBOOK);
