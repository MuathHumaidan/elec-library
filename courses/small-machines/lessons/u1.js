/* Unit 1 — محركات الخطوة (ص 6–26) */
(function(B){
"use strict";
/* =====================================================================
   geometry + drawing helpers (angles in degrees, measured COUNTER-CLOCKWISE from the top)
   ===================================================================== */
const D=Math.PI/180;
const pol=(cx,cy,r,a)=>[cx-r*Math.sin(a*D),cy-r*Math.cos(a*D)];
const xy=p=>p[0].toFixed(1)+' '+p[1].toFixed(1);
const mod=(a,m)=>((a%m)+m)%m;
const f1=v=>(+v).toFixed(1);
const dpOf=v=>Number.isInteger(B.round(v,4))?0:Number.isInteger(B.round(v*10,4))?1:2;
const fmt3=x=>{const s=Math.abs(x).toFixed(3).replace(/0+$/,'').replace(/\.$/,'.0');return s};
const sgnTxt=v=>v>0?'+1':v<0?'-1':'0';
const ACW='⟲',CW='⟳';

/* ---------- motor definitions (torque model: T = −Σ i_k·sin(Z·(θ−e_k)), θ in degrees) ---------- */
const MOT={
 vr3:{kind:'stack',title:'الشكل (١-٢)',desc:'ثلاث مجموعات (Stacks) متتالية على طول المحور، في كل مجموعة 8 أقطاب، ودوار مشترك بثمانية أسنان',ref:'ص 10',N:3,P:8,Z:8,e:[0,15,30],labels:['A','B','C'],uni:1,step:15},
 vr7:{kind:'plane',title:'الشكل (١-٧)',desc:'ثلاث مجموعات في مستوى واحد، كل مجموعة قطبان متقابلان (6 أقطاب)، ودوار بأربعة أسنان',ref:'ص 14',N:3,P:4,Z:4,e:[0,30,60],labels:['A','B','C'],uni:1,step:30},
 q17:{kind:'plane',title:'الشكل (١-١٤)',desc:'س ١-٧: أربع مجموعات × قطبان (8 أقطاب)، ودوار بستة أسنان مرقمة',ref:'ص 24',N:4,P:6,Z:6,e:[0,15,30,45],labels:['A','B','C','D'],uni:1,step:15,nums:1},
 q18:{kind:'plane',title:'س ١-٨',desc:'خمس مجموعات × قطبان (10 أقطاب)، ودوار بأربعة أسنان (السؤال بلا شكل؛ ترتيب الأقطاب هنا من عندنا)',ref:'ص 25',N:5,P:4,Z:4,e:[0,18,36,54,72],labels:['A','B','C','D','E'],uni:1,step:18},
 f116:{kind:'plane',title:'الشكل (١-١٦)',desc:'تمرين ١-١٠: ثلاث مجموعات × قطبان (6 أقطاب) مرقمة 1 و 2 و 3، ودوار بأربعة أسنان',ref:'ص 26',N:3,P:4,Z:4,e:[0,30,60],labels:['1','2','3'],uni:1,step:30},
 pm:{kind:'pm',title:'الشكل (١-٨)',desc:'مجموعتان (a و b) في كل منهما 4 أقطاب، ودوار أسطواني بأربعة أقطاب مغناطيسية دائمة',ref:'ص 15',N:2,Z:2,e:[0,45],labels:['A','B'],uni:0,step:45},
 hy:{kind:'hyb',title:'الشكل (١-١١)',desc:'مجموعتان (A-A′ و B-B′) كل منهما قطبان، ودوار عليه مغناطيس محوري وفي كل طرف قطعة حديد بخمسة أسنان، والطرفان مزاحان نصف سن',ref:'ص 18',N:2,Z:5,zt:5,e:[0,18],labels:['A','B'],uni:0,step:18,top:1,left:1,s1:0,n1:180,pl:['A','B','A′','B′'],sp:'S',np:'N'},
 hy3:{kind:'hyb',title:'الشكل (١-١٥)',desc:'س ١-٩: مجموعتان (Phase 1 رأسي و Phase 2 أفقي)، وفي كل طرف من الدوار ثلاثة أسنان',ref:'ص 25',N:2,Z:3,zt:3,e:[0,30],labels:['1','2'],uni:0,step:30,top:-1,left:1,s1:180,n1:0,pl:['1','2','1′','2′'],sp:'S',np:'N'}
};
// plane VR: for phase k find the pole pair (counted clockwise from the top) whose rest position is e_k
Object.values(MOT).forEach(M=>{if(M.kind!=='plane')return;const pitch=360/M.P;M.al=M.e.map(ek=>{for(let j=0;j<M.N;j++){const a=-j*180/M.N;if(Math.abs(mod(a-ek+1e-6,pitch))<1e-3||Math.abs(mod(a-ek+1e-6,pitch)-pitch)<1e-3)return a}return 0})});
const torq=(M,ph,th)=>{let T=0;for(let k=0;k<ph.length;k++)if(ph[k])T-=ph[k]*Math.sin(M.Z*(th-M.e[k])*D);return T};
function settle(M,ph,th){if(!ph.some(v=>v))return th;let x=th;
  for(let i=0;i<3000;i++){const T=torq(M,ph,x);const sl=(torq(M,ph,x+0.01)-T)/0.01;
    if(Math.abs(T)<1e-9){if(sl>0){x+=0.3;continue}break}x+=0.35*T/(M.Z*D)}
  return x}

/* ---------- sequences (rows exactly as printed) ---------- */
const SEQ={
 t11:{id:'t11',tab:'(١-١)',short:'(١-١) كاملة '+ACW,cap:'التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك خطوات كاملة ضد عقارب الساعة',ref:'ص 11',fig:'(١-٣)',rows:[[1,0,0],[0,1,0],[0,0,1],[1,0,0],[0,1,0],[0,0,1]],per:3,dir:1,half:0},
 t12:{id:'t12',tab:'(١-٢)',short:'(١-٢) كاملة '+CW,cap:'التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك خطوات كاملة مع عقارب الساعة',ref:'ص 11',fig:'(١-٤)',rows:[[1,0,0],[0,0,1],[0,1,0],[1,0,0],[0,0,1],[0,1,0]],per:3,dir:-1,half:0},
 t13:{id:'t13',tab:'(١-٣)',short:'(١-٣) نصف '+ACW,cap:'التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك بنصف خطوة ضد عقارب الساعة',ref:'ص 12',fig:'(١-٥)',rows:[[1,0,0],[1,1,0],[0,1,0],[0,1,1],[0,0,1],[1,0,1],[1,0,0]],per:6,dir:1,half:1},
 t14:{id:'t14',tab:'(١-٤)',short:'(١-٤) نصف '+CW,cap:'التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك بنصف خطوة مع عقارب الساعة',ref:'ص 12',fig:'(١-٦)',rows:[[1,0,0],[1,0,1],[0,0,1],[0,1,1],[0,1,0],[1,1,0],[1,0,0]],per:6,dir:-1,half:1},
 t15:{id:'t15',tab:'(١-٥)',short:'(١-٥) كاملة '+ACW,cap:'التسلسل المنطقي لتتابع توصيل المجموعات بحيث يخطو المحرك بخطوة كاملة ضد عقارب الساعة',ref:'ص 16',fig:'(١-٩)',rows:[[1,0],[0,1],[-1,0],[0,-1],[1,0]],per:4,dir:1,half:0},
 t15r:{id:'t15r',tab:'عكس (١-٥)',short:'عكس (١-٥) كاملة '+CW,cap:'عكس ترتيب الجدول (١-٥): خطوة كاملة مع عقارب الساعة («بعكس ترتيب تسلسل التغذية» ص 17 — الصفوف مستنتجة)',ref:'ص 17',rows:[[1,0],[0,-1],[-1,0],[0,1],[1,0]],per:4,dir:-1,half:0,gen:1},
 t16:{id:'t16',tab:'(١-٦)',short:'(١-٦) نصف '+ACW,cap:'التسلسل المنطقي لتتابع توصيل المجموعات بحيث يخطو المحرك بنصف خطوة عكس عقارب الساعة',ref:'ص 17',fig:'(١-١٠)',rows:[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],per:8,dir:1,half:1},
 t16r:{id:'t16r',tab:'عكس (١-٦)',short:'عكس (١-٦) نصف '+CW,cap:'عكس ترتيب الجدول (١-٦): نصف خطوة مع عقارب الساعة (الصفوف مستنتجة)',ref:'ص 17',rows:[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],per:8,dir:-1,half:1,gen:1},
 t17:{id:'t17',tab:'(١-٧)',short:'(١-٧) مجموعتان '+ACW,cap:'تتم تغذية مجموعتي الثابت معًا ويخطو المحرك بخطوة كاملة 18 درجة ضد عقارب الساعة',ref:'ص 21',fig:'(١-١٣أ)',rows:[[1,1],[-1,1],[-1,-1],[1,-1],[1,1]],per:4,dir:1,half:0},
 t18:{id:'t18',tab:'(١-٨)',short:'(١-٨) مجموعتان '+CW,cap:'تتم تغذية مجموعتي الثابت معًا ويخطو المحرك بخطوة كاملة 18 درجة مع عقارب الساعة',ref:'ص 21',fig:'(١-١٣ب)',rows:[[1,1],[1,-1],[-1,-1],[-1,1],[1,1]],per:4,dir:-1,half:0}
};
// generated tables (suggested solutions for the unit questions — not printed in the book)
function genSeq(M,kind){const N=M.N,L=M.labels,u=k=>{const r=Array(N).fill(0);r[mod(k,N)]=1;return r},both=(a,b)=>{const r=u(a);r[mod(b,N)]=1;return r};let rows=[],dir=1,half=0,nm='';
  if(M.uni){
    if(kind==='fa'){for(let k=0;k<N;k++)rows.push(u(k));nm='كاملة '+ACW}
    if(kind==='fc'){for(let k=0;k<N;k++)rows.push(u(-k));dir=-1;nm='كاملة '+CW}
    if(kind==='ha'){for(let k=0;k<N;k++){rows.push(u(k));rows.push(both(k,k+1))}half=1;nm='نصف '+ACW}
    if(kind==='hc'){for(let k=0;k<N;k++){rows.push(u(-k));rows.push(both(-k,-k-1))}half=1;dir=-1;nm='نصف '+CW}
  } else {
    if(kind==='fa'){rows=[[1,0],[0,1],[-1,0],[0,-1]];nm='كاملة '+ACW}
    if(kind==='fc'){rows=[[1,0],[0,-1],[-1,0],[0,1]];dir=-1;nm='كاملة '+CW}
    if(kind==='ha'){rows=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];half=1;nm='نصف '+ACW}
    if(kind==='hc'){rows=[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];half=1;dir=-1;nm='نصف '+CW}
  }
  const per=rows.length;rows.push(rows[0].slice());
  const st=half?M.step/2:M.step;
  return {id:'g'+kind,tab:'مولَّد',short:nm,cap:`جدول مولَّد (حل مقترح، ليس من الكتاب): ${half?'نصف خطوة':'خطوة كاملة'} ${dir>0?'ضد':'مع'} عقارب الساعة — كل خطوة ${st}°`,ref:M.ref,rows,per,dir,half,gen:1}}
const rowAt=(sq,r)=>sq.rows.length%sq.per===0?sq.rows[r%sq.rows.length]:sq.rows[r===0?0:((r-1)%sq.per)+1];
const rowIdx=(sq,r)=>sq.rows.length%sq.per===0?r%sq.rows.length:(r===0?0:((r-1)%sq.per)+1);
const cyc=(sq,n)=>{const a=[];for(let r=0;r<n;r++)a.push(rowAt(sq,r));return a};

/* ---------- one cross-section (stator ring + poles + rotor) ---------- */
function teethPath(cx,cy,n,a0,Rc,Rt,tw){const p=360/n,rt=Math.min(tw*1.15,Rc*Math.sin(p/2*D)*0.92),ta=Math.asin(Math.min(.95,tw/Rt))/D,ra=Math.asin(Math.min(.95,rt/Rc))/D;let d='';
  for(let j=0;j<n;j++){const c=a0+j*p;d+=(j?'L':'M')+xy(pol(cx,cy,Rc,c-ra))+'L'+xy(pol(cx,cy,Rt,c-ta))+`A${Rt.toFixed(1)} ${Rt.toFixed(1)} 0 0 0 `+xy(pol(cx,cy,Rt,c+ta))+'L'+xy(pol(cx,cy,Rc,c+ra))+`A${Rc.toFixed(1)} ${Rc.toFixed(1)} 0 0 0 `+xy(pol(cx,cy,Rc,c+p-ra))}
  return d+'Z'}
const polStyle=st=>st==='N'?['var(--stop-soft)','var(--stop)']:st==='S'?['var(--blue-soft)','var(--blue)']:['var(--surface)','var(--fg)'];
function poleG(cx,cy,s,p,Ry,Rp){
  const w=(p.w||10)*s,ws=w+4*s,y0=cy-Ry-2*s,yb=cy-Rp-8*s,yf=cy-Rp,[fill,stroke]=polStyle(p.st);
  const pts=[[cx-w,y0],[cx-w,yb],[cx-ws,yb+3*s],[cx-ws,yf],[cx+ws,yf],[cx+ws,yb+3*s],[cx+w,yb],[cx+w,y0]].map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');
  const cc=p.st?'var(--live)':'var(--wire)',ch=Math.max(4,Ry-Rp-14*s);
  return `<g transform="rotate(${(-p.a).toFixed(2)} ${cx} ${cy})"><polygon points="${pts}" style="fill:${fill}"/><polyline points="${pts}" style="fill:none;stroke:${stroke};stroke-width:${p.st?2.2:1.3}"/>`+
   `<rect x="${(cx-w-6*s).toFixed(1)}" y="${(cy-Ry+3*s).toFixed(1)}" width="${(5*s).toFixed(1)}" height="${ch.toFixed(1)}" rx="1.5" style="fill:${cc}"/><rect x="${(cx+w+1*s).toFixed(1)}" y="${(cy-Ry+3*s).toFixed(1)}" width="${(5*s).toFixed(1)}" height="${ch.toFixed(1)}" rx="1.5" style="fill:${cc}"/></g>`}
function fluxDia(cx,cy,a,Rm){const p0=xy(pol(cx,cy,Rm,a)),p1=xy(pol(cx,cy,Rm,a+180));
  return `<path class="w flow" style="stroke-width:2" d="M${p0}L${p1}A${Rm} ${Rm} 0 0 0 ${xy(pol(cx,cy,Rm,a+270))}A${Rm} ${Rm} 0 0 0 ${p0}"/><path class="w flow" style="stroke-width:2" d="M${p0}L${p1}A${Rm} ${Rm} 0 0 1 ${xy(pol(cx,cy,Rm,a+90))}A${Rm} ${Rm} 0 0 1 ${p0}"/>`}
function fluxAdj(cx,cy,aN,aS,Rin,Rm){const dl=mod(aS-aN+180,360)-180,si=dl>0?0:1;
  return `<path class="w flow" style="stroke-width:1.8" d="M${xy(pol(cx,cy,Rm,aN))}L${xy(pol(cx,cy,Rin,aN))}A${Rin} ${Rin} 0 0 ${si} ${xy(pol(cx,cy,Rin,aS))}L${xy(pol(cx,cy,Rm,aS))}A${Rm} ${Rm} 0 0 ${1-si} ${xy(pol(cx,cy,Rm,aN))}"/>`}
function angMark(cx,cy,r,a1,a2,t){const d=mod(a2-a1+180,360)-180,sw=d>0?0:1,pm=pol(cx,cy,r+11,a1+d/2);
  return `<path d="M${xy(pol(cx,cy,r,a1))}A${r} ${r} 0 0 ${sw} ${xy(pol(cx,cy,r,a2))}" style="fill:none;stroke:var(--blue-ink);stroke-width:1.6"/>`+
   [a1,a2].map(a=>`<path d="M${xy(pol(cx,cy,r*0.25,a))}L${xy(pol(cx,cy,r+4,a))}" style="stroke:var(--blue-ink);stroke-width:1;stroke-dasharray:3 3"/>`).join('')+
   `<text class="txt b" x="${pm[0].toFixed(1)}" y="${(pm[1]+4).toFixed(1)}" text-anchor="middle" style="font-size:11px">${t}</text>`}
/* o:{cx,cy,s,th,poles:[{a,st,lbl,w}],rotor:{kind:'teeth'|'pm',n,a0,tw,pol,nums:[[angleOffset,text]],ghost:{n,a0,pol}},flux:[svg],frame,marks:[[r,a1,a2,t]],rid} */
function section(o){
  const cx=o.cx,cy=o.cy,s=o.s||1,Ro=100*s,Ry=82*s,Rp=50*s,Rt=46*s,Rc=31*s,th=o.th||0,R=o.rotor;let g='';
  if(o.frame)g+=`<rect x="${(cx-Ro-10*s).toFixed(1)}" y="${(cy-Ro-10*s).toFixed(1)}" width="${(2*Ro+20*s).toFixed(1)}" height="${(2*Ro+20*s).toFixed(1)}" rx="${(14*s).toFixed(1)}" style="fill:var(--live-soft);stroke:var(--live);stroke-width:1.4"/>`;
  g+=`<path fill-rule="evenodd" d="M${cx-Ro} ${cy}a${Ro} ${Ro} 0 1 0 ${2*Ro} 0a${Ro} ${Ro} 0 1 0 ${-2*Ro} 0ZM${cx-Ry} ${cy}a${Ry} ${Ry} 0 1 0 ${2*Ry} 0a${Ry} ${Ry} 0 1 0 ${-2*Ry} 0Z" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.3"/>`;
  o.poles.forEach(p=>{g+=poleG(cx,cy,s,p,Ry,Rp)});
  o.poles.forEach(p=>{if(p.st){const q=pol(cx,cy,(Ry+Rp)/2+2*s,p.a);g+=`<text class="txt" x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle" style="font-size:${(11*Math.min(1.15,s)).toFixed(1)}px;fill:${polStyle(p.st)[1]}">${p.st}</text>`}
    if(p.lbl){const q=pol(cx,cy,Ro+11*s,p.a);g+=`<text class="txt" x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle" style="font-size:${(11.5*Math.min(1.1,s)).toFixed(1)}px">${p.lbl}</text>`}});
  // rotor
  let rg='';
  if(R.kind==='pm'){[0,90,180,270].forEach(c=>{const st=(c%180===0)?'S':'N',[fl,sk]=polStyle(st);rg+=`<path d="M${cx} ${cy}L${xy(pol(cx,cy,Rt,c-45))}A${Rt} ${Rt} 0 0 0 ${xy(pol(cx,cy,Rt,c+45))}Z" style="fill:${fl};stroke:${sk};stroke-width:1.2"/>`});
    rg+=`<circle cx="${cx}" cy="${cy}" r="${Rt}" style="fill:none;stroke:var(--fg);stroke-width:1.4"/>`;}
  else{const [fl,sk]=R.pol?polStyle(R.pol):['var(--surface-2)','var(--fg)'];
    if(R.ghost){const [gf,gs]=polStyle(R.ghost.pol);rg+=`<path d="${teethPath(cx,cy,R.ghost.n,R.ghost.a0,Rc,Rt,(R.tw||10)*s)}" style="fill:${gf};stroke:${gs};stroke-width:1;opacity:.55;stroke-dasharray:3 2"/>`}
    rg+=`<path d="${teethPath(cx,cy,R.n,R.a0||0,Rc,Rt,(R.tw||10)*s)}" style="fill:${fl};stroke:${sk};stroke-width:1.5"/>`;
    const m=pol(cx,cy,Rt-5*s,R.a0||0);rg+=`<circle cx="${m[0].toFixed(1)}" cy="${m[1].toFixed(1)}" r="${(3.2*s).toFixed(1)}" style="fill:var(--live)"/>`}
  rg+=`<circle cx="${cx}" cy="${cy}" r="${(6*s).toFixed(1)}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`;
  g+=`<g data-rot="${cx} ${cy}" transform="rotate(${(-th).toFixed(2)} ${cx} ${cy})">${rg}</g>`;
  // upright rotor labels
  (R.nums||[]).forEach(([off,t,rr])=>{const r=(rr||(R.kind==='pm'?Rt*0.6:Rc-9*s)),q=pol(cx,cy,r,th+off);
    g+=`<text class="txt" data-rl="${off} ${r.toFixed(1)} ${cx} ${cy}" x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle" style="font-size:${(R.kind==='pm'?12:9.5)*Math.min(1.2,s)}px${R.kind==='pm'?';fill:'+polStyle(t)[1]:''}">${t}</text>`});
  (o.flux||[]).forEach(f=>{g+=f});
  (o.marks||[]).forEach(m=>{g+=angMark(cx,cy,m[0]*s,m[1],m[2],m[3])});
  return g}
const RAD=s=>({Ro:100*s,Ry:82*s,Rp:50*s,Rt:46*s,Rc:31*s,Rm:91*s});

/* ---------- full motor drawings (one function per motor kind) ---------- */
function motorSVG(M,ph,th,o){o=o||{};let s='';
  if(M.kind==='stack'){const sc=o.s||.9,r=RAD(sc);
    const cmp=!!o.compact;s=`<svg viewBox="0 0 ${cmp?450:670} ${cmp?512:262}" role="img" aria-label="محرك الخطوة ذو الممانعة المتغيرة بثلاث مجموعات">`;
    for(let k=0;k<3;k++){const cx=cmp?[115,335,225][k]:115+220*k,cy=cmp?(k<2?120:370):120,on=!!ph[k],poles=[],flux=[];
      for(let j=0;j<8;j++)poles.push({a:M.e[k]+45*j,st:on?(j%2?'S':'N'):'',w:10});
      if(on&&!o.noflux)for(let j=0;j<8;j+=2){flux.push(fluxAdj(cx,cy,M.e[k]+45*j,M.e[k]+45*(j+1),r.Rc*0.62,r.Rm));flux.push(fluxAdj(cx,cy,M.e[k]+45*j,M.e[k]+45*(j-1),r.Rc*0.62,r.Rm))}
      s+=section({cx,cy,s:sc,th,poles,rotor:{kind:'teeth',n:8,a0:0,tw:10},flux,frame:on,marks:(o.marks||[])[k]});
      s+=`<text class="txt" x="${cx}" y="${cy+116}" text-anchor="middle" style="font-size:13px">Phase ${'abc'[k]}</text><text class="txt ar m" x="${cx}" y="${cy+134}" text-anchor="middle">${k===0?'المجموعة A (المرجع)':'المجموعة '+M.labels[k]+': مزاحة '+(15*k)+'° ضد عقارب الساعة'}</text>`}
    return s+'</svg>'}
  if(M.kind==='plane'){const sc=o.s||1.25,cx=170,cy=168,r=RAD(sc),poles=[],flux=[];
    s=`<svg viewBox="0 0 340 340" role="img" aria-label="محرك خطوة ذو ممانعة متغيرة في مستوى واحد">`;
    const w=M.N<=3?13:M.N===4?10:8;
    for(let k=0;k<M.N;k++){const on=!!ph[k];poles.push({a:M.al[k],st:on?'N':'',lbl:M.labels[k],w});poles.push({a:M.al[k]+180,st:on?'S':'',lbl:M.labels[k]+'′',w});if(on&&!o.noflux)flux.push(fluxDia(cx,cy,M.al[k],r.Rm))}
    const nums=M.nums?Array.from({length:M.P},(x,j)=>[-j*360/M.P,String(j+1)]):[];
    s+=section({cx,cy,s:sc,th,poles,rotor:{kind:'teeth',n:M.P,a0:0,tw:M.P>=6?8:11,nums},flux,marks:o.marks});
    return s+'</svg>'}
  if(M.kind==='pm'){const sc=o.s||1.25,cx=170,cy=168,r=RAD(sc),poles=[],flux=[];
    s=`<svg viewBox="0 0 340 340" role="img" aria-label="محرك خطوة ذو أقطاب مغناطيسية دائمة">`;
    [0,90,180,270].forEach(a=>{const v=ph[0]*(a%180===0?1:-1);poles.push({a,st:v>0?'N':v<0?'S':'',lbl:'a',w:10})});
    [45,135,225,315].forEach(a=>{const v=ph[1]*((a===45||a===225)?1:-1);poles.push({a,st:v>0?'N':v<0?'S':'',lbl:'b',w:10})});
    if(!o.noflux)[0,1].forEach(k=>{if(!ph[k])return;const base=k?45:0,nA=ph[k]>0?[base,base+180]:[base+90,base+270];nA.forEach(a=>{flux.push(fluxAdj(cx,cy,a,a+90,r.Rt*0.32,r.Rm));flux.push(fluxAdj(cx,cy,a,a-90,r.Rt*0.32,r.Rm))})});
    s+=section({cx,cy,s:sc,th,poles,rotor:{kind:'pm',nums:[[0,'S'],[90,'N'],[180,'S'],[270,'N']]},flux,marks:o.marks});
    return s+'</svg>'}
  if(M.kind==='hyb'){const sc=o.s||1,r=RAD(sc),p=360/M.zt;
    s=`<svg viewBox="0 0 540 292" role="img" aria-label="المقطعان العرضيان لمحرك الخطوة الهجين">`;
    const va=ph[0]*M.top,vb=ph[1]*M.left,sts=[va>0?'N':va<0?'S':'',vb>0?'N':vb<0?'S':'',va>0?'S':va<0?'N':'',vb>0?'S':vb<0?'N':''];
    [['S',M.s1,M.sp,140,'a-a','طرف الدوار S (أسنانه جنوبية)'],['N',M.n1,M.np,400,'b-b','طرف الدوار N (أسنانه شمالية)']].forEach(([end,a0,tl,cx,sec,cap],ei)=>{const cy=126,poles=[0,90,180,270].map((a,i)=>({a,st:sts[i],lbl:M.pl[i],w:17})),flux=[];
      if(!o.noflux)poles.forEach(pp=>{if(pp.st&&pp.st!==end){flux.push(`<path class="w flow" style="stroke-width:2.2" d="${end==='S'?'M'+xy(pol(cx,cy,r.Rp-1,pp.a))+'L'+xy(pol(cx,cy,r.Rc*0.45,pp.a)):'M'+xy(pol(cx,cy,r.Rc*0.45,pp.a))+'L'+xy(pol(cx,cy,r.Rp-1,pp.a))}"/>`)}});
      const nums=Array.from({length:M.zt},(x,j)=>[a0+j*p,tl+(j+1)]);
      s+=section({cx,cy,s:sc,th,poles,rotor:{kind:'teeth',n:M.zt,a0,tw:M.zt>3?10:13,pol:end,nums},flux,marks:(o.marks||[])[ei]});
      s+=`<text class="txt" x="${cx}" y="264" text-anchor="middle" style="font-size:12.5px">${sec}</text><text class="txt ar m" x="${cx}" y="283" text-anchor="middle">${cap}</text>`});
    return s+'</svg>'}
  return ''}

/* longitudinal section of the hybrid motor — الشكل (١-١١أ) */
function hybLong(){let s=`<svg viewBox="0 0 380 210" role="img" aria-label="مقطع طولي في محرك الخطوة الهجين">`;
  s+=`<rect x="70" y="18" width="240" height="26" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.3"/><rect x="70" y="166" width="240" height="26" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.3"/>`;
  [[96,140],[240,284]].forEach(([a,b])=>{s+=`<rect x="${a}" y="44" width="${b-a}" height="10" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.1"/><rect x="${a}" y="156" width="${b-a}" height="10" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.1"/>`});
  s+=`<path d="M30 105H350" style="stroke:var(--fg);stroke-width:5;stroke-linecap:round"/>`;
  s+=`<rect x="96" y="58" width="44" height="94" rx="3" style="fill:var(--blue-soft);stroke:var(--blue);stroke-width:1.5"/><rect x="240" y="58" width="44" height="94" rx="3" style="fill:var(--stop-soft);stroke:var(--stop);stroke-width:1.5"/>`;
  s+=`<rect x="140" y="76" width="50" height="58" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.3"/><rect x="190" y="76" width="50" height="58" style="fill:var(--stop-soft);stroke:var(--fg);stroke-width:1.3"/>`;
  s+=`<text class="txt" x="165" y="110" text-anchor="middle" style="fill:var(--blue)">S</text><text class="txt" x="215" y="110" text-anchor="middle" style="fill:var(--stop)">N</text>`;
  s+=`<path class="w flow" style="stroke-width:2" d="M160 92H262V31H118V92H160"/><path class="w flow" style="stroke-width:2" d="M160 118H262V179H118V118H160"/>`;
  [[118,'a'],[262,'b']].forEach(([x,l])=>{s+=`<path d="M${x} 8V202" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:6 3 1 3"/><text class="txt m" x="${x+6}" y="12">${l}</text><text class="txt m" x="${x+6}" y="206">${l}</text>`});
  s+=`<text class="txt m" x="320" y="35">Stator</text><text class="txt m" x="190" y="72" text-anchor="middle">Permanent magnet</text><text class="txt m" x="296" y="60">Air gap</text>`;
  return s+'</svg>'}

/* ---------- waveforms like the book's timing figures ---------- */
const ROWC=['--live','--blue','--stop','--on','--blue-ink'];
function waveSVG(cols,labels,bip,o){o=o||{};const n=Math.max(cols.length,o.min||0,1),X0=46,cw=Math.min(54,(600-X0)/n),W=X0+cw*n+44,rh=bip?64:48,top=12,H=top+rh*labels.length+22;
  let s=`<svg viewBox="0 0 ${W.toFixed(0)} ${H}" role="img" aria-label="موجات الجهد الموصل مع المجموعات">`;
  if(o.cur!=null&&o.cur>=0)s+=`<rect x="${(X0+o.cur*cw).toFixed(1)}" y="${top-6}" width="${cw.toFixed(1)}" height="${rh*labels.length+4}" rx="4" style="fill:var(--blue-soft)"/>`;
  for(let c=0;c<=n;c++)s+=`<path d="M${(X0+c*cw).toFixed(1)} ${top-4}V${top+rh*labels.length}" style="stroke:var(--line);stroke-width:1;stroke-dasharray:2 3"/>`;
  labels.forEach((l,k)=>{const base=bip?top+k*rh+rh/2:top+k*rh+rh-10,amp=bip?rh/2-9:rh-22,col=ROWC[k%ROWC.length];
    s+=`<path d="M${X0} ${base}H${(X0+cw*n+16).toFixed(1)}" style="stroke:var(--muted);stroke-width:1"/><path d="M${(X0+cw*n+16).toFixed(1)} ${base-3}l6 3l-6 3z" style="fill:var(--muted)"/>`;
    if(bip)s+=`<path d="M${X0} ${base+amp+5}V${base-amp-5}" style="stroke:var(--muted);stroke-width:1"/><text class="txt m" x="${X0-4}" y="${base-amp+4}" text-anchor="end">+</text><text class="txt m" x="${X0-4}" y="${base+amp+4}" text-anchor="end">−</text>`;
    s+=`<text class="txt" x="${X0-12}" y="${base-(bip?-4:amp/2-4)}" text-anchor="end">V<tspan dy="3" style="font-size:9px">${l}</tspan></text>`;
    let d=`M${X0} ${base}`;cols.forEach((v,c)=>{d+=`V${(base-v[k]*amp).toFixed(1)}H${(X0+(c+1)*cw).toFixed(1)}`});d+=`V${base}`;
    s+=`<path d="${d}" style="fill:none;stroke:var(${col});stroke-width:2.4;stroke-linejoin:round"/>`});
  for(let c=0;c<n;c++)s+=`<text class="txt m" x="${(X0+(c+.5)*cw).toFixed(1)}" y="${H-6}" text-anchor="middle">${c+1}</text>`;
  s+=`<text class="txt m" x="${(X0+cw*n+22).toFixed(1)}" y="${H-6}" text-anchor="end">Time</text>`;
  return s+'</svg>'}
const waveFig=(sq,labels,n,bip)=>`<div class="svgbox" style="max-width:640px">${waveSVG(cyc(sq,n),labels,bip)}</div>`;

/* ---------- sequence table ---------- */
function seqTable(sq,labels,hi,o){o=o||{};
  return `<table class="tt"><thead><tr><th>الخطوة</th>${labels.map(l=>`<th>${l}</th>`).join('')}</tr></thead><tbody>`+
   sq.rows.map((r,i)=>`<tr${i===hi?' style="background:var(--live-soft);font-weight:700"':''}><td>${i+1}</td>${r.map(v=>`<td><span class="ltr">${v}</span></td>`).join('')}</tr>`).join('')+'</tbody></table>'+(o.cap?`<p class="sub">الجدول ${sq.tab}: «${sq.cap}» <span class="ref">${sq.ref}</span></p>`:'')}
const tblFig=(sq,labels)=>`<div class="tablebox" style="max-width:360px">${seqTable(sq,labels,-1)}</div>`;

/* ---------- small UI helpers (as in the reference labs) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة أو تجربة تسلسل آخر.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}}}
const pbHTML=(id,color,cap,label)=>`<button class="pb ${color}" id="${id}" aria-label="${label}"><span class="cap">${cap}</span><small>${label}</small></button>`;
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const segHTML=(attr,items,cur,wrap)=>`<div class="seg" role="group"${wrap?' style="flex-wrap:wrap"':''}>${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const rangeHTML=(id,lbl,min,max,step,v,unit)=>`<label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:170px">${lbl}: <b id="${id}V" class="ltr" style="color:var(--fg)">${v} ${unit}</b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}" style="accent-color:var(--blue);width:100%"></label>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const LEG=`<div class="legend"><span><i style="background:var(--stop)"></i>قطب شمالي N</span><span><i style="background:var(--blue)"></i>قطب جنوبي S</span><span><i style="background:var(--live)"></i>ملف مغذّى / مسار الفيض</span><span><i style="background:var(--wire)"></i>ملف بلا تغذية</span></div>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
const row3=items=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;align-items:start">${items.map(([h,c])=>`<div><div class="svgbox" style="margin-top:0">${h}</div><p class="sub" style="text-align:center">${c}</p></div>`).join('')}</div>`;

/* ---------- «fill the table» exercise ---------- */
function fillTable(host,o){const n=o.rows.length,L=o.labels;let cur=o.rows.map((r,i)=>i===0?r.slice():r.map(()=>0)),res=null;
  const cyc1=v=>o.bip?(v===0?1:v===1?-1:0):(v?0:1);
  const draw=()=>{host.innerHTML=`<h2>${o.title} <small>${o.ref||''}</small></h2><p class="sub">${o.hint}</p>
    <div class="tablebox" style="max-width:420px"><table class="tt"><thead><tr><th>الخطوة</th>${L.map(l=>`<th>${l}</th>`).join('')}${res?'<th></th>':''}</tr></thead><tbody>${cur.map((r,i)=>`<tr${res?` style="background:${res[i]?'var(--on-soft)':'var(--stop-soft)'}"`:''}><td>${i+1}</td>${r.map((v,k)=>`<td>${i===0?`<b class="ltr">${v}</b>`:`<button class="btn" data-c="${i},${k}" style="min-width:44px"><span class="ltr">${v}</span></button>`}</td>`).join('')}${res?`<td>${res[i]?'✓':'✗'}</td>`:''}</tr>`).join('')}</tbody></table></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn primary" data-k="chk">تحقّق</button><button class="btn" data-k="sol">أظهر الحل</button><button class="btn" data-k="clr">مسح</button></div>
    <p class="sub" id="ftMsg">${res?(res.every(x=>x)?'<b style="color:var(--on)">ممتاز، الجدول صحيح.</b> '+(o.ok||''):'بعض الصفوف غير صحيحة (المظللة بالأحمر). راجع الشرح أو جرّب التسلسل في المحاكاة.'):''}</p>`};
  host.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){const [i,k]=c.dataset.c.split(',').map(Number);cur[i][k]=cyc1(cur[i][k]);res=null;draw();return}
    const b=e.target.closest('[data-k]');if(!b)return;if(b.dataset.k==='chk'){res=cur.map((r,i)=>r.every((v,k)=>v===o.rows[i][k]));if(o.onCheck)o.onCheck(res.every(x=>x))}
    if(b.dataset.k==='sol'){cur=o.rows.map(r=>r.slice());res=cur.map(()=>true)}if(b.dataset.k==='clr'){cur=o.rows.map((r,i)=>i===0?r.slice():r.map(()=>0));res=null}draw()});
  draw()}

/* =====================================================================
   STEPPER LAB — shared by lessons 2–7
   opt:{title,ref,motors:[keys],seqs:M=>[seq],steps,tries,extra:(host,w)=>{tick?},note}
   ===================================================================== */
function stepLab(el,opt){
  let mk=opt.motors[0],M=MOT[mk],SQ=opt.seqs(M),sq=SQ[0],mode='seq',ph=sq.rows[0].slice(),th=0,om=0,r=0,auto=false,rate=2,acc=0,hist=[ph.slice()],tgt=0,prevT=0,lastD=0,sig='',tsig='',wsig='';
  const w={mk,mode,seq:sq.id,steps:0,bySeq:{},auto,rate,changes:0,on:1,neg:0,th:0,lastD:0,flags:{}};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>${opt.title} <small>${opt.ref}</small></h2>
    ${opt.motors.length>1?`<div style="margin-top:8px"><div class="sub">اختر المحرك</div>${segHTML('mk',opt.motors.map(k=>[k,MOT[k].title]),mk,1)}</div>`:''}
    <p class="sub" id="mdesc"></p>
    <div class="wrap-in" style="align-items:flex-start;padding-top:8px">
     <div><div class="sub">طريقة التغذية</div>${segHTML('md',[['seq','تسلسل الجدول'],['man','يدوي (أنت تغذي المجموعات)']],mode)}</div>
     <div id="sqSel"></div>
    </div>
    <div class="wrap-in" id="ctl" style="align-items:flex-end"></div>
    <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0">
     <div class="read"><span>خطوة المحرك θ</span><b id="rTh"></b></div><div class="read"><span>الخطوة في هذا التسلسل</span><b id="rInc"></b></div>
     <div class="read"><span>عدد الخطوات</span><b id="rN">0</b></div><div class="read"><span>زاوية الدوار</span><b id="rAng">0.0°</b></div>
     <div class="read"><span>السرعة</span><b id="rRpm">0 rpm</b></div><div class="read"><span>آخر حركة</span><em class="mode-chip" id="rDir">—</em></div></div></div>
    <div class="callout" id="say"></div></div>
   <div class="panel c7"><h2>المحرك <small id="mref"></small></h2><p class="sub">النقطة البرتقالية على الدوار تعلّم السن رقم 1 لتتابع دورانه. الخط المتقطع المتحرك = مسار الفيض المغناطيسي.</p><div class="svgbox" id="mv"></div>${LEG}</div>
   <div class="panel c5"><h2>جدول التسلسل المنطقي <small id="tref"></small></h2><div class="tablebox" id="tb"></div><p class="sub" id="tnote"></p></div>
   <div class="panel c7"><h2>موجات الجهد الموصل مع المجموعات <small id="wref"></small></h2><p class="sub">كل عمود = خطوة واحدة (تُرسم مع كل خطوة أو كل تغيير يدوي). العمود المظلل = الخطوة الحالية.</p><div class="svgbox" id="wv"></div><div style="margin-top:8px"><button class="btn" id="wclr">مسح الموجات</button></div></div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(opt.tries)}</div>
   ${opt.extra?'<div class="panel c12" id="xt"></div>':''}
  </div>`;
  const $=s=>el.querySelector(s);
  const incOf=()=>sq.half?M.step/2:M.step;
  function applyPh(nv,count){const changed=nv.some((v,k)=>v!==ph[k]);ph=nv.slice();if(changed||count){hist.push(ph.slice());if(hist.length>12)hist.shift()}
    prevT=tgt;tgt=settle(M,ph,th);lastD=B.round(tgt-prevT,2);if(!ph.some(v=>v))lastD=0;w.lastD=lastD}
  function reset(){ph=sq.rows[0].slice();th=0;om=0;r=0;acc=0;tgt=0;prevT=0;lastD=0;hist=[ph.slice()];sig='';tsig='';wsig=''}
  function buildSel(){$('#sqSel').innerHTML=mode==='seq'?`<div class="sub">التسلسل</div>${segHTML('sq',SQ.map(q=>[q.id,q.short]),sq.id,1)}`:`<div class="sub">مقارنة بالجدول</div>${segHTML('sq',SQ.map(q=>[q.id,q.short]),sq.id,1)}`;
    $('#sqSel').querySelectorAll('[data-sq]').forEach(b=>b.addEventListener('click',()=>{sq=SQ.find(q=>q.id===b.dataset.sq);if(mode==='seq'){auto=false;reset()}buildSel();buildCtl();tsig='';wsig=''}))}
  function buildCtl(){
    if(mode==='seq'){$('#ctl').innerHTML=`<div class="pbs">${pbHTML('stp','green','▶','خطوة واحدة')}${swHTML('aut','تلقائي','تشغيل مستمر',auto)}</div>${rangeHTML('rate','عدد الخطوات في الثانية',0.5,10,0.5,rate,'خطوة/ث')}<button class="btn" id="rst">إعادة إلى الخطوة 1</button>`;
      $('#stp').addEventListener('click',()=>doStep());
      $('#aut').addEventListener('click',e=>{auto=!auto;e.currentTarget.setAttribute('aria-pressed',auto);acc=0});
      $('#rate').addEventListener('input',e=>{rate=+e.target.value;$('#rateV').textContent=rate+' خطوة/ث'});
      $('#rst').addEventListener('click',()=>{auto=false;reset();buildCtl()});
    } else {
      $('#ctl').innerHTML=M.uni?`<div class="pbs">${M.labels.map((l,k)=>swHTML('ph'+k,l,'المجموعة '+l,ph[k])).join('')}</div><button class="btn" id="off">فصل الكل</button>`:
        M.labels.map((l,k)=>`<div><div class="sub">المجموعة ${l}</div>${segHTML('p'+k,[[1,'+1'],[0,'0'],[-1,'-1']],ph[k])}</div>`).join('')+`<button class="btn" id="off">فصل الكل</button>`;
      if(M.uni)M.labels.forEach((l,k)=>$('#ph'+k).addEventListener('click',e=>{const nv=ph.slice();nv[k]=nv[k]?0:1;e.currentTarget.setAttribute('aria-pressed',!!nv[k]);w.changes++;applyPh(nv)}));
      else M.labels.forEach((l,k)=>el.querySelectorAll(`[data-p${k}]`).forEach(b=>b.addEventListener('click',()=>{const nv=ph.slice();nv[k]=+b.dataset['p'+k];el.querySelectorAll(`[data-p${k}]`).forEach(x=>x.setAttribute('aria-pressed',x===b));if(nv[k]!==ph[k])w.changes++;applyPh(nv)})));
      $('#off').addEventListener('click',()=>{applyPh(ph.map(()=>0));w.changes++;buildCtl()});
    }}
  function doStep(){r++;applyPh(rowAt(sq,r).slice(),1);w.steps++;w.bySeq[sq.id]=(w.bySeq[sq.id]||0)+1}
  function setMotor(k){mk=k;M=MOT[k];SQ=opt.seqs(M);sq=SQ[0];auto=false;reset();
    el.querySelectorAll('[data-mk]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mk===k));
    $('#mdesc').innerHTML=`<b>${M.title}</b> ${M.ref}: ${M.desc}.`;$('#mref').textContent=M.title+' '+M.ref;$('#rTh').textContent=M.step+'°';buildSel();buildCtl()}
  el.querySelectorAll('[data-mk]').forEach(b=>b.addEventListener('click',()=>setMotor(b.dataset.mk)));
  el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.md;auto=false;el.querySelectorAll('[data-md]').forEach(x=>x.setAttribute('aria-pressed',x===b));buildSel();buildCtl();tsig=''}));
  $('#wclr').addEventListener('click',()=>{hist=[ph.slice()];wsig=''});
  const gs=stepsUI($('#gs'),opt.steps,()=>w);
  const xt=opt.extra?opt.extra($('#xt'),w):null;
  setMotor(mk);
  function sayText(){const on=ph.map((v,k)=>v?(v>0?`<b class="ltr">${M.labels[k]}</b>`:`<b class="ltr">-${M.labels[k]}</b> (بعكس القطبية)`):null).filter(Boolean);
    if(!on.length)return 'لا توجد أي مجموعة مغذّاة: لا يوجد مجال ولا عزم، والدوار حر في مكانه.';
    let t=(on.length===1?'المجموعة ':'المجموعتان ')+on.join(' و ')+(on.length===1?' مغذّاة. ':' مغذّاتان معًا. ');
    const why=M.kind==='stack'||M.kind==='plane'?'تتجه الأسنان البارزة إلى أقرب أقطاب مغذّاة حتى تنطبق محاورها عليها':M.kind==='pm'?'يتجاذب كل قطبين مختلفين (قطب الثابت وقطب الدوار المغناطيسي)':'تنجذب أسنان الطرف S إلى قطب الثابت الشمالي، وأسنان الطرف N إلى القطب الجنوبي';
    if(Math.abs(lastD)<0.05)t+='الدوار في وضع الاتزان لهذه التغذية ولا يتحرك.';
    else t+=`${why}، فيدور الدوار <b class="ltr">${Math.abs(lastD)}°</b> <b>${lastD>0?'ضد':'مع'} اتجاه عقارب الساعة</b>${on.length>1&&M.uni?' ويقف في منتصف المسافة بين وضعي المجموعتين':''}.`;
    return t}
  loopOn(el,dt=>{
    if(mode==='seq'&&auto){acc+=dt*rate;while(acc>=1){acc-=1;doStep()}}
    // physics (illustrative dynamics)
    const wn=30,c=2*0.35*wn,G=wn*wn/(M.Z*D);const n=Math.ceil(dt/0.002),h=dt/Math.max(1,n);
    for(let i=0;i<n;i++){const T=torq(M,ph,th);om+=(G*T-c*om)*h;th+=om*h}
    if(Math.abs(om)<0.02&&ph.some(v=>v)&&Math.abs(torq(M,ph,th))<1e-4&&torq(M,ph,th+0.05)>0)om+=4;
    el.querySelectorAll('[data-rot]').forEach(g=>{const [cx,cy]=g.dataset.rot.split(' ');g.setAttribute('transform',`rotate(${(-th).toFixed(2)} ${cx} ${cy})`)});
    el.querySelectorAll('[data-rl]').forEach(t=>{const [off,rr,cx,cy]=t.dataset.rl.split(' ').map(Number);const q=pol(cx,cy,rr,th+off);t.setAttribute('x',q[0].toFixed(1));t.setAttribute('y',(q[1]+4).toFixed(1))});
    const sg=mk+'|'+ph.join(',');const cmp=$('#mv').clientWidth<520;if(sg!==sig||cmp!==w.cmp){sig=sg;w.cmp=cmp;$('#mv').innerHTML=motorSVG(M,ph,th,{compact:cmp});$('#say').innerHTML=sayText()}
    const hi=mode==='seq'?rowIdx(sq,r):sq.rows.findIndex(x=>x.every((v,k)=>v===ph[k]));
    const ts=sq.id+'|'+hi+'|'+mk;if(ts!==tsig){tsig=ts;$('#tb').innerHTML=seqTable(sq,M.labels,hi);$('#tref').textContent=(sq.gen?'':'الجدول ')+sq.tab+' '+sq.ref;
      $('#tnote').innerHTML=`«${sq.cap}». `+(mode==='seq'?`الصف المظلل هو الخطوة الحالية؛ كل خطوة = <b class="ltr">${incOf()}°</b>.`:(hi>=0?`التغذية الحالية تطابق الصف ${hi+1} من الجدول.`:'التغذية الحالية ليست صفًا في هذا الجدول.'))+(sq.gen?' <b>هذا الجدول مولَّد للتوضيح وليس مطبوعًا في الكتاب.</b>':'')}
    const ws=JSON.stringify(hist)+mk;if(ws!==wsig){wsig=ws;$('#wv').innerHTML=waveSVG(hist,M.labels,!M.uni,{cur:hist.length-1,min:12});$('#wref').textContent=sq.fig&&mode==='seq'?'قارن بالشكل '+sq.fig:''}
    $('#rInc').textContent=(mode==='seq'?incOf():'—')+(mode==='seq'?'°':'');$('#rN').textContent=w.steps;$('#rAng').textContent=f1(th)+'°';
    $('#rRpm').textContent=mode==='seq'&&auto?B.round(rate*incOf()/6,2)+' rpm':'0 rpm';
    const ch=$('#rDir');ch.textContent=Math.abs(lastD)<0.05?'—':(lastD>0?ACW+' ضد عقارب الساعة':CW+' مع عقارب الساعة');ch.className='mode-chip '+(Math.abs(lastD)<0.05?'':lastD>0?'run':'rev');
    Object.assign(w,{mk,mode,seq:sq.id,auto,rate,on:ph.filter(v=>v).length,neg:ph.some(v=>v<0)?1:0,th});
    gs.check();if(xt&&xt.tick)xt.tick(dt);
  });
}

/* =====================================================================
   Lesson 1 lab — printer line feed driven by a stepping motor
   ===================================================================== */
function printerLab(el){
  const ANG=[[15,'15° (الشكل ١-٢)'],[30,'30° (الشكل ١-٧)'],[45,'45° (الشكل ١-٨)'],[18,'18° (الهجين)']],L=16,HY=168;
  let st=15,dir=1,pulses=0,steps=0,shown=0,cont=false,rate=2,acc=0,acc2=0,queue=0,page=false,printing=null,lines={},paperY=0,ptimes=[],t=0,lastTarget='';
  const w={pulses:0,st:15,cont:false,rate:2,reached:0,lines:0,stCh:0,rev:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>طابعة يحرك ورقها محرك خطوة <small>تطبيق من استخدامات الكتاب ص 8 — أرقام توضيحية</small></h2>
    <p class="sub">«دوران المحرك بزاوية محددة لتحريك ورق الطباعة مسافة محددة حسب الفواصل بين الأسطر، ثم ثباته بعد ذلك حتى الانتهاء من طباعة السطر» (ص 8). كل نبضة كهربائية = خطوة واحدة = سطر واحد.</p>
    <div class="wrap-in" style="align-items:flex-start">
     <div><div class="sub">خطوة المحرك θ</div>${segHTML('ang',ANG,st,1)}</div>
     <div><div class="sub">الاتجاه</div>${segHTML('dir',[[1,ACW+' تغذية الورق'],[-1,CW+' إرجاع الورق']],dir)}</div>
    </div>
    <div class="wrap-in" style="align-items:flex-end">
     <div class="pbs">${pbHTML('pls','green','نبضة','نبضة واحدة')}${swHTML('cnt','مستمر','نبضات متتالية',0)}${swHTML('pg','صفحة','طباعة تلقائية',0)}</div>
     ${rangeHTML('prt','تردد النبضات',0.5,8,0.5,2,'نبضة/ث')}
     <div><div class="sub">أوقف الدوران بعد زاوية محددة</div>${segHTML('tg',[[90,'90°'],[180,'180°'],[360,'دورة كاملة 360°']],'')}</div>
     <button class="btn" id="rz">تصفير العدادات</button>
    </div>
    <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0">
     <div class="read"><span>عدد النبضات</span><b id="qP">0</b></div><div class="read"><span>عدد الخطوات</span><b id="qS">0</b></div>
     <div class="read"><span>الزاوية الكلية</span><b id="qA">0°</b></div><div class="read"><span>عدد الدورات</span><b id="qR">0</b></div><div class="read"><span>السرعة</span><b id="qV">0 rpm</b></div></div></div>
    <div class="callout" id="qMsg">اضغط «نبضة واحدة».</div></div>
   <div class="panel c7"><h2>المحرك والورق</h2><div class="svgbox" id="pv" style="max-width:560px;margin-inline:auto"></div></div>
   <div class="panel c5"><h2>النبضات الواصلة للمحرك <small>آخر 8 ثوانٍ</small></h2><div class="svgbox" id="pc"></div>
    <div class="callout"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> الزاوية الكلية = عدد النبضات × θ، والسرعة <span class="ltr">(rpm) = تردد النبضات × θ × 60 ÷ 360</span>. لذلك يكفي أن «نعدّ» النبضات لنعرف أين وقف الدوار، وأن نغيّر ترددها لنغيّر السرعة.</div></div>
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['غيّر θ إلى 45° وكم نبضة تحتاج دورة كاملة؟ (360 ÷ 45 = 8)','شغّل «طباعة تلقائية» ولاحظ أن المحرك يقف ثابتًا أثناء طباعة السطر ثم يخطو.','غيّر تردد النبضات أثناء التشغيل المستمر وراقب السرعة.','اعكس الاتجاه: يرجع الورق بنفس عدد الأسطر.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const pulse=()=>{pulses++;steps+=dir;ptimes.push(t);w.pulses=pulses;if(dir<0)w.rev=1};
  const zero=()=>{pulses=0;steps=0;shown=0;paperY=0;lines={};queue=0;printing=null;ptimes=[];w.pulses=0};
  el.querySelectorAll('[data-ang]').forEach(b=>b.addEventListener('click',()=>{st=+b.dataset.ang;w.st=st;w.stCh=1;zero();el.querySelectorAll('[data-ang]').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
  el.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>{dir=+b.dataset.dir;el.querySelectorAll('[data-dir]').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
  $('#pls').addEventListener('click',pulse);
  $('#cnt').addEventListener('click',e=>{cont=!cont;w.cont=cont;e.currentTarget.setAttribute('aria-pressed',cont);acc=0});
  $('#pg').addEventListener('click',e=>{page=!page;e.currentTarget.setAttribute('aria-pressed',page)});
  $('#prt').addEventListener('input',e=>{rate=+e.target.value;w.rate=rate;$('#prtV').textContent=rate+' نبضة/ث'});
  el.querySelectorAll('[data-tg]').forEach(b=>b.addEventListener('click',()=>{const a=+b.dataset.tg;queue=Math.round(a/st);acc2=0;lastTarget=`للدوران ${a}° نرسل ${a} ÷ ${st} = <b class="ltr">${queue}</b> نبضة ثم نتوقف، فيقف الدوار بدقة عند ${a}° من موضع البدء.`;$('#qMsg').innerHTML=lastTarget}));
  $('#rz').addEventListener('click',zero);
  const gs=stepsUI($('#gs'),[
   {t:'نبضة واحدة',x:'اضغط «نبضة واحدة». يدور المحرك خطوة واحدة (15°) ثم يقف ثابتًا، ويتحرك الورق سطرًا واحدًا.',done:w=>w.pulses>=1},
   {t:'عدّ النبضات',x:'أرسل 3 نبضات أخرى. لاحظ: عدد الخطوات = عدد النبضات، والزاوية = 4 × 15 = 60°.',done:w=>w.pulses>=4},
   {t:'زاوية توقف محددة',x:'صفّر العدادات ثم اختر «90°». يرسل المختبر 6 نبضات فقط ويقف الدوار عند 90° بالضبط.',done:w=>w.reached>=1},
   {t:'غيّر خطوة المحرك',x:'اختر θ = 30° (محرك الشكل ١-٧) ثم «دورة كاملة 360°»: يكفي الآن 12 نبضة.',done:w=>w.stCh&&w.st!==15&&w.reached>=2},
   {t:'التحكم في السرعة',x:'شغّل «نبضات متتالية» وحرّك منزلق التردد: السرعة تتبع تردد النبضات.',done:w=>w.cont&&w.rate!==2},
   {t:'طباعة صفحة',x:'شغّل «طباعة تلقائية»: يطبع رأس الطباعة السطر والمحرك ثابت، ثم نبضة واحدة للسطر التالي.',done:w=>w.lines>=3},
   {t:'عكس الاتجاه',x:'اختر «إرجاع الورق» وأرسل نبضات: يدور المحرك في الاتجاه الآخر بنفس الدقة.',done:w=>w.rev}
  ],()=>w);
  const words=i=>{const a=[];let x=0,k=Math.abs(i)*7+3;while(x<200){const len=18+((k*37)%40);a.push([x,Math.min(len,200-x)]);x+=len+8;k++}return a};
  loopOn(el,dt=>{t+=dt;
    if(cont){acc+=dt*rate;while(acc>=1){acc-=1;pulse()}}
    if(queue>0){acc2+=dt*Math.max(rate,4);while(acc2>=1&&queue>0){acc2-=1;queue--;pulse();if(!queue)w.reached++}}
    const tgt=steps*st;shown+=(tgt-shown)*Math.min(1,dt*16);const settled=Math.abs(tgt-shown)<0.4;
    paperY+=(steps*L-paperY)*Math.min(1,dt*16);
    if(page&&!printing&&settled&&!cont&&!queue)printing={t0:t,line:steps};
    if(printing){const pr=Math.min(1,(t-printing.t0)/1.1);lines[printing.line]=Math.max(lines[printing.line]||0,pr);if(pr>=1){printing=null;w.lines++;if(page)pulse()}}
    const hx=printing?300+200*Math.min(1,(t-printing.t0)/1.1):300;
    let s=`<svg viewBox="0 0 560 300" role="img" aria-label="محرك خطوة يحرك ورق طابعة"><defs><clipPath id="pclip"><rect x="280" y="14" width="240" height="${HY-8}"/></clipPath></defs>`;
    const cx=120,cy=150,R=88,nT=Math.round(360/st);
    s+=`<circle cx="${cx}" cy="${cy}" r="${R+12}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/>`;
    for(let i=0;i<nT;i++){const a=i*st,p1=pol(cx,cy,R+2,a),p2=pol(cx,cy,R+(i%(90/st>=1&&Number.isInteger(90/st)?90/st:nT)===0?12:7),a);s+=`<path d="M${xy(p1)}L${xy(p2)}" style="stroke:var(--fg);stroke-width:${i===0?2.4:1.2}"/>`}
    s+=`<g transform="rotate(${(-shown).toFixed(2)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${R-8}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`;
    for(let i=0;i<8;i++){const a=i*45;s+=`<path d="M${xy(pol(cx,cy,24,a))}L${xy(pol(cx,cy,R-16,a))}" style="stroke:var(--wire);stroke-width:3"/>`}
    s+=`<path d="M${cx} ${cy}L${cx} ${cy-R+10}" style="stroke:var(--live);stroke-width:5;stroke-linecap:round"/><circle cx="${cx}" cy="${cy}" r="12" style="fill:var(--fg)"/></g>`;
    s+=`<text class="txt" x="${cx}" y="${cy+R+28}" text-anchor="middle">θ = ${st}°  ·  ${nT} steps / rev</text>`;
    // belt + roller
    const rx=400,ry=HY+40;s+=`<path d="M${cx} ${cy-14}L${rx} ${ry-22}M${cx} ${cy+14}L${rx} ${ry+22}" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/>`;
    s+=`<g transform="rotate(${(-shown).toFixed(2)} ${rx} ${ry})"><circle cx="${rx}" cy="${ry}" r="34" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>${[0,90,180,270].map(a=>`<path d="M${xy(pol(rx,ry,6,a))}L${xy(pol(rx,ry,30,a))}" style="stroke:var(--fg);stroke-width:2"/>`).join('')}</g>`;
    // paper
    s+=`<rect x="290" y="14" width="220" height="${HY-8}" style="fill:var(--surface);stroke:var(--line)"/><g clip-path="url(#pclip)"><g transform="translate(0 ${(-paperY).toFixed(1)})">`;
    for(let i=steps-10;i<=steps+1;i++){const y=HY-12+i*L-(steps*L)+(steps*L);const pr=lines[i]||0;if(!pr)continue;words(i).forEach(([x,len])=>{const vis=Math.max(0,Math.min(len,pr*200-x));if(vis>0)s+=`<rect x="${300+x}" y="${(y-5).toFixed(1)}" width="${vis.toFixed(1)}" height="6" rx="2" style="fill:var(--muted)"/>`})}
    s+=`</g></g><rect x="${(hx-9).toFixed(1)}" y="${HY-4}" width="18" height="14" rx="3" style="fill:${printing?'var(--live)':'var(--fg)'}"/><path d="M290 ${HY+3}H510" style="stroke:var(--muted);stroke-width:1"/>`;
    s+=`<text class="txt ar m" x="400" y="${HY+92}" text-anchor="middle">رأس الطباعة ${printing?'يطبع والمحرك ثابت':'متوقف'}</text>`;
    $('#pv').innerHTML=s+'</svg>';
    // pulse chart
    while(ptimes.length&&t-ptimes[0]>8)ptimes.shift();
    let c=`<svg viewBox="0 0 400 110" role="img" aria-label="النبضات"><path d="M20 80H390" style="stroke:var(--muted)"/><text class="txt m" x="20" y="100">-8 s</text><text class="txt m" x="390" y="100" text-anchor="end">now</text>`;
    ptimes.forEach(pt=>{const x=390-(t-pt)/8*370;c+=`<rect x="${(x-5).toFixed(1)}" y="30" width="10" height="50" style="fill:var(--live-soft);stroke:var(--live);stroke-width:1.5"/>`});
    $('#pc').innerHTML=c+`<text class="txt" x="20" y="20">pulses: ${ptimes.length}</text></svg>`;
    $('#qP').textContent=pulses;$('#qS').textContent=steps;$('#qA').textContent=steps*st+'°';$('#qR').textContent=B.round(steps*st/360,3);
    $('#qV').textContent=cont?B.round(rate*st*60/360,2)+' rpm':'0 rpm';
    if(!lastTarget||(!queue&&pulses&&!cont)){const m=pulses?`${pulses} نبضة ⇐ ${Math.abs(steps)} خطوة × ${st}° = <b class="ltr">${Math.abs(steps)*st}°</b>${cont?' — تشغيل مستمر':''}.`:'اضغط «نبضة واحدة».';if(!queue)$('#qMsg').innerHTML=(lastTarget&&w.reached?lastTarget+' ':'')+m}
    gs.check();
  });
}

/* figure (١-١) — schematic drawing of the photo */
function photoSVG(hl){const cx=160,cy=150,dim=k=>hl&&hl!==k?' opacity="0.3"':'',hs=k=>hl===k?'stroke:var(--blue);stroke-width:3':'';
  let s=`<svg viewBox="0 0 320 300" role="img" aria-label="رسم توضيحي لقطاع في محرك خطوة"><rect x="20" y="10" width="280" height="280" rx="26" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>`;
  s+=`<g${dim('poles')}>`;for(let j=0;j<8;j++)s+=poleG(cx,cy,1.18,{a:j*45,st:'',w:11},82*1.18,50*1.18).replace(/var\(--wire\)/g,hl==='coils'?'var(--live)':'var(--wire)');s+=`</g>`;
  if(hl==='poles')for(let j=0;j<8;j++){const q=pol(cx,cy,78,j*45);s+=`<text class="txt" x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle" style="fill:var(--blue-ink)">${j+1}</text>`}
  if(hl==='coils')for(let j=0;j<8;j++){const q=pol(cx,cy,78,j*45);s+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="13" style="fill:none;${hs('coils')}"/>`}
  s+=`<g${dim('rotor')}><path d="${teethPath(cx,cy,40,0,44,53,2.6)}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2;${hs('rotor')}"/></g>`;
  s+=`<g${dim('bearing')}><circle cx="${cx}" cy="${cy}" r="22" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4;${hs('bearing')}"/>`;for(let i=0;i<10;i++){const q=pol(cx,cy,16,i*36);s+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.4" style="fill:var(--wire)"/>`}s+=`<circle cx="${cx}" cy="${cy}" r="8" style="fill:var(--fg)"/></g>`;
  s+=`<g${dim('wires')}>`;['#2e9b4f','#2f6fd0','#d23b2f','#3a3a3a'].forEach((c,i)=>{s+=`<path d="M${236+i*9} 250Q${250+i*9} 280 ${262+i*12} 298" style="fill:none;stroke:${c};stroke-width:5;stroke-linecap:round"/>`});if(hl==='wires')s+=`<rect x="226" y="240" width="82" height="58" rx="8" style="fill:none;stroke:var(--blue);stroke-width:2.5"/>`;s+=`</g>`;
  return s+'</svg>'}

/* hybrid torque explorer (lesson 6) — the five terms of equation (١-٢) */
function torqueTerms(dl){return [['\\sin\\angle^{S2}_{N}','S2',18-dl,1,'sin'],['\\sin\\angle^{S1}_{N}','S1',90-dl,1,'sin'],['\\sin\\angle^{S3}_{N}','S3',54+dl,-1,'sin'],['\\cos\\angle^{S5}_{S}','S5',18+dl,1,'cos'],['\\cos\\angle^{S4}_{S}','S4',54-dl,-1,'cos']].map(([tx,tooth,a,sg,fn])=>({tx,tooth,a,sg,fn,v:sg*(fn==='sin'?Math.sin(a*D):Math.cos(a*D))}))}
function torqueExplorer(host){let dl=0;
  host.innerHTML=`<h2>مستكشف عزم المحرك الهجين <small>المعادلة (١-٢) ص 19–21 · الشكل (١-١٢)</small></h2>
   <p class="sub">الدوار في وضع الشكل (١-١٢أ) ثم فُصلت A-A′ وغُذّيت B-B′ (B شمالي يسارًا، B′ جنوبي يمينًا). المقطع المرسوم هو طرف S (الأسنان S1…S5). حرّك الدوار بالمنزلق وشاهد حدود المعادلة.</p>
   <div class="wrap-in">${rangeHTML('dl','دوران الدوار منذ لحظة التبديل δ',0,18,0.5,0,'°')}<div class="reads"><div class="read"><span>العزم المحصل</span><b id="tq"></b></div></div></div>
   <div class="grid" style="margin-top:0"><div class="c6"><div class="svgbox" id="tsv" style="max-width:380px;margin-inline:auto"></div></div><div class="c6"><div class="tablebox" id="ttb"></div><div class="svgbox" id="tcv"></div></div></div>
   <div class="callout"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يحسب العزم عند δ = 0 فقط (0.863 Tm). هنا نطبّق نفس الحدود الخمسة بعد أن يدور الدوار δ درجة؛ تتغير كل زاوية بمقدار δ، فيقل العزم حتى يصير صفرًا عند δ = 18° وهو وضع الاتزان في الشكل (١-١٢ب). السهم الأخضر = عزم ضد عقارب الساعة (+)، والأحمر = مع عقارب الساعة (−).</div>`;
  const $=s=>host.querySelector(s);
  const draw=()=>{const T=torqueTerms(dl),sum=T.reduce((a,b)=>a+b.v,0),M=MOT.hy,cx=190,cy=180,sc=1.55,r=RAD(sc);
    const poles=[0,90,180,270].map((a,i)=>({a,st:i===1?'N':i===3?'S':'',lbl:M.pl[i],w:17}));
    let s=`<svg viewBox="0 0 380 370" role="img" aria-label="أسنان الطرف S وعزم كل سن">`+section({cx,cy,s:sc,th:dl,poles,rotor:{kind:'teeth',n:5,a0:0,tw:10,pol:'S',nums:[0,72,144,216,288].map((a,j)=>[a,'S'+(j+1)])}});
    T.forEach(t=>{const ta=({S1:0,S2:72,S3:144,S4:216,S5:288})[t.tooth]+dl,len=Math.abs(t.v)*34,rr=r.Rt+8,a1=ta,a2=ta+Math.sign(t.v)*len,col=t.v>=0?'var(--on)':'var(--stop)';
      if(len>1){const e=pol(cx,cy,rr,a2),ang=a2+(t.v>0?90:-90);const h1=pol(e[0],e[1],7,ang+150),h2=pol(e[0],e[1],7,ang-150);
        s+=`<path d="M${xy(pol(cx,cy,rr,a1))}A${rr} ${rr} 0 0 ${t.v>0?0:1} ${xy(e)}" style="fill:none;stroke:${col};stroke-width:3"/><path d="M${xy(e)}L${xy(h1)}M${xy(e)}L${xy(h2)}" style="stroke:${col};stroke-width:3;stroke-linecap:round"/>`}});
    $('#tsv').innerHTML=s+'</svg>';
    $('#ttb').innerHTML=`<table class="tt"><thead><tr><th>الحد</th><th>السن</th><th>الزاوية</th><th>القيمة</th></tr></thead><tbody>${T.map(t=>`<tr><td>${t.sg>0?'+':'−'} ${t.fn}</td><td><span class="ltr">${t.tooth}</span></td><td><span class="ltr">${f1(t.a)}°</span></td><td><span class="ltr" style="color:${t.v>=0?'var(--on)':'var(--stop)'}">${t.v>=0?'+':'−'}${fmt3(t.v)}</span></td></tr>`).join('')}<tr style="font-weight:700"><td colspan="3">المجموع</td><td><span class="ltr">${(sum<0?'−':'')+fmt3(sum)} Tm</span></td></tr></tbody></table>`;
    $('#tq').textContent=(sum<0?'-':'')+fmt3(sum)+' Tm';
    let c=`<svg viewBox="0 0 360 150" role="img" aria-label="منحنى العزم مع زاوية الدوار"><path d="M40 120H340M40 120V14" style="stroke:var(--muted)"/>`;let d='';
    for(let x=0;x<=18;x+=0.5){const v=torqueTerms(x).reduce((a,b)=>a+b.v,0);d+=(x?'L':'M')+(40+x/18*300).toFixed(1)+' '+(120-v*110).toFixed(1)}
    c+=`<path d="${d}" style="fill:none;stroke:var(--blue);stroke-width:2.4"/><circle cx="${(40+dl/18*300).toFixed(1)}" cy="${(120-sum*110).toFixed(1)}" r="5" style="fill:var(--live)"/>`;
    c+=`<text class="txt m" x="36" y="${(120-0.863*110+4).toFixed(1)}" text-anchor="end">0.863</text><text class="txt m" x="36" y="124" text-anchor="end">0</text><text class="txt m" x="40" y="140">δ = 0°</text><text class="txt m" x="340" y="140" text-anchor="end">18°</text><text class="txt m" x="48" y="14">T / Tm</text>`;
    $('#tcv').innerHTML=c+'</svg>'};
  $('#dl').addEventListener('input',e=>{dl=+e.target.value;$('#dlV').textContent=dl+' °';draw()});draw();
  return {}}

/* step-angle example builder */
function thetaEx(o){return {title:o.title,ref:o.ref,q:o.q,
  given:[{id:'N',label:o.nl||'عدد مجموعات الثابت (Stacks)',sym:'N',unit:'',value:o.N,step:1,min:1},{id:'P',label:o.pl||'عدد أسنان (أقطاب) الدوار',sym:'P',unit:'',value:o.P,step:1,min:1}],
  solve:(g,B,isBook)=>{const NP=g.N*g.P,th=B.round(360/NP,2);const out=[
    {t:'نطبّق المعادلة (١-١):',f:`\\theta=\\frac{360}{N\\cdot P}=\\frac{360}{${g.N}\\times ${g.P}}=\\frac{360}{${NP}}`},
    {t:o.res||'خطوة المحرك',v:th,unit:'°',dp:dpOf(th),final:!o.half}];
   if(o.half){const h=B.round(360/NP/2,2);out.push({t:o.halfT,f:`\\frac{\\theta}{2}=\\frac{${th}}{2}`,v:h,unit:'°',dp:dpOf(h),final:true})}
   return out},note:o.note}}

/* =====================================================================
   LESSON 1
   ===================================================================== */
B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'7–9',
 title:'محركات الخطوة: تعريفها واستخداماتها وأنواعها',
 summary:'ما المحرك متدرج الحركة، ولماذا يُستخدم حيث نحتاج حركة دورانية بزاوية ثابتة يمكن التحكم في عددها وسرعتها وموضع توقفها بدقة.',
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة',ref:'ص 7',html:`<p><b>الهدف العام:</b> معرفة تركيب وأنواع محركات الخطوة واستخداماتها.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يعرف المتدرب تركيب وأنواع محركات الخطوة.</li><li>أن يعرف المتدرب التطبيقات التي تستخدم فيها محركات الخطوة.</li><li>أن يميز المتدرب بين أنواع محركات الخطوة.</li><li>أن يفهم المتدرب كيفية عمل محركات الخطوة.</li><li>أن يتمكن المتدرب من حساب خطوة المحرك.</li><li>أن يتمكن المتدرب من كتابة الجداول المنطقية لدوران محركات الخطوة في الاتجاه المطلوب.</li></ol>`},
  {h:'محركات الخطوة (Stepping Motors)',ref:'ص 8',html:`<p>«تسمى أيضًا <b>المحركات متدرجة الحركة</b>، وقد عرفت منذ زمن بعيد، إلا أن إنتاجها تجاريًا بدأ في <b>الستينيات الميلادية</b>، بعد التقدم العلمي الذي أحرز في مجال إلكترونيات القدرة، وفي إمكانية توصيل وفصل تيار مستمر ذي قيمة عالية في ملفات المحركات.» وبدأ التفكير في استخدامها «عندما بدأ الطلب على جهاز يمكن أن يعطي حركة دورانية في صورة <b>انحراف زاوي ثابت</b>».</p>
   <p>«ومن أهم مميزات هذا النوع من المحركات أنه <b>يمكن التحكم في عدد دوراته وسرعة دورانه وزاوية التوقف بدقة</b>.» ويمكن ربطه مع الحاسب الآلي أو المعالجات الصغيرة.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المحرك العادي يدور ما دام موصولًا بالمصدر. أما محرك الخطوة فكل «نبضة» تيار تُدخلها على ملفاته تجعله يدور <b>زاوية ثابتة واحدة</b> (خطوة) ثم يقف ممسكًا بمكانه. فإذا عددت النبضات عرفت الزاوية، وإذا أسرعت بها أسرع المحرك. جرّب ذلك في تبويب «المختبر».'},
  {h:'استخدامات محركات الخطوة',ref:'ص 8',html:`<ul><li><b>آلات القطع:</b> مع صندوق للتروس لتثبيت آلة القطع والقطعة المراد تشكيلها خلال فترة التشغيل.</li>
   <li><b>طابعات الحاسب الآلي:</b> دوران المحرك بزاوية محددة لتحريك ورق الطباعة مسافة محددة حسب الفواصل بين الأسطر، ثم ثباته بعد ذلك حتى الانتهاء من طباعة السطر.</li>
   <li><b>مشغل الأقراص</b> المرنة أو المدمجة في أجهزة الحاسب الآلي.</li>
   <li><b>التطبيقات الروبوتية</b> (لإمكانية التحكم في إيقافه عند زاوية محددة).</li>
   <li>تطبيقات أخرى في <b>الصناعة والأجهزة الطبية والعدادات الرقمية</b>.</li></ul>`},
  {h:'أنواع محركات الخطوة',ref:'ص 8',html:`<p>«هناك أنواع كثيرة من محركات الخطوة، ولكن يمكن تقسيمها إلى نوعين رئيسيين»، ثم يعرض الكتاب:</p>
   <ol><li><b>محركات الخطوة ذات الممانعة المغناطيسية المتغيرة</b> (ص 8) — الدرسان 1.2 و 1.3.</li><li><b>محركات الخطوة ذات الأقطاب المغناطيسية الدائمة</b> (ص 15) — الدرس 1.4.</li><li><b>محركات الخطوة ذات الأقطاب المغناطيسية الدائمة على طول المحور الدوار (المحرك الهجين)</b> (ص 18) — الدرسان 1.5 و 1.6.</li></ol>`},
  {err:'يقول الكتاب (ص 8) «يمكن تقسيمها إلى <b>نوعين</b> رئيسيين» ثم يعرض <b>ثلاثة</b> بنود مرقمة (١، ٢، ٣). يُفهم من النص (ص 18) أن الهجين «شكل آخر من أشكال محركات الخطوة ذات الأقطاب المغناطيسية الدائمة»، فيكون النوعان الرئيسيان: الممانعة المتغيرة، والأقطاب الدائمة (ومنها الهجين).'},
  {h:'قطاع في محرك خطوة حقيقي',ref:'ص 9',html:'<p>الشكل (١-١) صورة فوتوغرافية لمحرك خطوة ذي ممانعة متغيرة مفتوح، «يحتوي على ثمانية أقطاب على عضوه الثابت». يظهر فيه الهيكل المربع، والأقطاب الثمانية وعليها ملفات نحاسية، والدوار المسنن بأسنان كثيرة دقيقة حول محمل كروي في المركز، وأربعة أسلاك خارجة.</p>'},
  {widget:(el)=>{let hl='';const P=[['poles','الأقطاب الثمانية'],['coils','الملفات'],['rotor','الدوار المسنن'],['bearing','المحمل الكروي'],['wires','الأسلاك الخارجة']];
    const TX={poles:'ثمانية أقطاب بارزة على العضو الثابت (مرقمة 1–8 في الرسم).',coils:'على كل قطب ملف نحاسي؛ تغذية الملفات بالتتابع هي التي تُدير المحرك.',rotor:'الدوار مصنوع من الحديد وعلى محيطه أسنان كثيرة دقيقة.',bearing:'محمل كروي في المركز يحمل عمود الدوار.',wires:'أربعة أسلاك خارجة لتغذية مجموعات الملفات.'};
    const draw=()=>{el.innerHTML=`<figure class="fig"><div class="seg" role="group" style="flex-wrap:wrap">${P.map(([k,l])=>`<button data-p="${k}" aria-pressed="${hl===k}">${l}</button>`).join('')}</div>${box(photoSVG(hl),340)}<p class="sub" style="text-align:center">${hl?TX[hl]:'اضغط على أي جزء لإبرازه.'}</p><figcaption><b>الشكل (١-١)</b> قطاع في محرك خطوة ذي الممانعة المتغيرة — <b>رسم توضيحي مبسّط للصورة (ليس الصورة الأصلية)</b> <span class="ref">ص 9</span></figcaption></figure>`;
     el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{hl=hl===b.dataset.p?'':b.dataset.p;draw()})};draw()}}
 ],
 lab:(el)=>printerLab(el),
 quiz:[
  {q:'ما الاسم الآخر لمحركات الخطوة في الكتاب؟',o:['المحركات التزامنية','المحركات متدرجة الحركة','المحركات العامة','المحركات التنافرية'],c:1,e:'«تسمى أيضًا المحركات متدرجة الحركة» (ص 8).'},
  {q:'متى بدأ إنتاج محركات الخطوة تجاريًا؟',o:['في الثلاثينيات','في الخمسينيات','في الستينيات الميلادية','في التسعينيات'],c:2,e:'بدأ إنتاجها تجاريًا في الستينيات بعد التقدم في إلكترونيات القدرة (ص 8).'},
  {q:'ما أهم ميزة لمحرك الخطوة كما يذكر الكتاب؟',o:['قدرته الكبيرة جدًا','التحكم بدقة في عدد دوراته وسرعته وزاوية توقفه','أنه لا يحتاج تيارًا','أنه يعمل بالتيار المتردد فقط'],c:1,e:'«يمكن التحكم في عدد دوراته وسرعة دورانه وزاوية التوقف بدقة» (ص 8).'},
  {q:'في الطابعة، ماذا يفعل محرك الخطوة؟',o:['يدور باستمرار أثناء الطباعة','يدور بزاوية محددة لتحريك الورق سطرًا ثم يثبت حتى ينتهي السطر','يحرك رأس الطباعة فقط','يسخّن الورق'],c:1,e:'كما في استخدامات الكتاب ص 8.'},
  {q:'لماذا يُستخدم محرك الخطوة في التطبيقات الروبوتية؟',o:['لأنه رخيص','لإمكانية التحكم في إيقافه عند زاوية محددة','لأنه لا يسخن','لأن سرعته ثابتة لا تتغير'],c:1,e:'(ص 8).'},
  {q:'محرك خطوته 15°. كم نبضة يحتاج ليدور 90°؟',o:['4','6','15','90'],c:1,e:'كل نبضة خطوة واحدة: 90 ÷ 15 = 6 نبضات (توضيح من المختبر).'},
  {q:'كم قطبًا على العضو الثابت للمحرك المصور في الشكل (١-١)؟',o:['أربعة','ستة','ثمانية','اثنا عشر'],c:2,e:'«يحتوي على ثمانية أقطاب على عضوه الثابت» (ص 9).'}
 ]
});

/* =====================================================================
   LESSON 2 — VR multi-stack, full step
   ===================================================================== */
B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'8–12',
 title:'محرك الخطوة ذو الممانعة المتغيرة: التركيب والخطوة الكاملة',
 summary:'ثابت مجزأ إلى ثلاث مجموعات (A وB وC) مزاحة 15° عن بعضها ودوار مسنن من الحديد. تغذية المجموعات بالترتيب A, B, C تدير المحرك ضد عقارب الساعة، وبالترتيب A, C, B مع عقارب الساعة.',
 theory:[
  {h:'١. محركات الخطوة ذات الممانعة المغناطيسية المتغيرة',ref:'ص 8–9',html:`<p>«العضو الثابت لمحرك الخطوة ذي الممانعة المتغيرة، مجزأ على طول محوره إلى عدة مجموعات من الأقطاب (<b>Stacks</b>)، المستقلة مغناطيسيًا عن بعضها، كل مجموعة من الأقطاب، يمكن إثارتها مغناطيسيًا بواسطة ملفات مستقلة (<b>Phases</b>)، العضو الدوار يتركب من <b>أسنان بارزة</b>، كل من العضو الثابت والدوار يصنع من <b>شرائح الحديد</b>، لإمكانية التغيير السريع للمجال المغناطيسي دون أن يكون مصحوبًا بمفاقيد التيارات الدوامية (eddy current losses).»</p>
   <p>«كل مجموعة (Stack) من مجموعات العضو الثابت، ملفوفة بملفات كي تعطي مجالًا مغناطيسيًا في اتجاه قطر المحرك، وبحيث تكون <b>الأقطاب المتجاورة مختلفة في قطبيتها</b> عن بعضها.»</p>`},
  {h:'تركيب المحرك في الشكل (١-٢)',ref:'ص 9–10',html:`<p>«المحرك المبين يحتوي على <b>عضو دوار ذي ثمانية أسنان</b>، و<b>عضو ثابت ذي ثلاث مجموعات من ثمانية أقطاب</b> على طول العضو الدوار، (وقد أمكن إنتاج محركات يحتوي عضوها الثابت على أكثر من ثلاث وحتى <b>سبع مجموعات</b> من الأقطاب، كل مجموعة بها عدد من الأقطاب مساوٍ لعدد أسنان الدوار). كل مجموعة مستقلة تمامًا بدوائرها المغناطيسية عن المجموعات الأخرى.»</p>`},
  {fig:'(١-٢)',ref:'ص 10',caption:'تركيب محرك الخطوة ذي الممانعة المتغيرة: Phase a مغذّاة (الأقطاب N وS بالتناوب) وأسنان الدوار منطبقة على أقطابها، وPhase b وPhase c مزاحتان فلا تنطبق الأسنان عليهما.',draw:()=>box(motorSVG(MOT.vr3,[1,0,0],0),660)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> تخيّل المجموعات الثلاث «شرائح» مركّبة خلف بعضها على نفس العمود، والدوار الطويل يمر داخلها كلها. الرسم يعرض الشرائح جنبًا إلى جنب لتراها معًا، والدوار نفسه (بنفس الزاوية) في الثلاث.'},
  {h:'كيفية عمل المحرك',ref:'ص 10–11',html:`<p>«عند تغذية ملفات المجموعة "A" بتيار مستمر، فإن أسنان الدوار تتجه وتثبت بحيث تكون محاورها منطبقة مع محاور أقطاب المجموعة "A" للعضو الثابت، حيث إن المجموعة "B" تشبه المجموعة "A" من جميع الوجوه، ما عدا أنها <b>مختلفة معها في الزاوية بمقدار خمس عشرة درجة ضد اتجاه عقارب الساعة</b>.»</p>
   <p>«فإذا فصلت ملفات المجموعة "A" وغذيت ملفات المجموعة "B" بتيار مستمر، فإن المحرك سيولد عزم دوران يدفع الدوار <b>خمس عشرة درجة في عكس اتجاه عقارب الساعة</b>، ويثبت بحيث تكون محاور الدوار منطبقة مع محاور المجموعة "B".»</p>
   <p>«المجموعة "C" أيضًا لها أقطاب مختلفة في الزاوية بمقدار خمس عشرة درجة ضد اتجاه عقارب الساعة، بالنسبة للمجموعة "B"، وعند فصل ملفات المجموعة "B" وتغذية ملفات المجموعة "C"، فإن المحرك سيولد عزم دوران يدفع الدوار خمس عشرة درجة أخرى في عكس اتجاه عقارب الساعة، ثم تكرر العملية بتغذية ملفات المجموعة "A" من جديد وهكذا.»</p>`},
  {widget:(el)=>{let k=0;const ths=[0,15,30,45];const draw=()=>{const ph=[0,0,0];ph[k%3]=1;el.innerHTML=`<figure class="fig"><div class="seg" role="group">${['A','B','C','A مرة أخرى'].map((l,i)=>`<button data-k="${i}" aria-pressed="${i===k}">${i+1}) ${l}</button>`).join('')}</div>${box(motorSVG(MOT.vr3,ph,ths[k],{noflux:1}),660)}<p class="sub" style="text-align:center">المجموعة ${'ABCA'[k]} مغذّاة ⇐ الدوار عند <b class="ltr">${ths[k]}°</b> ضد عقارب الساعة من وضع البداية.</p><figcaption>توضيح تفاعلي لنص ص 10–11: اضغط الأزرار بالترتيب.</figcaption></figure>`;el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()})};draw()}},
  {h:'اتجاه الدوران',ref:'ص 11',html:`<p>«إعادة تكرار هذا الترتيب <b class="ltr">A, B, C, A, B…</b> (من اليسار إلى اليمين)، يعطي خطوات دورانية كل منها خمس عشرة درجة <b>ضد اتجاه عقارب الساعة</b>، عكس هذا الترتيب <b class="ltr">A, C, B, A,…</b> يتسبب في خطوة المحرك <b>مع عقارب الساعة</b> وذلك لانجذاب الأسنان البارزة للقطب الأقرب وهو في اتجاه دوران عقارب الساعة.»</p>
   <p>«لإمكانية أن يخطو المحرك في كل من اتجاهي الدوران، <b>لا بد أن يحتوي العضو الثابت للمحركات من هذا النوع على ثلاث مجموعات "Stacks" على الأقل</b>.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا ثلاث على الأقل؟ لو كانت هناك مجموعتان فقط مزاحتان نصف المسافة بين سنّين، فعند الانتقال من A إلى B يكون أقرب قطب على نفس البعد من الجهتين، فلا يعرف الدوار إلى أي اتجاه يدور. مع ثلاث مجموعات يكون القطب الأقرب دائمًا في جهة واحدة.'},
  {h:'الجداول المنطقية للخطوة الكاملة',ref:'ص 11',html:'<p>«الجداول التالية توضح التسلسل المنطقي لتتابع تغذية ملفات مجموعات العضو الثابت ليخطو المحرك خطوة كاملة.» (1 = المجموعة مغذّاة، 0 = غير مغذّاة؛ عمود «الخطوة» مضاف للترتيب.)</p>'},
  {fig:'',ref:'ص 11',caption:'<b>الجدول (١-١)</b> التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك خطوات كاملة ضد عقارب الساعة',draw:()=>tblFig(SEQ.t11,['A','B','C'])},
  {fig:'',ref:'ص 11',caption:'<b>الجدول (١-٢)</b> التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك خطوات كاملة مع عقارب الساعة',draw:()=>tblFig(SEQ.t12,['A','B','C'])},
  {h:'موجات الجهد',ref:'ص 11–12',html:'<p>«موجات الجهد الموصل مع مجموعات الثابت مبينة في الشكل (١-٣) في حالة دوران المحرك ضد عقارب الساعة وفي الشكل (١-٤) في حالة دوران المحرك مع عقارب الساعة.» كل نبضة مستطيلة موجبة عرضها فترة خطوة واحدة، ومجموعة واحدة فقط مغذّاة في كل لحظة.</p>'},
  {fig:'(١-٣)',ref:'ص 11',caption:'موجات الجهد الموصل مع مجموعات الثابت في حالة دوران المحرك ضد عقارب الساعة',draw:()=>waveFig(SEQ.t11,['A','B','C'],9,0)},
  {fig:'(١-٤)',ref:'ص 12',caption:'موجات الجهد الموصل مع مجموعات الثابت في حالة دوران المحرك مع عقارب الساعة',draw:()=>waveFig(SEQ.t12,['A','B','C'],10,0)}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر محرك الممانعة المتغيرة بثلاث مجموعات',ref:'مبني على الشكل (١-٢) ص 10 والجدولين (١-١) و(١-٢) ص 11',motors:['vr3'],seqs:()=>[SEQ.t11,SEQ.t12],
  tries:['شغّل الجدول (١-١) تلقائيًا ثم بدّل إلى (١-٢): ينعكس الاتجاه فقط بتغيير ترتيب التغذية.','كم خطوة يحتاج الدوار لدورة كاملة؟ عدّ حتى تعود النقطة البرتقالية للأعلى (24 خطوة).','في الوضع اليدوي غذِّ A ثم C مباشرة: إلى أين يدور؟ ولماذا؟','قارن الموجات المرسومة بالشكلين (١-٣) و(١-٤) في الشرح.'],
  steps:[
   {t:'الوضع الابتدائي',x:'المجموعة A مغذّاة (Phase a مضاءة) وأسنان الدوار منطبقة على أقطابها. لاحظ أن أقطاب b وc مزاحة 15° و30°.'},
   {t:'الخطوة الأولى',x:'اضغط «خطوة واحدة»: تُفصل A وتُغذّى B، فيدور الدوار 15° ضد عقارب الساعة حتى تنطبق أسنانه على أقطاب B.',done:w=>(w.bySeq.t11||0)>=1},
   {t:'أكمل الدورة',x:'اضغط «خطوة» مرتين أخريين (C ثم A). بعد 3 خطوات دار الدوار 45° = سنّ كامل، وعادت التغذية إلى A.',done:w=>(w.bySeq.t11||0)>=3},
   {t:'الموجات',x:'انظر لوحة الموجات: نبضة واحدة على V_A ثم V_B ثم V_C… مثل الشكل (١-٣).'},
   {t:'اعكس الاتجاه',x:'اختر التسلسل «(١-٢) كاملة ⟳» ثم اضغط «خطوة» مرتين: A ثم C ثم B، فيدور الدوار مع عقارب الساعة.',done:w=>w.seq==='t12'&&(w.bySeq.t12||0)>=2},
   {t:'التشغيل المستمر',x:'شغّل «تلقائي» وغيّر عدد الخطوات في الثانية: السرعة (rpm) = الخطوات/ث × 15 ÷ 6.',done:w=>w.auto&&w.rate!==2},
   {t:'تحكم يدوي',x:'اختر «يدوي» وغذِّ المجموعات بنفسك: افصل A وغذِّ B ثم افصل B وغذِّ C.',done:w=>w.mode==='man'&&w.changes>=3},
   {t:'مجموعتان معًا',x:'في اليدوي غذِّ A و B معًا: يقف الدوار في المنتصف (7.5°). هذه فكرة «نصف الخطوة» في الدرس التالي.',done:w=>w.mode==='man'&&w.on>=2}
  ],
  extra:(host,w)=>{fillTable(host,{title:'تحدٍّ: اكتب جدول الدوران مع عقارب الساعة',ref:'قارن بالجدول (١-٢) ص 11',labels:['A','B','C'],rows:SEQ.t12.rows,hint:'الصف الأول (A مغذّاة) مكتوب. اضغط على الخانات لتكتب 1 أو 0، ثم «تحقّق». تذكير: عكس الترتيب A, B, C هو A, C, B.',ok:'هذا هو الجدول (١-٢).'});return {}}}),
 quiz:[
  {q:'في محرك الممانعة المتغيرة، الدوار يتركب من:',o:['مغناطيس دائم أسطواني','أسنان بارزة من شرائح الحديد','ملفات متغيرة','فرش وعضو توحيد'],c:1,e:'«العضو الدوار يتركب من أسنان بارزة… ويصنع من شرائح الحديد» (ص 8).'},
  {q:'لماذا يُصنع الثابت والدوار من شرائح الحديد؟',o:['لزيادة الوزن','لإمكانية التغيير السريع للمجال دون مفاقيد التيارات الدوامية','لتقليل السعر فقط','لعزل الملفات'],c:1,e:'(ص 8).'},
  {q:'الأقطاب المتجاورة في كل مجموعة من مجموعات الثابت:',o:['لها نفس القطبية','مختلفة في قطبيتها','بلا قطبية','كلها شمالية'],c:1,e:'«بحيث تكون الأقطاب المتجاورة مختلفة في قطبيتها» (ص 9).'},
  {q:'في محرك الشكل (١-٢)، بكم تختلف المجموعة B عن A في الزاوية؟',o:['7.5°','15° ضد عقارب الساعة','30° مع عقارب الساعة','45°'],c:1,e:'«مختلفة معها في الزاوية بمقدار خمس عشرة درجة ضد اتجاه عقارب الساعة» (ص 10).'},
  {q:'ما ترتيب التغذية الذي يدير المحرك مع عقارب الساعة؟',o:['A, B, C, A','A, C, B, A','A, A, B, B','B, A, B, A'],c:1,e:'«عكس هذا الترتيب A, C, B, A… يتسبب في خطوة المحرك مع عقارب الساعة» (ص 11)، كالجدول (١-٢).'},
  {q:'أقل عدد من المجموعات ليخطو هذا النوع في الاتجاهين:',o:['مجموعة واحدة','مجموعتان','ثلاث مجموعات','سبع مجموعات'],c:2,e:'«لا بد أن يحتوي العضو الثابت… على ثلاث مجموعات على الأقل» (ص 11).'},
  {q:'في الشكل (١-٣)، كم مجموعة يكون عليها جهد في كل لحظة؟',o:['ولا واحدة','واحدة فقط','اثنتان','الثلاث معًا'],c:1,e:'في الخطوة الكاملة (الجدول ١-١) مجموعة واحدة فقط = 1 في كل صف.'},
  {q:'كم عدد أقطاب كل مجموعة في محرك الشكل (١-٢)؟',o:['اثنان','أربعة','ثمانية','ثلاثة'],c:2,e:'ثلاث مجموعات من ثمانية أقطاب، وعدد أقطاب كل مجموعة يساوي عدد أسنان الدوار (ص 9).'}
 ]
});

/* =====================================================================
   LESSON 3 — half step, single-plane design, step-angle formula
   ===================================================================== */
B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'12–15',
 title:'نصف الخطوة، والتصميم ذو المستوى الواحد، وحساب خطوة المحرك',
 summary:'تغذية مجموعتين معًا بين الخطوات تجعل المحرك يخطو نصف خطوة. تصميم آخر يضع المجموعات الثلاث في مستوى واحد مع دوار بأربعة أسنان (خطوة 30°)، وتُحسب الخطوة من θ = 360 / (N·P).',
 theory:[
  {h:'نصف الخطوة',ref:'ص 12',html:'<p>«يمكن للمحرك أن يخطو بنصف خطوة إذا اتبعنا التسلسل المنطقي التالي:» — بين كل مجموعة والتي تليها تُغذّى المجموعتان معًا.</p>'},
  {fig:'',ref:'ص 12',caption:'<b>الجدول (١-٣)</b> التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك بنصف خطوة ضد عقارب الساعة',draw:()=>tblFig(SEQ.t13,['A','B','C'])},
  {fig:'',ref:'ص 12',caption:'<b>الجدول (١-٤)</b> التسلسل المنطقي لتتابع تغذية الأوجه بحيث يخطو المحرك بنصف خطوة مع عقارب الساعة',draw:()=>tblFig(SEQ.t14,['A','B','C'])},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عند تغذية A و B معًا تشد أقطاب A الأسنان نحوها وأقطاب B نحوها، فيقف الدوار في المنتصف. في محرك الشكل (١-٢) تكون نصف الخطوة <span class="ltr">15° ÷ 2 = 7.5°</span> (الكتاب لم يكتب هذا الرقم صراحة).'},
  {h:'موجات الجهد في نصف الخطوة',ref:'ص 13',html:'<p>«موجات الجهد الموصل مع مجموعات الثابت في حالة دوران المحرك بنصف خطوة مع عقارب الساعة مبينة بالشكل (١-٦)». كل نبضة تمتد ثلاث فترات نصف خطوة وتتداخل مع جارتها فترة واحدة.</p>'},
  {fig:'(١-٥)',ref:'ص 13',caption:'موجات الجهد في حالة دوران المحرك بنصف خطوة ضد عقارب الساعة',draw:()=>waveFig(SEQ.t13,['A','B','C'],12,0)},
  {fig:'(١-٦)',ref:'ص 13',caption:'موجات الجهد في حالة دوران المحرك بنصف خطوة <b>مع</b> عقارب الساعة (مصحّح؛ انظر الملاحظة)',draw:()=>waveFig(SEQ.t14,['A','B','C'],12,0)},
  {err:'تعليق الشكل (١-٦) في الكتاب (ص 13) مكتوب «موجات الجهد في حالة دوران المحرك بنصف خطوة <b>ضد</b> عقارب الساعة»، والصحيح «<b>مع</b> عقارب الساعة»: النص الذي قبله يقول «مع»، ومحتوى الموجات A ثم AC ثم C ثم CB ثم B ثم BA يطابق الجدول (١-٤). كتبنا التعليق المصحح أعلاه.'},
  {h:'تصميم آخر: المجموعات الثلاث في مستوى واحد',ref:'ص 14',html:`<p>«الشكل (١-٧) يوضح تصميمًا آخر من محركات الخطوة ذات الممانعة المتغيرة، المحرك المبين يتكون من <b>ثلاث مجموعات</b> على العضو الثابت، <b>كل مجموعة تتكون من قطبين</b>، ولكن المجموعات الثلاث وضعت في <b>نفس المستوى</b> بحيث يكون كل قطبين متقابلين مجموعة واحدة، (بدلًا من تجزئة العضو الثابت إلى عدة أجزاء، كل جزء يختص بمجموعة أقطاب)، ملفات قطبي المجموعة الواحدة موصلة على التوالي، بحيث يكتسب أحد القطبين مغناطيسية تجعل منه قطبًا مغناطيسيًا شماليًا والآخر قطبًا جنوبيًا، العضو الدوار يحتوي على <b>أربعة أسنان</b>.»</p>
   <p>«الشكل (١-٧أ) يوضح وضع الدوار أثناء تغذية المجموعة A فقط، والشكل (١-٧ب) يوضح وضع الدوار أثناء تغذية المجموعة B فقط، وبمقارنة وضعي الدوار السابقين، يتبين أن الدوار دار خطوة كاملة ضد عقارب الساعة. بمقارنة وضع الدوار أثناء تغذية المجموعة C المبين بالشكل (١-٧ج) مع وضعه أثناء تغذية المجموعة B، يتضح أن الدوار دار خطوة أخرى ضد عقارب الساعة.»</p>`},
  {fig:'(١-٧)',ref:'ص 14',caption:'تصميم آخر لمحركات الخطوة ذات الممانعة المتغيرة: (أ) المجموعة A مغذّاة، (ب) B مغذّاة والدوار دار 30°، (ج) C مغذّاة والدوار دار 30° أخرى',draw:()=>row3([[motorSVG(MOT.vr7,[1,0,0],0,{s:1.15}),'(أ) A مغذّاة'],[motorSVG(MOT.vr7,[0,1,0],30,{s:1.15,marks:[[60,0,30,'30°']]}),'(ب) B مغذّاة: 30° ضد عقارب الساعة'],[motorSVG(MOT.vr7,[0,0,1],60,{s:1.15,marks:[[60,30,60,'30°']]}),'(ج) C مغذّاة: 30° أخرى']])},
  {html:'<p>«التسلسل المنطقي لتغذية المجموعات لتشغيل المحرك بخطوة كاملة في كل من اتجاهي الحركة، هو نفس التسلسل الموضح بالجداول السابقة. <b>على المتدرب استنتاج الجداول المنطقية لحركة المحرك بنصف خطوة ومقارنتها بالجداول ١-٣ و ١-٤</b>.» (التمرين موجود في تبويب «المختبر».)</p>'},
  {err:'يقول الكتاب (ص 14) «نفس التسلسل الموضح بالجداول السابقة <b>١-٢ و ٢-٢</b>» والصحيح الجدولان (١-١) و(١-٢). وكُتب «الشكل (١- أ٧)» بدل (١-٧أ).'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في الرسم وضعنا المجموعة B على بعد 60° <b>مع</b> عقارب الساعة من A، لأن هذا الوضع هو الذي يجعل الدوار يتحرك 30° <b>ضد</b> عقارب الساعة كما يقول الكتاب: السن الأقرب لقطب B يقع على بعد 30° منه في الجهة الأخرى.'},
  {h:'حساب خطوة المحرك',ref:'ص 15',html:`<p>«إذا افترضنا أن عدد المجموعات "Stacks" هو <b>N</b> وعدد أسنان أقطاب الدوار هو <b>P</b> فإن خطوة المحرك <b>θ</b> يمكن حسابها من العلاقة الآتية:»</p>
   $$\\theta=\\frac{360}{N\\cdot P}\\qquad (١-١)$$
   <p>حيث θ خطوة المحرك بالدرجات. «عند تطبيق المعادلة ١-١ على المحرك المبين في الشكل (١-٢)، ينتج أن خطوته <b>15 درجة</b>، وعند تطبيقها على المحرك المبين في الشكل (١-٧)، ينتج أن خطوته <b>30 درجة</b>.» افتح تبويب «الأمثلة المحلولة» لتجرّب أرقامًا أخرى.</p>`}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر نصف الخطوة والتصميم ذي المستوى الواحد',ref:'مبني على الشكلين (١-٧) ص 14 و(١-٢) ص 10 والجداول (١-١)…(١-٤)',motors:['vr7','vr3'],seqs:()=>[SEQ.t13,SEQ.t14,SEQ.t11,SEQ.t12],
  tries:['في الشكل (١-٧) شغّل (١-٣): يتناوب الدوار بين 15° (مجموعتان) و30° (مجموعة واحدة).','بدّل المحرك إلى الشكل (١-٢) مع نفس الجدول: نصف الخطوة الآن 7.5°.','في اليدوي غذِّ B ثم أضف C: لاحظ اتجاه الفيض في القطبين المغذيين.','أكمل تمرين الكتاب أسفل الصفحة ثم شغّل الجدول نفسه لتتأكد.'],
  steps:[
   {t:'خطوة كاملة أولًا',x:'اختر «(١-١) كاملة ⟲» واضغط «خطوة» مرتين: A ثم B ثم C، وكل خطوة 30° كما في الشكل (١-٧).',done:w=>(w.bySeq.t11||0)>=2},
   {t:'نصف الخطوة',x:'اختر «(١-٣) نصف ⟲» واضغط «خطوة»: تُغذّى A و B معًا فيقف الدوار في المنتصف: 15°.',done:w=>(w.bySeq.t13||0)>=1},
   {t:'تابع الجدول (١-٣)',x:'اضغط «خطوة» حتى الخطوة 6. لاحظ الصف المظلل والموجات: كل نبضة تمتد ثلاث فترات.',done:w=>(w.bySeq.t13||0)>=6},
   {t:'الاتجاه المعاكس',x:'اختر «(١-٤) نصف ⟳» وشغّل تلقائيًا: A, AC, C, CB, B, BA… مع عقارب الساعة.',done:w=>w.seq==='t14'&&(w.bySeq.t14||0)>=3},
   {t:'المحرك متعدد المجموعات',x:'بدّل إلى «الشكل (١-٢)» وشغّل (١-٣): نفس الجدول، لكن نصف الخطوة 7.5°.',done:w=>w.mk==='vr3'&&(w.bySeq.t13||0)>=1},
   {t:'قطبية القطبين',x:'اختر «يدوي» وغذِّ مجموعة واحدة: أحد قطبيها شمالي N والمقابل جنوبي S، والفيض يمر من قطب إلى الآخر عبر الدوار.',done:w=>w.mode==='man'&&w.changes>=1}
  ],
  extra:(host)=>{fillTable(host,{title:'تمرين الكتاب: استنتج جدول نصف الخطوة لمحرك الشكل (١-٧) ضد عقارب الساعة',ref:'ص 14 — ثم قارنه بالجدول (١-٣)',labels:['A','B','C'],rows:SEQ.t13.rows,hint:'المحرك يدور 30° لكل مجموعة. لكي يقف في المنتصف (15°) بين A و B، ماذا تغذّي؟ اكتب الصفوف السبعة ثم «تحقّق».',ok:'هو نفس الجدول (١-٣): الجدول لا يتغير بتغير تصميم المحرك، لكن زاوية نصف الخطوة هنا 15° بدل 7.5°.'});return {}}}),
 examples:[
  thetaEx({title:'خطوة محرك الشكل (١-٢)',ref:'ص 15',q:'<p>«عند تطبيق المعادلة ١-١ على المحرك المبين في الشكل (١-٢)، ينتج أن خطوته 15 درجة». المحرك: ثلاث مجموعات (N = 3) ودوار بثمانية أسنان (P = 8).</p>',N:3,P:8,half:1,halfT:'نصف الخطوة (توضيح: ليس مطبوعًا في الكتاب)'}),
  thetaEx({title:'خطوة محرك الشكل (١-٧)',ref:'ص 15',q:'<p>«…وعند تطبيقها على المحرك المبين في الشكل (١-٧)، ينتج أن خطوته 30 درجة». ثلاث مجموعات (N = 3) ودوار بأربعة أسنان (P = 4).</p>',N:3,P:4,half:1,halfT:'نصف الخطوة (توضيح: ليس مطبوعًا في الكتاب)',note:'<b>توضيح:</b> غيّر N أو P: كلما زاد عدد المجموعات أو الأسنان صغرت الخطوة وزادت دقة المحرك.'})
 ],
 quiz:[
  {q:'كيف يخطو المحرك نصف خطوة؟',o:['بعكس قطبية المصدر','بتغذية مجموعتين متجاورتين معًا بين كل مجموعة والتي تليها','بفصل كل المجموعات','بزيادة الجهد'],c:1,e:'الجدول (١-٣): A ثم AB ثم B ثم BC… (ص 12).'},
  {q:'نصف الخطوة لمحرك الشكل (١-٢) (خطوته 15°) تساوي:',o:['30°','15°','7.5°','5°'],c:2,e:'15 ÷ 2 = 7.5° (توضيح محسوب، ليس مطبوعًا في الكتاب).'},
  {q:'في الجدول (١-٣)، ما الصف الثاني؟',o:['A=1 B=0 C=0','A=1 B=1 C=0','A=0 B=1 C=0','A=1 B=0 C=1'],c:1,e:'A و B معًا.'},
  {q:'في محرك الشكل (١-٧)، كم قطبًا على الثابت وكم سنًا على الدوار؟',o:['8 أقطاب و 8 أسنان','6 أقطاب و 4 أسنان','4 أقطاب و 6 أسنان','6 أقطاب و 6 أسنان'],c:1,e:'ثلاث مجموعات كل منها قطبان = 6، والدوار أربعة أسنان (ص 14).'},
  {q:'في التصميم ذي المستوى الواحد، ملفات قطبي المجموعة الواحدة موصلة:',o:['على التوازي ليكونا شماليين','على التوالي ليصير أحدهما شماليًا والآخر جنوبيًا','بدون توصيل','بالتناوب مع المجموعات الأخرى'],c:1,e:'(ص 14).'},
  {q:'احسب خطوة محرك فيه N = 3 و P = 4.',o:['12°','30°','45°','120°'],c:1,e:'360 ÷ (3 × 4) = 30°، وهو محرك الشكل (١-٧).'},
  {q:'ما الخطأ في تعليق الشكل (١-٦)؟',o:['لا يوجد خطأ','كُتب «ضد» عقارب الساعة والصحيح «مع»','كُتب «نصف خطوة» والصحيح «خطوة كاملة»','رقم الشكل خطأ'],c:1,e:'المحتوى يطابق الجدول (١-٤) (مع عقارب الساعة).'},
  {q:'في المعادلة (١-١)، الرمز P يعني:',o:['القدرة','عدد المجموعات','عدد أسنان (أقطاب) الدوار','عدد الخطوات في الثانية'],c:2,e:'N عدد المجموعات و P عدد أسنان أقطاب الدوار (ص 15).'}
 ]
});

/* =====================================================================
   LESSON 4 — permanent-magnet stepper
   ===================================================================== */
B.lesson({
 id:'u1-l4',unit:1,order:4,pages:'15–17',
 title:'محرك الخطوة ذو الأقطاب المغناطيسية الدائمة',
 summary:'دوار من مغناطيس دائم يزيد العزم. تكفي مجموعتان على الثابت لأن عكس قطبية التغذية يعطي خطوة جديدة: التسلسل A, B, −A, −B يدير المحرك 45° لكل خطوة، ونصف الخطوة 22.5°.',
 theory:[
  {h:'٢. محركات الخطوة ذات الأقطاب المغناطيسية الدائمة',ref:'ص 15',html:`<p>«يمكن زيادة العزم المتولد من محرك الخطوة باستخدام <b>مغناطيسات دائمة قوية على العضو الدوار</b>، لتزويد المحرك بوسيلة دائمة على الدوار لتأسيس مجال مغناطيسي قوي ذي قيمة ثابتة.»</p>
   <p>«الشكل (١-٨) يوضح محركًا من هذا النوع ذا <b>مجموعتين من أربعة أقطاب</b> على عضوه الثابت تثار مغناطيسيًا بواسطة مجموعتين من الملفات كل منها مستقلة عن الأخرى، العضو الدوار يتكون من <b>أربعة أقطاب مغناطيسية دائمة</b> على شكل أسطوانة دائرية. لحساب خطوة المحرك تستخدم نفس العلاقة المعطاة بالمعادلة (١-١) (يكون الناتج <b>45 درجة</b>).»</p>`},
  {fig:'(١-٨)',ref:'ص 15',caption:'محرك خطوة ذو أقطاب مغناطيسية دائمة: (أ) Phase a مغذّاة، (ب) Phase b مغذّاة والدوار دار 45°',draw:()=>row3([[motorSVG(MOT.pm,[1,0],0,{s:1.15}),'(أ) Phase a: N أعلى وأسفل، S يمينًا ويسارًا'],[motorSVG(MOT.pm,[0,1],45,{s:1.15,marks:[[62,0,45,'45°']]}),'(ب) Phase b: الأقطاب القطرية، والدوار دار 45°']])},
  {h:'كيفية عمل المحركات ذات الأقطاب الدائمة',ref:'ص 16',html:`<p>«عند تغذية المجموعة 'A' بتيار مستمر، تتحد محاور أقطاب الدوار مع محاور أقطاب المجموعة 'A'، بحيث يتجاذب كل قطبين مختلفين، ويثبت الدوار على هذا الوضع الموضح بالشكل (١-٨أ). عند فصل المجموعة 'A' وتغذية المجموعة 'B' بتيار مستمر، يخطو الدوار <b>45 درجة (خطوة كاملة) في عكس اتجاه عقارب الساعة</b>، لتتحد محاور أقطابه مع محاور أقطاب المجموعة 'B'، ويثبت الدوار أيضًا في هذا الوضع الموضح في الشكل (١-٨ب).»</p>
   <p>«عند إثارة المجموعة 'A' مرة أخرى ولكن <b>بعكس القطبية السابقة</b>، يتابع الدوار دورانه بخطوة أخرى، ضد عقارب الساعة وهكذا، ويصبح تتابع المجموعات <b class="ltr">A, B, -A, -B, A, …</b>، كما هو مبين بجدول التسلسل المنطقي للمحرك (١-٥) و<b>الإشارة السالبة تعني عكس قطبية التغذية</b>.»</p>`},
  {fig:'',ref:'ص 16',caption:'<b>الجدول (١-٥)</b> يبين التسلسل المنطقي لتتابع توصيل المجموعات بحيث يخطو المحرك المبين بالشكل (١-٨) بخطوة كاملة 45 درجة ضد عقارب الساعة',draw:()=>tblFig(SEQ.t15,['A','B'])},
  {err:'تعليق الجدول (١-٥) في الكتاب (ص 16) يذكر «المحرك المبين بالشكل <b>٢-٧</b>»، والصحيح الشكل (١-٨).'},
  {html:'<p>«الشكل (١-٩) يبين موجات الجهد الموصل مع المجموعتين (A&amp;B) في هذه الحالة.» الموجات هنا <b>ثنائية القطبية</b>: موجبة (+) أو سالبة (−) أو صفر.</p>'},
  {fig:'(١-٩)',ref:'ص 16',caption:'موجات الجهد الموصل لمجموعات المحرك المبين بالشكل (١-٨) عند تشغيله بخطوة كاملة ضد عقارب الساعة',draw:()=>waveFig(SEQ.t15,['A','B'],10,1)},
  {h:'نصف الخطوة',ref:'ص 17',html:'<p>«يمكن تشغيل المحرك بنصف خطوة إذا تم اتباع التسلسل المنطقي المبين بالجدول ١-٦».</p>'},
  {fig:'',ref:'ص 17',caption:'<b>الجدول (١-٦)</b> يبين التسلسل المنطقي لتتابع توصيل المجموعات بحيث يخطو المحرك المبين بالشكل (١-٨) بنصف خطوة 22.5 درجة عكس عقارب الساعة',draw:()=>tblFig(SEQ.t16,['A','B'])},
  {note:'الجدول (١-٦) في الكتاب ينتهي عند الصف الثامن ولا يكرر صف البداية في آخره كما تفعل الجداول الأخرى؛ هذا ليس خطأً، فالصف التاسع سيكون A = 1، B = 0 من جديد.'},
  {html:'<p>«الشكل (١-١٠) يبين موجات الجهد الموصل مع المجموعتين (A&amp;B) في حالة دوران المحرك بنصف خطوة ضد عقارب الساعة. كما يمكن تشغيل المحرك في اتجاه عقارب الساعة، بخطوة كاملة أو بنصف خطوة، إذا تم <b>عكس ترتيب تسلسل تغذية مجموعات العضو الثابت</b>، المبينة في الجداول (١-٥) و (١-٦) على الترتيب.»</p>'},
  {fig:'(١-١٠)',ref:'ص 17',caption:'موجات الجهد في حالة دوران المحرك المبين بالشكل (١-٨) بنصف خطوة ضد عقارب الساعة',draw:()=>waveFig(SEQ.t16,['A','B'],10,1)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا تكفي هنا مجموعتان بينما يحتاج محرك الممانعة المتغيرة ثلاثًا؟ لأن الدوار هنا مغناطيس له شمال وجنوب: عكس قطبية A يجعل قطبها الشمالي جنوبيًا، فيجذب قطب الدوار الآخر ويتقدم الدوار خطوة جديدة في نفس الاتجاه. أما دوار الحديد فلا يفرّق بين N وS.'}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر محرك الأقطاب الدائمة',ref:'مبني على الشكل (١-٨) ص 15 والجدولين (١-٥) و(١-٦) ص 16–17',motors:['pm'],seqs:()=>[SEQ.t15,SEQ.t15r,SEQ.t16,SEQ.t16r],
  tries:['في اليدوي اضبط A = +1 ثم A = -1: يدور الدوار 90° لأن القطبية انعكست.','شغّل (١-٦) ولاحظ أن الدوار يقف عند 22.5° حين تُغذّى المجموعتان معًا.','بدّل بين (١-٥) وعكسه: لاحظ أن عكس الاتجاه هو عكس ترتيب الصفوف فقط.','قارن الموجات ثنائية القطبية بالشكلين (١-٩) و(١-١٠).'],
  steps:[
   {t:'الوضع (١-٨أ)',x:'المجموعة A مغذّاة بقطبية موجبة: قطبا الثابت العلوي والسفلي N، والجانبيان S، وقطبا الدوار S يقابلان N.'},
   {t:'غذِّ B',x:'اضغط «خطوة»: تُفصل A وتُغذّى B فيدور الدوار 45° ضد عقارب الساعة (الشكل ١-٨ب).',done:w=>(w.bySeq.t15||0)>=1},
   {t:'عكس قطبية A',x:'اضغط «خطوة» مرة أخرى: الصف 3 هو -A. لاحظ انقلاب N وS على أقطاب a وتقدّم الدوار 45° أخرى.',done:w=>(w.bySeq.t15||0)>=2},
   {t:'أكمل الدورة',x:'تابع حتى الصف 5: A, B, -A, -B, A. أربع خطوات = 180°.',done:w=>(w.bySeq.t15||0)>=4},
   {t:'نصف الخطوة',x:'اختر «(١-٦) نصف ⟲» واضغط «خطوة» عدة مرات: كل خطوة 22.5°.',done:w=>(w.bySeq.t16||0)>=3},
   {t:'الاتجاه المعاكس',x:'اختر «عكس (١-٥)» وشغّل تلقائيًا: A, -B, -A, B — مع عقارب الساعة.',done:w=>w.seq==='t15r'&&(w.bySeq.t15r||0)>=2},
   {t:'جرّب يدويًا',x:'اختر «يدوي» واجعل A = -1 و B = -1 معًا: أين يقف الدوار؟ قارنه بالصف 6 من الجدول (١-٦).',done:w=>w.mode==='man'&&w.neg&&w.on>=2}
  ],
  extra:(host)=>{fillTable(host,{title:'تحدٍّ: اكتب جدول الخطوة الكاملة مع عقارب الساعة',ref:'«بعكس ترتيب تسلسل التغذية» ص 17',labels:['A','B'],bip:1,rows:SEQ.t15r.rows,hint:'اضغط على الخانة لتتنقل بين 1 و -1 و 0. ابدأ من A = 1 ثم اقرأ الجدول (١-٥) من الأسفل إلى الأعلى.',ok:'A, -B, -A, B, A — وهو الجدول (١-٥) بترتيب معكوس.'});return {}}}),
 examples:[
  thetaEx({title:'خطوة محرك الشكل (١-٨)',ref:'ص 15–17',q:'<p>«لحساب خطوة المحرك تستخدم نفس العلاقة المعطاة بالمعادلة (١-١) (يكون الناتج 45 درجة)». المحرك: مجموعتان (N = 2) ودوار بأربعة أقطاب دائمة (P = 4). ونصف الخطوة في الجدول (١-٦) «22.5 درجة».</p>',N:2,P:4,nl:'عدد المجموعات',pl:'عدد أقطاب الدوار المغناطيسية',half:1,halfT:'نصف الخطوة (عنوان الجدول ١-٦ ص 17)'})
 ],
 quiz:[
  {q:'لماذا توضع مغناطيسات دائمة على الدوار؟',o:['لتقليل السعر','لزيادة العزم المتولد','لتقليل الخطوة','لإلغاء الملفات'],c:1,e:'«يمكن زيادة العزم المتولد… باستخدام مغناطيسات دائمة قوية على العضو الدوار» (ص 15).'},
  {q:'كم مجموعة على ثابت محرك الشكل (١-٨)؟',o:['مجموعة واحدة','مجموعتان من أربعة أقطاب','ثلاث مجموعات','ثماني مجموعات'],c:1,e:'(ص 15).'},
  {q:'ماذا تعني الإشارة السالبة في الجدول (١-٥)؟',o:['فصل المجموعة','عكس قطبية التغذية','نصف الجهد','عكس اتجاه المحرك كله'],c:1,e:'«الإشارة السالبة تعني عكس قطبية التغذية» (ص 16).'},
  {q:'ما خطوة محرك الشكل (١-٨)؟',o:['15°','22.5°','45°','90°'],c:2,e:'360 ÷ (2 × 4) = 45°.'},
  {q:'ما التسلسل الذي يدير محرك الشكل (١-٨) ضد عقارب الساعة بخطوة كاملة؟',o:['A, B, C, A','A, B, -A, -B, A','A, -A, B, -B','A, -B, -A, B, A'],c:1,e:'الجدول (١-٥). أما A, -B, -A, B فهو عكسه (مع عقارب الساعة).'},
  {q:'نصف الخطوة لهذا المحرك:',o:['7.5°','15°','22.5°','45°'],c:2,e:'عنوان الجدول (١-٦): «بنصف خطوة 22.5 درجة».'},
  {q:'كيف يُعكس اتجاه دوران هذا المحرك؟',o:['بعكس ترتيب تسلسل تغذية المجموعات','بزيادة التيار','بفصل المجموعة B','لا يمكن عكسه'],c:0,e:'«إذا تم عكس ترتيب تسلسل تغذية مجموعات العضو الثابت» (ص 17).'},
  {q:'موجات الجهد في الشكل (١-٩) تختلف عن الشكل (١-٣) لأنها:',o:['أعرض','ثنائية القطبية (موجبة وسالبة)','بلا فترات صفرية','متساوية على المجموعتين دائمًا'],c:1,e:'التغذية هنا +1 و -1.'}
 ]
});

/* =====================================================================
   LESSON 5 — hybrid: construction and operation
   ===================================================================== */
B.lesson({
 id:'u1-l5',unit:1,order:5,pages:'18–20',
 title:'محرك الخطوة الهجين: التركيب وطريقة العمل',
 summary:'مغناطيس دائم في اتجاه محور الدوار، وعلى كل طرف قطعة حديد بخمسة أسنان: أسنان طرف شمالية وأسنان الطرف الآخر جنوبية، مزاحة نصف سن. تغذية A ثم B ثم −A تدير المحرك 18° لكل خطوة.',
 theory:[
  {h:'٣. محركات الخطوة ذات الأقطاب المغناطيسية الدائمة على طول المحور الدوار (محرك الخطوة الهجين)',ref:'ص 18',html:`<p>«شكل آخر من أشكال محركات الخطوة ذات الأقطاب المغناطيسية الدائمة، وتركيبه كما في الشكل (١-١١)، العضو الثابت مكون من <b>مجموعتين من الأقطاب</b>، كل مجموعة مكونة من <b>قطبين</b>، ملفات أقطاب المجموعة الواحدة موصلة على التوالي، لتُكون عند تغذيتها بتيار مستمر قطبًا شماليًا وآخر جنوبيًا.»</p>
   <p>«العضو الدوار مثبت عليه <b>مغناطيس دائم في اتجاه محوره</b>، يوجد على كل طرف من أطراف الدوار قطعة من الحديد، بها <b>خمسة أسنان</b>، بحيث تكتسب جميع الأسنان عند أحد طرفي الدوار قطبية مغناطيسية شمالية، وتكتسب الأسنان التي عند الطرف الآخر للدوار قطبية جنوبية، مجموعة الأقطاب الشمالية مرتبة بحيث <b>تنحرف بنصف خطوة</b> [سن]، عن مجموعة الأقطاب الجنوبية.»</p>`},
  {fig:'(١-١١أ)',ref:'ص 18',caption:'محرك الخطوة من النوع الهجين — مقطع طولي: المغناطيس المحوري (S يسارًا وN يمينًا) ومسار الفيض المغلق عبر الثابت والفجوة الهوائية، وخطا المقطعين a-a و b-b',draw:()=>box(hybLong(),440)},
  {fig:'(١-١١ب، ج)',ref:'ص 18',caption:'المقطع a-a (أسنان S1…S5، والسن S1 منطبق على A) والمقطع b-b (أسنان N1…N5، والسن N1 منطبق على A′) — مزاحة نصف سن',draw:()=>box(motorSVG(MOT.hy,[1,0],0),560)},
  {html:'<p>«التناظر بين أي من مجموعات الثابت وكل من مجموعتي أقطاب الدوار، يجعل من الواضح أن تسلك كل مجموعة أقطاب للدوار السلوك نفسه مع أحد قطبي الثابت، أي أنه عند تغذية المجموعة (A-A′)، فإن العلاقة بين القطب الشمالي A ومجموعة الأقطاب الجنوبية للدوار، هي نفس العلاقة بين القطب الجنوبي A′ ومجموعة الأقطاب الشمالية للدوار، ويمكن ذكر العلاقة نفسها عند تغذية المجموعة (B-B′).»</p>'},
  {h:'طريقة عمل المحرك الهجين',ref:'ص 19',html:`<p>«يمكن فهمها بفحص الرسومات التوضيحية في الشكل (١-١٢). نقطة البداية عندما تغذي المجموعة (A-A′) بالتيار المستمر في الاتجاه الموجب، أي أن يكتسب القطب (A) قطبية شمالية والقطب المقابل له (A′) قطبية جنوبية، بينما تظل المجموعة (B-B′) بدون تغذية، يتخذ الدوار الوضع المبين في الشكل (١-١٢أ) ويظل مستقرًا في هذا الوضع، طالما استمرت تغذية المجموعة (A-A′).»</p>
   <p>«فإذا فصلت المجموعة (A-A′) وغذيت المجموعة (B-B′) بقطبية موجبة، أي بحيث يكون القطب (B) قطبًا شماليًا، والقطب (B′) قطبًا جنوبيًا، فسيخطو الدوار خطوة كاملة <b>ثماني عشرة درجة (18°)</b> ضد اتجاه دوران عقارب الساعة، ويستقر في الوضع المبين في الشكل (١-١٢ب). يخطو المحرك خطوة أخرى ضد دوران عقارب الساعة إذا فصلت المجموعة (B-B′) ووصلت المجموعة (A-A′) مرة أخرى ولكن بقطبية سالبة الشكل (١-١٢ج) وهكذا.»</p>`},
  {fig:'(١-١٢)',ref:'ص 20',caption:'كيفية عمل محرك الخطوة الهجين: (أ) A موجبة، (ب) B موجبة والدوار دار 18°، (ج) A سالبة والدوار دار 18° أخرى. يسارًا طرف S ويمينًا طرف N في كل صف.',draw:()=>[
    [[1,0],0,[[[48,72,90,'18°']],[[48,252,270,'18°']]],'(أ) A-A′ موجبة: S1 على A و N1 على A′. السن S2 على بعد 18° من محور B.'],
    [[0,1],18,[[[48,162,180,'18°']],[[48,342,360,'18°']]],'(ب) B-B′ موجبة: S2 على B و N2 على B′. دار الدوار 18° ضد عقارب الساعة.'],
    [[-1,0],36,[[[48,252,270,'18°']],[[48,72,90,'18°']]],'(ج) A-A′ سالبة: S3 على A′ و N3 على A. 18° أخرى.']
   ].map(([ph,th,mk,c])=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${motorSVG(MOT.hy,ph,th,{marks:mk,noflux:1})}</div><p class="sub" style="text-align:center;margin-bottom:10px">${c}</p>`).join('')},
  {h:'خطوة المحرك الهجين',ref:'ص 21',html:'<p>«خطوة المحرك تحسب بتطبيق المعادلة (١-١)، جداول التسلسل المنطقي لحركة المحرك بخطوة كاملة وبنصف خطوة ضد عقارب الساعة، هي نفس الجداول ١-٥ و ١-٦ على الترتيب. كما يمكن عكس اتجاه خطوة المحرك بعكس التسلسل الوارد في الجداول المذكورة.»</p>'},
  {note:'<b>توضيح (ليس من نص الكتاب):</b> الكتاب يقول إن الخطوة 18° ويحيل إلى المعادلة (١-١) دون أن يبيّن الحساب. المعادلة تعطي 18° إذا عُدّت أسنان الدوار في <b>الطرفين معًا</b>: <span class="ltr">P = 5 + 5 = 10</span> (لأن أسنان الطرف N مزاحة نصف سن عن أسنان الطرف S، فتصير كأنها عشرة أسنان متناوبة حول المحيط)، و <span class="ltr">N = 2</span>، فتكون <span class="ltr">θ = 360 ÷ (2 × 10) = 18°</span>. لو عددنا أسنان طرف واحد فقط (P = 5) لحصلنا على 36°، وهذا لا يطابق ما يحدث في الشكل (١-١٢). انظر «الأمثلة المحلولة».'},
  {err:'كتب الكتاب (ص 21) «خطوة المحرك تحسب بتطبيق المعادلة <b>(٢-١)</b>» والصحيح المعادلة (١-١).'}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر المحرك الهجين',ref:'مبني على الشكلين (١-١١) و(١-١٢) ص 18–20 والجدولين (١-٥) و(١-٦)',motors:['hy'],seqs:()=>[SEQ.t15,SEQ.t15r,SEQ.t16,SEQ.t16r],
  tries:['تابع السن S2: بعد خطوة واحدة ينطبق على B، تمامًا كالشكل (١-١٢ب).','لاحظ أن طرفي الدوار يدوران معًا: ما يحدث لأسنان S مع القطب N يحدث لأسنان N مع القطب S.','شغّل (١-٦): كل نصف خطوة 9°.','في اليدوي اجعل A = -1 مباشرة من A = +1: هذا توازن غير مستقر؛ إلى أي جهة يذهب الدوار؟'],
  steps:[
   {t:'الوضع (١-١٢أ)',x:'A-A′ موجبة: A شمالي فتنجذب إليه أسنان الطرف S (السن S1)، و A′ جنوبي فتنجذب إليه أسنان الطرف N (السن N1).'},
   {t:'غذِّ B-B′',x:'اضغط «خطوة»: B شمالي و B′ جنوبي. يدور الدوار 18° ضد عقارب الساعة فينطبق S2 على B و N2 على B′ (الشكل ١-١٢ب).',done:w=>(w.bySeq.t15||0)>=1},
   {t:'A بقطبية سالبة',x:'اضغط «خطوة»: -A يجعل A جنوبيًا و A′ شماليًا، فينطبق S3 على A′ و N3 على A (الشكل ١-١٢ج).',done:w=>(w.bySeq.t15||0)>=2},
   {t:'دورة كاملة',x:'شغّل «تلقائي»: كم خطوة تحتاج النقطة البرتقالية لتعود للأعلى؟ (360 ÷ 18 = 20).',done:w=>w.auto&&(w.bySeq.t15||0)>=6},
   {t:'الاتجاه المعاكس',x:'اختر «عكس (١-٥)»: A, -B, -A, B — مع عقارب الساعة.',done:w=>w.seq==='t15r'&&(w.bySeq.t15r||0)>=2},
   {t:'نصف الخطوة',x:'اختر «(١-٦) نصف ⟲»: تغذية A و B معًا توقف الدوار في المنتصف (9°).',done:w=>(w.bySeq.t16||0)>=2}
  ],
  extra:(host)=>{host.innerHTML=`<h2>المقطع الطولي ومسار الفيض <small>الشكل (١-١١أ) ص 18</small></h2><p class="sub">فيض المغناطيس الدائم موجود دائمًا (حتى بلا تغذية): يخرج من طرف N، يعبر الفجوة الهوائية إلى الثابت، يسير فيه، ثم يعود عبر الفجوة إلى طرف S. تغذية الملفات تحدد أي الأسنان تنجذب.</p>${box(hybLong(),460)}`;return {}}}),
 examples:[
  thetaEx({title:'خطوة المحرك الهجين للشكل (١-١١)',ref:'ص 19–21',q:'<p>يذكر الكتاب أن الدوار يخطو «ثماني عشرة درجة (18°)» وأن «خطوة المحرك تحسب بتطبيق المعادلة (١-١)». المحرك: مجموعتان على الثابت (N = 2)، وفي كل طرف من الدوار خمسة أسنان.</p>',N:2,P:10,nl:'عدد مجموعات الثابت',pl:'عدد أسنان الدوار في الطرفين معًا (5 + 5)',res:'خطوة المحرك (كما في الكتاب: 18°)',half:1,halfT:'نصف الخطوة بالجدول (١-٦) (توضيح: ليس مطبوعًا في الكتاب)',
   note:'<b>توضيح (ليس من نص الكتاب):</b> وضعنا P = 10 لأن أسنان الطرفين مزاحة نصف سن فتعمل كعشرة أسنان متناوبة. جرّب P = 5 (طرف واحد): الناتج 36° وهو لا يطابق الشكل (١-١٢).'})
 ],
 quiz:[
  {q:'أين يوجد المغناطيس الدائم في المحرك الهجين؟',o:['على الثابت','على الدوار في اتجاه محوره','داخل الملفات','لا يوجد مغناطيس'],c:1,e:'«العضو الدوار مثبت عليه مغناطيس دائم في اتجاه محوره» (ص 18).'},
  {q:'كم سنًا في كل طرف من طرفي دوار الشكل (١-١١)؟',o:['ثلاثة','أربعة','خمسة','ثمانية'],c:2,e:'(ص 18).'},
  {q:'بماذا تختلف أسنان الطرف N عن أسنان الطرف S؟',o:['لا تختلف','مزاحة عنها بنصف سن','أكبر حجمًا','عددها ضعف'],c:1,e:'«مجموعة الأقطاب الشمالية مرتبة بحيث تنحرف بنصف خطوة عن مجموعة الأقطاب الجنوبية» (ص 18).'},
  {q:'عند تغذية A-A′ موجبة، أي الأسنان تنجذب إلى القطب A (الشمالي)؟',o:['أسنان الطرف N','أسنان الطرف S','كل الأسنان','لا شيء'],c:1,e:'الأقطاب المختلفة تتجاذب: A شمالي يجذب أسنان الطرف الجنوبي (S1).'},
  {q:'كم يخطو الدوار عند فصل A-A′ وتغذية B-B′ بقطبية موجبة؟',o:['9°','18° ضد عقارب الساعة','36°','45°'],c:1,e:'«فسيخطو الدوار خطوة كاملة ثماني عشرة درجة (18°) ضد اتجاه دوران عقارب الساعة» (ص 19).'},
  {q:'كيف تعطي المعادلة (١-١) خطوة 18° لهذا المحرك؟',o:['N = 2 و P = 5','N = 2 و P = 10 (أسنان الطرفين معًا)','N = 4 و P = 5','N = 1 و P = 20'],c:1,e:'توضيح: 360 ÷ (2 × 10) = 18°. مع P = 5 تكون 36°.'},
  {q:'ما جداول التسلسل لهذا المحرك بخطوة كاملة ونصف خطوة ضد عقارب الساعة؟',o:['(١-١) و(١-٣)','(١-٥) و(١-٦)','(١-٢) و(١-٤)','لا توجد جداول'],c:1,e:'«هي نفس الجداول ١-٥ و ١-٦ على الترتيب» (ص 21).'}
 ]
});

/* =====================================================================
   LESSON 6 — hybrid torque & two-phase-on
   ===================================================================== */
B.lesson({
 id:'u1-l6',unit:1,order:6,pages:'19–22',
 title:'عزم المحرك الهجين وتغذية المجموعتين معًا',
 summary:'حساب العزم لحظة تبديل التغذية من A-A′ إلى B-B′ بقانون جيب الزاوية (للتجاذب) وجيب تمام الزاوية (للتنافر): T = 0.863 Tm. وتغذية المجموعتين معًا (الجدولان ١-٧ و١-٨) تعطي عزمًا أكبر.',
 theory:[
  {h:'العزم عند أي زاوية',ref:'ص 19',html:`<p>«إذا افترضنا أن أقصى عزم متولد هو <b>T<sub>m</sub></b> فيمكن حساب العزم عند أي زاوية أخرى يكون عندها العزم ذا قيمة أقل من T<sub>m</sub> باستخدام جيب الزاوية أو جيب تمام الزاوية، طبقًا لكون العزم ناتجًا عن <b>التجاذب أو التنافر</b> بين الأقطاب على الترتيب.»</p>
   <ul><li>«عزم التجاذب بين الأقطاب المغناطيسية المختلفة، يبلغ أقصى قيمة له عندما تكون الزاوية بين محوري القطبين تسعين درجة (90°)، فهو إذًا <b>يخضع لقانون جيب الزاوية</b>.»</li>
   <li>«أما في حالة التنافر بين الأقطاب المغناطيسية المتشابهة، فيبلغ العزم أقصى قيمة له عندما تكون الزاوية بين محوري القطبين صفرًا، إذًا فهو <b>يخضع لقانون جيب تمام الزاوية</b>.»</li></ul>`},
  {h:'العزم لحظة التبديل من A-A′ إلى B-B′',ref:'ص 19–21',html:`<p>«عندما يتم فصل (A-A′) وتغذية (B-B′) ومازال الدوار في الوضع (١-١٢أ)، فيحسب العزم من:»</p>
   $$T=T_m\\left[\\sin\\angle^{S2}_{N}+\\sin\\angle^{S1}_{N}-\\sin\\angle^{S3}_{N}+\\cos\\angle^{S5}_{S}-\\cos\\angle^{S4}_{S}\\right]\\qquad(١-٢)$$
   <p>«استعملت <b>الإشارة الموجبة للعزم الذي يعمل ضد اتجاه عقارب الساعة</b>، والإشارة السالبة للعزم الذي يعمل مع عقارب الساعة، وبإدخال قيم الزوايا المذكورة في المعادلة (١-٢) ينتج:»</p>
   $$T=T_m\\left[\\sin 18^\\circ+\\sin 90^\\circ-\\sin 54^\\circ+\\cos 18^\\circ-\\cos 54^\\circ\\right]$$
   $$T=T_m\\left[0.309+1.0-0.809+0.951-0.588\\right]$$
   $$T=0.863\\,T_m\\qquad(١-٣)$$
   <p>«لأن محصلة العزم موجبة، فسيخطو الدوار 18° ضد عقارب الساعة، حتى يصل إلى وضع الاتزان المبين بالشكل (١-١٢ب).»</p>`},
  {note:'<b>توضيح لقراءة الرموز (ليس من نص الكتاب):</b> \\(\\angle^{S2}_{N}\\) هي الزاوية بين محور سن الدوار S2 ومحور القطب الشمالي للثابت (B بعد تغذيته)، و \\(\\angle^{S5}_{S}\\) هي الزاوية بين السن S5 والقطب الجنوبي (B′). الأسنان S1 و S2 و S3 جنوبية فتنجذب إلى B الشمالي (جيب)، والأسنان S4 و S5 جنوبية فتتنافر مع B′ الجنوبي (جيب تمام). الإشارة تحدد هل يشد السن الدوار ضد عقارب الساعة (+) أم معها (−). جرّب ذلك في «مستكشف العزم» في المختبر.'},
  {fig:'(١-١٢أ)',ref:'ص 20',caption:'الدوار ما زال في وضع (١-١٢أ) لحظة تغذية B-B′ (B شمالي، B′ جنوبي): الزوايا 18° و 90° و 54° لأسنان S2 و S1 و S3 مع B، و 18° و 54° لأسنان S5 و S4 مع B′',draw:()=>box(`<svg viewBox="0 0 300 290" role="img" aria-label="زوايا الأسنان">${section({cx:150,cy:150,s:1.15,th:0,poles:[0,90,180,270].map((a,i)=>({a,st:i===1?'N':i===3?'S':'',lbl:MOT.hy.pl[i],w:17})),rotor:{kind:'teeth',n:5,a0:0,tw:10,pol:'S',nums:[0,72,144,216,288].map((a,j)=>[a,'S'+(j+1)])},marks:[[60,72,90,'18°'],[38,0,90,'90°'],[60,144,90,'54°'],[60,288,270,'18°'],[44,216,270,'54°']]})}</svg>`,340)},
  {err:'المعادلة (١-٢) تعدّ أسنان الطرف S فقط (S1…S5) ولا تذكر مساهمة أسنان الطرف N، كما أن رمز الزاوية \\(\\angle^{S2}_{N}\\) لم يُعرّف صراحة في الكتاب (فسرناه من سياق الشكل). الحساب نفسه صحيح: 0.309 + 1.0 − 0.809 + 0.951 − 0.588 = 0.863.'},
  {h:'تغذية المجموعتين في نفس الوقت',ref:'ص 21',html:'<p>«يمكن أيضًا تشغيل المحرك بخطوة كاملة في كل من اتجاهي الحركة بتغذية مجموعتي العضو الثابت في نفس الوقت، وذلك <b>للحصول على عزم أكبر</b> من الحالة السابقة، إذا اتبع التسلسل المنطقي الموضح في الجداول ١-٧ و ١-٨.»</p>'},
  {fig:'',ref:'ص 21',caption:'<b>الجدول (١-٧)</b> يبين التسلسل المنطقي لتتابع توصيل المجموعات بحيث تتم تغذية مجموعتي الثابت معًا ويخطو المحرك بخطوة كاملة 18 درجة ضد عقارب الساعة',draw:()=>tblFig(SEQ.t17,['A','B'])},
  {fig:'',ref:'ص 21',caption:'<b>الجدول (١-٨)</b> … ويخطو المحرك بخطوة كاملة 18 درجة مع عقارب الساعة',draw:()=>tblFig(SEQ.t18,['A','B'])},
  {html:'<p>«الشكل (١-١٣) يبين موجات الجهد الموصل مع مجموعات الثابت في الحالتين السابقتين:» موجتان مربعتان ثنائيتا القطبية بلا فترات صفرية، وبينهما إزاحة فترة خطوة واحدة.</p>'},
  {fig:'(١-١٣أ)',ref:'ص 22',caption:'موجات الجهد الموصل لمجموعتي الثابت في حالة تغذية المجموعتين في نفس الوقت ودوران المحرك بخطوة كاملة ضد عقارب الساعة',draw:()=>waveFig(SEQ.t17,['A','B'],8,1)},
  {fig:'(١-١٣ب)',ref:'ص 22',caption:'… ودوران المحرك بخطوة كاملة مع عقارب الساعة',draw:()=>waveFig(SEQ.t18,['A','B'],8,1)},
  {note:'<b>توضيح (ليس من نص الكتاب):</b> في الجدول (١-٧) يقف الدوار دائمًا في منتصف المسافة بين وضعي المجموعتين (مثلًا 9° بين A و B)، لكن المسافة بين خطوة وأخرى تبقى 18°. ولأن المجموعتين تشدان معًا فعزم الإمساك أكبر؛ في نموذج المحاكاة المبسّط يكون نحو <span class="ltr">√2 ≈ 1.41</span> مرة (رقم توضيحي).'}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر تغذية مجموعتي المحرك الهجين معًا',ref:'مبني على الشكل (١-١٢) والجدولين (١-٧) و(١-٨) ص 21 والشكل (١-١٣) ص 22',motors:['hy'],seqs:()=>[SEQ.t17,SEQ.t18,SEQ.t15],
  tries:['في مستكشف العزم أسفل الصفحة ضع δ = 0: المجموع 0.863 Tm كما في المعادلة (١-٣).','حرّك δ إلى 18°: يصير العزم صفرًا، وهو وضع الاتزان (١-١٢ب).','شغّل (١-٧) ثم (١-٥) بنفس السرعة: الخطوة 18° في الحالتين، لكن أوضاع التوقف مختلفة بـ 9°.','قارن الموجات المربعة بالشكل (١-١٣).'],
  steps:[
   {t:'المجموعتان معًا',x:'التسلسل (١-٧): الصف 1 هو A = 1 و B = 1، فيقف الدوار في المنتصف بين وضعي A و B.'},
   {t:'خطوة',x:'اضغط «خطوة»: الصف 2 هو -A و B. يدور الدوار 18° ضد عقارب الساعة.',done:w=>(w.bySeq.t17||0)>=1},
   {t:'أكمل الجدول (١-٧)',x:'تابع حتى الصف 5. لاحظ الموجات: لا توجد فترة صفرية على أي مجموعة.',done:w=>(w.bySeq.t17||0)>=4},
   {t:'الاتجاه المعاكس',x:'اختر «(١-٨) مجموعتان ⟳» وشغّل تلقائيًا.',done:w=>w.seq==='t18'&&(w.bySeq.t18||0)>=2},
   {t:'قارن بمجموعة واحدة',x:'اختر «(١-٥) كاملة ⟲»: الخطوة 18° أيضًا، لكن الدوار يقف عند أوضاع A و B نفسها.',done:w=>(w.bySeq.t15||0)>=2},
   {t:'مستكشف العزم',x:'انزل إلى «مستكشف العزم» وحرّك δ من 0 إلى 18° وراقب الحدود الخمسة للمعادلة (١-٢).'}
  ],
  extra:(host)=>torqueExplorer(host)}),
 examples:[
  {title:'العزم لحظة تبديل التغذية — المعادلتان (١-٢) و(١-٣)',ref:'ص 19–21',
   q:'<p>«عندما يتم فصل (A-A′) وتغذية (B-B′) ومازال الدوار في الوضع (١-١٢أ)»، احسب العزم المتولد بدلالة أقصى عزم T<sub>m</sub>. الزوايا من الشكل (١-١٢أ).</p>',
   given:[{id:'a1',label:'زاوية S2 مع القطب N',sym:'\\angle^{S2}_{N}',unit:'°',value:18},{id:'a2',label:'زاوية S1 مع القطب N',sym:'\\angle^{S1}_{N}',unit:'°',value:90},{id:'a3',label:'زاوية S3 مع القطب N',sym:'\\angle^{S3}_{N}',unit:'°',value:54},{id:'a4',label:'زاوية S5 مع القطب S',sym:'\\angle^{S5}_{S}',unit:'°',value:18},{id:'a5',label:'زاوية S4 مع القطب S',sym:'\\angle^{S4}_{S}',unit:'°',value:54},{id:'Tm',label:'أقصى عزم (1 = النتيجة بدلالة Tm)',sym:'T_m',unit:'N·m',value:1}],
   solve:(g,B)=>{const r3=x=>B.round(x,3),t=[r3(Math.sin(g.a1*D)),r3(Math.sin(g.a2*D)),r3(Math.sin(g.a3*D)),r3(Math.cos(g.a4*D)),r3(Math.cos(g.a5*D))],sum=r3(t[0]+t[1]-t[2]+t[3]-t[4]);
    const out=[{t:'نطبّق المعادلة (١-٢) (الموجب = ضد عقارب الساعة):',f:'T=T_m\\left[\\sin\\angle^{S2}_{N}+\\sin\\angle^{S1}_{N}-\\sin\\angle^{S3}_{N}+\\cos\\angle^{S5}_{S}-\\cos\\angle^{S4}_{S}\\right]'},
     {t:'نعوّض بالزوايا:',f:`T=T_m\\left[\\sin ${g.a1}^\\circ+\\sin ${g.a2}^\\circ-\\sin ${g.a3}^\\circ+\\cos ${g.a4}^\\circ-\\cos ${g.a5}^\\circ\\right]`},
     {t:'قيم الجيوب وجيوب التمام (لثلاث خانات كما في الكتاب):',f:`T=T_m\\left[${fmt3(t[0])}+${fmt3(t[1])}-${fmt3(t[2])}+${fmt3(t[3])}-${fmt3(t[4])}\\right]`},
     {t:'العزم بدلالة أقصى عزم — المعادلة (١-٣)'+(sum>0?': موجب، أي ضد عقارب الساعة':sum<0?': سالب، أي مع عقارب الساعة':''),f:`T=${sum}\\,T_m`,v:sum,unit:'× Tm',dp:3,final:g.Tm===1}];
    if(g.Tm!==1)out.push({t:'بالتعويض عن T<sub>m</sub>:',f:`T=${sum}\\times ${g.Tm}`,v:B.round(sum*g.Tm,3),unit:'N·m',dp:3,final:true});
    return out},
   note:'بقيم الكتاب تظهر الحدود 0.309 و 1.0 و 0.809 و 0.951 و 0.588 والمجموع 0.863 T<sub>m</sub> كما في ص 21 (القيمة الدقيقة 0.8633 فلا فرق في التقريب).'}
 ],
 quiz:[
  {q:'عزم التجاذب بين الأقطاب المختلفة يخضع لقانون:',o:['جيب تمام الزاوية','جيب الزاوية','الظل','لا يتغير مع الزاوية'],c:1,e:'أقصى قيمة عند 90° ⇐ قانون جيب الزاوية (ص 19).'},
  {q:'عزم التنافر بين الأقطاب المتشابهة يبلغ أقصاه عندما تكون الزاوية:',o:['صفرًا','45°','90°','180°'],c:0,e:'أقصاه عند الصفر ⇐ قانون جيب تمام الزاوية (ص 19).'},
  {q:'ما الإشارة المستعملة للعزم الذي يعمل ضد اتجاه عقارب الساعة؟',o:['السالبة','الموجبة','لا إشارة','حسب السن'],c:1,e:'(ص 21).'},
  {q:'ما قيمة العزم لحظة تبديل التغذية من A-A′ إلى B-B′؟',o:['Tm','0.5 Tm','0.863 Tm','صفر'],c:2,e:'المعادلة (١-٣): T = 0.863 Tm.'},
  {q:'لماذا يدور الدوار ضد عقارب الساعة بعد التبديل؟',o:['لأن محصلة العزم موجبة','لأن محصلة العزم سالبة','لأن المغناطيس يدفعه','بالصدفة'],c:0,e:'«لأن محصلة العزم موجبة، فسيخطو الدوار 18° ضد عقارب الساعة» (ص 21).'},
  {q:'لماذا تُغذّى مجموعتا الثابت في نفس الوقت (الجدولان ١-٧ و١-٨)؟',o:['لنصف خطوة','للحصول على عزم أكبر','لتقليل التيار','لإيقاف المحرك'],c:1,e:'«وذلك للحصول على عزم أكبر من الحالة السابقة» (ص 21).'},
  {q:'الصف الثاني في الجدول (١-٧) هو:',o:['A = 1 و B = 1','A = -1 و B = 1','A = 1 و B = -1','A = 0 و B = 1'],c:1,e:'(١,١) ثم (-١,١) ثم (-١,-١) ثم (١,-١).'},
  {q:'ما شكل موجات الجهد في الشكل (١-١٣)؟',o:['نبضات موجبة فقط','موجات مربعة ثنائية القطبية بلا فترات صفرية','جيبية','خط ثابت'],c:1,e:'المجموعتان مغذّاتان دائمًا: إما + أو −.'}
 ]
});

/* =====================================================================
   LESSON 7 — unit questions and self-test
   ===================================================================== */
const det=(q,body,ans)=>`<details style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:8px;background:var(--surface)"><summary style="cursor:pointer;font-weight:600">${q}</summary>${body||''}<div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const opts=a=>`<ul style="list-style:none;padding:0;margin:6px 0">${a.map((o,i)=>`<li>${'أبجد'[i]}. ${o}</li>`).join('')}</ul>`;
const tbl=(labels,rows)=>`<div class="tablebox" style="max-width:420px">${seqTable({rows},labels,-1)}</div>`;
const g17=k=>genSeq(MOT.q17,k),g18=k=>genSeq(MOT.q18,k),g110=k=>genSeq(MOT.f116,k);
B.lesson({
 id:'u1-l7',unit:1,order:7,pages:'23–26',
 title:'أسئلة الوحدة واختبارها الذاتي',
 summary:'الاختبار الذاتي (ص 23) والأسئلة المتنوعة (ص 24–26) كما في الكتاب، وتحت كل سؤال إجابة مقترحة، مع مختبر يشغّل محركات المسائل وحاسبات للخطوة.',
 theory:[
  {note:'الكتاب لا يعطي إجابات لأسئلته. كل «إجابة مقترحة» هنا مكتوبة من نص الكتاب وليست منه؛ ويُستحسن أن يراجعها المدرب.'},
  {h:'اختبار ذاتي — اختر الإجابة أو الإجابات الصحيحة',ref:'ص 23',html:
   det('س١: في المحركات متدرجة الحركة ذات الممانعة المغناطيسية المتغيرة ………',opts(['يتركب الدوار من أسطوانة دائرية.','يتركب الدوار من أسنان بارزة.','توجد ملفات متغيرة على الدوار.','توجد ملفات متغيرة على الثابت.']),'<b>ب</b> — «العضو الدوار يتركب من أسنان بارزة» (ص 8).')+
   det('س٢: في المحركات متدرجة الحركة ذات الأقطاب المغناطيسية الدائمة ………',opts(['توجد أقطاب مغناطيسية دائمة على الدوار.','توجد أقطاب مغناطيسية دائمة على الثابت.','توجد أقطاب مغناطيسية دائمة على كل من الثابت والدوار.','توجد ملفات دائمة على الدوار.']),'<b>أ</b> — «باستخدام مغناطيسات دائمة قوية على العضو الدوار» (ص 15).')+
   det('س٣: في محركات الممانعة المغناطيسية المتغيرة يجب أن يكون عدد مجموعات الثابت ……',opts(['مجموعتين فقط.','ثلاث مجموعات فقط.','أكثر من مجموعتين.','أكثر من ثلاث مجموعات.']),'<b>ج</b> — «لا بد أن يحتوي العضو الثابت… على ثلاث مجموعات على الأقل» (ص 11)، أي أكثر من مجموعتين. و«ب» غير دقيقة لأن هناك محركات حتى سبع مجموعات (ص 9).')+
   det('س٤: تتم تغذية مجموعتين من مجموعات الثابت لمحرك الخطوة في نفس الوقت بالتتالي وذلك ………',opts(['لعكس اتجاه دوران المحرك.','للحصول على عزم أكبر.','لدوران المحرك بخطوة كاملة.','لدوران المحرك بنصف خطوة.']),'<b>ب</b> — «بتغذية مجموعتي العضو الثابت في نفس الوقت، وذلك للحصول على عزم أكبر» (ص 21). ويمكن قبول <b>ج</b> أيضًا لأن الجدولين (١-٧) و(١-٨) يعطيان خطوة كاملة. لاحظ أن نصف الخطوة (الجداول ١-٣ و١-٦) يغذي مجموعتين معًا في بعض الخطوات فقط وبالتناوب مع مجموعة واحدة. <b>يقرر المدرب</b> هل يقبل «ج» مع «ب».')+
   det('س٥: مجموعات العضو الثابت لمحرك الخطوة ملفوفة بملفات كي تعطي مجالًا مغناطيسيًا بحيث:',opts(['جميع الأقطاب لها نفس القطبية.','الأقطاب المتجاورة لها نفس القطبية.','الأقطاب المتجاورة مختلفة في قطبيتها.','الأقطاب المتقابلة لها نفس القطبية.']),'<b>ج</b> — «بحيث تكون الأقطاب المتجاورة مختلفة في قطبيتها» (ص 9).')},
  {h:'أسئلة متنوعة',ref:'ص 24',html:
   det('س ١-١: اذكر الفرق بين محركات الخطوة ذات الممانعة المتغيرة وذات الأقطاب الدائمة.','','<ul><li><b>الدوار:</b> في الممانعة المتغيرة من شرائح الحديد بأسنان بارزة بلا مغناطيس (ص 8)؛ وفي الأقطاب الدائمة أسطوانة عليها أقطاب مغناطيسية دائمة (ص 15).</li><li><b>العزم:</b> المغناطيس الدائم يزيد العزم المتولد (ص 15).</li><li><b>عدد المجموعات:</b> الممانعة المتغيرة تحتاج ثلاث مجموعات على الأقل لتدور في الاتجاهين (ص 11)؛ والأقطاب الدائمة تكفيها مجموعتان (الشكل ١-٨).</li><li><b>التغذية:</b> في الممانعة المتغيرة 1 أو 0 فقط (الجداول ١-١…١-٤)؛ وفي الأقطاب الدائمة تُعكس القطبية (A, B, -A, -B — الجدول ١-٥).</li></ul>')+
   det('س ١-٢: كيف يمكن حساب خطوة محرك الخطوة.','','من المعادلة (١-١): \\(\\theta = 360 / (N\\cdot P)\\) حيث N عدد مجموعات الثابت و P عدد أسنان (أقطاب) الدوار (ص 15). أمثلة الكتاب: الشكل (١-٢) 15°، الشكل (١-٧) 30°، الشكل (١-٨) 45°. وفي الهجين (18°) تُعدّ أسنان الطرفين معًا (P = 10) — توضيح من عندنا.')+
   det('س ١-٣: اذكر أمثلة لاستخدامات المحركات متدرجة الحركة.','','آلات القطع، طابعات الحاسب الآلي (تحريك الورق سطرًا ثم الثبات)، مشغل الأقراص المرنة أو المدمجة، التطبيقات الروبوتية، وتطبيقات في الصناعة والأجهزة الطبية والعدادات الرقمية (ص 8).')+
   det('س ١-٤: كيف يتم عكس اتجاه دوران محرك الخطوة.','','بعكس ترتيب تسلسل تغذية مجموعات الثابت: في الممانعة المتغيرة A, B, C (ضد عقارب الساعة) تصبح A, C, B (مع عقارب الساعة) (ص 11)، وفي الأقطاب الدائمة والهجين بعكس ترتيب الجداول (١-٥) و(١-٦) (ص 17 و 21)، أو باستعمال الجدول (١-٨) بدل (١-٧).')+
   det('س ١-٥: اشرح مع الرسم تركيب ونظرية عمل محركات الخطوة ذات الممانعة المتغيرة.','','ارسم الشكل (١-٢) أو (١-٧). التركيب: ثابت مجزأ إلى مجموعات (Stacks) مستقلة مغناطيسيًا لكل منها ملفات (Phases)، والأقطاب المتجاورة مختلفة القطبية، ودوار من شرائح الحديد بأسنان بارزة. العمل: عند تغذية A تنطبق محاور الأسنان على أقطاب A؛ وB مزاحة 15° فإذا غُذّيت وحدها دار الدوار 15° ليطابقها، وهكذا مع C. الترتيب A, B, C ضد عقارب الساعة و A, C, B معها، ويلزم ثلاث مجموعات على الأقل (الدرسان 1.2 و 1.3).')+
   det('س ١-٦: اشرح مع الرسم تركيب ونظرية عمل محركات الخطوة ذات الأقطاب الدائمة.','','ارسم الشكل (١-٨). التركيب: مجموعتان على الثابت (a و b) في كل منهما أربعة أقطاب، ودوار أسطواني بأربعة أقطاب دائمة. العمل: تغذية A تجعل أقطاب الدوار تقابل أقطاب A المختلفة عنها؛ ثم B فيخطو 45° ضد عقارب الساعة؛ ثم A بعكس القطبية فيخطو 45° أخرى: A, B, -A, -B (الجدول ١-٥)، ونصف الخطوة 22.5° (الجدول ١-٦) (الدرس 1.4).')+
   det('س ١-٦ [مكرر الرقم في الكتاب]: اشرح مع الرسم تركيب ونظرية عمل محركات الخطوة الهجين.','','ارسم الشكلين (١-١١) و(١-١٢). التركيب: مجموعتان على الثابت (A-A′ و B-B′) كل منهما قطبان على التوالي، ودوار عليه مغناطيس محوري وفي كل طرف قطعة حديد بخمسة أسنان (طرف N وطرف S) مزاحة نصف سن. العمل: A موجبة تجذب أسنان S إلى A وأسنان N إلى A′؛ ثم B موجبة فيخطو 18° ضد عقارب الساعة؛ ثم A سالبة… والعزم لحظة التبديل 0.863 Tm (المعادلة ١-٣) (الدرسان 1.5 و 1.6).')},
  {err:'رقم السؤال «س ١-٦» مكرر مرتين في الكتاب (ص 24: الأقطاب الدائمة، والهجين)، والسؤال الأخير في ص 26 معنون «تمرين ١-١٠» بدل «س ١-١٠».'},
  {h:'س ١-٧: محرك الشكل (١-١٤)',ref:'ص 24',html:'<p>«محرك الخطوة المبين بالشكل (١-١٤)، من النوع ذي الممانعة المغناطيسية المتغيرة، العضو الثابت يحتوي على <b>أربع مجموعات</b> من الأقطاب، كل مجموعة بها قطبان، الدوار يحتوي على <b>ستة أسنان</b>، المطلوب: أ. حساب خطوة المحرك. ب. التسلسل المنطقي لتغذية المجموعات بحيث يدور المحرك مع عقارب الساعة بخطوة كاملة. ج. … مع عقارب الساعة بنصف خطوة. د. … عكس عقارب الساعة بخطوة كاملة. هـ. … عكس عقارب الساعة بنصف خطوة. و. موجات الجهد المغذي للمجموعات في الحالتين ب، ج، د، هـ. ز. هل يمكن استبدال الدوار بآخر، ذي أقطاب مغناطيسية دائمة؟ ولماذا؟»</p>'},
  {fig:'(١-١٤)',ref:'ص 24',caption:'ثابت ذو 8 أقطاب (A, B, C, D, A′, B′, C′, D′ باتجاه عقارب الساعة من الأعلى) ودوار بستة أسنان مرقمة؛ الزاوية بين محور القطب B ومحور السن 2 تساوي 15°',draw:()=>box(motorSVG(MOT.q17,[1,0,0,0],0,{marks:[[64,-45,-60,'15°']]}),340)},
  {html:det('إجابة مقترحة لـ س ١-٧','',`<p><b>أ.</b> \\(\\theta = 360/(4\\times 6) = 15^\\circ\\) (تطابق الـ 15° المرسومة بين B والسن 2)، ونصف الخطوة 7.5°.</p>
   <p>حسب قراءتنا للشكل: القطب B يقع 45° مع عقارب الساعة من A، والسن 2 يقع 60° مع عقارب الساعة؛ فإذا غُذّيت B جذبت السن 2 من 60° إلى 45°، أي أن الدوار يدور <b>ضد</b> عقارب الساعة عند التغذية بالترتيب A, B, C, D.</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px"><div><b>ب. مع عقارب الساعة، خطوة كاملة</b>${tbl(MOT.q17.labels,g17('fc').rows)}</div><div><b>ج. مع عقارب الساعة، نصف خطوة</b>${tbl(MOT.q17.labels,g17('hc').rows)}</div><div><b>د. عكس عقارب الساعة، خطوة كاملة</b>${tbl(MOT.q17.labels,g17('fa').rows)}</div><div><b>هـ. عكس عقارب الساعة، نصف خطوة</b>${tbl(MOT.q17.labels,g17('ha').rows)}</div></div>
   <p><b>و.</b> ارسم لكل جدول نبضة موجبة على كل مجموعة في الخطوات التي قيمتها 1 (مثل الأشكال ١-٣…١-٦). شغّل كل جدول في «المختبر» لترى موجاته.</p>
   <p><b>ز.</b> الكتاب لا يجيب صراحة. اقتراح: يمكن من حيث المبدأ استعمال دوار ذي أقطاب دائمة فيزيد العزم (ص 15)، لكن ذلك يغيّر طريقة العمل: يجب أن يناسب عدد أقطاب الدوار أقطاب الثابت، وأن تُعكس قطبية تغذية المجموعات (A, B, -A, -B…) كما في الجدول (١-٥)، فتتغير الجداول وزاوية الخطوة. أي لا يصلح بنفس الجداول دون تعديل. <b>يقرر المدرب الإجابة المطلوبة.</b></p>`)},
  {h:'س ١-٨',ref:'ص 25',html:'<p>«محرك الخطوة من النوع ذي الممانعة المغناطيسية المتغيرة، العضو الثابت يحتوي على <b>خمس مجموعات</b> من الأقطاب، كل مجموعة بها قطبان، الدوار يحتوي على <b>أربعة أسنان</b>، المطلوب: (نفس البنود أ–ز كما في س ١-٧).»</p>'+
   det('إجابة مقترحة لـ س ١-٨','',`<p><b>أ.</b> \\(\\theta = 360/(5\\times 4) = 18^\\circ\\)، ونصف الخطوة 9°.</p><p>السؤال بلا شكل؛ سمّينا المجموعات A…E <b>بترتيب الخطوات</b> (في المختبر يظهر أن القطب B يقع على بعد قطبين من A مع عقارب الساعة كي تكون الخطوة 18°).</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px"><div><b>ب. مع عقارب الساعة، كاملة</b>${tbl(MOT.q18.labels,g18('fc').rows)}</div><div><b>ج. مع عقارب الساعة، نصف</b>${tbl(MOT.q18.labels,g18('hc').rows)}</div><div><b>د. عكس عقارب الساعة، كاملة</b>${tbl(MOT.q18.labels,g18('fa').rows)}</div><div><b>هـ. عكس عقارب الساعة، نصف</b>${tbl(MOT.q18.labels,g18('ha').rows)}</div></div><p><b>و، ز.</b> كما في س ١-٧.</p>`)},
  {h:'س ١-٩: المحرك الهجين في الشكل (١-١٥)',ref:'ص 25',html:'<p>«للمحرك متدرج الحركة من النوع الهجين، المبين بالشكل (١-١٥)، أوجد: أ. خطوة المحرك. ب. الجدول المنطقي لحركة المحرك بخطوة كاملة ضد عقارب الساعة. ج. موجات الجهد الموصل بالمجموعات لحركة المحرك بخطوة كاملة ضد عقارب الساعة. د. أثبت أن الدوار متزن بالوضع المبين بالشكل. هـ. احسب قيمة العزم المتولد عند فصل المجموعة ١ وتغذية المجموعة ٢ بدلالة أقصى عزم.»</p>'},
  {fig:'(١-١٥)',ref:'ص 25',caption:'رسم مبسّط للمقطع: ثابت بأربعة أقطاب (Phase 1 رأسي: الأعلى S والأسفل N، وPhase 2 أفقي)، وثلاثة أسنان N في الطرف الأمامي (السن N للأعلى)، وأسنان S الثلاثة خلفها مزاحة (متقطعة)',draw:()=>box(`<svg viewBox="0 0 300 300" role="img" aria-label="الشكل ١-١٥">${section({cx:150,cy:150,s:1.18,th:0,poles:[0,90,180,270].map((a,i)=>({a,st:i===0?'S':i===2?'N':'',lbl:['Phase 1','Phase 2','',''][i],w:17})),rotor:{kind:'teeth',n:3,a0:0,tw:13,pol:'N',ghost:{n:3,a0:60,pol:'S'},nums:[[0,'N'],[120,'N'],[240,'N'],[60,'S',40],[180,'S',40],[300,'S',40]]}})}</svg>`,320)},
  {html:det('إجابة مقترحة لـ س ١-٩','',`<p><b>أ.</b> بنفس منطق الكتاب في الهجين (18° لخمسة أسنان في كل طرف): \\(P = 3 + 3 = 6\\) و \\(N = 2\\) ⇐ \\(\\theta = 360/(2\\times 6) = 30^\\circ\\). <b>(هذا يفترض عدّ أسنان الطرفين معًا؛ يقرر المدرب.)</b></p>
   <p><b>ب.</b> مثل الجدول (١-٥) بعد تسمية A = 1 و B = 2: <span class="ltr">1, 2, -1, -2, 1</span> (اتجاه الدوران الفعلي يتوقف على قطبية التوصيل في الشكل).</p>${tbl(['1','2'],genSeq(MOT.hy3,'fa').rows)}
   <p><b>ج.</b> موجات ثنائية القطبية مثل الشكل (١-٩): نبضة + على المجموعة 1 ثم + على 2 ثم − على 1 ثم − على 2.</p>
   <p><b>د.</b> في الوضع المرسوم يقابل السن الشمالي العلوي القطب الجنوبي (تجاذب على المحور تمامًا، زاوية 0 ⇐ جيب الزاوية = 0)، ويقابل السن الجنوبي السفلي القطب الشمالي كذلك. السنّان الآخران في كل طرف متماثلان حول المحور الرأسي (على ±120°)، فيتساوى عزماهما ويتعاكسان. المحصلة صفر ⇐ الدوار متزن.</p>
   <p><b>هـ.</b> بطريقة الكتاب في المعادلة (١-٢) (أسنان طرف واحد، الموجب ضد عقارب الساعة)، إذا غُذّيت المجموعة 2 بحيث يصير القطب الأيسر N والأيمن S: السن N عند 0° يبعد 90° عن القطب S (يشدّه مع عقارب الساعة: −sin 90°)، والسن عند 240° يبعد 30° عن القطب S (+sin 30°)، والسن عند 120° يبعد 30° عن القطب N المشابه (تنافر: +cos 30°):</p>
   $$T=T_m\\left[\\sin 30^\\circ-\\sin 90^\\circ+\\cos 30^\\circ\\right]=T_m\\left[0.5-1.0+0.866\\right]=0.366\\,T_m$$
   <p><b>هذا حل مقترح بتطبيق طريقة الكتاب على شكل منخفض الدقة؛ يقرر المدرب طريقة اختيار الحدود.</b></p>`)},
  {h:'تمرين ١-١٠: محرك الشكل (١-١٦)',ref:'ص 26',html:'<p>«محرك الخطوة المبين بالشكل (١-١٦)، من النوع ذي الممانعة المغناطيسية المتغيرة، العضو الثابت يحتوي على <b>ثلاث مجموعات</b> من الأقطاب، كل مجموعة بها قطبان، الدوار يحتوي على <b>أربعة أسنان</b>، المطلوب: (نفس البنود أ–ز).»</p>'},
  {fig:'(١-١٦)',ref:'ص 26',caption:'ثابت ذو 6 أقطاب وملفات (Phase 1 أعلى/أسفل، ثم 2 و 3) ودوار صليبي بأربعة أسنان — رسم مبسّط',draw:()=>box(motorSVG(MOT.f116,[1,0,0],0),340)},
  {html:det('إجابة مقترحة لـ تمرين ١-١٠','',`<p><b>أ.</b> \\(\\theta = 360/(3\\times 4) = 30^\\circ\\)، نصف الخطوة 15° — نفس محرك الشكل (١-٧).</p><p>لذلك الجداول هي (١-١)…(١-٤) بعد كتابة 1 و 2 و 3 بدل A و B و C (بافتراض أن ترتيب المجموعات في الشكل مثل الشكل ١-٧):</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px"><div><b>ب. مع عقارب الساعة، كاملة</b>${tbl(['1','2','3'],g110('fc').rows)}</div><div><b>ج. مع عقارب الساعة، نصف</b>${tbl(['1','2','3'],g110('hc').rows)}</div><div><b>د. عكس عقارب الساعة، كاملة</b>${tbl(['1','2','3'],g110('fa').rows)}</div><div><b>هـ. عكس عقارب الساعة، نصف</b>${tbl(['1','2','3'],g110('ha').rows)}</div></div><p><b>و، ز.</b> كما في س ١-٧.</p>`)}
 ],
 lab:(el)=>stepLab(el,{title:'مختبر مسائل الوحدة',ref:'محركات الأسئلة س ١-٧ (الشكل ١-١٤)، س ١-٨، س ١-٩ (الشكل ١-١٥)، تمرين ١-١٠ (الشكل ١-١٦) — الجداول مولَّدة (حلول مقترحة)',motors:['q17','q18','hy3','f116'],seqs:M=>['fa','fc','ha','hc'].map(k=>genSeq(M,k)),
  tries:['محرك الشكل (١-١٤): غذِّ A ثم B يدويًا وتابع السن رقم 2 والزاوية 15°.','س ١-٨: لاحظ مكان القطب B بالنسبة إلى A: لماذا ليس الجار المباشر؟','س ١-٩: كل خطوة 30° (بافتراض عدّ أسنان الطرفين).','استعمل الجداول والموجات هنا للإجابة عن البنود ب–و في كل سؤال.'],
  steps:[
   {t:'س ١-٧ — خطوة كاملة',x:'المحرك المختار هو الشكل (١-١٤). اضغط «خطوة» 4 مرات بالتسلسل «كاملة ⟲»: A, B, C, D وكل خطوة 15°.',done:w=>w.mk==='q17'&&(w.bySeq.gfa||0)>=4},
   {t:'س ١-٧ — نصف خطوة مع عقارب الساعة',x:'اختر «نصف ⟳»: هذا جواب البند (ج). انسخ الجدول وارسم موجاته.',done:w=>w.mk==='q17'&&(w.bySeq.ghc||0)>=2},
   {t:'س ١-٨',x:'اختر محرك «س ١-٨» وشغّل «كاملة ⟲» تلقائيًا: 20 خطوة لكل دورة (18°).',done:w=>w.mk==='q18'&&(w.bySeq.gfa||0)>=3},
   {t:'س ١-٩ — الهجين',x:'اختر «الشكل (١-١٥)» واضغط «خطوة»: 1, 2, -1, -2 وكل خطوة 30°.',done:w=>w.mk==='hy3'&&(w.bySeq.gfa||0)>=2},
   {t:'تمرين ١-١٠',x:'اختر «الشكل (١-١٦)»: هو نفس محرك الشكل (١-٧)، خطوته 30°.',done:w=>w.mk==='f116'&&w.steps>=1}
  ]}),
 examples:[
  thetaEx({title:'س ١-٧ (أ): خطوة محرك الشكل (١-١٤) — حل مقترح',ref:'ص 24',q:'<p>أربع مجموعات (N = 4) كل منها قطبان، ودوار بستة أسنان (P = 6).</p>',N:4,P:6,half:1,halfT:'نصف الخطوة'}),
  thetaEx({title:'س ١-٨ (أ): خطوة المحرك — حل مقترح',ref:'ص 25',q:'<p>خمس مجموعات (N = 5) كل منها قطبان، ودوار بأربعة أسنان (P = 4).</p>',N:5,P:4,half:1,halfT:'نصف الخطوة'}),
  thetaEx({title:'س ١-٩ (أ): خطوة المحرك الهجين للشكل (١-١٥) — حل مقترح',ref:'ص 25',q:'<p>مجموعتان على الثابت (N = 2)، وفي كل طرف من الدوار ثلاثة أسنان.</p>',N:2,P:6,nl:'عدد مجموعات الثابت',pl:'عدد أسنان الدوار في الطرفين معًا (3 + 3)',half:0,note:'<b>توضيح:</b> عددنا أسنان الطرفين معًا كما فعلنا ليعطي الكتاب 18° للهجين ذي الخمسة أسنان. يقرر المدرب طريقة العد.'}),
  thetaEx({title:'تمرين ١-١٠ (أ): خطوة محرك الشكل (١-١٦) — حل مقترح',ref:'ص 26',q:'<p>ثلاث مجموعات (N = 3) كل منها قطبان، ودوار بأربعة أسنان (P = 4).</p>',N:3,P:4,half:1,halfT:'نصف الخطوة'})
 ],
 quiz:[
  {q:'(اختبار ذاتي س١) في محركات الممانعة المتغيرة:',o:['يتركب الدوار من أسطوانة دائرية','يتركب الدوار من أسنان بارزة','توجد ملفات متغيرة على الدوار','توجد مغناطيسات على الثابت'],c:1,e:'(ص 8).'},
  {q:'(اختبار ذاتي س٢) في محركات الأقطاب الدائمة:',o:['أقطاب دائمة على الدوار','أقطاب دائمة على الثابت','أقطاب دائمة على الثابت والدوار','ملفات دائمة على الدوار'],c:0,e:'(ص 15).'},
  {q:'(اختبار ذاتي س٣) عدد مجموعات ثابت محرك الممانعة المتغيرة يجب أن يكون:',o:['مجموعتين فقط','ثلاث مجموعات فقط','أكثر من مجموعتين','أكثر من ثلاث مجموعات'],c:2,e:'ثلاث على الأقل (ص 11).'},
  {q:'(اختبار ذاتي س٥) الأقطاب المتجاورة في مجموعات الثابت:',o:['لها نفس القطبية','مختلفة في قطبيتها','كلها شمالية','بلا قطبية'],c:1,e:'(ص 9).'},
  {q:'ما خطوة محرك س ١-٧ (4 مجموعات، 6 أسنان)؟',o:['24°','15°','7.5°','60°'],c:1,e:'360 ÷ 24 = 15°.'},
  {q:'ما خطوة محرك س ١-٨ (5 مجموعات، 4 أسنان)؟',o:['18°','20°','9°','72°'],c:0,e:'360 ÷ 20 = 18°.'},
  {q:'محرك تمرين ١-١٠ (3 مجموعات، 4 أسنان) يشبه محرك أي شكل؟',o:['الشكل (١-٢)','الشكل (١-٧)','الشكل (١-٨)','الشكل (١-١١)'],c:1,e:'كلاهما 6 أقطاب و 4 أسنان ⇐ 30°.'},
  {q:'كيف نعكس اتجاه محرك ممانعة متغيرة يدور بالترتيب A, B, C, D؟',o:['A, B, C, D بجهد أعلى','A, D, C, B','A, C, B, D','A, A, B, B'],c:1,e:'عكس ترتيب التسلسل.'}
 ]
});

})(PLCBOOK);
