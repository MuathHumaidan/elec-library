/* Unit 10 — تشخيص أعطال الأجهزة العاملة مع الحاكم المنطقي المبرمج (ص 147–148) */
(function(B){
const {S,W,esc}=B;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());

/* ---------- the book's two lists (الوحدة 10، ص 147–148) ---------- */
const SWL=[['أ','عدم تحميل البرنامج على جهاز الحاسب بشكل صحيح.'],['ب','عدم الإلمام بالمكونات الأساسية للبرنامج.'],['ت','عدم تحديد أرقام المداخل والمخارج بشكل صحيح.'],
  ['ث','عدم تعريف المداخل أو المخارج التناظرية أو الرقمية بشكل صحيح.'],['ج','عدم تحديد اختيار المداخل أو المخارج التناظرية أو الرقمية بشكل صحيح.'],['ح','عدم اختيار نوع البلوك بشكل صحيح.']];
const HWL=[['أ','عدم توصيل التيار من المصدر إلى وحدة التحكم ( CPU ).'],['ب','تلف في وحدة ( CPU ).'],['ت','تلف في البطارية.'],['ث','تلف في وحدات الدخل أو الخرج التناظرية أو الرقمية (Modules ).'],
  ['ج','عدم تثبيت وحدات الدخل أو الخرج التناظرية أو الرقمية بشكل جيد في المنافذ الخاصة بها ( Bus Modules ).'],['ح','تلف في وحدة التخزين الخارجية.'],['خ','تلف في الضواغط ( قصر أو عدم توصيل ).'],
  ['د','تلف في ملفات المتممات.'],['ذ','تلف في المزمنات.'],['ر','انقطاع في الموصلات بين العناصر المراد التحكم فيها والمصدر.'],['ز','عدم توصيل المصدر الخاص بالعناصر المراد التحكم فيها.'],['س','انقطاع في المصهرات.']];
const listHTML=l=>'<ul style="list-style:none;padding-inline-start:0">'+l.map(([k,t])=>`<li><b>${k}-</b> ${t}</li>`).join('')+'</ul>';

/* ---------- training system (prepared by the simulation, not from the book) ---------- */
const IO10=[{sym:'S0',desc:'ضاغط الإيقاف (يعطي 1 عند الضغط، على اصطلاح الكتاب في الوحدات الأولى)',addr:'I0.1'},{sym:'S1',desc:'ضاغط التشغيل',addr:'I1.1'},
  {sym:'K1',desc:'متمم (كونتاكتور) المحرك',addr:'Q4.1'},{sym:'H1',desc:'لمبة «تشغيل مستقر» تضيء بعد 3 ث من تشغيل المحرك',addr:'Q4.2'}];
const NAMES10={'I0.1':'S0','I1.1':'S1','I1.2':'?','Q4.1':'K1','Q4.2':'H1'};
const N1={title:'Network 1 — K1 تشغيل المحرك مع الإمساك الذاتي',stl:['A(','O I 1.1','O Q 4.1',')','AN I 0.1','= Q 4.1']};
const N2={title:'Network 2 — T1 تأخير 3 ث بعد تشغيل K1',stl:['A Q 4.1','L S5T#3S','SD T 1']};
const N3={title:'Network 3 — H1 لمبة التشغيل المستقر',stl:['A T 1','= Q 4.2']};
const PROGS={
  ok:[N1,N2,N3], none:[N1,N2,N3], partial:[N1],
  hold:[{title:N1.title,stl:['A I 1.1','AN I 0.1','= Q 4.1']},N2,N3],
  addr:[{title:N1.title,stl:['A(','O I 1.2','O Q 4.1',')','AN I 0.1','= Q 4.1']},N2,N3]};
const NOTE_SIM='<b>تنبيه مهم:</b> الكتاب يذكر قائمتي الأعطال فقط، ولا يقدّم أعراضاً ولا مؤشرات LED ولا جدول «عَرَض ← سبب ← علاج». النظام الصغير في هذا المختبر، وكل سيناريو عطل وأعراضه وقراءات جهاز القياس ورسائل التشخيص، <b>من إعداد المحاكاة وليست من الكتاب</b>؛ الذي من الكتاب هو بند العطل ونصه ورقم صفحته فقط.';

const F0={prog:'ok',ps:1,cpu:1,mem:1,batf:0,sf:0,di:'ok',dout:'ok',s1:'ok',s0:'ok',supply:1,fuse:1,wire:1,coil:1,diag:'',hwcfg:''};
const FAULTS=[
 {id:'sw-load',cat:'sw',item:'أ',name:'لم يُحمَّل البرنامج كاملاً إلى الـ CPU',complaint:'المحرك يعمل ويقف طبيعياً، لكن لمبة التشغيل H1 لا تضيء أبداً.',prog:'partial',
  explain:'البرنامج على الحاسب فيه 3 Networks، لكن الموجود في الـ CPU Network واحدة فقط، فلا يوجد في الـ CPU مزمن ولا لمبة. هذا البند أ: «عدم تحميل البرنامج … بشكل صحيح». العلاج: إعادة تحميل البرنامج كاملاً إلى الـ CPU ثم اختباره.'},
 {id:'sw-hold',cat:'sw',item:'ب',name:'نقص الإمساك الذاتي في Network 1',complaint:'المحرك يعمل ما دام S1 مضغوطاً فقط، ويقف بمجرد رفع الإصبع.',prog:'hold',
  explain:'في Network 1 لا يوجد التلامس Q 4.1 بالتوازي مع S1، فلا إمساك ذاتي. اعتبرناه مثالاً على البند ب «عدم الإلمام بالمكونات الأساسية للبرنامج» (الربط بالبند من اجتهاد المحاكاة). العلاج: إضافة O Q 4.1 داخل القوس.'},
 {id:'sw-addr',cat:'sw',item:'ت',name:'عنوان مدخل خاطئ في البرنامج (I1.2 بدل I1.1)',complaint:'عند الضغط على S1 لا يعمل المحرك.',prog:'addr',
  explain:'مؤشر المدخل I1.1 يضيء عند الضغط على S1 (الضاغط والسلك والوحدة سليمة)، لكن البرنامج يقرأ I 1.2. هذا البند ت: «عدم تحديد أرقام المداخل والمخارج بشكل صحيح». العلاج: تصحيح العنوان في البرنامج إلى I 1.1.'},
 {id:'sw-cfg',cat:'sw',item:'ث',name:'وحدة الخرج معرّفة بعناوين غير التي في البرنامج',complaint:'لا يعمل المحرك ولا اللمبة، مع أن البرنامج يبدو يعمل.',dout:'cfg',hwcfg:'الخانة 4: DI 16 — I0.0…I1.7 · الخانة 5: DO 16 — <b>Q8.0…Q9.7</b>',
  explain:'حالة البرنامج تُظهر Q4.1 = 1، لكن مؤشرات وحدة الخرج مطفأة: الوحدة عُرّفت في الإعداد بالعناوين Q8.0…Q9.7 والبرنامج يكتب في Q4. هذا البند ث: «عدم تعريف المداخل أو المخارج … بشكل صحيح». العلاج: تصحيح التعريف (أو العناوين) ثم التحميل.'},
 {id:'sw-type',cat:'sw',item:'ج',name:'اختيار وحدة تناظرية بدل الرقمية في الإعداد',complaint:'المحرك لا يعمل عند الضغط على S1، ومؤشر SF على الـ CPU مضاء.',di:'cfg',sf:1,
  diag:'الوحدة في الخانة 4: النوع المختار في الإعداد «دخل تناظري AI» لا يطابق الوحدة الموجودة «دخل رقمي DI».',hwcfg:'الخانة 4: <b>AI 8 (تناظري)</b> · الخانة 5: DO 16 — Q4.0…Q5.7',
  explain:'مؤشرات وحدة الدخل تضيء مع الضواغط، لكن البرنامج يرى 0، ومخزن التشخيص يقول إن نوع الوحدة في الإعداد تناظري. هذا البند ج: «عدم تحديد اختيار المداخل أو المخارج التناظرية أو الرقمية بشكل صحيح». العلاج: اختيار الوحدة الرقمية الصحيحة في الإعداد ثم التحميل.'},
 {id:'sw-block',cat:'sw',item:'ح',name:'البرنامج في بلوك FC غير مستدعى',complaint:'لا يحدث شيء عند الضغط على S1، والـ CPU على RUN بلا أي خطأ.',prog:'none',
  explain:'البرنامج كُتب في بلوك من نوع FC1 ولم يُستدعَ من OB1، فلا يُنفّذ أبداً. هذا البند ح: «عدم اختيار نوع البلوك بشكل صحيح». <b>توضيح (ليس من الكتاب):</b> OB1 هو البلوك الذي تنفّذه الـ CPU دورياً؛ أي برنامج في FC أو FB يجب أن يُستدعى منه.'},
 {id:'hw-ps',cat:'hw',item:'أ',name:'لا تصل التغذية إلى الـ CPU',complaint:'لوحة الـ PLC مطفأة كلها: لا مؤشرات ولا يعمل شيء، والحاسب لا يتصل.',ps:0,
  explain:'جهاز القياس يعطي 0 V عند مدخل تغذية الـ CPU، وكل المؤشرات مطفأة. هذا البند أ: «عدم توصيل التيار من المصدر إلى وحدة التحكم ( CPU )». العلاج: فحص مصدر التغذية ومفتاحه وأسلاكه.'},
 {id:'hw-cpu',cat:'hw',item:'ب',name:'تلف في وحدة CPU',complaint:'الـ CPU لا تدخل في RUN، ومؤشرا SF و STOP مضاءان، والحاسب لا يتصل بها.',cpu:0,
  explain:'التغذية سليمة (24 v عند الـ CPU)، ومفتاح الوضع على RUN، والوحدات مثبتة، ومع ذلك لا تعمل الـ CPU ولا تتصل بالحاسب. هذا البند ب: «تلف في وحدة ( CPU )». <b>توضيح:</b> قبل الحكم بالتلف تأكد دائماً من التغذية ومن أن مفتاح الوضع على RUN.'},
 {id:'hw-bat',cat:'hw',item:'ت',name:'تلف البطارية (فُقد البرنامج)',complaint:'بعد انقطاع الكهرباء ليلاً وعودتها لا يعمل النظام، والـ CPU على STOP.',mem:0,batf:1,diag:'فُقد محتوى الذاكرة بعد انقطاع التغذية — خطأ في البطارية الاحتياطية (BATF).',
  explain:'مؤشر BATF مضاء وذاكرة الـ CPU فارغة بعد انقطاع التغذية. هذا البند ت: «تلف في البطارية». العلاج: تغيير البطارية ثم إعادة تحميل البرنامج.'},
 {id:'hw-module',cat:'hw',item:'ث',name:'تلف وحدة الدخل الرقمي',complaint:'النظام لا يستجيب لأي ضاغط، ومؤشر SF مضاء.',di:'dead',sf:1,diag:'عطل في الوحدة بالخانة 4 (دخل رقمي DI).',
  explain:'عند الضغط على S1 يقيس الجهاز 24 v على طرف المدخل، لكن مؤشر المدخل لا يضيء والبرنامج لا يرى شيئاً، والوحدة مثبتة جيداً. هذا البند ث: «تلف في وحدات الدخل أو الخرج … (Modules)». العلاج: تغيير الوحدة.'},
 {id:'hw-seat',cat:'hw',item:'ج',name:'وحدة الدخل غير مثبتة على الـ Bus',complaint:'النظام لا يستجيب لأي ضاغط، ومؤشر SF مضاء.',di:'loose',sf:1,diag:'الوحدة في الخانة 4 غير موجودة أو لا تستجيب.',
  explain:'الفحص بالنظر يُظهر وحدة الدخل بارزة عن مكانها، والـ CPU لا تجدها. هذا البند ج: «عدم تثبيت وحدات الدخل أو الخرج … بشكل جيد في المنافذ الخاصة بها ( Bus Modules )». العلاج: فصل التغذية وتثبيت الوحدة جيداً.'},
 {id:'hw-btn1',cat:'hw',item:'خ',name:'الضاغط S1 لا يوصّل (عدم توصيل)',complaint:'الضغط على S1 لا يشغّل المحرك.',s1:'open',
  explain:'مصدر 24 v للضواغط سليم، لكن عند الضغط على S1 يبقى طرف المدخل I1.1 على 0 V ولا يضيء مؤشره. هذا البند خ: «تلف في الضواغط ( … عدم توصيل )». العلاج: تغيير الضاغط.'},
 {id:'hw-btn0',cat:'hw',item:'خ',name:'الضاغط S0 في حالة قصر',complaint:'المحرك لا يعمل أبداً مهما ضغطت S1.',s0:'short',
  explain:'مؤشر المدخل I0.1 (S0) مضاء دائماً دون ضغط، ويقيس الجهاز 24 v عليه، فالبرنامج يرى «إيقاف» باستمرار (AN I 0.1). هذا البند خ: «تلف في الضواغط ( قصر … )». العلاج: تغيير الضاغط.'},
 {id:'hw-coil',cat:'hw',item:'د',name:'ملف المتمم K1 مقطوع',complaint:'عند الضغط على S1 لا يدور المحرك، لكن لمبة H1 تضيء بعد 3 ث.',coil:0,
  explain:'مؤشر Q4.1 مضاء، والجهد 24 v واصل إلى طرفي ملف K1، لكن المتمم لا يجذب، ومقاومة الملف ∞. هذا البند د: «تلف في ملفات المتممات». العلاج: تغيير ملف المتمم أو المتمم.'},
 {id:'hw-wire',cat:'hw',item:'ر',name:'سلك مقطوع بين Q4.1 وملف K1',complaint:'عند الضغط على S1 لا يدور المحرك، لكن لمبة H1 تضيء بعد 3 ث.',wire:0,
  explain:'الجهد 24 v موجود على طرف المخرج Q4.1، لكنه 0 V على طرفي ملف K1، ومقاومة الملف سليمة. إذن الانقطاع في السلك بينهما. هذا البند ر: «انقطاع في الموصلات بين العناصر المراد التحكم فيها والمصدر». العلاج: تتبع السلك وإصلاحه.'},
 {id:'hw-supply',cat:'hw',item:'ز',name:'مصدر الأحمال 24 v غير موصّل',complaint:'لا يعمل المحرك ولا تضيء اللمبة، مع أن مؤشرات وحدة الخرج تضيء.',supply:0,
  explain:'مؤشرات Q4.1 و Q4.2 تضيء، لكن مصدر الأحمال نفسه 0 V قبل المصهر. هذا البند ز: «عدم توصيل المصدر الخاص بالعناصر المراد التحكم فيها». العلاج: تشغيل/توصيل مصدر الأحمال.'},
 {id:'hw-fuse',cat:'hw',item:'س',name:'مصهر دائرة الخرج منقطع',complaint:'لا يعمل المحرك ولا تضيء اللمبة، مع أن مؤشرات وحدة الخرج تضيء.',fuse:0,
  explain:'مصدر الأحمال 24 v قبل المصهر، و 0 V بعده. هذا البند س: «انقطاع في المصهرات». العلاج: معرفة سبب انقطاع المصهر ثم تغييره.'}
];

/* ---------- meter points ---------- */
const POINTS=[
 ['cpu','جهد التغذية عند مدخل وحدة الـ CPU'],['isup','مصدر 24 v الخاص بالضواغط'],['i11','بين طرف المدخل I1.1 و M (اضغط S1 أثناء القياس)'],['i01','بين طرف المدخل I0.1 و M'],
 ['lsup','مصدر الأحمال 24 v — قبل المصهر F'],['lfuse','بعد المصهر F (طرف L+ لوحدة الخرج)'],['q41','بين طرف المخرج Q4.1 و M'],['coilv','على طرفي ملف K1'],
 ['coilr','مقاومة ملف K1 (والتغذية مفصولة)'],['look','فحص بالنظر للوحدات على الـ Rack'],['diag','مخزن التشخيص في الـ CPU (من الحاسب)'],['hwcfg','جدول تعريف الوحدات المحمّل (Hardware Config)']];

function rackSVG(m,f){
  const led=(x,y,on,col,lbl)=>`<circle cx="${x}" cy="${y}" r="5" fill="${on?col:'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1"/>`+S.t(x+9,y+4,lbl,'m','start');
  const G='var(--on)',R='var(--stop)',Y='#e0b020';
  let o=`<svg viewBox="0 0 560 270" role="img" aria-label="لوحة الـ PLC والأحمال">`;
  o+=`<rect x="6" y="8" width="332" height="170" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>`+S.t(172,196,'S7 RACK','m');
  const mod=(x,w,t,dy)=>`<rect x="${x}" y="${16+dy}" width="${w}" height="152" rx="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"${dy?' transform="rotate(-4 '+(x+w/2)+' 90)"':''}/>`+S.t(x+w/2,34+dy,t);
  o+=mod(12,60,'PS',0)+led(24,60,m.ps,G,'24V');
  o+=mod(78,86,'CPU',0)+led(90,56,m.SF,R,'SF')+led(90,76,m.BATF,R,'BATF')+led(90,96,m.RUN,G,'RUN')+led(90,116,m.STOP,Y,'STOP');
  o+=`<rect x="92" y="134" width="58" height="22" rx="3" fill="var(--surface-2)" stroke="var(--fg)"/>`+S.t(121,149,'RUN ▸','m');
  const dy=f.di==='loose'?-14:0;o+=`<g>${mod(170,80,'DI',dy)}`+led(184,62+dy,m.led.I01,G,'I0.1')+led(184,84+dy,m.led.I11,G,'I1.1')+led(184,106+dy,m.led.I12,G,'I1.2')+`</g>`;
  o+=mod(256,76,'DO',0)+led(270,62,m.led.Q41,G,'Q4.1')+led(270,84,m.led.Q42,G,'Q4.2');
  // field (wires drawn neutral on purpose: the trainee has to measure)
  o+=`<rect x="352" y="14" width="70" height="26" rx="4" fill="var(--surface-2)" stroke="var(--fg)"/>`+S.t(387,31,'L+ 24V');
  o+=S.w('M422 27H440V44')+S.fuse(440,44,'')+S.t(452,60,'F','','start')+S.w('M440 68V84H332')+S.t(352,80,'L+ (DO)','m','start');
  o+=S.w('M332 62H470V100')+S.coil(470,100,'K1',m.K1)+S.w('M470 122V140');
  o+=S.w('M332 84H360V118')+W.lamp(360,130,10,m.H1,'#f2c230')+S.t(360,158,'H1','','middle');
  o+=S.mech(486,520,111)+S.w('M520 100V200')+S.t(528,150,'K1','m','start');
  o+=`<g><circle cx="470" cy="224" r="28" class="coil ${m.motor?'on':''}"/><g id="u10rot" transform="rotate(${(m.ang||0).toFixed(1)} 470 224)"><path d="M470 204V244M450 224H490" stroke="var(--blue)" stroke-width="4" stroke-linecap="round"/></g>`+S.t(470,228,'M','')+`</g>`+S.w('M498 224H520V200');
  o+=S.w('M20 232H200','')+S.t(20,224,'S0 → I0.1 · S1 → I1.1','m','start');
  return o+'</svg>';
}

function lab10(el){
  let f=null,fault=null,filter='all',answered=false,score=[0,0],last='',btn={S0:0,S1:0},P=null,progKey='',ang=0,lastSig='',point='i11';
  const q=s=>el.querySelector(s);
  el.innerHTML=`<div class="callout err">${NOTE_SIM}</div>
   <div class="panel" style="margin-top:12px"><div class="viewseg" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
     <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><button class="btn primary" id="u10new">عطل جديد عشوائي</button>
      <div class="seg" role="group" id="u10flt"><button data-f="all" aria-pressed="true">من القائمتين</button><button data-f="sw" aria-pressed="false">أعطال البرمجة</button><button data-f="hw" aria-pressed="false">أعطال المكونات</button></div>
      <button class="btn" id="u10ok">النظام السليم (للمقارنة)</button></div>
     <span class="score" id="u10score">0 / 0</span></div>
     <div class="callout" id="u10cmp" style="margin-top:10px"></div></div>
   <div class="grid">
    <div class="panel c7"><h2>اللوحة والجهاز <small>شغّل النظام وراقب المؤشرات</small></h2><div class="svgbox" id="u10rack"></div>
      <div style="display:flex;gap:18px;justify-content:center;margin-top:8px"><button class="pb green" data-pb="S1" aria-label="تشغيل S1"><span class="cap">S1</span><small>تشغيل</small></button><button class="pb red" data-pb="S0" aria-label="إيقاف S0"><span class="cap">S0</span><small>إيقاف</small></button></div></div>
    <div class="panel c5"><h2>جهاز القياس والتشخيص</h2><label class="sub" for="u10pt">نقطة القياس:</label>
      <select id="u10pt" style="width:100%;font:inherit;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg)">${POINTS.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('')}</select>
      <div id="u10meter" style="margin-top:10px;background:var(--surface-2);border-radius:10px;padding:12px;min-height:64px;font-size:15px"></div>
      <p class="sub">القراءة تتغير لحظياً مع الضغط على الضواغط.</p></div>
    <div class="panel c7"><h2>حالة البرنامج في الـ CPU <small>Program Status</small></h2><div id="u10prog"></div></div>
    <div class="panel c5"><h2>ما سبب العطل؟ <small>اختر البند من قائمتي الكتاب</small></h2><div id="u10ans"></div></div></div>`;
  function newFault(kind){answered=false;
    if(kind&&typeof kind==='object'){fault=kind}else if(kind==='ok'){fault=null}else{const pool=FAULTS.filter(x=>(filter==='all'||x.cat===filter)&&x.id!==last);fault=pool[Math.floor(Math.random()*pool.length)];last=fault.id}
    f=Object.assign({},F0,fault||{});btn={S0:0,S1:0};progKey='';ang=0;lastSig='';
    q('#u10cmp').innerHTML=fault?`<b>شكوى المشغّل:</b> ${fault.complaint} <span class="sub">— شغّل النظام، راقب المؤشرات وحالة البرنامج، وقِس، ثم اختر السبب.</span>`:'<b>النظام السليم:</b> لا يوجد عطل. اضغط S1: يعمل K1 ويدور المحرك، وبعد 3 ث تضيء H1. اضغط S0 للإيقاف. تعرّف على المؤشرات والقراءات السليمة لتقارن بها.';
    renderAns();}
  function model(){
    const run=f.ps&&f.cpu&&f.mem;
    const t11=btn.S1&&f.s1!=='open'?24:0,t01=(btn.S0||f.s0==='short')?24:0;
    const diLed=v=>f.ps&&v>0&&(f.di==='ok'||f.di==='cfg');
    const img=v=>run&&f.di==='ok'&&v>0?1:0;
    const key=run?f.prog:'stop';if(key!==progKey){progKey=key;P=B.createPLC(PROGS[f.prog==='none'||!run?'ok':f.prog])}
    const exec=run&&f.prog!=='none';
    if(exec){P.set('I1.1',img(t11));P.set('I0.1',img(t01));P.set('I1.2',0);P.scan(1/60)}
    const Q=a=>exec?P.get(a):0;
    const do41=Q('Q4.1')&&f.dout==='ok',do42=Q('Q4.2')&&f.dout==='ok';
    const lf=f.supply&&f.fuse?24:0;const q41=do41&&lf?24:0,coilV=q41&&f.wire?24:0,K1=coilV&&f.coil?1:0;
    return {run,exec,ps:f.ps,RUN:run,STOP:f.ps&&!run,SF:f.ps&&(!f.cpu||f.sf),BATF:f.ps&&f.batf,t11,t01,lf,q41,coilV,K1,H1:do42&&lf?1:0,motor:K1,
      led:{I11:diLed(t11),I01:diLed(t01),I12:0,Q41:do41,Q42:do42}};
  }
  function meter(m){const V=v=>`<b class="mono" style="font-size:22px">${v.toFixed(1)} V</b>`;
    switch(point){case 'cpu':return V(f.ps?24.1:0);case 'isup':return V(24);case 'i11':return V(m.t11);case 'i01':return V(m.t01);
      case 'lsup':return V(f.supply?24:0);case 'lfuse':return V(m.lf);case 'q41':return V(m.q41);case 'coilv':return V(m.coilV);
      case 'coilr':return `<b class="mono" style="font-size:22px">${f.coil?'≈ 380 Ω':'∞ (OL)'}</b>`;
      case 'look':return f.di==='loose'?'وحدة الدخل الرقمي (الخانة 4) بارزة عن مكانها وغير مثبتة على الـ Bus.':'كل الوحدات مثبتة في أماكنها، ومفتاح الوضع في الـ CPU على RUN.';
      case 'diag':return !f.ps?'لا يوجد اتصال بالـ CPU.':!f.cpu?'تعذّر الاتصال: الـ CPU لا تستجيب.':(f.diag||'لا توجد رسائل خطأ.');
      case 'hwcfg':return !f.ps?'لا يوجد اتصال بالـ CPU.':!f.cpu?'تعذّر القراءة.':(f.hwcfg||'الخانة 4: DI 16 — I0.0…I1.7 · الخانة 5: DO 16 — Q4.0…Q5.7');}return ''}
  function progHTML(m){
    if(!f.ps)return '<p class="sub">لا يوجد اتصال بالـ CPU (لا تغذية).</p>';if(!f.cpu)return '<p class="sub">الحاسب لا يستطيع الاتصال بالـ CPU.</p>';
    if(!f.mem)return '<p class="sub">ذاكرة الـ CPU فارغة — لا يوجد برنامج. (الـ CPU على STOP)</p>';
    let head='',nets=P.nets;
    if(f.prog==='none')head='<p><b>البلوكات في الـ CPU:</b> <span class="ltr">OB1</span> (فارغ) · <span class="ltr">FC1</span> (3 Networks) — FC1 غير مستدعى من OB1.</p><p class="sub">محتوى FC1 (لا يُنفَّذ):</p>';
    else if(f.prog==='partial')head='<p><b>على الحاسب:</b> <span class="ltr">OB1</span> = 3 Networks · <b>في الـ CPU:</b> <span class="ltr">OB1</span> = 1 Network.</p>';
    else head='<p><b>البلوكات في الـ CPU:</b> <span class="ltr">OB1</span> (3 Networks) — يُنفَّذ دورياً.</p>';
    return head+nets.map(n=>`<div class="net"><header><h3>${n.title}</h3></header><div class="svgbox fixed">${B.ladNetwork(n,P,NAMES10)}</div></div>`).join('');
  }
  function renderAns(){
    const grp=(t,l,cat)=>`<h3 class="sm">${t}</h3><div class="opts" style="display:grid;gap:6px">${l.map(([k,x])=>{let c='';if(answered&&fault){if(fault.cat===cat&&fault.item===k)c='right';else if(answered===cat+k)c='wrong'}
      return `<button class="opt ${c}" data-ans="${cat}${k}" ${answered||!fault?'disabled':''}><b>${k}-</b> ${x}</button>`}).join('')}</div>`;
    let h='';
    if(answered&&fault){const ok=answered===fault.cat+fault.item;
      h+=`<div class="callout ${ok?'':'err'}" style="margin-bottom:10px">${ok?'<b>إجابة صحيحة.</b>':'<b>ليست هذه.</b>'} العطل المحقون: <b>${fault.name}</b>.<br>${fault.explain}<br><span class="ref">المرجع: الوحدة العاشرة، ص ${fault.cat==='sw'?'147 — أولاً: أعطال نتيجة البرمجة':'148 — ثانياً: أعطال في المكونات الصلبة'}، البند ${fault.item}</span></div>
        <button class="btn primary" data-again>عطل جديد</button>`}
    else if(!fault)h+='<p class="sub">اضغط «عطل جديد عشوائي» لبدء التمرين.</p>';
    h+=grp('أولاً: أعطال نتيجة البرمجة (Software) — ص 147',SWL,'sw')+grp('ثانياً: أعطال في المكونات الصلبة (Hardware) — ص 148',HWL,'hw');
    q('#u10ans').innerHTML=h;
    el.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>{if(answered||!fault)return;answered=b.dataset.ans;score[1]++;if(answered===fault.cat+fault.item)score[0]++;q('#u10score').textContent=score[0]+' / '+score[1];renderAns()});
    const ag=el.querySelector('[data-again]');if(ag)ag.onclick=()=>newFault();
  }
  q('#u10new').onclick=()=>newFault();q('#u10ok').onclick=()=>newFault('ok');
  el.querySelectorAll('#u10flt [data-f]').forEach(b=>b.onclick=()=>{filter=b.dataset.f;el.querySelectorAll('#u10flt [data-f]').forEach(x=>x.setAttribute('aria-pressed',x===b));newFault()});
  q('#u10pt').value=point;q('#u10pt').onchange=e=>{point=e.target.value};
  el.querySelectorAll('[data-pb]').forEach(b=>{const k=b.dataset.pb;const dn=e=>{e&&e.preventDefault();btn[k]=1;b.classList.add('down')};const up=()=>{btn[k]=0;b.classList.remove('down')};
    b.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,up));
    b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)dn(e)});b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')up()})});
  /* وضع التحدي: العطل المخفي من قائمة المختبر نفسها (معرّفه في challenge.js x) */
  {const cf=chOn()&&FAULTS.find(x=>chF(x.id));if(cf)newFault(cf);else newFault('ok')}
  let tPrev=performance.now();
  function loop(now){if(!document.body.contains(el))return;const dt=Math.min(0.05,(now-tPrev)/1000);tPrev=now;
    const m=model();if(m.motor)ang=(ang+dt*600)%360;m.ang=ang;
    const sig=JSON.stringify([m.led,m.RUN,m.STOP,m.SF,m.BATF,m.K1,m.H1,f.di,P&&P.mem,P&&P.tim.T1&&[P.tim.T1.q,P.tim.T1.run]]);
    if(sig!==lastSig){lastSig=sig;q('#u10rack').innerHTML=rackSVG(m,f);q('#u10prog').innerHTML=progHTML(m)}
    else if(m.motor){const r=el.querySelector('#u10rot');if(r)r.setAttribute('transform',`rotate(${ang.toFixed(1)} 470 224)`)}
    q('#u10meter').innerHTML=meter(m);
    requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
}

/* =================== Lesson 10.1 =================== */
B.lesson({
 id:'u10-l1',unit:10,order:1,pages:'147–148',
 title:'تشخيص أعطال الأجهزة العاملة مع الحاكم المنطقي المبرمج',
 summary:'شكلا الأعطال في أنظمة الـ PLC: أعطال البرمجة (Software) وأعطال المكونات الصلبة (Hardware)، مع مختبر لتشخيص عطل يُحقن عشوائياً في نظام صغير.',
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

  {st:1,short:'شكلا الأعطال',title:'تشخيص أعطال الأجهزة العاملة مع الحاكم المنطقي المبرمج',ref:'الوحدة 10، ص 147',
   q:'المصعد لم يتحرك… هل المشكلة في البرنامج الذي كتبته، أم في جهاز أو سلك في اللوحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكلا الأعطال: أعطال البرمجة على الحاسب وأعطال المكونات في وحدة الـ PLC" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="أعطال في البرمجة ⟦(Software)⟧: في البرنامج نفسه أو في طريقة تحميله وإعداده، ويعالجها المبرمج."><rect x="196" y="66" width="128" height="96" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="206" y="76" width="108" height="66" fill="#2C4A40"/><rect x="214" y="84" width="60" height="6" rx="3" fill="#F2C14E"/><rect x="214" y="98" width="80" height="6" rx="3" fill="#4FB3A9"/><rect x="214" y="112" width="44" height="6" rx="3" fill="#E8735A"/><rect x="214" y="126" width="70" height="6" rx="3" fill="#4FB3A9"/><path d="M244 162V176M226 178H294" stroke="#2C4A40" stroke-width="3"/></g><text x="260" y="206" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">أعطال البرمجة</text><text x="260" y="228" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">Software</text><g data-tip="أعطال في المكونات ⟦(Hardware)⟧: في الأجهزة والأسلاك والمصادر — وهي الأكثر شيوعاً."><rect x="40" y="66" width="128" height="110" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="50" y="76" width="24" height="90" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><rect x="79" y="76" width="24" height="90" rx="3" fill="#2C4A40" stroke="#2C4A40" stroke-width="1.5"/><rect x="108" y="76" width="24" height="90" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><rect x="137" y="76" width="24" height="90" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><path d="M62 176V196M120 176V200M150 176V192" stroke="#2C4A40" stroke-width="2.5"/></g><text x="104" y="222" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">أعطال المكونات</text><text x="104" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">Hardware</text><text x="180" y="286" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">شكلان من الأعطال</text></svg>`,
   cap:'كل عطل يقع في واحد من مكانين: البرنامج، أو المكونات.<br><b>مرّر المؤشر على الحاسب واللوحة (أو المسهما في الجوال) لتعرف معنى كل شكل.</b>',
   side:[
    {book:String.raw`<p>يوجد شكلان من الأعطال التي تواجه الفني أثناء العمل في مجال التحكم المنطقي المبرمج وهي:</p><ol><li>أعطال في البرمجة (Software)</li><li>أعطال في المكونات (Hardware).</li></ol>`,ref:'الوحدة 10، ص 147'}
   ],
   body:[
    {tip:String.raw`<p>قبل أن تمسك أي أداة اسأل نفسك: هل <b>البرنامج</b> صحيح ومحمّل كما يجب؟ أم أن <b>جهازاً أو سلكاً</b> في اللوحة لا يعمل؟ هذا السؤال وحده يقسم البحث إلى نصفين، والقائمتان في المحطتين القادمتين تساعدانك على إكمال البحث داخل كل نصف.</p>`,title:'لماذا نقسم الأعطال؟'},
    {predict:{q:'كتب المبرمج عنوان ضاغط التشغيل خطأ في البرنامج. من أي الشكلين هذا العطل؟',opts:[
     ['أعطال المكونات (Hardware)',false,'الضاغط نفسه سليم وموصول؛ الخطأ في البرنامج المكتوب.'],
     ['أعطال البرمجة (Software)',true,'«عدم تحديد أرقام المداخل والمخارج بشكل صحيح» من قائمة أعطال البرمجة (ص 147).'],
     ['ليس عطلاً',false,'الجهاز لن يعمل كما يجب، فهو عطل يجب تشخيصه.']]}},
    {watch:String.raw`<p>صفحتا هذه الوحدة مرقّمتان في الكتاب 147 و 148، وهما نفس رقمي صفحتين من الوحدة التاسعة (التي تمتد حتى 158). لذلك نكتب «الوحدة 10، ص 147». كما أن الوحدة لا تبدأ بصفحة الجدارة والأهداف والوقت كبقية الوحدات.</p>`,fix:true},
    {title:'مختبر مصغّر: برمجة أم مكونات؟',widget:(el,B)=>DCML.sort(el,B,{intro:'أعطال من نظام التدريب في تبويب «المختبر» (أمثلة من إعداد المحاكاة، ليست من الكتاب). اختر الشكل الذي ينتمي إليه كل عطل.',cats:['أعطال في البرمجة (Software)','أعطال في المكونات (Hardware)'],
 items:['sw-addr','hw-coil','sw-hold','hw-fuse','sw-load','hw-btn1'].map(id=>FAULTS.find(f=>f.id===id)).map(f=>[f.name.replace(/\b([IQ]\d\.\d|K1|S1|S0|CPU|Network 1)\b/g,'<span class="ltr">$1</span>'),f.cat==='sw'?0:1,`هذا البند <b>${f.item}</b> من قائمة ${f.cat==='sw'?'أعطال البرمجة (ص 147)':'أعطال المكونات (ص 148)'}.`])})}
   ]},

  {st:2,short:'أعطال البرمجة',title:'أولاً: أعطال نتيجة البرمجة',ref:'الوحدة 10، ص 147',
   q:'البرنامج يبدو صحيحاً على الشاشة… فلماذا لا يعمل الجهاز كما توقعت؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أماكن أعطال البرمجة: البرنامج على الحاسب، وتحميله إلى CPU، والبلوك، وتعريف وحدات الدخل والخرج، وأرقام العناوين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="البرنامج على الحاسب. البند ⟦ب⟧: عدم الإلمام بالمكونات الأساسية للبرنامج (مثل نسيان الإمساك الذاتي)."><rect x="226" y="60" width="104" height="80" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="236" y="70" width="84" height="54" fill="#2C4A40"/><text x="278" y="92" text-anchor="middle" font-size="10" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">A I 1.1</text><text x="278" y="110" text-anchor="middle" font-size="10" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">= Q 4.1</text><path d="M260 140V152M244 154H312" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="تحميل البرنامج إلى وحدة ⟦CPU⟧. البند ⟦أ⟧: عدم تحميل البرنامج بشكل صحيح."><rect x="140" y="80" width="80" height="34" fill="transparent"/><path d="M218 98H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="142,98 154,92 154,104" fill="#E8735A"/></g><g data-tip="وحدة ⟦CPU⟧ والبلوك الذي ينفذه. البند ⟦ح⟧: عدم اختيار نوع البلوك بشكل صحيح."><rect x="50" y="60" width="86" height="80" rx="8" fill="#2C4A40"/><text x="93" y="92" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">CPU</text><rect x="66" y="104" width="54" height="24" rx="4" fill="#F2C14E"/><text x="93" y="121" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">OB1</text></g><g data-tip="المداخل والمخارج التناظرية أو الرقمية. البندان ⟦ث⟧ و ⟦ج⟧: عدم تعريفها أو عدم تحديد اختيارها بشكل صحيح."><rect x="50" y="172" width="120" height="74" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="110" y="196" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">وحدات الدخل والخرج</text><rect x="62" y="208" width="46" height="26" rx="4" fill="#4FB3A9"/><text x="85" y="226" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700">رقمية</text><rect x="114" y="208" width="46" height="26" rx="4" fill="#E6E2F8" stroke="#2C4A40"/><text x="137" y="226" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700">تناظرية</text></g><g data-tip="أرقام المداخل والمخارج. البند ⟦ت⟧: عدم تحديدها بشكل صحيح (مثل كتابة عنوان ضاغط آخر)."><rect x="196" y="172" width="120" height="74" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="256" y="196" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">أرقام العناوين</text><text x="256" y="226" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I ?.?   Q ?.?</text></g><text x="180" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">أين يقع كل بند؟</text></svg>`,
   cap:'أعطال البرمجة تقع بين الحاسب ووحدة <span class="ltr">CPU</span> وإعدادات وحدات الدخل والخرج.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف البند الذي يقابله.</b>',
   side:[
    {book:String.raw`<p>وهي غالباً ما تكون نتيجة:</p>`+listHTML(SWL),ref:'الوحدة 10، ص 147'}
   ],
   body:[
    {book:String.raw`<p>جميع هذه الأعطال تتم معالجتها من قبل المبرمج بشكل مباشر، وذلك بعد تحميل البرنامج من جهاز الحاسب إلى وحدة ( CPU ) واختبار البرنامج قبل توصيل العناصر المراد التحكم فيها.</p>`,ref:'الوحدة 10، ص 147'},
    {tip:String.raw`<ul><li><b>أ:</b> جزء من البرنامج لم يصل إلى الـ <span class="ltr">CPU</span>، أو حُمِّلت نسخة قديمة.</li><li><b>ب:</b> نسيان الإمساك الذاتي، أو الخلط بين مزمن تأخير التشغيل وتأخير الفصل.</li><li><b>ت:</b> كتابة <span class="ltr">I1.2</span> بدل <span class="ltr">I1.1</span>، أو <span class="ltr">Q4.2</span> بدل <span class="ltr">Q4.1</span>.</li><li><b>ث و ج:</b> تعريف وحدة الدخل أو الخرج بعناوين أو بنوع (تناظري/رقمي) لا يطابق الوحدة المركبة فعلاً.</li><li><b>ح:</b> كتابة البرنامج في بلوك لا تنفذه الـ <span class="ltr">CPU</span> (مثل <span class="ltr">FC</span> غير مستدعى من <span class="ltr">OB1</span>).</li></ul>`,title:'أمثلة على كل بند'},
    {predict:{q:'متى يختبر المبرمج البرنامج حسب الكتاب؟',opts:[
     ['بعد توصيل كل الأحمال وتشغيلها',false,'الكتاب يطلب الاختبار «قبل توصيل العناصر المراد التحكم فيها».'],
     ['قبل تحميله إلى وحدة CPU',false,'لا يمكن اختبار البرنامج على الـ PLC قبل تحميله إليها.'],
     ['بعد تحميله إلى وحدة CPU وقبل توصيل العناصر المراد التحكم فيها',true,'هكذا تُكتشف أخطاء البرنامج دون أن يتحرك محرك أو يعمل حمل بشكل خاطئ.']]}},
    {add:String.raw`<p>لماذا الاختبار <b>قبل</b> توصيل العناصر؟ تخيّل عنوان مخرج المصعد مكتوباً خطأ فيعمل الصعود والنزول معاً، أو يعمل المحرك دون أن يُطلب. على الـ PLC وحده ترى ذلك مؤشراً يضيء فقط، أما مع المحرك موصولاً فقد يتلف شيء أو يتأذى أحد.</p>`,title:'من الورشة'},
    {watch:String.raw`<p>البند <b>أ</b> نصه «عدم تحميل البرنامج <b>على جهاز الحاسب</b> بشكل صحيح»، والمقصود غالباً تحميل البرنامج <b>من الحاسب إلى وحدة <span class="ltr">CPU</span></b> كما تقول الجملة الختامية. نقلناه كما هو.</p>`,fix:true},
    {title:'مختبر مصغّر: رتّب خطوات معالجة أعطال البرمجة',widget:(el,B)=>DCML.order(el,B,{intro:'الكتاب يقول إن أعطال البرمجة يعالجها المبرمج «بعد تحميل البرنامج من جهاز الحاسب إلى وحدة ( CPU ) واختبار البرنامج قبل توصيل العناصر المراد التحكم فيها». اضغط الخطوات بالترتيب.',steps:[
 ['كتابة البرنامج على جهاز الحاسب','لا يوجد ما يُحمَّل قبل كتابة البرنامج.'],
 [String.raw`تحميل البرنامج من الحاسب إلى وحدة <span class="ltr">CPU</span>`,'لا يمكن اختبار البرنامج قبل أن يصل إلى الـ CPU.'],
 ['اختبار البرنامج ومعالجة أخطائه','الاختبار يكون قبل توصيل العناصر، لا بعده.'],
 ['توصيل العناصر المراد التحكم فيها','']],done:'لو وُصّلت العناصر قبل الاختبار قد يشغّل عنوان خاطئ محركاً أو يعمل اتجاهان معاً.'})}
   ]},

  {st:3,short:'أعطال المكونات',title:'ثانياً: أعطال في المكونات الصلبة',ref:'الوحدة 10، ص 148',
   q:'البرنامج صحيح ومجرَّب… ومع ذلك لا يعمل المحرك. أين تبحث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة PLC بمصدر ووحدة CPU وبطارية وبطاقة ذاكرة ووحدات دخل وخرج على قضيب، ومصهر، وتحتها ضاغط وملف متمم ومزمن ومصدر أحمال وأسلاك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="قضيب التثبيت والمنافذ ⟦(Bus)⟧. البند ⟦ج⟧: عدم تثبيت وحدات الدخل أو الخرج بشكل جيد في منافذها ⟦(Bus Modules)⟧."><rect x="34" y="152" width="292" height="12" rx="3" fill="#2C4A40"/></g><g data-tip="مصدر التغذية. البند ⟦أ⟧: عدم توصيل التيار من المصدر إلى وحدة ⟦CPU⟧."><rect x="40" y="60" width="50" height="96" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="65.0" y="82" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PS</text></g><g data-tip="وحدة ⟦CPU⟧. البند ⟦ب⟧: تلف في وحدة ⟦CPU⟧."><rect x="96" y="60" width="80" height="96" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="2"/><text x="136.0" y="82" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">CPU</text></g><g data-tip="وحدة دخل. البند ⟦ث⟧: تلف في وحدات الدخل أو الخرج التناظرية أو الرقمية ⟦(Modules)⟧."><rect x="182" y="60" width="50" height="96" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="207.0" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DI</text></g><g data-tip="وحدة خرج. البند ⟦ث⟧: تلف في وحدات الدخل أو الخرج ⟦(Modules)⟧."><rect x="238" y="60" width="50" height="96" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="263.0" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DO</text></g><g data-tip="البطارية داخل وحدة ⟦CPU⟧. البند ⟦ت⟧: تلف في البطارية."><rect x="106" y="98" width="26" height="40" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/><rect x="113" y="94" width="12" height="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/></g><g data-tip="وحدة التخزين الخارجية (بطاقة الذاكرة). البند ⟦ح⟧: تلف في وحدة التخزين الخارجية."><rect x="142" y="100" width="24" height="34" rx="2" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><path d="M148 104h12" stroke="#2C4A40"/></g><g data-tip="المصهر. البند ⟦س⟧: انقطاع في المصهرات."><rect x="292" y="70" width="28" height="12" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="الموصلات (الأسلاك) بين العناصر والمصدر. البند ⟦ر⟧: انقطاع في الموصلات بين العناصر المراد التحكم فيها والمصدر."><rect x="190" y="164" width="110" height="40" fill="transparent"/><path d="M207 156V230M263 156V196H300V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/></g><g data-tip="ضاغط. البند ⟦خ⟧: تلف في الضواغط (قصر أو عدم توصيل)."><circle cx="207" cy="246" r="16" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><circle cx="207" cy="246" r="7" fill="#FBF6EE"/></g><g data-tip="ملف متمم. البند ⟦د⟧: تلف في ملفات المتممات."><rect x="282" y="230" width="36" height="28" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M286 254L314 234" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="مزمن. البند ⟦ذ⟧: تلف في المزمنات."><circle cx="140" cy="240" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M140 240V226M140 240H150" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مصدر العناصر المراد التحكم فيها (مصدر الأحمال). البند ⟦ز⟧: عدم توصيل المصدر الخاص بالعناصر المراد التحكم فيها."><rect x="50" y="218" width="56" height="44" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 230v20M86 236v8" stroke="#2C4A40" stroke-width="3"/></g><text x="180" y="296" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">كل جزء يقابله بند من قائمة ص 148</text></svg>`,
   cap:'لوحة توضيحية (من إعدادنا): كل جزء فيها يقابله بند من قائمة الكتاب.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف البند الذي يقابله.</b>',
   side:[
    {book:String.raw`<p>وهي الأكثر شيوعاً من الأعطال وهي على النحو التالي:</p>`+listHTML(HWL),ref:'الوحدة 10، ص 148'}
   ],
   body:[
    {book:String.raw`<p><b>ملاحظة:</b> جميع الشركات المنتجة لمختبرات التحكم المبرمج لم تقدم أي تطبيقات في مجال اكتشاف الأعطال. ومن المهم أن يتم اكتشاف الأعطال في ورشة التحكم بالبرمجة.</p>`,ref:'الوحدة 10، ص 148'},
    {predict:{q:'أي الشكلين يصفه الكتاب بأنه «الأكثر شيوعاً»؟',opts:[
     ['أعطال المكونات الصلبة',true,'«وهي الأكثر شيوعاً من الأعطال» (ص 148).'],
     ['أعطال البرمجة',false,'أعطال البرمجة يعالجها المبرمج قبل التوصيل؛ الأكثر شيوعاً أعطال المكونات.'],
     ['متساويان',false,'الكتاب يصف أعطال المكونات صراحة بأنها الأكثر شيوعاً.']]}},
    {tip:String.raw`<ol><li><b>التغذية والـ <span class="ltr">CPU</span>:</b> هل مؤشر التغذية مضاء؟ هل الـ <span class="ltr">CPU</span> على <span class="ltr">RUN</span>؟ هل مؤشر خطأ أو بطارية مضاء؟</li><li><b>المداخل:</b> اضغط الضاغط: هل يضيء مؤشر المدخل؟ إن لم يضئ فالمشكلة قبل الـ PLC (ضاغط، سلك، مصدر) أو في وحدة الدخل.</li><li><b>البرنامج:</b> افتح حالة البرنامج: هل يرى البرنامج المدخل؟ هل يصبح المخرج <span class="ltr">1</span>؟</li><li><b>المخارج:</b> هل يضيء مؤشر المخرج؟ إن أضاء ولم يعمل الحمل فقِس: المصدر، والمصهر، وطرف المخرج، وطرفي الملف.</li></ol>`,title:'طريقة منظمة للتشخيص (ليست من الكتاب)'},
    {title:'صنّف العطل',widget:(el,B)=>{
      const ALL=SWL.map(x=>[x[0],x[1],'sw']).concat(HWL.map(x=>[x[0],x[1],'hw']));
      const ord=ALL.map((x,i)=>[(i*7+3)%ALL.length,x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
      let i=0,ok=0,done=0,ans=null;
      const draw=()=>{const it=ord[i];
        el.innerHTML=`<p class="sub" style="margin:0 0 8px">بنود القائمتين مخلوطة. لكل بند: هل هو من أعطال البرمجة أم من أعطال المكونات؟</p>
         <div class="sb sb-book" style="margin:0"><div class="prose">${it[1]}</div></div>
         <div class="w-row"><button class="btn" type="button" data-a="sw" ${ans?'disabled':''}>أعطال البرمجة (Software)</button><button class="btn" type="button" data-a="hw" ${ans?'disabled':''}>أعطال المكونات (Hardware)</button></div>
         ${ans?`<p class="sub" style="margin-top:6px"><b>${ans===it[2]?'إجابة صحيحة.':'ليست هذه.'}</b> هذا البند <b>${it[0]}</b> من ${it[2]==='sw'?'أعطال البرمجة (ص 147)':'أعطال المكونات الصلبة (ص 148)'}.</p><div class="w-row"><button class="btn pri" type="button" data-nx>البند التالي</button></div>`:''}
         <div class="w-facts"><div><span>إجابات صحيحة</span><b><span class="ltr">${ok} / ${done}</span></b></div><div><span>رقم البند</span><b><span class="ltr">${i+1} / ${ord.length}</span></b></div></div>`;
        el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ans=b.dataset.a;done++;if(ans===it[2])ok++;draw()});
        const nx=el.querySelector('[data-nx]');if(nx)nx.onclick=()=>{ans=null;i=(i+1)%ord.length;if(i===0){ok=0;done=0}draw()}};
      draw();
    }},
    {predict:{q:'مؤشر المخرج الخاص بمتمم المحرك مضاء، والجهد واصل إلى طرفي ملف المتمم، لكن المتمم لا يجذب. أي بند أقرب؟',opts:[
     ['س — انقطاع في المصهرات',false,'لو انقطع المصهر لما وصل الجهد إلى طرفي الملف.'],
     ['ت — عدم تحديد أرقام المخارج بشكل صحيح',false,'المؤشر يضيء والجهد واصل إلى الملف الصحيح، فالبرنامج والعنوان يعملان.'],
     ['د — تلف في ملفات المتممات',true,'الجهد واصل إلى الملف ولا يجذب: الملف نفسه تالف (بند د من أعطال المكونات).']]}}
   ]},

  {recap:[
   String.raw`الأعطال في أنظمة الـ PLC شكلان: أعطال في البرمجة <span class="ltr">(Software)</span> وأعطال في المكونات <span class="ltr">(Hardware)</span> (الوحدة 10، ص 147).`,
   String.raw`أعطال البرمجة (أ–ح): التحميل، ومكونات البرنامج، وأرقام العناوين، وتعريف واختيار المداخل والمخارج التناظرية والرقمية، ونوع البلوك.`,
   String.raw`يعالجها المبرمج بعد تحميل البرنامج إلى وحدة <span class="ltr">CPU</span> واختباره <b>قبل</b> توصيل العناصر المراد التحكم فيها.`,
   String.raw`أعطال المكونات (أ–س) هي الأكثر شيوعاً: المصدر، والـ <span class="ltr">CPU</span>، والبطارية، والوحدات وتثبيتها، والتخزين، والضواغط، والمتممات، والمزمنات، والموصلات، ومصدر الأحمال، والمصهرات (ص 148).`]}
],
 theory:[
  {h:'تشخيص أعطال الأجهزة العاملة مع الحاكم المنطقي المبرمج',ref:'الوحدة 10، ص 147',html:'<p>«يوجد شكلان من الأعطال التي تواجه الفني أثناء العمل في مجال التحكم المنطقي المبرمج وهي:»</p><ol><li>أعطال في البرمجة (Software).</li><li>أعطال في المكونات (Hardware).</li></ol>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>ترقيم الصفحات:</b> الوحدة العاشرة مرقّمة 147–148، وهما نفس رقمي صفحتين من الوحدة التاسعة (التي تمتد حتى 158). لذلك نكتب «الوحدة 10، ص 147». كما أن الوحدة لا تبدأ بصفحة الجدارة والأهداف والوقت كبقية الوحدات.'+'</div>'},
  {h:'أولاً: أعطال نتيجة البرمجة',ref:'الوحدة 10، ص 147',html:'<p>«وهي غالباً ما تكون نتيجة:»</p>'+listHTML(SWL)+'<p>«جميع هذه الأعطال تتم معالجتها من قبل المبرمج بشكل مباشر، وذلك بعد تحميل البرنامج من جهاز الحاسب إلى وحدة ( CPU ) واختبار البرنامج قبل توصيل العناصر المراد التحكم فيها.»</p>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'البند أ نصه «عدم تحميل البرنامج <b>على جهاز الحاسب</b> بشكل صحيح»، والمقصود غالباً تحميل البرنامج <b>من الحاسب إلى وحدة CPU</b> كما تقول الجملة الختامية. نقلناه كما هو.'+'</div>'},
  {note:'<b>توضيح للمتدرب — أمثلة (ليست من نص الكتاب):</b><ul><li><b>أ:</b> جزء من البرنامج لم يصل إلى الـ CPU، أو حُمِّلت نسخة قديمة.</li><li><b>ب:</b> نسيان الإمساك الذاتي، أو الخلط بين مزمن تأخير التشغيل وتأخير الفصل.</li><li><b>ت:</b> كتابة I1.2 بدل I1.1، أو Q4.2 بدل Q4.1.</li><li><b>ث و ج:</b> تعريف وحدة الدخل أو الخرج بعناوين أو بنوع (تناظري/رقمي) لا يطابق الوحدة المركبة فعلاً.</li><li><b>ح:</b> كتابة البرنامج في بلوك لا تنفذه الـ CPU (مثل FC غير مستدعى من OB1).</li></ul>'},
  {h:'ثانياً: أعطال في المكونات الصلبة',ref:'الوحدة 10، ص 148',html:'<p>«وهي <b>الأكثر شيوعاً</b> من الأعطال وهي على النحو التالي:»</p>'+listHTML(HWL)},
  {html:'<p><b>ملاحظة (من الكتاب، ص 148):</b> «جميع الشركات المنتجة لمختبرات التحكم المبرمج لم تقدم أي تطبيقات في مجال اكتشاف الأعطال. ومن المهم أن يتم اكتشاف الأعطال في ورشة التحكم بالبرمجة.»</p>'},
  {note:'<b>توضيح للمتدرب — طريقة منظمة للتشخيص (ليست من نص الكتاب):</b><ol><li><b>التغذية والـ CPU:</b> هل مؤشر التغذية مضاء؟ هل الـ CPU على RUN؟ هل SF أو BATF مضاء؟</li><li><b>المداخل:</b> اضغط الضاغط: هل يضيء مؤشر المدخل؟ إن لم يضئ فالمشكلة قبل الـ PLC (ضاغط، سلك، مصدر) أو في وحدة الدخل.</li><li><b>البرنامج:</b> افتح حالة البرنامج (Program Status): هل يرى البرنامج المدخل؟ هل يصبح المخرج 1؟</li><li><b>المخارج:</b> هل يضيء مؤشر المخرج؟ إن أضاء ولم يعمل الحمل فقِس: المصدر، المصهر، طرف المخرج، طرفا الملف، مقاومة الملف.</li></ol>'},
  {h:'النظام المستخدم في المختبر',html:'<p>لأن الكتاب لا يقدّم تطبيقاً عملياً للأعطال، أعددنا نظاماً صغيراً: محرك يعمل بالضاغط S1 مع إمساك ذاتي، ويقف بالضاغط S0، وبعد 3 ث من التشغيل تضيء لمبة H1. يُحقن في هذا النظام عطل واحد من قائمتي الكتاب، وعليك تحديد البند.</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج لنظام التدريب (من إعداد المحاكاة، ليس من الكتاب)'},
  {draw:B=>{const P=B.createPLC(PROGS.ok);return P.nets.map(n=>`<div class="net static"><header><h3>${n.title}</h3></header>${B.stlTable(n,{trace:[]})}</div>`).join('')},caption:'برنامج نظام التدريب بلغة STL (من إعداد المحاكاة)'},
  {note:NOTE_SIM}
 ],
 io:IO10,
 lab:(el)=>lab10(el),
 quiz:[
  {q:'ما شكلا الأعطال التي تواجه الفني في مجال التحكم المبرمج حسب الكتاب؟',o:['أعطال كهربائية وميكانيكية','أعطال في البرمجة (Software) وأعطال في المكونات (Hardware)','أعطال المحرك والمتممات','أعطال المداخل فقط'],c:1,e:'الوحدة 10، ص 147.'},
  {q:'أي النوعين يصفه الكتاب بأنه «الأكثر شيوعاً»؟',o:['أعطال البرمجة','أعطال المكونات الصلبة','متساويان','لم يذكر'],c:1,e:'ص 148: «وهي الأكثر شيوعاً من الأعطال».'},
  {q:'متى يعالج المبرمج أعطال البرمجة حسب الكتاب؟',o:['بعد توصيل كل الأحمال','بعد تحميل البرنامج إلى وحدة CPU واختباره قبل توصيل العناصر المراد التحكم فيها','قبل كتابة البرنامج','لا تعالج'],c:1,e:'الجملة الختامية لأعطال البرمجة ص 147.'},
  {q:'كتب المبرمج I1.2 بدل I1.1 لضاغط التشغيل. أي بند؟',o:['برمجة — ت: عدم تحديد أرقام المداخل والمخارج بشكل صحيح','مكونات — خ: تلف في الضواغط','برمجة — ح: نوع البلوك','مكونات — ر: انقطاع الموصلات'],c:0,e:'البند ت من أعطال البرمجة.'},
  {q:'«انقطاع في المصهرات» من أي قائمة وبأي بند؟',o:['البرمجة — أ','المكونات — س','المكونات — د','البرمجة — ث'],c:1,e:'ص 148، البند س.'},
  {q:'وحدة دخل لم تُركّب جيداً في منفذها (Bus). أي بند؟',o:['مكونات — ج','مكونات — ث','برمجة — ج','مكونات — أ'],c:0,e:'ص 148، البند ج: «عدم تثبيت وحدات الدخل أو الخرج … بشكل جيد في المنافذ الخاصة بها ( Bus Modules )».'},
  {q:'ماذا تقول ملاحظة الكتاب عن الشركات المنتجة لمختبرات التحكم المبرمج؟',o:['قدمت برامج كثيرة للأعطال','لم تقدم أي تطبيقات في مجال اكتشاف الأعطال','تمنع اكتشاف الأعطال','لم يذكر شيئاً'],c:1,e:'ملاحظة ص 148.'},
  {q:'(سيناريو من المحاكاة) مؤشر Q4.1 مضاء، و 24 v على طرفي ملف K1، والمتمم لا يجذب، ومقاومة الملف ∞. أي بند؟',o:['س — انقطاع في المصهرات','ز — عدم توصيل مصدر الأحمال','د — تلف في ملفات المتممات','ت — عنوان خاطئ'],c:2,e:'الجهد واصل إلى الملف لكن الملف مفتوح: البند د من أعطال المكونات.'}
 ]
});
})(PLCBOOK);
