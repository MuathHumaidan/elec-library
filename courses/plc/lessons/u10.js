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
  {intro:true},

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
    {watch:String.raw`<p>صفحتا هذه الوحدة مرقّمتان في الكتاب 147 و 148، وهما نفس رقمي صفحتين من الوحدة التاسعة (التي تمتد حتى 158). لذلك نكتب «الوحدة 10، ص 147». كما أن الوحدة لا تبدأ بصفحة الجدارة والأهداف والوقت كبقية الوحدات.</p>`,fix:true}
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
    {watch:String.raw`<p>البند <b>أ</b> نصه «عدم تحميل البرنامج <b>على جهاز الحاسب</b> بشكل صحيح»، والمقصود غالباً تحميل البرنامج <b>من الحاسب إلى وحدة <span class="ltr">CPU</span></b> كما تقول الجملة الختامية. نقلناه كما هو.</p>`,fix:true}
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
