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
 stations:[
  {intro:true},

  {st:1,short:'ماذا ستتعلم؟',title:'الوحدة السابعة: تطبيق على محرك الخطوة',ref:'ص 126',
   q:'محرك يتحرك بخطوات صغيرة مع كل نبضة… لماذا تبدأ وحدته بدرس عن العدادات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محتويات الوحدة السابعة: أولاً العدادات، ثانياً فكرة عمل محرك الخطوة، ثالثاً برنامج بلغة LAD معلن وغير موجود، والوقت ساعتان والإتقان مئة في المئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="40" text-anchor="middle" direction="rtl" font-size="16" fill="#2C4A40" font-weight="700">الوحدة السابعة</text><rect x="46" y="54" width="268" height="60" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="80" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">أولاً: العدادات</text><text x="180" y="102" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40">أنواعها وطريقة عملها واستخداماتها</text><rect x="46" y="124" width="268" height="60" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="159" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">ثانياً: فكرة عمل محرك الخطوة</text><g data-tip="هذا الجزء معلن في صفحة المحتويات (ص 126) لكنه غير موجود في الوحدة: تنتهي الوحدة في ص 130 بفقرة «المطلوب» دون أي برنامج."><rect x="46" y="194" width="268" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="7 6"/><text x="180" y="220" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">ثالثاً: كتابة برنامج للتحكم بمحرك الخطوة</text><text x="180" y="242" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40">باستخدام (PLC) باللغة (LAD)</text></g><rect x="56" y="266" width="118" height="30" rx="15" fill="#2C4A40"/><text x="115" y="286" text-anchor="middle" direction="rtl" font-size="13" fill="#FBF6EE" font-weight="600">الوقت: ساعتان</text><rect x="186" y="266" width="118" height="30" rx="15" fill="#2C4A40"/><text x="245" y="286" text-anchor="middle" direction="rtl" font-size="13" fill="#FBF6EE" font-weight="600">الإتقان: 100٪</text></svg>`,
   cap:'محتويات الوحدة كما في ص 126. الجزء الثالث مرسوم بخط متقطع.<br><b>مرّر المؤشر على الجزء الثالث (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'من أهداف الوحدة «أن يكتب المتدرب برنامجاً للتحكم في محرك الخطوة». أين تتوقع أن تجد هذا البرنامج في الكتاب؟',opts:[
     ['في الشكل (1-7)',false,'الشكل (1-7) في ص 128 يبين صندوقي العدادين فقط، ولا علاقة له بالمحرك.'],
     ['لا يوجد في الوحدة: الجزء «ثالثاً» معلن في المحتويات فقط، والكتاب يطلبه منك في فقرة «المطلوب» (ص 130)',true,'تنتهي الوحدة في ص 130 دون برنامج. لذلك البرنامج الذي ستراه في المختبر من إعداد المحاكاة، ومعلَّم بأنه ليس من الكتاب.'],
     ['في الجزء «ثالثاً» بعد ص 130',false,'الصفحة التي بعد ص 130 هي غلاف الوحدة الثامنة؛ الجزء «ثالثاً» غير موجود.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الوحدة السابعة: تطبيق على محرك الخطوة</b></p>
     <ul><li><b>أولاً:</b> العدادات. أنواعها وطريقة عملها واستخداماتها</li><li><b>ثانياً:</b> فكرة عمل محرك الخطوة.</li><li><b>ثالثاً:</b> كتابة برنامج للتحكم بمحرك الخطوة باستخدام (<span class="ltr">PLC</span>) باللغة (<span class="ltr">LAD</span>).</li></ul>
     <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (<span class="ltr">PLC</span>) في تنفيذ التطبيقات.</p>
     <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة بإذن الله على:</p><ul><li>أن يعرف المتدرب طريقة التحكم في محرك الخطوة.</li><li>أن يكتب المتدرب برنامجاً للتحكم في محرك الخطوة.</li></ul>
     <p><b>مستوى الأداء المطلوب:</b> أن يصل المتدرب إلى إتقان هذه الجدارة بإذن الله بنسبة 100٪.</p>
     <p><b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج – حاسب آلي – جهاز عرض (داتا شو) – سبورة – كراسة الطالب – قلم.</p>
     <p><b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`,ref:'ص 126'},
    {tip:String.raw`<p>محرك الخطوة يتحرك زاوية صغيرة ثابتة مع كل نبضة. فإذا أردنا أن يتحرك مقداراً محدداً فعلينا أن <b>نعدّ النبضات</b>، ولهذا تبدأ الوحدة بالعدادات (هذا الدرس)، ثم المحرك نفسه (الدرس الثاني)، ثم التحكم في عدد دوراته بالعداد (الدرس الثالث).</p>`,title:'خريطة الوحدة'},
    {watch:String.raw`<p>الجزء «ثالثاً» غير موجود في الوحدة: لا برنامج <span class="ltr">LAD</span> ولا <span class="ltr">FBD</span> ولا <span class="ltr">STL</span> ولا جدول دخل وخرج للمحرك. البرامج التي ستراها في الدرسين الثاني والثالث <b>من إعداد المحاكاة وليست من الكتاب</b>.</p>`,fix:true}
   ]},

  {st:2,short:'مقدمة',title:'أولاً: العدادات — 1- مقدمة عن العدادات',ref:'ص 127',
   q:'المزمن يقيس «كم مضى من الوقت»… فما الذي يقيسه العداد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سير ناقل تمر عليه منتجات أمام حساس، والحساس يرسل إشارة إلى العداد مع كل منتج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="العداد: يزيد قيمته واحداً مع كل إشارة تصل إلى مدخل العد."><rect x="36" y="40" width="124" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="68" text-anchor="middle" direction="rtl" font-size="16" fill="#2C4A40" font-weight="700">عداد</text><text x="98" y="90" text-anchor="middle" direction="ltr" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C</text></g><g data-tip="سلك الإشارة: ينقل نبضة من الحساس إلى مدخل العد في كل مرة يمر فيها منتج."><rect x="160" y="62" width="34" height="16" fill="transparent"/><line x1="192" y1="70" x2="170" y2="70" stroke="#2C4A40" stroke-width="2.5"/><polygon points="160,70 172,64 172,76" fill="#2C4A40"/></g><g data-tip="حساس: يعطي إشارة (نبضة) كلما مرّ منتج أمامه. الخط المتقطع شعاعه."><rect x="192" y="54" width="20" height="44" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><line x1="202" y1="100" x2="202" y2="166" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 5"/></g><rect x="66" y="124" width="44" height="44" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="226" y="124" width="44" height="44" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="284" y="124" width="44" height="44" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="السير الناقل: يحمل المنتجات من اليمين إلى اليسار أمام الحساس. السهم الأبيض اتجاه الحركة."><rect x="28" y="168" width="310" height="28" rx="14" fill="#2C4A40"/><circle cx="42" cy="182" r="9" fill="#CFE6DB"/><circle cx="324" cy="182" r="9" fill="#CFE6DB"/><polygon points="160,182 176,174 176,190" fill="#FBF6EE"/><rect x="176" y="179" width="22" height="6" fill="#FBF6EE"/></g><text x="180" y="236" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">كل منتج يمر = عدّة واحدة</text><text x="180" y="262" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40">وتغيّر خرج العداد يُستخدم في التحكم</text></svg>`,
   cap:'مثال من الواقع لعدّ المنتجات في خط إنتاج.<br><b>مرّر المؤشر على الحساس والعداد والسير (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في خط تعبئة نريد أن يتوقف السير بعد مرور عدد محدد من العلب. أي عنصر يناسب هذه المهمة؟',opts:[
     ['المزمن',false,'المزمن يقيس الزمن، والعلب قد تمر بسرعات مختلفة؛ المطلوب هنا «عدد» لا «زمن».'],
     ['المتمم وحده',false,'المتمم يوصل ويفصل فقط، ولا يحفظ عدد المرات.'],
     ['العداد',true,'من استخدامات العدادات في الكتاب: «القيام بعدّ منتج معين في أحد خطوط الإنتاج» (ص 127).']]}}
   ],
   body:[
    {book:String.raw`<p>تستخدم العدادات في التطبيقات الصناعية على نطاق واسع، لعدة أغراض منها القيام بعدّ منتج معين في أحد خطوط الإنتاج. كما تستخدم في أغراض التحكم في المزمنات وذلك باستخدام التغير الذي يحدث في الخرج من هذه العدادات.</p>`,ref:'ص 127'},
    {tip:String.raw`<p>العداد يحفظ <b>عدد المرات</b> التي وصلت فيها إشارة إلى مدخله. وعندما يتغير خرجه (مثلاً عند الوصول إلى قيمة معينة) نستطيع أن نستخدم هذا التغير لتشغيل مزمن أو إيقافه، أو لتشغيل حمل آخر.</p>`},
    {add:String.raw`<p>عدّ العلب حتى يمتلئ الكرتون، وعدّ السيارات الداخلة إلى موقف لمعرفة الأماكن الفارغة، وعدّ القطع التي تنتجها آلة في الوردية… كلها تطبيقات للعدادات في المصانع والمباني.</p>`,title:'أين تجده؟'}
   ]},

  {st:3,short:'أنواع العدادات',title:'2- أنواع العدادات',ref:'ص 127',
   q:'العداد يمكن أن «يصعد» من الصفر… فهل يمكن أن «ينزل» إليه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="درج صاعد للعداد التصاعدي من الصفر إلى القيمة المحددة، ودرج نازل للعداد التنازلي من القيمة المحددة إلى الصفر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="262" y="62" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">العداد التصاعدي (CU)</text><text x="98" y="62" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">العداد التنازلي (CD)</text><line x1="196" y1="232" x2="334" y2="232" stroke="#2C4A40" stroke-width="2"/><line x1="26" y1="232" x2="166" y2="232" stroke="#2C4A40" stroke-width="2"/><line x1="200" y1="128" x2="330" y2="128" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 4"/><line x1="30" y1="128" x2="160" y2="128" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 4"/><g data-tip="العداد التصاعدي ⟦CU⟧: كل درجة عدّة واحدة؛ يزيد العد واحداً مع كل إشارة، من الصفر حتى القيمة المحددة للعداد."><rect x="196" y="120" width="138" height="116" fill="transparent"/><path d="M200 230 H222 V204 H244 V178 H266 V152 H288 V128 H318" fill="none" stroke="#E8735A" stroke-width="5" stroke-linejoin="round"/><polygon points="318,112 309,128 327,128" fill="#E8735A"/></g><g data-tip="العداد التنازلي ⟦CD⟧: كل درجة عدّة واحدة؛ ينقص العد واحداً مع كل إشارة، من القيمة المحددة للعداد حتى الصفر."><rect x="26" y="120" width="140" height="116" fill="transparent"/><path d="M34 128 H64 V152 H86 V178 H108 V204 H130 V230 H156" fill="none" stroke="#4FB3A9" stroke-width="5" stroke-linejoin="round"/><polygon points="156,246 147,230 165,230" fill="#4FB3A9"/></g><text x="300" y="104" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">القيمة المحددة</text><text x="212" y="252" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">الصفر</text><text x="56" y="112" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">القيمة المحددة</text><text x="140" y="264" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">الصفر</text><text x="180" y="292" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">كل درجة = إشارة واحدة على مدخل العد</text></svg>`,
   cap:'النوعان كما يصفهما الكتاب في ص 127. الخط المتقطع مستوى القيمة المحددة للعداد.<br><b>مرّر المؤشر على كل درج (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p>هناك نوعان من العدادات وهما:</p>
     <ol><li>العداد التصاعدي: ويرمز له بالرمز (<span class="ltr">CU</span>) وفيه يتم العد بطريقة تصاعدية من القيمة الصفر إلى القيمة المحددة للعداد.</li>
     <li>العداد التنازلي: ويرمز له بالرمز (<span class="ltr">CD</span>) وفيه يتم العد بطريقة تنازلية من القيمة المحددة للعداد إلى القيمة الصفر.</li></ol>`,ref:'ص 127'}
   ],
   body:[
    {tip:String.raw`<p>الرمزان من الإنجليزية: <span class="ltr">CU = Count Up</span> (عُدّ صاعداً)، و<span class="ltr">CD = Count Down</span> (عُدّ نازلاً). العداد التصاعدي يجيب عن سؤال «كم مرة حدث؟»، والتنازلي يجيب عن سؤال «كم بقي؟».</p>`,title:'ماذا يعني الرمزان؟'},
    {predict:{q:'عداد تنازلي وُضعت فيه القيمة المحددة للعد. من أين يبدأ العد، وإلى أين ينتهي؟',opts:[
     ['من الصفر إلى القيمة المحددة',false,'هذا هو العداد التصاعدي (CU).'],
     ['من القيمة المحددة إلى الصفر',true,'الكتاب: «يتم العد بطريقة تنازلية من القيمة المحددة للعداد إلى القيمة الصفر» (ص 127).'],
     ['من الصفر إلى ما لا نهاية',false,'للعد حد أقصى، وسيأتي في المحطة التالية.']]}},
    {book:String.raw`<p>ويشبه تمثيل العداد إلى حد كبير تمثيل المزمن والشكل (1-7) يبين شكل العداد. حيث إنه يوجد له عدد من المداخل. وعدد من المخارج وهي على النحو التالي:</p>`,ref:'ص 127'},
    {tip:String.raw`<p>مثل صندوق المزمن الذي درسته: صندوق مستطيل، <b>مداخله على اليسار</b> و<b>مخارجه على اليمين</b>، وفوقه اسمه (مثل <span class="ltr">C1</span>). المحطتان التاليتان تشرحان المداخل ثم المخارج.</p>`}
   ]},

  {st:4,short:'المداخل',title:'المداخل',ref:'ص 127',
   q:'للعداد أربعة أطراف دخل وطرف خامس… فما عمل كل واحد منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صندوق العداد S_CU ومداخله على اليسار: CU و S و PV و R، ومخارجه على اليمين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="210" y="40" text-anchor="middle" direction="ltr" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C1</text><rect x="150" y="50" width="120" height="208" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g data-tip="⟦S_CU⟧: اسم صندوق العداد التصاعدي في الشكل ⟦(1-7)⟧، والعداد التنازلي اسمه ⟦S_CD⟧ ومدخل العد فيه ⟦CD⟧ بدل ⟦CU⟧."><rect x="170" y="56" width="80" height="24" fill="transparent"/><text x="210" y="74" text-anchor="middle" direction="ltr" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S_CU</text></g><g data-tip="المدخل ⟦CU⟧ (العد التصاعدي): كل إشارة عليه تزيد العد واحداً حتى القيمة المحددة مسبقاً أو حتى ⟦999⟧ أقصى قيمة للعد. وفي العداد التنازلي يكون مكانه المدخل ⟦CD⟧."><rect x="40" y="90" width="150" height="24" fill="transparent"/><line x1="50" y1="102" x2="150" y2="102" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><text x="158" y="107" text-anchor="start" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CU</text></g><g data-tip="المدخل ⟦S⟧: يصفه الكتاب بأنه «مدخل لإعادة تصفير العداد»، والأدق أنه يضع في العداد القيمة ⟦PV⟧. اقرأ «انتبه» تحت."><rect x="40" y="135" width="150" height="24" fill="transparent"/><line x1="50" y1="147" x2="150" y2="147" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="158" y="152" text-anchor="start" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><g data-tip="المدخل ⟦PV⟧: يحدد القيمة العددية للعد، للعدادين التصاعدي والتنازلي."><rect x="40" y="180" width="150" height="24" fill="transparent"/><line x1="50" y1="192" x2="150" y2="192" stroke="#F2C14E" stroke-width="4" stroke-linecap="round"/><text x="158" y="197" text-anchor="start" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">PV</text></g><g data-tip="المدخل ⟦R⟧ ⟦(Reset)⟧: طرف الفصل؛ يفصل العداد في أي لحظة من لحظات العد."><rect x="40" y="225" width="150" height="24" fill="transparent"/><line x1="50" y1="237" x2="150" y2="237" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><text x="158" y="242" text-anchor="start" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">R</text></g><g data-tip="المخارج ⟦Q⟧ و⟦CV⟧ و⟦CV_BCD⟧: موضوع المحطة التالية." opacity=".45"><rect x="200" y="90" width="120" height="114" fill="transparent"/><text x="262" y="107" text-anchor="end" direction="ltr" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Q</text><text x="262" y="152" text-anchor="end" direction="ltr" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CV</text><text x="262" y="197" text-anchor="end" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CV_BCD</text><line x1="270" y1="102" x2="316" y2="102" stroke="#2C4A40" stroke-width="3"/><line x1="270" y1="147" x2="316" y2="147" stroke="#2C4A40" stroke-width="3"/><line x1="270" y1="192" x2="316" y2="192" stroke="#2C4A40" stroke-width="3"/></g><text x="180" y="290" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">المداخل على اليسار، والمخارج على اليمين</text></svg>`,
   cap:'صندوق العداد التصاعدي كما في الشكل <span class="ltr">(1-7)</span>، والمخارج باهتة لأنها موضوع المحطة التالية.<br><b>مرّر المؤشر على كل مدخل (أو المسه في الجوال) لتعرف عمله.</b>',
   side:[
    {predict:{q:'العداد التصاعدي يعدّ الآن، ووصلت إشارة إلى الطرف R. ماذا يحدث؟',opts:[
     ['يستمر العد حتى يصل إلى القيمة المحددة ثم يُفصل',false,'R لا ينتظر نهاية العد؛ الكتاب يقول إنه يُستخدم لفصل العداد «في أي لحظة من لحظات العد».'],
     ['يزيد العد واحداً',false,'زيادة العد عمل المدخل CU وليس R.'],
     ['يُفصل العداد مباشرة',true,'الكتاب: «عند وصول إشارة فصل إلى الطرف (R) يفصل العداد مباشرة» (ص 127).']]}}
   ],
   body:[
    {book:String.raw`<ol><li>الدخل (<span class="ltr">CU</span>) يستخدم هذا الدخل عندما نستخدم العداد كعداد تصاعدي. ويستمر العد في الزيادة حتى القيمة المحددة مسبقاً. أو حتى الرقم (999) وهو أقصى قيمة للعد. ثم بعد ذلك يتوقف العداد عن العد. أو عند وصول إشارة فصل إلى الطرف (<span class="ltr">R</span>) يفصل العداد مباشرة.</li>
     <li>الدخل (<span class="ltr">R</span>) وهو طرف الفصل (<span class="ltr">Reset</span>). يستخدم لفصل العداد في أي لحظة من لحظات العد.</li>
     <li>الدخل (<span class="ltr">CD</span>) يستخدم هذا الدخل عندما نستخدم العداد كعداد تنازلي. ويستمر العد في التناقص من القيمة المحددة مسبقاً. أو من الرقم (999) وهو أقصى قيمة للعد إلى أن يصل إلى الصفر. ثم بعد ذلك يتوقف العداد عن العد. أو عند وصول إشارة فصل إلى الطرف (<span class="ltr">R</span>) يفصل العداد مباشرة.</li>
     <li>الدخل (<span class="ltr">PV</span>) تحدد القيمة العددية للعد. للعدادين التصاعدي أو التنازلي.</li></ol>
     <p>المدخل (<span class="ltr">S</span>) مدخل لإعادة تصفير العداد. للعدادين التصاعدي أو التنازلي.</p>`,ref:'ص 127'},
    {tip:String.raw`<p><span class="ltr">PV = Preset Value</span> (القيمة المحددة مسبقاً)، و<span class="ltr">R = Reset</span> (إرجاع العداد إلى الصفر). العداد يعدّ مرة واحدة <b>عند بداية</b> الإشارة على <span class="ltr">CU</span> أو <span class="ltr">CD</span> (لحظة تغيّرها من <span class="ltr">0</span> إلى <span class="ltr">1</span>)، فالضغطة الطويلة تُحسب عدّة واحدة فقط.</p>`,title:'الحروف وطريقة العد'},
    {watch:String.raw`<p><b>ملاحظة على الكتاب:</b> وصف المدخل <span class="ltr">S</span> بأنه «لإعادة تصفير العداد» غير دقيق. في عدادات <span class="ltr">Siemens</span> (<span class="ltr">S_CU</span> و<span class="ltr">S_CD</span>) الطرف <span class="ltr">S</span> <b>يضع في العداد القيمة <span class="ltr">PV</span></b> لحظة تغيّره من <span class="ltr">0</span> إلى <span class="ltr">1</span>، أما التصفير فيكون بالطرف <span class="ltr">R</span> الذي وصفه الكتاب نفسه بأنه طرف الفصل. وجاء المدخل <span class="ltr">S</span> في الكتاب خارج الترقيم بعد البند 4. جرّب ذلك في المختبر: اضغط <span class="ltr">S</span> فتصبح القيمة = <span class="ltr">PV</span> وليس صفراً.</p>`,fix:true},
    {watch:String.raw`<p>عبارة العداد التنازلي «يتناقص من القيمة المحددة مسبقاً أو من الرقم 999» ملتبسة: العداد يعدّ تنازلياً من القيمة الموجودة فيه (التي وضعها الطرف <span class="ltr">S</span> من <span class="ltr">PV</span>) نحو الصفر، و999 هي فقط أكبر قيمة يمكن أن يحملها.</p>`,fix:true},
    {predict:{q:'ما أكبر قيمة يمكن أن يصل إليها العد حسب الكتاب؟',opts:[
     ['999',true,'«حتى الرقم (999) وهو أقصى قيمة للعد» (ص 127).'],
     ['99',false,'العداد يحمل ثلاثة أرقام عشرية، فأقصى قيمة 999.'],
     ['لا حد للعد',false,'الكتاب يحدد أقصى قيمة للعد بالرقم 999.']]}}
   ]},

  {st:5,short:'المخارج',title:'المخارج',ref:'ص 128',
   q:'العداد يعرف «كم عدَدْنا»… فكيف يخبر بذلك دائرة التحكم، وكيف يخبر شاشة الأرقام؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المخرج Q يشغل لمبة في دائرة تحكم كهربائية، والمخرجان CV و CV_BCD يذهبان إلى شاشة أرقام إلكترونية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="36" y="56" width="114" height="176" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="93" y="80" text-anchor="middle" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S_CU</text><g data-tip="المخرج ⟦Q⟧: خرج للعداد بالإشارة الكهربائية (⟦0⟧ أو ⟦1⟧)، ويُستخدم في دوائر التحكم الكهربائية مثل تشغيل ملف أو لمبة."><rect x="90" y="84" width="200" height="34" fill="transparent"/><text x="142" y="106" text-anchor="end" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Q</text><line x1="150" y1="101" x2="244" y2="101" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><circle cx="262" cy="101" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><line x1="250.7" y1="89.7" x2="273.3" y2="112.3" stroke="#2C4A40" stroke-width="2"/><line x1="250.7" y1="112.3" x2="273.3" y2="89.7" stroke="#2C4A40" stroke-width="2"/></g><text x="262" y="138" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">دوائر التحكم الكهربائية</text><g data-tip="المخرج ⟦CV⟧: قيمة العد كعدد. يقول الكتاب إنه «بالنظام السداسي عشر»؛ اقرأ «انتبه» تحت."><rect x="90" y="150" width="122" height="26" fill="transparent"/><text x="142" y="168" text-anchor="end" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CV</text><line x1="150" y1="163" x2="208" y2="163" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/></g><g data-tip="المخرج ⟦CV_BCD⟧ (يسميه النص ⟦BCD⟧): قيمة العد بالنظام الثنائي المشفّر؛ كل رقم عشري يُكتب بأربع خانات ثنائية."><rect x="80" y="190" width="132" height="26" fill="transparent"/><text x="142" y="208" text-anchor="end" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CV_BCD</text><line x1="150" y1="203" x2="208" y2="203" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/></g><g data-tip="شاشة أرقام إلكترونية تعرض قيمة العد (رسم توضيحي). الرقم ⟦999⟧ أقصى قيمة للعد."><rect x="208" y="148" width="116" height="70" rx="10" fill="#2C4A40"/><text x="266" y="196" text-anchor="middle" direction="ltr" font-size="34" fill="#F2C14E" font-weight="700" font-family="var(--mono)">999</text></g><text x="266" y="240" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">التطبيقات الإلكترونية</text><text x="180" y="284" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">ثلاثة مخارج: واحد كهربائي واثنان للأرقام</text></svg>`,
   cap:'المخرج <span class="ltr">Q</span> للدوائر الكهربائية، و<span class="ltr">CV</span> و<span class="ltr">CV_BCD</span> للتطبيقات الإلكترونية.<br><b>مرّر المؤشر على كل مخرج وعلى الشاشة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>هناك ثلاثة مخارج للعداد التصاعدي والتنازلي وهي على النحو التالي:</p>
     <ol><li>المخرج (<span class="ltr">CV</span>) وهو خرج للعداد بالنظام السداسي عشر. وهذه الإشارات مستخدمة في التطبيقات الإلكترونية</li>
     <li>المخرج (<span class="ltr">BCD</span>) وهو خرج للعداد بالنظام الثنائي المشفر. وهذه الإشارات مستخدمة في التطبيقات الإلكترونية</li>
     <li>المخرج (<span class="ltr">Q</span>) وهو خرج للعداد بالإشارة الكهربائية. وهذه الإشارات مستخدمة في دوائر التحكم الكهربائية.</li></ol>`,ref:'ص 128'}
   ],
   body:[
    {predict:{q:'تريد أن تضيء لمبة في لوحة التحكم عن طريق العداد. بأي مخرج توصلها؟',opts:[
     ['CV',false,'CV قيمة عددية للتطبيقات الإلكترونية، وليست إشارة تشغيل لحمل.'],
     ['CV_BCD',false,'CV_BCD قيمة عددية مشفّرة لشاشات الأرقام، وليست إشارة تشغيل.'],
     ['Q',true,'Q «خرج للعداد بالإشارة الكهربائية… مستخدمة في دوائر التحكم الكهربائية» (ص 128).']]}},
    {watch:String.raw`<p><b>ملاحظة على الكتاب:</b> الخرج <span class="ltr">CV</span> هو قيمة العد كعدد صحيح <b>ثنائي</b> (<span class="ltr">binary</span>)، والنظام السداسي عشر مجرد طريقة لعرض هذا العدد. والخرج الثاني اسمه في الشكل <span class="ltr">(1-7)</span> <span class="ltr">CV_BCD</span> بينما يسميه النص «<span class="ltr">BCD</span>»: كل خانة عشرية فيه مكتوبة بأربع خانات ثنائية. جرّب الأداة التالية.</p>`,fix:true},
    {title:'اكتب قيمة العد وقارن طريقتي الكتابة',widget:(el,B)=>{
      let n=999;
      el.innerHTML=`<label class="w-sl"><span>قيمة العد (من <span class="ltr">0</span> إلى <span class="ltr">999</span>)</span><input type="range" min="0" max="999" step="1" dir="ltr" value="${n}"></label>
       <div class="w-row"><label class="w-l" style="display:flex;gap:8px;align-items:center">أو اكتب الرقم: <input type="number" min="0" max="999" value="${n}" style="font:inherit;width:90px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)"></label></div>
       <div class="w-facts"><div><span>العدد العشري</span><b data-o="d"></b></div><div><span>CV ثنائي (16 خانة)</span><b data-o="b" style="font-size:12px"></b></div><div><span>CV بالسداسي عشر</span><b data-o="h"></b></div><div><span>CV_BCD</span><b data-o="c" style="font-size:12px"></b></div></div>
       <p class="sub" data-o="x" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input[type=range]'),nb=el.querySelector('input[type=number]');
      const draw=()=>{o('d').textContent=n;o('b').textContent=bin16(n);o('h').textContent=hex4(n);o('c').textContent=bcd(n);
        o('x').innerHTML=`في <span class="ltr">CV_BCD</span> كل رقم عشري (${String(n).split('').map(c=>`<span class="ltr">${c}</span>`).join(' و ')}) يأخذ 4 خانات مستقلة، ولذلك يسهل عرضه على شاشة أرقام إلكترونية. أما <span class="ltr">CV</span> فهو العدد كله مكتوباً بالثنائي.`};
      rg.oninput=()=>{n=+rg.value;nb.value=n;draw()};
      nb.oninput=()=>{const v=Math.round(+nb.value);if(!isFinite(v))return;n=clamp(v,0,999);rg.value=n;draw()};
      nb.onchange=()=>{nb.value=n};
      draw();
    }},
    {add:String.raw`<p>الكتاب لم يذكر متى يصبح <span class="ltr">Q = 1</span>. في عدادات <span class="ltr">Siemens</span> يكون <span class="ltr">Q = 1</span> ما دامت قيمة العد <b>أكبر من صفر</b> (وليس عند الوصول إلى <span class="ltr">PV</span>). والعد التصاعدي لا يتوقف عند <span class="ltr">PV</span> بل عند 999، والتنازلي يتوقف عند الصفر.</p>`,title:'متى يصبح Q = 1؟'}
   ]},

  {st:6,short:'الشكل (1-7)',title:'الشكل <span class="ltr">(1-7)</span>: عداد تصاعدي وعداد تنازلي',ref:'ص 128',
   q:'في الشكل عدادان… فما الذي يميز التصاعدي من التنازلي بمجرد النظر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-7: العداد التصاعدي C1 من نوع S_CU مداخله I0.1 و I0.2 و MW20 و I0.0 ومخرجه Q4.4، والعداد التنازلي C2 من نوع S_CD مداخله I1.1 و I1.2 و MW30 و I1.0 ومخرجه Q5.5" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="خط التغذية الأيسر في المخطط السلمي: منه تبدأ المسارات إلى مداخل العدادين."><rect x="16" y="22" width="14" height="272" fill="transparent"/><line x1="23" y1="26" x2="23" y2="290" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g><rect x="150" y="26" width="92" height="112" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196" y="42" text-anchor="middle" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C1</text><text x="196" y="58" text-anchor="middle" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S_CU</text><g font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"><text x="155" y="78" text-anchor="start">CU</text><text x="155" y="96" text-anchor="start">S</text><text x="155" y="114" text-anchor="start">PV</text><text x="155" y="132" text-anchor="start">R</text><text x="237" y="78" text-anchor="end">Q</text><text x="237" y="96" text-anchor="end">CV</text><text x="237" y="114" text-anchor="end">CV_BCD</text></g><g data-tip="تلامس مفتوح ⟦NO⟧ بعنوان ⟦I0.1⟧ موصول على المدخل ⟦CU⟧: كل ضغطة تزيد عد ⟦C1⟧ واحداً."><rect x="24" y="66" width="126" height="16" fill="transparent"/><line x1="23" y1="74" x2="92" y2="74" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="68" x2="92" y2="80" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="68" x2="100" y2="80" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="74" x2="150" y2="74" stroke="#E8735A" stroke-width="2.5"/><text x="60" y="71" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I0.1</text></g><g data-tip="تلامس مفتوح بعنوان ⟦I0.2⟧ موصول على المدخل ⟦S⟧ للعداد ⟦C1⟧."><rect x="24" y="84" width="126" height="16" fill="transparent"/><line x1="23" y1="92" x2="92" y2="92" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="86" x2="92" y2="98" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="86" x2="100" y2="98" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="92" x2="150" y2="92" stroke="#4FB3A9" stroke-width="2.5"/><text x="60" y="89" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I0.2</text></g><g data-tip="⟦MW20⟧: كلمة ذاكرة تُحفظ فيها القيمة المحددة ⟦PV⟧ للعداد ⟦C1⟧. الكتاب لا يذكر قيمتها."><rect x="96" y="102" width="54" height="16" fill="transparent"/><line x1="134" y1="110" x2="150" y2="110" stroke="#F2C14E" stroke-width="2.5"/><text x="131" y="114" text-anchor="end" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">MW20</text></g><g data-tip="تلامس مفتوح بعنوان ⟦I0.0⟧ موصول على المدخل ⟦R⟧: يفصل العداد ⟦C1⟧."><rect x="24" y="120" width="126" height="16" fill="transparent"/><line x1="23" y1="128" x2="92" y2="128" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="122" x2="92" y2="134" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="122" x2="100" y2="134" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="128" x2="150" y2="128" stroke="#2C4A40" stroke-width="2.5"/><text x="60" y="125" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I0.0</text></g><g data-tip="ملف الخرج ⟦Q4.4⟧ موصول على المخرج ⟦Q⟧ للعداد ⟦C1⟧."><rect x="242" y="60" width="96" height="22" fill="transparent"/><line x1="242" y1="74" x2="306" y2="74" stroke="#E8735A" stroke-width="2.5"/><path d="M310 66 Q305 74 310 82 M320 66 Q325 74 320 82" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="315" y="60" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Q4.4</text></g><g data-tip="النقاط … تعني أن المخرجين ⟦CV⟧ و⟦CV_BCD⟧ غير موصولين في هذا الشكل."><rect x="242" y="86" width="40" height="32" fill="transparent"/><text x="248" y="99" text-anchor="start" direction="ltr" font-size="11" fill="#2C4A40" font-family="var(--mono)">…</text><text x="248" y="117" text-anchor="start" direction="ltr" font-size="11" fill="#2C4A40" font-family="var(--mono)">…</text></g><text x="196" y="155" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">عداد تصاعدي</text><rect x="150" y="166" width="92" height="112" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196" y="182" text-anchor="middle" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C2</text><text x="196" y="198" text-anchor="middle" direction="ltr" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S_CD</text><g font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"><text x="155" y="218" text-anchor="start">CD</text><text x="155" y="236" text-anchor="start">S</text><text x="155" y="254" text-anchor="start">PV</text><text x="155" y="272" text-anchor="start">R</text><text x="237" y="218" text-anchor="end">Q</text><text x="237" y="236" text-anchor="end">CV</text><text x="237" y="254" text-anchor="end">CV_BCD</text></g><g data-tip="تلامس مفتوح بعنوان ⟦I1.1⟧ موصول على المدخل ⟦CD⟧: كل ضغطة تنقص عد ⟦C2⟧ واحداً."><rect x="24" y="206" width="126" height="16" fill="transparent"/><line x1="23" y1="214" x2="92" y2="214" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="208" x2="92" y2="220" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="208" x2="100" y2="220" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="214" x2="150" y2="214" stroke="#4FB3A9" stroke-width="2.5"/><text x="60" y="211" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I1.1</text></g><g data-tip="تلامس مفتوح بعنوان ⟦I1.2⟧ موصول على المدخل ⟦S⟧ للعداد ⟦C2⟧."><rect x="24" y="224" width="126" height="16" fill="transparent"/><line x1="23" y1="232" x2="92" y2="232" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="226" x2="92" y2="238" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="226" x2="100" y2="238" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="232" x2="150" y2="232" stroke="#4FB3A9" stroke-width="2.5"/><text x="60" y="229" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I1.2</text></g><g data-tip="⟦MW30⟧: كلمة ذاكرة تُحفظ فيها القيمة المحددة ⟦PV⟧ للعداد ⟦C2⟧. الكتاب لا يذكر قيمتها."><rect x="96" y="242" width="54" height="16" fill="transparent"/><line x1="134" y1="250" x2="150" y2="250" stroke="#F2C14E" stroke-width="2.5"/><text x="131" y="254" text-anchor="end" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">MW30</text></g><g data-tip="تلامس مفتوح بعنوان ⟦I1.0⟧ موصول على المدخل ⟦R⟧: يفصل العداد ⟦C2⟧."><rect x="24" y="260" width="126" height="16" fill="transparent"/><line x1="23" y1="268" x2="92" y2="268" stroke="#2C4A40" stroke-width="2"/><line x1="92" y1="262" x2="92" y2="274" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="262" x2="100" y2="274" stroke="#2C4A40" stroke-width="2.5"/><line x1="100" y1="268" x2="150" y2="268" stroke="#2C4A40" stroke-width="2.5"/><text x="60" y="265" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">I1.0</text></g><g data-tip="ملف الخرج ⟦Q5.5⟧ موصول على المخرج ⟦Q⟧ للعداد ⟦C2⟧."><rect x="242" y="200" width="96" height="22" fill="transparent"/><line x1="242" y1="214" x2="306" y2="214" stroke="#E8735A" stroke-width="2.5"/><path d="M310 206 Q305 214 310 222 M320 206 Q325 214 320 222" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="315" y="200" text-anchor="middle" direction="ltr" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Q5.5</text></g><text x="248" y="239" text-anchor="start" direction="ltr" font-size="11" fill="#2C4A40" font-family="var(--mono)">…</text><text x="248" y="257" text-anchor="start" direction="ltr" font-size="11" fill="#2C4A40" font-family="var(--mono)">…</text><text x="196" y="296" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">عداد تنازلي</text></svg>`,
   cap:'الشكل <span class="ltr">(1-7)</span> بلغة <span class="ltr">LAD</span>: العلوي «عداد تصاعدي» والسفلي «عداد تنازلي».<br><b>مرّر المؤشر على التلامسات والعناوين والملفات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل، ما العنوان الذي يحمل القيمة المحددة PV للعداد التنازلي C2؟',opts:[
     ['I1.2',false,'I1.2 تلامس موصول على المدخل S للعداد C2.'],
     ['MW30',true,'MW30 كلمة ذاكرة موصولة على المدخل PV للعداد C2، و MW20 للعداد C1.'],
     ['Q5.5',false,'Q5.5 ملف الخرج الموصول على المخرج Q للعداد C2.']]}}
   ],
   body:[
    {tip:String.raw`<p>الفرق بين العدادين في الشكل: اسم الصندوق (<span class="ltr">S_CU</span> أو <span class="ltr">S_CD</span>) واسم مدخل العد الأول (<span class="ltr">CU</span> أو <span class="ltr">CD</span>). أما باقي الأطراف <span class="ltr">S</span> و<span class="ltr">PV</span> و<span class="ltr">R</span> و<span class="ltr">Q</span> و<span class="ltr">CV</span> و<span class="ltr">CV_BCD</span> فهي نفسها في الاثنين.</p>
     <p>الكتاب لم يضع جدولاً لهذا الشكل؛ هذا جدول مستنتج من العناوين المكتوبة عليه:</p>
     <div class="tablebox" style="max-width:520px"><table class="tt"><thead><tr><th>الطرف</th><th>العداد التصاعدي <span class="ltr">C1</span></th><th>العداد التنازلي <span class="ltr">C2</span></th></tr></thead><tbody>
     <tr><td>مدخل العد</td><td><span class="ltr mono">I0.1</span> على <span class="ltr">CU</span></td><td><span class="ltr mono">I1.1</span> على <span class="ltr">CD</span></td></tr>
     <tr><td>المدخل <span class="ltr">S</span></td><td class="mono">I0.2</td><td class="mono">I1.2</td></tr>
     <tr><td>القيمة المحددة <span class="ltr">PV</span></td><td class="mono">MW20</td><td class="mono">MW30</td></tr>
     <tr><td>الفصل <span class="ltr">R</span></td><td class="mono">I0.0</td><td class="mono">I1.0</td></tr>
     <tr><td>المخرج <span class="ltr">Q</span></td><td class="mono">Q4.4</td><td class="mono">Q5.5</td></tr></tbody></table></div>`,title:'كيف تقرأ الشكل؟'},
    {predict:{q:'ضغطت ثلاث مرات على الضاغط الموصول بالعنوان I0.1. ماذا حدث للعداد C1؟',opts:[
     ['لم يتغير، لأن I0.1 موصول على R',false,'I0.1 موصول على CU، والموصول على R هو I0.0.'],
     ['نقص ثلاث عدّات',false,'C1 عداد تصاعدي (S_CU)، ومدخل CU يزيد العد ولا ينقصه.'],
     ['زاد ثلاث عدّات',true,'I0.1 موصول على المدخل CU للعداد التصاعدي C1، وكل ضغطة تزيده واحداً.']]}},
    {tip:String.raw`<p>جرّب العدادين بنفسك في تبويب «المختبر»: غيّر <span class="ltr">PV</span>، واضغط <span class="ltr">CU</span> و<span class="ltr">CD</span> و<span class="ltr">S</span> و<span class="ltr">R</span>، وراقب <span class="ltr">CV</span> و<span class="ltr">CV_BCD</span> والمخرجين <span class="ltr">Q4.4</span> و<span class="ltr">Q5.5</span>.</p>`}
   ]},

  {recap:[
   String.raw`تستخدم العدادات لعدّ المنتجات في خطوط الإنتاج، وللتحكم في المزمنات باستخدام التغير في خرجها (ص 127).`,
   String.raw`نوعان: التصاعدي <span class="ltr">CU</span> يعدّ من الصفر إلى القيمة المحددة، والتنازلي <span class="ltr">CD</span> من القيمة المحددة إلى الصفر، وأقصى قيمة للعد 999 (ص 127).`,
   String.raw`المداخل: <span class="ltr">CU</span> أو <span class="ltr">CD</span> للعد، و<span class="ltr">PV</span> للقيمة المحددة، و<span class="ltr">R</span> للفصل في أي لحظة، و<span class="ltr">S</span> (الأدق أنه يضع <span class="ltr">PV</span> في العداد) (ص 127).`,
   String.raw`المخارج: <span class="ltr">Q</span> إشارة كهربائية لدوائر التحكم، و<span class="ltr">CV</span> و<span class="ltr">CV_BCD</span> قيمة العد للتطبيقات الإلكترونية (ص 128).`,
   String.raw`الشكل (1-7): العداد التصاعدي <span class="ltr">C1</span> (<span class="ltr">S_CU</span>) مخرجه <span class="ltr">Q4.4</span>، والتنازلي <span class="ltr">C2</span> (<span class="ltr">S_CD</span>) مخرجه <span class="ltr">Q5.5</span> (ص 128).`]}
],
 theory:[
  {h:'محتويات الوحدة السابعة',ref:'ص 126',html:`<p>«الوحدة السابعة: تطبيق على محرك الخطوة»، وفيها:</p><ul><li><b>أولاً:</b> العدادات: أنواعها وطريقة عملها واستخداماتها.</li><li><b>ثانياً:</b> فكرة عمل محرك الخطوة.</li><li><b>ثالثاً:</b> كتابة برنامج للتحكم بمحرك الخطوة باستخدام (PLC) باللغة (LAD).</li></ul>
   <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات. <b>الأهداف:</b> أن يعرف المتدرب طريقة التحكم في محرك الخطوة، وأن يكتب برنامجاً للتحكم فيه. <b>مستوى الأداء:</b> 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {h:'أولاً: العدادات — 1- مقدمة',ref:'ص 127',html:'<p>«تستخدم العدادات في التطبيقات الصناعية على نطاق واسع، لعدة أغراض منها القيام بعدّ منتج معين في أحد خطوط الإنتاج. كما تستخدم في أغراض التحكم في المزمنات وذلك باستخدام التغير الذي يحدث في الخرج من هذه العدادات.»</p>'},
  {h:'2- أنواع العدادات',ref:'ص 127',html:`<ol><li><b>العداد التصاعدي (CU):</b> يعدّ تصاعدياً من الصفر إلى القيمة المحددة للعداد.</li><li><b>العداد التنازلي (CD):</b> يعدّ تنازلياً من القيمة المحددة للعداد إلى الصفر.</li></ol><p>«ويشبه تمثيل العداد إلى حد كبير تمثيل المزمن»، وله عدد من المداخل وعدد من المخارج.</p>`},
  {h:'المداخل',ref:'ص 127',html:`<ol><li><b>CU:</b> يُستخدم عندما يعمل العداد تصاعدياً. يستمر العد في الزيادة حتى القيمة المحددة مسبقاً أو حتى الرقم <b>999</b> وهو أقصى قيمة للعد، ثم يتوقف العداد، أو عند وصول إشارة فصل إلى الطرف R يُفصل العداد مباشرة.</li>
   <li><b>R:</b> طرف الفصل (Reset)، يُستخدم لفصل العداد في أي لحظة من لحظات العد.</li>
   <li><b>CD:</b> يُستخدم عندما يعمل العداد تنازلياً. يستمر العد في التناقص من القيمة المحددة مسبقاً أو من الرقم 999 إلى أن يصل إلى الصفر، ثم يتوقف، أو يُفصل مباشرة بإشارة على R.</li>
   <li><b>PV:</b> تحدد القيمة العددية للعد، للعدادين التصاعدي أو التنازلي.</li></ol><p><b>S:</b> «مدخل لإعادة تصفير العداد. للعدادين التصاعدي أو التنازلي» (هكذا في الكتاب).</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'وصف المدخل <b>S</b> بأنه «لإعادة تصفير العداد» غير دقيق. في عدادات Siemens (S_CU و S_CD) الطرف <b>S يضع في العداد القيمة PV</b> لحظة تغيّره من 0 إلى 1، أما التصفير فيكون بالطرف <b>R</b> الذي وصفه الكتاب نفسه بأنه طرف الفصل. وجاء المدخل S في الكتاب خارج الترقيم بعد البند 4. جرّب ذلك في المختبر: اضغط S فتصبح القيمة = PV وليس صفراً.'+'</div>'},
  {h:'المخارج',ref:'ص 128',html:`<p>«هناك ثلاثة مخارج للعداد التصاعدي والتنازلي»:</p><ol><li><b>CV:</b> خرج للعداد «بالنظام السداسي عشر»، وهذه الإشارات مستخدمة في التطبيقات الإلكترونية.</li><li><b>BCD:</b> خرج للعداد بالنظام الثنائي المشفّر، مستخدم في التطبيقات الإلكترونية.</li><li><b>Q:</b> خرج للعداد بالإشارة الكهربائية، مستخدم في دوائر التحكم الكهربائية.</li></ol>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الخرج <b>CV</b> هو قيمة العد كعدد صحيح <b>ثنائي</b> (binary)، والنظام السداسي عشر مجرد طريقة لعرض هذا العدد. والخرج الثاني اسمه في الشكل (1-7) <span class="mono">CV_BCD</span> بينما يسميه النص «BCD»: كل خانة عشرية فيه مكتوبة بأربع خانات ثنائية. جرّب الأداة التالية.'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اكتب رقماً بين 0 و 999 وقارن بين طريقة كتابة CV و CV_BCD.'},
  {widget:(el)=>{let n=25;const draw=()=>{el.innerHTML=`<div class="fig"><label style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">قيمة العد: <input type="number" min="0" max="999" value="${n}" style="font:inherit;width:90px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)"></label>
     <div class="facts"><div class="fact"><span>العدد العشري</span><b>${n}</b></div><div class="fact"><span>CV ثنائي (16 خانة)</span><b style="font-size:14px">${bin16(n)}</b></div><div class="fact"><span>نفس CV مكتوباً بالسداسي عشر</span><b>${hex4(n)}</b></div><div class="fact"><span>CV_BCD</span><b style="font-size:14px">${bcd(n)}</b></div></div>
     <p class="sub">في BCD كل رقم عشري (${String(n).split('').join(' و ')}) يأخذ 4 خانات مستقلة، ولذلك يسهل عرضه على شاشة أرقام إلكترونية.</p></div>`;
    const i=el.querySelector('input');i.oninput=()=>{n=clamp(Math.round(+i.value||0),0,999);const pos=i.selectionStart;draw();const j=el.querySelector('input');j.focus();try{j.setSelectionRange(pos,pos)}catch(e){}}};draw()}},
  {fig:'(1-7)',ref:'ص 128',caption:'العداد العلوي «عداد تصاعدي» S_CU (C1)، والسفلي «عداد تنازلي» S_CD (C2)',draw:()=>`<div class="svgbox">${counterBoxSVG({type:'S_CU',name:'C1',inp:['I0.1','I0.2','I0.0'],pv:'MW20',q:'Q4.4'})}</div><p class="sub" style="text-align:center">عداد تصاعدي</p><div class="svgbox">${counterBoxSVG({type:'S_CD',name:'C2',inp:['I1.1','I1.2','I1.0'],pv:'MW30',q:'Q5.5'})}</div><p class="sub" style="text-align:center">عداد تنازلي</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — متى يصبح Q = 1؟</b> الكتاب لم يشرح ذلك. في عدادات Siemens يكون Q = 1 ما دامت قيمة العد <b>أكبر من صفر</b> (وليس عند الوصول إلى PV). والعد التصاعدي لا يتوقف عند PV بل عند 999، والتنازلي يتوقف عند الصفر.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'صياغة العداد التنازلي «يتناقص من القيمة المحددة مسبقاً أو من الرقم 999» ملتبسة: العداد يعدّ تنازلياً من القيمة الموجودة فيه (التي وضعها الطرف S من PV) نحو الصفر.'+'</div>'},
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
 const segH=()=>`<div class="variant"><span>طريقة التشغيل:</span><div class="seg" role="group"><button data-mode="book" aria-pressed="${mode==='book'}">تسلسل الكتاب يدوياً</button><button data-mode="plc" aria-pressed="${mode==='plc'}">برنامج PLC (من إعداد المحاكاة، ليس من الكتاب)</button></div>
  ${mode==='plc'?`<div class="callout err">${NOT_BOOK} <span class="fixnote">الكتاب يعد في ص 126 ببرنامج LAD للمحرك لكنه غير موجود في الوحدة. </span>هذا البرنامج كتبناه لتجربة تشغيل المحرك بالـ PLC: عداد C1 رقمه رقم الخطوة، ومزمن T1 يولّد النبضات.</div>`:`<p class="sub">تنفّذ بيدك جدول الخطوات الثماني كما في ص 130: كل ضغطة = نبضة CLOCK واحدة.</p>`}</div>`;
 function build(){
  const ctl=mode==='book'?`<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="prev">◀ الخطوة السابقة (عكسي)</button><button class="btn primary" data-act="next">الخطوة التالية (أمامي) ▶</button>
     <label class="toggle" style="margin:0"><input type="checkbox" id="u7auto" ${auto?'checked':''}> نبضات تلقائية</label>
     <div class="seg" role="group"><button data-dir="1" aria-pressed="${dir===1}">أمامي</button><button data-dir="-1" aria-pressed="${dir===-1}">عكسي</button></div>
     <button class="btn" data-act="reset">إعادة</button></div>`
   :`<div class="pbs" style="align-items:center"><button class="pb red" data-pb="S0" aria-label="إيقاف"><span class="cap">S0</span><small>إيقاف I0.0</small></button><button class="pb green" data-pb="S1" aria-label="تشغيل"><span class="cap">S1</span><small>تشغيل I0.1</small></button>
     <button class="sw" data-sw="S2" aria-pressed="${sw.S2?'true':'false'}"><span class="knob"></span><b>S2</b><small>عكسي I0.2</small></button><button class="btn" data-act="preset">إعادة المحاكاة</button></div>`;
  el.innerHTML=segH()+`<div class="grid"><div class="panel c7"><h2>محرك الخطوة <small id="u7lbl"></small></h2>${ctl}<div id="u7view" style="margin-top:8px"></div><div class="facts" id="u7facts"></div></div>
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
 stations:[
  {intro:true},

  {st:1,short:'تعريف محرك الخطوة',title:'ثانياً: تعريف محرك الخطوة',ref:'ص 129',
   q:'المحرك العادي يدور ما دام موصولاً بالمصدر… فكيف نجعل محركاً يتحرك زاوية محددة ثم يقف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تركيبة محرك الخطوة: المحرك M1، وملف الوجه الأول طرفاه A و C، وملف الوجه الثاني طرفاه B و D" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦M1⟧: محرك الخطوة. عضوه الدائر في الوسط، وملفاه على العضو الثابت."><circle cx="215" cy="130" r="52" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="215" y="137" text-anchor="middle" direction="ltr" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M1</text></g><g data-tip="مع كل نبضة توصيل يتحرك العضو الدائر ⟦7.5⟧ درجة (السهم مكبّر للتوضيح)."><path d="M215 64 A66 66 0 0 1 248 72.2" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><polygon points="256,77 243,77.5 249.5,66" fill="#E8735A"/><text x="300" y="52" text-anchor="middle" direction="ltr" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">7.5°</text><text x="300" y="72" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">لكل نبضة</text></g><g data-tip="ملف الوجه الأول: طرفاه ⟦A⟧ (أعلى) و⟦C⟧ (أسفل)."><rect x="60" y="60" width="34" height="122" fill="transparent"/><line x1="80" y1="45" x2="80" y2="66" stroke="#2C4A40" stroke-width="2.5"/><path d="M80 66 A11 11 0 0 1 80 88 A11 11 0 0 1 80 110 A11 11 0 0 1 80 132 A11 11 0 0 1 80 154 A11 11 0 0 1 80 176" fill="none" stroke="#E8735A" stroke-width="3"/><line x1="80" y1="176" x2="80" y2="197" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="ملف الوجه الثاني: طرفاه ⟦B⟧ (يسار) و⟦D⟧ (يمين)."><rect x="154" y="236" width="122" height="30" fill="transparent"/><line x1="139" y1="256" x2="160" y2="256" stroke="#2C4A40" stroke-width="2.5"/><path d="M160 256 A11 11 0 0 1 182 256 A11 11 0 0 1 204 256 A11 11 0 0 1 226 256 A11 11 0 0 1 248 256 A11 11 0 0 1 270 256" fill="none" stroke="#4FB3A9" stroke-width="3"/><line x1="270" y1="256" x2="291" y2="256" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="الخط المتقطع يعني أن الملفين جزء من المحرك ⟦M1⟧ نفسه."><line x1="96" y1="121" x2="163" y2="121" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 5"/><line x1="215" y1="236" x2="215" y2="182" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 5"/></g><g fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"><circle cx="80" cy="38" r="7"/><circle cx="80" cy="204" r="7"/><circle cx="132" cy="256" r="7"/><circle cx="298" cy="256" r="7"/></g><g font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr" text-anchor="middle"><text x="58" y="44">A</text><text x="58" y="210">C</text><text x="132" y="284">B</text><text x="298" y="284">D</text></g></svg>`,
   cap:'تركيبة المحرك كما في ص 129 (شكل بلا رقم): ملف <span class="ltr">A–C</span> وملف <span class="ltr">B–D</span>.<br><b>مرّر المؤشر على المحرك والملفين والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أعطينا المحرك نبضة توصيل واحدة فقط. كم يتحرك العضو الدائر؟',opts:[
     ['7.5 درجة ثم يقف',true,'الكتاب: «يتحرك العضو الدائر (7.5) درجة في كل نبضة توصيل» (ص 129).'],
     ['دورة كاملة',false,'محرك الخطوة لا يدور دورة كاملة إلا بعد نبضات كثيرة؛ كل نبضة خطوة صغيرة.'],
     ['يدور باستمرار حتى نفصل المصدر',false,'هذا سلوك المحرك العادي. محرك الخطوة يتحرك خطوة واحدة مع كل نبضة ثم يقف.']]}}
   ],
   body:[
    {book:String.raw`<p>محرك الخطوة تمت دراسته في مادة الآلات بشكل مفصل من ناحية الأنواع والتركيب والاستخدام. وبشكل مختصر للنوع المستخدم في هذا التطبيق هو محرك ذو وجهين يتحرك العضو الدائر (7.5) درجة في كل نبضة توصيل. لذلك نحتاج إلى العدادات في عملية التشغيل.</p>
     <p>والشكل يوضح تركيبة المحرك.</p>`,ref:'ص 129'},
    {tip:String.raw`<p>«ذو وجهين» يعني أن له <b>ملفين</b> على العضو الثابت: ملف الوجه الأول طرفاه <span class="ltr">A</span> و<span class="ltr">C</span>، وملف الوجه الثاني طرفاه <span class="ltr">B</span> و<span class="ltr">D</span>. عندما نغيّر الجهد على أطراف الملفين بترتيب معيّن ينتقل المجال خطوة، فيلحقه العضو الدائر خطوة.</p>`,title:'ماذا يعني «ذو وجهين»؟'},
    {predict:{q:'لماذا قال الكتاب «لذلك نحتاج إلى العدادات في عملية التشغيل»؟',opts:[
     ['لأن العداد يزيد سرعة المحرك',false,'العداد لا يغيّر السرعة؛ هو يعدّ فقط.'],
     ['لأن العداد يحمي المحرك من زيادة التيار',false,'الحماية عمل أجهزة أخرى؛ العداد يعدّ الإشارات.'],
     ['لأن كل نبضة تحرّك المحرك زاوية ثابتة، فعدّ النبضات يحدد مقدار الحركة',true,'كل نبضة = 7.5°، فإذا عددنا النبضات عرفنا الزاوية التي تحركها المحرك، واستطعنا إيقافه عند العدد المطلوب.']]}},
    {title:'كم نبضة؟ كم درجة؟',widget:(el,B)=>{
      let n=1;
      const ticks=Array.from({length:48},(_,i)=>{const a=(i*7.5-90)*Math.PI/180,r1=i%6===0?54:60;return `<line x1="${(80+r1*Math.cos(a)).toFixed(1)}" y1="${(80+r1*Math.sin(a)).toFixed(1)}" x2="${(80+66*Math.cos(a)).toFixed(1)}" y2="${(80+66*Math.sin(a)).toFixed(1)}" stroke="var(--muted)" stroke-width="${i%6===0?2:1}"/>`}).join('');
      el.innerHTML=`<label class="w-sl"><span>عدد النبضات: <b class="ltr" data-o="n"></b></span><input type="range" min="0" max="96" step="1" dir="ltr" value="${n}"></label>
       <div class="w-row"><button class="btn" type="button" data-d="-1">− نبضة</button><button class="btn pri" type="button" data-d="1">+ نبضة</button><button class="btn" type="button" data-z>من الصفر</button></div>
       <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:10px"><svg viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="عمود المحرك"><circle cx="80" cy="80" r="70" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>${ticks}<g data-o="sh"><line x1="80" y1="80" x2="80" y2="22" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="22" r="5" fill="#E8735A"/></g><circle cx="80" cy="80" r="8" fill="var(--fg)"/></svg>
       <div class="w-facts" style="flex:1;min-width:230px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:0"><div><span>الزاوية = النبضات × 7.5°</span><b data-o="a"></b></div><div><span>الدورات (استنتاج)</span><b data-o="r"></b></div></div></div>
       <p class="sub" style="margin-top:8px">كل علامة صغيرة على القرص = نبضة واحدة. الدورة الكاملة <span class="ltr">360°</span> تحتاج <span class="ltr">360 ÷ 7.5 = 48</span> نبضة: هذا استنتاج حسابي، والكتاب لم يذكره.</p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const fm=x=>{let s=x.toFixed(2);return s.replace(/0+$/,'').replace(/\.$/,'')};
      const draw=()=>{o('n').textContent=n;o('a').textContent=fm(n*7.5)+'°';o('r').textContent=fm(n/48);o('sh').setAttribute('transform',`rotate(${n*7.5} 80 80)`);rg.value=n};
      rg.oninput=()=>{n=+rg.value;draw()};
      el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{n=clamp(n+(+b.dataset.d),0,96);draw()});
      el.querySelector('[data-z]').onclick=()=>{n=0;draw()};
      draw();
    }},
    {add:String.raw`<p>محركات الخطوة موجودة في الطابعات، والطابعات ثلاثية الأبعاد، وآلات القطع والتفريز المبرمجة، وفي تحريك عدسات بعض الكاميرات: كلها تحتاج حركة بزاوية محددة بدقة دون حساس يقيس مكان العمود.</p>`,title:'أين تجده؟'},
    {watch:String.raw`<p>رقم <span class="ltr">48</span> نبضة للدورة <b>ليس من الكتاب</b>؛ هو ناتج قسمة <span class="ltr">360</span> على <span class="ltr">7.5</span>.</p>`},
    {watch:String.raw`<p>في صفحة المحتويات (ص 126) سُمّي هذا الجزء «فكرة عمل محرك الخطوة»، وفي المتن «تعريف محرك الخطوة».</p>`,fix:true}
   ]},

  {st:2,short:'خطوات العضو الدائر',title:'خطوات تحرك العضو الدائر',ref:'ص 130',
   q:'ثمانية أنماط للجهد على أربعة أطراف… كيف تصنع حركة دوران منتظمة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العضو الدائر في الخطوة 4: الطرف A عليه موجب، والطرف B عليه سالب، والطرفان C و D صفر، والمغناطيس رأسي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><circle cx="180" cy="150" r="104" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g data-tip="الطرف ⟦A⟧ (أعلى) عليه ⟦+⟧ في الخطوة 4. اللون البرتقالي = ⟦+⟧."><circle cx="180" cy="62" r="24" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="68" text-anchor="middle" direction="ltr" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A+</text></g><g data-tip="الطرف ⟦C⟧ (يمين) عليه ⟦0⟧ في الخطوة 4: لا جهد عليه. اللون الرمادي = ⟦0⟧."><circle cx="268" cy="150" r="24" fill="#D9D4CC" stroke="#2C4A40" stroke-width="2.5"/><text x="268" y="156" text-anchor="middle" direction="ltr" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C0</text></g><g data-tip="الطرف ⟦B⟧ (أسفل) عليه ⟦−⟧ في الخطوة 4. اللون الأزرق المخضر = ⟦−⟧."><circle cx="180" cy="238" r="24" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="244" text-anchor="middle" direction="ltr" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">B−</text></g><g data-tip="الطرف ⟦D⟧ (يسار) عليه ⟦0⟧ في الخطوة 4: لا جهد عليه."><circle cx="92" cy="150" r="24" fill="#D9D4CC" stroke="#2C4A40" stroke-width="2.5"/><text x="92" y="156" text-anchor="middle" direction="ltr" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">D0</text></g><g data-tip="العضو الدائر في رسم الكتاب: مغناطيس قطباه ⟦N⟧ و⟦S⟧. في الخطوة 4 يكون رأسياً، باتجاه الطرفين ⟦A⟧ و⟦B⟧ اللذين عليهما جهد."><circle cx="180" cy="150" r="50" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><rect x="168" y="106" width="24" height="44" rx="4" fill="#2C4A40"/><rect x="168" y="150" width="24" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="134" text-anchor="middle" direction="ltr" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">N</text><text x="180" y="180" text-anchor="middle" direction="ltr" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><text x="180" y="290" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">الخطوة 4 من الخطوات الثماني</text></svg>`,
   cap:'وضع العضو الدائر في الخطوة 4 كما رسمه الكتاب في ص 130: <span class="ltr">A+</span> و<span class="ltr">C0</span> و<span class="ltr">B−</span> و<span class="ltr">D0</span>.<br><b>مرّر المؤشر على الأطراف والمغناطيس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>والشكل التالي يوضح خطوات تحرك العضو الدائر للمحرك مع كل نبضة والجهد الموصل على ملفات العضو الثابت.</p>`,ref:'ص 130'},
    {predict:{q:'في الخطوة 6 من الجدول تحت، أي الأطراف عليها جهد (1)؟',opts:[
     ['A و C',false,'في الخطوة 6: A = 0. انظر عمود الخطوة 6 في المخطط.'],
     ['B و D',false,'في الخطوة 6: B = 0 و D = 0؛ الطرفان B و D معاً في الخطوة 1 فقط.'],
     ['C فقط',true,'الخطوة 6 في الجدول: A = 0، B = 0، C = 1، D = 0.']]}}
   ],
   body:[
    {html:`<figure class="fig"><div class="svgbox">${stepTimingSVG(0)}</div><figcaption>نبضات <span class="ltr">CLOCK</span> والجهد على الأطراف <span class="ltr">A</span> و<span class="ltr">B</span> و<span class="ltr">C</span> و<span class="ltr">D</span> (شكل بلا رقم في الكتاب) <span class="ref">ص 130</span></figcaption></figure>
     <p>وتحت كل نبضة رسم الكتاب العضو الدائر (مغناطيس <span class="ltr">N–S</span>) مع إشارة كل طرف (<span class="ltr">+</span> أو <span class="ltr">−</span> أو <span class="ltr">0</span>)، والأطراف في هذا الرسم: <span class="ltr">A</span> أعلى، و<span class="ltr">C</span> يمين، و<span class="ltr">B</span> أسفل، و<span class="ltr">D</span> يسار. الجدول التالي يجمع الرسمين:</p>${SEQ_TABLE(0)}
     <figure class="fig"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:6px">${[1,2,3,4,5,6,7,8].map(k=>`<div class="svgbox" style="margin:0">${rotorMini(k)}</div>`).join('')}</div><figcaption>وضع العضو الدائر في الخطوات الثماني (البرتقالي <span class="ltr">+</span>، الأزرق <span class="ltr">−</span>، الرمادي <span class="ltr">0</span>) <span class="ref">ص 130</span></figcaption></figure>`},
    {tip:String.raw`<p>اقرأ المخطط عموداً عموداً: كل عمود خطوة، والخط المرتفع يعني أن على الطرف جهداً (<span class="ltr">1</span>). لاحظ أن الخطوات تتناوب: خطوة فيها <b>طرف واحد</b> عليه جهد (<span class="ltr">2</span>، <span class="ltr">4</span>، <span class="ltr">6</span>، <span class="ltr">8</span>) وخطوة فيها <b>طرفان</b> (<span class="ltr">1</span>، <span class="ltr">3</span>، <span class="ltr">5</span>، <span class="ltr">7</span>). هذه الطريقة تسمى «نصف خطوة»، وفيها تنتقل المغناطيسية بانتظام حول المحرك. وبعد الخطوة <span class="ltr">8</span> يعود الجدول إلى الخطوة <span class="ltr">1</span>.</p>`,title:'كيف تقرأ المخطط؟'},
    {predict:{q:'نريد أن يدور المحرك في الاتجاه المعاكس. ماذا نفعل؟',opts:[
     ['نعكس قطبية مصدر القدرة كله',false,'هذا يعكس الإشارات كلها معاً، ولا يغيّر ترتيب الخطوات.'],
     ['نطبّق الخطوات بالترتيب المعكوس: 8 ثم 7 ثم 6 …',true,'قراءة الجدول من الأسفل إلى الأعلى تنقل المغناطيسية في الاتجاه المعاكس، فيلحقها العضو الدائر.'],
     ['نزيد عدد النبضات',false,'عدد النبضات يحدد مقدار الحركة، لا اتجاهها.']]}},
    {tip:String.raw`<p>في رسم الكتاب المبسط يدور المغناطيس ثُمن دورة (<span class="ltr">45°</span>) بين كل رسم والذي يليه، أما المحرك الحقيقي المستخدم فيتحرك عموده <span class="ltr">7.5°</span> فقط مع كل نبضة، لأن عضوه الدائر فيه أقطاب (أسنان) كثيرة. الرسم يشرح <b>الفكرة</b>، وليس الزاوية الحقيقية.</p>`,title:'الرسم مبسّط'},
    {watch:String.raw`<p><b>ملاحظة على الكتاب:</b> رموز الإشارات (<span class="ltr">+</span> و<span class="ltr">−</span> و<span class="ltr">0</span>) تحت الرسوم لا تتفق دائماً مع مستويات <span class="ltr">A</span> و<span class="ltr">B</span> و<span class="ltr">C</span> و<span class="ltr">D</span> في المخطط الزمني: في الخطوة 1 مثلاً <span class="ltr">A = 0</span> لكنه مرسوم <span class="ltr">A−</span>، وفي الخطوة 2 <span class="ltr">A = 0</span> مرسوم <span class="ltr">A0</span>. كما أن رسم التركيبة (ص 129) يجعل <span class="ltr">A</span> و<span class="ltr">C</span> طرفي ملف واحد، بينما الرموز تعطي <span class="ltr">A</span> و<span class="ltr">C</span> إشارتين مستقلتين (<span class="ltr">A−</span> مع <span class="ltr">C−</span> في الخطوة 1). الكتاب لا يشرح العلاقة بين الإشارة المنطقية والقطبية، فنقلناهما كما هما.</p>`,fix:true},
    {tip:String.raw`<p>نفّذ الخطوات الثماني بيدك، نبضة نبضة، وشاهد العمود يتحرك <span class="ltr">7.5°</span> مع كل نبضة، في تبويب «المختبر».</p>`}
   ]},

  {st:3,short:'المطلوب',title:'المطلوب',ref:'ص 130',
   q:'الكتاب يعطيك المحرك والعداد… ثم يطلب منك أن تجمعهما. أين البرنامج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صفحة 130: فقرة المطلوب، وتحتها مكان فارغ لا يوجد فيه برنامج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="82" y="26" width="196" height="270" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="فقرة «المطلوب»: آخر ما في الوحدة. تطلب التحكم في عدد دورات المحرك بالعداد عن طريق الـ ⟦PLC⟧."><rect x="98" y="40" width="164" height="78" fill="transparent"/><text x="180" y="62" text-anchor="middle" direction="rtl" font-size="16" fill="#2C4A40" font-weight="700">المطلوب</text><rect x="102" y="76" width="156" height="7" rx="3.5" fill="#2C4A40" opacity=".35"/><rect x="112" y="90" width="146" height="7" rx="3.5" fill="#2C4A40" opacity=".35"/><rect x="162" y="104" width="96" height="7" rx="3.5" fill="#2C4A40" opacity=".35"/></g><g data-tip="بعد فقرة «المطلوب» لا يوجد في الكتاب برنامج ⟦LAD⟧ ولا ⟦FBD⟧ ولا ⟦STL⟧ ولا جدول دخل وخرج، والصفحة التالية غلاف الوحدة الثامنة."><rect x="100" y="132" width="160" height="128" rx="8" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="8 6"/><text x="180" y="190" text-anchor="middle" direction="rtl" font-size="15" fill="#2C4A40" font-weight="700">لا يوجد برنامج</text><text x="180" y="212" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40">ولا جدول دخل وخرج</text></g><text x="180" y="284" text-anchor="middle" direction="ltr" font-size="12" fill="#2C4A40" font-family="var(--mono)">130</text></svg>`,
   cap:'آخر صفحة في الوحدة (ص 130): فقرة «المطلوب» ثم لا شيء.<br><b>مرّر المؤشر على الفقرة والمكان الفارغ (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>توصيل محرك الخطوة مصدر القدرة ويتم التحكم في عدد الدورات من خلال العداد تصاعدياً أو تنازلياً وذلك عن طريق (<span class="ltr">PLC</span>).</p>`,ref:'ص 130'}
   ],
   body:[
    {predict:{q:'الكتاب يطلب التحكم في «عدد الدورات» بالعداد. ماذا سيعدّ العداد؟',opts:[
     ['الدقائق التي يعمل فيها المحرك',false,'عدّ الزمن عمل المزمن، والزمن لا يحدد عدد الدورات بدقة.'],
     ['النبضات التي تصل إلى المحرك',true,'كل نبضة تحرّك المحرك 7.5°، فعدد النبضات يحدد الزاوية وعدد الدورات.'],
     ['عدد ملفات المحرك',false,'للمحرك ملفان فقط، وعددهما لا يتغير.']]}},
    {watch:String.raw`<p><b>ملاحظة على الكتاب:</b> في ص 126 يعد الكتاب بـ «ثالثاً: كتابة برنامج للتحكم بمحرك الخطوة باستخدام (<span class="ltr">PLC</span>) باللغة (<span class="ltr">LAD</span>)»، لكن هذا الجزء <b>غير موجود</b>. لذلك في المختبر طريقتان: «تسلسل الكتاب يدوياً»، و«برنامج <span class="ltr">PLC</span>» كتبناه نحن ومعلَّم بوضوح أنه <b>ليس من الكتاب</b>: فيه عداد <span class="ltr">C1</span> رقمه رقم الخطوة، ومزمن <span class="ltr">T1</span> يولّد النبضات، ومفتاح <span class="ltr">S2</span> للاتجاه.</p>`,fix:true},
    {tip:String.raw`<p>هذا المطلوب نطبّقه في الدرس التالي: تكتب عدد الخطوات المطلوب، فيعدّها العداد ويوقف المحرك عند الوصول إليها.</p>`}
   ]},

  {recap:[
   String.raw`محرك الخطوة في هذا التطبيق محرك ذو وجهين: ملف طرفاه <span class="ltr">A</span> و<span class="ltr">C</span>، وملف طرفاه <span class="ltr">B</span> و<span class="ltr">D</span> (ص 129).`,
   String.raw`يتحرك العضو الدائر <span class="ltr">7.5°</span> مع كل نبضة توصيل، لذلك نحتاج إلى العدادات في التشغيل (ص 129). والدورة الكاملة <span class="ltr">48</span> نبضة (استنتاج حسابي).`,
   String.raw`الخطوات الثماني (ص 130) تتناوب بين طرف واحد عليه جهد وطرفين، ثم تعود إلى الخطوة الأولى؛ وعكس ترتيبها يعكس اتجاه الدوران.`,
   String.raw`المطلوب: التحكم في عدد الدورات بالعداد تصاعدياً أو تنازلياً عن طريق الـ <span class="ltr">PLC</span> (ص 130)، والكتاب لا يقدم برنامجاً لذلك.`]}
],
 theory:[
  {h:'ثانياً: تعريف محرك الخطوة',ref:'ص 129',html:'<p>«محرك الخطوة تمت دراسته في مادة الآلات بشكل مفصل من ناحية الأنواع والتركيب والاستخدام. وبشكل مختصر للنوع المستخدم في هذا التطبيق هو <b>محرك ذو وجهين</b> يتحرك العضو الدائر <b>(7.5) درجة في كل نبضة توصيل</b>. لذلك نحتاج إلى العدادات في عملية التشغيل.» والشكل يوضح تركيبة المحرك.</p>'},
  {fig:'',ref:'ص 129',caption:'تركيبة المحرك (شكل بلا رقم في الكتاب): المحرك M1، وملف الوجه الأول طرفاه A و C، وملف الوجه الثاني طرفاه B و D',draw:()=>`<div class="svgbox" style="max-width:340px;margin-inline:auto">${constructionSVG()}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> إذا كانت كل نبضة تحرك العضو الدائر 7.5°، فالدورة الكاملة تحتاج <span class="ltr">360 ÷ 7.5 = 48</span> نبضة. هذا استنتاج حسابي، والكتاب لم يذكره.<span class="fixnote"> وفي صفحة المحتويات سُمّي هذا الجزء «فكرة عمل محرك الخطوة» وفي المتن «تعريف محرك الخطوة».</span>'},
  {h:'خطوات تحرك العضو الدائر',ref:'ص 130',html:'<p>«والشكل التالي يوضح خطوات تحرك العضو الدائر للمحرك مع كل نبضة والجهد الموصل على ملفات العضو الثابت.» في أعلاه نبضات CLOCK مرقمة من 1 إلى 8 ثم تعود 1، وتحتها مستوى الجهد على الأطراف A و B و C و D:</p>'},
  {fig:'',ref:'ص 130',caption:'نبضات CLOCK والجهد على الأطراف A و B و C و D (شكل بلا رقم في الكتاب)',draw:()=>`<div class="svgbox">${stepTimingSVG(0)}</div>`},
  {html:'<p>وتحت كل نبضة رسم الكتاب العضو الدائر (مغناطيس N–S) مع إشارة كل طرف (+ أو − أو 0)، والأطراف في هذا الرسم: A أعلى، و C يمين، و B أسفل، و D يسار. الجدول التالي يجمع الرسمين:</p>'+SEQ_TABLE(0)},
  {fig:'',ref:'ص 130',caption:'وضع العضو الدائر في الخطوات الثماني كما رسمه الكتاب (رسم المحاكاة: البرتقالي +، الأزرق −، الرمادي 0)',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px">${[1,2,3,4,5,6,7,8].map(k=>`<div class="svgbox" style="margin:0">${rotorMini(k)}</div>`).join('')}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن الجدول يتناوب بين خطوة فيها طرف واحد عليه جهد (2، 4، 6، 8) وخطوة فيها طرفان (1، 3، 5، 7). هذه الطريقة تسمى «نصف خطوة»، وفيها تتحرك المغناطيسية بانتظام. ولعكس الاتجاه نقرأ الجدول من الأسفل إلى الأعلى. في رسم الكتاب المبسط يدور المغناطيس 45° مع كل خطوة، أما المحرك الحقيقي المستخدم فيدور عموده 7.5° فقط لأن له أسناناً كثيرة.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'رموز الإشارات (+ و − و 0) تحت الرسوم لا تتفق دائماً مع مستويات A و B و C و D في المخطط الزمني: في الخطوة 1 مثلاً A = 0 لكنه مرسوم A−، وفي الخطوة 2 A = 0 مرسوم A0. كما أن رسم التركيبة (ص 129) يجعل A و C طرفي ملف واحد، بينما الرموز تعطي A و C إشارتين مستقلتين (A− مع C− في الخطوة 1). الكتاب لا يشرح العلاقة بين الإشارة المنطقية والقطبية، فنقلناهما كما هما.'+'</div>'},
  {h:'المطلوب',ref:'ص 130',html:'<p>«توصيل محرك الخطوة مصدر القدرة ويتم التحكم في عدد الدورات من خلال العداد تصاعدياً أو تنازلياً وذلك عن طريق (PLC).» (نطبقه في الدرس التالي.)</p>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في ص 126 يعد الكتاب بـ «ثالثاً: كتابة برنامج للتحكم بمحرك الخطوة باستخدام (PLC) باللغة (LAD)»، لكن هذا الجزء <b>غير موجود</b>: لا برنامج LAD ولا FBD ولا STL ولا جدول دخل وخرج للمحرك، والوحدة تنتهي بفقرة «المطلوب». لذلك في المختبر طريقتان: تسلسل الكتاب يدوياً، وبرنامج PLC كتبناه نحن ومعلَّم بوضوح أنه ليس من الكتاب.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'المطلوب',title:'المطلوب: التحكم في عدد الدورات بالعداد',ref:'ص 130',
   q:'تريد أن يدور المحرك عدداً محدداً من الدورات ثم يقف وحده… ماذا تكتب في العداد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الـ PLC وفيه عداد يرسل نبضات إلى محرك الخطوة الموصول بمصدر القدرة، وعدد النبضات يحدد عدد الدورات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="وحدة ⟦PLC⟧: فيها البرنامج والعداد الذي يقرر متى تتوقف النبضات."><rect x="90" y="28" width="180" height="84" rx="10" fill="#2C4A40"/><text x="180" y="54" text-anchor="middle" direction="ltr" font-size="17" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">PLC</text></g><g data-tip="العداد: يعدّ النبضات تصاعدياً (كم نُفّذ) أو تنازلياً (كم بقي)، ويوقف المحرك عند الوصول إلى القيمة المحددة."><rect x="112" y="66" width="136" height="34" rx="7" fill="#F2C14E"/><text x="180" y="88" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">عداد: تصاعدي أو تنازلي</text></g><line x1="180" y1="114" x2="180" y2="160" stroke="#2C4A40" stroke-width="3"/><polygon points="180,172 171,156 189,156" fill="#2C4A40"/><g data-tip="نبضات التوصيل: كل نبضة تحرّك العضو الدائر ⟦7.5⟧ درجة."><rect x="196" y="122" width="96" height="36" fill="transparent"/><path d="M200 152 H210 V130 H222 V152 H234 V130 H246 V152 H258 V130 H270 V152 H284" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round"/></g><text x="130" y="146" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="600">نبضات</text><g data-tip="محرك الخطوة ⟦M1⟧: يتحرك بقدر عدد النبضات التي تصله، ثم يقف."><circle cx="180" cy="222" r="44" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><line x1="180" y1="222" x2="180" y2="186" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><circle cx="180" cy="222" r="7" fill="#2C4A40"/><text x="180" y="252" text-anchor="middle" direction="ltr" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M1</text></g><g data-tip="السهم حول المحرك: عدد الدورات التي نريد التحكم فيها."><path d="M232 196 A58 58 0 0 1 232 248" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="228,256 225,242 238,247" fill="#2C4A40"/></g><g data-tip="مصدر القدرة: يغذي ملفات المحرك، والـ ⟦PLC⟧ يتحكم في وصول النبضات."><rect x="28" y="200" width="80" height="46" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="68" y="219" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="700">مصدر</text><text x="68" y="236" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="700">القدرة</text><line x1="108" y1="222" x2="136" y2="222" stroke="#2C4A40" stroke-width="3"/></g><text x="180" y="294" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">عدد النبضات يحدد عدد الدورات</text></svg>`,
   cap:'فكرة «المطلوب» في ص 130: العداد في الـ <span class="ltr">PLC</span> يحدد كم نبضة تصل إلى المحرك.<br><b>مرّر المؤشر على الأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>توصيل محرك الخطوة مصدر القدرة ويتم التحكم في عدد الدورات من خلال العداد تصاعدياً أو تنازلياً وذلك عن طريق (<span class="ltr">PLC</span>).</p>`,ref:'ص 130'}
   ],
   body:[
    {tip:String.raw`<p>المحرك لا يعرف «الدورات»، هو يعرف <b>النبضات</b> فقط: كل نبضة <span class="ltr">7.5°</span> (ص 129). فالدورة الكاملة <span class="ltr">360 ÷ 7.5 = 48</span> نبضة (استنتاج حسابي، ليس في الكتاب). لذلك:</p>
     <p style="text-align:center"><b>القيمة المحددة للعداد = عدد الدورات × 48</b></p>
     <p>ثم يعدّ العداد النبضات <b>تصاعدياً</b> من الصفر حتى هذه القيمة، أو <b>تنازلياً</b> منها حتى الصفر، وعندها يوقف الـ <span class="ltr">PLC</span> النبضات.</p>`,title:'من الدورات إلى النبضات'},
    {predict:{q:'تريد أن يدور المحرك نصف دورة فقط. كم نبضة يجب أن يعدّ العداد؟',opts:[
     ['4 نبضات',false,'4 نبضات = 4 × 7.5 = 30° فقط.'],
     ['180 نبضة',false,'180 هي الزاوية بالدرجات وليست عدد النبضات؛ اقسمها على 7.5.'],
     ['24 نبضة',true,'نصف دورة = 180°، و 180 ÷ 7.5 = 24 نبضة.']]}},
    {title:'اختر عدد الدورات وطريقة العد',widget:(el,B)=>{
      let r=1,dir='up',cv=0,tm=null;
      el.innerHTML=`<label class="w-sl"><span>عدد الدورات المطلوب: <b class="ltr" data-o="r"></b></span><input type="range" min="1" max="20" step="1" dir="ltr" value="${r}"></label>
       <div class="w-row"><span class="w-l">طريقة العد:</span><span class="mseg"><button type="button" data-dir="up" aria-pressed="true">تصاعدي</button><button type="button" data-dir="down" aria-pressed="false">تنازلي</button></span><button class="btn pri" type="button" data-go>ابدأ العد</button><button class="btn" type="button" data-rs>إعادة</button></div>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i></div><div class="spd-ax"><span>0</span><span data-o="ax"></span></div></div>
       <div class="w-facts"><div><span>القيمة المحددة (نبضات)</span><b data-o="pv"></b></div><div><span>قيمة العد الآن</span><b data-o="cv"></b></div><div><span>الزاوية المقطوعة</span><b data-o="ang"></b></div><div><span>الحالة</span><b data-o="st" style="font-family:var(--font);font-size:14px"></b></div></div>
       <p class="sub" style="margin-top:8px" data-o="x"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const pv=()=>r*48;
      const stop=()=>{if(tm){clearInterval(tm);tm=null}};
      const start0=()=>{cv=dir==='up'?0:pv()};
      const done=()=>dir==='up'?cv>=pv():cv<=0;
      const draw=()=>{const P=pv(),moved=dir==='up'?cv:P-cv;
        o('r').textContent=r;o('pv').textContent=P;o('cv').textContent=cv;o('ang').textContent=(moved*7.5).toLocaleString('en-US')+'°';o('ax').textContent=P;
        o('st').textContent=tm?'يدور':(moved>0&&done()?'وقف عند القيمة':'جاهز');
        el.querySelector('.spd-n').style.width=(P?cv/P*100:0)+'%';
        o('x').innerHTML=dir==='up'?`العد التصاعدي: من <span class="ltr">0</span> حتى <span class="ltr">${P}</span> (كم نبضة نُفّذت).`:`العد التنازلي: من <span class="ltr">${P}</span> حتى <span class="ltr">0</span> (كم نبضة بقيت).`;
        el.querySelectorAll('[data-dir]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dir===dir))};
      rg.oninput=()=>{stop();r=+rg.value;start0();draw()};
      el.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{stop();dir=b.dataset.dir;start0();draw()});
      el.querySelector('[data-go]').onclick=()=>{stop();start0();const P=pv(),stepN=Math.max(1,Math.round(P/40));
        tm=setInterval(()=>{if(!document.body.contains(el)){stop();return}cv=dir==='up'?Math.min(P,cv+stepN):Math.max(0,cv-stepN);if(done())stop();draw()},40);draw()};
      el.querySelector('[data-rs]').onclick=()=>{stop();start0();draw()};
      start0();draw();
    }},
    {tip:String.raw`<p>أقصى قيمة للعد <span class="ltr">999</span> (ص 127)، و<span class="ltr">20 × 48 = 960</span> بينما <span class="ltr">21 × 48 = 1008</span>؛ فعداد واحد يكفي لـ <span class="ltr">20</span> دورة كاملة على الأكثر. لذلك يتوقف شريط الدورات في الأداة عند <span class="ltr">20</span>.</p>`,title:'كم دورة يتسع لها العداد؟'},
    {watch:String.raw`<p>الكتاب لا يقدم بعد فقرة «المطلوب» برنامجاً ولا جدول دخل وخرج ولا أسئلة تقويم (والجزء «ثالثاً» المعلن في ص 126 غير موجود). الحل في المحطة التالية وفي المختبر <b>من إعداد المحاكاة وليس من الكتاب</b>.</p>`,fix:true}
   ]},

  {st:2,short:'فكرة الحل',title:'فكرة الحل (من إعداد المحاكاة، ليس من الكتاب)',
   q:'عداد واحد يكفي ليوقف المحرك… فلماذا نستخدم في الحل عدادين، واحداً تصاعدياً وآخر تنازلياً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المزمن T1 يرسل نبضات إلى عدادين: C3 تصاعدي يعد الخطوات المنفذة، و C2 تنازلي يعد الخطوات المتبقية، ومجموعهما يساوي PV" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المزمن ⟦T1⟧ في برنامج المحاكاة: يولّد نبضة منتظمة أثناء التشغيل (ليس من الكتاب)."><rect x="130" y="24" width="100" height="44" rx="8" fill="#2C4A40"/><text x="180" y="52" text-anchor="middle" direction="ltr" font-size="17" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">T1</text></g><g data-tip="كل نبضة من ⟦T1⟧ تصل إلى العدادين معاً، وتحرّك المحرك خطوة."><path d="M150 68 L95 104 M210 68 L265 104" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="88,109 96,96 103,107" fill="#2C4A40"/><polygon points="272,109 257,107 264,96" fill="#2C4A40"/></g><g data-tip="العداد التنازلي ⟦C2⟧: يُحمَّل بعدد الخطوات المطلوب ⟦PV⟧ عند التشغيل، ثم ينقص واحداً مع كل نبضة: الخطوات المتبقية. عندما يصل إلى الصفر يقف المحرك."><rect x="220" y="112" width="90" height="140" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="223" y="205" width="84" height="44" rx="4" fill="#4FB3A9"/><line x1="265" y1="130" x2="265" y2="180" stroke="#2C4A40" stroke-width="3"/><polygon points="265,192 257,178 273,178" fill="#2C4A40"/></g><g data-tip="العداد التصاعدي ⟦C3⟧: يُصفَّر عند التشغيل، ثم يزيد واحداً مع كل نبضة: الخطوات المنفّذة."><rect x="50" y="112" width="90" height="140" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="53" y="159" width="84" height="90" rx="4" fill="#E8735A"/><line x1="95" y1="236" x2="95" y2="186" stroke="#2C4A40" stroke-width="3"/><polygon points="95,174 87,188 103,188" fill="#2C4A40"/></g><text x="180" y="176" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="700">مجموعهما</text><text x="180" y="196" text-anchor="middle" direction="ltr" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">= PV</text><text x="265" y="274" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">المتبقي (C2)</text><text x="265" y="292" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40">عدّ تنازلي</text><text x="95" y="274" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">المنفّذ (C3)</text><text x="95" y="292" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40">عدّ تصاعدي</text></svg>`,
   cap:'العدادان في برنامج المحاكاة: كل نبضة تنقل خطوة من «المتبقي» إلى «المنفّذ».<br><b>مرّر المؤشر على المزمن والعدادين (أو المسها في الجوال) لتعرف عملها.</b>',
   side:[
    {watch:String.raw`<p>كل ما في هذه المحطة <b>حل مقترح من إعداد المحاكاة وليس من الكتاب</b>؛ الكتاب يذكر «المطلوب» فقط. الهدف أن ترى العدّ <b>تصاعدياً</b> و<b>تنازلياً</b> معاً كما يطلب الكتاب.</p>`},
    {predict:{q:'المطلوب 12 خطوة، والمحرك نفّذ منها 5 حتى الآن. كم في العداد التنازلي C2؟',opts:[
     ['7',true,'C2 بدأ من 12 ونقص 5، فبقي 7. ومجموع C2 و C3 دائماً = PV.'],
     ['5',false,'5 هي قيمة العداد التصاعدي C3 (الخطوات المنفّذة).'],
     ['12',false,'12 هي القيمة التي حُمّلت في C2 عند البداية، لكنه ينقص مع كل خطوة.']]}}
   ],
   body:[
    {tip:String.raw`<ol><li>يكتب المتدرب عدد الخطوات المطلوب في كلمة الذاكرة <span class="ltr">MW10</span> (القيمة <span class="ltr">PV</span>). دورة كاملة = <span class="ltr">48</span> خطوة (استنتاج من <span class="ltr">7.5°</span>).</li>
     <li>عند الضغط على <span class="ltr">S1</span> يُحمَّل العداد <b>التنازلي <span class="ltr">C2</span></b> بهذه القيمة (طرف <span class="ltr">S</span>)، ويُصفَّر العداد <b>التصاعدي <span class="ltr">C3</span></b> (طرف <span class="ltr">R</span>).</li>
     <li>مع كل نبضة من المزمن <span class="ltr">T1</span>: يتقدم المحرك خطوة (العداد <span class="ltr">C1</span> يحفظ رقم الخطوة <span class="ltr">1</span>…<span class="ltr">8</span>، ويعدّ تصاعدياً للأمام أو تنازلياً للخلف حسب المفتاح <span class="ltr">S2</span>)، وينقص <span class="ltr">C2</span> واحداً، ويزيد <span class="ltr">C3</span> واحداً.</li>
     <li>عندما يصل <span class="ltr">C2</span> إلى الصفر يُلغى التشغيل <span class="ltr">M0.0</span> فيقف المحرك. والضاغط <span class="ltr">S0</span> يوقفه في أي لحظة.</li></ol>`,title:'خطوات الحل'},
    {predict:{q:'ضغطت S0 قبل أن ينتهي العد. ماذا يبقى في العداد C2؟',opts:[
     ['صفر، لأن الإيقاف يصفّر العدادات',false,'S0 يلغي التشغيل فقط، ولا يصل إلى طرف R للعداد C2.'],
     ['القيمة PV كاملة',false,'C2 نقص مع كل خطوة نُفّذت قبل الإيقاف.'],
     ['عدد الخطوات التي لم تُنفَّذ',true,'C2 يعدّ تنازلياً المتبقي، فيحفظ ما بقي لحظة الإيقاف.']]}},
    {tip:String.raw`<p>العداد يعدّ مرة واحدة عند تغيّر مدخله من <span class="ltr">0</span> إلى <span class="ltr">1</span> (المحطة الرابعة في الدرس الأول)، لذلك صُمم المزمن <span class="ltr">T1</span> ليعطي نبضة قصيرة متكررة: يعدّ حتى ينتهي زمنه، فيصبح <span class="ltr">1</span>، فيقطع نفسه بالتلامس <span class="ltr mono">AN T 1</span> ويبدأ من جديد.</p>`,title:'لماذا نبضة قصيرة؟'},
    {tip:String.raw`<p>جرّب الحل في تبويب «المختبر»: اكتب عدد الخطوات، واضغط <span class="ltr">S1</span>، وراقب <span class="ltr">C2</span> ينقص و<span class="ltr">C3</span> يزيد حتى يقف المحرك وحده. والبرنامج كاملاً بلغات <span class="ltr">LAD</span> و<span class="ltr">FBD</span> و<span class="ltr">STL</span> في تبويب «برنامج الـ <span class="ltr">PLC</span>».</p>`}
   ]},

  {recap:[
   String.raw`المطلوب (ص 130): توصيل محرك الخطوة بمصدر القدرة، والتحكم في عدد الدورات بالعداد تصاعدياً أو تنازلياً عن طريق الـ <span class="ltr">PLC</span>.`,
   String.raw`المحرك يعرف النبضات لا الدورات: كل نبضة <span class="ltr">7.5°</span>، فالدورة <span class="ltr">48</span> نبضة (استنتاج)، والقيمة المحددة للعداد = عدد الدورات × <span class="ltr">48</span>.`,
   String.raw`أقصى قيمة للعد <span class="ltr">999</span>، فعداد واحد يتسع لـ <span class="ltr">20</span> دورة كاملة على الأكثر.`,
   String.raw`في حل المحاكاة (ليس من الكتاب): <span class="ltr">C2</span> تنازلي للمتبقي، و<span class="ltr">C3</span> تصاعدي للمنفّذ، ويقف المحرك عندما يصل <span class="ltr">C2</span> إلى الصفر.`]}
],
 theory:[
  {h:'المطلوب',ref:'ص 130',html:'<p>«توصيل محرك الخطوة مصدر القدرة ويتم التحكم في <b>عدد الدورات</b> من خلال <b>العداد تصاعدياً أو تنازلياً</b> وذلك عن طريق (PLC).»</p>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الكتاب لا يقدم بعد هذه الفقرة برنامجاً ولا جدول دخل وخرج ولا أسئلة تقويم (والجزء «ثالثاً» المعلن في ص 126 غير موجود). البرنامج في هذا الدرس <b>من إعداد المحاكاة وليس من الكتاب</b>، وهو حل مقترح للمطلوب.'+'</div>'},
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
