/* Unit 9 — التطبيق على المصعد الكهربائي باستخدام مفاتيح نهاية المشوار (ص 143–158) */
(function(B){
const {S,clamp,W}=B;

/* ================= elevator geometry & switches ================= */
const FL=110, Y1=380, CARH=76;                // floor spacing (px), level of floor 1, car height
const POSMIN=-0.27, POSMAX=2.36, V=0.3;        // pos in floors (0 = floor 1, 2 = floor 3), speed floors/s
const FLN=['الأول','الثاني','الثالث'];
const atF1=p=>p.pos<=0.005, atF3=p=>p.pos>=1.995;
const f2pos=p=>Math.abs(p.pos-1)<0.03?'off':(p.pos<1?'b':'a');
const f2st=st=>st.btn('F2X')?'off':f2pos(st.plant);
function floorTxt(pos){const n=Math.round(pos);if(n>=0&&n<=2&&Math.abs(pos-n)<0.04)return 'عند الدور '+FLN[n];
  if(pos<0)return 'تحت الدور الأول (البئر)';if(pos>2)return 'فوق الدور الثالث';const lo=Math.floor(pos);return 'بين الدور '+FLN[lo]+' و'+FLN[lo+1]}

/* ---------- shaft drawing ---------- d={pos,K:[3],up,down,doors:[3],F1a,F3a,F2,crash} */
function shaftSVG(d){
  const on=d.up||d.down;let o=`<svg viewBox="0 0 300 430" role="img" aria-label="بئر المصعد بثلاثة أدوار">`;
  o+=`<rect x="96" y="2" width="108" height="34" rx="4" fill="var(--surface-2)" stroke="var(--line)"/>`+S.motor(150,19,13,on,'M','');
  if(d.up)o+=S.t(172,24,'U ↑','b','start');else if(d.down)o+=S.t(172,24,'D ↓','b','start');
  o+=`<path d="M100 36V412M200 36V412M100 412H200" stroke="var(--fg)" stroke-width="2" fill="none"/>`;
  o+=`<path class="sym" d="M132 412v-9h36v9M132 40v8h36v-8"/>`;
  for(let i=0;i<3;i++){const L=Y1-i*FL;
    o+=`<rect x="14" y="${L}" width="86" height="6" fill="var(--line)"/><text class="txt ar" x="56" y="${L-58}" text-anchor="middle" font-size="12">الدور ${FLN[i]}</text>`;
    const op=d.doors&&d.doors[i];
    o+=op?`<rect x="95" y="${L-CARH}" width="6" height="${CARH}" fill="none" stroke="var(--stop)" stroke-width="2" stroke-dasharray="4 3"/><text class="txt ar" x="56" y="${L-40}" text-anchor="middle" font-size="11" fill="var(--stop)" style="fill:var(--stop)">S${7+i} مفتوح</text>`
          :`<rect x="95" y="${L-CARH}" width="6" height="${CARH}" fill="var(--fg)"/>`;
    o+=W.lamp(36,L-22,6,d.K&&d.K[i],'#f2c230')+S.t(50,L-18,'K'+(i+1),'m','start');
    const id=['F1','F2','F3'][i];const act=i===0?d.F1a:i===2?d.F3a:d.F2!=='off';
    const lever=act?`M204 ${L-7}L196 ${L-1}`:`M204 ${L-7}L193 ${L-12}`;
    o+=`<rect x="204" y="${L-14}" width="22" height="14" rx="2" fill="${act?'var(--live-soft)':'var(--surface)'}" stroke="${act?'var(--live)':'var(--fg)'}" stroke-width="1.6"/><path d="${lever}" stroke="var(--fg)" stroke-width="2"/>`;
    o+=S.t(232,L-3,id,'','start');
    if(i===1)o+=S.t(232,L+11,'('+d.F2+')','b','start');else o+=S.t(232,L+11,act?'(open)':'(NC)','m','start');
  }
  const top=Y1-CARH-d.pos*FL;
  o+=`<line id="elrope" x1="150" y1="36" x2="150" y2="${top.toFixed(1)}" stroke="var(--muted)" stroke-width="2"/>`;
  o+=`<g id="elcar" transform="translate(0 ${(-d.pos*FL).toFixed(1)})"><rect x="110" y="${Y1-CARH}" width="80" height="${CARH}" rx="3" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M150 ${Y1-CARH+6}V${Y1-4}" stroke="var(--line)" stroke-width="2"/><rect x="189" y="${Y1-14}" width="7" height="12" fill="var(--blue)"/>`+S.t(150,Y1-CARH/2+4,'CAR','m')+`</g>`;
  if(d.crash)o+=`<rect x="60" y="${d.crash==='pit'?392:42}" width="180" height="22" rx="4" fill="var(--stop)"/><text class="txt ar" x="150" y="${d.crash==='pit'?407:57}" text-anchor="middle" style="fill:#fff" font-size="12">تجاوز! اصطدام بالمخمد</text>`;
  return o+'</svg>';
}

/* ---------- PLC wiring figure (ص 146) ---------- v={act(id), F2, Q(addr)} */
const WIN=[['SO1','I0.1','no'],['SO2','I0.2','no'],['SO3','I0.3','no'],['SI1','I1.1','no'],['SI2','I1.2','no'],['SI3','I1.3','no'],
  ['F1','I0.4','lim'],['F3','I0.6','lim'],['F2b','I0.5','f2'],['F2a','I0.7','f2'],['S7','I1.4','lim'],['S8','I1.5','lim'],['S9','I1.6','lim'],['SS','I0.0','ncb']];
function wiringSVG(v,live){
  const Wd=840;const c=x=>live&&x?'live':'';let o=`<svg viewBox="0 0 ${Wd} 316" role="img" aria-label="توصيل المداخل والمخارج بوحدة PLC">`;
  o+=S.w(`M20 24H${Wd-10}`,live?'live':'')+S.t(22,16,'24V','','start');
  const bits={};
  WIN.forEach((r,i)=>{const x=50+i*56;const [id,ad,ty]=r;
    if(ty==='f2'){if(id==='F2b'){const f=v.F2;o+=S.w('M526 24V54',c(1))+S.dot(526,24)+S.dot(526,56);
        const bx=f==='b'?500:f==='a'?552:526,by=f==='off'?82:86;o+=`<path class="sym ${live&&f!=='off'?'hot':''}" d="M526 56L${bx} ${by}"/>`;
        o+=`<circle cx="498" cy="88" r="3" fill="var(--surface)" stroke="var(--fg)"/><circle cx="554" cy="88" r="3" fill="var(--surface)" stroke="var(--fg)"/>`+S.t(488,84,'b','','end')+S.t(564,84,'a','','start')+S.t(526,108,'F2');}
      const cl=v.F2===(id==='F2b'?'b':'a');bits[ad]=cl?1:0;o+=S.w(`M${x} 91V150`,c(cl));return}
    const act=v.act(id)?1:0;const closed=ty==='no'?act:1-act;bits[ad]=closed;
    o+=S.w(`M${x} 24V50`,c(1))+S.dot(x,24)+S.vC(x,50,96,{nc:ty!=='no',closed:!!closed,inC:c(1),outC:c(closed),label:'',side:'right',btn:(ty==='no'||ty==='ncb')?1:0})+S.w(`M${x} 96V150`,c(closed))+S.t(x+5,124,id,'','start');
  });
  o+=`<rect x="24" y="150" width="${Wd-48}" height="80" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  WIN.forEach((r,i)=>{const x=50+i*56;const b=bits[r[1]];o+=S.t(x,166,r[1],'m')+`<circle cx="${x}" cy="180" r="5" fill="${b?'var(--on)':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1"/>`});
  o+=`<text class="txt" x="40" y="214" text-anchor="start" font-size="16">PLC</text>`;
  [['Q4.1',220],['Q4.2',280],['Q4.3',340]].forEach(([a,x])=>{const q=v.Q(a);o+=`<circle cx="${x}" cy="200" r="5" fill="${q?'var(--on)':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1"/>`+S.t(x,220,a,'m')+S.w(`M${x} 230V240`,'')+`<circle cx="${x}" cy="243" r="3" fill="var(--surface)" stroke="var(--fg)"/>`});
  [['Q5.4',500,'K4'],['Q5.5',620,'K5']].forEach(([a,x,k])=>{const q=v.Q(a);o+=`<circle cx="${x}" cy="200" r="5" fill="${q?'var(--on)':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1"/>`+S.t(x,220,a,'m')+S.w(`M${x} 230V252`,c(q))+S.coil(x,252,k,q)+S.w(`M${x} 274V300`,'')+S.dot(x,300)});
  o+=S.t(200,262,'(Q4.1–Q4.3: no load)','m','start');
  o+=S.w(`M20 300H${Wd-10}`,'')+S.t(22,294,'0V','','start');
  return o+'</svg>';
}

/* ---------- hard-wired control circuit (ص 144) ---------- */
function hwSVG(s,live){
  const Wd=1030,NY=470,CY=405;const c=v=>live&&v?'live':'';let o='';
  const ct=(x,y,closed,inL,lab,op)=>{op=op||{};const out=inL&&closed;o+=S.vC(x,y,y+40,{nc:op.nc,closed:!!closed,inC:c(inL),outC:c(out),label:lab,side:op.side||'right',btn:op.btn,timer:op.timer});return out?1:0};
  const w=(d,v)=>{o+=S.w(d,c(v))};
  const coil=(x,l,on,kind)=>{o+=S.w(`M${x} ${CY+22}V${NY}`,'')+S.coil(x,CY,l,live&&on,kind)+S.dot(x,NY)};
  o+=S.w(`M20 20H${Wd-10}`,live?'live':'')+S.t(14,24,'L1','','end');
  // 1: S7 S8 S9 -> K0
  w('M40 20V30',1);let a=ct(40,30,!s.S7o,1,'S7',{nc:1});a=ct(40,70,!s.S8o,a,'S8',{nc:1});a=ct(40,110,!s.S9o,a,'S9',{nc:1});w(`M40 150V${CY}`,a);coil(40,'K0',a);
  // 2: SS -> K0 -> node X
  w('M95 20V30',1);o+=S.dot(95,20);const ss=ct(95,30,!s.SS,1,'SS',{nc:1,btn:1});const X=ct(95,70,s.K0,ss,'K0');w('M95 110V150',X);w('M95 150H980',X);
  // 3: (K4 | K5) -> T1 (off-delay)
  w('M140 150V160',X);w('M180 150V160',X);o+=S.dot(140,150)+S.dot(180,150);
  const k4=ct(140,160,s.K4,X,'K4',{side:'left'}),k5=ct(180,160,s.K5,X,'K5');
  w('M140 200V210',k4);w('M180 200V210',k5);w('M140 210H180',k4||k5);o+=S.dot(140,210);w(`M140 210V${CY}`,k4||k5);coil(140,'T1',k4||k5,'tof');
  // T1 NO -> bus 225 (holding contacts) ; T1 NC -> bus 205 (outside calls)
  w('M230 150V160',X);w('M270 150V160',X);o+=S.dot(230,150)+S.dot(270,150);
  const tno=ct(230,160,s.T1,X,'T1',{timer:'off'});const tnc=ct(270,160,!s.T1,X,'T1',{nc:1,timer:'off'});
  w('M230 200V225H738',tno);w('M270 200V205H680',tnc);
  const G=[320,500,680];
  G.forEach((b,i)=>{const n=i+1;
    if(i<2)o+=S.dot(b,205)+S.dot(b+58,225);o+=S.dot(b+116,150);
    w(`M${b} 205V250`,tnc);w(`M${b+58} 225V250`,tno);w(`M${b+116} 150V250`,X);
    const p1=ct(b,250,s.SO[i],tnc,'SO'+n,{btn:1}),p2=ct(b+58,250,s['K'+n],tno,'K'+n),p3=ct(b+116,250,s.SI[i],X,'SI'+n,{btn:1});
    const any=p1||p2||p3;w(`M${b} 290V310`,p1);w(`M${b+58} 290V310`,p2);w(`M${b+116} 290V310`,p3);w(`M${b} 310H${b+116}`,any);o+=S.dot(b+58,310);
    w(`M${b+58} 310V${CY}`,any);coil(b+58,'K'+n,any);
  });
  // 7: (K3·F3 | K2·F2b) · K5nc -> K4 (up)
  w('M860 150V160',X);o+=S.dot(860,150);const k3=ct(860,160,s.K3,X,'K3',{side:'left'});const f3=ct(860,200,!s.F3a,k3,'F3',{nc:1,side:'left'});w('M860 240V300',f3);
  w('M912 150V160',X);o+=S.dot(912,150);const k2=ct(912,160,s.K2,X,'K2');w('M912 200V212',k2);o+=S.dot(912,212);
  const bx=s.F2==='b'?892:s.F2==='a'?932:912,by=s.F2==='off'?236:240;
  o+=`<path class="sym ${live&&k2&&s.F2!=='off'?'hot':''}" d="M912 212L${bx} ${by}"/><circle cx="890" cy="242" r="3" fill="var(--surface)" stroke="var(--fg)"/><circle cx="934" cy="242" r="3" fill="var(--surface)" stroke="var(--fg)"/>`+S.t(882,246,'b','','end')+S.t(942,246,'a','','start')+S.t(946,222,'F2','','start');
  const bO=k2&&s.F2==='b'?1:0,aO=k2&&s.F2==='a'?1:0;
  w('M890 245V300',bO);const m7=f3||bO;w('M860 300H890',m7);o+=S.dot(860,300);w('M860 300V310',m7);const k5n=ct(860,310,!s.K5,m7,'K5',{nc:1,side:'left'});w(`M860 350V${CY}`,k5n);coil(860,'K4',k5n);o+=S.t(882,CY+15,'U ↑','b','start');
  // 8: (K1·F1 | K2·F2a) · K4nc -> K5 (down)
  w('M980 150V160',X);const k1=ct(980,160,s.K1,X,'K1');const f1=ct(980,200,!s.F1a,k1,'F1',{nc:1});w('M980 240V300',f1);
  w('M934 245V300',aO);const m8=f1||aO;w('M934 300H980',m8);o+=S.dot(980,300);w('M980 300V310',m8);const k4n=ct(980,310,!s.K4,m8,'K4',{nc:1});w(`M980 350V${CY}`,k4n);coil(980,'K5',k4n);o+=S.t(1002,CY+15,'D ↓','b','start');
  o+=S.w(`M20 ${NY}H${Wd-10}`,'')+S.t(14,NY+4,'N','','end')+S.t(104,145,'X','m','start');
  return `<svg viewBox="0 0 ${Wd} ${NY+14}" role="img" aria-label="دائرة التحكم التقليدية للمصعد">${o}</svg>`;
}
const HW_IDLE={S7o:0,S8o:0,S9o:0,SS:0,SO:[0,0,0],SI:[0,0,0],K0:0,K1:0,K2:0,K3:0,K4:0,K5:0,T1:0,F1a:0,F3a:0,F2:'off'};

/* ================= program (STL verbatim, ص 156–157) ================= */
function makeProg(fixed,tv){tv=tv||'5S';
  const f3=fixed?'A     I     0.6':'AN    I     0.6',f1=fixed?'A     I     0.4':'AN    I     0.4';
  const call=(n,so,si,q,lbl,ref)=>({title:`Network ${n} : ${lbl} FLOOR CALLING`,ref,
    read:`K${n-3} (${q}) يعمل إذا: M0.1 = 1 <b>و</b> [ (T1 = 0 <b>و</b> ${so==='I     0.1'?'SO1':so==='I     0.2'?'SO2':'SO3'} مضغوط) <b>أو</b> (T1 = 1 <b>و</b> K${n-3} يعمل أصلاً = إمساك) <b>أو</b> ${si==='I     1.1'?'SI1':si==='I     1.2'?'SI2':'SI3'} مضغوط ].`,
    stl:['A     M     0.1','A(','AN    T     1','A     '+so,'O','A     T     1','A     '+q,'O     '+si,')','=     '+q]});
  return [
   {title:'Network 1 : SAFE',ref:'ص 149، 152، 156',read:'K0 (M0.0) يعمل إذا كانت مفاتيح الأمان S7 <b>و</b> S8 <b>و</b> S9 مغلقة كلها (كل منها يعطي 1 لأنه موصّل NC).',
    stl:['A     I     1.4','A     I     1.5','A     I     1.6','=     M     0.0']},
   {title:'Network 2 : Stop elevator',ref:'ص 149، 152، 156',read:'M0.1 = 1 إذا كان SS غير مضغوط (يعطي 1) <b>و</b> K0 يعمل. M0.1 هو «خط التغذية» لبقية الشبكات (مثل النقطة بعد K0 في الدائرة التقليدية).',
    stl:['A     I     0.0','A     M     0.0','=     M     0.1']},
   {title:'Network 3 : Delay time for calling',ref:'ص 149، 152، 156',read:`المزمن T1 تأخير فصل (SF = S_OFFDT): خرجه 1 ما دام K4 <b>أو</b> K5 يعمل، ويبقى 1 مدة ${tv==='5S'?'5 ث':'0 ث'} بعد توقفهما. ويُصفَّر فوراً إذا صار M0.1 = 0.`,
    stl:['A(','O     Q     5.4','O     Q     5.5',')','L     S5T#'+tv,'SF    T     1','AN    M     0.1','R     T     1','NOP   0','NOP   0','NOP   0']},
   call(4,'I     0.1','I     1.1','Q     4.1','FIRST','ص 150، 153، 156'),
   call(5,'I     0.2','I     1.2','Q     4.2','SECOND','ص 150، 153، 156'),
   call(6,'I     0.3','I     1.3','Q     4.3','THIRD','ص 151، 154، 157'),
   {title:'Network 7 : ELEVATOR UP',ref:'ص 151، 154، 157',read:fixed?'K4 (صعود) يعمل إذا: M0.1 <b>و</b> [ (K3 <b>و</b> F3 مغلق: A I 0.6 = الكابينة لم تصل الدور الثالث) <b>أو</b> (K2 <b>و</b> F2 على b) ] <b>و</b> K5 مفصول (تعشيق). <b>(مصحح)</b>'
      :'K4 (صعود) يعمل إذا: M0.1 <b>و</b> [ (K3 <b>و</b> AN I 0.6 أي F3 يعطي 0) <b>أو</b> (K2 <b>و</b> F2 على b) ] <b>و</b> K5 مفصول. <b>تنبيه:</b> F3 موصّل NC فلا يعطي 0 إلا والكابينة عند الدور الثالث!',
    stl:['A     M     0.1','A(','A     Q     4.3',f3,'O','A     Q     4.2','A     I     0.5',')','AN    Q     5.5','=     Q     5.4']},
   {title:'Network 8 : ELEVATOR DOWN',ref:'ص 151، 155، 157',read:fixed?'K5 (نزول) يعمل إذا: M0.1 <b>و</b> [ (K1 <b>و</b> F1 مغلق: A I 0.4 = الكابينة لم تصل الدور الأول) <b>أو</b> (K2 <b>و</b> F2 على a) ] <b>و</b> K4 مفصول (تعشيق). <b>(مصحح)</b>'
      :'K5 (نزول) يعمل إذا: M0.1 <b>و</b> [ (K1 <b>و</b> AN I 0.4 أي F1 يعطي 0) <b>أو</b> (K2 <b>و</b> F2 على a) ] <b>و</b> K4 مفصول. <b>تنبيه:</b> F1 موصّل NC فلا يعطي 0 إلا والكابينة عند الدور الأول!',
    stl:['A     M     0.1','A(','A     Q     4.1',f1,'O','A     Q     4.2','A     I     0.7',')','AN    Q     5.4','=     Q     5.5']}
  ];
}
const PROG_BOOK=makeProg(false),PROG_FIX=makeProg(true);

/* ================= I/O ================= */
const IO9=[
 {sym:'K0',desc:'المتمم المساعد',addr:'M0.0'},
 {sym:'K1',desc:'المتمم الخاص بطلب الدور الأول',addr:'Q4.1'},
 {sym:'K2',desc:'المتمم الخاص بطلب الدور الثاني',addr:'Q4.2'},
 {sym:'K3',desc:'المتمم الخاص بطلب الدور الثالث',addr:'Q4.3'},
 {sym:'K4',desc:'المتمم الخاص لتشغيل المحرك في اتجاه الصعود',addr:'Q5.4'},
 {sym:'K5',desc:'المتمم الخاص لتشغيل المحرك في اتجاه النزول',addr:'Q5.5'},
 {sym:'F1',desc:'مفتاح نهاية المشوار لتحديد الوقوف عند الدور الأول',addr:'I0.4'},
 {sym:'F2b',desc:'مفتاح نهاية المشوار للدور الثاني F2 — النقطة b (تحت الدور الثاني)',addr:'I0.5'},
 {sym:'F2a',desc:'مفتاح نهاية المشوار للدور الثاني F2 — النقطة a (فوق الدور الثاني)',addr:'I0.7'},
 {sym:'F3',desc:'مفتاح نهاية المشوار لتحديد الوقوف عند الدور الثالث',addr:'I0.6'},
 {sym:'SO1',desc:'مفتاح الاستدعاء من خارج الكبينة (الدور الأول)',addr:'I0.1'},
 {sym:'SO2',desc:'مفتاح الاستدعاء من خارج الكبينة (الدور الثاني)',addr:'I0.2'},
 {sym:'SO3',desc:'مفتاح الاستدعاء من خارج الكبينة (الدور الثالث)',addr:'I0.3'},
 {sym:'SI1',desc:'مفتاح الاستدعاء من داخل الكبينة (الدور الأول)',addr:'I1.1'},
 {sym:'SI2',desc:'مفتاح الاستدعاء من داخل الكبينة (الدور الثاني)',addr:'I1.2'},
 {sym:'SI3',desc:'مفتاح الاستدعاء من داخل الكبينة (الدور الثالث)',addr:'I1.3'},
 {sym:'SS',desc:'مفاتيح أمان غلق الأبواب أو أي مفتاح أمان آخر',addr:'I0.0'},
 {sym:'S7',desc:'مفتاح الأمان للدور الأول',addr:'I1.4'},
 {sym:'S8',desc:'مفتاح الأمان للدور الثاني',addr:'I1.5'},
 {sym:'S9',desc:'مفتاح الأمان للدور الثالث',addr:'I1.6'},
 {sym:'M0.1',desc:'علامة SS و K0 (مستخدمة في البرنامج، غير مذكورة في جدول الكتاب)',addr:'M0.1'}
];
const NAMES9={};IO9.forEach(r=>{NAMES9[r.addr]=r.sym});
const BOOK_TABLE=`<div class="tablebox"><table class="io"><thead><tr><th>نقاط الدخل والخرج</th><th>الوصف</th><th>الترميز في ( PLC )</th></tr></thead><tbody>
 <tr><td class="mono">K0</td><td>المتمم المساعد</td><td class="mono">M0.0</td></tr>
 <tr><td class="mono">K1</td><td>المتمم الخاص بطلب الدور الأول</td><td class="mono">Q4.1</td></tr>
 <tr><td class="mono">K2</td><td>المتمم الخاص بطلب الدور الثاني</td><td class="mono">Q4.2</td></tr>
 <tr><td class="mono">K3</td><td>المتمم الخاص بطلب الدور الثالث</td><td class="mono">Q4.3</td></tr>
 <tr><td class="mono">K4</td><td>المتمم الخاص لتشغيل المحرك في اتجاه الصعود</td><td class="mono">Q5.4</td></tr>
 <tr><td class="mono">K5</td><td>المتمم الخاص لتشغيل المحرك في اتجاه النزول</td><td class="mono">Q5.5</td></tr>
 <tr><td class="mono">F1</td><td>مفتاح نهاية المشوار لتحديد الوقوف عند الدور الأول</td><td class="mono">I0.4</td></tr>
 <tr><td class="mono">F2(off ,a or b)</td><td>مفتاح نهاية المشوار لتحديد الوقوف عند الدور الثاني</td><td class="mono">I0.5, I0.7</td></tr>
 <tr><td class="mono">F3</td><td>مفتاح نهاية المشوار لتحديد الوقوف عند الدور الثالث</td><td class="mono">I0.6</td></tr>
 <tr><td class="mono">SO1, SO2, SO3</td><td>مفاتيح الاستدعاء من خارج الكبينة</td><td class="mono">I0.1, I0.2, I0.3</td></tr>
 <tr><td class="mono">SI1, SI2, SI3</td><td>مفاتيح الاستدعاء من داخل الكبينة</td><td class="mono">I1.1, I1.2, I1.3</td></tr>
 <tr><td class="mono">SS</td><td>مفاتيح أمان غلق الأبواب أو أي مفتاح أمان آخر</td><td class="mono">I0.0</td></tr>
 <tr><td class="mono">S7, S8, S9</td><td>مفاتيح الأمان لكل دور</td><td class="mono">I1.4, I1.5, I1.6</td></tr></tbody></table></div>`;

const IN_CALLS=[
 {id:'SO1',addr:'I0.1',type:'push',color:'blue',label:'خارج د1'},
 {id:'SO2',addr:'I0.2',type:'push',color:'blue',label:'خارج د2'},
 {id:'SO3',addr:'I0.3',type:'push',color:'blue',label:'خارج د3'},
 {id:'SI1',addr:'I1.1',type:'push',color:'black',label:'داخل د1'},
 {id:'SI2',addr:'I1.2',type:'push',color:'black',label:'داخل د2'},
 {id:'SI3',addr:'I1.3',type:'push',color:'black',label:'داخل د3'},
 {id:'SS',addr:'I0.0',type:'push',color:'red',label:'STOP (NC)',invert:true},
 {id:'S7',addr:'I1.4',type:'toggle',label:'فتح باب د1',invert:true},
 {id:'S8',addr:'I1.5',type:'toggle',label:'فتح باب د2',invert:true},
 {id:'S9',addr:'I1.6',type:'toggle',label:'فتح باب د3',invert:true}
];
const IN_SENS=[
 {id:'F1',addr:'I0.4',type:'sensor',invert:true,from:st=>atF1(st.plant)},
 {id:'F3',addr:'I0.6',type:'sensor',invert:true,from:st=>atF3(st.plant)},
 {id:'F2b',addr:'I0.5',type:'sensor',from:st=>f2st(st)==='b'},
 {id:'F2a',addr:'I0.7',type:'sensor',from:st=>f2st(st)==='a'}
];
const IN_PLC=IN_CALLS.concat(IN_SENS);

/* ================= elevator plant ================= */
const HWOUT=['M0.0','M0.1','Q4.1','Q4.2','Q4.3','Q5.4','Q5.5'];
function hwIn(P,st,p){P.set('I0.0',st.btn('SS')?0:1);P.set('I1.4',st.btn('S7')?0:1);P.set('I1.5',st.btn('S8')?0:1);P.set('I1.6',st.btn('S9')?0:1);
  [1,2,3].forEach(n=>{P.set('I0.'+n,st.btn('SO'+n));P.set('I1.'+n,st.btn('SI'+n))});
  P.set('I0.4',atF1(p)?0:1);P.set('I0.6',atF3(p)?0:1);const f=f2pos(p);P.set('I0.5',f==='b'?1:0);P.set('I0.7',f==='a'?1:0)}
function hwState(st,p){const P=p.P;return {S7o:st.btn('S7'),S8o:st.btn('S8'),S9o:st.btn('S9'),SS:st.btn('SS'),SO:[1,2,3].map(n=>st.btn('SO'+n)),SI:[1,2,3].map(n=>st.btn('SI'+n)),
  K0:P.get('M0.0'),K1:P.get('Q4.1'),K2:P.get('Q4.2'),K3:P.get('Q4.3'),K4:P.get('Q5.4'),K5:P.get('Q5.5'),T1:p.t1q,F1a:atF1(p),F3a:atF3(p),F2:f2pos(p)}}
function shaftData(st,p,get){return {pos:p.pos,K:['Q4.1','Q4.2','Q4.3'].map(get),up:get('Q5.4'),down:get('Q5.5'),doors:['S7','S8','S9'].map(k=>st.btn(k)),F1a:atF1(p),F3a:atF3(p),F2:f2st(st),crash:p.crash}}
function placeHTML(){return `<p class="sub" style="margin-top:6px"><b>أداة محاكاة (ليست من الكتاب):</b> ضع الكابينة عند دور والمحرك متوقف.</p><div class="seg" role="group">${[0,1,2].map(n=>`<button data-place="${n}">د${n+1}</button>`).join('')}</div>`}
function elevPlant(hw){
  return {
    title:hw?'المصعد مع دائرة التحكم التقليدية (ص 144)':'المصعد وتوصيل الـ PLC (ص 146)',
    init:()=>{const p={pos:1,dir:0,crash:'',lastStop:2,place:0,t1q:0,t1rem:0,tm:'5S'};if(hw)p.P=B.createPLC(makeProg(true,'5S'));return p},
    step(dt,st,p){let K4,K5,T;
      if(hw){const P=p.P;hwIn(P,st,p);P.scan(dt);HWOUT.forEach(a=>st.plc.set(a,P.get(a)));K4=P.get('Q5.4');K5=P.get('Q5.5');T=P.tim.T1||{q:0,run:0,el:0,tv:0}}
      else{K4=st.Q('Q5.4');K5=st.Q('Q5.5');T=st.T('T1')}
      p.t1q=T.q?1:0;p.t1rem=T.run?Math.max(0,T.tv-T.el):0;
      const d=K4&&!K5?1:K5&&!K4?-1:0;
      if(d){p.pos+=d*V*dt;if(p.pos<POSMIN){p.pos=POSMIN;p.crash='pit'}if(p.pos>POSMAX){p.pos=POSMAX;p.crash='top'}}
      if(p.dir&&!d){const n=Math.round(p.pos);p.lastStop=(Math.abs(p.pos-n)<0.06&&n>=0&&n<=2)?n+1:0}
      p.dir=d;},
    render(el,st,p){
      const get=hw?(a=>p.P.get(a)):(a=>st.get(a));
      const right=hw?`<div class="variant" style="margin-top:0"><span>زمن T1:</span><div class="seg" role="group"><button data-tm="5S" aria-pressed="${p.tm==='5S'}">5 ث (كما في البرنامج ص 149)</button><button data-tm="0S" aria-pressed="${p.tm==='0S'}">لحظي (كما في الملاحظة 2 ص 148)</button></div></div>
          <div class="svgbox ctrlbox">${hwSVG(hwState(st,p),true)}</div><p class="sub">النقطة X (بعد K0) تسمية منّا للتوضيح. البرتقالي = وصل الجهد. T1 مزمن تأخير فصل: تلامساه يتغيران فوراً مع تشغيل K4 أو K5، ويعودان بعد الزمن المختار من توقفهما.</p>`
        :`<h3 class="sm">توصيل المداخل والمخارج بوحدة PLC (ص 146) — حي</h3><div class="svgbox">${wiringSVG({act:id=>id==='F1'?atF1(p):id==='F3'?atF3(p):st.btn(id),F2:f2st(st),Q:a=>st.get(a)},true)}</div>
          <p class="sub">الدائرة الخضراء داخل الـ PLC = المدخل يقرأ 1. لاحظ: S7 و S8 و S9 و SS و F1 و F3 موصلة NC فتقرأ 1 والكابينة بعيدة / المفتاح غير مضغوط.</p>`;
      el.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start"><div style="flex:0 1 250px;min-width:210px;margin-inline:auto"><div class="svgbox" style="margin-top:0">${shaftSVG(shaftData(st,p,get))}</div>${placeHTML()}</div><div style="flex:1 1 520px;min-width:0">${right}</div></div>`;
      el.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{if(p.dir)return;p.pos=+b.dataset.place;p.crash='';p.lastStop=p.pos+1;p.place++});
      el.querySelectorAll('[data-tm]').forEach(b=>b.onclick=()=>{if(p.tm===b.dataset.tm)return;p.tm=b.dataset.tm;p.P=B.createPLC(makeProg(true,p.tm));p.place++});
    },
    frame(el,st,p){if(!el)return;const g=el.querySelector('#elcar');if(g)g.setAttribute('transform',`translate(0 ${(-p.pos*FL).toFixed(1)})`);const r=el.querySelector('#elrope');if(r)r.setAttribute('y2',(Y1-CARH-p.pos*FL).toFixed(1))},
    sig:p=>[p.crash,p.place,p.tm,p.dir,p.t1q,atF1(p),atF3(p),f2pos(p)].join('|'),
    label:p=>floorTxt(p.pos),
    readouts:[{l:'الكابينة',v:p=>floorTxt(p.pos)},
      {l:'الحركة',chip:p=>p.crash?['تجاوز!','trip']:p.dir>0?['صعود ↑','run']:p.dir<0?['نزول ↓','rev']:['متوقفة','']},
      {l:'T1',v:p=>p.t1q?(p.t1rem>0?'1 · يفصل بعد '+p.t1rem.toFixed(1)+' s':'1'):'0'}]
  };
}

function netsHTML(prog,kind,only){const P=B.createPLC(prog);
  return P.nets.filter((n,j)=>!only||only.includes(j+1)).map(n=>`<div class="net static"><header><h3>${n.title}</h3>${n.ref?`<span class="ref">${n.ref}</span>`:''}</header>${kind==='stl'?B.stlTable(n,{trace:[]}):`<div class="svgbox fixed">${(kind==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,NAMES9)}</div>`}</div>`).join('')}

const VARIANTS={default:'book',note:'الكتاب وصّل F1 و F3 بتلامس NC (ص 146) ثم كتبهما في البرنامج بتلامس NC أيضاً (AN I 0.4 و AN I 0.6). بدّل بين النسختين وجرّب الاستدعاء للدور الأول والثالث.',
  book:{label:'كما في الكتاب',program:PROG_BOOK,note:'<b>كما في الكتاب (ص 151 و 154–157):</b> F1 و F3 موصلان NC فيعطيان 1 والكابينة بعيدة عن الدور، والبرنامج يمرّر فقط عند 0. النتيجة: من الدور الثاني لا ينزل المصعد إلى الأول ولا يصعد إلى الثالث أبداً، ولو كانت الكابينة واقفة عند الدور الأول وضُغط SO1 لنزلت وتجاوزت الدور حتى المخمد. الرحلات عبر F2 (إلى الدور الثاني) فقط تعمل.'},
  fixed:{label:'المصحح',program:PROG_FIX,note:'<b>المصحح:</b> بقي التوصيل NC كما في الشكل ص 146، وغُيّر السطر AN I 0.6 إلى A I 0.6 في Network 7، والسطر AN I 0.4 إلى A I 0.4 في Network 8، بنفس طريقة الكتاب مع S7–S9 و SS (موصلة NC ومكتوبة A). حل بديل مكافئ: إبقاء البرنامج كما هو وتوصيل F1 و F3 بتلامس NO.'}};

const ERR_F13='<b>F1 و F3 (ص 146 مقابل ص 151 و 157):</b> شكل التوصيل يرسم F1 و F3 تلامساً مغلقاً NC، والكتاب يقول إنهما «نقطة واحدة مغلقة»، فيقرأ الـ PLC منهما 1 والكابينة بعيدة عن الدور و 0 عند الوصول. لكن البرنامج يكتبهما بتلامس مغلق أيضاً (<span class="ltr">AN I 0.6</span> و <span class="ltr">AN I 0.4</span>)، فلا يمرّر إلا عندما تكون الكابينة <b>عند</b> الدور، أي عكس المطلوب. لاحظ أن الكتاب نفسه كتب S7–S9 و SS (الموصلة NC) بتلامس مفتوح A، وهذا هو الصحيح. في المختبر يوجد زر للتبديل بين «كما في الكتاب» و«المصحح».';

/* =================== Lesson 9.1 =================== */
B.lesson({
 id:'u9-l1',unit:9,order:1,pages:'143–146',
 title:'فكرة المصعد ومكوناته ومفاتيح نهاية المشوار',
 summary:'مصعد لثلاثة أدوار بمحرك عادي بسرعة واحدة: مكونات دائرة التحكم وعناوينها في الـ PLC، وتوصيل المداخل والمخارج، وكيف تتغير مفاتيح نهاية المشوار F1 و F2 و F3 مع حركة الكابينة.',
 theory:[
  {h:'بيانات الوحدة',ref:'ص 143',html:`<ul><li><b>أولاً:</b> فكرة عمل المصعد الكهربائي لثلاثة أدوار.</li><li><b>ثانياً:</b> كتابة برنامج عمل المصعد الكهربائي باستخدام ( PLC ) باللغة ( LAD ).</li></ul>
   <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية ( PLC ) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على: أن يعرف طريقة عمل المصعد الكهربائي، وأن يكتب برنامج تشغيل المصعد الكهربائي.</p>
   <p><b>مستوى الأداء المطلوب:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {err:'«ثانياً» يذكر لغة LAD فقط، لكن الوحدة تقدّم البرنامج بثلاث لغات LAD و FBD و STL (ص 149–157).'},
  {h:'ثالثاً: تركيب وطريقة عمل المصعد',ref:'ص 144',html:`<p>«إن دوائر التحكم الخاصة بالمصاعد كثيرة ومتنوعة وهي صعبة بعض الشيء خاصة لمن لم يعمل في هذا المجال من قبل، وذلك بسبب وجود عدة أجزاء متصلة بلوحة التحكم ولكنها بعيدة عنها. ولكن مع الممارسة تصبح الدائرة سهلة.»</p>
   <p>طرق التحكم في محرك الكبينة كما يذكرها الكتاب:</p><ol><li><b>التحكم في التردد:</b> التحكم بسرعة المحرك بحيث لا يشعر المستخدم بحركة البدء والتوقف. من أفضل الأنواع لكن دائرته معقدة للمبتدئ.</li><li><b>محرك بسرعتين مع مكابح خاصة:</b> كذلك لا يشعر المستخدم بحركة البدء والوقوف.</li><li><b>أبسط الأنواع — وهو الذي سندرسه:</b> مصعد بمحرك عادي بسرعة واحدة.</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المحرك واحد، ويعمل في اتجاه الصعود عن طريق المتمم K4 وفي اتجاه النزول عن طريق المتمم K5 (مثل عكس الحركة في الوحدة الثانية)، ولذلك لا يجوز أن يعمل K4 و K5 معاً. المتممات K1 و K2 و K3 لا تشغّل أحمالاً؛ كل واحد منها «يتذكر» الدور المطلوب.'},
  {h:'جدول المكونات الأساسية لدائرة التحكم',ref:'ص 145',html:'<p>«والجدول التالي يوضح المكونات الأساسية لدائرة التحكم:»</p>'+BOOK_TABLE},
  {note:'<b>توضيح:</b> في جداول المحاكاة الحية فصلنا الصفوف المجمّعة إلى صف لكل عنوان (SO1 = I0.1 … و F2: النقطة b = I0.5 والنقطة a = I0.7 كما في البرنامج)، وأضفنا M0.1 المستخدمة في البرنامج وغير المذكورة في الجدول.'},
  {err:'الجدول يصف SS بأنه «مفاتيح أمان غلق الأبواب أو أي مفتاح أمان آخر»، بينما رمزه في LAD و FBD هو «STOP» وعنوان Network 2 في STL هو «Stop elevator». وهو في شكل التوصيل ضاغط مغلق NC.'},
  {h:'شكل توصيل المداخل والمخارج بوحدة PLC',ref:'ص 146',html:'<p>«والشكل التالي يوضح توصيل المداخل والمخارج بوحدة الحاكم المنطقي المبرمج PLC». كل عنصر دخل بين الخط <span class="ltr">24V</span> ومدخله، والمخرجان Q5.4 و Q5.5 يغذيان ملفي K4 و K5 إلى الخط <span class="ltr">0V</span>. ضواغط الاستدعاء SO و SI مفتوحة NO، وبقية المداخل (F1 و F3 و S7 و S8 و S9 و SS) مغلقة NC.</p>'},
  {draw:B=>`<div class="svgbox">${wiringSVG({act:()=>0,F2:'off',Q:()=>0},true)}</div>`,caption:'توصيل المداخل والمخارج بوحدة PLC (شكل غير مرقّم في الكتاب) — مرسوم والكابينة عند الدور الثاني',ref:'ص 146'},
  {h:'شرح مفاتيح نهاية المشوار',ref:'ص 146',html:`<p>«قبل البدء في شرح الدائرة يجب أن نعلم أن مفتاح نهاية المشوار للدور الأول والثالث ( F1, F3 ) عبارة عن <b>نقطة واحدة مغلقة ( NC )</b>.»</p>
   <p>«أما بالنسبة لمفتاح نهاية المشوار للدور الأوسط ( الدور الثاني ) ( F2 ) فإنه يحتوي على <b>ثلاثة أوضاع</b>:</p><ul><li>إذا كان طرفه الرئيسي على وضع ( <b>off</b> ) بالنسبة للنقطتين يعني وقوف الكابينة على الدور الثاني.</li><li>فإذا نزلت الكابينة إلى أسفل يتغير وضع المفتاح فيتصل الطرف الرئيسي بالنقطة ( <b>b</b> ) المتصلة بطرف متمم الصعود.</li><li>إذا صعدت الكابينة إلى الدور العلوي يتغير وضعه ويصبح الطرف الرئيسي ملامساً للنقطة ( <b>a</b> ) المتصلة بمتمم النزول.»</li></ul>
   <p>«ويتغير وضع مفاتيح تحديد وقوف الأدوار بواسطة <b>مجرى بمنحنى خاص</b> مركب بجانب الكابينة، وعند الصعود أو النزول تدخل بكرة ذراع مفتاح الدور داخل المجرى فيتغير وضع المفتاح تبعاً لمنحنى المجرى.»</p>`},
  {widget:(el)=>{let pos=100;const draw=()=>{const p={pos:pos/100};const f2=f2pos(p);
     el.innerHTML=`<div class="fig"><label class="toggle" style="display:block">حرّك الكابينة: <input type="range" min="0" max="200" value="${pos}" style="width:100%" aria-label="موضع الكابينة"></label>
      <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center"><div class="svgbox" style="flex:0 1 230px;margin-inline:auto">${shaftSVG({pos:p.pos,K:[0,0,0],doors:[0,0,0],F1a:atF1(p),F3a:atF3(p),F2:f2,crash:''})}</div>
      <div style="flex:1 1 260px"><div class="facts"><div class="fact"><span>F1 (I0.4)</span><b>${atF1(p)?'مفتوح → 0':'مغلق → 1'}</b></div><div class="fact"><span>F2</span><b>${f2}</b></div><div class="fact"><span>F3 (I0.6)</span><b>${atF3(p)?'مفتوح → 0':'مغلق → 1'}</b></div></div>
      <p class="sub">${f2==='b'?'الكابينة تحت الدور الثاني: F2 على b (المتصلة بفرع الصعود K4) — فإذا طُلب الدور الثاني تصعد.':f2==='a'?'الكابينة فوق الدور الثاني: F2 على a (المتصلة بفرع النزول K5) — فإذا طُلب الدور الثاني تنزل.':'الكابينة عند الدور الثاني: F2 على off، لا يتصل بأي نقطة.'}</p></div></div></div>`;
     const r=el.querySelector('input');r.oninput=()=>{pos=+r.value;draw();el.querySelector('input').focus()};};draw()}},
  {err:'<b>تسمية اليسار واليمين في F2:</b> في الشكلين (ص 144 و 146) النقطة <b>b</b> على اليسار (جهة K4 الصعود) و <b>a</b> على اليمين (جهة K5 النزول). لكن نص ص 147 يسمي النقطة التي يلامسها F2 فوق الدور الثاني «النقطة اليسرى»، وهي حسب ص 146 النقطة a (اليمنى في الرسم). المعتمد هنا: فوق الدور الثاني = a، تحته = b.'},
  {err:ERR_F13+' (التفاصيل في الدرس 9.3).'}
 ],
 io:IO9,
 lab:(el)=>lab91(el),
 quiz:[
  {q:'ما نوع المصعد الذي يدرسه الكتاب؟',o:['مصعد بالتحكم في التردد','مصعد بمحرك بسرعتين ومكابح','مصعد بمحرك عادي بسرعة واحدة','مصعد هيدروليكي'],c:2,e:'«وأبسط هذه الأنواع هو النوع الذي سوف ندرسه، وهو يحتوي على المصعد وعلى محرك عادي بسرعة واحدة» (ص 144).'},
  {q:'مفتاحا نهاية المشوار F1 و F3 عبارة عن:',o:['نقطة واحدة مفتوحة NO','نقطة واحدة مغلقة NC','مفتاح بثلاثة أوضاع','ضاغط استدعاء'],c:1,e:'ص 146: F1 و F3 «عبارة عن نقطة واحدة مغلقة ( NC )».'},
  {q:'كم وضعاً لمفتاح نهاية المشوار F2 للدور الثاني؟',o:['وضعان','ثلاثة أوضاع: off و a و b','أربعة أوضاع','وضع واحد'],c:1,e:'F2 له ثلاثة أوضاع: off عند الدور الثاني، b تحته، a فوقه.'},
  {q:'الكابينة نزلت تحت الدور الثاني. بأي نقطة يتصل الطرف الرئيسي لـ F2؟',o:['a المتصلة بمتمم النزول','b المتصلة بطرف متمم الصعود','لا يتصل (off)','يتصل بالنقطتين'],c:1,e:'«فإذا نزلت الكابينة إلى أسفل… يتصل الطرف الرئيسي بالنقطة (b) المتصلة بطرف متمم الصعود» (ص 146).'},
  {q:'ما الذي يغيّر وضع مفاتيح الأدوار أثناء الحركة؟',o:['ضغط الراكب','مجرى بمنحنى خاص مركب بجانب الكابينة تدخل فيه بكرة ذراع المفتاح','المزمن T1','المتمم K0'],c:1,e:'ص 146.'},
  {q:'ما عنوان متمم الصعود K4 في الـ PLC؟',o:['Q4.1','Q5.5','Q5.4','M0.0'],c:2,e:'K4 = Q5.4 و K5 = Q5.5 (جدول ص 145).'},
  {q:'لماذا يقرأ الـ PLC من المدخل I1.4 (S7) القيمة 1 والباب مغلق؟',o:['لأن S7 موصّل بتلامس مغلق NC','لأن البرنامج يكتب 1','لأن S7 ضاغط مفتوح NO','بسبب المزمن'],c:0,e:'في شكل التوصيل ص 146 مفاتيح الأمان موصلة NC: يمر الـ 24V ما دام المفتاح مغلقاً.'},
  {q:'ما وظيفة المتممات K1 و K2 و K3؟',o:['تشغيل المحرك صعوداً','طلب الدور الأول والثاني والثالث','فتح الأبواب','الأمان'],c:1,e:'جدول ص 145: «المتمم الخاص بطلب الدور الأول/الثاني/الثالث».'}
 ]
});

/* ---------- custom lab for 9.1 ---------- */
function lab91(el){
  const s={pos:100,btn:{},sw:{S7:0,S8:0,S9:0}};const done={};
  const TASKS=[['b','حرّك الكابينة تحت الدور الثاني: يصبح F2 على b و I0.5 = 1.',x=>f2pos(x)==='b'],['a','حرّكها فوق الدور الثاني: F2 على a و I0.7 = 1.',x=>f2pos(x)==='a'],
    ['f1','أنزلها إلى الدور الأول: يُفتح F1 فيصبح I0.4 = 0.',x=>atF1(x)],['f3','اصعد بها إلى الدور الثالث: يُفتح F3 فيصبح I0.6 = 0.',x=>atF3(x)],
    ['s8','افتح باب الدور الثاني S8: يصبح I1.5 = 0.',()=>s.sw.S8],['so','اضغط SO2: يصبح I0.2 = 1 ما دمت ضاغطاً.',()=>s.btn.SO2]];
  const act=id=>{const p={pos:s.pos/100};if(id==='F1')return atF1(p);if(id==='F3')return atF3(p);if(s.sw[id]!==undefined)return s.sw[id];return s.btn[id]?1:0};
  function bitsOf(){const p={pos:s.pos/100},f=f2pos(p),b={};WIN.forEach(([id,ad,ty])=>{if(ty==='f2')b[ad]=f===(id==='F2b'?'b':'a')?1:0;else{const a=act(id)?1:0;b[ad]=ty==='no'?a:1-a}});return b}
  el.innerHTML=`<div class="callout">مختبر هذا الدرس بلا برنامج: حرّك الكابينة بيدك واضغط الضواغط وافتح مفاتيح الأمان، وراقب ماذا يصل إلى كل مدخل في الـ PLC حسب شكل التوصيل ص 146.</div>
   <div class="grid"><div class="panel c12"><h2>أدوات التحكم</h2>
    <label class="toggle" style="display:block">موضع الكابينة: <input id="l91pos" type="range" min="0" max="200" value="100" style="width:100%" aria-label="موضع الكابينة"></label>
    <div class="seg" role="group" style="margin:6px 0">${[0,1,2].map(n=>`<button data-fl="${n}">الدور ${FLN[n]}</button>`).join('')}</div>
    <div class="pbs" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px">${IN_CALLS.filter(i=>i.type==='push').map(i=>`<button class="pb ${i.color}" data-pb="${i.id}" aria-label="${i.label}"><span class="cap">${i.id}</span><small>${i.label}</small></button>`).join('')}
     ${['S7','S8','S9'].map(k=>`<button class="sw" data-sw="${k}" aria-pressed="false"><span class="knob"></span><b>${k}</b><small>فتح الباب</small></button>`).join('')}</div></div>
    <div class="panel c4"><h2>بئر المصعد</h2><div id="l91shaft"></div></div>
    <div class="panel c8"><h2>توصيل المداخل بالـ PLC <small>ص 146</small></h2><div id="l91wire"></div><div id="l91facts"></div></div>
    <div class="panel c6"><h2>مهام قصيرة</h2><ol class="steps" id="l91tasks"></ol></div>
    <div class="panel c6"><h2>جدول المداخل (حي)</h2><div id="l91io"></div></div></div>`;
  const q=x=>el.querySelector(x);
  function render(){const p={pos:s.pos/100},f=f2pos(p);
    q('#l91shaft').innerHTML=`<div class="svgbox" style="margin-top:0;max-width:260px;margin-inline:auto">${shaftSVG({pos:p.pos,K:[0,0,0],doors:[s.sw.S7,s.sw.S8,s.sw.S9],F1a:atF1(p),F3a:atF3(p),F2:f,crash:''})}</div><p class="sub" style="text-align:center">${floorTxt(p.pos)}</p>`;
    q('#l91wire').innerHTML=`<div class="svgbox">${wiringSVG({act,F2:f,Q:()=>0},true)}</div>`;
    q('#l91facts').innerHTML=`<div class="facts"><div class="fact"><span>F1 → I0.4</span><b>${atF1(p)?'0':'1'}</b></div><div class="fact"><span>F2 → I0.5 / I0.7</span><b>${f==='b'?'1 / 0':f==='a'?'0 / 1':'0 / 0'}</b></div><div class="fact"><span>F3 → I0.6</span><b>${atF3(p)?'0':'1'}</b></div><div class="fact"><span>SS → I0.0</span><b>${s.btn.SS?'0':'1'}</b></div></div>`;
    const b=bitsOf();q('#l91io').innerHTML=`<div class="tablebox"><table class="io"><thead><tr><th>الرمز</th><th>الوصف</th><th>العنوان</th><th>الحالة</th></tr></thead><tbody>${IO9.filter(r=>/^I/.test(r.addr)).map(r=>{const v=b[r.addr]||0;return `<tr class="${v?'hi':''}"><td class="mono">${r.sym}</td><td>${r.desc}</td><td class="mono">${r.addr}</td><td><span class="bit ${v?'one':''}">${v}</span></td></tr>`}).join('')}</tbody></table></div>`;
    TASKS.forEach(t=>{if(t[2](p))done[t[0]]=1});
    q('#l91tasks').innerHTML=TASKS.map((t,i)=>`<li class="${done[t[0]]?'done':''}"><span class="k">${done[t[0]]?'✓':i+1}</span><div><p style="display:block">${t[1]}</p></div></li>`).join('');
  }
  const r=q('#l91pos');r.oninput=()=>{s.pos=+r.value;render()};
  el.querySelectorAll('[data-fl]').forEach(b=>b.onclick=()=>{s.pos=+b.dataset.fl*100;r.value=s.pos;render()});
  el.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{const k=b.dataset.sw;s.sw[k]=s.sw[k]?0:1;b.setAttribute('aria-pressed',s.sw[k]?'true':'false');render()});
  el.querySelectorAll('[data-pb]').forEach(b=>{const k=b.dataset.pb;const dn=e=>{e&&e.preventDefault();s.btn[k]=1;b.classList.add('down');render()};const up=()=>{if(!s.btn[k])return;s.btn[k]=0;b.classList.remove('down');render()};
    b.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,up));
    b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)dn(e)});b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')up()})});
  render();
}

/* =================== Lesson 9.2 =================== */
B.lesson({
 id:'u9-l2',unit:9,order:2,pages:'144، 147–148',
 title:'الدائرة التقليدية للمصعد وخطوات التشغيل',
 summary:'دائرة التحكم التقليدية (L1 – N) للمصعد بثلاثة أدوار: المتمم المساعد K0، والمزمن T1، ومتممات الطلب K1–K3، ومتمما الصعود والنزول K4 و K5، ثم سيناريوهات التشغيل الثلاثة.',
 theory:[
  {h:'رابعاً: دائرة التحكم في مصعد لثلاثة أدوار',ref:'ص 144',html:`<p>الدائرة مرسومة بين الخط L1 (أعلى) والخط N (أسفل). سنسمي النقطة بعد تلامس K0 «النقطة X» (خط التغذية المشترك لبقية الدائرة). الفروع من اليسار:</p>
   <ol><li><b>فرع K0:</b> S7 مغلق ← S8 مغلق ← S9 مغلق ← ملف K0.</li>
   <li><b>التغذية:</b> SS (ضاغط مغلق) ← تلامس K0 المفتوح ← النقطة X.</li>
   <li><b>فرع المزمن T1:</b> [K4 مفتوح ∥ K5 مفتوح] ← ملف T1 (مزمن تأخير فصل حسب البرنامج).</li>
   <li><b>فرع K1:</b> [ (T1 مغلق ← SO1) ∥ (T1 مفتوح ← K1) ∥ SI1 ] ← ملف K1.</li>
   <li><b>فرع K2:</b> [ (T1 مغلق ← SO2) ∥ (T1 مفتوح ← K2) ∥ SI2 ] ← ملف K2.</li>
   <li><b>فرع K3:</b> [ (T1 مغلق ← SO3) ∥ (T1 مفتوح ← K3) ∥ SI3 ] ← ملف K3.</li>
   <li><b>فرع الصعود U ↑:</b> [ (K3 ← F3 مغلق) ∥ (K2 ← F2 النقطة b) ] ← K5 مغلق ← ملف K4.</li>
   <li><b>فرع النزول D ↓:</b> [ (K1 ← F1 مغلق) ∥ (K2 ← F2 النقطة a) ] ← K4 مغلق ← ملف K5.</li></ol>
   <p>في الرسم تلامس واحد T1 مغلق يغذي خطاً أفقياً إلى SO1 و SO2 و SO3، وتلامس واحد T1 مفتوح يغذي خطاً أفقياً إلى تلامسات الإمساك K1 و K2 و K3، وخط ثالث مباشر من X يغذي SI1 و SI2 و SI3. والطرف الرئيسي لـ F2 بعد تلامس K2، ونقطته b إلى فرع K4 ونقطته a إلى فرع K5.</p>`},
  {draw:B=>`<div class="svgbox ctrlbox">${hwSVG(HW_IDLE,false)}</div>`,caption:'دائرة التحكم التقليدية للمصعد لثلاثة أدوار (شكل غير مرقّم في الكتاب) — الكابينة عند الدور الثاني',ref:'ص 144'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اسم «النقطة X» من عندنا. وقيمة زمن T1 غير مذكورة في الدائرة التقليدية؛ البرنامج يستخدم 5 ث (S5T#5S).'},
  {h:'خطوات تشغيل الدائرة',ref:'ص 147',html:`<ol><li><b>من الدور الثاني إلى الأول:</b> «بفرض أن الكابينة تقف في الدور الثاني. فإذا كنت تريد استدعاء الكابينة للدور الأول يتم الضغط على المفتاح ( SO1 ) من خارج الكبينة أو على المفتاح ( SI1 ) من داخل الكبينة، فيصل التيار إلى المتمم ( K1 ).» (ملاحظة: جميع مفاتيح الأمان في حالة غلق من أجل تشغيل المتمم المساعد لعمل الدائرة.) «وبالتالي يصل التيار إلى المتمم ( K5 ) فتبدأ الكابينة بالنزول تاركة ( F2 ) في حالة توصيل مع النقطة المتصلة مع ملف المتمم ( K4 )، وتستمر الكابينة بالنزول حتى تصل إلى مفتاح نهاية المشوار ( F1 ) فتفصل وتقف الكابينة عند الدور الأول.»</li>
   <li><b>من الدور الأول إلى الثالث:</b> «عند الضغط على مفتاح التشغيل ( SO3 ) أو ( SI3 ) يصل التيار إلى المتمم ( K3 ) وبالتالي يصل التيار إلى المتمم ( K4 ) وتبدأ الكابينة بالصعود تاركة مفتاح الدور الأول ( F1 ) ليعود إلى وضع مغلق، وتستمر بالصعود فتمر على مفتاح الدور الثاني ( F2 ) فيتغير من وضع فصل … ولا يحدث أي شيء بالنسبة لتغير وضع مفتاح الدور الثاني ( F2 ) لأن التيار وصل إلى المتمم ( K4 ) من خلال المتمم ( K3 ). وتستمر الكابينة في الصعود حتى تصل إلى الدور الثالث فيتغير مفتاح نهاية المشوار ( F3 ) ويفصل التيار عن المتمم ( K4 ) ويقف المصعد عند الدور الثالث.»</li>
   <li><b>من الدور الثالث إلى الثاني:</b> «يتم الضغط على المفتاح ( SO2 ) أو ( SI2 ) فيصل التيار إلى المتمم ( K2 ) وتغلق نقاطه ليصل التيار إلى المتمم ( K5 ) فتبدأ الكابينة بالنزول تاركة المفتاح ( F3 ) مغلقاً، وتستمر بالنزول وعند الدور الثاني يتغير وضع المفتاح ( F2 ) فيفصل النقاط … فينقطع التيار عن المتمم ( K5 ) وتقف الكابينة عند الدور الثاني.»</li></ol>`},
  {err:'خطأ مطبعي في ص 147: «وتستمر المبينة بالنزول» والمقصود «الكابينة». وفي ص 148: «ويقفل المزمن لحظه» والمقصود «لحظة».'},
  {err:'في الخطوتين 2 و 3 (ص 147) يسمي النص النقطة التي يلامسها F2 فوق الدور الثاني «النقطة اليسرى»، بينما هي في الرسم (ص 144) النقطة a على اليمين جهة K5. المنطق الصحيح: فوق الدور الثاني يلامس F2 النقطة a فيعمل K5 (نزول) عند طلب الدور الثاني.'},
  {h:'ملاحظات',ref:'ص 147–148',html:`<ol><li>«وظيفة المتمم المساعد ( K0 ) في حالة فصل أي مفتاح أمان بالنسبة للتأكد من غلق الأبواب أو غيرها أن المتمم ( K0 ) لا يعمل، بالتالي فإن جميع أجزاء الدائرة لا تعمل.» (ص 147)</li>
   <li>«وظيفة المزمن أنه في حالة تشغيل المتمم ( K5 ) أو ( K4 ) أي متمم النزول أو الصعود أن تغلق نقاط المزمن ليظل التيار موصلاً إلى ملف المتمم الخاص بالدور المطلوب ( K1, K2, K3 ) حتى بعد ترك مفتاح التشغيل، ويقفل المزمن لحظة وقوف المحرك في حالة الصعود أو النزول.» (ص 148)</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن تلامس T1 المغلق في طريق ضواغط الخارج SO: أثناء الحركة يُفتح، فلا يستجيب المصعد لاستدعاء من الخارج حتى يقف. أما ضواغط الداخل SI فمتصلة مباشرة بالنقطة X.'},
  {err:'<b>زمن المزمن:</b> الملاحظة 2 (ص 148) تقول إن المزمن «يقفل لحظة وقوف المحرك»، أي ترجع تلامساته فور توقف K4 و K5. لكن البرنامج (ص 149 و 156) يستخدم مزمن تأخير فصل S_OFFDT بزمن <span class="ltr">S5T#5S</span>، فتبقى تلامساته 5 ث بعد الوقوف: يبقى متمم الدور ممسوكاً 5 ث، وتبقى استدعاءات الخارج SO محجوبة خلالها. في المختبر زر لاختيار الزمن: «5 ث كما في البرنامج» أو «لحظي كما في الملاحظة 2».'},
  {err:'<b>ترقيم الصفحات:</b> الوحدة التاسعة تمتد من ص 143 إلى ص 158، لكن الوحدة العاشرة تبدأ هي أيضاً بالرقم 147، فالرقمان 147 و 148 مكرران في الكتاب. المقصود هنا صفحتا الوحدة التاسعة.'}
 ],
 io:IO9,
 inputs:IN_CALLS,
 plant:elevPlant(true),
 steps:[
  {t:'الوضع الابتدائي',x:'الكابينة عند الدور الثاني و F2 على off. مفاتيح الأمان S7 و S8 و S9 مغلقة فيعمل K0، و SS مغلق فيصل الجهد إلى النقطة X.',done:s=>s.M('M0.0')&&s.M('M0.1')},
  {t:'من الثاني إلى الأول (الخطوة 1)',x:'اضغط SO1 أو SI1. يعمل K1، ثم يعمل K5 عبر F1 المغلق فتنزل الكابينة. يعمل T1 فيُمسك K1 بعد ترك الضاغط.',done:s=>s.Q('Q5.5')},
  {t:'الوقوف عند الأول',x:'عند الدور الأول يُفتح F1 فينقطع التيار عن K5 وتقف الكابينة. لاحظ T1 يبقى 5 ث ثم يفصل K1.',done:s=>s.plant.lastStop===1&&!s.Q('Q5.5')},
  {t:'من الأول إلى الثالث (الخطوة 2)',x:'اضغط SO3 أو SI3 (إن لم يستجب SO3 فانتظر انتهاء الـ 5 ث). تمر الكابينة على F2 (b ثم off ثم a) ولا تقف لأن K4 يأخذ التيار عبر K3 و F3.',done:s=>s.plant.lastStop===3&&!s.Q('Q5.4')},
  {t:'من الثالث إلى الثاني (الخطوة 3)',x:'اضغط SO2 أو SI2. F2 على a فيعمل K5 عبر K2، وعند الدور الثاني يصير F2 على off فيقف.',done:s=>s.plant.lastStop===2&&s.plant.dir===0},
  {t:'وظيفة المزمن (ملاحظة 2)',x:'اختر «لحظي» من أزرار زمن T1 ثم نفّذ رحلة. يفصل متمم الدور لحظة الوقوف، ويمكن الاستدعاء من الخارج فوراً.',done:s=>s.plant.tm==='0S'},
  {t:'وظيفة K0 (ملاحظة 1)',x:'أثناء حركة الكابينة افتح باب أحد الأدوار (S7 أو S8 أو S9). يفصل K0 فتفصل الدائرة كلها وتقف الكابينة.',done:s=>!s.M('M0.0')},
  {t:'ضاغط SS',x:'أغلق الباب ثم شغّل رحلة واضغط SS: تنقطع التغذية عن النقطة X فيقف كل شيء.'}
 ],
 quiz:[
  {q:'ما وظيفة المتمم المساعد K0؟',o:['تشغيل المحرك صعوداً','إذا فُصل أي مفتاح أمان لا يعمل K0 فلا تعمل الدائرة كلها','تأخير الاستدعاء','طلب الدور الأول'],c:1,e:'الملاحظة 1 ص 147.'},
  {q:'الكابينة عند الدور الثاني وضغطت SO1. ماذا يحدث؟',o:['يعمل K3 ثم K4','يعمل K1 ثم K5 فتنزل','يعمل K2 فقط','لا شيء'],c:1,e:'الخطوة 1 ص 147: يصل التيار إلى K1 ثم إلى K5 فتنزل الكابينة حتى F1.'},
  {q:'أثناء الصعود من الأول إلى الثالث لماذا لا تقف الكابينة عند الدور الثاني؟',o:['لأن F2 تالف','لأن التيار يصل إلى K4 من خلال K3','لأن T1 يوقفها','لأن K0 مفصول'],c:1,e:'«لا يحدث أي شيء بالنسبة لتغير وضع F2 لأن التيار وصل إلى K4 من خلال K3» (ص 147).'},
  {q:'ما الذي يوقف الكابينة عند الدور الثالث؟',o:['F3 يتغير فيفصل التيار عن K4','الضاغط SS','المزمن T1','F1'],c:0,e:'الخطوة 2 ص 147.'},
  {q:'حسب الملاحظة 2، ما وظيفة المزمن؟',o:['إيقاف المحرك بعد 5 ث','إبقاء التيار في ملف متمم الدور المطلوب بعد ترك مفتاح التشغيل','فتح الباب','عكس الحركة'],c:1,e:'ص 148: «ليظل التيار موصلاً إلى ملف المتمم الخاص بالدور المطلوب ( K1, K2, K3 ) حتى بعد ترك مفتاح التشغيل».'},
  {q:'لماذا يوجد تلامس K4 المغلق في فرع K5؟',o:['للإمساك الذاتي','للتعشيق: لا يعمل الصعود والنزول معاً','للتأخير','للأمان'],c:1,e:'K4 و K5 يشغلان المحرك نفسه في اتجاهين متعاكسين.'},
  {q:'الكابينة عند الدور الثاني وضغطت SO2. ماذا يحدث؟',o:['تصعد','تنزل','لا تتحرك لأن F2 على off فلا يصل التيار إلى K4 ولا K5','يفصل K0'],c:2,e:'فرعا K2 يمران عبر F2، و F2 على off عند الدور الثاني.'},
  {q:'لماذا لا يستجيب المصعد لضاغط SO3 أثناء حركته؟',o:['لأن تلامس T1 المغلق في طريق ضواغط SO يُفتح أثناء الحركة','لأن SO3 تالف','لأن F3 مفتوح','لأن K0 مفصول'],c:0,e:'T1 يعمل مع K4 أو K5 فيفتح تلامسه المغلق الذي يغذي SO1 و SO2 و SO3.'}
 ]
});

/* =================== Lesson 9.3 =================== */
const PLANT_PLC=elevPlant(false);
B.lesson({
 id:'u9-l3',unit:9,order:3,pages:'149–151',
 title:'برنامج المصعد بلغة LAD',
 summary:'تحويل دائرة المصعد إلى ثماني شبكات LAD: الأمان K0، والعلامة M0.1، والمزمن T1 من نوع S_OFFDT بزمن 5 ث، وطلبات الأدوار الثلاثة، والصعود والنزول — مع تصحيح خطأ F1 و F3.',
 theory:[
  {h:'١- دائرة ( LAD ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 149–151',html:`<p>كل فرع من الدائرة التقليدية صار Network:</p><ul>
   <li><b>Network 1 : SAFE</b> — S7 و S8 و S9 (I1.4 و I1.5 و I1.6) على التوالي ← M0.0 «K0».</li>
   <li><b>Network 2</b> — I0.0 «STOP / SS» و M0.0 ← M0.1. هذه العلامة تقوم مقام النقطة بعد K0، ولذلك تبدأ بها الشبكات 4–8.</li>
   <li><b>Network 3</b> — صندوق مزمن T1 نوع <b>S_OFFDT</b>: المدخل S = [Q5.4 «K4» ∥ Q5.5 «K5»]، و <span class="ltr">TV = S5T#5S</span>، والمدخل R = M0.1 بتلامس مغلق.</li>
   <li><b>Networks 4–6 : FIRST / SECOND / THIRD FLOOR CALLING</b> — M0.1 ← [ (T1 مغلق ← SO) ∥ (T1 مفتوح ← K) ∥ SI ] ← K.</li>
   <li><b>Network 7 : ELEVATOR UP</b> — M0.1 ← [ (K3 ← I0.6 «F3» مغلق) ∥ (K2 ← I0.5 «b») ] ← Q5.5 مغلق ← Q5.4 «K4».</li>
   <li><b>Network 8 : ELEVATOR DOWN</b> — M0.1 ← [ (K1 ← I0.4 «F1» مغلق) ∥ (K2 ← I0.7 «a») ] ← Q5.4 مغلق ← Q5.5 «K5».</li></ul>`},
  {draw:B=>netsHTML(PROG_BOOK,'lad'),caption:'Network 1–8 بلغة LAD كما في الكتاب',ref:'ص 149–151'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مزمن تأخير الفصل S_OFFDT: خرجه Q يصبح 1 فوراً مع المدخل S، وعندما يعود S إلى 0 يبقى Q = 1 مدة TV ثم يصبح 0. لذلك بعد وقوف الكابينة يبقى T1 = 1 مدة 5 ث فيبقى متمم الدور ممسوكاً، وتبقى طلبات الخارج SO محجوبة (لأنها تمر بتلامس T1 المغلق)، بينما طلبات الداخل SI لا تُحجب.'},
  {err:'عنوانا Network 2 و Network 3 في LAD مكتوبان «Title:» بلا عنوان، وفي STL: «Stop elevator» و «Delay time for calling». استخدمنا عناوين STL.'},
  {h:'لماذا S7 و SS بتلامس مفتوح، و F1 و F3 بتلامس مغلق؟',ref:'ص 146، 151',html:'<p>القاعدة في الـ PLC: البرنامج يرى <b>الإشارة</b> لا نوع التلامس في الموقع. المفتاح الموصّل NC يعطي 1 في حالته العادية. فإذا أردنا «يمرّر ما دام المفتاح مغلقاً» نكتب تلامساً مفتوحاً A، كما فعل الكتاب مع S7 و S8 و S9 و SS.</p>'},
  {draw:B=>`<div class="svgbox">${wiringSVG({act:()=>0,F2:'off',Q:()=>0},true)}</div>`,caption:'توصيل المداخل بالـ PLC: F1 و F3 تلامسان مغلقان NC (شكل غير مرقّم)',ref:'ص 146'},
  {err:ERR_F13},
  {html:`<table class="tt"><thead><tr><th>الكابينة</th><th>F1 (NC)</th><th>I0.4</th><th>كما في الكتاب: AN I 0.4</th><th>المصحح: A I 0.4</th></tr></thead><tbody>
   <tr><td>بعيدة عن الدور الأول (يجب أن تنزل)</td><td>مغلق</td><td>1</td><td>0 ← K5 لا يعمل</td><td>1 ← K5 يعمل</td></tr>
   <tr><td>عند الدور الأول (يجب أن تقف)</td><td>مفتوح</td><td>0</td><td>1 ← K5 يعمل (تجاوز!)</td><td>0 ← K5 يفصل</td></tr></tbody></table>`},
  {err:'<b>زمن المزمن:</b> الملاحظة 2 (ص 148) تقول إن المزمن «يقفل لحظة وقوف المحرك»، بينما البرنامج يضع <span class="ltr">S5T#5S</span> على مزمن تأخير فصل، فيبقى T1 = 1 مدة 5 ث بعد الوقوف. المحاكاة هنا تتبع البرنامج (5 ث)، والمقارنة بالزمن اللحظي موجودة في مختبر الدرس 9.2.'},
  {note:'العلامة M0.1 مستخدمة في البرنامج ولم تُذكر في جدول ص 145. أضفناها إلى جدول المداخل والمخارج في المحاكاة.'},
  {note:'<b>ملاحظة من المحاكاة (ليست من الكتاب):</b> إذا وقفت الكابينة عند الدور الأول مثلاً، وخلال الـ 5 ث التي يبقى فيها K1 ممسوكاً ضُغط SI3 من الداخل، يعمل K3 فتصعد الكابينة و T1 ما زال 1، فيبقى K1 ممسوكاً طوال الرحلة. وعند الوصول للثالث يعمل K5 فوراً بسبب K1 فتعود للأول، ثم تصعد بسبب K3… وهكذا تتردد بين الدورين حتى يُفتح مفتاح أمان أو يُضغط SS. هذا من تصميم الدائرة نفسها (التقليدية والمبرمجة)، جرّبه في المختبر.'}
 ],
 io:IO9, inputs:IN_PLC,
 variants:VARIANTS,
 plant:PLANT_PLC,
 plcNote:'المدخلان F1 (I0.4) و F3 (I0.6) يتغيران وحدهما مع موضع الكابينة، و F2 يعطي I0.5 (b) تحت الدور الثاني و I0.7 (a) فوقه. مفاتيح الأمان و SS موصلة NC فتقرأ 1 في حالتها العادية.',
 steps:[
  {t:'الوضع الابتدائي (نسخة الكتاب)',x:'الكابينة عند الدور الثاني. مفاتيح الأمان مغلقة: M0.0 = 1 ثم M0.1 = 1. نسخة البرنامج المختارة «كما في الكتاب».',done:s=>s.M('M0.1')},
  {t:'جرّب برنامج الكتاب',x:'اضغط SO1. يعمل K1 ما دمت ضاغطاً، لكن K5 لا يعمل: I0.4 = 1 (F1 مغلق NC) والبرنامج يطلب AN I 0.4. انظر تبويب «برنامج الـ PLC».',done:s=>s.variant==='book'&&s.Q('Q4.1')},
  {t:'اختر النسخة المصححة',x:'اضغط «المصحح» أعلى المختبر. صار السطر A I 0.4 و A I 0.6.',done:s=>s.variant==='fixed'},
  {t:'من الثاني إلى الأول',x:'اضغط SO1 أو SI1. يعمل K1 ثم K5 فتنزل الكابينة، ويعمل T1 فيُمسك K1.',done:s=>s.variant==='fixed'&&s.Q('Q5.5')},
  {t:'الوقوف ومزمن 5 ث',x:'عند الدور الأول يصبح I0.4 = 0 فيفصل K5. يبقى T1 = 1 مدة 5 ث ثم يفصل K1. جرّب خلالها SO3: لا يستجيب (AN T 1).',done:s=>s.plant.lastStop===1&&!s.Q('Q4.1')&&!s.T('T1').q},
  {t:'من الأول إلى الثالث',x:'اضغط SO3 أو SI3. تمر الكابينة على F2 ولا تقف، وتقف عند F3.',done:s=>s.plant.lastStop===3&&!s.Q('Q5.4')},
  {t:'من الثالث إلى الثاني',x:'اضغط SO2 أو SI2. F2 على a (I0.7 = 1) فيعمل K5 حتى يصير F2 على off.',done:s=>s.plant.lastStop===2&&s.plant.dir===0},
  {t:'الأمان',x:'شغّل رحلة ثم افتح أحد الأبواب (S7 أو S8 أو S9): يصبح M0.0 = 0 ثم M0.1 = 0 فيقف كل شيء ويُصفَّر T1.',done:s=>!s.M('M0.0')},
  {t:'اختياري: تجاوز الدور في نسخة الكتاب',x:'أغلق الباب، اختر «كما في الكتاب»، ضع الكابينة عند الدور الأول (أداة المحاكاة) واضغط SO1: تنزل الكابينة متجاوزة الدور حتى المخمد.',done:s=>s.variant==='book'&&!!s.plant.crash}
 ],
 quiz:[
  {q:'ما نوع المزمن T1 في Network 3؟',o:['S_PULSE','S_ODT تأخير تشغيل','S_OFFDT تأخير فصل','عداد'],c:2,e:'صندوق T1 في ص 149 من نوع S_OFFDT، وفي STL الأمر SF.'},
  {q:'كم زمن المزمن T1 في البرنامج؟',o:['S5T#3S','S5T#5S','S5T#10S','غير مذكور'],c:1,e:'TV = S5T#5S.'},
  {q:'لماذا لا تستجيب ضواغط الخارج SO أثناء الحركة؟',o:['لأن تلامس T1 المغلق (AN T 1) في طريقها','لأن M0.1 = 0','لأن SO موصلة NC','لأن K0 مفصول'],c:0,e:'T1 = 1 أثناء الحركة و 5 ث بعدها، فيُفتح فرع SO.'},
  {q:'هل تُحجب ضواغط الداخل SI أثناء الحركة؟',o:['نعم','لا، لأنها موصولة بالتوازي مباشرة دون T1','فقط SI2','فقط في الصعود'],c:1,e:'في Networks 4–6: O I 1.1 / I 1.2 / I 1.3 مباشرة.'},
  {q:'العلامة M0.1 تساوي:',o:['S7 و S8 و S9','SS و K0','K4 أو K5','T1'],c:1,e:'Network 2: A I 0.0 ، A M 0.0 ، = M 0.1.'},
  {q:'S7 موصّل NC وكُتب في البرنامج A I 1.4. هل هذا صحيح؟',o:['نعم، لأن المدخل يقرأ 1 والمفتاح مغلق','لا، يجب AN','لا، يجب أن يوصّل NO','لا فرق'],c:0,e:'المفتاح المغلق NC يعطي 1، والمطلوب أن تعمل الدائرة ما دام مغلقاً.'},
  {q:'F1 موصّل NC والبرنامج يقول AN I 0.4. متى يمرّر هذا الشرط؟',o:['والكابينة بعيدة عن الدور الأول','والكابينة عند الدور الأول فقط','دائماً','أبداً'],c:1,e:'عند الدور الأول يُفتح F1 فيصبح I0.4 = 0 فيمرّر AN. هذا خطأ الكتاب: النزول لا يبدأ إلا والكابينة عند الدور الأول.'},
  {q:'ماذا يفعل الأمر AN M 0.1 ثم R T 1 في Network 3؟',o:['يشغّل المزمن','يصفّر المزمن إذا انقطع M0.1 (فتح أمان أو SS)','يعكس الحركة','يعدّ الأدوار'],c:1,e:'المدخل R للمزمن = M0.1 بتلامس مغلق.'}
 ]
});

/* =================== Lesson 9.4 =================== */
B.lesson({
 id:'u9-l4',unit:9,order:4,pages:'152–158',
 title:'برنامج المصعد بلغتي FBD و STL ومقارنة اللغات',
 summary:'الشبكات الثماني نفسها بالبوابات المنطقية FBD وبقائمة الإجراءات STL، ومقارنة اللغات الثلاث لكل شبكة، ثم «المطلوب» في ص 158 مع تجربة أعطال في المفاتيح.',
 theory:[
  {h:'٢- دائرة ( FBD ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات',ref:'ص 152–155',html:`<p>في FBD كل تلامسات على التوالي تصبح بوابة <b>&amp;</b> (و)، والتوازي يصبح بوابة <b>&gt;=1</b> (أو)، والتلامس المغلق يصبح دائرة نفي صغيرة على المدخل.</p><ul>
   <li><b>Network 1:</b> <span class="ltr">&amp; (I1.4, I1.5, I1.6) → = M0.0</span></li>
   <li><b>Network 2:</b> <span class="ltr">&amp; (I0.0, M0.0) → = M0.1</span></li>
   <li><b>Network 3:</b> <span class="ltr">&gt;=1 (Q5.4, Q5.5)</span> إلى المدخل S للمزمن T1 S_OFFDT، و <span class="ltr">TV = S5T#5S</span>، والمدخل R = M0.1 مع دائرة نفي.</li>
   <li><b>Networks 4–6:</b> <span class="ltr">&amp;1 = &amp;(T1 نفي, SO)</span> ، <span class="ltr">&amp;2 = &amp;(T1, K)</span> ، ثم <span class="ltr">&gt;=1 (&amp;1, &amp;2, SI)</span> ، ثم <span class="ltr">&amp; (M0.1, &gt;=1) → = K</span>.</li>
   <li><b>Network 7:</b> <span class="ltr">&amp;1 = &amp;(Q4.3, I0.6 نفي)</span> ، <span class="ltr">&amp;2 = &amp;(Q4.2, I0.5)</span> ، <span class="ltr">&amp;(M0.1, &gt;=1, Q5.5 نفي) → = Q5.4</span>.</li>
   <li><b>Network 8:</b> <span class="ltr">&amp;1 = &amp;(Q4.1, I0.4 نفي)</span> ، <span class="ltr">&amp;2 = &amp;(Q4.2, I0.7)</span> ، <span class="ltr">&amp;(M0.1, &gt;=1, Q5.4 نفي) → = Q5.5</span>.</li></ul>`},
  {draw:B=>netsHTML(PROG_BOOK,'fbd'),caption:'Network 1–8 بلغة FBD كما في الكتاب',ref:'ص 152–155'},
  {h:'٣- دائرة ( STL ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات',ref:'ص 156–157',html:'<p>في STL: <b>A</b> = و، <b>AN</b> = و-ليس، <b>O</b> وحده في سطر = «أو» بين مجموعتي «و»، <b>A( … )</b> قوس، <b>SF</b> تشغيل مزمن تأخير الفصل، <b>R</b> إلغاء، و <b>NOP 0</b> سطر بلا عمل.</p>'},
  {draw:B=>netsHTML(PROG_BOOK,'stl'),caption:'Network 1–8 بلغة STL كما في الكتاب',ref:'ص 156–157'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> <span class="ltr">SF</span> هو رمز تعليمة مزمن تأخير الفصل في الرموز الألمانية لبرنامج STEP 7 (ويقابله <span class="ltr">SA</span> في الرموز الإنجليزية)، وهو نفس الصندوق S_OFFDT في LAD و FBD. أسطر <span class="ltr">NOP 0</span> الثلاثة يضيفها البرنامج مكان مخارج صندوق المزمن غير المستخدمة (Q و BI و BCD).'},
  {err:'عنوانا FBD (ص 152) و STL (ص 156) يذكران «والعدادات»، ولا يوجد في برنامج المصعد أي عداد؛ يوجد مزمن واحد T1 فقط.'},
  {err:ERR_F13+' في FBD يظهر الخطأ نفسه كدائرة نفي على I0.6 و I0.4 (ص 154–155)، وفي STL كالسطرين <span class="ltr">AN I 0.6</span> و <span class="ltr">AN I 0.4</span> (ص 157).'},
  {h:'مقارنة اللغات الثلاث لكل شبكة',html:'<p>اختر شبكة لترى الشيء نفسه بالطرق الثلاث (برنامج الكتاب):</p>'},
  {widget:(el)=>{let k=7;const draw=()=>{el.innerHTML=`<div class="fig"><div class="seg" role="group">${[1,2,3,4,5,6,7,8].map(n=>`<button data-n="${n}" aria-pressed="${n===k}">N${n}</button>`).join('')}</div>
     <h3 class="sm">LAD</h3>${netsHTML(PROG_BOOK,'lad',[k])}<h3 class="sm">FBD</h3>${netsHTML(PROG_BOOK,'fbd',[k])}<h3 class="sm">STL</h3>${netsHTML(PROG_BOOK,'stl',[k])}</div>`;
     el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{k=+b.dataset.n;draw()})};draw()}},
  {h:'المطلوب',ref:'ص 158',html:'<p>«<b>المطلوب:</b> قم بتنفيذ الدائرة على جهاز الحاسب ثم نقلها إلى وحدة المحاكاة والتأكد من صحة عمل الدائرة.»</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عند تنفيذ المطلوب على جهاز حقيقي ستلاحظ أن برنامج الكتاب كما هو لا يُنزل الكابينة إلى الأول ولا يرفعها إلى الثالث إذا وُصّل F1 و F3 NC كما في الشكل. استخدم النسخة المصححة (A I 0.4 و A I 0.6) أو وصّلهما NO. في المختبر يمكنك أيضاً تجربة عطل «F2 عالق» وفتح مفتاح أمان لاختبار فهمك.'}
 ],
 io:IO9,
 inputs:IN_PLC.concat([{id:'F2X',type:'fault',label:'عطل: F2 عالق على off',resetLabel:'إزالة عطل F2'}]),
 variants:VARIANTS,
 plant:elevPlant(false),
 plcNote:'في تبويب الـ PLC اختر STL وفعّل «تشغيل المسح ببطء» لترى قيمة RLO بعد كل سطر في Network 7 و 8 أثناء الحركة.',
 steps:[
  {t:'اختر النسخة المصححة',x:'المختبر يبدأ بنسخة الكتاب. اختر «المصحح» لتعمل الرحلات كلها.',done:s=>s.variant==='fixed'},
  {t:'رحلة: الثاني ← الأول',x:'اضغط SI1. في STL (Network 8) تابع: A Q 4.1 = 1 و A I 0.4 = 1 ← K5 = 1.',done:s=>s.plant.lastStop===1&&s.plant.dir===0},
  {t:'عطل: F2 عالق',x:'فعّل «عطل: F2 عالق على off» ثم اضغط SI2. يعمل K2 لكن K4 لا يعمل: I0.5 لا يصبح 1 أبداً.',done:s=>s.btn('F2X')&&s.Q('Q4.2')},
  {t:'أزل العطل',x:'اضغط «إزالة عطل F2» ثم اطلب الدور الثاني من جديد: تصعد الكابينة وتقف عند الدور الثاني.',done:s=>!s.btn('F2X')&&s.plant.lastStop===2&&s.plant.dir===0},
  {t:'رحلة: الثاني ← الثالث',x:'اضغط SO3. Network 7: A Q 4.3 و A I 0.6 = 1 ← K4.',done:s=>s.plant.lastStop===3&&s.plant.dir===0},
  {t:'افتح مفتاح أمان',x:'افتح باب الدور الثاني S8. Network 1 يعطي M0.0 = 0 فيصبح M0.1 = 0 وتنطفئ كل المخارج.',done:s=>!s.M('M0.0')},
  {t:'المطلوب (ص 158)',x:'أغلق الباب، وجرّب كل الرحلات بين الأدوار الثلاثة بالنسختين، ودوّن أي الرحلات تفشل في نسخة الكتاب ولماذا.'}
 ],
 quiz:[
  {q:'ماذا تعني البوابة >=1 في FBD؟',o:['و (AND)','أو (OR)','نفي','مزمن'],c:1,e:'>=1: يكفي أن يكون مدخل واحد = 1.'},
  {q:'الدائرة الصغيرة على مدخل I0.6 في FBD (Network 7) تقابل في STL:',o:['A I 0.6','AN I 0.6','O I 0.6','= I 0.6'],c:1,e:'النفي على المدخل = AN.'},
  {q:'في STL ماذا يعني السطر «O» وحده بين مجموعتين؟',o:['نهاية البرنامج','«أو» بين مجموعة «و» قبله ومجموعة «و» بعده','نفي','إلغاء'],c:1,e:'O بلا معامل = أو بين مجموعتي AND (AND-before-OR).'},
  {q:'الأمر SF T 1 في STL يقابل في LAD:',o:['S_ODT','S_PULSE','S_OFFDT','CU'],c:2,e:'SF = مزمن تأخير الفصل S_OFFDT.'},
  {q:'وظيفة السطر AN Q 5.5 في Network 7:',o:['إمساك ذاتي','تعشيق: لا يعمل الصعود إذا كان النزول يعمل','تأخير','أمان الأبواب'],c:1,e:'K4 و K5 لا يعملان معاً.'},
  {q:'عنوانا FBD و STL في الكتاب يذكران «العدادات». كم عداداً في البرنامج؟',o:['واحد','اثنان','ثلاثة','لا يوجد أي عداد'],c:3,e:'البرنامج فيه مزمن واحد T1 ولا عدادات.'},
  {q:'ما «المطلوب» في ص 158؟',o:['حل أسئلة نظرية','تنفيذ الدائرة على الحاسب ثم نقلها إلى وحدة المحاكاة والتأكد من صحة عملها','رسم الدائرة باليد','كتابة تقرير'],c:1,e:'ص 158.'},
  {q:'F2 عالق على off والكابينة عند الدور الأول. ضغطت SI2. ماذا يحدث؟',o:['تصعد وتقف عند الثاني','يعمل K2 ولا تتحرك الكابينة','تنزل','يفصل K0'],c:1,e:'K4 يحتاج K2 و I0.5 (b)، و I0.5 لا يصبح 1 مع العطل.'}
 ]
});

})(PLCBOOK);
