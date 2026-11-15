/* «المنضدة الافتراضية» — منضدة آلات التيار المتردد (courses/ac-machines/bench-layout.js).
   مبنية على منضدة القياس (دوائر 1 و 2): المتدرب يوصّل، ويشغّل، ويقيس، ويسجّل في الجدول، ثم يقارن بالقانون.
   الآلات: «آلة الكتاب» (آلة مثال الدرس نفسها التي في تبويب «المختبر») أو «آلة معمل صغيرة» (قيم توضيحية).
   ACM.layout(ex) — شكل المنضدة، ACM.make(B,L,ex) — الكهرباء والحركة والتسجيل، ACM.bind(B,LES,EX) — الربط بالدروس. */
(function(){
const W=1240,GAP=14,G='#C9A227',SQ3=Math.sqrt(3);
const cut=(s,n)=>{s=String(s||'').replace(/<[^>]+>/g,'').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const T=(id,lbl,x,y,o)=>Object.assign({id,lbl,x,y,col:G,nm:id.replace(/^(.+?)\.(.+)$/,'$1 ($2)').replace(/^(\w+)([+-])$/,'$1 ($2)')},o||{});
const fx=(v,d)=>+(+v).toFixed(d==null?2:d);
function meterMod(p,kind){const dc=!!p.dc,u=kind==='V'?'V':kind==='A'?'A':'W';
 if(kind==='W')return {w:210,h:255,sub:'واتميتر',meters:[{id:p.id,name:'الواتميتر '+p.id,x:30,y:40,w:150,h:96,unit:'W',ranges:p.ranges||[100,300,1000,3000],ac:true}],
  labels:[{t:'ملف التيار',x:60,y:240,s:10},{t:'ملف الجهد',x:150,y:240,s:10}],terms:[T(p.id+'.I+','*',35,205),T(p.id+'.I-','I',85,205),T(p.id+'.V+','*',125,205),T(p.id+'.V-','V',175,205)]};
 return {w:180,h:230,sub:(kind==='V'?'فولتميتر':'أميتر')+(dc?' DC':' AC'),meters:[{id:p.id,name:(kind==='V'?'فولتميتر':'أميتر')+' '+p.id,x:15,y:40,w:150,h:96,unit:u,ranges:p.ranges||(kind==='V'?[30,100,300,600]:[1,3,10,30,100]),ac:!dc}],
  terms:[T(p.id+'+',dc?'+':'*',55,205,{pol:dc?'+':'',ly:-16}),T(p.id+'-',dc?'−':'~',125,205,{pol:dc?'-':'',ly:-16})]}}
const PART={
 ac3v:p=>({w:330,h:200,sub:p.inv?'عاكس تردد (V/f ثابت)':'مصدر ثلاثي الأطوار متغير الجهد'+(p.f?' — '+p.f+' Hz':''),
  knobs:[{id:'K:'+p.id,lbl:'جهد الخط',x:60,y:96,max:p.V,step:1,unit:'V',dp:0,init:p.init||0}].concat(p.inv?[{id:'F:'+p.id,lbl:'التردد',x:160,y:96,min:5,max:p.fmax||p.f,init:p.f,step:1,unit:'Hz',dp:0}]:[]),
  switches:[{id:'SW:'+p.id,lbl:'تشغيل / إيقاف',x:275,y:92}],terms:['L1','L2','L3','N'].map((c,k)=>T(p.id+'.'+c,c,55+k*70,170))}),
 ac1:p=>({w:230,h:200,sub:'مصدر أحادي الطور متغير الجهد — '+p.f+' Hz',knobs:[{id:'K:'+p.id,lbl:'الجهد',x:70,y:96,max:p.V,step:1,unit:'V',dp:0,init:p.init||0}],switches:[{id:'SW:'+p.id,lbl:'تشغيل / إيقاف',x:180,y:92}],
  terms:[T(p.id+'.L','L',70,170),T(p.id+'.N','N',170,170)]}),
 im1:p=>{const M=p.M,sh=M.type==='shaded',hasS=['split','cstart','two'].includes(M.type);const plate=(M.short||M.name)+' — '+M.V+' V — '+M.f+' Hz';
  return {w:hasS?330:sh?200:270,h:240,sub:cut(plate,48),art:`<circle cx="70" cy="80" r="34" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/><circle cx="70" cy="80" r="8" fill="#333"/>`+(hasS?`<text x="270" y="150" font-size="10" text-anchor="middle" fill="#333">المفتاح الطارد</text>`:''),
   labels:sh?[]:[{t:'الملف الرئيسي',x:70,y:150,s:10},{t:'الملف المساعد',x:180,y:150,s:10}],
   terms:[T(p.id+'.U1','U1',40,205),T(p.id+'.U2','U2',100,205)].concat(sh?[]:[T(p.id+'.Z1','Z1',150,205),T(p.id+'.Z2','Z2',210,205)],hasS?[T(p.id+'.S1','S1',255,205),T(p.id+'.S2','S2',305,205)]:[])}},
 cap:p=>({w:150,h:200,sub:p.adj?'مكثف متغير':'C = '+p.C+' µF',knobs:p.adj?[{id:'C:'+p.id,lbl:'السعة',x:75,y:90,min:p.min||10,max:p.max,init:p.init||p.min||10,step:p.step||1,unit:'µF',dp:0}]:[],art:p.adj?'':`<path d="M75 60v22M75 100v22M52 82h46M52 100h46" stroke="#333" stroke-width="3"/>`,
  terms:[T(p.id+'.a','',35,170),T(p.id+'.b','',115,170)]}),
 sm3:p=>{const M=p.M,mo=!!p.motor;const plate=(M.short||M.name)+' — '+M.VL+' V '+(M.conn==='D'?'Δ':'Y')+' — '+M.f+' Hz';
  return {w:mo?380:330,h:240,sub:cut(plate,50),art:`<circle cx="60" cy="78" r="34" fill="#a3a08f" stroke="#5c5744" stroke-width="3"/><circle cx="60" cy="78" r="8" fill="#333"/>`,
   labels:[{t:'المجال',x:280,y:150,s:10}],switches:mo?[{id:'SW:FS',lbl:'تقصير المجال عبر مقاومة',x:330,y:70}]:[],
   meters:mo?[{id:p.id+':d',kind:'digital',x:120,y:50,w:120,h:40,unit:'°',dp:1}]:[],
   terms:[T(p.id+'.W2','W2',30,150),T(p.id+'.U2','U2',80,150),T(p.id+'.V2','V2',130,150),T(p.id+'.U1','U1',30,205),T(p.id+'.V1','V1',80,205),T(p.id+'.W1','W1',130,205),T(p.id+'.F1','F1',250,205,{pol:'+'}),T(p.id+'.F2','F2',305,205,{pol:'-'})]}},
 pm:p=>({w:230,h:220,sub:'محرك ابتدائي (يدير المولد)',knobs:[{id:'N:'+p.id,lbl:'السرعة المضبوطة',x:65,y:150,min:p.nmin||0,max:p.nmax,step:1,unit:'rpm',dp:0}],switches:[{id:'SW:'+p.id,lbl:'تشغيل',x:180,y:146}],
  meters:[{id:p.id+':n',kind:'digital',x:15,y:40,w:200,h:46,unit:'rpm',dp:0}],terms:[]}),
 grid:p=>({w:300,h:200,sub:'الشبكة (قضيب لانهائي) '+p.V+' V — '+p.f+' Hz',switches:[{id:'SW:'+p.id,lbl:'توصيل الشبكة',x:245,y:92}],terms:['L1','L2','L3','N'].map((c,k)=>T(p.id+'.'+c,c,45+k*60,170))}),
 sw3:p=>({w:220,h:200,sub:'قاطع ثلاثي الأقطاب',switches:[{id:'SW:'+p.id,lbl:'إغلاق',x:170,y:60}],terms:[1,3,5].map((c,k)=>T(p.id+'.'+c,String(c),35+k*50,110)).concat([2,4,6].map((c,k)=>T(p.id+'.'+c,String(c),35+k*50,175)))}),
 lmp3:p=>({w:240,h:200,sub:'مصابيح التزامن (طريقة الإطفاء)',leds:[0,1,2].map(k=>({id:p.id+':'+k,x:50+k*70,y:70,r:13,color:'#ffd36b'})),
  terms:[0,1,2].flatMap(k=>[T(p.id+'.'+'abc'[k]+'1','abc'[k]+'1',30+k*70,140),T(p.id+'.'+'abc'[k]+'2','abc'[k]+'2',70+k*70,175)])}),
 ld3:p=>({w:260,h:210,sub:'حمل ثلاثي (نجمة): 0 بلا، 1 R، 2 R-L، 3 R-C',knobs:[{id:'LD:'+p.id,lbl:'نوع الحمل',x:190,y:100,max:3,step:1,unit:'',dp:0}],
  terms:['A','B','C'].map((c,k)=>T(p.id+'.'+c,c,40+k*45,170)).concat([T(p.id+'.n','n',40,100,{col:'#8a8f93'})])}),
 dcs:p=>({w:230,h:200,sub:'مصدر مستمر 0–'+p.V+' V',knobs:[{id:'K:'+p.id,lbl:'ضبط الجهد',x:70,y:96,max:p.V,step:p.step||0.1,unit:'V',dp:1}],switches:[{id:'SW:'+p.id,lbl:'تشغيل / إيقاف',x:180,y:92}],
  terms:[T(p.id+'.+','+',70,170,{pol:'+'}),T(p.id+'.-','−',170,170,{pol:'-'})]}),
 im3:p=>{const M=p.M,wr=!!M.wr;const plate=(M.short||M.name)+' — '+M.VL+' V '+(M.conn==='D'?'Δ':'Y')+' — '+M.f+' Hz — '+M.p+' أقطاب';
  return {w:wr?330:260,h:240,sub:cut(plate,48),art:`<circle cx="${wr?95:130}" cy="78" r="34" fill="#8fa3a8" stroke="#44575c" stroke-width="3"/><circle cx="${wr?95:130}" cy="78" r="8" fill="#333"/><rect x="${wr?57:92}" y="${wr?120:120}" width="76" height="6" fill="#999"/>`+(wr?`<text x="250" y="100" font-size="11" text-anchor="middle" fill="#333">حلقات الانزلاق</text>`:''),
   terms:[T(p.id+'.W2','W2',40,150),T(p.id+'.U2','U2',100,150),T(p.id+'.V2','V2',160,150),T(p.id+'.U1','U1',40,205),T(p.id+'.V1','V1',100,205),T(p.id+'.W1','W1',160,205)].map(t=>(t.x+=wr?0:30,t))
    .concat(wr?['K','L','M'].map((c,k)=>T(p.id+'.'+c,c,215+k*45,205)):[])}},
 brake:p=>({w:250,h:240,sub:'فرملة حمل (مقياس عزم وسرعة)',knobs:[{id:'K:'+p.id,lbl:'عزم الحمل',x:60,y:170,max:p.Tmax,step:p.step||0.1,unit:'N·m',dp:1}],
  switches:[{id:'SW:LOCK',lbl:'قفل العضو الدوار',x:180,y:166}],
  meters:[{id:p.id+':n',kind:'digital',x:15,y:40,w:105,h:46,unit:'rpm',dp:0},{id:p.id+':T',kind:'digital',x:130,y:40,w:105,h:46,unit:'N·m',dp:2}],terms:[]}),
 yd:p=>({w:300,h:230,sub:'0 فصل، 1 نجمة، 2 دلتا',knobs:[{id:'Y:'+p.id,lbl:'الوضع',x:210,y:100,max:2,step:1,unit:'',dp:0}],
  terms:['L1','L2','L3'].map((c,k)=>T(p.id+'.'+c,c,40+k*45,80)).concat(['U1','V1','W1','U2','V2','W2'].map((c,k)=>T(p.id+'.'+c,c,30+k*48,200)))}),
 rs3:p=>({w:260,h:190,sub:'مقاومات بدء في الثابت '+p.R+' Ω لكل طور، ومفتاح تقصير',art:[0,1,2].map(k=>`<rect x="${30+k*75}" y="70" width="50" height="18" rx="3" fill="#d9b26f" stroke="#7a5a1f"/>`).join(''),
  switches:[{id:'SW:'+p.id,lbl:'تقصير',x:230,y:40}],terms:[1,2,3].flatMap(k=>[T(p.id+'.a'+k,'',30+(k-1)*75,150),T(p.id+'.b'+k,'',80+(k-1)*75,150)])}),
 at3:p=>({w:300,h:220,sub:'محول ذاتي للبدء (نجمة داخلية)',knobs:[{id:'TAP:'+p.id,lbl:'نسبة الجهد',x:220,y:100,min:p.taps[0],max:100,init:p.taps[0],step:p.tstep||5,unit:'%',dp:0}],
  terms:['L1','L2','L3'].map((c,k)=>T(p.id+'.'+c,c,40+k*45,80)).concat(['U','V','W'].map((c,k)=>T(p.id+'.'+c,c,130+k*45,190)),[T(p.id+'.n','n',40,190,{col:'#8a8f93'})])}),
 rst:p=>({w:230,h:200,sub:'بادئ العضو الدوار (مقاومات نجمة)',knobs:[{id:'R:'+p.id,lbl:'المرحلة',x:115,y:80,max:p.steps.length-1,step:1,unit:'',dp:0}],
  labels:[{t:'R = '+p.steps.map(v=>v).join(' / ')+' Ω',x:115,y:135,s:10}],terms:['a','b','c'].map((c,k)=>T(p.id+'.'+c,c,55+k*60,175))}),
 jb:p=>({w:170,h:160,sub:'عقد توصيل: كل مجموعة موصولة داخلياً',art:['a','b','c'].map((k,j)=>`<rect x="${14+j*50}" y="58" width="44" height="88" rx="6" fill="#d7dad3" stroke="#888"/>`).join(''),
  terms:['a','b','c'].flatMap((k,j)=>[0,1,2].map(n=>T(p.id+'.'+k+n,n?'':k,36+j*50,78+n*28,{ly:-14,col:'#8a8f93'}))),bridges:['a','b','c'].flatMap(k=>[[p.id+'.'+k+'0',p.id+'.'+k+'1'],[p.id+'.'+k+'0',p.id+'.'+k+'2']])}),
 vm:p=>meterMod(p,'V'),am:p=>meterMod(p,'A'),wm:p=>meterMod(p,'W')
};
const EXT={},MQ={};
function layout(ex){const mods=[],bridges=[];let x=20,y=20,rowH=0;
 const place=m=>{if(x+m.w>W-20){x=20;y+=rowH+GAP;rowH=0}m.x=x;m.y=y;x+=m.w+GAP;rowH=Math.max(rowH,m.h);mods.push(m);(m.bridges||[]).forEach(b=>bridges.push(b))};
 ex.parts.forEach(p=>{const m=PART[p.kind](p);m.id='p_'+p.id;m.title=cut(p.lbl||p.id,22);place(m)});if(x>20)y+=rowH+GAP;
 return {w:W,h:y,generic:true,modules:mods,bridges}}

/* ---------------- نموذج المحرك الحثي ---------------- */
/* M: {VL, conn:'D'|'Y', f, p, R1, X1, R2, X2, Xm, Rc, J, Bf, sN, wr} — قيم لكل ملف. أو نموذج من قراءات الاختبار: M.tab = {NL:[V,I,P], BR:[V,I,P], R1} */
function IMmodel(C,M){const Vw=M.conn==='D'?M.VL:M.VL/SQ3;
 const Zm=M.Rc?C.div([1,0],C.add([1/M.Rc,0],C.div([1,0],[0,M.Xm]))):[0,M.Xm];
 const zw=(s,R2e,f)=>{const k=f/M.f;const Zr=[R2e/s,M.X2*k],Zmf=M.Rc?C.div([1,0],C.add([1/M.Rc,0],C.div([1,0],[0,M.Xm*k]))):[0,M.Xm*k];const Zp=C.div(C.mul(Zmf,Zr),C.add(Zmf,Zr));return {Zw:C.add([M.R1,M.X1*k],Zp),Zp,Zr}};
 const tq=(V,s,R2e,f)=>{if(V<1e-6)return 0;const ws=4*Math.PI*f/M.p;s=Math.abs(s)<1e-5?(s<0?-1e-5:1e-5):s;const z=zw(s,R2e,f);const I1=C.div([V,0],z.Zw);const I2=C.div(C.mul(I1,z.Zp),z.Zr);const i2=C.abs(I2);return 3*i2*i2*R2e/s/ws};
 /* نموذج القراءات: قبول الملف عند الحمل الخفيف وعند الإعاقة */
 let Ytab=null;if(M.tab){const yOf=([V,I,P])=>{const Vph=M.conn==='D'?V:V/SQ3,Iph=M.conn==='D'?I/SQ3:I,pf=Math.min(P/(SQ3*V*I),1);return C.mul([Iph/Vph,0],[pf,-Math.sqrt(1-pf*pf)])};Ytab={NL:yOf(M.tab.NL),BR:yOf(M.tab.BR)}}
 const ws0=4*Math.PI*M.f/M.p;
 /* المقنن: التيار والعزم عند الانزلاق المقنن */
 let IN,TN;if(Ytab){IN=C.abs(Ytab.NL)*Vw*2.2;TN=0}else{const z=zw(M.sN,M.R2,M.f);IN=C.abs(C.div([Vw,0],z.Zw));TN=tq(Vw,M.sN,M.R2,M.f)}
 return {M,Vw,zw,tq,Ytab,ws0,IN,TN}}

/* ---------------- المحرك أحادي الطور ----------------
   منحنيات العزم والسرعة (بالوحدة النسبية) مقروءة من أشكال الكتاب (2-4) و (2-6) و (2-8) و (2-9) و (2-11) — نفسها التي في تبويب «المختبر».
   العزم = منحنى الملف الرئيسي وحده + q × (منحنى التصميم − منحنى الرئيسي)، و q = Im·Ia·sin(زاوية Ia عن Im) منسوبة لقيمتها في التصميم عند البدء. */
const lin=pts=>x=>{if(x<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(x<=pts[i][0]){const [x0,y0]=pts[i-1],[x1,y1]=pts[i];return y0+(y1-y0)*(x-x0)/(x1-x0)}return pts[pts.length-1][1]};
const CUR1={mainOnly:lin([[0,0],[0.1,0.24],[0.2,0.5],[0.3,0.76],[0.4,1.02],[0.5,1.32],[0.6,1.66],[0.7,2.0],[0.8,2.3],[0.88,2.02],[0.95,1.1],[1,0],[1.2,-2]]),
 split:lin([[0,1.25],[0.1,1.38],[0.2,1.55],[0.3,1.76],[0.4,2.02],[0.5,2.32],[0.6,2.65],[0.72,3.0],[0.8,2.9],[0.9,2.2],[1,0],[1.2,-2]]),
 cstart:lin([[0,3.3],[0.2,3.45],[0.38,3.5],[0.55,3.32],[0.75,3.0],[0.85,2.6],[1,0],[1.2,-2]]),
 perm:lin([[0,0.7],[0.2,0.95],[0.4,1.3],[0.6,1.8],[0.8,2.25],[0.88,2.0],[0.95,1.1],[1,0],[1.2,-2]]),
 two:lin([[0,2.2],[0.2,2.5],[0.4,2.85],[0.55,3.0],[0.65,2.95],[0.75,2.8],[0.85,2.3],[1,0],[1.2,-2]]),
 shaded:lin([[0,0.5],[0.2,0.7],[0.4,0.9],[0.6,1.1],[0.78,1.25],[0.86,1.1],[0.93,0.6],[1,0],[1.2,-2]])};
/* M1: {type, V, f, p, Zm:[R,X] (الرئيسي عند السكون), Za:[R,X] (المساعد), Cd (µF: مكثف التصميم عند البدء، 0 للمشطور), Tb (العزم المقنن N·m), J} */
function IM1model(C,M){const w0=2*Math.PI*M.f;const zc=(Cuf,f)=>Cuf?[0,-1e6/(2*Math.PI*f*Cuf)]:[0,0];
 const ZmL=[M.Zm[0],M.Zm[1]],XM=15*C.abs(ZmL);
 /* الملف الرئيسي: نصف المقاومة والممانعة للثابت ونصفها للدوار، وفرع مغنطة كبير */
 const zmain=(s,f)=>{const k=f/M.f;const Z1=[ZmL[0]/2,ZmL[1]/2*k],Zr=[ZmL[0]/2/Math.max(s,0.002),ZmL[1]/2*k],Zx=[0,XM*k];return C.add(Z1,C.div(C.mul(Zx,Zr),C.add(Zx,Zr)))};
 const Im0=C.div([M.V,0],zmain(1,M.f)),Ia0=M.type==='shaded'?[0,0]:C.div([M.V,0],C.add([M.Za[0],M.Za[1]],zc(M.Cd,M.f)));
 const ang=x=>Math.atan2(x[1],x[0]);const qd=C.abs(Im0)*C.abs(Ia0)*Math.sin(ang(Ia0)-ang(Im0));
 const ns=120*M.f/M.p;
 return {M,zmain,qd,ns,ang,IN:M.V/C.abs(zmain(0.05,M.f))}}

/* ---------------- الآلة التزامنية ----------------
   M: {VL, conn, f, p, Ra, Xs, occ:[[If,E],...] أو {Esat,k} (E لكل ملف عند السرعة التزامنية)، Rf مقاومة المجال، IL المقنن، Tr العزم المقنن، J} */
function SMmodel(M){const pts=M.occ;const E0=Array.isArray(pts)?lin(pts):(If=>M.occ.Esat*Math.tanh(M.occ.k*If/M.occ.Esat));
 const Vw=M.conn==='D'?M.VL:M.VL/SQ3;const ns=120*M.f/M.p,ws=2*Math.PI*ns/60;return {M,E:(If,w)=>E0(Math.abs(If))*Math.max(w,0)/ws,Vw,ns,ws,Iw:M.conn==='D'?M.IL/SQ3:M.IL}}

/* ---------------- الكهرباء والحركة ---------------- */
const RVM=1e6,RAM=0.002,RSRC=0.02,RDC=0.05;
function make(B,L,ex){const C=B.BENCH.C,P=ex.parts,mag=x=>C.abs(x),cpol=(r,d)=>[r*Math.cos(d*Math.PI/180),r*Math.sin(d*Math.PI/180)];
 const srcs=P.filter(p=>['dcs','ac3v','ac1','grid'].includes(p.kind)||(EXT[p.kind]&&EXT[p.kind].src)),sm=P.find(p=>p.kind==='sm3'),pmv=P.find(p=>p.kind==='pm'),mot=P.find(p=>p.kind==='im3'),mot1=P.find(p=>p.kind==='im1'),brk=P.find(p=>p.kind==='brake');
 const IM=mot?IMmodel(C,mot.M):null;ex._IM=IM;const IM1=mot1?IM1model(C,mot1.M):null;ex._IM1=IM1;const SMM=sm?SMmodel(sm.M):null;ex._SM=SMM;
 const off=srcs.map(p=>'SW:'+p.id);
 const X={powerSw:off,mistakes:{...(ex.mistakes||{}),
  'short':{t:'قصر على المصدر',why:'طرفا المصدر (أو خطان من خطوطه) اتصلا بلا حمل. في المعمل يفصل قاطع الحماية أو يحترق المصهر. راجع التوصيل قبل التشغيل.',fatal:true,off},
  'amm-parallel':{t:'الأميتر موصّل على التوازي',why:'الأميتر مقاومته صغيرة جداً، فإذا وُصّل بين خطين صار قصراً. الأميتر يُدخل في الخط نفسه (على التوالي).',fatal:true,off},
  'winding-overvolt':{t:'جهد الملف أكبر من المقنن',why:'توصيلة الملفات لا تناسب جهد المصدر: المحرك المقنن نجمة إذا وُصّل دلتا على الجهد نفسه يأخذ كل ملف جهد الخط كاملاً (√3 مرة أكبر)، فيسخن ويحترق. اقرأ لوحة البيانات: Δ تعني جهد الخط على الملف، و Y تعني جهد الخط على ملفين.',fatal:true,off},
  'single-phase':{t:'المحرك يعمل على طورين (فقد طور)',why:'أحد خطوط التغذية الثلاثة غير موصول، فلا يتكوّن مجال دوار كامل: المحرك لا يبدأ الحركة أو يسخن بسرعة. وصّل الخطوط الثلاثة كلها.',fatal:true,off},
  'stall':{t:'المحرك متوقف وهو تحت الجهد',why:'المحرك لا يدور: الحمل أكبر من عزمه، أو (في المحرك أحادي الطور) الملف المساعد غير موصول فلا يوجد عزم بدء ويُسمع طنين فقط. يسحب تيار البدء الكبير باستمرار ويحترق. افصل المصدر وراجع التوصيل أو الحمل.',fatal:true,off},
  'overload':{t:'حمل زائد',why:'تيار المحرك تجاوز تياره المقنن بكثير مدة طويلة؛ في المعمل يفصل مرحل الحماية الحرارية. لا تحمّل المحرك فوق عزمه المقنن مدة طويلة.',fatal:true,off},
  'locked-fullv':{t:'العضو الدوار مقفول بجهد مرتفع',why:'اختبار إعاقة الحركة يُجرى بجهد منخفض (يُرفع تدريجياً حتى يصل التيار للمقنن). بالجهد الكامل يسحب المحرك المقفول 5–7 أضعاف التيار المقنن ويحترق.',fatal:true,off},
  'dc-over':{t:'تيار مستمر كبير في الملف',why:'في اختبار التيار المستمر لا توجد ممانعة حثية، فالمقاومة الصغيرة وحدها تحد التيار. ارفع الجهد من الصفر ببطء ولا تتجاوز التيار المقنن.',fatal:true,off},
  'aux-hot':{t:'الملف المساعد بقي موصولاً أثناء الدوران',why:'الملف المساعد في المحرك المشطور الوجه ومحرك مكثف البدء مصمم للعمل ثوانيَ عند البدء فقط، ويفصله المفتاح الطارد عند نحو 75% من السرعة. إذا وُصّل بلا المفتاح الطارد يبقى تحت الجهد فيسخن ويحترق.',fatal:true,off},
  'bad-sync':{t:'إغلاق القاطع قبل تحقق شروط التوازي',why:'أُغلق قاطع التوازي والمصابيح مضيئة: جهد المولد وجهد الشبكة غير متساويين أو غير متطابقين في الطور أو التتابع، فيمر تيار كبير جداً لحظة الإغلاق ويهتز العمود. أغلق فقط والمصابيح الثلاث مطفأة معاً (الجهدان والتردد متساويان والتتابع صحيح).',fatal:true,off},
  'sc-field':{t:'تيار القصر تجاوز المقنن كثيراً',why:'في اختبار القصر يبدأ تيار المجال من الصفر ويُرفع ببطء حتى يصل تيار المنتج للمقنن. تيار مجال كبير مع أطراف مقصورة يعطي تياراً يحرق ملفات المنتج.',fatal:true,off},
  'field-open':{t:'المجال مفتوح أثناء بدء المحرك التزامني',why:'عند البدء يدور المجال المغناطيسي بالنسبة لملف المجال فيتولد فيه جهد عالٍ جداً إذا كان مفتوحاً. يُقصر ملف المجال عبر مقاومة أثناء البدء، ثم يُوصّل مصدر التيار المستمر قرب السرعة التزامنية.',fatal:true,off},
  'pull-out':{t:'خرج المحرك عن التزامن',why:'الحمل تجاوز أقصى قدرة (عند δ = 90°) أو تيار المجال صغير جداً، ففقد المحرك التزامن وصار يهتز ويسحب تياراً كبيراً. قلل الحمل أو زد تيار المجال.',fatal:true,off},
  'gen-over':{t:'تيار المولد تجاوز المقنن',why:'المولد يحمل أكثر من تياره المقنن؛ في المعمل يفصل قاطع الحماية. قلل الحمل أو القدرة.',fatal:true,off},
  'rotor-open':{t:'دائرة العضو الدوار مفتوحة',why:'في محرك الحلقات يجب توصيل أطراف العضو الدوار (K L M) بالبادئ أو قصرها؛ إذا بقيت مفتوحة فلا يمر تيار في الدوار ولا يتولد عزم.',fatal:false}},
  note:ex.note||'',figure:()=>ex.fig?ex.fig():'',figureTitle:'مخطط التوصيل',
  init:()=>({w:0,t:0,pk:{},tOn:0,rext:0})};
 Object.values(X.mistakes).forEach(m=>{if(m.fatal&&!m.off)m.off=off});
 const VMS=P.filter(p=>p.kind==='vm').map(p=>p.id);X.liveOk=(a,b)=>[a,b].some(t=>VMS.some(v=>t===v+'+'||t===v+'-'));
 const on=(a,id)=>a.sw('SW:'+id);
 X.tick=a=>{const ph=a.S.phys;ph.t+=a.dt;const of=a.nets().of;
  const sup=P.find(p=>p.kind==='ac3v'||p.kind==='ac1');const f=sup?(sup.inv?a.knob('F:'+sup.id):sup.f):50;ph.f=f;
  const elsAC=[],elsDC=[],E={},Ed={};
  P.forEach(p=>{const id=p.id;
   if(p.kind==='ac3v'){let VL=a.knob('K:'+id);if(p.inv)VL=Math.min(VL,p.V)*Math.min(f/p.f,1);const Vp=VL/SQ3;E[id]=['L1','L2','L3'].map((c,k)=>{const e={p:id+'.'+c,n:id+'.N',y:on(a,id)?[1/RSRC,0]:[1e-9,0],i:on(a,id)?C.div(cpol(Vp,-120*k),[RSRC,0]):[0,0]};elsAC.push(e);return e});ph.VLset=VL}
   else if(p.kind==='ac1'){const V=a.knob('K:'+id);E[id]={p:id+'.L',n:id+'.N',y:on(a,id)?[1/RSRC,0]:[1e-9,0],i:on(a,id)?[V/RSRC,0]:[0,0]};elsAC.push(E[id]);ph.VLset=V*SQ3}
   else if(p.kind==='grid'){const Vp=p.V/SQ3;E[id]=['L1','L2','L3'].map((c,k)=>{const e={p:id+'.'+c,n:id+'.N',y:on(a,id)?[1/RSRC,0]:[1e-9,0],i:on(a,id)?C.div(cpol(Vp,-120*k),[RSRC,0]):[0,0]};elsAC.push(e);return e})}
   else if(p.kind==='sw3'){const g=on(a,id)?1e4:1e-9;[[1,2],[3,4],[5,6]].forEach(([x,y2])=>{elsAC.push({p:id+'.'+x,n:id+'.'+y2,y:[g,0]});elsDC.push({p:id+'.'+x,n:id+'.'+y2,g})})}
   else if(p.kind==='lmp3'){[0,1,2].forEach(k=>{const c='abc'[k];const e={p:id+'.'+c+'1',n:id+'.'+c+'2',y:[1/p.R,0]};elsAC.push(e);E[id+':'+k]=e})}
   else if(p.kind==='ld3'){const t=Math.round(a.knob('LD:'+id));const Z=t===1?[p.R,0]:t===2?[p.R*0.8,p.R*0.6]:t===3?[p.R*0.8,-p.R*0.6]:null;['A','B','C'].forEach(c=>{elsAC.push({p:id+'.'+c,n:id+'.n',y:Z?C.div([1,0],Z):[1e-9,0]})});ph.ldt=t}
   else if(p.kind==='cap'){const Cu=p.adj?a.knob('C:'+id):p.C;E[id]={p:id+'.a',n:id+'.b',y:[0,2*Math.PI*f*Cu*1e-6]};elsAC.push(E[id])}
   else if(p.kind==='dcs'){const V=a.knob('K:'+id);Ed[id]={p:id+'.+',n:id+'.-',g:on(a,id)?1/RDC:1e-9,i:on(a,id)?V/RDC:0};elsDC.push(Ed[id])}
   else if(p.kind==='vm'){const e=p.dc?{p:id+'+',n:id+'-',g:1/RVM}:{p:id+'+',n:id+'-',y:[1/RVM,0]};(p.dc?elsDC:elsAC).push(e);(p.dc?Ed:E)[id]=e}
   else if(p.kind==='am'){const e=p.dc?{p:id+'+',n:id+'-',g:1/RAM}:{p:id+'+',n:id+'-',y:[1/RAM,0]};(p.dc?elsDC:elsAC).push(e);(p.dc?Ed:E)[id]=e;
     /* الأميتر موصل في الدائرتين كسلك (حتى لا تنقطع الدائرة الأخرى) */const e2=p.dc?{p:id+'+',n:id+'-',y:[1/RAM,0]}:{p:id+'+',n:id+'-',g:1/RAM};(p.dc?elsAC:elsDC).push(e2)}
   else if(p.kind==='wm'){E[id+':I']={p:id+'.I+',n:id+'.I-',y:[1/RAM,0]};E[id+':V']={p:id+'.V+',n:id+'.V-',y:[1/RVM,0]};elsAC.push(E[id+':I'],E[id+':V']);elsDC.push({p:id+'.I+',n:id+'.I-',g:1/RAM})}
   else if(p.kind==='yd'){const s=Math.round(a.knob('Y:'+id));const cl=(x,y2,c)=>{const g=c?1e4:1e-9;elsAC.push({p:id+'.'+x,n:id+'.'+y2,y:[g,0]});elsDC.push({p:id+'.'+x,n:id+'.'+y2,g})};
     cl('L1','U1',s>0);cl('L2','V1',s>0);cl('L3','W1',s>0);cl('U2','V2',s===1);cl('V2','W2',s===1);cl('U1','W2',s===2);cl('V1','U2',s===2);cl('W1','V2',s===2)}
   else if(p.kind==='rs3'){const sh=on(a,id);[1,2,3].forEach(k=>{const g=sh?1e4:1/p.R;elsAC.push({p:id+'.a'+k,n:id+'.b'+k,y:[g,0]});elsDC.push({p:id+'.a'+k,n:id+'.b'+k,g})})}
   else if(p.kind==='at3'){const k=Math.max(a.knob('TAP:'+id),1)/100;const a2=1/k,z=[0.01,0.03],yz=C.div([1,0],z),Ym=[1e-6,-1e-5];
     ['L1','L2','L3'].forEach((c,j)=>{const o=['U','V','W'][j];elsAC.push({p:[id+'.'+c,id+'.n'],q:[id+'.'+o,id+'.n'],Y:[[C.add(yz,Ym),C.mul([-a2,0],yz)],[C.mul([-a2,0],yz),C.mul([a2*a2,0],yz)]]})})}
  });
  /* المحرك: الملفات */
  let MS=null;
  if(mot){const id=mot.id,M=IM.M;const wd=[['U1','U2'],['V1','V2'],['W1','W2']];
   /* مقاومة الدوار الخارجية (محرك الحلقات) */
   let R2e=M.R2,ropen=false;if(M.wr){const k=of[id+'.K'],l=of[id+'.L'],m=of[id+'.M'];const rs=P.find(p=>p.kind==='rst');
     if(k!=null&&k===l&&l===m)R2e=M.R2;else if(rs&&[k,l,m].every(n=>n!=null)&&new Set([k,l,m]).size===3&&['a','b','c'].every(c=>[k,l,m].includes(of[rs.id+'.'+c]))){R2e=M.R2+rs.steps[Math.round(a.knob('R:'+rs.id))];ph.rext=rs.steps[Math.round(a.knob('R:'+rs.id))]}else{R2e=1e4;ropen=true}}
   const ws=4*Math.PI*f/M.p,w=ph.w;
   const sd=ph.dir||1;let s=ws>0?(ws-sd*w)/ws:1;if(Math.abs(s)<1e-5)s=1e-5;
   let yw;if(IM.Ytab){const k=Math.min(Math.max(s,0),1);yw=C.add(IM.Ytab.NL,C.mul(C.sub(IM.Ytab.BR,IM.Ytab.NL),[k*k,0]))}else yw=C.div([1,0],IM.zw(s,R2e,f).Zw);
   wd.forEach(([x,y2],j)=>{const e={p:id+'.'+x,n:id+'.'+y2,y:yw};elsAC.push(e);E[id+':'+j]=e;const g=1/M.R1;const d={p:id+'.'+x,n:id+'.'+y2,g};elsDC.push(d);Ed[id+':'+j]=d});
   MS={id,M,R2e,ropen,ws,s}}
  let G=null;
  if(sm){const id=sm.id,M=SMM.M;const If=Math.abs(ph.If||0);const Ew=SMM.E(If,ph.w||0);ph.Ew=Ew;const Zs=[M.Ra,M.Xs],ys=C.div([1,0],Zs);
   [['U1','U2'],['V1','V2'],['W1','W2']].forEach(([x,y2],j)=>{const e={p:id+'.'+x,n:id+'.'+y2,y:ys,i:C.mul(cpol(Ew,(ph.phi||0)*180/Math.PI-120*j),ys)};elsAC.push(e);E[id+':'+j]=e;elsDC.push({p:id+'.'+x,n:id+'.'+y2,g:1/Math.max(M.Ra,0.01)})});
   const fs=sm.motor&&a.sw('SW:FS');const ef={p:id+'.F1',n:id+'.F2',g:1/M.Rf};elsDC.push(ef);Ed[id+':f']=ef;if(fs)elsDC.push({p:id+'.F1',n:id+'.F2',g:1/(5*M.Rf)});
   G={id,M,fs}}
  let M1=null;
  if(mot1){const id=mot1.id,M=IM1.M;const ws=2*Math.PI*IM1.ns/60,w=ph.w,npu=w/ws;const s=1-Math.abs(npu);
   const e1={p:id+'.U1',n:id+'.U2',y:C.div([1,0],IM1.zmain(Math.max(s,0.002),f))};elsAC.push(e1);E[id+':m']=e1;
   if(M.type!=='shaded'){const e2={p:id+'.Z1',n:id+'.Z2',y:C.div([1,0],[M.Za[0],M.Za[1]*f/M.f])};elsAC.push(e2);E[id+':a']=e2}
   if(['split','cstart','two'].includes(M.type)){/* المفتاح الطارد: يفتح عند 75% من السرعة التزامنية ويغلق تحت 60% */
    if(Math.abs(npu)>0.75)ph.cso=1;else if(Math.abs(npu)<0.6)ph.cso=0;const g=ph.cso?1e-9:1e4;const e3={p:id+'.S1',n:id+'.S2',y:[g,0]};elsAC.push(e3);E[id+':s']=e3}
   M1={id,M,ws}}
  const ctx={C,E,Ed,elsAC,elsDC,ph,f,on:id=>on(a,id),cpol,P,ex,brk};P.forEach(p=>{if(EXT[p.kind]&&EXT[p.kind].els)EXT[p.kind].els(a,p,ctx)});
  const r=a.solveAC(elsAC),rd=a.solve(elsDC);
  const V=(x,y2)=>mag(r.vd(x,y2)),I=e=>mag(r.cur(e)),Vd=(x,y2)=>rd.vt(x)-rd.vt(y2),Id=e=>rd.cur(e);
  ph.V=V;ph.I=I;ph.Vd=Vd;ph.Id=Id;ph.E=E;ph.Ed=Ed;ph.r=r;ph.rd=rd;
  /* الحركة */
  if(MS){const M=MS.M,id=MS.id;const Vc=[['U1','U2'],['V1','V2'],['W1','W2']].map(([x,y2])=>r.vd(id+'.'+x,id+'.'+y2));
   const a1=C.pol?C.pol(1,120):cpol(1,120),a2=cpol(1,240);
   const Vp=C.abs(C.mul([1/3,0],C.add(C.add(Vc[0],C.mul(a1,Vc[1])),C.mul(a2,Vc[2])))),Vn=C.abs(C.mul([1/3,0],C.add(C.add(Vc[0],C.mul(a2,Vc[1])),C.mul(a1,Vc[2]))));
   ph.Vp=Vp;ph.Vn=Vn;const dir=Vp>=Vn?1:-1;if(Math.max(Vp,Vn)>0.05*IM.Vw)ph.dir=dir;
   const Iw=[0,1,2].map(j=>I(E[id+':'+j]));ph.Iw=Math.max(...Iw);ph.Idc=Math.max(...[0,1,2].map(j=>Math.abs(Id(Ed[id+':'+j]))));
   const lock=a.sw('SW:LOCK');const TL=brk?a.knob('K:'+brk.id):0;
   const N=10,h=a.dt/N;let w=ph.w,Te=0;
   for(let k=0;k<N;k++){const d=ph.dir||1;let s=MS.ws>0?(MS.ws-d*w)/MS.ws:1;
    if(IM.Ytab){/* نموذج القراءات: سرعة اللاحمل 99% من التزامنية مع تأخير زمني */const tgt=Vp>0.4*IM.Vw?d*0.9995*MS.ws:0;Te=0;if(!lock)w+=(tgt-w)*h/0.6}
    else{const Tf=IM.tq(Math.max(Vp,Vn),s,MS.R2e,ph.f),Tb=IM.tq(Math.min(Vp,Vn),2-s,MS.R2e,ph.f);Te=d*(Tf-Tb);
     const Tl=TL*Math.max(-1,Math.min(1,w/3))+ (M.Bf||0)*w+(M.Tf0||0)*Math.max(-1,Math.min(1,w/2));
     if(lock)w=0;else w+=(Te-Tl)*h/M.J}}
   if(lock)w=0;ph.acc=a.dt>0?(w-ph.w)/a.dt:0;ph.w=w;ph.Te=Te;ph.n=w*60/(2*Math.PI);ph.ns=MS.ws*60/(2*Math.PI);ph.s=MS.ws>0?(MS.ws-(ph.dir||1)*w)/MS.ws:0;
   ph.Tload=lock?Math.abs(Te):Math.abs(TL*Math.max(-1,Math.min(1,w/3)));
   /* الأخطاء */
   const en=Vp>0.5*IM.Vw;
   if(a.hold('wov',[0,1,2].some(j=>C.abs(Vc[j])>1.15*IM.Vw),0.3))a.mistake('winding-overvolt');
   if(a.hold('sph',Math.max(Vp,Vn)>0.3*IM.Vw&&Math.min(Vp,Vn)>0.35*Math.max(Vp,Vn),0.6))a.mistake('single-phase');
   if(!IM.Ytab){if(a.hold('stall',en&&!lock&&Math.abs(w)<0.3*MS.ws&&!MS.ropen,ex.stallT||5))a.mistake('stall');
    if(a.hold('ovl',ph.Iw>(ex.ovlK||1.5)*IM.IN&&Math.abs(w)>0.5*MS.ws,6))a.mistake('overload')}
   if(a.hold('lfv',lock&&Math.max(Vp,Vn)>(ex.lockV||0.5)*IM.Vw,1.5))a.mistake('locked-fullv');
   const IdS=Math.max(0,...P.filter(p=>p.kind==='dcs').map(p=>Math.abs(Id(Ed[p.id]))));if(a.hold('dco',IdS>(IM.M.Idc||IM.IN*(M.conn==='D'?SQ3:1))*1.4,0.5))a.mistake('dc-over');
   if(MS.ropen&&a.hold('rop',en,1.5))a.once('rotor-open',X.mistakes['rotor-open']);}
  if(pmv&&!G&&!ex.pmFree){const wset=a.knob('N:'+pmv.id)*2*Math.PI/60;const w0=ph.w||0;const w=w0+((on(a,pmv.id)?wset:0)-w0)*Math.min(1,a.dt/0.3);ph.acc=a.dt>0?(w-w0)/a.dt:0;ph.w=w;ph.n=w*60/(2*Math.PI)}
  if(G){const id=G.id,M=G.M,ws=SMM.ws,we0=2*Math.PI*M.f;
   /* تيار المجال من حل التيار المستمر (يُستعمل في الخطوة التالية) */ph.If=Id(Ed[id+':f']);
   const Iw=[0,1,2].map(j=>C.neg(r.cur(E[id+':'+j])));const Ew=[0,1,2].map(j=>cpol(ph.Ew||0,(ph.phi||0)*180/Math.PI-120*j));
   const Vt=r.vd(id+'.U1',id+'.U2');const VtM=C.abs(Vt),phV=Math.atan2(Vt[1],Vt[0]);ph.Vt=VtM;
   const Pe=Iw.reduce((s2,I2,j)=>s2+C.mul(Ew[j],C.conj(I2))[0],0);ph.Pe=Pe;ph.Iarm=Math.max(...Iw.map(x=>C.abs(x)));
   const grid=P.find(p=>p.kind==='grid');const sw=P.find(p=>p.kind==='sw3');const bus=!!grid&&on(a,grid.id)&&(!sw||on(a,sw.id))&&VtM>0.3*SMM.Vw;
   const lock=a.sw('SW:LOCK');const TL=brk?a.knob('K:'+brk.id):0;const pmOn=pmv&&on(a,pmv.id);const wset=pmv?a.knob('N:'+pmv.id)*2*Math.PI/60:0;
   const Kg=M.Tr/(0.05*ws),Tpmax=2*M.Tr;
   const N=12,h=a.dt/N;let w=ph.w||0,phi=ph.phi||0;
   for(let k=0;k<N;k++){const s1=(ws-w)/ws;let Tm=0;
    if(pmv)Tm+=pmOn?Math.max(-Tpmax,Math.min(Tpmax,Kg*(wset-w))):-M.Tr*0.02*Math.sign(w);
    Tm-=TL*Math.max(-1,Math.min(1,w/3));if(sm.motor)Tm-=0.02*M.Tr*Math.max(-1,Math.min(1,w/2));
    let Tel;if(bus){const Ec=cpol(ph.Ew||0,phi*180/Math.PI),Vc=cpol(VtM,phV*180/Math.PI);const Pw=3*C.mul(Ec,C.conj(C.div(C.sub(Ec,Vc),[M.Ra,M.Xs])))[0];Tel=Pw/Math.max(w,0.3*ws);
     /* القفص المخمد: عزم حثي عند الانزلاق */const sm_=0.3,kv=(VtM/SMM.Vw)**2;Tel-=1.5*M.Tr*kv*2/(Math.abs(s1)/sm_+sm_/Math.max(Math.abs(s1),1e-6))*Math.sign(s1)}
    else Tel=Pe/Math.max(w,0.05*ws);
    if(!bus&&pmv){/* المولد منفرداً: المحرك الابتدائي يثبت السرعة */w+=((pmOn?wset:0)-w)*h/0.5}
    else{w+=(Tm-Tel)*h/M.J}
    if(lock)w=0;phi+=(w*M.p/2-we0)*h}
   phi=Math.atan2(Math.sin(phi),Math.cos(phi));ph.acc=a.dt>0?(w-(ph.w||0))/a.dt:0;ph.w=w;ph.phi=phi;ph.n=w*60/(2*Math.PI);ph.ns=SMM.ns;ph.s=(ws-w)/ws;ph.bus=bus;
   ph.delta=((phi-phV)*180/Math.PI+540)%360-180;ph.Tload=Math.abs(TL*Math.max(-1,Math.min(1,w/3)));
   /* لحظة إغلاق قاطع التوازي */
   if(sw){const cl=on(a,sw.id);if(cl&&!ph._sw){const dv=Math.max(...[[1,2],[3,4],[5,6]].map(([x,y2])=>C.abs(ph._pre&&ph._pre[x]||[0,0])));if(dv>0.25*SMM.Vw&&on(a,grid.id))a.mistake('bad-sync')}ph._sw=cl;
    ph._pre={};[[1,2],[3,4],[5,6]].forEach(([x,y2])=>{ph._pre[x]=r.vd(sw.id+'.'+x,sw.id+'.'+y2)})}
   if(!bus)ph.synced=0;else if(Math.abs(ph.s)<0.003&&(ph.Ew||0)>0.2*SMM.Vw)ph.synced=1;
   if(bus&&ph.synced&&a.hold('po',Math.abs(ph.s)>0.03,1.5))a.mistake('pull-out');
   if(a.hold('gov',ph.Iarm>1.25*SMM.Iw&&(!sm.motor||ph.synced),ex.ovT||3))a.mistake(ex.scTest?'sc-field':'gen-over');
   if(sm.motor&&bus&&!G.fs&&Math.abs(ph.If||0)<1e-3&&a.hold('fo',Math.abs(ph.s)>0.2,0.5))a.mistake('field-open');
   if(sm.motor&&a.hold('stl',bus&&!lock&&Math.abs(w)<0.2*ws,6))a.mistake('stall')}
  if(M1){const id=M1.id,M=M1.M,ws=M1.ws;const Im=r.cur(E[id+':m']),Ia=E[id+':a']?r.cur(E[id+':a']):[0,0];
   const q=C.abs(Im)*C.abs(Ia)*Math.sin(IM1.ang(Ia)-IM1.ang(Im));const qn=IM1.qd?q/IM1.qd:0;const Vm=C.abs(r.vd(id+'.U1',id+'.U2'));const kv=(Vm/M.V)**2;
   ph.Im=C.abs(Im);ph.Ia=C.abs(Ia);ph.alpha=C.abs(Im)>1e-6&&C.abs(Ia)>1e-6?((IM1.ang(Ia)-IM1.ang(Im))*180/Math.PI+540)%360-180:null;
   const lock=a.sw('SW:LOCK');const TL=brk?a.knob('K:'+brk.id):0;const Ns=8,h=a.dt/Ns;let w=ph.w,Te=0;
   const design=CUR1[M.type],mo=CUR1.mainOnly;
   for(let k=0;k<Ns;k++){const npu=w/ws,d0=Math.sign(npu);let T;
    if(M.type==='shaded'){const ds=M.dirS||1,u=npu*ds;T=ds*M.Tb*kv*(u>=0?design(u):design(0)-2*u)}
    else{const dq=Math.sign(qn)||0,u=Math.max(0,dq*npu);T=M.Tb*(kv*d0*mo(Math.abs(npu))+qn*(design(u)-mo(u)))}
    Te=T;const Tl=TL*Math.max(-1,Math.min(1,w/3))+(M.Bf||0)*w+0.03*M.Tb*Math.max(-1,Math.min(1,w/2));if(lock)w=0;else w+=(Te-Tl)*h/M.J}
   if(lock)w=0;ph.acc=a.dt>0?(w-ph.w)/a.dt:0;ph.w=w;ph.Te=Te;ph.n=w*60/(2*Math.PI);ph.ns=IM1.ns;ph.s=1-Math.abs(ph.n)/IM1.ns;ph.Tload=lock?Math.abs(Te):Math.abs(TL*Math.max(-1,Math.min(1,w/3)));
   const en=Vm>0.5*M.V;
   if(a.hold('stall1',en&&!lock&&Math.abs(w)<0.2*ws,ex.stallT||4))a.mistake('stall');
   if(a.hold('lfv1',lock&&Vm>0.5*M.V,ex.lockT||4))a.mistake('locked-fullv');
   if(['split','cstart'].includes(M.type)&&a.hold('aux',ph.Ia>0.3*IM1.IN&&Math.abs(w)>0.85*ws,5))a.mistake('aux-hot');
   if(a.hold('ovl1',ph.Im>1.6*IM1.IN&&Math.abs(w)>0.5*ws,6))a.mistake('overload')}
  /* قصر المصدر */
  srcs.forEach(p=>{if(p.kind==='ac1'){const e=E[p.id];const Is=I(e),Vs=V(e.p,e.n),Vset=a.knob('K:'+p.id);if(a.hold('sc'+p.id,on(a,p.id)&&Vset>5&&Vs<0.4*Vset&&Is>1,0.2)){const am=P.some(q=>q.kind==='am'&&!q.dc&&I(E[q.id])>0.8*Is);a.mistake(am?'amm-parallel':'short')}}
   else if(p.kind==='ac3v'||p.kind==='grid'){const es=E[p.id];const Is=Math.max(...es.map(e=>I(e))),Vs=Math.min(...es.map(e=>V(e.p,e.n))),Vset=(p.kind==='grid'?p.V:(ph.VLset||0))/SQ3;
    if(a.hold('sc'+p.id,on(a,p.id)&&Vset>5&&Is>0.3*Vset/RSRC,0.2)){const am=P.some(q=>q.kind==='am'&&!q.dc&&I(E[q.id])>0.8*Is);a.mistake(am?'amm-parallel':'short')}}
   else if(p.kind==='dcs'){const e=Ed[p.id];const Is=Math.abs(Id(e)),Vs=Math.abs(Vd(e.p,e.n)),Vset=a.knob('K:'+p.id);if(a.hold('sc'+p.id,on(a,p.id)&&Vset>1&&Vs<0.2*Vset&&Is>5,0.3))a.mistake('short')}});
  /* القراءات */
  const out={};P.forEach(p=>{const id=p.id;
   if(p.kind==='vm')out[id]=p.dc?Vd(id+'+',id+'-'):V(id+'+',id+'-');
   else if(p.kind==='am'){out[id]=p.dc?Id(Ed[id]):I(E[id]);const pk=ph.pk;pk[id]=Math.max(pk[id]||0,Math.abs(out[id]))}
   else if(p.kind==='wm'){const Vw=r.vd(id+'.V+',id+'.V-'),Iw=r.cur(E[id+':I']);out[id]=C.mul(Vw,C.conj(Iw))[0]}
   else if(p.kind==='brake'){out[id+':n']=ph.n||0;out[id+':T']=ph.Tload||0}
   else if(p.kind==='pm'){out[id+':n']=ph.n||0}
   else if(p.kind==='sm3'&&p.motor){out[id+':d']=ph.bus&&Math.abs(ph.s)<0.01?ph.delta:null}
   else if(p.kind==='lmp3'){[0,1,2].forEach(k=>{out[id+':'+k]=I(E[id+':'+k])*p.R>0.15*p.Vr})}});
  /* قمة التيار تُصفّر عند فصل المصدر */
  Object.assign(ctx,{r,rd,V,I,Vd,Id,out});P.forEach(p=>{if(EXT[p.kind]&&EXT[p.kind].post)EXT[p.kind].post(a,p,ctx)});
  if(!srcs.some(p=>on(a,p.id))){ph.pk={};ph.tOn=0}else ph.tOn=(ph.tOn||0)+a.dt;
  ph.read=out;if(ex.tick)ex.tick(a,ph);return out};
 /* --------- التسجيل --------- */
 const nets=a=>a.nets().of;
 const lineEl=(ph,src,k)=>[].concat(ph.E[src])[k||0];
 /* شبكات «الخط نفسه»: الأميتر وملف تيار الواتميتر لا يفصلان الخط في نظر الفولتميتر */
 const lineNets=a=>{const of=nets(a),par={};const f=x=>{while(par[x]!=null&&par[x]!==x)x=par[x];return x};
  P.forEach(p=>{const pr=p.kind==='am'?[p.id+'+',p.id+'-']:p.kind==='wm'?[p.id+'.I+',p.id+'.I-']:null;if(!pr)return;const x=of[pr[0]],y=of[pr[1]];if(x==null||y==null)return;const rx=f(x),ry=f(y);if(rx!==ry)par[rx]=ry});
  const o={};Object.keys(of).forEach(t=>o[t]=of[t]==null?null:f(of[t]));return o};
 function measures(a,q){const ph=a.S.phys,of=nets(a),ol=lineNets(a);
  if(q.t==='V'){for(const m of P.filter(p=>p.kind==='vm'&&!!p.dc===!!q.dc)){const mp=ol[m.id+'+'],mn=ol[m.id+'-'];if(mp==null||mn==null)continue;
    const A=ol[q.a],Bn=ol[q.b];if(mp===A&&mn===Bn)return {v:ph.read[m.id],m:m.id};if(mp===Bn&&mn===A)return {v:q.dc?-ph.read[m.id]:ph.read[m.id],m:m.id}}return null}
  const same=(x,y)=>{const d1=C.abs(C.sub(x,y)),d2=C.abs(C.add(x,y)),m=Math.max(C.abs(y),1e-4);return Math.min(d1,d2)<=0.02*m};
  if(q.t==='I'||q.t==='Ipk'){const E=q.dc?ph.Ed:ph.E;const el=q.src?lineEl(ph,q.src,q.idx):E[q.el];if(!el)return null;
   for(const m of P.filter(p=>p.kind==='am'&&!!p.dc===!!q.dc)){const ma=of[m.id+'+'],mb=of[m.id+'-'];if(ma==null||mb==null||ma===mb)continue;const Im=Math.abs(ph.read[m.id]);
    let okm;if(q.dc){const Iel=Math.abs(ph.Id(el));okm=[el.p,el.n].some(t=>of[t]===ma||of[t]===mb)&&Math.abs(Im-Iel)<=Math.max(0.01*Iel,1e-4)}
    else if(q.src)okm=Im>1e-4&&same(ph.r.cur(E[m.id]),ph.r.cur(el));
    else{const Iel=ph.I(el);okm=[el.p,el.n].some(t=>of[t]===ma||of[t]===mb)&&Math.abs(Im-Iel)<=Math.max(0.01*Iel,1e-4)}
    if(okm)return {v:q.t==='Ipk'?(ph.pk[m.id]||Im):Im,m:m.id}}return null}
  if(q.t==='W'){const el=lineEl(ph,q.src,q.idx);for(const m of P.filter(p=>p.kind==='wm')){const okI=same(ph.r.cur(ph.E[m.id+':I']),ph.r.cur(el))&&ph.I(el)>1e-4;
    const okV=(ol[m.id+'.V+']===ol[q.a]&&ol[m.id+'.V-']===ol[q.b])||(ol[m.id+'.V+']===ol[q.b]&&ol[m.id+'.V-']===ol[q.a]);
    if(okI&&okV){/* القدرة الحقيقية بإشارتها مهما كان اتجاه الملفين */const Vab=ph.r.vd(q.a,q.b),Ie=C.neg(ph.r.cur(el));return {v:C.mul(Vab,C.conj(Ie))[0],m:m.id}}}return null}
  if(MQ[q.t])return MQ[q.t](a,q,ph,of,ol,P);
  if(q.t==='Am'){for(const m of P.filter(p=>p.kind==='am'&&!p.dc)){const x=of[m.id+'+'],y=of[m.id+'-'];if(x==null||y==null||x===y)continue;if(ol[m.id+'+']===ol[q.a])return {v:Math.abs(ph.read[m.id]),m:m.id}}return null}
  if(q.t==='Wr'){const m=P.find(p=>p.kind==='wm'&&p.id===q.m);if(!m)return null;const okV=(ol[m.id+'.V+']===ol[q.a]&&ol[m.id+'.V-']===ol[q.b])||(ol[m.id+'.V+']===ol[q.b]&&ol[m.id+'.V-']===ol[q.a]);const okI=ol[m.id+'.I+']!=null&&ol[m.id+'.I+']===ol[q.a]&&of[m.id+'.I+']!==of[m.id+'.I-'];
   if(!okV||!okI)return null;const sg=ol[m.id+'.V+']===ol[q.a]?1:-1;return {v:sg*ph.read[m.id],m:m.id}}
  if(q.t==='D'){if(!sm||!a.S.phys.synced)return null;return {v:a.S.phys.delta,m:'strobe'}}
  if(q.t==='N'){if(!brk&&!pmv&&ph.n==null)return null;return {v:ph.n||0,m:'tach'}}
  if(q.t==='Tq'){if(!brk)return null;return {v:ph.Tload||0,m:'torque'}}
  if(q.t==='K')return {v:a.knob(q.knob),m:'knob'};
  return null}
 X.tables=ex.tables.map(t=>({id:t.id,title:t.title,xh:t.xh||'',fx:t.fx,cols:t.cols,rows:t.rows.map(q=>({k:q.k,h:q.h,dp:q.dp!=null?q.dp:3})),px:t.px,py:t.py,xu:t.xu,yu:t.yu,plot:t.plot||false,xdp:t.xdp}));
 X.record=a=>{let lastMsg=null;for(const t of ex.tables){if(t.when&&!t.when(a))continue;const c=t.col?t.col(a):0;if(typeof c==='string'){lastMsg=lastMsg||c;continue}if(c==null||c<0)continue;
   const got={},names=[];t.rows.forEach(q=>{if(q.calc)return;const m=measures(a,q);if(m){got[q.k]=m.v;names.push(q.h.replace(/<[^>]+>/g,'')+' = '+(+m.v.toPrecision(4)))}});
   if(!names.length)continue;const old=(a.S.rec[t.id]||{})[c]||{};const val=Object.assign({},old,got);
   t.rows.forEach(q=>{if(q.calc){try{const v=q.calc(val,a);if(v!=null&&isFinite(v))val[q.k]=v}catch(e){}}});
   return {ok:true,table:t.id,col:c,val,msg:'سجّلت: '+names.join('، ')+(t.cols.length>1?' في العمود '+(t.fx?t.fx(t.cols[c]):t.cols[c]):'')+'.'}}
  return {msg:lastMsg||ex.hint||'لا يوجد جهاز قياس موصّل على كمية مطلوبة في الجدول. الفولتميتر بين خطين (أو على الملف)، والأميتر داخل الخط، وملف تيار الواتميتر داخل الخط وملف جهده بين الخطين المطلوبين.'}};
 const full=a=>ex.tables.every(t=>{const T2=a.S.rec[t.id]||{};return t.cols.every((_,i)=>T2[i]&&t.rows.every(q=>T2[i][q.k]!=null))});
 const offAll=a=>srcs.every(p=>!a.sw('SW:'+p.id));
 X.steps=[{t:'وصّل الدائرة كما في «مخطط التوصيل»: '+(ex.wiring||''),done:a=>Object.keys(a.S.rec).length>0}]
  .concat(ex.tables.map(t=>({t:t.step||('سجّل جدول «'+t.title+'»'),done:a=>{const T2=a.S.rec[t.id]||{};return t.cols.every((_,i)=>T2[i]&&t.rows.every(q=>T2[i][q.k]!=null))},
   live:a=>{const T2=a.S.rec[t.id]||{};const miss=[];t.cols.forEach((c,i)=>t.rows.forEach(q=>{if(!q.calc&&!(T2[i]&&T2[i][q.k]!=null))miss.push(q.h.replace(/<[^>]+>/g,'')+(t.cols.length>1?' @'+(t.fx?t.fx(c):c):''))}));return miss.length?'باقي: '+miss.slice(0,6).join('، ')+(miss.length>6?' …':''):''}})))
  .concat([{t:'افصل المصدر.',done:a=>full(a)&&offAll(a)}]);
 X.complete=a=>full(a)&&offAll(a);
 X.view={title:'المقارنة بالقانون',mount(el){el.innerHTML='<div data-st class="sub" style="margin-bottom:6px"></div><div data-ck class="sub"></div>'},frame(el,a){const ph=a.S.phys;if(!el||(ph.ckT=(ph.ckT||0)+a.dt)<0.4)return;ph.ckT=0;
  const st=el.querySelector('[data-st]');if(st&&(mot||mot1))st.innerHTML=`السرعة التزامنية n<sub>s</sub> = <b class="ltr">${fx(ph.ns||0,0)} rpm</b>، والانزلاق الآن S = <b class="ltr">${fx(ph.s||0,3)}</b>`;
  const e=el.querySelector('[data-ck]');if(e&&ex.check)try{e.innerHTML=ex.check(a.S.rec,a,ph)}catch(err){e.textContent=''}}};
 return X}
/* الربط: شريط اختيار التجربة، وشريط اختيار الآلة (آلة الكتاب / آلة معمل صغيرة) */
function bind(B,LES,EX,MACH){Object.keys(LES).forEach(id=>{const L=B.LESSONS.find(l=>l.id===id);if(!L)return;
 L.bench=el=>{const ks=LES[id];let cur=ks[0],mk='book';const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  el.innerHTML=(ks.length>1?`<div class="variant" style="margin-bottom:8px"><span>التجربة:</span><div class="seg" role="group">${ks.map(k=>`<button data-ex="${k}" aria-pressed="${k===cur}">${esc(EX[k].name)}</button>`).join('')}</div></div>`:'')+
   `<div class="variant" style="margin-bottom:10px"><span>الآلة:</span><div class="seg" role="group"><button data-mk="book" aria-pressed="true"></button><button data-mk="lab" aria-pressed="false"></button></div></div><p class="sub" data-mnote></p><div data-host></div>`;
  const go=()=>{el.querySelectorAll('[data-ex]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ex===cur));el.querySelectorAll('[data-mk]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mk===mk));
   const D=EX[cur];const Mb=MACH[D.book||'book'],Ml=MACH[D.lab||'lab'];
   el.querySelector('[data-mk="book"]').textContent='آلة الكتاب: '+Mb.short;el.querySelector('[data-mk="lab"]').textContent='آلة معمل صغيرة';
   const M=mk==='book'?Mb:Ml;el.querySelector('[data-mnote]').innerHTML=(mk==='book'?'آلة مثال الكتاب نفسها التي في تبويب «المختبر»، فالقراءات قريبة من أرقام الكتاب. ':'آلة بحجم أجهزة المعمل (قيم توضيحية من خارج الكتاب)، فالقراءات لا تطابق أرقام الكتاب. ')+(M.note||'');
   const host=el.querySelector('[data-host]');host.innerHTML='';const ex=D.build(M,mk);
   const fb=(L.theory||[]).find(b=>b.fig&&b.draw&&(!ex.figRef||String(b.fig).indexOf(ex.figRef)>=0));
   ex.fig=()=>`<p><b>التوصيل:</b> ${ex.wiring||''}</p>`+(fb?`<div class="svgbox">${fb.draw()}</div><p class="sub">شكل توضيحي من الدرس ${fb.fig}</p>`:'');
   B.BENCH.mount(host,{key:id+'-'+cur+'-'+mk,title:'المنضدة: '+D.name,layout:layout(ex),exp:make(B,L,ex),
    intro:'تجربة معمل (إضافة من خارج الكتاب): وصّل الدائرة، وشغّل، وقِس بالأجهزة، وسجّل القراءات، ثم قارنها بالقانون في لوحة «المقارنة بالقانون». تحصل على «جاهز للمعمل» عندما تكمل الجداول بلا أي خطأ.'})};
  el.querySelectorAll('[data-ex]').forEach(b=>b.addEventListener('click',()=>{cur=b.dataset.ex;go()}));el.querySelectorAll('[data-mk]').forEach(b=>b.addEventListener('click',()=>{mk=b.dataset.mk;go()}));go()}})}
window.ACM={layout,make,bind,IMmodel,SMmodel,PART,EXT,MQ,T,meterMod,lin};
})();
