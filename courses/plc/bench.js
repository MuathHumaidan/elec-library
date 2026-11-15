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
  const kind=/^K/i.test(sym)?'coil':/^Y\d/i.test(sym)?'valve':'lamp';
  const color=/^G/i.test(sym)?'green':/^R/i.test(sym)?'red':/^Y/i.test(sym)?'yellow':'amber';
  outAddrs.push(a);outputs.push({sym,desc:r.desc||'',addr:a,kind,color})});
 const inAddrs=[...inSet].sort((x,y)=>parseFloat(x.slice(1))-parseFloat(y.slice(1)));
 outAddrs.sort((x,y)=>parseFloat(x.slice(1))-parseFloat(y.slice(1)));outputs.sort((x,y)=>parseFloat(x.addr.slice(1))-parseFloat(y.addr.slice(1)));
 return {inputs,outputs,extras,inAddrs,outAddrs}}

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
 'pwr-off-run':{t:'فصلت المصدر والـ PLC في RUN',why:'حوّل الـ PLC إلى STOP أولاً (تتوقف المخارج بأمان)، ثم افصل المصدر.'}
};

/* ---- التجربة ---- */
function exp(L,sp){
 const IN=sp.inputs,OUT=sp.outputs,EX=sp.extras,steps0=(L.steps||[]);
 const X={powerSw:['PWR'],mistakes:MZ,
  figure:()=>figSVG(sp),figureTitle:'مخطط توصيل الـ PLC — من جدول المداخل والمخارج',
  init:()=>{const vk=benchVar(L);return {vk,P:B.createPLC(progOf(L,vk)),seen:{},used:{},plant:L.plant&&L.plant.init?L.plant.init():{},stepI:0,t:0,everOn:false,everRun:false,phys:{},inV:{},lastSig:'',ok:{}}},
  note:'وصّل وأنت المصدر مفصول. ثم شغّل المصدر، وحوّل الـ PLC إلى RUN، ونفّذ خطوات الكتاب بضواغط اللوحة. البرنامج محمّل مسبقاً كما في الكتاب.'};
 /* اتحاد العقد: الأسلاك + التلامسات المغلقة */
 function graph(a,closed){const nt=a.nets(),of=nt.of,par={};const f=x=>{while(par[x]!=null&&par[x]!==x)x=par[x];return x};
  const id=t=>of[t]!=null?'n'+of[t]:'t'+t;const u=(x,y)=>{const a1=f(id(x)),b1=f(id(y));if(a1!==b1)par[a1]=b1};
  if(closed)IN.forEach((d,i)=>{if(closed[i])u('D'+i+'.a','D'+i+'.b')});
  return t=>f(id(t))}
 const swOf=(a,i)=>!!a.S.sw['SW'+i];
 function st(a,ph,Qphys){const P=ph.P,g=x=>P.get(N(x));
  const btn=k=>{const i=IN.findIndex(d=>d.key===k);if(i>=0&&IN[i].kind!=='sensor')return a.S.sw['SW'+i]?1:0;const j=EX.findIndex(e=>e.key===k);return j>=0&&a.S.sw['X'+j]?1:0};
  return {plc:P,plant:ph.plant,t:ph.t,btn,I:g,M:g,get:g,Q:x=>{x=N(x);return isQ(x)?(Qphys[x]?1:0):g(x)},T:x=>P.tim[x]||{q:0,el:0,tv:0,run:0},C:x=>P.cnt[x]||{v:0},name:()=>0,variant:L._variant}}
 X.tick=a=>{const ph=a.S.phys,P=ph.P,on=a.sw('PWR'),run=on&&a.sw('RUN');ph.t+=a.dt;
  /* قيم الأجهزة المنطقية (نفس قواعد لوحة «المختبر») */
  const Qprev=ph.Qphys||{};const s0=st(a,ph,Qprev);
  const val=IN.map((d,i)=>{let v;if(d.kind==='sensor'){v=d.src.from?(d.src.from(s0)?1:0):0}else v=a.S.sw['SW'+i]?1:0;if(d.src.invert)v=1-v;return v});
  const gW=graph(a,null),gC=graph(a,val);
  const plus=gC('P+'),minus=gC('P-');
  if(on&&plus===minus)a.mistake('psu-short');
  /* المداخل */
  const comOK=gC('IM')===minus;const inV={};sp.inAddrs.forEach(ad=>{inV[ad]=on&&comOK&&gC(ad)===plus?1:0});
  sp.inAddrs.forEach(ad=>{if(on&&gW(ad)===gW('P+'))a.once('input-bypass')});
  /* البرنامج */
  sp.inAddrs.forEach(ad=>P.set(ad,inV[ad]));
  if(run){P.scan(a.dt);ph.everRun=true}
  if(!on&&ph.wasOn){P.reset()}ph.wasOn=on;if(on)ph.everOn=true;
  /* المخارج */
  const outPow=on&&gC('QL')===plus&&gC('QM')===minus;
  const qBit={};sp.outAddrs.forEach(ad=>{qBit[ad]=run&&P.get(ad)?1:0});
  const pot=net=>{if(net===plus)return '+';if(net===minus)return '0';const q=sp.outAddrs.filter(ad=>gC(ad)===net);if(q.length&&outPow&&q.some(ad=>qBit[ad]))return 'q';return ''};
  sp.outAddrs.forEach((ad,k)=>{const n=gC(ad);
   if(on&&n===minus&&qBit[ad]&&outPow)a.mistake('out-short');
   if(on&&n===plus)a.once('out-backfeed');
   sp.outAddrs.forEach((bd,j)=>{if(j>k&&gC(bd)===n&&on&&qBit[ad]!==qBit[bd])a.once('out-joined')})});
  const Qphys={},ldOn=[];
  OUT.forEach((d,i)=>{const p1=pot(gC('L'+i+'.1')),p2=pot(gC('L'+i+'.2'));const e=on&&((p1==='q'||p1==='+')&&p2==='0'||(p2==='q'||p2==='+')&&p1==='0');ldOn[i]=e;
   if(e&&(p1==='+'||p2==='+'))a.once('load-direct');if(e)Qphys[d.addr]=1});
  ph.Qphys=Qphys;
  /* الجهاز */
  const s=st(a,ph,Qphys);ph.s=s;
  if(L.plant&&L.plant.step)try{L.plant.step(a.dt,s,ph.plant)}catch(err){}
  if(run){sp.inAddrs.forEach(ad=>{(ph.seen[ad]=ph.seen[ad]||{})[inV[ad]]=1});OUT.forEach((d,i)=>{if(ldOn[i])ph.used[d.addr]=1})}
  /* القراءات: لمبات الحالة */
  const r={pwr:on,run};sp.inAddrs.forEach(ad=>r['li:'+ad]=inV[ad]);sp.outAddrs.forEach(ad=>r['lq:'+ad]=qBit[ad]&&outPow);
  IN.forEach((d,i)=>{if(d.kind==='sensor')r['dv'+i]=val[i]});OUT.forEach((d,i)=>r['ld'+i]=ldOn[i]);
  ph.r=r;return r};
 /* فحص مطابقة التوصيل للجدول (يُستدعى عند تشغيل المصدر أو RUN) */
 function audit(a){const g=graph(a,null);const bad=[],rail=n=>n===g('P+')||n===g('P-');
  IN.forEach((d,i)=>{[g('D'+i+'.a'),g('D'+i+'.b')].forEach(n=>{if(rail(n))return;sp.inAddrs.forEach(ad=>{if(ad!==d.addr&&g(ad)===n)bad.push(d.sym+' على '+ad+' (الجدول: '+d.addr+')')})})});
  OUT.forEach((d,i)=>{[g('L'+i+'.1'),g('L'+i+'.2')].forEach(n=>{if(rail(n))return;sp.outAddrs.forEach(ad=>{if(ad!==d.addr&&g(ad)===n)bad.push(d.sym+' على '+ad+' (الجدول: '+d.addr+')')})})});
  if(bad.length)a.once('wrong-io',{why:MZ['wrong-io'].why+' الملاحظ: '+bad.slice(0,3).join('، ')+'.'})}
 const wiredIn=a=>{const g=graph(a,null);return IN.every((d,i)=>{const na=g('D'+i+'.a'),nb=g('D'+i+'.b'),p=g('P+'),q=g(d.addr);return (na===p&&nb===q)||(nb===p&&na===q)})};
 const wiredOut=a=>{const g=graph(a,null);return OUT.every((d,i)=>{const n1=g('L'+i+'.1'),n2=g('L'+i+'.2'),m=g('P-'),q=g(d.addr);return (n1===q&&n2===m)||(n2===q&&n1===m)})};
 const wiredPsu=a=>{const g=graph(a,null);return g('IM')===g('P-')&&g('QM')===g('P-')&&g('QL')===g('P+')};
 X.onSwitchOn=(id,a)=>{if(id==='PWR')audit(a);if(id==='RUN'){audit(a);if(a.sw('PWR')&&!(wiredPsu(a)&&wiredIn(a)&&wiredOut(a)))a.once('run-early')}};
 X.onSwitchOff=(id,a)=>{if(id==='PWR'&&a.sw('RUN'))a.mistake('pwr-off-run')};
 const need=a=>{const U=usedAddrs(a.S.phys.P);return {ins:sp.inAddrs.filter(ad=>U.has(ad)),outs:sp.outAddrs.filter(ad=>U.has(ad))}};
 const insDone=a=>need(a).ins.every(ad=>{const z=a.S.phys.seen[ad];return z&&z[0]&&z[1]});
 const outsDone=a=>need(a).outs.every(ad=>a.S.phys.used[ad]);
 const bookDone=a=>insDone(a)&&outsDone(a);
 const nm=ad=>{const d=IN.find(x=>x.addr===ad)||OUT.find(x=>x.addr===ad);return d?esc(d.sym):ad};
 X.steps=[
  {t:'وصّل المصدر بقضيبي التوزيع (+24 V إلى القضيب الأحمر و 0 V إلى الرمادي)، ثم تغذية الـ PLC: <b>+</b> إلى <b>2L+</b>، و <b>−</b> إلى <b>1M</b> و <b>2M</b>.',done:wiredPsu},
  {t:'وصّل المداخل حسب جدول المداخل والمخارج: من القضيب <b>+</b> إلى طرف تلامس كل جهاز، ومن طرفه الآخر إلى عنوانه ('+IN.map(d=>esc(d.sym)+' ← '+d.addr).join('، ')+').',done:wiredIn},
  {t:'وصّل المخارج: كل مخرج إلى الطرف الأول لحمله، والطرف الثاني إلى القضيب <b>−</b> ('+OUT.map(d=>d.addr+' ← '+esc(d.sym)).join('، ')+').',done:wiredOut},
  {t:'شغّل المصدر، ثم حوّل الـ PLC من STOP إلى <b>RUN</b>.',done:a=>a.S.phys.everRun}]
  .concat([{t:'جرّب كل جهاز دخل يستعمله البرنامج (اضغط، حرّك، أو انتظر الحسّاس)، وتأكد أن لمبة مدخله على الـ PLC تضيء وتنطفئ.',done:insDone,live:a=>{const z=need(a).ins.filter(ad=>{const q=a.S.phys.seen[ad];return !(q&&q[0]&&q[1])});return z.length?'باقي: '+z.map(nm).join('، '):''}},
   {t:'شغّل الجهاز بترتيب خطوات الكتاب (القائمة تحت «الجهاز») حتى يعمل كل حمل مرة على الأقل.',done:outsDone,live:a=>{const z=need(a).outs.filter(ad=>!a.S.phys.used[ad]);return z.length?'باقي: '+z.map(nm).join('، '):''}}])
  .concat([{t:'أعد الـ PLC إلى <b>STOP</b>، ثم افصل المصدر.',done:a=>bookDone(a)&&!a.sw('RUN')&&!a.sw('PWR')}]);
 X.complete=a=>wiredPsu(a)&&wiredIn(a)&&wiredOut(a)&&bookDone(a)&&!a.sw('RUN')&&!a.sw('PWR');
 /* لوحة الجهاز */
 const p=L.plant;
 X.view={title:(p&&p.title)||'الجهاز والدائرة الرئيسة',
  mount(el,a){let h='';
   if(L.variants){const ks=varKeys(L);h+=`<label class="sub">البرنامج المحمّل في الـ PLC: <select data-var>${ks.map(k=>`<option value="${k}"${k===a.S.phys.vk?' selected':''}>${esc(strip(L.variants[k].label||k))}</option>`).join('')}</select></label><p class="sub" data-varmsg></p>`}
   if(p){h+=`<p class="sub" data-pl></p>`;if(p.view==='motor')h+=`<div class="motor-row"><div>${B.W.motor('bnRotor',130)}${p.nameplate?`<div class="nameplate">${p.nameplate}</div>`:''}</div><div data-pv></div></div>`;else h+=`<div class="plant-view" data-pv></div>`}
   if(L.power)h+=`<h4 class="sm">الدائرة الرئيسة (تتبع حالة المتممات الموصّلة)</h4><div class="svgbox" data-pw></div>`;
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
   const sig=JSON.stringify([ph.Qphys,p&&p.sig?p.sig(ph.plant):0,Object.entries(ph.P.tim).map(([k,v])=>[k,v.q,v.run]),Object.entries(ph.P.cnt).map(([k,v])=>[k,v.v]),a.S.sw]);
   if(sig===ph.lastSig)return;ph.lastSig=sig;
   if(p&&p.render&&pv)try{p.render(pv,s,ph.plant,B)}catch(e){}
   const lb=el.querySelector('[data-pl]');if(lb&&p&&p.label)try{lb.textContent=p.label(ph.plant,s)||''}catch(e){}
   const pw=el.querySelector('[data-pw]');if(pw&&L.power)try{pw.innerHTML=L.power(s,B)}catch(e){}}};
 return X}

/* ---- الربط بالدروس: كل درس له برنامج ومداخل ومخارج رقمية ---- */
B.LESSONS.forEach(L=>{if(L.bench||!L.inputs||!L.plant&&!L.program&&!L.variants)return;
 const prog=curProgram(L);if(!prog||!prog.length)return;
 const sp=specOf(L);if(!sp.inputs.length||!sp.outputs.length)return;
 if((L.io||[]).some(r=>/^P?IW/i.test(N(r.addr))))return;/* مداخل تناظرية: خارج هذه المرحلة */
 L.bench=el=>{const ly=BENCH_LAYOUTS.plc(sp);
  B.BENCH.mount(el,{key:L.id,title:'المنضدة الافتراضية: '+strip(L.title),layout:ly,exp:exp(L,sp),
   intro:'وصّل لوحة الـ PLC بنفسك حسب جدول المداخل والمخارج، ثم شغّلها ونفّذ خطوات الكتاب. البرنامج محمّل مسبقاً كما في الكتاب، فإذا لم يعمل الجهاز كما يجب فالسبب في توصيلك. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.'})}});
B.PLCBENCH={specOf,figSVG,curProgram};
})(PLCBOOK);
