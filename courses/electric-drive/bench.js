/* «المنضدة الافتراضية» — التحريك الكهربائي: خواص محركات التحريك (3.1 و 3.2) والفرملة الكهربائية (6.1 و 6.2 و 6.3). إضافة من خارج الكتاب.
   «آلة الكتاب» = محركات أمثلة الكتاب (وقيم تبويب «المختبر» للخواص)، و«آلة معمل صغيرة» = قيم توضيحية. كل القيم مسجلة في تقرير المقرر.
   نموذج الآلة المستمرة نفسه الذي في تبويب «المختبر»: E = k·n و T = (60/2π)·k·I، و k من المجال (توازي + توالٍ) مع تشبع. */
(function(B){if(!B.BENCH||!window.ACM)return;
const A=window.ACM,PART=A.PART,EXT=A.EXT,MQ=A.MQ,T=A.T;
const KT=60/(2*Math.PI),fx=(v,d)=>(+v).toFixed(d),ok=(m,c,tol)=>Math.abs(m-c)<=Math.max((tol||0.03)*Math.abs(c),0.01)?'✓':'✗';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
const T0=(rec,id,i)=>((rec[id]||{})[i||0])||{};
/* ================= الآلة المستمرة =================
   M: {V, Ra, Rs (المجال التوالي), Rsh و Ishr (مجال التوازي: k = ksh عند Ishr)، ksh، c (V/rpm لكل أمبير توالٍ)، ks (حد التشبع)، Tf، J، IFL، nr، nmax} */
const kOf=(M,Ish,Iser,sg)=>{const raw=(M.ksh?M.ksh*Ish/M.Ishr:0)+(M.c?sg*M.c*Iser:0);const s=Math.sign(raw)||1;return s*Math.max(Math.min(Math.abs(raw),M.ks||9),0.03*(M.ksh||M.c*(M.Is||1)))};
PART.dcx=p=>{const M=p.M;const t=[T(p.id+'.A1','A1',40,190,{pol:'+'}),T(p.id+'.A2','A2',95,190,{pol:'-'})];let x=150;const lb=[{t:'المنتج',x:67,y:155,s:10}];
 if(M.c){t.push(T(p.id+'.D1','D1',x,190),T(p.id+'.D2','D2',x+55,190));lb.push({t:'التوالي',x:x+27,y:155,s:10});x+=110}
 if(M.ksh){t.push(T(p.id+'.E1','E1',x,190),T(p.id+'.E2','E2',x+55,190));lb.push({t:'التوازي',x:x+27,y:155,s:10});x+=110}
 return {w:Math.max(x+10,230),h:230,sub:cut(M.name+' — '+M.V+' V',50),art:`<circle cx="60" cy="80" r="32" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/><circle cx="60" cy="80" r="7" fill="#333"/>`,labels:lb,
  meters:[{id:p.id+':n',kind:'digital',x:115,y:40,w:110,h:42,unit:'rpm',dp:0},{id:p.id+':T',kind:'digital',x:115,y:90,w:110,h:42,unit:'N·m',dp:1}].map(m=>(m.x=Math.min(m.x,x-120),m)),terms:t}};
const sgSer=(a,M,id)=>{if(!M.c)return 0;const of=a.nets().of;return (of[id+'.A2']===of[id+'.D1']||of[id+'.A1']===of[id+'.D2']||of[id+'.A2']===of[id+'.D2']||of[id+'.A1']===of[id+'.D1'])?1:0};
EXT.dcx={els(a,p,c){const M=p.M,ph=c.ph,id=p.id;const of=a.nets().of;
  /* اتجاه المجال التوالي بالنسبة للتوازي يُعرف من التوصيل: تيار المنتج الداخل من A1 يمر D1 ← D2 */
  const n=ph.n||0;const shp=M.ksh?M.ksh*(ph.Ish||0)/M.Ishr:0;
  /* المجال التوالي على التوالي مع المنتج: E = shp·n + c·sg·n·I<sub>a</sub>، فيُحل جزؤه كمقاومة c·sg·n (لا تأخير بين الخطوات) */
  const sgS=M.c?((of[id+'.A2']===of[id+'.D1']||of[id+'.A1']===of[id+'.D2'])?1:(of[id+'.A2']===of[id+'.D2']||of[id+'.A1']===of[id+'.D1'])?-1:0):0;
  let g=1/M.Ra,E0;const kPrev=shp+(sgS?M.c*sgS*(ph.Ia||0):M.c?M.c*(ph.Iser||0):0);const kmin=0.03*(M.ksh||M.c*(M.Is||1));
  if(sgS&&Math.abs(kPrev)<(M.ks||9)){const Re=M.Ra+M.c*sgS*n;g=1/(Math.abs(Re)<1e-3?1e-3:Re);E0=shp*n;if(Math.abs(kPrev)<kmin)E0=Math.sign(kPrev||1)*kmin*n}
  else{const k=Math.sign(kPrev||1)*clamp(Math.abs(kPrev),kmin,M.ks||9);E0=k*n}
  ph.Eb=Math.max(Math.min(kPrev,M.ks||9),-(M.ks||9))*n;ph.sgS=sgS;
  const ea={p:id+'.A1',n:id+'.A2',g,i:E0*g};c.elsDC.push(ea);c.Ed[id+':a']=ea;
  if(M.c){const es={p:id+'.D1',n:id+'.D2',g:1/M.Rs};c.elsDC.push(es);c.Ed[id+':s']=es}
  if(M.ksh){const ef={p:id+'.E1',n:id+'.E2',g:1/M.Rsh};c.elsDC.push(ef);c.Ed[id+':f']=ef}},
 post(a,p,c){const M=p.M,ph=c.ph,id=p.id;const Ia=c.Id(c.Ed[id+':a']);ph.Ia=Ia;ph.Iser=M.c?c.Id(c.Ed[id+':s']):0;ph.Ish=M.ksh?c.Id(c.Ed[id+':f']):0;
  /* تراكمي أم فرقي: هل فيض التوالي في اتجاه فيض التوازي؟ */ph.cum=M.c&&M.ksh&&ph.sgS&&Math.abs(ph.Ish)>0.1*M.Ishr?((ph.sgS*(Math.sign(Ia)||1))===(Math.sign(ph.Ish)||1)):null;
  const TL=a.knob('K:LD')||0;const N=10,h=a.dt/N;let n=ph.n||0,Te=0;
  const k0=kOf(M,ph.Ish,ph.Iser,1);ph.kp=k0;const Vt=c.Vd(id+'.A1',id+'.A2'),n0=n;
  for(let j=0;j<N;j++){/* تيار المنتج يتغير مع السرعة داخل الخطوة: I = I0 − k(n − n0)/R */const I=Ia-k0*(n-n0)/(M.Ra+(sgSer(a,M,id)?M.c*Math.abs(n)*0+M.Rs:0));Te=KT*k0*I;
   /* الحمل: موجب = حمل سلبي يعاكس الحركة، سالب = حمل هابط يدفع الآلة */
   const Tl=TL>=0?TL*clamp(n/30,-1,1):TL;const Tf=(M.Tf||0)*clamp(n/30,-1,1);n+=(Te-Tl-Tf)*h/M.J*KT}
  ph.acc=a.dt>0?(n-(ph.n||0))/a.dt/KT:0;ph.n=n;ph.w=n/KT;ph.Te=Te;ph.Tload=Math.abs(TL>=0?TL*clamp(n/30,-1,1):TL);c.out[id+':n']=n;c.out[id+':T']=Te;
  const sup=a.sw('SW:D');if(sup&&!ph._sup)ph.tSup=ph.t;ph._sup=sup;
  /* المركب الفرقي: مرحل الحماية يفصل المنتج عند 1.3 من سرعة اللاحمل أو 1.5 من تيار الحمل الكامل (عرض لعدم الاستقرار، لا يُحسب خطأً) */
  if(c.ex.diffTrip&&ph.cum===false&&sup&&(Math.abs(n)>1.3*M.V/M.ksh||Math.abs(Ia)>1.5*M.IFL)){a.S.sw['SW:D']=false;ph.trip={n,I:Ia,t:ph.t-(ph.tSup||ph.t)}}
  if(a.hold('ovs',Math.abs(n)>M.nmax&&sup,0.5))a.mistake('overspeed');
  const co=c.P.find(q=>q.kind==='co');const pos=co?Math.round(a.knob('CO:'+co.id)):1;
  if(a.hold('sti',pos===1&&Math.abs(Ia)>2.5*M.IFL&&sup,0.05))a.mistake('start-overI');
  if(a.hold('bri',(pos===2||pos===3)&&Math.abs(Ia)>2.2*M.IFL,0.15))a.mistake('brake-overI');
  if(a.hold('plr',pos===3&&sup&&n<-0.05*M.nr,0.3))a.mistake('plug-rev');
  /* الفرملة: قمة التيار وجهد المنتج لحظة التحويل وزمن التوقف */
  if(ph._pos!==pos){if(pos===2||pos===3){ph.Ib=0;ph.Eb0=ph.Eb;ph.tb0=ph.t;ph.tstop=null;ph.bpos=pos}ph._pos=pos}
  if(ph.tb0!=null&&(pos===2||pos===3)){ph.Ib=Math.max(ph.Ib||0,Math.abs(Ia));if(ph.tstop==null&&Math.abs(n)<0.01*M.nr)ph.tstop=ph.t-ph.tb0}
  if(pos===0&&ph.tb0!=null&&ph.tstop==null&&Math.abs(n)<0.01*M.nr)ph.tstop=ph.t-ph.tb0}};
/* مفتاح التحويل: 0 فصل، 1 تشغيل، 2 فرملة ديناميكية، 3 عكس (تبديل) */
PART.co=p=>({w:300,h:230,sub:'0 فصل، 1 تشغيل، 2 فرملة ديناميكية'+(p.plug?'، 3 عكس':''),knobs:[{id:'CO:'+p.id,lbl:'الوضع',x:230,y:95,max:p.plug?3:2,step:1,unit:'',dp:0,init:0}],
 labels:[{t:'من المصدر',x:60,y:40,s:10},{t:p.plug?'مقاومة التبديل':'مقاومة الفرملة',x:150,y:40,s:10},{t:'إلى المنتج',x:105,y:160,s:10}],
 terms:[T(p.id+'.in+','+',40,65,{pol:'+'}),T(p.id+'.in-','−',85,65,{pol:'-'}),T(p.id+'.r1','r1',130,65),T(p.id+'.r2','r2',175,65),T(p.id+'.o+','+',80,195),T(p.id+'.o-','−',130,195)]});
EXT.co={els(a,p,c){const v=Math.round(a.knob('CO:'+p.id));const e=(x,y,on)=>c.elsDC.push({p:p.id+'.'+x,n:p.id+'.'+y,g:on?1e4:1e-9});
 e('in+','o+',v===1);e('in-','o-',v===1);e('r1','o+',v===2);e('r2','o-',v===2);/* العكس: المقاومة على التوالي مع المنتج المعكوس */e('in+','r1',v===3);e('r2','o-',v===3);e('in-','o+',v===3)}};
/* مقاومة متغيرة بمفتاح تقصير */
PART.rvb=p=>({w:190,h:210,sub:'مقاومة '+(p.bp?'بمفتاح تقصير':'متغيرة'),knobs:[{id:'K:'+p.id,lbl:'R',x:60,y:95,min:p.min||0.1,max:p.max,init:p.init||p.max,step:p.step||0.01,unit:'Ω',dp:2}],
 switches:p.bp?[{id:'SW:'+p.id,lbl:'تقصير',x:150,y:90}]:[],terms:[T(p.id+'.a','',45,175),T(p.id+'.b','',145,175)]});
EXT.rvb={els(a,p,c){const R=Math.max(a.knob('K:'+p.id),0.01),sh=p.bp&&a.sw('SW:'+p.id);c.elsDC.push({p:p.id+'.a',n:p.id+'.b',g:sh?1e4:1/R})}};
/* الحمل: موجب حمل سلبي، سالب حمل هابط (يدفع الآلة) */
PART.ald=p=>({w:210,h:200,sub:p.min<0?'الحمل: موجب يعاكس الحركة، سالب حمل هابط':'الحمل الميكانيكي',knobs:[{id:'K:LD',lbl:'عزم الحمل',x:105,y:100,min:p.min||0,max:p.max,init:0,step:p.step||0.1,unit:'N·m',dp:1}],terms:[]});
MQ.Ia=(a,q,ph,of,ol,P)=>{if(ph.Ia==null)return null;for(const m of P.filter(p=>p.kind==='am'&&p.dc)){const r=ph.read[m.id];if(r!=null&&Math.abs(Math.abs(r)-Math.abs(ph.Ia))<=Math.max(0.01*Math.abs(ph.Ia),0.02))return {v:ph.Ia,m:m.id}}return null};
MQ.Tl=(a,q,ph)=>ph.Te!=null?{v:ph.Te,m:'torque'}:null;
MQ.Ib=(a,q,ph)=>ph.Ib?{v:ph.Ib,m:'A1'}:null;
MQ.Eb0=(a,q,ph)=>ph.Eb0!=null?{v:ph.Eb0,m:'V'}:null;
MQ.Trip=(a,q,ph)=>ph.trip?{v:ph.trip.n,m:'relay'}:null;MQ.TripI=(a,q,ph)=>ph.trip?{v:ph.trip.I,m:'relay'}:null;MQ.TripT=(a,q,ph)=>ph.trip?{v:ph.trip.t,m:'timer'}:null;
MQ.Ts=(a,q,ph)=>ph.tstop!=null?{v:ph.tstop,m:'timer'}:null;
/* ================= الآلات ================= */
const MACH={
 ser:{short:'تبويب المختبر',name:'محرك توالٍ (قيم تبويب المختبر)',V:220,Ra:0.3,Rs:0.2,c:0.005,Is:40,ks:0.2,Tf:2,J:0.5,IFL:80,nr:1000,nmax:3200,
  note:'220 V، مقاومة المنتج والمجال 0.5 Ω، k = 0.005·I حتى التشبع عند 40 A، واحتكاك 2 N·m — قيم الشكل (3-1) في تبويب «المختبر». تقسيم المقاومة (0.3 و 0.2) والقصور الذاتي افتراض منا.'},
 lser:{short:'محرك معمل',name:'محرك توالٍ معمل',V:220,Ra:1.8,Rs:1.2,c:0.03,Is:6,ks:0.18,Tf:0.3,J:0.02,IFL:10,nr:1300,nmax:4000,note:'محرك توالٍ صغير 220 V (قيم توضيحية).'},
 cmp:{short:'تبويب المختبر',name:'محرك مركب (قيم تبويب المختبر)',V:220,Ra:0.3,Rs:0.2,ksh:0.12,Rsh:220,Ishr:1,c:0.0012,ks:0.25,Tf:1,J:0.5,IFL:80,nr:1500,nmax:3600,
  note:'220 V، k<sub>sh</sub> = 0.12 و c = 0.0012 والتشبع 0.25 — قيم تبويب «المختبر». مقاومة مجال التوازي (220 Ω) وتقسيم المقاومات افتراض منا.'},
 lcmp:{short:'محرك معمل',name:'محرك مركب معمل',V:220,Ra:1.8,Rs:1.2,ksh:0.12,Rsh:440,Ishr:0.5,c:0.008,ks:0.2,Tf:0.2,J:0.02,IFL:10,nr:1600,nmax:4000,note:'محرك مركب صغير 220 V (قيم توضيحية).'},
 m61:{short:'مثال (6-1)',name:'محرك مثال (6-1)',V:220,Ra:0.04,ksh:215/1150,Rsh:220,Ishr:1,Tf:0,J:5,IFL:125,nr:1150,nmax:1700,TLd:190,
  note:'220 V، R<sub>a</sub> = 0.04 Ω، و E<sub>1</sub> = 215 V عند 1150 rpm، والحمل الهابط 190 N·m كما في المثال. مجال التوازي (1 A) والقصور الذاتي افتراض منا.'},
 m62:{short:'مثال (6-2)',name:'محرك مثال (6-2)',V:230,Ra:0.38,ksh:(230-54*0.38)/1500,Rsh:230,Ishr:1,Tf:0,J:2,IFL:54,nr:1500,nmax:2200,kI:1.75,kE:0.9,
  note:'15 hp، 230 V، R<sub>a</sub> = 0.38 Ω، I<sub>FL</sub> = 54 A، وأقصى تيار فرملة 1.75 I<sub>FL</sub> كما في المثال. السرعة المقننة (1500 rpm) افتراض منا لأن المثال لا يذكرها.'},
 m63:{short:'مثال (6-3)',name:'محرك مثال (6-3)',V:220,Ra:0.1,ksh:(220-95*0.1)/600,Rsh:220,Ishr:1,Tf:0,J:10,IFL:95,nr:600,nmax:900,Ib:130,
  note:'220 V، 18.4 kW، 600 rpm، I<sub>FL</sub> = 95 A، R<sub>a</sub> = 0.1 Ω، وأقصى تيار عند بدء التبديل 130 A كما في المثال.'},
 lsh:{short:'محرك معمل',name:'محرك توازٍ معمل 1.1 kW',V:220,Ra:4,ksh:(220-6.2*4)/1500,Rsh:440,Ishr:0.5,Tf:0.1,J:0.03,IFL:6.2,nr:1500,nmax:2300,kI:1.75,Ib:8.5,
  note:'محرك توازٍ 1.1 kW، 220 V، 6.2 A، 1500 rpm، R<sub>a</sub> = 4 Ω (قيم توضيحية).'}};
MACH.lsh.TLd=Math.round(KT*MACH.lsh.ksh*MACH.lsh.IFL*0.8*10)/10;
const Tr=M=>KT*M.ksh*M.IFL;
/* ================= أدوات ================= */
const DS=(V,o)=>Object.assign({kind:'dcs',id:'D',V:Math.round(V*1.1),step:0.1,r:0.001,lbl:'مصدر المنتج'},o||{});
const FS=M=>({kind:'dcs',id:'F',V:Math.round(M.Rsh*M.Ishr*1.2),step:0.1,lbl:'مصدر المجال'});
const AM=(M,o)=>Object.assign({kind:'am',id:'A1',dc:1,ranges:M.IFL>30?[30,100,300]:[3,10,30]},o||{});
const AF=M=>({kind:'am',id:'A2',dc:1,ranges:M.Ishr>0.8?[0.3,1,3]:[0.1,0.3,1]});
const VM=M=>({kind:'vm',id:'V1',dc:1,ranges:[30,100,300]});
const LD=(M,min)=>({kind:'ald',id:'LD',min:min||0,max:Math.ceil((M.ksh?Tr(M):KT*(M.ks||0.2)*M.IFL)*1.6/10)*10,step:0.1,lbl:'الحمل'});
const steady=a=>Math.abs(a.S.phys.acc||0)<Math.max(0.5,0.005*Math.abs(a.S.phys.w||0))&&(a.S.phys.tOn||0)>1;
const RN={k:'n',h:'السرعة n (rpm)',t:'N',dp:0},RI={k:'I',h:'تيار المنتج I<sub>a</sub> (A)',t:'Ia',dp:2},RT={k:'T',h:'العزم T (N·m)',t:'Tl',dp:1};
const fieldOk=(a,M)=>{if(!a.sw('SW:F'))return 'شغّل مصدر المجال أولاً.';if(Math.abs(Math.abs(a.S.phys.Ish||0)-M.Ishr)>0.02*M.Ishr)return 'اضبط تيار المجال على '+M.Ishr+' A.';return 0};
const runV=(a,M)=>{if(!a.sw('SW:D'))return 'شغّل مصدر المنتج.';if(Math.abs(a.knob('K:D')-M.V)>0.01*M.V)return 'ارفع جهد المنتج تدريجياً حتى '+M.V+' V.';return 0};
/* نقطة التشغيل من النموذج (للمقارنة): السرعة عند تيار I */
const nAt=(M,I,sg)=>{const k=kOf(M,M.ksh?M.Ishr:0,I,sg==null?1:sg);return (M.V-I*(M.Ra+(M.Rs||0)))/k};
const TAt=(M,I,sg)=>KT*kOf(M,M.ksh?M.Ishr:0,I,sg==null?1:sg)*I;
const EX={
 ser:{name:'خواص محرك التوالي',book:'ser',lab:'lser',build:M=>{const Is=[0.5,1,1.5,2].map(k=>Math.round(M.Is*k*10)/10);const Ts=Is.map(I=>Math.round((TAt(M,I)-M.Tf)*10)/10);return {figRef:'3-1',
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'محرك التوالي بلا حمل (أو بحمل صغير جداً) يقل فيضه مع التيار فتزيد سرعته بلا حد وقد يتحطم العضو الدوار. لا يُشغّل محرك التوالي إلا مربوطاً بحمل.',fatal:true},
   'start-overI':{t:'تيار المنتج كبير جداً',why:'لا توجد قوة دافعة عكسية كافية تحد التيار: إما أن الجهد طُبّق كاملاً على محرك ساكن (ارفعه تدريجياً من الصفر)، أو أن المجال غير موجود أو انقطع (شغّل المجال أولاً وافصله آخراً).',fatal:true}},
  wiring:'+ المصدر ← الأميتر A1 ← A1، و A2 ← D1، و D2 ← − المصدر (المنتج والمجال على التوالي). اضبط الحمل قبل التشغيل ثم ارفع الجهد تدريجياً حتى '+M.V+' V.',
  parts:[DS(M.V),{kind:'dcx',id:'MOT',M,lbl:M.name},LD(M),AM(M)],
  tables:[{id:'t',title:'محرك التوالي على '+M.V+' V',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{const c=runV(a,M);if(c)return c;if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:LD')-t)<0.06);return i<0?'اضبط الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[RI,RN,RT],px:'T',py:'n',plot:true,xu:'T (N·m)',yu:'n (rpm)'}],
  check:rec=>{const t=rec.t||{};const rows=Ts.map((x,i)=>t[i]).filter(v=>v&&v.n!=null);if(!rows.length)return 'سجّل القراءات.';
   return rows.map(v=>{const ne=nAt(M,v.I),Te=TAt(M,v.I);return `I<sub>a</sub> = ${fx(v.I,1)} A: n = ${fx(v.n,0)} rpm (المعادلة ${fx(ne,0)} ${ok(v.n,ne,0.02)})، T = ${fx(v.T,1)} N·m (${fx(Te,1)} ${ok(v.T,Te,0.03)})`}).join('<br>')+`<br>قبل التشبع (I < ${M.Is} A) العزم ∝ I<sub>a</sub>² والسرعة تهبط بشدة مع الحمل؛ بعده العزم ∝ I<sub>a</sub>. عزم بدء كبير وسرعة متغيرة: مناسب للجر والرافعات، وخطر بلا حمل.`}}}},
 cmp:{name:'المركب التراكمي والفرقي',book:'cmp',lab:'lcmp',build:M=>{const Ic=[0.25,0.5,0.75].map(k=>Math.round(M.IFL*k*10)/10);
  const Tc=Ic.map(I=>Math.round((TAt(M,I,1)-M.Tf)*10)/10);const n0=M.V/M.ksh;
  const colF=(Ts,cum)=>a=>{const c=fieldOk(a,M)||runV(a,M);if(c)return c;const ph=a.S.phys;if(ph.cum!=null&&ph.cum!==cum)return cum?'المجال التوالي الآن فرقي: اعكس طرفيه (D1 ↔ D2) للتراكمي.':'المجال التوالي الآن تراكمي: افصل المصدر واعكس طرفي D1 و D2.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:LD')-t)<0.06);return i<0?'اضبط الحمل على '+Ts.join(' أو ')+' N·m.':i};
  return {figRef:'3-5',diffTrip:1,
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'السرعة تجاوزت الحد الآمن. في المركب الفرقي يضعف الفيض كلما زاد التيار فتزيد السرعة بلا حد.',fatal:true},
   'start-overI':{t:'تيار المنتج كبير جداً',why:'لا توجد قوة دافعة عكسية كافية تحد التيار: إما أن الجهد طُبّق كاملاً على محرك ساكن (ارفعه تدريجياً من الصفر)، أو أن المجال غير موجود أو انقطع (شغّل المجال أولاً وافصله آخراً).',fatal:true}},
  wiring:'مجال التوازي: مصدر المجال F ← الأميتر A2 ← E1، و E2 ← − F (اضبط '+M.Ishr+' A). المنتج: + المصدر D ← الأميتر A1 ← D1، و D2 ← A1، و A2 ← − D. بعد الجدول الأول افصل المصدرين واعكس D1 و D2 (فرقي)، ثم شغّل بلا حمل.',
  parts:[FS(M),DS(M.V),{kind:'dcx',id:'MOT',M,lbl:M.name},LD(M),AM(M),AF(M)],
  tables:[{id:'c',title:'التراكمي',xh:'عزم الحمل (N·m)',cols:Tc,col:colF(Tc,true),rows:[RI,RN],px:'I',py:'n',plot:true,xu:'Ia (A)',yu:'n (rpm)'},
   {id:'d',title:'الفرقي: شغّله بلا حمل وارفع الجهد تدريجياً حتى يفصل مرحل الحماية ('+Math.round(1.3*n0)+' rpm أو '+Math.round(1.5*M.IFL)+' A)',cols:['—'],col:a=>{const ph=a.S.phys;if(ph.cum!==false&&!ph.trip)return 'اعكس طرفي المجال التوالي (D1 ↔ D2) ثم شغّل.';return ph.trip&&!a.sw('SW:D')?0:'شغّل المنتج وانتظر حتى يفصل المرحل.'},
    rows:[{k:'nt',h:'السرعة عند الفصل (rpm)',t:'Trip',dp:0},{k:'it',h:'التيار عند الفصل (A)',t:'TripI',dp:1},{k:'tt',h:'الزمن من التشغيل حتى الفصل (s)',t:'TripT',dp:1}]}],
  check:rec=>{const c=rec.c||{},d=rec.d||{};let h='';const cs=Tc.map((x,i)=>c[i]).filter(v=>v&&v.n!=null);
   if(cs.length)h+='التراكمي: '+cs.map(v=>`${fx(v.I,1)} A ← ${fx(v.n,0)} rpm (${fx(nAt(M,v.I,1),0)} ${ok(v.n,nAt(M,v.I,1),0.02)})`).join('، ')+' — السرعة تهبط مع الحمل أكثر من محرك التوازي، وعزم البدء أكبر.';
   const dv=T0(rec,'d');if(dv.nt!=null)h+=`<br>الفرقي: لم يثبت المحرك على سرعة، وفصل المرحل بعد ${fx(dv.tt,1)} s والسرعة ${fx(dv.nt,0)} rpm والتيار ${fx(dv.it,1)} A ✓. أي تيار في المجال التوالي يضعف الفيض فتزيد السرعة (أو يزيد التيار)، فيضعف الفيض أكثر؛ وإذا غلب المجال التوالي انعكس الفيض واتجاه الدوران${dv.nt<0?' (كما حدث هنا: السرعة سالبة)':''}. لذلك المركب الفرقي غير مستقر ونادر الاستعمال، وهذا ما يميز التراكمي.`;return h||'سجّل الجدولين.'}}}},
 regen:{name:'الفرملة بإعادة التوليد',book:'m61',lab:'lsh',build:M=>{const TLr=Math.round((Tr(M)-0)*10)/10,TLd=-M.TLd;const cols=[TLr,0,TLd];return {figRef:'6-2',
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'المجال انقطع أو ضعف والمنتج تحت الجهد، أو الحمل الهابط أكبر من قدرة الفرملة. شغّل المجال أولاً وافصله آخراً.',fatal:true},'start-overI':{t:'تيار المنتج كبير جداً',why:'لا توجد قوة دافعة عكسية كافية تحد التيار: إما أن الجهد طُبّق كاملاً على محرك ساكن (ارفعه تدريجياً من الصفر)، أو أن المجال غير موجود أو انقطع (شغّل المجال أولاً وافصله آخراً).',fatal:true}},
  wiring:'المجال: F ← الأميتر A2 ← E1، و E2 ← − F (اضبط '+M.Ishr+' A أولاً). المنتج: + D ← الأميتر A1 (صفر في المنتصف) ← A1، و A2 ← − D. الفولتميتر V1 على المنتج. ارفع جهد المنتج تدريجياً حتى '+M.V+' V.',
  parts:[FS(M),DS(M.V),{kind:'dcx',id:'MOT',M,lbl:M.name},{kind:'ald',id:'LD',min:-Math.ceil(M.TLd*1.3),max:Math.ceil(TLr*1.4),step:0.1,lbl:'الحمل'},AM(M,{cz:1,ranges:M.IFL>30?[30,100,300]:[3,10,30]}),AF(M),VM(M)],
  tables:[{id:'t',title:'المجال ثابت والمنتج على '+M.V+' V',xh:'عزم الحمل (N·m)',cols:['محرك: '+TLr,'بلا حمل: 0','حمل هابط: '+TLd],col:a=>{const c=fieldOk(a,M)||runV(a,M);if(c)return c;if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=cols.findIndex(t=>Math.abs(a.knob('K:LD')-t)<0.06);return i<0?'اضبط الحمل على '+cols.join(' أو ')+' N·m.':i},
   rows:[RN,RI,{k:'E',h:'E = V − I<sub>a</sub>R<sub>a</sub> (V)',calc:v=>M.V-v.I*M.Ra,dp:1},{k:'P',h:'القدرة من المصدر V·I<sub>a</sub> (W)',calc:v=>M.V*v.I,dp:0}]}],
  check:rec=>{const t=rec.t||{};const a=t[0],b=t[2];let h='';const n0=M.V/M.ksh;
   if(a&&a.n!=null)h+=`محركاً: n = ${fx(a.n,0)} rpm و I<sub>a</sub> = ${fx(a.I,1)} A`+(M.short==='مثال (6-1)'?` (المثال 1150 rpm و E<sub>1</sub> = 215 V ${ok(a.n,1150,0.005)})`:'')+'.';
   if(b&&b.n!=null){const Ia2=-M.TLd/(KT*M.ksh),n2=(M.V-Ia2*M.Ra)/M.ksh;h+=`<br>الحمل الهابط: n = ${fx(b.n,0)} rpm أكبر من سرعة اللاحمل ${fx(n0,0)} ${b.n>n0?'✓':'✗'}، و I<sub>a</sub> = ${fx(b.I,1)} A سالب ${b.I<0?'✓':'✗'}: E > V فترجع القدرة للمصدر (${fx(-M.V*b.I,0)} W). المحسوب: I<sub>a2</sub> = T/k = ${fx(Ia2,1)} A و n<sub>2</sub> = ${fx(n2,0)} rpm ${ok(b.n,n2,0.005)}`+(M.short==='مثال (6-1)'?' (المثال نحو 1200 rpm)':'')+'.'}return h||'سجّل القراءات.'}}}},
 dyn:{name:'الفرملة الديناميكية',book:'m62',lab:'lsh',build:M=>{const Eb=M.V-M.IFL*M.Ra;const R1=Math.round(((M.kE?M.kE*M.V:Eb)/(M.kI*M.IFL)-M.Ra)*100)/100,R2=Math.round(R1*2*100)/100;const Rs=[R1,R2];const TL=Math.round(Tr(M)*10)/10;return {figRef:'6-4',
  mistakes:{'brake-overI':{t:'تيار الفرملة كبير جداً',why:'مقاومة الفرملة صغيرة، فيمر في المنتج لحظة التحويل تيار كبير (I = E/(R + R<sub>a</sub>)). تُختار المقاومة بحيث لا يتجاوز التيار نحو ضعف تيار الحمل الكامل.',fatal:true},'start-overI':{t:'تيار المنتج كبير جداً',why:'لا توجد قوة دافعة عكسية كافية تحد التيار: إما أن الجهد طُبّق كاملاً على محرك ساكن (ارفعه تدريجياً من الصفر)، أو أن المجال غير موجود أو انقطع (شغّل المجال أولاً وافصله آخراً).',fatal:true},overspeed:{t:'سرعة زائدة خطرة',why:'المجال انقطع والمنتج تحت الجهد.',fatal:true}},
  wiring:'المجال: F ← A2 ← E1، و E2 ← − F (اضبط '+M.Ishr+' A أولاً، ويبقى أثناء الفرملة). المصدر D: + ← مفتاح التحويل (+ من المصدر)، و − ← (− من المصدر). مقاومة الفرملة بين r1 و r2. خرج المفتاح + ← الأميتر A1 ← A1 للمنتج، و − ← A2. شغّل على الوضع 1 بحمل '+TL+' N·m، ثم حوّل إلى 2.',
  parts:[FS(M),DS(M.V),{kind:'co',id:'CO',lbl:'مفتاح التحويل'},{kind:'rvb',id:'RB',max:Math.ceil(R2*1.5),min:0.1,init:R1,step:0.01,lbl:'مقاومة الفرملة'},{kind:'dcx',id:'MOT',M,lbl:M.name},LD(M),AM(M,{cz:1}),AF(M)],
  tables:[{id:'t',title:'الفرملة الديناميكية من الحمل الكامل ('+TL+' N·m)',xh:'R (Ω)',cols:Rs,col:a=>{const ph=a.S.phys;if(Math.round(a.knob('CO:CO'))!==2||ph.tstop==null)return 'شغّل على الوضع 1 بالحمل الكامل، ثم حوّل إلى الوضع 2 وانتظر حتى يتوقف المحرك.';if(Math.abs(a.knob('K:LD')-TL)>0.06)return 'الحمل يجب أن يكون '+TL+' N·m.';const i=Rs.findIndex(r=>Math.abs(a.knob('K:RB')-r)<0.006);return i<0?'استعمل R = '+Rs.join(' أو ')+' Ω.':i},
   rows:[{k:'E',h:'E لحظة التحويل (V)',t:'Eb0',dp:1},{k:'Ib',h:'أقصى تيار فرملة (A)',t:'Ib',dp:1},{k:'ts',h:'زمن التوقف (s)',t:'Ts',dp:2}]}],
  tick:(a,ph)=>{},
  check:rec=>{const t=rec.t||{};const rows=Rs.map((R,i)=>t[i]?[R,t[i]]:null).filter(x=>x&&x[1].Ib!=null);if(!rows.length)return 'سجّل القراءات.';
   return rows.map(([R,v])=>{const Ie=v.E/(R+M.Ra);return `R = ${R} Ω: I<sub>b</sub> = ${fx(v.Ib,1)} A، والمحسوب E/(R + R<sub>a</sub>) = ${fx(Ie,1)} A ${ok(v.Ib,Ie,0.02)}، وزمن التوقف ${fx(v.ts,2)} s`}).join('<br>')+(M.short==='مثال (6-2)'?'<br>المثال: R = 1.81 Ω يحد التيار عند 1.75 × 54 = 94.5 A.':'')+(rows.length===2?`<br>المقاومة الأكبر تقلل تيار الفرملة ${rows[1][1].Ib<rows[0][1].Ib?'✓':'✗'} لكنها تطيل زمن التوقف ${rows[1][1].ts>rows[0][1].ts?'✓':'✗'}، لأن عزم الفرملة يتناسب مع التيار ويقل مع السرعة.`:'')}}}},
 plug:{name:'الفرملة بعكس التوصيل (التبديل)',book:'m63',lab:'lsh',build:M=>{const Eb=M.V-M.IFL*M.Ra;const R=Math.round(((M.V+Eb)/M.Ib-M.Ra)*100)/100;const TL=Math.round(Tr(M)*10)/10;return {figRef:'6-7',
  mistakes:{'brake-overI':{t:'تيار التبديل كبير جداً',why:'عند عكس توصيل المنتج يصبح الجهد المؤثر V + E (نحو ضعف جهد المصدر)، فيجب أن تكون مقاومة التبديل كافية: R = (V + E)/I<sub>max</sub> − R<sub>a</sub>.',fatal:true},
   'plug-rev':{t:'المحرك انعكس بعد التوقف',why:'في الفرملة بالتبديل يجب فصل المصدر لحظة وصول السرعة إلى الصفر، وإلا يبدأ المحرك الدوران في الاتجاه المعاكس.',fatal:true},'start-overI':{t:'تيار المنتج كبير جداً',why:'لا توجد قوة دافعة عكسية كافية تحد التيار: إما أن الجهد طُبّق كاملاً على محرك ساكن (ارفعه تدريجياً من الصفر)، أو أن المجال غير موجود أو انقطع (شغّل المجال أولاً وافصله آخراً).',fatal:true},overspeed:{t:'سرعة زائدة خطرة',why:'المجال انقطع والمنتج تحت الجهد.',fatal:true}},
  wiring:'المجال: F ← A2 ← E1، و E2 ← − F (اضبط '+M.Ishr+' A أولاً). + المصدر D ← + دخل المفتاح، و − D ← − دخل المفتاح. مقاومة التبديل بين r1 و r2 (يدخلها المفتاح على التوالي في وضع العكس). خرج المفتاح + ← الأميتر A1 ← A1، و − ← A2. شغّل على الوضع 1 بالحمل الكامل، ثم حوّل إلى 3، ثم إلى 0 لحظة توقف المحرك.',
  parts:[FS(M),DS(M.V),{kind:'rvb',id:'RP',max:Math.ceil(R*2),min:0.1,init:R,step:0.01,lbl:'مقاومة التبديل'},{kind:'co',id:'CO',plug:1,lbl:'مفتاح التحويل'},{kind:'dcx',id:'MOT',M,lbl:M.name},LD(M),AM(M,{cz:1}),AF(M)],
  tables:[{id:'t',title:'التبديل من الحمل الكامل ('+TL+' N·m) و R = '+R+' Ω',cols:['—'],col:a=>{const ph=a.S.phys;if(ph.bpos!==3||ph.tstop==null)return 'نفّذ التبديل (الوضع 3) ثم أعد المفتاح إلى 0 عند توقف المحرك.';if(Math.round(a.knob('CO:CO'))!==0)return 'أعد المفتاح إلى 0 (فصل).';if(Math.abs(a.knob('K:RP')-R)>0.006)return 'استعمل R = '+R+' Ω.';return 0},
   rows:[{k:'E',h:'E لحظة العكس (V)',t:'Eb0',dp:1},{k:'Ib',h:'أقصى تيار (A)',t:'Ib',dp:1},{k:'ts',h:'زمن التوقف (s)',t:'Ts',dp:2}]}],
  check:rec=>{const v=T0(rec,'t');if(v.Ib==null)return 'سجّل القراءة.';const Ie=(M.V+v.E)/(R+M.Ra);
   return `I<sub>b</sub> = ${fx(v.Ib,1)} A، والمحسوب (V + E)/(R + R<sub>a</sub>) = ${fx(Ie,1)} A ${ok(v.Ib,Ie,0.02)}`+(M.short==='مثال (6-3)'?` (المثال: R = 3.21 Ω يحد التيار عند 130 A)`:'')+`. الجهد المؤثر عند العكس V + E ≈ ضعف جهد المصدر، لذلك مقاومة التبديل أكبر بكثير من مقاومة الفرملة الديناميكية. التوقف سريع (${fx(v.ts,2)} s) لكن المصدر يستهلك قدرة أثناء الفرملة.`}}}}
};
const LES={'u3-l1':['ser'],'u3-l2':['cmp'],'u6-l1':['regen'],'u6-l2':['dyn'],'u6-l3':['plug']};
A.bind(B,LES,EX,MACH);B.DRVBENCH={EX,LES,MACH,kOf,nAt,TAt};
})(PLCBOOK);
