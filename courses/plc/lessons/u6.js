/* Unit 6 — التطبيق على إشارة المرور (ص 107، 116–125) */
(function(B){
const {S,clamp,W}=B;

/* =====================================================================
   Shared material for the 5 lessons of this unit
   ===================================================================== */
const LC={r:'#e0352b',y:'#f2b705',g:'#1fae4b'};
const mmss=s=>{s=Math.max(0,s);const m=Math.floor(s/60),r=s-m*60;return (m?m+':'+String(Math.floor(r)).padStart(2,'0'):(r<10?r.toFixed(1):Math.floor(r))+' s')};

// STL of the book (ص 124) — the only thing that changes between the two variants is the preset time
function prog6(t1,t2,t3,ref){
 return [
  {title:'Network 1 — دالة التخزين M1.1 (تذكّر طلب العبور)',ref:ref||'ص 121–124',read:'ضغط S1 (I0.1) <b>يثبّت</b> M1.1، وانتهاء المزمن T3 <b>يلغيه</b>. السطران الأخيران يخصصان M1.1 لنفسه (مثل ملف الخرج في LAD).',
   stl:['A I 0.1','S M 1.1','A T 3','R M 1.1','A M 1.1','= M 1.1']},
  {title:'Network 2 — المزمن T1 (فترة الأصفر)',ref:ref||'ص 121–124',read:'ما دام M1.1 = 1 يعدّ المزمن T1 (تأخير توصيل S_ODT)، وبعد <b>'+t1.label+'</b> يصبح T1 = 1.',
   stl:['A M 1.1','L '+t1.s5,'SD T 1','NOP 0','NOP 0','NOP 0','NOP 0']},
  {title:'Network 3 — المزمن T2 (فترة عبور المشاة)',ref:ref||'ص 121–124',read:'يبدأ T2 بعد انتهاء T1، وبعد <b>'+t2.label+'</b> يصبح T2 = 1.',
   stl:['A T 1','L '+t2.s5,'SD T 2','NOP 0','NOP 0','NOP 0','NOP 0']},
  {title:'Network 4 — المزمن T3 (فترة إخلاء الطريق)',ref:ref||'ص 121–124',read:'يبدأ T3 بعد انتهاء T2، وبعد <b>'+t3.label+'</b> يصبح T3 = 1 فيُلغى M1.1 في Network 1.',
   stl:['A T 2','L '+t3.s5,'SD T 3','NOP 0','NOP 0','NOP 0','NOP 0']},
  {title:'Network 5 — الأخضر للسيارات G.C.',ref:ref||'ص 122–124',read:'Q4.1 يعمل إذا <b>لم</b> يكن هناك طلب عبور (M1.1 = 0).',
   stl:['AN M 1.1','= Q 4.1']},
  {title:'Network 6 — الأصفر للسيارات Y.C.',ref:ref||'ص 122–124',read:'Q4.2 يعمل إذا: M1.1 = 1 <b>و</b> T1 لم ينتهِ بعد.',
   stl:['A M 1.1','AN T 1','= Q 4.2']},
  {title:'Network 7 — الأحمر للسيارات R.C.',ref:ref||'ص 122–124',read:'Q4.3 يعمل إذا: M1.1 = 1 <b>و</b> T1 انتهى (يبقى طوال T2 و T3).',
   stl:['A M 1.1','A T 1','= Q 4.3']},
  {title:'Network 8 — الأخضر للمشاة G.P.',ref:ref||'ص 122–124',read:'Q4.4 يعمل إذا: M1.1 = 1 <b>و</b> T1 انتهى <b>و</b> T2 لم ينتهِ بعد.',
   stl:['A M 1.1','A T 1','AN T 2','= Q 4.4']},
  {title:'Network 9 — الأحمر للمشاة R.P.',ref:ref||'ص 122–124',read:'Q4.5 يعمل إذا <b>لم</b> يكن الأخضر للمشاة يعمل: الأحمر عكس الأخضر.',
   stl:['AN Q 4.4','= Q 4.5']}
 ];
}
const BOOK_T={t1:{s5:'S5T#20S',label:'20 ثانية'},t2:{s5:'S5T#1M20S',label:'دقيقة و 20 ثانية'},t3:{s5:'S5T#20S',label:'20 ثانية'}};
const SHORT_T={t1:{s5:'S5T#2S',label:'2 ثانية (مختصر)'},t2:{s5:'S5T#8S',label:'8 ثوانٍ (مختصر)'},t3:{s5:'S5T#2S',label:'2 ثانية (مختصر)'}};
const PROG_BOOK=prog6(BOOK_T.t1,BOOK_T.t2,BOOK_T.t3);
const PROG_SHORT=prog6(SHORT_T.t1,SHORT_T.t2,SHORT_T.t3,'نسخة عرض — ليست من الكتاب');
const VAR6={default:'book',
 note:'لا يوجد في برنامج هذه الوحدة خطأ يغيّر السلوك؛ هذا الاختيار لتقصير الانتظار فقط. المنطق واحد في النسختين، والفرق في قيمة TV للمزمنات.',
 book:{label:'زمن الكتاب (20 ث / 1 د 20 ث / 20 ث)',program:PROG_BOOK,note:'هذه أزمنة الكتاب (ص 121–124): الدورة كاملة بعد الضغط على S1 تستغرق دقيقتين.'},
 short:{label:'زمن مختصر للعرض (2 / 8 / 2 ث)',program:PROG_SHORT,note:'<b>زمن مختصر للعرض، ليس من الكتاب:</b> قُسمت الأزمنة على 10 (S5T#2S و S5T#8S و S5T#2S) لتشاهد الدورة كاملة في 12 ثانية. باقي البرنامج مطابق للكتاب.'}};

const IO6=[
 {sym:'S1',desc:'ضاغط إشارة المرور',addr:'I0.1'},
 {sym:'G.C.\u200E',desc:'إشارة المرور الخضراء للسيارات',addr:'Q4.1'},
 {sym:'Y.C.\u200E',desc:'إشارة المرور الصفراء للسيارات',addr:'Q4.2'},
 {sym:'R.C.\u200E',desc:'إشارة المرور الحمراء للسيارات',addr:'Q4.3'},
 {sym:'G.P.\u200E',desc:'إشارة المرور الخضراء للمشاة',addr:'Q4.4'},
 {sym:'R.P.\u200E',desc:'إشارة المرور الحمراء للمشاة',addr:'Q4.5'},
 {sym:'T1',desc:'الفترة الزمنية اللازمة لاستعداد السيارات للتوقف بسهولة',addr:'T1'},
 {sym:'T2',desc:'الفترة الزمنية اللازمة لعبور المشاة',addr:'T2'},
 {sym:'T3',desc:'الفترة الزمنية اللازمة لإخلاء الطريق من المشاة',addr:'T3'}
];
const IN6=[{id:'S1',addr:'I0.1',type:'push',color:'green',label:'ضاغط المشاة'}];

const PH6=[
 {n:'الوضع الطبيعي',d:'أخضر للسيارات، أحمر للمشاة',cls:'run'},
 {n:'T1: أصفر',d:'السيارات تستعد للتوقف، المشاة أحمر',cls:'warn'},
 {n:'T2: عبور المشاة',d:'أحمر للسيارات، أخضر للمشاة',cls:'trip'},
 {n:'T3: إخلاء الطريق',d:'أحمر للسيارات وأحمر للمشاة',cls:'trip'}
];
const PH_LAMPS=[[1,0,0,0,1],[0,1,0,0,1],[0,0,1,1,0],[0,0,1,0,1]];

/* ---------- the street drawing (figures 1-6 / 2-6 and the live plant) ---------- */
const LP=800, FSTOP=[348,368], LANEY=[195,135], LANED=[1,-1], CARCOL=['var(--blue)','var(--stop)','var(--on)'];
const carX=(lane,f)=>lane===0?f-83:763-f;
function carSVG(id,x,y,dir,col){
 return `<g ${id?`id="${id}"`:''} transform="translate(${x.toFixed(1)} ${y})"><g transform="scale(${dir} 1)"><rect x="-23" y="-12" width="46" height="24" rx="6" fill="${col}" stroke="var(--fg)" stroke-width="1"/><rect x="6" y="-9" width="9" height="18" rx="2" fill="var(--surface)" opacity=".85"/><rect x="-18" y="-9" width="7" height="18" rx="2" fill="var(--surface)" opacity=".55"/></g></g>`;
}
function pedSVG(id,x,y,op){
 return `<g ${id?`id="${id}"`:''} transform="translate(${x} ${y.toFixed(1)})" opacity="${op==null?1:op}"><circle cy="-11" r="5" fill="var(--fg)"/><path d="M0 -5V7M0 7l-5 9M0 7l5 9M-6 0h12" stroke="var(--fg)" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>`;
}
function carSignal(x,y,L,label,lx,anchor){ // vertical housing, red / yellow / green
 return `<rect x="${x}" y="${y}" width="26" height="72" rx="6" fill="var(--head)" stroke="var(--fg)" stroke-width="1.2"/>`+
  W.lamp(x+13,y+13,8,L[2],LC.r)+W.lamp(x+13,y+36,8,L[1],LC.y)+W.lamp(x+13,y+59,8,L[0],LC.g)+
  `<text class="txt ar m" x="${lx}" y="${y+40}" text-anchor="middle">إشارة السيارات</text>`;
}
function pedSignal(x,y,L,s1,btnY,label,lx,anchor){
 return `<rect x="${x}" y="${y}" width="24" height="50" rx="6" fill="var(--head)" stroke="var(--fg)" stroke-width="1.2"/>`+
  W.lamp(x+12,y+13,7.5,L[4],LC.r)+W.lamp(x+12,y+37,7.5,L[3],LC.g)+
  `<circle cx="${x+12}" cy="${btnY}" r="7.5" fill="${s1?'#1d8a57':'var(--surface)'}" stroke="var(--fg)" stroke-width="1.8"/>${s1?`<circle cx="${x+12}" cy="${btnY}" r="12" fill="none" stroke="#1d8a57" stroke-width="2" opacity=".6"/>`:''}`+
  S.t(x+(anchor==='end'?-6:30),btnY+4,'S1','',anchor==='end'?'end':'start')+
  `<text class="txt ar m" x="${lx}" y="${y+30}" text-anchor="middle">إشارة المشاة</text>`;
}
function sceneSVG(o){
 const L=o.L||[1,0,0,0,1],showPed=o.showPed!==false;
 let s=`<svg viewBox="0 0 680 330" role="img" aria-label="طريق باتجاهين عليه ممر مشاة وإشارات مرور">`;
 s+=`<rect x="0" y="0" width="680" height="330" fill="var(--surface-2)"/>`;
 [[60,40],[140,26],[560,36],[635,58],[80,292],[600,296],[520,306]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="17" fill="var(--on)" opacity=".28"/><circle cx="${x}" cy="${y}" r="9" fill="var(--on)" opacity=".35"/>`});
 s+=`<rect x="0" y="80" width="680" height="24" fill="var(--ink-dim)"/><rect x="0" y="226" width="680" height="24" fill="var(--ink-dim)"/>`;
 s+=`<rect x="0" y="104" width="680" height="122" fill="var(--head)"/>`;
 s+=`<path d="M0 165H680" stroke="#fff" stroke-width="2" stroke-dasharray="18 14" opacity=".7"/>`;
 for(let y=110;y<222;y+=14)s+=`<rect x="300" y="${y}" width="60" height="8" fill="#fff" opacity=".85"/>`;
 s+=`<path d="M290 167V224M370 106V163" stroke="#fff" stroke-width="3" opacity=".9"/>`;
 // cars
 (o.cars||[]).forEach((c,i)=>{s+=carSVG(o.live?'u6c'+i:'',carX(c.lane,c.f),LANEY[c.lane],LANED[c.lane],CARCOL[i%3])});
 // pedestrian
 if(showPed&&o.ped)s+=pedSVG(o.live?'u6ped':'',330,o.ped.y,o.ped.op);
 // signals (both car signals and both pedestrian signals are driven by the same outputs)
 s+=`<path d="M423 76V96M245 230V258" stroke="var(--muted)" stroke-width="3"/>`;
 s+=carSignal(410,4,L,'',486,'start')+carSignal(232,256,L,'',180,'end');
 if(showPed){s+=`<path d="M279 66V100M383 228V262" stroke="var(--muted)" stroke-width="3"/>`;
  s+=pedSignal(267,16,L,o.s1,88,'',220,'end')+pedSignal(371,262,L,o.s1,240,'',446,'start');}
 return s+'</svg>';
}
const STATIC_CARS={
 normal:[{lane:0,f:200},{lane:0,f:560},{lane:1,f:230},{lane:1,f:610}],
 stop:[{lane:0,f:346},{lane:0,f:288},{lane:1,f:366},{lane:1,f:308}]
};

/* ---------- الشكل (3-6): ideal timing diagram ---------- */
function fig36SVG(){
 const xs=[90,160,270,520,630,690],rows=[['Q1','G.C.',[1,0,0,0,1],LC.g],['Q2','Y.C.',[0,1,0,0,0],LC.y],['Q3','R.C.',[0,0,1,1,0],LC.r],['Q4','G.P.',[0,0,1,0,0],LC.g],['Q5','R.P.',[1,1,0,1,1],LC.r]];
 let s=`<svg viewBox="0 0 700 300" role="img" aria-label="المخطط الزمني لإشارة المشاة">`;
 rows.forEach(([q,nm,lv,col],i)=>{const y0=40+i*48,hi=y0-22;
  s+=S.t(14,y0-6,q,'','start')+S.t(14,y0+8,nm,'m','start');
  s+=`<path d="M${xs[0]} ${y0}H${xs[5]}" stroke="var(--line)" stroke-width="1"/>`+S.t(xs[5]+2,y0+4,'t','m','start');
  let d='';lv.forEach((v,k)=>{const y=v?hi:y0;d+=(k?`V${y}`:`M${xs[0]} ${y}`)+`H${xs[k+1]}`});
  lv.forEach((v,k)=>{if(v)s+=`<rect x="${xs[k]}" y="${hi}" width="${xs[k+1]-xs[k]}" height="22" fill="${col}" opacity=".18"/>`});
  s+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="2.6"/>`;});
 [xs[1],xs[2],xs[4]].forEach(x=>{s+=`<path d="M${x} 10V268" stroke="var(--blue)" stroke-width="1.4" stroke-dasharray="5 4"/>`});
 s+=`<path d="M${xs[3]} 18V268" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 4"/>`;
 const br=(x1,x2,y,l)=>`<path d="M${x1+2} ${y}H${x2-2}M${x1+2} ${y-4}V${y+4}M${x2-2} ${y-4}V${y+4}" stroke="var(--blue-ink)" stroke-width="1.4"/>`+S.t((x1+x2)/2,y-5,l,'b');
 s+=br(xs[1],xs[2],86+6,'T1')+br(xs[2],xs[3],182+6,'T2')+br(xs[3],xs[4],230+8,'T3');
 s+=br(xs[1],xs[2],284,'20 s')+br(xs[2],xs[3],284,'1 min 20 s')+br(xs[3],xs[4],284,'20 s');
 s+=`<text class="txt ar m" x="${xs[1]}" y="8" text-anchor="middle">الضغط على S1</text>`;
 return s+'</svg>';
}
const PHASE_TABLE=`<div class="tablebox"><table class="tt"><thead><tr><th>الطور</th><th>المدة</th><th>خضراء سيارات<br>Q4.1</th><th>صفراء سيارات<br>Q4.2</th><th>حمراء سيارات<br>Q4.3</th><th>خضراء مشاة<br>Q4.4</th><th>حمراء مشاة<br>Q4.5</th></tr></thead><tbody>
 <tr><td>الوضع الطبيعي</td><td>حتى الضغط على S1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
 <tr><td>T1</td><td class="mono">20 s</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
 <tr><td>T2</td><td class="mono">1 min 20 s</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
 <tr><td>T3</td><td class="mono">20 s</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
 <tr><td>العودة للوضع الطبيعي</td><td>حتى ضغطة جديدة</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr></tbody></table></div>`;

/* ---------- live timing diagram drawn from the plant history ---------- */
function liveTD(p){
 const Wd=p.short?18:170,now=p.time,X0=96,PW=570,x=t=>X0+clamp((t-(now-Wd))/Wd,0,1)*PW;
 const rows=[['Q1 G.C.',LC.g],['Q2 Y.C.',LC.y],['Q3 R.C.',LC.r],['Q4 G.P.',LC.g],['Q5 R.P.',LC.r]];
 const H=p.hist;let s=`<svg viewBox="0 0 680 222" role="img" aria-label="المخطط الزمني الحي">`;
 rows.forEach(([nm,col],j)=>{const y0=34+j*34,hi=y0-18;s+=S.t(8,y0-3,nm,'','start')+`<path d="M${X0} ${y0}H${X0+PW}" stroke="var(--line)"/>`;
  if(!H.length)return;let d='',fill='';
  H.forEach((e,i)=>{const xa=x(e.t),xb=i+1<H.length?x(H[i+1].t):x(now);const y=e.b[j]?hi:y0;d+=(i?`V${y}`:`M${xa} ${y}`)+`H${xb}`;if(e.b[j]&&xb>xa)fill+=`<rect x="${xa.toFixed(1)}" y="${hi}" width="${(xb-xa).toFixed(1)}" height="18" fill="${col}" opacity=".18"/>`});
  s+=fill+`<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4"/>`;});
 H.forEach((e,i)=>{const xa=x(e.t),xb=i+1<H.length?x(H[i+1].t):x(now);
  if(i>0&&e.ph!==H[i-1].ph&&e.t>now-Wd)s+=`<path d="M${xa.toFixed(1)} 10V196" stroke="var(--blue)" stroke-width="1.2" stroke-dasharray="4 4"/>`;
  if(e.ph>0&&xb-xa>22)s+=S.t((xa+xb)/2,12,'T'+e.ph,'b')});
 for(let k=0;k<=4;k++){const tx=X0+PW*k/4;s+=S.t(tx,214,(k===4?'0':'-'+Math.round(Wd*(1-k/4)))+'s','m')}
 return s+`<path d="M${X0+PW} 10V198" stroke="var(--fg)" stroke-width="1"/></svg>`;
}

/* ---------- the plant: street crossing driven by the PLC outputs ---------- */
function crossingPlant(){
 return {
  title:'ممر المشاة (الشكلان 1-6 و 2-6)',
  init:()=>({time:0,ph:0,rem:0,tv:0,tn:'',short:false,hist:[],lastKey:'',lastTD:-1,
   cars:[{lane:0,f:40},{lane:0,f:300},{lane:0,f:560},{lane:1,f:150},{lane:1,f:420},{lane:1,f:690}],ped:{y:92,s:'wait',t:0,op:1}}),
  step(dt,st,p){
   p.time+=dt;p.short=st.variant==='short';
   const g=st.Q('Q4.1'),y=st.Q('Q4.2'),r=st.Q('Q4.3'),pg=st.Q('Q4.4'),pr=st.Q('Q4.5');
   // cars: follow the car in front, obey the signal at the stop line
   p.cars.forEach(c=>{let d=LP;p.cars.forEach(o=>{if(o!==c&&o.lane===c.lane){const k=(o.f-c.f+LP)%LP;if(k>0&&k<d)d=k}});
    let lim=c.f+d-58;const to=FSTOP[c.lane]-c.f;
    if(to>-1&&to<300&&(r||(!g&&!y)||(y&&to>28)))lim=Math.min(lim,FSTOP[c.lane]-2);
    const v=clamp((lim-c.f)*2.6,0,110);c.f=(c.f+v*dt)%LP;});
   // pedestrian
   const pd=p.ped;
   if(pd.s==='wait'&&pg)pd.s='walk';
   if(pd.s==='walk'){pd.y+=46*dt;if(pd.y>=240){pd.y=240;pd.s='done';pd.t=0}}
   else if(pd.s==='done'){pd.t+=dt;pd.op=clamp(1-(pd.t-1.2),0,1);if(pd.t>2.4&&!pg){pd.s='wait';pd.y=92;pd.op=1}}
   // phase + running timer
   const M=st.M('M1.1'),T1=st.T('T1'),T2=st.T('T2'),T3=st.T('T3');
   p.ph=!M?0:!T1.q?1:!T2.q?2:3;
   const tm=p.ph===1?['T1',T1]:p.ph===2?['T2',T2]:p.ph===3?['T3',T3]:null;
   p.tn=tm&&tm[1].run?tm[0]:'';p.tv=tm?tm[1].tv:0;p.rem=tm?Math.max(0,tm[1].tv-tm[1].el):0;
   // history for the live timing diagram
   const b=[g,y,r,pg,pr],key=b.join('')+p.ph;
   if(key!==p.lastKey){p.lastKey=key;p.hist.push({t:p.time,b,ph:p.ph})}
   const Wd=p.short?18:170;while(p.hist.length>2&&p.hist[1].t<p.time-Wd)p.hist.shift();
  },
  render(el,st,p){
   const L=[st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4'),st.Q('Q4.5')],ph=PH6[p.ph];
   el.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;background:var(--surface-2);border-radius:10px;padding:8px 12px">
     <em class="mode-chip ${ph.cls}">${ph.n}</em><span>${ph.d}</span>
     <span style="margin-inline-start:auto;font-size:13px;color:var(--muted)">M1.1 = <span class="bit ${st.M('M1.1')?'one':''}">${st.M('M1.1')}</span></span>
     <div style="flex-basis:100%;display:flex;align-items:center;gap:10px"><span id="u6remTxt" style="min-width:190px">${p.ph?'':'بانتظار ضغط S1'}</span>
     <div style="flex:1;height:8px;border-radius:99px;background:var(--line);overflow:hidden"><i id="u6remBar" style="display:block;height:100%;width:0;background:var(--blue)"></i></div></div></div>
    <div class="svgbox" id="u6scene" style="margin-top:8px;border-radius:10px;overflow:hidden">${sceneSVG({L,cars:p.cars,ped:p.ped,s1:st.btn('S1'),live:1})}</div>
    <p class="sub">إشارتا السيارات تعملان معاً من نفس المخارج، وكذلك إشارتا المشاة، والضاغطان S1 على العمودين يدخلان على نفس المدخل I0.1.</p>
    <h3 class="sm">المخطط الزمني الحي <small style="color:var(--muted);font-weight:500">قارنه بالشكل (3-6) ص 118</small></h3>
    <div class="svgbox" id="u6td" style="max-width:780px">${liveTD(p)}</div>
    <div class="legend"><span><i style="background:${LC.g}"></i>أخضر</span><span><i style="background:${LC.y}"></i>أصفر</span><span><i style="background:${LC.r}"></i>أحمر</span><span>الخط العمودي الأيمن = الآن، والمحور يعرض آخر ${p.short?'18 ثانية':'170 ثانية'}</span></div>`;
   this.frame(el,st,p);
  },
  frame(el,st,p){
   if(!el)return;
   p.cars.forEach((c,i)=>{const g=el.querySelector('#u6c'+i);if(g)g.setAttribute('transform',`translate(${carX(c.lane,c.f).toFixed(1)} ${LANEY[c.lane]})`)});
   const pe=el.querySelector('#u6ped');if(pe){pe.setAttribute('transform',`translate(330 ${p.ped.y.toFixed(1)})`);pe.setAttribute('opacity',p.ped.op.toFixed(2))}
   const rt=el.querySelector('#u6remTxt'),rb=el.querySelector('#u6remBar');
   if(rt&&p.ph){rt.innerHTML=p.tn?`<b class="ltr">${p.tn}</b>: متبقٍ <b class="ltr">${mmss(p.rem)}</b> من <span class="ltr">${mmss(p.tv)}</span>`:''}
   if(rb)rb.style.width=(p.ph&&p.tv?(100*(1-p.rem/p.tv)):0).toFixed(1)+'%';
   if(p.time-p.lastTD>0.12){p.lastTD=p.time;const td=el.querySelector('#u6td');if(td)td.innerHTML=liveTD(p)}
  },
  sig:p=>p.ph+'|'+p.ped.s,
  label:p=>PH6[p.ph].d,
  readouts:[{l:'الطور',chip:p=>[PH6[p.ph].n,PH6[p.ph].cls]},{l:'المؤقت العامل',v:p=>p.tn?p.tn+' '+mmss(p.rem):'—'}]
 };
}

/* ---------- الشكل (4-6) as a current-path diagram (generic renderer) ---------- */
const CTRL6={top:[],branches:[
 {items:[{l:'I1'}],coil:{l:'SM1'}},
 {items:[{l:'T3',timer:'on'}],coil:{l:'RM1'}},
 {items:[{l:'M1'}],coil:{l:'T1',kind:'ton'}},
 {items:[{l:'T1',timer:'on'}],coil:{l:'T2',kind:'ton'}},
 {items:[{l:'T2',timer:'on'}],coil:{l:'T3',kind:'ton'}},
 {items:[{l:'M1',nc:1}],coil:{l:'Q1'}},
 {items:[{l:'M1'},{l:'T1',nc:1,timer:'on'}],coil:{l:'Q2'}},
 {items:[{l:'M1'},{l:'T1',timer:'on'}],coil:{l:'Q3'}},
 {items:[{l:'M1'},{l:'T1',timer:'on'},{l:'T2',nc:1,timer:'on'}],coil:{l:'Q4'}},
 {items:[{l:'Q4',nc:1}],coil:{l:'Q5'}}]};
const MAP6={I1:'I0.1',M1:'M1.1',T1:'T1',T2:'T2',T3:'T3',Q4:'Q4.4'};

/* ---------- book-style boxes (SR and S_ODT) as printed in LAD / FBD ---------- */
function boxesSVG(kind){
 const lad=kind==='lad';let s=`<svg viewBox="0 0 640 330" role="img" aria-label="صندوق SR وصندوق S_ODT">`;
 const pin=(x,y,l,a)=>S.t(x,y+4,l,'',a||'start');
 const contact=(cx,y,l)=>`<path class="sym" d="M${cx-7} ${y-11}V${y+11}M${cx+7} ${y-11}V${y+11}"/>`+S.t(cx,y-16,l);
 // Network 1
 s+=S.t(8,18,'Network 1','b','start');
 if(lad){s+=`<path class="w" d="M14 26V128"/>`+S.w('M14 50H63')+contact(70,50,'I0.1')+S.w('M77 50H170')+contact(122,92,'T3')+S.w('M100 92H115M129 92H170')}
 else{s+=S.t(160,54,'I0.1','','end')+S.w('M164 50H170')+S.t(160,96,'T3','','end')+S.w('M164 92H170')}
 s+=`<rect class="fbox" x="170" y="32" width="96" height="80" rx="3"/>`+S.t(218,26,'M1.1')+S.t(218,50,'SR','b')+pin(176,50,'S')+pin(176,92,'R')+pin(260,50,'Q','end');
 if(lad)s+=S.w('M266 50H384')+`<path class="sym" d="M386 39Q378 50 386 61M398 39Q406 50 398 61"/>`+S.t(392,32,'M1.1');
 else s+=S.w('M266 50H300')+`<rect class="fbox" x="300" y="38" width="60" height="24" rx="3"/>`+S.t(330,54,'=')+S.t(330,32,'M1.1');
 // Network 2
 s+=S.t(8,158,'Network 2','b','start');
 if(lad){s+=`<path class="w" d="M14 166V310"/>`+S.w('M14 190H63')+contact(70,190,'M1.1')+S.w('M77 190H170')}
 else s+=S.t(160,194,'M1.1','','end')+S.w('M164 190H170');
 s+=`<rect class="fbox" x="170" y="172" width="120" height="132" rx="3"/>`+S.t(230,166,'T1')+S.t(230,190,'S_ODT','b')+pin(176,190,'S')+pin(176,234,'TV')+pin(176,278,'R')+pin(284,190,'Q','end')+pin(284,234,'BI','end')+pin(284,278,'BCD','end');
 s+=S.w('M150 234H170')+S.t(146,238,'S5T#20S','','end')+S.w('M150 278H170')+S.t(146,282,'...','m','end');
 s+=S.w('M290 190H330')+S.w('M290 234H310')+S.t(314,238,'...','m','start')+S.w('M290 278H310')+S.t(314,282,'...','m','start');
 // legend on the right
 s+=`<text class="txt ar" x="630" y="54" text-anchor="start" font-size="12.5">SR: الإبقاء (S) والإلغاء (R)، والأولوية للإلغاء</text>`;
 s+=`<text class="txt ar" x="630" y="78" text-anchor="start" font-size="12.5">Q تتبع حالة الذاكرة M1.1</text>`;
 s+=`<text class="txt ar" x="630" y="200" text-anchor="start" font-size="12.5">S_ODT: مزمن تأخير التوصيل</text>`;
 s+=`<text class="txt ar" x="630" y="224" text-anchor="start" font-size="12.5">TV: الزمن المحدد · R: تصفير المزمن</text>`;
 s+=`<text class="txt ar" x="630" y="248" text-anchor="start" font-size="12.5">BI / BCD: الزمن المتبقي (غير مستخدمين)</text>`;
 s+=`<text class="txt ar" x="630" y="272" text-anchor="start" font-size="12.5">Q غير موصول: نستخدم تلامس T1 في الشبكات الأخرى</text>`;
 return s+'</svg>';
}

/* ---------- small interactive widgets ---------- */
function phaseWidget(el){
 let k=0;const draw=()=>{const L=PH_LAMPS[k];const ped={y:k===2?165:k===3?240:92,op:k===3?0.5:1};
  el.innerHTML=`<div class="fig"><div class="seg" role="group">${PH6.map((p,i)=>`<button data-k="${i}" aria-pressed="${i===k}">${p.n}</button>`).join('')}</div>
   <div class="svgbox" style="border-radius:10px;overflow:hidden">${sceneSVG({L,cars:k===0?STATIC_CARS.normal:STATIC_CARS.stop,ped})}</div>
   <div class="facts">${['خضراء سيارات','صفراء سيارات','حمراء سيارات','خضراء مشاة','حمراء مشاة'].map((n,i)=>`<div class="fact"><span>${n} Q4.${i+1}</span><b>${L[i]}</b></div>`).join('')}</div>
   <p class="sub">${['الوضع الطبيعي يستمر حتى يضغط أحد المشاة S1.','الشرط 1: الأصفر للسيارات لفترة T1 والمشاة ما زالت حمراء.','الشرط 2: أحمر للسيارات وأخضر للمشاة في نفس اللحظة لفترة T2.','الشرط 3: المشاة أحمر والسيارات ما زالت حمراء لفترة T3 حتى يخلو الطريق.'][k]}</p></div>`;
  el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()})};draw();
}
function matchWidget(el){
 const items=[['S1','ضاغط المشاة','I0.1'],['G.C.','الخضراء للسيارات','Q4.1'],['Y.C.','الصفراء للسيارات','Q4.2'],['R.C.','الحمراء للسيارات','Q4.3'],['G.P.','الخضراء للمشاة','Q4.4'],['R.P.','الحمراء للمشاة','Q4.5']];
 const addrs=['Q4.4','I0.1','Q4.3','Q4.1','Q4.5','Q4.2'];let sel=null,ok={},bad='';
 const draw=()=>{const n=Object.keys(ok).length;
  el.innerHTML=`<div class="fig"><p><b>تمرين ربط:</b> اختر الرمز ثم اختر عنوانه في الـ PLC.</p>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px"><div style="display:flex;flex-direction:column;gap:6px">${items.map(([s,d])=>`<button class="btn" data-s="${s}" style="text-align:right;${ok[s]?'background:var(--on-soft);border-color:var(--on)':sel===s?'background:var(--blue-soft);border-color:var(--blue)':''}" ${ok[s]?'disabled':''}><span class="mono">${s}</span> — ${d}${ok[s]?' ✓ '+ok[s]:''}</button>`).join('')}</div>
   <div style="display:flex;flex-direction:column;gap:6px">${addrs.map(a=>{const used=Object.values(ok).includes(a);return `<button class="btn mono" data-a="${a}" style="${used?'opacity:.45':''}${bad===a?';background:var(--stop-soft);border-color:var(--stop)':''}" ${used?'disabled':''}>${a}</button>`}).join('')}</div></div>
   <p class="sub" style="margin-top:8px">${n===items.length?'<b style="color:var(--on)">ممتاز، كل الربط صحيح.</b> قارن مع جدول ص 119.':sel?'اختر الآن عنوان '+sel+'.':'صحيح: '+n+' من '+items.length}</p></div>`;
  el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sel=b.dataset.s;bad='';draw()});
  el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(!sel)return;const it=items.find(i=>i[0]===sel);if(it[2]===b.dataset.a){ok[sel]=b.dataset.a;sel=null;bad=''}else bad=b.dataset.a;draw()});};
 draw();
}

/* ---------- theory blocks shared by several lessons ---------- */
const TH_COMMON_IO=[{h:'جدول نقاط الدخل والخرج',ref:'ص 119',html:'<p>«من الشكل (2-6 و 3-6) نجد أن»:</p>'},{draw:'io',caption:'نقاط الدخل والخرج والترميز في الـ PLC',ref:'ص 119'}];
const LAB_NOTE='<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في المختبر تستطيع اختيار «زمن مختصر للعرض» من أعلى الصفحة لترى الدورة كاملة في 12 ثانية بدل دقيقتين. البرنامج نفسه، وتتغير قيمة TV فقط.';

/* common lesson parts */
const BASE6={io:IO6,inputs:IN6,variants:VAR6,plant:null,
 plcNote:'أسطر <span class="mono">NOP 0</span> في Networks 2–4 لا تعمل شيئاً: يولّدها برنامج STEP 7 عند تحويل صندوق المزمن ذي الأطراف الفارغة (R و BI و BCD) إلى STL. وتلامس T1 أو T2 أو T3 يعني: انتهى زمن المزمن.'};
function L6(o){B.lesson(Object.assign({},BASE6,{plant:crossingPlant()},o))}

/* =================== Lesson 6.1 =================== */
L6({
 id:'u6-l1',unit:6,order:1,pages:'107، 116–118',
 title:'إشارة المرور مع إشارة المشاة: الفكرة وشروط التشغيل',
 summary:'كيف تعمل إشارة المشاة: الوضع الطبيعي أخضر للسيارات، وعند ضغط S1 تمر الإشارة بثلاث فترات زمنية T1 و T2 و T3 ثم تعود، مع المخطط الزمني (3-6).',
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 107',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على:</p><ol><li>أن يعرف كيف يتم عمل إشارة المرور.</li><li>أن يكتب برامج للتحكم في إشارة مرور مزدوجة.</li></ol>
   <p><b>مستوى الأداء:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة أساسيات الكهرباء، واجتياز الرسم الفني.</p>`},
  {err:'رقم هذه الصفحة مطبوع في الكتاب «107»، بينما تسلسل الصفحات يقتضي أن يكون 115 (الصفحة التي بعدها 116). على الأرجح خطأ طباعي، وأبقينا الرقم كما هو مطبوع.'},
  {h:'إشارة المرور المزدوجة وإشارة المشاة',ref:'ص 116',html:`<p>«من المعلوم أن إشارة المرور المزدوجة لها إشارتان. كل إشارة يوجد عليها ثلاث لمبات»:</p>
   <ol><li><b style="color:${LC.g}">خضراء:</b> تعني مرور السيارات.</li><li><b style="color:#c99512">صفراء:</b> تعني الاستعداد لتوقف السيارات.</li><li><b style="color:${LC.r}">حمراء:</b> وقوف السيارات.</li></ol>
   <p>«بالإضافة إلى إشارة المشاة. ولها حالتان»:</p><ol><li><b style="color:${LC.r}">حمراء:</b> تعني عدم عبور المشاة.</li><li><b style="color:${LC.g}">خضراء:</b> تعني عبور المشاة.</li></ol>
   <p><b>المطلوب في الكتاب:</b> رسم دائرة التحكم لهذه الإشارة وتنفيذها على جهاز الحاسب الآلي باستخدام (PLC) بالطرق الثلاثة (LAD و FBD و STL).</p>`},
  {fig:'(1-6)',ref:'ص 116',caption:'طريق باتجاهين عليه ممر مشاة، وإشارتا مرور للسيارات عند الممر (رسم المحاكاة على غرار شكل الكتاب)',draw:()=>`<div class="svgbox" style="border-radius:10px;overflow:hidden">${sceneSVG({L:[1,0,0,0,1],cars:STATIC_CARS.normal,showPed:false})}</div>`},
  {html:'<p>«وتستخدم إشارة مرور المشاة بجوار المدارس والتجمعات السكنية، وكذلك في المناطق التي تتباعد فيها إشارات المرور عن بعضها البعض لمسافات طويلة.»</p>'},
  {h:'نظرية التشغيل',ref:'ص 117',html:'<p>«تعتمد نظرية تشغيل هذه الإشارات على أنه في <b>الوضع الطبيعي</b> تكون الإشارة <b>خضراء لطريق السيارات، وحمراء لطريق المشاة</b>. عند رغبة أحد المشاة عبور الطريق فإنه يقوم بالضغط على الضاغط المثبت على عمود حامل الإشارة» كما في الشكل (2-6)، حيث <b>S1</b> هو ضاغط المشاة.</p>'},
  {fig:'(2-6)',ref:'ص 117',caption:'إشارة المشاة بلمبتين (أحمر وأخضر) والضاغط S1 على كل عمود، مع إشارات السيارات',draw:()=>`<div class="svgbox" style="border-radius:10px;overflow:hidden">${sceneSVG({L:[1,0,0,0,1],cars:STATIC_CARS.normal,ped:{y:92}})}</div>`},
  {err:'في الشكل (2-6) يظهر ضاغطان، واحد على كل عمود، وكلاهما باسم S1، بينما جدول الدخل والخرج (ص 119) فيه مدخل واحد I0.1. معنى ذلك أن الضاغطين موصولان على التوازي إلى نفس المدخل، والكتاب لم يذكر ذلك صراحة.'},
  {h:'شروط التشغيل',ref:'ص 117',html:`<ol><li>تتحول إشارة مرور السيارات من <b>الأخضر إلى الأصفر</b> بينما تبقى إشارة المشاة حمراء، ويستمر ذلك لفترة من الزمن <b>(T1)</b> كافية لاستعداد السيارات للتوقف بسهولة.</li>
   <li>بعد انقضاء الفترة (T1) تتحول إشارة السيارات من الأصفر إلى <b>الأحمر</b>، وفي نفس اللحظة تتحول إشارة المشاة من الأحمر إلى <b>الأخضر</b>، ويستمر ذلك لفترة <b>(T2)</b> كافية ليعبر المشاة الشارع.</li>
   <li>بعد انقضاء (T2) تتحول إشارة المشاة من الأخضر إلى <b>الأحمر</b> وتستمر إشارة السيارات حمراء لفترة <b>(T3)</b> حتى يخلو الطريق من المشاة. بعدها تتحول إشارة السيارات إلى <b>الأخضر</b> ويستمر الوضع هكذا حتى يأتي أحد المشاة لتبدأ دورة جديدة بعد الضغط على (S1).</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اختر كل طور في الرسم التالي لترى حالة اللمبات الخمس فيه.'},
  {widget:phaseWidget},
  {h:'المخطط الزمني',ref:'ص 117–118',html:'<p>«وعلى ذلك يكون المخطط الزمني الذي يحقق دورة إشارة مرور المشاة كما هو موضح في الشكل (3-6)». فيه خمسة محاور: Q1 الخضراء للسيارات، Q2 الصفراء للسيارات، Q3 الحمراء للسيارات، Q4 الخضراء للمشاة، Q5 الحمراء للمشاة.</p>'},
  {fig:'(3-6)',ref:'ص 118',caption:'المخطط الزمني لدورة إشارة مرور المشاة. الخطوط الزرقاء المتقطعة عند بداية T1 ونهايته ونهاية T3 كما في الكتاب. قيم الأزمنة مأخوذة من البرنامج (ص 121–124)',draw:()=>`<div class="svgbox">${fig36SVG()}</div>`},
  {html:'<p>جدول الأطوار المستخرج من الشكل (3-6)، مع الأزمنة المكتوبة في البرنامج:</p>'+PHASE_TABLE},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الدورة كاملة بعد الضغط = <span class="ltr">20 + 80 + 20 = 120 s</span> أي دقيقتان. لاحظ أن Q5 (أحمر المشاة) هو عكس Q4 (أخضر المشاة) تماماً، وأن Q3 (أحمر السيارات) يبقى طوال T2 و T3.'},
  ...TH_COMMON_IO,
  {note:LAB_NOTE}
 ],
 program:PROG_BOOK,
 steps:[
  {t:'اختر الزمن',x:'أعلى الصفحة: «زمن الكتاب» يعطي الدورة بأزمنتها الحقيقية (دقيقتان)، و«زمن مختصر للعرض» يقسمها على 10. ثم اضغط «التالي».'},
  {t:'الوضع الطبيعي',x:'السيارات تمر (أخضر) والمشاة أحمر، والمخطط الزمني يرسم Q1 و Q5 مرتفعين. هذا الوضع يستمر بلا نهاية حتى يأتي أحد المشاة.'},
  {t:'اطلب العبور',x:'اضغط الضاغط S1 (ضاغط المشاة) في الشريط العلوي. لاحظ الضاغطين على العمودين في الرسم يضيئان معاً.',done:s=>s.M('M1.1')},
  {t:'الشرط 1: الأصفر (T1)',x:'الإشارة صفراء والمشاة ما زالت حمراء. راقب الزمن المتبقي في الشريط. السيارات القريبة من الخط تكمل، والبعيدة تتوقف. انتظر حتى يتحول للأحمر.',done:s=>s.Q('Q4.3')&&s.Q('Q4.4')},
  {t:'الشرط 2: عبور المشاة (T2)',x:'أحمر للسيارات وأخضر للمشاة في نفس اللحظة. الشخص يعبر الممر. انتظر انتهاء T2.',done:s=>s.T('T2').q},
  {t:'الشرط 3: إخلاء الطريق (T3)',x:'المشاة عادت حمراء لكن السيارات ما زالت حمراء حتى يخلو الطريق. انتظر عودة الأخضر للسيارات.',done:s=>!s.M('M1.1')&&s.Q('Q4.1')},
  {t:'قارن بالشكل (3-6)',x:'انظر إلى المخطط الزمني الحي: نبضة Q2 طولها T1، ونبضة Q4 طولها T2، و Q3 مرتفع طوال T2 + T3. هذا هو الشكل (3-6) نفسه.'},
  {t:'اضغط أثناء الدورة',x:'اضغط S1 مرة أخرى، وبعد أن يصير الأحمر للسيارات اضغطه ثانية. لا يتغير شيء: الطلب محفوظ أصلاً في M1.1، والدورة تكمل أزمنتها.',done:s=>s.btn('S1')&&s.Q('Q4.3')}
 ],
 quiz:[
  {q:'ماذا تعني الإشارة الصفراء للسيارات حسب الكتاب؟',o:['مرور السيارات','الاستعداد لتوقف السيارات','عبور المشاة','وقوف السيارات'],c:1,e:'الخضراء: مرور، الصفراء: الاستعداد للتوقف، الحمراء: وقوف (ص 116).'},
  {q:'ما حالة الإشارات في الوضع الطبيعي قبل الضغط على S1؟',o:['أحمر للسيارات وأخضر للمشاة','أصفر للسيارات وأحمر للمشاة','أخضر للسيارات وأحمر للمشاة','أحمر للجميع'],c:2,e:'«في الوضع الطبيعي تكون الإشارة خضراء لطريق السيارات، وحمراء لطريق المشاة» (ص 117).'},
  {q:'ماذا يحدث لحظة انتهاء الفترة T1؟',o:['تعود السيارات للأخضر','يتحول الأصفر إلى أحمر للسيارات ويصير المشاة أخضر في نفس اللحظة','تبقى الإشارة صفراء','يتحول المشاة إلى أحمر'],c:1,e:'الشرط الثاني في ص 117.'},
  {q:'ما الغرض من الفترة T3؟',o:['استعداد السيارات للتوقف','عبور المشاة','إخلاء الطريق من المشاة قبل عودة الأخضر للسيارات','تأخير الضغط على S1'],c:2,e:'في T3 تكون إشارة المشاة حمراء والسيارات ما زالت حمراء حتى يخلو الطريق.'},
  {q:'كم مدة T2 في برنامج الكتاب؟',o:['20 ثانية','80 ثانية (دقيقة و 20 ثانية)','2 دقيقة','8 ثوانٍ'],c:1,e:'TV = S5T#1M20S أي دقيقة و 20 ثانية.'},
  {q:'أين تُستخدم إشارة مرور المشاة حسب الكتاب؟',o:['على الطرق السريعة فقط','داخل المصانع','بجوار المدارس والتجمعات السكنية والمناطق التي تتباعد فيها الإشارات','في مواقف السيارات'],c:2,e:'ص 116.'},
  {q:'في الشكل (3-6)، أي إشارة تبقى مرتفعة طوال T2 و T3 معاً؟',o:['Q1 الخضراء للسيارات','Q2 الصفراء للسيارات','Q3 الحمراء للسيارات','Q4 الخضراء للمشاة'],c:2,e:'الأحمر للسيارات يبدأ بنهاية T1 وينتهي بنهاية T3.'},
  {q:'متى تكون إشارة المشاة الحمراء Q5 مطفأة؟',o:['طوال T1','طوال T2 فقط','طوال T3','في الوضع الطبيعي'],c:1,e:'Q5 عكس Q4: تنطفئ فقط أثناء عبور المشاة (T2).'}
 ]
});

/* =================== Lesson 6.2 =================== */
L6({
 id:'u6-l2',unit:6,order:2,pages:'119–120',
 title:'جدول المداخل والمخارج ومخطط مسار التيار',
 summary:'ترميز الضاغط واللمبات الخمس والمزمنات الثلاثة في الـ PLC، ثم دائرة التحكم في الشكل (4-6) درجةً درجة.',
 theory:[
  ...TH_COMMON_IO,
  {html:`<ul><li><b>مدخل واحد:</b> الضاغط S1 على <span class="mono">I0.1</span>.</li><li><b>خمسة مخارج:</b> ثلاث لمبات للسيارات <span class="mono">Q4.1–Q4.3</span> ولمبتان للمشاة <span class="mono">Q4.4–Q4.5</span>.</li><li><b>ثلاثة مزمنات:</b> T1 و T2 و T3 للفترات الثلاث.</li><li>ويستخدم البرنامج أيضاً علامة الذاكرة <span class="mono">M1.1</span> لتذكّر أن أحد المشاة ضغط S1 (ليست في جدول الكتاب، لكنها في الشكل (4-6) باسم M1 وفي البرنامج).</li></ul>`},
  {err:'في جدول ص 119 كُتب عنوان الإشارة الصفراء «Q4.٢» بخلط رقم عربي، والمقصود <span class="mono">Q4.2</span> كما يؤكده برنامج LAD و STL. كما وُصف S1 في الجدول بأنه «ضاغط إشارة المرور»، بينما يسميه النص «ضاغط المشاة».'},
  {widget:matchWidget},
  {h:'دائرة التحكم (مخطط مسار التيار)',ref:'ص 119–120',html:'<p>«وعلى ذلك تكون دائرة التحكم لهذه الإشارة على النحو التالي كما في الشكل (4-6)». الشكل في الكتاب مخطط سلّمي عام بعشر درجات وبأسماء مختصرة. رسمناه هنا رأسياً على طريقة مسار التيار؛ كل فرع = درجة من درجات الكتاب بنفس الترتيب:</p>'},
  {fig:'(4-6)',ref:'ص 120',caption:'دائرة التحكم لإشارة المشاة بأسماء الكتاب المختصرة. SM1 = ملف تثبيت (Set) للذاكرة M1، و RM1 = ملف إلغاء (Reset) لها، والمزمنات بقيم 20 و 80 و 20 ثانية',draw:'ctrl'},
  {html:`<ol><li><b>I1 ← تثبيت M1:</b> ضغطة واحدة على الضاغط تثبّت الذاكرة M1 (تبقى بعد رفع الإصبع).</li>
   <li><b>T3 ← إلغاء M1:</b> عند انتهاء T3 تُلغى الذاكرة فتنتهي الدورة.</li>
   <li><b>M1 ← المزمن T1 = 20:</b> يبدأ T1 مع الطلب.</li>
   <li><b>T1 ← المزمن T2 = 80:</b> يبدأ T2 عند انتهاء T1.</li>
   <li><b>T2 ← المزمن T3 = 20:</b> يبدأ T3 عند انتهاء T2.</li>
   <li><b>M1 مغلق ← Q1:</b> الأخضر للسيارات ما دام لا يوجد طلب.</li>
   <li><b>M1 مفتوح و T1 مغلق ← Q2:</b> الأصفر من بداية الطلب حتى انتهاء T1.</li>
   <li><b>M1 و T1 ← Q3:</b> الأحمر للسيارات بعد T1 حتى نهاية الدورة.</li>
   <li><b>M1 و T1 و T2 مغلق ← Q4:</b> الأخضر للمشاة بين نهاية T1 ونهاية T2.</li>
   <li><b>Q4 مغلق ← Q5:</b> الأحمر للمشاة كلما كان الأخضر مطفأ.</li></ol>`},
  {html:`<p>مقابلة الأسماء المختصرة في الشكل (4-6) بالعناوين الحقيقية:</p><div class="tablebox"><table class="tt"><thead><tr><th>في الشكل (4-6)</th><th>I1</th><th>M1</th><th>T1 20</th><th>T2 80</th><th>T3 20</th><th>Q1…Q5</th></tr></thead><tbody><tr><td>في البرنامج</td><td class="mono">I0.1</td><td class="mono">M1.1</td><td class="mono">S5T#20S</td><td class="mono">S5T#1M20S</td><td class="mono">S5T#20S</td><td class="mono">Q4.1…Q4.5</td></tr></tbody></table></div>`},
  {err:'الشكل (4-6) يستخدم أسماء مختصرة (I1 و M1 و Q1…Q5) بدل العناوين الحقيقية، وفوق ملف التثبيت مكتوب «S1» بمعنى Set M1، وقد يُقرأ خطأً كأنه الضاغط S1. كما أن المطلوب في ص 116 «رسم دائرة التحكم»، والمقدَّم مخطط سلّمي وليس دائرة كونتاكتورات.'},
  {note:LAB_NOTE}
 ],
 program:PROG_BOOK,
 ctrl:CTRL6,ctrlMap:MAP6,ctrlRef:'الشكل (4-6) ص 120',
 steps:[
  {t:'الدائرة في الوضع الطبيعي',x:'في دائرة التحكم: الفرع Q1 فقط موصل لأن تلامس M1 المغلق يمرر التيار، والفرع Q5 موصل لأن Q4 مطفأ. باقي الفروع مقطوعة.'},
  {t:'اضغط S1 (I1)',x:'اضغط S1 وراقب الفرع الأول: يتغذى ملف التثبيت SM1، فيُغلق تلامس M1 في الفروع 3 و 7 و 8 و 9 ويُفتح في الفرع 6.',done:s=>s.M('M1.1')},
  {t:'المزمن T1 يعدّ',x:'الفرع 3 موصل (ملف T1)، والفرع 7 موصل (Q2 الأصفر) لأن تلامس T1 المغلق لم يُفتح بعد. انتظر انتهاء T1.',done:s=>s.T('T1').q},
  {t:'انتهى T1',x:'تلامس T1 المفتوح أُغلق: الفرعان 8 (Q3) و 9 (Q4) موصلان، والفرع 7 انقطع. وبما أن Q4 عمل فُتح تلامسه المغلق في الفرع 10 فانطفأ Q5. والفرع 4 يشغّل T2.',done:s=>s.T('T2').run},
  {t:'انتهى T2',x:'تلامس T2 المغلق في الفرع 9 فُتح فانطفأ Q4، وعاد Q5. والفرع 5 يشغّل T3.',done:s=>s.T('T2').q},
  {t:'انتهى T3',x:'تلامس T3 في الفرع 2 يغذي ملف الإلغاء RM1 فتُلغى M1 وتنفصل كل المزمنات، ويعود الفرع 6 (Q1).',done:s=>!s.M('M1.1')&&s.Q('Q4.1')},
  {t:'راجع الجدول',x:'في تبويب «برنامج الـ PLC» سترى جدول الدخل والخرج حياً: كل صف يتلون عندما تكون قيمته 1. قارن Q4.1…Q4.5 بلمبات الإشارة.'}
 ],
 quiz:[
  {q:'ما عنوان الضاغط S1 في الـ PLC؟',o:['Q4.1','I0.1','I1.1','M1.1'],c:1,e:'جدول ص 119: S1 = I0.1.'},
  {q:'ما عنوان الإشارة الحمراء للمشاة R.P.؟',o:['Q4.3','Q4.4','Q4.5','Q4.2'],c:2,e:'G.P. = Q4.4 و R.P. = Q4.5.'},
  {q:'كتب الكتاب عنوان الصفراء «Q4.٢». ما المقصود؟',o:['Q4.7','Q4.2','Q2.4','I4.2'],c:1,e:'رقم عربي مكتوب خطأً؛ والبرنامج يستخدم Q4.2.'},
  {q:'في الشكل (4-6) ما الذي يلغي الذاكرة M1؟',o:['الضاغط S1','تلامس T1','تلامس T3 بعد انتهاء زمنه','الملف Q1'],c:2,e:'الدرجة الثانية: T3 ← R M1.'},
  {q:'لماذا يتغذى الملف Q5 عبر تلامس مغلق من Q4؟',o:['لأن الأحمر للمشاة عكس الأخضر للمشاة','لزيادة الزمن','للتعويض الذاتي','لأن Q5 مزمن'],c:0,e:'عندما يعمل Q4 يُفتح تلامسه المغلق فينطفئ Q5، والعكس.'},
  {q:'شرط عمل Q2 (الأصفر) في الشكل (4-6) هو:',o:['M1 مغلق فقط','M1 مفتوح (يعمل) و T1 لم ينته','T1 و T2','Q4 مطفأ'],c:1,e:'الدرجة 7: تلامس M1 المفتوح وتلامس T1 المغلق.'},
  {q:'ماذا تعني القيمة 80 بجانب المزمن T2 في الشكل (4-6)؟',o:['80 ملّي ثانية','80 ثانية = S5T#1M20S','80 دقيقة','عدد السيارات'],c:1,e:'تقابل في البرنامج S5T#1M20S (دقيقة و 20 ثانية).'},
  {q:'كم مخرجاً يستخدم هذا التطبيق؟',o:['3','5','6','9'],c:1,e:'Q4.1 إلى Q4.5: ثلاث للسيارات واثنتان للمشاة.'}
 ]
});

/* =================== Lesson 6.3 =================== */
L6({
 id:'u6-l3',unit:6,order:3,pages:'121–122',
 title:'برنامج الإشارة بلغة LAD',
 summary:'تحويل الشكل (4-6) إلى تسع Networks بلغة LAD باستخدام دالة التخزين SR والمزمنات S_ODT.',
 theory:[
  {h:'أولاً: دائرة (LAD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 121–122',html:'<p>البرنامج تسع Networks: الأولى للذاكرة M1.1، ثم ثلاث للمزمنات، ثم خمس للمخارج.</p>'},
  {h:'صندوق SR وصندوق المزمن S_ODT',ref:'ص 121',html:`<ul><li><b>Network 1:</b> تلامس <span class="mono">I0.1</span> يدخل على الطرف S لصندوق <b>SR</b> عنوانه M1.1، والطرف R يأتيه تلامس <span class="mono">T3</span>، وخرج الصندوق إلى ملف M1.1.</li>
   <li><b>Networks 2–4:</b> صندوق مزمن <b>S_ODT</b> (مزمن تأخير التوصيل): T1 يدخل عليه M1.1 و TV = S5T#20S، و T2 يدخل عليه تلامس T1 و TV = S5T#1M20S، و T3 يدخل عليه تلامس T2 و TV = S5T#20S. الأطراف R و BI و BCD فارغة، والمخرج Q غير موصول بملف.</li></ul>`},
  {fig:'',ref:'ص 121',caption:'Network 1 و Network 2 كما تُرسم في الكتاب بالصناديق (رسم توضيحي على غرار الكتاب)',draw:()=>`<div class="svgbox">${boxesSVG('lad')}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المزمن S_ODT يبدأ العدّ عندما يصير S = 1، ويصبح خرجه (وتلامسه) 1 بعد انتهاء TV ما دام S ما زال 1. إذا رجع S إلى 0 يتصفّر المزمن فوراً. لذلك عندما تُلغى M1.1 في نهاية الدورة تتصفّر T1 ثم T2 ثم T3 معاً.'},
  {note:'المحاكاة ترسم Network 1 بملفّي S و R منفصلين بدل صندوق SR، لأنها تُبنى من برنامج STL (ص 124). السلوك واحد: الإلغاء له الأولوية في الحالتين.'},
  {h:'البرنامج كاملاً بلغة LAD',ref:'ص 121–122'},
  {draw:'lad',caption:'Network 1–9 بلغة LAD',ref:'ص 121–122'},
  {html:`<p><b>قراءة Networks المخارج</b> (ص 122):</p><ul><li><b>Network 5:</b> M1.1 مغلق ← Q4.1 (الأخضر للسيارات).</li><li><b>Network 6:</b> M1.1 و T1 مغلق ← Q4.2 (الأصفر).</li><li><b>Network 7:</b> M1.1 و T1 ← Q4.3 (الأحمر للسيارات).</li><li><b>Network 8:</b> M1.1 و T1 و T2 مغلق ← Q4.4 (الأخضر للمشاة).</li><li><b>Network 9:</b> Q4.4 مغلق ← Q4.5 (الأحمر للمشاة).</li></ul>`},
  {err:'مخرج Q لصناديق المزمنات في الكتاب غير موصول بأي ملف، والمزمنات تُستخدم بتلامساتها T1 و T2 و T3 في الشبكات الأخرى. هذا صحيح ولا يغيّر شيئاً، لكنه قد يربك المبتدئ.'},
  ...TH_COMMON_IO,
  {note:LAB_NOTE}
 ],
 steps:[
  {t:'افتح البرنامج بجانب الإشارة',x:'يفضل أن تختار «زمن مختصر للعرض». بعد كل خطوة هنا افتح تبويب «برنامج الـ PLC» (عرض LAD) وشاهد الشبكات تتلون.'},
  {t:'Network 1: الطرف S',x:'اضغط S1. في LAD يتحقق شرط الملف S فيصبح M1.1 = 1، ويبقى بعد رفع إصبعك.',done:s=>s.M('M1.1')},
  {t:'Network 2 و 6: T1 والأصفر',x:'المزمن T1 يعدّ (يظهر بجانبه الزمن المتبقي في LAD)، و Network 6 تشغّل Q4.2 لأن تلامس T1 المغلق ما زال موصلاً.',done:s=>s.T('T1').q},
  {t:'Network 3 و 7 و 8',x:'انتهى T1 فأغلق تلامسه: T2 بدأ يعدّ، و Q4.3 و Q4.4 يعملان. و Network 9 أطفأت Q4.5.',done:s=>s.Q('Q4.4')&&s.T('T2').run},
  {t:'Network 4: T3',x:'بعد انتهاء T2 يبدأ T3، ويطفأ Q4.4 لأن تلامس T2 المغلق فُتح في Network 8.',done:s=>s.T('T3').run},
  {t:'Network 1: الطرف R',x:'عند انتهاء T3 يتحقق شرط R فتُلغى M1.1، وتتصفّر المزمنات الثلاثة في نفس دورة المسح، ويعود Q4.1.',done:s=>!s.M('M1.1')&&s.Q('Q4.1')},
  {t:'جرّب المسح البطيء',x:'في تبويب «برنامج الـ PLC» فعّل «تشغيل المسح ببطء» ثم اضغط S1: سترى الـ PLC ينفذ Network 1 ثم 2 ثم … حتى 9 بالترتيب.'}
 ],
 quiz:[
  {q:'في Network 1 وصل 1 إلى الطرفين S و R لصندوق SR في نفس اللحظة. ما حالة M1.1؟',o:['1 لأن S له الأولوية','0 لأن الإلغاء R له الأولوية','تتبدل كل ثانية','لا تتغير'],c:1,e:'في صندوق SR الأولوية للإلغاء.'},
  {q:'ما نوع المزمن S_ODT؟',o:['مزمن نبضة','مزمن تأخير التوصيل','مزمن تأخير الفصل','عداد'],c:1,e:'S_ODT = On-Delay: الخرج يصبح 1 بعد انقضاء TV ما دام المدخل S = 1.'},
  {q:'TV = S5T#1M20S تعني:',o:['1.20 ثانية','دقيقة و 20 ثانية','120 دقيقة','20 دقيقة'],c:1,e:'1M = دقيقة، 20S = 20 ثانية.'},
  {q:'لماذا مخرج Q لصناديق المزمنات غير موصول بملف؟',o:['لأن البرنامج ناقص','لأن تلامسات T1 و T2 و T3 تُستخدم في الشبكات الأخرى','لأن المزمن لا يعمل','لأنه مخرج BCD'],c:1,e:'تلامس المزمن يأخذ حالة خرجه، فلا حاجة لملف.'},
  {q:'متى يعمل Q4.4 حسب Network 8؟',o:['M1.1 و T1 و ليس T2','M1.1 فقط','T2 و T3','ليس M1.1'],c:0,e:'A M1.1، A T1، AN T2.'},
  {q:'ماذا يحدث للمزمن T1 عندما تُلغى M1.1؟',o:['يكمل العد','يتصفّر فوراً ويصبح خرجه 0','يتجمد','يبدأ T3'],c:1,e:'مزمن تأخير التوصيل يتصفّر إذا عاد مدخله S إلى 0.'},
  {q:'معنى Network 5 (تلامس مغلق M1.1 ← Q4.1):',o:['الأخضر للسيارات ما دام لا يوجد طلب عبور','الأخضر للمشاة','الأصفر بعد الضغط','الأحمر دائماً'],c:0,e:'M1.1 = 0 قبل الضغط وبعد انتهاء الدورة.'},
  {q:'كم Network في برنامج LAD لهذه الإشارة؟',o:['5','9','10','3'],c:1,e:'تسع Networks (ص 121–122)، بينما الشكل (4-6) عشر درجات لأن التثبيت والإلغاء فيه درجتان.'}
 ]
});

/* =================== Lesson 6.4 =================== */
L6({
 id:'u6-l4',unit:6,order:4,pages:'122–123',
 title:'برنامج الإشارة بلغة FBD',
 summary:'نفس البرنامج بالبوابات المنطقية: صندوق SR، وصناديق S_ODT، وبوابات & مع دائرة النفي.',
 theory:[
  {h:'ثانياً: دائرة (FBD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 122–123',html:`<ul><li><b>Network 1:</b> صندوق SR عنوانه M1.1: S = I0.1، و R = T3، وخرجه إلى صندوق التخصيص «=» M1.1.</li>
   <li><b>Networks 2–4:</b> صناديق S_ODT للمزمنات T1 (S = M1.1)، و T2 (S = T1)، و T3 (S = T2) بنفس الأزمنة.</li>
   <li><b>Networks 5–9:</b> بوابات <b>&amp;</b> (و). الدائرة الصغيرة على المدخل (N) تعني <b>نفي</b>.</li></ul>`},
  {fig:'',ref:'ص 122–123',caption:'Network 1 و Network 2 بالصناديق كما في الكتاب (رسم توضيحي على غرار الكتاب)',draw:()=>`<div class="svgbox">${boxesSVG('fbd')}</div>`},
  {html:`<div class="tablebox"><table class="tt"><thead><tr><th>Network</th><th>مداخل البوابة &amp;</th><th>المخرج</th></tr></thead><tbody>
   <tr><td>5</td><td class="mono">M1.1 (N)</td><td class="mono">Q4.1</td></tr><tr><td>6</td><td class="mono">M1.1 ، T1 (N)</td><td class="mono">Q4.2</td></tr>
   <tr><td>7</td><td class="mono">M1.1 ، T1</td><td class="mono">Q4.3</td></tr><tr><td>8</td><td class="mono">M1.1 ، T1 ، T2 (N)</td><td class="mono">Q4.4</td></tr><tr><td>9</td><td class="mono">Q4.4 (N)</td><td class="mono">Q4.5</td></tr></tbody></table></div><p>في Network 5 و 9 بوابة & بمدخل واحد منفي، أي أن الخرج = عكس المدخل.</p>`},
  {h:'البرنامج كاملاً بلغة FBD',ref:'ص 122–123'},
  {draw:'fbd',caption:'Network 1–9 بلغة FBD',ref:'ص 122–123'},
  {note:'المحاكاة ترسم Network 1 بصندوقي S و R منفصلين بدل صندوق SR، لأنها تُبنى من STL (ص 124)، والسلوك واحد. وفي Networks 5 و 9 يرسمها المحاكي مدخلاً منفياً مباشرة إلى «=» بدون صندوق &.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> LAD و FBD و STL ثلاث طرق لكتابة <b>نفس</b> المنطق. التلامس على التوالي في LAD = بوابة & في FBD = أوامر A متتالية في STL، والتلامس المغلق = مدخل منفي = AN.'},
  ...TH_COMMON_IO,
  {note:LAB_NOTE}
 ],
 steps:[
  {t:'استعد',x:'اختر «زمن مختصر للعرض»، وافتح تبويب «برنامج الـ PLC» على عرض FBD عندما تريد متابعة القيم 0/1 على مداخل كل بوابة.'},
  {t:'الوضع الطبيعي',x:'في Network 5 مدخل M1.1 = 0 والدائرة الصغيرة تعكسه إلى 1، فيعمل Q4.1. وفي Network 9 المدخل Q4.4 = 0 فيعمل Q4.5.'},
  {t:'اضغط S1',x:'صندوق SR (هنا S) يثبّت M1.1 = 1: تنعكس Network 5 فيطفأ الأخضر، وتتحقق & في Network 6 (M1.1 = 1 و T1 = 0 بعد النفي) فيضيء الأصفر.',done:s=>s.Q('Q4.2')},
  {t:'انتهاء T1',x:'الآن T1 = 1: مدخله المنفي في Network 6 صار 0 فانطفأ الأصفر، و & في Network 7 و 8 تحققت.',done:s=>s.Q('Q4.4')},
  {t:'انتهاء T2',x:'مدخل T2 المنفي في Network 8 صار 0 فانطفأ Q4.4، و Network 9 أعادت Q4.5.',done:s=>s.T('T3').run},
  {t:'نهاية الدورة',x:'T3 = 1 يدخل على R فتُلغى M1.1، وتعود البوابات إلى الوضع الطبيعي.',done:s=>!s.M('M1.1')&&s.Q('Q4.1')},
  {t:'بدّل بين العروض',x:'في تبويب «برنامج الـ PLC» بدّل بين LAD و FBD أثناء الدورة: نفس القيم في نفس اللحظة، والرسم فقط مختلف.'}
 ],
 quiz:[
  {q:'ماذا تعني البوابة & في FBD؟',o:['أو','و (كل المداخل يجب أن تكون 1)','نفي','مزمن'],c:1,e:'& = AND.'},
  {q:'ماذا تعني الدائرة الصغيرة على مدخل البوابة؟',o:['نفي المدخل','تكبير الإشارة','مزمن','عداد'],c:0,e:'المدخل المنفي (N) يعكس قيمة الإشارة.'},
  {q:'Network 9: بوابة & مدخلها Q4.4 (N) وخرجها Q4.5. هذا يعني:',o:['Q4.5 = Q4.4','Q4.5 = عكس Q4.4','Q4.5 دائماً 1','Q4.5 = T2'],c:1,e:'أحمر المشاة عكس أخضر المشاة.'},
  {q:'وظيفة الصندوق «=» في FBD:',o:['مقارنة رقمين','تخصيص نتيجة البوابة للمخرج','تصفير المزمن','عدّ النبضات'],c:1,e:'«=» تكتب نتيجة المنطق في العنوان المكتوب فوقها.'},
  {q:'ما مداخل البوابة في Network 6 (الأصفر)؟',o:['M1.1 و T1 (N)','M1.1 (N) فقط','T1 و T2','M1.1 و T1 و T2 (N)'],c:0,e:'الأصفر = M1.1 و ليس T1.'},
  {q:'متى يبدأ المزمن T2 في FBD؟',o:['مع الضغط على S1','عندما يصبح T1 = 1 أي بعد انتهاء T1','عند انتهاء T3','عندما يطفأ Q4.5'],c:1,e:'مدخل S لصندوق T2 هو T1.'},
  {q:'ما الفرق بين LAD و FBD لنفس البرنامج؟',o:['FBD أسرع','نفس المنطق بطريقة رسم مختلفة','LAD لا يدعم المزمنات','FBD لا يحتاج عناوين'],c:1,e:'الطرق الثلاث تعطي نفس النتيجة.'},
  {q:'لو استُبدلت البوابة & في Network 7 ببوابة ≥1 (أو)، ماذا يحدث؟',o:['لا شيء','يضيء الأحمر للسيارات بمجرد وجود الطلب حتى أثناء الأصفر','لا يضيء الأحمر أبداً','يتوقف T1'],c:1,e:'مع «أو» يكفي M1.1 = 1 ليضيء Q4.3، فيضيء الأحمر مع الأصفر. لذلك يلزم «و».'}
 ]
});

/* =================== Lesson 6.5 =================== */
L6({
 id:'u6-l5',unit:6,order:5,pages:'124–125',
 title:'برنامج الإشارة بلغة STL والتنفيذ على الـ PLC',
 summary:'قائمة الأوامر سطراً سطراً (S و R و SD و NOP)، ثم المطلوب: تنفيذ البرنامج ونقله إلى الـ PLC واختبار صحة عمله.',
 theory:[
  {h:'ثالثاً: دائرة (STL) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 124',html:'<p>هذا هو البرنامج كما طُبع في الكتاب، بما فيه أسطر <span class="mono">NOP 0</span>:</p>'},
  {draw:'stl',caption:'Network 1–9 بلغة STL (منسوخة من الكتاب)',ref:'ص 124'},
  {h:'قراءة Network 1',html:`<table class="tt"><thead><tr><th>السطر</th><th>المعنى</th></tr></thead><tbody>
   <tr><td class="mono">A I 0.1</td><td>هل الضاغط S1 مضغوط؟</td></tr><tr><td class="mono">S M 1.1</td><td>إذا نعم: ثبّت M1.1 = 1</td></tr>
   <tr><td class="mono">A T 3</td><td>هل انتهى زمن T3؟</td></tr><tr><td class="mono">R M 1.1</td><td>إذا نعم: ألغِ M1.1</td></tr>
   <tr><td class="mono">A M 1.1<br>= M 1.1</td><td>خصّص M1.1 لنفسه (مثل ملف M1.1 في LAD)</td></tr></tbody></table>
   <p>لأن R مكتوبة بعد S، فإذا تحقق الشرطان معاً تكون الكلمة الأخيرة للإلغاء، تماماً مثل صندوق SR.</p>`},
  {err:'في LAD و FBD يستخدم الكتاب صندوق SR في Network 1، أما في STL فيستخدم أمرَي S و R منفصلين ثم <span class="mono">A M 1.1 / = M 1.1</span> (تخصيص M1.1 لنفسه، زائد لا يغيّر شيئاً). السلوك في الحالتين واحد لأن الإلغاء له الأولوية.'},
  {h:'قراءة Networks المزمنات',html:`<ul><li><span class="mono">A M 1.1</span> شرط التشغيل، ثم <span class="mono">L S5T#20S</span> تحميل قيمة الزمن، ثم <span class="mono">SD T 1</span> تشغيل المزمن كمزمن تأخير توصيل (S_ODT).</li>
   <li>أسطر <span class="mono">NOP 0</span> تعني «لا عملية».</li></ul>`},
  {err:'الكتاب لم يشرح أسطر <span class="mono">NOP 0</span>. هي ما يولّده برنامج STEP 7 عند تحويل صندوق مزمن أطرافه R و BI و BCD و Q فارغة إلى STL، ولا تؤثر على التشغيل. كما أن السطر الأخير من Network 6 (<span class="mono">= Q 4.2</span>) مقصوص جزئياً في الطباعة.'},
  {h:'المطلوب',ref:'ص 125',html:'<p>«تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة (PLC) واختبار صحة عمل الدائرة.»</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف تختبر صحة الدائرة:</b><ol><li>الوضع الطبيعي: Q4.1 و Q4.5 فقط.</li><li>ضغطة قصيرة على S1 تبدأ الدورة (لا يلزم الاستمرار في الضغط).</li><li>قِس الأزمنة: أصفر 20 ث، ثم أحمر سيارات + أخضر مشاة 80 ث، ثم أحمر للجميع 20 ث.</li><li>الضغط على S1 أثناء الدورة لا يؤثر.</li><li>لا يضيء الأخضر للسيارات مع الأخضر للمشاة أبداً.</li></ol>'},
  {note:'<b>للتفكير (ليس من نص الكتاب):</b> إذا ضغط أحد المشاة S1 مباشرة بعد نهاية الدورة تبدأ دورة جديدة فوراً، فيرى السائقون الأخضر لحظة قصيرة فقط. البرنامج يحقق شروط الكتاب، لكن الإشارات الحقيقية تضيف عادة زمناً أدنى للأخضر قبل قبول طلب جديد.'},
  ...TH_COMMON_IO,
  {note:LAB_NOTE}
 ],
 steps:[
  {t:'شغّل المسح البطيء',x:'افتح تبويب «برنامج الـ PLC» على عرض STL وفعّل «تشغيل المسح ببطء»: ستظهر قيمة RLO بعد كل سطر. ثم عُد إلى هنا.'},
  {t:'اختبار 1: الوضع الطبيعي',x:'تأكد أن الأخضر للسيارات Q4.1 والأحمر للمشاة Q4.5 فقط مضاءان في الشريط العلوي.',done:s=>s.Q('Q4.1')&&s.Q('Q4.5')&&!s.Q('Q4.2')},
  {t:'اختبار 2: ضغطة قصيرة',x:'انقر S1 نقرة قصيرة. يكفي ذلك لأن الأمر S يثبّت M1.1.',done:s=>s.M('M1.1')&&!s.btn('S1')},
  {t:'اختبار 3: أزمنة الأطوار',x:'راقب الزمن المتبقي في الشريط: أصفر T1، ثم عبور T2. (اختر «زمن مختصر للعرض» إن أردت).',done:s=>s.Q('Q4.4')},
  {t:'اختبار 4: الضغط أثناء الدورة',x:'اضغط S1 الآن أثناء عبور المشاة. الأمر S M 1.1 ينفذ لكن M1.1 هي 1 أصلاً فلا يتغير شيء.',done:s=>s.btn('S1')&&s.Q('Q4.4')},
  {t:'اختبار 5: نهاية الدورة',x:'انتظر T3. عند انتهائه ينفذ R M 1.1 فتعود الإشارة للوضع الطبيعي.',done:s=>!s.M('M1.1')&&s.Q('Q4.1')},
  {t:'اختبار 6: الأمان',x:'خلال كل الدورة لم يضئ Q4.1 مع Q4.4 معاً. تحقق من ذلك في المخطط الزمني الحي: نبضة Q4 لا تتقاطع أبداً مع Q1.'},
  {t:'الضغط عند النهاية تماماً',x:'جرّب: أبقِ S1 مضغوطاً حتى تنتهي الدورة. في دورة المسح التي ينتهي فيها T3 يفوز R، ثم في الدورة التالية يثبّت S الذاكرة من جديد فتبدأ دورة جديدة فوراً.'}
 ],
 quiz:[
  {q:'في Network 1 جاء الأمر R M 1.1 بعد S M 1.1. ماذا يعني ذلك إذا تحقق الشرطان معاً؟',o:['الأولوية للتثبيت','الأولوية للإلغاء لأن آخر أمر هو الذي يبقى','خطأ في البرنامج','لا يحدث شيء'],c:1,e:'الـ PLC ينفذ الأسطر بالترتيب، فالقيمة الأخيرة المكتوبة هي النتيجة.'},
  {q:'ماذا يعني الأمر SD T 1؟',o:['تصفير T1','تشغيل T1 كمزمن تأخير توصيل (S_ODT)','تشغيل T1 كمزمن نبضة','قراءة T1'],c:1,e:'SD = S_ODT، و SP = نبضة، و SF = تأخير فصل.'},
  {q:'ما وظيفة L S5T#20S قبل SD T 1؟',o:['تحميل الزمن 20 ثانية ليستخدمه المزمن','تشغيل المخرج','تأخير البرنامج كله','عدّ 20 نبضة'],c:0,e:'القيمة تُحمّل في المركم (ACCU) ثم يأخذها أمر المزمن.'},
  {q:'ماذا تعني الأسطر NOP 0؟',o:['أوقف البرنامج','لا عملية؛ يولّدها STEP 7 لأطراف الصندوق الفارغة','صفّر المخرج','انتظر ثانية'],c:1,e:'لا تؤثر على التشغيل.'},
  {q:'ضغط أحد المشاة S1 أثناء T2. ماذا يحدث؟',o:['تبدأ الدورة من جديد','لا شيء، لأن M1.1 مثبتة أصلاً','يطفأ الأخضر للمشاة','يتصفر T2'],c:1,e:'S يكتب 1 في M1.1 وهي 1 أصلاً.'},
  {q:'معنى AN T 1 في Network 6:',o:['و T1 انتهى','و T1 لم ينته بعد','أو T1','اكتب في T1'],c:1,e:'AN = و-ليس: الأصفر يبقى ما دام T1 = 0.'},
  {q:'ما أثر السطرين A M 1.1 / = M 1.1 في نهاية Network 1؟',o:['يعكسان M1.1','لا يغيّران شيئاً: يخصصان M1.1 لنفسه','يلغيان M1.1','يشغّلان T1'],c:1,e:'تقابل ملف M1.1 في LAD، وهما زائدان في STL.'},
  {q:'كم الزمن الكلي للدورة بعد الضغط على S1 في برنامج الكتاب؟',o:['20 ثانية','80 ثانية','دقيقتان (120 ثانية)','3 دقائق'],c:2,e:'20 + 80 + 20 = 120 ثانية.'}
 ]
});

})(PLCBOOK);
