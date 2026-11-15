/* «المنضدة الافتراضية» لمقرر تقنية التحكم المبرمج (205 كهر).
   المتدرب يوصّل لوحة الـ PLC بنفسه: مصدر 24 V، وأجهزة الدخل على المداخل، والأحمال على المخارج — حسب جدول المداخل والمخارج للدرس.
   البرنامج جاهز من الكتاب (نفس برنامج تبويب «المختبر»، النسخة الافتراضية)، والجهاز (المحرك، الإشارة، الغسالة…) هو نفسه أيضاً.
   الجهاز لا يرى إلا ما وصل فعلاً: المخرج لا يشغّل حمله إلا إذا كان الحمل موصّلاً بين المخرج و 0 V، والمدخل لا يصله 24 V إلا عبر تلامس جهازه.
   قرار المنسق: التوصيل فقط، والبرنامج جاهز؛ شكل اللوحة عام حتى تصل صور لوحة الكلية. */
(function(B){
if(!B.BENCH||!window.BENCH_LAYOUTS||!BENCH_LAYOUTS.plc)return;
const N=a=>String(a||'').replace(/\s+/g,'').replace(/‎/g,'');
const isI=a=>/^I\d+\.\d$/.test(a),isQ=a=>/^Q\d+\.\d$/.test(a);
const PREF=['fixed-fast','ex-fixed-fast','fixed','ex-fixed','short','book-fast'];
const varKeys=L=>L.variants?Object.keys(L.variants).filter(x=>!['default','note','title'].includes(x)):[];
function benchVar(L){if(!L.variants)return null;const ks=varKeys(L);return PREF.find(k=>ks.includes(k))||L.variants.default||ks[0]}
const progOf=(L,k)=>k?(L.variants[k].program||L.program):L.program;
/* عناوين المداخل والمخارج التي يستعملها البرنامج */
function usedAddrs(P){const s=new Set();P.nets.forEach(n=>n.toks.forEach(t=>{if(t.addr)s.add(N(t.addr))}));return s}
function curProgram(L){if(L.variants){const k=L.variants.default||Object.keys(L.variants).filter(x=>!['default','note','title'].includes(x))[0];return L.variants[k].program||L.program}return L.program||[]}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=s=>String(s||'').replace(/<[^>]+>/g,'');

/* ---- دائرة القدرة: عائلات المحركات في الكتاب ----
   sd: نجمة/دلتا (K1 رئيسي، K2 دلتا، K3 نجمة) — sdrev: مع عكس الحركة (K1 أمام، K2 خلف، K3 نجمة، K4 دلتا)
   dahl: داهلندر (K1 بطيء، K2 سريع، K3 نجمة مزدوجة) — wr: عضو دائر ملفوف (K1 رئيسي، K2..K4 تقصير المقاومات) */
const FAM={'u2-l1':'sd','u2-l3':'sd','u2-l4':'sdrev','u3-l2':'dahl','u3-l6':'dahl','u4-l2':'wr','u4-l3':'wr','u4-l4':'wr'};
const MOTOR={
 sd:{title:'المحرك — لوحة الأطراف',sub:'البداية U1 V1 W1 — النهاية U2 V2 W2',rows:[['U1','V1','W1'],['U2','V2','W2']]},
 dahl:{title:'محرك داهلندر — لوحة الأطراف',sub:'U1 V1 W1 (بطيء) — U2 V2 W2 (سريع)',rows:[['U1','V1','W1'],['U2','V2','W2']]},
 wr:{title:'محرك بعضو دائر ملفوف',sub:'U V W العضو الثابت — K L M حلقات الانزلاق',rows:[['U','V','W'],['K','L','M']]}};
MOTOR.sdrev=MOTOR.sd;
/* حالات الجهاز في كل عائلة ← حالة المتممات المكافئة في دائرة الكتاب (يقرؤها جهاز «المختبر») */
const MODES={sd:{star:['K1','K3'],delta:['K1','K2']},
 sdrev:{'star+':['K1','K3'],'delta+':['K1','K4'],'star-':['K2','K3'],'delta-':['K2','K4']},
 dahl:{low:['K1'],high:['K2','K3']},
 wr:{s3:['K1'],s2:['K1','K4'],s1:['K1','K3'],s0:['K1','K2']}};
const MODE_AR={star:'نجمة',delta:'دلتا','star+':'نجمة (الاتجاه الأول)','delta+':'دلتا (الاتجاه الأول)','star-':'نجمة (الاتجاه المعاكس)','delta-':'دلتا (الاتجاه المعاكس)',low:'السرعة البطيئة',high:'السرعة العالية',s3:'بالمقاومات الثلاث',s2:'بمقاومتين',s1:'بمقاومة واحدة',s0:'بلا مقاومات (تشغيل كامل)'};
/* ---- مواصفات اللوحة من الدرس ---- */
function specOf(L){
 const desc={};(L.io||[]).forEach(r=>{const a=N(r.addr);if(a&&!desc[a])desc[a]={sym:N(r.sym)||a,desc:r.desc||''}});
 const inputs=[],extras=[],inSet=new Set();
 (L.inputs||[]).forEach(i=>{const a=N(i.addr);
  if(a&&isI(a)){inSet.add(a);const rest=i.type==='sensor'?null:(i.initial?1:0);
   const v0=i.type==='sensor'?(i.invert?1:0):((rest?1:0)^(i.invert?1:0));/* حالة التلامس والجهاز في وضع الراحة */
   inputs.push({key:i.id,sym:i.id,desc:(desc[a]&&desc[a].desc)||strip(i.label),addr:a,kind:i.type==='sensor'?'sensor':i.type==='fault'?'fault':i.type==='push'?'push':'toggle',
    nc:i.type==='sensor'?!!i.invert:!!v0,color:i.color,init:!!i.initial,src:i})}
  else if(i.type!=='sensor')extras.push({key:i.id,lbl:strip(i.label)||i.id,push:i.type==='push',color:i.color,init:!!i.initial,src:i})});
 const outAddrs=[],outputs=[];(L.io||[]).forEach(r=>{const a=N(r.addr);if(!isQ(a))return;const sym=N(r.sym)||a;
  const ex=outputs.find(o=>o.addr===a);if(ex){if(!ex.sym.split(' / ').includes(sym))ex.sym+=' / '+sym;return}
  const kind=/^K/i.test(sym)?'coil':/^T\d/i.test(sym)?'timer':/^Y\d/i.test(sym)?'valve':'lamp';
  const color=/^G/i.test(sym)?'green':/^R/i.test(sym)?'red':/^Y/i.test(sym)?'yellow':'amber';
  outAddrs.push(a);outputs.push({sym,desc:r.desc||'',addr:a,kind,color})});
 const analog=(L.io||[]).filter(r=>/^PIW\d+$/i.test(N(r.addr))).map(r=>({sym:N(r.sym),desc:r.desc||'',addr:N(r.addr),kind:r.sim?'tcsim':/^TC|ثرموكبل/i.test(N(r.sym)+r.desc)?'tc':'pot'}));
 let power=null;const fam=FAM[L.id];
 if(fam){const cont=[];outputs.forEach((o,i)=>{if(o.kind==='coil'&&/^K\d$/.test(o.sym))cont.push(i)});
  power={fam,cont,ol:fam==='dahl'?['F4','F5']:['F4'],res:fam==='wr'?['R1','R2','R3']:[],motor:MOTOR[fam]}}
 const inAddrs=[...inSet].sort((x,y)=>parseFloat(x.slice(1))-parseFloat(y.slice(1)));
 outAddrs.sort((x,y)=>parseFloat(x.slice(1))-parseFloat(y.slice(1)));outputs.sort((x,y)=>parseFloat(x.addr.slice(1))-parseFloat(y.addr.slice(1)));
 /* الترتيب أعلاه يغيّر الفهارس: نعيد حساب المتممات بعد الترتيب */
 if(power){power.cont=[];outputs.forEach((o,i)=>{if(o.kind==='coil'&&/^K\d$/.test(o.sym))power.cont.push(i)})}
 return {inputs,outputs,extras,inAddrs,outAddrs,power,analog}}

/* ---- مخطط التوصيل المولَّد من جدول المداخل والمخارج ---- */
function figSVG(sp){const n=Math.max(sp.inputs.length,1),m=Math.max(sp.outputs.length,1),cw=86,w=Math.max(n,m)*cw+180,h=430;
 let s=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;font-family:inherit" dir="ltr">`;
 const T=(x,y,t,o)=>`<text x="${x}" y="${y}" font-size="${(o&&o.s)||12}" text-anchor="${(o&&o.a)||'middle'}" fill="currentColor"${o&&o.b?' font-weight="700"':''}>${esc(t)}</text>`;
 s+=`<path d="M40 30H${w-20}" stroke="#c8382e" stroke-width="2.5"/>${T(30,34,'+24 V',{a:'end',b:1})}<path d="M40 ${h-30}H${w-20}" stroke="#333" stroke-width="2.5"/>${T(30,h-26,'0 V',{a:'end',b:1})}`;
 s+=`<rect x="120" y="170" width="${w-170}" height="70" rx="6" fill="none" stroke="currentColor"/>${T(130,210,'PLC',{a:'start',b:1,s:14})}`;
 sp.inputs.forEach((d,i)=>{const x=170+i*cw;s+=`<path d="M${x} 30V70" stroke="currentColor"/>`+(d.nc?`<path d="M${x} 70L${x+12} 98M${x+14} 92H${x}" stroke="currentColor" fill="none"/>`:`<path d="M${x} 70L${x+12} 98" stroke="currentColor"/>`)+`<path d="M${x} 100V170" stroke="currentColor"/>${T(x-8,88,d.sym,{a:'end',s:11})}${T(x,186,d.addr,{s:11})}`});
 const xm=170+sp.inputs.length*cw;s+=`<path d="M${xm} 170V${h-30}" stroke="#333" stroke-dasharray="4 3"/>${T(xm,186,'1M',{s:11})}`;
 s+=`<path d="M${w-60} 30V170" stroke="#c8382e" stroke-dasharray="4 3"/>${T(w-60,186,'2L+',{s:11})}<path d="M${w-30} 240V${h-30}" stroke="#333" stroke-dasharray="4 3"/>${T(w-30,232,'2M',{s:11})}`;
 sp.outputs.forEach((d,i)=>{const x=170+i*cw;s+=`${T(x,232,d.addr,{s:11})}<path d="M${x} 240V320" stroke="currentColor"/>`+(d.kind==='lamp'?`<circle cx="${x}" cy="335" r="13" fill="none" stroke="currentColor"/><path d="M${x-9} 326L${x+9} 344M${x+9} 326L${x-9} 344" stroke="currentColor"/>`:`<rect x="${x-14}" y="322" width="28" height="26" fill="none" stroke="currentColor"/>`)+`<path d="M${x} 350V${h-30}" stroke="currentColor"/>${T(x+18,339,d.sym,{a:'start',s:11})}`});
 return s+`</svg><p class="sub">مخطط مبني من جدول المداخل والمخارج في الدرس: كل جهاز دخل بين +24 V وعنوانه، وكل حمل بين عنوان مخرجه و 0 V، و 1M و 2M إلى 0 V، و 2L+ إلى +24 V. التلامس المرسوم بخط مائل مع شرطة = N.C.</p>`}

function manFig(sp){const n=sp.outputs.length,cw=110,w=n*cw+80,h=300;let s=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%" dir="ltr">`;
 const T=(x,y,t,a)=>`<text x="${x}" y="${y}" font-size="12" text-anchor="${a||'middle'}" fill="currentColor">${esc(t)}</text>`;
 s+=`<path d="M40 30H${w-20}" stroke="#c8382e" stroke-width="2.5"/>${T(34,34,'+24 V','end')}<path d="M40 ${h-30}H${w-20}" stroke="#333" stroke-width="2.5"/>${T(34,h-26,'0 V','end')}`;
 sp.outputs.forEach((d,i)=>{const x=80+i*cw;s+=`<path d="M${x} 30V90L${x+14} 118M${x} 122V170" stroke="currentColor" fill="none"/>${T(x-10,108,sp.inputs[i].sym,'end')}<rect x="${x-16}" y="170" width="32" height="34" fill="none" stroke="currentColor"/>${T(x+22,192,d.sym,'start')}<path d="M${x} 204V${h-30}" stroke="currentColor"/>`});
 return s+`</svg><p class="sub">كل مفتاح بين +24 V وطرف A1 لملفه، و A2 إلى 0 V.</p>`}
/* ---- الأخطاء ---- */
const MZ={
 'psu-short':{t:'قصر على مصدر 24 V',why:'طرفا المصدر + و − اتصلا مباشرة (أو عبر تلامس مغلق بلا حمل). في المعمل يفصل المصدر أو يحترق المصهر. كل جهاز دخل يوصل بين + وطرف المدخل، لا بين + و −.',fatal:true,off:['PWR','RUN']},
 'out-short':{t:'قصر على مخرج الـ PLC',why:'طرف المخرج متصل مباشرة بـ 0 V، فلما اشتغل المخرج صار قصراً. في المعمل تحترق دائرة المخرج أو مصهره. الحمل (الملف أو اللمبة) يوصل بين المخرج و 0 V.',fatal:true,off:['PWR','RUN']},
 'out-backfeed':{t:'وصلت +24 V على طرف مخرج',why:'طرف المخرج يُغذّي الحمل من الـ PLC نفسه، وإذا وصلته بـ +24 V صار الحمل يعمل دائماً بغض النظر عن البرنامج، وقد تتلف دائرة المخرج.'},
 'out-joined':{t:'مخرجان موصولان معاً',why:'وصلت طرفي مخرجين ببعض، فإذا شغّل البرنامج أحدهما وأطفأ الآخر تقاتلا. كل مخرج له حمله وسلكه الخاص.'},
 'load-direct':{t:'الحمل يعمل بلا الـ PLC',why:'الحمل موصّل مباشرة بين +24 V و 0 V، فيعمل دائماً ولا يتحكم فيه البرنامج. يوصل الحمل بين طرف المخرج Q و 0 V.'},
 'input-bypass':{t:'مدخل موصّل بـ +24 V بدون تلامس',why:'طرف المدخل متصل بـ +24 V مباشرة، فيقرأه الـ PLC «1» دائماً كأن الضاغط مضغوط باستمرار. الـ 24 V يصل المدخل عبر تلامس جهازه فقط.'},
 'wrong-io':{t:'توصيل لا يطابق جدول المداخل والمخارج',why:'البرنامج مكتوب على العناوين في الجدول. إذا وصلت جهازاً على عنوان آخر يعمل البرنامج بشكل غير متوقع. راجع الجدول ووصّل كل جهاز على عنوانه.'},
 'run-early':{t:'حوّلت الـ PLC إلى RUN والتوصيل ناقص',why:'قبل RUN يُراجَع التوصيل كاملاً: المصدر والمشتركات وكل المداخل والمخارج. التشغيل بتوصيل ناقص قد يحرّك جزءاً من الآلة دون الآخر.'},
 'power-short':{t:'قصر بين الأوجه في الدائرة الرئيسة',why:'وجهان من المصدر التقيا في نقطة واحدة (عبر سلك أو تلامس مغلق)، فاحترقت المصاهر F1..3 وفصل القاطع. راجع توصيل المتممات: مثلاً متمم النجمة يقصر نهايات الملفات U2 V2 W2 فقط، ولا يجتمع مع متمم الدلتا.',fatal:true,off:['QS']},
 'motor-bad':{t:'المحرك موصّل بشكل غير صحيح',why:'المحرك أخذ الجهد بتوصيل غير متزن: وجه ناقص، أو ملف معكوس في الدلتا، أو نجمة غير مكتملة، أو مقاومات العضو الدائر غير متساوية. المحرك يطنّ ولا يدور كما يجب ويسخن، وفصلت الحماية القاطع. قارن توصيلك بشكل الدائرة الرئيسة.',fatal:true,off:['QS']},
 'wrong-rotation':{t:'اتجاه دوران المحرك معكوس',why:'ترتيب الأوجه على بداية الملفات غير ترتيب الكتاب (L1 على U، L2 على V، L3 على W)، فدار المحرك عكس المطلوب. في الآلة قد يتلف هذا المضخة أو الحمل.'},
 'no-overload':{t:'المحرك يعمل بدون الحماية الحرارية',why:'أطراف القدرة للحماية الحرارية F4 (أو F5) يجب أن تكون بين المتمم والمحرك، حتى يفصل تلامسها المساعد دائرة التحكم إذا زاد التيار.'},
 'rotor-open':{t:'دائرة العضو الدائر مفتوحة',why:'المحرك ذو العضو الدائر الملفوف لا يبدأ إذا كانت حلقات K L M غير موصولة بالمقاومات ونقطة النجمة. العضو الثابت يسحب تيار اللاحمل فقط والمحرك لا يدور.'},
 'tc-reversed':{t:'الثرموكبل موصّل بقطبية معكوسة',why:'الثرموكبل يعطي جهداً صغيراً له قطبية. إذا عُكس قرأ الـ PLC حرارة أقل من الحقيقية (سالبة)، فيبقى السخان يعمل والغرفة تسخن بلا حد. الطرف + إلى + القناة.'},
 'overheat':{t:'الغرفة تجاوزت الحد الأعلى بكثير',why:'الحرارة الفعلية تجاوزت حد الفصل (120% من المطلوبة) بأكثر من 15 °C والسخان ما زال يعمل. السبب في توصيل الحساس أو قناته. افصل وافحص.',fatal:true,off:['RUN']},
 'pwr-off-run':{t:'فصلت المصدر والـ PLC في RUN',why:'حوّل الـ PLC إلى STOP أولاً (تتوقف المخارج بأمان)، ثم افصل المصدر.'}
};

/* ---- التجربة ---- */
function exp(L,sp){
 const IN=sp.inputs,OUT=sp.outputs,EX=sp.extras,steps0=(L.steps||[]);
 const PWR=sp.power,KA={};if(PWR)PWR.cont.forEach(i=>KA[OUT[i].sym]=OUT[i].addr);
 const MAN=!!sp.manual;
 const X={powerSw:PWR?['PWR','QS']:['PWR'],mistakes:MZ,
  figure:()=>(sp.manual?manFig(sp):figSVG(sp))+(L.power?`<h4>الدائرة الرئيسة في الكتاب${L.powerRef?' — '+L.powerRef:''}</h4><div class="svgbox">${(()=>{try{return L.power({Q:()=>0,I:()=>0,M:()=>0,get:()=>0,btn:()=>0,T:()=>({q:0}),C:()=>({v:0}),plant:{},variant:benchVar(L)},B)}catch(e){return ''}})()}</div>`:''),figureTitle:'مخطط توصيل الـ PLC — من جدول المداخل والمخارج',
  init:()=>{const vk=benchVar(L);return {vk,P:B.createPLC(progOf(L,vk)),seen:{},used:{},plant:L.plant&&L.plant.init?L.plant.init():{},stepI:0,t:0,everOn:false,everRun:false,phys:{},inV:{},lastSig:'',ok:{}}},
  note:MAN?'هذه التجربة بلا PLC: كل مفتاح يغذّي ملفه مباشرة من مصدر 24 V. وصّل وأنت المصدر مفصول.':'وصّل وأنت المصدر مفصول. ثم شغّل المصدر، وحوّل الـ PLC إلى RUN، ونفّذ خطوات الكتاب بضواغط اللوحة. البرنامج محمّل مسبقاً كما في الكتاب.'};
 /* اتحاد العقد: الأسلاك + التلامسات المغلقة */
 function graph(a,closed){const nt=a.nets(),of=nt.of,par={};const f=x=>{while(par[x]!=null&&par[x]!==x)x=par[x];return x};
  const id=t=>of[t]!=null?'n'+of[t]:'t'+t;const u=(x,y)=>{const a1=f(id(x)),b1=f(id(y));if(a1!==b1)par[a1]=b1};
  if(closed)IN.forEach((d,i)=>{if(closed[i])u('D'+i+'.a','D'+i+'.b')});
  return t=>f(id(t))}
 const swOf=(a,i)=>!!a.S.sw['SW'+i];
 function st(a,ph,Qphys){const P=ph.P,g=x=>P.get(N(x));const Qp=ph.Qplant||Qphys;
  const btn=k=>{const i=IN.findIndex(d=>d.key===k);if(i>=0&&IN[i].kind!=='sensor')return a.S.sw['SW'+i]?1:0;const j=EX.findIndex(e=>e.key===k);return j>=0&&a.S.sw['X'+j]?1:0};
  return {plc:P,plant:ph.plant,t:ph.t,btn,I:g,M:g,get:g,Q:x=>{x=N(x);return isQ(x)?(Qp[x]?1:0):g(x)},T:x=>P.tim[x]||{q:0,el:0,tv:0,run:0},C:x=>P.cnt[x]||{v:0},name:()=>0,variant:ph.vk}}
 X.tick=a=>{const ph=a.S.phys,P=ph.P,on=a.sw('PWR'),run=on&&a.sw('RUN');ph.t+=a.dt;
  /* قيم الأجهزة المنطقية (نفس قواعد لوحة «المختبر») */
  const Qprev=ph.Qphys||{};const s0=st(a,ph,Qprev);
  const DG=sp.diag?(a.S.rec.__fault||''):'',REP=(a.S.rec.__repl||{});
  const val=IN.map((d,i)=>{let v;if(d.kind==='sensor'){v=d.src.from?(d.src.from(s0)?1:0):0}else v=a.S.sw['SW'+i]?1:0;if(d.src.invert)v=1-v;if(DG==='s1dev'&&d.sym==='S1'&&!REP.S1)v=0;return v});
  const gW=graph(a,null),gC=graph(a,val);
  const plus=gC('P+'),minus=gC('P-');
  if(on&&plus===minus)a.mistake('psu-short');
  /* المداخل */
  const comOK=gC('IM')===minus;const inV={};sp.inAddrs.forEach(ad=>{inV[ad]=on&&comOK&&gC(ad)===plus?1:0});
  sp.inAddrs.forEach(ad=>{if(on&&gW(ad)===gW('P+'))a.once('input-bypass')});
  /* البرنامج */
  sp.inAddrs.forEach(ad=>P.set(ad,inV[ad]));
  if(run){P.scan(a.dt);ph.everRun=true}
  if(!on&&ph.wasOn){P.reset()}ph.wasOn=on;if(on)ph.everOn=true;if(MAN&&on&&PWR){/* بلا PLC: الأوضاع تُحسب ما دام المصدر يعمل */}
  /* المخارج */
  const outPow=on&&gC('QL')===plus&&gC('QM')===minus;
  const qBit={};sp.outAddrs.forEach(ad=>{qBit[ad]=run&&P.get(ad)?1:0});
  const pot=net=>{if(net===plus)return '+';if(net===minus)return '0';const q=sp.outAddrs.filter(ad=>gC(ad)===net);if(q.length&&outPow&&q.some(ad=>qBit[ad]))return 'q';return ''};
  sp.outAddrs.forEach((ad,k)=>{const n=gC(ad);
   if(on&&n===minus&&qBit[ad]&&outPow)a.mistake('out-short');
   if(on&&n===plus)a.once('out-backfeed');
   sp.outAddrs.forEach((bd,j)=>{if(j>k&&gC(bd)===n&&on&&qBit[ad]!==qBit[bd])a.once('out-joined')})});
  const Qphys={},ldOn=[];
  OUT.forEach((d,i)=>{const p1=pot(gC('L'+i+'.1')),p2=pot(gC('L'+i+'.2'));let e=on&&((p1==='q'||p1==='+')&&p2==='0'||(p2==='q'||p2==='+')&&p1==='0');if(DG==='coil'&&d.sym==='K1'&&!REP.K1)e=false;ldOn[i]=e;
   if(e&&!sp.manual&&(p1==='+'||p2==='+'))a.once('load-direct');if(e)Qphys[d.addr]=1});
  ph.Qphys=Qphys;ph.potT=t=>{if(!on)return 0;const n=gC(t);if(n===plus)return 24;if(n===minus)return 0;return pot(n)==='q'?24:null};
  if(PWR)powerTick(a,ph,ldOn,Qphys);
  /* الجهاز */
  const s=st(a,ph,Qphys);ph.s=s;
  const AN=sp.analog||[];let anV=null;
  if(AN.length){anV=AN.map((c,k)=>{const pp=gC('A'+k+'.+'),mm=gC('A'+k+'.-'),cp=gC('AI'+k+'+'),cm=gC('AI'+k+'-');
    if(!on)return {st:'off'};if(pp===cp&&mm===cm)return {st:'ok'};if(pp===cm&&mm===cp)return {st:'rev'};
    const other=AN.findIndex((_,j)=>j!==k&&(gC('AI'+j+'+')===pp||gC('AI'+j+'-')===pp));return {st:other>=0?'swap':'open'}});
   const pot=AN.findIndex(c=>c.kind==='pot');if(pot>=0)ph.plant.V=a.knob('AV'+pot);
   const ts=AN.findIndex(c=>c.kind==='tcsim');if(ts>=0){ph.plant.man=true;ph.plant.Tm=a.knob('AV'+ts)*10}}
  if(L.plant&&L.plant.step)try{L.plant.step(a.dt,s,ph.plant)}catch(err){}
  if(AN.length){const pl=ph.plant,P=ph.P;/* ما يقرؤه الـ PLC فعلاً من القناتين حسب التوصيل */
   const val=(c,k)=>{const w=anV[k].st,phys=c.kind==='pot'?a.knob('AV'+k):c.kind==='tcsim'?a.knob('AV'+k)*10:pl.T;
    if(w==='ok')return phys;if(w==='rev')return c.kind==='pot'?0:-phys;return c.kind==='tc'?3276.7:0};/* دخل جهد مفتوح يُقرأ 0 *//* سلك مفتوح في قناة الحرارة: قيمة الفيض 32767 */
   const pi=AN.findIndex(c=>c.kind==='pot'),ti=AN.findIndex(c=>c.kind==='tc'||c.kind==='tcsim');
   if(pi>=0&&ti>=0&&on){const V=val(AN[pi],pi),T=val(AN[ti],ti);const piw288=Math.round(Math.max(0,Math.min(10,V))/10*27648),md100=piw288/27648*100,piw290=Math.round(T*10),md200=piw290/10;
    Object.assign(P.words,{PIW288:piw288,LD0:piw288,MD0:piw288,MD100:md100,PIW290:piw290,LD10:piw290,MD10:piw290,MD200:md200,MD80:md100*0.8,MD120:md100*1.2});
    /* ما يظهر في لوحة الجهاز = ما يقرؤه الـ PLC */pl.v=Object.assign({},pl.v,{piw288,md100,piw290,md200,md80:md100*0.8,md120:md100*1.2});pl.SV=md100;pl.L80=md100*0.8;pl.L120=md100*1.2}
   if(ti>=0&&run&&anV[ti].st==='rev')a.once('tc-reversed');
   if(ti>=0&&a.hold('ovh',run&&ph.Qphys[OUT.find(o=>o.sym==='K1')?OUT.find(o=>o.sym==='K1').addr:'']&&pl.T>pl.L120+15,3))a.mistake('overheat');
   if(run&&pl.prevH2&&!pl.H)ph.cyc=(ph.cyc||0)+1;if(run&&!pl.prevH2&&pl.H&&ph.cyc)ph.cyc2=1;pl.prevH2=pl.H}
  if(MAN&&on)OUT.forEach((d,i)=>{if(ldOn[i])ph.used[d.addr]=1});
  if(run){sp.inAddrs.forEach(ad=>{(ph.seen[ad]=ph.seen[ad]||{})[inV[ad]]=1});OUT.forEach((d,i)=>{if(ldOn[i])ph.used[d.addr]=1})}
  /* القراءات: لمبات الحالة */
  const r={pwr:on,run,qs:PWR&&a.sw('QS')};sp.inAddrs.forEach(ad=>r['li:'+ad]=inV[ad]);sp.outAddrs.forEach(ad=>r['lq:'+ad]=qBit[ad]&&outPow);
  IN.forEach((d,i)=>{if(d.kind==='sensor')r['dv'+i]=val[i]});OUT.forEach((d,i)=>r['ld'+i]=ldOn[i]);
  ph.r=r;return r};
 /* ---- دائرة القدرة ---- */

 function powerTick(a,ph,ldOn,Qphys){const fam=PWR.fam,qs=a.sw('QS');
  /* العقد مع التلامسات الرئيسة المغلقة وأقطاب الحماية الحرارية (مغلقة دائماً) */
  const nt=a.nets(),of=nt.of,par={};const f=x=>{while(par[x]!=null&&par[x]!==x)x=par[x];return x};const id=t=>'n'+of[t];const u=(x,y)=>{const p1=f(id(x)),p2=f(id(y));if(p1!==p2)par[p1]=p2};
  PWR.cont.forEach(i=>{if(ldOn[i])[[1,2],[3,4],[5,6]].forEach(([x,y])=>u('C'+i+'.'+x,'C'+i+'.'+y))});
  PWR.ol.forEach(o=>[[1,2],[3,4],[5,6]].forEach(([x,y])=>u(o+'.'+x,o+'.'+y)));
  const g=t=>f(id(t));const ph3={};if(qs)['L1','L2','L3'].forEach((l,k)=>{const n=g(l);ph3[n]=(ph3[n]||0)|(1<<k)});
  const P3=t=>{const m=ph3[g(t)]||0;return m===1?1:m===2?2:m===4?3:m?-1:0};
  /* مهلة 0.06 ث: زمن جذب المتمم وفصله (عشرات الملّي ثانية)، فتداخل دورة مسح واحدة لا يُعد قصراً */
  if(a.hold('psc',qs&&Object.values(ph3).some(m=>m&&(m&(m-1))),0.06))a.mistake('power-short');
  const T=x=>'M.'+x,pp=xs=>xs.map(x=>P3(T(x))),dist=v=>v.every(z=>z>0)&&new Set(v).size===3,dirOf=v=>[[1,2,3],[2,3,1],[3,1,2]].some(c=>c.join()===v.join())?1:-1;
  const same=xs=>xs.every(x=>g(T(x))===g(T(xs[0])));const anyP=xs=>pp(xs).some(z=>z!==0);
  let mode=null,bad=false,dir=0;
  if(fam==='sd'||fam==='sdrev'){const A=pp(['U1','V1','W1']),Bv=pp(['U2','V2','W2']);
   if(dist(A)&&Bv.every(z=>z===0)&&same(['U2','V2','W2'])){mode='star';dir=dirOf(A)}
   else if(dist(A)&&Bv[2]===A[0]&&Bv[0]===A[1]&&Bv[1]===A[2]){mode='delta';dir=dirOf(A)}
   else if(anyP(['U1','V1','W1','U2','V2','W2']))bad=true;
   if(mode&&fam==='sdrev')mode+=dir>0?'+':'-'}
  else if(fam==='dahl'){const A=pp(['U1','V1','W1']),Bv=pp(['U2','V2','W2']);
   if(dist(A)&&Bv.every(z=>z===0)&&!same(['U2','V2','W2'])){mode='low';dir=dirOf(A)}
   else if(dist(Bv)&&A.every(z=>z===0)&&same(['U1','V1','W1'])){mode='high';dir=dirOf(Bv)}
   else if(anyP(['U1','V1','W1','U2','V2','W2']))bad=true}
  else if(fam==='wr'){const A=pp(['U','V','W']);
   if(dist(A)){dir=dirOf(A);const R=rotorR(a,ldOn);if(R===null){a.once('rotor-open')}else if(R<0)bad=true;else mode='s'+R}
   else if(anyP(['U','V','W']))bad=true}
  if(a.hold('mbad',qs&&bad,0.3))a.mistake('motor-bad');
  if(mode&&fam!=='sdrev'&&dir<0)a.once('wrong-rotation');
  if(mode){const gw=a.nets().of,starts=fam==='wr'?['U','V','W']:fam==='dahl'?(mode==='low'?['U1','V1','W1']:['U2','V2','W2']):['U1','V1','W1'];
   /* الحماية الحرارية: كل بداية ملف موصولة (بالأسلاك) بطرف خرج من أقطاب F4/F5 */
   const outs=PWR.ol.flatMap(o=>[2,4,6].map(n=>o+'.'+n));if(!starts.every(t=>outs.some(o=>gw[o]===gw[T(t)])))a.once('no-overload')}
  ph.mode=mode;if(mode&&(a.sw('RUN')||MAN))(ph.modes=ph.modes||{})[mode]=1;
  /* ما يراه الجهاز: المتممات المكافئة لحالة المحرك الفعلية (والمتممات الأخرى كما هي) */
  const Qpl=Object.assign({},Qphys);Object.values(KA).forEach(ad=>delete Qpl[ad]);
  if(mode)MODES[fam][mode].forEach(k=>{if(KA[k])Qpl[KA[k]]=1});ph.Qplant=Qpl}
 /* مقاومة العضو الدائر بين حلقتين (بوحدات «قسم مقاومة») — null مفتوحة، −1 غير متزنة */
 function rotorR(a,ldOn){const els=[];PWR.res.forEach(r=>'abc'.split('').forEach(c=>els.push({p:r+'.'+c+'1',n:r+'.'+c+'2',g:1})));
  PWR.cont.forEach(i=>{if(ldOn[i])[[1,2],[3,4],[5,6]].forEach(([x,y])=>els.push({p:'C'+i+'.'+x,n:'C'+i+'.'+y,g:1e6}))});
  const pairR=(x,y)=>{const r=a.solve(els.concat([{p:'M.'+x,n:'M.'+y,g:1e-9,i:1}]));return Math.abs(r.vt('M.'+x)-r.vt('M.'+y))};
  const R=[pairR('K','L'),pairR('L','M'),pairR('K','M')];
  if(R.some(v=>v>1e4))return null;const s=R.map(v=>v/2);if(Math.max(...s)-Math.min(...s)>0.2)return -1;const k=Math.round(s[0]);return Math.abs(s[0]-k)<0.2&&k>=0&&k<=3?k:-1}
 /* فحص مطابقة التوصيل للجدول (يُستدعى عند تشغيل المصدر أو RUN) */
 function audit(a){const g=graph(a,null);const bad=[],rail=n=>n===g('P+')||n===g('P-');
  IN.forEach((d,i)=>{[g('D'+i+'.a'),g('D'+i+'.b')].forEach(n=>{if(rail(n))return;sp.inAddrs.forEach(ad=>{if(ad!==d.addr&&g(ad)===n)bad.push(d.sym+' على '+ad+' (الجدول: '+d.addr+')')})})});
  OUT.forEach((d,i)=>{[g('L'+i+'.1'),g('L'+i+'.2')].forEach(n=>{if(rail(n))return;sp.outAddrs.forEach(ad=>{if(ad!==d.addr&&g(ad)===n)bad.push(d.sym+' على '+ad+' (الجدول: '+d.addr+')')})})});
  (sp.analog||[]).forEach((c,k)=>{const n=g('A'+k+'.+');(sp.analog||[]).forEach((_,j)=>{if(j!==k&&(g('AI'+j+'+')===n||g('AI'+j+'-')===n))bad.push(c.sym+' على القناة CH'+j+' (الجدول: '+c.addr+')')})});
  if(bad.length)a.once('wrong-io',{why:MZ['wrong-io'].why+' الملاحظ: '+bad.slice(0,3).join('، ')+'.'})}
 const wiredIn=a=>{const g=graph(a,null);return IN.every((d,i)=>{const na=g('D'+i+'.a'),nb=g('D'+i+'.b'),p=g('P+'),q=g(d.addr);return (na===p&&nb===q)||(nb===p&&na===q)})};
 const wiredOut=a=>{const g=graph(a,null);return OUT.every((d,i)=>{const n1=g('L'+i+'.1'),n2=g('L'+i+'.2'),m=g('P-'),q=g(d.addr);return (n1===q&&n2===m)||(n2===q&&n1===m)})};
 const wiredMan=a=>{const g=graph(a,null);return OUT.every((d,i)=>{const n1=g('L'+i+'.1'),n2=g('L'+i+'.2'),m=g('P-'),da=g('D'+i+'.a'),db=g('D'+i+'.b'),p=g('P+');const sw=(da===p&&(db===n1||db===n2))||(db===p&&(da===n1||da===n2));return sw&&(n1===m||n2===m)})};
 const wiredPsu=a=>{const g=graph(a,null);return g('IM')===g('P-')&&g('QM')===g('P-')&&g('QL')===g('P+')};
 if(!MAN)X.onSwitchOn=(id,a)=>{if(id==='QS')a.S.phys.everQS=true;if(id==='PWR')audit(a);if(id==='RUN'){audit(a);if(a.sw('PWR')&&!(wiredPsu(a)&&wiredIn(a)&&wiredOut(a)))a.once('run-early')}};
 X.onSwitchOff=(id,a)=>{if(id==='PWR'&&a.sw('RUN')&&!MAN)a.mistake('pwr-off-run')};
 const need=a=>{const U=usedAddrs(a.S.phys.P);return {ins:sp.inAddrs.filter(ad=>U.has(ad)),outs:sp.outAddrs.filter(ad=>U.has(ad))}};
 const insDone=a=>need(a).ins.every(ad=>{const z=a.S.phys.seen[ad];return z&&z[0]&&z[1]});
 const outsDone=a=>need(a).outs.every(ad=>a.S.phys.used[ad]);
 const bookDone=a=>insDone(a)&&outsDone(a);
 const nm=ad=>{const d=IN.find(x=>x.addr===ad)||OUT.find(x=>x.addr===ad);return d?esc(d.sym):ad};
 if(MAN){X.steps=[{t:'وصّل المصدر بقضيبي التوزيع، ثم كل مفتاح: من القضيب <b>+</b> إلى المفتاح، ومنه إلى الطرف A1 لملفه، و A2 إلى القضيب <b>−</b> ('+IN.map((d,i)=>esc(d.sym)+' ← '+esc(OUT[i].sym)).join('، ')+').',done:wiredMan},
   {t:'شغّل مصدر 24 V.',done:a=>!!a.S.phys.everOn}].concat(sp.manualSteps||[])
   .concat(PWR?[{t:'وصّل الدائرة الرئيسة كما في شكل الكتاب (زر «مخطط التوصيل»): L1 L2 L3 إلى التلامسات الرئيسة، ثم الحماية الحرارية، ثم أطراف المحرك، وحلقات العضو الدائر إلى المقاومات ونقطة النجمة. ثم أغلق القاطع Q0.',done:a=>!!a.S.phys.everQS&&Object.keys(MODES[PWR.fam]).some(m=>(a.S.phys.modes||{})[m])},
    {t:'شغّل المحرك بكل أوضاعه بالترتيب: '+Object.keys(MODES[PWR.fam]).map(m=>MODE_AR[m]).join('، ')+'.',done:a=>Object.keys(MODES[PWR.fam]).every(m=>(a.S.phys.modes||{})[m]),live:a=>{const z=Object.keys(MODES[PWR.fam]).filter(m=>!(a.S.phys.modes||{})[m]);return z.length?'باقي: '+z.map(m=>MODE_AR[m]).join('، '):''}}]:[])
   .concat([{t:'افصل كل المفاتيح، ثم المصدر'+(PWR?' والقاطع Q0':'')+'.',done:a=>(sp.manualDone?sp.manualDone(a):true)&&(!PWR||Object.keys(MODES[PWR.fam]).every(m=>(a.S.phys.modes||{})[m]))&&!a.sw('PWR')&&!(PWR&&a.sw('QS'))}]);
  X.complete=a=>X.steps.every(s=>s.done(a));X.onSwitchOn=(id,a)=>{if(id==='QS')a.S.phys.everQS=true};}
 else X.steps=[
  {t:'وصّل المصدر بقضيبي التوزيع (+24 V إلى القضيب الأحمر و 0 V إلى الرمادي)، ثم تغذية الـ PLC: <b>+</b> إلى <b>2L+</b>، و <b>−</b> إلى <b>1M</b> و <b>2M</b>.',done:wiredPsu},
  {t:'وصّل المداخل حسب جدول المداخل والمخارج: من القضيب <b>+</b> إلى طرف تلامس كل جهاز، ومن طرفه الآخر إلى عنوانه ('+IN.map(d=>esc(d.sym)+' ← '+d.addr).join('، ')+').',done:wiredIn},
  {t:'وصّل المخارج: كل مخرج إلى الطرف الأول لحمله، والطرف الثاني إلى القضيب <b>−</b> ('+OUT.map(d=>d.addr+' ← '+esc(d.sym)).join('، ')+').',done:wiredOut},
  {t:'شغّل المصدر، ثم حوّل الـ PLC من STOP إلى <b>RUN</b>.',done:a=>a.S.phys.everRun}]
  .concat((sp.analog||[]).length?[{t:'وصّل الأجهزة التناظرية: '+sp.analog.map((c,k)=>esc(c.sym)+' على القناة CH'+k+' ('+c.addr+')').join('، ')+' — الطرف + إلى + القناة، و − إلى −.',done:a=>{const g=graph(a,null);return sp.analog.every((c,k)=>g('A'+k+'.+')===g('AI'+k+'+')&&g('A'+k+'.-')===g('AI'+k+'-'))}},
   {t:'اضبط الحرارة المطلوبة بالمقاومة R، وشغّل التسخين، واتركه حتى يفصل السخان عند 120% ثم يعود يعمل عند 80% (دورة كاملة).',done:a=>!!a.S.phys.cyc2}]:[])
  .concat(PWR?[{t:'وصّل الدائرة الرئيسة كما في شكل الكتاب (زر «مخطط التوصيل»): L1 L2 L3 إلى التلامسات الرئيسة للمتممات، ثم الحماية الحرارية، ثم أطراف المحرك'+(PWR.res.length?'، وحلقات العضو الدائر إلى المقاومات ونقطة النجمة':'')+'. ثم أغلق القاطع Q0.',done:a=>!!a.S.phys.everQS&&Object.keys(MODES[PWR.fam]).some(m=>(a.S.phys.modes||{})[m])},
   {t:'شغّل المحرك بكل أوضاعه: '+Object.keys(MODES[PWR.fam]).map(m=>MODE_AR[m]).join('، ')+'.',done:a=>Object.keys(MODES[PWR.fam]).every(m=>(a.S.phys.modes||{})[m]),live:a=>{const z=Object.keys(MODES[PWR.fam]).filter(m=>!(a.S.phys.modes||{})[m]);return z.length?'باقي: '+z.map(m=>MODE_AR[m]).join('، '):''}}]:[])
  .concat([{t:'جرّب كل جهاز دخل يستعمله البرنامج (اضغط، حرّك، أو انتظر الحسّاس)، وتأكد أن لمبة مدخله على الـ PLC تضيء وتنطفئ.',done:insDone,live:a=>{const z=need(a).ins.filter(ad=>{const q=a.S.phys.seen[ad];return !(q&&q[0]&&q[1])});return z.length?'باقي: '+z.map(nm).join('، '):''}},
   {t:'شغّل الجهاز بترتيب خطوات الكتاب (القائمة تحت «الجهاز») حتى يعمل كل حمل مرة على الأقل.',done:outsDone,live:a=>{const z=need(a).outs.filter(ad=>!a.S.phys.used[ad]);return z.length?'باقي: '+z.map(nm).join('، '):''}}])
  .concat([{t:'أعد الـ PLC إلى <b>STOP</b>، ثم افصل المصدر'+(PWR?' والقاطع Q0':'')+'.',done:a=>bookDone(a)&&!a.sw('RUN')&&!a.sw('PWR')&&!(PWR&&a.sw('QS'))}]);
 const modesDone=a=>(!(sp.analog||[]).length||!!a.S.phys.cyc2)&&(!PWR||Object.keys(MODES[PWR.fam]).every(m=>(a.S.phys.modes||{})[m]));
 if(!MAN)X.complete=a=>wiredPsu(a)&&wiredIn(a)&&wiredOut(a)&&bookDone(a)&&modesDone(a)&&!a.sw('RUN')&&!a.sw('PWR')&&!(PWR&&a.sw('QS'));
 if(sp.diag)diagSetup(X,sp,IN,OUT,need,insDone,outsDone);
 /* لوحة الجهاز */
 const p=L.plant;
 if(!sp.diag)X.view={title:(p&&p.title)||'الجهاز والدائرة الرئيسة',
  mount(el,a){let h='';
   if(L.variants){const ks=varKeys(L);h+=`<label class="sub">البرنامج المحمّل في الـ PLC: <select data-var>${ks.map(k=>`<option value="${k}"${k===a.S.phys.vk?' selected':''}>${esc(strip(L.variants[k].label||k))}</option>`).join('')}</select></label><p class="sub" data-varmsg></p>`}
   if(p){h+=`<p class="sub" data-pl></p>`;if(p.view==='motor')h+=`<div class="motor-row"><div>${B.W.motor('bnRotor',130)}${p.nameplate?`<div class="nameplate">${p.nameplate}</div>`:''}</div><div data-pv></div></div>`;else h+=`<div class="plant-view" data-pv></div>`}
   if(L.power)h+=`<h4 class="sm">${PWR?'الدائرة الرئيسة في الكتاب — تعرض الوضع الذي وصل إليه محركك فعلاً':'الدائرة الرئيسة (تتبع حالة المتممات الموصّلة)'}</h4><div class="svgbox" data-pw></div>`;
   if(p&&p.readouts)h+=`<div class="reads" data-rd></div>`;
   if(!p&&!L.power)h+='<p class="sub">راقب لمبات المخارج على اللوحة.</p>';
   if(steps0.length)h+=`<details class="bn-book"><summary>خطوات التشغيل في الكتاب</summary><ol>${steps0.map(c=>`<li><b>${c.t}</b>${c.x?`<br><span class="sub">${c.x}</span>`:''}</li>`).join('')}</ol></details>`;
   el.innerHTML=h;
   const sel=el.querySelector('[data-var]');if(sel)sel.addEventListener('change',()=>{const ph=a.S.phys,m=el.querySelector('[data-varmsg]');
    if(a.sw('RUN')){sel.value=ph.vk;m.textContent='حوّل الـ PLC إلى STOP أولاً، ثم حمّل البرنامج الآخر.';return}
    ph.vk=sel.value;ph.P=B.createPLC(progOf(L,ph.vk));ph.seen={};ph.used={};ph.lastSig='';m.textContent='حمّلت البرنامج: '+strip(L.variants[ph.vk].label||ph.vk)+'.'})},
  frame(el,a){const ph=a.S.phys,s=ph.s;if(!s||!el)return;
   if(p&&p.view==='motor'){const r=el.querySelector('#bnRotor');if(r)r.setAttribute('transform',`rotate(${(ph.plant.ang||0).toFixed(1)} 75 75)`)}
   const pv=el.querySelector('[data-pv]');
   if(p&&p.frame)try{p.frame(pv,s,ph.plant,B)}catch(e){}
   const rd=el.querySelector('[data-rd]');if(rd&&p.readouts&&(ph.rdT=(ph.rdT||0)+a.dt)>0.2){ph.rdT=0;rd.innerHTML=p.readouts.map(r=>{try{if(r.chip){const [t,c]=r.chip(ph.plant,s);return `<div class="read"><span>${r.l}</span><em class="mode-chip ${c||''}">${t}</em></div>`}return `<div class="read"><span>${r.l}</span><b>${r.v(ph.plant,s)}</b></div>`}catch(e){return ''}}).join('')}
   const sig=JSON.stringify([ph.Qphys,ph.Qplant,p&&p.sig?p.sig(ph.plant):0,Object.entries(ph.P.tim).map(([k,v])=>[k,v.q,v.run]),Object.entries(ph.P.cnt).map(([k,v])=>[k,v.v]),a.S.sw]);
   if(sig===ph.lastSig)return;ph.lastSig=sig;
   if(p&&p.render&&pv)try{p.render(pv,s,ph.plant,B);(sp.hide||[]).forEach(sel=>{const e=pv.querySelector(sel);const c=e&&e.parentElement;if(c)c.style.display='none'});const vk=pv.querySelector('[data-k="V"]');if(vk&&(sp.analog||[]).length)vk.closest('label').style.display='none';if((sp.analog||[]).some(c=>c.kind==='tcsim'))['Tm','man','Ta'].forEach(k=>{const e=pv.querySelector(`[data-k="${k}"]`);if(e)e.closest('label').style.display='none'})}catch(e){}
   const lb=el.querySelector('[data-pl]');if(lb&&p&&p.label)try{lb.textContent=p.label(ph.plant,s)||''}catch(e){}
   const pw=el.querySelector('[data-pw]');if(pw&&L.power)try{pw.innerHTML=L.power(s,B)}catch(e){}}};
 return X}

/* ---- الربط بالدروس: كل درس له برنامج ومداخل ومخارج رقمية ---- */
const INTRO='وصّل لوحة الـ PLC بنفسك حسب جدول المداخل والمخارج، ثم شغّلها ونفّذ خطوات الكتاب. البرنامج محمّل مسبقاً كما في الكتاب، فإذا لم يعمل الجهاز كما يجب فالسبب في توصيلك. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.';
const INTRO_MAN='وصّل اللوحة بنفسك ثم شغّلها بالمفاتيح. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.';
function bind(L,Lb,sp){L._benchSpec=sp;L.bench=el=>{const ly=BENCH_LAYOUTS.plc(sp);
  B.BENCH.mount(el,{key:L.id,title:'المنضدة الافتراضية: '+strip(L.title),layout:ly,exp:exp(Lb,sp),intro:sp.manual?INTRO_MAN:INTRO})}}
B.LESSONS.forEach(L=>{if(L.bench||!L.inputs||!L.plant&&!L.program&&!L.variants)return;
 const prog=curProgram(L);if(!prog||!prog.length)return;
 const sp=specOf(L);if(!sp.inputs.length||!sp.outputs.length)return;
 bind(L,L,sp)});
const LL=id=>B.LESSONS.find(l=>l.id===id);
/* ---- المزمنات (3.3–3.5): ضاغطا Start و Reset ولمبة على خرج المزمن، وبرنامج لكل نوع ---- */
const TMR={SP:'المزمن النبضي SP',SE:'المزمن النبضي الممتد SE',SD:'مزمن التشغيل المتأخر SD',SS:'مزمن التشغيل المتأخر المخزن SS',SF:'مزمن الفصل المتأخر SF'};
const tprog=k=>[{title:'Network 1 — '+TMR[k]+' (5 ث)',stl:['A I 0.1','L S5T#5S',k+' T 1','A I 0.0','R T 1','A T 1','= Q 4.4']}];
[['u3-l3',['SP','SE']],['u3-l4',['SD','SS']],['u3-l5',['SF','SP','SE','SD','SS']]].forEach(([id,ks])=>{const L=LL(id);if(!L||L.bench)return;
 const variants={default:ks[0],title:'المزمن المحمّل:'};ks.forEach(k=>variants[k]={label:TMR[k],program:tprog(k)});
 const Lb={id,title:L.title,io:[{sym:'S',desc:'Start — مدخل التشغيل للمزمن',addr:'I0.1'},{sym:'R',desc:'Reset — مدخل الفصل',addr:'I0.0'},{sym:'H',desc:'لمبة على خرج المزمن Q',addr:'Q4.4'}],
  inputs:[{id:'S',addr:'I0.1',type:'push',color:'green',label:'Start'},{id:'R',addr:'I0.0',type:'push',color:'red',label:'Reset'}],variants,steps:[
   {t:'اضغط S ضغطة قصيرة، ثم ضغطة طويلة أطول من 5 ث، وراقب اللمبة.'},{t:'اضغط R أثناء عمل المزمن وراقب ما يحدث.'},{t:'غيّر نوع المزمن من قائمة «المزمن المحمّل» (في STOP) وكرر.'}]};
 bind(L,Lb,specOf(Lb))});
/* ---- الدرس 5.4: الثرموكبل تحاكيه مقاومة 0–10 V (10 V = 100 °C) — البرنامج والجهاز من الدرس 5.3 ---- */
{const L=LL('u5-l4'),L3=LL('u5-l3');if(L&&L3&&!L.bench){const io=L3.io.map(r=>/^TC/.test(N(r.sym))?Object.assign({},r,{sym:'RT',desc:'مقاومة 0–10 V تحاكي الثرموكبل (10 V = 100 °C)',sim:true}):r);
 const Lb=Object.assign({},L3,{id:'u5-l4',title:L.title,io});bind(L,Lb,specOf(Lb))}}
/* ---- بلا PLC: مفاتيح تغذي الملفات مباشرة ---- */
function manualSpec(devs,outs,extra){return Object.assign({inputs:devs.map(d=>({key:d.id,sym:d.id,desc:d.desc,addr:'',kind:'toggle',nc:false,src:{id:d.id,type:'toggle'}})),
  outputs:outs,extras:[],inAddrs:[],outAddrs:[],analog:[],manual:true},extra||{})}
/* الدرس 4.1: الدائرة الرئيسة للمحرك ذي العضو الدائر، والمتممات بمفاتيح يدوية (كما في تبويب المختبر) */
{const L=LL('u4-l1');if(L&&!L.bench&&L.plant){const ks=['K1','K2','K3','K4'];
 const outs=ks.map((k,i)=>({sym:k,desc:(L.io.find(r=>N(r.sym)===k)||{}).desc||'',addr:'Q4.'+(i+1),kind:'coil',color:'amber'}));
 const sp=manualSpec(ks.map(k=>({id:'S-'+k,desc:'مفتاح يدوي لملف '+k})),outs,{power:{fam:'wr',cont:[0,1,2,3],ol:['F4'],res:['R1','R2','R3'],motor:MOTOR.wr}});
 bind(L,Object.assign({},L,{program:[],variants:null}),sp)}}
/* الدرس 7.2: محرك الخطوة — أربعة مفاتيح تغذي الملفات A B C D (الجهاز من الدرس 7.3) */
{const L=LL('u7-l2'),L3=LL('u7-l3');if(L&&L3&&!L.bench&&L3.plant){const cs=['A','B','C','D'];
 const outs=cs.map((c,i)=>({sym:'ملف '+c,desc:'ملف محرك الخطوة',addr:'Q4.'+i,kind:'wind',color:'amber'}));
 const sp=manualSpec(cs.map(c=>({id:'S'+c,desc:'مفتاح الملف '+c})),outs,{manualSteps:[{t:'أدر المحرك 8 خطوات متتالية في اتجاه واحد بتسلسل التغذية الصحيح (جدول التسلسل في الكتاب).',done:a=>Math.abs((a.S.phys.plant||{}).steps||0)>=8,live:a=>'الخطوات حتى الآن: '+((a.S.phys.plant||{}).steps||0)}],manualDone:a=>Math.abs((a.S.phys.plant||{}).steps||0)>=8,hide:['#u7pv']});
 bind(L,Object.assign({},L3,{id:'u7-l2',title:L.title,program:[],variants:null,steps:[]}),sp)}}
/* ---- الدرس 10.1: تشخيص عطل مخفي في لوحة موصّلة ----
   اللوحة تأتي موصّلة صحيحاً وفيها عطل عتادي واحد مخفي (اختيار عشوائي لكل محاولة). المتدرب يجرّب، ويقيس بـ «جهاز القياس»،
   ويحدد العطل من قائمة الكتاب (ص 147–148)، ويصلحه، ثم يجرّب التشغيل كاملاً. */
const DFAULTS=[
 {id:'w-s1',wire:['D1.b','I1.1'],t:'انقطاع السلك بين الضاغط S1 والمدخل I1.1',item:'ر'},
 {id:'w-k1',wire:['I:Q4.1','L0.1'],t:'انقطاع السلك بين المخرج Q4.1 والمتمم K1',item:'ر'},
 {id:'w-h1',wire:['L1.2','B-4'],t:'انقطاع سلك رجوع اللمبة H1 إلى 0 V',item:'ر'},
 {id:'w-1m',wire:['B-1','IM'],t:'انقطاع سلك مشترك المداخل 1M',item:'ز'},
 {id:'w-2l',wire:['B+1','QL'],t:'انقطاع تغذية وحدة المخارج 2L+',item:'ز'},
 {id:'coil',dev:'K1',t:'تلف ملف المتمم K1',item:'د'},
 {id:'s1dev',dev:'S1',t:'تلف تلامس الضاغط S1',item:'ر'}];
function diagSetup(X,sp,IN,OUT,need,insDone,outsDone){
 const fault=a=>DFAULTS.find(f=>f.id===a.S.rec.__fault)||DFAULTS[0];
 X.prewire=api=>{const f=DFAULTS[Math.floor(Math.random()*DFAULTS.length)];api.S.rec.__fault=f.id;api.S.rec.__repl={};
  const w=[['P+','B+0'],['P-','B-0'],['B+1','QL'],['B-1','IM'],['B-2','QM'],['B+2','D0.a'],['D0.b','I0.1'],['B+3','D1.a'],['D1.b','I1.1'],['Q4.1','L0.1'],['L0.2','B-3'],['Q4.2','L1.1'],['L1.2','B-4']];
  const fw=f.wire&&f.wire.map(x=>x.replace('I:',''));
  return w.map(([a,b],k)=>({a,b,c:k<5?(k%2?'black':'red'):k<9?'blue':'yellow',open:!!(fw&&((fw[0]===a&&fw[1]===b)||(fw[0]===b&&fw[1]===a)))}))};
 X.probe=(a,b,api)=>{const ph=api.S.phys,f=ph.potT;const nm=t=>{const q=document.querySelector(`.bn-term[data-t="${CSS.escape(t)}"]`);return q?q.getAttribute('aria-label').replace('الطرف ',''):t};
  if(!api.sw('PWR'))return 'المصدر مفصول: لا يوجد جهد بين '+nm(a)+' و '+nm(b)+'.';
  const va=f?f(a):null,vb=f?f(b):null;if(va==null||vb==null)return 'جهاز القياس بين '+nm(a)+' و '+nm(b)+': لا توجد قراءة ثابتة (أحد الطرفين غير متصل بالمصدر) ≈ 0 V.';
  return 'جهاز القياس بين '+nm(a)+' و '+nm(b)+': '+Math.abs(va-vb)+' V.'};
 X.mistakes=Object.assign({},X.mistakes,{'wrong-diag':{t:'تشخيص خاطئ',why:'حددت عطلاً غير الموجود. قبل الحكم قِس الجهد على طول المسار: من المصدر إلى الجهاز، ثم إلى المدخل أو المخرج، ثم الحمل ورجوعه إلى 0 V. الطرف الذي يختفي عنده الجهد يدلك على العطل.'},
  'needless-repl':{t:'استبدلت جهازاً سليماً',why:'الاستبدال قبل القياس يضيّع الوقت والقطع. قِس أولاً.'}});
 const repaired=a=>{const f=fault(a);if(f.wire)return !a.S.wires.some(w=>w.open);return !!(a.S.rec.__repl||{})[f.dev]};
 const after=a=>{const ph=a.S.phys;if(!repaired(a)||!a.S.rec.__dx)return false;if(!ph.fixT){ph.fixT=1;ph.seen={};ph.used={}}return insDone(a)&&outsDone(a)};
 X.steps=[{t:'اللوحة موصّلة لكن فيها عطل. شغّل المصدر وحوّل الـ PLC إلى RUN، ثم جرّب: S1 يجب أن يشغّل المحرك K1، وتضيء H1 بعد 3 ث، و S0 يوقف.',done:a=>!!a.S.phys.everRun},
  {t:'استعمل «جهاز القياس» (أعلى المنضدة) ولمبات المداخل والمخارج على الـ PLC لتتبع العطل، ثم اختره من القائمة تحت «التشخيص».',done:a=>!!a.S.rec.__dx},
  {t:'افصل المصدر وأصلح العطل: افكّ السلك المقطوع وركّب سلكاً جديداً مكانه، أو استبدل الجهاز التالف.',done:repaired},
  {t:'شغّل مرة أخرى وجرّب التشغيل كاملاً: S1 ثم انتظر H1 ثم S0.',done:after},
  {t:'أعد الـ PLC إلى STOP، ثم افصل المصدر.',done:a=>after(a)&&!a.sw('RUN')&&!a.sw('PWR')}];
 X.complete=a=>X.steps.every(s=>s.done(a));
 X.onSwitchOn=()=>{};/* اللوحة فيها عطل مقصود: لا فحص «التوصيل ناقص» */
 X.view={title:'التشخيص',mount(el,a){
  el.innerHTML=`<p class="sub">قائمة الكتاب لأعطال الأجهزة (ص 148) — اختر ما وجدته بالقياس:</p>
   <label class="sub">العطل: <select data-dx><option value="">— اختر —</option>${DFAULTS.map(f=>`<option value="${f.id}">${esc(f.t)} (البند ${f.item})</option>`).join('')}</select></label> <button class="btn" data-dxok>هذا هو العطل</button>
   <p class="sub" data-dxm></p><hr><label class="sub">استبدال جهاز (والمصدر مفصول): <select data-rp>${['S0','S1','K1','H1'].map(k=>`<option>${k}</option>`).join('')}</select></label> <button class="btn" data-rpok>استبدل</button><p class="sub" data-rpm></p>
   <details class="bn-book"><summary>طريقة التتبع المقترحة</summary><ol><li>هل لمبة المدخل تضيء عند الضغط؟ إن لم تضئ فالعطل قبل الـ PLC (الضاغط أو سلكه أو 1M).</li><li>هل لمبة المخرج تضيء؟ إن أضاءت والحمل لا يعمل فالعطل بعد الـ PLC (السلك، أو الحمل، أو رجوعه).</li><li>قِس الجهد على طرفي الحمل: 24 V والحمل لا يعمل = الحمل تالف. 0 V = انقطاع قبله.</li></ol></details>`;
  const m=el.querySelector('[data-dxm]');if(a.S.rec.__dx)m.textContent='✓ شخّصت العطل: '+fault(a).t+'.';
  el.querySelector('[data-dxok]').onclick=()=>{const v=el.querySelector('[data-dx]').value;if(!v){m.textContent='اختر عطلاً من القائمة.';return}
   if(v===a.S.rec.__fault){a.S.rec.__dx=1;m.textContent='✓ صحيح: '+fault(a).t+'. الآن افصل المصدر وأصلحه.'}else{a.mistake('wrong-diag');m.textContent='ليس هذا. قِس مرة أخرى.'}};
  el.querySelector('[data-rpok]').onclick=()=>{const k=el.querySelector('[data-rp]').value,r=el.querySelector('[data-rpm]');if(a.sw('PWR')){r.textContent='افصل المصدر أولاً.';return}
   const f=fault(a);(a.S.rec.__repl=a.S.rec.__repl||{})[k]=1;if(f.dev!==k)a.once('needless-repl');r.textContent='استبدلت '+k+'.'}}}}
{const L=LL('u10-l1');if(L&&!L.bench){const N1={title:'Network 1 — K1 تشغيل المحرك مع الإمساك الذاتي',stl:['A(','O I 1.1','O Q 4.1',')','AN I 0.1','= Q 4.1']},N2={title:'Network 2 — T1 تأخير 3 ث بعد تشغيل K1',stl:['A Q 4.1','L S5T#3S','SD T 1']},N3={title:'Network 3 — H1 لمبة التشغيل المستقر',stl:['A T 1','= Q 4.2']};
 const Lb={id:'u10-l1',title:L.title,io:L.io,inputs:[{id:'S0',addr:'I0.1',type:'push',color:'red',label:'إيقاف'},{id:'S1',addr:'I1.1',type:'push',color:'green',label:'تشغيل'}],program:[N1,N2,N3],steps:[]};
 const sp=specOf(Lb);sp.diag=true;bind(L,Lb,sp)}}

/* ---- الدرس 9.2: دائرة التحكم التقليدية للمصعد (متممات وأسلاك بلا PLC) ----
   المتدرب يوصّل دائرة ص 144 كاملة: التلامسات والمتممات والمزمن T1 (تأخير فصل 5 ث). الكابينة هي جهاز الدرس 9.3 نفسه. */
function expRelay(L,sp,plant,figHTML){const IN=sp.inputs,OUT=sp.outputs,TOF=5;
 const X={powerSw:['PWR'],mistakes:Object.assign({},MZ,{
  'updown':{t:'K4 و K5 يعملان معاً',why:'متمم الصعود ومتمم النزول عملا معاً، وهذا في دائرة القدرة قصر بين الأوجه. تلامس K5 المغلق (N.C.) يوصل في فرع K4، وتلامس K4 المغلق في فرع K5 (التعشيق).',fatal:true,off:['PWR']},
  'crash':{t:'الكابينة تجاوزت نهاية المشوار',why:'المحرك لم يقف عند الدور الأول أو الثالث: مفتاح نهاية المشوار F1 أو F3 (N.C.) غير موصول في فرعه، أو موصول بتلامسه الخطأ.',fatal:true,off:['PWR']}}),
  figure:()=>figHTML,figureTitle:'دائرة التحكم التقليدية للمصعد — الشكل ص 144',
  note:'هذه الدائرة بلا PLC: كل المنطق بالتلامسات. استعمل المصدر: + هو L1 و − هو N في الشكل. التلامسات N.O. و N.C. مكتوبة على كل جهاز.',
  init:()=>({plant:plant.init(),E:OUT.map(()=>0),rem:0,stops:{},everOn:false,doorStop:0,lastDir:0})};
 const graph=(a,closed)=>{const of=a.nets().of,par={};const f=x=>{while(par[x]!=null&&par[x]!==x)x=par[x];return x};const id=t=>'n'+of[t];const u=(x,y)=>{const p1=f(id(x)),p2=f(id(y));if(p1!==p2)par[p1]=p2};closed.forEach(([x,y])=>u(x,y));return t=>f(id(t))};
 const K=sym=>OUT.findIndex(o=>o.sym===sym);
 X.tick=a=>{const ph=a.S.phys,pl=ph.plant,on=a.sw('PWR');if(on)ph.everOn=true;
  const atF1=pl.pos<=0.005,atF3=pl.pos>=1.995,f2=Math.abs(pl.pos-1)<0.03?'off':(pl.pos<1?'b':'a');
  const dev=[];IN.forEach((d,i)=>{const sw=!!a.S.sw['SW'+i];
   if(d.kind==='co'){if(f2==='a')dev.push(['D'+i+'.c','D'+i+'.x']);if(f2==='b')dev.push(['D'+i+'.c','D'+i+'.y']);return}
   let closed;if(d.kind==='sensor')closed=d.key==='F1'?!atF1:!atF3;else closed=d.nc?!sw:sw;if(closed)dev.push(['D'+i+'.a','D'+i+'.b'])});
  let E=ph.E.slice(),g,plus,minus;const Tq=()=>E[K('T1')]||ph.rem>0;
  for(let it=0;it<8;it++){const cl=dev.slice();OUT.forEach((o,i)=>{const st=o.kind==='tof'?Tq():E[i];(o.aux||[]).forEach((p,k)=>{const nc=(o.nc||[]).includes(k);if(nc?!st:st)cl.push(['R'+i+'.'+p[0],'R'+i+'.'+p[1]])})});
   g=graph(a,cl);plus=g('P+');minus=g('P-');
   const nE=OUT.map((o,i)=>{const n1=g('L'+i+'.1'),n2=g('L'+i+'.2');return on&&plus!==minus&&((n1===plus&&n2===minus)||(n2===plus&&n1===minus))?1:0});
   const same=nE.every((v,i)=>v===E[i]);E=nE;if(same)break}
  if(on&&plus===minus)a.mistake('psu-short');
  if(E[K('K0')])ph.k0=1;const it=K('T1');if(E[it])ph.rem=TOF;else ph.rem=Math.max(0,ph.rem-a.dt);ph.E=E;
  const k4=E[K('K4')],k5=E[K('K5')];if(a.hold('ud',k4&&k5,0.06))a.mistake('updown');
  const Q={'Q4.1':E[K('K1')],'Q4.2':E[K('K2')],'Q4.3':E[K('K3')],'Q5.4':k4,'Q5.5':k5,'M0.0':E[K('K0')]};
  const tq=E[it]||ph.rem>0;
  const s={plant:pl,t:0,btn:k=>{const i=IN.findIndex(d=>d.key===k);return i>=0&&a.S.sw['SW'+i]?1:0},Q:x=>Q[N(x)]?1:0,M:x=>Q[N(x)]?1:0,I:()=>0,get:x=>Q[N(x)]?1:0,
   T:x=>N(x)==='T1'?{q:tq?1:0,run:!E[it]&&ph.rem>0?1:0,el:TOF-ph.rem,tv:TOF}:{q:0,run:0,el:0,tv:0},C:()=>({v:0}),plc:{words:{},get:()=>0,set:()=>{}},name:()=>0};ph.s=s;
  const d0=pl.dir;try{plant.step(a.dt,s,pl)}catch(e){}
  if(d0&&!pl.dir&&pl.lastStop)ph.stops[pl.lastStop]=1;
  if(d0&&!pl.dir&&IN.some((d,i)=>/^S[789]$/.test(d.key)&&a.S.sw['SW'+i]))ph.doorStop=1;
  if(pl.crash)a.mistake('crash');
  const r={pwr:on};OUT.forEach((o,i)=>r['ld'+i]=!!(o.kind==='tof'?tq&&on:E[i]));IN.forEach((d,i)=>{if(d.kind==='sensor')r['dv'+i]=d.key==='F1'?!atF1:!atF3});return r};
 X.steps=[{t:'وصّل دائرة التحكم كما في الشكل (زر «مخطط التوصيل»): الفرع 1 (S7 S8 S9 ثم K0)، والفرع 2 (SS ثم تلامس K0: النقطة X)، و T1 مع K4 و K5، وفروع الأدوار الثلاثة، وفرعا الصعود K4 والنزول K5 مع F1 و F2 و F3 والتعشيق.',done:a=>!!a.S.phys.k0},
  {t:'شغّل المصدر والأبواب مغلقة (يعمل K0). استدعِ المصعد إلى الدور الأول.',done:a=>!!a.S.phys.stops[1]},
  {t:'استدعه إلى الدور الثالث (من الخارج SO3 أو من الداخل SI3).',done:a=>!!a.S.phys.stops[3]},
  {t:'استدعه إلى الدور الثاني.',done:a=>!!a.S.phys.stops[2]},
  {t:'الأمان: افتح باباً (S7 أو S8 أو S9) أثناء الحركة وتأكد أن المصعد يقف.',done:a=>!!a.S.phys.doorStop},
  {t:'أغلق الأبواب، ثم افصل المصدر.',done:a=>[1,2,3].every(n=>a.S.phys.stops[n])&&a.S.phys.doorStop&&!a.sw('PWR')}];
 X.complete=a=>X.steps.every(s=>s.done(a));
 X.view={title:plant.title||'المصعد',mount(el){el.innerHTML='<p class="sub" data-pl></p><div class="plant-view" data-pv></div><div class="reads" data-rd></div>'},
  frame(el,a){const ph=a.S.phys,s=ph.s;if(!s||!el)return;const pv=el.querySelector('[data-pv]');try{plant.frame&&plant.frame(pv,s,ph.plant,B)}catch(e){}
   const sig=JSON.stringify([ph.E,plant.sig?plant.sig(ph.plant):0,a.S.sw]);if(sig===ph.lastSig)return;ph.lastSig=sig;
   try{plant.render(pv,s,ph.plant,B);pv.querySelectorAll('h3.sm,.svgbox:not(:first-child)').forEach(e=>{if(/PLC/.test(e.textContent||'')||e.querySelector&&e.querySelector('text')&&/I0\./.test(e.textContent))e.style.display='none'});pv.querySelectorAll('p.sub').forEach(e=>{if(/PLC|المدخل يقرأ/.test(e.textContent))e.style.display='none'})}catch(e){}
   const lb=el.querySelector('[data-pl]');if(lb&&plant.label)lb.textContent=plant.label(ph.plant);
   const rd=el.querySelector('[data-rd]');if(rd&&plant.readouts)rd.innerHTML=plant.readouts.map(r=>{try{if(r.chip){const [t,c]=r.chip(ph.plant,s);return `<div class="read"><span>${r.l}</span><em class="mode-chip ${c||''}">${t}</em></div>`}return `<div class="read"><span>${r.l}</span><b>${r.v(ph.plant,s)}</b></div>`}catch(e){return ''}}).join('')}};
 return X}
{const L=LL('u9-l2'),L3=LL('u9-l3');if(L&&L3&&!L.bench&&L3.plant){
 const dv=(key,desc,kind,nc,color)=>({key,sym:key,desc,addr:'',kind,nc,color,init:false,src:{id:key,type:kind}});
 const inputs=[dv('S7','باب الدور الأول (يفتح بفتح الباب)','toggle',true),dv('S8','باب الدور الثاني','toggle',true),dv('S9','باب الدور الثالث','toggle',true),dv('SS','إيقاف الطوارئ','push',true,'red'),
  dv('SO1','استدعاء خارجي — الدور 1','push',false,'blue'),dv('SO2','استدعاء خارجي — الدور 2','push',false,'blue'),dv('SO3','استدعاء خارجي — الدور 3','push',false,'blue'),
  dv('SI1','داخل الكابينة — الدور 1','push',false,'black'),dv('SI2','داخل الكابينة — الدور 2','push',false,'black'),dv('SI3','داخل الكابينة — الدور 3','push',false,'black'),
  dv('F1','نهاية المشوار — الدور 1','sensor',true),dv('F3','نهاية المشوار — الدور 3','sensor',true),dv('F2','مفتاح الدور الثاني (تحويل)','co',false)];
 const r=(sym,desc,aux,nc,kind)=>({sym,desc,addr:'',kind:kind||'coil',aux,nc});
 const outputs=[r('K0','متمم مساعد (الأبواب مغلقة)',[['13','14']],[]),r('K1','طلب الدور الأول',[['13','14'],['23','24']],[]),r('K2','طلب الدور الثاني',[['13','14'],['23','24']],[]),r('K3','طلب الدور الثالث',[['13','14'],['23','24']],[]),
  r('K4','المحرك صعوداً',[['13','14'],['21','22']],[1]),r('K5','المحرك نزولاً',[['13','14'],['21','22']],[1]),r('T1','مزمن تأخير فصل',[['17','18'],['15','16']],[1],'tof')];
 const sp={inputs,outputs,extras:[],inAddrs:[],outAddrs:[],analog:[],manual:true,relay:true};
 const fb=(L.theory||[]).find(b=>b.book&&/ctrlbox/.test(b.book));const fig=fb?fb.book+(fb.ref?`<p class="sub">${fb.ref}</p>`:''):'';
 L._benchSpec=sp;L.bench=el=>{const ly=BENCH_LAYOUTS.plc(sp);B.BENCH.mount(el,{key:L.id,title:'المنضدة الافتراضية: '+strip(L.title),layout:ly,exp:expRelay(L,sp,L3.plant,fig),intro:'وصّل دائرة التحكم التقليدية للمصعد بنفسك (متممات وتلامسات بلا PLC)، ثم شغّلها واستدعِ المصعد بين الأدوار. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.'})}}}
B.PLCBENCH={specOf,figSVG,curProgram};
})(PLCBOOK);
