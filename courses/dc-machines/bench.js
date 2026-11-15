/* «المنضدة الافتراضية» — تجارب آلات التيار المستمر والمحولات (الكهرباء والخطوات والجداول والأخطاء).
   الشكل في bench-layout.js. النماذج وقيم المدرب نفسها التي في تبويب «المختبر» لكل درس (B.DCM و B.DCM2 و B.DCM3).
   قيم توضيحية من خارج الكتاب (مسجلة في تقرير المقرر): حدود تيار المصادر، المقاومات الداخلية للمصادر والأجهزة، مدى الأجهزة،
   نموذج المحرك المُدير (ركبة 0.03 A وفيض متبقٍّ 3%)، حد السرعة، حدود الأخطاء، سماح التسجيل. */
(function(B){
const D=B.DCM,D2=B.DCM2,D3=B.DCM3;if(!B.BENCH||!D)return;
const C=B.BENCH.C,abs=Math.abs,sgn=x=>x<0?-1:1,SQ3=Math.sqrt(3);
const LAY=()=>window.BENCH_LAYOUTS;
const figOf=L=>()=>{const b=(L.theory||[]).find(x=>x.fig&&x.draw);return b?b.draw():''};
const figTitleOf=L=>{const b=(L.theory||[]).find(x=>x.fig&&x.draw);return b?'مخطط التوصيل — الشكل '+b.fig+(b.ref?' '+b.ref:''):'مخطط التوصيل'};
const wired=(a,t)=>a.S.wires.some(w=>w.a===t||w.b===t);
const pair=(a,p,n)=>wired(a,p)&&wired(a,n)&&a.nets().of[p]!==a.nets().of[n];
const near=(x,y,tol)=>abs(x-y)<=tol;
const RINT=0.5,RAMM=0.05,RVM=1e6,TOL_N=10;

/* ===================== أخطاء مشتركة ===================== */
const MZ={
 'no-field':{t:'شغّلت المحرك ومجاله غير موصّل',why:'محرك التيار المستمر بلا مجال تقريباً ترتفع سرعته بلا حد (الجموح) وقد يتحطم. المجال يوصل ويُغذّى قبل المنتج، ولا يُفصل أثناء التشغيل. فصلت الحماية المصدر.',fatal:true,off:['S1']},
 'overspeed':{t:'السرعة تجاوزت الحد الآمن',why:'السرعة ارتفعت فوق الحد الآمن. غالباً المجال ضعيف أو موصّل خطأ، أو محرك توالٍ بلا حمل. فصلت الحماية المصدر.',fatal:true,off:['S1']},
 'short-1':{t:'قصر على مصدر الجهد',why:'طرفا المصدر متصلان بلا حمل تقريباً، فدخل المصدر حد التيار. في المعمل يسخن السلك وتفصل الحماية. افصل وافحص التوصيل.',fatal:true,off:['S1']},
 'short-2':{t:'قصر على مصدر التيار',why:'طرفا المصدر متصلان بلا حمل تقريباً (مثلاً أميتر وحده بين الطرفين). افصل وافحص التوصيل.',fatal:true,off:['S2']},
 'amm-fuse':{t:'احترق مصهر الأميتر: الأميتر على التوازي',why:'الأميتر مقاومته صغيرة جداً، فإذا وُصّل على التوازي مع مصدر أو مع حمل صار قصراً ومر فيه تيار كبير. الأميتر يوصل دائماً على التوالي مع الحمل.',fatal:true},
 'if-over':{t:'تيار المجال أكبر من المطلوب',why:'أكبر تيار مجال في الجداول 0.3 A. الزيادة الكبيرة تسخّن ملف المجال. أنزل مصدر التيار.'},
 'stop-not-zero':{t:'أطفأت المصدر والمحرك يدور على جهد مرتفع',why:'أعد جهد المصدر إلى الصفر حتى يتوقف المحرك، ثم أطفئ المصدر. الفصل المفاجئ تحت الحمل يسبب شرارة وصدمة للآلة.'},
 'reverse-rot':{t:'المحرك يدور في الاتجاه المعكوس',why:'أطراف المنتج أو المجال معكوسة عن مخطط التوصيل، فانعكست السرعة. افصل المصدر وصحح التوصيل كما في المخطط.'},
 'start-current':{t:'تيار بدء كبير جداً',why:'عند بدء الحركة تكون القوة الدافعة العكسية صفراً، فيكون تيار المنتج = الجهد ÷ مقاومة المنتج. ابدأ من جهد صغير (أو بمقاومة البدء على أكبر قيمة) وارفع تدريجياً.'},
 'field-first':{t:'شغّلت مصدر المنتج قبل مصدر المجال',why:'في المحرك منفصل التغذية يُغذّى المجال أولاً ثم المنتج، وعند الإيقاف يُفصل المنتج أولاً. المنتج بلا مجال يسحب تياراً كبيراً أو يجمح.'},
 'series-noload':{t:'شغّلت محرك التوالي بلا حمل',why:'محرك التوالي يُحمَّل قبل التشغيل ولا يُترك بلا حمل: سرعته ترتفع بلا حد كلما قل الحمل (الكتاب: «التأكد من تحميله عند التشغيل»). اضبط الفرملة على عزم قبل رفع الجهد.'},
 'tr-overcurrent':{t:'فصل القاطع: تيار كبير في المحول',why:'تيار الابتدائي تجاوز حد القاطع. في اختبار القصر يبدأ الجهد من الصفر ويرفع تدريجياً وبحذر، والملف الثانوي المقصور لا يوصل على الجهد المقنن. افحص التوصيل.',fatal:true,off:['SA','S3']},
 'par-reverse':{t:'أغلقت S1 والقطبية معكوسة',why:'إذا كان جهد طرفي S1 مساوياً لمجموع جهدي الثانويين فالقطبية معكوسة، وغلق S1 عندها يقصر الثانويين على بعضهما بتيار دائر هائل. يُقاس الجهد بين طرفي S1 أولاً، ولا يُغلق إلا إذا كان صفراً تقريباً.',fatal:true,off:['SA']},
 'tr-overvolt':{t:'جهد الملف أكبر من المقنن',why:'ملف المحول أخذ جهداً أكبر من جهده المقنن، فيتشبع القلب ويقفز تيار اللاحمل ويسخن المحول. في المحول الثلاثي يحدث هذا إذا كان أحد ملفات الدلتا معكوساً: تنزاح نقطة النجمة فيأخذ ملف أكثر من جهده. أنزل الجهد، وافحص أطراف الدلتا (الجهد داخل الدلتا المفتوحة قبل قفلها يجب أن يكون صفراً).'},
 'delta-open':{t:'تيار دائر في دلتا الثانوي',why:'أحد ملفات الدلتا معكوس، فمجموع الجهود داخل الدلتا ليس صفراً ويمر تيار دائر كبير. افصل المصدر وافحص أطراف الدلتا.',fatal:true,off:['S3']},
 'range-not-max':{t:'شغّلت الدائرة والأميتر ليس على أعلى تدريج',why:'قيمة التيار غير معروفة، فيبدأ تدريج الأميتر من أعلى قيمة ثم يُنزل إلى المناسب (ص 5).'}
};
/* فحص «الجهاز يقيس الكمية الصحيحة»: القراءة تطابق الكمية المحسوبة من الدائرة */
const same=(x,y)=>x!=null&&y!=null&&abs(x-y)<=Math.max(0.02*abs(y),0.003);

/* ===================== عائلة المولدات (التجارب 1–4) ===================== */
function genFamily(o){/* o:{sep,shunt,compound,load:'rl'|'lamps'|null} */
 const PHIR=0.03,FKM=0.03,NMAX=2000,IFMAX=0.35;
 return {
  init:()=>({n:0,F:0,phi:0,Eg:0,Iga:0,ever1:false}),
  tick(a){const v=a.P(),M=D.mach(v),ph=a.S.phys,Rsh=v.Rsh,Ram=v.Ram,Ra=v.Ra;
   const kE=D.kEof(v),Fn=220/Rsh,phiOf=F=>Math.sign(F)*PHIR+(1-PHIR)*F*(FKM+Fn)/(Fn*(FKM+abs(F)));
   const src=(id,p,n,on,V,lim)=>({id,p,n,g:on?1/RINT:1e-9,i:on?V/RINT:0,on,lim});
   const S1=src('S1','P1+','P1-',a.sw('S1'),a.knob('V1'),10),S2=a.has('V2')?src('S2','P2+','P2-',a.sw('S2'),a.knob('V2'),6):null;
   const Eb=kE*(ph.phi||0)*ph.n;
   const el={mf:{p:'M.E1',n:'M.E2',g:1/Rsh},ma:{p:'M.1B1',n:'M.2B2',g:1/Ram,i:Eb/Ram},
     gf:{p:'G.E1',n:'G.E2',g:1/Rsh},ga:{p:'G.1B1',n:'G.2B2',g:1/Math.max(Ra,0.01),i:(ph.Eg||0)/Math.max(Ra,0.01)}};
   if(a.has('G.D1'))el.gs={p:'G.D1',n:'G.D2',g:1/Math.max(v.Rse,0.01)};
   ['V','V2x'].forEach(k=>{if(a.has(k+'+'))el['vm'+k]={p:k+'+',n:k+'-',g:1/RVM}});
   ['A','A2'].forEach(k=>{if(a.has(k+'+'))el['am'+k]={p:k+'+',n:k+'-',g:1/RAMM}});
   if(a.has('RL'))el.rl={p:'L1',n:'L2',g:a.sw('SL')?1/Math.max(v.RLmax*a.knob('RL')/100,0.5):1e-9};
   if(a.has('NL'))el.rl={p:'L1',n:'L2',g:a.sw('SL')&&a.knob('NL')>0?a.knob('NL')/v.Rlamp:1e-9};
   ['Rst','Rfm','Rfg'].forEach(k=>{if(a.has(k))el[k]={p:k+'.a',n:k+'.b',g:1/Math.max(a.knob(k),0.05)}});
   const els=Object.values(el),srcs=[S1,S2].filter(Boolean);let r,cc={};
   for(let it=0;it<3;it++){const SS=srcs.map(x=>cc[x.id]?{p:x.p,n:x.n,g:1e-7,i:cc[x.id]}:x);r=a.solve([...SS,...els]);let again=false;
     srcs.forEach(x=>{if(!x.on||cc[x.id])return;const Io=-r.cur(x);if(abs(Io)>x.lim){cc[x.id]=Math.sign(Io)*x.lim;again=true}});if(!again)break}
   const I=k=>el[k]?r.cur(el[k]):0;
   const Ifm=I('mf'),Im=I('ma'),Igf=I('gf'),Iga=-I('ga'),Igs=I('gs'),Vam=r.vt('M.1B1')-r.vt('M.2B2');
   /* الآلة المولدة: الفيض من مجال التوازي + التوالي − رد فعل المنتج، مع زمن ملف المجال */
   const Ft=Igf+(el.gs?v.kse*Igs:0)-Math.sign(Igf||1)*v.kar*abs(Iga);
   ph.F+=(Ft-ph.F)*(1-Math.exp(-a.dt/Math.max(v.Tf||0.3,0.05)));
   const vb=M.vb(Iga);ph.Eg=M.E(ph.F,ph.n)-vb;ph.Iga=Iga;
   /* المحرك المُدير */
   const phi=abs(Ifm)<1e-4?PHIR:phiOf(Ifm);ph.phi=phi;
   const K=Ram/(kE*Math.max(v.tau,0.05)),na=abs(ph.n),sg=Math.sign(ph.n);
   const fr=v.I0*Math.min(1,na/30)*sg,Tg=((ph.Eg+vb)*Iga)/(kE*Math.max(na,30))*sg;
   ph.n+=K*(phi*Im-fr-Tg)*a.dt;if(na<1&&abs(phi*Im)<v.I0)ph.n=0;
   /* حالة وأخطاء */
   if(a.sw('S1'))ph.ever1=true;
   if(a.hold('nf',a.sw('S1')&&abs(Vam)>15&&abs(phi)<0.2,0.4)){a.mistake('no-field')}
   else if(a.hold('os',abs(ph.n)>NMAX,0.2))a.mistake('overspeed');
   if(na<100&&a.hold('sc',abs(Im)>9.5,0.5))a.once('start-current');else if(abs(Im)<4)a.rearm('start-current');
   ['A','A2'].forEach(k=>{if(el['am'+k]&&a.hold('af'+k,abs(I('am'+k))>a.maxRange(k)*1.1,0.1))a.mistake('amm-fuse')});
   [[S1,'short-1','V1'],[S2,'short-2','V2']].forEach(([x,id,kn])=>{if(x&&a.hold(id,!!cc[x.id]&&abs(r.vt(x.p)-r.vt(x.n))<Math.max(2,0.03*a.knob(kn)),0.3))a.mistake(id)});
   if(o.sep){if(a.hold('ifo',abs(Igf)>IFMAX,1))a.once('if-over');else if(abs(Igf)<0.32)a.rearm('if-over')}
   if(a.hold('rr',ph.n<-50,0.6))a.once('reverse-rot');
   /* القراءات */
   const out={N:ph.n};
   ['V','V2x'].forEach(k=>{if(el['vm'+k])out[k]=pair(a,k+'+',k+'-')?r.vt(k+'+')-r.vt(k+'-'):null});
   ['A','A2'].forEach(k=>{if(el['am'+k])out[k]=wired(a,k+'+')&&wired(a,k+'-')?I('am'+k):null});
   ph.last=Object.assign({},out,{IL:I('rl'),VL:el.rl?r.vt('L1')-r.vt('L2'):0,Igf,Igs,Vgt:r.vt('G.1B1')-r.vt('G.2B2'),Ifm,Vam});
   return out}}
}
const genSwitchOff=(id,a)=>{if(id==='S1'&&a.knob('V1')>5&&abs(a.S.phys.n)>50)a.mistake('stop-not-zero')};
const GEN_TP=['nref','Er','E03','Fk','Ra','Vb','kar','Rsh','Tf','Rse','kse','RLmax','Rlamp','Vrat','Irat','nrat','n0','Ram','I0','tau'];
const DRIVE={left:{p:'M',title:'المحرك المُدير M (توازي)',sub:'آلة تيار مستمر',lsub:'Motor'}};
/* تسجيل حمل: IL من الأميتر في خط الحمل، و VL من الفولتميتر — يُقبلان فقط إذا طابقا تيار الحمل وجهده فعلاً */
function loadRead(a,ammK){const R=a.S.phys.last||{};
 if(R.V==null)return {err:'الفولتميتر غير موصّل.'};
 if(R[ammK]==null)return {err:'الأميتر '+(ammK==='A'?'':ammK+' ')+'غير موصّل.'};
 if(!same(abs(R[ammK]),abs(R.IL)))return {err:'الأميتر '+(ammK==='A'?'':ammK+' ')+'لا يقيس تيار الحمل: يوصل على التوالي في خط الحمل.'};
 if(!same(abs(R.V),abs(R.Vgt))&&!same(abs(R.V),abs(R.VL)))return {err:'الفولتميتر لا يقيس جهد الحمل: يوصل بين طرفي المولد (أو طرفي الحمل).'};
 return {IL:abs(R[ammK]),VL:abs(R.V)}}

/* ===================== عائلة المحركات (التجارب 5–7) ===================== */
function motFamily(type){
 return {
  init:()=>({n:0,Ia:0,Ish:0,Ise:0,Ief:0,k:0,ever1:false}),
  tick(a){const v=a.P(),Mo=D2.Mod,ph=a.S.phys,J=Mo.J(v);
   const T=a.has('TQ')?a.knob('TQ'):0,N=12,h=a.dt/N,TL=0.15;/* TL: ثابت زمن الفيض (قيمة توضيحية) — يجعل حلقة «التيار ← الفيض ← القوة الدافعة» مستقرة */let r,el,cc={},out={};
   for(let s=0;s<N;s++){
    const Ieff=ph.Ief,kphi=(Ieff<0?-1:1)*Mo.E(v,abs(Ieff))/1500;ph.k=kphi;
    const src=(id,p,n,on,V,lim)=>({id,p,n,g:on?1/RINT:1e-9,i:on?V/RINT:0,on,lim});
    const S1=src('S1','P1+','P1-',a.sw('S1'),a.knob('V1'),10),S2=a.has('V2')?src('S2','P2+','P2-',a.sw('S2'),a.knob('V2'),6):null;
    el={ma:{p:'MT.1B1',n:'MT.2B2',g:1/v.Ra,i:kphi*ph.n/v.Ra},mf:{p:'MT.E1',n:'MT.E2',g:1/v.Rf}};
    if(a.has('MT.D1'))el.ms={p:'MT.D1',n:'MT.D2',g:1/v.Rse};
    ['V'].forEach(k=>{if(a.has(k+'+'))el['vm'+k]={p:k+'+',n:k+'-',g:1/RVM}});
    ['A','A1'].forEach(k=>{if(a.has(k+'+'))el['am'+k]={p:k+'+',n:k+'-',g:1/RAMM}});
    const srcs=[S1,S2].filter(Boolean);cc={};
    for(let it=0;it<3;it++){const SS=srcs.map(x=>cc[x.id]?{p:x.p,n:x.n,g:1e-7,i:cc[x.id]}:x);r=a.solve([...SS,...Object.values(el)]);let again=false;
      srcs.forEach(x=>{if(!x.on||cc[x.id])return;const Io=-r.cur(x);if(abs(Io)>x.lim){cc[x.id]=Math.sign(Io)*x.lim;again=true}});if(!again)break}
    const Ia=r.cur(el.ma);ph.Ia=Ia;ph.Ish=r.cur(el.mf);ph.Ise=el.ms?r.cur(el.ms):0;ph.Ief+=(ph.Ish+v.aSe*ph.Ise-ph.Ief)*(1-Math.exp(-h/TL));
    const Te=kphi*60/(2*Math.PI)*Ia,Tc=T+v.Tf0,vis=v.Tv/1000*ph.n;
    if(ph.n===0&&abs(Te)<=Tc){continue}
    const sg=ph.n!==0?Math.sign(ph.n):Math.sign(Te);
    let nn=ph.n+h*60/(2*Math.PI*J)*(Te-sg*Tc-vis);if(ph.n!==0&&Math.sign(nn)!==sg)nn=0;ph.n=nn;ph.S1=S1;ph.S2=S2;ph.cc=cc}
   const I=k=>el[k]?r.cur(el[k]):0,Va0=r.vt('MT.1B1')-r.vt('MT.2B2'),Vse=el.ms?r.vt('MT.D1')-r.vt('MT.D2'):0,Vam=type==='series'?abs(Va0)+abs(Vse):Va0;
   if(a.sw('S1'))ph.ever1=true;
   const Ieff=ph.Ish+(el.ms?v.aSe*ph.Ise:0);
   if(type!=='series'&&a.hold('nf',a.sw('S1')&&abs(Vam)>15&&abs(Ieff)<0.03,0.4))a.mistake('no-field');
   else if(a.hold('os',abs(ph.n)>v.nMax,0.15))a.mistake('overspeed');
   if(abs(ph.n)<100&&a.hold('sc',abs(ph.Ia)>3*v.IaN,0.15))a.once('start-current');else if(abs(ph.Ia)<1.5*v.IaN)a.rearm('start-current');
   if(type==='series'&&a.hold('snl',a.sw('S1')&&a.knob('V1')>10&&T<0.05,0.5))a.once('series-noload');else if(T>=0.05)a.rearm('series-noload');
   ['A','A1'].forEach(k=>{if(el['am'+k]&&a.hold('af'+k,abs(I('am'+k))>a.maxRange(k)*1.1,0.1))a.mistake('amm-fuse')});
   [[ph.S1,'short-1','V1'],[ph.S2,'short-2','V2']].forEach(([x,id,kn])=>{if(x&&a.hold(id,!!(ph.cc||{})[x.id]&&abs(r.vt(x.p)-r.vt(x.n))<Math.max(2,0.03*a.knob(kn)),0.3))a.mistake(id)});
   if(a.hold('rr',ph.n<-50,0.6))a.once('reverse-rot');
   out={N:ph.n,TQd:T};
   if(el.vmV)out.V=pair(a,'V+','V-')?r.vt('V+')-r.vt('V-'):null;
   ['A','A1'].forEach(k=>{if(el['am'+k])out[k]=wired(a,k+'+')&&wired(a,k+'-')?I('am'+k):null});
   ph.last=Object.assign({},out,{Vam,Ia:ph.Ia,Ish:ph.Ish,T});
   return out}}
}
const MOT_TP=type=>D2.motorDefs(type);
/* تسجيل نقطة في جداول المحركات (نفس شروط تبويب المختبر TB و TOL) */
function motRecord(a,ids){const R=a.S.phys.last||{},TB=D2.TB,TOL=D2.TOL;
 if(R.V==null)return {msg:'الفولتميتر غير موصّل: يوصل ليقيس Vin.'};
 if(!same(abs(R.V),abs(R.Vam)))return {msg:a.has('A1')?'الفولتميتر لا يقيس جهد المنتج Vin: وصّله على طرفي المنتج 1B1 و2B2.':'الفولتميتر لا يقيس جهد المحرك Vin: وصّله على طرفي المحرك كاملاً (ملف التوالي مع المنتج).'};
 if(R.A==null||!same(abs(R.A),abs(R.Ia)))return {msg:'الأميتر لا يقيس تيار المنتج: يوصل على التوالي مع المنتج.'};
 if(abs(R.N)<20)return {msg:'المحرك متوقف: لا توجد قراءة سرعة.'};
 const cur={Vin:abs(R.V),T:R.T,If:R.A1!=null?abs(R.A1):null};
 const hits=[];
 for(const id of ids){const t=TB[id];if(t.cond.some(([k,val])=>k==='If'&&(cur.If==null||!same(cur.If,abs(R.Ish))))){continue}
  if(!t.cond.every(([k,val])=>cur[k]!=null&&abs(cur[k]-val)<=TOL[k]+1e-9))continue;
  const cols=t.pts.filter(p=>!(t.skip||[]).includes(p)),i=cols.findIndex(p=>cur[t.v]!=null&&abs(cur[t.v]-p)<=TOL[t.v]+1e-9);if(i<0)continue;hits.push([id,i])}
 if(!hits.length){const need=ids.map(id=>{const t=D2.TB[id];return t.cap+': '+t.cond.map(([k,val])=>k+' = '+val).join(' و ')+' ثم '+t.v+' على '+t.pts.filter(p=>!(t.skip||[]).includes(p)).join('، ')}).join(' — ');
   return {msg:'نقطة التشغيل لا تطابق أي عمود. المطلوب: '+need+'. (السماح: Vin ±0.5 V، T ±0.005 N.m، If ±0.0025 A)'}}
 const val={n:abs(R.N),Ia:abs(R.A)};
 return {multi:hits.map(([t,c])=>({table:t,col:c,val})),ok:true,msg:'سجّلت n = '+a.fmt(val.n,0)+' rpm و Ia = '+a.fmt(val.Ia,2)+' A في '+hits.map(h=>D2.TB[h[0]].cap).join(' و ')+'.'}}
const condS=t=>t.cond.map(([k,v])=>k+' = '+v+(k==='T'?' N.m':k==='If'?' A':' V')).join('، ');
const motTables=ids=>ids.map(id=>{const t=D2.TB[id];return {id,title:t.cap+' — '+condS(t),xh:t.head,cols:t.pts.filter(p=>!(t.skip||[]).includes(p)),rows:[{k:'n',h:'n (rpm)',dp:0},{k:'Ia',h:'I<sub>a</sub> (A)',dp:2}],py:'n',xu:t.v==='T'?'T (N.m)':t.v==='If'?'If (A)':'Vin (V)',yu:'n (rpm)',xdp:t.v==='Vin'?0:2}});

/* ===================== عائلة المحولات (التجارب 8–12) ===================== */
function trFamily(o){/* o:{tr:['T1'],three,parallel} */
 return {
  init:()=>({u:{},ever:false}),
  tick(a){const v=a.P(),ph=a.S.phys,v2=a.P2?a.P2():null;const y=r=>[1/r,0];
   const els=[],el={};
   if(a.has('VA')){el.src={p:'AC.L',n:'AC.N',y:y(0.3),i:a.sw('SA')?[a.knob('VA')/0.3,0]:[0,0]};if(!a.sw('SA'))el.src.y=[1e-9,0];els.push(el.src)}
   if(a.has('V3')){const Vp=a.knob('V3')/SQ3,on=a.sw('S3');['L1p','L2p','L3p'].forEach((t,i)=>{const e={p:t,n:'Np',y:on?y(0.3):[1e-9,0],i:on?C.pol(Vp/0.3,-120*i):[0,0]};el['s'+i]=e;els.push(e)})}
   (o.tr||[]).forEach((p,k)=>{const a2=v.a*(k===1&&v2?1+v2.dA/100:1),kz=k===1&&v2?v2.kZ:1,Z=[(v.R1+v.R2)*kz,(v.X1+v.X2)*kz];
     const u=(ph.u[p]||0)/v.V1n,sat=D3.satF(v,Math.max(u,0.05)),Ym=C.add([1/v.Rc,0],C.div([1,0],[0,v.Xm/sat]));
     const yz=C.div([1,0],Z);els.push({p:[p+'.H1',p+'.H2'],q:[p+'.X1',p+'.X2'],Y:[[C.add(yz,Ym),C.mul([-a2,0],yz)],[C.mul([-a2,0],yz),C.mul([a2*a2,0],yz)]]});el['tr'+p]={p,a2,Z,Ym}});
   const meters={};['V1','V2','V','VA1','VL1','VL2'].forEach(k=>{if(a.has(k+'+')){const e={p:k+'+',n:k+'-',y:y(RVM)};el['vm'+k]=e;els.push(e)}});
   ['A','A1','A2'].forEach(k=>{if(a.has(k+'+')){const e={p:k+'+',n:k+'-',y:y(0.02)};el['am'+k]=e;els.push(e)}});
   if(a.has('W.I+')){el.wi={p:'W.I+',n:'W.I-',y:y(0.02)};el.wv={p:'W.V+',n:'W.V-',y:y(RVM)};els.push(el.wi,el.wv)}
   if(a.has('RL')){const p=a.knob('RL');let R;if(o.parallel&&v2)R=v2.Rf+v2.Rvm*p/100;else R=(v.V1n/v.a)/Math.max(p/100*v.Sn*v.a/v.V1n,1e-6);el.rl={p:'L1',n:'L2',y:a.sw('SL')?y(R):[1e-9,0]};els.push(el.rl)}
   ['K1','K2'].forEach(k=>{if(a.has(k)){el[k]={p:k+'.a',n:k+'.b',y:a.sw(k)?[1e3,0]:[1e-9,0]};els.push(el[k])}});
   const r=a.solveAC(els),mag=x=>C.abs(x);
   (o.tr||[]).forEach(p=>{ph.u[p]=mag(r.vd(p+'.H1',p+'.H2'))});
   /* تيار الابتدائي لكل محول (من الطرفين) */
   const Ip={};(o.tr||[]).forEach(p=>{const t=el['tr'+p],V1=r.vd(p+'.H1',p+'.H2'),V2=r.vd(p+'.X1',p+'.X2');const yz=C.div([1,0],t.Z);
     const I1=C.add(C.mul(C.add(yz,t.Ym),V1),C.mul(C.mul([-t.a2,0],yz),V2)),I2=C.add(C.mul(C.mul([-t.a2,0],yz),V1),C.mul(C.mul([t.a2*t.a2,0],yz),V2));Ip[p]={I1:mag(I1),I2:mag(I2),V1:mag(V1),V2:mag(V2)}});
   const I1n=v.Sn/v.V1n;
   if(a.hold('trip',Object.values(Ip).some(x=>x.I1>v.kTrip*I1n),0.12)){if(o.parallel&&a.sw('K1'))a.mistake('par-reverse');else if(o.three&&Object.values(Ip).some(x=>x.I2>v.kTrip*I1n*v.a&&x.V2<0.5*v.V1n/v.a))a.mistake('delta-open');else a.mistake('tr-overcurrent')}
   if(a.hold('ov',Object.values(Ip).some(x=>x.V1>1.12*v.V1n),0.5))a.once('tr-overvolt');else if(Object.values(Ip).every(x=>x.V1<1.05*v.V1n))a.rearm('tr-overvolt');
   if(a.sw('SA')||a.sw('S3'))ph.ever=true;
   const out={};
   ['V1','V2','V','VA1','VL1','VL2'].forEach(k=>{if(el['vm'+k])out[k]=pair(a,k+'+',k+'-')?mag(r.vd(k+'+',k+'-')):null});
   ['A','A1','A2'].forEach(k=>{if(el['am'+k])out[k]=wired(a,k+'+')&&wired(a,k+'-')?mag(r.cur(el['am'+k])):null});
   if(el.wi){const Vc=r.vd('W.V+','W.V-'),Ic=r.cur(el.wi);out.W=pair(a,'W.I+','W.I-')&&pair(a,'W.V+','W.V-')?C.mul(Vc,C.conj(Ic))[0]:null}
   ph.Ip=Ip;ph.r=r;ph.el=el;ph.last=Object.assign({},out,{Ip,IL:el.rl?mag(r.cur(el.rl)):0,VLd:el.rl?mag(r.vd('L1','L2')):0});
   return out}}
}
/* هل الجهاز يقيس الكمية المطلوبة؟ (مقارنة قراءته بالحل) */
const isV=(a,k,p,n)=>{const R=a.S.phys.last||{},r=a.S.phys.r;return R[k]!=null&&r&&same(R[k],C.abs(r.vd(p,n)))};
const TRP=()=>D3.TRDEF;

/* ===================== التسجيل العام ===================== */
function recInto(a,table,col,val,label){if((a.S.rec[table]||{})[col]!=null&&!a.S.overwrite)return {ok:true,table,col,val,msg:'أعدت تسجيل '+label+'.'};return {ok:true,table,col,val,msg:'سجّلت '+label+'.'}}

/* ===================== التجارب ===================== */
const REG={};
const T11=D.T11COLS,T12=D.T12COLS,T21=['open',100,80,60,50,40,20],T3=['open',100,80,60,40],T4=[0,1,2,3,4,5,6,7,8,9];
const fRL=c=>c==='open'?'مفصول':c+'%';
const full=(a,t,cols)=>{const T=a.S.rec[t]||{};return cols.every((_,i)=>T[i]!=null)};
const offAll=a=>['S1','S2','SA','S3'].every(k=>!a.has(k)||!a.sw(k));
const zeroAll=a=>['V1','V2','VA','V3'].every(k=>!a.has(k)||a.knob(k)<1);

/* ---- التجربة الأولى (1.2) ---- */
REG['u1-l2']={title:'اختبار اللاحمل للمولد منفصل التغذية',tp:GEN_TP,
 layout:()=>LAY().build({rows:[[['psu1'],['psu2'],['vm'],['am'],['tacho']]],machines:Object.assign({right:{p:'G',title:'المولد G',sub:'آلة تيار مستمر — تغذية منفصلة',lsub:'Generator'}},DRIVE)}),
 exp:L=>Object.assign(genFamily({sep:true}),{swKnob:{S1:'V1',S2:'V2'},onSwitchOff:genSwitchOff,
  steps:[
   {t:'وصّل التجربة كما في الشكل (1): منتج المحرك ومجاله على مصدر الجهد، ومجال المولد على مصدر التيار عبر الأميتر، والفولتميتر على طرفي منتج المولد.',done:a=>a.conn('M.1B1','P1+')&&a.conn('M.2B2','P1-')&&a.conn('M.E1','P1+')&&a.conn('M.E2','P1-')&&a.conn('V+','G.1B1')&&a.conn('V-','G.2B2')&&wired(a,'A+')&&wired(a,'A-')},
   {t:'تأكد أن مقبض مصدر الجهد على الصفر ثم شغّل المصدر.',done:a=>a.S.phys.ever1},
   {t:'ارفع جهد المصدر تدريجياً حتى تصل السرعة إلى <span class="ltr">1000 rpm</span>.',done:a=>a.S.phys.r1000||(a.S.phys.r1000=abs(a.S.phys.n-1000)<=TOL_N)},
   {t:'شغّل مصدر التيار وغيّر تيار المجال حسب جدول (1-1)، وسجّل <span class="ltr">E₀</span> عند كل قيمة.',done:a=>full(a,'t1',T11)},
   {t:'ارفع تيار المجال إلى <span class="ltr">0.3 A</span>، ثم غيّر جهد مصدر الجهد للسرعات في جدول (1-2) وسجّل <span class="ltr">E₀</span>.',done:a=>full(a,'t2',T12)},
   {t:'أعد المصدرين إلى الصفر، ثم أطفئهما.',done:a=>full(a,'t1',T11)&&full(a,'t2',T12)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'t1',T11)&&full(a,'t2',T12)&&offAll(a)&&zeroAll(a),
  tables:[{id:'t1',title:'جدول (1-1) — n = 1000 rpm',xh:'I<sub>f</sub> (A)',yh:'E<sub>0</sub> (V)',cols:T11,dp:1,xu:'If (A)',yu:'E0 (V)',xdp:2},
          {id:'t2',title:'جدول (1-2) — If = 0.3 A',xh:'n (rpm)',yh:'E<sub>0</sub> (V)',cols:T12,dp:1,xu:'n (rpm)',yu:'E0 (V)'}],
  record(a){const R=a.S.phys.last||{};
   if(R.V==null||!same(abs(R.V),abs(R.Vgt)))return {msg:'الفولتميتر لا يقيس جهد طرفي منتج المولد: وصّله بين 1B1 (+) و2B2 (−) للمولد.'};
   if(R.A==null||!same(abs(R.A),abs(R.Igf)))return {msg:'الأميتر ليس على التوالي مع مجال المولد، فلا تُعرف قيمة تيار المجال.'};
   const n=a.S.phys.n,If=R.A,E=R.V;
   if(near(n,1000,TOL_N)){const i=T11.findIndex(c=>near(If,c,0.005));if(i>=0)return recInto(a,'t1',i,E,'E₀ = '+a.fmt(E,1)+' V عند If = '+T11[i]+' A')}
   if(near(If,0.3,0.005)){const j=T12.findIndex(c=>near(n,c,TOL_N));if(j>=0)return recInto(a,'t2',j,E,'E₀ = '+a.fmt(E,1)+' V عند n = '+T12[j]+' rpm')}
   if(near(n,1000,TOL_N))return {msg:'السرعة 1000 rpm صحيحة، لكن اضبط تيار المجال على قيمة من جدول (1-1): '+T11.join('، ')+' A (السماح ±0.005 A).'};
   return {msg:'للجدول (1-1) اضبط السرعة على 1000 rpm (±10). وللجدول (1-2) اضبط تيار المجال على 0.3 A ثم السرعة على إحدى قيمه: '+T12.join('، ')+' rpm.'}}})};

/* ---- التجربة الثانية (1.3) ---- */
REG['u1-l3']={title:'منحنى خواص الحمل للمولد منفصل التغذية',tp:GEN_TP,
 layout:()=>LAY().build({rows:[[['psu1'],['psu2'],['vm'],['am',{id:'A',sub:'A1 — تيار المجال'}],['tacho']],[['am',{id:'A2',ranges:[1,5,10],sub:'خط الحمل'}],['rl']]],machines:Object.assign({right:{p:'G',title:'المولد G',sub:'آلة تيار مستمر — تغذية منفصلة',lsub:'Generator'}},DRIVE)}),
 exp:L=>{const N2=1500;return Object.assign(genFamily({sep:true,load:'rl'}),{swKnob:{S1:'V1',S2:'V2'},onSwitchOff:genSwitchOff,
  steps:[
   {t:'وصّل التجربة كما في الشكل (2): المحرك كما في التجربة الأولى، ومجال المولد على مصدر التيار عبر الأميتر A1، والحمل R<sub>L</sub> عبر الأميتر A2 على طرفي المولد، والفولتميتر على طرفي المولد.',done:a=>a.conn('M.1B1','P1+')&&a.conn('M.E1','P1+')&&wired(a,'A2+')&&wired(a,'L1')&&wired(a,'V+')},
   {t:'تأكد أن مصدر الجهد على الصفر ثم شغّله.',done:a=>a.S.phys.ever1},
   {t:'ثبّت السرعة عند <span class="ltr">'+N2+' rpm</span> وتيار المجال عند <span class="ltr">0.3 A</span>، والحمل مفصول، وسجّل قراءة اللاحمل.',done:a=>(a.S.rec.t21||{})[0]!=null},
   {t:'شغّل مفتاح الحمل، وغيّر R<sub>L</sub> حسب جدول (2-1)، وأعد ضبط السرعة قبل كل تسجيل.',done:a=>full(a,'t21',T21)},
   {t:'افصل الحمل، وأعد المصدرين إلى الصفر ثم أطفئهما.',done:a=>full(a,'t21',T21)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'t21',T21)&&offAll(a)&&zeroAll(a),
  tables:[{id:'t21',title:'جدول (2-1) — n = '+N2+' rpm و If = 0.3 A',xh:'R<sub>L</sub>',fx:fRL,cols:T21,rows:[{k:'IL',h:'I<sub>L</sub> (A)',dp:2},{k:'VL',h:'V<sub>L</sub> (V)',dp:1}],px:'IL',py:'VL',xu:'IL (A)',yu:'VL (V)',xdp:1}],
  record(a){const R=a.S.phys.last||{},n=a.S.phys.n;
   if(R.A==null||!same(abs(R.A),abs(R.Igf)))return {msg:'الأميتر A1 ليس على التوالي مع مجال المولد.'};
   if(!near(n,N2,TOL_N)||!near(abs(R.A),0.3,0.005))return {msg:'اضبط السرعة على '+N2+' rpm (±10) وتيار المجال على 0.3 A (±0.005) قبل التسجيل.'};
   const col=a.sw('SL')?T21.indexOf(Math.round(a.knob('RL'))):0;if(col<0)return {msg:'اضبط R<sub>L</sub> على إحدى قيم الجدول: 100، 80، 60، 50، 40، 20 %.'.replace(/<\/?sub>/g,'')};
   if(col===0){if(R.V==null||!same(abs(R.V),abs(R.Vgt)))return {msg:'الفولتميتر لا يقيس جهد طرفي المولد.'};return recInto(a,'t21',0,{IL:0,VL:abs(R.V)},'قراءة اللاحمل VL = '+a.fmt(abs(R.V),1)+' V')}
   const q=loadRead(a,'A2');if(q.err)return {msg:q.err};return recInto(a,'t21',col,q,'RL = '+T21[col]+'%: IL = '+a.fmt(q.IL,2)+' A، VL = '+a.fmt(q.VL,1)+' V')}})}};

/* ---- التجربة الثالثة (1.4) ---- */
REG['u1-l4']={title:'خواص مولد التوازي',tp:GEN_TP,
 layout:()=>LAY().build({rows:[[['psu1'],['vm'],['am',{id:'A',ranges:[1,5,10],sub:'خط الحمل'}],['rl'],['tacho']]],machines:Object.assign({right:{p:'G',title:'المولد G (توازي — تغذية ذاتية)',sub:'آلة تيار مستمر',lsub:'Generator'}},DRIVE)}),
 exp:L=>Object.assign(genFamily({shunt:true,load:'rl'}),{swKnob:{S1:'V1'},onSwitchOff:genSwitchOff,
  note:'مولد التوازي يبني جهده بنفسه من المغناطيسية المتبقية، بشرط أن تكون السرعة كافية وأن يكون ملف المجال موصلاً بحيث يقوّي المغناطيسية المتبقية. إذا لم يبنِ الجهد فافحص اتجاه أطراف المجال.',
  steps:[
   {t:'وصّل التجربة كما في الشكل (3): المحرك على المصدر، ومجال المولد E1–E2 على طرفي منتجه، والحمل عبر الأميتر على طرفي المولد، والفولتميتر على طرفي المولد.',done:a=>a.conn('M.1B1','P1+')&&a.conn('M.E1','P1+')&&(a.conn('G.E1','G.1B1')||a.conn('G.E1','G.2B2'))&&wired(a,'A+')&&wired(a,'V+')},
   {t:'شغّل المصدر وهو على الصفر وارفعه ببطء وراقب بناء الجهد.',done:a=>a.S.phys.ever1&&abs((a.S.phys.last||{}).Vgt||0)>100},
   {t:'جدول (3-1): ثبّت السرعة عند <span class="ltr">1200 rpm</span> وسجّل والحمل مفصول، ثم 100% و80% و60% و40%.',done:a=>full(a,'t31',T3)},
   {t:'جدول (3-2): ارفع السرعة إلى <span class="ltr">1500 rpm</span> وكرر.',done:a=>full(a,'t32',T3)},
   {t:'افصل الحمل، وأعد المصدر إلى الصفر ثم أطفئه.',done:a=>full(a,'t31',T3)&&full(a,'t32',T3)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'t31',T3)&&full(a,'t32',T3)&&offAll(a)&&zeroAll(a),
  tables:[1,2].map(k=>({id:'t3'+k,title:'جدول (3-'+k+') — n = '+(k===1?1200:1500)+' rpm',xh:'R<sub>L</sub>',fx:fRL,cols:T3,rows:[{k:'IL',h:'I<sub>L</sub> (A)',dp:2},{k:'VL',h:'V<sub>L</sub> (V)',dp:1}],px:'IL',py:'VL',xu:'IL (A)',yu:'VL (V)',xdp:1})),
  record(a){const R=a.S.phys.last||{},n=a.S.phys.n,t=near(n,1200,TOL_N)?'t31':near(n,1500,TOL_N)?'t32':null;
   if(!t)return {msg:'اضبط السرعة على 1200 rpm لجدول (3-1) أو 1500 rpm لجدول (3-2) (±10).'};
   const col=a.sw('SL')?T3.indexOf(Math.round(a.knob('RL'))):0;if(col<0)return {msg:'اضبط الحمل على إحدى قيم الجدول: 100، 80، 60، 40 %.'};
   if(col===0){if(R.V==null||!same(abs(R.V),abs(R.Vgt)))return {msg:'الفولتميتر لا يقيس جهد طرفي المولد.'};return recInto(a,t,0,{IL:0,VL:abs(R.V)},'قراءة اللاحمل VL = '+a.fmt(abs(R.V),1)+' V')}
   const q=loadRead(a,'A');if(q.err)return {msg:q.err};return recInto(a,t,col,q,'RL = '+T3[col]+'%: IL = '+a.fmt(q.IL,2)+' A، VL = '+a.fmt(q.VL,1)+' V')}})};

/* ---- التجربة الرابعة (1.5) ---- */
REG['u1-l5']={title:'منحنى خواص الحمل للمولد المركب',tp:GEN_TP,
 layout:()=>LAY().build({rows:[[['psu1'],['rh',{k:'Rst',title:'مقاومة البدء Rst',sub:'في دائرة منتج المحرك',max:30,init:30}],['rh',{k:'Rfm',title:'منظم مجال المحرك Rfm',sub:'في دائرة مجال المحرك',max:300}],['rh',{k:'Rfg',title:'منظم مجال المولد Rfg',sub:'في دائرة مجال المولد',max:400,init:400}]],[['vm'],['am',{id:'A',ranges:[1,5,10],sub:'خط الحمل'}],['lamps'],['tacho']]],
  machines:Object.assign({right:{p:'G',title:'المولد G (مركب)',sub:'آلة تيار مستمر — توازي + توالٍ',lsub:'Generator',series:true}},{left:{p:'M',title:'المحرك المُدير M (توازي)',sub:'آلة تيار مستمر',lsub:'Motor'}})}),
 exp:L=>Object.assign(genFamily({compound:true,load:'lamps'}),{swKnob:{S1:'V1'},onSwitchOff:genSwitchOff,
  note:'قبل التشغيل: مقاومة البدء R<sub>st</sub> على أكبر قيمة ومنظم مجال المحرك R<sub>fm</sub> على الصفر (أقوى مجال). بعد أن يدور المحرك أنقص R<sub>st</sub> إلى الصفر، واضبط السرعة بـ R<sub>fm</sub> أو بجهد المصدر.',
  steps:[
   {t:'وصّل التجربة كما في الشكل (4): R<sub>st</sub> في دائرة منتج المحرك و R<sub>fm</sub> في دائرة مجاله، ومجال توازي المولد عبر R<sub>fg</sub> على طرفيه، وملف التوالي D1–D2 في خط الحمل، والمصابيح عبر الأميتر، والفولتميتر على طرفي الحمل.',done:a=>wired(a,'Rst.a')&&wired(a,'Rfm.a')&&wired(a,'Rfg.a')&&wired(a,'G.D1')&&wired(a,'L1')&&wired(a,'A+')&&wired(a,'V+')},
   {t:'ابدأ بمقاومة البدء على أكبر قيمة، وشغّل المصدر وارفع جهده، ثم أنقص R<sub>st</sub> إلى الصفر.',done:a=>a.S.phys.ever1&&a.knob('Rst')<1&&abs(a.S.phys.n)>500},
   {t:'اضبط السرعة على السرعة المقننة <span class="ltr">1500 rpm</span>، واضبط R<sub>fg</sub> حتى يصبح الجهد المقنن <span class="ltr">220 V</span> بلا حمل، وسجّل.',done:a=>(a.S.rec.t41||{})[0]!=null},
   {t:'أغلق المفتاح S وأدخل المصابيح واحداً بعد الآخر، مع ضبط السرعة كل مرة، وسجّل جدول (4-1).',done:a=>full(a,'t41',T4)},
   {t:'أطفئ المصدر واعكس أطراف ملف التوالي D1–D2، ثم أعد الخطوات وسجّل جدول (4-2).',done:a=>full(a,'t42',T4)},
   {t:'افصل الحمل، وأعد المصدر إلى الصفر ثم أطفئه.',done:a=>full(a,'t41',T4)&&full(a,'t42',T4)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'t41',T4)&&full(a,'t42',T4)&&offAll(a)&&zeroAll(a),
  tables:[1,2].map(k=>({id:'t4'+k,title:'جدول (4-'+k+') — '+(k===1?'التوصيل الأول':'بعد عكس D1–D2'),xh:'المصابيح',cols:T4,rows:[{k:'IL',h:'I<sub>L</sub> (A)',dp:2},{k:'VL',h:'V<sub>L</sub> (V)',dp:1}],px:'IL',py:'VL',xu:'IL (A)',yu:'VL (V)',xdp:1})),
  record(a){const v=a.P(),R=a.S.phys.last||{},n=a.S.phys.n,ph=a.S.phys;
   if(!near(n,v.nrat,TOL_N))return {msg:'اضبط السرعة على السرعة المقننة '+v.nrat+' rpm (±10) قبل التسجيل.'};
   const k=a.sw('SL')?Math.round(a.knob('NL')):0;
   let t;if(k===0)t=full(a,'t41',T4)?'t42':'t41';
   else{if(abs(R.Igs)<0.02)return {msg:'لا يمر تيار في ملف التوالي D1–D2: يوصل في خط الحمل.'};
     t=Math.sign(R.Igs)===Math.sign(R.Igf)?'t41':'t42';
     if(t==='t42'&&!full(a,'t41',T4))return {msg:'ملف التوالي يُضعف المجال الآن (التوصيل المعكوس). أكمل جدول (4-1) أولاً بالتوصيل الأول (ملف التوالي يقوّي المجال)، ثم اعكس D1–D2 لجدول (4-2).'};
     if((a.S.rec[t]||{})[0]==null)return {msg:'سجّل أولاً قراءة اللاحمل لهذا الجدول (المفتاح S مفتوح والجهد '+v.Vrat+' V).'}}
   if(k===0){if(R.V==null)return {msg:'الفولتميتر غير موصّل.'};if(!near(abs(R.V),v.Vrat,2))return {msg:'بلا حمل اضبط R<sub>fg</sub> حتى يصبح الجهد '.replace(/<\/?sub>/g,'')+v.Vrat+' V (±2) ثم سجّل.'};ph['rfg'+t]=a.knob('Rfg');return recInto(a,t,0,{IL:0,VL:abs(R.V)},'قراءة اللاحمل VL = '+a.fmt(abs(R.V),1)+' V في '+(t==='t41'?'جدول (4-1)':'جدول (4-2)'))}
   if(ph['rfg'+t]!=null&&abs(a.knob('Rfg')-ph['rfg'+t])>0.5)return {msg:'لا تغيّر R<sub>fg</sub> بعد ضبط جهد اللاحمل: أرجعها إلى '.replace(/<\/?sub>/g,'')+ph['rfg'+t]+' Ω.'};
   const q=loadRead(a,'A');if(q.err)return {msg:q.err};return recInto(a,t,k,q,k+' مصابيح: IL = '+a.fmt(q.IL,2)+' A، VL = '+a.fmt(q.VL,1)+' V في '+(t==='t41'?'جدول (4-1)':'جدول (4-2)'))}})};

/* ---- التجارب 5–7: المحركات ---- */
const motLayout=(type)=>LAY().build({rows:[type==='sep'?[['psu1'],['psu2'],['vm',{sub:'جهد المنتج Vin'}],['am',{id:'A',ranges:[1,2.5,5],sub:'تيار المنتج Ia'}],['tacho']]:[['psu1'],['vm',{sub:'جهد المصدر Vin'}],['am',{id:'A',ranges:[1,2.5,5],sub:'تيار المنتج Ia'}],['tacho']],
  type!=='series'?[['am',{id:'A1',ranges:[0.5,1],sub:'تيار المجال If'}],['brake']]:[['brake']]],
  machines:{left:{p:'MT',title:type==='series'?'محرك التوالي':type==='shunt'?'محرك التوازي':'المحرك منفصل التغذية',sub:'آلة تيار مستمر',lsub:'Motor',series:true}}});
const motSteps=(type,ids)=>{const fig=type==='sep'?'(5)':type==='shunt'?'(6)':'(7)';return [
 {t:'وصّل التجربة كما في الشكل '+fig+(type==='sep'?': المنتج على مصدر الجهد عبر الأميتر، والمجال E1–E2 على مصدر التيار عبر الأميتر A1، والفولتميتر على طرفي المنتج.':type==='shunt'?': المنتج عبر الأميتر والمجال E1–E2 عبر الأميتر A1 كلاهما على المصدر، والفولتميتر على طرفي المنتج.':': ملف التوالي D1–D2 مع المنتج على التوالي عبر الأميتر على المصدر، والفولتميتر على المصدر.'),done:a=>wired(a,'MT.1B1')&&(type==='series'?wired(a,'MT.D1'):wired(a,'MT.E1'))&&wired(a,'A+')&&wired(a,'V+')},
 {t:type==='sep'?'شغّل مصدر المجال أولاً، ثم مصدر المنتج وهو على الصفر.':type==='series'?'اضبط الفرملة على عزم (المحرك لا يُشغّل بلا حمل)، ثم شغّل المصدر وهو على الصفر.':'شغّل المصدر وهو على الصفر.',done:a=>a.S.phys.ever1},
 ...ids.map(id=>({t:'سجّل '+D2.TB[id].cap+': ثبّت '+condS(D2.TB[id])+'، وغيّر '+D2.TB[id].v+' على قيم الجدول.'+(D2.TB[id].condNote?' <span class="sub">('+D2.TB[id].condNote.replace(/ — .*/,'')+')</span>':''),done:a=>full(a,id,motTables([id])[0].cols)})),
 {t:type==='sep'?'أعد المصدرين إلى الصفر: أطفئ المنتج ثم المجال.':'أعد المصدر إلى الصفر ثم أطفئه.',done:a=>ids.every(id=>full(a,id,motTables([id])[0].cols))&&offAll(a)&&zeroAll(a)}]};
const motExp=(type,ids)=>L=>Object.assign(motFamily(type),{swKnob:{S1:'V1',S2:'V2'},
 onSwitchOff(id,a){if(id==='S1'&&a.knob('V1')>5&&abs(a.S.phys.n)>50)a.mistake('stop-not-zero');if(type==='sep'&&id==='S2'&&a.sw('S1')&&abs(a.S.phys.n)>50)a.mistake('no-field')},
 onSwitchOn(id,a){if(type==='sep'&&id==='S1'&&!a.sw('S2'))a.mistake('field-first')},
 steps:motSteps(type,ids),complete:a=>ids.every(id=>full(a,id,motTables([id])[0].cols))&&offAll(a)&&zeroAll(a),
 tables:motTables(ids),record:a=>motRecord(a,ids)});
REG['u2-l1']={title:'خواص المحرك منفصل التغذية',tpOf:()=>MOT_TP('sep'),tpId:'u2-dcm',layout:()=>motLayout('sep'),exp:motExp('sep',['5-1','5-2','5-3'])};
REG['u2-l2']={title:'خواص محرك التوازي',tpOf:()=>MOT_TP('shunt'),tpId:'u2-dcm',layout:()=>motLayout('shunt'),exp:motExp('shunt',['6-1','6-2'])};
REG['u2-l3']={title:'خواص محرك التوالي',tpOf:()=>MOT_TP('series'),tpId:'u2-dcm',layout:()=>motLayout('series'),exp:motExp('series',['7-1','7-2'])};

/* ---- التجارب 8–10: محول أحادي الوجه ---- */
const trLayout=(extra)=>LAY().build({rows:[[['vac'],['wm'],['am',{id:'A',ac:true,sub:'AC',ranges:extra.aR||[0.5,2.5,5]}],['vm',{id:'V1',ac:true,sub:'AC — الابتدائي',ranges:[30,150,300]}]],[['tr',{p:'T1'}],...extra.row2]]});
const pct=(c)=>c==='open'?'مفصول':c+'%';
REG['u3-l1']={title:'اختبار اللاحمل للمحول أحادي الوجه',tpOf:TRP,tpId:'u3-tr',
 layout:()=>trLayout({row2:[['vm',{id:'V2',ac:true,sub:'AC — الثانوي',ranges:[30,150,300]}]]}),
 exp:L=>Object.assign(trFamily({tr:['T1']}),{swKnob:{SA:'VA'},
  steps:[
   {t:'وصّل التجربة كما في الشكل (8): المنبع المتغير على الابتدائي H1–H2 عبر ملف تيار الواتميتر والأميتر، وملف جهد الواتميتر والفولتميتر V1 على الابتدائي، والفولتميتر V2 على الثانوي X1–X2 والثانوي مفتوح.',done:a=>wired(a,'T1.H1')&&wired(a,'W.I+')&&wired(a,'A+')&&wired(a,'V1+')&&wired(a,'V2+')},
   {t:'تأكد أن المنبع على الصفر ثم شغّله.',done:a=>a.S.phys.ever},
   {t:'ارفع الجهد تدريجياً وسجّل عند 20% و40% و60% و80% و100% من الجهد المقنن.',done:a=>full(a,'e8',[20,40,60,80,100])},
   {t:'أعد الجهد إلى الصفر ثم أطفئ المنبع.',done:a=>full(a,'e8',[20,40,60,80,100])&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'e8',[20,40,60,80,100])&&offAll(a)&&zeroAll(a),
  tables:[{id:'e8',title:'اختبار اللاحمل',xh:'% من V<sub>1n</sub>',fx:c=>c+'%',cols:[20,40,60,80,100],rows:[{k:'V10',h:'V<sub>10</sub> (V)',dp:1},{k:'I10',h:'I<sub>10</sub> (A)',dp:3},{k:'P10',h:'P<sub>10</sub> (W)',dp:1},{k:'V20',h:'V<sub>20</sub> (V)',dp:1}],px:'V10',py:'I10',xu:'V10 (V)',yu:'I10 (A)',ydp:2}],
  record(a){const v=a.P(),R=a.S.phys.last||{},Ip=(a.S.phys.Ip||{}).T1;
   if(!Ip||!isV(a,'V1','T1.H1','T1.H2'))return {msg:'الفولتميتر V1 لا يقيس جهد الابتدائي H1–H2.'};
   if(!isV(a,'V2','T1.X1','T1.X2'))return {msg:'الفولتميتر V2 لا يقيس جهد الثانوي X1–X2.'};
   if(R.A==null||!same(R.A,Ip.I1))return {msg:'الأميتر لا يقيس تيار الابتدائي: يوصل على التوالي معه.'};
   if(R.W==null||R.W<=0)return {msg:'الواتميتر غير موصّل صحيحاً: ملف التيار على التوالي وملف الجهد على الابتدائي، وطرفا * من جهة المنبع.'};
   if(R.IL>1e-3)return {msg:'الثانوي يجب أن يكون مفتوحاً في اختبار اللاحمل.'};
   const i=[20,40,60,80,100].findIndex(q=>abs(R.V1-q/100*v.V1n)<=0.006*v.V1n);if(i<0)return {msg:'اضبط الجهد على '+[20,40,60,80,100].map(q=>a.fmt(q/100*v.V1n,1)+' V').join(' أو ')+' (±0.6%).'};
   return recInto(a,'e8',i,{V10:R.V1,I10:R.A,P10:R.W,V20:R.V2},(i+1)*20+'%: V10 = '+a.fmt(R.V1,1)+' V')}})};
REG['u3-l2']={title:'اختبار القصر للمحول أحادي الوجه',tpOf:TRP,tpId:'u3-tr',
 layout:()=>trLayout({aR:[1,2.5,5],row2:[['am',{id:'A2',ac:true,sub:'AC — الثانوي',ranges:[1,5,10]}]]}),
 exp:L=>Object.assign(trFamily({tr:['T1']}),{swKnob:{SA:'VA'},
  note:'في اختبار القصر يكفي جهد صغير (بضعة بالمئة من المقنن) ليمر التيار المقنن. ابدأ من الصفر وارفع ببطء وأنت تراقب الأميتر.',
  steps:[
   {t:'وصّل التجربة كما في الشكل (9): المنبع على الابتدائي عبر الواتميتر والأميتر، والفولتميتر V1 على الابتدائي، والثانوي X1–X2 مقصور عبر الأميتر A2.',done:a=>wired(a,'T1.X1')&&wired(a,'A2+')&&wired(a,'A+')&&wired(a,'W.I+')},
   {t:'تأكد أن المنبع على الصفر ثم شغّله.',done:a=>a.S.phys.ever},
   {t:'ارفع الجهد تدريجياً وبحذر، وسجّل عند 20% و40% و60% و80% و100% من التيار المقنن.',done:a=>full(a,'e9',[20,40,60,80,100])},
   {t:'أعد الجهد إلى الصفر ثم أطفئ المنبع.',done:a=>full(a,'e9',[20,40,60,80,100])&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'e9',[20,40,60,80,100])&&offAll(a)&&zeroAll(a),
  tables:[{id:'e9',title:'اختبار القصر',xh:'% من I<sub>1n</sub>',fx:c=>c+'%',cols:[20,40,60,80,100],rows:[{k:'Vsc',h:'V<sub>sc</sub> (V)',dp:2},{k:'Isc',h:'I<sub>sc</sub> (A)',dp:2},{k:'Psc',h:'P<sub>sc</sub> (W)',dp:1},{k:'I2',h:'I<sub>2</sub> (A)',dp:2}],px:'Isc',py:'Psc',xu:'Isc (A)',yu:'Psc (W)',xdp:1}],
  record(a){const v=a.P(),R=a.S.phys.last||{},Ip=(a.S.phys.Ip||{}).T1,I1n=v.Sn/v.V1n;
   if(!Ip||!isV(a,'V1','T1.H1','T1.H2'))return {msg:'الفولتميتر V1 لا يقيس جهد الابتدائي.'};
   if(R.A==null||!same(R.A,Ip.I1))return {msg:'الأميتر لا يقيس تيار الابتدائي.'};
   if(R.A2==null||!same(R.A2,Ip.I2))return {msg:'الأميتر A2 لا يقيس تيار الثانوي: الثانوي يُقصر عبره.'};
   if(Ip.V2>0.05*v.V1n/v.a)return {msg:'الثانوي ليس مقصوراً: صل X1 و X2 عبر الأميتر A2.'};
   if(R.W==null||R.W<=0)return {msg:'الواتميتر غير موصّل صحيحاً.'};
   const i=[20,40,60,80,100].findIndex(q=>abs(R.A-q/100*I1n)<=0.02*I1n);if(i<0)return {msg:'اضبط التيار على '+[20,40,60,80,100].map(q=>a.fmt(q/100*I1n,2)+' A').join(' أو ')+' (±2%).'};
   return recInto(a,'e9',i,{Vsc:R.V1,Isc:R.A,Psc:R.W,I2:R.A2},(i+1)*20+'%: Isc = '+a.fmt(R.A,2)+' A')}})};
const E10=['open',100,80,60,50,40];
REG['u3-l3']={title:'اختبار التحميل للمحول أحادي الوجه',tpOf:TRP,tpId:'u3-tr',
 layout:()=>trLayout({aR:[1,2.5,5],row2:[['vm',{id:'V2',ac:true,sub:'AC — الثانوي',ranges:[30,150,300]}],['am',{id:'A2',ac:true,sub:'AC — الثانوي',ranges:[1,5,10]}],['rl',{max:120,min:10,title:'الحمل RL',sub:'% من الحمل المقنن'}]]}),
 exp:L=>Object.assign(trFamily({tr:['T1']}),{swKnob:{SA:'VA'},
  steps:[
   {t:'وصّل التجربة كما في الشكل (10): المنبع على الابتدائي عبر الواتميتر والأميتر، و V1 على الابتدائي، والحمل R<sub>L</sub> على الثانوي عبر الأميتر A2، و V2 على الثانوي.',done:a=>wired(a,'T1.X1')&&wired(a,'L1')&&wired(a,'A2+')&&wired(a,'V2+')},
   {t:'شغّل المنبع وارفعه إلى الجهد المقنن والحمل مفصول، وسجّل قراءة اللاحمل.',done:a=>(a.S.rec.e10||{})[0]!=null},
   {t:'شغّل مفتاح الحمل وسجّل عند 100% و80% و60% و50% و40%.',done:a=>full(a,'e10',E10)},
   {t:'افصل الحمل، وأعد الجهد إلى الصفر ثم أطفئ المنبع.',done:a=>full(a,'e10',E10)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'e10',E10)&&offAll(a)&&zeroAll(a),
  tables:[{id:'e10',title:'اختبار التحميل — V1 = الجهد المقنن',xh:'الحمل',fx:pct,cols:E10,rows:[{k:'V1',h:'V<sub>1</sub> (V)',dp:1},{k:'I1',h:'I<sub>1</sub> (A)',dp:2},{k:'P1',h:'P<sub>1</sub> (W)',dp:1},{k:'V2',h:'V<sub>2</sub> (V)',dp:1},{k:'I2',h:'I<sub>2</sub> (A)',dp:2}],px:'I2',py:'V2',xu:'I2 (A)',yu:'V2 (V)',xdp:1}],
  record(a){const v=a.P(),R=a.S.phys.last||{},Ip=(a.S.phys.Ip||{}).T1;
   if(!Ip||!isV(a,'V1','T1.H1','T1.H2'))return {msg:'الفولتميتر V1 لا يقيس جهد الابتدائي.'};
   if(!isV(a,'V2','T1.X1','T1.X2'))return {msg:'الفولتميتر V2 لا يقيس جهد الثانوي.'};
   if(abs(R.V1-v.V1n)>0.01*v.V1n)return {msg:'اضبط جهد الابتدائي على الجهد المقنن '+v.V1n+' V (±1%).'};
   if(R.A==null||!same(R.A,Ip.I1))return {msg:'الأميتر لا يقيس تيار الابتدائي.'};
   if(R.W==null||R.W<=0)return {msg:'الواتميتر غير موصّل صحيحاً.'};
   const col=a.sw('SL')?E10.indexOf(Math.round(a.knob('RL'))):0;if(col<0)return {msg:'اضبط الحمل على إحدى قيم الجدول: 100، 80، 60، 50، 40 %.'};
   if(col>0&&(R.A2==null||!same(R.A2,R.IL)))return {msg:'الأميتر A2 لا يقيس تيار الحمل.'};
   return recInto(a,'e10',col,{V1:R.V1,I1:R.A,P1:R.W,V2:R.V2,I2:col?R.A2:0},'الحمل '+pct(E10[col])+': V2 = '+a.fmt(R.V2,1)+' V')}})};

/* ---- التجربة 11: محولان على التوازي ---- */
REG['u3-l4']={title:'توصيل المحولات أحادية الوجه على التوازي',tpOf:TRP,tpId:'u3-tr',tp2:{id:'u3-l4',defs:()=>D3.PARDEF},
 layout:()=>LAY().build({rows:[[['vac'],['tr',{p:'T1',title:'المحول 1'}],['tr',{p:'T2',title:'المحول 2'}],['sw',{k:'K1',title:'المفتاح S1',sub:'يربط الثانويين'}]],
   [['vm',{id:'VA1',ac:true,sub:'V1 — ثانوي المحول 1',ranges:[30,150,300]}],['vm',{id:'V2',ac:true,sub:'V2 — ثانوي المحول 2',ranges:[30,150,300]}],['vm',{id:'V',ac:true,sub:'V — بين طرفي S1',ranges:[30,150,300]}],['sw',{k:'K2',title:'المفتاح S2',sub:'الحمل'}]],
   [['am',{id:'A1',ac:true,sub:'A1 — المحول 1',ranges:[1,5,10]}],['am',{id:'A2',ac:true,sub:'A2 — المحول 2',ranges:[1,5,10]}],['am',{id:'A',ac:true,sub:'A — الحمل',ranges:[1,5,10]}],['rl',{title:'الحمل',sub:'مقاومة ثابتة + متغيرة',min:0,init:100}]]]}),
 exp:L=>Object.assign(trFamily({tr:['T1','T2'],parallel:true}),{swKnob:{SA:'VA'},
  note:'قبل غلق S1 قِس الجهد بين طرفيه: صفر تقريباً = القطبية صحيحة؛ مجموع الجهدين = القطبية معكوسة (بدّل أطراف أحد الثانويين والمصدر مفصول).',
  steps:[
   {t:'وصّل التجربة كما في الشكل (11): الابتدائيان على التوازي على المنبع، وطرفا X2 للثانويين معاً، وطرفا X1 عبر المفتاح S1، والفولتميتر V بين طرفي S1، والحمل عبر S2 والأميتر A، و A1 و A2 في خط كل ثانوي.',done:a=>wired(a,'T1.H1')&&wired(a,'T2.H1')&&wired(a,'K1.a')&&wired(a,'V+')},
   {t:'اضبط المنبع على الجهد المقنن والمفتاحان S1 و S2 مفتوحان، ثم سجّل V1 و V2 و V.',done:a=>(a.S.rec.p11||{})[0]!=null},
   {t:'إذا كان V صغيراً جداً أغلق S1. وإذا كان مجموع الجهدين فافصل المنبع وبدّل أطراف أحد الثانويين ثم أعد القياس.',done:a=>a.sw('K1')&&a.S.phys.ever},
   {t:'أغلق S2 وسجّل A1 و A2 و A عند ثلاث قيم مختلفة للمقاومة المتغيرة.',done:a=>full(a,'l11',[1,2,3])},
   {t:'افتح S2 ثم S1، وأعد الجهد إلى الصفر ثم أطفئ المنبع.',done:a=>full(a,'l11',[1,2,3])&&offAll(a)&&zeroAll(a)}],
  complete:a=>(a.S.rec.p11||{})[0]!=null&&full(a,'l11',[1,2,3])&&offAll(a)&&zeroAll(a),
  tables:[{id:'p11',title:'فحص القطبية — S1 و S2 مفتوحان',xh:'',cols:['قبل S1'],rows:[{k:'V1',h:'V<sub>1</sub> (V)',dp:1},{k:'V2',h:'V<sub>2</sub> (V)',dp:1},{k:'V',h:'V (V)',dp:2}],plot:false},
          {id:'l11',title:'الحمل — S1 و S2 مغلقان',xh:'القراءة',cols:[1,2,3],rows:[{k:'A1',h:'A<sub>1</sub> (A)',dp:2},{k:'A2',h:'A<sub>2</sub> (A)',dp:2},{k:'A',h:'A (A)',dp:2}],plot:false}],
  record(a){const v=a.P(),R=a.S.phys.last||{},Ip=a.S.phys.Ip||{};
   if(!a.sw('SA')||abs((Ip.T1||{}).V1-v.V1n)>0.02*v.V1n)return {msg:'شغّل المنبع على الجهد المقنن '+v.V1n+' V (±2%) والابتدائيان عليه.'};
   if(!a.sw('K1')){if(!isV(a,'VA1','T1.X1','T1.X2')||!isV(a,'V2','T2.X1','T2.X2'))return {msg:'الفولتميتران V1 و V2 يقيسان جهد ثانوي كل محول.'};
     if(!isV(a,'V','K1.a','K1.b'))return {msg:'الفولتميتر V يوصل بين طرفي المفتاح S1.'};
     return recInto(a,'p11',0,{V1:R.VA1,V2:R.V2,V:R.V},'V1 = '+a.fmt(R.VA1,1)+' V، V2 = '+a.fmt(R.V2,1)+' V، V = '+a.fmt(R.V,2)+' V')}
   if(!a.sw('K2')||!a.sw('SL'))return {msg:'أغلق S2 وشغّل الحمل لتسجيل التيارات.'};
   if(R.A==null||!same(R.A,R.IL))return {msg:'الأميتر A لا يقيس تيار الحمل.'};
   if(R.A1==null||!same(R.A1,(Ip.T1||{}).I2)||R.A2==null||!same(R.A2,(Ip.T2||{}).I2))return {msg:'A1 و A2 يوصلان في خط ثانوي كل محول.'};
   const used=Object.values(a.S.rec.l11||{}).map(x=>x.RL);if(used.some(x=>abs(x-a.knob('RL'))<5))return {msg:'غيّر المقاومة المتغيرة إلى قيمة جديدة قبل التسجيل.'};
   const i=[1,2,3].findIndex((_,k)=>(a.S.rec.l11||{})[k]==null);if(i<0)return {msg:'سجّلت القراءات الثلاث.'};
   return recInto(a,'l11',i,{A1:R.A1,A2:R.A2,A:R.A,RL:a.knob('RL')},'القراءة '+(i+1)+': A1 = '+a.fmt(R.A1,2)+'، A2 = '+a.fmt(R.A2,2)+'، A = '+a.fmt(R.A,2)+' A')}})};

/* ---- التجربة 12: محول ثلاثي الأوجه نجمة – دلتا ---- */
const E12=[60,80,100];
REG['u3-l5']={title:'اختبار اللاحمل لمحول ثلاثي الأوجه نجمة – دلتا',tpOf:TRP,tpId:'u3-tr',
 layout:()=>LAY().build({rows:[[['v3'],['wm'],['am',{id:'A',ac:true,sub:'تيار الخط',ranges:[0.5,2.5,5]}],['vm',{id:'VL1',ac:true,sub:'جهد خط الابتدائي',ranges:[150,300,600]}]],
   [['tr',{p:'TA',title:'محول الوجه A'}],['tr',{p:'TB',title:'محول الوجه B'}],['tr',{p:'TC',title:'محول الوجه C'}],['vm',{id:'VL2',ac:true,sub:'جهد خط الثانوي',ranges:[30,150,300]}]]]}),
 exp:L=>Object.assign(trFamily({tr:['TA','TB','TC'],three:true}),{swKnob:{S3:'V3'},
  note:'الابتدائي نجمة: أطراف H2 الثلاثة معاً، وأطراف H1 على الخطوط. الثانوي دلتا: نهاية كل ملف على بداية الذي يليه (X2 للأول على X1 للثاني …). كل ملف مصمم لجهده المقنن.',
  steps:[
   {t:'وصّل الابتدائي نجمة على المصدر (عبر ملف تيار الواتميتر والأميتر في خط L1)، والثانوي دلتا، والفولتميترين على خطي الابتدائي والثانوي.',done:a=>['TA','TB','TC'].every(p=>wired(a,p+'.H1')&&wired(a,p+'.X1'))&&wired(a,'VL1+')&&wired(a,'VL2+')},
   {t:'تأكد أن المصدر على الصفر ثم شغّله.',done:a=>a.S.phys.ever},
   {t:'ارفع جهد الخط وسجّل عند 60% و80% و100% من جهد الخط المقنن للنجمة.',done:a=>full(a,'e12',E12)},
   {t:'أعد الجهد إلى الصفر ثم أطفئ المصدر.',done:a=>full(a,'e12',E12)&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'e12',E12)&&offAll(a)&&zeroAll(a),
  tables:[{id:'e12',title:'نجمة – دلتا بلا حمل',xh:'% من جهد الخط',fx:c=>c+'%',cols:E12,rows:[{k:'VL10',h:'V<sub>L10</sub> (V)',dp:1},{k:'IL10',h:'I<sub>L10</sub> (A)',dp:3},{k:'W',h:'W (W)',dp:1},{k:'VL20',h:'V<sub>L20</sub> (V)',dp:1}],px:'VL10',py:'VL20',xu:'VL10 (V)',yu:'VL20 (V)'}],
  record(a){const v=a.P(),R=a.S.phys.last||{},Ip=a.S.phys.Ip||{};const VLn=SQ3*v.V1n;
   if(R.VL1==null||R.VL2==null)return {msg:'وصّل الفولتميترين على خط الابتدائي وخط الثانوي.'};
   if(!['TA','TB','TC'].every(p=>Ip[p]&&abs(Ip[p].V1-R.VL1/SQ3)<=0.03*R.VL1/SQ3))return {msg:'الابتدائي ليس نجمة متزنة: جهد كل ملف يجب أن يساوي جهد الخط ÷ √3. صل أطراف H2 الثلاثة معاً و H1 على الخطوط.'};
   if(abs(R.VL2-R.VL1/(SQ3*v.a))>0.03*R.VL2)return {msg:'جهد خط الثانوي لا يطابق التوصيل نجمة – دلتا (جهد الخط ÷ (√3 × a)). افحص توصيل الدلتا والفولتميتر.'};
   if(R.A==null)return {msg:'الأميتر غير موصّل في خط L1.'};
   if(R.W==null)return {msg:'الواتميتر غير موصّل.'};
   const i=E12.findIndex(q=>abs(R.VL1-q/100*VLn)<=0.008*VLn);if(i<0)return {msg:'اضبط جهد الخط على '+E12.map(q=>a.fmt(q/100*VLn,1)+' V').join(' أو ')+' (±0.8%).'};
   return recInto(a,'e12',i,{VL10:R.VL1,IL10:R.A,W:R.W,VL20:R.VL2},E12[i]+'%: VL10 = '+a.fmt(R.VL1,1)+' V، VL20 = '+a.fmt(R.VL2,1)+' V')}})};

/* ---- الدرس 1.1: اختيار تدريج جهاز القياس ---- */
const RSET=[8,20,47,120,330];
REG['u1-l1']={title:'التوصيل الصحيح واختيار تدريج جهاز القياس',tpOf:()=>[],tpId:null,
 layout:()=>LAY().build({rows:[[['psu1'],['am',{id:'A',ranges:[0.1,0.3,1,3,10]}],['vm',{id:'V',ranges:[10,30,100,300]}],['res',{p:'RX',title:'مقاومة مجهولة R',sub:'حمل'}]]]}),
 exp:L=>({init:()=>({k:0,R:RSET[2],ever1:false,newR:true}),swKnob:{S1:'V1'},
  note:'القاعدة (ص 5): أقفل مسار التيار على التوالي أولاً (المصدر ثم الأميتر ثم الحمل)، ثم أضف الفولتميتر على التوازي. ابدأ تدريج الأميتر من أعلى قيمة لأنك لا تعرف التيار، ثم انزل إلى أصغر تدريج لا يتجاوزه التيار.',
  onSwitchOn(id,a){if(id==='S1'&&a.S.range.A!==a.maxIdx('A'))a.mistake('range-not-max')},
  onSwitchOff(){},
  actions:[{label:'مقاومة جديدة',run(a){if(a.sw('S1'))return {msg:'أطفئ المصدر قبل تغيير المقاومة.'};const ph=a.S.phys;ph.k=(ph.k+1)%RSET.length;ph.R=RSET[(ph.k*2+1)%RSET.length];return {msg:'غيّرت المقاومة إلى قيمة مجهولة جديدة. ابدأ الأميتر من أعلى تدريج.'}}}],
  tick(a){const ph=a.S.phys,on=a.sw('S1');const els=[{p:'P1+',n:'P1-',g:on?1/RINT:1e-9,i:on?a.knob('V1')/RINT:0},{p:'RX.a',n:'RX.b',g:1/ph.R},{p:'A+',n:'A-',g:1/RAMM},{p:'V+',n:'V-',g:1/RVM}];
   const r=a.solve(els);const Ia=r.cur(els[2]);if(on)ph.ever1=true;
   if(a.hold('af',abs(Ia)>a.maxRange('A')*1.1,0.1))a.mistake('amm-fuse');
   if(a.hold('sh',on&&abs(r.vt('P1+')-r.vt('P1-'))<0.5&&a.knob('V1')>3,0.3))a.mistake('short-1');
   const out={A:wired(a,'A+')&&wired(a,'A-')?Ia:null,V:pair(a,'V+','V-')?r.vt('V+')-r.vt('V-'):null};ph.last=Object.assign({},out,{IR:r.cur(els[1]),VR:r.vt('RX.a')-r.vt('RX.b')});return out},
  steps:[
   {t:'وصّل مسار التيار على التوالي: + المصدر ← الأميتر (+ ثم −) ← المقاومة ← − المصدر.',done:a=>a.conn('P1+','A+')&&a.conn('A-','RX.a')&&a.conn('RX.b','P1-')||a.conn('P1+','A+')&&a.conn('A-','RX.b')&&a.conn('RX.a','P1-')},
   {t:'أضف الفولتميتر على التوازي مع المقاومة (+ جهة الأميتر).',done:a=>pair(a,'V+','V-')&&(a.conn('V+','RX.a')&&a.conn('V-','RX.b')||a.conn('V+','RX.b')&&a.conn('V-','RX.a'))},
   {t:'اختر أعلى تدريج للأميتر (10 A)، ثم شغّل المصدر وهو على الصفر، وارفع الجهد إلى <span class="ltr">24 V</span>.',done:a=>a.S.phys.ever1},
   {t:'انزل بتدريج الأميتر خطوة خطوة إلى أنسب تدريج (أصغر تدريج لا يتجاوزه التيار)، واختر للفولتميتر أنسب تدريج، ثم سجّل.',done:a=>full(a,'m1',[1,2,3])},
   {t:'لكل قراءة جديدة: أطفئ المصدر، واضغط «مقاومة جديدة»، وأعد التدريج إلى الأعلى قبل التشغيل.',done:a=>full(a,'m1',[1,2,3])},
   {t:'أعد المصدر إلى الصفر ثم أطفئه.',done:a=>full(a,'m1',[1,2,3])&&offAll(a)&&zeroAll(a)}],
  complete:a=>full(a,'m1',[1,2,3])&&offAll(a)&&zeroAll(a),
  tables:[{id:'m1',title:'قراءات بالتدريج المناسب — المصدر 24 V',xh:'القراءة',cols:[1,2,3],rows:[{k:'I',h:'I (A)',dp:3},{k:'V',h:'V (V)',dp:2},{k:'rA',h:'تدريج الأميتر (A)',dp:1},{k:'R',h:'R = V/I (Ω)',dp:1}],plot:false}],
  record(a){const R=a.S.phys.last||{};
   if(!a.sw('S1')||abs(a.knob('V1')-24)>0.5)return {msg:'شغّل المصدر واضبطه على 24 V.'};
   if(R.A==null||!same(abs(R.A),abs(R.IR)))return {msg:'الأميتر لا يقيس تيار المقاومة: يوصل على التوالي.'};
   if(R.V==null||!same(abs(R.V),abs(R.VR)))return {msg:'الفولتميتر لا يقيس جهد المقاومة: يوصل على التوازي معها.'};
   const I=abs(R.A),rs=a.ranges('A'),best=rs.find(x=>x>=I*1.0001),cur=a.range('A');
   if(I>cur)return {msg:'القراءة تتجاوز التدريج.'};
   if(cur!==best)return {msg:'هذا التدريج ليس الأنسب: أصغر تدريج لا يتجاوزه التيار هو '+best+' A (المؤشر في النصف الأعلى فتكون القراءة أدق).'};
   const vr=a.ranges('V').find(x=>x>=abs(R.V)*1.0001);if(a.range('V')!==vr)return {msg:'اختر للفولتميتر أنسب تدريج: '+vr+' V.'};
   const prev=Object.values(a.S.rec.m1||{}).map(x=>Math.round(x.R));if(prev.includes(Math.round(abs(R.V)/I)))return {msg:'سجّلت هذه المقاومة من قبل: أطفئ المصدر واضغط «مقاومة جديدة».'};
   const i=[1,2,3].findIndex((_,k)=>(a.S.rec.m1||{})[k]==null);if(i<0)return {msg:'سجّلت القراءات الثلاث.'};
   return recInto(a,'m1',i,{I,V:abs(R.V),rA:cur,R:abs(R.V)/I},'القراءة '+(i+1)+': I = '+a.fmt(I,3)+' A على تدريج '+cur+' A')}})};

/* ===================== الربط بالدروس ===================== */
Object.keys(REG).forEach(id=>{const L=B.LESSONS.find(l=>l.id===id);if(!L)return;const g=REG[id];
 L.bench=el=>{const ly=g.layout();const tpHost=document.createElement('div');
  const defs=g.tpOf?g.tpOf():D.tpDefs(g.tp);const tpId=g.tpOf?g.tpId:D.TPID;
  const P=tpId&&defs.length?B.params(tpHost,tpId,defs,()=>{}):{v:{}};
  let P2=null;const tpHost2=document.createElement('div');if(g.tp2)P2=B.params(tpHost2,g.tp2.id,g.tp2.defs(),()=>{});
  const X=g.exp(L);X.figure=figOf(L);X.figureTitle=figTitleOf(L);X.mistakes=Object.assign({},MZ,X.mistakes||{});
  const api=B.BENCH.mount(el,{key:id,title:'المنضدة الافتراضية: '+g.title,layout:ly,exp:X,params:P,params2:P2,
   intro:'وصّل التجربة بنفسك كما في مخطط التوصيل، وشغّلها بترتيب خطوات الكتاب، وسجّل الجداول. أي خطأ يكشفه المحاكي ويشرح ما كان سيحدث في المعمل. تحصل على «جاهز للمعمل» عندما تكمل التجربة كاملة بلا أي خطأ.'});
  if(tpId&&defs.length){const det=document.createElement('details');det.className='panel bn-tp';det.innerHTML='<summary>قيم المدرب (نفس قيم تبويب المختبر)</summary>';det.appendChild(tpHost);if(P2)det.appendChild(tpHost2);el.querySelector('.bench').appendChild(det)}}});
})(PLCBOOK);
