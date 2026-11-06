/* Unit 4 — المحرك العام والمحرك التنافري (ص 57–67) */
(function(B){
const {S,clamp}=B;
const D=Math.PI/180;
const f1=v=>(+v).toFixed(1);
/* ---------------- small helpers for this unit ---------------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const slHTML=(id,lab,min,max,step,val,unit)=>`<label style="display:flex;flex-direction:column;gap:3px;flex:1 1 170px;min-width:140px;font-size:13.5px"><span>${lab} <b class="ltr" id="${id}-v" style="font-family:var(--mono)"></b> <span class="ltr">${unit||''}</span></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;accent-color:var(--blue)"></label>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const fx=v=>(+v).toFixed(1);
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
// curved arrow over the top of a circle; dir +1 = counter-clockwise (screen), mag 0..1
function arcArrow(cx,cy,r,dir,mag,col){if(!dir||mag<0.04)return '';const span=Math.max(18,80*mag),a0=-90-dir*(-span/2),a1=-90+dir*(-span/2);
  const P=a=>[cx+r*Math.cos(a*D),cy+r*Math.sin(a*D)];const p0=P(a0),p1=P(a1),sw=dir>0?0:1;
  const t=a1+dir*8,pt=P(t),tan=Math.atan2(p1[1]-pt[1],p1[0]-pt[0]);const h=10;
  const bx=p1[0]-h*Math.cos(tan),by=p1[1]-h*Math.sin(tan),px=-Math.sin(tan)*5,py=Math.cos(tan)*5;
  return `<path d="M${fx(p0[0])} ${fx(p0[1])}A${r} ${r} 0 0 ${sw} ${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="3" fill="none"/><path d="M${fx(p1[0])} ${fx(p1[1])}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function coil(x1,y1,x2,y2,n,cls){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
function resistor(x1,y,x2,cls){const n=6,w=(x2-x1)*0.7,s=x1+(x2-x1)*0.15,st=w/n;let p=`M${x1} ${y}H${fx(s)}`;for(let i=0;i<n;i++){p+=`L${fx(s+st*(i+0.5))} ${y+(i%2?6:-6)}`}return `<path class="w ${cls||''}" d="${p}L${fx(s+w)} ${y}H${x2}"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||290,L=o.left||48,R=14,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.xl)s+=S.t((L+W-R)/2,H-6,o.xl,'');if(o.yl)s+=`<text class="txt" x="12" y="${(T+H-Bm)/2}" text-anchor="middle" transform="rotate(-90 12 ${(T+H-Bm)/2})">${o.yl}</text>`;
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
/* monotone cubic interpolation (Fritsch–Carlson) through points [[x,y]] sorted by x */
function mono(P){const n=P.length,dx=[],m=[],t=[];for(let i=0;i<n-1;i++){dx[i]=P[i+1][0]-P[i][0];m[i]=(P[i+1][1]-P[i][1])/dx[i]}
  t[0]=m[0];t[n-1]=m[n-2];for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2;
  for(let i=0;i<n-1;i++){if(m[i]===0){t[i]=t[i+1]=0;continue}const a=t[i]/m[i],b=t[i+1]/m[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);t[i]=k*a*m[i];t[i+1]=k*b*m[i]}}
  return x=>{if(x<=P[0][0])return P[0][1];if(x>=P[n-1][0])return P[n-1][1];let i=0;while(x>P[i+1][0])i++;const h=dx[i],u=(x-P[i][0])/h,u2=u*u,u3=u2*u;
    return (2*u3-3*u2+1)*P[i][1]+(u3-2*u2+u)*h*t[i]+(-2*u3+3*u2)*P[i+1][1]+(u3-u2)*h*t[i+1]}}

/* ---------- الشكل (٤-١): exploded view (redrawn, simplified) ---------- */
const PARTS=[
 {k:'brg1',n:'نقط ارتكاز',d:'تحمل محور المحرك وتسمح له بالدوران.',src:0},
 {k:'hold',n:'ماسك الفرش',d:'يثبّت الفرش الكربونية في مكانها مقابل المبدل.',src:0},
 {k:'spring',n:'ياي',d:'يضغط الفرشة على المبدل لتبقى ملامسة له.',src:0},
 {k:'brush',n:'فرش كربونيه',d:'توصل التيار إلى ملفات المنتج عبر المبدل. في المحرك العام «تستخدم فرش كربونية ذات مقاومة مادية كبيرة لكبح الشرارة الكهربائية» (ص 59).',src:1},
 {k:'comm',n:'مبدل',d:'قطع نحاسية معزولة متصلة بملفات المنتج. «زيادة عدد قطع المبدل» تقلل فرق الجهد بين القطع المتجاورة فتقل الشرارة (ص 59).',src:1},
 {k:'arm',n:'عضو متحرك',d:'المنتج: عليه ملفات المنتج. «لتعويض النقص في عدد لفات ملف المجال نزيد من عدد الموصلات في ملفات المنتج» (ص 59).',src:1},
 {k:'fan',n:'مروحه',d:'تدور مع المحور وتدفع الهواء لتبريد المحرك.',src:0},
 {k:'frame',n:'جسم المحرك',d:'الإطار الخارجي والأقطاب البارزة للثابت وعليها ملفات المجال. «يصنعان من شرائح الحديد، للتقليل من المفاقيد الحديدية» (ص 59).',src:1},
 {k:'shaft',n:'محور المحرك',d:'يحمل العضو المتحرك والمبدل والمروحة وينقل الحركة إلى الحمل.',src:0},
 {k:'oil',n:'نقط تزييت',d:'أماكن وضع الزيت لتزييت نقط الارتكاز وتقليل الاحتكاك.',src:0}
];
function explodedSVG(hi){
  const c=k=>k===hi?'stroke="var(--live)" stroke-width="3"':'stroke="var(--fg)" stroke-width="1.5"';
  const fill=k=>k===hi?'var(--live-soft)':'var(--surface-2)';
  let s=`<svg viewBox="0 0 700 270" role="img" aria-label="أجزاء المحرك العام">`;
  // shaft
  s+=`<g data-part="shaft" style="cursor:pointer"><rect x="20" y="124" width="660" height="12" rx="4" fill="${fill('shaft')}" ${c('shaft')}/></g>`;
  // bearings
  [[52,'brg1'],[640,'brg1']].forEach(([x])=>{s+=`<g data-part="brg1" style="cursor:pointer"><rect x="${x-14}" y="104" width="28" height="52" rx="6" fill="${fill('brg1')}" ${c('brg1')}/><circle cx="${x}" cy="130" r="9" fill="var(--surface)" ${c('brg1')}/></g>`});
  // oil points
  [[52,'l'],[640,'r']].forEach(([x])=>{s+=`<g data-part="oil" style="cursor:pointer"><path d="M${x} 72q-7 10 0 16q7 -6 0 -16z" fill="${hi==='oil'?'var(--live)':'var(--blue)'}"/><path d="M${x} 90V102" ${c('oil')}/></g>`});
  // brush holder + springs + brushes
  s+=`<g data-part="hold" style="cursor:pointer"><rect x="104" y="58" width="56" height="144" rx="6" fill="none" ${c('hold')} stroke-dasharray="${hi==='hold'?'0':'5 3'}"/></g>`;
  s+=`<g data-part="brush" style="cursor:pointer"><rect x="120" y="96" width="24" height="22" fill="${fill('brush')}" ${c('brush')}/><rect x="120" y="142" width="24" height="22" fill="${fill('brush')}" ${c('brush')}/></g>`;
  s+=`<g data-part="spring" style="cursor:pointer"><path d="M132 64l-7 4l14 4l-14 4l14 4l-14 4l14 4l-7 4V96" fill="none" ${c('spring')}/><path d="M132 196l-7 -4l14 -4l-14 -4l14 -4l-14 -4l14 -4l-7 -4V164" fill="none" ${c('spring')}/></g>`;
  // commutator
  s+=`<g data-part="comm" style="cursor:pointer"><rect x="188" y="102" width="46" height="56" rx="4" fill="${fill('comm')}" ${c('comm')}/>${[198,208,218,228].map(x=>`<path d="M${x} 102V158" stroke="var(--muted)"/>`).join('')}</g>`;
  // armature
  s+=`<g data-part="arm" style="cursor:pointer"><rect x="250" y="76" width="120" height="108" rx="6" fill="${fill('arm')}" ${c('arm')}/>${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${262+i*12} 76V184" stroke="var(--muted)" stroke-width="1"/>`).join('')}<path d="M240 96h10M240 164h10M234 110l16 -14M234 150l16 14" stroke="var(--live)" stroke-width="2"/></g>`;
  // fan
  s+=`<g data-part="fan" style="cursor:pointer">${[-1,1].map(d=>`<path d="M404 130L${396} ${130+d*58}L${420} ${130+d*52}Z" fill="${fill('fan')}" ${c('fan')}/>`).join('')}<circle cx="404" cy="130" r="9" fill="${fill('fan')}" ${c('fan')}/></g>`;
  // frame with poles + field coils
  s+=`<g data-part="frame" style="cursor:pointer"><rect x="452" y="40" width="150" height="180" rx="14" fill="${fill('frame')}" ${c('frame')}/><rect x="470" y="58" width="114" height="144" rx="8" fill="var(--surface)" stroke="var(--line)"/>
    <rect x="497" y="58" width="60" height="26" fill="${fill('frame')}" ${c('frame')}/><rect x="497" y="176" width="60" height="26" fill="${fill('frame')}" ${c('frame')}/>
    <path d="M492 88h70M492 172h70" stroke="var(--live)" stroke-width="5" stroke-linecap="round" opacity=".8"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${470+i*16} 220v8" stroke="var(--muted)"/>`).join('')}</g>`;
  // labels
  const L=[[52,252,'نقط ارتكاز'],[132,240,'ماسك الفرش'],[132,52,'ياي'],[90,108,'فرش'],[211,190,'مبدل'],[310,206,'عضو متحرك'],[404,214,'مروحه'],[527,248,'جسم المحرك'],[680,116,'محور'],[52,64,'نقط تزييت']];
  L.forEach(([x,y,t])=>{s+=arT(x,y,t,{fs:12.5})});
  return s+'</svg>';
}

/* ---------- الشكل (٤-٢): equivalent circuit ---------- */
function eqCircuitSVG(){
  let s=`<svg viewBox="0 0 520 220" role="img" aria-label="الدائرة المكافئة لمحرك التوالي العام">`;
  s+=`<circle cx="50" cy="120" r="24" class="coil"/><path d="M36 120q7 -12 14 0t14 0" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(50,166,'V1','b');
  s+=S.w('M50 96V44H90','live')+resistor(90,44,150,'live')+S.t(120,30,'Rs')+coil(150,44,210,44,4,'live')+S.t(180,30,'jXs')+S.w('M210 44H240','live')+resistor(240,44,300,'live')+S.t(270,30,'Ra')+coil(300,44,360,44,4,'live')+S.t(330,30,'jXa');
  s+=S.w('M360 44H430V92','live')+`<circle cx="430" cy="120" r="28" class="coil"/>`+S.t(430,124,'Ea','b')+`<rect x="424" y="88" width="12" height="6" fill="var(--fg)"/><rect x="424" y="146" width="12" height="6" fill="var(--fg)"/>`;
  s+=S.w('M430 148V196H50V144','live')+arrow(62,60,62,80,'--blue',2)+S.t(78,74,'Ia','b','start');
  s+=arT(470,64,'المنتج',{fs:12})+arT(155,74,'ملف المجال (التوالي)',{fs:12})+arT(300,74,'ملف المنتج',{fs:12});
  return s+'</svg>';
}
/* phasor diagram per الشكل (٤-٢): Ia reference; IaRs → IaXs ↑ → IaRa → IaXa ↑ → Ea →, sum = V1.
   E is drawn in phase with I as in the book. returns {svg, phi, pf, E, ok} */
function phasorCalc(V,I,Ra,Xa,Rs,Xs){const X=Xa+Xs,R=Ra+Rs;const sp=I*X/V;if(sp>=1)return {ok:false};const phi=Math.asin(sp),E=V*Math.cos(phi)-I*R;return {ok:E>0,phi:phi/D,pf:Math.cos(phi),E,R,X}}
function phasorSVG(V,I,Ra,Xa,Rs,Xs,o){o=o||{};const r=phasorCalc(V,I,Ra,Xa,Rs,Xs);const W=520,H=o.h||250;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط الطور">`;
  if(!r.ok){return s+arT(W/2,H/2,'لا يمكن لهذا الجهد أن يمرر هذا التيار: قلّل التيار أو المعاوقة',{col:'--stop'})+'</svg>'}
  const ox=30,oy=H-40,sc=Math.min((W-80)/(V*Math.cos(r.phi*D)),(H-80)/(V*Math.sin(r.phi*D)+1e-9),(W-80)/V);
  const pts=[[0,0]];const seg=[['IaRs',I*Rs,0,'--blue'],['IaXs',0,I*Xs,'--on'],['IaRa',I*Ra,0,'--blue'],['IaXa',0,I*Xa,'--on'],['Ea',r.E,0,'--live']];
  let x=0,y=0;const P=(a,b)=>[ox+a*sc,oy-b*sc];
  s+=`<path d="M${ox} ${oy}H${W-20}" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  // Ia reference arrow
  s+=arrow(ox,oy+18,ox+Math.min(150,(W-80)*0.35),oy+18,'--muted',2)+S.t(ox+Math.min(150,(W-80)*0.35)+8,oy+22,'Ia','m','start');
  seg.forEach(([lb,dx,dy,col],i)=>{const a=P(x,y);x+=dx;y+=dy;const b=P(x,y);s+=arrow(a[0],a[1],b[0],b[1],col,i===4?3:2.4);
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;if(Math.hypot(b[0]-a[0],b[1]-a[1])>8)s+=dy?S.t(mx+6,my+4,lb,'m','start'):S.t(mx,my+(i===4?16:14),lb,i===4?'':'m')});
  const e=P(x,y);s+=arrow(ox,oy,e[0],e[1],'--fg',2.6)+S.t((ox+e[0])/2-8,(oy+e[1])/2-8,'V1','','end');
  const ar=40;s+=`<path d="M${ox+ar} ${oy}A${ar} ${ar} 0 0 0 ${fx(ox+ar*Math.cos(r.phi*D))} ${fx(oy-ar*Math.sin(r.phi*D))}" fill="none" stroke="var(--muted)"/>`+S.t(ox+ar+16,oy-8,'φ','m','start');
  return s+'</svg>';
}
/* ---------- الشكل (٤-٣) curves (values read from the printed figure: approximate) ---------- */
const DC43=[[0.45,4.0],[0.6,3.0],[0.8,2.0],[1.0,1.3]],AC43=[[0.1,4.0],[0.2,3.2],[0.5,2.0],[1.0,1.0]];
const fDC=mono(DC43),fAC=mono(AC43);
const sample=(f,a,b)=>{const p=[];for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;p.push([x,f(x)])}return p};
const invSpeed=(f,a,T)=>{let lo=a,hi=1;if(T>f(lo)||T<f(hi))return null;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(f(m)>T)lo=m;else hi=m}return (lo+hi)/2};
function fig43SVG(T){return plotSVG({x0:0,x1:1.05,y0:0,y1:4.3,xt:[0.2,0.4,0.6,0.8,1.0],yt:[0,1,2,3,4],yf:v=>v.toFixed(1),xl:'Speed (pu)',yl:'Torque (pu)',aria:'خواص محرك التوالي العام',
  series:[{pts:sample(fDC,0.45,1),col:'--blue',w:2.8},{pts:sample(fAC,0.1,1),col:'--live',w:2.8}],
  extra:(X,Y)=>{let s=S.t(X(0.62)+8,Y(fDC(0.62))-6,'D.C','b','start')+S.t(X(0.3)-6,Y(fAC(0.3))-4,'A.C','','end');
    if(T!=null){const nd=invSpeed(fDC,0.45,T),na=invSpeed(fAC,0.1,T);s+=`<path d="M${X(0)} ${fx(Y(T))}H${X(1.05)}" stroke="var(--stop)" stroke-dasharray="6 4" stroke-width="1.6"/>`;
      if(na!=null)s+=`<circle cx="${fx(X(na))}" cy="${fx(Y(T))}" r="6" fill="var(--live)"/><path d="M${fx(X(na))} ${fx(Y(T))}V${Y(0)}" stroke="var(--live)" stroke-dasharray="3 3"/>`;
      if(nd!=null)s+=`<circle cx="${fx(X(nd))}" cy="${fx(Y(T))}" r="6" fill="var(--blue)"/><path d="M${fx(X(nd))} ${fx(Y(T))}V${Y(0)}" stroke="var(--blue)" stroke-dasharray="3 3"/>`}
    return s}})}

/* ---------- example (٤-١) procedure (book rounding points) ---------- */
// bk: printed slips used only with the book's own input values
const BK41={phi:24.58,zm:3.446,izm:60.68,Em:74.05,Ea:-24.2};
const ang=(m,a,adp,mdp)=>`${m.toFixed(mdp==null?2:mdp)}∠${a<0?'−':''}${Math.abs(a).toFixed(adp==null?1:adp)}`;
function uniSteps(g,B,bk){
  const phi=bk?bk.phi:B.round(Math.acos(g.pf)/D,2);
  const R=B.round(g.Ra+g.Rs,2),X=B.round(g.Xa+g.Xs,2);
  const zm=bk?bk.zm:B.round(Math.hypot(R,X),3),za=B.round(Math.atan2(X,R)/D,3);
  const izm=bk?bk.izm:B.round(g.I*zm,2),iza=B.round(za-phi,3);
  let Em,Ea;if(bk){Em=bk.Em;Ea=bk.Ea}else{const re=g.V-izm*Math.cos(iza*D),im=-izm*Math.sin(iza*D);Em=B.round(Math.hypot(re,im),2);Ea=B.round(Math.atan2(im,re)/D,1)}
  const Pd=B.round(Em*g.I,0),Po=B.round(Pd-g.PL,0),w=B.round(2*Math.PI*g.N/60,2),T=B.round(Po/w,2),Pin=B.round(g.V*g.I*g.pf,2),eta=B.round(Po/Pin,3);
  const n=v=>B.fmtN(v),neg=v=>v<0?'-'+n(-v):n(v);
  return [
   {t:'زاوية التيار من معامل القدرة'+(bk?' (كما استعملها الكتاب في الخطوات):':':'),f:`\\phi=\\cos^{-1}(${n(g.pf)})`,v:phi,unit:'°',dp:2},
   {t:'من معادلة جهد المحرك (٤-١)، الجهد المتولد:',f:`E_a=V_1-I_a(R_a+R_s+jX_a+jX_s)=${n(g.V)}-${n(g.I)}\\angle{-${n(phi)}^\\circ}\\,(${n(g.Ra)}+${n(g.Rs)}+j${n(g.Xa)}+j${n(g.Xs)})`},
   {t:'نجمع المقاومات والمعاوقات:',f:`=${n(g.V)}-${n(g.I)}\\angle{-${n(phi)}^\\circ}\\times(${n(R)}+j${n(X)})=${n(g.V)}-${n(g.I)}\\angle{-${n(phi)}^\\circ}\\times(${n(zm)}\\angle{${n(za)}^\\circ})`,v:ang(zm,za,3,3),unit:'Ω'},
   {t:'نضرب المقدارين ونجمع الزاويتين:',f:`=${n(g.V)}-${n(izm)}\\angle{${neg(iza)}^\\circ}`,v:ang(izm,iza,3),unit:'V'},
   {t:'الجهد المتولد:',f:`E_a=${n(Em)}\\angle{${neg(Ea)}^\\circ}`,v:ang(Em,Ea,1),unit:'V',final:true},
   Math.abs(Ea+phi)<1?{t:'«يلاحظ أن زاوية الوجه للقوة الدافعة الكهربائية المتولدة لها نفس قيمة زاوية الوجه للتيار.»'}:{t:'زاوية E<sub>a</sub> هنا لا تساوي زاوية التيار (−'+n(phi)+'°)، بخلاف ملاحظة الكتاب في مثال (٤-١).'},
   {t:'القدرة المتولدة (٤-٢):',f:`P_d=E_a\\,I_a=${n(Em)}\\times${n(g.I)}`,v:Pd,unit:'W',dp:0},
   {t:'قدرة الخرج (٤-٣):',f:`P_o=P_d-P_L=${n(Pd)}-${n(g.PL)}`,v:Po,unit:'W',dp:0,final:true},
   {t:'سرعة المحرك الزاوية:',f:`\\omega_m=\\frac{2\\pi N_m}{60}=\\frac{2\\pi\\times${n(g.N)}}{60}`,v:w,unit:'rad/sec',dp:2},
   {t:'عزم الخرج (٤-٥):',f:`T_o=\\frac{P_o}{\\omega_m}=\\frac{${n(Po)}}{${n(w)}}`,v:T,unit:'N.m',dp:2,final:true},
   {t:'قدرة الدخل (٤-٤):',f:`P_{in}=V_1 I_a\\cos\\phi=${n(g.V)}\\times${n(g.I)}\\times${n(g.pf)}`,v:Pin,unit:'W',dp:2},
   {t:'كفاءة المحرك (٤-٦):',f:`\\eta=\\frac{P_o}{P_{in}}=\\frac{${n(Po)}}{${n(Pin)}}=${n(eta)}`,v:B.round(eta*100,1),unit:'%',dp:1,final:true}
  ];
}
const G41=[{id:'V',label:'جهد المصدر',sym:'V_1',unit:'V',value:120},{id:'I',label:'تيار المحرك',sym:'I_a',unit:'A',value:17.58},{id:'pf',label:'معامل القدرة (متأخر)',sym:'\\cos\\phi',unit:'',value:0.912,step:0.001},
 {id:'N',label:'السرعة',sym:'N_m',unit:'rpm',value:8000},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:1.36},{id:'Xa',label:'المعاوقة الحثية للمنتج',sym:'X_a',unit:'Ω',value:1.6},
 {id:'Rs',label:'مقاومة المجال',sym:'R_s',unit:'Ω',value:0.65},{id:'Xs',label:'المعاوقة الحثية للمجال',sym:'X_s',unit:'Ω',value:1.2},{id:'PL',label:'المفاقيد الحديدية والميكانيكية',sym:'P_L',unit:'W',value:80}];
const cloneG=(arr,vals)=>arr.map(g=>Object.assign({},g,vals&&vals[g.id]!=null?{value:vals[g.id]}:{}));

/* =================== Lesson 4.1 =================== */
B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'58–60',
 title:'المحرك العام: لماذا يعمل على التيارين؟ وتركيبه',
 summary:'محرك التوالي العام يعمل على التيار المستمر والمتردد لأن تياري المجال والمنتج ينعكسان معاً فيبقى العزم في اتجاه واحد. ونتعرف على أجزائه والتحسينات اللازمة لتشغيله بالتيار المتردد.',
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة',ref:'ص 58',html:`<p><b>الهدف العام:</b> «معرفة تركيب وخواص واستخدام كل من محرك التوالي العام والمحرك التنافري.»</p>
   <ol><li>أن يعرف المتدرب تركيب وكيفية عمل محرك التوالي العام.</li><li>أن يعرف المتدرب خواص واستخدامات محرك التوالي العام.</li><li>أن يعرف المتدرب تركيب وكيفية عمل المحرك التنافري.</li><li>أن يعرف المتدرب خواص واستخدامات المحرك التنافري.</li></ol>`},
  {h:'٤-١ محرك التوالي العام',ref:'ص 59',html:`<p>«محرك التوالي العام أو المحرك العام هو محرك يعمل على كل من مصدري التيار المستمر والتيار المتردد، من هنا جاءت التسمية بالمحرك العام.»</p>
   <p>«إذا قمنا بعكس قطبية كل من تياري المنتج والمجال في محركات التيار المستمر في نفس اللحظة سيستمر المحرك في الدوران في نفس الاتجاه، لأن اتجاه العزم المتولد لم يتغير.»</p>
   <p>«بما أن ملفات المنتج وملفات المجال موصلان على التوالي … فإن تياري المنتج والمجال يكونان منطبقين، الزاوية بينهما صفر، وينعكس كل منهما في نفس اللحظة عندما يوصل المحرك مع مصدر للتيار المتردد، وبالتالي سيتولد <b>عزم نابض بضعف تردد المصدر</b> ولكن <b>في اتجاه واحد</b>، وذي قيمة متوسطة تعمل على دوران المحرك.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> العزم يتناسب مع حاصل ضرب تيار المجال في تيار المنتج. في محرك التوالي التيار واحد، فالعزم يتناسب مع مربعه \\(T \\propto i^2\\)، والمربع موجب دائماً سواء كان التيار موجباً أو سالباً. لذلك:
   <table class="tt"><tr><th>ماذا عكسنا؟</th><th>تيار المجال</th><th>تيار المنتج</th><th>اتجاه العزم</th></tr>
   <tr><td>لا شيء</td><td>+</td><td>+</td><td>↺ نفس الاتجاه</td></tr>
   <tr><td>قطبية المصدر (التياران معاً)</td><td>−</td><td>−</td><td>↺ نفس الاتجاه</td></tr>
   <tr><td>أطراف ملف المجال فقط</td><td>−</td><td>+</td><td>↻ ينعكس</td></tr>
   <tr><td>أطراف المنتج (الفرش) فقط</td><td>+</td><td>−</td><td>↻ ينعكس</td></tr></table>
   جرّب ذلك في تبويب «المختبر».`},
  {h:'٤-١-١ تركيب المحرك العام',ref:'ص 59–60',html:`<p>«شكل (٤-١) يوضح تركيب محرك التوالي العام هو نفس تركيب آلات التيار المستمر ذات تغذية توالي، عند تصميم محرك التوالي ليعمل على مصدر للتيار المتردد، لابد من بذل الجهود لتحسين أداء المحرك ورفع كفاءته:»</p>
   <ul><li>«فالإطار الخارجي والأقطاب البارزة للثابت يصنعان من <b>شرائح الحديد</b>، للتقليل من المفاقيد الحديدية التي تكون مصاحبة للتيار المتردد ومتناسبة مع تردد المصدر.»</li>
   <li>«كما يتم لف ملفات المجال <b>بعدد أقل من اللفات</b> للتقليل من المجال المغناطيسي وبالتالي التقليل من المفاقيد الحديدية، لتعويض النقص في عدد لفات ملف المجال <b>نزيد من عدد الموصلات في ملفات المنتج</b>.»</li></ul>
   <p>«عندما يعمل المحرك بالتيار المتردد تتولد جهود تحويل في ملفات المنتج، مما يتسبب في حدوث <b>شرارة كهربائية</b> بين الفرش الكربونية والمبدل، الشرارة الكهربائية تعمل على تآكل المبدل والتقليل من عمر الفرش الكربونية، للحد من هذا التأثير السلبي على أداء المحرك، تستخدم <b>فرش كربونية ذات مقاومة مادية كبيرة</b> لكبح الشرارة الكهربائية. كما يمكن تحسين عملية التبديل بإضافة <b>أقطاب بينية (Interpoles)</b> و<b>زيادة عدد قطع المبدل</b>، لتقليل فرق الجهد بين القطع المتجاورة، مما يقلل من الشرارة الكهربائية.»</p>`},
  {h:'تحسينات التشغيل بالتيار المتردد (ملخص)',html:`<table class="tt"><tr><th>المشكلة مع التيار المتردد</th><th>الحل في الكتاب</th></tr>
   <tr><td>مفاقيد حديدية تتناسب مع التردد</td><td>الإطار والأقطاب من شرائح الحديد</td></tr>
   <tr><td>مجال مغناطيسي كبير ومفاقيد</td><td>لفات أقل في ملف المجال، وموصلات أكثر في المنتج</td></tr>
   <tr><td>شرارة بين الفرش والمبدل</td><td>فرش ذات مقاومة كبيرة، أقطاب بينية، قطع مبدل أكثر</td></tr></table>`},
  {widget:(el)=>{let hi='comm';const draw=()=>{const p=PARTS.find(x=>x.k===hi);
     el.innerHTML=`<figure class="fig"><div class="svgbox" style="max-width:760px;margin-inline:auto">${explodedSVG(hi)}</div><figcaption><b>الشكل (٤-١)</b> محرك التوالي العام — اضغط أي جزء لتعرف اسمه (رسم مبسط يعيد ترتيب أجزاء الشكل المفكك) <span class="ref">ص 60</span></figcaption></figure>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${PARTS.map(x=>`<button class="btn" data-p="${x.k}" aria-pressed="${x.k===hi}" style="${x.k===hi?'border-color:var(--live);background:var(--live-soft)':''}">${x.n}</button>`).join('')}</div>
      <div class="callout"><b>${p.n}:</b> ${p.d}${p.src?'':' <span class="sub">(وظيفة الجزء توضيح للمتدرب؛ الكتاب يذكر اسمه فقط على الشكل.)</span>'}</div>`;
     el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{hi=b.dataset.p;draw()});
     el.querySelectorAll('[data-part]').forEach(g=>g.addEventListener('click',()=>{hi=g.dataset.part;draw()}))};draw()}}
 ],
 lab:(el,B)=>{
  let src='ac',pol=1,revF=0,on=1,f=60,ph=0,rot=0,w=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مختبر: انعكاس التيارين معاً <small>مبني على نص ص 59 ودائرة الشكل (٤-٢)</small></h2>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">المصدر</div>${segHTML('src',[['dc','تيار مستمر DC'],['ac','تيار متردد AC']],src)}</div>
     <div><div class="sub">التشغيل</div>${segHTML('on',[[1,'موصل'],[0,'مفصول']],on)}</div>
     <div><div class="sub">أطراف ملف المجال</div>${segHTML('rev',[[0,'عادية'],[1,'معكوسة']],revF)}</div>
     <div id="polBox"><div class="sub">قطبية المصدر DC</div>${segHTML('pol',[[1,'+ / −'],[-1,'− / +']],pol)}</div>
     <div id="fBox"><div class="sub">تردد المصدر</div>${segHTML('f',[[50,'50 Hz'],[60,'60 Hz']],f)}</div>
    </div>
    <div class="facts"><div class="fact"><span>التيار في الملفين</span><b id="rI"></b></div><div class="fact"><span>العزم اللحظي (نسبي)</span><b id="rT"></b></div><div class="fact"><span>متوسط العزم (نسبي)</span><b id="rA"></b></div><div class="fact"><span>تردد نبض العزم</span><b id="rF"></b></div><div class="fact"><span>اتجاه الدوران</span><b id="rD"></b></div></div></div>
   <div class="panel c7"><h2>محرك التوالي <small>المجال والمنتج على التوالي</small></h2><div class="svgbox" id="mv" style="max-width:560px;margin-inline:auto"></div><p class="sub" id="mtxt"></p></div>
   <div class="panel c5"><h2>التيار والعزم خلال دورتين</h2><div class="svgbox" id="wv"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>التيار i (المجال = المنتج)</span><span><i style="background:var(--live)"></i>العزم اللحظي</span><span><i style="background:var(--stop)"></i>متوسط العزم</span></div>
    <p class="sub">العرض مبطّأ جداً لتراه بعينك (دورة كل ثانيتين). القيم نسبية (أرقام توضيحية)، والتيار المستمر مأخوذ بنفس القيمة الفعالة للمتردد.</p></div>
   <div class="panel c12">${tryList(['شغّل على <b>AC</b>: لاحظ أن سهم المجال وسهم تيار المنتج ينقلبان <b>معاً</b>، والعزم ينبض بضعف التردد لكنه لا يصير سالباً، فيدور الدوار في اتجاه واحد.','بدّل إلى <b>DC</b> ثم اعكس قطبية المصدر: ينعكس التياران معاً ويبقى اتجاه الدوران كما هو.','اعكس <b>أطراف ملف المجال فقط</b>: ينقلب العزم فيعكس المحرك اتجاهه (هذا جواب س٤-٣).','قارن تردد نبض العزم عند 50 Hz و 60 Hz: هو دائماً ضعف تردد المصدر.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const bind=(a,fn)=>el.querySelectorAll(`[data-${a}]`).forEach(b=>b.addEventListener('click',()=>{fn(b.dataset[a]);segSet(el,a,b.dataset[a])}));
  bind('src',v=>{src=v});bind('on',v=>{on=+v});bind('rev',v=>{revF=+v});bind('pol',v=>{pol=+v});bind('f',v=>{f=+v});
  const RX=330,RY=150,RR=46;
  const stat=`<svg viewBox="0 0 520 300" role="img" aria-label="محرك توالي">
   <g id="srcG"></g>
   ${S.w('M60 122V44H140','live')}${coil(140,44,250,44,5,'live')}${S.w(`M250 44H${RX}V${RY-RR-10}`,'live')}
   ${S.w(`M${RX} ${RY+RR+10}V266H60V178`,'live')}
   <rect x="240" y="104" width="26" height="92" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><rect x="394" y="104" width="26" height="92" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>
   <path d="M266 108q14 42 0 84M394 108q-14 42 0 84" fill="none" stroke="var(--line)" stroke-width="1.4"/>
   <g id="rot"><circle cx="${RX}" cy="${RY}" r="${RR}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>${[0,45,90,135].map(a=>`<path d="M${fx(RX+RR*0.9*Math.cos(a*D))} ${fx(RY+RR*0.9*Math.sin(a*D))}L${fx(RX-RR*0.9*Math.cos(a*D))} ${fx(RY-RR*0.9*Math.sin(a*D))}" stroke="var(--muted)" stroke-width="1.4"/>`).join('')}<circle cx="${RX+RR*0.62}" cy="${RY}" r="6" fill="var(--blue)"/></g>
   <rect x="${RX-8}" y="${RY-RR-12}" width="16" height="10" fill="var(--fg)"/><rect x="${RX-8}" y="${RY+RR+2}" width="16" height="10" fill="var(--fg)"/>
   ${arT(195,30,'ملف المجال (التوالي)',{fs:12})}${arT(RX,292,'المنتج (الدوار) والفرش',{fs:12})}
   <g id="dyn"></g></svg>`;
  $('#mv').innerHTML=stat;
  const dyn=$('#dyn'),rotG=$('#rot'),srcG=$('#srcG');let lastSrc='';
  loopOn(el,dt=>{
   $('#polBox').style.display=src==='dc'?'':'none';$('#fBox').style.display=src==='ac'?'':'none';
   ph+=2*Math.PI*0.5*dt;
   const i=!on?0:src==='dc'?pol*0.7071:Math.sin(ph),iF=revF?-i:i,T=iF*i,Tav=!on?0:(revF?-0.5:0.5);
   w+=(4*T-1.0*w)*dt/0.8;rot+=w*dt*60;
   rotG.setAttribute('transform',`rotate(${(-rot).toFixed(1)} ${RX} ${RY})`);
   const sk=src+pol;if(sk!==lastSrc){lastSrc=sk;srcG.innerHTML=`<circle cx="60" cy="150" r="26" class="coil"/>`+(src==='ac'?`<path d="M45 150q7.5 -13 15 0t15 0" fill="none" stroke="var(--fg)" stroke-width="1.8"/>`+S.t(60,196,'AC','b'):S.t(60,140,pol>0?'+':'−','',null,18)+S.t(60,170,pol>0?'−':'+','',null,18)+S.t(60,196,'DC','b'))}
   let s='';const L=Math.abs(i)*44;
   // field current arrow on the top wire, armature current arrow at the brush lead
   if(L>2){s+=i>0?arrow(90,58,90+L,58,'--blue',2.4):arrow(90+44,58,90+44-L,58,'--blue',2.4);s+=S.t(112,76,'if','b');
     const yA=RY-RR-40;s+=i>0?arrow(RX+16,yA-L/2,RX+16,yA+L/2,'--blue',2.4):arrow(RX+16,yA+L/2,RX+16,yA-L/2,'--blue',2.4);s+=S.t(RX+26,yA+4,'ia','b','start')}
   // field flux across the poles
   const LF=Math.abs(iF)*60;if(LF>2)s+=iF>0?arrow(RX-LF,RY,RX+LF,RY,'--on',3.2):arrow(RX+LF,RY,RX-LF,RY,'--on',3.2);
   if(Math.abs(iF)>0.05){const nL=iF>0?'S':'N',nR=iF>0?'N':'S';s+=S.t(253,RY+5,nL,'b',null,15)+S.t(407,RY+5,nR,'b',null,15)}
   s+=arcArrow(RX,RY,RR+20,Math.sign(T),Math.abs(T),'--live');
   s+=S.t(RX+62,RY-RR-8,'T','',null,13);
   dyn.innerHTML=s;
   // waveform plot (two source cycles)
   const per=1000/f,tc=((ph/(2*Math.PI))%2+2)%2,pts=[],tq=[];const sg=revF?-1:1;
   for(let k=0;k<=80;k++){const u=k/80*2;const ii=!on?0:src==='dc'?pol*0.7071:Math.sin(u*2*Math.PI);pts.push([u*per,ii]);tq.push([u*per,sg*ii*ii])}
   $('#wv').innerHTML=plotSVG({w:420,h:250,x0:0,x1:2*per,y0:-1.15,y1:1.15,xt:[0,per/2,per,1.5*per,2*per],xf:v=>v.toFixed(0),yt:[-1,-0.5,0,0.5,1],yf:v=>v.toFixed(1),xl:'t (ms)',aria:'التيار والعزم',
     series:[{pts,col:'--blue'},{pts:tq,col:'--live',w:2.8},{pts:[[0,Tav],[2*per,Tav]],col:'--stop',w:1.8,dash:'6 4'}],
     extra:(X,Y)=>`<path d="M${fx(X(tc*per))} ${Y(1.15)}V${Y(-1.15)}" stroke="var(--fg)" stroke-width="1.2"/><circle cx="${fx(X(tc*per))}" cy="${fx(Y(T))}" r="4.5" fill="var(--live)"/>`});
   const pm=v=>(v>-0.005?'+':'−')+Math.abs(v).toFixed(2);$('#rI').textContent=pm(i);$('#rT').textContent=pm(T);$('#rA').textContent=pm(Tav);
   $('#rF').textContent=!on?'—':src==='ac'?(2*f)+' Hz':'0 (ثابت)';$('#rD').textContent=!on?'متوقف':Tav>0?'↺ الاتجاه الأصلي':'↻ معكوس';
   $('#mtxt').innerHTML=!on?'المصدر مفصول: لا تيار ولا عزم.':src==='ac'?(revF?'التيار يتردد، ومجال الأقطاب معكوس التوصيل: العزم سالب دائماً فيدور المحرك في الاتجاه المعاكس.':'التيار يتردد فينقلب المجال وتيار المنتج <b>في نفس اللحظة</b>: العزم ينبض لكنه موجب دائماً.'):(revF?'عكس المجال وحده يقلب العزم فينعكس الدوران.':pol>0?'تيار مستمر: عزم ثابت في اتجاه واحد.':'عكسنا قطبية المصدر فانعكس التياران معاً: العزم بقي في نفس الاتجاه.');
  });
 },
 quiz:[
  {q:'لماذا سُمّي المحرك العام بهذا الاسم؟',o:['لأنه يستخدم في كل الأجهزة','لأنه يعمل على مصدري التيار المستمر والمتردد','لأنه يعمل على ثلاثة أوجه','لأن سرعته ثابتة'],c:1,e:'«محرك يعمل على كل من مصدري التيار المستمر والتيار المتردد، من هنا جاءت التسمية» (ص 59).'},
  {q:'كيف يوصل ملف المجال مع ملف المنتج في المحرك العام؟',o:['على التوازي','على التوالي','لا يوصلان','بمحول'],c:1,e:'هو محرك توالي، فالتيار نفسه يمر في الملفين.'},
  {q:'عند تشغيل المحرك العام بالتيار المتردد، العزم المتولد يكون:',o:['متردداً بنفس تردد المصدر ومتوسطه صفر','نابضاً بضعف تردد المصدر وفي اتجاه واحد','ثابتاً تماماً','نابضاً بنصف تردد المصدر'],c:1,e:'«سيتولد عزم نابض بضعف تردد المصدر ولكن في اتجاه واحد» (ص 59).'},
  {q:'إذا عكسنا قطبية تياري المنتج والمجال معاً في نفس اللحظة فإن المحرك:',o:['يتوقف','يعكس اتجاهه','يستمر في نفس الاتجاه','يدور بسرعة مضاعفة'],c:2,e:'«سيستمر المحرك في الدوران في نفس الاتجاه، لأن اتجاه العزم المتولد لم يتغير» (ص 59).'},
  {q:'لماذا يصنع الإطار والأقطاب البارزة من شرائح الحديد؟',o:['لزيادة الوزن','للتقليل من المفاقيد الحديدية المصاحبة للتيار المتردد','لزيادة الشرارة','لتسهيل التبريد فقط'],c:1,e:'المفاقيد الحديدية تصاحب التيار المتردد وتتناسب مع تردد المصدر (ص 59).'},
  {q:'ما الذي يُعوَّض به نقص عدد لفات ملف المجال؟',o:['زيادة عدد موصلات المنتج','زيادة الجهد','تقليل عدد قطع المبدل','إزالة الفرش'],c:0,e:'«لتعويض النقص في عدد لفات ملف المجال نزيد من عدد الموصلات في ملفات المنتج» (ص 59).'},
  {q:'أي مما يلي <b>ليس</b> من طرق الحد من الشرارة بين الفرش والمبدل في الكتاب؟',o:['فرش ذات مقاومة مادية كبيرة','أقطاب بينية Interpoles','زيادة عدد قطع المبدل','زيادة عدد لفات ملف المجال'],c:3,e:'الكتاب يقلل لفات المجال لا يزيدها؛ والطرق الثلاث الأخرى مذكورة ص 59.'},
  {q:'كيف نعكس اتجاه دوران المحرك العام؟',o:['بعكس قطبية المصدر','بعكس أطراف ملف المجال فقط (أو المنتج فقط)','بتغيير التردد','بزيادة الجهد'],c:1,e:'عكس الاثنين معاً لا يغير الاتجاه؛ نعكس أحدهما فقط (استنتاج من نص ص 59، وهو س٤-٣).'}
 ]
});

/* =================== Lesson 4.2 =================== */
B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'60–63',
 title:'الدائرة المكافئة وخواص المحرك العام ومثال (٤-١)',
 summary:'نحلل المحرك العام بالدائرة المكافئة ومعادلات محرك التوالي، ونقارن خواصه على AC و DC، ونحل مثال الكتاب بحاسبة تعرض أرقامه.',
 theory:[
  {h:'تحليل الخواص بالدائرة المكافئة',ref:'ص 60',html:`<p>«يمكن تحليل خواص المحرك العام باستخدام الدائرة المكافئة ومعادلات المحرك التوالي للتيار المستمر كما هو واضح من الشكل (٤-٢) مع إدخال التعديلات المناسبة كالتالي:»</p>
   <p>جهد المحرك، الجهد المتولد:</p>$$E_a = V_1 - I_a Z_a - I_s Z_s \\qquad (٤\\text{-}١)$$$$E_a = V_1 - I_a\\,(R_a + R_s + jX_a + jX_s)$$
   <p>القدرة المتولدة:</p>$$P_d = E_a \\cdot I_a \\qquad (٤\\text{-}٢)$$<p>قدرة الخرج:</p>$$P_o = P_d - P_{losses} \\qquad (٤\\text{-}٣)$$
   <p>قدرة الدخل:</p>$$P_{in} = V_1\\, I_a \\cdot \\cos(\\phi) \\qquad (٤\\text{-}٤)$$<p>عزم الخرج:</p>$$T_o = \\frac{P_o}{\\omega_m}\\quad \\text{N.m} \\qquad (٤\\text{-}٥)$$<p>الكفاءة:</p>$$\\eta = \\frac{P_o}{P_{in}} \\qquad (٤\\text{-}٦)$$`},
  {note:`<b>معاني الرموز (من الشكل والمثال):</b> \\(V_1\\) جهد المصدر؛ \\(I_a\\) تيار المنتج وهو نفسه تيار المجال \\(I_s\\) لأنهما على التوالي؛ \\(R_a, X_a\\) مقاومة ومعاوقة ملف المنتج الحثية؛ \\(R_s, X_s\\) مقاومة ومعاوقة ملف المجال الحثية؛ \\(E_a\\) الجهد المتولد (القوة الدافعة الكهربائية العكسية)؛ \\(\\omega_m\\) السرعة الزاوية بوحدة rad/sec؛ \\(\\phi\\) زاوية معامل القدرة.`},
  {fig:'(٤-٢)',ref:'ص 61',caption:'الدائرة المكافئة لمحرك التوالي العام',draw:()=>box(eqCircuitSVG(),560)},
  {fig:'(٤-٢)',ref:'ص 61',caption:'مخطط الطور (Phasor diagram): التيار مرجع أفقي، ثم IaRs و IaXs و IaRa و IaXa ثم Ea في طور التيار، ومجموعها V1 — مرسوم هنا بأرقام مثال (٤-١)',draw:()=>box(phasorSVG(120,17.58,1.36,1.6,0.65,1.2),560)},
  {h:'٤-١-٢ خواص واستخدامات المحرك العام',ref:'ص 61',html:`<p>«محرك التوالي العام يمكنه أن يعمل بسرعات عالية قد تصل إلى <b>15000 لفة في الدقيقة</b>، وينتج عزماً كبيراً، فهو <b>ذو قدرة عالية مقارنة بحجمه</b>، فيستخدم في التطبيقات التي تتطلب خفة في وزن المحرك المستخدم مع قدرات عالية، مثل الأجهزة المنزلية كالمكانس الكهربائية والخلاطات، وأيضا يستخدم في المثقاب الكهربائي وآلات الحياكة الكهربائية.»</p>
   <p>«الشكل (٤-٣) يوضح خواص المحرك العام، يتضح من الشكل، أن خواص المحرك تختلف بعض الشيء عند تشغيله بالتيار المتردد، عن خواصه عند التشغيل بالتيار المستمر، وذلك لسببين:</p>
   <ul><li>معاوقة ملفات المنتج وملفات المجال تمتص جزءاً من جهد المصدر، وبالتالي تكون <b>السرعة أقل</b> عند استخدام الجهد المتردد عنها في حالة استخدام نفس الجهد المستمر.</li>
   <li>قد تصل الدائرة المغناطيسية إلى حالة <b>التشبع المغناطيسي</b> عند القيم العظمى للتيار المتردد، مما يقلل من قيمة المجال المغناطيسي وبالتالي العزم المتولد.»</li></ul>`},
  {fig:'(٤-٣)',ref:'ص 61',caption:'خواص محرك التوالي العام (المنحنيان مرسومان من قيم مقروءة من شكل الكتاب، فهي تقريبية)',draw:()=>box(fig43SVG(null),560)},
  {h:'مثال (٤-١)',ref:'ص 62–63',html:`<p>«محرك عام 120 فولت، 60 هيرتز، ذو زوج واحد من الأقطاب، يدور بسرعة 8000 لفة في الدقيقة ويسحب تياراً مقداره 17.58 أمبير بمعامل قدره 0.912 متأخر. ثوابت ملفات المنتج والمجال كالآتي: \\(R_a = 1.36\\,Ω\\)، \\(X_a = 1.6\\,Ω\\)، \\(R_s = 0.65\\,Ω\\)، \\(X_s = 1.2\\,Ω\\). احسب: الجهد المتولد وقدرة الخرج والعزم المتولد وكفاءة المحرك، إذا كانت المفاقيد الحديدية والميكانيكية 80 وات.»</p>
   <p>الحل خطوة بخطوة بأرقام الكتاب في تبويب «الأمثلة المحلولة». نتائج الكتاب: \\(E_a = 74.05\\angle{-24.2^\\circ}\\) V، \\(P_d = 1302\\) W، \\(P_o = 1222\\) W، \\(\\omega_m = 837.76\\) rad/sec، \\(T_o = 1.46\\) N.m، \\(P_{in} = 1923.96\\) W، \\(\\eta = 63.5\\%\\).</p>
   <p>«يلاحظ أن زاوية الوجه للقوة الدافعة الكهربائية المتولدة لها نفس قيمة زاوية الوجه للتيار.»</p>`},
  {err:`في حل مثال (٤-١) ص 62: (١) استعمل الكتاب زاوية التيار <span class="ltr">24.58°</span> بينما <span class="ltr">cos⁻¹(0.912) = 24.22°</span>. (٢) طُبع <span class="ltr">17.58 × 3.446 = 60.68</span> والصحيح <span class="ltr">60.58</span> (و <span class="ltr">|2.01 + j2.8| = 3.4468</span> أي 3.447 بالتقريب). (٣) النتيجة المطبوعة <span class="ltr">74.05∠−24.2</span> لا تخرج من السطر الذي قبلها <span class="ltr">120 − 60.68∠29.747</span> (يعطي <span class="ltr">73.74∠−24.1</span>)، لكنها قريبة من الحساب الصحيح بالزاوية 24.22° الذي يعطي <span class="ltr">74.10∠−24.2 V</span>. أثر ذلك صغير: بالحساب المصحح \\(P_d = 1303\\) W و \\(P_o = 1223\\) W و \\(T_o = 1.46\\) N.m و \\(\\eta = 63.6\\%\\). في تبويب «الأمثلة المحلولة» تجد الحل <b>كما في الكتاب</b> والحل <b>المصحح</b>.`},
  {err:'معطيان في السؤال لم يُستخدما في الحل: «60 هيرتز» و«زوج واحد من الأقطاب».'}
 ],
 lab:(el,B)=>{
  const V0={V:120,I:17.58,Ra:1.36,Xa:1.6,Rs:0.65,Xs:1.2,PL:80};let v=Object.assign({},V0),Tq=2.0;
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>مخطط الطور الحي <small>مبني على الشكل (٤-٢) ص 61</small></h2><div class="svgbox" id="ph"></div>
    <div class="facts" id="phF"></div><p class="sub">نرسم E<sub>a</sub> في طور التيار كما في شكل الكتاب، فتخرج زاوية φ ومعامل القدرة من الدائرة نفسها: <span class="ltr">sin φ = Ia(Xa+Xs)/V1</span> (توضيح للمتدرب). بقيم مثال (٤-١) يخرج معامل القدرة 0.912 كما في الكتاب.</p></div>
   <div class="panel c5"><h2>غيّر قيم الدائرة</h2><div style="display:grid;gap:12px;margin:10px 0 12px">
     ${slHTML('sV','جهد المصدر V1 =',60,240,1,v.V,'V')}${slHTML('sI','تيار المحرك Ia =',1,30,0.01,v.I,'A')}
     ${slHTML('sRa','Ra =',0,3,0.01,v.Ra,'Ω')}${slHTML('sXa','Xa =',0,3,0.01,v.Xa,'Ω')}${slHTML('sRs','Rs =',0,2,0.01,v.Rs,'Ω')}${slHTML('sXs','Xs =',0,2,0.01,v.Xs,'Ω')}${slHTML('sPL','المفاقيد PL =',0,200,1,v.PL,'W')}</div>
     <button class="btn primary" id="bk">قيم مثال (٤-١)</button></div>
   <div class="panel c7"><h2>خواص المحرك على AC و DC <small>الشكل (٤-٣) ص 61 — قيم تقريبية من الرسم</small></h2><div class="svgbox" id="cv"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>D.C</span><span><i style="background:var(--live)"></i>A.C</span><span><i style="background:var(--stop)"></i>العزم المطلوب</span></div></div>
   <div class="panel c5"><h2>لنفس العزم: أي السرعتين أعلى؟</h2>${slHTML('sT','العزم المطلوب =',1.1,4,0.05,Tq,'pu')}<div class="facts" id="cvF"></div>
    <button class="btn" id="why" style="margin-top:10px">لماذا السرعة أقل في AC؟</button><div id="whyT"></div></div>
   <div class="panel c12">${tryList(['اضغط «قيم مثال (٤-١)» ولاحظ <span class="ltr">Ea ≈ 74.1 V</span> ومعامل القدرة 0.912 كما في الكتاب.','زد التيار Ia (حمل أكبر): تطول أسهم الهبوط IaR و IaX ويقصر Ea، أي تقل السرعة.','اجعل المعاوقات الحثية Xa و Xs صفراً: يصير V1 أفقياً و pf = 1، وهذا يشبه التشغيل بالتيار المستمر.','في المنحنيات حرّك العزم: نقطة AC دائماً على يسار نقطة DC (سرعة أقل).'])}</div></div>`;
  const $=s=>el.querySelector(s);const ids={sV:'V',sI:'I',sRa:'Ra',sXa:'Xa',sRs:'Rs',sXs:'Xs',sPL:'PL'};
  const draw=()=>{Object.entries(ids).forEach(([id,k])=>{$('#'+id).value=v[k];$('#'+id+'-v').textContent=(+v[k]).toFixed(k==='V'||k==='PL'?0:2)});
    $('#ph').innerHTML=phasorSVG(v.V,v.I,v.Ra,v.Xa,v.Rs,v.Xs);const r=phasorCalc(v.V,v.I,v.Ra,v.Xa,v.Rs,v.Xs);
    if(r.ok){const Pd=r.E*v.I,Pin=v.V*v.I*r.pf,Po=Pd-v.PL;$('#phF').innerHTML=[['زاوية φ',r.phi.toFixed(2)+'°'],['معامل القدرة',r.pf.toFixed(3)],['Ea',r.E.toFixed(2)+' V'],['Pd = Ea·Ia',Pd.toFixed(0)+' W'],['Pin',Pin.toFixed(0)+' W'],['الكفاءة η',(Po>0?(Po/Pin*100).toFixed(1):'—')+' %']].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('')}
    else $('#phF').innerHTML='<div class="fact"><span>الحالة</span><b>—</b></div>';
    $('#sT').value=Tq;$('#sT-v').textContent=Tq.toFixed(2);$('#cv').innerHTML=fig43SVG(Tq);
    const nd=invSpeed(fDC,0.45,Tq),na=invSpeed(fAC,0.1,Tq);$('#cvF').innerHTML=`<div class="fact"><span>السرعة على DC</span><b>${nd==null?'خارج الرسم':nd.toFixed(2)+' pu'}</b></div><div class="fact"><span>السرعة على AC</span><b>${na==null?'خارج الرسم':na.toFixed(2)+' pu'}</b></div>`};
  Object.entries(ids).forEach(([id,k])=>$('#'+id).addEventListener('input',e=>{v[k]=+e.target.value;draw()}));
  $('#sT').addEventListener('input',e=>{Tq=+e.target.value;draw()});
  $('#bk').addEventListener('click',()=>{v=Object.assign({},V0);draw()});
  $('#why').addEventListener('click',()=>{$('#whyT').innerHTML=`<div class="callout"><b>السببان كما في الكتاب (ص 61):</b><ol style="margin:6px 0 0;padding-inline-start:20px"><li>معاوقة ملفات المنتج والمجال تمتص جزءاً من جهد المصدر، فتكون السرعة أقل بالجهد المتردد منها بنفس الجهد المستمر.</li><li>قد تصل الدائرة المغناطيسية إلى التشبع عند القيم العظمى للتيار المتردد، فيقل المجال وبالتالي العزم المتولد.</li></ol></div>`});
  draw();
 },
 examples:[
  {title:'مثال (٤-١) — الحل كما في الكتاب',ref:'ص 62–63',
   q:'<p>«محرك عام 120 فولت، 60 هيرتز، ذو زوج واحد من الأقطاب، يدور بسرعة 8000 لفة في الدقيقة ويسحب تياراً مقداره 17.58 أمبير بمعامل قدره 0.912 متأخر. ثوابت ملفات المنتج والمجال: \\(R_a = 1.36\\,Ω\\)، \\(X_a = 1.6\\,Ω\\)، \\(R_s = 0.65\\,Ω\\)، \\(X_s = 1.2\\,Ω\\). احسب: الجهد المتولد وقدرة الخرج والعزم المتولد وكفاءة المحرك، إذا كانت المفاقيد الحديدية والميكانيكية 80 وات.»</p>',
   given:G41,
   solve:(g,B,isBook)=>uniSteps(g,B,isBook?BK41:null),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة أرقامه المطبوعة كما هي: الزاوية <span class="ltr">24.58°</span> (والصحيح 24.22°)، و <span class="ltr">3.446</span> (والصحيح 3.447)، و <span class="ltr">60.68</span> (والصحيح 60.58)، و <span class="ltr">74.05∠−24.2</span>. إذا غيّرت أي رقم تحسب الحاسبة الزاوية من <span class="ltr">cos⁻¹(pf)</span> بنفس خطوات الكتاب وتقريبه. قارن بالحل المصحح أسفل هذه الصفحة.'},
  {title:'مثال (٤-١) — الحل المصحح',ref:'ص 62–63',
   q:'<p>نفس المثال، لكن بالزاوية الصحيحة \\(\\phi = \\cos^{-1}0.912 = 24.22^\\circ\\) وبضرب صحيح. (حساب مصحح — ليس من الكتاب.)</p>',
   given:G41,
   solve:(g,B)=>uniSteps(g,B,null),
   note:'النتيجة المصححة <span class="ltr">Ea = 74.10∠−24.2 V</span> قريبة جداً من الرقم النهائي المطبوع في الكتاب (74.05)، والفرق في القدرة واط واحد، وفي الكفاءة 0.1%.'}
 ],
 quiz:[
  {q:'في الدائرة المكافئة للمحرك العام، كيف تتصل ممانعة المنتج وممانعة المجال؟',o:['على التوازي','على التوالي مع المصدر والمنتج','لا تظهران','بمحول'],c:1,e:'الشكل (٤-٢): المصدر V1 ثم Rs و jXs ثم Ra و Xa ثم Ea، كلها على التوالي.'},
  {q:'معادلة الجهد المتولد في المحرك العام هي:',o:['<span class="ltr">Ea = V1 + Ia·Z</span>','<span class="ltr">Ea = V1 − Ia(Ra + Rs + jXa + jXs)</span>','<span class="ltr">Ea = Ia·Ra</span>','<span class="ltr">Ea = V1·cos φ</span>'],c:1,e:'المعادلة (٤-١) ص 60.'},
  {q:'قدرة الخرج في المحرك العام تساوي:',o:['<span class="ltr">Pd + Plosses</span>','<span class="ltr">Pd − Plosses</span>','<span class="ltr">V1·Ia</span>','<span class="ltr">Ea / Ia</span>'],c:1,e:'المعادلة (٤-٣): Po = Pd − Plosses.'},
  {q:'إلى أي سرعة قد يصل المحرك العام حسب الكتاب؟',o:['1500 لفة/د','3000 لفة/د','15000 لفة/د','150000 لفة/د'],c:2,e:'«بسرعات عالية قد تصل إلى 15000 لفة في الدقيقة» (ص 61).'},
  {q:'لنفس العزم، سرعة المحرك العام على التيار المتردد مقارنة بالمستمر:',o:['أعلى','أقل','متساوية','صفر'],c:1,e:'الشكل (٤-٣): منحنى A.C أدنى من D.C، لأن معاوقة الملفات تمتص جزءاً من الجهد (ص 61).'},
  {q:'أي مما يلي من أسباب ضعف أداء المحرك على AC حسب الكتاب؟',o:['تشبع الدائرة المغناطيسية عند القيم العظمى للتيار','زيادة عدد الأقطاب','نقص التردد','قلة عدد الفرش'],c:0,e:'السبب الثاني في ص 61: التشبع يقلل المجال وبالتالي العزم.'},
  {q:'في مثال (٤-١) كم كانت قدرة الخرج حسب الكتاب؟',o:['1302 W','1222 W','1923.96 W','80 W'],c:1,e:'<span class="ltr">Po = 1302 − 80 = 1222 W</span>.'},
  {q:'في مثال (٤-١)، ما الزاوية الصحيحة للتيار عند معامل قدرة 0.912؟',o:['24.58°','24.22°','29.75°','54.33°'],c:1,e:'<span class="ltr">cos⁻¹(0.912) = 24.22°</span>؛ الكتاب استعمل 24.58° في الخطوات (انظر ملاحظة الكتاب).'}
 ]
});

/* =================== Lesson 4.3 — repulsion motor =================== */
const ZH=4; // illustrative impedance ratio high/low position (not from the book)
const repI=a=>{const c=Math.cos(a*D),s=Math.sin(a*D);return 1/(c*c+ZH*s*s)};
const repTraw=a=>Math.sin(2*a*D)*repI(a)*repI(a);
const TMAX=(()=>{let m=0;for(let a=0;a<=90;a+=0.25)m=Math.max(m,repTraw(a));return m})();
const repT=a=>repTraw(a)/TMAX;
function repulsionSVG(a,o){o=o||{};const cx=150,cy=150,R=96,r=62;let s=`<svg viewBox="0 0 ${o.eq?560:300} 300" role="img" aria-label="المحرك التنافري">`;
  // stator ring and winding A (axis vertical)
  s+=`<circle cx="${cx}" cy="${cy}" r="${R+18}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/>`;
  s+=`<path d="M${cx} ${cy-R-26}V${cy+R+26}" stroke="var(--muted)" stroke-dasharray="6 5"/>`+S.t(cx+8,cy-R-12,'A','b','start')+arT(cx,18,'محور ملف الثابت',{fs:11.5});
  [-1,1].forEach(k=>{for(let i=-2;i<=2;i++){const an=(90+k*90+i*14)*D;s+=`<circle cx="${fx(cx+(R+9)*Math.cos(an))}" cy="${fx(cy+(R+9)*Math.sin(an))}" r="4.5" fill="var(--live)" opacity=".85"/>`}});
  // rotor
  s+=`<g id="rrot"><circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>${[0,30,60,90,120,150].map(t=>`<path d="M${fx(cx+r*Math.cos(t*D))} ${fx(cy+r*Math.sin(t*D))}L${fx(cx-r*Math.cos(t*D))} ${fx(cy-r*Math.sin(t*D))}" stroke="var(--line)"/>`).join('')}<circle cx="${cx+r-12}" cy="${cy}" r="5" fill="var(--blue)"/></g>`;
  // brushes (axis at angle a, CCW from top) shorted
  const ux=-Math.sin(a*D),uy=-Math.cos(a*D),bx=cx+ux*(r+8),by=cy+uy*(r+8),bx2=cx-ux*(r+8),by2=cy-uy*(r+8);
  s+=`<path d="M${fx(cx+ux*(R+30))} ${fx(cy+uy*(R+30))}L${fx(cx-ux*(R+30))} ${fx(cy-uy*(R+30))}" stroke="var(--blue)" stroke-dasharray="3 4" stroke-width="1.4"/>`;
  const br=(x,y)=>`<rect x="${fx(x-9)}" y="${fx(y-6)}" width="18" height="12" rx="2" fill="var(--fg)" transform="rotate(${fx(-a)} ${fx(x)} ${fx(y)})"/>`;
  s+=br(bx,by)+br(bx2,by2);
  // short-circuit link outside, drawn as arc around one side
  const pa=Math.atan2(uy,ux),q=R+30;s+=`<path d="M${fx(bx)} ${fx(by)}L${fx(cx+ux*q)} ${fx(cy+uy*q)}A${q} ${q} 0 0 1 ${fx(cx-ux*q)} ${fx(cy-uy*q)}L${fx(bx2)} ${fx(by2)}" fill="none" stroke="var(--fg)" stroke-width="2"/>`;
  // α arc
  if(Math.abs(a)>1){const ar=40,a0=-90,a1=-90-a;s+=`<path d="M${fx(cx+ar*Math.cos(a0*D))} ${fx(cy+ar*Math.sin(a0*D))}A${ar} ${ar} 0 0 ${a>0?0:1} ${fx(cx+ar*Math.cos(a1*D))} ${fx(cy+ar*Math.sin(a1*D))}" fill="none" stroke="var(--stop)" stroke-width="2"/>`+S.t(fx(cx+(ar+12)*Math.cos((a0-a/2)*D)),fx(cy+(ar+12)*Math.sin((a0-a/2)*D)+4),'α','',null,14)}
  // decomposition of A into T (along brushes) and F (perpendicular)
  if(o.vec!==false){const L=78,Tm=L*Math.cos(a*D),Fm=L*Math.sin(a*D);
    s+=arrow(cx,cy,cx,cy-L,'--muted',2);
    const tx=cx+ux*Tm,ty=cy+uy*Tm;s+=arrow(cx,cy,tx,ty,'--live',3.2)+S.t(tx+(ux>0?10:-10),ty-6,'T','',ux>0?'start':'end',13);
    // F = A - T  (component perpendicular to the brush axis)
    const ex=cx,ey=cy-L;s+=`<path d="M${fx(tx)} ${fx(ty)}L${ex} ${ey}" stroke="var(--on)" stroke-dasharray="4 3" stroke-width="1.4"/>`;
    s+=arrow(cx,cy,cx+(ex-tx),cy+(ey-ty),'--on',3.2)+S.t(cx+(ex-tx)*1.15,cy+(ey-ty)*1.15+4,'F','',null,13)}
  if(o.eq){const X0=330;s+=arT(X0+105,22,'التحليل المكافئ',{fs:12.5});
    const Tl=Math.abs(Math.cos(a*D)),Fl=Math.abs(Math.sin(a*D));
    s+=`<rect x="${X0+10}" y="40" width="200" height="236" rx="10" fill="none" stroke="var(--line)"/>`;
    s+=coil(X0+60,60,X0+60,60+120*Math.max(.08,Tl),Math.max(1,Math.round(5*Tl)),'live')+S.t(X0+60,196,'T = A cosα','',null,11)+S.t(X0+60,212,(Tl).toFixed(2)+' A','b',null,11);
    s+=coil(X0+100,250,X0+100+90*Math.max(.08,Fl),250,Math.max(1,Math.round(4*Fl)),'')+`<path d="M${X0+100} 250H${X0+190}" stroke="var(--on)" stroke-width="${1+3*Fl}" opacity=".5"/>`+S.t(X0+150,236,'F = A sinα','',null,11)+S.t(X0+150,270,(Fl).toFixed(2)+' A','b',null,11);
    s+=`<circle cx="${X0+150}" cy="130" r="34" fill="var(--surface-2)" stroke="var(--fg)"/><rect x="${X0+144}" y="88" width="12" height="9" fill="var(--fg)"/><rect x="${X0+144}" y="163" width="12" height="9" fill="var(--fg)"/><path d="M${X0+150} 88V78H${X0+192}V182H${X0+150}V172" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(X0+150,134,'Rotor','m');}
  return s+'</svg>'}
B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'63–65',
 title:'المحرك التنافري: التركيب والعمل وزاوية الفرش',
 summary:'دوار المحرك التنافري يأخذ تياره بالحث لأن فرشه مقصورة. زاوية محور الفرش α تقسم مجال الثابت إلى ملف تحويل وملف مجال، وبها نتحكم في السرعة والاتجاه.',
 theory:[
  {h:'٤-٢-١ تركيب المحرك',ref:'ص 63',html:`<p>«يتكون المحرك التنافري من <b>عضو ثابت</b> يشبه في تركيبه العضو الثابت للمحرك الحثي أحادي الوجه ملفوف عليه الملفات الرئيسة وموزعة على محيطه كله ويكون أربعة أقطاب أو أكثر، ومن <b>عضو دوار</b> يشبه تماما العضو الدوار لآلات التيار المستمر عليه ملفات المنتج موصلة لعضو التبديل (التوحيد)، <b>تقصر الفرش الكربونية</b> لهذا المحرك ويصنع محورها مع محور ملفات العضو الثابت <b>زاوية α</b> تتوقف على قيمتها خصائص المحرك وسرعته.»</p>`},
  {h:'٤-٢-٢ نظرية عمل المحرك التنافري',ref:'ص 63–64',html:`<p>«الشكل (٤-٤) يوضح تركيب المحرك التنافري. يمكن تحليل وظيفة المجال المغناطيسي A والناشئ عن ملف العضو الثابت، بتقسيمه واستبداله نظرياً بملفين متعامدين، الأول ينطبق محوره مع محور ملف الدوار، ويسمى <b>بملف التحويل (Transformer winding)</b>، والآخر يتعامد محوره مع محور ملف الدوار، ويسمى <b>بملف المجال (Field winding)</b>، يتوقف تأثير كل منهما على مقدار الزاوية α بين محور الفرش الكربونية وبين محور ملفات العضو الثابت.»</p>
   $$T = A\\cos\\alpha \\qquad\\qquad F = A\\sin\\alpha$$
   <p>«يعمل ملف التحويل (T)، على توليد تيار بملفات المنتج بالتأثير الحثي، كما يحدث في المحولات (حيث تكون ملفات المنتج مقصورة على نفسها)، فيتولد مجال مغناطيسي مضاد لمجال ملف التحويل، فيتكون محصلة لهذين المجالين في اتجاه محور ملف التحويل (محور الفرش). أما ملف المجال (F) فيعطي مجالاً مغناطيسياً متعامداً مع محور الفرش، فيتولد <b>عزم دوران نتيجة للمجالين المتعامدين</b>.»</p>`},
  {fig:'(٤-٤)',ref:'ص 64',caption:'المحرك التنافري وتقسيم ملف الثابت إلى ملفين متعامدين: ملف التحويل T = A cosα على محور الفرش، وملف المجال F = A sinα عمودي عليه (مرسوم عند α = 30°؛ هنا ثبّتنا محور الثابت رأسياً وأملنا الفرش)',draw:()=>box(repulsionSVG(30,{eq:true}),620)},
  {html:`<p>«أما تسميته بالمحرك التنافري فذلك لأنه يمكن تفسير العزم المتولد على أنه <b>عزم تنافر</b>، بين قطب مغناطيسي شمالي (مثلا)، تكون في لحظة معينة نتيجة للتيار المتردد، على العضو الثابت، مع قطب مشابه له تكون بالحث على سطح الدوار، فتولد عزم الدوران نتيجة لتنافر الأقطاب المتشابهة.»</p>`},
  {h:'٤-٢-٣ خواص المحرك التنافري',ref:'ص 64–65',html:`<p>«يشبه هذا المحرك في خصائصه محرك التوالي العام مثل الحجم الصغير وخفة الوزن والسرعة العالية والعزم الكبير، مع الفارق بأن ملف المنتج في حالة محرك التوالي العام يمر فيه التيار <b>بالتوصيل المباشر</b> من المصدر الكهربائي، أما في حالة المحرك التنافري فملف المنتج (الدوار) يستمد التيار من ملفات العضو الثابت <b>بالتأثير</b>.»</p>
   <p>«يمتاز المحرك التنافري عن محرك التوالي العام بإمكانية <b>التحكم في سرعته بتغيير الزاوية α</b> بين محور الفرش الكربونية ومحور ملفات العضو الثابت مابين صفر وتسعين درجة.»</p>
   <table class="tt"><tr><th>الزاوية</th><th>ما يحدث (نص الكتاب)</th><th>اسم الموقع</th></tr>
   <tr><td>α = 0°</td><td>«يتلاشى ملف المجال ويتلاشى عزم الدوران، ويصبح المحرك … مشابها لمحول ملفه الثانوي مقصور فتمر <b>أكبر</b> قيمة لتيار العضو الثابت»</td><td>موقع المعاوقة الصغيرة</td></tr>
   <tr><td>α = 90°</td><td>«يتلاشى ملف التحويل ويتلاشى معه تيار ملفات المنتج ويتلاشى أيضا عزم الدوران، ويصبح المحرك … مشابها لمحول ملفه الثانوي مفتوح فتمر <b>أصغر</b> قيمة لتيار العضو الثابت»</td><td>موقع المعاوقة الكبيرة</td></tr></table>
   <p>«ولذلك لابد أن نزيح محور الفحمات عن محور المجال الرئيسي بمقدار من <b>١٨ الي ٢٠ درجة كهربائية</b>.»</p>
   <p>«عند بدء حركة المحرك التنافري يجب أن تكون الفرش في <b>موقع المعاوقة الكبيرة</b> حيث يكون تيار البدء في هذه الحالة أقل ما يمكن، ثم تتم إزاحتها من هذا الموقع، فيدور المحرك <b>في اتجاه معاكس لاتجاه إزاحة الفرش</b> من موقع المعاوقة الكبيرة.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب لا يعطي معادلة للعزم بدلالة α. يكفي أن تتذكر: لا عزم عند 0° (لا يوجد F) ولا عند 90° (لا يوجد T ولا تيار في الدوار)؛ العزم يظهر بين الزاويتين. ولعكس الاتجاه نزيح الفرش من موقع المعاوقة الكبيرة <b>إلى الجهة الأخرى</b> (استنتاج من الجملة الأخيرة، وهو س٤-٤). المنحنى في المختبر توضيحي فقط.'}
 ],
 lab:(el,B)=>{
  let a=90,on=0,rot=0,w=0,warn='',anim=null;
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>قرص زاوية الفرش <small>مبني على الشكل (٤-٤) ص 64</small></h2>
    <p class="sub">اسحب الفرش (أو أي نقطة على المحرك) لتدير محور الفرش، أو استخدم المنزلق.</p>
    <div class="svgbox" id="mot" style="max-width:420px;margin-inline:auto;touch-action:none;cursor:grab"></div>
    ${slHTML('sa','زاوية الفرش α =',-90,90,1,a,'°')}
    <div class="wrap-in"><div><div class="sub">المصدر</div>${segHTML('on',[[1,'موصل'],[0,'مفصول']],on)}</div>
     <button class="btn primary" id="st1">بدء صحيح ثم إزاحة الفرش إلى 20°</button><button class="btn" id="st2">بدء صحيح ثم إزاحة الفرش إلى −20° (الاتجاه الآخر)</button></div>
    <div id="warn"></div></div>
   <div class="panel c5"><h2>ماذا يحدث؟</h2><div class="facts" id="facts"></div><p class="sub" id="pos"></p>
    <div class="svgbox" id="ch"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>تيار الثابت (نسبي)</span><span><i style="background:var(--live)"></i>العزم (نسبي)</span><span><i style="background:var(--on)"></i>منطقة ١٨–٢٠°</span></div>
    <p class="sub"><b>منحنى توضيحي — ليس من الكتاب:</b> رُسم ليطابق ما يقوله الكتاب فقط: العزم صفر عند 0° و 90°، وأكبر تيار عند 0° وأصغره عند 90°. الأرقام نسبية.</p></div>
   <div class="panel c12">${tryList(['ابدأ والمصدر مفصول، ضع الفرش عند 90° (موقع المعاوقة الكبيرة) ثم صِل المصدر: التيار أصغر ما يمكن ولا يدور المحرك.','أزح الفرش تدريجياً نحو 20°: يبدأ الدوران <b>عكس</b> اتجاه إزاحة الفرش، ولاحظ ظهور السهم F.','ضع α = 0°: أكبر تيار للثابت ولا عزم (موقع المعاوقة الصغيرة).','افصل المصدر، ضع الفرش عند 10° ثم صِل: يظهر تحذير تيار بدء كبير.','اضغط زر البدء في الاتجاه الآخر: الإزاحة إلى الجهة الأخرى تعكس الدوران (س٤-٤).'])}</div></div>`;
  const $=s=>el.querySelector(s);
  const mot=$('#mot');
  const setA=v=>{a=clamp(Math.round(v),-90,90);$('#sa').value=a;$('#sa-v').textContent=a};
  const drag=e=>{const svg=mot.querySelector('svg');if(!svg)return;const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*300,y=(e.clientY-r.top)/r.height*300;
    const th=Math.atan2(-(x-150),-(y-150))/D;let al=((th+90)%180+180)%180-90;setA(al);anim=null};
  let dragging=false;mot.addEventListener('pointerdown',e=>{dragging=true;mot.setPointerCapture&&mot.setPointerCapture(e.pointerId);drag(e)});
  mot.addEventListener('pointermove',e=>{if(dragging)drag(e)});['pointerup','pointercancel'].forEach(ev=>mot.addEventListener(ev,()=>{dragging=false}));
  $('#sa').addEventListener('input',e=>{setA(+e.target.value);anim=null});
  const setOn=v=>{if(v&&!on){const I=repI(a);warn=Math.abs(a)<80?`<div class="callout err"><b>تيار بدء كبير:</b> وصلت المصدر والفرش عند ${a}° بعيدة عن موقع المعاوقة الكبيرة (تيار الثابت ≈ ${(I*100).toFixed(0)}% من أكبر قيمة). الكتاب: «عند بدء حركة المحرك التنافري يجب أن تكون الفرش في موقع المعاوقة الكبيرة».</div>`:`<div class="callout">بدء صحيح: الفرش في موقع المعاوقة الكبيرة، تيار البدء أقل ما يمكن (${(repI(a)*100).toFixed(0)}%). الآن أزح الفرش.</div>`}if(!v)warn='';on=v;segSet(el,'on',on);$('#warn').innerHTML=warn};
  el.querySelectorAll('[data-on]').forEach(b=>b.addEventListener('click',()=>setOn(+b.dataset.on)));
  const start=(from,to)=>{setOn(0);setA(from);setOn(1);anim={from,to,t:0}};
  $('#st1').addEventListener('click',()=>start(90,20));$('#st2').addEventListener('click',()=>start(-90,-20));
  setA(a);
  let last='';
  loopOn(el,dt=>{
   if(anim){anim.t+=dt;const u=clamp((anim.t-0.8)/2.2,0,1);setA(anim.from+(anim.to-anim.from)*u);if(u>=1)anim=null}
   const T=on?repT(a):0,I=on?repI(a):0;
   w+=(T*3-w)*dt/1.2;rot+=w*dt*120;
   const sig=a+'|'+on;if(sig!==last){last=sig;mot.innerHTML=repulsionSVG(a);
     const ch=plotSVG({w:420,h:240,x0:-90,x1:90,y0:-1.1,y1:1.1,xt:[-90,-45,0,45,90],yt:[-1,-0.5,0,0.5,1],yf:v=>v.toFixed(1),xl:'α (°)',aria:'العزم والتيار مع الزاوية',
      under:(X,Y)=>[[18,20],[-20,-18]].map(([p,q])=>`<rect x="${fx(X(p))}" y="${Y(1.1)}" width="${fx(X(q)-X(p))}" height="${fx(Y(-1.1)-Y(1.1))}" fill="var(--on-soft)"/>`).join(''),
      series:[{pts:Array.from({length:181},(_,i)=>[i-90,repI(i-90)]),col:'--blue',w:2},{pts:Array.from({length:181},(_,i)=>[i-90,repT(i-90)]),col:'--live',w:2.8}],
      extra:(X,Y)=>`<path d="M${fx(X(a))} ${Y(1.1)}V${Y(-1.1)}" stroke="var(--fg)" stroke-width="1.2"/><circle cx="${fx(X(a))}" cy="${fx(Y(repT(a)))}" r="5" fill="var(--live)"/><circle cx="${fx(X(a))}" cy="${fx(Y(repI(a)))}" r="5" fill="var(--blue)"/>`});
     $('#ch').innerHTML=ch;
     const pos=Math.abs(a)<=2?'<b>موقع المعاوقة الصغيرة</b> (α ≈ 0°): أكبر تيار للثابت ولا عزم — مثل محول ثانويه مقصور.':Math.abs(a)>=88?'<b>موقع المعاوقة الكبيرة</b> (α ≈ 90°): أصغر تيار ولا عزم — مثل محول ثانويه مفتوح. هنا يكون البدء.':(Math.abs(a)>=18&&Math.abs(a)<=20)?'الفرش مزاحة <b>١٨–٢٠ درجة</b> عن محور المجال الرئيسي كما يوصي الكتاب.':'الفرش بين الموقعين: يوجد T و F فيتولد عزم.';
     $('#pos').innerHTML=pos;}
   const rg=mot.querySelector('#rrot');if(rg)rg.setAttribute('transform',`rotate(${(-rot).toFixed(1)} 150 150)`);
   $('#facts').innerHTML=[['ملف التحويل T = A cosα',Math.abs(Math.cos(a*D)).toFixed(2)+' A'],['ملف المجال F = A sinα',Math.abs(Math.sin(a*D)).toFixed(2)+' A'],['تيار الثابت (نسبي)',on?(I*100).toFixed(0)+' %':'0'],['العزم (نسبي)',on?(Math.abs(T)*100).toFixed(0)+' %':'0'],['اتجاه الدوران',!on||Math.abs(w)<0.05?'متوقف':w>0?'↺ عكس عقارب الساعة':'↻ مع عقارب الساعة']].map(([x,y])=>`<div class="fact"><span>${x}</span><b>${y}</b></div>`).join('');
  });
 },
 quiz:[
  {q:'من أين يحصل دوار المحرك التنافري على تياره؟',o:['بالتوصيل المباشر من المصدر','بالتأثير (الحث) من ملفات الثابت','من بطارية','من مولد منفصل'],c:1,e:'«ملف المنتج (الدوار) يستمد التيار من ملفات العضو الثابت بالتأثير» (ص 64).'},
  {q:'فرش المحرك التنافري تكون:',o:['موصلة بالمصدر','مقصورة','مفتوحة','موصلة بمكثف'],c:1,e:'«تقصر الفرش الكربونية لهذا المحرك» (ص 63).'},
  {q:'ملف التحويل في التحليل المكافئ يساوي:',o:['<span class="ltr">A sinα</span>','<span class="ltr">A cosα</span>','<span class="ltr">A tanα</span>','<span class="ltr">A</span>'],c:1,e:'<span class="ltr">T = A cosα</span>، ومحوره على محور الفرش.'},
  {q:'عند α = 0° فإن:',o:['العزم أكبر ما يمكن','العزم صفر وتيار الثابت أكبر ما يمكن','العزم صفر وتيار الثابت أصغر ما يمكن','المحرك يدور بأقصى سرعة'],c:1,e:'«يتلاشى ملف المجال ويتلاشى عزم الدوران … فتمر أكبر قيمة لتيار العضو الثابت» — موقع المعاوقة الصغيرة.'},
  {q:'يسمى موقع الفرش عند α = 90°:',o:['موقع المعاوقة الصغيرة','موقع المعاوقة الكبيرة','موقع الصفر','موقع التشبع'],c:1,e:'تمر أصغر قيمة لتيار الثابت، ويسمى موقع المعاوقة الكبيرة (ص 65).'},
  {q:'في أي موقع يجب أن تكون الفرش عند بدء الحركة؟',o:['موقع المعاوقة الصغيرة','موقع المعاوقة الكبيرة','عند 45°','لا يهم'],c:1,e:'لأن تيار البدء يكون فيه أقل ما يمكن (ص 65).'},
  {q:'إذا أزحنا الفرش من موقع المعاوقة الكبيرة في اتجاه عقارب الساعة، يدور المحرك:',o:['مع عقارب الساعة','عكس عقارب الساعة','لا يدور','يتذبذب'],c:1,e:'«فيدور المحرك في اتجاه معاكس لاتجاه إزاحة الفرش من موقع المعاوقة الكبيرة».'},
  {q:'بماذا يمتاز المحرك التنافري عن محرك التوالي العام؟',o:['يعمل على DC فقط','إمكانية التحكم في سرعته بتغيير الزاوية α','لا يحتاج فرشاً','سرعته ثابتة'],c:1,e:'التحكم في السرعة بتغيير α بين صفر وتسعين درجة (ص 64).'}
 ]
});

/* =================== Lesson 4.4 — unit questions =================== */
const det=(q,body,ans)=>`<details style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:8px;background:var(--surface)"><summary style="cursor:pointer;font-weight:600">${q}</summary><div style="margin-top:6px">${body||''}<div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></div></details>`;
const opts=a=>`<ul style="list-style:none;padding-inline-start:8px;margin:4px 0">${a.map((x,i)=>`<li>${'أبجده'[i]}. ${x}</li>`).join('')}</ul>`;
const G46={V:240,I:6.5,pf:0.94,N:12000,Ra:6.15,Xa:9.4,Rs:4.55,Xs:3.2,PL:65},G47={V:220,I:7,pf:0.90,N:6000,Ra:5.5,Xa:7.4,Rs:3.5,Xs:3.2,PL:70};
B.lesson({
 id:'u4-l4',unit:4,order:4,pages:'65–67',
 title:'أسئلة الوحدة الرابعة واختبارها الذاتي',
 summary:'الاختبار الذاتي والأسئلة المتنوعة للوحدة، مع إجابات مقترحة من نص الكتاب، وحاسبتان للسؤالين س٤-٦ و س٤-٧.',
 theory:[
  {h:'اختبار ذاتي',ref:'ص 65–66',html:`<p>«اختر الإجابة أو الإجابات الصحيحة:» — الكتاب لا يعطي مفتاح إجابة؛ الإجابات المقترحة أدناه من نص الكتاب ويعتمدها المدرب.</p>`+
   det('س١: المحرك العام هو المحرك الذي ……….',opts(['يمكن استخدامه في جميع الأغراض.','يمكن أن يعمل على كل من التيار المستمر والمتردد.','يعمل على التيار المتردد فقط.','يعمل على التيار المستمر فقط.']),'(ب) — «محرك يعمل على كل من مصدري التيار المستمر والتيار المتردد» (ص 59).')+
   det('س٢: عندما يوصل محرك التوالي للتيار المستمر بمصدر للتيار المتردد، فإنه ……….',opts(['يعمل بكفاءة منخفضة.','يعمل بمعامل قدرة منخفض.','تحدث شرارة بين الموحد والفرش.','جميع ما سبق.']),'(د) — الكتاب يذكر صراحة الشرارة (ص 59) والمفاقيد الحديدية والتشبع (ص 59، 61)؛ الكفاءة المنخفضة ومعامل القدرة الأقل من الواحد نتيجة لمعاوقة الملفات (مثال ٤-١: η = 63.5% و pf = 0.912).')+
   det('س٣: عندما يعمل المحرك العام على مصدر للتيار المستمر ………….',opts(['يعمل بكفاءة عالية.','يولد عزماً أكبر.','يدور بسرعة أعلى.','جميع ما سبق.','عكس ما سبق.']),'(د) — السرعة أعلى والعزم أكبر على DC (ص 61 والشكل ٤-٣)، ولا توجد معاوقة حثية ولا مفاقيد حديدية مترددة فتكون الكفاءة أعلى (استنتاج).')+
   det('س٤: من أهم خواص المحرك العام ………..',opts(['أداؤه الجيد عند التشغيل بالتيار المتردد.','أداؤه الجيد عند التشغيل بالتيار المستمر.','سرعته المنخفضة عند جميع الأحمال.','سرعته العالية عند جميع الأحمال.','قدرته العالية مقارنة بحجمه.']),'(هـ) — «فهو ذو قدرة عالية مقارنة بحجمه» (ص 61). ويمكن قبول (ب) أيضاً لأن أداءه على DC أفضل حسب الشكل (٤-٣).')},
  {h:'أسئلة متنوعة',ref:'ص 66–67',html:
   det('س٤-١: ما هو المحرك العام؟ ولماذا سمي بهذا الاسم؟ تحدث عن تركيبه، وخواصه.','','محرك توالي (المجال والمنتج على التوالي) يعمل على DC و AC ومن هنا الاسم. تركيبه نفس تركيب آلة التيار المستمر ذات تغذية التوالي مع: إطار وأقطاب من شرائح الحديد، لفات مجال أقل وموصلات منتج أكثر، فرش عالية المقاومة، أقطاب بينية وقطع مبدل أكثر (ص 59). خواصه: سرعة عالية حتى 15000 لفة/د، عزم كبير، قدرة عالية مقارنة بحجمه؛ وسرعته على AC أقل منها على DC (ص 61).')+
   det('س٤-٢: ما هو المحرك التنافري؟ تحدث عن تركيبه، وخواصه.','','ثابت يشبه ثابت المحرك الحثي أحادي الوجه (أربعة أقطاب أو أكثر)، ودوار يشبه دوار آلة التيار المستمر بمبدل وفرش <b>مقصورة</b> يصنع محورها زاوية α مع محور الثابت. الدوار يأخذ تياره بالحث. خواصه تشبه المحرك العام (حجم صغير، خفة، سرعة عالية، عزم كبير) ويمتاز بالتحكم في السرعة بتغيير α (ص 63–64).')+
   det('س٤-٣: كيف يمكن عكس اتجاه دوران المحرك العام؟','','بعكس أطراف ملف المجال فقط أو أطراف المنتج فقط. أما عكس قطبية المصدر فيعكس التيارين معاً ولا يغير الاتجاه (استنتاج من ص 59).')+
   det('س٤-٤: كيف يمكن عكس اتجاه دوران المحرك التنافري؟','','بإزاحة الفرش من موقع المعاوقة الكبيرة إلى الجهة الأخرى، لأن المحرك يدور عكس اتجاه إزاحة الفرش (ص 65).')+
   det('س٤-٥: ماذا يمكن أن يكون السبب إذا لم يبدأ المحرك التنافري الدوران عند توصيله مع مصدر التغذية؟','','أن تكون الفرش في موقع المعاوقة الكبيرة (α = 90°) أو في موقع المعاوقة الصغيرة (α = 0°)، ففي الموقعين يتلاشى عزم الدوران (ص 65). (ومن الأسباب العملية — ليست من الكتاب — عدم تلامس الفرش أو انقطاع وصلة قصرها.)')+
   det('س٤-٦: «محرك عام 240 فولت، 60 هيرتز، ذو زوج واحد من الأقطاب، يدور بسرعة 12000 لفة في الدقيقة ويسحب تياراً مقداره 6.5 أمبير ومعامل القدرة 0.94 متأخر، ثوابت ملفات المنتج والمجال (التوالي): \\(Z_a = 6.15 + j9.4\\,Ω\\)؛ \\(Z_s = 4.55 + j3.2\\,Ω\\). احسب: الجهد المتولد وقدرة الخرج والعزم المتولد وكفاءة المحرك، إذا كانت المفاقيد الحديدية والميكانيكية 65 وات.»','','بنفس خطوات مثال (٤-١): \\(E_a \\approx 156.05\\angle{-20.0^\\circ}\\) V، \\(P_d \\approx 1014\\) W، \\(P_o \\approx 949\\) W، \\(\\omega_m = 1256.64\\) rad/sec، \\(T_o \\approx 0.76\\) N.m، \\(P_{in} = 1466.4\\) W، \\(\\eta \\approx 64.7\\%\\). الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».')+
   det('س٤-٧: «محرك توالٍ عام 220 فولت، 60 هيرتز، ذو زوجين من الأقطاب، يدور بسرعة 6000 لفة في الدقيقة ويسحب تياراً مقداره 7 أمبير ومعامل القدرة 0.90 متأخر، وثوابت ملفات المنتج والمجال (التوالي): \\(Z_a = 5.5 + j7.4\\,Ω\\)؛ \\(Z_s = 3.5 + j3.2\\,Ω\\). احسب: معامل القدرة والجهد المتولد وقدرة الخرج والعزم المتولد وكفاءة المحرك، إذا كانت المفاقيد الحديدية والميكانيكية 70 وات.»','','باستخدام معامل القدرة المعطى 0.90: \\(E_a \\approx 136.7\\angle{-16.7^\\circ}\\) V، \\(P_d \\approx 957\\) W، \\(P_o \\approx 887\\) W، \\(\\omega_m = 628.32\\) rad/sec، \\(T_o \\approx 1.41\\) N.m، \\(P_{in} = 1386\\) W، \\(\\eta \\approx 64.0\\%\\). انظر الملاحظة على السؤال أدناه.')},
  {err:'س٤-٧ ص 67 يعطي معامل القدرة (0.90) ثم يطلب حسابه. وإذا حسبناه من الدائرة كما في مثال (٤-١) (الجهد المتولد في طور التيار) نجد <span class="ltr">sin φ = 7 × 10.6 / 220 = 0.337</span> أي <span class="ltr">pf ≈ 0.94</span> لا 0.90؛ فالمعطيات غير متسقة. في س٤-٦ يعطي الحساب نفسه 0.94 مطابقاً للمعطى.'}
 ],
 examples:[
  {title:'س٤-٦ (حساب مقترح — ليس من الكتاب)',ref:'ص 67',q:'<p>بنفس خطوات مثال (٤-١) وتقريبه. الكتاب لا يعطي إجابة لهذا السؤال.</p>',given:cloneG(G41,G46),solve:(g,B)=>uniSteps(g,B,null)},
  {title:'س٤-٧ (حساب مقترح — ليس من الكتاب)',ref:'ص 67',q:'<p>بنفس خطوات مثال (٤-١) وبمعامل القدرة المعطى 0.90. لاحظ أن زاوية \\(E_a\\) هنا لا تساوي زاوية التيار، لأن المعطيات غير متسقة (انظر الملاحظة في الشرح).</p>',given:cloneG(G41,G47),solve:(g,B)=>uniSteps(g,B,null)}
 ],
 quiz:[
  {q:'س١: المحرك العام هو المحرك الذي ……….',o:['يمكن استخدامه في جميع الأغراض','يمكن أن يعمل على كل من التيار المستمر والمتردد','يعمل على التيار المتردد فقط','يعمل على التيار المستمر فقط'],c:1,e:'إجابة مقترحة من نص ص 59.'},
  {q:'س٢: عندما يوصل محرك التوالي للتيار المستمر بمصدر للتيار المتردد، فإنه ……….',o:['يعمل بكفاءة منخفضة','يعمل بمعامل قدرة منخفض','تحدث شرارة بين الموحد والفرش','جميع ما سبق'],c:3,e:'إجابة مقترحة: الشرارة مذكورة صراحة ص 59، والكفاءة ومعامل القدرة نتيجة معاوقة الملفات.'},
  {q:'س٣: عندما يعمل المحرك العام على مصدر للتيار المستمر ………….',o:['يعمل بكفاءة عالية','يولد عزماً أكبر','يدور بسرعة أعلى','جميع ما سبق','عكس ما سبق'],c:3,e:'إجابة مقترحة: الشكل (٤-٣) وص 61.'},
  {q:'س٤: من أهم خواص المحرك العام ………..',o:['أداؤه الجيد عند التشغيل بالتيار المتردد','أداؤه الجيد عند التشغيل بالتيار المستمر','سرعته المنخفضة عند جميع الأحمال','سرعته العالية عند جميع الأحمال','قدرته العالية مقارنة بحجمه'],c:4,e:'إجابة مقترحة: «ذو قدرة عالية مقارنة بحجمه» ص 61.'},
  {q:'كيف نعكس اتجاه دوران المحرك التنافري؟',o:['بعكس قطبية المصدر','بإزاحة الفرش من موقع المعاوقة الكبيرة إلى الجهة الأخرى','بفتح دائرة الفرش','بتقليل الجهد'],c:1,e:'المحرك يدور عكس اتجاه إزاحة الفرش (ص 65).'},
  {q:'محرك تنافري وُصّل بالمصدر ولم يدر. أي الأسباب ممكن حسب الكتاب؟',o:['الفرش عند α = 0° أو α = 90°','الفرش عند 20°','التردد 60 Hz','الثابت له أربعة أقطاب'],c:0,e:'في الموقعين يتلاشى العزم (ص 65).'}
 ]
});
})(PLCBOOK);
