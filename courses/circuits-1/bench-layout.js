/* «المنضدة الافتراضية» — منضدة القياس لمقرري الدوائر الكهربائية 1 و 2 (ملف مشترك: نسخة في كل مقرر باسم bench-layout.js).
   المتدرب يوصّل دائرة الدرس بنفسه، ويقيس بالأجهزة، ويسجّل القراءة في الجدول، ثم يقارنها بالقانون.
   كل التجارب إضافة من خارج الكتاب (قيمها توضيحية ومسجلة في تقرير المقرر).
   MEAS.layout(ex) — شكل المنضدة، MEAS.exp(L,ex) — الكهرباء والتسجيل، MEAS.bind(B,LES,EX) — الربط بالدروس. */
(function(){
const W=1240,GAP=14,G='#C9A227';
const cut=(s,n)=>{s=String(s||'').replace(/<[^>]+>/g,'').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const T=(id,lbl,x,y,o)=>Object.assign({id,lbl,x,y,col:G,nm:id.replace(/^(.+?)\.(.+)$/,'$1 ($2)').replace(/^(\w+)([+-])$/,'$1 ($2)')},o||{});
const fmtV=(v,u)=>{const a=Math.abs(v);if(u==='Ω'){if(a>=1e6)return +(v/1e6).toPrecision(3)+' MΩ';if(a>=1e3)return +(v/1e3).toPrecision(3)+' kΩ';return +v.toPrecision(3)+' Ω'}
 if(u==='F'){if(a>=1e-3)return +(v*1e3).toPrecision(3)+' mF';if(a>=1e-6)return +(v*1e6).toPrecision(3)+' µF';return +(v*1e9).toPrecision(3)+' nF'}
 if(u==='H'){if(a>=1)return +v.toPrecision(3)+' H';return +(v*1e3).toPrecision(3)+' mH'}return v+' '+u};
function meterMod(p,kind){const ac=!!p.ac,u=kind==='V'?'V':kind==='A'?'A':'W';
 if(kind==='W')return {w:210,h:240,sub:'واتميتر'+(ac?' AC':''),meters:[{id:p.id,name:'الواتميتر',x:30,y:40,w:150,h:96,unit:'W',ranges:p.ranges||[10,50,200],ac:true}],
  labels:[{t:'ملف التيار',x:60,y:205,s:10},{t:'ملف الجهد',x:150,y:205,s:10}],terms:[T(p.id+'.I+','*',35,175),T(p.id+'.I-','I',85,175),T(p.id+'.V+','*',125,175),T(p.id+'.V-','V',175,175)]};
 return {w:180,h:230,sub:(kind==='V'?'فولتميتر':kind==='G'?'جلفانومتر (الصفر في الوسط)':'أميتر')+(ac?' AC':''),meters:[{id:p.id,name:(kind==='V'?'فولتميتر':kind==='G'?'جلفانومتر':'أميتر')+' '+p.id,x:15,y:40,w:150,h:96,unit:kind==='G'?'mA':u,ranges:p.ranges||(kind==='V'?[1,3,10,30]:kind==='G'?[1,10]:[0.01,0.1,0.3,1,3]),ac:ac||kind==='G'}],
  terms:[T(p.id+'+',ac?'*':'+',55,205,{pol:ac?'':'+',ly:-16}),T(p.id+'-',ac?'~':'−',125,205,{pol:ac?'':'-',ly:-16})]}}
const PART={
 dcs:p=>({w:230,h:200,sub:(p.fixed?'E = '+p.V+' V':'مصدر مستمر 0–'+p.V+' V')+(p.zeroOff?' — الإيقاف = قصر':''),knobs:p.fixed?[]:[{id:'K:'+p.id,lbl:'ضبط الجهد',x:70,y:96,max:p.V,step:p.step||0.1,unit:'V',dp:1}],switches:[{id:'SW:'+p.id,lbl:'تشغيل / إيقاف',x:180,y:92}],
  terms:[T(p.id+'.+','+',70,170,{pol:'+'}),T(p.id+'.-','−',170,170,{pol:'-'})]}),
 cell:p=>({w:130,h:178,sub:'خلية '+p.E+' V، r = '+p.r+' Ω',art:`<path d="M44 92h40M54 80v24M74 72v40" stroke="#333" stroke-width="3"/>`,terms:[T(p.id+'.+','+',34,150,{pol:'+'}),T(p.id+'.-','−',96,150,{pol:'-'})]}),
 acs:p=>({w:300,h:200,sub:'مولد إشارة جيبية',knobs:[{id:'K:'+p.id,lbl:'الجهد (فعّال)',x:60,y:96,max:p.V,step:0.1,unit:'V',dp:1}].concat(p.fixedF?[]:[{id:'F:'+p.id,lbl:'التردد',x:155,y:96,min:p.fmin||20,max:p.fmax||2000,init:p.f||50,step:p.fstep||1,unit:'Hz',dp:0}]),switches:[{id:'SW:'+p.id,lbl:'تشغيل',x:250,y:92}],
  terms:[T(p.id+'.1','~',90,170),T(p.id+'.2','~',210,170)]}),
 ac3:p=>({w:300,h:200,sub:'مصدر ثلاثي الأطوار (تتابع L1 L2 L3)',knobs:[{id:'K:'+p.id,lbl:'جهد الطور',x:60,y:96,max:p.V,step:0.5,unit:'V',dp:1}],switches:[{id:'SW:'+p.id,lbl:'تشغيل',x:250,y:92}],
  terms:['L1','L2','L3','N'].map((c,k)=>T(p.id+'.'+c,c,50+k*65,170))}),
 r:p=>({w:130,h:160,sub:'R = '+fmtV(p.R,'Ω'),art:`<rect x="35" y="66" width="60" height="22" rx="3" fill="#d9b26f" stroke="#7a5a1f"/>`,terms:[T(p.id+'.a','',30,132),T(p.id+'.b','',100,132)]}),
 rv:p=>({w:150,h:200,sub:'مقاومة متغيرة 0–'+fmtV(p.max,'Ω'),knobs:[{id:'K:'+p.id,lbl:'R',x:75,y:94,min:p.min||0,max:p.max,init:p.init!=null?p.init:p.max,step:p.step||1,unit:'Ω'}],terms:[T(p.id+'.a','',35,170),T(p.id+'.b','',115,170)]}),
 rt:p=>({w:170,h:200,sub:'R₂₀ = '+p.R+' Ω (نحاس)',knobs:[{id:'T:'+p.id,lbl:'الحرارة',x:85,y:94,min:20,max:120,init:20,step:1,unit:'°C'}],terms:[T(p.id+'.a','',40,170),T(p.id+'.b','',130,170)]}),
 c:p=>({w:130,h:160,sub:'C = '+fmtV(p.C,'F'),art:`<path d="M65 60v18M65 96v18M45 78h40M45 96h40" stroke="#333" stroke-width="3"/>`,terms:[T(p.id+'.a','',30,132),T(p.id+'.b','',100,132)]}),
 l:p=>({w:130,h:160,sub:'L = '+fmtV(p.L,'H')+(p.r?' (r = '+p.r+' Ω)':''),art:`<path d="M30 80q8-16 14 0t14 0t14 0t14 0t14 0" fill="none" stroke="#555" stroke-width="3"/>`,terms:[T(p.id+'.a','',30,132),T(p.id+'.b','',100,132)]}),
 rl:p=>({w:150,h:160,sub:'R = '+fmtV(p.R,'Ω')+' + L = '+fmtV(p.L,'H'),art:`<rect x="22" y="70" width="40" height="18" rx="3" fill="#d9b26f" stroke="#7a5a1f"/><path d="M66 79q6-14 12 0t12 0t12 0t12 0" fill="none" stroke="#555" stroke-width="3"/>`,terms:[T(p.id+'.a','',30,132),T(p.id+'.b','',120,132)]}),
 sw:p=>({w:120,h:160,sub:'مفتاح',switches:[{id:'SW:'+p.id,lbl:'',x:60,y:80}],terms:[T(p.id+'.a','',30,132),T(p.id+'.b','',90,132)]}),
 jb:p=>({w:170,h:160,sub:'عقد توصيل: كل مجموعة موصولة داخلياً',art:['a','b','c'].map((k,j)=>`<rect x="${14+j*50}" y="58" width="44" height="88" rx="6" fill="#d7dad3" stroke="#888"/>`).join(''),
  terms:['a','b','c'].flatMap((k,j)=>[0,1,2].map(n=>T(p.id+'.'+k+n,n?'':k,36+j*50,78+n*28,{ly:-14,col:'#8a8f93'}))),bridges:['a','b','c'].flatMap(k=>[[p.id+'.'+k+'0',p.id+'.'+k+'1'],[p.id+'.'+k+'0',p.id+'.'+k+'2']])}),
 vm:p=>meterMod(p,'V'),am:p=>meterMod(p,'A'),gal:p=>meterMod(p,'G'),wm:p=>meterMod(p,'W')
};
function layout(ex){const mods=[],bridges=[];let x=20,y=20,rowH=0;
 const place=m=>{if(x+m.w>W-20){x=20;y+=rowH+GAP;rowH=0}m.x=x;m.y=y;x+=m.w+GAP;rowH=Math.max(rowH,m.h);mods.push(m);(m.bridges||[]).forEach(b=>bridges.push(b))};
 ex.parts.forEach(p=>{const m=PART[p.kind](p);m.id='p_'+p.id;m.title=cut(p.lbl||p.id,18);place(m)});if(x>20)y+=rowH+GAP;
 return {w:W,h:y,generic:true,modules:mods,bridges}}

/* ---------------- الكهرباء ---------------- */
const RVM=1e7,RAM=0.01,RSRC=0.05,RAC=0.5;
function make(B,L,ex){const C=B.BENCH.C,P=ex.parts,AC=!!ex.ac,mag=x=>C.abs(x);
 const srcs=P.filter(p=>['dcs','acs','ac3'].includes(p.kind));
 const X={powerSw:srcs.map(p=>'SW:'+p.id),mistakes:{
  'short':{t:'قصر على المصدر',why:'طرفا المصدر اتصلا بلا مقاومة تقريباً (أو عبر أميتر). في المعمل يسخن المصدر وتفصل حمايته. الأميتر يوصل على التوالي مع الحمل، والفولتميتر على التوازي.',fatal:true,off:srcs.map(p=>'SW:'+p.id)},
  'amm-parallel':{t:'الأميتر موصّل على التوازي',why:'الأميتر مقاومته صغيرة جداً، فإذا وُصّل بين طرفي عنصر صار قصراً عليه ومرّ فيه تيار كبير. الأميتر يُدخل في مسار التيار (على التوالي).',fatal:true,off:srcs.map(p=>'SW:'+p.id)},
  'over-power':{t:'مقاومة تجاوزت قدرتها',why:'القدرة في المقاومة (I²R) تجاوزت قدرتها المقننة فاحترقت. قلل جهد المصدر أو راجع التوصيل.',fatal:true,off:srcs.map(p=>'SW:'+p.id)}},
  note:ex.note||'',figure:()=>ex.fig?ex.fig():'',figureTitle:'مخطط التوصيل',
  init:()=>({vc:{},t:0,burnt:{},rec:0})};
 /* نقل مجسّي الفولتميتر والدائرة تعمل مسموح كما في المعمل (الفولتميتر لا يغيّر الدائرة) */
 const VMS=P.filter(p=>p.kind==='vm').map(p=>p.id);X.liveOk=(a,b)=>[a,b].some(t=>VMS.some(v=>t===v+'+'||t===v+'-'));
 X.tick=a=>{const ph=a.S.phys;ph.t+=a.dt;const els=[],E={};const on=id=>a.sw('SW:'+id);
  const f=AC?(()=>{const s=P.find(p=>p.kind==='acs');return s?(s.fixedF?s.f:a.knob('F:'+s.id)):50})():0,w=2*Math.PI*f;ph.f=f;
  P.forEach(p=>{const id=p.id;
   if(p.kind==='dcs'){const V=p.fixed?p.V:a.knob('K:'+id),r=p.r||RSRC;E[id]=AC?null:{p:id+'.+',n:id+'.-',g:on(id)||p.zeroOff?1/r:1e-9,i:on(id)?V/r:0};els.push(E[id])}
   else if(p.kind==='cell'){E[id]={p:id+'.+',n:id+'.-',g:1/p.r,i:p.E/p.r};els.push(E[id])}
   else if(p.kind==='acs'){const V=a.knob('K:'+id);E[id]={p:id+'.1',n:id+'.2',y:on(id)?[1/RAC,0]:[1e-9,0],i:on(id)?[V/RAC,0]:[0,0]};els.push(E[id])}
   else if(p.kind==='ac3'){const V=a.knob('K:'+id);E[id]=['L1','L2','L3'].map((c,k)=>{const e={p:id+'.'+c,n:id+'.N',y:on(id)?[1/RAC,0]:[1e-9,0],i:on(id)?C.div(C.pol(V,-120*k),[RAC,0]):[0,0]};els.push(e);return e})}
   else if(p.kind==='r'||p.kind==='rv'||p.kind==='rt'){const R=p.kind==='r'?p.R:p.kind==='rv'?Math.max(a.knob('K:'+id),0.01):p.R*(1+0.00393*(a.knob('T:'+id)-20));ph['R_'+id]=R;
    E[id]=AC?{p:id+'.a',n:id+'.b',y:ph.burnt[id]?[1e-9,0]:[1/R,0]}:{p:id+'.a',n:id+'.b',g:ph.burnt[id]?1e-9:1/R};els.push(E[id])}
   else if(p.kind==='c'){if(AC){E[id]={p:id+'.a',n:id+'.b',y:[0,w*p.C]}}else{const g=p.C/Math.max(a.dt,1e-3);E[id]={p:id+'.a',n:id+'.b',g,i:g*(ph.vc[id]||0)}}els.push(E[id])}
   else if(p.kind==='l'){E[id]=AC?{p:id+'.a',n:id+'.b',y:C.div([1,0],[p.r||0.01,w*p.L])}:{p:id+'.a',n:id+'.b',g:1/(p.r||0.01)};els.push(E[id])}
   else if(p.kind==='rl'){E[id]={p:id+'.a',n:id+'.b',y:C.div([1,0],[p.R,w*p.L])};els.push(E[id])}
   else if(p.kind==='sw'){E[id]=AC?{p:id+'.a',n:id+'.b',y:on(id)?[1e4,0]:[1e-9,0]}:{p:id+'.a',n:id+'.b',g:on(id)?1e4:1e-9};els.push(E[id])}
   else if(p.kind==='vm'){E[id]=AC||p.ac?{p:id+'+',n:id+'-',y:[1/RVM,0]}:{p:id+'+',n:id+'-',g:1/RVM};els.push(E[id])}
   else if(p.kind==='am'||p.kind==='gal'){const r=p.kind==='gal'?5:RAM;E[id]=AC||p.ac?{p:id+'+',n:id+'-',y:[1/r,0]}:{p:id+'+',n:id+'-',g:1/r};els.push(E[id])}
   else if(p.kind==='wm'){E[id+':I']={p:id+'.I+',n:id+'.I-',y:[1/RAM,0]};E[id+':V']={p:id+'.V+',n:id+'.V-',y:[1/RVM,0]};els.push(E[id+':I'],E[id+':V'])}});
  const r=AC?a.solveAC(els):a.solve(els);
  const V=(x,y2)=>AC?mag(r.vd(x,y2)):r.vt(x)-r.vt(y2),I=e=>AC?mag(r.cur(e)):r.cur(e),Ic=e=>AC?r.cur(e):[r.cur(e),0],Vc=(x,y2)=>AC?r.vd(x,y2):[r.vt(x)-r.vt(y2),0];
  ph.V=V;ph.I=I;ph.E=E;ph.Ic=Ic;ph.Vc=Vc;
  /* المكثفات: تحديث الجهد */
  if(!AC)P.filter(p=>p.kind==='c').forEach(p=>{ph.vc[p.id]=r.vt(p.id+'.a')-r.vt(p.id+'.b')});
  /* أخطاء: قصر على المصدر، أميتر على التوازي، قدرة المقاومة */
  srcs.forEach(p=>{const es=[].concat(E[p.id]);const Is=Math.max(...es.map(e=>Math.abs(AC?mag(r.cur(e)):r.cur(e))));const Vs=Math.max(...es.map(e=>Math.abs(V(e.p,e.n))));
   const full=p.kind==='dcs'?(p.fixed?p.V:a.knob('K:'+p.id)):a.knob('K:'+p.id);
   const rin=p.kind==='dcs'?(p.r||RSRC):RAC;if(a.hold('sc'+p.id,on(p.id)&&full>0.5&&Is>1&&Is>0.3*full/rin,0.2)){const amShort=P.some(q=>(q.kind==='am')&&Math.abs(I(E[q.id]))>0.9*Is);a.mistake(amShort?'amm-parallel':'short')}});
  P.filter(p=>(p.kind==='r'||p.kind==='rv'||p.kind==='rt')&&p.Pmax).forEach(p=>{const i=Math.abs(I(E[p.id])),Pw=i*i*ph['R_'+p.id];if(a.hold('op'+p.id,Pw>p.Pmax*1.5,0.5)){ph.burnt[p.id]=1;a.mistake('over-power')}});
  /* القراءات */
  const out={};P.forEach(p=>{const id=p.id;
   if(p.kind==='vm')out[id]=V(id+'+',id+'-');
   else if(p.kind==='am')out[id]=I(E[id]);
   else if(p.kind==='gal')out[id]=Math.abs(I(E[id]))*1000;
   else if(p.kind==='wm'){const Vw=r.vd(id+'.V+',id+'.V-'),Iw=r.cur(E[id+':I']);out[id]=C.mul(Vw,C.conj(Iw))[0]}});
  ph.read=out;if(ex.tick)ex.tick(a,ph);return out};
 /* --------- التسجيل: كل جهاز موصّل على الكمية المطلوبة يملأ خانتها --------- */
 const nets=a=>a.nets().of;
 function measures(a,q){const ph=a.S.phys,of=nets(a),E=ph.E;
  if(q.t==='V'){for(const m of P.filter(p=>p.kind==='vm')){const mp=of[m.id+'+'],mn=of[m.id+'-'];if(mp==null||mn==null)continue;
    const A=of[q.a],Bn=of[q.b];if(mp===A&&mn===Bn)return {v:ph.read[m.id],m:m.id};if(mp===Bn&&mn===A)return {v:-ph.read[m.id],m:m.id}}return null}
  if(q.t==='I'){const el=[].concat(E[q.el])[q.idx||0];if(!el)return null;const Iel=ph.I(el);
   for(const m of P.filter(p=>p.kind==='am')){const ma=of[m.id+'+'],mb=of[m.id+'-'];if(ma==null||mb==null||ma===mb)continue;
    const touches=[el.p,el.n].some(t=>of[t]===ma||of[t]===mb);if(!touches)continue;const Im=ph.read[m.id];
    if(Math.abs(Math.abs(Im)-Math.abs(Iel))<=Math.max(0.01*Math.abs(Iel),2e-6))return {v:(ex.ac?Math.abs(Im):Im*(Math.sign(Iel)===Math.sign(Im)||!Im?1:1)),m:m.id}}return null}
  if(q.t==='W'){const m=P.find(p=>p.kind==='wm');if(!m)return null;const of2=of;const el=[].concat(E[q.el])[0];const okI=[el.p,el.n].some(t=>of2[t]===of2[m.id+'.I+']||of2[t]===of2[m.id+'.I-']);
   const okV=(of2[m.id+'.V+']===of2[q.a]&&of2[m.id+'.V-']===of2[q.b])||(of2[m.id+'.V+']===of2[q.b]&&of2[m.id+'.V-']===of2[q.a]);if(!okI||!okV)return null;return {v:Math.abs(ph.read[m.id]),m:m.id}}
  if(q.t==='G'){const m=P.find(p=>p.kind==='gal');if(!m)return null;const of2=of;if(of2[m.id+'+']!==of2[q.a]&&of2[m.id+'+']!==of2[q.b])return null;if(of2[m.id+'-']!==of2[q.a]&&of2[m.id+'-']!==of2[q.b])return null;return {v:ph.read[m.id],m:m.id}}
  if(q.t==='K')return {v:a.knob(q.knob),m:'knob'};
  if(q.t==='Wm'){const m=q.m,el=[].concat(E[q.src])[q.idx||0];const okI=of[m+'.I+']!==of[m+'.I-']&&[el.p].some(t=>of[t]===of[m+'.I+']||of[t]===of[m+'.I-']);
   const okV=(of[m+'.V+']===of[q.a]&&of[m+'.V-']===of[q.b])||(of[m+'.V+']===of[q.b]&&of[m+'.V-']===of[q.a]);if(!okI||!okV)return null;return {v:ph.read[m],m}}
  return null}
 X.tables=ex.tables.map(t=>({id:t.id,title:t.title,xh:t.xh||'',fx:t.fx,cols:t.cols,rows:t.rows.map(q=>({k:q.k,h:q.h,dp:q.dp!=null?q.dp:3})),px:t.px,py:t.py,xu:t.xu,yu:t.yu,plot:t.plot||false,xdp:t.xdp}));
 X.record=a=>{const ph=a.S.phys;for(const t of ex.tables){const c=t.col?t.col(a):0;if(typeof c==='string')return {msg:c};if(c==null||c<0)continue;
   const got={},names=[];t.rows.forEach(q=>{if(q.calc)return;const m=measures(a,q);if(m){got[q.k]=m.v;names.push(q.h.replace(/<[^>]+>/g,'')+' = '+(+m.v.toPrecision(4)))}});
   if(!names.length)continue;const old=(a.S.rec[t.id]||{})[c]||{};const val=Object.assign({},old,got);
   t.rows.forEach(q=>{if(q.calc){try{const v=q.calc(val);if(v!=null&&isFinite(v))val[q.k]=v}catch(e){}}});
   return {ok:true,table:t.id,col:c,val,msg:'سجّلت: '+names.join('، ')+(t.cols.length>1?' في العمود '+(t.fx?t.fx(t.cols[c]):t.cols[c]):'')+'.'}}
  return {msg:ex.hint||'لا يوجد جهاز قياس موصّل على كمية مطلوبة في الجدول. الفولتميتر على التوازي مع العنصر، والأميتر على التوالي في فرعه.'}};
 const full=a=>ex.tables.every(t=>{const T=a.S.rec[t.id]||{};return t.cols.every((_,i)=>T[i]&&t.rows.every(q=>T[i][q.k]!=null))});
 const offAll=a=>srcs.every(p=>!a.sw('SW:'+p.id));
 X.steps=[{t:'وصّل الدائرة كما في «مخطط التوصيل»: '+(ex.wiring||''),done:a=>Object.keys(a.S.rec).length>0}]
  .concat(ex.tables.map(t=>({t:t.step||('سجّل جدول «'+t.title+'»: ضع الفولتميتر على كل عنصر مطلوب والأميتر في فرعه، واضغط «سجّل القراءة» لكل قراءة.'),done:a=>{const T=a.S.rec[t.id]||{};return t.cols.every((_,i)=>T[i]&&t.rows.every(q=>T[i][q.k]!=null))},
   live:a=>{const T=a.S.rec[t.id]||{};const miss=[];t.cols.forEach((c,i)=>t.rows.forEach(q=>{if(!q.calc&&!(T[i]&&T[i][q.k]!=null))miss.push(q.h.replace(/<[^>]+>/g,'')+(t.cols.length>1?' @'+(t.fx?t.fx(c):c):''))}));return miss.length?'باقي: '+miss.slice(0,6).join('، ')+(miss.length>6?' …':''):''}})))
  .concat([{t:'افصل المصدر.',done:a=>full(a)&&offAll(a)}]);
 X.complete=a=>full(a)&&offAll(a);
 X.view={title:'المقارنة بالقانون',mount(el){el.innerHTML='<div data-ck class="sub"></div>'},frame(el,a){const ph=a.S.phys;if(!el||(ph.ckT=(ph.ckT||0)+a.dt)<0.4)return;ph.ckT=0;const e=el.querySelector('[data-ck]');if(e&&ex.check)try{e.innerHTML=ex.check(a.S.rec,a,ph)}catch(err){e.textContent=''}}};
 return X}
function bind(B,LES,EX){Object.keys(LES).forEach(id=>{const L=B.LESSONS.find(l=>l.id===id);if(!L)return;
 L.bench=el=>{const ks=LES[id];let cur=ks[0];const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  el.innerHTML=(ks.length>1?`<div class="variant" style="margin-bottom:10px"><span>التجربة:</span><div class="seg" role="group">${ks.map(k=>`<button data-ex="${k}" aria-pressed="${k===cur}">${esc(EX[k].name)}</button>`).join('')}</div></div>`:'')+'<div data-host></div>';
  const go=k=>{cur=k;el.querySelectorAll('[data-ex]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ex===k));const host=el.querySelector('[data-host]');host.innerHTML='';
   const ex=Object.assign({},EX[k]);const fb=(L.theory||[]).find(b=>b.fig&&b.draw&&(!ex.figRef||String(b.fig).indexOf(ex.figRef)>=0));
   ex.fig=()=>`<p><b>التوصيل:</b> ${ex.wiring||''}</p>`+(fb?`<div class="svgbox">${fb.draw()}</div><p class="sub">شكل توضيحي من الدرس ${fb.fig}</p>`:'');
   B.BENCH.mount(host,{key:id+'-'+k,title:'منضدة القياس: '+ex.name,layout:layout(ex),exp:make(B,L,ex),
    intro:'تجربة قياس (إضافة من خارج الكتاب): وصّل الدائرة، وقِس بالأجهزة، وسجّل القراءات، ثم قارنها بالقانون في لوحة «المقارنة بالقانون». تحصل على «جاهز للمعمل» عندما تكمل الجدول بلا أي خطأ.'})};
  el.querySelectorAll('[data-ex]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.ex)));go(cur)}})}
window.MEAS={layout,make,bind,fmtV};
})();
