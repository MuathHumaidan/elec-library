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
 'live-touch':{t:'لمست بالقياس جسم جهاز موصول بالطور',why:''}
};
/* ---- مكونات الحل ---- */
function build(a,ex,ph){const v=ex.parts,els=[],idx={};const on=a.sw('QS');
 const src=c=>({p:c+'.0',n:'N.0',y:on?[1/RSRC,0]:[1e-9,0],i:on?C.div(PH[c],[RSRC,0]):[0,0]});
 const S1=src('L1'),S2=src('L2');els.push(S1,S2,{p:'N.0',n:'PE.0',y:[1/RSRC,0]});
 const R=(vr,P)=>vr*vr/P,G=r=>[1/r,0],CL=[1e3,0];
 v.forEach(p=>{const id=p.id,sw=k=>!!a.S.sw[k];
  if(p.kind==='lamp'){const e={p:id+'.L',n:id+'.N',y:ph.burnt[id]?[1e-9,0]:G(R(p.v,60))};els.push(e);idx[id]=e}
  else if(p.kind==='bell'){const e={p:id+'.1',n:id+'.2',y:ph.burnt[id]?[1e-9,0]:G(R(p.v,10))};els.push(e);idx[id]=e}
  else if(p.kind==='sw'){if(sw('SW:'+id))els.push({p:id+'.L',n:id+'.1',y:CL})}
  else if(p.kind==='sw2'){if(sw('SW:'+id+':1'))els.push({p:id+'.L',n:id+'.1',y:CL});if(sw('SW:'+id+':2'))els.push({p:id+'.L',n:id+'.2',y:CL})}
  else if(p.kind==='tw')els.push({p:id+'.C',n:id+(sw('SW:'+id)?'.2':'.1'),y:CL});
  else if(p.kind==='im'){if(sw('SW:'+id))els.push({p:id+'.1',n:id+'.4',y:CL},{p:id+'.2',n:id+'.3',y:CL});else els.push({p:id+'.1',n:id+'.3',y:CL},{p:id+'.2',n:id+'.4',y:CL})}
  else if(p.kind==='pb'){if(sw('SW:'+id))els.push({p:id+'.1',n:id+'.2',y:CL})}
  else if(p.kind==='fuse')els.push({p:id+'.1',n:id+'.2',y:CL});
  else if(p.kind==='meter'){const e={p:id+'.M',n:id+'.F',y:[100,0]};els.push(e);idx[id]=e}
  else if(p.kind==='xf'){const a2=p.vp/p.vs,Z=[2,1],yz=C.div([1,0],Z),Ym=[1/20000,0];
   els.push({p:[id+'.P1',id+'.P2'],q:[id+'.S1',id+'.S2'],Y:[[C.add(yz,Ym),C.mul([-a2,0],yz)],[C.mul([-a2,0],yz),C.mul([a2*a2,0],yz)]]});idx[id]=id}
  else if(p.kind==='ks'){const e={p:id+'.A1',n:id+'.A2',y:G(R(p.v||220,5))};els.push(e);idx[id]=e;if(ph.ks[id])els.push({p:id+'.1',n:id+'.2',y:CL})}
  else if(p.kind==='tmr'){const e={p:id+'.1',n:id+'.7',y:G(R(p.v||220,5))};els.push(e);idx[id]=e;if((ph.tm[id]||0)>0)els.push({p:id+'.2',n:id+'.3',y:CL})}
 });
 /* الفلورسنت: الملف الخانق والبادئ والأنبوبة تُفحص بالمسار (كما في الكتاب) لا بالحل */
 return {els,idx,S1,S2}}
function mag(x){return C.abs(x)}
/* ---- التجربة ---- */
function exp(L,ex){const P=ex.parts;
 const X={powerSw:['QS'],mistakes:MZ,note:NOTE,
  figure:()=>ex.fig?ex.fig():'',figureTitle:'الدائرة التنفيذية في الكتاب — الشكل '+(ex.figNo||''),
  init:()=>({burnt:{},ks:{},kPrev:{},tm:{},t:0,on:{},seen:{},cnt:{},flips:{},everQS:false,ph:'off',pt:0,energy:0})};
 const parts=k=>P.filter(p=>p.kind===k);
 X.tick=a=>{const ph=a.S.phys,on=a.sw('QS');ph.t+=a.dt;if(on)ph.everQS=true;
  const {els,idx,S1,S2}=build(a,ex,ph);const r=a.solveAC(els);
  const Isrc=Math.max(mag(r.cur(S1)),mag(r.cur(S2)));
  if(a.hold('sc',on&&Isrc>IMAX,0.05))a.mistake('short');
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
 X.view={title:'ما يحدث في الدائرة',mount(el){el.innerHTML='<div data-st class="sub"></div>'},frame(el,a){const ph=a.S.phys;if(!el||(ph.vt=(ph.vt||0)+a.dt)<0.25)return;ph.vt=0;
  const e=el.querySelector('[data-st]');if(!e)return;e.innerHTML=(ex.say?ex.say(a,ph):'')+(ex.T&&P.some(p=>p.kind==='tmr')?`<p>المتبقي في المزمن: <b class="ltr">${Math.ceil(Object.values(ph.tm)[0]||0)} s</b></p>`:'')+(P.some(p=>p.kind==='meter')?`<p>الطاقة التي سجّلها العداد: <b class="ltr">${(ph.energy*VPH/3600).toFixed(2)} Wh</b></p>`:'')}};
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
const LES={'u3-l1':['f31'],'u3-l2':['f31','f32','f33'],'u3-l3':['f34','f35','f36'],'u3-l4':['f37','f38'],'u3-l5':['f39','f310'],'u3-l7':['x1a','x1b','x2','x3','x4']};
function figOf(k){const U=B.U3BENCH;if(!U||!U.BD[k])return '';const bd=U.BD[k];try{const S=U.IDLE();return `<div class="svgbox">${U.exec(bd.sp,S,{R:U.solve(bd.sp,S)})}</div><p class="sub">${esc(bd.name)} — ${esc(bd.ref||'')}</p>`}catch(e){return ''}}
Object.keys(LES).forEach(id=>{const L=B.LESSONS.find(l=>l.id===id);if(!L)return;
 L.bench=el=>{const ks=LES[id];let cur=ks[0];
  el.innerHTML=(ks.length>1?`<div class="variant" style="margin-bottom:10px"><span>الدائرة:</span><div class="seg" role="group">${ks.map(k=>`<button data-ex="${k}" aria-pressed="${k===cur}">${esc(EX[k].name)}</button>`).join('')}</div></div>`:'')+'<div data-host></div>';
  const go=k=>{cur=k;el.querySelectorAll('[data-ex]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ex===k));const host=el.querySelector('[data-host]');host.innerHTML='';
   const ex=Object.assign({},EX[k],{fig:()=>figOf(k.replace(/^x3$/,'x3').replace(/^x4$/,'x4'))});
   B.BENCH.mount(host,{key:id+'-'+k,title:'المنضدة الافتراضية: '+ex.name,layout:BENCH_LAYOUTS.inst(ex),exp:exp(L,ex),
    intro:'وصّل الدائرة التنفيذية بنفسك على اللوحة، ثم شغّلها. أي خطأ في التوصيل يكشفه المحاكي ويشرح خطره. تحصل على «جاهز للمعمل» لكل دائرة عندما تكملها بلا أي خطأ.'})};
  el.querySelectorAll('[data-ex]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.ex)));go(cur)}});
B.INSTBENCH={EX,LES};
})(PLCBOOK);
