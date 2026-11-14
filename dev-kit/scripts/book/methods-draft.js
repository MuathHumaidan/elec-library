// مسودة courses/<c>/methods-data.js من محتوى الدروس — usage: node methods-draft.js dc-machines > out.js
const {chromium}=require('playwright');const path=require('path');
const C=process.argv[2]||'dc-machines';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.addInitScript(()=>localStorage.setItem('elib-style','stations'));
const url=h=>'file://'+path.join(__dirname,'../lib/courses/'+C+'/index.html#'+h);
await p.goto(url('home'));await p.waitForTimeout(500);
const info=await p.evaluate(()=>{const B=PLCBOOK;return {title:B.COURSE.title,ls:B.LESSONS.slice().sort((a,b)=>a.unit-b.unit||a.order-b.order).map(L=>{
  const ch=B.chLab&&B.chLab(L)&&B.CHAL[L.id]||null,SL=((B.STUDY||{}).lessons||{})[L.id]||{};
  return {id:L.id,unit:L.unit,order:L.order,title:L.title,lab:!!(L.lab||L.program||L.plant),faults:ch?(ch.faults||[]).length:0,sim:ch?(ch.outputs||[]).length:0,
   errs:(B.ERRS[L.id]||[]).length,examples:(L.examples||[]).length,quiz:(L.quiz||[]).length,order:(SL.order||[]).length,match:(SL.match||[]).length,opens:((B.ACTS[L.id]||{}).open||[]).length}})}});
const out={};
for(const L of info.ls){await p.goto(url(L.id));await p.waitForTimeout(450);
  L.st=await p.$$eval('#tab-body section.st h2',a=>a.map(x=>{const c=x.cloneNode(true);c.querySelectorAll('.katex,.ref').forEach(k=>k.remove());return c.textContent.replace(/\s+/g,' ').trim()}));
  if(L.lab){await p.click('.ltabs button[data-tab="lab"]');await p.waitForTimeout(250);L.firstStep=await p.evaluate(()=>{const h=document.querySelector('#tab-body ol.steps > li h4');return h?h.textContent.trim():null});L.tp=!!(await p.$('#tab-body .tp-lbl'));await p.click('.ltabs button[data-tab="theory"]');await p.waitForTimeout(250)}
  const head=t=>{let s=t.split(/ — |: /)[0];const w=s.split(' ');return w.slice(0,5).join(' ')};
  const S=re=>{const t=L.st.find(x=>re.test(x));return t?'theory:i>'+head(t):null};
  const obj=S(/^(أهداف التجربة|الغرض|أهداف)/)||S(/تمهيد/);
  const dev=S(/^الأجهزة/),proc=S(/^خطوات|^المرحلة الأولى|^أولاً/),curve=S(/^منحنى|^المنحنيات|^المنحنى/),qs=S(/^الأسئلة/),laws=S(/^القوانين|^المعادلات/),
        safe=S(/السلامة|الوقاية|آمنة/),wiring=S(/مخطط التوصيل|دائرة التوصيل|^الرسم/);
  const need=[];
  const lab=L.lab?'lab>جرّب':null;
  const A={cloud:'acts>سؤال مفتوح',kwl:'acts>جدول K.W.L',exit:'acts>تذكرة خروج',quiz:'acts>المسابقة',fault:'acts>اكتشف العطل',sim:'acts>تحدي المحاكاة',errs:'acts>اكتشف الخطأ',cards:'acts>بطاقات المراجعة',order:'acts>رتّب خطوات التجربة',match:'acts>وصّل أطراف الدائرة',prepost:'acts>اختبار قبل وبعد'};
  const F=(...a)=>a.filter(Boolean);
  const go={};
  go.imitate=[F(A.cloud),F(A.cards),F(obj,laws||'theory:i'),F(lab||proc),F(qs||'quiz',qs&&'quiz'),F('lab',L.order&&A.order,L.match&&A.match),F(A.exit,A.quiz)];
  go.kwl=[F(A.kwl),F(A.kwl,obj,lab),F(A.kwl,A.exit)];
  go.discover={guided:[F(obj,safe),F(proc,curve),F(lab),F(A.exit,A.quiz)],
               free:[F(L.sim?A.sim:(S(/^المطلوب/)||obj)),F('lab'),F(A.exit,A.quiz)]};
  if(L.sim)go.discover.semi=[F(A.sim),F(curve||laws||proc,laws&&curve?laws:null),F('lab'),F(A.exit,A.quiz)];
  if(L.faults)go.problem=[F(A.fault),F(laws||proc||'theory:i',curve),F(A.cloud),F(A.fault,'lab'),F(A.fault,L.errs&&A.errs,A.exit)];
  const lab1=L.firstStep?'lab>'+L.firstStep:null;
  if(L.lab)go.sim=[F(obj),F(proc||S(/قواعد عامة/)),F(safe||dev,!safe&&lab1),F(L.tp?'lab>أرقام المحاكاة':'lab',wiring),F(lab,L.sim&&A.sim),F(A.prepost,A.quiz)];
  if(!proc&&go.discover)go.discover.guided[1]=F(S(/إرشادات لإجراء/),S(/قواعد عامة/));
  // التوصية (القواعد المقترحة بالترتيب): أعطال → حل المشكلات؛ تحدي محاكاة → المحاكاة؛ مختبر بخطوات → التقليد؛ مختبرات مصغّرة → الاكتشاف؛ غير ذلك → K.W.L
  let rec;
  if(L.faults)rec={m:'problem',why:`في مختبر الدرس ${L.faults} أعطال جاهزة في «اكتشف العطل»: كل عطل مشكلة حقيقية يشخّصها المتدربون بالقراءات ثم يختبرون حلها.`};
  else if(L.sim)rec={m:'sim',why:'في مختبر الدرس «تحدي المحاكاة»: يضبط المتدربون الآلة الافتراضية حتى يصلوا إلى قراءة مستهدفة.'};
  else if(L.lab)rec={m:'imitate',why:'الدرس تجربة بخطوات توصيل وتشغيل محددة في المختبر («جرّب»): يعرضها المدرب ثم يكررها المتدربون.'};
  else rec={m:'kwl',why:'درس بلا مختبر ولا أعطال: يبدأ مما يعرفه المتدربون وينتهي بما تعلموه.'};
  const all=['imitate','kwl','discover','problem','sim'].filter(m=>go[m]);
  const no={};
  if(!go.problem)no.problem=L.errs?null:'لا توجد في هذا الدرس أعطال جاهزة («اكتشف العطل») ولا مسألة فيها خطأ («اكتشف الخطأ») تصلح مشكلةً لها حل مسبق كما يشترط الدليل.';
  if(!go.sim)no.sim='لا يوجد في هذا الدرس مختبر افتراضي تجري فيه المحاكاة.';
  if(!L.lab&&go.imitate)delete go.imitate,no.imitate='لا يوجد في الدرس تطبيق عملي يعرضه المدرب ويكرره المتدربون.';
  Object.keys(no).forEach(k=>no[k]==null&&delete no[k]);
  const missing=[];for(const [m,g] of Object.entries(go)){const arr=Array.isArray(g)?g:Object.values(g).flat();arr.forEach((x,i)=>{if(!x.length)missing.push(m+' خطوة '+(i+1))})}
  out[L.id]={rec:[rec],ok:all.filter(m=>m!==rec.m),...(Object.keys(no).length?{no}:{}),go,_title:L.unit+'.'+L.order+' '+L.title,_missing:missing,_st:L.st};
}
console.log(JSON.stringify(out,null,1));await b.close()})();
