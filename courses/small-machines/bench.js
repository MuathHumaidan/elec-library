/* «المنضدة الافتراضية» — الآلات الكهربائية الصغيرة: تجارب المعمل (إضافة من خارج الكتاب).
   «آلة الكتاب» = أرقام أمثلة الكتاب حيث وُجدت (وغيرها افتراض منا)، و«آلة معمل صغيرة» = قيم توضيحية. كل القيم مسجلة في تقرير المقرر.
   يضيف إلى ACM أجزاء خاصة: محرك الخطوة وصندوق مفاتيح الأطوار، ومولدات التاكو، ومحرك التحكم ثنائي الطور ومضخم التحكم، ومحرك التحكم المستمر،
   والمحرك العام، والمحرك التنافري، وأجهزة التزامن الذاتية (CX و CR و CT)، ومقياس التردد. */
(function(B){if(!B.BENCH||!window.ACM)return;
const A=window.ACM,PART=A.PART,EXT=A.EXT,MQ=A.MQ,T=A.T,lin=A.lin,SQ3=Math.sqrt(3),D=Math.PI/180;
const C=()=>B.BENCH.C;
const r3=x=>+(+x).toPrecision(3),fx=(v,d)=>(+v).toFixed(d),ok=(m,c,tol)=>Math.abs(m-c)<=Math.max((tol||0.03)*Math.abs(c),0.01)?'✓':'✗';
const T0=(rec,id,i)=>((rec[id]||{})[i||0])||{};
const md=(x,m)=>((x%m)+m)%m;
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
/* ================= الأجزاء ================= */
/* صندوق مفاتيح الأطوار: لكل طور مفتاح (0/1 أحادي الاتجاه، أو −1/0/+1 لعكس القطبية) */
PART.psw=p=>({w:110+p.n*70,h:220,sub:p.bip?'لكل طور: −1 عكس، 0 فصل، +1 توصيل':'لكل طور: 0 فصل، 1 توصيل',
 knobs:p.labels.map((l,k)=>({id:'P'+k+':'+p.id,lbl:'الطور '+l,x:70+k*70,y:90,min:p.bip?-1:0,max:1,init:0,step:1,unit:'',dp:0})),
 terms:[T(p.id+'.in+','+',25,60,{pol:'+'}),T(p.id+'.in-','−',25,120,{pol:'-'})].concat(p.labels.flatMap((l,k)=>[T(p.id+'.'+l+'+',l+'+',50+k*70,185),T(p.id+'.'+l+'-',l+'−',90+k*70,185)]))});
EXT.psw={els(a,p,c){p.labels.forEach((l,k)=>{const v=Math.round(a.knob('P'+k+':'+p.id));const g=x=>x?1e4:1e-9;const e=(x,y,on)=>c.elsDC.push({p:p.id+'.'+x,n:p.id+'.'+y,g:g(on)});
 e('in+',l+'+',v>0);e(l+'-','in-',v>0);e('in+',l+'-',v<0);e(l+'+','in-',v<0)})}};
/* مقاومة متغيرة */
PART.rv=p=>({w:150,h:200,sub:'مقاومة متغيرة حتى '+p.max+' Ω',knobs:[{id:'K:'+p.id,lbl:'R',x:75,y:94,min:p.min||1,max:p.max,init:p.init!=null?p.init:p.max,step:p.step||1,unit:'Ω'}],terms:[T(p.id+'.a','',35,170),T(p.id+'.b','',115,170)]});
EXT.rv={els(a,p,c){const R=Math.max(a.knob('K:'+p.id),0.01);c.elsAC.push({p:p.id+'.a',n:p.id+'.b',y:[1/R,0]});c.elsDC.push({p:p.id+'.a',n:p.id+'.b',g:1/R})}};
/* محرك الخطوة */
PART.stp=p=>{const M=p.M;return {w:120+M.N*70,h:230,sub:cut(M.name+' — خطوة '+M.step+'°',46),art:`<circle cx="60" cy="80" r="34" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/><circle cx="60" cy="80" r="6" fill="#333"/>`,
 meters:[{id:p.id+':a',kind:'digital',x:110,y:50,w:120,h:44,unit:'°',dp:1}],
 terms:M.labels.flatMap((l,k)=>[T(p.id+'.'+l+'+',l+'+',40+k*70,195),T(p.id+'.'+l+'-',l+'−',80+k*70,195)])}};
EXT.stp={els(a,p,c){p.M.labels.forEach((l,k)=>{const e={p:p.id+'.'+l+'+',n:p.id+'.'+l+'-',g:1/p.M.R};c.elsDC.push(e);c.Ed[p.id+':'+k]=e})},
 post(a,p,c){const M=p.M,ph=c.ph;const ik=M.labels.map((l,k)=>c.Id(c.Ed[p.id+':'+k])/M.Ir);ph.ik=ik;
  let th=ph.th==null?0:ph.th;const tq=x=>{let t=0;ik.forEach((i,k)=>{const v=M.uni?Math.abs(i):i;if(Math.abs(v)>0.05)t-=v*Math.sin(M.Z*(x-M.e[k])*D)});return t};
  const th0=th;for(let n=0;n<25;n++){const t=tq(th);th+=clamp(0.35*t/(M.Z*D),-M.step/2,M.step/2)}ph.th=th;ph.dth=Math.abs(th-th0);c.out[p.id+':a']=md(th,360);
  if(a.hold('stpo',ik.some(i=>Math.abs(i)>1.3),2))a.mistake('stp-over')}};
MQ.Ang=(a,q,ph)=>q.m&&ph['ang_'+q.m]!=null?{v:ph['ang_'+q.m],m:q.m}:(ph.th!=null?{v:md(ph.th,360),m:'stp'}:null);
/* مولد تاكو مستمر: + − للمنتج، و F1 F2 للمجال (أو مغناطيس دائم) */
PART.tdc=p=>{const M=p.M;return {w:M.pm?200:270,h:220,sub:cut(M.name,40),art:`<circle cx="60" cy="80" r="30" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/>`,
 terms:[T(p.id+'.+','+',50,185,{pol:'+'}),T(p.id+'.-','−',110,185,{pol:'-'})].concat(M.pm?[]:[T(p.id+'.F1','F1',180,185,{pol:'+'}),T(p.id+'.F2','F2',235,185,{pol:'-'})]),labels:[{t:'المنتج',x:80,y:150,s:10}].concat(M.pm?[]:[{t:'المجال',x:207,y:150,s:10}])}};
EXT.tdc={els(a,p,c){const M=p.M,ph=c.ph;const If=M.pm?1:(ph.Itf||0);const E=M.KE*If*(ph.w||0);ph.Etac=E;const e={p:p.id+'.+',n:p.id+'.-',g:1/M.Ra,i:E/M.Ra};c.elsDC.push(e);c.Ed[p.id+':a']=e;
  if(!M.pm){const f={p:p.id+'.F1',n:p.id+'.F2',g:1/M.Rf};c.elsDC.push(f);c.Ed[p.id+':f']=f}},
 post(a,p,c){if(!p.M.pm)c.ph.Itf=c.Id(c.Ed[p.id+':f'])}};
/* مولد تاكو حثي: R1 R2 الملف الرئيسي (المرجع)، C1 C2 الملف المساعد (الخرج). نموذج المجال المزدوج كما في تبويب «المختبر» */
PART.tind=p=>({w:260,h:220,sub:cut(p.M.name,40),art:`<circle cx="60" cy="80" r="30" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/>`,labels:[{t:'المرجع',x:75,y:150,s:10},{t:'الخرج',x:195,y:150,s:10}],
 terms:[T(p.id+'.R1','R1',45,185),T(p.id+'.R2','R2',105,185),T(p.id+'.C1','C1',165,185),T(p.id+'.C2','C2',225,185)]});
const cpar=(c,x,y)=>c.div(c.mul(x,y),c.add(x,y));
const indZ=(c,M,n)=>{const s=1-n/M.ns;const Zr=x=>[M.R2/x,M.X2];const sf=Math.abs(s)<1e-4?1e-4:s,sb=Math.abs(2-s)<1e-4?1e-4:2-s;const Zf=cpar(c,[0,M.Xm],Zr(sf)),Zb=cpar(c,[0,M.Xm],Zr(sb));
 return {Zf,Zb,Zin:c.add(c.add([M.R1,M.X1],c.mul([0.5,0],Zf)),c.mul([0.5,0],Zb))}};
EXT.tind={els(a,p,c){const M=p.M,ph=c.ph,cc=c.C;const z=indZ(cc,M,ph.n||0);const e1={p:p.id+'.R1',n:p.id+'.R2',y:cc.div([1,0],z.Zin)};c.elsAC.push(e1);c.E[p.id+':m']=e1;
  const I1=ph.I1t||[0,0];const Ea=cc.mul(cc.mul([0,0.5*M.nr],I1),cc.sub(z.Zf,z.Zb));const Zo=[M.Ro,M.Xo],yo=cc.div([1,0],Zo);const e2={p:p.id+'.C1',n:p.id+'.C2',y:yo,i:cc.mul(Ea,yo)};c.elsAC.push(e2);ph.Eatac=cc.abs(Ea)},
 post(a,p,c){c.ph.I1t=c.r.cur(c.E[p.id+':m'])}};
/* مولد تاكو تزامني (مغناطيس دائم) */
PART.tsyn=p=>({w:200,h:220,sub:cut(p.M.name,36),art:`<circle cx="60" cy="80" r="30" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/>`,terms:[T(p.id+'.1','1',60,185),T(p.id+'.2','2',140,185)]});
EXT.tsyn={els(a,p,c){const M=p.M,ph=c.ph,n=Math.abs(ph.n||0);const E=M.Ks*n,ft=M.p*n/120;ph.ftac=ft;const Z=[M.Ri,M.Li*2*Math.PI*ft],y=c.C.div([1,0],Z);const e={p:p.id+'.1',n:p.id+'.2',y,i:c.C.mul([E,0],y)};c.elsAC.push(e)}};
/* مقياس التردد */
PART.fm=p=>({w:180,h:200,sub:'مقياس التردد',meters:[{id:p.id+':f',kind:'digital',x:15,y:45,w:150,h:46,unit:'Hz',dp:1}],terms:[T(p.id+'.a','',55,165),T(p.id+'.b','',125,165)]});
EXT.fm={els(a,p,c){c.elsAC.push({p:p.id+'.a',n:p.id+'.b',y:[1e-6,0]})},post(a,p,c){const of=a.nets().of,ts=c.P.find(q=>q.kind==='tsyn'),su=c.P.find(q=>q.kind==='ac1');
 const V=c.V(p.id+'.a',p.id+'.b');let f=0;if(V>0.05){if(ts&&[of[p.id+'.a'],of[p.id+'.b']].every(n=>[of[ts.id+'.1'],of[ts.id+'.2']].includes(n)))f=c.ph.ftac||0;else if(su)f=su.f}c.out[p.id+':f']=f;c.ph.fmeas=f}};
MQ.F=(a,q,ph)=>ph.fmeas!=null?{v:ph.fmeas,m:'fm'}:null;
/* مضخم التحكم: مصدر جهد متغير متعامد مع المرجع (+90° أو −90°) */
PART.acq=p=>({w:250,h:200,sub:'مضخم التحكم (جهد متعامد مع المرجع)',knobs:[{id:'K:'+p.id,lbl:'جهد التحكم',x:60,y:96,max:p.V,step:1,unit:'V',dp:0},{id:'PH:'+p.id,lbl:'الطور (0: +90°، 1: −90°)',x:150,y:96,max:1,step:1,unit:'',dp:0}],
 switches:[{id:'SW:'+p.id,lbl:'تشغيل',x:215,y:40}],terms:[T(p.id+'.1','~',70,170),T(p.id+'.2','~',180,170)]});
EXT.acq={src:1,els(a,p,c){const on=a.sw('SW:'+p.id);const V=a.knob('K:'+p.id),ang=Math.round(a.knob('PH:'+p.id))?-90:90;const e={p:p.id+'.1',n:p.id+'.2',y:on?[2,0]:[1e-9,0],i:on?c.C.mul(c.cpol(V,ang),[2,0]):[0,0]};c.elsAC.push(e);c.E[p.id]=e}};
/* محرك التحكم ثنائي الطور: R1 R2 ملف المرجع، C1 C2 ملف التحكم */
PART.srv=p=>({w:270,h:230,sub:cut(p.M.name,44),art:`<circle cx="60" cy="80" r="30" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/>`,labels:[{t:'ملف المرجع',x:75,y:155,s:10},{t:'ملف التحكم',x:195,y:155,s:10}],
 terms:[T(p.id+'.R1','R1',45,195),T(p.id+'.R2','R2',105,195),T(p.id+'.C1','C1',165,195),T(p.id+'.C2','C2',225,195)]});
EXT.srv={els(a,p,c){const M=p.M;const er={p:p.id+'.R1',n:p.id+'.R2',y:c.C.div([1,0],[M.Rw,M.Xw])},ec={p:p.id+'.C1',n:p.id+'.C2',y:c.C.div([1,0],[M.Rw,M.Xw])};c.elsAC.push(er,ec)},
 post(a,p,c){const M=p.M,ph=c.ph,cc=c.C;const Vr=c.r.vd(p.id+'.R1',p.id+'.R2'),Vc=c.r.vd(p.id+'.C1',p.id+'.C2');const ar=Math.atan2(Vr[1],Vr[0]),ac=Math.atan2(Vc[1],Vc[0]);
  const Vq=cc.abs(Vc)*Math.sin(ac-ar)*(cc.abs(Vr)/M.Vr);ph.Vq=Vq;const sg=Math.sign(Vq),v=Math.abs(Vq);const Ts=lin(M.cT)(v),w0=Math.max(lin(M.cW)(v),1);
  const lock=a.sw('SW:LOCK'),TL=a.knob('K:BR');const N=10,h=a.dt/N;let w=ph.w||0,Te=0;const kr=(cc.abs(Vr)/M.Vr)**2;
  for(let k=0;k<N;k++){Te=sg*Ts*(1-sg*w/w0)-(v<1?M.Tb*kr*w/M.cW[M.cW.length-1][1]:0);const Tl=TL*clamp(w/2,-1,1);if(lock)w=0;else w+=(Te-Tl)*h/M.J}
  if(lock)w=0;ph.acc=a.dt>0?(w-(ph.w||0))/a.dt:0;ph.w=w;ph.n=w*60/(2*Math.PI);ph.Tload=lock?Math.abs(Te):Math.abs(TL*clamp(w/2,-1,1));
  /* زمن الوصول إلى 63% بعد تشغيل جهد التحكم من السكون */
  if(v<1&&Math.abs(w)<0.5){ph.tst=null;ph.t63=null}else if(v>1&&(ph.vPrev||0)<1&&Math.abs(ph.wPrev||0)<0.5){ph.tst=ph.t-a.dt}ph.vPrev=v;ph.wPrev=w
  if(ph.tst!=null&&ph.t63==null&&Math.abs(w)>=0.632*w0){const w1=Math.abs(ph._w1||0),fr=(Math.abs(w)-0.632*w0)/Math.max(Math.abs(w)-w1,1e-9);ph.t63=ph.t-ph.tst-a.dt*Math.min(1,Math.max(0,fr))}ph._w1=w;
  c.out['BR:n']=ph.n;c.out['BR:T']=ph.Tload}};
MQ.Tau=(a,q,ph)=>ph.t63!=null?{v:ph.t63,m:'timer'}:null;
MQ.Wsp=(a,q,ph)=>({v:ph.w||0,m:'tach'});
/* محرك تحكم مستمر: A1 A2 المنتج، F1 F2 المجال */
PART.dcm2=p=>({w:270,h:220,sub:cut(p.M.name,44),art:`<circle cx="60" cy="80" r="30" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/>`,labels:[{t:'المنتج',x:75,y:150,s:10},{t:'المجال',x:195,y:150,s:10}],
 terms:[T(p.id+'.A1','A1',45,185,{pol:'+'}),T(p.id+'.A2','A2',105,185,{pol:'-'}),T(p.id+'.F1','F1',165,185,{pol:'+'}),T(p.id+'.F2','F2',225,185,{pol:'-'})]});
EXT.dcm2={els(a,p,c){const M=p.M,ph=c.ph;const E=M.K*Math.max(Math.abs(ph.If2||0),0.03*M.Ifr)*Math.sign(ph.If2||1)*(ph.w||0);const e={p:p.id+'.A1',n:p.id+'.A2',g:1/M.Ra,i:E/M.Ra};c.elsDC.push(e);c.Ed[p.id+':a']=e;const f={p:p.id+'.F1',n:p.id+'.F2',g:1/M.Rf};c.elsDC.push(f);c.Ed[p.id+':f']=f},
 post(a,p,c){const M=p.M,ph=c.ph;ph.If2=c.Id(c.Ed[p.id+':f']);const Ia=c.Id(c.Ed[p.id+':a']);ph.Ia2=Ia;const lock=a.sw('SW:LOCK'),TL=a.knob('K:BR');const N=10,h=a.dt/N;let w=ph.w||0;
  const Fe=Math.max(Math.abs(ph.If2),0.03*M.Ifr)*Math.sign(ph.If2||1);for(let k=0;k<N;k++){const Ia2=((c.Vd(p.id+'.A1',p.id+'.A2'))-M.K*Fe*w)/M.Ra;const Te=M.K*Fe*Ia2;const Tl=TL*clamp(w/2,-1,1)+M.Bf*w;if(lock)w=0;else w+=(Te-Tl)*h/M.J}
  ph.acc=a.dt>0?(w-(ph.w||0))/a.dt:0;ph.w=w;ph.n=w*60/(2*Math.PI);ph.Tload=Math.abs(TL*clamp(w/2,-1,1));c.out['BR:n']=ph.n;c.out['BR:T']=ph.Tload;
  if(a.hold('ovs2',Math.abs(ph.n)>1.6*M.nmax&&a.sw('SW:D'),0.5))a.mistake('overspeed')}};
/* المحرك العام: A1 A2 المنتج، D1 D2 ملف المجال التوالي */
PART.um=p=>({w:270,h:220,sub:cut(p.M.name,44),art:`<circle cx="60" cy="80" r="30" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/>`,labels:[{t:'المنتج',x:75,y:150,s:10},{t:'المجال التوالي',x:195,y:150,s:10}],
 terms:[T(p.id+'.A1','A1',45,185),T(p.id+'.A2','A2',105,185),T(p.id+'.D1','D1',165,185),T(p.id+'.D2','D2',225,185)]});
EXT.um={els(a,p,c){const M=p.M,ph=c.ph,of=a.nets().of,id=p.id;const sg=(of[id+'.A2']===of[id+'.D1']||of[id+'.A1']===of[id+'.D2'])?1:(of[id+'.A2']===of[id+'.D2']||of[id+'.A1']===of[id+'.D1'])?-1:0;ph.sgu=sg;
  const w=ph.w||0;const Re=Math.max(M.Ra+M.k*w*sg,0.2*M.Ra);const kf=c.f/M.f;
  const ea={p:id+'.A1',n:id+'.A2',y:c.C.div([1,0],[Re,M.Xa*kf])},es={p:id+'.D1',n:id+'.D2',y:c.C.div([1,0],[M.Rs,M.Xs*kf])};c.elsAC.push(ea,es);c.E[id+':a']=ea;
  const da={p:id+'.A1',n:id+'.A2',g:1/Re},ds={p:id+'.D1',n:id+'.D2',g:1/M.Rs};c.elsDC.push(da,ds);c.Ed[id+':a']=da},
 post(a,p,c){const M=p.M,ph=c.ph,id=p.id;const Ia=Math.hypot(c.I(c.E[id+':a']),c.Id(c.Ed[id+':a']));ph.Ium=Ia;const Te=ph.sgu*M.k*Ia*Ia;const lock=a.sw('SW:LOCK'),TL=a.knob('K:BR');const N=10,h=a.dt/N;let w=ph.w||0;
  for(let k=0;k<N;k++){const Tl=TL*clamp(w/5,-1,1)+M.Bf*w*Math.abs(w)/Math.max(Math.abs(w),1);if(lock)w=0;else w+=(Te-Tl)*h/M.J}
  ph.acc=a.dt>0?(w-(ph.w||0))/a.dt:0;ph.w=w;ph.n=w*60/(2*Math.PI);ph.Tload=Math.abs(TL*clamp(w/5,-1,1));c.out['BR:n']=ph.n;c.out['BR:T']=ph.Tload;
  if(a.hold('ovsu',Math.abs(ph.n)>1.5*M.N&&(a.sw('SW:S')||a.sw('SW:D')),1))a.mistake('overspeed')}};
/* المحرك التنافري: U1 U2 ملف الثابت، ومقبض زاوية الفرش */
PART.rep=p=>({w:250,h:220,sub:cut(p.M.name,40),art:`<circle cx="60" cy="80" r="30" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/>`,knobs:[{id:'AL:'+p.id,lbl:'زاوية الفرش α',x:170,y:85,min:-90,max:90,init:0,step:5,unit:'°',dp:0}],
 terms:[T(p.id+'.U1','U1',60,185),T(p.id+'.U2','U2',130,185)]});
EXT.rep={els(a,p,c){const M=p.M,al=a.knob('AL:'+p.id)*D;const Zm=M.Zmin+(M.Zmax-M.Zmin)*Math.sin(al)**2;const e={p:p.id+'.U1',n:p.id+'.U2',y:c.C.div([1,0],c.cpol(Zm,60))};c.elsAC.push(e);c.E[p.id+':m']=e},
 post(a,p,c){const M=p.M,ph=c.ph;const al=a.knob('AL:'+p.id)*D,s2=Math.sin(2*al);const kv=(c.V(p.id+'.U1',p.id+'.U2')/M.V)**2;const lock=a.sw('SW:LOCK'),TL=a.knob('K:BR');const N=10,h=a.dt/N;let w=ph.w||0;
  for(let k=0;k<N;k++){const Te=M.Tm*kv*(s2-Math.abs(s2)*w/M.w0)-M.Tm*kv*(0.02+0.6*Math.cos(2*al)**2)*w/M.w0;const Tl=TL*clamp(w/3,-1,1);if(lock)w=0;else w+=(Te-Tl)*h/M.J}
  ph.acc=a.dt>0?(w-(ph.w||0))/a.dt:0;ph.w=w;ph.n=w*60/(2*Math.PI);ph.Tload=Math.abs(TL*clamp(w/3,-1,1));c.out['BR:n']=ph.n;c.out['BR:T']=ph.Tload}};
/* أجهزة التزامن الذاتية: CX مرسل، CR مستقبل، CT محول تحكم. محاور ملفات الثابت S1 = 0°، S2 = −120°، S3 = +120° */
const SA=[0,-120,120];
const synPart=(kind)=>p=>({w:280,h:230,sub:{cx:'مرسل التحكم CX',cr:'مستقبل CR',ct:'محول التحكم CT'}[kind]+' — '+p.M.Vr+' V، '+p.M.f+' Hz',
 art:`<circle cx="60" cy="80" r="30" fill="#c9c4a6" stroke="#5c5744" stroke-width="3"/>`,nodes:[p.id+'.n'],
 knobs:kind==='cr'?[]:[{id:'TH:'+p.id,lbl:'زاوية الدوار',x:150,y:85,min:0,max:359,init:0,step:1,unit:'°',dp:0}],
 meters:kind==='cr'?[{id:p.id+':a',kind:'digital',x:110,y:55,w:150,h:46,unit:'°',dp:1}]:[],
 labels:[{t:'الدوار',x:75,y:150,s:10},{t:'الثابت',x:200,y:150,s:10}],
 terms:[T(p.id+'.R1','R1',45,190),T(p.id+'.R2','R2',105,190),T(p.id+'.S1','S1',160,190),T(p.id+'.S2','S2',205,190),T(p.id+'.S3','S3',250,190)]});
['cx','cr','ct'].forEach(k=>PART[k]=synPart(k));
const angOf=(a,p,ph)=>p.kind==='cr'?(ph['th_'+p.id]||0):a.knob('TH:'+p.id);
const synEls=(a,p,c)=>{const M=p.M,ph=c.ph,cc=c.C;const id=p.id;
 if(p.kind!=='ct'){const er={p:id+'.R1',n:id+'.R2',y:cc.div([1,0],[M.Rr,M.Xr])};c.elsAC.push(er);const vr=ph['vr_'+id]||[0,0],k=M.Vs/M.Vr;const th=angOf(a,p,ph);
  SA.forEach((s,j)=>{const ys=cc.div([1,0],[M.Rs,M.Xs]);const e=cc.mul(vr,[k*Math.cos((th-s)*D),0]);const el={p:id+'.S'+(j+1),n:id+'.n',y:ys,i:cc.mul(e,ys)};c.elsAC.push(el);c.E[id+':s'+j]=el})}
 else{SA.forEach((s,j)=>{const el={p:id+'.S'+(j+1),n:id+'.n',y:cc.div([1,0],[M.Rct,M.Xct])};c.elsAC.push(el)});
  const vs=ph['vs_'+id]||[[0,0],[0,0],[0,0]],th=angOf(a,p,ph);let E=[0,0];SA.forEach((s,j)=>{E=cc.add(E,cc.mul(vs[j],[(2/3)*(M.Vr/M.Vs)*Math.cos((th+90-s)*D),0]))});
  const yo=cc.div([1,0],[M.Rr,M.Xr]);c.elsAC.push({p:id+'.R1',n:id+'.R2',y:yo,i:cc.mul(E,yo)});ph['eo_'+id]=cc.abs(E)}};
const synPost=(a,p,c)=>{const M=p.M,ph=c.ph,cc=c.C,id=p.id;
 if(p.kind!=='ct')ph['vr_'+id]=c.r.vd(id+'.R1',id+'.R2');else ph['vs_'+id]=SA.map((s,j)=>c.r.vd(id+'.S'+(j+1),id+'.n'));
 if(p.kind==='cr'){/* العزم من تيارات الثابت: T = −Tm·sin(θr − θt) عند التوصيل الصحيح */const vr=ph['vr_'+id]||[0,0];const vrm=cc.abs(vr)||1e-9;
  const ip=SA.map((s,j)=>cc.mul(c.r.cur(c.E[id+':s'+j]),cc.conj(vr))[0]/vrm);const Smax=1.5*M.Vs*M.Rs/(2*(M.Rs*M.Rs+M.Xs*M.Xs));
  let th=ph['th_'+id]||0;const brk=a.knob('K:BR')||0;const N=10,h=a.dt/N;let Te=0;
  for(let k=0;k<N;k++){let S=0;SA.forEach((s,j)=>{S+=ip[j]*Math.sin((th-s)*D)});Te=-M.Tm*S/Smax;th+=(Te-brk)*h/M.Dm}
  ph['th_'+id]=th;ph['ang_'+id]=md(th,360);c.out[id+':a']=md(th,360);const cx=c.P.find(q=>q.kind==='cx');ph.lag=cx?((a.knob('TH:'+cx.id)-th)%360+540)%360-180:null;
  const kv=vrm/M.Vr;if(a.hold('slip'+id,brk>M.Tm*kv*1.02&&kv>0.3,1.5))a.once('syn-slip',{t:'المستقبل لا يستطيع اللحاق بالمرسل',why:'عزم الحمل على المستقبل أكبر من أقصى عزم يستطيع جهاز التزامن نقله، فيتأخر الدوار باستمرار ويدور بلا تزامن. أجهزة التزامن تنقل الزاوية بعزم صغير فقط؛ للعزم الكبير يُستعمل عمود الإدارة الكهربائي أو مضخم ومحرك.'})}};
['cx','cr','ct'].forEach(k=>EXT[k]={els:synEls,post:synPost});
MQ.Eo=(a,q,ph)=>null;
MQ.Lag=(a,q,ph)=>ph.lag!=null?{v:ph.lag,m:'scale'}:null;

/* ================= الآلات ================= */
const MACH={
 /* محركات الخطوة: e زوايا السكون لكل طور، Z عدد أسنان الدوار (أو أزواج الأقطاب) كما في تبويب «المختبر» */
 vr7:{short:'الشكل (1-7)',name:'محرك ممانعة متغيرة (الشكل 1-7)',N:3,Z:4,e:[0,30,60],labels:['A','B','C'],uni:1,step:30,R:5,Ir:1,Vs:5,note:'ثلاث مجموعات وستة أقطاب ودوار بأربعة أسنان: خطوة 30° (الشكل 1-7). مقاومة الطور (5 Ω) وتياره (1 A) افتراض منا.'},
 lvr:{short:'محرك معمل',name:'محرك ممانعة متغيرة 15°',N:3,Z:8,e:[0,15,30],labels:['A','B','C'],uni:1,step:15,R:6,Ir:2,Vs:12,note:'محرك معمل 15° لكل خطوة، 12 V و 2 A لكل طور (قيم توضيحية).'},
 pm8:{short:'الشكل (1-8)',name:'محرك مغناطيس دائم (الشكل 1-8)',N:2,Z:2,e:[0,45],labels:['A','B'],uni:0,step:45,R:5,Ir:1,Vs:5,note:'مجموعتان ودوار بأربعة أقطاب: خطوة 45° (الشكل 1-8). المقاومة والتيار افتراض منا.'},
 lpm:{short:'محرك معمل',name:'محرك مغناطيس دائم 15°',N:2,Z:6,e:[0,15],labels:['A','B'],uni:0,step:15,R:8,Ir:1.5,Vs:12,note:'محرك معمل 15° لكل خطوة (قيم توضيحية).'},
 hy11:{short:'الشكل (1-11)',name:'محرك هجين (الشكل 1-11)',N:2,Z:5,e:[0,18],labels:['A','B'],uni:0,step:18,R:4,Ir:1,Vs:4,note:'مجموعتان وخمسة أسنان في كل طرف للدوار: خطوة 18° (الشكل 1-11). المقاومة والتيار افتراض منا.'},
 lhy:{short:'محرك معمل',name:'محرك هجين 1.8°',N:2,Z:50,e:[0,1.8],labels:['A','B'],uni:0,step:1.8,R:2.8,Ir:1.5,Vs:4.2,note:'محرك هجين شائع 1.8° (200 خطوة في الدورة)، 2.8 Ω و 1.5 A لكل طور (قيم توضيحية).'},
 /* التاكو */
 tg21:{short:'مثال (2-1)',name:'تاكو مستمر مثال (2-1)',KE:1.1459,Ra:20,Rf:240,Ifr:0.1,nmax:3000,note:'12 V عند 1000 rpm وتيار مجال 0.1 A كما في المثال (K<sub>E</sub> = 1.1459·I<sub>f</sub> V·s/rad). مقاومة المنتج 20 Ω كما في تبويب «المختبر»، ومقاومة المجال (240 Ω) افتراض منا.'},
 ltg:{short:'تاكو معمل',name:'تاكو مستمر بمغناطيس دائم',pm:1,KE:0.0573,Ra:50,nmax:4000,note:'تاكو مغناطيس دائم 6 V لكل 1000 rpm، ومقاومة المنتج 50 Ω (قيم توضيحية).'},
 ind:{short:'تبويب المختبر',name:'تاكو حثي (قيم تبويب المختبر)',V:115,f:50,ns:3000,R1:30,X1:25,Xm:250,R2:200,X2:25,nr:1,Ro:30,Xo:25,nmax:3000,note:'115 V، 50 Hz، ودائرته المكافئة نفسها التي في تبويب «المختبر» (R<sub>1</sub> = 30، X<sub>1</sub> = 25، X<sub>m</sub> = 250، R<sub>2</sub> = 200، X<sub>2</sub> = 25 Ω)، ونسبة لفات 1 (افتراض).'},
 lind:{short:'تاكو معمل',name:'تاكو حثي معمل',V:230,f:50,ns:3000,R1:60,X1:50,Xm:500,R2:400,X2:50,nr:1,Ro:60,Xo:50,nmax:3000,note:'230 V، 50 Hz (قيم توضيحية).'},
 sy:{short:'افتراض',name:'تاكو تزامني (مغناطيس دائم)',p:4,Ks:0.01,Ri:30,Li:0.05,nmax:3000,note:'الكتاب لا يعطي أرقاماً: 4 أقطاب و 10 V لكل 1000 rpm (افتراض منا).'},
 lsy:{short:'تاكو معمل',name:'تاكو تزامني معمل',p:8,Ks:0.02,Ri:40,Li:0.04,nmax:3000,note:'8 أقطاب و 20 V لكل 1000 rpm (قيم توضيحية).'},
 /* محرك التحكم ثنائي الطور: cT و cW من الشكل (3-6): العزم عند السكون وسرعة اللاحمل لكل جهد تحكم */
 s36:{short:'مثال (3-1)',name:'محرك تحكم مثال (3-1)',Vr:115,f:60,Rw:60,Xw:80,cT:[[0,0],[70,0.5],[95,0.75],[110,1.0]],cW:[[0,0],[70,150],[95,225],[110,300]],Vc:110,J:0.01,Tb:0.5,
  note:'منحنيات الشكل (3-6): عند 110 V عزم السكون 1 N·m وسرعة اللاحمل 300 rad/s، وعند 95 V: 0.75 و 225، وعند 70 V: 0.5 و 150، و J = 0.01 kg·m² كما في المثال. جهد المرجع (115 V، 60 Hz) ومعاوقة الملفات افتراض منا.'},
 ls:{short:'محرك معمل',name:'محرك تحكم معمل (كأس مجرور)',Vr:220,f:50,Rw:300,Xw:250,cT:[[0,0],[110,0.12],[165,0.19],[220,0.25]],cW:[[0,0],[110,160],[165,250],[220,330]],Vc:220,J:0.0005,Tb:0.12,
  note:'محرك تحكم صغير بدوار كأس مجرور (قصور ذاتي صغير جداً)، 220 V، 50 Hz (قيم توضيحية).'},
 dc36:{short:'افتراض',name:'محرك تحكم مستمر',K:2.4,Ra:2,Rf:240,Ifr:0.1,Va:24,J:0.002,Bf:0.0002,nmax:1000,note:'الكتاب لا يعطي أرقاماً: 24 V، R<sub>a</sub> = 2 Ω، K·I<sub>f</sub> = 0.24 V·s/rad عند 0.1 A (افتراض منا).'},
 ldc:{short:'محرك معمل',name:'محرك تحكم مستمر معمل',K:4,Ra:4,Rf:480,Ifr:0.1,Va:48,J:0.003,Bf:0.0003,nmax:1200,note:'48 V، R<sub>a</sub> = 4 Ω (قيم توضيحية).'},
 /* المحرك العام: مثال (4-6) */
 g46:{short:'مثال (4-6)',name:'محرك عام مثال (4-6)',V:240,f:50,N:12000,Ra:6.15,Xa:9.4,Rs:4.55,Xs:3.2,PL:65,J:0.0004,
  note:'240 V، 6.5 A، معامل قدرة 0.94، 12000 rpm، R<sub>a</sub> = 6.15، X<sub>a</sub> = 9.4، R<sub>s</sub> = 4.55، X<sub>s</sub> = 3.2 Ω، والمفاقيد الدورانية 65 W كما في المثال. ثابت الآلة k محسوب منها، والتردد (50 Hz) افتراض.'},
 lum:{short:'محرك معمل',name:'محرك عام معمل',V:220,f:50,N:6000,Ra:5.5,Xa:7.4,Rs:3.5,Xs:3.2,PL:70,I:7,pf:0.9,J:0.0008,note:'قيم مثال (4-7): 220 V، 7 A، 0.9، 6000 rpm (نستعملها آلة ثانية للمقارنة).'},
 rep:{short:'افتراض',name:'محرك تنافري',V:220,f:50,Zmin:22,Zmax:110,Tm:2,w0:330,J:0.01,note:'الكتاب لا يعطي أرقاماً: 220 V، أقصى عزم بدء 2 N·m، وسرعة لاحمل 3150 rpm (افتراض منا).'},
 lrep:{short:'محرك معمل',name:'محرك تنافري معمل',V:230,f:50,Zmin:30,Zmax:150,Tm:1.2,w0:300,J:0.006,note:'230 V (قيم توضيحية).'},
 /* أجهزة التزامن */
 syb:{short:'افتراض',name:'أجهزة تزامن 115 V / 400 Hz',Vr:115,Vs:90,f:400,Rr:30,Xr:120,Rs:10,Xs:20,Rct:200,Xct:600,Tm:0.003,Dm:0.00001,note:'الكتاب لا يعطي أرقاماً؛ قيم شائعة لأجهزة التزامن العسكرية: الدوار 115 V، والثابت 90 V، 400 Hz، وأقصى عزم للمستقبل 0.003 N·m (افتراض منا).'},
 lsyn:{short:'أجهزة معمل',name:'أجهزة تزامن معمل 220 V / 50 Hz',Vr:220,Vs:170,f:50,Rr:60,Xr:200,Rs:20,Xs:40,Rct:400,Xct:1200,Tm:0.02,Dm:0.00006,note:'220 V، 50 Hz، والثابت 170 V، وأقصى عزم للمستقبل 0.02 N·m (قيم توضيحية).'}};
/* ثابت المحرك العام من نقطة التشغيل المقننة */
['g46','lum'].forEach(k=>{const M=MACH[k];const I=M.I||6.5,pf=M.pf||0.94,w=M.N*2*Math.PI/60;const R=M.Ra+M.Rs;M.Ir=I;M.k=(M.V*pf-I*R)/(I*w);M.Bf=M.PL/(w*w);M.Tr=M.k*I*I-M.PL/w});
/* ================= أدوات مشتركة ================= */
const DCS=(id,V,o)=>Object.assign({kind:'dcs',id,V,step:0.05,lbl:'مصدر مستمر'},o||{});
const AC1=(V,f,o)=>Object.assign({kind:'ac1',id:'S',V:Math.round(V*1.15/5)*5,f,init:V,lbl:'المصدر المتردد'},o||{});
const BRKs=(Tmax,step)=>({kind:'brake',id:'BR',Tmax,step:step||0.01,lbl:'الفرملة'});
const VMd=(id,r)=>({kind:'vm',id,dc:1,ranges:r||[3,10,30]}),AMd=(id,r)=>({kind:'am',id,dc:1,ranges:r||[0.3,1,3]});
const VMa=(id,r)=>({kind:'vm',id,ranges:r||[3,10,30,100]}),AMa=(id,r)=>({kind:'am',id,ranges:r||[0.1,0.3,1,3,10]});
const PMd=(M,o)=>Object.assign({kind:'pm',id:'PM',nmax:M.nmax||3000,lbl:'محرك الإدارة'},o||{});
const RN={k:'n',h:'السرعة n (rpm)',t:'N',dp:0};
const steady=a=>Math.abs(a.S.phys.acc||0)<Math.max(0.5,0.01*Math.abs(a.S.phys.w||0))&&(a.S.phys.tOn||0)>1;
const atN=(a,n)=>Math.abs((a.S.phys.n||0)-n)<=Math.max(2,0.005*Math.abs(n));
const nCol=(cols,extra)=>a=>{if(!a.sw('SW:PM'))return 'شغّل محرك الإدارة.';if(extra){const e=extra(a);if(e)return e}const i=cols.findIndex(n=>atN(a,n));return i<0?'اضبط سرعة محرك الإدارة على '+cols.join(' أو ')+' rpm وانتظر حتى تثبت.':i};
/* تجارب محرك الخطوة: الجدول خطوات التسلسل بالترتيب، والعمود التالي يُقبل عندما تطابق تيارات الأطوار الصف المطلوب */
const lbl=(M,row)=>row.map((v,k)=>v?(v<0?'−':'')+M.labels[k]:'').filter(Boolean).join(' و ')||'—';
const seqEx=(name,rowsOf,fig)=>({name,build:(M,mk)=>{const rows=rowsOf(M);const step=M.step*(rows.half?0.5:1);const cols=rows.map((r,i)=>(i+1)+': '+lbl(M,r));
 return {figRef:fig||'',hint:'غيّر مفاتيح الأطوار حسب الصف التالي في الجدول، ثم اضغط «سجّل القراءة».',
  wiring:'+ المصدر ← الأميتر A1 ← دخل صندوق المفاتيح +، و − الصندوق ← − المصدر. ولكل طور: خرج الصندوق '+M.labels.map(l=>l+'+ ← '+l+'+ و '+l+'− ← '+l+'−').join('، ')+' في المحرك. اضبط المصدر على '+M.Vs+' V.',
  mistakes:{'stp-over':{t:'تيار الطور أكبر من المقنن',why:'جهد المصدر أكبر من الجهد المقنن للطور (التيار = V/R)، فتسخن الملفات. اضبط المصدر على الجهد المقنن.',fatal:true}},
  parts:[DCS('D',Math.ceil(M.Vs*2)),{kind:'psw',id:'PS',n:M.N,labels:M.labels,bip:!M.uni,lbl:'مفاتيح الأطوار'},{kind:'stp',id:'STP',M,lbl:M.name},AMd('A1',[1,3,10])],
  tables:[{id:'t',title:'تسلسل التغذية — خطوة '+fx(step,step<2?1:0)+'°',xh:'الأطوار المغذاة',cols,col:a=>{if(!a.sw('SW:D'))return 'شغّل المصدر.';const ph=a.S.phys;if(Math.abs(a.knob('K:D')-M.Vs)>0.05*M.Vs)return 'اضبط المصدر على '+M.Vs+' V.';
    const T2=a.S.rec.t||{};const i=rows.findIndex((r,j)=>!T2[j]);if(i<0)return 'اكتمل الجدول.';const cur=(ph.ik||[]).map(x=>Math.abs(x)<0.3?0:Math.sign(x));const want=rows[i];
    if(!want.every((v,k)=>v===cur[k]))return 'غذِّ الصف '+(i+1)+': '+lbl(M,want)+' (الآن: '+lbl(M,cur)+').';return (ph.dth||0)<0.01?i:'انتظر حتى يستقر الدوار.'},
   rows:[{k:'a',h:'زاوية الدوار (°)',t:'Ang',dp:2}]}],
  check:rec=>{const t=rec.t||{};const as=rows.map((r,i)=>t[i]&&t[i].a);if(as.filter(x=>x!=null).length<2)return 'سجّل خطوتين على الأقل.';const ds=[];for(let i=1;i<as.length;i++)if(as[i]!=null&&as[i-1]!=null){let d=((as[i]-as[i-1])%360+540)%360-180;ds.push(d)}
   const dir=rows.dir||1;return `زاوية كل خطوة: ${ds.map(d=>fx(d,2)+'°').join('، ')} ${ds.every(d=>Math.abs(d-dir*step)<0.05*step+0.01)?'✓':'✗'} (المتوقع ${fx(dir*step,2)}°${dir>0?' ضد عقارب الساعة':' مع عقارب الساعة'}).`+(M.uni?' في محرك الممانعة المتغيرة يتحرك الدوار ليقابل أقرب أسنانه الأقطاب المغذاة (أقل ممانعة)، والاتجاه يحدده ترتيب التغذية.':' في محرك المغناطيس الدائم والهجين يعتمد الاتجاه على قطبية التيار، لذلك تحتاج الأطوار مفاتيح تعكس القطبية.')}}}});
const fullUni=M=>{const r=[];for(let k=0;k<=M.N;k++){const x=Array(M.N).fill(0);x[k%M.N]=1;r.push(x)}return r};
const halfUni=M=>{const r=[];for(let k=0;k<M.N;k++){const x=Array(M.N).fill(0);x[k]=1;r.push(x);const y=x.slice();y[(k+1)%M.N]=1;r.push(y)}const z=Array(M.N).fill(0);z[0]=1;r.push(z);r.half=1;return r};
const fullBip=()=>[[1,0],[0,1],[-1,0],[0,-1],[1,0]];
const twoBip=()=>[[1,1],[-1,1],[-1,-1],[1,-1],[1,1]];
const EX={
 vr:Object.assign(seqEx('الخطوة الكاملة',fullUni,'1-7'),{book:'vr7',lab:'lvr'}),
 vrh:Object.assign(seqEx('نصف الخطوة',halfUni,'1-5'),{book:'vr7',lab:'lvr'}),
 pm:Object.assign(seqEx('الخطوة الكاملة بعكس القطبية',fullBip,'1-9'),{book:'pm8',lab:'lpm'}),
 hy:Object.assign(seqEx('طور واحد في كل خطوة',fullBip,'1-12'),{book:'hy11',lab:'lhy'}),
 hy2:Object.assign(seqEx('الطوران معاً',twoBip,'1-13'),{book:'hy11',lab:'lhy'})};
/* ---------- التاكو ---------- */
Object.assign(EX,{
 tdc:{name:'خاصية الجهد والسرعة',book:'tg21',lab:'ltg',build:M=>{const cols=[500,1000,1500,2000];return {figRef:'2-2',
  wiring:'محرك الإدارة يدير التاكو. خرج التاكو + ← + الفولتميتر المستمر V1، و − ← − V1.'+(M.pm?'':' والمجال: + مصدر المجال ← الأميتر A1 ← F1، و F2 ← − المصدر، واضبط التيار على '+M.Ifr+' A.'),
  parts:[PMd(M),{kind:'tdc',id:'TG',M,lbl:M.name},VMd('V1',[3,10,30,100])].concat(M.pm?[]:[DCS('F',30),AMd('A1',[0.1,0.3,1])]),
  tables:[{id:'t',title:'جهد التاكو مع السرعة (بلا حمل)',xh:'n (rpm)',cols,col:nCol(cols,a=>M.pm?0:(!a.sw('SW:F')?'شغّل مصدر المجال.':Math.abs(Math.abs(a.S.phys.Itf||0)-M.Ifr)>0.02*M.Ifr?'اضبط تيار المجال على '+M.Ifr+' A.':0)),
   rows:[RN,{k:'V',h:'جهد الخرج V (V)',t:'V',dc:1,a:'TG.+',b:'TG.-',dp:2},{k:'K',h:'V لكل 1000 rpm',calc:v=>v.V/v.n*1000,dp:3}],px:'n',py:'V',plot:true,xu:'n (rpm)',yu:'V (V)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((n,i)=>t[i]).filter(v=>v&&v.K!=null);if(!rows.length)return 'سجّل القراءات.';const Ke=(M.pm?M.KE:M.KE*M.Ifr)*2*Math.PI*1000/60;
   return `ثابت التاكو: ${rows.map(v=>fx(v.K,2)).join('، ')} V لكل 1000 rpm ${rows.every(v=>Math.abs(v.K-Ke)<0.02*Ke)?'✓':'✗'} (المتوقع ${fx(Ke,2)}${M.short==='مثال (2-1)'?'، وفي المثال 12 V عند 1000 rpm':''}). الخاصية خط مستقيم يمر بنقطة الأصل: الجهد يتناسب مع السرعة عند ثبات المجال.`}}}},
 tdl:{name:'أثر الحمل على الخرج',book:'tg21',lab:'ltg',build:M=>{const RLs=[10000,1000,200];const n0=1000;return {figRef:'2-3',
  wiring:'مثل التجربة السابقة، وأضف المقاومة المتغيرة R<sub>L</sub> بين طرفي الخرج (على التوازي مع الفولتميتر).',
  parts:[PMd(M),{kind:'tdc',id:'TG',M,lbl:M.name},{kind:'rv',id:'RL',max:10000,init:10000,step:10},VMd('V1',[3,10,30,100])].concat(M.pm?[]:[DCS('F',30),AMd('A1',[0.1,0.3,1])]),
  tables:[{id:'t',title:'خرج التاكو عند 1000 rpm مع حمل مختلف',xh:'R<sub>L</sub> (Ω)',cols:RLs,col:a=>{const c=nCol([n0])(a);if(typeof c==='string')return c;if(!M.pm&&Math.abs(Math.abs(a.S.phys.Itf||0)-M.Ifr)>0.02*M.Ifr)return 'اضبط تيار المجال على '+M.Ifr+' A.';const i=RLs.findIndex(r=>Math.abs(a.knob('K:RL')-r)<1);return i<0?'اضبط R<sub>L</sub> على '+RLs.join(' أو ')+' Ω.':i},
   rows:[{k:'V',h:'جهد الخرج V (V)',t:'V',dc:1,a:'TG.+',b:'TG.-',dp:3},{k:'er',h:'الخطأ عن جهد اللاحمل (%)',calc:v=>{const E=(M.pm?M.KE:M.KE*M.Ifr)*2*Math.PI*n0/60;return 100*(E-v.V)/E},dp:2}]}],
  check:rec=>{const t=rec.t||{};const E=(M.pm?M.KE:M.KE*M.Ifr)*2*Math.PI*n0/60;const rows=RLs.map((R,i)=>t[i]?[R,t[i]]:null).filter(x=>x&&x[1].V!=null);if(!rows.length)return 'سجّل القراءات.';
   return rows.map(([R,v])=>{const Ve=E*R/(R+M.Ra);return `R<sub>L</sub> = ${R} Ω: V = ${fx(v.V,3)} V، والمحسوب E·R<sub>L</sub>/(R<sub>L</sub> + R<sub>a</sub>) = ${fx(Ve,3)} V ${ok(v.V,Ve,0.01)}`}).join('<br>')+'<br>كلما صغرت مقاومة الحمل زاد الهبوط على مقاومة المنتج وزاد الخطأ. لذلك يُوصّل التاكو بحمل مقاومته كبيرة جداً.'}}}},
 tind:{name:'التاكو الحثي',book:'ind',lab:'lind',build:M=>{const cols=[500,1000,1500,2000];return {figRef:'2-5',
  wiring:'المصدر المتردد ← الملف الرئيسي R1 R2 (المرجع). والملف المساعد C1 C2 ← الفولتميتر V1. محرك الإدارة يدير التاكو.',
  parts:[AC1(M.V,M.f),PMd(M,{nmin:-M.nmax}),{kind:'tind',id:'TG',M,lbl:M.name},VMa('V1',[1,3,10,30])],
  tables:[{id:'t',title:'جهد الملف المساعد مع السرعة — المرجع '+M.V+' V، '+M.f+' Hz',xh:'n (rpm)',cols,col:nCol(cols,a=>!a.sw('SW:S')?'شغّل المصدر المتردد.':Math.abs(a.knob('K:S')-M.V)>0.02*M.V?'اضبط المرجع على '+M.V+' V.':0),
   rows:[RN,{k:'V',h:'جهد الخرج E<sub>a</sub> (V)',t:'V',a:'TG.C1',b:'TG.C2',dp:3},{k:'K',h:'V لكل 1000 rpm',calc:v=>v.V/v.n*1000,dp:3}],px:'n',py:'V',plot:true,xu:'n (rpm)',yu:'Ea (V)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((n,i)=>t[i]).filter(v=>v&&v.K!=null);if(rows.length<2)return 'سجّل القراءات.';const k0=rows[0].K;
   return `الخرج لكل 1000 rpm: ${rows.map(v=>fx(v.K,3)).join('، ')} V ${rows.every(v=>Math.abs(v.K-k0)<0.06*k0)?'✓':'✗'}: الجهد يتناسب تقريباً مع السرعة، وتردده تردد المرجع (${M.f} Hz) مهما تغيرت السرعة. وعند عكس الدوران ينعكس طور الخرج 180°. الانحراف البسيط عن الخط المستقيم سببه أن المجال الأمامي والخلفي لا يتساويان تماماً.`}}}},
 tsyn:{name:'التاكو التزامني والمعايرة',book:'sy',lab:'lsy',build:M=>{const cols=[600,1200,1800,2400];return {figRef:'',
  wiring:'محرك الإدارة يدير التاكو. خرج التاكو 1 و 2 ← الفولتميتر V1 ومقياس التردد (على التوازي).',
  parts:[PMd(M),{kind:'tsyn',id:'TG',M,lbl:M.name},VMa('V1',[10,30,100]),{kind:'fm',id:'FM',lbl:'مقياس التردد'}],
  tables:[{id:'t',title:'خرج التاكو التزامني ('+M.p+' أقطاب)',xh:'n (rpm)',cols,col:nCol(cols),
   rows:[RN,{k:'V',h:'الجهد V (V)',t:'V',a:'TG.1',b:'TG.2',dp:2},{k:'f',h:'التردد f (Hz)',t:'F',dp:1},{k:'nf',h:'n = 120f/P (rpm)',calc:v=>120*v.f/M.p,dp:0}],px:'n',py:'f',plot:true,xu:'n (rpm)',yu:'f (Hz)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((n,i)=>t[i]).filter(v=>v&&v.nf!=null);if(!rows.length)return 'سجّل القراءات.';
   return `السرعة من التردد: ${rows.map(v=>fx(v.nf,0)+' ← '+fx(v.n,0)).join('، ')} rpm ${rows.every(v=>Math.abs(v.nf-v.n)<0.01*v.n)?'✓':'✗'}. التردد يعطي السرعة بدقة كبيرة لأنه لا يتأثر بالحمل ولا بالحرارة، أما الجهد فيتأثر بهما. المعايرة: ${fx(rows[rows.length-1].V/rows[rows.length-1].n*1000,2)} V لكل 1000 rpm.`}}}}
});
/* ---------- محركات التحكم ---------- */
const SRVW='المرجع: المصدر المتردد ← R1 و R2. التحكم: خرج المضخم ← C1 و C2. الفولتميتر V1 على ملف التحكم. المحرك مربوط بالفرملة.';
Object.assign(EX,{
 srv:{name:'جهد التحكم والسرعة',book:'s36',lab:'ls',build:M=>{const Vs=M.cW.slice(1).map(x=>x[0]);return {figRef:'3-2',
  wiring:SRVW+' بعد التسجيل اعكس طور المضخم (المقبض الثاني) ولاحظ الاتجاه.',
  parts:[AC1(M.Vr,M.f),{kind:'acq',id:'AMP',V:Math.ceil(M.Vc*1.1),lbl:'مضخم التحكم'},{kind:'srv',id:'MOT',M,lbl:M.name},BRKs(Math.ceil(M.cT[M.cT.length-1][1]*12)/10),VMa('V1',[30,100,300])],
  tables:[{id:'t',title:'بلا حمل — المرجع '+M.Vr+' V',xh:'جهد التحكم (V)',cols:Vs,col:a=>{if(!a.sw('SW:S')||!a.sw('SW:AMP'))return 'شغّل المصدر والمضخم.';if(a.knob('K:BR')>0.001)return 'أزل الحمل.';if(Math.round(a.knob('PH:AMP')))return 'ضع طور المضخم على 0 (+90°).';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Vs.findIndex(v=>Math.abs(a.knob('K:AMP')-v)<0.6);return i<0?'اضبط جهد التحكم على '+Vs.join(' أو ')+' V.':i},
    rows:[{k:'Vc',h:'V<sub>c</sub> (V)',t:'V',a:'MOT.C1',b:'MOT.C2',dp:1},RN,{k:'w',h:'ω (rad/s)',calc:v=>v.n*2*Math.PI/60,dp:1}],px:'Vc',py:'w',plot:true,xu:'Vc (V)',yu:'ω (rad/s)'},
   {id:'r',title:'عكس طور جهد التحكم',cols:['−90°'],col:a=>{if(!a.sw('SW:AMP'))return 'شغّل المضخم.';if(!Math.round(a.knob('PH:AMP')))return 'اعكس طور المضخم (المقبض الثاني = 1).';return steady(a)?0:'انتظر حتى تثبت السرعة.'},rows:[RN]}],
  check:rec=>{const t=rec.t||{};const rows=Vs.map((v,i)=>t[i]?[v,t[i]]:null).filter(x=>x&&x[1].w!=null);if(!rows.length)return 'سجّل القراءات.';const r=T0(rec,'r');
   return 'سرعة اللاحمل مقارنة بالشكل (3-6):<br>'+rows.map(([v,x])=>{const we=lin(M.cW)(v);return `${v} V: ω = ${fx(x.w,0)} rad/s والشكل ${fx(we,0)} ${ok(x.w,we,0.03)}`}).join('<br>')+(r.n!=null?`<br>بعد عكس طور التحكم: n = ${fx(r.n,0)} rpm ${r.n<0?'✓':'✗'}: اتجاه الدوران يحدده هل جهد التحكم متقدم أم متأخر 90° عن المرجع.`:'')}}}},
 srvT:{name:'العزم والسرعة',book:'s36',lab:'ls',build:M=>{const Ts0=M.cT[M.cT.length-1][1],w0=M.cW[M.cW.length-1][1];const Ts=[0,0.25,0.5,0.75].map(k=>Math.round(Ts0*k*1000)/1000);return {figRef:'3-6',
  wiring:SRVW+' اضبط جهد التحكم على '+M.Vc+' V.',
  parts:[AC1(M.Vr,M.f),{kind:'acq',id:'AMP',V:Math.ceil(M.Vc*1.1),lbl:'مضخم التحكم'},{kind:'srv',id:'MOT',M,lbl:M.name},BRKs(Math.ceil(Ts0*12)/10,0.001),VMa('V1',[30,100,300])],
  tables:[{id:'t',title:'جهد التحكم '+M.Vc+' V',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{if(!a.sw('SW:S')||!a.sw('SW:AMP'))return 'شغّل المصدر والمضخم.';if(Math.abs(a.knob('K:AMP')-M.Vc)>0.6)return 'اضبط جهد التحكم على '+M.Vc+' V.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<0.0006);return i<0?'اضبط عزم الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[{k:'T',h:'العزم T (N·m)',t:'Tq',dp:3},RN,{k:'w',h:'ω (rad/s)',calc:v=>v.n*2*Math.PI/60,dp:1}],px:'w',py:'T',plot:true,xu:'ω (rad/s)',yu:'T (N·m)'}],
  check:rec=>{const t=rec.t||{};const rows=Ts.map((T,i)=>t[i]?[T,t[i]]:null).filter(x=>x&&x[1].w!=null);if(!rows.length)return 'سجّل القراءات.';
   return 'الخاصية خط مستقيم: T = T<sub>s</sub>(1 − ω/ω<sub>0</sub>):<br>'+rows.map(([T,v])=>{const we=w0*(1-T/Ts0);return `T = ${T}: ω = ${fx(v.w,0)} rad/s والمعادلة ${fx(we,0)} ${ok(v.w,we,0.02)}`}).join('<br>')+'<br>الميل السالب يعطي المحرك إخماداً ذاتياً يجعل نظام التحكم مستقراً.'}}}},
 tau:{name:'الثابت الزمني',book:'s36',lab:'ls',build:M=>{const Ts0=M.cT[M.cT.length-1][1],w0=M.cW[M.cW.length-1][1];const tau=M.J*w0/Ts0;return {figRef:'3-5',
  wiring:SRVW+' اضبط جهد التحكم على '+M.Vc+' V والمضخم مطفأ، ثم شغّله والمحرك ساكن: مؤقت المنضدة يقيس زمن الوصول إلى 63% من سرعة اللاحمل.',
  parts:[AC1(M.Vr,M.f),{kind:'acq',id:'AMP',V:Math.ceil(M.Vc*1.1),lbl:'مضخم التحكم'},{kind:'srv',id:'MOT',M,lbl:M.name},BRKs(Math.ceil(Ts0*12)/10,0.001)],
  tables:[{id:'t',title:'استجابة السرعة لجهد تحكم مفاجئ '+M.Vc+' V بلا حمل',cols:['—'],col:a=>{if(a.knob('K:BR')>0.0005)return 'أزل الحمل.';if(Math.abs(a.knob('K:AMP')-M.Vc)>0.6)return 'اضبط جهد التحكم على '+M.Vc+' V.';return a.S.phys.t63!=null?0:'شغّل المضخم والمحرك ساكن لتبدأ القياس.'},
   rows:[{k:'tau',h:'الزمن حتى 63% من ω<sub>0</sub> (s)',t:'Tau',dp:3},{k:'w',h:'السرعة النهائية ω<sub>0</sub> (rad/s)',t:'Wsp',dp:1}]}],
  check:rec=>{const v=T0(rec,'t');if(v.tau==null)return 'سجّل القياس.';return `τ المقاس = ${fx(v.tau,3)} s، والمحسوب τ = J·ω<sub>0</sub>/T<sub>s</sub> = ${M.J} × ${w0} / ${Ts0} = ${fx(tau,3)} s ${ok(v.tau,tau,0.06)}. محرك الكأس المجرور قصوره الذاتي صغير جداً فثابته الزمني صغير ويستجيب بسرعة.`}}}},
 dca:{name:'التحكم بجهد المنتج',book:'dc36',lab:'ldc',build:M=>{const cols=[0.25,0.5,0.75,1].map(k=>M.Va*k);return {figRef:'',
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'تيار المجال انقطع أو صار صغيراً جداً والمنتج تحت الجهد، فتزيد السرعة بلا حد (السرعة تتناسب عكسياً مع الفيض). في محركات التحكم المستمرة يُشغّل المجال أولاً ويُفصل آخراً.',fatal:true}},
  wiring:'مصدر المجال F ← الأميتر A2 ← F1، و F2 ← − F (اضبط '+M.Ifr+' A أولاً). مصدر المنتج D ← الأميتر A1 ← A1، و A2 ← − D. الفولتميتر V1 على المنتج. المحرك مربوط بالفرملة.',
  parts:[DCS('F',Math.ceil(M.Rf*M.Ifr*1.5)),DCS('D',Math.ceil(M.Va*1.2)),{kind:'dcm2',id:'MOT',M,lbl:M.name},BRKs(0.5,0.001),AMd('A1',[1,3,10]),AMd('A2',[0.1,0.3,1]),VMd('V1',[10,30,100])],
  tables:[{id:'t',title:'المجال ثابت '+M.Ifr+' A وبلا حمل',xh:'V<sub>a</sub> (V)',cols,col:a=>{if(!a.sw('SW:F')||Math.abs(Math.abs(a.S.phys.If2||0)-M.Ifr)>0.02*M.Ifr)return 'شغّل مصدر المجال واضبط تيار المجال على '+M.Ifr+' A.';if(!a.sw('SW:D'))return 'شغّل مصدر المنتج.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const V=Math.abs(a.S.phys.read.V1||0);const i=cols.findIndex(x=>Math.abs(V-x)<0.01*x+0.05);return i<0?'اضبط جهد المنتج على '+cols.join(' أو ')+' V.':i},
   rows:[{k:'V',h:'V<sub>a</sub> (V)',t:'V',dc:1,a:'MOT.A1',b:'MOT.A2',dp:2},{k:'I',h:'I<sub>a</sub> (A)',t:'I',dc:1,el:'MOT:a',dp:3},RN],px:'V',py:'n',plot:true,xu:'Va (V)',yu:'n (rpm)'}],
  check:rec=>{const t=rec.t||{};const rows=cols.map((c,i)=>t[i]).filter(v=>v&&v.n!=null);if(!rows.length)return 'سجّل القراءات.';const Kf=M.K*M.Ifr;
   return rows.map(v=>{const ne=(v.V-v.I*M.Ra)/Kf*60/(2*Math.PI);return `V<sub>a</sub> = ${fx(v.V,1)} V: n = ${fx(v.n,0)} rpm، والمعادلة (V<sub>a</sub> − I<sub>a</sub>R<sub>a</sub>)/Kφ = ${fx(ne,0)} ${ok(v.n,ne,0.02)}`}).join('<br>')+'<br>السرعة تتناسب خطياً مع جهد المنتج: لذلك التحكم بجهد المنتج هو الأشيع في محركات التحكم المستمرة.'}}}}
});
/* ---------- المحرك العام والتنافري ---------- */
Object.assign(EX,{
 ud:{name:'على المستمر وعلى المتردد',book:'g46',lab:'lum',build:M=>{const TL=Math.round(M.Tr*1000)/1000;return {figRef:'4-1',
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'المحرك العام (محرك توالٍ) بلا حمل تقريباً تزيد سرعته جداً لأن الفيض يقل مع التيار. لا تشغّله إلا وعليه حمل.',fatal:true}},
  wiring:'وصّل المنتج والمجال على التوالي: A2 ← D1. ثم المصدر ← الأميتر A1 ← A1، و D2 ← المصدر. جرّب المصدر المستمر D أولاً ثم المتردد S (افصل وغيّر التوصيل). الفولتميتر المناسب على المحرك. اضبط الحمل '+TL+' N·m قبل التشغيل.',
  parts:[DCS('D',Math.round(M.V*1.1)),AC1(M.V,M.f,{init:0}),{kind:'um',id:'MOT',M,lbl:M.name},BRKs(Math.ceil(M.Tr*25)/10,0.001),AMd('A1',[3,10,30]),AMa('A2',[3,10,30]),VMd('V1',[100,300]),VMa('V2',[100,300])],
  tables:[{id:'t',title:'حمل ثابت '+TL+' N·m وجهد '+M.V+' V',xh:'المصدر',cols:['مستمر','متردد'],col:a=>{if(Math.abs(a.knob('K:BR')-TL)>0.0006)return 'اضبط الحمل على '+TL+' N·m.';const d=a.sw('SW:D'),s=a.sw('SW:S');if(d===s)return 'شغّل مصدراً واحداً فقط.';if(Math.abs(a.knob(d?'K:D':'K:S')-M.V)>0.01*M.V)return 'اضبط الجهد على '+M.V+' V.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';return d?0:1},
   rows:[RN,{k:'I',h:'التيار (A)',t:'Ium',dp:2}]}],
  check:rec=>{const t=rec.t||{};if(!t[0]||!t[1]||t[1].n==null||t[0].n==null)return 'سجّل الحالتين.';
   return `السرعة على المستمر ${fx(t[0].n,0)} rpm وعلى المتردد ${fx(t[1].n,0)} rpm ${t[0].n>t[1].n?'✓':'✗'}`+(M.short==='مثال (4-6)'?` (المثال: 12000 rpm على المتردد ${ok(t[1].n,12000,0.02)})`:'')+`. بالعزم نفسه التيار نفسه تقريباً، لكن على المتردد يهبط جزء من الجهد على مفاعلة الملفين (I·X)، فتقل القوة الدافعة العكسية وتقل السرعة.`}}}},
 ut:{name:'خاصية الحمل',book:'g46',lab:'lum',build:M=>{const Ts=[0.7,0.85,1,1.3].map(k=>Math.round(M.Tr*k*1000)/1000);return {figRef:'4-3',
  mistakes:{overspeed:{t:'سرعة زائدة خطرة',why:'المحرك العام (محرك توالٍ) بلا حمل تقريباً تزيد سرعته جداً لأن الفيض يقل مع التيار. لا تشغّله إلا وعليه حمل.',fatal:true}},
  wiring:'المنتج والمجال على التوالي (A2 ← D1)، والمصدر المتردد ← الأميتر A2 ← A1، و D2 ← المصدر. اضبط الحمل قبل التشغيل.',
  parts:[AC1(M.V,M.f,{init:M.V}),{kind:'um',id:'MOT',M,lbl:M.name},BRKs(Math.ceil(M.Tr*25)/10,0.001),AMa('A2',[3,10,30])],
  tables:[{id:'t',title:'على المتردد '+M.V+' V',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<0.0006);return i<0?'اضبط الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[RN,{k:'I',h:'I (A)',t:'I',el:'MOT:a',dp:2}],px:'n',py:'_T',plot:false}],
  check:rec=>{const t=rec.t||{};const ns=Ts.map((T,i)=>t[i]&&t[i].n);if(ns.some(x=>x==null))return 'أكمل الأعمدة.';
   return `السرعة: ${ns.map(n=>fx(n,0)).join(' ← ')} rpm ${ns.every((n,i)=>!i||n<ns[i-1])?'✓':'✗'}: خاصية توالٍ؛ السرعة تهبط بشدة مع زيادة الحمل، وتزيد كثيراً عند الحمل الخفيف. لذلك يُستعمل المحرك العام في الأدوات التي يبقى عليها حمل (المثقاب، الخلاط، المكنسة).`}}}},
 rp:{name:'زاوية الفرش',book:'rep',lab:'lrep',build:M=>{const As=[-45,0,30,45];return {figRef:'4-8',
  wiring:'المصدر المتردد ← الأميتر A1 ← U1، و U2 ← المصدر. المحرك مربوط بالفرملة (بلا حمل).',
  parts:[AC1(M.V,M.f,{init:M.V}),{kind:'rep',id:'MOT',M,lbl:M.name},BRKs(M.Tm,0.01),AMa('A1',[1,3,10,30])],
  tables:[{id:'t',title:'بلا حمل — '+M.V+' V',xh:'زاوية الفرش α (°)',cols:As,col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(!steady(a))return 'انتظر حتى تثبت السرعة.';const i=As.findIndex(x=>Math.abs(a.knob('AL:MOT')-x)<0.5);return i<0?'اضبط زاوية الفرش على '+As.join(' أو ')+'°.':i},
   rows:[RN,{k:'I',h:'I (A)',t:'I',el:'MOT:m',dp:2}]}],
  check:rec=>{const t=rec.t||{};if(As.some((x,i)=>!t[i]||t[i].n==null))return 'أكمل الأعمدة.';const [a,b,c,d]=As.map((x,i)=>t[i]);
   return `عند α = 0: n = ${fx(b.n,0)} rpm والتيار أكبر ما يمكن (${fx(b.I,2)} A) ${Math.abs(b.n)<5&&b.I>c.I?'✓':'✗'}: محور الفرش على محور الثابت، فالدوار كملف ثانوي مقصور بلا عزم. عند α = 30° و 45° يدور المحرك، وعند −45° يدور بالعكس ${a.n<0&&d.n>0?'✓':'✗'}: الاتجاه يتبع جهة إزاحة الفرش.`}}}}
});
/* ---------- أجهزة التزامن ---------- */
const SYW='المصدر L و N ← R1 و R2 للمرسل CX، و R1 و R2 للمستقبل (الطرف نفسه بالطرف نفسه). وصّل الثابت بالثابت: S1 ← S1، و S2 ← S2، و S3 ← S3.';
Object.assign(EX,{
 cxcr:{name:'نقل الزاوية (CX ← CR)',book:'syb',lab:'lsyn',build:M=>{const As=[0,60,150,270];return {figRef:'5-4',
  wiring:SYW,parts:[AC1(M.Vr,M.f,{init:M.Vr}),{kind:'cx',id:'CX',M,lbl:'المرسل'},{kind:'cr',id:'CR',M,lbl:'المستقبل'}],
  tables:[{id:'t',title:'زاوية المستقبل مع زاوية المرسل',xh:'θ المرسل (°)',cols:As,col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';const ph=a.S.phys;const i=As.findIndex(x=>Math.abs(a.knob('TH:CX')-x)<0.5);if(i<0)return 'أدر المرسل إلى '+As.join(' أو ')+'°.';return Math.abs(((ph.th_CR||0)-(ph._thp||0)))<0.05?i:'انتظر حتى يستقر المستقبل.'},
   rows:[{k:'a',h:'θ المستقبل (°)',t:'Ang',m:'CR',dp:1}]}],
  tick:(a,ph)=>{ph._thp=ph._thn;ph._thn=ph.th_CR||0},
  check:rec=>{const t=rec.t||{};const rows=As.map((x,i)=>t[i]?[x,t[i]]:null).filter(x=>x&&x[1].a!=null);if(!rows.length)return 'سجّل القراءات.';
   return rows.map(([x,v])=>{const d=((v.a-x)%360+540)%360-180;return `${x}°: المستقبل ${fx(v.a,1)}° ${Math.abs(d)<1?'✓':'✗'}`}).join('، ')+'<br>المستقبل يتبع المرسل لأن جهود ملفات الثابت الثلاثة تتوزع حسب زاوية الدوار. جرّب: تبديل S1 و S3 يعكس اتجاه الحركة، وتبديل R1 و R2 في أحدهما يزيح الزاوية 180°.'}}}},
 cxct:{name:'كاشف الخطأ (CX ← CT)',book:'syb',lab:'lsyn',build:M=>{const As=[0,30,60,90,-30].map(x=>md(x,360));const Vm=M.Vr;return {figRef:'5-6',
  wiring:'المصدر L و N ← R1 و R2 للمرسل CX فقط. ثابت المرسل ← ثابت محول التحكم CT (S1 ← S1، و S2 ← S2، و S3 ← S3). دوار CT (R1 و R2) ← الفولتميتر V1. اترك CT على 0°.',
  parts:[AC1(M.Vr,M.f,{init:M.Vr}),{kind:'cx',id:'CX',M,lbl:'المرسل'},{kind:'ct',id:'CT',M,lbl:'محول التحكم'},VMa('V1',[30,100,300])],
  tables:[{id:'t',title:'جهد الخطأ — CT على 0°',xh:'θ المرسل (°)',cols:As,col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(Math.round(a.knob('TH:CT'))!==0)return 'أعد محول التحكم إلى 0°.';const i=As.findIndex(x=>Math.abs(a.knob('TH:CX')-x)<0.5);return i<0?'أدر المرسل إلى 0 أو 30 أو 60 أو 90 أو 330°.':i},
   rows:[{k:'V',h:'جهد الخطأ (V)',t:'V',a:'CT.R1',b:'CT.R2',dp:2}],plot:false}],
  check:rec=>{const t=rec.t||{};const rows=As.map((x,i)=>t[i]?[x,t[i]]:null).filter(x=>x&&x[1].V!=null);if(rows.length<3)return 'سجّل القراءات.';const v90=(t[3]||{}).V||Math.max(...rows.map(r=>r[1].V));
   return rows.map(([x,v])=>{const e=v90*Math.abs(Math.sin(x*D));return `${x}°: ${fx(v.V,1)} V (المتوقع V<sub>max</sub>·|sin θ| = ${fx(e,1)}) ${Math.abs(v.V-e)<=0.02*v90+0.05?'✓':'✗'}`}).join('<br>')+'<br>الخرج صفر عندما تتطابق الزاويتان (موضع الصفر لمحول التحكم متعامد مع S1)، ويكبر مع فرق الزاوية؛ وطوره يبين الاتجاه. هذه إشارة الخطأ التي يكبّرها المضخم ليدير محرك التحكم.'}}}},
 trq:{name:'نقل العزم',book:'syb',lab:'lsyn',build:M=>{const Ts=[0,0.4,0.8].map(k=>+(M.Tm*k).toPrecision(3));return {figRef:'',
  wiring:SYW+' وحمّل المستقبل بالفرملة (المرسل ثابت على 0°).',
  parts:[AC1(M.Vr,M.f,{init:M.Vr}),{kind:'cx',id:'CX',M,lbl:'المرسل'},{kind:'cr',id:'CR',M,lbl:'المستقبل'},BRKs(M.Tm*1.5,M.Tm/100)],
  tables:[{id:'t',title:'زاوية التأخر مع عزم الحمل — المرسل على 0°',xh:'عزم الحمل (N·m)',cols:Ts,col:a=>{if(!a.sw('SW:S'))return 'شغّل المصدر.';if(Math.round(a.knob('TH:CX'))!==0)return 'أعد المرسل إلى 0°.';const i=Ts.findIndex(t=>Math.abs(a.knob('K:BR')-t)<M.Tm/200);return i<0?'اضبط الحمل على '+Ts.join(' أو ')+' N·m.':i},
   rows:[{k:'lag',h:'زاوية التأخر (°)',t:'Lag',dp:1}]}],
  check:rec=>{const t=rec.t||{};const rows=Ts.map((T,i)=>t[i]?[T,t[i]]:null).filter(x=>x&&x[1].lag!=null);if(!rows.length)return 'سجّل القراءات.';
   return rows.map(([T,v])=>{const e=Math.asin(Math.min(T/M.Tm,1))/D;return `T = ${T}: التأخر ${fx(Math.abs(v.lag),1)}°، والمحسوب sin⁻¹(T/T<sub>max</sub>) = ${fx(e,1)}° ${Math.abs(Math.abs(v.lag)-e)<1.5?'✓':'✗'}`}).join('<br>')+`<br>عزم المستقبل يتناسب مع جيب زاوية التأخر، وأقصاه ${M.Tm} N·m عند 90°: أجهزة التزامن تنقل الزاوية لا القدرة.`}}}}
});
MQ.Ium=(a,q,ph,of,ol,P)=>{if(ph.Ium==null)return null;const t=of['MOT.A1'];return P.some(p=>p.kind==='am'&&(of[p.id+'+']===t||of[p.id+'-']===t))?{v:ph.Ium,m:'A'}:null};
const LES={'u1-l2':['vr'],'u1-l3':['vrh'],'u1-l4':['pm'],'u1-l5':['hy'],'u1-l6':['hy2'],'u2-l2':['tdc'],'u2-l3':['tdl'],'u2-l4':['tind'],'u2-l5':['tsyn'],
 'u3-l1':['srv'],'u3-l2':['srvT'],'u3-l3':['tau'],'u3-l6':['dca'],'u4-l1':['ud'],'u4-l2':['ut'],'u4-l3':['rp'],'u5-l1':['cxcr'],'u5-l2':['cxct'],'u5-l3':['trq']};
A.bind(B,LES,EX,MACH);B.SMMBENCH={EX,LES,MACH};
})(PLCBOOK);
