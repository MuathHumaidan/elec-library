/* «المنضدة الافتراضية» — تجارب آلات التيار المستمر (الكهرباء والخطوات والأخطاء؛ الشكل في bench-layout.js)
   التجربة الأولى (الدرس 1.2): اختبار اللاحمل للمولد منفصل التغذية — ص 10–13.
   نموذج المولد وقيم المدرب نفسها التي في تبويب «المختبر» (B.DCM من lessons/u1.js).
   المحرك المُدير: محرك توازي منتجه ومجاله على مصدر الجهد نفسه كما في الشكل (1)؛ تشبع مجاله يجعل سرعته تتبع الجهد.
   قيم توضيحية من خارج الكتاب: حد تيار المصدرين (10 A و6 A)، مقاومة المصدر الداخلية 0.5 Ω، مقاومة الأميتر 0.05 Ω،
   ركبة مغنطة مجال المحرك 0.03 A وفيضه المتبقي 3%، حد السرعة 2000 rpm، حد تيار مجال المولد 0.35 A، سماح التسجيل ±0.005 A و±10 rpm. */
(function(B){
const D=B.DCM;if(!D||!B.BENCH)return;
const L=B.LESSONS.find(l=>l.id==='u1-l2');if(!L)return;
const LAYOUT=()=>(window.BENCH_LAYOUTS||{})['dc-generic'];

const PHIR=0.03,RINT=0.5,RAMM=0.05,RVM=1e6,FKM=0.03,NMAX=2000,IFMAX=0.35,TOL_I=0.005,TOL_N=10;
const T11=D.T11COLS,T12=D.T12COLS;

function exp(){
 return {
  figure:()=>D.box(D.benchSVG({kind:'nl',rd:false}),900,1),figureTitle:'مخطط التوصيل — الشكل (1) ص 10',
  swKnob:{S1:'V1',S2:'V2'},
  init:()=>({n:0,ever1:false,reached:false}),
  mistakes:{
   'no-field':{t:'شغّلت المحرك ومجاله غير موصّل',why:'محرك التيار المستمر بلا مجال تقريباً ترتفع سرعته بلا حد (الجموح) وقد يتحطم. يوصّل المجال قبل المنتج، ولا يُفصل أثناء التشغيل. فصلت الحماية المصدر.',fatal:true,off:['S1']},
   'overspeed':{t:'السرعة تجاوزت الحد الآمن',why:'السرعة ارتفعت فوق '+NMAX+' rpm. غالباً مجال المحرك ضعيف أو موصّل خطأ. فصلت الحماية المصدر.',fatal:true,off:['S1']},
   'short-1':{t:'قصر على مصدر الجهد',why:'طرفا المصدر متصلان بلا حمل تقريباً، فدخل المصدر حد التيار. في المعمل يسخن السلك وتفصل الحماية. افصل وافحص التوصيل.',fatal:true,off:['S1']},
   'short-2':{t:'قصر على مصدر التيار',why:'طرفا المصدر متصلان بلا حمل تقريباً (مثلاً أميتر وحده بين الطرفين). افصل وافحص التوصيل.',fatal:true,off:['S2']},
   'amm-fuse':{t:'احترق مصهر الأميتر: الأميتر على التوازي',why:'الأميتر مقاومته صغيرة جداً، فإذا وُصّل على التوازي مع مصدر أو مع حمل صار قصراً ومر فيه تيار كبير. الأميتر يوصل دائماً على التوالي مع الحمل.',fatal:true},
   'if-over':{t:'تيار مجال المولد أكبر من المطلوب',why:'أكبر تيار مجال في الجدولين 0.3 A. الزيادة الكبيرة تسخّن ملف المجال. أنزل مصدر التيار.'},
   'stop-not-zero':{t:'أطفأت المصدر والمحرك يدور على جهد مرتفع',why:'خطوة الكتاب: «أعد جهد المصدر إلى الصفر حتى يتوقف المحرك»، ثم أطفئ المصدر. الفصل المفاجئ تحت الحمل يسبب شرارة وصدمة للآلة.'},
   'reverse-rot':{t:'المحرك يدور في الاتجاه المعكوس',why:'أطراف المنتج أو المجال معكوسة عن الشكل (1)، فانعكست السرعة والجهد المتولد. افصل المصدر وصحح التوصيل كما في الشكل.'}
  },
  onSwitchOff(id,api){if(id==='S1'&&api.knob('V1')>5&&Math.abs(api.S.phys.n)>50)api.mistake('stop-not-zero')},
  steps:[
   {t:'وصّل التجربة كما في الشكل (1): منتج المحرك ومجاله على مصدر الجهد، ومجال المولد على مصدر التيار عبر الأميتر، والفولتميتر على طرفي منتج المولد.',done:a=>wiringOK(a)},
   {t:'تأكد أن مقبض مصدر الجهد على الصفر ثم شغّل المصدر.',done:a=>a.S.phys.ever1},
   {t:'ارفع جهد المصدر تدريجياً حتى تصل السرعة إلى <span class="ltr">1000 rpm</span>.',done:a=>a.S.phys.reached},
   {t:'شغّل مصدر التيار وغيّر تيار المجال حسب جدول (1-1)، وسجّل <span class="ltr">E₀</span> عند كل قيمة.',done:a=>full(a,'t1')},
   {t:'ارفع تيار المجال إلى <span class="ltr">0.3 A</span>، ثم غيّر جهد مصدر الجهد للسرعات في جدول (1-2) وسجّل <span class="ltr">E₀</span>.',done:a=>full(a,'t2')},
   {t:'أعد المصدرين إلى الصفر، ثم أطفئهما.',done:a=>full(a,'t1')&&full(a,'t2')&&!a.sw('S1')&&!a.sw('S2')&&a.knob('V1')<1&&a.knob('V2')<1}],
  complete:a=>full(a,'t1')&&full(a,'t2')&&!a.sw('S1')&&!a.sw('S2')&&a.knob('V1')<1&&a.knob('V2')<1,
  tables:[
   {id:'t1',title:'جدول (1-1) — n = 1000 rpm',xh:'I<sub>f</sub> (A)',yh:'E<sub>0</sub> (V)',cols:T11,dp:1,xu:'If (A)',yu:'E0 (V)',xdp:2},
   {id:'t2',title:'جدول (1-2) — If = 0.3 A',xh:'n (rpm)',yh:'E<sub>0</sub> (V)',cols:T12,dp:1,xu:'n (rpm)',yu:'E0 (V)'}],
  record(a){const R=a.S.phys.last||{};
   if(R.V==null||!vmOK(a))return {msg:'الفولتميتر لا يقيس جهد طرفي منتج المولد: وصّله بين 1B1 (+) و2B2 (−) للمولد.'};
   if(R.A==null||!ammOK(a))return {msg:'الأميتر ليس على التوالي مع مجال المولد، فلا تُعرف قيمة تيار المجال.'};
   if(Math.abs(R.V)>a.range('V')*1.03)return {msg:'قراءة الفولتميتر خارج المدى المختار.'};
   if(Math.abs(R.A)>a.range('A')*1.03)return {msg:'قراءة الأميتر خارج المدى المختار.'};
   const n=a.S.phys.n,If=R.A,E=R.V;
   if(Math.abs(n-1000)<=TOL_N){const i=T11.findIndex(c=>Math.abs(If-c)<=TOL_I);
     if(i>=0)return {ok:true,table:'t1',col:i,val:E,msg:'سجّلت E₀ = '+a.fmt(E,1)+' V عند If = '+T11[i]+' A و n ≈ 1000 rpm.'}}
   if(Math.abs(If-0.3)<=TOL_I){const j=T12.findIndex(c=>Math.abs(n-c)<=TOL_N);
     if(j>=0)return {ok:true,table:'t2',col:j,val:E,msg:'سجّلت E₀ = '+a.fmt(E,1)+' V عند n = '+T12[j]+' rpm و If = 0.3 A.'}}
   if(Math.abs(n-1000)<=TOL_N)return {msg:'السرعة 1000 rpm صحيحة، لكن اضبط تيار المجال على قيمة من جدول (1-1): '+T11.join('، ')+' A (السماح ±0.005 A).'};
   return {msg:'للجدول (1-1) اضبط السرعة على 1000 rpm (±10). وللجدول (1-2) اضبط تيار المجال على 0.3 A ثم السرعة على إحدى قيمه: '+T12.join('، ')+' rpm.'}},
  tick(a){const v=a.P(),M=D.mach(v),Rsh=v.Rsh||D.MD.Rsh.value,Ra=v.Ra!=null?v.Ra:D.MD.Ra.value,Ram=v.Ram,ph=a.S.phys;
   const kE=D.kEof(v),Fn=220/Rsh,phiOf=F=>Math.sign(F)*PHIR+(1-PHIR)*F*(FKM+Fn)/(Fn*(FKM+Math.abs(F)));
   /* العناصر: كل عنصر بين p و n؛ المصدر بمكافئ نورتن */
   const src=(id,p,n,on,V,lim)=>({id,p,n,g:on?1/RINT:1e-9,i:on?V/RINT:0,on,lim});
   let s1=src('S1','P1+','P1-',a.sw('S1'),a.knob('V1'),10),s2=src('S2','P2+','P2-',a.sw('S2'),a.knob('V2'),6);
   const mf={p:'M.E1',n:'M.E2',g:1/Rsh},gf={p:'G.E1',n:'G.E2',g:1/Rsh},am={p:'A+',n:'A-',g:1/RAMM},vm={p:'V+',n:'V-',g:1/RVM};
   const phi0=ph.phi||0,Eb=kE*phi0*ph.n,Eg=ph.Eg||0;
   const ma={p:'M.1B1',n:'M.2B2',g:1/Ram,i:Eb/Ram},ga={p:'G.1B1',n:'G.2B2',g:1/Ra,i:Eg/Ra};
   let r,cc={};
   for(let it=0;it<3;it++){const S=[s1,s2].map(x=>cc[x.id]?{p:x.p,n:x.n,g:1e-7,i:cc[x.id]}:x);
     r=a.solve([...S,mf,gf,am,vm,ma,ga]);let again=false;
     [s1,s2].forEach(x=>{if(!x.on||cc[x.id])return;const Iout=-r.cur(x);if(Math.abs(Iout)>x.lim){cc[x.id]=Math.sign(Iout)*x.lim;again=true}});if(!again)break}
   const Ifm=r.cur(mf),Ifg=r.cur(gf),Im=r.cur(ma),Iga=-r.cur(ga),Iam=r.cur(am),Vm=r.vt('V+')-r.vt('V-'),Vam=r.vt('M.1B1')-r.vt('M.2B2');
   /* المحرك المُدير */
   const phi=Math.abs(Ifm)<1e-4?PHIR:phiOf(Ifm);ph.phi=phi;
   /* ميكانيكا العمود: التسارع ∝ (العزم الكهربائي − الاحتكاك − حمل المولد)، بوحدة «أمبير عند الفيض المقنن»؛
      ثابت التناسب يجعل ثابت زمن التسارع tau من قيم المدرب */
   const K=Ram/(kE*Math.max(v.tau,0.05)),na=Math.abs(ph.n),sg=Math.sign(ph.n);
   const fr=v.I0*Math.min(1,na/30)*sg,Tg=(Eg*Iga)/(kE*Math.max(na,30))*sg;
   ph.n+=K*(phi*Im-fr-Tg)*a.dt;if(na<1&&Math.abs(phi*Im)<v.I0)ph.n=0;
   ph.Eg=M.E(Ifg,ph.n);
   /* الحالة والأخطاء */
   if(a.sw('S1'))ph.ever1=true;
   if(Math.abs(ph.n-1000)<=TOL_N)ph.reached=true;
   if(a.hold('nf',a.sw('S1')&&Math.abs(Vam)>15&&Math.abs(phi)<0.2,0.4)){ph.n=Math.min(Math.abs(ph.n),NMAX)*Math.sign(ph.n||1);a.mistake('no-field')}
   else if(a.hold('os',Math.abs(ph.n)>NMAX,0.2)){a.mistake('overspeed')}
   if(a.hold('am',Math.abs(Iam)>7.5,0.1))a.mistake('amm-fuse');
   [[s1,'short-1'],[s2,'short-2']].forEach(([x,id])=>{if(a.hold(id,!!cc[x.id]&&Math.abs(r.vt(x.p)-r.vt(x.n))<Math.max(2,0.03*a.knob(x.id==='S1'?'V1':'V2')),0.3))a.mistake(id)});
   if(a.hold('ifo',Math.abs(Ifg)>IFMAX,1))a.once('if-over');else if(Math.abs(Ifg)<0.32)a.rearm('if-over');
   if(a.hold('rr',ph.n<-50,0.6))a.once('reverse-rot');
   const vOn=vmConn(a),aOn=ammConn(a);
   ph.last={V:vOn?Vm:null,A:aOn?Iam:null};
   return {V:vOn?Vm:null,A:aOn?Iam:null,N:ph.n};
  }};
}
/* هل الجهاز موصّل أصلاً (طرفاه في دائرة)؟ وهل التوصيل كما في الشكل؟ */
const vmConn=a=>a.nets().of['V+']!==a.nets().of['V-']&&linked(a,'V+')&&linked(a,'V-');
const ammConn=a=>linked(a,'A+')&&linked(a,'A-');
function linked(a,t){return a.S.wires.some(w=>w.a===t||w.b===t)}
const vmOK=a=>a.conn('V+','G.1B1')&&a.conn('V-','G.2B2');
const ammOK=a=>(a.conn('P2+','A+')&&a.conn('A-','G.E1')&&a.conn('G.E2','P2-'))||(a.conn('P2+','G.E1')&&a.conn('G.E2','A+')&&a.conn('A-','P2-'));
function wiringOK(a){const c=a.conn;return c('M.1B1','P1+')&&c('M.2B2','P1-')&&c('M.E1','P1+')&&c('M.E2','P1-')&&ammOK(a)&&vmOK(a)&&!c('P1+','P1-')&&!c('P2+','P2-')&&!c('A+','A-')}
const full=(a,t)=>{const T=a.S.rec[t]||{};return (t==='t1'?T11:T12).every((_,i)=>T[i]!=null)};

L.bench=(el)=>{const ly=LAYOUT();if(!ly){el.innerHTML='<p>تعذّر تحميل شكل المنضدة.</p>';return}
  const tpHost=document.createElement('div');
  const P=B.params(tpHost,D.TPID,D.tpDefs(['nref','Er','E03','Fk','Rsh','n0','Ram','I0','tau']),()=>{});
  B.BENCH.mount(el,{key:'u1-l2',title:'المنضدة الافتراضية: اختبار اللاحمل للمولد منفصل التغذية',layout:ly,exp:exp(),params:P,
   intro:'وصّل التجربة بنفسك كما في الشكل (1)، وشغّلها بترتيب خطوات الكتاب، وسجّل الجدولين. أي خطأ يكشفه المحاكي ويشرح ما كان سيحدث في المعمل. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.'});
  const det=document.createElement('details');det.className='panel bn-tp';det.innerHTML='<summary>قيم المدرب (نفس قيم تبويب المختبر)</summary>';det.appendChild(tpHost);el.querySelector('.bench').appendChild(det)};
})(PLCBOOK);
