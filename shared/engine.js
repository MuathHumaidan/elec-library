/* =====================================================================
   PLC Book Engine — shared simulation core for every lesson
   - STL interpreter (S7 style: logic, parentheses, S/R, edges, S5 timers, counters)
   - expression trees from STL -> live LAD / FBD drawings
   - generic hard-wired control-circuit renderer with live energization
   - SVG helpers for power circuits, motor/lamp widgets, time chart
   ===================================================================== */
(function(G){
"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------------- addresses & values ---------------- */
function normAddr(area,addr){
  if(!area) return null;
  area=area.toUpperCase();
  if(addr===undefined||addr==='') return area.replace(/\s+/g,'');
  return (area+String(addr)).replace(/\s+/g,'');
}
function parseS5T(s){ // S5T#2M30S, S5T#500MS, S5T#5S
  s=String(s).toUpperCase().replace(/^S5T#/,'');let t=0;const re=/(\d+(?:\.\d+)?)(MS|H|M|S|D)/g;let m;
  while((m=re.exec(s))){const v=parseFloat(m[1]);t+=m[2]==='MS'?v/1000:m[2]==='S'?v:m[2]==='M'?v*60:m[2]==='H'?v*3600:v*86400}
  return t;
}
function fmtTime(sec){if(sec>=60){const m=Math.floor(sec/60),s=sec-m*60;return m+'m'+(s?Math.round(s)+'s':'')}return (sec<10?sec.toFixed(1):Math.round(sec))+'s'}

/* ---------------- STL parsing ---------------- */
const LOGIC={A:1,AN:1,O:1,ON:1,X:1,XN:1};
function tokLine(line){
  // "AN I 0.0" | "A(" | ")" | "= Q 4.3" | "L S5T#5S" | "SD T 1" | "O" | "NOT" | "A T1"
  const raw=line.replace(/\/\/.*$/,'').trim(); if(!raw) return null;
  let m=raw.match(/^(AN\(|ON\(|XN\(|A\(|O\(|X\()$/i); if(m) return {op:m[1].toUpperCase(),raw};
  if(raw===')') return {op:')',raw};
  m=raw.match(/^(==|<>|>=|<=|>|<)\s*([IDR])$/i); if(m) return {op:'CMP',cmp:m[1],ty:m[2].toUpperCase(),raw};
  const parts=raw.split(/\s+/); const op=parts[0].toUpperCase();
  if(parts.length===1) return {op,raw};
  if(op==='L'){return {op:'L',val:parts.slice(1).join(''),raw}}
  // operand: area + address possibly separated: "I 0.0" "I0.0" "T 1" "M 10.2" "C 1"
  let rest=parts.slice(1).join(' ');
  const mm=rest.match(/^([A-Za-z]+)\s*([\d.]+)?$/);
  if(mm) return {op,addr:normAddr(mm[1],mm[2]),raw};
  return {op,addr:rest.replace(/\s+/g,''),raw};
}
// symbolic expression helpers
const E={
  c:(a,neg)=>({t:'c',a,neg:!!neg}),
  and(x,y){const k=[];[x,y].forEach(n=>{if(n.t==='and')k.push(...n.k);else k.push(n)});return {t:'and',k}},
  or(x,y){const k=[];[x,y].forEach(n=>{if(n.t==='or')k.push(...n.k);else k.push(n)});return {t:'or',k}},
  xor:(x,y)=>({t:'xor',k:[x,y]}),
  not:x=>({t:'not',k:x}),
  edge:(x,m,dir)=>({t:'edge',k:x,m,dir}),
  one:()=>({t:'one'}),zero:()=>({t:'zero'})
};
function combine(op,a,b){ // op in A,O,X
  if(op==='A')return E.and(a,b); if(op==='O')return E.or(a,b); return E.xor(a,b);
}
const TIMER_OPS={SP:1,SE:1,SD:1,SS:1,SF:1};
const ACTION_OPS={'=':1,S:1,R:1,SP:1,SE:1,SD:1,SS:1,SF:1,CU:1,CD:1,FR:1};
function compileNet(lines){
  const toks=lines.map(tokLine).filter(Boolean);
  // symbolic pass -> actions with expressions
  let ex=null,fc=true,orAcc=null,accu=null,acc2=null;const st=[];const actions=[];
  const fin=()=>{if(orAcc){ex=ex?E.or(orAcc,ex):orAcc;orAcc=null}};
  toks.forEach((t,i)=>{
    const op=t.op;
    if(LOGIC[op]&&t.addr){const base=op[0];const neg=op.length===2;let leaf=E.c(t.addr,neg);
      /* S7: «و قبل أو» — O/ON بعنوان تبدأ مجموعة «و» جديدة: A a / O b / A c = a + (b·c) */
      if(base==='O'&&!fc&&ex){fin();orAcc=ex;ex=leaf;fc=false;t.kind='logic';t.orNew=1;return}
      ex=fc||!ex?leaf:combine(base,ex,leaf);fc=false;t.kind='logic';}
    else if(/^(A|AN|O|ON|X|XN)\($/.test(op)){st.push({ex,fc,op:op.replace('(',''),orAcc});ex=null;fc=true;orAcc=null;t.kind='open'}
    else if(op===')'){fin();let inner=ex||E.one();const f=st.pop()||{fc:true,op:'A'};
      if(f.op.length===2) inner=E.not(inner);
      ex=f.fc||!f.ex?inner:combine(f.op[0],f.ex,inner);orAcc=f.orAcc;fc=false;t.kind='close'}
    else if(op==='O'&&!t.addr){fin();orAcc=ex;ex=null;fc=true;t.kind='orb'}
    else if(op==='NOT'){ex=E.not(ex||E.one());t.kind='not'}
    else if(op==='SET'){ex=E.one();fc=false;t.kind='set'}
    else if(op==='CLR'){ex=E.zero();fc=false;t.kind='clr'}
    else if((op==='FP'||op==='FN')&&t.addr){fin();ex=E.edge(ex||E.one(),t.addr,op);t.kind='edge'}
    else if(op==='L'){acc2=accu;accu=t.val;t.kind='load'}
    else if(op==='CMP'){const leaf={t:'cmp',cmp:t.cmp,a:acc2,b:accu};ex=fc||!ex?leaf:E.and(ex,leaf);fc=false;t.kind='cmp'}
    else if(op==='T'&&t.addr){actions.push({op:'MOV',target:t.addr,src:accu,expr:E.one(),line:i});t.kind='xfer'}
    else if(ACTION_OPS[op]&&t.addr){fin();const a={op,target:t.addr,expr:ex||E.one(),line:i};
      if(TIMER_OPS[op])a.tv=accu; if(op==='S'&&/^C/.test(t.addr))a.pv=accu;
      actions.push(a);fc=true;t.kind='act'}
    else t.kind='other';
  });
  return {toks,actions};
}

/* ---------------- PLC runtime ---------------- */
function createPLC(program){
  const nets=program.map((n,i)=>{const c=compileNet(n.stl);return Object.assign({},n,c,{i})});
  const P={nets,mem:{},tim:{},cnt:{},edge:{},trace:nets.map(()=>[]),dt:0};
  P.get=a=>{if(!a)return 0;const k=a[0];
    if(k==='T'){const t=P.tim[a];return t&&t.q?1:0}
    if(k==='C'){const c=P.cnt[a];return c&&c.v>0?1:0}
    return P.mem[a]?1:0};
  P.set=(a,v)=>{P.mem[a]=v?1:0};
  P.timer=a=>P.tim[a]||(P.tim[a]={q:0,run:0,el:0,tv:0,prev:0,mode:''});
  P.counter=a=>P.cnt[a]||(P.cnt[a]={v:0,prevU:0,prevD:0,prevS:0,pv:0});
  P.words={};
  P.val=function(v){if(v==null)return 0;v=String(v).replace(/\s+/g,'');
    if(/^C#/i.test(v))return parseInt(v.slice(2))||0; if(/^S5T#/i.test(v))return parseS5T(v);
    if(/^-?\d+(\.\d+)?$/.test(v))return parseFloat(v); if(/^C\d+$/i.test(v)){const c=P.cnt[v.toUpperCase()];return c?c.v:0}
    if(/^T\d+$/i.test(v)){const t=P.tim[v.toUpperCase()];return t?Math.max(0,t.tv-t.el):0}
    if(/^[MIQ]W\d+$/i.test(v))return P.words[v.toUpperCase()]||0; return 0};
  P.reset=()=>{P.mem={};P.tim={};P.cnt={};P.edge={};P.words={}};
  // evaluate a symbolic expression with current memory (for drawings)
  P.evalE=function ev(n){switch(n.t){case 'c':{const v=P.get(n.a);return n.neg?1-v:v}
    case 'and':return n.k.every(x=>ev(x))?1:0;case 'or':return n.k.some(x=>ev(x))?1:0;
    case 'xor':return (ev(n.k[0])^ev(n.k[1]))?1:0;case 'not':return ev(n.k)?0:1;
    case 'edge':return P.mem['__e_'+n.m]?1:0;
    case 'cmp':{const a=P.val(n.a),b=P.val(n.b);return ({'==':a===b,'<>':a!==b,'>':a>b,'<':a<b,'>=':a>=b,'<=':a<=b})[n.cmp]?1:0}case 'one':return 1;default:return 0}};
  P.runNet=function(ni){
    const net=P.nets[ni],tr=[];let rlo=0,fc=true,orAcc=null,accu=null,acc2=null;const st=[];const dt=P.dt;
    const fin=()=>{if(orAcc!==null){rlo=orAcc|rlo;orAcc=null}};
    net.toks.forEach((t,li)=>{const op=t.op;
      if(t.kind==='logic'){let v=P.get(t.addr);if(op.length===2)v=1-v;const b=op[0];
        if(t.orNew&&!fc){fin();orAcc=rlo;rlo=v}else rlo=fc?v:(b==='A'?rlo&v:b==='O'?rlo|v:rlo^v);
        fc=false;tr.push(orAcc!==null?(orAcc|rlo):rlo)}
      else if(t.kind==='open'){st.push({rlo,fc,op:op.replace('(',''),orAcc});fc=true;orAcc=null;tr.push(null)}
      else if(t.kind==='close'){fin();let inner=rlo;const f=st.pop()||{fc:true,op:'A',orAcc:null};if(f.op.length===2)inner=1-inner;
        rlo=f.fc?inner:(f.op[0]==='A'?f.rlo&inner:f.op[0]==='O'?f.rlo|inner:f.rlo^inner);orAcc=f.orAcc;fc=false;tr.push(rlo)}
      else if(t.kind==='orb'){fin();orAcc=rlo;fc=true;tr.push(null)}
      else if(t.kind==='not'){rlo=1-rlo;tr.push(rlo)}
      else if(t.kind==='set'){rlo=1;fc=false;tr.push(1)}
      else if(t.kind==='clr'){rlo=0;fc=false;tr.push(0)}
      else if(t.kind==='edge'){fin();const k='__m_'+t.addr;const prev=P.mem[t.addr]?1:0;let out;
        if(op==='FP'){out=rlo&&!prev?1:0}else{out=!rlo&&prev?1:0}P.mem[t.addr]=rlo;P.mem['__e_'+t.addr]=out;rlo=out;tr.push(rlo)}
      else if(t.kind==='load'){acc2=accu;accu=t.val;tr.push(null)}
      else if(t.kind==='cmp'){const a=P.val(acc2),b=P.val(accu);const v=({'==':a===b,'<>':a!==b,'>':a>b,'<':a<b,'>=':a>=b,'<=':a<=b})[t.cmp]?1:0;rlo=fc?v:rlo&v;fc=false;tr.push(rlo)}
      else if(t.kind==='xfer'){P.words[t.addr]=P.val(accu);tr.push(null)}
      else if(t.kind==='act'){fin();const a=t.addr;
        if(op==='='){P.set(a,rlo)}
        else if(op==='S'&&a[0]==='C'){const c=P.counter(a);if(rlo&&!c.prevS){c.v=clamp(Math.round(P.val(accu||'C#0')),0,999);c.pv=c.v}c.prevS=rlo}
        else if(op==='S'){if(rlo)P.set(a,1)}
        else if(op==='R'&&a[0]==='T'){if(rlo){const tm=P.timer(a);tm.q=0;tm.run=0;tm.el=0;tm.blk=1}}
        else if(op==='R'&&a[0]==='C'){if(rlo){P.counter(a).v=0}}
        else if(op==='R'){if(rlo)P.set(a,0)}
        else if(op==='CU'){const c=P.counter(a);if(rlo&&!c.prevU)c.v=Math.min(999,c.v+1);c.prevU=rlo}
        else if(op==='CD'){const c=P.counter(a);if(rlo&&!c.prevD)c.v=Math.max(0,c.v-1);c.prevD=rlo}
        else if(TIMER_OPS[op]){const tm=P.timer(a);tm.tv=parseS5T(accu||'S5T#0S');tm.mode=op;const s=rlo,rise=s&&!tm.prev,fall=!s&&tm.prev;
          if(op==='SP'){if(rise){tm.run=1;tm.el=0}if(!s){tm.run=0;tm.q=0}if(tm.run){tm.el+=dt;if(tm.el>=tm.tv){tm.run=0;tm.q=0}else tm.q=1}}
          else if(op==='SE'){if(rise){tm.run=1;tm.el=0}if(tm.run){tm.el+=dt;if(tm.el>=tm.tv){tm.run=0;tm.q=0}else tm.q=1}}
          else if(op==='SD'){if(!s){tm.run=0;tm.el=0;tm.q=0;tm.blk=0}else{if(rise){tm.run=1;tm.el=0;tm.blk=0}if(tm.blk){tm.run=0}if(tm.run){tm.el+=dt;if(tm.el>=tm.tv){tm.run=0;tm.q=1;tm.el=tm.tv}}}}
          else if(op==='SS'){if(rise&&!tm.q){tm.run=1;tm.el=0}if(tm.run){tm.el+=dt;if(tm.el>=tm.tv){tm.run=0;tm.q=1;tm.el=tm.tv}}}
          else if(op==='SF'){if(s){if(rise)tm.blk=0;if(!tm.blk)tm.q=1;tm.run=0;tm.el=0}else{if(fall&&!tm.blk){tm.run=1;tm.el=0}tm.blk=0;if(tm.run){tm.el+=dt;if(tm.el>=tm.tv){tm.run=0;tm.q=0}}}}
          tm.prev=s}
        fc=true;tr.push(rlo)}
      else tr.push(null);
    });
    P.trace[ni]=tr;
  };
  P.scan=function(dt){P.dt=dt;for(let i=0;i<P.nets.length;i++)P.runNet(i)};
  return P;
}

/* ---------------- SVG primitives ---------------- */
const S={};
S.w=(d,c,extra)=>`<path class="w ${c||''}" d="${d}" ${extra||''}/>`;
S.t=(x,y,s,c,a,fs)=>`<text class="txt ${c||''}" x="${x}" y="${y}" text-anchor="${a||'middle'}"${fs?` font-size="${fs}"`:''}>${s}</text>`;
S.dot=(x,y)=>`<circle class="dot" cx="${x}" cy="${y}" r="3"/>`;
S.cls=(live,flow)=>flow?'flow':live?'live':'';
// vertical contact (top->bottom). o:{nc,closed,inC,outC,label,side,timer:'on'|'off',btn}
S.vC=function(x,y0,y1,o){
  const {nc=false,closed,inC='',outC='',label='',side='right',timer,btn}=o;const pv=y1-8;let blade;
  if(closed) blade=nc?`M${x} ${pv}L${x+8} ${y0+7}`:`M${x} ${pv}L${x} ${y0+8}`; else blade=`M${x} ${pv}L${x-11} ${y0+9}`;
  let s=S.w(`M${x} ${y0}V${y0+8}`,inC)+S.w(`M${x} ${pv}V${y1}`,outC);
  if(nc) s+=`<path class="sym" d="M${x} ${y0+8}H${x+9}"/>`;
  s+=`<path class="sym ${closed&&inC?'hot':''}" d="${blade}"/>`;
  const my=(y0+y1)/2;
  if(timer){const bx=closed?(nc?x+4:x):x-6;s+=timer==='on'?`<path class="sym" d="M${bx-8} ${my+2}q8 -8 16 0" stroke-width="1.4"/>`:`<path class="sym" d="M${bx-8} ${my-2}q8 8 16 0" stroke-width="1.4"/>`}
  if(btn&&side==='right'){const bx=closed?x:x-6;s+=`<path class="sym" d="M${bx} ${my}H${bx-16}M${bx-16} ${my-5}V${my+5}" stroke-width="1.4" stroke-dasharray="${btn==='mush'?'0':'3 2'}"/>`}
  if(label) s+=side==='right'?S.t(x+13,my+4,label,'','start'):S.t(x-15,my+4,label,'','end');
  return s;
};
S.coil=(x,y,lbl,on,kind)=>{
  if(kind==='lamp') return `<circle class="coil ${on?'lamp-on':''}" cx="${x}" cy="${y+11}" r="11"/><path class="sym" d="M${x-7} ${y+4}l14 14M${x+7} ${y+4}l-14 14" stroke-width="1.4"/>`+S.t(x+16,y+15,lbl,'','start');
  const r=`<rect class="coil ${on?'on':''}" x="${x-17}" y="${y}" width="34" height="22" rx="3"/>`+S.t(x,y+15,lbl);
  if(kind==='ton'||kind==='tof') return r+`<path class="sym" d="M${x+17} ${y}l8 0v22h-8" stroke-width="1.4"/>`;
  return r;
};
S.fuse=(x,y,c)=>`<rect x="${x-5}" y="${y}" width="10" height="24" class="sym" fill="var(--surface)"/>`+S.w(`M${x} ${y}V${y+24}`,c);
S.thermal=(x,y,c)=>S.w(`M${x} ${y-8}V${y}`,c)+`<rect x="${x-8}" y="${y}" width="16" height="24" rx="2" class="sym" fill="var(--surface)"/><path class="sym dim" d="M${x-4} ${y+6}h4v10h4"/>`+S.w(`M${x} ${y+24}V${y+32}`,c);
S.motor=(cx,cy,r,on,top,bot)=>`<circle cx="${cx}" cy="${cy}" r="${r}" class="coil ${on?'on':''}"/>`+S.t(cx,cy-2,top||'M')+S.t(cx,cy+13,bot||'3~');
S.mech=(x1,x2,y)=>`<path class="mech" d="M${x1} ${y}H${x2}"/>`;

/* --- hard-wired control circuit, generic ---
 spec = { top:[el...], branches:[{items:[el | {par:[[el..],[el..]]}], coil:{l,kind}}] , width? }
 el = {l:'S1', nc:0/1, on:'S1', timer:'on'|'off', btn:1}
 resolve(name)->1 if actuated */
function ctrlCircuit(spec,resolve,coilOn){
  const RH=46,CW=62,X0=56,TOP=20;
  const elW=it=>it.par?it.par.length:1;
  const elH=it=>it.par?Math.max(...it.par.map(p=>p.length)):1;
  const brW=b=>Math.max(1,...b.items.map(elW));
  const brH=b=>b.items.reduce((s,it)=>s+elH(it),0)+1;
  let x=X0;const pos=spec.branches.map(b=>{const p=x;x+=brW(b)*CW+28;return p});
  const width=Math.max(x+10,260);
  const topH=spec.top.length*RH;const busY=TOP+topH+18;
  const maxH=Math.max(...spec.branches.map(brH));const nY=busY+maxH*RH+22;
  let s='';
  s+=S.w(`M20 ${TOP}H${width-14}`,'live')+S.t(12,TOP+4,'L1','','end');
  let live=1,y=TOP;const c=v=>v?'live':'';
  spec.top.forEach(el=>{const act=resolve(el.on||el.l);const cond=el.nc?!act:act;const out=live&&cond;
    s+=S.vC(X0,y,y+RH,{nc:el.nc,closed:cond,inC:c(live),outC:c(out),label:el.l,side:'left',timer:el.timer,btn:el.btn});live=out;y+=RH});
  s+=S.w(`M${X0} ${y}V${busY}H${pos[pos.length-1]}`,c(live));pos.forEach(p=>{if(p!==X0)s+=S.dot(p,busY)});
  const bus=live;
  spec.branches.forEach((b,bi)=>{let bx=pos[bi],cy=busY,f=bus;
    b.items.forEach(it=>{
      if(it.par){const h=elH(it);const outs=[];
        it.par.forEach((path,pi)=>{const px=bx+pi*CW;let pf=f,py=cy;
          if(pi>0)s+=S.w(`M${px-CW} ${cy}H${px}`,c(f));
          path.forEach(el=>{const act=resolve(el.on||el.l);const cond=el.nc?!act:act;const out=pf&&cond;
            s+=S.vC(px,py,py+RH,{nc:el.nc,closed:cond,inC:c(pf),outC:c(out),label:el.l,side:pi===0?'left':'right',timer:el.timer,btn:el.btn});pf=out;py+=RH});
          outs.push([px,py,pf]);
        });
        const any=outs.some(o=>o[2]);const ey=cy+h*RH;
        outs.forEach(([px,py,pf])=>{if(py<ey)s+=S.w(`M${px} ${py}V${ey}`,c(pf))});
        s+=S.w(`M${bx} ${ey}H${bx+(it.par.length-1)*CW}`,c(any))+S.dot(bx,ey);
        f=any;cy=ey;
      } else {const act=resolve(it.on||it.l);const cond=it.nc?!act:act;const out=f&&cond;
        s+=S.vC(bx,cy,cy+RH,{nc:it.nc,closed:cond,inC:c(f),outC:c(out),label:it.l,side:'left',timer:it.timer,btn:it.btn});f=out;cy+=RH}
    });
    const coilY=nY-40;s+=S.w(`M${bx} ${cy}V${coilY}`,c(f));
    const on=coilOn?coilOn(b.coil.l,f):f;
    s+=S.coil(bx,coilY,b.coil.l,on,b.coil.kind)+S.w(`M${bx} ${coilY+22}V${nY}`,'')+S.dot(bx,nY);
  });
  s+=S.w(`M20 ${nY}H${width-14}`,'')+S.t(12,nY+4,'N','','end');
  return `<svg viewBox="0 0 ${width} ${nY+14}" role="img" aria-label="دائرة التحكم">${s}</svg>`;
}

/* ---------------- LAD renderer from expression trees ---------------- */
const LW=84,LH=58;
function ladLayout(n){
  if(n.t==='c'||n.t==='one'||n.t==='zero'||n.t==='cmp'||n.t==='not'&&n.k.t==='one') return {w:n.t==='cmp'?2:1,h:n.t==='cmp'?2:1,n};
  if(n.t==='and'){const ks=n.k.map(ladLayout);return {w:ks.reduce((s,k)=>s+k.w,0),h:Math.max(...ks.map(k=>k.h)),n,ks}}
  if(n.t==='or'){const ks=n.k.map(ladLayout);return {w:Math.max(...ks.map(k=>k.w)),h:ks.reduce((s,k)=>s+k.h,0),n,ks}}
  if(n.t==='not'){const k=ladLayout(n.k);return {w:k.w+1,h:k.h,n,ks:[k],post:'NOT'}}
  if(n.t==='edge'){const k=ladLayout(n.k);return {w:k.w+1,h:k.h,n,ks:[k],post:n.dir==='FN'?'N':'P'}}
  if(n.t==='xor'){const ks=n.k.map(ladLayout);return {w:Math.max(...ks.map(k=>k.w))+1,h:ks[0].h+ks[1].h,n,ks,xor:1}}
  return {w:1,h:1,n};
}
function ladDraw(L,x,y,fin,P,names){ // returns {s,out}; occupies width L.w*LW, rows L.h
  const n=L.n;let s='';const C=v=>v?'live':'';
  if(!L.ks){ // leaf contact
    const W=L.w*LW,cx=x+W/2;let v=1,pass=1,a='',neg=false;
    if(n.t==='cmp'){const val=P.evalE(n),out=fin&&val;const bw=W-24;
      s+=S.w(`M${x} ${y}H${x+12}`,C(fin))+S.w(`M${x+12+bw} ${y}H${x+W}`,C(out))+`<rect class="fbox" x="${x+12}" y="${y-14}" width="${bw}" height="62" rx="3"/>`+
        `<text class="lad-txt" x="${x+12+bw/2}" y="${y-2}" text-anchor="middle">CMP ${n.cmp}I</text><text class="lad-val" x="${x+18}" y="${y+16}" fill="var(--fg)">IN1 ${n.a}=${P.val(n.a)}</text><text class="lad-val" x="${x+18}" y="${y+32}" fill="var(--fg)">IN2 ${n.b}=${P.val(n.b)}</text>`;
      return {s,out}}
    if(n.t==='c'){a=n.a;neg=n.neg;v=P.get(a);pass=neg?1-v:v}else if(n.t==='zero'){pass=0}
    const out=fin&&pass;
    s+=S.w(`M${x} ${y}H${cx-7}`,C(fin))+S.w(`M${cx+7} ${y}H${x+W}`,C(out));
    if(pass)s+=`<rect class="cpass" x="${cx-7}" y="${y-11}" width="14" height="22"/>`;
    s+=`<path class="sym" d="M${cx-7} ${y-11}V${y+11}M${cx+7} ${y-11}V${y+11}"/>`;
    if(neg)s+=`<path class="sym" d="M${cx-10} ${y+10}L${cx+10} ${y-10}"/>`;
    if(a){s+=`<text class="lad-txt" x="${cx}" y="${y-17}" text-anchor="middle">${a}</text>`;
      const nm=names&&names[a]?names[a]:'';s+=`<text class="lad-val" x="${cx}" y="${y+24}" text-anchor="middle" fill="${v?'var(--on)':'var(--muted)'}">${nm?nm+'=':''}${v}</text>`}
    return {s,out};
  }
  if(n.t==='and'){let f=fin,cx=x;L.ks.forEach(k=>{const r=ladDraw(k,cx,y,f,P,names);s+=r.s;
      if(k.w*LW<(L.w*LW))0;cx+=k.w*LW;f=r.out});return {s,out:f}}
  if(n.t==='or'){const W=L.w*LW;let cy=y,any=0;const ends=[];
    L.ks.forEach((k,i)=>{const r=ladDraw(k,x+6,cy,fin,P,names);s+=r.s;
      s+=S.w(`M${x} ${cy}H${x+6}`,C(fin));const ex=x+6+k.w*LW;s+=S.w(`M${ex} ${cy}H${x+W+6}`,C(r.out));
      ends.push([cy,r.out]);any=any||r.out;cy+=k.h*LH});
    const lastY=ends[ends.length-1][0];
    s+=S.w(`M${x} ${y}V${lastY}`,C(fin));
    // right merge: segment colored by whether something below/at is flowing
    for(let i=ends.length-1;i>0;i--){const seg=ends.slice(i).some(e=>e[1]);s+=S.w(`M${x+W+6} ${ends[i][0]}V${ends[i-1][0]}`,C(seg))}
    return {s:s.replace(/(^)/,''),out:any,extra:12};
  }
  if(L.post){const k=L.ks[0];const r=ladDraw(k,x,y,fin,P,names);s+=r.s;const bx=x+k.w*LW,cx=bx+LW/2;
    let out;if(L.post==='NOT')out=r.out?0:1;else out=P.evalE(n);
    s+=S.w(`M${bx} ${y}H${cx-14}`,C(r.out))+`<rect class="fbox" x="${cx-14}" y="${y-11}" width="28" height="22" rx="3"/><text class="lad-txt" x="${cx}" y="${y+4}" text-anchor="middle">${L.post}</text>`+S.w(`M${cx+14} ${y}H${bx+LW}`,C(out));
    if(L.post!=='NOT')s+=`<text class="lad-txt" x="${cx}" y="${y-17}" text-anchor="middle">${n.m}</text>`;
    return {s,out};
  }
  if(L.xor){const v=P.evalE(n);const W=L.w*LW;s+=S.w(`M${x} ${y}H${x+W}`,C(fin&&v))+`<rect class="fbox" x="${x+W/2-20}" y="${y-11}" width="40" height="22"/><text class="lad-txt" x="${x+W/2}" y="${y+4}" text-anchor="middle">XOR</text>`;return {s,out:fin&&v}}
  return {s,out:fin};
}
// width adjust: OR nodes add 12px; approximate by widening LW a bit in layout: handled by padding in final svg
const COIL_CODE={'MOV':'MOVE','=':'','S':'S','R':'R','SP':'SP','SE':'SE','SD':'SD','SS':'SS','SF':'SF','CU':'CU','CD':'CD','FR':'FR'};
function actionLabel(a){
  let s=a.target; let sub='';
  if(a.tv) sub=a.tv; if(a.op==='S'&&a.pv) sub=a.pv; if(a.op==='MOV') sub='IN='+a.src;
  return {top:a.target,code:a.op==='S'&&a.target[0]==='C'?'SC':COIL_CODE[a.op],sub};
}
function stateText(a,P){
  const t=a.target;
  if(t[0]==='T'){const tm=P.tim[t];if(!tm)return 'Q=0';return `Q=${tm.q} ${tm.run?('⏱ '+fmtTime(Math.max(0,tm.tv-tm.el))):''}`}
  if(a.op==='MOV')return `= ${P.words[t]||0}`;
  if(t[0]==='C'){const c=P.cnt[t];return `CV=${c?c.v:0}`}
  return `${P.get(t)}`;
}
function ladNetwork(net,P,names){
  // group consecutive actions sharing the same expr object
  const groups=[];net.actions.forEach(a=>{const g=groups[groups.length-1];if(g&&g.expr===a.expr)g.acts.push(a);else groups.push({expr:a.expr,acts:[a]})});
  let y=40,svg='',maxW=0;const rows=[];
  groups.forEach(g=>{const L=ladLayout(g.expr);rows.push({g,L,y});y+=Math.max(L.h,g.acts.length)*LH+14;maxW=Math.max(maxW,L.w)});
  const coilX=Math.max(maxW*LW+60,300)+40;const W=coilX+90;
  rows.forEach(({g,L,y:ry})=>{
    const fin=1;const r=ladDraw(L,16,ry,fin,P,names);svg+=r.s;
    const endX=16+L.w*LW+(hasOr(L)?6:0);
    svg+=S.w(`M${endX} ${ry}H${coilX-40}`,r.out?'live':'');
    g.acts.forEach((a,i)=>{const cy=ry+i*LH;const lb=actionLabel(a);
      if(i>0)svg+=S.w(`M${coilX-40} ${ry}V${cy}H${coilX-14}`,r.out?'live':'');
      else svg+=S.w(`M${coilX-40} ${cy}H${coilX-14}`,r.out?'live':'');
      const on=a.target[0]==='T'||a.target[0]==='C'?(P.get(a.target)):P.get(a.target);
      svg+=`<path class="sym ${r.out?'hot':''}" d="M${coilX-6} ${cy-11}Q${coilX-14} ${cy} ${coilX-6} ${cy+11}M${coilX+6} ${cy-11}Q${coilX+14} ${cy} ${coilX+6} ${cy+11}"/>`;
      if(lb.code)svg+=`<text class="lad-txt" x="${coilX}" y="${cy+4}" text-anchor="middle" font-size="10">${lb.code}</text>`;
      else if(on)svg+=`<circle cx="${coilX}" cy="${cy}" r="5" fill="var(--on)"/>`;
      svg+=`<text class="lad-txt" x="${coilX}" y="${cy-17}" text-anchor="middle">${lb.top}</text>`;
      const nm=names&&names[a.target]?names[a.target]+' ':'';
      svg+=`<text class="lad-val" x="${coilX+18}" y="${cy+4}" text-anchor="start" fill="${on?'var(--on)':'var(--muted)'}">${lb.sub?lb.sub+' ':''}${nm}${stateText(a,P)}</text>`;
    });
  });
  const H=y-4;
  svg=`<svg viewBox="0 0 ${W+120} ${H}"><path class="w live" d="M16 8V${H-6}"/>`+svg+`</svg>`;
  return svg;
}
function hasOr(L){return L.n.t==='or'}

/* ---------------- FBD renderer ---------------- */
function fbdLayout(n){ // returns {h, depth}
  if(n.t==='c'||n.t==='one'||n.t==='zero'||n.t==='cmp') return {h:n.t==='cmp'?2:1,d:0,n};
  if(n.t==='not'&&n.k.t==='c') return {h:1,d:0,n:E.c(n.k.a,!n.k.neg)};
  const ks=(n.t==='not'||n.t==='edge')?[fbdLayout(n.k)]:n.k.map(fbdLayout);
  return {h:Math.max(1,ks.reduce((s,k)=>s+k.h,0)),d:1+Math.max(...ks.map(k=>k.d)),n,ks};
}
const FR=26,FCOL=118;
function fbdDraw(L,xR,yTop,P,names,depth){ // draws node whose output is at xR; returns {s,y,v}
  const n=L.n;
  if(!L.ks&&n.t==='cmp'){const yy=yTop+FR;const v=P.evalE(n);
    return {s:`<rect class="fbox" x="${xR-120}" y="${yTop+2}" width="96" height="${2*FR-4}" rx="3"/><text class="lad-txt" x="${xR-72}" y="${yTop+16}" text-anchor="middle">CMP ${n.cmp}I</text><text class="lad-val" x="${xR-116}" y="${yTop+32}" fill="var(--fg)">${n.a}=${P.val(n.a)} | ${n.b}=${P.val(n.b)}</text>`+S.w(`M${xR-24} ${yy}H${xR}`,v?'live':''),y:yy,v}}
  if(!L.ks){const yy=yTop+FR/2;let v=1,raw=1,a='',neg=false;if(n.t==='c'){a=n.a;neg=n.neg;raw=P.get(a);v=neg?1-raw:raw}else if(n.t==='zero'){v=0;raw=0}
    const nm=names&&names[a]?names[a]+'=':'';
    const s=`<text class="lad-txt" x="${xR-30}" y="${yy+4}" text-anchor="end">${a||'1'}</text>`+
      `<text class="lad-val" x="${xR-30}" y="${yy+15}" text-anchor="end" fill="${raw?'var(--on)':'var(--muted)'}">${nm}${raw}</text>`+
      S.w(`M${xR-26} ${yy}H${xR-(neg?8:0)}`,raw?'live':'')+(neg?`<circle cx="${xR-4}" cy="${yy}" r="4" fill="var(--surface)" stroke="${v?'var(--live)':'var(--fg)'}" stroke-width="1.6"/>`:'');
    return {s,y:yy,v};}
  const label=n.t==='and'?'&':n.t==='or'?'&gt;=1':n.t==='xor'?'XOR':n.t==='not'?'NOT':(n.dir==='FN'?'N':'P');
  const bw=58,bx=xR-bw;let s='',cy=yTop;const ins=[];
  L.ks.forEach(k=>{const r=fbdDraw(k,bx-30,cy,P,names,depth+1);s+=r.s;ins.push(r);cy+=k.h*FR});
  const h=L.h*FR;const top=yTop+2,bh=Math.max(h-4,FR);
  const v=P.evalE(n);
  ins.forEach(r=>{s+=S.w(`M${bx-30} ${r.y}H${bx}`,r.v?'live':'')});
  s+=`<rect class="fbox" x="${bx}" y="${top}" width="${bw}" height="${bh}" rx="3"/><text class="lad-txt" x="${bx+bw/2}" y="${top+15}" text-anchor="middle">${label}</text>`;
  if(n.t==='edge')s+=`<text class="lad-txt" x="${bx+bw/2}" y="${top-3}" text-anchor="middle" font-size="10">${n.m}</text>`;
  return {s,y:top+bh/2,v};
}
function fbdNetwork(net,P,names){
  const groups=[];net.actions.forEach(a=>{const g=groups[groups.length-1];if(g&&g.expr===a.expr)g.acts.push(a);else groups.push({expr:a.expr,acts:[a]})});
  let y=18,s='',maxD=0;const rows=groups.map(g=>{const L=fbdLayout(g.expr);maxD=Math.max(maxD,L.d);const h=Math.max(L.h,g.acts.length)*FR+20;const r={g,L,y};y+=h;return r});
  const outX=90+(maxD+1)*FCOL;
  rows.forEach(({g,L,y:ry})=>{const r=fbdDraw(L,outX,ry,P,names,0);s+=r.s;
    g.acts.forEach((a,i)=>{const lb=actionLabel(a);const oy=r.y+i*FR;const on=P.get(a.target);
      if(i>0)s+=S.w(`M${outX+10} ${r.y}V${oy}H${outX+30}`,r.v?'live':'');
      s+=S.w(`M${outX} ${r.y}H${outX+30}`,r.v?'live':'');
      s+=`<rect class="fbox" x="${outX+30}" y="${oy-11}" width="64" height="22" rx="3"/><text class="lad-txt" x="${outX+62}" y="${oy+4}" text-anchor="middle">${lb.code||'='}</text>`;
      s+=`<text class="lad-txt" x="${outX+62}" y="${oy-15}" text-anchor="middle">${lb.top}</text>`;
      const nm=names&&names[a.target]?names[a.target]+' ':'';
      s+=`<text class="lad-val" x="${outX+100}" y="${oy+4}" fill="${on?'var(--on)':'var(--muted)'}">${lb.sub?lb.sub+' ':''}${nm}${stateText(a,P)}</text>`;
    });
  });
  return `<svg viewBox="0 0 ${outX+260} ${y+4}">${s}</svg>`;
}
function stlTable(net,P){
  const tr=P.trace[net.i]||[];
  return `<table class="stl"><tbody>`+net.toks.map((t,j)=>{const p=t.raw.split(/\s+/);const r=tr[j];
    return `<tr><td>${esc(p[0])}</td><td>${esc(p.slice(1).join(' '))}</td><td class="r">${r==null?'':'RLO = <span class="bit '+(r?'one':'')+'">'+r+'</span>'}</td></tr>`}).join('')+`</tbody></table>`;
}

/* ---------------- widgets ---------------- */
const W={};
W.motor=function(id,size){size=size||150;const c=size/2,r=size*0.29;
  let s=`<svg viewBox="0 0 ${size} ${size}" class="motor-svg" style="width:${size}px;max-width:100%"><circle cx="${c}" cy="${c}" r="${size*0.44}" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>`;
  for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<circle class="stator-dot" cx="${c+size*0.37*Math.cos(a)}" cy="${c+size*0.37*Math.sin(a)}" r="${size*0.028}"/>`}
  s+=`<g id="${id}"><circle cx="${c}" cy="${c}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
  for(let i=0;i<6;i++)s+=`<line x1="${c}" y1="${c}" x2="${c+r*0.9*Math.cos(i*Math.PI/3)}" y2="${c+r*0.9*Math.sin(i*Math.PI/3)}" stroke="var(--blue)" stroke-width="${size*0.035}" stroke-linecap="round"/>`;
  return s+`<circle cx="${c}" cy="${c}" r="${size*0.055}" fill="var(--fg)"/><circle cx="${c}" cy="${c-r*0.88}" r="${size*0.028}" fill="var(--live)"/></g></svg>`};
W.chart=function(canvas,hist,o){ // hist [{t,v}], o:{span,ymax,ticks,unit,refs:[{v,label,color}],now}
  const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width)return;
  if(canvas.width!==Math.round(r.width*dpr)){canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)}
  const g=canvas.getContext('2d'),Wd=r.width,H=r.height;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,Wd,H);
  const cs=getComputedStyle(document.documentElement),col=n=>cs.getPropertyValue(n).trim();
  const pl=40,pr=8,pt=8,pb=22,iw=Wd-pl-pr,ih=H-pt-pb,span=o.span||12,ymax=o.ymax||1;const y=v=>pt+ih*(1-v/ymax);
  g.font='11px "IBM Plex Mono",monospace';g.fillStyle=col('--muted');g.textAlign='right';g.textBaseline='middle';g.strokeStyle=col('--line');g.lineWidth=1;
  (o.ticks||[0,ymax/2,ymax]).forEach(v=>{g.beginPath();g.moveTo(pl,y(v));g.lineTo(Wd-pr,y(v));g.stroke();g.fillText(v+(o.unit||''),pl-5,y(v))});
  g.textAlign='center';g.textBaseline='top';for(let s=0;s<=span;s+=span/4){g.fillText(Math.round(s-span)+'s',pl+iw*(s/span),H-pb+5)}
  (o.refs||[]).forEach(rf=>{g.setLineDash([5,4]);g.strokeStyle=col(rf.color||'--muted');g.beginPath();g.moveTo(pl,y(rf.v));g.lineTo(Wd-pr,y(rf.v));g.stroke();g.setLineDash([])});
  if(hist.length<2)return;const t1=o.now;
  (o.series||[{key:'v',color:'--blue'}]).forEach(se=>{g.beginPath();hist.forEach((p,i)=>{const x=pl+iw*(1-(t1-p.t)/span),yy=y(p[se.key]);i?g.lineTo(x,yy):g.moveTo(x,yy)});
    g.strokeStyle=col(se.color);g.lineWidth=2.2;g.stroke()});
};
W.lamp=(cx,cy,r,on,color)=>`<circle cx="${cx}" cy="${cy}" r="${r*1.6}" fill="${color}" opacity="${on?.25:0}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${on?color:'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="2"/>`;

G.PLCBOOK=Object.assign(G.PLCBOOK||{},{createPLC,compileNet,parseS5T,fmtTime,S,E,ctrlCircuit,ladNetwork,fbdNetwork,stlTable,W,clamp,esc,LESSONS:[]});
})(window);
