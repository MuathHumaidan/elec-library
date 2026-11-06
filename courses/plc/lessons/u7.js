/* Unit 7 — التطبيق على محرك الخطوة (ص 126–130) */
(function(B){
const {S,clamp,W}=B;

/* =====================================================================
   Shared material
   ===================================================================== */
// book table, ص 130 — step 1..8 : terminals A,B,C,D (1 = high)
const SEQ=[[0,1,0,1],[0,0,0,1],[1,0,0,1],[1,0,0,0],[1,0,1,0],[0,0,1,0],[0,1,1,0],[0,1,0,0]];
// polarity marks under each step in the book: [top A, right C, bottom B, left D]
const POL=[['-','-','+','+'],['0','-','0','+'],['+','-','-','+'],['+','0','-','0'],['+','+','-','-'],['0','+','0','-'],['-','+','+','-'],['-','0','+','0']];
const DIRTXT=['مائل','أفقي: N يسار','مائل','رأسي','مائل','أفقي: N يمين','مائل','رأسي'];
const arrowOf=k=>135+45*(k-1);          // simplified drawing: N of the rotor points to the poles marked (+)
const kOf=b=>{for(let i=0;i<8;i++){const s=SEQ[i];if(s[0]===b[0]&&s[1]===b[1]&&s[2]===b[2]&&s[3]===b[3])return i+1}return 0};
const polFill=c=>c==='+'?'var(--live)':c==='-'?'var(--blue)':'var(--lamp-off)';
const SIGN={'+':'+','-':'−','0':'0'};

function loops(x1,y1,x2,y2,n){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,seg=len/n,r=seg/2;
 let p=`M${x1} ${y1}`;for(let i=1;i<=n;i++)p+=`A${r} ${r} 0 0 1 ${(x1+ux*seg*i).toFixed(1)} ${(y1+uy*seg*i).toFixed(1)}`;return p}

/* ---------- motor construction, ص 129 (figure without number) ---------- */
function constructionSVG(bits){
 bits=bits||[0,0,0,0];const [A,Bb,C,D]=bits,ac=A||C,bd=Bb||D;
 const term=(x,y,l,on,dx,dy)=>`<circle cx="${x}" cy="${y}" r="6" fill="${on?'var(--on)':'var(--surface)'}" stroke="var(--fg)" stroke-width="1.8"/>`+S.t(x+dx,y+dy,l,on?'':'');
 let s=`<svg viewBox="0 0 300 230" role="img" aria-label="تركيبة محرك الخطوة">`;
 s+=`<circle cx="175" cy="92" r="42" class="coil ${ac||bd?'on':''}"/>`+S.t(175,97,'M1');
 s+=`<path d="${loops(80,46,80,140,5)}" fill="none" stroke="${ac?'var(--live)':'var(--fg)'}" stroke-width="2.4"/>`+S.w('M80 30V46')+S.w('M80 140V156');
 s+=`<path d="${loops(122,192,228,192,5)}" fill="none" stroke="${bd?'var(--live)':'var(--fg)'}" stroke-width="2.4"/>`+S.w('M106 192H122')+S.w('M228 192H244');
 s+=term(80,26,'A',A,-16,5)+term(80,160,'C',C,-16,5)+term(102,192,'B',Bb,0,24)+term(248,192,'D',D,0,24);
 s+=S.mech(92,133,92)+S.mech(175,175,134)+S.mech(175,175,170);
 return s+'</svg>';
}

/* ---------- timing chart of the 8 steps, ص 130 (figure without number) ---------- */
function stepTimingSVG(cur){
 const X0=74,CW=52,rows=[['CLOCK',null],['A',0],['B',1],['C',2],['D',3]];
 let s=`<svg viewBox="0 0 560 210" role="img" aria-label="مخطط خطوات محرك الخطوة">`;
 if(cur)s+=`<rect x="${X0+(cur-1)*CW}" y="4" width="${CW}" height="200" fill="var(--blue-soft)"/>`;
 for(let i=0;i<9;i++){const x=X0+i*CW;s+=`<path d="M${x} 14V204" stroke="var(--blue)" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>`+S.t(x+CW/2,14,String(i%8+1),i===8?'m':'b')}
 rows.forEach(([nm,j],r)=>{const y0=52+r*36,hi=y0-20;s+=S.t(10,y0-4,nm,'','start')+`<path d="M${X0} ${y0}H${X0+9*CW}" stroke="var(--line)"/>`;
  let d='';
  for(let i=0;i<9;i++){const x=X0+i*CW;
   if(j===null){d+=(i?`H${x}`:`M${x} ${y0}`)+`V${hi}H${x+CW/2}V${y0}`;continue}
   const v=SEQ[i%8][j],y=v?hi:y0;d+=(i?`V${y}`:`M${x} ${y}`)+`H${x+CW}`;
   if(v)s+=`<rect x="${x}" y="${hi}" width="${CW}" height="20" fill="var(--on)" opacity=".15"/>`}
  if(j===null)d+=`H${X0+9*CW}`;
  s+=`<path d="${d}" fill="none" stroke="${j===null?'var(--fg)':'var(--on)'}" stroke-width="2.2"/>`;});
 return s+'</svg>';
}

/* ---------- live stepper view: simplified rotor (as drawn in the book) + real shaft at 7.5°/step ---------- */
function stepperSVG(k){
 const cx=130,cy=125,P=k?POL[k-1]:['0','0','0','0'],pos=[[cx,cy-82,'A'],[cx+82,cy,'C'],[cx,cy+82,'B'],[cx-82,cy,'D']];
 let s=`<svg viewBox="0 0 560 250" role="img" aria-label="العضو الدائر لمحرك الخطوة">`;
 s+=`<circle cx="${cx}" cy="${cy}" r="108" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>`;
 pos.forEach(([x,y,l],i)=>{s+=`<circle cx="${x}" cy="${y}" r="21" fill="${polFill(P[i])}" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x,y+4,l+SIGN[P[i]])});
 s+=`<circle cx="${cx}" cy="${cy}" r="52" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
 s+=`<g id="u7arrow" transform="rotate(${k?arrowOf(k):135} ${cx} ${cy})"><rect x="${cx}" y="${cy-11}" width="44" height="22" rx="4" fill="var(--stop)"/><rect x="${cx-44}" y="${cy-11}" width="44" height="22" rx="4" fill="var(--muted)"/>`+
  `<text class="txt" x="${cx+30}" y="${cy+4}" text-anchor="middle" fill="#fff" style="fill:#fff">N</text><text class="txt" x="${cx-30}" y="${cy+4}" text-anchor="middle" style="fill:#fff">S</text></g>`;
 const sx=420,sy=125;
 s+=`<circle cx="${sx}" cy="${sy}" r="104" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/><circle cx="${sx}" cy="${sy}" r="92" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
 for(let i=0;i<48;i++){const a=(i*7.5-90)*Math.PI/180,r1=i%6===0?74:82;s+=`<line x1="${(sx+r1*Math.cos(a)).toFixed(1)}" y1="${(sy+r1*Math.sin(a)).toFixed(1)}" x2="${(sx+90*Math.cos(a)).toFixed(1)}" y2="${(sy+90*Math.sin(a)).toFixed(1)}" stroke="var(--muted)" stroke-width="${i%6===0?2:1}"/>`}
 s+=S.t(sx,sy-60,'0°','m')+S.t(sx+58,sy+4,'90°','m')+S.t(sx,sy+68,'180°','m')+S.t(sx-58,sy+4,'270°','m');
 s+=`<g id="u7shaft"><line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy-80}" stroke="var(--live)" stroke-width="5" stroke-linecap="round"/><circle cx="${sx}" cy="${sy-80}" r="6" fill="var(--live)"/></g><circle cx="${sx}" cy="${sy}" r="10" fill="var(--fg)"/>`;
 return s+'</svg>';
}
function stepperHTML(k,bits){
 return `<div class="svgbox" style="max-width:640px;margin-inline:auto">${stepperSVG(k)}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;font-size:13px;color:var(--muted)"><span>عمود المحرك الفعلي: 7.5° لكل نبضة</span><span>الرسم المبسط كما في ص 130 (يدور 45° في الرسم مع كل خطوة)</span></div>
  <div style="display:flex;gap:18px;justify-content:center;align-items:center;margin-top:10px;flex-wrap:wrap"><span class="sub">الأطراف:</span>${['A','B','C','D'].map((l,i)=>`<div class="lamp ${bits[i]?'on':''}"><i></i><b>${l}</b><span class="mono">${bits[i]}</span></div>`).join('')}
  <span class="sub">الخطوة: <b class="mono" style="color:var(--fg)">${k||'—'}</b></span>
  <div class="svgbox" style="width:150px;margin:0">${constructionSVG(bits)}</div></div>`;
}
function setRot(el,p){
 const a=el.querySelector('#u7arrow'),sh=el.querySelector('#u7shaft');
 if(a)a.setAttribute('transform',`rotate(${p.arrow.toFixed(1)} 130 125)`);
 if(sh)sh.setAttribute('transform',`rotate(${p.shaft.toFixed(2)} 420 125)`);
}
// shared motion bookkeeping: k = new step (0 = no coil pattern)
function moveTo(p,k){
 if(k===p.k)return;
 if(k&&p.k){const d=((k-p.k)+8)%8;const dir=d===1?1:d===7?-1:0;if(dir){p.steps+=dir;p.arrowT+=dir*45;p.shaftT=p.steps*7.5}}
 else if(k){p.arrowT=p.arrowT+(((arrowOf(k)-p.arrowT)%360)+540)%360-180}   // energizing: rotor aligns, not counted as a step
 p.k=k;
}
function animate(p,dt){const f=Math.min(1,dt*14);p.arrow+=(p.arrowT-p.arrow)*f;p.shaft+=(p.shaftT-p.shaft)*f}
const SEQ_TABLE=k=>`<div class="tablebox"><table class="tt"><thead><tr><th>الخطوة</th><th>A</th><th>B</th><th>C</th><th>D</th><th>أعلى</th><th>يمين</th><th>أسفل</th><th>يسار</th><th>المغناطيس</th></tr></thead><tbody>${SEQ.map((r,i)=>`<tr ${k===i+1?'style="background:var(--blue-soft);font-weight:700"':''}><td>${i+1}</td>${r.map(v=>`<td><span class="bit ${v?'one':''}">${v}</span></td>`).join('')}<td class="mono">A${SIGN[POL[i][0]]}</td><td class="mono">C${SIGN[POL[i][1]]}</td><td class="mono">B${SIGN[POL[i][2]]}</td><td class="mono">D${SIGN[POL[i][3]]}</td><td>${DIRTXT[i]}</td></tr>`).join('')}</tbody></table></div>`;
function rotorMini(k){
 const c=60,P=POL[k-1],pos=[[c,22,'A'],[c+38,c,'C'],[c,98,'B'],[c-38,c,'D']];
 let s=`<svg viewBox="0 0 120 128" role="img" aria-label="الخطوة ${k}"><circle cx="${c}" cy="${c}" r="50" fill="var(--surface-2)" stroke="var(--line)"/>`;
 pos.forEach(([x,y,l],i)=>{s+=`<circle cx="${x}" cy="${y}" r="11" fill="${polFill(P[i])}" stroke="var(--fg)"/>`+`<text class="txt" x="${x}" y="${y+4}" text-anchor="middle" font-size="9">${l}${SIGN[P[i]]}</text>`});
 s+=`<g transform="rotate(${arrowOf(k)} ${c} ${c})"><rect x="${c}" y="${c-5}" width="22" height="10" rx="2" fill="var(--stop)"/><rect x="${c-22}" y="${c-5}" width="22" height="10" rx="2" fill="var(--muted)"/></g>`;
 return s+S.t(c,125,'step '+k,'m')+'</svg>';
}

/* ---------- counter box as in الشكل (1-7) (static or live) ---------- */
function counterBoxSVG(o){
 const v=o.v||{},C=x=>x?'live':'',up=o.type==='S_CU';
 let s=`<svg viewBox="0 0 540 230" role="img" aria-label="${o.type} ${o.name}"><path class="w" d="M14 20V214"/>`;
 const contact=(cx,y,l,on)=>`${on?`<rect class="cpass" x="${cx-7}" y="${y-11}" width="14" height="22"/>`:''}<path class="sym" d="M${cx-7} ${y-11}V${y+11}M${cx+7} ${y-11}V${y+11}"/>`+S.t(cx,y-16,l);
 const ins=[[up?'CU':'CD',o.inp[0],v.cu,46],['S',o.inp[1],v.s,92],['R',o.inp[2],v.r,184]];
 ins.forEach(([pin,a,on,y])=>{s+=S.w(`M14 ${y}H${y===46?93:113}`,'live')+contact(y===46?100:120,y,a,on)+S.w(`M${y===46?107:127} ${y}H180`,C(on))});
 s+=S.w('M150 138H180')+S.t(146,142,o.pv,'','end')+(o.live?S.t(146,158,'= '+(v.pv||0),'m','end'):'');
 s+=`<rect class="fbox" x="180" y="24" width="150" height="190" rx="3"/>`+S.t(255,18,o.name)+S.t(255,46,o.type,'b');
 [[up?'CU':'CD',46],['S',92],['PV',138],['R',184]].forEach(([l,y])=>{s+=S.t(186,y+4,l,'','start')});
 [['Q',46],['CV',92],['CV_BCD',138]].forEach(([l,y])=>{s+=S.t(324,y+4,l,'','end')});
 s+=S.w('M330 46H452',C(v.q))+`<path class="sym ${v.q?'hot':''}" d="M454 35Q446 46 454 57M466 35Q474 46 466 57"/>`+(v.q?`<circle cx="460" cy="46" r="5" fill="var(--on)"/>`:'')+S.t(460,28,o.q);
 s+=S.w('M330 92H350')+S.t(356,96,o.live?'... ('+(v.cv||0)+')':'...','m','start');
 s+=S.w('M330 138H350')+S.t(356,142,o.live?'... (W#16#'+String(v.cv||0).padStart(4,'0')+')':'...','m','start');
 return s+'</svg>';
}
const bin16=n=>{const b=(n>>>0).toString(2).padStart(16,'0');return b.replace(/(.{4})/g,'$1 ').trim()};
const hex4=n=>'W#16#'+(n>>>0).toString(16).toUpperCase().padStart(4,'0');
const bcd=n=>{const d=String(n).padStart(3,'0');return '0000 '+d.split('').map(c=>(+c).toString(2).padStart(4,'0')).join(' ')};

/* =====================================================================
   Programs
   ===================================================================== */
// الشكل (1-7) transcribed to STL (the book gives only LAD)
const PROG_CNT=[
 {title:'Network 1 — العداد التصاعدي C1 (S_CU)',ref:'الشكل (1-7) ص 128',read:'كل ضغطة على I0.1 تزيد C1 واحداً، والضغط على I0.2 يضع في العداد القيمة PV المخزنة في MW20، والضغط على I0.0 يصفّر العداد. المخرج Q4.4 = 1 ما دامت قيمة العد أكبر من صفر.',
  stl:['A I 0.1','CU C 1','A I 0.2','L MW 20','S C 1','A I 0.0','R C 1','A C 1','= Q 4.4']},
 {title:'Network 2 — العداد التنازلي C2 (S_CD)',ref:'الشكل (1-7) ص 128',read:'كل ضغطة على I1.1 تنقص C2 واحداً، و I1.2 يضع PV (من MW30)، و I1.0 يصفّر. المخرج Q5.5 = 1 ما دامت قيمة العد أكبر من صفر.',
  stl:['A I 1.1','CD C 2','A I 1.2','L MW 30','S C 2','A I 1.0','R C 2','A C 2','= Q 5.5']}
];
const OUT_NETS=[
 {title:'Network — الطرف A',read:'A = 1 في الخطوات 3 و 4 و 5 (C1 بين 3 و 5).',stl:['L C 1','L 3','>=I','L C 1','L 5','<=I','= Q 4.0']},
 {title:'Network — الطرف B',read:'B = 1 في الخطوات 1 و 7 و 8 (C1 = 1 أو C1 ≥ 7).',stl:['O(','L C 1','L 1','==I',')','O(','L C 1','L 7','>=I',')','= Q 4.1']},
 {title:'Network — الطرف C',read:'C = 1 في الخطوات 5 و 6 و 7.',stl:['L C 1','L 5','>=I','L C 1','L 7','<=I','= Q 4.2']},
 {title:'Network — الطرف D',read:'D = 1 في الخطوات 1 و 2 و 3.',stl:['L C 1','L 1','>=I','L C 1','L 3','<=I','= Q 4.3']}
];
const SEQ_NETS=(clk)=>[
 {title:'Network — مولد النبضات T1 (CLOCK)',read:`أثناء التشغيل (وبعد رفع الإصبع عن S1) يعدّ T1 حتى ${clk==='S5T#200MS'?'0.2':'0.3'} ثانية، فيصبح 1 لدورة مسح واحدة، ثم يصفّر نفسه بالتلامس AN T 1 ويبدأ من جديد: نبضة منتظمة.`,stl:['A M 0.0','AN I 0.1','AN T 1','L '+clk,'SD T 1']},
 {title:'Network — خطوة للأمام',read:'مع كل نبضة، إذا كان S2 = 0 يزيد C1 (العدّ تصاعدي).',stl:['A T 1','AN I 0.2','CU C 1']},
 {title:'Network — خطوة للخلف',read:'مع كل نبضة، إذا كان S2 = 1 ينقص C1 (العدّ تنازلي).',stl:['A T 1','A I 0.2','CD C 1']},
 {title:'Network — بعد الخطوة 8 نعود إلى 1',read:'إذا صار C1 أكبر من 8 يُحمَّل بالقيمة 1.',stl:['L C 1','L 8','>I','L C#1','S C 1']},
 {title:'Network — قبل الخطوة 1 نعود إلى 8',read:'إذا صار C1 صفراً أثناء التشغيل يُحمَّل بالقيمة 8.',stl:['L C 1','L 0','==I','A M 0.0','L C#8','S C 1']}
];
const INIT_NET={title:'Network — تهيئة C1 عند أول تشغيل',read:'إذا كان C1 = 0 (لم يعمل المحرك بعد) وضُغط S1، يُحمَّل C1 بالقيمة 1: تتغذى الخطوة 1 ويثبت العضو الدائر عليها.',stl:['L C 1','L 0','==I','A I 0.1','L C#1','S C 1']};
const num=(nets)=>nets.map((n,i)=>Object.assign({},n,{title:n.title.replace('Network —','Network '+(i+1)+' —'),ref:'من إعداد المحاكاة'}));
const PROG_RUN=num([INIT_NET,
 {title:'Network — التشغيل والإيقاف M0.0',read:'S1 يثبّت M0.0 (التشغيل)، و S0 يلغيه.',stl:['A I 0.1','S M 0.0','A I 0.0','R M 0.0']},
 ...SEQ_NETS('S5T#300MS'),...OUT_NETS]);
const PROG_COUNT=num([
 {title:'Network — تحميل عدد الخطوات المطلوب',read:'عند الضغط على S1 يُحمَّل العداد التنازلي C2 بعدد الخطوات PV المكتوب في MW10، ويُصفَّر العداد التصاعدي C3.',stl:['A I 0.1','L MW 10','S C 2','A I 0.1','R C 3']},
 INIT_NET,
 {title:'Network — التشغيل والإيقاف التلقائي',read:'S1 يثبّت M0.0. ويُلغى M0.0 إذا ضُغط S0 <b>أو</b> إذا كان المحرك يعمل وانتهى العد (C2 = 0).',stl:['A I 0.1','S M 0.0','A I 0.0','O','A M 0.0','AN C 2','R M 0.0']},
 ...SEQ_NETS('S5T#200MS'),
 {title:'Network — عدّ الخطوات',read:'كل نبضة تنقص C2 (المتبقي) وتزيد C3 (المنفّذ).',stl:['A T 1','CD C 2','A T 1','CU C 3']},
 ...OUT_NETS]);

const IO_STEP=[
 {sym:'S0',desc:'ضاغط الإيقاف',addr:'I0.0'},
 {sym:'S1',desc:'ضاغط التشغيل',addr:'I0.1'},
 {sym:'S2',desc:'مفتاح الاتجاه (0 = أمامي، 1 = عكسي)',addr:'I0.2'},
 {sym:'A',desc:'الطرف A لملف الوجه الأول A–C',addr:'Q4.0'},
 {sym:'B',desc:'الطرف B لملف الوجه الثاني B–D',addr:'Q4.1'},
 {sym:'C',desc:'الطرف C لملف الوجه الأول A–C',addr:'Q4.2'},
 {sym:'D',desc:'الطرف D لملف الوجه الثاني B–D',addr:'Q4.3'}
];
const IO_STEP_MEM=[{sym:'M0.0',desc:'ذاكرة التشغيل',addr:'M0.0'},{sym:'T1',desc:'مولد النبضات (CLOCK)',addr:'T1'},{sym:'C1',desc:'رقم الخطوة الحالية 1…8',addr:'C1'}];
function ioHTML(rows,P){return `<div class="tablebox"><table class="io"><thead><tr><th>الرمز</th><th>الوصف</th><th>العنوان</th>${P?'<th>الحالة</th>':''}</tr></thead><tbody>${rows.map(r=>{const v=P?P.get(r.addr):0;return `<tr class="${P&&v?'hi':''}"><td class="mono">${r.sym}</td><td>${r.desc}</td><td class="mono">${r.addr}</td>${P?`<td><span class="bit ${v?'one':''}">${r.addr[0]==='C'?(P.cnt[r.addr]?P.cnt[r.addr].v:0):v}</span></td>`:''}</tr>`}).join('')}</tbody></table></div>`}
const NAMES_STEP={'I0.0':'S0','I0.1':'S1','I0.2':'S2','Q4.0':'A','Q4.1':'B','Q4.2':'C','Q4.3':'D'};
const staticNets=(prog,view)=>{const P=B.createPLC(prog);return P.nets.map(n=>`<div class="net static"><header><h3>${n.title}</h3><span class="ref">${n.ref}</span></header>${n.read?`<p class="read-as">${n.read}</p>`:''}${view==='stl'?B.stlTable(n,{trace:[]}):`<div class="svgbox fixed">${(view==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,NAMES_STEP)}</div>`}</div>`).join('')};

const NOT_BOOK='<b>برنامج من إعداد المحاكاة، ليس من الكتاب.</b>';

/* =================== Lesson 7.1 — counters =================== */
B.lesson({
 id:'u7-l1',unit:7,order:1,pages:'126–128',
 title:'العدادات: أنواعها ومداخلها ومخارجها',
 summary:'العداد التصاعدي S_CU والتنازلي S_CD، ومداخلهما CU و CD و S و PV و R، ومخارجهما Q و CV و CV_BCD، مع منضدة تجارب للشكل (1-7).',
 theory:[
  {h:'محتويات الوحدة السابعة',ref:'ص 126',html:`<p>«الوحدة السابعة: تطبيق على محرك الخطوة»، وفيها:</p><ul><li><b>أولاً:</b> العدادات: أنواعها وطريقة عملها واستخداماتها.</li><li><b>ثانياً:</b> فكرة عمل محرك الخطوة.</li><li><b>ثالثاً:</b> كتابة برنامج للتحكم بمحرك الخطوة باستخدام (PLC) باللغة (LAD).</li></ul>
   <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات. <b>الأهداف:</b> أن يعرف المتدرب طريقة التحكم في محرك الخطوة، وأن يكتب برنامجاً للتحكم فيه. <b>مستوى الأداء:</b> 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {h:'أولاً: العدادات — 1- مقدمة',ref:'ص 127',html:'<p>«تستخدم العدادات في التطبيقات الصناعية على نطاق واسع، لعدة أغراض منها القيام بعدّ منتج معين في أحد خطوط الإنتاج. كما تستخدم في أغراض التحكم في المزمنات وذلك باستخدام التغير الذي يحدث في الخرج من هذه العدادات.»</p>'},
  {h:'2- أنواع العدادات',ref:'ص 127',html:`<ol><li><b>العداد التصاعدي (CU):</b> يعدّ تصاعدياً من الصفر إلى القيمة المحددة للعداد.</li><li><b>العداد التنازلي (CD):</b> يعدّ تنازلياً من القيمة المحددة للعداد إلى الصفر.</li></ol><p>«ويشبه تمثيل العداد إلى حد كبير تمثيل المزمن»، وله عدد من المداخل وعدد من المخارج.</p>`},
  {h:'المداخل',ref:'ص 127',html:`<ol><li><b>CU:</b> يُستخدم عندما يعمل العداد تصاعدياً. يستمر العد في الزيادة حتى القيمة المحددة مسبقاً أو حتى الرقم <b>999</b> وهو أقصى قيمة للعد، ثم يتوقف العداد، أو عند وصول إشارة فصل إلى الطرف R يُفصل العداد مباشرة.</li>
   <li><b>R:</b> طرف الفصل (Reset)، يُستخدم لفصل العداد في أي لحظة من لحظات العد.</li>
   <li><b>CD:</b> يُستخدم عندما يعمل العداد تنازلياً. يستمر العد في التناقص من القيمة المحددة مسبقاً أو من الرقم 999 إلى أن يصل إلى الصفر، ثم يتوقف، أو يُفصل مباشرة بإشارة على R.</li>
   <li><b>PV:</b> تحدد القيمة العددية للعد، للعدادين التصاعدي أو التنازلي.</li></ol><p><b>S:</b> «مدخل لإعادة تصفير العداد. للعدادين التصاعدي أو التنازلي» (هكذا في الكتاب).</p>`},
  {err:'وصف المدخل <b>S</b> بأنه «لإعادة تصفير العداد» غير دقيق. في عدادات Siemens (S_CU و S_CD) الطرف <b>S يضع في العداد القيمة PV</b> لحظة تغيّره من 0 إلى 1، أما التصفير فيكون بالطرف <b>R</b> الذي وصفه الكتاب نفسه بأنه طرف الفصل. وجاء المدخل S في الكتاب خارج الترقيم بعد البند 4. جرّب ذلك في المختبر: اضغط S فتصبح القيمة = PV وليس صفراً.'},
  {h:'المخارج',ref:'ص 128',html:`<p>«هناك ثلاثة مخارج للعداد التصاعدي والتنازلي»:</p><ol><li><b>CV:</b> خرج للعداد «بالنظام السداسي عشر»، وهذه الإشارات مستخدمة في التطبيقات الإلكترونية.</li><li><b>BCD:</b> خرج للعداد بالنظام الثنائي المشفّر، مستخدم في التطبيقات الإلكترونية.</li><li><b>Q:</b> خرج للعداد بالإشارة الكهربائية، مستخدم في دوائر التحكم الكهربائية.</li></ol>`},
  {err:'الخرج <b>CV</b> هو قيمة العد كعدد صحيح <b>ثنائي</b> (binary)، والنظام السداسي عشر مجرد طريقة لعرض هذا العدد. والخرج الثاني اسمه في الشكل (1-7) <span class="mono">CV_BCD</span> بينما يسميه النص «BCD»: كل خانة عشرية فيه مكتوبة بأربع خانات ثنائية. جرّب الأداة التالية.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اكتب رقماً بين 0 و 999 وقارن بين طريقة كتابة CV و CV_BCD.'},
  {widget:(el)=>{let n=25;const draw=()=>{el.innerHTML=`<div class="fig"><label style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">قيمة العد: <input type="number" min="0" max="999" value="${n}" style="font:inherit;width:90px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)"></label>
     <div class="facts"><div class="fact"><span>العدد العشري</span><b>${n}</b></div><div class="fact"><span>CV ثنائي (16 خانة)</span><b style="font-size:14px">${bin16(n)}</b></div><div class="fact"><span>نفس CV مكتوباً بالسداسي عشر</span><b>${hex4(n)}</b></div><div class="fact"><span>CV_BCD</span><b style="font-size:14px">${bcd(n)}</b></div></div>
     <p class="sub">في BCD كل رقم عشري (${String(n).split('').join(' و ')}) يأخذ 4 خانات مستقلة، ولذلك يسهل عرضه على شاشة أرقام إلكترونية.</p></div>`;
    const i=el.querySelector('input');i.oninput=()=>{n=clamp(Math.round(+i.value||0),0,999);const pos=i.selectionStart;draw();const j=el.querySelector('input');j.focus();try{j.setSelectionRange(pos,pos)}catch(e){}}};draw()}},
  {fig:'(1-7)',ref:'ص 128',caption:'العداد العلوي «عداد تصاعدي» S_CU (C1)، والسفلي «عداد تنازلي» S_CD (C2)',draw:()=>`<div class="svgbox">${counterBoxSVG({type:'S_CU',name:'C1',inp:['I0.1','I0.2','I0.0'],pv:'MW20',q:'Q4.4'})}</div><p class="sub" style="text-align:center">عداد تصاعدي</p><div class="svgbox">${counterBoxSVG({type:'S_CD',name:'C2',inp:['I1.1','I1.2','I1.0'],pv:'MW30',q:'Q5.5'})}</div><p class="sub" style="text-align:center">عداد تنازلي</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — متى يصبح Q = 1؟</b> الكتاب لم يشرح ذلك. في عدادات Siemens يكون Q = 1 ما دامت قيمة العد <b>أكبر من صفر</b> (وليس عند الوصول إلى PV). والعد التصاعدي لا يتوقف عند PV بل عند 999، والتنازلي يتوقف عند الصفر.'},
  {err:'صياغة العداد التنازلي «يتناقص من القيمة المحددة مسبقاً أو من الرقم 999» ملتبسة: العداد يعدّ تنازلياً من القيمة الموجودة فيه (التي وضعها الطرف S من PV) نحو الصفر.'},
  {h:'جدول المداخل والمخارج للشكل (1-7)',ref:'ص 128',html:'<p>الكتاب لم يضع جدولاً لهذا الشكل؛ الجدول التالي مستنتج من العناوين المكتوبة على الشكل (1-7):</p>'},
  {draw:'io',caption:'العناوين كما في الشكل (1-7). القيمة PV تُقرأ من كلمة الذاكرة MW20 للعداد C1 و MW30 للعداد C2',ref:'ص 128'},
  {h:'الشكل (1-7) في المحاكاة',html:'<p>الكتاب يعطي الشكل بلغة LAD فقط؛ حوّلناه إلى STL المكافئ لتعمل عليه المحاكاة. المحاكي يرسم كل طرف من أطراف الصندوق كملف مستقل: CU، و SC (تحميل PV)، و R، ثم تلامس العداد إلى المخرج.</p>'},
  {draw:'stl',caption:'الشكل (1-7) محوّلاً إلى STL (تحويل المحاكاة)',ref:'ص 128'}
 ],
 io:[
  {sym:'CU',desc:'مدخل العد التصاعدي للعداد C1',addr:'I0.1'},{sym:'S',desc:'مدخل S للعداد C1 (وضع القيمة PV)',addr:'I0.2'},{sym:'R',desc:'مدخل الفصل R للعداد C1',addr:'I0.0'},
  {sym:'C1',desc:'العداد التصاعدي S_CU',addr:'C1'},{sym:'Q-C1',desc:'مخرج Q للعداد C1',addr:'Q4.4'},
  {sym:'CD',desc:'مدخل العد التنازلي للعداد C2',addr:'I1.1'},{sym:'S',desc:'مدخل S للعداد C2 (وضع القيمة PV)',addr:'I1.2'},{sym:'R',desc:'مدخل الفصل R للعداد C2',addr:'I1.0'},
  {sym:'C2',desc:'العداد التنازلي S_CD',addr:'C2'},{sym:'Q-C2',desc:'مخرج Q للعداد C2',addr:'Q5.5'}
 ],
 inputs:[
  {id:'CU1',addr:'I0.1',type:'push',color:'green',label:'CU · I0.1'},{id:'S1',addr:'I0.2',type:'push',color:'blue',label:'S · I0.2'},{id:'R1',addr:'I0.0',type:'push',color:'red',label:'R · I0.0'},
  {id:'CD2',addr:'I1.1',type:'push',color:'black',label:'CD · I1.1'},{id:'S2',addr:'I1.2',type:'push',color:'blue',label:'S · I1.2'},{id:'R2',addr:'I1.0',type:'push',color:'red',label:'R · I1.0'}
 ],
 program:PROG_CNT,
 plant:{
  title:'منضدة العدادات (الشكل 1-7)',
  init:()=>({pv1:5,pv2:3}),
  step(dt,st,p){st.plc.words.MW20=p.pv1;st.plc.words.MW30=p.pv2},
  render(el,st,p){
   if(!el.querySelector('#u7wb')){
    const card=(k,t,pvName)=>`<div class="card" style="min-width:0"><h3>${t}</h3><label style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:14px">القيمة المحددة PV = <span class="mono">${pvName}</span>
      <button class="btn" data-pvd="${k}" data-d="-1" aria-label="إنقاص">−</button><input data-pv="${k}" type="number" min="0" max="999" value="${p['pv'+k]}" style="font:inherit;width:76px;padding:3px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)"><button class="btn" data-pvd="${k}" data-d="1" aria-label="زيادة">+</button></label><div id="u7c${k}"></div></div>`;
    el.innerHTML=`<div id="u7wb" class="cards" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr))">${card(1,'C1 — عداد تصاعدي S_CU','MW20')}${card(2,'C2 — عداد تنازلي S_CD','MW30')}</div>
     <p class="sub" style="margin-top:8px">غيّر PV ثم اضغط S ليُحمَّل في العداد. المدخل يعدّ مرة واحدة مع كل ضغطة (عند تغيّر الإشارة من 0 إلى 1) مهما طال الضغط.</p>`;
    el.querySelectorAll('[data-pv]').forEach(i=>i.addEventListener('input',()=>{p['pv'+i.dataset.pv]=clamp(Math.round(+i.value||0),0,999)}));
    el.querySelectorAll('[data-pvd]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pvd;p['pv'+k]=clamp(p['pv'+k]+(+b.dataset.d),0,999);el.querySelector(`[data-pv="${k}"]`).value=p['pv'+k]}));
   }
   [[1,'S_CU',['I0.1','I0.2','I0.0'],'MW20','Q4.4'],[2,'S_CD',['I1.1','I1.2','I1.0'],'MW30','Q5.5']].forEach(([k,ty,inp,pvn,q])=>{
    const cv=st.C('C'+k).v,v={cu:st.I(inp[0]),s:st.I(inp[1]),r:st.I(inp[2]),q:st.Q(q),cv,pv:p['pv'+k]};
    el.querySelector('#u7c'+k).innerHTML=`<div class="svgbox">${counterBoxSVG({type:ty,name:'C'+k,inp,pv:pvn,q,live:1,v})}</div>
     <div class="facts"><div class="fact"><span>قيمة العد CV (عشري)</span><b style="font-size:26px">${cv}</b></div><div class="fact"><span>CV ثنائي</span><b style="font-size:13px">${bin16(cv)}</b></div><div class="fact"><span>CV_BCD</span><b style="font-size:13px">${bcd(cv)}</b></div><div class="fact"><span>المخرج ${q}</span><b style="color:${v.q?'var(--on)':'var(--muted)'}">${v.q?'1 (العد > 0)':'0'}</b></div></div>`;});
  },
  sig:p=>p.pv1+'|'+p.pv2,
  label:()=>'',
  readouts:[{l:'C1',v:(p,s)=>s.C('C1').v},{l:'C2',v:(p,s)=>s.C('C2').v}]
 },
 plcNote:'المحاكي يرسم صندوق العداد كملفات مستقلة: CU أو CD للعد، و SC لوضع القيمة PV (طرف S)، و R للتصفير. تلامس العداد C1 في LAD يعني «قيمة العد أكبر من صفر».',
 steps:[
  {t:'الوضع الابتدائي',x:'العدادان قيمتهما 0، والمخرجان Q4.4 و Q5.5 مطفآن. PV للعداد C1 = 5 و للعداد C2 = 3 (تستطيع تغييرهما).'},
  {t:'عدّ تصاعدياً',x:'اضغط CU1 (I0.1) ثلاث مرات. تزيد قيمة C1 واحداً مع كل ضغطة. لاحظ أن Q4.4 أضاء من أول عدّة.',done:s=>s.C('C1').v>=3},
  {t:'الضغط الطويل يُحسب مرة',x:'اضغط CU1 مطوّلاً: تزيد القيمة 1 فقط، لأن العداد يعدّ عند تغيّر الإشارة من 0 إلى 1.'},
  {t:'المدخل S',x:'اضغط S1 (I0.2). تصبح قيمة C1 = PV (5) وليس صفراً. هذا هو التصحيح على عبارة الكتاب.',done:s=>s.C('C1').v===s.plant.pv1&&s.btn('S1')},
  {t:'المدخل R',x:'اضغط R1 (I0.0): يُصفَّر العداد فوراً وينطفئ Q4.4.',done:s=>s.C('C1').v===0&&s.btn('R1')},
  {t:'العداد التنازلي',x:'اضغط S2 (I1.2) لتحميل C2 بالقيمة PV = 3. يضيء Q5.5.',done:s=>s.C('C2').v>0},
  {t:'عدّ تنازلياً حتى الصفر',x:'اضغط CD2 (I1.1) حتى تصل القيمة إلى 0: ينطفئ Q5.5 ويتوقف العد عند الصفر.',done:s=>s.C('C2').v===0&&!s.Q('Q5.5')&&s.btn('CD2')},
  {t:'راقب الأنظمة العددية',x:'عُد إلى C1 واضغط CU1 عدة مرات. قارن بين CV الثنائي و CV_BCD في البطاقة: عند 10 مثلاً يختلفان.'}
 ],
 quiz:[
  {q:'العداد الذي يعدّ من الصفر إلى القيمة المحددة هو:',o:['العداد التنازلي CD','العداد التصاعدي CU','المزمن S_ODT','دالة SR'],c:1,e:'ص 127: التصاعدي من الصفر إلى القيمة المحددة.'},
  {q:'ما أقصى قيمة للعد حسب الكتاب؟',o:['99','255','999','9999'],c:2,e:'«حتى الرقم (999) وهو أقصى قيمة للعد».'},
  {q:'ما وظيفة الطرف R للعداد؟',o:['العدّ التصاعدي','فصل (تصفير) العداد في أي لحظة','تحديد القيمة','إخراج BCD'],c:1,e:'R = Reset.'},
  {q:'ما وظيفة الطرف PV؟',o:['تحديد القيمة العددية للعد','تصفير العداد','العد التنازلي','إخراج الإشارة الكهربائية'],c:0,e:'ص 127.'},
  {q:'في عدادات Siemens، ماذا يحدث فعلياً عند الضغط على الطرف S؟',o:['يُصفَّر العداد','توضع في العداد القيمة PV','يعدّ واحداً','يتوقف العد'],c:1,e:'الكتاب كتب «إعادة تصفير»، والصحيح أن S يحمّل PV، والتصفير بالطرف R.'},
  {q:'أي مخرج يُستخدم في دوائر التحكم الكهربائية؟',o:['CV','CV_BCD','Q','PV'],c:2,e:'ص 128: Q خرج بالإشارة الكهربائية.'},
  {q:'في الشكل (1-7) ما المدخل الموصول على CU للعداد C1؟',o:['I0.0','I0.1','I0.2','I1.1'],c:1,e:'CU = I0.1، و S = I0.2، و R = I0.0، و PV = MW20.'},
  {q:'قيمة العد 12. كيف يُكتب CV_BCD؟',o:['0000 0000 0000 1100','0000 0000 0001 0010','0000 0000 1100 0000','0000 0001 0000 0010'],c:1,e:'BCD: الرقم 1 = 0001 والرقم 2 = 0010. أما 1100 فهو 12 بالثنائي (CV).'}
 ]
});

/* =================== Lesson 7.2 — stepper motor (manual book sequence / simulation PLC program) =================== */
function stepperLab(el,B){
 let mode='book',view='lad',auto=false,dir=1,acc=0,speed=0.6;
 const m={k:1,steps:0,arrow:arrowOf(1),arrowT:arrowOf(1),shaft:0,shaftT:0,rev:false};       // manual
 const q={k:0,steps:0,arrow:135,arrowT:135,shaft:0,shaftT:0,rev:false,ran:false,stopped:false}; // PLC
 let P=B.createPLC(PROG_RUN);const btn={S0:0,S1:0},sw={S2:0};let stepI=0,lastSig='',lastK=-1,last=performance.now();
 const STEPS=[
  {t:'الخطوة 1',x:'في «تسلسل الكتاب يدوياً» تبدأ من الخطوة 1: الطرفان B و D عليهما جهد (1). لاحظ الصف المظلل في الجدول وعمود الخطوة في المخطط.',ok:()=>true,next:1},
  {t:'نبضة واحدة',x:'اضغط «الخطوة التالية». يتغير نمط الأطراف إلى الخطوة 2 (D فقط) ويدور عمود المحرك 7.5°.',ok:()=>m.steps>=1},
  {t:'دورة الجدول كاملة',x:'تابع حتى تمر بالخطوات الثماني وتعود إلى الخطوة 1: العمود دار 8 × 7.5 = 60°.',ok:()=>m.steps>=8},
  {t:'اعكس الاتجاه',x:'اضغط «الخطوة السابقة» (أو اختر «عكسي» مع التشغيل التلقائي): نقرأ الجدول من الأسفل للأعلى فيدور المحرك في الاتجاه المعاكس.',ok:()=>m.rev},
  {t:'انتقل إلى برنامج PLC',x:'اختر من الأعلى «برنامج PLC (من إعداد المحاكاة، ليس من الكتاب)».',ok:()=>mode==='plc'},
  {t:'شغّل بالضاغط S1',x:'اضغط S1. تتغذى الخطوة 1، ثم يولّد المزمن T1 نبضة كل 0.3 ثانية فيزيد العداد C1 ويتقدم المحرك خطوة.',ok:()=>q.ran&&q.steps>=3},
  {t:'اعكس بالمفتاح S2',x:'حرّك المفتاح S2 إلى 1: يصبح العداد C1 تنازلياً فيدور المحرك عكسياً.',ok:()=>q.rev},
  {t:'أوقف بالضاغط S0',x:'اضغط S0. يتوقف توليد النبضات لكن الخطوة الأخيرة تبقى متغذية فيثبت العضو الدائر مكانه.',ok:()=>q.stopped}
 ];
 const segH=`<div class="variant"><span>طريقة التشغيل:</span><div class="seg" role="group"><button data-mode="book" aria-pressed="${mode==='book'}">تسلسل الكتاب يدوياً</button><button data-mode="plc" aria-pressed="${mode==='plc'}">برنامج PLC (من إعداد المحاكاة، ليس من الكتاب)</button></div>
  ${mode==='plc'?`<div class="callout err">${NOT_BOOK} الكتاب يعد في ص 126 ببرنامج LAD للمحرك لكنه غير موجود في الوحدة. هذا البرنامج كتبناه لتجربة تشغيل المحرك بالـ PLC: عداد C1 رقمه رقم الخطوة، ومزمن T1 يولّد النبضات.</div>`:`<p class="sub">تنفّذ بيدك جدول الخطوات الثماني كما في ص 130: كل ضغطة = نبضة CLOCK واحدة.</p>`}</div>`;
 function build(){
  const ctl=mode==='book'?`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="prev">◀ الخطوة السابقة (عكسي)</button><button class="btn primary" data-act="next">الخطوة التالية (أمامي) ▶</button>
     <label class="toggle" style="margin:0"><input type="checkbox" id="u7auto" ${auto?'checked':''}> نبضات تلقائية</label>
     <div class="seg" role="group"><button data-dir="1" aria-pressed="${dir===1}">أمامي</button><button data-dir="-1" aria-pressed="${dir===-1}">عكسي</button></div>
     <button class="btn" data-act="reset">إعادة</button></div>`
   :`<div class="pbs" style="align-items:center"><button class="pb red" data-pb="S0" aria-label="إيقاف"><span class="cap">S0</span><small>إيقاف I0.0</small></button><button class="pb green" data-pb="S1" aria-label="تشغيل"><span class="cap">S1</span><small>تشغيل I0.1</small></button>
     <button class="sw" data-sw="S2" aria-pressed="${sw.S2?'true':'false'}"><span class="knob"></span><b>S2</b><small>عكسي I0.2</small></button><button class="btn" data-act="preset">إعادة المحاكاة</button></div>`;
  el.innerHTML=segH+`<div class="grid"><div class="panel c7"><h2>محرك الخطوة <small id="u7lbl"></small></h2>${ctl}<div id="u7view" style="margin-top:8px"></div><div class="facts" id="u7facts"></div></div>
   <div class="panel c5"><h2>جدول الخطوات <small>ص 130</small></h2><div id="u7tbl"></div><h3 class="sm">المخطط الزمني <small style="color:var(--muted);font-weight:500">ص 130</small></h3><div class="svgbox" id="u7tim"></div></div>
   ${mode==='plc'?`<div class="panel c8"><div class="viewseg"><h2>البرنامج يعمل الآن <small>من إعداد المحاكاة</small></h2><div class="seg" role="group">${['lad','fbd','stl'].map(v=>`<button data-view="${v}" aria-pressed="${view===v}">${v.toUpperCase()}</button>`).join('')}</div></div><div id="u7nets"></div></div>
   <div class="panel c4"><h2>جدول المداخل والمخارج <small>من إعداد المحاكاة</small></h2><div id="u7io"></div><p class="sub" style="margin-top:8px">علامات داخلية:</p><div id="u7mem"></div></div>`:''}
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="u7steps"></ol></div></div>`;
  el.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;lastSig='';lastK=-1;build()});
  el.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='next')pulse(m,1);if(a==='prev')pulse(m,-1);
   if(a==='reset')Object.assign(m,{k:1,steps:0,arrow:arrowOf(1),arrowT:arrowOf(1),shaft:0,shaftT:0});
   if(a==='preset'){P=B.createPLC(PROG_RUN);Object.assign(q,{k:0,steps:0,arrow:135,arrowT:135,shaft:0,shaftT:0});sw.S2=0;build()}lastK=-1});
  const au=el.querySelector('#u7auto');if(au)au.onchange=()=>{auto=au.checked;acc=0};
  el.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{dir=+b.dataset.dir;el.querySelectorAll('[data-dir]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  el.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;el.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',x===b));lastSig=''});
  el.querySelectorAll('[data-pb]').forEach(b=>{const k=b.dataset.pb;let t0=0;
   b.addEventListener('pointerdown',e=>{e.preventDefault();btn[k]=1;t0=performance.now();b.classList.add('down')});
   const up=()=>{if(!btn[k])return;setTimeout(()=>{btn[k]=0;b.classList.remove('down')},Math.max(0,260-(performance.now()-t0)))};
   ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,up));
   b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();btn[k]=1;t0=performance.now();b.classList.add('down')}});b.addEventListener('keyup',up)});
  el.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{sw.S2=sw.S2?0:1;b.setAttribute('aria-pressed',sw.S2?'true':'false')});
  el.querySelector('#u7steps').addEventListener('click',e=>{if(e.target.closest('[data-next]')){stepI++;drawSteps()}if(e.target.closest('[data-restart]')){stepI=0;drawSteps()}});
  drawSteps();
 }
 function pulse(s,d){s.k=((s.k-1+d)%8+8)%8+1;s.steps+=d;s.arrowT+=d*45;s.shaftT=s.steps*7.5;if(d<0)s.rev=true}
 function drawSteps(){const o=el.querySelector('#u7steps');if(!o)return;
  o.innerHTML=STEPS.map((s,i)=>`<li class="${i<stepI?'done':i===stepI?'cur':''}"><span class="k">${i<stepI?'✓':i+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${i===stepI?`<div class="act">${s.next?'<button class="btn primary" data-next>التالي</button>':'<span class="hint">بانتظار تنفيذك…</span>'}</div>`:''}</div></li>`).join('')+
  (stepI>=STEPS.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">انتقل إلى الدرس التالي لتجعل العداد يحدد عدد الخطوات ثم يوقف المحرك.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')}
 function frame(now){
  if(!document.body.contains(el))return;
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  let s,bits;
  if(mode==='book'){if(auto){acc+=dt;if(acc>=speed){acc=0;pulse(m,dir)}}s=m;bits=SEQ[m.k-1]}
  else{P.set('I0.0',btn.S0);P.set('I0.1',btn.S1);P.set('I0.2',sw.S2);P.scan(dt);bits=['Q4.0','Q4.1','Q4.2','Q4.3'].map(a=>P.get(a));
   const before=q.steps;moveTo(q,kOf(bits));if(q.steps<before)q.rev=true;if(P.get('M0.0'))q.ran=true;if(q.ran&&q.steps!==0&&!P.get('M0.0')&&q.rev)q.stopped=true;s=q}
  animate(s,dt);
  const k=s.k;
  if(k!==lastK){lastK=k;const v=el.querySelector('#u7view');if(v)v.innerHTML=stepperHTML(k,bits);
   const t=el.querySelector('#u7tbl');if(t)t.innerHTML=SEQ_TABLE(k);const tm=el.querySelector('#u7tim');if(tm)tm.innerHTML=stepTimingSVG(k)}
  const v=el.querySelector('#u7view');if(v)setRot(v,s);
  const f=el.querySelector('#u7facts');if(f)f.innerHTML=`<div class="fact"><span>الخطوات المنفّذة</span><b>${s.steps}</b></div><div class="fact"><span>زاوية العمود</span><b>${(s.steps*7.5).toFixed(1)}°</b></div><div class="fact"><span>الدورات (48 نبضة = دورة، استنتاج)</span><b>${(s.steps/48).toFixed(2)}</b></div>`;
  const lb=el.querySelector('#u7lbl');if(lb)lb.textContent=mode==='book'?'تشغيل يدوي':(P.get('M0.0')?(sw.S2?'يدور عكسياً':'يدور أمامياً'):'متوقف');
  if(mode==='plc'){const sg=JSON.stringify([P.mem,P.cnt.C1&&P.cnt.C1.v,P.tim.T1&&P.tim.T1.q,view]);
   if(sg!==lastSig){lastSig=sg;const n=el.querySelector('#u7nets');
    if(n)n.innerHTML=P.nets.map(nt=>`<div class="net"><header><h3>${nt.title}</h3><span class="ref">${nt.ref}</span></header><p class="read-as">${nt.read}</p>${view==='stl'?B.stlTable(nt,P):`<div class="svgbox fixed">${(view==='lad'?B.ladNetwork:B.fbdNetwork)(nt,P,NAMES_STEP)}</div>`}</div>`).join('');
    const io=el.querySelector('#u7io');if(io)io.innerHTML=ioHTML(IO_STEP,P);const mm=el.querySelector('#u7mem');if(mm)mm.innerHTML=ioHTML(IO_STEP_MEM,P)}}
  if(stepI<STEPS.length&&!STEPS[stepI].next&&STEPS[stepI].ok()){stepI++;drawSteps()}
  requestAnimationFrame(frame);
 }
 build();requestAnimationFrame(frame);
}

B.lesson({
 id:'u7-l2',unit:7,order:2,pages:'129–130',
 title:'محرك الخطوة وتسلسل تغذية ملفاته',
 summary:'محرك الخطوة ذو الوجهين يتحرك 7.5° مع كل نبضة. ننفذ جدول الخطوات الثماني من الكتاب يدوياً، ثم نشغّله ببرنامج PLC من إعداد المحاكاة.',
 theory:[
  {h:'ثانياً: تعريف محرك الخطوة',ref:'ص 129',html:'<p>«محرك الخطوة تمت دراسته في مادة الآلات بشكل مفصل من ناحية الأنواع والتركيب والاستخدام. وبشكل مختصر للنوع المستخدم في هذا التطبيق هو <b>محرك ذو وجهين</b> يتحرك العضو الدائر <b>(7.5) درجة في كل نبضة توصيل</b>. لذلك نحتاج إلى العدادات في عملية التشغيل.» والشكل يوضح تركيبة المحرك.</p>'},
  {fig:'',ref:'ص 129',caption:'تركيبة المحرك (شكل بلا رقم في الكتاب): المحرك M1، وملف الوجه الأول طرفاه A و C، وملف الوجه الثاني طرفاه B و D',draw:()=>`<div class="svgbox" style="max-width:340px;margin-inline:auto">${constructionSVG()}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> إذا كانت كل نبضة تحرك العضو الدائر 7.5°، فالدورة الكاملة تحتاج <span class="ltr">360 ÷ 7.5 = 48</span> نبضة. هذا استنتاج حسابي، والكتاب لم يذكره. وفي صفحة المحتويات سُمّي هذا الجزء «فكرة عمل محرك الخطوة» وفي المتن «تعريف محرك الخطوة».'},
  {h:'خطوات تحرك العضو الدائر',ref:'ص 130',html:'<p>«والشكل التالي يوضح خطوات تحرك العضو الدائر للمحرك مع كل نبضة والجهد الموصل على ملفات العضو الثابت.» في أعلاه نبضات CLOCK مرقمة من 1 إلى 8 ثم تعود 1، وتحتها مستوى الجهد على الأطراف A و B و C و D:</p>'},
  {fig:'',ref:'ص 130',caption:'نبضات CLOCK والجهد على الأطراف A و B و C و D (شكل بلا رقم في الكتاب)',draw:()=>`<div class="svgbox">${stepTimingSVG(0)}</div>`},
  {html:'<p>وتحت كل نبضة رسم الكتاب العضو الدائر (مغناطيس N–S) مع إشارة كل طرف (+ أو − أو 0)، والأطراف في هذا الرسم: A أعلى، و C يمين، و B أسفل، و D يسار. الجدول التالي يجمع الرسمين:</p>'+SEQ_TABLE(0)},
  {fig:'',ref:'ص 130',caption:'وضع العضو الدائر في الخطوات الثماني كما رسمه الكتاب (رسم المحاكاة: البرتقالي +، الأزرق −، الرمادي 0)',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px">${[1,2,3,4,5,6,7,8].map(k=>`<div class="svgbox" style="margin:0">${rotorMini(k)}</div>`).join('')}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن الجدول يتناوب بين خطوة فيها طرف واحد عليه جهد (2، 4، 6، 8) وخطوة فيها طرفان (1، 3، 5، 7). هذه الطريقة تسمى «نصف خطوة»، وفيها تتحرك المغناطيسية بانتظام. ولعكس الاتجاه نقرأ الجدول من الأسفل إلى الأعلى. في رسم الكتاب المبسط يدور المغناطيس 45° مع كل خطوة، أما المحرك الحقيقي المستخدم فيدور عموده 7.5° فقط لأن له أسناناً كثيرة.'},
  {err:'رموز الإشارات (+ و − و 0) تحت الرسوم لا تتفق دائماً مع مستويات A و B و C و D في المخطط الزمني: في الخطوة 1 مثلاً A = 0 لكنه مرسوم A−، وفي الخطوة 2 A = 0 مرسوم A0. كما أن رسم التركيبة (ص 129) يجعل A و C طرفي ملف واحد، بينما الرموز تعطي A و C إشارتين مستقلتين (A− مع C− في الخطوة 1). الكتاب لا يشرح العلاقة بين الإشارة المنطقية والقطبية، فنقلناهما كما هما.'},
  {h:'المطلوب',ref:'ص 130',html:'<p>«توصيل محرك الخطوة مصدر القدرة ويتم التحكم في عدد الدورات من خلال العداد تصاعدياً أو تنازلياً وذلك عن طريق (PLC).» (نطبقه في الدرس التالي.)</p>'},
  {err:'في ص 126 يعد الكتاب بـ «ثالثاً: كتابة برنامج للتحكم بمحرك الخطوة باستخدام (PLC) باللغة (LAD)»، لكن هذا الجزء <b>غير موجود</b>: لا برنامج LAD ولا FBD ولا STL ولا جدول دخل وخرج للمحرك، والوحدة تنتهي بفقرة «المطلوب». لذلك في المختبر طريقتان: تسلسل الكتاب يدوياً، وبرنامج PLC كتبناه نحن ومعلَّم بوضوح أنه ليس من الكتاب.'},
  {h:'برنامج PLC للمحرك (من إعداد المحاكاة، ليس من الكتاب)',html:`<p>${NOT_BOOK} الفكرة:</p><ul><li>العداد <b>C1</b> يحفظ رقم الخطوة الحالية (1…8).</li><li>المزمن <b>T1</b> يولّد نبضة CLOCK كل 0.3 ثانية أثناء التشغيل.</li><li>مع كل نبضة يعدّ C1 <b>تصاعدياً</b> (أمامي) أو <b>تنازلياً</b> (عكسي) حسب المفتاح S2، وبعد 8 يعود إلى 1 وقبل 1 يعود إلى 8.</li><li>كل طرف من الأطراف A و B و C و D يعمل في الخطوات التي فيها 1 في جدول الكتاب، باستخدام أوامر المقارنة.</li></ul>`},
  {fig:'',caption:'جدول المداخل والمخارج لبرنامج المحاكاة (ليس من الكتاب)',draw:()=>ioHTML(IO_STEP)+'<p class="sub" style="margin-top:6px">وعلامات داخلية:</p>'+ioHTML(IO_STEP_MEM)},
  {fig:'',caption:'برنامج المحاكاة بلغة LAD (ليس من الكتاب)',draw:()=>staticNets(PROG_RUN,'lad')},
  {fig:'',caption:'برنامج المحاكاة بلغة STL (ليس من الكتاب). يمكنك رؤيته بلغة FBD وهو يعمل داخل المختبر',draw:()=>staticNets(PROG_RUN,'stl')}
 ],
 lab:stepperLab,
 quiz:[
  {q:'كم درجة يتحرك العضو الدائر لهذا المحرك مع كل نبضة حسب الكتاب؟',o:['1.8°','7.5°','15°','45°'],c:1,e:'ص 129: (7.5) درجة في كل نبضة توصيل.'},
  {q:'كم نبضة يحتاج المحرك ليدور دورة كاملة؟ (استنتاج حسابي)',o:['8','24','48','360'],c:2,e:'360 ÷ 7.5 = 48 نبضة. الكتاب لم يذكر هذا الرقم صراحة.'},
  {q:'المحرك المستخدم في التطبيق هو:',o:['ثلاثي الأوجه','ذو وجهين','أحادي الوجه','تيار مستمر بفرش'],c:1,e:'«محرك ذو وجهين»: ملف A–C وملف B–D.'},
  {q:'في الخطوة 1 من الجدول، أي الأطراف عليها جهد (1)؟',o:['A و C','B و D','A فقط','C و D'],c:1,e:'الخطوة 1: A=0، B=1، C=0، D=1.'},
  {q:'في أي خطوة يكون الطرف A وحده عليه جهد؟',o:['الخطوة 2','الخطوة 4','الخطوة 6','الخطوة 8'],c:1,e:'الخطوة 4: A=1 والباقي 0.'},
  {q:'كيف نعكس اتجاه دوران محرك الخطوة؟',o:['نعكس قطبية المصدر','نطبق الجدول بترتيب معكوس (8، 7، 6 …)','نزيد عدد النبضات','نفصل الملف B–D'],c:1,e:'قراءة الجدول من الأسفل إلى الأعلى تحرك المغناطيسية في الاتجاه المعاكس.'},
  {q:'لماذا قال الكتاب «لذلك نحتاج إلى العدادات في عملية التشغيل»؟',o:['لأن المحرك يتحرك بخطوات محددة لكل نبضة، فعدّ النبضات يحدد مقدار الحركة','لقياس الحرارة','لزيادة السرعة','لحماية المحرك'],c:0,e:'كل نبضة = 7.5°، فعدد النبضات يحدد الزاوية وعدد الدورات.'},
  {q:'هل يحتوي الكتاب على برنامج LAD للتحكم في محرك الخطوة؟',o:['نعم في ص 130','لا، أُعلن عنه في ص 126 لكنه غير موجود','نعم في الشكل (1-7)','نعم بلغة STL فقط'],c:1,e:'البرنامج في المختبر من إعداد المحاكاة وليس من الكتاب.'}
 ]
});

/* =================== Lesson 7.3 — counted steps (المطلوب ص 130) =================== */
B.lesson({
 id:'u7-l3',unit:7,order:3,pages:'130',
 title:'المطلوب: التحكم في عدد خطوات المحرك بالعداد',
 summary:'تطبيق لفقرة «المطلوب» في ص 130 ببرنامج من إعداد المحاكاة: تكتب عدد الخطوات PV، فيعدّها عداد تنازلي ويوقف المحرك عند الوصول إليها، مع اتجاه أمامي أو عكسي.',
 theory:[
  {h:'المطلوب',ref:'ص 130',html:'<p>«توصيل محرك الخطوة مصدر القدرة ويتم التحكم في <b>عدد الدورات</b> من خلال <b>العداد تصاعدياً أو تنازلياً</b> وذلك عن طريق (PLC).»</p>'},
  {err:'الكتاب لا يقدم بعد هذه الفقرة برنامجاً ولا جدول دخل وخرج ولا أسئلة تقويم (والجزء «ثالثاً» المعلن في ص 126 غير موجود). البرنامج في هذا الدرس <b>من إعداد المحاكاة وليس من الكتاب</b>، وهو حل مقترح للمطلوب.'},
  {h:'فكرة الحل (من إعداد المحاكاة، ليس من الكتاب)',html:`<ol><li>يكتب المتدرب عدد الخطوات المطلوب في كلمة الذاكرة <span class="mono">MW10</span> (القيمة PV). دورة كاملة = 48 خطوة (استنتاج من 7.5°).</li>
   <li>عند الضغط على S1 يُحمَّل العداد <b>التنازلي C2</b> بهذه القيمة (طرف S)، ويُصفَّر العداد <b>التصاعدي C3</b> (طرف R).</li>
   <li>مع كل نبضة من المزمن T1: يتقدم المحرك خطوة (العداد C1 يعدّ تصاعدياً للأمام أو تنازلياً للخلف حسب S2)، وينقص C2 واحداً، ويزيد C3 واحداً.</li>
   <li>عندما يصل C2 إلى الصفر (تلامس C2 = 0) يُلغى M0.0 فيقف المحرك. وهكذا نرى العدّ <b>تصاعدياً</b> (C3: كم خطوة نُفذت) و<b>تنازلياً</b> (C2: كم بقي).</li></ol>`},
  {fig:'',caption:'جدول المداخل والمخارج لبرنامج المحاكاة (ليس من الكتاب)',draw:'io'},
  {fig:'',caption:'برنامج المحاكاة بلغة LAD (ليس من الكتاب)',draw:'lad'},
  {fig:'',caption:'برنامج المحاكاة بلغة STL (ليس من الكتاب)',draw:'stl'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> العداد يعدّ مرة واحدة عند تغيّر مدخله من 0 إلى 1، لذلك صُمم المزمن T1 ليعطي نبضة قصيرة (دورة مسح واحدة) كل 0.2 ثانية: يعدّ حتى ينتهي زمنه، فيصبح 1، فيقطع نفسه بالتلامس <span class="mono">AN T 1</span> ويبدأ من جديد.'}
 ],
 io:IO_STEP.concat([{sym:'C2',desc:'عداد تنازلي: الخطوات المتبقية (PV من MW10)',addr:'C2'},{sym:'C3',desc:'عداد تصاعدي: الخطوات المنفّذة',addr:'C3'}]),
 inputs:[{id:'S0',addr:'I0.0',type:'push',color:'red',label:'إيقاف'},{id:'S1',addr:'I0.1',type:'push',color:'green',label:'تشغيل'},{id:'S2',addr:'I0.2',type:'toggle',label:'عكسي'}],
 program:PROG_COUNT,
 plant:{
  title:'محرك الخطوة',
  init:()=>({pv:12,k:0,steps:0,arrow:135,arrowT:135,shaft:0,shaftT:0,lastK:-1}),
  step(dt,st,p){st.plc.words.MW10=p.pv;moveTo(p,kOf(['Q4.0','Q4.1','Q4.2','Q4.3'].map(a=>st.Q(a))));animate(p,dt)},
  render(el,st,p){
   if(!el.querySelector('#u7pv')){
    el.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;background:var(--surface-2);border-radius:10px;padding:8px 12px"><label for="u7pv">عدد الخطوات المطلوب PV = <span class="mono">MW10</span></label>
      <input id="u7pv" type="number" min="0" max="999" value="${p.pv}" style="font:inherit;width:80px;padding:3px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)">
      ${[[6,'45°'],[12,'90°'],[24,'180°'],[48,'دورة']].map(([n,l])=>`<button class="btn" data-pv="${n}">${n} (${l})</button>`).join('')}
      <span class="sub" style="flex-basis:100%">اكتب القيمة ثم اضغط S1. القيمة تُحمَّل في C2 لحظة الضغط فقط. (48 خطوة = دورة: استنتاج من 7.5°.)</span></div><div id="u7dyn"></div>`;
    const i=el.querySelector('#u7pv');i.addEventListener('input',()=>{p.pv=clamp(Math.round(+i.value||0),0,999)});
    el.querySelectorAll('[data-pv]').forEach(b=>b.addEventListener('click',()=>{p.pv=+b.dataset.pv;i.value=p.pv}));p.lastK=-1;
   }
   const bits=['Q4.0','Q4.1','Q4.2','Q4.3'].map(a=>st.Q(a)),dyn=el.querySelector('#u7dyn');
   if(p.lastK!==p.k||!dyn.firstChild){p.lastK=p.k;dyn.innerHTML=`<div id="u7sv">${stepperHTML(p.k,bits)}</div><div id="u7f"></div><h3 class="sm">جدول الخطوات (ص 130)</h3><div class="svgbox" style="max-width:640px">${stepTimingSVG(p.k)}</div>`}
   el.querySelector('#u7f').innerHTML=`<div class="facts"><div class="fact"><span>C1 رقم الخطوة</span><b>${st.C('C1').v}</b></div><div class="fact"><span>C2 المتبقي (تنازلي)</span><b>${st.C('C2').v}</b></div><div class="fact"><span>C3 المنفّذ (تصاعدي)</span><b>${st.C('C3').v}</b></div><div class="fact"><span>زاوية العمود</span><b>${(p.steps*7.5).toFixed(1)}°</b></div></div>`;
   setRot(el,p);
  },
  frame(el,st,p){if(el)setRot(el,p)},
  sig:p=>p.k+'|'+p.steps,
  label:p=>p.k?'الخطوة '+p.k:'غير متغذٍ',
  readouts:[{l:'الحالة',chip:(p,s)=>s.M('M0.0')?[s.I('I0.2')?'يدور عكسياً':'يدور أمامياً',s.I('I0.2')?'rev':'run']:['متوقف','']},{l:'الزاوية',v:p=>(p.steps*7.5).toFixed(1)+'°'},{l:'الدورات',v:p=>(p.steps/48).toFixed(2)}]
 },
 plcNote:'<b>برنامج من إعداد المحاكاة، ليس من الكتاب.</b> الكتاب لم يقدم برنامجاً للمحرك. تلامس العداد (مثل AN C 2) يعني «قيمة العد = صفر».',
 steps:[
  {t:'حدد عدد الخطوات',x:'في لوحة المحرك اختر 12 خطوة (90°) أو اكتب رقماً آخر. ثم اضغط «التالي».'},
  {t:'شغّل بالضاغط S1',x:'اضغط S1: يُحمَّل C2 بالقيمة المطلوبة، ويُصفَّر C3، وتتغذى الخطوة 1، ثم يبدأ المحرك يتقدم خطوة كل 0.2 ثانية.',done:s=>s.M('M0.0')},
  {t:'راقب العدادين',x:'C2 ينقص (عدّ تنازلي) و C3 يزيد (عدّ تصاعدي) مع كل خطوة، ومجموعهما دائماً = PV.',done:s=>s.C('C3').v>=3},
  {t:'التوقف التلقائي',x:'عندما يصل C2 إلى 0 يتوقف المحرك وحده: الزاوية = عدد الخطوات × 7.5°.',done:s=>!s.M('M0.0')&&s.C('C3').v>0&&s.C('C2').v===0},
  {t:'دورة كاملة عكسية',x:'شغّل المفتاح S2 (عكسي)، واختر 48 خطوة، ثم اضغط S1. يعدّ C1 الآن تنازلياً ويدور العمود دورة كاملة في الاتجاه المعاكس.',done:s=>s.M('M0.0')&&s.I('I0.2')},
  {t:'أوقف قبل النهاية',x:'اضغط S0 قبل انتهاء العد: يتوقف المحرك ويبقى في C2 عدد الخطوات التي لم تُنفذ.',done:s=>!s.M('M0.0')&&s.C('C2').v>0},
  {t:'افتح البرنامج',x:'في تبويب «برنامج الـ PLC» فعّل المسح البطيء وشاهد: نبضة T1 → CU أو CD للعداد C1 → CD C2 و CU C3 → المقارنات تحدد الأطراف A و B و C و D.'}
 ],
 quiz:[
  {q:'ما وظيفة العداد C2 في برنامج المحاكاة؟',o:['يحفظ رقم الخطوة','يعدّ تنازلياً الخطوات المتبقية من PV','يولّد النبضات','يعكس الاتجاه'],c:1,e:'يُحمَّل بـ PV عند S1 وينقص مع كل نبضة.'},
  {q:'متى يتوقف المحرك تلقائياً؟',o:['بعد 10 ثوانٍ','عندما يصل C2 إلى الصفر','عندما يصل C1 إلى 8','عند تغيير S2'],c:1,e:'الشرط A M 0.0 و AN C 2 يلغي M0.0.'},
  {q:'كم خطوة تلزم لنصف دورة؟',o:['12','24','48','96'],c:1,e:'180 ÷ 7.5 = 24.'},
  {q:'ماذا يفعل المفتاح S2 في البرنامج؟',o:['يوقف المحرك','يجعل C1 يعدّ تنازلياً فيدور المحرك عكسياً','يغيّر سرعة النبضات','يصفّر C2'],c:1,e:'AN I 0.2 ← CU C1 (أمامي)، و A I 0.2 ← CD C1 (عكسي).'},
  {q:'لماذا يحتوي Network المزمن T1 على التلامس AN T 1؟',o:['ليعيد المزمن تصفير نفسه فيعطي نبضات متكررة','ليمنع التشغيل','ليعكس الاتجاه','لا فائدة منه'],c:0,e:'عندما ينتهي الزمن يصبح T1 = 1 فيقطع مدخله في المسح التالي ويبدأ من جديد.'},
  {q:'العداد C3 في البرنامج:',o:['تنازلي يبدأ من PV','تصاعدي يعدّ الخطوات المنفّذة','يحفظ الاتجاه','مزمن'],c:1,e:'يُصفَّر عند S1 ويزيد مع كل نبضة.'},
  {q:'كتبت PV = 48 وضغطت S1. كم يدور العمود؟',o:['48°','180°','360° (دورة كاملة)','7.5°'],c:2,e:'48 × 7.5 = 360°.'},
  {q:'هل هذا البرنامج من الكتاب؟',o:['نعم من ص 130','لا، من إعداد المحاكاة لأن الكتاب لم يقدم برنامجاً للمحرك','نعم من الشكل (1-7)','نعم من الوحدة السادسة'],c:1,e:'الكتاب يذكر «المطلوب» فقط.'}
 ]
});

})(PLCBOOK);
