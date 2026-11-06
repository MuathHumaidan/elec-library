/* Unit 2 — تشغيل المحرك نجمة / دلتا مع عكس الحركة (ص 33–56) */
(function(B){
const {S,clamp}=B;

/* ---------- shared drawings for this unit ---------- */
function coilPath(x1,y1,x2,y2,n){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.22,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${x1} ${y1}L${x1+ux*lead} ${y1+uy*lead}`;for(let i=1;i<=n;i++){p+=`A${r} ${r} 0 0 1 ${(x1+ux*(lead+seg*i)).toFixed(1)} ${(y1+uy*(lead+seg*i)).toFixed(1)}`}return p+`L${x2} ${y2}`}
function windSVG(mode){
  const W=220,H=210,cx=110,cy=114,ang=[-90,150,30].map(a=>a*Math.PI/180),lbl=['L1','L2','L3'],active=mode!=='off',wc=active?'w flow':'w';
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="توصيل ملفات المحرك">`;
  if(mode==='delta'){const R=64,P=ang.map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
    for(let i=0;i<3;i++){const a=P[i],b=P[(i+1)%3];s+=`<path class="${wc}" d="${coilPath(a[0],a[1],b[0],b[1],4)}"/>`;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=S.t(mx+(mx-cx)*0.32,my+(my-cy)*0.32+4,'380 v','b')}
    P.forEach((p,i)=>{const ox=Math.cos(ang[i])*18,oy=Math.sin(ang[i])*18;s+=S.w(`M${p[0]} ${p[1]}L${p[0]+ox} ${p[1]+oy}`,active?'live':'')+S.dot(p[0],p[1])+S.t(p[0]+ox*1.9,p[1]+oy*1.9+4,lbl[i])});
  } else {const R=62,P=ang.map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
    P.forEach((p,i)=>{s+=`<path class="${mode==='star'?'w flow':'w'}" d="${coilPath(cx,cy,p[0],p[1],4)}"/>`;const ox=Math.cos(ang[i])*16,oy=Math.sin(ang[i])*16;
      s+=S.w(`M${p[0]} ${p[1]}L${p[0]+ox} ${p[1]+oy}`,active?'live':'')+S.dot(p[0],p[1])+S.t(p[0]+ox*2,p[1]+oy*2+4,lbl[i]);
      const nx=-Math.sin(ang[i])*20,ny=Math.cos(ang[i])*20,mx=cx+(p[0]-cx)*0.55,my=cy+(p[1]-cy)*0.55;if(mode==='star')s+=S.t(mx+nx,my+ny+4,'220 v','b')});
    s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="${mode==='star'?'var(--live)':'var(--wire)'}"/>`;if(mode==='star')s+=S.t(cx,cy+52,'U2 V2 W2','m');}
  return s+'</svg>';
}
B.U2={windSVG,coilPath};

// Power circuit of الشكل (4-2): K1 main (via F4) -> U1 V1 W1 ; K2 delta: L1->W2, L2->U2, L3->V2 ; K3 shorts U2 V2 W2
function powerStarDelta(K1,K2,K3){
  const run=K1&&(K2||K3);
  const sup=S.cls(1,run),k1o=S.cls(K1,K1&&run),k2t=S.cls(1,K1&&K2),k2o=S.cls(K2,K1&&K2);
  const rn=S.cls(K2||(K1&&K3),run&&(K2||K3)),k3t=S.cls(K3&&(K1||K2),K1&&K3),k3b=K3?rn:(K2?'live':'');
  const cols=[70,95,120],bus=[24,40,56],k2c=[230,255,280],k3c=[340,365,390];
  let s=`<svg viewBox="0 0 440 400" role="img" aria-label="الدائرة الرئيسة نجمة دلتا">`;
  bus.forEach((y,i)=>{s+=S.w(`M40 ${y}H425`,sup)+S.t(26,y+4,'L'+(i+1))});
  cols.forEach((x,i)=>{s+=S.w(`M${x} ${bus[i]}V72`,sup)+S.dot(x,bus[i])+S.fuse(x,72,sup)+S.w(`M${x} 96V150`,sup);
    const ty=112+i*10;s+=S.dot(x,ty)+S.w(`M${x} ${ty}H${k2c[i]}V150`,k2t)+S.dot(k2c[i],ty)});
  s+=S.t(140,89,'F1..3','m','start');
  cols.forEach(x=>{s+=S.vC(x,150,182,{closed:K1,inC:sup,outC:k1o})});s+=S.mech(58,128,166)+S.t(52,170,'K1','','end');
  k2c.forEach(x=>{s+=S.vC(x,150,182,{closed:K2,inC:k2t,outC:k2o})});s+=S.mech(218,288,166)+S.t(298,170,'K2','','start');
  s+=S.w('M340 140H390',k3t);k3c.forEach(x=>{s+=S.w(`M${x} 140V150`,k3t)+S.vC(x,150,182,{closed:K3,inC:k3t,outC:k3b})});
  s+=S.mech(328,398,166)+S.t(404,170,'K3','','start');
  cols.forEach(x=>{s+=S.w(`M${x} 182V197`,k1o)+S.thermal(x,205,k1o)});s+=S.t(52,222,'F4','','end');
  s+=S.w('M120 237V300H147',k1o)+S.w('M95 237V320H141',k1o)+S.w('M70 237V340H147',k1o);
  s+=S.motor(175,320,34,run);
  s+=S.t(152,294,'W1','m','end')+S.t(136,314,'V1','m','end')+S.t(152,356,'U1','m','end')+S.t(198,294,'V2','m','start')+S.t(214,314,'U2','m','start')+S.t(198,356,'W2','m','start');
  s+=S.w('M280 182V300',k2o)+S.w('M255 182V320',k2o)+S.w('M230 182V340',k2o);
  s+=S.w('M203 300H340',rn)+S.w('M209 320H365',rn)+S.w('M203 340H390',rn)+S.dot(280,300)+S.dot(255,320)+S.dot(230,340);
  s+=S.w('M340 182V300',k3b)+S.w('M365 182V320',k3b)+S.w('M390 182V340',k3b)+S.dot(340,300)+S.dot(365,320)+S.dot(390,340);
  return s+'</svg>';
}
B.U2.powerStarDelta=powerStarDelta;

// motor model used by star/delta lessons
const Istar=n=>6+14*Math.pow(clamp((1400-n)/1400,0,1),.6), Idelta=n=>10+50*Math.pow(clamp((1460-n)/1460,0,1),.6);
B.U2.Istar=Istar;B.U2.Idelta=Idelta;
function starDeltaPlant(get){ // get(st)->{K1,K2,K3,dir}
  const p=B.motorPlant(st=>{const k=get(st),dir=k.dir||1;const star=k.K1&&k.K3&&!k.K2,delta=k.K1&&k.K2&&!k.K3;
    if(star)return {target:1400*dir,tau:1.6,I:n=>Istar(Math.abs(n)),label:'نجمة Y',mode:'star'};
    if(delta)return {target:1460*dir,tau:.7,I:n=>Idelta(Math.abs(n)),label:'دلتا Δ',mode:'delta'};
    return null},{refs:[{v:60,color:'--stop'},{v:10,color:'--muted'}]});
  p.chart.legend='<span><i style="background:var(--blue)"></i>التيار الفعلي</span><span><i style="background:var(--stop)"></i>لو بدأ دلتا مباشرة (≈ 60 A)</span><span><i style="background:var(--muted)"></i>التيار المقنن 10 A</span>';
  p.render=(el,st,pl)=>{const k=get(st);const m=k.K1&&k.K3&&!k.K2?'star':k.K1&&k.K2&&!k.K3?'delta':'off';
    el.innerHTML=`<div class="svgbox" style="margin-top:0;max-width:240px">${windSVG(m)}</div><p class="sub">${m==='star'?'كل ملف عليه <b>220 v</b>: تيار وعزم منخفضان.':m==='delta'?'كل ملف عليه <b>380 v</b>: قدرة كاملة.':'الملفات غير متصلة بالشبكة.'}</p>`};
  p.sig=pl=>pl.mode;
  p.label=pl=>pl.label;
  return p;
}
B.U2.starDeltaPlant=starDeltaPlant;

const IO_SD=[
 {sym:'F4',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I0.0'},
 {sym:'S0',desc:'ضاغط الفصل',addr:'I0.1'},
 {sym:'S1',desc:'ضاغط التشغيل لمحرك النجمة',addr:'I1.1'},
 {sym:'S2',desc:'ضاغط فصل تشغيل المحرك الدلتا',addr:'I1.2'},
 {sym:'K1',desc:'ملف المتمم ( K1 ) التشغيل الرئيسي',addr:'Q4.1'},
 {sym:'K2',desc:'ملف المتمم ( K2 ) التشغيل الدلتا',addr:'Q4.2'},
 {sym:'K3',desc:'ملف المتمم ( K3 ) التشغيل قصر النجمة',addr:'Q4.3'}
];
const IN_SD=[
 {id:'S0',addr:'I0.1',type:'push',color:'red',label:'إيقاف'},
 {id:'S1',addr:'I1.1',type:'push',color:'green',label:'تشغيل نجمة'},
 {id:'S2',addr:'I1.2',type:'push',color:'black',label:'تحويل دلتا'},
 {id:'F4',addr:'I0.0',type:'fault',label:'فصل F4 (حمل زائد)',resetLabel:'إعادة ضبط F4'}
];
const CTRL_SD={top:[{l:'F4',nc:1},{l:'S0',nc:1,btn:1}],branches:[
 {items:[{par:[[{l:'S1',btn:1}],[{l:'K3'}]]},{l:'K2',nc:1},{l:'S2',nc:1,btn:1}],coil:{l:'K3'}},
 {items:[{par:[[{l:'S2',btn:1}],[{l:'K2'}]]},{l:'K3',nc:1},{l:'K1'}],coil:{l:'K2'}},
 {items:[{par:[[{l:'K2'}],[{l:'K3'}]]}],coil:{l:'K1'}}]};
const MAP_SD={F4:'btn:F4',S0:'btn:S0',S1:'btn:S1',S2:'btn:S2',K1:'Q4.1',K2:'Q4.2',K3:'Q4.3'};
B.U2.IO_SD=IO_SD;B.U2.IN_SD=IN_SD;B.U2.CTRL_SD=CTRL_SD;B.U2.MAP_SD=MAP_SD;

/* =================== Lesson 2.1 =================== */
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'33–41',
 title:'تشغيل المحرك الثلاثي الأوجه نجمة / دلتا',
 summary:'الدائرة الرئيسة ودائرة التحكم لبدء حركة المحرك نجمة ثم التحويل إلى دلتا بالضاغط S2، ثم تحويل دائرة التحكم إلى LAD و FBD و STL.',
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 33',html:`<p><b>الجدارة:</b> استخدام الحاسب الآلي في كتابة برنامج للتحكم في تشغيل محرك النجمة / الدلتا مع عكس الحركة.</p>
   <p><b>الأهداف كما في الكتاب:</b></p><ol><li>الهدف من تشغيل المحرك النجمة / الدلتا.</li><li>بناء الدائرة الرئيسة ودائرة التحكم لتشغيل المحرك الثلاثي الأوجه النجمة / الدلتا.</li><li>تحويل دائرة التحكم من مخطط مسار التيار إلى دائرة (PLC) بالطرق الثلاث: المخطط السلّمي (LAD)، البوابات المنطقية (FBD)، قائمة الإجراءات (STL).</li></ol>
   <p><b>الوقت المتوقع:</b> 4 ساعات. <b>متطلبات الجدارة:</b> اجتياز آلات التيار المتردد، وورشة التحكم بالمحركات ثلاثية الأوجه.</p>`},
  {h:'لماذا نبدأ بالنجمة؟',html:`<p>المحرك الحثي لحظة تشغيله يسحب تياراً يصل إلى نحو <b>ستة أضعاف</b> تياره العادي. لذلك من طرق بدء الحركة أن نشغّل المحرك أولاً بتوصيلة <b>النجمة</b> ثم نحوّله إلى <b>الدلتا</b> بعد ما يدور.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في النجمة كل ملف يأخذ <span class="ltr">380 ÷ √3 ≈ 220 v</span> بدل <span class="ltr">380 v</span>، فيقل تيار البدء والعزم إلى الثلث تقريباً. بدّل بين التوصيلتين في الرسم التالي.'},
  {widget:(el)=>{let m='star';const draw=()=>{el.innerHTML=`<div class="fig"><div class="seg" role="group"><button data-m="star" aria-pressed="${m==='star'}">نجمة Y</button><button data-m="delta" aria-pressed="${m==='delta'}">دلتا Δ</button></div>
     <div class="svgbox" style="max-width:300px;margin-inline:auto">${windSVG(m)}</div>
     <div class="facts"><div class="fact"><span>الجهد على كل ملف</span><b>${m==='star'?'220 v':'380 v'}</b></div><div class="fact"><span>تيار البدء</span><b>${m==='star'?'≈ 20 A':'≈ 60 A'}</b></div><div class="fact"><span>عزم البدء</span><b>${m==='star'?'⅓':'كامل'}</b></div></div>
     <p class="sub">${m==='star'?'أطراف النهاية U2 و V2 و W2 مربوطة معاً (نقطة النجمة)، والشبكة تدخل على U1 و V1 و W1.':'كل ملف بين خطين: U1 مع W2، و V1 مع U2، و W1 مع V2.'}</p></div>`;
     el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw()}},
  {h:'1- الدائرة الرئيسة لتشغيل المحرك النجمة ثم الدلتا',ref:'ص 36',html:`<p>«من الفصل الأول نجد أنه من طرق بدء الحركة للمحركات تشغيل المحرك النجمة ثم يتحول إلى الدلتا. والشكل (4-2) يوضح الدائرة الرئيسة لتشغيل المحرك الحثي الثلاثي الأوجه النجمة ثم الدلتا.»</p>
    <ul><li><b>K1</b> (الرئيسي): يوصل L1 و L2 و L3 عبر القاطع الحراري F4 إلى U1 و V1 و W1.</li><li><b>K3</b> (قصر النجمة): يقصر الأطراف U2 و V2 و W2 معاً. K1 + K3 = <b>نجمة</b>.</li><li><b>K2</b> (الدلتا): يوصل L1 إلى W2، و L2 إلى U2، و L3 إلى V2. K1 + K2 = <b>دلتا</b>.</li></ul>`},
  {fig:'(4-2)',ref:'ص 36',caption:'يبين الدائرة الرئيسة لتشغيل المحرك النجمة / الدلتا',draw:'power'},
  {h:'2- دائرة التحكم لتشغيل المحرك النجمة ثم الدلتا',ref:'ص 37',html:`<p>الشكل (5-2) يوضح دائرة التحكم. في أعلاها تلامس القاطع الحراري F4 المغلق ثم ضاغط الفصل S0 المغلق، ومنهما تتفرع ثلاثة فروع:</p>
    <ul><li><b>فرع K3:</b> [S1 مفتوح ∥ K3 مفتوح] ثم K2 مغلق ثم S2 مغلق.</li><li><b>فرع K2:</b> [S2 مفتوح ∥ K2 مفتوح] ثم K3 مغلق ثم K1 مفتوح.</li><li><b>فرع K1:</b> [K2 مفتوح ∥ K3 مفتوح].</li></ul>
    <p>التلامس الموازي لكل ضاغط هو <b>التعويض الذاتي</b> (يبقي الملف متغذياً بعد رفع الإصبع)، والتلامس المغلق من المتمم الآخر هو <b>التعشيق</b> (يمنع K2 و K3 من العمل معاً).</p>`},
  {fig:'(5-2)',ref:'ص 37',caption:'يبين دائرة التحكم لتشغيل المحرك النجمة / الدلتا',draw:'ctrl'},
  {h:'جدول نقاط الدخل والخرج',ref:'ص 38',html:'<p>من الشكل (5-2) نجد أن:</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج والترميز في الـ PLC',ref:'ص 38'},
  {h:'3- تحويل دائرة التحكم إلى دائرة LAD باستخدام PLC',ref:'ص 39'},
  {draw:'lad',caption:'Network 1–3 بلغة LAD',ref:'ص 39'},
  {h:'4- تحويل دائرة التحكم إلى دائرة FBD باستخدام PLC',ref:'ص 40'},
  {draw:'fbd',caption:'Network 1–3 بلغة FBD',ref:'ص 40'},
  {h:'5- تحويل دائرة التحكم إلى دائرة STL باستخدام PLC',ref:'ص 41'},
  {draw:'stl',caption:'Network 1–3 بلغة STL',ref:'ص 41'},
  {note:'في الكتاب وُصّل S0 و F4 بحيث تصل للـ PLC إشارة 1 عند الضغط أو الفصل، لذلك كُتبا في البرنامج كتلامس مغلق (AN). في المصانع يُفضَّل توصيل الفصل بتلامس مغلق فتُعكس البرمجة.'}
 ],
 io:IO_SD, inputs:IN_SD,
 program:[
  {title:'Network 1 — K3 (قصر النجمة)',ref:'ص 39–41',read:'K3 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (S1 مضغوط <b>أو</b> K3 شغال أصلاً) <b>و</b> K2 مفصول <b>و</b> S2 غير مضغوط.',
   stl:['AN I 0.0','AN I 0.1','A(','O I 1.1','O Q 4.3',')','AN Q 4.2','AN I 1.2','= Q 4.3']},
  {title:'Network 2 — K2 (الدلتا)',ref:'ص 39–41',read:'K2 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (S2 مضغوط <b>أو</b> K2 شغال) <b>و</b> K3 مفصول <b>و</b> K1 شغال.',
   stl:['AN I 0.0','AN I 0.1','A(','O I 1.2','O Q 4.2',')','AN Q 4.3','A Q 4.1','= Q 4.2']},
  {title:'Network 3 — K1 (الرئيسي)',ref:'ص 39–41',read:'K1 يعمل إذا: F4 سليم <b>و</b> S0 غير مضغوط <b>و</b> (K2 <b>أو</b> K3 شغال).',
   stl:['AN I 0.0','AN I 0.1','A(','O Q 4.2','O Q 4.3',')','= Q 4.1']}
 ],
 power:(st)=>powerStarDelta(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3')),powerRef:'الشكل (4-2) ص 36',
 ctrl:CTRL_SD,ctrlMap:MAP_SD,ctrlRef:'الشكل (5-2) ص 37',
 plant:starDeltaPlant(st=>({K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),K3:st.Q('Q4.3')})),
 plcNote:'في الكتاب وُصّل S0 و F4 بحيث تصل إشارة 1 عند الضغط أو الفصل، لذلك برمجا كتلامس مغلق (AN).',
 steps:[
  {t:'الوضع الابتدائي',x:'المحرك متوقف وكل المتممات مفصولة. لاحظ في الدائرة الرئيسة أن الجهد واصل حتى مداخل K1 و K2 فقط.'},
  {t:'ابدأ بالنجمة',x:'اضغط S1. يعمل K3 فيربط U2 و V2 و W2 معاً، ثم يعمل K1 فيصل الجهد إلى U1 و V1 و W1.',done:s=>s.Q('Q4.1')&&s.Q('Q4.3')},
  {t:'راقب التيار والسرعة',x:'تيار البدء نحو 20 A بدل 60 A. ارفع إصبعك عن S1: يبقى K3 شغالاً بسبب التعويض الذاتي. انتظر حتى تتجاوز السرعة 1300 rpm.',done:s=>s.Q('Q4.3')&&s.plant.n>1300},
  {t:'انقل إلى الدلتا',x:'اضغط S2. تلامسه المغلق يقطع K3، وتلامسه المفتوح يشغّل K2.',done:s=>s.Q('Q4.2')},
  {t:'التشغيل الكامل',x:'كل ملف الآن على 380 v. لاحظ أن قفزة التيار عند التحويل صغيرة لأن المحرك كان دائراً.'},
  {t:'أوقف المحرك',x:'اضغط S0 فتفصل كل المتممات.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.Q('Q4.3')&&!s.btn('S0')},
  {t:'جرّب الخطأ',x:'والمحرك متوقف اضغط S2 مباشرة. لن يحدث شيء: فرع K2 يحتاج تلامس K1 (وفي البرنامج A Q 4.1).'},
  {t:'الحماية الحرارية',x:'شغّل المحرك ثم اضغط «فصل F4». يتوقف كل شيء ولا يعود إلا بإعادة الضبط ثم S1.',done:s=>s.btn('F4')}
 ],
 quiz:[
  {q:'لماذا نبدأ تشغيل المحرك بتوصيلة النجمة؟',o:['لزيادة سرعة المحرك','لتقليل تيار البدء','لعكس اتجاه الدوران','لزيادة عزم البدء'],c:1,e:'في النجمة يقل الجهد على كل ملف فيقل تيار البدء إلى الثلث تقريباً.'},
  {q:'شبكة جهدها 380 v. كم الجهد على كل ملف في النجمة؟',o:['380 v','660 v','220 v','127 v'],c:2,e:'380 ÷ √3 ≈ 220 v.'},
  {q:'أي متمم يقصر الأطراف U2 و V2 و W2 ليصنع نقطة النجمة؟',o:['K1','K2','K3','F4'],c:2,e:'K3 متمم قصر النجمة، وعنوانه Q4.3 (جدول ص 38).'},
  {q:'ضغطت S2 والمحرك متوقف. ماذا يحدث؟',o:['يبدأ دلتا مباشرة','لا شيء، لأن K2 يشترط K1','يعمل K3 فقط','يفصل F4'],c:1,e:'في Network 2 السطر A Q 4.1، و K1 لا يعمل إلا مع K2 أو K3.'},
  {q:'ما فائدة التلامس المغلق Q4.2 في Network 1؟',o:['يسرّع التحويل','يمنع عمل K3 أثناء عمل K2 (التعشيق)','يشغّل K1','يحمي من الحمل الزائد'],c:1,e:'K2 و K3 لا يعملان معاً أبداً، وإلا صار قصر بين الأوجه.'},
  {q:'لماذا وُضع Q4.3 بالتوازي مع I1.1 في Network 1؟',o:['للتعويض الذاتي','لفصل المحرك','لعكس الحركة','للتحويل للدلتا'],c:0,e:'المخرج يغذّي نفسه عبر التلامس الموازي فيبقى بعد ترك الضاغط.'},
  {q:'ماذا يعني الأمر AN I 0.0 في STL؟',o:['أو مع I0.0','و مع عكس I0.0','اكتب في I0.0','امسح I0.0'],c:1,e:'A = AND و N = NOT: يتحقق الشرط عندما يكون I0.0 = 0.'},
  {q:'ما عنوان الضاغط S1 حسب جدول ص 38؟',o:['I0.1','I1.2','Q4.1','I1.1'],c:3,e:'S1 = I1.1، و S2 = I1.2، و S0 = I0.1، و F4 = I0.0.'}
 ]
});
/* =====================================================================
   Helpers for lessons 2.2 – 2.4 (S/R boxes, static book figures, reversing circuit)
   ===================================================================== */
// LAD / FBD drawing of one S-R (or R-S) box network as printed in the book.
// o:{addr, type:'SR'|'RS', S:[addr..] (parallel), R:[addr..] (parallel), fbd, P (live plc or null), names}
function srBox(o){
  const P=o.P,g=a=>P?P.get(a):0,names=o.names||{},fbd=!!o.fbd,typ=o.type||'SR',C=v=>v?'live':'';
  const A=typ==='SR'?[['S',o.S],['R',o.R]]:[['R',o.R],['S',o.S]];
  const RH=58,bx=240,bw=88;let y=46;
  const pins=A.map(([pin,list])=>{const r={pin,list,y};y+=Math.max(1,list.length)*RH+20;return r});
  const boxTop=pins[0].y-26,boxBot=pins[1].y+24;
  const H=Math.max(pins[1].y+(pins[1].list.length-1)*RH+30,boxBot+16);
  let s='';
  if(!fbd)s+=`<path class="w live" d="M16 10V${H-6}"/>`;
  pins.forEach(pn=>{const vals=pn.list.map(g);const any=vals.some(v=>v)?1:0;pn.any=any;const y0=pn.y;
    if(!fbd){const cx=104;
      pn.list.forEach((a,i)=>{const yy=y0+i*RH,v=vals[i];
        s+=S.w(`M16 ${yy}H${cx-7}`,'live')+S.w(`M${cx+7} ${yy}H170`,C(v));
        if(v)s+=`<rect class="cpass" x="${cx-7}" y="${yy-11}" width="14" height="22"/>`;
        s+=`<path class="sym" d="M${cx-7} ${yy-11}V${yy+11}M${cx+7} ${yy-11}V${yy+11}"/>`;
        s+=`<text class="lad-txt" x="${cx}" y="${yy-16}" text-anchor="middle">${a}</text>`;
        const nm=names[a]||'';s+=`<text class="lad-val" x="${cx}" y="${yy+24}" text-anchor="middle" fill="${P&&v?'var(--on)':'var(--muted)'}">${nm}${P?(nm?'=':'')+v:''}</text>`;
        if(i>0){const below=vals.slice(i).some(x=>x);s+=S.w(`M170 ${yy}V${yy-RH}`,C(below))}});
      s+=S.w(`M170 ${y0}H${bx}`,C(any));
    } else {
      if(pn.list.length===1){const a=pn.list[0],v=vals[0],nm=names[a]||'';
        s+=`<text class="lad-txt" x="${bx-44}" y="${y0+4}" text-anchor="end">${a}</text><text class="lad-val" x="${bx-44}" y="${y0+16}" text-anchor="end" fill="${P&&v?'var(--on)':'var(--muted)'}">${nm}${P?(nm?'=':'')+v:''}</text>`+S.w(`M${bx-40} ${y0}H${bx}`,C(v));
      } else {const ox=130,ow=46,top=y0-16,bh=(pn.list.length-1)*RH+32;
        pn.list.forEach((a,i)=>{const yy=y0+i*RH,v=vals[i],nm=names[a]||'';
          s+=`<text class="lad-txt" x="${ox-26}" y="${yy+4}" text-anchor="end">${a}</text><text class="lad-val" x="${ox-26}" y="${yy+16}" text-anchor="end" fill="${P&&v?'var(--on)':'var(--muted)'}">${nm}${P?(nm?'=':'')+v:''}</text>`+S.w(`M${ox-22} ${yy}H${ox}`,C(v))});
        s+=`<rect class="fbox" x="${ox}" y="${top}" width="${ow}" height="${bh}" rx="3"/><text class="lad-txt" x="${ox+ow/2}" y="${top+bh/2+4}" text-anchor="middle">&gt;=1</text>`+S.w(`M${ox+ow} ${y0}H${bx}`,C(any));}
    }
    s+=`<text class="lad-txt" x="${bx+8}" y="${y0+4}" text-anchor="start">${pn.pin}</text>`;
  });
  const q=g(o.addr),qy=pins[0].y,nm=names[o.addr]||'';
  s+=`<rect class="fbox" x="${bx}" y="${boxTop}" width="${bw}" height="${boxBot-boxTop}" rx="3"/>`;
  s+=`<text class="lad-txt" x="${bx+bw/2}" y="${boxTop-7}" text-anchor="middle">${o.addr}</text>`;
  s+=`<text class="lad-txt" x="${bx+bw/2}" y="${(pins[0].y+pins[1].y)/2+4}" text-anchor="middle" font-size="14">${typ}</text>`;
  s+=`<text class="lad-txt" x="${bx+bw-8}" y="${qy+4}" text-anchor="end">Q</text>`;
  s+=`<rect x="${bx}" y="${boxTop}" width="${bw}" height="${boxBot-boxTop}" rx="3" fill="none" stroke="${P&&q?'var(--on)':'none'}" stroke-width="2.4"/>`;
  if(!fbd){const cX=420;s+=S.w(`M${bx+bw} ${qy}H${cX-14}`,C(q));
    s+=`<path class="sym ${q?'hot':''}" d="M${cX-6} ${qy-11}Q${cX-14} ${qy} ${cX-6} ${qy+11}M${cX+6} ${qy-11}Q${cX+14} ${qy} ${cX+6} ${qy+11}"/>`;
    if(P&&q)s+=`<circle cx="${cX}" cy="${qy}" r="5" fill="var(--on)"/>`;
    s+=`<text class="lad-txt" x="${cX}" y="${qy-17}" text-anchor="middle">${o.addr}</text>`;
    s+=`<text class="lad-val" x="${cX+18}" y="${qy+4}" fill="${P&&q?'var(--on)':'var(--muted)'}">${nm}${P?(nm?'=':'')+q:''}</text>`;
  } else {const ex=400;s+=S.w(`M${bx+bw} ${qy}H${ex}`,C(q))+`<rect class="fbox" x="${ex}" y="${qy-11}" width="54" height="22" rx="3"/><text class="lad-txt" x="${ex+27}" y="${qy+4}" text-anchor="middle">=</text><text class="lad-txt" x="${ex+27}" y="${qy-16}" text-anchor="middle">${o.addr}</text>`;
    s+=`<text class="lad-val" x="${ex+60}" y="${qy+4}" fill="${P&&q?'var(--on)':'var(--muted)'}">${nm}${P?(nm?'=':'')+q:''}</text>`}
  return `<svg viewBox="0 0 520 ${H}" role="img" aria-label="دالة الإلغاء والإبقاء ${typ}">${s}</svg>`;
}
B.U2.srBox=srBox;
// a list of SR networks as book figures (static or live)
function srNets(list,o){o=o||{};return list.map(n=>`<div class="net static"><header><h3>${n.title}</h3></header><div class="svgbox fixed">${srBox(Object.assign({},n,{fbd:o.fbd,P:o.P||null,names:o.names}))}</div></div>`).join('')}
B.U2.srNets=srNets;
// static rendering of any STL program (always the given one, independent of the selected variant)
function staticNets(prog,view,names){const P=B.createPLC(prog);
  return P.nets.map(n=>`<div class="net static"><header><h3>${n.title||('Network '+(n.i+1))}</h3>${n.ref?`<span class="ref">${n.ref}</span>`:''}</header>${view==='stl'?B.stlTable(n,{trace:[]}):`<div class="svgbox fixed">${(view==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,names)}</div>`}</div>`).join('')}
B.U2.staticNets=staticNets;
// which S / R instructions are active in the last scan (from the RLO trace)
function srStatus(P){const out={};P.nets.forEach((n,ni)=>{const tr=P.trace[ni]||[];n.toks.forEach((t,j)=>{if(t.kind==='act'&&(t.op==='S'||t.op==='R')){const o=out[t.addr]||(out[t.addr]={s:0,r:0});if(t.op==='S')o.s=tr[j]?1:0;else o.r=tr[j]?1:0}})});return out}
B.U2.srStatus=srStatus;
const bit=v=>`<span class="bit ${v?'one':''}">${v?1:0}</span>`;

/* ---------- reversing star/delta: power circuit of الشكل (6-3) ---------- */
// K1: L1->U, L2->V, L3->W ; K2: L3->U, L2->V, L1->W (nodes before F4) ; K3: star short of V2 U2 W2 ;
// k4 (delta) from nodes U,V,W : book -> V2, U2, W2 (W winding shorted) ; corrected -> W2, U2, V2
function powerRev(K1,K2,K3,K4,book){
  const nodeLive=K1||K2,run=nodeLive&&(K3||K4),shortW=book&&K4&&nodeLive;
  const sup=S.cls(1,run),k2t=S.cls(1,K2&&run),k1t=S.cls(1,K1&&run);
  const k1o=S.cls(nodeLive,K1&&run),k2o=S.cls(nodeLive,K2&&run),nd=S.cls(nodeLive,run);
  const k4t=S.cls(nodeLive,K4&&run),k4o=S.cls(K4&&nodeLive,K4&&run),rn=S.cls(nodeLive,run),k3t=S.cls(K3&&nodeLive,K3&&run);
  const L=[70,95,120],bus=[24,40,56],tapY=[104,114,124],k2c=[230,205,180],nodeY=[198,208,218],k4y=[228,234,240],k4c=[340,315,290],k3c=[370,395,420];
  const lineY={V2:330,U2:350,W2:370};
  let s=`<svg viewBox="0 0 470 442" role="img" aria-label="الدائرة الرئيسة نجمة دلتا مع عكس الحركة">`;
  bus.forEach((y,i)=>{s+=S.w(`M40 ${y}H455`,sup)+S.t(26,y+4,'L'+(i+1))});
  L.forEach((x,i)=>{s+=S.w(`M${x} ${bus[i]}V66`,sup)+S.dot(x,bus[i])+S.fuse(x,66,sup)+S.w(`M${x} 90V${tapY[i]}`,sup)+S.w(`M${x} ${tapY[i]}V150`,k1t);
    s+=S.dot(x,tapY[i])+S.w(`M${x} ${tapY[i]}H${k2c[i]}V150`,k2t)+S.dot(k2c[i],tapY[i])});
  s+=S.t(132,84,'F1..3','m','start');
  // K1 and K2 contacts
  L.forEach(x=>{s+=S.vC(x,150,182,{closed:K1,inC:k1t,outC:k1o})});s+=S.mech(58,128,166)+S.t(52,170,'K1','','end');
  k2c.forEach(x=>{s+=S.vC(x,150,182,{closed:K2,inC:k2t,outC:k2o})});s+=S.mech(168,238,166)+S.t(246,170,'K2','','start');
  // outputs to the nodes U (x70) V (x95) W (x120): K2 col 180 (L3)->U, 205 (L2)->V, 230 (L1)->W
  L.forEach((x,i)=>{s+=S.w(`M${x} 182V${nodeY[i]}`,k1o)});
  [[180,0],[205,1],[230,2]].forEach(([c,i])=>{s+=S.w(`M${c} 182V${nodeY[i]}H${L[i]}`,k2o)+S.dot(L[i],nodeY[i])});
  // nodes -> k4 taps, F4, motor
  L.forEach((x,i)=>{s+=S.w(`M${x} ${nodeY[i]}V254`,nd)+S.dot(x,k4y[i])+S.w(`M${x} ${k4y[i]}H${k4c[i]}V252`,k4t)+S.dot(k4c[i],k4y[i])});
  L.forEach(x=>{s+=S.thermal(x,262,nd)});s+=S.t(52,280,'F4','','end');
  s+=S.w('M120 294V330H148',nd)+S.w('M95 294V350H141',nd)+S.w('M70 294V370H148',nd);
  s+=S.motor(175,350,34,run);
  s+=S.t(150,324,'W1','m','end')+S.t(138,344,'V1','m','end')+S.t(150,386,'U1','m','end')+S.t(200,324,'V2','m','start')+S.t(214,344,'U2','m','start')+S.t(200,386,'W2','m','start');
  // k4 contacts
  k4c.forEach(x=>{s+=S.vC(x,252,284,{closed:K4,inC:k4t,outC:k4o})});s+=S.mech(278,348,268)+S.t(282,300,book?'k4':'K4','','end');
  // K3 contacts, top terminals shorted together
  s+=S.w('M370 242H420',k3t);k3c.forEach(x=>{s+=S.w(`M${x} 242V252`,k3t)+S.vC(x,252,284,{closed:K3,inC:k3t,outC:K3?rn:(K4&&nodeLive?'live':'')})});
  s+=S.mech(358,428,268)+S.t(436,272,'K3','','start');
  // lines V2 U2 W2 to the right
  s+=S.w(`M202 ${lineY.V2}H420`,rn)+S.w(`M209 ${lineY.U2}H420`,rn)+S.w(`M202 ${lineY.W2}H420`,rn);
  const k3to=['V2','U2','W2'];k3c.forEach((x,i)=>{const y=lineY[k3to[i]];s+=S.w(`M${x} 284V${y}`,K3?rn:(K4&&nodeLive?'live':''))+S.dot(x,y)});
  // k4 outputs: U-node pole (x340), V-node pole (x315), W-node pole (x290)
  const to=book?{340:'V2',315:'U2',290:'W2'}:{340:'W2',315:'U2',290:'V2'};
  k4c.forEach(x=>{const y=lineY[to[x]];s+=S.w(`M${x} 284V${y}`,k4o)+S.dot(x,y)});
  if(book){s+=`<circle cx="290" cy="${lineY.W2}" r="9" fill="none" stroke="var(--stop)" stroke-width="2.2"/>`;}
  if(shortW){s+=`<rect x="130" y="306" width="96" height="92" rx="10" fill="none" stroke="var(--stop)" stroke-width="2.4" stroke-dasharray="6 4"/>`+
    `<text class="txt ar" x="235" y="434" text-anchor="middle" style="fill:var(--stop)">قصر: W1 و W2 على الخط نفسه</text>`}
  if(run){const fw=K1&&!K2;s+=`<text class="txt ar" x="175" y="414" text-anchor="middle" style="fill:var(--blue-ink)">${fw?'الاتجاه الأول ⟳ (K1)':'الاتجاه المعاكس ⟲ (K2)'}</text>`}
  return s+'</svg>';
}
B.U2.powerRev=powerRev;

// winding diagram for the reversing lesson. mode: off|star|delta|bad|open ; dir: 1 (K1) / -1 (K2)
function windRevSVG(mode,dir){
  const W=230,H=220,cx=115,cy=118,ang=[-90,150,30].map(a=>a*Math.PI/180);
  const lbl=dir<0?['L3','L2','L1']:['L1','L2','L3'];const act=mode!=='off'&&mode!=='open';
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="توصيل ملفات المحرك">`;
  const R=64,P=ang.map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
  const lead=(p,i,live)=>{const ox=Math.cos(ang[i])*18,oy=Math.sin(ang[i])*18;return S.w(`M${p[0]} ${p[1]}L${p[0]+ox} ${p[1]+oy}`,live?'live':'')+S.dot(p[0],p[1])+S.t(p[0]+ox*1.9,p[1]+oy*1.9+4,mode==='off'?['U','V','W'][i]+'1':lbl[i])};
  if(mode==='delta'){for(let i=0;i<3;i++){const a=P[i],b=P[(i+1)%3];s+=`<path class="w flow" d="${coilPath(a[0],a[1],b[0],b[1],4)}"/>`;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=S.t(mx+(mx-cx)*0.34,my+(my-cy)*0.34+4,['U','V','W'][i],'b')}
    P.forEach((p,i)=>{s+=lead(p,i,1)})}
  else if(mode==='bad'){ // U: node0->node1, V: node1->node0 (parallel), W: node2->node2 (shorted)
    const a=P[0],b=P[1];s+=`<path class="w flow" d="${coilPath(a[0],a[1],b[0],b[1],4)}"/>`+S.t((a[0]+b[0])/2-16,(a[1]+b[1])/2,'U','b');
    const nx=(b[1]-a[1]),ny=-(b[0]-a[0]),nl=Math.hypot(nx,ny),ox=nx/nl*20,oy=ny/nl*20;
    s+=S.w(`M${a[0]} ${a[1]}L${a[0]+ox} ${a[1]+oy}`,'flow')+S.w(`M${b[0]} ${b[1]}L${b[0]+ox} ${b[1]+oy}`,'flow')+`<path class="w flow" d="${coilPath(b[0]+ox,b[1]+oy,a[0]+ox,a[1]+oy,4)}"/>`+S.t((a[0]+b[0])/2+ox+14,(a[1]+b[1])/2+oy+4,'V','b');
    const c=P[2],wx=c[0]-10,wy=c[1]+44;s+=`<path d="${coilPath(c[0],c[1],wx,wy,3)}" fill="none" stroke="var(--stop)" stroke-width="2.6"/><path d="M${wx} ${wy}Q${c[0]+26} ${wy+6} ${c[0]} ${c[1]}" fill="none" stroke="var(--stop)" stroke-width="2.6"/>`+S.t(c[0]+30,c[1]+52,'W1=W2','',"start");
    P.forEach((p,i)=>{s+=lead(p,i,1)});
    s+=`<text class="txt ar" x="${cx}" y="${H-4}" text-anchor="middle" style="fill:var(--stop)">الملف W مقصور، و U و V على خطين فقط</text>`}
  else {const Rs=62,Q=ang.map(a=>[cx+Rs*Math.cos(a),cy+Rs*Math.sin(a)]);
    Q.forEach((p,i)=>{s+=`<path class="${mode==='star'?'w flow':'w'}" d="${coilPath(cx,cy,p[0],p[1],4)}"/>`+lead(p,i,mode!=='off')});
    if(mode!=='open')s+=`<circle cx="${cx}" cy="${cy}" r="5" fill="${mode==='star'?'var(--live)':'var(--wire)'}"/>`;
    else s+=`<text class="txt ar" x="${cx}" y="${H-4}" text-anchor="middle" style="fill:var(--live)">أطراف النهاية U2 V2 W2 مفتوحة</text>`;
    if(mode==='star')s+=S.t(cx,cy+52,'U2 V2 W2','m')}
  return s+'</svg>';
}
B.U2.windRevSVG=windRevSVG;

/* =================== Lesson 2.2 — S/R =================== */
const IO_SR=[
 {sym:'S',desc:'طرف التشغيل (Set) — ضاغط لحظي',addr:'I0.1'},
 {sym:'R',desc:'طرف الفصل (Reset) — ضاغط لحظي',addr:'I0.0'},
 {sym:'Q4.1',desc:'خرج الدالة نوع S – R (الشكل 7-2) — لمبة H1',addr:'Q4.1'},
 {sym:'Q4.2',desc:'خرج الدالة نوع R – S (الشكل 11-2) — لمبة H2',addr:'Q4.2'}
];
const PROG_SR=[
 {title:'Network 1 — دالة الإبقاء والإلغاء نوع S – R (الشكل 9-2)',ref:'ص 43',read:'إذا كان I0.1 = 1 يُثبَّت Q4.1 على 1 (S). ثم إذا كان I0.0 = 1 يُلغى Q4.1 إلى 0 (R). الأمر المكتوب <b>أخيراً</b> هو الفائز، فهنا الفصل هو المؤثر النهائي.',
  stl:['A I 0.1','S Q 4.1','A I 0.0','R Q 4.1','A Q 4.1','= Q 4.1']},
 {title:'Network 2 — النوع الثاني R – S (الشكل 11-2 محوّلاً إلى STL)',ref:'ص 45',read:'الترتيب معكوس: أولاً إذا كان I0.0 = 1 يُلغى Q4.2 (R)، ثم إذا كان I0.1 = 1 يُثبَّت Q4.2 (S). عند الضغط على الاثنين معاً يكون التشغيل هو المؤثر النهائي.',
  stl:['A I 0.0','R Q 4.2','A I 0.1','S Q 4.2','A Q 4.2','= Q 4.2']}
];
const SR_FIG={addr:'Q4.1',type:'SR',S:['I0.1'],R:['I0.0']},RS_FIG={addr:'Q4.2',type:'RS',S:['I0.1'],R:['I0.0']};
const NM_SR={'I0.1':'S','I0.0':'R'};
function ttSR(rs,S1,R1,q){ // truth table, highlight the current row
  const rows=rs?[[0,0,'حسب الحالة السابقة'],[1,0,'0'],[0,1,'1'],[1,1,'1']]:[[0,0,'حسب الحالة السابقة'],[1,0,'1'],[0,1,'0'],[1,1,'0']];
  // rows for S-R are (S,R); for R-S (R,S) as in the book
  return `<table class="tt"><thead><tr>${rs?'<th>الدخل R</th><th>الدخل S</th>':'<th>الدخل S</th><th>الدخل R</th>'}<th>الخرج Q</th></tr></thead><tbody>`+rows.map(r=>{
    const cur=q!=null&&(rs?(r[0]===R1&&r[1]===S1):(r[0]===S1&&r[1]===R1));const st=cur?' style="background:var(--live-soft);font-weight:700"':'';
    return `<tr><td${st}>${r[0]}</td><td${st}>${r[1]}</td><td${st}>${r[2]}${cur&&r[0]===0&&r[1]===0?` ← الآن ${q}`:''}</td></tr>`}).join('')+'</tbody></table>'}
const lampSVG=(on,color,lbl)=>`<svg viewBox="0 0 70 80" style="width:64px">${B.W.lamp(35,32,16,on,color)}<path d="M24 21l22 22M46 21l-22 22" stroke="var(--fg)" stroke-width="1.5" opacity=".5"/>${S.t(35,72,lbl)}</svg>`;

B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'42–45',
 title:'دالة الإلغاء والإبقاء (S / R) ونوعاها',
 summary:'دالة الإبقاء (Set) تحفظ الخرج بعد نبضة قصيرة، ودالة الإلغاء (Reset) تفصله. نوع S – R يفوز فيه الفصل عند الضغط على الاثنين معاً، ونوع R – S يفوز فيه التشغيل.',
 theory:[
  {h:'الفصل الثاني: دالة الإلغاء والإبقاء (S / R)',ref:'ص 42',html:`<p>عناصر الفصل كما في الكتاب:</p><ol><li>دالة الإلغاء والإبقاء، والتركيب.</li><li>أنواع دالة الإلغاء والإبقاء.</li><li>استخدامات دالة الإلغاء والإبقاء.</li></ol>
    <p>ومن أهداف الوحدة (ص 33): «أن يتعرف المتدرب على دالة الإلغاء والإبقاء ( S-R ) مع كيفية استخدامها».</p>`},
  {h:'أولاً: تعريف دالة الإلغاء والإبقاء',ref:'ص 42',html:`<p>«الشكل (7-2) يوضح هذه الدائرة، والتي تقوم على دالتين هما دالة الإلغاء ودالة الإبقاء.</p>
    <p><b>دالة الإبقاء ( Set – S ):</b> وهي التي تحافظ على حالة توصيل الخرج في حالة إعطاء إشارة للدخل ( S ) حتى ولو كان زمن توصيل هذه الإشارة صغيراً جداً، أي يتحول من (0 إلى 1) فنجد أن الخرج يتحول من (0 إلى 1) ويستمر في هذه الحالة حتى ولو تم فصل الدخل ( S ) وأصبح ( 0 ).</p>
    <p><b>دالة الإلغاء ( Reset – R ):</b> فهي تلغي حالة التوصيل للخرج في حالة إعطاء إشارة للدخل ( R ) حتى ولو كان زمن توصيل هذه الإشارة صغيراً جداً، أي يتحول من (0 إلى 1) فنجد أن الخرج يتحول من (1 إلى 0) ويستمر في الفصل حتى يتم تشغيل الدائرة عن طريق الدخل ( S ) مرة ثانية، وهكذا.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> فكّر في دالة S/R كأنها «ذاكرة» لها زرّان: زر يكتب 1 وزر يكتب 0. يكفي لمس الزر لحظة، والخرج يتذكر آخر أمر. هذا هو نفس عمل <b>التعويض الذاتي</b> الذي رأيته في الدرس السابق (تلامس Q4.3 الموازي لضاغط S1)، لكن بأمر واحد جاهز بدل رسم التلامس الموازي.'},
  {h:'أطراف الدالة',ref:'ص 43',html:`<p>«حيث إن: ( <span class="ltr">I0.1</span> ) تمثل طرف التشغيل ( Set )، و ( <span class="ltr">I0.0</span> ) تمثل طرف تشغيل الفصل ( Reset )، والخرج للدائرة هو ( <span class="ltr">Q4.1</span> ). والشكل (7-2) يوضح ( S – R ) في دائرة ( LAD ) باستخدام ( PLC ). والشكل (8-2) يوضح ( S – R ) في دائرة ( FBD ) باستخدام ( PLC ).»</p>`},
  {fig:'(7-2)',ref:'ص 42',caption:'يبين تمثيل دالة الإلغاء والإبقاء بـ ( LAD )',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${srBox(Object.assign({names:NM_SR},SR_FIG))}</div>`},
  {fig:'(8-2)',ref:'ص 43',caption:'يبين تمثيل دالة الإلغاء والإبقاء بـ ( FBD )',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${srBox(Object.assign({names:NM_SR,fbd:1},SR_FIG))}</div>`},
  {html:'<p>«والشكل (9-2) يوضح ( S – R ) في دائرة ( STL ) باستخدام ( PLC ).»</p>'},
  {fig:'(9-2)',ref:'ص 43',caption:'يبين تمثيل دالة الإلغاء والإبقاء بـ ( STL )',draw:()=>staticNets([PROG_SR[0]],'stl')},
  {note:'<b>قراءة البرنامج سطراً سطراً (توضيح ليس من نص الكتاب):</b><ul><li><span class="ltr">A I 0.1</span> ثم <span class="ltr">S Q 4.1</span>: إذا ضُغط طرف التشغيل اكتب 1 في Q4.1 واتركه هكذا.</li><li><span class="ltr">A I 0.0</span> ثم <span class="ltr">R Q 4.1</span>: إذا ضُغط طرف الفصل اكتب 0 في Q4.1.</li><li><span class="ltr">A Q 4.1</span> ثم <span class="ltr">= Q 4.1</span>: يمثل الملف الموصول بطرف الخرج Q في الشكل (7-2).</li></ul>الـ PLC ينفذ الأسطر بالترتيب في كل دورة مسح، فإذا تحقق الأمران معاً تبقى نتيجة <b>آخر</b> أمر.'},
  {h:'ثانياً: أنواع دالة الإلغاء والإبقاء',ref:'ص 44',html:'<p>«هناك نوعان من أنواع دالة الإلغاء والإبقاء.»</p>'},
  {h:'1- نوع ( S – R )',ref:'ص 44',html:'<p>«الشكل (10-2) يبين دالة الإبقاء والإلغاء ( S – R ). وهذا النوع الذي تقدم شرحه، بالإضافة إلى تحقيق جدول الصواب لهذا النوع على النحو التالي:»</p>'},
  {fig:'(10-2)',ref:'ص 44',caption:'يبين دالة الإبقاء والإلغاء (مطابق للشكل 7-2)',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${srBox(Object.assign({names:NM_SR},SR_FIG))}</div>`},
  {html:`<p><b>جدول الصواب لنوع ( S – R ) — ص 44</b></p>${ttSR(false,0,0,null)}
    <p>«من جدول الصواب نجد أنه في حالة الدخل ( S=1 ) فإن الخرج ( Q=1 ) كما هو مبين في الاحتمال الثاني. وفي حالة الدخل ( R=1 ) فإن الخرج ( Q=0 ) كما هو مبين في الاحتمال الثالث. وفي حالة الدخل ( S=1 ) والدخل ( R=1 ) فإن الخرج ( Q=0 ) كما هو مبين في الاحتمال الرابع، لأنه تم التشغيل أولاً ثم الفصل ثانياً فيكون الفصل هو المؤثر النهائي، وبذلك يكون الخرج ( Q=0 ).</p>
    <p>أما في حالة الاحتمال الأول فإنه يستنتج من الاحتمالين الثاني والثالث؛ حيث إنه من الاحتمال الثاني بعد تشغيل ( S=1 ) لفترة زمنية قصيرة ثم بعد ذلك أصبح الدخل ( S=0 ) فإن الخرج يكون ( Q=1 ). وأيضاً من الاحتمال الثالث بعد تشغيل ( R=1 ) لفترة زمنية قصيرة ثم بعد ذلك أصبح الدخل ( R=0 ) فإن الخرج يكون ( Q=0 ). فإذا أمكن القول في حالة أن الدخلين ( S &amp; R = 0 ) فإن الخرج يمكن أن يكون ( Q=0 ) أو ( Q=1 )، ولذلك الاحتمال الأول يسمى <b>حسب الحالة السابقة</b>.»</p>`},
  {h:'2- النوع الثاني ( R – S )',ref:'ص 45',html:`<p>«الشكل (11-2) يبين دالة الإلغاء والإبقاء نوع ( R – S ). هو نفس النوع الأول من ناحية التركيب والأداء إلا في الاحتمال الرابع من جدول الصواب: في حالة أن الدخلين ( R &amp; S = 1 ) فإن الخرج يكون ( Q=1 )، لأنه في البداية يتم تشغيل دخل الفصل ( R=1 ) أولاً، ثم تشغيل دخل التشغيل ( S=1 ) ثانياً، فيكون الاحتمال النهائي هو التشغيل. كما في جدول الصواب التالي:»</p>
    <p><b>جدول الصواب لنوع ( R – S ) — ص 45</b></p>${ttSR(true,0,0,null)}`},
  {fig:'(11-2)',ref:'ص 45',caption:'يبين دالة الإلغاء والإبقاء (نوع R – S، الطرف R في الأعلى والخرج Q4.2)',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${srBox(Object.assign({names:NM_SR},RS_FIG))}</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يعطي الشكل (11-2) بلغة LAD فقط. حوّلناه إلى STL لتشغيله في المختبر (Network 2): نكتب أمر الإلغاء <b>أولاً</b> ثم أمر الإبقاء، فيكون الإبقاء هو الأخير ويفوز عند الضغط على الاثنين معاً.'},
  {fig:'',caption:'الشكل (11-2) محوّلاً إلى STL (من إعداد الكتاب التفاعلي، ليس في الكتاب)',ref:'ص 45',draw:()=>staticNets([PROG_SR[1]],'stl')},
  {widget:(el)=>{el.innerHTML=`<div class="fig"><table class="tt"><thead><tr><th>الحالة</th><th>S – R (الشكل 10-2)</th><th>R – S (الشكل 11-2)</th></tr></thead><tbody>
     <tr><td>ضغط S فقط</td><td>1</td><td>1</td></tr><tr><td>ضغط R فقط</td><td>0</td><td>0</td></tr><tr><td>لا شيء مضغوط</td><td>يتذكر</td><td>يتذكر</td></tr><tr><td style="font-weight:700">S و R معاً</td><td style="font-weight:700;color:var(--stop)">0 — الفصل يفوز</td><td style="font-weight:700;color:var(--on)">1 — التشغيل يفوز</td></tr></tbody></table>
     <p class="sub">ملخص المقارنة من جدولي الصواب ص 44 و ص 45. جرّبها بنفسك في تبويب «المختبر».</p></div>`}},
  {note:'<b>أين نستخدم كل نوع؟ (توضيح ليس من نص الكتاب):</b> في تشغيل المحركات نختار عادة نوع <b>S – R</b> (الفصل يفوز) حتى يبقى ضاغط الإيقاف أقوى من ضاغط التشغيل إذا ضُغطا معاً، وهذا أكثر أماناً. البند «استخدامات دالة الإلغاء والإبقاء» المذكور في مقدمة الفصل لا يرد له قسم مستقل؛ الاستخدام يأتي عملياً في الفصل الثالث (الدرس التالي).'}
 ],
 io:IO_SR,
 inputs:[
  {id:'S',type:'push',color:'green',label:'Set ‏I0.1'},
  {id:'R',type:'push',color:'red',label:'Reset ‏I0.0'},
  {id:'SR',type:'push',color:'yellow',label:'S و R معاً'},
  {id:'HS',type:'toggle',label:'إبقاء S مضغوطاً'},
  {id:'HR',type:'toggle',label:'إبقاء R مضغوطاً'},
  {id:'xS',addr:'I0.1',type:'sensor',from:st=>st.btn('S')||st.btn('SR')||st.btn('HS')},
  {id:'xR',addr:'I0.0',type:'sensor',from:st=>st.btn('R')||st.btn('SR')||st.btn('HR')}
 ],
 program:PROG_SR,
 plant:{
  title:'لوحة تجربة S / R',
  init:()=>({s:3.6,r:2.4,q1:1.2,q2:0,last:'—'}),
  step(dt,st,p){const S1=st.I('I0.1'),R1=st.I('I0.0');p.s=3.6+S1*0.8;p.r=2.4+R1*0.8;p.q1=1.2+st.Q('Q4.1')*0.8;p.q2=st.Q('Q4.2')*0.8;
    p.last=S1&&R1?'S و R معاً':S1?'S فقط':R1?'R فقط':'لا شيء'},
  render(el,st){const S1=st.I('I0.1'),R1=st.I('I0.0'),q1=st.Q('Q4.1'),q2=st.Q('Q4.2');
    el.innerHTML=`<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap">
      <div style="text-align:center">${lampSVG(q1,'#e0b400','H1 Q4.1')}<div class="sub">S – R</div></div>
      <div style="text-align:center">${lampSVG(q2,'#2fb34a','H2 Q4.2')}<div class="sub">R – S</div></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px"><div class="svgbox">${srBox(Object.assign({P:st.plc,names:NM_SR},SR_FIG))}</div><div class="svgbox">${srBox(Object.assign({P:st.plc,names:NM_SR},RS_FIG))}</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><h3 class="sm">جدول S – R (ص 44)</h3>${ttSR(false,S1,R1,q1)}</div><div><h3 class="sm">جدول R – S (ص 45)</h3>${ttSR(true,S1,R1,q2)}</div></div>`},
  sig:p=>p.last,
  label:p=>'المضغوط الآن: '+p.last,
  readouts:[{l:'S = I0.1',v:(p,st)=>st.I('I0.1')},{l:'R = I0.0',v:(p,st)=>st.I('I0.0')},
   {l:'Q4.1 (S – R)',chip:(p,st)=>st.Q('Q4.1')?['1 يعمل','run']:['0 مفصول','']},{l:'Q4.2 (R – S)',chip:(p,st)=>st.Q('Q4.2')?['1 يعمل','run']:['0 مفصول','']}],
  chart:{key:'q1',ymax:4.6,ticks:[],unit:'',span:12,label:'المخطط الزمني: من الأعلى S ثم R ثم Q4.1 ثم Q4.2',
   series:[{key:'q2',color:'--on'},{key:'s',color:'--live'},{key:'r',color:'--stop'}],
   legend:'<span><i style="background:var(--live)"></i>S (I0.1)</span><span><i style="background:var(--stop)"></i>R (I0.0)</span><span><i style="background:var(--blue)"></i>Q4.1 نوع S – R</span><span><i style="background:var(--on)"></i>Q4.2 نوع R – S</span>'}
 },
 plcNote:'المحاكي يرسم صندوق SR في LAD كملفّين: (S) و (R) على العنوان نفسه، وهذا مكافئ تماماً لصندوق الكتاب في الشكل (7-2). صناديق الكتاب نفسها مرسومة حية في تبويب «المختبر».',
 steps:[
  {t:'الوضع الابتدائي',x:'الخرجان Q4.1 و Q4.2 مفصولان. في المختبر ثلاثة ضواغط: S و R و«S و R معاً»، ومفتاحان يبقيان S أو R مضغوطاً.'},
  {t:'الاحتمال الثاني: S = 1',x:'اضغط S لحظة قصيرة. يتحول الخرجان من 0 إلى 1.',done:s=>s.Q('Q4.1')&&s.Q('Q4.2')},
  {t:'الاحتمال الأول: حسب الحالة السابقة',x:'ارفع إصبعك (S = 0 و R = 0). يبقى الخرجان 1 لأن آخر أمر كان تشغيلاً. لاحظ السطر الأول في الجدولين.',done:s=>!s.I('I0.1')&&!s.I('I0.0')&&s.Q('Q4.1')},
  {t:'الاحتمال الثالث: R = 1',x:'اضغط R لحظة. يتحول الخرجان إلى 0 ويبقيان كذلك بعد رفع الإصبع.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.I('I0.0')},
  {t:'الاحتمال الرابع: S و R معاً',x:'اضغط «S و R معاً» (أو شغّل مفتاح «إبقاء S» ثم اضغط R). نوع S – R يعطي 0 (الفصل يفوز)، ونوع R – S يعطي 1 (التشغيل يفوز).',done:s=>s.I('I0.1')&&s.I('I0.0')},
  {t:'بعد رفع الضاغطين',x:'ارفع الضاغطين معاً (زر «S و R معاً» يرفعهما في اللحظة نفسها). كل خرج يتذكر آخر حالة له: H1 مطفأة و H2 مضيئة. ملاحظة: إذا رفعت أحدهما قبل الآخر فالضاغط الباقي هو آخر أمر ويقرر الحالة.',done:s=>!s.I('I0.1')&&!s.I('I0.0')&&s.Q('Q4.2')},
  {t:'جرّب الترتيب بنفسك',x:'شغّل مفتاح «إبقاء S»، ثم اضغط R وارفعه. ماذا يحدث لـ H1 أثناء الضغط وبعده؟ (تنطفئ ثم تعود، لأن S ما زال 1). أطفئ المفتاح بعدها.'},
  {t:'أطفئ كل شيء',x:'اضغط R حتى يصبح الخرجان 0.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.btn('HS')&&!s.btn('HR')}
 ],
 quiz:[
  {q:'ما وظيفة دالة الإبقاء (Set)؟',o:['تفصل الخرج','تحافظ على توصيل الخرج بعد إشارة قصيرة على S','تعكس حالة الخرج كل ضغطة','تؤخر تشغيل الخرج'],c:1,e:'«تحافظ على حالة توصيل الخرج ... حتى ولو كان زمن توصيل هذه الإشارة صغيراً جداً» (ص 42).'},
  {q:'في الشكل (7-2)، أي عنوان يمثل طرف التشغيل Set؟',o:['I0.0','Q4.1','I0.1','Q4.2'],c:2,e:'«( I0.1 ) تمثل طرف التشغيل، و ( I0.0 ) تمثل طرف الفصل، والخرج Q4.1» (ص 43).'},
  {q:'في نوع S – R، إذا كان S = 1 و R = 1 معاً، فما الخرج؟',o:['1','0','حسب الحالة السابقة','يتذبذب'],c:1,e:'الاحتمال الرابع في جدول ص 44: «تم التشغيل أولاً ثم الفصل ثانياً فيكون الفصل هو المؤثر النهائي».'},
  {q:'في نوع R – S، إذا كان R = 1 و S = 1 معاً، فما الخرج؟',o:['0','حسب الحالة السابقة','1','لا يمكن معرفته'],c:2,e:'جدول ص 45: الإلغاء أولاً ثم الإبقاء ثانياً، فيكون التشغيل هو النهائي.'},
  {q:'لماذا يسمى الاحتمال S = 0 و R = 0 «حسب الحالة السابقة»؟',o:['لأن الخرج يكون دائماً 0','لأن الخرج يبقى على آخر قيمة وصل إليها (0 أو 1)','لأن الخرج يكون دائماً 1','لأن الـ PLC يتوقف'],c:1,e:'إذا كان آخر أمر S فالخرج 1، وإذا كان آخر أمر R فالخرج 0 (ص 44).'},
  {q:'في STL الشكل (9-2)، ما معنى السطرين A I 0.0 ثم R Q 4.1؟',o:['إذا كان I0.0 = 1 اكتب 0 في Q4.1','إذا كان I0.0 = 1 اكتب 1 في Q4.1','اقرأ Q4.1','اعكس I0.0'],c:0,e:'R = Reset: إلغاء الخرج عندما تكون نتيجة الشرط 1.'},
  {q:'كيف نحوّل برنامج S – R إلى نوع R – S في STL؟',o:['نحذف أمر R','نكتب أمر R أولاً ثم أمر S','نستبدل A بـ AN','نضيف مؤقتاً'],c:1,e:'الأمر المكتوب أخيراً يفوز عند تحقق الشرطين، فنكتب الإلغاء أولاً ثم الإبقاء.'},
  {q:'ضغطت S لحظة ثم تركته، ثم ضغطت R لحظة ثم تركته. ما حالة Q4.1 الآن؟',o:['1','0','يعتمد على نوع الدالة','يومض'],c:1,e:'آخر أمر كان R، والنوعان متماثلان في كل الاحتمالات إلا الضغط على الاثنين معاً.'}
 ]
});

/* =================== Lesson 2.3 — star/delta using S/R =================== */
const IO_SD3=[
 {sym:'F4',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I0.0'},
 {sym:'S0',desc:'ضاغط الفصل',addr:'I0.1'},
 {sym:'S1',desc:'ضاغط التشغيل لمحرك النجمة',addr:'I1.1'},
 {sym:'S2',desc:'ضاغط فصل تشغيل المحرك الدلتا',addr:'I1.2'},
 {sym:'K1',desc:'الملف المتمم ( K1 ) التشغيل الرئيس',addr:'Q4.1'},
 {sym:'K2',desc:'الملف المتمم ( K2 ) التشغيل الدلتا',addr:'Q4.2'},
 {sym:'K3',desc:'الملف المتمم ( K3 ) التشغيل قصر النجمة',addr:'Q4.3'}
];
const NM_SD={};IO_SD3.forEach(r=>NM_SD[r.addr]=r.sym);
const PROG_SR_BOOK=[
 {title:'Network 1 — K3 (قصر النجمة) بصندوق SR',ref:'ص 47–49',read:'<b>S:</b> ضغط S1 يثبّت K3. <b>R:</b> F4 <b>أو</b> S0 <b>أو</b> S2 تلغي K3.',
  stl:['A I 1.1','S Q 4.3','A(','O I 0.0','O I 0.1','O I 1.2',')','R Q 4.3','A Q 4.3','= Q 4.3']},
 {title:'Network 2 — K2 (الدلتا) بصندوق SR',ref:'ص 47–49',read:'<b>S:</b> ضغط S2 يثبّت K2. <b>R:</b> F4 <b>أو</b> S0 <b>أو</b> S1 تلغي K2.',
  stl:['A I 1.2','S Q 4.2','A(','O I 0.0','O I 0.1','O I 1.1',')','R Q 4.2','A Q 4.2','= Q 4.2']},
 {title:'Network 3 — K1 (الرئيسي) بصندوق SR',ref:'ص 47–49',read:'<b>S:</b> عمل K2 <b>أو</b> K3 يثبّت K1. <b>R:</b> F4 <b>أو</b> S0 تلغي K1.',
  stl:['A(','O Q 4.2','O Q 4.3',')','S Q 4.1','A(','O I 0.0','O I 0.1',')','R Q 4.1','A Q 4.1','= Q 4.1']}
];
const PROG_SR_FIX=[
 {title:'Network 1 — K3 (قصر النجمة) — مصحح',ref:'تصحيح',read:'<b>S:</b> S1 <b>و</b> K2 مفصول (تعشيق كما في الشكل 5-2). <b>R:</b> F4 <b>أو</b> S0 <b>أو</b> S2.',
  stl:['A I 1.1','AN Q 4.2','S Q 4.3','A(','O I 0.0','O I 0.1','O I 1.2',')','R Q 4.3','A Q 4.3','= Q 4.3']},
 {title:'Network 2 — K2 (الدلتا) — مصحح',ref:'تصحيح',read:'<b>S:</b> S2 <b>و</b> K1 شغال <b>و</b> K3 مفصول (كما في فرع K2 بالشكل 5-2). <b>R:</b> F4 <b>أو</b> S0.',
  stl:['A I 1.2','A Q 4.1','AN Q 4.3','S Q 4.2','A(','O I 0.0','O I 0.1',')','R Q 4.2','A Q 4.2','= Q 4.2']},
 {title:'Network 3 — K1 (الرئيسي) — بدون تغيير',ref:'ص 49',read:'<b>S:</b> K2 <b>أو</b> K3. <b>R:</b> F4 <b>أو</b> S0.',
  stl:['A(','O Q 4.2','O Q 4.3',')','S Q 4.1','A(','O I 0.0','O I 0.1',')','R Q 4.1','A Q 4.1','= Q 4.1']}
];
const SR3_FIGS=[
 {title:'Network1',addr:'Q4.3',type:'SR',S:['I1.1'],R:['I0.0','I0.1','I1.2']},
 {title:'Network2',addr:'Q4.2',type:'SR',S:['I1.2'],R:['I0.0','I0.1','I1.1']},
 {title:'Network3',addr:'Q4.1',type:'SR',S:['Q4.2','Q4.3'],R:['I0.0','I0.1']}
];
// run a button sequence through a program and report outputs (theory widget)
function runSeq(prog,seq){const P=B.createPLC(prog);const out=[];seq.forEach(([lbl,ins])=>{['I0.0','I0.1','I1.1','I1.2','I1.3'].forEach(a=>P.set(a,0));(ins||[]).forEach(a=>P.set(a,1));for(let i=0;i<3;i++)P.scan(0.05);out.push([lbl,P.get('Q4.1'),P.get('Q4.2'),P.get('Q4.3')]);
  ['I0.0','I0.1','I1.1','I1.2'].forEach(a=>P.set(a,0));for(let i=0;i<3;i++)P.scan(0.05)});return out}
const sdPlant3=(()=>{const p=starDeltaPlant(st=>({K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),K3:st.Q('Q4.3')}));const r0=p.render;
  p.render=(el,st,pl)=>{r0(el,st,pl);const ss=srStatus(st.plc);
    el.insertAdjacentHTML('beforeend',`<table class="tt" style="font-size:13px"><thead><tr><th>صندوق SR</th><th>S</th><th>R</th><th>Q</th></tr></thead><tbody>${[['Q4.3','K3'],['Q4.2','K2'],['Q4.1','K1']].map(([a,n])=>{const o=ss[a]||{s:0,r:0};return `<tr><td class="mono">${n} ${a}</td><td>${bit(o.s)}</td><td>${bit(o.r)}</td><td>${bit(st.Q(a))}</td></tr>`}).join('')}</tbody></table>`)};
  p.chart.ymax=65;return p})();

B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'46–49',
 title:'تشغيل المحرك نجمة / دلتا باستخدام دالة الإلغاء والإبقاء',
 summary:'نفس الدائرة الرئيسة (4-2) ودائرة التحكم (5-2)، لكن كل ملف يُبرمج بصندوق SR: طرف S للتشغيل، وطرف R لكل أسباب الفصل. مع ملاحظة مهمة على تعشيق برنامج الكتاب.',
 theory:[
  {h:'الفصل الثالث: تشغيل المحرك نجمة / دلتا باستخدام دالة الإلغاء والإبقاء',ref:'ص 46',html:`<p>«الدائرة الرئيسة لتشغيل المحرك الحثي الثلاثي الأوجه النجمة / الدلتا موضحة بالشكل (4-2)، ودائرة التحكم أيضاً موضحة بالشكل (5-2).»</p>`},
  {fig:'(4-2)',ref:'ص 36',caption:'الدائرة الرئيسة نفسها من الفصل الأول (K1 رئيسي، K2 دلتا، K3 قصر النجمة)',draw:'power'},
  {fig:'(5-2)',ref:'ص 37',caption:'دائرة التحكم نفسها من الفصل الأول',draw:'ctrl'},
  {h:'جدول نقاط الدخل والخرج',ref:'ص 46',html:'<p>«من الشكل (5-2) نجد أن:»</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج والترميز في الـ PLC',ref:'ص 46'},
  {html:`<p>«حيث إنه عند الضغط على ( <span class="ltr">I1.1</span> ) يعمل المتمم ( <span class="ltr">K3-Q4.3</span> ) ويعمل معه المتمم ( <span class="ltr">K1-Q4.1</span> )، وبذلك يعمل المحرك النجمة. وعند الضغط على ( <span class="ltr">I1.2</span> ) يفصل المتمم ( <span class="ltr">K3-Q4.3</span> ) ويعمل المتمم ( <span class="ltr">K2-Q4.2</span> ) مع بقاء المتمم ( <span class="ltr">K1-Q4.1</span> ) في العمل، وبذلك يعمل المحرك الدلتا.»</p>`},
  {note:'<b>كيف تحوّل فرعاً سلكياً إلى صندوق SR؟ (توضيح ليس من نص الكتاب)</b><ul><li>الضاغط الذي <b>يشغّل</b> الملف (ومعه تلامس التعويض الذاتي) يصبح طرف <b>S</b>، والتعويض الذاتي لم يعد لازماً لأن الصندوق يتذكر.</li><li>كل ما <b>يفصل</b> الملف (F4، S0، والتلامس المغلق للضاغط الآخر) يوضع على التوازي (أو) في طرف <b>R</b>.</li></ul>'},
  {h:'المطلوب: تحويل دائرة التحكم الموضحة في الشكل (5-2) إلى:',ref:'ص 47'},
  {h:'1- دائرة ( LAD ) باستخدام ( PLC ) و ( S – R )',ref:'ص 47'},
  {draw:()=>srNets(SR3_FIGS,{names:NM_SD}),caption:'Network1–3 بلغة LAD مع صناديق SR (كما في الكتاب)',ref:'ص 47'},
  {h:'2- دائرة ( FBD ) باستخدام ( PLC ) و ( S – R )',ref:'ص 48'},
  {draw:()=>srNets(SR3_FIGS,{names:NM_SD,fbd:1}),caption:'Network1–3 بلغة FBD مع صناديق SR (كما في الكتاب)',ref:'ص 48'},
  {h:'3- دائرة ( STL ) باستخدام ( PLC ) و ( S – R )',ref:'ص 49'},
  {draw:()=>staticNets(PROG_SR_BOOK,'stl'),caption:'Network1–3 بلغة STL (منقولة حرفياً)',ref:'ص 49'},
  {html:'<p><b>المطلوب (ص 49):</b> «تنفيذ التمارين السابقة على جهاز الحاسب الآلي، ثم نقله إلى وحدة ( PLC ) واختبار صحة عمل الدائرة.»</p>'},
  {note:'في الفصل الأول كُتب F4 و S0 كتلامسات مغلقة (AN) في كل Network، أما هنا فهي تلامسات مفتوحة على طرف R. المعنى واحد: الضغط على S0 أو فصل F4 يعطي 1 فيُلغي الخرج (حسب توصيل الكتاب: إشارة 1 عند الضغط أو الفصل). والكتاب لا يشرح هذا الفرق.'},
  {err:`برنامج S – R في ص 47–49 <b>لا يحوي التعشيق</b> الموجود في الشكل (5-2): لا يوجد تلامس K2 المغلق في شرط K3، ولا تلامس K3 المغلق ولا تلامس K1 المفتوح في شرط K2. والنتيجة:
    <ul><li>الضغط على <b>S2 والمحرك متوقف</b>: يُثبَّت Q4.2 ثم يُثبَّت Q4.1 في Network 3، فيبدأ المحرك <b>دلتا مباشرة</b> بتيار بدء كامل (≈ 60 A في المحاكاة). في الدائرة السلكية هذا مستحيل لأن فرع K2 يحتاج K1.</li>
    <li>الضغط على <b>S1 أثناء الدلتا</b>: يُلغى K2 ويُثبَّت K3 فيرجع المحرك إلى النجمة وهو دائر.</li></ul>
    في «المختبر» وتبويب «برنامج الـ PLC» يمكنك التبديل بين <b>كما في الكتاب</b> و <b>المصحح</b>. التصحيح: إضافة <span class="ltr">AN Q 4.2</span> إلى شرط S في Network 1، وإضافة <span class="ltr">A Q 4.1</span> و <span class="ltr">AN Q 4.3</span> إلى شرط S في Network 2، وحذف <span class="ltr">I1.1</span> من شرط R في Network 2 (في الشكل 5-2 لا يؤثر S1 على K2).`},
  {widget:(el)=>{const seq=[['S1 (نجمة)',['I1.1']],['S2 (دلتا)',['I1.2']],['S0 (إيقاف)',['I0.1']],['S2 والمحرك متوقف',['I1.2']],['S0',['I0.1']]];
    const a=runSeq(PROG_SR_BOOK,seq),b=runSeq(PROG_SR_FIX,seq);
    const row=(r,i)=>`<tr><td>${r[0]}</td><td>${bit(r[1])} ${bit(r[2])} ${bit(r[3])}</td><td>${bit(b[i][1])} ${bit(b[i][2])} ${bit(b[i][3])}</td></tr>`;
    el.innerHTML=`<div class="fig"><table class="tt"><thead><tr><th>الضغطة (بالترتيب)</th><th>كما في الكتاب<br><small>K1 K2 K3</small></th><th>المصحح<br><small>K1 K2 K3</small></th></tr></thead><tbody>${a.map(row).join('')}</tbody></table>
     <p class="sub">نتائج تشغيل البرنامجين فعلياً في محاكي الـ PLC. لاحظ السطر الرابع: في برنامج الكتاب يعمل K1 و K2 (دلتا مباشرة).</p></div>`}},
  {note:'صناديق SR في الكتاب من نوع <b>S – R</b> (الفصل يفوز). لذلك إذا ضُغط S1 و S2 معاً في Network 1 يفوز طرف R (لأن S2 داخل فيه) ويُفصل K3، وهذا يوافق جدول الصواب في ص 44.'}
 ],
 io:IO_SD3, inputs:IN_SD,
 variants:{default:'book',note:'برنامج الكتاب يحذف التعشيق الموجود في الشكل (5-2). جرّب الضغط على S2 والمحرك متوقف في النسختين.',
  book:{label:'كما في الكتاب',program:PROG_SR_BOOK,note:'ص 49: بدون تعشيق. S2 من السكون يبدأ دلتا مباشرة، و S1 أثناء الدلتا يرجع إلى النجمة.'},
  fixed:{label:'المصحح',program:PROG_SR_FIX,note:'أُضيف التعشيق كما في الشكل (5-2): K3 لا يُثبَّت أثناء K2، و K2 لا يُثبَّت إلا مع K1 وبعد فصل K3، و S1 لا يُلغي K2.'}},
 power:(st)=>powerStarDelta(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3')),powerRef:'الشكل (4-2) ص 36',
 ctrl:CTRL_SD,ctrlMap:MAP_SD,ctrlRef:'الشكل (5-2) ص 37 — للمقارنة',
 plant:sdPlant3,
 plcNote:'المحاكي يرسم كل صندوق SR كملفّين (S) و (R) على العنوان نفسه، وهو مكافئ لصناديق الكتاب المرسومة في تبويب «الشرح». F4 و S0 يعطيان 1 عند الضغط أو الفصل حسب توصيل الكتاب.',
 steps:[
  {t:'الوضع الابتدائي',x:'المحرك متوقف. تحت المحرك جدول يبين أي طرف (S أو R) نشط في كل صندوق.'},
  {t:'ابدأ بالنجمة',x:'اضغط S1 (I1.1). طرف S في صندوق K3 يصبح 1، ثم K3 يثبّت K1 عبر Network 3.',done:s=>s.Q('Q4.1')&&s.Q('Q4.3')},
  {t:'الصندوق يتذكر',x:'ارفع إصبعك: يبقى K3 و K1 بدون تلامس تعويض ذاتي. انتظر حتى تتجاوز السرعة 1300 rpm.',done:s=>s.Q('Q4.3')&&!s.btn('S1')&&s.plant.n>1300},
  {t:'انقل إلى الدلتا',x:'اضغط S2 (I1.2). S2 داخل في طرف R لصندوق K3 فيُلغيه، وفي طرف S لصندوق K2 فيثبّته. يبقى K1.',done:s=>s.Q('Q4.2')&&s.Q('Q4.1')&&!s.Q('Q4.3')},
  {t:'أوقف المحرك',x:'اضغط S0: هو في طرف R للصناديق الثلاثة.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.Q('Q4.3')&&!s.btn('S0')},
  {t:'جرّب خطأ الكتاب',x:'والمحرك متوقف اضغط S2 مباشرة. في نسخة «كما في الكتاب» يبدأ المحرك دلتا ويقفز التيار نحو 60 A. بدّل إلى «المصحح» (أعلى الصفحة) وكرر: لن يحدث شيء.'},
  {t:'S1 أثناء الدلتا',x:'شغّل نجمة ثم دلتا، ثم اضغط S1. في نسخة الكتاب يعود المحرك إلى النجمة، وفي المصححة لا يتغير شيء.'},
  {t:'الحماية الحرارية',x:'اضغط «فصل F4»: I0.0 = 1 في طرف R لكل الصناديق فيتوقف كل شيء. أعد الضبط بعدها.',done:s=>s.btn('F4')}
 ],
 quiz:[
  {q:'في Network 1 (ص 49)، ما الذي يوضع في طرف S لصندوق K3؟',o:['I0.0','I1.1 (S1)','I1.2 (S2)','Q4.1'],c:1,e:'A I 1.1 ثم S Q 4.3: ضاغط تشغيل النجمة.'},
  {q:'ما الذي يوضع في طرف R لصندوق K3؟',o:['S1 فقط','F4 أو S0 أو S2','K1 أو K2','لا شيء'],c:1,e:'A( O I 0.0 O I 0.1 O I 1.2 ) R Q 4.3.'},
  {q:'كيف يعمل K1 في برنامج S – R؟',o:['بضغط S1 مباشرة','يُثبَّت عند عمل K2 أو K3','يعمل مع F4','يعمل بمؤقت'],c:1,e:'Network 3: A( O Q 4.2 O Q 4.3 ) S Q 4.1.'},
  {q:'لماذا لا نحتاج تلامس التعويض الذاتي مع صندوق SR؟',o:['لأن الصندوق يتذكر الحالة بعد ترك الضاغط','لأن الـ PLC أسرع','لأن F4 يغني عنه','لأن الضاغط يبقى مضغوطاً'],c:0,e:'دالة الإبقاء تحفظ الخرج حتى يأتي أمر إلغاء.'},
  {q:'حسب برنامج الكتاب (ص 49)، ماذا يحدث عند الضغط على S2 والمحرك متوقف؟',o:['لا شيء','يبدأ المحرك نجمة','يبدأ المحرك دلتا مباشرة','يفصل F4'],c:2,e:'لا يوجد شرط K1 في Network 2، فيُثبَّت K2 ثم K1. هذا خطأ تعشيق في البرنامج.'},
  {q:'ما التعديل الذي يمنع البدء دلتا مباشرة؟',o:['إضافة A Q 4.1 و AN Q 4.3 إلى شرط S في Network 2','حذف Network 3','وضع S1 في طرف S لـ K2','إزالة F4'],c:0,e:'هذا بالضبط ما يفعله فرع K2 في الشكل (5-2): S2 و K3 مغلق و K1 مفتوح.'},
  {q:'في هذا الفصل كُتب S0 كتلامس مفتوح على طرف R، بينما كتب في الفصل الأول AN. لماذا النتيجة واحدة؟',o:['لأن R يُلغي عند 1، و AN يقطع عند 1','لأن S0 غير مستخدم','لأنهما يختلفان فعلاً','لأن F4 يعكسه'],c:0,e:'في الحالتين الضغط على S0 (إشارة 1) يفصل الخرج.'},
  {q:'إذا ضُغط S1 و S2 معاً، ماذا يحدث لـ K3 حسب نوع الصندوق S – R؟',o:['يعمل لأن S يفوز','يُفصل لأن R يفوز','يتذبذب','لا يتأثر'],c:1,e:'نوع S – R: الفصل هو المؤثر النهائي (ص 44)، و S2 داخل في طرف R.'}
 ]
});

/* =================== Lesson 2.4 — star/delta with reversing =================== */
const IO_REV=[
 {sym:'F4',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I0.0'},
 {sym:'S0',desc:'ضاغط الفصل',addr:'I0.1'},
 {sym:'S1',desc:'ضاغط التشغيل لمحرك النجمة يميناً',addr:'I1.1'},
 {sym:'S2',desc:'ضاغط التشغيل لمحرك الدلتا يميناً',addr:'I1.2'},
 {sym:'S3',desc:'ضاغط التشغيل لمحرك النجمة يسار',addr:'I1.3'},
 {sym:'S2',desc:'ضاغط التشغيل لمحرك الدلتا يسار',addr:'I1.4'},
 {sym:'K1',desc:'الملف المتمم ( K1 ) لتشغيل الرئيس يميناً',addr:'Q4.1'},
 {sym:'K2',desc:'ملف المتمم ( K2 ) تشغيل الرئيس يساراً',addr:'Q4.2'},
 {sym:'K3',desc:'الملف المتمم ( K3 ) لتشغيل النجمة',addr:'Q4.3'},
 {sym:'K4',desc:'الملف المتمم ( K4 ) لتشغيل الدلتا',addr:'Q4.4'},
 {sym:'( F4+S0)',desc:'دالة التخزين لضاغط الفصل مع القاطع الحراري',addr:'M0.0'}
];
const NET_REV=[
 {title:'Network 1 — M0.0 (F4 + S0)',ref:'ص 54–56',read:'M0.0 = 1 إذا كان F4 سليماً <b>و</b> S0 غير مضغوط. كل الشبكات التالية تبدأ بـ M0.0.',
  stl:['AN I 0.0','AN I 0.1','= M 0.0']},
 {title:'Network 2 — K1 (تعليق الكتاب: «الدوران عكس اتجاه عقارب الساعة»)',ref:'ص 54–56',read:'K1 يعمل إذا: M0.0 <b>و</b> (S1 <b>أو</b> K1 شغال) <b>و</b> K2 مفصول.',
  stl:['A M 0.0','A(','O I 1.1','O Q 4.1',')','AN Q 4.2','= Q 4.1']},
 {title:'Network 3 — K2 (تعليق الكتاب: «الدوران مع اتجاه عقارب الساعة»)',ref:'ص 54–56',read:'K2 يعمل إذا: M0.0 <b>و</b> (S3 <b>أو</b> K2 شغال) <b>و</b> K1 مفصول.',
  stl:['A M 0.0','A(','O I 1.3','O Q 4.2',')','AN Q 4.1','= Q 4.2']},
 {title:'Network 4 — K3 (نجمة)',ref:'ص 54–56',read:'K3 يعمل إذا: M0.0 <b>و</b> (K1 <b>أو</b> K2) <b>و</b> S2 غير مضغوط <b>و</b> K4 مفصول.',
  stl:['A M 0.0','A(','O Q 4.1','O Q 4.2',')','AN I 1.2','AN Q 4.4','= Q 4.3']}
];
const N5_BOOK={title:'Network 5 — K4 (دلتا) كما في الكتاب',ref:'ص 54–56',read:'K4 يعمل إذا: M0.0 <b>و K2 فقط</b> <b>و</b> (S2 <b>أو</b> K4 شغال) <b>و</b> K3 مفصول. لاحظ: K1 غير مذكور.',
  stl:['A M 0.0','A Q 4.2','A(','O I 1.2','O Q 4.4',')','AN Q 4.3','= Q 4.4']};
const N5_FIX={title:'Network 5 — K4 (دلتا) مصحح حسب الشكل (7-3)',ref:'تصحيح',read:'K4 يعمل إذا: M0.0 <b>و</b> (K1 <b>أو</b> K2) <b>و</b> (S2 <b>أو</b> K4 شغال) <b>و</b> K3 مفصول.',
  stl:['A M 0.0','A(','O Q 4.1','O Q 4.2',')','A(','O I 1.2','O Q 4.4',')','AN Q 4.3','= Q 4.4']};
const PROG_REV_BOOK=NET_REV.concat([N5_BOOK]),PROG_REV_FIX=NET_REV.concat([N5_FIX]);
const NM_REV={};IO_REV.forEach(r=>{if(!NM_REV[r.addr])NM_REV[r.addr]=r.sym});NM_REV['M0.0']='M0.0';
const CTRL_REV={top:[{l:'F4',nc:1},{l:'S0',nc:1,btn:1}],branches:[
 {items:[{par:[[{l:'S1',btn:1}],[{l:'K1'}]]},{l:'K2',nc:1}],coil:{l:'K1'}},
 {items:[{par:[[{l:'S3',btn:1}],[{l:'K2'}]]},{l:'K1',nc:1}],coil:{l:'K2'}},
 {items:[{par:[[{l:'K1'}],[{l:'K2'}]]},{l:'S2',nc:1,btn:1},{l:'K4',nc:1}],coil:{l:'K3'}},
 {items:[{par:[[{l:'K1'}],[{l:'K2'}]]},{par:[[{l:'S2',btn:1}],[{l:'K4'}]]},{l:'K3',nc:1}],coil:{l:'K4'}}]};
const isBook=st=>(st.variant||'book')==='book';
function revState(st){const K1=st.Q('Q4.1'),K2=st.Q('Q4.2'),K3=st.Q('Q4.3'),K4=st.Q('Q4.4');const dir=K1&&!K2?1:K2&&!K1?-1:0;
  return {K1,K2,K3,K4,dir,star:!!(dir&&K3&&!K4),delta:!!(dir&&K4&&!K3),bad:!!(dir&&K4&&!K3&&isBook(st)),open:!!(dir&&!K3&&!K4)}}
const revPlant=(()=>{
  const arrow=d=>d>0?' ⟳':' ⟲';
  const p=B.motorPlant(st=>{const k=revState(st);
    if(k.bad)return {target:1150*k.dir,tau:2.2,I:n=>40+20*clamp(1-Math.abs(n)/1460,0,1),label:'قصر في ملف W'+arrow(k.dir),mode:'trip'};
    if(k.star)return {target:1400*k.dir,tau:1.6,I:n=>Istar(Math.abs(n)),label:'نجمة Y'+arrow(k.dir),mode:'star'};
    if(k.delta)return {target:1460*k.dir,tau:.7,I:n=>Idelta(Math.abs(n)),label:'دلتا Δ'+arrow(k.dir),mode:'delta'};
    if(k.open)return {target:0,tau:2.4,I:()=>0,label:'الملفات مفتوحة',mode:'warn'};
    return null},{refs:[{v:60,color:'--stop'},{v:10,color:'--muted'}]});
  const base=p.step,i0=p.init;
  p.init=()=>Object.assign(i0(),{heat:0,trip:0,cool:0,bad:0,dir:0,m:'off'});
  p.step=(dt,st,pl)=>{base(dt,st,pl);const k=revState(st);pl.bad=k.bad?1:0;pl.dir=k.dir;
    pl.m=k.bad?'bad':k.star?'star':k.delta?'delta':k.open?'open':'off';
    if(k.bad){pl.heat+=dt;if(pl.heat>2.5&&!pl.trip){pl.trip=1;pl.cool=0}}else pl.heat=Math.max(0,pl.heat-dt*0.5);
    if(pl.trip){if(!k.dir)pl.cool+=dt;if(pl.cool>5){pl.trip=0;pl.heat=0}}};
  p.chart.legend='<span><i style="background:var(--blue)"></i>التيار الفعلي</span><span><i style="background:var(--stop)"></i>تيار البدء دلتا مباشرة (≈ 60 A)</span><span><i style="background:var(--muted)"></i>التيار المقنن 10 A</span>';
  p.readouts=p.readouts.concat([{l:'الاتجاه',chip:pl=>pl.n>5?['يمين ⟳ (K1)','run']:pl.n<-5?['يسار ⟲ (K2)','rev']:['—','']},
    {l:'F4 الحراري',chip:pl=>pl.trip?['فصل: حمل زائد','trip']:pl.bad?['يسخن…','warn']:['سليم','']}]);
  p.render=(el,st,pl)=>{const k=revState(st);
    el.innerHTML=`<div class="svgbox" style="margin-top:0;max-width:250px">${windRevSVG(pl.m||'off',k.dir||1)}</div><p class="sub">${pl.trip?'<b style="color:var(--stop)">فصل F4 بسبب ارتفاع التيار.</b> في المحاكاة يعود F4 تلقائياً بعد أن يبرد (5 ثوانٍ والمحرك مفصول).':
      pl.m==='bad'?'توصيلة k4 كما في الشكل (6-3): الملف W طرفاه على الخط نفسه، والمحرك يعمل على وجهين فقط فيرتفع التيار حتى يفصل F4.':
      pl.m==='star'?`نجمة: كل ملف عليه <b class="ltr">220 v</b>. ${k.dir>0?'المتمم K1: الترتيب <span class="ltr">L1 L2 L3</span>.':'المتمم K2: تبديل L1 و L3 فيعكس اتجاه الدوران.'}`:
      pl.m==='delta'?`دلتا: كل ملف عليه <b class="ltr">380 v</b>. ${k.dir>0?'الاتجاه الأول (K1).':'الاتجاه المعاكس (K2).'}`:
      pl.m==='open'?'K1 أو K2 يعمل، لكن لا نجمة ولا دلتا: أطراف النهاية مفتوحة فلا يمر تيار.':'الملفات غير متصلة بالشبكة.'}</p>`};
  p.sig=pl=>[pl.m,pl.trip,pl.dir].join();
  p.label=pl=>pl.label;
  return p})();

B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'50–56',
 title:'تشغيل المحرك نجمة / دلتا مع عكس الحركة',
 summary:'متمم K1 لاتجاه و K2 للاتجاه المعاكس (بتبديل وجهين)، و K3 للنجمة و K4 للدلتا. دائرة التحكم (7-3) تتحول إلى خمس Networks مع المخزن M0.0. في الفصل أخطاء في الرسم والبرنامج يمكنك مقارنتها بالنسخة المصححة.',
 theory:[
  {h:'الفصل الرابع: الدائرة الرئيسة ودائرة التحكم لتشغيل المحرك نجمة / دلتا مع عكس الحركة',ref:'ص 50',html:`<p><b>الأهداف كما في الكتاب:</b></p><ol><li>رسم الدائرة الرئيسة لتشغيل المحرك الحثي الثلاثي الأوجه يعمل النجمة / الدلتا، مع عكس الحركة.</li><li>رسم دائرة التحكم لتشغيل المحرك الحثي الثلاثي الأوجه يعمل النجمة / الدلتا، مع عكس الحركة.</li><li>تحويل دائرة التحكم إلى دائرة: أ- ( LAD ) باستخدام ( PLC ) مع دالة ( S – R ). ب- ( FBD ) مع دالة ( S – R ). ت- ( STL ) مع دالة ( S – R ).</li><li>تنفيذ الدائرة على جهاز الحاسب الآلي، ثم نقلها إلى وحدة ( PLC ) مع اختبار عمل الدائرة.</li></ol>`},
  {err:'الأهداف تذكر استخدام دالة ( S – R )، لكن برامج LAD و FBD و STL في هذا الفصل (ص 54–56) مكتوبة بملفات عادية وتعويض ذاتي، بدون صناديق S/R.'},
  {h:'أولاً: الدائرة الرئيسة',ref:'ص 51',html:`<p>«رسم الدائرة الرئيسة لتشغيل المحرك الحثي الثلاثي الأوجه يعمل النجمة / الدلتا، مع عكس الحركة، كما في الشكل (6-3).» مكونات الشكل:</p>
    <ul><li><b>K1</b> (الاتجاه الأول): L1 → U1، L2 → V1، L3 → W1 (عبر القاطع الحراري F4).</li>
    <li><b>K2</b> (عكس الحركة): يُغذّى من بعد المصاهر ويوصل L3 → U1، L2 → V1، L1 → W1. <b>تبديل وجهين (L1 و L3) يعكس اتجاه الدوران.</b></li>
    <li><b>K3</b> (النجمة): يقصر أطراف النهاية V2 و U2 و W2 معاً.</li>
    <li><b>k4</b> (الدلتا، مكتوب بحرف صغير في الرسم): يوصل أطراف البداية بأطراف النهاية.</li></ul>
    <p>إذن: (K1 أو K2) + K3 = نجمة، و (K1 أو K2) + K4 = دلتا. و K1 و K2 لا يعملان معاً أبداً (وإلا صار قصر بين L1 و L3)، و K3 و K4 كذلك.</p>`},
  {fig:'(6-3)',ref:'ص 51',caption:'يبين الدائرة الرئيسة لتشغيل محرك النجمة / الدلتا مع عكس الحركة (توصيل k4 كما في الكتاب؛ الدائرة الحمراء = الوصلة الخاطئة)',draw:()=>`<div class="svgbox">${powerRev(0,0,0,0,true)}</div>`},
  {err:`توصيل ملامسات <b>k4</b> في الشكل (6-3) كما هو مرسوم يعطي: U1–V2 و V1–U2 و <b>W1–W2</b>. أي أن طرفي الملف W على الخط نفسه (الملف W مقصور ولا يعمل)، والملفان U و V على خطين فقط. المحرك يعمل على وجهين فيسخن ويرتفع التيار حتى يفصل F4. توصيلة الدلتا الصحيحة (كما في الشكل 4-2) هي <b>U1–W2 و V1–U2 و W1–V2</b>. بدّل بين النسختين في الرسم التالي، وفي «المختبر».`},
  {widget:(el)=>{let v='book',k='K1K4';const draw=()=>{const K1=k!=='K2K4',K2=k==='K2K4',K3=k==='K1K3',K4=k!=='K1K3';
     el.innerHTML=`<div class="fig"><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><div class="seg" role="group"><button data-v="book" aria-pressed="${v==='book'}">كما في الكتاب</button><button data-v="fixed" aria-pressed="${v==='fixed'}">المصحح</button></div>
       <div class="seg" role="group"><button data-k="K1K3" aria-pressed="${k==='K1K3'}">K1 + K3 نجمة</button><button data-k="K1K4" aria-pressed="${k==='K1K4'}">K1 + K4 دلتا</button><button data-k="K2K4" aria-pressed="${k==='K2K4'}">K2 + K4 دلتا معاكس</button></div></div>
       <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;align-items:center"><div class="svgbox">${powerRev(K1,K2,K3,K4,v==='book')}</div><div class="svgbox">${windRevSVG(K3?'star':v==='book'?'bad':'delta',K2?-1:1)}</div></div>
       <p class="sub">${v==='book'&&K4?'كما في الكتاب: الملف W مقصور (W1 و W2 على الخط نفسه).':K4?'المصحح: U1–W2 و V1–U2 و W1–V2، دلتا سليمة.':'النجمة لا تتأثر بالخطأ، لأن k4 مفصول.'}</p></div>`;
     el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()});el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};draw()}},
  {h:'ثانياً: دائرة التحكم',ref:'ص 52',html:`<p>«رسم دائرة التحكم لتشغيل محركي الحثي الثلاثي الأوجه يعمل النجمة / الدلتا، مع عكس الحركة، كما في الشكل (7-3).» في أعلاها F4 المغلق ثم S0 المغلق، ثم:</p>
    <ul><li><b>فرع K1:</b> [S1 ∥ K1] ثم K2 مغلق.</li><li><b>فرع K2:</b> [S3 ∥ K2] ثم K1 مغلق. (K1 و K2 بتعشيق متبادل)</li>
    <li>عقدة مشتركة [K1 ∥ K2] تغذي الفرعين التاليين، أي أن أي اتجاه يشغّل النجمة تلقائياً:</li>
    <li><b>فرع K3:</b> S2 مغلق ثم K4 مغلق.</li><li><b>فرع K4:</b> [S2 ∥ K4] ثم K3 مغلق.</li></ul>`},
  {fig:'(7-3)',ref:'ص 52',caption:'دائرة التحكم لتشغيل المحرك النجمة / الدلتا مع عكس الحركة (رُسم التلامس المشترك [K1 ∥ K2] مرتين لتبسيط الرسم، وهو في الكتاب عقدة واحدة)',draw:'ctrl'},
  {err:'عنوان الشكل (7-3) في ص 52 يقول «يبين الدائرة الرئيسة ...» بينما الشكل في الحقيقة <b>دائرة تحكم</b>.'},
  {h:'جدول الدخل والخرج',ref:'ص 53',html:'<p>«من الشكل (7-3) نجد أن:»</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج كما في الكتاب (بما فيها التكرار)',ref:'ص 53'},
  {html:`<p>«حيث إنه عند الضغط على ( S1 ) يعمل المحرك النجمة باتجاه اليمين، وبعد ذلك يمكن التحويل إلى الدلتا بالضغط على ( S2 ). عند الضغط على ( S3 ) يعمل المحرك النجمة باتجاه اليسار، وبعد ذلك يمكن التحويل إلى الدلتا بالضغط على ( S4 ). عند الضغط على ( S1 ) مرة ثانية يعمل المحرك النجمة باتجاه اليمين مرة ثانية، وبعد ذلك يمكن التحويل إلى الدلتا بالضغط على ( S2 ). وهكذا.»</p>`},
  {note:'<b>M0.0 (توضيح ليس من نص الكتاب):</b> الجدول يسميه «دالة التخزين لضاغط الفصل مع القاطع الحراري». هو في الحقيقة بت داخلي (Memory) قيمته 1 عندما يكون F4 سليماً و S0 غير مضغوط. نكتب الشرط مرة واحدة في Network 1 ثم نستعمل M0.0 في كل الشبكات بدل تكرار AN I 0.0 و AN I 0.1. لاحظ أيضاً أن الضغط على S0 يفصل كل شيء، ولا يمكن عكس الاتجاه إلا بعد الإيقاف (تعشيق K1/K2).'},
  {err:`<b>جدول ص 53:</b> الرمز <b>S2</b> مكرر؛ السطر (I1.4 «ضاغط التشغيل لمحرك الدلتا يسار») يُفترض أنه <b>S4</b> كما يقول النص بعده. لكن لا الدائرة (7-3) ولا البرامج تستخدم S4 أو I1.4؛ الدلتا في الاتجاهين بضاغط واحد هو S2 (I1.2). لذلك لا يوجد ضاغط S4 في المختبر.<br>
    <b>تسمية الاتجاه:</b> الجدول يصف K1 بأنه «يميناً» و K2 «يساراً»، بينما تعليقات LAD في ص 54 تقول Network 2 (K1) «عكس اتجاه عقارب الساعة» و Network 3 (K2) «مع اتجاه عقارب الساعة». اعتمدنا في المحاكاة تسمية الجدول: K1 يمين ⟳، K2 يسار ⟲ (الاتجاه الفعلي يعتمد على توصيل المحرك؛ المهم أن K1 و K2 متعاكسان).`},
  {h:'ثالثاً: تحويل دائرة التحكم',ref:'ص 54'},
  {h:'1- دائرة ( LAD ) باستخدام ( PLC )',ref:'ص 54'},
  {draw:()=>staticNets(PROG_REV_BOOK,'lad',NM_REV),caption:'Network 1–5 بلغة LAD كما في الكتاب',ref:'ص 54'},
  {h:'2- دائرة ( FBD ) باستخدام ( PLC )',ref:'ص 55'},
  {draw:()=>staticNets(PROG_REV_BOOK,'fbd',NM_REV),caption:'Network 1–5 بلغة FBD كما في الكتاب',ref:'ص 55'},
  {h:'3- دائرة ( STL ) باستخدام ( PLC )',ref:'ص 56'},
  {draw:()=>staticNets(PROG_REV_BOOK,'stl'),caption:'Network 1–5 بلغة STL (السطر الأخير في Network 2 مصحح من = O 4.1)',ref:'ص 56'},
  {err:'<b>STL ص 56، Network 2:</b> السطر الأخير مطبوع <span class="ltr">= O 4.1</span> (حرف O) بدل <span class="ltr">= Q 4.1</span>. خطأ طباعي؛ صححناه في النسختين لأن البرنامج لا يعمل بدونه (لن يعمل K1 أبداً).'},
  {err:`<b>Network 5 (ص 54–56):</b> شرط الدلتا فيه <span class="ltr">A Q 4.2</span> فقط، بينما فرع K4 في الشكل (7-3) يتغذى من [K1 ∥ K2]. النتيجة حسب برنامج الكتاب:
    <ul><li>مع <b>K1</b> (الاتجاه الأول): الضغط على S2 يفصل النجمة (Network 4) دون أن يعمل K4، فيبقى K1 وحده والملفات مفتوحة، وعند رفع S2 ترجع النجمة. أي أن <b>الدلتا لا تعمل في الاتجاه الأول</b>.</li>
    <li>مع <b>K2</b>: يعمل K4 (ومع خطأ توصيل k4 في الشكل 6-3 يُقصر الملف W ويفصل F4).</li></ul>
    التصحيح: <span class="ltr">A( O Q 4.1 O Q 4.2 )</span> بدل <span class="ltr">A Q 4.2</span>، كما في الشكل (7-3). الشبكات الثلاث LAD و FBD و STL في الكتاب تحمل الخطأ نفسه.`},
  {draw:()=>staticNets([N5_FIX],'lad',NM_REV),caption:'Network 5 بعد التصحيح (ليس في الكتاب)',ref:'تصحيح'},
  {html:'<p><b>المطلوب (ص 56):</b> «تنفيذ التمرين السابق على جهاز الحاسب الآلي، ثم نقله إلى وحدة ( PLC ) واختبار صحة عمل الدائرة.»</p>'},
  {note:'في «المختبر» زر <b>كما في الكتاب</b> يشغّل برنامج الكتاب مع توصيل k4 المرسوم في (6-3)، وزر <b>المصحح</b> يشغّل Network 5 المصحح مع توصيلة الدلتا الصحيحة.'}
 ],
 io:IO_REV,
 inputs:[
  {id:'S0',addr:'I0.1',type:'push',color:'red',label:'إيقاف'},
  {id:'S1',addr:'I1.1',type:'push',color:'green',label:'نجمة يمين (K1)'},
  {id:'S3',addr:'I1.3',type:'push',color:'blue',label:'نجمة يسار (K2)'},
  {id:'S2',addr:'I1.2',type:'push',color:'black',label:'تحويل دلتا'},
  {id:'F4',type:'fault',label:'فصل F4 (حمل زائد)',resetLabel:'إعادة ضبط F4'},
  {id:'xF4',addr:'I0.0',type:'sensor',from:st=>st.btn('F4')||(st.plant&&st.plant.trip)}
 ],
 variants:{default:'book',note:'الكتاب فيه خطآن يغيّران السلوك: توصيل k4 في الشكل (6-3) يقصر الملف W، و Network 5 يشترط K2 فقط. النسخة المصححة تصلح الاثنين.',
  book:{label:'كما في الكتاب',program:PROG_REV_BOOK,note:'برنامج ص 56 (مع تصحيح = O 4.1 فقط) وتوصيل k4 كما في الشكل (6-3) ص 51: الدلتا لا تعمل مع K1، ومع K2 يُقصر الملف W ويفصل F4.'},
  fixed:{label:'المصحح',program:PROG_REV_FIX,note:'Network 5 يتغذى من (K1 أو K2) كما في الشكل (7-3)، وتوصيل الدلتا U1–W2 و V1–U2 و W1–V2 كما في الشكل (4-2).'}},
 power:(st)=>powerRev(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4'),isBook(st)),powerRef:'الشكل (6-3) ص 51',
 ctrl:CTRL_REV,ctrlMap:{F4:st=>st.btn('F4')||(st.plant&&st.plant.trip),S0:'btn:S0',S1:'btn:S1',S2:'btn:S2',S3:'btn:S3',K1:'Q4.1',K2:'Q4.2',K3:'Q4.3',K4:'Q4.4'},ctrlRef:'الشكل (7-3) ص 52',
 plant:revPlant,
 plcNote:'M0.0 بت داخلي يظهر في جدول المداخل والمخارج. F4 يصبح 1 عند الفصل (يدوياً أو عند ارتفاع التيار في المحاكاة).',
 steps:[
  {t:'الوضع الابتدائي',x:'كل المتممات مفصولة. ابدأ بنسخة «كما في الكتاب». لاحظ M0.0 = 1 في تبويب البرنامج (F4 سليم و S0 غير مضغوط).'},
  {t:'نجمة في الاتجاه الأول',x:'اضغط S1. يعمل K1 ثم K3 (Network 4 يشغّل النجمة تلقائياً مع أي اتجاه). المحرك يدور يميناً ⟳.',done:s=>s.Q('Q4.1')&&s.Q('Q4.3')},
  {t:'انتظر السرعة',x:'انتظر حتى تتجاوز السرعة 1300 rpm.',done:s=>s.Q('Q4.1')&&s.plant.n>1300},
  {t:'جرّب الدلتا مع K1',x:'اضغط S2 مطولاً. <b>كما في الكتاب:</b> تنفصل النجمة ولا يعمل K4 (الملفات مفتوحة) ثم ترجع النجمة عند رفع الإصبع. <b>المصحح:</b> يعمل K4 والمحرك دلتا.'},
  {t:'أوقف المحرك',x:'اضغط S0 وانتظر حتى يتوقف المحرك تقريباً.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&Math.abs(s.plant.n)<200},
  {t:'نجمة في الاتجاه المعاكس',x:'اضغط S3. يعمل K2 (تبديل L1 و L3) ثم K3، فيدور المحرك يساراً ⟲. جرّب الآن الضغط على S1: لا شيء، لأن K2 المغلق في Network 2 يمنعه.',done:s=>s.Q('Q4.2')&&s.Q('Q4.3')&&s.plant.n<-1300},
  {t:'الدلتا مع K2',x:'اضغط S2. <b>كما في الكتاب:</b> يعمل K4 لكن توصيل k4 يقصر الملف W، فيرتفع التيار ويفصل F4 بعد لحظات. <b>المصحح:</b> دلتا سليمة في الاتجاه المعاكس.',done:s=>s.Q('Q4.4')||s.plant.trip},
  {t:'قارن النسختين',x:'بدّل إلى النسخة الأخرى (أعلى الصفحة) وكرر الخطوات من 2 إلى 7.'},
  {t:'الإيقاف والحماية',x:'اضغط «فصل F4» أو S0: M0.0 = 0 فتفصل كل الشبكات.',done:s=>s.btn('F4')||s.btn('S0')}
 ],
 quiz:[
  {q:'كيف يعكس المتمم K2 اتجاه دوران المحرك في الشكل (6-3)؟',o:['بتبديل وجهين (L1 و L3)','بفصل وجه واحد','بتوصيل النجمة','بعكس قطبية F4'],c:0,e:'K2 يوصل L3 إلى U1 و L1 إلى W1، وتبديل أي وجهين يعكس اتجاه المجال الدوار.'},
  {q:'لماذا يوجد تلامس K2 المغلق في فرع K1 (Network 2: AN Q 4.2)؟',o:['للتعويض الذاتي','لمنع عمل الاتجاهين معاً (قصر بين الأوجه)','لتشغيل النجمة','لحماية المحرك من الحمل الزائد'],c:1,e:'لو عمل K1 و K2 معاً لحدث قصر بين L1 و L3.'},
  {q:'ما قيمة M0.0 عندما يكون F4 سليماً و S0 غير مضغوط؟',o:['0','1','تتغير مع S1','حسب الحالة السابقة'],c:1,e:'Network 1: AN I 0.0 ثم AN I 0.1 ثم = M 0.0.'},
  {q:'متى يعمل متمم النجمة K3 حسب Network 4؟',o:['عند الضغط على S3 فقط','عند عمل K1 أو K2، و S2 غير مضغوط، و K4 مفصول','عند عمل K4','دائماً'],c:1,e:'A M 0.0، A( O Q 4.1 O Q 4.2 )، AN I 1.2، AN Q 4.4.'},
  {q:'حسب برنامج الكتاب، المحرك يعمل نجمة مع K1 وضغطت S2. ماذا يحدث؟',o:['يتحول إلى دلتا','تنفصل النجمة ولا تعمل الدلتا لأن Network 5 يشترط Q4.2','يعكس الاتجاه','يفصل F4 فوراً'],c:1,e:'خطأ في Network 5: A Q 4.2 بدل (Q4.1 أو Q4.2).'},
  {q:'ما مشكلة توصيل k4 في الشكل (6-3)؟',o:['لا مشكلة','يصل W1 مع W2 فيُقصر الملف W','يقصر L1 مع L2','يمنع النجمة'],c:1,e:'الصحيح U1–W2 و V1–U2 و W1–V2 كما في الشكل (4-2).'},
  {q:'المحرك يدور يساراً (K2). كيف تجعله يدور يميناً؟',o:['اضغط S1 مباشرة','اضغط S0 أولاً ثم S1','اضغط S2','اضغط S3 مرة ثانية'],c:1,e:'تعشيق K1 و K2 يمنع التبديل المباشر؛ يجب الإيقاف أولاً.'},
  {q:'ما الخطأ الطباعي في Network 2 من STL ص 56؟',o:['A M 0.0 بدل AN','= O 4.1 بدل = Q 4.1','O I 1.3 بدل O I 1.1','لا يوجد خطأ'],c:1,e:'الحرف O بدل Q؛ بدونه لا يُكتب الخرج Q4.1 أبداً.'}
 ]
});

})(PLCBOOK);
