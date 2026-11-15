/* «المنضدة الافتراضية» — مقرر الرسم الفني الكهربائي: التمديدات المنزلية (الوحدة الثالثة).
   المتدرب يوصّل الدائرة التنفيذية بنفسه على لوحة فيها مصدر وأجزاء حقيقية (مفاتيح، مصابيح، علب تفريع…)، ثم يشغّلها.
   الكهرباء: حل متردد بالأطوار (L1 = 127∠0، L2 = 127∠−120، فيكون L1–L2 = 220 V)، و N موصول بالأرضي PE عند المصدر.
   قرار المنسق: الجهد الحقيقي للدوائر مع توضيح الفرق عن لوحات التدريب منخفضة الجهد. */
(function(B){
if(!B.BENCH||!window.BENCH_LAYOUTS||!BENCH_LAYOUTS.inst)return;
const C=B.BENCH.C,abs=Math.abs;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const VPH=127,RSRC=0.05,IMAX=25;
const PH={L1:C.pol(VPH,0),L2:C.pol(VPH,-120)};
const NOTE='<b>عن الجهد:</b> أشكال الكتاب على شبكة 127/220 فولت القديمة: بين الطور والصفر (L1–N) 127 V، وبين طورين (L1–L2) 220 V. الشبكة في المملكة اليوم 230/400 V (نحو 220 V بين الطور والصفر). '+
 'المحاكي يعمل بجهد الكتاب الحقيقي حتى تظهر أخطاء السلامة كما هي (قصر، مفتاح على الصفر، جرس منخفض الجهد على الشبكة). بعض لوحات التدريب في المعامل تعمل بجهد منخفض (مثل 24 V) فلا يكون لمسها خطراً، لكن التوصيل نفسه واحد.';
const MZ={
 'short':{t:'قصر في الدائرة',why:'طرفان من المصدر (طور مع صفر، أو طوران، أو طور مع الأرضي) اتصلا بلا حمل بينهما، ففصل القاطع. في المعمل قد يحترق السلك أو تحدث شرارة. راجع التوصيل: كل حمل بين طرفين، والمفتاح في مسار الحمل لا بين طرفي المصدر.',fatal:true,off:['QS']},
 'overvolt':{t:'جهاز على جهد أعلى من جهده',why:'وصلت الجهاز على جهد أكبر من جهده المقنن فاحترق (مثل جرس 8 V على الشبكة، أو مصباحين على التوالي ثم قصر أحدهما). اقرأ جهد الجهاز المكتوب عليه.',fatal:true,off:['QS']},
 'sw-neutral':{t:'المفتاح على الصفر بدل الطور',why:'المصباح مطفأ لكن طرفه ما زال عليه جهد من الطور، لأن المفتاح يقطع الصفر N. من يغيّر المصباح يتعرض لصدمة. المفتاح يقطع الطور L دائماً، والصفر يذهب إلى الحمل مباشرة.'},
 'no-ballast':{t:'الأنبوبة على الشبكة بلا ملف خانق',why:'الأنبوبة لا تُوصل على الجهد مباشرة: الملف الخانق يحدد تيارها ويولّد دفعة الإشعال. بدونه يمر تيار كبير في الفتيلتين فتحترقان.',fatal:true,off:['QS']},
 'single-phase':{t:'المحرك يعمل على وجهين فقط',why:'أحد أطراف المحرك الثلاثي بلا جهد (سلك ناقص أو مصهر محترق)، فيطنّ المحرك ولا يقلع ويسخن. كل محرك ثلاثي يحتاج الأوجه الثلاثة.'},
 'dc-start':{t:'بدأت المحرك بلا مقاومة البدء',why:'عند السكون لا توجد قوة دافعة عكسية، فتيار المنتج = الجهد ÷ مقاومة المنتج الصغيرة (أضعاف التيار المقنن). ابدأ ومقاومة البدء على أكبر قيمة، ثم أنقصها كلما زادت السرعة.'},
 'dc-runaway':{t:'المجال مفصول والمنتج تحت الجهد',why:'محرك التوازي بلا مجال (أو بمجال ضعيف جداً) تزيد سرعته بلا حد. ملف المجال يوصل مباشرة على الجهد، ومنظم المجال يبدأ من الصفر (أقوى مجال)، ولا يُفصل المجال أثناء الدوران.',fatal:true,off:['QS']},
 'unbalanced':{t:'المحرك موصّل بشكل غير متزن',why:'ملفات المحرك لا تأخذ جهوداً متساوية (ملف معكوس في المثلث، أو وجه ناقص، أو نجمة غير مكتملة). المحرك يطنّ ويسخن ولا يدور كما يجب. قارن بلوحة الأطراف في الكتاب.',fatal:true,off:['QS']},
 'dol-delta':{t:'بدأت المحرك على المثلث مباشرة',why:'البدء على المثلث يسحب تياراً كبيراً (5 إلى 7 أضعاف المقنن). مفتاح نجمة/مثلث يبدأ على النجمة (ثلث التيار)، وبعد أن يقترب المحرك من سرعته يُنقل إلى المثلث.'},
 'start-no-res':{t:'بدأت والمقاومات مقصورة',why:'مقاومات العضو الساكن تُترك في الدائرة عند البدء لتخفض الجهد والتيار، وتُقصر بعد أن ترتفع السرعة.'},
 'rotor-short-start':{t:'بدأت والبادئ على آخر وضع',why:'بادئ العضو الدوار يبدأ من الوضع 1 (كل المقاومة) فيقل تيار البدء ويزيد عزمه، ثم يُنقل خطوة خطوة حتى تقصر الحلقات.'},
 'rotor-open':{t:'دائرة العضو الدوار مفتوحة',why:'حلقات الانزلاق K L M غير موصولة بالبادئ، فلا يمر تيار في العضو الدوار ولا يتولد عزم: المحرك يطنّ ولا يدور.'},
 'plugging':{t:'عكست الاتجاه والمحرك يدور',why:'عكس الاتجاه أثناء الدوران يقلب المجال فجأة فيمر تيار كبير ويتعرض المحور لصدمة. أوقف المحرك أولاً ثم اعكس.'},
 'live-touch':{t:'لمست بالقياس جسم جهاز موصول بالطور',why:''}
};
/* ---- مكونات الحل ---- */
function build(a,ex,ph){const v=ex.parts,els=[],idx={};const on=a.sw('QS');
 const vph=ex.vph||VPH,PHX={L1:C.pol(vph,0),L2:C.pol(vph,-120),L3:C.pol(vph,120)};
 const src=c=>({p:c+'.0',n:'N.0',y:on?[1/RSRC,0]:[1e-9,0],i:on?C.div(PHX[c],[RSRC,0]):[0,0]});
 let S1,S2,S3=null;
 if(ex.dc){S1={p:'P.0',n:'M.0',y:on?[1/RSRC,0]:[1e-9,0],i:on?[(ex.vdc||220)/RSRC,0]:[0,0]};S2=S1;els.push(S1)}
 else{S1=src('L1');S2=src('L2');els.push(S1,S2);if((ex.conds||[]).includes('L3')){S3=src('L3');els.push(S3)}if(!ex.conds||ex.conds.includes('PE'))els.push({p:'N.0',n:'PE.0',y:[1/RSRC,0]})}
 const R=(vr,P)=>vr*vr/P,G=r=>[1/r,0],CL=[1e3,0];
 v.forEach(p=>{const id=p.id,sw=k=>!!a.S.sw[k];
  if(p.kind==='lamp'){const e={p:id+'.L',n:id+'.N',y:ph.burnt[id]?[1e-9,0]:G(R(p.v,60))};els.push(e);idx[id]=e}
  else if(p.kind==='bell'){const e={p:id+'.1',n:id+'.2',y:ph.burnt[id]?[1e-9,0]:G(R(p.v,10))};els.push(e);idx[id]=e}
  else if(p.kind==='sw'){if(sw('SW:'+id))els.push({p:id+'.L',n:id+'.1',y:CL})}
  else if(p.kind==='sw2'){if(sw('SW:'+id+':1'))els.push({p:id+'.L',n:id+'.1',y:CL});if(sw('SW:'+id+':2'))els.push({p:id+'.L',n:id+'.2',y:CL})}
  else if(p.kind==='tw')els.push({p:id+'.C',n:id+(sw('SW:'+id)?'.2':'.1'),y:CL});
  else if(p.kind==='im'){if(sw('SW:'+id))els.push({p:id+'.1',n:id+'.4',y:CL},{p:id+'.2',n:id+'.3',y:CL});else els.push({p:id+'.1',n:id+'.3',y:CL},{p:id+'.2',n:id+'.4',y:CL})}
  else if(p.kind==='pb'){if(sw('SW:'+id))els.push({p:id+'.1',n:id+'.2',y:CL})}
  else if(p.kind==='fuse'){const e={p:id+'.1',n:id+'.2',y:ph.blown&&ph.blown[id]?[1e-9,0]:CL};els.push(e);if(p.A)idx[id]=[e]}
  else if(p.kind==='meter'){const e={p:id+'.M',n:id+'.F',y:[100,0]};els.push(e);idx[id]=e}
  else if(p.kind==='xf'){const a2=p.vp/p.vs,Z=[2,1],yz=C.div([1,0],Z),Ym=[1/20000,0];
   els.push({p:[id+'.P1',id+'.P2'],q:[id+'.S1',id+'.S2'],Y:[[C.add(yz,Ym),C.mul([-a2,0],yz)],[C.mul([-a2,0],yz),C.mul([a2*a2,0],yz)]]});idx[id]=id}
  else if(p.kind==='ks'){const e={p:id+'.A1',n:id+'.A2',y:G(R(p.v||220,5))};els.push(e);idx[id]=e;if(ph.ks[id])els.push({p:id+'.1',n:id+'.2',y:CL})}
  else if(p.kind==='qs3'){if(sw('SW:'+id))(p.n?['L1','L2','L3','N']:['L1','L2','L3']).forEach(c=>els.push({p:id+'.'+c+'i',n:id+'.'+c+'o',y:CL}))}
  else if(p.kind==='mcb'){const e={p:id+'.i',n:id+'.o',y:sw('SW:'+id)?CL:[1e-9,0]};els.push(e);idx[id]=[e]}
  else if(p.kind==='mcb3'||p.kind==='fuse3'){const cl=p.kind==='mcb3'?sw('SW:'+id):!ph.blown[id];idx[id]=[1,2,3].map(k=>{const e={p:id+'.'+k+'i',n:id+'.'+k+'o',y:cl?CL:[1e-9,0]};els.push(e);return e})}
  else if(p.kind==='fuse'&&p.A){}
  else if(p.kind==='mot3'){const vl=(ex.vph||VPH)*Math.sqrt(3),Zr=vl*vl/(p.P*1000)*0.8*3,sp=Math.min(1,(ph.sp[id]||0)),Z=[Zr*(0.12+0.88*sp)*0.5,Zr*(0.12+0.88*sp)*0.85],f=ph.fault[id]?[1e3,0]:(p.ctl&&!sw('SW:'+id))?[1e-9,0]:C.div([1,0],Z);
   idx[id]=[['U','V'],['V','W'],['W','U']].map(([x,y2])=>{const e={p:id+'.'+x,n:id+'.'+y2,y:f};els.push(e);return e})}
  else if(p.kind==='heat'){const vr=p.three?(ex.vph||VPH)*Math.sqrt(3):(ex.vph||VPH),g=ph.fault[id]?[1e3,0]:(p.ctl&&!sw('SW:'+id))?[1e-9,0]:[p.P*1000/(p.three?3:1)/(vr*vr),0];
   idx[id]=(p.three?[['U','V'],['V','W'],['W','U']]:[['L','N']]).map(([x,y2])=>{const e={p:id+'.'+x,n:id+'.'+y2,y:g};els.push(e);return e})}
  else if(p.kind==='sock'){const vr=ex.vph||VPH,g=ph.fault[id]?[1e3,0]:sw('SW:'+id)?[p.P*1000/(vr*vr),0]:[1e-9,0];const e={p:id+'.L',n:id+'.N',y:g};els.push(e);idx[id]=[e]}
  else if(p.kind==='rh'){els.push({p:id+'.1',n:id+'.2',y:[1/Math.max(a.knob('K:'+id),0.05),0]})}
  else if(p.kind==='dcm'){const kphi=ph.kphi||0,Ra=p.Ra||1;const ea={p:id+'.A1',n:id+'.A2',y:[1/Ra,0],i:[kphi*(ph.n||0)/Ra,0]},ef={p:id+'.E1',n:id+'.E2',y:[1/(p.Rf||220),0]};els.push(ea,ef);idx[id]={ea,ef}}
  else if(p.kind==='yd'){const k=Math.round(a.knob('K:'+id));if(k===1){[['L1','U1'],['L2','V1'],['L3','W1'],['U2','V2'],['V2','W2']].forEach(([x,y2])=>els.push({p:id+'.'+x,n:id+'.'+y2,y:CL}))}
   if(k===2){[['L1','U1'],['L1','W2'],['L2','V1'],['L2','U2'],['L3','W1'],['L3','V2']].forEach(([x,y2])=>els.push({p:id+'.'+x,n:id+'.'+y2,y:CL}))}}
  else if(p.kind==='rs3'){const sh=sw('SW:'+id);[1,2,3].forEach(k=>els.push({p:id+'.'+k+'i',n:id+'.'+k+'o',y:sh?CL:[1/(p.R||20),0]}))}
  else if(p.kind==='im3'||p.kind==='wrm'){const Zn=p.Zn||101,sp=Math.min(1,Math.abs(ph.sp[id]||0)),rext=p.kind==='wrm'?(ph.rext||0):0;
   const Zm=Zn*(0.17+0.83*sp)+rext*Zn*0.25,Z=[Zm*(sp>0.5?0.85:0.3),Zm*(sp>0.5?0.5:0.95)];const y=C.div([1,0],Z);
   idx[id]=(p.kind==='im3'?[['U1','U2'],['V1','V2'],['W1','W2']]:[['U','__s'],['V','__s'],['W','__s']]).map(([x,y2])=>{const e={p:id+'.'+x,n:y2==='__s'?id+'.U':id+'.'+y2,y};return e});
   if(p.kind==='im3')idx[id].forEach(e=>els.push(e));else{/* حلقات الانزلاق: العضو الساكن نجمة داخلية — نمثله بمثلث مكافئ */idx[id]=[['U','V'],['V','W'],['W','U']].map(([x,y2])=>{const e={p:id+'.'+x,n:id+'.'+y2,y:C.mul([1/3,0],y)};els.push(e);return e})}}
  else if(p.kind==='tmr'){const e={p:id+'.1',n:id+'.7',y:G(R(p.v||220,5))};els.push(e);idx[id]=e;if((ph.tm[id]||0)>0)els.push({p:id+'.2',n:id+'.3',y:CL})}
 });
 /* الفلورسنت: الملف الخانق والبادئ والأنبوبة تُفحص بالمسار (كما في الكتاب) لا بالحل */
 return {els,idx,S1,S2,S3}}
function mag(x){return C.abs(x)}
/* ---- محرك التيار المستمر التوازي (الوحدة السادسة) — قيم توضيحية ---- */
function dcTick(a,ph,p,r,E,res,on){const Ia=mag(r.cur(E.ea))*Math.sign(r.cur(E.ea)[0]||1),If=r.cur(E.ef)[0];
 const x=Math.abs(If),phi=Math.sign(If||1)*(0.03+0.97*Math.pow(Math.min(x,1.3),0.6));ph.kphi=0.1467*phi;
 const T=ph.kphi*Ia*60/(2*Math.PI),TL=(p.TL||4)*Math.sign(ph.n||T||1)*Math.min(1,Math.abs(ph.n)/50),b=0.0015*ph.n;
 const n0=ph.n;ph.n+=(T-TL-b)*60/(2*Math.PI*0.25)*a.dt;if(Math.abs(ph.n)<5&&Math.abs(T)<(p.TL||4)){ph.n=0}
 ph.Ia=Ia;ph.If=If;ph.peak=Math.max(ph.peak||0,Math.abs(Ia));
 const Va=mag(r.vd(p.id+'.A1',p.id+'.A2'));
 if(a.hold('nof',on&&Va>50&&Math.abs(If)<0.05,0.5))a.mistake('dc-runaway');
 else if(Math.abs(n0)<200&&on&&Math.abs(Ia)>25&&Math.abs(If)>=0.05)a.once('dc-start');
 if(a.hold('rw',on&&Math.abs(ph.n)>2600,0.2))a.mistake('dc-runaway');
 if(Math.abs(ph.n)>1300)(ph.dirs=ph.dirs||{})[ph.n>0?'f':'r']=1;ph.maxN=Math.max(ph.maxN||0,Math.abs(ph.n));
 if(Math.abs(ph.n)>1300&&a.knob('K:RS')<0.5)(ph.dirs=ph.dirs||{}).full=1;
 res['ld:'+p.id]=Math.abs(ph.n)>50}
/* ---- المحرك الحثي (الوحدة السادسة) — نموذج توضيحي بالجهد على الملفات وتتابع الأوجه ---- */
function imTick(a,ph,p,r,es,res,on,P){const A=C.pol(1,120),A2=C.pol(1,240);const Vw=es.map(e=>r.vd(e.p,e.n));
 const Vp=C.mul([1/3,0],C.add(C.add(Vw[0],C.mul(A,Vw[1])),C.mul(A2,Vw[2]))),Vn=C.mul([1/3,0],C.add(C.add(Vw[0],C.mul(A2,Vw[1])),C.mul(A,Vw[2])));
 const mp=mag(Vp),mn=mag(Vn),Vm=Vw.map(mag),vr=p.kind==='wrm'?380:380,big=Math.max(...Vm);
 const dir=mp>=mn?1:-1,bal=Math.max(mp,mn)>0?Math.min(mp,mn)/Math.max(mp,mn):1;
 if(a.hold('unb',on&&big>0.3*vr&&bal>0.25,0.5))a.mistake('unbalanced');
 /* العضو الدوار */
 let rext=0,open=false;if(p.kind==='wrm'){const st=P.find(q=>q.kind==='rst');const nt=a.nets().of;const ok=st&&['K','L','M'].every(c=>nt[p.id+'.'+c]===nt[st.id+'.'+c]);
  if(!ok)open=true;else rext=4-Math.round(a.knob('K:'+st.id));ph.rext=rext}
 const drive=on&&big>0.2*vr&&bal<=0.25&&!open,lvl=Math.max(mp,mn)/380;
 if(open&&a.hold('ro',on&&big>0.3*vr,0.8))a.once('rotor-open');
 const sp=ph.sp[p.id]||0;
 if(drive){const acc=1.2*lvl*lvl*(p.kind==='wrm'?(1+0.5*Math.min(rext,3)):1);const tgt=dir*(0.97-(p.kind==='wrm'?0.08*rext:0));
  if(sp*dir<-0.2)a.once('plugging');ph.sp[p.id]=sp+(tgt-sp)*Math.min(1,acc*a.dt)}
 else ph.sp[p.id]=sp*(1-Math.min(1,0.35*a.dt));
 const run=Math.abs(ph.sp[p.id])>0.85;
 /* تيار الخط وبداية التشغيل */
 const In=p.In||6.5,I=ph.Is||0;if(Math.abs(sp)<0.3&&drive)ph.peak=Math.max(ph.peak||0,I);
 if(drive&&Math.abs(sp)<0.3){const yd=P.find(q=>q.kind==='yd');if(yd&&Vm.every(v=>v>0.8*vr))a.once('dol-delta');
  const rs=P.find(q=>q.kind==='rs3');if(rs&&a.sw('SW:'+rs.id))a.once('start-no-res');
  if(p.kind==='wrm'&&rext===0&&Math.abs(sp)<0.1)a.once('rotor-short-start')}
 const M=(ph.modes=ph.modes||{});
 if(drive&&Math.abs(sp)<0.3){const rs=P.find(q=>q.kind==='rs3');if(rs&&!a.sw('SW:'+rs.id))M.resStart=1;if(Vm.every(v=>v>0.45*vr&&v<0.7*vr))M.yStart=1;if(p.kind==='wrm'&&rext===3)M.s1=1}
 if(run){if(Vm.every(v=>v>0.8*vr))M.D=1;if(Vm.every(v=>v>0.45*vr&&v<0.7*vr))M.Y=1;M[dir>0?'fwd':'rev']=1;const rs=P.find(q=>q.kind==='rs3');if(rs&&a.sw('SW:'+rs.id))M.shorted=1;if(p.kind==='wrm')M['r'+rext]=1}
 if(p.kind==='wrm'&&drive)M['st'+rext]=1;
 ph.on[p.id]=run?2:0;res['ld:'+p.id]=Math.abs(ph.sp[p.id])>0.05;ph.dirNow=dir}
/* ---- التجربة ---- */
function exp(L,ex){const P=ex.parts;
 const X={powerSw:['QS'],mistakes:MZ,note:ex.note||NOTE,
  figure:()=>ex.fig?ex.fig():'',figureTitle:'الدائرة التنفيذية في الكتاب — الشكل '+(ex.figNo||''),
  init:()=>({burnt:{},ks:{},kPrev:{},tm:{},t:0,on:{},seen:{},cnt:{},flips:{},everQS:false,ph:'off',pt:0,energy:0,blown:{},trip:{},fault:{},sp:{},dir:{},n:0,kphi:0,peak:0,rext:0})};
 const parts=k=>P.filter(p=>p.kind===k);
 X.tick=a=>{const ph=a.S.phys,on=a.sw('QS');ph.t+=a.dt;if(on)ph.everQS=true;
  const {els,idx,S1,S2,S3}=build(a,ex,ph);const r=a.solveAC(els);
  const Is=Math.max(...[S1,S2,S3].filter(Boolean).map(e=>mag(r.cur(e))));ph.Is=Is;
  /* أجهزة الحماية: القاطع يفصل عند 5 أضعاف تياره فوراً أو 1.45 ضعف بعد ثانية؛ المصهر يحترق ويحتاج استبدالاً */
  let protTripped=false;P.forEach(p=>{if(!(['mcb','mcb3','fuse3'].includes(p.kind)||(p.kind==='fuse'&&p.A))||!idx[p.id])return;const I=Math.max(...idx[p.id].map(e=>mag(r.cur(e))));
   const inst=a.hold('pi'+p.id,I>5*p.A,0.02),ov=a.hold('po'+p.id,I>1.45*p.A,4);
   if(inst||ov){protTripped=true;ph.tripN=(ph.tripN||0)+1;(ph.trips=ph.trips||{})[p.id]=1;if(p.kind==='fuse3'||p.kind==='fuse'){ph.blown[p.id]=1}else{a.setSw('SW:'+p.id,false)}ph.lastTrip=p.id}});
  if(!protTripped&&a.hold('sc',on&&Is>(ex.imax||IMAX),ex.imax?0.2:0.05)&&!Object.values(ph.fault).some(Boolean))a.mistake('short');
  else if(on&&Is>(ex.imax||IMAX)*1.5&&Object.values(ph.fault).some(Boolean)&&a.hold('sc2',true,0.3))a.setSw('QS',false);
  const res={qs:on};const V=t=>mag(r.vt(t)),Vd=(x,y)=>mag(r.vd(x,y));
  P.forEach(p=>{const id=p.id;
   if(p.kind==='lamp'||p.kind==='bell'){const u=Vd(p.kind==='lamp'?id+'.L':id+'.1',p.kind==='lamp'?id+'.N':id+'.2')/p.v;
    if(a.hold('ov'+id,on&&u>1.3,0.15)){ph.burnt[id]=1;a.mistake('overvolt',{t:'احترق '+(p.kind==='bell'?'الجرس':'المصباح '+(p.lbl||id))+': '+Math.round(u*p.v)+' V على جهاز '+p.v+' V'})}
    const st=ph.burnt[id]?0:u>=0.8?2:u>=0.25?1:0;ph.on[id]=st;res['ld:'+id]=st>0;
    if(ex.neutral&&on&&st===0&&!ph.burnt[id]){const tv=p.kind==='lamp'?[id+'.L',id+'.N']:[id+'.1',id+'.2'];if(a.hold('swn'+id,tv.some(t=>V(t)>40),0.3))a.once('sw-neutral')}}
   if(p.kind==='meter'){const I=mag(r.cur(idx[id]));const run=on&&I>0.05&&V(id+'.R')>40;res['ld:'+id]=run&&(Math.floor(ph.t*4)%2===0);if(run)ph.energy+=I*a.dt;ph.on[id]=run?2:0}
   if(p.kind==='ks'){const k=mag(r.vd(id+'.A1',id+'.A2'))>0.6*(p.v||220);if(k&&!ph.kPrev[id]){ph.ks[id]=!ph.ks[id];ph.flips[id]=(ph.flips[id]||0)+1}ph.kPrev[id]=k;res['ld:'+id]=!!ph.ks[id]}
   if(p.kind==='tmr'){const k=mag(r.vd(id+'.1',id+'.7'))>0.6*(p.v||220);if(k){if(!ph.kPrev[id])ph.starts=(ph.starts||0)+1;ph.tm[id]=ex.T||10}else if((ph.tm[id]||0)>0){ph.tm[id]=Math.max(0,ph.tm[id]-a.dt);if(!ph.tm[id])ph.offs=(ph.offs||0)+1}ph.kPrev[id]=k;res['ld:'+id]=(ph.tm[id]||0)>0}
  });
  P.forEach(p=>{const id=p.id;
   if(p.kind==='mot3'||p.kind==='heat'||p.kind==='sock'){const es=idx[id]||[];const V3=es.map(e=>mag(r.vd(e.p,e.n)));const vr=p.three||p.kind==='mot3'?(ex.vph||VPH)*Math.sqrt(3):(ex.vph||VPH);
    const okV=V3.length&&V3.every(v=>v>0.8*vr);const part=V3.some(v=>v>0.3*vr)&&!okV;
    if(p.kind==='mot3'){const want=!p.ctl||a.sw('SW:'+id);if(a.hold('sp1'+id,want&&on&&part,1))a.once('single-phase');ph.sp[id]=okV&&want?Math.min(1,(ph.sp[id]||0)+a.dt/2):Math.max(0,(ph.sp[id]||0)-a.dt/3)}
    ph.on[id]=okV&&(!(p.kind==='sock'||p.ctl)||a.sw('SW:'+id))&&!ph.fault[id]?2:0;res['ld:'+id]=ph.on[id]===2;if(ph.on[id])(ph.ran=ph.ran||{})[id]=1}
   if(['mcb','mcb3','fuse3'].includes(p.kind)||(p.kind==='fuse'&&p.A))res['tr:'+id]=p.kind==='fuse3'||p.kind==='fuse'?!!ph.blown[id]:!!(ph.trips||{})[id]&&!a.sw('SW:'+id);
   if(p.kind==='dcm')dcTick(a,ph,p,r,idx[id],res,on);
   if(p.kind==='im3'||p.kind==='wrm')imTick(a,ph,p,r,idx[id],res,on,P);
  });
  /* الفلورسنت بالمسار */
  const tube=P.find(p=>p.kind==='tube');if(tube){const bal=P.find(p=>p.kind==='bal'),st=P.find(p=>p.kind==='st');
   const nt=a.nets().of;const rt=r;const live=t=>on&&V(t)>40,zero=t=>mag(rt.vt(t))<10&&nt[t]===nt['N.0'];
   const sameNet=(x,y)=>nt[x]===nt[y];const A=[tube.id+'.a1',tube.id+'.a2'],Bp=[tube.id+'.b1',tube.id+'.b2'];
   /* هل وصل طور مباشرة إلى طرف الأنبوبة (بلا ملف خانق)؟ */
   const direct=[...A,...Bp].some(t=>on&&V(t)>40&&!sameNet(t,bal.id+'.1')&&!sameNet(t,bal.id+'.2'))&&!sameNet(A[0],A[1])&&false;
   let ok=false;
   for(const [X1,X2] of [[A,Bp],[Bp,A]])for(const i of [0,1])for(const j of [0,1])for(const bend of [[bal.id+'.1',bal.id+'.2'],[bal.id+'.2',bal.id+'.1']]){
     const fIn=X1[i],fOut=X1[1-i],gIn=X2[j],gOut=X2[1-j];
     const balOK=sameNet(bend[1],fIn)&&live(bend[0]);const stOK=(sameNet(st.id+'.1',fOut)&&sameNet(st.id+'.2',gIn))||(sameNet(st.id+'.2',fOut)&&sameNet(st.id+'.1',gIn));
     const ret=nt[gOut]===nt['N.0']||nt[gOut]===nt['PE.0'];if(balOK&&stOK&&ret)ok=true}
   const raw=on&&!ok&&[...A,...Bp].some(t=>V(t)>60&&!sameNet(t,bal.id+'.1')&&!sameNet(t,bal.id+'.2'));
   if(a.hold('nb',raw,0.2))a.mistake('no-ballast');
   if(!ok||!on){ph.ph='off';ph.pt=0}else{ph.pt+=a.dt;if(ph.ph==='off'){ph.ph='glow';ph.pt=0}else if(ph.ph==='glow'&&ph.pt>1){ph.ph='pre';ph.pt=0}else if(ph.ph==='pre'&&ph.pt>1.6){ph.ph='lit';ph.pt=0;ph.litOnce=1}}
   res['ld:'+st.id]=ph.ph==='glow'||ph.ph==='pre';res['ld:'+tube.id]=ph.ph==='lit';ph.on[tube.id]=ph.ph==='lit'?2:0}
  /* تتبع التشغيل: كل مفتاح غيّر حالة الحمل الرئيسي */
  const key=ex.watch?ex.watch.map(id=>ph.on[id]||0).join(''):'';
  Object.keys(a.S.sw).filter(k=>/^SW:/.test(k)).forEach(k=>{const v=!!a.S.sw[k];if(ph.lastSw&&ph.lastSw[k]!==undefined&&ph.lastSw[k]!==v){ph.pend={k,from:ph.lastKey,t:ph.t}}});
  if(ph.pend&&ph.t-ph.pend.t>0.3){if(key!==ph.pend.from)ph.cnt[ph.pend.k]=(ph.cnt[ph.pend.k]||0)+1;ph.pend=null}
  ph.lastSw=Object.assign({},a.S.sw);if(!ph.pend)ph.lastKey=key;
  (ex.track||(()=>{}))(a,ph);
  return res};
 X.steps=[{t:'وصّل الدائرة كما في الدائرة التنفيذية للشكل '+(ex.figNo||'')+' (زر «مخطط التوصيل»)، ثم أغلق القاطع الرئيسي. استعمل علب التفريع لعقد التوصيل.',done:a=>a.S.phys.everQS&&ex.goals.length&&ex.goals[0].done(a)}]
  .concat(ex.goals).concat([{t:'افتح القاطع الرئيسي.',done:a=>ex.goals.every(g=>g.done(a))&&!a.sw('QS')}]);
 X.complete=a=>X.steps.every(s=>s.done(a));
 const FL=P.filter(p=>p.fault);
 X.view={title:'ما يحدث في الدائرة',mount(el,a){el.innerHTML='<div data-st class="sub"></div>'+(FL.length?`<hr><p class="sub"><b>اختبار الحماية:</b> أحدث قصراً داخل حمل وشاهد أي جهاز حماية يفصل.</p><label class="sub">الحمل: <select data-fsel>${FL.map(p=>`<option value="${p.id}">${esc(p.lbl)}</option>`).join('')}</select></label> <button class="btn warn" data-fon>أحدث قصراً</button> <button class="btn" data-foff>أزل العطل</button>`+(P.some(p=>p.kind==='fuse3'||(p.kind==='fuse'&&p.A))?` <button class="btn" data-frep>استبدل المصهر المحترق</button>`:'')+'<p class="sub" data-fmsg></p>':'');
  const m=()=>el.querySelector('[data-fmsg]');const fs=el.querySelector('[data-fsel]');
  if(fs){el.querySelector('[data-fon]').onclick=()=>{a.S.phys.fault[fs.value]=1;a.S.phys.faultEver=(a.S.phys.faultEver||0)+1;m().textContent='أحدثت قصراً في '+fs.selectedOptions[0].textContent+'.'};
   el.querySelector('[data-foff]').onclick=()=>{a.S.phys.fault={};m().textContent='أزلت العطل. أعد تشغيل جهاز الحماية الذي فصل.'};
   const rp=el.querySelector('[data-frep]');if(rp)rp.onclick=()=>{if(a.sw('QS')){m().textContent='افتح المفتاح الرئيسي قبل استبدال المصهر.';return}const b=Object.keys(a.S.phys.blown).filter(k=>a.S.phys.blown[k]);if(!b.length){m().textContent='لا يوجد مصهر محترق.';return}b.forEach(k=>a.S.phys.blown[k]=0);a.S.phys.replaced=1;m().textContent='استبدلت المصهر.'}}},frame(el,a){const ph=a.S.phys;if(!el||(ph.vt=(ph.vt||0)+a.dt)<0.25)return;ph.vt=0;
  const e=el.querySelector('[data-st]');if(!e)return;e.innerHTML=(ex.say?ex.say(a,ph):'')+(ex.T&&P.some(p=>p.kind==='tmr')?`<p>المتبقي في المزمن: <b class="ltr">${Math.ceil(Object.values(ph.tm)[0]||0)} s</b></p>`:'')+(P.some(p=>p.kind==='dcm')?`<p>السرعة: <b class="ltr">${Math.round(ph.n)} rpm</b> — تيار المنتج: <b class="ltr">${(ph.Ia||0).toFixed(1)} A</b> — تيار المجال: <b class="ltr">${(ph.If||0).toFixed(2)} A</b> — أكبر تيار عند البدء: <b class="ltr">${(ph.peak||0).toFixed(0)} A</b></p>`:'')+(P.some(p=>p.kind==='im3'||p.kind==='wrm')?`<p>السرعة: <b class="ltr">${Math.round(Math.abs(Object.values(ph.sp)[0]||0)*1450)} rpm</b> ${ph.dirNow<0?'(الاتجاه المعاكس)':''} — تيار الخط: <b class="ltr">${(ph.Is||0).toFixed(1)} A</b> — أكبر تيار عند البدء: <b class="ltr">${(ph.peak||0).toFixed(1)} A</b></p>`:'')+(P.some(p=>p.kind==='bus')?`<p>${P.filter(p=>['mcb','mcb3','fuse3'].includes(p.kind)||(p.kind==='fuse'&&p.A)).map(p=>`${esc(p.lbl)}: ${p.kind==='fuse3'||p.kind==='fuse'?(ph.blown[p.id]?'<b style="color:#c8382e">محترق</b>':'سليم'):(a.sw('SW:'+p.id)?'موصول':'<b>مفصول</b>')}`).join(' — ')}</p>`:'')+(P.some(p=>p.kind==='meter')?`<p>الطاقة التي سجّلها العداد: <b class="ltr">${(ph.energy*VPH/3600).toFixed(2)} Wh</b></p>`:'')}};
 return X}
/* ---- التجارب ---- */
const on=(a,id)=>(a.S.phys.on[id]||0)===2,dim=(a,id)=>(a.S.phys.on[id]||0)===1;
const mark=(a,k)=>a.S.phys.seen[k]=1,seen=(a,k)=>!!a.S.phys.seen[k];
const cnt=(a,k)=>a.S.phys.cnt[k]||0;
const jb=(id,lbl)=>({kind:'jb',id,lbl:lbl||'علبة التفريع'});
const EX={
 f31:{name:'مصباح بمفتاح مفرد',figNo:'(3-1) ب',parts:[{kind:'sw',id:'S1',lbl:'S1'},{kind:'lamp',id:'E1',lbl:'E1',v:220},jb('J1')],watch:['E1'],
  goals:[{t:'شغّل S1: يضيء المصباح.',done:a=>seen(a,'on')},{t:'أطفئ S1: ينطفئ المصباح.',done:a=>seen(a,'off')}],
  track:(a,ph)=>{if(on(a,'E1')&&a.sw('SW:S1'))mark(a,'on');if(seen(a,'on')&&!on(a,'E1')&&!a.sw('SW:S1')&&a.sw('QS'))mark(a,'off')}},
 f32:{name:'مفتاح مزدوج',figNo:'(3-2) ب',parts:[{kind:'sw2',id:'S',lbl:'S1 / S2'},{kind:'lamp',id:'E1',lbl:'E1',v:220},{kind:'lamp',id:'E2',lbl:'E2',v:220},jb('J1')],watch:['E1','E2'],
  goals:[{t:'شغّل الذراع الأولى فقط: يضيء E1 وحده.',done:a=>seen(a,'a')},{t:'شغّل الذراع الثانية فقط: يضيء E2 وحده.',done:a=>seen(a,'b')},{t:'شغّل الذراعين: يضيء المصباحان.',done:a=>seen(a,'ab')}],
  track:(a)=>{const e1=on(a,'E1'),e2=on(a,'E2');if(e1&&!e2)mark(a,'a');if(e2&&!e1)mark(a,'b');if(e1&&e2)mark(a,'ab')}},
 f33:{name:'مصباحان على التوازي مع الأرضي',figNo:'(3-3) ب',neutral:true,parts:[{kind:'sw',id:'S1',lbl:'S1'},{kind:'lamp',id:'E1',lbl:'E1',v:127,pe:1},{kind:'lamp',id:'E2',lbl:'E2',v:127,pe:1},jb('J1')],watch:['E1','E2'],
  goals:[{t:'وصّل الأرضي PE بجسمي الكشافين.',done:a=>['E1','E2'].every(id=>a.nets().of[id+'.PE']===a.nets().of['PE.0'])},{t:'شغّل S1: يضيء المصباحان معاً بإضاءة كاملة.',done:a=>seen(a,'on')},{t:'أطفئ S1: ينطفئان معاً.',done:a=>seen(a,'off')}],
  track:(a)=>{if(on(a,'E1')&&on(a,'E2'))mark(a,'on');if(seen(a,'on')&&!on(a,'E1')&&!on(a,'E2')&&a.sw('QS'))mark(a,'off')}},
 f34:{name:'دائرة السلم من ثلاثة أماكن',figNo:'(3-4) ب',neutral:true,parts:[{kind:'tw',id:'A',lbl:'S1'},{kind:'im',id:'B',lbl:'S2'},{kind:'tw',id:'Cc',lbl:'S3'},{kind:'lamp',id:'E1',lbl:'E1',v:127},{kind:'lamp',id:'E2',lbl:'E2',v:127},{kind:'lamp',id:'E3',lbl:'E3',v:127},jb('J1'),jb('J2')],watch:['E1','E2','E3'],
  goals:[{t:'غيّر وضع S1 مرتين: تتبدل حالة المصابيح مع كل مرة.',done:a=>cnt(a,'SW:A')>=2,live:a=>'مرات تغيير الحالة من S1: '+cnt(a,'SW:A')},
   {t:'غيّر وضع S2 (الوسطي) مرتين: تتبدل الحالة مع كل مرة.',done:a=>cnt(a,'SW:B')>=2,live:a=>'من S2: '+cnt(a,'SW:B')},
   {t:'غيّر وضع S3 مرتين: تتبدل الحالة مع كل مرة.',done:a=>cnt(a,'SW:Cc')>=2,live:a=>'من S3: '+cnt(a,'SW:Cc')}]},
 f35:{name:'مصباح فلورسنت',figNo:'(3-5) ب',neutral:true,parts:[{kind:'sw',id:'S1',lbl:'S1'},{kind:'bal',id:'BL',lbl:'الملف الخانق'},{kind:'st',id:'ST',lbl:'البادئ'},{kind:'tube',id:'FL',lbl:'الأنبوبة'},jb('J1')],
  goals:[{t:'شغّل S1 وراقب: يتوهج البادئ، ثم تسخن الفتيلتان، ثم تضيء الأنبوبة.',done:a=>!!a.S.phys.litOnce},{t:'أطفئ S1.',done:a=>!!a.S.phys.litOnce&&a.S.phys.ph==='off'&&!a.sw('SW:S1')}],
  say:(a,ph)=>({off:'الأنبوبة مطفأة.',glow:'البادئ يتوهج ويسخن شريحته.',pre:'البادئ أغلق: الفتيلتان تسخنان.',lit:'البادئ فتح: دفعة الجهد من الملف الخانق أشعلت الأنبوبة.'})[ph.ph]},
 f36:{name:'مصباح مع عداد',figNo:'(3-6) ب',neutral:true,parts:[{kind:'fuse',id:'F1',lbl:'F1'},{kind:'meter',id:'MT',lbl:'العداد'},{kind:'sw',id:'S1',lbl:'S1'},{kind:'lamp',id:'E1',lbl:'E1',v:127},jb('J1')],watch:['E1'],
  goals:[{t:'شغّل S1: يضيء المصباح ويدور قرص العداد.',done:a=>seen(a,'run')},{t:'أطفئ S1: يقف القرص.',done:a=>seen(a,'run')&&!on(a,'MT')&&!on(a,'E1')&&a.sw('QS')&&mark(a,'stop')||seen(a,'stop')}],
  track:(a)=>{if(on(a,'E1')&&on(a,'MT'))mark(a,'run')}},
 f37:{name:'جرس 127 فولت',figNo:'(3-7) ب',neutral:true,parts:[{kind:'pb',id:'P1',lbl:'P1'},{kind:'bell',id:'H1',lbl:'الجرس',v:127},jb('J1')],
  goals:[{t:'اضغط P1 مع الإمساك: يرن الجرس.',done:a=>seen(a,'ring')},{t:'اترك P1: يسكت الجرس.',done:a=>seen(a,'quiet')}],
  track:(a)=>{if(on(a,'H1'))mark(a,'ring');if(seen(a,'ring')&&!on(a,'H1')&&a.sw('QS'))mark(a,'quiet')}},
 f38:{name:'جرس بمحول',figNo:'(3-8) ب',neutral:true,parts:[{kind:'pb',id:'P1',lbl:'P1'},{kind:'xf',id:'T1',lbl:'T1',vp:127,vs:8},{kind:'bell',id:'H1',lbl:'الجرس',v:8},jb('J1')],
  goals:[{t:'اضغط P1 مع الإمساك: يرن الجرس من ثانوي المحول (8 V).',done:a=>seen(a,'ring')},{t:'اترك P1: يسكت الجرس.',done:a=>seen(a,'quiet')}],
  track:(a)=>{if(on(a,'H1'))mark(a,'ring');if(seen(a,'ring')&&!on(a,'H1')&&a.sw('QS'))mark(a,'quiet')}},
 f39:{name:'مفتاح صدمة التيار',figNo:'(3-9) ب',parts:[{kind:'pb',id:'P1',lbl:'P1'},{kind:'pb',id:'P2',lbl:'P2'},{kind:'pb',id:'P3',lbl:'P3'},{kind:'ks',id:'KS',lbl:'مفتاح صدمة التيار',v:220},{kind:'lamp',id:'E1',lbl:'E1',v:220},{kind:'lamp',id:'E2',lbl:'E2',v:220},jb('J1'),jb('J2')],watch:['E1','E2'],
  goals:[{t:'اضغط P1 واتركه: تضيء المصابيح وتبقى.',done:a=>cnt(a,'SW:P1')>=1,live:a=>'تبديلات من P1: '+cnt(a,'SW:P1')},{t:'اضغط P2 واتركه: تنطفئ.',done:a=>cnt(a,'SW:P2')>=1},{t:'اضغط P3 واتركه: تتبدل الحالة.',done:a=>cnt(a,'SW:P3')>=1}]},
 f310:{name:'مزمن الإضاءة',figNo:'(3-10) ب',T:10,parts:[{kind:'pb',id:'P1',lbl:'P1'},{kind:'pb',id:'P2',lbl:'P2'},{kind:'tmr',id:'TM',lbl:'المزمن',v:220},{kind:'lamp',id:'E1',lbl:'E1',v:220},{kind:'lamp',id:'E2',lbl:'E2',v:220},jb('J1'),jb('J2')],
  goals:[{t:'اضغط أي ضاغط واتركه: تضيء المصابيح ويبدأ العد (10 ث).',done:a=>seen(a,'on')},{t:'انتظر: تنطفئ وحدها.',done:a=>(a.S.phys.offs||0)>=1},{t:'شغّلها من الضاغط الآخر.',done:a=>(a.S.phys.starts||0)>=2}],
  track:(a)=>{if(on(a,'E1')&&on(a,'E2'))mark(a,'on')}},
 x1a:{name:'تمرين 1 — توازٍ',figNo:'(3-13)',neutral:true,parts:[{kind:'sw',id:'S1',lbl:'S1'},{kind:'lamp',id:'E1',lbl:'E1',v:127,pe:1},{kind:'lamp',id:'E2',lbl:'E2',v:127,pe:1},jb('J1')],
  goals:[{t:'شغّل S1: يضيء المصباحان بإضاءة كاملة (توازٍ).',done:a=>seen(a,'full')}],track:a=>{if(on(a,'E1')&&on(a,'E2'))mark(a,'full')}},
 x1b:{name:'تمرين 1 — توالٍ',figNo:'(3-13)',neutral:true,parts:[{kind:'sw',id:'S1',lbl:'S1'},{kind:'lamp',id:'E1',lbl:'E1',v:127,pe:1},{kind:'lamp',id:'E2',lbl:'E2',v:127,pe:1},jb('J1')],
  goals:[{t:'شغّل S1: يضيء المصباحان بضوء خافت (توالٍ).',done:a=>seen(a,'dim')}],track:a=>{if(dim(a,'E1')&&dim(a,'E2'))mark(a,'dim')}},
 x2:{name:'تمرين 2 — سلم من مكانين',figNo:'(3-14)',neutral:true,parts:[{kind:'tw',id:'A',lbl:'S1'},{kind:'tw',id:'Cc',lbl:'S2'},{kind:'lamp',id:'E1',lbl:'E1',v:127,pe:1},{kind:'lamp',id:'E2',lbl:'E2',v:127,pe:1},jb('J1'),jb('J2')],watch:['E1','E2'],
  goals:[{t:'غيّر وضع S1 مرتين: تتبدل الحالة مع كل مرة.',done:a=>cnt(a,'SW:A')>=2},{t:'غيّر وضع S2 مرتين: تتبدل الحالة مع كل مرة.',done:a=>cnt(a,'SW:Cc')>=2},{t:'وصّل الأرضي بالكشافين.',done:a=>['E1','E2'].every(id=>a.nets().of[id+'.PE']===a.nets().of['PE.0'])}]}
};
/* x3 و x4 كما في الكتاب: فلورسنت وجرس على 220 V */
EX.x3=Object.assign({},EX.f35,{name:'تمرين 3 — فلورسنت',figNo:'(3-15)'});
EX.x4=Object.assign({},EX.f37,{name:'تمرين 4 — جرس 220 V',figNo:'(3-16)',neutral:false,parts:[{kind:'pb',id:'P1',lbl:'P1'},{kind:'bell',id:'H1',lbl:'الجرس',v:220},jb('J1')]});
/* ---- المرحلة الثانية: لوحات التوزيع (3.6، 4.2–4.4) والمحركات (6.1، 6.2) — شبكة 380/220 V ---- */
const NOTE3='<b>عن الجهد:</b> لوحات التوزيع والمحركات في الكتاب على شبكة 380/220 V: 220 V بين الطور والصفر، و 380 V بين طورين. المحاكي يعمل بهذا الجهد الحقيقي، وبعض لوحات التدريب في المعامل تعمل بجهد منخفض للسلامة، لكن التوصيل نفسه واحد.';
const B5=['L1','L2','L3','N','PE'];
const ran=(a,id)=>!!(a.S.phys.ran||{})[id],trippedOnly=(a,id)=>!!(a.S.phys.trips||{})[id]||!!(a.S.phys.blown||{})[id];
EX.b312={name:'لوحة التوزيع المنزلية',figNo:'(3-12)',vph:220,conds:B5,imax:150,note:NOTE3,parts:[
  {kind:'qs3',id:'Q0',lbl:'Q0',n:1},{kind:'bus',id:'BB',lbl:'قضبان التوزيع'},
  {kind:'fuse3',id:'F1',lbl:'دائرة 1: مصاهر',A:20},{kind:'mot3',id:'M1',lbl:'1 — المحرك',P:2.2,ctl:1,fault:1},
  {kind:'mcb',id:'C2',lbl:'دائرة 2',A:10},{kind:'heat',id:'H2',lbl:'2 — المصابيح',P:1,ctl:1,fault:1},
  {kind:'mcb',id:'C3',lbl:'دائرة 3',A:20},{kind:'sock',id:'H3',lbl:'3 — المقابس',P:3.3,fault:1},
  {kind:'mcb',id:'C4',lbl:'دائرة 4',A:20},{kind:'heat',id:'H4',lbl:'4 — المكيف',P:4.5,ctl:1,fault:1},
  {kind:'mcb3',id:'C5',lbl:'دائرة 5',A:35},{kind:'heat',id:'H5',lbl:'5 — الفرن',P:7.5,three:1,ctl:1,fault:1},
  {kind:'mcb',id:'C6',lbl:'دائرة 6',A:20},{kind:'heat',id:'H6',lbl:'6 — السخان',P:4,ctl:1,fault:1}],
 goals:[{t:'شغّل الأحمال الستة واحداً واحداً.',done:a=>['M1','H2','H3','H4','H5','H6'].every(id=>ran(a,id)),live:a=>'باقي: '+['M1','H2','H3','H4','H5','H6'].filter(id=>!ran(a,id)).join('، ')},
  {t:'أحدث قصراً في دائرة المقابس (من «اختبار الحماية»): يفصل قاطعها وحده وتبقى بقية الدوائر.',done:a=>!!(a.S.phys.trips||{}).C3},
  {t:'أحدث قصراً في دائرة المحرك: يحترق المصهر ولا يرجع بالضغط. افتح Q0 واستبدله.',done:a=>!!a.S.phys.replaced}]};
EX.w42={name:'ورشة صغيرة (4-2)',figNo:'(4-2)',vph:220,conds:B5,imax:150,note:NOTE3,parts:[
  {kind:'bus',id:'BB',lbl:'قضبان التغذية'},
  {kind:'fuse3',id:'F1',lbl:'المصهر 20A (المحرك)',A:20},{kind:'mcb3',id:'Q1',lbl:'القاطع الآلي',A:16},{kind:'mot3',id:'M2',lbl:'المحرك',P:3,fault:1},
  {kind:'fuse3',id:'F2',lbl:'المصهر 20A الثاني',A:20},{kind:'heat',id:'HT',lbl:'السخان',P:3,three:1,fault:1},
  {kind:'fuse',id:'F3',lbl:'المصهر 10A',A:10},{kind:'sw',id:'S1',lbl:'المفتاح المفرد'},{kind:'heat',id:'LP',lbl:'الفلورسنت',P:0.06,fault:1},
  {kind:'sock',id:'SO1',lbl:'المقبس 1',P:1,fault:1},{kind:'sock',id:'SO2',lbl:'المقبس 2',P:1,fault:1},jb('J1','علبة التفريع')],
 goals:[{t:'شغّل المحرك (القاطع الآلي) والسخان.',done:a=>ran(a,'M2')&&ran(a,'HT')},{t:'شغّل الإضاءة من المفتاح المفرد.',done:a=>ran(a,'LP')},{t:'شغّل جهازاً على كل مقبس.',done:a=>ran(a,'SO1')&&ran(a,'SO2')},
  {t:'أحدث قصراً في المقبس 1: يحترق المصهر 10A فتنقطع الإضاءة والمقابس معاً، ويبقى المحرك والسخان. افتح Q0 بالقاطع الرئيسي واستبدل المصهر.',done:a=>!!a.S.phys.replaced&&!!(a.S.phys.trips||{}).F3}]};
EX.p43={name:'لوحة توزيع قوى لورشة',figNo:'(4-3)',vph:220,conds:B5,imax:200,note:NOTE3,parts:[
  {kind:'qs3',id:'Q0',lbl:'المفتاح الرئيسي',n:1},{kind:'bus',id:'BB',lbl:'قضبان التوزيع'},
  {kind:'mcb3',id:'Q1',lbl:'خرج 1',A:16},{kind:'mot3',id:'M1',lbl:'محرك 1',P:3,fault:1},{kind:'mcb3',id:'Q2',lbl:'خرج 2',A:16},{kind:'mot3',id:'M2',lbl:'محرك 2',P:4,fault:1},{kind:'mcb3',id:'Q3',lbl:'خرج 3',A:25},{kind:'mot3',id:'M3',lbl:'محرك 3',P:5.5,fault:1}],
 goals:[{t:'شغّل المحركات الثلاثة.',done:a=>['M1','M2','M3'].every(id=>ran(a,id))},{t:'أحدث قصراً في محرك 2: يفصل قاطع خرجه وحده.',done:a=>!!(a.S.phys.trips||{}).Q2&&!(a.S.phys.trips||{}).Q1&&!(a.S.phys.trips||{}).Q3}]};
EX.p45={name:'لوحة توزيع إضاءة لورشة',figNo:'(4-5)',vph:220,conds:B5,imax:200,note:NOTE3,parts:[
  {kind:'qs3',id:'Q0',lbl:'المفتاح الرئيسي',n:1},{kind:'bus',id:'BB',lbl:'قضبان التوزيع'}].concat([1,2,3,4,5,6].flatMap(k=>[{kind:'mcb',id:'C'+k,lbl:'دائرة '+k,A:10},{kind:'heat',id:'E'+k,lbl:'إضاءة '+k,P:1.2,pe:1,ctl:1,fault:1}])),
 goals:[{t:'وزّع الدوائر الست على الأوجه الثلاثة (دائرتان لكل وجه) وشغّلها كلها.',done:a=>[1,2,3,4,5,6].every(k=>ran(a,'E'+k))},
  {t:'تأكد أن الأحمال متزنة: تيارات الأوجه الثلاثة متقاربة والدوائر كلها تعمل.',done:a=>!!a.S.phys.balanced,live:a=>a.S.phys.phI?'تيارات الأوجه: '+a.S.phys.phI.map(x=>x.toFixed(1)+' A').join(' / '):''},
  {t:'وصّل الأرضي PE لكل دائرة.',done:a=>[1,2,3,4,5,6].every(k=>a.nets().of['E'+k+'.PE']===a.nets().of['PE.0'])}],
 track:(a,ph)=>{const nt=a.nets().of;const cnt={L1:0,L2:0,L3:0};[1,2,3,4,5,6].forEach(k=>{const n=nt['C'+k+'.i'];['L1','L2','L3'].forEach(c=>{if(n!=null&&(n===nt[c+'.0']||n===nt['BB.'+c+'0']))cnt[c]++})});
  ph.phI=['L1','L2','L3'].map(c=>cnt[c]*1.2*1000/220);if([1,2,3,4,5,6].every(k=>ph.on['E'+k]===2)&&cnt.L1===2&&cnt.L2===2&&cnt.L3===2)ph.balanced=1}};
EX.dc61={name:'محرك تيار مستمر توازٍ',figNo:'(6-1) إلى (6-6)',dc:true,vdc:220,imax:300,note:'<b>عن الجهد:</b> مصدر تيار مستمر 220 V كما في الكتاب. القيم الأخرى (مقاومة المنتج 1 Ω، والمجال 220 Ω، والسرعة المقننة نحو 1500 rpm) توضيحية.',parts:[
  {kind:'sw',id:'Q',lbl:'المفتاح الرئيسي'},jb('J1','علبة التفريع'),{kind:'rh',id:'RS',lbl:'مقاومة البدء',max:20,init:20,sub:'0–20 Ω على التوالي مع المنتج',klbl:'مقاومة البدء'},
  {kind:'rh',id:'RF',lbl:'منظم المجال',max:200,init:0,sub:'0–200 Ω على التوالي مع المجال',klbl:'منظم المجال'},{kind:'dcm',id:'M',lbl:'المحرك M',Ra:1,Rf:220,TL:4}],
 goals:[{t:'ابدأ ومقاومة البدء على أكبر قيمة، ثم أنقصها إلى الصفر كلما زادت السرعة.',done:a=>!!(a.S.phys.dirs||{}).full},
  {t:'زد السرعة فوق 1800 rpm بزيادة منظم المجال (إضعاف المجال)، ثم أرجعه.',done:a=>(a.S.phys.maxN||0)>1800},
  {t:'اعكس الاتجاه: افتح المفتاح، واعكس طرفي المنتج A1 و A2 فقط (لا سلكي التغذية)، ثم شغّل مرة أخرى.',done:a=>{const d=a.S.phys.dirs||{};return !!(d.f&&d.r)}}]};
const IMP=(extra)=>[{kind:'qs3',id:'Q0',lbl:'المفتاح الرئيسي'}].concat(extra);
EX.im_rs={name:'1) مقاومات العضو الساكن',figNo:'(6-7)',vph:220,conds:['L1','L2','L3','N','PE'],imax:300,note:NOTE3,parts:IMP([{kind:'rs3',id:'R',lbl:'مقاومات البدء',R:6},{kind:'im3',id:'M',lbl:'المحرك M',Zn:101,In:6.5}]),
 goals:[{t:'وصّل المحرك مثلثاً على لوحة الأطراف، وابدأ والمقاومات في الدائرة.',done:a=>!!(a.S.phys.modes||{}).resStart},{t:'بعد ارتفاع السرعة قصّر المقاومات.',done:a=>!!(a.S.phys.modes||{}).shorted}]};
EX.im_yd={name:'2) نجمة / مثلث',figNo:'(6-8)',vph:220,conds:['L1','L2','L3','N','PE'],imax:300,note:NOTE3,parts:IMP([{kind:'yd',id:'YD',lbl:'مفتاح نجمة/مثلث'},{kind:'im3',id:'M',lbl:'المحرك M',Zn:101,In:6.5}]),
 goals:[{t:'ابدأ على النجمة (Y).',done:a=>!!(a.S.phys.modes||{}).yStart},{t:'انقل إلى المثلث (Δ) بعد ارتفاع السرعة.',done:a=>!!(a.S.phys.modes||{}).D}]};
EX.im_wr={name:'3) مقاومات العضو الدوار',figNo:'(6-10)',vph:220,conds:['L1','L2','L3','N','PE'],imax:300,note:NOTE3,parts:IMP([{kind:'wrm',id:'M',lbl:'محرك حلقات انزلاق',Zn:101,In:6.5},{kind:'rst',id:'RB',lbl:'بادئ العضو الدوار'}]),
 goals:[{t:'ابدأ والذراع على الوضع 1 (كل المقاومة).',done:a=>!!(a.S.phys.modes||{}).s1},{t:'انقل الذراع خطوة خطوة إلى الوضع 4 والمحرك يدور.',done:a=>{const m=a.S.phys.modes||{};return m.st3&&m.st2&&m.st1&&m.r0}}]};
EX.im_rev={name:'4) عكس الاتجاه',figNo:'(6-11)',vph:220,conds:['L1','L2','L3','N','PE'],imax:300,note:NOTE3,parts:IMP([{kind:'im3',id:'M',lbl:'المحرك M',Zn:101,In:6.5}]),
 goals:[{t:'شغّل المحرك (مثلثاً) في الاتجاه الأول.',done:a=>!!(a.S.phys.modes||{}).fwd},{t:'افتح المفتاح، وبدّل أي خطين من خطوط التغذية، ثم شغّل: يدور المحرك في الاتجاه المعاكس.',done:a=>!!(a.S.phys.modes||{}).rev}]};
const LES={'u3-l6':['b312'],'u4-l2':['w42'],'u4-l3':['p43'],'u4-l4':['p45'],'u6-l1':['dc61'],'u6-l2':['im_rs','im_yd','im_wr','im_rev'],'u3-l1':['f31'],'u3-l2':['f31','f32','f33'],'u3-l3':['f34','f35','f36'],'u3-l4':['f37','f38'],'u3-l5':['f39','f310'],'u3-l7':['x1a','x1b','x2','x3','x4']};
function figOf(k,L){const U=B.U3BENCH;if(!U||!U.BD[k]){const b=(L&&L.theory||[]).find(x=>x.book&&/<svg/.test(x.book)&&(!EX[k].figNo||x.book.indexOf(EX[k].figNo.replace(/[()]/g,'').split(' ')[0])>=0))||(L&&L.theory||[]).find(x=>x.book&&/<svg/.test(x.book));return b?b.book+(b.ref?`<p class="sub">${b.ref}</p>`:''):''}const bd=U.BD[k];try{const S=U.IDLE();return `<div class="svgbox">${U.exec(bd.sp,S,{R:U.solve(bd.sp,S)})}</div><p class="sub">${esc(bd.name)} — ${esc(bd.ref||'')}</p>`}catch(e){return ''}}
Object.keys(LES).forEach(id=>{const L=B.LESSONS.find(l=>l.id===id);if(!L)return;
 L.bench=el=>{const ks=LES[id];let cur=ks[0];
  el.innerHTML=(ks.length>1?`<div class="variant" style="margin-bottom:10px"><span>الدائرة:</span><div class="seg" role="group">${ks.map(k=>`<button data-ex="${k}" aria-pressed="${k===cur}">${esc(EX[k].name)}</button>`).join('')}</div></div>`:'')+'<div data-host></div>';
  const go=k=>{cur=k;el.querySelectorAll('[data-ex]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ex===k));const host=el.querySelector('[data-host]');host.innerHTML='';
   const ex=Object.assign({},EX[k],{fig:()=>figOf(k,L)});
   B.BENCH.mount(host,{key:id+'-'+k,title:'المنضدة الافتراضية: '+ex.name,layout:BENCH_LAYOUTS.inst(ex),exp:exp(L,ex),
    intro:'وصّل الدائرة التنفيذية بنفسك على اللوحة، ثم شغّلها. أي خطأ في التوصيل يكشفه المحاكي ويشرح خطره. تحصل على «جاهز للمعمل» لكل دائرة عندما تكملها بلا أي خطأ.'})};
  el.querySelectorAll('[data-ex]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.ex)));go(cur)}});
B.INSTBENCH={EX,LES};
})(PLCBOOK);
