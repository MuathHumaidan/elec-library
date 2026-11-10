/* Unit 4 — التحكم في سرعة المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء (ص 85–96) */
(function(B){
const {S,clamp}=B;

/* ================= shared model & drawings ================= */
// illustrative rotor model (per-unit). Not from the book: chosen so that the book's example (100 A nominal, 400–600 A direct start) is reproduced.
const NS=1500, RR=0.03, REXT=[0.083,0.12,0.167], XR=0.17, INOM=100;
// short point: 0 = K2 (before R1) · 1 = K3 (after R1) · 2 = K4 (after R2) · 3 = nothing (star after R3)
const stageOf=(K2,K3,K4)=>K2?0:K3?1:K4?2:3;
const rext=sp=>{let s=0;for(let j=1;j<=sp;j++)s+=REXT[j-1];return s};
const Rtot=sp=>RR+rext(sp);
const Ipu=(n,Rt)=>{const s=clamp(1-n/NS,0.002,1),a=Rt/s;return 1/Math.sqrt(a*a+XR*XR)};
const nTarget=sp=>NS*(1-Rtot(sp));
const STAGE_TXT=['لا شيء (الدائر مقصور)','R1','R1 + R2','R1 + R2 + R3'];
const STAGE_SHORT=['قصر كامل','R1','R1+R2','R1+R2+R3'];

/* ===== قيم المدرب للمختبرات التي يشغّلها المحرك المشترك (engine labs) — نفس المساعد في u3.js =====
   الشريط يُحقن أعلى المختبر (قبل .grid) عند أول إطار، والقيم تُقرأ من التخزين منذ init حتى يعمل تبويب البرنامج أيضاً. */
function engineTP(p,id,defs,opt){opt=opt||{};
  const D={id,defs,v:Object.fromEntries(defs.map(d=>[d.k,d.value])),trainer:false,ver:0,P:null,msg:[],txt:opt.txt||{}};
  const pull=()=>{D.v=D.P.v;D.trainer=D.P.trainer;D.msg=[];opt.apply&&opt.apply(D);D.P.warn&&D.P.warn(D.trainer&&D.msg.length?D.msg.join('<br>'):'')};
  const dom=body=>{body.querySelectorAll('[data-tpv]').forEach(e=>{const f=D.txt[e.dataset.tpv];if(f)e.textContent=f()});opt.dom&&opt.dom(body,D)};
  opt.apply&&opt.apply(D);
  const in0=p.init;p.init=()=>{if(!D.P){D.P=B.params(document.createElement('div'),id,defs);pull()}return in0()};
  const fr0=p.frame;p.frame=(el,s,pl,BB)=>{fr0&&fr0(el,s,pl,BB);const body=el&&el.closest('#tab-body');
    if(body&&!body.querySelector('[data-tphost]')){const g=body.querySelector('.grid');if(!g)return;const h=document.createElement('div');h.setAttribute('data-tphost',id);g.parentNode.insertBefore(h,g);
      D.P=B.params(h,id,defs,()=>{pull();D.ver++;dom(body)});pull();D.ver++;dom(body)}};
  const sg0=p.sig;p.sig=pl=>(sg0?sg0(pl):'')+'|tp'+D.ver;
  D.span=k=>`<span data-tpv="${k}">${D.txt[k]()}</span>`;
  p.tp=D;return D;
}
const niceAxis=(top,base,st0)=>{const steps=[st0,20,50,100,200,500,1000,2000];let st=steps.find(s=>s>=st0&&Math.ceil(top/s)<=7)||2000;const y=Math.max(base,Math.ceil(top/st)*st);st=steps.find(s=>s>=st0&&y/s<=7&&y%s===0)||st;const t=[];for(let v=0;v<=y+1e-9;v+=st)t.push(v);return {ymax:y,ticks:t}};
/* model in per-unit: M={ns, rt:[Rtot stage 0..3], xr}. Default = the constants above (unchanged behaviour). */
const MDEF={ns:NS,rt:[0,1,2,3].map(Rtot),xr:XR};
const IpuM=(n,Rt,M)=>{const s=clamp(1-n/M.ns,0.002,1),a=Rt/s;return 1/Math.sqrt(a*a+M.xr*M.xr)};
const rotorDefs=()=>[
  {k:'Ist',label:'تيار البدء المباشر بدون مقاومات (K2 مغلق)',unit:'A',value:580,min:150,max:3000,step:10,hint:'التيار الاسمي 100 A من مثال الكتاب ثابت'},
  {k:'n3',label:'السرعة التي يستقر عندها مع R1 + R2 + R3',unit:'rpm',value:900,min:50,max:3500,step:0.5,hint:'أقل من السرعة مع R1 + R2'},
  {k:'n2',label:'السرعة التي يستقر عندها مع R1 + R2',unit:'rpm',value:1150.5,min:50,max:3500,step:0.5,hint:'أقل من السرعة مع R1'},
  {k:'n1',label:'السرعة التي يستقر عندها مع R1 فقط',unit:'rpm',value:1330.5,min:50,max:3500,step:0.5,hint:'أقل من السرعة الاسمية'},
  {k:'n0',label:'السرعة الاسمية (العضو الدائر مقصور)',unit:'rpm',value:1455,min:50,max:3590,step:1,hint:'أقل من سرعة المجال الدوار'},
  {k:'ns',label:'سرعة المجال الدوار (السرعة التزامنية)',unit:'rpm',value:1500,min:300,max:3600,step:1},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1.1,min:0.1,max:20,step:0.1}];
/* ترتيب السرعات: R1+R2+R3 < R1+R2 < R1 < الاسمية < المجال الدوار. أي تصحيح يُكتب في msg ليظهر للمدرب */
function rotorModel(v,msg){const ns=v.ns,f=x=>String(B.round(x,1));
  let n0=v.n0;
  if(n0>ns-1){n0=ns-1;msg.push(`السرعة الاسمية يجب أن تكون أقل من سرعة المجال الدوار (<span class="ltr">${f(ns)} rpm</span>)، فاستعملنا <span class="ltr">${f(n0)} rpm</span>.`)}
  else if(n0<ns*0.05){n0=Math.ceil(ns*0.05);msg.push(`السرعة الاسمية صغيرة جداً مقارنة بسرعة المجال الدوار (<span class="ltr">${f(ns)} rpm</span>)، فاستعملنا <span class="ltr">${f(n0)} rpm</span>.`)}
  const ns_=[n0];const nm=['R1 فقط','R1 + R2','R1 + R2 + R3'],up=['السرعة الاسمية','السرعة مع R1 فقط','السرعة مع R1 + R2'];
  [v.n1,v.n2,v.n3].forEach((n,j)=>{const lim=ns_[j];if(n>lim-1){n=lim-1;msg.push(`السرعة مع ${nm[j]} يجب أن تكون أقل من ${up[j]} (<span class="ltr">${f(lim)} rpm</span>)، فاستعملنا <span class="ltr">${f(n)} rpm</span>.`)}ns_.push(n)});
  const rt=ns_.map(n=>Math.min(0.995,Math.max(1e-4,1-n/ns)));
  let Ist=v.Ist;const Imax=INOM/Math.sqrt(rt[0]*rt[0]+1e-4);
  if(Ist>Imax){Ist=Math.floor(Imax);msg.push(`تيار البدء المباشر لا يمكن أن يزيد على <span class="ltr">${f(Ist)} A</span> مع هذه السرعة الاسمية وسرعة المجال الدوار، فاستعملنا <span class="ltr">${f(Ist)} A</span>.`)}
  const q=INOM/Ist;const xr=Math.sqrt(Math.max(q*q-rt[0]*rt[0],1e-4));return {ns,rt,xr}}

// الشكل (1-4): K1 + F4 to the stator; rotor lines through R1 → R2 → R3 (star at the end); K2 / K3 / K4 short the rotor before R1 / after R1 / after R2
function powerRotor(K1,K2,K3,K4){
  const sp=stageOf(K2,K3,K4),run=!!K1;
  const sup=S.cls(1,run),k1o=S.cls(K1,run);
  const cols=[70,95,120],bus=[24,40,56],ly=[285,300,315];
  const taps=[[170,185,200],[305,320,335],[405,420,435]],starX=520;
  const rx=[[250,290],[350,390],[450,490]];
  let s=`<svg viewBox="0 0 580 372" role="img" aria-label="الدائرة الرئيسة للمحرك ذي العضو الدائر الملفوف">`;
  bus.forEach((y,i)=>{s+=S.w(`M36 ${y}H250`,sup)+S.t(22,y+4,'L'+(i+1))});
  cols.forEach((x,i)=>{s+=S.w(`M${x} ${bus[i]}V72`,sup)+S.dot(x,bus[i])+S.fuse(x,72,sup)+S.w(`M${x} 96V140`,sup)+S.vC(x,140,172,{closed:K1,inC:sup,outC:k1o})+S.w(`M${x} 172V187`,k1o)+S.thermal(x,195,k1o)});
  s+=S.t(140,89,'F1...3','m','start')+S.mech(58,128,156)+S.t(52,160,'K1','','end')+S.t(52,212,'F4','','end');
  // stator leads into the motor
  s+=S.w('M70 227V274',k1o)+S.w('M95 227V264',k1o)+S.w('M120 227V274',k1o);
  s+=`<circle cx="95" cy="300" r="36" class="coil ${run?'on':''}"/><circle cx="95" cy="300" r="29" class="sym" fill="none"/>`+S.t(95,298,'M')+S.t(95,313,'3~');
  // rotor lines, segment by segment
  const segX=i=>[i===1?131:128,taps[0][i],taps[1][i],taps[2][i],starX];
  ly.forEach((y,i)=>{const X=segX(i);
    for(let j=0;j<4;j++){const c=run&&j<=sp?'flow':'';s+=S.w(`M${X[j]} ${y}H${X[j+1]}`,c)}
    s+=S.t(140,y-4,['K','L','M'][i],'m','start');
    rx.forEach(([a,b],j)=>{const inC=j+1<=sp;s+=`<rect x="${a}" y="${y-5}" width="${b-a}" height="10" rx="1.5" class="sym" fill="var(--surface)" ${inC&&run?'stroke="var(--live)" stroke-width="2.4"':inC?'':'opacity=".45"'}/>`});
  });
  s+=S.w(`M${starX} 285V315`,run&&sp===3?'flow':'')+S.dot(starX,285)+S.dot(starX,300)+S.dot(starX,315);
  ['R1','R2','R3'].forEach((r,j)=>{const inC=j+1<=sp;s+=S.t((rx[j][0]+rx[j][1])/2,338,r,inC?'':'m')});
  // short-circuit contactors
  const KS=[K2,K3,K4],KN=['K2','K3','K4'];
  taps.forEach((tx,k)=>{const closed=!!KS[k];const tapC=!run?'':(k===sp&&closed?'flow':k<=sp?'live':'');const topC=tapC==='flow'?'flow':'';
    tx.forEach((x,i)=>{s+=S.w(`M${x} ${ly[i]}V232`,tapC)+S.dot(x,ly[i])+S.vC(x,200,232,{closed,inC:topC,outC:tapC})+S.w(`M${x} 200V192`,topC)});
    s+=S.w(`M${tx[0]} 192H${tx[2]}`,topC)+S.mech(tx[0]-12,tx[2]+12,216)+S.t(tx[1],184,KN[k]);
  });
  s+=`<text class="txt ar m" x="${starX+4}" y="270" text-anchor="middle">نجمة</text>`;
  return s+'</svg>';
}

// motor plant (rotor current & speed) — numbers illustrative
function rotorPlant(get,o){o=o||{};let M=MDEF,tau=1.1;
  const p=B.motorPlant(st=>{const k=get(st);if(!k.K1)return null;const sp=stageOf(k.K2,k.K3,k.K4),Rt=M.rt[sp];
    return {target:M.ns*(1-Rt),tau,I:n=>INOM*IpuM(n,Rt,M),label:sp===0?'تشغيل كامل':'في الدائرة: '+STAGE_SHORT[sp],mode:sp===0?'run':'slow'}},
    {ymax:600,ticks:[0,100,200,300,400,500,600],refs:[{v:579,color:'--stop'},{v:100,color:'--muted'}],nameplate:''});
  p.chart.span=24;
  const plate=()=>`3~ SLIP-RING MOTOR<br>380 v · 100 A<br>${Math.round(M.ns*(1-M.rt[0]))} rpm · 50 Hz`;
  const lbl=()=>'تيار الخط مع الزمن (آخر 24 ثانية) — '+(D.trainer?'من قيم المدرب':'أرقام توضيحية');
  const legend=()=>`<span><i style="background:var(--blue)"></i>تيار المحرك</span><span><i style="background:var(--stop)"></i>لو بدأ مباشرة بدون مقاومات (≈ ${D.txt.Ist()} A)</span><span><i style="background:var(--muted)"></i>التيار الاسمي 100 A (مثال الكتاب)</span>`;
  const st0=p.step;p.step=(dt,st,pl)=>{st0(dt,st,pl);pl.peak=Math.max(pl.peak||0,pl.I);const k=get(st);pl.sp=stageOf(k.K2,k.K3,k.K4);pl.K1=!!k.K1;if(!k.K1&&pl.n<5)pl.peak=0};
  const in0=p.init;p.init=()=>Object.assign(in0(),{peak:0,sp:3,K1:false});
  p.readouts=[{l:'المقاومات في الدائرة',chip:pl=>[pl.K1?STAGE_SHORT[pl.sp]:'متوقف',pl.K1?(pl.sp?'slow':'run'):'']},{l:'السرعة',v:pl=>Math.round(Math.abs(pl.n))+' rpm'},{l:'تيار الخط',v:pl=>Math.round(pl.I)+' A'}];
  p.render=(el,st,pl)=>{const k=get(st),sp=stageOf(k.K2,k.K3,k.K4);
    const box=(j)=>{const inC=j<=sp;return `<div class="fact" style="${inC?'outline:2px solid var(--live)':'opacity:.55'}"><span>مجموعة المقاومات</span><b>R${j}</b><span>${inC?'في الدائرة':'مُخرجة (مقصورة)'}</span></div>`};
    let h=`<div class="facts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${box(1)}${box(2)}${box(3)}</div>`;
    if(o.timers){h+=`<div class="facts" style="grid-template-columns:repeat(3,minmax(0,1fr))">`+['T4','T3','T2'].map(t=>{const T=st.T(t);const txt=T.q?'انتهى':T.run?(Math.max(0,T.tv-T.el)).toFixed(1)+' s':'—';return `<div class="fact"><span>المزمن ${t}</span><b>${txt}</b></div>`}).join('')+'</div>'}
    h+=`<p class="sub">${!k.K1?'المتمم الرئيسي K1 مفصول: لا جهد على العضو الثابت.':sp===3?'بدء الحركة: كل المقاومات على التوالي مع العضو الدائر، فالتيار محدود.':sp===0?'K2 يقصر أطراف العضو الدائر مباشرة: المحرك يعمل بشكل طبيعي.':'تم إخراج جزء من المقاومات: ترتفع السرعة ويقفز التيار قليلاً ثم ينخفض.'}</p>`;
    el.innerHTML=h};
  p.sig=pl=>pl.mode+'|'+pl.sp+'|'+pl.K1;
  p.label=pl=>pl.K1?(pl.sp===0?'تشغيل طبيعي':'بدء على مراحل'):'متوقف';
  const D=engineTP(p,o.id,rotorDefs(),{
    txt:{Ist:()=>String(Math.round(INOM*IpuM(0,M.rt[0],M)/10)*10),I3:()=>String(Math.round(INOM*IpuM(0,M.rt[3],M)/10)*10),n3:()=>String(Math.round(M.ns*(1-M.rt[3]))),n0:()=>String(Math.round(M.ns*(1-M.rt[0])))},
    apply:D=>{M=D.trainer?rotorModel(D.v,D.msg):MDEF;tau=D.trainer?D.v.tau:1.1;
      const I0=INOM*IpuM(0,M.rt[0],M);p.chart.refs[0].v=D.trainer?I0:579;
      const ax=D.trainer?niceAxis(I0*1.04,600,100):{ymax:600,ticks:[0,100,200,300,400,500,600]};p.chart.ymax=ax.ymax;p.chart.ticks=ax.ticks},
    dom:(body)=>{const np=body.querySelector('.nameplate');if(np)np.innerHTML=plate();const lg=body.querySelector('.legend');if(lg)lg.innerHTML=legend();
      const c=body.querySelector('#plantChart');const h=c&&c.parentNode.previousElementSibling;if(h&&h.matches('h3.sm'))h.textContent=lbl()}});
  D.M=()=>M;
  Object.defineProperty(p,'nameplate',{get:plate,enumerable:true,configurable:true});
  Object.defineProperty(p.chart,'label',{get:lbl,enumerable:true,configurable:true});
  Object.defineProperty(p.chart,'legend',{get:legend,enumerable:true,configurable:true});
  return p;
}
const getK=st=>({K1:st.Q('Q4.1'),K2:st.Q('Q4.2'),K3:st.Q('Q4.3'),K4:st.Q('Q4.4')});

/* ---------- I/O, inputs, control circuit ---------- */
const IO4=[
 {sym:'F4',desc:'القاطع الحراري المغناطيسي لدائرة التحكم',addr:'I0.0'},
 {sym:'S0',desc:'ضاغط الفصل',addr:'I0.1'},
 {sym:'S1',desc:'ضاغط التشغيل للمحرك',addr:'I1.1'},
 {sym:'K1',desc:'الملف المتمم (K1) للتشغيل الرئيس',addr:'Q4.1'},
 {sym:'K2',desc:'الملف المتمم (K2) القصر الدائرة وإخراج (R1)',addr:'Q4.2'},
 {sym:'K3',desc:'الملف المتمم (K3) القصر الدائرة وإخراج (R2)',addr:'Q4.3'},
 {sym:'K4',desc:'الملف المتمم (K4) القصر الدائرة وإخراج (R3)',addr:'Q4.4'},
 {sym:'T2',desc:'المزمن (K2T) لتشغيل المتمم (K2)',addr:'Q5.2'},
 {sym:'T3',desc:'المزمن (K3T) لتشغيل المتمم (K3)',addr:'Q5.3'},
 {sym:'T4',desc:'المزمن (K4T) لتشغيل المتمم (K4)',addr:'Q5.4'}
];
const IN4=[
 {id:'S0',addr:'I0.1',type:'push',color:'red',label:'إيقاف',invert:true},
 {id:'S1',addr:'I1.1',type:'push',color:'green',label:'تشغيل'},
 {id:'F4',addr:'I0.0',type:'fault',label:'فصل F4 (حمل زائد)',resetLabel:'إعادة ضبط F4',invert:true}
];
// الشكل (2-4) redrawn: every branch starts with a K1 contact in place of the common node B
const CTRL4={top:[{l:'F5',nc:1},{l:'S0',nc:1,btn:1}],branches:[
 {items:[{par:[[{l:'S1',btn:1},{l:'K2',nc:1},{l:'K3',nc:1},{l:'K4',nc:1}],[{l:'K1'}]]}],coil:{l:'K1'}},
 {items:[{l:'K1'},{par:[[{l:'KT2',timer:'on'}],[{l:'K2'}]]}],coil:{l:'K2'}},
 {items:[{l:'K1'},{l:'K2',nc:1},{l:'K3'}],coil:{l:'KT2',kind:'ton'}},
 {items:[{l:'K1'},{l:'K2',nc:1},{par:[[{l:'KT3',timer:'on'}],[{l:'K3'}]]}],coil:{l:'K3'}},
 {items:[{l:'K1'},{l:'K2',nc:1},{l:'K3',nc:1},{l:'K4'}],coil:{l:'KT3',kind:'ton'}},
 {items:[{l:'K1'},{l:'K2',nc:1},{l:'K3',nc:1},{par:[[{l:'KT4',timer:'on'}],[{l:'K4'}]]}],coil:{l:'K4'}},
 {items:[{l:'K1'},{l:'K2',nc:1},{l:'K3',nc:1},{l:'K4',nc:1}],coil:{l:'KT4',kind:'ton'}}]};
const MAP4={F5:'btn:F4',S0:'btn:S0',S1:'btn:S1',K1:'Q4.1',K2:'Q4.2',K3:'Q4.3',K4:'Q4.4',KT2:'T2',KT3:'T3',KT4:'T4'};

/* ---------- program (STL verbatim, ص 95–96) ---------- */
function prog4(fixed){
  const m=fixed?'ON   M    0.0':'O    M    0.0';
  return [
  {title:'Network 1 — دالة تخزين لمجموعة الفصل والتشغيل (M0.0)',ref:'ص 91 · 93 · 95',read:'S1 (I1.1) يثبّت العلامة M0.0. وتُلغى M0.0 إذا انقطعت إشارة F4 (I0.0) <b>أو</b> إشارة S0 (I0.1)، لأنهما موصولان تلامساً مغلقاً فيعطيان 1 في الوضع العادي.',
   stl:['A    I    1.1','S    M    0.0','A(','ON   I    0.0','ON   I    0.1',')','R    M    0.0','A    M    0.0','=    M    0.0']},
  {title:'Network 2 — تشغيل المتمم الرئيسي K1 (Q4.1)',ref:'ص 91 · 93 · 95',read:'يُثبَّت K1 إذا كانت M0.0 = 1 <b>و</b> متممات القصر K2 و K3 و K4 كلها مفصولة. ويُلغى عندما تصبح M0.0 = 0.',
   stl:['A    M    0.0','AN   Q    4.2','AN   Q    4.3','AN   Q    4.4','S    Q    4.1','AN   M    0.0','R    Q    4.1','A    Q    4.1','=    Q    4.1']},
  {title:'Network 3 — المزمن T4 (S_ODT، 5 ثوانٍ) ← Q5.4',ref:'ص 91 · 93 · 95',read:fixed?'يبدأ T4 مع K1. ويُلغى إذا عمل K4 <b>أو</b> إذا أُلغيت M0.0 (المصحح: ON M 0.0).':'يبدأ T4 مع K1. ويُلغى إذا عمل K4 <b>أو</b> إذا كانت M0.0 = 1 — وهي 1 طوال التشغيل! لذلك لا يعدّ T4 أبداً.',
   stl:['A    Q    4.1','L    S5T#5S','SD   T    4','A(','O    Q    4.4',m,')','R    T    4','NOP  0','NOP  0','A    T    4','=    Q    5.4']},
  {title:'Network 4 — المتمم K4 (Q4.4): إخراج R3',ref:'ص 91 · 93 · 95',read:'يُثبَّت K4 عند انتهاء T4، ويُلغى عندما يعمل K3 <b>أو</b> '+(fixed?'عند الإيقاف.':'عندما تكون M0.0 = 1 (خطأ الكتاب).'),
   stl:['A    T    4','S    Q    4.4','A(','O    Q    4.3',m,')','R    Q    4.4','A    Q    4.4','=    Q    4.4']},
  {title:'Network 5 — المزمن T3 (S_ODT، 5 ثوانٍ) ← Q5.3',ref:'ص 92 · 93 · 96',read:'يبدأ T3 عندما يعمل K4، ويُلغى عندما يعمل K3 <b>أو</b> '+(fixed?'عند الإيقاف.':'عندما تكون M0.0 = 1.'),
   stl:['A    Q    4.4','L    S5T#5S','SD   T    3','A(','O    Q    4.3',m,')','R    T    3','NOP  0','NOP  0','A    T    3','=    Q    5.3']},
  {title:'Network 6 — المتمم K3 (Q4.3): إخراج R2',ref:'ص 92 · 94 · 96',read:'يُثبَّت K3 عند انتهاء T3، ويُلغى عندما يعمل K2 <b>أو</b> '+(fixed?'عند الإيقاف.':'عندما تكون M0.0 = 1.'),
   stl:['A    T    3','S    Q    4.3','A(','O    Q    4.2',m,')','R    Q    4.3','A    Q    4.3','=    Q    4.3']},
  {title:'Network 7 — المزمن T2 (S_ODT، 5 ثوانٍ) ← Q5.2',ref:'ص 92 · 94 · 96',read:'يبدأ T2 عندما يعمل K3، ويُلغى عندما يعمل K2 <b>أو</b> '+(fixed?'عند الإيقاف.':'عندما تكون M0.0 = 1.'),
   stl:['A    Q    4.3','L    S5T#5S','SD   T    2','A(','O    Q    4.2',m,')','R    T    2','NOP  0','NOP  0','A    T    2','=    Q    5.2']},
  {title:'Network 8 — المتمم K2 (Q4.2): قصر العضو الدائر وإخراج R1',ref:'ص 92 · 94 · 96',read:'يُثبَّت K2 عند انتهاء T2، ويُلغى '+(fixed?'عند الإيقاف (AN M 0.0).':'عندما تكون M0.0 = 1 (A M 0.0) — أي طوال التشغيل.'),
   stl:['A    T    2','S    Q    4.2',fixed?'AN   M    0.0':'A    M    0.0','R    Q    4.2','A    Q    4.2','=    Q    4.2']}
  ];
}
const BOOK4=prog4(false),FIX4=prog4(true);
const VAR4=(def)=>({default:def,note:'<span class="fixnote">برنامج الكتاب (LAD و FBD و STL، ص 91–96) يلغي المزمنات ومتممات القصر بالتلامس المفتوح M0.0، وM0.0 = 1 طوال التشغيل. </span>بدّل بين النسختين وشاهد الفرق.',
  book:{label:'كما في الكتاب',program:BOOK4,note:'كما في الكتاب (ص 91–96): في الشبكات 3–8 كُتب <span class="ltr">O M 0.0</span> و <span class="ltr">A M 0.0</span> (تلامس مفتوح). أثناء التشغيل M0.0 = 1، فطرف الإلغاء R للمزمن T4 فعّال دائماً: يعمل K1 فقط ويبقى المحرك على كل المقاومات R1 + R2 + R3 ولا يكتمل البدء.'},
  fixed:{label:'المصحح',program:FIX4,note:'<span class="fixnote">المصحح: <span class="ltr">ON M 0.0</span> في الشبكات 3–7 و <span class="ltr">AN M 0.0</span> في الشبكة 8 (تلامس مغلق، مثل الشبكة 2). الإلغاء يحدث عند الإيقاف فقط، فيكتمل التسلسل: K4 ← K3 ← K2 كل 5 ثوانٍ.</span>'}});

// timing diagram (illustration, not a book figure)
function timingSVG(){
  const rows=[['K1',[[0,20]]],['KT4',[[0,5]]],['K4',[[5,10]]],['KT3',[[5,10]]],['K3',[[10,15]]],['KT2',[[10,15]]],['K2',[[15,20]]]];
  const X=t=>70+t*24,RH=26;let s=`<svg viewBox="0 0 600 ${rows.length*RH+70}" role="img" aria-label="المخطط الزمني لتسلسل البدء">`;
  rows.forEach(([n,bars],i)=>{const y=14+i*RH;s+=S.t(58,y+12,n,'','end')+`<path class="sym dim" d="M70 ${y+18}H${X(20)}"/>`;
    bars.forEach(([a,b])=>{s+=`<rect x="${X(a)}" y="${y+2}" width="${X(b)-X(a)}" height="16" rx="3" fill="${/^KT/.test(n)?'var(--blue-soft)':'var(--on-soft)'}" stroke="${/^KT/.test(n)?'var(--blue)':'var(--on)'}"/>`})});
  const y0=14+rows.length*RH+4;
  [[0,5,'R1+R2+R3'],[5,10,'R1+R2'],[10,15,'R1'],[15,20,'0']].forEach(([a,b,t])=>{s+=`<rect x="${X(a)}" y="${y0}" width="${X(b)-X(a)}" height="18" fill="var(--live-soft)" stroke="var(--live)"/>`+S.t((X(a)+X(b))/2,y0+13,t,'','middle',11)});
  s+=S.t(58,y0+13,'R','','end');
  for(let t=0;t<=20;t+=5)s+=S.t(X(t),y0+34,t+'s','m');
  return s+'</svg>';
}

const QUIZ_COMMON={
 seq:{q:'ما ترتيب عمل متممات القصر بعد الضغط على S1؟',o:['K2 ثم K3 ثم K4','K4 ثم K3 ثم K2','K3 ثم K4 ثم K2','تعمل كلها معاً'],c:1,e:'K4 يخرج R3 أولاً، ثم K3 يخرج R2، ثم K2 يقصر العضو الدائر ويخرج R1 (ص 90).'},
 final:{q:'ما المتممات العاملة في نهاية التسلسل؟',o:['K1 و K2 فقط','K1 و K2 و K3 و K4','K2 فقط','K1 و K4'],c:0,e:'كل متمم قصر جديد يفصل الذي قبله، فيبقى K1 (الرئيسي) و K2 (القصر الكامل).'}
};

/* =================== Lesson 4.1 =================== */
const P41=rotorPlant(getK,{id:'u4-l1'});
const n41=sp=>{const M=P41.tp.M();return P41.tp.trainer?M.ns*(1-M.rt[sp]):[1455,0,0,900][sp]};
const i41=()=>{const M=P41.tp.M();return P41.tp.trainer?INOM*IpuM(0,M.rt[0],M):579};
B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'85–88',
 title:'لماذا مقاومات البدء؟ والدائرة الرئيسة للمحرك ذي العضو الدائر الملفوف',
 summary:'تيار البدء العالي وطريقة تخفيفه بمقاومات على التوالي مع العضو الدائر، ثم الدائرة الرئيسة في الشكل (1-4): المتمم K1 والمرحل F4 ومجموعات المقاومات R1 و R2 و R3 ومتممات القصر K2 و K3 و K4.',
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
})())/*DCML-END*/,{intro:true}),

  {st:1,short:'ماذا ستتعلم؟',title:'ماذا ستتعلم في هذه الوحدة؟',ref:'ص 85',
   q:'محرك كبير يسحب عند بدء تشغيله أضعاف تياره العادي… كيف نبدأ تشغيله بأمان؟ وكيف نكتب لذلك برنامجاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة أهداف الوحدة الرابعة: الهدف من مقاومات البدء، رسم الدائرتين، التحويل إلى LAD و FBD و STL، مع الوقت ومستوى الإتقان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="60" y="40" width="240" height="246" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><rect x="146" y="28" width="68" height="24" rx="8" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="80" text-anchor="middle" direction="rtl" font-size="16" fill="#2C4A40" font-weight="700">أهداف الوحدة</text><path d="M80 92H280" fill="none" stroke="#CFC6B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="266" y="104" width="18" height="18" rx="4" fill="#12855A" stroke="#12855A" stroke-width="0"/><path d="M270 113 l4 4 l7 -9" fill="none" stroke="#FBF6EE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="258" y="118" text-anchor="start" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">الهدف من مقاومات البدء</text><rect x="266" y="136" width="18" height="18" rx="4" fill="#12855A" stroke="#12855A" stroke-width="0"/><path d="M270 145 l4 4 l7 -9" fill="none" stroke="#FBF6EE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="258" y="150" text-anchor="start" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">رسم الدائرة الرئيسة ودائرة التحكم</text><rect x="266" y="168" width="18" height="18" rx="4" fill="#12855A" stroke="#12855A" stroke-width="0"/><path d="M270 177 l4 4 l7 -9" fill="none" stroke="#FBF6EE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="258" y="182" text-anchor="start" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">التحويل إلى</text><g data-tip="ثلاث طرق لكتابة البرنامج: المخطط السلمي ⟦LAD⟧، والبوابات المنطقية ⟦FBD⟧، وقائمة الإجراءات ⟦STL⟧."><rect x="70" y="168" width="100" height="20" fill="transparent"/><text x="76" y="182" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">LAD · FBD · STL</text></g><path d="M80 204H280" fill="none" stroke="#CFC6B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="222" cy="230" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M222 221V230H229" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="222" y="266" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">ساعتان</text><circle cx="138" cy="230" r="15" fill="#E8735A"/><circle cx="138" cy="230" r="9" fill="#FBF6EE"/><circle cx="138" cy="230" r="3.5" fill="#E8735A"/><text x="138" y="266" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">إتقان <tspan direction="ltr">100٪</tspan></text></svg>`,
   cap:'أهداف الوحدة كما في ص 85، والوقت المتوقع للتدريب، ومستوى الأداء المطلوب.<br><b>مرّر المؤشر على <span class="ltr">LAD · FBD · STL</span> (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تشترط الوحدة أن تكون قد درست «آلات التيار المتردد» و«ورشة التحكم في المحركات الثلاثية الأوجه». لماذا؟',opts:[
     ['لأن الوحدة تشرح طريقة لف ملفات المحرك',false,'الوحدة لا تتكلم عن لف الملفات؛ موضوعها بدء تشغيل المحرك بالمقاومات وبرنامج التحكم فيه.'],
     ['لأن الوحدة لا تحتاج إلى أي برمجة',false,'العكس: الهدف الثالث هو تحويل دائرة التحكم إلى برنامج بالطرق الثلاث.'],
     ['لأنك ستحتاج فهم المحرك ذي العضو الدائر الملفوف، وقراءة دائرة قدرة ودائرة تحكم بمتممات ومزمنات، قبل تحويلها إلى برنامج',true,'الهدفان الأول والثاني عن المحرك ودائرتيه، والثالث عن تحويل دائرة التحكم إلى <span class="ltr">PLC</span>.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الجدارة:</b> استخدام الحاسب الآلي في كتابة برنامج للتحكم في سرعة المحرك الحثي ثلاثي الأوجه ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</p>
     <p><b>الأهداف:</b></p><ol><li>أن يعرف المتدرب الهدف من المحرك الحثي الثلاثي الأوجه ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</li><li>أن يرسم المتدرب الدائرة الرئيسة ودائرة التحكم لتشغيل المحرك الحثي الثلاثي الأوجه ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</li><li>أن يحول المتدرب دائرة التحكم من مخطط مسار التيار إلى دائرة <span class="ltr">(PLC)</span> بالطرق الثلاثة.<ul><li>المخطط السُّلّمي <span class="ltr">(LAD)</span>.</li><li>البوابات المنطقية <span class="ltr">(FBD)</span>.</li><li>قائمة الإجراءات <span class="ltr">(STL)</span>.</li></ul></li></ol>
     <p><b>مستوى الأداء المطلوب:</b> أن يصل المتدرب إلى إتقان هذه الجدارة بإذن الله بنسبة 100٪.</p>
     <p><b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج • حاسب آلي • جهاز عرض (داتا شو) • سبورة • كراسة الطالب • قلم.</p>
     <p><b>متطلبات الجدارة:</b> آلات التيار المتردد • ورشة التحكم في المحركات الثلاثية الأوجه.</p>`,ref:'ص 85'},
    {watch:String.raw`<p>الجدارة تقول «التحكم في <b>سرعة</b> المحرك»، لكن المحتوى الفعلي للوحدة هو <b>بدء تشغيل</b> المحرك بمقاومات متعددة المراحل تُخرج بالتدريج حتى يعمل المحرك بشكل طبيعي. لا يوجد في الوحدة تحكم مستمر في السرعة.</p>`,fix:true},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اقرأ كل عبارة عن صفحة الجدارة (ص 85) وقرّر: صح أم خطأ؟',items:[
     [String.raw`الهدف أن تكتب بالحاسب الآلي برنامجاً لتشغيل المحرك ذي العضو الدائر الملفوف بمقاومات البدء المتعددة المراحل.`,true,String.raw`هذا نص الجدارة: «استخدام الحاسب الآلي في كتابة برنامج…» للمحرك ذي العضو الدائر الملفوف بمقاومات البدء.`],
     [String.raw`ستتعلم في هذه الوحدة كيف ترفع سرعة المحرك وتخفضها متى شئت أثناء العمل.`,false,String.raw`مع أن الجدارة تقول «التحكم في سرعة المحرك»، فالمحتوى الفعلي هو <b>بدء التشغيل</b>: مقاومات تُخرج بالتدريج حتى يعمل المحرك بشكل طبيعي.`],
     [String.raw`ستحوّل دائرة التحكم إلى برنامج <span class="ltr">PLC</span> بثلاث طرق: <span class="ltr">LAD</span> و <span class="ltr">FBD</span> و <span class="ltr">STL</span>.`,true,String.raw`الهدف الثالث: «أن يحول المتدرب دائرة التحكم من مخطط مسار التيار إلى دائرة <span class="ltr">(PLC)</span> بالطرق الثلاثة».`],
     [String.raw`يكفي أن تصل إلى نصف مستوى الأداء المطلوب في هذه الجدارة.`,false,String.raw`مستوى الأداء المطلوب في الكتاب: إتقان الجدارة بنسبة <span class="ltr">100٪</span>.`]]})}
   ]},

  {st:2,short:'محتويات الوحدة',title:'محتويات الوحدة: ثلاثة فصول',ref:'ص 86',
   q:'نبدأ بسؤال «لماذا؟»، ثم نرسم الدائرتين، ثم نكتب البرنامج… لماذا هذا الترتيب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة فصول متتالية: الهدف، ثم الدائرتان الرئيسة والتحكم، ثم التحويل إلى LAD و FBD و STL" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="70" y="52" width="220" height="56" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="254" y="52" width="36" height="56" rx="10" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M262 53V107" fill="none" stroke="#E8735A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="74" text-anchor="start" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">الفصل الأول</text><text x="240" y="96" text-anchor="start" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">الهدف من التشغيل</text><rect x="70" y="122" width="220" height="56" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="254" y="122" width="36" height="56" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><path d="M262 123V177" fill="none" stroke="#F2C14E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="144" text-anchor="start" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">الفصل الثاني</text><text x="240" y="166" text-anchor="start" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">الدائرة الرئيسة ودائرة التحكم</text><rect x="70" y="192" width="220" height="56" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="254" y="192" width="36" height="56" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><path d="M262 193V247" fill="none" stroke="#4FB3A9" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="214" text-anchor="start" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">الفصل الثالث</text><text x="240" y="236" text-anchor="start" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">التحويل</text><g data-tip="ثلاث طرق لكتابة البرنامج نفسه: ⟦LAD⟧ المخطط السلمي، ⟦FBD⟧ البوابات المنطقية، ⟦STL⟧ قائمة الإجراءات."><rect x="78" y="222" width="90" height="20" fill="transparent"/><text x="80" y="236" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">LAD · FBD · STL</text></g><path d="M180 108V122" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="174,118 186,118 180,124" fill="#2C4A40"/><path d="M180 178V192" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="174,188 186,188 180,194" fill="#2C4A40"/><g data-tip="الأدوات البرمجية التي يستخدمها الفصل الثالث: دالة التخزين ⟦SR⟧ مع الإلغاء والإبقاء، والمزمنات."><rect x="70" y="264" width="220" height="22" fill="transparent"/><text x="180" y="280" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">دالة التخزين · الإلغاء والإبقاء · المزمنات</text></g></svg>`,
   cap:'فصول الوحدة الثلاثة بالترتيب.<br><b>مرّر المؤشر على الكلمات اللاتينية والسطر الأخير (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الفصل الثالث يحوّل «دائرة التحكم» إلى برنامج. فما الذي يبقى سلكياً ولا يدخل في البرنامج؟',opts:[
     ['الضواغط S0 و S1',false,'الضواغط تبقى في اللوحة، لكنها تُوصل على مداخل الـ <span class="ltr">PLC</span> وقرارها يدخل في البرنامج.'],
     ['الدائرة الرئيسة: المحرك والمقاومات ونقاط القدرة في المتممات',true,'البرنامج يأخذ مكان أسلاك دائرة التحكم فقط؛ تيار المحرك نفسه يمر في نقاط المتممات والمقاومات كما في الدائرة الرئيسة.'],
     ['المزمنات',false,'المزمنات في البرنامج داخلية <span class="ltr">(T2, T3, T4)</span>، فلا نحتاج مزمنات سلكية.']]}}
   ],
   body:[
    {book:String.raw`<ul><li><b>الفصل الأول:</b> الهدف من تشغيل المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</li>
     <li><b>الفصل الثاني:</b> الدائرة الرئيسة ودائرة التحكم لتشغيل المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</li>
     <li><b>الفصل الثالث:</b> تحويل دائرة التحكم إلى:<ol><li>دائرة <span class="ltr">(LAD)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</li><li>دائرة <span class="ltr">(FBD)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</li><li>دائرة <span class="ltr">(STL)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</li></ol></li></ul>`,ref:'ص 86'},
    {tip:String.raw`<p>هذا الدرس: الفصل الأول والدائرة الرئيسة. الدرس التالي: دائرة التحكم وطريقة عملها. ثم الدرس الثالث: جدول المداخل والمخارج وبرنامج <span class="ltr">LAD</span>. والدرس الرابع: البرنامج نفسه بلغتي <span class="ltr">FBD</span> و <span class="ltr">STL</span>.</p>`,title:'أين تجد كل فصل؟'},
    {title:'مختبر مصغّر: رتّب فصول الوحدة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط فصول الوحدة بالترتيب الذي جاءت به في الكتاب (ص 86).',steps:[
     [String.raw`الهدف من تشغيل المحرك بمقاومات البدء المتعددة المراحل (لماذا؟)`,String.raw`نبدأ بالسبب: لماذا نحتاج المقاومات أصلاً؟`],
     [String.raw`الدائرة الرئيسة ودائرة التحكم`,String.raw`لا نرسم الدائرة قبل أن نعرف لماذا نحتاجها؛ هذا الفصل يأتي بعد الهدف.`],
     [String.raw`تحويل دائرة التحكم إلى <span class="ltr">LAD</span> و <span class="ltr">FBD</span> و <span class="ltr">STL</span>`,String.raw`لا يمكن تحويل دائرة التحكم إلى برنامج قبل رسمها؛ هذا آخر فصل.`]],
     done:String.raw`هذا ترتيب الكتاب: السبب، ثم الدائرتان، ثم البرنامج بثلاث لغات. والدائرة الرئيسة تبقى سلكية؛ الذي يتحول إلى برنامج هو دائرة التحكم.`})}
   ]},

  {st:3,short:'لماذا مقاومات البدء؟',title:'الفصل الأول: لماذا نبدأ التشغيل بمقاومات؟',ref:'ص 87',
   q:'محرك رافعة تياره العادي 100 A… كم يسحب في اللحظة الأولى من تشغيله؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عمودان: التيار الاسمي 100 A، وتيار البدء من 400 إلى 600 A" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M60 258H300" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="التيار الاسمي للمحرك في مثال الكتاب: ⟦100 A⟧ — التيار الذي يسحبه في العمل الطبيعي."><rect x="92" y="228.0" width="64" height="30.0" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></g><text x="124" y="218.0" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100 A</text><g data-tip="مدى تيار البدء في مثال الكتاب: من ⟦400 A⟧ إلى ⟦600 A⟧، حسب الحمل على المحرك."><rect x="204" y="78.0" width="64" height="60.0" rx="3" fill="#F4B9A8" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="6 4"/><rect x="204" y="138.0" width="64" height="120.0" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g><text x="236" y="68.0" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">600 A</text><text x="278" y="143.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">400 A</text><text x="124" y="280" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">التيار الاسمي</text><text x="236" y="280" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">تيار البدء</text><text x="180" y="302" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">محرك رافعة — مثال الكتاب</text></svg>`,
   cap:'مثال الكتاب: التيار الاسمي مقابل مدى تيار البدء.<br><b>مرّر المؤشر على العمودين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {add:String.raw`<p>عندما يبدأ محرك كبير مباشرة قد تلاحظ أن إضاءة الورشة تخفت لحظة. السبب: التيار الكبير عند البدء يسبب هبوطاً في جهد الشبكة يحس به كل من يتغذى منها.</p>`,title:'من الواقع'},
    {predict:{q:'محرك رافعة تياره الاسمي <span class="ltr">100 A</span>. كم تيار بدئه في مثال الكتاب؟',opts:[
     ['<span class="ltr">100 A</span> أيضاً',false,'المحرك عند البدء يسحب أضعاف تياره الاسمي، وليس التيار نفسه.'],
     ['من <span class="ltr">150</span> إلى <span class="ltr">200 A</span>',false,'أقل بكثير مما في المثال.'],
     ['من <span class="ltr">400</span> إلى <span class="ltr">600 A</span>',true,'هذا مثال الكتاب في ص 87، و«هذا التيار عالٍ خاصةً إذا كان المحرك محملاً بالحمل الكامل».']]}}
   ],
   body:[
    {book:String.raw`<p>من المعلوم أن المحركات في بداية التشغيل تسحب تياراً عالياً يكون من ثلاثة إلى أربعة أضعاف التيار الإسمي للمحرك.</p>
     <p><b>مثال:</b> محرك رافعة تياره الاسمي <span class="ltr">(100 A)</span>. فيكون تيار البدء من <span class="ltr">(400 – 600 A)</span> وهذا التيار عالٍ خاصةً إذا كان المحرك محملاً بالحمل الكامل.</p>`,ref:'ص 87'},
    {watch:String.raw`<p>النص يقول «من ثلاثة إلى أربعة أضعاف»، لكن المثال نفسه (<span class="ltr">100 A</span> ← <span class="ltr">400</span> إلى <span class="ltr">600 A</span>) يعني من <b>أربعة إلى ستة أضعاف</b>.</p>`,fix:true},
    {book:String.raw`<p>ومن طرق بدء الحركة للمحركات ذات العضو الدائر الملفوف، توصيل مجموعة من المقاومات على التوالي لتخفيف تيار البدء. وبعد البدء يتم تخريج مجموعة المقاومات بالتدريج، حتى يتم إخراج المقاومات بالكلية ويعمل المحرك بالشكل الطبيعي.</p>`,ref:'ص 87'},
    {tip:String.raw`<p>في المحرك ذي العضو الدائر الملفوف تخرج أطراف ملفات العضو الدائر الثلاثة إلى الخارج، فنستطيع أن نوصل معها مقاومات. كلما زادت المقاومة في دائرة العضو الدائر قلّ تيار البدء. ثم نخرج المقاومات على مراحل، لأن إخراجها مرة واحدة يعيد التيار العالي.</p>`,title:'الفكرة ببساطة'},
    {title:'تابع خطوات البدء',widget:(el,B)=>{
      const S=['مقاومات على التوالي مع العضو الدائر','يقل تيار البدء','يبدأ المحرك بالدوران','تُخرج المقاومات بالتدريج','تُخرج المقاومات بالكلية','يعمل المحرك بالشكل الطبيعي'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «ابدأ» وتابع ترتيب الخطوات كما في نص الكتاب.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>ابدأ</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }}
   ]},

  {st:4,short:'الدائرة الرئيسة',title:'الفصل الثاني — أولاً: الدائرة الرئيسة، الشكل <span class="ltr">(1-4)</span>',ref:'ص 88',
   q:'ثلاثة متممات للقصر في أماكن مختلفة على خطوط العضو الدائر… أيها يُخرج المقاومات كلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة الرئيسة مبسطة: الخطوط ثم المصهرات ثم K1 ثم F4 إلى العضو الثابت، وخطوط العضو الدائر تمر في R1 ثم R2 ثم R3، ومتممات القصر K2 و K3 و K4" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="خطوط المصدر الثلاثة ⟦L1 L2 L3⟧."><rect x="40" y="24" width="48" height="20" fill="transparent"/><text x="64" y="38" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">L1 L2 L3</text></g><path d="M52 46V198" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M64 46V198" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M76 46V198" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المصهرات ⟦F1...3⟧: مصهر على كل خط للحماية من القصر."><rect x="42" y="62" width="44" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="39" y="77" text-anchor="end" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F1...3</text></g><g data-tip="المتمم الرئيسي ⟦K1⟧: ثلاث نقاط رئيسة توصل الجهد إلى العضو الثابت للمحرك."><rect x="42" y="104" width="44" height="24" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.2"/><text x="38" y="121" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text></g><g data-tip="المرحل الحراري ⟦F4⟧: يحمي المحرك من الحمل الزائد."><rect x="42" y="148" width="44" height="22" rx="3" fill="#F4B9A8" stroke="#2C4A40" stroke-width="2.2"/><text x="38" y="164" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F4</text></g><g data-tip="المحرك ⟦M 3~⟧ ذو العضو الدائر الملفوف: الدائرة المزدوجة تعني أن أطراف العضو الدائر تخرج إلى الخارج."><circle cx="64" cy="236" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="64" cy="236" r="27" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="64" y="233" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="64" y="249" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">3~</text></g><path d="M98 222H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M98 236H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M98 250H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="مجموعة المقاومات ⟦R1⟧: ثلاث مقاومات، واحدة على كل خط من خطوط العضو الدائر."><rect x="132" y="217" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="132" y="231" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="132" y="245" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><text x="151.0" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R1</text></g><g data-tip="مجموعة المقاومات ⟦R2⟧: ثلاث مقاومات، واحدة على كل خط من خطوط العضو الدائر."><rect x="198" y="217" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="198" y="231" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="198" y="245" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><text x="217.0" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R2</text></g><g data-tip="مجموعة المقاومات ⟦R3⟧: ثلاث مقاومات، واحدة على كل خط من خطوط العضو الدائر."><rect x="262" y="217" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="262" y="231" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><rect x="262" y="245" width="38" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.8"/><text x="281.0" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R3</text></g><g data-tip="نقطة النجمة: أطراف ⟦R3⟧ البعيدة موصولة معاً، فيكتمل مسار تيار العضو الدائر عبر المقاومات كلها."><rect x="314" y="214" width="18" height="44" fill="transparent"/><path d="M322 222V250" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="322" cy="222" r="3" fill="#2C4A40"/><circle cx="322" cy="236" r="3" fill="#2C4A40"/><circle cx="322" cy="250" r="3" fill="#2C4A40"/></g><g data-tip="متمم القصر ⟦K2⟧: موصول قبل ⟦R1⟧، فإذا عمل قصر أطراف العضو الدائر مباشرة وأخرج المقاومات كلها."><rect x="104" y="150" width="24" height="104" fill="transparent"/><circle cx="116" cy="222" r="2.6" fill="#2C4A40"/><circle cx="116" cy="236" r="2.6" fill="#2C4A40"/><circle cx="116" cy="250" r="2.6" fill="#2C4A40"/><path d="M116 250V198" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="107" y="176" width="18" height="26" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M107 176H125" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="116" y="166" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K2</text></g><g data-tip="متمم القصر ⟦K3⟧: موصول بين ⟦R1⟧ و ⟦R2⟧، فإذا عمل أخرج ⟦R2⟧ و ⟦R3⟧."><rect x="172" y="150" width="24" height="104" fill="transparent"/><circle cx="184" cy="222" r="2.6" fill="#2C4A40"/><circle cx="184" cy="236" r="2.6" fill="#2C4A40"/><circle cx="184" cy="250" r="2.6" fill="#2C4A40"/><path d="M184 250V198" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="175" y="176" width="18" height="26" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M175 176H193" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="184" y="166" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K3</text></g><g data-tip="متمم القصر ⟦K4⟧: موصول بين ⟦R2⟧ و ⟦R3⟧، فإذا عمل أخرج ⟦R3⟧."><rect x="237" y="150" width="24" height="104" fill="transparent"/><circle cx="249" cy="222" r="2.6" fill="#2C4A40"/><circle cx="249" cy="236" r="2.6" fill="#2C4A40"/><circle cx="249" cy="250" r="2.6" fill="#2C4A40"/><path d="M249 250V198" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="240" y="176" width="18" height="26" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M240 176H258" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="249" y="166" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4</text></g></svg>`,
   cap:'الشكل <span class="ltr">(1-4)</span> مبسطاً: جهة العضو الثابت على اليسار، وخطوط العضو الدائر الثلاثة إلى اليمين.<br><b>مرّر المؤشر على الرموز والمقاومات والمتممات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي متمم موصول قبل <span class="ltr">R1</span> مباشرة، فإذا عمل أخرج المقاومات كلها؟',opts:[
     ['<span class="ltr">K2</span>',true,'في الشكل <span class="ltr">(1-4)</span> نقاط <span class="ltr">K2</span> موصولة بخطوط العضو الدائر عند خروجها من المحرك، قبل <span class="ltr">R1</span>.'],
     ['<span class="ltr">K4</span>',false,'<span class="ltr">K4</span> موصول بين <span class="ltr">R2</span> و <span class="ltr">R3</span>، فيخرج <span class="ltr">R3</span> فقط.'],
     ['<span class="ltr">K1</span>',false,'<span class="ltr">K1</span> هو المتمم الرئيسي في جهة العضو الثابت، ولا علاقة له بالمقاومات.']]}}
   ],
   body:[
    {book:String.raw`<p>أولاً: الدائرة الرئيسة لتشغيل المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل. كما في الشكل <span class="ltr">(1-4)</span>.</p>`+`<div class="svgbox">${powerRotor(0,0,0,0)}</div>`+String.raw`<p class="sub">الشكل <span class="ltr">(1-4)</span></p>`,ref:'ص 88'},
    {tip:String.raw`<ul><li><b>جهة العضو الثابت:</b> الخطوط <span class="ltr">L1 L2 L3</span> ← المصهرات <span class="ltr">F1...3</span> ← المتمم الرئيسي <span class="ltr">K1</span> ← المرحل الحراري <span class="ltr">F4</span> ← المحرك.</li>
     <li><b>جهة العضو الدائر:</b> ثلاثة خطوط تمر على التوالي في <span class="ltr">R1</span> ثم <span class="ltr">R2</span> ثم <span class="ltr">R3</span>، وأطراف <span class="ltr">R3</span> البعيدة موصولة معاً (نقطة نجمة).</li>
     <li><b>متممات القصر:</b> لكل منها ثلاث نقاط مفتوحة أطرافها العلوية موصولة معاً، فإذا عمل قصر الخطوط الثلاثة في مكانه: <span class="ltr">K2</span> قبل <span class="ltr">R1</span>، و <span class="ltr">K3</span> بين <span class="ltr">R1</span> و <span class="ltr">R2</span>، و <span class="ltr">K4</span> بين <span class="ltr">R2</span> و <span class="ltr">R3</span>.</li></ul>`,title:'اقرأ الشكل من اليسار إلى اليمين'},
    {title:'أغلق متمم قصر وتابع التيار',widget:(el,B)=>{
      let sp=3;const M={3:[0,0,0],2:[0,0,1],1:[0,1,0],0:[1,0,0]},NM={3:'لا شيء',2:'K4',1:'K3',0:'K2'};
      const TXT={3:'لا يوجد متمم قصر مغلق: تيار العضو الدائر يمر في <span class="ltr">R1</span> ثم <span class="ltr">R2</span> ثم <span class="ltr">R3</span> ثم نقطة النجمة.',
       2:'<span class="ltr">K4</span> موصول بين <span class="ltr">R2</span> و <span class="ltr">R3</span>: يقصر الخطوط هناك فتخرج <span class="ltr">R3</span> وتبقى <span class="ltr">R1</span> و <span class="ltr">R2</span>.',
       1:'<span class="ltr">K3</span> موصول بين <span class="ltr">R1</span> و <span class="ltr">R2</span>: تخرج <span class="ltr">R2</span> و <span class="ltr">R3</span> وتبقى <span class="ltr">R1</span>.',
       0:'<span class="ltr">K2</span> موصول قبل <span class="ltr">R1</span> مباشرة: يقصر أطراف العضو الدائر فتخرج المقاومات كلها.'};
      const draw=()=>{const [a,b,c]=M[sp];
        el.innerHTML=`<p class="sub" style="margin:0 0 8px">المتمم الرئيسي <span class="ltr">K1</span> مغلق. اختر متمم القصر المغلق وتابع مسار التيار الملوّن في العضو الدائر.</p><div class="w-row" style="margin-top:0"><span class="w-l">متمم القصر المغلق:</span><span class="mseg">${[3,2,1,0].map(v=>`<button type="button" data-sp="${v}" aria-pressed="${sp===v}">${NM[v]}</button>`).join('')}</span></div><div class="svgbox" style="margin-top:10px;max-width:560px;margin-inline:auto">${powerRotor(1,a,b,c)}</div><div class="facts"><div class="fact"><span>المقاومات الباقية في دائرة العضو الدائر</span><b class="ltr">${['لا شيء','R1','R1 + R2','R1 + R2 + R3'][sp]}</b></div></div><p class="sub">${TXT[sp]}</p>`;
        el.querySelectorAll('[data-sp]').forEach(x=>x.onclick=()=>{sp=+x.dataset.sp;draw()})};
      draw();
    }},
    {watch:String.raw`<p>الحروف <span class="ltr">K L M</span> عند خروج خطوط العضو الدائر في الرسم أعلاه أضيفت للتوضيح (تسمية شائعة لأطراف العضو الدائر)، <b>وليست مكتوبة في الشكل <span class="ltr">(1-4)</span></b>. والكتاب لا يسمي أطراف العضو الثابت أيضاً.</p>`}
   ]},

  {recap:[
   String.raw`المحرك يسحب عند البدء تياراً عالياً؛ في مثال الكتاب محرك رافعة تياره الاسمي <span class="ltr">100 A</span> وتيار بدئه من <span class="ltr">400</span> إلى <span class="ltr">600 A</span> (ص 87).`,
   String.raw`لتخفيف تيار البدء في المحرك ذي العضو الدائر الملفوف نوصل مقاومات على التوالي مع العضو الدائر، ثم نخرجها بالتدريج حتى يعمل المحرك بالشكل الطبيعي (ص 87).`,
   String.raw`الشكل <span class="ltr">(1-4)</span>: <span class="ltr">K1</span> يوصل الجهد إلى العضو الثابت عبر المصهرات <span class="ltr">F1...3</span> والمرحل الحراري <span class="ltr">F4</span> (ص 88).`,
   String.raw`خطوط العضو الدائر تمر في <span class="ltr">R1</span> ثم <span class="ltr">R2</span> ثم <span class="ltr">R3</span>: <span class="ltr">K4</span> يخرج <span class="ltr">R3</span>، و <span class="ltr">K3</span> يخرج <span class="ltr">R2</span> و <span class="ltr">R3</span>، و <span class="ltr">K2</span> يقصر العضو الدائر فيخرجها كلها (ص 88).`]}
],
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 85',html:`<p><b>الجدارة:</b> استخدام الحاسب الآلي في كتابة برنامج للتحكم في سرعة المحرك الحثي ثلاثي الأوجه ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</p>
   <p><b>الأهداف:</b></p><ol><li>أن يعرف المتدرب الهدف من المحرك الحثي الثلاثي الأوجه ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل.</li><li>أن يرسم المتدرب الدائرة الرئيسة ودائرة التحكم لتشغيله.</li><li>أن يحول المتدرب دائرة التحكم من مخطط مسار التيار إلى دائرة (PLC) بالطرق الثلاثة: المخطط السلّمي (LAD)، البوابات المنطقية (FBD)، قائمة الإجراءات (STL).</li></ol>
   <p><b>مستوى الأداء:</b> 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم. <b>متطلبات الجدارة:</b> آلات التيار المتردد، وورشة التحكم في المحركات الثلاثية الأوجه.</p>`},
  {h:'محتويات الوحدة',ref:'ص 86',html:`<ul><li><b>الفصل الأول:</b> الهدف من تشغيل المحرك بمقاومات البدء المتعددة المراحل (هذا الدرس).</li><li><b>الفصل الثاني:</b> الدائرة الرئيسة (هذا الدرس) ودائرة التحكم (الدرس 4.2).</li><li><b>الفصل الثالث:</b> تحويل دائرة التحكم إلى LAD (الدرس 4.3) ثم FBD و STL (الدرس 4.4) باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات.</li></ul>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'العنوان يقول «التحكم في <b>سرعة</b> المحرك» (الغلاف وص 87)، لكن المحتوى الفعلي هو <b>بدء تشغيل</b> المحرك بمقاومات متعددة المراحل تُخرج بالتدريج حتى يعمل المحرك بشكل طبيعي. لا يوجد في الوحدة تحكم مستمر في السرعة.'+'</div>'},
  {h:'الفصل الأول: الهدف من التشغيل بمقاومات البدء',ref:'ص 87',html:`<p>«من المعلوم أن المحركات في بداية التشغيل تسحب تياراً عالياً يكون من ثلاثة إلى أربعة أضعاف التيار الإسمي للمحرك.»</p>
   <p><b>مثال:</b> «محرك رافعة تياره الاسمي <span class="ltr">(100 A)</span>. فيكون تيار البدء من <span class="ltr">(400 – 600 A)</span> وهذا التيار عالٍ خاصةً إذا كان المحرك محملاً بالحمل الكامل.»</p>
   <p>«ومن طرق بدء الحركة للمحركات ذات العضو الدائر الملفوف، توصيل مجموعة من المقاومات على التوالي لتخفيف تيار البدء. وبعد البدء يتم تخريج مجموعة المقاومات بالتدريج، حتى يتم إخراج المقاومات بالكلية ويعمل المحرك بالشكل الطبيعي.»</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'النص يقول «من ثلاثة إلى أربعة أضعاف»، لكن المثال نفسه (100 A ← 400 إلى 600 A) يعني من <b>أربعة إلى ستة أضعاف</b>. المحاكاة تأخذ رقم المثال (نحو 580 A عند البدء المباشر).'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المحرك ذو العضو الدائر الملفوف تخرج أطراف ملفات عضوه الدائر الثلاثة إلى الخارج عبر حلقات انزلاق وفرش، فنستطيع أن نوصل معها مقاومات خارجية. كلما زادت المقاومة في دائرة العضو الدائر قل تيار البدء. عند إخراج مجموعة مقاومات ترتفع سرعة المحرك قليلاً ويقفز التيار قفزة صغيرة ثم ينخفض، وهكذا حتى تُقصر أطراف العضو الدائر تماماً. جرّب المراحل الأربع في الرسم التالي (الأرقام توضيحية).'},
  {widget:(el)=>{let sp=3;const K=[[0,0,0],[0,0,1],[0,1,0],[1,0,0]];const map={3:K[0],2:K[1],1:K[2],0:K[3]};
    const draw=()=>{const [k2,k3,k4]=map[sp];const I0=Math.round(INOM*Ipu(0,Rtot(sp)));
      el.innerHTML=`<div class="fig"><div class="seg" role="group">${[3,2,1,0].map(v=>`<button data-sp="${v}" aria-pressed="${sp===v}">${v===3?'كل المقاومات':v===2?'K4 يعمل':v===1?'K3 يعمل':'K2 يعمل'}</button>`).join('')}</div>
      <div class="svgbox">${powerRotor(1,k2,k3,k4)}</div>
      <div class="facts"><div class="fact"><span>المقاومات في دائرة العضو الدائر</span><b>${STAGE_SHORT[sp]}</b></div><div class="fact"><span>تيار البدء لو بدأ المحرك هنا (توضيحي)</span><b>≈ ${I0} A</b></div><div class="fact"><span>السرعة التي يستقر عندها (توضيحي)</span><b>≈ ${Math.round(nTarget(sp))} rpm</b></div></div>
      <p class="sub">${sp===3?'لا يوجد متمم قصر مغلق: التيار يمر في R1 ثم R2 ثم R3 ثم نقطة النجمة.':sp===2?'K4 موصول بين R2 و R3: يقصر الخطوط هناك فتخرج R3 وتبقى R1 و R2.':sp===1?'K3 موصول بين R1 و R2: يخرج R2 و R3 وتبقى R1.':'K2 موصول قبل R1 مباشرة: يقصر أطراف العضو الدائر فتخرج كل المقاومات.'}</p></div>`;
      el.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{sp=+b.dataset.sp;draw()})};draw()}},
  {h:'الفصل الثاني — أولاً: الدائرة الرئيسة',ref:'ص 88',html:`<p>الشكل (1-4) يوضح الدائرة الرئيسة لتشغيل المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل:</p>
   <ul><li>الخطوط <b>L1 و L2 و L3</b> ثم المصهرات <b>F1...3</b>.</li><li><b>K1</b>: المتمم الرئيسي، ثلاث نقاط رئيسة مفتوحة توصل الخطوط إلى العضو الثابت للمحرك عبر المرحل الحراري <b>F4</b>.</li><li>المحرك <b>M 3~</b> (دائرة مزدوجة = عضو دائر ملفوف). يخرج من العضو الدائر ثلاثة خطوط تمر على التوالي بثلاث مجموعات مقاومات: <b>R1</b> ثم <b>R2</b> ثم <b>R3</b>، وأطراف R3 البعيدة موصولة معاً (نقطة نجمة).</li>
   <li>متممات القصر، لكل منها ثلاث نقاط مفتوحة أطرافها العلوية موصولة معاً:<br><b>K2</b> موصول بالخطوط <b>قبل R1</b> ← يقصر العضو الدائر مباشرة.<br><b>K3</b> موصول <b>بين R1 و R2</b> ← يخرج R2 و R3.<br><b>K4</b> موصول <b>بين R2 و R3</b> ← يخرج R3.</li></ul>`},
  {fig:'(1-4)',ref:'ص 88',caption:'الدائرة الرئيسة لتشغيل المحرك ذي العضو الدائر الملفوف بمقاومات البدء المتعددة المراحل',draw:'power'},
  {note:'<b>توضيح:</b> الحروف <span class="ltr">K L M</span> عند خروج خطوط العضو الدائر أضيفت للتوضيح (تسمية شائعة لأطراف العضو الدائر)، <b>وليست مكتوبة في الشكل (1-4)</b>، والكتاب لا يسمي أطراف العضو الثابت أيضاً.'},
  {html:`<table class="tt"><thead><tr><th>المتمم المغلق</th><th>مكان توصيله</th><th>المقاومات المُخرجة</th><th>المقاومات الباقية في الدائرة</th></tr></thead><tbody>
   <tr><td>لا شيء</td><td>—</td><td>—</td><td>R1 + R2 + R3</td></tr><tr><td>K4</td><td>بين R2 و R3</td><td>R3</td><td>R1 + R2</td></tr><tr><td>K3</td><td>بين R1 و R2</td><td>R2 + R3</td><td>R1</td></tr><tr><td>K2</td><td>قبل R1</td><td>R1 + R2 + R3</td><td>لا شيء</td></tr></tbody></table>`}
 ],
 io:IO4.filter(r=>/^Q4/.test(r.addr)),
 inputs:[
  {id:'K1',addr:'Q4.1',type:'toggle',label:'غلق K1 يدوياً'},
  {id:'K4',addr:'Q4.4',type:'toggle',label:'غلق K4 (يخرج R3)'},
  {id:'K3',addr:'Q4.3',type:'toggle',label:'غلق K3 (يخرج R2+R3)'},
  {id:'K2',addr:'Q4.2',type:'toggle',label:'غلق K2 (قصر كامل)'}
 ],
 power:st=>powerRotor(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4')),powerRef:'الشكل (1-4) ص 88',
 plant:P41,
 steps:[
  {t:'الوضع الابتدائي',x:'في هذا المختبر تغلق المتممات بيدك (بدون دائرة تحكم) لتفهم الدائرة الرئيسة. كل المتممات مفتوحة والمحرك متوقف.'},
  {t:'ابدأ على كل المقاومات',get x(){return `اضغط مفتاح K1 فقط. يصل الجهد إلى العضو الثابت، والتيار في العضو الدائر يمر في R1 و R2 و R3. لاحظ أن تيار البدء نحو ${P41.tp.span('I3')} A بدل ${P41.tp.span('Ist')} A.`},done:s=>s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.Q('Q4.3')&&!s.Q('Q4.4')&&s.plant.n>n41(3)*200/900},
  {t:'انتظر استقرار السرعة',get x(){return `السرعة تستقر قرب ${P41.tp.span('n3')} rpm لأن المقاومة الكبيرة تقلل العزم عند السرعات العالية.`},done:s=>s.Q('Q4.1')&&s.plant.n>n41(3)*850/900},
  {t:'أخرج R3',x:'اغلق K4. التيار يقصر عند K4 فلا يمر في R3. شاهد قفزة التيار الصغيرة ثم ارتفاع السرعة.',done:s=>s.Q('Q4.1')&&s.Q('Q4.4')},
  {t:'أخرج R2',x:'اغلق K3. الآن تبقى R1 فقط. (في التشغيل الحقيقي يفصل K4 هنا، لكن فصله أو بقاؤه لا يغير شيئاً لأن K3 قبله.)',done:s=>s.Q('Q4.1')&&s.Q('Q4.3')},
  {t:'قصر العضو الدائر',get x(){return `اغلق K2. كل المقاومات خارج الدائرة والمحرك يعمل بشكل طبيعي قرب ${P41.tp.span('n0')} rpm وتياره نحو 100 A.`},done:s=>s.Q('Q4.1')&&s.Q('Q4.2')&&s.plant.n>n41(0)*1400/1455},
  {t:'قارن بالبدء المباشر',get x(){return `افتح K1 وانتظر توقف المحرك، ثم مع بقاء K2 مغلقاً اغلق K1 من جديد. هذا بدء بدون مقاومات: التيار يقفز إلى نحو ${P41.tp.span('Ist')} A (مثال الكتاب 400–600 A).`},done:s=>s.Q('Q4.1')&&s.Q('Q4.2')&&s.plant.I>i41()*450/579},
  {t:'أوقف المحرك',x:'افتح K1. ينقطع الجهد عن العضو الثابت ويتوقف المحرك تدريجياً.',done:s=>!s.Q('Q4.1')&&s.plant.n<30}
 ],
 quiz:[
  {q:'حسب نص الكتاب، كم يسحب المحرك عند بداية التشغيل؟',o:['مثل تياره الاسمي','من ثلاثة إلى أربعة أضعاف التيار الاسمي','نصف التيار الاسمي','عشرة أضعاف دائماً'],c:1,e:'ص 87: «من ثلاثة إلى أربعة أضعاف التيار الإسمي» (مع أن مثال 100 A ← 400–600 A يعطي 4 إلى 6 أضعاف).'},
  {q:'في مثال الكتاب، محرك رافعة تياره الاسمي 100 A. كم تيار بدئه؟',o:['100 – 200 A','200 – 300 A','400 – 600 A','1000 A'],c:2,e:'ص 87: «فيكون تيار البدء من (400 – 600 A)».'},
  {q:'كيف توصل مقاومات البدء مع العضو الدائر؟',o:['على التوازي','على التوالي','مع العضو الثابت','لا توصل'],c:1,e:'«توصيل مجموعة من المقاومات على التوالي لتخفيف تيار البدء» ص 87.'},
  {q:'أي متمم موصول قبل R1 مباشرة فيقصر العضو الدائر كاملاً؟',o:['K1','K2','K3','K4'],c:1,e:'في الشكل (1-4) K2 موصول بخطوط العضو الدائر قبل R1.'},
  {q:'عند غلق K4 وحده (مع K1)، ما المقاومات الباقية في الدائرة؟',o:['R1 + R2','R3 فقط','لا شيء','R1 + R2 + R3'],c:0,e:'K4 بين R2 و R3، فيخرج R3 وتبقى R1 و R2.'},
  {q:'ما وظيفة المتمم K1 في الشكل (1-4)؟',o:['قصر R1','توصيل الجهد إلى العضو الثابت','قصر نقطة النجمة','حماية من الحمل الزائد'],c:1,e:'K1 هو المتمم الرئيسي: يوصل L1 و L2 و L3 بعد المصهرات وعبر F4 إلى العضو الثابت.'},
  {q:'ما العنصر F4 في الدائرة الرئيسة؟',o:['مصهر','مرحل حراري للحماية من الحمل الزائد','متمم قصر','مقاومة بدء'],c:1,e:'F4 في الشكل (1-4) هو المرحل الحراري بين K1 والمحرك.'},
  {q:'ماذا يحدث للتيار عند إخراج مجموعة مقاومات أثناء البدء؟',o:['يصبح صفراً','يقفز قفزة صغيرة ثم ينخفض مع ارتفاع السرعة','يبقى ثابتاً','ينعكس اتجاهه'],c:1,e:'تقل المقاومة فيزيد التيار لحظياً، ثم ترتفع السرعة فينخفض التيار. لذلك نخرج المقاومات على مراحل.'}
 ]
});

/* =================== Lesson 4.2 =================== */
B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'89–90',
 title:'دائرة التحكم السلكية والتسلسل الزمني للمزمنات',
 summary:'دائرة التحكم في الشكل (2-4): K1 يبدأ ومعه المزمن KT4، ثم يعمل K4 فـ K3 فـ K2 كل واحد بعد زمن مزمنه، وكل متمم يفصل الذي قبله.',
 stations:[
  {intro:true},

  {st:1,short:'دائرة التحكم',title:'ثانياً: دائرة التحكم، الشكل <span class="ltr">(2-4)</span>',ref:'ص 89',
   q:'لماذا وُضعت تلامسات <span class="ltr">K2</span> و <span class="ltr">K3</span> و <span class="ltr">K4</span> المغلقة في طريق ضاغط التشغيل <span class="ltr">S1</span>؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أعلى دائرة التحكم: F5 ثم S0 ثم فرع K1 — ضاغط S1 وتلامسات K2 و K3 و K4 المغلقة بالتوازي مع تلامس الإبقاء K1 — ومنه تتغذى بقية الفروع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="خط الطور ⟦L1⟧: منه يأتي جهد دائرة التحكم."><rect x="30" y="14" width="300" height="16" fill="transparent"/><path d="M44 22H320" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><text x="30" y="27" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">L1</text><g data-tip="خط التعادل ⟦N⟧: إليه يعود التيار بعد الملفات."><rect x="30" y="292" width="300" height="16" fill="transparent"/><path d="M44 300H320" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><text x="30" y="305" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N</text><circle cx="110" cy="22" r="3.5" fill="#2C4A40"/><g data-tip="تلامس الحماية ⟦F5⟧ المغلق: يفتح عند العطل فيقطع الجهد عن الدائرة كلها."><rect x="96" y="28" width="46" height="34" fill="transparent"/><path d="M110 28V35.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 55.0V62" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="55.0" r="2.6" fill="#2C4A40"/><path d="M110 35.0H120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 55.0L123 32.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><text x="130" y="52" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F5</text><g data-tip="ضاغط الفصل ⟦S0⟧ المغلق: الضغط عليه يقطع الجهد عن كل الفروع فيتوقف كل شيء."><rect x="96" y="62" width="46" height="34" fill="transparent"/><path d="M110 62V69.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 89.0V96" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="89.0" r="2.6" fill="#2C4A40"/><path d="M110 69.0H120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 89.0L123 66.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><text x="130" y="86" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S0</text><path d="M110 96V102" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="102" r="3.5" fill="#2C4A40"/><path d="M80 102H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="ضاغط التشغيل ⟦S1⟧ المفتوح: الضغط عليه يبدأ تشغيل ⟦K1⟧."><rect x="54" y="104" width="44" height="34" fill="transparent"/><path d="M80 104V111.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 131.0V138" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="131.0" r="2.6" fill="#2C4A40"/><path d="M80 131.0L68 112.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><text x="62" y="128" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text><g data-tip="تلامسات ⟦K2⟧ و ⟦K3⟧ و ⟦K4⟧ المغلقة: شرط بدء — لا يعمل ⟦K1⟧ إلا وكل متممات القصر مفصولة."><rect x="46" y="138" width="56" height="102" fill="transparent"/><path d="M80 138V145.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 165.0V172" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="165.0" r="2.6" fill="#2C4A40"/><path d="M80 145.0H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 165.0L93 142.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 172V179.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 199.0V206" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="199.0" r="2.6" fill="#2C4A40"/><path d="M80 179.0H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 199.0L93 176.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 206V213.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 233.0V240" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="233.0" r="2.6" fill="#2C4A40"/><path d="M80 213.0H90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 233.0L93 210.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="66" y="162" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K2</text><text x="66" y="196" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K3</text><text x="66" y="230" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4</text></g><path d="M150 102V146" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="تلامس الإبقاء ⟦K1⟧ المفتوح: يغلق مع عمل ⟦K1⟧ فيبقيه عاملاً بعد ترك ⟦S1⟧، ويتجاوز معه تلامسات ⟦K2⟧ و ⟦K3⟧ و ⟦K4⟧."><rect x="134" y="146" width="46" height="34" fill="transparent"/><path d="M150 146V153.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M150 173.0V180" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="173.0" r="2.6" fill="#2C4A40"/><path d="M150 173.0L138 154.0" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g><text x="162" y="170" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text><path d="M150 180V246" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 240V246" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 246H150" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="246" r="3.5" fill="#2C4A40"/><circle cx="150" cy="246" r="3.5" fill="#2C4A40"/><path d="M80 246V258" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="ملف المتمم الرئيسي ⟦K1⟧."><rect x="65.0" y="258" width="30" height="18" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></g><text x="58" y="272" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text><path d="M80 276V300" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="من هنا (بعد تلامس ⟦K1⟧) تتغذى فروع ⟦K2⟧ و ⟦KT2⟧ و ⟦K3⟧ و ⟦KT3⟧ و ⟦K4⟧ و ⟦KT4⟧، فلا يعمل أي منها قبل ⟦K1⟧."><rect x="150" y="226" width="190" height="64" fill="transparent"/><path d="M150 246H226" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="236,246 224,239 224,253" fill="#E8735A"/><rect x="240" y="224" width="96" height="44" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="288" y="242" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">بقية الفروع</text><text x="288" y="260" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K2 … KT4</text></g></svg>`,
   cap:'الجزء الأعلى من الشكل <span class="ltr">(2-4)</span>: فرع المتمم الرئيسي <span class="ltr">K1</span>، ومنه تتغذى بقية الفروع.<br><b>مرّر المؤشر على التلامسات والملف والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متمم القصر <span class="ltr">K2</span> عالق (بقيت نقاطه مغلقة من تشغيل سابق). ماذا يحدث عند الضغط على <span class="ltr">S1</span>؟',opts:[
     ['يبدأ المحرك بدون مقاومات',false,'هذا بالضبط ما تمنعه الدائرة: لو بدأ والعضو الدائر مقصور لسحب تيار البدء العالي.'],
     ['لا يعمل <span class="ltr">K1</span>، فلا يبدأ المحرك',true,'تلامس <span class="ltr">K2</span> المغلق في فرع <span class="ltr">S1</span> يكون مفتوحاً ما دام <span class="ltr">K2</span> عاملاً، فلا يصل التيار إلى ملف <span class="ltr">K1</span>.'],
     ['يعمل <span class="ltr">K1</span> ثم يفصل بعد زمن',false,'<span class="ltr">K1</span> لا يعمل أصلاً؛ الشرط ينقطع قبل ملفه.']]}}
   ],
   body:[
    {book:String.raw`<p>ثانياً: دائرة التحكم لتشغيل المحرك الحثي ذي العضو الدائر الملفوف باستخدام مقاومات البدء المتعددة المراحل. كما في الشكل <span class="ltr">(2-4)</span>.</p>`+`<div class="svgbox ctrlbox">${B.ctrlCircuit(CTRL4,()=>0,()=>0)}</div>`+String.raw`<p class="sub">الشكل <span class="ltr">(2-4)</span> (معاد رسمه)</p>`,ref:'ص 89'},
    {tip:String.raw`<p>في الكتاب تتفرع الفروع من نقاط مشتركة: نقطة بعد تلامس <span class="ltr">K1</span>، ونقطة بعد تلامس <span class="ltr">K2</span> المغلق، ونقطة بعد تلامس <span class="ltr">K3</span> المغلق. هنا أعيد الرسم بحيث يبدأ كل فرع بتلامس <span class="ltr">K1</span> ثم يكرر التلامسات المغلقة التي قبله. المنطق نفسه تماماً.</p>`,title:'عن الرسم'},
    {tip:String.raw`<ul><li><b>في الأعلى:</b> تلامس الحماية <span class="ltr">F5</span> المغلق ثم ضاغط الفصل <span class="ltr">S0</span> المغلق — يغذيان كل الفروع.</li>
     <li><b>فرع <span class="ltr">K1</span>:</b> [ <span class="ltr">S1</span> ← <span class="ltr">K2</span> مغلق ← <span class="ltr">K3</span> مغلق ← <span class="ltr">K4</span> مغلق ] بالتوازي مع تلامس الإبقاء <span class="ltr">K1</span>.</li>
     <li><b>كل متمم قصر:</b> تلامس مزمنه المؤجل الغلق بالتوازي مع تلامس إبقائه: <span class="ltr">KT2</span> يشغّل <span class="ltr">K2</span>، و <span class="ltr">KT3</span> يشغّل <span class="ltr">K3</span>، و <span class="ltr">KT4</span> يشغّل <span class="ltr">K4</span>.</li>
     <li><b>كل مزمن:</b> <span class="ltr">KT4</span> يعمل ما دام <span class="ltr">K4</span> مفصولاً، و <span class="ltr">KT3</span> يعمل بعد <span class="ltr">K4</span>، و <span class="ltr">KT2</span> يعمل بعد <span class="ltr">K3</span>.</li>
     <li><b>التلامسات المغلقة <span class="ltr">K2</span> ثم <span class="ltr">K3</span>:</b> تقطع كل ما بعدها، فإذا عمل <span class="ltr">K3</span> فصل <span class="ltr">K4</span> و <span class="ltr">KT3</span>، وإذا عمل <span class="ltr">K2</span> فصل <span class="ltr">K3</span> و <span class="ltr">KT2</span>.</li></ul>`,title:'اقرأ الدائرة فرعاً فرعاً'},
    {title:'جرّب شرط البدء',widget:(el,B)=>{
      const st={K2:0,K3:0,K4:0};let k1=0,msg='';
      const draw=()=>{
        el.innerHTML=`<p class="sub" style="margin:0 0 8px">اجعل أحد متممات القصر «عالقاً» (نقاطه مغلقة)، ثم اضغط <span class="ltr">S1</span>. جرّب أيضاً أن تجعله عالقاً بعد أن يعمل <span class="ltr">K1</span>.</p>
         <div class="w-row" style="margin-top:0">${['K2','K3','K4'].map(k=>`<button class="sw" type="button" data-k="${k}" aria-pressed="${!!st[k]}"><span class="knob"></span><b>${k}</b><small>${st[k]?'عالق (عامل)':'مفصول'}</small></button>`).join('')}</div>
         <div class="w-row"><button class="btn pri" type="button" data-s1>اضغط <span class="ltr">S1</span></button><button class="btn" type="button" data-s0>اضغط <span class="ltr">S0</span> (إيقاف)</button></div>
         <div class="facts"><div class="fact"><span>المتمم الرئيسي <bdi>K1</bdi></span><b>${k1?'يعمل':'مفصول'}</b></div></div>
         <p class="sub">${msg}</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;st[k]^=1;
          msg=k1?(st[k]?`<span class="ltr">K1</span> يبقى عاملاً: تلامس الإبقاء <span class="ltr">K1</span> يتجاوز تلامسات <span class="ltr">K2</span> و <span class="ltr">K3</span> و <span class="ltr">K4</span>، فهي شرط للبدء فقط.`:''):'';draw()});
        el.querySelector('[data-s1]').onclick=()=>{const bad=['K2','K3','K4'].filter(k=>st[k]);
          if(k1)msg='<span class="ltr">K1</span> يعمل من قبل، والضغط مرة أخرى لا يغير شيئاً.';
          else if(bad.length){msg=`لا يعمل <span class="ltr">K1</span>: تلامس ${bad.map(k=>`<span class="ltr">${k}</span>`).join(' و ')} المغلق مفتوح الآن لأن المتمم عامل، فلا يصل التيار إلى ملف <span class="ltr">K1</span>. هكذا تمنع الدائرة بدء المحرك والمقاومات مقصورة.`}
          else{k1=1;msg='يعمل <span class="ltr">K1</span> ويثبت نفسه بتلامس الإبقاء، فيبقى عاملاً بعد ترك <span class="ltr">S1</span>. والمحرك يبدأ على كل المقاومات.'}draw()};
        el.querySelector('[data-s0]').onclick=()=>{k1=0;msg='<span class="ltr">S0</span> في الجزء المشترك أعلى الدائرة: فتحه يقطع كل الفروع، فيفصل <span class="ltr">K1</span>.';draw()};
      };
      draw();
    }},
    {watch:String.raw`<p>عنصر الحماية في دائرة التحكم المرسومة اسمه <span class="ltr">F5</span>، بينما جدول المداخل (ص 90) يسمي «القاطع الحراري المغناطيسي لدائرة التحكم» <span class="ltr">F4</span> (و <span class="ltr">F4</span> في الشكل <span class="ltr">(1-4)</span> هو المرحل الحراري لدائرة القدرة). كذلك يُكتب المزمن الأول «<span class="ltr">kT2</span>» بحرف صغير، وفي الجدول «<span class="ltr">K2T</span>» و «<span class="ltr">T2</span>».</p>`,fix:true}
   ]},

  {st:2,short:'شرح التشغيل',title:'شرح التشغيل: ثلاث مراحل بثلاثة مزمنات',ref:'ص 90',
   q:'أي مجموعة مقاومات تخرج أولاً: القريبة من المحرك أم البعيدة عنه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة صفوف: عند S1 تكون R1 و R2 و R3 في الدائرة، ثم يخرج K4 المقاومة R3، ثم K3 يخرج R2، ثم K2 يخرج R1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="296" y="30" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">متى؟</text><text x="214" y="30" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">يعمل</text><text x="102" y="30" text-anchor="middle" direction="rtl" font-size="12" fill="#2C4A40" font-weight="600">في دائرة العضو الدائر</text><g data-tip="عند الضغط على ⟦S1⟧ يعمل ⟦K1⟧ ومعه المزمن ⟦T4⟧، والمقاومات الثلاث في الدائرة."><rect x="26" y="44" width="310" height="52" fill="transparent"/><rect x="26" y="44" width="310" height="52" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="296" y="75" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">عند <tspan direction="ltr" font-family="var(--mono)">S1</tspan></text><text x="214" y="75" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1 + T4</text><rect x="40" y="60" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="58" y="75" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R1</text><rect x="82" y="60" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="100" y="75" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R2</text><rect x="124" y="60" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="142" y="75" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R3</text></g><g data-tip="بعد زمن ⟦T4⟧ يعمل ⟦K4⟧ فيخرج ⟦R3⟧، ويفصل ⟦T4⟧ ويشغّل ⟦T3⟧."><rect x="26" y="106" width="310" height="52" fill="transparent"/><rect x="26" y="106" width="310" height="52" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="296" y="137" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">بعد <tspan direction="ltr" font-family="var(--mono)">T4</tspan></text><text x="214" y="137" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4</text><rect x="40" y="122" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="58" y="137" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R1</text><rect x="82" y="122" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="100" y="137" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R2</text><rect x="124" y="122" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="142" y="137" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R3</text></g><g data-tip="بعد زمن ⟦T3⟧ يعمل ⟦K3⟧ فيخرج ⟦R2⟧، ويفصل ⟦T3⟧ ويشغّل ⟦T2⟧."><rect x="26" y="168" width="310" height="52" fill="transparent"/><rect x="26" y="168" width="310" height="52" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="296" y="199" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">بعد <tspan direction="ltr" font-family="var(--mono)">T3</tspan></text><text x="214" y="199" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K3</text><rect x="40" y="184" width="36" height="20" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="58" y="199" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R1</text><rect x="82" y="184" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="100" y="199" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R2</text><rect x="124" y="184" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="142" y="199" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R3</text></g><g data-tip="بعد زمن ⟦T2⟧ يعمل ⟦K2⟧ فيخرج ⟦R1⟧، ويفصل ⟦T2⟧ ويستمر في العمل: المحرك يعمل بالشكل الطبيعي."><rect x="26" y="230" width="310" height="52" fill="transparent"/><rect x="26" y="230" width="310" height="52" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="296" y="261" text-anchor="middle" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="700">بعد <tspan direction="ltr" font-family="var(--mono)">T2</tspan></text><text x="214" y="261" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K2</text><rect x="40" y="246" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="58" y="261" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R1</text><rect x="82" y="246" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="100" y="261" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R2</text><rect x="124" y="246" width="36" height="20" rx="3" fill="#FBF6EE" stroke="#CFC6B4" stroke-width="2" stroke-dasharray="4 3"/><text x="142" y="261" text-anchor="middle" font-size="11.5" fill="#9A9384" font-weight="700" font-family="var(--mono)" direction="ltr">R3</text></g></svg>`,
   cap:'المقاومات الباقية في دائرة العضو الدائر بعد كل مرحلة؛ الإطار المنقط = مقاومة خرجت (قُصرت).<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف ماذا يحدث فيه.</b>',
   side:[
    {predict:{q:'بعد الضغط على <span class="ltr">S1</span>، أي متمم قصر يعمل أولاً؟',opts:[
     ['<span class="ltr">K2</span>',false,'<span class="ltr">K2</span> يعمل أخيراً؛ لو عمل أولاً لقصر العضو الدائر وأخرج المقاومات كلها مرة واحدة.'],
     ['تعمل الثلاثة معاً',false,'الهدف إخراج المقاومات <b>بالتدريج</b>، لذلك لكل متمم مزمن.'],
     ['<span class="ltr">K4</span>',true,'«وبعد فترة زمنية من عمل المزمن <span class="ltr">(T4)</span> يعمل المتمم <span class="ltr">(K4)</span> ... وإخراج مجموعة المقاومات <span class="ltr">(R3)</span>» ص 90.']]}}
   ],
   body:[
    {book:String.raw`<p>من الشكل <span class="ltr">(1-4)</span> والشكل <span class="ltr">(2-4)</span> نجد أنه عند تشغيل <span class="ltr">(S1)</span> فإنه يعمل المتمم الرئيس <span class="ltr">(K1)</span> ويعمل معه مباشرة المزمن <span class="ltr">(T4)</span>. وبذلك يعمل المحرك وجميع المقاومات <span class="ltr">(R1, R2, R3)</span> تكون الدائرة متصلة مع العضو. وبعد فترة زمنية من عمل المزمن <span class="ltr">(T4)</span> يعمل المتمم <span class="ltr">(K4)</span> فيعمل على قصر النقاط وإخراج مجموعة المقاومات <span class="ltr">(R3)</span>، وكذلك يعمل على فصل المزمن <span class="ltr">(T4)</span> وتشغيل المزمن <span class="ltr">(T3)</span>.</p>
     <p>بعد فترة زمنية من عمل المزمن <span class="ltr">(T3)</span> يعمل المتمم <span class="ltr">(K3)</span> فيعمل على قصر النقاط وإخراج مجموعة المقاومات <span class="ltr">(R2)</span>، وكذلك يعمل على فصل المزمن <span class="ltr">(T3)</span> وتشغيل المزمن <span class="ltr">(T2)</span>.</p>
     <p>بعد فترة زمنية من عمل المزمن <span class="ltr">(T2)</span> يعمل المتمم <span class="ltr">(K2)</span> فيعمل على قصر النقاط وإخراج مجموعة المقاومات <span class="ltr">(R1)</span>، وكذلك يعمل على فصل المزمن <span class="ltr">(T2)</span> ويستمر في العمل.</p>`,ref:'ص 90'},
    {tip:String.raw`<p>النص لا يذكر صراحة أن <span class="ltr">K4</span> يفصل عندما يعمل <span class="ltr">K3</span>، ولا أن <span class="ltr">K3</span> يفصل عندما يعمل <span class="ltr">K2</span>. لكن الدائرة تفعل ذلك: تلامس <span class="ltr">K3</span> المغلق يقطع فرعي <span class="ltr">K4</span> و <span class="ltr">KT3</span>، وتلامس <span class="ltr">K2</span> المغلق يقطع فرعي <span class="ltr">K3</span> و <span class="ltr">KT2</span>. الحالة النهائية: <span class="ltr">K1</span> و <span class="ltr">K2</span> فقط. ولا ضرر من فصل <span class="ltr">K4</span> أو <span class="ltr">K3</span>، لأن المتمم الجديد موصول قبله على خطوط العضو الدائر.</p>`,title:'ماذا يحدث للمتمم السابق؟'},
    {title:'امشِ مع التسلسل مرحلة مرحلة',widget:(el,B)=>{
      const ST=[
       {t:'المحرك متوقف',K:[0,0,0,0],T:'',x:'اضغط «التالي» لتضغط <span class="ltr">S1</span>.'},
       {t:'الضغط على S1',K:[1,0,0,0],T:'T4',x:'يعمل <span class="ltr">K1</span> ويعمل معه مباشرة المزمن <span class="ltr">T4</span>. المقاومات <span class="ltr">R1</span> و <span class="ltr">R2</span> و <span class="ltr">R3</span> كلها في دائرة العضو الدائر.'},
       {t:'بعد زمن T4',K:[1,0,0,1],T:'T3',x:'يعمل <span class="ltr">K4</span> فيخرج <span class="ltr">R3</span>، ويفصل <span class="ltr">T4</span> ويشغّل <span class="ltr">T3</span>.'},
       {t:'بعد زمن T3',K:[1,0,1,0],T:'T2',x:'يعمل <span class="ltr">K3</span> فيخرج <span class="ltr">R2</span>، ويفصل <span class="ltr">T3</span> ويشغّل <span class="ltr">T2</span>. ويفصل <span class="ltr">K4</span> أيضاً بتلامس <span class="ltr">K3</span> المغلق.'},
       {t:'بعد زمن T2',K:[1,1,0,0],T:'',x:'يعمل <span class="ltr">K2</span> فيخرج <span class="ltr">R1</span> ويفصل <span class="ltr">T2</span> ويستمر في العمل. ويفصل <span class="ltr">K3</span> أيضاً. يعمل المحرك بالشكل الطبيعي.'}];
      let i=0;
      const chip=(n,on,tm)=>`<div class="fact" style="${on?'outline:2px solid var(--'+(tm?'blue':'on')+')':'opacity:.5'}"><span>${tm?'المزمن':'المتمم'}</span><b class="ltr">${n}</b><span>${on?(tm?'يعدّ':'يعمل'):'مفصول'}</span></div>`;
      const draw=()=>{const s=ST[i],[k1,k2,k3,k4]=s.K;
        el.innerHTML=`<div class="w-row" style="margin-top:0"><button class="btn pri" type="button" data-nx ${i>=ST.length-1?'disabled':''}>التالي</button><button class="btn" type="button" data-rs>من البداية</button><b style="margin-inline-start:6px">${B.ltrU(s.t.replace(/(S1|T\d)/,'<span class="ltr">$1</span>'))}</b></div>
         <div class="facts" style="grid-template-columns:repeat(4,minmax(0,1fr))">${chip('K1',k1)}${chip('K4',k4)}${chip('K3',k3)}${chip('K2',k2)}</div>
         <div class="facts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${['T4','T3','T2'].map(t=>chip(t,s.T===t,1)).join('')}</div>
         <div class="svgbox" style="margin-top:8px;max-width:560px;margin-inline:auto">${powerRotor(k1,k2,k3,k4)}</div><p class="sub">${s.x}</p>`;
        el.querySelector('[data-nx]').onclick=()=>{i=Math.min(ST.length-1,i+1);draw()};
        el.querySelector('[data-rs]').onclick=()=>{i=0;draw()}};
      draw();
    }},
    {add:String.raw`<p>الكتاب لا يحدد زمن المزمنات في الدائرة السلكية، لكن البرنامج في الفصل الثالث يجعل زمن كل مزمن <span class="ltr">S5T#5S</span> (خمس ثوانٍ). بهذا الزمن يكون التسلسل كما في المخطط الزمني التالي (ليس من الكتاب)، والصف الأخير يبين المقاومات الباقية في الدائرة:</p><div class="svgbox" style="max-width:620px;margin-inline:auto">${timingSVG()}</div>`,title:'مخطط زمني'},
    {watch:String.raw`<p>النص يقول «المزمن <span class="ltr">(T4)</span>» بينما يُكتب في الرسم <span class="ltr">KT4</span>، وفي الجدول «<span class="ltr">K4T</span>». الثلاثة اسم لمزمن واحد.</p>`,fix:true}
   ]},

  {recap:[
   String.raw`دائرة التحكم، الشكل <span class="ltr">(2-4)</span>: <span class="ltr">F5</span> و <span class="ltr">S0</span> المغلقان في الأعلى يغذيان كل الفروع، وفتح أي منهما يوقف كل شيء (ص 89).`,
   String.raw`<span class="ltr">K1</span> لا يبدأ إلا وتلامسات <span class="ltr">K2</span> و <span class="ltr">K3</span> و <span class="ltr">K4</span> المغلقة موصلة، أي متممات القصر كلها مفصولة؛ وبعد البدء يتجاوزها تلامس الإبقاء.`,
   String.raw`عند تشغيل <span class="ltr">S1</span> يعمل <span class="ltr">K1</span> ومعه المزمن <span class="ltr">T4</span>، والمقاومات <span class="ltr">R1</span> و <span class="ltr">R2</span> و <span class="ltr">R3</span> كلها في الدائرة (ص 90).`,
   String.raw`بعد كل مزمن يعمل متمم قصر ويخرج مجموعة ويشغّل المزمن التالي: <span class="ltr">K4</span> يخرج <span class="ltr">R3</span>، ثم <span class="ltr">K3</span> يخرج <span class="ltr">R2</span>، ثم <span class="ltr">K2</span> يخرج <span class="ltr">R1</span> (ص 90).`,
   String.raw`الحالة النهائية: <span class="ltr">K1</span> و <span class="ltr">K2</span> فقط، والمحرك يعمل بالشكل الطبيعي.`]}
],
 theory:[
  {h:'ثانياً: دائرة التحكم',ref:'ص 89',html:`<p>الشكل (2-4) يوضح دائرة التحكم (مخطط مسار التيار) بين <b>L1</b> و <b>N</b>. في أعلاها تلامس الحماية <b>F5</b> المغلق ثم ضاغط الفصل <b>S0</b> المغلق. ومنهما:</p>
   <ul><li><b>فرع K1:</b> [ S1 مفتوح ← K2 مغلق ← K3 مغلق ← K4 مغلق ] بالتوازي مع تلامس الإبقاء K1. أي أن K1 لا يبدأ إلا إذا كانت كل متممات القصر مفصولة، وبعد البدء يتجاوزها تلامس الإبقاء.</li>
   <li>من الطرف السفلي لتلامس K1 (العقدة B) تتغذى بقية الفروع، فلا يعمل شيء منها قبل K1:</li>
   <li><b>K2:</b> [ KT2 مؤجل الغلق ∥ K2 إبقاء ]. <b>kT2:</b> K2 مغلق ← K3 مفتوح.</li>
   <li>بعد تلامس K2 المغلق (العقدة C): <b>K3:</b> [ KT3 ∥ K3 ]. <b>KT3:</b> K3 مغلق ← K4 مفتوح.</li>
   <li>بعد تلامس K3 المغلق (العقدة D): <b>K4:</b> [ KT4 ∥ K4 ]. <b>KT4:</b> K4 مغلق.</li></ul>`},
  {fig:'(2-4)',ref:'ص 89',caption:'دائرة التحكم لتشغيل المحرك ذي العضو الدائر الملفوف بمقاومات البدء (معاد رسمها)',draw:'ctrl'},
  {note:'<b>توضيح عن الرسم:</b> في الكتاب تتفرع الفروع من عقد مشتركة (B بعد تلامس K1، و C بعد تلامس K2 المغلق، و D بعد تلامس K3 المغلق). هنا أعيد الرسم بحيث يبدأ كل فرع بتلامس <b>K1</b> ثم يكرر التلامسات المغلقة التي قبله. المنطق نفسه تماماً: العقدة B تتغذى فقط عندما يعمل K1.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في دائرة التحكم المرسومة عنصر الحماية اسمه <b>F5</b>، بينما جدول المداخل (ص 90) يسمي «القاطع الحراري المغناطيسي لدائرة التحكم» <b>F4</b> (و F4 في الشكل (1-4) هو المرحل الحراري لدائرة القدرة). كذلك يُكتب المزمن الأول «kT2» بحرف صغير، وفي الجدول «K2T» و «T2». في المحاكاة زر العطل اسمه F4 (حسب الجدول) ويفتح التلامس F5 في الرسم.'+'</div>'},
  {h:'شرح التشغيل',ref:'ص 90',html:`<p>«من الشكل (1-4) والشكل (2-4) نجد أنه عند تشغيل (S1) فإنه يعمل المتمم الرئيس (K1) ويعمل معه مباشرة المزمن (T4). وبذلك يعمل المحرك وجميع المقاومات (R1, R2, R3) تكون الدائرة متصلة مع العضو. وبعد فترة زمنية من عمل المزمن (T4) يعمل المتمم (K4) فيعمل على قصر النقاط وإخراج مجموعة المقاومات (R3)، وكذلك يعمل على فصل المزمن (T4) وتشغيل المزمن (T3).</p>
   <p>بعد فترة زمنية من عمل المزمن (T3) يعمل المتمم (K3) فيعمل على قصر النقاط وإخراج مجموعة المقاومات (R2)، وكذلك يعمل على فصل المزمن (T3) وتشغيل المزمن (T2).</p>
   <p>بعد فترة زمنية من عمل المزمن (T2) يعمل المتمم (K2) فيعمل على قصر النقاط وإخراج مجموعة المقاومات (R1)، وكذلك يعمل على فصل المزمن (T2) ويستمر في العمل.»</p>`},
  {note:'<b>توضيح (من قراءة الدائرة):</b> النص لا يذكر صراحة أن K4 يفصل عندما يعمل K3، ولا أن K3 يفصل عندما يعمل K2. لكن الدائرة تفعل ذلك: تلامس K3 المغلق يقطع العقدة D (فيفصل K4 و KT3)، وتلامس K2 المغلق يقطع العقدة C (فيفصل K3 و KT2). الحالة النهائية: K1 و K2 فقط.'},
  {fig:'',caption:'<b>مخطط زمني توضيحي (ليس من الكتاب):</b> زمن كل مزمن 5 ثوانٍ كما في البرنامج (S5T#5S)، والصف الأخير يبين المقاومات الباقية في الدائرة',draw:()=>`<div class="svgbox" style="max-width:620px;margin-inline:auto">${timingSVG()}</div>`},
  {h:'الدائرة الرئيسة للمقارنة',ref:'ص 88'},
  {fig:'(1-4)',ref:'ص 88',caption:'الدائرة الرئيسة (تتغير ألوانها في المختبر مع كل متمم)',draw:'power'}
 ],
 io:IO4,inputs:IN4,
 variants:VAR4('fixed'),
 power:st=>powerRotor(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4')),powerRef:'الشكل (1-4) ص 88',
 ctrl:CTRL4,ctrlMap:MAP4,ctrlRef:'الشكل (2-4) ص 89',
 plant:rotorPlant(getK,{timers:true,id:'u4-l2'}),
 plcNote:'المختبر في هذا الدرس يعمل افتراضياً بالنسخة <b>المصححة</b> من برنامج الكتاب، لأنها تتصرف مثل الدائرة السلكية تماماً. نسخة الكتاب الحرفية وخطؤها تُشرح في الدرس 4.3. الضاغط S0 والقاطع F4 موصولان تلامساً مغلقاً: يصل للـ PLC 1 في الوضع العادي و 0 عند الضغط أو الفصل.',
 steps:[
  {t:'الوضع الابتدائي',x:'المحرك متوقف. في دائرة التحكم الجهد يصل حتى ضاغط S1 فقط، وفي الدائرة الرئيسة حتى مداخل K1.'},
  {t:'اضغط S1',x:'يعمل K1 ويثبت نفسه بتلامس الإبقاء، ويبدأ المزمن KT4 مباشرة. المحرك يبدأ على كل المقاومات.',done:s=>s.Q('Q4.1')&&s.T('T4').run},
  {t:'المرحلة الأولى: K4',x:'بعد 5 ثوانٍ يغلق تلامس KT4 فيعمل K4 ويخرج R3، وتلامسه المغلق يفصل KT4 وتلامسه المفتوح يشغّل KT3.',done:s=>s.Q('Q4.4')},
  {t:'المرحلة الثانية: K3',x:'بعد 5 ثوانٍ أخرى يعمل K3 فيخرج R2. لاحظ أن K4 و KT3 يفصلان (تلامس K3 المغلق قطع العقدة D) ويبدأ KT2.',done:s=>s.Q('Q4.3')&&!s.Q('Q4.4')},
  {t:'المرحلة الأخيرة: K2',x:'يعمل K2 فيقصر العضو الدائر. يفصل K3 و KT2. الحالة النهائية K1 و K2 فقط، وانظر إلى درجات التيار في المنحنى.',done:s=>s.Q('Q4.2')&&!s.Q('Q4.3')},
  {t:'أوقف المحرك',x:'اضغط S0. ينقطع الجهد عن كل الفروع فتفصل كل المتممات.',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.btn('S0')},
  {t:'الحماية',x:'شغّل من جديد بـ S1، وأثناء البدء اضغط «فصل F4». يتوقف كل شيء فوراً. أعد الضبط قبل التشغيل التالي.',done:s=>s.btn('F4')&&!s.Q('Q4.1')}
 ],
 quiz:[
  {q:'ماذا يعمل مباشرة مع K1 عند الضغط على S1؟',o:['المزمن T2','المزمن T4','المتمم K2','المتمم K3'],c:1,e:'«يعمل المتمم الرئيس (K1) ويعمل معه مباشرة المزمن (T4)» ص 90.'},
  QUIZ_COMMON.seq,
  {q:'لماذا وُضعت تلامسات K2 و K3 و K4 المغلقة في فرع ضاغط S1؟',o:['لتسريع البدء','حتى لا يبدأ المحرك إلا وكل متممات القصر مفصولة','لعكس الحركة','لفصل المزمنات'],c:1,e:'هي شرط بدء: لو كان أحد متممات القصر عالقاً لا يبدأ K1 فلا يبدأ المحرك بدون مقاومات.'},
  {q:'عندما يعمل K4، ماذا يحدث للمزمنات؟',o:['يفصل KT4 ويبدأ KT3','يبدأ KT2','لا يتغير شيء','يفصل K1'],c:0,e:'«يعمل على فصل المزمن (T4) وتشغيل المزمن (T3)» ص 90.'},
  QUIZ_COMMON.final,
  {q:'ما نوع تلامسات KT2 و KT3 و KT4 في فروع المتممات؟',o:['مفتوحة مؤجلة الغلق (تأخير عند التشغيل)','مغلقة مؤجلة الفتح','ضواغط','تلامسات حرارية'],c:0,e:'المزمنات بتأخير عند التشغيل، وتلامساتها تغلق بعد انتهاء الزمن.'},
  {q:'إذا ضُغط S0 أثناء التشغيل، ماذا يحدث؟',o:['يفصل K2 فقط','تفصل كل المتممات لأن S0 في الجزء المشترك','يعود المحرك إلى المرحلة الأولى','لا شيء'],c:1,e:'S0 المغلق في أعلى الدائرة يغذي كل الفروع، وفتحه يقطع كل شيء.'}
 ]
});

/* =================== Lesson 4.3 =================== */
B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'90–92',
 title:'جدول المداخل والمخارج وبرنامج LAD (دالة التخزين والمزمنات)',
 summary:'تخصيص عناوين الـ PLC للضواغط والمتممات والمزمنات، ثم البرنامج بلغة LAD في ثماني شبكات بصناديق SR ومزمنات S_ODT، مع خطأ إعادة الضبط بالعلامة M0.0.',
 stations:[
  {intro:true},

  {st:1,short:'جدول المداخل والمخارج',title:'جدول تخصيص المداخل والمخارج',ref:'ص 90',
   q:'ضاغط الفصل <span class="ltr">S0</span> غير مضغوط… فلماذا يقرأ الـ <span class="ltr">PLC</span> على مدخله <span class="ltr">1</span> وليس <span class="ltr">0</span>؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="وحدة PLC: المداخل S0 و S1 و F4 على اليمين، والمخارج K1 إلى K4 والمزمنات T2 إلى T4 على اليسار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="وحدة الـ ⟦PLC⟧: تقرأ المداخل وتنفذ البرنامج وتكتب المخارج."><rect x="130" y="40" width="100" height="240" rx="12" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="66" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text></g><g data-tip="ضاغط الفصل ⟦S0⟧ على المدخل ⟦I0.1⟧. موصول تلامساً مغلقاً: يصل ⟦1⟧ في الوضع العادي و⟦0⟧ عند الضغط."><rect x="230" y="84" width="120" height="30" fill="transparent"/><path d="M232 100H272" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="232" cy="100" r="5" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/><text x="214" y="105" text-anchor="end" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><rect x="276" y="87" width="52" height="26" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="302" y="105" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S0</text></g><g data-tip="ضاغط التشغيل ⟦S1⟧ على المدخل ⟦I1.1⟧."><rect x="230" y="134" width="120" height="30" fill="transparent"/><path d="M232 150H272" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="232" cy="150" r="5" fill="#12855A" stroke="#FBF6EE" stroke-width="2"/><text x="214" y="155" text-anchor="end" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I1.1</text><rect x="276" y="137" width="52" height="26" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="302" y="155" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text></g><g data-tip="الحماية ⟦F4⟧ على المدخل ⟦I0.0⟧. موصولة تلامساً مغلقاً: يصل ⟦1⟧ في الوضع العادي و⟦0⟧ عند الفصل."><rect x="230" y="184" width="120" height="30" fill="transparent"/><path d="M232 200H272" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="232" cy="200" r="5" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/><text x="214" y="205" text-anchor="end" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><rect x="276" y="187" width="52" height="26" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="302" y="205" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F4</text></g><text x="302" y="244" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">المداخل</text><text x="58" y="272" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">المخارج</text><g data-tip="المتمم الرئيسي ⟦K1⟧ على المخرج ⟦Q4.1⟧."><rect x="10" y="79" width="120" height="26" fill="transparent"/><path d="M88 92H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="92" r="4.5" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="96" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><rect x="34" y="81" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="96" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text></g><g data-tip="متمم القصر ⟦K2⟧ (يخرج ⟦R1⟧) على المخرج ⟦Q4.2⟧."><rect x="10" y="105" width="120" height="26" fill="transparent"/><path d="M88 118H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="118" r="4.5" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="122" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><rect x="34" y="107" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="122" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K2</text></g><g data-tip="متمم القصر ⟦K3⟧ (يخرج ⟦R2⟧) على المخرج ⟦Q4.3⟧."><rect x="10" y="131" width="120" height="26" fill="transparent"/><path d="M88 144H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="144" r="4.5" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="148" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><rect x="34" y="133" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="148" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K3</text></g><g data-tip="متمم القصر ⟦K4⟧ (يخرج ⟦R3⟧) على المخرج ⟦Q4.4⟧."><rect x="10" y="157" width="120" height="26" fill="transparent"/><path d="M88 170H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="170" r="4.5" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="174" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><rect x="34" y="159" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="174" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K4</text></g><g data-tip="خرج المزمن ⟦T2⟧ يُكتب في المخرج ⟦Q5.2⟧."><rect x="10" y="183" width="120" height="26" fill="transparent"/><path d="M88 196H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="196" r="4.5" fill="#F2C14E" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="200" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.2</text><rect x="34" y="185" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="200" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T2</text></g><g data-tip="خرج المزمن ⟦T3⟧ يُكتب في المخرج ⟦Q5.3⟧."><rect x="10" y="209" width="120" height="26" fill="transparent"/><path d="M88 222H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="222" r="4.5" fill="#F2C14E" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="226" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.3</text><rect x="34" y="211" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="226" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T3</text></g><g data-tip="خرج المزمن ⟦T4⟧ يُكتب في المخرج ⟦Q5.4⟧."><rect x="10" y="235" width="120" height="26" fill="transparent"/><path d="M88 248H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="248" r="4.5" fill="#F2C14E" stroke="#FBF6EE" stroke-width="2"/><text x="146" y="252" text-anchor="start" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4</text><rect x="34" y="237" width="50" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="59" y="252" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T4</text></g></svg>`,
   cap:'كل ضاغط وكل متمم وكل مزمن وعنوانه في الـ <span class="ltr">PLC</span>.<br><b>مرّر المؤشر على المداخل والمخارج (أو المسها في الجوال) لتعرف معنى كل منها.</b>',
   side:[
    {predict:{q:'ما عنوان المتمم <span class="ltr">K4</span> في الجدول؟',opts:[
     ['<span class="ltr">Q5.4</span>',false,'<span class="ltr">Q5.4</span> هو المخرج الذي يُكتب فيه خرج المزمن <span class="ltr">T4</span>.'],
     ['<span class="ltr">Q4.4</span>',true,'عنوان <span class="ltr">K4</span> هو <span class="ltr">Q4.4</span>: الملف المتمم <span class="ltr">(K4)</span> لقصر الدائرة وإخراج <span class="ltr">(R3)</span>.'],
     ['<span class="ltr">I0.4</span>',false,'الحرف <span class="ltr">I</span> للمداخل؛ <span class="ltr">K4</span> حمل يشغّله الـ <span class="ltr">PLC</span>، أي مخرج.']]}}
   ],
   body:[
    {book:String.raw`<p>من الشكل <span class="ltr">(1-4)</span> نجد أن</p><div class="tablebox"><table class="tt"><thead><tr><th>نقاط الدخل والخرج</th><th>الوصف</th><th>الترميز في <span class="ltr">(PLC)</span></th></tr></thead><tbody>`+IO4.map(r=>`<tr><td class="mono">${r.sym}</td><td>${r.desc}</td><td class="mono">${r.addr}</td></tr>`).join('')+`</tbody></table></div>`,ref:'ص 90'},
    {tip:String.raw`<ul><li><b>المداخل:</b> ثلاثة فقط — الحماية <span class="ltr">F4</span> و <span class="ltr">S0</span> و <span class="ltr">S1</span>. تلامسات المتممات المساعدة والمزمنات لم تعد أسلاكاً؛ البرنامج يقرأ حالة المخارج نفسها.</li>
     <li><b>المخارج <span class="ltr">Q4.1</span> إلى <span class="ltr">Q4.4</span>:</b> ملفات المتممات <span class="ltr">K1</span> إلى <span class="ltr">K4</span>.</li>
     <li><b>المزمنات:</b> في البرنامج هي <span class="ltr">T2</span> و <span class="ltr">T3</span> و <span class="ltr">T4</span> داخل الـ <span class="ltr">PLC</span>، وخرج كل منها يُكتب في مخرج (<span class="ltr">Q5.2</span> و <span class="ltr">Q5.3</span> و <span class="ltr">Q5.4</span>) حتى نرى عمله على لمبة.</li></ul>`,title:'اقرأ الجدول'},
    {tip:String.raw`<p>الضاغط <span class="ltr">S0</span> والحماية <span class="ltr">F4</span> موصولان على المدخلين <span class="ltr">I0.1</span> و <span class="ltr">I0.0</span> <b>تلامساً مغلقاً</b>، كما في الدائرة السلكية. لذلك يصل إلى المدخل <span class="ltr">1</span> في الوضع العادي، ويصبح <span class="ltr">0</span> عند الضغط على <span class="ltr">S0</span> أو فصل <span class="ltr">F4</span>. ولهذا يكتب البرنامج الإلغاء بـ «ليس» (<span class="ltr">ON I 0.0</span> و <span class="ltr">ON I 0.1</span>).</p>`,title:'لماذا 1 في الوضع العادي؟'},
    {title:'اضغط S0 أو افصل F4',widget:(el,B)=>{
      let s0=0,f4=0;
      const draw=()=>{const i01=s0?0:1,i00=f4?0:1,r=(!i00||!i01)?1:0;
        el.innerHTML=`<div class="w-row" style="margin-top:0"><button class="sw" type="button" data-s0 aria-pressed="${!!s0}"><span class="knob"></span><b>S0</b><small>${s0?'مضغوط':'غير مضغوط'}</small></button><button class="sw" type="button" data-f4 aria-pressed="${!!f4}"><span class="knob"></span><b>F4</b><small>${f4?'فصلت (عطل)':'سليمة'}</small></button></div>
         <div class="facts" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="fact"><span>المدخل <bdi>I0.1 (S0)</bdi></span><b class="ltr">${i01}</b></div><div class="fact"><span>المدخل <bdi>I0.0 (F4)</bdi></span><b class="ltr">${i00}</b></div><div class="fact" style="${r?'outline:2px solid var(--stop)':''}"><span>إلغاء العلامة <bdi>M0.0</bdi></span><b>${r?'نعم — توقف':'لا'}</b></div></div>
         <p class="sub">${r?'أحد المدخلين أصبح <span class="ltr">0</span>، فـ «ليس» تعطي <span class="ltr">1</span> وتُلغى العلامة <span class="ltr">M0.0</span> فيتوقف كل شيء.':'المدخلان <span class="ltr">1</span> في الوضع العادي، فلا إلغاء. لاحظ أن الـ <span class="ltr">PLC</span> يقرأ <span class="ltr">1</span> والضاغط غير مضغوط.'}</p>`;
        el.querySelector('[data-s0]').onclick=()=>{s0^=1;draw()};el.querySelector('[data-f4]').onclick=()=>{f4^=1;draw()}};
      draw();
    }},
    {watch:String.raw`<p>الجدول يسمي الحماية <span class="ltr">F4</span> «القاطع الحراري المغناطيسي لدائرة التحكم» بينما هي في الشكل <span class="ltr">(2-4)</span> <span class="ltr">F5</span>. والمزمنات تسمى في الرسم <span class="ltr">KT2/KT3/KT4</span>، وفي الجدول «<span class="ltr">K2T/K3T/K4T</span>» ورمزها <span class="ltr">T2/T3/T4</span>.</p>`,fix:true}
   ]},

  {st:2,short:'LAD: الشبكتان 1 و 2',title:'أولاً: دائرة <span class="ltr">LAD</span> — دالة التخزين للتشغيل والمتمم الرئيسي',ref:'ص 91',
   q:'الضاغط <span class="ltr">S1</span> يُضغط لحظة ثم يُترك… فأين «يتذكر» البرنامج أن المحرك يجب أن يبقى عاملاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 1 بلغة LAD: صندوق SR للعلامة M0.0؛ S من I1.1، و R من I0.0 أو I0.1 بتلامس مغلق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="خط التغذية الأيسر في المخطط السلمي: منه يبدأ «التيار» في كل شبكة."><rect x="18" y="50" width="16" height="230" fill="transparent"/><path d="M26 56V276" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="دالة التخزين ⟦SR⟧: إشارة ⟦1⟧ على ⟦S⟧ تثبّت الخرج ⟦Q = 1⟧ ويبقى حتى بعد زوالها، وإشارة ⟦1⟧ على ⟦R⟧ تلغيه."><rect x="190" y="96" width="70" height="96" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="225.0" y="88" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text><text x="225.0" y="116" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SR</text><text x="198" y="142" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><text x="198" y="178" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="252" y="142" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text></g><path d="M26 142H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="تلامس مفتوح للمدخل ⟦I1.1⟧ (الضاغط ⟦S1⟧): الضغط عليه يعطي ⟦1⟧ على طرف ⟦S⟧ فتُثبَّت العلامة."><rect x="62" y="118" width="40" height="34" fill="transparent"/><path d="M82 132V152" fill="none" stroke="#12855A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 132V152" fill="none" stroke="#12855A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="127" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">I1.1</text></g><path d="M110 142H190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 178H60" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 178V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 178H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 230H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="تلامسان مغلقان على التوازي للمدخلين ⟦I0.0⟧ (⟦F4⟧) و ⟦I0.1⟧ (⟦S0⟧). المدخلان موصولان مغلقين فيصلهما ⟦1⟧ عادة؛ إذا أصبح أحدهما ⟦0⟧ (ضغط ⟦S0⟧ أو فصل ⟦F4⟧) مرّ «التيار» إلى ⟦R⟧ فأُلغيت العلامة."><rect x="62" y="154" width="52" height="94" fill="transparent"/><path d="M82 168V188" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 168V188" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M86 187L106 169" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="163" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><path d="M82 220V240" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 220V240" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M86 239L106 221" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="215" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text></g><path d="M110 178H132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 230H132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 178V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 178H190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 142H292" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الملف ⟦M0.0⟧: علامة داخلية (ذاكرة) في الـ ⟦PLC⟧ تحفظ أمر التشغيل، وليست مخرجاً يُوصل عليه حمل."><rect x="288" y="120" width="60" height="40" fill="transparent"/><path d="M298 132A10 10 0 0 0 298 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M318 132A10 10 0 0 1 318 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="308" y="120" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text></g><text x="180" y="300" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="600">دالة تخزين لمجموعة الفصل والتشغيل</text></svg>`,
   cap:'<span class="ltr">Network 1</span> كما في الكتاب: صندوق <span class="ltr">SR</span> للعلامة <span class="ltr">M0.0</span>.<br><b>مرّر المؤشر على الصندوق والتلامسات والملف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ضغطت <span class="ltr">S1</span> ثم تركته. ما قيمة <span class="ltr">M0.0</span> بعد ترك الضاغط؟',opts:[
     ['<span class="ltr">0</span>، لأن <span class="ltr">I1.1</span> عاد <span class="ltr">0</span>',false,'هذا يحدث مع ملف عادي <span class="ltr">( )</span>، أما دالة التخزين فتحفظ القيمة.'],
     ['تبقى <span class="ltr">1</span> حتى يصل <span class="ltr">1</span> إلى طرف <span class="ltr">R</span>',true,'دالة التخزين <span class="ltr">SR</span> تثبّت الخرج بإشارة على <span class="ltr">S</span>، ولا تلغيه إلا إشارة على <span class="ltr">R</span> — أي ضغط <span class="ltr">S0</span> أو فصل <span class="ltr">F4</span>.'],
     ['تتغير بين <span class="ltr">0</span> و <span class="ltr">1</span> في كل دورة مسح',false,'لا يوجد ما يغيرها ما دام طرفا <span class="ltr">S</span> و <span class="ltr">R</span> لا يتغيران.']]}}
   ],
   body:[
    {book:String.raw`<p>أولاً: دائرة <span class="ltr">(LAD)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات</p>`+(()=>{const P=B.createPLC(BOOK4),nm={};IO4.forEach(r=>nm[r.addr]=r.sym);const CM=['دالة تخزين لمجموعة الفصل والتشغيل','تشغيل المتمم الرئيسي'];
      return [0,1].map(i=>`<div class="net static"><header><h3>Network ${i+1}</h3></header><div class="svgbox fixed">${B.ladNetwork(P.nets[i],P,nm)}</div><p class="sub">${CM[i]}</p></div>`).join('')})(),ref:'ص 91'},
    {tip:String.raw`<p>الكتاب يرسم <span class="ltr">LAD</span> بصناديق <span class="ltr">SR</span>. الرسم هنا يعرض الشبكات نفسها بملفي <b>S</b> (تثبيت) و <b>R</b> (إلغاء) بدل الصندوق. المنطق مطابق: ما يصل إلى طرف <span class="ltr">S</span> في الصندوق يصل هنا إلى الملف <span class="ltr">S</span>، وما يصل إلى طرف <span class="ltr">R</span> يصل إلى الملف <span class="ltr">R</span>.</p>`,title:'عن الرسم'},
    {tip:String.raw`<ul><li><b><span class="ltr">Network 1</span>:</b> <span class="ltr">S1</span> <span class="ltr">(I1.1)</span> يثبّت العلامة <span class="ltr">M0.0</span>. وتُلغى <span class="ltr">M0.0</span> إذا انقطعت إشارة <span class="ltr">F4</span> <span class="ltr">(I0.0)</span> <b>أو</b> إشارة <span class="ltr">S0</span> <span class="ltr">(I0.1)</span>.</li>
     <li><b><span class="ltr">Network 2</span>:</b> يُثبَّت <span class="ltr">K1</span> <span class="ltr">(Q4.1)</span> إذا كانت <span class="ltr">M0.0 = 1</span> <b>و</b> متممات القصر <span class="ltr">Q4.2</span> و <span class="ltr">Q4.3</span> و <span class="ltr">Q4.4</span> كلها مفصولة (تلامسات مغلقة)، ويُلغى عندما تصبح <span class="ltr">M0.0 = 0</span> (تلامس مغلق على <span class="ltr">R</span>).</li></ul>`,title:'اقرأ الشبكتين'},
    {add:String.raw`<p>العلامة <span class="ltr">M</span> «ذاكرة» داخلية في الـ <span class="ltr">PLC</span>، مثل ورقة تكتب عليها «المحرك مطلوب تشغيله». لا يوصل عليها شيء من الخارج، لكن كل الشبكات التالية تقرؤها.</p>`,title:'ما العلامة M0.0؟'},
    {watch:String.raw`<p>تلامسات <span class="ltr">Q4.2</span> و <span class="ltr">Q4.3</span> و <span class="ltr">Q4.4</span> المغلقة في <span class="ltr">Network 2</span> شرط على طرف <span class="ltr">S</span> فقط، تماماً مثل تلامسات <span class="ltr">K2</span> و <span class="ltr">K3</span> و <span class="ltr">K4</span> في فرع <span class="ltr">S1</span> بالدائرة السلكية: بعد أن يُثبَّت <span class="ltr">K1</span> لا يلغيه عمل متممات القصر.</p>`},
    {title:'مختبر مصغّر: شغّل الشبكتين 1 و 2',widget:(el,B)=>{const P=B.createPLC(FIX4),nm={};IO4.forEach(r=>nm[r.addr]=r.sym);
      return DCML.lab(el,B,{intro:String.raw`هذه هي الشبكتان 1 و 2 من البرنامج (وهما متطابقتان في نسخة الكتاب والنسخة المصححة). اضغط الأزرار واحداً واحداً وراقب العلامة <span class="ltr">M0.0</span> والمتمم <span class="ltr">K1</span>. الخطوط الملونة = إشارة <span class="ltr">1</span> تمر.`,
       predict:{q:String.raw`المحرك يعمل. ضغطت <span class="ltr">S0</span> ثم تركته. هل يعود <span class="ltr">K1</span> للعمل وحده بعد ترك <span class="ltr">S0</span>؟`,opts:[
        [String.raw`نعم، لأن <span class="ltr">I0.1</span> رجع <span class="ltr">1</span>`,false,String.raw`رجوع <span class="ltr">I0.1</span> إلى <span class="ltr">1</span> يزيل شرط الإلغاء فقط، ولا يثبّت شيئاً.`],
        [String.raw`لا، يبقى متوقفاً حتى تضغط <span class="ltr">S1</span> من جديد`,true,String.raw`ضغط <span class="ltr">S0</span> ألغى العلامة <span class="ltr">M0.0</span> فأُلغي <span class="ltr">K1</span>، ولا يثبّتها مرة أخرى إلا <span class="ltr">1</span> على طرف <span class="ltr">S</span>، أي ضغط <span class="ltr">S1</span>.`],
        [String.raw`يعمل ويتوقف بالتناوب في كل دورة مسح`,false,String.raw`لا شيء يتغير بين دورة مسح وأخرى ما دامت المداخل ثابتة.`]]},
       ins:[{k:'s1',l:'S1',sw:true,v:0,on:'S1 مضغوط ← <span class="ltr">I1.1 = 1</span>',off:'S1 متروك ← <span class="ltr">I1.1 = 0</span>'},
        {k:'s0',l:'S0',sw:true,v:0,on:'S0 مضغوط ← <span class="ltr">I0.1 = 0</span>',off:'S0 متروك ← <span class="ltr">I0.1 = 1</span>'},
        {k:'f4',l:'F4',sw:true,v:0,on:'F4 فصلت ← <span class="ltr">I0.0 = 0</span>',off:'F4 سليمة ← <span class="ltr">I0.0 = 1</span>'}],
       calc:s=>{P.set('I1.1',s.s1);P.set('I0.1',s.s0?0:1);P.set('I0.0',s.f4?0:1);P.runNet(0);P.runNet(1);
        const m=P.get('M0.0'),k1=P.get('Q4.1'),rs=s.s0||s.f4;
        const msg=s.s1&&rs?String.raw`<span class="ltr">S1</span> وإشارة الإلغاء معاً: في برنامج <span class="ltr">STL</span> يأتي السطر <span class="ltr">R M 0.0</span> بعد <span class="ltr">S M 0.0</span>، فالكلمة الأخيرة للإلغاء ويبقى المحرك متوقفاً.`
         :rs?String.raw`أحد المدخلين <span class="ltr">I0.0</span> أو <span class="ltr">I0.1</span> صار <span class="ltr">0</span>، فوصل <span class="ltr">1</span> إلى طرف <span class="ltr">R</span> وأُلغيت <span class="ltr">M0.0</span> ثم <span class="ltr">K1</span>.`
         :s.s1?String.raw`<span class="ltr">S1</span> مضغوط: ثُبّتت <span class="ltr">M0.0</span>، ومتممات القصر مفصولة، فثُبّت <span class="ltr">K1</span>. الآن اترك <span class="ltr">S1</span> ولاحظ أن الاثنين يبقيان <span class="ltr">1</span>.`
         :m?String.raw`<span class="ltr">S1</span> متروك لكن <span class="ltr">M0.0</span> و <span class="ltr">K1</span> ما زالا <span class="ltr">1</span>: هذه هي «الذاكرة» في دالة التخزين.`
         :String.raw`المحرك متوقف. اضغط <span class="ltr">S1</span> لتبدأ.`;
        return {pic:[0,1].map(i=>`<div class="net static"><header><h3>Network ${i+1}</h3></header><div class="svgbox">${B.ladNetwork(P.nets[i],P,nm).replace("<svg","<svg style=\"min-width:420px\"")}</div></div>`).join(''),
         facts:[['العلامة M0.0',String(m),m?'hi':''],['K1 (Q4.1)',String(k1),k1?'hi':'']],msg,cls:rs?'warn':''}}})}}
   ]},

  {st:3,short:'LAD: المزمنات ومتممات القصر',title:'<span class="ltr">LAD</span> — الشبكات 3 إلى 8: المزمنات ومتممات القصر',ref:'ص 91–92',
   q:'المزمن <span class="ltr">T4</span> يُلغى بـ <span class="ltr">Q4.4</span> «أو» <span class="ltr">M0.0</span>… ومتى تكون <span class="ltr">M0.0 = 1</span>؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المزمن T4 بلغة LAD: صندوق S_ODT؛ S من Q4.1، والزمن S5T#5S، و R من Q4.4 أو M0.0، وخرجه Q5.4" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M26 56V276" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><text x="222.0" y="62" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T4</text><g data-tip="المزمن ⟦T4⟧ من نوع ⟦S_ODT⟧ (تأخير عند التشغيل): يعطي ⟦Q = 1⟧ بعد مرور الزمن ⟦TV⟧ ما دام طرف ⟦S = 1⟧، وإشارة ⟦1⟧ على ⟦R⟧ تلغيه وتصفّر العدّ."><rect x="176" y="70" width="92" height="176" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="222.0" y="92" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S_ODT</text><text x="184" y="126" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><text x="184" y="164" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">TV</text><text x="184" y="224" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="260" y="126" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text><text x="260" y="164" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">BI</text><text x="260" y="194" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">BCD</text></g><path d="M26 122H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="تلامس مفتوح ⟦Q4.1⟧: عندما يعمل ⟦K1⟧ يبدأ المزمن العدّ."><rect x="62" y="98" width="40" height="34" fill="transparent"/><path d="M82 112V132" fill="none" stroke="#12855A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 112V132" fill="none" stroke="#12855A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="107" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text></g><path d="M110 122H176" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="زمن المزمن ⟦TV = S5T#5S⟧: خمس ثوانٍ."><rect x="80" y="148" width="96" height="22" fill="transparent"/><text x="168" y="164" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S5T#5S</text><path d="M170 160H176" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g><path d="M26 220H60" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 220V268" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 220H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 268H82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="تلامس مفتوح ⟦Q4.4⟧: عندما يعمل ⟦K4⟧ يُلغى المزمن ⟦T4⟧."><rect x="62" y="196" width="40" height="34" fill="transparent"/><path d="M82 210V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 210V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="205" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text></g><g data-tip="تلامس مفتوح ⟦M0.0⟧ على طرف الإلغاء كما في الكتاب. انتبه: ⟦M0.0 = 1⟧ طوال التشغيل! (التفصيل في هذه المحطة)."><rect x="62" y="244" width="40" height="34" fill="transparent"/><path d="M82 258V278" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 258V278" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="96" y="253" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text></g><path d="M110 220H132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 268H132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 220V268" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 220H176" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M268 122H300" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الملف ⟦Q5.4⟧: يُكتب فيه خرج المزمن ⟦T4⟧ حتى نرى عمله."><rect x="296" y="100" width="60" height="40" fill="transparent"/><path d="M304 112A10 10 0 0 0 304 132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M324 112A10 10 0 0 1 324 132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="314" y="100" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q5.4</text></g><g data-tip="المخرجان ⟦BI⟧ و ⟦BCD⟧: قيمة الزمن الباقي بصيغتين، وهما غير موصولين في برنامج الكتاب."><rect x="268" y="144" width="60" height="56" fill="transparent"/><text x="282" y="164" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">...</text><text x="282" y="194" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">...</text></g></svg>`,
   cap:'<span class="ltr">Network 3</span> كما في الكتاب: المزمن <span class="ltr">T4</span> من نوع <span class="ltr">S_ODT</span>.<br><b>مرّر المؤشر على أطراف المزمن والتلامسات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'المحرك يعمل، فـ <span class="ltr">M0.0 = 1</span> و <span class="ltr">Q4.4 = 0</span>. ما الذي يصل إلى طرف <span class="ltr">R</span> للمزمن <span class="ltr">T4</span> في رسم الكتاب؟',opts:[
     ['<span class="ltr">1</span>، فيُلغى المزمن ولا يعدّ',true,'تلامس <span class="ltr">M0.0</span> المفتوح يوصّل لأن <span class="ltr">M0.0 = 1</span>، فيبقى الإلغاء فعّالاً طوال التشغيل. هذا خطأ في الكتاب، وتفصيله تحت.'],
     ['<span class="ltr">0</span>، فيعدّ المزمن خمس ثوانٍ',false,'هذا ما كان مقصوداً، لكنه يحتاج تلامساً <b>مغلقاً</b> لـ <span class="ltr">M0.0</span> كما في <span class="ltr">Network 2</span>.'],
     ['لا شيء، لأن طرف <span class="ltr">R</span> غير موصول',false,'طرف <span class="ltr">R</span> موصول بتلامسي <span class="ltr">Q4.4</span> و <span class="ltr">M0.0</span> على التوازي.']]}}
   ],
   body:[
    {book:(()=>{const P=B.createPLC(BOOK4),nm={};IO4.forEach(r=>nm[r.addr]=r.sym);
      return [2,3,4,5,6,7].map(i=>`<div class="net static"><header><h3>Network ${i+1}</h3><span class="ref">ص ${i<4?91:92}</span></header><div class="svgbox fixed">${B.ladNetwork(P.nets[i],P,nm)}</div></div>`).join('')})(),ref:'ص 91–92'},
    {tip:String.raw`<ul><li><b>المزمن <span class="ltr">S_ODT</span></b> (تأخير عند التشغيل): يعطي <span class="ltr">1</span> بعد مرور زمنه <span class="ltr">S5T#5S</span> ما دام طرف <span class="ltr">S = 1</span>. في الرسم هنا هو الملف <span class="ltr">SD</span>.</li>
     <li><b>السلسلة:</b> <span class="ltr">Q4.1</span> يشغّل <span class="ltr">T4</span> ← <span class="ltr">T4</span> يثبّت <span class="ltr">Q4.4</span> ← <span class="ltr">Q4.4</span> يشغّل <span class="ltr">T3</span> ← <span class="ltr">T3</span> يثبّت <span class="ltr">Q4.3</span> ← <span class="ltr">Q4.3</span> يشغّل <span class="ltr">T2</span> ← <span class="ltr">T2</span> يثبّت <span class="ltr">Q4.2</span>.</li>
     <li><b>الإلغاء:</b> كل متمم جديد يلغي المزمن الذي شغّله والمتمم الذي قبله: <span class="ltr">Q4.4</span> يلغي <span class="ltr">T4</span>، و <span class="ltr">Q4.3</span> يلغي <span class="ltr">T3</span> و <span class="ltr">Q4.4</span>، و <span class="ltr">Q4.2</span> يلغي <span class="ltr">T2</span> و <span class="ltr">Q4.3</span>.</li></ul>`,title:'اقرأ الشبكات الست'},
    {watch:String.raw`<p><b>خطأ منطقي يغيّر عمل البرنامج (في اللغات الثلاث، ص 91–96):</b> <span class="ltr">M0.0</span> هي علامة «التشغيل»، تُثبَّت بـ <span class="ltr">S1</span> وتبقى <span class="ltr">1</span> طوال عمل المحرك. في <span class="ltr">Network 2</span> استُخدمت صحيحاً تلامساً <b>مغلقاً</b> لإلغاء <span class="ltr">K1</span> عند الإيقاف. أما في الشبكات 3 إلى 8 فاستُخدمت تلامساً <b>مفتوحاً</b> على أطراف الإلغاء <span class="ltr">R</span>. النتيجة: أثناء التشغيل طرف <span class="ltr">R</span> للمزمن <span class="ltr">T4</span> فعّال دائماً، فلا يعدّ <span class="ltr">T4</span> أبداً، ولا يعمل أي متمم قصر، ويبقى المحرك على كل المقاومات. <b>التصحيح:</b> <span class="ltr">M0.0</span> تلامس مغلق في الشبكات 3 إلى 8. يمكنك التبديل بين «كما في الكتاب» و«المصحح» في المختبر وتبويب البرنامج.</p>`,fix:true},
    {title:'قارن: تلامس M0.0 مفتوح أم مغلق؟',widget:(el,B)=>{
      let ver='book',run=1;
      const draw=()=>{const m=run,q41=run,r=ver==='book'?m:(m?0:1);
        const verdict=run?(r?'طرف <span class="ltr">R</span> = <span class="ltr">1</span> في كل دورة مسح: المزمن <span class="ltr">T4</span> يُلغى باستمرار فلا يعدّ أبداً، ولا يعمل <span class="ltr">K4</span> ولا ما بعده. المحرك يبقى على <span class="ltr">R1 + R2 + R3</span>.':'طرف <span class="ltr">R</span> = <span class="ltr">0</span>: المزمن <span class="ltr">T4</span> يعدّ خمس ثوانٍ ثم يعمل <span class="ltr">K4</span>، ويكمل التسلسل.')
          :(r?'عند الإيقاف <span class="ltr">M0.0 = 0</span>، فالتلامس المغلق يوصّل ويُلغى المزمن — الإلغاء في وقته الصحيح.':'عند الإيقاف <span class="ltr">M0.0 = 0</span>، فالتلامس المفتوح لا يوصّل ولا يأتي الإلغاء من هذا الطريق: الإلغاء يحدث أثناء التشغيل (الوقت الخطأ) ولا يحدث عند الإيقاف.');
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">النسخة:</span><span class="mseg" data-g="v"><button type="button" data-v="book" aria-pressed="${ver==='book'}">كما في الكتاب</button><button type="button" data-v="fixed" aria-pressed="${ver==='fixed'}">المصحح</button></span><span class="w-l">المحرك:</span><span class="mseg" data-g="r"><button type="button" data-r="1" aria-pressed="${run===1}">يعمل</button><button type="button" data-r="0" aria-pressed="${run===0}">أُوقف بـ S0</button></span></div>
         <div class="facts" style="grid-template-columns:repeat(4,minmax(0,1fr))"><div class="fact"><span>العلامة <bdi>M0.0</bdi></span><b class="ltr">${m}</b></div><div class="fact"><span>تلامس <bdi>M0.0</bdi> على <bdi>R</bdi></span><b>${ver==='book'?'مفتوح':'مغلق'}</b></div><div class="fact"><span>طرف <bdi>S (Q4.1)</bdi></span><b class="ltr">${q41}</b></div><div class="fact" style="${r&&run?'outline:2px solid var(--stop)':''}"><span>طرف <bdi>R</bdi> للمزمن <bdi>T4</bdi></span><b class="ltr">${r}</b></div></div>
         <p class="sub">${verdict}</p>`;
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ver=b.dataset.v;draw()});
        el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{run=+b.dataset.r;draw()})};
      draw();
    }},
    {tip:String.raw`<p>في الدائرة السلكية يفصل <span class="ltr">KT4</span> لأن تلامس <span class="ltr">K4</span> المغلق يقطع ملفه. في البرنامج يبقى طرف <span class="ltr">S</span> للمزمن <span class="ltr">T4</span> = <span class="ltr">Q4.1</span> (أي <span class="ltr">1</span>)، ويلغيه <span class="ltr">Q4.4</span> على طرف <span class="ltr">R</span>. وعندما يُلغى <span class="ltr">Q4.4</span> لاحقاً (بعمل <span class="ltr">K3</span>) يزول الإلغاء عن <span class="ltr">T4</span> بينما <span class="ltr">S</span> ما زال <span class="ltr">1</span>، لكن المزمن <span class="ltr">S_ODT</span> لا يبدأ العدّ من جديد إلا بتغيّر <span class="ltr">S</span> من <span class="ltr">0</span> إلى <span class="ltr">1</span>، فلا يعود <span class="ltr">T4</span> للعمل.</p>`,title:'فرق بين الدائرة السلكية والبرنامج'}
   ]},

  {recap:[
   String.raw`جدول المداخل والمخارج (ص 90): <span class="ltr">F4 = I0.0</span>، <span class="ltr">S0 = I0.1</span>، <span class="ltr">S1 = I1.1</span>؛ <span class="ltr">K1</span> إلى <span class="ltr">K4</span> على <span class="ltr">Q4.1</span> إلى <span class="ltr">Q4.4</span>؛ وخرج المزمنات <span class="ltr">T2</span> و <span class="ltr">T3</span> و <span class="ltr">T4</span> في <span class="ltr">Q5.2</span> و <span class="ltr">Q5.3</span> و <span class="ltr">Q5.4</span>.`,
   String.raw`<span class="ltr">S0</span> و <span class="ltr">F4</span> موصولان تلامساً مغلقاً: <span class="ltr">1</span> في الوضع العادي و <span class="ltr">0</span> عند الضغط أو الفصل.`,
   String.raw`<span class="ltr">Network 1</span>: دالة تخزين للعلامة <span class="ltr">M0.0</span>؛ و <span class="ltr">Network 2</span>: يُثبَّت <span class="ltr">K1</span> بـ <span class="ltr">M0.0</span> ومتممات القصر مفصولة، ويُلغى بـ <span class="ltr">M0.0</span> مغلق (ص 91).`,
   String.raw`الشبكات 3 إلى 8: مزمنات <span class="ltr">S_ODT</span> زمن كل منها <span class="ltr">S5T#5S</span>، وكل متمم قصر يشغّل المزمن التالي ويلغيه المتمم الذي بعده (ص 91–92).`,
   String.raw`في الكتاب <span class="ltr">M0.0</span> تلامس مفتوح على أطراف الإلغاء في الشبكات 3 إلى 8، فلا يكتمل التسلسل؛ التصحيح: تلامس مغلق.`]}
],
 theory:[
  {h:'جدول تخصيص المداخل والمخارج',ref:'ص 90',html:'<p>«من الشكل (1-4) نجد أن»:</p>'},
  {draw:'io',caption:'نقاط الدخل والخرج والترميز في الـ PLC',ref:'ص 90'},
  {note:'<b>توضيح:</b> المزمنات في البرنامج هي T2 و T3 و T4 داخل الـ PLC، وخرج كل مزمن يُكتب إلى مخرج (Q5.2 و Q5.3 و Q5.4) حتى نرى عمله على لمبة. والمداخل <b>I0.0 و I0.1</b> موصولة تلامساً مغلقاً (NC): في الوضع العادي تصل 1، وعند الضغط على S0 أو فصل F4 تصبح 0. لذلك في Network 1 يُلغى M0.0 بـ <span class="ltr">ON I 0.0</span> و <span class="ltr">ON I 0.1</span>.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الجدول يسمي F4 «القاطع الحراري المغناطيسي لدائرة التحكم» بينما هو في الشكل (2-4) <b>F5</b>. والمزمنات تسمى في الرسم KT2/KT3/KT4، وفي الجدول «K2T/K3T/K4T» ورمزها T2/T3/T4.'+'</div>'},
  {h:'الفصل الثالث — أولاً: دائرة LAD باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 91–92',html:`<ul><li><b>Network 1</b> «دالة تخزين لمجموعة الفصل والتشغيل»: صندوق SR للعلامة M0.0؛ S ← I1.1، و R ← [I0.0 مغلق ∥ I0.1 مغلق].</li>
   <li><b>Network 2</b> «تشغيل المتمم الرئيسي»: SR للمخرج Q4.1؛ S ← M0.0 و Q4.2 مغلق و Q4.3 مغلق و Q4.4 مغلق، و R ← M0.0 مغلق.</li>
   <li><b>Network 3</b>: مزمن T4 نوع <span class="ltr">S_ODT</span> (تأخير عند التشغيل)؛ S ← Q4.1، <span class="ltr">TV = S5T#5S</span>، R ← [Q4.4 ∥ M0.0]، Q ← Q5.4.</li>
   <li><b>Network 4</b>: SR للمخرج Q4.4؛ S ← T4، R ← [Q4.3 ∥ M0.0].</li>
   <li><b>Network 5</b>: مزمن T3؛ S ← Q4.4، R ← [Q4.3 ∥ M0.0]، Q ← Q5.3.</li>
   <li><b>Network 6</b>: SR للمخرج Q4.3؛ S ← T3، R ← [Q4.2 ∥ M0.0].</li>
   <li><b>Network 7</b>: مزمن T2؛ S ← Q4.3، R ← [Q4.2 ∥ M0.0]، Q ← Q5.2.</li>
   <li><b>Network 8</b>: SR للمخرج Q4.2؛ S ← T2، R ← M0.0.</li></ul>`},
  {note:'<b>توضيح عن الرسم:</b> الكتاب يرسم LAD بصناديق SR وصناديق مزمنات. المحاكي يرسم الشبكات نفسها من برنامج STL: طرف S يظهر كملف <b>S</b> وطرف R كملف <b>R</b>، والمزمن كملف <b>SD</b> (وهو S_ODT نفسه) مع ملف <b>R</b> للإلغاء. المنطق مطابق.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>خطأ منطقي يغيّر عمل البرنامج (ص 91–96 في اللغات الثلاث):</b> M0.0 هي علامة «التشغيل»، تُثبَّت بـ S1 وتبقى 1 طوال عمل المحرك. في Network 2 استُخدمت صحيحاً كتلامس <b>مغلق</b> لإلغاء K1 عند الإيقاف. أما في الشبكات 3–8 فاستُخدمت تلامساً <b>مفتوحاً</b> على أطراف الإلغاء R. النتيجة: أثناء التشغيل طرف R للمزمن T4 فعّال دائماً، فلا يعدّ T4 أبداً، ولا يعمل أي متمم قصر، ويبقى المحرك على كل المقاومات. <b>التصحيح:</b> M0.0 مغلق (ON / AN) في الشبكات 3–8. استخدم المفتاح «كما في الكتاب / المصحح» في المختبر وفي تبويب البرنامج.'+'</div>'},
  {draw:'lad',caption:'Network 1–8 بلغة LAD (النسخة المختارة حالياً، والافتراضية «كما في الكتاب»)',ref:'ص 91–92'},
  {h:'فرق بين الدائرة السلكية والبرنامج',html:`<p>في الدائرة السلكية يفصل KT4 لأن تلامس K4 المغلق يقطع ملفه. في البرنامج يبقى طرف S للمزمن T4 = Q4.1 (أي 1)، ويلغيه Q4.4 على طرف R. وعندما يُلغى Q4.4 لاحقاً (بعمل K3) يزول R عن T4 بينما S ما زال 1، لكن المزمن S_ODT لا يبدأ العدّ من جديد إلا بتغيّر S من 0 إلى 1، فلا يعود T4 للعمل.</p>`}
 ],
 io:IO4,inputs:IN4,
 variants:VAR4('book'),
 power:st=>powerRotor(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4')),powerRef:'الشكل (1-4) ص 88',
 plant:rotorPlant(getK,{timers:true,id:'u4-l3'}),
 plcNote:'S0 (I0.1) و F4 (I0.0) موصولان تلامساً مغلقاً: يصل 1 في الوضع العادي و 0 عند الضغط. لذلك تظهر قيمتهما 1 في الجدول والمحرك متوقف.',
 steps:[
  {t:'نسخة الكتاب أولاً',x:'تأكد أن «نسخة البرنامج» على «كما في الكتاب». لاحظ في جدول المداخل أن I0.0 و I0.1 قيمتهما 1 (NC).'},
  {t:'اضغط S1',x:'تُثبَّت M0.0 ثم يعمل K1 (Q4.1). المحرك يبدأ على كل المقاومات.',done:s=>s.Q('Q4.1')},
  {t:'انتظر… لا شيء يحدث',x:'المزمن T4 لا يعدّ، و K4 لا يعمل مهما انتظرت. افتح تبويب البرنامج وانظر Network 3: طرف R للمزمن فعّال لأن M0.0 = 1. هذا هو خطأ الكتاب.'},
  {t:'بدّل إلى المصحح',x:'اختر «المصحح» من أعلى المختبر. يُعاد تشغيل الـ PLC والمحرك من البداية.',done:s=>s.variant==='fixed'},
  {t:'اضغط S1 مرة أخرى',x:'يعمل K1 ويبدأ T4 العدّ (5 ثوانٍ). شاهد العداد في لوحة المحرك.',done:s=>s.variant==='fixed'&&s.Q('Q4.1')&&(s.T('T4').run||s.Q('Q4.4'))},
  {t:'K4 ثم K3',x:'ينتهي T4 فيُثبَّت Q4.4 (يخرج R3)، ثم ينتهي T3 فيُثبَّت Q4.3 ويُلغى Q4.4.',done:s=>s.Q('Q4.3')&&!s.Q('Q4.4')},
  {t:'K2: التشغيل الكامل',x:'ينتهي T2 فيُثبَّت Q4.2 ويُلغى Q4.3. لاحظ أن Q5.2 و Q5.3 و Q5.4 تومض لحظة قصيرة جداً (دورة مسح واحدة) عند انتهاء كل مزمن، لأن المتمم الذي يعمل يلغي مزمنه فوراً.',done:s=>s.Q('Q4.2')&&!s.Q('Q4.3')},
  {t:'أوقف بـ S0',x:'يصبح I0.1 = 0 فتُلغى M0.0، فيُلغى Q4.1 (Network 2) و Q4.2 (Network 8 المصحح).',done:s=>!s.Q('Q4.1')&&!s.Q('Q4.2')&&!s.btn('S0')}
 ],
 quiz:[
  {q:'ما عنوان المتمم K4 في جدول المداخل والمخارج؟',o:['Q4.1','Q4.4','Q5.4','I0.4'],c:1,e:'K4 = Q4.4 (ص 90)، و Q5.4 هو خرج المزمن T4.'},
  {q:'ما نوع المزمن المستخدم في البرنامج (S_ODT / SD)؟',o:['نبضة','تأخير عند التشغيل','تأخير عند الفصل','عدّاد'],c:1,e:'S_ODT يخرج 1 بعد مرور الزمن ما دام طرف S = 1، وهو المقابل للمزمن السلكي المؤجل الغلق.'},
  {q:'ما زمن كل مزمن في برنامج الكتاب؟',o:['S5T#2S','S5T#5S','S5T#10S','S5T#1M'],c:1,e:'TV = S5T#5S للمزمنات الثلاثة.'},
  {q:'في Network 1، متى تُلغى العلامة M0.0؟',o:['عند الضغط على S1','إذا أصبح I0.0 أو I0.1 = 0','إذا عمل K2','بعد 5 ثوانٍ'],c:1,e:'R ← [I0.0 مغلق ∥ I0.1 مغلق]، والمدخلان موصولان NC فيصبحان 0 عند الضغط على S0 أو فصل F4.'},
  {q:'ما الخطأ في الشبكات 3–8 كما في الكتاب؟',o:['زمن المزمن خطأ','M0.0 مكتوبة تلامساً مفتوحاً على طرف الإلغاء، فالإلغاء فعّال طوال التشغيل','عنوان K1 خطأ','لا يوجد خطأ'],c:1,e:'المقصود M0.0 مغلق (ON / AN) لكي يحدث الإلغاء عند الإيقاف فقط.'},
  {q:'بنسخة الكتاب الحرفية، كيف يعمل المحرك بعد الضغط على S1؟',o:['يكمل التسلسل طبيعياً','يعمل K1 فقط ويبقى على كل المقاومات','لا يعمل K1','يعمل K2 مباشرة'],c:1,e:'T4 يُلغى في كل دورة مسح فلا يعمل K4 ولا ما بعده.'},
  {q:'لماذا في Network 2 تلامسات Q4.2 و Q4.3 و Q4.4 مغلقة على طرف S؟',o:['لإيقاف المحرك','حتى لا يبدأ K1 إذا كان أحد متممات القصر عاملاً','لتشغيل المزمنات','للتعويض الذاتي'],c:1,e:'تقابل تلامسات K2 و K3 و K4 المغلقة في فرع S1 في الدائرة السلكية (شرط بدء).'}
 ]
});

/* =================== Lesson 4.4 =================== */
B.lesson({
 id:'u4-l4',unit:4,order:4,pages:'93–96',
 title:'البرنامج نفسه بلغتي FBD و STL، والمطلوب',
 summary:'الشبكات الثماني بالبوابات المنطقية FBD (ص 93–94) وبقائمة الإجراءات STL حرفياً (ص 95–96)، مع قراءة RLO سطراً سطراً، ثم تنفيذ التمرين واختباره.',
 stations:[
  {intro:true},

  {st:1,short:'FBD',title:'ثانياً: دائرة <span class="ltr">FBD</span> — البرنامج نفسه بالبوابات',ref:'ص 93–94',
   q:'كيف نكتب «تلامس مغلق» في لغة لا توجد فيها تلامسات أصلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 2 بلغة FBD: بوابة & مداخلها M0.0 و Q4.2 و Q4.3 و Q4.4 معكوسة، إلى طرف S لصندوق SR للمخرج Q4.1، و M0.0 معكوسة إلى R" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="البوابة ⟦&⟧ («و»): تخرج ⟦1⟧ فقط إذا كانت كل مداخلها ⟦1⟧."><rect x="96" y="60" width="56" height="110" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="124.0" y="84" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&amp;</text></g><path d="M40 98H96" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="102" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text><path d="M40 118H86" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="122" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.2</text><circle cx="91" cy="118" r="4.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M40 138H86" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="142" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.3</text><circle cx="91" cy="138" r="4.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M40 158H86" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="162" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.4</text><circle cx="91" cy="158" r="4.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><g data-tip="الدائرة الصغيرة على المدخل = عكس (⟦N⟧): المدخل المعكوس يعطي ⟦1⟧ عندما تكون الإشارة ⟦0⟧ — مثل التلامس المغلق في ⟦LAD⟧. هنا: ⟦K2⟧ و ⟦K3⟧ و ⟦K4⟧ مفصولة."><rect x="82" y="110" width="22" height="64" fill="transparent"/></g><g data-tip="دالة التخزين ⟦SR⟧ للمخرج ⟦Q4.1⟧: ⟦1⟧ على ⟦S⟧ يثبّت ⟦K1⟧، و⟦1⟧ على ⟦R⟧ يلغيه."><rect x="206" y="110" width="70" height="110" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="241.0" y="132" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">SR</text><text x="214" y="162" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><text x="214" y="202" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="268" y="162" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q</text></g><text x="241.0" y="102" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><path d="M152 115H180V162H206" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦M0.0⟧ معكوسة على طرف ⟦R⟧: عند الإيقاف تصبح ⟦M0.0 = 0⟧ فيصل ⟦1⟧ إلى ⟦R⟧ ويُلغى ⟦K1⟧."><rect x="30" y="188" width="176" height="30" fill="transparent"/><path d="M40 202H196" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="201" cy="202" r="4.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="36" y="206" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M0.0</text></g><path d="M276 162H300" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الخرج ⟦= Q4.1⟧: المتمم الرئيسي ⟦K1⟧."><rect x="300" y="150" width="46" height="24" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="323" y="167" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text></g><text x="323" y="144" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">=</text><text x="180" y="280" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="600">تشغيل المتمم الرئيسي</text></svg>`,
   cap:'<span class="ltr">Network 2</span> بلغة <span class="ltr">FBD</span> كما في الكتاب.<br><b>مرّر المؤشر على البوابة والدوائر الصغيرة والصندوق (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في <span class="ltr">Network 2</span> مداخل البوابة <span class="ltr">&amp;</span> هي <span class="ltr">M0.0</span> و <span class="ltr">Q4.2 (N)</span> و <span class="ltr">Q4.3 (N)</span> و <span class="ltr">Q4.4 (N)</span>. متى تخرج <span class="ltr">1</span>؟',opts:[
     ['إذا كانت المداخل الأربعة كلها <span class="ltr">1</span>',false,'المداخل الثلاثة الأخيرة معكوسة: تعطي <span class="ltr">1</span> عندما يكون المتمم مفصولاً <span class="ltr">(0)</span>.'],
     ['إذا كان أي مدخل <span class="ltr">1</span>',false,'هذا عمل البوابة <span class="ltr">&gt;=1</span> («أو»)، أما <span class="ltr">&amp;</span> فتحتاج كل مداخلها.'],
     ['إذا كانت <span class="ltr">M0.0 = 1</span> و <span class="ltr">K2</span> و <span class="ltr">K3</span> و <span class="ltr">K4</span> كلها مفصولة',true,'هذا شرط تشغيل <span class="ltr">K1</span> نفسه الذي رأيته في <span class="ltr">LAD</span> وفي الدائرة السلكية.']]}}
   ],
   body:[
    {book:String.raw`<p>ثانياً: دائرة <span class="ltr">(FBD)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات</p>`+(()=>{const P=B.createPLC(BOOK4),nm={};IO4.forEach(r=>nm[r.addr]=r.sym);
      return P.nets.map((n,i)=>`<div class="net static"><header><h3>Network ${i+1}</h3><span class="ref">ص ${i<5?93:94}</span></header><div class="svgbox fixed">${B.fbdNetwork(n,P,nm)}</div></div>`).join('')})(),ref:'ص 93–94'},
    {tip:String.raw`<ul><li>البوابة <b><span class="ltr">&amp;</span></b> = «و»: تخرج <span class="ltr">1</span> إذا كانت كل مداخلها <span class="ltr">1</span> — مثل تلامسات على التوالي.</li>
     <li>البوابة <b><span class="ltr">&gt;=1</span></b> = «أو»: تخرج <span class="ltr">1</span> إذا كان أي مدخل <span class="ltr">1</span> — مثل تلامسات على التوازي.</li>
     <li>الدائرة الصغيرة <b><span class="ltr">(N)</span></b> على المدخل = عكس — مثل التلامس المغلق في <span class="ltr">LAD</span>.</li>
     <li>صناديق <span class="ltr">SR</span> والمزمنات <span class="ltr">S_ODT</span> هي نفسها التي في <span class="ltr">LAD</span>؛ تتغير طريقة رسم الشروط فقط.</li></ul>`,title:'ثلاثة رموز تكفي'},
    {tip:String.raw`<p>في <span class="ltr">Network 1</span>: بوابة <span class="ltr">&gt;=1</span> مدخلاها <span class="ltr">I0.0 (N)</span> و <span class="ltr">I0.1 (N)</span> تذهب إلى طرف <span class="ltr">R</span> للعلامة <span class="ltr">M0.0</span>، و <span class="ltr">I1.1</span> إلى طرف <span class="ltr">S</span>. وفي الشبكات 3 إلى 7: بوابة <span class="ltr">&gt;=1</span> على طرف <span class="ltr">R</span> فيها المتمم التالي «أو» <span class="ltr">M0.0</span>.</p>`,title:'قارن مع LAD'},
    {watch:String.raw`<p>الخطأ نفسه موجود في <span class="ltr">FBD</span>: مدخل <span class="ltr">M0.0</span> في بوابات <span class="ltr">&gt;=1</span> على أطراف <span class="ltr">R</span> (الشبكات 3 إلى 7) وعلى طرف <span class="ltr">R</span> في <span class="ltr">Network 8</span> مكتوب <b>بدون</b> دائرة عكس. الصحيح <span class="ltr">M0.0 (N)</span> كما في طرف <span class="ltr">R</span> للمخرج <span class="ltr">Q4.1</span> في <span class="ltr">Network 2</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: بوابة & في Network 2',widget:(el,B)=>{const P=B.createPLC(FIX4),nm={};IO4.forEach(r=>nm[r.addr]=r.sym);
      return DCML.lab(el,B,{intro:String.raw`هذه <span class="ltr">Network 2</span> بلغة <span class="ltr">FBD</span>. غيّر حالة العلامة <span class="ltr">M0.0</span> ومتممات القصر، وراقب خرج البوابة <span class="ltr">&amp;</span> (طرف <span class="ltr">S</span>) والمتمم <span class="ltr">K1</span>.`,
       predict:{q:String.raw`المحرك متوقف، و <span class="ltr">M0.0 = 1</span>، لكن المتمم <span class="ltr">K3</span> عالق عاملاً (<span class="ltr">Q4.3 = 1</span>). هل يُثبَّت <span class="ltr">K1</span>؟`,opts:[
        [String.raw`نعم، لأن <span class="ltr">M0.0 = 1</span>`,false,String.raw`<span class="ltr">M0.0</span> مدخل واحد فقط من مداخل البوابة <span class="ltr">&amp;</span>، وهي تحتاج كل مداخلها <span class="ltr">1</span>.`],
        [String.raw`لا، لأن مدخل <span class="ltr">Q4.3</span> عليه دائرة عكس فيدخل البوابة <span class="ltr">0</span>`,true,String.raw`الدائرة الصغيرة تعكس <span class="ltr">Q4.3 = 1</span> إلى <span class="ltr">0</span>، فيخرج من <span class="ltr">&amp;</span> صفر ولا يصل شيء إلى طرف <span class="ltr">S</span>: لا تشغيل والمقاومات مقصورة.`],
        [String.raw`نعم، لكن يفصل بعد خمس ثوانٍ`,false,String.raw`لا يوجد مزمن في <span class="ltr">Network 2</span>؛ الشرط إما يتحقق أو لا.`]]},
       ins:[{k:'m',l:'M0.0',sw:true,v:0,on:'<span class="ltr">M0.0 = 1</span> (أمر التشغيل محفوظ)',off:'<span class="ltr">M0.0 = 0</span> (لا أمر تشغيل)'},
        {k:'k2',l:'K2',sw:true,v:0,on:'K2 يعمل ← <span class="ltr">Q4.2 = 1</span>',off:'K2 مفصول ← <span class="ltr">Q4.2 = 0</span>'},
        {k:'k3',l:'K3',sw:true,v:0,on:'K3 يعمل ← <span class="ltr">Q4.3 = 1</span>',off:'K3 مفصول ← <span class="ltr">Q4.3 = 0</span>'},
        {k:'k4',l:'K4',sw:true,v:0,on:'K4 يعمل ← <span class="ltr">Q4.4 = 1</span>',off:'K4 مفصول ← <span class="ltr">Q4.4 = 0</span>'}],
       calc:s=>{P.set('M0.0',s.m);P.set('Q4.2',s.k2);P.set('Q4.3',s.k3);P.set('Q4.4',s.k4);const was=P.get('Q4.1');P.runNet(1);
        const g=s.m&&!s.k2&&!s.k3&&!s.k4?1:0,k1=P.get('Q4.1');
        const msg=!s.m?String.raw`<span class="ltr">M0.0 = 0</span>: دائرة العكس على طرف <span class="ltr">R</span> تعطي <span class="ltr">1</span>، فيُلغى <span class="ltr">K1</span>.`
         :g?String.raw`كل مداخل <span class="ltr">&amp;</span> صارت <span class="ltr">1</span> (المتممات المفصولة تُعكس إلى <span class="ltr">1</span>)، فوصل <span class="ltr">1</span> إلى <span class="ltr">S</span> وثُبّت <span class="ltr">K1</span>.`
         :k1?String.raw`خرج <span class="ltr">&amp;</span> الآن <span class="ltr">0</span>، لكن <span class="ltr">K1</span> ثُبّت قبل ذلك فيبقى يعمل: عمل متممات القصر بعد التشغيل لا يلغيه، تماماً كما في الدائرة السلكية.`
         :String.raw`متمم قصر عامل، فأحد مداخل <span class="ltr">&amp;</span> = <span class="ltr">0</span> ولا يُثبَّت <span class="ltr">K1</span>: لا يبدأ المحرك والمقاومات مقصورة.`;
        return {pic:`<div class="net static"><header><h3>Network 2</h3></header><div class="svgbox">${B.fbdNetwork(P.nets[1],P,nm).replace("<svg","<svg style=\"min-width:420px\"")}</div></div>`,
         facts:[['خرج & (طرف S)',String(g),g?'hi':''],['طرف R (M0.0 معكوسة)',String(s.m?0:1),s.m?'':'bad'],['K1 (Q4.1)',String(k1),k1?'hi':'']],msg,cls:(!g&&!k1&&s.m)?'warn':''}}})}}
   ]},

  {st:2,short:'STL',title:'ثالثاً: دائرة <span class="ltr">STL</span> — البرنامج سطراً سطراً',ref:'ص 95–96',
   q:'في <span class="ltr">STL</span> لا توجد رسوم أصلاً… فكيف نعرف أن المزمن يُلغى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أسطر Network 3 بلغة STL ملونة حسب دورها: شرط بدء المزمن، شرط إلغائه، أسطر لا عمل، كتابة الخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="70" y="22" width="220" height="282" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="44" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network3</text><path d="M84 52H276" fill="none" stroke="#CFC6B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="بدء المزمن: إذا كان ⟦K1⟧ عاملاً ⟦(A Q 4.1)⟧ حمّل الزمن خمس ثوانٍ ⟦(L S5T#5S)⟧ وشغّل ⟦T4⟧ بتأخير عند التشغيل ⟦(SD T 4)⟧."><rect x="80" y="56.0" width="200" height="58.5" fill="transparent"/><rect x="80" y="56.0" width="8" height="55.5" rx="3" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="100" y="70.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">A    Q    4.1</text><text x="100" y="89.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">L    S5T#5S</text><text x="100" y="109.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">SD   T    4</text></g><g data-tip="إلغاء المزمن: قوس فيه ⟦Q4.4⟧ «أو» ⟦M0.0⟧، فإذا كانت نتيجته ⟦1⟧ ألغى السطر ⟦R T 4⟧ المزمن. لاحظ ⟦O M 0.0⟧ (تلامس مفتوح)."><rect x="80" y="114.5" width="200" height="97.5" fill="transparent"/><rect x="80" y="114.5" width="8" height="94.5" rx="3" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="100" y="128.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">A(</text><text x="100" y="148.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">O    Q    4.4</text><text x="100" y="167.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">O    M    0.0</text><text x="100" y="187.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">)</text><text x="100" y="206.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">R    T    4</text></g><g data-tip="⟦NOP 0⟧: «لا عمل» — مكان المخرجين ⟦BI⟧ و ⟦BCD⟧ غير الموصولين."><rect x="80" y="212.0" width="200" height="39.0" fill="transparent"/><rect x="80" y="212.0" width="8" height="36.0" rx="3" fill="#CFC6B4" stroke="#CFC6B4" stroke-width="0"/><text x="100" y="226.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">NOP  0</text><text x="100" y="245.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">NOP  0</text></g><g data-tip="كتابة الخرج: إذا انتهى زمن ⟦T4⟧ ⟦(A T 4)⟧ اكتب ⟦1⟧ في المخرج ⟦Q5.4⟧."><rect x="80" y="251.0" width="200" height="39.0" fill="transparent"/><rect x="80" y="251.0" width="8" height="36.0" rx="3" fill="#4FB3A9" stroke="#4FB3A9" stroke-width="0"/><text x="100" y="265.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">A    T    4</text><text x="100" y="284.5" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr" xml:space="preserve">=    Q    5.4</text></g></svg>`,
   cap:'أسطر <span class="ltr">Network3</span> كما في الكتاب، ملونة حسب دور كل مجموعة.<br><b>مرّر المؤشر على كل مجموعة أسطر (أو المسها في الجوال) لتعرف ماذا تفعل.</b>',
   side:[
    {predict:{q:'المحرك يعمل (<span class="ltr">M0.0 = 1</span>). ما نتيجة السطرين <span class="ltr">O Q 4.4</span> ثم <span class="ltr">O M 0.0</span> داخل القوس، و <span class="ltr">Q4.4 = 0</span>؟',opts:[
     ['<span class="ltr">0</span>',false,'<span class="ltr">O M 0.0</span> تعني «أو <span class="ltr">M0.0</span>»، و <span class="ltr">M0.0 = 1</span>، فالنتيجة <span class="ltr">1</span>.'],
     ['<span class="ltr">1</span>، فيُنفّذ <span class="ltr">R T 4</span> ويُلغى المزمن',true,'يكفي مدخل واحد في «أو». لذلك لا يعدّ <span class="ltr">T4</span> بنسخة الكتاب؛ الصحيح <span class="ltr">ON M 0.0</span>.'],
     ['لا تُحسب لأن القوس يُتجاهل',false,'القوس <span class="ltr">A( … )</span> يُحسب أولاً ثم تُضم نتيجته.']]}}
   ],
   body:[
    {book:String.raw`<p>ثالثاً: دائرة <span class="ltr">(STL)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات</p>`+(()=>{const P=B.createPLC(BOOK4);
      return P.nets.map((n,i)=>`<div class="net static"><header><h3>Network${i+1}</h3><span class="ref">ص ${i<4?95:96}</span></header>${B.stlTable(n,{trace:[],get:()=>0})}</div>`).join('')})(),ref:'ص 95–96'},
    {tip:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>التعليمة</th><th>معناها</th></tr></thead><tbody>
     <tr><td class="ltr">A / AN</td><td>«و» / «و-ليس» مع النتيجة السابقة <span class="ltr">(RLO)</span></td></tr>
     <tr><td class="ltr">O / ON</td><td>«أو» / «أو-ليس»</td></tr>
     <tr><td class="ltr">A( … )</td><td>قوس: يُحسب ما بداخله أولاً</td></tr>
     <tr><td class="ltr">S / R</td><td>تثبيت / إلغاء المخرج أو العلامة إذا كانت <span class="ltr">RLO = 1</span></td></tr>
     <tr><td class="ltr">L S5T#5S</td><td>تحميل زمن المزمن (خمس ثوانٍ)</td></tr>
     <tr><td class="ltr">SD T 4</td><td>تشغيل المزمن <span class="ltr">T4</span> بتأخير عند التشغيل <span class="ltr">(S_ODT)</span></td></tr>
     <tr><td class="ltr">R T 4</td><td>إلغاء المزمن <span class="ltr">T4</span></td></tr>
     <tr><td class="ltr">NOP 0</td><td>لا عمل (مكان المخرجين <span class="ltr">BI</span> و <span class="ltr">BCD</span> غير الموصولين)</td></tr>
     <tr><td class="ltr">= Q 5.4</td><td>اكتب <span class="ltr">RLO</span> في المخرج</td></tr></tbody></table></div>`,title:'معاني التعليمات'},
    {title:'نفّذ Network 3 سطراً سطراً',widget:(el,B)=>{
      let ver='book',k=0;const v={'M0.0':1,'Q4.1':1,'Q4.4':0};
      const why=(op,arg,val)=>{const nm=arg?` <span class="ltr">${arg.replace(/\s+/g,' ')} = ${val}</span>`:'';
        return {'A':'و مع'+nm,'AN':'و-ليس مع'+nm,'O':'أو مع'+nm,'ON':'أو-ليس مع'+nm,'A(':'يفتح قوساً: ما بداخله يُحسب أولاً',')':'يغلق القوس ويضم نتيجته بعملية «و»','L':'يحمّل زمن المزمن: خمس ثوانٍ','SD':'يشغّل المزمن إذا كانت النتيجة 1','R':'يلغي المزمن إذا كانت النتيجة 1','NOP':'لا عمل','=':'يكتب النتيجة في المخرج'}[op]||''};
      const draw=()=>{const prog=(ver==='book'?BOOK4:FIX4)[2];const P=B.createPLC([{stl:prog.stl}]);Object.keys(v).forEach(a=>P.set(a,v[a]));P.scan(0.05);
        const net=P.nets[0],tr=P.trace[0]||[],n=net.toks.length;
        const rows=net.toks.map((t,j)=>{const p=t.raw.split(/\s+/),op=p[0],arg=/^[AO]N?$/.test(op)?p.slice(1).join(''):'',val=arg?P.get(arg):null;const done=j<k,cur=j===k-1,r=tr[j];
          const bad=/M\s+0\.0/.test(t.raw);
          return `<tr style="${cur?'background:var(--blue-soft);font-weight:700':''}${done?'':';opacity:.45'}"><td class="mono" dir="ltr" style="text-align:left;white-space:nowrap${bad?';color:var(--'+(ver==='book'?'stop':'on')+')':''}">${t.raw}</td><td>${done?why(op,arg,val):''}</td><td class="mono" dir="ltr">${done&&r!=null&&!/^(L|NOP)$/.test(op)?'RLO = '+r:''}</td></tr>`}).join('');
        const rIdx=net.toks.findIndex(t=>/^R\s+T/.test(t.raw)),rr=tr[rIdx];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">النسخة:</span><span class="mseg"><button type="button" data-v="book" aria-pressed="${ver==='book'}">كما في الكتاب</button><button type="button" data-v="fixed" aria-pressed="${ver==='fixed'}">المصحح</button></span></div>
         <div class="w-row">${Object.keys(v).map(a=>`<button class="sw" type="button" data-a="${a}" aria-pressed="${!!v[a]}"><span class="knob"></span><b>${a}</b><small>${v[a]}</small></button>`).join('')}</div>
         <div class="tablebox"><table class="tt" style="font-size:13.5px"><thead><tr><th>السطر</th><th>ماذا يفعل</th><th>النتيجة</th></tr></thead><tbody>${rows}</tbody></table></div>
         <div class="w-row"><button class="btn pri" type="button" data-nx ${k>=n?'disabled':''}>نفّذ السطر التالي</button><button class="btn" type="button" data-all>نفّذ الكل</button><button class="btn" type="button" data-rs>من البداية</button></div>
         <p class="sub" style="margin-top:8px">${k>rIdx?`عند السطر <span class="ltr">R T 4</span> النتيجة <span class="ltr">RLO = ${rr}</span>: ${rr?'<b>المزمن يُلغى</b> في هذه الدورة فلا يعدّ.':'لا إلغاء، فالمزمن يعدّ ما دام <span class="ltr">Q4.1 = 1</span>.'}`:`نُفّذ ${k} من ${n} أسطر. <b>RLO</b> = نتيجة الشرط حتى هذا السطر.`} جرّب: <span class="ltr">M0.0 = 1</span> و <span class="ltr">Q4.4 = 0</span> (المحرك في بداية التشغيل) بالنسختين.</p>`;
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ver=b.dataset.v;draw()});
        el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{v[b.dataset.a]^=1;draw()});
        el.querySelector('[data-nx]').onclick=()=>{k=Math.min(n,k+1);draw()};
        el.querySelector('[data-all]').onclick=()=>{k=n;draw()};
        el.querySelector('[data-rs]').onclick=()=>{k=0;draw()}};
      draw();
    }},
    {watch:String.raw`<p>الخطأ نفسه في <span class="ltr">STL</span>: الأسطر <span class="ltr">O M 0.0</span> في الشبكات 3 إلى 7 والسطر <span class="ltr">A M 0.0</span> في <span class="ltr">Network 8</span>. الصحيح <span class="ltr">ON M 0.0</span> و <span class="ltr">AN M 0.0</span> كما في <span class="ltr">Network 2</span>: السطر <span class="ltr">AN M 0.0</span> قبل <span class="ltr">R Q 4.1</span>. الشبكتان 1 و 2 صحيحتان.</p>`,fix:true}
   ]},

  {st:3,short:'المطلوب',title:'المطلوب: من الحاسب إلى الـ <span class="ltr">PLC</span>',ref:'ص 96',
   q:'كتبت البرنامج… كيف تتأكد أنه يعمل كما تعمل الدائرة السلكية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="من الحاسب الآلي إلى وحدة PLC ثم اختبار عمل الدائرة على المحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الحاسب الآلي: عليه يُكتب البرنامج (⟦LAD⟧ أو ⟦FBD⟧ أو ⟦STL⟧)."><rect x="36" y="110" width="92" height="62" rx="6" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><rect x="44" y="118" width="76" height="46" rx="3" fill="#CFE6DB" stroke="#2C4A40" stroke-width="0"/><path d="M28 176H136" fill="none" stroke="#2C4A40" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 128H100" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 137H92" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 146H84" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 155H76" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><text x="82" y="200" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">الحاسب الآلي</text><path d="M140 141H160" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="168,141 158,134 158,148" fill="#E8735A"/><g data-tip="وحدة الـ ⟦PLC⟧: يُنقل إليها البرنامج من الحاسب فتنفّذه."><rect x="172" y="104" width="64" height="76" rx="8" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="204" y="130" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><circle cx="184" cy="164" r="3.5" fill="#F2C14E"/><circle cx="197" cy="164" r="3.5" fill="#F2C14E"/><circle cx="210" cy="164" r="3.5" fill="#F2C14E"/><circle cx="223" cy="164" r="3.5" fill="#F2C14E"/></g><text x="204" y="200" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">وحدة التحكم</text><path d="M242 141H262" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="270,141 260,134 260,148" fill="#E8735A"/><g data-tip="اختبار صحة عمل الدائرة: شغّل وأوقف، وتأكد أن متممات القصر تعمل بالترتيب ⟦K4⟧ ثم ⟦K3⟧ ثم ⟦K2⟧."><circle cx="304" cy="141" r="28" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="304" cy="141" r="22" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="304" y="138" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="304" y="152" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">3~</text></g><text x="304" y="200" text-anchor="middle" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">الاختبار</text><circle cx="326" cy="116" r="11" fill="#12855A"/><path d="M320 116 l4 4 l8 -8" fill="none" stroke="#FBF6EE" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="250" text-anchor="middle" direction="rtl" font-size="14" fill="#2C4A40" font-weight="700">تنفيذ ← نقل ← اختبار</text></svg>`,
   cap:'ثلاث خطوات: التنفيذ على الحاسب، ثم النقل إلى وحدة الـ <span class="ltr">PLC</span>، ثم اختبار صحة عمل الدائرة.<br><b>مرّر المؤشر على الحاسب والوحدة والمحرك (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة <span class="ltr">(PLC)</span> واختبار صحة عمل الدائرة.</p>`,ref:'ص 96'},
    {predict:{q:'نقلت برنامج الكتاب كما هو إلى الـ <span class="ltr">PLC</span> وضغطت <span class="ltr">S1</span>. ماذا تتوقع أن ترى؟',opts:[
     ['يعمل <span class="ltr">K1</span> فقط، ولا يعمل <span class="ltr">K4</span> مهما انتظرت',true,'بسبب <span class="ltr">O M 0.0</span> يُلغى <span class="ltr">T4</span> في كل دورة. لهذا يجب أن يكشف الاختبار الخطأ قبل التشغيل الفعلي.'],
     ['يعمل <span class="ltr">K4</span> ثم <span class="ltr">K3</span> ثم <span class="ltr">K2</span> كل خمس ثوانٍ',false,'هذا يحدث بالنسخة المصححة فقط.'],
     ['لا يعمل أي شيء',false,'<span class="ltr">Network 1</span> و <span class="ltr">Network 2</span> صحيحتان، فيعمل <span class="ltr">K1</span>.']]}}
   ],
   body:[
    {tip:String.raw`<ol><li>اضغط <span class="ltr">S1</span>: يجب أن يعمل <span class="ltr">K1</span> <span class="ltr">(Q4.1)</span> ويبدأ <span class="ltr">T4</span>.</li><li>بعد زمن كل مزمن يجب أن يعمل متمم القصر التالي بالترتيب: <span class="ltr">Q4.4</span> ثم <span class="ltr">Q4.3</span> ثم <span class="ltr">Q4.2</span>، ويفصل الذي قبله.</li><li>في النهاية يبقى <span class="ltr">Q4.1</span> و <span class="ltr">Q4.2</span> فقط.</li><li>اضغط <span class="ltr">S0</span>: يجب أن يفصل كل شيء. وكرر مع فصل <span class="ltr">F4</span>.</li><li>حاول التشغيل ومتمم قصر عامل: يجب ألا يعمل <span class="ltr">K1</span>.</li></ol>`,title:'ماذا تختبر؟'},
    {tip:String.raw`<p>في تبويب «المختبر» نفّذ البرنامج بنسخة الكتاب ثم بالنسخة المصححة، وتابع في تبويب البرنامج (عرض <span class="ltr">STL</span> مع «تشغيل المسح ببطء») قيمة <span class="ltr">RLO</span> عند كل سطر.</p>`,title:'في هذا الموقع'},
    {add:String.raw`<p>في المصانع لا يُشغَّل برنامج جديد على المحرك مباشرة. يُختبر أولاً والمحرك مفصول عن القدرة (تراقب المخارج على لمبات وحدة الـ <span class="ltr">PLC</span>)، ثم يُشغَّل المحرك بعد التأكد من الترتيب. وفي برنامج هذه الوحدة تفيدك المخارج <span class="ltr">Q5.2</span> و <span class="ltr">Q5.3</span> و <span class="ltr">Q5.4</span> في ذلك: ترى عليها عمل المزمنات.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: رتّب خطوات الاختبار',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات تنفيذ المطلوب واختباره بالترتيب الصحيح.',steps:[
     [String.raw`نفّذ البرنامج على جهاز الحاسب الآلي`,String.raw`الكتاب يبدأ بتنفيذ التمرين على الحاسب قبل أي شيء.`],
     [String.raw`انقل البرنامج إلى وحدة الـ <span class="ltr">PLC</span>`,String.raw`لا يمكن اختبار شيء على الجهاز قبل نقل البرنامج إليه.`],
     [String.raw`اضغط <span class="ltr">S1</span>: يعمل <span class="ltr">K1</span> ويبدأ المزمن <span class="ltr">T4</span>`,String.raw`أول اختبار بعد النقل هو التشغيل.`],
     [String.raw`انتظر: يعمل <span class="ltr">K4</span> ثم <span class="ltr">K3</span> ثم <span class="ltr">K2</span>، ويبقى في النهاية <span class="ltr">K1</span> و <span class="ltr">K2</span> فقط`,String.raw`تسلسل متممات القصر يأتي بعد التشغيل بـ <span class="ltr">S1</span>.`],
     [String.raw`اضغط <span class="ltr">S0</span>: يجب أن يفصل كل شيء، ثم كرّر مع فصل <span class="ltr">F4</span>`,String.raw`الإيقاف يُختبر بعد أن ترى التسلسل كاملاً.`]],
     done:String.raw`ولو نقلت برنامج الكتاب كما هو لتوقف الاختبار عند الخطوة الرابعة: يعمل <span class="ltr">K1</span> فقط ولا يعمل <span class="ltr">K4</span>، بسبب تلامس <span class="ltr">M0.0</span> المفتوح على أطراف الإلغاء.`})}
   ]},

  {recap:[
   String.raw`<span class="ltr">FBD</span>: البوابة <span class="ltr">&amp;</span> = «و»، و <span class="ltr">&gt;=1</span> = «أو»، والدائرة الصغيرة <span class="ltr">(N)</span> = عكس، مع صناديق <span class="ltr">SR</span> ومزمنات <span class="ltr">S_ODT</span> نفسها (ص 93–94).`,
   String.raw`<span class="ltr">STL</span>: <span class="ltr">A/AN</span> و <span class="ltr">O/ON</span> والأقواس تبني الشرط <span class="ltr">RLO</span>، و <span class="ltr">S/R</span> تثبّت وتلغي، و <span class="ltr">L S5T#5S</span> ثم <span class="ltr">SD T 4</span> تشغّل المزمن (ص 95–96).`,
   String.raw`الخطأ نفسه في اللغات الثلاث: <span class="ltr">M0.0</span> بدون عكس على أطراف الإلغاء في الشبكات 3 إلى 8؛ الصحيح <span class="ltr">ON M 0.0</span> و <span class="ltr">AN M 0.0</span>.`,
   String.raw`المطلوب (ص 96): تنفيذ التمرين على الحاسب، ثم نقله إلى وحدة الـ <span class="ltr">PLC</span> واختبار صحة عمل الدائرة.`]}
],
 theory:[
  {h:'ثانياً: دائرة FBD باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمزمنات',ref:'ص 93–94',html:`<p>نفس الشبكات بالبوابات: البوابة <b>&amp;</b> = «و»، والبوابة <b>&gt;=1</b> = «أو»، والدائرة الصغيرة (N) على المدخل = عكس. مثلاً Network 1: بوابة &gt;=1 مدخلاها I0.0 (N) و I0.1 (N) تذهب إلى طرف R لصندوق SR «M0.0»، و I1.1 إلى طرف S. وNetwork 2: بوابة &amp; مداخلها M0.0 و Q4.2 (N) و Q4.3 (N) و Q4.4 (N) إلى طرف S لـ «Q4.1»، و M0.0 (N) إلى R.</p>`},
  {draw:'fbd',caption:'Network 1–8 بلغة FBD (النسخة المختارة حالياً)',ref:'ص 93–94'},
  {h:'ثالثاً: دائرة STL',ref:'ص 95–96',html:'<p>البرنامج منقول حرفياً من الكتاب، تعليمة في كل سطر:</p>'},
  {draw:'stl',caption:'Network 1–8 بلغة STL',ref:'ص 95–96'},
  {html:`<table class="tt"><thead><tr><th>التعليمة</th><th>معناها</th></tr></thead><tbody>
   <tr><td class="ltr">A / AN</td><td>«و» / «و-ليس» مع النتيجة السابقة (RLO)</td></tr>
   <tr><td class="ltr">O / ON</td><td>«أو» / «أو-ليس»</td></tr>
   <tr><td class="ltr">A( … )</td><td>قوس: يُحسب ما بداخله أولاً</td></tr>
   <tr><td class="ltr">S / R</td><td>تثبيت / إلغاء المخرج أو العلامة إذا كانت RLO = 1</td></tr>
   <tr><td class="ltr">L S5T#5S</td><td>تحميل زمن المزمن (5 ثوانٍ)</td></tr>
   <tr><td class="ltr">SD T 4</td><td>تشغيل المزمن T4 بتأخير عند التشغيل (S_ODT)</td></tr>
   <tr><td class="ltr">R T 4</td><td>إلغاء المزمن T4</td></tr>
   <tr><td class="ltr">NOP 0</td><td>لا عمل (يكتبها البرنامج مكان المخرجين BI و BCD غير الموصولين)</td></tr>
   <tr><td class="ltr">= Q 5.4</td><td>اكتب RLO في المخرج</td></tr></tbody></table>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الخطأ نفسه في STL: الأسطر <span class="ltr">O M 0.0</span> في الشبكات 3–7 والسطر <span class="ltr">A M 0.0</span> في الشبكة 8. الصحيح <span class="ltr">ON M 0.0</span> و <span class="ltr">AN M 0.0</span> كما في الشبكة 2 (<span class="ltr">AN M 0.0 / R Q 4.1</span>). الشبكتان 1 و 2 صحيحتان.'+'</div>'},
  {h:'المطلوب',ref:'ص 96',html:'<p>«تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة (PLC) واختبار صحة عمل الدائرة.»</p><p>في المختبر: نفّذ البرنامج بنسخة الكتاب ثم بالمصححة، وتابع في تبويب البرنامج (عرض STL مع «تشغيل المسح ببطء») قيمة RLO عند كل سطر.</p>'}
 ],
 io:IO4,inputs:IN4,
 variants:VAR4('book'),
 power:st=>powerRotor(st.Q('Q4.1'),st.Q('Q4.2'),st.Q('Q4.3'),st.Q('Q4.4')),powerRef:'الشكل (1-4) ص 88',
 plant:rotorPlant(getK,{timers:true,id:'u4-l4'}),
 plcNote:'اختر عرض STL وفعّل «تشغيل المسح ببطء»: في نسخة الكتاب ستجد في Network 3 أن RLO عند السطر <span class="ltr">R T 4</span> = 1 أثناء التشغيل.',
 steps:[
  {t:'جهّز العرض',x:'افتح تبويب «برنامج الـ PLC» في نافذة أخرى أو تنقّل بين التبويبين. اختر STL. الأزرار نفسها في الشريط العلوي.'},
  {t:'شغّل نسخة الكتاب',x:'اضغط S1. في Network 1 يصبح RLO عند <span class="ltr">S M 0.0</span> = 1، ثم في Network 2 يُثبَّت Q4.1.',done:s=>s.Q('Q4.1')&&s.variant!=='fixed'},
  {t:'اقرأ Network 3',x:'السطر <span class="ltr">O M 0.0</span> يعطي RLO = 1، فالسطر <span class="ltr">R T 4</span> يلغي المزمن في كل دورة. لهذا لا يتقدم التسلسل.'},
  {t:'بدّل إلى المصحح',x:'اختر «المصحح»: صار السطر <span class="ltr">ON M 0.0</span>.',done:s=>s.variant==='fixed'},
  {t:'شغّل وتابع RLO',x:'اضغط S1. الآن RLO عند <span class="ltr">R T 4</span> = 0 والمزمن يعدّ.',done:s=>s.variant==='fixed'&&s.Q('Q4.4')},
  {t:'أكمل التسلسل',x:'انتظر حتى يعمل K2 (Q4.2). في FBD لاحظ بوابات &gt;=1 على أطراف R.',done:s=>s.Q('Q4.2')},
  {t:'اختبر الحماية',x:'اضغط «فصل F4»: يصبح I0.0 = 0، فـ <span class="ltr">ON I 0.0</span> يعطي 1 وتُلغى M0.0 وكل شيء.',done:s=>s.btn('F4')&&!s.Q('Q4.1')}
 ],
 quiz:[
  {q:'ماذا تعني البوابة &gt;=1 في FBD؟',o:['و (AND)','أو (OR)','عكس (NOT)','مزمن'],c:1,e:'تخرج 1 إذا كان أي مدخل = 1.'},
  {q:'ماذا تعني (N) أو الدائرة الصغيرة على مدخل البوابة؟',o:['مدخل معكوس','مدخل مزمن','مخرج','عداد'],c:0,e:'مثل التلامس المغلق في LAD و AN / ON في STL.'},
  {q:'أي تعليمة STL تشغّل المزمن T4 بتأخير عند التشغيل؟',o:['SP T 4','SD T 4','SF T 4','R T 4'],c:1,e:'SD = S_ODT. ويسبقها <span class="ltr">L S5T#5S</span> لتحميل الزمن.'},
  {q:'ما معنى السطر NOP 0 في STL الكتاب؟',o:['يوقف البرنامج','لا عمل؛ مكان مخرجي المزمن BI و BCD غير الموصولين','يلغي المزمن','يثبت المخرج'],c:1,e:'NOP = No Operation.'},
  {q:'ما التصحيح المطلوب في السطر الأخير من Network 8 قبل R Q 4.2؟',o:['A M 0.0 ← AN M 0.0','A T 2 ← AN T 2','S Q 4.2 ← R Q 4.2','لا تصحيح'],c:0,e:'حتى يُلغى K2 عند الإيقاف فقط (عندما تصبح M0.0 = 0).'},
  {q:'في Network 1: A( ON I 0.0  ON I 0.1 ) R M 0.0. متى يكون RLO = 1 عند R؟',o:['إذا كان I0.0 = 1 و I0.1 = 1','إذا كان أحدهما = 0','دائماً','إذا ضُغط S1'],c:1,e:'ON = أو-ليس: يكفي أن يكون أحد المدخلين 0 (ضغط S0 أو فصل F4).'},
  QUIZ_COMMON.final
 ]
});
})(PLCBOOK);
