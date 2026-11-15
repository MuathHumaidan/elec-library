/* «المنضدة الافتراضية» — آلات التيار المتردد: تجارب المعمل (إضافة من خارج الكتاب).
   «آلة الكتاب» = آلة مثال الدرس (القيم التي في تبويب «المختبر»)، و«آلة معمل صغيرة» = محرك 1.1 kW بقيم توضيحية. كل القيم مسجلة في تقرير المقرر. */
(function(B){if(!B.BENCH||!window.ACM)return;
const SQ3=Math.sqrt(3),r3=x=>+(+x).toPrecision(3),fx=(v,d)=>(+v).toFixed(d),ok=(m,c,tol)=>Math.abs(m-c)<=Math.max((tol||0.03)*Math.abs(c),0.01)?'✓':'✗';
const T0=(rec,id,i)=>((rec[id]||{})[i||0])||{};
/* ---------------- الآلات ---------------- */
const MACH={
 ex11:{short:'محرك مثال (1-1)',name:'محرك مثال (1-1)',VL:240,conn:'Y',f:50,p:4,R1:0.4,X1:1,R2:0.6,X2:1,Xm:40,sN:0.05,J:0.15,Bf:0.002,
  note:'240 V نجمة، 50 Hz، أربعة أقطاب، 1425 rpm عند الحمل المقنن كما في المثال. عناصر الدائرة المكافئة (0.4 و 0.6 و 1 Ω و X<sub>m</sub> = 40 Ω) افتراض منا لأن المثال لا يذكرها.'},
 bk18:{short:'محرك مثال (1-8)',name:'محرك مثال (1-8)',VL:240,conn:'D',f:60,p:4,R1:0.4,X1:1,R2:0.6,X2:1,Xm:1000,sN:0.05,J:0.5,Bf:0.005,
  note:'240 V دلتا، 60 Hz، أربعة أقطاب: R<sub>1</sub> = 0.4، R<sub>2</sub> = 0.6، X<sub>1</sub> = X<sub>2</sub> = 1 Ω، وعند عزم 69.7 N·m تكون السرعة 1710 rpm. المثال يهمل فرع المغنطة، فوضعنا X<sub>m</sub> = 1000 Ω (تيار لاحمل صغير جداً).'},
 bk18wr:{short:'محرك مثال (1-8) بحلقات',name:'محرك مثال (1-8) بعضو دوار ملفوف',VL:240,conn:'D',f:60,p:4,R1:0.4,X1:1,R2:0.6,X2:1,Xm:1000,sN:0.05,J:0.5,Bf:0.005,wr:1,rst:[2.4,1.2,0.6,0],
  note:'قيم مثال (1-8) نفسها، وافترضنا أن عضوه الدوار ملفوف بحلقات انزلاق (K L M) ليمكن إضافة مقاومة إليه. المقاومات محوّلة إلى جهة الثابت.'},
 m5:{short:'محرك مثال (1-5)',name:'محرك مثال (1-5)',VL:127,conn:'D',f:60,p:4,R1:0.675,Idc:20,tab:{NL:[127,7.53,179],BR:[39.3,34.64,1265]},J:0.2,
  note:'127 V دلتا: عند جهد الكتاب تقرأ الأجهزة قراءات المثال نفسها (اللاحمل 127 V و 7.53 A و 179 W، وإعاقة الحركة 39.3 V و 34.64 A و 1265 W، والتيار المستمر 9 V و 20 A). عدد الأقطاب (4) افتراض منا.'},
 lab:{short:'محرك معمل',name:'محرك معمل 1.1 kW',VL:380,conn:'D',f:50,p:4,R1:22,X1:27,R2:18,X2:27,Xm:690,Rc:6000,sN:0.05,J:0.04,Bf:0.0004,
  note:'محرك قفص سنجابي 1.1 kW، 380 V دلتا، 50 Hz، أربعة أقطاب (قيم الدائرة المكافئة لكل ملف: R<sub>1</sub> = 22، R<sub>2</sub> = 18، X<sub>1</sub> = X<sub>2</sub> = 27، X<sub>m</sub> = 690 Ω).'},
 labwr:{short:'محرك معمل بحلقات',name:'محرك معمل 1.1 kW بحلقات',VL:380,conn:'D',f:50,p:4,R1:22,X1:27,R2:18,X2:27,Xm:690,Rc:6000,sN:0.05,J:0.04,Bf:0.0004,wr:1,rst:[72,36,18,0],
  note:'محرك المعمل نفسه بعضو دوار ملفوف وحلقات انزلاق (K L M)؛ مقاومات البادئ محوّلة إلى جهة الثابت.'}};
/* أحادية الطور: Zm و Za عند السكون لكل ملف، Cd مكثف التصميم (µF)، Tb العزم المقنن */
const cap90=(V,f,Zm,Za)=>{const th=Math.atan2(Zm[1],Zm[0]);const Xc=Za[1]+Za[0]*Math.tan(Math.PI/2-th);return 1e6/(2*Math.PI*f*Xc)};
Object.assign(MACH,{
 sp22:{short:'محرك مثال (2-2)',name:'محرك مثال (2-2) المشطور الوجه',type:'split',V:110,f:60,p:4,Zm:[1.2,25],Za:[12,5],Cd:0,Tb:1,J:0.01,Bf:0.0005,
  note:'110 V: عند البدء Z<sub>m</sub> = 1.2 + j25 و Z<sub>a</sub> = 12 + j5 Ω كما في المثال. التردد (60 Hz) وعدد الأقطاب (4) والعزم المقنن (1 N·m) افتراض منا، ومنحنى العزم من الشكل (2-4).'},
 cs23:{short:'محرك مثال (2-3)',name:'محرك مثال (2-3) ذو مكثف البدء',type:'cstart',V:127,f:60,p:4,Zm:[4.2,3.8],Za:[8.8,3.3],Tb:2,J:0.02,Bf:0.001,
  note:'127 V و 60 Hz: عند البدء Z<sub>m</sub> = 4.2 + j3.8 و Z<sub>a</sub> = 8.8 + j3.3 Ω كما في المثال، ومكثف 90° ≈ 204 µF. عدد الأقطاب والعزم المقنن (2 N·m) افتراض منا، ومنحنى العزم من الشكل (2-6).'},
 pc23:{short:'محرك ذو مكثف دائم',name:'محرك ذو مكثف دائم',type:'perm',V:127,f:60,p:4,Zm:[4.2,3.8],Za:[8.8,3.3],Cd:60,Tb:2,J:0.02,Bf:0.001,
  note:'الكتاب لا يعطي أرقاماً لهذا المحرك؛ استعملنا ملفات مثال (2-3) مع مكثف دائم 60 µF (افتراض منا)، ومنحنى العزم من الشكل (2-8).'},
 tw23:{short:'محرك ذو مكثفين',name:'محرك ذو مكثفين',type:'two',V:127,f:60,p:4,Zm:[4.2,3.8],Za:[8.8,3.3],Cd:264,Cs:204,Cr:60,Tb:2,J:0.02,Bf:0.001,
  note:'ملفات مثال (2-3) مع مكثف بدء 204 µF ومكثف دائم 60 µF (افتراض منا)، ومنحنى العزم من الشكل (2-9).'},
 shd:{short:'محرك ذو وجه مظلل',name:'محرك ذو وجه مظلل',type:'shaded',V:127,f:60,p:4,Zm:[20,30],Tb:0.1,J:0.0005,Bf:0.00002,
  note:'الكتاب لا يعطي أرقاماً؛ قيم توضيحية لمحرك صغير (0.1 N·m)، ومنحنى العزم من الشكل (2-11).'},
 lsp:{short:'محرك معمل مشطور',name:'محرك معمل مشطور الوجه 0.25 kW',type:'split',V:230,f:50,p:4,Zm:[4,10],Za:[14,5],Cd:0,Tb:1.6,J:0.01,Bf:0.0005,note:'230 V، 50 Hz، أربعة أقطاب (قيم توضيحية).'},
 lcs:{short:'محرك معمل بمكثف بدء',name:'محرك معمل بمكثف بدء 0.37 kW',type:'cstart',V:230,f:50,p:4,Zm:[6,9],Za:[9,4],Tb:2.4,J:0.02,Bf:0.001,note:'230 V، 50 Hz، أربعة أقطاب (قيم توضيحية)؛ مكثف 90° ≈ 318 µF.'},
 lpc:{short:'محرك معمل بمكثف دائم',name:'محرك معمل بمكثف دائم',type:'perm',V:230,f:50,p:4,Zm:[6,9],Za:[9,4],Cd:40,Tb:2.4,J:0.02,Bf:0.001,note:'230 V، 50 Hz، مكثف دائم 40 µF (قيم توضيحية).'},
 ltw:{short:'محرك معمل بمكثفين',name:'محرك معمل بمكثفين',type:'two',V:230,f:50,p:4,Zm:[6,9],Za:[9,4],Cd:358,Cs:318,Cr:40,Tb:2.4,J:0.02,Bf:0.001,note:'230 V، 50 Hz، مكثف بدء 318 µF ودائم 40 µF (قيم توضيحية).'},
 lsh:{short:'محرك معمل مظلل',name:'محرك معمل ذو وجه مظلل',type:'shaded',V:230,f:50,p:4,Zm:[120,150],Tb:0.05,J:0.0003,Bf:0.00001,note:'230 V، 50 Hz (قيم توضيحية).'}});
Object.assign(MACH,{
 g31:{short:'مولد مثال (3-1)',name:'مولد مثال (3-1)',VL:480,conn:'D',f:60,p:4,Ra:0.015,Xs:0.1,occ:[[0,0],[1,120],[2,240],[3,355],[4,443],[4.1,451],[4.5,480],[5,505],[5.7,532],[6,543],[7,565],[8,578],[9,585],[10,590]],kag:120,Rf:12,IL:1200,Tr:5300,J:30,EXV:130,
  note:'480 V دلتا، 60 Hz، أربعة أقطاب، R<sub>A</sub> = 0.015 Ω و X<sub>S</sub> = 0.1 Ω، والتيار المقنن 1200 A، ومنحنى اللاحمل من الشكل (3-19) كما في تبويب «المختبر». مقاومة ملف المجال (12 Ω) افتراض منا.'},
 m41:{short:'محرك مثال (4-1)',name:'محرك مثال (4-1) التزامني',VL:208,conn:'Y',f:60,p:4,Ra:0.05,Xs:2.5,occ:{Esat:520,k:50},kag:50,Rf:20,IL:27.4,Tr:59.4,J:0.6,EXV:150,
  note:'208 V نجمة، 60 Hz، X<sub>S</sub> = 2.5 Ω، 15 hp كما في المثال، و E = 50 V لكل أمبير مجال (مع تشبع) كما في تبويب «المختبر». عدد الأقطاب (4) ومقاومة المنتج (0.05 Ω) ومقاومة المجال (20 Ω) افتراض منا.'},
 lsg:{short:'آلة معمل',name:'آلة تزامنية معمل 1.5 kVA',VL:400,conn:'Y',f:50,p:4,Ra:5,Xs:80,occ:{Esat:330,k:450},kag:450,Rf:200,IL:2.2,Tr:7.8,J:0.05,EXV:200,
  note:'آلة تزامنية 1.5 kVA، 400 V نجمة، 50 Hz، أربعة أقطاب، X<sub>S</sub> = 80 Ω، R<sub>A</sub> = 5 Ω (قيم توضيحية).'}});
['cs23','lcs'].forEach(k=>{const M=MACH[k];M.Cd=Math.round(cap90(M.V,M.f,M.Zm,M.Za))});
const C=()=>B.BENCH.C;
const IMof=M=>window.ACM.IMmodel(C(),M);
const ILr=M=>{const I=IMof(M);return M.conn==='D'?I.IN*SQ3:I.IN};
const rnd=(x,d)=>Math.round(x*Math.pow(10,d||0))/Math.pow(10,d||0);
const Tset=(M,k)=>rnd(IMof(M).TN*k,1);
/* ---------------- أجزاء مشتركة ---------------- */
const SUP=(M,o)=>Object.assign({kind:'ac3v',id:'S',V:Math.round(M.VL*1.1/10)*10,f:M.f,lbl:'المصدر'},o||{});
const MOT=M=>({kind:'im3',id:'MOT',M,lbl:M.name});
const BRK=M=>({kind:'brake',id:'BR',Tmax:Math.ceil(IMof(M).TN*3/5)*5||10,step:0.1,lbl:'الفرملة'});
const VMa=M=>({kind:'vm',id:'V1',ranges:M.VL>300?[100,300,600]:[30,100,300]});
const AMa=M=>{const I=ILr(M);return {kind:'am',id:'A1',ranges:I<5?[1,3,10,30]:[10,30,100,300]}};
const WMs=M=>{const P=SQ3*M.VL*ILr(M);const rg=P<3000?[100,300,1000,3000]:[1000,3000,10000,30000];return [{kind:'wm',id:'W1',ranges:rg},{kind:'wm',id:'W2',ranges:rg}]};
const conn=M=>M.conn==='D'?'وصّل الملفات دلتا على لوحة الأطراف (U1–W2، V1–U2، W1–V2)':'وصّل الملفات نجمة على لوحة الأطراف (اقصر U2 و V2 و W2 معاً)';
const feed='المصدر L1 ← الأميتر A1 ← U1، و L2 ← V1، و L3 ← W1';
const feedW='المصدر L1 ← الأميتر A1 ← ملف تيار W1 ← U1، و L2 ← ملف تيار W2 ← V1، و L3 ← W1 مباشرة. ملف جهد W1 بين L1 و L3، وملف جهد W2 بين L2 و L3';
/* حالة التشغيل */
const atV=(a,M,tol)=>a.sw('SW:S')&&Math.abs(a.knob('K:S')-M.VL)<=M.VL*(tol||0.02);
const steady=a=>{const ph=a.S.phys;return Math.abs(ph.acc||0)<0.3&&(ph.tOn||0)>1.5};
const needRun=(a,M)=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(!atV(a,M))return 'اضبط جهد الخط على الجهد المقنن '+M.VL+' V.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';return 0};
const loadCol=(Ts,M)=>a=>{const c=needRun(a,M);if(c)return c;const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<0.06);return i<0?'اضبط عزم الحمل على '+Ts.join(' أو ')+' N·m.':i};
/* صفوف القياس */
const RV=(k,h,a,b,dp)=>({k,h,t:'V',a,b,dp:dp!=null?dp:1}),RI=(k,h,idx,dp)=>({k,h,t:'I',src:'S',idx:idx||0,dp:dp!=null?dp:2}),
 RW=(k,h,idx,a,b)=>({k,h,t:'W',src:'S',idx,a,b,dp:0}),RN={k:'n',h:'السرعة n (rpm)',t:'N',dp:0},RT={k:'T',h:'العزم T (N·m)',t:'Tq',dp:1};
/* السرعة الثابتة المتوقعة من النموذج عند عزم حمل وجهد وتردد */
function nSteady(M,TL,V,f,R2e){const I=IMof(M),ws=4*Math.PI*f/M.p;let lo=1e-5,hi=0.6;for(let k=0;k<60;k++){const s=(lo+hi)/2;const T=I.tq(V,s,R2e||M.R2,f)-(M.Bf||0)*ws*(1-s);if(T<TL)lo=s;else hi=s}const s=(lo+hi)/2;return ws*(1-s)*60/(2*Math.PI)}
/* الكفاءة المتوقعة من النموذج عند عزم حمل */
function etaModel(M,TL){const I=IMof(M),c=C(),ws=4*Math.PI*M.f/M.p;const n=nSteady(M,TL,I.Vw,M.f);const s=1-n/(ws*60/(2*Math.PI));const z=I.zw(s,M.R2,M.f);const I1=c.div([I.Vw,0],z.Zw);const Pin=3*I.Vw*I1[0];return 100*TL*n*2*Math.PI/60/Pin}
/* أجزاء أحادية الطور */
const SUP1=(M,o)=>Object.assign({kind:'ac1',id:'S',V:Math.round(M.V*1.15/10)*10,f:M.f,init:M.V,lbl:'المصدر'},o||{});
const MOT1=M=>({kind:'im1',id:'MOT',M,lbl:M.name});
const BRK1=M=>({kind:'brake',id:'BR',Tmax:Math.ceil(M.Tb*3.5*10)/10,step:0.01,lbl:'الفرملة'});
const IL1=M=>M.V/Math.hypot(M.Zm[0],M.Zm[1]);
const AM1=(id,M)=>({kind:'am',id,ranges:IL1(M)>12?[3,10,30,100]:[1,3,10,30]});
const run1=(a,M)=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(Math.abs(a.knob('K:S')-M.V)>M.V*0.02)return 'اضبط الجهد على '+M.V+' V.';return 0};
const RI1=(k,h,el,dp)=>({k,h,t:'I',el,dp:dp!=null?dp:2});
const alpha=v=>Math.acos(Math.max(-1,Math.min(1,(v.It*v.It-v.Im*v.Im-v.Ia*v.Ia)/(2*v.Im*v.Ia))))*180/Math.PI;
const W1φ='المصدر L ← الأميتر A3 (الكلي) ← ملف تيار الواتميتر ← المجموعة a في عقد التوصيل. الملف الرئيسي: a ← A1 ← U1، و U2 ← المجموعة b. الملف المساعد: a ← A2 ← Z1، و Z2 ← ';
/* ---------------- التجارب ---------------- */
const EX={
 slip:{name:'الانزلاق والحمل',book:'ex11',build:M=>{const Ts=[0,0.25,0.5,0.75,1].map(k=>Tset(M,k));const ns=120*M.f/M.p;return {figRef:'',
  wiring:feed+'. '+conn(M)+'. والفولتميتر بين L1 و L2. المحرك مربوط بالفرملة.',
  parts:[SUP(M),MOT(M),BRK(M),VMa(M),AMa(M)],
  tables:[{id:'t',title:'الانزلاق مع الحمل — '+M.VL+' V، '+M.f+' Hz (n<sub>s</sub> = '+ns+' rpm)',xh:'عزم الحمل (N·m)',cols:Ts,col:loadCol(Ts,M),
   rows:[RN,RI('I','تيار الخط I (A)'),{k:'S',h:'S = (n<sub>s</sub> − n)/n<sub>s</sub>',calc:v=>(ns-v.n)/ns,dp:4},{k:'fr',h:'f<sub>r</sub> = S·f (Hz)',calc:v=>(ns-v.n)/ns*M.f,dp:2}],py:'n',plot:true,xu:'T (N·m)',yu:'n (rpm)'}],
  check:rec=>{const v=T0(rec,'t',4);if(v.S==null)return 'سجّل الأعمدة؛ آخرها الحمل المقنن.';return `عند الحمل المقنن: n = ${fx(v.n,0)} rpm، فالانزلاق S = ${fx(v.S,4)} ${ok(v.S,M.sN,0.06)} (المقنن ${M.sN})${M.short==='محرك مثال (1-1)'?' — كما في المثال: 1425 rpm و S = 5%':''}.<br>تردد تيارات الدوار f<sub>r</sub> = S·f = ${fx(v.fr,2)} Hz. كلما زاد الحمل زاد الانزلاق وزاد تيار الدوار ليعطي عزماً أكبر.`}}}},
 rev:{name:'عكس اتجاه الدوران',book:'ex11',build:M=>({figRef:'',wiring:feed+'. '+conn(M)+'. بعد التسجيل افصل المصدر وبدّل خطين من خطوط التغذية (مثلاً L1 و L2) ثم شغّل.',
  parts:[SUP(M),MOT(M),BRK(M),AMa(M)],
  tables:[{id:'t',title:'اتجاه الدوران — بلا حمل',xh:'التوصيل',cols:['التتابع الأصلي','بعد تبديل خطين'],col:a=>{const c=needRun(a,M);if(c)return c;return (a.S.phys.n||0)>0?0:1},rows:[RN]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1])return 'سجّل الاتجاهين.';return `السرعة: ${fx(t[0].n,0)} ثم ${fx(t[1].n,0)} rpm ${t[0].n>0&&t[1].n<0?'✓':'✗'}: تبديل أي خطين يعكس تتابع الأطوار، فيعكس اتجاه المجال الدوار ومعه اتجاه دوران المحرك.`}})},
 nlbr:{name:'اختبارا اللاحمل وإعاقة الحركة',book:'m5',build:M=>{const tab=!!M.tab,I0=IMof(M);const IBR=tab?M.tab.BR[1]:rnd(ILr(M),2);return {figRef:'1-13',lockV:0.5,
  wiring:feedW+'. '+conn(M)+'. والفولتميتر بين L1 و L2.',
  parts:[SUP(M,{init:0}),MOT(M),BRK(M)].concat(WMs(M),[VMa(M),AMa(M)]),
  tables:[{id:'nl',title:'اختبار اللاحمل — بالجهد المقنن '+M.VL+' V والعضو الدوار حر',cols:['—'],col:a=>{if(a.sw('SW:LOCK'))return 'اختبار اللاحمل والعضو الدوار حر: ألغِ القفل.';return needRun(a,M)},
    rows:[RV('V','V<sub>L</sub> (V)','S.L1','S.L2'),RI('I','I<sub>L</sub> (A)',0,2),RW('W1','W<sub>1</sub> (W)',0,'S.L1','S.L3'),RW('W2','W<sub>2</sub> (W)',1,'S.L2','S.L3'),{k:'P',h:'P = W<sub>1</sub> + W<sub>2</sub> (W)',calc:v=>v.W1+v.W2,dp:0},{k:'pf',h:'cos θ<sub>0</sub>',calc:v=>(v.W1+v.W2)/(SQ3*v.V*v.I),dp:4}]},
   {id:'br',title:'اختبار إعاقة الحركة — العضو الدوار مقفول، والجهد يُرفع من الصفر حتى التيار '+IBR+' A',cols:['—'],col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(!a.sw('SW:LOCK'))return 'اقفل العضو الدوار أولاً (مفتاح «قفل العضو الدوار» في الفرملة).';const I=a.S.phys.read.A1;return Math.abs(I-IBR)<=0.03*IBR?0:'ارفع الجهد ببطء حتى يقرأ الأميتر '+IBR+' A (الآن '+fx(I||0,2)+' A).'},
    rows:[RV('V','V<sub>L</sub> (V)','S.L1','S.L2'),RI('I','I<sub>L</sub> (A)',0,2),RW('W1','W<sub>1</sub> (W)',0,'S.L1','S.L3'),RW('W2','W<sub>2</sub> (W)',1,'S.L2','S.L3'),{k:'P',h:'P = W<sub>1</sub> + W<sub>2</sub> (W)',calc:v=>v.W1+v.W2,dp:0},{k:'pf',h:'cos θ<sub>sc</sub>',calc:v=>(v.W1+v.W2)/(SQ3*v.V*v.I),dp:4}]}],
  step:'',hint:'لا يوجد جهاز موصّل على كمية مطلوبة. ملف تيار W1 في الخط L1 وملف جهده بين L1 و L3، وملف تيار W2 في الخط L2 وملف جهده بين L2 و L3.',
  check:rec=>{const n=T0(rec,'nl'),b=T0(rec,'br');const D=M.conn==='D';let h='';
   if(n.P!=null){const Vp=D?n.V:n.V/SQ3,Ip=D?n.I/SQ3:n.I,c=n.pf,sn=Math.sqrt(1-c*c);const Rc=Vp/(Ip*c),Xm=Vp/(Ip*sn);
    h+=`<b>اللاحمل:</b> V<sub>ph</sub> = ${r3(Vp)} V، I<sub>ph</sub> = ${r3(Ip)} A، cos θ<sub>0</sub> = ${fx(c,4)}، فـ R<sub>c</sub> = ${r3(Rc)} Ω و X<sub>m</sub> = ${r3(Xm)} Ω.`+(n.W2<0?' (W<sub>2</sub> سالبة لأن معامل القدرة أقل من 0.5: في المعمل يُعكس ملف جهده وتُسجّل قراءته بإشارة سالبة.)':'')+
     (tab?` قراءات الكتاب: 127 V و 7.53 A و 179 W ${ok(n.P,179*(n.V/127)**2,0.02)}`:` القيمة الحقيقية X<sub>m</sub> ≈ ${M.Xm} Ω ${ok(Xm,M.Xm+M.X1,0.1)}`)}
   if(b.P!=null){const Vp=D?b.V:b.V/SQ3,Ip=D?b.I/SQ3:b.I;const Ze=Vp/Ip,Re=b.P/(3*Ip*Ip),Xe=Math.sqrt(Math.max(Ze*Ze-Re*Re,0));
    h+=`<br><b>إعاقة الحركة:</b> Z<sub>eq</sub> = ${r3(Ze)} Ω، R<sub>eq</sub> = P/(3I<sub>ph</sub>²) = ${r3(Re)} Ω، X<sub>eq</sub> = ${r3(Xe)} Ω.`+(tab?` قراءات الكتاب: 39.3 V و 34.64 A و 1265 W ${ok(b.P,1265*(b.I/34.64)**2,0.03)}`:` القيم الحقيقية R<sub>1</sub> + R<sub>2</sub> = ${M.R1+M.R2} Ω ${ok(Re,M.R1+M.R2,0.1)} و X<sub>1</sub> + X<sub>2</sub> = ${M.X1+M.X2} Ω ${ok(Xe,M.X1+M.X2,0.1)}`)}
   return h||'سجّل الاختبارين.'}}}},
 dct:{name:'اختبار التيار المستمر',book:'m5',build:M=>{const IM0=IMof(M),Id=M.Idc||rnd(ILr(M),1);const Rt=M.conn==='D'?2/3*M.R1:2*M.R1;const Vmax=Math.ceil(Id*Rt*1.6);return {figRef:'1-17',
  wiring:'المحرك موصّل '+(M.conn==='D'?'دلتا':'نجمة')+' كما يعمل. + المصدر المستمر ← الأميتر ← U1، و V1 ← − المصدر. والفولتميتر المستمر بين U1 و V1.',
  parts:[{kind:'dcs',id:'D',V:Vmax,step:0.05,lbl:'مصدر مستمر'},MOT(M),{kind:'vm',id:'V1',dc:1,ranges:[3,10,30,100]},{kind:'am',id:'A1',dc:1,ranges:[1,3,10,30]}],
  tables:[{id:'t',title:'اختبار التيار المستمر — ارفع الجهد حتى يقارب التيار '+Id+' A',cols:['—'],col:a=>{if(!a.sw('SW:D'))return 'شغّل المصدر المستمر.';const I=Math.abs(a.S.phys.read.A1||0);return I>=0.8*Id&&I<=1.05*Id?0:'ارفع الجهد ببطء حتى يقارب التيار '+Id+' A (الآن '+fx(I,2)+' A).'},
   rows:[{k:'V',h:'V<sub>dc</sub> (V)',t:'V',dc:1,a:'MOT.U1',b:'MOT.V1',dp:2},{k:'I',h:'I<sub>dc</sub> (A)',t:'I',dc:1,el:'D',dp:2},{k:'Rt',h:'R بين الطرفين = V/I (Ω)',calc:v=>v.V/v.I,dp:3},{k:'R1',h:'R<sub>1</sub> لكل ملف (Ω)',calc:v=>M.conn==='D'?1.5*v.V/v.I:v.V/v.I/2,dp:3}]}],
  check:rec=>{const v=T0(rec,'t');if(v.R1==null)return 'سجّل الجهد والتيار.';return (M.conn==='D'?`في الدلتا يرى المصدر ملفاً واحداً على التوازي مع ملفين على التوالي: R = R<sub>1</sub>·2R<sub>1</sub>/3R<sub>1</sub> = ⅔R<sub>1</sub>، فـ R<sub>1</sub> = 1.5 × V/I`:`في النجمة يرى المصدر ملفين على التوالي: R = 2R<sub>1</sub>`)+` = ${r3(v.R1)} Ω ${ok(v.R1,M.R1)} (القيمة ${M.R1} Ω).`+(M.tab?' قراءة الكتاب: 9 V و 20 A.':'')}}}},
 load:{name:'اختبار الحمل: القدرة والكفاءة',book:'bk18',build:M=>{const Ts=[0.25,0.5,0.75,1].map(k=>Tset(M,k));const IM0=IMof(M);return {figRef:'1-18',
  wiring:feedW+'. '+conn(M)+'. والفولتميتر بين L1 و L2، والمحرك مربوط بالفرملة.',
  parts:[SUP(M),MOT(M),BRK(M)].concat(WMs(M),[VMa(M),AMa(M)]),
  tables:[{id:'t',title:'المحرك عند '+M.VL+' V مع أحمال مختلفة',xh:'عزم الحمل (N·m)',cols:Ts,col:loadCol(Ts,M),
   rows:[RV('V','V<sub>L</sub> (V)','S.L1','S.L2'),RI('I','I<sub>L</sub> (A)'),RW('W1','W<sub>1</sub> (W)',0,'S.L1','S.L3'),RW('W2','W<sub>2</sub> (W)',1,'S.L2','S.L3'),RN,RT,
    {k:'Pin',h:'P<sub>in</sub> = W<sub>1</sub> + W<sub>2</sub> (W)',calc:v=>v.W1+v.W2,dp:0},{k:'Po',h:'P<sub>o</sub> = T·2πn/60 (W)',calc:v=>v.T*2*Math.PI*v.n/60,dp:0},
    {k:'eta',h:'η = P<sub>o</sub>/P<sub>in</sub> (%)',calc:v=>100*v.T*2*Math.PI*v.n/60/(v.W1+v.W2),dp:1},{k:'pf',h:'cos θ',calc:v=>(v.W1+v.W2)/(SQ3*v.V*v.I),dp:3}],py:'eta',plot:true,xu:'T (N·m)',yu:'η (%)'}],
  check:(rec,a)=>{const v=T0(rec,'t',3);if(v.eta==null)return 'سجّل الأعمدة؛ آخرها الحمل المقنن.';const ns=120*M.f/M.p,S=(ns-v.n)/ns;const Pg=v.T*2*Math.PI*v.n/60/(1-S);
   return `عند الحمل المقنن: P<sub>in</sub> = ${fx(v.Pin,0)} W، P<sub>o</sub> = ${fx(v.Po,0)} W، η = ${fx(v.eta,1)} % ${ok(v.eta,etaModel(M,Ts[3]),0.02)} (المحسوب من الدائرة المكافئة ${fx(etaModel(M,Ts[3]),1)} %).<br>سريان القدرة: S = ${fx(S,4)}، فالقدرة المنقولة للدوار P<sub>g</sub> ≈ P<sub>m</sub>/(1 − S) = ${fx(Pg,0)} W، ومفاقيد نحاس الدوار P<sub>cu2</sub> = S·P<sub>g</sub> = ${fx(S*Pg,0)} W، وباقي المفاقيد (نحاس الثابت والحديد) ≈ ${fx(v.Pin-Pg,0)} W.`+(M.short==='محرك مثال (1-8)'?`<br>مثال (1-8): عند 69.7 N·m تكون السرعة 1710 rpm؛ قياسك عند ${Ts[3]} N·m: ${fx(v.n,0)} rpm ${ok(v.n,1710,0.004)}`:'')}}}},
 tn:{name:'منحنى العزم والسرعة',book:'bk18',build:M=>{const IM0=IMof(M);const Ts=[0.5,1,1.5,2].map(k=>Tset(M,k));const Tm=(()=>{let m=0;for(let s=0.001;s<1;s+=0.001)m=Math.max(m,IM0.tq(IM0.Vw,s,M.R2,M.f));return m})();const ns=120*M.f/M.p;return {figRef:'1-19',stallT:4,ovlK:3.2,
  wiring:feed+'. '+conn(M)+'. المحرك مربوط بالفرملة. لا ترفع الحمل فوق العزم الأقصى (نحو '+fx(Tm,0)+' N·m) وإلا توقف المحرك.',
  parts:[SUP(M),MOT(M),BRK(M),AMa(M)],
  tables:[{id:'t',title:'العزم والسرعة عند '+M.VL+' V',xh:'عزم الحمل (N·m)',cols:Ts,col:loadCol(Ts,M),
   rows:[RN,RT,RI('I','I<sub>L</sub> (A)'),{k:'S',h:'S',calc:v=>(ns-v.n)/ns,dp:4}],px:'n',py:'T',plot:true,xu:'n (rpm)',yu:'T (N·m)'}],
  check:rec=>{const t=rec.t||{};const rows=Ts.map((c,i)=>t[i]).filter(v=>v&&v.S!=null);if(!rows.length)return 'سجّل القراءات.';const V=IM0.Vw,ws=4*Math.PI*M.f/M.p,X=M.X1+M.X2;
   return 'المعادلة (1-34): T = 3V<sub>ph</sub>²(R<sub>2</sub>/S) / (ω<sub>s</sub>[(R<sub>1</sub> + R<sub>2</sub>/S)² + (X<sub>1</sub> + X<sub>2</sub>)²]) عند الانزلاق المقاس:<br>'+rows.map(v=>{const Tf=3*V*V*(M.R2/v.S)/(ws*((M.R1+M.R2/v.S)**2+X*X));return `S = ${fx(v.S,4)}: القياس ${fx(v.T,1)} N·m والمعادلة ${fx(Tf,1)} N·m ${ok(v.T,Tf,M.Xm>=1000?0.04:0.12)}`}).join('<br>')+`<br>العزم الأقصى من النموذج ≈ ${fx(Tm,0)} N·m: إذا زاد الحمل عليه يتوقف المحرك.`+(M.Xm<1000?'<br>(المعادلة تهمل فرع المغنطة، فالفرق بضعة في المئة في آلة المعمل.)':'')}}}},
 dol:{name:'البدء المباشر',book:'bk18',build:M=>{const IM0=IMof(M);return {figRef:'',
  wiring:feed+'. '+conn(M)+'. شغّل المصدر وهو مضبوط على الجهد المقنن مباشرة (بلا حمل).',
  parts:[SUP(M,{init:M.VL}),MOT(M),BRK(M),AMa(M)],
  tables:[{id:'t',title:'البدء المباشر على '+M.VL+' V — بلا حمل',cols:['—'],col:a=>{if(a.knob('K:BR')>0.05)return 'أزل الحمل (عزم الحمل = 0).';return needRun(a,M)},rows:[{k:'Ip',h:'أعلى تيار عند البدء (A)',t:'Ipk',src:'S',idx:0,dp:1},RI('I','التيار بعد الدوران (A)',0,2),{k:'q',h:'نسبة تيار البدء إلى المقنن',calc:v=>v.Ip/ILr(M),dp:2}]}],
  check:rec=>{const v=T0(rec,'t');if(v.q==null)return 'سجّل القراءتين.';const Ist=C().abs(C().div([IM0.Vw,0],IM0.zw(1,M.R2,M.f).Zw))*(M.conn==='D'?SQ3:1);return `تيار البدء = ${fx(v.Ip,1)} A ≈ ${fx(v.q,1)} أضعاف التيار المقنن (${fx(ILr(M),1)} A) ${ok(v.Ip,Ist,0.05)}: عند البدء S = 1، فلا يحد التيار إلا ممانعة صغيرة. لذلك تُستعمل طرق البدء في المحركات الكبيرة.`}}}},
 sd:{name:'بادئ نجمة / دلتا',book:'bk18',build:M=>{const IM0=IMof(M);const Ist=C().abs(C().div([IM0.Vw,0],IM0.zw(1,M.R2,M.f).Zw))*SQ3;return {figRef:'1-31',
  wiring:'المصدر L1 ← الأميتر A1 ← المفتاح L1، و L2 و L3 إلى المفتاح مباشرة. ثم أطراف المفتاح U1 V1 W1 U2 V2 W2 إلى أطرافها في المحرك (بلا قناطر على لوحة الأطراف). ابدأ بالوضع 1 (نجمة)، ثم 2 (دلتا) بعد أن تثبت السرعة.',
  parts:[SUP(M,{init:M.VL}),{kind:'yd',id:'YD',lbl:'مفتاح Y/Δ'},MOT(M),BRK(M),AMa(M)],
  tick:(a,ph)=>{const y=Math.round(a.knob('Y:YD'));if(ph._y!==y){ph._y=y;ph.pk={}}},
  tables:[{id:'t',title:'بدء نجمة / دلتا على '+M.VL+' V — بلا حمل',xh:'الوضع',cols:['1 نجمة','2 دلتا'],col:a=>{if(a.knob('K:BR')>0.05)return 'أزل الحمل.';const c=needRun(a,M);if(c)return c;const y=Math.round(a.knob('Y:YD'));return y===1?0:y===2?1:'ضع المفتاح على 1 أو 2.'},
   rows:[{k:'Ip',h:'أعلى تيار بعد التحويل لهذا الوضع (A)',t:'Ipk',src:'S',idx:0,dp:1},RI('I','التيار الثابت (A)',0,2)]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||t[0].Ip==null)return 'ابدأ بالنجمة وسجّل.';return `تيار البدء في النجمة = ${fx(t[0].Ip,1)} A، والبدء المباشر دلتا يأخذ نحو ${fx(Ist,1)} A: النسبة ${fx(t[0].Ip/Ist,2)} ≈ ⅓ ${ok(t[0].Ip/Ist,1/3,0.08)}. جهد كل ملف في النجمة V<sub>L</sub>/√3، فيقل تيار الخط والعزم إلى الثلث.`+(t[1]&&t[1].Ip!=null?`<br>بعد التحويل إلى دلتا: قمة التيار ${fx(t[1].Ip,1)} A (أقل من البدء المباشر لأن المحرك يدور فعلاً).`:'')}}}},
 sr:{name:'مقاومات في دائرة الثابت',book:'bk18',build:M=>{const IM0=IMof(M);const Rr=M.VL>300?22:0.8;const Zy=C().mul([M.conn==='D'?1/3:1,0],IMof(M).zw(1,M.R2,M.f).Zw),Iexp=M.VL/SQ3/C().abs(C().add(Zy,[Rr,0]));const Ist=C().abs(C().div([IM0.Vw,0],IM0.zw(1,M.R2,M.f).Zw))*(M.conn==='D'?SQ3:1);return {figRef:'1-23',
  wiring:'المصدر L1 ← الأميتر A1 ← مقاومة 1 ← U1، و L2 ← مقاومة 2 ← V1، و L3 ← مقاومة 3 ← W1. '+conn(M)+'. ابدأ والمقاومات في الدائرة، ثم أغلق مفتاح التقصير بعد أن تثبت السرعة.',
  parts:[SUP(M,{init:M.VL}),{kind:'rs3',id:'RS',R:Rr,lbl:'مقاومات البدء'},MOT(M),BRK(M),AMa(M)],
  tick:(a,ph)=>{const s=a.sw('SW:RS');if(ph._s!==s){ph._s=s;ph.pk={}}},
  tables:[{id:'t',title:'البدء بمقاومات '+Rr+' Ω في كل خط — بلا حمل',xh:'المقاومات',cols:['في الدائرة','مقصورة'],col:a=>{if(a.knob('K:BR')>0.05)return 'أزل الحمل.';const c=needRun(a,M);if(c)return c;return a.sw('SW:RS')?1:0},
   rows:[{k:'Ip',h:'أعلى تيار (A)',t:'Ipk',src:'S',idx:0,dp:1},RI('I','التيار الثابت (A)',0,2)]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||t[0].Ip==null)return 'ابدأ والمقاومات في الدائرة وسجّل.';return `تيار البدء بالمقاومات = ${fx(t[0].Ip,1)} A مقابل ${fx(Ist,1)} A في البدء المباشر (النسبة ${fx(t[0].Ip/Ist,2)}). المحسوب: I = V<sub>ph</sub>/|Z<sub>st</sub> + R| = ${fx(Iexp,1)} A ${ok(t[0].Ip,Iexp,0.04)}. المقاومة تخفض الجهد على المحرك عند البدء، لكنها تستهلك قدرة وتخفض العزم بمربع نسبة الجهد.`}}}},
 at:{name:'المحول الذاتي',book:'bk18',build:M=>{const IM0=IMof(M);const Ist=C().abs(C().div([IM0.Vw,0],IM0.zw(1,M.R2,M.f).Zw))*(M.conn==='D'?SQ3:1);return {figRef:'1-25',
  wiring:'المصدر L1 ← الأميتر A1 ← دخل المحول L1، و L2 و L3 إلى دخله مباشرة. وخرج المحول U V W ← U1 V1 W1. '+conn(M)+'. ابدأ على 65% ثم ارفع إلى 100% بعد أن تثبت السرعة.',
  parts:[SUP(M,{init:M.VL}),{kind:'at3',id:'AT',taps:[50],tstep:5,lbl:'المحول الذاتي'},MOT(M),BRK(M),AMa(M)],
  tick:(a,ph)=>{const s=Math.round(a.knob('TAP:AT'));if(ph._t!==s){ph._t=s;ph.pk={}}},
  tables:[{id:'t',title:'البدء بالمحول الذاتي — بلا حمل',xh:'نسبة الجهد',cols:['65%','100%'],col:a=>{if(a.knob('K:BR')>0.05)return 'أزل الحمل.';const c=needRun(a,M);if(c)return c;const k=Math.round(a.knob('TAP:AT'));return k===65?0:k===100?1:'ضع نسبة الجهد على 65% أو 100%.'},
   rows:[{k:'Ip',h:'أعلى تيار في الخط (A)',t:'Ipk',src:'S',idx:0,dp:1},RI('I','التيار الثابت (A)',0,2)]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||t[0].Ip==null)return 'ابدأ على 65% وسجّل.';return `تيار الخط عند البدء على 65% = ${fx(t[0].Ip,1)} A، والمباشر ${fx(Ist,1)} A: النسبة ${fx(t[0].Ip/Ist,3)} ≈ 0.65² = 0.42 ${ok(t[0].Ip/Ist,0.4225,0.08)}. المحول يخفض تيار المحرك بنسبة k وتيار الخط بنسبة k²، والعزم أيضاً بنسبة k².`}}}},
 wr:{name:'مقاومات العضو الدوار',book:'bk18wr',lab:'labwr',build:M=>{const steps=M.rst;const TN=Tset(M,1);const ns=120*M.f/M.p;return {figRef:'',
  wiring:feed+'. '+conn(M)+'. وأطراف الدوار K L M ← أطراف البادئ a b c. المحرك مربوط بالفرملة.',
  parts:[SUP(M),MOT(M),{kind:'rst',id:'RS',steps,lbl:'بادئ الدوار'},BRK(M),AMa(M)],
  tables:[{id:'t',title:'المحرك بحمل ثابت '+TN+' N·m (المقنن) مع مقاومة دوار مختلفة',xh:'R<sub>ext</sub> (Ω)',cols:steps,col:a=>{const c=needRun(a,M);if(c)return c;if(Math.abs(a.knob('K:BR')-TN)>0.06)return 'اضبط عزم الحمل على '+TN+' N·m.';return Math.round(a.knob('R:RS'))},
   rows:[RN,RI('I','I<sub>L</sub> (A)'),{k:'S',h:'S',calc:v=>(ns-v.n)/ns,dp:3}],py:'n',plot:true,xu:'Rext (Ω)',yu:'n (rpm)'}],
  check:rec=>{const t=rec.t||{};const rows=steps.map((R,i)=>t[i]&&t[i].S!=null?[R,t[i]]:null).filter(Boolean);if(!rows.length)return 'سجّل القراءات.';
   return 'عند عزم ثابت يتناسب الانزلاق مع مقاومة الدوار: S ∝ (R<sub>2</sub> + R<sub>ext</sub>):<br>'+rows.map(([R,v])=>{const Se=M.sN*(M.R2+R)/M.R2;return `R<sub>ext</sub> = ${R} Ω: S = ${fx(v.S,3)} والمتوقع ≈ ${fx(Se,3)} ${ok(v.S,Se,0.12)}`}).join('<br>')+'<br>لذلك يبدأ المحرك بكل المقاومة (تيار أقل وعزم أكبر)، وتُخرج المقاومة على مراحل، وتُستعمل أيضاً للتحكم في السرعة مع ضياع قدرة في المقاومات.'}}}},
 vf:{name:'التحكم بالتردد (عاكس)',book:'bk18',build:M=>{const fs=M.f===60?[30,40,50,60]:[20,30,40,50];const TL=Tset(M,0.5);return {figRef:'1-35',
  wiring:'خرج العاكس L1 ← الأميتر A1 ← U1، و L2 ← V1، و L3 ← W1. '+conn(M)+'. اضبط جهد العاكس على '+M.VL+' V (عند '+M.f+' Hz)، والعاكس يخفض الجهد مع التردد (V/f ثابت).',
  parts:[SUP(M,{inv:1,lbl:'عاكس التردد'}),MOT(M),BRK(M),AMa(M)],
  tables:[{id:'t',title:'حمل ثابت '+TL+' N·m مع تردد مختلف',xh:'التردد f (Hz)',cols:fs,col:a=>{if(!a.sw('SW:S'))return 'شغّل العاكس.';if(Math.abs(a.knob('K:S')-M.VL)>M.VL*0.02)return 'اضبط جهد العاكس على '+M.VL+' V.';if(Math.abs(a.knob('K:BR')-TL)>0.06)return 'اضبط عزم الحمل على '+TL+' N·m.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=fs.findIndex(f=>Math.abs(a.knob('F:S')-f)<0.5);return i<0?'اضبط التردد على '+fs.join(' أو ')+' Hz.':i},
   rows:[RN,{k:'ns',h:'n<sub>s</sub> = 120f/P (rpm)',calc:(v,a)=>null,dp:0},RI('I','I<sub>L</sub> (A)')],py:'n',plot:true,xu:'f (Hz)',yu:'n (rpm)'}],
  check:rec=>{const t=rec.t||{};const rows=fs.map((f,i)=>t[i]&&t[i].n!=null?[f,t[i]]:null).filter(Boolean);if(!rows.length)return 'سجّل القراءات.';const IM0=IMof(M);
   return 'n<sub>s</sub> = 120f/P تتناسب مع التردد، والسرعة تتبعها:<br>'+rows.map(([f,v])=>{const ne=nSteady(M,TL,IM0.Vw*Math.min(f/M.f,1),f);return `${f} Hz: n<sub>s</sub> = ${120*f/M.p} rpm، والسرعة ${fx(v.n,0)} rpm ${ok(v.n,ne,0.01)}`}).join('<br>')+'<br>الفرق n<sub>s</sub> − n يكاد يبقى ثابتاً عند الحمل نفسه لأن V/f ثابت.'}}}}
};
/* عمود n_s في تجربة التردد يُحسب من عمود التردد: نضيفه بعد الحساب */
Object.assign(EX,{
 sp:{name:'البدء والتشغيل',book:'sp22',lab:'lsp',build:M=>{const Im0=C().div([M.V,0],[M.Zm[0],M.Zm[1]]),Ia0=C().div([M.V,0],[M.Za[0],M.Za[1]]);const ae=(Math.atan2(Ia0[1],Ia0[0])-Math.atan2(Im0[1],Im0[0]))*180/Math.PI;return {figRef:'2-3',lockT:4,
  wiring:W1φ+'S1، و S2 ← b (المفتاح الطارد على التوالي مع المساعد). و b ← المصدر N. ملف جهد الواتميتر بين L و N، والمحرك مربوط بالفرملة.',
  parts:[SUP1(M),{kind:'jb',id:'J'},MOT1(M),BRK1(M),AM1('A1',M),AM1('A2',M),Object.assign(AM1('A3',M),{}),{kind:'wm',id:'W1',ranges:[300,1000,3000]}],
  tables:[{id:'st',title:'عند البدء — العضو الدوار مقفول، '+M.V+' V (سجّل خلال ثوانٍ)',cols:['—'],col:a=>{if(!a.sw('SW:LOCK'))return 'اقفل العضو الدوار أولاً.';return run1(a,M)},
    rows:[RI1('Im','I<sub>m</sub> الرئيسي (A)','MOT:m'),RI1('Ia','I<sub>a</sub> المساعد (A)','MOT:a'),RI('It','I الكلي (A)'),{k:'P',h:'P (W)',t:'W',src:'S',idx:0,a:'S.L',b:'S.N',dp:0},{k:'al',h:'الزاوية بين I<sub>m</sub> و I<sub>a</sub> (°)',calc:alpha,dp:1},{k:'pf',h:'cos θ',calc:v=>v.P/(M.V*v.It),dp:3}]},
   {id:'rn',title:'أثناء الدوران — بلا حمل',cols:['—'],col:a=>{if(a.sw('SW:LOCK'))return 'ألغِ قفل العضو الدوار.';const c=run1(a,M);if(c)return c;return steady(a)?0:'انتظر حتى تثبت السرعة.'},rows:[RN,RI1('Im','I<sub>m</sub> (A)','MOT:m'),RI1('Ia','I<sub>a</sub> (A)','MOT:a',3)]}],
  check:rec=>{const s0=T0(rec,'st'),r0=T0(rec,'rn');let h='';if(s0.al!=null)h+=`عند البدء: الزاوية بين التيارين ${fx(s0.al,1)}° ${ok(s0.al,ae,0.03)} (من المعاوقتين: ${fx(ae,1)}°). التيار الكلي ${fx(s0.It,2)} A`+(M.short==='محرك مثال (2-2)'?` (الكتاب 10.8 A ${ok(s0.It,10.8,0.05)})`:'')+'. لأن الملف المساعد مقاومته أكبر ومفاعلته أقل، يتقدم تياره على تيار الرئيسي فيتكون مجال دوار ضعيف يبدأ به المحرك.';
   if(r0.n!=null)h+=`<br>أثناء الدوران: I<sub>a</sub> = ${fx(r0.Ia,3)} A ${r0.Ia<0.01?'✓':'✗'}: فتح المفتاح الطارد عند 75% من السرعة فخرج الملف المساعد، والمحرك يكمل بالملف الرئيسي وحده.`;return h||'سجّل الجدولين.'}}}},
 rev1:{name:'عكس اتجاه الدوران',book:'sp22',lab:'lsp',build:M=>({figRef:'',lockT:4,
  wiring:'المصدر L ← المجموعة a، و N ← المجموعة b. الرئيسي: a ← U1، و U2 ← b. المساعد: a ← Z1، و Z2 ← S1، و S2 ← b. بعد التسجيل افصل المصدر واعكس طرفي الملف المساعد فقط (Z1 ↔ Z2).',
  parts:[SUP1(M),{kind:'jb',id:'J'},MOT1(M),BRK1(M)],
  tables:[{id:'t',title:'اتجاه الدوران — بلا حمل',xh:'التوصيل',cols:['الأصلي','بعد عكس طرفي المساعد'],col:a=>{const c=run1(a,M);if(c)return c;if(!steady(a))return 'انتظر حتى تثبت السرعة.';return (a.S.phys.n||0)>0?0:1},rows:[RN]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1])return 'سجّل الاتجاهين.';return `السرعة ${fx(t[0].n,0)} ثم ${fx(t[1].n,0)} rpm ${t[0].n>0&&t[1].n<0?'✓':'✗'}: عكس طرفي أحد الملفين (المساعد هنا) يعكس الزاوية بين التيارين فيعكس اتجاه المجال الدوار عند البدء. عكس طرفي المصدر وحده لا يغيّر الاتجاه.`}})},
 cs:{name:'اختيار مكثف البدء',book:'cs23',lab:'lcs',build:M=>{const Cs=[Math.round(M.Cd/2),M.Cd,Math.round(M.Cd*1.6)];return {figRef:'2-5',lockT:6,
  wiring:W1φ+'المكثف ← S1، و S2 ← b. و b ← المصدر N. والمحرك مربوط بالفرملة.',
  parts:[SUP1(M),{kind:'jb',id:'J'},MOT1(M),{kind:'cap',id:'CS',adj:1,min:20,max:Math.ceil(M.Cd*2/10)*10,init:20,lbl:'مكثف البدء'},BRK1(M),AM1('A1',M),AM1('A2',M),AM1('A3',M)],
  tables:[{id:'t',title:'عند البدء — العضو الدوار مقفول، '+M.V+' V',xh:'C (µF)',cols:Cs,col:a=>{if(!a.sw('SW:LOCK'))return 'اقفل العضو الدوار أولاً.';const c=run1(a,M);if(c)return c;const i=Cs.findIndex(x=>Math.abs(a.knob('C:CS')-x)<0.5);return i<0?'اضبط المكثف على '+Cs.join(' أو ')+' µF.':i},
   rows:[RI1('Im','I<sub>m</sub> (A)','MOT:m'),RI1('Ia','I<sub>a</sub> (A)','MOT:a'),RI('It','I الكلي (A)'),RT,{k:'al',h:'الزاوية بين التيارين (°)',calc:alpha,dp:1},{k:'kt',h:'العزم لكل أمبير في المساعد T/I<sub>a</sub> (N·m/A)',calc:v=>v.T/v.Ia,dp:3}],py:'kt',plot:true,xu:'C (µF)',yu:'T/Ia'}],
  check:rec=>{const t=rec.t||{};const v=t[1];if(!v||v.al==null)return 'سجّل الأعمدة الثلاثة.';const Ts=[0,1,2].map(i=>t[i]&&t[i].kt);const best=Ts.every(x=>x!=null)?Ts.indexOf(Math.max(...Ts)):-1;
   return `عند C = ${M.Cd} µF: الزاوية ${fx(v.al,1)}° ≈ 90° ${ok(v.al,90,0.03)}.`+(best>=0?` وأكبر عزم لكل أمبير في الملف المساعد عند ${Cs[best]} µF ${best===1?'✓':'✗'}: عزم البدء يتناسب مع I<sub>m</sub>·I<sub>a</sub>·sin α، فعند 90° يعطي كل أمبير في المساعد أكبر عزم. المكثف الأكبر يزيد العزم لكنه يزيد التيار أكثر ويبعد الزاوية عن 90°.`:'')+(M.short==='محرك مثال (2-3)'?' مثال (2-3): X<sub>c</sub> = 13 Ω، فـ C ≈ 204 µF.':'')}}}},
 perm:{name:'المكثف الدائم',book:'pc23',lab:'lpc',build:M=>{const Ts=[0,0.5,1].map(k=>rnd(M.Tb*k,2));return {figRef:'2-7',
  wiring:'المصدر L ← الأميتر A3 ← المجموعة a. الرئيسي: a ← A1 ← U1، و U2 ← b. المساعد: a ← A2 ← Z1، و Z2 ← المكثف ← b (بلا مفتاح طارد). و b ← N. والمحرك مربوط بالفرملة.',
  parts:[SUP1(M),{kind:'jb',id:'J'},MOT1(M),{kind:'cap',id:'CR',C:M.Cd,lbl:'المكثف الدائم'},BRK1(M),AM1('A1',M),AM1('A2',M),AM1('A3',M)],
  tables:[{id:'t',title:'المحرك ذو المكثف الدائم عند '+M.V+' V',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{const c=run1(a,M);if(c)return c;if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<0.006);return i<0?'اضبط عزم الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[RN,RI1('Im','I<sub>m</sub> (A)','MOT:m'),RI1('Ia','I<sub>a</sub> (A)','MOT:a'),RI('It','I الكلي (A)')]}],
  check:rec=>{const t=rec.t||{};const v=t[2];if(!v||v.Ia==null)return 'أكمل الأعمدة؛ آخرها الحمل المقنن.';return `التيار في الملف المساعد أثناء الدوران ${fx(v.Ia,2)} A ${v.Ia>0.05?'✓':'✗'}: المكثف والملف المساعد يبقيان في الدائرة دائماً، فيعمل المحرك كمحرك ثنائي الطور: عزم أنعم، ومعامل قدرة أفضل، لكن عزم بدء أقل (المكثف صغير يناسب التشغيل لا البدء).`}}}},
 two:{name:'المكثفان',book:'tw23',lab:'ltw',build:M=>({figRef:'2-9',lockT:4,
  wiring:'المصدر L ← المجموعة a، و N ← b. الرئيسي: a ← U1، و U2 ← b. المساعد: a ← A2 ← Z1، و Z2 ← المجموعة c. المكثف الدائم بين c و b، ومكثف البدء بين c و S1، و S2 ← b. والمحرك مربوط بالفرملة.',
  parts:[SUP1(M),{kind:'jb',id:'J'},MOT1(M),{kind:'cap',id:'CB',C:M.Cs,lbl:'مكثف البدء'},{kind:'cap',id:'CR',C:M.Cr,lbl:'المكثف الدائم'},BRK1(M),AM1('A2',M)],
  tables:[{id:'t',title:'تيار الملف المساعد — '+M.V+' V',xh:'الحالة',cols:['عند البدء (مقفول)','أثناء الدوران'],col:a=>{const c=run1(a,M);if(c)return c;if(a.sw('SW:LOCK'))return 0;return steady(a)?1:'انتظر حتى تثبت السرعة.'},rows:[RI1('Ia','I<sub>a</sub> (A)','MOT:a',3),RT]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1]||t[1].Ia==null||t[0].Ia==null)return 'سجّل الحالتين.';return `I<sub>a</sub>: ${fx(t[0].Ia,2)} A عند البدء ثم ${fx(t[1].Ia,2)} A أثناء الدوران ${t[1].Ia<t[0].Ia&&t[1].Ia>0.05?'✓':'✗'}: عند البدء يعمل المكثفان معاً (سعة كبيرة وعزم بدء كبير)، ثم يفصل المفتاح الطارد مكثف البدء ويبقى المكثف الدائم.`}})},
 shd:{name:'اتجاه الدوران',book:'shd',lab:'lsh',build:M=>({figRef:'2-10',
  wiring:'المصدر L ← U1، و N ← U2. بعد التسجيل افصل المصدر واعكس طرفي التغذية (L ← U2، و N ← U1).',
  parts:[SUP1(M),MOT1(M),BRK1(M)],
  tables:[{id:'t',title:'المحرك ذو الوجه المظلل — بلا حمل',xh:'التوصيل',cols:['الأصلي','بعد عكس طرفي التغذية'],col:a=>{const c=run1(a,M);if(c)return c;if(!steady(a))return 'انتظر حتى تثبت السرعة.';const of=a.nets().of;return of['S.L']===of['MOT.U1']?0:of['S.L']===of['MOT.U2']?1:'وصّل المصدر بطرفي المحرك مباشرة.'},rows:[RN]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1])return 'سجّل التوصيلين.';return `السرعة ${fx(t[0].n,0)} ثم ${fx(t[1].n,0)} rpm ${t[0].n>0&&t[1].n>0?'✓':'✗'}: الاتجاه لم يتغير، لأنه يحدده موضع الحلقة المظللة على القطب (المجال يتحرك من الجزء غير المظلل إلى المظلل)، لا طرفا التغذية.`}})}
});
/* ---------------- الآلة التزامنية ---------------- */
const SMf=M=>window.ACM.SMmodel(M);
const Vw=M=>M.conn==='D'?M.VL:M.VL/SQ3,Iw=M=>M.conn==='D'?M.IL/SQ3:M.IL;
const occInv=(M,E)=>{const S=SMf(M);let lo=0,hi=20;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(S.E(m,S.ws)<E)lo=m;else hi=m}return (lo+hi)/2};
const GEN=(M,o)=>Object.assign({kind:'sm3',id:'GEN',M,lbl:M.name},o||{});
const PMv=M=>({kind:'pm',id:'PM',nmax:Math.round(120*M.f/M.p*1.2),lbl:'المحرك الابتدائي'});
const EXC=M=>({kind:'dcs',id:'EX',V:M.EXV,step:0.05,lbl:'مصدر المجال'});
const AF=M=>({kind:'am',id:'A2',dc:1,ranges:M.Rf>50?[0.3,1,3]:[3,10,30]});
const AL=M=>({kind:'am',id:'A1',ranges:M.IL>100?[300,1000,3000]:M.IL>10?[10,30,100]:[1,3,10]});
const VL1=M=>({kind:'vm',id:'V1',ranges:M.VL>300?[100,300,600]:[30,100,300]});
const GLINK=(M,id)=>M.conn==='D'?'وصّل ملفات المنتج دلتا ('+id+'.U1–W2، V1–U2، W1–V2)':'وصّل ملفات المنتج نجمة (اقصر U2 و V2 و W2)';
const FIELD='مصدر المجال + ← الأميتر المستمر A2 ← F1، و F2 ← − المصدر';
const RIf={k:'If',h:'تيار المجال I<sub>f</sub> (A)',t:'I',dc:1,el:'GEN:f',dp:3},RIfm=Object.assign({},RIf,{el:'MOT:f'});
const atNs=(a,M)=>{const ns=120*M.f/M.p;return Math.abs((a.S.phys.n||0)-ns)<=0.005*ns};
const runGen=(a,M)=>{if(!a.sw('SW:PM'))return 'شغّل المحرك الابتدائي.';if(!atNs(a,M))return 'اضبط سرعة المحرك الابتدائي على السرعة التزامنية '+(120*M.f/M.p)+' rpm.';if(!a.sw('SW:EX'))return 'شغّل مصدر المجال.';return 0};
const IfNow=a=>Math.abs(a.S.phys.read.A2||0);
const ifCol=(cols,M,extra)=>a=>{const c=runGen(a,M);if(c)return c;if(extra){const e=extra(a);if(e)return e}const I=IfNow(a);const i=cols.findIndex(x=>Math.abs(I-x)<=0.02*x);return i<0?'اضبط تيار المجال على '+cols.join(' أو ')+' A (الآن '+fx(I,3)+' A).':i};
Object.assign(EX,{
 oc:{name:'اختبار اللاحمل (الدائرة المفتوحة)',book:'g31',lab:'lsg',build:M=>{const cols=M.IL>100?[1,2,3,4,5,6,8]:[0.2,0.4,0.6,0.8,1.0];const S=SMf(M);return {figRef:'3-11',
  wiring:'المحرك الابتدائي يدير المولد. '+GLINK(M,'GEN')+'، وأطراف المنتج مفتوحة. '+FIELD+'. والفولتميتر بين U1 و V1.',
  parts:[PMv(M),GEN(M),EXC(M),AF(M),VL1(M)],
  tables:[{id:'t',title:'منحنى اللاحمل عند '+S.ns+' rpm',xh:'I<sub>f</sub> (A)',cols,col:ifCol(cols,M),
   rows:[RIf,RV('V','V<sub>L</sub> (V)','GEN.U1','GEN.V1',1),{k:'E',h:'E<sub>ph</sub> (V)',calc:v=>M.conn==='D'?v.V:v.V/SQ3,dp:1}],px:'If',py:'E',plot:true,xu:'If (A)',yu:'E (V)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((c,i)=>t[i]).filter(v=>v&&v.E!=null);if(!rows.length)return 'سجّل القراءات.';
   return 'الجهد المتولد E<sub>ph</sub> مقارنة بمنحنى اللاحمل للآلة:<br>'+rows.map(v=>{const Ee=S.E(v.If,S.ws);return `I<sub>f</sub> = ${fx(v.If,2)} A: ${fx(v.E,0)} V والمنحنى ${fx(Ee,0)} V ${ok(v.E,Ee,0.02)}`}).join('<br>')+'<br>في البداية يزيد E بنسبة ثابتة مع I<sub>f</sub> (خط الثغرة الهوائية)، ثم ينحني المنحنى بسبب تشبع الحديد.'}}}},
 sc:{name:'اختبار القصر',book:'g31',lab:'lsg',build:M=>{const S=SMf(M);const Ir=M.IL;const cols=[0.5,1].map(k=>rnd(Ir*k,M.IL>100?0:2));return {figRef:'3-12',scTest:1,ovT:1.5,
  wiring:'المحرك الابتدائي يدير المولد. '+GLINK(M,'GEN')+'. اقصر أطراف المنتج: U1 ← الأميتر A1 ← V1، و V1 ← W1. '+FIELD+'. ابدأ بتيار مجال صفر ثم ارفعه ببطء.',
  parts:[PMv(M),GEN(M),EXC(M),AF(M),AL(M)],
  tables:[{id:'t',title:'اختبار القصر عند '+S.ns+' rpm',xh:'تيار الخط (A)',cols,col:a=>{const c=runGen(a,M);if(c)return c;const I=Math.abs(a.S.phys.read.A1||0);const i=cols.findIndex(x=>Math.abs(I-x)<=0.03*x);return i<0?'ارفع تيار المجال ببطء حتى يقرأ الأميتر '+cols.join(' أو ')+' A (الآن '+fx(I,1)+' A).':i},
   rows:[RIf,{k:'I',h:'تيار القصر I<sub>L</sub> (A)',t:'Am',a:'GEN.U1',dp:1},{k:'Zs',h:'Z<sub>S</sub> = E (من منحنى اللاحمل عند I<sub>f</sub> نفسه) / I<sub>ph</sub> (Ω)',calc:v=>{const S=SMf(M);return S.E(v.If,S.ws)/(M.conn==='D'?v.I/SQ3:v.I)},dp:4}],px:'If',py:'I',plot:true,xu:'If (A)',yu:'Isc (A)'}],
  check:rec=>{const t=rec.t||{};const v=t[1]||t[0];if(!v||v.Zs==null)return 'سجّل القراءات.';const Zt=Math.hypot(M.Ra,M.Xs),Xs=Math.sqrt(Math.max(v.Zs*v.Zs-M.Ra*M.Ra,0));
   return `منحنى القصر خط مستقيم تقريباً. E تؤخذ من منحنى اللاحمل (اختبار الدائرة المفتوحة) عند تيار المجال نفسه. Z<sub>S</sub> = E/I<sub>ph</sub> = ${r3(v.Zs)} Ω ${ok(v.Zs,Zt,0.03)}، و X<sub>S</sub> = √(Z<sub>S</sub>² − R<sub>A</sub>²) = ${r3(Xs)} Ω (قيمة الآلة ${M.Xs} Ω).`}}}},
 ld:{name:'المولد على حمل: تنظيم الجهد',book:'g31',lab:'lsg',build:M=>{const S=SMf(M);const Rl=rnd(M.VL/SQ3/M.IL,4);return {figRef:'3-9',
  wiring:'المحرك الابتدائي يدير المولد. '+GLINK(M,'GEN')+'. U1 ← الأميتر A1 ← الحمل A، و V1 ← الحمل B، و W1 ← الحمل C. والفولتميتر بين U1 و V1. '+FIELD+'. اضبط I<sub>f</sub> حتى يكون جهد اللاحمل '+M.VL+' V ثم لا تغيّره.',
  parts:[PMv(M),GEN(M),EXC(M),AF(M),{kind:'ld3',id:'LD',R:Rl,lbl:'الحمل'},AL(M),VL1(M)],
  tables:[{id:'t',title:'جهد الأطراف مع أحمال مختلفة (|Z| = '+Rl+' Ω لكل طور)',xh:'الحمل',cols:['بلا حمل','R (cos θ = 1)','R-L (0.8 متأخر)','R-C (0.8 متقدم)'],col:a=>{const c=runGen(a,M);if(c)return c;const t=Math.round(a.knob('LD:LD'));const r0=(a.S.rec.t||{})[0];
    if(t===0){return Math.abs(a.S.phys.read.V1-M.VL)<=0.01*M.VL?0:'اضبط تيار المجال حتى يقرأ الفولتميتر '+M.VL+' V بلا حمل.'}if(!r0||r0.If==null)return 'سجّل عمود «بلا حمل» أولاً.';if(Math.abs(IfNow(a)-r0.If)>0.005*r0.If)return 'لا تغيّر تيار المجال: أعده إلى '+fx(r0.If,3)+' A.';return t},
   rows:[RIf,RV('V','V<sub>L</sub> (V)','GEN.U1','GEN.V1',1),{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'GEN.U1',dp:1},{k:'VR',h:'التنظيم (V<sub>0</sub> − V)/V (%)',calc:(v,a)=>{const r0=(a.S.rec.t||{})[0]||v;return r0&&r0.V?100*(r0.V-v.V)/v.V:null},dp:1}]}],
  check:(rec,a)=>{const t=rec.t||{};if(!t[0]||!t[0].V)return 'سجّل عمود «بلا حمل».';const c=B.BENCH.C;const E=t[0].V/SQ3,Zs=c.mul([M.conn==='D'?1/3:1,0],[M.Ra,M.Xs]);
   const exp=k=>{const Z=k===1?[Rl,0]:k===2?[Rl*0.8,Rl*0.6]:[Rl*0.8,-Rl*0.6];return SQ3*E*c.abs(Z)/c.abs(c.add(Z,Zs))};
   return [1,2,3].filter(k=>t[k]&&t[k].V!=null).map(k=>`${['','R','R-L','R-C'][k]}: V = ${fx(t[k].V,1)} V والمحسوب ${fx(exp(k),1)} V ${ok(t[k].V,exp(k),0.01)}، التنظيم ${fx(t[k].VR,1)} %`).join('<br>')+'<br>الحمل المتأخر يخفض الجهد أكثر (التنظيم موجب كبير)، والمتقدم قد يرفعه (التنظيم سالب) لأن تيار المكثف يقوي المجال.'}}}},
 syn:{name:'التوازي مع الشبكة',book:'g31',lab:'lsg',build:M=>{const S=SMf(M);const If0=occInv(M,Vw(M));return {figRef:'3-15',ovT:3,
  wiring:'المحرك الابتدائي يدير المولد. '+GLINK(M,'GEN')+'. U1 ← A1 ← ملف تيار W1 ← القاطع 1، و V1 ← ملف تيار W2 ← القاطع 3، و W1 ← القاطع 5. والقاطع 2 و 4 و 6 ← الشبكة L1 و L2 و L3. المصابيح بين 1–2 و 3–4 و 5–6. ملف جهد W1 بين خط U وخط W، وملف جهد W2 بين خط V وخط W (جهة المولد). V1 بين القاطعين 1 و 3، و V2 بين L1 و L2 للشبكة. '+FIELD+'.',
  parts:[{kind:'grid',id:'GR',V:M.VL,f:M.f,lbl:'الشبكة'},{kind:'sw3',id:'Q',lbl:'قاطع التوازي'},{kind:'lmp3',id:'LP',R:rnd(100*M.VL/SQ3/M.IL,1),Vr:2*M.VL/SQ3,lbl:'مصابيح التزامن'},PMv(M),GEN(M),EXC(M),AF(M),AL(M)].concat([{kind:'wm',id:'W1',ranges:M.IL>100?[100000,300000,1000000]:[300,1000,3000]},{kind:'wm',id:'W2',ranges:M.IL>100?[100000,300000,1000000]:[300,1000,3000]},VL1(M),Object.assign(VL1(M),{id:'V2'})]),
  tables:[{id:'b',title:'قبل الإغلاق: شروط التوازي',cols:['المصابيح مطفأة'],col:a=>{if(!a.sw('SW:GR'))return 'وصّل الشبكة.';const c=runGen(a,M);if(c&&!/السرعة/.test(c))return c;if(a.sw('SW:Q'))return 'سجّل قبل إغلاق القاطع.';const r=a.S.phys.read;return (r['LP:0']||r['LP:1']||r['LP:2'])?'انتظر حتى تنطفئ المصابيح الثلاث معاً (اضبط تيار المجال والسرعة).':0},
    rows:[RV('Vg','جهد المولد (V)','GEN.U1','GEN.V1',1),RV('Vb','جهد الشبكة (V)','GR.L1','GR.L2',1),{k:'n',h:'السرعة (rpm)',t:'N',dp:0}]},
   {id:'a',title:'بعد الإغلاق: التحكم في القدرة',xh:'الحالة',cols:['بعد الإغلاق مباشرة','بعد رفع سرعة المحرك الابتدائي','بعد رفع تيار المجال'],col:a=>{if(!a.sw('SW:Q'))return 'أغلق قاطع التوازي (والمصابيح مطفأة).';const ph=a.S.phys;if(!ph.synced)return 'المولد غير متزامن.';if(!steady(a)&&Math.abs(ph.acc)>0.3)return 'انتظر حتى تستقر القراءات.';
     const P=(ph.read.W1||0)+(ph.read.W2||0),Pr=SQ3*M.VL*M.IL;const T=a.S.rec.a||{};const If=IfNow(a);
     if(!T[0])return Math.abs(P)<0.05*Pr?0:'سجّل العمود الأول مباشرة بعد الإغلاق (والقدرة قريبة من الصفر).';
     if(!T[1])return P>0.2*Pr&&Math.abs(If-T[0].If)<0.02*T[0].If?1:'ارفع سرعة المحرك الابتدائي (دون تغيير تيار المجال) حتى تصبح القدرة نحو نصف المقننة.';
     return If>1.1*T[0].If&&Math.abs(P-T[1].P)<0.1*Math.abs(T[1].P)?2:'ارفع تيار المجال نحو 20% (دون تغيير سرعة المحرك الابتدائي).'},
    rows:[RIf,{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'GEN.U1',dp:1},{k:'W1',h:'W<sub>1</sub> (W)',t:'Wr',m:'W1',a:'GEN.U1',b:'GEN.W1',dp:0},{k:'W2',h:'W<sub>2</sub> (W)',t:'Wr',m:'W2',a:'GEN.V1',b:'GEN.W1',dp:0},{k:'P',h:'P = W<sub>1</sub> + W<sub>2</sub> (W)',calc:v=>v.W1+v.W2,dp:0},{k:'Q',h:'Q = √3(W<sub>1</sub> − W<sub>2</sub>) (VAR)',calc:v=>SQ3*(v.W1-v.W2),dp:0}]}],
  check:rec=>{const b=T0(rec,'b'),t=rec.a||{};let h='';if(b.Vg!=null)h+=`قبل الإغلاق: جهد المولد ${fx(b.Vg,0)} V وجهد الشبكة ${fx(b.Vb,0)} V ${ok(b.Vg,b.Vb,0.03)}، والمصابيح الثلاث مطفأة معاً (التردد والطور والتتابع متطابقة).`;
   if(t[1]&&t[0]&&t[1].P!=null)h+=`<br>رفع سرعة المحرك الابتدائي: P من ${fx(t[0].P,0)} إلى ${fx(t[1].P,0)} W ${t[1].P>t[0].P?'✓':'✗'}، والسرعة لم تتغير (مقيدة بالشبكة): الطاقة الميكانيكية الزائدة تصير قدرة فعالة.`;
   if(t[2]&&t[2].Q!=null)h+=`<br>رفع تيار المجال: Q من ${fx(t[1].Q,0)} إلى ${fx(t[2].Q,0)} VAR ${t[2].Q>t[1].Q?'✓':'✗'} والقدرة الفعالة تقريباً كما هي: التهيج يتحكم في القدرة غير الفعالة.`;return h||'سجّل الجدولين.'}}}},
 sst:{name:'بدء المحرك التزامني',book:'m41',lab:'lsg',build:M=>{const S=SMf(M);return {figRef:'4-3',
  wiring:'الشبكة L1 ← A1 ← U1، و L2 ← V1، و L3 ← W1. '+GLINK(M,'MOT').replace('المنتج','الثابت')+'. '+FIELD.replace('F1','MOT.F1').replace('F2','MOT.F2')+'. ابدأ ومفتاح «تقصير المجال» مغلق ومصدر المجال مطفأ، وبعد أن يقترب المحرك من السرعة التزامنية شغّل مصدر المجال وافتح مفتاح التقصير.',
  parts:[{kind:'grid',id:'GR',V:M.VL,f:M.f,lbl:'الشبكة'},GEN(M,{id:'MOT',motor:1}),EXC(M),AF(M),{kind:'brake',id:'BR',Tmax:Math.ceil(M.Tr*1.5),step:0.1,lbl:'الفرملة'},AL(M)],
  tables:[{id:'t',title:'البدء بالقفص المخمد ثم الدخول في التزامن — بلا حمل',xh:'المرحلة',cols:['قبل توصيل المجال','بعد توصيل المجال'],col:a=>{const ph=a.S.phys;if(!a.sw('SW:GR'))return 'وصّل الشبكة.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';
    if(Math.abs(ph.If||0)<1e-3)return Math.abs(ph.s)>0.001?0:'المحرك بلا مجال يدور أقل قليلاً من التزامنية.';return ph.synced?1:'المحرك لم يدخل التزامن بعد.'},
   rows:[{k:'n',h:'السرعة n (rpm)',t:'N',dp:1},{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'MOT.U1',dp:2}]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1])return 'سجّل المرحلتين.';return `قبل المجال: ${fx(t[0].n,1)} rpm (أقل من ${S.ns} rpm: القفص المخمد يعمل كمحرك حثي ولا يصل للتزامنية). بعد المجال: ${fx(t[1].n,1)} rpm ${ok(t[1].n,S.ns,0.0005)}: الأقطاب المغناطيسية للعضو الدوار تُسحب مع المجال الدوار فيدور بالسرعة التزامنية تماماً.`}}}},
 vc:{name:'منحنيات V',book:'m41',lab:'lsg',build:M=>{const S=SMf(M);const TL=rnd(M.Tr*0.5,1);const If0=occInv(M,Vw(M));const cols=[0.7,0.85,1,1.2,1.4].map(k=>rnd(If0*k,M.Rf>50?3:2));return {figRef:'4-6',
  wiring:'الشبكة L1 ← A1 ← ملف تيار W1 ← U1، و L2 ← ملف تيار W2 ← V1، و L3 ← W1. ملف جهد W1 بين L1 و L3، وملف جهد W2 بين L2 و L3. '+GLINK(M,'MOT').replace('المنتج','الثابت')+'. '+FIELD.replace('F1','MOT.F1').replace('F2','MOT.F2')+'. ابدأ ومفتاح «تقصير المجال» مغلق، ثم المجال قرب التزامنية.',
  parts:[{kind:'grid',id:'GR',V:M.VL,f:M.f,lbl:'الشبكة'},GEN(M,{id:'MOT',motor:1}),EXC(M),AF(M),{kind:'brake',id:'BR',Tmax:Math.ceil(M.Tr*1.5),step:0.1,lbl:'الفرملة'},AL(M),{kind:'wm',id:'W1',ranges:M.IL>10?[3000,10000,30000]:[300,1000,3000]},{kind:'wm',id:'W2',ranges:M.IL>10?[3000,10000,30000]:[300,1000,3000]}],
  tables:[{id:'t',title:'حمل ثابت '+TL+' N·m مع تيار مجال مختلف',xh:'I<sub>f</sub> (A)',cols,col:a=>{const ph=a.S.phys;if(!ph.synced)return 'شغّل المحرك وأدخله في التزامن أولاً.';if(Math.abs(a.knob('K:BR')-TL)>0.06)return 'اضبط عزم الحمل على '+TL+' N·m.';if(!steady(a))return 'انتظر حتى تستقر القراءات.';const I=IfNow(a);const i=cols.findIndex(x=>Math.abs(I-x)<=0.02*x);return i<0?'اضبط تيار المجال على '+cols.join(' أو ')+' A (الآن '+fx(I,3)+' A).':i},
   rows:[RIfm,{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'MOT.U1',dp:2},{k:'W1',h:'W<sub>1</sub> (W)',t:'Wr',m:'W1',a:'MOT.U1',b:'MOT.W1',dp:0},{k:'W2',h:'W<sub>2</sub> (W)',t:'Wr',m:'W2',a:'MOT.V1',b:'MOT.W1',dp:0},{k:'pf',h:'cos θ',calc:v=>(v.W1+v.W2)/(SQ3*M.VL*v.I),dp:3}],px:'If',py:'I',plot:true,xu:'If (A)',yu:'I (A)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((c,i)=>t[i]).filter(v=>v&&v.pf!=null);if(rows.length<cols.length)return 'أكمل الأعمدة الخمسة.';const mI=rows.reduce((m,v)=>v.I<m.I?v:m),mP=rows.reduce((m,v)=>v.pf>m.pf?v:m);
   return `أقل تيار ${fx(mI.I,2)} A عند I<sub>f</sub> = ${fx(mI.If,2)} A، وأعلى معامل قدرة ${fx(mP.pf,3)} عند النقطة نفسها ${mI===mP?'✓':'✗'}. يساره (تهيج ناقص) التيار متأخر، ويمينه (تهيج زائد) متقدم، والمنحنى على شكل V.`}}}},
 lc:{name:'تغيير الحمل',book:'m41',lab:'lsg',build:M=>{const S=SMf(M);const If1=rnd(occInv(M,Vw(M))*1.2,M.Rf>50?3:2);const Ts=[0,0.5,1].map(k=>rnd(M.Tr*k,1));return {figRef:'4-8',
  wiring:'الشبكة L1 ← A1 ← U1، و L2 ← V1، و L3 ← W1. '+GLINK(M,'MOT').replace('المنتج','الثابت')+'. '+FIELD.replace('F1','MOT.F1').replace('F2','MOT.F2')+'. ثبّت تيار المجال على '+If1+' A بعد الدخول في التزامن.',
  parts:[{kind:'grid',id:'GR',V:M.VL,f:M.f,lbl:'الشبكة'},GEN(M,{id:'MOT',motor:1}),EXC(M),AF(M),{kind:'brake',id:'BR',Tmax:Math.ceil(M.Tr*1.5),step:0.1,lbl:'الفرملة'},AL(M)],
  tables:[{id:'t',title:'I<sub>f</sub> ثابت = '+If1+' A مع أحمال مختلفة',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{const ph=a.S.phys;if(!ph.synced)return 'شغّل المحرك وأدخله في التزامن أولاً.';if(Math.abs(IfNow(a)-If1)>0.02*If1)return 'اضبط تيار المجال على '+If1+' A.';if(!steady(a))return 'انتظر حتى تستقر القراءات.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<0.06);return i<0?'اضبط عزم الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[{k:'n',h:'السرعة n (rpm)',t:'N',dp:1},{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'MOT.U1',dp:2},{k:'d',h:'زاوية الحمل δ (°) من الستروبوسكوب',t:'D',dp:1}],py:'d',plot:true,xu:'T (N·m)',yu:'δ (°)'}],
  check:(rec,a)=>{const t=rec.t||{};const rows=Ts.map((T,i)=>t[i]?[T,t[i]]:null).filter(x=>x&&x[1].d!=null);if(!rows.length)return 'سجّل القراءات.';const E=SMf(M).E(If1,S.ws);
   return rows.map(([T,v])=>{const de=-Math.asin(Math.min(1,(T+0.02*M.Tr)*S.ws*M.Xs/(3*E*Vw(M))))*180/Math.PI;return `T = ${T} N·m: n = ${fx(v.n,1)} rpm ${ok(v.n,S.ns,0.0005)}، δ = ${fx(v.d,1)}° والمحسوب من P = 3EV sin δ / X<sub>S</sub> ≈ ${fx(de,1)}° ${Math.abs(v.d-de)<=Math.max(1.5,0.08*Math.abs(de))?'✓':'✗'}`}).join('<br>')+'<br>السرعة ثابتة مهما تغيّر الحمل، والذي يتغيّر هو زاوية الحمل δ (يتأخر العضو الدوار عن المجال الدوار).'}}}},
 fc:{name:'تغيير تيار المجال',book:'m41',lab:'lsg',build:M=>{const TL=rnd(M.Tr*0.5,1);const If0=occInv(M,Vw(M));const cols=[0.75,1,1.4].map(k=>rnd(If0*k,M.Rf>50?3:2));return {figRef:'4-10',
  wiring:'الشبكة L1 ← A1 ← ملف تيار W1 ← U1، و L2 ← ملف تيار W2 ← V1، و L3 ← W1. ملف جهد W1 بين L1 و L3، وملف جهد W2 بين L2 و L3. '+GLINK(M,'MOT').replace('المنتج','الثابت')+'. '+FIELD.replace('F1','MOT.F1').replace('F2','MOT.F2')+'.',
  parts:[{kind:'grid',id:'GR',V:M.VL,f:M.f,lbl:'الشبكة'},GEN(M,{id:'MOT',motor:1}),EXC(M),AF(M),{kind:'brake',id:'BR',Tmax:Math.ceil(M.Tr*1.5),step:0.1,lbl:'الفرملة'},AL(M),{kind:'wm',id:'W1',ranges:M.IL>10?[3000,10000,30000]:[300,1000,3000]},{kind:'wm',id:'W2',ranges:M.IL>10?[3000,10000,30000]:[300,1000,3000]}],
  tables:[{id:'t',title:'حمل ثابت '+TL+' N·m',xh:'التهيج',cols:['ناقص ('+cols[0]+' A)','عادي ('+cols[1]+' A)','زائد ('+cols[2]+' A)'],col:a=>{const ph=a.S.phys;if(!ph.synced)return 'شغّل المحرك وأدخله في التزامن أولاً.';if(Math.abs(a.knob('K:BR')-TL)>0.06)return 'اضبط عزم الحمل على '+TL+' N·m.';if(!steady(a))return 'انتظر حتى تستقر القراءات.';const I=IfNow(a);const i=cols.findIndex(x=>Math.abs(I-x)<=0.02*x);return i<0?'اضبط تيار المجال على '+cols.join(' أو ')+' A.':i},
   rows:[RIfm,{k:'I',h:'I<sub>L</sub> (A)',t:'Am',a:'MOT.U1',dp:2},{k:'W1',h:'W<sub>1</sub> (W)',t:'Wr',m:'W1',a:'MOT.U1',b:'MOT.W1',dp:0},{k:'W2',h:'W<sub>2</sub> (W)',t:'Wr',m:'W2',a:'MOT.V1',b:'MOT.W1',dp:0},{k:'Q',h:'Q = √3(W<sub>1</sub> − W<sub>2</sub>) (VAR)',calc:v=>SQ3*(v.W1-v.W2),dp:0}]}],
  check:rec=>{const t=rec.t||{};if(![0,1,2].every(i=>t[i]&&t[i].Q!=null))return 'سجّل الحالات الثلاث.';const P=[0,1,2].map(i=>t[i].W1+t[i].W2);
   return `Q: ${fx(t[0].Q,0)} ثم ${fx(t[1].Q,0)} ثم ${fx(t[2].Q,0)} VAR ${t[0].Q>0&&t[2].Q<0?'✓':'✗'}: بتهيج ناقص يسحب المحرك قدرة غير فعالة (تيار متأخر)، وبتهيج زائد يعطيها للشبكة (تيار متقدم) فيعمل كمكثف تزامني. والقدرة الفعالة ثابتة تقريباً (${P.map(x=>fx(x,0)).join(' و ')} W) ${ok(P[2],P[0],0.05)} لأن الحمل ثابت.`}}}}
});
const vfB=EX.vf.build;EX.vf.build=(M,mk)=>{const ex=vfB(M,mk);const fs=ex.tables[0].cols;ex.tables[0].rows[1].calc=(v)=>v._f!=null?120*v._f/M.p:null;
 ex.tables[0].rows.push({k:'_f',h:'f (Hz)',t:'K',knob:'F:S',dp:0});return ex};
const LES={'u3-l4':['oc','sc'],'u3-l5':['ld'],'u3-l6':['syn'],'u4-l2':['sst'],'u4-l3':['vc'],'u4-l4':['lc'],'u4-l5':['fc'],'u2-l2':['sp','rev1'],'u2-l3':['cs'],'u2-l4':['perm','two'],'u2-l5':['shd'],'u1-l3':['slip','rev'],'u1-l5':['nlbr','dct'],'u1-l7':['load'],'u1-l8':['tn'],'u1-l9':['dol','sd','sr','at','wr'],'u1-l10':['vf','wr']};
window.ACM.bind(B,LES,EX,MACH);B.ACMBENCH={EX,LES,MACH,nSteady};
})(PLCBOOK);
