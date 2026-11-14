/* =====================================================================
   «طرق التدريب» — «مسار الطريقة» للمدرب فقط، مبني على دليل المؤسسة «طرائق ووسائل التدريب» (الإصدار الأول 1444 هـ)
   - عام لكل المكتبات: لا شيء هنا يخص مقرراً بعينه. بيانات كل مقرر في courses/<المقرر>/methods-data.js
     (window.METHODS_DATA). لا ملف بيانات = لا زر دخول ولا شريط في ذلك المقرر.
   - لا يظهر إلا إذا دخل المدرب بحساب «مسابقة الصف» (الخادم في shared/quiz-config.js).
   - الدرس نفسه لا يتحرك ولا يتغير: الشريط أعلى الدرس يعرض خطوات الطريقة بالترتيب، و«التالي» / «اذهب»
     ينقل إلى جزء الدرس الذي يخدم الخطوة ويميّزه.
   - التوصية (موصى بها / مناسبة أيضاً / لا تناسب) وسببها من ملف بيانات المقرر، لا من هذا الملف.
   شكل ملف البيانات وعنوان كل جزء («الهدف»): انظر API_METHODS.md
   ===================================================================== */
(function(G){
"use strict";
const B=G.PLCBOOK;if(!B||!B.R)return;
const DATA=G.METHODS_DATA;
const CHQ=(()=>{try{return new URLSearchParams(location.search).get('ch')==='1'}catch(e){return false}})();
if(CHQ||!DATA||typeof DATA!=='object')return;
const META=DATA._meta||{};
const CID=B.chCourse();

const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const U=s=>B.ltrU(String(s==null?'':s));
const base=()=>String(G.QUIZ_URL||'').trim().replace(/\/+$/,'');
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const rerender=()=>window.dispatchEvent(new HashChangeEvent('hashchange'));

/* ===================== دخول المدرب ===================== */
const TKEY='elib-trainer';
let TR=(()=>{const v=LS.get(TKEY,null);return v&&typeof v.token==='string'&&v.token?{token:v.token,name:String(v.name||'')}:null})();
async function api(method,path,body,tok){
  const h={};if(body)h['Content-Type']='application/json';if(tok)h.Authorization='Bearer '+tok;
  const r=await fetch(base()+path,{method,headers:h,body:body?JSON.stringify(body):undefined,credentials:'omit',cache:'no-store'});
  let j=null;try{j=await r.json()}catch(e){}return {ok:r.ok,status:r.status,j:j||{}};
}
const signedIn=()=>!!TR;
function setTR(v){TR=v;if(v)LS.set(TKEY,v);else LS.del(TKEY);paintTop()}
/* التحقق عند فتح الصفحة: الرمز غير الصالح يُحذف بصمت؛ انقطاع الشبكة لا يُخرج المدرب */
if(TR&&base())api('GET','/api/me',null,TR.token).then(r=>{
  const u=r.j&&r.j.user;
  if(r.ok&&u){const nm=String(u.name||u.username||TR.name);if(nm!==TR.name){setTR({token:TR.token,name:nm});$$('[data-trname]').forEach(e=>e.textContent=nm)}}
  else if(r.status===401||r.status===403||(r.ok&&!u)){setTR(null);rerender()}
}).catch(()=>{});
const signOut=()=>{const t=TR&&TR.token;setTR(null);closeSheets();rerender();if(t)api('POST','/api/logout',null,t).catch(()=>{})};

const ICO={user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  path:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>'};
let topBtn=null;
function paintTop(){if(!topBtn)return;
  topBtn.innerHTML=ICO.user+'<span class="sl">'+(TR?'المدرب: <b data-trname>'+esc(TR.name)+'</b>':'دخول المدرب')+'</span>';
  topBtn.title=TR?'حساب المدرب: '+TR.name:'دخول المدرب بحساب «مسابقة الصف»';
  topBtn.setAttribute('aria-label',TR?'حساب المدرب '+TR.name:'دخول المدرب');
  topBtn.classList.toggle('on',!!TR)}
(function(){const ta=$('.top-actions');if(!ta)return;
  topBtn=document.createElement('button');topBtn.type='button';topBtn.className='trbtn';topBtn.id='trBtn';
  topBtn.addEventListener('click',()=>openAuth());ta.appendChild(topBtn);paintTop()})();

function openAuth(){
  let d=$('#trDlg');if(d)d.remove();
  d=document.createElement('dialog');d.id='trDlg';d.className='trdlg';d.setAttribute('dir','rtl');
  if(TR){
    d.innerHTML=`<form method="dialog"><h2>حساب المدرب</h2><p>أنت داخل باسم <b data-trname>${esc(TR.name)}</b>. يظهر لك «مسار الطريقة» في دروس المقرر، ولا يراه المتدربون.</p>
     <div class="trdlg-acts"><button type="button" class="btn" data-out>خروج</button><button class="btn primary" value="close">إغلاق</button></div></form>`;
    $('[data-out]',d).addEventListener('click',()=>{d.close();signOut()});
  } else {
    d.innerHTML=`<form class="trform"><h2>دخول المدرب</h2><p class="sub">بحساب «مسابقة الصف» نفسه. بعد الدخول تظهر «طرق التدريب» في الدروس على هذا الجهاز فقط.</p>
     <label>اسم المستخدم<input name="u" autocomplete="username" required dir="ltr" autocapitalize="off" spellcheck="false"></label>
     <label>كلمة المرور<input name="p" type="password" autocomplete="current-password" required dir="ltr"></label>
     <p class="trerr" role="alert" hidden></p>
     <div class="trdlg-acts"><button type="button" class="btn" data-x>إلغاء</button><button class="btn primary" type="submit">دخول</button></div></form>`;
    const f=$('form',d),er=$('.trerr',d),sb=$('[type=submit]',d);
    $('[data-x]',d).addEventListener('click',()=>d.close());
    f.addEventListener('submit',async e=>{e.preventDefault();er.hidden=true;
      if(!base()){er.textContent='لم يُضبط رابط خادم المسابقة في المكتبة.';er.hidden=false;return}
      sb.disabled=true;sb.textContent='جارٍ الدخول…';
      try{const r=await api('POST','/api/login',{username:f.u.value.trim(),password:f.p.value});
        const tok=r.j.token,u=r.j.user||{};
        if(r.ok&&tok){setTR({token:String(tok),name:String(u.name||u.username||f.u.value.trim())});d.close();rerender()}
        else{er.textContent=r.ok?'الخادم لا يدعم الدخول من المكتبة بعد.':(r.j.error||'تعذّر الدخول.');er.hidden=false}
      }catch(x){er.textContent='تعذّر الاتصال بخادم المسابقة. تأكد من الإنترنت ثم حاول مرة أخرى.';er.hidden=false}
      sb.disabled=false;sb.textContent='دخول'});
  }
  d.addEventListener('close',()=>setTimeout(()=>d.remove(),0));
  document.body.appendChild(d);
  if(d.showModal)d.showModal();else d.setAttribute('open','');
  const i=$('input',d);if(i)i.focus();
}

/* ===================== الطرق وخطواتها (نص الدليل) =====================
   t اسم قصير للخطوة (يظهر في الشريط) · g نص الخطوة في الدليل
   stage: 1 المرحلة الأولى (تعمل) · 2 المرحلة الثانية (تحتاج تعديلاً في خادم المسابقة) · 0 قريباً */
const DISC_MEASURE={t:'قياس الأداء',g:'عند استخدام هذه الطريقة يجب على عضو هيئة التدريب قياس مستوى أداء المتدربين ومدى اكتسابهم للمعارف والمهارات المحددة بعد تطبيق أي نوع من أنواع التدريب بالاكتشاف.',note:1};
const METHODS=[
 {id:'imitate',n:1,stage:1,name:'التقليد والتطبيق العملي',short:'التقليد والتطبيق',
  def:'جهد منظم ومخطط له يهدف إلى تسهيل اكتساب المتدربين المهارات اللازمة والحصول على المعارف التي تساعد على تحسين الأداء وتحقيق الأهداف، ويتم عن طريق تطبيق المهارات أمام المتدربين من قبل عضو هيئة التدريب مباشرة أو من خلال عرض مرئي مسجل، ومن ثم تكرار المهارات من قبل المتدربين بشكل فردي للوصول إلى مرحلة تطبيق صحيحة.',
  steps:[
   {t:'تهيئة الأذهان',g:'تهيئة أذهان المتدربين من خلال طرح الأسئلة التي تساهم في اكتشاف المعارف والمهارات الرئيسية للموضوع التدريبي.'},
   {t:'مراجعة المهارات السابقة',g:'مراجعة المهارات السابقة المرتبطة بالموضوع التدريبي.'},
   {t:'شرح المعارف والأهداف',g:'شرح المعارف ومناقشة أبرز المحاور النظرية والأهداف المطلوب تحقيقها.'},
   {t:'عرض التطبيق العملي',g:'بدء التطبيق العملي للمهارات (للمقررات العملية)، إما بشكل مباشر أو من خلال عرض المادة المرئية المناسبة للموضوع واحتوائها على جميع مراحل تطبيق المهارة، والأهداف والتعليمات المرتبطة بها.'},
   {t:'مناقشة المتدربين',g:'مناقشة المتدربين بعد عرض المهارات للتأكد من فهم الأهداف المطلوبة.'},
   {t:'تطبيق المتدربين',g:'تطبيق المهارات بعد الانتهاء من المناقشة.'},
   {t:'قياس الأداء',g:'قياس أداء المتدربين للتأكد من إتقان المهارات واستيعاب المعارف.'}]},
 {id:'project',n:2,stage:0,name:'المشروع'},
 {id:'kwl',n:3,stage:1,name:'طريقة K.W.L',short:'K.W.L',
  def:'أداة تحفز المتدرب على البحث والقراءة ليكتشف ما لديه من مفاهيم حول موضوع معين ويتمكن من تقويمها بإشراف مدرب المقرر، ويتألف مخطط K.W.L من ثلاثة أعمدة: K ماذا أعرف؟ W ماذا أريد أن أتعلم؟ L ماذا تعلمت؟',
  steps:[
   {t:'K: ماذا أعرف؟',g:'ماذا أعرف عن الموضوع (K): مناقشة المتدرب بهدف قياس مستوى المعلومات والخبرات التي يمتلكها سابقاً، لربطها بالموضوع التدريبي وتحديث معلوماته وخبراته السابقة.'},
   {t:'W: ماذا أريد أن أتعلم؟',g:'ماذا أريد أن أتعلم من الموضوع (W): بيانات يتمّ الحصول عليها من خلال (تفاعل المتدرب حول الموضوع مع النشاط – البحث – الاستعانة بخبير، إلخ). على سبيل المثال: يُعدّ عضو هيئة التدريب أسئلة لاستثارة عقول المتدربين، ثم يُطلب من كل متدرب كتابة الأسئلة التي يود الإجابة عليها.'},
   {t:'L: ماذا تعلمت؟',g:'ماذا تعلمت من الموضوع (L): تسجيل كافة البيانات التي تمت الإجابة عنها من أسئلة المتدربين، ثم مراجعة ما تم تعلمه بصورة فردية مع تسجيل أبرز المعارف والمعلومات، ثم طرح الأسئلة لقياس مستوى تعلم المتدربين.'}]},
 {id:'discover',n:4,stage:1,name:'الاكتشاف',short:'الاكتشاف',
  def:'استراتيجية وعملية تفكير تتطلب من الفرد إعادة تنظيم معلوماته وتكييفها بشكل يمكّنه من رؤية علاقات جديدة لم تكن معروفة لديه من قبل.',
  lv:{
   guided:{name:'موجّه',steps:[
    {t:'التعليمات الأساسية',g:'تزويد المتدربين بالتعليمات الأساسية التي تساهم في اكتشاف المعلومة واكتساب الخبرة.'},
    {t:'الاكتشاف مرحلة مرحلة',g:'تقسيم التدريب لعدة مراحل بحيث يتاح للمتدرب اكتشاف المفاهيم والمبادئ بالتسلسل المطلوب.'},
    {t:'أهمية كل مرحلة',g:'يوضح عضو هيئة التدريب أهمية كل مرحلة والمعلومات المرتبطة بها.'},
    DISC_MEASURE]},
   semi:{name:'شبه موجّه',steps:[
    {t:'نموذج المشكلة',g:'يقدم عضو هيئة التدريب نموذجاً لمشكلة حول الموضوع التدريبي.'},
    {t:'التوجيهات العامة',g:'يتضمن نموذج المشكلة المطروحة للنقاش بعض التوجيهات العامة لمساعدة المتدربين على اكتشاف الحلول المرتبطة بمعارف الموضوع التدريبي.'},
    {t:'توجيهات لا تقيّد',g:'على عضو هيئة التدريب أن يحدد التوجيهات الملائمة بحيث لا يقيّد المتدربين ولا يحرمهم من فرص النشاط العملي والعقلي في اكتشاف حل المشكلة.'},
    DISC_MEASURE]},
   free:{name:'حر',warn:'الاكتشاف الحر أرقى أنواع الاكتشاف، ويجب على عضو هيئة التدريب عدم استخدام هذا النوع إلا بعد أن يمارس المتدربون النوعين السابقين.',steps:[
    {t:'المشكلة',g:'يواجَه المتدربون بمشكلة محددة.'},
    {t:'الحل دون قيود',g:'يطلب عضو هيئة التدريب من المتدربين الوصول إلى حل لتلك المشكلة دون قيود، بحيث يترك لهم مساحة للتفكير وحرية صياغة الفروض وتصميم التجارب وتنفيذها.'},
    DISC_MEASURE]}}},
 {id:'constructive',n:5,stage:0,name:'البنائي'},
 {id:'triz',n:6,stage:0,name:'الحل الإبداعي للمشكلات (تريز)'},
 {id:'problem',n:7,stage:1,name:'حل المشكلات',short:'حل المشكلات',
  def:'نشاط ذهني منظم للمتدرب، وهو منهج علمي يبدأ باستثارة التفكير بوجود مشكلة ما تستحق التفكير، والبحث عن حلها وفق خطوات علمية، ومن خلال ممارسة عدد من النشاطات التدريبية.',
  rule:'شروط المشكلة في الدليل: أن تكون متناسبة لمستوى المتدربين، وأن يكون لها حل مسبق لدى عضو هيئة التدريب، وأن تكون ذات صلة بموضوع التدريب.',
  steps:[
   {t:'تعريف المشكلة',g:'تعريف المتدربين بالمشكلة وتوضيح مستوى صعوبتها.'},
   {t:'تحليل المشكلة',g:'يطلب عضو هيئة التدريب من المتدربين تحليل المشكلة وتحديد أبعادها.'},
   {t:'ابتكار الحلول',g:'يبدأ المتدربون بابتكار الحلول المناسبة وتوثيقها.'},
   {t:'اختيار الحل وتنفيذه',g:'يجب على المتدربين اختيار الحل الأمثل من وجهة نظرهم مع تنفيذه.'},
   {t:'تقييم الحلول',g:'يقيّم عضو هيئة التدريب نتائج الحلول ويقارنها بأمثلة للحلول البديلة وتبعاتها.'}]},
 {id:'flipped',n:8,stage:2,name:'المقلوب / المعكوس'},
 {id:'sim',n:9,stage:1,name:'المحاكاة',short:'المحاكاة',
  def:'يتم في هذه الطريقة التدريب من خلال بيئة افتراضية محاكاة لبيئة عمل فعلية. ويتم اللجوء في الغالب لطريقة التدريب بالمحاكاة عند وجود مخاطر على السلامة، أو بسبب التكلفة الباهظة للخامات أو التجهيزات والمعدات الخاصة بالتدريب على بعض المهارات.',
  steps:[
   {t:'تحليل الأداء والاحتياج',g:'تحليل الأداء لتحديد الاحتياجات التدريبية والمواضيع المستهدف تدريبها بالمحاكاة وفق أهداف الخطة التدريبية.'},
   {t:'تحليل الأعمال الحقيقية',g:'تحليل الأعمال الحقيقية التي سيتم التدريب عليها لأول مرة أو التدريب عليها لرفع مستوى الأداء بها.'},
   {t:'عناصر السلامة',g:'تحديد العناصر الأساسية لبيئة التدريب الواجب توافرها لضمان سلامة المتدربين والتجهيزات والمعدات.'},
   {t:'تهيئة بيئة المحاكاة',g:'تهيئة البيئة التدريبية المشابهة للبيئة الفعلية.'},
   {t:'تنفيذ التدريب',g:'تنفيذ العملية التدريبية.'},
   {t:'التقييم السابق واللاحق',g:'تقييم الأداء التدريبي السابق واللاحق لمزاولة المتدرب للعمل الحقيقي.'}]},
 {id:'case',n:10,stage:0,name:'دراسة الحالة'},
 {id:'diff',n:11,stage:2,name:'المتمايز'}
];
const MBY=id=>METHODS.find(m=>m.id===id);
const LVS=[['guided','موجّه'],['semi','شبه موجّه'],['free','حر']];
const lvName=k=>(LVS.find(x=>x[0]===k)||[])[1]||'';

/* ===================== بيانات الدرس من ملف المقرر ===================== */
const LD=L=>DATA[L.id]||null;
/* أهداف خطوات طريقة في درس: مصفوفة بطول الخطوات، كل عنصر قائمة أهداف (الأول هو الأساسي) */
function stepsOf(m,lv){return m.lv?((m.lv[lv]||{}).steps||[]):(m.steps||[])}
function goOf(L,m,lv){const d=LD(L);if(!d||!d.go)return null;let g=d.go[m.id];if(m.lv&&g&&!Array.isArray(g))g=g[lv];
  const S=stepsOf(m,lv);if(!Array.isArray(g)||g.length!==S.length)return null;
  return g.map(x=>(Array.isArray(x)?x:[x]).filter(Boolean))}
/* درجة الطريقة في هذا الدرس: rec موصى بها · ok مناسبة أيضاً · no لا تناسب (مع السبب) · na بلا بيانات */
function gradeOf(L,m){const d=LD(L)||{};
  if(m.stage!==1)return {g:m.stage===2?'phase2':'soon'};
  const r=(d.rec||[]).find(x=>x.m===m.id);if(r)return {g:'rec',why:r.why||'',lv:r.lv||null};
  if((d.ok||[]).includes(m.id))return {g:'ok'};
  if(d.no&&d.no[m.id]!=null)return {g:'no',why:d.no[m.id]};
  return {g:'na'}}
const usable=(L,m)=>{const gr=gradeOf(L,m).g;return (gr==='rec'||gr==='ok')&&(m.lv?LVS.some(([k])=>goOf(L,m,k)):!!goOf(L,m))};

/* ===================== الهدف: "التبويب[:أسلوب]>نص" =====================
   التبويب: theory الشرح · lab المختبر · plc البرنامج · examples الأمثلة · quiz اختبر نفسك · acts الأنشطة
   الأسلوب (للشرح فقط): i التفاعلي · f رسمي — بدونه يبقى أسلوب المستخدم الحالي
   النص: جزء من عنوان في التبويب (عنوان محطة، لوحة، بطاقة نشاط، سؤال…). بدون نص = أعلى التبويب */
const TABN={theory:'الشرح',lab:'المختبر',plc:'برنامج الـ PLC',examples:'الأمثلة المحلولة',quiz:'اختبر نفسك',acts:'الأنشطة التفاعلية'};
function parseT(s){const m=String(s).match(/^\s*([a-z]+)(?::([if]))?\s*(?:>\s*(.*))?$/);if(!m)return null;return {tab:m[1],view:m[2]||'',text:(m[3]||'').trim()}}
function tLabel(s){const t=parseT(s);if(!t)return String(s);return (TABN[t.tab]||t.tab)+(t.view==='i'?' (التفاعلي)':t.view==='f'?' (الرسمي)':'')+(t.text?' › '+t.text:'')}
const norm=s=>String(s||'').replace(/[ـً-ْ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ').trim();
const HSEL='h1,h2,h3,h4,h5,summary,legend,.tp-lbl,b,strong,th';
const CONT='ol.steps>li,.act-card,.stb,.tp,.panel,details,.st,.qq,.ex,.callout,section';
function findIn(body,text){
  const n=norm(text);const cands=$$(HSEL,body).filter(e=>!e.closest('.stmap')&&(e.offsetParent!==null||e.tagName==='SUMMARY'));
  const hit=cands.find(e=>norm(e.textContent).startsWith(n))||cands.find(e=>norm(e.textContent).includes(n));
  if(!hit)return null;return hit.closest(CONT)||hit}
/* هل الهدف موجود في هذا الدرس؟ (للاختبار وللتقرير) — يعيد العنصر أو null */
let CTX=null; /* {L,root,tabs} للدرس المعروض */
const curView=()=>B.styleMode&&B.styleMode()==='stations'?'i':'f';
const tabOK=t=>!!(CTX&&CTX.tabs.some(x=>x[0]===t));
let pendingGo=null;
function setView(v){const want=v==='i'?'stations':'formal';try{localStorage.setItem('elib-style',want)}catch(e){}
  if(want==='stations')document.documentElement.setAttribute('data-style','stations');else document.documentElement.removeAttribute('data-style');
  const sb=$('.stylebtn');if(sb){const b=$('b',sb);if(b)b.textContent=want==='stations'?'التفاعلي':'رسمي'}}
function clickTab(tab){const b=$(`.ltabs button[data-tab="${tab}"]`)||$(`.bnav button[data-tab="${tab}"]`);
  if(b&&b.getAttribute('aria-selected')!=='true')b.click();return !!b}
function scrollToEl(el){const bar=$('.mpath'),tabs=$('.ltabs'),top=$('.topbar');
  const off=(top?top.offsetHeight:0)+(bar&&!bar.hidden?bar.offsetHeight:0)+(tabs&&getComputedStyle(tabs).display!=='none'?tabs.offsetHeight:0)+12;
  const y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:'auto'})}
function flash(el){$$('.mgo-hl').forEach(e=>e.classList.remove('mgo-hl'));void el.offsetWidth;el.classList.add('mgo-hl');
  if(el.tagName==='DETAILS'&&!el.open)el.open=true;clearTimeout(flash._t);flash._t=setTimeout(()=>el.classList.remove('mgo-hl'),2600)}
function toast(msg){let t=$('#mToast');if(!t){t=document.createElement('div');t.id='mToast';t.className='mtoast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),3200)}
/* ينقل إلى الهدف ويميّزه. يعيد true إذا وُجد */
function goTo(s,quiet){const t=parseT(s);if(!t||!CTX)return false;
  if(!tabOK(t.tab)){if(!quiet)toast('لا يوجد تبويب «'+(TABN[t.tab]||t.tab)+'» في هذا الدرس.');return false}
  if(t.tab==='theory'&&t.view&&t.view!==curView()){setView(t.view);pendingGo={s,quiet};rerender();return true}
  clickTab(t.tab);
  const body=$('#tab-body');if(!body)return false;
  if(!t.text){scrollToEl(body);flash(body);return true}
  const el=findIn(body,t.text);
  if(el){scrollToEl(el);flash(el);return true}
  scrollToEl(body);if(!quiet)toast('لم أجد «'+t.text+'» في '+(TABN[t.tab]||t.tab)+'.');return false}

/* ===================== حالة المسار لكل درس ===================== */
const MKEY='elib-method',SKEY='elib-mstep',HKEY='elib-mhide';
const mkey=L=>CID+':'+L.id;
function getSel(L){const v=String(LS.get(MKEY,{})[mkey(L)]||'');const [id,lv]=v.split(':');const m=MBY(id);
  if(!m||!usable(L,m))return null;
  if(m.lv){const l=lv&&goOf(L,m,lv)?lv:LVS.map(x=>x[0]).find(k=>goOf(L,m,k));return l?{m,lv:l}:null}
  return {m,lv:null}}
function setSel(L,id,lv){const o=LS.get(MKEY,{});if(id)o[mkey(L)]=id+(lv?':'+lv:'');else delete o[mkey(L)];LS.set(MKEY,o);setStep(L,0)}
const getStep=(L,n)=>{const v=+(LS.get(SKEY,{})[mkey(L)]||0);return v>=0&&v<n?v:0};
const setStep=(L,i)=>{const o=LS.get(SKEY,{});o[mkey(L)]=i;LS.set(SKEY,o)};
const hidden=()=>!!LS.get(HKEY,false);
const mName=m=>m.n+'. '+m.name;
const selName=s=>s.m.name+(s.lv?' ('+lvName(s.lv)+')':'');

/* ===================== الشريط ===================== */
function recText(L){const d=LD(L)||{};const r=(d.rec||[]).filter(x=>{const m=MBY(x.m);return m&&usable(L,m)});
  return r.map(x=>MBY(x.m).name+(x.lv?' ('+lvName(x.lv)+')':''))}
function barHTML(L,sel){
  if(!sel){const rt=recText(L);
    return `<div class="mpath-in"><span class="mpath-k">${ICO.path}<span class="sl">طرق التدريب</span></span>
     <button type="button" class="mpath-pick" data-pick aria-haspopup="dialog"><span class="sl2">الطريقة: </span><b>اختر طريقة</b></button>
     ${rt.length?`<span class="mpath-rec"><span class="mrec-b">موصى بها</span> ${esc(rt.join(' أو '))}</span>`:''}
     <span class="mpath-sp"></span><button type="button" class="mpath-ic" data-hide title="إخفاء الشريط (للعرض على البروجكتر)" aria-label="إخفاء الشريط">${EYE}</button></div>`}
  const S=stepsOf(sel.m,sel.lv),i=getStep(L,S.length);
  return `<div class="mpath-in"><button type="button" class="mpath-pick" data-pick aria-haspopup="dialog" title="تغيير الطريقة">${ICO.path}<b>${esc(sel.m.short||sel.m.name)}${sel.lv?' · '+esc(lvName(sel.lv)):''}</b></button>
    <span class="mpath-nav"><button type="button" class="mpath-ic" data-prev ${i===0?'disabled':''} aria-label="الخطوة السابقة" title="السابق">‹<span class="sl3"> السابق</span></button>
    <button type="button" class="mpath-step" data-list aria-haspopup="dialog" title="قائمة الخطوات"><span class="mpath-n">الخطوة ${i+1} من ${S.length}:</span> <b>${esc(S[i].t)}</b></button>
    <button type="button" class="mpath-ic primary" data-next ${i===S.length-1?'disabled':''} aria-label="الخطوة التالية" title="التالي"><span class="sl3">التالي </span>›</button></span>
    <span class="mpath-sp"></span><button type="button" class="btn mpath-plan" data-plan>خطة الدرس</button><button type="button" class="mpath-ic" data-hide title="إخفاء الشريط (للعرض على البروجكتر)" aria-label="إخفاء الشريط">${EYE}</button></div>`}
const EYE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.2M6.2 7.3A17 17 0 0 0 3 12s4 6 9 6a9 9 0 0 0 4.1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/* ===================== اللوحات: اختيار الطريقة / قائمة الخطوات ===================== */
function closeSheets(){$$('.msheet').forEach(x=>x.remove());document.documentElement.removeAttribute('data-msheet')}
function sheet(cls,title,html){closeSheets();
  const s=document.createElement('div');s.className='msheet '+cls;s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label',title);s.dir='rtl';
  s.innerHTML=`<div class="msheet-bg" data-close></div><div class="msheet-p"><header class="msheet-h"><b>${esc(title)}</b><button type="button" class="mpath-ic" data-close aria-label="إغلاق">✕</button></header><div class="msheet-b">${html}</div></div>`;
  document.body.appendChild(s);document.documentElement.setAttribute('data-msheet','');
  s.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeSheets()});
  const f=$('.msheet-b button:not(:disabled)',s)||$('[data-close].mpath-ic',s);if(f)f.focus();return s}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.msheet'))closeSheets()});
window.addEventListener('hashchange',closeSheets);

function pickHTML(L,sel){
  const groups={rec:[],ok:[],no:[],phase2:[],soon:[],na:[]};
  METHODS.forEach(m=>{const gr=gradeOf(L,m);let g=gr.g;if((g==='rec'||g==='ok')&&!usable(L,m))g='na';groups[g].push({m,gr})});
  const opt=({m,gr},on)=>{const lvs=m.lv?LVS.filter(([k])=>goOf(L,m,k)):[];
    return `<div class="mopt ${on?'':'off'}"><div class="mopt-top"><span class="mopt-n">${m.n}</span><b>${esc(m.name)}</b>${on&&!m.lv?`<button type="button" class="btn ${gr.g==='rec'?'primary':''}" data-m="${m.id}">${sel&&sel.m.id===m.id?'مختارة':'اختر'}</button>`:''}</div>
     ${gr.why?`<p class="mopt-why">${esc(gr.why)}</p>`:''}
     ${on&&m.lv?`<div class="mopt-lv"><span class="sub">نوع الاكتشاف:</span>${lvs.map(([k,t])=>`<button type="button" class="btn ${gr.lv===k?'primary':''}" data-m="${m.id}" data-lv="${k}">${t}${gr.lv===k?' (موصى به)':''}</button>`).join('')}</div>${m.lv.free&&lvs.some(x=>x[0]==='free')?`<p class="mopt-warn">${esc(m.lv.free.warn)}</p>`:''}`:''}</div>`};
  let h='';
  if(groups.rec.length)h+=`<h3 class="mg mg-rec">موصى بها</h3>${groups.rec.map(x=>opt(x,true)).join('')}`;
  if(groups.ok.length)h+=`<h3 class="mg">مناسبة أيضاً</h3>${groups.ok.map(x=>opt(x,true)).join('')}`;
  if(groups.no.length)h+=`<h3 class="mg mg-no">لا تناسب هذا الدرس</h3>${groups.no.map(x=>opt(x,false)).join('')}`;
  if(groups.na.length)h+=`<h3 class="mg mg-no">لم تُجهّز لهذا الدرس بعد</h3>${groups.na.map(x=>opt(x,false)).join('')}`;
  const tail=[...groups.phase2.map(x=>x.m.name+' (مرحلة ثانية)'),...groups.soon.map(x=>x.m.name+' (قريباً)')];
  if(tail.length)h+=`<h3 class="mg mg-no">لاحقاً</h3><p class="mopt-later">${tail.map(esc).join('، ')}</p>`;
  h+=`<div class="msheet-f">${sel?'<button type="button" class="btn" data-mexit>إنهاء الطريقة (الدرس كالمعتاد)</button>':''}<span class="mpath-sp"></span><span class="sub">المدرب: <b data-trname>${esc(TR.name)}</b></span> <button type="button" class="linkbtn" data-trout>خروج</button></div>`;
  return h}
function openPick(L){const sel=getSel(L);const s=sheet('mpick','اختر طريقة التدريب',pickHTML(L,sel));
  s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.m){setSel(L,b.dataset.m,b.dataset.lv||null);closeSheets();rerender();setTimeout(()=>stepGo(L,0,true),0);return}
    if(b.hasAttribute('data-mexit')){setSel(L,null);closeSheets();rerender();return}
    if(b.hasAttribute('data-trout')){signOut();return}})}
function listHTML(L,sel){const S=stepsOf(sel.m,sel.lv),G=goOf(L,sel.m,sel.lv),cur=getStep(L,S.length);
  return `<details class="mdef"><summary>تعريف «${esc(sel.m.name)}» من الدليل</summary><p>${esc(sel.m.def)}${sel.m.rule?` <span class="mrule">${esc(sel.m.rule)}</span>`:''}</p></details>
   ${sel.lv&&sel.m.lv[sel.lv].warn?`<p class="mopt-warn">${esc(sel.m.lv[sel.lv].warn)}</p>`:''}
   <ol class="mlist">${S.map((st,i)=>`<li class="${i===cur?'on':''}" data-i="${i}"><span class="mlist-n">${i+1}</span><div><b>${esc(st.t)}</b>${st.note?' <span class="mnote">ملاحظة الدليل</span>':''}<p>${esc(st.g)}</p>
     <div class="mlist-go">${G[i].map((t,j)=>`<button type="button" class="btn ${j?'':'primary'}" data-go="${i}" data-j="${j}">اذهب: ${esc(tLabel(t))}</button>`).join('')}</div></div></li>`).join('')}</ol>
   <div class="msheet-f"><button type="button" class="btn primary" data-plan>خطة الدرس المقترحة</button><button type="button" class="btn" data-pick>تغيير الطريقة</button></div>`}
function openList(L){const sel=getSel(L);if(!sel)return openPick(L);const s=sheet('mlistsh','خطوات «'+selName(sel)+'»',listHTML(L,sel));
  const on=$('.mlist li.on',s);if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest'});
  s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.go!=null){const i=+b.dataset.go,j=+b.dataset.j;closeSheets();stepGo(L,i,false,j);return}
    if(b.hasAttribute('data-plan')){closeSheets();openPlan(L,sel);return}
    if(b.hasAttribute('data-pick')){openPick(L);return}})}
/* الانتقال إلى خطوة: يحدّث الشريط ثم ينقل إلى هدفها */
function stepGo(L,i,quiet,j){const sel=getSel(L);if(!sel)return;const S=stepsOf(sel.m,sel.lv),G=goOf(L,sel.m,sel.lv);if(i<0||i>=S.length)return;
  setStep(L,i);paintBar(L);goTo(G[i][j||0],quiet)}

let BAR=null;
function paintBar(L){if(!BAR)return;const sel=getSel(L);BAR.innerHTML=barHTML(L,sel);BAR.classList.toggle('has-m',!!sel);syncH()}
function syncH(){const h=BAR&&!BAR.hidden?BAR.offsetHeight:0,tb=$('.topbar'),de=document.documentElement.style;de.setProperty('--mpath-h',h+'px');if(tb)de.setProperty('--mpath-top',Math.round(tb.getBoundingClientRect().height)+'px')}
window.addEventListener('resize',syncH);
function paintHide(L){const hb=$('#mShow');const hd=hidden();if(BAR)BAR.hidden=hd;document.documentElement.toggleAttribute('data-mhide',hd);
  if(hd&&!hb){const b=document.createElement('button');b.type='button';b.id='mShow';b.className='mshow';b.innerHTML=ICO.path+'<span>طرق التدريب</span>';b.setAttribute('aria-label','إظهار شريط طرق التدريب');
    b.addEventListener('click',()=>{LS.set(HKEY,false);paintHide(L)});document.body.appendChild(b)}
  if(!hd&&hb)hb.remove();syncH()}

/* ===================== خطة الدرس المقترحة (للطباعة) ===================== */
const STS=L=>Array.isArray(L.stations)?L.stations.filter(s=>s&&s.st):[];
const blocksOf=s=>[...(s.side||[]),...(s.body||[])];
/* أهداف الدرس: من محطة «الأهداف/الغرض»، أو من الشرح الرسمي، وإلا ملخص الدرس */
function objectives(L){
  const tmp=document.createElement('div');
  const lis=html=>{tmp.innerHTML=html;const x=[...tmp.querySelectorAll('li')].map(li=>li.innerHTML.trim()).filter(Boolean);
    if(x.length)return x;const p=[...tmp.querySelectorAll('p')].map(e=>e.innerHTML.trim()).filter(t=>t&&!/^<b>[^<]*<\/b>:?$/.test(t)&&!/class="ltr"/.test(t));return p.slice(0,3)};
  const s=STS(L).find(s=>/أهداف|الغرض|الهدف/.test(s.short||s.title||''));
  if(s){const html=blocksOf(s).filter(b=>b.book!=null).map(b=>b.book).join('');const x=lis(html);if(x.length)return x}
  for(const b of (L.theory||[]))if(b.html&&/أهداف|الغرض/.test(b.html)){const x=lis(b.html);if(x.length)return x}
  return L.summary?[L.summary]:[];
}
/* أدوات القياس الموجودة فعلاً في الدرس (للسؤال 9) */
function assessOf(L){const off=new Set((Array.isArray(G.ACT_OFF)?G.ACT_OFF:[]).map(String)),A=B.ACTS[L.id]||{},ch=B.chLab&&B.chLab(L)&&B.CHAL[L.id]||null;
  const q=(L.quiz||[]).length,ex=(A.exit||[]).length,fa=off.has('fault')||!ch?0:(ch.faults||[]).length,si=off.has('sim')||!ch?0:(ch.outputs||[]).length,er=off.has('errs')?0:(B.ERRS[L.id]||[]).length;
  const SL=((B.STUDY||{}).lessons||{})[L.id]||{};
  return [q&&`أسئلة «اختبر نفسك» (${q})، وتصلح مسابقةً حية من الأنشطة التفاعلية`,!off.has('exit')&&`تذكرة الخروج${ex?` (${ex} أسئلة جاهزة)`:''}`,fa&&`«اكتشف العطل» (${fa} أعطال)`,si&&'«تحدي المحاكاة»',er&&`«اكتشف الخطأ» (${er})`,
    (SL.order||[]).length&&'«رتّب خطوات التجربة»',(SL.match||[]).length&&'«وصّل أطراف الدائرة»',q&&'«اختبار قبل وبعد الدرس» (ذاتي)'].filter(Boolean)}
const QS=[
 ['المرحلة الأولى: قياس مدى ملاءمة طريقة التدريب في تحقيق أهداف الموضوع التدريبي',['ما الغاية من التجربة وما هو هدفها؟','هل هذا التمرين أو التجربة تحقق الهدف المطلوب؟','ما هي المهارة التي سيتعلمها (سيكتسبها) المتدرب؟','هل هناك أسلوب أو تمرين آخر يحقق هذه المهارة؟ وما هو؟']],
 ['المرحلة الثانية: البدء في التخطيط للاستفادة من طريقة التدريب المحددة',['هل تمت تهيئة مكان التدريب وتجهيز المستلزمات اللازمة لتطبيق التمرين أو التجربة؟','كيف سأبدأ وماذا سأفعل وكيف سأنتهي؟','ما هو دور المتدرب المتوقع مع كل خطوة أخطوها؟']],
 ['المرحلة الثالثة: تحديد ووضع أساليب للتقويم ومعايير لقياس أداء المتدربين',['هل سيتعلم (سيكتسب) المتدربون المهارات والمعارف المحددة؟','كيف أقيس وأقيّم أداء المتدربين؟','كيف أقوّم أداء المتدربين؟']],
 ['المرحلة الرابعة: قياس مدى فاعلية طريقة التدريب المنفذة في تحسين أداء المتدربين',['ماذا سأفعل لو أخفق المتدربون؟','ماذا لو أخفق جزء من العدد الكلي للمتدربين؟','متى سأعتبر طريقة التدريب المنفذة غير مناسبة للموضوع التدريبي؟','كيف سأنتقل إلى المهارة الجديدة؟']]];
function planHTML(L,sel){
  const m=sel.m,S=stepsOf(m,sel.lv),Gs=goOf(L,m,sel.lv),u=B.UNITS.find(x=>x.n===L.unit)||{title:''},obj=objectives(L),as=assessOf(L);
  const parts=i=>Gs[i].map(tLabel);
  /* الأسئلة التي تُعبّأ من الدرس فقط: 3 و6 و7 و9 */
  const FILL={
   3:obj.length?`<ol>${obj.map(x=>`<li>${U(x)}</li>`).join('')}</ol><p class="mp-src">من أهداف الدرس في المكتبة.</p>`:'',
   6:`<ol>${S.map((s,i)=>`<li>${i===0?'أبدأ بـ':i===S.length-1?'وأنتهي بـ':''}«${esc(s.t)}»: ${esc(parts(i).join('، ثم '))}</li>`).join('')}</ol><p class="mp-src">من خطوات الطريقة وأجزاء الدرس التي تخدمها.</p>`,
   7:`<ol>${S.map((s,i)=>`<li>«${esc(s.t)}»: يعمل المتدرب في ${esc(parts(i)[0])}</li>`).join('')}</ol><p class="mp-src">الجزء الذي يعمل فيه المتدرب في كل خطوة. اكتب دوره بالتفصيل إن أردت.</p>`,
   9:as.length?`<ul>${as.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="mp-src">أدوات القياس الموجودة في الدرس.</p>`:''};
  let qn=0;
  const D=new Date();
  return `<article class="mplan" dir="rtl">
   <header class="mp-head"><div class="mp-org"><b>المملكة العربية السعودية</b><b>المؤسسة العامة للتدريب التقني والمهني</b>${META.dept?`<span>${esc(META.dept)}</span>`:''}</div>
    <div class="mp-title"><small>خطة الدرس المقترحة</small><h1>طريقة ${esc(selName(sel))}</h1></div></header>
   <table class="mp-info"><tr><th>المقرر</th><td>${esc(B.COURSE.title)} ${B.COURSE.sc?`(<span class="ltr">${esc(B.COURSE.sc)}</span>)`:''}</td><th>الوحدة</th><td>${L.unit}: ${esc(u.title)}</td></tr>
    <tr><th>الدرس</th><td>${L.unit}.${L.order} ${esc(L.title)}</td><th>الصفحات</th><td>${esc(L.pages||'')}</td></tr>
    <tr><th>المدرب</th><td>${esc(TR?TR.name:'')}</td><th>الشعبة / التاريخ</th><td class="blank"></td></tr></table>
   <h2>تعريف الطريقة (من الدليل)</h2><p class="mp-def">${esc(m.def)}</p>
   <h2>خطوات تنفيذ الدرس (خطوات الدليل)</h2><table class="mp-t mp-steps"><thead><tr><th>#</th><th>خطوة الدليل</th><th>جزء الدرس في المكتبة</th><th class="mp-time">الزمن</th><th class="mp-notes">ملاحظات المدرب</th></tr></thead>
    <tbody>${S.map((s,i)=>`<tr><td>${i+1}</td><td><b>${esc(s.t)}</b><div class="mp-g">${esc(s.g)}</div></td><td>${parts(i).map(esc).join('<br>')}</td><td class="mp-time"></td><td class="mp-notes"></td></tr>`).join('')}</tbody></table>
   <h2>إضاءات لاختيار طريقة التدريب (قائمة تحقق)</h2>
   ${QS.map(([st,qs])=>`<h3>${st}</h3><table class="mp-t mp-qa"><tbody>${qs.map(q=>{qn++;const f=FILL[qn];return `<tr><th><span class="mp-box" aria-hidden="true"></span>${qn}. ${q}</th><td class="${f?'':'blank'}">${f||''}</td></tr>`}).join('')}</tbody></table>`).join('')}
   <p class="mp-foot">أُعدّت هذه الخطة من خطوات دليل «طرائق ووسائل التدريب» (الإدارة العامة لشؤون المدربين، الإصدار الأول 1444 هـ) ومن محتوى الدرس في المكتبة الرقمية. الأسئلة 3 و6 و7 و9 معبّأة من الدرس، والباقي يعبّئه المدرب، وكذلك عمودا «الزمن» و«الملاحظات». · <span class="ltr">${D.getFullYear()}</span></p>
  </article>`;
}
function openPlan(L,sel){
  closePlan();
  const ov=document.createElement('div');ov.className='mplan-ov';ov.id='mplanOv';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','خطة الدرس المقترحة');
  ov.innerHTML=`<div class="mplan-bar"><b>خطة الدرس المقترحة</b><span class="sub">اطبعها أو احفظها PDF من نافذة الطباعة.</span><button type="button" class="btn primary" data-print>طباعة / PDF</button><button type="button" class="btn" data-close>إغلاق</button></div><div class="mplan-scroll">${planHTML(L,sel)}</div>`;
  document.body.appendChild(ov);document.documentElement.setAttribute('data-mplan','');
  B.math(ov);
  $('[data-print]',ov).addEventListener('click',()=>window.print());
  $('[data-close]',ov).addEventListener('click',closePlan);
  $('[data-close]',ov).focus();
}
function closePlan(){const o=$('#mplanOv');if(o)o.remove();document.documentElement.removeAttribute('data-mplan')}
window.addEventListener('hashchange',closePlan);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#mplanOv'))closePlan()});
/* الجوال: لا مكان لزر الدخول في الشريط العلوي، فيظهر رابط صغير أسفل فهرس المقرر */
B.homeHook=function(){const v=$('#view');if(!v)return;const p=document.createElement('p');p.className='tr-home';
  p.innerHTML=TR?`<span class="sub">المدرب: <b data-trname>${esc(TR.name)}</b></span> <button type="button" class="linkbtn">خروج</button>`:'<button type="button" class="linkbtn">دخول المدرب</button>';
  $('button',p).addEventListener('click',()=>TR?signOut():openAuth());v.appendChild(p)};

/* ===================== ربط الدرس ===================== */
B.lessonHook=function(C){
  CTX=null;BAR=null;const old=$('#mShow');if(old)old.remove();document.documentElement.removeAttribute('data-mhide');document.documentElement.style.removeProperty('--mpath-h');
  if(!signedIn()||!LD(C.L))return false;
  const L=C.L,root=C.root;CTX={L,root,tabs:C.tabs};
  const head=$('.lesson-head',root);if(!head)return false;
  BAR=document.createElement('section');BAR.className='mpath';BAR.setAttribute('aria-label','مسار طريقة التدريب (للمدرب فقط)');
  head.parentNode.insertBefore(BAR,head.nextSibling);
  paintBar(L);paintHide(L);
  BAR.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!BAR.contains(t)||t.disabled)return;
    if(t.hasAttribute('data-pick'))return openPick(L);
    if(t.hasAttribute('data-list'))return openList(L);
    if(t.hasAttribute('data-plan')){const s=getSel(L);if(s)openPlan(L,s);return}
    if(t.hasAttribute('data-hide')){LS.set(HKEY,true);paintHide(L);return}
    const sel=getSel(L);if(!sel)return;const n=stepsOf(sel.m,sel.lv).length,i=getStep(L,n);
    if(t.hasAttribute('data-next'))stepGo(L,Math.min(n-1,i+1));
    if(t.hasAttribute('data-prev'))stepGo(L,Math.max(0,i-1));
  });
  if(pendingGo){const pg=pendingGo;pendingGo=null;setTimeout(()=>goTo(pg.s,pg.quiet),0)}
  return false;
};
/* أنشطة الخادم (بطاقات «الأنشطة التفاعلية») تُفتح بدخول تلقائي للمدرب: رمز لمرة واحدة من /api/handoff، وإن فشل يُفتح الرابط العادي */
document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');if(!a||!TR||!base())return;
  if(a.href.indexOf(base()+'/host')!==0)return;
  if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey)return;
  e.preventDefault();
  const href=a.href,u=new URL(href),next=u.pathname+u.search,w=window.open('about:blank','_blank');
  const go=x=>{if(w&&!w.closed)w.location.href=x;else location.href=x};
  api('POST','/api/handoff',null,TR.token).then(r=>{
    go(r.ok&&r.j.code?base()+'/auth/handoff?code='+encodeURIComponent(r.j.code)+'&next='+encodeURIComponent(next):href);
  }).catch(()=>go(href));
});
/* للاختبارات والتوسعة */
B.METHODS={list:METHODS,data:DATA,stepsOf,goOf,gradeOf,usable,parseT,tLabel,goTo,findIn,objectives,assessOf,planHTML,openPlan,getSel};
})(window);
