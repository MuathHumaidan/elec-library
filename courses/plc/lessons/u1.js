/* Unit 1 — تطبيقات خاصة بأساسيات التحكم المنطقي المبرمج (ص 1–31) */
(function(B){
const {S,W}=B;
const AR_NOTE='<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ';

/* =====================================================================
   Shared: hard-wired current-path renderer (series / parallel tree)
   node: leaf {l,nc,btn} | {s:[...]} series | {p:[...]} parallel
   ===================================================================== */
const CW=72,RH=50;
function sz(n){if(n.s){const k=n.s.map(sz);return {w:Math.max(...k.map(a=>a.w)),h:k.reduce((a,b)=>a+b.h,0)}}
  if(n.p){const k=n.p.map(sz);return {w:k.reduce((a,b)=>a+b.w,0),h:Math.max(...k.map(a=>a.h))}}return {w:1,h:1}}
function cond(n,act){if(n.s)return n.s.every(c=>cond(c,act));if(n.p)return n.p.some(c=>cond(c,act));const a=act(n.on||n.l);return n.nc?!a:!!a}
const WC=(live,flow)=>flow?'flow':live?'live':'';
function drawN(n,x,y,fin,path,act){
  if(n.s){let s='',f=fin,cy=y;n.s.forEach(c=>{const r=drawN(c,x,cy,f,path,act);s+=r.s;cy+=sz(c).h*RH;f=r.out});return {s,out:f}}
  if(n.p){let s='',px=x;const H=sz(n).h*RH;const ends=[];
    n.p.forEach(c=>{const cz=sz(c),cp=path&&cond(c,act);const r=drawN(c,px,y,fin,cp,act);s+=r.s;
      const cy=y+cz.h*RH;if(cy<y+H)s+=S.w(`M${px} ${cy}V${y+H}`,WC(r.out,cp));ends.push({x:px,out:r.out,cp});px+=cz.w*CW});
    for(let i=1;i<ends.length;i++){const rest=ends.slice(i);
      s+=S.w(`M${ends[i-1].x} ${y}H${ends[i].x}`,WC(fin,rest.some(e=>e.cp)))+S.w(`M${ends[i-1].x} ${y+H}H${ends[i].x}`,WC(rest.some(e=>e.out),rest.some(e=>e.cp)))+S.dot(ends[i].x,y)+S.dot(ends[i].x,y+H)}
    s+=S.dot(x,y)+S.dot(x,y+H);
    return {s,out:ends.some(e=>e.out)}}
  const a=act(n.on||n.l),closed=n.nc?!a:!!a,out=fin&&closed;
  return {s:S.vC(x,y,y+RH,{nc:n.nc,closed,inC:WC(fin,path),outC:WC(out,path),label:n.l,side:'right',btn:n.btn}),out};
}
function hwSVG(tree,act,coil){
  const z=sz(tree),X0=58,TOP=18,y0=TOP+14,y1=y0+z.h*RH,cy=y1+16,nY=cy+22+18;
  const Wd=Math.max(X0+z.w*CW+44,190),path=cond(tree,act);
  let s=S.w(`M22 ${TOP}H${Wd-12}`,'live')+S.t(12,TOP+4,'L1','','end')+S.dot(X0,TOP)+S.w(`M${X0} ${TOP}V${y0}`,WC(1,path));
  const r=drawN(tree,X0,y0,1,path,act);s+=r.s;
  s+=S.w(`M${X0} ${y1}V${cy}`,WC(r.out,path))+S.coil(X0,cy,coil.l,r.out,coil.kind==='lamp'?'lamp':'')+S.w(`M${X0} ${cy+22}V${nY}`,'')+S.dot(X0,nY);
  s+=S.w(`M22 ${nY}H${Wd-12}`,'')+S.t(12,nY+4,'N','','end');
  return {svg:`<svg viewBox="0 0 ${Wd} ${nY+12}" role="img" aria-label="مخطط مسار التيار">${s}</svg>`,w:Wd,on:r.out};
}
const hwBox=(tree,act,coil,scale)=>{const h=hwSVG(tree,act,coil);return `<div class="svgbox" style="max-width:${Math.round(h.w*(scale||1.25))}px;margin-inline:auto">${h.svg}</div>`};
const L_=(l,nc)=>({l,nc:nc?1:0,btn:1});

/* ---------- loads ---------- */
function loadSVG(load,on){
  if(load.kind==='motor')return `<div style="display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap">${W.motor('u1rotor',150)}<div class="nameplate">${load.l==='M'?'M':load.l+' → M'}<br>${on?'يدور':'متوقف'}</div></div>`;
  if(load.kind==='relay'){const c=on?'var(--on)':'var(--fg)';
    return `<div class="svgbox" style="max-width:230px;margin-inline:auto"><svg viewBox="0 0 220 150" role="img" aria-label="متمم">
     <rect x="20" y="14" width="180" height="122" rx="10" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>
     <rect x="44" y="76" width="56" height="34" rx="4" class="coil ${on?'on':''}"/>${S.t(72,98,load.l)}
     <path class="mech" d="M100 93H150"/>
     <path d="M150 ${on?44:34}L150 ${on?60:70}" stroke="${c}" stroke-width="3"/>
     <path d="M130 ${on?44:30}H170" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
     <circle cx="132" cy="48" r="4" fill="var(--fg)"/><circle cx="168" cy="48" r="4" fill="var(--fg)"/>
     <text class="txt ar" x="110" y="130" text-anchor="middle" font-size="12">${on?'الملف متغذٍّ والتلامسات مغلقة':'الملف غير متغذٍّ'}</text></svg></div>`}
  const n=load.kind==='lamps'?3:1,xs=n===3?[50,110,170]:[110];
  return `<div class="svgbox" style="max-width:${n===3?260:170}px;margin-inline:auto"><svg viewBox="${n===3?'0 0 220 120':'50 0 120 120'}" role="img" aria-label="لمبة">
    ${n===3?S.w('M20 20H200',on?'live':'')+xs.map(x=>S.w(`M${x} 20V40`,on?'live':'')).join(''):S.w('M110 8V40',on?'live':'')}
    ${xs.map(x=>W.lamp(x,58,17,on,'#ffcc33')+`<path d="M${x-8} 50l16 16M${x+8} 50l-16 16" stroke="var(--fg)" stroke-width="1.5" opacity=".55"/>`).join('')}
    ${S.t(n===3?92:110,108,load.l,'',n===3?'end':'middle')}${n===3?'<text class="txt ar" x="100" y="108" text-anchor="start" font-size="12">(مجموعة)</text>':''}</svg></div>`;
}

/* ---------- static tables & program figures ---------- */
const bookTable=(rows,h1,h2)=>`<div class="tablebox" style="max-width:360px"><table class="tt"><thead><tr><th>${h1||'الرمز'}</th><th>${h2||'العنوان'}</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="mono">${r[0]}</td><td class="mono">${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
const namesOf=io=>{const o={};(io||[]).forEach(r=>{if(r.addr)o[r.addr.replace(/\s+/g,'')]=r.sym});return o};
function progFig(program,view,io){const P=B.createPLC(program);const names=namesOf(io);
  return P.nets.map(n=>`<div class="net static"><header><h3>${n.title||'Network 1'}</h3>${n.ref?`<span class="ref">${n.ref}</span>`:''}</header>${view==='stl'?B.stlTable(n,{trace:[],get:()=>0}):`<div class="svgbox fixed">${(view==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,names)}</div>`}</div>`).join('')}

/* =====================================================================
   Circuit plant: hard-wired circuit + load + live LAD/FBD/STL in the lab
   ===================================================================== */
function circuitPlant(getC){
  return {title:'الدائرة التقليدية والحمل وبرنامج الـ PLC',
    init:()=>({view:'lad',n:0,ang:0}),
    step(dt,st,p){const c=getC(st);const on=st.Q(c.load.addr);p.n+=((on?1:0)-p.n)*(1-Math.exp(-dt/0.45));if(p.n<0.003)p.n=0;p.ang=(p.ang+p.n*dt*420)%360},
    sig:p=>p.view,
    label:(p,s)=>getC(s).label,
    readouts:[
      {l:'الدائرة التقليدية',chip:(p,s)=>{const c=getC(s);return cond(c.tree,nm=>s.btn(nm))?[c.coil.l+' متغذٍّ','run']:[c.coil.l+' غير متغذٍّ','']}},
      {l:'خرج الـ PLC',chip:(p,s)=>{const c=getC(s);return s.Q(c.load.addr)?[c.load.addr+' = 1','run']:[c.load.addr+' = 0','']}}],
    render(el,st,p,B){const c=getC(st),act=nm=>st.btn(nm),hon=cond(c.tree,act),qon=st.Q(c.load.addr),P=st.plc,names=namesOf(c.io);
      const nets=P.nets.map(n=>`<div class="net"><header><h3>${n.title||'Network 1'}</h3>${n.ref?`<span class="ref">${n.ref}</span>`:''}</header>${n.read?`<p class="read-as">${n.read}</p>`:''}${p.view==='stl'?B.stlTable(n,P):`<div class="svgbox fixed">${(p.view==='lad'?B.ladNetwork:B.fbdNetwork)(n,P,names)}</div>`}</div>`).join('');
      const match=hon===!!qon?`<p class="sub">الدائرة التقليدية وبرنامج الـ PLC متطابقان الآن: الحمل ${qon?'<b>يعمل</b>':'<b>متوقف</b>'} في الاثنين.</p>`:
        `<div class="callout err">غير متطابقين: الدائرة التقليدية تقول إن ${c.coil.l} ${hon?'يعمل':'متوقف'}، لكن برنامج الـ PLC يجعل ${c.load.addr} = ${qon}.</div>`;
      el.innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;align-items:start">
        <div><h3 class="sm">مخطط مسار التيار <small class="sub">${c.ctrlRef||''}</small></h3><p class="sub">البرتقالي = وصل الجهد، المتقطع المتحرك = يمر تيار إلى الحمل.</p>${hwBox(c.tree,act,c.coil,1.15)}</div>
        <div><h3 class="sm">الحمل: ${c.load.name} — <span class="mono">${c.load.addr}</span></h3>${loadSVG(c.load,qon)}${match}</div></div>
        <div class="viewseg" style="margin-top:14px"><h3 class="sm">البرنامج داخل الـ PLC (يتلوّن مع الضغط)</h3><div class="seg" role="group"><button data-pv="lad" aria-pressed="${p.view==='lad'}">LAD</button><button data-pv="fbd" aria-pressed="${p.view==='fbd'}">FBD</button><button data-pv="stl" aria-pressed="${p.view==='stl'}">STL</button></div></div>${nets}`;
      el.querySelectorAll('[data-pv]').forEach(b=>b.onclick=()=>{p.view=b.dataset.pv});
    },
    frame(el,st,p){const r=el&&el.querySelector('#u1rotor');if(r)r.setAttribute('transform',`rotate(${p.ang.toFixed(1)} 75 75)`)}
  };
}
/* build a circuit lesson: one circuit → plain lesson; several → «variants» used as circuit selector */
function circuitLesson(L,circs,def,vnote){
  const keys=Object.keys(circs);const cur=s=>circs[(s&&s.variant)||L._variant||def];
  if(keys.length===1){const c=circs[keys[0]];L.io=c.io;L.inputs=c.inputs;L.program=c.program}
  else{L.variants={default:def,title:'الدائرة:',note:vnote||'اختر الدائرة. الضواغط في الشريط العلوي تتغير مع الدائرة.'};
    keys.forEach(k=>{L.variants[k]={label:circs[k].label,program:circs[k].program,note:circs[k].vnote}});
    Object.defineProperty(L,'io',{get(){return circs[L._variant||def].io},enumerable:true,configurable:true});
    Object.defineProperty(L,'inputs',{get(){return circs[L._variant||def].inputs},enumerable:true,configurable:true});
    Object.defineProperty(L,'_names',{get(){return namesOf(circs[L._variant||def].io)},set(){},configurable:true});}
  L.plant=circuitPlant(cur);
  L.plcNote=L.plcNote||'في كتاب الوحدة تصل للـ PLC إشارة <b>1</b> عند الضغط على أي ضاغط (حتى ضاغط الفصل)، لذلك يُكتب ضاغط الفصل في البرنامج تلامساً مغلقاً ( AN / ‎-|/|-‎ ). كل دوائر الوحدة بلا تعويض ذاتي: الحمل يعمل ما دام شرط التشغيل متحققاً فقط.';
  B.lesson(L);return cur;
}
const TG=(id,addr,label)=>({id,addr,type:'toggle',label});
const SW_NOTE='المفاتيح في الشريط العلوي تبقى على وضعها حتى تنقرها ثانية، حتى تستطيع ضغط أكثر من مفتاح معاً.';

/* =====================================================================
   Circuits of chapter 2 (data taken from the book's study + coding tables)
   ===================================================================== */
const TREE={
  ex1:{s:[L_('S1')]},
  ex2:{s:[L_('S0',1),{p:[L_('S1'),L_('S2')]}]},
  A:{s:[{p:[L_('S1'),L_('S2')]},L_('S3',1),{p:[L_('S4'),L_('S5')]}]},
  Bk:{s:[L_('S1',1),{p:[{s:[L_('S2'),L_('S5'),L_('S6',1)]},{s:[{p:[L_('S3'),L_('S4')]},L_('S7',1)]}]}]},
  Ck:{s:[L_('N.C1',1),{p:[L_('N.O1'),{s:[{p:[L_('N.O2'),L_('N.O3')]},L_('N.C2',1)]}]}]},
  F2:{s:[{p:[{s:[L_('S1'),L_('S2')]},{s:[{p:[L_('S3',1),L_('S5')]},L_('S4')]}]},L_('S6',1)]},
  S1:{s:[L_('S1'),L_('S2',1)]}
};
const STL={
  ex1:['A I 0.0','= Q 4.5'],
  ex2:['AN I 0.0','A(','O I 0.1','O I 0.2',')','= Q 4.5'],
  A_lad:['A(','O I 0.1','O I 0.2',')','AN I 0.3','A(','O I 0.4','O I 0.5',')','= Q 4.5'],
  B_lad:['AN I 1.1','A(','A(','O I 1.3','O I 1.4',')','AN I 1.7','O','A I 1.2','A I 1.5','AN I 1.6',')','= Q 4.5'],
  C_lad:['AN I 1.1','A(','A(','O I 1.2','O I 1.3',')','AN I 1.5','O I 1.4',')','= Q 4.5'],
  F2:['A(','A(','ON I 3.3','O I 3.5',')','A I 3.4','O','A I 3.1','A I 3.2',')','AN I 3.6','= Q 5.2'],
  A_fbd_draw:['A(','O I 2.1','O I 2.2',')','AN I 2.3','A(','O I 2.4','O I 2.5',')','= Q 2.6'],
  B_fbd_draw:['AN I 3.1','A(','A(','O I 3.3','O I 3.4',')','AN I 3.7','O','A I 3.2','A I 3.5','AN I 3.6',')','= Q 4.1'],
  C_fbd_draw:['AN I 4.0','A(','A(','O I 4.3','O I 4.2',')','AN I 4.5','O I 4.1',')','= Q 4.1'],
  C_fbd_book:['AN I 1.1','A(','A(','O I 1.3','O I 1.2',')','AN I 1.5','O I 1.4',')','= Q 4.5'],
  S_ex1:['A I 2.4','AN I 2.5','= Q 4.1'],
  S_A:['A(','O I 1.1','O I 1.2',')','AN I 1.3','A(','O I 1.4','O I 1.5',')','= Q 2.5'],
  S_B:['AN I 0.1','A(','A(','O I 0.4','O I 0.3',')','AN I 0.7','O','A I 0.2','A I 0.5','AN I 0.6',')','= Q 4.4'],
  S_C:['AN I 0.1','A(','A(','O I 0.4','O I 0.3',')','AN I 0.7','O I 0.2',')','= Q 4.4']
};
/* io rows */
const io=(rows)=>rows.map(r=>({sym:r[0],desc:r[2],addr:r[1]}));
const D={on:'ضاغط تشغيل (مفتوح N.O.)',off:'ضاغط فصل (مغلق N.C.)'};

/* ---------------- circuit objects ---------------- */
const C={};
C.ex1={label:'مثال 1',tree:TREE.ex1,coil:{l:'H1',kind:'lamp'},load:{l:'H1',kind:'lamp',addr:'Q4.5',name:'اللمبة H1'},ctrlRef:'الشكل (1-2) ص 9',
  io:io([['S1','I0.0','المفتاح (الضاغط) S1 — تشغيل اللمبة'],['H1','Q4.5','الحمل: اللمبة H1']]),
  inputs:[{id:'S1',addr:'I0.0',type:'push',color:'green',label:'تشغيل'}],
  program:[{title:'Network 1 — تشغيل اللمبة H1',ref:'الشكل (2-2) ص 10',read:'اللمبة H1 (Q4.5) تضيء <b>ما دام</b> S1 (I0.0) مضغوطاً.',stl:STL.ex1}]};
C.ex2={label:'مثال 2',tree:TREE.ex2,coil:{l:'H1',kind:'lamp'},load:{l:'H1',kind:'lamps',addr:'Q4.5',name:'مجموعة الإضاءة H1'},ctrlRef:'الشكل (3-2) ص 10',
  io:io([['S0','I0.0','ضاغط الفصل (مغلق N.C.)'],['S1','I0.1','ضاغط التشغيل الأول'],['S2','I0.2','ضاغط التشغيل الثاني'],['H1','Q4.5','مجموعة الإضاءة (الحمل)']]),
  inputs:[TG('S0','I0.0','فصل N.C.'),TG('S1','I0.1','تشغيل 1'),TG('S2','I0.2','تشغيل 2')],
  program:[{title:'Network 1 — مجموعة الإضاءة H1',ref:'ص 12',read:'H1 تعمل إذا: S0 <b>غير</b> مضغوط <b>و</b> (S1 <b>أو</b> S2 مضغوط).',stl:STL.ex2}]};
C.A={label:'تمرين أ',tree:TREE.A,coil:{l:'H7',kind:'lamp'},load:{l:'H7',kind:'lamps',addr:'Q4.5',name:'مجموعة الإضاءة H7'},ctrlRef:'ص 12',
  io:io([['S1','I0.1',D.on],['S2','I0.2',D.on],['S4','I0.4',D.on],['S5','I0.5',D.on],['S3','I0.3',D.off],['H7','Q4.5','مجموعة الإضاءة H7']]),
  inputs:[TG('S1','I0.1','تشغيل'),TG('S2','I0.2','تشغيل'),TG('S3','I0.3','فصل N.C.'),TG('S4','I0.4','تشغيل'),TG('S5','I0.5','تشغيل')],
  program:[{title:'Network 1 — مجموعة الإضاءة H7',ref:'ص 13',read:'H7 تعمل إذا: (S1 <b>أو</b> S2) <b>و</b> S3 غير مضغوط <b>و</b> (S4 <b>أو</b> S5).',stl:STL.A_lad}]};
C.B={label:'تمرين ب',tree:TREE.Bk,coil:{l:'K10'},load:{l:'K10',kind:'relay',addr:'Q4.5',name:'المتمم K10'},ctrlRef:'ص 14',
  io:io([['S1','I1.1','فصل رئيس (N.C.)'],['S2','I1.2','تشغيل (توالي مع S5)'],['S5','I1.5','تشغيل (توالي مع S2)'],['S3','I1.3','تشغيل منفصل'],['S4','I1.4','تشغيل منفصل'],['S6','I1.6','فصل مجموعة التوالي S2·S5 (N.C.)'],['S7','I1.7','فصل مجموعة S3/S4 (N.C.)'],['K10','Q4.5','ملف المتمم K10']]),
  inputs:[TG('S1','I1.1','فصل رئيس'),TG('S2','I1.2','توالي'),TG('S5','I1.5','توالي'),TG('S6','I1.6','فصل التوالي'),TG('S3','I1.3','تشغيل'),TG('S4','I1.4','تشغيل'),TG('S7','I1.7','فصل S3/S4')],
  program:[{title:'Network 1 — المتمم K10',ref:'ص 15',read:'K10 يعمل إذا: S1 غير مضغوط <b>و</b> [ ((S3 <b>أو</b> S4) <b>و</b> S7 غير مضغوط) <b>أو</b> (S2 <b>و</b> S5 <b>و</b> S6 غير مضغوط) ].',stl:STL.B_lad}]};
C.C={label:'تمرين ج',tree:TREE.Ck,coil:{l:'K5'},load:{l:'K5',kind:'motor',addr:'Q4.5',name:'المحرك (ملف K5)'},ctrlRef:'ص 15',
  io:io([['N.O1','I1.4','مفتاح تشغيل (منفرد)'],['N.O2','I1.2','مفتاح تشغيل (مجموعة التوازي)'],['N.O3','I1.3','مفتاح تشغيل (مجموعة التوازي)'],['N.C1','I1.1','فصل لجميع نقاط التشغيل'],['N.C2','I1.5','فصل لنقاط تشغيل التوازي'],['K5','Q4.5','ملف تشغيل المحرك']]),
  inputs:[TG('N.C1','I1.1','فصل الكل'),TG('N.O1','I1.4','تشغيل'),TG('N.O2','I1.2','تشغيل'),TG('N.O3','I1.3','تشغيل'),TG('N.C2','I1.5','فصل التوازي')],
  program:[{title:'Network 1 — المحرك K5',ref:'ص 16',read:'K5 يعمل إذا: N.C1 غير مضغوط <b>و</b> [ ((N.O2 <b>أو</b> N.O3) <b>و</b> N.C2 غير مضغوط) <b>أو</b> N.O1 ].',stl:STL.C_lad}]};
/* FBD lesson circuits */
C.F1=Object.assign({},C.ex2,{label:'مثال 1 (الشكل 5-2)',ctrlRef:'الشكل (5-2) ص 18',program:[{title:'Network 1 — مجموعة الإضاءة H1',ref:'ص 19',read:'بوابة OR تجمع S1 و S2، ثم بوابة AND مع عكس S0 (الدائرة الصغيرة)، والنتيجة إلى Q4.5.',stl:STL.ex2}]});
C.F2={label:'مثال 2 (الشكل 6-2)',tree:TREE.F2,coil:{l:'K10'},load:{l:'K10',kind:'relay',addr:'Q5.2',name:'المتمم K10'},ctrlRef:'الشكل (6-2) ص 19',
  io:io([['S1','I3.1','تشغيل (توالي مع S2) — مستنتج'],['S2','I3.2','تشغيل (توالي مع S1) — مستنتج'],['S3','I3.3','تلامس مغلق N.C. موازٍ لـ S5 — مستنتج'],['S5','I3.5','تشغيل — مستنتج'],['S4','I3.4','تشغيل (توالي) — مستنتج'],['S6','I3.6','فصل N.C. — مستنتج'],['K10','Q5.2','ملف المتمم K10 — مستنتج']]),
  inputs:[TG('S1','I3.1','توالي'),TG('S2','I3.2','توالي'),TG('S3','I3.3','N.C.'),TG('S5','I3.5','تشغيل'),TG('S4','I3.4','تشغيل'),TG('S6','I3.6','فصل N.C.')],
  program:[{title:'Network 1 — المتمم K10',ref:'ص 20',read:'K10 يعمل إذا: [ ((S3 غير مضغوط <b>أو</b> S5) <b>و</b> S4) <b>أو</b> (S1 <b>و</b> S2) ] <b>و</b> S6 غير مضغوط.',stl:STL.F2}]};
C.FA=Object.assign({},C.A,{ctrlRef:'ص 20',program:[{title:'Network 1 — مجموعة الإضاءة H7',ref:'ص 21 (بعناوين جدول الترميز)',read:'بوابتا OR: (S1 أو S2) و (S4 أو S5)، ثم بوابة AND بثلاثة مداخل أوسطها عكس S3.',stl:STL.A_lad}]});
C.FB=Object.assign({},C.B,{ctrlRef:'ص 22',program:[{title:'Network 1 — المتمم K10',ref:'ص 23 (بعناوين جدول الترميز)',read:'[ (S3 أو S4) و ليس S7 ] أو [ S2 و S5 و ليس S6 ]، ثم AND مع ليس S1.',stl:STL.B_lad}]});
const IO_CB=io([['S1','I1.1','فصل في أي حالة تشغيل (N.C.)'],['S2','I1.2','تشغيل توالي مع S5'],['S5','I1.5','تشغيل توالي مع S2'],['S3','I1.3','تشغيل'],['S4','I1.4','تشغيل'],['S6','I1.6','فصل مفتاحي التوالي (N.C.)'],['S7','I1.7','فصل S3/S4 (N.C.)'],['M','Q4.5','المحرك (ملف K10)']]);
C.FCb={label:'تمرين ج — كما في الكتاب',tree:TREE.Bk,coil:{l:'K10'},load:{l:'M',kind:'motor',addr:'Q4.5',name:'المحرك M'},ctrlRef:'ص 23 (الدائرة المرسومة)',io:IO_CB,inputs:C.B.inputs,
  program:[{title:'Network 1 — حل الكتاب (FBD ص 24) بعناوين جدول الدراسة',ref:'ص 24',read:'حل الكتاب: ليس I1.1 <b>و</b> [ ((I1.3 أو I1.2) و ليس I1.5) <b>أو</b> I1.4 ]. هذا منطق دائرة N.O/N.C وليس الدائرة المرسومة.',stl:STL.C_fbd_book}],
  vnote:'<b>كما في الكتاب (ص 23–24):</b> العنوان والدائرة المرسومة لدائرة S1…S7، أما الدراسة والترميز والحل FBD فلدائرة أخرى (N.O/N.C من تمرين LAD ج). وصّلنا مفاتيح الدائرة المرسومة على عناوين جدول التمرين (ب) لأنها الدائرة نفسها، وشغّلنا حل الكتاب بعناوين جدول الدراسة. جرّب S2 وحده ثم S2 مع S5 ثم S6 و S7 لترى الاختلاف.'};
C.FCf={label:'تمرين ج — المصحح',tree:TREE.Bk,coil:{l:'K10'},load:{l:'M',kind:'motor',addr:'Q4.5',name:'المحرك M'},ctrlRef:'ص 23 (الدائرة المرسومة)',io:IO_CB,inputs:C.B.inputs,
  program:[{title:'Network 1 — الحل المصحح للدائرة المرسومة',ref:'تصحيح (ليس من الكتاب)',read:'ليس S1 <b>و</b> [ ((S3 أو S4) و ليس S7) <b>أو</b> (S2 و S5 و ليس S6) ] — مطابق لحل التمرين (ب).',stl:STL.B_lad}],
  vnote:'<b>المصحح:</b> حل FBD للدائرة المرسومة في عنوان التمرين نفسه (S1 فصل للكل، S6 لمفتاحي التوالي، S7 لـ S3 أو S4)، بعناوين جدول التمرين (ب): I1.1…I1.7 والمحرك Q4.5.'};
/* STL lesson circuits */
C.Sx={label:'مثال 1 (الشكل 7-2)',tree:TREE.S1,coil:{l:'H1',kind:'lamp'},load:{l:'H1',kind:'lamps',addr:'Q4.1',name:'مجموعة الإضاءة H1'},ctrlRef:'الشكل (7-2) ص 25',
  io:io([['S1','I2.4','مفتاح التشغيل'],['S2','I2.5','مفتاح الفصل (N.C.)'],['H1','Q4.1','مجموعة الإضاءة']]),
  inputs:[TG('S1','I2.4','تشغيل'),TG('S2','I2.5','فصل N.C.')],
  program:[{title:'Network 1 — مجموعة الإضاءة H1',ref:'ص 26',read:'A I 2.4 (S1 مضغوط) <b>و</b> AN I 2.5 (S2 غير مضغوط) ← = Q 4.1.',stl:STL.S_ex1}]};
C.SA={label:'تمرين أ',tree:TREE.A,coil:{l:'H7',kind:'lamp'},load:{l:'H7',kind:'lamps',addr:'Q2.5',name:'مجموعة الإضاءة H7'},ctrlRef:'ص 26',
  io:io([['S1','I1.1',D.on],['S2','I1.2',D.on],['S4','I1.4',D.on],['S5','I1.5',D.on],['S3','I1.3',D.off],['H7','Q2.5','مجموعة الإضاءة H7']]),
  inputs:[TG('S1','I1.1','تشغيل'),TG('S2','I1.2','تشغيل'),TG('S3','I1.3','فصل N.C.'),TG('S4','I1.4','تشغيل'),TG('S5','I1.5','تشغيل')],
  program:[{title:'Network 1 — مجموعة الإضاءة H7',ref:'ص 27',read:'قوس أول (S1 أو S2) <b>و</b> ليس S3 <b>و</b> قوس ثانٍ (S4 أو S5).',stl:STL.S_A}]};
C.SB={label:'تمرين ب',tree:TREE.Bk,coil:{l:'K10'},load:{l:'K10',kind:'relay',addr:'Q4.4',name:'المتمم K10'},ctrlRef:'ص 28',
  io:io([['S1','I0.1','فصل رئيس (N.C.)'],['S2','I0.2','تشغيل (توالي مع S5)'],['S5','I0.5','تشغيل (توالي مع S2)'],['S3','I0.3','تشغيل منفصل'],['S4','I0.4','تشغيل منفصل'],['S6','I0.6','فصل مجموعة التوالي (N.C.)'],['S7','I0.7','فصل مجموعة S3/S4 (N.C.)'],['K10','Q4.4','ملف المتمم K10']]),
  inputs:[TG('S1','I0.1','فصل رئيس'),TG('S2','I0.2','توالي'),TG('S5','I0.5','توالي'),TG('S6','I0.6','فصل التوالي'),TG('S3','I0.3','تشغيل'),TG('S4','I0.4','تشغيل'),TG('S7','I0.7','فصل S3/S4')],
  program:[{title:'Network 1 — المتمم K10',ref:'ص 29',read:'ليس S1 <b>و</b> [ ((S4 أو S3) و ليس S7) <b>O</b> (S2 و S5 و ليس S6) ]. السطر O وحده يفصل مجموعتي التوالي.',stl:STL.S_B}]};
C.SC={label:'تمرين ج',tree:TREE.Ck,coil:{l:'K5'},load:{l:'K5',kind:'motor',addr:'Q4.4',name:'المحرك K5'},ctrlRef:'ص 30',
  io:io([['N.O1','I0.2','مفتاح تشغيل (منفرد)'],['N.O2','I0.4','مفتاح تشغيل'],['N.O3','I0.3','مفتاح تشغيل'],['N.C1','I0.1','فصل الكل'],['N.C2','I0.7','فصل نقاط التوازي'],['K5','Q4.4','ملف المحرك K5']]),
  inputs:[TG('N.C1','I0.1','فصل الكل'),TG('N.O1','I0.2','تشغيل'),TG('N.O2','I0.4','تشغيل'),TG('N.O3','I0.3','تشغيل'),TG('N.C2','I0.7','فصل التوازي')],
  program:[{title:'Network 1 — المحرك K5',ref:'ص 31',read:'ليس N.C1 <b>و</b> [ ((N.O2 أو N.O3) و ليس N.C2) <b>أو</b> N.O1 ].',stl:STL.S_C}]};
B.U1={C,TREE,STL,cond,hwSVG};

/* =====================================================================
   Lesson 1.1 — PLC definition and hardware (ص 1–4)
   ===================================================================== */
const INFO={
  pc:{t:'وحدة البرمجة',r:'ص 2–3، البندان (أ) و (ج)',h:`<p>«وهي الحاسب الآلي وهو عبارة عن جهاز كمبيوتر عادي متوافق مع كمبيوتر (IBM). لا يشترط فيه أي مواصفات خاصة. يثبت عليه نظام التشغيل العادي (Windows95 أو 98).»</p><p>وفي البند (ج): «هناك وحدات ثابتة ووحدات متنقلة: 1- يستخدم الحاسب الآلي كوحدة برمجة ثابتة في غرفة التحكم. 2- وحدة التحكم المتنقلة وهي وحدة صغيرة يتم نقلها إلى وحدات المعالجة المركزية، وتستخدم لغة (قائمة الإجراءات – STL).»</p>`},
  cpu:{t:'وحدة المعالجة المركزية (CPU)',r:'ص 2، البند (ب)',h:`<p>«العنصر الأساسي المسؤول عن تنفيذ البرنامج. ولكل وحدة معالجة مواصفات تختلف في سرعتها في تنفيذ العمليات وسعة ذاكرتها من نوع إلى آخر، ومن شركة مصنعة إلى أخرى.»</p><p>مثال الكتاب: CPU313 تعالج <span class="ltr">12KB</span> خلال <span class="ltr">0.6ms</span>، و CPU314 تعالج <span class="ltr">24KB</span> خلال <span class="ltr">0.3ms</span>. وحدة الذاكرة يُخزَّن فيها برنامج التحكم، «ولا يمكن تخزين أكثر من برنامج واحد على وحدة المعالجة المركزية».</p>`},
  in:{t:'وحدة الدخل (Input module)',r:'ص 2–3، البند (ت)',h:`<p>«وهي التي تستقبل إشارات الدخل من النظام المراد التحكم فيه وتقوم بنقلها إلى وحدة المعالجة.»</p><p>تختلف مواصفاتها من حيث: النوع (رقمية Digital أو تماثلية Analog)، عدد النقاط (8 أو 16)، الجهد (مستمر أو متردد)، وقيمة الجهد المغذي (<span class="ltr">24V</span> أو <span class="ltr">120V</span> أو <span class="ltr">240V</span>...).</p>`},
  out:{t:'وحدة الخرج (Output module)',r:'ص 3، البند (ث)',h:`<p>«وهي التي تستقبل نتيجة العمليات التي تمت في وحدة (CPU) وتنقل الإشارات الناتجة من تنفيذ البرنامج.»</p><p>تختلف مواصفاتها من حيث: النوع، عدد النقاط (8 أو 16)، الجهد (مستمر أو متردد)، قيمة جهد الحمل (<span class="ltr">24V / 120V / 240V</span>)، والتيار الذي تتحمله في تغذية الحمل (<span class="ltr">10mA</span> أو <span class="ltr">1A</span> أو <span class="ltr">2A</span> أو <span class="ltr">10A</span>...).</p>`},
  psu:{t:'وحدة مصدر القدرة (Power Supply)',r:'ص 3، البند (ح)',h:`<p>«تغذي هذه الوحدة وحدات الدخل والخرج ووحدة المعالجة المركزية بالقدرة المطلوبة حيث توصل هذه الوحدة بجهد متردد (220 فولت متردد) ثم يحول هذا الجهد إلى جهد منخفض (24 فولت مستمر).»</p>`},
  sys:{t:'النظام المراد التحكم فيه',r:'الشكل (1-1) ص 4',h:`<p>«الشكل (1-1) يوضح عملية الربط بين جهاز الحاسب ووحدة المعالجة المركزية ووحدات الدخل والخرج والنظام المراد التحكم فيه. وهو التحكم المنطقي المبرمج.»</p><p>النظام يرسل إشاراته (مثل الضاغط S1) إلى وحدة الدخل، ويستقبل من وحدة الخرج أوامر التشغيل (مثل اللمبة H1).</p>`}
};
function arrow(x1,y1,x2,y2,cls){const a=Math.atan2(y2-y1,x2-x1),h=8;const p1=[x2-h*Math.cos(a-0.45),y2-h*Math.sin(a-0.45)],p2=[x2-h*Math.cos(a+0.45),y2-h*Math.sin(a+0.45)];
  return S.w(`M${x1} ${y1}L${x2} ${y2}`,cls)+`<path d="M${x2} ${y2}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" fill="${cls?'var(--live)':'var(--wire)'}"/>`}
function plcDiagram(z){ // z:{psu,run,s1,inMod,pii,rlo,piq,outMod,phase,sel,slow}
  const box=(k,x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="fbox" ${z.sel===k?'style="stroke:var(--blue);stroke-width:3"':''}/>`;
  const ar=(x,y,t,fs,c)=>`<text class="txt ar" x="${x}" y="${y}" text-anchor="middle" font-size="${fs||13}" ${c?`fill="${c}"`:''}>${t}</text>`;
  const led=(x,y,v,l)=>`<circle cx="${x}" cy="${y}" r="8" fill="${v?'var(--on)':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(x+14,y+4,l,'','start');
  const pw=z.psu?'live':'';
  let s=`<svg viewBox="0 0 660 480" role="img" aria-label="مخطط الحاكم المنطقي المبرمج">`;
  s+=`<rect x="12" y="8" width="636" height="318" rx="44" fill="none" stroke="var(--muted)" stroke-dasharray="6 5" stroke-width="1.6"/>`+S.t(44,36,'PLC','b','start',16);
  // power feeds
  s+=S.w('M330 256V232',pw)+S.w('M245 282H150V216',pw)+S.w('M415 282H510V216',pw);
  // programming unit
  s+=`<g data-k="pc" style="cursor:pointer">${box('pc',250,20,160,60)}${ar(330,45,'وحدة البرمجة',14)}${ar(330,66,'(الحاسب الآلي)',11,'var(--muted)')}</g>`;
  s+=arrow(330,80,330,110,'');
  // CPU
  const rowY=[154,178,202];
  s+=`<g data-k="cpu" style="cursor:pointer">${box('cpu',232,112,196,120)}${ar(330,131,'وحدة المعالجة المركزية (CPU)',12.5)}`;
  if(z.phase>=0)s+=`<rect x="238" y="${rowY[z.phase]-13}" width="184" height="19" rx="4" fill="var(--blue-soft)"/>`;
  s+=S.t(244,rowY[0],'1 READ  I0.0='+z.pii,'','start',11.5)+S.t(244,rowY[1],'2 A I0.0 → RLO='+z.rlo,'','start',11.5)+S.t(244,rowY[2],'3 WRITE Q4.5='+z.piq,'','start',11.5);
  s+=S.t(330,224,z.psu?(z.run?'RUN':'STOP'):'OFF',z.run&&z.psu?'b':'m','middle',11)+'</g>';
  // input module (right) & output module (left)
  s+=`<g data-k="in" style="cursor:pointer">${box('in',466,128,166,88)}${ar(549,150,'وحدة الدخل',14)}${led(500,184,z.inMod,'I0.0')}${S.t(549,208,'Input module','m')}</g>`;
  s+=`<g data-k="out" style="cursor:pointer">${box('out',28,128,166,88)}${ar(111,150,'وحدة الخرج',14)}${led(62,184,z.outMod,'Q4.5')}${S.t(111,208,'Output module','m')}</g>`;
  s+=arrow(466,172,430,172,z.inMod?(z.phase===0?'flow':'live'):'')+arrow(232,172,196,172,z.piq?(z.phase===2?'flow':'live'):'');
  // power supply
  s+=`<g data-k="psu" style="cursor:pointer">${box('psu',245,256,170,54)}${ar(330,278,'مصدر القدرة',13.5)}${S.t(330,298,'220V~ → 24V=',z.psu?'b':'m')}</g>`;
  // controlled system
  s+=`<g data-k="sys" style="cursor:pointer"><rect x="28" y="346" width="604" height="120" rx="12" fill="var(--surface-2)" stroke="${z.sel==='sys'?'var(--blue)':'var(--line)'}" stroke-width="${z.sel==='sys'?3:1.6}"/>${ar(330,370,'النظام المراد التحكم فيه',14)}</g>`;
  // S1 path: +24V -> S1 -> input module
  s+=S.w('M590 216V392',z.inMod?'live':'')+S.vC(590,392,436,{closed:z.s1,btn:1,inC:z.inMod?'live':'',outC:pw,label:'S1',side:'right'})+S.w('M590 436V452',pw)+S.t(560,458,'+24V','m','end');
  // lamp path
  s+=S.w('M80 216V394',z.outMod?'live':'')+W.lamp(80,412,15,z.outMod,'#ffcc33')+`<path d="M73 405l14 14M87 405l-14 14" stroke="var(--fg)" stroke-width="1.4" opacity=".6"/>`+S.w('M80 427V452','')+S.t(104,416,'H1','','start')+S.t(104,458,'0V','m','start');
  return s+'</svg>';
}
B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'1–4',
 title:'ما الحاكم المنطقي المبرمج (PLC)؟ ومكوناته الصلبة',
 summary:'تعريف الحاكم المنطقي المبرمج، ومكوناته الصلبة: وحدة البرمجة، وحدة المعالجة المركزية، وحدات الدخل والخرج، ومصدر القدرة، والربط بينها في الشكل (1-1).',
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 1',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
    <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة على:</p><ol><li>معرفة مكونات التحكم في العمليات الصناعية (PLC).</li><li>معرفة لغة البرمجة وأنواعها.</li></ol>
    <p><b>مستوى الأداء المطلوب:</b> إتقان الجدارة بنسبة 100٪. <b>الوقت المتوقع:</b> 4 ساعات.</p>
    <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج – حاسب آلي – جهاز عرض (داتا شو) – سبورة – قلم.</p>
    <p><b>متطلبات الجدارة:</b> اجتياز آلات التيار المتردد – ورشة التحكم في المحركات الثلاثية الأوجه.</p>
    <p><b>محتوى الوحدة:</b> الفصل الأول: نبذة عن التحكم المنطقي المبرمج، والمكونات الأساسية لعمليات التحكم المنطقي المبرمج. الفصل الثاني: أنواع البرمجة.</p>`},
  {h:'أولاً: ما الحاكم المنطقي المبرمج؟',ref:'ص 2',html:`<p>«يمكن تعريف الحاكم المنطقي المبرمج بأنه استخدام الحاسب الآلي لتنفيذ عمليات التحكم في الأجهزة والمعدات، وذلك باستقبال إشارات الدخل الثنائية للنظام ثم يقوم الحاسب بناء على هذه الإشارات بتنفيذ عمليات التحكم المطلوبة.»</p>`},
  {note:AR_NOTE+'PLC اختصار <span class="ltr">Programmable Logic Controller</span>. «إشارة ثنائية» تعني أنها إما <b>1</b> (يوجد جهد: الضاغط مضغوط) أو <b>0</b> (لا يوجد جهد). بدل أن نربط الأسلاك بين الضواغط والمتممات كما في ورشة التحكم، نوصل الضواغط إلى الـ PLC ونكتب البرنامج الذي يقرر متى تعمل الأحمال.'},
  {h:'ثانياً: المكونات الأساسية للحاكم المنطقي المبرمج',ref:'ص 2',html:`<p>يتكون الحاكم المنطقي المبرمج من عنصرين أساسيين: <b>1- مكونات صلبة</b> (Hardware) و <b>2- البرنامج</b> (Software، وهو موضوع الدرس التالي).</p>`},
  {h:'1- المكونات الصلبة',ref:'ص 2–3',html:`<p>«مكونات صلبة وتقسم إلى ثلاثة عناصر أساسية وهي:»</p>
   <div class="cards">
    <div class="card"><h3>أ- وحدة البرمجة</h3><p>الحاسب الآلي: جهاز كمبيوتر عادي متوافق مع (IBM)، لا يشترط فيه أي مواصفات خاصة، ويثبت عليه نظام التشغيل العادي (Windows95 أو 98).</p></div>
    <div class="card"><h3>ب- وحدة المعالجة المركزية (CPU)</h3><p>العنصر الأساسي المسؤول عن تنفيذ البرنامج. تختلف سرعتها وسعة ذاكرتها من نوع إلى آخر ومن شركة إلى أخرى. فيها وحدة الذاكرة التي يخزن فيها برنامج التحكم، ولا يمكن تخزين أكثر من برنامج واحد عليها.</p></div>
    <div class="card"><h3>ت- وحدات الدخل (Input module)</h3><p>تستقبل إشارات الدخل من النظام المراد التحكم فيه وتنقلها إلى وحدة المعالجة.</p></div>
    <div class="card"><h3>ث- وحدات الخرج (Output module)</h3><p>تستقبل نتيجة العمليات التي تمت في وحدة (CPU) وتنقل الإشارات الناتجة من تنفيذ البرنامج.</p></div>
    <div class="card"><h3>ج- وحدة البرمجة (ثابتة ومتنقلة)</h3><p>1- الحاسب الآلي وحدة برمجة ثابتة في غرفة التحكم. 2- وحدة متنقلة صغيرة تنقل إلى وحدات المعالجة المركزية وتستخدم لغة قائمة الإجراءات (STL) التي تشرح في الفصل الثاني.</p></div>
    <div class="card"><h3>ح- وحدة مصدر القدرة (Power Supply)</h3><p>تغذي وحدات الدخل والخرج ووحدة المعالجة المركزية بالقدرة المطلوبة: توصل بجهد <span class="ltr">220 V</span> متردد وتحوله إلى جهد منخفض <span class="ltr">24 V</span> مستمر.</p></div>
   </div>`},
  {err:'العنوان في ص 2 يقول «تقسم إلى ثلاثة عناصر أساسية» لكن الكتاب سرد بعده <b>ستة</b> بنود (أ، ب، ت، ث، ج، ح)، و«وحدة البرمجة» مكررة في البندين (أ) و (ج): الأول يعرّف الحاسب الآلي، والثاني يميّز بين وحدة البرمجة الثابتة والمتنقلة.'},
  {h:'مثال الكتاب على وحدات المعالجة',ref:'ص 2',html:`<p>«معالج من إنتاج شركة (Siemens) وهي من الشركات المشهورة في هذا المجال»:</p>
   <div class="tablebox" style="max-width:460px"><table class="tt"><thead><tr><th>رقم المعالج</th><th>حجم المعالجة</th><th>خلال زمن</th></tr></thead><tbody><tr><td class="mono">CPU313</td><td class="mono">12KB</td><td class="mono">0.6ms</td></tr><tr><td class="mono">CPU314</td><td class="mono">24KB</td><td class="mono">0.3ms</td></tr></tbody></table></div>`},
  {note:AR_NOTE+'لاحظ أن CPU314 يعالج ضعف الحجم في نصف الزمن، أي أنه أسرع بكثير من CPU313.'},
  {h:'مواصفات وحدات الدخل ووحدات الخرج',ref:'ص 2–3',html:`<p>«ولوحدات الدخل/الخرج مواصفات تختلف من شركة منتجة إلى أخرى من حيث:» (جمعنا القائمتين في جدول واحد للمقارنة)</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>من حيث</th><th>وحدات الدخل (ص 2–3)</th><th>وحدات الخرج (ص 3)</th></tr></thead><tbody>
    <tr><td>1- النوع</td><td>رقمية (Digital) أم تماثلية (Analog)</td><td>رقمية (Digital) أم تماثلية (Analog)</td></tr>
    <tr><td>2- عدد النقاط</td><td>8 نقاط أم 16 نقطة</td><td>8 نقاط أم 16 نقطة</td></tr>
    <tr><td>3- نوع الجهد</td><td>مستمر أم متردد</td><td>مستمر أم متردد</td></tr>
    <tr><td>4- قيمة الجهد</td><td>الجهد المغذي لها: <span class="ltr">24V / 120V / 240V</span></td><td>الجهد المغذي للحمل: <span class="ltr">24V / 120V / 240V</span></td></tr>
    <tr><td>5- قيمة التيار</td><td>—</td><td>التيار الذي تتحمله الوحدة في تغذية الحمل: <span class="ltr">10mA / 1A / 2A / 10A</span></td></tr></tbody></table></div>`},
  {err:'في ص 3 تحت «وحدات الخرج» البند الثاني مكتوب «من حيث عدد نقاط <b>الدخل</b>»، والمقصود نقاط <b>الخرج</b> (خطأ نسخ من قائمة وحدات الدخل).'},
  {h:'الربط بين المكونات',ref:'ص 4',html:`<p>«الشكل (1-1) يوضح عملية الربط بين جهاز الحاسب ووحدة المعالجة المركزية ووحدات الدخل والخرج والنظام المراد التحكم فيه. وهو التحكم المنطقي المبرمج.»</p>
   <p>وحدة البرمجة في الأعلى ترسل البرنامج إلى وحدة المعالجة. تحتها صف من ثلاث وحدات: وحدة الدخل، وحدة المعالجة المركزية، وحدة الخرج، ويغذيها جميعاً مصدر القدرة. وخارج الـ PLC «النظام المراد التحكم فيه»: يرسل إشاراته إلى وحدة الدخل، ويستقبل الأوامر من وحدة الخرج (حلقة مغلقة).</p>`},
  {fig:'(1-1)',ref:'ص 4',caption:'يوضح الربط بين وحدة البرمجة ووحدة المعالجة المركزية ووحدات الدخل والخرج ومصدر القدرة والنظام المراد التحكم فيه (أضفنا الضاغط S1 واللمبة H1 مثالاً للنظام)',draw:()=>`<div class="svgbox" style="max-width:640px;margin-inline:auto">${plcDiagram({psu:1,run:1,s1:0,inMod:0,pii:0,rlo:0,piq:0,outMod:0,phase:-1,sel:''})}</div>`},
  {note:AR_NOTE+'كيف تمر الإشارة؟ وحدة المعالجة تعمل في دورة متكررة تسمى <b>دورة المسح</b>: (1) تقرأ حالة كل المداخل من وحدة الدخل، (2) تنفذ البرنامج سطراً بعد سطر، (3) تكتب النتائج إلى وحدة الخرج، ثم تعيد ذلك كل أجزاء قليلة من الثانية. جرّب ذلك في تبويب «المختبر» مع «المسح البطيء».'}
 ],
 lab:(el,B)=>{
  const z={psu:1,run:1,s1:0,inMod:0,pii:0,rlo:0,piq:0,outMod:0,phase:-1,sel:'cpu',slow:0};const seen=new Set(['cpu']);let pt=0,ph=0,last=performance.now(),sig='',stepI=0;
  const STEPS=[
   {t:'تعرّف على الأجزاء',x:'انقر على كل جزء في المخطط (وحدة البرمجة، CPU، وحدة الدخل، وحدة الخرج، مصدر القدرة، النظام) واقرأ تعريفه من الكتاب في اللوحة الجانبية.',done:()=>seen.size>=6},
   {t:'شغّل اللمبة',x:'اضغط مطوّلاً على «S1». تابع: يضيء مؤشر I0.0 في وحدة الدخل ← تقرأه الـ CPU ← يضيء مؤشر Q4.5 في وحدة الخرج ← تضيء اللمبة H1.',done:()=>z.outMod},
   {t:'شاهد دورة المسح ببطء',x:'فعّل «المسح البطيء» ثم اضغط S1 مطوّلاً. لاحظ أن الـ CPU تمر بالمراحل الثلاث بالترتيب، وأن اللمبة لا تضيء إلا في مرحلة «كتابة المخارج».',done:()=>z.slow&&z.outMod},
   {t:'أوقف وحدة المعالجة',x:'اضغط زر RUN/STOP لتصبح STOP، ثم اضغط S1. الإشارة تصل إلى وحدة الدخل، لكن لا أحد ينفذ البرنامج فلا تضيء اللمبة.',done:()=>!z.run&&z.inMod},
   {t:'افصل مصدر القدرة',x:'أعد الـ CPU إلى RUN ثم افصل مصدر القدرة. كل الوحدات تتوقف لأن مصدر القدرة هو الذي يغذيها بجهد 24 V المستمر.',done:()=>!z.psu}
  ];
  el.innerHTML=`<div class="grid"><div class="panel c8"><h2>مخطط الـ PLC التفاعلي <small>مبني على الشكل (1-1) ص 4</small></h2>
    <p class="sub">انقر أي جزء لقراءة وصفه. البرنامج المحمّل في الـ CPU للتوضيح هو برنامج مثال الدرس 1.4 (السطر <span class="ltr mono">A I 0.0</span> ثم السطر <span class="ltr mono">= Q 4.5</span>).</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
     <button class="pb green" id="u1s1" aria-label="الضاغط S1"><span class="cap">S1</span><small>اضغط مطوّلاً</small></button>
     <button class="btn" id="u1run" aria-pressed="true">CPU: RUN</button>
     <button class="btn" id="u1psu" aria-pressed="true">مصدر القدرة: موصول</button>
     <label class="toggle" style="margin-top:0"><input type="checkbox" id="u1slow"> المسح البطيء</label></div>
    <div class="scan" id="u1scan" style="margin-top:10px"></div>
    <div class="svgbox" id="u1d" style="max-width:660px;margin-inline:auto"></div></div>
   <div class="panel c4"><h2>الجزء المختار</h2><div id="u1info"></div></div>
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="u1steps"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const info=()=>{const d=INFO[z.sel];$('#u1info').innerHTML=`<h3 class="sm">${d.t} <span class="ref">${d.r}</span></h3><div class="prose">${d.h}</div>`};
  const steps=()=>{$('#u1steps').innerHTML=STEPS.map((s,i)=>`<li class="${i<stepI?'done':i===stepI?'cur':''}"><span class="k">${i<stepI?'✓':i+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${i===stepI?'<div class="act"><span class="hint">بانتظار تنفيذك…</span></div>':''}</div></li>`).join('')+(stepI>=STEPS.length?'<li class="cur"><span class="k">✓</span><div><h4>أحسنت</h4><p style="display:block">عرفت دور كل مكوّن وكيف تمر الإشارة من الضاغط حتى الحمل.</p></div></li>':'')};
  $('#u1d').addEventListener('click',e=>{const g=e.target.closest('[data-k]');if(g){z.sel=g.dataset.k;seen.add(z.sel);info();sig=''}});
  const b=$('#u1s1');const dn=e=>{e.preventDefault();z.s1=1;b.classList.add('down')},up=()=>{z.s1=0;b.classList.remove('down')};
  b.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,up));
  b.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')dn(e)});b.addEventListener('keyup',up);
  $('#u1run').onclick=e=>{z.run=z.run?0:1;e.target.textContent='CPU: '+(z.run?'RUN':'STOP');e.target.setAttribute('aria-pressed',!!z.run)};
  $('#u1psu').onclick=e=>{z.psu=z.psu?0:1;e.target.textContent='مصدر القدرة: '+(z.psu?'موصول':'مفصول');e.target.setAttribute('aria-pressed',!!z.psu)};
  $('#u1slow').onchange=e=>{z.slow=e.target.checked?1:0;pt=0;ph=0};
  info();steps();
  const loop=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,(now-last)/1000);last=now;
    z.inMod=z.psu&&z.s1?1:0;
    if(z.psu&&z.run){pt+=dt;const dur=z.slow?1.1:0.02;if(pt>=dur){pt=0;
        if(ph===0)z.pii=z.inMod;else if(ph===1)z.rlo=z.pii;else{z.piq=z.rlo;z.outMod=z.piq}ph=(ph+1)%3}
      z.phase=z.slow?ph:-1}
    else{z.phase=-1;z.piq=0;z.outMod=0;if(!z.psu){z.pii=0;z.rlo=0}}
    const sg=JSON.stringify(z);if(sg!==sig){sig=sg;$('#u1d').innerHTML=plcDiagram(z);
      const P=['قراءة المداخل','تنفيذ البرنامج','كتابة المخارج'];$('#u1scan').innerHTML=P.map((p,i)=>`<span class="ph ${z.phase===i?'cur':''}">${p}</span>`).join('<span class="arr">→</span>')+'<span class="arr loop">↻ يتكرر باستمرار</span>'}
    const cur=STEPS[stepI];if(cur&&cur.done()){stepI++;steps()}
    requestAnimationFrame(loop)};
  requestAnimationFrame(loop);
 },
 quiz:[
  {q:'حسب تعريف الكتاب، الحاكم المنطقي المبرمج هو:',o:['محرك يعمل بالحاسب','استخدام الحاسب الآلي لتنفيذ عمليات التحكم في الأجهزة والمعدات','لوحة متممات وأسلاك','برنامج رسم دوائر'],c:1,e:'«استخدام الحاسب الآلي لتنفيذ عمليات التحكم... باستقبال إشارات الدخل الثنائية للنظام» (ص 2).'},
  {q:'ما الوحدة المسؤولة عن تنفيذ البرنامج؟',o:['وحدة الدخل','مصدر القدرة','وحدة المعالجة المركزية (CPU)','وحدة الخرج'],c:2,e:'الـ CPU «العنصر الأساسي المسؤول عن تنفيذ البرنامج» (ص 2).'},
  {q:'أي الوحدات تستقبل الإشارات من الضواغط والحساسات؟',o:['وحدة الدخل','وحدة الخرج','وحدة البرمجة','الذاكرة'],c:0,e:'وحدة الدخل تستقبل إشارات الدخل من النظام وتنقلها إلى وحدة المعالجة.'},
  {q:'مصدر القدرة في الكتاب يحوّل:',o:['24 V مستمر إلى 220 V متردد','220 V متردد إلى 24 V مستمر','380 V إلى 220 V','لا يحوّل شيئاً'],c:1,e:'يوصل بجهد 220 فولت متردد ويحوله إلى 24 فولت مستمر (ص 3).'},
  {q:'كم برنامجاً يمكن تخزينه على وحدة المعالجة المركزية حسب الكتاب؟',o:['برنامج واحد فقط','برنامجان','16 برنامجاً','بلا حدود'],c:0,e:'«لا يمكن تخزين أكثر من برنامج واحد على وحدة المعالجة المركزية» (ص 2).'},
  {q:'أي معالج أسرع حسب مثال الكتاب؟',o:['CPU313: 12KB خلال 0.6ms','CPU314: 24KB خلال 0.3ms','متساويان','لا يمكن المقارنة'],c:1,e:'CPU314 يعالج ضعف الحجم في نصف الزمن.'},
  {q:'أي مواصفة تخص وحدات الخرج فقط في قائمة الكتاب؟',o:['النوع رقمي أم تماثلي','عدد النقاط 8 أو 16','قيمة التيار الذي تتحمله في تغذية الحمل','نوع الجهد'],c:2,e:'البند 5 (10mA أو 1A أو 2A أو 10A) ورد تحت وحدات الخرج فقط.'},
  {q:'وحدة البرمجة المتنقلة تستخدم لغة:',o:['LAD','FBD','قائمة الإجراءات STL','Step5'],c:2,e:'البند (ج) ص 3: تستخدم لغة قائمة الإجراءات (STL).'}
 ]
});

/* =====================================================================
   Lesson 1.2 — Software and blocks (ص 5–6)
   ===================================================================== */
const OPS=[['العمليات الثنائية','OB, PB, FB'],['القلابات','OB, PB, FB'],['المزمنات','OB, PB, FB'],['العدادات','OB, PB, FB'],['عمليات التحميل والنقل','OB, PB, FB'],['عمليات المقارنة','OB, PB, FB'],['استدعاء بلوكات البيانات','OB, PB, FB'],['العمليات المنطقية','OB, PB, FB'],['الجمع والطرح','OB, PB, FB'],['تخزين البيانات','DB'],['الضرب','FB242'],['القسمة','FB243'],['قراءة قيم المداخل التناظرية','FB250'],['عملية الإزاحة','FB'],['عمليات الزيادة بـ (1:255)','FB'],['عمليات النقصان بـ (1:255)','FB'],['حاكم تناسبي تفاضلي تكاملي (PID)','OB251'],['التوقف عند تلف البطارية','OB34'],['التوقف عند انقطاع التيار ثم عودته','OB21, OB34'],['إخراج قيم المخارج التناظرية','FB251'],['تحويل الكود','FB240, FB241'],['القفز داخل البرنامج','FB'],['القفز من بلوك إلى آخر','OB, PB, FB']];
function fig21(){
  const blk=(x,y,w,h,t)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="fbox"/>`+S.t(x+w/2,y+h/2+4,t);
  const go=(x1,y1,x2,y2)=>arrow(x1,y1,x2,y2,'');
  let s=`<svg viewBox="0 0 640 300" role="img" aria-label="ترابط البلوكات">`;
  s+=blk(30,20,56,210,'OB1')+blk(170,30,60,44,'PB1')+blk(170,150,60,44,'PB2')+blk(310,60,60,44,'PB3')+blk(310,180,60,44,'PB4')+blk(530,40,60,44,'FB1')+blk(530,130,60,44,'PB5');
  s+=go(86,44,170,44)+go(170,62,86,62)+go(86,164,170,164)+go(170,182,86,182);
  s+=go(230,64,310,74)+go(310,92,230,82)+go(230,184,310,194)+go(310,212,230,202);
  s+=`<path d="M370 82H520" stroke="var(--fg)" stroke-width="1.6" stroke-dasharray="6 5"/>`+go(510,62,530,62)+go(530,154,500,154)+go(500,140,530,140)+`<path d="M500 82V154" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="4 4"/>`;
  s+=S.w('M40 262H600','')+[[58,'1'],[200,'2'],[340,'3'],[560,'16']].map(([x,t])=>S.t(x,284,t)).join('')+`<path d="M380 270H520" stroke="var(--muted)" stroke-dasharray="6 5"/>`+arrow(500,270,526,270,'');
  return s+'</svg>';
}
B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'5–6',
 title:'البرنامج (Software) وأنواع البلوكات',
 summary:'برنامج التحكم وبرامج Step7 و Step5، وأنواع البلوكات OB و PB و FB و DB، والعمليات التي تجرى على كل منها، وترابط البلوكات في الشكل (2-1).',
 theory:[
  {h:'2- البرنامج (Software)',ref:'ص 5',html:`<p>«برنامج التحكم وهو ما يعرف بـ (Software)، وهي مجموعة من الأوامر المطلوب تنفيذها بطريقة منطقية، لتنفيذ عملية التحكم المطلوبة.»</p>
   <p>«ومن أشهر هذه البرامج وأحدثها برنامج (<span class="ltr">Step7</span>) وهو برنامج منتج من شركة (Siemens) ويعمل تحت نظام التشغيل (<span class="ltr">Windows95</span> أو 98) بالإضافة إلى برنامج (<span class="ltr">Step5</span>) ومنه عدة إصدارات تعمل على نظام التشغيل (<span class="ltr">Dos3.1</span>) أو نظام (<span class="ltr">Windows 3.11</span>).»</p>
   <p>«وهناك شركات أخرى تنتج برامج تحكم ولكنها تماثل (Step7).»</p>`},
  {err:'في ص 5 كُتب اسم البرنامج «<span class="ltr">Setp7</span>» في الجملة الأخيرة، والصحيح <span class="ltr">Step7</span> (خطأ مطبعي).'},
  {h:'3- أنواع البلوكات',ref:'ص 5',html:`<p>«البلوكات وهي المساحات المستخدمة في عملية تخزين البرامج والتي تختلف باختلاف التطبيق وهي على النحو التالي:»</p>
   <div class="tablebox" style="max-width:460px"><table class="tt"><thead><tr><th>الرقم</th><th>وظيفة البلوك</th><th>رمز البلوك</th></tr></thead><tbody>
   <tr><td>1</td><td>بلوك تنظيمي</td><td class="mono">OB</td></tr><tr><td>2</td><td>بلوك برامج</td><td class="mono">PB</td></tr><tr><td>3</td><td>بلوك وظيفي</td><td class="mono">FB</td></tr><tr><td>4</td><td>بلوك بيانات</td><td class="mono">DB</td></tr></tbody></table></div>`},
  {note:AR_NOTE+'الحروف من الإنجليزية: <span class="ltr">OB = Organization Block</span>، <span class="ltr">PB = Program Block</span>، <span class="ltr">FB = Function Block</span>، <span class="ltr">DB = Data Block</span>.'},
  {h:'العمليات التي تجرى على البلوكات',ref:'ص 5–6',html:`<p>«والجدول التالي يعرض العمليات المختلفة التي يمكن إجراؤها على البلوكات التالية:»</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>رقم</th><th>العملية</th><th>البلوكات</th></tr></thead><tbody>${OPS.map((o,i)=>`<tr><td>${i+1}</td><td>${o[0]}</td><td class="mono">${o[1]}</td></tr>`).join('')}</tbody></table></div>`},
  {h:'ترابط البلوكات',ref:'ص 6',html:`<p>«ففي حالة البرمجة يوضح البرنامج في بلوك واحد أما في حالة البرامج المركبة يستخدم عدة بلوكات مختلفة. حيث يبدأ البرنامج من البلوك التنظيمي (OB) وبواسطة عمليات القفز المشروط وغير المشروط يمكن القفز من بلوكات البرامج (PB) أو بلوكات الوظائف (FB). وكذلك يمكن استدعاء أي بلوك بيانات للحصول على بعض كلمات البيانات المخزنة فيه بحيث يكون أقصى مستوى عدد مسموح به للتطبيق الواحد هو (16) عدداً. والشكل (2-1) يبين ترابط البلوكات وعددها.»</p>`},
  {fig:'(2-1)',ref:'ص 6',caption:'يبين ترابط البلوكات وعددها: OB1 في المستوى 1 يستدعي PB1 و PB2 (المستوى 2)، و PB1 يستدعي PB3 و PB2 يستدعي PB4 (المستوى 3)، والخط المتقطع يمتد حتى المستوى 16 (FB1، و PB5 بجانبه). كل استدعاء بسهم ذهاب وسهم رجوع.',draw:()=>`<div class="svgbox" style="max-width:640px;margin-inline:auto">${fig21()}</div>`},
  {note:AR_NOTE+'معنى «المستوى»: عندما يستدعي OB1 البلوك PB1 ينتقل التنفيذ إليه (مستوى 2)، وإذا استدعى PB1 البلوك PB3 صرنا في المستوى 3، وهكذا. بعد انتهاء كل بلوك يرجع التنفيذ إلى البلوك الذي استدعاه (سهم الرجوع). الكتاب يحدد أقصى عمق بـ 16 مستوى. برامج هذه الوحدة كلها صغيرة فتكتب في بلوك واحد هو OB1.'}
 ],
 lab:(el,B)=>{
  const SEQ=[['call','PB1'],['call','PB3'],['ret'],['ret'],['call','PB2'],['call','PB4'],['ret'],['ret']];
  let stack=['OB1'],k=0,msg='البرنامج يبدأ من البلوك التنظيمي OB1 (المستوى 1).',sel=-1,selB='';
  el.innerHTML=`<div class="grid"><div class="panel c7"><h2>محاكاة ترابط البلوكات <small>الشكل (2-1) ص 6</small></h2>
    <p class="sub">«خطوة» تنفذ تسلسل الشكل (2-1). أو استدعِ بلوكات بنفسك لترى حد الـ 16 مستوى.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"><button class="btn primary" id="bkStep">خطوة في الشكل (2-1)</button><button class="btn" id="bkCall">استدعاء بلوك جديد</button><button class="btn" id="bkRet">رجوع</button><button class="btn" id="bkReset">من البداية</button></div>
    <div id="bkView"></div></div>
   <div class="panel c5"><h2>أين تُجرى هذه العملية؟ <small>جدول ص 5–6</small></h2><p class="sub">اختر عملية لترى البلوكات المسموح بها، أو انقر بلوكاً لترى عملياته.</p>
    <select id="opSel" style="font:inherit;width:100%;margin-top:10px;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg)"><option value="-1">— اختر عملية —</option>${OPS.map((o,i)=>`<option value="${i}">${i+1}- ${o[0]}</option>`).join('')}</select>
    <div id="opView"></div></div></div>`;
  const $=s=>el.querySelector(s);
  const view=()=>{const lv=stack.length;
    $('#bkView').innerHTML=`<div class="facts"><div class="fact"><span>البلوك الذي ينفَّذ الآن</span><b>${stack[lv-1]}</b></div><div class="fact"><span>المستوى</span><b>${lv} / 16</b></div></div>
     <div class="svgbox" style="max-width:600px"><svg viewBox="0 0 600 ${Math.max(70,lv*26+20)}">${stack.map((b,i)=>`<rect x="${20+i*30}" y="${10+i*26}" width="110" height="22" rx="4" class="fbox" ${i===lv-1?'style="stroke:var(--blue);stroke-width:2.5"':''}/>${S.t(75+i*30,26+i*26,b)}${S.t(140+i*30,26+i*26,'L'+(i+1),'m','start')}`).join('')}</svg></div>
     <div class="callout">${msg}</div>`};
  const ops=()=>{const blocks=['OB','PB','FB','DB'];const hit=b=>sel>=0&&OPS[sel][1].split(', ').some(x=>x.startsWith(b));
    let h=`<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">${blocks.map(b=>`<button class="btn" data-blk="${b}" style="${hit(b)||selB===b?'background:var(--on-soft);border-color:var(--on)':''}">${b}</button>`).join('')}</div>`;
    if(sel>=0)h+=`<p class="sub" style="margin-top:8px">«${OPS[sel][0]}» تُجرى في: <b class="mono">${OPS[sel][1]}</b>${/\d/.test(OPS[sel][1])?' (رقم البلوك محدد في الجدول)':''}.</p>`;
    if(selB)h+=`<p class="sub" style="margin-top:8px">عمليات يُذكر فيها <b>${selB}</b>:</p><ul class="prose" style="font-size:14px;margin-top:4px">${OPS.filter(o=>o[1].split(', ').some(x=>x.startsWith(selB))).map(o=>`<li>${o[0]} <span class="mono">(${o[1]})</span></li>`).join('')}</ul>`;
    $('#opView').innerHTML=h;el.querySelectorAll('[data-blk]').forEach(b=>b.onclick=()=>{selB=b.dataset.blk;sel=-1;$('#opSel').value='-1';ops()})};
  $('#bkStep').onclick=()=>{if(k>=SEQ.length){msg='انتهى تسلسل الشكل (2-1) ورجع التنفيذ إلى OB1. اضغط «من البداية» للإعادة.';view();return}
    if(stack.length!==[1,2,3,2,1,2,3,2][k]){stack=['OB1'];k=0}
    const [a,b]=SEQ[k++];if(a==='call'){msg=`${stack[stack.length-1]} يستدعي ${b} (سهم ذهاب) ← المستوى ${stack.length+1}.`;stack.push(b)}else{const f=stack.pop();msg=`انتهى ${f} ويرجع التنفيذ إلى ${stack[stack.length-1]} (سهم رجوع).`}view()};
  $('#bkCall').onclick=()=>{if(stack.length>=16){msg='<b>لا يمكن:</b> وصلت إلى المستوى 16، وهو «أقصى مستوى عدد مسموح به للتطبيق الواحد» (ص 6).';view();return}
    const nm=(stack.length%2?'PB':'FB')+(stack.length+1);msg=`${stack[stack.length-1]} يستدعي ${nm} ← المستوى ${stack.length+1}.`;stack.push(nm);k=99;view()};
  $('#bkRet').onclick=()=>{if(stack.length<=1){msg='OB1 هو البلوك التنظيمي الذي يبدأ منه البرنامج، لا يوجد ما نرجع إليه.';view();return}const f=stack.pop();msg=`انتهى ${f} ورجع التنفيذ إلى ${stack[stack.length-1]}.`;view()};
  $('#bkReset').onclick=()=>{stack=['OB1'];k=0;msg='البرنامج يبدأ من البلوك التنظيمي OB1 (المستوى 1).';view()};
  $('#opSel').onchange=e=>{sel=+e.target.value;selB='';ops()};
  view();ops();
 },
 quiz:[
  {q:'ما المقصود بالبرنامج (Software) في الكتاب؟',o:['جهاز الحاسب','مجموعة من الأوامر المطلوب تنفيذها بطريقة منطقية لتنفيذ عملية التحكم','وحدة الدخل','الأسلاك بين الوحدات'],c:1,e:'تعريف ص 5.'},
  {q:'برنامج Step7 من إنتاج شركة:',o:['IBM','Microsoft','Siemens','غير معروف'],c:2,e:'«برنامج (Step7) وهو برنامج منتج من شركة (Siemens)».'},
  {q:'ما رمز البلوك التنظيمي الذي يبدأ منه البرنامج؟',o:['PB','OB','FB','DB'],c:1,e:'«يبدأ البرنامج من البلوك التنظيمي (OB)» ص 6.'},
  {q:'في أي بلوك تُجرى عملية «تخزين البيانات»؟',o:['OB','PB','FB','DB'],c:3,e:'الجدول ص 6: تخزين البيانات ← DB.'},
  {q:'المزمنات والعدادات تُستخدم في البلوكات:',o:['DB فقط','OB و PB و FB','FB242 فقط','OB34'],c:1,e:'البندان 3 و 4 في الجدول: OB, PB, FB.'},
  {q:'ما أقصى عدد مستويات لترابط البلوكات في التطبيق الواحد؟',o:['3','8','16','255'],c:2,e:'«أقصى مستوى عدد مسموح به للتطبيق الواحد هو (16)» ص 6.'},
  {q:'عملية الضرب حسب الجدول تتم في:',o:['FB242','FB243','FB250','OB251'],c:0,e:'الضرب FB242، والقسمة FB243.'},
  {q:'في الشكل (2-1)، PB3 في أي مستوى؟',o:['1','2','3','16'],c:2,e:'OB1 مستوى 1 ← PB1 مستوى 2 ← PB3 مستوى 3.'}
 ]
});

/* =====================================================================
   Lesson 1.3 — programming methods, LAD symbols, addressing (ص 7–9)
   ===================================================================== */
function symE(kind,lbl){ // electrical symbols (vertical)
  let s='<svg viewBox="0 0 70 70" style="width:64px;height:64px" role="img">';
  if(kind==='no'||kind==='nob')s+=S.vC(30,6,64,{closed:0,label:lbl,side:'right',btn:kind==='nob'?1:0});
  if(kind==='nc'||kind==='ncb')s+=S.vC(30,6,64,{nc:1,closed:1,label:lbl,side:'right',btn:kind==='ncb'?1:0});
  if(kind==='lamp')s+=S.w('M30 4V22','')+S.coil(30,24,lbl,0,'lamp')+S.w('M30 46V66','');
  if(kind==='coil')s+=S.w('M30 4V24','')+S.coil(30,24,lbl,0)+S.w('M30 46V66','');
  return s+'</svg>';
}
function symL(kind,lbl){ // LAD symbols (horizontal)
  let s='<svg viewBox="0 0 120 50" style="width:110px;height:46px" role="img">';
  if(kind==='coil')s+=S.w('M4 28H48','')+`<path class="sym" d="M54 17Q46 28 54 39M66 17Q74 28 66 39"/>`+S.w('M72 28H116','');
  else s+=S.w('M4 28H52','')+`<path class="sym" d="M52 17V39M68 17V39"/>`+(kind==='nc'?`<path class="sym" d="M49 38L71 18"/>`:'')+S.w('M68 28H116','');
  return s+`<text class="lad-txt" x="60" y="11" text-anchor="middle">${lbl}</text></svg>`;
}
B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'7–9',
 title:'طرق البرمجة ورموز المخطط السلمي والعناوين I k.g و Q n.m',
 summary:'خطوات البدء في البرمجة، وطرق كتابة البرنامج الثلاث LAD و FBD (CSF) و STL، والربط بين رموز الدائرة الكهربائية ورموز المخطط السلمي، وطريقة ترقيم نقاط الدخل والخرج.',
 theory:[
  {h:'أنواع البرمجة',ref:'ص 7',html:`<p>«تبدأ عملية البرمجة بتحديد و بدراسة النظام المراد التحكم فيه وتحليله من خلال تحديد نقاط الدخل (مفاتيح التشغيل مثل الضواغط أو الحساسات). كما يتم تحديد نقاط الخرج مثل المتممات والمرحلات. ثم بعد ذلك يتم ترقيم هذه النقاط بما يتناسب مع وحدات الدخل والخرج المتوفرة في المختبر أو في الواقع العملي. ثم نبدأ بتحديد طريقة البرمجة المناسبة وهناك ثلاث طرق لكتابة البرنامج:»</p>
   <ol><li><b>المخطط السلّمي</b> (<span class="ltr">Ladder Diagram Method</span>) واختصارها <b>LAD</b>.</li>
   <li><b>مخطط البوابات المنطقية</b> (<span class="ltr">Control System Flowchart</span>) واختصارها <b>CSF</b> في حالة استخدام برنامج Step5، وتسمى أيضاً (<span class="ltr">Function Block Diagram</span>) واختصارها <b>FBD</b> في حالة استخدام برنامج Step7.</li>
   <li><b>قائمة الإجراءات</b> (<span class="ltr">Statement List</span>) واختصارها <b>STL</b>.</li></ol>`},
  {widget:(el,B)=>{let v='lad';const P=B.createPLC([{stl:STL.ex2}]);const names=namesOf(C.ex2.io);
    const draw=()=>{el.innerHTML=`<div class="fig"><p class="sub">${AR_NOTE}الدائرة نفسها (مثال 2، ص 10) مكتوبة بالطرق الثلاث. بدّل بينها:</p><div class="seg" role="group" style="margin-top:8px">${['lad','fbd','stl'].map(k=>`<button data-k="${k}" aria-pressed="${v===k}">${k.toUpperCase()}</button>`).join('')}</div>
      ${v==='stl'?B.stlTable(P.nets[0],{trace:[],get:()=>0}):`<div class="svgbox fixed">${(v==='lad'?B.ladNetwork:B.fbdNetwork)(P.nets[0],P,names)}</div>`}</div>`;
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{v=b.dataset.k;draw()})};draw()}},
  {h:'أولاً: المخطط السلمي (LAD)',ref:'ص 7',html:`<p>«هذه الطريقة هي أقرب ما تكون لمخطط مسار التيار المستخدم في الدوائر الكهربائية ودوائر التحكم. مع فارق أساسي وهي أنها ترسم بشكل <b>أفقي</b>. وهذه الطريقة هي أكثر الطرق استخداماً في تمثيل الدوائر الكهربائية، ودوائر التحكم في الآلات الكهربائية بأنواعها.»</p>`},
  {h:'الربط بين رموز الدائرة الكهربائية ورموز المخطط السلمي',ref:'ص 8',html:`<p>«والجدول التالي يوضح مثالاً لكيفية الربط بين رموز الدائرة الكهربائية ورموز المخطط السلّمي.»</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>مسمى الرمز (كهربائي)</th><th>شكل الرمز في الدائرة الكهربائية</th><th>مسمى الرمز (LAD)</th><th>شكل الرمز في المخطط السلمي</th><th>الوظيفة</th></tr></thead><tbody>
    <tr><td class="mono">S1, N.O.</td><td>${symE('nob','S1')}${symE('no','S1')}</td><td class="mono">I0.0, I7.7</td><td>${symL('no','I0.0')}</td><td>المفتاح المفتوح أو ضاغط التوصيل</td></tr>
    <tr><td class="mono">S0, N.C.</td><td>${symE('ncb','S3')}${symE('nc','S3')}</td><td class="mono">I0.1, I5.3</td><td>${symL('nc','I0.1')}</td><td>المفتاح المغلق أو ضاغط الفصل</td></tr>
    <tr><td class="mono">H1, Q3, M</td><td>${symE('lamp','H1')}${symE('coil','Q3')}</td><td class="mono">Q3.3, Q0.0</td><td>${symL('coil','Q3.3')}</td><td>الحمل (الخرج): المصباح (اللمبة)، والمتمم، والمحرك</td></tr></tbody></table></div>`},
  {err:'في جدول ص 8 عمود المسمى يقول «S0, N.C.» بينما الرمز المرسوم بجانبه معنون <b>S3</b>. المقصود في الحالتين ضاغط فصل مغلق.'},
  {h:'شرح الرموز',ref:'ص 8–9',html:`<ul><li>الرمز <span class="ltr mono">-| |-</span> يمثل مفتاحاً <b>مفتوحاً</b> (<span class="ltr">Normally Open</span>) واختصاره <b>N.O.</b>، وهي تمثل مفاتيح التشغيل أو ضواغط التشغيل.</li>
   <li>الرمز <span class="ltr mono">-|/|-</span> يمثل مفتاحاً <b>مغلقاً</b> (<span class="ltr">Normally Closed</span>) واختصاره <b>N.C.</b>، وهي تمثل مفاتيح الفصل، والمصهرات، وضواغط الفصل.</li>
   <li>الرمز <span class="ltr mono">-( )-</span> يمثل <b>الخرج</b>، وهذا الرمز ثابت لجميع أنواع المخارج مثل المصابيح، المتممات، المحركات، أو أي نوع من الأحمال.</li></ul>`},
  {h:'ترقيم نقاط الدخل: I k.g',ref:'ص 8–9',html:`<p>«وجميع المفاتيح في دائرة (LAD) تأخذ الرمز (<b class="ltr">I K.G</b>) حيث إن (I) تمثل نقطة الدخل، وهي مفتاح تشغيل أو فصل. أما (k) يمثل رقم الوحدة التابعة لها نقطة الدخل وهي متغيرة القيمة على حسب عدد وحدات الدخل المتوفرة في المختبر. ثم (.) النقطة وهي التي تفصل بين رقم الوحدة والمفتاح داخل الوحدة. أما الرقم (G) فيمثل رقم المفتاح داخل الوحدة (K). حيث إنه في كل وحدة دخل يوجد بها (8) نقاط دخل.»</p>`},
  {h:'ترقيم نقاط الخرج: Q n.m',ref:'ص 9',html:`<p>«وجميع نقاط الخرج في دائرة (LAD) تأخذ الرمز (<b class="ltr">Q N.M</b>) حيث إن (Q) تمثل نقطة الخرج. والرقم (N) يمثل رقم وحدة الخرج. والرقم (M) يمثل رقم نقطة الخرج داخل الوحدة (N) والرمز (.) النقطة هي التي تفصل بين رقم الوحدة ورقم النقطة داخل الوحدة.»</p>
   <div class="facts"><div class="fact"><span>I1.3 تعني</span><b>دخل · وحدة 1 · نقطة 3</b></div><div class="fact"><span>Q4.5 تعني</span><b>خرج · وحدة 4 · نقطة 5</b></div></div>`},
  {note:AR_NOTE+'لأن في كل وحدة 8 نقاط، فرقم النقطة يكون من <b>0 إلى 7</b> فقط (مثل I7.7 في جدول الكتاب). لا يوجد عنوان مثل I0.8؛ النقطة التاسعة تكون أول نقطة في الوحدة التالية I1.0.'},
  {h:'خطوات كتابة أي برنامج',ref:'ص 9',html:`<p>«ولكتابة أي برنامج يجب أن يمر بثلاث خطوات أساسية وهي:»</p><ol><li>دراسة النظام المراد التحكم فيه (دائرة التحكم).</li><li>ترميز نقاط الدخل والخرج.</li><li>كتابة البرنامج.</li></ol><p>وهذه الخطوات الثلاث (الدراسة، الترميز، الرسم) نجدها في كل مثال وتمرين في بقية الوحدة.</p>`},
  {note:AR_NOTE+'كل دوائر هذه الوحدة <b>بلا تعويض ذاتي</b> (لا يوجد تلامس للمتمم موازٍ لضاغط التشغيل)، لذلك يعمل الحمل فقط ما دام شرط التشغيل متحققاً. والكتاب يستعمل كلمتي «مفتاح» و«ضاغط» بالتبادل.'}
 ],
 lab:(el,B)=>{
  const ROUNDS=[['nob','S1',0,'ضاغط التوصيل (مفتوح)'],['nc','S0',1,'مفتاح الفصل (مغلق)'],['lamp','H1',2,'المصباح'],['no','S2',0,'المفتاح المفتوح'],['coil','K1',2,'ملف المتمم'],['ncb','S3',1,'ضاغط الفصل (مغلق)']];
  let r=0,score=0,ans=null,press=0,area='I',k=0,g=0;
  const P1=B.createPLC([{title:'تلامس مفتوح N.O.',stl:['A I 0.0','= Q 4.0']},{title:'تلامس مغلق N.C.',stl:['AN I 0.0','= Q 4.1']}]);
  el.innerHTML=`<div class="grid">
   <div class="panel c6"><h2>المفتوح والمغلق في الـ LAD <small>ص 8</small></h2><p class="sub">اضغط الضاغط مطوّلاً وقارن التلامس المفتوح بالمغلق للعنوان نفسه I0.0.</p>
    <div style="margin-top:10px"><button class="pb green" id="nPb"><span class="cap">S</span><small>اضغط مطوّلاً</small></button></div><div id="nView"></div></div>
   <div class="panel c6"><h2>طابق الرمز <small>جدول ص 8</small></h2><div id="mView"></div></div>
   <div class="panel c12"><h2>مولّد العناوين <small>I k.g و Q n.m — ص 8–9</small></h2><div id="aView"></div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label for="aIn">اكتب عنواناً لنفحصه:</label><input id="aIn" class="mono" dir="ltr" placeholder="I0.8" style="font:inherit;padding:5px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg);width:120px"><button class="btn" id="aChk">افحص</button></div><div id="aRes"></div></div></div>`;
  const $=s=>el.querySelector(s);
  const nView=()=>{P1.set('I0.0',press);P1.scan(0.05);$('#nView').innerHTML=`<p class="sub" style="margin-top:8px">الضاغط ${press?'<b>مضغوط</b>: تصل للـ PLC إشارة I0.0 = 1':'<b>غير مضغوط</b>: I0.0 = 0'}</p>`+P1.nets.map(n=>`<div class="net"><header><h3>${n.title}</h3></header><div class="svgbox fixed">${B.ladNetwork(n,P1,{'I0.0':'S'})}</div></div>`).join('')+`<p class="sub">${press?'التلامس المفتوح الآن موصّل، والمغلق مقطوع.':'التلامس المغلق موصّل وهو غير مضغوط، والمفتوح مقطوع.'}</p>`};
  const mView=()=>{if(r>=ROUNDS.length){$('#mView').innerHTML=`<div class="facts"><div class="fact"><span>النتيجة</span><b>${score} / ${ROUNDS.length}</b></div></div><button class="btn" id="mAgain" style="margin-top:10px">العب مرة أخرى</button>`;$('#mAgain').onclick=()=>{r=0;score=0;ans=null;mView()};return}
    const q=ROUNDS[r];const opts=[['no','I0.0'],['nc','I0.1'],['coil','Q3.3']];
    $('#mView').innerHTML=`<p class="sub">السؤال ${r+1} من ${ROUNDS.length}: ما رمز هذا العنصر في المخطط السلمي؟</p><div style="display:flex;align-items:center;gap:14px;margin-top:8px">${symE(q[0],q[1])}<b>${q[3]}</b></div>
     <div class="opts" style="margin-top:10px">${opts.map((o,i)=>`<button class="opt ${ans!=null?(i===q[2]?'right':i===ans?'wrong':''):''}" data-o="${i}" ${ans!=null?'disabled':''} style="direction:ltr">${symL(o[0],o[1])}</button>`).join('')}</div>
     ${ans!=null?`<div class="fb show">${ans===q[2]?'<b class="ok">صحيح.</b> ':'<b class="no">ليس هذا.</b> '}${['المفتوح (N.O.) يرسم -| |-','المغلق (N.C.) يرسم -|/|-','كل الأحمال (مصباح، متمم، محرك) ترسم -( )-'][q[2]]}</div><button class="btn primary" id="mNext" style="margin-top:8px">التالي</button>`:''}`;
    el.querySelectorAll('#mView [data-o]').forEach(b=>b.onclick=()=>{ans=+b.dataset.o;if(ans===q[2])score++;mView()});const nx=$('#mNext');if(nx)nx.onclick=()=>{r++;ans=null;mView()}};
  const aView=()=>{const sel=(id,n,v)=>`<select id="${id}" style="font:inherit;padding:4px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg)">${Array.from({length:n},(_,i)=>`<option ${i===v?'selected':''}>${i}</option>`).join('')}</select>`;
    $('#aView').innerHTML=`<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-top:10px"><div class="seg" role="group"><button data-a="I" aria-pressed="${area==='I'}">دخل I</button><button data-a="Q" aria-pressed="${area==='Q'}">خرج Q</button></div>
     <label>رقم الوحدة (${area==='I'?'k':'n'}): ${sel('aK',8,k)}</label><label>رقم النقطة (${area==='I'?'g':'m'}): ${sel('aG',8,g)}</label></div>
     <div class="facts"><div class="fact"><span>العنوان</span><b>${area}${k}.${g}</b></div><div class="fact"><span>المعنى</span><b style="font-family:var(--font);font-size:15px">${area==='I'?'نقطة الدخل':'نقطة الخرج'} رقم ${g} في ${area==='I'?'وحدة الدخل':'وحدة الخرج'} رقم ${k}</b></div></div>
     <div style="display:flex;gap:4px;margin-top:10px;direction:ltr;flex-wrap:wrap">${Array.from({length:8},(_,i)=>`<span class="bit ${i===g?'one':''}" style="min-width:52px;text-align:center">${area}${k}.${i}</span>`).join('')}</div><p class="sub">الوحدة الواحدة فيها 8 نقاط (ص 9).</p>`;
    el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{area=b.dataset.a;aView()});$('#aK').onchange=e=>{k=+e.target.value;aView()};$('#aG').onchange=e=>{g=+e.target.value;aView()}};
  $('#aChk').onclick=()=>{const v=$('#aIn').value.trim().toUpperCase().replace(/\s+/g,'');const m=v.match(/^([IQ])(\d+)\.(\d+)$/);let h;
    if(!m)h='الصيغة غير صحيحة. العنوان يكتب: حرف I أو Q، ثم رقم الوحدة، ثم نقطة، ثم رقم النقطة. مثل <span class="ltr mono">I1.3</span> أو <span class="ltr mono">Q4.5</span>.';
    else if(+m[3]>7)h=`<b>غير صحيح:</b> رقم النقطة ${m[3]} أكبر من 7. في كل وحدة 8 نقاط فقط مرقمة 0…7 (توضيح: ليس من نص الكتاب، والكتاب يذكر أن في كل وحدة 8 نقاط).`;
    else h=`<b>صحيح:</b> <span class="ltr mono">${v}</span> = ${m[1]==='I'?'نقطة دخل (مفتاح تشغيل أو فصل)':'نقطة خرج (حمل)'} رقم ${m[3]} في الوحدة رقم ${m[2]}.`;
    $('#aRes').innerHTML=`<div class="callout ${m&&+m[3]<=7?'':'err'}">${h}</div>`};
  const pb=$('#nPb');pb.addEventListener('pointerdown',e=>{e.preventDefault();press=1;pb.classList.add('down');nView()});['pointerup','pointerleave','pointercancel'].forEach(ev=>pb.addEventListener(ev,()=>{if(press){press=0;pb.classList.remove('down');nView()}}));
  nView();mView();aView();
 },
 quiz:[
  {q:'كم طريقة لكتابة البرنامج ذكرها الكتاب؟',o:['طريقتان','ثلاث طرق','أربع طرق','طريقة واحدة'],c:1,e:'LAD و FBD (CSF) و STL.'},
  {q:'مخطط البوابات المنطقية يسمى في برنامج Step5:',o:['LAD','FBD','CSF','STL'],c:2,e:'CSF في Step5، و FBD في Step7.'},
  {q:'ما الفرق الأساسي بين المخطط السلمي ومخطط مسار التيار؟',o:['السلمي يرسم أفقياً','السلمي بلا مفاتيح','السلمي للمحركات فقط','لا فرق'],c:0,e:'«مع فارق أساسي وهي أنها ترسم بشكل أفقي» ص 7.'},
  {q:'الرمز ‎-|/|-‎ في المخطط السلمي يمثل:',o:['مفتاحاً مفتوحاً N.O.','مفتاحاً مغلقاً N.C. (فصل)','الخرج','مصهراً حرارياً فقط'],c:1,e:'المفاتيح المغلقة: مفاتيح الفصل والمصهرات وضواغط الفصل.'},
  {q:'في العنوان I1.3، الرقم 1 يمثل:',o:['رقم النقطة','رقم وحدة الدخل','رقم الخرج','عدد الضواغط'],c:1,e:'I k.g: k رقم الوحدة و g رقم المفتاح داخلها.'},
  {q:'كم نقطة دخل في كل وحدة دخل حسب الكتاب؟',o:['4','8','16','32'],c:1,e:'«في كل وحدة دخل يوجد بها (8) نقاط دخل».'},
  {q:'رمز الخرج ‎-( )-‎ يستخدم لـ:',o:['المصابيح فقط','المحركات فقط','جميع أنواع المخارج: مصابيح ومتممات ومحركات','المفاتيح'],c:2,e:'«وهذا الرمز ثابت لجميع أنواع المخارج».'},
  {q:'ما الخطوة الأولى في كتابة أي برنامج؟',o:['كتابة البرنامج','ترميز نقاط الدخل والخرج','دراسة النظام المراد التحكم فيه','نقل البرنامج إلى الـ PLC'],c:2,e:'الخطوات: الدراسة، ثم الترميز، ثم كتابة البرنامج (ص 9).'}
 ]
});

/* =====================================================================
   Lesson 1.4 — LAD example 1 (ص 9–10)
   ===================================================================== */
circuitLesson({
 id:'u1-l4',unit:1,order:4,pages:'9–10',
 title:'المخطط السلمي — مثال 1: تشغيل لمبة',
 summary:'تحويل مخطط مسار التيار لتشغيل لمبة H1 بالضاغط S1 (الشكل 1-2) إلى المخطط السلمي (الشكل 2-2).',
 theory:[
  {h:'مثال 1: تشغيل لمبة',ref:'ص 9',html:'<p>«الشكل (1-2) يوضح مخطط مسار التيار لتشغيل لمبة. والمطلوب: حول الدائرة التالية من مخطط مسار التيار إلى دائرة (LAD).»</p>'},
  {fig:'(1-2)',ref:'ص 9',caption:'مخطط مسار التيار لتشغيل لمبة: L1 ← S1 ← H1 ← N',draw:()=>hwBox(TREE.ex1,()=>0,C.ex1.coil,1.4)},
  {h:'1- الدراسة',ref:'ص 10',html:'<p>«من الشكل (1-2) المبين يتم تشغيل الحمل (اللمبة H1) بالضغط على المفتاح (S1).»</p>'},
  {h:'2- الترميز',ref:'ص 10',html:bookTable([['S1','I0.0'],['H1','Q4.5']])},
  {h:'3- الرسم',ref:'ص 10'},
  {fig:'(2-2)',ref:'ص 10',caption:'المخطط السلمي: تلامس مفتوح I0.0 يغذي الخرج Q4.5',draw:()=>progFig(C.ex1.program,'lad',C.ex1.io)},
  {note:AR_NOTE+'الكتاب يكتفي هنا بالمخطط السلمي. للمقارنة، البرنامج نفسه بلغة FBD ثم STL (نقلناه نحن):'},
  {fig:'',caption:'البرنامج نفسه بلغة FBD (منقول، ليس من الكتاب)',draw:()=>progFig(C.ex1.program,'fbd',C.ex1.io)},
  {fig:'',caption:'البرنامج نفسه بلغة STL (منقول، ليس من الكتاب)',draw:()=>progFig(C.ex1.program,'stl',C.ex1.io)}
 ],
 steps:[
  {t:'الوضع الابتدائي',x:'الضاغط S1 غير مضغوط: لا يصل الجهد إلى اللمبة في مخطط مسار التيار، والتلامس I0.0 في الـ LAD مقطوع.'},
  {t:'اضغط S1',x:'اضغط S1 مطوّلاً من الشريط العلوي. يصل الجهد عبر S1 إلى H1، وفي الـ LAD يصبح I0.0 = 1 فيتغذى الخرج Q4.5.',done:s=>s.Q('Q4.5')},
  {t:'ارفع إصبعك',x:'اترك S1. تنطفئ اللمبة فوراً: لا يوجد تعويض ذاتي في هذه الدائرة.',done:s=>!s.btn('S1')&&!s.Q('Q4.5')},
  {t:'بدّل لغة العرض',x:'في لوحة البرنامج اضغط FBD ثم STL، ثم اضغط S1 مرة أخرى. لاحظ أن RLO في STL يصبح 1 عند الضغط.'},
  {t:'شاهد المسح ببطء',x:'في تبويب «برنامج الـ PLC» فعّل «تشغيل المسح ببطء» واضغط S1: الـ PLC يقرأ المداخل أولاً ثم ينفذ Network 1 ثم يكتب المخرج.'}
 ],
 quiz:[
  {q:'في مثال 1، ما عنوان الضاغط S1؟',o:['I0.1','Q4.5','I0.0','I4.5'],c:2,e:'جدول الترميز ص 10: S1 = I0.0.'},
  {q:'ما عنوان اللمبة H1؟',o:['Q4.5','I0.0','Q0.0','H1'],c:0,e:'H1 = Q4.5.'},
  {q:'ماذا يمثل الرقم 4 في العنوان Q4.5؟',o:['رقم النقطة','رقم وحدة الخرج','عدد اللمبات','زمن التشغيل'],c:1,e:'Q n.m: n رقم وحدة الخرج و m رقم النقطة.'},
  {q:'أي رمز LAD يناسب الضاغط S1 في هذا المثال؟',o:['‎-|/|-‎','‎-| |-‎','‎-( )-‎','بوابة OR'],c:1,e:'S1 ضاغط تشغيل مفتوح N.O.'},
  {q:'ماذا يحدث للمبة عند رفع الإصبع عن S1؟',o:['تبقى مضيئة','تنطفئ لأنه لا يوجد تعويض ذاتي','تومض','يفصل الـ PLC'],c:1,e:'الحمل يعمل فقط ما دام S1 مضغوطاً.'},
  {q:'ما البرنامج المكافئ بلغة STL؟',o:['AN I 0.0 / = Q 4.5','A I 0.0 / = Q 4.5','O Q 4.5 / = I 0.0','A Q 4.5 / = I 0.0'],c:1,e:'A I 0.0 ثم = Q 4.5.'}
 ]
},{ex1:C.ex1},'ex1');

/* =====================================================================
   Lesson 1.5 — LAD example 2 (ص 10–12)
   ===================================================================== */
circuitLesson({
 id:'u1-l5',unit:1,order:5,pages:'10–12',
 title:'المخطط السلمي — مثال 2: تشغيل من مكانين والفصل من مكان واحد',
 summary:'مجموعة إضاءة H1 تعمل بالضاغط S1 أو S2 وتفصل بالضاغط S0 (الشكل 3-2)، وتحويلها إلى المخطط السلمي.',
 theory:[
  {h:'مثال 2: تشغيل مجموعة أحمال من مكانين والفصل من مكان واحد',ref:'ص 10',html:'<p>«الشكل (3-2) يمثل مخطط مسار التيار لدائرة تشغيل مجموعة أحمال من مكانين مختلفين والفصل من مكان واحد، والمطلوب: تحويل الدائرة التالية من مخطط مسار التيار إلى دائرة (LAD).»</p>'},
  {fig:'(3-2)',ref:'ص 10',caption:'مخطط مسار التيار: L1 ← S0 (مغلق) ← [S1 ∥ S2] ← H1 ← N',draw:()=>hwBox(TREE.ex2,()=>0,C.ex2.coil,1.35)},
  {h:'1- الدراسة',ref:'ص 11',html:'<p>«من الشكل (3-2) المبين يتم تشغيل الحمل (مجموعة إضاءة H1) بالضغط على الضاغط (S1 أو S2) والفصل بالضغط على (S0).»</p><p>الضاغطان S1 و S2 على <b>التوازي</b> (أيهما يكفي)، و S0 على <b>التوالي</b> قبلهما (إذا ضُغط يقطع الكل).</p>'},
  {h:'2- الترميز',ref:'ص 11',html:bookTable([['S0','I0.0'],['S1','I0.1'],['S2','I0.2'],['H1','Q4.5']])},
  {h:'3- الرسم: المخطط السلمي',ref:'ص 12',html:'<p>الرسم في الكتاب بلا رقم شكل، وعليه التسميات: I0.0 مفتاح فصل، I0.1 مفتاح تشغيل أول، I0.2 مفتاح تشغيل ثانٍ، Q4.5 مجموعة إضاءة (حمل).</p>'},
  {fig:'',ref:'ص 12',caption:'المخطط السلمي لمثال 2: تلامس مغلق I0.0 ثم فرعان متوازيان I0.1 و I0.2 ثم الخرج Q4.5',draw:()=>progFig(C.ex2.program,'lad',C.ex2.io)},
  {note:AR_NOTE+'لماذا رسمنا S0 في الـ LAD تلامساً مغلقاً ‎-|/|-‎ مع أنه موصّل في الـ PLC بحيث يعطي 1 عند الضغط؟ لأن البرنامج يجب أن <b>يقطع</b> عندما يصبح I0.0 = 1، والتلامس المغلق يقطع عندما تكون إشارته 1. وبلغة STL يصبح البرنامج: <span class="ltr mono">AN I 0.0 · A( · O I 0.1 · O I 0.2 · ) · = Q 4.5</span>.'}
 ],
 steps:[
  {t:'الوضع الابتدائي',x:SW_NOTE+' كل المفاتيح الآن غير مضغوطة: S0 المغلق يمرر الجهد، لكن S1 و S2 مفتوحان فلا تعمل H1.'},
  {t:'شغّل من المكان الأول',x:'انقر S1. تضيء مجموعة الإضاءة. لاحظ في الـ LAD أن الفرع العلوي I0.1 هو الذي يمرر.',done:s=>s.btn('S1')&&s.Q('Q4.5')},
  {t:'شغّل من المكان الثاني',x:'أرجع S1 (انقره ثانية) ثم انقر S2. تعمل H1 أيضاً: هذا معنى التوازي (أو).',done:s=>!s.btn('S1')&&s.btn('S2')&&s.Q('Q4.5')},
  {t:'افصل بـ S0',x:'والمفتاح S2 مازال مضغوطاً، انقر S0. تنطفئ H1 لأن S0 على التوالي مع الكل.',done:s=>s.btn('S0')&&s.btn('S2')&&!s.Q('Q4.5')},
  {t:'جرّب الاثنين معاً',x:'اترك S0 مضغوطاً وانقر S1 أيضاً. لا تعمل H1 مهما ضغطت من مفاتيح التشغيل ما دام S0 مضغوطاً.',done:s=>s.btn('S0')&&s.btn('S1')&&s.btn('S2')&&!s.Q('Q4.5')},
  {t:'أرجع كل المفاتيح',x:'انقر S0 و S1 و S2 لترجع كلها. تنطفئ H1.',done:s=>!s.btn('S0')&&!s.btn('S1')&&!s.btn('S2')},
  {t:'قارن اللغات',x:'بدّل في لوحة البرنامج بين LAD و FBD و STL مع الضغط. لاحظ أن الفرعين المتوازيين في LAD هما بوابة OR في FBD وهما القوس A( O O ) في STL.'}
 ],
 quiz:[
  {q:'في مثال 2، كيف يوصل S1 و S2؟',o:['على التوالي','على التوازي','كل واحد في دائرة','S2 مغلق'],c:1,e:'التشغيل من مكانين = توازي، أيهما يكفي.'},
  {q:'ما عنوان ضاغط الفصل S0؟',o:['I0.1','I0.0','Q4.5','I0.2'],c:1,e:'جدول ص 11: S0 = I0.0.'},
  {q:'ضغطت S1 و S0 معاً. ما حالة H1؟',o:['تعمل','لا تعمل','تعمل نصف إضاءة','تعمل ثم تفصل بعد زمن'],c:1,e:'S0 على التوالي ويقطع الكل.'},
  {q:'كيف يُرسم S0 في المخطط السلمي؟',o:['‎-| |-‎','‎-|/|-‎','‎-( )-‎','لا يرسم'],c:1,e:'مفتاح الفصل يرسم تلامساً مغلقاً N.C.'},
  {q:'ما الذي يمثل «مجموعة الإضاءة (حمل)» في الـ LAD؟',o:['I0.0','I0.2','Q4.5','S0'],c:2,e:'الخرج Q4.5.'},
  {q:'أي سطر STL يمثل S0؟',o:['A I 0.0','AN I 0.0','O I 0.0','= I 0.0'],c:1,e:'AN = و-ليس، أي يمرر عندما I0.0 = 0.'},
  {q:'بعد أن تعمل H1 بالضغط على S2، تركت S2. ماذا يحدث؟',o:['تبقى H1 تعمل','تنطفئ H1','يعمل S1 تلقائياً','يفصل S0'],c:1,e:'لا يوجد تعويض ذاتي في دوائر الوحدة.'}
 ]
},{ex2:C.ex2},'ex2');

/* =====================================================================
   Lesson 1.6 — LAD exercise set 1 (ص 12–16)
   ===================================================================== */
const curL6=circuitLesson({
 id:'u1-l6',unit:1,order:6,pages:'12–16',
 title:'مجموعة التمارين الأولى بالمخطط السلمي (أ، ب، ج)',
 summary:'ثلاث دوائر: إضاءة H7 من أربعة أماكن، متمم K10 من أربعة أماكن والفصل من ثلاثة، ومحرك K5 من ثلاثة أماكن والفصل من مكانين، بالدراسة والترميز والمخطط السلمي.',
 theory:[
  {h:'مجموعة تمارين أولى',ref:'ص 12',html:'<p>«المطلوب: اكتب برنامج التحكم باستخدام (LAD). لكل دائرة من دوائر التحكم التالية:»</p>'},
  {h:'أ- تشغيل مجموعة إضاءة من أربعة أماكن بشرط أن يكون التشغيل من مكانين مختلفين على التوالي',ref:'ص 12–13'},
  {fig:'',ref:'ص 12',caption:'مخطط مسار التيار للتمرين (أ): [S1 ∥ S2] ← S3 (مغلق) ← [S4 ∥ S5] ← H7',draw:()=>hwBox(TREE.A,()=>0,C.A.coil,1.3)},
  {html:'<p><b>1- الدراسة (ص 13):</b> «من الشكل المبين يتم تشغيل الحمل (مجموعة الإضاءة H7) بالضغط على المفتاح (S1 أو S2) مع الضغط على المفتاح (S4 أو S5). أما الضاغط (S3) فهو ضاغط فصل.»</p><p><b>2- الترميز:</b></p>'+bookTable([['S1','I0.1'],['S2','I0.2'],['S4','I0.4'],['S5','I0.5'],['S3','I0.3'],['H7','Q4.5']])+'<p><b>3- الرسم (LAD):</b></p>'},
  {fig:'',ref:'ص 13',caption:'المخطط السلمي للتمرين (أ)',draw:()=>progFig(C.A.program,'lad',C.A.io)},
  {h:'ب- تشغيل متمم من أربعة أماكن اثنان على التوالي واثنان منفصلان، والفصل من ثلاثة أماكن',ref:'ص 13–15',html:'<p>«الأول فصل رئيس والثاني للتشغيل على التوالي والثالث للتشغيل على التوازي.»</p>'},
  {fig:'',ref:'ص 14',caption:'مخطط مسار التيار للتمرين (ب): S1 (مغلق) ثم فرعان: [S2 ← S5 ← S6 مغلق] ∥ [(S3 ∥ S4) ← S7 مغلق] ← K10',draw:()=>hwBox(TREE.Bk,()=>0,C.B.coil,1.25)},
  {html:'<p><b>1- الدراسة (ص 14):</b> «من الشكل المبين يتم تشغيل المتمم (k10) بالضغط على المفتاح (S4 أو S3) أو بالضغط على (S2 مع S5) بالتوالي. أما الفصل فيتم عن طريق مفتاح الفصل الرئيس (S1) أو مفتاح الفصل (S7) الخاص بفصل مجموعة التشغيل (S3 أو S4) أو ضاغط الفصل (S6) الخاص بمجموعة التشغيل على التوالي (S2 مع S5).»</p><p><b>2- الترميز:</b></p>'+bookTable([['S1','I1.1'],['S2','I1.2'],['S5','I1.5'],['S3','I1.3'],['S4','I1.4'],['S6','I1.6'],['S7','I1.7'],['K10','Q4.5']])+'<p><b>3- الرسم (LAD) ص 15:</b> في الـ LAD رسم الكتاب فرع (S3 ∥ S4) مع S7 في الأعلى وفرع S2 و S5 و S6 تحته، والنتيجة واحدة.</p>'},
  {fig:'',ref:'ص 15',caption:'المخطط السلمي للتمرين (ب)',draw:()=>progFig(C.B.program,'lad',C.B.io)},
  {h:'ج- تشغيل محرك من ثلاثة أماكن مختلفة والفصل من مكانين',ref:'ص 15–16',html:'<p>«الأول فصل لجميع نقاط التشغيل والثاني فصل لنقاط تشغيل التوازي.»</p>'},
  {fig:'',ref:'ص 15',caption:'مخطط مسار التيار للتمرين (ج): N.C1 ثم فرعان: N.O1 ∥ [(N.O2 ∥ N.O3) ← N.C2] ← K5',draw:()=>hwBox(TREE.Ck,()=>0,C.C.coil,1.25)},
  {html:'<p><b>1- الدراسة (ص 15):</b> «من الشكل المبين يتم تشغيل المحرك (M) عن طريق المفاتيح (N.O1 أو N.O2 أو N.O3). والفصل عن طريق (N.C1 أو N.C2).»</p><p><b>2- الترميز (ص 16):</b></p>'+bookTable([['N.O1','I1.4'],['N.O2','I1.2'],['N.O3','I1.3'],['N.C1','I1.1'],['N.C2','I1.5'],['K5','Q4.5']])+'<p><b>3- الرسم (LAD):</b></p>'},
  {fig:'',ref:'ص 16',caption:'المخطط السلمي للتمرين (ج)',draw:()=>progFig(C.C.program,'lad',C.C.io)},
  {err:'في التمرين (ج) نص الدراسة يسمي الحمل «المحرك (M)»، بينما الرسم والترميز يستعملان الملف <b>K5</b>. المقصود واحد: K5 ملف المتمم الذي يشغّل المحرك. في المختبر سمّينا الحمل «المحرك (ملف K5)».'},
  {note:AR_NOTE+'لاحظ أن N.C2 لا يفصل إلا مجموعة التوازي (N.O2 و N.O3)، أما N.O1 فيبقى يشغّل المحرك حتى لو ضُغط N.C2، و N.C1 يفصل الكل. جرّب ذلك في المختبر واختر الدائرة من أعلى اللوحة.'}
 ],
 steps:[
  {t:'(أ) شغّل مجموعة الإضاءة',x:SW_NOTE+' الدائرة (أ) مختارة. انقر S1 ثم S4: تعمل H7. مفتاح واحد لا يكفي لأن المجموعتين على التوالي.',done:s=>(s.variant||'a')==='a'&&s.Q('Q4.5')},
  {t:'(أ) افصل بـ S3',x:'انقر S3 (ضاغط الفصل): تنطفئ H7. ثم أرجعه.',done:s=>(s.variant||'a')==='a'&&s.btn('S3')&&!s.Q('Q4.5')},
  {t:'(ب) شغّل المتمم من S3 أو S4',x:'اختر «تمرين ب» من أعلى اللوحة، ثم انقر S3 أو S4: يعمل K10.',done:s=>s.variant==='b'&&s.Q('Q4.5')&&(s.btn('S3')||s.btn('S4'))},
  {t:'(ب) افصل مجموعة S3/S4 بـ S7',x:'انقر S7: يفصل K10 لأن S7 يخص مجموعة S3/S4.',done:s=>s.variant==='b'&&s.btn('S7')&&(s.btn('S3')||s.btn('S4'))&&!s.Q('Q4.5')},
  {t:'(ب) التشغيل بالتوالي',x:'أرجع S3 و S4 و S7، ثم انقر S2 و S5 معاً: يعمل K10. واحد منهما وحده لا يكفي.',done:s=>s.variant==='b'&&s.btn('S2')&&s.btn('S5')&&!s.btn('S3')&&!s.btn('S4')&&s.Q('Q4.5')},
  {t:'(ب) الفصل الرئيس S1',x:'انقر S1: يفصل K10 مهما كانت مفاتيح التشغيل.',done:s=>s.variant==='b'&&s.btn('S1')&&!s.Q('Q4.5')},
  {t:'(ج) شغّل المحرك',x:'اختر «تمرين ج»، وأرجع أي مفتاح مضغوط، ثم انقر N.O2: يدور المحرك.',done:s=>s.variant==='c'&&s.btn('N.O2')&&s.Q('Q4.5')},
  {t:'(ج) N.C2 يفصل التوازي فقط',x:'انقر N.C2: يقف المحرك. الآن انقر N.O1: يدور مرة أخرى رغم N.C2.',done:s=>s.variant==='c'&&s.btn('N.C2')&&s.btn('N.O1')&&s.Q('Q4.5')},
  {t:'(ج) N.C1 يفصل الكل',x:'انقر N.C1: يقف المحرك مهما كانت المفاتيح الأخرى.',done:s=>s.variant==='c'&&s.btn('N.C1')&&!s.Q('Q4.5')}
 ],
 quiz:[
  {q:'في التمرين (أ)، أي توليفة تشغّل H7؟',o:['S1 وحده','S1 و S2','S2 و S5','S4 و S5'],c:2,e:'لا بد من مفتاح من (S1 أو S2) ومفتاح من (S4 أو S5) معاً.'},
  {q:'في التمرين (أ)، ما عنوان ضاغط الفصل S3؟',o:['I0.3','I1.3','Q4.5','I0.5'],c:0,e:'جدول ص 13: S3 = I0.3.'},
  {q:'في التمرين (ب)، أي مفتاح يفصل مجموعة التشغيل S3/S4 فقط؟',o:['S1','S6','S7','S5'],c:2,e:'S7 لمجموعة S3 أو S4، و S6 لمجموعة التوالي S2 مع S5.'},
  {q:'في التمرين (ب)، ضغطت S2 و S5 و S6 معاً. ما حالة K10؟',o:['يعمل','لا يعمل','يعمل بعد زمن','يعمل نصف قدرة'],c:1,e:'S6 مغلق على التوالي مع S2 و S5 فيقطع هذا الفرع.'},
  {q:'في التمرين (ب)، ما المفتاح الذي يفصل في كل الحالات؟',o:['S1 (الفصل الرئيس)','S6','S7','S4'],c:0,e:'S1 على التوالي قبل الفرعين.'},
  {q:'في التمرين (ج)، ضغطت N.C2 ثم N.O1. هل يعمل المحرك؟',o:['نعم، لأن N.C2 يفصل نقاط التوازي فقط','لا، لأن N.C2 يفصل الكل','نعم بعد زمن','لا يعمل إلا مع N.O2'],c:0,e:'N.O1 في فرع مستقل لا يمر عبر N.C2.'},
  {q:'في التمرين (ج)، ما عنوان N.O1؟',o:['I1.1','I1.2','I1.4','I1.5'],c:2,e:'جدول ص 16: N.O1 = I1.4.'},
  {q:'كيف يرسم مفتاح الفصل الرئيس I1.1 في الـ LAD للتمرين (ب)؟',o:['‎-| |-‎ في أول السطر','‎-|/|-‎ في أول السطر قبل الفرعين','‎-( )-‎','‎-|/|-‎ في فرع S2 فقط'],c:1,e:'تلامس مغلق على التوالي مع كل ما بعده.'}
 ]
},{a:C.A,b:C.B,c:C.C},'a','اختر التمرين: (أ) إضاءة H7، (ب) المتمم K10، (ج) المحرك K5. الضواغط في الشريط العلوي تتغير مع التمرين.');

/* =====================================================================
   Lesson 1.7 — FBD gates and examples (ص 17–20)
   ===================================================================== */
circuitLesson({
 id:'u1-l7',unit:1,order:7,pages:'17–20',
 title:'مخطط البوابات المنطقية (FBD): البوابات الأساسية ومثالان',
 summary:'بوابات AND و OR و NOT وما تكافئه من توصيل المفاتيح، ثم تحويل الشكلين (5-2) و (6-2) من مخطط مسار التيار إلى FBD.',
 theory:[
  {h:'ثانياً: مخطط البوابات المنطقية (CSF / FBD)',ref:'ص 17',html:'<p>«مخطط البوابات المنطقية (Control System Flowchart) واختصارها (CSF) على برنامج (Step5). أما على برنامج (Step7) فتسمى مخطط البوابات المنطقية بـ (Function Block Diagram) واختصارها (FBD). وهذه الطريقة يتم استخدام البوابات المنطقية في تنفيذ عمليات التحكم. والبوابات الأساسية الثلاث هي المستخدمة. وهي على النحو التالي:»</p>'},
  {h:'1- بوابة (و) AND',ref:'ص 17',html:'<p>رمزها مستطيل بداخله <b class="ltr">&amp;</b>. «من شروط هذه البوابة أن يكون لها على الأقل دخلان. وهذه البوابة تكافئ توصيل مفتاحين على <b>التوالي</b> إذا كان لها مدخلان، أو ثلاث مفاتيح إذا كان لها ثلاثة مداخل وهكذا. علماً بأن أقصى عدد مداخل لبوابة (AND) هو (8) مداخل.»</p>'},
  {h:'2- بوابة (أو) OR',ref:'ص 17',html:'<p>رمزها مستطيل بداخله <b class="ltr">&gt;=1</b>. «من شروط هذه البوابة أن يكون لها على الأقل مدخلان. وهذه البوابة تكافئ توصيل مفتاحين على <b>التوازي</b> إذا كان لها مدخلان، أو ثلاثة مفاتيح إذا كان لها ثلاثة مداخل وهكذا. علماً بأن أقصى عدد مداخل لبوابة (OR) هو (8) مداخل.»</p>'},
  {h:'3- بوابة (لا) NOT',ref:'ص 17',html:'<p>رمزها خط ينتهي بدائرة صغيرة <b class="ltr">——o</b>. «من شروط هذه البوابة أن لها دخلاً واحداً والخرج يكون عكس الدخل دائماً. وهي تمثل مفتاحاً مغلقاً (N.C).»</p>'},
  {note:AR_NOTE+'جرّب البوابات في الأداة التالية: غيّر المداخل وشاهد الخرج، والدائرة الكهربائية المكافئة (توالي، توازي، مفتاح مغلق)، وجدول الحقيقة الذي يسرد كل الحالات.'},
  {widget:(el,B)=>{let g='and',n=2,v=[0,0,0,0];
    const draw=()=>{const ins=g==='not'?1:n,vals=v.slice(0,ins);const out=g==='and'?vals.every(x=>x):g==='or'?vals.some(x=>x):!vals[0];
      const names=vals.map((_,i)=>'S'+(i+1));const tree=g==='and'?{s:names.map(x=>L_(x))}:g==='or'?{p:names.map(x=>L_(x))}:{s:[L_('S1',1)]};
      const stl=g==='not'?['AN I 0.1','= Q 4.0']:(g==='and'?names.map((x,i)=>'A I 0.'+(i+1)):names.map((x,i)=>'O I 0.'+(i+1))).concat(['= Q 4.0']);
      const P=B.createPLC([{stl}]);vals.forEach((x,i)=>P.set('I0.'+(i+1),x));P.scan(0.05);const nm={};names.forEach((x,i)=>nm['I0.'+(i+1)]=x);nm['Q4.0']='H';
      let tt='';if(ins<=3){const rows=1<<ins;tt=`<div class="tablebox" style="max-width:${120+ins*60}px"><table class="tt"><thead><tr>${names.map(x=>`<th>${x}</th>`).join('')}<th>الخرج</th></tr></thead><tbody>`;
        for(let r=0;r<rows;r++){const bits=names.map((_,i)=>(r>>(ins-1-i))&1);const o=g==='and'?bits.every(x=>x):g==='or'?bits.some(x=>x):!bits[0];const cur=bits.every((b,i)=>b===vals[i]);
          tt+=`<tr style="${cur?'background:var(--blue-soft);font-weight:700':''}">${bits.map(b=>`<td class="mono">${b}</td>`).join('')}<td class="mono">${o?1:0}</td></tr>`}tt+='</tbody></table></div>'}
      el.innerHTML=`<div class="fig"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="seg" role="group">${[['and','AND (و)'],['or','OR (أو)'],['not','NOT (لا)']].map(([k,t])=>`<button data-g="${k}" aria-pressed="${g===k}">${t}</button>`).join('')}</div>
        ${g!=='not'?`<label>عدد المداخل: <select data-n style="font:inherit;padding:3px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg)">${[2,3,4].map(k=>`<option ${k===n?'selected':''}>${k}</option>`).join('')}</select></label>`:''}</div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${names.map((x,i)=>`<button class="sw" data-i="${i}" aria-pressed="${!!vals[i]}"><span class="knob"></span><b>${x}</b><small>${vals[i]?'1 مضغوط':'0'}</small></button>`).join('')}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;align-items:start;margin-top:8px">
         <div style="grid-column:1/-1"><h3 class="sm">البوابة (FBD)</h3><div class="svgbox" style="max-width:560px">${B.fbdNetwork(P.nets[0],P,nm)}</div></div>
         <div><h3 class="sm">ما تكافئه في مخطط مسار التيار</h3>${hwBox(tree,x=>vals[names.indexOf(x)],{l:'H',kind:'lamp'},1.1)}</div>
         <div><h3 class="sm">جدول الحقيقة</h3>${tt||'<p class="sub">جدول 4 مداخل فيه 16 سطراً؛ اختر مدخلين أو ثلاثة لعرضه.</p>'}</div></div>
        <p class="sub">الخرج الآن = <b>${out?1:0}</b>. ${g==='and'?'AND: الخرج 1 فقط إذا كانت كل المداخل 1 (مفاتيح على التوالي). أقصى عدد مداخل في الكتاب 8.':g==='or'?'OR: الخرج 1 إذا كان أي مدخل 1 (مفاتيح على التوازي). أقصى عدد مداخل في الكتاب 8.':'NOT: الخرج عكس الدخل دائماً، مثل المفتاح المغلق N.C.'}</p></div>`;
      el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{g=b.dataset.g;draw()});const s=el.querySelector('[data-n]');if(s)s.onchange=e=>{n=+e.target.value;draw()};
      el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{v[+b.dataset.i]^=1;draw()})};draw()}},
  {h:'مثال 1',ref:'ص 18–19',html:'<p>«الشكل (5-2) يمثل مخطط مسار التيار لدائرة تشغيل مجموعة أحمال من مكانين مختلفين والفصل من مكان واحد. والمطلوب: تحويل الدائرة التالية من مخطط مسار التيار إلى دائرة (FBD).»</p>'},
  {fig:'(5-2)',ref:'ص 18',caption:'مخطط مسار التيار (نفس دائرة الشكل 3-2)',draw:()=>hwBox(TREE.ex2,()=>0,C.ex2.coil,1.35)},
  {err:'ترقيم الأشكال في الفصل الثاني يقفز من (3-2) إلى (5-2)؛ لا يوجد في الكتاب شكل (4-2).'},
  {html:'<p><b>1- الدراسة (ص 18):</b> «من الشكل (5-2) المبين يتم تشغيل الحمل (مجموعة إضاءة H1) بالضغط على الضاغط (S1 أو S2) والفصل بالضغط على (S0).»</p><p><b>2- الترميز:</b></p>'+bookTable([['S0','I0.0'],['S1','I0.1'],['S2','I0.2'],['H1','Q4.5']])+'<p><b>3- الرسم (ص 19):</b> بوابة OR تجمع I0.1 و I0.2، وخرجها يدخل بوابة AND مع I0.0 معكوساً (بالدائرة الصغيرة)، وخرج AND هو Q4.5.</p>'},
  {fig:'',ref:'ص 19',caption:'مخطط البوابات المنطقية (FBD) لمثال 1',draw:()=>progFig(C.F1.program,'fbd',C.F1.io)},
  {h:'مثال 2',ref:'ص 19–20',html:'<p>«الشكل (6-2) يمثل مخطط مسار التيار لدائرة تشغيل متمم له شروط خاصة كما هو موضح في دائرة مسار التيار. والمطلوب: تحويل دائرة مسار التيار التالية إلى دائرة (FBD).»</p>'},
  {fig:'(6-2)',ref:'ص 19',caption:'مخطط مسار التيار: فرعان متوازيان [S1 ← S2] ∥ [(S3 مغلق ∥ S5) ← S4]، ثم S6 مغلق ← K10',draw:()=>hwBox(TREE.F2,()=>0,C.F2.coil,1.25)},
  {err:'لا توجد في الكتاب «دراسة» ولا جدول «ترميز» لمثال 2؛ الحل (ص 20) يستعمل مباشرة العناوين I3.1…I3.6 والخرج Q5.2. الجدول التالي <b>مستنتج</b> من الحل (Sn ↔ I3.n، و K10 ↔ Q5.2) وليس منصوصاً في الكتاب.'},
  {html:bookTable([['S1','I3.1'],['S2','I3.2'],['S3','I3.3'],['S4','I3.4'],['S5','I3.5'],['S6','I3.6'],['K10','Q5.2']],'الرمز','العنوان (مستنتج)')},
  {html:'<p><b>الحل (ص 20):</b> بوابة OR تجمع I3.3 (معكوساً) و I3.5، ثم AND مع I3.4 = الفرع الأول. وبوابة AND تجمع I3.1 و I3.2 = الفرع الثاني. ثم OR تجمع الفرعين، ثم AND مع I3.6 معكوساً ← Q5.2.</p>'},
  {fig:'',ref:'ص 20',caption:'مخطط البوابات المنطقية (FBD) لمثال 2',draw:()=>progFig(C.F2.program,'fbd',C.F2.io)},
  {note:AR_NOTE+'S3 في الشكل (6-2) تلامس <b>مغلق</b>، لذلك يمرر وهو غير مضغوط: يكفي أن تضغط S4 وحده ليعمل K10. إذا ضغطت S3 فلا بد من S5 مع S4.'}
 ],
 steps:[
  {t:'مثال 1: شغّل بـ S1',x:SW_NOTE+' انقر S1. في FBD لاحظ: مدخل OR الأول = 1 ← خرج OR = 1 ← AND = 1 لأن S0 = 0 والدائرة الصغيرة تعكسه إلى 1.',done:s=>(s.variant||'ex1')==='ex1'&&s.Q('Q4.5')},
  {t:'مثال 1: افصل بـ S0',x:'انقر S0: يصبح مدخل AND المعكوس 0 فتنطفئ H1.',done:s=>(s.variant||'ex1')==='ex1'&&s.btn('S0')&&!s.Q('Q4.5')},
  {t:'مثال 2: S4 وحده',x:'اختر «مثال 2» وأرجع المفاتيح. انقر S4 فقط: يعمل K10 لأن S3 المغلق يمرر.',done:s=>s.variant==='ex2'&&s.btn('S4')&&!s.btn('S3')&&s.Q('Q5.2')},
  {t:'مثال 2: اضغط S3',x:'انقر S3 مع بقاء S4: يفصل K10. ثم انقر S5: يعمل مرة أخرى عبر S5.',done:s=>s.variant==='ex2'&&s.btn('S3')&&s.btn('S5')&&s.btn('S4')&&s.Q('Q5.2')},
  {t:'مثال 2: الفرع الآخر',x:'أرجع S3 و S4 و S5، ثم انقر S1 و S2 معاً: يعمل K10 عبر بوابة AND الثانية.',done:s=>s.variant==='ex2'&&s.btn('S1')&&s.btn('S2')&&!s.btn('S4')&&s.Q('Q5.2')},
  {t:'مثال 2: الفصل بـ S6',x:'انقر S6: يفصل K10 مهما كان الفرع الذي يغذيه.',done:s=>s.variant==='ex2'&&s.btn('S6')&&!s.Q('Q5.2')}
 ],
 quiz:[
  {q:'بوابة AND تكافئ توصيل المفاتيح على:',o:['التوازي','التوالي','مفتاح مغلق','لا تكافئ شيئاً'],c:1,e:'«تكافئ توصيل مفتاحين على التوالي» ص 17.'},
  {q:'ما رمز بوابة OR في FBD؟',o:['&','>=1','=','N'],c:1,e:'مستطيل بداخله ‎>=1‎.'},
  {q:'أقصى عدد مداخل لبوابة AND حسب الكتاب:',o:['2','4','8','16'],c:2,e:'«أقصى عدد مداخل لبوابة (AND) هو (8) مداخل».'},
  {q:'بوابة NOT تمثل:',o:['مفتاحاً مفتوحاً N.O.','مفتاحاً مغلقاً N.C.','مفتاحين على التوازي','الحمل'],c:1,e:'«وهي تمثل مفتاحاً مغلقاً (N.C)».'},
  {q:'بوابة OR بمدخلين قيمتهما 0 و 1. الخرج:',o:['0','1','غير معروف','2'],c:1,e:'يكفي أن يكون أحد المداخل 1.'},
  {q:'في مثال 1، لماذا يدخل I0.0 إلى AND بدائرة صغيرة؟',o:['لأنه ضاغط فصل يجب أن يقطع عندما يصبح 1','لأنه ضاغط تشغيل','لأنه الخرج','لتسريع البرنامج'],c:0,e:'الدائرة الصغيرة = NOT، أي تلامس مغلق.'},
  {q:'في مثال 2 (الشكل 6-2)، أي ضغطة وحدها تشغّل K10؟',o:['S1','S5','S4','S6'],c:2,e:'S3 مغلق يمرر، فيكفي S4، و S6 غير مضغوط.'},
  {q:'ما الذي ينقص مثال 2 في الكتاب؟',o:['الحل FBD','دائرة مسار التيار','الدراسة وجدول الترميز','رقم الشكل'],c:2,e:'الحل يستعمل I3.x و Q5.2 بلا جدول ترميز.'}
 ]
},{ex1:C.F1,ex2:C.F2},'ex1','اختر المثال: مثال 1 (الشكل 5-2) أو مثال 2 (الشكل 6-2).');

/* =====================================================================
   Lesson 1.8 — FBD exercise set 2 (ص 20–24)
   ===================================================================== */
circuitLesson({
 id:'u1-l8',unit:1,order:8,pages:'20–24',
 title:'مجموعة التمارين الثانية بمخطط البوابات المنطقية (أ، ب، ج)',
 summary:'الدوائر نفسها مكتوبة بلغة FBD، مع ملاحظات على اختلاف العناوين بين جداول الترميز والرسوم، ومقارنة بين حل الكتاب للتمرين (ج) والحل المصحح.',
 theory:[
  {h:'مجموعة التمارين الثانية',ref:'ص 20',html:'<p>«المطلوب: اكتب برنامج التحكم باستخدام (FBD). لكل دائرة من دوائر التحكم التالية:»</p>'},
  {h:'أ- تشغيل مجموعة إضاءة من أربعة أماكن بشرط أن يكون التشغيل من مكانين مختلفين على التوالي',ref:'ص 20–21',html:'<p>مخطط مسار التيار (ص 20) هو نفس دائرة التمرين (أ) في المجموعة الأولى: [S1 ∥ S2] ← S3 مغلق ← [S4 ∥ S5] ← H7.</p>'},
  {fig:'',ref:'ص 20',caption:'مخطط مسار التيار للتمرين (أ)',draw:()=>hwBox(TREE.A,()=>0,C.A.coil,1.3)},
  {html:'<p><b>1- الدراسة (ص 21):</b> «من الشكل المبين يتم تشغيل الحمل (مجموعة الإضاءة H7) بالضغط على المفتاح (S1 أو S2) مع الضغط على المفتاح (S4 أو S5). أما الضاغط (S3) فهو ضاغط فصل.»</p><p><b>2- الترميز:</b></p>'+bookTable([['S1','I0.1'],['S2','I0.2'],['S4','I0.4'],['S5','I0.5'],['S3','I0.3'],['H7','Q4.5']])},
  {err:'رسم FBD للتمرين (أ) في ص 21 يستعمل العناوين <b class="ltr">I2.1…I2.5</b> والخرج <b class="ltr">Q2.6</b>، بينما جدول الترميز فوقه يعطي <b class="ltr">I0.1…I0.5</b> و <b class="ltr">Q4.5</b>. البنية المنطقية صحيحة (I2.n تقابل Sn)، لذلك كتبنا البرنامج بعناوين جدول الترميز، ونعرض رسم الكتاب بعناوينه للمقارنة.'},
  {fig:'',ref:'ص 21',caption:'FBD للتمرين (أ) بعناوين جدول الترميز (المستعمل في المختبر)',draw:()=>progFig(C.FA.program,'fbd',C.FA.io)},
  {fig:'',ref:'ص 21',caption:'FBD للتمرين (أ) كما رُسم في الكتاب (I2.x و Q2.6)',draw:()=>progFig([{title:'كما في الكتاب',stl:STL.A_fbd_draw}],'fbd',[])},
  {h:'ب- تشغيل متمم من أربعة أماكن اثنان على التوالي واثنان منفصلان، والفصل من ثلاثة أماكن',ref:'ص 21–23',html:'<p>مخطط مسار التيار (ص 22) مطابق لتمرين (ب) في المجموعة الأولى، والدراسة بالنص نفسه: «يتم تشغيل المتمم (k10) بالضغط على المفتاح (S4 أو S3) أو بالضغط على (S2 مع S5) بالتوالي. أما الفصل فيتم عن طريق مفتاح الفصل الرئيس (S1) أو مفتاح الفصل (S7) الخاص بفصل مجموعة التشغيل (S3 أو S4) أو ضاغط الفصل (S6) الخاص بمجموعة التشغيل على التوالي (S2 مع S5).»</p>'},
  {fig:'',ref:'ص 22',caption:'مخطط مسار التيار للتمرين (ب)',draw:()=>hwBox(TREE.Bk,()=>0,C.B.coil,1.25)},
  {html:'<p><b>الترميز (ص 22):</b></p>'+bookTable([['S1','I1.1'],['S2','I1.2'],['S5','I1.5'],['S3','I1.3'],['S4','I1.4'],['S6','I1.6'],['S7','I1.7'],['K10','Q4.5']])+'<p><b>الرسم (ص 23):</b> OR(S3، S4) ثم AND مع ليس S7 = الفرع الأول؛ AND(S2، S5، ليس S6) = الفرع الثاني؛ OR للفرعين ثم AND مع ليس S1.</p>'},
  {err:'رسم FBD للتمرين (ب) في ص 23 يستعمل <b class="ltr">I3.1…I3.7</b> والخرج <b class="ltr">Q4.1</b>، بينما الترميز <b class="ltr">I1.1…I1.7</b> و <b class="ltr">Q4.5</b>. المنطق صحيح (I3.n تقابل Sn)، فاستعملنا عناوين الترميز.'},
  {fig:'',ref:'ص 23',caption:'FBD للتمرين (ب) بعناوين جدول الترميز',draw:()=>progFig(C.FB.program,'fbd',C.FB.io)},
  {fig:'',ref:'ص 23',caption:'FBD للتمرين (ب) كما رُسم في الكتاب (I3.x و Q4.1)',draw:()=>progFig([{title:'كما في الكتاب',stl:STL.B_fbd_draw}],'fbd',[])},
  {h:'ج- تشغيل محرك من ثلاثة أماكن مختلفة أحد الأماكن يشغل بواسطة مفتاحي توالي، والفصل من ثلاثة أماكن',ref:'ص 23–24',html:'<p>«حيث (S1) فصل في أي حالة تشغيل. (S6) فصل في حالة تشغيل مفتاحي التوالي. (S7) فصل في حالة تشغيل من أي مكان من (S3 أو S4).» ومخطط مسار التيار المرسوم (ص 23) مطابق تماماً لدائرة التمرين (ب): S1…S7 والملف K10.</p>'},
  {fig:'',ref:'ص 23',caption:'مخطط مسار التيار المرسوم في التمرين (ج) — نفس دائرة (ب)',draw:()=>hwBox(TREE.Bk,()=>0,C.B.coil,1.25)},
  {html:'<p><b>الدراسة والترميز كما في ص 24:</b> «من الشكل المبين يتم تشغيل المحرك (M) عن طريق المفاتيح (N.O1 أو N.O2 أو N.O3). والفصل عن طريق (N.C1 أو N.C2).»</p>'+bookTable([['N.O1','I1.4'],['N.O2','I1.2'],['N.O3','I1.3'],['N.C1','I1.1'],['N.C2','I1.5'],['M','Q4.5']])},
  {fig:'',ref:'ص 24',caption:'FBD للتمرين (ج) كما رُسم في الكتاب: OR(I4.3، I4.2) ثم AND مع ليس I4.5، ثم OR مع I4.1، ثم AND مع ليس I4.0 ← Q4.1',draw:()=>progFig([{title:'كما في الكتاب',stl:STL.C_fbd_draw}],'fbd',[])},
  {err:`التمرين (ج) يخلط بين دائرتين:<ol><li>العنوان ونص الوصف والدائرة المرسومة تخص دائرة <b>S1…S7 / K10</b> (مكررة من التمرين ب)، بينما الدراسة والترميز منقولان من تمرين LAD (ج) لدائرة <b>N.O / N.C</b>.</li><li>رسم FBD يطابق في بنيته دائرة N.O/N.C (فصل رئيس ثم [((N.O2 ∥ N.O3) و N.C2) ∥ N.O1])، لكن عناوينه <span class="ltr">I4.x / Q4.1</span> لا تطابق الترميز <span class="ltr">I1.x / Q4.5</span>. وحتى لو قابلنا I4.n بـ I1.n فإن N.O1 (<span class="ltr">I1.4</span>) ظهرت <span class="ltr">I4.1</span>، و N.C1 (<span class="ltr">I1.1</span>) ظهرت <span class="ltr">I4.0</span>.</li><li>الدائرة المرسومة (S1…S7) لا يقابلها أي حل FBD في هذا التمرين.</li></ol>لذلك في المختبر نسختان للتمرين (ج): <b>«كما في الكتاب»</b> تشغّل حل الكتاب (بعناوين جدول الدراسة: N.C1 = I1.1، N.O1 = I1.4، N.O2 = I1.2، N.O3 = I1.3، N.C2 = I1.5، M = Q4.5) أمام الدائرة المرسومة، فترى أنهما لا يتطابقان. و<b>«المصحح»</b> يحل الدائرة المرسومة فعلاً.`},
  {note:AR_NOTE+'في نسخة «كما في الكتاب» وصّلنا مفاتيح الدائرة المرسومة S1…S7 على عناوين جدول التمرين (ب) I1.1…I1.7، لأنها الدائرة نفسها. بالمصادفة يقع الفصل الرئيس S1 على I1.1 في الجدولين، لذلك يفصل S1 في حل الكتاب أيضاً، لكن S2 وحده يشغّل المحرك (خطأ)، و S2 مع S5 لا يشغّله (خطأ)، و S6 و S7 لا يفصلان (خطأ).'},
  {fig:'',ref:'تصحيح (ليس من الكتاب)',caption:'الحل المصحح للدائرة المرسومة في التمرين (ج) بلغة FBD — نفس منطق التمرين (ب)',draw:()=>progFig(C.FCf.program,'fbd',C.FCf.io)}
 ],
 steps:[
  {t:'(أ) راقب البوابات',x:SW_NOTE+' التمرين (أ) مختار. انقر S2 ثم S5: في FBD تصبح بوابتا OR = 1 والمدخل المعكوس S3 = 1 فتخرج AND = 1.',done:s=>(s.variant||'a')==='a'&&s.Q('Q4.5')},
  {t:'(ب) فرع S3/S4',x:'اختر «تمرين ب». انقر S4: يعمل K10. ثم انقر S7: يفصل.',done:s=>s.variant==='b'&&s.btn('S4')&&s.btn('S7')&&!s.Q('Q4.5')},
  {t:'(ب) فرع التوالي',x:'أرجع S4 و S7 ثم انقر S2 و S5: يعمل K10 عبر بوابة AND ذات المداخل الثلاثة.',done:s=>s.variant==='b'&&s.btn('S2')&&s.btn('S5')&&!s.btn('S4')&&!s.btn('S3')&&s.Q('Q4.5')},
  {t:'(ج) كما في الكتاب: S2 وحده',x:'اختر «تمرين ج — كما في الكتاب» وأرجع كل المفاتيح، ثم انقر S2 وحده. الدائرة المرسومة لا تعمل (تحتاج S5 أيضاً)، لكن حل الكتاب يشغّل المحرك! لاحظ رسالة «غير متطابقين».',done:s=>s.variant==='c_book'&&s.btn('S2')&&!s.btn('S5')&&s.Q('Q4.5')},
  {t:'(ج) كما في الكتاب: S2 مع S5',x:'انقر S5 أيضاً. الدائرة المرسومة تعمل الآن، لكن حل الكتاب يفصل المحرك لأنه يعامل I1.5 كضاغط فصل (N.C2).',done:s=>s.variant==='c_book'&&s.btn('S2')&&s.btn('S5')&&!s.Q('Q4.5')},
  {t:'(ج) المصحح',x:'اختر «تمرين ج — المصحح» وكرر: S2 وحده لا يشغّل، و S2 مع S5 يشغّل، و S6 يفصل. الدائرة والبرنامج متطابقان دائماً.',done:s=>s.variant==='c_fixed'&&s.btn('S2')&&s.btn('S5')&&s.Q('Q4.5')},
  {t:'(ج) المصحح: S7',x:'أرجع S2 و S5، ثم انقر S3 ثم S7: يعمل المحرك بـ S3 ويفصله S7.',done:s=>s.variant==='c_fixed'&&s.btn('S3')&&s.btn('S7')&&!s.Q('Q4.5')}
 ],
 quiz:[
  {q:'في التمرين (أ)، ما الفرق بين جدول الترميز ورسم FBD في الكتاب؟',o:['لا فرق','الرسم يستعمل I2.x و Q2.6 بدل I0.x و Q4.5','الرسم بلا بوابة OR','الجدول بلا S3'],c:1,e:'البنية صحيحة لكن العناوين مختلفة (ص 21).'},
  {q:'إذا اختلفت العناوين بين الجدول والرسم والمنطق واحد، ماذا نفعل؟',o:['نترك التمرين','نستعمل عناوين جدول الترميز في البرنامج','نغير الدائرة','نحذف بوابة'],c:1,e:'جدول الترميز هو الذي يحدد أين وصّلنا كل مفتاح.'},
  {q:'كم مدخلاً لبوابة AND التي تمثل فرع S2 و S5 و S6 في التمرين (ب)؟',o:['2','3','4','8'],c:1,e:'AND(S2، S5، ليس S6) ثلاثة مداخل.'},
  {q:'في FBD التمرين (ب)، كيف يدخل الفصل الرئيس S1؟',o:['مدخل معكوس لبوابة AND الأخيرة','مدخل لبوابة OR','لا يدخل','مدخل عادي'],c:0,e:'AND مع ليس S1 بعد OR الفرعين.'},
  {q:'ما مشكلة التمرين (ج) في الكتاب؟',o:['لا توجد مشكلة','الدراسة والترميز والحل لدائرة غير الدائرة المرسومة','بلا عنوان','بلا مخطط مسار تيار'],c:1,e:'الدائرة المرسومة S1…S7 والدراسة لدائرة N.O/N.C.'},
  {q:'في نسخة «كما في الكتاب» للتمرين (ج)، ضغطت S2 وحده. ماذا يحدث؟',o:['المحرك لا يعمل في الاثنين','حل الكتاب يشغّل المحرك والدائرة المرسومة لا تعمل','الدائرة المرسومة تعمل وحل الكتاب لا','يفصل S1'],c:1,e:'حل الكتاب يعامل I1.2 كمفتاح تشغيل منفرد (N.O2).'},
  {q:'الحل المصحح للتمرين (ج) هو نفسه حل:',o:['التمرين (أ)','التمرين (ب)','مثال 1','مثال 2'],c:1,e:'الدائرة المرسومة مطابقة لدائرة (ب).'},
  {q:'رسم FBD في التمرين (ج) يطابق في بنيته دائرة:',o:['N.O / N.C من تمرين LAD (ج)','S1…S7','الشكل (6-2)','الشكل (7-2)'],c:0,e:'فصل رئيس ثم [((N.O2 ∥ N.O3) و ليس N.C2) ∥ N.O1].'}
 ]
},{a:C.FA,b:C.FB,c_book:C.FCb,c_fixed:C.FCf},'a','اختر التمرين. للتمرين (ج) نسختان: «كما في الكتاب» و«المصحح» (انظر ملاحظة الكتاب في الشرح).');

/* =====================================================================
   Lesson 1.9 — STL (ص 25–31)
   ===================================================================== */
circuitLesson({
 id:'u1-l9',unit:1,order:9,pages:'25–31',
 title:'قائمة الإجراءات (STL): مثال ومجموعة التمارين الثالثة',
 summary:'أوامر STL الأساسية A و O و N والأقواس، ثم الشكل (7-2) وتمارين (أ، ب، ج) مكتوبة بقائمة الإجراءات، مع تنفيذها سطراً سطراً.',
 theory:[
  {h:'ثالثاً: قائمة الإجراءات (STL)',ref:'ص 25',html:`<p>«هذه الطريقة يتم فيها وصف الدائرة المراد التحكم فيها، بمجموعة أوامر. وهذه الطريقة أقرب ما تكون إلى البرمجة بلغة التجميع. وهي مجموعة من الأوامر يعبر عنها بحروف كما يلي:»</p>
   <ol><li>عمليات التوالي (AND) يرمز لها بالرمز (<b class="ltr">A</b>).</li><li>عمليات التوازي (OR) يرمز لها بالرمز (<b class="ltr">O</b>).</li><li>والمفاتيح المغلقة (NOT) يرمز لها بالرمز (<b class="ltr">N</b>).</li><li>الأقواس تمثل مجموعة التوازي.</li></ol>`},
  {note:AR_NOTE+'الـ PLC يقرأ الأسطر من الأعلى إلى الأسفل ويحتفظ بنتيجة مؤقتة تسمى <b>RLO</b> (نتيجة العملية المنطقية): 1 تعني «وصل التيار حتى هنا» و 0 تعني «انقطع». السطر <span class="ltr mono">= Q</span> يكتب الـ RLO في المخرج. و <span class="ltr mono">AN</span> = و-ليس، و <span class="ltr mono">A(</span> … <span class="ltr mono">)</span> قوس فيه مجموعة توازٍ، و <span class="ltr mono">O</span> وحده في سطر يفصل بين مجموعتي توالٍ متوازيتين.'},
  {h:'مثال 1',ref:'ص 25–26',html:'<p>«الشكل (7-2) دائرة تشغيل حمل (مجموعة إضاءة) مع الفصل. حول الدائرة التالية من مخطط مسار التيار إلى قائمة الإجراءات (STL).»</p>'},
  {fig:'(7-2)',ref:'ص 25',caption:'مخطط مسار التيار: L1 ← S1 ← S2 (مغلق) ← H1 ← N',draw:()=>hwBox(TREE.S1,()=>0,C.Sx.coil,1.4)},
  {html:'<p><b>1- الدراسة (ص 26):</b> «من الشكل المبين يتم تشغيل مجموعة الإضاءة (H1) عن طريق المفتاح (S1) والفصل عن طريق المفتاح (S2).»</p><p><b>2- الترميز:</b></p>'+bookTable([['S1','I2.4'],['S2','I2.5'],['H1','Q4.1']])+'<p><b>3- قائمة الإجراءات (STL):</b></p>'},
  {fig:'',ref:'ص 26',caption:'قائمة الإجراءات لمثال 1',draw:()=>progFig(C.Sx.program,'stl')},
  {widget:(el,B)=>{let s1=0,s2=0;const P=B.createPLC(C.Sx.program);const draw=()=>{P.set('I2.4',s1);P.set('I2.5',s2);P.scan(0.05);
     el.innerHTML=`<div class="fig"><p class="sub">${AR_NOTE}غيّر المفتاحين وتابع قيمة RLO بعد كل سطر:</p><div style="display:flex;gap:8px;margin-top:8px"><button class="sw" data-k="1" aria-pressed="${!!s1}"><span class="knob"></span><b>S1</b><small>I2.4 = ${s1}</small></button><button class="sw" data-k="2" aria-pressed="${!!s2}"><span class="knob"></span><b>S2</b><small>I2.5 = ${s2}</small></button></div>${B.stlTable(P.nets[0],P)}<p class="sub">H1 (Q4.1) = <b>${P.get('Q4.1')}</b>. ${P.get('Q4.1')?'S1 مضغوط و S2 غير مضغوط.':s2?'السطر AN I 2.5 جعل RLO = 0 لأن S2 مضغوط.':'السطر A I 2.4 أعطى 0 لأن S1 غير مضغوط.'}</p></div>`;
     el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(b.dataset.k==='1')s1^=1;else s2^=1;draw()})};draw()}},
  {h:'مجموعة تمارين ثالثة',ref:'ص 26',html:'<p>«المطلوب: كتابة برنامج التحكم باستخدام (STL). لكل دائرة من دوائر التحكم التالية:»</p>'},
  {h:'أ- تشغيل مجموعة إضاءة من أربعة أماكن بشرط أن يكون التشغيل من مكانين مختلفين على التوالي',ref:'ص 26–27',html:'<p>مخطط مسار التيار (ص 26): [S1 ∥ S2] ← S3 مغلق ← [S4 ∥ S5] ← H7. الدراسة (ص 27) بالنص نفسه: «يتم تشغيل الحمل (مجموعة الإضاءة H7) بالضغط على المفتاح (S1 أو S2) مع الضغط على المفتاح (S4 أو S5). أما الضاغط (S3) فهو ضاغط فصل.»</p>'+bookTable([['S1','I1.1'],['S2','I1.2'],['S4','I1.4'],['S5','I1.5'],['S3','I1.3'],['H7','Q2.5']])},
  {fig:'',ref:'ص 27',caption:'قائمة الإجراءات للتمرين (أ): قوس أول للتوازي S1 ∥ S2، ثم AN S3، ثم قوس ثانٍ S4 ∥ S5',draw:()=>progFig(C.SA.program,'stl')},
  {h:'ب- تشغيل متمم من أربعة أماكن: اثنان على التوالي واثنان منفصلان، والفصل من ثلاثة أماكن',ref:'ص 27–29',html:'<p>مخطط مسار التيار (ص 28): S1 مغلق ← [ (S2 ← S5 ← S6 مغلق) ∥ ((S3 ∥ S4) ← S7 مغلق) ] ← K10. الدراسة (ص 28) بالنص نفسه للتمرين (ب) السابق. الترميز (ص 29):</p>'+bookTable([['S1','I0.1'],['S2','I0.2'],['S5','I0.5'],['S3','I0.3'],['S4','I0.4'],['S6','I0.6'],['S7','I0.7'],['K10','Q4.4']])},
  {fig:'',ref:'ص 29',caption:'قائمة الإجراءات للتمرين (ب). السطر O وحده يفصل مجموعة (S4 ∥ S3)·S7 عن مجموعة S2·S5·S6',draw:()=>progFig(C.SB.program,'stl')},
  {h:'ج- تشغيل محرك من ثلاثة أماكن مختلفة والفصل من مكانين',ref:'ص 30–31',html:'<p>مخطط مسار التيار (ص 30): N.C1 ← [ N.O1 ∥ ((N.O2 ∥ N.O3) ← N.C2) ] ← K5. الدراسة: «من الشكل المبين يتم تشغيل المحرك (K5) عن طريق المفاتيح (N.O1 أو N.O2 أو N.O3). والفصل عن طريق (N.C1 أو N.C2).»</p>'+bookTable([['N.O1','I0.2'],['N.O2','I0.4'],['N.O3','I0.3'],['N.C1','I0.1'],['N.C2','I0.7'],['K5','Q4.4']])},
  {fig:'',ref:'ص 31',caption:'قائمة الإجراءات للتمرين (ج). السطر O I 0.2 يضيف N.O1 موازياً لما قبله داخل القوس',draw:()=>progFig(C.SC.program,'stl')},
  {h:'المطلوب',ref:'ص 31',html:'<p>«كتابة جميع التمارين والأمثلة السابقة على جهاز الحاسب الآلي. ثم نقلها إلى وحدة (PLC) واختبار صحة عمل كل دائرة.»</p>'},
  {note:AR_NOTE+'دوائر H7 و K10 و K5 تكررت في المجموعات الثلاث (LAD ثم FBD ثم STL) بعناوين مختلفة في كل مرة. في المختبر اختر أي دائرة، وبدّل بين LAD و FBD و STL: الثلاث تعطي النتيجة نفسها لكل توليفة ضغط، لأن الـ PLC ينفذ البرنامج نفسه.'}
 ],
 steps:[
  {t:'مثال 1: تابع RLO',x:SW_NOTE+' في لوحة البرنامج اختر STL. انقر S1: السطر A I 2.4 يعطي RLO = 1، ثم AN I 2.5 يبقيها 1، ثم = Q 4.1.',done:s=>(s.variant||'ex1')==='ex1'&&s.Q('Q4.1')},
  {t:'مثال 1: الفصل',x:'انقر S2: السطر AN I 2.5 يجعل RLO = 0 فتنطفئ H1.',done:s=>(s.variant||'ex1')==='ex1'&&s.btn('S2')&&!s.Q('Q4.1')},
  {t:'(أ) القوسان',x:'اختر «تمرين أ». انقر S2 ثم S4: القوس الأول RLO = 1، و AN I 1.3 = 1، والقوس الثاني = 1 ← H7 تعمل.',done:s=>s.variant==='a'&&s.Q('Q2.5')},
  {t:'(ب) السطر O',x:'اختر «تمرين ب». انقر S2 و S5: الجزء الأول قبل O نتيجته 0، والجزء بعد O نتيجته 1، فيعمل K10.',done:s=>s.variant==='b'&&s.btn('S2')&&s.btn('S5')&&s.Q('Q4.4')},
  {t:'(ب) الفصل الرئيس',x:'انقر S1: أول سطر AN I 0.1 يجعل RLO = 0 فيفصل K10.',done:s=>s.variant==='b'&&s.btn('S1')&&!s.Q('Q4.4')},
  {t:'(ج) N.O1 موازٍ للقوس الداخلي',x:'اختر «تمرين ج». انقر N.C2 ثم N.O1: يدور المحرك لأن O I 0.2 جاء بعد AN I 0.7.',done:s=>s.variant==='c'&&s.btn('N.C2')&&s.btn('N.O1')&&s.Q('Q4.4')},
  {t:'شاهد المسح ببطء',x:'في تبويب «برنامج الـ PLC» اختر STL وفعّل «تشغيل المسح ببطء» لترى ترتيب التنفيذ.'}
 ],
 quiz:[
  {q:'في STL، عمليات التوالي يرمز لها بـ:',o:['O','A','N','='],c:1,e:'A = AND (توالي).'},
  {q:'في STL، المفاتيح المغلقة يرمز لها بـ:',o:['A','O','N','C'],c:2,e:'N = NOT، فيكتب AN أو ON.'},
  {q:'ماذا تمثل الأقواس في STL حسب الكتاب؟',o:['مجموعة التوالي','مجموعة التوازي','الخرج','التعليقات'],c:1,e:'«الأقواس تمثل مجموعة التوازي» ص 25.'},
  {q:'في مثال 1 (الشكل 7-2)، ما السطر الذي يمثل S2؟',o:['A I 2.4','AN I 2.5','= Q 4.1','O I 2.5'],c:1,e:'S2 مفتاح فصل مغلق = AN، وعنوانه I2.5.'},
  {q:'في التمرين (ب)، ما وظيفة السطر O وحده؟',o:['ينهي البرنامج','يفصل بين مجموعتي توالٍ متوازيتين','يعكس النتيجة','يكتب المخرج'],c:1,e:'(…)·AN I0.7 أو I0.2·I0.5·AN I0.6.'},
  {q:'ما عنوان K10 في تمرين STL (ب)؟',o:['Q4.5','Q4.4','Q2.5','Q4.1'],c:1,e:'جدول ص 29: K10 = Q4.4.'},
  {q:'في التمرين (ج)، لماذا يعمل المحرك بـ N.O1 حتى مع ضغط N.C2؟',o:['لأن O I 0.2 جاء بعد AN I 0.7 فهو موازٍ لها','لأن N.C2 معطل','لأن N.O1 هو الخرج','لا يعمل'],c:0,e:'AND قبل OR: (… · ليس N.C2) أو N.O1.'},
  {q:'ماذا يفعل السطر ‎= Q 4.4‎؟',o:['يقرأ Q4.4','يكتب نتيجة RLO في المخرج Q4.4','يعكس Q4.4','يمسح البرنامج'],c:1,e:'= يكتب الـ RLO في المخرج.'}
 ]
},{ex1:C.Sx,a:C.SA,b:C.SB,c:C.SC},'ex1','اختر الدائرة: مثال 1 (الشكل 7-2) أو التمارين (أ، ب، ج). البرامج منقولة من الكتاب حرفياً.');

})(PLCBOOK);
