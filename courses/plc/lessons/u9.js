/* Unit 9 — التطبيق على المصعد الكهربائي باستخدام مفاتيح نهاية المشوار (ص 143–158) */
(function(B){
const {S,clamp,W}=B;

/* ================= elevator geometry & switches ================= */
const FL=110, Y1=380, CARH=76;                // floor spacing (px), level of floor 1, car height
const POSMIN=-0.27, POSMAX=2.36, V=0.3;        // pos in floors (0 = floor 1, 2 = floor 3), speed floors/s
const FLN=['الأول','الثاني','الثالث'];
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
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

const VARIANTS={default:'book',note:'<span class="fixnote">الكتاب وصّل F1 و F3 بتلامس NC (ص 146) ثم كتبهما في البرنامج بتلامس NC أيضاً (AN I 0.4 و AN I 0.6). </span>بدّل بين النسختين وجرّب الاستدعاء للدور الأول والثالث.',
  book:{label:'كما في الكتاب',program:PROG_BOOK,note:'<b>كما في الكتاب (ص 151 و 154–157):</b> F1 و F3 موصلان NC فيعطيان 1 والكابينة بعيدة عن الدور، والبرنامج يمرّر فقط عند 0. النتيجة: من الدور الثاني لا ينزل المصعد إلى الأول ولا يصعد إلى الثالث أبداً، ولو كانت الكابينة واقفة عند الدور الأول وضُغط SO1 لنزلت وتجاوزت الدور حتى المخمد. الرحلات عبر F2 (إلى الدور الثاني) فقط تعمل.'},
  fixed:{label:'المصحح',program:PROG_FIX,note:'<span class="fixnote"><b>المصحح:</b> بقي التوصيل NC كما في الشكل ص 146، وغُيّر السطر AN I 0.6 إلى A I 0.6 في Network 7، والسطر AN I 0.4 إلى A I 0.4 في Network 8، بنفس طريقة الكتاب مع S7–S9 و SS (موصلة NC ومكتوبة A). حل بديل مكافئ: إبقاء البرنامج كما هو وتوصيل F1 و F3 بتلامس NO.</span>'}};

const ERR_F13='<b>F1 و F3 (ص 146 مقابل ص 151 و 157):</b> شكل التوصيل يرسم F1 و F3 تلامساً مغلقاً NC، والكتاب يقول إنهما «نقطة واحدة مغلقة»، فيقرأ الـ PLC منهما 1 والكابينة بعيدة عن الدور و 0 عند الوصول. لكن البرنامج يكتبهما بتلامس مغلق أيضاً (<span class="ltr">AN I 0.6</span> و <span class="ltr">AN I 0.4</span>)، فلا يمرّر إلا عندما تكون الكابينة <b>عند</b> الدور، أي عكس المطلوب. لاحظ أن الكتاب نفسه كتب S7–S9 و SS (الموصلة NC) بتلامس مفتوح A، وهذا هو الصحيح. في المختبر يوجد زر للتبديل بين «كما في الكتاب» و«المصحح».';

/* =================== Lesson 9.1 =================== */
B.lesson({
 id:'u9-l1',unit:9,order:1,pages:'143–146',
 title:'فكرة المصعد ومكوناته ومفاتيح نهاية المشوار',
 summary:'مصعد لثلاثة أدوار بمحرك عادي بسرعة واحدة: مكونات دائرة التحكم وعناوينها في الـ PLC، وتوصيل المداخل والمخارج، وكيف تتغير مفاتيح نهاية المشوار F1 و F2 و F3 مع حركة الكابينة.',
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
})())/*DCML-END*/,
  /*PLCML-BEGIN*/(window.PLCML=window.PLCML||(function(){
/* «مختبر مصغّر» لشبكة PLC — يكمّل DCML (يستعمل أنماطه نفسها): تبدّل المداخل وتشاهد الشبكة والمخارج.
   o={intro, prog:[شبكات STL]|()=>[…], run:[أرقام الشبكات التي تُنفَّذ], show:[أرقام الشبكات المرسومة], view:'lad'|'fbd'|'stl', names:{عنوان:رمز},
      ins:[{a:'I0.1', l:'نص', push:true, en:(P)=>متاح؟} | {a, on:'نص عند 1', off:'نص عند 0', v:0|1}],  (عنوان T يُضبط خرجه مباشرة)
      words:[{k:'MW20', l, min, max, step, v}], time:[[ثوانٍ, 'نص الزر']], outs:[[عنوان, 'اسم', (P)=>نص اختياري]],
      predict:{q, opts:[[نص, صحيح؟, السبب]]}, pic:(P,s)=>svg بدل رسم الشبكات, msg:(P,s,t)=>html, note:'html'} */
const q=(el,s)=>el.querySelector(s),qa=(el,s)=>[...el.querySelectorAll(s)];
const ensure=B=>{if(!document.getElementById('dcml-css'))try{DCML.tf(document.createElement('div'),B,{items:[]})}catch(e){}};
const bd=x=>String(x).replace(/<span class="ltr">(.*?)<\/span>/g,'<bdi dir="ltr">$1</bdi>');
const mmss=x=>{x=Math.max(0,Math.round(x));const m=Math.floor(x/60),s=x%60;return m+':'+String(s).padStart(2,'0')};
function net(el,B,o){ensure(B);el.classList.add('ml');
 const prog=typeof o.prog==='function'?o.prog():o.prog;const run=o.run||prog.map((_,i)=>i),show=o.show||run,view=o.view||'lad',names=o.names||{};
 let P,t=0;const s={};
 const put=(a,v)=>{if(a[0]==='T'){const m=P.timer(a);m.q=v?1:0;m.run=0}else P.set(a,v)};
 const apply=()=>{o.ins.forEach(i=>{if(!i.push)put(i.a,s[i.a])});(o.words||[]).forEach(w=>{P.words[w.k]=s['w:'+w.k]})};
 const scan=dt=>{apply();P.dt=dt;run.forEach(i=>P.runNet(i));t+=dt};
 const reset=()=>{P=B.createPLC(prog);t=0;o.ins.forEach(i=>{s[i.a]=i.push?0:(i.v?1:0)});(o.words||[]).forEach(w=>{s['w:'+w.k]=w.v});if(o.init)o.init(P);scan(0.05);scan(0.05);t=0};
 let h=o.intro?`<p class="ml-in">${o.intro}</p>`:'';
 if(o.predict)h+=`<div class="ml-pd"><div class="ml-q"><span class="ml-tag">توقّع أولاً</span>${o.predict.q}</div><div class="ml-pool">${o.predict.opts.map((x,j)=>`<button type="button" class="ml-b" data-pj="${j}">${x[0]}</button>`).join('')}</div><div class="ml-fb" data-pfb hidden></div></div>`;
 h+=`<div class="ml-body${o.predict?' ml-lock':''}"><div class="ml-lbl">${o.inl||'اضغط لتغيير المداخل:'}</div><div class="ml-row" data-ins>${o.ins.map((i,k)=>`<button type="button" class="ml-b" data-k="${k}"></button>`).join('')}</div>`;
 h+=(o.words||[]).map(w=>`<label class="ml-sl"><span class="ml-h"><span>${w.l}</span><b data-wv="${w.k}"></b></span><input type="range" data-w="${w.k}" min="${w.min}" max="${w.max}" step="${w.step||1}" value="${w.v}" aria-label="${String(w.l).replace(/<[^>]+>/g,'')}"></label>`).join('');
 h+=o.time?`<div class="ml-row">${o.time.map(([d,l],k)=>`<button type="button" class="ml-b" data-t="${k}">${l}</button>`).join('')}</div>`:'';
 h+=`<div class="ml-facts" data-outs></div><div data-net></div><div class="ml-fb" data-msg></div>${o.note?`<p class="ml-ill">${o.note}</p>`:''}<div class="ml-row"><button type="button" class="ml-b" data-rs>ابدأ من جديد</button></div></div>`;
 el.innerHTML=h;try{B.math(el)}catch(e){}
 const draw=()=>{
  qa(el,'[data-ins] [data-k]').forEach(b=>{const i=o.ins[+b.dataset.k];if(i.push){b.innerHTML=i.l;b.disabled=!!(i.en&&!i.en(P));return}const v=s[i.a];b.setAttribute('aria-pressed',String(!!v));b.innerHTML=(v?i.on:i.off)||`${i.l} = <span class="ltr">${v}</span>`});
  (o.words||[]).forEach(w=>{q(el,`[data-wv="${w.k}"]`).textContent=s['w:'+w.k]});
  q(el,'[data-outs]').innerHTML=o.outs.map(([a,l,f])=>{const v=P.get(a),tm=a[0]==='T'&&P.tim[a];const rem=tm&&tm.run?` <small>(باقٍ <span class="ltr">${mmss(tm.tv-tm.el)}</span>)</small>`:'';
   return `<div class="${!f&&v?'hi':''}"><span>${bd(l+rem)}</span><b>${f?f(P):v}</b></div>`}).join('')+(o.time?`<div><span>الزمن منذ البداية</span><b>${mmss(t)}</b></div>`:'');
  q(el,'[data-net]').innerHTML=(o.pic?`<div class="svgbox" style="margin-top:10px">${o.pic(P,s)}</div>`:'')+show.map(i=>{const n=P.nets[i];const body=view==='stl'?`<div class="tablebox">${B.stlTable(n,P)}</div>`:`<div class="svgbox fixed">${view==='fbd'?B.fbdNetwork(n,P,names):B.ladNetwork(n,P,names)}</div>`;
   return `<div class="net" style="margin-top:10px"><header><h3>${n.title}</h3></header>${body}</div>`}).join('');
  const m=q(el,'[data-msg]');m.innerHTML=o.msg?o.msg(P,s,t)||'':'';try{if(m.innerHTML)B.math(m)}catch(e){}};
 qa(el,'[data-ins] [data-k]').forEach(b=>b.onclick=()=>{const i=o.ins[+b.dataset.k];
  if(i.push){put(i.a,1);scan(0.1);scan(0.1);put(i.a,0);scan(0.1);scan(0.1)}else{s[i.a]=s[i.a]?0:1;scan(0.1);scan(0.1)}draw()});
 qa(el,'input[data-w]').forEach(inp=>inp.oninput=()=>{s['w:'+inp.dataset.w]=+inp.value;scan(0.1);draw()});
 qa(el,'[data-t]').forEach(b=>b.onclick=()=>{const d=o.time[+b.dataset.t][0];for(let n=Math.round(d/0.1);n>0;n--)scan(0.1);draw()});
 q(el,'[data-rs]').onclick=()=>{reset();qa(el,'input[data-w]').forEach(inp=>inp.value=s['w:'+inp.dataset.w]);draw()};
 if(o.predict){const bs=qa(el,'[data-pj]'),fb=q(el,'[data-pfb]'),body=q(el,'.ml-body');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.pj,op=o.predict.opts[j],ok=!!op[1],right=o.predict.opts.find(x=>x[1]);
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(o.predict.opts[+x.dataset.pj][1]?'ok':x===b?'no':'dim')});
   fb.className='ml-fb'+(ok?'':' warn');fb.innerHTML=`<b>${ok?'توقّعك صحيح.':'ليس هذا.'}</b> ${op[2]||''}${!ok&&right[2]?'<br>'+right[2]:''}<br><b>الآن جرّب بنفسك في الأسفل وتأكد.</b> <button type="button" class="ml-b" data-pr style="min-height:34px;padding:3px 10px">غيّر توقّعك</button>`;fb.hidden=false;try{B.math(fb)}catch(e){}
   body.classList.remove('ml-lock');q(fb,'[data-pr]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true}})}
 reset();draw();return {P:()=>P,draw}}
return {net,mmss};
})())/*PLCML-END*/,{intro:true}),

  {st:1,short:'بيانات الوحدة',title:'بيانات الوحدة: ماذا ستتعلم؟',ref:'ص 143',
   q:'المصعد من أكثر الآلات التي تستعملها كل يوم… فما الذي يلزم الـ PLC ليعرف أين الكابينة وإلى أين يرسلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبنى من ثلاثة أدوار فيه بئر مصعد وكابينة عند الدور الثاني، ومحرك في الأعلى، ووحدة PLC تتحكم فيه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="40" y="56" width="200" height="226" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/><path d="M40 282H240M40 206H240M40 130H240" stroke="#2C4A40" stroke-width="4"/><g data-tip="بئر المصعد: الممر الرأسي الذي تتحرك فيه الكابينة بين الأدوار الثلاثة."><rect x="150" y="56" width="70" height="226" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="الكابينة: تقف الآن عند الدور الثاني. يحرّكها محرك واحد صعوداً أو نزولاً."><rect x="158" y="148" width="54" height="54" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M185 152V198" stroke="#2C4A40" stroke-width="2"/></g><line x1="185" y1="44" x2="185" y2="148" stroke="#2C4A40" stroke-width="2"/><g data-tip="المحرك: في هذه الوحدة محرك عادي بسرعة واحدة، يدور في اتجاه للصعود وفي الاتجاه المعاكس للنزول."><circle cx="185" cy="34" r="16" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="185" y="40" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">M</text></g><text x="95" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الدور الأول</text><text x="95" y="174" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الدور الثاني</text><text x="95" y="98" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الدور الثالث</text><g data-tip="الحاكم المنطقي المبرمج ⟦PLC⟧: يقرأ ضواغط الاستدعاء ومفاتيح الأدوار ومفاتيح الأمان، ويشغّل المحرك صعوداً أو نزولاً حسب البرنامج."><rect x="260" y="140" width="64" height="70" rx="8" fill="#2C4A40"/><text x="292" y="181" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text></g><path d="M260 175H240M292 140V34H201" fill="none" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/></svg>`,
   cap:'مصعد لثلاثة أدوار يتحكم فيه الـ PLC.<br><b>مرّر المؤشر على البئر والكابينة والمحرك والـ PLC (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'الهدف الثاني للوحدة أن تكتب برنامج تشغيل المصعد. ما الذي يجب أن تعرفه قبل ذلك؟',opts:[
     ['طريقة عمل المصعد: كيف يُستدعى، وكيف يعرف الدور، ومتى يقف',true,'لذلك جاء الهدف الأول «أن يعرف المتدرب طريقة عمل المصعد الكهربائي» قبل كتابة البرنامج.'],
     ['طريقة لف ملفات محرك المصعد',false,'الوحدة لا تتناول لف المحركات؛ المحرك هنا محرك عادي نتحكم في اتجاهه فقط.'],
     ['لغة STL وحدها',false,'الوحدة تكتب البرنامج بثلاث لغات، لكن لا تستطيع كتابة أي منها قبل أن تفهم عمل المصعد.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أولا:</b> فكرة عمل المصعد الكهربائي لثلاثة أدوار.</p>
     <p><b>ثانيا:</b> كتابة برنامج عمل المصعد الكهربائي باستخدام ( PLC ) باللغة ( LAD ).</p>
     <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية ( PLC ) في تنفيذ التطبيقات.</p>
     <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة بإذن الله على:</p><ul><li>أن يعرف المتدرب طريقة عمل المصعد الكهربائي.</li><li>أن يكتب المتدرب برنامج تشغيل المصعد الكهربائي.</li></ul>
     <p><b>مستوى الأداء المطلوب:</b> أن يصل المتدرب إلى إتقان هذه الجدارة بإذن الله بنسبة 100٪</p>
     <p><b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج؛ حاسب آلي؛ جهاز عرض ( داتا شو )؛ سبورة؛ كراسة الطالب؛ قلم.</p>
     <p><b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`,ref:'ص 143'},
    {tip:String.raw`<p>الوحدة تسير في خطين: <b>أولاً</b> نفهم المصعد نفسه (مكوناته، ومفاتيح الأدوار، والدائرة التقليدية التي تشغّله)، <b>ثانياً</b> نحوّل هذه الدائرة إلى برنامج. وهذه هي الطريقة نفسها التي اتبعتها في كل الوحدات السابقة: دائرة تقليدية أولاً، ثم برنامج يقوم مقامها.</p>`,title:'خريطة الوحدة'},
    {watch:String.raw`<p>«ثانيا» يذكر لغة <span class="ltr">LAD</span> فقط، لكن الوحدة تقدّم البرنامج بثلاث لغات <span class="ltr">LAD</span> و<span class="ltr">FBD</span> و<span class="ltr">STL</span> (ص 149–157). ستدرسها كلها في الدرسين 9.3 و 9.4.</p>`,fix:true},
    {title:'تحقق سريع: ماذا في الوحدة؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب صفحة بيانات الوحدة (ص 143).',items:[
 ['المصعد في هذه الوحدة لثلاثة أدوار.',true,'«أولا: فكرة عمل المصعد الكهربائي لثلاثة أدوار».'],
 ['أول أهداف الوحدة كتابة البرنامج، ثم فهم طريقة عمل المصعد.',false,'الترتيب في الكتاب: أن يعرف طريقة عمل المصعد، ثم أن يكتب برنامج تشغيله.'],
 [String.raw`يذكر «ثانيا» لغة <span class="ltr">LAD</span> فقط، لكن الوحدة تعرض البرنامج بثلاث لغات.`,true,String.raw`البرنامج مطبوع بلغات <span class="ltr">LAD</span> و<span class="ltr">FBD</span> و<span class="ltr">STL</span> (ص 149–157).`]]})}
   ]},

  {st:2,short:'أنواع التحكم',title:'ثالثاً: تركيب وطريقة عمل المصعد',ref:'ص 144',
   q:'لماذا لا تشعر بهزة عندما يبدأ مصعد حديث بالحركة أو يقف؟ وهل مصعدنا في هذه الوحدة كذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث طرق للتحكم في محرك الكابينة: التحكم في التردد، ومحرك بسرعتين مع مكابح، ومحرك عادي بسرعة واحدة وهو الذي ندرسه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="التحكم في التردد: يتحكم في سرعة المحرك فلا يشعر المستخدم بحركة البدء والتوقف. من أفضل الأنواع لكن دائرته معقدة للمبتدئ."><rect x="56" y="44" width="248" height="66" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M76 77c8-22 16-22 24 0s16 22 24 0" fill="none" stroke="#E8735A" stroke-width="3"/><text x="214" y="84" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">التحكم في التردد</text></g><g data-tip="محرك ذو سرعتين مع مكابح خاصة: كذلك لا يشعر المستخدم بحركة البدء والوقوف."><rect x="56" y="126" width="248" height="66" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="100" cy="159" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="165" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="214" y="166" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">محرك بسرعتين ومكابح</text></g><g data-tip="محرك عادي بسرعة واحدة: أبسط الأنواع، وهو النوع الذي تدرسه هذه الوحدة."><rect x="56" y="208" width="248" height="66" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><circle cx="100" cy="241" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="247" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="214" y="238" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">محرك بسرعة واحدة</text><text x="214" y="259" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">الذي سندرسه</text></g></svg>`,
   cap:'من الأفضل والأعقد (أعلى) إلى الأبسط (أسفل).<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف ما يقوله الكتاب عنها.</b>',
   side:[
    {book:String.raw`<p>إن دوائر التحكم الخاصة بالمصاعد كثيرة ومتنوعة وهي صعبة بعض الشيء خاصة لمن لم يعمل في هذا المجال من قبل، وذلك بسبب وجود عدة أجزاء متصلة بلوحة التحكم ولكنها بعيدة عنها. ولكن مع الممارسة تصبح الدائرة سهلة.</p>`,ref:'ص 144'}
   ],
   body:[
    {book:String.raw`<p>يمكن التحكم في المحرك الخاص بالكبينة بعدة طرق، ومن أهمها التحكم بسرعة المحرك بحيث لا يشعر المستخدم للمصعد بحركة البدء وحركة التوقف، وذلك من خلال التحكم في التردد الخاص بالمحرك؛ وهذا النوع من أفضل الأنواع ولكن الدائرة الخاصة به معقدة بعض الشيء للمبتدئ في عمليات التحكم.</p>
     <p>وهناك نوع يتم التحكم فيه من خلال محرك ذو السرعتين مع مكابح خاصة بحيث لا يشعر المستخدم للمصعد بحركة البدء والوقوف.</p>
     <p>وأبسط هذه الأنواع هو النوع الذي سوف ندرسه، وهو يحتوي على المصعد وعلى محرك عادي بسرعة واحدة.</p>`,ref:'ص 144'},
    {tip:String.raw`<p>المحرك واحد، ويعمل في اتجاه <b>الصعود</b> عن طريق المتمم <span class="ltr">K4</span> وفي اتجاه <b>النزول</b> عن طريق المتمم <span class="ltr">K5</span> (مثل عكس اتجاه الحركة في الوحدة الثانية)، ولذلك لا يجوز أن يعمل <span class="ltr">K4</span> و<span class="ltr">K5</span> معاً. أما المتممات <span class="ltr">K1</span> و<span class="ltr">K2</span> و<span class="ltr">K3</span> فلا تشغّل أحمالاً؛ كل واحد منها «يتذكر» الدور المطلوب.</p>`,title:'مصعدنا في سطرين'},
    {add:String.raw`<p>«أجزاء متصلة بلوحة التحكم ولكنها بعيدة عنها»: لوحة التحكم تكون عادة في غرفة الماكينات أعلى البئر، بينما ضواغط الاستدعاء عند باب كل دور، ومفاتيح الأدوار على جدار البئر، ومفاتيح الأمان على الأبواب. لذلك تمتد من اللوحة أسلاك طويلة إلى كل دور، وهذا ما يجعل تتبّع الدائرة صعباً في البداية.</p>`,title:'لماذا تبدو دائرة المصعد صعبة؟'},
    {predict:{q:'مصعد مستشفى يجب ألا يهتز فيه المريض عند البدء والوقوف. أي نوع من الأنواع التي ذكرها الكتاب أنسب له؟',opts:[
     ['المحرك العادي بسرعة واحدة',false,'هذا أبسط الأنواع، لكن الكتاب لا يذكر أنه يمنع الشعور بحركة البدء والتوقف.'],
     ['التحكم في التردد',true,'الكتاب يصفه بأنه يتحكم في سرعة المحرك «بحيث لا يشعر المستخدم للمصعد بحركة البدء وحركة التوقف» ومن أفضل الأنواع.'],
     ['لا فرق بين الأنواع الثلاثة',false,'الكتاب يفرّق بينها: النوعان الأولان يمنعان الشعور بالبدء والوقوف، والثالث أبسطها.']]}},
    {title:'مختبر مصغّر: أي نوع من التحكم؟',widget:(el,B)=>DCML.sort(el,B,{intro:'الكتاب يذكر ثلاثة أنواع للتحكم في محرك الكبينة. اختر النوع الذي تصفه كل عبارة.',cats:['التحكم في التردد','محرك بسرعتين مع مكابح','محرك عادي بسرعة واحدة'],items:[
 ['من أفضل الأنواع، لكن دائرته معقدة بعض الشيء للمبتدئ.',0,'هكذا يصف الكتاب التحكم بسرعة المحرك من خلال التحكم في التردد.'],
 ['يستعمل مكابح خاصة حتى لا يشعر المستخدم بالبدء والوقوف.',1,'«محرك ذو السرعتين مع مكابح خاصة».'],
 ['هو النوع الذي ندرسه في هذه الوحدة.',2,'«أبسط هذه الأنواع هو النوع الذي سوف ندرسه … محرك عادي بسرعة واحدة».'],
 ['يتحكم في سرعة المحرك فلا يشعر الراكب بحركة البدء والتوقف.',0,'التحكم في السرعة عن طريق التردد هو أول نوع يذكره الكتاب.']]})}
   ]},

  {st:3,short:'جدول المكونات',title:'جدول المكونات الأساسية لدائرة التحكم',ref:'ص 145',
   q:'في المصعد ضواغط عند الأبواب، وضواغط داخل الكابينة، ومفاتيح على جدار البئر… كيف يميّز الـ PLC بينها كلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المداخل على اليسار والمخارج على اليمين ووحدة PLC في الوسط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="66" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المداخل</text><text x="294" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المخارج</text><g data-tip="ضواغط الاستدعاء من خارج الكبينة ⟦SO1, SO2, SO3⟧ — العناوين ⟦I0.1, I0.2, I0.3⟧."><rect x="22" y="62" width="88" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="66" y="85" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SO1–SO3</text></g><g data-tip="ضواغط الاستدعاء من داخل الكبينة ⟦SI1, SI2, SI3⟧ — العناوين ⟦I1.1, I1.2, I1.3⟧."><rect x="22" y="110" width="88" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="66" y="133" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SI1–SI3</text></g><g data-tip="مفاتيح نهاية المشوار لتحديد الوقوف عند الأدوار: ⟦F1 = I0.4⟧ و ⟦F3 = I0.6⟧، و ⟦F2⟧ له عنوانان ⟦I0.5, I0.7⟧."><rect x="22" y="158" width="88" height="36" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="66" y="181" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F1 F2 F3</text></g><g data-tip="مفاتيح الأمان: ⟦SS = I0.0⟧ (غلق الأبواب أو أي مفتاح أمان آخر)، و ⟦S7, S8, S9 = I1.4, I1.5, I1.6⟧ مفتاح أمان لكل دور."><rect x="22" y="206" width="88" height="36" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="66" y="229" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">SS S7–S9</text></g><path d="M110 80H140M110 128H140M110 176H140M110 224H140" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="وحدة ⟦PLC⟧. والمتمم المساعد ⟦K0⟧ لا يخرج إلى أي حمل، فصار داخلها علامة ⟦M0.0⟧."><rect x="140" y="62" width="80" height="180" rx="10" fill="#2C4A40"/><text x="180" y="120" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><rect x="150" y="160" width="60" height="44" rx="6" fill="#FBF6EE"/><text x="180" y="178" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K0</text><text x="180" y="196" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text></g><path d="M220 96H250M220 160H250M220 214H250" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="متممات طلب الأدوار ⟦K1, K2, K3⟧ — العناوين ⟦Q4.1, Q4.2, Q4.3⟧. كل واحد منها يتذكر الدور المطلوب."><rect x="250" y="70" width="88" height="52" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="92" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1 K2 K3</text><text x="294" y="111" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600">طلب الدور</text></g><g data-tip="متمم تشغيل المحرك في اتجاه الصعود ⟦K4⟧ — العنوان ⟦Q5.4⟧."><rect x="250" y="138" width="88" height="44" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="166" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4 ↑</text></g><g data-tip="متمم تشغيل المحرك في اتجاه النزول ⟦K5⟧ — العنوان ⟦Q5.5⟧."><rect x="250" y="192" width="88" height="44" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="220" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K5 ↓</text></g><text x="180" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">لكل عنصر عنوان واحد في الجدول</text></svg>`,
   cap:'المداخل (ضواغط ومفاتيح) تدخل الـ PLC، والمخارج متممات. الألوان تجمع العناصر المتشابهة فقط.<br><b>مرّر المؤشر على كل مجموعة (أو المسها في الجوال) لتعرف عناوينها.</b>',
   side:[
    {predict:{q:'المتمم المساعد K0 في الجدول عنوانه M0.0 وليس Q. لماذا في رأيك؟',opts:[
     ['لأنه مدخل وليس مخرجاً',false,'K0 ليس ضاغطاً ولا مفتاحاً؛ هو متمم يعمل بشرط مفاتيح الأمان.'],
     ['لأنه لا يشغّل أي حمل خارج الـ PLC؛ يكفي أن يكون «متمماً داخلياً»',true,'علامة الذاكرة M تقوم مقام المتمم المساعد داخل البرنامج، ولا تحتاج طرف خرج.'],
     ['لأن الكتاب أخطأ في عنوانه',false,'ليس خطأ؛ البرنامج نفسه يستعمل M0.0 لـ K0 في Network 1 (ص 149).']]}}
   ],
   body:[
    {book:String.raw`<p>والجدول التالي يوضح المكونات الأساسية لدائرة التحكم:</p>`+BOOK_TABLE,ref:'ص 145'},
    {tip:String.raw`<p>اقرأ الجدول في ثلاث مجموعات:</p><ul><li><b>مداخل (I):</b> ضواغط الاستدعاء <span class="ltr">SO</span> من الخارج و<span class="ltr">SI</span> من الداخل، ومفاتيح الأدوار <span class="ltr">F1</span> و<span class="ltr">F2</span> و<span class="ltr">F3</span>، ومفاتيح الأمان <span class="ltr">SS</span> و<span class="ltr">S7</span>–<span class="ltr">S9</span>.</li><li><b>مخارج (Q):</b> متممات طلب الأدوار <span class="ltr">K1</span>–<span class="ltr">K3</span>، ومتمما الصعود <span class="ltr">K4</span> والنزول <span class="ltr">K5</span>.</li><li><b>علامة (M):</b> المتمم المساعد <span class="ltr">K0</span>.</li></ul><p>والمفتاح <span class="ltr">F2</span> وحده له عنوانان (<span class="ltr">I0.5</span> و<span class="ltr">I0.7</span>)، لأن له نقطتين <span class="ltr">a</span> و<span class="ltr">b</span> كما سترى في المحطة الخامسة.</p>`,title:'كيف تقرأ الجدول؟'},
    {predict:{q:'راكب داخل الكابينة ضغط زر الدور الثالث. أي مدخل يتغير؟',opts:[
     [String.raw`<span class="ltr">I0.3</span>`,false,String.raw`<span class="ltr">I0.3</span> هو <span class="ltr">SO3</span>: الاستدعاء من <b>خارج</b> الكبينة عند باب الدور الثالث.`],
     [String.raw`<span class="ltr">I0.6</span>`,false,String.raw`<span class="ltr">I0.6</span> هو <span class="ltr">F3</span>، مفتاح نهاية المشوار عند الدور الثالث، ولا يضغطه الراكب.`],
     [String.raw`<span class="ltr">I1.3</span>`,true,String.raw`ضواغط الداخل <span class="ltr">SI1, SI2, SI3</span> عناوينها <span class="ltr">I1.1, I1.2, I1.3</span>، فزر الدور الثالث من الداخل هو <span class="ltr">SI3 = I1.3</span>.`]]}},
    {watch:String.raw`<p>الجدول يصف <span class="ltr">SS</span> بأنه «مفاتيح أمان غلق الأبواب أو أي مفتاح أمان آخر»، بينما رمزه في <span class="ltr">LAD</span> و<span class="ltr">FBD</span> هو <span class="ltr">STOP</span> وعنوان Network 2 في <span class="ltr">STL</span> هو <span class="ltr">Stop elevator</span>. وهو في شكل التوصيل ضاغط مغلق <span class="ltr">NC</span>. والعلامة <span class="ltr">M0.1</span> المستخدمة في البرنامج غير مذكورة في الجدول.</p>`,fix:true},
    {title:'مختبر مصغّر: مدخل أم مخرج أم علامة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر مجموعة كل عنصر في جدول المكونات (ص 145)، ثم اقرأ عنوانه.',cats:[String.raw`مدخل <span class="ltr">I</span>`,String.raw`مخرج <span class="ltr">Q</span>`,String.raw`علامة <span class="ltr">M</span>`],items:[
 [String.raw`<span class="ltr">SO2</span> ضاغط الاستدعاء عند باب الدور الثاني`,0,String.raw`عنوانه <span class="ltr">I0.2</span>: إشارة تدخل إلى الـ PLC.`],
 [String.raw`<span class="ltr">K4</span> متمم الصعود`,1,String.raw`عنوانه <span class="ltr">Q5.4</span>، وعليه ملف المتمم الذي يشغّل المحرك صعوداً.`],
 [String.raw`<span class="ltr">K0</span> المتمم المساعد`,2,String.raw`عنوانه <span class="ltr">M0.0</span>: لا يشغّل حملاً خارجياً، فتكفيه علامة داخلية.`],
 [String.raw`<span class="ltr">F2</span> مفتاح الدور الثاني`,0,String.raw`مدخل له عنوانان: <span class="ltr">I0.5</span> للنقطة <span class="ltr">b</span> و<span class="ltr">I0.7</span> للنقطة <span class="ltr">a</span>.`],
 [String.raw`<span class="ltr">K2</span> متمم طلب الدور الثاني`,1,String.raw`عنوانه <span class="ltr">Q4.2</span>؛ مخرج حتى لو لم يكن عليه حمل في شكل التوصيل.`],
 [String.raw`<span class="ltr">S8</span> مفتاح أمان الدور الثاني`,0,String.raw`عنوانه <span class="ltr">I1.5</span>.`]]})}
   ]},

  {st:4,short:'توصيل المداخل',title:'شكل توصيل المداخل والمخارج بوحدة PLC',ref:'ص 146',
   q:'باب الدور الأول مغلق ولم يلمس أحد أي ضاغط… هل يصل إلى الـ PLC شيء من مفتاح الباب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مدخلان: ضاغط مفتوح SO1 إلى I0.1 يقرأ 0، ومفتاح مغلق S7 إلى I1.4 يقرأ 1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الخط ⟦24V⟧: منه يأخذ كل عنصر دخل جهده إلى مدخله في الـ ⟦PLC⟧."><rect x="40" y="46" width="280" height="22" fill="transparent"/><path d="M50 58H310" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/></g><text x="34" y="63" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">24V</text><circle cx="110" cy="58" r="4" fill="#2C4A40"/><circle cx="250" cy="58" r="4" fill="#2C4A40"/><g data-tip="⟦SO1⟧: ضاغط استدعاء مفتوح ⟦NO⟧. وهو غير مضغوط لا يمرّر الجهد، فيقرأ المدخل 0."><rect x="80" y="70" width="60" height="80" fill="transparent"/><path d="M110 58V92M110 124V180" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M110 92L96 122" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M103 107H84M84 100V114" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="4 3"/></g><text x="126" y="114" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SO1</text><g data-tip="⟦S7⟧: مفتاح أمان باب الدور الأول، مغلق ⟦NC⟧. والباب مغلق يمرّر الجهد، فيقرأ المدخل 1. إذا فُتح الباب انقطع الجهد."><rect x="220" y="70" width="60" height="80" fill="transparent"/><path d="M250 58V92M250 122V180" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M250 122H262" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M250 92L264 126" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/></g><text x="230" y="114" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S7</text><rect x="50" y="180" width="260" height="70" rx="8" fill="#2C4A40"/><text x="180" y="240" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><g data-tip="المدخل ⟦I0.1⟧ يقرأ 0: لا يصله جهد لأن ⟦SO1⟧ غير مضغوط."><circle cx="110" cy="202" r="9" fill="#9AA5A0" stroke="#FBF6EE" stroke-width="2"/><text x="110" y="228" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1 = 0</text></g><g data-tip="المدخل ⟦I1.4⟧ يقرأ 1: يصله الجهد عبر ⟦S7⟧ المغلق."><circle cx="250" cy="202" r="9" fill="#12855A" stroke="#FBF6EE" stroke-width="2"/><text x="250" y="228" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I1.4 = 1</text></g><text x="110" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">غير مضغوط</text><text x="250" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">الباب مغلق</text></svg>`,
   cap:'جزء من شكل ص 146: المسار البرتقالي = يمر فيه الجهد إلى المدخل. الدائرة الخضراء = المدخل يقرأ 1، والرمادية = يقرأ 0.<br><b>مرّر المؤشر على العنصرين والمدخلين (أو المسها في الجوال) لتعرف السبب.</b>',
   side:[
    {predict:{q:'الباب مغلق ولم يُضغط شيء. ماذا يقرأ المدخل I1.4 (مفتاح الأمان S7)؟',opts:[
     [String.raw`<span class="ltr">0</span>، لأن أحداً لم يلمس المفتاح`,false,'هذا صحيح للضاغط المفتوح NO فقط. S7 موصّل مغلقاً NC.'],
     [String.raw`<span class="ltr">1</span>، لأن S7 مغلق NC فيمرّر الجهد ما دام الباب مغلقاً`,true,'المفتاح المغلق يعطي 1 في حالته العادية، ويصبح 0 عندما يُفتح الباب.'],
     ['لا يمكن معرفة ذلك من شكل التوصيل',false,'شكل ص 146 يرسم S7 مغلقاً بين 24V والمدخل I1.4، فيمكن معرفة قراءته.']]}}
   ],
   body:[
    {book:String.raw`<p>والشكل التالي يوضح توصيل المداخل والمخارج بوحدة الحاكم المنطقي المبرمج PLC</p>`+`<div class="svgbox">${wiringSVG({act:()=>0,F2:'off',Q:()=>0},true).replace(/>(\d+)V</g,'>$1<tspan>V</tspan><')}</div>`,ref:'ص 146'},
    {tip:String.raw`<ul><li>كل عنصر دخل موصول بين الخط <span class="ltr">24V</span> ومدخله.</li><li>ضواغط الاستدعاء <span class="ltr">SO</span> و<span class="ltr">SI</span> مفتوحة <span class="ltr">NO</span>: تعطي <span class="ltr">1</span> عند الضغط فقط.</li><li>بقية المداخل (<span class="ltr">F1</span> و<span class="ltr">F3</span> و<span class="ltr">S7</span> و<span class="ltr">S8</span> و<span class="ltr">S9</span> و<span class="ltr">SS</span>) مغلقة <span class="ltr">NC</span>: تعطي <span class="ltr">1</span> في حالتها العادية و<span class="ltr">0</span> عندما تعمل.</li><li><span class="ltr">F2</span> طرفه المشترك من <span class="ltr">24V</span>، ونقطته <span class="ltr">b</span> إلى <span class="ltr">I0.5</span> ونقطته <span class="ltr">a</span> إلى <span class="ltr">I0.7</span>.</li><li>المخرجان <span class="ltr">Q5.4</span> و<span class="ltr">Q5.5</span> يغذيان ملفي <span class="ltr">K4</span> و<span class="ltr">K5</span> إلى الخط <span class="ltr">0V</span>. أما <span class="ltr">Q4.1</span>–<span class="ltr">Q4.3</span> فلا أحمال عليها في الشكل.</li></ul>`,title:'ماذا ترى في الشكل؟'},
    {add:String.raw`<p>لماذا تُوصل مفاتيح الأمان مغلقة <span class="ltr">NC</span>؟ لأن السلك إذا انقطع أو انفك طرفه يصبح المدخل <span class="ltr">0</span>، فيرى الـ PLC الحالة كأن الباب مفتوح ويوقف المصعد. لو وُصلت مفتوحة لما انتبه أحد لانقطاع السلك، ولاستمر المصعد يعمل والباب مفتوح. هذه قاعدة عامة في دوائر الأمان: <b>العطل يجب أن يقود إلى التوقف</b>.</p>`,title:'من الواقع'},
    {predict:{q:'في الشكل، أي المخارج عليها ملف متمم؟',opts:[
     [String.raw`<span class="ltr">Q4.1</span> و<span class="ltr">Q4.2</span> و<span class="ltr">Q4.3</span> فقط`,false,'هذه متممات طلب الأدوار، وليس عليها أحمال في الشكل.'],
     ['كل المخارج الخمسة',false,'الشكل يرسم ملفين فقط.'],
     [String.raw`<span class="ltr">Q5.4</span> (<span class="ltr">K4</span>) و<span class="ltr">Q5.5</span> (<span class="ltr">K5</span>)`,true,'هما متمما الصعود والنزول اللذان يشغّلان المحرك، فهما وحدهما يحتاجان ملفاً خارج الـ PLC.']]}},
    {title:'مختبر مصغّر: ماذا يقرأ المدخل؟',widget:(el,B)=>DCML.lab(el,B,{
 intro:'اختر العنصر، ثم غيّر حالته، وجرّب أن تقطع سلكه، وراقب ما يقرؤه مدخل الـ PLC.',
 predict:{q:String.raw`الباب مغلق، لكن سلك <span class="ltr">S7</span> انقطع. ماذا يقرأ <span class="ltr">I1.4</span>، وماذا يفهم البرنامج؟`,opts:[
  [String.raw`<span class="ltr">1</span>، فيستمر المصعد يعمل`,false,'المسار إلى المدخل مقطوع، فلا يصل جهد مهما كانت حالة المفتاح.'],
  [String.raw`<span class="ltr">0</span>، فيفهم البرنامج أن الباب مفتوح ويوقف المصعد`,true,String.raw`هذا سبب توصيل مفاتيح الأمان مغلقة <span class="ltr">NC</span>: العطل يقود إلى التوقف.`]]},
 ins:[{k:'e',l:'العنصر',seg:[['so',String.raw`<span class="ltr">SO1</span> ضاغط استدعاء (<span class="ltr">NO</span>)`],['s7',String.raw`<span class="ltr">S7</span> أمان باب الأول (<span class="ltr">NC</span>)`]],v:'s7'},
  {k:'act',sw:true,v:0,on:'الضاغط مضغوط / الباب مفتوح',off:'الضاغط غير مضغوط / الباب مغلق'},
  {k:'cut',sw:true,v:0,on:'السلك مقطوع',off:'السلك سليم'}],
 calc:(s)=>{const no=s.e==='so',bit=s.cut?0:(no?(s.act?1:0):(s.act?0:1)),ad=no?'I0.1':'I1.4';
  const mean=no?(bit?'أحد يطلب الدور الأول':'لا أحد يطلب الدور الأول'):(bit?'الباب مغلق، يُسمح بالحركة':'الباب مفتوح، يقف كل شيء');
  return {facts:[[`المدخل <bdi dir="ltr">${ad}</bdi>`,String(bit),bit?'hi':''],['ما يفهمه البرنامج',bit?'1':'0']],
   msg:String.raw`<b>${mean}.</b> `+(s.cut?(no?String.raw`مع ضاغط <span class="ltr">NO</span> لا يظهر انقطاع السلك: يبدو المدخل كأن أحداً لم يضغط، فلا يُلاحظ العطل إلا عند الاستدعاء.`:String.raw`السلك المقطوع يعطي <span class="ltr">0</span> مثل الباب المفتوح تماماً، فيقف المصعد ويُكتشف العطل فوراً.`):no?String.raw`الضاغط المفتوح <span class="ltr">NO</span> يعطي <span class="ltr">1</span> عند الضغط فقط.`:String.raw`المفتاح المغلق <span class="ltr">NC</span> يعطي <span class="ltr">1</span> في حالته العادية، و<span class="ltr">0</span> عندما يعمل (يُفتح الباب).`),cls:bit?'':'warn'}}})}
   ]},

  {st:5,short:'مفاتيح نهاية المشوار',title:'شرح مفاتيح نهاية المشوار',ref:'ص 146',
   q:'الكابينة تتحرك بين الأدوار… كيف يعرف المصعد أنه وصل إلى الدور المطلوب فيقف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بئر مصعد بثلاثة أدوار، والكابينة تحت الدور الثاني، ومفاتيح F1 و F2 و F3 على الجدار، ومناطق F2 الثلاث: a فوق الدور الثاني و off عنده و b تحته" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="56" y="30" width="96" height="262" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M40 270H56M40 160H56M40 50H56" stroke="#2C4A40" stroke-width="4"/><text x="37" y="274" text-anchor="end" font-size="10" fill="#2C4A40" font-weight="700">الأول</text><text x="37" y="164" text-anchor="end" font-size="10" fill="#2C4A40" font-weight="700">الثاني</text><text x="37" y="54" text-anchor="end" font-size="10" fill="#2C4A40" font-weight="700">الثالث</text><g data-tip="الكابينة: تحت الدور الثاني الآن (بين الأول والثاني)."><rect x="66" y="196" width="62" height="62" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M97 200V254" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="المجرى بمنحنى خاص: مركب بجانب الكابينة. عند الصعود أو النزول تدخل فيه بكرة ذراع مفتاح الدور، فيتغير وضع المفتاح تبعاً لمنحنى المجرى."><path d="M132 186V268" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><path d="M132 206q10 20 0 40" fill="none" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/></g><g data-tip="⟦F3⟧: مفتاح نهاية المشوار للدور الثالث، نقطة واحدة مغلقة ⟦NC⟧ — العنوان ⟦I0.6⟧."><rect x="152" y="40" width="22" height="16" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M152 48L142 54" stroke="#2C4A40" stroke-width="2.5"/></g><text x="180" y="53" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F3</text><g data-tip="⟦F2⟧: مفتاح الدور الثاني، له ثلاثة أوضاع: ⟦off⟧ و ⟦a⟧ و ⟦b⟧. الكابينة تحته الآن فطرفه الرئيسي على ⟦b⟧ ⟦(I0.5)⟧."><rect x="152" y="152" width="22" height="16" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M152 160L142 166" stroke="#2C4A40" stroke-width="2.5"/></g><text x="180" y="165" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F2</text><g data-tip="⟦F1⟧: مفتاح نهاية المشوار للدور الأول، نقطة واحدة مغلقة ⟦NC⟧ — العنوان ⟦I0.4⟧."><rect x="152" y="262" width="22" height="16" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M152 270L142 276" stroke="#2C4A40" stroke-width="2.5"/></g><text x="180" y="275" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F1</text><g data-tip="فوق الدور الثاني: يلامس الطرف الرئيسي لـ ⟦F2⟧ النقطة ⟦a⟧ المتصلة بمتمم النزول ⟦K5⟧ — العنوان ⟦I0.7⟧."><rect x="214" y="78" width="104" height="58" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="266" y="104" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">a</text><text x="266" y="125" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600">فوق الدور الثاني</text></g><g data-tip="عند الدور الثاني: الطرف الرئيسي لـ ⟦F2⟧ على ⟦off⟧، لا يلامس أياً من النقطتين."><rect x="214" y="142" width="104" height="36" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="266" y="166" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">off</text></g><g data-tip="تحت الدور الثاني: يتصل الطرف الرئيسي لـ ⟦F2⟧ بالنقطة ⟦b⟧ المتصلة بطرف متمم الصعود ⟦K4⟧ — العنوان ⟦I0.5⟧."><rect x="214" y="184" width="104" height="58" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="266" y="210" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">b</text><text x="266" y="231" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600">تحت الدور الثاني</text></g></svg>`,
   cap:'المفاتيح الصفراء على جدار البئر، والبطاقات الثلاث أوضاع <span class="ltr">F2</span>. البطاقة الصفراء = الوضع الحالي (الكابينة تحت الدور الثاني).<br><b>مرّر المؤشر على المفاتيح والمجرى والبطاقات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>قبل البدء في شرح الدائرة يجب أن نعلم أن مفتاح نهاية المشوار للدور الأول والثالث ( F1, F3 ) عبارة عن نقطة واحدة مغلقة ( NC ).</p>`,ref:'ص 146'}
   ],
   body:[
    {book:String.raw`<p>أما بالنسبة لمفتاح نهاية المشوار للدور الأوسط ( الدور الثاني ) ( F2 ) فإنه يحتوي على ثلاثة أوضاع. إذا كان طرفه الرئيسي على وضع ( off ) بالنسبة للنقطتين يعني وقوف الكابينة على الدور الثاني؛ فإذا نزلت الكابينة إلى أسفل يتغير وضع المفتاح فيتصل الطرف الرئيسي بالنقطة (b) المتصلة بطرف متمم الصعود. إذا صعدت الكابينة إلى الدور العلوي يتصل هذا المفتاح بتغير وضعه ويصبح الطرف الرئيسي ملامساً للنقطة (a) المتصلة بمتمم النزول.</p>
     <p>ويتغير وضع مفاتيح تحديد وقوف الأدوار بواسطة مجرى بمنحنى خاص مركب بجانب الكابينة، وعند الصعود أو النزول تدخل بكرة ذراع مفتاح الدور داخل المجرى فيتغير وضع المفتاح تبعاً لمنحنى المجرى.</p>`,ref:'ص 146'},
    {tip:String.raw`<p><b>F1 و F3</b> في طرفي البئر: لا يمكن أن تأتي الكابينة إلى الدور الأول إلا نازلة، ولا إلى الثالث إلا صاعدة، فيكفي كلاً منهما نقطة واحدة تُفتح عند الوصول فتوقف الحركة.</p>
     <p><b>F2</b> في الوسط: الكابينة قد تأتيه من أسفل أو من أعلى، فيجب أن «يعرف» أين هي:</p>
     <table class="tt"><thead><tr><th>مكان الكابينة</th><th>وضع <span class="ltr">F2</span></th><th>متصل بفرع</th><th>العنوان الذي يقرأ 1</th></tr></thead><tbody>
     <tr><td>تحت الدور الثاني</td><td class="mono">b</td><td>الصعود <span class="ltr">K4</span></td><td class="mono">I0.5</td></tr>
     <tr><td>عند الدور الثاني</td><td class="mono">off</td><td>لا شيء</td><td>لا شيء</td></tr>
     <tr><td>فوق الدور الثاني</td><td class="mono">a</td><td>النزول <span class="ltr">K5</span></td><td class="mono">I0.7</td></tr></tbody></table>`,title:'لماذا F2 مختلف عن F1 و F3؟'},
    {predict:{q:'الكابينة عند الدور الثالث، وطلب أحد الدور الثاني. F2 الآن على أي وضع، وإلى أين تتحرك الكابينة؟',opts:[
     [String.raw`على <span class="ltr">b</span>، فتصعد`,false,String.raw`<span class="ltr">b</span> هو وضع F2 والكابينة <b>تحت</b> الدور الثاني.`],
     [String.raw`على <span class="ltr">off</span>، فلا تتحرك`,false,String.raw`<span class="ltr">off</span> فقط والكابينة <b>عند</b> الدور الثاني.`],
     [String.raw`على <span class="ltr">a</span> المتصلة بمتمم النزول، فتنزل حتى يعود F2 إلى <span class="ltr">off</span>`,true,'الكابينة فوق الدور الثاني فيلامس F2 النقطة a، والطريق إلى الدور الثاني نزولاً.']]}},
    {watch:String.raw`<p>لا تتعجب من أن النقطة <span class="ltr">b</span> «تحت» الدور الثاني متصلة بمتمم <b>الصعود</b>: الكابينة تحت الدور الثاني، فإذا طُلب الدور الثاني يجب أن <b>تصعد</b> إليه. وكذلك <span class="ltr">a</span> «فوق» الدور الثاني متصلة بمتمم <b>النزول</b>.</p>`},
    {add:String.raw`<p>في المصاعد الحديثة تُستعمل لنفس الغرض حساسات مغناطيسية أو ضوئية بدل المفاتيح الميكانيكية، أو مُرمّز (Encoder) يقيس موضع الكابينة بدقة. لكن الفكرة واحدة: إشارة تخبر لوحة التحكم أين الكابينة الآن.</p>`,title:'في المصاعد الحديثة'},
    {title:'مختبر مصغّر: حرّك الكابينة وراقب المفاتيح',widget:(el,B)=>DCML.lab(el,B,{
 intro:String.raw`اختر مكان الكابينة، وراقب وضع <span class="ltr">F1</span> و<span class="ltr">F2</span> و<span class="ltr">F3</span> في الرسم وما تقرؤه مداخلها.`,
 predict:{q:String.raw`الكابينة بين الدور الأول والدور الثاني. على أي وضع يكون <span class="ltr">F2</span>؟`,opts:[
  [String.raw`<span class="ltr">a</span>`,false,String.raw`<span class="ltr">a</span> للكابينة <b>فوق</b> الدور الثاني.`],
  [String.raw`<span class="ltr">off</span>`,false,String.raw`<span class="ltr">off</span> فقط والكابينة <b>عند</b> الدور الثاني.`],
  [String.raw`<span class="ltr">b</span> المتصلة بمتمم الصعود`,true,'الكابينة تحت الدور الثاني، فإذا طُلب الدور الثاني يجب أن تصعد.']]},
 ins:[{k:'p',l:'مكان الكابينة',seg:[[0,'عند الأول'],[0.5,'بين الأول والثاني'],[1,'عند الثاني'],[1.5,'بين الثاني والثالث'],[2,'عند الثالث']],v:1}],
 calc:(s)=>{const pos=+s.p,F1a=pos<=0.005,F3a=pos>=1.995,F2=Math.abs(pos-1)<0.03?'off':(pos<1?'b':'a');
  return {pic:`<div style="max-width:230px;margin-inline:auto">${shaftSVG({pos,K:[0,0,0],doors:[0,0,0],F1a,F3a,F2})}</div>`,
   facts:[[DCML.lt('F1 (I0.4)'),F1a?'0':'1',F1a?'':'hi'],[DCML.lt('F2 b (I0.5)'),F2==='b'?'1':'0',F2==='b'?'hi':''],[DCML.lt('F2 a (I0.7)'),F2==='a'?'1':'0',F2==='a'?'hi':''],[DCML.lt('F3 (I0.6)'),F3a?'0':'1',F3a?'':'hi']],
   msg:F1a?String.raw`عند الدور الأول يُفتح <span class="ltr">F1</span> (<span class="ltr">NC</span>) فيقرأ مدخله <span class="ltr">0</span>.`:F3a?String.raw`عند الدور الثالث يُفتح <span class="ltr">F3</span> فيقرأ مدخله <span class="ltr">0</span>.`:F2==='off'?String.raw`عند الدور الثاني طرف <span class="ltr">F2</span> الرئيسي على <span class="ltr">off</span>: لا يلامس <span class="ltr">a</span> ولا <span class="ltr">b</span>.`:F2==='b'?String.raw`تحت الدور الثاني: <span class="ltr">F2</span> على <span class="ltr">b</span> (فرع الصعود <span class="ltr">K4</span>).`:String.raw`فوق الدور الثاني: <span class="ltr">F2</span> على <span class="ltr">a</span> (فرع النزول <span class="ltr">K5</span>).`}}})}
   ]},

  {recap:[
   String.raw`مصعد الوحدة أبسط الأنواع: محرك عادي بسرعة واحدة، يشغّله <span class="ltr">K4 (Q5.4)</span> صعوداً و<span class="ltr">K5 (Q5.5)</span> نزولاً (ص 144–145).`,
   String.raw`<span class="ltr">K1</span>–<span class="ltr">K3</span> (<span class="ltr">Q4.1</span>–<span class="ltr">Q4.3</span>) تتذكر الدور المطلوب، و<span class="ltr">K0</span> متمم مساعد صار العلامة <span class="ltr">M0.0</span> (جدول ص 145).`,
   String.raw`الاستدعاء من الخارج <span class="ltr">SO1</span>–<span class="ltr">SO3</span> (<span class="ltr">I0.1</span>–<span class="ltr">I0.3</span>) ومن الداخل <span class="ltr">SI1</span>–<span class="ltr">SI3</span> (<span class="ltr">I1.1</span>–<span class="ltr">I1.3</span>).`,
   String.raw`مفاتيح الأمان و<span class="ltr">F1</span> و<span class="ltr">F3</span> موصلة مغلقة <span class="ltr">NC</span>: تقرأ 1 في حالتها العادية و0 عندما تعمل (ص 146).`,
   String.raw`<span class="ltr">F2</span> له ثلاثة أوضاع: <span class="ltr">off</span> عند الدور الثاني، و<span class="ltr">b</span> (<span class="ltr">I0.5</span>، فرع الصعود) تحته، و<span class="ltr">a</span> (<span class="ltr">I0.7</span>، فرع النزول) فوقه، ويغيّرها مجرى بمنحنى خاص بجانب الكابينة (ص 146).`]}
],
 theory:[
  {h:'بيانات الوحدة',ref:'ص 143',html:`<ul><li><b>أولاً:</b> فكرة عمل المصعد الكهربائي لثلاثة أدوار.</li><li><b>ثانياً:</b> كتابة برنامج عمل المصعد الكهربائي باستخدام ( PLC ) باللغة ( LAD ).</li></ul>
   <p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية ( PLC ) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على: أن يعرف طريقة عمل المصعد الكهربائي، وأن يكتب برنامج تشغيل المصعد الكهربائي.</p>
   <p><b>مستوى الأداء المطلوب:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'«ثانياً» يذكر لغة LAD فقط، لكن الوحدة تقدّم البرنامج بثلاث لغات LAD و FBD و STL (ص 149–157).'+'</div>'},
  {h:'ثالثاً: تركيب وطريقة عمل المصعد',ref:'ص 144',html:`<p>«إن دوائر التحكم الخاصة بالمصاعد كثيرة ومتنوعة وهي صعبة بعض الشيء خاصة لمن لم يعمل في هذا المجال من قبل، وذلك بسبب وجود عدة أجزاء متصلة بلوحة التحكم ولكنها بعيدة عنها. ولكن مع الممارسة تصبح الدائرة سهلة.»</p>
   <p>طرق التحكم في محرك الكبينة كما يذكرها الكتاب:</p><ol><li><b>التحكم في التردد:</b> التحكم بسرعة المحرك بحيث لا يشعر المستخدم بحركة البدء والتوقف. من أفضل الأنواع لكن دائرته معقدة للمبتدئ.</li><li><b>محرك بسرعتين مع مكابح خاصة:</b> كذلك لا يشعر المستخدم بحركة البدء والوقوف.</li><li><b>أبسط الأنواع — وهو الذي سندرسه:</b> مصعد بمحرك عادي بسرعة واحدة.</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المحرك واحد، ويعمل في اتجاه الصعود عن طريق المتمم K4 وفي اتجاه النزول عن طريق المتمم K5 (مثل عكس الحركة في الوحدة الثانية)، ولذلك لا يجوز أن يعمل K4 و K5 معاً. المتممات K1 و K2 و K3 لا تشغّل أحمالاً؛ كل واحد منها «يتذكر» الدور المطلوب.'},
  {h:'جدول المكونات الأساسية لدائرة التحكم',ref:'ص 145',html:'<p>«والجدول التالي يوضح المكونات الأساسية لدائرة التحكم:»</p>'+BOOK_TABLE},
  {note:'<b>توضيح:</b> في جداول المحاكاة الحية فصلنا الصفوف المجمّعة إلى صف لكل عنوان (SO1 = I0.1 … و F2: النقطة b = I0.5 والنقطة a = I0.7 كما في البرنامج)، وأضفنا M0.1 المستخدمة في البرنامج وغير المذكورة في الجدول.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الجدول يصف SS بأنه «مفاتيح أمان غلق الأبواب أو أي مفتاح أمان آخر»، بينما رمزه في LAD و FBD هو «STOP» وعنوان Network 2 في STL هو «Stop elevator». وهو في شكل التوصيل ضاغط مغلق NC.'+'</div>'},
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>تسمية اليسار واليمين في F2:</b> في الشكلين (ص 144 و 146) النقطة <b>b</b> على اليسار (جهة K4 الصعود) و <b>a</b> على اليمين (جهة K5 النزول). لكن نص ص 147 يسمي النقطة التي يلامسها F2 فوق الدور الثاني «النقطة اليسرى»، وهي حسب ص 146 النقطة a (اليمنى في الرسم). المعتمد هنا: فوق الدور الثاني = a، تحته = b.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+ERR_F13+' (التفاصيل في الدرس 9.3).'+'</div>'}
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
  const act0=id=>{const p={pos:s.pos/100};if(id==='F1')return atF1(p);if(id==='F3')return atF3(p);if(s.sw[id]!==undefined)return s.sw[id];return s.btn[id]?1:0};
  /* أعطال مخفية: تلامس مفتوح دائماً (مفتاح نهاية F1 أو مفتاح باب S8 أو ضاغط الطوارئ SS) أو ضاغط مقصور (SO2)، وذراع F2 عالق على b */
  const FX={F1:'f1open',S8:'s8open',SS:'ssopen',SO2:'so2short'};
  const act=id=>FX[id]&&chF(FX[id])?1:act0(id),f2of=p=>chF('f2b')?'b':f2pos(p);
  function bitsOf(){const p={pos:s.pos/100},f=f2of(p),b={};WIN.forEach(([id,ad,ty])=>{if(ty==='f2')b[ad]=f===(id==='F2b'?'b':'a')?1:0;else{const a=act(id)?1:0;b[ad]=ty==='no'?a:1-a}});return b}
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
  function render(){const p={pos:s.pos/100},f=f2of(p);
    q('#l91shaft').innerHTML=`<div class="svgbox" style="margin-top:0;max-width:260px;margin-inline:auto">${shaftSVG({pos:p.pos,K:[0,0,0],doors:[s.sw.S7,s.sw.S8,s.sw.S9],F1a:atF1(p),F3a:atF3(p),F2:f,crash:''})}</div><p class="sub" style="text-align:center">${floorTxt(p.pos)}</p>`;
    q('#l91wire').innerHTML=`<div class="svgbox">${wiringSVG({act,F2:f,Q:()=>0},true)}</div>`;
    q('#l91facts').innerHTML=`<div class="facts"><div class="fact"><span>F1 → I0.4</span><b>${act('F1')?'0':'1'}</b></div><div class="fact"><span>F2 → I0.5 / I0.7</span><b>${f==='b'?'1 / 0':f==='a'?'0 / 1':'0 / 0'}</b></div><div class="fact"><span>F3 → I0.6</span><b>${act('F3')?'0':'1'}</b></div><div class="fact"><span>SS → I0.0</span><b>${act('SS')?'0':'1'}</b></div></div>`;
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
 stations:[
  {intro:true},

  {st:1,short:'دائرة التحكم',title:'رابعاً: دائرة التحكم في مصعد لثلاثة أدوار',ref:'ص 144',
   q:'باب أحد الأدوار مفتوح وضغط أحدهم زر الاستدعاء… أي جزء في الدائرة يمنع المصعد من الحركة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط مبسط لأجزاء دائرة المصعد: مفاتيح الأمان تشغّل K0، ثم SS و K0 يغذيان النقطة X، ومنها ثلاثة أجزاء: المزمن T1، ومتممات الطلب K1 إلى K3، ومتمما الصعود والنزول K4 و K5" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M30 30H330" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><text x="24" y="35" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">L1</text><path d="M30 290H330" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><text x="24" y="295" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N</text><path d="M90 30V48M90 88V106M260 30V48M260 88V112M90 134V290" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="مفاتيح الأمان ⟦S7⟧ و ⟦S8⟧ و ⟦S9⟧ على التوالي، مغلقة ⟦NC⟧. إذا فُتح أي منها لا يعمل ⟦K0⟧."><rect x="40" y="48" width="100" height="40" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="90" y="74" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">S7 S8 S9</text></g><g data-tip="ملف المتمم المساعد ⟦K0⟧: يعمل فقط إذا كانت مفاتيح الأمان الثلاثة مغلقة."><rect x="68" y="106" width="44" height="28" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="90" y="125" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K0</text></g><g data-tip="الضاغط ⟦SS⟧ (مغلق ⟦NC⟧) ثم تلامس ⟦K0⟧ المفتوح: معاً يغذيان النقطة ⟦X⟧. إذا ضُغط ⟦SS⟧ أو فصل ⟦K0⟧ انقطعت التغذية عن بقية الدائرة."><rect x="210" y="48" width="100" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="74" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SS · K0</text></g><g data-tip="النقطة ⟦X⟧ (تسمية منّا للتوضيح): خط التغذية المشترك الذي تأخذ منه بقية فروع الدائرة."><circle cx="260" cy="124" r="13" fill="#2C4A40"/><text x="260" y="129" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">X</text></g><path d="M260 137V160M150 160H316M150 160V190M220 160V190M290 160V190" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="فرع المزمن ⟦T1⟧: يعمل إذا عمل ⟦K4⟧ أو ⟦K5⟧، أي أثناء حركة الكابينة."><rect x="122" y="190" width="56" height="62" rx="8" fill="#E6E2F8" stroke="#2C4A40" stroke-width="2.5"/><text x="150" y="216" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="150" y="238" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600">مزمن</text></g><g data-tip="فروع طلب الأدوار ⟦K1⟧ و ⟦K2⟧ و ⟦K3⟧: كل فرع يعمل بضاغط الخارج ⟦SO⟧ أو الداخل ⟦SI⟧، ويُمسك نفسه عن طريق تلامس ⟦T1⟧."><rect x="190" y="190" width="60" height="62" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="220" y="216" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1 K2 K3</text><text x="220" y="238" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600">طلب الدور</text></g><g data-tip="فرعا الحركة: ⟦K4⟧ للصعود و ⟦K5⟧ للنزول، وفي كل فرع تلامس مغلق من الآخر حتى لا يعملا معاً."><rect x="262" y="190" width="56" height="62" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="216" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4 ↑</text><text x="290" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K5 ↓</text></g><path d="M150 252V290M220 252V290M290 252V290" stroke="#2C4A40" stroke-width="2.5"/></svg>`,
   cap:'مخطط مبسط (من إعدادنا) لأجزاء الدائرة: الأمان أولاً، ثم التغذية، ثم الفروع الثلاثة.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'باب الدور الثاني مفتوح (S8 مفتوح) وضغط راكب SI1. ماذا يحدث؟',opts:[
     ['يعمل K1 فقط ولا يتحرك المحرك',false,'K1 نفسه يأخذ تغذيته من النقطة X، و X لا تتغذى إلا بتلامس K0.'],
     ['لا يعمل أي شيء، لأن K0 لا يعمل فتنقطع التغذية عن النقطة X',true,'S8 على التوالي مع ملف K0، فإذا فُتح فصل K0 وانقطعت التغذية عن كل الفروع.'],
     ['تنزل الكابينة إلى الدور الأول',false,'هذا لو كانت كل الأبواب مغلقة؛ مفتاح أمان واحد مفتوح يوقف الدائرة كلها.']]}}
   ],
   body:[
    {book:String.raw`<p><b>رابعاً: دائرة التحكم في مصعد لثلاثة أدوار</b></p>`+`<div class="svgbox ctrlbox">${hwSVG(HW_IDLE,false)}</div>`,ref:'ص 144'},
    {tip:String.raw`<p>الدائرة بين الخط <span class="ltr">L1</span> (أعلى) والخط <span class="ltr">N</span> (أسفل). سمّينا النقطة بعد تلامس <span class="ltr">K0</span> «النقطة <span class="ltr">X</span>». الفروع من اليسار:</p><ol>
     <li><b>فرع <span class="ltr">K0</span>:</b> <span class="ltr">S7</span> ← <span class="ltr">S8</span> ← <span class="ltr">S9</span> (كلها مغلقة) ← ملف <span class="ltr">K0</span>.</li>
     <li><b>التغذية:</b> <span class="ltr">SS</span> (ضاغط مغلق) ← تلامس <span class="ltr">K0</span> المفتوح ← النقطة <span class="ltr">X</span>.</li>
     <li><b>فرع المزمن:</b> [<span class="ltr">K4</span> ∥ <span class="ltr">K5</span>] ← ملف <span class="ltr">T1</span>.</li>
     <li><b>فروع <span class="ltr">K1</span> و<span class="ltr">K2</span> و<span class="ltr">K3</span>:</b> [ (<span class="ltr">T1</span> مغلق ← <span class="ltr">SO</span>) ∥ (<span class="ltr">T1</span> مفتوح ← تلامس الإمساك <span class="ltr">K</span>) ∥ <span class="ltr">SI</span> ] ← الملف.</li>
     <li><b>فرع الصعود <span class="ltr">U ↑</span>:</b> [ (<span class="ltr">K3</span> ← <span class="ltr">F3</span> مغلق) ∥ (<span class="ltr">K2</span> ← <span class="ltr">F2</span> النقطة <span class="ltr">b</span>) ] ← <span class="ltr">K5</span> مغلق ← ملف <span class="ltr">K4</span>.</li>
     <li><b>فرع النزول <span class="ltr">D ↓</span>:</b> [ (<span class="ltr">K1</span> ← <span class="ltr">F1</span> مغلق) ∥ (<span class="ltr">K2</span> ← <span class="ltr">F2</span> النقطة <span class="ltr">a</span>) ] ← <span class="ltr">K4</span> مغلق ← ملف <span class="ltr">K5</span>.</li></ol>`,title:'اقرأ الدائرة فرعاً فرعاً'},
    {tip:String.raw`<p>في الرسم تلامس واحد <span class="ltr">T1</span> مغلق يغذي خطاً أفقياً إلى <span class="ltr">SO1</span> و<span class="ltr">SO2</span> و<span class="ltr">SO3</span>، وتلامس واحد <span class="ltr">T1</span> مفتوح يغذي خطاً أفقياً إلى تلامسات الإمساك <span class="ltr">K1</span> و<span class="ltr">K2</span> و<span class="ltr">K3</span>، وخط ثالث مباشر من <span class="ltr">X</span> يغذي <span class="ltr">SI1</span> و<span class="ltr">SI2</span> و<span class="ltr">SI3</span>. أما <span class="ltr">F2</span> فطرفه الرئيسي بعد تلامس <span class="ltr">K2</span>، ونقطته <span class="ltr">b</span> إلى فرع <span class="ltr">K4</span> ونقطته <span class="ltr">a</span> إلى فرع <span class="ltr">K5</span>.</p>`,title:'ثلاثة خطوط أفقية'},
    {predict:{q:'لماذا يوجد تلامس K5 مغلق في فرع ملف K4، وتلامس K4 مغلق في فرع ملف K5؟',opts:[
     ['للإمساك الذاتي بعد ترك الضاغط',false,'الإمساك في هذه الدائرة يتم في فروع K1–K3 عن طريق تلامس T1 المفتوح.'],
     ['لتأخير بدء الحركة',false,'التأخير وظيفة المزمن T1، وليس التلامسات المغلقة.'],
     ['للتعشيق: K4 و K5 يشغلان المحرك نفسه في اتجاهين متعاكسين، فلا يجوز أن يعملا معاً',true,'إذا عمل أحدهما فتح تلامسه المغلق في فرع الآخر فلا يستطيع الآخر أن يعمل.']]}},
    {watch:String.raw`<p>اسم «النقطة <span class="ltr">X</span>» من عندنا للتوضيح وليس في الكتاب. وقيمة زمن <span class="ltr">T1</span> غير مذكورة في الدائرة التقليدية؛ البرنامج في ص 149 يستخدم <span class="ltr">S5T#5S</span>.</p>`},
    {title:'مختبر مصغّر: من يغذي بقية الدائرة؟',widget:(el,B)=>DCML.lab(el,B,{
 intro:String.raw`أول فرعين في الدائرة: مفاتيح الأمان <span class="ltr">S7</span> و<span class="ltr">S8</span> و<span class="ltr">S9</span> على التوالي مع ملف <span class="ltr">K0</span>، ثم <span class="ltr">SS</span> مع تلامس <span class="ltr">K0</span> إلى «النقطة <span class="ltr">X</span>» التي تأخذ منها كل الفروع الأخرى تغذيتها.`,
 predict:{q:String.raw`الأبواب كلها مغلقة، وضغط أحدهم <span class="ltr">SS</span>. ماذا يحدث؟`,opts:[
  [String.raw`يفصل <span class="ltr">K0</span>`,false,String.raw`ملف <span class="ltr">K0</span> يتغذى من <span class="ltr">S7</span>–<span class="ltr">S9</span> فقط، و<span class="ltr">SS</span> ليس في فرعه.`],
  [String.raw`يبقى <span class="ltr">K0</span> يعمل، لكن تنقطع التغذية عن النقطة <span class="ltr">X</span> فيقف كل شيء`,true,String.raw`<span class="ltr">SS</span> على التوالي مع تلامس <span class="ltr">K0</span> قبل النقطة <span class="ltr">X</span>.`],
  ['لا يحدث شيء، لأن الأبواب مغلقة',false,String.raw`<span class="ltr">SS</span> مفتاح أمان مستقل عن الأبواب.`]]},
 ins:[{k:'d1',sw:true,v:1,on:String.raw`باب الأول مغلق (<span class="ltr">S7</span>)`,off:String.raw`باب الأول مفتوح (<span class="ltr">S7</span>)`},
  {k:'d2',sw:true,v:1,on:String.raw`باب الثاني مغلق (<span class="ltr">S8</span>)`,off:String.raw`باب الثاني مفتوح (<span class="ltr">S8</span>)`},
  {k:'d3',sw:true,v:1,on:String.raw`باب الثالث مغلق (<span class="ltr">S9</span>)`,off:String.raw`باب الثالث مفتوح (<span class="ltr">S9</span>)`},
  {k:'ss',sw:true,v:0,on:String.raw`<span class="ltr">SS</span> مضغوط`,off:String.raw`<span class="ltr">SS</span> غير مضغوط`}],
 calc:(s)=>{const k0=s.d1&&s.d2&&s.d3,x=k0&&!s.ss;
  return {facts:[[DCML.lt('K0'),k0?'1':'0',k0?'hi':''],['النقطة X',x?'1':'0',x?'hi':'bad']],cls:x?'':'warn',
   msg:x?'النقطة X عليها جهد: يمكن أن تعمل متممات الأدوار والصعود والنزول.':!k0?String.raw`باب مفتوح: لا يعمل <span class="ltr">K0</span>، و«جميع أجزاء الدائرة لا تعمل» كما في الملاحظة 1.`:String.raw`<span class="ltr">K0</span> يعمل، لكن <span class="ltr">SS</span> فتح الطريق إلى النقطة <span class="ltr">X</span>: لا تعمل أي فروع بعدها.`}}})}
   ]},

  {st:2,short:'خطوات التشغيل',title:'خطوات تشغيل الدائرة',ref:'ص 147',
   q:'الكابينة تصعد من الدور الأول إلى الثالث وتمر على الدور الثاني… لماذا لا تقف عنده؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث رحلات في خطوات التشغيل: من الدور الثاني إلى الأول، ومن الأول إلى الثالث، ومن الثالث إلى الثاني" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="56" y="40" width="70" height="240" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M40 280H142M40 200H142M40 120H142" stroke="#2C4A40" stroke-width="4"/><text x="91" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الأول</text><text x="91" y="170" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الثاني</text><text x="91" y="90" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الثالث</text><g data-tip="الخطوة 1: من الدور الثاني إلى الأول. ⟦SO1⟧ أو ⟦SI1⟧ ← ⟦K1⟧ ← ⟦K5⟧ نزول، وتقف عند ⟦F1⟧."><rect x="150" y="150" width="56" height="140" fill="transparent"/><path d="M178 166V256" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="178,272 168,252 188,252" fill="#E8735A"/><circle cx="178" cy="166" r="12" fill="#E8735A"/><text x="178" y="171" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text></g><g data-tip="الخطوة 2: من الدور الأول إلى الثالث. ⟦SO3⟧ أو ⟦SI3⟧ ← ⟦K3⟧ ← ⟦K4⟧ صعود، تمر على ⟦F2⟧ ولا تقف، وتقف عند ⟦F3⟧."><rect x="214" y="70" width="56" height="220" fill="transparent"/><path d="M242 260V82" stroke="#12855A" stroke-width="5" stroke-linecap="round"/><polygon points="242,66 232,86 252,86" fill="#12855A"/><circle cx="242" cy="260" r="12" fill="#12855A"/><text x="242" y="265" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text></g><g data-tip="الخطوة 3: من الدور الثالث إلى الثاني. ⟦SO2⟧ أو ⟦SI2⟧ ← ⟦K2⟧ ← ⟦K5⟧ عبر ⟦F2⟧ على النقطة ⟦a⟧، وتقف عندما يعود ⟦F2⟧ إلى ⟦off⟧."><rect x="278" y="70" width="56" height="140" fill="transparent"/><path d="M306 86V176" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><polygon points="306,192 296,172 316,172" fill="#2C4A40"/><circle cx="306" cy="86" r="12" fill="#2C4A40"/><text x="306" y="91" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3</text></g></svg>`,
   cap:'كل سهم رحلة من رحلات الكتاب الثلاث، والرقم رقم الخطوة.<br><b>مرّر المؤشر على كل سهم (أو المسه في الجوال) لتعرف تسلسل المتممات في الرحلة.</b>',
   side:[
    {predict:{q:'الكابينة عند الدور الثاني وضغط أحدهم SO1. أي متممين يعملان بالترتيب؟',opts:[
     ['K3 ثم K4',false,'K3 و K4 للطلب إلى الدور الثالث والصعود.'],
     ['K1 ثم K5',true,'SO1 يشغّل K1 (طلب الدور الأول)، و K1 يشغّل K5 (النزول) عبر F1 المغلق.'],
     ['K1 ثم K4',false,'الدور الأول تحت الكابينة، فالحركة نزول (K5) وليست صعوداً.']]}}
   ],
   body:[
    {book:String.raw`<p>1- بفرض أن الكابينة تقف في الدور الثاني. فإذا كنت تريد استدعاء الكابينة للدور الأول يتم الضغط على المفتاح ( SO1 ) من خارج الكبينة أو على المفتاح ( SI1 ) من داخل الكبينة، فيصل التيار إلى المتمم ( K1 ).</p>
     <p>ملاحظة: جميع مفاتيح الأمان في حالة غلق من أجل تشغيل المتمم المساعد لعمل الدائرة.</p>
     <p>وبالتالي يصل التيار إلى المتمم ( K5 ) فتبدأ الكابينة بالنزول تاركة ( F2 ) في حالة توصيل مع النقطة المتصلة مع ملف المتمم ( K4 )، وتستمر الكابينة بالنزول حتى تصل إلى مفتاح نهاية المشوار ( F1 ) فتفصل وتقف الكابينة عند الدور الأول.</p>`,ref:'ص 147'},
    {book:String.raw`<p>2- في حالة الصعود للدور الثالث فعند الضغط على مفتاح التشغيل ( SO3 ) أو ( SI3 ) يصل التيار إلى المتمم ( K3 ) وبالتالي يصل التيار إلى المتمم ( K4 ) وتبدأ الكابينة بالصعود تاركة مفتاح الدور الأول ( F1 ) ليعود إلى وضع مغلق، وتستمر بالصعود فتمر على مفتاح الدور الثاني ( F2 ) فيتغير من وضع فصل وتستمر الكابينة بالصعود تاركة المفتاح ( F2 ) وقد وصل طرفه الرئيس بالنقطة اليسرى، ولا يحدث أي شيء بالنسبة لتغير وضع مفتاح الدور الثاني ( F2 ) لأن التيار وصل إلى المتمم ( K4 ) من خلال المتمم ( K3 ). وتستمر الكابينة في الصعود حتى تصل إلى الدور الثالث فيتغير مفتاح نهاية المشوار ( F3 ) ويفصل التيار عن المتمم ( K4 ) ويقف المصعد عند الدور الثالث.</p>`,ref:'ص 147'},
    {book:String.raw`<p>3- إذا أردت النزول إلى الدور الثاني يتم الضغط على المفتاح ( SO2 ) أو ( SI2 ) فيصل التيار إلى المتمم ( K2 ) وتغلق نقاطه ليصل التيار إلى المتمم ( K5 ) فتبدأ الكابينة بالنزول تاركة المفتاح ( F3 ) مغلقاً، وتستمر بالنزول وعند الدور الثاني يتغير وضع المفتاح ( F2 ) فيفصل النقاط اليسرى فينقطع التيار عن المتمم ( K5 ) وتقف الكابينة عند الدور الثاني.</p>`,ref:'ص 147'},
    {title:'تابع الرحلة حلقة بعد حلقة',widget:(el,B)=>{
      const T={1:{l:'الخطوة 1: من الثاني إلى الأول',c:['ضغط <span class="ltr">SO1</span> أو <span class="ltr">SI1</span>','يعمل <span class="ltr">K1</span>','يعمل <span class="ltr">K5</span> عبر <span class="ltr">F1</span> المغلق','تنزل الكابينة ويصبح <span class="ltr">F2</span> على <span class="ltr">b</span>','تصل الدور الأول: يُفتح <span class="ltr">F1</span>','يفصل <span class="ltr">K5</span> وتقف الكابينة']},
        2:{l:'الخطوة 2: من الأول إلى الثالث',c:['ضغط <span class="ltr">SO3</span> أو <span class="ltr">SI3</span>','يعمل <span class="ltr">K3</span>','يعمل <span class="ltr">K4</span> عبر <span class="ltr">F3</span> المغلق','تصعد ويعود <span class="ltr">F1</span> مغلقاً','تمر على <span class="ltr">F2</span> ولا تقف: <span class="ltr">K4</span> يأخذ التيار عبر <span class="ltr">K3</span>','تصل الثالث: يُفتح <span class="ltr">F3</span> فيفصل <span class="ltr">K4</span> وتقف']},
        3:{l:'الخطوة 3: من الثالث إلى الثاني',c:['ضغط <span class="ltr">SO2</span> أو <span class="ltr">SI2</span>','يعمل <span class="ltr">K2</span>','يعمل <span class="ltr">K5</span> عبر <span class="ltr">F2</span> على <span class="ltr">a</span>','تنزل ويبقى <span class="ltr">F3</span> مغلقاً','عند الدور الثاني يصبح <span class="ltr">F2</span> على <span class="ltr">off</span>','ينقطع التيار عن <span class="ltr">K5</span> وتقف']}};
      let k=1,tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const c=T[k].c;
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg">${[1,2,3].map(n=>`<button type="button" data-k="${n}" aria-pressed="${n===k}">${T[n].l}</button>`).join('')}</span></div>
         <div class="chain">${c.map((s,i)=>`<span class="ck${i===c.length-1?' end':''}">${s}</span>${i<c.length-1?'<span class="ar">←</span>':''}`).join('')}</div>
         <div class="w-row"><button class="btn pri" type="button" data-go>شغّل الرحلة</button><button class="btn" type="button" data-rs>إعادة</button></div>
         <p class="sub" style="margin-top:6px">كل الرحلات بشرط أن تكون مفاتيح الأمان مغلقة فيعمل <span class="ltr">K0</span>. الرحلة الحية بالمحرك في تبويب «المختبر».</p>`;
        const ks=[...el.querySelectorAll('.ck')];
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});
        el.querySelector('[data-go]').onclick=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(x=>x.classList.remove('on'));ks.forEach((x,i)=>tm.push(setTimeout(()=>x.classList.add('on'),i*600)))};
        el.querySelector('[data-rs]').onclick=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(x=>x.classList.remove('on'))}};
      draw();
    }},
    {predict:{q:'في الخطوة 2 تمر الكابينة على F2 فيتغير وضعه. لماذا لا تقف عند الدور الثاني؟',opts:[
     ['لأن التيار يصل إلى K4 من خلال K3 و F3، لا من خلال F2',true,'هذا نص الكتاب: «لا يحدث أي شيء … لأن التيار وصل إلى المتمم ( K4 ) من خلال المتمم ( K3 )». F2 يؤثر فقط في فرع K2.'],
     ['لأن المزمن T1 يمنع الوقوف',false,'T1 يمسك متمم الدور ويحجب ضواغط الخارج، لكنه لا يتحكم في الوقوف.'],
     ['لأن F2 لا يعمل أثناء الصعود',false,'F2 يتغير فعلاً (b ثم off ثم a)، لكن فرع K4 النشط الآن هو فرع K3 و F3.']]}},
    {watch:String.raw`<p>في الخطوتين 2 و 3 يسمي النص النقطة التي يلامسها <span class="ltr">F2</span> فوق الدور الثاني «النقطة اليسرى»، بينما هي في الرسم (ص 144 و 146) النقطة <span class="ltr">a</span> على <b>اليمين</b> جهة <span class="ltr">K5</span>. المعتمد: فوق الدور الثاني يلامس <span class="ltr">F2</span> النقطة <span class="ltr">a</span> فيعمل <span class="ltr">K5</span> (نزول) عند طلب الدور الثاني، وتحته يلامس <span class="ltr">b</span>.</p>`,fix:true}
   ]},

  {st:3,short:'ملاحظات K0 و T1',title:'ملاحظات: وظيفة المتمم المساعد K0 والمزمن',ref:'ص 147–148',
   q:'ضغطت زر الدور الأول من الداخل ثم تركته فوراً… من الذي «يتذكر» طلبك حتى تصل الكابينة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط زمني: K4 أو K5 يعمل أثناء الحركة، و T1 يعمل معه ويبقى 5 ثوان بعد الوقوف، و K1 ممسوك طوال ذلك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M80 270H330" stroke="#2C4A40" stroke-width="2"/><polygon points="334,270 324,265 324,275" fill="#2C4A40"/><text x="320" y="292" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">الزمن</text><g data-tip="ضغطة قصيرة على ⟦SI1⟧ ثم يُترك الضاغط."><text x="44" y="78" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SI1</text><path d="M80 90H110V62H126V90H330" fill="none" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="متمم طلب الدور ⟦K1⟧: يعمل بالضغطة ثم يبقى ممسوكاً عن طريق تلامس ⟦T1⟧ المفتوح حتى بعد ترك الضاغط."><text x="44" y="136" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text><path d="M80 148H110V120H286V148H330" fill="none" stroke="#F2C14E" stroke-width="4"/></g><g data-tip="متمم الحركة (هنا ⟦K5⟧ للنزول): يعمل أثناء حركة الكابينة ويفصل لحظة الوصول."><text x="44" y="190" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K5</text><path d="M80 202H112V174H226V202H330" fill="none" stroke="#4FB3A9" stroke-width="4"/></g><g data-tip="المزمن ⟦T1⟧ (تأخير فصل في البرنامج): تلامساته تتغير مع بدء الحركة، وتبقى بعد الوقوف مدة ⟦S5T#5S⟧ ثم تعود."><text x="44" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><path d="M80 256H112V228H286V256H330" fill="none" stroke="#E8735A" stroke-width="4"/></g><path d="M226 174V270M286 120V270" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 4"/><g data-tip="الزمن الذي يبقى فيه ⟦T1⟧ بعد وقوف المحرك: ⟦5 s⟧ في البرنامج (ص 149)، وغير مذكور في الدائرة التقليدية."><rect x="226" y="40" width="60" height="34" fill="transparent"/><path d="M230 56H282" stroke="#2C4A40" stroke-width="2"/><polygon points="226,56 236,51 236,61" fill="#2C4A40"/><polygon points="286,56 276,51 276,61" fill="#2C4A40"/><text x="256" y="48" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">5 s</text></g><text x="168" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600">الحركة</text></svg>`,
   cap:'رحلة نزول إلى الدور الأول بضغطة قصيرة على <span class="ltr">SI1</span>. الخط المرتفع = يعمل، والمنخفض = لا يعمل. زمن <span class="ltr">5 s</span> من البرنامج (ص 149).<br><b>مرّر المؤشر على كل خط وعلى السهم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p>1- وظيفة المتمم المساعد ( K0 ) في حالة فصل أي مفتاح أمان بالنسبة للتأكد من غلق الأبواب أو غيرها أن المتمم ( K0 ) لا يعمل، بالتالي فإن جميع أجزاء الدائرة لا تعمل.</p>`,ref:'ص 147'}
   ],
   body:[
    {book:String.raw`<p>2- وظيفة المزمن أنه في حالة تشغيل المتمم ( K5 ) أو ( K4 ) أي متمم النزول أو الصعود أن تغلق نقاط المزمن ليظل التيار موصلاً إلى ملف المتمم الخاص بالدور المطلوب ( K1, K2, K3 ) حتى بعد ترك مفتاح التشغيل، ويقفل المزمن لحظة وقوف المحرك في حالة الصعود أو النزول.</p>`,ref:'ص 148'},
    {tip:String.raw`<p>المزمن <span class="ltr">T1</span> له تلامسان في الدائرة:</p><ul><li><b>المفتوح</b> في طريق تلامسات الإمساك <span class="ltr">K1</span>–<span class="ltr">K3</span>: يُغلق أثناء الحركة فيبقى متمم الدور المطلوب ممسوكاً بعد ترك الضاغط.</li><li><b>المغلق</b> في طريق ضواغط الخارج <span class="ltr">SO</span>: يُفتح أثناء الحركة، فلا يستجيب المصعد لاستدعاء من خارج الكابينة حتى يقف.</li></ul><p>أما ضواغط الداخل <span class="ltr">SI</span> فمتصلة مباشرة بالنقطة <span class="ltr">X</span>، فلا يحجبها المزمن.</p>`,title:'تلامسا المزمن'},
    {predict:{q:'الكابينة تنزل إلى الدور الأول، وضغط شخص عند باب الدور الثالث SO3. ماذا يحدث؟',opts:[
     ['تعكس الكابينة اتجاهها وتصعد',false,'حتى لو عمل K3 فإن تلامس K5 المغلق يمنع K4 أثناء النزول؛ لكن K3 نفسه لا يعمل أصلاً هنا.'],
     ['يعمل K3 وينتظر حتى تصل الكابينة إلى الأول',false,'SO3 يمر بتلامس T1 المغلق، وهذا التلامس مفتوح أثناء الحركة.'],
     ['لا شيء: تلامس T1 المغلق في طريق SO3 مفتوح أثناء الحركة',true,'ضواغط الخارج محجوبة ما دام T1 يعمل، أي أثناء الحركة وبعدها بمدة زمن المزمن.']]}},
    {watch:String.raw`<p>الملاحظة 2 تقول إن المزمن «يقفل لحظة وقوف المحرك»، أي ترجع تلامساته فور توقف <span class="ltr">K4</span> و<span class="ltr">K5</span>. لكن البرنامج (ص 149 و 156) يستخدم مزمن تأخير فصل <span class="ltr">S_OFFDT</span> بزمن <span class="ltr">S5T#5S</span>، فتبقى تلامساته 5 ث بعد الوقوف: يبقى متمم الدور ممسوكاً 5 ث، وتبقى استدعاءات الخارج <span class="ltr">SO</span> محجوبة خلالها. في المختبر زر لاختيار الزمن: «5 ث» أو «لحظي».</p>`,fix:true},
    {add:String.raw`<p>هذا الحجب المؤقت لضواغط الخارج يشبه ما تراه في كثير من المصاعد: إذا وصلت الكابينة وفُتح الباب، لا يسحبها من ينتظر في دور آخر فوراً، بل تُعطى مهلة قصيرة لمن في الداخل ليخرج أو يختار دوره.</p>`,title:'من الواقع'},
    {predict:{q:'أثناء صعود الكابينة فتح أحدهم باب الدور الأول (S7). ماذا يحدث حسب الملاحظة 1؟',opts:[
     ['يفصل K0 فتتوقف كل أجزاء الدائرة وتقف الكابينة',true,'«في حالة فصل أي مفتاح أمان … أن المتمم ( K0 ) لا يعمل، بالتالي فإن جميع أجزاء الدائرة لا تعمل» (ص 147).'],
     ['تكمل الكابينة إلى الدور المطلوب ثم تقف',false,'K0 يغذي النقطة X، فإذا فصل انقطعت التغذية عن K4 فوراً.'],
     ['يتوقف الصعود فقط ويبقى النزول ممكناً',false,'K0 يقطع التغذية عن كل الفروع: الصعود والنزول وطلبات الأدوار.']]}},
    {title:'تحقق سريع: ملاحظتا الكتاب',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب الملاحظتين (ص 147–148).',items:[
 [String.raw`إذا فُصل أي مفتاح أمان لا يعمل <span class="ltr">K0</span>، فلا تعمل أجزاء الدائرة كلها.`,true,'هذا نص الملاحظة 1.'],
 [String.raw`تلامس المزمن المفتوح يُبقي متمم الدور المطلوب (<span class="ltr">K1</span>–<span class="ltr">K3</span>) ممسوكاً بعد ترك ضاغط التشغيل.`,true,String.raw`الملاحظة 2: تُغلق نقاط المزمن أثناء تشغيل <span class="ltr">K4</span> أو <span class="ltr">K5</span> «ليظل التيار موصلاً» إلى متمم الدور.`],
 [String.raw`في البرنامج يرجع المزمن <span class="ltr">T1</span> لحظة وقوف المحرك تماماً كما تقول الملاحظة 2.`,false,String.raw`البرنامج يستعمل مزمن تأخير فصل بزمن <span class="ltr mono">S5T#5S</span>، فيبقى <span class="ltr">1</span> مدة 5 ث بعد الوقوف (انظر «انتبه» أعلاه).`]]})}
   ]},

  {recap:[
   String.raw`مفاتيح الأمان <span class="ltr">S7</span>–<span class="ltr">S9</span> تشغّل <span class="ltr">K0</span>، و<span class="ltr">SS</span> مع <span class="ltr">K0</span> يغذيان بقية الدائرة؛ أي مفتاح أمان مفتوح يوقف كل شيء (ص 147).`,
   String.raw`الضاغط يشغّل متمم الدور (<span class="ltr">K1</span>–<span class="ltr">K3</span>)، ومتمم الدور يشغّل <span class="ltr">K4</span> (صعود) أو <span class="ltr">K5</span> (نزول)، و<span class="ltr">K4</span> و<span class="ltr">K5</span> معشّقان.`,
   String.raw`الوقوف: <span class="ltr">F1</span> عند الأول و<span class="ltr">F3</span> عند الثالث يُفتحان، و<span class="ltr">F2</span> يعود إلى <span class="ltr">off</span> عند الثاني؛ والمرور على <span class="ltr">F2</span> لا يوقف رحلة إلى الأول أو الثالث (ص 147).`,
   String.raw`المزمن <span class="ltr">T1</span> يعمل مع الحركة: يمسك متمم الدور بعد ترك الضاغط ويحجب ضواغط الخارج <span class="ltr">SO</span>؛ وفي البرنامج يبقى 5 ث بعد الوقوف (ص 148–149).`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'خطأ مطبعي في ص 147: «وتستمر المبينة بالنزول» والمقصود «الكابينة». وفي ص 148: «ويقفل المزمن لحظه» والمقصود «لحظة».'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الخطوتين 2 و 3 (ص 147) يسمي النص النقطة التي يلامسها F2 فوق الدور الثاني «النقطة اليسرى»، بينما هي في الرسم (ص 144) النقطة a على اليمين جهة K5. المنطق الصحيح: فوق الدور الثاني يلامس F2 النقطة a فيعمل K5 (نزول) عند طلب الدور الثاني.'+'</div>'},
  {h:'ملاحظات',ref:'ص 147–148',html:`<ol><li>«وظيفة المتمم المساعد ( K0 ) في حالة فصل أي مفتاح أمان بالنسبة للتأكد من غلق الأبواب أو غيرها أن المتمم ( K0 ) لا يعمل، بالتالي فإن جميع أجزاء الدائرة لا تعمل.» (ص 147)</li>
   <li>«وظيفة المزمن أنه في حالة تشغيل المتمم ( K5 ) أو ( K4 ) أي متمم النزول أو الصعود أن تغلق نقاط المزمن ليظل التيار موصلاً إلى ملف المتمم الخاص بالدور المطلوب ( K1, K2, K3 ) حتى بعد ترك مفتاح التشغيل، ويقفل المزمن لحظة وقوف المحرك في حالة الصعود أو النزول.» (ص 148)</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن تلامس T1 المغلق في طريق ضواغط الخارج SO: أثناء الحركة يُفتح، فلا يستجيب المصعد لاستدعاء من الخارج حتى يقف. أما ضواغط الداخل SI فمتصلة مباشرة بالنقطة X.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>زمن المزمن:</b> الملاحظة 2 (ص 148) تقول إن المزمن «يقفل لحظة وقوف المحرك»، أي ترجع تلامساته فور توقف K4 و K5. لكن البرنامج (ص 149 و 156) يستخدم مزمن تأخير فصل S_OFFDT بزمن <span class="ltr">S5T#5S</span>، فتبقى تلامساته 5 ث بعد الوقوف: يبقى متمم الدور ممسوكاً 5 ث، وتبقى استدعاءات الخارج SO محجوبة خلالها. في المختبر زر لاختيار الزمن: «5 ث كما في البرنامج» أو «لحظي كما في الملاحظة 2».'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>ترقيم الصفحات:</b> الوحدة التاسعة تمتد من ص 143 إلى ص 158، لكن الوحدة العاشرة تبدأ هي أيضاً بالرقم 147، فالرقمان 147 و 148 مكرران في الكتاب. المقصود هنا صفحتا الوحدة التاسعة.'+'</div>'}
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
 stations:[
  {intro:true},

  {st:1,short:'من الدائرة إلى الشبكات',title:'١- دائرة LAD: كل فرع يصبح شبكة',ref:'ص 149',
   q:'في الدائرة التقليدية متمم مساعد ومزمن وخمسة متممات… ماذا يقابل كل واحد منها داخل الـ PLC؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="كل جزء من الدائرة التقليدية وما يقابله في البرنامج: K0 إلى M0.0، والنقطة X إلى M0.1، والمزمن إلى S_OFFDT، والمتممات إلى مخارج Q" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="262" y="48" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الدائرة التقليدية</text><text x="98" y="48" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">البرنامج</text><g data-tip="المتمم المساعد ⟦K0⟧ صار العلامة ⟦M0.0⟧ (Network 1)."><rect x="212" y="64" width="100" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="87" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K0</text><path d="M206 82H156" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,82 160,77 160,87" fill="#2C4A40"/><rect x="48" y="64" width="100" height="36" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="87" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text></g><g data-tip="النقطة بعد ⟦K0⟧ (سميناها ⟦X⟧) صارت العلامة ⟦M0.1⟧ = ⟦SS⟧ و ⟦K0⟧ (Network 2)، وتبدأ بها الشبكات 4 إلى 8."><rect x="212" y="110" width="100" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="133" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X</text><path d="M206 128H156" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,128 160,123 160,133" fill="#2C4A40"/><rect x="48" y="110" width="100" height="36" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="133" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text></g><g data-tip="ملف المزمن ⟦T1⟧ صار صندوق مزمن تأخير فصل ⟦S_OFFDT⟧ بزمن ⟦S5T#5S⟧ (Network 3)."><rect x="212" y="156" width="100" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="179" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><path d="M206 174H156" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,174 160,169 160,179" fill="#2C4A40"/><rect x="48" y="156" width="100" height="36" rx="8" fill="#E6E2F8" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="179" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S_OFFDT</text></g><g data-tip="متممات طلب الأدوار صارت المخارج ⟦Q4.1⟧ و ⟦Q4.2⟧ و ⟦Q4.3⟧ (Networks 4–6)."><rect x="212" y="202" width="100" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="225" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1–K3</text><path d="M206 220H156" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,220 160,215 160,225" fill="#2C4A40"/><rect x="48" y="202" width="100" height="36" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="225" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1–Q4.3</text></g><g data-tip="متمما الصعود والنزول صارا المخرجين ⟦Q5.4⟧ و ⟦Q5.5⟧ (Networks 7–8)."><rect x="212" y="248" width="100" height="36" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="271" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4 K5</text><path d="M206 266H156" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="150,266 160,261 160,271" fill="#2C4A40"/><rect x="48" y="248" width="100" height="36" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="98" y="271" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4 Q5.5</text></g></svg>`,
   cap:'يمين: الجزء في الدائرة التقليدية (ص 144)، ويسار: ما يقابله في البرنامج (ص 149–151).<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتعرف الشبكة التي يظهر فيها.</b>',
   side:[
    {book:String.raw`<p><b>١- دائرة ( LAD ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات</b></p>`,ref:'ص 149'},
    {predict:{q:'في الدائرة التقليدية تأخذ كل الفروع تغذيتها من النقطة بعد تلامس K0. ما الذي يقوم مقام هذه النقطة في البرنامج؟',opts:[
     [String.raw`المخرج <span class="ltr">Q5.4</span>`,false,'Q5.4 هو متمم الصعود K4، وهو أحد الأحمال وليس خط التغذية.'],
     [String.raw`العلامة <span class="ltr">M0.1</span>`,true,'Network 2 يجعل M0.1 = SS و K0، ثم تبدأ كل الشبكات من 4 إلى 8 بتلامس M0.1.'],
     [String.raw`المدخل <span class="ltr">I0.0</span>`,false,'I0.0 هو الضاغط SS وحده، والتغذية تحتاج SS و K0 معاً.']]}}
   ],
   body:[
    {tip:String.raw`<p>كل فرع من الدائرة التقليدية صار <b>Network</b>:</p><ul>
     <li><b>Network 1 : SAFE</b> — <span class="ltr">S7</span> و<span class="ltr">S8</span> و<span class="ltr">S9</span> ← <span class="ltr">M0.0</span> «<span class="ltr">K0</span>».</li>
     <li><b>Network 2</b> — <span class="ltr">SS</span> و<span class="ltr">K0</span> ← <span class="ltr">M0.1</span> (خط التغذية).</li>
     <li><b>Network 3</b> — المزمن <span class="ltr">T1</span> من نوع <span class="ltr">S_OFFDT</span>.</li>
     <li><b>Networks 4–6 : FLOOR CALLING</b> — طلبات الأدوار <span class="ltr">K1</span> و<span class="ltr">K2</span> و<span class="ltr">K3</span>.</li>
     <li><b>Network 7 : ELEVATOR UP</b> و<b>Network 8 : ELEVATOR DOWN</b> — <span class="ltr">K4</span> و<span class="ltr">K5</span>.</li></ul>
     <p>سنمرّ عليها في المحطات القادمة مجموعةً مجموعة، وكل الشبكات بالرسم الكامل في تبويب «المختبر».</p>`,title:'ثماني شبكات'},
    {add:String.raw`<p>عنوان الكتاب «دالة التخزين مع دالة الإلغاء والإبقاء» يشير إلى فكرة «التذكر»: متمم الدور يبقى يعمل بعد ترك الضاغط (إبقاء)، ثم يفصل (إلغاء). في هذا البرنامج يتم ذلك بالإمساك الذاتي عن طريق المزمن، لا بتعليمتي <span class="ltr">S</span> و<span class="ltr">R</span> على المخارج.</p>`,title:'ماذا يعني العنوان؟'},
    {title:'مختبر مصغّر: أين صار هذا الفرع؟',widget:(el,B)=>DCML.sort(el,B,{intro:'كل فرع من الدائرة التقليدية صار شبكة. اختر الشبكة التي يقابلها كل فرع.',cats:['N1','N2','N3','N4–N6','N7','N8'].map(x=>DCML.lt(x)),items:[
 [String.raw`<span class="ltr">S7</span> و<span class="ltr">S8</span> و<span class="ltr">S9</span> على التوالي مع ملف <span class="ltr">K0</span>`,0,String.raw`<span class="ltr">Network 1 : SAFE</span>، و<span class="ltr">K0</span> صار العلامة <span class="ltr">M0.0</span>.`],
 [String.raw`<span class="ltr">SS</span> مع تلامس <span class="ltr">K0</span> إلى النقطة التي تغذي بقية الفروع`,1,String.raw`<span class="ltr">Network 2</span>: الناتج <span class="ltr">M0.1</span> يقوم مقام خط التغذية.`],
 [String.raw`<span class="ltr">K4</span> أو <span class="ltr">K5</span> يشغّلان ملف المزمن`,2,String.raw`<span class="ltr">Network 3</span>: المزمن <span class="ltr">T1</span> من نوع تأخير الفصل.`],
 [String.raw`<span class="ltr">SO2</span> أو <span class="ltr">SI2</span> أو إمساك <span class="ltr">K2</span> إلى ملف <span class="ltr">K2</span>`,3,String.raw`طلبات الأدوار في <span class="ltr">Network 4</span> و<span class="ltr">5</span> و<span class="ltr">6</span>، واحدة لكل دور.`],
 [String.raw`(<span class="ltr">K3</span> مع <span class="ltr">F3</span>) أو (<span class="ltr">K2</span> مع <span class="ltr">b</span>)، ثم <span class="ltr">K5</span> مغلق، إلى <span class="ltr">K4</span>`,4,String.raw`<span class="ltr">Network 7 : ELEVATOR UP</span>.`],
 [String.raw`(<span class="ltr">K1</span> مع <span class="ltr">F1</span>) أو (<span class="ltr">K2</span> مع <span class="ltr">a</span>)، ثم <span class="ltr">K4</span> مغلق، إلى <span class="ltr">K5</span>`,5,String.raw`<span class="ltr">Network 8 : ELEVATOR DOWN</span>.`]]})}
   ]},

  {st:2,short:'الأمان وخط التغذية',title:'Network 1 و Network 2: الأمان وخط التغذية',ref:'ص 149',
   q:'مفاتيح الأمان موصلة مغلقة NC… فلماذا رُسمت في البرنامج بتلامسات مفتوحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 1: ثلاثة تلامسات مفتوحة I1.4 و I1.5 و I1.6 إلى الملف M0.0. و Network 2: I0.0 و M0.0 إلى الملف M0.1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M24 56V140M24 196V264" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><text x="26" y="46" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 1</text><path d="M24 100H74M86 100H144M156 100H214M226 100H294M306 100H332" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="تلامس مفتوح للمدخل ⟦I1.4⟧ (مفتاح الأمان ⟦S7⟧). يمرّر عندما يقرأ المدخل 1، أي والباب مغلق."><rect x="58" y="66" width="44" height="70" fill="transparent"/><path d="M74 88V112M86 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="80" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I1.4</text><text x="80" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S7</text></g><g data-tip="تلامس مفتوح للمدخل ⟦I1.5⟧ (مفتاح الأمان ⟦S8⟧)."><rect x="128" y="66" width="44" height="70" fill="transparent"/><path d="M144 88V112M156 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="150" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I1.5</text><text x="150" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S8</text></g><g data-tip="تلامس مفتوح للمدخل ⟦I1.6⟧ (مفتاح الأمان ⟦S9⟧)."><rect x="198" y="66" width="44" height="70" fill="transparent"/><path d="M214 88V112M226 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="220" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I1.6</text><text x="220" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">S9</text></g><g data-tip="ملف العلامة ⟦M0.0⟧: يقوم مقام المتمم المساعد ⟦K0⟧."><rect x="276" y="66" width="48" height="70" fill="transparent"/><path d="M294 88q-9 12 0 24M306 88q9 12 0 24" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="300" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text><text x="300" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K0</text></g><text x="26" y="186" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 2</text><path d="M24 224H74M86 224H144M156 224H294M306 224H332" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="تلامس مفتوح للمدخل ⟦I0.0⟧ (الضاغط ⟦SS⟧ / ⟦STOP⟧). الضاغط موصّل مغلقاً، فيمرّر ما دام غير مضغوط."><rect x="58" y="190" width="44" height="70" fill="transparent"/><path d="M74 212V236M86 212V236" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="80" y="206" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><text x="80" y="252" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">SS</text></g><g data-tip="تلامس العلامة ⟦M0.0⟧: يمرّر إذا كان ⟦K0⟧ يعمل."><rect x="128" y="190" width="44" height="70" fill="transparent"/><path d="M144 212V236M156 212V236" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="150" y="206" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text><text x="150" y="252" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K0</text></g><g data-tip="ملف العلامة ⟦M0.1⟧: يقوم مقام النقطة بعد ⟦K0⟧ (خط التغذية)، ومنه تبدأ الشبكات 4 إلى 8."><rect x="276" y="190" width="48" height="70" fill="transparent"/><path d="M294 212q-9 12 0 24M306 212q9 12 0 24" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="300" y="206" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text><text x="300" y="252" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g></svg>`,
   cap:'الشبكتان الأوليان: تلامسات على التوالي ثم ملف.<br><b>مرّر المؤشر على كل تلامس وملف (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'فُتح باب الدور الثاني (S8). ماذا يصبح M0.0 و M0.1؟',opts:[
     [String.raw`<span class="ltr">M0.0 = 1</span> و<span class="ltr">M0.1 = 0</span>`,false,'S8 في Network 1 نفسها، فيسقط M0.0 أولاً.'],
     [String.raw`<span class="ltr">M0.0 = 0</span> و<span class="ltr">M0.1 = 0</span>`,true,'I1.5 يصبح 0 فينقطع Network 1 فيصبح M0.0 = 0، و Network 2 يحتاج M0.0 فيصبح M0.1 = 0، فتتوقف كل الشبكات بعدها.'],
     ['يبقيان 1 لأن S8 تلامس مفتوح في البرنامج',false,'التلامس المفتوح يمرّر عندما يقرأ المدخل 1؛ فتح الباب يجعل I1.5 = 0 فلا يمرّر.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 1 : SAFE</b> و <b>Network 2</b></p>`+netsHTML(PROG_BOOK,'lad',[1,2]),ref:'ص 149'},
    {tip:String.raw`<p>البرنامج يرى <b>الإشارة</b> التي تصل إلى المدخل، ولا يرى نوع التلامس في الموقع. المفتاح الموصّل مغلقاً <span class="ltr">NC</span> يعطي <span class="ltr">1</span> في حالته العادية. فإذا أردنا «مرّر ما دام المفتاح مغلقاً» نكتب له في البرنامج <b>تلامساً مفتوحاً</b>: يمرّر عندما يكون المدخل <span class="ltr">1</span>.</p><p>وهكذا فعل الكتاب مع <span class="ltr">S7</span> و<span class="ltr">S8</span> و<span class="ltr">S9</span> و<span class="ltr">SS</span>.</p>`,title:'قاعدة مهمة'},
    {watch:String.raw`<p>عنوانا Network 2 و Network 3 في <span class="ltr">LAD</span> مكتوبان «<span class="ltr">Title:</span>» بلا عنوان، وفي <span class="ltr">STL</span>: «<span class="ltr">Stop elevator</span>» و«<span class="ltr">Delay time for calling</span>». الرسوم هنا تستخدم عناوين <span class="ltr">STL</span>. والعلامة <span class="ltr">M0.1</span> غير مذكورة في جدول ص 145.</p>`,fix:true},
    {title:'مختبر مصغّر: افتح باباً واضغط SS',widget:(el,B)=>PLCML.net(el,B,{
 intro:String.raw`<span class="ltr">Network 1</span> و<span class="ltr">Network 2</span>. كل المفاتيح موصّلة مغلقة <span class="ltr">NC</span>، فالباب المغلق يعطي مدخله <span class="ltr">1</span>.`,
 predict:{q:String.raw`ضغط أحدهم <span class="ltr">SS</span> والأبواب مغلقة. ماذا يصبح <span class="ltr">M0.0</span> و<span class="ltr">M0.1</span>؟`,opts:[
  [String.raw`<span class="ltr">M0.0 = 1</span> و<span class="ltr">M0.1 = 0</span>`,true,String.raw`<span class="ltr">SS</span> في <span class="ltr">Network 2</span> فقط: <span class="ltr">K0</span> يبقى، لكن خط التغذية <span class="ltr">M0.1</span> ينقطع.`],
  [String.raw`الاثنان <span class="ltr">0</span>`,false,String.raw`<span class="ltr">Network 1</span> لا تحتوي <span class="ltr">I0.0</span>.`],
  [String.raw`الاثنان <span class="ltr">1</span>`,false,String.raw`الضغط على <span class="ltr">SS</span> (<span class="ltr">NC</span>) يجعل <span class="ltr">I0.0 = 0</span>، و<span class="ltr mono">A I 0.0</span> لا يمرّر.`]]},
 prog:PROG_BOOK.slice(0,2),names:NAMES9,
 ins:[['I1.4','S7','الأول'],['I1.5','S8','الثاني'],['I1.6','S9','الثالث']].map(([a,n,f])=>({a,v:1,on:String.raw`باب ${f} مغلق (<span class="ltr">${a} = 1</span>)`,off:String.raw`باب ${f} مفتوح (<span class="ltr">${a} = 0</span>)`}))
  .concat([{a:'I0.0',v:1,on:String.raw`<span class="ltr">SS</span> غير مضغوط (<span class="ltr">I0.0 = 1</span>)`,off:String.raw`<span class="ltr">SS</span> مضغوط (<span class="ltr">I0.0 = 0</span>)`}]),
 outs:[['M0.0',String.raw`<span class="ltr">K0 (M0.0)</span>`],['M0.1',String.raw`خط التغذية <span class="ltr">M0.1</span>`]],
 msg:P=>P.get('M0.1')?String.raw`<span class="ltr">M0.1 = 1</span>: بقية الشبكات تستطيع أن تعمل.`:String.raw`<span class="ltr">M0.1 = 0</span>: كل شبكات الطلب والحركة تبدأ بـ <span class="ltr mono">A M 0.1</span>، فلا يعمل شيء.`})}
   ]},

  {st:3,short:'المزمن T1',title:'Network 3: مزمن تأخير الفصل T1',ref:'ص 149',
   q:'المزمن يبدأ مع الحركة… فماذا يحدث له لحظة وقوف الكابينة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 3: K4 أو K5 إلى المدخل S لصندوق المزمن T1 من نوع S_OFFDT، وزمنه S5T#5S، والمدخل R عليه تلامس M0.1 المغلق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M22 64V284" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M22 100H74M86 100H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M22 100V170M120 170V100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M22 170H74M86 170H120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="تلامس ⟦Q5.4⟧ (متمم الصعود ⟦K4⟧)."><rect x="58" y="66" width="44" height="70" fill="transparent"/><path d="M74 88V112M86 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="80" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4</text><text x="80" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K4</text></g><g data-tip="تلامس ⟦Q5.5⟧ (متمم النزول ⟦K5⟧)، موازٍ لـ ⟦K4⟧: أي حركة تشغّل المزمن."><rect x="58" y="136" width="44" height="70" fill="transparent"/><path d="M74 158V182M86 158V182" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="80" y="152" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.5</text><text x="80" y="198" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K5</text></g><path d="M22 255H74M86 255H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="تلامس مغلق للعلامة ⟦M0.1⟧ على المدخل ⟦R⟧: إذا صار ⟦M0.1⟧ = 0 (فتح أمان أو ضغط ⟦SS⟧) يُصفَّر المزمن فوراً."><rect x="58" y="221" width="44" height="70" fill="transparent"/><path d="M74 243V267M86 243V267" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M70 267L90 243" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="80" y="237" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text><text x="80" y="283" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="صندوق المزمن ⟦T1⟧ من نوع ⟦S_OFFDT⟧ (تأخير فصل): خرجه ⟦Q⟧ يصبح 1 فوراً مع المدخل ⟦S⟧، ويبقى 1 مدة ⟦TV⟧ بعد أن يعود ⟦S⟧ إلى 0."><rect x="150" y="62" width="110" height="214" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="205" y="84" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S_OFFDT</text><text x="160" y="105" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><text x="160" y="220" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">TV</text><text x="160" y="260" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="250" y="105" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text></g><text x="205" y="54" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><g data-tip="⟦TV⟧: زمن المزمن ⟦S5T#5S⟧ = 5 ثوانٍ (ص 149)."><rect x="60" y="200" width="92" height="30" fill="transparent"/><path d="M116 215H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="112" y="220" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S5T#5S</text></g><path d="M260 100H312" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/></svg>`,
   cap:'صندوق المزمن: المداخل يساراً (<span class="ltr">S</span> و<span class="ltr">TV</span> و<span class="ltr">R</span>) والخرج <span class="ltr">Q</span> يميناً.<br><b>مرّر المؤشر على الصندوق والتلامسات والزمن (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'وقفت الكابينة الآن (فصل K4). ماذا يحدث لخرج المزمن T1 من نوع S_OFFDT؟',opts:[
     ['يصبح 0 فوراً',false,'هذا ما تقوله الملاحظة 2 (ص 148)، لكن البرنامج يستخدم مزمن تأخير فصل.'],
     ['يبقى 1 مدة 5 ثوانٍ ثم يصبح 0',true,'تأخير الفصل: عندما يعود المدخل S إلى 0 يبقى الخرج 1 مدة TV = S5T#5S ثم يصبح 0.'],
     ['يبدأ يعدّ 5 ثوانٍ ثم يصبح 1',false,'هذا سلوك مزمن تأخير التشغيل S_ODT، وليس S_OFFDT.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 3</b></p>`+netsHTML(PROG_BOOK,'lad',[3]),ref:'ص 149'},
    {tip:String.raw`<ul><li><b>المدخل S</b> = <span class="ltr">K4</span> أو <span class="ltr">K5</span>: أي حركة. مع بدء الحركة يصبح الخرج <span class="ltr">1</span> فوراً.</li><li>عند الوقوف يعود <span class="ltr">S</span> إلى <span class="ltr">0</span>، فيبقى الخرج <span class="ltr">1</span> مدة <span class="ltr">TV = S5T#5S</span> ثم يصبح <span class="ltr">0</span>.</li><li><b>المدخل R</b> = <span class="ltr">M0.1</span> بتلامس مغلق: إذا انقطع خط التغذية (أمان أو <span class="ltr">SS</span>) يُصفَّر المزمن فوراً.</li></ul>`,title:'اقرأ الصندوق'},
    {title:'جرّب مزمن تأخير الفصل',widget:(el,B)=>{
      const P=B.createPLC([{title:'Network 3',stl:PROG_BOOK[2].stl}]);let mv=0,sf=1,last=performance.now();
      el.innerHTML=`<div class="w-row" style="margin-top:0"><button class="sw" type="button" data-mv aria-pressed="false"><span class="knob"></span><b>K4</b><small>الكابينة تتحرك</small></button><button class="sw" type="button" data-sf aria-pressed="true"><span class="knob"></span><b>M0.1</b><small>خط التغذية</small></button></div>
       <div class="svgbox" style="max-width:620px" data-l></div>
       <div class="w-facts"><div><span>خرج المزمن T1</span><b data-q></b></div><div><span>الوقت المتبقي قبل الفصل</span><b data-r></b></div></div>
       <p class="sub" style="margin-top:6px">شغّل الحركة ثم أوقفها، وراقب كيف يبقى <span class="ltr">T1 = 1</span> بعد الوقوف. ثم جرّب إطفاء <span class="ltr">M0.1</span> والمزمن يعدّ.</p>`;
      const q=s=>el.querySelector(s);let sig='';
      q('[data-mv]').onclick=e=>{mv^=1;e.currentTarget.setAttribute('aria-pressed',!!mv)};
      q('[data-sf]').onclick=e=>{sf^=1;e.currentTarget.setAttribute('aria-pressed',!!sf)};
      const loop=now=>{if(!el.isConnected)return;const dt=Math.min(0.1,(now-last)/1000);last=now;
        P.set('Q5.4',mv);P.set('Q5.5',0);P.set('M0.1',sf);P.scan(dt);const T=P.tim.T1||{q:0,run:0,el:0,tv:0};
        const rem=T.q&&T.run?Math.max(0,T.tv-T.el):0;const s2=[mv,sf,T.q?1:0,T.run?1:0,Math.ceil(rem*10)].join();
        if(s2!==sig){sig=s2;q('[data-l]').innerHTML=B.ladNetwork(P.nets[0],P,NAMES9)}
        q('[data-q]').textContent=T.q?'1':'0';q('[data-r]').innerHTML=rem>0?'<span class="ltr">'+rem.toFixed(1)+' s</span>':'—';
        requestAnimationFrame(loop)};
      requestAnimationFrame(loop);
    }},
    {watch:String.raw`<p>الملاحظة 2 (ص 148) تقول إن المزمن «يقفل لحظة وقوف المحرك»، بينما البرنامج يضع <span class="ltr">S5T#5S</span> على مزمن تأخير فصل، فيبقى <span class="ltr">T1 = 1</span> مدة 5 ث بعد الوقوف. المحاكاة هنا تتبع البرنامج، والمقارنة بالزمن اللحظي في مختبر الدرس 9.2.</p>`,fix:true}
   ]},

  {st:4,short:'طلبات الأدوار',title:'Networks 4–6: طلبات الأدوار الثلاثة',ref:'ص 150–151',
   q:'ثلاث طرق توصل التيار إلى ملف K1… فأيها يعمل والكابينة تتحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 4: M0.1 ثم ثلاثة فروع متوازية: T1 مغلق مع SO1، و T1 مفتوح مع K1، و SI1، ثم ملف Q4.1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M22 70V290" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M22 100H46M58 100H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M90 100V260M260 100V260" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M90 100H124M136 100H204M216 100H294M306 100H320" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M90 180H124M136 180H204M216 180H260" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M90 260H164M176 260H260" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="⟦M0.1⟧: خط التغذية. بدونه لا يعمل أي طلب."><rect x="30" y="66" width="44" height="70" fill="transparent"/><path d="M46 88V112M58 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="52" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text><text x="52" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="تلامس مغلق للمزمن ⟦T1⟧ ⟦(AN T 1)⟧: يمرّر فقط والمزمن 0، أي والكابينة واقفة. لذلك تُحجب ضواغط الخارج أثناء الحركة."><rect x="108" y="66" width="44" height="70" fill="transparent"/><path d="M124 88V112M136 88V112" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M120 112L140 88" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><text x="130" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="130" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="⟦I0.1⟧: ضاغط الاستدعاء من خارج الكبينة للدور الأول ⟦SO1⟧."><rect x="188" y="66" width="44" height="70" fill="transparent"/><path d="M204 88V112M216 88V112" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="210" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><text x="210" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">SO1</text></g><g data-tip="تلامس مفتوح للمزمن ⟦T1⟧: يمرّر أثناء الحركة (وبعدها 5 ث)، فيُمسك ⟦K1⟧ نفسه."><rect x="108" y="146" width="44" height="70" fill="transparent"/><path d="M124 168V192M136 168V192" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="130" y="162" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T1</text><text x="130" y="208" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="تلامس الإمساك ⟦Q4.1⟧: ⟦K1⟧ يبقي نفسه يعمل ما دام ⟦T1⟧ = 1."><rect x="188" y="146" width="44" height="70" fill="transparent"/><path d="M204 168V192M216 168V192" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="210" y="162" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><text x="210" y="208" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K1</text></g><g data-tip="⟦I1.1⟧: ضاغط الداخل ⟦SI1⟧ — موصول مباشرة بلا ⟦T1⟧، فلا يُحجب أبداً."><rect x="148" y="226" width="44" height="70" fill="transparent"/><path d="M164 248V272M176 248V272" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="170" y="242" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I1.1</text><text x="170" y="288" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">SI1</text></g><g data-tip="ملف ⟦Q4.1⟧ = متمم طلب الدور الأول ⟦K1⟧."><rect x="276" y="66" width="48" height="70" fill="transparent"/><path d="M294 88q-9 12 0 24M306 88q9 12 0 24" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="300" y="82" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><text x="300" y="128" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K1</text></g></svg>`,
   cap:'Network 4 (طلب الدور الأول). الشبكتان 5 و 6 مثلها تماماً مع <span class="ltr">SO2</span>/<span class="ltr">SI2</span>/<span class="ltr">K2</span> و<span class="ltr">SO3</span>/<span class="ltr">SI3</span>/<span class="ltr">K3</span>. التلامس البرتقالي هو الذي يحجب ضواغط الخارج.<br><b>مرّر المؤشر على كل تلامس (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'الكابينة تتحرك (T1 = 1). أي ضاغط يستطيع أن يطلب الدور الأول الآن؟',opts:[
     [String.raw`<span class="ltr">SO1</span> فقط`,false,'SO1 يمر بتلامس T1 المغلق، وهو مفتوح الآن لأن T1 = 1.'],
     ['لا أحد',false,'الفرع الثالث SI1 موصول مباشرة دون T1.'],
     [String.raw`<span class="ltr">SI1</span> فقط (من داخل الكابينة)`,true,'SI1 لا يمر بأي تلامس للمزمن، فيعمل دائماً ما دام M0.1 = 1.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 4 : FIRST FLOOR CALLING</b> و <b>Network 5 : SECOND FLOOR CALLING</b> و <b>Network 6 : THIRD FLOOR CALLING</b></p>`+netsHTML(PROG_BOOK,'lad',[4,5,6]),ref:'ص 150–151'},
    {tip:String.raw`<p><span class="ltr">K1</span> يعمل إذا كان <span class="ltr">M0.1 = 1</span> <b>و</b> تحقق واحد من ثلاثة:</p><ol><li><span class="ltr">T1 = 0</span> (الكابينة واقفة) <b>و</b> ضُغط <span class="ltr">SO1</span> من الخارج.</li><li><span class="ltr">T1 = 1</span> <b>و</b> <span class="ltr">K1</span> يعمل أصلاً: هذا هو <b>الإمساك</b> أثناء الحركة.</li><li>ضُغط <span class="ltr">SI1</span> من الداخل، في أي وقت.</li></ol>`,title:'اقرأ الشبكة بصوت عالٍ'},
    {predict:{q:'ضغط راكب SI1 فبدأت الكابينة تنزل، ثم ترك الضاغط. لماذا يبقى K1 يعمل؟',opts:[
     ['لأن T1 صار 1 فأغلق تلامسه المفتوح، فيمرّ التيار عبر تلامس الإمساك K1',true,'هذا هو الفرع الثاني: T1 مفتوح ← Q4.1. والكتاب يقول: «ليظل التيار موصلاً إلى ملف المتمم الخاص بالدور المطلوب … حتى بعد ترك مفتاح التشغيل» (ص 148).'],
     ['لأن SI1 يبقى مضغوطاً من تلقاء نفسه',false,'SI1 ضاغط يعود عند تركه؛ الذي يُبقي K1 هو الإمساك عبر T1.'],
     ['لأن M0.1 يمسكه',false,'M0.1 شرط لازم لكنه لا يكفي وحده؛ يحتاج أحد الفروع الثلاثة.']]}},
    {tip:String.raw`<p>إذا وقفت الكابينة عند الدور الأول مثلاً، وخلال الـ 5 ث التي يبقى فيها <span class="ltr">K1</span> ممسوكاً ضُغط <span class="ltr">SI3</span> من الداخل، يعمل <span class="ltr">K3</span> فتصعد الكابينة و<span class="ltr">T1</span> ما زال <span class="ltr">1</span>، فيبقى <span class="ltr">K1</span> ممسوكاً طوال الرحلة. وعند الوصول للثالث يعمل <span class="ltr">K5</span> فوراً بسبب <span class="ltr">K1</span> فتعود للأول، ثم تصعد بسبب <span class="ltr">K3</span>… وهكذا تتردد بين الدورين حتى يُفتح مفتاح أمان أو يُضغط <span class="ltr">SS</span>. هذا من تصميم الدائرة نفسها (التقليدية والمبرمجة)، وتستطيع تجربته في المختبر.</p>`,title:'ملاحظة من المحاكاة (ليست من الكتاب)'},
    {title:'مختبر مصغّر: طلب الدور الأول',widget:(el,B)=>PLCML.net(el,B,{
 intro:String.raw`<span class="ltr">Network 4</span> وحدها. اضبط <span class="ltr">T1</span> كأن الكابينة واقفة أو تتحرك، ثم اضغط الضاغطين وراقب <span class="ltr">K1</span>.`,
 predict:{q:String.raw`الكابينة واقفة (<span class="ltr">T1 = 0</span>). ضغطت <span class="ltr">SO1</span> ثم تركته. هل يبقى <span class="ltr">K1</span> يعمل في هذه الشبكة وحدها؟`,opts:[
  [String.raw`نعم، يمسك نفسه دائماً`,false,String.raw`فرع الإمساك يبدأ بـ <span class="ltr mono">A T 1</span>، فلا يمسك إلا أثناء الحركة.`],
  [String.raw`لا، لأن الإمساك يحتاج <span class="ltr">T1 = 1</span>`,true,String.raw`في البرنامج الكامل يبدأ <span class="ltr">K5</span> فوراً فيصبح <span class="ltr">T1 = 1</span> ويمسك <span class="ltr">K1</span>. هنا لا يتحرك شيء لأن الشبكة وحدها.`]]},
 prog:PROG_BOOK.slice(3,4),names:NAMES9,
 ins:[{a:'T1',on:String.raw`الكابينة تتحرك (<span class="ltr">T1 = 1</span>)`,off:String.raw`الكابينة واقفة (<span class="ltr">T1 = 0</span>)`},
  {a:'I0.1',l:String.raw`اضغط <span class="ltr">SO1</span> (خارج) واتركه`,push:true},{a:'I1.1',l:String.raw`اضغط <span class="ltr">SI1</span> (داخل) واتركه`,push:true},
  {a:'M0.1',v:1,on:String.raw`<span class="ltr">M0.1 = 1</span>`,off:String.raw`<span class="ltr">M0.1 = 0</span>`}],
 outs:[['Q4.1',String.raw`طلب الدور الأول <span class="ltr">K1</span>`]],
 msg:(P,s)=>P.get('Q4.1')?String.raw`<span class="ltr">K1</span> ممسوك بالفرع <span class="ltr mono">A T 1 / A Q 4.1</span>. اجعل <span class="ltr">T1 = 0</span> (انتهى زمن ما بعد الوقوف) فيفصل.`:s['T1']?String.raw`أثناء الحركة لا يمرّر <span class="ltr">SO1</span> (<span class="ltr mono">AN T 1</span>)، أما <span class="ltr">SI1</span> من الداخل فيمرّر دائماً.`:''})}
   ]},

  {st:5,short:'الصعود والنزول',title:'Network 7 و Network 8: الصعود والنزول',ref:'ص 151',
   q:'الكابينة تحت الدور الثاني وطُلب الدور الثاني… أي فرع في Network 7 يوصل التيار إلى K4؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 7: M0.1 ثم فرعان متوازيان (K3 مع F3 مغلق) و (K2 مع b)، ثم K5 مغلق، ثم ملف K4" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M22 70V240" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M22 110H40M52 110H104M116 110H179M191 110H256M268 110H310M322 110H340" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M76 110V200M230 110V200" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M76 200H104M116 200H179M191 200H230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="⟦M0.1⟧: خط التغذية."><rect x="24" y="76" width="44" height="70" fill="transparent"/><path d="M40 98V122M52 98V122" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="46" y="92" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text><text x="46" y="138" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="⟦Q4.3⟧: طلب الدور الثالث ⟦K3⟧."><rect x="88" y="76" width="44" height="70" fill="transparent"/><path d="M104 98V122M116 98V122" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="110" y="92" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><text x="110" y="138" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K3</text></g><g data-tip="⟦I0.6⟧ مفتاح الدور الثالث ⟦F3⟧ مكتوب بتلامس مغلق ⟦(AN I 0.6)⟧ كما في الكتاب. انظر المحطة السادسة: هذا موضع الخطأ."><rect x="163" y="76" width="44" height="70" fill="transparent"/><path d="M179 98V122M191 98V122" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M175 122L195 98" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><text x="185" y="92" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.6</text><text x="185" y="138" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">F3</text></g><g data-tip="⟦Q4.2⟧: طلب الدور الثاني ⟦K2⟧."><rect x="88" y="166" width="44" height="70" fill="transparent"/><path d="M104 188V212M116 188V212" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="110" y="182" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><text x="110" y="228" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K2</text></g><g data-tip="⟦I0.5⟧: النقطة ⟦b⟧ من ⟦F2⟧ — تقرأ 1 والكابينة تحت الدور الثاني."><rect x="163" y="166" width="44" height="70" fill="transparent"/><path d="M179 188V212M191 188V212" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="185" y="182" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.5</text><text x="185" y="228" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">b</text></g><g data-tip="تلامس مغلق ⟦Q5.5⟧ ⟦(AN Q 5.5)⟧: تعشيق — لا يعمل الصعود ما دام النزول يعمل."><rect x="240" y="76" width="44" height="70" fill="transparent"/><path d="M256 98V122M268 98V122" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M252 122L272 98" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="262" y="92" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.5</text><text x="262" y="138" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K5</text></g><g data-tip="ملف ⟦Q5.4⟧ = متمم الصعود ⟦K4⟧."><rect x="292" y="76" width="48" height="70" fill="transparent"/><path d="M310 98q-9 12 0 24M322 98q9 12 0 24" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="316" y="92" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4</text><text x="316" y="138" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">K4</text></g><text x="180" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 7 : ELEVATOR UP</text></svg>`,
   cap:'Network 7 (الصعود). Network 8 صورة مرآة لها: <span class="ltr">K1</span> مع <span class="ltr">F1 (I0.4)</span>، و<span class="ltr">K2</span> مع <span class="ltr">a (I0.7)</span>، ثم <span class="ltr">K4</span> مغلق، ثم ملف <span class="ltr">K5 (Q5.5)</span>. التلامس البرتقالي موضع خطأ الكتاب (المحطة السادسة).<br><b>مرّر المؤشر على كل تلامس (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'الكابينة تحت الدور الثاني، وطُلب الدور الثاني (K2 = 1). أي فرع في Network 7 يمرّر؟',opts:[
     [String.raw`الفرع السفلي: <span class="ltr">K2</span> و<span class="ltr">b (I0.5)</span>`,true,'تحت الدور الثاني يلامس F2 النقطة b فيصبح I0.5 = 1، ومع K2 = 1 يعمل K4 فتصعد حتى يصبح F2 على off.'],
     [String.raw`الفرع العلوي: <span class="ltr">K3</span> و<span class="ltr">F3</span>`,false,'هذا فرع طلب الدور الثالث؛ K3 = 0 هنا.'],
     ['لا يمرّر أي فرع؛ تنزل الكابينة',false,'الكابينة تحت الدور المطلوب، فالحركة صعود عبر النقطة b.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 7 : ELEVATOR UP</b> و <b>Network 8 : ELEVATOR DOWN</b></p>`+netsHTML(PROG_BOOK,'lad',[7,8]),ref:'ص 151'},
    {tip:String.raw`<ul><li><b>الفرع العلوي</b> (<span class="ltr">K3</span> مع <span class="ltr">F3</span>): رحلة إلى الدور الثالث، تنتهي عند <span class="ltr">F3</span>.</li><li><b>الفرع السفلي</b> (<span class="ltr">K2</span> مع <span class="ltr">b</span>): رحلة صاعدة إلى الدور الثاني، تنتهي عندما يترك <span class="ltr">F2</span> النقطة <span class="ltr">b</span>.</li><li><b>تلامس <span class="ltr">Q5.5</span> المغلق</b>: تعشيق، فلا يعمل <span class="ltr">K4</span> و<span class="ltr">K5</span> معاً.</li></ul>`,title:'ثلاثة أجزاء في Network 7'},
    {predict:{q:'ما وظيفة تلامس Q5.4 المغلق في Network 8؟',opts:[
     ['يمسك K5 بعد ترك الضاغط',false,'الإمساك في Networks 4–6 عن طريق T1.'],
     ['يؤخر النزول 5 ثوانٍ',false,'لا يوجد تأخير في Network 8.'],
     ['تعشيق: لا ينزل المصعد ما دام K4 (الصعود) يعمل',true,'K4 و K5 يشغلان المحرك نفسه في اتجاهين متعاكسين، فلا يجوز أن يعملا معاً.']]}},
    {title:'مختبر مصغّر: طلب الدور الثاني من أسفل ومن أعلى',widget:(el,B)=>DCML.lab(el,B,{
 intro:String.raw`<span class="ltr">Network 7</span> و<span class="ltr">Network 8</span> من برنامج الكتاب، والطلب <span class="ltr">K2</span> (الدور الثاني). غيّر مكان الكابينة وراقب أي محرك يعمل.`,
 predict:{q:String.raw`<span class="ltr">K2 = 1</span> والكابينة فوق الدور الثاني (<span class="ltr">F2</span> على <span class="ltr">a</span>). أي متمم يعمل؟`,opts:[
  [String.raw`<span class="ltr">K4</span> صعوداً`,false,String.raw`فرع <span class="ltr">K2</span> في <span class="ltr">Network 7</span> يحتاج <span class="ltr">I0.5</span> (النقطة <span class="ltr">b</span>).`],
  [String.raw`<span class="ltr">K5</span> نزولاً`,true,String.raw`في <span class="ltr">Network 8</span> الفرع <span class="ltr mono">A Q 4.2 / A I 0.7</span> يمرّر لأن <span class="ltr">F2</span> على <span class="ltr">a</span>.`],
  ['لا شيء',false,'الكابينة ليست عند الدور الثاني، فيجب أن تتحرك إليه.']]},
 ins:[{k:'k2',sw:true,v:1,on:String.raw`<span class="ltr">K2 = 1</span> (طُلب الثاني)`,off:String.raw`<span class="ltr">K2 = 0</span>`},
  {k:'f',l:String.raw`مكان الكابينة (وضع <span class="ltr">F2</span>)`,seg:[['b','تحت الثاني (b)'],['off','عند الثاني (off)'],['a','فوق الثاني (a)']],v:'a'}],
 calc:(s)=>{const P=B.createPLC(PROG_BOOK.slice(6,8));const set=()=>{P.set('M0.1',1);P.set('Q4.1',0);P.set('Q4.3',0);P.set('Q4.2',s.k2);P.set('I0.5',s.f==='b'?1:0);P.set('I0.7',s.f==='a'?1:0);P.set('I0.4',1);P.set('I0.6',1)};
  set();P.scan(0.1);set();P.scan(0.1);const up=P.get('Q5.4'),dn=P.get('Q5.5');
  return {facts:[[DCML.lt('K4 (Q5.4)'),String(up),up?'hi':''],[DCML.lt('K5 (Q5.5)'),String(dn),dn?'hi':'']],
   pic:`<div class="svgbox fixed">${B.ladNetwork(P.nets[0],P,NAMES9)}</div><div class="svgbox fixed">${B.ladNetwork(P.nets[1],P,NAMES9)}</div>`,
   msg:!s.k2?String.raw`لا طلب، فلا حركة.`:up?String.raw`الكابينة تحت الثاني: تصعد حتى يترك <span class="ltr">F2</span> النقطة <span class="ltr">b</span>.`:dn?String.raw`الكابينة فوق الثاني: تنزل حتى يترك <span class="ltr">F2</span> النقطة <span class="ltr">a</span>.`:String.raw`<span class="ltr">F2</span> على <span class="ltr">off</span>: الكابينة عند الثاني فلا يمرّر أي فرع، فتقف.`}},
 })}
   ]},

  {st:6,short:'خطأ F1 و F3',title:'لماذا S7 و SS بتلامس مفتوح، و F1 و F3 بتلامس مغلق؟',ref:'ص 146، 151',
   q:'مفاتيح الأمان و F1 و F3 كلها موصلة مغلقة NC… فلماذا كُتبت في البرنامج بطريقتين مختلفتين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقارنة: S7 موصّل NC ومكتوب A فيمرّر والباب مغلق، و F1 موصّل NC ومكتوب AN فيقطع والكابينة بعيدة عن الدور" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="20" y="50" width="320" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="مفتاح الأمان ⟦S7⟧ موصّل مغلقاً ⟦NC⟧ والباب مغلق."><text x="292" y="88" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S7</text><text x="292" y="108" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">I1.4</text><text x="292" y="132" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600">الباب مغلق</text></g><path d="M250 102H230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="224,102 234,97 234,107" fill="#2C4A40"/><path d="M178 102H158" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="152,102 162,97 162,107" fill="#2C4A40"/><path d="M106 102H86" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="80,102 90,97 90,107" fill="#2C4A40"/><g data-tip="المدخل ⟦I1.4⟧ يقرأ 1 (يصله الجهد)."><circle cx="204" cy="102" r="18" fill="#12855A"/><text x="204" y="108" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text></g><g data-tip="الكتاب كتبه ⟦A I 1.4⟧ (تلامس مفتوح): يمرّر عندما يكون المدخل 1."><rect x="112" y="86" width="44" height="32" rx="6" fill="#E6E2F8" stroke="#2C4A40" stroke-width="2"/><text x="134" y="108" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text></g><g data-tip="النتيجة صحيحة: الدائرة تعمل ما دام الباب مغلقاً."><rect x="30" y="84" width="52" height="36" rx="18" fill="#4FB3A9"/><text x="56" y="107" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">يمرّر</text></g><rect x="20" y="170" width="320" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="مفتاح الدور الأول ⟦F1⟧ موصّل مغلقاً ⟦NC⟧ والكابينة بعيدة عن الدور الأول (يجب أن تنزل)."><text x="292" y="208" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F1</text><text x="292" y="228" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">I0.4</text><text x="292" y="252" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600">بعيدة عن الدور</text></g><path d="M250 222H230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="224,222 234,217 234,227" fill="#2C4A40"/><path d="M178 222H158" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="152,222 162,217 162,227" fill="#2C4A40"/><path d="M106 222H86" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="80,222 90,217 90,227" fill="#2C4A40"/><g data-tip="المدخل ⟦I0.4⟧ يقرأ 1."><circle cx="204" cy="222" r="18" fill="#12855A"/><text x="204" y="228" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text></g><g data-tip="الكتاب كتبه ⟦AN I 0.4⟧ (تلامس مغلق): يمرّر فقط عندما يكون المدخل 0."><rect x="112" y="206" width="44" height="32" rx="6" fill="#E6E2F8" stroke="#2C4A40" stroke-width="2"/><text x="134" y="228" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AN</text></g><g data-tip="النتيجة عكس المطلوب: ⟦K5⟧ لا يعمل والكابينة بعيدة، ويعمل فقط عندما تكون عند الدور الأول."><rect x="30" y="204" width="52" height="36" rx="18" fill="#E8735A"/><text x="56" y="227" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">يقطع</text></g></svg>`,
   cap:'المفتاحان موصلان بالطريقة نفسها ويقرآن <span class="ltr">1</span> في الحالة العادية، لكن الكتاب كتبهما بتعليمتين مختلفتين.<br><b>مرّر المؤشر على كل خانة (أو المسها في الجوال) لتتبّع السبب.</b>',
   side:[
    {book:String.raw`<p>قبل البدء في شرح الدائرة يجب أن نعلم أن مفتاح نهاية المشوار للدور الأول والثالث ( F1, F3 ) عبارة عن نقطة واحدة مغلقة ( NC ).</p>`,ref:'ص 146'}
   ],
   body:[
    {watch:ERR_F13,fix:true},
    {html:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>الكابينة</th><th><span class="ltr">F1 (NC)</span></th><th><span class="ltr">I0.4</span></th><th>كما في الكتاب: <span class="ltr">AN I 0.4</span></th><th>المصحح: <span class="ltr">A I 0.4</span></th></tr></thead><tbody>
     <tr><td>بعيدة عن الدور الأول (يجب أن تنزل)</td><td>مغلق</td><td class="mono">1</td><td>0 ← <span class="ltr">K5</span> لا يعمل</td><td>1 ← <span class="ltr">K5</span> يعمل</td></tr>
     <tr><td>عند الدور الأول (يجب أن تقف)</td><td>مفتوح</td><td class="mono">0</td><td>1 ← <span class="ltr">K5</span> يعمل (تجاوز!)</td><td>0 ← <span class="ltr">K5</span> يفصل</td></tr></tbody></table></div>`},
    {predict:{q:'بنسخة الكتاب: الكابينة عند الدور الثاني وضغطت SO1. ماذا يحدث؟',opts:[
     ['تنزل وتقف عند الدور الأول',false,'هذا ما يجب أن يحدث، لكن AN I 0.4 لا يمرّر وI0.4 = 1.'],
     ['يعمل K1 لكن K5 لا يعمل، فلا تتحرك الكابينة',true,'F1 مغلق والكابينة بعيدة فيقرأ I0.4 = 1، و AN I 0.4 لا يمرّر إلا عند 0.'],
     ['تصعد إلى الدور الثالث',false,'K4 يحتاج K3 أو K2؛ لم يُطلب أي منهما.']]}},
    {tip:String.raw`<p>التصحيح بإحدى طريقتين متكافئتين:</p><ol><li>إبقاء التوصيل <span class="ltr">NC</span> كما في الشكل، وتغيير السطرين إلى <span class="ltr">A I 0.6</span> في Network 7 و<span class="ltr">A I 0.4</span> في Network 8 — بنفس طريقة الكتاب مع <span class="ltr">S7</span>–<span class="ltr">S9</span> و<span class="ltr">SS</span>.</li><li>أو إبقاء البرنامج كما هو وتوصيل <span class="ltr">F1</span> و<span class="ltr">F3</span> بتلامس مفتوح <span class="ltr">NO</span>.</li></ol><p>في المختبر زر للتبديل بين «كما في الكتاب» و«المصحح».</p>`,title:'كيف نصحح؟'},
    {title:'مختبر مصغّر: نسخة الكتاب أم المصححة؟',widget:(el,B)=>DCML.lab(el,B,{
 intro:String.raw`<span class="ltr">Network 8</span> مع طلب الدور الأول (<span class="ltr">K1 = 1</span>). <span class="ltr">F1</span> موصّل <span class="ltr">NC</span>: يقرأ <span class="ltr">I0.4 = 1</span> والكابينة بعيدة، و<span class="ltr">0</span> عند الدور الأول.`,
 ins:[{k:'v',l:'البرنامج',seg:[['b',String.raw`كما في الكتاب (<span class="ltr">AN I 0.4</span>)`],['f',String.raw`المصحح (<span class="ltr">A I 0.4</span>)`]],v:'b'},
  {k:'p',l:'مكان الكابينة',seg:[['2','عند الدور الثاني'],['1','عند الدور الأول']],v:'2'}],
 calc:(s)=>{const P=B.createPLC((s.v==='f'?PROG_FIX:PROG_BOOK).slice(7,8));const at1=String(s.p)==='1';
  const set=()=>{P.set('M0.1',1);P.set('Q4.1',1);P.set('Q4.2',0);P.set('Q5.4',0);P.set('I0.4',at1?0:1);P.set('I0.7',0)};set();P.scan(0.1);
  const dn=P.get('Q5.5'),good=at1?!dn:!!dn;
  return {facts:[[DCML.lt('I0.4'),at1?'0':'1'],[DCML.lt('K5 (Q5.5)'),String(dn),dn?'hi':''],['السلوك',good?'صحيح':'خطأ',good?'':'bad']],
   pic:`<div class="svgbox fixed">${B.ladNetwork(P.nets[0],P,NAMES9)}</div>`,cls:good?'':'bad',
   msg:good?(at1?'الكابينة عند الأول: لا ينزل المحرك، فتقف كما يجب.':'الكابينة بعيدة عن الأول: ينزل المحرك إليه كما يجب.'):(at1?String.raw`الكابينة وصلت الدور الأول و<span class="ltr">K5</span> ما زال يعمل! في المصعد الحقيقي تتجاوز الكابينة الدور.`:String.raw`الكابينة بعيدة عن الأول و<span class="ltr">K5</span> لا يعمل: الطلب لا يُنفَّذ.`)}}})}
   ]},

  {recap:[
   String.raw`كل فرع من الدائرة التقليدية صار Network: <span class="ltr">K0 = M0.0</span>، وخط التغذية <span class="ltr">M0.1</span> = <span class="ltr">SS</span> و<span class="ltr">K0</span> (ص 149).`,
   String.raw`المفتاح الموصّل <span class="ltr">NC</span> يقرأ <span class="ltr">1</span> في حالته العادية، فيُكتب بتلامس مفتوح إذا أردنا «مرّر ما دام مغلقاً» (<span class="ltr">S7</span>–<span class="ltr">S9</span> و<span class="ltr">SS</span>).`,
   String.raw`<span class="ltr">T1</span> مزمن تأخير فصل <span class="ltr">S_OFFDT</span> بزمن <span class="ltr">S5T#5S</span>: يعمل مع <span class="ltr">K4</span> أو <span class="ltr">K5</span> ويبقى 5 ث بعد الوقوف، ويُصفَّر بـ <span class="ltr">M0.1</span>.`,
   String.raw`طلب الدور: (<span class="ltr">T1</span> مغلق و<span class="ltr">SO</span>) أو (<span class="ltr">T1</span> مفتوح والإمساك) أو <span class="ltr">SI</span>؛ والصعود والنزول عبر <span class="ltr">F3</span>/<span class="ltr">b</span> و<span class="ltr">F1</span>/<span class="ltr">a</span> مع تعشيق <span class="ltr">K4</span>/<span class="ltr">K5</span> (ص 150–151).`,
   String.raw`كتابة <span class="ltr">F1</span> و<span class="ltr">F3</span> بـ <span class="ltr">AN</span> مع توصيلهما <span class="ltr">NC</span> خطأ في الكتاب؛ الصحيح <span class="ltr">A I 0.4</span> و<span class="ltr">A I 0.6</span> (أو توصيلهما <span class="ltr">NO</span>).`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوانا Network 2 و Network 3 في LAD مكتوبان «Title:» بلا عنوان، وفي STL: «Stop elevator» و «Delay time for calling». استخدمنا عناوين STL.'+'</div>'},
  {h:'لماذا S7 و SS بتلامس مفتوح، و F1 و F3 بتلامس مغلق؟',ref:'ص 146، 151',html:'<p>القاعدة في الـ PLC: البرنامج يرى <b>الإشارة</b> لا نوع التلامس في الموقع. المفتاح الموصّل NC يعطي 1 في حالته العادية. فإذا أردنا «يمرّر ما دام المفتاح مغلقاً» نكتب تلامساً مفتوحاً A، كما فعل الكتاب مع S7 و S8 و S9 و SS.</p>'},
  {draw:B=>`<div class="svgbox">${wiringSVG({act:()=>0,F2:'off',Q:()=>0},true)}</div>`,caption:'توصيل المداخل بالـ PLC: F1 و F3 تلامسان مغلقان NC (شكل غير مرقّم)',ref:'ص 146'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+ERR_F13+'</div>'},
  {html:`<table class="tt"><thead><tr><th>الكابينة</th><th>F1 (NC)</th><th>I0.4</th><th>كما في الكتاب: AN I 0.4</th><th>المصحح: A I 0.4</th></tr></thead><tbody>
   <tr><td>بعيدة عن الدور الأول (يجب أن تنزل)</td><td>مغلق</td><td>1</td><td>0 ← K5 لا يعمل</td><td>1 ← K5 يعمل</td></tr>
   <tr><td>عند الدور الأول (يجب أن تقف)</td><td>مفتوح</td><td>0</td><td>1 ← K5 يعمل (تجاوز!)</td><td>0 ← K5 يفصل</td></tr></tbody></table>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>زمن المزمن:</b> الملاحظة 2 (ص 148) تقول إن المزمن «يقفل لحظة وقوف المحرك»، بينما البرنامج يضع <span class="ltr">S5T#5S</span> على مزمن تأخير فصل، فيبقى T1 = 1 مدة 5 ث بعد الوقوف. المحاكاة هنا تتبع البرنامج (5 ث)، والمقارنة بالزمن اللحظي موجودة في مختبر الدرس 9.2.'+'</div>'},
  {html:'<div class="callout fixnote">'+'العلامة M0.1 مستخدمة في البرنامج ولم تُذكر في جدول ص 145. أضفناها إلى جدول المداخل والمخارج في المحاكاة.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'لغة FBD',title:'٢- دائرة FBD: الشبكات نفسها بالبوابات',ref:'ص 152–155',
   q:'في LAD رأيت تلامسات على التوالي والتوازي وتلامسات مغلقة… فماذا يقابل كل واحد منها في البوابات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 7 بلغة FBD: بوابتا و ثم بوابة أو ثم بوابة و أخيرة إلى المخرج Q5.4" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="البوابة ⟦&amp;1⟧ (و): ⟦Q4.3⟧ و ⟦I0.6⟧ المنفي — تقابل في ⟦LAD⟧ التلامسين ⟦K3⟧ و ⟦F3⟧ على التوالي."><rect x="90" y="56" width="40" height="56" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="110.0" y="72" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&</text></g><path d="M40 72H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="36" y="76" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><path d="M40 98H83" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="86" cy="98" r="5" fill="#FBF6EE" stroke="#E8735A" stroke-width="2.5"/><text x="36" y="102" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.6</text><g data-tip="الدائرة الصغيرة على مدخل ⟦I0.6⟧ = نفي، تقابل التلامس المغلق في ⟦LAD⟧ و ⟦AN⟧ في ⟦STL⟧. وهنا موضع خطأ الكتاب في ⟦F3⟧."><circle cx="86" cy="98" r="10" fill="transparent"/></g><g data-tip="البوابة ⟦&amp;2⟧ (و): ⟦Q4.2⟧ و ⟦I0.5⟧ — تقابل ⟦K2⟧ مع النقطة ⟦b⟧."><rect x="90" y="136" width="40" height="56" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="110.0" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&</text></g><path d="M40 152H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="36" y="156" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><path d="M40 178H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="36" y="182" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.5</text><path d="M130 84H150V112H170M130 164H150V136H170" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="البوابة ⟦&gt;=1⟧ (أو): يكفي أن يكون أحد مدخليها 1 — تقابل الفرعين المتوازيين في ⟦LAD⟧."><rect x="170" y="100" width="44" height="48" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="192.0" y="116" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&gt;=1</text></g><path d="M214 124H232V150H246" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="البوابة الأخيرة (و): ⟦M0.1⟧ و خرج ⟦&gt;=1⟧ و ⟦Q5.5⟧ المنفي (التعشيق)."><rect x="246" y="110" width="44" height="90" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="268.0" y="126" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&</text></g><path d="M200 230H232V130H246" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="196" y="234" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.1</text><path d="M200 260H236V180H239" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="241" cy="180" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196" y="264" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.5</text><path d="M290 155H300" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="الخرج ⟦= Q5.4⟧: متمم الصعود ⟦K4⟧."><rect x="300" y="142" width="44" height="26" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="322" y="160" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4</text></g><text x="180" y="296" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 7 : ELEVATOR UP</text></svg>`,
   cap:'Network 7 (الصعود) بالبوابات كما في ص 154. الدائرة الصغيرة البرتقالية = النفي على <span class="ltr">I0.6</span> (موضع خطأ الكتاب).<br><b>مرّر المؤشر على كل بوابة والدائرة الصغيرة والخرج (أو المسها في الجوال) لتعرف ما يقابلها في LAD.</b>',
   side:[
    {book:String.raw`<p><b>٢- دائرة ( FBD ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات</b></p>`,ref:'ص 152'},
    {predict:{q:'في Network 7 بلغة LAD فرعان متوازيان. ما الذي يقابلهما في FBD؟',opts:[
     [String.raw`بوابة <span class="ltr">&amp;</span> (و)`,false,'بوابة & تقابل التوالي: كل المداخل معاً.'],
     ['دائرة نفي صغيرة',false,'دائرة النفي تقابل التلامس المغلق.'],
     [String.raw`بوابة <span class="ltr">&gt;=1</span> (أو) تجمع خرجي البوابتين <span class="ltr">&amp;1</span> و<span class="ltr">&amp;2</span>`,true,'التوازي = «أو»: يكفي أن يمرّر أحد الفرعين.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 1 : SAFE</b> إلى <b>Network 8 : ELEVATOR DOWN</b></p>`+netsHTML(PROG_BOOK,'fbd'),ref:'ص 152–155'},
    {tip:String.raw`<ul><li>تلامسات على <b>التوالي</b> ← بوابة <b class="ltr">&amp;</b> (و).</li><li>فروع على <b>التوازي</b> ← بوابة <b class="ltr">&gt;=1</b> (أو).</li><li>تلامس <b>مغلق</b> ← دائرة نفي صغيرة على مدخل البوابة.</li><li>الملف ← مربع <b class="ltr">=</b> عليه عنوان المخرج.</li></ul><p>مثلاً Network 4: <span class="ltr">&amp;1 = &amp;(T1 نفي, SO1)</span> و<span class="ltr">&amp;2 = &amp;(T1, K1)</span>، ثم <span class="ltr">&gt;=1 (&amp;1, &amp;2, SI1)</span>، ثم <span class="ltr">&amp; (M0.1, &gt;=1) → = Q4.1</span>.</p>`,title:'قواعد التحويل من LAD'},
    {predict:{q:'في Network 3 بلغة FBD على المدخل R للمزمن دائرة نفي، ومدخله M0.1. متى يُصفَّر المزمن؟',opts:[
     [String.raw`عندما يصبح <span class="ltr">M0.1 = 0</span> (فتح أمان أو ضغط <span class="ltr">SS</span>)`,true,'النفي يقلب 0 إلى 1 على المدخل R، فيُصفَّر المزمن، كالتلامس المغلق في LAD.'],
     [String.raw`عندما يصبح <span class="ltr">M0.1 = 1</span>`,false,'M0.1 = 1 هو الحالة العادية؛ لو صفّر المزمن عندها لما عمل أبداً.'],
     ['عند كل وقوف للكابينة',false,'الوقوف يُرجع المدخل S إلى 0، فيبدأ زمن التأخير ولا يُصفَّر فوراً.']]}},
    {watch:String.raw`<p>عنوانا <span class="ltr">FBD</span> (ص 152) و<span class="ltr">STL</span> (ص 156) يذكران «والعدادات»، ولا يوجد في برنامج المصعد أي عداد؛ يوجد مزمن واحد <span class="ltr">T1</span> فقط. والخطأ نفسه في <span class="ltr">F1</span> و<span class="ltr">F3</span> يظهر هنا دائرة نفي على <span class="ltr">I0.6</span> و<span class="ltr">I0.4</span> (ص 154–155).</p>`,fix:true},
    {title:'مختبر مصغّر: طلب الدور الثاني بالبوابات',widget:(el,B)=>PLCML.net(el,B,{view:'fbd',
 intro:String.raw`<span class="ltr">Network 5</span> بلغة <span class="ltr">FBD</span>. غيّر المداخل وراقب خرج كل بوابة <span class="ltr">&amp;</span> و<span class="ltr">&gt;=1</span>.`,
 predict:{q:String.raw`الكابينة تتحرك (<span class="ltr">T1 = 1</span>) وضغط شخص <span class="ltr">SO2</span> من الخارج. هل يعمل <span class="ltr">K2</span>؟`,opts:[
  [String.raw`نعم، لأن البوابة <span class="ltr">&gt;=1</span> يكفيها مدخل واحد`,false,String.raw`مدخل <span class="ltr">SO2</span> يمر أولاً في بوابة <span class="ltr">&amp;</span> مع <span class="ltr">T1</span> المنفي، وخرجها الآن <span class="ltr">0</span>.`],
  [String.raw`لا، دائرة النفي على <span class="ltr">T1</span> تجعل بوابة <span class="ltr">SO2</span> صفراً أثناء الحركة`,true,String.raw`هذا هو حجب ضواغط الخارج أثناء الحركة (<span class="ltr mono">AN T 1</span>).`]]},
 prog:PROG_BOOK.slice(4,5),names:NAMES9,
 ins:[{a:'T1',on:String.raw`تتحرك (<span class="ltr">T1 = 1</span>)`,off:String.raw`واقفة (<span class="ltr">T1 = 0</span>)`},
  {a:'I0.2',l:String.raw`اضغط <span class="ltr">SO2</span> (خارج)`,push:true},{a:'I1.2',l:String.raw`اضغط <span class="ltr">SI2</span> (داخل)`,push:true},
  {a:'M0.1',v:1,on:String.raw`<span class="ltr">M0.1 = 1</span>`,off:String.raw`<span class="ltr">M0.1 = 0</span>`}],
 outs:[['Q4.2',String.raw`طلب الدور الثاني <span class="ltr">K2</span>`]],
 msg:(P,s)=>P.get('Q4.2')&&s['T1']?String.raw`<span class="ltr">K2</span> ممسوك: بوابة <span class="ltr">&amp;</span> الثانية (<span class="ltr">T1</span> و<span class="ltr">K2</span>) خرجها <span class="ltr">1</span>.`:''})}
   ]},

  {st:2,short:'لغة STL',title:'٣- دائرة STL: الشبكات نفسها بأسطر',ref:'ص 156–157',
   q:'كيف تُكتب «فرعان متوازيان كل منهما تلامسان على التوالي» بأسطر من الحروف فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 8 بلغة STL: عشرة أسطر، والقوس الملوّن يضم فرعي النزول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="70" y="34" width="220" height="262" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="78" y="66" width="204" height="168" rx="8" fill="#F2C14E" opacity=".35"/><g data-tip="خط التغذية ⟦M0.1⟧: ⟦A⟧ = و."><rect x="78" y="42" width="204" height="22" fill="transparent"/><text x="100" y="58" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text><text x="160" y="58" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M 0.1</text></g><g data-tip="يفتح قوساً: ما بداخله يُحسب أولاً ثم يُضم بعملية «و»."><rect x="78" y="66" width="204" height="22" fill="transparent"/><text x="100" y="82" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A(</text><text x="160" y="82" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="⟦K1⟧ يعمل (طلب الدور الأول)."><rect x="78" y="90" width="204" height="22" fill="transparent"/><text x="100" y="106" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text><text x="160" y="106" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q 4.1</text></g><g data-tip="⟦AN⟧ = و-ليس: يمرّر عندما يكون ⟦I0.4⟧ (⟦F1⟧) = 0. هذا موضع خطأ الكتاب."><rect x="78" y="114" width="204" height="22" fill="transparent"/><text x="100" y="130" text-anchor="start" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">AN</text><text x="160" y="130" text-anchor="start" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I 0.4</text></g><g data-tip="⟦O⟧ وحده في سطر = «أو» بين مجموعة «و» قبله ومجموعة «و» بعده."><rect x="78" y="138" width="204" height="22" fill="transparent"/><text x="100" y="154" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">O</text><text x="160" y="154" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="⟦K2⟧ يعمل (طلب الدور الثاني)."><rect x="78" y="162" width="204" height="22" fill="transparent"/><text x="100" y="178" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text><text x="160" y="178" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q 4.2</text></g><g data-tip="النقطة ⟦a⟧ من ⟦F2⟧: الكابينة فوق الدور الثاني."><rect x="78" y="186" width="204" height="22" fill="transparent"/><text x="100" y="202" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text><text x="160" y="202" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I 0.7</text></g><g data-tip="يغلق القوس."><rect x="78" y="210" width="204" height="22" fill="transparent"/><text x="100" y="226" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">)</text><text x="160" y="226" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text></g><g data-tip="تعشيق: لا ينزل المصعد ما دام ⟦K4⟧ (الصعود) يعمل."><rect x="78" y="234" width="204" height="22" fill="transparent"/><text x="100" y="250" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AN</text><text x="160" y="250" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q 5.4</text></g><g data-tip="يكتب النتيجة في ⟦Q5.5⟧: متمم النزول ⟦K5⟧."><rect x="78" y="258" width="204" height="22" fill="transparent"/><text x="100" y="274" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="160" y="274" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q 5.5</text></g><text x="180" y="24" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 8 : ELEVATOR DOWN</text></svg>`,
   cap:'Network 8 (النزول) كما في ص 157. المساحة الصفراء = ما بين القوسين، والسطر البرتقالي موضع خطأ الكتاب.<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتعرف ماذا يفعل.</b>',
   side:[
    {book:String.raw`<p><b>٣- دائرة ( STL ) باستخدام ( PLC ) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات والعدادات</b></p>`,ref:'ص 156'},
    {predict:{q:String.raw`في Network 8 جاء السطر <span class="ltr">O</span> وحده بين السطرين <span class="ltr">A Q 4.1</span> و<span class="ltr">AN I 0.4</span> وبين السطرين <span class="ltr">A Q 4.2</span> و<span class="ltr">A I 0.7</span>. ماذا يعني؟`,opts:[
     ['نهاية الشبكة',false,'نهاية الشبكة هي السطر = Q 5.5.'],
     ['«أو» بين مجموعة «و» قبله ومجموعة «و» بعده',true,'هذا هو الفرعان المتوازيان في LAD: (K1 و F1) أو (K2 و a).'],
     ['نفي للسطر الذي قبله',false,'النفي يُكتب بالحرف N بعد A أو O، مثل AN.']]}}
   ],
   body:[
    {book:String.raw`<p><b>Network 1 : SAFE</b> إلى <b>Network 8 : ELEVATOR DOWN</b></p>`+netsHTML(PROG_BOOK,'stl'),ref:'ص 156–157'},
    {tip:String.raw`<ul><li><b class="ltr">A</b> = و، و<b class="ltr">AN</b> = و-ليس (تلامس مغلق).</li><li><b class="ltr">O</b> وحده في سطر = «أو» بين مجموعتي «و».</li><li><b class="ltr">A( … )</b> = قوس: يُحسب ما بداخله أولاً.</li><li><b class="ltr">L S5T#5S</b> = تحميل زمن المزمن، و<b class="ltr">SF T 1</b> = تشغيل مزمن تأخير الفصل، و<b class="ltr">R T 1</b> = إلغاء (تصفير) المزمن.</li><li><b class="ltr">NOP 0</b> = سطر بلا عمل.</li></ul>`,title:'حروف STL في هذا البرنامج'},
    {add:String.raw`<p><span class="ltr">SF</span> هو رمز تعليمة مزمن تأخير الفصل في الرموز الألمانية لبرنامج <span class="ltr">STEP 7</span> (ويقابله <span class="ltr">SA</span> في الرموز الإنجليزية)، وهو نفس الصندوق <span class="ltr">S_OFFDT</span> في <span class="ltr">LAD</span> و<span class="ltr">FBD</span>. وأسطر <span class="ltr">NOP 0</span> الثلاثة يضعها البرنامج مكان مخارج صندوق المزمن غير المستخدمة (<span class="ltr">Q</span> و<span class="ltr">BI</span> و<span class="ltr">BCD</span>).</p>`,title:'من أين جاء SF و NOP؟'},
    {title:'نفّذ Network 8 سطراً سطراً',widget:(el,B)=>{
      const net=PROG_BOOK[7],IN=[['M0.1','M0.1','خط التغذية'],['Q4.1','K1','طلب الدور الأول'],['I0.4','F1','مفتاح الدور الأول (NC)'],['Q4.2','K2','طلب الدور الثاني'],['I0.7','a','نقطة F2 فوق الدور الثاني'],['Q5.4','K4','الصعود يعمل']];
      const v={'M0.1':1,'Q4.1':1,'I0.4':1,'Q4.2':0,'I0.7':0,'Q5.4':0};let k=0;
      const why=(op,arg)=>{const a=arg?arg.replace(/\s+/g,''):'',nm=IN.find(x=>x[0]===a);const n=nm?` <span class="ltr">${nm[1]} = ${v[a]}</span>`:'';
        return {'A':'و مع'+n,'AN':'و مع عكس'+n,'O':'أو: يبدأ مجموعة موازية لما قبلها','A(':'يفتح قوساً','=':'يكتب النتيجة في المخرج'}[op]||(op===')'?'يغلق القوس ويضم نتيجته بـ «و»':'')};
      const draw=()=>{const P=B.createPLC([{title:net.title,stl:net.stl}]);IN.forEach(([a])=>P.set(a,v[a]));P.scan(0.05);
        const N=P.nets[0],tr=P.trace[0]||[],n=N.toks.length;
        const rows=N.toks.map((t,j)=>{const p=t.raw.split(/\s+/),op=p[0],arg=p.slice(1).join(' ');const done=j<k,cur=j===k-1,r=tr[j];
          return `<tr style="${cur?'background:var(--blue-soft);font-weight:700':''}${done?'':';opacity:.45'}"><td class="mono" dir="ltr" style="text-align:left;white-space:nowrap">${t.raw}</td><td>${done?why(op,arg):''}</td><td class="mono" dir="ltr">${done&&r!=null?'RLO = '+r:''}</td></tr>`}).join('');
        el.innerHTML=`<div class="w-row" style="margin-top:0">${IN.map(([a,s,l])=>`<button class="sw" type="button" data-i="${a}" aria-pressed="${!!v[a]}"><span class="knob"></span><b><span class="ltr">${a} (${s}) = ${v[a]}</span></b><small>${l}</small></button>`).join('')}</div>
         <div class="w-row"><span class="w-l">حالة جاهزة:</span><button class="btn" type="button" data-p="1">الكابينة عند الثاني وطُلب الأول</button><button class="btn" type="button" data-p="2">الكابينة وصلت الدور الأول</button><button class="btn" type="button" data-p="3">فوق الثاني وطُلب الثاني</button></div>
         <div class="tablebox"><table class="tt" style="font-size:13.5px"><thead><tr><th>السطر</th><th>ماذا يفعل</th><th>النتيجة</th></tr></thead><tbody>${rows}</tbody></table></div>
         <div class="w-row"><button class="btn pri" type="button" data-nx ${k>=n?'disabled':''}>نفّذ السطر التالي</button><button class="btn" type="button" data-all>نفّذ الكل</button><button class="btn" type="button" data-rs>من البداية</button></div>
         <p class="sub" style="margin-top:8px">${k>=n?`انتهى: متمم النزول <span class="ltr">K5 (Q5.5)</span> <b>${P.get('Q5.5')?'يعمل':'لا يعمل'}</b>.`:`نُفّذ ${k} من ${n} أسطر.`} البرنامج هنا كما في الكتاب (<span class="ltr">AN I 0.4</span>). <span class="ltr">F1</span> موصّل <span class="ltr">NC</span>: يقرأ <span class="ltr">1</span> والكابينة بعيدة عن الدور الأول، و<span class="ltr">0</span> عند وصولها.</p>`;
        el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{v[b.dataset.i]^=1;draw()});
        el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const P0={1:[1,1,1,0,0,0],2:[1,1,0,0,0,0],3:[1,0,1,1,1,0]}[b.dataset.p];IN.forEach(([a],i)=>v[a]=P0[i]);k=n;draw()});
        el.querySelector('[data-nx]').onclick=()=>{k=Math.min(n,k+1);draw()};
        el.querySelector('[data-all]').onclick=()=>{k=n;draw()};
        el.querySelector('[data-rs]').onclick=()=>{k=0;draw()}};
      draw();
    }},
    {watch:String.raw`<p>جرّب الحالة «الكابينة عند الثاني وطُلب الأول»: <span class="ltr">I0.4 = 1</span> فيعطي السطر <span class="ltr">AN I 0.4</span> نتيجة <span class="ltr">0</span> ولا يعمل <span class="ltr">K5</span>. ثم «الكابينة وصلت الدور الأول»: <span class="ltr">I0.4 = 0</span> فيعمل <span class="ltr">K5</span> وهي عند الدور!</p>`},
    {watch:String.raw`<p>هذا خطأ الكتاب الذي شرحناه في الدرس 9.3؛ الصحيح <span class="ltr">A I 0.4</span> (وفي Network 7 <span class="ltr">A I 0.6</span>).</p>`,fix:true}
   ]},

  {st:3,short:'مقارنة اللغات',title:'مقارنة اللغات الثلاث لكل شبكة',
   q:'إذا فهمت شبكة واحدة في إحدى اللغات… هل تستطيع قراءتها في اللغتين الأخريين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جدول مقارنة: التوالي والتوازي والتلامس المغلق والخرج في LAD و FBD و STL" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="296" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">LAD</text><text x="196" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">FBD</text><text x="96" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">STL</text><text x="40" y="95" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">توالٍ</text><text x="40" y="155" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">توازٍ</text><text x="40" y="215" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مغلق</text><text x="40" y="273" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">خرج</text><path d="M30 66H340" fill="none" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><g data-tip="توالٍ: تلامسان متتاليان في ⟦LAD⟧ = بوابة ⟦&amp;⟧ في ⟦FBD⟧ = ⟦A⟧ في كل سطر في ⟦STL⟧."><path d="M256 90H270M282 90H310M322 90H336" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><rect x="254" y="56" width="44" height="70" fill="transparent"/><path d="M270 78V102M282 78V102" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="276" y="72" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="276" y="118" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text><rect x="294" y="56" width="44" height="70" fill="transparent"/><path d="M310 78V102M322 78V102" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="316" y="72" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="316" y="118" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text><g><rect x="176" y="72" width="40" height="36" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196.0" y="88" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&</text></g><text x="96" y="95" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A  A</text></g><g data-tip="توازٍ: فرعان متوازيان في ⟦LAD⟧ = بوابة ⟦&gt;=1⟧ في ⟦FBD⟧ = ⟦O⟧ في ⟦STL⟧."><path d="M262 138H290M302 138H330" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M262 164H290M302 164H330" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M262 138V164M330 138V164" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M290 126V150M302 126V150M290 152V176M302 152V176" stroke="#2C4A40" stroke-width="3"/><g><rect x="174" y="132" width="44" height="36" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196.0" y="148" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&gt;=1</text></g><text x="96" y="155" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">O  O</text></g><g data-tip="تلامس مغلق في ⟦LAD⟧ = دائرة نفي صغيرة على مدخل البوابة في ⟦FBD⟧ = ⟦AN⟧ في ⟦STL⟧."><path d="M266 210H290M302 210H326" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><rect x="274" y="176" width="44" height="70" fill="transparent"/><path d="M290 198V222M302 198V222" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M286 222L306 198" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="296" y="192" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="296" y="238" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text><path d="M170 210H190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="195" cy="210" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M200 210H220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="96" y="215" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AN</text></g><g data-tip="الخرج: ملف في ⟦LAD⟧ = مربع ⟦=⟧ في ⟦FBD⟧ = السطر ⟦=⟧ في ⟦STL⟧."><path d="M266 268H290M302 268H326" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><rect x="272" y="234" width="48" height="70" fill="transparent"/><path d="M290 256q-9 12 0 24M302 256q9 12 0 24" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="296" y="250" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="296" y="296" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"></text><rect x="176" y="255" width="40" height="26" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="196" y="273" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="96" y="273" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text></g></svg>`,
   cap:'أربعة أشياء تكفي لتقرأ أي شبكة في هذا البرنامج باللغات الثلاث.<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف ما يقابله.</b>',
   side:[
    {predict:{q:'التلامس المغلق Q5.5 في Network 7 بلغة LAD. كيف يُكتب في STL؟',opts:[
     [String.raw`<span class="ltr">A Q 5.5</span>`,false,'A وحدها تقابل التلامس المفتوح.'],
     [String.raw`<span class="ltr">O Q 5.5</span>`,false,'O للتوازي، والتلامس هنا على التوالي.'],
     [String.raw`<span class="ltr">AN Q 5.5</span>`,true,'التلامس المغلق على التوالي = AN، وفي FBD دائرة نفي على المدخل.']]}}
   ],
   body:[
    {tip:String.raw`<p>اختر شبكة لترى الشيء نفسه بالطرق الثلاث (برنامج الكتاب). ابدأ بـ <span class="ltr">N7</span>: في <span class="ltr">LAD</span> فرعان متوازيان، وفي <span class="ltr">FBD</span> بوابة <span class="ltr">&gt;=1</span>، وفي <span class="ltr">STL</span> السطر <span class="ltr">O</span> داخل القوس.</p>`,title:'كيف تستخدم المقارنة؟'},
    {title:'الشبكة نفسها باللغات الثلاث',widget:(el,B)=>{let k=7;const draw=()=>{el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg" style="flex-wrap:wrap">${[1,2,3,4,5,6,7,8].map(n=>`<button type="button" data-n="${n}" aria-pressed="${n===k}">N${n}</button>`).join('')}</span></div>
     <h3 class="sm">LAD</h3>${netsHTML(PROG_BOOK,'lad',[k])}<h3 class="sm">FBD</h3>${netsHTML(PROG_BOOK,'fbd',[k])}<h3 class="sm">STL</h3>${netsHTML(PROG_BOOK,'stl',[k])}`;
     el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{k=+b.dataset.n;draw()})};draw()}},
    {add:String.raw`<p>في المصانع يُختار <span class="ltr">LAD</span> غالباً لأن فنيي الكهرباء يقرؤونه كمخطط الدوائر، ويُختار <span class="ltr">FBD</span> عندما يكثر المنطق (و / أو)، و<span class="ltr">STL</span> عندما يُراد برنامج قصير مكتوب. والـ PLC ينفذ البرنامج نفسه أياً كانت اللغة التي كُتب بها.</p>`,title:'أي لغة أختار؟'}
   ]},

  {st:4,short:'المطلوب',title:'المطلوب',ref:'ص 158',
   q:'كتبت البرنامج كاملاً… كيف تتأكد أنه يشغّل المصعد كما يجب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات المطلوب: كتابة البرنامج على الحاسب، ثم نقله إلى وحدة المحاكاة، ثم التأكد من صحة عمل المصعد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الحاسب: نكتب عليه البرنامج (بأي لغة من الثلاث) ثم ننقله."><rect x="250" y="70" width="80" height="56" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="262" y="80" width="56" height="34" fill="#E6E2F8"/><path d="M276 126V140M260 142H316" stroke="#2C4A40" stroke-width="3"/></g><text x="290" y="166" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">اكتب</text><path d="M244 98H200" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="192,98 204,92 204,104" fill="#2C4A40"/><g data-tip="وحدة المحاكاة: نقل البرنامج إليها لتنفذه بمداخل ومخارج حقيقية."><rect x="130" y="66" width="60" height="64" rx="8" fill="#2C4A40"/><text x="160" y="103" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text></g><text x="160" y="166" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">انقل</text><path d="M124 98H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="82,98 94,92 94,104" fill="#2C4A40"/><g data-tip="التأكد من صحة عمل الدائرة: جرّب كل الرحلات بين الأدوار الثلاثة، وجرّب مفاتيح الأمان."><rect x="34" y="60" width="44" height="76" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M34 86H78M34 112H78" stroke="#2C4A40" stroke-width="2"/><rect x="44" y="90" width="24" height="20" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><text x="56" y="166" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">تأكد</text><g data-tip="قائمة التأكد (من إعدادنا): الرحلات الثلاث في خطوات التشغيل ص 147، والرحلات المعاكسة، وفتح مفتاح أمان أثناء الحركة."><rect x="60" y="192" width="240" height="88" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="262" y="206" width="14" height="14" rx="3" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="250" y="218" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="600">من الثاني إلى الأول</text><rect x="262" y="230" width="14" height="14" rx="3" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="250" y="242" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="600">من الأول إلى الثالث</text><rect x="262" y="254" width="14" height="14" rx="3" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="250" y="266" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="600">من الثالث إلى الثاني</text></g></svg>`,
   cap:'خطوات المطلوب الثلاث، وتحتها رحلات خطوات التشغيل في ص 147 لتجربتها.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف ماذا تفعل فيه.</b>',
   side:[
    {book:String.raw`<p><b>المطلوب:</b> قم بتنفيذ الدائرة على جهاز الحاسب ثم نقلها إلى وحدة المحاكاة والتأكد من صحة عمل الدائرة.</p>`,ref:'ص 158'}
   ],
   body:[
    {tip:String.raw`<p><span class="fixnote">عند تنفيذ المطلوب على جهاز حقيقي ستلاحظ أن برنامج الكتاب كما هو لا يُنزل الكابينة إلى الأول ولا يرفعها إلى الثالث إذا وُصّل <span class="ltr">F1</span> و<span class="ltr">F3</span> مغلقين <span class="ltr">NC</span> كما في الشكل. استخدم النسخة المصححة (<span class="ltr">A I 0.4</span> و<span class="ltr">A I 0.6</span>) أو وصّلهما <span class="ltr">NO</span>. </span>وجرّب الرحلات الثلاث في خطوات التشغيل (ص 147)، ثم افتح مفتاح أمان أثناء الحركة لتتأكد أن كل شيء يقف.</p>`,title:'قبل أن تبدأ'},
    {predict:{q:'نقلت برنامج الكتاب كما هو، والكابينة عند الدور الثاني. ضغطت SO2 فلم يتحرك المصعد. هل هذا عطل؟',opts:[
     ['نعم، عطل في F2',false,'F2 على off عند الدور الثاني هو الوضع الطبيعي، فلا يمرّر فرع K2 إلى K4 ولا إلى K5.'],
     ['لا: الكابينة في الدور المطلوب نفسه، فلا حركة',true,'فرعا K2 يمران عبر F2، و F2 على off عند الدور الثاني، فلا يعمل K4 ولا K5.'],
     ['نعم، عطل في SO2',false,'K2 يعمل فعلاً عند الضغط؛ لكن لا حركة مطلوبة.']]}},
    {add:String.raw`<p>في تبويب «المختبر» لهذا الدرس زر لعطل «<span class="ltr">F2</span> عالق على <span class="ltr">off</span>»: فعّله ثم اطلب الدور الثاني والكابينة عند الأول، ولاحظ أن <span class="ltr">K2</span> يعمل لكن <span class="ltr">K4</span> لا يعمل لأن <span class="ltr">I0.5</span> لا يصبح <span class="ltr">1</span>. هذا تمهيد للوحدة العاشرة عن تشخيص الأعطال.</p>`,title:'جرّب عطلاً'},
    {title:'مختبر مصغّر: اختبار القبول قبل التسليم',widget:(el,B)=>DCML.lab(el,B,{
 intro:String.raw`«التأكد من صحة عمل الدائرة» يعني تجربة كل رحلة. اختر البرنامج والرحلة: يُنفَّذ البرنامج كاملاً على نموذج مبسّط للمصعد (مثل نموذج تبويب «المختبر»)، و<span class="ltr">F1</span> و<span class="ltr">F3</span> موصّلان <span class="ltr">NC</span> كما في شكل ص 146.`,
 ins:[{k:'v',l:'البرنامج',seg:[['b','كما في الكتاب'],['f','المصحح']],v:'b'},
  {k:'t',l:'الرحلة',seg:[['1-0','من الثاني إلى الأول'],['1-2','من الثاني إلى الثالث'],['0-1','من الأول إلى الثاني'],['2-1','من الثالث إلى الثاني'],['0-2','من الأول إلى الثالث']],v:'1-0'}],
 calc:(s)=>{const [a,b]=s.t.split('-').map(Number);const P=B.createPLC(s.v==='f'?PROG_FIX:PROG_BOOK);let pos=a,crash=0,moved=0;
  const so=['I0.1','I0.2','I0.3'][b];
  const inp=(c)=>{['I1.4','I1.5','I1.6','I0.0'].forEach(x=>P.set(x,1));P.set('I0.4',pos>0.005?1:0);P.set('I0.6',pos<1.995?1:0);P.set('I0.5',pos<0.97?1:0);P.set('I0.7',pos>1.03?1:0);P.set(so,c)};
  inp(1);P.scan(0.1);inp(0);P.scan(0.1);
  for(let i=0;i<400;i++){const up=P.get('Q5.4'),dn=P.get('Q5.5');if(up||dn)moved=1;pos+=(up-dn)*0.03;if(pos<-0.27||pos>2.36){crash=1;break}inp(0);P.scan(0.1);if(!up&&!dn&&moved&&!P.get('T1'))break}
  const F=['الأول','الثاني','الثالث'],at=Math.round(pos),ok=!crash&&Math.abs(pos-b)<0.06;
  const res=crash?'تجاوزت الكابينة آخر دور!':!moved?'لم تتحرك الكابينة':Math.abs(pos-at)<0.06?'وقفت عند الدور '+F[at]:'وقفت بين دورين';
  return {facts:[['النتيجة',ok?'ناجح':'راسب',ok?'hi':'bad']],cls:ok?'':'bad',
   msg:`<b>${res}.</b> `+(ok?'هذه الرحلة تعمل كما يجب.':String.raw`السبب خطأ الكتاب في سطري <span class="ltr">F1</span> و<span class="ltr">F3</span> (<span class="ltr mono">AN I 0.4</span> و<span class="ltr mono">AN I 0.6</span>): المفتاح المغلق يعطي <span class="ltr">1</span> والكابينة بعيدة، فلا يمرّر الفرع. جرّب البرنامج المصحح.`)}},
 })}
   ]},

  {recap:[
   String.raw`في <span class="ltr">FBD</span>: التوالي بوابة <span class="ltr">&amp;</span>، والتوازي بوابة <span class="ltr">&gt;=1</span>، والتلامس المغلق دائرة نفي على المدخل (ص 152–155).`,
   String.raw`في <span class="ltr">STL</span>: <span class="ltr">A</span> و<span class="ltr">AN</span> للتوالي، و<span class="ltr">O</span> وحده بين مجموعتين للتوازي، والقوس <span class="ltr">A( … )</span>، و<span class="ltr">SF</span> لمزمن تأخير الفصل (ص 156–157).`,
   String.raw`الشبكات الثماني واحدة في اللغات الثلاث، ولا يوجد في البرنامج أي عداد رغم ذكر «العدادات» في العنوانين.`,
   String.raw`خطأ <span class="ltr">F1</span>/<span class="ltr">F3</span> يظهر نفياً في <span class="ltr">FBD</span> و<span class="ltr">AN</span> في <span class="ltr">STL</span>؛ الصحيح <span class="ltr">A I 0.4</span> و<span class="ltr">A I 0.6</span>.`,
   String.raw`المطلوب: تنفيذ الدائرة على الحاسب ونقلها إلى وحدة المحاكاة والتأكد من صحة عملها (ص 158).`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوانا FBD (ص 152) و STL (ص 156) يذكران «والعدادات»، ولا يوجد في برنامج المصعد أي عداد؛ يوجد مزمن واحد T1 فقط.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+ERR_F13+' في FBD يظهر الخطأ نفسه كدائرة نفي على I0.6 و I0.4 (ص 154–155)، وفي STL كالسطرين <span class="ltr">AN I 0.6</span> و <span class="ltr">AN I 0.4</span> (ص 157).'+'</div>'},
  {h:'مقارنة اللغات الثلاث لكل شبكة',html:'<p>اختر شبكة لترى الشيء نفسه بالطرق الثلاث (برنامج الكتاب):</p>'},
  {widget:(el)=>{let k=7;const draw=()=>{el.innerHTML=`<div class="fig"><div class="seg" role="group">${[1,2,3,4,5,6,7,8].map(n=>`<button data-n="${n}" aria-pressed="${n===k}">N${n}</button>`).join('')}</div>
     <h3 class="sm">LAD</h3>${netsHTML(PROG_BOOK,'lad',[k])}<h3 class="sm">FBD</h3>${netsHTML(PROG_BOOK,'fbd',[k])}<h3 class="sm">STL</h3>${netsHTML(PROG_BOOK,'stl',[k])}</div>`;
     el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{k=+b.dataset.n;draw()})};draw()}},
  {h:'المطلوب',ref:'ص 158',html:'<p>«<b>المطلوب:</b> قم بتنفيذ الدائرة على جهاز الحاسب ثم نقلها إلى وحدة المحاكاة والتأكد من صحة عمل الدائرة.»</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> <span class="fixnote">عند تنفيذ المطلوب على جهاز حقيقي ستلاحظ أن برنامج الكتاب كما هو لا يُنزل الكابينة إلى الأول ولا يرفعها إلى الثالث إذا وُصّل F1 و F3 NC كما في الشكل. استخدم النسخة المصححة (A I 0.4 و A I 0.6) أو وصّلهما NO. </span>في المختبر يمكنك أيضاً تجربة عطل «F2 عالق» وفتح مفتاح أمان لاختبار فهمك.'}
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
