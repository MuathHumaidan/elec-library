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
})())/*DCML-END*/,(window.U6ML=window.U6ML||{
/* «مختبر مصغّر» للوحدة 6: Network 1 (التخزين M1.1) و Networks 2–4 (المزمنات) من برنامج الكتاب، تُرسم حيّة بـ LAD أو FBD.
   o={view:'lad'|'fbd', intro, predict} */
 nm:{'I0.1':'S1','Q4.1':'G.C.','Q4.2':'Y.C.','Q4.3':'R.C.','Q4.4':'G.P.','Q4.5':'R.P.'},
 net(B,P,i,view){return `<div class="net static"><header><h3>Network ${i+1}</h3></header><div class="svgbox">${(view==='fbd'?B.fbdNetwork:B.ladNetwork)(P.nets[i],P,U6ML.nm).replace('<svg','<svg style="min-width:420px"')}</div></div>`},
 sr(el,B,o){const P=B.createPLC(PROG_BOOK),lt=s=>`<span class="ltr">${s}</span>`;
  return DCML.lab(el,B,{intro:o.intro,predict:o.predict,
   ins:[{k:'s1',l:'S1',sw:true,v:0,on:'S1 مضغوط '+lt('(I0.1 = 1)'),off:'S1 متروك '+lt('(I0.1 = 0)')},
    {k:'t3',l:'T3',sw:true,v:0,on:'T3 انتهى '+lt('(T3 = 1)'),off:'T3 لم ينتهِ '+lt('(T3 = 0)')}],
   calc:s=>{P.set('I0.1',s.s1);P.timer('T3').q=s.t3?1:0;P.runNet(0);const m=P.get('M1.1');
    const msg=s.s1&&s.t3?`الطرفان ${lt('S')} و ${lt('R')} عليهما ${lt('1')} معاً: الإلغاء له الأولوية، فـ ${lt('M1.1 = 0')}.`
     :s.s1?`${lt('1')} على ${lt('S')}: ثُبّتت ${lt('M1.1 = 1')} — بدأ طلب العبور. الآن اترك ${lt('S1')} ولاحظ أنها تبقى ${lt('1')}.`
     :s.t3?`${lt('1')} على ${lt('R')} (انتهى ${lt('T3')}): أُلغيت ${lt('M1.1')} — انتهت الدورة.`
     :m?`لا شيء على ${lt('S')} ولا على ${lt('R')}، فتبقى ${lt('M1.1 = 1')}: الصندوق يتذكّر الضغطة.`:`لا طلب عبور: ${lt('M1.1 = 0')} والإشارة في وضعها الطبيعي.`;
    return {pic:U6ML.net(B,P,0,o.view),facts:[['S (I0.1)',String(s.s1)],['R (T3)',String(s.t3)],['M1.1',String(m),m?'hi':'']],msg,cls:s.s1&&s.t3?'warn':''}}})},
 tm(el,B,o){const lt=s=>`<span class="ltr">${s}</span>`;
  return DCML.lab(el,B,{intro:o.intro,predict:o.predict,
   ins:[{k:'t',l:'الزمن منذ الضغط على S1',min:0,max:125,step:1,v:o.t0||0,fmt:v=>mmss(v)}],
   calc:s=>{const P=B.createPLC(PROG_BOOK);P.set('I0.1',1);P.scan(0);P.set('I0.1',0);const dt=0.25;for(let x=0;x<s.t-1e-9;x+=dt)P.scan(dt);
    const st=k=>{const T=P.timer(k);return T.q?['انتهى','1']:T.run?['يعدّ — الباقي',mmss(T.tv-T.el)]:['لا يعدّ','0']};
    const m=P.get('M1.1'),ph=!m?0:!P.get('T1')?1:!P.get('T2')?2:3;
    const facts=[['M1.1',String(m),m?'hi':''],...['T1','T2','T3'].map(k=>{const r=st(k);return [k+' '+r[0],r[1],P.timer(k).run&&!P.get(k)?'hi':'']})];
    const msg=`<b>${PH6[ph].n}</b>: ${PH6[ph].d}.`+(ph===0&&s.t>0?` انتهى ${lt('T3')} عند ${lt('2:00')} فأُلغيت ${lt('M1.1')} وتصفّرت المزمنات الثلاثة معاً.`:ph===1?` ${lt('M1.1 = 1')} على الطرف ${lt('S')} لصندوق ${lt('T1')}.`:ph===2?` ${lt('T1 = 1')} على الطرف ${lt('S')} لصندوق ${lt('T2')}.`:ph===3?` ${lt('T2 = 1')} على الطرف ${lt('S')} لصندوق ${lt('T3')}.`:'');
    return {pic:[1,2,3].map(i=>U6ML.net(B,P,i,o.view)).join(''),facts,msg}}})}
}),{intro:true}),

  {st:1,short:'ماذا ستتعلم؟',title:'ماذا ستتعلم في هذه الوحدة؟',ref:'ص 107',
   q:'إشارة مرور يعرفها كل سائق… فما الجديد الذي ستتعلمه عنها في مختبر الـ PLC؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="هدفا الوحدة السادسة، والوقت المتوقع ساعتان، ومستوى الأداء المطلوب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الهدف الأول: أن يعرف المتدرب كيف يتم عمل إشارة المرور."><rect x="50" y="52" width="260" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="66" y="62" width="22" height="42" rx="5" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="77" cy="71" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="77" cy="83" r="5" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/><circle cx="77" cy="95" r="5" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><text x="196" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">كيف تعمل إشارة المرور؟</text><text x="196" y="100" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">الهدف الأول</text></g><g data-tip="الهدف الثاني: أن يكتب المتدرب برامج للتحكم في إشارة مرور مزدوجة — بالطرق الثلاث ⟦LAD⟧ و ⟦FBD⟧ و ⟦STL⟧."><rect x="50" y="126" width="260" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="62" y="138" width="32" height="38" rx="4" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><path d="M68 148L88 148" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M68 157L84 157" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M68 166L88 166" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="196" y="154" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">برامج للتحكم في الإشارة</text><text x="196" y="174" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">الهدف الثاني</text></g><g data-tip="الوقت المتوقع للتدريب على هذه الوحدة: ساعتان."><circle cx="115" cy="236" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M115 236L115 216" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M115 236L130 244" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><circle cx="115" cy="236" r="3" fill="#2C4A40"/><text x="115" y="288" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ساعتان</text></g><g data-tip="مستوى الأداء المطلوب: أن يصل المتدرب إلى إتقان الجدارة بنسبة ⟦100٪⟧."><circle cx="245" cy="236" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="245" y="242" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100٪</text><text x="245" y="288" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">إتقان الجدارة</text></g></svg>`,
   cap:'هدفا الوحدة، والوقت المتوقع للتدريب، ومستوى الأداء المطلوب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الهدف الثاني يذكر «إشارة مرور مزدوجة». ماذا ستبرمج فعلاً في هذه الوحدة؟',opts:[
     ['إشارة تقاطع بأربعة اتجاهات تتبدّل ألوانها بالزمن وحده',false,'لا يوجد تقاطع في الوحدة؛ الطريق واحد باتجاهين وعليه ممر مشاة (الشكل 1-6).'],
     ['إشارة للسيارات ومعها إشارة للمشاة، تبدأ دورتها عندما يضغط أحد المشاة الضاغط',true,'هذا ما تشرحه الوحدة في ص 116–117: إشارة السيارات بثلاث لمبات وإشارة المشاة بلمبتين والضاغط S1.'],
     ['إشارة صفراء وامضة فقط',false,'الوحدة تستخدم اللمبات الخمس كلها: ثلاث للسيارات واثنتين للمشاة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
     <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة بإذن الله على:</p><ul><li>أن يعرف المتدرب كيف يتم عمل إشارة المرور.</li><li>أن يكتب المتدرب برامج للتحكم في إشارة مرور مزدوجة.</li></ul>
     <p><b>مستوى الأداء المطلوب:</b> أن يصل المتدرب إلى إتقان هذه الجدارة بإذن الله بنسبة 100٪.</p>
     <p><b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج – حاسب آلي – جهاز عرض (داتا شو) – سبورة – قلم.</p>
     <p><b>متطلبات الجدارة:</b> اجتياز ورشة أساسيات الكهرباء – اجتياز الرسم الفني.</p>`,ref:'ص 107'},
    {tip:String.raw`<p>هذا الدرس: كيف تعمل الإشارة وشروط تشغيلها ومخططها الزمني. الدرس الثاني: جدول المداخل والمخارج ودائرة التحكم. ثم ثلاثة دروس للبرنامج نفسه بالطرق الثلاث <span class="ltr">LAD</span> و<span class="ltr">FBD</span> و<span class="ltr">STL</span>.</p>`,title:'خريطة الوحدة'},
    {watch:String.raw`<p>رقم هذه الصفحة مطبوع في الكتاب «107»، بينما تسلسل الصفحات يقتضي أن يكون 115 (الصفحة التي بعدها 116). على الأرجح خطأ طباعي، وأبقينا الرقم كما هو مطبوع.</p>`,fix:true},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اقرأ كل عبارة عن صفحة الجدارة وقرّر: صح أم خطأ؟',items:[
     [String.raw`من أهداف الوحدة أن يكتب المتدرب برامج للتحكم في إشارة مرور مزدوجة.`,true,String.raw`هذا الهدف الثاني في صفحة الجدارة.`],
     [String.raw`ستكتب برنامج الإشارة بلغة <span class="ltr">LAD</span> فقط.`,false,String.raw`المطلوب تنفيذها بالطرق الثلاث <span class="ltr">LAD</span> و <span class="ltr">FBD</span> و <span class="ltr">STL</span>، ولكل طريقة درس في هذه الوحدة.`],
     [String.raw`متطلبات الجدارة: اجتياز ورشة أساسيات الكهرباء واجتياز الرسم الفني.`,true,String.raw`هذا نص متطلبات الجدارة.`],
     [String.raw`الوقت المتوقع للتدريب على هذه الجدارة أربع ساعات.`,false,String.raw`الوقت المتوقع في الكتاب: ساعتان.`]]})}
   ]},

  {st:2,short:'إشارة السيارات والمشاة',title:'إشارة المرور المزدوجة وإشارة المشاة',ref:'ص 116',
   q:'للسيارات ثلاث لمبات وللمشاة لمبتان فقط… ماذا تعني كل لمبة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-6: طريق باتجاهين عليه ممر مشاة وإشارتا مرور للسيارات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="22" y="134" width="316" height="72" fill="#5E716A"/><g data-tip="خط منتصف الطريق المتقطع: الطريق باتجاهين."><rect x="22" y="164.0" width="316" height="12" fill="transparent"/><path d="M22 170.0H154M206 170.0H338" fill="none" stroke="#FBF6EE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14 10"/></g><g data-tip="ممر المشاة (الخطوط البيضاء): المكان الذي يعبر منه المشاة الطريق."><rect x="160" y="134" width="40" height="72" fill="transparent"/><rect x="160" y="139" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="152" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="165" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="178" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="191" width="40" height="7" fill="#FBF6EE"/></g><rect x="58" y="141" width="44" height="22" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><rect x="84" y="144" width="8" height="16" rx="2" fill="#FBF6EE" opacity=".85"/><rect x="256" y="177" width="44" height="22" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><rect x="266" y="180" width="8" height="16" rx="2" fill="#FBF6EE" opacity=".85"/><path d="M229 124L229 134" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><rect x="214" y="40" width="30" height="84" rx="7" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><g data-tip="الحمراء: وقوف السيارات."><circle cx="229" cy="55" r="10" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الصفراء: الاستعداد لتوقف السيارات."><circle cx="229" cy="82" r="10" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الخضراء: مرور السيارات."><circle cx="229" cy="109" r="10" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><path d="M131 206L131 216" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><rect x="116" y="216" width="30" height="84" rx="7" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><g data-tip="الحمراء: وقوف السيارات."><circle cx="131" cy="231" r="10" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الصفراء: الاستعداد لتوقف السيارات."><circle cx="131" cy="258" r="10" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الخضراء: مرور السيارات."><circle cx="131" cy="285" r="10" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><text x="296" y="86" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">إشارة السيارات</text><text x="64" y="262" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">إشارة السيارات</text><text x="180" y="310" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600" direction="rtl">الشكل ⁦(1-6)⁩</text></svg>`,
   cap:'الشكل <span class="ltr">(1-6)</span>: طريق باتجاهين عليه ممر مشاة، وإشارتا مرور للسيارات عند الممر.<br><b>مرّر المؤشر على اللمبات والممر وخط المنتصف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>من المعلوم أن إشارة المرور المزدوجة لها إشارتان. كل إشارة يوجد عليها ثلاث لمبات:</p>
     <ol><li>خضراء. تعني مرور السيارات.</li><li>صفراء. تعني الاستعداد لتوقف السيارات.</li><li>حمراء. وقوف السيارات.</li></ol>
     <p>بالإضافة إلى إشارة المشاة. ولها حالتان:</p><ol><li>حمراء. تعني عدم عبور المشاة.</li><li>خضراء. تعني عبور المشاة.</li></ol><p>كما في الشكل (1-6).</p>`,ref:'ص 116'}
   ],
   body:[
    {book:String.raw`<p><b>المطلوب:</b> رسم دائرة التحكم لهذه الإشارة وتنفيذها على جهاز الحاسب الآلي باستخدام (PLC) بالطرق الثلاثة (LAD, FBD, STL).</p>
     <p>وتستخدم إشارة مرور المشاة بجوار المدارس والتجمعات السكنية، وكذلك في المناطق التي تتباعد فيها إشارات المرور عن بعضها البعض لمسافات طويلة.</p>`,ref:'ص 116'},
    {predict:{q:'حسب الكتاب، ماذا تعني الإشارة الصفراء للسيارات؟',opts:[
     ['مرور السيارات',false,'هذا معنى الخضراء.'],
     ['وقوف السيارات',false,'هذا معنى الحمراء.'],
     ['الاستعداد لتوقف السيارات',true,'«صفراء. تعني الاستعداد لتوقف السيارات» (ص 116). لذلك تأتي قبل الأحمر لتعطي السائق وقتاً ليتوقف.']]}},
    {tip:String.raw`<p>المشاة لا يحتاجون لمبة صفراء: الشخص الواقف على الرصيف يستطيع أن يتوقف فوراً، أما السيارة المسرعة فتحتاج مسافة لتتوقف؛ لذلك يأتي الأصفر للسيارات فقط.</p>`,title:'لماذا لمبتان فقط للمشاة؟'},
    {add:String.raw`<p>في شارع طويل بين تقاطعين بعيدين، أو أمام مدرسة، لا تحتاج السيارات أن تتوقف كل دقيقة. لذلك تبقى الإشارة خضراء لها، ولا تتوقف إلا عندما يطلب أحد المشاة العبور بالضغط على زر في العمود.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: ماذا تقول كل لمبة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل لمبة اضغط معناها كما في الكتاب (ص 116).',cats:['اذهب: مرور / عبور','استعد للتوقف','قف: وقوف / عدم عبور'],items:[
     ['الحمراء على إشارة السيارات',2,'«حمراء: وقوف السيارات».'],
     ['الخضراء على إشارة المشاة',0,'«خضراء: تعني عبور المشاة».'],
     ['الصفراء على إشارة السيارات',1,'«صفراء: تعني الاستعداد لتوقف السيارات». ولا توجد صفراء للمشاة.'],
     ['الحمراء على إشارة المشاة',2,'«حمراء: تعني عدم عبور المشاة».'],
     ['الخضراء على إشارة السيارات',0,'«خضراء: تعني مرور السيارات».']]})}
   ]},

  {st:3,short:'نظرية التشغيل',title:'نظرية التشغيل: الإشارة تنتظر طلب المشاة',ref:'ص 117',
   q:'لو لم يأتِ أحد ليعبر طوال اليوم، فهل تتغير الإشارة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 2-6 مبسطاً: عمود عليه إشارة المشاة والضاغط S1، وإشارة السيارات خضراء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="22" y="212" width="316" height="60" fill="#5E716A"/><g data-tip="خط منتصف الطريق المتقطع: الطريق باتجاهين."><rect x="22" y="236.0" width="316" height="12" fill="transparent"/><path d="M22 242.0H154M206 242.0H338" fill="none" stroke="#FBF6EE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14 10"/></g><g data-tip="ممر المشاة (الخطوط البيضاء): المكان الذي يعبر منه المشاة الطريق."><rect x="160" y="212" width="40" height="60" fill="transparent"/><rect x="160" y="217" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="230" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="243" width="40" height="7" fill="#FBF6EE"/><rect x="160" y="256" width="40" height="7" fill="#FBF6EE"/></g><path d="M118 62L118 212" fill="none" stroke="#51645D" stroke-width="5" stroke-linecap="round"/><rect x="103" y="62" width="30" height="56" rx="7" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><g data-tip="الحمراء للمشاة: مضاءة في الوضع الطبيعي — عدم عبور المشاة."><circle cx="118" cy="77" r="9" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الخضراء للمشاة: مطفأة في الوضع الطبيعي، وتضيء وقت عبور المشاة."><circle cx="118" cy="103" r="9" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="⟦S1⟧: ضاغط المشاة، مثبت على عمود حامل الإشارة. يضغطه من يريد عبور الطريق."><rect x="106" y="134" width="24" height="26" rx="5" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><circle cx="118" cy="147" r="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g><text x="98" y="152" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text><g data-tip="إشارة السيارات: الخضراء مضاءة في الوضع الطبيعي — مرور السيارات."><path d="M250 150L250 212" fill="none" stroke="#51645D" stroke-width="5" stroke-linecap="round"/><rect x="208" y="118" width="84" height="32" rx="7" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="224" cy="134" r="9" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="250" cy="134" r="9" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="276" cy="134" r="9" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><text x="118" y="50" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">إشارة المشاة</text><text x="250" y="106" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">إشارة السيارات</text><text x="180" y="298" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الوضع الطبيعي: أخضر للسيارات وأحمر للمشاة</text></svg>`,
   cap:'الشكل <span class="ltr">(2-6)</span> مبسطاً: إشارة المشاة والضاغط <span class="ltr">S1</span> على عمود حامل الإشارة.<br><b>مرّر المؤشر على اللمبات والضاغط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>وتعتمد نظرية تشغيل هذه الإشارات على أنه في الوضع الطبيعي تكون الإشارة خضراء لطريق السيارات، وحمراء لطريق المشاة. عند رغبة أحد المشاة عبور الطريق فإنه يقوم بالضغط على الضاغط المثبت على عمود حامل الإشارة. كما هو مبين في الشكل (2-6) حيث (S1) هي ضاغط المشاة.</p>`,ref:'ص 117'},
    {predict:{q:'لم يأتِ أي شخص ليعبر طوال ساعة كاملة. ماذا تكون الإشارة طوال هذه الساعة؟',opts:[
     ['أخضر للسيارات وأحمر للمشاة طوال الساعة',true,'هذا «الوضع الطبيعي»، ولا يتغير إلا بالضغط على S1.'],
     ['تتبدّل الألوان كل فترة ثابتة',false,'هذا سلوك الإشارة الزمنية العادية؛ إشارة المشاة هنا تنتظر الضغط على S1.'],
     ['أحمر للجميع حتى يأتي أحد',false,'في الوضع الطبيعي تكون خضراء لطريق السيارات (ص 117).']]}}
   ],
   body:[
    {tip:String.raw`<p>الإشارة العادية تدور ألوانها بالزمن وحده. أما هنا فالدورة <b>لا تبدأ إلا بطلب</b>: ضغطة واحدة على <span class="ltr">S1</span>. ولذلك يحتاج البرنامج أن «يتذكر» هذه الضغطة حتى لو رفع الشخص إصبعه فوراً، وسترى ذلك في الذاكرة <span class="ltr">M1.1</span> في الدروس القادمة.</p>`,title:'ما الفرق عن الإشارة العادية؟'},
    {watch:String.raw`<p>في الشكل (2-6) يظهر ضاغطان، واحد على كل عمود، وكلاهما باسم <span class="ltr">S1</span>، بينما جدول الدخل والخرج (ص 119) فيه مدخل واحد <span class="ltr">I0.1</span>. معنى ذلك أن الضاغطين موصولان على التوازي إلى نفس المدخل، والكتاب لم يذكر ذلك صراحة.</p>`,fix:true},
    {title:'مختبر مصغّر: ماذا يحدث لو…؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'ضغط أحد المشاة الضاغط <span class="ltr">S1</span> ثانية واحدة ثم رفع إصبعه فوراً. ماذا يحدث؟',opts:[
      ['تتوقف الدورة لحظة رفع الإصبع',false,'لو كان كذلك لاضطر الشخص أن يبقى ضاغطاً طوال الدورة.'],
      ['تبدأ الدورة وتكتمل، لأن البرنامج يتذكّر الضغطة',true,'ضغطة واحدة تكفي؛ البرنامج يحفظها في الذاكرة <span class="ltr">M1.1</span> حتى نهاية الدورة.']]},
     {q:'ضغط شخصان الضاغطين على العمودين في اللحظة نفسها. كم دورة تبدأ؟',opts:[
      ['دورتان متتاليتان',false,'الـ <span class="ltr">PLC</span> لا يرى إلا مدخلاً واحداً للضاغطين.'],
      ['دورة واحدة، لأن الضاغطين على المدخل نفسه <span class="ltr">I0.1</span>',true,'في جدول الدخل والخرج مدخل واحد <span class="ltr">I0.1</span>، فالضاغطان موصولان على التوازي إليه.']]},
     {q:'ما الذي يبدأ دورة هذه الإشارة؟',opts:[
      ['ضغطة أحد المشاة على <span class="ltr">S1</span>',true,'الإشارة تبقى أخضر للسيارات وأحمر للمشاة إلى أن يطلب أحد العبور.'],
      ['مرور زمن ثابت',false,'هذا في الإشارة العادية؛ أما هذه فتنتظر طلب المشاة.']]}]})}
   ]},

  {st:4,short:'شروط التشغيل',title:'شروط التشغيل: ثلاث فترات بعد الضغط',ref:'ص 117',
   q:'بعد أن يضغط الشخص الزر، هل يتحول الأخضر للسيارات إلى الأحمر فوراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دورة الإشارة: الوضع الطبيعي ثم T1 ثم T2 ثم T3 ثم العودة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الوضع الطبيعي: أخضر للسيارات وأحمر للمشاة، ويستمر حتى يضغط أحد المشاة ⟦S1⟧."><rect x="124" y="18" width="112" height="68" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="134" y="26" width="16" height="44" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="142" cy="34" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="142" cy="48" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="142" cy="62" r="5" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><rect x="154" y="26" width="16" height="30" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="162" cy="34" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="162" cy="48" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><text x="202" y="46" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الطبيعي</text><text x="202" y="64" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">حتى يُضغط S1</text></g><g data-tip="الشرط 1: أصفر للسيارات والمشاة ما زالت حمراء، لفترة ⟦T1⟧ كافية لاستعداد السيارات للتوقف بسهولة."><rect x="238" y="126" width="112" height="68" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="248" y="134" width="16" height="44" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="256" cy="142" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="256" cy="156" r="5" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/><circle cx="256" cy="170" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><rect x="268" y="134" width="16" height="30" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="276" cy="142" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="276" cy="156" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><text x="316" y="154" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="316" y="172" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">استعداد</text></g><g data-tip="الشرط 2: أحمر للسيارات وأخضر للمشاة في نفس اللحظة، لفترة ⟦T2⟧ كافية ليعبر المشاة الشارع."><rect x="124" y="234" width="112" height="68" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="134" y="242" width="16" height="44" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="142" cy="250" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="142" cy="264" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="142" cy="278" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><rect x="154" y="242" width="16" height="30" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="162" cy="250" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="162" cy="264" r="5" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><text x="202" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><text x="202" y="280" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">عبور</text></g><g data-tip="الشرط 3: أحمر للمشاة والسيارات ما زالت حمراء، لفترة ⟦T3⟧ حتى يخلو الطريق من المشاة."><rect x="10" y="126" width="112" height="68" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="20" y="134" width="16" height="44" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="28" cy="142" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="28" cy="156" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="28" cy="170" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><rect x="40" y="134" width="16" height="30" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="48" cy="142" r="5" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><circle cx="48" cy="156" r="5" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><text x="88" y="154" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text><text x="88" y="172" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">إخلاء</text></g><path d="M240 70L267.5623984301982 111.34359764529725" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="272.0,118.0 271.6,108.7 263.6,114.0" fill="#2C4A40"/><path d="M272 202L244.70537358140038 239.5301113255745" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="240.0,246.0 248.6,242.4 240.8,236.7" fill="#2C4A40"/><path d="M120 246L92.70537358140037 208.4698886744255" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="88.0,202.0 88.8,211.3 96.6,205.6" fill="#2C4A40"/><path d="M88 118L115.56239843019817 76.65640235470275" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="120.0,70.0 111.6,74.0 119.6,79.3" fill="#2C4A40"/><g data-tip="الضغط على ⟦S1⟧ هو الذي يبدأ الدورة. بدونه تبقى الإشارة في الوضع الطبيعي."><circle cx="272" cy="92" r="14" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><text x="272" y="96" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text></g><text x="180" y="156" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">دورة واحدة</text><text x="180" y="174" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">لكل ضغطة</text></svg>`,
   cap:'الدورة: الوضع الطبيعي ← <span class="ltr">T1</span> ← <span class="ltr">T2</span> ← <span class="ltr">T3</span> ← الوضع الطبيعي.<br><b>مرّر المؤشر على كل طور (أو المسه في الجوال) لتعرف شرطه.</b>',
   side:[
    {book:String.raw`<p>شروط التشغيل لهذه الإشارة على النحو التالي:</p>
     <ol><li>تتحول إشارة مرور السيارات من اللون الأخضر إلى اللون الأصفر بينما تبقى إشارة المشاة حمراء ويستمر ذلك لفترة من الزمن (T1) كافية لاستعداد السيارات للتوقف بسهولة.</li>
     <li>بعد انقضاء الفترة الزمنية (T1) تتحول إشارة مرور السيارات من الأصفر إلى اللون الأحمر. وفي نفس اللحظة تتحول إشارة المشاة من اللون الأحمر إلى اللون الأخضر. ويستمر ذلك لفترة من الزمن (T2) كافية ليعبر المشاة الشارع.</li>
     <li>بعد انقضاء الفترة الزمنية (T2) تتحول إشارة المشاة من اللون الأخضر إلى اللون الأحمر وتستمر إشارة مرور السيارات حمراء لفترة زمنية (T3) حتى يخلو الطريق من المشاة. بعدها تتحول إشارة السيارات إلى اللون الأخضر ويستمر الوضع هكذا حتى يأتي أحد المشاة لتبدأ دورة جديدة بعد الضغط على ضاغط إشارة مرور المشاة (S1).</li></ol>`,ref:'ص 117'}
   ],
   body:[
    {predict:{q:'انتهت الفترة T2 وتحولت إشارة المشاة إلى الأحمر. هل يعود الأخضر للسيارات في اللحظة نفسها؟',opts:[
     ['نعم، فوراً',false,'لو عاد الأخضر فوراً لانطلقت السيارات وربما ما زال شخص في منتصف الممر.'],
     ['تعود الإشارة صفراء للسيارات',false,'الأصفر يأتي مرة واحدة فقط، قبل الأحمر، في الفترة T1.'],
     ['لا: تبقى السيارات حمراء لفترة T3 حتى يخلو الطريق من المشاة',true,'الشرط الثالث في ص 117: في T3 الإشارتان حمراوان معاً.']]}},
    {title:'اختر الطور وشاهد الإشارة',widget:(el,B)=>phaseWidget(el)},
    {tip:String.raw`<ul><li><b><span class="ltr">T1</span> (الأصفر):</b> السيارة المسرعة لا تستطيع أن تقف فجأة.</li><li><b><span class="ltr">T2</span> (عبور المشاة):</b> وقت يكفي ليعبر الشخص الشارع.</li><li><b><span class="ltr">T3</span> (أحمر للجميع):</b> من دخل الممر متأخراً يكمل عبوره بأمان.</li></ul><p>ولاحظ أن الأخضر للسيارات لا يضيء مع الأخضر للمشاة أبداً.</p>`,title:'لماذا ثلاث فترات؟'}
   ]},

  {st:5,short:'المخطط الزمني',title:'المخطط الزمني: الشروط الثلاثة في رسم واحد',ref:'ص 117–118',
   q:'كيف نرسم «متى تعمل كل لمبة» لخمس لمبات في رسم واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 3-6: خمسة محاور زمنية Q1 إلى Q5 مع الفترات T1 و T2 و T3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="⟦Q1⟧: الإشارة الخضراء للسيارات."><rect x="26" y="40" width="312" height="30" fill="transparent"/><text x="44" y="59" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q1</text><path d="M70 64L338 64" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><rect x="70" y="44" width="24" height="20" fill="#3DAE6B" opacity=".22"/><rect x="310" y="44" width="22" height="20" fill="#3DAE6B" opacity=".22"/><path d="M70 44H94V64H130V64H274V64H310V44H332" fill="none" stroke="#3DAE6B" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="⟦Q2⟧: الإشارة الصفراء للسيارات."><rect x="26" y="84" width="312" height="30" fill="transparent"/><text x="44" y="103" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q2</text><path d="M70 108L338 108" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><rect x="94" y="88" width="36" height="20" fill="#D9A520" opacity=".22"/><path d="M70 108H94V88H130V108H274V108H310V108H332" fill="none" stroke="#D9A520" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="⟦Q3⟧: الإشارة الحمراء للسيارات."><rect x="26" y="128" width="312" height="30" fill="transparent"/><text x="44" y="147" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q3</text><path d="M70 152L338 152" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><rect x="130" y="132" width="144" height="20" fill="#E05A47" opacity=".22"/><rect x="274" y="132" width="36" height="20" fill="#E05A47" opacity=".22"/><path d="M70 152H94V152H130V132H274V132H310V152H332" fill="none" stroke="#E05A47" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="⟦Q4⟧: الإشارة الخضراء للمشاة."><rect x="26" y="172" width="312" height="30" fill="transparent"/><text x="44" y="191" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4</text><path d="M70 196L338 196" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><rect x="130" y="176" width="144" height="20" fill="#3DAE6B" opacity=".22"/><path d="M70 196H94V196H130V176H274V196H310V196H332" fill="none" stroke="#3DAE6B" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="⟦Q5⟧: الإشارة الحمراء للمشاة."><rect x="26" y="216" width="312" height="30" fill="transparent"/><text x="44" y="235" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5</text><path d="M70 240L338 240" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><rect x="70" y="220" width="24" height="20" fill="#E05A47" opacity=".22"/><rect x="94" y="220" width="36" height="20" fill="#E05A47" opacity=".22"/><rect x="274" y="220" width="36" height="20" fill="#E05A47" opacity=".22"/><rect x="310" y="220" width="22" height="20" fill="#E05A47" opacity=".22"/><path d="M70 220H94V220H130V240H274V220H310V220H332" fill="none" stroke="#E05A47" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="خط متقطع: لحظة الضغط على ⟦S1⟧ — بداية ⟦T1⟧."><rect x="88" y="30" width="12" height="250" fill="transparent"/><path d="M94 34V276" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/></g><g data-tip="خط متقطع: نهاية ⟦T1⟧ — يتحول الأصفر إلى أحمر ويضيء الأخضر للمشاة."><rect x="124" y="30" width="12" height="250" fill="transparent"/><path d="M130 34V276" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/></g><g data-tip="خط متقطع: نهاية ⟦T3⟧ — يعود الأخضر للسيارات."><rect x="304" y="30" width="12" height="250" fill="transparent"/><path d="M310 34V276" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/></g><g data-tip="⟦T1⟧: الفترة الزمنية اللازمة لاستعداد السيارات للتوقف بسهولة."><rect x="94" y="276" width="36" height="30" fill="transparent"/><path d="M96 284H128M96 280V288M128 280V288" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="112.0" y="300" text-anchor="middle" font-size="12" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text></g><g data-tip="⟦T2⟧: الفترة الزمنية اللازمة لعبور المشاة."><rect x="130" y="276" width="144" height="30" fill="transparent"/><path d="M132 284H272M132 280V288M272 280V288" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="202.0" y="300" text-anchor="middle" font-size="12" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text></g><g data-tip="⟦T3⟧: الفترة الزمنية اللازمة لإخلاء الطريق من المشاة."><rect x="274" y="276" width="36" height="30" fill="transparent"/><path d="M276 284H308M276 280V288M308 280V288" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="292.0" y="300" text-anchor="middle" font-size="12" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text></g><text x="94" y="26" text-anchor="middle" font-size="12" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text></svg>`,
   cap:'الشكل <span class="ltr">(3-6)</span>: محور زمني لكل مخرج، والخط المرتفع يعني أن اللمبة تعمل.<br><b>مرّر المؤشر على المحاور والخطوط المتقطعة والفترات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>وعلى ذلك يكون المخطط الزمني الذي يحقق دورة إشارة مرور المشاة كما هو موضح في الشكل (3-6).</p>`,ref:'ص 117'},
    {predict:{q:'في الشكل (3-6)، أي محورين يكون أحدهما عكس الآخر تماماً في كل لحظة؟',opts:[
     ['Q1 و Q2',false,'كلاهما مطفأ أثناء T2 و T3، فليس أحدهما عكس الآخر.'],
     ['Q4 و Q5',true,'الأحمر للمشاة Q5 ينطفئ فقط عندما يعمل الأخضر للمشاة Q4 (أثناء T2)، ويعمل في كل وقت آخر.'],
     ['Q2 و Q3',false,'كلاهما مطفأ في الوضع الطبيعي.']]}}
   ],
   body:[
    {book:String.raw`<div class="svgbox">${fig36SVG()}</div><p class="sub">الأزمنة تحت المحاور من برنامج الكتاب (ص 121–124).</p>`,ref:'ص 118'},
    {tip:String.raw`<p>اقرأ المخطط عموداً عموداً: في كل فترة انظر أي المحاور مرتفعة. هذا الجدول مستخرج من الشكل (3-6) مع الأزمنة المكتوبة في البرنامج:</p>${PHASE_TABLE}<p>الدورة كاملة بعد الضغط = <span class="ltr">20 + 80 + 20 = 120 s</span> أي دقيقتان.</p>`,title:'جدول الأطوار'},
    {title:'حرّك مؤشر الزمن',widget:(el,B)=>{
      const T1=20,T2=80,T3=20,TE=T1+T2+T3; /* أزمنة برنامج الكتاب (ص 121–124) */
      const ph=t=>t<0||t>=TE?0:t<T1?1:t<T1+T2?2:3;
      const ROWS=[['Q1','G.C.',LC.g],['Q2','Y.C.',LC.y],['Q3','R.C.',LC.r],['Q4','G.P.',LC.g],['Q5','R.P.',LC.r]];
      const X0=70,PW=560,tmin=-12,tmax=TE+12,X=t=>X0+(t-tmin)/(tmax-tmin)*PW;
      const lv=(j,k)=>PH_LAMPS[k][j];
      let t=-6;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">حرّك المؤشر على محور الزمن، وشاهد أي لمبة تعمل في كل لحظة. الأزمنة من برنامج الكتاب: <span class="ltr">T1 = 20 s</span>، <span class="ltr">T2 = 1 min 20 s</span>، <span class="ltr">T3 = 20 s</span>.</p>
       <div class="svgbox" data-o="sv" style="max-width:720px"></div>
       <label class="w-sl"><span data-o="tl"></span><input type="range" min="${tmin}" max="${tmax}" step="1" dir="ltr" value="${t}"></label>
       <div class="w-row"><span class="w-l">انتقل إلى:</span><button class="btn" type="button" data-t="-6">قبل الضغط</button><button class="btn" type="button" data-t="10">داخل T1</button><button class="btn" type="button" data-t="60">داخل T2</button><button class="btn" type="button" data-t="110">داخل T3</button></div>
       <p data-o="ph" style="margin:10px 0 4px"></p><div data-o="lp"></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const k=ph(t),xs=[tmin,0,T1,T1+T2,TE,tmax],ks=[0,1,2,3,0];
        let s=`<svg viewBox="0 0 700 250" role="img" aria-label="المخطط الزمني مع مؤشر الزمن">`;
        ROWS.forEach(([q,n,c],j)=>{const y0=40+j*40,hi=y0-20;let d='';
          ks.forEach((kk,i)=>{const y=lv(j,kk)?hi:y0;d+=(i?`V${y}`:`M${X(xs[0])} ${y}`)+`H${X(xs[i+1])}`;if(lv(j,kk))s+=`<rect x="${X(xs[i])}" y="${hi}" width="${X(xs[i+1])-X(xs[i])}" height="20" fill="${c}" opacity=".18"/>`});
          s+=S.t(12,y0-4,q,'','start')+S.t(40,y0-4,n,'m','start')+`<path d="M${X0} ${y0}H${X0+PW}" stroke="var(--line)"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2.6"/>`+`<circle cx="${X(t)}" cy="${lv(j,k)?hi:y0}" r="5" fill="${c}" stroke="var(--fg)" stroke-width="1.2"/>`});
        [0,T1,T1+T2,TE].forEach(v=>{s+=`<path d="M${X(v)} 14V222" stroke="var(--blue)" stroke-width="1" stroke-dasharray="4 4"/>`+S.t(X(v),238,v+'s','m')});
        [['T1',0,T1],['T2',T1,T1+T2],['T3',T1+T2,TE]].forEach(([l,a,b])=>{s+=S.t((X(a)+X(b))/2,12,l,'b')});
        s+=`<path d="M${X(t)} 8V226" stroke="var(--fg)" stroke-width="2"/>`;
        o('sv').innerHTML=s+'</svg>';
        o('tl').innerHTML=t<0?'قبل الضغط على <span class="ltr">S1</span>':t>=TE?'بعد انتهاء الدورة':`الزمن بعد الضغط على <span class="ltr">S1</span>: <b class="ltr">t = ${t} s</b>`;
        o('ph').innerHTML=`<b>${PH6[k].n}</b> — ${PH6[k].d}`;
        o('lp').innerHTML=`<div class="w-facts">${['الخضراء للسيارات','الصفراء للسيارات','الحمراء للسيارات','الخضراء للمشاة','الحمراء للمشاة'].map((n,j)=>`<div><span>${n} <span class="ltr">Q${j+1}</span></span><b>${lv(j,k)?'تعمل':'مطفأة'}</b></div>`).join('')}</div>`};
      rg.oninput=()=>{t=+rg.value;draw()};
      el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{t=+b.dataset.t;rg.value=t;draw()});
      draw();
    }},
    {watch:String.raw`<p>المحاور في الشكل (3-6) مسمّاة <span class="ltr">Q1</span> إلى <span class="ltr">Q5</span>، وفي البرنامج تصبح العناوين <span class="ltr">Q4.1</span> إلى <span class="ltr">Q4.5</span> (جدول ص 119).</p>`}
   ]},

  {recap:[
   String.raw`إشارة السيارات لها ثلاث لمبات (أخضر: مرور، أصفر: استعداد للتوقف، أحمر: وقوف)، وإشارة المشاة لمبتان (أحمر وأخضر) (ص 116).`,
   String.raw`في الوضع الطبيعي: أخضر للسيارات وأحمر للمشاة، ولا تبدأ الدورة إلا بالضغط على ضاغط المشاة <span class="ltr">S1</span> (ص 117).`,
   String.raw`بعد الضغط ثلاث فترات: <span class="ltr">T1</span> أصفر، ثم <span class="ltr">T2</span> أحمر للسيارات وأخضر للمشاة، ثم <span class="ltr">T3</span> أحمر للجميع، ثم يعود الأخضر للسيارات.`,
   String.raw`المخطط الزمني الشكل (3-6) يجمع الشروط في خمسة محاور <span class="ltr">Q1</span>–<span class="ltr">Q5</span>، و<span class="ltr">Q5</span> عكس <span class="ltr">Q4</span> دائماً.`]}
 ],
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 107',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على:</p><ol><li>أن يعرف كيف يتم عمل إشارة المرور.</li><li>أن يكتب برامج للتحكم في إشارة مرور مزدوجة.</li></ol>
   <p><b>مستوى الأداء:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة أساسيات الكهرباء، واجتياز الرسم الفني.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'رقم هذه الصفحة مطبوع في الكتاب «107»، بينما تسلسل الصفحات يقتضي أن يكون 115 (الصفحة التي بعدها 116). على الأرجح خطأ طباعي، وأبقينا الرقم كما هو مطبوع.'+'</div>'},
  {h:'إشارة المرور المزدوجة وإشارة المشاة',ref:'ص 116',html:`<p>«من المعلوم أن إشارة المرور المزدوجة لها إشارتان. كل إشارة يوجد عليها ثلاث لمبات»:</p>
   <ol><li><b style="color:${LC.g}">خضراء:</b> تعني مرور السيارات.</li><li><b style="color:#c99512">صفراء:</b> تعني الاستعداد لتوقف السيارات.</li><li><b style="color:${LC.r}">حمراء:</b> وقوف السيارات.</li></ol>
   <p>«بالإضافة إلى إشارة المشاة. ولها حالتان»:</p><ol><li><b style="color:${LC.r}">حمراء:</b> تعني عدم عبور المشاة.</li><li><b style="color:${LC.g}">خضراء:</b> تعني عبور المشاة.</li></ol>
   <p><b>المطلوب في الكتاب:</b> رسم دائرة التحكم لهذه الإشارة وتنفيذها على جهاز الحاسب الآلي باستخدام (PLC) بالطرق الثلاثة (LAD و FBD و STL).</p>`},
  {fig:'(1-6)',ref:'ص 116',caption:'طريق باتجاهين عليه ممر مشاة، وإشارتا مرور للسيارات عند الممر (رسم المحاكاة على غرار شكل الكتاب)',draw:()=>`<div class="svgbox" style="border-radius:10px;overflow:hidden">${sceneSVG({L:[1,0,0,0,1],cars:STATIC_CARS.normal,showPed:false})}</div>`},
  {html:'<p>«وتستخدم إشارة مرور المشاة بجوار المدارس والتجمعات السكنية، وكذلك في المناطق التي تتباعد فيها إشارات المرور عن بعضها البعض لمسافات طويلة.»</p>'},
  {h:'نظرية التشغيل',ref:'ص 117',html:'<p>«تعتمد نظرية تشغيل هذه الإشارات على أنه في <b>الوضع الطبيعي</b> تكون الإشارة <b>خضراء لطريق السيارات، وحمراء لطريق المشاة</b>. عند رغبة أحد المشاة عبور الطريق فإنه يقوم بالضغط على الضاغط المثبت على عمود حامل الإشارة» كما في الشكل (2-6)، حيث <b>S1</b> هو ضاغط المشاة.</p>'},
  {fig:'(2-6)',ref:'ص 117',caption:'إشارة المشاة بلمبتين (أحمر وأخضر) والضاغط S1 على كل عمود، مع إشارات السيارات',draw:()=>`<div class="svgbox" style="border-radius:10px;overflow:hidden">${sceneSVG({L:[1,0,0,0,1],cars:STATIC_CARS.normal,ped:{y:92}})}</div>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الشكل (2-6) يظهر ضاغطان، واحد على كل عمود، وكلاهما باسم S1، بينما جدول الدخل والخرج (ص 119) فيه مدخل واحد I0.1. معنى ذلك أن الضاغطين موصولان على التوازي إلى نفس المدخل، والكتاب لم يذكر ذلك صراحة.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'جدول الدخل والخرج',title:'جدول نقاط الدخل والخرج: عنوان لكل نقطة',ref:'ص 119',
   q:'ضاغط واحد وخمس لمبات وثلاث فترات زمنية… كم عنواناً يحتاج الـ PLC؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="وحدة PLC: مدخل واحد I0.1 للضاغط S1، وخمسة مخارج Q4.1 إلى Q4.5، وثلاثة مزمنات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="132" y="46" width="96" height="232" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="70" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><g data-tip="⟦S1⟧: ضاغط إشارة المرور (ضاغط المشاة) — المدخل الوحيد، عنوانه ⟦I0.1⟧."><rect x="26" y="140" width="28" height="30" rx="5" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><circle cx="40" cy="155" r="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="40" y="190" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text><path d="M54 155L132 155" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="98" y="148" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text></g><g data-tip="⟦G.C.⟧ = ⟦Q4.1⟧: إشارة المرور الخضراء للسيارات."><rect x="228" y="72" width="128" height="32" fill="transparent"/><path d="M228 88L290 88" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="258" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><circle cx="304" cy="88" r="12" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><text x="334" y="92" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G.C.</text></g><g data-tip="⟦Y.C.⟧ = ⟦Q4.2⟧: إشارة المرور الصفراء للسيارات."><rect x="228" y="114" width="128" height="32" fill="transparent"/><path d="M228 130L290 130" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="258" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><circle cx="304" cy="130" r="12" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/><text x="334" y="134" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y.C.</text></g><g data-tip="⟦R.C.⟧ = ⟦Q4.3⟧: إشارة المرور الحمراء للسيارات."><rect x="228" y="156" width="128" height="32" fill="transparent"/><path d="M228 172L290 172" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="258" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><circle cx="304" cy="172" r="12" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><text x="334" y="176" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R.C.</text></g><g data-tip="⟦G.P.⟧ = ⟦Q4.4⟧: إشارة المرور الخضراء للمشاة."><rect x="228" y="198" width="128" height="32" fill="transparent"/><path d="M228 214L290 214" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="258" y="208" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><circle cx="304" cy="214" r="12" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><text x="334" y="218" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G.P.</text></g><g data-tip="⟦R.P.⟧ = ⟦Q4.5⟧: إشارة المرور الحمراء للمشاة."><rect x="228" y="240" width="128" height="32" fill="transparent"/><path d="M228 256L290 256" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="258" y="250" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.5</text><circle cx="304" cy="256" r="12" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/><text x="334" y="260" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R.P.</text></g><g data-tip="⟦T1⟧: الفترة الزمنية اللازمة لاستعداد السيارات للتوقف بسهولة. مزمن داخل الـ ⟦PLC⟧ نفسه، لا يحتاج طرفاً خارجياً."><rect x="150" y="112" width="60" height="36" rx="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><circle cx="166" cy="130" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M166 130L166 124" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M166 130L171 130" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="192" y="135" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text></g><g data-tip="⟦T2⟧: الفترة الزمنية اللازمة لعبور المشاة. مزمن داخل الـ ⟦PLC⟧ نفسه، لا يحتاج طرفاً خارجياً."><rect x="150" y="162" width="60" height="36" rx="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><circle cx="166" cy="180" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M166 180L166 174" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M166 180L171 180" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="192" y="185" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text></g><g data-tip="⟦T3⟧: الفترة الزمنية اللازمة لإخلاء الطريق من المشاة. مزمن داخل الـ ⟦PLC⟧ نفسه، لا يحتاج طرفاً خارجياً."><rect x="150" y="212" width="60" height="36" rx="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><circle cx="166" cy="230" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M166 230L166 224" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M166 230L171 230" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="192" y="235" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text></g><text x="70" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مدخل</text><text x="300" y="58" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مخارج</text><text x="180" y="304" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مدخل واحد، وخمسة مخارج، وثلاثة مزمنات</text></svg>`,
   cap:'المدخل على اليسار، والمخارج الخمسة على اليمين، والمزمنات الثلاثة داخل الـ <span class="ltr">PLC</span>.<br><b>مرّر المؤشر على الضاغط واللمبات والمزمنات (أو المسها في الجوال) لتعرف عنوان كل منها.</b>',
   side:[
    {book:String.raw`<p>من الشكل (2-6 و 3-6) نجد أن:</p>
     <div class="tablebox"><table class="tt"><thead><tr><th>نقاط الدخل والخرج</th><th>الوصف</th><th>الترميز في (PLC)</th></tr></thead><tbody>
     <tr><td class="mono">S1</td><td>ضاغط إشارة المرور</td><td class="mono">I0.1</td></tr>
     <tr><td class="mono">G.C.</td><td>إشارة المرور الخضراء للسيارات</td><td class="mono">Q4.1</td></tr>
     <tr><td class="mono">Y.C.</td><td>إشارة المرور الصفراء للسيارات</td><td class="mono">Q4.2</td></tr>
     <tr><td class="mono">R.C.</td><td>إشارة المرور الحمراء للسيارات</td><td class="mono">Q4.3</td></tr>
     <tr><td class="mono">G.P.</td><td>إشارة المرور الخضراء للمشاة</td><td class="mono">Q4.4</td></tr>
     <tr><td class="mono">R.P.</td><td>إشارة المرور الحمراء للمشاة</td><td class="mono">Q4.5</td></tr>
     <tr><td class="mono">T1</td><td>الفترة الزمنية اللازمة لاستعداد السيارات للتوقف بسهولة</td><td class="mono">T1</td></tr>
     <tr><td class="mono">T2</td><td>الفترة الزمنية اللازمة لعبور المشاة</td><td class="mono">T2</td></tr>
     <tr><td class="mono">T3</td><td>الفترة الزمنية اللازمة لإخلاء الطريق من المشاة</td><td class="mono">T3</td></tr></tbody></table></div>`,ref:'ص 119'}
   ],
   body:[
    {tip:String.raw`<p>المزمنات <span class="ltr">T1</span> و<span class="ltr">T2</span> و<span class="ltr">T3</span> ليست أطرافاً موصولة بأسلاك؛ هي داخل الـ <span class="ltr">PLC</span> نفسه. ويستخدم البرنامج أيضاً علامة الذاكرة <span class="ltr">M1.1</span> لتذكّر أن أحد المشاة ضغط <span class="ltr">S1</span> (ليست في جدول الكتاب، لكنها في الشكل (4-6) باسم <span class="ltr">M1</span> وفي البرنامج).</p>`,title:'مزمنات وذاكرة داخل الـ PLC'},
    {add:String.raw`<p>الحروف المختصرة من الإنجليزية: <span class="ltr">G = Green</span> أخضر، <span class="ltr">Y = Yellow</span> أصفر، <span class="ltr">R = Red</span> أحمر، و<span class="ltr">C = Car</span> سيارة، و<span class="ltr">P = Pedestrian</span> ماشٍ. فـ <span class="ltr">R.P.</span> مثلاً = الأحمر للمشاة.</p>`,title:'أصل الاختصارات'},
    {predict:{q:'كم مزمناً يحتاج هذا التطبيق؟',opts:[
     ['مزمناً واحداً للدورة كلها',false,'الدورة فيها ثلاث فترات مختلفة، ولكل فترة نهايتها الخاصة.'],
     ['خمسة مزمنات: واحد لكل لمبة',false,'اللمبات مخارج وليست فترات زمنية.'],
     ['ثلاثة: T1 و T2 و T3، واحد لكل فترة',true,'الجدول فيه ثلاث فترات زمنية: الاستعداد للتوقف، وعبور المشاة، وإخلاء الطريق.']]}},
    {title:'اربط كل رمز بعنوانه',widget:(el,B)=>matchWidget(el)},
    {watch:String.raw`<p>في جدول ص 119 كُتب عنوان الإشارة الصفراء «<span class="ltr">Q4.٢</span>» بخلط رقم عربي، والمقصود <span class="ltr">Q4.2</span> كما يؤكده برنامج LAD و STL. كما وُصف <span class="ltr">S1</span> في الجدول بأنه «ضاغط إشارة المرور»، بينما يسميه النص «ضاغط المشاة».</p>`,fix:true}
   ]},

  {st:2,short:'دائرة التحكم',title:'دائرة التحكم: الشكل <span class="ltr">(4-6)</span> درجةً درجة',ref:'ص 119–120',
   q:'كيف تتحول الشروط الثلاثة إلى تلامسات وملفات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 4-6: دائرة التحكم بعشر درجات وبأسماء مختصرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M24 22L24 282" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><g data-tip="الدرجة 1: تلامس ⟦I1⟧ (الضاغط ⟦S1⟧ على ⟦I0.1⟧) يغذي ملف التثبيت ⟦S⟧ للذاكرة ⟦M1⟧."><rect x="24" y="21" width="330" height="26" fill="transparent"/><path d="M24 34L250 34" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="27" width="16" height="14" fill="#E6E2F8"/><path d="M56 28.0L56 40.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 28.0L68 40.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="28" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I1</text><rect x="242" y="26" width="16" height="16" fill="#E6E2F8"/><path d="M246 27.0Q239 34 246 41.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 27.0Q261 34 254 41.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="250" y="38" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><text x="266" y="38" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text></g><g data-tip="الدرجة 2: تلامس ⟦T3⟧ يغذي ملف الإلغاء ⟦R⟧ للذاكرة ⟦M1⟧ عند انتهاء ⟦T3⟧."><rect x="24" y="47" width="330" height="26" fill="transparent"/><path d="M24 60L250 60" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="53" width="16" height="14" fill="#E6E2F8"/><path d="M56 54.0L56 66.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 54.0L68 66.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="54" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text><rect x="242" y="52" width="16" height="16" fill="#E6E2F8"/><path d="M246 53.0Q239 60 246 67.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 53.0Q261 60 254 67.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="250" y="64" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="266" y="64" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text></g><g data-tip="الدرجة 3: تلامس ⟦M1⟧ يشغّل المزمن ⟦T1⟧ بقيمة ⟦20⟧."><rect x="24" y="73" width="330" height="26" fill="transparent"/><path d="M24 86L250 86" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="79" width="16" height="14" fill="#E6E2F8"/><path d="M56 80.0L56 92.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 80.0L68 92.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="80" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text><rect x="242" y="78" width="16" height="16" fill="#E6E2F8"/><path d="M246 79.0Q239 86 246 93.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 79.0Q261 86 254 93.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="90" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1 20</text></g><g data-tip="الدرجة 4: تلامس ⟦T1⟧ يشغّل المزمن ⟦T2⟧ بقيمة ⟦80⟧."><rect x="24" y="99" width="330" height="26" fill="transparent"/><path d="M24 112L250 112" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="105" width="16" height="14" fill="#E6E2F8"/><path d="M56 106.0L56 118.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 106.0L68 118.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="106" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="242" y="104" width="16" height="16" fill="#E6E2F8"/><path d="M246 105.0Q239 112 246 119.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 105.0Q261 112 254 119.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="116" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2 80</text></g><g data-tip="الدرجة 5: تلامس ⟦T2⟧ يشغّل المزمن ⟦T3⟧ بقيمة ⟦20⟧."><rect x="24" y="125" width="330" height="26" fill="transparent"/><path d="M24 138L250 138" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="131" width="16" height="14" fill="#E6E2F8"/><path d="M56 132.0L56 144.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 132.0L68 144.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="132" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><rect x="242" y="130" width="16" height="16" fill="#E6E2F8"/><path d="M246 131.0Q239 138 246 145.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 131.0Q261 138 254 145.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="142" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3 20</text></g><g data-tip="الدرجة 6: تلامس ⟦M1⟧ المغلق يغذي ⟦Q1⟧ (الخضراء للسيارات)."><rect x="24" y="151" width="330" height="26" fill="transparent"/><path d="M24 164L250 164" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="157" width="16" height="14" fill="#E6E2F8"/><path d="M56 158.0L56 170.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 158.0L68 170.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M53 171.0L71 157.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="74" y="158" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text><rect x="242" y="156" width="16" height="16" fill="#E6E2F8"/><path d="M246 157.0Q239 164 246 171.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 157.0Q261 164 254 171.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="168" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q1</text></g><g data-tip="الدرجة 7: ⟦M1⟧ مفتوح و ⟦T1⟧ مغلق يغذيان ⟦Q2⟧ (الصفراء للسيارات)."><rect x="24" y="177" width="330" height="26" fill="transparent"/><path d="M24 190L250 190" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="183" width="16" height="14" fill="#E6E2F8"/><path d="M56 184.0L56 196.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 184.0L68 196.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="184" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text><rect x="108" y="183" width="16" height="14" fill="#E6E2F8"/><path d="M110 184.0L110 196.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M122 184.0L122 196.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M107 197.0L125 183.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="128" y="184" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="242" y="182" width="16" height="16" fill="#E6E2F8"/><path d="M246 183.0Q239 190 246 197.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 183.0Q261 190 254 197.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="194" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q2</text></g><g data-tip="الدرجة 8: ⟦M1⟧ و ⟦T1⟧ مفتوحان يغذيان ⟦Q3⟧ (الحمراء للسيارات)."><rect x="24" y="203" width="330" height="26" fill="transparent"/><path d="M24 216L250 216" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="209" width="16" height="14" fill="#E6E2F8"/><path d="M56 210.0L56 222.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 210.0L68 222.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="210" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text><rect x="108" y="209" width="16" height="14" fill="#E6E2F8"/><path d="M110 210.0L110 222.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M122 210.0L122 222.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="128" y="210" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="242" y="208" width="16" height="16" fill="#E6E2F8"/><path d="M246 209.0Q239 216 246 223.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 209.0Q261 216 254 223.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="220" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q3</text></g><g data-tip="الدرجة 9: ⟦M1⟧ و ⟦T1⟧ مفتوحان و ⟦T2⟧ مغلق يغذيان ⟦Q4⟧ (الخضراء للمشاة)."><rect x="24" y="229" width="330" height="26" fill="transparent"/><path d="M24 242L250 242" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="235" width="16" height="14" fill="#E6E2F8"/><path d="M56 236.0L56 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 236.0L68 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="74" y="236" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1</text><rect x="108" y="235" width="16" height="14" fill="#E6E2F8"/><path d="M110 236.0L110 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M122 236.0L122 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="128" y="236" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="162" y="235" width="16" height="14" fill="#E6E2F8"/><path d="M164 236.0L164 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M176 236.0L176 248.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M161 249.0L179 235.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="182" y="236" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><rect x="242" y="234" width="16" height="16" fill="#E6E2F8"/><path d="M246 235.0Q239 242 246 249.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 235.0Q261 242 254 249.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="246" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4</text></g><g data-tip="الدرجة 10: تلامس ⟦Q4⟧ المغلق يغذي ⟦Q5⟧ (الحمراء للمشاة)."><rect x="24" y="255" width="330" height="26" fill="transparent"/><path d="M24 268L250 268" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="54" y="261" width="16" height="14" fill="#E6E2F8"/><path d="M56 262.0L56 274.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M68 262.0L68 274.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M53 275.0L71 261.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="74" y="262" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4</text><rect x="242" y="260" width="16" height="16" fill="#E6E2F8"/><path d="M246 261.0Q239 268 246 275.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 261.0Q261 268 254 275.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="266" y="272" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5</text></g><text x="180" y="306" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600" direction="rtl">الشكل ⁦(4-6)⁩</text></svg>`,
   cap:'الشكل <span class="ltr">(4-6)</span>: عشر درجات بأسماء مختصرة. <span class="ltr">S</span> داخل الملف = تثبيت، و<span class="ltr">R</span> = إلغاء.<br><b>مرّر المؤشر على أي درجة (أو المسها في الجوال) لتعرف ماذا تفعل.</b>',
   side:[
    {book:String.raw`<p>وعلى ذلك تكون دائرة التحكم لهذه الإشارة على النحو التالي كما في الشكل (4-6):</p>`,ref:'ص 119'},
    {predict:{q:'في الدرجة 10 يتغذى Q5 عبر تلامس مغلق من Q4. متى ينطفئ Q5؟',opts:[
     ['عندما يعمل Q4 فقط، أي أثناء T2',true,'تلامس Q4 المغلق يُفتح عندما يعمل Q4، فينقطع Q5. الأحمر للمشاة عكس الأخضر للمشاة.'],
     ['طوال الدورة بعد الضغط',false,'Q5 يعمل أثناء T1 و T3؛ ينطفئ أثناء T2 فقط.'],
     ['في الوضع الطبيعي',false,'في الوضع الطبيعي Q4 مطفأ فتلامسه المغلق يمرّر، فيعمل Q5.']]}}
   ],
   body:[
    {tip:String.raw`<ol><li><b><span class="ltr">I1</span> ← تثبيت <span class="ltr">M1</span>:</b> ضغطة واحدة تثبّت الذاكرة (تبقى بعد رفع الإصبع).</li>
     <li><b><span class="ltr">T3</span> ← إلغاء <span class="ltr">M1</span>:</b> عند انتهاء <span class="ltr">T3</span> تُلغى الذاكرة فتنتهي الدورة.</li>
     <li><b><span class="ltr">M1</span> ← المزمن <span class="ltr">T1 = 20</span>:</b> يبدأ مع الطلب.</li>
     <li><b><span class="ltr">T1</span> ← المزمن <span class="ltr">T2 = 80</span>:</b> يبدأ عند انتهاء <span class="ltr">T1</span>.</li>
     <li><b><span class="ltr">T2</span> ← المزمن <span class="ltr">T3 = 20</span>:</b> يبدأ عند انتهاء <span class="ltr">T2</span>.</li>
     <li><b><span class="ltr">M1</span> مغلق ← <span class="ltr">Q1</span>:</b> الأخضر للسيارات ما دام لا يوجد طلب.</li>
     <li><b><span class="ltr">M1</span> مفتوح و<span class="ltr">T1</span> مغلق ← <span class="ltr">Q2</span>:</b> الأصفر من بداية الطلب حتى انتهاء <span class="ltr">T1</span>.</li>
     <li><b><span class="ltr">M1</span> و<span class="ltr">T1</span> ← <span class="ltr">Q3</span>:</b> الأحمر للسيارات بعد <span class="ltr">T1</span> حتى نهاية الدورة.</li>
     <li><b><span class="ltr">M1</span> و<span class="ltr">T1</span> و<span class="ltr">T2</span> مغلق ← <span class="ltr">Q4</span>:</b> الأخضر للمشاة بين نهاية <span class="ltr">T1</span> ونهاية <span class="ltr">T2</span>.</li>
     <li><b><span class="ltr">Q4</span> مغلق ← <span class="ltr">Q5</span>:</b> الأحمر للمشاة كلما كان الأخضر مطفأ.</li></ol>
     <p>«تلامس <span class="ltr">T1</span> المفتوح» يعني: يُغلق عندما ينتهي زمن <span class="ltr">T1</span>.</p>`,title:'اقرأ الدرجات العشر'},
    {tip:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>في الشكل (4-6)</th><th>I1</th><th>M1</th><th>T1 20</th><th>T2 80</th><th>T3 20</th><th>Q1…Q5</th></tr></thead><tbody><tr><td>في البرنامج</td><td class="mono">I0.1</td><td class="mono">M1.1</td><td class="mono">S5T#20S</td><td class="mono">S5T#1M20S</td><td class="mono">S5T#20S</td><td class="mono">Q4.1…Q4.5</td></tr></tbody></table></div>`,title:'الأسماء المختصرة والعناوين الحقيقية'},
    {title:'اختر اللحظة وتابع الدرجات',widget:(el,B)=>{
      const R=[[[['I1',0]],'S M1'],[[['T3',0]],'R M1'],[[['M1',0]],'T1 20'],[[['T1',0]],'T2 80'],[[['T2',0]],'T3 20'],[[['M1',1]],'Q1'],[[['M1',0],['T1',1]],'Q2'],[[['M1',0],['T1',0]],'Q3'],[[['M1',0],['T1',0],['T2',1]],'Q4'],[[['Q4',1]],'Q5']];
      const ST=[['الوضع الطبيعي',{I1:0,M1:0,T1:0,T2:0,T3:0}],['لحظة الضغط على S1',{I1:1,M1:0,T1:0,T2:0,T3:0}],['T1: أصفر',{I1:0,M1:1,T1:0,T2:0,T3:0}],['T2: عبور المشاة',{I1:0,M1:1,T1:1,T2:0,T3:0}],['T3: إخلاء الطريق',{I1:0,M1:1,T1:1,T2:1,T3:0}],['لحظة انتهاء T3',{I1:0,M1:1,T1:1,T2:1,T3:1}]];
      const NOTE=['الدرجة 6 (Q1) والدرجة 10 (Q5) فقط موصلتان: أخضر للسيارات وأحمر للمشاة.','تلامس I1 أُغلق فتغذّى ملف التثبيت S M1 في الدرجة 1. من اللحظة التالية تصبح M1 = 1 حتى لو رفع الشخص إصبعه.','M1 = 1: الدرجة 3 تشغّل T1، والدرجة 7 تشغّل Q2 (الأصفر) لأن تلامس T1 المغلق لم يُفتح بعد. Q1 انطفأ.','انتهى T1: أُغلق تلامسه المفتوح فعملت الدرجات 4 (T2) و 8 (Q3) و 9 (Q4)، وانقطعت 7 (Q2). وQ5 انطفأ لأن تلامس Q4 المغلق فُتح.','انتهى T2: فُتح تلامسه المغلق في الدرجة 9 فانطفأ Q4، فعاد Q5. والدرجة 5 تشغّل T3.','انتهى T3: الدرجة 2 تغذي ملف الإلغاء R M1، فتعود M1 = 0 وتتصفّر المزمنات ويعود الوضع الطبيعي.'];
      let k=0;
      const draw=()=>{const v=Object.assign({},ST[k][1]);
        const rows=R.map(([cs,coil],i)=>{const ok=cs.map(([n,nc])=>nc?!v[n]:!!v[n]);const on=ok.every(x=>x);if(coil==='Q4')v.Q4=on?1:0;
          const chip=(t,a)=>`<span class="ltr mono" style="display:inline-block;padding:2px 8px;margin:2px;border-radius:8px;border:1.5px solid ${a?'var(--on)':'var(--line)'};background:${a?'var(--on-soft)':'var(--surface-2)'}">${t}</span>`;
          return `<tr><td>${i+1}</td><td dir="ltr" style="text-align:center">${cs.map(([n,nc],j)=>chip(n+(nc?' -|/|-':' -| |-'),ok[j])).join(' ')}</td><td>${chip('-( )- '+coil,on)}</td></tr>`}).join('');
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg" style="flex-wrap:wrap">${ST.map((s,i)=>`<button type="button" dir="rtl" style="font-family:var(--font)" data-k="${i}" aria-pressed="${i===k}">${s[0]}</button>`).join('')}</span></div>
         <div class="tablebox" style="margin-top:10px"><table class="tt" style="font-size:13px"><thead><tr><th>الدرجة</th><th>التلامسات</th><th>الملف</th></tr></thead><tbody>${rows}</tbody></table></div>
         <p class="sub" style="margin-top:8px">${NOTE[k]} <br>الأخضر = تلامس يمرّر التيار / ملف متغذٍّ. <span class="ltr">-| |-</span> تلامس مفتوح، و<span class="ltr">-|/|-</span> تلامس مغلق.</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()})};
      draw();
    }},
    {watch:String.raw`<p>الشكل (4-6) يستخدم أسماء مختصرة (<span class="ltr">I1</span> و<span class="ltr">M1</span> و<span class="ltr">Q1…Q5</span>) بدل العناوين الحقيقية، وفوق ملف التثبيت مكتوب «<span class="ltr">S1</span>» بمعنى <span class="ltr">Set M1</span>، وقد يُقرأ خطأً كأنه الضاغط <span class="ltr">S1</span>. كما أن المطلوب في ص 116 «رسم دائرة التحكم»، والمقدَّم مخطط سلّمي وليس دائرة كونتاكتورات.</p>`,fix:true}
   ]},

  {recap:[
   String.raw`مدخل واحد: <span class="ltr">S1 = I0.1</span>، وخمسة مخارج <span class="ltr">Q4.1</span>–<span class="ltr">Q4.5</span> (ثلاثة للسيارات واثنان للمشاة)، وثلاثة مزمنات <span class="ltr">T1</span> و<span class="ltr">T2</span> و<span class="ltr">T3</span> (ص 119).`,
   String.raw`الذاكرة <span class="ltr">M1</span> (في البرنامج <span class="ltr">M1.1</span>) تُثبَّت بالضاغط وتُلغى عند انتهاء <span class="ltr">T3</span>، فتتذكر طلب العبور طوال الدورة.`,
   String.raw`المزمنات متسلسلة في الشكل (4-6): <span class="ltr">M1</span> يبدأ <span class="ltr">T1</span>، وانتهاء <span class="ltr">T1</span> يبدأ <span class="ltr">T2</span>، وانتهاء <span class="ltr">T2</span> يبدأ <span class="ltr">T3</span>.`,
   String.raw`كل لمبة درجة: تلامسات <span class="ltr">M1</span> و<span class="ltr">T1</span> و<span class="ltr">T2</span> تحدد الطور، و<span class="ltr">Q5</span> يتغذى عبر تلامس <span class="ltr">Q4</span> المغلق.`]}
 ],
 theory:[
  ...TH_COMMON_IO,
  {html:`<ul><li><b>مدخل واحد:</b> الضاغط S1 على <span class="mono">I0.1</span>.</li><li><b>خمسة مخارج:</b> ثلاث لمبات للسيارات <span class="mono">Q4.1–Q4.3</span> ولمبتان للمشاة <span class="mono">Q4.4–Q4.5</span>.</li><li><b>ثلاثة مزمنات:</b> T1 و T2 و T3 للفترات الثلاث.</li><li>ويستخدم البرنامج أيضاً علامة الذاكرة <span class="mono">M1.1</span> لتذكّر أن أحد المشاة ضغط S1 (ليست في جدول الكتاب، لكنها في الشكل (4-6) باسم M1 وفي البرنامج).</li></ul>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في جدول ص 119 كُتب عنوان الإشارة الصفراء «Q4.٢» بخلط رقم عربي، والمقصود <span class="mono">Q4.2</span> كما يؤكده برنامج LAD و STL. كما وُصف S1 في الجدول بأنه «ضاغط إشارة المرور»، بينما يسميه النص «ضاغط المشاة».'+'</div>'},
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الشكل (4-6) يستخدم أسماء مختصرة (I1 و M1 و Q1…Q5) بدل العناوين الحقيقية، وفوق ملف التثبيت مكتوب «S1» بمعنى Set M1، وقد يُقرأ خطأً كأنه الضاغط S1. كما أن المطلوب في ص 116 «رسم دائرة التحكم»، والمقدَّم مخطط سلّمي وليس دائرة كونتاكتورات.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'Network 1: صندوق SR',title:'<span class="ltr">Network 1</span>: صندوق <span class="ltr">SR</span> يتذكّر طلب العبور',ref:'ص 121',
   q:'الشخص يضغط الزر ثانية واحدة ثم يرفع إصبعه… فكيف تستمر الدورة دقيقتين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الذاكرة M1.1 تصبح 1 بضغطة قصيرة على S1 وتبقى حتى انتهاء T3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="⟦S1⟧ على ⟦I0.1⟧: ضغطة قصيرة واحدة تكفي."><rect x="30" y="40" width="300" height="64" fill="transparent"/><path d="M40 96L332 96" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><path d="M40 96H90V64H108V96H270V96H288V96H330" fill="none" stroke="#D9A520" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="56" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1 (I0.1)</text></g><g data-tip="⟦T3⟧: يصبح 1 عند انتهاء زمنه في آخر الدورة."><rect x="30" y="112" width="300" height="64" fill="transparent"/><path d="M40 168L332 168" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><path d="M40 168H90V168H108V168H270V136H288V168H330" fill="none" stroke="#3A6FB0" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="128" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text></g><g data-tip="⟦M1.1⟧: يبقى 1 من الضغطة حتى انتهاء ⟦T3⟧ — هذا معنى «التخزين»."><rect x="30" y="184" width="300" height="64" fill="transparent"/><path d="M40 240L332 240" fill="none" stroke="#8FA39B" stroke-width="1.2" stroke-linecap="round"/><path d="M40 240H90V208H108V208H270V208H288V240H330" fill="none" stroke="#12855A" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="200" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text></g><g data-tip="الطرف ⟦S⟧ (الإبقاء): الضغطة على ⟦S1⟧ تجعل ⟦M1.1⟧ = 1."><rect x="80" y="40" width="40" height="260" fill="transparent"/><path d="M99 60V250" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/><text x="99" y="272" text-anchor="middle" font-size="13" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">S</text></g><g data-tip="الطرف ⟦R⟧ (الإلغاء): انتهاء ⟦T3⟧ يجعل ⟦M1.1⟧ = 0 فتنتهي الدورة."><rect x="259" y="40" width="40" height="260" fill="transparent"/><path d="M279 60V250" fill="none" stroke="#3A6FB0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/><text x="279" y="272" text-anchor="middle" font-size="13" fill="#2B4F80" font-weight="700" font-family="var(--mono)" direction="ltr">R</text></g><text x="180" y="304" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الذاكرة تتذكّر طلب العبور</text></svg>`,
   cap:'ضغطة قصيرة على <span class="ltr">S1</span> تجعل <span class="ltr">M1.1 = 1</span>، ويبقى كذلك حتى ينتهي <span class="ltr">T3</span>.<br><b>مرّر المؤشر على المحاور والخطين المتقطعين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>أولاً: دائرة (LAD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</b></p>`,ref:'ص 121'}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 440 150" role="img" aria-label="Network 1"><text class="txt b" x="8" y="18" text-anchor="start">Network 1</text><path class="w " d="M14 30V138"/><path class="w " d="M14 62H63"/><path class="sym" d="M63 51V73M77 51V73"/><text class="txt " x="70" y="46" text-anchor="middle">I0.1</text><path class="w " d="M77 62H170"/><path class="w " d="M14 112H115"/><path class="sym" d="M115 101V123M129 101V123"/><text class="txt " x="122" y="96" text-anchor="middle">T3</text><path class="w " d="M129 112H170"/><rect class="fbox" x="170" y="44" width="96" height="88" rx="3"/><text class="txt " x="218" y="38" text-anchor="middle">M1.1</text><text class="txt " x="218" y="62" text-anchor="b">SR</text><text class="txt " x="178" y="66" text-anchor="start">S</text><text class="txt " x="178" y="116" text-anchor="start">R</text><text class="txt " x="258" y="66" text-anchor="end">Q</text><path class="w " d="M266 62H384"/><path class="sym" d="M386 51Q378 62 386 73M398 51Q406 62 398 73"/><text class="txt " x="392" y="45" text-anchor="middle">M1.1</text></svg></div>`,ref:'ص 121'},
    {tip:String.raw`<p>صندوق <span class="ltr">SR</span> هو «دالة التخزين مع الإلغاء والإبقاء»، وعنوانه المكتوب فوقه <span class="ltr">M1.1</span>:</p>
     <ul><li><b>الطرف <span class="ltr">S</span> (الإبقاء):</b> يأتيه تلامس <span class="ltr">I0.1</span> (الضاغط <span class="ltr">S1</span>). إشارة 1 عليه تجعل <span class="ltr">M1.1 = 1</span>، ويبقى 1 بعد رفع الإصبع.</li>
     <li><b>الطرف <span class="ltr">R</span> (الإلغاء):</b> يأتيه تلامس <span class="ltr">T3</span>. عند انتهاء <span class="ltr">T3</span> يصبح <span class="ltr">M1.1 = 0</span>.</li>
     <li><b>الخرج <span class="ltr">Q</span>:</b> حالة الذاكرة، ويذهب إلى ملف <span class="ltr">M1.1</span>.</li></ul>
     <p>هذه Network واحدة تقوم بعمل الدرجتين 1 و 2 في الشكل (4-6): التثبيت والإلغاء.</p>`,title:'أطراف الصندوق'},
    {predict:{q:'وصل 1 إلى الطرفين S و R في نفس اللحظة. ما حالة M1.1؟',opts:[
     [String.raw`<span class="ltr">1</span>، لأن S مكتوب أولاً`,false,'ترتيب الطرفين في الرسم لا يعطي الأولوية.'],
     [String.raw`<span class="ltr">0</span>، لأن الإلغاء R له الأولوية في صندوق SR`,true,'في صندوق SR الأولوية للإلغاء، فإذا تحقق الشرطان معاً تكون النتيجة 0.'],
     ['تتبدّل بين 0 و 1',false,'الصندوق يعطي نتيجة واحدة ثابتة في كل دورة مسح.']]}},
    {add:String.raw`<p>هذا يشبه جرس الطلب في المطعم: تضغطه مرة واحدة فيضيء رقمك على اللوحة ويبقى مضيئاً حتى يُخدم طلبك، مهما رفعت يدك عن الزر.</p>`,title:'تشبيه'},
    {watch:String.raw`<p>في تبويب المختبر تُرسم Network 1 بملفّين منفصلين <span class="ltr">S</span> و<span class="ltr">R</span> بدل صندوق <span class="ltr">SR</span>، لأن المحاكاة تُبنى من برنامج <span class="ltr">STL</span> (ص 124). السلوك واحد: الإلغاء له الأولوية في الحالتين.</p>`},
    {title:'مختبر مصغّر: شغّل صندوق SR',widget:(el,B)=>U6ML.sr(el,B,{view:'lad',intro:'هذه <span class="ltr">Network 1</span> من البرنامج (مرسومة بملفّي <span class="ltr">S</span> و <span class="ltr">R</span> كما في المختبر). غيّر الطرفين واحداً واحداً وراقب <span class="ltr">M1.1</span>. الخطوط الملونة = إشارة <span class="ltr">1</span> تمر.',
      predict:{q:String.raw`ضغطت <span class="ltr">S1</span> فصارت <span class="ltr">M1.1 = 1</span>، ثم رفعت إصبعك و <span class="ltr">T3</span> لم ينتهِ. ما قيمة <span class="ltr">M1.1</span>؟`,opts:[
       [String.raw`<span class="ltr">0</span>، لأن <span class="ltr">I0.1</span> رجع <span class="ltr">0</span>`,false,String.raw`هذا سلوك ملف عادي؛ صندوق <span class="ltr">SR</span> يحفظ حالته.`],
       [String.raw`<span class="ltr">1</span>، حتى يصل <span class="ltr">1</span> إلى طرف <span class="ltr">R</span>`,true,String.raw`الصندوق يتذكّر الضغطة، ولا يلغيها إلا انتهاء <span class="ltr">T3</span>.`]]}})}
   ]},

  {st:2,short:'Networks 2–4: المزمنات',title:'<span class="ltr">Networks 2–4</span>: ثلاثة مزمنات <span class="ltr">S_ODT</span> متتالية',ref:'ص 121',
   q:'كيف يعرف المزمن T2 متى يبدأ العدّ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سلسلة المزمنات: M1.1 يبدأ T1، وانتهاء T1 يبدأ T2، وانتهاء T2 يبدأ T3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="152" r="146" fill="#FBE6C4"/><g data-tip="الذاكرة ⟦M1.1⟧: عندما تصبح 1 يبدأ ⟦T1⟧ العدّ (Network 2)."><rect x="120" y="30" width="120" height="40" rx="12" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="55" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text></g><g data-tip="Network 2: المزمن ⟦T1⟧، ⟦TV = S5T#20S⟧ أي 20 ثانية — فترة الأصفر. يدخل عليه ⟦M1.1⟧."><rect x="90" y="94" width="180" height="48" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="116" cy="118" r="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M116 118L116 110" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M116 118L122 121" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="140" y="115" text-anchor="start" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="140" y="133" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S5T#20S</text></g><g data-tip="Network 3: المزمن ⟦T2⟧، ⟦TV = S5T#1M20S⟧ أي دقيقة و 20 ثانية — فترة عبور المشاة. يدخل عليه تلامس ⟦T1⟧."><rect x="90" y="162" width="180" height="48" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="116" cy="186" r="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M116 186L116 178" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M116 186L122 189" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="140" y="183" text-anchor="start" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><text x="140" y="201" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S5T#1M20S</text></g><g data-tip="Network 4: المزمن ⟦T3⟧، ⟦TV = S5T#20S⟧ أي 20 ثانية — فترة إخلاء الطريق. يدخل عليه تلامس ⟦T2⟧."><rect x="90" y="230" width="180" height="48" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="116" cy="254" r="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M116 254L116 246" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><path d="M116 254L122 257" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="140" y="251" text-anchor="start" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text><text x="140" y="269" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S5T#20S</text></g><path d="M180 70L180.0 86.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="180.0,94.0 184.8,86.0 175.2,86.0" fill="#2C4A40"/><path d="M180 142L180.0 154.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="180.0,162.0 184.8,154.0 175.2,154.0" fill="#2C4A40"/><path d="M180 210L180.0 222.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="180.0,230.0 184.8,222.0 175.2,222.0" fill="#2C4A40"/><text x="300" y="128" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">ينتهي</text><text x="300" y="143" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">فيبدأ</text><text x="300" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="500" direction="rtl">التالي</text></svg>`,
   cap:'كل مزمن يبدأ عندما ينتهي الذي قبله، مثل سباق التتابع.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف الـ <span class="ltr">Network</span> التي تمثلها.</b>',
   side:[
    {predict:{q:'متى يبدأ المزمن T2 العدّ؟',opts:[
     ['مع الضغط على S1 مباشرة',false,'مع الضغط يبدأ T1 فقط، لأن مدخله M1.1.'],
     ['عند انتهاء T3',false,'انتهاء T3 يلغي M1.1 فتتصفّر المزمنات كلها.'],
     ['عندما ينتهي T1، لأن تلامس T1 هو الذي يدخل على الطرف S لصندوق T2',true,'Network 3: تلامس T1 ← الطرف S للمزمن T2.']]}}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 400 450" role="img" aria-label="Networks 2 إلى 4"><text class="txt b" x="8" y="18" text-anchor="start">Network 2</text><path class="w " d="M14 28V140"/><path class="w " d="M14 50H63"/><path class="sym" d="M63 39V61M77 39V61"/><text class="txt " x="70" y="34" text-anchor="middle">M1.1</text><path class="w " d="M77 50H190"/><rect class="fbox" x="190" y="32" width="120" height="108" rx="3"/><text class="txt " x="250" y="26" text-anchor="middle">T1</text><text class="txt " x="250" y="50" text-anchor="b">S_ODT</text><text class="txt " x="196" y="54" text-anchor="start">S</text><text class="txt " x="196" y="94" text-anchor="start">TV</text><text class="txt " x="196" y="132" text-anchor="start">R</text><text class="txt " x="304" y="54" text-anchor="end">Q</text><text class="txt " x="304" y="94" text-anchor="end">BI</text><text class="txt " x="304" y="132" text-anchor="end">BCD</text><path class="w " d="M170 90H190"/><text class="txt " x="166" y="94" text-anchor="end">S5T#20S</text><path class="w " d="M170 128H190"/><text class="txt m" x="166" y="132" text-anchor="end">...</text><path class="w " d="M310 50H350"/><path class="w " d="M310 90H330"/><text class="txt m" x="334" y="94" text-anchor="start">...</text><path class="w " d="M310 128H330"/><text class="txt m" x="334" y="132" text-anchor="start">...</text><text class="txt b" x="8" y="168" text-anchor="start">Network 3</text><path class="w " d="M14 178V290"/><path class="w " d="M14 200H63"/><path class="sym" d="M63 189V211M77 189V211"/><text class="txt " x="70" y="184" text-anchor="middle">T1</text><path class="w " d="M77 200H190"/><rect class="fbox" x="190" y="182" width="120" height="108" rx="3"/><text class="txt " x="250" y="176" text-anchor="middle">T2</text><text class="txt " x="250" y="200" text-anchor="b">S_ODT</text><text class="txt " x="196" y="204" text-anchor="start">S</text><text class="txt " x="196" y="244" text-anchor="start">TV</text><text class="txt " x="196" y="282" text-anchor="start">R</text><text class="txt " x="304" y="204" text-anchor="end">Q</text><text class="txt " x="304" y="244" text-anchor="end">BI</text><text class="txt " x="304" y="282" text-anchor="end">BCD</text><path class="w " d="M170 240H190"/><text class="txt " x="166" y="244" text-anchor="end">S5T#1M20S</text><path class="w " d="M170 278H190"/><text class="txt m" x="166" y="282" text-anchor="end">...</text><path class="w " d="M310 200H350"/><path class="w " d="M310 240H330"/><text class="txt m" x="334" y="244" text-anchor="start">...</text><path class="w " d="M310 278H330"/><text class="txt m" x="334" y="282" text-anchor="start">...</text><text class="txt b" x="8" y="318" text-anchor="start">Network 4</text><path class="w " d="M14 328V440"/><path class="w " d="M14 350H63"/><path class="sym" d="M63 339V361M77 339V361"/><text class="txt " x="70" y="334" text-anchor="middle">T2</text><path class="w " d="M77 350H190"/><rect class="fbox" x="190" y="332" width="120" height="108" rx="3"/><text class="txt " x="250" y="326" text-anchor="middle">T3</text><text class="txt " x="250" y="350" text-anchor="b">S_ODT</text><text class="txt " x="196" y="354" text-anchor="start">S</text><text class="txt " x="196" y="394" text-anchor="start">TV</text><text class="txt " x="196" y="432" text-anchor="start">R</text><text class="txt " x="304" y="354" text-anchor="end">Q</text><text class="txt " x="304" y="394" text-anchor="end">BI</text><text class="txt " x="304" y="432" text-anchor="end">BCD</text><path class="w " d="M170 390H190"/><text class="txt " x="166" y="394" text-anchor="end">S5T#20S</text><path class="w " d="M170 428H190"/><text class="txt m" x="166" y="432" text-anchor="end">...</text><path class="w " d="M310 350H350"/><path class="w " d="M310 390H330"/><text class="txt m" x="334" y="394" text-anchor="start">...</text><path class="w " d="M310 428H330"/><text class="txt m" x="334" y="432" text-anchor="start">...</text></svg></div>`,ref:'ص 121'},
    {tip:String.raw`<p><span class="ltr">S_ODT</span> مزمن <b>تأخير التوصيل</b>: يبدأ العدّ عندما يصير <span class="ltr">S = 1</span>، ويصبح خرجه (وتلامسه) 1 بعد انتهاء الزمن <span class="ltr">TV</span> ما دام <span class="ltr">S</span> ما زال 1. إذا رجع <span class="ltr">S</span> إلى 0 يتصفّر المزمن فوراً. لذلك عندما تُلغى <span class="ltr">M1.1</span> في نهاية الدورة تتصفّر <span class="ltr">T1</span> ثم <span class="ltr">T2</span> ثم <span class="ltr">T3</span> معاً.</p>
     <p>أطراف الصندوق: <span class="ltr">TV</span> الزمن المحدد، و<span class="ltr">R</span> تصفير المزمن، و<span class="ltr">BI</span> و<span class="ltr">BCD</span> الزمن المتبقي بصيغتين رقميتين. في الكتاب <span class="ltr">R</span> و<span class="ltr">BI</span> و<span class="ltr">BCD</span> فارغة (<span class="ltr">...</span>).</p>`,title:'كيف يعمل S_ODT؟'},
    {tip:String.raw`<p><span class="ltr">S5T#20S</span> = 20 ثانية، و<span class="ltr">S5T#1M20S</span> = دقيقة و 20 ثانية (<span class="ltr">M</span> دقائق و<span class="ltr">S</span> ثوانٍ). وهي القيم 20 و 80 المكتوبة بجانب المزمنات في الشكل (4-6).</p>`,title:'كيف تقرأ TV؟'},
    {watch:String.raw`<p>مخرج <span class="ltr">Q</span> لصناديق المزمنات في الكتاب غير موصول بأي ملف، والمزمنات تُستخدم بتلامساتها <span class="ltr">T1</span> و<span class="ltr">T2</span> و<span class="ltr">T3</span> في الشبكات الأخرى. هذا صحيح ولا يغيّر شيئاً، لكنه قد يربك المبتدئ.</p>`,fix:true},
    {title:'مختبر مصغّر: حرّك الزمن وتابع المزمنات',widget:(el,B)=>U6ML.tm(el,B,{view:'lad',intro:'المنزلق هو الزمن منذ ضغطة قصيرة على <span class="ltr">S1</span>، بأزمنة الكتاب. تابع أي مزمن يعدّ، ومتى يصبح تلامسه <span class="ltr">1</span>.',
      predict:{q:String.raw`بعد <span class="ltr">30</span> ثانية من الضغط على <span class="ltr">S1</span>، أيّ المزمنات يعدّ الآن؟`,opts:[
       [String.raw`<span class="ltr">T1</span>`,false,String.raw`<span class="ltr">T1</span> زمنه <span class="ltr">20</span> ثانية، فقد انتهى وصار <span class="ltr">1</span>.`],
       [String.raw`<span class="ltr">T2</span>`,true,String.raw`<span class="ltr">T1</span> انتهى عند <span class="ltr">20</span> ثانية فبدأ <span class="ltr">T2</span>، وزمنه دقيقة و <span class="ltr">20</span> ثانية.`],
       [String.raw`<span class="ltr">T3</span>`,false,String.raw`<span class="ltr">T3</span> لا يبدأ إلا بعد انتهاء <span class="ltr">T2</span>، أي بعد <span class="ltr">100</span> ثانية من الضغط.`]]}})}
   ]},

  {st:3,short:'Networks 5–9: المخارج',title:'<span class="ltr">Networks 5–9</span>: لكل لمبة <span class="ltr">Network</span>',ref:'ص 122',
   q:'كيف يعرف البرنامج أي لمبة يضيء الآن، إذا كانت عنده M1.1 و T1 و T2 فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Networks 5 إلى 9 بلغة LAD: تلامسات M1.1 و T1 و T2 و Q4.4 تغذي المخارج الخمسة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="166" r="148" fill="#DDEFE6"/><g data-tip="Network 5: ⟦M1.1⟧ مغلق ← ⟦Q4.1⟧ الأخضر للسيارات: يعمل ما دام لا يوجد طلب عبور."><rect x="14" y="26" width="340" height="50" fill="transparent"/><path d="M26 36L26 68" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M26 52L240 52" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="14" y="56" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">5</text><rect x="52" y="44" width="16" height="16" fill="#DDEFE6"/><path d="M54 45.0L54 59.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M66 45.0L66 59.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M51 60.0L69 44.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="60" y="39" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><rect x="232" y="43" width="16" height="18" fill="#DDEFE6"/><path d="M236 44.0Q229 52 236 60.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M244 44.0Q251 52 244 60.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="38" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><text x="262" y="56" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G.C.</text><circle cx="320" cy="52" r="10" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 6: ⟦M1.1⟧ و ⟦T1⟧ مغلق ← ⟦Q4.2⟧ الأصفر: من الضغطة حتى انتهاء ⟦T1⟧."><rect x="14" y="78" width="340" height="50" fill="transparent"/><path d="M26 88L26 120" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M26 104L240 104" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="14" y="108" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">6</text><rect x="52" y="96" width="16" height="16" fill="#DDEFE6"/><path d="M54 97.0L54 111.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M66 97.0L66 111.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="91" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><rect x="110" y="96" width="16" height="16" fill="#DDEFE6"/><path d="M112 97.0L112 111.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M124 97.0L124 111.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M109 112.0L127 96.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="118" y="91" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="232" y="95" width="16" height="18" fill="#DDEFE6"/><path d="M236 96.0Q229 104 236 112.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M244 96.0Q251 104 244 112.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="90" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><text x="262" y="108" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y.C.</text><circle cx="320" cy="104" r="10" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 7: ⟦M1.1⟧ و ⟦T1⟧ ← ⟦Q4.3⟧ الأحمر للسيارات: بعد ⟦T1⟧ حتى نهاية الدورة."><rect x="14" y="130" width="340" height="50" fill="transparent"/><path d="M26 140L26 172" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M26 156L240 156" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="14" y="160" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">7</text><rect x="52" y="148" width="16" height="16" fill="#DDEFE6"/><path d="M54 149.0L54 163.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M66 149.0L66 163.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="143" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><rect x="110" y="148" width="16" height="16" fill="#DDEFE6"/><path d="M112 149.0L112 163.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M124 149.0L124 163.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="143" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="232" y="147" width="16" height="18" fill="#DDEFE6"/><path d="M236 148.0Q229 156 236 164.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M244 148.0Q251 156 244 164.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="142" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><text x="262" y="160" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R.C.</text><circle cx="320" cy="156" r="10" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 8: ⟦M1.1⟧ و ⟦T1⟧ و ⟦T2⟧ مغلق ← ⟦Q4.4⟧ الأخضر للمشاة: بين نهاية ⟦T1⟧ ونهاية ⟦T2⟧."><rect x="14" y="182" width="340" height="50" fill="transparent"/><path d="M26 192L26 224" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M26 208L240 208" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="14" y="212" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">8</text><rect x="52" y="200" width="16" height="16" fill="#DDEFE6"/><path d="M54 201.0L54 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M66 201.0L66 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="195" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><rect x="110" y="200" width="16" height="16" fill="#DDEFE6"/><path d="M112 201.0L112 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M124 201.0L124 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="195" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><rect x="168" y="200" width="16" height="16" fill="#DDEFE6"/><path d="M170 201.0L170 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M182 201.0L182 215.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M167 216.0L185 200.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="176" y="195" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><rect x="232" y="199" width="16" height="18" fill="#DDEFE6"/><path d="M236 200.0Q229 208 236 216.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M244 200.0Q251 208 244 216.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="194" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><text x="262" y="212" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G.P.</text><circle cx="320" cy="208" r="10" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 9: ⟦Q4.4⟧ مغلق ← ⟦Q4.5⟧ الأحمر للمشاة: يضيء كلما كان الأخضر للمشاة مطفأ."><rect x="14" y="234" width="340" height="50" fill="transparent"/><path d="M26 244L26 276" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M26 260L240 260" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="14" y="264" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">9</text><rect x="52" y="252" width="16" height="16" fill="#DDEFE6"/><path d="M54 253.0L54 267.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M66 253.0L66 267.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><path d="M51 268.0L69 252.0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="60" y="247" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><rect x="232" y="251" width="16" height="18" fill="#DDEFE6"/><path d="M236 252.0Q229 260 236 268.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M244 252.0Q251 260 244 268.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="246" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.5</text><text x="262" y="264" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R.P.</text><circle cx="320" cy="260" r="10" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><text x="180" y="312" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المخارج: ⁦Network 5–9⁩</text></svg>`,
   cap:'خمس <span class="ltr">Networks</span>، وبجانب كل ملف لون اللمبة التي يشغّلها.<br><b>مرّر المؤشر على أي <span class="ltr">Network</span> (أو المسها في الجوال) لتعرف شرطها.</b>',
   side:[
    {predict:{q:'في Network 7: تلامس M1.1 وتلامس T1 على التوالي ← Q4.3. متى يضيء الأحمر للسيارات؟',opts:[
     ['من لحظة الضغط على S1',false,'لحظة الضغط T1 لم ينتهِ بعد، فتلامسه المفتوح لا يمرّر.'],
     ['بعد انتهاء T1 وحتى نهاية الدورة (طوال T2 و T3)',true,'M1.1 = 1 طوال الدورة، و T1 = 1 من نهايته حتى تُلغى M1.1.'],
     ['أثناء T2 فقط',false,'هذا الأخضر للمشاة Q4.4، لأن شرطه فيه T2 مغلق.']]}}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 400 410" role="img" aria-label="Networks 5 إلى 9 بلغة LAD"><text class="txt b" x="8" y="22" text-anchor="start">Network 5</text><path class="w " d="M14 32V78"/><path class="w " d="M14 58H63"/><path class="sym" d="M63 47V69M77 47V69"/><path class="sym" d="M60 70L80 46"/><text class="txt " x="70" y="42" text-anchor="middle">M1.1</text><path class="w " d="M77 58H334"/><path class="sym" d="M334 47Q326 58 334 69M346 47Q354 58 346 69"/><text class="txt " x="340" y="41" text-anchor="middle">Q4.1</text><text class="txt b" x="8" y="102" text-anchor="start">Network 6</text><path class="w " d="M14 112V158"/><path class="w " d="M14 138H63"/><path class="sym" d="M63 127V149M77 127V149"/><text class="txt " x="70" y="122" text-anchor="middle">M1.1</text><path class="w " d="M77 138H143"/><path class="sym" d="M143 127V149M157 127V149"/><path class="sym" d="M140 150L160 126"/><text class="txt " x="150" y="122" text-anchor="middle">T1</text><path class="w " d="M157 138H334"/><path class="sym" d="M334 127Q326 138 334 149M346 127Q354 138 346 149"/><text class="txt " x="340" y="121" text-anchor="middle">Q4.2</text><text class="txt b" x="8" y="182" text-anchor="start">Network 7</text><path class="w " d="M14 192V238"/><path class="w " d="M14 218H63"/><path class="sym" d="M63 207V229M77 207V229"/><text class="txt " x="70" y="202" text-anchor="middle">M1.1</text><path class="w " d="M77 218H143"/><path class="sym" d="M143 207V229M157 207V229"/><text class="txt " x="150" y="202" text-anchor="middle">T1</text><path class="w " d="M157 218H334"/><path class="sym" d="M334 207Q326 218 334 229M346 207Q354 218 346 229"/><text class="txt " x="340" y="201" text-anchor="middle">Q4.3</text><text class="txt b" x="8" y="262" text-anchor="start">Network 8</text><path class="w " d="M14 272V318"/><path class="w " d="M14 298H63"/><path class="sym" d="M63 287V309M77 287V309"/><text class="txt " x="70" y="282" text-anchor="middle">M1.1</text><path class="w " d="M77 298H143"/><path class="sym" d="M143 287V309M157 287V309"/><text class="txt " x="150" y="282" text-anchor="middle">T1</text><path class="w " d="M157 298H223"/><path class="sym" d="M223 287V309M237 287V309"/><path class="sym" d="M220 310L240 286"/><text class="txt " x="230" y="282" text-anchor="middle">T2</text><path class="w " d="M237 298H334"/><path class="sym" d="M334 287Q326 298 334 309M346 287Q354 298 346 309"/><text class="txt " x="340" y="281" text-anchor="middle">Q4.4</text><text class="txt b" x="8" y="342" text-anchor="start">Network 9</text><path class="w " d="M14 352V398"/><path class="w " d="M14 378H63"/><path class="sym" d="M63 367V389M77 367V389"/><path class="sym" d="M60 390L80 366"/><text class="txt " x="70" y="362" text-anchor="middle">Q4.4</text><path class="w " d="M77 378H334"/><path class="sym" d="M334 367Q326 378 334 389M346 367Q354 378 346 389"/><text class="txt " x="340" y="361" text-anchor="middle">Q4.5</text></svg></div>`,ref:'ص 122'},
    {tip:String.raw`<ul><li><b><span class="ltr">Network 5</span>:</b> <span class="ltr">M1.1</span> مغلق ← <span class="ltr">Q4.1</span> (الأخضر للسيارات).</li><li><b><span class="ltr">Network 6</span>:</b> <span class="ltr">M1.1</span> و<span class="ltr">T1</span> مغلق ← <span class="ltr">Q4.2</span> (الأصفر).</li><li><b><span class="ltr">Network 7</span>:</b> <span class="ltr">M1.1</span> و<span class="ltr">T1</span> ← <span class="ltr">Q4.3</span> (الأحمر للسيارات).</li><li><b><span class="ltr">Network 8</span>:</b> <span class="ltr">M1.1</span> و<span class="ltr">T1</span> و<span class="ltr">T2</span> مغلق ← <span class="ltr">Q4.4</span> (الأخضر للمشاة).</li><li><b><span class="ltr">Network 9</span>:</b> <span class="ltr">Q4.4</span> مغلق ← <span class="ltr">Q4.5</span> (الأحمر للمشاة).</li></ul><p>هي الدرجات 6 إلى 10 في الشكل (4-6) نفسها، بالعناوين الحقيقية.</p>`,title:'قراءة Networks المخارج'},
    {title:'البرنامج كاملاً في كل لحظة',widget:(el,B)=>{
      const PHN=['الوضع الطبيعي','لحظة الضغط على S1','T1: أصفر','T2: عبور المشاة','T3: إخلاء الطريق','لحظة انتهاء T3'];
      const sim=k=>{const P=B.createPLC(PROG_BOOK);if(k===0){P.scan(0);return P}
        P.set('I0.1',1);P.scan(0);if(k===1)return P;P.set('I0.1',0);P.scan(0);if(k===2)return P;
        P.timer('T1').el=P.timer('T1').tv;P.scan(0);if(k===3)return P;
        P.timer('T2').el=P.timer('T2').tv;P.scan(0);if(k===4)return P;
        P.timer('T3').el=P.timer('T3').tv;P.scan(0);P.scan(0);return P};
      const NM={'I0.1':'S1','Q4.1':'G.C.','Q4.2':'Y.C.','Q4.3':'R.C.','Q4.4':'G.P.','Q4.5':'R.P.'};
      const LMP=[['Q4.1','الخضراء للسيارات',LC.g],['Q4.2','الصفراء للسيارات',LC.y],['Q4.3','الحمراء للسيارات',LC.r],['Q4.4','الخضراء للمشاة',LC.g],['Q4.5','الحمراء للمشاة',LC.r]];
      const lampsH=P=>`<div class="w-facts">${LMP.map(([a,n,c])=>`<div><span><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${P.get(a)?c:'var(--line)'};margin-inline-end:6px"></i>${n} <span class="ltr">${a}</span></span><b>${P.get(a)?'تعمل':'مطفأة'}</b></div>`).join('')}</div>`;
      const segH=(ks,cur,lab,attr)=>`<span class="mseg" style="flex-wrap:wrap">${ks.map(k=>`<button type="button" dir="rtl" style="font-family:var(--font)" ${attr}="${k}" aria-pressed="${k===cur}">${lab(k)}</button>`).join('')}</span>`;
      let k=0,v='lad';const VW=['lad'];
      const draw=()=>{const P=sim(k);
        el.innerHTML=`<div class="w-row" style="margin-top:0">${segH([0,1,2,3,4,5],k,i=>PHN[i],'data-k')}</div>
         ${VW.length>1?`<div class="w-row">${segH(VW,v,x=>x.toUpperCase(),'data-v')}</div>`:''}
         ${lampsH(P)}
         <p class="sub" style="margin-top:8px">الذاكرة <span class="ltr">M1.1 = ${P.get('M1.1')}</span>. الخطوط الملونة = إشارة 1 تمر.</p>
         <div style="max-height:520px;overflow:auto">${P.nets.map(n=>`<div class="net static"><header><h3>Network ${n.i+1}</h3></header><div class="svgbox fixed">${(v==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,NM)}</div></div>`).join('')}</div>
         <p class="sub">في المحاكاة تُرسم Network 1 بملفّي (أو صندوقي) <span class="ltr">S</span> و<span class="ltr">R</span> بدل صندوق <span class="ltr">SR</span>، والمزمنات بملف <span class="ltr">SD</span> بدل صندوق <span class="ltr">S_ODT</span>، لأنها تُبنى من برنامج <span class="ltr">STL</span> (ص 124). السلوك واحد.</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()})};
      draw();
    }},
    {watch:String.raw`<p>الشكل (4-6) فيه عشر درجات، وبرنامج <span class="ltr">LAD</span> فيه تسع <span class="ltr">Networks</span>: لأن التثبيت والإلغاء (درجتان) صارا صندوق <span class="ltr">SR</span> واحداً في <span class="ltr">Network 1</span>.</p>`}
   ]},

  {recap:[
   String.raw`برنامج <span class="ltr">LAD</span> تسع <span class="ltr">Networks</span>: الأولى للذاكرة <span class="ltr">M1.1</span>، ثم ثلاث للمزمنات، ثم خمس للمخارج (ص 121–122).`,
   String.raw`صندوق <span class="ltr">SR</span>: الطرف <span class="ltr">S</span> من <span class="ltr">I0.1</span> يثبّت <span class="ltr">M1.1</span>، والطرف <span class="ltr">R</span> من <span class="ltr">T3</span> يلغيه، والأولوية للإلغاء.`,
   String.raw`صناديق <span class="ltr">S_ODT</span> (تأخير التوصيل) متتالية: <span class="ltr">T1</span> (<span class="ltr">S5T#20S</span>) ثم <span class="ltr">T2</span> (<span class="ltr">S5T#1M20S</span>) ثم <span class="ltr">T3</span> (<span class="ltr">S5T#20S</span>).`,
   String.raw`كل مخرج تحدده تلامسات <span class="ltr">M1.1</span> و<span class="ltr">T1</span> و<span class="ltr">T2</span>، و<span class="ltr">Q4.5</span> عكس <span class="ltr">Q4.4</span>.`]}
 ],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'مخرج Q لصناديق المزمنات في الكتاب غير موصول بأي ملف، والمزمنات تُستخدم بتلامساتها T1 و T2 و T3 في الشبكات الأخرى. هذا صحيح ولا يغيّر شيئاً، لكنه قد يربك المبتدئ.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'Network 1: صندوق SR',title:'<span class="ltr">Network 1</span> بالبوابات: صندوق <span class="ltr">SR</span> وصندوق التخصيص',ref:'ص 122',
   q:'في FBD لا يوجد خط تغذية ولا تلامسات… فأين يُكتب الضاغط I0.1؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 1 بلغة FBD: صندوق SR عنوانه M1.1، على S المدخل I0.1 وعلى R المزمن T3، وخرجه إلى صندوق = M1.1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="صندوق ⟦SR⟧: دالة التخزين مع الإلغاء والإبقاء، وعنوانه الذاكرة ⟦M1.1⟧ (مكتوب فوقه)."><rect x="130" y="90" width="96" height="110" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="178" y="82" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><text x="178" y="118" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SR</text></g><g data-tip="الطرف ⟦S⟧ (الإبقاء): يأتيه ⟦I0.1⟧ مباشرة، أي الضاغط ⟦S1⟧. لا تلامس ولا خط تغذية في ⟦FBD⟧."><rect x="40" y="100" width="104" height="30" fill="transparent"/><text x="100" y="120" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><path d="M104 115L130 115" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="140" y="120" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text></g><g data-tip="الطرف ⟦R⟧ (الإلغاء): يأتيه ⟦T3⟧، فيُلغى ⟦M1.1⟧ عند انتهاء ⟦T3⟧. وإذا جاء 1 على الطرفين معاً فالأولوية للإلغاء."><rect x="40" y="160" width="104" height="30" fill="transparent"/><text x="100" y="180" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text><path d="M104 175L130 175" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="140" y="180" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text></g><g data-tip="الخرج ⟦Q⟧: حالة الذاكرة، يدخل على صندوق التخصيص."><text x="218" y="120" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text><path d="M226 115L258 115" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="صندوق التخصيص ⟦=⟧: يكتب النتيجة في العنوان المكتوب فوقه ⟦M1.1⟧ (مثل الملف في ⟦LAD⟧)."><rect x="258" y="101" width="56" height="28" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="286" y="120" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="286" y="93" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text></g><text x="180" y="40" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 1</text><text x="180" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">العنوان يُكتب على طرف الصندوق</text><text x="180" y="272" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مباشرة بدل التلامس</text></svg>`,
   cap:'العنوان يُكتب على طرف الصندوق مباشرة، والنتيجة تذهب إلى صندوق التخصيص «=».<br><b>مرّر المؤشر على الصندوقين والأطراف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>ثانياً: دائرة (FBD) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</b></p>`,ref:'ص 122'}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 440 150" role="img" aria-label="Network 1"><text class="txt b" x="8" y="18" text-anchor="start">Network 1</text><text class="txt " x="160" y="66" text-anchor="end">I0.1</text><path class="w " d="M164 62H170"/><text class="txt " x="160" y="116" text-anchor="end">T3</text><path class="w " d="M164 112H170"/><rect class="fbox" x="170" y="44" width="96" height="88" rx="3"/><text class="txt " x="218" y="38" text-anchor="middle">M1.1</text><text class="txt " x="218" y="62" text-anchor="b">SR</text><text class="txt " x="178" y="66" text-anchor="start">S</text><text class="txt " x="178" y="116" text-anchor="start">R</text><text class="txt " x="258" y="66" text-anchor="end">Q</text><path class="w " d="M266 62H300"/><rect class="fbox" x="300" y="50" width="60" height="24" rx="3"/><text class="txt " x="330" y="66" text-anchor="middle">=</text><text class="txt " x="330" y="44" text-anchor="middle">M1.1</text></svg></div>`,ref:'ص 122'},
    {tip:String.raw`<p>هو صندوق <span class="ltr">SR</span> نفسه الذي رأيته في <span class="ltr">LAD</span>: على الطرف <span class="ltr">S</span> المدخل <span class="ltr">I0.1</span>، وعلى الطرف <span class="ltr">R</span> المزمن <span class="ltr">T3</span>. الفرق في الرسم فقط: بدل التلامس يُكتب العنوان على طرف الصندوق، وبدل الملف يأتي صندوق التخصيص «=» وفوقه العنوان <span class="ltr">M1.1</span>.</p>`,title:'ما الذي تغيّر عن LAD؟'},
    {predict:{q:'ما وظيفة الصندوق «=» وفوقه M1.1؟',opts:[
     ['يكتب نتيجة صندوق SR في العنوان M1.1',true,'«=» يخصّص النتيجة للعنوان المكتوب فوقه، مثل الملف في LAD.'],
     ['يقارن M1.1 برقم',false,'المقارنة لها صناديق أخرى؛ «=» تخصيص.'],
     ['يصفّر M1.1',false,'التصفير (الإلغاء) يأتي من الطرف R لصندوق SR.']]}},
    {watch:String.raw`<p>في تبويب المختبر يُرسم <span class="ltr">Network 1</span> بصندوقي <span class="ltr">S</span> و<span class="ltr">R</span> منفصلين بدل صندوق <span class="ltr">SR</span>، لأنه يُبنى من <span class="ltr">STL</span> (ص 124)، والسلوك واحد.</p>`},
    {title:'مختبر مصغّر: صندوق SR بالبوابات',widget:(el,B)=>U6ML.sr(el,B,{view:'fbd',intro:'هذه <span class="ltr">Network 1</span> بلغة <span class="ltr">FBD</span> (مرسومة بصندوقي <span class="ltr">S</span> و <span class="ltr">R</span> كما في المختبر). غيّر الطرفين وراقب <span class="ltr">M1.1</span>.',
      predict:{q:String.raw`أثناء الدورة صادف أن انتهى <span class="ltr">T3</span> في اللحظة التي ضغط فيها شخص <span class="ltr">S1</span>. ما قيمة <span class="ltr">M1.1</span>؟`,opts:[
       [String.raw`<span class="ltr">0</span>: الإلغاء له الأولوية`,true,String.raw`في صندوق <span class="ltr">SR</span> إذا وصل <span class="ltr">1</span> إلى الطرفين معاً فالكلمة للإلغاء <span class="ltr">R</span>.`],
       [String.raw`<span class="ltr">1</span>: التثبيت له الأولوية`,false,String.raw`هذا سلوك صندوق آخر (<span class="ltr">RS</span>)؛ في <span class="ltr">SR</span> الإلغاء أقوى.`]]}})}
   ]},

  {st:2,short:'Networks 2–4: المزمنات',title:'<span class="ltr">Networks 2–4</span>: صناديق <span class="ltr">S_ODT</span> بلا تلامسات',ref:'ص 122–123',
   q:'الصندوق نفسه في LAD و FBD… فما الذي يدخل على الطرف S لكل مزمن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صندوق S_ODT بلغة FBD: المزمن T1 على S المدخل M1.1 و TV = S5T#20S، والأطراف R و BI و BCD فارغة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="صندوق ⟦S_ODT⟧: مزمن تأخير التوصيل، وعنوانه ⟦T1⟧ (مكتوب فوقه)."><rect x="124" y="70" width="112" height="150" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="62" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="180" y="96" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S_ODT</text></g><g data-tip="الطرف ⟦S⟧: شرط التشغيل ⟦M1.1⟧. ما دام 1 يعدّ المزمن، وإذا عاد 0 يتصفّر."><rect x="36" y="108" width="100" height="26" fill="transparent"/><text x="96" y="126" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><path d="M100 121L124 121" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="132" y="126" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text></g><g data-tip="⟦TV⟧: الزمن المحدد ⟦S5T#20S⟧ أي 20 ثانية."><rect x="20" y="150" width="116" height="26" fill="transparent"/><text x="96" y="168" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S5T#20S</text><path d="M100 163L124 163" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="132" y="168" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">TV</text></g><g data-tip="⟦R⟧: تصفير المزمن — فارغ في الكتاب (⟦...⟧)."><rect x="36" y="192" width="100" height="26" fill="transparent"/><text x="96" y="210" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">...</text><path d="M100 205L124 205" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="132" y="210" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text></g><g data-tip="⟦Q⟧: خرج المزمن، يصبح 1 بعد انتهاء الزمن. غير موصول في الكتاب؛ نستخدم ⟦T1⟧ مدخلاً في الشبكات الأخرى."><rect x="224" y="108" width="80" height="26" fill="transparent"/><text x="228" y="126" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text><path d="M236 121L262 121" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="⟦BI⟧ و ⟦BCD⟧: الزمن المتبقي بصيغتين رقميتين — فارغان في الكتاب (⟦...⟧)."><rect x="206" y="150" width="120" height="70" fill="transparent"/><text x="228" y="168" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">BI</text><path d="M236 163L256 163" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="262" y="168" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">...</text><text x="228" y="210" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">BCD</text><path d="M236 205L256 205" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="262" y="210" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">...</text></g><g data-tip="Network 2: ⟦T1⟧ يدخل عليه ⟦M1.1⟧، ⟦TV = S5T#20S⟧."><rect x="40" y="240" width="88" height="44" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="84" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="84" y="276" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S = M1.1</text></g><g data-tip="Network 3: ⟦T2⟧ يدخل عليه ⟦T1⟧، ⟦TV = S5T#1M20S⟧."><rect x="144" y="240" width="88" height="44" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="188" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><text x="188" y="276" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S = T1</text></g><g data-tip="Network 4: ⟦T3⟧ يدخل عليه ⟦T2⟧، ⟦TV = S5T#20S⟧."><rect x="248" y="240" width="88" height="44" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="292" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text><text x="292" y="276" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S = T2</text></g></svg>`,
   cap:'صندوق المزمن <span class="ltr">T1</span> بأطرافه، وتحته ما يدخل على الطرف <span class="ltr">S</span> لكل مزمن.<br><b>مرّر المؤشر على الصندوق والأطراف والبطاقات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في FBD كُتب على الطرف S لصندوق T2 العنوان T1. ماذا يعني ذلك؟',opts:[
     ['أن T2 و T1 يبدآن معاً',false,'T1 يصبح 1 عند انتهاء زمنه، لا عند بدايته.'],
     ['أن T2 يُصفّر T1',false,'التصفير يكون بالطرف R، وهو فارغ.'],
     ['أن T2 يبدأ العدّ عندما يصبح T1 = 1، أي بعد انتهاء T1',true,'مدخل S لصندوق T2 هو T1، فالمزمنات تعمل بالتتابع.']]}}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 400 450" role="img" aria-label="Networks 2 إلى 4"><text class="txt b" x="8" y="18" text-anchor="start">Network 2</text><text class="txt " x="180" y="54" text-anchor="end">M1.1</text><path class="w " d="M184 50H190"/><rect class="fbox" x="190" y="32" width="120" height="108" rx="3"/><text class="txt " x="250" y="26" text-anchor="middle">T1</text><text class="txt " x="250" y="50" text-anchor="b">S_ODT</text><text class="txt " x="196" y="54" text-anchor="start">S</text><text class="txt " x="196" y="94" text-anchor="start">TV</text><text class="txt " x="196" y="132" text-anchor="start">R</text><text class="txt " x="304" y="54" text-anchor="end">Q</text><text class="txt " x="304" y="94" text-anchor="end">BI</text><text class="txt " x="304" y="132" text-anchor="end">BCD</text><path class="w " d="M170 90H190"/><text class="txt " x="166" y="94" text-anchor="end">S5T#20S</text><path class="w " d="M170 128H190"/><text class="txt m" x="166" y="132" text-anchor="end">...</text><path class="w " d="M310 50H350"/><path class="w " d="M310 90H330"/><text class="txt m" x="334" y="94" text-anchor="start">...</text><path class="w " d="M310 128H330"/><text class="txt m" x="334" y="132" text-anchor="start">...</text><text class="txt b" x="8" y="168" text-anchor="start">Network 3</text><text class="txt " x="180" y="204" text-anchor="end">T1</text><path class="w " d="M184 200H190"/><rect class="fbox" x="190" y="182" width="120" height="108" rx="3"/><text class="txt " x="250" y="176" text-anchor="middle">T2</text><text class="txt " x="250" y="200" text-anchor="b">S_ODT</text><text class="txt " x="196" y="204" text-anchor="start">S</text><text class="txt " x="196" y="244" text-anchor="start">TV</text><text class="txt " x="196" y="282" text-anchor="start">R</text><text class="txt " x="304" y="204" text-anchor="end">Q</text><text class="txt " x="304" y="244" text-anchor="end">BI</text><text class="txt " x="304" y="282" text-anchor="end">BCD</text><path class="w " d="M170 240H190"/><text class="txt " x="166" y="244" text-anchor="end">S5T#1M20S</text><path class="w " d="M170 278H190"/><text class="txt m" x="166" y="282" text-anchor="end">...</text><path class="w " d="M310 200H350"/><path class="w " d="M310 240H330"/><text class="txt m" x="334" y="244" text-anchor="start">...</text><path class="w " d="M310 278H330"/><text class="txt m" x="334" y="282" text-anchor="start">...</text><text class="txt b" x="8" y="318" text-anchor="start">Network 4</text><text class="txt " x="180" y="354" text-anchor="end">T2</text><path class="w " d="M184 350H190"/><rect class="fbox" x="190" y="332" width="120" height="108" rx="3"/><text class="txt " x="250" y="326" text-anchor="middle">T3</text><text class="txt " x="250" y="350" text-anchor="b">S_ODT</text><text class="txt " x="196" y="354" text-anchor="start">S</text><text class="txt " x="196" y="394" text-anchor="start">TV</text><text class="txt " x="196" y="432" text-anchor="start">R</text><text class="txt " x="304" y="354" text-anchor="end">Q</text><text class="txt " x="304" y="394" text-anchor="end">BI</text><text class="txt " x="304" y="432" text-anchor="end">BCD</text><path class="w " d="M170 390H190"/><text class="txt " x="166" y="394" text-anchor="end">S5T#20S</text><path class="w " d="M170 428H190"/><text class="txt m" x="166" y="432" text-anchor="end">...</text><path class="w " d="M310 350H350"/><path class="w " d="M310 390H330"/><text class="txt m" x="334" y="394" text-anchor="start">...</text><path class="w " d="M310 428H330"/><text class="txt m" x="334" y="432" text-anchor="start">...</text></svg></div>`,ref:'ص 122–123'},
    {tip:String.raw`<p><span class="ltr">T1</span> يدخل عليه <span class="ltr">M1.1</span> (<span class="ltr">TV = S5T#20S</span>)، و<span class="ltr">T2</span> يدخل عليه <span class="ltr">T1</span> (<span class="ltr">TV = S5T#1M20S</span>)، و<span class="ltr">T3</span> يدخل عليه <span class="ltr">T2</span> (<span class="ltr">TV = S5T#20S</span>). الأطراف <span class="ltr">R</span> و<span class="ltr">BI</span> و<span class="ltr">BCD</span> فارغة، والمخرج <span class="ltr">Q</span> غير موصول.</p>`,title:'المزمنات الثلاثة'},
    {title:'مختبر مصغّر: صناديق S_ODT مع الزمن',widget:(el,B)=>U6ML.tm(el,B,{view:'fbd',t0:0,intro:'المنزلق هو الزمن منذ ضغطة قصيرة على <span class="ltr">S1</span>، بأزمنة الكتاب. لاحظ ما يدخل على الطرف <span class="ltr">S</span> لكل صندوق.',
      predict:{q:String.raw`بعد <span class="ltr">110</span> ثوانٍ من الضغط على <span class="ltr">S1</span>، ما حالة الصندوق <span class="ltr">T3</span>؟`,opts:[
       [String.raw`لم يبدأ بعد`,false,String.raw`<span class="ltr">T2</span> انتهى عند <span class="ltr">100</span> ثانية (<span class="ltr">20 + 80</span>)، فصار على طرف <span class="ltr">S</span> لـ <span class="ltr">T3</span> واحد.`],
       [String.raw`يعدّ، وباقٍ له <span class="ltr">10</span> ثوانٍ`,true,String.raw`بدأ عند <span class="ltr">100</span> ثانية وزمنه <span class="ltr">20</span> ثانية، فينتهي عند <span class="ltr">120</span>.`],
       [String.raw`انتهى`,false,String.raw`ينتهي <span class="ltr">T3</span> عند <span class="ltr">120</span> ثانية، أي بعد دقيقتين من الضغط.`]]}})}
   ]},

  {st:3,short:'Networks 5–9: البوابات',title:'<span class="ltr">Networks 5–9</span>: بوابات <span class="ltr">&amp;</span> ودائرة النفي',ref:'ص 123',
   q:'تلامس مغلق في LAD… كيف يُرسم في البوابات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Networks 5 إلى 9 بلغة FBD: بوابات &amp; ومداخل منفية بالدائرة الصغيرة، والمخارج Q4.1 إلى Q4.5" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="164" r="148" fill="#F7DCC8"/><g data-tip="Network 5: بوابة ⟦&amp;⟧ بمدخل واحد منفي ⟦M1.1 (N)⟧ ← ⟦Q4.1⟧: الخرج عكس ⟦M1.1⟧."><rect x="14" y="26" width="340" height="27" fill="transparent"/><text x="18" y="43.5" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">5</text><text x="118" y="43.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><path d="M122 39.5L142 39.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><circle cx="146" cy="39.5" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="150" y="28" width="38" height="23" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="169" y="42" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text><path d="M188 39.5L210 39.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="210" y="29.5" width="40" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="230" y="44.5" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="256" y="43.5" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><circle cx="322" cy="39.5" r="9" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 6: ⟦M1.1⟧ و ⟦T1 (N)⟧ ← ⟦Q4.2⟧ الأصفر."><rect x="14" y="65" width="340" height="44" fill="transparent"/><text x="18" y="91.0" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">6</text><text x="118" y="82.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><path d="M122 78.5L150 78.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="99.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><path d="M122 95.5L142 95.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><circle cx="146" cy="95.5" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="150" y="67" width="38" height="40" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="169" y="81" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text><path d="M188 87.0L210 87.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="210" y="77.0" width="40" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="230" y="92.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="256" y="91.0" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><circle cx="322" cy="87.0" r="9" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 7: ⟦M1.1⟧ و ⟦T1⟧ ← ⟦Q4.3⟧ الأحمر للسيارات."><rect x="14" y="121" width="340" height="44" fill="transparent"/><text x="18" y="147.0" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">7</text><text x="118" y="138.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><path d="M122 134.5L150 134.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="155.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><path d="M122 151.5L150 151.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="150" y="123" width="38" height="40" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="169" y="137" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text><path d="M188 143.0L210 143.0" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="210" y="133.0" width="40" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="230" y="148.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="256" y="147.0" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><circle cx="322" cy="143.0" r="9" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 8: ⟦M1.1⟧ و ⟦T1⟧ و ⟦T2 (N)⟧ ← ⟦Q4.4⟧ الأخضر للمشاة."><rect x="14" y="177" width="340" height="61" fill="transparent"/><text x="18" y="211.5" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">8</text><text x="118" y="194.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M1.1</text><path d="M122 190.5L150 190.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="211.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><path d="M122 207.5L150 207.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><text x="118" y="228.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text><path d="M122 224.5L142 224.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><circle cx="146" cy="224.5" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="150" y="179" width="38" height="57" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="169" y="193" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text><path d="M188 207.5L210 207.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="210" y="197.5" width="40" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="230" y="212.5" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="256" y="211.5" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><circle cx="322" cy="207.5" r="9" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 9: بوابة ⟦&amp;⟧ بمدخل واحد منفي ⟦Q4.4 (N)⟧ ← ⟦Q4.5⟧: الأحمر للمشاة عكس الأخضر للمشاة."><rect x="14" y="250" width="340" height="27" fill="transparent"/><text x="18" y="267.5" text-anchor="middle" font-size="11" fill="#5F7A70" font-weight="700" font-family="var(--mono)" direction="ltr">9</text><text x="118" y="267.5" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><path d="M122 263.5L142 263.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><circle cx="146" cy="263.5" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="150" y="252" width="38" height="23" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="169" y="266" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text><path d="M188 263.5L210 263.5" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round"/><rect x="210" y="253.5" width="40" height="20" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="230" y="268.5" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="256" y="267.5" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.5</text><circle cx="322" cy="263.5" r="9" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="الدائرة الصغيرة على مدخل البوابة (⟦N⟧): نفي — تعكس قيمة الإشارة قبل دخولها البوابة."><circle cx="262" cy="300" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="304" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الدائرة الصغيرة = نفي</text></g></svg>`,
   cap:'كل <span class="ltr">Network</span> بوابة <span class="ltr">&amp;</span>، والدائرة الصغيرة على المدخل تعني نفي.<br><b>مرّر المؤشر على أي <span class="ltr">Network</span> أو على الدائرة الصغيرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'Network 9: بوابة & مدخلها Q4.4 عليه دائرة صغيرة، وخرجها Q4.5. ماذا يعني ذلك؟',opts:[
     ['Q4.5 = Q4.4',false,'الدائرة الصغيرة تعكس المدخل.'],
     ['Q4.5 يعمل دائماً',false,'ينطفئ عندما يعمل Q4.4.'],
     ['Q4.5 = عكس Q4.4: الأحمر للمشاة عكس الأخضر للمشاة',true,'بوابة & بمدخل واحد منفي = الخرج عكس المدخل.']]}}
   ],
   body:[
    {book:String.raw`<div class="svgbox fixed"><svg viewBox="0 0 400 446" role="img" aria-label="Networks 5 إلى 9 بلغة FBD"><text class="txt b" x="8" y="22" text-anchor="start">Network 5</text><text class="txt " x="150" y="52.0" text-anchor="end">M1.1</text><path class="w " d="M154 48.0H172"/><circle cx="176" cy="48.0" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect class="fbox" x="180" y="32" width="50" height="32" rx="3"/><text class="txt " x="205" y="48" text-anchor="middle">&amp;</text><path class="w " d="M230 48.0H260"/><rect class="fbox" x="260" y="36.0" width="60" height="24" rx="3"/><text class="txt " x="290" y="52.0" text-anchor="middle">=</text><text class="txt " x="290" y="32.0" text-anchor="middle">Q4.1</text><text class="txt b" x="8" y="90" text-anchor="start">Network 6</text><text class="txt " x="150" y="120" text-anchor="end">M1.1</text><path class="w " d="M154 116H180"/><text class="txt " x="150" y="144" text-anchor="end">T1</text><path class="w " d="M154 140H172"/><circle cx="176" cy="140" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect class="fbox" x="180" y="100" width="50" height="56" rx="3"/><text class="txt " x="205" y="116" text-anchor="middle">&amp;</text><path class="w " d="M230 128.0H260"/><rect class="fbox" x="260" y="116.0" width="60" height="24" rx="3"/><text class="txt " x="290" y="132.0" text-anchor="middle">=</text><text class="txt " x="290" y="112.0" text-anchor="middle">Q4.2</text><text class="txt b" x="8" y="182" text-anchor="start">Network 7</text><text class="txt " x="150" y="212" text-anchor="end">M1.1</text><path class="w " d="M154 208H180"/><text class="txt " x="150" y="236" text-anchor="end">T1</text><path class="w " d="M154 232H180"/><rect class="fbox" x="180" y="192" width="50" height="56" rx="3"/><text class="txt " x="205" y="208" text-anchor="middle">&amp;</text><path class="w " d="M230 220.0H260"/><rect class="fbox" x="260" y="208.0" width="60" height="24" rx="3"/><text class="txt " x="290" y="224.0" text-anchor="middle">=</text><text class="txt " x="290" y="204.0" text-anchor="middle">Q4.3</text><text class="txt b" x="8" y="274" text-anchor="start">Network 8</text><text class="txt " x="150" y="304" text-anchor="end">M1.1</text><path class="w " d="M154 300H180"/><text class="txt " x="150" y="328" text-anchor="end">T1</text><path class="w " d="M154 324H180"/><text class="txt " x="150" y="352" text-anchor="end">T2</text><path class="w " d="M154 348H172"/><circle cx="176" cy="348" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect class="fbox" x="180" y="284" width="50" height="80" rx="3"/><text class="txt " x="205" y="300" text-anchor="middle">&amp;</text><path class="w " d="M230 324.0H260"/><rect class="fbox" x="260" y="312.0" width="60" height="24" rx="3"/><text class="txt " x="290" y="328.0" text-anchor="middle">=</text><text class="txt " x="290" y="308.0" text-anchor="middle">Q4.4</text><text class="txt b" x="8" y="390" text-anchor="start">Network 9</text><text class="txt " x="150" y="420.0" text-anchor="end">Q4.4</text><path class="w " d="M154 416.0H172"/><circle cx="176" cy="416.0" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect class="fbox" x="180" y="400" width="50" height="32" rx="3"/><text class="txt " x="205" y="416" text-anchor="middle">&amp;</text><path class="w " d="M230 416.0H260"/><rect class="fbox" x="260" y="404.0" width="60" height="24" rx="3"/><text class="txt " x="290" y="420.0" text-anchor="middle">=</text><text class="txt " x="290" y="400.0" text-anchor="middle">Q4.5</text></svg></div>`,ref:'ص 123'},
    {tip:String.raw`<p><span class="ltr">&amp;</span> = «و»: الخرج 1 فقط إذا كانت كل المداخل 1. والدائرة الصغيرة على المدخل (يرمز لها <span class="ltr">N</span>) تعكس قيمته قبل أن يدخل. فالتلامس على التوالي في <span class="ltr">LAD</span> = مدخل للبوابة <span class="ltr">&amp;</span>، والتلامس المغلق = مدخل عليه دائرة النفي.</p>
     <div class="tablebox"><table class="tt"><thead><tr><th>Network</th><th>مداخل البوابة &amp;</th><th>المخرج</th></tr></thead><tbody>
     <tr><td>5</td><td class="mono">M1.1 (N)</td><td class="mono">Q4.1</td></tr><tr><td>6</td><td class="mono">M1.1 ، T1 (N)</td><td class="mono">Q4.2</td></tr>
     <tr><td>7</td><td class="mono">M1.1 ، T1</td><td class="mono">Q4.3</td></tr><tr><td>8</td><td class="mono">M1.1 ، T1 ، T2 (N)</td><td class="mono">Q4.4</td></tr><tr><td>9</td><td class="mono">Q4.4 (N)</td><td class="mono">Q4.5</td></tr></tbody></table></div>`,title:'كيف تقرأ البوابات؟'},
    {title:'بدّل بين LAD و FBD في كل لحظة',widget:(el,B)=>{
      const PHN=['الوضع الطبيعي','لحظة الضغط على S1','T1: أصفر','T2: عبور المشاة','T3: إخلاء الطريق','لحظة انتهاء T3'];
      const sim=k=>{const P=B.createPLC(PROG_BOOK);if(k===0){P.scan(0);return P}
        P.set('I0.1',1);P.scan(0);if(k===1)return P;P.set('I0.1',0);P.scan(0);if(k===2)return P;
        P.timer('T1').el=P.timer('T1').tv;P.scan(0);if(k===3)return P;
        P.timer('T2').el=P.timer('T2').tv;P.scan(0);if(k===4)return P;
        P.timer('T3').el=P.timer('T3').tv;P.scan(0);P.scan(0);return P};
      const NM={'I0.1':'S1','Q4.1':'G.C.','Q4.2':'Y.C.','Q4.3':'R.C.','Q4.4':'G.P.','Q4.5':'R.P.'};
      const LMP=[['Q4.1','الخضراء للسيارات',LC.g],['Q4.2','الصفراء للسيارات',LC.y],['Q4.3','الحمراء للسيارات',LC.r],['Q4.4','الخضراء للمشاة',LC.g],['Q4.5','الحمراء للمشاة',LC.r]];
      const lampsH=P=>`<div class="w-facts">${LMP.map(([a,n,c])=>`<div><span><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${P.get(a)?c:'var(--line)'};margin-inline-end:6px"></i>${n} <span class="ltr">${a}</span></span><b>${P.get(a)?'تعمل':'مطفأة'}</b></div>`).join('')}</div>`;
      const segH=(ks,cur,lab,attr)=>`<span class="mseg" style="flex-wrap:wrap">${ks.map(k=>`<button type="button" dir="rtl" style="font-family:var(--font)" ${attr}="${k}" aria-pressed="${k===cur}">${lab(k)}</button>`).join('')}</span>`;
      let k=0,v='fbd';const VW=['fbd', 'lad'];
      const draw=()=>{const P=sim(k);
        el.innerHTML=`<div class="w-row" style="margin-top:0">${segH([0,1,2,3,4,5],k,i=>PHN[i],'data-k')}</div>
         ${VW.length>1?`<div class="w-row">${segH(VW,v,x=>x.toUpperCase(),'data-v')}</div>`:''}
         ${lampsH(P)}
         <p class="sub" style="margin-top:8px">الذاكرة <span class="ltr">M1.1 = ${P.get('M1.1')}</span>. الخطوط الملونة = إشارة 1 تمر.</p>
         <div style="max-height:520px;overflow:auto">${P.nets.map(n=>`<div class="net static"><header><h3>Network ${n.i+1}</h3></header><div class="svgbox fixed">${(v==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,NM)}</div></div>`).join('')}</div>
         <p class="sub">في المحاكاة تُرسم Network 1 بملفّي (أو صندوقي) <span class="ltr">S</span> و<span class="ltr">R</span> بدل صندوق <span class="ltr">SR</span>، والمزمنات بملف <span class="ltr">SD</span> بدل صندوق <span class="ltr">S_ODT</span>، لأنها تُبنى من برنامج <span class="ltr">STL</span> (ص 124). السلوك واحد.</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()})};
      draw();
    }},
    {watch:String.raw`<p>لو استُبدلت البوابة <span class="ltr">&amp;</span> في <span class="ltr">Network 7</span> ببوابة «أو» <span class="ltr">&gt;=1</span>، لكفى <span class="ltr">M1.1 = 1</span> ليضيء الأحمر للسيارات، فيضيء مع الأصفر. لذلك يلزم «و». وفي المحاكاة ترسم <span class="ltr">Networks 5</span> و<span class="ltr">9</span> مدخلاً منفياً مباشرة إلى «=» بدون صندوق <span class="ltr">&amp;</span>.</p>`}
   ]},

  {recap:[
   String.raw`برنامج <span class="ltr">FBD</span> هو برنامج <span class="ltr">LAD</span> نفسه بالصناديق والبوابات: تسع <span class="ltr">Networks</span> بالترتيب نفسه (ص 122–123).`,
   String.raw`<span class="ltr">Network 1</span>: صندوق <span class="ltr">SR</span> عنوانه <span class="ltr">M1.1</span>، <span class="ltr">S = I0.1</span> و<span class="ltr">R = T3</span>، ثم صندوق التخصيص «=».`,
   String.raw`صناديق <span class="ltr">S_ODT</span>: <span class="ltr">T1</span> يدخل عليه <span class="ltr">M1.1</span>، و<span class="ltr">T2</span> يدخل عليه <span class="ltr">T1</span>، و<span class="ltr">T3</span> يدخل عليه <span class="ltr">T2</span>.`,
   String.raw`المخارج بوابات <span class="ltr">&amp;</span>، والدائرة الصغيرة (<span class="ltr">N</span>) نفي تقابل التلامس المغلق في <span class="ltr">LAD</span>.`]}
 ],
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
 stations:[
  {intro:true},

  {st:1,short:'Network 1: S و R',title:'<span class="ltr">Network 1</span> بالأوامر: التثبيت <span class="ltr">S</span> ثم الإلغاء <span class="ltr">R</span>',ref:'ص 124',
   q:'لا يوجد صندوق SR في قائمة الأوامر… فكيف نكتب التثبيت والإلغاء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 1 بلغة STL: ستة أسطر، التثبيت بالأمر S ثم الإلغاء بالأمر R" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="34" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 1</text><g data-tip="⟦A I 0.1⟧: هل الضاغط ⟦S1⟧ مضغوط؟"><rect x="80" y="48" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="63.0" r="6" fill="#12855A"/><text x="110" y="68.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A   I 0.1</text></g><g data-tip="⟦S M 1.1⟧: إذا نعم ثبّت ⟦M1.1⟧ = 1 (الإبقاء)."><rect x="80" y="86" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="101.0" r="6" fill="#12855A"/><text x="110" y="106.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S   M 1.1</text></g><g data-tip="⟦A T 3⟧: هل انتهى زمن ⟦T3⟧؟"><rect x="80" y="124" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="139.0" r="6" fill="#E8735A"/><text x="110" y="144.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A   T 3</text></g><g data-tip="⟦R M 1.1⟧: إذا نعم ألغِ ⟦M1.1⟧ (الإلغاء). جاء بعد ⟦S⟧ فالكلمة الأخيرة له."><rect x="80" y="162" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="177.0" r="6" fill="#E8735A"/><text x="110" y="182.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R   M 1.1</text></g><g data-tip="⟦A M 1.1⟧ ثم ⟦= M 1.1⟧: تخصيص ⟦M1.1⟧ لنفسه، مثل ملف ⟦M1.1⟧ في ⟦LAD⟧ — لا يغيّر شيئاً."><rect x="80" y="200" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="215.0" r="6" fill="#F2C14E"/><text x="110" y="220.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A   M 1.1</text></g><g data-tip="⟦= M 1.1⟧: يكتب النتيجة في ⟦M1.1⟧، وهي قيمة ⟦M1.1⟧ نفسها."><rect x="80" y="238" width="200" height="30" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="253.0" r="6" fill="#F2C14E"/><text x="110" y="258.0" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=   M 1.1</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">التثبيت ثم الإلغاء</text></svg>`,
   cap:'ستة أسطر: زوج للتثبيت (أخضر)، وزوج للإلغاء (برتقالي)، وزوج للتخصيص (أصفر).<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p><b>ثالثاً: دائرة (STL) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</b></p>`+(()=>{const P=B.createPLC(PROG_BOOK);return P.nets.slice(0,1).map(n=>`<div class="net static"><header><h3>Network ${n.i+1}</h3></header>${B.stlTable(n,{trace:[],get:()=>0})}</div>`).join('')})(),ref:'ص 124'}
   ],
   body:[
    {tip:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>السطر</th><th>المعنى</th></tr></thead><tbody>
     <tr><td class="mono">A I 0.1</td><td>هل الضاغط <span class="ltr">S1</span> مضغوط؟</td></tr><tr><td class="mono">S M 1.1</td><td>إذا نعم: ثبّت <span class="ltr">M1.1 = 1</span></td></tr>
     <tr><td class="mono">A T 3</td><td>هل انتهى زمن <span class="ltr">T3</span>؟</td></tr><tr><td class="mono">R M 1.1</td><td>إذا نعم: ألغِ <span class="ltr">M1.1</span></td></tr>
     <tr><td class="mono">A M 1.1<br>= M 1.1</td><td>خصّص <span class="ltr">M1.1</span> لنفسه (مثل ملف <span class="ltr">M1.1</span> في LAD)</td></tr></tbody></table></div>
     <p>لأن <span class="ltr">R</span> مكتوبة بعد <span class="ltr">S</span>، فإذا تحقق الشرطان معاً تكون الكلمة الأخيرة للإلغاء، تماماً مثل صندوق <span class="ltr">SR</span>.</p>`,title:'اقرأ Network 1 سطراً سطراً'},
    {predict:{q:'جاء الأمر R M 1.1 بعد S M 1.1. إذا تحقق الشرطان في دورة المسح نفسها، ماذا تصبح M1.1؟',opts:[
     [String.raw`<span class="ltr">1</span>، لأن S جاء أولاً`,false,'S كتب 1، لكن R جاء بعده فكتب 0 فوقها.'],
     ['خطأ في البرنامج يوقف الـ PLC',false,'لا خطأ؛ الأوامر تُنفَّذ بالترتيب.'],
     [String.raw`<span class="ltr">0</span>: الـ PLC ينفّذ الأسطر بالترتيب، فآخر أمر هو الذي يبقى`,true,'لذلك الأولوية للإلغاء، كصندوق SR في LAD و FBD.']]}},
    {watch:String.raw`<p>في <span class="ltr">LAD</span> و<span class="ltr">FBD</span> يستخدم الكتاب صندوق <span class="ltr">SR</span> في <span class="ltr">Network 1</span>، أما في <span class="ltr">STL</span> فيستخدم أمرَي <span class="ltr">S</span> و<span class="ltr">R</span> منفصلين ثم <span class="ltr mono">A M 1.1 / = M 1.1</span> (تخصيص <span class="ltr">M1.1</span> لنفسه، زائد لا يغيّر شيئاً). السلوك في الحالتين واحد لأن الإلغاء له الأولوية.</p>`,fix:true},
    {title:'مختبر مصغّر: نفّذ Network 1 سطراً سطراً',widget:(el,B)=>{const LN=['A I 0.1','S M 1.1','A T 3','R M 1.1','A M 1.1','= M 1.1'],lt=s=>`<span class="ltr">${s}</span>`;
      return DCML.lab(el,B,{intro:'اختر حالة المداخل وقيمة <span class="ltr">M1.1</span> قبل المسح، ثم حرّك المنزلق الأول سطراً سطراً وتابع <span class="ltr">RLO</span> و <span class="ltr">M1.1</span>.',
      predict:{q:String.raw`<span class="ltr">M1.1 = 1</span> من قبل، و <span class="ltr">S1</span> متروك، و <span class="ltr">T3</span> لم ينتهِ. ماذا يفعل السطر <span class="ltr">S M 1.1</span>؟`,opts:[
       [String.raw`يكتب <span class="ltr">0</span> في <span class="ltr">M1.1</span> لأن <span class="ltr">RLO = 0</span>`,false,String.raw`الأمر <span class="ltr">S</span> لا يكتب <span class="ltr">0</span> أبداً.`],
       [String.raw`لا يفعل شيئاً، فتبقى <span class="ltr">M1.1 = 1</span>`,true,String.raw`<span class="ltr">S</span> يكتب <span class="ltr">1</span> فقط إذا كانت <span class="ltr">RLO = 1</span>؛ وإلا يترك العنوان كما هو. وهذه هي «الذاكرة».`]]},
      ins:[{k:'n',l:'عدد الأسطر المنفّذة',min:0,max:6,step:1,v:0,fmt:v=>v+' / 6'},
       {k:'s1',l:'S1',sw:true,v:0,on:'S1 مضغوط '+lt('(I0.1 = 1)'),off:'S1 متروك '+lt('(I0.1 = 0)')},
       {k:'t3',l:'T3',sw:true,v:0,on:'T3 انتهى '+lt('(T3 = 1)'),off:'T3 لم ينتهِ '+lt('(T3 = 0)')},
       {k:'m0',l:'M1.1',sw:true,v:1,on:'قبل المسح: '+lt('M1.1 = 1'),off:'قبل المسح: '+lt('M1.1 = 0')}],
      calc:s=>{let m=s.m0,rlo=0;const R=[];
       for(let i=0;i<s.n;i++){if(i===0)rlo=s.s1;else if(i===1){if(rlo)m=1}else if(i===2)rlo=s.t3;else if(i===3){if(rlo)m=0}else if(i===4)rlo=m;else m=rlo;R.push([rlo,m])}
       const say=['هل الضاغط مضغوط؟ ← '+lt('RLO = '+s.s1),rlo=>rlo?lt('RLO = 1')+'، فثُبّتت '+lt('M1.1 = 1')+'.':lt('RLO = 0')+'، فلا يفعل '+lt('S')+' شيئاً.','هل انتهى '+lt('T3')+'؟ ← '+lt('RLO = '+s.t3)+' (سطر جديد بعد '+lt('S')+' يبدأ قراءة جديدة).',rlo=>rlo?lt('RLO = 1')+'، فأُلغيت '+lt('M1.1 = 0')+'.':lt('RLO = 0')+'، فلا يفعل '+lt('R')+' شيئاً.','قراءة '+lt('M1.1')+' نفسها ← '+lt('RLO = '+(R[4]?R[4][0]:'')),'تخصيص '+lt('M1.1')+' لنفسه: لا يغيّر قيمتها.'];
       const tb=`<div style="overflow-x:auto;direction:ltr"><table style="border-collapse:collapse;font-family:var(--mono);font-size:13.5px;width:100%;text-align:left"><thead><tr style="color:var(--muted)"><th>STL</th><th>RLO</th><th>M1.1</th></tr></thead><tbody>${LN.map((l,i)=>`<tr style="${i===s.n-1?'background:var(--blue-soft);font-weight:700':''}${i>=s.n?';color:var(--muted)':''}"><td>${l}</td><td>${i<s.n&&[0,2,4].includes(i)?R[i][0]:''}</td><td>${i<s.n?R[i][1]:''}</td></tr>`).join('')}</tbody></table></div>`;
       const k=s.n-1,f=say[k];
       return {pic:tb,facts:[['RLO',s.n?String(R[k][0]):'—'],['M1.1',String(m),m?'hi':'']],msg:s.n?`<b>السطر ${lt(LN[k])}:</b> ${typeof f==='function'?f(R[k][0]):f}`:'حرّك المنزلق الأول لتنفيذ أول سطر.'}}})}}
   ]},

  {st:2,short:'Networks 2–4: المزمنات',title:'<span class="ltr">Networks 2–4</span>: تحميل الزمن ثم تشغيل المزمن',ref:'ص 124',
   q:'صندوق المزمن له سبعة أطراف… كم سطراً يصير في قائمة الأوامر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 2 بلغة STL: A M 1.1 ثم L S5T#20S ثم SD T 1 ثم أربعة أسطر NOP 0" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="30" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 2</text><g data-tip="⟦A M 1.1⟧: شرط تشغيل المزمن — الذاكرة ⟦M1.1⟧."><rect x="80" y="42" width="200" height="27" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="55.5" r="6" fill="#12855A"/><text x="110" y="60.5" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A   M 1.1</text></g><g data-tip="⟦L S5T#20S⟧: تحميل قيمة الزمن 20 ثانية."><rect x="80" y="76" width="200" height="27" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="89.5" r="6" fill="#F2C14E"/><text x="110" y="94.5" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">L   S5T#20S</text></g><g data-tip="⟦SD T 1⟧: تشغيل ⟦T1⟧ مزمن تأخير توصيل (⟦S_ODT⟧)."><rect x="80" y="110" width="200" height="27" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="94" cy="123.5" r="6" fill="#E8735A"/><text x="110" y="128.5" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SD  T 1</text></g><g data-tip="أربعة أسطر ⟦NOP 0⟧: «لا عملية». يولّدها برنامج ⟦STEP 7⟧ للأطراف الفارغة في صندوق المزمن، ولا تؤثر على التشغيل."><rect x="80" y="146" width="200" height="114" fill="transparent"/><rect x="80" y="146" width="200" height="24" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="163" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">NOP 0</text><rect x="80" y="176" width="200" height="24" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="193" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">NOP 0</text><rect x="80" y="206" width="200" height="24" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="223" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">NOP 0</text><rect x="80" y="236" width="200" height="24" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="253" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">NOP 0</text></g><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">⁦Network 3⁩ و ⁦4⁩ بالشكل نفسه</text></svg>`,
   cap:'<span class="ltr">Network 2</span>: شرط، ثم تحميل الزمن، ثم تشغيل المزمن، ثم أربعة أسطر <span class="ltr">NOP 0</span>.<br><b>مرّر المؤشر على الأسطر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:(()=>{const P=B.createPLC(PROG_BOOK);return P.nets.slice(1,4).map(n=>`<div class="net static"><header><h3>Network ${n.i+1}</h3></header>${B.stlTable(n,{trace:[],get:()=>0})}</div>`).join('')})(),ref:'ص 124'}
   ],
   body:[
    {tip:String.raw`<ul><li><span class="ltr mono">A M 1.1</span>: شرط التشغيل.</li><li><span class="ltr mono">L S5T#20S</span>: تحميل قيمة الزمن.</li><li><span class="ltr mono">SD T 1</span>: تشغيل المزمن كمزمن تأخير توصيل (<span class="ltr">S_ODT</span>).</li><li>أسطر <span class="ltr mono">NOP 0</span> تعني «لا عملية».</li></ul><p><span class="ltr">Network 3</span> و<span class="ltr">4</span> بالشكل نفسه: <span class="ltr mono">A T 1</span> ثم <span class="ltr mono">L S5T#1M20S</span> ثم <span class="ltr mono">SD T 2</span>، و<span class="ltr mono">A T 2</span> ثم <span class="ltr mono">L S5T#20S</span> ثم <span class="ltr mono">SD T 3</span>.</p>`,title:'قراءة Networks المزمنات'},
    {predict:{q:'ماذا يعني الأمر SD T 1؟',opts:[
     ['تصفير المزمن T1',false,'التصفير يكون بالأمر R.'],
     ['تشغيل T1 كمزمن تأخير توصيل (S_ODT) بالزمن الذي حُمّل في السطر السابق',true,'SD = S_ODT، والزمن هو S5T#20S من السطر L.'],
     ['قراءة الزمن المتبقي من T1',false,'القراءة تكون بـ BI أو BCD، وهي غير مستخدمة هنا.']]}},
    {watch:String.raw`<p>الكتاب لم يشرح أسطر <span class="ltr mono">NOP 0</span>. هي ما يولّده برنامج <span class="ltr">STEP 7</span> عند تحويل صندوق مزمن أطرافه <span class="ltr">R</span> و<span class="ltr">BI</span> و<span class="ltr">BCD</span> و<span class="ltr">Q</span> فارغة إلى <span class="ltr">STL</span>، ولا تؤثر على التشغيل.</p>`},
    {title:'مختبر مصغّر: A ثم L ثم SD',widget:(el,B)=>{const lt=s=>`<span class="ltr">${s}</span>`;
      return DCML.lab(el,B,{intro:'هذه <span class="ltr">Network 2</span>. غيّر <span class="ltr">M1.1</span> والزمن منذ صارت <span class="ltr">1</span>، وتابع ما يفعله كل سطر.',
      predict:{q:String.raw`<span class="ltr">M1.1 = 1</span> منذ <span class="ltr">10</span> ثوانٍ. ما قيمة <span class="ltr">T1</span> (تلامسه)؟`,opts:[
       [String.raw`<span class="ltr">1</span>، لأن شرط التشغيل <span class="ltr">A M 1.1</span> متحقق`,false,String.raw`<span class="ltr">SD</span> مزمن تأخير توصيل: يصبح <span class="ltr">1</span> بعد انتهاء الزمن المحمّل لا لحظة تحقق الشرط.`],
       [String.raw`<span class="ltr">0</span>، وباقٍ له <span class="ltr">10</span> ثوانٍ`,true,String.raw`الزمن المحمّل <span class="ltr">S5T#20S</span>، فيصبح <span class="ltr">T1 = 1</span> بعد <span class="ltr">20</span> ثانية ما دامت <span class="ltr">M1.1 = 1</span>.`]]},
      ins:[{k:'m',l:'M1.1',sw:true,v:1,on:lt('M1.1 = 1')+' (طلب عبور)',off:lt('M1.1 = 0')+' (لا طلب)'},
       {k:'t',l:'الزمن منذ صارت M1.1 = 1',min:0,max:30,step:1,v:10,u:'s'}],
      calc:s=>{const el2=s.m?Math.min(s.t,20):0,q=s.m&&s.t>=20?1:0;
       const rows=[['A M 1.1',`RLO = ${s.m}`],['L S5T#20S','ACCU1 = 20 s'],['SD T 1',s.m?(q?'T1 = 1 (انتهى)':`يعدّ: ${el2} / 20 s`):'RLO = 0 ← T1 يُصفَّر'],['NOP 0 ×4','لا عملية']];
       return {pic:`<div style="overflow-x:auto;direction:ltr"><table style="border-collapse:collapse;font-family:var(--mono);font-size:13.5px;width:100%;text-align:left"><tbody>${rows.map(r=>`<tr><td style="padding:3px 8px 3px 0;white-space:nowrap">${r[0]}</td><td style="unicode-bidi:plaintext">${r[1]}</td></tr>`).join('')}</tbody></table></div>`,
        facts:[['RLO',String(s.m)],['ACCU1','20 s'],['T1',String(q),q?'hi':'']],bars:[{l:'زمن T1',v:el2,max:20,txt:el2+' / 20 s',col:q?'--on':'--live'}],
        msg:!s.m?`${lt('M1.1 = 0')}: ${lt('RLO = 0')} عند ${lt('SD T 1')}، فيُصفَّر المزمن فوراً ويبقى ${lt('T1 = 0')}.`:q?`انتهى الزمن ${lt('S5T#20S')} و ${lt('M1.1')} ما زالت ${lt('1')}، فصار ${lt('T1 = 1')} وبدأ ${lt('T2')} في ${lt('Network 3')}.`:`المزمن يعدّ؛ باقٍ ${lt((20-el2)+' s')} حتى يصبح ${lt('T1 = 1')}.`}}})}}
   ]},

  {st:3,short:'Networks 5–9: المخارج',title:'<span class="ltr">Networks 5–9</span>: <span class="ltr">A</span> و<span class="ltr">AN</span> ثم <span class="ltr">=</span>',ref:'ص 124',
   q:'التلامس المغلق في LAD والدائرة الصغيرة في FBD… بأي حرف يُكتبان في STL؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Networks 5 إلى 9 بلغة STL في بطاقات، وبجانب كل بطاقة لون المخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="162" r="146" fill="#E6E2F8"/><g data-tip="Network 5: ⟦AN M 1.1⟧ ثم ⟦= Q 4.1⟧ — الأخضر للسيارات إذا لم يكن هناك طلب."><rect x="22" y="40" width="316" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="42" cy="58" r="11" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="42" y="62" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">5</text><text x="60" y="63" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AN M 1.1 │ = Q 4.1</text><circle cx="320" cy="58" r="8" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 6: ⟦A M 1.1⟧ و ⟦AN T 1⟧ ← ⟦Q4.2⟧ الأصفر."><rect x="22" y="90" width="316" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="42" cy="108" r="11" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="42" y="112" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">6</text><text x="60" y="113" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A M 1.1 │ AN T 1 │ = Q 4.2</text><circle cx="320" cy="108" r="8" fill="#F2C14E" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 7: ⟦A M 1.1⟧ و ⟦A T 1⟧ ← ⟦Q4.3⟧ الأحمر للسيارات."><rect x="22" y="140" width="316" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="42" cy="158" r="11" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="42" y="162" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">7</text><text x="60" y="163" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A M 1.1 │ A T 1 │ = Q 4.3</text><circle cx="320" cy="158" r="8" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 8: ⟦A M 1.1⟧ و ⟦A T 1⟧ و ⟦AN T 2⟧ ← ⟦Q4.4⟧ الأخضر للمشاة."><rect x="22" y="190" width="316" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="42" cy="208" r="11" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="42" y="212" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">8</text><text x="60" y="213" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A M 1.1 │ A T 1 │ AN T 2 │ = Q 4.4</text><circle cx="320" cy="208" r="8" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/></g><g data-tip="Network 9: ⟦AN Q 4.4⟧ ثم ⟦= Q 4.5⟧ — الأحمر للمشاة عكس الأخضر للمشاة."><rect x="22" y="240" width="316" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="42" cy="258" r="11" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="42" y="262" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">9</text><text x="60" y="263" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AN Q 4.4 │ = Q 4.5</text><circle cx="320" cy="258" r="8" fill="#E05A47" stroke="#1E332C" stroke-width="1.5"/></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">كل سطر ⁦A⁩ شرط، و ⁦AN⁩ شرط معكوس</text></svg>`,
   cap:'كل بطاقة <span class="ltr">Network</span>، وبجانبها لون اللمبة التي تشغّلها.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف شرطها.</b>',
   side:[
    {predict:{q:'معنى AN T 1 في Network 6 (الأصفر):',opts:[
     ['و T1 لم ينتهِ بعد',true,'AN = «و ليس»: الأصفر يبقى ما دام T1 = 0.'],
     ['و T1 انتهى',false,'هذا A T 1 بدون N، وهو في Network 7 (الأحمر).'],
     ['أو T1',false,'«أو» تُكتب بالحرف O، ولا توجد في هذا البرنامج.']]}}
   ],
   body:[
    {book:(()=>{const P=B.createPLC(PROG_BOOK);return P.nets.slice(4,9).map(n=>`<div class="net static"><header><h3>Network ${n.i+1}</h3></header>${B.stlTable(n,{trace:[],get:()=>0})}</div>`).join('')})(),ref:'ص 124'},
    {tip:String.raw`<p>الحرف <span class="ltr mono">A</span> = تلامس مفتوح على التوالي = مدخل لبوابة <span class="ltr">&amp;</span>. و<span class="ltr mono">AN</span> = تلامس مغلق = مدخل عليه دائرة النفي. والسطر <span class="ltr mono">=</span> يكتب النتيجة في المخرج. الطرق الثلاث تكتب <b>المنطق نفسه</b>.</p>`,title:'الطرق الثلاث جنباً إلى جنب'},
    {title:'نفّذ البرنامج سطراً سطراً',widget:(el,B)=>{
      const PHN=['الوضع الطبيعي','لحظة الضغط على S1','T1: أصفر','T2: عبور المشاة','T3: إخلاء الطريق','لحظة انتهاء T3'];
      const sim=k=>{const P=B.createPLC(PROG_BOOK);if(k===0){P.scan(0);return P}
        P.set('I0.1',1);P.scan(0);if(k===1)return P;P.set('I0.1',0);P.scan(0);if(k===2)return P;
        P.timer('T1').el=P.timer('T1').tv;P.scan(0);if(k===3)return P;
        P.timer('T2').el=P.timer('T2').tv;P.scan(0);if(k===4)return P;
        P.timer('T3').el=P.timer('T3').tv;P.scan(0);P.scan(0);return P};
      const NM={'I0.1':'S1','Q4.1':'G.C.','Q4.2':'Y.C.','Q4.3':'R.C.','Q4.4':'G.P.','Q4.5':'R.P.'};
      const LMP=[['Q4.1','الخضراء للسيارات',LC.g],['Q4.2','الصفراء للسيارات',LC.y],['Q4.3','الحمراء للسيارات',LC.r],['Q4.4','الخضراء للمشاة',LC.g],['Q4.5','الحمراء للمشاة',LC.r]];
      const lampsH=P=>`<div class="w-facts">${LMP.map(([a,n,c])=>`<div><span><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${P.get(a)?c:'var(--line)'};margin-inline-end:6px"></i>${n} <span class="ltr">${a}</span></span><b>${P.get(a)?'تعمل':'مطفأة'}</b></div>`).join('')}</div>`;
      const segH=(ks,cur,lab,attr)=>`<span class="mseg" style="flex-wrap:wrap">${ks.map(k=>`<button type="button" dir="rtl" style="font-family:var(--font)" ${attr}="${k}" aria-pressed="${k===cur}">${lab(k)}</button>`).join('')}</span>`;
      const WHY={A:'و: شرط',AN:'و ليس: شرط معكوس',S:'إذا RLO = 1: ثبّت (اجعله 1)',R:'إذا RLO = 1: ألغِ (اجعله 0)','=':'اكتب RLO في العنوان',L:'حمّل قيمة الزمن',SD:'شغّل مزمن تأخير التوصيل ما دام RLO = 1',NOP:'لا عملية'};
      let k=1,ni=0,ln=0;
      const draw=()=>{const P=sim(k),net=P.nets[ni],tr=P.trace[ni]||[],n=net.toks.length;
        const rows=net.toks.map((t,j)=>{const p=t.raw.split(/\s+/),op=p[0],arg=p.slice(1).join(' ');const a=arg.replace(/\s+/g,'');
          const val=/^[IQMT]\d/.test(a)&&op!=='L'?` <span class="ltr">(${NM[a]?NM[a]+' ':''}${a} = ${P.get(a)})</span>`:'';
          const done=j<ln,cur=j===ln-1,r=tr[j];
          return `<tr style="${cur?'background:var(--blue-soft);font-weight:700':''}${done?'':';opacity:.45'}"><td class="mono" dir="ltr" style="text-align:left;white-space:nowrap">${t.raw}</td><td>${done?(WHY[op]||'')+val:''}</td><td class="mono" dir="ltr">${done&&r!=null?'RLO = '+r:''}</td></tr>`}).join('');
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">اللحظة:</span>${segH([0,1,2,3,4,5],k,i=>PHN[i],'data-k')}</div>
         <div class="w-row"><span class="w-l">Network:</span>${segH([0,1,2,3,4,5,6,7,8],ni,i=>i+1,'data-n')}</div>
         <div class="tablebox" style="margin-top:10px"><table class="tt" style="font-size:13.5px"><thead><tr><th>السطر</th><th>ماذا يفعل</th><th>النتيجة</th></tr></thead><tbody>${rows}</tbody></table></div>
         <div class="w-row"><button class="btn pri" type="button" data-nx ${ln>=n?'disabled':''}>نفّذ السطر التالي</button><button class="btn" type="button" data-all>نفّذ الكل</button><button class="btn" type="button" data-rs>من البداية</button></div>
         <p class="sub" style="margin-top:8px">${ln>=n?`انتهت Network ${ni+1}. بعد دورة المسح كاملة: <span class="ltr">M1.1 = ${P.get('M1.1')}</span>.`:`نُفّذ ${ln} من ${n} أسطر.`} <b>RLO</b> = نتيجة الشرط حتى هذا السطر.</p>${lampsH(P)}`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;ln=0;draw()});
        el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{ni=+b.dataset.n;ln=0;draw()});
        el.querySelector('[data-nx]').onclick=()=>{ln=Math.min(n,ln+1);draw()};
        el.querySelector('[data-all]').onclick=()=>{ln=n;draw()};
        el.querySelector('[data-rs]').onclick=()=>{ln=0;draw()}};
      draw();
    }},
    {watch:String.raw`<p>السطر الأخير من <span class="ltr">Network 6</span> (<span class="ltr mono">= Q 4.2</span>) مقصوص جزئياً في الطباعة.</p>`,fix:true}
   ]},

  {st:4,short:'المطلوب',title:'المطلوب: من الحاسب إلى الـ <span class="ltr">PLC</span> ثم الاختبار',ref:'ص 125',
   q:'كتبت البرنامج… كيف تتأكد أن الإشارة تعمل كما تقول الشروط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المطلوب: كتابة البرنامج على الحاسب، ثم نقله إلى وحدة PLC، ثم اختبار الإشارة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="1- تنفيذ التمرين على جهاز الحاسب الآلي: اكتب البرنامج بإحدى الطرق الثلاث ⟦LAD⟧ أو ⟦FBD⟧ أو ⟦STL⟧."><rect x="234" y="96" width="96" height="66" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="244" y="106" width="76" height="46" rx="3" fill="#CFE6DB" stroke="#2C4A40" stroke-width="0"/><path d="M260 118L300 118" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M260 128L292 128" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M260 138L300 138" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M282 162L282 176" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><path d="M262 178L302 178" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><text x="282" y="206" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الحاسب</text></g><g data-tip="2- نقل البرنامج من الحاسب إلى وحدة ⟦PLC⟧."><rect x="196" y="110" width="40" height="40" fill="transparent"/><path d="M230 130L214.0 130.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="206.0,130.0 214.0,134.8 214.0,125.2" fill="#2C4A40"/></g><g data-tip="وحدة ⟦PLC⟧: تنفّذ البرنامج، تقرأ المدخل ⟦I0.1⟧ وتشغّل المخارج ⟦Q4.1⟧ إلى ⟦Q4.5⟧."><rect x="134" y="92" width="68" height="82" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="168" y="116" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><circle cx="150" cy="140" r="3.5" fill="#12855A"/><circle cx="162" cy="140" r="3.5" fill="#12855A"/><circle cx="174" cy="140" r="3.5" fill="#12855A"/><circle cx="186" cy="140" r="3.5" fill="#12855A"/><circle cx="150" cy="156" r="3.5" fill="#F2C14E"/><circle cx="162" cy="156" r="3.5" fill="#F2C14E"/><circle cx="174" cy="156" r="3.5" fill="#F2C14E"/><circle cx="186" cy="156" r="3.5" fill="#F2C14E"/></g><g data-tip="3- اختبار صحة عمل الدائرة: اضغط ⟦S1⟧ وتأكد من الأطوار والأزمنة."><rect x="100" y="110" width="36" height="40" fill="transparent"/><path d="M130 130L114.0 130.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="106.0,130.0 114.0,134.8 114.0,125.2" fill="#2C4A40"/></g><g data-tip="الإشارة: اختبر أن اللمبات تتبع شروط التشغيل في كل طور."><rect x="36" y="84" width="36" height="92" rx="7" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><circle cx="54" cy="100" r="10" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="54" cy="130" r="10" fill="#6F857C" stroke="#1E332C" stroke-width="1.5"/><circle cx="54" cy="160" r="10" fill="#3DAE6B" stroke="#1E332C" stroke-width="1.5"/><text x="54" y="206" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الإشارة</text></g><circle cx="282" cy="60" r="13" fill="#2C4A40"/><text x="282" y="65" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><circle cx="218" cy="60" r="13" fill="#2C4A40"/><text x="218" y="65" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><circle cx="118" cy="60" r="13" fill="#2C4A40"/><text x="118" y="65" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3</text><text x="180" y="256" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">اكتب ← انقل ← اختبر</text></svg>`,
   cap:'اكتب البرنامج على الحاسب، ثم انقله إلى وحدة <span class="ltr">PLC</span>، ثم اختبر الإشارة.<br><b>مرّر المؤشر على الحاسب والسهمين ووحدة PLC والإشارة (أو المسها في الجوال) لتعرف كل خطوة.</b>',
   side:[
    {book:String.raw`<p><b>المطلوب:</b> تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة (PLC) واختبار صحة عمل الدائرة.</p>`,ref:'ص 125'},
    {predict:{q:'ضغط أحد المشاة S1 أثناء عبور المشاة (T2). ماذا يحدث؟',opts:[
     ['تبدأ الدورة من جديد',false,'لا يوجد في البرنامج ما يصفّر المزمنات عند الضغط.'],
     ['يتصفّر T2 فيطول وقت العبور',false,'T2 مدخله T1، والضغط لا يغيّر T1.'],
     ['لا شيء: الأمر S يكتب 1 في M1.1 وهي 1 أصلاً',true,'لذلك الضغط أثناء الدورة لا يؤثر حتى تنتهي.']]}}
   ],
   body:[
    {tip:String.raw`<ol><li>الوضع الطبيعي: <span class="ltr">Q4.1</span> و<span class="ltr">Q4.5</span> فقط.</li><li>ضغطة قصيرة على <span class="ltr">S1</span> تبدأ الدورة (لا يلزم الاستمرار في الضغط).</li><li>قِس الأزمنة: أصفر 20 ث، ثم أحمر سيارات + أخضر مشاة 80 ث، ثم أحمر للجميع 20 ث.</li><li>الضغط على <span class="ltr">S1</span> أثناء الدورة لا يؤثر.</li><li>لا يضيء الأخضر للسيارات مع الأخضر للمشاة أبداً.</li></ol><p>وفي تبويب المختبر تستطيع اختيار «زمن مختصر للعرض» لترى الدورة كاملة في 12 ثانية بدل دقيقتين.</p>`,title:'كيف تختبر صحة الدائرة؟'},
    {add:String.raw`<p>إذا ضغط أحد المشاة <span class="ltr">S1</span> مباشرة بعد نهاية الدورة تبدأ دورة جديدة فوراً، فيرى السائقون الأخضر لحظة قصيرة فقط. البرنامج يحقق شروط الكتاب، لكن الإشارات الحقيقية تضيف عادة زمناً أدنى للأخضر قبل قبول طلب جديد.</p>`,title:'للتفكير'},
    {title:'مختبر مصغّر: رتّب ما يجب أن تراه',widget:(el,B)=>DCML.order(el,B,{intro:'أثناء اختبار الدائرة على الجهاز، اضغط ما تراه بالترتيب من البداية إلى نهاية الدورة.',steps:[
     [String.raw`الوضع الطبيعي: أخضر للسيارات وأحمر للمشاة (<span class="ltr">Q4.1</span> و <span class="ltr">Q4.5</span>)`,String.raw`قبل أي ضغطة تكون الإشارة في وضعها الطبيعي.`],
     [String.raw`ضغطة قصيرة على <span class="ltr">S1</span>`,String.raw`لا يتغير شيء قبل طلب العبور.`],
     [String.raw`أصفر للسيارات وأحمر للمشاة: <span class="ltr">20</span> ثانية (<span class="ltr">T1</span>)`,String.raw`بعد الضغط يأتي الأصفر أولاً لتستعد السيارات للتوقف.`],
     [String.raw`أحمر للسيارات وأخضر للمشاة: دقيقة و <span class="ltr">20</span> ثانية (<span class="ltr">T2</span>)`,String.raw`عبور المشاة لا يبدأ قبل أن تتوقف السيارات (بعد الأصفر).`],
     [String.raw`أحمر للسيارات وأحمر للمشاة: <span class="ltr">20</span> ثانية (<span class="ltr">T3</span>)`,String.raw`إخلاء الطريق يأتي بعد عبور المشاة.`],
     [String.raw`عودة إلى الوضع الطبيعي`,String.raw`العودة تأتي بعد انتهاء <span class="ltr">T3</span> فقط.`]],
     done:String.raw`ولا يجوز في أي لحظة أن يضيء الأخضر للسيارات مع الأخضر للمشاة.`})}
   ]},

  {recap:[
   String.raw`<span class="ltr">Network 1</span>: <span class="ltr mono">A I 0.1 / S M 1.1</span> يثبّت الذاكرة، و<span class="ltr mono">A T 3 / R M 1.1</span> يلغيها؛ والإلغاء آخراً فله الأولوية (ص 124).`,
   String.raw`المزمن بثلاثة أوامر: شرط ثم <span class="ltr mono">L S5T#…</span> لتحميل الزمن ثم <span class="ltr mono">SD T n</span>، وأسطر <span class="ltr mono">NOP 0</span> لا تعمل شيئاً.`,
   String.raw`المخارج: <span class="ltr mono">A</span> شرط، و<span class="ltr mono">AN</span> شرط معكوس، و<span class="ltr mono">=</span> يكتب النتيجة؛ وهو المنطق نفسه في <span class="ltr">LAD</span> و<span class="ltr">FBD</span>.`,
   String.raw`المطلوب: تنفيذ البرنامج على الحاسب ونقله إلى وحدة <span class="ltr">PLC</span> واختبار صحة عمل الدائرة (ص 125).`]}
 ],
 theory:[
  {h:'ثالثاً: دائرة (STL) باستخدام (PLC) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 124',html:'<p>هذا هو البرنامج كما طُبع في الكتاب، بما فيه أسطر <span class="mono">NOP 0</span>:</p>'},
  {draw:'stl',caption:'Network 1–9 بلغة STL (منسوخة من الكتاب)',ref:'ص 124'},
  {h:'قراءة Network 1',html:`<table class="tt"><thead><tr><th>السطر</th><th>المعنى</th></tr></thead><tbody>
   <tr><td class="mono">A I 0.1</td><td>هل الضاغط S1 مضغوط؟</td></tr><tr><td class="mono">S M 1.1</td><td>إذا نعم: ثبّت M1.1 = 1</td></tr>
   <tr><td class="mono">A T 3</td><td>هل انتهى زمن T3؟</td></tr><tr><td class="mono">R M 1.1</td><td>إذا نعم: ألغِ M1.1</td></tr>
   <tr><td class="mono">A M 1.1<br>= M 1.1</td><td>خصّص M1.1 لنفسه (مثل ملف M1.1 في LAD)</td></tr></tbody></table>
   <p>لأن R مكتوبة بعد S، فإذا تحقق الشرطان معاً تكون الكلمة الأخيرة للإلغاء، تماماً مثل صندوق SR.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في LAD و FBD يستخدم الكتاب صندوق SR في Network 1، أما في STL فيستخدم أمرَي S و R منفصلين ثم <span class="mono">A M 1.1 / = M 1.1</span> (تخصيص M1.1 لنفسه، زائد لا يغيّر شيئاً). السلوك في الحالتين واحد لأن الإلغاء له الأولوية.'+'</div>'},
  {h:'قراءة Networks المزمنات',html:`<ul><li><span class="mono">A M 1.1</span> شرط التشغيل، ثم <span class="mono">L S5T#20S</span> تحميل قيمة الزمن، ثم <span class="mono">SD T 1</span> تشغيل المزمن كمزمن تأخير توصيل (S_ODT).</li>
   <li>أسطر <span class="mono">NOP 0</span> تعني «لا عملية».</li></ul>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الكتاب لم يشرح أسطر <span class="mono">NOP 0</span>. هي ما يولّده برنامج STEP 7 عند تحويل صندوق مزمن أطرافه R و BI و BCD و Q فارغة إلى STL، ولا تؤثر على التشغيل. كما أن السطر الأخير من Network 6 (<span class="mono">= Q 4.2</span>) مقصوص جزئياً في الطباعة.'+'</div>'},
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
