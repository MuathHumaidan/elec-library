/* Unit 3 — تشغيل المحرك الحثي الثلاثي الأوجه بسرعتين (داهلندر) (ص 57–84) */
(function(B){
const {S,clamp,W}=B;

/* =====================================================================
   Shared drawings for this unit
   ===================================================================== */
function cp(x1,y1,x2,y2,n){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.16,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${x1.toFixed(1)} ${y1.toFixed(1)}L${(x1+ux*lead).toFixed(1)} ${(y1+uy*lead).toFixed(1)}`;
  for(let i=1;i<=n;i++){p+=`A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(x1+ux*(lead+seg*i)).toFixed(1)} ${(y1+uy*(lead+seg*i)).toFixed(1)}`}
  return p+`L${x2.toFixed(1)} ${y2.toFixed(1)}`}
const openDot=(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;

/* Motor windings: 'phases' (1-3) | 'delta' (2-3) | 'yy' (3-3). on = energized */
function windDahl(mode,on){
  const wc=on?'w flow':'w',lc=on?'live':'';let s='';
  if(mode==='phases'){
    [['U','X',60],['V','Y',130],['W','Z',200]].forEach(([a,b,x])=>{
      s+=S.t(x,20,a)+S.w(`M${x} 26V40`,'')+`<path class="w" d="${cp(x,40,x,114,3)}"/>`+openDot(x,120)+`<path class="w" d="${cp(x,126,x,200,3)}"/>`+S.w(`M${x} 200V214`,'')+S.t(x,232,b)+S.t(x+20,124,'','m');
    });
    return `<svg viewBox="0 0 260 240" role="img" aria-label="ملفات المحرك الثلاثة بنقطة وسط">${s}</svg>`;
  }
  if(mode==='delta'){
    const cx=130,cy=140,R=86,ang=[-90,30,150].map(a=>a*Math.PI/180),P=ang.map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
    const cn=['U1','V1','W1'],ln=['L1','L2','L3'],mn=['U2','V2','W2'];
    for(let i=0;i<3;i++){const a=P[i],b=P[(i+1)%3],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];
      s+=`<path class="${wc}" d="${cp(a[0],a[1],m[0],m[1],3)}"/><path class="${wc}" d="${cp(m[0],m[1],b[0],b[1],3)}"/>`;
      const ox=(m[0]-cx)*0.28,oy=(m[1]-cy)*0.28;s+=S.w(`M${m[0]} ${m[1]}L${m[0]+ox} ${m[1]+oy}`,'')+openDot(m[0]+ox,m[1]+oy)+S.t(m[0]+ox*2.3,m[1]+oy*2.3+4,mn[i],'b');}
    P.forEach((p,i)=>{const ox=Math.cos(ang[i])*20,oy=Math.sin(ang[i])*20;s+=S.w(`M${p[0]} ${p[1]}L${p[0]+ox} ${p[1]+oy}`,lc)+S.dot(p[0],p[1])+S.t(p[0]+ox*1.9+(i===0?22:0),p[1]+oy*1.9+4,cn[i])+S.t(p[0]+ox*1.9+(i===0?-20:0),p[1]+oy*1.9+(i===0?4:18),ln[i],'m')});
    return `<svg viewBox="0 0 260 250" role="img" aria-label="توصيلة الدلتا">${s}</svg>`;
  }
  // double star
  const cx=130,cy=126,R=88,ang=[-90,30,150].map(a=>a*Math.PI/180),en=['U2','V2','W2'],ln=['L1','L2','L3'];
  ang.forEach((a,i)=>{const ux=Math.cos(a),uy=Math.sin(a),px=-uy,py=ux,E=[cx+R*ux,cy+R*uy];
    [-8,8].forEach(o=>{const x1=cx+ux*14+px*o,y1=cy+uy*14+py*o,x2=cx+ux*(R-14)+px*o,y2=cy+uy*(R-14)+py*o;
      s+=S.w(`M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}`,on?'flow':'')+`<path class="${wc}" d="${cp(x1,y1,x2,y2,4)}"/>`+S.w(`M${x2.toFixed(1)} ${y2.toFixed(1)}L${E[0].toFixed(1)} ${E[1].toFixed(1)}`,on?'flow':'')});
    const ox=ux*18,oy=uy*18;s+=S.w(`M${E[0]} ${E[1]}L${E[0]+ox} ${E[1]+oy}`,lc)+S.dot(E[0],E[1])+S.t(E[0]+ox*1.9+(i===0?22:0),E[1]+oy*1.9+4,en[i])+S.t(E[0]+ox*1.9+(i===0?-20:0),E[1]+oy*1.9+(i===0?4:18),ln[i],'m')});
  s+=`<circle cx="${cx}" cy="${cy}" r="6" fill="${on?'var(--live)':'var(--fg)'}"/>`+S.t(cx,cy+44,'U1 V1 W1','b');
  return `<svg viewBox="0 0 260 250" role="img" aria-label="توصيلة الدبل النجمة">${s}</svg>`;
}

/* rotating-field ring: p poles (توضيح) */
function polesSVG(p,on){
  const c=80,R1=72,R2=50;let g='';
  for(let i=0;i<p;i++){const a0=(i*360/p-90)*Math.PI/180,a1=((i+1)*360/p-90)*Math.PI/180,am=(a0+a1)/2;const lg=(360/p)>180?1:0;
    const d=`M${c+R2*Math.cos(a0)} ${c+R2*Math.sin(a0)}L${c+R1*Math.cos(a0)} ${c+R1*Math.sin(a0)}A${R1} ${R1} 0 ${lg} 1 ${c+R1*Math.cos(a1)} ${c+R1*Math.sin(a1)}L${c+R2*Math.cos(a1)} ${c+R2*Math.sin(a1)}A${R2} ${R2} 0 ${lg} 0 ${c+R2*Math.cos(a0)} ${c+R2*Math.sin(a0)}Z`;
    g+=`<path d="${d}" fill="${i%2?'var(--blue-soft)':'var(--live-soft)'}" stroke="var(--line)"/>`+S.t((c+(R1+R2)/2*Math.cos(am)).toFixed(1),(c+(R1+R2)/2*Math.sin(am)+4).toFixed(1),i%2?'S':'N',i%2?'b':'')}
  const dur=p===8?6:3;
  return `<svg viewBox="0 0 160 160" role="img" aria-label="عدد الأقطاب ${p}" style="max-width:170px;display:block;margin-inline:auto"><g>${g}${on?`<animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="${dur}s" repeatCount="indefinite"/>`:''}</g>`+
    `<circle cx="80" cy="80" r="44" fill="var(--surface)" stroke="var(--line)"/>`+S.t(80,80,String(p),'',null,22)+S.t(80,98,'poles','m')+`</svg>`;
}

/* Main (power) circuit, الشكل (4-3) = (20-4): K1 -> F4 -> U1 V1 W1 ; K2 -> F5 -> U2 V2 W2 ; K3 shorts U1 V1 W1 */
function powerDahl(K1,K2,K3,o){o=o||{};const bl=!!o.blown;
  const delta=K1&&!K2&&!K3&&!bl,yy=K2&&K3&&!K1&&!bl,run=delta||yy;
  const sup=S.cls(1,run),aft=bl?'':S.cls(1,run);
  const k1a=delta?'flow':(K1&&!bl?'live':''),k1b=run?'flow':(K1&&!bl?'live':'');
  const k3lo=yy?'flow':(K1&&!bl?'live':''),k3hi=yy?'flow':(K1&&K3&&!bl?'live':'');
  const k2t=yy?'flow':(bl?'':'live'),k2o=yy?'flow':((K2||delta)&&!bl?'live':'');
  const cols=[70,95,120],bus=[24,40,56],k2c=[270,295,320],k3c=[165,190,215],tapY={120:240,95:252,70:264};
  let s=`<svg viewBox="0 0 440 430" role="img" aria-label="الدائرة الرئيسة لمحرك داهلندر">`;
  bus.forEach((y,i)=>{s+=S.w(`M40 ${y}H425`,sup)+S.t(26,y+4,'L'+(i+1))});
  cols.forEach((x,i)=>{s+=S.w(`M${x} ${bus[i]}V72`,sup)+S.dot(x,bus[i])+S.fuse(x,72,sup)+S.w(`M${x} 96V150`,aft);
    if(bl)s+=`<path d="M${x-8} 76L${x+8} 92M${x+8} 76L${x-8} 92" stroke="var(--stop)" stroke-width="2.6" stroke-linecap="round"/>`;
    const ty=112+i*10;s+=S.dot(x,ty)+S.w(`M${x} ${ty}H${k2c[i]}V150`,k2t)});
  s+=S.t(140,89,'F1..3','m','start');
  cols.forEach(x=>{s+=S.vC(x,150,182,{closed:K1,inC:aft,outC:k1a})});s+=S.mech(58,128,166)+S.t(52,170,'K1','','end');
  k2c.forEach(x=>{s+=S.vC(x,150,182,{closed:K2,inC:k2t,outC:k2o})});s+=S.mech(258,328,166)+S.t(336,170,'K2','','start');
  // K3: upper terminals shorted together, lower terminals on K1 outputs
  s+=S.w(`M${k3c[0]} 190H${k3c[2]}`,k3hi);
  k3c.forEach((x,i)=>{const col=cols[2-i];s+=S.vC(x,190,222,{closed:K3,inC:k3hi,outC:k3lo})+S.w(`M${x} 222V${tapY[col]}H${col}`,k3lo)+S.dot(col,tapY[col])});
  s+=S.mech(153,227,206)+S.t(234,210,'K3','','start');
  cols.forEach(x=>{s+=S.w(`M${x} 182V${tapY[x]}`,k1a)+S.w(`M${x} ${tapY[x]}V282`,k1b)+S.thermal(x,290,k1b)});s+=S.t(52,307,'F4','','end');
  k2c.forEach(x=>{s+=S.w(`M${x} 182V282`,k2o)+S.thermal(x,290,k2o)});s+=S.t(336,307,'F5','','start');
  const cx=195,cy=385,r=34,ex=19.3;
  s+=S.w(`M120 322V${cy-28}H${cx-ex}`,k1b)+S.w(`M95 322V${cy}H${cx-r}`,k1b)+S.w(`M70 322V${cy+28}H${cx-ex}`,k1b);
  s+=S.w(`M270 322V${cy-28}H${cx+ex}`,k2o)+S.w(`M295 322V${cy}H${cx+r}`,k2o)+S.w(`M320 322V${cy+28}H${cx+ex}`,k2o);
  s+=S.motor(cx,cy,r,run,'M','4/8');
  s+=S.t(146,cy-32,'W1','m')+S.t(134,cy-4,'V1','m')+S.t(146,cy+24,'U1','m')+S.t(244,cy-32,'U2','m')+S.t(256,cy-4,'V2','m')+S.t(244,cy+24,'W2','m');
  return s+'</svg>';
}

/* motor model (illustrative numbers) */
const Ilow=n=>3.5+24*Math.pow(clamp((750-Math.abs(n))/750,0,1),.6), Ihigh=n=>6+42*Math.pow(clamp((1500-Math.abs(n))/1500,0,1),.6);
function dahlMode(k){return k.K1&&!k.K2&&!k.K3?'delta':k.K2&&k.K3&&!k.K1?'yy':'off'}
function dahlPlant(get){
  const p=B.motorPlant(st=>{const m=dahlMode(get(st));
    if(m==='delta')return {target:710,tau:1.1,I:Ilow,label:'دلتا Δ — بطيئة',mode:'slow'};
    if(m==='yy')return {target:1440,tau:1.3,I:Ihigh,label:'دبل نجمة YY — عالية',mode:'fast'};
    return null},{ymax:60,ticks:[0,20,40,60],refs:[{v:9,color:'--muted'}],nameplate:'M 4/8 · 3~ · 380 v · 50 Hz<br>Δ  8 poles ≈ 710 rpm<br>YY 4 poles ≈ 1440 rpm'});
  p.title='محرك داهلندر';
  p.chart.legend='<span><i style="background:var(--blue)"></i>تيار الخط (أرقام توضيحية)</span><span><i style="background:var(--muted)"></i>تيار السرعة العالية المقنن ≈ 9 A</span>';
  p.render=(el,st)=>{const m=dahlMode(get(st));
    el.innerHTML=`<div class="svgbox" style="margin-top:0;max-width:220px">${windDahl(m==='yy'?'yy':'delta',m!=='off')}</div><p class="sub">${m==='delta'?'التغذية على <b>U1 V1 W1</b>: دلتا، <b>8 أقطاب</b>، سرعة بطيئة.':m==='yy'?'التغذية على <b>U2 V2 W2</b> و U1 V1 W1 مقصورة: دبل نجمة، <b>4 أقطاب</b>، سرعة عالية.':'الملفات غير متصلة بالشبكة.'}</p><p class="sub">السرعات أرقام توضيحية (ليست من الكتاب).</p>`};
  p.sig=pl=>pl.mode;p.label=pl=>pl.label;
  return p;
}

/* ---------- timers ---------- */
const TT={
 SP:{n:1,box:'S_PULSE',name:'المزمن النبضي',en:'Pulse Timer',tv:'S5T#5M6S',fig:'(10-3)',td:'(11-3)',page:'ص 69',
   rule:'الخرج يعمل مع بداية Start ويستمر مدة T فقط. ينقطع فوراً إذا فُصل Start قبل انتهاء T أو وصل Reset.'},
 SE:{n:2,box:'S_PEXT',name:'المزمن النبضي الممتد',en:'Extended Pulse Timer',tv:'S5T#2H10S',fig:'(12-3)',td:'(13-3)',page:'ص 70',
   rule:'نبضة قصيرة على Start تكفي: الخرج يستمر مدة T كاملة حتى لو فُصل Start. إعادة Start أثناء الخرج تبدأ العد من جديد، و Reset يقطعه فوراً.'},
 SD:{n:3,box:'S_ODT',name:'مزمن التشغيل المتأخر',en:'On Delay Timer',tv:'S5T#2H30S',fig:'(14-3)',td:'(15-3)',page:'ص 72',
   rule:'الخرج يعمل بعد مرور T من بداية Start بشرط أن يبقى Start موصلاً، ويفصل مع فصل Start أو مع Reset.'},
 SS:{n:4,box:'S_ODTS',name:'مزمن التشغيل المتأخر المخزن',en:'"Retentive" On Delay Timer',tv:'S5T#15M40S',fig:'(16-4)',td:'(17-4)',page:'ص 74',
   rule:'نبضة على Start تكفي: بعد T يعمل الخرج ويبقى حتى يصل Reset فقط. النبضات المتكررة قبل انتهاء T تجعل العد يبدأ من آخر نبضة.'},
 SF:{n:5,box:'S_OFFDT',name:'مزمن الفصل المتأخر',en:'Off Delay Timer',tv:'S5T#1H23M',fig:'(18-4)',td:'(19-4)',page:'ص 76',
   rule:'الخرج يعمل فوراً مع Start. بعد فصل Start يبقى مدة T ثم يفصل. Reset يفصله فوراً.'}
};
/* book timing diagrams, time in units of T (positions chosen to reproduce the printed figures) */
const TD={
 SP:{end:6.8,S:[[0,1.6],[2.0,2.5],[3.0,3.9],[4.0,4.9],[5.0,6.6]],R:[[3.4,4.4]],Q:[[0,1],[2,2.5],[3,3.4],[5,6]],
   pts:[[1,0],[2,1],[3,2],[4,2.5],[5,3],[6,3.4],[7,4],[8,4.4],[9,5],[10,6]],ph:[['A',0,2],['B',2,3],['C',3,5]],tm:[[0,1],[5,6]]},
 SE:{end:7.2,S:[[0,1.6],[2.0,2.3],[3.5,3.7],[4.0,4.2],[5.5,5.8],[6.2,6.4]],R:[[6.0,6.6]],Q:[[0,1],[2,3],[3.5,5],[5.5,6]],
   pts:[[1,0],[2,1],[3,2],[4,2.3],[5,3],[6,3.5],[7,4],[8,5],[9,5.5],[10,6],[11,7]],ph:[['A',0,2],['B',2,3.5],['C',3.5,5.5],['D',5.5,7]],tm:[[0,1],[2,3],[4,5]]},
 SD:{end:7.4,S:[[0,1.6],[2.0,2.5],[3.0,5.3],[5.8,7.4]],R:[[4.5,4.7],[6.4,6.8]],Q:[[1,1.6],[4,4.5]],
   pts:[[1,0],[2,1],[3,1.6],[4,2],[5,2.5],[6,3],[7,4],[8,4.5],[9,4.7],[10,5.3],[11,5.8],[12,6.4],[13,6.8]],ph:[['A',0,1.6],['B',1.6,5.8],['C',5.8,7.4]],tm:[[0,1],[3,4]]},
 SS:{end:6.8,S:[[0,1.5],[2.0,2.4],[4.0,4.15],[4.3,4.45],[4.6,4.75]],R:[[1.3,1.4],[3.4,3.5],[6.2,6.3]],Q:[[1,1.3],[3,3.4],[5.6,6.2]],
   pts:[[1,0],[2,1.3],[3,1.5],[4,2],[5,2.4],[6,3.4],[7,4],[8,4.6],[9,6.2]],ph:[['A',0,1.3],['B',2,3.4],['C',4,6.2]],tm:[[0,1],[2,3],[4.6,5.6]]},
 SF:{end:7.6,S:[[0,0.6],[2.0,2.3],[2.4,2.7],[2.8,3.1],[4.5,4.8],[6.1,7.6]],R:[[5.3,5.4],[5.8,6.6],[7.0,7.6]],Q:[[0,1.6],[2,4.1],[4.5,5.3]],
   pts:[[1,0],[2,0.6],[3,2],[4,2.4],[5,3.1],[6,4.5],[7,4.8],[8,5.3],[9,5.8],[10,6.1],[11,6.6],[12,7],[13,7.3]],ph:[['A',0,2],['B',2,4.5],['C',4.5,7.6]],tm:[[0.6,1.6],[3.1,4.1]]}
};
const inSeg=(a,u)=>a.some(([x,y])=>u>=x&&u<y);

/* generic timing diagram (static SVG). f:{end, rows:[[label,segs,colorVar]], pts:[[n,t]], ph:[[l,a,b]], tm:[[a,b]], tmRow, unit} */
function tdSVG(f){
  const X0=86,X1=650,sc=(X1-X0)/f.end,x=t=>(X0+t*sc).toFixed(1),rh=54,top=36;
  const nR=f.rows.length,qy=top+(nR-1)*rh+40,H=qy+(f.tm&&f.tm.length?50:30);
  let s='';
  (f.ph||[]).forEach(([l,a,b])=>{s+=`<path class="sym dim" d="M${x(a)} 26V18H${x(b)}V26"/>`+S.t(((+x(a))+(+x(b)))/2,14,l,'b')});
  (f.pts||[]).forEach(([n,t])=>{s+=`<path d="M${x(t)} 30V${H-16}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(x(t),H-3,String(n),'m')});
  f.rows.forEach(([lb,segs,col],i)=>{const y0=top+i*rh+40,y1=y0-28;
    s+=`<path d="M${X0} ${y0}H${X1}" stroke="var(--line)"/>`+S.t(X0-8,y0-9,lb,'','end');
    let d=`M${X0} ${y0}`;segs.forEach(([a,b])=>{d+=`H${x(a)}V${y1}H${x(b)}V${y0}`});d+=`H${X1}`;
    s+=`<path d="${d}" fill="none" stroke="var(${col})" stroke-width="2.4" stroke-linejoin="round"/>`});
  (f.tm||[]).forEach(([a,b])=>{const y=qy+12;s+=`<path class="sym dim" d="M${x(a)} ${y}H${x(b)}M${x(a)} ${y-5}V${y+5}M${x(b)} ${y-5}V${y+5}"/>`+S.t(((+x(a))+(+x(b)))/2,y+14,f.unit||'T','b')});
  return `<svg viewBox="0 0 660 ${H}" role="img" aria-label="مخطط زمني">${s}</svg>`;
}
const timerTD=k=>tdSVG({end:TD[k].end,rows:[['Start',TD[k].S,'--on'],['Reset',TD[k].R,'--stop'],['Output Q',TD[k].Q,'--live']],pts:TD[k].pts,ph:TD[k].ph,tm:TD[k].tm});

/* LAD timer box like the book's figures (9-3)…(18-4). o:{type, tv, S, R, Q, live, bi, bcd} */
function timerBox(o){
  const k=o.type,t=TT[k],L=!!o.live,c=v=>L&&v?'live':'';
  const contact=(x,y,lbl,v)=>`${S.w(`M10 ${y}H${x-7}`,L?'live':'')}${L&&v?`<rect class="cpass" x="${x-7}" y="${y-11}" width="14" height="22"/>`:''}<path class="sym" d="M${x-7} ${y-11}V${y+11}M${x+7} ${y-11}V${y+11}"/><text class="lad-txt" x="${x}" y="${y-17}" text-anchor="middle">${lbl}</text>`+S.w(`M${x+7} ${y}H200`,c(v));
  let s=`<svg viewBox="0 0 470 196" role="img" aria-label="صندوق المزمن ${t.box}">`;
  s+=S.w('M10 40V176',L?'live':'');
  s+=contact(70,74,'I0.1',o.S)+`<text class="lad-txt" x="192" y="118" text-anchor="end">${o.tv||t.tv}</text>`+S.w('M194 114H200','')+contact(70,154,'I0.0',o.R);
  s+=`<rect class="fbox" x="200" y="44" width="120" height="132" rx="3"/><text class="lad-txt" x="260" y="36" text-anchor="middle">T${t.n}</text><text class="lad-txt" x="260" y="60" text-anchor="middle">${t.box}</text>`;
  s+=`<text class="lad-txt" x="206" y="78">S</text><text class="lad-txt" x="206" y="118">TV</text><text class="lad-txt" x="206" y="158">R</text>`;
  s+=`<text class="lad-txt" x="314" y="78" text-anchor="end">Q</text><text class="lad-txt" x="314" y="118" text-anchor="end">BI</text><text class="lad-txt" x="314" y="158" text-anchor="end">BCD</text>`;
  s+=S.w('M320 74H384',c(o.Q))+`<path class="sym ${L&&o.Q?'hot':''}" d="M386 63Q378 74 386 85M398 63Q406 74 398 85"/>`+(L&&o.Q?`<circle cx="392" cy="74" r="5" fill="var(--on)"/>`:'')+`<text class="lad-txt" x="392" y="56" text-anchor="middle">Q4.4</text>`+S.w('M406 74H440','');
  s+=S.w('M320 114H340','')+`<text class="lad-txt" x="344" y="118">${L?o.bi:'...'}</text>`+S.w('M320 154H340','')+`<text class="lad-txt" x="344" y="158">${L?o.bcd:'...'}</text>`;
  return s+'</svg>';
}
const progFor=(k,tv)=>{const n=TT[k].n;return [{title:`Network 1 — ${TT[k].box} T${n}`,read:`المزمن T${n} من نوع <b>${k}</b> (${TT[k].name}): مدخل التشغيل S = I0.1، وزمنه TV = ${tv} s، ومدخل الفصل R = I0.0، وخرجه يشغّل Q4.4.`,
  stl:['A I 0.1',`L S5T#${tv}S`,`${k} T ${n}`,'A I 0.0',`R T ${n}`,`A T ${n}`,'= Q 4.4']}]};
const TNAMES={'I0.1':'Start','I0.0':'Reset','Q4.4':'Q'};

/* small helpers for custom labs */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function wirePB(b,on){let t0=0,down=false,tmr=0;
  const press=()=>{if(tmr){clearTimeout(tmr);tmr=0}down=true;t0=performance.now();b.classList.add('down');on(1)};
  const rel=()=>{if(!down)return;down=false;const w=Math.max(0,260-(performance.now()-t0));tmr=setTimeout(()=>{tmr=0;b.classList.remove('down');on(0)},w)};
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture&&b.setPointerCapture(e.pointerId);press()});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,rel));
  b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press()}});
  b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')rel()});
  b.addEventListener('contextmenu',e=>e.preventDefault());}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة أو تجربة قيم أخرى.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}};}
const pbHTML=(id,color,cap,label)=>`<button class="pb ${color}" id="${id}" aria-label="${label}"><span class="cap">${cap}</span><small>${label}</small></button>`;
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
function cssCol(){const cs=getComputedStyle(document.documentElement);return n=>cs.getPropertyValue(n).trim()||'#888'}

/* live timing diagram on a canvas (last `span` seconds) */
function drawLive(cv,hist,now,span,tv){
  const r=cv.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width)return;
  if(cv.width!==Math.round(r.width*dpr)||cv.height!==Math.round(r.height*dpr)){cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr)}
  const g=cv.getContext('2d'),Wd=r.width,H=r.height,col=cssCol();g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,Wd,H);g.direction='ltr';
  const pl=88,pr=10,pt=26,pb=20,iw=Wd-pl-pr,rows=[['Start  I0.1','S','--on'],['Reset  I0.0','R','--stop'],['Q  Q4.4','Q','--live'],['T counting','run','--blue']],rh=(H-pt-pb)/rows.length;
  const X=t=>pl+iw*(1-(now-t)/span);
  g.font='11px "IBM Plex Mono",monospace';g.lineWidth=1;
  for(let s=0;s<=span;s++){const x=pl+iw*(s/span);g.strokeStyle=col('--line');g.globalAlpha=s%5===0?0.9:0.35;g.beginPath();g.moveTo(x,pt-6);g.lineTo(x,H-pb);g.stroke()}
  g.globalAlpha=1;g.fillStyle=col('--muted');g.textAlign='center';g.textBaseline='top';for(let s=0;s<=span;s+=5)g.fillText((s-span)+'s',pl+iw*(s/span),H-pb+4);
  // T scale bar
  const bx1=Wd-pr,bx0=bx1-iw*(tv/span);g.strokeStyle=col('--blue');g.lineWidth=2;g.beginPath();g.moveTo(bx0,8);g.lineTo(bx1,8);g.moveTo(bx0,3);g.lineTo(bx0,13);g.moveTo(bx1,3);g.lineTo(bx1,13);g.stroke();
  g.fillStyle=col('--blue');g.textAlign='right';g.textBaseline='middle';g.fillText('T = '+tv+' s',bx0-6,9);
  rows.forEach(([lb,k,c],i)=>{const base=pt+i*rh+rh*0.82,hi=pt+i*rh+rh*0.22;
    g.fillStyle=col('--fg');g.textAlign='left';g.textBaseline='middle';g.fillText(lb,6,(base+hi)/2);
    g.strokeStyle=col('--line');g.lineWidth=1;g.beginPath();g.moveTo(pl,base);g.lineTo(Wd-pr,base);g.stroke();
    if(hist.length<2)return;g.strokeStyle=col(c);g.lineWidth=2.4;g.beginPath();let py=null;
    hist.forEach((p,j)=>{const x=Math.max(pl,X(p.t)),y=p[k]?hi:base;if(j===0)g.moveTo(x,y);else{g.lineTo(x,py);g.lineTo(x,y)}py=y});g.lineTo(X(now),py);g.stroke()});
}

/* ---------- TIMER WORKBENCH (custom lab used by lessons 3–5) ---------- */
function timerBench(el,opt){
  const TVS=[2,3,5,8],SPAN=16;
  let type=opt.def,tv=3,P=null,t=0,hist=[],play=null,view='lad',lastSig='',bS=0,bR=0,latchS=0,prevQ=0,prevS=0,cur=null,curS=null,sfBlock=0,histT=0;
  const w={type,pulses:[],spulses:[],played:{},flags:{},scen:0,S:0,R:0,Q:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>منضدة المزمنات <small>نفس توصيل أشكال الكتاب: S ← I0.1، R ← I0.0، Q → Q4.4</small></h2>
    <div class="wrap-in" style="padding:6px 0 0;align-items:flex-start">
     <div><div class="sub">نوع المزمن</div>${segHTML('ty',Object.keys(TT).map(k=>[k,k]),type)}</div>
     <div><div class="sub">الزمن TV</div>${segHTML('tv',TVS.map(v=>[v,`<span class="ltr">${v} s</span>`]),tv)}</div>
     <div class="pbs">${pbHTML('tbS','green','S','Start · I0.1')}${pbHTML('tbR','red','R','Reset · I0.0')}${swHTML('tbL','Start','مفتاح ثابت',0)}</div>
     <div class="lamps"><div class="lamp" id="tbLamp"><i></i><b>Q</b><span class="mono">Q4.4</span></div></div>
     <div class="reads"><div class="read"><span>المزمن</span><b id="tbName">T1</b></div><div class="read"><span>الزمن المتبقي</span><b id="tbRem">—</b></div></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:10px"><button class="btn primary" id="tbPlay">▶ تسلسل الكتاب <span id="tbFig"></span></button><button class="btn" id="tbClr">مسح المخطط</button><span class="sub" id="tbPlayInfo"></span></div>
    <div class="callout" id="tbRule"></div></div>
   <div class="panel c7"><h2>المخطط الزمني الحي <small>آخر ${SPAN} ثانية</small></h2><p class="sub">كل ضغطة تُرسم فوراً. قارن ما تراه بأشكال الكتاب في تبويب «الشرح».</p><div class="chart" style="height:250px"><canvas id="tbCv"></canvas></div></div>
   <div class="panel c5"><h2>صندوق المزمن <small id="tbBoxRef"></small></h2><div class="svgbox" id="tbBox"></div><p class="sub">المخرجان BI و BCD غير موصولين في الكتاب؛ نعرض عليهما الزمن المتبقي للتوضيح فقط.</p></div>
   <div class="panel c7"><div class="viewseg"><h2>البرنامج يعمل الآن</h2>${segHTML('view',[['lad','LAD'],['fbd','FBD'],['stl','STL']],view)}</div><p class="sub" id="tbRead"></p><div id="tbNet"></div>
    <div class="callout"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يرسم المزمن صندوقاً في LAD فقط؛ قائمة STL المكافئة هنا للتوضيح.</div></div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="tbSteps"></ol></div>
   ${opt.extra?'<div class="panel c12" id="tbExtra"></div>':''}
  </div>`;
  const $=s=>el.querySelector(s);
  function build(){P=B.createPLC(progFor(type,tv));cur=null;curS=null;sfBlock=0;prevQ=0;lastSig='';
    el.querySelectorAll('[data-ty]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ty===type));
    el.querySelectorAll('[data-tv]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.tv===tv));
    $('#tbRule').innerHTML=`<b>${type} — ${TT[type].name} (${TT[type].en}):</b> ${TT[type].rule}`;
    $('#tbName').textContent='T'+TT[type].n;$('#tbFig').textContent='الشكل '+TT[type].td;$('#tbBoxRef').textContent='مثل الشكل '+TT[type].fig+' '+TT[type].page;}
  const stopPlay=()=>{if(play){play=null;$('#tbPlayInfo').textContent=''}};
  el.querySelectorAll('[data-ty]').forEach(b=>b.addEventListener('click',()=>{stopPlay();type=b.dataset.ty;build()}));
  el.querySelectorAll('[data-tv]').forEach(b=>b.addEventListener('click',()=>{stopPlay();tv=+b.dataset.tv;build()}));
  el.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;el.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',x===b));lastSig=''}));
  wirePB($('#tbS'),v=>{if(v)stopPlay();bS=v});wirePB($('#tbR'),v=>{if(v)stopPlay();bR=v});
  $('#tbL').addEventListener('click',e=>{stopPlay();latchS=latchS?0:1;e.currentTarget.setAttribute('aria-pressed',latchS?'true':'false')});
  $('#tbClr').addEventListener('click',()=>{hist=[]});
  $('#tbPlay').addEventListener('click',()=>{tv=2;latchS=0;$('#tbL').setAttribute('aria-pressed','false');build();hist=[];play={t0:t,k:type};$('#tbPlayInfo').textContent=`يعيد المختبر الشكل ${TT[type].td} بزمن T = 2 s. تابع النقاط المرقمة في الشرح.`});
  const steps=stepsUI($('#tbSteps'),opt.steps,()=>w);
  const extra=opt.extra?opt.extra($('#tbExtra'),w):null;
  build();
  loopOn(el,dt=>{
    t+=dt;let Sv,Rv;
    if(play){const u=(t-play.t0)/2,f=TD[play.k];Sv=inSeg(f.S,u)?1:0;Rv=inSeg(f.R,u)?1:0;if(u>f.end){w.played[play.k]=1;play=null;$('#tbPlayInfo').textContent='انتهى التسلسل. قارنه بالشكل في الشرح.'}}
    else{Sv=(bS||latchS)?1:0;Rv=bR?1:0}
    const key='T'+TT[type].n;
    P.set('I0.1',Sv);P.set('I0.0',Rv);P.scan(dt);
    const tm=P.tim[key]||{q:0,run:0,el:0,tv:tv};
    if(type==='SF'){ // book (19-4): after a Reset while Start is still 1, Q stays 0 until Start goes 0 and 1 again
      if(Sv&&Rv)sfBlock=1;
      if(!Sv){if(sfBlock&&prevS){tm.run=0;tm.q=0;P.set('Q4.4',0)}sfBlock=0}
      if(sfBlock&&Sv){tm.q=0;tm.run=0;P.set('Q4.4',0);const tr=P.trace[0];if(tr){tr[5]=0;tr[6]=0}}}
    const Q=P.get('Q4.4');
    // event tracking for guided steps
    if(Sv&&!prevS){if(type==='SS'&&tm.run&&!Q)w.flags.ssRetrig=1;if(cur&&prevQ&&type==='SE')cur.retrig=true;curS={t0:t,type,hadQ:Q}}
    if(curS&&Q)curS.hadQ=1;
    if(!Sv&&prevS&&curS){w.spulses.push({type:curS.type,dur:t-curS.t0,hadQ:curS.hadQ,tv});curS=null}
    if(Q&&!prevQ){cur={t0:t,type,tv,sAtRise:Sv,sRel:!Sv,retrig:false};if(type==='SS'&&!Sv)w.flags.ssNoS=1}
    if(cur&&Q&&!Sv)cur.sRel=true;
    if(!Q&&prevQ&&cur){cur.dur=t-cur.t0;cur.endS=Sv;cur.endR=Rv;w.pulses.push(cur);cur=null}
    prevQ=Q;prevS=Sv;Object.assign(w,{type,tv,S:Sv,R:Rv,Q});
    histT+=dt;if(histT>=0.03||!hist.length||hist[hist.length-1].S!==Sv||hist[hist.length-1].R!==Rv||hist[hist.length-1].Q!==Q){histT=0;hist.push({t,S:Sv,R:Rv,Q,run:tm.run?1:0})}
    while(hist.length>2&&t-hist[1].t>SPAN+0.5)hist.shift();
    drawLive($('#tbCv'),hist,t,SPAN,tv);
    const rem=tm.run?Math.max(0,tm.tv-tm.el):0;
    $('#tbLamp').classList.toggle('on',!!Q);$('#tbRem').textContent=tm.run?rem.toFixed(1)+' s':'—';
    ['tbS','tbR'].forEach((id,j)=>$('#'+id).classList.toggle('down',!!(j?Rv:Sv)));
    const sg=JSON.stringify([Sv,Rv,Q,tm.run,Math.ceil(rem*10),view,type,tv]);
    if(sg!==lastSig){lastSig=sg;const net=P.nets[0];
      $('#tbBox').innerHTML=timerBox({type,tv:`S5T#${tv}S`,S:Sv,R:Rv,Q,live:true,bi:'BI='+Math.round(rem*100),bcd:'W#16#0'+String(Math.round(rem*100)).padStart(3,'0')});
      $('#tbRead').innerHTML=net.read;
      $('#tbNet').innerHTML=view==='stl'?B.stlTable(net,P):`<div class="svgbox fixed">${(view==='lad'?B.ladNetwork:B.fbdNetwork)(net,P,TNAMES)}</div>`;}
    steps.check();if(extra)extra.tick(dt);
  });
}

/* ---------- scenario chooser (lesson 5): book examples ص 78–79 ---------- */
const SCEN=[
 {ty:['SP'],title:'سيران مرتبطان',inp:'السير الأول',out:'السير الثاني',txt:'عمل سيرين مرتبطين مع بعضهما بالبعض الأول غير محدد الزمن ولكن الثاني محدد الزمن بشرط إذا توقف الأول عن العمل في أي لحظة يقف الثاني مباشرة.'},
 {ty:['SP'],title:'العجّانة الكبيرة',inp:'دوران الظرف',out:'ذراع الخفق',txt:'الظرف يدور ويدور معه ذراع الخفق ويكون الزمن محدداً لذراع الخفق فإذا انتهى زمن الخفق وبقي الظرف يدور فلا يتأثر العجين بشيء. أما إذا توقف الظرف لأي سبب طارئ فإن مضرب الخفق يتوقف معه مباشرة.'},
 {ty:['SE'],title:'ماكينة كبس البلوك',inp:'المحرك الهزاز',out:'ذراع الكبس',txt:'قاعدة المكبس تعمل على محرك هزاز، ومع عملية الهز ينزل ذراع الكبس. فإذا توقف محرك الهز عن العمل فإن ذراع الكبس يستمر بالعمل حسب الفترة المحددة ثم يرتفع وتنقل الشغلة بعد ذلك.'},
 {ty:['SE'],title:'منخل الرمل',inp:'سير نقل الرمل',out:'هزّ المنخل',txt:'يبدأ سير نقل الرمل إلى المنخل فيعمل المنخل بطريقة الهز. فإذا توقف السير عن نقل الرمل يستمر المنخل في الهز حتى تنتهي الفترة الزمنية ثم يتوقف عن الهز.'},
 {ty:['SD','SS'],title:'محرك نجمة / دلتا',inp:'تشغيل النجمة',out:'التحويل إلى الدلتا',txt:'يعمل المحرك النجمة ثم بعد فترة زمنية محددة يعمل الدلتا. (ذكره الكتاب مثالاً للنوعين الثالث SD والرابع SS.)'},
 {ty:['SD'],title:'سيور تعمل بالتتابع',inp:'السير الأول',out:'السير الثاني',txt:'يعمل السير الأول ثم بعد فترة زمنية محددة يعمل السير الثاني. وإذا فصل الأول فصل الثاني معه في نفس اللحظة.'},
 {ty:['SS'],title:'محرك يعكس اتجاهه بعد زمن',inp:'تشغيل الاتجاه الأول',out:'الاتجاه الآخر',txt:'المحركات التي تعمل في اتجاه وبعد فترة زمنية تعمل في الاتجاه الآخر وتستمر في العمل.'},
 {ty:['SF'],title:'المخرطة وسائل التبريد',inp:'ظرف المخرطة',out:'مضخة سائل التبريد',txt:'تعمل مضخة سائل التبريد مع الظرف المثبت عليه الشغلة وبعد توقف الظرف عن العمل يستمر سائل التبريد فترة زمنية محددة ثم يقف.'},
 {ty:['SF'],title:'مروحة شفط دورة المياه',inp:'الإضاءة',out:'مروحة الشفط',lamp:1,txt:'مراوح الشفط تعمل مع تشغيل الإضاءة، وإذا تم فصل الإضاءة تستمر مراوح الشفط في العمل لفترة زمنية محددة ثم تفصل.'}
];
function devSVG(id,on,lamp){
  if(lamp)return `<svg viewBox="0 0 90 90" style="width:90px">${W.lamp(45,45,20,on,'#f2c230')}</svg>`;
  let s=`<svg viewBox="0 0 90 90" style="width:90px"><circle cx="45" cy="45" r="40" fill="var(--surface-2)" stroke="${on?'var(--on)':'var(--line)'}" stroke-width="3"/><g id="${id}">`;
  for(let i=0;i<4;i++){const a=i*Math.PI/2;s+=`<path d="M45 45L${45+30*Math.cos(a-.35)} ${45+30*Math.sin(a-.35)}A30 30 0 0 1 ${45+30*Math.cos(a+.35)} ${45+30*Math.sin(a+.35)}Z" fill="${on?'var(--blue)':'var(--wire)'}"/>`}
  return s+`<circle cx="45" cy="45" r="7" fill="var(--fg)"/></g></svg>`;
}
function scenarioPanel(host,w){
  let si=0,pick=null,inp=0,P=null,ang=[0,0],sig='';const ok=new Set();
  const mk=()=>{P=pick?B.createPLC(progFor(pick,4)):null;inp=0;sig=''};
  function draw(){const s=SCEN[si],right=pick&&s.ty.includes(pick);
    host.innerHTML=`<h2>اختر المزمن المناسب <small>أمثلة الكتاب ص 78–79</small></h2><p class="sub">اختر مثالاً، ثم اختر له نوع المزمن، ثم شغّل الجهاز الأول وافصله وشاهد سلوك الجهاز الثاني (T = 4 s). يمكنك تجربة نوع خاطئ لترى لماذا لا يناسب.</p>
     <div class="seg" role="group" style="flex-wrap:wrap;margin-top:8px">${SCEN.map((c,j)=>`<button data-sc="${j}" aria-pressed="${j===si}">${ok.has(j)?'✓ ':''}${c.title}</button>`).join('')}</div>
     <div class="callout">«${s.txt}» <span class="ref">ص ${si===4?'78–79':si<6?78:79}</span></div>
     <div style="margin-top:10px"><span class="sub">نوع المزمن: </span>${segHTML('pk',Object.keys(TT).map(k=>[k,k]),pick)}</div>
     ${pick?`<p class="sub" style="margin-top:8px">${right?'<b style="color:var(--on)">صحيح.</b> هذا ما ذكره الكتاب لهذا المثال.':'<b style="color:var(--stop)">ليس هو النوع الذي ذكره الكتاب.</b> شغّل وافصل وقارن بالوصف.'} الكتاب: <b>${s.ty.join(' أو ')}</b>.</p>
      <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:10px">
       <div style="text-align:center"><div id="dvIn"></div><div><b>${s.inp}</b> <span class="mono">I0.1</span></div>${swHTML('scIn','I0.1','تشغيل / فصل',inp)}</div>
       <div style="font-size:28px;color:var(--muted)">←</div>
       <div style="text-align:center"><div id="dvOut"></div><div><b>${s.out}</b> <span class="mono">Q4.4</span></div><div class="sub" id="scRem">—</div></div>
      </div>`:''}`;
    host.querySelectorAll('[data-sc]').forEach(b=>b.addEventListener('click',()=>{si=+b.dataset.sc;pick=null;mk();draw()}));
    host.querySelectorAll('[data-pk]').forEach(b=>b.addEventListener('click',()=>{pick=b.dataset.pk;if(SCEN[si].ty.includes(pick)){ok.add(si);w.scen=ok.size}mk();draw()}));
    const sw=host.querySelector('#scIn');if(sw)sw.addEventListener('click',()=>{inp=inp?0:1;sw.setAttribute('aria-pressed',inp?'true':'false')});
  }
  draw();
  return {tick(dt){if(!P)return;const s=SCEN[si];P.set('I0.1',inp);P.set('I0.0',0);P.scan(dt);const q=P.get('Q4.4'),tm=P.tim['T'+TT[pick].n]||{};
    const g=JSON.stringify([inp,q]);const a=host.querySelector('#dvIn'),b=host.querySelector('#dvOut');
    if(g!==sig&&a&&b){sig=g;a.innerHTML=devSVG('scRa',inp,s.lamp);b.innerHTML=devSVG('scRb',q,0)}
    ang[0]=(ang[0]+(inp?240:0)*dt)%360;ang[1]=(ang[1]+(q?240:0)*dt)%360;
    const ra=host.querySelector('#scRa'),rb=host.querySelector('#scRb');if(ra)ra.setAttribute('transform',`rotate(${ang[0].toFixed(1)} 45 45)`);if(rb)rb.setAttribute('transform',`rotate(${ang[1].toFixed(1)} 45 45)`);
    const rm=host.querySelector('#scRem');if(rm)rm.textContent=tm.run?('المزمن يعد: '+Math.max(0,tm.tv-tm.el).toFixed(1)+' s'):(q?'يعمل':'متوقف');}};
}

/* ---------- shared tables / circuits ---------- */
const IO_C1=[
 {sym:'F4',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I0.0'},
 {sym:'F5',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I1.0'},
 {sym:'S0',desc:'ضاغط الفصل',addr:'I0.1'},
 {sym:'S1',desc:'ضاغط التشغيل لسرعة بطيئة',addr:'I1.1'},
 {sym:'S2',desc:'ضاغط الفصل لسرعة بطيئة وتشغيل السرعة العالية',addr:'I1.2'},
 {sym:'K1',desc:'الملف المتمم ( K1 ) لتشغيل الدلتا السرعة البطيئة',addr:'Q4.1'},
 {sym:'K2',desc:'الملف المتمم ( K2 ) لتشغيل الدبل النجمة السرعة العالية',addr:'Q4.2'},
 {sym:'K3',desc:'الملف المتمم ( K3 ) متمم قصر الدبل النجمة',addr:'Q4.3'},
 {sym:'S0+F4+F5',desc:'دالة تخزين لضاغط الفصل مع القواطع الحرارية',addr:'M0.0'}
];
const NET_C1=[
 {title:'Network 1 — M0.0 (S0 + F4 + F5)',ref:'ص 64–66',read:'M0.0 = 1 إذا: F4 غير فاصل <b>و</b> F5 غير فاصل <b>و</b> S0 غير مضغوط.',stl:['AN I 0.0','AN I 1.0','AN I 0.1','= M 0.0']},
 {title:'Network 2 — K1 (دلتا، سرعة بطيئة)',ref:'ص 64–66',read:'K1 يعمل إذا: M0.0 <b>و</b> (S1 مضغوط <b>أو</b> K1 شغال) <b>و</b> K2 مفصول <b>و</b> S2 غير مضغوط.',stl:['A M 0.0','A(','O I 1.1','O Q 4.1',')','AN Q 4.2','AN I 1.2','= Q 4.1']},
 {title:'Network 3 — K2 و K3 (دبل نجمة، سرعة عالية)',ref:'ص 64–66',read:'K2 و K3 يعملان معاً إذا: M0.0 <b>و</b> (S2 مضغوط <b>أو</b> K2 شغال) <b>و</b> K1 مفصول.',stl:['A M 0.0','A(','O I 1.2','O Q 4.2',')','AN Q 4.1','= Q 4.2','= Q 4.3']}
];
const NET_C1_FIX=[NET_C1[0],NET_C1[1],
 {title:'Network 3 (مصحح) — K2 و K3 بشرط أن تكون البطيئة قد عملت',ref:'تعديل على ص 66',read:'K2 و K3 يعملان إذا: M0.0 <b>و</b> ((S2 مضغوط <b>و</b> M0.1 = البطيئة عملت) <b>أو</b> K2 شغال) <b>و</b> K1 مفصول.',stl:['A M 0.0','A(','A I 1.2','A M 0.1','O Q 4.2',')','AN Q 4.1','= Q 4.2','= Q 4.3']},
 {title:'Network 4 (إضافة) — M0.1 تذكّر أن السرعة البطيئة عملت',ref:'ليس في الكتاب',read:'إذا عمل K1 تُثبَّت M0.1، وتُلغى عند الإيقاف أو الحماية (M0.0 = 0).',stl:['A Q 4.1','S M 0.1','AN M 0.0','R M 0.1']}
];
const CTRL_C1={top:[{l:'F4',nc:1},{l:'F5',nc:1},{l:'S0',nc:1,btn:1}],branches:[
 {items:[{par:[[{l:'S1',btn:1}],[{l:'K1'}]]},{l:'K2',nc:1},{l:'S2',nc:1,btn:1}],coil:{l:'K1'}},
 {items:[{par:[[{l:'S2',btn:1}],[{l:'K2'}]]},{l:'K1',nc:1}],coil:{l:'K2'}},
 {items:[{par:[[{l:'S2',btn:1}],[{l:'K2'}]]},{l:'K1',nc:1}],coil:{l:'K3'}}]};
const MAP_C1={F4:'btn:F4',F5:'btn:F5',S0:'btn:S0',S1:'btn:S1',S2:'btn:S2',K1:'Q4.1',K2:'Q4.2',K3:'Q4.3'};

const IO_C3=[
 {sym:'F4',desc:'قاطع حماية حراري مغناطيسي لدائرة التحكم',addr:'I1.0'},
 {sym:'S0',desc:'ضاغط الفصل الرئيس',addr:'I0.0'},
 {sym:'S1',desc:'ضاغط التشغيل الرئيس',addr:'I0.1'},
 {sym:'K1',desc:'متمم التشغيل الدلتا ( السرعة البطيئة )',addr:'Q4.1'},
 {sym:'T1',desc:'مزمن ( نوع التشغيل المتأخر الممتد – SS )',addr:'Q4.4'},
 {sym:'KT',desc:'نقاط مساعدة من المزمن مفتوحة أو مغلقة',addr:'Q4.4'},
 {sym:'K3',desc:'متمم القصر الدبل النجمة',addr:'Q4.3'},
 {sym:'K2',desc:'متمم التشغيل للدبل النجمة ( السرعة العالية )',addr:'Q4.2'}
];
const N3_1={title:'Network 1 — K1 (دلتا)',ref:'ص 83–84',read:'K1 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (S1 مضغوط <b>أو</b> K1 شغال) <b>و</b> المزمن T1 لم ينته <b>و</b> K3 مفصول.',
  stl:['AN I 1.0','AN I 0.0','A(','O I 0.1','O Q 4.1',')','AN T 1','AN Q 4.3','= Q 4.1']};
const N3_2=k=>({title:`Network 2 — المزمن T1 (S_ODTS، 10 s)${k==='SD'?' — تجربة SD':''}`,ref:'ص 83–84',read:`T1 يبدأ العد عندما يعمل K1 (S = Q4.1)، وزمنه 10 s، ويُصفَّر (R) إذا فُصل F4 <b>أو</b> ضُغط S0 <b>أو</b> عمل K2.${k==='SD'?' <b>في هذه التجربة استبدلنا SS بـ SD.</b>':''}`,
  stl:['A Q 4.1','L S5T#10S',`${k} T 1`,'A(','O I 1.0','O I 0.0','O Q 4.2',')','R T 1','NOP 0','NOP 0','A T 1']});
const N3_3={title:'Network 3 — K3 (قصر الدبل النجمة)',ref:'ص 83–84',read:'K3 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (T1 انتهى <b>أو</b> K3 شغال) <b>و</b> K1 مفصول.',
  stl:['AN I 1.0','AN I 0.0','A(','O T 1','O Q 4.3',')','AN Q 4.1','= Q 4.3']};
const N3_4={title:'Network 4 — K2 (دبل نجمة، سرعة عالية)',ref:'ص 83–84',read:'K2 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> K3 شغال.',stl:['AN I 1.0','AN I 0.0','A Q 4.3','= Q 4.2']};
const NET_C3_FIX=[N3_1,
 {title:'Network 2 (مصحح) — T1 مثل فرع المزمن في الشكل (21-4)، و KT على Q4.4',ref:'تعديل على ص 84',read:'T1 يعمل إذا: K1 شغال <b>و</b> K2 مفصول (كما في الدائرة السلكية)، ويُصفَّر بـ F4 أو S0، وخرجه يُنقل إلى Q4.4 كما في جدول ص 82.',
  stl:['A Q 4.1','AN Q 4.2','L S5T#10S','SS T 1','A(','O I 1.0','O I 0.0',')','R T 1','A T 1','= Q 4.4']},
 {title:'Network 3 (مصحح) — K3 بدون تعشيق K1 كما في الشكل (21-4)',ref:'تعديل على ص 84',read:'K3 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (T1 انتهى <b>أو</b> K3 شغال).',stl:['AN I 1.0','AN I 0.0','A(','O T 1','O Q 4.3',')','= Q 4.3']},
 N3_4];
const CTRL_C3={top:[{l:'F4',nc:1},{l:'S0',nc:1,btn:1}],branches:[
 {items:[{par:[[{l:'S1',btn:1}],[{l:'K1'}]]},{l:'KT',nc:1,timer:'on'},{l:'K3',nc:1}],coil:{l:'K1'}},
 {items:[{l:'K1'},{l:'K2',nc:1}],coil:{l:'T1',kind:'ton'}},
 {items:[{par:[[{l:'KT',timer:'on'}],[{l:'K3'}]]}],coil:{l:'K3'}},
 {items:[{l:'K3'}],coil:{l:'K2'}}]};
const MAP_C3={F4:'btn:F4',S0:'btn:S0',S1:'btn:S1',K1:'Q4.1',K2:'Q4.2',K3:'Q4.3',KT:'T1'};

B.U3={windDahl,powerDahl,polesSVG,TT,TD,tdSVG,timerBox,progFor,NET_C1,NET_C1_FIX,NET_C3_FIX,N3_1,N3_2,N3_3,N3_4};

/* =================== Lesson 3.1 =================== */
B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'57–61',
 title:'محرك داهلندر: التركيب والتوصيلات (دلتا / دبل نجمة)',
 summary:'كيف يعمل المحرك الحثي الثلاثي الأوجه بسرعتين: توصيلة الدلتا (8 أقطاب، سرعة بطيئة) وتوصيلة الدبل النجمة (4 أقطاب، ضعف السرعة)، والدائرة الرئيسة بالمتممات K1 و K2 و K3.',
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 57',html:`<p><b>الجدارة:</b> استخدام الحاسب الآلي في كتابة برنامج للتحكم في تشغيل محرك الدلتا / الدبل النجمة (دالندر).</p>
   <p><b>الأهداف كما في الكتاب:</b></p><ol><li>تشغيل المحرك الدلتا / الدبل النجمة.</li><li>تشغيل المحرك الدلتا / الدبل النجمة بشرط أن يعمل المحرك الدلتا (سرعة بطيئة).</li><li>المزمنات وأنواعها.</li><li>تشغيل المحرك الدلتا / الدبل النجمة بشرط أن يعمل المحرك الدلتا (سرعة بطيئة)، ثم بعد فترة زمنية محددة يتحول إلى الدبل النجمة (سرعة عالية).</li></ol>
   <p><b>مستوى الأداء:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض (داتا شو)، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> آلات التيار المتردد، وورشة التحكم في الآلات الثلاثية الأوجه.</p>`},
  {h:'فصول الوحدة',ref:'ص 58',html:`<ol><li><b>الفصل الأول:</b> تشغيل محرك الدلتا / الدبل النجمة.</li><li><b>الفصل الثاني:</b> تشغيل المحرك الدلتا / الدبل النجمة بشرط أن يعمل المحرك الدلتا (سرعة بطيئة)، وتسمى هذه الدائرة (داهلندر).</li><li><b>الفصل الثالث:</b> المزمنات وأنواعها.</li><li><b>الفصل الرابع:</b> تشغيل المحرك الدلتا / الدبل النجمة بشرط أن يعمل الدلتا أولاً، ثم بعد فترة محددة يتحول إلى الدبل نجمة (السرعة العالية)، وتسمى هذه الدائرة (داهلندر).</li></ol>`},
  {err:'المقدمة (ص 58) تذكر أربعة فصول، لكن المتن فيه ثلاثة فقط: الفصل الأول ص 59–66 (دائرة واحدة تغطي الفصلين الأول والثاني من الفهرس)، الفصل الثاني ص 67–79 (المزمنات)، الفصل الثالث ص 80–84 (داهلندر بمزمن). كذلك يُكتب اسم المحرك بأشكال مختلفة: «دالندار» (الغلاف)، «دالندر» (ص 57)، «داهلندر» (ص 58 و 80–81). في هذا الكتاب التفاعلي نكتب «داهلندر».'},
  {h:'أهداف الفصل الأول',ref:'ص 59',html:`<ol><li>أن يعرف المتدرب كيف يتم عمل المحرك الدلتا / الدبل نجمة، والهدف من هذا التشغيل.</li><li>رسم الدائرة الرئيسة ودائرة التحكم لتشغيل المحرك الثلاثي الأوجه الدلتا / الدبل نجمة.</li><li>تحويل دائرة التحكم من مخطط مسار التيار إلى دائرة (PLC) بالطرق الثلاثة: المخطط السلّمي (LAD)، البوابات المنطقية (FBD)، قائمة الإجراءات (STL).</li></ol>`},
  {h:'أولاً: ملفات المحرك',ref:'ص 59',html:'<p>«يتكون المحرك الحثي الثلاثي الأوجه من ثلاثة أوجه كل وجه مكون من مجموعة من الملفات كما في الشكل (1-3).» في الرسم كل وجه مقسوم إلى <b>نصفين</b> على التوالي بينهما <b>نقطة وسط</b>: الوجه الأول من U إلى X، والثاني من V إلى Y، والثالث من W إلى Z.</p>'},
  {fig:'(1-3)',ref:'ص 59',caption:'أوجه المحرك الثلاثة، لكل وجه نقطة وسط',draw:()=>box(windDahl('phases',0),300)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> نقطة الوسط هي سر محرك داهلندر: بتغيير طريقة التغذية (من الأطراف أو من نقاط الوسط) يتغير اتجاه التيار في نصف الملفات فيتغير عدد الأقطاب المغناطيسية، وبالتالي السرعة.'},
  {h:'توصيلة الدلتا (السرعة البطيئة)',ref:'ص 60',html:'<p>«وفي حالة توصيل المحرك الدلتا كما في الشكل (2-3)، ويتم توصيل المصدر إلى نقاط الدخل (U1 – V1 – W1) فإن المحرك يعمل سرعة بطيئة.» كل ضلع في المثلث ملفان على التوالي، ونقاط الوسط U2 و V2 و W2 تبقى <b>حرة</b> (غير موصولة).</p>'},
  {fig:'(2-3)',ref:'ص 60',caption:'توصيلة الدلتا: التغذية على U1 و V1 و W1',draw:()=>box(windDahl('delta',0),300)},
  {h:'توصيلة الدبل النجمة (السرعة العالية)',ref:'ص 60',html:'<p>«وعند قصر أطراف التوصيل (U1 – V1 – W1) وتتم التغذية من نقاط الوسط للملفات أي من النقاط (U2 – V2 – W2) فإن المحرك يتحول توصيله من الدلتا إلى الدبل النجمة كما في الشكل (3-3)، ويتحول عدد أقطاب المحرك في هذه الحالة إلى نصف عدد أقطاب توصيلة الدلتا.»</p>'},
  {fig:'(3-3)',ref:'ص 60',caption:'توصيلة الدبل النجمة: U1 و V1 و W1 مقصورة في المركز، والتغذية على U2 و V2 و W2، وكل ذراع ملفان على التوازي',draw:()=>box(windDahl('yy',0),300)},
  {h:'السرعة وعدد الأقطاب',ref:'ص 61',html:'<p>«ومن المعلوم أن السرعة تتناسب عكساً مع عدد الأقطاب. وعلى ذلك عند تحويل التوصيل من الدلتا إلى الدبل النجمة تتحول السرعة من بطيئة إلى سرعة عالية. وتكون ضعف السرعة البطيئة، لأن عدد الأقطاب قل إلى النصف.»</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> السرعة التزامنية <span class="ltr">n = 120 × f ÷ p</span>. على شبكة <span class="ltr">50 Hz</span>: مع <b>8 أقطاب</b> <span class="ltr">n = 750 rpm</span>، ومع <b>4 أقطاب</b> <span class="ltr">n = 1500 rpm</span>. سرعة المحرك الفعلية أقل قليلاً (مثلاً نحو <span class="ltr">710</span> و <span class="ltr">1440 rpm</span>)، وهي الأرقام التوضيحية المستعملة في المحاكاة. الكتابة «M 4/8» على المحرك تعني 4 أو 8 أقطاب.'},
  {widget:(el)=>{let m='delta';const draw=()=>{const d=m==='delta';el.innerHTML=`<div class="fig"><div class="seg" role="group"><button data-m="delta" aria-pressed="${d}">دلتا Δ — بطيئة</button><button data-m="yy" aria-pressed="${!d}">دبل نجمة YY — عالية</button></div>
     <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center;margin-top:8px"><div class="svgbox" style="max-width:280px;margin-inline:auto">${windDahl(m,1)}</div><div>${polesSVG(d?8:4,1)}<p class="sub" style="text-align:center">المجال الدوار (توضيحي): ${d?'8 أقطاب يدور ببطء':'4 أقطاب يدور بضعف السرعة'}</p></div></div>
     <div class="facts"><div class="fact"><span>التغذية على</span><b>${d?'U1 V1 W1':'U2 V2 W2'}</b></div><div class="fact"><span>الأطراف المقصورة</span><b>${d?'—':'U1 V1 W1'}</b></div><div class="fact"><span>عدد الأقطاب</span><b>${d?'8':'4'}</b></div><div class="fact"><span>السرعة (توضيحية)</span><b>${d?'≈ 710 rpm':'≈ 1440 rpm'}</b></div><div class="fact"><span>المتممات</span><b>${d?'K1':'K2 + K3'}</b></div></div></div>`;
     el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw()}},
  {h:'ثانياً: الدائرة الرئيسة',ref:'ص 61',html:`<p>«الشكل (4-3) يوضح الدائرة الرئيسة.» الخطوط L1 و L2 و L3 تمر بالمصاهر F1…3، ثم يتفرع كل خط إلى فرعين:</p>
    <ul><li><b>K1</b>: يوصل L1 و L2 و L3 عبر المرحل الحراري <b>F4</b> إلى <b>U1 و V1 و W1</b>. K1 وحده = <b>دلتا</b> (8 أقطاب، سرعة بطيئة).</li>
    <li><b>K3</b> (متمم القصر): أطرافه العلوية موصولة معاً، والسفلية على مخارج K1؛ فإذا أغلق <b>قصر U1 و V1 و W1</b> معاً.</li>
    <li><b>K2</b>: يوصل L1 و L2 و L3 عبر المرحل الحراري <b>F5</b> إلى <b>U2 و V2 و W2</b>. K2 + K3 = <b>دبل نجمة</b> (4 أقطاب، سرعة عالية).</li></ul>
    <p>المحرك مكتوب عليه <b>M 4/8</b>، وأطرافه U1 و V1 و W1 من جهة، و U2 و V2 و W2 من الجهة الأخرى.</p>`},
  {fig:'(4-3)',ref:'ص 61',caption:'الدائرة الرئيسة لمحرك الدلتا / الدبل النجمة',draw:()=>box(powerDahl(0,0,0),520)},
  {html:`<table class="tt"><thead><tr><th>الحالة</th><th>K1</th><th>K2</th><th>K3</th><th>التغذية</th><th>الأقطاب</th><th>السرعة</th></tr></thead><tbody>
    <tr><td>متوقف</td><td>0</td><td>0</td><td>0</td><td>—</td><td>—</td><td>0</td></tr><tr><td>دلتا</td><td>1</td><td>0</td><td>0</td><td>U1 V1 W1</td><td>8</td><td>بطيئة</td></tr><tr><td>دبل نجمة</td><td>0</td><td>1</td><td>1</td><td>U2 V2 W2</td><td>4</td><td>عالية (الضعف)</td></tr></tbody></table>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لا يجوز أن يعمل K1 مع K3: فـ K3 يقصر مخارج K1 فيحدث <b>قصر بين الخطوط</b> وتنصهر المصاهر. ولا يجوز أن يعمل K1 مع K2 لأن الشبكة تصل إلى طرفي نصف الملف مباشرة. لهذا تحتوي دائرة التحكم في الدرس التالي على <b>تعشيق</b> بين K1 و K2. جرّب ذلك بأمان في المختبر.'}
 ],
 lab:(el)=>{
  let K={K1:0,K2:0,K3:0},blown=0,trip=0,n=0,ang=0,lastSig='',errSeen=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>لوحة المتممات <small>شغّل المتممات يدوياً (بدون دائرة تحكم) وراقب المحرك</small></h2>
    <div class="wrap-in" style="padding:6px 0 0">
     <div class="pbs">${swHTML('k1','K1','دلتا',0)}${swHTML('k2','K2','تغذية U2 V2 W2',0)}${swHTML('k3','K3','قصر U1 V1 W1',0)}</div>
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-pre="d">دلتا (K1)</button><button class="btn" data-pre="y">دبل نجمة (K2 + K3)</button><button class="btn" data-pre="o">إيقاف</button><button class="btn warn" id="fix" hidden>استبدال المصاهر</button></div>
     <div class="reads"><div class="read"><span>الحالة</span><em class="mode-chip" id="chip">متوقف</em></div><div class="read"><span>الأقطاب</span><b id="pol">—</b></div><div class="read"><span>السرعة</span><b id="spd">0 rpm</b></div></div>
    </div><div id="msg"></div></div>
   <div class="panel c7"><h2>الدائرة الرئيسة <small>الشكل (4-3) ص 61</small></h2><p class="sub">الخط البرتقالي = عليه جهد. المتقطع المتحرك = يمر فيه تيار.</p><div class="svgbox" id="pw"></div></div>
   <div class="panel c5"><h2>المحرك <small>السرعات توضيحية</small></h2><div class="motor-row"><div>${W.motor('u3l1rot',150)}<div class="nameplate">M 4/8 · 3~ · 380 v · 50 Hz<br>Δ  8 poles ≈ 710 rpm<br>YY 4 poles ≈ 1440 rpm</div></div><div id="wd"></div></div><h3 class="sm">المجال الدوار وعدد الأقطاب (توضيحي)</h3><div id="pl"></div></div>
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const sync=()=>['K1','K2','K3'].forEach(k=>$('#'+k.toLowerCase()).setAttribute('aria-pressed',K[k]?'true':'false'));
  const check=()=>{if(blown||trip)return;if(K.K1&&K.K3){blown=1;errSeen=1;K={K1:0,K2:0,K3:0};sync()}else if(K.K1&&K.K2){trip=1;errSeen=1;K={K1:0,K2:0,K3:0};sync()}};
  ['K1','K2','K3'].forEach(k=>$('#'+k.toLowerCase()).addEventListener('click',()=>{if(blown)return;trip=0;K[k]=K[k]?0:1;sync();check()}));
  el.querySelectorAll('[data-pre]').forEach(b=>b.addEventListener('click',()=>{if(blown)return;trip=0;const p=b.dataset.pre;K=p==='d'?{K1:1,K2:0,K3:0}:p==='y'?{K1:0,K2:1,K3:1}:{K1:0,K2:0,K3:0};sync()}));
  $('#fix').addEventListener('click',()=>{blown=0;trip=0;K={K1:0,K2:0,K3:0};sync()});
  const mode=()=>dahlMode(K);
  const steps=stepsUI($('#st'),[
   {t:'الوضع الابتدائي',x:'كل المتممات مفصولة. لاحظ أن الجهد واصل حتى مداخل K1 و K2 فقط، والمحرك متوقف.'},
   {t:'السرعة البطيئة',x:'شغّل K1 وحده (أو زر «دلتا»). التغذية تصل إلى U1 و V1 و W1: توصيلة الدلتا.',done:()=>mode()==='delta'},
   {t:'راقب السرعة والأقطاب',x:'انتظر حتى تستقر السرعة عند نحو 710 rpm. المجال فيه 8 أقطاب.',done:()=>mode()==='delta'&&n>650},
   {t:'السرعة العالية',x:'افصل K1، ثم شغّل K2 و K3 (أو زر «دبل نجمة»). K3 يقصر U1 V1 W1، و K2 يغذي U2 V2 W2.',done:()=>mode()==='yy'},
   {t:'قارن السرعتين',x:'انتظر حتى تقترب السرعة من 1440 rpm: الضعف تقريباً، لأن عدد الأقطاب صار 4.',done:()=>mode()==='yy'&&n>1350},
   {t:'جرّب الخطأ (بأمان)',x:'أوقف المحرك ثم شغّل K1 مع K3 معاً (قصر عبر K3)، أو K1 مع K2 معاً.',done:()=>errSeen},
   {t:'أعد الوضع',x:'إذا انصهرت المصاهر اضغط «استبدال المصاهر». تذكّر: في الدرس التالي يمنع التعشيق في دائرة التحكم هذا الخطأ.',done:()=>errSeen&&!blown}
  ],()=>({}));
  sync();
  loopOn(el,dt=>{const m=mode(),tg=m==='delta'?710:m==='yy'?1440:0;n+=(tg-n)*(1-Math.exp(-dt/(tg?1.2:2.2)));if(n<0.5&&!tg)n=0;ang=(ang+n/60*360*dt*0.12)%360;
    const r=$('#u3l1rot');if(r)r.setAttribute('transform',`rotate(${ang.toFixed(1)} 75 75)`);$('#spd').textContent=Math.round(n)+' rpm';
    const sg=JSON.stringify([K,blown,trip]);if(sg!==lastSig){lastSig=sg;
      $('#pw').innerHTML=powerDahl(K.K1,K.K2,K.K3,{blown});$('#wd').innerHTML=`<div class="svgbox" style="margin-top:0;max-width:220px">${windDahl(m==='yy'?'yy':'delta',m!=='off')}</div>`;
      $('#pl').innerHTML=m==='off'?`<p class="sub">لا يوجد مجال دوار والمحرك غير متصل.</p>`:polesSVG(m==='delta'?8:4,1);
      $('#pol').textContent=m==='delta'?'8':m==='yy'?'4':'—';const c=$('#chip');c.textContent=blown?'مصاهر منصهرة':m==='delta'?'دلتا — بطيئة':m==='yy'?'دبل نجمة — عالية':'متوقف';c.className='mode-chip '+(blown?'trip':m==='delta'?'slow':m==='yy'?'fast':'');
      $('#fix').hidden=!blown;
      let msg='';if(blown)msg='<div class="callout err"><b>قصر!</b> K1 مع K3: المتمم K3 قصر مخارج K1 فحدث قصر بين الخطوط وانصهرت المصاهر F1…3. (توضيح، ليس من نص الكتاب)</div>';
      else if(trip)msg='<div class="callout err"><b>خطأ في التوصيل:</b> K1 مع K2 يضع جهد الخط على نصف ملف مباشرة؛ التيار الكبير يفصل المرحل الحراري فتسقط المتممات. (توضيح، ليس من نص الكتاب)</div>';
      else if(K.K2&&!K.K3&&!K.K1)msg='<div class="callout">K2 بدون K3: الأطراف U1 V1 W1 غير مقصورة فلا تتكون الدبل نجمة. شغّل K3 أيضاً.</div>';
      else if(K.K3&&!K.K2&&!K.K1)msg='<div class="callout">K3 وحده يقصر U1 V1 W1 فقط، ولا تصل تغذية للمحرك.</div>';
      $('#msg').innerHTML=msg;}
    steps.check()});
 },
 quiz:[
  {q:'في توصيلة الدلتا لمحرك داهلندر، أين تُوصل التغذية؟',o:['U2 و V2 و W2','U1 و V1 و W1','X و Y و Z','نقطة الوسط فقط'],c:1,e:'ص 60: يتم توصيل المصدر إلى نقاط الدخل U1 – V1 – W1 فيعمل المحرك سرعة بطيئة.'},
  {q:'عند التحويل من الدلتا إلى الدبل النجمة، عدد الأقطاب:',o:['يتضاعف','يبقى كما هو','يصبح النصف','يصبح الربع'],c:2,e:'ص 60: يتحول عدد الأقطاب إلى نصف عدد أقطاب توصيلة الدلتا (من 8 إلى 4).'},
  {q:'حسب الكتاب، العلاقة بين سرعة المحرك وعدد الأقطاب:',o:['طردية','عكسية','لا علاقة','تربيعية'],c:1,e:'ص 61: السرعة تتناسب عكساً مع عدد الأقطاب.'},
  {q:'السرعة في الدبل النجمة مقارنة بالدلتا:',o:['النصف','نفسها','الضعف','ثلاثة أضعاف'],c:2,e:'ص 61: تكون ضعف السرعة البطيئة لأن عدد الأقطاب قل إلى النصف.'},
  {q:'أي متمم يعمل وحده للسرعة البطيئة؟',o:['K1','K2','K3','K2 و K3'],c:0,e:'K1 يوصل الشبكة إلى U1 V1 W1 (دلتا).'},
  {q:'ما وظيفة المتمم K3 في الشكل (4-3)؟',o:['يوصل الشبكة إلى U2 V2 W2','يقصر الأطراف U1 و V1 و W1 معاً','حماية حرارية','عكس اتجاه الدوران'],c:1,e:'K3 متمم القصر: أطرافه العلوية موصولة معاً والسفلية على U1 V1 W1، فيكوّن مركز الدبل نجمة.'},
  {q:'ماذا يعني «M 4/8» المكتوب على المحرك في الشكل (4-3)؟',o:['محرك 4 أو 8 أقطاب','قدرة 4 kW وتيار 8 A','4 أطراف و 8 ملفات','سرعة 4/8 من المقننة'],c:0,e:'المحرك يعمل بـ 8 أقطاب (دلتا) أو 4 أقطاب (دبل نجمة).'},
  {q:'لماذا يجب ألا يعمل K1 و K3 معاً؟',o:['لأن السرعة تقل','لأن K3 يقصر مخارج K1 فيحدث قصر بين الخطوط','لأن المحرك يعكس اتجاهه','لا مشكلة في ذلك'],c:1,e:'توضيح: K3 يربط U1 V1 W1 معاً، فإذا كانت موصولة بالشبكة عبر K1 صار قصراً بين L1 و L2 و L3.'}
 ]
});

/* =================== Lesson 3.2 =================== */
B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'62–66',
 title:'التحكم في محرك داهلندر بسرعتين (S1 بطيئة / S2 عالية) وتحويله إلى LAD و FBD و STL',
 summary:'دائرة التحكم التقليدية لمحرك الدلتا / الدبل النجمة بالضاغطين S1 و S2 مع التعشيق، ثم جدول المداخل والمخارج وتحويل الدائرة إلى ثلاث Networks تستخدم دالة التخزين M0.0.',
 theory:[
  {h:'الدائرة الرئيسة (تذكير)',ref:'ص 61',html:'<p>نفس الدائرة الرئيسة الشكل (4-3): K1 = دلتا (بطيئة)، و K2 + K3 = دبل نجمة (عالية). F4 مرحل حراري لخط K1، و F5 مرحل حراري لخط K2.</p>'},
  {fig:'(4-3)',ref:'ص 61',caption:'الدائرة الرئيسة لمحرك الدلتا / الدبل النجمة',draw:'power'},
  {h:'دائرة التحكم',ref:'ص 62',html:`<p>«الشكل (5-3) يوضح دائرة التحكم.» في أعلاها، على التوالي: تلامس المرحل الحراري <b>F4</b> المغلق، ثم تلامس <b>F5</b> المغلق، ثم ضاغط الفصل <b>S0</b> المغلق. ثم:</p>
    <ul><li><b>فرع K1:</b> [S1 مفتوح ∥ K1 مفتوح (تماسك ذاتي)] ثم <b>K2 مغلق</b> ثم <b>S2 مغلق</b> ثم ملف K1.</li>
    <li><b>فرع K2 و K3:</b> [S2 مفتوح ∥ K2 مفتوح (تماسك ذاتي)] ثم <b>K1 مغلق</b>، ثم يتفرع إلى ملفين على التوازي: K2 و K3.</li></ul>
    <p>للضاغط <b>S2</b> تلامسان: مفتوح في فرع K2 ومغلق في فرع K1، فهو يفصل السرعة البطيئة ويشغّل العالية بضغطة واحدة. وتلامس K2 المغلق في فرع K1، وتلامس K1 المغلق في فرع K2، هما <b>التعشيق</b> الذي يمنع عمل السرعتين معاً.</p>`},
  {fig:'(5-3)',ref:'ص 62',caption:'دائرة التحكم (في الكتاب الملفان K2 و K3 على التوازي بعد نفس التلامسات؛ هنا رُسم فرع K3 بتلامساته مكرراً لأن الرسم الآلي يضع ملفاً واحداً لكل فرع)',draw:'ctrl'},
  {h:'ثالثاً: تحويل دائرة التحكم إلى دائرة PLC — جدول التخصيص',ref:'ص 63',html:'<p>الطرق الثلاثة: أ- المخطط السلّمي (LAD)، ب- البوابات المنطقية (FBD)، ت- قائمة الإجراءات (STL). جدول نقاط الدخل والخرج:</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج والترميز في الـ PLC',ref:'ص 63'},
  {err:'الوصف «القاطع الحراري المغناطيسي لدائرة التحكم» مكرر لـ F4 و F5 في جدول ص 63، بينما هما في الشكل (4-3) مرحلا حماية في الدائرة الرئيسة: F4 لخط K1 و F5 لخط K2.'},
  {note:'<b>ما هي M0.0؟</b> «دالة تخزين لضاغط الفصل مع القواطع الحرارية»: بدل تكرار التلامسات الثلاثة (F4، F5، S0) في كل Network، يحسبها البرنامج مرة واحدة في Network 1 ويحفظ النتيجة في العلامة M0.0، ثم يستعملها في Network 2 و 3 كأنها التلامس المشترك أعلى دائرة التحكم.'},
  {h:'تحويل دائرة التحكم إلى دائرة LAD',ref:'ص 64'},
  {fig:'(6-3)',draw:'lad',caption:'تحويل دائرة التحكم إلى دائرة (LAD)',ref:'ص 64'},
  {h:'تحويل دائرة التحكم إلى دائرة FBD',ref:'ص 65'},
  {fig:'(7-3)',draw:'fbd',caption:'تحويل دائرة التحكم إلى دائرة (FBD)',ref:'ص 65'},
  {h:'تحويل دائرة التحكم إلى دائرة STL',ref:'ص 66'},
  {fig:'(8-3)',draw:'stl',caption:'تحويل دائرة التحكم إلى دائرة (STL) — منقول حرفياً',ref:'ص 66'},
  {note:'في الكتاب وُصّلت مداخل الفصل والحماية (S0 و F4 و F5) بحيث تصل للـ PLC إشارة <b>1</b> عند الضغط أو الفصل، لذلك كُتبت في البرنامج <b>AN</b> (تلامس مغلق). والسطران <span class="ltr">= Q 4.2</span> و <span class="ltr">= Q 4.3</span> بعد نفس المنطق يمثلان الملفين المتوازيين K2 و K3.'},
  {err:'عنوان الفصل في الفهرس (ص 58) يقول «بشرط أن يعمل المحرك الدلتا (سرعة بطيئة)»، لكن هذه الدائرة لا تفرض الشرط: الضغط على <b>S2</b> والمحرك متوقف يشغّل K2 و K3 مباشرة على السرعة العالية. في المختبر وتبويب البرنامج يوجد مبدّل «كما في الكتاب / المصحح»؛ النسخة المصححة <b>اقتراح منا</b> (ليست من الكتاب) تضيف علامة M0.1 تتذكر أن السرعة البطيئة عملت، ولا تسمح لـ S2 بالتشغيل إلا بعدها.'}
 ],
 io:IO_C1,
 inputs:[
  {id:'S0',addr:'I0.1',type:'push',color:'red',label:'إيقاف'},
  {id:'S1',addr:'I1.1',type:'push',color:'green',label:'سرعة بطيئة'},
  {id:'S2',addr:'I1.2',type:'push',color:'black',label:'سرعة عالية'},
  {id:'F4',addr:'I0.0',type:'fault',label:'فصل F4',resetLabel:'إعادة ضبط F4'},
  {id:'F5',addr:'I1.0',type:'fault',label:'فصل F5',resetLabel:'إعادة ضبط F5'}
 ],
 variants:{default:'book',note:'الكتاب يسمح بتشغيل السرعة العالية مباشرة بـ S2 رغم أن عنوان الفصل يشترط الدلتا أولاً.',
  book:{label:'كما في الكتاب',program:NET_C1,note:'البرنامج كما في الأشكال (6-3) و (7-3) و (8-3) ص 64–66: الضغط على S2 والمحرك متوقف يشغّل السرعة العالية مباشرة.'},
  fixed:{label:'المصحح',program:NET_C1_FIX,note:'اقتراح (ليس من الكتاب): Network 4 تثبّت M0.1 عندما يعمل K1 وتلغيها عند الإيقاف، و Network 3 لا تقبل S2 إلا إذا كانت M0.1 = 1. الدائرة السلكية في المختبر تبقى كما في الكتاب.'}},
 power:(st)=>powerDahl(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3')),powerRef:'الشكل (4-3) ص 61',
 ctrl:CTRL_C1,ctrlMap:MAP_C1,ctrlRef:'الشكل (5-3) ص 62 (فرع K3 مكرر للرسم)',
 plant:dahlPlant(st=>({K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),K3:st.Q('Q4.3')})),
 plcNote:'S0 و F4 و F5 تعطي 1 عند الضغط أو الفصل (اصطلاح الكتاب)، لذلك برمجت AN. لاحظ M0.0 في جدول المداخل والمخارج.',
 steps:[
  {t:'الوضع الابتدائي',x:'المحرك متوقف. M0.0 = 1 لأن F4 و F5 سليمان و S0 غير مضغوط (راجع تبويب البرنامج).'},
  {t:'السرعة البطيئة',x:'اضغط S1. يعمل K1 ويتماسك ذاتياً: دلتا، 8 أقطاب.',done:s=>s.Q('Q4.1')&&!s.btn('S1')},
  {t:'راقب السرعة',x:'انتظر حتى تقترب السرعة من 710 rpm.',done:s=>s.Q('Q4.1')&&s.plant.n>650},
  {t:'انتقل إلى السرعة العالية',x:'اضغط S2. تلامسه المغلق يفصل K1، ثم يعمل K2 و K3 معاً (التعشيق AN Q 4.1 يتحقق بعد سقوط K1).',done:s=>s.Q('Q4.2')&&s.Q('Q4.3')&&!s.Q('Q4.1')},
  {t:'جرّب الرجوع بـ S1',x:'اضغط S1 والمحرك على العالية: لن يحدث شيء، لأن فرع K1 فيه تلامس K2 المغلق (AN Q 4.2).'},
  {t:'أوقف المحرك',x:'اضغط S0: يصبح M0.0 = 0 فتسقط كل المتممات.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.Q('Q4.3')&&!s.btn('S0')},
  {t:'خطأ الكتاب: S2 من التوقف',x:'والمحرك متوقف اضغط S2. في نسخة «كما في الكتاب» تعمل السرعة العالية مباشرة دون المرور بالدلتا. بدّل إلى «المصحح» وأوقف ثم كرر: لن تعمل العالية إلا بعد البطيئة.'},
  {t:'الحماية الحرارية',x:'شغّل المحرك ثم اضغط «فصل F5» (أو F4): M0.0 = 0 فيتوقف كل شيء، ولا يعود إلا بإعادة الضبط ثم S1.',done:s=>s.btn('F5')||s.btn('F4')}
 ],
 quiz:[
  {q:'ما وظيفة العلامة M0.0 في Network 1؟',o:['تخزين حالة S0 و F4 و F5 معاً','تشغيل K1 مباشرة','عدّاد لعدد التشغيلات','مزمن للتحويل'],c:0,e:'جدول ص 63: M0.0 دالة تخزين لضاغط الفصل مع القواطع الحرارية، وتُستعمل في Network 2 و 3.'},
  {q:'لماذا كُتب الضاغط S0 (I0.1) بالأمر AN؟',o:['لأنه ضاغط تشغيل','لأن الضغط عليه يعطي 1 في اصطلاح الكتاب، فيجب أن يكون 0 ليعمل المحرك','لأن AN تعني أو','خطأ مطبعي'],c:1,e:'الضغط على S0 أو فصل F4/F5 يجعل المدخل = 1 فيُلغى M0.0.'},
  {q:'المحرك يعمل بطيئاً، ضغطت S2. ماذا يحدث؟',o:['يعمل K1 و K2 معاً','يفصل K1 ثم يعمل K2 و K3','لا شيء','يتوقف المحرك نهائياً'],c:1,e:'AN I 1.2 في Network 2 تفصل K1، ثم في Network 3 يتحقق S2 و AN Q 4.1 فيعمل K2 و K3.'},
  {q:'ما فائدة AN Q 4.1 في Network 3؟',o:['تماسك ذاتي','تعشيق يمنع تشغيل العالية أثناء عمل K1','حماية حرارية','تسريع المحرك'],c:1,e:'لا يعمل K2 و K3 إلا إذا كان K1 مفصولاً.'},
  {q:'لماذا يتبع المنطقَ نفسه في Network 3 سطران = Q 4.2 و = Q 4.3؟',o:['لأن الدبل نجمة تحتاج تغذية U2 V2 W2 وقصر U1 V1 W1 في الوقت نفسه','لأنهما عنوان واحد','للتماسك الذاتي','خطأ في الكتاب'],c:0,e:'في الشكل (5-3) ملفا K2 و K3 على التوازي.'},
  {q:'في برنامج الكتاب، المحرك متوقف وضغطت S2:',o:['لا يعمل شيء','يعمل على السرعة العالية مباشرة','يعمل بطيئاً ثم سريعاً','يفصل F5'],c:1,e:'الدائرة لا تفرض شرط «الدلتا أولاً» الوارد في عنوان الفصل؛ هذا ما تصححه النسخة «المصحح».'},
  {q:'ما عنوان الضاغط S2 حسب جدول ص 63؟',o:['I1.1','I0.1','I1.2','Q4.2'],c:2,e:'S0 = I0.1، و S1 = I1.1، و S2 = I1.2.'},
  {q:'فُصل المرحل الحراري F5 (I1.0 = 1) والمحرك على السرعة العالية:',o:['يستمر المحرك','M0.0 = 0 فتسقط كل المتممات','يعود إلى السرعة البطيئة','يفصل K3 فقط'],c:1,e:'AN I 1.0 في Network 1 تجعل M0.0 = 0، و M0.0 موجودة في Network 2 و 3.'}
 ]
});

/* =================== Lesson 3.3 =================== */
const TIO=[{sym:'S (Start)',desc:'مدخل التشغيل للمزمن',addr:'I0.1'},{sym:'R (Reset)',desc:'مدخل الفصل (إعادة الوضع)',addr:'I0.0'},{sym:'Q',desc:'خرج المزمن إلى بقية الدائرة',addr:'Q4.4'}];
B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'67–71',
 title:'المزمنات: المداخل والمخارج، والمزمن النبضي SP والنبضي الممتد SE',
 summary:'أنواع المزمنات الخمسة، ومداخل المزمن (S و TV و R) وخرجه Q، ثم طريقة عمل المزمن النبضي SP والمزمن النبضي الممتد SE بمخططيهما الزمنيين.',
 theory:[
  {h:'أهداف الفصل الثاني',ref:'ص 67',html:'<ol><li>أن يتعرف المتدرب على أنواع المزمنات.</li><li>أن يتعرف المتدرب على طريقة عمل كل نوع.</li><li>أن يعطي المتدرب أمثلة على استخدام كل نوع.</li></ol><p>«إن من أهم عمليات التحكم هو التحكم التتابعي. وعلى ذلك يتم استخدام عناصر تتحكم بالزمن من أجل إجراء عمليات التتابع، أو التشغيل، أو الفصل عند زمن محدد. ولذلك تم تزويد برامج التحكم بالمزمنات.»</p>'},
  {h:'أولاً: أنواع المزمنات',ref:'ص 67',html:`<p>«هناك خمسة أنواع من المزمنات وسوف نستعرض الأنواع الخمسة حسب وظيفة عملها وهي على النحو التالي:»</p>
    <table class="tt"><thead><tr><th>#</th><th>النوع</th><th>بالإنجليزية</th><th>الرمز</th></tr></thead><tbody>
    <tr><td>1</td><td>المزمن النبضي</td><td class="mono">Pulse Timer</td><td class="mono">SP</td></tr><tr><td>2</td><td>المزمن النبضي الممتد</td><td class="mono">Extended Pulse Timer</td><td class="mono">SE</td></tr>
    <tr><td>3</td><td>مزمن التشغيل المتأخر</td><td class="mono">On Delay Timer</td><td class="mono">SD</td></tr><tr><td>4</td><td>مزمن التشغيل المتأخر الممتد (المخزن)</td><td class="mono">"Retentive" On Delay Timer</td><td class="mono">SS</td></tr>
    <tr><td>5</td><td>مزمن الفصل المتأخر</td><td class="mono">Off Delay Timer</td><td class="mono">SF</td></tr></tbody></table>`},
  {err:'النوع الرابع يُسمى «مزمن التشغيل المتأخر الممتد» في القائمة ص 67 (وفي جدول ص 82)، و«مزمن التشغيل المتأخر المخزن» في عنوانه ص 74. الاسمان لنفس المزمن SS.'},
  {h:'ملاحظات على المزمنات',ref:'ص 68',html:`<ol><li>جميع أنواع المزمنات لها <b>ثلاثة مداخل، وخرج</b>:
     <ul><li>أ- يجب أن يأخذ كل مزمن رمز <b>T</b> ومعها رقم يحدد رقم المزمن (T1، T2، …).</li>
     <li>ب- <b>مدخل التشغيل S</b> (Start – البدء): الطرف الذي يجرى عليه التشغيل من أجل التحكم في التشغيل.</li>
     <li>ت- <b>مدخل الفصل R</b> (Reset – إعادة الوضع، أي الفصل): الطرف الذي يجرى عليه التشغيل من أجل التحكم في الفصل.</li>
     <li>ث- <b>مدخل TV</b> (Time Value – قيمة الوقت): يحدد عليه الزمن المراد التحكم فيه.</li>
     <li>ج- <b>الخرج Q</b>: يتم توصيله إلى بقية دائرة التحكم المراد التحكم فيها.</li></ul></li>
     <li>في أي عملية تشغيل على مدخل التشغيل يجب أن تصل إشارة كهربائية يمتد زمنها على حسب نوع المزمن المستخدم.</li>
     <li>في أي لحظة تصل إشارة كهربائية إلى مدخل الفصل فإن المزمن سوف يفصل ويتوقف عن العمل مباشرة.</li></ol>
     <p>«والشكل (9-3) يمثل أطراف الدخل والخرج للمزمنات الخمسة.»</p>`},
  {fig:'(9-3)',ref:'ص 68',caption:'أطراف الدخل والخرج للمزمن: T1 من نوع S_PULSE، S ← I0.1، TV ← S5T#5M6S، R ← I0.0، Q → Q4.4، و BI و BCD غير موصولين',draw:()=>box(timerBox({type:'SP'}),560)},
  {draw:'io',caption:'المداخل والخرج كما في أشكال المزمنات (9-3) إلى (18-4) — الكتاب لا يعطي جدولاً منفصلاً لها',ref:'ص 68'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> <span class="ltr">S5T#</span> صيغة كتابة الزمن في الـ PLC: <span class="ltr">H</span> ساعات، <span class="ltr">M</span> دقائق، <span class="ltr">S</span> ثوان، <span class="ltr">MS</span> أجزاء الثانية. فـ <span class="ltr">S5T#5M6S</span> = 5 دقائق و 6 ثوانٍ، و <span class="ltr">S5T#2H10S</span> = ساعتان و 10 ثوانٍ. أقصى قيمة <span class="ltr">S5T#2H46M30S</span>. المخرج <b>BI</b> يعطي الزمن المتبقي رقماً ثنائياً، و <b>BCD</b> يعطيه بصيغة BCD. في المختبر نستعمل ثوانيَ قليلة لنرى النتيجة بسرعة.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الصندوق في الشكل (9-3) يكافئ بلغة STL: <span class="ltr mono">A I0.1 · L S5T#5M6S · SP T1 · A I0.0 · R T1 · A T1 · = Q4.4</span>.'},
  {h:'1- المزمن النبضي (Pulse Timer)',ref:'ص 69',html:'<p>أ- الرمز: يرمز له بالرمز <b>SP</b> والشكل (10-3).</p>'},
  {fig:'(10-3)',ref:'ص 69',caption:'رمز المزمن النبضي SP (الصندوق S_PULSE)',draw:()=>box(timerBox({type:'SP'}),560)},
  {html:'<p>ب- الشكل (11-3) يوضح شكل موجات الدخل والخرج والفصل. المراحل: A من 1 إلى 3، و B من 3 إلى 5، و C من 5 إلى 9.</p>'},
  {fig:'(11-3)',ref:'ص 69',caption:'موجات الدخل (Start) والفصل (Reset) والخرج (Q) للمزمن النبضي SP',draw:()=>box(timerTD('SP'),680)},
  {html:`<ul><li><b>النقطة 1 (بداية A):</b> «بعد تشغيل المفتاح (Start) للمزمن يكون هناك خرج (Q) ويستمر الخرج (Q) بمقدار الفترة الزمنية المحددة (T)… ويستمر الخرج حتى النقطة (2) بالرغم من أن الدخل (Start) ما زال موصلاً.»</li>
    <li><b>النقطة 3 (بداية B):</b> «بدأنا بتشغيل الدخل (Start) ولكن قبل انقضاء الفترة الزمنية (T) قمنا بفصل المفتاح (Start) نجد أن الخرج (Q) أصبح صفراً.»</li>
    <li><b>النقطة 5 (بداية C):</b> «قبل انقضاء الفترة الزمنية (T) قمنا بتوصيل دخل الفصل (Reset) نجد أن الخرج (Q) أصبح صفراً مع العلم أن الدخل (Start) لم يزل موصلاً.»</li>
    <li><b>النقطة 8:</b> «دخل الفصل (Reset) قد فصل والدخل (Start) لم يزل موصلاً ولكن الخرج يستمر في حالة فصل. حيث إنه لإجراء التشغيل لابد أن يتحول الدخل (Start) من صفر إلى واحد.» ثم عند النقطة <b>9</b> بداية مرحلة تشغيل جديدة مثل المرحلة A.</li></ul>
    <p>«وبهذه الطريقة يتضح عمل المزمن النبضي. ويختصر بالرمز (SP).»</p>`},
  {note:'<b>توضيح للمتدرب:</b> النقاط 6 و 7 و 10 غير مشروحة في نص الكتاب: 6 = بداية Reset، و 7 = عودة Start بعد انقطاع قصير (أثناء Reset فلا أثر لها)، و 10 = نهاية T في المرحلة الجديدة. <b>الخلاصة:</b> في SP زمن الخرج <b>مرتبط</b> بزمن الدخل: أقصاه T، وينقطع إذا انقطع Start.'},
  {h:'2- المزمن النبضي الممتد (Extended Pulse Timer)',ref:'ص 70',html:'<p>أ- الرمز: يرمز له بالرمز <b>SE</b> والشكل (12-3).</p>'},
  {fig:'(12-3)',ref:'ص 70',caption:'رمز المزمن النبضي الممتد SE: T2 من نوع S_PEXT، TV = S5T#2H10S',draw:()=>box(timerBox({type:'SE'}),560)},
  {html:'<p>ب- الشكل (13-3) يوضح شكل موجات الدخل والخرج والفصل. المراحل: A (1→3)، B (3→6)، C (6→9)، D (9→11).</p>'},
  {err:'العنوان في ص 70 يقول «الشكل (13-4)» بينما التسمية تحت الشكل (13-3). وابتداءً من هذا الموضع يتحول ترقيم الأشكال من «-3» إلى «-4» رغم أنها كلها في الوحدة الثالثة: (16-4)، (17-4)، (18-4)، (19-4)، (20-4)، (21-4). نكتب الأرقام كما طُبعت تحت الأشكال.'},
  {fig:'(13-3)',ref:'ص 70',caption:'موجات الدخل والخرج والفصل للمزمن النبضي الممتد SE',draw:()=>box(timerTD('SE'),680)},
  {html:`<ul><li><b>النقطة 1 (A):</b> «بعد تشغيل الدخل (Start) نجد أن هناك خرجاً (Q) ويستمر هذا الخرج بمقدار الفترة الزمنية المحددة (T)… ثم يفصل الخرج، مع أن الدخل مستمر في التوصيل.»</li>
    <li><b>النقطة 3 (B):</b> «بدأنا بتشغيل الدخل (Start) ولفترة زمنية صغيرة وهي أصغر من زمن الخرج ثم فُصل عند النقطة (4) ولكن الخرج يستمر في العمل إلى أن تنتهي الفترة الزمنية المحددة للمزمن ثم يفصل الخرج عند النقطة (5).»</li>
    <li><b>النقطة 6 (C):</b> «بدأنا بتشغيل الدخل (Start)… لفترة زمنية أصغر من زمن الخرج ثم تم الفصل، ثم أعيد التشغيل… نلاحظ أن الخرج بدأ عد الزمن من جديد ويستمر حتى تنتهي الفترة الزمنية المحددة ثم يفصل عند النقطة (8).»</li>
    <li><b>النقطة 9 (D):</b> «بدأنا بتشغيل الدخل (Start)… ثم تم تشغيل الفصل (Reset) عند النقطة (10) فنلاحظ أن الخرج يفصل عند نفس النقطة، مع العلم أن الفترة الزمنية المحددة لم تنته. ثم تم توصيل مفتاح الدخل (Start) مع استمرارية مفتاح الفصل (Reset) بالتشغيل لكن الخرج يستمر مفصولاً.»</li></ul>
    <p>«نلاحظ أن زمن الخرج <b>غير مرتبط</b> بزمن الدخل، أي بمجرد إعطاء نبضة تشغيل لفترة زمنية صغيرة فإن الخرج يستمر بالعمل إلى أن تنتهي الفترة الزمنية المحددة لعمل المزمن.»</p>`},
  {err:'نص ص 71 يقول «ثم أعيد التشغيل عند النقطة (8)»، بينما في الشكل (13-3) إعادة التشغيل (النبضة الثانية) عند النقطة <b>7</b>، والنقطة 8 هي نهاية الخرج. الصحيح «عند النقطة (7)». (خطأ في النص فقط، لا يغيّر عمل المزمن.)'},
  {note:'جرّب النوعين في تبويب «المختبر»: زر «تسلسل الكتاب» يعيد الشكلين (11-3) و (13-3) على المخطط الحي بزمن T = 2 s.'}
 ],
 io:TIO,
 lab:(el)=>timerBench(el,{def:'SP',steps:[
  {t:'اختر SP',x:'من «نوع المزمن» اختر SP (المزمن النبضي T1). الزمن TV = 3 s مناسب للبداية.',done:w=>w.type==='SP'},
  {t:'المرحلة A — Start أطول من T',x:'شغّل مفتاح «Start ثابت» (أو اضغط Start مطوّلاً) أكثر من T. Q ينطفئ بعد T رغم أن Start ما زال موصلاً (من 1 إلى 2).',done:w=>w.pulses.some(p=>p.type==='SP'&&p.endS&&!p.endR&&p.dur>=p.tv-0.15)},
  {t:'المرحلة B — فصل Start قبل T',x:'افصل المفتاح، ثم اضغط Start ضغطة قصيرة (أقل من T). Q ينقطع مع رفع إصبعك (من 3 إلى 4).',done:w=>w.pulses.some(p=>p.type==='SP'&&!p.endS&&!p.endR&&p.dur<p.tv-0.15)},
  {t:'المرحلة C — Reset قبل T',x:'شغّل «Start ثابت» ثم اضغط Reset قبل انتهاء T: Q يفصل فوراً (5 إلى 6). بعد رفع Reset يبقى Q مفصولاً لأن Start لم يتحول من 0 إلى 1 (النقطة 8).',done:w=>w.pulses.some(p=>p.type==='SP'&&p.endR&&p.endS)},
  {t:'تسلسل الكتاب (11-3)',x:'اضغط «تسلسل الكتاب» وقارن المخطط الحي بالشكل (11-3) في الشرح.',done:w=>w.played.SP},
  {t:'SE — نبضة قصيرة',x:'اختر SE واضغط Start ضغطة قصيرة: يبقى Q مدة T كاملة (3 إلى 5 في الشكل 13-3).',done:w=>w.pulses.some(p=>p.type==='SE'&&p.sRel&&!p.endR&&p.dur>=p.tv-0.15)},
  {t:'SE — إعادة التشغيل أثناء الخرج',x:'أثناء عمل Q أعط Start نبضة ثانية: يبدأ العد من جديد فيطول الخرج (6 إلى 8).',done:w=>w.pulses.some(p=>p.type==='SE'&&p.retrig)},
  {t:'SE — Reset',x:'أعط Start نبضة، ثم اضغط Reset قبل انتهاء T: يفصل Q فوراً (النقطة 10).',done:w=>w.pulses.some(p=>p.type==='SE'&&p.endR)},
  {t:'تسلسل الكتاب (13-3)',x:'والنوع SE مختار، اضغط «تسلسل الكتاب».',done:w=>w.played.SE}
 ]}),
 quiz:[
  {q:'حسب الكتاب، كم مدخلاً وخرجاً لكل مزمن؟',o:['مدخل واحد وخرجان','ثلاثة مداخل وخرج','مدخلان وخرج','أربعة مداخل وخرج'],c:1,e:'ص 68: S (تشغيل) و R (فصل) و TV (قيمة الزمن)، والخرج Q.'},
  {q:'ماذا يعني المدخل TV؟',o:['Time Value – قيمة الوقت','Timer Voltage','Total Value','Test Value'],c:0,e:'ص 68: يحدد عليه الزمن المراد التحكم فيه.'},
  {q:'المزمن SP: بقي Start موصلاً أطول من T. الخرج Q:',o:['يبقى ما دام Start موصلاً','ينتهي بعد T رغم بقاء Start','لا يعمل أبداً','يعمل بعد T'],c:1,e:'المرحلة A في الشكل (11-3): Q من 1 إلى 2 فقط.'},
  {q:'المزمن SP: فُصل Start قبل انتهاء T. الخرج Q:',o:['يكمل حتى T','يصبح صفراً فوراً','يعمل بعد T','يبقى حتى Reset'],c:1,e:'المرحلة B: زمن الخرج في SP مرتبط بزمن الدخل.'},
  {q:'المزمن SP: زال Reset و Start ما زال موصلاً (النقطة 8). الخرج:',o:['يعود فوراً','يبقى مفصولاً حتى يتحول Start من 0 إلى 1','يعمل بعد T','يعمل نصف T'],c:1,e:'ص 70: لإجراء التشغيل لابد أن يتحول الدخل Start من صفر إلى واحد.'},
  {q:'المزمن SE: أعطيت Start نبضة قصيرة. الخرج:',o:['ينقطع مع النبضة','يستمر مدة T كاملة','لا يعمل','يبقى حتى Reset'],c:1,e:'ص 71: زمن الخرج في SE غير مرتبط بزمن الدخل.'},
  {q:'المزمن SE: أعيد تشغيل Start أثناء عمل الخرج:',o:['يبدأ عد الزمن من جديد','يفصل الخرج','لا تأثير','يتضاعف TV'],c:0,e:'المرحلة C في الشكل (13-3).'},
  {q:'ماذا تعني القيمة S5T#5M6S في الشكل (9-3)؟',o:['5 ساعات و 6 دقائق','5 دقائق و 6 ثوانٍ','56 ثانية','5.6 ثانية'],c:1,e:'M = دقائق، S = ثوانٍ.'}
 ]
});

/* =================== Lesson 3.4 =================== */
B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'72–75',
 title:'مزمن التشغيل المتأخر SD ومزمن التشغيل المتأخر المخزن SS',
 summary:'المزمن SD يشغّل الخرج بعد زمن T بشرط بقاء Start ويفصله مع Start، والمزمن SS يكفيه نبضة ويبقى خرجه حتى Reset، مع مخططيهما الزمنيين.',
 theory:[
  {h:'3- مزمن التشغيل المتأخر (On Delay Timer)',ref:'ص 72',html:'<p>أ- الرمز: يرمز له بالرمز <b>SD</b> والشكل (14-3).</p>'},
  {fig:'(14-3)',ref:'ص 72',caption:'رمز مزمن التشغيل المتأخر SD: T3 من نوع S_ODT، TV = S5T#2H30S',draw:()=>box(timerBox({type:'SD'}),560)},
  {html:'<p>ب- الشكل (15-3) يوضح شكل موجات الدخل والخرج والفصل. المراحل: A (1→3)، B (3→11)، C (11→13).</p>'},
  {fig:'(15-3)',ref:'ص 72',caption:'موجات الدخل والخرج والفصل لمزمن التشغيل المتأخر SD',draw:()=>box(timerTD('SD'),680)},
  {html:`<ul><li><b>النقطة 1 (A):</b> «بعد تشغيل الدخل (Start) نجد أن الخرج (Q) يبدأ يعد الفترة الزمنية المحددة (T)… ثم بعد ذلك يتحول من وضع فصل (Off) إلى وضع تشغيل (On) في الفترة الزمنية المحددة ويستمر هذا الخرج حتى يفصل الدخل عند النقطة (3).»</li>
    <li><b>النقطة 4 (B):</b> «بدأنا بتشغيل الدخل (Start) ولفترة زمنية صغيرة وهي أصغر من الزمن المحدد لتوصيل الخرج ثم فُصل عند النقطة (5) ولكن الخرج يستمر في الفصل. ثم أعيد التوصيل عند النقطة (6) لفترة زمنية طويلة حتى النقطة (10) فنلاحظ أن الخرج يبدأ في عد زمن التأخير ثم يتحول إلى وضع توصيل. وعند النقطة (8) تم تشغيل مفتاح الفصل (Reset) فتحول الخرج مباشرة إلى وضع فصل، مع العلم أن الدخل لم يزل في حالة توصيل حتى النقطة (10).»</li>
    <li><b>النقطة 11 (C):</b> «نلاحظ أن المزمن بدأ في عد الزمن من أجل التحويل إلى وضع التوصيل ولكن قبل انتهاء الزمن تم تشغيل مفتاح الفصل (Reset) عند النقطة (12) ولفترة قصيرة، فنجد أن الخرج يستمر في حالة فصل مع العلم أن الدخل لم يزل في حالة توصيل.»</li></ul>`},
  {note:'<b>توضيح للمتدرب:</b> SD هو «التأخير عند التشغيل»: يحتاج أن يبقى Start موصلاً طوال T، والخرج يتبع Start في الفصل. وهو نفس فكرة المؤقت الذي يحوّل النجمة إلى دلتا في دوائر التحكم التقليدية.'},
  {h:'4- مزمن التشغيل المتأخر المخزن ("Retentive" On Delay Timer)',ref:'ص 74',html:'<p>أ- يرمز له بالرمز <b>SS</b> والشكل (16-4).</p>'},
  {err:'العنوان في ص 74 يذكر «الشكل (16-3)» بينما التسمية تحت الشكل (16-4)، ثم (17-4) للمخطط الزمني. كتبنا الأرقام كما تحت الأشكال.'},
  {fig:'(16-4)',ref:'ص 74',caption:'رمز مزمن التشغيل المتأخر المخزن SS: T4 من نوع S_ODTS، TV = S5T#15M40S',draw:()=>box(timerBox({type:'SS'}),560)},
  {html:'<p>ب- الشكل (17-4) يوضح شكل موجات الدخل والخرج والفصل. المراحل: A (1→2)، B (4→6)، C (7→9).</p>'},
  {fig:'(17-4)',ref:'ص 74',caption:'موجات الدخل والخرج والفصل لمزمن التشغيل المتأخر المخزن SS',draw:()=>box(timerTD('SS'),680)},
  {html:`<ul><li><b>النقطة 1 (A):</b> «الخرج (Q) يبدأ يعد الفترة الزمنية المحددة (T)… ثم يتحول من وضع فصل (Off) إلى وضع تشغيل (On) ويستمر هذا الخرج في التوصيل حتى يتم تشغيل الفصل (Reset) عند النقطة (2). مع العلم أن الدخل مستمر في التوصيل حتى النقطة (3).»</li>
    <li><b>النقطة 4 (B):</b> «بدأنا في تشغيل الدخل (Start) ولفترة زمنية صغيرة وهي أصغر من الزمن المحدد لتوصيل الخرج ثم فُصل عند النقطة (5) ولكن الخرج يستمر في عد الفترة الزمنية المحددة ثم يتحول إلى وضع التوصيل (On) حتى يتم تشغيل الفصل (Reset) عند النقطة (6).»</li>
    <li><b>النقطة 7 (C):</b> «بدأنا بتشغيل الدخل (Start)… لفترة زمنية صغيرة، ثم فُصل، ثم أُعيد التشغيل مرة ثانية، ثم مرة ثالثة فنجد أن الخرج بدأ بعد الفترة الزمنية من النقطة (8) ثم بعد الفترة الزمنية المحددة (T) توصل الخرج إلى وضع توصيل (On) ويستمر في التوصيل حتى يتم تشغيل الفصل (Reset) عند النقطة (9).»</li></ul>
    <p>«إذاً… إذا تكرر التشغيل والفصل عدة مرات، بحيث يكون الفصل والتوصيل خلال الفترة الزمنية المحددة وقبل أن يتحول إلى وضع توصيل فإن الخرج يبدأ بالعد منذ <b>آخر عملية توصيل</b>.»</p>`},
  {html:'<table class="tt"><thead><tr><th>السؤال</th><th>SD</th><th>SS</th></tr></thead><tbody><tr><td>هل يكفي Start نبضة قصيرة؟</td><td>لا، يجب أن يبقى طوال T</td><td>نعم</td></tr><tr><td>متى يعمل Q؟</td><td>بعد T من بداية Start</td><td>بعد T من آخر توصيل لـ Start</td></tr><tr><td>متى يفصل Q؟</td><td>مع فصل Start أو Reset</td><td>مع Reset فقط</td></tr><tr><td>اسم الصندوق</td><td class="mono">S_ODT</td><td class="mono">S_ODTS</td></tr></tbody></table>'},
  {note:'جرّب النوعين في تبويب «المختبر»، وزر «تسلسل الكتاب» يعيد الشكلين (15-3) و (17-4).'}
 ],
 io:TIO,
 lab:(el)=>timerBench(el,{def:'SD',steps:[
  {t:'اختر SD',x:'من «نوع المزمن» اختر SD (T3).',done:w=>w.type==='SD'},
  {t:'المرحلة A — Start أطول من T',x:'شغّل «Start ثابت» وانتظر: Q يعمل بعد T. ثم افصل المفتاح: Q يفصل معه (النقطة 3).',done:w=>w.pulses.some(p=>p.type==='SD'&&!p.endS&&!p.endR)},
  {t:'Start أقصر من T',x:'اضغط Start ضغطة قصيرة (أقل من T): لا يظهر خرج (من 4 إلى 5).',done:w=>w.spulses.some(p=>p.type==='SD'&&p.dur<p.tv-0.2&&!p.hadQ)},
  {t:'Reset أثناء الخرج',x:'شغّل «Start ثابت»، وبعد أن يعمل Q اضغط Reset: يفصل Q رغم بقاء Start (النقطة 8)، ولا يعود حتى يُفصل Start ويُعاد.',done:w=>w.pulses.some(p=>p.type==='SD'&&p.endR&&p.endS)},
  {t:'تسلسل الكتاب (15-3)',x:'افصل المفتاح، ثم اضغط «تسلسل الكتاب».',done:w=>w.played.SD},
  {t:'SS — نبضة واحدة تكفي',x:'اختر SS واضغط Start ضغطة قصيرة: بعد T يعمل Q رغم أن Start مفصول (المرحلة B).',done:w=>w.type==='SS'&&w.flags.ssNoS},
  {t:'SS — الفصل بـ Reset فقط',x:'Q يبقى يعمل. اضغط Reset ليفصل (النقطة 6).',done:w=>w.pulses.some(p=>p.type==='SS'&&p.endR)},
  {t:'SS — نبضات متكررة',x:'أعط Start نبضة، ثم نبضة ثانية قبل انتهاء T: العد يبدأ من آخر نبضة (المرحلة C).',done:w=>w.flags.ssRetrig},
  {t:'تسلسل الكتاب (17-4)',x:'والنوع SS مختار، اضغط «تسلسل الكتاب».',done:w=>w.played.SS}
 ]}),
 quiz:[
  {q:'المزمن SD: متى يعمل الخرج Q؟',o:['فوراً مع Start','بعد مرور T من بداية Start إذا بقي Start موصلاً','بعد فصل Start','مع Reset'],c:1,e:'الشكل (15-3): من 1 إلى 2 يعد الزمن ثم يعمل Q.'},
  {q:'المزمن SD: وُصل Start فترة أقل من T ثم فُصل:',o:['يعمل Q مدة T','لا يظهر خرج','يعمل Q حتى Reset','يعمل Q فوراً'],c:1,e:'من 4 إلى 5: الخرج يستمر في الفصل.'},
  {q:'المزمن SD يعمل خرجه، ثم فُصل Start:',o:['يبقى Q حتى Reset','يفصل Q فوراً','يبقى Q مدة T','يعكس Q'],c:1,e:'ص 72: يستمر الخرج حتى يفصل الدخل عند النقطة 3.'},
  {q:'المزمن SS: أعطيت Start نبضة قصيرة فقط:',o:['لا شيء','بعد T يعمل Q ويبقى حتى Reset','يعمل Q مدة T ثم يفصل','يعمل Q فوراً'],c:1,e:'المرحلة B في الشكل (17-4).'},
  {q:'كيف يفصل خرج المزمن SS؟',o:['بفصل Start','بانتهاء T','بـ Reset فقط','بإعادة Start'],c:2,e:'ص 78: لا يفصل إلا في حالة توصيل الفصل.'},
  {q:'المزمن SS: تكرر التشغيل والفصل عدة مرات قبل انتهاء T:',o:['يعمل Q بعد T من أول نبضة','يعمل Q بعد T من آخر نبضة','لا يعمل Q','يعمل Q مع كل نبضة'],c:1,e:'ص 75: الخرج يبدأ بالعد منذ آخر عملية توصيل.'},
  {q:'الصندوق S_ODT في الشكل (14-3) هو:',o:['SP','SE','SD','SF'],c:2,e:'SD = On Delay Timer = S_ODT، و SS = S_ODTS.'},
  {q:'في الشكل (15-3)، لماذا لا يظهر خرج في المرحلة C؟',o:['لأن Start قصير','لأن Reset جاء قبل انتهاء T والمزمن لا يبدأ إلا بتحول Start من 0 إلى 1','لأن TV صفر','خطأ في الرسم'],c:1,e:'ص 73: الخرج يستمر في حالة فصل مع أن الدخل لم يزل موصلاً.'}
 ]
});

/* =================== Lesson 3.5 =================== */
B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'76–79',
 title:'مزمن الفصل المتأخر SF وأمثلة استخدام الأنواع الخمسة',
 summary:'المزمن SF يشغّل الخرج فوراً ويؤخر فصله زمن T بعد فصل Start، ثم أمثلة الكتاب العملية لكل نوع من المزمنات الخمسة.',
 theory:[
  {h:'5- مزمن الفصل المتأخر (Off Delay Timer)',ref:'ص 76',html:'<p>أ- يرمز له بالرمز <b>SF</b> والشكل (18-4).</p>'},
  {fig:'(18-4)',ref:'ص 76',caption:'رمز مزمن الفصل المتأخر SF: T5 من نوع S_OFFDT، TV = S5T#1H23M',draw:()=>box(timerBox({type:'SF'}),560)},
  {html:'<p>ب- الشكل (19-4) يوضح شكل موجات الدخل والخرج والفصل. المراحل: A (1→3)، B (3→6)، C (6→13).</p>'},
  {fig:'(19-4)',ref:'ص 76',caption:'موجات الدخل والخرج والفصل لمزمن الفصل المتأخر SF',draw:()=>box(timerTD('SF'),680)},
  {html:`<ul><li><b>النقطة 1 (A):</b> «بعد تشغيل الدخل (Start) نجد أن الخرج (Q) يبدأ بالتحويل من حالة الفصل (Off) إلى حالة التوصيل (On) ويستمر موازياً للدخل. عند فصل الدخل عند النقطة (2) يبدأ المزمن يعد الفترة الزمنية المحددة (T)… ثم بعد ذلك يتحول إلى وضع فصل (Off).»</li>
    <li><b>النقطة 3 (B):</b> «بدأنا بتشغيل الدخل (Start) ولفترة زمنية صغيرة، ثم أعيد التشغيل عند النقطة (4) ثم فصل، ثم أعيد التشغيل ثم فصل عند النقطة (5). حيث إن جميع مراحل الفصل والتوصيل ذات فترة زمنية أصغر من الزمن المحدد للفصل. فنجد أن المزمن بعد الفصل عند النقطة (5) يبدأ بعد الفترة الزمنية المحددة ثم يفصل.»</li>
    <li><b>النقطة 6 (C) — ص 77:</b> «نلاحظ أن خرج المزمن في حالة توصيل، وعند فصل الدخل عند النقطة (7) بدأ المزمن بعد الفترة الزمنية المحددة ولكن قبل انتهاء الفترة تم تشغيل مفتاح الفصل (Reset) فتحول الخرج مباشرة إلى وضع الفصل (Off) عند النقطة (8).»</li></ul>`},
  {note:'<b>توضيح للمتدرب:</b> النقاط 9 إلى 13 غير مشروحة في النص. الشكل يبين أن Start وُصل عند 10 أثناء Reset (9→11)، فبقي Q مفصولاً حتى النهاية: بعد Reset لا يعود الخرج إلا بتشغيل جديد لـ Start (تحوّله من 0 إلى 1). المختبر يتبع الشكل في ذلك.'},
  {h:'ثالثاً: أمثلة على استخدام كل نوع',ref:'ص 78',html:'<p>«من الأشكال الموجية لجميع أنواع المزمنات نجد أن النوع الأول (SP) والثاني (SE) متقاربان. والفرق بينهما أن زمن الخرج <b>مرتبط</b> مع زمن الدخل في النوع الأول. أما النوع الثاني فإن زمن الخرج <b>غير مرتبط</b> مع زمن الدخل. وكذلك النوع الثالث (SD) والرابع (SS) متقاربان. والفرق بينهما أن فصل الخرج مرتبط مع فصل الدخل في النوع الثالث، أما النوع الرابع بمجرد مرور إشارة تشغيل إلى الدخل يبدأ المزمن بعد الفترة الزمنية ثم يتحول إلى وضع تشغيل ولا يفصل إلا في حالة توصيل الفصل.»</p>'},
  {html:`<div class="cards">
    <div class="card"><h3>النوع الأول SP <span class="ref">ص 78</span></h3><p>1- سيران مرتبطان: الأول غير محدد الزمن والثاني محدد الزمن، وإذا توقف الأول في أي لحظة يقف الثاني مباشرة.<br>2- العجّانات الكبيرة: الظرف يدور ومعه ذراع الخفق بزمن محدد؛ إذا انتهى زمن الخفق وبقي الظرف يدور فلا يتأثر العجين، وإذا توقف الظرف لأي سبب طارئ توقف مضرب الخفق معه مباشرة.</p></div>
    <div class="card"><h3>النوع الثاني SE <span class="ref">ص 78</span></h3><p>1- ماكينات كبس البلوك: قاعدة المكبس على محرك هزاز ومع الهز ينزل ذراع الكبس؛ إذا توقف محرك الهز يستمر ذراع الكبس حسب الفترة المحددة ثم يرتفع.<br>2- مناخل الرمل: إذا توقف سير نقل الرمل يستمر المنخل في الهز حتى تنتهي الفترة الزمنية، وإذا استمر السير بالتفريغ يستمر المنخل في الهز.</p></div>
    <div class="card"><h3>النوع الثالث SD <span class="ref">ص 78</span></h3><p>1- محركات النجمة / الدلتا: يعمل المحرك النجمة ثم بعد فترة زمنية محددة يعمل الدلتا.<br>2- السيور التي تعمل بالتتابع: يعمل الأول ثم بعد فترة محددة يعمل الثاني، وإذا فصل الأول فصل الثاني معه في نفس اللحظة.</p></div>
    <div class="card"><h3>النوع الرابع SS <span class="ref">ص 79</span></h3><p>1- أيضاً في محركات النجمة / الدلتا.<br>2- المحركات التي تعمل في اتجاه وبعد فترة زمنية تعمل في الاتجاه الآخر وتستمر في العمل.</p></div>
    <div class="card"><h3>النوع الخامس SF <span class="ref">ص 79</span></h3><p>1- المخارط: مضخة سائل التبريد تعمل مع الظرف، وبعد توقف الظرف يستمر سائل التبريد فترة محددة ثم يقف.<br>2- دورات المياه: مراوح الشفط تعمل مع الإضاءة، وإذا فُصلت الإضاءة تستمر المراوح فترة محددة ثم تفصل.</p></div></div>`},
  {h:'ملخص المزمنات في أمثلة الفصل',ref:'ص 68–76',html:`<table class="tt"><thead><tr><th>النوع</th><th>الرمز</th><th>المزمن</th><th>الصندوق</th><th>TV في الكتاب</th><th>الشكل</th></tr></thead><tbody>
    ${Object.keys(TT).map(k=>`<tr><td>${TT[k].name}</td><td class="mono">${k}</td><td class="mono">T${TT[k].n}</td><td class="mono">${TT[k].box}</td><td class="mono">${TT[k].tv}</td><td>${TT[k].fig} ${TT[k].page}</td></tr>`).join('')}</tbody></table><p class="sub">في كل الأشكال: S ← I0.1، R ← I0.0، Q → Q4.4.</p>`},
  {note:'في تبويب «المختبر»: منضدة المزمنات على النوع SF، وتحتها لوحة «اختر المزمن المناسب» لأمثلة الكتاب: اختر النوع لكل مثال ثم شغّل الجهاز الأول وافصله وشاهد الجهاز الثاني.'}
 ],
 io:TIO,
 lab:(el)=>timerBench(el,{def:'SF',extra:scenarioPanel,steps:[
  {t:'اختر SF',x:'من «نوع المزمن» اختر SF (T5).',done:w=>w.type==='SF'},
  {t:'التشغيل فوري',x:'شغّل «Start ثابت»: Q يعمل فوراً ويستمر موازياً للدخل (النقطة 1).',done:w=>w.type==='SF'&&w.Q&&w.S},
  {t:'الفصل المتأخر',x:'افصل المفتاح: Q يبقى مدة T بعد فصل Start ثم يفصل (من 2 إلى نهاية A).',done:w=>w.pulses.some(p=>p.type==='SF'&&p.sRel&&!p.endR&&!p.endS)},
  {t:'نبضات متتالية (المرحلة B)',x:'أعط Start عدة نبضات متقاربة (كل فاصل أقل من T): Q يبقى يعمل، ويبدأ عد T من آخر فصل (النقطة 5).'},
  {t:'Reset أثناء العد',x:'أعط Start نبضة، وأثناء عد T اضغط Reset: Q يفصل فوراً (النقطة 8).',done:w=>w.pulses.some(p=>p.type==='SF'&&p.endR)},
  {t:'تسلسل الكتاب (19-4)',x:'اضغط «تسلسل الكتاب» وقارن بالشكل (19-4).',done:w=>w.played.SF},
  {t:'اختر المزمن المناسب',x:'في اللوحة السفلية اختر ثلاثة أمثلة على الأقل واختر لكل منها النوع الذي ذكره الكتاب.',done:w=>w.scen>=3}
 ]}),
 quiz:[
  {q:'المزمن SF: عند توصيل Start، الخرج Q:',o:['يعمل بعد T','يعمل فوراً','لا يعمل حتى يفصل Start','يعمل نصف T'],c:1,e:'ص 76: الخرج يتحول إلى التوصيل ويستمر موازياً للدخل.'},
  {q:'المزمن SF: عند فصل Start، الخرج Q:',o:['يفصل فوراً','يبقى مدة T ثم يفصل','يبقى حتى Reset','يعكس حالته'],c:1,e:'عند فصل الدخل يبدأ المزمن يعد T ثم يتحول إلى الفصل.'},
  {q:'المزمن SF: ضُغط Reset أثناء عد T بعد فصل Start:',o:['يكمل العد','يفصل Q فوراً','يعيد العد','يعمل Q مرة أخرى'],c:1,e:'النقطة 8 في الشكل (19-4).'},
  {q:'مراوح الشفط في دورات المياه تعمل مع الإضاءة وتستمر فترة بعد فصلها. أي مزمن؟',o:['SP','SE','SD','SF'],c:3,e:'ص 79: مثال النوع الخامس SF.'},
  {q:'في العجّانة: إذا توقف الظرف يتوقف مضرب الخفق فوراً، وزمن الخفق محدد. أي مزمن؟',o:['SP','SE','SS','SF'],c:0,e:'ص 78: مثال النوع الأول SP — زمن الخرج مرتبط بزمن الدخل.'},
  {q:'ماكينة كبس البلوك: يستمر ذراع الكبس حسب الفترة المحددة حتى لو توقف الهزاز. أي مزمن؟',o:['SP','SE','SD','SF'],c:1,e:'ص 78: مثال النوع الثاني SE.'},
  {q:'سيور بالتتابع: يعمل الثاني بعد زمن، وإذا فصل الأول فصل الثاني فوراً. أي مزمن؟',o:['SE','SD','SS','SF'],c:1,e:'ص 78: مثال النوع الثالث SD.'},
  {q:'حسب ص 78، الفرق بين SP و SE:',o:['SP أسرع','في SP زمن الخرج مرتبط بزمن الدخل، وفي SE غير مرتبط','SE لا يفصل إلا بـ Reset','لا فرق'],c:1,e:'«الفرق بينهما أن زمن الخرج مرتبط مع زمن الدخل في النوع الأول».'}
 ]
});

/* =================== Lesson 3.6 =================== */
B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'80–84',
 title:'داهلندر آلي بمزمن SS: دلتا ثم دبل نجمة بعد 10 ثوانٍ',
 summary:'يبدأ المحرك على الدلتا (سرعة بطيئة) بالضاغط S1، وبعد 10 ثوانٍ يحوّله المزمن T1 (SS) إلى الدبل النجمة (سرعة عالية)، مع تحويل دائرة التحكم إلى FBD و STL.',
 theory:[
  {h:'الفصل الثالث: تشغيل محرك الدلتا / الدبل النجمة',ref:'ص 80',html:'<p><b>تشغيل محرك الدلتا / الدبل النجمة بشرط أن يعمل المحرك الدلتا (سرعة بطيئة)، ثم بعد فترة محددة يتحول المحرك إلى الدبل النجمة (السرعة العالية). وتسمى هذه الدائرة (داهلندر).</b></p>'},
  {h:'أولاً: الدائرة الرئيسة',ref:'ص 80',html:'<p>«الشكل (20-4) يمثل الدائرة الرئيسة لتشغيل المحرك الدلتا / الدبل النجمة (داهلندر).» وهي مطابقة تماماً للشكل (4-3): K1 = دلتا، و K2 + K3 = دبل نجمة.</p>'},
  {fig:'(20-4)',ref:'ص 80',caption:'الدائرة الرئيسة لتشغيل المحرك الدلتا / الدبل النجمة (داهلندر)',draw:'power'},
  {h:'ثانياً: دائرة التحكم',ref:'ص 81',html:`<p>«الشكل (21-4) يمثل دائرة التحكم لتشغيل المحرك الدلتا / الدبل نجمة (داهلندر).» في أعلاها F4 ثم S0 المغلق، ثم أربعة فروع:</p>
    <ul><li><b>فرع K1:</b> [S1 ∥ K1] ثم تلامس المزمن <b>KT المغلق</b> ثم <b>K3 المغلق</b>.</li><li><b>فرع المزمن T1:</b> K1 مفتوح ثم <b>K2 مغلق</b>.</li><li><b>فرع K3:</b> [تلامس المزمن <b>KT المفتوح</b> ∥ K3].</li><li><b>فرع K2:</b> K3 مفتوح.</li></ul>`},
  {fig:'(21-4)',ref:'ص 81',caption:'دائرة التحكم لتشغيل المحرك الدلتا / الدبل نجمة (داهلندر)',draw:'ctrl'},
  {html:`<p><b>التتابع:</b></p><ol><li>الضغط على S1 يشغّل <b>K1</b> (دلتا، بطيئة) ويتماسك ذاتياً، ويبدأ المزمن <b>T1</b> العد.</li><li>بعد زمن المزمن يفتح <b>KT المغلق</b> فيفصل K1، ويغلق <b>KT المفتوح</b> فيعمل <b>K3</b> ويتماسك ذاتياً.</li><li>تلامس K3 المفتوح يشغّل <b>K2</b>: دبل نجمة، سرعة عالية.</li><li>تلامس K2 المغلق يفصل المزمن.</li></ol>`},
  {fig:'توضيحي',caption:'التتابع مع الزمن (رسم توضيحي ليس من الكتاب): S1 ثم K1 والمزمن 10 s، ثم K3 و K2 حتى الضغط على S0',draw:()=>box(tdSVG({end:16,unit:'10 s',rows:[['S1',[[0,0.6]],'--on'],['K1  Δ',[[0,10]],'--live'],['T1',[[0,10]],'--blue'],['K3',[[10,15]],'--live'],['K2  YY',[[10,15]],'--live'],['S0',[[15,15.6]],'--stop']],pts:[[1,0],[2,10],[3,15]],tm:[[0,10]]}),680)},
  {h:'جدول وظائف العناصر',ref:'ص 82',html:'<p>«من الشكل (21-4) نلاحظ وظائف كل عنصر في الدائرة حسب الجدول التالي:»</p>'},
  {draw:'io',caption:'وظائف العناصر والرمز في الـ PLC',ref:'ص 82'},
  {err:'<ol style="margin:4px 0;padding-inline-start:20px"><li>عناوين المداخل هنا تختلف عن الفصل الأول: هنا F4 = I1.0، و S0 = I0.0، و S1 = I0.1 (في الفصل الأول F4 = I0.0، و S0 = I0.1، و S1 = I1.1). المختبر يتبع جدول ص 82.</li><li>الجدول يخصص Q4.4 للمزمن T1 وتلامساته KT، لكن برنامج الكتاب (FBD و STL) لا يستعمل Q4.4 أبداً؛ لذلك يبقى مصباح Q4.4 مطفأً في نسخة «كما في الكتاب».</li><li>F4 مرسوم في الشكل (21-4) رمز قاطع لا تلامس مغلق، و F5 غير موجود رغم وجوده في الدائرة الرئيسة (20-4).</li></ol>'},
  {h:'تحويل دائرة التحكم إلى دائرة LAD باستخدام PLC',ref:'ص 82'},
  {err:'الكتاب يعلن هذا العنوان في ص 82 لكن <b>لا يوجد أي مخطط LAD</b> بعده (بقية الصفحة فارغة، والصفحة 83 تبدأ بـ FBD). المخطط التالي <b>مولَّد آلياً من قائمة STL في ص 84</b> وليس من الكتاب.'},
  {draw:'lad',caption:'LAD مولَّد من STL الكتاب (غير موجود في الكتاب)',ref:'مولَّد'},
  {h:'تحويل دائرة التحكم إلى دائرة FBD باستخدام PLC',ref:'ص 83'},
  {draw:'fbd',caption:'Network 1–4 بلغة FBD',ref:'ص 83'},
  {h:'تحويل دائرة التحكم إلى دائرة STL باستخدام PLC',ref:'ص 84'},
  {draw:'stl',caption:'Network 1–4 بلغة STL — منقول حرفياً',ref:'ص 84'},
  {note:'<b>زمن المزمن:</b> <span class="ltr">S5T#10S</span> (10 ثوانٍ)، ونوعه <b>SS</b> (S_ODTS). السطران <span class="ltr">NOP 0</span> والسطر الأخير <span class="ltr">A T 1</span> في Network 2 بلا أمر تخصيص: هي بقايا تحويل الصندوق من FBD، ومعناها أن خرج Q للمزمن غير موصول.'},
  {err:`فروق بين برنامج الكتاب والدائرة السلكية (21-4):<ol style="margin:4px 0;padding-inline-start:20px"><li>Network 3 فيها <span class="ltr">AN Q 4.1</span> (تعشيق K1 في فرع K3) وهو غير موجود في الدائرة السلكية.</li><li>في الدائرة السلكية فرع المزمن: K1 مفتوح ثم K2 مغلق على التوالي. في البرنامج K2 (Q4.2) يدخل على مدخل <b>R</b> للمزمن مع F4 و S0.</li><li>تتكرر <span class="ltr">AN I 1.0</span> و <span class="ltr">AN I 0.0</span> في كل Network بدل علامة M كما في الفصل الأول.</li></ol>النسخة «المصحح» في المختبر تطابق الدائرة السلكية (بدون تعشيق K1 في Network 3، و K2 مغلق على التوالي مع المزمن) وتنقل خرج المزمن إلى Q4.4 كما في الجدول. التتابع يعمل في النسختين.`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب): لماذا SS وليس SD؟</b> عندما ينتهي الزمن يسقط K1 فيصبح مدخل S للمزمن = 0. المزمن SS (المخزن) يبقى خرجه = 1 بعد سقوط K1 حتى يصفّره K2 عبر R، فتجد Network 3 إشارة T1 وتشغّل K3. لو كان SD لسقط خرجه مع سقوط K1 قبل أن يعمل K3 (بسبب التعشيق AN Q 4.1)، فيتوقف المحرك. جرّب ذلك بنسخة «تجربة: SD بدل SS».'},
  {h:'والمطلوب',ref:'ص 84',html:'<p>«تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة (PLC). مع اختبار صحة عمل الدائرة.»</p>'}
 ],
 io:IO_C3,
 inputs:[
  {id:'S0',addr:'I0.0',type:'push',color:'red',label:'إيقاف'},
  {id:'S1',addr:'I0.1',type:'push',color:'green',label:'تشغيل'},
  {id:'F4',addr:'I1.0',type:'fault',label:'فصل F4',resetLabel:'إعادة ضبط F4'}
 ],
 variants:{default:'book',note:'برنامج الكتاب يختلف عن الدائرة السلكية (21-4) ولا يستعمل Q4.4؛ والنسخة الثالثة تجربة تبين لماذا اختار الكتاب المزمن SS.',
  book:{label:'كما في الكتاب',program:[N3_1,N3_2('SS'),N3_3,N3_4],note:'البرنامج حرفياً كما في FBD ص 83 و STL ص 84: تعشيق K1 في Network 3، و K2 يصفّر المزمن عبر R، و Q4.4 غير مستعمل.'},
  fixed:{label:'المصحح',program:NET_C3_FIX,note:'مطابق للدائرة السلكية (21-4): Network 2 = K1 و K2 مغلق على التوالي مع المزمن، و Network 3 بدون تعشيق K1، وخرج المزمن KT على Q4.4 كما في جدول ص 82. (تعديل منا، ليس من الكتاب)'},
  sd:{label:'تجربة: SD بدل SS',program:[N3_1,N3_2('SD'),N3_3,N3_4],note:'تجربة (ليست من الكتاب): برنامج الكتاب نفسه مع SD بدل SS. بعد 10 s يسقط K1 ويسقط معه خرج المزمن، فلا يعمل K3 و K2 ويتوقف المحرك.'}},
 power:(st)=>powerDahl(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3')),powerRef:'الشكل (20-4) ص 80',
 ctrl:CTRL_C3,ctrlMap:MAP_C3,ctrlRef:'الشكل (21-4) ص 81',
 plant:(()=>{const p=dahlPlant(st=>({K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),K3:st.Q('Q4.3')}));
   p.readouts=p.readouts.concat([{l:'المزمن T1 (10 s)',v:(pl,s)=>{const t=s.T('T1');return t.run?Math.max(0,t.tv-t.el).toFixed(1)+' s':t.q?'Q = 1':'—'}}]);return p})(),
 plcNote:'لاحظ في Network 2 قيمة المزمن وهو يعد، ثم كيف يصفّره Q4.2 عبر R بعد التحويل. في هذا الفصل S0 = I0.0 و S1 = I0.1 و F4 = I1.0.',
 steps:[
  {t:'الوضع الابتدائي',x:'المحرك متوقف والمزمن T1 لا يعد.'},
  {t:'التشغيل على الدلتا',x:'اضغط S1. يعمل K1 (دلتا، بطيئة) ويبدأ المزمن T1 العد من 10 s.',done:s=>s.Q('Q4.1')&&s.T('T1').run},
  {t:'راقب العد',x:'راقب العد التنازلي للمزمن في الشريط العلوي، والسرعة تقترب من 710 rpm.',done:s=>s.plant.n>650&&s.Q('Q4.1')},
  {t:'التحويل الآلي',x:'بعد 10 s: يسقط K1 (AN T 1)، ثم يعمل K3 فيعمل K2: دبل نجمة، سرعة عالية.',done:s=>s.Q('Q4.2')&&s.Q('Q4.3')},
  {t:'تصفير المزمن',x:'لاحظ أن T1 صار 0 لأن Q4.2 على مدخل R (في «المصحح»: لأن K2 المغلق يفصل مدخل S، ثم يصفّره S0 أو F4).',done:s=>s.Q('Q4.2')&&(!s.T('T1').q||s.variant==='fixed')},
  {t:'الإيقاف',x:'اضغط S0: تسقط كل المتممات.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.Q('Q4.3')&&!s.btn('S0')},
  {t:'الإيقاف أثناء العد',x:'اضغط S1 ثم S0 قبل انتهاء 10 s: يسقط K1 ويُصفَّر المزمن (I0.0 على R)، والتشغيل التالي يبدأ العد من جديد.'},
  {t:'الحماية الحرارية',x:'شغّل ثم اضغط «فصل F4»: يتوقف كل شيء.',done:s=>s.btn('F4')},
  {t:'لماذا SS؟',x:'أعد ضبط F4، ثم بدّل إلى «تجربة: SD بدل SS» واضغط S1: بعد 10 s يسقط K1 ولا تعمل السرعة العالية.'}
 ],
 quiz:[
  {q:'كم زمن المزمن في برنامج الكتاب لهذا الفصل؟',o:['5 s','10 s','15 s','2 min'],c:1,e:'L S5T#10S في Network 2.'},
  {q:'ما نوع المزمن T1 المستعمل؟',o:['SP','SD','SS (S_ODTS)','SF'],c:2,e:'جدول ص 82 والبرنامج: التشغيل المتأخر الممتد/المخزن SS.'},
  {q:'ما الذي يفصل K1 بعد انتهاء زمن المزمن؟',o:['AN T 1 في Network 1','AN Q 4.3 فقط','S0','F4'],c:0,e:'عندما يصبح T1 = 1 تنقطع Network 1 فيسقط K1.'},
  {q:'ما الذي يصفّر المزمن T1 بعد التحويل في برنامج الكتاب؟',o:['Q4.1','Q4.2 (K2) على مدخل R','I0.1','لا شيء'],c:1,e:'Network 2: O I 1.0 / O I 0.0 / O Q 4.2 ثم R T 1.'},
  {q:'ما عنوان الضاغط S1 في هذا الفصل حسب جدول ص 82؟',o:['I1.1','I0.1','I0.0','I1.0'],c:1,e:'العناوين تغيرت عن الفصل الأول: هنا S0 = I0.0 و S1 = I0.1 و F4 = I1.0.'},
  {q:'لو استبدلنا SS بـ SD في برنامج الكتاب:',o:['يعمل كما هو','يسقط K1 بعد 10 s ولا تعمل السرعة العالية','يعمل K1 و K2 معاً','يتحول فوراً'],c:1,e:'خرج SD يسقط مع سقوط K1 (مدخل S) قبل أن يعمل K3 بسبب AN Q 4.1.'},
  {q:'العنوان Q4.4 في جدول ص 82:',o:['خرج K2','مخصص لـ T1 و KT لكن البرنامج لا يستعمله','مدخل S0','عنوان المحرك'],c:1,e:'البرنامج يستعمل T 1 مباشرة ولا يكتب في Q4.4.'},
  {q:'مخطط LAD لهذا التمرين:',o:['موجود في ص 82','غير موجود في الكتاب رغم وجود العنوان','موجود في ص 84','مطابق للشكل (6-3)'],c:1,e:'بعد العنوان في ص 82 لا يوجد مخطط؛ المعروض هنا مولَّد من STL.'}
 ]
});

})(PLCBOOK);
