/* «منضدة القياس» — دوائر كهربائية 2 (التيار المتردد): تجارب قياس من خارج الكتاب. القيم توضيحية (في تقرير المقرر). */
(function(B){if(!B.BENCH||!window.MEAS)return;
const r3=x=>+(+x).toPrecision(3),ok=(m,c,tol)=>Math.abs(m-c)<=Math.max(tol||0.03*Math.abs(c),0.01)?'✓':'✗',PI2=2*Math.PI;
const T0=(rec,id)=>(rec[id]||{})[0]||{};
const V=(k,h,a,b,dp)=>({k,h,t:'V',a,b,dp:dp!=null?dp:2}),I=(k,h,el,dp,idx)=>({k,h,t:'I',el,idx,dp:dp!=null?dp:4});
const set=(src,Vv,f)=>a=>{if(!a.sw('SW:'+src))return 'شغّل المولد أولاً.';if(Math.abs(a.knob('K:'+src)-Vv)>0.15)return 'اضبط جهد المولد على '+Vv+' V.';if(f!=null&&a.S.phys.f!=null&&Math.abs(a.S.phys.f-f)>0.6)return 'اضبط التردد على '+f+' Hz.';return 0};
const fcol=(src,Vv,fs)=>a=>{const c=set(src,Vv)(a);if(c)return c;const i=fs.findIndex(f=>Math.abs(a.knob('F:'+src)-f)<0.6);return i<0?'اضبط التردد على '+fs.join(' أو ')+' Hz.':i};
const gen=(o)=>Object.assign({kind:'acs',id:'G',V:30,f:50,fmin:20,fmax:1000},o||{});
const vm=r=>({kind:'vm',id:'V1',ac:1,ranges:r||[3,10,30,100]}),am=r=>({kind:'am',id:'A1',ac:1,ranges:r||[0.03,0.1,0.3,1]});
const EX={
 xl:{ac:1,name:'الممانعة الحثية والتردد',figRef:'1-12',wiring:'طرف المولد 1 ← الأميتر ← الملف L ← طرف المولد 2، والفولتميتر على الملف.',
  parts:[gen(),{kind:'l',id:'L',L:0.1},vm(),am()],
  tables:[{id:'t',title:'ملف L = 0.1 H — V = 10 V',xh:'التردد f (Hz)',cols:[50,100,200,400],col:fcol('G',10,[50,100,200,400]),
   rows:[V('V','V<sub>L</sub> (V)','L.a','L.b'),I('I','I (A)','L'),{k:'X',h:'X<sub>L</sub> = V/I (Ω)',calc:v=>v.V/v.I,dp:1}],py:'X',plot:true,xu:'f (Hz)',yu:'XL (Ω)'}],
  check:rec=>{const t=rec.t||{};const xs=[50,100,200,400].map((f,i)=>t[i]&&t[i].X!=null?`${f} Hz: ${r3(t[i].X)} Ω (2πfL = ${r3(PI2*f*0.1)} ${ok(t[i].X,PI2*f*0.1)})`:null).filter(Boolean);return xs.length?'X<sub>L</sub> = 2πfL تتناسب طردياً مع التردد:<br>'+xs.join('<br>'):'سجّل القراءات.'}},
 xc:{ac:1,name:'الممانعة السعوية والتردد',figRef:'1-13',wiring:'طرف المولد 1 ← الأميتر ← المكثف C ← طرف المولد 2، والفولتميتر على المكثف.',
  parts:[gen(),{kind:'c',id:'C',C:10e-6},vm(),am()],
  tables:[{id:'t',title:'مكثف C = 10 µF — V = 10 V',xh:'التردد f (Hz)',cols:[50,100,200,400],col:fcol('G',10,[50,100,200,400]),
   rows:[V('V','V<sub>C</sub> (V)','C.a','C.b'),I('I','I (A)','C'),{k:'X',h:'X<sub>C</sub> = V/I (Ω)',calc:v=>v.V/v.I,dp:1}],py:'X',plot:true,xu:'f (Hz)',yu:'XC (Ω)'}],
  check:rec=>{const t=rec.t||{};const xs=[50,100,200,400].map((f,i)=>t[i]&&t[i].X!=null?`${f} Hz: ${r3(t[i].X)} Ω (1/2πfC = ${r3(1/(PI2*f*10e-6))} ${ok(t[i].X,1/(PI2*f*10e-6))})`:null).filter(Boolean);return xs.length?'X<sub>C</sub> = 1/(2πfC) تتناسب عكسياً مع التردد:<br>'+xs.join('<br>'):'سجّل القراءات.'}},
 rlc:{ac:1,name:'دائرة RLC على التوالي',figRef:'1-25',wiring:'طرف المولد 1 ← الأميتر ← R ← L ← C ← طرف المولد 2. والفولتميتر على كل عنصر ثم على المولد.',
  parts:[gen({fixedF:1,f:100}),{kind:'r',id:'R',R:100},{kind:'l',id:'L',L:0.1},{kind:'c',id:'C',C:10e-6},vm(),am()],
  tables:[{id:'t',title:'R = 100 Ω، L = 0.1 H، C = 10 µF — V = 10 V و f = 100 Hz',cols:['—'],col:set('G',10),
   rows:[I('I','I (A)','R'),V('VR','V<sub>R</sub> (V)','R.a','R.b'),V('VL','V<sub>L</sub> (V)','L.a','L.b'),V('VC','V<sub>C</sub> (V)','C.a','C.b'),V('V','V (V)','G.1','G.2'),{k:'Z',h:'Z = V/I (Ω)',calc:v=>v.V/v.I,dp:1}]}],
  check:rec=>{const v=T0(rec,'t');if(v.V==null||v.VC==null||v.I==null||v.VR==null||v.VL==null)return 'سجّل كل القراءات.';const vec=Math.hypot(v.VR,v.VL-v.VC),Z=Math.hypot(100,PI2*100*0.1-1/(PI2*100*10e-6));
   return `الجمع الحسابي V<sub>R</sub> + V<sub>L</sub> + V<sub>C</sub> = ${r3(v.VR+v.VL+v.VC)} V ≠ V = ${r3(v.V)} V، لأن الجهود ليست في طور واحد.<br>الجمع الاتجاهي √(V<sub>R</sub>² + (V<sub>L</sub> − V<sub>C</sub>)²) = ${r3(vec)} V ≈ V ${ok(vec,v.V)}<br>Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²) = ${r3(Z)} Ω، والقياس ${r3(v.Z)} Ω ${ok(v.Z,Z)}`}},
 res:{ac:1,name:'رنين التوالي',figRef:'1-27',wiring:'طرف المولد 1 ← الأميتر ← R ← L ← C ← طرف المولد 2.',
  parts:[gen(),{kind:'r',id:'R',R:20},{kind:'l',id:'L',L:0.1},{kind:'c',id:'C',C:10e-6},vm([10,30,100]),am([0.1,0.3,1])],
  tables:[{id:'t',title:'R = 20 Ω، L = 0.1 H، C = 10 µF — V = 10 V',xh:'التردد f (Hz)',cols:[80,120,159,200,300],col:fcol('G',10,[80,120,159,200,300]),
   rows:[I('I','I (A)','R'),{k:'Z',h:'Z = V/I (Ω)',calc:v=>10/v.I,dp:1}],py:'I',plot:true,xu:'f (Hz)',yu:'I (A)'}],
  check:rec=>{const t=rec.t||{};const is=[0,1,2,3,4].map(i=>t[i]&&t[i].I);if(is.some(x=>x==null))return 'أكمل الأعمدة الخمسة.';const m=is.indexOf(Math.max(...is));const f0=1/(PI2*Math.sqrt(0.1*10e-6));
   return `أكبر تيار عند ${[80,120,159,200,300][m]} Hz ${m===2?'✓':'✗'}، وتردد الرنين f<sub>r</sub> = 1/(2π√LC) = ${r3(f0)} Hz. عنده X<sub>L</sub> = X<sub>C</sub> فتصبح Z = R = 20 Ω وأكبر تيار = V/R = 0.5 A (القياس ${r3(is[2])} A).`}},
 par:{ac:1,name:'دائرة RLC على التوازي',figRef:'',wiring:'طرف المولد 1 ← الأميتر ← المجموعة a في عقد التوصيل، ثم R و L و C كل منها من a إلى b، و b ← طرف المولد 2. انقل الأميتر إلى فرع كل عنصر (والمولد مطفأ).',
  parts:[gen({fixedF:1,f:100}),{kind:'jb',id:'J'},{kind:'r',id:'R',R:100},{kind:'l',id:'L',L:0.1},{kind:'c',id:'C',C:10e-6},vm(),am()],
  tables:[{id:'t',title:'R = 100 Ω، L = 0.1 H، C = 10 µF — V = 10 V و f = 100 Hz',cols:['—'],col:set('G',10),
   rows:[I('I','I الكلي (A)','G'),I('IR','I<sub>R</sub> (A)','R'),I('IL','I<sub>L</sub> (A)','L'),I('IC','I<sub>C</sub> (A)','C'),V('V','V (V)','R.a','R.b')]}],
  check:rec=>{const v=T0(rec,'t');if([v.I,v.IR,v.IL,v.IC].some(x=>x==null))return 'سجّل كل التيارات.';const vec=Math.hypot(v.IR,v.IL-v.IC);
   return `الجمع الحسابي I<sub>R</sub> + I<sub>L</sub> + I<sub>C</sub> = ${r3(v.IR+v.IL+v.IC)} A ≠ I = ${r3(v.I)} A.<br>الجمع الاتجاهي √(I<sub>R</sub>² + (I<sub>L</sub> − I<sub>C</sub>)²) = ${r3(vec)} A ≈ I ${ok(vec,v.I)}`}},
 tank:{ac:1,name:'دائرة الخزان (رنين التوازي)',figRef:'',wiring:'طرف المولد 1 ← الأميتر ← المجموعة a، والملف L والمكثف C كلاهما من a إلى b، و b ← طرف المولد 2.',
  parts:[gen(),{kind:'jb',id:'J'},{kind:'l',id:'L',L:0.1,r:5},{kind:'c',id:'C',C:10e-6},vm(),am([0.01,0.03,0.1,0.3])],
  tables:[{id:'t',title:'L = 0.1 H (مقاومة الملف 5 Ω) ∥ C = 10 µF — V = 10 V',xh:'التردد f (Hz)',cols:[100,140,159,180,250],col:fcol('G',10,[100,140,159,180,250]),
   rows:[I('I','I الكلي (A)','G'),{k:'Z',h:'Z = V/I (Ω)',calc:v=>10/v.I,dp:0}],py:'I',plot:true,xu:'f (Hz)',yu:'I (A)'}],
  check:rec=>{const t=rec.t||{};const is=[0,1,2,3,4].map(i=>t[i]&&t[i].I);if(is.some(x=>x==null))return 'أكمل الأعمدة الخمسة.';const m=is.indexOf(Math.min(...is));
   return `أقل تيار من المولد عند ${[100,140,159,180,250][m]} Hz ${m===2?'✓':'✗'}: في رنين التوازي تصبح المعاوقة أكبر ما يمكن (Z ≈ L/(rC) = 2000 Ω)، والتيار يدور بين الملف والمكثف ولا يأخذ من المولد إلا قليلاً. القياس عند الرنين: Z = ${r3(10/is[2])} Ω`}},
 sp:{ac:1,name:'دائرة توالي — توازي',figRef:'',wiring:'طرف المولد 1 ← الأميتر ← R1 ← العقدة a، ثم R2 و C بين a و b، و b ← طرف المولد 2.',
  parts:[gen({fixedF:1,f:50}),{kind:'jb',id:'J'},{kind:'r',id:'R1',R:100},{kind:'r',id:'R2',R:220},{kind:'c',id:'C',C:10e-6},vm(),am()],
  tables:[{id:'t',title:'R1 = 100 Ω ثم (R2 = 220 Ω ∥ C = 10 µF) — V = 10 V و f = 50 Hz',cols:['—'],col:set('G',10),
   rows:[I('I','I (A)','R1'),V('V1','V<sub>R1</sub> (V)','R1.a','R1.b'),V('V2','V<sub>المجموعة</sub> (V)','R2.a','R2.b'),V('V','V (V)','G.1','G.2')]}],
  check:rec=>{const v=T0(rec,'t');if([v.I,v.V1,v.V2,v.V].some(x=>x==null))return 'سجّل كل القراءات.';const C=B.BENCH.C,Zp=C.div([1,0],[1/220,PI2*50*10e-6]),Z=C.add([100,0],Zp),Ic=10/C.abs(Z);
   return `Z<sub>ab</sub> = R2 ∥ (−jX<sub>C</sub>) = ${r3(Zp[0])} ${Zp[1]<0?'−':'+'} j${r3(Math.abs(Zp[1]))} Ω، و Z الكلية = ${r3(C.abs(Z))} Ω، فالتيار = ${r3(Ic)} A. القياس: ${r3(v.I)} A ${ok(v.I,Ic)}<br>V<sub>R1</sub> + V<sub>ab</sub> = ${r3(v.V1+v.V2)} V ≠ V = ${r3(v.V)} V (جمع اتجاهي)`}},
 pw:{ac:1,name:'القدرة ومعامل القدرة بالواتميتر',figRef:'',wiring:'طرف المولد 1 ← ملف التيار في الواتميتر (* ثم I) ← الأميتر ← R ← L ← طرف المولد 2. وملف الجهد (* و V) على طرفي المولد، والفولتميتر على طرفي المولد.',
  parts:[gen({fixedF:1,f:50}),{kind:'r',id:'R',R:100},{kind:'l',id:'L',L:0.2},{kind:'wm',id:'W',ranges:[1,3,10]},vm(),am()],
  tables:[{id:'t',title:'R = 100 Ω + L = 0.2 H — V = 20 V و f = 50 Hz',cols:['—'],col:set('G',20),
   rows:[V('V','V (V)','G.1','G.2'),I('I','I (A)','R'),{k:'P',h:'P الواتميتر (W)',t:'W',el:'G',a:'G.1',b:'G.2',dp:2},{k:'S',h:'S = V·I (VA)',calc:v=>v.V*v.I,dp:2},{k:'pf',h:'cos φ = P/S',calc:v=>v.P/(v.V*v.I),dp:3},{k:'Q',h:'Q = √(S² − P²) (VAR)',calc:v=>Math.sqrt(Math.max((v.V*v.I)**2-v.P*v.P,0)),dp:2}]}],
  check:rec=>{const v=T0(rec,'t');if([v.V,v.I,v.P].some(x=>x==null))return 'سجّل V و I وقراءة الواتميتر.';const XL=PI2*50*0.2,pf=100/Math.hypot(100,XL),P=v.I*v.I*100;
   return `الواتميتر يقيس القدرة الفعالة وحدها، وهي تُستهلك في R فقط: I²R = ${r3(P)} W ≈ ${r3(v.P)} W ${ok(v.P,P)}<br>cos φ = R/Z = ${r3(pf)}، والقياس ${r3(v.pf)} ${ok(v.pf,pf)} (حمل حثي: التيار متأخر)`}},
 y3:{ac:1,name:'توصيلة النجمة',figRef:'',wiring:'كل خط (L1 و L2 و L3) ← طرف مقاومة، والأطراف الأخرى معاً في المجموعة a (نقطة النجمة)، ونقطة النجمة ← N. أدخل الأميتر في الخط L1.',
  parts:[{kind:'ac3',id:'A',V:50},{kind:'jb',id:'J'},{kind:'r',id:'R1',R:100},{kind:'r',id:'R2',R:100},{kind:'r',id:'R3',R:100},vm([10,30,100]),am([0.1,0.3,1])],
  tables:[{id:'t',title:'حمل نجمة متزن 100 Ω — جهد الطور للمصدر 20 V',cols:['—'],col:set('A',20),
   rows:[V('VL','V<sub>L</sub> بين خطين (V)','R1.a','R2.a'),V('Vp','V<sub>ph</sub> على المقاومة (V)','R1.a','R1.b'),I('IL','I<sub>L</sub> = I<sub>ph</sub> (A)','R1'),{k:'q',h:'V<sub>L</sub>/V<sub>ph</sub>',calc:v=>v.VL/v.Vp,dp:3}]}],
  check:rec=>{const v=T0(rec,'t');if(v.q==null)return 'سجّل جهد الخط وجهد الطور.';return `في النجمة: V<sub>L</sub> = √3 · V<sub>ph</sub>، والنسبة المقاسة ${r3(v.q)} ≈ 1.732 ${ok(v.q,1.732)}. وتيار الخط = تيار الطور${v.IL!=null?' = '+r3(v.IL)+' A':''}. ولأن الحمل متزن فتيار المحايد ≈ صفر.`}},
 d3:{ac:1,name:'توصيلة الدلتا',figRef:'',wiring:'R1 بين L1 و L2، و R2 بين L2 و L3، و R3 بين L3 و L1. أدخل الأميتر مرة في الخط L1 ومرة في فرع R1 (والمصدر مطفأ عند النقل).',
  parts:[{kind:'ac3',id:'A',V:50},{kind:'jb',id:'J'},{kind:'r',id:'R1',R:100},{kind:'r',id:'R2',R:100},{kind:'r',id:'R3',R:100},vm([10,30,100]),am([0.1,0.3,1])],
  tables:[{id:'t',title:'حمل دلتا متزن 100 Ω — جهد الطور للمصدر 20 V',cols:['—'],col:set('A',20),
   rows:[V('VL','V<sub>L</sub> = V<sub>ph</sub> (V)','R1.a','R1.b'),I('IL','I<sub>L</sub> في الخط L1 (A)','A',4,0),I('Ip','I<sub>ph</sub> في R1 (A)','R1'),{k:'q',h:'I<sub>L</sub>/I<sub>ph</sub>',calc:v=>v.IL/v.Ip,dp:3}]}],
  check:rec=>{const v=T0(rec,'t');if(v.q==null)return 'سجّل تيار الخط وتيار الطور.';return `في الدلتا: جهد الخط = جهد الطور (${v.VL!=null?r3(v.VL)+' V':''})، و I<sub>L</sub> = √3 · I<sub>ph</sub>: النسبة المقاسة ${r3(v.q)} ≈ 1.732 ${ok(v.q,1.732)}`}},
 w2:{ac:1,name:'طريقة الواتميترين',figRef:'',wiring:'حمل نجمة من ثلاث معاوقات (R + L). ملف التيار في W1 في الخط L1، وملف جهده بين L1 و L3. ملف التيار في W2 في الخط L2، وملف جهده بين L2 و L3. الخط L3 بلا واتميتر.',
  parts:[{kind:'ac3',id:'A',V:50},{kind:'jb',id:'J'},{kind:'rl',id:'Z1',R:100,L:0.2},{kind:'rl',id:'Z2',R:100,L:0.2},{kind:'rl',id:'Z3',R:100,L:0.2},{kind:'wm',id:'W1',ranges:[3,10,30]},{kind:'wm',id:'W2',ranges:[3,10,30]}],
  tables:[{id:'t',title:'حمل نجمة متزن: R = 100 Ω + L = 0.2 H في كل طور — جهد الطور 20 V و f = 50 Hz',cols:['—'],col:set('A',20),
   rows:[{k:'W1',h:'W<sub>1</sub> (W)',t:'Wm',m:'W1',src:'A',idx:0,a:'A.L1',b:'A.L3',dp:3},{k:'W2',h:'W<sub>2</sub> (W)',t:'Wm',m:'W2',src:'A',idx:1,a:'A.L2',b:'A.L3',dp:3},{k:'P',h:'P = W<sub>1</sub> + W<sub>2</sub> (W)',calc:v=>v.W1+v.W2,dp:3},{k:'pf',h:'cos φ من القراءتين',calc:v=>Math.cos(Math.atan(Math.sqrt(3)*(v.W1-v.W2)/(v.W1+v.W2))),dp:3}]}],
  check:rec=>{const v=T0(rec,'t');if(v.P==null)return 'سجّل قراءتي الواتميترين.';const Z=Math.hypot(100,PI2*50*0.2),Ip=20/Z,P=3*Ip*Ip*100,pf=100/Z;
   return `القدرة الكلية = W1 + W2 = ${r3(v.P)} W، والمحسوبة 3·I<sub>ph</sub>²·R = ${r3(P)} W ${ok(Math.abs(v.P),P)}<br>tan φ = √3 (W1 − W2)/(W1 + W2)، فـ cos φ = ${r3(v.pf)} والمحسوب R/Z = ${r3(pf)} ${ok(v.pf,pf)}`}}
};
const LES={'u1-l5':['xl','xc'],'u1-l6':['rlc'],'u1-l7':['res'],'u1-l8':['par'],'u1-l9':['tank'],'u1-l10':['sp'],'u1-l12':['pw'],'u1-l13':['pw'],'u1-l14':['pw'],'u2-l2':['y3','d3'],'u2-l4':['w2']};
MEAS.bind(B,LES,EX);B.C2BENCH={EX,LES};
})(PLCBOOK);
