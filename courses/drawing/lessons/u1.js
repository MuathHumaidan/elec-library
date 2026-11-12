/* Unit 1 — أساسيات الرسم الفني (ص 7–45) — lessons u1-l1 … u1-l8 (course intro ص 5–6 folded into u1-l1)
   Source: /home/claude/newc/ex/drw_a.md (printed pages). The unit's figures carry no numbers in the book, so figures are
   cited by page only.
   ONE projection engine drives everything that shows views: a part = union of convex pieces (boxes with optional cutting
   planes) → true edges found by sampling the solid around every piece edge (crease test) → each edge split into visible /
   hidden runs for a view direction (ray test) → per-view 2-D lines merged (visible wins over hidden).
   Views follow the book (DIN 6, ص 17–18): front view «المسقط الرأسي» (arrow E), side view seen from the LEFT and drawn to the
   RIGHT of it «المسقط الجانبي», top view «المسقط الأفقي» drawn UNDER it. Engine output reproduces the book's plates line by
   line (ص 22, 26, 27, 28, 30, 33, 36). */
(function(B){
"use strict";
const lt=s=>`<span class="ltr">${s}</span>`;
const fm=(x,d)=>B.fmtN(x,d);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const f2=x=>(Math.round(x*100)/100).toString();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('dwu1-css'))return;const s=document.createElement('style');s.id='dwu1-css';s.textContent=`
.dw-lab .seg{flex-wrap:wrap;max-width:100%}
.dw-lab .seg button{white-space:nowrap}
.dw-row{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;margin-top:10px}
.dw-row .sub{margin:0}
.dw-l{font-size:12.5px;color:var(--muted);display:block;margin:10px 0 4px}
.dw-sheet{background:var(--surface);border:1px solid var(--line);border-radius:10px;margin-top:10px;overflow:hidden;direction:ltr}
.dw-sheet svg{display:block;width:100%;height:auto}
.dw-cv{position:relative;background:var(--surface-2);border-radius:10px;margin-top:10px;touch-action:none;cursor:grab;direction:ltr}
.dw-cv canvas{display:block;width:100%;height:auto}
.dw-cv .dw-hint{position:absolute;inset-inline-start:8px;bottom:6px;font-size:12px;color:var(--muted);pointer-events:none;direction:rtl}
.dw-msg{margin-top:10px;font-size:14px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px}
.dw-msg.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.dw-msg.ok{border-inline-start-color:var(--on);background:var(--on-soft)}
.dw-msg:empty{display:none}
.dw-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-top:10px}
.dw-card{font:inherit;text-align:center;border:1.5px solid var(--line);background:var(--surface);color:var(--fg);border-radius:12px;padding:8px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0}
.dw-card svg{width:100%;max-width:110px;height:auto;display:block}
.dw-card b{font-size:13.5px;line-height:1.5}
.dw-card small{font-size:11.5px;color:var(--muted);direction:ltr;unicode-bidi:isolate}
.dw-card[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-soft)}
.dw-card.ok{border-color:var(--on);background:var(--on-soft)}
.dw-card.no{border-color:var(--stop);background:var(--stop-soft)}
.dw-q{font-weight:600;margin-top:10px;line-height:1.8}
.dw-score{font-family:var(--mono);font-weight:700;direction:ltr;unicode-bidi:isolate}
.dw-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;min-width:180px;flex:1 1 180px}
.dw-sl .dw-h{display:flex;justify-content:space-between;gap:8px}
.dw-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
.dw-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr}
.dw-num{width:76px;font:600 14px var(--mono);direction:ltr;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.dw-chk{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:14px}
.dw-chk div{display:flex;gap:8px;align-items:baseline}
.dw-chk i{font-style:normal;font-weight:700;width:18px;flex:none}
.dw-chk .ok i{color:var(--on)}.dw-chk .no i{color:var(--stop)}
.dw-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 6px;line-height:1.5}
.dw-frac span:first-child{border-bottom:1.5px solid currentColor;padding:0 6px}
.dw-eq{display:flex;justify-content:center;align-items:center;gap:8px;margin:12px 0;font-size:16px;font-weight:600;flex-wrap:wrap}
.dw-tips{columns:2 260px;column-gap:24px}
.dw-tips li{break-inside:avoid;margin-bottom:4px}
.dwv{font-family:var(--font)}
.dwv .vl{stroke:var(--fg);stroke-width:2.1;fill:none;stroke-linecap:square}
.dwv .hl{stroke:var(--fg);stroke-width:1.05;fill:none}
.dwv .cl{stroke:var(--fg);stroke-width:.9;fill:none}
.dwv .tn{stroke:var(--fg);stroke-width:.8;fill:none}
.dwv .dm{stroke:var(--fg);stroke-width:.75;fill:none}
.dwv .ar{fill:var(--fg);stroke:none}
.dwv .gr{stroke:var(--line);stroke-width:.6;fill:none}
.dwv .pj{stroke:var(--live);stroke-width:1;fill:none}
.dwv .pjd{stroke:var(--live);stroke-width:1;fill:none;stroke-dasharray:3 3}
.dwv .hi{stroke:var(--blue);stroke-width:3;fill:none}
.dwv .new{stroke:var(--blue)}
.dwv .bad{stroke:var(--stop)}
.dwv .good{stroke:var(--on)}
.dwv .dim{opacity:.35}
.dwv .shade{fill:var(--surface-2);stroke:none}
.dwv .hatch{fill:url(#dwh)}
.dwv .hit{stroke:transparent;stroke-width:14;fill:none;cursor:pointer;pointer-events:stroke}
.dwv text{fill:var(--fg);font-size:12px}
.dwv .dt{font-family:var(--mono);font-size:11.5px}
.dwv .lb{font-size:12.5px;font-weight:600;fill:var(--muted)}
.dwv .pn{font-family:var(--mono);font-size:11.5px;font-weight:700;fill:var(--blue-ink)}
.dwv .er{fill:var(--stop);font-weight:700}
.dwv .okt{fill:var(--on);font-weight:700}
.dwv .lv{fill:var(--live)}
.dwv .mut{fill:var(--muted)}
.dwv .pt{fill:var(--live);stroke:none}
.dwv .ptb{fill:var(--surface);stroke:var(--blue-ink);stroke-width:1.4}
`;document.head.appendChild(s)})();

/* =====================================================================
   PROJECTION ENGINE (pure geometry)
   ===================================================================== */
const ENG=(function(){
const d3=(n,p)=>n[0]*p[0]+n[1]*p[1]+n[2]*p[2];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l]};
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function solve3(a,b,c){const det=a[0]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[1]-b[1]*c[0]);if(Math.abs(det)<1e-9)return null;
  const dx=a[3]*(b[1]*c[2]-b[2]*c[1])-a[1]*(b[3]*c[2]-b[2]*c[3])+a[2]*(b[3]*c[1]-b[1]*c[3]);
  const dy=a[0]*(b[3]*c[2]-b[2]*c[3])-a[3]*(b[0]*c[2]-b[2]*c[0])+a[2]*(b[0]*c[3]-b[3]*c[0]);
  const dz=a[0]*(b[1]*c[3]-b[3]*c[1])-a[1]*(b[0]*c[3]-b[3]*c[0])+a[3]*(b[0]*c[1]-b[1]*c[0]);return [dx/det,dy/det,dz/det]}
const inPc=(pc,p,t)=>{for(const q of pc.pl)if(q[0]*p[0]+q[1]*p[1]+q[2]*p[2]>q[3]+t)return false;return true};
/* cut: the plane containing the 2-D line p1→p2 drawn in coordinate plane ax ('xz'|'yz'|'xy'), extruded along the 3rd axis; keeps the side of point k */
function cut(ax,p1,p2,k){const [i,j]=ax==='yz'?[1,2]:ax==='xz'?[0,2]:[0,1];const n=[0,0,0];n[i]=p2[1]-p1[1];n[j]=-(p2[0]-p1[0]);let d=n[i]*p1[0]+n[j]*p1[1];
  if(n[i]*k[0]+n[j]*k[1]>d){n[i]=-n[i];n[j]=-n[j];d=-d}const L=Math.hypot(n[0],n[1],n[2]);return [n[0]/L,n[1]/L,n[2]/L,d/L]}
function piece(b,cuts){const pc={pl:[[-1,0,0,-b[0]],[1,0,0,b[1]],[0,-1,0,-b[2]],[0,1,0,b[3]],[0,0,-1,-b[4]],[0,0,1,b[5]]].concat(cuts||[])};
  const pl=pc.pl,V=[];
  for(let i=0;i<pl.length;i++)for(let j=i+1;j<pl.length;j++)for(let k=j+1;k<pl.length;k++){const v=solve3(pl[i],pl[j],pl[k]);if(!v||!inPc(pc,v,1e-6))continue;
    if(!V.some(u=>Math.hypot(u.p[0]-v[0],u.p[1]-v[1],u.p[2]-v[2])<1e-6))V.push({p:v,t:[]})}
  V.forEach(w=>pl.forEach((q,i)=>{if(Math.abs(d3(q,w.p)-q[3])<1e-6)w.t.push(i)}));
  pc.E=[];for(let a=0;a<V.length;a++)for(let c=a+1;c<V.length;c++){if(V[a].t.filter(i=>V[c].t.includes(i)).length>=2)pc.E.push([V[a].p,V[c].p])}
  pc.F=[];pl.forEach((q,i)=>{const vs=V.filter(w=>w.t.includes(i)).map(w=>w.p);if(vs.length<3)return;const n=[q[0],q[1],q[2]];
    const c=vs.reduce((s,p)=>add(s,p),[0,0,0]).map(x=>x/vs.length);const u=nrm(Math.abs(n[0])<.9?crs(n,[1,0,0]):crs(n,[0,1,0])),w=crs(n,u);
    const ang=P=>Math.atan2(d3(w,sub(P,c)),d3(u,sub(P,c)));vs.sort((A,Q)=>ang(A)-ang(Q));pc.F.push({n,v:vs})});
  return pc}
const inside=(P,p)=>P.pcs.some(pc=>inPc(pc,p,1e-9));
const DIAG=[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]].map(v=>mul(v,0.02/Math.sqrt(3)));
const interior=(P,q)=>DIAG.every(o=>inside(P,add(q,o)));
/* a point on a piece edge is a true edge of the whole part when the solid around it is neither empty, full, nor a flat face */
function creaseAt(P,p,e){const u=nrm(Math.abs(e[0])<.9?crs(e,[1,0,0]):crs(e,[0,1,0])),w=crs(e,u),K=12,ins=[];
  for(let k=0;k<K;k++){const a=(k+0.37)*2*Math.PI/K;ins.push(inside(P,add(p,add(mul(u,0.03*Math.cos(a)),mul(w,0.03*Math.sin(a))))))}
  if(ins.every(x=>x===ins[0]))return false;for(let k=0;k<K/2;k++)if(ins[k]===ins[k+K/2])return true;return false}
function rayIv(pc,p,v){let t0=1e-6,t1=1e9;for(const q of pc.pl){const den=q[0]*v[0]+q[1]*v[1]+q[2]*v[2],num=q[3]-(q[0]*p[0]+q[1]*p[1]+q[2]*p[2]);
  if(Math.abs(den)<1e-12){if(num<-1e-7)return null;continue}const t=num/den;if(den>0){if(t<t1)t1=t}else if(t>t0)t0=t;if(t0>t1-1e-7)return null}return [t0,t1]}
/* hidden = the ray from the point toward the viewer passes through the inside of the solid */
function hiddenAt(P,p,v){for(const pc of P.pcs){const iv=rayIv(pc,p,v);if(!iv||iv[1]-iv[0]<1e-6)continue;const L=iv[1]-iv[0];
  for(const f of [0.5,0.1,0.9,0.3,0.7]){if(interior(P,add(p,mul(v,iv[0]+L*f))))return true}}return false}
function runs(a,b,f,step){const L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const n=Math.max(3,Math.ceil(L/(step||1.5)));const out=[];
  let prevT=0,prevC=null,lastMid=0;
  for(let k=0;k<n;k++){const tm=(k+0.5)/n,c=f(lerp(a,b,tm));
    if(prevC===null){prevC=c;lastMid=tm;continue}
    if(c!==prevC){let lo=lastMid,hi=tm;for(let it=0;it<16;it++){const m=(lo+hi)/2;if(f(lerp(a,b,m))===prevC)lo=m;else hi=m}
      const tb=(lo+hi)/2;out.push([prevT,tb,prevC]);prevT=tb;prevC=c}lastMid=tm}
  out.push([prevT,1,prevC]);return out.map(([t0,t1,c])=>({a:lerp(a,b,t0),b:lerp(a,b,t1),c}))}
function part(o){const P=Object.assign({},o);P.pcs=o.pieces.map(x=>piece(x[0],x[1]));
  const key=p=>p.map(x=>Math.round(x*1000)).join(',');const seen=new Set();const segs=[];
  P.pcs.forEach(pc=>pc.E.forEach(([a,b])=>{const k1=key(a)+'|'+key(b),k2=key(b)+'|'+key(a);if(seen.has(k1)||seen.has(k2))return;seen.add(k1);segs.push([a,b])}));
  P.edges=[];segs.forEach(([a,b])=>{const e=nrm(sub(b,a));runs(a,b,p=>creaseAt(P,p,e)?1:0).forEach(r=>{if(r.c&&Math.hypot(...sub(r.b,r.a))>1e-3)P.edges.push([r.a,r.b])})});
  const bb=[1e9,-1e9,1e9,-1e9,1e9,-1e9];P.pcs.forEach(pc=>pc.F.forEach(F=>F.v.forEach(p=>{for(let i=0;i<3;i++){bb[2*i]=Math.min(bb[2*i],p[i]);bb[2*i+1]=Math.max(bb[2*i+1],p[i])}})));
  P.bb=bb;P.W=bb[1]-bb[0];P.D=bb[3]-bb[2];P.H=bb[5]-bb[4];P._v={};return P}
/* view-local 2-D coords in mm: origin = top-left of the view's box, v downward */
const VIEW={F:{v:[0,1,0],p:(P,q)=>[q[0]-P.bb[0],P.bb[5]-q[2]]},T:{v:[0,0,1],p:(P,q)=>[q[0]-P.bb[0],q[1]-P.bb[2]]},S:{v:[-1,0,0],p:(P,q)=>[q[1]-P.bb[2],P.bb[5]-q[2]]}};
function merge2(segs){const G=new Map();
  segs.forEach(s=>{const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1];if(Math.hypot(dx,dy)<0.05)return;let th=Math.atan2(dy,dx);if(th<-1e-9)th+=Math.PI;if(th>=Math.PI-1e-6)th-=Math.PI;
    const c=Math.cos(th),sn=Math.sin(th),off=-sn*s.a[0]+c*s.a[1];const k=Math.round(th*2000)+'/'+Math.round(off*200);
    if(!G.has(k))G.set(k,{c,sn,off,v:[],h:[]});const g=G.get(k);let t0=c*s.a[0]+sn*s.a[1],t1=c*s.b[0]+sn*s.b[1];if(t0>t1)[t0,t1]=[t1,t0];(s.t==='v'?g.v:g.h).push([t0,t1])});
  const uni=a=>{a.sort((x,y)=>x[0]-y[0]);const o=[];a.forEach(i=>{if(o.length&&i[0]<=o[o.length-1][1]+0.02)o[o.length-1][1]=Math.max(o[o.length-1][1],i[1]);else o.push(i.slice())});return o};
  const minus=(a,bs)=>{let cur=a.map(x=>x.slice());bs.forEach(([b0,b1])=>{const nx=[];cur.forEach(([x0,x1])=>{if(b1<=x0||b0>=x1){nx.push([x0,x1]);return}if(b0>x0)nx.push([x0,b0]);if(b1<x1)nx.push([b1,x1])});cur=nx});return cur.filter(x=>x[1]-x[0]>0.3)};
  const out=[];G.forEach(g=>{const V=uni(g.v),H=minus(uni(g.h),V);const pt=t=>[g.c*t-g.sn*g.off,g.sn*t+g.c*g.off];
    V.forEach(([t0,t1])=>out.push({a:pt(t0),b:pt(t1),t:'v'}));H.forEach(([t0,t1])=>out.push({a:pt(t0),b:pt(t1),t:'h'}))});
  return out.map(s=>({a:s.a.map(r3),b:s.b.map(r3),t:s.t}))}
const r3=x=>Math.round(x*1000)/1000;
function lines3(P,v){const out=[];P.edges.forEach(([a,b])=>runs(a,b,p=>hiddenAt(P,p,v)?1:0,2).forEach(r=>out.push({a:r.a,b:r.b,t:r.c?'h':'v'})));return out}
function view(P,k){if(P._v[k])return P._v[k];const V=VIEW[k];return P._v[k]=merge2(lines3(P,V.v).map(l=>({a:V.p(P,l.a),b:V.p(P,l.b),t:l.t})))}
return {piece,cut,part,view,VIEW,lines3,merge2,d3,sub,add,mul,crs,nrm,lerp};
})();

/* =====================================================================
   THE BOOK'S PARTS (mm; x = width to the right, y = depth from the BACK (0) to the FRONT, z = height)
   ===================================================================== */
const PDEF={
 box:{name:'متوازي مستطيلات',ref:'ص 18–19',pieces:[[[0,40,0,16,0,60]]],illus:1,
   pts:{1:[0,16,60],2:[40,16,60],3:[40,16,0],4:[0,16,0],5:[0,0,60],6:[40,0,60],7:[40,0,0],8:[0,0,0]}},
 trap:{name:'منشور قاعدته شبه منحرف',ref:'ص 20',illus:1,pieces:[[[0,60,0,20,0,40],[ENG.cut('xy',[0,0],[15,20],[30,10]),ENG.cut('xy',[60,0],[45,20],[30,10])]]],sym:{x:[30]},
   pts:{5:[0,0,40],1:[15,20,40],2:[45,20,40],6:[60,0,40],8:[0,0,0],4:[15,20,0],3:[45,20,0],7:[60,0,0]}},
 step:{name:'الجسم المتدرج',ref:'ص 21–24',illus:1,pieces:[[[0,100,0,116,0,116]],[[50,100,0,83,116,165]]],pts:{1:[50,83,165]}},
 L26:{name:'زاوية (مقطعها L)',ref:'ص 26',pieces:[[[0,30,0,8,0,35]],[[0,8,8,20,0,35]]]},
 C27:{name:'مشغولة بقطاع جانبي (مجرى)',ref:'ص 27',pieces:[[[0,25,0,15,0,110]],[[0,10,15,50,0,110]],[[0,40,50,60,0,110]]]},
 U28:{name:'جسم مقطعه U',ref:'ص 28',pieces:[[[0,30,0,8,0,35]],[[0,7.5,8,18,0,35]],[[22.5,30,8,18,0,35]]],sym:{x:[15]}},
 I30:{name:'قطعة بشكل حرف I',ref:'ص 30',pieces:[[[0,10,0,40,0,110]],[[50,60,0,40,0,110]],[[10,17.5,15,25,0,110]],[[42.5,50,15,25,0,110]],[[17.5,42.5,15,25,20,110]]],sym:{x:[30],y:[20]}},
 L33:{name:'زاوية ذات أسطح مشطوبة',ref:'ص 33',pieces:(()=>{const ch=ENG.cut('xz',[40,120],[60,80],[0,0]),hw=20*Math.tan(Math.PI/6),A=[20,80],U=[40,80+hw],Lw=[40,80-hw];
   return [[[10,60,0,10,0,120],[ch]],[[0,10,0,40,0,80-hw]],[[0,10,0,40,80+hw,120]],[[0,10,0,20,80-hw,80+hw]],[[0,10,20,40,80-hw,80],[ENG.cut('yz',Lw,A,[25,80-hw+1])]],[[0,10,20,40,80,80+hw],[ENG.cut('yz',A,U,[25,80+hw-1])]]]})()},
 P34:{name:'لوح بركن مشطوب وفتحة نافذة',ref:'ص 34',pieces:(()=>{const ch=ENG.cut('xz',[0,45],[25,60],[25,0]);
   return [[[0,20,0,15,0,60],[ch]],[[20,25,0,15,0,15]],[[20,25,0,15,50,60],[ch]],[[25,40,0,15,0,15]],[[25,40,0,15,50,60]],[[40,50,0,15,0,60]]]})()},
 S36:{name:'قطعة انزلاق',ref:'ص 36',sym:{x:[35]},pieces:(()=>{const sl=ENG.cut('yz',[0,120],[40,110],[0,0]);
   return [[[0,10,0,40,0,20]],[[0,10,0,40,70,120]],[[60,70,0,40,0,20]],[[60,70,0,40,70,120]],[[10,15,0,40,0,120]],[[55,60,0,40,0,120]],[[15,20,0,40,0,120],[sl]],[[50,55,0,40,0,120],[sl]],[[20,50,0,40,0,10]],[[20,50,0,40,90,120],[sl]]]})()}
};
const PC={};const getP=k=>PC[k]||(PC[k]=ENG.part(Object.assign({key:k},PDEF[k])));

/* =====================================================================
   SVG DRAWING TOOLKIT (strings; viewBox units = px)
   ===================================================================== */
const P2=p=>f2(p[0])+' '+f2(p[1]);
const ln=(a,b,cls,at)=>`<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" class="${cls}"${at||''}/>`;
const plyl=(pts,cls,close,at)=>`<path d="M${pts.map(P2).join('L')}${close?'Z':''}" class="${cls}"${at||''}/>`;
const len2=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
/* hidden edge «خط متقطع»: equal dashes, starting and ending with a dash (ص 25–26). bad:'gap' starts/ends with a gap, 'uneven' irregular */
function hidLn(a,b,o){o=o||{};const L=len2(a,b),dd=o.d||5.5,g=o.g||2.8;
  if(o.bad==='uneven')return ln(a,b,'hl'+(o.cls?' '+o.cls:''),` stroke-dasharray="9 2 3 5 6 2 2 4"${o.at||''}`);
  if(o.bad==='gap'){const n=Math.max(1,Math.round((L-g)/(dd+g)));const d2=Math.max(1,(L-(n+1)*g)/n);return ln(a,b,'hl'+(o.cls?' '+o.cls:''),` stroke-dasharray="${f2(d2)} ${g}" stroke-dashoffset="${f2(-g)}"${o.at||''}`)}
  if(L<dd*1.2)return ln(a,b,'hl'+(o.cls?' '+o.cls:''),o.at);
  const n=Math.max(2,Math.round((L+g)/(dd+g)));const d2=(L-(n-1)*g)/n;return ln(a,b,'hl'+(o.cls?' '+o.cls:''),` stroke-dasharray="${f2(d2)} ${g}"${o.at||''}`)}
/* centre line «خط منتصف»: long dash – dot, starts and ends with a long dash, odd number of dashes so its middle is a dash (crossing at dashes, ص 28–29).
   bad:'dot' ends with a dot/gap, 'cross' even number of dashes (middle falls in a gap) */
function ctrLn(a,b,o){o=o||{};const L=len2(a,b),g=2.2,dot=1.6,per=2*g+dot;let n=Math.max(1,Math.round((L+per)/(14+per)));
  if(o.bad==='cross'){if(n%2)n+=1}else if(n%2===0)n+=1;
  const D=Math.max(2,(L-(n-1)*per)/n);
  const da=`${f2(D)} ${g} ${dot} ${g}`;const off=o.bad==='dot'?` stroke-dashoffset="${f2(D+g*0.5)}"`:'';
  return ln(a,b,'cl'+(o.cls?' '+o.cls:''),` stroke-dasharray="${da}"${off}${o.at||''}`)}
const arrowHead=(tip,dir,sz)=>{sz=sz||7;const [dx,dy]=dir,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,w=sz*0.32;
  return `<path class="ar" d="M${f2(tip[0])} ${f2(tip[1])}L${f2(tip[0]-ux*sz-uy*w)} ${f2(tip[1]-uy*sz+ux*w)}L${f2(tip[0]-ux*sz+uy*w)} ${f2(tip[1]-uy*sz-ux*w)}Z"/>`};
const tx=(x,y,s,cls,anc,rot,at)=>`<text x="${f2(x)}" y="${f2(y)}" class="${cls||''}"${anc?` text-anchor="${anc}"`:''}${rot?` transform="rotate(${rot} ${f2(x)} ${f2(y)})"`:''}${at||''}>${s}</text>`;
/* Arabic text with a number/Latin run kept in its own tspan (SVG bidi rule) */
const tAr=(x,y,ar,num,cls,anc)=>`<text x="${f2(x)}" y="${f2(y)}" class="${cls||''}"${anc?` text-anchor="${anc}"`:''} direction="rtl"><tspan>${ar}</tspan>${num!=null?` <tspan direction="ltr" unicode-bidi="embed">${num}</tspan>`:''}</text>`;
/* dimension (ص 16): T maps mm→px; a,b = measured points (mm), off = distance of the dimension line (mm, + = to the left of a→b),
   o: {t:text, out:arrows outside, ext:false (no extension lines), fa/fb: feature points the extension lines start from (default a/b),
       only:'ext' (extension lines only), tdx:text shift along line (mm), tside:-1 text on the other side, cls} */
function dim(T,a,b,off,o){o=o||{};const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=uy,ny=-ux;
  const A=[a[0]+nx*off,a[1]+ny*off],Bq=[b[0]+nx*off,b[1]+ny*off];const sg=off>=0?1:-1;let h='';const cls=o.cls?' '+o.cls:'';
  if(o.ext!==false){const e0=o.e0!=null?o.e0:1.2,e1=2;
    const fa=o.fa||a,fb=o.fb||b;
    if(!o.noA)h+=ln(T([fa[0]+nx*sg*e0,fa[1]+ny*sg*e0]),T([A[0]+nx*sg*e1,A[1]+ny*sg*e1]),'dm'+cls);
    if(!o.noB)h+=ln(T([fb[0]+nx*sg*e0,fb[1]+ny*sg*e0]),T([Bq[0]+nx*sg*e1,Bq[1]+ny*sg*e1]),'dm'+cls)}
  if(o.only==='ext')return h;
  const pA=T(A),pB=T(Bq);const dir=[pB[0]-pA[0],pB[1]-pA[1]];
  if(o.out){const ex=7*1.9,dl=Math.hypot(dir[0],dir[1])||1,u2=[dir[0]/dl,dir[1]/dl];h+=ln([pA[0]-u2[0]*ex,pA[1]-u2[1]*ex],[pB[0]+u2[0]*ex,pB[1]+u2[1]*ex],'dm'+cls);
    h+=arrowHead(pA,dir)+arrowHead(pB,[-dir[0],-dir[1]])}
  else{h+=ln(pA,pB,'dm'+cls)+arrowHead(pA,[-dir[0],-dir[1]])+arrowHead(pB,dir)}
  if(o.t!=null){let ang=Math.atan2(dir[1],dir[0])*180/Math.PI;if(ang>89.5)ang-=180;if(ang<-90.5)ang+=180;
    const m=[(A[0]+Bq[0])/2+ux*(o.tdx||0),(A[1]+Bq[1])/2+uy*(o.tdx||0)];const pm=T(m);const a2=ang*Math.PI/180;const side=(o.tside||1)*4;
    const px=pm[0]+Math.sin(a2)*side,py=pm[1]-Math.cos(a2)*side;h+=tx(px,py,o.t,'dt'+(o.tcls?' '+o.tcls:''),'middle',Math.abs(ang)>0.5?ang:0)}
  return h}
/* angle dimension: centre c, radius r (mm), angles a0→a1 in degrees (math convention, y up in mm-space is handled by T) */
function adim(T,c,r,a0,a1,t){const pts=[];const N=24;for(let i=0;i<=N;i++){const a=(a0+(a1-a0)*i/N)*Math.PI/180;pts.push(T([c[0]+r*Math.cos(a),c[1]-r*Math.sin(a)]))}
  const h=plyl(pts,'dm');const n=pts.length;const am=(a0+a1)/2*Math.PI/180;const tp=T([c[0]+(r+4)*Math.cos(am),c[1]-(r+4)*Math.sin(am)]);
  return h+arrowHead(pts[0],[pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]])+arrowHead(pts[n-1],[pts[n-1][0]-pts[n-2][0],pts[n-1][1]-pts[n-2][1]])+tx(tp[0],tp[1]+4,t,'dt','middle')}
const svgOpen=(w,h,lbl,extra)=>`<svg viewBox="0 0 ${f2(w)} ${f2(h)}" class="dwv" role="img" aria-label="${lbl||'رسم'}" xmlns="http://www.w3.org/2000/svg"${extra||''}>`;
const HATCH=`<defs><pattern id="dwh" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--fg);stroke-width:.8"/></pattern><pattern id="dwh2" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--fg);stroke-width:.8"/></pattern><pattern id="dwh3" patternUnits="userSpaceOnUse" width="3.5" height="3.5" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3.5" style="stroke:var(--fg);stroke-width:.7"/></pattern></defs>`;
const wrap=(svg,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${svg}</div>`;
const VNAME={F:'المسقط الرأسي',S:'المسقط الجانبي',T:'المسقط الأفقي'};

/* ---------- three-view sheet ----------
   o: {px:width, gap:mm, pad:mm, views:['F','S','T'], hide:{S:1}, cl:true, labels:true, grid:5, dims:{F:[[a,b,off,{...}]]}, pts:true|[keys],
       segs:{F:[...]} override, mark:fn(ctx) extra svg, aria} → {svg, ctx} */
function layout(P,o){o=o||{};const g=o.gap!=null?o.gap:Math.max(14,Math.round(0.26*Math.max(P.W,P.D,P.H)));const pad=o.pad!=null?o.pad:15;
  const O={F:[0,0],S:[P.W+g,0],T:[0,P.H+g]};const W=P.W+g+P.D+2*pad,H=P.H+g+P.D+2*pad+(o.labels?6:0);const s=(o.px||520)/W;
  const T=k=>q=>[(O[k][0]+q[0]+pad)*s,(O[k][1]+q[1]+pad)*s];const TM=q=>[(q[0]+pad)*s,(q[1]+pad)*s];
  return {P,g,pad,O,W,H,s,T,TM,X:(k,u)=>(O[k][0]+u+pad)*s,Y:(k,v)=>(O[k][1]+v+pad)*s,size:k=>k==='F'?[P.W,P.H]:k==='T'?[P.W,P.D]:[P.D,P.H]}}
function centreLines(P,k){const out=[],sy=P.sym||{},ex=3.5,[w,h]=k==='F'?[P.W,P.H]:k==='T'?[P.W,P.D]:[P.D,P.H];
  (sy.x||[]).forEach(c=>{const u=c-P.bb[0];if(k==='F'||k==='T')out.push({a:[u,-ex],b:[u,h+ex],ax:'x'})});
  (sy.y||[]).forEach(c=>{const u=c-P.bb[2];if(k==='T')out.push({a:[-ex,u],b:[w+ex,u],ax:'y'});if(k==='S')out.push({a:[u,-ex],b:[u,h+ex],ax:'y'})});
  (sy.z||[]).forEach(c=>{const v=P.bb[5]-c;if(k==='F'||k==='S')out.push({a:[-ex,v],b:[w+ex,v],ax:'z'})});
  return out}
function sheetSVG(P,o){o=o||{};const C=layout(P,o);const views=o.views||['F','S','T'];let h=svgOpen(C.W*C.s,C.H*C.s,o.aria||('مساقط '+(P.name||'')))+HATCH;
  if(o.grid){const st=o.grid*C.s;for(let x=0;x<=C.W*C.s+0.1;x+=st)h+=ln([x,0],[x,C.H*C.s],'gr');for(let y=0;y<=C.H*C.s+0.1;y+=st)h+=ln([0,y],[C.W*C.s,y],'gr')}
  if(o.under)h+=o.under(C);
  views.forEach(k=>{if(o.hide&&o.hide[k])return;const T=C.T(k);const segs=(o.segs&&o.segs[k])||ENG.view(P,k);
    segs.forEach(sg=>{if(sg.t==='v')h+=ln(T(sg.a),T(sg.b),'vl'+(sg.cls?' '+sg.cls:''));else if(!o.noHidden)h+=hidLn(T(sg.a),T(sg.b),{cls:sg.cls})});
    if(o.cl!==false)centreLines(P,k).forEach(c=>h+=ctrLn(T(c.a),T(c.b)));
    ((o.dims&&o.dims[k])||[]).forEach(d=>h+=dim(T,d[0],d[1],d[2],d[3]));
    if(o.labels){const [w,hh]=C.size(k);const p=T([w/2,hh+C.g*0.55]);h+=tx(p[0],p[1],VNAME[k],'lb','middle')}});
  if(o.pts&&P.pts)h+=ptLabels(P,C,views.filter(k=>!(o.hide&&o.hide[k])),o.pts);
  if(o.mark)h+=o.mark(C);
  return {svg:h+'</svg>',C}}
/* corner numbers as in ص 19–20: in each view the nearer corner plain, the corner behind it in brackets */
function ptLabels(P,C,views,which){let h='';const keys=Object.keys(P.pts).filter(k=>which===true||which.includes(k));
  views.forEach(k=>{const V=ENG.VIEW[k],T=C.T(k),[w,hh]=C.size(k);const grp=new Map();
    keys.forEach(n=>{const q=P.pts[n],p2=V.p(P,q),key=Math.round(p2[0]*10)+','+Math.round(p2[1]*10);const dpt=ENG.d3(V.v,q);if(!grp.has(key))grp.set(key,{p:p2,l:[]});grp.get(key).l.push([dpt,n])});
    /* nearer corner number outside the corner, the corner behind it in brackets inside (as in ص 19) */
    grp.forEach(G=>{G.l.sort((a,b)=>b[0]-a[0]);const near=G.l[0][1],back=G.l.slice(1).map(x=>'('+x[1]+')').join('');
      const cx=w/2,cy=hh/2,dx=G.p[0]<cx-0.01?-1:G.p[0]>cx+0.01?1:0,dy=G.p[1]<cy-0.01?-1:G.p[1]>cy+0.01?1:0;const p=T(G.p);
      h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="2.2" class="pt"/>`+tx(p[0]+dx*4,p[1]+(dy<0?-4:dy>0?12:4),near,'pn',dx<0?'end':dx>0?'start':'middle');
      if(back)h+=tx(p[0]-dx*4,p[1]+(dy<0?12:dy>0?-4:4),back,'pn',dx<0?'start':dx>0?'end':'middle',0,' style="font-weight:500"')})});
  return h}

/* =====================================================================
   3-D VIEWER (canvas, z-buffer shading + engine edges: visible solid, hidden dashed)
   ===================================================================== */
function cssCol(el,name,fb){const v=getComputedStyle(el).getPropertyValue(name).trim();const m=/^#([0-9a-f]{6})$/i.exec(v);if(m){const n=parseInt(m[1],16);return [(n>>16)&255,(n>>8)&255,n&255]}return fb}
function viewer3D(host,o){o=o||{};let P=o.part,az=o.az!=null?o.az:-35,el=o.el!=null?o.el:24,showH=o.hidden!==false,anim=null;const cb=o.onChange||(()=>{});
  host.innerHTML=`<div class="dw-cv"><canvas></canvas><span class="dw-hint">اسحب لتدوير الجسم</span></div>`;const box=host.firstChild,cv=box.querySelector('canvas');
  let W=0,H=0,dpr=1;
  const size=()=>{dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(240,Math.min(620,box.clientWidth||480));H=Math.round(W*0.72);cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px'};
  const dirV=()=>{const a=az*Math.PI/180,e=el*Math.PI/180;return [Math.sin(a)*Math.cos(e),Math.cos(a)*Math.cos(e),Math.sin(e)]};
  function draw(){if(!P)return;if(!W)size();const ctx=cv.getContext('2d');const v=dirV();let r=ENG.nrm(ENG.crs([0,0,1],ENG.mul(v,-1)));if(Math.hypot(...r)<0.5)r=[1,0,0];const up=ENG.crs(ENG.mul(v,-1),r);
    const c=[(P.bb[0]+P.bb[1])/2,(P.bb[2]+P.bb[3])/2,(P.bb[4]+P.bb[5])/2],R=Math.hypot(P.W,P.D,P.H)/2,sc=Math.min(W,H)*(o.arrows===false?0.44:0.34)/R*dpr;
    const pr=p=>{const q=ENG.sub(p,c);return [W*dpr/2+ENG.d3(q,r)*sc,H*dpr/2-ENG.d3(q,up)*sc,ENG.d3(q,v)]};
    const img=ctx.createImageData(W*dpr,H*dpr),zb=new Float32Array(W*dpr*H*dpr).fill(-1e9),D=img.data,IW=W*dpr,IH=H*dpr;
    const base=cssCol(host,'--surface',[255,255,255]),tint=cssCol(host,'--blue-soft',[220,241,230]),ink=cssCol(host,'--fg',[20,35,28]);
    const Lt=ENG.nrm(ENG.add(ENG.add(v,ENG.mul(up,0.7)),ENG.mul(r,-0.5)));
    P.pcs.forEach(pc=>pc.F.forEach(F=>{const k=Math.max(0,ENG.d3(F.n,Lt)),sh=0.66+0.34*k;const col=[0,1,2].map(i=>Math.round((tint[i]*0.6+base[i]*0.4)*sh+ink[i]*0.04));
      const ps=F.v.map(pr);for(let t=1;t<ps.length-1;t++){const A=ps[0],Bv=ps[t],Cc=ps[t+1];const den=(Bv[1]-Cc[1])*(A[0]-Cc[0])+(Cc[0]-Bv[0])*(A[1]-Cc[1]);if(Math.abs(den)<1e-6)continue;
        const x0=Math.max(0,Math.floor(Math.min(A[0],Bv[0],Cc[0]))),x1=Math.min(IW-1,Math.ceil(Math.max(A[0],Bv[0],Cc[0]))),y0=Math.max(0,Math.floor(Math.min(A[1],Bv[1],Cc[1]))),y1=Math.min(IH-1,Math.ceil(Math.max(A[1],Bv[1],Cc[1])));
        for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x+0.5,py=y+0.5;const l1=((Bv[1]-Cc[1])*(px-Cc[0])+(Cc[0]-Bv[0])*(py-Cc[1]))/den,l2=((Cc[1]-A[1])*(px-Cc[0])+(A[0]-Cc[0])*(py-Cc[1]))/den,l3=1-l1-l2;
          if(l1<-1e-4||l2<-1e-4||l3<-1e-4)continue;const z=l1*A[2]+l2*Bv[2]+l3*Cc[2],ix=y*IW+x;if(z>zb[ix]){zb[ix]=z;const j=ix*4;D[j]=col[0];D[j+1]=col[1];D[j+2]=col[2];D[j+3]=255}}}}));
    ctx.putImageData(img,0,0);
    const L=ENG.lines3(P,v);ctx.lineCap='round';
    if(showH){ctx.setLineDash([5*dpr,3.5*dpr]);ctx.lineWidth=1.1*dpr;ctx.strokeStyle=`rgba(${ink.join(',')},0.75)`;ctx.beginPath();L.forEach(l=>{if(l.t!=='h')return;const a=pr(l.a),b=pr(l.b);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])});ctx.stroke()}
    ctx.setLineDash([]);ctx.lineWidth=2*dpr;ctx.strokeStyle=`rgb(${ink.join(',')})`;ctx.beginPath();L.forEach(l=>{if(l.t!=='v')return;const a=pr(l.a),b=pr(l.b);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])});ctx.stroke();
    if(o.arrows!==false){const ac=cssCol(host,'--live',[217,128,26]);const mk=(from,to,lab)=>{const a=pr(from),b=pr(to);if(ENG.d3(ENG.nrm(ENG.sub(to,from)),v)>0.97)return;ctx.strokeStyle=ctx.fillStyle=`rgb(${ac.join(',')})`;ctx.lineWidth=3*dpr;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
        const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,s2=9*dpr;ctx.beginPath();ctx.moveTo(b[0]+ux*s2*0.6,b[1]+uy*s2*0.6);ctx.lineTo(b[0]-ux*s2*0.6-uy*s2*0.5,b[1]-uy*s2*0.6+ux*s2*0.5);ctx.lineTo(b[0]-ux*s2*0.6+uy*s2*0.5,b[1]-uy*s2*0.6-ux*s2*0.5);ctx.fill();
        ctx.font=`700 ${13*dpr}px ${getComputedStyle(host).fontFamily}`;ctx.textAlign='center';ctx.fillText(lab,a[0]-ux*10*dpr,a[1]-uy*10*dpr+4*dpr)};
      const m=Math.max(P.W,P.D,P.H)*0.32,cx=c[0],cy=c[1],cz=c[2];
      mk([cx,P.bb[3]+m*1.3,cz],[cx,P.bb[3]+m*0.25,cz],'E');mk([P.bb[0]-m*1.3,cy,cz],[P.bb[0]-m*0.25,cy,cz],'S');mk([cx,cy,P.bb[5]+m*1.3],[cx,cy,P.bb[5]+m*0.25],'P')}}
  let drag=null;
  box.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,az,el];box.setPointerCapture(e.pointerId);box.style.cursor='grabbing';if(anim){cancelAnimationFrame(anim);anim=null}});
  box.addEventListener('pointermove',e=>{if(!drag)return;az=drag[2]-(e.clientX-drag[0])*0.6;el=clamp(drag[3]+(e.clientY-drag[1])*0.5,-89,89);draw();cb({az,el,user:1})});
  const end=()=>{drag=null;box.style.cursor=''};box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
  const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{const w=box.clientWidth;if(Math.abs(w-W)>4&&w>0){W=0;draw()}}):null;if(ro)ro.observe(box);
  draw();
  return {set(p){P=p;draw()},hidden(b){showH=b;draw()},get:()=>({az,el}),
    goto(a2,e2){if(anim)cancelAnimationFrame(anim);const a0=az,e0=el;let da=((a2-a0)%360+540)%360-180;const t0=performance.now();
      const st=now=>{if(!document.body.contains(host))return;const t=Math.min(1,(now-t0)/600),k=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;az=a0+da*k;el=e0+(e2-e0)*k;draw();if(t<1)anim=requestAnimationFrame(st);else{anim=null;cb({az,el})}};anim=requestAnimationFrame(st)},
    redraw:()=>{W=0;draw()}}}

/* ---------- small UI helpers (as in the reference labs) ---------- */
function loopOn(el,fn){const f=()=>{if(!document.body.contains(el))return;try{fn()}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت الخطوات</h4><p style="display:block">يمكنك إعادتها أو تجربة جسم آخر.</p><div class="act"><button class="btn" data-restart>إعادة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}}}}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button type="button" data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
function segBind(el,attr,fn){el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll(`[data-${attr}]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));fn(b.dataset[attr])}))}
const slHTML=(id,lbl,min,max,step,v)=>`<label class="dw-sl"><span class="dw-h"><span>${lbl}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;

/* ---------- drawn examples («الأمثلة المحلولة» = drawings revealed step by step) ----------
   steps: [[text, svgAtThatStep], ...] → solve() returns [{t}] where t = text + drawing */
const drawnEx=(title,ref,q,steps,note)=>({title,ref,q,solve:()=>steps.map(([t,svg],i)=>({t:`<p style="margin:0 0 6px">${t}</p>${svg?wrap(svg,520):''}`,final:i===steps.length-1})),note});

/* =====================================================================
   LESSON 1 — أدوات الرسم وأقسامه (+ تمهيد المقرر وأهدافه، أهداف الوحدة)
   ===================================================================== */
/* tool pictures (schematic redraws of the book's photos / descriptions), viewBox 0 0 100 70 */
const TI=(b)=>`<svg viewBox="0 0 100 70" class="dwv" aria-hidden="true">${b}</svg>`;
const TOOLS=[
 {k:'board',n:'لوحة الرسم',en:'Drawing Board',
  s:TI(`<rect x="8" y="8" width="84" height="54" rx="3" class="vl" style="fill:var(--surface-2)"/><rect x="26" y="16" width="48" height="36" class="tn" style="fill:var(--surface)"/>${[[26,16],[74,16],[26,52],[74,52]].map(([x,y])=>`<rect x="${x-3}" y="${y-2}" width="6" height="4" style="fill:var(--live)"/>`).join('')}`),
  d:'تصنع من خشب الصنوبر الأبيض، ذات سطح قاسٍ ومستوٍ، يثبت ورق الرسم عليها بشريط لاصق أو مشابك معدنية، وحوافها مستقيمة وقاسية لتكون دليلاً للمسطرة حرف <span class="ltr">(T)</span>.'},
 {k:'tsq',n:'المسطرة حرف (T)',en:'T-square',
  s:TI(`<rect x="10" y="12" width="10" height="46" class="vl" style="fill:var(--surface-2)"/><rect x="20" y="30" width="72" height="10" class="vl" style="fill:var(--blue-soft)"/>${[0,1,2,3].map(i=>`<line x1="28" y1="${48+i*4}" x2="88" y2="${48+i*4}" class="tn"/>`).join('')}`),
  d:'ساق من الخشب على جانبيها حافة شفافة، وفي طرفها الأيسر رأس ثابتة متعامدة عليها. تستعمل في رسم <b>الخطوط الأفقية المتوازية</b>، ودليلاً تنزلق عليه المثلثات.'},
 {k:'pen',n:'أقلام الرصاص',en:'Drawing Pencils',
  s:TI(`${[['2H',.35,14],['HB',.7,34],['2B',1,54]].map(([t,o,y])=>`<path d="M14 ${y}h52l10 5l-10 5h-52z" class="tn" style="fill:var(--surface-2)"/><line x1="84" y1="${y+5}" x2="96" y2="${y+5}" style="stroke:var(--fg);stroke-width:2.4;opacity:${o}"/><text x="40" y="${y+8.5}" class="dt" text-anchor="middle" style="font-size:8px">${t}</text>`).join('')}`),
  d:'ذات درجات صلابة مختلفة (ثمانية عشر نوعاً): <span class="ltr">2H</span> للخطوط الإنشائية العامة (خفيف الظل سهل المسح)، و<span class="ltr">HB</span> لتشطيب الرسم والكتابة (معتدل الظل)، و<span class="ltr">2B</span> غامق ثقيل الظل لتثبيت الرسم النهائي.'},
 {k:'paper',n:'ورق الرسم',en:'Drawing Paper',
  s:TI(`<rect x="24" y="14" width="46" height="48" class="tn" style="fill:var(--surface-2)"/><rect x="30" y="8" width="46" height="48" class="vl" style="fill:var(--surface)"/><text x="53" y="37" class="dt" text-anchor="middle">A4</text>`),
  d:'ورق مقوى سطحه خشن قليلاً، متعدد الألوان والمقاسات (<span class="ltr">A0</span> إلى <span class="ltr">A4</span>)، ومنه ورق «الكلك» نصف الشفاف لشف الرسومات وطباعتها.'},
 {k:'ink',n:'أقلام التحبير',en:'Ink pens',
  s:TI(`${[[20,'var(--stop)'],[48,'var(--on)']].map(([y,c])=>`<rect x="12" y="${y}" width="56" height="12" rx="3" class="tn" style="fill:var(--surface-2)"/><rect x="60" y="${y}" width="6" height="12" style="fill:${c}"/><path d="M68 ${y+3}h14l8 3l-8 3h-14z" class="tn" style="fill:var(--surface)"/>`).join('')}`),
  d:'سماكاتها من <span class="ltr">0.1 mm</span> إلى <span class="ltr">1 mm</span>، تعبأ بحبر خاص وتستعمل غالباً على ورق الكلك؛ وبعد الاستعمال تُفرغ من الحبر وتوضع في علبة التنظيف.'},
 {k:'lines',n:'الخطوط',en:'The Lines',
  s:TI(`<line x1="10" y1="18" x2="90" y2="18" class="vl"/><line x1="10" y1="35" x2="90" y2="35" class="hl" stroke-dasharray="6 3"/><line x1="10" y1="52" x2="90" y2="52" class="cl" stroke-dasharray="14 2.5 1.5 2.5"/>`),
  d:'للخطوط أشكال وسماكات مختلفة تدل على معانيها. يبدأ الرسم بالقلم <span class="ltr">2H</span> بخطوط رفيعة خفيفة، ثم تمحى الزوائد وتغمق الخطوط بالسمك المناسب لنوعها.'},
 {k:'eraser',n:'المحاة',en:'Eraser',
  s:TI(`<rect x="12" y="24" width="40" height="22" rx="4" class="vl" style="fill:var(--stop-soft)"/><rect x="58" y="14" width="32" height="44" rx="2" class="tn" style="fill:var(--surface-2)"/><rect x="64" y="22" width="8" height="4" class="tn"/><circle cx="80" cy="34" r="4" class="tn"/><rect x="64" y="44" width="20" height="3" class="tn"/>`),
  d:'نوع مطاطي لإزالة الخطوط المراد إصلاحها أو الخطوط الإنشائية المستغنى عنها (مع رقيقة معدنية بها فتحات توضع على الخط المراد محوه)، ونوع هش على هيئة مسحوق لإزالة الرصاص المتناثر.'},
 {k:'tri',n:'المثلثات',en:'Triangles',
  s:TI(`<path d="M10 60L10 14L56 60Z" class="vl" style="fill:var(--blue-soft);fill-opacity:.7"/><path d="M48 60L92 60L48 18Z" class="vl" style="fill:var(--live-soft);fill-opacity:.7"/><text x="22" y="54" class="dt" style="font-size:8px">45°</text><text x="74" y="56" class="dt" style="font-size:8px">30°</text>`),
  d:'من البلاستيك الملون الشفاف، وترسم بها أكثر الخطوط المائلة بزوايا <span class="ltr">30° – 45° – 60° – 90°</span>.'},
 {k:'comp',n:'الفرجار',en:'Compass',
  s:TI(`<path d="M50 8L36 58M50 8L62 56" class="vl"/><circle cx="50" cy="8" r="3" class="tn" style="fill:var(--surface)"/><path d="M14 58A36 36 0 0 1 86 58" class="hl" stroke-dasharray="4 3"/>`),
  d:'لرسم الدوائر والأقواس: تفتح ساقاه مسافة تساوي نصف القطر، وتثبت الإبرة في المركز ونتحرك مع عقرب الساعة مع إمالته قليلاً. وفرجار التقسيم ذو الإبرتين لنقل المسافات وتقسيمها.'},
 {k:'scales',n:'المساطر',en:'Scales',
  s:TI(`<rect x="8" y="26" width="84" height="18" class="vl" style="fill:var(--surface-2)"/>${Array.from({length:17},(_,i)=>`<line x1="${12+i*5}" y1="26" x2="${12+i*5}" y2="${i%5===0?36:31}" class="tn"/>`).join('')}`),
  d:'مدرجة ومقسمة إلى الملليمتر أو أجزاء البوصة، منها المسطح والمثلث، مختلفة التقسيم والاستعمال.'},
 {k:'scale',n:'مقياس الرسم',en:'Drawing Scale',
  s:TI(`<rect x="10" y="14" width="34" height="34" class="tn" style="fill:var(--surface-2)"/><rect x="58" y="22" width="17" height="17" class="vl" style="fill:var(--blue-soft)"/><text x="66" y="60" class="dt" text-anchor="middle">1 : 2</text>`),
  d:'نسبة طول الرسم إلى الطول الحقيقي للجسم؛ يرسم الجسم الصغير مكبراً والكبير مصغراً، ويكتب مقياس الرسم واضحاً على لوحة الرسم.'},
 {k:'tmpl',n:'الطبعات (الشبلونات)',en:'Templates',
  s:TI(`<rect x="8" y="12" width="84" height="46" rx="6" class="vl" style="fill:var(--blue-soft);fill-opacity:.6"/>${[[20,26,3],[32,26,4.5],[46,26,6],[64,30,9]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" class="tn" style="fill:var(--surface)"/>`).join('')}<rect x="16" y="42" width="10" height="8" class="tn" style="fill:var(--surface)"/><path d="M34 50l6-8l6 8z" class="tn" style="fill:var(--surface)"/>`),
  d:'من البلاستيك الشفاف اختصاراً للوقت وإتقاناً للعمل: للانحناءات، وللدوائر الصغيرة والمضلعات، والمرنة لنقل المنحنيات، وطبعات خاصة بالرموز الكهربائية والإلكترونية.'}
];
const toolQ=[
 ['رسم الخطوط الأفقية المتوازية، وتنزلق عليها المثلثات','tsq','ص 10'],['رسم الدوائر والأقواس الدائرية','comp','ص 13'],
 ['الخطوط الإنشائية العامة بقلم خفيف الظل سهل المسح (<span class="ltr">2H</span>)','pen','ص 10'],['رسم الخطوط المائلة بزوايا <span class="ltr">30° – 45° – 60°</span>','tri','ص 13'],
 ['سطح قاسٍ مستوٍ يثبت عليه ورق الرسم بشريط لاصق','board','ص 10'],['التحبير على ورق الكلك، ويجب تفريغها من الحبر بعد الاستعمال','ink','ص 11'],
 ['إزالة الخطوط الإنشائية المستغنى عنها','eraser','ص 12'],['رسم الرموز الكهربائية والدوائر الصغيرة بسرعة وإتقان','tmpl','ص 14'],
 ['قياس الأطوال بالملليمتر لإنجاز الرسومات بدقة','scales','ص 13'],['تكتب على اللوحة: نسبة طول الرسم إلى الطول الحقيقي','scale','ص 13']];
const PAPER=[['A0',1189,841],['A1',841,594],['A2',594,420],['A3',420,297],['A4',297,210]];
function paperSVG(sel){const s=0.36,W=1189*s+20,H=841*s+20;let h=svgOpen(W,H,'مقاسات ورق الرسم');
  /* A0 landscape; A1 = left half of A0, A2 = top half of A1 … (each size half of the one before — توضيح) */
  const R=[['A0',0,0,1189,841],['A1',0,0,594.5,841],['A2',0,0,594.5,420.5],['A3',0,0,297.25,420.5],['A4',0,0,297.25,210.25]];
  R.forEach(([n,X,Y,w2,h2])=>{const on=n===sel;h+=`<rect x="${f2(10+X*s)}" y="${f2(10+Y*s)}" width="${f2(w2*s)}" height="${f2(h2*s)}" class="${on?'hi':'tn'}" style="fill:${on?'var(--blue-soft)':'none'}" data-p="${n}"/>`});
  [['A0',1189*0.75,841*0.5],['A1',297,841*0.75],['A2',297*1.5,210],['A3',148,315],['A4',148,105]].forEach(([n,cx,cy])=>h+=tx(10+cx*s,10+cy*s+4,n,'dt'+(n===sel?' okt':''),'middle'));
  return h+'</svg>'}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'8–15',
 title:'أدوات الرسم وأقسامه',
 summary:'الرسم الفني لغة التفاهم بين المصمم والمنفذ. يقسم إلى رسم بالحاسب (برامج CAD) ورسم يدوي، وللرسم اليدوي أدوات: لوحة الرسم، والمسطرة حرف T، وأقلام الرصاص، والورق، وأقلام التحبير، والمثلثات، والفرجار، والمساطر، والطبعات، ويكتب على اللوحة مقياس الرسم.',
 stations:[
  (/*DCML-BEGIN*/(window.DCML=window.DCML||(function(){
/* «مختبر مصغّر» — أدوات صغيرة مشتركة لمحطات الأسلوب التفاعلي في مقرر آلات التيار المستمر والمحولات.
   تُعرَّف مرة واحدة (أول درس في كل ملف وحدة يحمل نسخة مطابقة، والأولى التي تُحمَّل هي المستعملة). */
const css=`
.ml{--mlh:42px}
.ml .ml-in{margin:0 0 10px;color:var(--muted);font-size:14px;line-height:1.8}
.ml .ml-b{font:inherit;font-size:14px;min-height:var(--mlh);padding:7px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--fg);cursor:pointer;line-height:1.5;text-align:start}
.ml .ml-b:hover:not(:disabled){border-color:var(--blue)}
.ml .ml-b:disabled{cursor:default}
.ml .ml-b[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.ml .ml-b.ok{border-color:var(--on);background:var(--on-soft);color:var(--fg)}
.ml .ml-b.no{border-color:var(--stop);background:var(--stop-soft);color:var(--fg)}
.ml .ml-b.dim{opacity:.55}
.ml .ml-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.ml .ml-fb{margin-top:10px;font-size:14.5px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px}
.ml .ml-fb.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.ml .ml-fb.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.ml .ml-fb:empty,.ml [hidden]{display:none}
.ml .ml-it{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:8px;background:var(--surface)}
.ml .ml-it p{margin:0 0 8px;line-height:1.75}
.ml .ml-it .ml-row{margin-top:0}
.ml .ml-why{margin-top:8px;font-size:14px;line-height:1.75}
.ml .ml-score{margin-top:10px;font-weight:700}
.ml .ml-ord{margin:10px 0 0;padding-inline-start:22px}
.ml .ml-ord li{margin:6px 0;padding:6px 10px;border-radius:10px;background:var(--on-soft);border:1px solid var(--on);line-height:1.6}
.ml .ml-pool{display:grid;gap:8px;margin-top:10px}
.ml .ml-sl{display:block;margin-top:12px;font-size:14px}
.ml .ml-sl .ml-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ml .ml-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:15px;white-space:nowrap}
.ml .ml-sl input{width:100%;accent-color:var(--blue);direction:ltr;margin:6px 0 0;height:28px}
.ml .ml-seg{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ml .ml-seg .ml-b{padding:6px 12px;min-height:40px}
.ml .ml-lbl{font-size:14px;margin-top:12px}
.ml .ml-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:8px;margin-top:12px}
.ml .ml-facts div{background:var(--surface-2);border-radius:12px;padding:8px 10px;min-width:0}
.ml .ml-facts span{display:block;font-size:12.5px;color:var(--muted);line-height:1.5}
.ml .ml-facts b{display:block;font-family:var(--mono);font-size:17px;direction:ltr;text-align:end;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ml .ml-facts div.hi{background:var(--blue-soft)}
.ml .ml-facts div.bad{background:var(--stop-soft)}
.ml .ml-bar{margin-top:10px}
.ml .ml-bar .ml-h{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--muted)}
.ml .ml-bar .ml-h b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--fg)}
.ml .ml-bar .ml-t{height:14px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin-top:4px;direction:ltr}
.ml .ml-bar .ml-t i{display:block;height:100%;border-radius:99px;transition:width .2s}
.ml .ml-plot{margin-top:12px;max-width:440px;margin-inline:auto}
.ml .ml-plot svg{width:100%;height:auto;display:block;touch-action:pan-y}
.ml .ml-pic{margin-top:10px;max-width:520px;margin-inline:auto}
.ml .ml-pic svg{width:100%;height:auto;display:block}
.ml .ml-lock{opacity:.45;pointer-events:none;filter:grayscale(.4)}
.ml .ml-pd{border:1.5px dashed var(--blue);border-radius:12px;padding:10px 12px;background:var(--bg)}
.ml .ml-pd .ml-q{font-weight:600;margin-bottom:8px;line-height:1.7}
.ml .ml-pd .ml-pool{margin-top:0}
.ml .ml-tag{display:inline-block;font-size:12px;font-weight:700;padding:1px 9px;border-radius:999px;background:var(--live-soft);color:var(--live);margin-inline-end:6px}
.ml .ml-ill{font-size:12.5px;color:var(--muted);margin-top:8px}
.ml .ltr{direction:ltr;unicode-bidi:isolate;white-space:nowrap}
`;
const addCss=()=>{if(document.getElementById('dcml-css'))return;const s=document.createElement('style');s.id='dcml-css';s.textContent=css;document.head.appendChild(s)};
const lt=s=>`<span class="ltr">${s}</span>`;
const fm=(B,x,d)=>{const s=B.fmtN(x,d);return /^-0(\.0+)?$/.test(s)?s.slice(1):String(s).replace(/^-/,'−')};
const q=(el,s)=>el.querySelector(s),qa=(el,s)=>[...el.querySelectorAll(s)];
const start=(el,B,intro)=>{addCss();el.classList.add('ml');return intro?`<p class="ml-in">${intro}</p>`:''};
const RX=/(\(\d+-\d+\)|\d[\d.,]*\s?(?:rpm|kHz|Hz|kV|V|mA|A|kW|W|Ω|%|N\.m|VA)(?![A-Za-z]))/g;
/* يثبّت اتجاه «رقم + وحدة» داخل النص العربي (مثل 0.3 A و 1000 rpm) حتى لا ينقلب */
function bidi(root){if(!root)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('svg,.katex,.ltr,.ml-facts b,.ml-sl b,.ml-bar b'))return 3;RX.lastIndex=0;return RX.test(n.data)?1:3}});const L=[];while(tw.nextNode())L.push(tw.currentNode);
 L.forEach(n=>{RX.lastIndex=0;const parts=n.data.split(RX);if(parts.length<2)return;const f=document.createDocumentFragment();parts.forEach((p,i)=>{if(!p)return;if(i%2){const sp=document.createElement('span');sp.className='ltr';sp.textContent=p;f.appendChild(sp)}else f.appendChild(document.createTextNode(p))});n.replaceWith(f)})}
const fin=(el,B)=>{try{B.math(el)}catch(e){}bidi(el)};
/* ترتيب ثابت «مخلوط» للعناصر (لا عشوائي حتى تبقى الصفحة نفسها في كل مرة)، ولا يساوي الترتيب الصحيح */
const mix=n=>{const a=[...Array(n).keys()];let s=n*7+3;for(let i=n-1;i>0;i--){s=(s*48271)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}
 if(a.every((v,i)=>v===i)&&n>1)a.push(a.shift());return a};

/* ---- صح أم خطأ: items [[العبارة, true|false, السبب], …] ---- */
function tf(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row"><button type="button" class="ml-b" data-a="1">صح</button><button type="button" class="ml-b" data-a="0">خطأ</button></div><div class="ml-why" hidden></div></div>`).join('');
 h+=`<div class="ml-score" hidden></div>`;el.innerHTML=h;fin(el,B);
 const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-a]').forEach(b=>b.onclick=()=>{const ans=b.dataset.a==='1',ok=ans===!!it[1];
   qa(box,'[data-a]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');if((x.dataset.a==='1')===!!it[1])x.classList.add('ok');else x.classList.add(x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> العبارة ${it[1]?'صحيحة':'خاطئة'}: ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   const n=Object.keys(done).length;if(n===o.items.length){const s=q(el,'.ml-score');const k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+n)}. ${k===n?'ممتاز.':''} <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;
    q(s,'[data-rs]').onclick=()=>tf(el,B,o)}})})}

/* ---- رتّب الخطوات: steps [نص | [نص, لماذا ليست الآن]] بالترتيب الصحيح ---- */
function order(el,B,o){const S=o.steps.map(s=>Array.isArray(s)?s:[s,'']);const m=mix(S.length);let nx=0;
 el.innerHTML=start(el,B,o.intro||'اضغط الخطوات بالترتيب الذي تنفذها به.')+`<ol class="ml-ord"></ol><div class="ml-pool">${m.map(i=>`<button type="button" class="ml-b" data-i="${i}">${S[i][0]}</button>`).join('')}</div><div class="ml-fb"></div><div class="ml-row"><button type="button" class="ml-b" data-rs>ابدأ من جديد</button></div>`;
 fin(el,B);const ol=q(el,'.ml-ord'),fb=q(el,'.ml-fb');
 qa(el,'.ml-pool [data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
  if(i===nx){const li=document.createElement('li');li.innerHTML=S[i][0];ol.appendChild(li);fin(li,B);b.hidden=true;nx++;fb.className='ml-fb';
   fb.innerHTML=nx===S.length?`<b>أحسنت، الترتيب كامل.</b> ${o.done||''}`:(o.after&&o.after[i]?o.after[i]:'');fin(fb,B)}
  else{fb.className='ml-fb bad';fb.innerHTML=`<b>ليست هذه الخطوة التالية.</b> ${S[i][1]||''}${o.hint?' '+o.hint(nx):''}`;fin(fb,B)}});
 q(el,'[data-rs]').onclick=()=>order(el,B,o)}

/* ---- صنّف: cats [اسم, …]; items [[نص, رقم الصنف, السبب], …] ---- */
function sort(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row">${o.cats.map((c,j)=>`<button type="button" class="ml-b" data-c="${j}">${c}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('')+`<div class="ml-score" hidden></div>`;
 el.innerHTML=h;fin(el,B);const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-c]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.c===it[1];
   qa(box,'[data-c]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(+x.dataset.c===it[1]?'ok':x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   if(Object.keys(done).length===o.items.length){const s=q(el,'.ml-score'),k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+o.items.length)}. <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;q(s,'[data-rs]').onclick=()=>sort(el,B,o)}})})}

/* ---- مواقف قصيرة: cases [{q, opts:[[نص, صحيح؟, السبب]]}] ---- */
function cases(el,B,o){let h=start(el,B,o.intro);
 h+=o.cases.map((c,i)=>`<div class="ml-it" data-i="${i}"><p><b>${o.cases.length>1?(i+1)+'. ':''}</b>${c.q}</p><div class="ml-pool">${c.opts.map((x,j)=>`<button type="button" class="ml-b" data-j="${j}">${x[0]}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('');
 el.innerHTML=h;fin(el,B);
 qa(el,'.ml-it').forEach(box=>{const c=o.cases[+box.dataset.i],w=q(box,'.ml-why'),bs=qa(box,'[data-j]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.j,ok=!!c.opts[j][1];
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(c.opts[+x.dataset.j][1]?'ok':x===b?'no':'dim')});
   const right=c.opts.find(x=>x[1]);w.innerHTML=`<b>${ok?'صحيح.':'ليس هذا.'}</b> ${c.opts[j][2]||''}${!ok&&right&&right[2]?'<br>'+right[2]:''} <button type="button" class="ml-b" data-r style="min-height:34px;padding:3px 10px">حاول مرة أخرى</button>`;w.hidden=false;fin(w,B);
   q(w,'[data-r]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});w.hidden=true}})})}

/* ---- رسم بياني صغير: {xr:[a,b], yr:[a,b], xl, yl, curves:[{f|pts, col, dash, w}], dots:[[x,y,col]], cur:[x,y], xt:[...], yt:[...], fx, fy} ---- */
function plot(B,o){const W=o.w||340,H=o.h||210,L=46,R=12,T=26,Bm=34,[x0,x1]=o.xr,[y0,y1]=o.yr;
 const X=x=>L+(x-x0)/((x1-x0)||1)*(W-L-R),Y=y=>H-Bm-(y-y0)/((y1-y0)||1)*(H-T-Bm);const f1=v=>(+v).toFixed(1);
 const tk=(a,b)=>{const sp=(b-a)||1,e=Math.pow(10,Math.floor(Math.log10(sp/4))),st=[1,2,2.5,5,10].map(k=>k*e).find(k=>sp/k<=5.01);const r=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st)r.push(+v.toFixed(10));return r};
 const xt=o.xt||tk(x0,x1),yt=o.yt||tk(y0,y1),fx=o.fx||(v=>fm(B,v)),fy=o.fy||(v=>fm(B,v));
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'رسم بياني'}" style="font-family:var(--font)" direction="ltr">`;
 s+=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${f1(Y(v))}" y2="${f1(Y(v))}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${f1(Y(v)+4)}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noYt?'':fy(v)}</text>`).join('');
 s+=xt.map(v=>`<text x="${f1(X(v))}" y="${H-Bm+15}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noXt?'':fx(v)}</text>`).join('');
 s+=`<path d="M${L} ${T-4}V${H-Bm}H${W-R+4}" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;
 (o.curves||[]).forEach(c=>{let p=c.pts;if(!p){p=[];const n=c.n||80;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=c.f(x);if(isFinite(y))p.push([x,y])}}
  const cl=v=>Math.max(y0-(y1-y0)*0.04,Math.min(y1+(y1-y0)*0.04,v));
  s+=`<path d="${p.map((q,i)=>(i?'L':'M')+f1(X(q[0]))+' '+f1(Y(cl(q[1])))).join('')}" fill="none" stroke="var(${c.col||'--blue'})" stroke-width="${c.w||2.6}" ${c.dash?`stroke-dasharray="${c.dash}"`:''} stroke-linejoin="round" stroke-linecap="round"/>`;
  if(c.lab){const q=p[p.length-1];s+=`<text x="${f1(X(q[0])-4)}" y="${f1(Y(cl(q[1]))-7)}" text-anchor="end" font-size="11.5" fill="var(${c.col||'--blue'})" font-weight="700" ${/[؀-ۿ]/.test(c.lab)?'direction="rtl"':''}>${c.lab}</text>`}});
 (o.dots||[]).forEach(d=>{s+=`<circle cx="${f1(X(d[0]))}" cy="${f1(Y(d[1]))}" r="3.6" fill="var(${d[2]||'--fg'})"/>`});
 if(o.cur){const [cx,cy]=o.cur;if(isFinite(cx)&&isFinite(cy)){const yy=Math.max(y0,Math.min(y1,cy));s+=`<path d="M${f1(X(cx))} ${H-Bm}V${f1(Y(yy))}H${L}" fill="none" stroke="var(--live)" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${f1(X(cx))}" cy="${f1(Y(yy))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`}}
 const ar=t=>/[\u0600-\u06FF]/.test(t||'');s+=`<text x="${W-R}" y="${H-4}" text-anchor="${ar(o.xl)?'start':'end'}" ${ar(o.xl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.xl||''}</text>`;
 s+=`<text x="${L-40}" y="13" text-anchor="${ar(o.yl)?'end':'start'}" ${ar(o.yl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.yl||''}</text>`;
 return s+'</svg>'}

/* ---- المختبر المصغّر: منزلقات/أزرار + نتيجة حية + «توقّع أولاً» ----
 o={intro, predict:{q,opts:[[t,ok,why]]}, ins:[{k,l,u,min,max,step,v,dp} | {k,l,seg:[[v,label]],v} | {k,l,sw:true,v,on,off}],
    tp:{id,defs} (قيم توضيحية من تبويب المختبر), ill:true (ينبّه أن القيم توضيحية), calc:(s,P,B)=>({facts:[[label,html,cls]], bars:[{l,v,max,u,dp,col}], plot:{…}, pic:svg, msg:html, cls:'bad'|'warn'})} */
function lab(el,B,o){let h=start(el,B,o.intro);let P={v:{},trainer:false};
 if(o.tp){const hid=document.createElement('div');const dfl=()=>({v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false});try{P=(B.chOn&&B.chOn())?dfl():B.params(hid,o.tp.id,o.tp.defs)}catch(e){P={v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false}}}
 const s={};o.ins.forEach(i=>s[i.k]=i.v);
 if(o.predict)h+=`<div class="ml-pd"><div class="ml-q"><span class="ml-tag">توقّع أولاً</span>${o.predict.q}</div><div class="ml-pool">${o.predict.opts.map((x,j)=>`<button type="button" class="ml-b" data-pj="${j}">${x[0]}</button>`).join('')}</div><div class="ml-fb" data-pfb hidden></div></div>`;
 h+=`<div class="ml-body${o.predict?' ml-lock':''}">`;
 h+=o.ins.map(i=>i.seg?`<div class="ml-lbl">${i.l}</div><div class="ml-seg" data-k="${i.k}">${i.seg.map(([v,l])=>`<button type="button" class="ml-b" data-v="${v}">${l}</button>`).join('')}</div>`
   :i.sw?`<div class="ml-row"><button type="button" class="ml-b" data-sw="${i.k}">${i.l}</button></div>`
   :`<label class="ml-sl"><span class="ml-h"><span>${i.l}</span><b data-ov="${i.k}"></b></span><input type="range" data-k="${i.k}" min="${i.min}" max="${i.max}" step="${i.step||'any'}" value="${i.v}" aria-label="${String(i.l).replace(/<[^>]+>/g,'')}"></label>`).join('');
 h+=`<div data-pic></div><div class="ml-facts" data-facts></div><div data-bars></div><div class="ml-plot" data-plot></div><div class="ml-fb" data-msg></div>`;
 h+=(o.tp||o.ill)?`<p class="ml-ill">${P.trainer?'الأرقام هنا <b>قيم المدرب</b> (من تبويب «المختبر»).':'الأرقام هنا <b>قيم توضيحية</b> ليست من الكتاب'+(o.tp?'، ويستطيع المدرب تغييرها من «قيم المدرب» في تبويب «المختبر».':'.')}</p>`:'';
 h+=`</div>`;el.innerHTML=h;fin(el,B);
 const body=q(el,'.ml-body');
 const draw=()=>{o.ins.forEach(i=>{if(i.seg)qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset.v)===String(s[i.k]))));
   else if(i.sw){const b=q(el,`[data-sw="${i.k}"]`);b.setAttribute('aria-pressed',String(!!s[i.k]));if(i.on){b.innerHTML=s[i.k]?i.on:i.off;bidi(b)}}
   else{const ov=q(el,`[data-ov="${i.k}"]`);ov.textContent=(i.fmt?i.fmt(s[i.k]):fm(B,+s[i.k],i.dp))+(i.u?' '+i.u:'')}});
  let r={};try{r=o.calc(s,P.v,B)||{}}catch(e){console.error(e);r={msg:''}}
  q(el,'[data-pic]').innerHTML=r.pic?`<div class="ml-pic">${r.pic}</div>`:'';
  q(el,'[data-facts]').innerHTML=(r.facts||[]).map(f=>`<div class="${f[2]||''}"><span>${f[0]}</span><b>${f[1]}</b></div>`).join('');
  q(el,'[data-bars]').innerHTML=(r.bars||[]).map(b=>{const k=Math.max(0,Math.min(1,b.v/(b.max||1)));return `<div class="ml-bar"><div class="ml-h"><span>${b.l}</span><b>${b.txt!=null?b.txt:fm(B,b.v,b.dp)+(b.u?' '+b.u:'')}</b></div><div class="ml-t"><i style="width:${(k*100).toFixed(1)}%;background:var(${b.col||'--blue'})"></i></div></div>`}).join('');
  q(el,'[data-plot]').innerHTML=r.plot?plot(B,r.plot):'';
  const m=q(el,'[data-msg]');m.className='ml-fb'+(r.cls?' '+r.cls:'');m.innerHTML=r.msg||'';if(r.msg)fin(m,B);bidi(q(el,'[data-facts]'));bidi(q(el,'[data-bars]'))};
 qa(el,'input[data-k]').forEach(inp=>inp.oninput=()=>{s[inp.dataset.k]=+inp.value;draw()});
 o.ins.filter(i=>i.seg).forEach(i=>qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.onclick=()=>{const v=b.dataset.v;s[i.k]=isNaN(+v)?v:+v;draw()}));
 qa(el,'[data-sw]').forEach(b=>b.onclick=()=>{const k=b.dataset.sw;s[k]=s[k]?0:1;draw()});
 if(o.predict){const bs=qa(el,'[data-pj]'),fb=q(el,'[data-pfb]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.pj,op=o.predict.opts[j],ok=!!op[1],right=o.predict.opts.find(x=>x[1]);
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(o.predict.opts[+x.dataset.pj][1]?'ok':x===b?'no':'dim')});
   fb.className='ml-fb'+(ok?'':' warn');fb.innerHTML=`<b>${ok?'توقّعك صحيح.':'ليس هذا.'}</b> ${op[2]||''}${!ok&&right[2]?'<br>'+right[2]:''}<br><b>الآن جرّب بنفسك في الأسفل وتأكد.</b> <button type="button" class="ml-b" data-pr style="min-height:34px;padding:3px 10px">غيّر توقّعك</button>`;fb.hidden=false;fin(fb,B);
   body.classList.remove('ml-lock');
   q(fb,'[data-pr]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true}})}
 draw();return {s,draw,P}}

/* ---- جهاز قياس بمؤشر: {v, max, lab:'V', txt, zero:'c' (صفر في المنتصف للقطبية)} ---- */
function gauge(B,o){const cx=110,cy=104,r=82,c=o.zero==='c';const k=Math.max(c?-1.06:-0.03,Math.min(1.06,(o.v||0)/(o.max||1)));
 const a=c?(-90+k*60)*Math.PI/180:(-150+k*120)*Math.PI/180,a0=c?-150:-150,a1=-30;const P=(ang,R)=>[cx+R*Math.cos(ang*Math.PI/180),cy+R*Math.sin(ang*Math.PI/180)];
 const [x0,y0]=P(a0,r),[x1,y1]=P(a1,r);let t='';for(let i=0;i<=8;i++){const g=a0+(a1-a0)*i/8,[p,q]=P(g,r),[u,w]=P(g,r-(i%4?7:12));t+=`<line x1="${p.toFixed(1)}" y1="${q.toFixed(1)}" x2="${u.toFixed(1)}" y2="${w.toFixed(1)}" stroke="var(--fg)" stroke-width="1.4"/>`}
 const nx=cx+(r-10)*Math.cos(a),ny=cy+(r-10)*Math.sin(a);
 return `<svg viewBox="0 0 220 132" role="img" aria-label="جهاز قياس" style="font-family:var(--font);max-width:240px;display:block;margin-inline:auto" direction="ltr"><path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="var(--fg)" stroke-width="2"/>${t}${c?`<text x="${cx}" y="${cy-r-6}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--mono)">0</text><text x="${(x0+8).toFixed(1)}" y="${(y0+16).toFixed(1)}" font-size="14" fill="var(--stop)" font-family="var(--mono)">−</text><text x="${(x1-16).toFixed(1)}" y="${(y1+16).toFixed(1)}" font-size="14" fill="var(--on)" font-family="var(--mono)">+</text>`:''}<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--live)" stroke-width="3.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/><text x="${cx}" y="${cy+24}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--fg)" font-family="var(--mono)">${o.lab||''}</text>${o.txt!=null?`<text x="${cx}" y="${cy-28}" text-anchor="middle" font-size="14" fill="var(--blue-ink)" font-family="var(--mono)" font-weight="700">${o.txt}</text>`:''}</svg>`}

return {tf,order,sort,cases,lab,plot,gauge,lt,fm,mix};
})())/*DCML-END*/,
/*DWS-BEGIN*/(window.DWS=window.DWS||(function(){
/* أدوات محطات مقرر الرسم الفني (الوحدة الأولى): رسومات المحطات مبنية بأدوات الرسم نفسها الموجودة في ملف الدرس
   (محرك المساقط، sheetSVG، consSVG، tplSVG …) داخل إطار المحطة الثابت 360×320 بخلفية فاتحة.
   خلفية رسم المحطة فاتحة دائماً (حتى في الوضع الداكن)، لذلك نثبت ألوان أدوات الرسم داخلها بمتغيرات محلية. */
const AP='--fg:#2C4A40;--muted:#56645A;--surface:#FBF6EE;--surface-2:#EADFCB;--line:#CDBFA8;--blue:#2F6FA8;--blue-ink:#1F4E7A;--blue-soft:#D3E4F1;--live:#C25F12;--live-soft:#F7E0C2;--on:#12855A;--on-soft:#D2ECDD;--stop:#B8402E;--stop-soft:#F3D5CC';
const INK='#2C4A40';
const r2=x=>(Math.round(x*100)/100).toString();
/* إطار رسم المحطة */
const art=(aria,body,bg)=>`<svg viewBox="0 0 360 320" class="dwv" role="img" aria-label="${aria}" style="font-family:var(--font);${AP}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg||'#DDEFE6'}"/>${body}</svg>`;
/* يضع رسماً (نص svg كامل من أدوات الدرس) داخل المستطيل x,y,w,h من إطار المحطة؛ M يحول إحداثيات الرسم الداخلي إلى إحداثيات الإطار */
function put(svg,x,y,w,h){const m=/^<svg[^>]*?viewBox="0 0 ([\d.]+) ([\d.]+)"[^>]*>/.exec(svg);if(!m)return {g:'',M:p=>p,k:1};const W=+m[1],H=+m[2];
 const k=Math.min(w/W,h/H),dx=x+(w-W*k)/2,dy=y+(h-H*k)/2;const body=svg.slice(m[0].length).replace(/<\/svg>\s*$/,'');
 return {g:`<g transform="translate(${r2(dx)} ${r2(dy)}) scale(${+k.toFixed(4)})">${body}</g>`,M:p=>[dx+p[0]*k,dy+p[1]*k],k}}
/* يولد الرسم بعرض يناسب المستطيل تماماً (حتى لا تصغر الكتابة): gen(px) يعيد نص svg بعرض px */
function fit(gen,x,y,w,h){const s0=gen(100);const m=/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s0);const px=Math.floor(100*Math.min(w/+m[1],h/+m[2]));const r=put(gen(px),x,y,w,h);r.px=px;return r}
/* منطقة تلميح شفافة */
const tip=(x,y,w,h,t)=>`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(Math.max(6,w))}" height="${r2(Math.max(6,h))}" rx="5" fill="transparent" data-tip="${t}"/>`;
/* تلميح على مستطيل من إحداثيات الرسم الداخلي (نقطتان متقابلتان) */
const tipR=(M,a,b,t,pad)=>{const p=M(a),q=M(b),e=pad==null?4:pad;return tip(Math.min(p[0],q[0])-e,Math.min(p[1],q[1])-e,Math.abs(q[0]-p[0])+2*e,Math.abs(q[1]-p[1])+2*e,t)};
/* نص داخل الإطار: عربي (اتجاه rtl) أو لاتيني/رقمي */
const txt=(x,y,s,o)=>{o=o||{};const ar=/[؀-ۿ]/.test(s);return `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${o.a||'middle'}" font-size="${o.fs||13}"${o.b?' font-weight="700"':''} fill="${o.c||INK}"${ar?' direction="rtl"':' font-family="var(--mono)" direction="ltr"'}>${s}</text>`};
/* رسم من تبويب «الشرح» الرسمي للدرس نفسه (نعيد استعمال كود الرسم بدل إعادة رسمه): رقم الرسم n من الرسوم ذات المرجع ref */
function fig(B,lid,ref,n){const L=B.LESSONS.find(l=>l.id===lid);const f=L.theory.filter(x=>x.draw&&x.ref===ref)[n||0];const h=f.draw();return (h.match(/<svg[\s\S]*?<\/svg>/g)||[])}
/* الرسم كاملاً (html) من تبويب الشرح الرسمي مع تعليقه */
function figHtml(B,lid,ref,n,cap){const L=B.LESSONS.find(l=>l.id===lid);const f=L.theory.filter(x=>x.draw&&x.ref===ref)[n||0];return `<figure style="margin:8px auto 12px">${f.draw()}<figcaption class="sub" style="text-align:center;margin-top:4px">${cap||f.caption||''} — ${ref}</figcaption></figure>`}
const ensureCss=B=>{try{DCML.tf(document.createElement('div'),B,{items:[]})}catch(e){}};
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---- مختبر مصغّر: حدد نوع كل حافة في المسقط الناقص (يعيد استعمال consSVG من الدرس 4) ----
   o={part:'C27', miss:'S', intro, done} */
function typeLines(el,B,o,getP,consPts,consSVG){ensureCss(B);el.classList.add('ml');const P=getP(o.part),c=consPts(P,o.miss);let typed=c.segs.map(()=>'?'),res=null;
 el.innerHTML=`<p class="ml-in">${o.intro||''}</p><div class="dw-sheet" data-s style="max-width:460px;margin-inline:auto"></div><div class="ml-row"><button type="button" class="ml-b" data-ck>تحقّق</button><button type="button" class="ml-b" data-sh>أظهر الحل</button><button type="button" class="ml-b" data-rs>ابدأ من جديد</button></div><div class="ml-fb" data-m></div>`;
 const q=s=>el.querySelector(s);
 const draw=()=>{q('[data-s]').innerHTML=consSVG(P,o.miss,{pts:c.pts,cur:-1,target:'typed',typed,res,hit:true,px:440});
  const m=q('[data-m]');const n=typed.filter(t=>t!=='?').length;
  if(res){const bad=res.filter(x=>!x).length;m.className='ml-fb'+(bad?' bad':'');m.innerHTML=bad?`<b>عدد الخطوط غير الصحيحة: ${lt(bad)} من ${lt(res.length)}</b> (بالأحمر). الحافة <b>مختفية</b> إذا كان بينها وبين الناظر جزء من الجسم في اتجاه هذا المسقط، فترسم متقطعة.`:`<b>أحسنت، كل الخطوط صحيحة.</b> ${o.done||''}`}
  else{m.className='ml-fb';m.innerHTML=`المس كل خط رمادي منقط: لمسة تجعله <b>متصلاً</b> (حافة ظاهرة)، ولمسة ثانية تجعله <b>متقطعاً</b> (حافة مختفية). حددت ${lt(n)} من ${lt(typed.length)} خطاً.`}};
 q('[data-s]').addEventListener('click',e=>{const t=e.target.closest('[data-e]');if(!t)return;const i=+t.dataset.e;typed[i]=typed[i]==='v'?'h':'v';res=null;draw()});
 q('[data-ck]').onclick=()=>{res=c.segs.map((s,i)=>typed[i]===s.t);draw()};
 q('[data-sh]').onclick=()=>{typed=c.segs.map(s=>s.t);res=c.segs.map(()=>true);draw()};
 q('[data-rs]').onclick=()=>{typed=c.segs.map(()=>'?');res=null;draw()};
 draw()}


/* ---- مختبر مصغّر: انقل النقاط واحدة بعد أخرى إلى المسقط الناقص (consSVG من الدرس 4) ----
   o={part:'step', miss:'F'|'S'|'T', intro, predict, msg, done} */
function transfer(el,B,o){const pk=o.part||'step',P=getP(pk),c=consPts(P,o.miss),N=c.pts.length;
 return DCML.lab(el,B,{intro:o.intro,predict:o.predict,ins:[{k:'n',l:'النقاط المنقولة إلى المسقط المطلوب',min:1,max:N,step:1,v:1,fmt:v=>Math.round(v)+' / '+N}],
  calc:s=>{const n=Math.round(s.n);return {pic:`<div class="dw-sheet">${consSVG(P,o.miss,{pts:c.pts.slice(0,n),cur:n<N?n-1:-1,target:n<N?'grey':'final',num1:pk==='step',px:440})}</div>`,msg:n<N?o.msg:o.done}}})}

return {figHtml,fit,transfer,AP,INK,art,put,tip,tipR,txt,fig,typeLines,ensureCss,lt};
})())/*DWS-END*/,{intro:true}),
{st:1,short:'تمهيد',title:'تمهيد: الرسم الفني لغة التفاهم',ref:'ص 5–6',
   q:'مصمم في بلد وفني في بلد آخر لا يتكلمان لغة واحدة… فكيف يصنع الفني القطعة كما أرادها المصمم تماماً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المصمم يرسم، والرسم الفني ينتقل إلى المنفذ فينفذ القطعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="المصمم: يضع فكرة القطعة أو الجهاز ويعبّر عنها بالرسم الفني بأسسه وقواعده واصطلاحاته ورموزه."><circle cx="66" cy="112" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M40 196V152a26 22 0 0 1 52 0V196Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M84 158l18 -14" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g>
<text x="66" y="220" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">المصمم</text>
<g data-tip="الرسم الفني: لغة التفاهم الدولية ذات أسس وقواعد واصطلاحات ورموز، يفهمها المصمم والمنفذ معاً."><rect x="128" y="96" width="104" height="104" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="142" y="112" width="40" height="30" fill="none" stroke="#2C4A40" stroke-width="2.2"/><rect x="190" y="112" width="26" height="30" fill="none" stroke="#2C4A40" stroke-width="2.2"/><rect x="142" y="150" width="40" height="22" fill="none" stroke="#2C4A40" stroke-width="2.2"/><line x1="142" y1="186" x2="182" y2="186" stroke="#2C4A40" stroke-width="1"/><path d="M142 186l6 -2.5v5zM182 186l-6 -2.5v5z" fill="#2C4A40"/><line x1="203" y1="146" x2="203" y2="182" stroke="#2C4A40" stroke-width="1" stroke-dasharray="6 2 1.5 2"/></g>
<text x="180" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">الرسم الفني</text>
<g data-tip="المنفذ (العامل الفني): يقرأ الرسم الفني فيفهم المطلوب، وينفذ القطعة بكل دقة."><circle cx="294" cy="112" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><path d="M268 196V152a26 22 0 0 1 52 0V196Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M262 166l-14 -14m-6 -4a6 6 0 1 0 8 8" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g>
<text x="294" y="220" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">المنفذ</text>
<path d="M100 236H260" stroke="#2C4A40" stroke-width="2.5"/><path d="M262 236l-10 -6v12zM98 236l10 -6v12z" fill="#2C4A40"/>
<text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40">لغة تفاهم واحدة بين الاثنين</text></svg>`,
   cap:'الرسم الفني يحمل فكرة المصمم إلى المنفذ.<br><b>مرّر المؤشر على المصمم والرسم والمنفذ (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'لماذا يسمي الكتاب الرسم الفني «لغة التفاهم الدولية»؟',opts:[
     ['لأنه يكتب دائماً باللغة الإنجليزية',false,'الرسم الفني لا يعتمد على لغة الكلام؛ يعتمد على أسس وقواعد ورموز متفق عليها.'],
     ['لأن له أسساً وقواعد واصطلاحات ورموزاً يفهمها المصمم والمنفذ',true,'هذا نص الكتاب (ص 5): بها يستطيع المصمم والمنفذ «الفهم والتفاهم في مجال تخصصهم».'],
     ['لأنه لا يرسم إلا بالحاسب',false,'الكتاب يقسم الرسم الفني إلى رسم بالحاسب ورسم يدوي (ص 9)، وكلاهما لغة واحدة.']]}}
   ],
   body:[
    {book:`<p>إن أساس تقدم الشعوب ينبني على دعائم أساسية عديدة من أهمها الصناعة والتي تعتبر إحدى الركائز الأساسية، بل تعتبر المقياس الأول لمدى التطور الحضاري لأي بلد في العالم. ويعتمد التطور الحضاري بوجه عام والصناعة بصفة خاصة اعتماداً كلياً على الكهرباء. فبواسطتها تدار الآلات في المصانع وتضاء المنازل والشوارع ويتم تشغيل الأجهزة والآلات التي تعمل على راحة ورفاهية الإنسان وتقدمه. وتحتل التقنية الكهربائية مكاناً قيادياً في مجالات الصناعة نظراً لأهمية الدور الذي تقوم به في سبيل تحقيق هذا التقدم. ويعتبر الرسم الفني المرحلة الأولى في إنشاء أي صناعة، وبالتالي في تقنية الكهرباء، إذ إنه أصبح لغة التفاهم الدولية ذات أسس وقواعد واصطلاحات ورموز يستطيع بها المصمم والمنفذ، أي العامل الفني الفهم والتفاهم في مجال تخصصهم، وهو اللبنة الأولى في المفهوم التكنولوجي عند إخراج العلوم والاختراعات إلى حيز التنفيذ مع تحديد أساليب تصنيعها لتنفيذ عمل مفيد مع مراعاة النواحي الاقتصادية سواء في التصنيع أو في التشغيل وهذا يوضح المفهوم العملي لتطور الصناعة.</p>
     <p>ويحتوي هذا الكتاب على الرموز الكهربائية لعناصر الدوائر الكهربائية ورموز عناصر إلكترونيات القدرة. وكذلك يحتوي على رموز عناصر التحكم والحماية ورموز الآلات الكهربائية. ويحتوي أيضاً على توصيلات الإضاءة والتجهيزات المنزلية ولوحات التوزيع الرئيسة والفرعية. وكذلك يحتوي على الدوائر الخطية لتغذية المصانع وشبكات التوزيع فيها ومخططات دوائر التوصيل للآلات ومخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية ومخططات دوائر نظم القوى الكهربائية وعناصر حمايتها.</p>
     <p>وكان الهدف من ذلك إيجاد جيل واعٍ من الفنيين يستطيعون أن يتفهموا ما حولهم من أجهزة ومعدات وتركيبات في مجال الصناعة ذات أساليب التحكم التلقائي الذي هو هدف القائمين بالصناعة في كل أنحاء العالم. ويكون المتدرب على دراية خاصة وكذلك التعامل مع هذه المعدات لإصلاحها وصيانتها، نرجو من الله العلي القدير أن يحقق الأهداف المرجوة التي من أجلها وضع هذا الكتاب.</p>
     <p>ولقد زود الكتاب بأمثلة من التمارين والتطبيقات النموذجية المأخوذة من واقع الحياة العملية. وتحقيقاً للأهداف المنشودة فإننا ننصح المتدرب بحل كل التمارين الواردة في هذا الكتاب، إذ إن ذلك يساعده على استيعاب المادة العلمية، ويعتبر أيضاً من المقومات التي يحتاج إليها المتدرب في حياته العملية فيما بعد. ويهدف هذا المقرر إلى تعريف المتدرب بأساسيات الرسم الكهربائي ورموز عناصر الدوائر الكهربائية المختلفة ليتمكن المتدرب من فهم وقراءة المخططات الكهربائية.</p>`,ref:'ص 5–6'},
    {tip:`<p>الرسم الفني لا يحتاج مترجماً: الخط المتصل والخط المتقطع ورمز المصباح والبعد المكتوب لها المعنى نفسه عند كل من تعلّم قواعدها. لذلك يبدأ المقرر بقواعد الرسم (هذه الوحدة) ثم الرموز الكهربائية، ثم المخططات.</p>`,title:'الفكرة في سطرين'},
    {title:'تحقق سريع: ماذا يقول التمهيد؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص التمهيد.',items:[
     ['الرسم الفني هو المرحلة الأولى في إنشاء أي صناعة.',true,'الكتاب (ص 5): «ويعتبر الرسم الفني المرحلة الأولى في إنشاء أي صناعة».'],
     ['يكفي أن يقرأ المتدرب الأمثلة دون أن يحل التمارين.',false,'الكتاب ينصح «بحل كل التمارين الواردة في هذا الكتاب» لأنه يساعد على استيعاب المادة (ص 6).'],
     ['من موضوعات الكتاب مخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية.',true,'مذكورة في الفقرة الثانية من التمهيد.'],
     ['يهدف المقرر إلى أن يتمكن المتدرب من فهم وقراءة المخططات الكهربائية.',true,'هذه آخر جملة في التمهيد (ص 6).']]})}
   ]},

  {st:2,short:'أهداف المقرر',title:'أهداف المقرر',ref:'ص 6',
   q:'في نهاية المقرر… ماذا يجب أن تستطيع أن تفعل بالضبط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لأهداف المقرر الأربعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<g data-tip="الهدف 1: الإلمام بالرموز الكهربائية (الوحدة الثانية: رموز العناصر والتحكم والآلات)."><rect x="44" y="52" width="128" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="68" cy="74" r="13" fill="#2C4A40"/><text x="68" y="79" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE">1</text><path d="M66 118h18l5 -10l8 20l8 -20l8 20l8 -20l5 10h18" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linejoin="round"/><text x="108" y="146" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الرموز</text></g>
<g data-tip="الهدف 2: الإلمام بتصنيف المخططات والدوائر الكهربائية وقراءتها (مثل الدائرة الخطية والدائرة التنفيذية)."><rect x="188" y="52" width="128" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="212" cy="74" r="13" fill="#2C4A40"/><text x="212" y="79" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE">2</text><rect x="226" y="92" width="62" height="38" fill="#E9F0E8" stroke="#2C4A40" stroke-width="2"/><path d="M234 102h46M234 112h30M234 122h40" stroke="#2C4A40" stroke-width="2"/><text x="252" y="146" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">المخططات</text></g>
<g data-tip="الهدف 3: الإلمام بدوائر التوصيل ورسمها (مثل مخططات توصيل الآلات الكهربائية)."><rect x="44" y="168" width="128" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="68" cy="190" r="13" fill="#2C4A40"/><text x="68" y="195" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE">3</text><circle cx="120" cy="226" r="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="120" y="232" text-anchor="middle" font-size="17" font-weight="700" fill="#2C4A40" font-family="var(--mono)">M</text><path d="M80 226h20M140 226h20" stroke="#2C4A40" stroke-width="2.5"/><text x="108" y="264" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التوصيل</text></g>
<g data-tip="الهدف 4: الإلمام بدوائر التحكم ودوائر الحماية (مثل دوائر بدء الحركة ووقاية المحركات والمحولات)."><rect x="188" y="168" width="128" height="104" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="212" cy="190" r="13" fill="#2C4A40"/><text x="212" y="195" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE">4</text><path d="M252 202l22 8v14c0 12 -10 20 -22 24c-12 -4 -22 -12 -22 -24v-14z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M243 224l7 7l12 -14" fill="none" stroke="#FBF6EE" stroke-width="3"/><text x="252" y="264" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التحكم والحماية</text></g></svg>`,
   cap:'أهداف المقرر الأربعة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف الهدف وأين تدرسه.</b>',
   side:[
    {predict:{q:'أي مما يأتي <b>ليس</b> من أهداف المقرر الأربعة في الكتاب؟',opts:[
     ['الإلمام بالرموز الكهربائية',false,'هذا هو الهدف الأول (ص 6).'],
     ['الإلمام بدوائر التحكم ودوائر الحماية',false,'هذا هو الهدف الرابع (ص 6).'],
     ['تصنيع الآلات الكهربائية',true,'الكتاب لا يذكره هدفاً؛ المقرر عن رسم المخططات وقراءتها، لا عن تصنيع الآلات.']]}}
   ],
   body:[
    {book:`<p>إن الأهداف الموضوعية من دراسة هذا المقرر أن يتمكن المتدرب بإذن الله من الآتي:</p><ol><li>الإلمام بالرموز الكهربائية.</li><li>الإلمام بتصنيف المخططات والدوائر الكهربائية وقراءتها.</li><li>الإلمام بدوائر التوصيل ورسمها.</li><li>الإلمام بدوائر التحكم ودوائر الحماية.</li></ol>`,ref:'ص 6'},
    {tip:`<p>لاحظ الأفعال: «الإلمام بالرموز» يعني أن تعرف الرمز ومعناه، و«قراءة المخططات» أن تفهم ما يرسم، و«رسمها» أن تنتجه أنت بنفسك. الوحدة الأولى التي بين يديك هي الأساس الذي تقوم عليه هذه الأهداف كلها: قواعد الخطوط والأبعاد والمساقط.</p>`,title:'ما معنى «الإلمام»؟'},
    {title:'تحقق سريع: أهداف المقرر',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['أهداف المقرر أربعة، أولها الإلمام بالرموز الكهربائية.',true,'كما في قائمة الكتاب (ص 6).'],
     ['رسم دوائر التوصيل ليس من أهداف المقرر، المطلوب قراءتها فقط.',false,'الهدف الثالث: «الإلمام بدوائر التوصيل <b>ورسمها</b>».'],
     ['من أهداف المقرر تصنيف المخططات والدوائر الكهربائية.',true,'الهدف الثاني: «الإلمام بتصنيف المخططات والدوائر الكهربائية وقراءتها».']]})}
   ]},

  {st:3,short:'أهداف الوحدة',title:'الوحدة الأولى: المبادئ الأساسية للرسم الفني — الأهداف',ref:'ص 7–8',
   q:'قبل أن ترسم رمزاً كهربائياً واحداً… ما المبادئ التي يجب أن تتقنها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع مراحل الوحدة الأولى: الأدوات، الأبعاد، المساقط، المقاطع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<path d="M76 100C150 70 210 70 284 100M284 100C300 150 300 170 284 220M284 220C210 250 150 250 76 220" fill="none" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 5"/>
<g data-tip="الهدف 1: أن يتعرف المتدرب على أدوات الرسم المختلفة وكيفية استخدامها (الدرس الأول)."><circle cx="76" cy="100" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M76 74L62 120M76 74L90 118" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><circle cx="76" cy="74" r="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g>
<text x="76" y="158" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الأدوات</text>
<g data-tip="الهدف 2: أن يتقن المتدرب كتابة الأبعاد على المشغولات (الدرس الثاني)."><circle cx="284" cy="100" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="96" width="44" height="22" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2.2"/><path d="M262 82h44M262 76v12M306 76v12" stroke="#2C4A40" stroke-width="1.3"/><path d="M262 82l7 -3v6zM306 82l-7 -3v6z" fill="#2C4A40"/></g>
<text x="284" y="158" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الأبعاد</text>
<g data-tip="الهدف 3: أن يتقن المتدرب رسم مساقط المشغولات: الرأسي والجانبي والأفقي (الدروس 3 إلى 7)."><circle cx="284" cy="220" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="200" width="22" height="20" fill="none" stroke="#2C4A40" stroke-width="2.2"/><rect x="290" y="200" width="12" height="20" fill="none" stroke="#2C4A40" stroke-width="2.2"/><rect x="262" y="226" width="22" height="12" fill="none" stroke="#2C4A40" stroke-width="2.2"/></g>
<text x="284" y="278" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">المساقط</text>
<g data-tip="الهدف 4: أن يتقن المتدرب رسم مقاطع الأجسام (الدرس الثامن)."><circle cx="76" cy="220" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="56" y="200" width="40" height="40" fill="none" stroke="#2C4A40" stroke-width="2.2"/><path d="M56 212l12 -12M56 224l24 -24M56 236l20 -20M84 240l12 -12M90 240l6 -6" stroke="#2C4A40" stroke-width="1.4"/><rect x="70" y="200" width="12" height="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.8"/></g>
<text x="76" y="278" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">المقاطع</text>
<text x="180" y="166" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">قواعد الرسم الفني</text></svg>`,
   cap:'الأهداف التفصيلية الأربعة للوحدة بترتيب دروسها.<br><b>مرّر المؤشر على أي مرحلة (أو المسها في الجوال) لتعرف الهدف ودروسه.</b>',
   side:[
    {predict:{q:'ما <b>الهدف العام</b> للوحدة الأولى؟',opts:[
     ['حفظ الرموز الكهربائية والإلكترونية',false,'هذا موضوع الوحدة الثانية.'],
     ['رسم لوحات التوزيع المنزلية',false,'هذا موضوع الوحدة الثالثة.'],
     ['الإلمام بقواعد الرسم الفني',true,'الكتاب (ص 8): «الهدف العام للوحدة: الإلمام بقواعد الرسم الفني».']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b> الإلمام بقواعد الرسم الفني</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على أدوات الرسم المختلفة وكيفية استخدامها.</li><li>أن يتقن المتدرب كتابة الأبعاد على المشغولات</li><li>أن يتقن المتدرب رسم مساقط المشغولات</li><li>أن يتقن المتدرب رسم مقاطع الأجسام</li></ol>`,ref:'ص 8'},
    {tip:`<p><b>المشغولة</b> هي القطعة التي تصنع (تشغَّل) في الورشة. هذه الوحدة كلها عن رسم المشغولات: تعرف الأدوات، ثم تكتب الأبعاد، ثم ترسم المساقط، ثم المقاطع. وفي الوحدات التالية تستعمل هذه القواعد نفسها في رسم الرموز والمخططات الكهربائية.</p>`,title:'كلمة تتكرر: «المشغولة»'},
    {title:'مختبر مصغّر: رتّب أهداف الوحدة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الأهداف التفصيلية بترتيبها في الكتاب، وهو ترتيب دروس الوحدة.',steps:[
     ['التعرف على أدوات الرسم وكيفية استخدامها','قبل أي شيء تحتاج الأدوات نفسها: لا ترسم بعداً ولا مسقطاً بلا قلم ومسطرة.'],
     ['كتابة الأبعاد على المشغولات','الأبعاد تأتي بعد الأدوات وقبل المساقط في ترتيب الكتاب (ص 15).'],
     ['رسم مساقط المشغولات','المساقط تبدأ في ص 17 بعد قواعد الأبعاد.'],
     ['رسم مقاطع الأجسام','المقاطع آخر الوحدة (ص 39): تحتاج قبلها المساقط والحواف المختفية.']],done:'هذا ترتيب الأهداف (ص 8) وترتيب دروس الوحدة.'})}
   ]},

  {st:4,short:'المقدمة',title:'١-١ المقدمة',ref:'ص 9',
   q:'رسم جميل لكن ينقصه بعد واحد… هل يستطيع الفني في الورشة أن ينفذه بدقة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رسم فني كامل البيانات ينتقل إلى الورشة فتنفذ القطعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الرسم الفني الكامل: يشمل جميع البيانات والمعلومات اللازمة لإتمام العملية (الشكل والأبعاد والملاحظات)."><rect x="42" y="70" width="140" height="150" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="64" y="104" width="70" height="40" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2.5"/><path d="M64 94h70M64 88v10M134 88v10M146 104v40M140 104h12M140 144h12" stroke="#2C4A40" stroke-width="1.2"/><path d="M64 94l7 -3v6zM134 94l-7 -3v6zM146 104l-3 7h6zM146 144l-3 -7h6z" fill="#2C4A40"/><rect x="58" y="176" width="108" height="30" fill="none" stroke="#2C4A40" stroke-width="1.6"/><path d="M58 191h108M112 176v30" stroke="#2C4A40" stroke-width="1"/></g>
<text x="112" y="244" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">رسم بكل البيانات</text>
<path d="M190 146h40" stroke="#2C4A40" stroke-width="3"/><path d="M240 146l-12 -7v14z" fill="#2C4A40"/>
<g data-tip="التنفيذ في الورشة: إذا كان الرسم كاملاً يمكن تنفيذ العملية بكل دقة، لأنه يعطي صورة صحيحة وسليمة للمطلوب عمله."><path d="M248 120l40 -16l40 16v52l-40 16l-40 -16z" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M248 120l40 16l40 -16M288 136v52" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g>
<text x="288" y="216" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">تنفيذ دقيق</text>
<text x="180" y="286" text-anchor="middle" font-size="13" fill="#2C4A40">الخبرة تأتي بكثرة المران والتركيز</text></svg>`,
   cap:'الرسم الكامل يعطي صورة صحيحة وسليمة للمطلوب عمله.<br><b>مرّر المؤشر على الرسم والقطعة (أو المسهما في الجوال) لتعرف المطلوب من كل منهما.</b>',
   side:[
    {predict:{q:'رسم ينقصه بعد واحد مهم. ماذا يحدث في الورشة؟',opts:[
     ['لا مشكلة، الفني يقدّر البعد الناقص بنفسه',false,'التقدير يغيّر القطعة؛ الكتاب يشترط أن يشمل الرسم «جميع البيانات والمعلومات اللازمة».'],
     ['لا يمكن تنفيذ القطعة بدقة، لأن الرسم لا يعطي صورة كاملة للمطلوب',true,'الكتاب (ص 9): يجب أن يشمل الرسم جميع البيانات «حتى يمكن تنفيذ العملية بكل دقة».'],
     ['ينفذها الفني بدقة كاملة لأن الشكل مرسوم',false,'الشكل وحده لا يكفي؛ الأبعاد والمعلومات جزء من الرسم.']]}}
   ],
   body:[
    {book:`<p>الغرض من الرسم الفني هو التعامل بين العاملين في المجال الهندسي والفني وله أسس وقواعد ثابتة، ويجب أن تتوافر الخبرة اللازمة وذلك بكثرة المران والتركيز. كما يجب أن يشمل جميع البيانات والمعلومات اللازمة لإتمام أي عملية حتى يمكن تنفيذ العملية بكل دقة، لتعطي صورة صحيحة وسليمة للمطلوب عمله. إن الهدف الأساسي من هذا الباب هو التعرف على أدوات الرسم المختلفة وكيفية استخدامها الاستخدام الصحيح.</p>`,ref:'ص 9'},
    {tip:`<p>ثلاث كلمات في هذه الفقرة: <b>قواعد ثابتة</b> (لا يرسم كل شخص على هواه)، و<b>جميع البيانات</b> (لا ينقص الرسم شيء يحتاجه المنفذ)، و<b>المران</b> (المهارة تأتي بالتكرار، لذلك ارسم بيدك كل مثال في هذه الوحدة).</p>`,title:'اقرأها هكذا'},
    {title:'تحقق سريع: المقدمة',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['للرسم الفني أسس وقواعد ثابتة.',true,'الكتاب (ص 9): «وله أسس وقواعد ثابتة».'],
     ['الخبرة في الرسم الفني تأتي بالموهبة وحدها دون تدريب.',false,'الكتاب: «يجب أن تتوافر الخبرة اللازمة وذلك بكثرة المران والتركيز».'],
     ['الهدف الأساسي من هذا الباب التعرف على أدوات الرسم وكيفية استخدامها الصحيح.',true,'آخر جملة في المقدمة (ص 9).']]})}
   ]},

  {st:5,short:'أقسام الرسم',title:'١-٢ أقسام الرسم الفني',ref:'ص 9',
   q:'المكاتب الهندسية اليوم مليئة بالحواسيب… فلماذا ما زلنا نتعلم الرسم باليد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قسما الرسم الفني: بالحاسب، ويدوي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><line x1="180" y1="40" x2="180" y2="280" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 5"/>
<g data-tip="أولاً — الرسم الفني باستخدام الحاسب: الكمبيوتر وملحقاته من برامج رسم وتصميم (مثل برامج الكاد ⟦CAD⟧) وأجهزة مساعدة."><rect x="196" y="92" width="120" height="84" rx="6" fill="#2C4A40"/><rect x="204" y="100" width="104" height="66" fill="#E9F0E8"/><rect x="214" y="110" width="34" height="24" fill="none" stroke="#1F4E7A" stroke-width="2"/><rect x="254" y="110" width="18" height="24" fill="none" stroke="#1F4E7A" stroke-width="2"/><rect x="214" y="140" width="34" height="16" fill="none" stroke="#1F4E7A" stroke-width="2"/><path d="M246 176h20l6 18h-32z" fill="#2C4A40"/><rect x="214" y="196" width="84" height="12" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g>
<text x="256" y="236" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">بالحاسب</text>
<g data-tip="ثانياً — الرسم الفني اليدوي: بأدوات مثل لوحة الرسم والمسطرة حرف ⟦T⟧ والمثلثات والفرجار وقلم الرصاص."><rect x="42" y="96" width="120" height="96" rx="4" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2.5"/><rect x="62" y="106" width="92" height="76" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.2"/><rect x="36" y="140" width="10" height="34" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="46" y="150" width="114" height="8" fill="#BFD7EA" stroke="#2C4A40" stroke-width="1.6"/><path d="M90 150l26 -30v30z" fill="#F2C14E" fill-opacity=".8" stroke="#2C4A40" stroke-width="1.6"/></g>
<text x="102" y="236" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">يدوي</text></svg>`,
   cap:'الرسم الفني قسمان.<br><b>مرّر المؤشر على كل قسم (أو المسه في الجوال) لتعرف أدواته.</b>',
   side:[
    {predict:{q:'كم قسماً للرسم الفني بحسب الكتاب؟',opts:[
     ['ثلاثة: يدوي وحاسب وتصوير',false,'الكتاب لا يذكر التصوير قسماً.'],
     ['قسمان: الرسم باستخدام الحاسب، والرسم اليدوي',true,'الكتاب (ص 9): «يقسم الرسم الفني إلى قسمين».'],
     ['قسم واحد، فالحاسب أداة فقط',false,'صحيح أن الحاسب أداة، لكن الكتاب يعدّه قسماً مستقلاً من أقسام الرسم.']]}}
   ],
   body:[
    {book:`<p><b>يقسم الرسم الفني إلى قسمين:</b></p><p>أولاً: الرسم الفني باستخدام الحاسب.<br>ثانياً: الرسم الفني اليدوي.</p>`,ref:'ص 9'},
    {tip:`<p>القواعد واحدة في القسمين: الخطوط والأبعاد والمساقط نفسها. الحاسب يسرّع الرسم والتعديل، أما فهم القواعد فلا يأتي إلا بالرسم اليدوي والمران، ثم تنقله إلى الحاسب.</p>`,title:'ما الفرق الحقيقي؟'},
    {title:'مختبر مصغّر: إلى أي قسم تنتمي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر القسم المناسب لكل أداة كما يذكرها الكتاب.',cats:['الرسم بالحاسب','الرسم اليدوي'],items:[
     ['برامج الكاد <span class="ltr">CAD</span>',0,'الكتاب: «برامج الكاد CAD من أهم برامج الرسم والتصميم» (ص 9).'],
     ['لوحة خشبية ومسطرة حرف <span class="ltr">(T)</span>',1,'من أدوات الرسم اليدوي لرسم الخط المستقيم (ص 10).'],
     ['أجهزة مساعدة وبرامج رسم وتصميم',0,'«الكمبيوتر وملحقاته من برامج رسم وتصميم وأجهزة مساعدة» (ص 9).'],
     ['الفرجار وقلم الرصاص والممحاة',1,'أدوات الرسم اليدوي (ص 10).']]})}
   ]},

  {st:6,short:'الرسم بالحاسب',title:'أولاً: الرسم باستخدام الكمبيوتر',ref:'ص 9',
   q:'برنامج رسم سريع ودقيق… هل يستطيع أن يصمم القطعة وحده؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المصمم يصدر الأوامر للحاسب وبرنامج الكاد يرسم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الكمبيوتر وبرامج الكاد ⟦CAD⟧: أداة للرسم تتميز بالسرعة والسهولة والدقة في تحضير الرسومات الهندسية أو تعديلها. الكمبيوتر لا يفكر ولا يتخذ أي قرارات."><rect x="150" y="70" width="170" height="122" rx="8" fill="#2C4A40"/><rect x="160" y="80" width="150" height="100" fill="#E9F0E8"/><rect x="174" y="94" width="52" height="38" fill="none" stroke="#1F4E7A" stroke-width="2.2"/><rect x="236" y="94" width="24" height="38" fill="none" stroke="#1F4E7A" stroke-width="2.2"/><rect x="174" y="140" width="52" height="26" fill="none" stroke="#1F4E7A" stroke-width="2.2"/><path d="M268 150l26 -26M286 124h8v8" fill="none" stroke="#E8735A" stroke-width="2.4"/><path d="M222 192h26l8 22h-42z" fill="#2C4A40"/><text x="285" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">CAD</text></g>
<g data-tip="المصمم والرسام: الرسم والتصميم يعتمدان على خبراتهم وما يصدرونه من أوامر للحاسب."><circle cx="78" cy="140" r="16" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M50 226V184a28 24 0 0 1 56 0V226Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="92" y="196" width="40" height="14" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="الأوامر: الكمبيوتر ينفذ ما يصدره المصمم من أوامر فقط."><path d="M104 120q30 -36 64 -24" fill="none" stroke="#2C4A40" stroke-width="2.5"/><path d="M170 96l-13 -3l7 11z" fill="#2C4A40"/><rect x="68" y="84" width="58" height="26" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="97" y="102" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">أمر</text></g>
<text x="180" y="262" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">المصمم يقرر، والحاسب ينفذ</text></svg>`,
   cap:'الحاسب أداة رسم بيد المصمم.<br><b>مرّر المؤشر على المصمم والأمر والحاسب (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'من يتخذ القرارات عند الرسم والتصميم بالكمبيوتر؟',opts:[
     ['الكمبيوتر، لأنه أدق من الإنسان',false,'الكتاب (ص 9): الكمبيوتر «لا يفكر أو يتخذ أي قرارات».'],
     ['برنامج الكاد وحده يختار التصميم المناسب',false,'البرنامج أداة سريعة ودقيقة، لكنه ينفذ الأوامر فقط.'],
     ['المصممون والرسامون بخبراتهم وما يصدرونه من أوامر',true,'الكتاب: يستعمل الكمبيوتر «لتسهيل عمليات الرسم والتصميم التي تعتمد على خبرات المصممين والرسامين وما يصدرونه من أوامر».']]}}
   ],
   body:[
    {book:`<p>الكمبيوتر وملحقاته من برامج رسم وتصميم وأجهزة مساعدة، تعد من أهم أدوات الرسم في الوقت الحاضر، وهي شائعة الاستعمال. وبرامج الكاد <span class="ltr">CAD</span> من أهم برامج الرسم والتصميم، وهي تتميز بالسرعة والسهولة والدقة في تحضير الرسومات الهندسية أو تعديلها باستعمال الكمبيوتر لتوفير الوقت أكثر من التحضير اليدوي. والكمبيوتر ما هو إلا أداة للرسم، فهو لا يفكر أو يتخذ أي قرارات، ويستعمل لتسهيل عمليات الرسم والتصميم التي تعتمد على خبرات المصممين والرسامين وما يصدرونه من أوامر.</p>`,ref:'ص 9'},
    {add:`<p>كلمة <span class="ltr">CAD</span> اختصار للعبارة الإنجليزية <span class="ltr">Computer-Aided Design</span> أي «التصميم بمساعدة الحاسب». ومن أشهر برامجه في المكاتب الهندسية برنامج <span class="ltr">AutoCAD</span>، وفي الرسم الكهربائي برامج خاصة فيها مكتبات للرموز الكهربائية جاهزة. لكن الرسام يبقى مسؤولاً عن صحة كل خط وبعد، تماماً كما في الرسم اليدوي.</p>`,title:'من الواقع'},
    {title:'تحقق سريع: الرسم بالحاسب',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['تتميز برامج الكاد بالسرعة والسهولة والدقة في تحضير الرسومات أو تعديلها.',true,'نص الكتاب (ص 9).'],
     ['الكمبيوتر يفكر ويختار الحل المناسب للتصميم.',false,'«الكمبيوتر ما هو إلا أداة للرسم، فهو لا يفكر أو يتخذ أي قرارات».'],
     ['الرسم بالحاسب يوفر الوقت أكثر من التحضير اليدوي.',true,'الكتاب: «لتوفير الوقت أكثر من التحضير اليدوي».']]})}
   ]},

  {st:7,short:'أدوات الرسم اليدوي',title:'ثانياً: الرسم الفني اليدوي — الأدوات المستخدمة في الرسم',ref:'ص 10',
   q:'قلم وممحاة يكفيان لرسم حر… فماذا تحتاج إذا أردت رسماً يتفق مع الأسس الهندسية؟',
   get art(){const T=TOOLS;let b='';T.forEach((t,i)=>{const c=i%4,r=Math.floor(i/4),x=36+c*74,y=64+r*66;const p=DWS.put(t.s,x,y,66,46);
     b+=`<rect x="${x-2}" y="${y-4}" width="70" height="60" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.4"/>`+p.g+DWS.txt(x+33,y+53,String(i+1),{fs:10,b:1})+DWS.tip(x-2,y-4,70,60,`${i+1}- ${t.n} ⟦${t.en}⟧`)});
     return DWS.art('أدوات الرسم اليدوي الاثنتا عشرة',b+DWS.txt(180,290,'اثنتا عشرة أداة يعددها الكتاب',{fs:13,b:1}),'#FBE6C4')},
   cap:'أدوات الرسم اليدوي بترتيب الكتاب (رسوم مبسطة بدل صور الكتاب).<br><b>مرّر المؤشر على أي أداة (أو المسها في الجوال) لتعرف اسمها.</b>',
   side:[
    {predict:{q:'تريد رسم دائرة. أي أداة يذكرها الكتاب لذلك؟',opts:[
     ['المسطرة حرف <span class="ltr">(T)</span>',false,'المسطرة حرف (T) لرسم الخط المستقيم (ص 10).'],
     ['الفرجار',true,'الكتاب (ص 10): «وإذا أردنا رسم دائرة نحتاج إلى فرجار».'],
     ['الممحاة',false,'الممحاة مع القلم لتسجيل المعلومات أو الرسم الحر وتصحيحه.']]}}
   ],
   body:[
    {book:`<p><b>الأدوات المستخدمة في الرسم:</b></p><p>لتسجيل أي معلومات أو إعداد رسم يدوي حر، نحتاج إلى أدوات رسم مثل قلم الرصاص والممحاة، وإذا أردنا رسم دائرة نحتاج إلى فرجار، ولرسم خط مستقيم نحتاج إلى لوحة خشبية ومسطرة حرف (<span class="ltr">T</span>) مستقيمة برأس عمودية. وأما إذا أردنا إعداد رسومات تتفق مع الأسس الهندسية، فالأمر يحتاج إلى أدوات رسم أخرى متعددة لتوفير كثير من الجهد والوقت ولضمان رفع جودة العمل.</p><p>وفيما يلي أدوات الرسم وكيفية استعمالها:</p>`,ref:'ص 10'},
    {tip:`<p>الأدوات الاثنتا عشرة في المحطات التالية، لكل أداة محطة: كيف تصنع، ولماذا نستعملها، وكيف نستعملها صحيحاً. في تبويب «المختبر» لعبة «أي أداة أستعمل؟» على الأدوات كلها.</p>`,title:'كيف تكمل'},
    {title:'مختبر مصغّر: ماذا تحتاج؟',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقف من فقرة الكتاب. اختر ما يذكره الكتاب لكل موقف.',cases:[
     {q:'تريد تسجيل معلومة أو رسماً يدوياً حراً سريعاً.',opts:[['قلم الرصاص والممحاة',true,'الكتاب: «نحتاج إلى أدوات رسم مثل قلم الرصاص والممحاة».'],['الفرجار والمثلثات',false,'لا تحتاجها للرسم الحر.'],['برنامج الكاد',false,'الفقرة عن الرسم اليدوي.']]},
     {q:'تريد رسم خط مستقيم.',opts:[['الفرجار',false,'الفرجار للدوائر والأقواس.'],['لوحة خشبية ومسطرة حرف (T) برأس عمودية',true,'كما في نص الكتاب (ص 10).'],['الممحاة',false,'الممحاة للتصحيح لا للرسم.']]},
     {q:'تريد رسماً يتفق مع الأسس الهندسية بجودة عالية.',opts:[['قلم الرصاص وحده يكفي',false,'الكتاب: «فالأمر يحتاج إلى أدوات رسم أخرى متعددة».'],['أدوات رسم أخرى متعددة توفر الجهد والوقت وترفع جودة العمل',true,'نص الكتاب، وهي الأدوات الاثنتا عشرة التالية.']]}]})}
   ]},

  {st:8,short:'لوحات الرسم',title:'١- لوحات الرسم',ref:'ص 10',
   q:'لوحة خشبية عادية… فلماذا يشترط الكتاب أن تكون حوافها مستقيمة وقاسية جداً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة رسم عليها ورقة مثبتة بشريط لاصق، والمسطرة حرف T على حافتها اليسرى" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="لوحة الرسم: تصنع من خشب الصنوبر الأبيض، ذات سطح قاسٍ ومستوٍ."><rect x="52" y="62" width="268" height="196" rx="6" fill="#E6C99A" stroke="#2C4A40" stroke-width="3"/><path d="M70 90q60 -8 120 0t120 0M70 230q60 -8 120 0t120 0" fill="none" stroke="#C9A46E" stroke-width="2"/></g>
<g data-tip="ورق الرسم: يثبت على اللوحة بشريط لاصق أو مشابك معدنية خاصة."><rect x="104" y="88" width="190" height="144" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><g fill="#F2C14E" stroke="#2C4A40" stroke-width="1.2"><rect x="96" y="82" width="20" height="10" transform="rotate(-35 106 87)"/><rect x="282" y="82" width="20" height="10" transform="rotate(35 292 87)"/><rect x="96" y="228" width="20" height="10" transform="rotate(35 106 233)"/><rect x="282" y="228" width="20" height="10" transform="rotate(-35 292 233)"/></g></g>
<g data-tip="حافة اللوحة: مستقيمة وقاسية من خشب شديد الصلابة أو من الصلب، لتكون دليلاً للمسطرة حرف ⟦T⟧ أثناء الرسم."><rect x="44" y="62" width="10" height="196" fill="#8B5E34" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="المسطرة حرف ⟦T⟧: رأسها ينزلق على حافة اللوحة فيبقى ساقها في الاتجاه نفسه."><rect x="30" y="134" width="16" height="56" rx="2" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="46" y="156" width="260" height="12" fill="#BFD7EA" fill-opacity=".9" stroke="#2C4A40" stroke-width="2"/></g>
<text x="180" y="288" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">لوحة الرسم وحافتها الدليل</text></svg>`,
   cap:'لوحة الرسم وعليها الورق والمسطرة حرف <span class="ltr">T</span>.<br><b>مرّر المؤشر على اللوحة والورق والحافة والمسطرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا تصنع حواف لوحة الرسم مستقيمة وقاسية؟',opts:[
     ['لتكون دليلاً للمسطرة حرف (T) أثناء الرسم',true,'الكتاب (ص 10): «لاستخدامها كدليل للمسطرة حرف (T) أثناء عملية الرسم».'],
     ['لتمنع الورق من الانزلاق',false,'الورق يثبت بالشريط اللاصق أو المشابك، لا بالحافة.'],
     ['لتجميل شكل اللوحة',false,'الحافة لها وظيفة: إذا اعوجت انحرفت الخطوط المرسومة بالمسطرة.']]}}
   ],
   body:[
    {book:`<p>تصنع لوحات الرسم من خشب الصنوبر الأبيض، ويراعى في تصنيع هذه اللوحات أن تكون ذات سطح قاسٍ ومستوٍ، يثبت ورق الرسم عليها بشريط لاصق أو مشابك معدنية خاصة، كما تصنع حواف هذه اللوحات مستقيمة وقاسية من خشب شديد الصلابة أو من الصلب لاستخدامها كدليل للمسطرة حرف (<span class="ltr">T</span>) أثناء عملية الرسم.</p>`,ref:'ص 10'},
    {tip:`<p>رأس المسطرة حرف <span class="ltr">T</span> ينزلق على حافة اللوحة. إذا كانت الحافة مستقيمة تماماً بقيت المسطرة في الاتجاه نفسه في كل موضع، فتخرج الخطوط متوازية. وإذا كان في الحافة انبعاج صغير مالت المسطرة عنده وفسدت الخطوط.</p>`,title:'لماذا الحافة مهمة؟'},
    {title:'تحقق سريع: لوحة الرسم',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['تصنع لوحات الرسم من خشب الصنوبر الأبيض.',true,'نص الكتاب (ص 10).'],
     ['يجوز أن يكون سطح اللوحة ليناً حتى يسهل الرسم.',false,'الكتاب: «أن تكون ذات سطح قاسٍ ومستوٍ».'],
     ['قد تصنع حواف اللوحة من الصلب.',true,'«من خشب شديد الصلابة أو من الصلب».']]})}
   ]},

  {st:9,short:'المسطرة حرف T',title:'٢- المسطرة حرف (T)',ref:'ص 10',
   q:'كيف ترسم عشرين خطاً أفقياً متوازياً تماماً دون أن تقيس المسافة عند كل طرف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المسطرة حرف T على لوحة الرسم ومثلث ينزلق عليها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<rect x="58" y="58" width="262" height="206" rx="6" fill="#E6C99A" stroke="#2C4A40" stroke-width="2.5"/><rect x="86" y="74" width="220" height="176" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.2"/>
<g data-tip="خطوط أفقية متوازية: ترسم على حافة المسطرة في مواضع مختلفة، وتبقى متوازية لأن الرأس ينزلق على حافة اللوحة المستقيمة."><path d="M96 96H296M96 116H296M96 136H296M96 156H296" stroke="#2C4A40" stroke-width="2"/></g>
<g data-tip="الرأس: خشبية ثابتة ومتعامدة على حافة المسطرة، في طرفها الأيسر، تنزلق على حافة لوحة الرسم."><rect x="38" y="160" width="20" height="64" rx="2" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g>
<g data-tip="الساق: مصنوعة من الخشب، وعلى كل جانب منها حافة شفافة من البلاستيك تسمح للرسام أن يرى الخطوط عند رسمها."><rect x="58" y="184" width="256" height="16" fill="#C9A46E" stroke="#2C4A40" stroke-width="2"/><rect x="58" y="180" width="256" height="5" fill="#BFD7EA" stroke="#2C4A40" stroke-width="1"/><rect x="58" y="199" width="256" height="5" fill="#BFD7EA" stroke="#2C4A40" stroke-width="1"/></g>
<g data-tip="المثلث: يستعمل المسطرة حرف ⟦T⟧ دليلاً ينزلق عليه، فيرسم خطوطاً رأسية ومائلة."><path d="M210 180V110L250 180Z" fill="#4FB3A9" fill-opacity=".75" stroke="#2C4A40" stroke-width="2"/><path d="M210 176V100" stroke="#1F4E7A" stroke-width="2.4"/></g>
<text x="190" y="290" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">رأس ثابتة + ساق بحافتين شفافتين</text></svg>`,
   cap:'المسطرة حرف <span class="ltr">T</span> ترسم الخطوط الأفقية المتوازية، والمثلث ينزلق عليها.<br><b>مرّر المؤشر على الرأس والساق والمثلث والخطوط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تحرك المسطرة حرف (T) إلى أسفل وترسم خطاً على حافتها عند كل موضع. كيف تكون الخطوط؟',opts:[
     ['مائلة بزوايا مختلفة',false,'المسطرة ذات الرأس الثابت لا تميل؛ الخطوط المائلة المتوازية لها مساطر برؤوس متحركة.'],
     ['أفقية متوازية',true,'الكتاب (ص 10): تستعمل «في رسم الخطوط الأفقية المتوازية».'],
     ['رأسية',false,'الخطوط الرأسية ترسم بالمثلث المنزلق على المسطرة.']]}}
   ],
   body:[
    {book:`<p>المسطرة حرف (<span class="ltr">T</span>) الشائعة الاستعمال ذات ساق مصنوعة من الخشب، مثبت على كل جانب منه حافة شفافة مصنوعة من البلاستيك، تسمح للرسام أن يرى الخطوط عند رسمها، ومثبت في طرفها الأيسر رأس خشبية ثابتة ومتعامدة على حافة المسطرة، وتستعمل في رسم الخطوط الأفقية المتوازية، كما تستعمل كدليل تنزلق عليه المثلثات. كما توجد مساطر ذات رؤوس متحركة يمكن ضبطها وتستعمل في رسم الخطوط المائلة المتوازية.</p>`,ref:'ص 10'},
    {watch:`<p>من النصائح العامة في آخر الوحدة (ص 45): لا ترسم الخطوط الرأسية مستعملاً الحافة السفلية للمسطرة حرف <span class="ltr">T</span>، ولا تستعمل حافتها كسكين لقطع الورق.</p>`},
    {title:'مختبر مصغّر: حرّك المسطرة وارسم',widget:(el,B)=>{DWS.ensureCss(B);el.classList.add('ml');let y=60;const H=[],V=[];
     el.innerHTML=`<p class="ml-in">حرّك المسطرة على حافة اللوحة، واضغط «ارسم خطاً أفقياً» في عدة مواضع. ثم ضع المثلث وارسم خطوطاً رأسية.</p><label class="ml-sl"><span class="ml-h"><span>موضع المسطرة على حافة اللوحة</span><b data-v></b></span><input type="range" min="40" max="176" step="2" value="${y}" aria-label="موضع المسطرة"></label><div class="ml-row"><button type="button" class="ml-b" data-h>ارسم خطاً أفقياً</button><button type="button" class="ml-b" data-vv>ضع المثلث وارسم خطاً رأسياً</button><button type="button" class="ml-b" data-rs>امسح الورقة</button></div><div class="dw-sheet" data-s></div><div class="ml-fb" data-m></div>`;
     const q=s=>el.querySelector(s);
     const draw=()=>{let s=`<svg viewBox="0 0 340 220" class="dwv" role="img" aria-label="لوحة الرسم والمسطرة حرف T"><rect x="24" y="8" width="306" height="204" rx="6" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/><rect x="60" y="22" width="250" height="176" style="fill:var(--surface);stroke:var(--line)"/><rect x="20" y="8" width="6" height="204" style="fill:var(--fg)"/>`;
      H.forEach(v=>s+=`<line x1="66" y1="${v}" x2="304" y2="${v}" class="vl"/>`);V.forEach(([x,v])=>s+=`<line x1="${x}" y1="${v}" x2="${x}" y2="${Math.max(26,v-70)}" class="vl" style="stroke:var(--blue)"/>`);
      const tx0=90+V.length*34;s+=`<rect x="6" y="${y-30}" width="14" height="72" rx="2" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.6"/><rect x="20" y="${y}" width="300" height="12" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.6;fill-opacity:.9"/>`;
      s+=`<path d="M${tx0} ${y}V${y-62}L${tx0+34} ${y}Z" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.4;fill-opacity:.85"/>`;
      q('[data-s]').innerHTML=s+'</svg>';q('[data-v]').textContent=String(y);
      const m=q('[data-m]');m.innerHTML=!H.length?'الرأس (البرتقالي) ملاصق لحافة اللوحة. اضغط «ارسم خطاً أفقياً».':H.length<3?`رسمت ${DWS.lt(H.length)} خطاً أفقياً. حرّك المسطرة وارسم غيره.`:`<b>كل الخطوط الأفقية متوازية</b> دون قياس: الرأس ينزلق على حافة مستقيمة فلا تميل الساق. ${V.length?'والخطوط الرأسية من المثلث المنزلق على المسطرة متعامدة عليها.':'جرّب الآن المثلث.'}`};
     q('input').oninput=e=>{y=+e.target.value;draw()};
     q('[data-h]').onclick=()=>{if(!H.includes(y))H.push(y);draw()};
     q('[data-vv]').onclick=()=>{if(V.length<6)V.push([90+V.length*34,y]);draw()};
     q('[data-rs]').onclick=()=>{H.length=0;V.length=0;draw()};draw()}}
   ]},

  {st:10,short:'أقلام الرصاص',title:'٣- أقلام الرصاص',ref:'ص 10',
   q:'ثمانية عشر نوعاً من أقلام الرصاص… لماذا لا يكفي قلم واحد للرسم كله؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أقلام رصاص 2H و HB و 2B وخط كل منها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="القلم ⟦2H⟧: خفيف الظل وسهل المسح لا يترك أثراً بعد مسحه، للخطوط الإنشائية العامة."><path d="M60 92h170l24 12l-24 12h-170z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M230 92l24 12l-24 12z" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2"/><text x="140" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">2H</text><path d="M268 104h40" stroke="#2C4A40" stroke-width="2" opacity=".35"/></g>
<g data-tip="القلم ⟦HB⟧: معتدل الظل، لتشطيب الرسم والكتابة."><path d="M60 152h170l24 12l-24 12h-170z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M230 152l24 12l-24 12z" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2"/><text x="140" y="170" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">HB</text><path d="M268 164h40" stroke="#2C4A40" stroke-width="2.6" opacity=".7"/></g>
<g data-tip="القلم ⟦2B⟧: غامق ثقيل الظل، لتثبيت الرسم النهائي، ويترك أثراً بعد المسح على ورقة الرسم."><path d="M60 212h170l24 12l-24 12h-170z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M230 212l24 12l-24 12z" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2"/><text x="140" y="230" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">2B</text><path d="M268 224h40" stroke="#2C4A40" stroke-width="3.4"/></g>
<text x="180" y="276" text-anchor="middle" font-size="13" fill="#2C4A40">من الخفيف إلى الغامق</text></svg>`,
   cap:'الأقلام الثلاثة التي يذكرها الكتاب وخط كل منها.<br><b>مرّر المؤشر على أي قلم (أو المسه في الجوال) لتعرف ظله واستعماله.</b>',
   side:[
    {predict:{q:'بأي قلم ترسم الخطوط الإنشائية العامة في بداية الرسم؟',opts:[
     ['<span class="ltr">2B</span>',false,'2B غامق يترك أثراً بعد المسح، فهو للرسم النهائي.'],
     ['<span class="ltr">HB</span>',false,'HB معتدل الظل لتشطيب الرسم والكتابة.'],
     ['<span class="ltr">2H</span>',true,'الكتاب (ص 10): 2H «للخطوط الإنشائية العامة وهو خفيف الظل وسهل المسح».']]}}
   ],
   body:[
    {book:`<p>أقلام الرصاص من أدوات الرسم المهمة، وتختلف عن أقلام الكتابة، وهي ذات درجات صلابة مختلفة تتناسب مع أعمال الرسم المختلفة. ويوجد منها ثمانية عشر نوعاً، فمثلاً إذا أردنا أن ننجز رسماً فنحن نحتاج إلى قلم <span class="ltr">2H</span> للخطوط الإنشائية العامة وهو خفيف الظل وسهل المسح بحيث لا يترك أثراً بعد مسحه، ونحتاج إلى قلم <span class="ltr">HB</span> لتشطيب الرسم والكتابة وهو معتدل الظل. وكذلك <span class="ltr">2B</span> وهو غامق ثقيل الظل يستخدم لتثبيت الرسم النهائي ويترك أثراً بعد المسح على ورقة الرسم.</p>`,ref:'ص 10'},
    {tip:`<p>الحرف <span class="ltr">H</span> يدل على القلم <b>الصلب</b> (خطه خفيف)، والحرف <span class="ltr">B</span> على القلم <b>اللين</b> (خطه غامق)، و<span class="ltr">HB</span> بينهما. كلما زاد الرقم أمام <span class="ltr">H</span> زادت الصلابة، وكلما زاد أمام <span class="ltr">B</span> زاد الغمق.</p>`,title:'إضافة صغيرة: معنى الحروف'},
    {title:'مختبر مصغّر: أي قلم؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر القلم المناسب لكل عمل أو وصف، بحسب الكتاب.',cats:['<span class="ltr">2H</span>','<span class="ltr">HB</span>','<span class="ltr">2B</span>'],items:[
     ['الخطوط الإنشائية العامة',0,'2H خفيف الظل سهل المسح (ص 10).'],
     ['تشطيب الرسم والكتابة',1,'HB معتدل الظل (ص 10).'],
     ['تثبيت الرسم النهائي',2,'2B غامق ثقيل الظل (ص 10).'],
     ['قلم يترك أثراً بعد المسح على ورقة الرسم',2,'هذا وصف الكتاب للقلم 2B، فلا تبدأ به الرسم.'],
     ['قلم لا يترك أثراً بعد مسحه',0,'وصف القلم 2H.']]})}
   ]},

  {st:11,short:'ورق الرسم',title:'٤- ورق الرسم',ref:'ص 11',
   q:'تسمع «ورقة A3» و«ورقة A4» كل يوم… فما الفرق بينهما بالمليمتر؟',
   get art(){const x0=40,y0=66,W=280,H=198;const R=[['A0',0,0,W,H,'1189 × 841 mm'],['A1',0,0,W/2,H,'841 × 594 mm'],['A2',0,0,W/2,H/2,'594 × 420 mm'],['A3',0,0,W/4,H/2,'420 × 297 mm'],['A4',0,0,W/4,H/4,'297 × 210 mm']];
     const F=['#FBF6EE','#F7E7C8','#E9F0E8','#D3E4F1','#F2C14E'];let g='',t='';
     R.forEach(([n,X,Y,w,h,sz],i)=>{g+=`<rect x="${x0+X}" y="${y0+Y}" width="${w}" height="${h}" fill="${F[i]}" stroke="#2C4A40" stroke-width="${i?2:3}"/>`;t+=DWS.tip(x0+X,y0+Y,w,h,`الورقة ⟦${n}⟧: ⟦${sz}⟧`)});
     const L=[['A0',x0+W*0.75,y0+H*0.5],['A1',x0+W*0.25,y0+H*0.75],['A2',x0+W*0.375,y0+H*0.25],['A3',x0+W*0.125,y0+H*0.375],['A4',x0+W*0.125,y0+H*0.125]];
     L.forEach(([n,x,y])=>g+=DWS.txt(x,y+5,n,{fs:15,b:1}));
     return DWS.art('مقاسات ورق الرسم A0 إلى A4',g+t+DWS.txt(180,292,'كل مقاس نصف الذي قبله',{fs:13,b:1}),'#FBE6C4')},
   cap:'مقاسات ورق الرسم من جدول الكتاب، مرسومة بنسبها الحقيقية.<br><b>مرّر المؤشر على أي مقاس (أو المسه في الجوال) لتعرف أبعاده.</b>',
   side:[
    {predict:{q:'أي الورقتين أكبر: <span class="ltr">A3</span> أم <span class="ltr">A4</span>؟',opts:[
     ['<span class="ltr">A4</span>، لأن رقمها أكبر',false,'العكس: كلما كبر الرقم صغرت الورقة؛ A4 هي <span class="ltr">297 × 210 mm</span>.'],
     ['<span class="ltr">A3</span>',true,'من جدول الكتاب: A3 = <span class="ltr">420 × 297 mm</span>، وA4 = <span class="ltr">297 × 210 mm</span>.'],
     ['متساويتان، والفرق في السماكة',false,'الفرق في المقاس كما في الجدول (ص 11).']]}}
   ],
   body:[
    {book:`<p>ورق الرسم من الورق المقوى، سطحه خشن قليلاً، متعدد الألوان والمقاسات، ويمكن للرسام أن يختار النوع المناسب للرسم من حيث المقاس أو اللون.</p><p>وهذه مقاسات ورق الرسم الشائع الاستعمال:</p>
     <div class="tablebox" style="max-width:360px;margin-inline:auto"><table class="tt"><thead><tr><th>المقاس</th><th>الرمز</th></tr></thead><tbody><tr><td><span class="ltr">297 × 210 mm</span></td><td><span class="ltr">A4</span></td></tr><tr><td><span class="ltr">420 × 297 mm</span></td><td><span class="ltr">A3</span></td></tr><tr><td><span class="ltr">594 × 420 mm</span></td><td><span class="ltr">A2</span></td></tr><tr><td><span class="ltr">841 × 594 mm</span></td><td><span class="ltr">A1</span></td></tr><tr><td><span class="ltr">1189 × 841 mm</span></td><td><span class="ltr">A0</span></td></tr></tbody></table></div>
     <p>ويوجد نوع آخر من الورق خفيف نصف شفاف داكن اللون مائل للزرقة يسمى ورق (الكلك) يستعمل في شف الرسومات باستعمال قلم الرصاص أو الحبر ويتم طبعها على ورق حساس بواسطة ماكينة خاصة لذلك.</p>`,ref:'ص 11'},
    {tip:`<p>انظر إلى الجدول: الطول الكبير لكل مقاس هو الطول الصغير للمقاس الذي قبله (مثلاً <span class="ltr">420</span> في <span class="ltr">A3</span> هي العرض في <span class="ltr">A2</span>). فكل ورقة نصف التي قبلها: ورقتا <span class="ltr">A4</span> تساويان ورقة <span class="ltr">A3</span>. (ملاحظة منا من أرقام الجدول، وليست من نص الكتاب.)</p>`,title:'سرّ الجدول'},
    {title:'مختبر مصغّر: قارن المقاسات',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مقاساً وشاهد مكانه داخل الورقة <span class="ltr">A0</span>.',
     predict:{q:'كم ورقة <span class="ltr">A4</span> تتسع في ورقة <span class="ltr">A3</span> واحدة؟',opts:[['ورقة واحدة ونصف',false,'العرض في A3 (297) يساوي الطول في A4، فتتسع ورقتان كاملتان.'],['ورقتان',true,'<span class="ltr">420 × 297</span> = ورقتان من <span class="ltr">297 × 210</span> بجانب بعضهما (210 + 210 = 420).'],['أربع أوراق',false,'أربع أوراق A4 تساوي ورقة A2.']]},
     ins:[{k:'p',l:'المقاس',seg:PAPER.map(x=>[x[0],x[0]]),v:'A3'}],
     calc:s=>{const p=PAPER.find(x=>x[0]===s.p),i=PAPER.indexOf(p);return {pic:`<div class="dw-sheet">${paperSVG(s.p)}</div>`,
      facts:[['الرمز',p[0]],['المقاس',p[1]+' × '+p[2]+' mm','hi']],
      msg:i===0?'<span class="ltr">A0</span> أكبر مقاس في الجدول.':`ورقة <span class="ltr">${p[0]}</span> نصف ورقة <span class="ltr">${PAPER[i-1][0]}</span>: الطول <span class="ltr">${p[1]}</span> هو عرض <span class="ltr">${PAPER[i-1][0]}</span>.`}}})}
   ]},

  {st:12,short:'أقلام التحبير',title:'٥- أقلام التحبير',ref:'ص 11–12',
   q:'قلم تحبير غالٍ تركته يوماً بالحبر داخله… لماذا قد لا يكتب مرة أخرى؟',
   get art(){const sv=DWS.fig(B,'u1-l1','ص 11–12')[0];const p=DWS.put(sv,24,84,312,116);
     const t=DWS.tipR(p.M,[14,18],[164,68],'أقلام التحبير: ذات سماكات مختلفة من ⟦0.1 mm⟧ إلى ⟦1 mm⟧، تعبأ بحبر خاص للرسم، وتستعمل غالباً على ورق الكلك.',2)+DWS.tipR(p.M,[194,4],[276,96],'علبة التنظيف: يوضع فيها القلم بعد تفريغه من الحبر، ضمن مادة كيميائية خاصة حتى لا يجف الحبر داخله.',2);
     return DWS.art('أقلام التحبير وعلبة تنظيفها',p.g+t+DWS.txt(180,250,'بعد الاستعمال:',{fs:13,b:1})+DWS.txt(180,272,'فرّغ الحبر ثم ضع القلم في علبة التنظيف',{fs:13}))},
   cap:'أقلام التحبير وعلبة تنظيفها (رسم مبسط بدل صورتي الكتاب).<br><b>مرّر المؤشر على الأقلام والعلبة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'انتهيت من الرسم بقلم التحبير. ماذا تفعل به؟',opts:[
     ['تغلقه بغطائه والحبر داخله حتى المرة القادمة',false,'الحبر يجف داخل القلم فيتلف؛ الكتاب يطلب تفريغه.'],
     ['تفرغه من الحبر وتضعه في وعاء التنظيف الخاص',true,'الكتاب (ص 12): «يجب أن تفرغ من الحبر وتوضع في وعاء خاص للتنظيف ضمن مادة كيميائية خاصة».'],
     ['تغسله بالماء وتتركه يجف في الهواء',false,'الكتاب يذكر وعاء تنظيف بمادة كيميائية خاصة.']]}}
   ],
   body:[
    {book:`<p>وهي أقلام خاصة ذات سماكات مختلفة تبدأ من (<span class="ltr">0.1 mm</span>) إلى (<span class="ltr">1 mm</span>) تعبأ بحبر خاص للرسم وغالباً تستخدم هذه الأقلام على ورق (الكلك). والشكل يبين مجموعة من هذه الأقلام.</p><p>ملحوظة: بعد الانتهاء من استخدام أقلام التحبير يجب أن تفرغ من الحبر وتوضع في وعاء خاص للتنظيف ضمن مادة كيميائية خاصة حتى لا يجف الحبر داخلها والمحافظة عليها واستخدامها مرة أخرى. وهي مستخدمة في جميع المكاتب الهندسية. والشكل يبين علبة التنظيف الخاصة بأقلام التحبير.</p>`,ref:'ص 11–12'},
    {watch:`<p>كتب الكتاب سماكة أقلام التحبير «<span class="ltr">0.1 mm²</span> إلى <span class="ltr">1 mm²</span>»، وسماكة الخط طول يقاس بالمليمتر <span class="ltr">mm</span> لا بالمليمتر المربع، فكتبناها <span class="ltr">0.1 mm</span> إلى <span class="ltr">1 mm</span>.</p>`,fix:true},
    {tip:`<p>رقم قلم التحبير هو <b>سماكة خطه</b>: القلم <span class="ltr">0.5</span> يرسم خطاً عرضه نصف مليمتر. لذلك نستعمل قلماً سميكاً للحواف الظاهرة وقلماً أرفع لخطوط الأبعاد والخطوط المساعدة.</p>`,title:'ماذا يعني رقم القلم؟'},
    {title:'مختبر مصغّر: رتّب العناية بالقلم',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب ما تفعله بقلم التحبير من الرسم حتى استعماله مرة أخرى، بحسب ملحوظة الكتاب.',steps:[
     ['ارسم بقلم التحبير على ورق الكلك','هذا أول ما تفعله: الأقلام «غالباً تستخدم على ورق الكلك».'],
     ['فرّغ القلم من الحبر بعد الانتهاء','التفريغ يأتي أولاً بعد الرسم: «يجب أن تفرغ من الحبر».'],
     ['ضعه في وعاء التنظيف ضمن المادة الكيميائية الخاصة','بعد التفريغ يوضع في الوعاء «حتى لا يجف الحبر داخلها».'],
     ['استعمله مرة أخرى في رسم جديد','هذه النتيجة: «المحافظة عليها واستخدامها مرة أخرى».']]})}
   ]},

  {st:13,short:'الخطوط',title:'٦- الخطوط',ref:'ص 12',
   q:'خط متصل، خط متقطع، خط شرطة ونقطة… كيف يعرف القارئ معنى كل خط دون أن تكتب له؟',
   get art(){const rows=[[86,ln([70,86],[290,86],'vl'),'خط كامل عريض: الحواف الظاهرة','خط كامل عريض: يرسم به حواف الجسم الظاهرة (ص 16).'],[140,hidLn([70,140],[290,140]),'خط متقطع: الحواف المختفية','خط متقطع بنصف ثخانة الخط الكامل: الحواف المختفية التي لا يراها الناظر (ص 25).'],[194,ctrLn([70,194],[290,194]),'شرطة ونقطة: خط المنتصف','خط شرطة ونقطة بنصف الثخانة: خط المنتصف (محور التماثل) (ص 28).'],[248,ln([70,248],[290,248],'dm')+arrowHead([70,248],[-1,0])+arrowHead([290,248],[1,0]),'خط كامل رفيع: الأبعاد','خط كامل رفيع: خطوط الأبعاد والخطوط المساعدة لتحديد الأبعاد، وتنتهي خطوط الأبعاد بأسهم (ص 16).']];
     let g='';rows.forEach(([y,l,lab,tp])=>{g+=l+DWS.txt(180,y+24,lab,{fs:13,b:1})+DWS.tip(56,y-14,248,46,tp)});
     return DWS.art('أنواع الخطوط في هذه الوحدة',g)},
   cap:'أنواع الخطوط التي تستعمل في هذه الوحدة، مجموعة من صفحات الكتاب.<br><b>مرّر المؤشر على أي خط (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'لماذا ترسم الخطوط في بداية الرسم رفيعة وخفيفة جداً؟',opts:[
     ['لتوفير الرصاص',false,'ليس هذا السبب الذي يذكره الكتاب.'],
     ['ليسهل تعديل الرسم أو تصحيحه',true,'الكتاب (ص 12): «فترسم الخطوط رفيعة وخفيفة جداً حتى يسهل تعديل الرسم أو تصحيحه».'],
     ['لأن الرسم النهائي يكون خفيفاً أيضاً',false,'العكس: بعد التأكد «تغمق جميع الخطوط بالسمك المناسب».']]}}
   ],
   body:[
    {book:`<p>الأشكال في الرسم تمثل بخطوط واضحة، وهذه الخطوط لها أشكال وسماكات مختلفة، وعندما ترسم هذه الخطوط موافقة لمواصفاتها يمكننا معرفة معانيها، وتتضح دلالتها من أنواعها. وعادة تبدأ عملية الرسم بقلم الرصاص <span class="ltr">2H</span> للخطوط الإنشائية للرسم، فترسم الخطوط رفيعة وخفيفة جداً حتى يسهل تعديل الرسم أو تصحيحه. وعندما نتأكد من صحة الرسم تمحى الخطوط الزائدة وتغمق جميع الخطوط بالسمك المناسب لأنواع الخطوط.</p>`,ref:'ص 12'},
    {tip:`<p>لا يعرض الكتاب هنا جدولاً بأنواع الخطوط، لكنه يذكرها متفرقة في الصفحات التالية. جمعناها في الرسم أعلاه مع صفحة كل منها: الكامل العريض (ص 16)، والمتقطع (ص 25)، والشرطة والنقطة (ص 28)، والكامل الرفيع (ص 16). ستعود إليها في كل درس.</p>`,title:'أنواع الخطوط في هذه الوحدة'},
    {title:'مختبر مصغّر: رتّب مراحل الرسم',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط مراحل الرسم بالترتيب الذي يذكره الكتاب في هذه الفقرة.',steps:[
     ['ارسم الخطوط الإنشائية بالقلم <span class="ltr">2H</span> رفيعة وخفيفة جداً','«تبدأ عملية الرسم بقلم الرصاص 2H للخطوط الإنشائية».'],
     ['تأكد من صحة الرسم','لا تمحُ ولا تغمّق قبل أن تتأكد: «وعندما نتأكد من صحة الرسم…».'],
     ['امحُ الخطوط الزائدة','بعد التأكد «تمحى الخطوط الزائدة».'],
     ['غمّق جميع الخطوط بالسمك المناسب لنوعها','التغميق آخر خطوة، فإذا غمّقت قبل المحو بقيت آثار يصعب إزالتها.']],done:'هكذا يبقى الرسم سهل التصحيح حتى آخر لحظة.'})}
   ]},

  {st:14,short:'المحاة',title:'٧- المحاة',ref:'ص 12',
   q:'تريد أن تمحو خطاً صغيراً ملاصقاً لخط نهائي غامق… كيف تحمي الخط الذي لا تريد محوه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محاة مطاطية، ورقيقة معدنية بفتحات، وفرشاة ناعمة، ومحاة هشة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="المحاة المطاطية: بيضاء أو حمراء، لإزالة خطوط الرصاص أو الحبر المراد إصلاحها أو الخطوط الإنشائية المستغنى عنها."><rect x="54" y="80" width="96" height="52" rx="10" fill="#F4B6A6" stroke="#2C4A40" stroke-width="3"/><rect x="54" y="80" width="34" height="52" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/></g>
<text x="102" y="156" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">مطاطية</text>
<g data-tip="الرقيقة المعدنية: بها فتحات هندسية، توضع على الخط المراد إزالته فتحمي ما حوله من المسح."><rect x="190" y="70" width="120" height="86" rx="4" fill="#C9D3D8" stroke="#2C4A40" stroke-width="3"/><rect x="204" y="84" width="34" height="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="270" cy="96" r="9" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><rect x="204" y="110" width="8" height="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><path d="M230 140l14 -22l14 22z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><rect x="270" y="122" width="26" height="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/></g>
<text x="250" y="180" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">رقيقة معدنية بفتحات</text>
<g data-tip="الفرشاة الناعمة: تنظف بها اللوحة بعد المسح لإزالة آثار استعمال المحاة."><rect x="70" y="204" width="80" height="16" rx="5" fill="#C9A46E" stroke="#2C4A40" stroke-width="2.5"/><path d="M150 202h30v20h-30z" fill="#2C4A40"/><path d="M180 204l22 -4M180 208l24 0M180 212l24 0M180 216l24 4" stroke="#2C4A40" stroke-width="2"/></g>
<text x="130" y="246" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">فرشاة ناعمة</text>
<g data-tip="المحاة الهشة: على هيئة مسحوق، لإزالة الرصاص المتناثر على لوحة الرسم."><path d="M232 230c0 -22 20 -34 36 -34s36 12 36 34z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g fill="#E6D4B8" stroke="#2C4A40" stroke-width="1"><circle cx="252" cy="222" r="4"/><circle cx="268" cy="214" r="4"/><circle cx="284" cy="222" r="4"/><circle cx="262" cy="228" r="3"/><circle cx="278" cy="229" r="3"/></g></g>
<text x="268" y="252" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">هشة (مسحوق)</text></svg>`,
   cap:'نوعا المحاة وما يستعمل معهما.<br><b>مرّر المؤشر على كل أداة (أو المسها في الجوال) لتعرف استعمالها.</b>',
   side:[
    {predict:{q:'تريد محو خط إنشائي ملاصق لخط نهائي دون أن تمسح الخط النهائي. ماذا تستعمل مع المحاة؟',opts:[
     ['الفرشاة الناعمة',false,'الفرشاة تنظف آثار المحاة بعد المسح، ولا تحمي الخطوط.'],
     ['رقيقة معدنية بها فتحات هندسية توضع على الخط',true,'الكتاب (ص 12): «يضغط على رقيقة معدنية بها فتحات هندسية توضع على الخطوط المراد إزالتها».'],
     ['المحاة الهشة',false,'المحاة الهشة لإزالة الرصاص المتناثر على اللوحة.']]}}
   ],
   body:[
    {book:`<p>من الضروري أن يستعمل الرسام المحاة وعليه أن يختار المحاة المناسبة، ويوجد نوعان منها، نوع مطاطي أبيض أو أحمر اللون وتستعمل في إزالة خطوط الرصاص أو الحبر المراد إصلاحها أو الخطوط الإنشائية المستغنى عنها، ويراعى عند إزالة الرصاص أن يضغط الرسام بيده على ورقة الرسم أو يضغط على رقيقة معدنية بها فتحات هندسية توضع على الخطوط المراد إزالتها. ثم تنظف اللوحة بفرشاة ناعمة لإزالة آثار استعمال المحاة. والنوع الآخر هش على هيئة مسحوق وتستعمل في إزالة الرصاص المتناثر على لوحة الرسم.</p>`,ref:'ص 12'},
    {tip:`<p>لماذا يضغط الرسام بيده على الورقة عند المسح؟ لأن الورقة إذا تحركت تحت المحاة تتجعد أو تتمزق. والفرشاة بدل اليد: لو مسحت بقايا المحاة بيدك لنشرت الرصاص على الرسم.</p>`,title:'تفاصيل صغيرة مهمة'},
    {title:'مختبر مصغّر: أي محاة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر نوع المحاة المناسب لكل عمل.',cats:['المحاة المطاطية','المحاة الهشة (المسحوق)'],items:[
     ['إزالة خط رصاص مراد إصلاحه',0,'المطاطية «تستعمل في إزالة خطوط الرصاص أو الحبر المراد إصلاحها».'],
     ['إزالة الرصاص المتناثر على لوحة الرسم',1,'«والنوع الآخر هش على هيئة مسحوق وتستعمل في إزالة الرصاص المتناثر».'],
     ['إزالة الخطوط الإنشائية المستغنى عنها',0,'من استعمالات المحاة المطاطية (ص 12).'],
     ['إزالة خط حبر مراد إصلاحه',0,'المطاطية للرصاص أو الحبر.']]})}
   ]},

  {st:15,short:'المثلثات',title:'٨- المثلثات',ref:'ص 13',
   q:'مثلثان فقط على المسطرة حرف T… فكم زاوية تستطيع أن ترسم بهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثلث 45 ومثلث 30 و60 على المسطرة حرف T" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<g data-tip="المسطرة حرف ⟦T⟧: دليل أفقي تنزلق عليه المثلثات."><rect x="34" y="228" width="292" height="16" fill="#BFD7EA" stroke="#2C4A40" stroke-width="2.5"/></g>
<g data-tip="المثلث ⟦45°⟧: زاويتاه الحادتان ⟦45°⟧، وفيه زاوية قائمة ⟦90°⟧. من البلاستيك الملون الشفاف ليرى الرسام الخطوط."><path d="M60 228V108L180 228Z" fill="#4FB3A9" fill-opacity=".7" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M78 228V200H60" fill="none" stroke="#2C4A40" stroke-width="1.6"/><path d="M152 228a28 28 0 0 0 -8 -20" fill="none" stroke="#2C4A40" stroke-width="1.6"/></g>
<text x="128" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">45°</text><text x="88" y="196" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">90°</text>
<g data-tip="المثلث ⟦30°⟧ و⟦60°⟧: زاويتاه الحادتان ⟦30°⟧ و⟦60°⟧، وفيه زاوية قائمة ⟦90°⟧."><path d="M200 228V96L276 228Z" fill="#F2C14E" fill-opacity=".75" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M216 228V212H200" fill="none" stroke="#2C4A40" stroke-width="1.6"/><path d="M200 120a24 24 0 0 0 12 -3" fill="none" stroke="#2C4A40" stroke-width="1.6"/><path d="M254 228a22 22 0 0 0 -10 -19" fill="none" stroke="#2C4A40" stroke-width="1.6"/></g>
<text x="210" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">30°</text><text x="240" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">60°</text>
<text x="180" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">زوايا معلومة</text></svg>`,
   cap:'المثلثان على المسطرة حرف <span class="ltr">T</span> وزواياهما المعلومة.<br><b>مرّر المؤشر على كل مثلث وعلى المسطرة (أو المسها في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'بأي زوايا ترسم أكثر الخطوط المائلة بالمثلثات بحسب الكتاب؟',opts:[
     ['<span class="ltr">10° – 20° – 40°</span>',false,'ليست هذه زوايا المثلثات المعلومة.'],
     ['<span class="ltr">30° – 45° – 60° – 90°</span>',true,'الكتاب (ص 13): «ترسم بواسطة زوايا المثلثات المعلومة 30 – 45 – 60 – 90 درجة».'],
     ['أي زاوية، فالمثلث يدور',false,'المثلث يعطي زواياه المعلومة فقط؛ الزوايا الأخرى بالمنقلة أو بتجميع مثلثين.']]}}
   ],
   body:[
    {book:`<p>تصنع المثلثات من البلاستيك الملون الشفاف ليتسنى للرسام رؤية الخطوط عند رسمها، وأكثر الخطوط المائلة في الرسم، ترسم بواسطة زوايا المثلثات المعلومة <span class="ltr">30 – 45 – 60 – 90</span> درجة.</p>`,ref:'ص 13'},
    {add:`<p>بوضع المثلثين معاً على المسطرة تحصل على زوايا أخرى، مثل <span class="ltr">15°</span> (أي <span class="ltr">45° − 30°</span>) و<span class="ltr">75°</span> (أي <span class="ltr">45° + 30°</span>). ستحتاج <span class="ltr">75°</span> لاحقاً: هي ميل الخط في رمز القطر <span class="ltr">ϕ</span> (ص 37).</p>`,title:'زوايا من تجميع المثلثين'},
    {title:'مختبر مصغّر: ارسم زاوية',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الزاوية، وشاهد أي مثلث تضعه على المسطرة حرف <span class="ltr">T</span> وأي ضلع ترسم عليه.',
     ins:[{k:'a',l:'الزاوية مع الأفقي',seg:[[30,'30°'],[45,'45°'],[60,'60°'],[90,'90°']],v:45}],
     calc:s=>{const a=s.a,W=320,H=190,yb=160,x0=60,L=150;const rad=a*Math.PI/180;
      const tri=a===45?{p:[[x0+L,yb],[x0,yb],[x0,yb-L]],n:'المثلث 45°'}:a===30?{p:[[x0+L,yb],[x0,yb],[x0,yb-L*Math.tan(rad)]],n:'المثلث 30° و60° (الزاوية 30° على المسطرة)'}:a===60?{p:[[x0+L*0.55,yb],[x0,yb],[x0,yb-L*0.55*Math.tan(rad)]],n:'المثلث 30° و60° (الزاوية 60° على المسطرة)'}:{p:[[x0+80,yb],[x0,yb],[x0,yb-140]],n:'الضلع القائم لأي من المثلثين'};
      const [A,O,C]=tri.p;const e=a===90?[[x0,yb],[x0,yb-150]]:[[A[0],A[1]],[A[0]-Math.cos(rad)*230,A[1]-Math.sin(rad)*230]];
      let g=`<svg viewBox="0 0 ${W} ${H}" class="dwv" role="img" aria-label="رسم زاوية بالمثلث"><rect x="10" y="${yb}" width="300" height="12" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.5"/><path d="M${A[0]} ${A[1]}L${O[0]} ${O[1]}L${C[0]} ${C[1]}Z" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.6;fill-opacity:.8"/>`;
      g+=`<line x1="${e[0][0].toFixed(1)}" y1="${e[0][1].toFixed(1)}" x2="${Math.max(12,e[1][0]).toFixed(1)}" y2="${Math.max(10,e[1][1]).toFixed(1)}" class="vl" style="stroke:var(--blue)"/>`;
      const ax=a===90?x0:A[0],r=26;g+=a===90?`<path d="M${x0+14} ${yb}V${yb-14}H${x0}" class="dm"/>`:`<path d="M${ax-r} ${yb}A${r} ${r} 0 0 1 ${(ax-r*Math.cos(rad)).toFixed(1)} ${(yb-r*Math.sin(rad)).toFixed(1)}" class="dm"/>`;
      g+=`<text x="${a===90?x0+22:ax-r-16}" y="${yb-8}" class="dt" text-anchor="middle">${a}°</text></svg>`;
      return {pic:`<div class="dw-sheet">${g}</div>`,facts:[['الزاوية',a+'°','hi'],['الأداة',tri.n]],msg:a===90?'الخط الرأسي (<span class="ltr">90°</span>) يرسم على الضلع القائم للمثلث وهو منزلق على المسطرة.':'المثلث ثابت على المسطرة، والقلم يتحرك على ضلعه المائل فيخرج الخط بالزاوية المعلومة.'}}})}
   ]},

  {st:16,short:'الفرجار',title:'٩- الفرجار',ref:'ص 13',
   q:'ترسم دائرة بالفرجار فتخرج غير مغلقة أو أكبر مما تريد… أين الخطأ في طريقتك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الفرجار يرسم دائرة: الإبرة في المركز والساقان بفتحة نصف القطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الدائرة المرسومة: ترسم أولاً بخط خفيف، ويراجع مقاسها قبل إعادة رسمها بخط داكن."><circle cx="150" cy="200" r="82" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="6 4"/></g>
<g data-tip="نصف القطر ⟦(نق)⟧: المسافة بين الإبرة ورصاص الفرجار، تفتح الساقان بقدرها."><path d="M150 200H232" stroke="#C25F12" stroke-width="2"/><text x="191" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#C25F12">نق</text></g>
<g data-tip="الإبرة: تثبت في محور (مركز) الدائرة، ونمسك ذراع الفرجار الحامل لها."><path d="M150 200L176 70" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="200" r="4" fill="#2C4A40"/></g>
<g data-tip="ذراع الرصاص: يميل الفرجار قليلاً في اتجاه حركة رصاص الرسم."><path d="M232 200L176 70" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><path d="M228 192l4 8l6 -6z" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/></g>
<g data-tip="المقبض: نمسك منه الفرجار ونبدأ من مكان معين ونتحرك في اتجاه عقرب الساعة."><rect x="168" y="44" width="16" height="28" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g>
<g data-tip="اتجاه الحركة: في اتجاه عقرب الساعة."><path d="M246 140a90 90 0 0 1 -12 112" fill="none" stroke="#1F4E7A" stroke-width="3"/><path d="M228 258l14 -2l-4 -12z" fill="#1F4E7A"/></g></svg>`,
   cap:'الطريقة الصحيحة لرسم الدائرة بالفرجار.<br><b>مرّر المؤشر على الإبرة والذراع والمقبض ونصف القطر والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لرسم دائرة، كم تفتح ساقي الفرجار؟',opts:[
     ['مسافة تساوي قطر الدائرة',false,'لو فتحته بالقطر لخرجت الدائرة ضعف المطلوب.'],
     ['مسافة تساوي نصف قطر الدائرة (نق)',true,'الكتاب (ص 13): «يفتح ساقي الفرجار مسافة تساوي نصف قطر الدائرة (نق)».'],
     ['أي مسافة ثم نصحح بالممحاة',false,'الكتاب يطلب المقاس الصحيح ثم مراجعته قبل التغميق.']]}}
   ],
   body:[
    {book:`<p>يستعمل الرسام فرجار الرصاص أو الحبر في رسم الدوائر والأقواس الدائرية، وغالباً ما يحتاج الرسام إلى فرجار محكم ودقيق. وعند استعمال الفرجار في رسم الدوائر والأقواس، يفتح ساقي الفرجار مسافة تساوي نصف قطر الدائرة (نق)، وترسم الدائرة على لوحة الرسم بخط خفيف، ويراجع مقاس الدائرة المرسومة قبل إعادة رسمها بخط داكن. والطريقة الصحيحة لاستعمال الفرجار في رسم الدائرة، بأن نمسك ذراع الفرجار الحامل للإبرة، ونثبت الإبرة في محور الدائرة، ونبدأ من مكان معين ونتحرك في اتجاه عقرب الساعة. ويفضل إمالة الفرجار قليلاً في اتجاه حركة رصاص الرسم. ويستعمل فرجار التقسيم ذو إبرتين معدنيتين في نقل المسافات والأبعاد الهامة في الرسم وأيضاً في تقسيم المسافات.</p>`,ref:'ص 13'},
    {tip:`<p>انتبه للفرق: <b>فرجار الرسم</b> فيه إبرة ورصاص (أو حبر) فيرسم. أما <b>فرجار التقسيم</b> ففيه إبرتان معدنيتان لا ترسمان: تنقل بهما مسافة من مكان إلى آخر أو تقسم بهما مسافة إلى أجزاء متساوية. وستستعمل نقل المسافات بالفرجار في طريقة استنتاج المسقط الثالث (ص 23).</p>`,title:'فرجاران مختلفان'},
    {title:'مختبر مصغّر: رتّب خطوات رسم الدائرة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي تنفذه، بحسب طريقة الكتاب.',steps:[
     ['افتح ساقي الفرجار مسافة تساوي نصف القطر (نق)','قبل أي شيء تضبط فتحة الفرجار على نصف القطر.'],
     ['أمسك ذراع الفرجار الحامل للإبرة وثبّت الإبرة في محور الدائرة','لا ترسم قبل تثبيت الإبرة في المركز.'],
     ['ابدأ من مكان معين وتحرك في اتجاه عقرب الساعة بخط خفيف، مع إمالة الفرجار قليلاً','الدائرة الأولى خفيفة: «ترسم الدائرة على لوحة الرسم بخط خفيف».'],
     ['راجع مقاس الدائرة المرسومة','المراجعة قبل التغميق، حتى يسهل التصحيح.'],
     ['أعد رسم الدائرة بخط داكن','آخر خطوة بعد التأكد من المقاس.']]})}
   ]},

  {st:17,short:'المساطر',title:'١٠- المساطر',ref:'ص 13',
   q:'قطعة طولها في الطبيعة متر كامل… كيف تقيس أبعادها على ورقة صغيرة بدقة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مسطرة مسطحة مدرجة ومسطرة مثلثة المقطع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>
<g data-tip="المسطرة المسطحة: مدرجة ومقسمة إلى ملليمتر أو إلى أجزاء البوصة، لإنجاز الرسومات بدقة وسهولة."><rect x="44" y="92" width="272" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M58 92v18M72 92v10M86 92v10M100 92v10M114 92v14M128 92v10M142 92v10M156 92v10M170 92v10M184 92v18M198 92v10M212 92v10M226 92v10M240 92v14M254 92v10M268 92v10M282 92v10M296 92v10" stroke="#2C4A40" stroke-width="1.4"/></g>
<text x="180" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">مسطرة مسطحة</text>
<g data-tip="المسطرة المثلثة: شكل آخر من المساطر، لها ثلاثة أوجه مدرجة بتقسيمات مختلفة، فهي «مختلفة التقسيم والاستعمال»."><path d="M60 214L300 196V228L60 246Z" fill="#E6D4B8" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M60 214L76 196L316 180L300 196" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M300 196L316 180V212L300 228" fill="#C9A46E" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M90 211v10M120 209v14M150 207v10M180 205v14M210 203v10M240 200v14M270 198v10" stroke="#2C4A40" stroke-width="1.3"/></g>
<text x="180" y="272" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">مسطرة مثلثة</text></svg>`,
   cap:'شكلان من المساطر المدرجة.<br><b>مرّر المؤشر على كل مسطرة (أو المسها في الجوال) لتعرف وصفها.</b>',
   side:[
    {predict:{q:'لماذا يحتاج الرسام إلى مساطر مدرجة؟',opts:[
     ['لأن مقاسات الرسم قد تساوي مقاسات الجسم أو تكون أكبر أو أصغر منها',true,'الكتاب (ص 13): «لذلك يحتاج الرسام إلى مساطر مدرجة ومقسمة إلى ملليمتر أو إلى أجزاء البوصة».'],
     ['لرسم الخطوط بها بدل المسطرة حرف T',false,'من النصائح العامة (ص 45): «لا تستعمل مسطرة القياس في رسم الخطوط».'],
     ['لقطع الورق',false,'المساطر للقياس لا للقطع.']]}}
   ],
   body:[
    {book:`<p>أحياناً تكون مقاسات الرسم مساوية تماماً لمقاسات الجسم في الطبيعة، وفي حالات أخرى تكون أكبر أو أصغر. لذلك يحتاج الرسام إلى مساطر مدرجة ومقسمة إلى ملليمتر أو إلى أجزاء البوصة لتساعد في إنجاز الرسومات بدقة وسهولة. وهذه المساطر متنوعة من ناحية الشكل، فمنها المسطح ومنها المثلث. كما أنها مختلفة التقسيم والاستعمال.</p>`,ref:'ص 13'},
    {watch:`<p>مسطرة القياس أداة <b>قياس</b> فقط. من النصائح العامة (ص 45): «لا تستعمل مسطرة القياس في رسم الخطوط»؛ الخطوط ترسم بالمسطرة حرف <span class="ltr">T</span> والمثلثات، فحافة مسطرة القياس إذا تلفت لم تعد تقيس بدقة.</p>`},
    {title:'تحقق سريع: المساطر',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['المساطر مقسمة إلى ملليمتر أو إلى أجزاء البوصة.',true,'نص الكتاب (ص 13).'],
     ['كل المساطر لها شكل واحد مسطح.',false,'الكتاب: «فمنها المسطح ومنها المثلث».'],
     ['تُستعمل مسطرة القياس في رسم الخطوط لأنها مستقيمة.',false,'النصائح العامة (ص 45): «لا تستعمل مسطرة القياس في رسم الخطوط».']]})}
   ]},

  {st:18,short:'مقياس الرسم',title:'١١- مقياس الرسم',ref:'ص 13',
   q:'محوّل ضخم وبرغي صغير جداً… كيف يرسم كل منهما على ورقة واحدة المقاس؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جسم حقيقي كبير ورسمه المصغر، ومقياس الرسم نسبة بينهما" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="الطول الحقيقي للجسم: طوله في الطبيعة."><rect x="40" y="70" width="180" height="70" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><path d="M40 156H220M40 148v16M220 148v16" stroke="#2C4A40" stroke-width="1.6"/><path d="M40 156l9 -4v8zM220 156l-9 -4v8z" fill="#2C4A40"/></g>
<text x="130" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الطول الحقيقي</text>
<g data-tip="طول الرسم: طول الجسم على ورقة الرسم؛ هنا أصغر من الحقيقي (رسم مصغر لجسم كبير)."><rect x="244" y="88" width="72" height="28" rx="2" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M244 130H316M244 124v12M316 124v12" stroke="#2C4A40" stroke-width="1.4"/><path d="M244 130l7 -3v6zM316 130l-7 -3v6z" fill="#2C4A40"/></g>
<text x="280" y="156" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">طول الرسم</text>
<g data-tip="مقياس الرسم: النسبة بين طول الرسم والطول الحقيقي للجسم، ويجب أن يكتب واضحاً على لوحة الرسم."><rect x="58" y="208" width="244" height="64" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="216" y="246" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">مقياس الرسم =</text><text x="122" y="234" text-anchor="middle" font-size="13" fill="#2C4A40">طول الرسم</text><line x1="72" y1="241" x2="172" y2="241" stroke="#2C4A40" stroke-width="2"/><text x="122" y="260" text-anchor="middle" font-size="13" fill="#2C4A40">الطول الحقيقي</text></g></svg>`,
   cap:'مقياس الرسم نسبة طول الرسم إلى الطول الحقيقي.<br><b>مرّر المؤشر على الجسم والرسم والعلاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'جسم صغير جداً يحتاج إلى إيضاح أبعاده بدقة. كيف يرسم؟',opts:[
     ['مكبراً',true,'الكتاب (ص 13): الأجسام الصغيرة جداً «تحتاج إلى إيضاح أبعادها بدقة في الرسم فيرسم الجسم مكبراً».'],
     ['مصغراً',false,'التصغير للأجسام الكبيرة التي يتعذر رسمها بحجمها.'],
     ['بحجمه الحقيقي دائماً',false,'لو رسم بحجمه الحقيقي لضاعت تفاصيله الدقيقة.']]}}
   ],
   body:[
    {book:`<p>أحياناً تكون الأبعاد الحقيقية للأجسام مساوية تماماً للأبعاد في الرسم، وفي حالات أخرى تكون الأجسام صغيرة جداً وتحتاج إلى إيضاح أبعادها بدقة في الرسم، فيرسم الجسم مكبراً، وأيضاً توجد أجسام كبيرة يتعذر إعداد رسم لها، فيرسم الجسم مصغراً، وتعتمد نسبة التصغير أو التكبير على أبعاد الجسم في الطبيعة وأبعاد الرسم. وهذه النسبة تسمى مقياس الرسم.</p>
     <div class="dw-eq"><span>مقياس الرسم</span><span>=</span><span class="dw-frac"><span>طول الرسم</span><span>الطول الحقيقي للجسم</span></span></div>
     <p>ويجب أن يكتب مقياس الرسم واضحاً على لوحة الرسم.</p>`,ref:'ص 13'},
    {tip:`<p>يكتب المقياس عادة بالصورة <span class="ltr">1 : n</span> للتصغير (طول الرسم جزء من الطول الحقيقي) و<span class="ltr">n : 1</span> للتكبير. مثلاً قطعة طولها الحقيقي <span class="ltr">400 mm</span> ترسم بالمقياس <span class="ltr">1 : 2</span> بطول <span class="ltr">200 mm</span>. (توضيح منا، والكتاب بلا أمثلة رقمية.)</p>`,title:'كيف يكتب المقياس؟'},
    {watch:`<p>الأبعاد المكتوبة على الرسم هي دائماً الأبعاد <b>الحقيقية</b> للجسم مهما كان المقياس؛ المقياس يغيّر طول الخط على الورق فقط. (توضيح منا.)</p>`},
    {title:'مختبر مصغّر: كم يكون طوله على الورق؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر المقياس والطول الحقيقي (أرقام تختارها أنت)، وقارن طول الرسم بعرض ورقة <span class="ltr">A4</span> <span class="ltr">(297 mm)</span> من جدول الكتاب.',
     predict:{q:'قطعة طولها الحقيقي <span class="ltr">400 mm</span> رسمت بالمقياس <span class="ltr">1 : 2</span>. طولها على الورق؟',opts:[['<span class="ltr">800 mm</span>',false,'هذا تكبير (2 : 1)، والمقياس 1 : 2 تصغير.'],['<span class="ltr">200 mm</span>',true,'طول الرسم = الطول الحقيقي × المقياس = <span class="ltr">400 × ½ = 200 mm</span>.'],['<span class="ltr">400 mm</span>',false,'هذا بالمقياس 1 : 1.']]},
     ins:[{k:'sc',l:'مقياس الرسم',seg:[['1:5','1 : 5'],['1:2','1 : 2'],['1:1','1 : 1'],['2:1','2 : 1'],['5:1','5 : 1']],v:'1:2'},{k:'L',l:'الطول الحقيقي (أرقام تختارها أنت)',min:10,max:1200,step:10,v:400,u:'mm',dp:0}],
     calc:s=>{const [a,b]=String(s.sc).split(':').map(Number),k=a/b,d=s.L*k,mx=Math.max(s.L,d,297);
      return {bars:[{l:'الطول الحقيقي',v:s.L,max:mx,u:'mm',dp:0,col:'--live'},{l:'طول الرسم',v:d,max:mx,u:'mm',dp:1,col:d<=297?'--on':'--stop'},{l:'عرض ورقة A4',v:297,max:mx,u:'mm',dp:0,col:'--muted'}],
       msg:d>297?`طول الرسم أكبر من عرض ورقة <span class="ltr">A4</span>: اختر مقياساً أصغر أو ورقة أكبر.`:k<1?'المقياس للتصغير: الرسم أصغر من الجسم الحقيقي (للأجسام الكبيرة).':k>1?'المقياس للتكبير: الرسم أكبر من الجسم (للأجسام الصغيرة جداً).':'المقياس <span class="ltr">1 : 1</span>: الرسم بالحجم الحقيقي.'}}})}
   ]},

  {st:19,short:'الطبعات',title:'١٢- الطبعات (الشبلونات)',ref:'ص 14',
   q:'ترسم عشرين رمز مصباح في مخطط واحد… هل ترسم كل واحد بالفرجار والمسطرة من جديد؟',
   get art(){const sv=DWS.fig(B,'u1-l1','ص 14')[0];const p=DWS.put(sv,22,86,316,92);
     const t=DWS.tipR(p.M,[10,10],[200,70],'طبعة رموز: طبعة خاصة بالرموز الكهربائية أو الإلكترونية (النوع ث)، ومعها دوائر وأشكال صغيرة.',0)+DWS.tipR(p.M,[215,10],[410,70],'طبعة دوائر متدرجة الأقطار: لرسم الدوائر الصغيرة والأقواس الدائرية (النوع ب).',0)+DWS.tipR(p.M,[10,80],[410,110],'مسطرة حروف: لكتابة الحروف اللاتينية والأرقام على الرسم كتابة منتظمة.',0);
     return DWS.art('بعض أشكال الطبعات',p.g+t+DWS.txt(180,226,'اختصار للوقت',{fs:14,b:1})+DWS.txt(180,248,'وإتقان للعمل',{fs:14,b:1}),'#FBE6C4')},
   cap:'بعض أشكال الطبعات الكهربائية والإلكترونية (رسم مبسط بدل صورة الكتاب).<br><b>مرّر المؤشر على كل طبعة (أو المسها في الجوال) لتعرف نوعها.</b>',
   side:[
    {predict:{q:'لماذا تستعمل الطبعات في الرسم؟',opts:[
     ['لأنها أدق من الفرجار في كل الأحوال',false,'الكتاب لا يقول هذا؛ يذكر فائدتين أخريين.'],
     ['اختصاراً للوقت وإتقاناً للعمل',true,'الكتاب (ص 14): «وتستعمل في الرسم اختصاراً للوقت وإتقاناً للعمل».'],
     ['لتعويض نقص الأدوات الأخرى',false,'هي أداة إضافية، لا بديل عن الأدوات الأساسية.']]}}
   ],
   body:[
    {book:`<p>تصنع الطبعات من البلاستيك الشفاف، وتستعمل في الرسم اختصاراً للوقت وإتقاناً للعمل. وهناك أنواع متعددة كل منها يتناسب مع الأداء المطلوب ومنها:</p><ul style="list-style:none;padding-inline-start:4px"><li>أ- طبعات لرسم الانحناءات، وتستعمل في رسم الخطوط المنحنية غير المنتظمة.</li><li>ب- طبعات لرسم الدوائر الصغيرة والأقواس الدائرية، وأخرى لرسم الأشكال الهندسية المنتظمة مثل المضلعات، القطع الناقص ومصطلحات الرسم الكهربي والرسم المعماري والرسم الميكانيكي.</li><li>ت- طبعات مرنة قابلة للثني، وتصنع من البلاستيك المرن، وهي ذات فوائد كبيرة في رسم ونقل المنحنيات.</li><li>ث- طبعات خاصة بالرموز مثل الرموز الكهربائية أو الإلكترونية أو الميكانيكية أو المعمارية. والشكل يبين بعض هذه الطبعات.</li></ul>`,ref:'ص 14'},
    {add:`<p>في المكاتب الهندسية تقوم مكتبات الرموز الجاهزة في برامج الرسم بالحاسب بدور الطبعات: تختار رمز المصباح أو المفتاح وتضعه في المخطط بضغطة واحدة. والفكرة واحدة: رمز موحّد الشكل والمقاس في كل مرة.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: أي طبعة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر نوع الطبعة المناسب لكل عمل، بحسب قائمة الكتاب.',cats:['الانحناءات (أ)','الدوائر والأشكال (ب)','المرنة (ت)','الرموز (ث)'],items:[
     ['رسم خط منحنٍ غير منتظم',0,'«طبعات لرسم الانحناءات، وتستعمل في رسم الخطوط المنحنية غير المنتظمة».'],
     ['رسم دوائر صغيرة ومضلعات منتظمة',1,'«طبعات لرسم الدوائر الصغيرة والأقواس الدائرية، وأخرى لرسم الأشكال الهندسية المنتظمة».'],
     ['نقل منحنى من رسم إلى آخر',2,'الطبعات المرنة «ذات فوائد كبيرة في رسم ونقل المنحنيات».'],
     ['رسم رمز المصباح والمفتاح في مخطط كهربائي بسرعة',3,'«طبعات خاصة بالرموز مثل الرموز الكهربائية أو الإلكترونية».']]})}
   ]},

  {recap:[
   'الرسم الفني لغة تفاهم دولية بين المصمم والمنفذ، له أسس وقواعد ثابتة، ويجب أن يشمل جميع البيانات اللازمة للتنفيذ بدقة.',
   'يقسم الرسم الفني إلى رسم بالحاسب (برامج CAD أداة لا تتخذ قرارات) ورسم يدوي بأدوات: اللوحة، والمسطرة حرف T، وأقلام الرصاص (2H ثم HB ثم 2B)، والورق (A0 إلى A4)، وأقلام التحبير، والمحاة، والمثلثات، والفرجار، والمساطر، والطبعات.',
   'يبدأ الرسم بخطوط إنشائية خفيفة بالقلم 2H، وبعد التأكد من صحته تمحى الزوائد وتغمق الخطوط بالسمك المناسب لنوعها.',
   'مقياس الرسم = طول الرسم ÷ الطول الحقيقي للجسم: يكبَّر الجسم الصغير ويصغَّر الكبير، ويكتب المقياس واضحاً على اللوحة.']}
],
 theory:[
  {h:'تمهيد',ref:'ص 5',html:`<p>«يعتبر الرسم الفني المرحلة الأولى في إنشاء أي صناعة، وبالتالي في تقنية الكهرباء، إذ إنه أصبح لغة التفاهم الدولية ذات أسس وقواعد واصطلاحات ورموز يستطيع بها المصمم والمنفذ، أي العامل الفني، الفهم والتفاهم في مجال تخصصهم».</p>
   <p>«ويحتوي هذا الكتاب على الرموز الكهربائية لعناصر الدوائر الكهربائية ورموز عناصر إلكترونيات القدرة. وكذلك يحتوي على رموز عناصر التحكم والحماية ورموز الآلات الكهربائية. ويحتوي أيضاً على توصيلات الإضاءة والتجهيزات المنزلية ولوحات التوزيع الرئيسة والفرعية. وكذلك يحتوي على الدوائر الخطية لتغذية المصانع وشبكات التوزيع فيها ومخططات دوائر التوصيل للآلات ومخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية ومخططات دوائر نظم القوى الكهربائية وعناصر حمايتها».</p>
   <p>«ننصح المتدرب بحل كل التمارين الواردة في هذا الكتاب، إذ إن ذلك يساعده على استيعاب المادة العلمية … ويهدف هذا المقرر إلى تعريف المتدرب بأساسيات الرسم الكهربائي ورموز عناصر الدوائر الكهربائية المختلفة ليتمكن المتدرب من فهم وقراءة المخططات الكهربائية».</p>`},
  {h:'أهداف المقرر',ref:'ص 6',html:`<p>أن يتمكن المتدرب من الآتي:</p><ol><li>الإلمام بالرموز الكهربائية.</li><li>الإلمام بتصنيف المخططات والدوائر الكهربائية وقراءتها.</li><li>الإلمام بدوائر التوصيل ورسمها.</li><li>الإلمام بدوائر التحكم ودوائر الحماية.</li></ol>`},
  {h:'الوحدة الأولى: المبادئ الأساسية للرسم الفني — الأهداف',ref:'ص 7–8',html:`<p><b>الهدف العام للوحدة:</b> الإلمام بقواعد الرسم الفني.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على أدوات الرسم المختلفة وكيفية استخدامها.</li><li>أن يتقن المتدرب كتابة الأبعاد على المشغولات.</li><li>أن يتقن المتدرب رسم مساقط المشغولات.</li><li>أن يتقن المتدرب رسم مقاطع الأجسام.</li></ol>`},
  {h:'١-١ المقدمة',ref:'ص 9',html:`<p>«الغرض من الرسم الفني هو التعامل بين العاملين في المجال الهندسي والفني وله أسس وقواعد ثابتة، ويجب أن تتوافر الخبرة اللازمة وذلك بكثرة المران والتركيز. كما يجب أن يشمل جميع البيانات والمعلومات اللازمة لإتمام أي عملية حتى يمكن تنفيذ العملية بكل دقة، لتعطي صورة صحيحة وسليمة للمطلوب عمله. إن الهدف الأساسي من هذا الباب هو التعرف على أدوات الرسم المختلفة وكيفية استخدامها الاستخدام الصحيح».</p>`},
  {h:'١-٢ أقسام الرسم الفني',ref:'ص 9',html:`<p>يقسم الرسم الفني إلى قسمين: <b>أولاً</b> الرسم الفني باستخدام الحاسب، <b>ثانياً</b> الرسم الفني اليدوي.</p>
   <p><b>أولاً: الرسم باستخدام الكمبيوتر <span class="ltr">Drawing By Computer</span>:</b> «الكمبيوتر وملحقاته من برامج رسم وتصميم وأجهزة مساعدة تعد من أهم أدوات الرسم في الوقت الحاضر، وهي شائعة الاستعمال. وبرامج الكاد <span class="ltr">CAD</span> من أهم برامج الرسم والتصميم، وهي تتميز بالسرعة والسهولة والدقة في تحضير الرسومات الهندسية أو تعديلها … والكمبيوتر ما هو إلا أداة للرسم، فهو لا يفكر أو يتخذ أي قرارات، ويستعمل لتسهيل عمليات الرسم والتصميم التي تعتمد على خبرات المصممين والرسامين وما يصدرونه من أوامر».</p>`},
  {h:'ثانياً: الرسم الفني اليدوي — الأدوات المستخدمة في الرسم',ref:'ص 10',html:`<p>«لتسجيل أي معلومات أو إعداد رسم يدوي حر نحتاج إلى أدوات رسم مثل قلم الرصاص والممحاة، وإذا أردنا رسم دائرة نحتاج إلى فرجار، ولرسم خط مستقيم نحتاج إلى لوحة خشبية ومسطرة حرف (<span class="ltr">T</span>) مستقيمة برأس عمودية. وأما إذا أردنا إعداد رسومات تتفق مع الأسس الهندسية فالأمر يحتاج إلى أدوات رسم أخرى متعددة لتوفير كثير من الجهد والوقت ولضمان رفع جودة العمل».</p>`},
  {fig:'',ref:'ص 10–14',caption:'أدوات الرسم الاثنتا عشرة كما يعددها الكتاب (رسوم توضيحية مبسطة بدل صور الكتاب). المس أي أداة في تبويب «المختبر» لتختبر نفسك في استعمالها.',draw:()=>`<div class="dw-cards" style="grid-template-columns:repeat(auto-fill,minmax(118px,1fr))">${TOOLS.map((t,i)=>`<div class="dw-card" style="cursor:default">${t.s}<b>${i+1}- ${t.n}</b><small>${t.en}</small></div>`).join('')}</div>`},
  {h:'١- لوحات الرسم ٢- المسطرة حرف (T)',ref:'ص 10',html:`<p>«تصنع لوحات الرسم من خشب الصنوبر الأبيض، ويراعى في تصنيع هذه اللوحات أن تكون ذات سطح قاسٍ ومستوٍ، يثبت ورق الرسم عليها بشريط لاصق أو مشابك معدنية خاصة، كما تصنع حواف هذه اللوحات مستقيمة وقاسية من خشب شديد الصلابة أو من الصلب لاستخدامها كدليل للمسطرة حرف (<span class="ltr">T</span>) أثناء عملية الرسم».</p>
   <p>«المسطرة حرف (<span class="ltr">T</span>) الشائعة الاستعمال ذات ساق مصنوعة من الخشب، مثبت على كل جانب منه حافة شفافة مصنوعة من البلاستيك تسمح للرسام أن يرى الخطوط عند رسمها، ومثبت في طرفها الأيسر رأس خشبية ثابتة ومتعامدة على حافة المسطرة، وتستعمل في رسم <b>الخطوط الأفقية المتوازية</b>، كما تستعمل كدليل تنزلق عليه المثلثات. كما توجد مساطر ذات رؤوس متحركة يمكن ضبطها وتستعمل في رسم الخطوط المائلة المتوازية».</p>`},
  {h:'٣- أقلام الرصاص',ref:'ص 10',html:`<p>«أقلام الرصاص من أدوات الرسم المهمة، وتختلف عن أقلام الكتابة، وهي ذات درجات صلابة مختلفة تتناسب مع أعمال الرسم المختلفة. ويوجد منها ثمانية عشر نوعاً».</p>`},
  {fig:'',ref:'ص 10',caption:'درجات أقلام الرصاص التي يذكرها الكتاب واستعمال كل منها',draw:()=>`<div class="tablebox" style="max-width:560px;margin-inline:auto"><table class="tt"><thead><tr><th>القلم</th><th>الظل</th><th>يستعمل في</th></tr></thead><tbody>
    <tr><td><span class="ltr">2H</span></td><td>خفيف الظل، سهل المسح لا يترك أثراً</td><td>الخطوط الإنشائية العامة</td></tr>
    <tr><td><span class="ltr">HB</span></td><td>معتدل الظل</td><td>تشطيب الرسم والكتابة</td></tr>
    <tr><td><span class="ltr">2B</span></td><td>غامق ثقيل الظل، يترك أثراً بعد المسح</td><td>تثبيت الرسم النهائي</td></tr></tbody></table></div>`},
  {h:'٤- ورق الرسم',ref:'ص 11',html:`<p>«ورق الرسم من الورق المقوى، سطحه خشن قليلاً، متعدد الألوان والمقاسات، ويمكن للرسام أن يختار النوع المناسب للرسم من حيث المقاس أو اللون». وهذه مقاسات ورق الرسم الشائع الاستعمال:</p>
   <div class="tablebox" style="max-width:360px;margin-inline:auto"><table class="tt"><thead><tr><th>الرمز</th><th>المقاس</th></tr></thead><tbody>${PAPER.slice().reverse().map(([n,a,b])=>`<tr><td><span class="ltr">${n}</span></td><td><span class="ltr">${a} × ${b} mm</span></td></tr>`).join('')}</tbody></table></div>
   <p>«ويوجد نوع آخر من الورق خفيف نصف شفاف داكن اللون مائل للزرقة يسمى ورق (الكلك) يستعمل في شف الرسومات باستعمال قلم الرصاص أو الحبر ويتم طبعها على ورق حساس بواسطة ماكينة خاصة لذلك».</p>`},
  {fig:'',ref:'ص 11',caption:'مقاسات الورق من الجدول مرسومة بنسبها الحقيقية: كل مقاس نصف الذي قبله (توضيح للمتدرب — ليس من نص الكتاب)',draw:()=>wrap(paperSVG('A4'),460)},
  {h:'٥- أقلام التحبير',ref:'ص 11–12',html:`<p>«وهي أقلام خاصة ذات سماكات مختلفة تبدأ من (<span class="ltr">0.1 mm</span>) إلى (<span class="ltr">1 mm</span>) تعبأ بحبر خاص للرسم وغالباً تستخدم هذه الأقلام على ورق (الكلك)».</p>
   <p><b>ملحوظة:</b> «بعد الانتهاء من استخدام أقلام التحبير يجب أن تفرغ من الحبر وتوضع في وعاء خاص للتنظيف ضمن مادة كيميائية خاصة حتى لا يجف الحبر داخلها، والمحافظة عليها واستخدامها مرة أخرى. وهي مستخدمة في جميع المكاتب الهندسية».</p>`},
  {fig:'',ref:'ص 11–12',caption:'أقلام التحبير وعلبة تنظيفها (رسم مبسط بدل صورتي الكتاب)',draw:()=>wrap(svgOpen(300,110,'أقلام التحبير وعلبة التنظيف')+`${[[18,'var(--stop)'],[50,'var(--on)']].map(([y,c])=>`<rect x="14" y="${y}" width="110" height="18" rx="4" class="tn" style="fill:var(--surface-2)"/><rect x="104" y="${y}" width="10" height="18" style="fill:${c}"/><path d="M124 ${y+5}h26l14 4l-14 4h-26z" class="tn" style="fill:var(--surface)"/>`).join('')}<rect x="200" y="30" width="70" height="66" rx="8" class="vl" style="fill:var(--stop-soft)"/><rect x="194" y="16" width="82" height="16" rx="5" class="tn" style="fill:var(--surface-2)"/>${[212,228,244,258].map(x=>`<rect x="${x}" y="4" width="6" height="14" class="tn" style="fill:var(--surface)"/>`).join('')}`+tAr(88,104,'أقلام التحبير',null,'lb','middle')+tAr(235,110,'علبة التنظيف',null,'lb','middle')+'</svg>',340)},
  {err:'كتب الكتاب (ص 11) سماكة أقلام التحبير «<span class="ltr">0.1 mm²</span> إلى <span class="ltr">1 mm²</span>»، وسماكة الخط طول يقاس بالمليمتر <span class="ltr">mm</span> لا بالمليمتر المربع، فكتبناها <span class="ltr">0.1 mm</span> إلى <span class="ltr">1 mm</span>. وتعليق الصورة «أقلم التحبير» صوابه «أقلام».'},
  {h:'٦- الخطوط',ref:'ص 12',html:`<p>«الأشكال في الرسم تمثل بخطوط واضحة، وهذه الخطوط لها أشكال وسماكات مختلفة، وعندما ترسم هذه الخطوط موافقة لمواصفاتها يمكننا معرفة معانيها، وتتضح دلالتها من أنواعها. وعادة تبدأ عملية الرسم بقلم الرصاص <span class="ltr">2H</span> للخطوط الإنشائية للرسم، فترسم الخطوط رفيعة وخفيفة جداً حتى يسهل تعديل الرسم أو تصحيحه. وعندما نتأكد من صحة الرسم تمحى الخطوط الزائدة وتغمق جميع الخطوط بالسمك المناسب لأنواع الخطوط».</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب في هذا الموضع):</b> لا يعرض الكتاب هنا جدولاً بأنواع الخطوط، لكنه يذكرها متفرقة في الصفحات التالية. جمعناها في الجدول أدناه مع صفحة كل منها.'},
  {fig:'',ref:'ص 16، 25، 28',caption:'أنواع الخطوط التي تستعمل في هذه الوحدة، مجموعة من صفحات الكتاب',draw:()=>{const r=(y,el,ar,pg)=>el+tAr(300,y+4,ar,null,'','end')+tx(318,y+4,pg,'dt mut','start');
    return wrap(svgOpen(380,150,'أنواع الخطوط')+r(20,ln([16,20],[150,20],'vl'),'خط كامل عريض: الحواف الظاهرة','ص 16')+r(52,hidLn([16,52],[150,52]),'خط متقطع بنصف الثخانة: الحواف المختفية','ص 25')+r(84,ctrLn([16,84],[150,84]),'شرطة ونقطة بنصف الثخانة: خط المنتصف','ص 28')+r(116,ln([16,116],[150,116],'dm')+arrowHead([16,116],[-1,0])+arrowHead([150,116],[1,0]),'خط كامل رفيع: خطوط الأبعاد والمساعدة','ص 16')+'</svg>',520)}},
  {h:'٧- المحاة ٨- المثلثات ٩- الفرجار',ref:'ص 12–13',html:`<p><b>المحاة:</b> «يوجد نوعان منها، نوع مطاطي أبيض أو أحمر اللون وتستعمل في إزالة خطوط الرصاص أو الحبر المراد إصلاحها أو الخطوط الإنشائية المستغنى عنها، ويراعى عند إزالة الرصاص أن يضغط الرسام بيده على ورقة الرسم أو يضغط على رقيقة معدنية بها فتحات هندسية توضع على الخطوط المراد إزالتها. ثم تنظف اللوحة بفرشاة ناعمة … والنوع الآخر هش على هيئة مسحوق وتستعمل في إزالة الرصاص المتناثر على لوحة الرسم».</p>
   <p><b>المثلثات:</b> «تصنع من البلاستيك الملون الشفاف ليتسنى للرسام رؤية الخطوط عند رسمها، وأكثر الخطوط المائلة في الرسم ترسم بواسطة زوايا المثلثات المعلومة <span class="ltr">30 – 45 – 60 – 90</span> درجة».</p>
   <p><b>الفرجار:</b> «يستعمل الرسام فرجار الرصاص أو الحبر في رسم الدوائر والأقواس الدائرية … يفتح ساقي الفرجار مسافة تساوي نصف قطر الدائرة (نق)، وترسم الدائرة على لوحة الرسم بخط خفيف، ويراجع مقاس الدائرة المرسومة قبل إعادة رسمها بخط داكن. والطريقة الصحيحة لاستعمال الفرجار في رسم الدائرة بأن نمسك ذراع الفرجار الحامل للإبرة، ونثبت الإبرة في محور الدائرة، ونبدأ من مكان معين ونتحرك في اتجاه عقرب الساعة. ويفضل إمالة الفرجار قليلاً في اتجاه حركة رصاص الرسم. ويستعمل فرجار التقسيم ذو إبرتين معدنيتين في نقل المسافات والأبعاد الهامة في الرسم وأيضاً في تقسيم المسافات».</p>`},
  {h:'١٠- المساطر ١١- مقياس الرسم',ref:'ص 13',html:`<p><b>المساطر:</b> «أحياناً تكون مقاسات الرسم مساوية تماماً لمقاسات الجسم في الطبيعة، وفي حالات أخرى تكون أكبر أو أصغر. لذلك يحتاج الرسام إلى مساطر مدرجة ومقسمة إلى ملليمتر أو إلى أجزاء البوصة لتساعد في إنجاز الرسومات بدقة وسهولة. وهذه المساطر متنوعة من ناحية الشكل، فمنها المسطح ومنها المثلث. كما أنها مختلفة التقسيم والاستعمال».</p>
   <p><b>مقياس الرسم:</b> «أحياناً تكون الأبعاد الحقيقية للأجسام مساوية تماماً للأبعاد في الرسم، وفي حالات أخرى تكون الأجسام صغيرة جداً وتحتاج إلى إيضاح أبعادها بدقة في الرسم فيرسم الجسم مكبراً، وأيضاً توجد أجسام كبيرة يتعذر إعداد رسم لها فيرسم الجسم مصغراً، وتعتمد نسبة التصغير أو التكبير على أبعاد الجسم في الطبيعة وأبعاد الرسم. وهذه النسبة تسمى مقياس الرسم».</p>
   <div class="dw-eq"><span>مقياس الرسم</span><span>=</span><span class="dw-frac"><span>طول الرسم</span><span>الطول الحقيقي للجسم</span></span></div>
   <p>«ويجب أن يكتب مقياس الرسم واضحاً على لوحة الرسم».</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> يكتب المقياس عادة بالصورة <span class="ltr">1 : n</span> للتصغير (طول الرسم جزء من الطول الحقيقي) و<span class="ltr">n : 1</span> للتكبير. مثلاً قطعة طولها الحقيقي <span class="ltr">400 mm</span> ترسم بالمقياس <span class="ltr">1 : 2</span> بطول <span class="ltr">200 mm</span>. جرب ذلك في تبويب «المختبر» وتبويب «الأمثلة المحلولة».'},
  {h:'١٢- الطبعات (الشبلونات)',ref:'ص 14',html:`<p>«تصنع الطبعات من البلاستيك الشفاف، وتستعمل في الرسم اختصاراً للوقت وإتقاناً للعمل. وهناك أنواع متعددة كل منها يتناسب مع الأداء المطلوب ومنها:»</p><ol style="list-style:arabic-indic"><li>طبعات لرسم الانحناءات، وتستعمل في رسم الخطوط المنحنية غير المنتظمة.</li><li>طبعات لرسم الدوائر الصغيرة والأقواس الدائرية، وأخرى لرسم الأشكال الهندسية المنتظمة مثل المضلعات، القطع الناقص ومصطلحات الرسم الكهربي والرسم المعماري والرسم الميكانيكي.</li><li>طبعات مرنة قابلة للثني، وتصنع من البلاستيك المرن، وهي ذات فوائد كبيرة في رسم ونقل المنحنيات.</li><li>طبعات خاصة بالرموز مثل الرموز الكهربائية أو الإلكترونية أو الميكانيكية أو المعمارية.</li></ol>`},
  {fig:'',ref:'ص 14',caption:'بعض أشكال الطبعات الكهربائية والإلكترونية (رسم مبسط بدل صورة الكتاب: طبعة رموز التوصيلات، وطبعة دوائر متدرجة، ومسطرة حروف)',draw:()=>wrap(svgOpen(420,120,'طبعات')+`<rect x="10" y="10" width="190" height="60" rx="8" class="vl" style="fill:var(--blue-soft);fill-opacity:.6"/>${[[30,32],[60,32],[90,32]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="9" class="tn" style="fill:var(--surface)"/><path d="M${x-6} ${y-6}L${x+6} ${y+6}M${x-6} ${y+6}L${x+6} ${y-6}" class="tn" style="opacity:${i===0?1:0}"/>`).join('')}<rect x="112" y="24" width="22" height="14" class="tn" style="fill:var(--surface)"/><path d="M150 40l10-16l10 16z" class="tn" style="fill:var(--surface)"/><rect x="24" y="50" width="160" height="8" class="tn" style="fill:var(--surface)"/>
   <rect x="215" y="10" width="195" height="60" rx="8" class="vl" style="fill:var(--live-soft);fill-opacity:.7"/>${[3,4,5,6.5,8,10,12].map((r,i)=>`<circle cx="${232+i*25}" cy="40" r="${r}" class="tn" style="fill:var(--surface)"/>`).join('')}
   <rect x="10" y="80" width="400" height="30" rx="6" class="vl" style="fill:var(--on-soft);fill-opacity:.7"/><text x="210" y="100" class="dt" text-anchor="middle" style="font-size:14px;letter-spacing:4px">ABCDEFG 0123456789</text>`+'</svg>',520)}
 ],
 lab:(el)=>{
  let qi=0,score=0,tries=0,picked=null,paper='A4',sc='1:2',real=400;const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c12"><h2>أي أداة أستعمل؟ <small>مبنية على وصف الأدوات ص 10–14</small></h2>
    <p class="sub">اقرأ الاستعمال، ثم المس الأداة المناسبة. بعد الإجابة يظهر نص الكتاب عن الأداة.</p>
    <div class="dw-q" id="l1q"></div><div class="dw-row"><span class="sub">النتيجة:</span><span class="dw-score" id="l1s"></span><button class="btn" id="l1n">سؤال آخر</button></div>
    <div class="dw-cards" id="l1c"></div><div class="dw-msg" id="l1m"></div></div>
   <div class="panel c6"><h2>مقاسات ورق الرسم <small>الجدول ص 11</small></h2>
    <div class="dw-row">${segHTML('pp',PAPER.map(p=>[p[0],p[0]]),paper)}</div><div class="dw-sheet" id="l1p"></div><div class="dw-msg" id="l1pm"></div></div>
   <div class="panel c6"><h2>مقياس الرسم <small>ص 13</small></h2>
    <p class="sub">اختر المقياس واكتب الطول الحقيقي للقطعة، وشاهد طولها على الورق وهل تتسع على ورقة <span class="ltr">A4</span> بعرضها <span class="ltr">297 mm</span>. الأرقام من عندك.</p>
    <div class="dw-row">${segHTML('sc',[['1:5','1 : 5'],['1:2','1 : 2'],['1:1','1 : 1'],['2:1','2 : 1'],['5:1','5 : 1']],sc)}</div>
    <div class="dw-row"><label class="sub">الطول الحقيقي <input type="number" class="dw-num" id="l1r" min="1" max="5000" step="1" value="${real}"> <span class="ltr">mm</span></label></div>
    <div class="dw-sheet" id="l1b"></div><div class="facts"><div class="fact"><span>طول الرسم = الطول الحقيقي × المقياس</span><b id="l1d"></b></div><div class="fact"><span>المقياس = طول الرسم ÷ الطول الحقيقي</span><b id="l1k"></b></div></div><div class="dw-msg" id="l1sm"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);const order=[...toolQ.keys()];
  const drawQ=()=>{const q=toolQ[order[qi%order.length]];$('#l1q').innerHTML=`${(qi%order.length)+1}. أي أداة تستعمل في: <b>${q[0]}</b>؟`;$('#l1s').textContent=`${score} / ${tries}`;
    $('#l1c').innerHTML=TOOLS.map(t=>`<button type="button" class="dw-card${picked?(t.k===q[1]?' ok':t.k===picked?' no':''):''}" data-t="${t.k}">${t.s}<b>${t.n}</b><small>${t.en}</small></button>`).join('');
    $('#l1m').className='dw-msg'+(picked?(picked===q[1]?' ok':' bad'):'');
    $('#l1m').innerHTML=picked?`${picked===q[1]?'<b>صحيح.</b> ':'<b>ليست هذه.</b> الصحيح: '+TOOLS.find(t=>t.k===q[1]).n+'. '}${TOOLS.find(t=>t.k===q[1]).d} <span class="ref">${q[2]}</span>`:''};
  $('#l1c').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b||picked)return;picked=b.dataset.t;tries++;if(picked===toolQ[order[qi%order.length]][1]){score++;did.right=(did.right||0)+1}drawQ()});
  $('#l1n').onclick=()=>{qi++;picked=null;drawQ()};
  const drawP=()=>{$('#l1p').innerHTML=paperSVG(paper);const p=PAPER.find(x=>x[0]===paper);$('#l1pm').innerHTML=`<b class="ltr">${p[0]}</b>: <span class="ltr">${p[1]} × ${p[2]} mm</span>. ${paper==='A0'?'أكبر المقاسات في الجدول.':`نصف المقاس <span class="ltr">${PAPER[PAPER.indexOf(p)-1][0]}</span> تقريباً (توضيح: ليس من نص الكتاب).`}`};
  segBind(el,'pp',v=>{paper=v;did.paper=did.paper||new Set();did.paper.add(v);drawP()});
  const ratio=()=>{const [a,b]=sc.split(':').map(Number);return a/b};
  const drawS=()=>{const k=ratio(),d=real*k;$('#l1d').textContent=fm(d,2)+' mm';$('#l1k').textContent=sc.replace(':',' : ');
    const W=420,s=Math.min(1,(W-40)/Math.max(real,d,297)),y1=30,y2=74;let h=svgOpen(W,120,'مقارنة الطول الحقيقي وطول الرسم');
    h+=`<rect x="20" y="${y2-12}" width="${f2(297*s)}" height="24" class="tn" style="fill:var(--surface-2);stroke-dasharray:3 3"/>`+tx(20+297*s-4,y2+24,'A4 = 297','dt mut','end');
    h+=`<rect x="20" y="${y1-8}" width="${f2(real*s)}" height="16" style="fill:var(--live-soft);stroke:var(--live)"/>`+tAr(24,y1-12,'الحقيقي',null,'lb','start');
    h+=`<rect x="20" y="${y2-8}" width="${f2(d*s)}" height="16" style="fill:${d<=297?'var(--on-soft)':'var(--stop-soft)'};stroke:${d<=297?'var(--on)':'var(--stop)'}"/>`+tAr(24,y2-12,'على الورق',null,'lb','start');
    h+=tx(Math.min(W-6,20+real*s+6),y1+4,fm(real,0)+' mm','dt',real*s>W-90?'end':'start')+tx(Math.min(W-6,20+d*s+6),y2+4,fm(d,2)+' mm','dt',d*s>W-90?'end':'start');
    $('#l1b').innerHTML=h+'</svg>';
    $('#l1sm').className='dw-msg'+(d>297?' bad':'');$('#l1sm').innerHTML=d>297?`طول الرسم <span class="ltr">${fm(d,1)} mm</span> أكبر من عرض ورقة <span class="ltr">A4</span>: اختر مقياساً أصغر (تصغيراً) أو ورقة أكبر.`:k<1?'المقياس للتصغير: الرسم أصغر من الجسم الحقيقي (للأجسام الكبيرة).':k>1?'المقياس للتكبير: الرسم أكبر من الجسم الحقيقي (للأجسام الصغيرة جداً).':'المقياس <span class="ltr">1 : 1</span>: الرسم بالحجم الحقيقي.'};
  segBind(el,'sc',v=>{sc=v;did.sc=did.sc||new Set();did.sc.add(v);drawS()});
  $('#l1r').oninput=e=>{const v=parseFloat(e.target.value);if(isFinite(v)&&v>0){real=clamp(v,1,5000);did.real=1;drawS()}};
  const st=stepsUI($('#l1st'),[
   {t:'أداة الخطوط الأفقية',x:'أجب عن سؤال «أي أداة أستعمل؟» إجابة صحيحة واحدة على الأقل، واقرأ نص الكتاب الذي يظهر.',done:()=>(did.right||0)>=1},
   {t:'خمس إجابات صحيحة',x:'اضغط «سؤال آخر» وتابع حتى تصل إلى خمس إجابات صحيحة.',done:()=>(did.right||0)>=5},
   {t:'أكبر ورقة وأصغرها',x:'في «مقاسات ورق الرسم» اختر <span class="ltr">A0</span> ثم <span class="ltr">A4</span>، ولاحظ كم مرة تتسع ورقة <span class="ltr">A4</span> داخل <span class="ltr">A0</span>.',done:()=>did.paper&&did.paper.has('A0')&&paper==='A4'},
   {t:'جسم كبير',x:'اكتب طولاً حقيقياً <span class="ltr">1000 mm</span> مع المقياس <span class="ltr">1 : 2</span>: لا يتسع على <span class="ltr">A4</span>. اختر <span class="ltr">1 : 5</span> فيصبح <span class="ltr">200 mm</span>.',done:()=>real===1000&&sc==='1:5'},
   {t:'جسم صغير',x:'اكتب <span class="ltr">20 mm</span> واختر <span class="ltr">5 : 1</span>: يرسم الجسم الصغير مكبراً <span class="ltr">100 mm</span> لتتضح أبعاده.',done:()=>real===20&&sc==='5:1'}]);
  drawQ();drawP();drawS();loopOn(el,()=>st.check())},
 examples:[
  {title:'إيجاد مقياس الرسم',ref:'ص 13',q:'<p><b>مثال توضيحي (الكتاب بلا أمثلة رقمية):</b> قطعة طولها الحقيقي في الطبيعة معلوم، ورسمت على اللوحة بطول معلوم. ما مقياس الرسم؟ غيّر الرقمين وشاهد الحل يتغير.</p>',
   given:[{id:'d',label:'طول الرسم',unit:'mm',value:150,min:0.1},{id:'r',label:'الطول الحقيقي للجسم',unit:'mm',value:600,min:0.1}],
   solve:g=>{const k=g.d/g.r;const out=[{t:'نطبق العلاقة: مقياس الرسم = طول الرسم ÷ الطول الحقيقي للجسم',f:`M=\\frac{${fm(g.d)}}{${fm(g.r)}}`,v:B.round(k,4),dp:k<1?4:2}];
    out.push(k<1?{t:`المقياس أقل من 1 فهو تصغير، ويكتب بالصورة <span class="ltr">1 : n</span> حيث n = الطول الحقيقي ÷ طول الرسم`,f:`n=\\frac{${fm(g.r)}}{${fm(g.d)}}`,v:B.round(1/k,2),dp:2,final:true}:
     {t:`المقياس أكبر من أو يساوي 1 فهو تكبير (أو بالحجم الحقيقي)، ويكتب <span class="ltr">n : 1</span>`,f:`n=\\frac{${fm(g.d)}}{${fm(g.r)}}`,v:B.round(k,2),dp:2,final:true});return out}},
  {title:'إيجاد طول الرسم من المقياس',ref:'ص 13',q:'<p><b>مثال توضيحي:</b> نريد رسم قطعة بالمقياس <span class="ltr">1 : n</span>. كم يكون طولها على الورق؟</p>',
   given:[{id:'r',label:'الطول الحقيقي للجسم',unit:'mm',value:1200,min:0.1},{id:'n',label:'n في المقياس 1 : n',unit:'',value:5,min:0.01}],
   solve:g=>[{t:'من العلاقة: طول الرسم = الطول الحقيقي × مقياس الرسم',f:`L=${fm(g.r)}\\times\\frac{1}{${fm(g.n)}}`,v:B.round(g.r/g.n,2),unit:'mm',dp:2,final:true},
    {t:g.r/g.n<=297?'يتسع على ورقة <span class="ltr">A4</span> (العرض <span class="ltr">297 mm</span>).':'أطول من عرض ورقة <span class="ltr">A4</span> (<span class="ltr">297 mm</span>): نحتاج ورقة أكبر أو مقياساً أصغر.'}]}
 ],
 quiz:[
  {q:'ما الذي يميز برامج الكاد CAD في الرسم؟',o:['تفكر وتتخذ القرارات بدل المصمم','السرعة والسهولة والدقة في تحضير الرسومات أو تعديلها','لا تحتاج إلى خبرة الرسام','تستعمل للرسم اليدوي فقط'],c:1,e:'ص 9: «والكمبيوتر ما هو إلا أداة للرسم، فهو لا يفكر أو يتخذ أي قرارات».'},
  {q:'أي قلم يستعمل للخطوط الإنشائية العامة لأنه خفيف الظل سهل المسح؟',o:['2B','HB','2H','قلم التحبير'],c:2,e:'ص 10: 2H للخطوط الإنشائية، HB للتشطيب والكتابة، 2B لتثبيت الرسم النهائي.'},
  {q:'تستعمل المسطرة حرف (T) في رسم:',o:['الدوائر','الخطوط الأفقية المتوازية','الخطوط المنحنية غير المنتظمة','نقل المسافات'],c:1,e:'ص 10، وتستعمل كذلك دليلاً تنزلق عليه المثلثات.'},
  {q:'مقاس الورقة A3 هو:',o:['297 × 210 mm','420 × 297 mm','594 × 420 mm','841 × 594 mm'],c:1,e:'جدول المقاسات ص 11.'},
  {q:'قطعة طولها الحقيقي 300 mm رسمت بطول 150 mm. مقياس الرسم:',o:['2 : 1','1 : 1','1 : 2','1 : 150'],c:2,e:'مقياس الرسم = طول الرسم ÷ الطول الحقيقي = 150 ÷ 300 = 1 : 2 (ص 13).'},
  {q:'عند رسم دائرة بالفرجار تفتح ساقاه مسافة تساوي:',o:['قطر الدائرة','نصف قطر الدائرة','محيط الدائرة','ضعف القطر'],c:1,e:'ص 13، ونبدأ من مكان معين ونتحرك في اتجاه عقرب الساعة.'}
 ]
});

/* =====================================================================
   LESSON 2 — قواعد وضع الأبعاد (ص 15–17)
   ===================================================================== */
/* the template (طبعة) of ص 15–16 in mm, v downward: a=50, b=25, c=15, d=5, e=10, f=13, thickness 3 */
const TPL=[[0,25],[50,25],[50,20],[37,20],[37,10],[50,10],[50,0],[15,0]];
/* dimension set of the template (key, a, b, off, opts). The letters of ص 15 / the numbers of ص 16 */
const TDIM={
 c:[[0,0],[15,0],8,{fa:[0,25],num:'15'}],
 f:[[37,0],[50,0],8,{fa:[37,10],num:'13'}],
 a:[[0,25],[50,25],-8,{num:'50'}],
 d:[[50,25],[50,20],-8,{out:1,num:'5',tdx:-7}],
 e:[[50,20],[50,10],-8,{num:'10'}],
 b:[[50,25],[50,0],-16,{num:'25',tdx:4}],
 h:[[15,0],[50,0],16,{num:'35'}],
 g:[[50,10],[50,0],-8,{num:'10'}],
 i:[[37,20],[37,10],7,{num:'10'}]};
function tplSVG(o){o=o||{};const s=o.s||5.2,pad=o.pad||20,W=(50+pad*2)*s,H=(25+pad*1.6)*s,oy=pad*0.95;const T=q=>[(q[0]+pad*0.7)*s,(q[1]+oy)*s];
  let h=svgOpen(W,H,o.aria||'طبعة ص 15 بأبعادها');h+=plyl(TPL.map(T),'vl',true,' style="fill:var(--surface-2)"');
  h+=tAr(...T([20,16]),'الثخانة','3','','middle');
  (o.keys||[]).forEach(k=>{const [a,b,off,op]=TDIM[k];const st=o.stage||3;const lab=o.letters?k:op.num;const cls=(o.cls&&o.cls[k])||'';
    h+=dim(T,a,b,off,Object.assign({},op,{t:st>=3?lab+(o.q&&o.q.includes(k)?' ?':''):null,only:st===1?'ext':null,cls,tcls:cls==='bad'?'er':cls==='good'?'okt':''}));
    if(o.hit){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=dy/L,ny=-dx/L;const p1=T([a[0]+nx*off,a[1]+ny*off]),p2=T([b[0]+nx*off,b[1]+ny*off]);
      h+=`<line x1="${f2(p1[0])}" y1="${f2(p1[1])}" x2="${f2(p2[0])}" y2="${f2(p2[1])}" class="hit" data-k="${k}"/>`}});
  return h+'</svg>'}

B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'15–17',
 title:'قواعد وضع الأبعاد',
 summary:'يجب أن يحتوي الرسم على جميع الأبعاد اللازمة لإنتاج المشغولة، ولا يكتب البعد أكثر من مرة ولا توضع أبعاد غير ضرورية. ترسم الحواف بخط كامل عريض، ثم خطوط الأبعاد المساعدة، ثم خطوط الأبعاد بأسهمها، ثم الأرقام.',
 stations:[
  {intro:true},

  {st:1,short:'مبادئ وضع الأبعاد',title:'١-٣ مبادئ وضع الأبعاد',ref:'ص 15',
   q:'كتبت كل بعد تعرفه على الرسم «للاحتياط»… فهل هذا أفضل للفني أم أسوأ؟',
   get art(){const p=DWS.fit(v=>tplSVG({keys:['c','h','f','a','d','e','g','b','i'],letters:1,q:['g','h','i'],s:v/90}),22,58,316,196);
     const s=p.px/90,pad=20,oy=pad*0.95,T0=q=>[(q[0]+pad*0.7)*s,(q[1]+oy)*s];const M=q=>p.M(T0(q));
     const L={a:'البعد ⟦a⟧: الطول الخارجي (بعد أساسي).',b:'البعد ⟦b⟧: الارتفاع الخارجي (بعد أساسي).',c:'البعد ⟦c⟧: يعين الحد المائل.',d:'البعد ⟦d⟧: يعين مكان الجزء المقطوع (من الحافة السفلى إلى أسفل المجرى).',e:'البعد ⟦e⟧: ارتفاع الجزء المقطوع (المجرى).',f:'البعد ⟦f⟧: عمق الجزء المقطوع.',h:'البعد ⟦h⟧ زائد: يستنتج من ⟦a⟧ و⟦c⟧، فلا يوضع.',g:'البعد ⟦g⟧ زائد: يستنتج من ⟦b⟧ و⟦d⟧ و⟦e⟧، فلا يوضع.',i:'البعد ⟦i⟧ زائد: يساوي البعد ⟦e⟧، ولا يكتب البعد أكثر من مرة.'};
     let t='';Object.keys(L).forEach(k=>{const [a,b,off]=TDIM[k];const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;const A=[a[0]+nx*off,a[1]+ny*off],Bq=[b[0]+nx*off,b[1]+ny*off];t+=DWS.tipR(M,A,Bq,L[k],6)});
     t+=DWS.tipR(M,[14,13],[26,19],'الثخانة: ⟦3 mm⟧ — إذا عُرفت الثخانة مع الأبعاد ⟦a, b, c, d, e, f⟧ تحدد شكل القطعة تماماً.',2);
     return DWS.art('الطبعة بالأبعاد اللازمة والزائدة',p.g+t+DWS.txt(180,284,'الأبعاد بعلامة ؟ زائدة',{fs:13,b:1}),'#FBE6C4')},
   cap:'الطبعة (الشابلونة) بأبعادها: اللازمة <span class="ltr">a … f</span>، والزائدة <span class="ltr">g, h, i</span> بعلامة استفهام (كشكلي ص 15).<br><b>مرّر المؤشر على أي بعد (أو المسه في الجوال) لتعرف هل هو لازم أم زائد.</b>',
   side:[
    {predict:{q:'البعد <span class="ltr">h</span> (طول الضلع العلوي) غير مكتوب. هل يستطيع الفني أن يعرفه؟',opts:[
     ['لا، يجب أن يكتب كل بعد على الرسم',false,'كتابته تجعله مكرراً، والكتاب: «لا يجوز كتابة الأبعاد أكثر من مرة واحدة في الرسم».'],
     ['نعم، يستنتجه من البعدين <span class="ltr">a</span> و<span class="ltr">c</span>',true,'الكتاب (ص 15): «يمكن استنتاج البعد h من البعدين a, c»، أي <span class="ltr">h = a − c</span>.'],
     ['نعم، يقيسه بالمسطرة على الورق',false,'لا يقاس شيء على الرسم؛ الأبعاد تقرأ من الأرقام المكتوبة.']]}}
   ],
   body:[
    {book:`<p>يجب أن يحتوي الرسم الفني على جميع الأبعاد اللازمة لإنتاج المشغولة.</p><p>مثال: المطلوب صنع طبعة (شابلونة) كالموضحة بالشكل من خامة ثخانتها <span class="ltr">3 mm</span> ولذا يجب أولاً معرفة البعدين الخارجيين للقطعة <span class="ltr">a, b</span> وبعد ذلك يلزم تحديد البعد <span class="ltr">c</span> الذي يعين الحد المائل ثم الأبعاد <span class="ltr">d, e, f</span> التي تعين مكان الجزء المقطوع، فإذا كانت الثخانة معلومة فإن شكل القطعة يكون قد تحدد تماماً.</p><p>ويراعى عدم وضع أية أبعاد غير ضرورية لتحديد شكل القطعة.</p><p>يمكن استنتاج البعد <span class="ltr">h</span> من البعدين <span class="ltr">a, c</span> والبعد <span class="ltr">g</span> من الأبعاد <span class="ltr">b, d, e</span> كما أن البعد <span class="ltr">i</span> يساوي البعد <span class="ltr">e</span>. ونظراً لأنه لا يجوز كتابة الأبعاد أكثر من مرة واحدة في الرسم فإنه ينبغي في هذه الحالة عدم وضع الأبعاد <span class="ltr">g, h, i</span>.</p>`,ref:'ص 15'},
    {watch:`<p>في الكتاب (ص 15): «يمكن استنتاج <b>الشكل b</b> من البعدين <span class="ltr">a, c</span>» والمقصود <b>البعد h</b> (لأن <span class="ltr">h = a − c</span>)، فالبعد <span class="ltr">b</span> بعد أساسي لا يستنتج؛ كتبناها «البعد h». وكتبت «الثخانة» في الشكلين «الشخانة».</p>`,fix:true},
    {tip:`<p>بأرقام الطبعة في ص 16: <span class="ltr">h = a − c = 50 − 15 = 35</span>، و<span class="ltr">g = b − d − e = 25 − 5 − 10 = 10</span>، و<span class="ltr">i = e = 10</span>. كل منها يحسب من أبعاد مكتوبة؛ فلو كتبناه صار البعد مكرراً، ولو عُدّل أحد الأبعاد يوماً ونُسي المكرر لتناقض الرسم وحار الفني أيهما الصحيح. (حساب منا بأرقام الكتاب.)</p>`,title:'لماذا يضر البعد الزائد؟'},
    {title:'مختبر مصغّر: لازم أم زائد؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل بعد من أبعاد الطبعة: هل هو <b>لازم</b> لتحديد الشكل، أم <b>زائد</b> يستنتج من غيره؟',cats:['لازم','زائد'],items:[
     ['البعد <span class="ltr">a</span> (الطول الخارجي)',0,'«يجب أولاً معرفة البعدين الخارجيين للقطعة a, b».'],
     ['البعد <span class="ltr">h</span> (طول الضلع العلوي)',1,'<span class="ltr">h = a − c</span>، فلا يوضع.'],
     ['البعد <span class="ltr">c</span>',0,'يعين الحد المائل، ولا يستنتج من غيره.'],
     ['البعد <span class="ltr">i</span> (ارتفاع المجرى من جهته الداخلية)',1,'«البعد i يساوي البعد e».'],
     ['البعد <span class="ltr">e</span>',0,'من الأبعاد d, e, f التي تعين مكان الجزء المقطوع.'],
     ['البعد <span class="ltr">g</span> (من أعلى المجرى إلى الحافة العليا)',1,'يستنتج من الأبعاد b, d, e.']]})}
   ]},

  {st:2,short:'قواعد وضع الأبعاد',title:'١-٤ قواعد وضع الأبعاد للمشغولات المسطحة',ref:'ص 16–17',
   q:'خط البعد، الخط المساعد، السهم، الرقم… بأي ترتيب ترسمها، وعلى أي مسافة من القطعة؟',
   get art(){const p=DWS.fit(v=>tplSVG({keys:['c','f','a','d','e','b'],s:v/90}),22,60,316,190),s=p.px/90;const pad=20,oy=pad*0.95,T0=q=>[(q[0]+pad*0.7)*s,(q[1]+oy)*s];const M=q=>p.M(T0(q));
     let t=DWS.tipR(M,[1,-1],[49,24],'حواف القطعة: ترسم أولاً بالخطوط الكاملة العريضة.',0);
     t+=DWS.tipR(M,[50.5,-0.8],[60,0.8],'الخط المساعد لتحديد الأبعاد: خط كامل رفيع يبدأ عند الحافة الظاهرة ويرسم عمودياً على الحافة المراد وضع بعدها.',3);
     t+=DWS.tipR(M,[57.5,0],[58.5,10],'خط البعد: خط كامل رفيع بين الخطين المساعدين، موازٍ للحافة، يبعد عنها نحو ⟦8 mm⟧، وينتهي بأسهم مصمتة.',3);
     t+=DWS.tipR(M,[65.5,1],[66.5,24],'خطا بعدين متوازيين: المسافة بينهما لا تقل عن ⟦5 mm⟧. والرقمان 5 و10 مزاحان عن الرقم 25.',3);
     t+=DWS.tipR(M,[56,20],[60,25],'البعد 5: المكان ضيق فوضعت أسهمه خارج الخطين المساعدين.',3);
     t+=DWS.tipR(M,[20,25.5],[30,32],'الرقم: يكتب في فراغ كتابة الأبعاد في منتصف خط البعد، بارتفاع نحو ⟦4 mm⟧، ويقرأ من أسفل أو من جهة اليمين.',2);
     return DWS.art('الطبعة بأبعادها الكاملة',p.g+t+DWS.txt(180,284,'حواف ← خطوط مساعدة ← خطوط أبعاد ← أرقام',{fs:13,b:1}))},
   cap:'الطبعة بأبعادها الكاملة (المرحلة الثالثة في ص 16).<br><b>مرّر المؤشر على الحواف والخطوط المساعدة وخطوط الأبعاد والأرقام (أو المسها في الجوال) لتعرف قاعدة كل منها.</b>',
   side:[
    {predict:{q:'خطا بعدين متوازيين على جانب واحد من القطعة. كم أقل مسافة بينهما؟',opts:[
     ['<span class="ltr">2 mm</span>',false,'مسافة صغيرة جداً تتداخل فيها الأرقام.'],
     ['<span class="ltr">5 mm</span>',true,'الكتاب (ص 16): «وعند وجود خطوط أبعاد متوازية ينبغي ألا تقل المسافات بينها عن 5mm».'],
     ['<span class="ltr">10 mm</span>',false,'10 mm هو أقل طول للخطوط المساعدة عند كتابة بعد واحد.']]}}
   ],
   body:[
    {book:`<p>بعد رسم حواف القطعة بالخطوط الكاملة العريضة يتم رسم الخطوط المساعدة لتحديد الأبعاد، وهي خطوط كاملة رفيعة تبدأ عند الحافة الظاهرة وترسم عمودية على الحافة المراد وضع بعدها. وفي حالة كتابة بعد واحد ينبغي ألا يقل طول الخطوط المساعدة لتحديد الأبعاد عن <span class="ltr">10 mm</span>، وتكون أطول من ذلك في حالة كتابة بعدين أو أكثر فوق بعضها. وترسم خطوط الأبعاد وهي خطوط كاملة رفيعة بين خطوط الأبعاد المساعدة وموازية للحافة المراد وضع البعد عليها، وتنتهي بأسهم عند خطوط تحديد الأبعاد. ويجب أن تبعد خطوط الأبعاد عن حواف الشكل <span class="ltr">8 mm</span> تقريباً. وعند وجود خطوط أبعاد متوازية ينبغي ألا تقل المسافات بينها عن <span class="ltr">5 mm</span>. ولكتابة الأبعاد ينبغي ترك فراغ في منتصف خطوط الأبعاد، وتسمى هذه المسافة فراغ كتابة الأبعاد.</p>
     <p>ويمكن في حالة ضيق المكان وضع خطوط الأبعاد خارج خطوط الأبعاد المساعدة، كما يجب رسم أسهم الأبعاد مصمتة.</p>
     <p>وتكتب الأبعاد في فراغ كتابة الأبعاد طبقاً للكتابة القياسية (<span class="ltr">DIN 16</span>) (يكون ارتفاع الأعداد نحو <span class="ltr">4 mm</span>) لمجموعة الخطوط <span class="ltr">0.5</span> عند كتابة بعدين أو أكثر فوق بعضها (كما في حالة البعدين <span class="ltr">25, 10</span>) يجب أن توضع الأبعاد مرحلة بالنسبة لبعضها.</p>
     <p>ويراعى بقدر الإمكان ألا يكون هناك تقاطعات بين الخطوط المساعدة لتحديد الأبعاد.<br>ويجب أن يمكن قراءة الأرقام والكتابة المدونة على الرسم من أسفل أو من جهة اليمين.</p>`,ref:'ص 16–17'},
    {watch:`<p>في الكتاب (ص 16): «عند كتابة بعدين أو أكثر <b>بعضها</b>» وتمامها «أو أكثر <b>فوق</b> بعضها»، فكتبناها كذلك. و«مرحلة» بمعنى مزاحة (مُرحَّلة).</p>`,fix:true},
    {tip:`<p>اقرأ القواعد أرقاماً تحفظها: الخط المساعد لا يقل عن <span class="ltr">10 mm</span>، وخط البعد على <span class="ltr">8 mm</span> تقريباً من الحافة، وبين خطي بعدين متوازيين <span class="ltr">5 mm</span> على الأقل، وارتفاع الرقم نحو <span class="ltr">4 mm</span>. و«مرحلة» تعني أن الرقمين على خطين متوازيين لا يكتبان أحدهما فوق الآخر مباشرة، بل يزاح أحدهما قليلاً حتى لا يختلطا.</p>`,title:'أرقام القواعد'},
    {title:'مختبر مصغّر: رتّب مراحل التبعيد',widget:(el,B)=>DCML.order(el,B,{intro:'الكتاب يرسم الطبعة على ثلاث مراحل (ص 16). رتّب العمل من البداية.',steps:[
     ['ارسم حواف القطعة بالخطوط الكاملة العريضة','الحواف أولاً: «بعد رسم حواف القطعة بالخطوط الكاملة العريضة…».'],
     ['ارسم الخطوط المساعدة (خطوط الإسناد) رفيعة وعمودية على الحواف','الخطوط المساعدة تحدد بداية البعد ونهايته، فترسم قبل خطوط الأبعاد.'],
     ['ارسم خطوط الأبعاد وأسهمها المصمتة','خطوط الأبعاد بين الخطوط المساعدة، وتنتهي بأسهم عندها.'],
     ['اكتب الأرقام في فراغ كتابة الأبعاد','الأرقام آخر مرحلة: «الأبعاد كاملة».']]})},
    {title:'تحقق سريع: قواعد الأبعاد',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['يبعد خط البعد عن حافة الشكل نحو <span class="ltr">8 mm</span>.',true,'نص الكتاب (ص 16).'],
     ['تجوز الأسهم المفتوحة إذا كان المكان ضيقاً.',false,'«يجب رسم أسهم الأبعاد مصمتة»؛ وفي المكان الضيق توضع خطوط الأبعاد (الأسهم) خارج الخطوط المساعدة.'],
     ['الرقم المكتوب على بعد رأسي يقرأ من جهة اليمين.',true,'«ويجب أن يمكن قراءة الأرقام والكتابة المدونة على الرسم من أسفل أو من جهة اليمين».'],
     ['يستحسن أن تتقاطع الخطوط المساعدة لتوفير المكان.',false,'«ويراعى بقدر الإمكان ألا يكون هناك تقاطعات بين الخطوط المساعدة».']]})}
   ]},

  {recap:[
   'يجب أن يحتوي الرسم على جميع الأبعاد اللازمة لإنتاج المشغولة، دون أي بعد غير ضروري؛ ولا يكتب البعد أكثر من مرة (في الطبعة: g, h, i زائدة).',
   'المراحل: حواف بخط كامل عريض، ثم خطوط مساعدة كاملة رفيعة عمودية على الحافة (لا تقل عن 10 mm)، ثم خطوط أبعاد كاملة رفيعة موازية للحافة تنتهي بأسهم مصمتة، ثم الأرقام.',
   'خط البعد على نحو 8 mm من الحافة، وبين خطي بعدين متوازيين 5 mm على الأقل، وارتفاع الأرقام نحو 4 mm، والأرقام تقرأ من أسفل أو من جهة اليمين.',
   'في المكان الضيق توضع خطوط الأبعاد خارج الخطوط المساعدة، والأرقام فوق بعضها تكتب مرحلة (مزاحة).']}
],
 theory:[
  {h:'١-٣ مبادئ وضع الأبعاد',ref:'ص 15',html:`<p>«يجب أن يحتوي الرسم الفني على جميع الأبعاد اللازمة لإنتاج المشغولة».</p>
   <p><b>مثال:</b> «المطلوب صنع طبعة (شابلونة) كالموضحة بالشكل من خامة ثخانتها <span class="ltr">3 mm</span>، ولذا يجب أولاً معرفة البعدين الخارجيين للقطعة <span class="ltr">a, b</span>، وبعد ذلك يلزم تحديد البعد <span class="ltr">c</span> الذي يعين الحد المائل، ثم الأبعاد <span class="ltr">d, e, f</span> التي تعين مكان الجزء المقطوع، فإذا كانت الثخانة معلومة فإن شكل القطعة يكون قد تحدد تماماً».</p>`},
  {fig:'',ref:'ص 15',caption:'الطبعة بالأبعاد اللازمة فقط: <span class="ltr">a, b, c, d, e, f</span> والثخانة',draw:()=>wrap(tplSVG({keys:['c','f','a','d','e','b'],letters:1}),440)},
  {html:`<p>«ويراعى عدم وضع أية أبعاد غير ضرورية لتحديد شكل القطعة. يمكن استنتاج البعد <span class="ltr">h</span> من البعدين <span class="ltr">a, c</span>، والبعد <span class="ltr">g</span> من الأبعاد <span class="ltr">b, d, e</span>، كما أن البعد <span class="ltr">i</span> يساوي البعد <span class="ltr">e</span>. ونظراً لأنه لا يجوز كتابة الأبعاد أكثر من مرة واحدة في الرسم فإنه ينبغي في هذه الحالة عدم وضع الأبعاد <span class="ltr">g, h, i</span>».</p>`},
  {fig:'',ref:'ص 15',caption:'الطبعة نفسها مع الأبعاد الزائدة المعلَّمة بعلامة استفهام: <span class="ltr">h ?</span> و<span class="ltr">g ?</span> و<span class="ltr">i ?</span>',draw:()=>wrap(tplSVG({keys:['c','h','f','a','d','e','g','b','i'],letters:1,q:['g','h','i']}),440)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> بأرقام ص 16: <span class="ltr">h = a − c = 50 − 15 = 35</span>، و<span class="ltr">g = b − d − e = 25 − 5 − 10 = 10</span>، و<span class="ltr">i = e = 10</span>. كل منها يحسب من أبعاد مكتوبة، فلو كتبناه لصار البعد مكرراً، ولو تغيّر أحدها عند التعديل لتناقض الرسم.'},
  {err:'في الكتاب (ص 15): «يمكن استنتاج <b>الشكل b</b> من البعدين <span class="ltr">a, c</span>» والمقصود <b>البعد h</b> (لأن <span class="ltr">h = a − c</span>)، فالبعد <span class="ltr">b</span> بعد أساسي لا يستنتج؛ كتبناها «البعد h». وكتبت «الثخانة» في الشكلين «الشخانة».'},
  {h:'١-٤ قواعد وضع الأبعاد للمشغولات المسطحة',ref:'ص 16',html:`<p>«بعد رسم حواف القطعة بالخطوط الكاملة العريضة يتم رسم <b>الخطوط المساعدة</b> لتحديد الأبعاد، وهي خطوط كاملة رفيعة تبدأ عند الحافة الظاهرة وترسم عمودية على الحافة المراد وضع بعدها. وفي حالة كتابة بعد واحد ينبغي ألا يقل طول الخطوط المساعدة لتحديد الأبعاد عن <span class="ltr">10 mm</span>، وتكون أطول من ذلك في حالة كتابة بعدين أو أكثر فوق بعضها. وترسم <b>خطوط الأبعاد</b> وهي خطوط كاملة رفيعة بين خطوط الأبعاد المساعدة وموازية للحافة المراد وضع البعد عليها، وتنتهي بأسهم عند خطوط تحديد الأبعاد. ويجب أن تبعد خطوط الأبعاد عن حواف الشكل <span class="ltr">8 mm</span> تقريباً. وعند وجود خطوط أبعاد متوازية ينبغي ألا تقل المسافات بينها عن <span class="ltr">5 mm</span>. ولكتابة الأبعاد ينبغي ترك فراغ في منتصف خطوط الأبعاد، وتسمى هذه المسافة فراغ كتابة الأبعاد».</p>
   <p>«ويمكن في حالة ضيق المكان وضع خطوط الأبعاد خارج خطوط الأبعاد المساعدة، كما يجب رسم أسهم الأبعاد مصمتة».</p>
   <p>«وتكتب الأبعاد في فراغ كتابة الأبعاد طبقاً للكتابة القياسية (<span class="ltr">DIN 16</span>) (يكون ارتفاع الأعداد نحو <span class="ltr">4 mm</span>) لمجموعة الخطوط <span class="ltr">0.5</span>. عند كتابة بعدين أو أكثر فوق بعضها (كما في حالة البعدين <span class="ltr">25, 10</span>) يجب أن توضع الأبعاد مُرحَّلة (مزاحة) بالنسبة لبعضها».</p>
   <p>«ويراعى بقدر الإمكان ألا يكون هناك تقاطعات بين الخطوط المساعدة لتحديد الأبعاد. ويجب أن يمكن قراءة الأرقام والكتابة المدونة على الرسم من أسفل أو من جهة اليمين».</p>`},
  {fig:'',ref:'ص 16',caption:'المرحلة الأولى: خطوط الإسناد (الخطوط المساعدة) فقط',draw:()=>wrap(tplSVG({keys:['c','f','a','d','e','b'],stage:1}),440)},
  {fig:'',ref:'ص 16',caption:'المرحلة الثانية: خطوط الإسناد وخطوط الأبعاد وأسهمها (البعد 5 أسهمه من الخارج لضيق المكان)',draw:()=>wrap(tplSVG({keys:['c','f','a','d','e','b'],stage:2}),440)},
  {fig:'',ref:'ص 16',caption:'المرحلة الثالثة: الأبعاد كاملة — الأرقام الرأسية تقرأ من جهة اليمين، والرقمان 5 و10 مزاحان عن الرقم 25',draw:()=>wrap(tplSVG({keys:['c','f','a','d','e','b']}),440)},
  {err:'في الكتاب (ص 16): «عند كتابة بعدين أو أكثر <b>بعضها</b>» وتمامها «أو أكثر <b>فوق</b> بعضها»، و«مرحلة» بمعنى مزاحة (مُرحَّلة).'}
 ],
 lab:(el)=>{
  let marked=new Set(),res=null,dist=8,space=8,txt=4,solid=true;const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c6"><h2>أي الأبعاد زائدة؟ <small>مبنية على شكلي ص 15</small></h2>
    <p class="sub">الطبعة عليها تسعة أبعاد. المس خط البعد الذي تراه <b>زائداً</b> (يستنتج من أبعاد أخرى أو مكرر)، ثم «تحقّق».</p>
    <div class="dw-sheet" id="l2a"></div><div class="dw-row"><button class="btn primary" id="l2c">تحقّق</button><button class="btn" id="l2r">مسح</button><button class="btn" id="l2s">أظهر الحل</button></div><div class="dw-msg" id="l2m"></div></div>
   <div class="panel c6"><h2>مسافات خطوط الأبعاد <small>قواعد ص 16</small></h2>
    <p class="sub">حرّك المؤشرات وشاهد الأبعاد على الجانب الأيمن للطبعة (بالحجم الحقيقي بالمليمتر)، وتابع القواعد أسفل الرسم.</p>
    <div class="dw-row">${slHTML('l2d','بعد خط البعد عن حافة الشكل',2,20,0.5,dist)}${slHTML('l2p','المسافة بين خطي البعدين المتوازيين',1,15,0.5,space)}${slHTML('l2t','ارتفاع الأرقام',1.5,8,0.5,txt)}</div>
    <div class="dw-row"><span class="sub">الأسهم:</span>${segHTML('ar',[['1','مصمتة'],['0','مفتوحة']],'1')}</div>
    <div class="dw-sheet" id="l2b"></div><div class="dw-chk" id="l2k"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  const $=s=>el.querySelector(s);const ALL=['c','h','f','a','d','e','g','b','i'],ANS=['g','h','i'];
  const WHY={g:'<span class="ltr">g = b − d − e</span> (يستنتج)',h:'<span class="ltr">h = a − c</span> (يستنتج)',i:'<span class="ltr">i = e</span> (مكرر)',a:'بعد خارجي أساسي',b:'بعد خارجي أساسي',c:'يعين الحد المائل',d:'يعين مكان الجزء المقطوع',e:'يعين مكان الجزء المقطوع',f:'يعين مكان الجزء المقطوع'};
  const drawA=()=>{const cls={};ALL.forEach(k=>{if(res){const m=marked.has(k),r=ANS.includes(k);cls[k]=m===r?(m?'good':''):'bad'}else if(marked.has(k))cls[k]='hi'});
    $('#l2a').innerHTML=tplSVG({keys:ALL,letters:1,cls,hit:1,q:res?[]:[...marked],s:5});
    $('#l2m').className='dw-msg'+(res?(res.ok?' ok':' bad'):'');$('#l2m').innerHTML=res?(res.ok?'<b>صحيح.</b> الأبعاد الزائدة <span class="ltr">g, h, i</span>: ':'<b>راجع اختيارك.</b> الأحمر خطأ: ')+ALL.filter(k=>marked.has(k)||ANS.includes(k)).map(k=>`<span class="ltr">${k}</span>: ${WHY[k]}`).join('، ')+'. «لا يجوز كتابة الأبعاد أكثر من مرة واحدة في الرسم» (ص 15).':(marked.size?'اخترت: '+[...marked].map(k=>`<span class="ltr">${k}</span>`).join('، '):'')};
  $('#l2a').addEventListener('click',e=>{const t=e.target.closest('[data-k]');if(!t)return;const k=t.dataset.k;res=null;marked.has(k)?marked.delete(k):marked.add(k);drawA()});
  $('#l2c').onclick=()=>{res={ok:ANS.every(k=>marked.has(k))&&marked.size===3};if(res.ok)did.ok=1;drawA()};
  $('#l2r').onclick=()=>{marked.clear();res=null;drawA()};$('#l2s').onclick=()=>{marked=new Set(ANS);res={ok:true};drawA()};
  const drawB=()=>{const s=4.4,pad=10,ext=dist+space+txt+6;const W=(50+pad+ext+6)*s,H=(25+2*pad)*s;const T=q=>[(q[0]+pad)*s,(q[1]+pad)*s];
    let h=svgOpen(W,H,'مسافات خطوط الأبعاد')+plyl(TPL.map(T),'vl',true,' style="fill:var(--surface-2)"');
    const ah=(tip,dir)=>solid?arrowHead(tip,dir,9):(()=>{const [dx,dy]=dir,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,sz=9,w=3;return `<path class="dm" d="M${f2(tip[0]-ux*sz-uy*w)} ${f2(tip[1]-uy*sz+ux*w)}L${f2(tip[0])} ${f2(tip[1])}L${f2(tip[0]-ux*sz+uy*w)} ${f2(tip[1]-uy*sz-ux*w)}"/>`})();
    const vdim=(v0,v1,u,t,tv)=>{const a=T([u,v0]),b=T([u,v1]);return ln(a,b,'dm')+ah(a,[0,1])+ah(b,[0,-1])+`<text x="${f2(a[0]-1.2*s)}" y="${f2(T([0,tv])[1])}" class="dt" text-anchor="middle" transform="rotate(-90 ${f2(a[0]-1.2*s)} ${f2(T([0,tv])[1])})" style="font-size:${f2(txt*s)}px">${t}</text>`};
    [[25],[20],[10],[0]].forEach(([v])=>h+=ln(T([50+1,v]),T([50+dist+space+2,v]),'dm'));
    h+=vdim(20,10,50+dist,'10',15)+vdim(25,20,50+dist,'5',22.5)+vdim(25,0,50+dist+space,'25',9);
    h+=ln(T([50,-4]),T([50+dist,-4]),'pjd')+tx(...T([50+dist/2,-5.5]),f2(dist),'dt lv','middle')+ln(T([50+dist,-2]),T([50+dist+space,-2]),'pjd')+tx(...T([50+dist+space/2,-0.5]),f2(space),'dt lv','middle');
    $('#l2b').innerHTML=h+'</svg>';
    const ok1=Math.abs(dist-8)<=2,ok2=space>=5,ok3=Math.abs(txt-4)<=0.75;$('#l2d-v').textContent=fm(dist,1)+' mm';$('#l2p-v').textContent=fm(space,1)+' mm';$('#l2t-v').textContent=fm(txt,1)+' mm';
    $('#l2k').innerHTML=[[ok1,`يبعد خط البعد عن حافة الشكل نحو <span class="ltr">8 mm</span> (الآن <span class="ltr">${fm(dist,1)} mm</span>)`],[ok2,`المسافة بين خطوط الأبعاد المتوازية لا تقل عن <span class="ltr">5 mm</span> (الآن <span class="ltr">${fm(space,1)} mm</span>)`],[ok3,`ارتفاع الأعداد نحو <span class="ltr">4 mm</span> (الآن <span class="ltr">${fm(txt,1)} mm</span>)`],[solid,'أسهم الأبعاد مصمتة'],[true,'الأرقام الرأسية تقرأ من جهة اليمين، والرقمان 5 و10 مزاحان عن 25']].map(([k,t])=>`<div class="${k?'ok':'no'}"><i>${k?'✓':'✗'}</i><span>${t}</span></div>`).join('')};
  const bindSl=(id,fn)=>{$('#'+id).oninput=e=>{fn(+e.target.value);drawB()}};
  bindSl('l2d',v=>{dist=v;did.d=1});bindSl('l2p',v=>{space=v;did.p=1});bindSl('l2t',v=>{txt=v});segBind(el,'ar',v=>{solid=v==='1';if(!solid)did.open=1;drawB()});
  const st=stepsUI($('#l2st'),[
   {t:'ابحث عن الأبعاد الزائدة',x:'في اللوحة الأولى المس الأبعاد الثلاثة التي تستنتج من غيرها، ثم «تحقّق» حتى تصبح الإجابة صحيحة.',done:()=>did.ok},
   {t:'خط بعد ملاصق للشكل',x:'في اللوحة الثانية اجعل بعد خط البعد عن الحافة <span class="ltr">3 mm</span>: يزدحم الرسم وتظهر علامة ✗.',done:()=>dist<=3},
   {t:'أعده إلى القاعدة',x:'أرجع البعد إلى <span class="ltr">8 mm</span> تقريباً (بين 6 و10).',done:()=>did.d&&Math.abs(dist-8)<=2&&dist>3},
   {t:'خطان متلاصقان',x:'اجعل المسافة بين خطي البعدين أقل من <span class="ltr">5 mm</span> ولاحظ تداخل الأرقام، ثم أرجعها إلى <span class="ltr">5 mm</span> أو أكثر.',done:()=>did.p&&space>=5&&did.p2},
   {t:'الأسهم',x:'جرّب «مفتوحة» ثم أرجعها «مصمتة» كما يشترط الكتاب.',done:()=>did.open&&solid}]);
  $('#l2p').addEventListener('input',()=>{if(space<5)did.p2=1});
  drawA();drawB();loopOn(el,()=>st.check())},
 examples:[
  drawnEx('تبعيد الطبعة على ثلاث مراحل','ص 16',`<p>ضع أبعاد الطبعة (ثخانتها <span class="ltr">3 mm</span>): الطول <span class="ltr">50</span>، والارتفاع <span class="ltr">25</span>، وبداية الضلع العلوي على بعد <span class="ltr">15</span> من الركن الأيسر، ومجرى عمقه <span class="ltr">13</span> وارتفاعه <span class="ltr">10</span> يبعد <span class="ltr">5</span> عن الحافة السفلى.</p>`,[
   ['ارسم حواف القطعة بالخطوط الكاملة العريضة.',tplSVG({keys:[]})],
   ['ارسم خطوط الإسناد (الخطوط المساعدة): رفيعة، تبدأ عند الحافة الظاهرة، عمودية على الحافة المراد وضع بعدها. لاحظ الخط الصاعد من قاع المجرى ليحدد البعد 13.',tplSVG({keys:['c','f','a','d','e','b'],stage:1})],
   ['ارسم خطوط الأبعاد موازية للحواف على بعد نحو <span class="ltr">8 mm</span> منها، وتنتهي بأسهم مصمتة. خط البعد الكلي للارتفاع يبعد <span class="ltr">5 mm</span> على الأقل عن الخط الداخلي، وأسهم البعد 5 من الخارج لضيق المكان.',tplSVG({keys:['c','f','a','d','e','b'],stage:2})],
   ['اكتب الأرقام في منتصف خطوط الأبعاد بارتفاع نحو <span class="ltr">4 mm</span>: الأفقية تقرأ من أسفل والرأسية من جهة اليمين، والرقمان 5 و10 مزاحان عن الرقم 25.',tplSVG({keys:['c','f','a','d','e','b']})]
  ]),
  drawnEx('حذف الأبعاد الزائدة','ص 15',`<p>رُسمت الطبعة نفسها بتسعة أبعاد. أي الأبعاد يجب حذفها، ولماذا؟</p>`,[
   ['الرسم بكل الأبعاد: <span class="ltr">a … i</span>.',tplSVG({keys:['c','h','f','a','d','e','g','b','i'],letters:1})],
   ['البعد <span class="ltr">h</span> = <span class="ltr">a − c</span>: يستنتج من بعدين مكتوبين ← يحذف.',tplSVG({keys:['c','h','f','a','d','e','g','b','i'],letters:1,q:['h'],cls:{h:'bad'}})],
   ['البعد <span class="ltr">g</span> = <span class="ltr">b − d − e</span> ← يحذف. والبعد <span class="ltr">i</span> يساوي <span class="ltr">e</span> (مكرر) ← يحذف.',tplSVG({keys:['c','h','f','a','d','e','g','b','i'],letters:1,q:['h','g','i'],cls:{h:'bad',g:'bad',i:'bad'}})],
   ['يبقى <span class="ltr">a, b, c, d, e, f</span> مع الثخانة: تحدد شكل القطعة تماماً، ولا يكتب أي بعد أكثر من مرة.',tplSVG({keys:['c','f','a','d','e','b'],letters:1})]
  ])
 ],
 quiz:[
  {q:'ما الأبعاد التي يجب ألا توضع على طبعة ص 15؟',o:['a, b, c','d, e, f','g, h, i','a, e, i'],c:2,e:'h تستنتج من a وc، وg من b وd وe، وi تساوي e (ص 15).'},
  {q:'كم يبعد خط البعد عن حافة الشكل تقريباً؟',o:['2 mm','5 mm','8 mm','15 mm'],c:2,e:'ص 16: «يجب أن تبعد خطوط الأبعاد عن حواف الشكل 8 mm تقريباً».'},
  {q:'أقل مسافة بين خطي بعدين متوازيين:',o:['2 mm','5 mm','8 mm','10 mm'],c:1,e:'ص 16.'},
  {q:'الخطوط المساعدة لتحديد الأبعاد:',o:['خطوط كاملة عريضة','خطوط متقطعة','خطوط كاملة رفيعة تبدأ عند الحافة الظاهرة عمودية عليها','خطوط شرطة ونقطة'],c:2,e:'ص 16.'},
  {q:'من أي جهة يجب أن تقرأ الأرقام المكتوبة على الرسم؟',o:['من أعلى أو من اليسار','من أسفل أو من جهة اليمين','من أي جهة','من اليسار فقط'],c:1,e:'ص 16.'},
  {q:'إذا ضاق المكان بين خطي الإسناد فإن:',o:['نحذف البعد','نكتب البعد مرتين','نضع خطوط الأبعاد (الأسهم) خارج خطوط الأبعاد المساعدة','نرسم الأسهم مفتوحة'],c:2,e:'ص 16، كما في البعد 5 في الشكل الثالث.'}
 ]
});

/* =====================================================================
   PICTORIAL (static SVG) — engine edges for a view direction; hidden edges dashed as in the book's pictorials
   o: {az,el,px,hidden:true,pts:true|[keys],arrows:[{from,to,t,ar}],planes:[[p3,...]],extra:fn(pr)}
   ===================================================================== */
function pictSVG(P,o){o=o||{};const az=(o.az!=null?o.az:-35)*Math.PI/180,el=(o.el!=null?o.el:24)*Math.PI/180;const v=[Math.sin(az)*Math.cos(el),Math.cos(az)*Math.cos(el),Math.sin(el)];
  const r=ENG.nrm(ENG.crs([0,0,1],ENG.mul(v,-1))),up=ENG.crs(ENG.mul(v,-1),r);const pr0=p=>[ENG.d3(p,r),-ENG.d3(p,up)];
  const L=ENG.lines3(P,v);const pts=[];P.edges.forEach(e=>{pts.push(pr0(e[0]),pr0(e[1]))});(o.planes||[]).forEach(pl=>pl.forEach(p=>pts.push(pr0(p))));(o.arrows||[]).forEach(a=>{pts.push(pr0(a.from),pr0(a.to))});
  const x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=Math.max(...pts.map(p=>p[1]));
  const m=o.m!=null?o.m:22,px=o.px||300,s=(px-2*m)/Math.max(1e-6,x1-x0),H=(y1-y0)*s+2*m;const pr=p=>{const q=pr0(p);return [(q[0]-x0)*s+m,(q[1]-y0)*s+m]};
  let h=svgOpen(px,H,o.aria||('منظور '+(P.name||'')));
  (o.planes||[]).forEach(pl=>h+=plyl(pl.map(pr),'tn',true,' style="fill:var(--blue-soft);fill-opacity:.55"'));
  if(o.faces)o.faces.forEach(f=>h+=plyl(f.map(pr),'',true,' style="fill:var(--surface-2);stroke:none"'));
  if(o.hidden!==false)L.forEach(l=>{if(l.t==='h')h+=hidLn(pr(l.a),pr(l.b),{d:4,g:2.6})});
  L.forEach(l=>{if(l.t==='v')h+=ln(pr(l.a),pr(l.b),'vl')});
  (o.arrows||[]).forEach(a=>{const A=pr(a.from),Bp=pr(a.to);h+=`<line x1="${f2(A[0])}" y1="${f2(A[1])}" x2="${f2(Bp[0])}" y2="${f2(Bp[1])}" style="stroke:var(--live);stroke-width:4"/>`+arrowHead(Bp,[Bp[0]-A[0],Bp[1]-A[1]],13).replace('class="ar"','style="fill:var(--live)"');
    const dx=A[0]-Bp[0],dy=A[1]-Bp[1],l=Math.hypot(dx,dy)||1;const tp=[A[0]+dx/l*12,A[1]+dy/l*12+4];h+=tx(tp[0],tp[1],a.t,'dt lv','middle',0,' style="font-size:14px;font-weight:700"');if(a.ar)h+=tAr(tp[0],tp[1]+15,a.ar,null,'lb','middle')});
  if(o.pts&&P.pts){Object.keys(P.pts).filter(k=>o.pts===true||o.pts.includes(k)).forEach(k=>{const p=pr(P.pts[k]);const c=pr([(P.bb[0]+P.bb[1])/2,(P.bb[2]+P.bb[3])/2,(P.bb[4]+P.bb[5])/2]);const dx=p[0]-c[0],dy=p[1]-c[1],l=Math.hypot(dx,dy)||1;
    h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="2.4" class="pt"/>`+tx(p[0]+dx/l*10,p[1]+dy/l*10+4,k,'pn','middle')})}
  if(o.extra)h+=o.extra(pr);
  return h+'</svg>'}
/* the projection planes of ص 19 (first angle: the object lies between the viewer and each plane) */
const planesFor=(P,m)=>{const [x0,x1,y0,y1,z0,z1]=P.bb;m=m||0.35*Math.max(P.W,P.D,P.H);return [
  [[x0-m*0.4,y0-m,z0-m*0.3],[x1+m*1.2,y0-m,z0-m*0.3],[x1+m*1.2,y0-m,z1+m*0.4],[x0-m*0.4,y0-m,z1+m*0.4]],
  [[x1+m,y0-m,z0-m*0.3],[x1+m,y1+m*0.6,z0-m*0.3],[x1+m,y1+m*0.6,z1+m*0.4],[x1+m,y0-m,z1+m*0.4]],
  [[x0-m*0.4,y0-m,z0-m],[x1+m,y0-m,z0-m],[x1+m,y1+m*0.6,z0-m],[x0-m*0.4,y1+m*0.6,z0-m]]]};
const stdArrows=(P,k)=>{const [x0,x1,y0,y1,z0,z1]=P.bb,c=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],m=k||0.55*Math.max(P.W,P.D,P.H);return [
  {from:[c[0],y1+m,c[2]],to:[c[0],y1+m*0.2,c[2]],t:'E',ar:'رأسي'},{from:[x0-m,c[1],c[2]],to:[x0-m*0.2,c[1],c[2]],t:'S',ar:'جانبي'},{from:[c[0],c[1],z1+m],to:[c[0],c[1],z1+m*0.2],t:'P',ar:'أفقي'}]};

/* ---------- isometric / dimetric cubes of ص 17 ---------- */
function axoCube(kind){const W=230,H=236;let h=svgOpen(W,H,kind==='iso'?'منظور متساوي القياس':'منظور ثنائي القياس');const a=kind==='iso'?[30,30]:[7,42],k=kind==='iso'?[1,1,1]:[1,1,0.5],L=78;
  const o=[kind==='iso'?115:150,200];const ux=[Math.cos(a[0]*Math.PI/180)*L*k[1]*-1,-Math.sin(a[0]*Math.PI/180)*L*k[1]],uy=[Math.cos(a[1]*Math.PI/180)*L*k[2],-Math.sin(a[1]*Math.PI/180)*L*k[2]],uz=[0,-L*k[0]];
  /* b along the left axis (α), c along the right axis (β), a vertical */
  const P_=(i,j,l)=>[o[0]+ux[0]*i+uy[0]*j+uz[0]*l,o[1]+ux[1]*i+uy[1]*j+uz[1]*l];
  const E=[[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[0,1,0],[0,1,1]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]]];
  E.forEach(([p,q])=>h+=ln(P_(...p),P_(...q),'vl'));
  h+=ln([o[0]-60,o[1]],[o[0]+70,o[1]],'tn',' stroke-dasharray="3 3"');
  h+=tx(...[P_(0,0,0.5)[0]-6,P_(0,0,0.5)[1]],'a','dt','end')+tx(...[P_(0.8,0,0)[0],P_(0.8,0,0)[1]+15],'b','dt','middle')+tx(...[P_(0,0.8,0)[0],P_(0,0.8,0)[1]+15],'c','dt','middle');
  const arc=(ang,dir,lab)=>{const r=26,pts=[];for(let i=0;i<=10;i++){const t=ang*i/10*Math.PI/180;pts.push([o[0]+dir*r*Math.cos(t),o[1]-r*Math.sin(t)])}const t2=Math.max(ang/2,8)*Math.PI/180;return plyl(pts,'dm')+tx(o[0]+dir*(r+9)*Math.cos(t2),o[1]-(r+9)*Math.sin(t2)+4,lab,'dt','middle')};
  h+=arc(a[0],-1,'α')+arc(a[1],1,'β');
  h+=tx(W/2,15,kind==='iso'?'α = β = 30°':'α = 7°, β = 42°','dt','middle')+tx(W/2,31,kind==='iso'?'a : b : c = 1 : 1 : 1':'a : b : c = 1 : 1 : ½','dt','middle');
  return h+'</svg>'}

/* =====================================================================
   PROJECTION GENERATOR (lab of u1-l3, reused in u1-l6)
   ===================================================================== */
function genLab(el,cfg){
  let pk=cfg.parts[0],showH=true,cl=true,nums=true,az=-35,ev=24,last='';const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c7"><h2>${cfg.title} <small>${cfg.ref}</small></h2>
    <div class="dw-row">${segHTML('gp',cfg.parts.map(k=>[k,PDEF[k].name]),pk)}</div>
    <div id="${cfg.id}v"></div>
    <div class="dw-row"><span class="sub">انظر إليه:</span>${segHTML('gv',[['iso','منظور'],['F','من الأمام E'],['S','من اليسار S'],['T','من أعلى P']],'iso')}</div>
    <div class="dw-row"><span class="sub">الحواف المختفية في المنظور:</span>${segHTML('gh',[['1','إظهار (متقطعة)'],['0','إخفاء']],'1')}</div></div>
   <div class="panel c5"><h2>المساقط الثلاثة <small>ترتيبها حسب ص 18</small></h2>
    <div class="dw-sheet" id="${cfg.id}s"></div>
    <div class="dw-row"><span class="sub">خطوط المنتصف:</span>${segHTML('gc',[['1','إظهار'],['0','إخفاء']],'1')}</div>
    <div class="facts" id="${cfg.id}f"></div><div class="dw-msg" id="${cfg.id}m"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${cfg.id}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const V=viewer3D($('#'+cfg.id+'v'),{part:getP(pk),az,el:ev,onChange:s=>{az=s.az;ev=s.el;if(s.user)did.drag=(did.drag||0)+1}});
  const PRE={iso:[-35,24],F:[0,0],S:[-90,0],T:[0,89]};
  const drawS=()=>{const P=getP(pk);const {svg,C}=sheetSVG(P,{px:420,labels:1,cl,pts:nums&&P.pts?true:false,mark:C=>['F','S','T'].map(k=>{const [w,h]=C.size(k),a=C.T(k)([0,0]),b=C.T(k)([w,h]);return `<rect x="${f2(a[0]-4)}" y="${f2(a[1]-4)}" width="${f2(b[0]-a[0]+8)}" height="${f2(b[1]-a[1]+8)}" data-v="${k}" style="fill:transparent;cursor:pointer${last===k?';stroke:var(--live);stroke-width:2;stroke-dasharray:5 4':''}"/>`}).join('')});
    $('#'+cfg.id+'s').innerHTML=svg;const cnt=k=>ENG.view(P,k).filter(s=>s.t==='h').length;
    $('#'+cfg.id+'f').innerHTML=['F','S','T'].map(k=>`<div class="fact"><span>خطوط متقطعة في ${VNAME[k]}</span><b>${cnt(k)}</b></div>`).join('');
    const d=PDEF[pk];$('#'+cfg.id+'m').innerHTML=`<b>${d.name}</b> <span class="ref">${d.ref}</span> ${d.illus?'— الأبعاد للتوضيح (الكتاب يرسم الجسم بلا أرقام). ':'— بأبعاد لوحة الكتاب. '}${cfg.msg?cfg.msg(pk):''} المس أي مسقط ليدور الجسم أمامك إلى اتجاه النظر الخاص به.`};
  segBind(el,'gp',k=>{pk=k;did.parts=did.parts||new Set();did.parts.add(k);V.set(getP(pk));drawS()});
  segBind(el,'gv',k=>{last=k==='iso'?'':k;did['v'+k]=1;V.goto(...PRE[k]);drawS()});
  segBind(el,'gh',v=>{showH=v==='1';if(!showH)did.hid=1;V.hidden(showH)});
  segBind(el,'gc',v=>{cl=v==='1';drawS()});
  $('#'+cfg.id+'s').addEventListener('click',e=>{const r=e.target.closest('[data-v]');if(!r)return;const k=r.dataset.v;last=k;did['v'+k]=1;el.querySelectorAll('[data-gv]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.gv===k)));V.goto(...PRE[k]);drawS()});
  const st=stepsUI($('#'+cfg.id+'st'),cfg.steps(()=>({pk,did,showH,az,ev})));
  drawS();loopOn(el,()=>st.check())}

/* =====================================================================
   LESSON 3 — المساقط والتمثيل بثلاثة مساقط (ص 17–20)
   ===================================================================== */
B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'17–20',
 title:'المساقط والتمثيل بثلاثة مساقط',
 summary:'المنظور (الأيزومتري أو الديمتري) يعطي نظرة عامة، أما الرسومات التشغيلية فتستعمل المساقط المنفصلة: المسقط الرأسي، والمسقط الجانبي (بالنظر من اليسار) على يمينه، والمسقط الأفقي (بالنظر من أعلى) أسفله تماماً.',
 stations:[
  {intro:true},

  {st:1,short:'مساقط المشغولات',title:'١-٥ مساقط المشغولات',ref:'ص 17–18',
   q:'صورة منظورة جميلة للقطعة تبين شكلها… فلماذا لا تكفي الفني ليصنعها؟',
   get art(){const P=getP('box');const a=DWS.fit(v=>pictSVG(P,{px:v,arrows:stdArrows(P),m:Math.round(v*0.13)}),14,40,170,236);
     const shf=v=>sheetSVG(P,{px:v,labels:1,cl:false,mark:C=>{let h='';const F=C.T('F'),S=C.T('S'),T=C.T('T');[0,P.H].forEach(v=>h+=ln(F([P.W+1,v]),S([-1,v]),'tn',' stroke-dasharray="2 3"'));[0,P.W].forEach(u=>h+=ln(F([u,P.H+1]),T([u,-1]),'tn',' stroke-dasharray="2 3"'));return h}});
     const b=DWS.fit(v=>shf(v).svg,190,56,160,214);const C=shf(b.px).C,M=q=>b.M(q);const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t='';t+=DWS.tipR(M,...box('F'),'المسقط الرأسي: ما يراه الناظر في اتجاه السهم ⟦E⟧ (من الأمام).',2)+DWS.tipR(M,...box('S'),'المسقط الجانبي: بالنظر من الجهة اليسرى (السهم ⟦S⟧)، ويرسم على يمين المسقط الرأسي وعلى مستواه الأفقي نفسه.',2)+DWS.tipR(M,...box('T'),'المسقط الأفقي: بالنظر من أعلى (السهم ⟦P⟧)، ويرسم أسفل المسقط الرأسي تماماً.',2);
     t+=DWS.tip(14,40,170,236,'المنظور: يعطي نظرة عامة على الجسم. الأسهم ⟦E⟧ و⟦S⟧ و⟦P⟧ اتجاهات النظر للمساقط الثلاثة.');
     return DWS.art('الجسم منظوراً واتجاهات النظر، وترتيب المساقط الثلاثة',a.g+b.g+t)},
   cap:'اتجاهات النظر <span class="ltr">E</span> و<span class="ltr">S</span> و<span class="ltr">P</span>، وترتيب المساقط الثلاثة (شكل ص 18).<br><b>مرّر المؤشر على المنظور وعلى كل مسقط (أو المسه في الجوال) لتعرف اتجاه نظره ومكانه.</b>',
   side:[
    {predict:{q:'بتحديد المسقط الرأسي، أين يرسم المسقط الجانبي (بالنظر من الجهة اليسرى)؟',opts:[
     ['على يسار المسقط الرأسي',false,'هذا ما يتوقعه كثيرون، لكن الكتاب (DIN 6) يرسمه على الجانب الآخر.'],
     ['على الجانب الأيمن للمسقط الرأسي وعلى مستواه الأفقي نفسه',true,'الكتاب (ص 18): «يرسم المسقط الجانبي (بالنظر من الجهة اليسرى) على الجانب الأيمن للمسقط الرأسي».'],
     ['أسفل المسقط الرأسي',false,'أسفل المسقط الرأسي مكان المسقط الأفقي.']]}}
   ],
   body:[
    {book:`<p>يمكن تمثيل جسم ما في مسقط واحد. وتحتوي المواصفات (<span class="ltr">DIN 5</span>) على القواعد القياسية لرسم مثل هذه الرسومات التوضيحية.</p>`,ref:'ص 17'},
    {get html(){return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;max-width:520px;margin:6px auto 10px">${[['iso','(أ) منظور متساوي القياس (أيزومتري)'],['di','(ب) منظور ثنائي القياس (مائل) (ديمتري)']].map(([k,t])=>`<figure style="margin:0">${wrap(axoCube(k),230)}<figcaption class="sub" style="text-align:center">${t} — ص 17</figcaption></figure>`).join('')}</div>`}},
    {book:`<p>يعطي المنظور ثنائي القياس على النقيض من المنظور متساوي القياس أفضلية لإظهار أحد جوانب الجسم. وتختار هذه الطريقة إذا ما احتوى أحد جوانب الجسم على عدد كبير من التفاصيل المراد إيضاحها. إلا أنه ليس من المعتاد استخدام هذين النوعين من التمثيل كرسومات. ويستخدم أحد المنظورين الأيزومتري أو الديمتري في الرسم لإعطاء نظرة عامة على مشغولة أو جهاز ما.<br>أما بالنسبة للرسومات التشغيلية فتختار عامة المساقط المنفصلة كوسيلة مناسبة لتمثيل الأجسام.</p>
     <p>وطبقاً للمواصفات (<span class="ltr">DIN 6</span>) ينبغي رسم عدد من المساقط المنفصلة تكفي لتحديد شكل القطعة تماماً. وغالباً ما يكفي التمثيل بثلاثة مساقط منفصلة لتحديد شكل القطعة. وإذا أمكن تحديد شكل القطعة تماماً بمسقطين أو بمسقط واحد فإننا نكتفي بهذه المساقط فقط، على أنه رغم ذلك سيطلب في تلك الحالات أيضاً رسم ثلاثة مساقط بهدف التدريب.</p>
     <p>في هذا النوع من التمثيل ينبغي التقيد بأوضاع المساقط بالنسبة لبعضها البعض.<br>وبتحديد المسقط الرأسي، يرسم المسقط الجانبي (بالنظر من الجهة اليسرى) على الجانب الأيمن للمسقط الرأسي كما يرسم المسقط الأفقي (بالنظر من أعلى) أسفل المسقط الرأسي.<br>ويجب أن يكون المسقط الجانبي على نفس المستوى الأفقي للمسقط الرأسي، وأن يقع المسقط الأفقي أسفل المسقط الرأسي تماماً (انظر الخطوط المنقطة).</p>`,ref:'ص 17–18'},
    {tip:`<p>في المنظور <b>الأيزومتري</b> تميل الحافتان السفليتان بزاوية <span class="ltr">30°</span> على الجانبين، والأضلاع بنسبة <span class="ltr">1 : 1 : 1</span>. وفي <b>الديمتري</b> زاويتان <span class="ltr">7°</span> و<span class="ltr">42°</span> والعمق بنصف طوله، فيظهر الوجه الأمامي كبيراً واضحاً. لكن المنظور يشوّه الأطوال والزوايا، فلا يصنع منه الفني؛ لذلك تستعمل في الرسومات التشغيلية <b>المساقط المنفصلة</b>.</p>`,title:'المنظور للنظرة العامة، والمساقط للتصنيع'},
    {tip:`<p>لأن المسقط الجانبي نراه من اليسار ونرسمه على اليمين، تظهر <b>الجهة الخلفية</b> للجسم في الحافة اليسرى للمسقط الجانبي، وتظهر الجهة الخلفية كذلك في الحافة العليا للمسقط الأفقي. ستحتاج هذه الملاحظة في الدرس التالي (خط <span class="ltr">45°</span>). (توضيح منا.)</p>`,title:'انتبه لمكان الخلف'},
    {title:'مختبر مصغّر: ضع كل مسقط في مكانه',widget:(el,B)=>DCML.cases(el,B,{intro:'المسقط الرأسي في أعلى يسار اللوحة. أين تضع المسقطين الآخرين بحسب الكتاب (DIN 6)؟',cases:[
     {q:'المسقط الجانبي (بالنظر من الجهة اليسرى):',opts:[['على يسار المسقط الرأسي',false,'لا؛ يرسم على الجانب الأيمن رغم أن النظر من اليسار.'],['على يمين المسقط الرأسي وعلى مستواه الأفقي',true,'«ويجب أن يكون المسقط الجانبي على نفس المستوى الأفقي للمسقط الرأسي».'],['على يمين المسقط الرأسي وأعلى منه قليلاً',false,'يجب أن تكون حافتاه العليا والسفلى على امتداد حافتي المسقط الرأسي.']]},
     {q:'المسقط الأفقي (بالنظر من أعلى):',opts:[['أسفل المسقط الرأسي تماماً',true,'«وأن يقع المسقط الأفقي أسفل المسقط الرأسي تماماً».'],['فوق المسقط الرأسي',false,'يرسم أسفله لا فوقه.'],['أسفل المسقط الجانبي',false,'يقع تحت المسقط الرأسي، فتكون حافتاه اليسرى واليمنى على امتداد حافتيه.']]},
     {q:'قطعة يحدد شكلها تماماً مسقطان. ماذا يطلب منك في التدريب؟',opts:[['مسقطان فقط',false,'هذا يكفي في العمل، لكن الكتاب يطلب أكثر في التدريب.'],['ثلاثة مساقط بهدف التدريب',true,'«على أنه رغم ذلك سيطلب في تلك الحالات أيضاً رسم ثلاثة مساقط بهدف التدريب».']]}]})}
   ]},

  {st:2,short:'التمثيل بثلاثة مساقط',title:'١-٦ التمثيل في ثلاثة مساقط',ref:'ص 18–20',
   q:'ركن الجسم الأمامي والركن الذي خلفه يقعان على النقطة نفسها في المسقط… كيف نكتب رقميهما؟',
   get art(){const P=getP('box');const shf=v=>sheetSVG(P,{px:v,labels:1,pts:true,cl:false});const b=DWS.fit(v=>shf(v).svg,40,30,280,262);const C=shf(b.px).C;
     const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('F'),'المسقط الرأسي: السطح ⟦(1, 2, 3, 4)⟧ يوازي مستوى الإسقاط فيظهر بشكله الحقيقي، والسطح ⟦(5, 6, 7, 8)⟧ خلفه منطبق عليه.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي (نراه من اليسار): الركن 5 الخلفي على يساره و1 الأمامي على يمينه؛ والسطحان ⟦(5, 6, 2, 1)⟧ و⟦(8, 7, 3, 4)⟧ يظهران خطين.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي (من أعلى): الحافة العليا هي الخلف ⟦(5, 6)⟧ والسفلى هي الأمام ⟦(1, 2)⟧؛ والأرقام بين الأقواس أركان القاعدة تحتها.',0);
     const p1=C.T('F')([0,0]);t+=DWS.tip(b.M(p1)[0]-12,b.M(p1)[1]-16,30,24,'الرقم بين قوسين: «تمثل الأرقام بين الأقواس الأركان الواقعة في الخلف لكل حالة» — الركن ⟦5⟧ خلف الركن ⟦1⟧ في اتجاه النظر.');
     return DWS.art('المساقط الثلاثة لمتوازي المستطيلات بأرقام الأركان',b.g+t,'#FBE6C4')},
   cap:'المساقط الثلاثة لمتوازي المستطيلات بأرقام أركانه (شكل ص 19).<br><b>مرّر المؤشر على كل مسقط وعلى رقم بين قوسين (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'سطح يوازي مستوى الإسقاط. كيف يظهر في ذلك المسقط؟',opts:[
     ['خطاً مستقيماً',false,'السطح يظهر خطاً إذا كان <b>عمودياً</b> على مستوى الإسقاط.'],
     ['بشكله الحقيقي، وبأبعاده الحقيقية بالمقياس <span class="ltr">1:1</span>',true,'الكتاب (ص 19): «تظهر سطوح الأجسام التي تقع موازية لمستوى الإسقاط مماثلة لشكلها الحقيقي في ذلك المسقط».'],
     ['أصغر من حقيقته دائماً',false,'التقصير يحدث للسطوح المائلة على مستوى الإسقاط، لا الموازية له.']]}}
   ],
   body:[
    {book:`<p>تتعامد مستويات الإسقاط (الرأسي والجانبي والأفقي) على بعضها.<br>وفي التمثيل بثلاثة مساقط يمثل كل مسقط كما لو نظر الإنسان إلى كل نقطة من نقط مستوى الإسقاط في اتجاه عمودي. وتبعاً لذلك تقع السطوح الخلفية في الأجسام الموشورية التي تكون سطوحها متعامدة (كعلبة الثقاب مثلاً) خلف سطوح الإسقاط المناظرة الظاهرة، كما تنطبق حواف الجسم المتقابلة على بعضها.</p>`,ref:'ص 18'},
    {get html(){return `<figure style="margin:6px auto 10px;max-width:420px">${wrap(pictSVG(getP('box'),{px:340,planes:planesFor(getP('box')),pts:true,arrows:stdArrows(getP('box'),1.2*Math.max(getP('box').W,getP('box').D,getP('box').H)),m:26}),360)}<figcaption class="sub" style="text-align:center">متوازي مستطيلات بين مستويات الإسقاط الثلاثة المتعامدة. «ترمز الأرقام إلى أركان الجسم طبقاً للمثال، وتمثل الأرقام بين الأقواس الأركان الواقعة في الخلف لكل حالة» — ص 19</figcaption></figure>`}},
    {book:`<p>تظهر سطوح الأجسام التي تقع موازية لمستوى الإسقاط مماثلة لشكلها الحقيقي في ذلك المسقط، وتبدو بأبعادها الحقيقية أيضاً لو استخدم مقياس الرسم (<span class="ltr">1:1</span>).<br>في المثال: ينطبق ذلك على السطحين (<span class="ltr">5, 6, 7, 8</span>) و(<span class="ltr">1, 2, 3, 4</span>) في المسقط الرأسي وعلى السطحين (<span class="ltr">5, 6, 2, 1</span>) و(<span class="ltr">8, 7, 3, 4</span>) في المسقط الأفقي.</p>
     <p>تظهر السطوح العمودية على مستوى الإسقاط في المسقط كحواف (خط مستقيم).<br>في المثال: ينطبق ذلك على السطحين (<span class="ltr">5, 6, 2, 1</span>) و(<span class="ltr">8, 7, 3, 4</span>) في كل من المسقط الرأسي والجانبي وعلى السطوح (<span class="ltr">5, 6, 7, 8</span>) و(<span class="ltr">1, 2, 3, 4</span>) و(<span class="ltr">5, 1, 4, 8</span>) و(<span class="ltr">2, 6, 7, 3</span>) في المسقط الأفقي.</p>`,ref:'ص 19'},
    {watch:`<p>يقول الكتاب (ص 19) عن هذا المثال: «أما في المسقط الجانبي فلا ينطبق ذلك على أي سطح»، وهذا يخالف الشكل نفسه: السطحان (<span class="ltr">5, 1, 4, 8</span>) و(<span class="ltr">6, 2, 3, 7</span>) يوازيان مستوى الإسقاط الجانبي فيظهران بشكلهما الحقيقي في المسقط الجانبي. لذلك لم ننقل هذه الجملة.</p>`,fix:true},
    {book:`<p>أما السطوح التي تصنع زاوية أقل أو أكبر من <span class="ltr">90°</span> على أحد مستويات الإسقاط فإنها لا تظهر في أي من المساقط بأبعادها الحقيقية. على أنه يمكن دائماً تحديد أبعادها الحقيقية باستخدام مسقطين.<br>في المثال يمكن استنتاج الأبعاد الحقيقية للسطح المظلل (<span class="ltr">5, 1, 8, 4</span>) مثلاً من المسقط الرأسي والجانبي (الارتفاع) ومن المسقط الأفقي (العرض).</p>`,ref:'ص 19–20'},
    {get html(){return `<figure style="margin:6px auto 10px;max-width:560px">${(()=>{const P=getP('trap');const f=[P.pts[5],P.pts[1],P.pts[4],P.pts[8]];return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;align-items:center">${wrap(pictSVG(P,{px:280,pts:true,faces:[f],arrows:[stdArrows(P)[0]],m:30}),300)}${wrap(sheetSVG(P,{px:300,labels:1,pts:true,cl:false,under:C=>plyl([[0,0],[15,0],[15,40],[0,40]].map(C.T('F')),'shade',true)+plyl([[0,0],[20,0],[20,40],[0,40]].map(C.T('S')),'shade',true)}).svg,300)}</div>`})()}<figcaption class="sub" style="text-align:center">منشور قاعدته شبه منحرف: التمثيل بالمنظور الأيزومتري، والتمثيل بالمساقط الثلاثة — ص 20</figcaption></figure>`}},
    {watch:`<p>المثال المقصود في هذه الجملة (ص 19) هو المنشور شبه المنحرف المرسوم في ص 20، لأن السطح (<span class="ltr">5, 1, 4, 8</span>) مائل فيه، لا متوازي المستطيلات (سطوحه كلها متعامدة). وفي الجملة نقص صححناه: «… (الارتفاع) <b>ومن</b> المسقط الأفقي (العرض)».</p>`,fix:true},
    {tip:`<p>القاعدة كلها في ثلاث حالات لأي سطح: <b>موازٍ</b> لمستوى الإسقاط ← يظهر بشكله الحقيقي. <b>عمودي</b> عليه ← يظهر خطاً. <b>مائل</b> عليه ← يظهر مقصّراً في كل المساقط، فنأخذ ارتفاعه من مسقط وعرضه من مسقط آخر.</p>`,title:'ثلاث حالات للسطح'},
    {title:'مختبر مصغّر: كيف يظهر السطح؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل سطح في كل مسقط: هل يظهر بشكله الحقيقي، أم خطاً مستقيماً، أم مقصّراً؟ (متوازي المستطيلات ص 19 والمنشور ص 20)',cats:['بشكله الحقيقي','خطاً مستقيماً','مقصّراً'],items:[
     ['السطح <span class="ltr">(1, 2, 3, 4)</span> لمتوازي المستطيلات في المسقط الرأسي',0,'يوازي مستوى الإسقاط الرأسي (ص 19).'],
     ['السطح <span class="ltr">(5, 6, 2, 1)</span> لمتوازي المستطيلات في المسقط الرأسي',1,'عمودي على مستوى الإسقاط الرأسي فيظهر حافة (ص 19).'],
     ['السطح <span class="ltr">(5, 6, 2, 1)</span> لمتوازي المستطيلات في المسقط الأفقي',0,'يوازي مستوى الإسقاط الأفقي (ص 19).'],
     ['السطح <span class="ltr">(5, 1, 4, 8)</span> لمتوازي المستطيلات في المسقط الجانبي',0,'يوازي مستوى الإسقاط الجانبي — ولهذا لم ننقل جملة الكتاب المخالفة.'],
     ['السطح المائل <span class="ltr">(5, 1, 4, 8)</span> للمنشور شبه المنحرف في المسقط الرأسي',2,'يصنع زاوية غير قائمة مع مستوى الإسقاط، فلا يظهر بأبعاده الحقيقية في أي مسقط (ص 19–20).']]})}
   ]},

  {recap:[
   'المنظور (الأيزومتري 30° و1 : 1 : 1، أو الديمتري 7° و42° والعمق بنصفه) لإعطاء نظرة عامة؛ أما الرسومات التشغيلية فبالمساقط المنفصلة (DIN 6).',
   'المسقط الجانبي (بالنظر من اليسار) يرسم على يمين المسقط الرأسي وعلى مستواه، والمسقط الأفقي (بالنظر من أعلى) أسفل المسقط الرأسي تماماً.',
   'السطح الموازي لمستوى الإسقاط يظهر بشكله الحقيقي، والعمودي عليه يظهر خطاً، والمائل يظهر مقصّراً في كل المساقط وتعرف أبعاده الحقيقية من مسقطين.',
   'الأرقام بين الأقواس في المسقط تدل على الأركان الواقعة خلف الأركان الظاهرة.']}
],
 theory:[
  {h:'١-٥ مساقط المشغولات',ref:'ص 17',html:`<p>«يمكن تمثيل جسم ما في مسقط واحد. وتحتوي المواصفات (<span class="ltr">DIN 5</span>) على القواعد القياسية لرسم مثل هذه الرسومات التوضيحية».</p>`},
  {fig:'',ref:'ص 17',caption:'(أ) منظور متساوي القياس (أيزومتري) — (ب) منظور ثنائي القياس (مائل) (ديمتري)',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">${wrap(axoCube('iso'),260)}${wrap(axoCube('di'),260)}</div>`},
  {html:`<p>«يعطي المنظور ثنائي القياس على النقيض من المنظور متساوي القياس أفضلية لإظهار أحد جوانب الجسم. وتختار هذه الطريقة إذا ما احتوى أحد جوانب الجسم على عدد كبير من التفاصيل المراد إيضاحها. إلا أنه ليس من المعتاد استخدام هذين النوعين من التمثيل كرسومات. ويستخدم أحد المنظورين الأيزومتري أو الديمتري في الرسم لإعطاء نظرة عامة على مشغولة أو جهاز ما. أما بالنسبة للرسومات التشغيلية فتختار عامة <b>المساقط المنفصلة</b> كوسيلة مناسبة لتمثيل الأجسام».</p>`},
  {fig:'',ref:'ص 18',caption:'اتجاهات النظر: <span class="ltr">P</span> من أعلى (أفقي)، <span class="ltr">E</span> من الأمام (رأسي)، <span class="ltr">S</span> من اليسار (جانبي) — وترتيب المساقط الثلاثة: الجانبي على يمين الرأسي وعلى مستواه، والأفقي أسفل الرأسي تماماً',draw:()=>{const P=getP('box');const s=sheetSVG(P,{px:300,labels:1,cl:false,mark:C=>{let h='';const F=C.T('F'),S=C.T('S'),T=C.T('T');[0,P.H].forEach(v=>h+=ln(F([P.W+1,v]),S([-1,v]),'tn',' stroke-dasharray="2 3"'));[0,P.W].forEach(u=>h+=ln(F([u,P.H+1]),T([u,-1]),'tn',' stroke-dasharray="2 3"'));return h}}).svg;
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(pictSVG(P,{px:300,arrows:stdArrows(P),m:40}),320)}${wrap(s,320)}</div>`}},
  {html:`<p>«وطبقاً للمواصفات (<span class="ltr">DIN 6</span>) ينبغي رسم عدد من المساقط المنفصلة تكفي لتحديد شكل القطعة تماماً. وغالباً ما يكفي التمثيل بثلاثة مساقط منفصلة لتحديد شكل القطعة. وإذا أمكن تحديد شكل القطعة تماماً بمسقطين أو بمسقط واحد فإننا نكتفي بهذه المساقط فقط، على أنه رغم ذلك سيطلب في تلك الحالات أيضاً رسم ثلاثة مساقط بهدف التدريب».</p>
   <p>«في هذا النوع من التمثيل ينبغي التقيد بأوضاع المساقط بالنسبة لبعضها البعض. وبتحديد المسقط الرأسي، يرسم <b>المسقط الجانبي</b> (بالنظر من الجهة اليسرى) على <b>الجانب الأيمن</b> للمسقط الرأسي، كما يرسم <b>المسقط الأفقي</b> (بالنظر من أعلى) <b>أسفل</b> المسقط الرأسي. ويجب أن يكون المسقط الجانبي على نفس المستوى الأفقي للمسقط الرأسي، وأن يقع المسقط الأفقي أسفل المسقط الرأسي تماماً (انظر الخطوط المنقطة)».</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لأن المسقط الجانبي نراه من اليسار ونرسمه على اليمين، تظهر <b>الجهة الخلفية</b> للجسم في الحافة اليسرى للمسقط الجانبي، وتظهر الجهة الخلفية كذلك في الحافة العليا للمسقط الأفقي. لهذا تقابل الحافةُ العليا للمسقط الأفقي الحافةَ اليسرى للمسقط الجانبي في طريقة خط 45° (ص 22). جرّب ذلك بتدوير الجسم في تبويب «المختبر».'},
  {h:'١-٦ التمثيل في ثلاثة مساقط',ref:'ص 18–19',html:`<p>«تتعامد مستويات الإسقاط (الرأسي والجانبي والأفقي) على بعضها. وفي التمثيل بثلاثة مساقط يمثل كل مسقط كما لو نظر الإنسان إلى كل نقطة من نقط مستوى الإسقاط في اتجاه عمودي. وتبعاً لذلك تقع السطوح الخلفية في الأجسام الموشورية التي تكون سطوحها متعامدة (كعلبة الثقاب مثلاً) خلف سطوح الإسقاط المناظرة الظاهرة، كما تنطبق حواف الجسم المتقابلة على بعضها».</p>`},
  {fig:'',ref:'ص 19',caption:'متوازي مستطيلات بين مستويات الإسقاط الثلاثة المتعامدة، ومساقطه الثلاثة. «ترمز الأرقام إلى أركان الجسم طبقاً للمثال، وتمثل الأرقام بين الأقواس الأركان الواقعة في الخلف لكل حالة»',draw:()=>{const P=getP('box');return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(pictSVG(P,{px:320,planes:planesFor(P),pts:true,arrows:stdArrows(P,1.2*Math.max(P.W,P.D,P.H)),m:26}),340)}${wrap(sheetSVG(P,{px:320,labels:1,pts:true,cl:false}).svg,320)}</div>`}},
  {html:`<p>«تظهر سطوح الأجسام التي تقع موازية لمستوى الإسقاط مماثلة لشكلها الحقيقي في ذلك المسقط، وتبدو بأبعادها الحقيقية أيضاً لو استخدم مقياس الرسم (<span class="ltr">1:1</span>). في المثال: ينطبق ذلك على السطحين (<span class="ltr">5, 6, 7, 8</span>) و(<span class="ltr">1, 2, 3, 4</span>) في المسقط الرأسي، وعلى السطحين (<span class="ltr">5, 6, 2, 1</span>) و(<span class="ltr">8, 7, 3, 4</span>) في المسقط الأفقي».</p>
   <p>«تظهر السطوح العمودية على مستوى الإسقاط في المسقط كحواف (خط مستقيم). في المثال: ينطبق ذلك على السطحين (<span class="ltr">5, 6, 2, 1</span>) و(<span class="ltr">8, 7, 3, 4</span>) في كل من المسقط الرأسي والجانبي، وعلى السطوح (<span class="ltr">5, 6, 7, 8</span>) و(<span class="ltr">1, 2, 3, 4</span>) و(<span class="ltr">5, 1, 4, 8</span>) و(<span class="ltr">2, 6, 7, 3</span>) في المسقط الأفقي».</p>`},
  {err:'يقول الكتاب (ص 19) عن هذا المثال: «أما في المسقط الجانبي فلا ينطبق ذلك على أي سطح»، وهذا يخالف الشكل نفسه: السطحان (<span class="ltr">5, 1, 4, 8</span>) و(<span class="ltr">6, 2, 3, 7</span>) يوازيان مستوى الإسقاط الجانبي فيظهران بشكلهما الحقيقي في المسقط الجانبي. لذلك لم ننقل هذه الجملة.'},
  {html:`<p>«أما السطوح التي تصنع زاوية أقل أو أكبر من <span class="ltr">90°</span> على أحد مستويات الإسقاط فإنها لا تظهر في أي من المساقط بأبعادها الحقيقية. على أنه يمكن دائماً تحديد أبعادها الحقيقية باستخدام مسقطين. في المثال يمكن استنتاج الأبعاد الحقيقية للسطح المظلل (<span class="ltr">5, 1, 4, 8</span>) مثلاً من المسقط الرأسي والجانبي (الارتفاع) ومن المسقط الأفقي (العرض)».</p>`},
  {fig:'',ref:'ص 20',caption:'منشور قاعدته شبه منحرف: التمثيل بالمنظور الأيزومتري، والتمثيل بالمساقط الثلاثة. السطح المائل (<span class="ltr">5, 1, 4, 8</span>) لا يظهر بشكله الحقيقي في أي مسقط',draw:()=>{const P=getP('trap');const f=[P.pts[5],P.pts[1],P.pts[4],P.pts[8]];return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(pictSVG(P,{px:300,pts:true,faces:[f],arrows:[stdArrows(P)[0]],m:30}),320)}${wrap(sheetSVG(P,{px:320,labels:1,pts:true,cl:false,under:C=>{const F=C.T('F');return plyl([[0,0],[15,0],[15,40],[0,40]].map(F),'shade',true)+plyl([[0,0],[20,0],[20,40],[0,40]].map(C.T('S')),'shade',true)}}).svg,320)}</div>`}},
  {err:'المثال المقصود في الجملة الأخيرة (ص 19) هو المنشور شبه المنحرف المرسوم في ص 20، لأن السطح (<span class="ltr">5, 1, 4, 8</span>) مائل فيه، لا متوازي المستطيلات (سطوحه كلها متعامدة). وفي الجملة نقص صححناه: «… (الارتفاع) <b>ومن</b> المسقط الأفقي (العرض)».'},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> في المسقط الأفقي يظهر عرض السطح المائل (<span class="ltr">5, 1</span>) مقصّراً، وفي المسقط الرأسي يظهر أقصر كذلك؛ أما طوله الحقيقي فوتر مثلث قائم ضلعاه من المسقطين: <span class="ltr">√(15² + 20²) = 25</span> بأبعاد الرسم التوضيحية (<span class="ltr">15</span> من المسقط الرأسي و<span class="ltr">20</span> عمق الجسم من المسقط الأفقي).'}
 ],
 lab:(el)=>genLab(el,{id:'g3',title:'مولّد المساقط',ref:'مبني على أشكال ص 18–20 ولوحات الوحدة',parts:['box','trap','step','L26','U28','C27','I30','S36'],
  msg:k=>k==='box'||k==='trap'?'الأرقام على الأركان كما في ص 19–20: الركن الخلفي بين قوسين.':'',
  steps:g=>[
   {t:'دوّر الجسم',x:'اسحب صورة الجسم بالفأرة أو بإصبعك يميناً ويساراً وأعلى وأسفل. لاحظ الأسهم <span class="ltr">E</span> و<span class="ltr">S</span> و<span class="ltr">P</span>: اتجاهات النظر الثلاثة.',done:()=>(g().did.drag||0)>8},
   {t:'انظر من الأمام',x:'اضغط «من الأمام E»: يدور الجسم حتى تراه كما يرسم في <b>المسقط الرأسي</b> (المحاط بإطار).',done:()=>g().did.vF},
   {t:'انظر من اليسار',x:'اضغط «من اليسار S»: هذا ما يرسم في <b>المسقط الجانبي</b> على يمين المسقط الرأسي (ص 18).',done:()=>g().did.vS},
   {t:'الأرقام بين الأقواس',x:'مع «متوازي مستطيلات» اضغط «من أعلى P»: الركن 5 فوق الركن 8 تماماً، لذا يكتب <span class="ltr">5(8)</span>.',done:()=>g().pk==='box'&&g().did.vT},
   {t:'الحواف المختفية',x:'اختر «مشغولة بقطاع جانبي (مجرى)»: في المسقطين الرأسي والجانبي خطان متقطعان. اختر «إخفاء» في المنظور ودوّره لترى أن هذه الحواف خلف السطوح.',done:()=>g().pk==='C27'&&g().did.hid},
   {t:'جسم آخر',x:'اختر «الجسم المتدرج» (مثال ص 21–24) وطابق كل مسقط مع اتجاه نظره.',done:()=>g().pk==='step'}]}),
 examples:[
  drawnEx('المساقط الثلاثة لمتوازي المستطيلات بأرقام الأركان','ص 19',`<p>ارسم المساقط الثلاثة لمتوازي المستطيلات المرقمة أركانه، واكتب في كل مسقط رقم الركن الظاهر، والركن الذي خلفه بين قوسين.</p>${wrap(pictSVG(getP('box'),{px:240,pts:true,m:24}),260)}`,(()=>{const P=getP('box'),o={px:330,labels:1,cl:false};return [
   ['ارسم <b>المسقط الرأسي</b> (النظر في اتجاه <span class="ltr">E</span>): مستطيل بالطول والارتفاع الحقيقيين. أركانه الظاهرة 1، 2، 3، 4، وخلفها 5، 6، 7، 8.',sheetSVG(P,Object.assign({},o,{hide:{S:1,T:1},pts:true})).svg],
   ['ارسم <b>المسقط الجانبي</b> على يمين الرأسي وعلى مستواه نفسه (الحافتان العليا والسفلى على امتداد واحد). نراه من اليسار، فالركن 5 (الخلفي) على يساره و1 (الأمامي) على يمينه.',sheetSVG(P,Object.assign({},o,{hide:{T:1},pts:true,mark:C=>[0,P.H].map(v=>ln(C.T('F')([P.W+1,v]),C.T('S')([-1,v]),'pjd')).join('')})).svg],
   ['ارسم <b>المسقط الأفقي</b> أسفل الرأسي تماماً (الحافتان اليسرى واليمنى على امتداد واحد). الحافة العليا فيه هي الخلف (5، 6) والسفلى هي الأمام (1، 2).',sheetSVG(P,Object.assign({},o,{pts:true,mark:C=>[0,P.W].map(u=>ln(C.T('F')([u,P.H+1]),C.T('T')([u,-1]),'pjd')).join('')})).svg],
   ['تحقق: السطح (<span class="ltr">1, 2, 3, 4</span>) بشكله الحقيقي في المسقط الرأسي، والسطح (<span class="ltr">5, 6, 2, 1</span>) بشكله الحقيقي في المسقط الأفقي، وكلاهما يظهر خطاً مستقيماً في مسقط آخر.',sheetSVG(P,Object.assign({},o,{pts:true,under:C=>plyl([[0,0],[P.W,0],[P.W,P.H],[0,P.H]].map(C.T('F')),'shade',true)+plyl([[0,0],[P.W,0],[P.W,P.D],[0,P.D]].map(C.T('T')),'shade',true)})).svg]]})()),
  drawnEx('المساقط الثلاثة للمنشور شبه المنحرف','ص 20',`<p>ارسم المساقط الثلاثة للمنشور المرسوم بالمنظور، ورقّم أركانه. (الأبعاد للتوضيح: العرض الخلفي <span class="ltr">60</span>، والأمامي <span class="ltr">30</span>، والعمق <span class="ltr">20</span>، والارتفاع <span class="ltr">40</span>.)</p>${wrap(pictSVG(getP('trap'),{px:240,pts:true,m:24}),260)}`,(()=>{const P=getP('trap'),o={px:330,labels:1,cl:false,pts:true};return [
   ['ابدأ بالمسقط الأفقي لأنه يبين شكل القاعدة المميز: شبه منحرف، ضلعه الطويل 5–6 في الخلف (أعلى) والقصير 1–2 في الأمام (أسفل).',sheetSVG(P,Object.assign({},o,{hide:{F:1,S:1}})).svg],
   ['انقل الأركان رأسياً إلى أعلى لترسم <b>المسقط الرأسي</b>: ثلاثة أشرطة، حدودها عند 5، 1، 2، 6. السطحان المائلان يظهران شريطين ضيقين.',sheetSVG(P,Object.assign({},o,{hide:{S:1},mark:C=>[0,15,45,60].map(u=>ln(C.T('T')([u,-1]),C.T('F')([u,P.H+1]),'pjd')).join('')})).svg],
   ['ارسم <b>المسقط الجانبي</b> على يمين الرأسي: مستطيل عرضه عمق الجسم؛ الركن 6 خلف 5، و2 خلف 1.',sheetSVG(P,o).svg]]})())
 ],
 quiz:[
  {q:'أين يرسم المسقط الجانبي (بالنظر من اليسار) حسب ترتيب الكتاب؟',o:['على يسار المسقط الرأسي','على يمين المسقط الرأسي وعلى مستواه','أسفل المسقط الرأسي','فوق المسقط الرأسي'],c:1,e:'ص 18.'},
  {q:'أين يرسم المسقط الأفقي (بالنظر من أعلى)؟',o:['أسفل المسقط الرأسي تماماً','على يمين المسقط الجانبي','فوق المسقط الرأسي','في أي مكان على اللوحة'],c:0,e:'ص 18: «وأن يقع المسقط الأفقي أسفل المسقط الرأسي تماماً».'},
  {q:'في المنظور متساوي القياس (الأيزومتري):',o:['α = 7° و β = 42°','α = β = 30° والأضلاع بنسبة 1 : 1 : 1','α = β = 45°','العمق بنصف طوله'],c:1,e:'ص 17. أما الديمتري فـ α = 7° و β = 42° والعمق بنصف طوله.'},
  {q:'سطح يوازي مستوى الإسقاط يظهر في ذلك المسقط:',o:['خطاً مستقيماً','بشكله وأبعاده الحقيقية (بمقياس 1:1)','أصغر من حقيقته','بخط متقطع'],c:1,e:'ص 19.'},
  {q:'سطح عمودي على مستوى الإسقاط يظهر في ذلك المسقط:',o:['بشكله الحقيقي','كحافة (خط مستقيم)','دائرة','لا يظهر'],c:1,e:'ص 19.'},
  {q:'في المسقط الرأسي لمتوازي المستطيلات (ص 19) يكتب عند الركن 1 الرقم (5) بين قوسين لأن:',o:['الركن 5 أمام الركن 1','الركن 5 يقع خلف الركن 1 في اتجاه النظر','الركن 5 غير موجود','الرقمان متساويان'],c:1,e:'«تمثل الأرقام بين الأقواس الأركان الواقعة في الخلف لكل حالة» (ص 19).'}
 ]
});

/* =====================================================================
   THIRD-VIEW CONSTRUCTION (ص 20–24): the three methods of the book
   miss: the view to construct — 'F' (نقل الحواف، ص 21), 'S' (خط 45°، ص 22), 'T' (الفرجار، ص 23)
   ===================================================================== */
const METHOD={F:'نقل الحواف من المسقط الجانبي والمسقط الأفقي',S:'الانعكاس على خط مساعد يميل بزاوية 45°',T:'النقل بالفرجار'};
function consPts(P,miss){const segs=ENG.view(P,miss),pts=[];const k=p=>Math.round(p[0]*100)+','+Math.round(p[1]*100);const seen=new Set();
  segs.forEach(s=>[s.a,s.b].forEach(p=>{const kk=k(p);if(!seen.has(kk)){seen.add(kk);pts.push(p)}}));
  pts.sort((a,b)=>miss==='T'?(a[0]-b[0]||a[1]-b[1]):(a[1]-b[1]||a[0]-b[0]));return {segs,pts,key:k}}
/* o: {px, pts:[local pts to construct], stg:{a,b,c} which projector parts (default all), cur:index of the highlighted point, target:'none'|'grey'|'typed'|'final',
       typed:[types per segment], res:[true/false per segment], hit:true, helper:true, plabel:'1' (number the point), num1:true (point 1 of ص 21–24 in the given views)} */
function consSVG(P,miss,o){o=o||{};const C=layout(P,{px:o.px||480,labels:1});const giv=['F','S','T'].filter(k=>k!==miss);const s=C.s;
  const segsT=ENG.view(P,miss);const aa=C.g*0.45;
  const mark=()=>{let h='';
   if(o.helper!==false){if(miss==='S'){const x0=C.X('F',P.W),y0=C.Y('F',P.H),L=(C.g+P.D+8)*s;h+=ln([x0,y0],[x0+L,y0+L],'tn',' style="stroke:var(--blue-ink);stroke-width:1.3"');
       const r=16;h+=`<path d="M${f2(x0)} ${f2(y0+r)}A${r} ${r} 0 0 0 ${f2(x0+r*Math.SQRT1_2)} ${f2(y0+r*Math.SQRT1_2)}" class="dm"/>`+tx(x0+6,y0+r+13,'45°','dt','start')}
     if(miss==='T'){const Xv=C.X('F',P.W)+aa*s,Yh=C.Y('F',P.H)+aa*s;h+=ln([Xv,C.Y('F',-6)],[Xv,C.Y('T',P.D+6)],'tn',' style="stroke:var(--blue-ink);stroke-width:1.2"')+ln([C.X('F',-6),Yh],[C.X('S',P.D+6),Yh],'tn',' style="stroke:var(--blue-ink);stroke-width:1.2"')+`<circle cx="${f2(Xv)}" cy="${f2(Yh)}" r="3" class="ptb"/>`;
       h+=dim(q=>[q[0]*s,q[1]*s],[C.X('F',P.W)/s,C.Y('F',P.H*0.3)/s],[Xv/s,C.Y('F',P.H*0.3)/s],0,{ext:false,t:'a'})+dim(q=>[q[0]*s,q[1]*s],[C.X('S',P.D*0.75)/s,C.Y('S',P.H)/s],[C.X('S',P.D*0.75)/s,Yh/s],0,{ext:false,t:'a'})}}
   (o.pts||[]).forEach((p,i)=>{const cur=o.cur===i||o.cur==='all';const cl=cur?'pj':'pjd';const dimc=cur?'':' style="opacity:.4"';const st=o.stg||{a:1,b:1,c:1};let q='';
     if(miss==='S'){const y=p[0],v=p[1],X=C.X('S',y),Yv=C.Y('S',v),Yt=C.Y('T',y),X45=C.X('F',P.W)+(Yt-C.Y('F',P.H));
       if(st.a)q+=ln([C.X('F',P.W)+2,Yv],[X,Yv],cl);if(st.b)q+=ln([C.X('T',P.W)+2,Yt],[X45,Yt],cl)+(cur?arrowHead([X45,Yt],[1,0],6).replace('class="ar"','style="fill:var(--live)"'):'');if(st.c)q+=ln([X45,Yt],[X,Yv],cl)}
     if(miss==='F'){const x=p[0],v=p[1],X=C.X('F',x),Yv=C.Y('F',v);if(st.a)q+=ln([C.X('S',0)-2,Yv],[X,Yv],cl);if(st.b)q+=ln([X,C.Y('T',0)-2],[X,Yv],cl)}
     if(miss==='T'){const x=p[0],y=p[1],X=C.X('T',x),Yt=C.Y('T',y),Xs=C.X('S',y),Xv=C.X('F',P.W)+aa*s,Yh=C.Y('F',P.H)+aa*s,r=Xs-Xv;
       if(st.a)q+=ln([X,C.Y('F',P.H)+2],[X,Yt],cl);if(st.b)q+=ln([Xs,C.Y('S',P.H)+2],[Xs,Yh],cl);
       if(st.c)q+=`<path d="M${f2(Xs)} ${f2(Yh)}A${f2(r)} ${f2(r)} 0 0 1 ${f2(Xv)} ${f2(Yh+r)}" class="${cl}"/>`+ln([Xv,Yh+r],[X,Yt],cl)}
     h+=`<g${dimc}>${q}</g>`;if(st.c!==0&&(miss!=='S'||st.c)&&(miss!=='T'||st.c)&&(miss!=='F'||(st.a&&st.b))){const tp=C.T(miss)(p);h+=`<circle cx="${f2(tp[0])}" cy="${f2(tp[1])}" r="${cur?3.6:2.6}" class="pt"/>`;if(o.plabel&&i===0)h+=tx(tp[0]+6,tp[1]-5,o.plabel,'pn','start')}});
   const T=C.T(miss),k2=p=>Math.round(p[0]*100)+','+Math.round(p[1]*100),have=new Set((o.pts||[]).map(k2));
   if(o.target&&o.target!=='none')segsT.forEach((sg,i)=>{const done=o.target==='final'||(have.has(k2(sg.a))&&have.has(k2(sg.b)));if(!done)return;const A=T(sg.a),Bq=T(sg.b);
     const ty=o.target==='final'?sg.t:o.target==='typed'?(o.typed&&o.typed[i]||'?'):'?';const rc=o.res?(o.res[i]?' good':' bad'):'';
     if(ty==='v')h+=ln(A,Bq,'vl'+rc);else if(ty==='h')h+=hidLn(A,Bq,{cls:rc.trim()});else h+=ln(A,Bq,'tn',' style="stroke:var(--muted);stroke-width:1.6;stroke-dasharray:1 3"');
     if(o.hit)h+=`<line x1="${f2(A[0])}" y1="${f2(A[1])}" x2="${f2(Bq[0])}" y2="${f2(Bq[1])}" class="hit" data-e="${i}"/>`});
   if(o.num1&&P.pts&&P.pts[1])h+=ptLabels(P,C,giv,['1']);
   return h};
  const hide={};hide[miss]=1;return sheetSVG(P,{px:o.px||480,labels:1,cl:false,hide,mark}).svg}

/* =====================================================================
   LESSON 4 — استنتاج المسقط الثالث (ص 20–24)
   ===================================================================== */
B.lesson({
 id:'u1-l4',unit:1,order:4,pages:'20–24',
 title:'استنتاج المسقط الثالث',
 summary:'إذا عُرف مسقطان أمكن استنتاج الثالث بالإسقاط: بنقل الحواف، أو بالانعكاس على خط مساعد يميل بزاوية 45°، أو بالنقل بالفرجار. وكل نقطة في المسقط الناقص تقاطع خطين: أحدهما من كل مسقط معلوم.',
 stations:[
  {intro:true},

  {st:1,short:'استنتاج المسقط الثالث',title:'١-٧ استنتاج المسقط الثالث من المسقطين الآخرين',ref:'ص 20–21',
   q:'أعطاك المهندس مسقطين فقط للقطعة… هل تستطيع أن ترسم الثالث دون أن ترى القطعة نفسها؟',
   get art(){const P=getP('step');const a=DWS.fit(v=>pictSVG(P,{px:v,pts:['1'],arrows:[stdArrows(P)[0]],m:Math.round(v*0.11)}),40,30,280,250);
     const pr=a.M;let t=DWS.tip(60,40,240,230,'الجسم المثال: قاعدة كبيرة فوقها كتلة صغيرة عند الحافة الخلفية؛ مساقطه في الطرق الثلاث بنسب شكل ص 22 (الكتاب يرسمه بلا أرقام).');
     return DWS.art('الجسم المثال لاستنتاج المسقط الثالث',a.g+t+DWS.txt(180,296,'الركن 1 يستعمل في الطرق الثلاث',{fs:13,b:1}),'#FBE6C4')},
   cap:'الجسم المثال (ص 21)، والسهم <span class="ltr">E</span> اتجاه النظر للمسقط الرأسي، والنقطة <span class="ltr">1</span> الركن المستعمل في الأمثلة.<br><b>مرّر المؤشر على الجسم (أو المسه في الجوال) لتعرف وصفه.</b>',
   side:[
    {predict:{q:'كم مسقطاً معطى تحتاج لتستنتج المسقط الثالث بالإسقاط؟',opts:[
     ['مسقطان',true,'الكتاب (ص 20): «يمكن عن طريق الإسقاط استنتاج المسقط الثالث من مسقطين معطيين».'],
     ['مسقط واحد',false,'المسقط الواحد يعطي بعدين فقط من أبعاد الجسم الثلاثة، فلا يكفي.'],
     ['لا بد من المنظور مع مسقطين',false,'المسقطان يكفيان؛ المنظور للنظرة العامة فقط.']]}}
   ],
   body:[
    {book:`<p>تم إيضاح أوضاع المساقط بالنسبة لبعضها في درس سابق، وقد تحدد ذلك في المواصفات (<span class="ltr">DIN 6</span>) بحيث يمكن عن طريق الإسقاط استنتاج المسقط الثالث من مسقطين معطيين. تبين الأشكال الثلاثة التالية التي تمثل مساقط الجسم المبين بالشكل طريقة استنتاج المسقط الناقص بالإسقاط.<br>ورغم أن القواعد الأساسية للإسقاط لا تتغير فإنه يمكن استخدام طرق مختلفة للإسقاط في الرسم الفني.</p><ol><li>الإسقاط عن طريق نقل الحواف من المسقط الجانبي والمسقط الأفقي.</li><li>الإسقاط عن طريق الانعكاس على خط مساعد يميل بزاوية <span class="ltr">45°</span>.</li><li>الإسقاط عن طريق النقل بالفرجار.</li></ol>`,ref:'ص 20–21'},
    {tip:`<p>كل نقطة من الجسم لها ثلاثة مقاسات: <b>العرض</b> (يمين–يسار)، و<b>الارتفاع</b> (أعلى–أسفل)، و<b>العمق</b> (أمام–خلف). كل مسقط يبين اثنين منها فقط: الرأسي يبين العرض والارتفاع، والجانبي العمق والارتفاع، والأفقي العرض والعمق. لذلك يكفي مسقطان لمعرفة المقاسات الثلاثة، والطرق الثلاث وسائل لنقلها إلى المسقط الناقص.</p>`,title:'لماذا يكفي مسقطان؟'},
    {title:'مختبر مصغّر: أي طريقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر الطريقة التي ينتمي إليها (من خطوات الكتاب ص 21–24).',cats:['نقل الحواف','خط 45°','الفرجار'],items:[
     ['خط مساعد يميل من الركن الأيمن السفلي للمسقط الرأسي',1,'الخطوة (٢) في طريقة خط 45° (ص 22).'],
     ['نقطة ارتكاز عند تقاطع خطين مساعدين يبعدان مسافة <span class="ltr">a</span> عن المسقطين',2,'الخطوة (١) في طريقة الفرجار (ص 23).'],
     ['خط أفقي من النقطة في المسقط الجانبي وخط رأسي من النقطة في المسقط الأفقي',0,'هذه طريقة نقل الحواف لاستنتاج المسقط الرأسي (ص 21).'],
     ['تنقل النقطة من خط مساعد إلى الخط المساعد الآخر بالدوران',2,'الخطوة (٤) في طريقة الفرجار (ص 24).']]})}
   ]},

  {st:2,short:'نقل الحواف',title:'الطريقة ١: الإسقاط بنقل الحواف من المسقط الجانبي والمسقط الأفقي',ref:'ص 21–22',
   q:'نقطة في المسقط الجانبي ونفس النقطة في المسقط الأفقي… أين تلتقيان في المسقط الرأسي؟',
   get art(){const P=getP('step'),c=consPts(P,'F');const b=DWS.fit(v=>consSVG(P,'F',{pts:c.pts,cur:'all',target:'final',num1:1,px:v}),20,24,320,272),px=b.px;const C=layout(P,{px,labels:1});
     const box=k=>{const [w,h]=k==='F'?[P.W,P.H]:k==='T'?[P.W,P.D]:[P.D,P.H];return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('S'),'المسقط الجانبي (معطى): منه تنقل الارتفاعات بخطوط أفقية نحو اليسار.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي (معطى): منه تنقل العروض بخطوط رأسية إلى أعلى.',0)+DWS.tipR(b.M,...box('F'),'المسقط الرأسي (المطلوب): كل ركن فيه تقاطع خط أفقي من المسقط الجانبي وخط رأسي من المسقط الأفقي.',0);
     const p1=C.T('F')(ENG.VIEW.F.p(P,P.pts[1]));const q1=b.M(p1);t+=DWS.tip(q1[0]-9,q1[1]-9,18,18,'النقطة ⟦1⟧ في المسقط الرأسي: تقاطع الخطين المنقولين من النقطة ⟦1⟧ في المسقطين المعطيين.');
     return DWS.art('بناء المسقط الرأسي بنقل الحواف',b.g+t)},
   cap:'بناء المسقط الرأسي بنقل الحواف (شكل ص 22): خطوط أفقية من المسقط الجانبي، ورأسية من المسقط الأفقي.<br><b>مرّر المؤشر على كل مسقط وعلى النقطة <span class="ltr">1</span> (أو المسها في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'من النقطة 1 في المسقط الأفقي، أي خط ترسم نحو المسقط الرأسي؟',opts:[
     ['خطاً أفقياً',false,'الخط الأفقي يرسم من المسقط الجانبي (الذي على اليمين).'],
     ['خطاً مائلاً بزاوية <span class="ltr">45°</span>',false,'خط 45° خاص بالطريقة الثانية.'],
     ['خطاً رأسياً يمتد حتى المسقط الرأسي',true,'الكتاب (ص 21): «يرسم كذلك من النقطة 1 في المسقط الأفقي خط رأسي يمتد حتى المسقط الرأسي».']]}}
   ],
   body:[
    {book:`<p><b>يمكن تكوين المسقط الرأسي عن طريق إسقاط الحواف من المسقط الجانبي والمسقط الأفقي.</b></p><p>الركن (1) في الجسم كمثال:</p><ol><li>يرسم من النقطة 1 في المسقط الجانبي خط أفقي يمتد حتى المسقط الرأسي.</li><li>يرسم كذلك من النقطة 1 في المسقط الأفقي خط رأسي يمتد حتى المسقط الرأسي.</li></ol><p>يتقاطع الخطان لإعطاء النقطة 1 في المسقط الرأسي.</p>`,ref:'ص 21'},
    {tip:`<p>الخط الأفقي من المسقط الجانبي يحمل <b>ارتفاع</b> النقطة، والخط الرأسي من المسقط الأفقي يحمل <b>عرضها</b>. والمسقط الرأسي يحتاج العرض والارتفاع فقط، فتقاطعهما هو مكان النقطة. كرر ذلك مع كل ركن ثم صل الأركان.</p>`,title:'ماذا يحمل كل خط؟'},
    {title:'مختبر مصغّر: انقل الأركان واحداً واحداً',widget:(el,B)=>DWS.transfer(el,B,{miss:'F',intro:'حرّك المؤشر لتنقل أركان الجسم إلى المسقط الرأسي ركناً بعد ركن. الخطان البرتقاليان للركن الحالي.',
     predict:{q:'الركن 1 أعلى الكتلة الصغيرة. أين يقع في المسقط الرأسي؟',opts:[['في النصف الأيسر من المسقط الرأسي، أسفل حافته العليا',false,'تتبع الخط الرأسي من المسقط الأفقي: يصعد من منتصف العرض تقريباً.'],['عند الركن العلوي الأيسر للكتلة الصغيرة',true,'الخط الرأسي من المسقط الأفقي يمر بمنتصف العرض، والأفقي من المسقط الجانبي عند قمة الكتلة؛ تقاطعهما الركن العلوي الأيسر للكتلة (ص 22).'],['خارج المسقط الرأسي',false,'كل ركن من الجسم له مكان داخل حدود المسقط.']]},
     msg:'كلما اكتملت نقطتا حافة رسمت الحافة بخط منقط رمادي.',done:'<b>اكتملت الأركان</b>: صل بينها فيظهر المسقط الرأسي: القاعدة وفوقها الكتلة الصغيرة في النصف الأيمن.'})}
   ]},

  {st:3,short:'خط 45°',title:'الطريقة ٢: الإسقاط على خط 45°',ref:'ص 22–23',
   q:'العمق يقاس رأسياً في المسقط الأفقي وأفقياً في المسقط الجانبي… فكيف تدير المقاس ربع دورة دون حساب؟',
   get art(){const P=getP('step'),c=consPts(P,'S');const b=DWS.fit(v=>consSVG(P,'S',{pts:c.pts,cur:'all',target:'final',num1:1,px:v}),20,24,320,272),px=b.px;const C=layout(P,{px,labels:1});
     const box=k=>{const [w,h]=k==='F'?[P.W,P.H]:k==='T'?[P.W,P.D]:[P.D,P.H];return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('F'),'المسقط الرأسي (معطى): منه تنقل الارتفاعات بخطوط أفقية نحو اليمين.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي (معطى): منه تنقل الأعماق بخطوط أفقية إلى خط ⟦45°⟧.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي (المطلوب): الحافة العليا للمسقط الأفقي (الخلف) تقابل حافته اليسرى.',0);
     const x0=C.X('F',P.W),y0=C.Y('F',P.H),L=(C.g+P.D+8)*C.s;const m0=b.M([x0+L*0.35,y0+L*0.35]);t+=DWS.tip(m0[0]-16,m0[1]-16,32,32,'الخط المساعد ⟦45°⟧: يبدأ من الركن الأيمن السفلي للمسقط الرأسي؛ عليه تنعكس الخطوط الأفقية فتصعد رأسية.');
     return DWS.art('بناء المسقط الجانبي بخط 45',b.g+t,'#FBE6C4')},
   cap:'بناء المسقط الجانبي بالانعكاس على خط <span class="ltr">45°</span> (شكل ص 23).<br><b>مرّر المؤشر على المساقط وعلى خط <span class="ltr">45°</span> (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'من أين يبدأ الخط المساعد المائل بزاوية <span class="ltr">45°</span>؟',opts:[
     ['من الركن الأيمن السفلي للمسقط الرأسي',true,'الكتاب (ص 22): «يرسم خط مساعد يميل بزاوية 45 من الركن الأيمن السفلي للمسقط الرأسي».'],
     ['من مركز المسقط الأفقي',false,'لو بدأ من مكان آخر لانزاح المسقط الجانبي عن مستوى المسقط الرأسي أو تغيرت المسافات.'],
     ['من الركن الأيسر العلوي للمسقط الجانبي',false,'المسقط الجانبي هو المطلوب، فلا نعرف أركانه بعد.']]}}
   ],
   body:[
    {book:`<p><b>مثال على الإسقاط على خط <span class="ltr">45</span>:</b></p><ol><li>تنقل النقطة 1 من المسقط الرأسي إلى المسقط الجانبي بمدّ خط أفقي منها.</li><li>يرسم خط مساعد يميل بزاوية <span class="ltr">45</span> من الركن الأيمن السفلي للمسقط الرأسي.</li><li>تنقل النقطة 1 من المسقط الأفقي إلى الخط المساعد بمدّ خط أفقي منها.</li><li>تنقل النقطة 1 من الخط المساعد إلى المسقط الجانبي بمدّ خط رأسي يتقاطع مع الخط الممتد في الفقرة الأولى (١) معطياً النقطة 1 في المسقط الجانبي.</li></ol>`,ref:'ص 22–23'},
    {tip:`<p>خط <span class="ltr">45°</span> مرآة: الخط الأفقي الآتي من المسقط الأفقي يصطدم به ثم يصعد رأسياً، والمسافة لا تتغير، فقط اتجاهها يدور ربع دورة. لذلك يصبح <b>العمق</b> الذي كان رأسياً في المسقط الأفقي أفقياً في المسقط الجانبي. والخلف (الحافة العليا للمسقط الأفقي) يقابل الحافة <b>اليسرى</b> للمسقط الجانبي.</p>`,title:'خط 45° مرآة'},
    {title:'مختبر مصغّر: انقل الأركان عبر خط 45°',widget:(el,B)=>DWS.transfer(el,B,{miss:'S',intro:'حرّك المؤشر لتنقل الأركان إلى المسقط الجانبي. تتبع الخط البرتقالي: من المسقط الأفقي إلى خط <span class="ltr">45°</span> ثم إلى أعلى.',
     predict:{q:'نقطة على الحافة <b>العليا</b> للمسقط الأفقي (خلف الجسم). أين تقع في المسقط الجانبي؟',opts:[['على حافته اليمنى',false,'الحافة اليمنى للمسقط الجانبي تقابل الحافة السفلى (الأمام) للمسقط الأفقي.'],['على حافته اليسرى',true,'الخط الأفقي من الحافة العليا يصل خط 45° في أوله فيصعد قرب الحافة اليسرى (شكل ص 23).'],['في منتصفه',false,'المنتصف يقابل منتصف العمق، لا الحافة العليا.']]},
     msg:'كل نقطة: خط أفقي من المسقط الرأسي (الارتفاع)، وخط من المسقط الأفقي إلى خط 45° ثم رأسياً (العمق).',done:'<b>اكتملت النقاط</b>: المسقط الجانبي الناتج — الكتلة الصغيرة تبدأ من الحافة اليسرى (الخلف).'})}
   ]},

  {st:4,short:'النقل بالفرجار',title:'الطريقة ٣: الإسقاط عن طريق النقل بالفرجار',ref:'ص 23–24',
   q:'ليس معك إلا فرجار… كيف تنقل العمق من المسقط الجانبي إلى المسقط الأفقي؟',
   get art(){const P=getP('step'),c=consPts(P,'T');const b=DWS.fit(v=>consSVG(P,'T',{pts:c.pts,cur:'all',target:'final',num1:1,px:v}),20,24,320,272),px=b.px;const C=layout(P,{px,labels:1});
     const box=k=>{const [w,h]=k==='F'?[P.W,P.H]:k==='T'?[P.W,P.D]:[P.D,P.H];return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('F'),'المسقط الرأسي (معطى): منه تنقل العروض بخطوط رأسية إلى أسفل.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي (معطى): منه تنقل الأعماق بخطوط رأسية إلى الخط المساعد الأفقي، ثم بالفرجار.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي (المطلوب): كل نقطة فيه تقاطع الخط الرأسي من المسقط الرأسي مع الخط الأفقي الآتي من القوس.',0);
     const aa=C.g*0.45,X=C.X('F',P.W)+aa*C.s,Y=C.Y('F',P.H)+aa*C.s,m=b.M([X,Y]);t+=DWS.tip(m[0]-10,m[1]-10,20,20,'نقطة ارتكاز الفرجار: تقاطع الخطين المساعدين اللذين يبعدان مسافة ⟦a⟧ عن المسقطين الرأسي والجانبي.');
     return DWS.art('بناء المسقط الأفقي بالفرجار',b.g+t)},
   cap:'بناء المسقط الأفقي بالنقل بالفرجار (شكل ص 24).<br><b>مرّر المؤشر على المساقط وعلى نقطة ارتكاز الفرجار (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'أين تثبّت إبرة الفرجار لتدير المسافات؟',opts:[
     ['في النقطة 1',false,'النقطة 1 هي التي ننقلها، لا مركز الدوران.'],
     ['عند تقاطع الخطين المساعدين اللذين يبعدان <span class="ltr">a</span> عن المسقطين',true,'الكتاب (ص 23): «تستخدم نقطة تقاطع الخطوط كنقطة ارتكاز للفرجار».'],
     ['في مركز المسقط الجانبي',false,'لو أدرت حول مركز المسقط لتغيرت المسافات المنقولة.']]}}
   ],
   body:[
    {book:`<p><b>مثال على الإسقاط عن طريق النقل بالفرجار:</b></p><ol><li>ترسم خطوط مساعدة توازي المسقط الرأسي والمسقط الجانبي وتبعد مسافة <span class="ltr">a</span> عنها. تستخدم نقطة تقاطع الخطوط كنقطة ارتكاز للفرجار.</li><li>تنقل النقطة 1 من المسقط الرأسي إلى المسقط الأفقي برسم خط رأسي منها.</li><li>تنقل النقطة 1 من المسقط الجانبي إلى الخط المساعد برسم خط رأسي منها.</li><li>تنقل النقطة من الخط المساعد إلى الخط المساعد الآخر بالدوران باستخدام الفرجار.</li><li>يرسم خط أفقي من نقطة التقاطع مع الخط المساعد الأخير ليقطع الخط المرسوم في (٢) في النقطة 1 في المسقط الأفقي.</li></ol>`,ref:'ص 23–24'},
    {watch:`<p>صححنا في نصوص الطرق ألفاظاً مطبوعة خطأ: «تنقل <b>القطعة</b> 1» (ص 22) والمقصود النقطة 1، و«يمد» بمعنى «بمدّ»، و«يتقاطعان الخطان» (ص 21) وصوابها «يتقاطع الخطان»، و«عن <b>الطريق</b> النقل» (ص 23) وصوابها «عن طريق النقل».</p>`,fix:true},
    {tip:`<p>الطرق الثلاث تنقل المقاس نفسه: <b>عمق</b> النقطة من الحافة الخلفية للجسم. في المسقط الأفقي يقاس العمق رأسياً (من الحافة العليا)، وفي المسقط الجانبي أفقياً (من الحافة اليسرى). خط <span class="ltr">45°</span> والفرجار وسيلتان لتدوير هذا المقاس ربع دورة؛ القوس يحفظ المسافة من مركزه، فالنقطة الأبعد عن المركز تعطي قوساً أكبر.</p>`,title:'الطرق الثلاث فكرة واحدة'},
    {title:'مختبر مصغّر: انقل الأركان بالفرجار',widget:(el,B)=>DWS.transfer(el,B,{miss:'T',intro:'حرّك المؤشر لتنقل الأركان إلى المسقط الأفقي: خط رأسي من المسقط الرأسي، وخط من المسقط الجانبي إلى الخط المساعد ثم قوس بالفرجار ثم أفقياً.',
     predict:{q:'النقطة على الحافة <b>اليسرى</b> للمسقط الجانبي (أقرب نقطة إلى مركز الفرجار). أي قوس تعطي؟',opts:[['أصغر الأقواس، وتصل إلى الحافة العليا للمسقط الأفقي',true,'هي الأقرب إلى المركز فقوسها الأصغر، وهي الخلف فتقع على الحافة العليا للمسقط الأفقي (شكل ص 24).'],['أكبر الأقواس',false,'أكبر قوس للنقطة الأبعد عن المركز: الحافة اليمنى للمسقط الجانبي (الأمام).'],['لا قوس لها',false,'كل نقطة تنقل بقوس حول نقطة الارتكاز.']]},
     msg:'القوس ينقل المسافة من الخط المساعد الأفقي إلى الخط المساعد الرأسي دون أن تتغير.',done:'<b>اكتملت النقاط</b>: المسقط الأفقي الناتج — مستطيل فيه الكتلة الصغيرة أعلى اليمين (عند الخلف).'})}
   ]},

  {recap:[
   'يستنتج المسقط الثالث من مسقطين معطيين بالإسقاط (DIN 6)، بثلاث طرق: نقل الحواف، والانعكاس على خط مساعد 45°، والنقل بالفرجار.',
   'نقل الحواف (للمسقط الرأسي): خط أفقي من النقطة في المسقط الجانبي وخط رأسي من المسقط الأفقي؛ يتقاطع الخطان في النقطة المطلوبة.',
   'خط 45° يبدأ من الركن الأيمن السفلي للمسقط الرأسي، والفرجار يرتكز عند تقاطع خطين مساعدين يبعدان a عن المسقطين؛ وكلاهما يدير مقاس العمق ربع دورة.',
   'الحافة العليا للمسقط الأفقي (الخلف) تقابل الحافة اليسرى للمسقط الجانبي.']}
],
 theory:[
  {h:'١-٧ استنتاج المسقط الثالث من المسقطين الآخرين',ref:'ص 20–21',html:`<p>«تم إيضاح أوضاع المساقط بالنسبة لبعضها في درس سابق، وقد تحدد ذلك في المواصفات (<span class="ltr">DIN 6</span>) بحيث يمكن عن طريق الإسقاط استنتاج المسقط الثالث من مسقطين معطيين. تبين الأشكال الثلاثة التالية التي تمثل مساقط الجسم المبين بالشكل طريقة استنتاج المسقط الناقص بالإسقاط. ورغم أن القواعد الأساسية للإسقاط لا تتغير فإنه يمكن استخدام طرق مختلفة للإسقاط في الرسم الفني»:</p>
   <ol><li>الإسقاط عن طريق نقل الحواف من المسقط الجانبي والمسقط الأفقي.</li><li>الإسقاط عن طريق الانعكاس على خط مساعد يميل بزاوية <span class="ltr">45°</span>.</li><li>الإسقاط عن طريق النقل بالفرجار.</li></ol>`},
  {fig:'',ref:'ص 21',caption:'الجسم المثال: قاعدة كبيرة فوقها كتلة صغيرة عند الحافة الخلفية اليمنى؛ السهم 1 يشير إلى الركن المستعمل في الأمثلة الثلاثة (الأبعاد للتوضيح بنسب شكل ص 22)',draw:()=>wrap(pictSVG(getP('step'),{px:300,pts:['1'],arrows:[stdArrows(getP('step'))[0]],m:34}),320)},
  {h:'الطريقة ١: نقل الحواف من المسقط الجانبي والمسقط الأفقي',ref:'ص 21–22',html:`<p>«يمكن تكوين المسقط الرأسي عن طريق إسقاط الحواف من المسقط الجانبي والمسقط الأفقي». الركن (1) في الجسم كمثال:</p>
   <ol><li>يرسم من النقطة 1 في المسقط الجانبي خط أفقي يمتد حتى المسقط الرأسي.</li><li>يرسم كذلك من النقطة 1 في المسقط الأفقي خط رأسي يمتد حتى المسقط الرأسي.</li></ol><p>يتقاطع الخطان لإعطاء النقطة 1 في المسقط الرأسي.</p>`},
  {fig:'',ref:'ص 22',caption:'بناء المسقط الرأسي بنقل الحواف: خطوط أفقية من المسقط الجانبي وخطوط رأسية من المسقط الأفقي؛ تقاطعها أركان المسقط الرأسي',draw:()=>{const P=getP('step'),c=consPts(P,'F');return wrap(consSVG(P,'F',{pts:c.pts,cur:'all',target:'final',num1:1}),480)}},
  {h:'الطريقة ٢: الإسقاط على خط 45°',ref:'ص 22–23',html:`<ol><li>تنقل النقطة 1 من المسقط الرأسي إلى المسقط الجانبي بمدّ خط أفقي منها.</li><li>يرسم خط مساعد يميل بزاوية <span class="ltr">45°</span> من الركن الأيمن السفلي للمسقط الرأسي.</li><li>تنقل النقطة 1 من المسقط الأفقي إلى الخط المساعد بمدّ خط أفقي منها.</li><li>تنقل النقطة 1 من الخط المساعد إلى المسقط الجانبي بمدّ خط رأسي يتقاطع مع الخط الممتد في الفقرة الأولى (١) معطياً النقطة 1 في المسقط الجانبي.</li></ol>`},
  {fig:'',ref:'ص 23',caption:'بناء المسقط الجانبي بخط 45°: الحافة العليا للمسقط الأفقي تقابل الحافة اليسرى للمسقط الجانبي، والحافة السفلى تقابل اليمنى',draw:()=>{const P=getP('step'),c=consPts(P,'S');return wrap(consSVG(P,'S',{pts:c.pts,cur:'all',target:'final',num1:1}),480)}},
  {h:'الطريقة ٣: النقل بالفرجار',ref:'ص 23–24',html:`<ol><li>ترسم خطوط مساعدة توازي المسقط الرأسي والمسقط الجانبي وتبعد مسافة <span class="ltr">a</span> عنها. تستخدم نقطة تقاطع الخطوط كنقطة ارتكاز للفرجار.</li><li>تنقل النقطة 1 من المسقط الرأسي إلى المسقط الأفقي برسم خط رأسي منها.</li><li>تنقل النقطة 1 من المسقط الجانبي إلى الخط المساعد برسم خط رأسي منها.</li><li>تنقل النقطة من الخط المساعد إلى الخط المساعد الآخر بالدوران باستخدام الفرجار.</li><li>يرسم خط أفقي من نقطة التقاطع مع الخط المساعد الأخير ليقطع الخط المرسوم في (٢) في النقطة 1 في المسقط الأفقي.</li></ol>`},
  {fig:'',ref:'ص 24',caption:'بناء المسقط الأفقي بالفرجار: مركز الأقواس نقطة تقاطع الخطين المساعدين اللذين يبعدان a عن المسقطين',draw:()=>{const P=getP('step'),c=consPts(P,'T');return wrap(consSVG(P,'T',{pts:c.pts,cur:'all',target:'final',num1:1}),480)}},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> الطرق الثلاث تنقل المقاس نفسه: <b>عمق</b> النقطة من الحافة الخلفية للجسم. في المسقط الأفقي يقاس العمق رأسياً (من الحافة العليا)، وفي المسقط الجانبي أفقياً (من الحافة اليسرى). خط 45° والفرجار وسيلتان لتدوير هذا المقاس ربع دورة. جرّب الطرق الثلاث على أجسام مختلفة في تبويب «المختبر».'},
  {err:'صححنا في نصوص الطرق ألفاظاً مطبوعة خطأ: «تنقل <b>القطعة</b> 1» (ص 22) والمقصود النقطة 1، و«يمد» بمعنى «بمدّ»، و«يتقاطعان الخطان» (ص 21) وصوابها «يتقاطع الخطان»، و«عن <b>الطريق</b> النقل» (ص 23) وصوابها «عن طريق النقل».'}
 ],
 lab:(el)=>{
  let miss='S',pk='step',n=0,phase=1,typed=[],res=null;const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c12"><h2>ورقة استنتاج المسقط الثالث <small>مبنية على ص 21–24</small></h2>
    <span class="dw-l">الطريقة (والمسقط المطلوب):</span>${segHTML('cm',[['F','نقل الحواف ← الرأسي'],['S','خط 45° ← الجانبي'],['T','الفرجار ← الأفقي']],miss)}
    <span class="dw-l">الجسم:</span>${segHTML('cp',['step','L26','U28','C27','I30','trap','S36','L33'].map(k=>[k,PDEF[k].name]),pk)}
    <div class="dw-sheet" id="l4s" style="max-width:640px;margin-inline:auto"></div>
    <div class="dw-row"><button class="btn primary" id="l4n">النقطة التالية</button><button class="btn" id="l4a">كل النقاط</button><button class="btn" id="l4c" hidden>تحقّق من أنواع الخطوط</button><button class="btn" id="l4v" hidden>أظهر الحل</button><button class="btn" id="l4r">ابدأ من جديد</button><span class="sub" id="l4k"></span></div>
    <div class="dw-msg" id="l4m"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const D=()=>consPts(getP(pk),miss);
  const draw=()=>{const P=getP(pk),c=D(),N=c.pts.length;const pts=c.pts.slice(0,n);
    $('#l4s').innerHTML=consSVG(P,miss,{pts,cur:n-1,target:phase===1?'grey':'typed',typed,res,hit:phase===2,num1:pk==='step',plabel:null,px:560});
    $('#l4k').innerHTML=`النقطة <span class="ltr">${n} / ${N}</span>`;$('#l4n').disabled=n>=N;$('#l4a').disabled=n>=N;
    $('#l4c').hidden=$('#l4v').hidden=phase!==2;
    const msg=$('#l4m');msg.className='dw-msg'+(res?(res.every(x=>x)?' ok':' bad'):'');
    if(phase===1)msg.innerHTML=n===0?`المطلوب <b>${VNAME[miss]}</b> بطريقة «${METHOD[miss]}». اضغط «النقطة التالية»: يرسم خطان من المسقطين المعلومين، وتقاطعهما نقطة في المسقط المطلوب.`:
      n<N?`النقطة ${n}: ${miss==='S'?'خط أفقي من المسقط الرأسي (الارتفاع)، وخط من المسقط الأفقي إلى خط 45° ثم رأسياً إلى أعلى (العمق).':miss==='F'?'خط أفقي من المسقط الجانبي (الارتفاع)، وخط رأسي من المسقط الأفقي (العرض).':'خط رأسي من المسقط الرأسي (العرض)، وخط من المسقط الجانبي إلى الخط المساعد ثم قوس بالفرجار ثم أفقياً (العمق).'} كلما اكتملت نقطتا حافة رسمت الحافة بخط منقط رمادي.`:'';
    else msg.innerHTML=res?(res.every(x=>x)?'<b>ممتاز.</b> كل الخطوط صحيحة: المتصل للحواف الظاهرة والمتقطع للحواف المختفية.':`<b>${res.filter(x=>!x).length} خط غير صحيح</b> (بالأحمر). الحافة مختفية إذا كان بينها وبين الناظر جزء من الجسم في اتجاه هذا المسقط.`):'اكتملت النقاط. الآن <b>حدد نوع كل حافة</b>: المس الخط مرة ليصبح متصلاً (حافة ظاهرة)، ومرة أخرى ليصبح متقطعاً (حافة مختفية)، ثم «تحقّق».'};
  const reset=()=>{n=0;phase=1;typed=[];res=null;draw()};
  const toPhase2=()=>{const c=D();if(n>=c.pts.length){phase=2;typed=c.segs.map(()=>'?')}};
  $('#l4n').onclick=()=>{n++;did.pts=(did.pts||0)+1;toPhase2();draw()};
  $('#l4a').onclick=()=>{n=D().pts.length;toPhase2();draw()};
  $('#l4r').onclick=reset;
  $('#l4s').addEventListener('click',e=>{const t=e.target.closest('[data-e]');if(!t||phase!==2)return;const i=+t.dataset.e;typed[i]=typed[i]==='v'?'h':'v';res=null;draw()});
  $('#l4c').onclick=()=>{const c=D();res=c.segs.map((s,i)=>typed[i]===s.t);if(res.every(x=>x)){did.ok=did.ok||new Set();did.ok.add(miss+pk)}draw()};
  $('#l4v').onclick=()=>{const c=D();typed=c.segs.map(s=>s.t);res=c.segs.map(()=>true);draw()};
  segBind(el,'cm',v=>{miss=v;reset()});segBind(el,'cp',v=>{pk=v;reset()});
  const st=stepsUI($('#l4st'),[
   {t:'النقطة الأولى بخط 45°',x:'مع «خط 45° ← الجانبي» و«الجسم المتدرج» اضغط «النقطة التالية»: تتبع الخط البرتقالي من المسقط الأفقي إلى خط 45° ثم إلى أعلى.',done:()=>miss==='S'&&n>=1},
   {t:'أكمل النقاط',x:'تابع «النقطة التالية» حتى تكتمل النقاط، ولاحظ الحواف الرمادية تظهر واحدة بعد أخرى.',done:()=>miss==='S'&&phase===2},
   {t:'نوع الخطوط',x:'المس كل حافة لتحدد نوعها ثم «تحقّق» حتى يصبح الحل صحيحاً.',done:()=>did.ok&&did.ok.size>=1},
   {t:'طريقة الفرجار',x:'اختر «الفرجار ← الأفقي» وابنِ ثلاث نقاط على الأقل؛ لاحظ أن القوس يحول العمق من أفقي إلى رأسي.',done:()=>miss==='T'&&n>=3},
   {t:'جسم بحواف مختفية',x:'اختر «مشغولة بقطاع جانبي (مجرى)» مع «نقل الحواف ← الرأسي»، أكمل النقاط، وحدد الخطين المتقطعين بشكل صحيح.',done:()=>did.ok&&did.ok.has('FC27')}]);
  reset();loopOn(el,()=>st.check())},
 examples:(()=>{const P=getP('step');const p1=m=>[ENG.VIEW[m].p(P,P.pts[1])];const all=m=>consPts(P,m).pts;const S=(m,o)=>consSVG(P,m,Object.assign({num1:1,plabel:'1',px:470},o));
  return [
  drawnEx('الطريقة ١: استنتاج المسقط الرأسي بنقل الحواف','ص 21–22','<p>معلوم المسقطان الجانبي والأفقي للجسم المتدرج. استنتج المسقط الرأسي، وابدأ بالركن 1.</p>',[
   ['المعطى: المسقط الجانبي (أعلى اليمين) والمسقط الأفقي (أسفل اليسار)، والنقطة 1 معلَّمة فيهما.',S('F',{})],
   ['من النقطة 1 في المسقط الجانبي ارسم خطاً أفقياً يمتد حتى منطقة المسقط الرأسي.',S('F',{pts:p1('F'),cur:0,stg:{a:1}})],
   ['من النقطة 1 في المسقط الأفقي ارسم خطاً رأسياً يمتد حتى المسقط الرأسي. يتقاطع الخطان في النقطة 1 في المسقط الرأسي.',S('F',{pts:p1('F'),cur:0,stg:{a:1,b:1}})],
   ['كرر الطريقة نفسها مع كل ركن، ثم صل النقاط بالحواف.',S('F',{pts:all('F'),cur:'all',target:'grey'})],
   ['المسقط الرأسي الناتج: القاعدة، وفوقها الكتلة الصغيرة في النصف الأيمن، والنقطة 1 ركنها العلوي الأيسر.',S('F',{pts:all('F'),cur:-1,target:'final'})]]),
  drawnEx('الطريقة ٢: استنتاج المسقط الجانبي بخط 45°','ص 22–23','<p>معلوم المسقطان الرأسي والأفقي. استنتج المسقط الجانبي بالانعكاس على خط مساعد يميل بزاوية 45°.</p>',[
   ['المعطى: المسقط الرأسي (أعلى اليسار) والمسقط الأفقي (أسفله).',S('S',{helper:false})],
   ['(١) انقل النقطة 1 من المسقط الرأسي بمدّ خط أفقي منها نحو اليمين.',S('S',{helper:false,pts:p1('S'),cur:0,stg:{a:1}})],
   ['(٢) ارسم خطاً مساعداً يميل بزاوية 45° من الركن الأيمن السفلي للمسقط الرأسي.',S('S',{pts:p1('S'),cur:0,stg:{a:1}})],
   ['(٣) انقل النقطة 1 من المسقط الأفقي إلى الخط المساعد بمدّ خط أفقي منها.',S('S',{pts:p1('S'),cur:0,stg:{a:1,b:1}})],
   ['(٤) من نقطة التقاطع مع الخط المساعد ارسم خطاً رأسياً يقطع الخط (١) في النقطة 1 في المسقط الجانبي.',S('S',{pts:p1('S'),cur:0,stg:{a:1,b:1,c:1}})],
   ['كرر مع باقي الأركان، ثم صل النقاط. المسقط الجانبي الناتج: الكتلة الصغيرة تبدأ من الحافة اليسرى (الخلف).',S('S',{pts:all('S'),cur:-1,target:'final'})]]),
  drawnEx('الطريقة ٣: استنتاج المسقط الأفقي بالفرجار','ص 23–24','<p>معلوم المسقطان الرأسي والجانبي. استنتج المسقط الأفقي بالنقل بالفرجار.</p>',[
   ['المعطى: المسقط الرأسي والمسقط الجانبي.',S('T',{helper:false})],
   ['(١) ارسم خطين مساعدين: رأسياً يبعد a عن المسقط الرأسي، وأفقياً يبعد a عن المسقط الجانبي. نقطة تقاطعهما مركز الفرجار.',S('T',{})],
   ['(٢) انقل النقطة 1 من المسقط الرأسي برسم خط رأسي منها إلى أسفل.',S('T',{pts:p1('T'),cur:0,stg:{a:1}})],
   ['(٣) انقل النقطة 1 من المسقط الجانبي إلى الخط المساعد الأفقي برسم خط رأسي منها.',S('T',{pts:p1('T'),cur:0,stg:{a:1,b:1}})],
   ['(٤) انقلها من الخط المساعد إلى الخط المساعد الآخر بالدوران بالفرجار، ثم (٥) ارسم خطاً أفقياً يقطع الخط (٢) في النقطة 1 في المسقط الأفقي.',S('T',{pts:p1('T'),cur:0,stg:{a:1,b:1,c:1}})],
   ['كرر مع باقي الأركان. المسقط الأفقي الناتج: مستطيل، فيه الكتلة الصغيرة أعلى اليمين (عند الخلف).',S('T',{pts:all('T'),cur:-1,target:'final'})]])]})(),
 quiz:[
  {q:'كم مسقطاً يلزم معرفته لاستنتاج المسقط الثالث؟',o:['مسقط واحد','مسقطان','ثلاثة مساقط','لا يمكن استنتاجه'],c:1,e:'ص 20: «يمكن عن طريق الإسقاط استنتاج المسقط الثالث من مسقطين معطيين».'},
  {q:'من أين يبدأ الخط المساعد في طريقة 45°؟',o:['من الركن الأيمن السفلي للمسقط الرأسي','من مركز المسقط الأفقي','من الركن الأيسر العلوي للمسقط الجانبي','من أي نقطة'],c:0,e:'ص 22، الخطوة (٢).'},
  {q:'في طريقة نقل الحواف (لاستنتاج المسقط الرأسي) يرسم من النقطة في المسقط الأفقي خط:',o:['أفقي','رأسي','مائل بزاوية 45°','قوس'],c:1,e:'ص 21: «يرسم كذلك من النقطة 1 في المسقط الأفقي خط رأسي يمتد حتى المسقط الرأسي».'},
  {q:'في طريقة الفرجار، مركز الفرجار هو:',o:['النقطة 1','مركز المسقط الرأسي','تقاطع الخطين المساعدين اللذين يبعدان a عن المسقطين','الركن السفلي للمسقط الأفقي'],c:2,e:'ص 23.'},
  {q:'الحافة العليا للمسقط الأفقي تقابل في المسقط الجانبي:',o:['الحافة اليمنى','الحافة اليسرى','الحافة العليا','الحافة السفلى'],c:1,e:'كلتاهما الجهة الخلفية للجسم (شكل ص 23).'},
  {q:'بماذا تتحدد النقطة في المسقط المطلوب؟',o:['بخط واحد من مسقط واحد','بتقاطع خطين، أحدهما من كل مسقط معلوم','بالقياس بالمسطرة فقط','بخط 45° وحده'],c:1,e:'ص 21: «يتقاطع الخطان لإعطاء النقطة 1».'}
 ]
});

/* =====================================================================
   LESSON 5 — الحواف المختفية وخطوط المنتصف (ص 25–30)
   ===================================================================== */
PDEF.bar25={name:'قضيب بمجرى طولي',ref:'ص 25',illus:1,pieces:[[[0,120,0,30,0,12]],[[0,120,0,7,12,20]],[[0,120,15,30,12,20]]]};
/* centre lines of a sheet with an optional book error: mode 'ok' | 'short' (error 2) | 'dot' (error 1) | 'join' (error 3) | 'cross' (error 6) */
function clSVG(P,C,mode,cls){let h='';const views=['F','S','T'];const err=mode||'ok';
  views.forEach(k=>{const T=C.T(k);centreLines(P,k).forEach(c=>{let a=c.a,b=c.b;
    if(err==='short'&&k==='F'){const ex=3.5;if(c.ax==='x'){a=[a[0],a[1]+ex];b=[b[0],b[1]-ex]}else{a=[a[0]+ex,a[1]];b=[b[0]-ex,b[1]]}}
    if(err==='join'&&c.ax==='x'&&(k==='F'||k==='T')){if(k==='F')h+=ctrLn(T(a),C.T('T')([c.b[0],P.D+3.5]),{cls});return}
    h+=ctrLn(T(a),T(b),{bad:err==='dot'&&k==='T'?'dot':err==='cross'&&k==='T'?'cross':null,cls})})});return h}
const NUMC=['①','②','③','④','⑤','⑥'];
const errMark=(p,n)=>`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="9" style="fill:var(--stop-soft);stroke:var(--stop)"/>`+tx(p[0],p[1]+4.5,String(n),'dt er','middle');
const wrongX=(W,H)=>`<path d="M${W*0.08} ${H*0.08}L${W*0.92} ${H*0.92}M${W*0.92} ${H*0.08}L${W*0.08} ${H*0.92}" style="stroke:var(--stop);stroke-width:6;opacity:.18"/>`;
const pairFig=(items,mw)=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;align-items:end">${items.map(([svg,cap,ok])=>`<div>${wrap(svg,mw||360)}<p class="sub" style="text-align:center;margin:4px 0 0"><b style="color:var(${ok?'--on':'--stop'})">${ok?'صواب':'خطأ'}</b>${cap?' — '+cap:''}</p></div>`).join('')}</div>`;

/* ---------- right/wrong checker: one generated drawing per round ---------- */
const CHK_PARTS=['U28','I30','L26','C27','S36','trap','L33'];
const CHK_ERR={
 hidSolid:{t:'حافة مختفية رُسمت بخط كامل',x:'هذه الحافة خلفها جزء من الجسم في اتجاه النظر، فهي <b>مختفية</b>، والحواف المختفية ترسم بخط متقطع بنصف ثخانة الخط الكامل.',ref:'ص 25'},
 visDash:{t:'حافة ظاهرة رُسمت متقطعة',x:'لا يحجب هذه الحافة شيء في اتجاه النظر، فهي <b>ظاهرة</b> وترسم بخط كامل عريض.',ref:'ص 25'},
 dashGap:{t:'خط متقطع يبدأ وينتهي بفراغ',x:'«تبدأ الحواف المختفية عند إحدى الحواف المنظورة بشرطة وتنتهي أيضاً بشرطة عند نهاية الحافة المنظورة».',ref:'ص 25'},
 dashUneven:{t:'شرط غير متساوية',x:'الصواب شرط متساوية الطول والمسافات بينها متساوية (الرسم «صواب» في ص 25).',ref:'ص 25'},
 clShort:{t:'خط المنتصف لا يتعدى الحافة (الخطأ ٢)',x:'خط المنتصف «يقطع حافة الجسم ويتعداها».',ref:'ص 28'},
 clDot:{t:'خط المنتصف ينتهي بنقطة (الخطأ ١)',x:'«يبدأ وينتهي خط المنتصف بشرطة».',ref:'ص 28'},
 clJoin:{t:'خط المنتصف ممتد بين مسقطين (الخطأ ٣)',x:'«لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر».',ref:'ص 28'},
 clCross:{t:'خطا المنتصف يتقاطعان عند فراغ (الخطأ ٦)',x:'«تتقاطع خطوط المنتصف فقط عند الشرط».',ref:'ص 29'}};
function chkRound(seed){let s=seed*9301+49297;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};const pick=a=>a[Math.floor(rnd()*a.length)];
  const pk=pick(CHK_PARTS),P=getP(pk);const els=[];
  ['F','S','T'].forEach(k=>{ENG.view(P,k).forEach(sg=>els.push({k,a:sg.a,b:sg.b,kind:sg.t==='v'?'v':'h',truth:sg.t}));centreLines(P,k).forEach(c=>els.push({k,a:c.a,b:c.b,kind:'cl',ax:c.ax}))});
  const H=els.filter(e=>e.kind==='h'&&Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1])>12),Vi=els.filter(e=>e.kind==='v'&&Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1])>12),CL=els.filter(e=>e.kind==='cl');
  const avail=['none'];if(H.length)avail.push('hidSolid','dashGap','dashUneven');if(Vi.length)avail.push('visDash');if(CL.length)avail.push('clShort','clDot');
  if(CL.some(c=>c.ax==='x'&&c.k==='F'))avail.push('clJoin');if(CL.filter(c=>c.k==='T').length>=2)avail.push('clCross');
  const err=pick(avail);let bad=[];
  if(err==='hidSolid'){const e=pick(H);e.kind='v';bad=[e]}
  if(err==='dashGap'||err==='dashUneven'){const e=pick(H);e.bad=err==='dashGap'?'gap':'uneven';bad=[e]}
  if(err==='visDash'){const e=pick(Vi);e.kind='h';bad=[e]}
  if(err==='clShort'){const e=pick(CL);const ex=3.5;if(e.ax==='x'||(e.ax==='y'&&e.k==='S')){e.a=[e.a[0],e.a[1]+ex];e.b=[e.b[0],e.b[1]-ex]}else{e.a=[e.a[0]+ex,e.a[1]];e.b=[e.b[0]-ex,e.b[1]]}bad=[e]}
  if(err==='clDot'){const e=pick(CL);e.bad='dot';bad=[e]}
  if(err==='clJoin'){const f=CL.find(c=>c.ax==='x'&&c.k==='F'),t=CL.find(c=>c.ax==='x'&&c.k==='T'&&Math.abs(c.a[0]-f.a[0])<0.01);if(t){els.splice(els.indexOf(t),1)}f.join=true;bad=[f]}
  if(err==='clCross'){CL.filter(c=>c.k==='T').forEach(c=>{c.bad='cross';bad.push(c)})}
  return {pk,P,els,err,bad}}
function chkSVG(R,o){o=o||{};const C=layout(R.P,{px:440,labels:1});let h='';const order=R.els.slice().sort((a,b)=>(R.bad.includes(a)?1:0)-(R.bad.includes(b)?1:0));
  R.els.forEach((e,i)=>{e.i=i});
  const seg=e=>{const T=C.T(e.k);let A=T(e.a),Bq=T(e.b);if(e.join)Bq=C.T('T')([e.b[0],R.P.D+3.5]);return [A,Bq]};
  const hl=e=>o.show&&R.bad.includes(e)?' bad':o.pick===e.i?(R.bad.includes(e)?' good':' bad'):'';
  R.els.forEach(e=>{const [A,Bq]=seg(e);const c=hl(e).trim();if(e.kind==='v')h+=ln(A,Bq,'vl'+(c?' '+c:''));else if(e.kind==='h')h+=hidLn(A,Bq,{bad:e.bad,cls:c});else h+=ctrLn(A,Bq,{bad:e.bad,cls:c})});
  order.forEach(e=>{const [A,Bq]=seg(e);h+=`<line x1="${f2(A[0])}" y1="${f2(A[1])}" x2="${f2(Bq[0])}" y2="${f2(Bq[1])}" class="hit" data-i="${e.i}"/>`});
  return sheetSVG(R.P,{px:440,labels:1,cl:false,segs:{F:[],S:[],T:[]},mark:()=>h}).svg}

B.lesson({
 id:'u1-l5',unit:1,order:5,pages:'25–30',
 title:'الحواف المختفية وخطوط المنتصف',
 summary:'الحواف المختفية ترسم بخط متقطع بنصف ثخانة الخط الكامل، يبدأ وينتهي بشرطة. ومحور التماثل يرسم خط منتصف (شرطة ونقطة) يبدأ وينتهي بشرطة ويتعدى حافة الجسم، ولا يمتد بين المساقط، ولا يستعمل خط أبعاد، وتتقاطع خطوط المنتصف عند الشرط.',
 stations:[
  {intro:true},

  {st:1,short:'الحواف المختفية',title:'١-٨ الحواف المختفية',ref:'ص 25–26',
   q:'مجرى في ظهر القطعة لا تراه من الأمام… هل ترسمه في المسقط الرأسي أم تتركه؟',
   get art(){const P=getP('bar25');const a=DWS.fit(v=>pictSVG(P,{px:v,arrows:[stdArrows(P,40)[0]],m:Math.round(v*0.1)}),20,34,320,140);
     const shf=v=>sheetSVG(P,{px:v,labels:1,views:['F','S']});const b=DWS.fit(v=>shf(v).svg,40,178,280,104);const C=shf(b.px).C;
     const segs=ENG.view(P,'F').filter(s=>s.t==='h');let t=DWS.tip(20,34,320,140,'قضيب في سطحه العلوي مجرى طولي قريب من الحافة الخلفية؛ السهم ⟦E⟧ اتجاه النظر للمسقط الرأسي (الأبعاد للتوضيح).');
     segs.forEach(sg=>{t+=DWS.tipR(b.M,C.T('F')(sg.a),C.T('F')(sg.b),'حافة مختفية: قاع المجرى خلف الوجه الأمامي، فلا يراه الناظر في اتجاه ⟦E⟧؛ ترسم خطاً متقطعاً بنصف ثخانة الخط الكامل.',6)});
     const [w,h]=C.size('F');t+=DWS.tipR(b.M,C.T('F')([0,0]),C.T('F')([w,0]),'حافة ظاهرة: ترسم بخط كامل عريض.',4);
     return DWS.art('قضيب بمجرى طولي ومسقطاه: قاع المجرى حافة مختفية',a.g+b.g+t)},
   cap:'قضيب بمجرى طولي (شكل ص 25): قاع المجرى يظهر في المسقط الرأسي خطاً متقطعاً.<br><b>مرّر المؤشر على الخط المتقطع والخط الكامل والمنظور (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حافة تقع خلف سطح ظاهر في اتجاه النظر. كيف ترسم في المسقط؟',opts:[
     ['لا ترسم، فالناظر لا يراها',false,'الكتاب (ص 25): ترسم الحواف المختفية «بالإضافة إلى الحواف الظاهرة في كل رسم حتى يسهل تحديد شكل المشغولة».'],
     ['خطاً متقطعاً بنصف ثخانة الخط الكامل',true,'الكتاب: «ترسم الحواف المختفية كخط متقطع… ويرسم الخط المتقطع بنصف ثخانة الخط الكامل».'],
     ['خطاً كاملاً رفيعاً',false,'الخط الكامل الرفيع لخطوط الأبعاد والخطوط المساعدة.']]}}
   ],
   body:[
    {book:`<p>ترسم الحواف المختفية (غير المنظورة) بالإضافة إلى الحواف الظاهرة في كل رسم حتى يسهل تحديد شكل المشغولة. (تعامل الأجسام الشفافة معاملة الأجسام غير الشفافة، أي أن الحواف الواقعة خلف سطوح الإسقاط ترسم كالحواف غير المنظورة).</p><p>ترسم الحواف المختفية كخط متقطع، ويبين الرسم المكتوب أسفله (صواب) النسبة بين الشرط المتساوية الطول والمسافات بينها. ويرسم الخط المتقطع بنصف ثخانة الخط الكامل.</p>`,ref:'ص 25'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 25',1,'ثلاثة نماذج للخط المتقطع')}},
    {book:`<p>تبدأ الحواف المختفية عند إحدى الحواف المنظورة بشرطة وتنتهي أيضاً بشرطة عند نهاية الحافة المنظورة. يجب كذلك أن تبدأ الحواف المختفية عند الأركان بشرطة.</p>`,ref:'ص 25'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 26',0)}},
    {book:`<p>يراعى عدم استخدام الحواف المختفية في كتابة الأبعاد، أي أنه لا يجوز أن ترسم أية خطوط لتحديد الأبعاد من الحواف المختفية (يسمح بالتجاوز عن هذه القاعدة في حالة استحالة وجود خطوط أخرى لتحديد الأبعاد).</p>`,ref:'ص 26'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 26',1,'زاوية (مقطعها L): البعد 8 مأخوذ من حافة مختفية (خطأ)، ثم الأبعاد على المسقط الأفقي حيث تظهر الحواف (صواب)')}},
    {tip:`<p>اسأل نفسك عن كل حافة: لو نظرت في اتجاه هذا المسقط، هل بيني وبينها جزء من الجسم؟ إن كان نعم فهي <b>مختفية</b> (متقطعة)، وإلا فهي <b>ظاهرة</b> (كاملة). والشرطة عند الطرفين تجعل القارئ يرى بالضبط أين تبدأ الحافة وأين تنتهي؛ والفراغ عند الطرف يجعل الحافة تبدو أقصر من حقيقتها.</p>`,title:'سؤال واحد يكفي'},
    {title:'مختبر مصغّر: أي رسم صحيح؟',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقف من قواعد ص 25–26.',cases:[
     {q:'رسمت حافة مختفية بين حافتين ظاهرتين. كيف يبدأ خطها المتقطع وينتهي؟',opts:[['بفراغ عند الطرفين حتى لا يلمس الحافتين',false,'هذا هو الشكل «خطأ» في ص 26.'],['بشرطة عند كل طرف تلامس الحافة الظاهرة',true,'«تبدأ الحواف المختفية عند إحدى الحواف المنظورة بشرطة وتنتهي أيضاً بشرطة».'],['بأي شكل، المهم أن يكون متقطعاً',false,'للخط المتقطع قواعد: شرط متساوية، ويبدأ وينتهي بشرطة.']]},
     {q:'مستطيل مختفٍ داخل مسقط. ماذا يكون عند أركانه؟',opts:[['شرطتان متلاقيتان على شكل زاوية',true,'«يجب كذلك أن تبدأ الحواف المختفية عند الأركان بشرطة» (الشكل «صواب» ص 26).'],['فراغ عند كل ركن',false,'هذا الشكل «خطأ» في ص 26: الشرط لا تلتقي عند الأركان.']]},
     {q:'تريد وضع بعد لحافة تظهر مختفية في مسقط وظاهرة في مسقط آخر.',opts:[['تضعه على المسقط الذي تظهر فيه الحافة ظاهرة',true,'«لا يجوز أن ترسم أية خطوط لتحديد الأبعاد من الحواف المختفية» (ص 26)، كما في الزاوية L.'],['تضعه من الحافة المختفية لأنها أقرب',false,'هذا هو الشكل «خطأ» في ص 26؛ يسمح به فقط عند استحالة وجود خطوط أخرى.']]}]})}
   ]},

  {st:2,short:'مشغولة بروفيلية',title:'مشغولة بقطاع جانبي (بروفيلية)',ref:'ص 27',
   q:'مجرى مقطعه حرف C… كم حافة منه تراها من اليسار، وكم حافة تختفي خلف ظهره؟',
   get art(){const P=getP('C27');const D={F:[[[0,110],[0,0],8,{t:'110'}]],S:[[[0,0],[60,0],7,{t:'60'}]],T:[[[0,0],[25,0],6,{t:'25'}],[[40,0],[40,15],-8,{t:'15',fb:[25,15]}],[[0,30],[10,30],0,{t:'10',out:1,ext:false}],[[40,50],[40,60],-8,{t:'10',out:1}],[[0,60],[40,60],-7,{t:'40'}]]};
     const shf=v=>sheetSVG(P,{px:v,cl:false,dims:D});const b=DWS.fit(v=>shf(v).svg,30,26,300,268);const C=shf(b.px).C;
     const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('T'),'المسقط الأفقي: يبين المقطع حرف ⟦C⟧ بأبعاده: الطول الكلي 40، والجناح العلوي 25 وثخانته 15، والظهر ثخانته 10، والجناح السفلي ثخانته 10.',0)+DWS.tipR(b.M,...box('F'),'المسقط الرأسي (الارتفاع 110): الخطان المتقطعان حافتان داخليتان خلف السطح الأمامي.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي (العرض 60): بالنظر من اليسار يحجب ظهر المجرى ما خلفه، فتظهر بعض الحواف متقطعة.',0);
     return DWS.art('مشغولة بروفيلية بثلاثة مساقط',b.g+t,'#FBE6C4')},
   cap:'مشغولة بقطاع جانبي (لوحة ص 27): المساقط الثلاثة بأبعادها.<br><b>مرّر المؤشر على كل مسقط (أو المسه في الجوال) لتعرف ما يبينه.</b>',
   side:[
    {predict:{q:'في المسقط الرأسي للمجرى C خطان داخليان. لماذا رسما متقطعين؟',opts:[
     ['لأنهما خطا منتصف',false,'خط المنتصف شرطة ونقطة، وهذا الجسم غير متماثل يميناً ويساراً.'],
     ['لأنهما حافتان داخليتان يحجبهما عن الناظر جزء من الجسم',true,'خلفهما جزء من الجسم في اتجاه النظر، فهما حافتان مختفيتان (قاعدة ص 25).'],
     ['لأنهما حافتان صغيرتان',false,'نوع الخط لا يتعلق بطول الحافة بل بكونها ظاهرة أو مختفية.']]}}
   ],
   body:[
    {tip:`<p>هذه الصفحة في الكتاب <b>لوحة بلا نص</b>: مشغولة مرسومة على ورقة مربعات بمساقطها الثلاثة ومنظورها. تصلح تدريباً على «ارسم المسقط الناقص»: تعطى مسقطين وترسم الثالث، ثم تحدد أي حواف ظاهرة وأيها مختفية. (في تبويب «الأمثلة المحلولة» الحل خطوة بخطوة.)</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 27',0)}},
    {title:'مختبر مصغّر: حدد الحواف في المسقط الجانبي',widget:(el,B)=>DWS.typeLines(el,B,{part:'C27',miss:'S',intro:'نقلنا أركان المسقط الجانبي من المسقطين الرأسي والأفقي (بخط 45°). حدد نوع كل حافة: ظاهرة أم مختفية؟',done:'نراه من اليسار، فالحواف التي يحجبها ظهر المجرى متقطعة.'},getP,consPts,consSVG)}
   ]},

  {st:3,short:'خطوط المنتصف',title:'١-٩ خطوط المنتصف',ref:'ص 28–29',
   q:'جسم متماثل تماماً حول محور… كيف تخبر القارئ بذلك بخط واحد؟',
   get art(){const P=getP('U28');const shf=v=>sheetSVG(P,{px:v});const b=DWS.fit(v=>shf(v).svg,40,26,280,266);const C=shf(b.px).C;
     let t='';['F','T'].forEach(k=>centreLines(P,k).forEach(c=>{t+=DWS.tipR(b.M,C.T(k)(c.a),C.T(k)(c.b),k==='F'?'خط المنتصف في المسقط الرأسي: شرطة ونقطة بنصف ثخانة خط الحواف، يبدأ وينتهي بشرطة، ويقطع حافة الجسم ويتعداها قليلاً.':'خط المنتصف في المسقط الأفقي: مستقل عن خط المسقط الرأسي؛ لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر.',5)}));
     const [w,h]=C.size('S');t+=DWS.tipR(b.M,C.T('S')([0,0]),C.T('S')([w,h]),'المسقط الجانبي: الجسم غير متماثل في هذا الاتجاه حول محور رأسي، فلا خط منتصف فيه؛ والخط المتقطع حافة المجرى المختفية.',0);
     return DWS.art('جسم مقطعه U بخطوط المنتصف الصحيحة',b.g+t)},
   cap:'جسم مقطعه <span class="ltr">U</span> مرسوم صواباً (شكل ص 28).<br><b>مرّر المؤشر على خطي المنتصف وعلى المسقط الجانبي (أو المسها في الجوال) لتعرف القاعدة.</b>',
   side:[
    {predict:{q:'خط منتصف في المسقط الرأسي وآخر في المسقط الأفقي على امتداد واحد. هل تصلهما بخط واحد؟',opts:[
     ['نعم، يصبح الرسم أوضح',false,'هذا هو الخطأ رقم 3 في الكتاب.'],
     ['لا، لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر',true,'الكتاب (ص 28): «لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر (انظر الخطأ رقم 3)».'],
     ['نعم إذا كان الجسم متماثلاً',false,'التماثل سبب رسم خط المنتصف، لكن كل مسقط له خطه المستقل.']]}}
   ],
   body:[
    {book:`<p>يكون الجسم متماثلاً إذا أمكن تقسيمه بقطع (وهمي) إلى جزأين متساويين تماماً.<br>يرسم محور التماثل في تمثيل الأجسام المتماثلة كخط منتصف (خط محور). تبلغ ثخانة خط المنتصف نصف ثخانة خط الحواف الظاهرة.</p>`,ref:'ص 28'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 28',0)}},
    {book:`<p>يبدأ وينتهي خط المنتصف بشرطة (انظر الخطأ رقم 1)، على أن يقطع حافة الجسم ويتعداها (انظر الخطأ رقم 2). لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر (انظر الخطأ رقم 3).</p>`,ref:'ص 28'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 28',1)}},
    {book:`<p>ويدل خط المنتصف على أن الجسم متماثل حوله. ولهذا يجب أن تكتب الأبعاد على الرسم منسوبة إليه. كما أن خطوط الوسط تعتبر أيضاً خطوط مساعدة لتحديد الأبعاد. ولا يجوز استخدامها كخطوط أبعاد (انظر الخطأ رقم 4). لا يجوز أن ترسم خطوط المنتصف متخللة أرقام الأبعاد (انظر الخطأ رقم 5).</p>`,ref:'ص 28'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 29',0)}},
    {book:`<p>في حالة التماثل المزدوج تتقاطع خطوط المنتصف. تتقاطع خطوط المنتصف فقط عند الشرط (انظر الخطأ رقم 6).</p>`,ref:'ص 29'},
    {tip:`<p>الأخطاء الستة في سطر واحد: (1) يبدأ وينتهي بشرطة، (2) يتعدى الحافة، (3) لا يعبر بين المساقط، (4) ليس خط أبعاد، (5) لا يخترق الأرقام، (6) التقاطع عند الشرط. خط المنتصف <b>خط مساعد</b> تنسب إليه الأبعاد، لكنه ليس خط بعد بأسهم.</p>`,title:'الأخطاء الستة باختصار'},
    {title:'تحقق سريع: أخطاء خط المنتصف',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب قواعد ص 28–29.',items:[
     ['ينتهي خط المنتصف بنقطة عند طرفه.',false,'الخطأ رقم 1: «يبدأ وينتهي خط المنتصف بشرطة».'],
     ['يقطع خط المنتصف حافة الجسم ويتعداها قليلاً.',true,'وإلا فهو الخطأ رقم 2 (ص 28).'],
     ['يجوز وضع أسهم على خط المنتصف ليصبح خط البعد.',false,'الخطأ رقم 4: «ولا يجوز استخدامها كخطوط أبعاد».'],
     ['تعتبر خطوط المنتصف خطوطاً مساعدة لتحديد الأبعاد.',true,'«كما أن خطوط الوسط تعتبر أيضاً خطوط مساعدة لتحديد الأبعاد».'],
     ['يجوز أن يمر خط المنتصف عبر رقم البعد.',false,'الخطأ رقم 5: «لا يجوز أن ترسم خطوط المنتصف متخللة أرقام الأبعاد».'],
     ['في التماثل المزدوج يتقاطع خطا المنتصف عند فراغين.',false,'الخطأ رقم 6: «تتقاطع خطوط المنتصف فقط عند الشرط».']]})}
   ]},

  {st:4,short:'قطعة حرف I',title:'قطعة بشكل حرف I',ref:'ص 30',
   q:'قطعة متماثلة يميناً ويساراً وأماماً وخلفاً… كم خط منتصف ترسم في كل مسقط؟',
   get art(){const P=getP('I30');const D={F:[[[0,0],[60,0],7,{t:'60',tdx:-8}],[[0,110],[0,0],8,{t:'110'}],[[17.5,110],[42.5,110],-7,{t:'25',tdx:-5}],[[40,110],[40,90],0,{ext:false,t:'20',out:1}]],T:[[[0,40],[0,0],-7,{t:'40'}],[[0,40],[10,40],-7,{t:'10',out:1}],[[22,25],[22,15],0,{ext:false,t:'10',out:1}]]};
     const shf=v=>sheetSVG(P,{px:v,dims:D});const b=DWS.fit(v=>shf(v).svg,30,24,300,272);const C=shf(b.px).C;
     const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('T'),'المسقط الأفقي (مقطع ⟦I⟧): تماثل مزدوج، فخطا منتصف يتقاطعان عند شرطتين.',0)+DWS.tipR(b.M,...box('F'),'المسقط الرأسي: العرض 60 والارتفاع 110، والمجرى في أسفل العصب عرضه 25 وارتفاعه 20 ظاهر من الأمام.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي: حافتا العصب وسقف المجرى متقطعة، لأن الجناح الأيسر يحجبها عن الناظر من اليسار.',0);
     return DWS.art('قطعة بشكل حرف I بثلاثة مساقط',b.g+t,'#FBE6C4')},
   cap:'قطعة بشكل حرف <span class="ltr">I</span> (لوحة ص 30): المساقط الثلاثة بأبعادها.<br><b>مرّر المؤشر على كل مسقط (أو المسه في الجوال) لتعرف ما يبينه.</b>',
   side:[
    {predict:{q:'في المسقط الأفقي للقطعة I (متماثلة يميناً ويساراً، وأماماً وخلفاً) كم خط منتصف؟',opts:[
     ['خط واحد',false,'التماثل هنا مزدوج: حول محورين.'],
     ['خطان يتقاطعان عند شرطتين',true,'«في حالة التماثل المزدوج تتقاطع خطوط المنتصف… فقط عند الشرط» (ص 29).'],
     ['لا خطوط منتصف في المسقط الأفقي',false,'القطعة متماثلة، فيرسم محور التماثل خط منتصف.']]}}
   ],
   body:[
    {tip:`<p>لوحة بلا نص على ورقة مربعات: قطعة مقطعها <span class="ltr">I</span>، وفي أسفل عصبها مجرى. لاحظ خطوط المنتصف في المساقط الثلاثة، وتقاطعها في المسقط الأفقي عند الشرط، والحواف المختفية للعصب في المسقط الجانبي.</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l5','ص 30',0)}},
    {title:'مختبر مصغّر: حدد الحواف في المسقط الجانبي',widget:(el,B)=>DWS.typeLines(el,B,{part:'I30',miss:'S',intro:'نقلنا أركان المسقط الجانبي للقطعة I. حدد نوع كل حافة: ظاهرة أم مختفية؟ (خط المنتصف مرسوم في المسقطين الآخرين فقط هنا.)',done:'حافتا العصب وسقف المجرى خلف الجناح الأيسر، فهي متقطعة.'},getP,consPts,consSVG)}
   ]},

  {recap:[
   'الحواف المختفية ترسم خطاً متقطعاً بشرط متساوية، بنصف ثخانة الخط الكامل، ويبدأ وينتهي بشرطة، وتلتقي الشرط عند الأركان.',
   'لا توضع خطوط الأبعاد من الحواف المختفية إلا إذا استحال غير ذلك.',
   'محور التماثل يرسم خط منتصف (شرطة ونقطة) بنصف ثخانة خط الحواف: يبدأ وينتهي بشرطة، ويتعدى الحافة، ولا يمتد بين المساقط.',
   'خط المنتصف خط مساعد للأبعاد لا خط أبعاد، ولا يخترق الأرقام، وفي التماثل المزدوج تتقاطع الخطوط عند الشرط.']}
],
 theory:[
  {h:'١-٨ الحواف المختفية',ref:'ص 25',html:`<p>«ترسم الحواف المختفية (غير المنظورة) بالإضافة إلى الحواف الظاهرة في كل رسم حتى يسهل تحديد شكل المشغولة. (تعامل الأجسام الشفافة معاملة الأجسام غير الشفافة، أي أن الحواف الواقعة خلف سطوح الإسقاط ترسم كالحواف غير المنظورة)».</p>`},
  {fig:'',ref:'ص 25',caption:'قضيب في سطحه العلوي مجرى طولي: قاع المجرى خلف الوجه الأمامي فيظهر في المسقط الرأسي (اتجاه <span class="ltr">E</span>) خطاً متقطعاً (الأبعاد للتوضيح)',draw:()=>{const P=getP('bar25');return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(pictSVG(P,{px:340,arrows:[stdArrows(P,40)[0]],m:30}),360)}${wrap(sheetSVG(P,{px:340,labels:1,views:['F','S']}).svg,340)}</div>`}},
  {html:`<p>«ترسم الحواف المختفية كخط متقطع، ويبين الرسم المكتوب أسفله (صواب) النسبة بين الشرط المتساوية الطول والمسافات بينها. ويرسم الخط المتقطع بنصف ثخانة الخط الكامل».</p>`},
  {fig:'',ref:'ص 25',caption:'ثلاثة نماذج للخط المتقطع',draw:()=>{const r=(bad)=>svgOpen(200,70,'خط متقطع')+`<rect x="10" y="12" width="180" height="46" class="vl" style="fill:none"/>`+hidLn([10,35],[190,35],{bad})+'</svg>';
    return pairFig([[r('uneven'),'شرط غير متساوية',0],[r('gap'),'يبدأ وينتهي بفراغ',0],[r(),'شرط ومسافات متساوية',1]])}},
  {html:`<p>«تبدأ الحواف المختفية عند إحدى الحواف المنظورة بشرطة وتنتهي أيضاً بشرطة عند نهاية الحافة المنظورة. يجب كذلك أن تبدأ الحواف المختفية عند الأركان بشرطة».</p>`},
  {fig:'',ref:'ص 26',caption:'أركان الحواف المختفية: الشرط يجب أن تلتقي عند الأركان على شكل زاوية',draw:()=>{const rc=(bad)=>{let h=svgOpen(200,120,'أركان الحواف المختفية')+`<rect x="12" y="12" width="176" height="96" class="vl" style="fill:none"/>`;const q=[[40,34],[160,34],[160,86],[40,86]];for(let i=0;i<4;i++)h+=hidLn(q[i],q[(i+1)%4],{bad:bad?'gap':null});if(bad)q.forEach(p=>h+=`<circle cx="${p[0]}" cy="${p[1]}" r="7" style="fill:none;stroke:var(--stop);stroke-width:1.5"/>`);return h+'</svg>'};
    return pairFig([[rc(1),'الشرط لا تلتقي عند الأركان',0],[rc(0),'الأركان شرطتان متلاقيتان',1]])}},
  {html:`<p>«يراعى عدم استخدام الحواف المختفية في كتابة الأبعاد، أي أنه لا يجوز أن ترسم أية خطوط لتحديد الأبعاد من الحواف المختفية (يسمح بالتجاوز عن هذه القاعدة في حالة استحالة وجود خطوط أخرى لتحديد الأبعاد)».</p>`},
  {fig:'',ref:'ص 26',caption:'زاوية (مقطعها L) بثلاثة مساقط: البعد 8 مأخوذ من حافة مختفية (خطأ)، ثم الأبعاد نفسها على المسقط الأفقي حيث تظهر الحواف (صواب)',draw:()=>{const P=getP('L26');
    const w=sheetSVG(P,{px:320,cl:false,dims:{F:[[[0,0],[30,0],7,{t:'30'}],[[0,35],[0,0],7,{t:'35'}]],S:[[[0,0],[8,0],7,{t:'8',out:1,cls:'bad',tcls:'er'}]],T:[[[0,20],[0,0],-7,{t:'20'}]]},mark:C=>wrongX(C.W*C.s,C.H*C.s)}).svg;
    const r=sheetSVG(P,{px:320,cl:false,dims:{F:[[[0,0],[30,0],7,{t:'30'}],[[0,35],[0,0],7,{t:'35'}]],T:[[[0,20],[0,0],7,{t:'20'}],[[30,0],[30,8],7,{t:'8',out:1}],[[0,20],[8,20],-7,{t:'8',out:1}]]}}).svg;return pairFig([[w,'',0],[r,'',1]])}},
  {h:'مشغولة بقطاع جانبي (بروفيلية)',ref:'ص 27',html:'<p>لوحة مرسومة على ورقة مربعات بلا نص: مجرى مقطعه حرف <span class="ltr">C</span>. لاحظ الحواف الداخلية في المسقطين الرأسي والجانبي: خلفها جزء من الجسم فرسمت متقطعة. (في تبويب «الأمثلة المحلولة» استنتاج المسقط الجانبي خطوة بخطوة.)</p>'},
  {fig:'',ref:'ص 27',caption:'مشغولة بقطاع جانبي (بروفيلية): المساقط الثلاثة بأبعادها، والمنظور',draw:()=>{const P=getP('C27');return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(sheetSVG(P,{px:380,grid:5,cl:false,dims:{F:[[[0,110],[0,0],8,{t:'110'}]],S:[[[0,0],[60,0],7,{t:'60'}]],T:[[[0,0],[25,0],6,{t:'25'}],[[40,0],[40,15],-8,{t:'15',fb:[25,15]}],[[0,30],[10,30],0,{t:'10',out:1,ext:false}],[[40,50],[40,60],-8,{t:'10',out:1}],[[0,60],[40,60],-7,{t:'40'}]]}}).svg,400)}${wrap(pictSVG(P,{px:260,az:30,el:28,arrows:[stdArrows(P,50)[0]],m:24}),280)}</div>`}},
  {h:'١-٩ خطوط المنتصف',ref:'ص 28',html:`<p>«يكون الجسم متماثلاً إذا أمكن تقسيمه بقطع (وهمي) إلى جزأين متساويين تماماً. يرسم محور التماثل في تمثيل الأجسام المتماثلة كخط منتصف (خط محور). تبلغ ثخانة خط المنتصف نصف ثخانة خط الحواف الظاهرة».</p>`},
  {fig:'',ref:'ص 28',caption:'جسم مقطعه U بثلاثة مساقط: ثلاثة أخطاء شائعة في خطوط المنتصف (①②③)، والرسم الصواب',draw:()=>{const P=getP('U28');
    const w=sheetSVG(P,{px:300,cl:false,mark:C=>{let h='';const F=C.T('F'),T=C.T('T');
      h=ctrLn(F([15,0]),T([15,P.D+3.5]),{bad:'dot'})/* errors 2, 3 and 1 in one line: starts at the edge, runs across both views, ends with a dot */;
      h+=errMark([F([15,0])[0]+14,F([15,0])[1]-4],2)+errMark([F([15,P.H])[0]+14,(F([15,P.H])[1]+T([15,0])[1])/2],3)+errMark([T([15,P.D])[0]+14,T([15,P.D])[1]+2],1)+wrongX(C.W*C.s,C.H*C.s);return h}}).svg;
    const r=sheetSVG(P,{px:300}).svg;return pairFig([[w,'',0],[r,'',1]])}},
  {html:`<p>«يبدأ وينتهي خط المنتصف بشرطة (انظر الخطأ رقم 1)، على أن يقطع حافة الجسم ويتعداها (انظر الخطأ رقم 2). لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر (انظر الخطأ رقم 3)».</p>`},
  {fig:'',ref:'ص 28',caption:'الجسم نفسه بالأبعاد: خطآن شائعان في كتابة الأبعاد (④ خط المنتصف مستعمل خط أبعاد، ⑤ خط المنتصف يخترق الأرقام)، والرسم الصواب',draw:()=>{const P=getP('U28');
    const w=sheetSVG(P,{px:300,dims:{F:[[[15,P.H],[15,0],0,{ext:false,t:'35',tside:-0.2}],[[0,0],[30,0],7,{t:'3 0',tside:1}]],T:[[[15,0],[15,8],0,{ext:false,t:'8',out:1}],[[7.5,P.D],[22.5,P.D],-7,{t:'15',tdx:0}],[[0,18],[0,0],-7,{t:'18'}]]},mark:C=>{const F=C.T('F'),T=C.T('T');return errMark([F([15,P.H*0.3])[0]+16,F([15,P.H*0.3])[1]],4)+errMark([T([15,4])[0]+16,T([15,4])[1]],4)+errMark([F([15,-7])[0]+18,F([15,-7])[1]-6],5)+errMark([T([15,P.D+7])[0]+18,T([15,P.D+7])[1]+6],5)+wrongX(C.W*C.s,C.H*C.s)}}).svg;
    const r=sheetSVG(P,{px:300,dims:{F:[[[0,0],[30,0],7,{t:'30',tdx:-6}],[[0,35],[0,0],7,{t:'35'}]],T:[[[0,18],[0,0],7,{t:'18'}],[[7.5,P.D],[22.5,P.D],-7,{t:'15',tdx:-4}],[[18,0],[18,8],0,{ext:false,t:'8',out:1}]]}}).svg;return pairFig([[w,'',0],[r,'',1]])}},
  {html:`<p>«ويدل خط المنتصف على أن الجسم متماثل حوله. ولهذا يجب أن تكتب الأبعاد على الرسم منسوبة إليه. كما أن خطوط الوسط تعتبر أيضاً خطوطاً مساعدة لتحديد الأبعاد. ولا يجوز استخدامها كخطوط أبعاد (انظر الخطأ رقم 4). لا يجوز أن ترسم خطوط المنتصف متخللة أرقام الأبعاد (انظر الخطأ رقم 5)».</p>
   <p>«في حالة التماثل المزدوج تتقاطع خطوط المنتصف. تتقاطع خطوط المنتصف فقط عند الشرط (انظر الخطأ رقم 6)».</p>`},
  {fig:'',ref:'ص 29',caption:'تقاطع خطي منتصف في مربع',draw:()=>{const sq=(bad)=>svgOpen(160,160,'تقاطع خطي منتصف')+`<rect x="30" y="30" width="100" height="100" class="vl"/>`+ctrLn([18,80],[142,80],{bad:bad?'cross':null})+ctrLn([80,18],[80,142],{bad:bad?'cross':null})+(bad?errMark([104,56],6):'')+'</svg>';return pairFig([[sq(1),'تقاطع عند فراغ',0],[sq(0),'تقاطع عند شرطتين',1]],200)}},
  {h:'قطعة بشكل حرف I',ref:'ص 30',html:'<p>لوحة على ورقة مربعات: قطعة مقطعها <span class="ltr">I</span> وفي أسفل عصبها مجرى. لاحظ خطوط المنتصف في المساقط الثلاثة، وتقاطعها في المسقط الأفقي عند الشرط، والحواف المختفية للعصب في المسقط الجانبي.</p>'},
  {fig:'',ref:'ص 30',caption:'قطعة بشكل حرف I: المساقط الثلاثة بأبعادها، والمنظور',draw:()=>{const P=getP('I30');return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(sheetSVG(P,{px:380,grid:5,dims:{F:[[[0,0],[60,0],7,{t:'60',tdx:-8}],[[0,110],[0,0],8,{t:'110'}],[[17.5,110],[42.5,110],-7,{t:'25',tdx:-5}],[[40,110],[40,90],0,{ext:false,t:'20',out:1}]],T:[[[0,40],[0,0],-7,{t:'40'}],[[0,40],[10,40],-7,{t:'10',out:1}],[[22,25],[22,15],0,{ext:false,t:'10',out:1}]]}}).svg,400)}${wrap(pictSVG(P,{px:250,az:-30,el:26,arrows:[stdArrows(P,50)[0]],m:24}),280)}</div>`}},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> في المسقط الأفقي للقطعة <span class="ltr">I</span> خطا منتصف (تماثل مزدوج: يمين ويسار، وأمام وخلف)، ويتقاطعان عند شرطتين. وفي المسقط الجانبي خط منتصف رأسي واحد، وحافتا العصب متقطعتان لأن الجناح الأيسر يحجبهما.'}
 ],
 lab:(el)=>{
  let seed=1,R=chkRound(seed),pick=null,ans=null,score=0,n=0;const did={types:new Set()};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c7"><h2>مدقق «صواب أم خطأ» <small>قواعد ص 25–29</small></h2>
    <p class="sub">في كل رسم خطأ واحد في الحواف المختفية أو خطوط المنتصف، أو لا خطأ. <b>المس الخط الخطأ</b>، أو اضغط «الرسم صحيح».</p>
    <div class="dw-sheet" id="l5s" style="max-width:520px;margin-inline:auto"></div>
    <div class="dw-row"><button class="btn" id="l5ok">الرسم صحيح</button><button class="btn" id="l5sh">أين الخطأ؟</button><button class="btn primary" id="l5n">رسم جديد</button><span class="sub">النتيجة: <span class="dw-score" id="l5sc"></span></span></div>
    <div class="dw-msg" id="l5m"></div></div>
   <div class="panel c5"><h2>القواعد <small>ص 25–29</small></h2><div class="dw-chk" id="l5r"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const rules=[['hidSolid','الحافة المختفية خط متقطع، والظاهرة خط كامل عريض (ص 25)'],['dashGap','الخط المتقطع يبدأ وينتهي بشرطة، وعند الأركان شرطتان متلاقيتان (ص 25–26)'],['dashUneven','الشرط متساوية والمسافات بينها متساوية (ص 25)'],['clDot','خط المنتصف يبدأ وينتهي بشرطة (الخطأ ١، ص 28)'],['clShort','خط المنتصف يقطع حافة الجسم ويتعداها (الخطأ ٢، ص 28)'],['clJoin','لا يمتد خط المنتصف من مسقط إلى آخر (الخطأ ٣، ص 28)'],['clCross','تتقاطع خطوط المنتصف عند الشرط (الخطأ ٦، ص 29)']];
  const draw=(show)=>{$('#l5s').innerHTML=chkSVG(R,{pick,show});$('#l5sc').textContent=`${score} / ${n}`;
    $('#l5r').innerHTML=rules.map(([k,t])=>`<div class="${did.types.has(k)?'ok':''}"><i>${did.types.has(k)?'✓':'•'}</i><span>${t}</span></div>`).join('');
    const m=$('#l5m');if(ans==null){m.className='dw-msg';m.innerHTML=`الجسم: <b>${PDEF[R.pk].name}</b> <span class="ref">${PDEF[R.pk].ref}</span>`;return}
    const E=CHK_ERR[R.err];m.className='dw-msg '+(ans?'ok':'bad');
    m.innerHTML=(ans?'<b>صحيح.</b> ':'<b>ليس هذا.</b> ')+(R.err==='none'?'الرسم صحيح: كل الحواف المختفية متقطعة تبدأ وتنتهي بشرطة، وخطوط المنتصف صحيحة.':`الخطأ: <b>${E.t}</b> (بالأحمر). ${E.x} <span class="ref">${E.ref}</span>`)};
  const judge=ok=>{if(ans!=null)return;ans=ok;n++;if(ok){score++;if(R.err!=='none')did.types.add(R.err==='visDash'?'hidSolid':R.err);else did.none=1}draw(true)};
  $('#l5s').addEventListener('click',e=>{const t=e.target.closest('[data-i]');if(!t||ans!=null)return;pick=+t.dataset.i;const el2=R.els[pick];judge(R.bad.includes(el2))});
  $('#l5ok').onclick=()=>judge(R.err==='none');
  $('#l5sh').onclick=()=>{if(ans==null){ans=false;n++}draw(true)};
  $('#l5n').onclick=()=>{seed++;R=chkRound(seed);pick=null;ans=null;draw()};
  const st=stepsUI($('#l5st'),[
   {t:'أول رسم',x:'ابحث عن الخطأ في الرسم الأول والمسه، أو اضغط «الرسم صحيح». ثم اضغط «رسم جديد».',done:()=>n>=1},
   {t:'خمس إجابات صحيحة',x:'تابع حتى تحصل على خمس إجابات صحيحة.',done:()=>score>=5},
   {t:'قاعدة في الحواف المختفية',x:'اكتشف خطأً واحداً على الأقل في الحواف المختفية (تظهر علامة ✓ بجانب القاعدة).',done:()=>['hidSolid','dashGap','dashUneven'].some(k=>did.types.has(k))},
   {t:'قاعدة في خطوط المنتصف',x:'اكتشف خطأً واحداً على الأقل في خطوط المنتصف.',done:()=>['clDot','clShort','clJoin','clCross'].some(k=>did.types.has(k))},
   {t:'رسم بلا خطأ',x:'عندما يكون الرسم صحيحاً اضغط «الرسم صحيح».',done:()=>did.none}]);
  draw();loopOn(el,()=>st.check())},
 examples:(()=>{const C27=getP('C27'),I=getP('I30');const pc=consPts(C27,'S').pts,pi=consPts(I,'F').pts;
  return [
  drawnEx('استنتاج المسقط الجانبي للمشغولة البروفيلية','ص 27','<p>«ارسم المسقط الناقص» (نشاط على لوحة ص 27): معلوم المسقطان الرأسي والأفقي للمجرى ذي المقطع <span class="ltr">C</span>. استنتج المسقط الجانبي، وحدد الحواف المختفية فيه.</p>',[
   ['المعطى: المسقط الرأسي (عرضه 40، ارتفاعه 110، وفيه خطان متقطعان) والمسقط الأفقي (شكل <span class="ltr">C</span>).',consSVG(C27,'S',{helper:false,px:420})],
   ['ارسم خط 45° من الركن الأيمن السفلي للمسقط الرأسي، وانقل أعماق المسقط الأفقي (0، 15، 50، 60) إليه ثم إلى أعلى، ومن المسقط الرأسي ارسم خطَّي الارتفاع.',consSVG(C27,'S',{pts:pc,cur:'all',target:'grey',px:420})],
   ['الخطان عند العمقين 15 و50 هما الوجهان الداخليان للجناحين. ننظر من اليسار فيحجبهما ظهر المجرى (عرضه 10)، فهما <b>حافتان مختفيتان</b>: خط متقطع يبدأ وينتهي بشرطة.',consSVG(C27,'S',{pts:pc,cur:-1,target:'final',px:420})],
   ['أكمل الرسم بالأبعاد: عرض المسقط الجانبي 60 والارتفاع 110.',sheetSVG(C27,{px:420,cl:false,dims:{F:[[[0,110],[0,0],8,{t:'110'}]],S:[[[0,0],[60,0],7,{t:'60'}]]}}).svg]]),
  drawnEx('استنتاج المسقط الرأسي للقطعة I','ص 30','<p>«ارسم المسقط الناقص» (نشاط على لوحة ص 30): معلوم المسقطان الجانبي والأفقي. استنتج المسقط الرأسي بنقل الحواف، وارسم خط المنتصف.</p>',[
   ['المعطى: المسقط الجانبي والمسقط الأفقي (مقطع <span class="ltr">I</span>).',consSVG(I,'F',{px:420})],
   ['انقل الحواف: خطوط أفقية من المسقط الجانبي (الارتفاع 110 وسقف المجرى 20)، وخطوط رأسية من المسقط الأفقي (0، 10، 17.5، 42.5، 50، 60).',consSVG(I,'F',{pts:pi,cur:'all',target:'grey',px:420})],
   ['الوجهان الداخليان للجناحين (عند 10 و50) والمجرى ظاهرة من الأمام فترسم بخط كامل.',consSVG(I,'F',{pts:pi,cur:-1,target:'final',px:420})],
   ['ارسم خط المنتصف الرأسي في المسقط الرأسي: يبدأ وينتهي بشرطة، ويتعدى الحافتين، ولا يتصل بخط منتصف المسقط الأفقي.',sheetSVG(I,{px:420})]])]})(),
 quiz:[
  {q:'كيف ترسم الحافة المختفية؟',o:['خط كامل عريض','خط متقطع بنصف ثخانة الخط الكامل','خط شرطة ونقطة','خط كامل رفيع'],c:1,e:'ص 25.'},
  {q:'الخط المتقطع للحافة المختفية يجب أن:',o:['يبدأ وينتهي بفراغ','يبدأ وينتهي بشرطة','يبدأ بنقطة','لا يلمس الحواف الظاهرة'],c:1,e:'ص 25: «تبدأ الحواف المختفية عند إحدى الحواف المنظورة بشرطة وتنتهي أيضاً بشرطة».'},
  {q:'هل يجوز وضع البعد من حافة مختفية؟',o:['نعم دائماً','لا، إلا إذا استحال وجود خطوط أخرى لتحديد الأبعاد','نعم في المسقط الجانبي فقط','لا يوجد قاعدة'],c:1,e:'ص 26.'},
  {q:'أي مما يأتي خطأ في رسم خط المنتصف؟',o:['يبدأ وينتهي بشرطة','يتعدى حافة الجسم قليلاً','يمتد من المسقط الرأسي إلى المسقط الأفقي دون انقطاع','ثخانته نصف ثخانة خط الحواف الظاهرة'],c:2,e:'«لا يجوز أن تمتد خطوط المنتصف من مسقط إلى آخر» (الخطأ 3، ص 28).'},
  {q:'عند تقاطع خطي منتصف (تماثل مزدوج) يجب أن يتقاطعا عند:',o:['النقاط','الفراغات','الشرط','أي موضع'],c:2,e:'ص 29، الخطأ 6.'},
  {q:'هل يستعمل خط المنتصف خطاً للأبعاد؟',o:['نعم','لا، لكنه يعتبر خطاً مساعداً لتحديد الأبعاد','نعم إذا كان البعد صغيراً','فقط في المسقط الأفقي'],c:1,e:'ص 28: «ولا يجوز استخدامها كخطوط أبعاد (الخطأ رقم 4)».'}
 ]
});

/* =====================================================================
   LESSON 6 — الزوايا والتجاويف النافذة (ص 31–36)
   ===================================================================== */
PDEF.U35={name:'كتلة U بفتحة نافذة',ref:'ص 35',sym:{x:[22.5]},pieces:[[[0,15,0,10,0,55]],[[30,45,0,10,0,55]],[[15,30,0,10,0,10]],[[15,30,0,10,30,55]],[[0,10,10,25,0,55]],[[35,45,10,25,0,55]]]};
/* V-block of ص 31: width 60, height 40, V apex 15 above the base (depth 25), symmetric */
function vBlockSVG(o){const s=3.6,pad=16,T=q=>[(q[0]+pad)*s,(q[1]+pad*0.9)*s];const hw=o.hw;let h=svgOpen((60+pad*2)*s,(40+pad*1.9)*s,'كتلة بمجرى V');
  h+=plyl([[0,0],[30-hw,0],[30,25],[30+hw,0],[60,0],[60,40],[0,40]].map(T),'vl',true,' style="fill:var(--surface-2)"');
  h+=ctrLn(T([30,-4]),T([30,44]));h+=dim(T,[0,40],[60,40],-8,{t:'60'})+dim(T,[0,40],[0,0],8,{t:'40'})+dim(T,[0,40],[0,25],16,{t:'15',fb:[30,25],noB:0});
  if(o.mode==='a')h+=adim(T,[30,25],13,90-o.ang/2,90+o.ang/2,o.angT);else h+=dim(T,[30+hw,0],[60,0],7,{t:o.shT});
  return h+'</svg>'}
function slantPlate(m){const s=4,pad=14,T=q=>[(q[0]+pad)*s,(q[1]+pad*0.9)*s];let h=svgOpen((35+pad*2)*s,(35+pad*1.8)*s,'لوح بحافة مائلة');
  h+=plyl([[0,0],[35,0],[35,35],[0,15]].map(T),'vl',true,' style="fill:var(--surface-2)"');h+=dim(T,[0,0],[35,0],7,{t:'35'})+dim(T,[35,35],[35,0],-8,{t:'35'});
  h+=m===1?dim(T,[0,15],[0,0],7,{t:'15'}):adim(T,[35,35],12,90,150.26,'60°');return h+'</svg>'}
function radiiSVG(){const W=420,H=120;let h=svgOpen(W,H,'طرق كتابة نصف قطر الانحناء');
  const corner=(x,y,r,kind,t)=>{let q=`<path d="M${x-40} ${y}H${x-r}A${r} ${r} 0 0 1 ${x} ${y+r}V${y+70}" class="vl"/>`;const c=[x-r,y+r];
    q+=kind==='+'?`<path d="M${c[0]-5} ${c[1]}h10M${c[0]} ${c[1]-5}v10" class="tn"/>`:kind==='o'?`<circle cx="${c[0]}" cy="${c[1]}" r="2" class="tn"/>`:`<circle cx="${c[0]}" cy="${c[1]}" r="1.4" class="ar"/>`;
    const a=-Math.PI/4,px=c[0]+r*Math.cos(a),py=c[1]+r*Math.sin(a);
    if(t==='in'){q+=ln(c,[px,py],'dm')+arrowHead([px,py],[Math.cos(a),Math.sin(a)],7)+tx((c[0]+px)/2-6,(c[1]+py)/2-2,'8','dt','middle')}
    else{const ox=px+18*Math.cos(a),oy=py+18*Math.sin(a);q+=ln([px,py],[ox,oy],'dm')+arrowHead([px,py],[-Math.cos(a),-Math.sin(a)],7)+tx(ox+4,oy-2,t,'dt','start')}return q};
  h+=corner(95,22,32,'+','in')+corner(200,22,16,'+','4')+corner(290,22,12,'o','3')+corner(380,22,4,'.','1');return h+'</svg>'}

B.lesson({
 id:'u1-l6',unit:1,order:6,pages:'31–36',
 title:'الزوايا والتجاويف النافذة',
 summary:'الزاوية غير القائمة تحدد إما بقيمتها بالدرجات (خط البعد قوس مركزه رأس الزاوية) وإما بأطوال الحواف. والتجويف النافذ يرسم بحواف مرئية، وتحدد أبعاده وموضعه بالنسبة لحواف الجسم الخارجية.',
 stations:[
  {intro:true},

  {st:1,short:'تمثيل الزوايا',title:'١-١٠ تمثيل الزوايا وكتابة أبعادها',ref:'ص 31–32',
   q:'حافة مائلة في قطعة… هل تكتب زاويتها بالدرجات، أم أطوال حوافها بالمليمتر؟',
   get art(){const gen=(m,v)=>{const s=v/63,pad=14,T=q=>[(q[0]+pad)*s,(q[1]+pad*0.9)*s];let h=svgOpen(63*s,(35+pad*1.8)*s,'لوح بحافة مائلة');
      h+=plyl([[0,0],[35,0],[35,35],[0,15]].map(T),'vl',true,' style="fill:var(--surface-2)"')+dim(T,[0,0],[35,0],7,{t:'35'})+dim(T,[35,35],[35,0],-8,{t:'35'});
      h+=m===1?dim(T,[0,15],[0,0],7,{t:'15'}):adim(T,[35,35],12,90,150.26,'60°');return h+'</svg>'};
     const a=DWS.fit(v=>gen(1,v),18,70,160,170),b=DWS.fit(v=>gen(2,v),182,70,160,170);
     let t=DWS.tip(18,70,160,170,'الأسلوب الأول: بأطوال الحواف — ⟦35⟧ أعلى، و⟦15⟧ للضلع الأيسر، و⟦35⟧ للضلع الأيمن.')+DWS.tip(182,70,160,170,'الأسلوب الثاني: بقيمة الزاوية ⟦60°⟧؛ خط البعد قوس مركزه رأس الزاوية، مع الحافتين ⟦35⟧ و⟦35⟧.');
     return DWS.art('لوح بحافة مائلة بأسلوبين لكتابة الأبعاد',a.g+b.g+t+DWS.txt(98,262,'بأطوال الحواف',{fs:13,b:1})+DWS.txt(262,262,'بالزاوية',{fs:13,b:1}))},
   cap:'لوح بحافة مائلة بأسلوبين (شكلا ص 31).<br><b>مرّر المؤشر على كل شكل (أو المسه في الجوال) لتعرف أسلوبه.</b>',
   side:[
    {predict:{q:'عند كتابة الزاوية بالدرجات، ما شكل خط البعد؟',opts:[
     ['خط مستقيم موازٍ للحافة',false,'هذا لأبعاد الأطوال.'],
     ['قوس مركزه رأس الزاوية',true,'الكتاب (ص 31): «وفي الحالة الأخيرة يكون خط البعد عبارة عن قوس مركزه رأس الزاوية».'],
     ['خط منتصف',false,'خط المنتصف لا يستعمل خط أبعاد (ص 28).']]}}
   ],
   body:[
    {book:`<p>تكون الحواف المتقاربة والمتباعدة للأجسام زاوية. لا بد من تحديدها إذا اختلفت قيمتها عن <span class="ltr">90°</span> وذلك بوضع أبعادها على الرسم.<br>توضع أبعاد الأجسام ذات الزوايا غير القائمة بأسلوبين: إما بتحديد أطوال الحواف، أو بتحديد قيم الزوايا بالدرجات. وفي الحالة الأخيرة يكون خط البعد عبارة عن قوس مركزه رأس الزاوية.</p>`,ref:'ص 31'},
    {watch:`<p>جملة الأسلوبين في الكتاب (ص 31) ناقصة: «توضع أبعاد الأجسام ذات الزوايا غير القائمة بأسلوبين، إما بتحديد قيم الزوايا بالدرجات» ولا يذكر الأسلوب الثاني؛ أكملناها من الشكل: «إما بتحديد أطوال الحواف، أو بتحديد قيم الزوايا بالدرجات»، و«الحالة الأخيرة» هي الزوايا بالدرجات.</p>`,fix:true},
    {book:`<p>لا يمكن من المقارنة المبدئية للأسلوبين السابقين التعرف على ميزة لأحدهما على الآخر. فمقادير الأبعاد الواجب وضعها متساوية في الحالتين. وعند اختيار طريقة التشغيل يصبح من الضروري تحديد القيم الواجب التقيد بها بدقة، فإما التقيد بقيم الزوايا أو بقيم أطوال الحواف، فتحديد قيم الزوايا يؤدي لأطوال حواف تختلف قيمها عن الأعداد الصحيحة وتحتوي على كسور عشرية متعددة الخانات بعد الفاصلة. أما تحديد أطوال الأضلاع فيؤدي أحياناً إلى زوايا قيمها ليست بالضرورة أن تكون أعداداً صحيحة.</p>`,ref:'ص 31'},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 31',1)}},
    {watch:`<p>الشكلان في الكتاب (ص 31) مرسومان كأنهما القطعة نفسها، وهما لا يتطابقان: بعمق المجرى <span class="ltr">40 − 15 = 25</span> وزاوية <span class="ltr">80°</span> يكون عرض الكتف <span class="ltr">(60 − 2 × 25 × tan 40°) ÷ 2 ≈ 9.0</span> لا 14، وبكتف 14 تكون الزاوية <span class="ltr">2 × atan(16 ÷ 25) ≈ 65.2°</span> (حساب ليس من الكتاب). رسمنا كل شكل بأبعاده. وهذا يوافق فكرة النص: تحديد أحد الأسلوبين يعطي للآخر قيماً غير صحيحة.</p>`,fix:true},
    {book:`<p>في المثلث المرسوم، إذا كان ارتفاع المثلث هو البعد الهام المطلوب فلا بد من وضع البعد موازياً لارتفاع المثلث (<span class="ltr">h</span>)، أما إذا كان طول ضلع المثلث هو البعد الهام فيجب وضع البعد موازياً لهذا الضلع (<span class="ltr">s</span>).</p>`,ref:'ص 32'},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 32',0)}},
    {tip:`<p>الزاوية والأطوال وجهان لشكل واحد؛ لكن الورشة تحتاج قيمة واحدة <b>تتقيد بها بدقة</b>. إن كتبت الزاوية، صار طول الحافة نتيجة حسابية بكسور، والعكس. لذلك اكتب القيمة التي تهم وظيفة القطعة: زاوية المجرى إن كانت مهمة، أو طول الكتف إن كان هو المهم. والمثلث كذلك: البعد المهم يوضع موازياً لما يقيسه.</p>`,title:'أيهما تكتب؟'},
    {title:'مختبر مصغّر: الزاوية أم الطول؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اللوح ص 31: الضلع العلوي <span class="ltr">35</span> والأيمن <span class="ltr">35</span>. غيّر طول الضلع الأيسر (أرقام تختارها أنت، والكتاب <span class="ltr">15</span>) وشاهد الزاوية الناتجة بين الحافة المائلة والضلع الأيمن.',
     predict:{q:'إذا حددنا الضلع الأيسر <span class="ltr">15</span> بالضبط، هل تخرج الزاوية عدداً صحيحاً تماماً؟',opts:[['نعم، 60° بالضبط',false,'الحساب يعطي <span class="ltr">atan(35 ÷ 20) ≈ 60.26°</span>، فالكتاب قرّبها.'],['لا، تخرج بكسور عشرية (نحو <span class="ltr">60.26°</span>)',true,'«تحديد أطوال الأضلاع يؤدي أحياناً إلى زوايا قيمها ليست بالضرورة أن تكون أعداداً صحيحة» (ص 31).']]},
     ins:[{k:'e',l:'طول الضلع الأيسر',min:0,max:30,step:0.5,v:15,dp:1}],
     calc:s=>{const e=s.e,ang=Math.atan(35/(35-e))*180/Math.PI,sc=3.6,pd=14,T=q=>[(q[0]+pd)*sc,(q[1]+pd*0.9)*sc];
      let g=svgOpen((35+pd*2)*sc,(35+pd*1.8)*sc,'لوح بحافة مائلة')+plyl([[0,0],[35,0],[35,35],[0,e]].map(T),'vl',true,' style="fill:var(--surface-2)"')+dim(T,[0,0],[35,0],7,{t:'35'})+dim(T,[35,35],[35,0],-8,{t:'35'})+(e>0.4?dim(T,[0,e],[0,0],7,{t:fm(e,1)}):'');
      g+=adim(T,[35,35],12,90,90+ang,fm(ang,2)+'°')+'</svg>';
      return {pic:`<div class="dw-sheet" style="max-width:300px;margin-inline:auto">${g}</div>`,facts:[['الضلع الأيسر',fm(e,1)],['الزاوية الناتجة',fm(ang,2)+'°','hi']],msg:Math.abs(ang-Math.round(ang))<0.005?'الزاوية هنا عدد صحيح.':'الزاوية بكسور عشرية: لو كتبناها على الرسم لاحتاجت الورشة إلى دقة لا داعي لها؛ ولو كتبنا زاوية مقربة لتعارضت مع الأطوال.'}}})}
   ]},

  {st:2,short:'زاوية مشطوبة',title:'زاوية ذات أسطح مشطوبة',ref:'ص 33',
   q:'مجرى على شكل V منحوت في جانب القطعة… في أي مسقط تظهر زاويته الحقيقية؟',
   get art(){const P=getP('L33');const hw=20*Math.tan(Math.PI/6);const D={F:[[[0,120],[0,0],8,{t:'120'}],[[40,0],[60,0],8,{t:'20',fa:[40,0],fb:[60,40]}],[[60,120],[60,40],-8,{t:'80'}]],S:[[[40,0],[40,40],-8,{t:'40',fb:[20,40]}],[[20,40-hw-6],[40,40-hw-6],0,{t:'20',fa:[20,40],ext:true}]],T:[[[0,0],[60,0],7,{t:'60'}],[[0,40],[0,0],-7,{t:'40'}],[[60,0],[60,10],-8,{t:'10',out:1}],[[0,40],[10,40],-7,{t:'10',out:1}]]};
     const shf=v=>sheetSVG(P,{px:v,cl:false,dims:D,mark:C=>{const S=C.T('S');return adim(q=>S(q),[20,40],9,-30,30,'60°')}});const b=DWS.fit(v=>shf(v).svg,40,24,280,272);const C=shf(b.px).C;
     const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('F'),'المسقط الرأسي: الشطف في أعلى الذراع يظهر حافة مائلة (البعدان 20 و80).',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي: مجرى ⟦V⟧ بزاوية ⟦60°⟧ يظهر بشكله الحقيقي، رأسه على عمق 40 من الأعلى و20 من الحافة اليمنى.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي: شكل ⟦L⟧ — الذراع 60 وثخانته 10، والساق ثخانتها 10، والعمق 40.',0);
     return DWS.art('زاوية ذات أسطح مشطوبة بثلاثة مساقط',b.g+t,'#FBE6C4')},
   cap:'زاوية ذات أسطح مشطوبة (لوحة ص 33): المساقط الثلاثة بأبعادها.<br><b>مرّر المؤشر على كل مسقط (أو المسه في الجوال) لتعرف ما يبينه.</b>',
   side:[
    {predict:{q:'المجرى V محفور في الوجه الخارجي للساق، وأضلاعه عمودية على مستوى الإسقاط الجانبي. أين تظهر زاويته 60° حقيقية؟',opts:[
     ['في المسقط الرأسي',false,'في المسقط الرأسي يظهر المجرى خطوطاً أفقية قصيرة فقط.'],
     ['في المسقط الجانبي',true,'مقطع المجرى يوازي مستوى الإسقاط الجانبي فيظهر بشكله الحقيقي (قاعدة ص 19)، ولهذا كتب البعد 60° هناك.'],
     ['في المسقط الأفقي',false,'في المسقط الأفقي يظهر المجرى خطاً متقطعاً لرأسه المختفي.']]}}
   ],
   body:[
    {tip:`<p>لوحة بلا نص على ورقة مربعات: زاوية (مقطع <span class="ltr">L</span>) طولها 120، طرف ذراعها مشطوب، وفي ساقها مجرى على شكل <span class="ltr">V</span> زاويته <span class="ltr">60°</span>. لاحظ قاعدة الزوايا: كتبت الزاوية في المسقط الذي تظهر فيه بشكلها الحقيقي، والشطف حدد بأطوال حوافه (20 و80).</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 33',0)}},
    {title:'مختبر مصغّر: حدد الحواف في المسقط الرأسي',widget:(el,B)=>DWS.typeLines(el,B,{part:'L33',miss:'F',intro:'نقلنا أركان المسقط الرأسي من المسقطين الجانبي والأفقي. حدد نوع كل حافة: ظاهرة أم مختفية؟',done:'المجرى V في الوجه الخارجي للساق؛ انظر أي حوافه يراها الناظر من الأمام.'},getP,consPts,consSVG)}
   ]},

  {st:3,short:'التجاويف النافذة',title:'١-١١ أجسام ذات تجاويف نافذة',ref:'ص 33–35',
   q:'فتحة مستطيلة في لوح… يكفي أن تكتب عرضها وارتفاعها؟',
   get art(){const P=getP('P34');const D={F:[[[0,60],[0,0],16,{t:'60'}],[[0,60],[0,15],8,{t:'45'}],[[25,0],[50,0],7,{t:'25'}],[[20,8],[40,8],0,{ext:false,t:'20'}],[[40,8],[50,8],0,{ext:false,t:'10',out:1}],[[12,60],[12,50],0,{ext:false,t:'15',out:1}],[[12,50],[12,15],0,{ext:false,t:'35'}]],S:[[[0,0],[15,0],7,{t:'15'}]],T:[[[0,15],[50,15],-7,{t:'50'}]]};
     const shf=v=>sheetSVG(P,{px:v,cl:false,dims:D});const b=DWS.fit(v=>shf(v).svg,26,30,308,262);const C=shf(b.px).C;const F=C.T('F');
     let t=DWS.tipR(b.M,F([20,10]),F([40,45]),'الفتحة النافذة: تمثل بحواف مرئية في المسقط الرأسي. أبعادها: العرض 20 والارتفاع 35.',0)+DWS.tipR(b.M,F([40,2]),F([50,12]),'بعد موضع الفتحة: 10 من الحافة اليمنى (موضوع داخل الجسم).',0)+DWS.tipR(b.M,F([6,48]),F([18,61]),'بعد موضع الفتحة: 15 من القاعدة (موضوع داخل الجسم).',0);
     const [w,h]=C.size('S');t+=DWS.tipR(b.M,C.T('S')([0,0]),C.T('S')([w,h]),'المسقط الجانبي (الثخانة 15): سقف الفتحة وأرضيتها خطان متقطعان، لأنهما داخل الجسم.',0);
     return DWS.art('لوح بفتحة نافذة وأبعاد موضعها',b.g+t)},
   cap:'لوح بركن مشطوب وفتحة مستطيلة نافذة (شكل ص 34).<br><b>مرّر المؤشر على الفتحة وأبعاد موضعها والمسقط الجانبي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'رسمت فتحة نافذة وكتبت عرضها وارتفاعها فقط. ما الذي ينقص؟',opts:[
     ['لا ينقص شيء',false,'الفني لا يعرف أين يثقبها في اللوح.'],
     ['أبعاد موضعها بالنسبة لحواف الجسم الخارجية',true,'الكتاب (ص 34): «ولا يكفي لتحديده وضع أبعاده فقط، بل يجب أيضاً وضع الأبعاد المحددة لموضعه بالنسبة لحواف الجسم الخارجية».'],
     ['رسمها بخط متقطع',false,'التجويف النافذ يمثل «بحواف مرئية» في المسقط الذي تظهر فيه.']]}}
   ],
   body:[
    {book:`<p>إذا كان هناك جسم ذو تجويف نافذ، لا يؤثر على الشكل الخارجي والأبعاد الخارجية للجسم، فيطلق عليه (جسم مثقوب) ويشكل التجويف عند تشغيل الجسم إما بالسباكة أو الثقب أو بالتفريز أو بغيرها.</p><p>يمثل التجويف النافذ بالجسم بحواف مرئية. ولا يكفي لتحديده وضع أبعاده فقط، بل يجب أيضاً وضع الأبعاد المحددة لموضعه بالنسبة لحواف الجسم الخارجية. ويمكن وضع الأبعاد داخل الجسم أو الاستعانة بخطوط أبعاد مساعدة خارجة عن الجسم.</p>`,ref:'ص 33–34'},
    {book:`<p>في الجسم المتماثل، إذا كان التجويف النافذ متماثلاً حول خط المنتصف يجب وضع أبعاده بالنسبة للحواف الخارجية طالما لم يتحدد وضعه تماماً من تماثله حول خط المنتصف.<br>وإذا احتوت القطعة على حواف منحنية متعددة لها نفس نصف قطر الانحناء فيعطى في العادة نصف قطر انحناء إحداها فقط.<br>ويرسم السهم الدال على بعد نصف قطر الانحناء من الداخل كلما أمكن، أما إذا لم يسمح الحيز المتاح بذلك فمن الممكن رسمه من الخارج ليلامس رأسه قوس الانحناء. وعلى قدر الحيز المتاح يمثل مركز قوس الدائرة إما بعلامة (+) أو بدائرة صغيرة أو بنقطة.</p>`,ref:'ص 35'},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 35',0)}},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 35',1)}},
    {tip:`<p>الفتحة تحتاج نوعين من الأبعاد: <b>أبعاد الحجم</b> (كم عرضها وارتفاعها) و<b>أبعاد الموضع</b> (أين هي من الحواف الخارجية). في الجسم المتماثل يحدد خط المنتصف موضعها في اتجاه واحد، فيبقى بعد الموضع في الاتجاه الآخر (مثل 10 من القاعدة في كتلة <span class="ltr">U</span>). والأركان المتساوية الاستدارة يكفيها بعد نصف قطر واحد.</p>`,title:'حجم وموضع'},
    {title:'مختبر مصغّر: صنّف أبعاد اللوح',widget:(el,B)=>DCML.sort(el,B,{intro:'أبعاد لوح ص 34: صنّف كل بعد.',cats:['حجم الفتحة','موضع الفتحة','الشكل الخارجي'],items:[
     ['البعد 20 (عرض الفتحة)',0,'من أبعاد الفتحة نفسها.'],
     ['البعد 10 (من الفتحة إلى الحافة اليمنى)',1,'يحدد موضع الفتحة بالنسبة للحافة الخارجية.'],
     ['البعد 60 (الارتفاع الكلي)',2,'بعد خارجي للوح.'],
     ['البعد 15 (من القاعدة إلى أسفل الفتحة)',1,'يحدد موضع الفتحة رأسياً.'],
     ['البعد 35 (ارتفاع الفتحة)',0,'من أبعاد الفتحة نفسها.'],
     ['البعد 45 (ارتفاع الحافة اليسرى حتى الشطف)',2,'يحدد الشكل الخارجي (الشطف).']]})}
   ]},

  {st:4,short:'قطعة انزلاق',title:'قطعة انزلاق',ref:'ص 36',
   q:'مجرى علوي ينتهي بسطح مائل خلف الجدار… كيف يظهر في المسقط الجانبي؟',
   get art(){const P=getP('S36');const D={F:[[[0,0],[70,0],13,{t:'70'}],[[15,0],[55,0],6,{t:'40'}],[[0,120],[0,0],22,{t:'120'}],[[0,10],[0,0],8,{t:'10',fa:[15,10]}],[[0,120],[0,100],8,{t:'20'}],[[0,100],[0,50],8,{t:'50',fa:[10,100],fb:[10,50]}],[[70,120],[70,110],-8,{t:'10',out:1,fa:[50,120],fb:[50,110]}],[[70,110],[70,30],-8,{t:'80',fa:[50,110],fb:[50,30]}],[[60,50],[70,50],-6,{t:'10',out:1}],[[20,70],[50,70],0,{ext:false,t:'30'}]],S:[[[0,0],[40,0],7,{t:'40'}]]};
     const shf=v=>sheetSVG(P,{px:v,dims:D});const b=DWS.fit(v=>shf(v).svg,34,22,292,276);const C=shf(b.px).C;
     const box=k=>{const [w,h]=C.size(k);return [C.T(k)([0,0]),C.T(k)([w,h])]};
     let t=DWS.tipR(b.M,...box('F'),'المسقط الرأسي (70 × 120): مجرى علوي عرضه 40، ومجريان جانبيان ارتفاعهما 50، وفتحة نافذة 30 × 80 على ارتفاع 10 من القاعدة.',0)+DWS.tipR(b.M,...box('S'),'المسقط الجانبي (العرض 40): السطح المائل في نهاية المجرى العلوي وسقف الفتحة وأرضيتها خطوط متقطعة؛ حافتا المجريين الجانبيين كاملة.',0)+DWS.tipR(b.M,...box('T'),'المسقط الأفقي: خطوط رأسية كاملة ومتقطعة لحواف المجاري والفتحة، وخط منتصف.',0);
     return DWS.art('قطعة انزلاق بثلاثة مساقط',b.g+t,'#FBE6C4')},
   cap:'قطعة انزلاق (لوحة ص 36): المساقط الثلاثة بأبعادها.<br><b>مرّر المؤشر على كل مسقط (أو المسه في الجوال) لتعرف ما يبينه.</b>',
   side:[
    {predict:{q:'الفتحة النافذة في الوسط تخترق الجسم من الأمام إلى الخلف. كيف يظهر سقفها في المسقط الجانبي؟',opts:[
     ['خطاً كاملاً',false,'من اليسار يحجبه الجزء الأيسر من الجسم.'],
     ['خطاً متقطعاً',true,'السقف داخل الجسم، وبينه وبين الناظر من اليسار جدار، فهو حافة مختفية (شكل ص 36).'],
     ['لا يظهر',false,'الحواف المختفية ترسم دائماً حتى يسهل تحديد شكل المشغولة (ص 25).']]}}
   ],
   body:[
    {tip:`<p>لوحة بلا نص على ورقة مربعات: كتلة بفتحة نافذة مستطيلة، ومجريان جانبيان، ومجرى علوي ينتهي بسطح مائل (يظهر خطاً مائلاً متقطعاً في المسقط الجانبي). لاحظ أبعاد موضع الفتحة (10 من القاعدة) والمجريين (20 من القاعدة) بالنسبة للحواف الخارجية.</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l6','ص 36',0)}},
    {title:'مختبر مصغّر: حدد الحواف في المسقط الجانبي',widget:(el,B)=>DWS.typeLines(el,B,{part:'S36',miss:'S',intro:'نقلنا أركان المسقط الجانبي لقطعة الانزلاق. حدد نوع كل حافة: ظاهرة أم مختفية؟',done:'السطح المائل وسقف الفتحة وأرضيتها خلف الجدار الأيسر (متقطعة)، وحافتا المجريين الجانبيين ظاهرتان.'},getP,consPts,consSVG)}
   ]},

  {recap:[
   'الزاوية التي تختلف عن 90° يوضع بعدها: إما بأطوال الحواف، أو بقيمتها بالدرجات وخط البعد قوس مركزه رأس الزاوية.',
   'تحديد الزاوية يجعل الأطوال بكسور عشرية، وتحديد الأطوال يجعل الزاوية غير صحيحة أحياناً؛ فنكتب القيمة الواجب التقيد بها.',
   'التجويف النافذ يرسم بحواف مرئية، وتوضع أبعاده وأبعاد موضعه بالنسبة للحواف الخارجية (داخل الجسم أو بخطوط مساعدة).',
   'الأركان المتساوية الاستدارة يكتب نصف قطر إحداها فقط؛ السهم من الداخل أو من الخارج يلامس القوس، والمركز بعلامة (+) أو دائرة صغيرة أو نقطة.']}
],
 theory:[
  {h:'١-١٠ تمثيل الزوايا وكتابة أبعادها',ref:'ص 31',html:`<p>«تكون الحواف المتقاربة والمتباعدة للأجسام زاوية. لا بد من تحديدها إذا اختلفت قيمتها عن <span class="ltr">90°</span> وذلك بوضع أبعادها على الرسم. توضع أبعاد الأجسام ذات الزوايا غير القائمة بأسلوبين: إما بتحديد أطوال الحواف، أو بتحديد قيم الزوايا بالدرجات. وفي الحالة الأخيرة يكون خط البعد عبارة عن قوس مركزه رأس الزاوية».</p>`},
  {fig:'',ref:'ص 31',caption:'لوح بحافة مائلة بأسلوبين: (يمين) بأطوال الحواف 35 و15 و35 — (يسار) بالحافتين 35 و35 والزاوية 60°',draw:()=>pairFig([[slantPlate(1),'بأطوال الحواف',1],[slantPlate(2),'بالزاوية',1]]).replace(/<b style="color:var\(--on\)">صواب<\/b> — /g,'')},
  {err:'جملة الأسلوبين في الكتاب (ص 31) ناقصة: «توضع أبعاد الأجسام ذات الزوايا غير القائمة بأسلوبين، إما بتحديد قيم الزوايا بالدرجات» ولا يذكر الأسلوب الثاني؛ أكملناها من الشكل: «إما بتحديد أطوال الحواف، أو بتحديد قيم الزوايا بالدرجات»، و«الحالة الأخيرة» هي الزوايا بالدرجات.'},
  {html:`<p>«لا يمكن من المقارنة المبدئية للأسلوبين السابقين التعرف على ميزة لأحدهما على الآخر. فمقادير الأبعاد الواجب وضعها متساوية في الحالتين. وعند اختيار طريقة التشغيل يصبح من الضروري تحديد القيم الواجب التقيد بها بدقة، فإما التقيد بقيم الزوايا أو بقيم أطوال الحواف، فتحديد قيم الزوايا يؤدي لأطوال حواف تختلف قيمها عن الأعداد الصحيحة وتحتوي على كسور عشرية متعددة الخانات بعد الفاصلة. أما تحديد أطوال الأضلاع فيؤدي أحياناً إلى زوايا قيمها ليست بالضرورة أن تكون أعداداً صحيحة».</p>`},
  {fig:'',ref:'ص 31',caption:'كتلة بمجرى V: (يمين) «يؤكد وضع قيم الزوايا أهمية التقيد بقيمها» — (يسار) «يؤكد وضع أبعاد الحواف (14) أهمية التقيد بأبعادها». كل شكل مرسوم هنا بأبعاده هو',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">${wrap(vBlockSVG({mode:'a',ang:80,angT:'80°',hw:25*Math.tan(40*Math.PI/180)}),330)}${wrap(vBlockSVG({mode:'l',hw:16,shT:'14'}),330)}</div>`},
  {err:'الشكلان في الكتاب (ص 31) مرسومان كأنهما القطعة نفسها، وهما لا يتطابقان: بعمق المجرى <span class="ltr">40 − 15 = 25</span> وزاوية <span class="ltr">80°</span> يكون عرض الكتف <span class="ltr">(60 − 2 × 25 × tan 40°) ÷ 2 ≈ 9.0</span> لا 14، وبكتف 14 تكون الزاوية <span class="ltr">2 × atan(16 ÷ 25) ≈ 65.2°</span> (حساب ليس من الكتاب). رسمنا كل شكل بأبعاده. وهذا يوافق فكرة النص: تحديد أحد الأسلوبين يعطي للآخر قيماً غير صحيحة. جرّب ذلك في تبويب «المختبر».'},
  {html:`<p>«في المثلث المرسوم، إذا كان ارتفاع المثلث هو البعد الهام المطلوب فلا بد من وضع البعد موازياً لارتفاع المثلث (<span class="ltr">h</span>)، أما إذا كان طول ضلع المثلث هو البعد الهام فيجب وضع البعد موازياً لهذا الضلع (<span class="ltr">s</span>)».</p>`},
  {fig:'',ref:'ص 32',caption:'مثلث: البعد 47.17 موازٍ للضلع (s)، والبعد 40 موازٍ للارتفاع (h)',draw:()=>{const s=4,pad=14,T=q=>[(q[0]+pad)*s,(q[1]+pad*0.8)*s];let h=svgOpen((60+pad*2.2)*s,(40+pad*1.6)*s,'مثلث')+plyl([[0,40],[60,40],[25,0]].map(T),'vl',true,' style="fill:var(--surface-2)"');
    h+=dim(T,[0,40],[25,0],8,{t:'47.17'})+dim(T,[60,40],[60,0],-10,{t:'40',fb:[25,0]});return wrap(h+'</svg>',360)}},
  {h:'زاوية ذات أسطح مشطوبة',ref:'ص 33',html:'<p>لوحة على ورقة مربعات: زاوية (مقطع <span class="ltr">L</span>) طولها 120، طرف ذراعها مشطوب، وفي ساقها مجرى على شكل <span class="ltr">V</span> زاويته <span class="ltr">60°</span>. (المساقط هنا محسوبة من الجسم نفسه.)</p>'},
  {fig:'',ref:'ص 33',caption:'زاوية ذات أسطح مشطوبة: المساقط الثلاثة بأبعادها، والمنظور',draw:()=>{const P=getP('L33');const hw=20*Math.tan(Math.PI/6);return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(sheetSVG(P,{px:380,grid:5,cl:false,
     dims:{F:[[[0,120],[0,0],8,{t:'120'}],[[40,0],[60,0],8,{t:'20',fa:[40,0],fb:[60,40]}],[[60,120],[60,40],-8,{t:'80'}]],S:[[[40,0],[40,40],-8,{t:'40',fb:[20,40]}],[[20,40-hw-6],[40,40-hw-6],0,{t:'20',fa:[20,40],ext:true}]],T:[[[0,0],[60,0],7,{t:'60'}],[[0,40],[0,0],-7,{t:'40'}],[[60,0],[60,10],-8,{t:'10',out:1}],[[0,40],[10,40],-7,{t:'10',out:1}]]},
     mark:C=>{const S=C.T('S');return adim(q=>S(q),[20,40],9,-30,30,'60°')}}).svg,400)}${wrap(pictSVG(P,{px:250,az:30,el:24,arrows:[stdArrows(P,50)[0]],m:24}),280)}</div>`}},
  {h:'١-١١ أجسام ذات تجاويف نافذة',ref:'ص 33–34',html:`<p>«إذا كان هناك جسم ذو تجويف نافذ لا يؤثر على الشكل الخارجي والأبعاد الخارجية للجسم، فيطلق عليه (جسم مثقوب)، ويشكل التجويف عند تشغيل الجسم إما بالسباكة أو الثقب أو بالتفريز أو بغيرها».</p>
   <p>«يمثل التجويف النافذ بالجسم بحواف مرئية. ولا يكفي لتحديده وضع أبعاده فقط، بل يجب أيضاً وضع الأبعاد المحددة لموضعه بالنسبة لحواف الجسم الخارجية. ويمكن وضع الأبعاد داخل الجسم أو الاستعانة بخطوط أبعاد مساعدة خارجة عن الجسم».</p>`},
  {fig:'',ref:'ص 34',caption:'لوح بركن مشطوب وفتحة مستطيلة نافذة: أبعاد الفتحة (20 و35) وموضعها (10 من الحافة اليمنى و15 من القاعدة) داخل الجسم',draw:()=>{const P=getP('P34');return wrap(sheetSVG(P,{px:420,cl:false,dims:{F:[[[0,60],[0,0],16,{t:'60'}],[[0,60],[0,15],8,{t:'45'}],[[25,0],[50,0],7,{t:'25'}],[[20,8],[40,8],0,{ext:false,t:'20'}],[[40,8],[50,8],0,{ext:false,t:'10',out:1}],[[12,60],[12,50],0,{ext:false,t:'15',out:1}],[[12,50],[12,15],0,{ext:false,t:'35'}]],S:[[[0,0],[15,0],7,{t:'15'}]],T:[[[0,15],[50,15],-7,{t:'50'}]]}}).svg,440)}},
  {html:`<p>«في الجسم المتماثل، إذا كان التجويف النافذ متماثلاً حول خط المنتصف يجب وضع أبعاده بالنسبة للحواف الخارجية طالما لم يتحدد وضعه تماماً من تماثله حول خط المنتصف. وإذا احتوت القطعة على حواف منحنية متعددة لها نفس نصف قطر الانحناء فيعطى في العادة نصف قطر انحناء إحداها فقط. ويرسم السهم الدال على بعد نصف قطر الانحناء من الداخل كلما أمكن، أما إذا لم يسمح الحيز المتاح بذلك فمن الممكن رسمه من الخارج ليلامس رأسه قوس الانحناء. وعلى قدر الحيز المتاح يمثل مركز قوس الدائرة إما بعلامة (+) أو بدائرة صغيرة أو بنقطة».</p>`},
  {fig:'',ref:'ص 35',caption:'كتلة U بفتحة نافذة متماثلة حول خط المنتصف، وركنان مستديران في المسقط الجانبي (نصف القطر 4 يعطى مرة واحدة)',draw:()=>{const P=getP('U35');const S0=ENG.view(P,'S').filter(sg=>!(sg.t==='v'&&((sg.a[0]===0&&sg.b[0]===0)||(sg.a[1]===0&&sg.b[1]===0)||(sg.a[1]===55&&sg.b[1]===55))));
    return wrap(sheetSVG(P,{px:420,segs:{S:S0},dims:{F:[[[0,0],[45,0],12,{t:'45'}],[[0,0],[10,0],5,{t:'10',out:1}],[[0,55],[0,0],16,{t:'55'}],[[0,55],[0,45],8,{t:'10',fb:[15,45]}],[[0,45],[0,25],8,{t:'20',fa:[15,45],fb:[15,25]}],[[15,32],[30,32],0,{ext:false,t:'15'}]],S:[[[0,0],[25,0],7,{t:'25'}]],T:[[[0,10],[0,0],-7,{t:'10'}]]},
     mark:C=>{const S=C.T('S'),r=4;const pts=`M${P2(S([r,0]))}H${f2(S([25,0])[0])}V${f2(S([25,55])[1])}H${f2(S([r,55])[0])}A${f2(r*C.s)} ${f2(r*C.s)} 0 0 1 ${P2(S([0,55-r]))}V${f2(S([0,r])[1])}A${f2(r*C.s)} ${f2(r*C.s)} 0 0 1 ${P2(S([r,0]))}Z`;
      const c=S([r,55-r]),a=Math.PI*0.75,p=[c[0]+r*C.s*Math.cos(a),c[1]+r*C.s*Math.sin(a)],o2=[p[0]+16*Math.cos(a),p[1]+16*Math.sin(a)];
      return `<path d="${pts}" class="vl"/>`+`<path d="M${f2(c[0]-4)} ${f2(c[1])}h8M${f2(c[0])} ${f2(c[1]-4)}v8" class="tn"/>`+ln(p,o2,'dm')+arrowHead(p,[-Math.cos(a),-Math.sin(a)],7)+tx(o2[0]-3,o2[1]+4,'4','dt','end')}}).svg,440)}},
  {fig:'',ref:'ص 35',caption:'طرق كتابة نصف قطر الانحناء ومركزه: السهم من الداخل (8) أو من الخارج (4، 3، 1)، والمركز بعلامة (+) أو بدائرة صغيرة أو بنقطة',draw:()=>wrap(radiiSVG(),460)},
  {h:'قطعة انزلاق',ref:'ص 36',html:'<p>لوحة على ورقة مربعات: كتلة بفتحة نافذة مستطيلة، ومجريان جانبيان، ومجرى علوي ينتهي بسطح مائل (يظهر خطاً مائلاً متقطعاً في المسقط الجانبي).</p>'},
  {fig:'',ref:'ص 36',caption:'قطعة انزلاق: المساقط الثلاثة بأبعادها، والمنظور',draw:()=>{const P=getP('S36');return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center">${wrap(sheetSVG(P,{px:380,grid:5,
     dims:{F:[[[0,0],[70,0],13,{t:'70'}],[[15,0],[55,0],6,{t:'40'}],[[0,120],[0,0],22,{t:'120'}],[[0,10],[0,0],8,{t:'10',fa:[15,10]}],[[0,120],[0,100],8,{t:'20'}],[[0,100],[0,50],8,{t:'50',fa:[10,100],fb:[10,50]}],[[70,120],[70,110],-8,{t:'10',out:1,fa:[50,120],fb:[50,110]}],[[70,110],[70,30],-8,{t:'80',fa:[50,110],fb:[50,30]}],[[60,50],[70,50],-6,{t:'10',out:1}],[[20,70],[50,70],0,{ext:false,t:'30'}]],S:[[[0,0],[40,0],7,{t:'40'}]]}}).svg,400)}${wrap(pictSVG(P,{px:250,az:-28,el:26,arrows:[stdArrows(P,50)[0]],m:24}),280)}</div>`}}
 ],
 lab:(el)=>{
  el.innerHTML=`<div class="grid dw-lab"><div class="panel c12"><h2>أسلوبا البعد: الزاوية أم طول الحافة؟ <small>مبنية على شكلي الكتلة ذات المجرى V ص 31</small></h2>
    <p class="sub">الكتلة: العرض 60، الارتفاع 40، ورأس المجرى على ارتفاع 15 من القاعدة (عمق المجرى 25). اختر الأسلوب وحرّك المؤشر، وشاهد القيمة التي تنتج للأسلوب الآخر.</p>
    <div class="dw-row">${segHTML('vm',[['a','بتحديد الزاوية'],['l','بتحديد طول الحافة (الكتف)']],'a')}</div>
    <div class="dw-row" id="l6sl"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;align-items:center"><div class="dw-sheet" id="l6v"></div><div><div class="facts"><div class="fact"><span>زاوية المجرى</span><b id="l6a"></b></div><div class="fact"><span>عرض الكتف (طول الحافة العليا)</span><b id="l6l"></b></div></div><div class="dw-msg" id="l6m"></div>
    <h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px"><li>بتحديد الزاوية اجعلها <span class="ltr">80°</span> كما في الكتاب: الكتف <span class="ltr">≈ 9.02</span> بكسور عشرية.</li><li>بتحديد طول الحافة اجعل الكتف <span class="ltr">14</span> كما في الكتاب: الزاوية <span class="ltr">≈ 65.2°</span> ليست عدداً صحيحاً.</li><li>ابحث عن زاوية تعطي كتفاً عدداً صحيحاً (مثلاً <span class="ltr">90°</span> تعطي <span class="ltr">5</span>).</li></ul></div></div></div></div>
   <div id="l6g"></div>`;
  const $=s=>el.querySelector(s);let mode='a',ang=80,sh=14;
  const slr=()=>{$('#l6sl').innerHTML=mode==='a'?slHTML('l6x','زاوية المجرى',20,170,1,ang):slHTML('l6x','عرض الكتف',0,29,0.5,sh);$('#l6x').oninput=e=>{if(mode==='a')ang=+e.target.value;else sh=+e.target.value;draw()}};
  const draw=()=>{let hw,a,l;if(mode==='a'){a=ang;hw=25*Math.tan(a/2*Math.PI/180);l=30-hw}else{l=sh;hw=30-l;a=2*Math.atan(hw/25)*180/Math.PI}
    const ok=l>=-1e-9;$('#l6x-v').textContent=mode==='a'?fm(ang,0)+'°':fm(sh,1);
    $('#l6v').innerHTML=ok?vBlockSVG({mode,ang:a,angT:fm(a,mode==='a'?0:2)+'°',hw:Math.min(30,hw),shT:fm(l,mode==='l'?1:3)}):'';
    $('#l6a').textContent=fm(a,mode==='a'?0:4)+'°';$('#l6l').textContent=ok?fm(l,mode==='l'?1:4):'—';
    const m=$('#l6m');m.className='dw-msg'+(ok?'':' bad');
    m.innerHTML=!ok?'الزاوية كبيرة جداً: المجرى أعرض من الكتلة.':mode==='a'?`حددنا الزاوية <b class="ltr">${fm(a,0)}°</b>، فطول الحافة العليا (الكتف) <b class="ltr">${fm(l,4)}</b>${Number.isInteger(Math.round(l*1e4)/1e4)?' عدد صحيح':' بكسور عشرية متعددة الخانات'} — «تحديد قيم الزوايا يؤدي لأطوال حواف تختلف قيمها عن الأعداد الصحيحة» (ص 31).`:
      `حددنا الكتف <b class="ltr">${fm(l,1)}</b>، فزاوية المجرى <b class="ltr">${fm(a,4)}°</b> — «تحديد أطوال الأضلاع يؤدي أحياناً إلى زوايا قيمها ليست بالضرورة أعداداً صحيحة» (ص 31).`};
  segBind(el.querySelector('.panel'),'vm',v=>{mode=v;slr();draw()});slr();draw();
  genLab($('#l6g'),{id:'g6',title:'مساقط أجسام هذا الدرس',ref:'لوحات ص 33–36',parts:['L33','P34','U35','S36'],msg:k=>k==='U35'?'الركنان المستديران في المسقط الجانبي غير مرسومين في هذا المولّد.':'',
   steps:g=>[
    {t:'الحافة المائلة',x:'مع «زاوية ذات أسطح مشطوبة» انظر «من الأمام E»: الشطف يظهر خطاً مائلاً في المسقط الرأسي فقط.',done:()=>g().pk==='L33'&&g().did.vF},
    {t:'مجرى V',x:'انظر «من اليسار S»: مجرى <span class="ltr">V</span> بزاوية <span class="ltr">60°</span> يظهر بشكله الحقيقي في المسقط الجانبي.',done:()=>g().pk==='L33'&&g().did.vS},
    {t:'التجويف النافذ',x:'اختر «لوح بركن مشطوب وفتحة نافذة»: الفتحة حواف مرئية في المسقط الرأسي، ومتقطعة في المسقطين الآخرين.',done:()=>g().pk==='P34'},
    {t:'قطعة الانزلاق',x:'اختر «قطعة انزلاق» وأخفِ الحواف المختفية في المنظور، ثم دوّره لترى السطح المائل في نهاية المجرى العلوي.',done:()=>g().pk==='S36'&&g().did.hid}]})},
 examples:(()=>{const P=getP('P34'),S=getP('S36');const ps=consPts(S,'S').pts;const v=k=>({F:1,S:1,T:1,[k]:0});
  return [
  drawnEx('المساقط الثلاثة للوح ذي الفتحة النافذة','ص 34','<p>لوح ثخانته 15: عرضه 50 وارتفاعه 60، وحافته اليسرى ارتفاعها 45 ثم شطف إلى بعد 25 من الركن الأيمن العلوي، وفيه فتحة نافذة عرضها 20 وارتفاعها 35، تبعد 10 عن الحافة اليمنى و15 عن القاعدة. ارسم مساقطه الثلاثة.</p>',[
   ['ارسم المسقط الرأسي: المحيط الخارجي مع الشطف من (0، 45) إلى (25، 60).',sheetSVG(P,{px:400,cl:false,hide:{S:1,T:1},segs:{F:ENG.view(P,'F').filter(s=>!(s.a[0]>=19.9&&s.a[0]<=40.1&&s.b[0]>=19.9&&s.b[0]<=40.1&&s.a[1]>=9.9&&s.b[1]>=9.9&&s.a[1]<=45.1&&s.b[1]<=45.1))}}).svg],
   ['أضف الفتحة النافذة بحواف مرئية: عرضها 20 وموضعها 10 من اليمين، وارتفاعها 35 وموضعها 15 من القاعدة.',sheetSVG(P,{px:400,cl:false,hide:{S:1,T:1}}).svg],
   ['ارسم المسقط الجانبي (عرضه الثخانة 15): خط كامل عند نهاية الشطف، وخطان متقطعان لسقف الفتحة وأرضيتها.',sheetSVG(P,{px:400,cl:false,hide:{T:1}}).svg],
   ['ارسم المسقط الأفقي: خطان متقطعان لجانبي الفتحة، وخط كامل عند نهاية الشطف (25).',sheetSVG(P,{px:400,cl:false}).svg],
   ['ضع الأبعاد: الخارجية، ثم أبعاد الفتحة وموضعها بالنسبة للحواف الخارجية (داخل الجسم).',sheetSVG(P,{px:400,cl:false,dims:{F:[[[0,60],[0,0],16,{t:'60'}],[[0,60],[0,15],8,{t:'45'}],[[25,0],[50,0],7,{t:'25'}],[[20,8],[40,8],0,{ext:false,t:'20'}],[[40,8],[50,8],0,{ext:false,t:'10',out:1}],[[12,60],[12,50],0,{ext:false,t:'15',out:1}],[[12,50],[12,15],0,{ext:false,t:'35'}]],S:[[[0,0],[15,0],7,{t:'15'}]],T:[[[0,15],[50,15],-7,{t:'50'}]]}}).svg]]),
  drawnEx('استنتاج المسقط الجانبي لقطعة الانزلاق','ص 36','<p>«ارسم المسقط الناقص» (نشاط على لوحة ص 36): معلوم المسقطان الرأسي والأفقي لقطعة الانزلاق. استنتج المسقط الجانبي بخط 45°.</p>',[
   ['المعطى: المسقط الرأسي والمسقط الأفقي.',consSVG(S,'S',{helper:false,px:420})],
   ['انقل الارتفاعات من المسقط الرأسي (120، 110، 90، 70، 20، 10، 0)، والأعماق من المسقط الأفقي عبر خط 45°.',consSVG(S,'S',{pts:ps,cur:'all',target:'grey',px:420})],
   ['حدد نوع الخطوط: قاع المجرى العلوي المائل وسقف الفتحة وأرضيتها خلف الجدار الأيسر (متقطعة)، أما حافتا المجريين الجانبيين فظاهرتان (كاملة).',consSVG(S,'S',{pts:ps,cur:-1,target:'final',px:420})],
   ['المسقط الجانبي مكتملاً مع خطوط المنتصف وعرضه 40.',sheetSVG(S,{px:420,dims:{S:[[[0,0],[40,0],7,{t:'40'}]]}}).svg]])]})(),
 quiz:[
  {q:'متى يجب وضع بعد للزاوية على الرسم؟',o:['دائماً','إذا اختلفت قيمتها عن 90°','إذا كانت 90° فقط','لا توضع أبعاد للزوايا'],c:1,e:'ص 31.'},
  {q:'عند كتابة الزاوية بالدرجات يكون خط البعد:',o:['خطاً مستقيماً','قوساً مركزه رأس الزاوية','خطاً متقطعاً','خط منتصف'],c:1,e:'ص 31.'},
  {q:'تحديد قيم الزوايا يؤدي غالباً إلى:',o:['أطوال حواف بأعداد صحيحة','أطوال حواف بكسور عشرية متعددة الخانات','حذف الأبعاد كلها','زوايا قائمة'],c:1,e:'ص 31.'},
  {q:'إذا كان ارتفاع المثلث هو البعد الهام فإن البعد يوضع:',o:['موازياً للضلع','موازياً للارتفاع','داخل المثلث فقط','لا يوضع'],c:1,e:'ص 32 (البعد 40 في الشكل).'},
  {q:'كيف يمثل التجويف النافذ بالجسم (في المسقط الذي يظهر فيه)؟',o:['بحواف مختفية دائماً','بحواف مرئية، مع أبعاده وأبعاد موضعه بالنسبة للحواف الخارجية','بخط منتصف فقط','لا يرسم'],c:1,e:'ص 34.'},
  {q:'إذا لم يتسع المكان لسهم نصف قطر الانحناء من الداخل:',o:['لا يكتب','يرسم من الخارج ليلامس رأسه قوس الانحناء','يكتب على خط المنتصف','يرسم متقطعاً'],c:1,e:'ص 35، ويمثل المركز بعلامة (+) أو دائرة صغيرة أو نقطة.'}
 ]
});

/* =====================================================================
   LESSON 7 — الأجسام الأسطوانية (ص 37–39)
   ===================================================================== */
/* stepped shaft: segs [{d,L}] from left to right, bore = through-hole diameter (0 = none).
   side view = seen from the LEFT, drawn to the right of the front view (ص 18). */
function shaftCircles(segs,bore){const out=new Map();const add=(d,vis)=>{const k=d.toFixed(3);out.set(k,{d,vis:(out.get(k)||{}).vis||vis})};
  for(let k=0;k<=segs.length;k++){const left=segs.slice(0,k).map(s=>s.d),mx=left.length?Math.max(...left):0;
    [k>0?segs[k-1].d:null,k<segs.length?segs[k].d:null].forEach(D=>{if(D==null)return;add(D,mx<=D+1e-9)})}
  if(bore>0)add(bore,true);return [...out.values()].sort((a,b)=>b.d-a.d)}
function shaftSVG(segs,o){o=o||{};const bore=o.bore||0,Ltot=segs.reduce((a,s)=>a+s.L,0),Dmax=Math.max(...segs.map(s=>s.d));const showS=o.side!==false;
  const g=o.gap||16,pad=o.pad||16,W=Ltot+(showS?g+Dmax:0)+2*pad,H=Dmax+2*pad+(o.extraH||0),s=(o.px||460)/W;const cy=pad+Dmax/2+(o.extraH||0)/2;
  const T=q=>[(q[0]+pad)*s,(q[1]+cy)*s];let h=svgOpen(W*s,H*s,o.aria||'مشغولة أسطوانية');let x=0;
  /* outline */
  const top=[],bot=[];segs.forEach(sg=>{top.push([x,-sg.d/2],[x+sg.L,-sg.d/2]);bot.push([x,sg.d/2],[x+sg.L,sg.d/2]);x+=sg.L});
  h+=plyl(top.map(T),'vl')+plyl(bot.map(T),'vl');x=0;
  segs.forEach((sg,i)=>{const prev=i?segs[i-1].d:0,m=Math.max(prev,sg.d);h+=ln(T([x,-m/2]),T([x,m/2]),'vl');x+=sg.L});h+=ln(T([Ltot,-segs[segs.length-1].d/2]),T([Ltot,segs[segs.length-1].d/2]),'vl');
  if(bore>0){h+=hidLn(T([0,-bore/2]),T([Ltot,-bore/2]))+hidLn(T([0,bore/2]),T([Ltot,bore/2]))}
  if(o.cl!==false)h+=ctrLn(T([-4,0]),T([Ltot+4,0]));
  (o.dims||[]).forEach(d=>h+=dim(T,d[0],d[1],d[2],d[3]));
  if(showS){const cx=Ltot+g+Dmax/2;const C=shaftCircles(segs,bore);
    C.forEach(c=>{const p=T([cx,0]);const r=c.d/2*s;if(c.vis)h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(r)}" class="vl"/>`;else{const n=Math.max(8,Math.round(2*Math.PI*r/8.5));h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(r)}" class="hl" stroke-dasharray="${f2(2*Math.PI*r/n*0.65)} ${f2(2*Math.PI*r/n*0.35)}"/>`}});
    if(o.cl!==false)h+=ctrLn(T([cx-Dmax/2-4,0]),T([cx+Dmax/2+4,0]))+ctrLn(T([cx,-Dmax/2-4]),T([cx,Dmax/2+4]))}
  if(o.mark)h+=o.mark(T,s);
  return h+'</svg>'}
const WP=[{d:30,L:15},{d:25,L:10},{d:30,L:15},{d:20,L:40}];
const PIN=[{d:25,L:7},{d:20,L:13},{d:10,L:20}];
/* ϕ dimension helper: vertical dim across a segment at x */
const phiD=(x,d,t,o)=>[[x,d/2],[x,-d/2],0,Object.assign({ext:false,t:t||('ϕ'+d)},o||{})];
const wpDims=()=>[phiD(5,30,'ϕ30',{tdx:6}),phiD(10,10,'ϕ10',{out:1,tdx:-12}),phiD(20,25),phiD(60,20),[[15,-15],[25,-15],8,{t:'10',out:1,fa:[15,-12.5],fb:[25,-12.5]}],[[25,-15],[80,-15],16,{t:'55'}],[[40,-10],[80,-10],10,{t:'40',fa:[40,-15]}],[[0,15],[80,15],-8,{t:'80'}]];
function cylGroup(kind){/* prism vs cylinder (ص 37): front, side, and the characteristic top view */
  const s=2.6,w=24,hh=40,g=12,pad=8,W=(w*2+g+2*pad)*s,H=(hh+g+w+2*pad)*s,T=(x,y)=>[(x+pad)*s,(y+pad)*s];let h=svgOpen(W,H,kind==='c'?'أسطوانة':'موشور مربع القاعدة');
  [[0,0],[w+g,0]].forEach(([x,y])=>{h+=plyl([T(x,y),T(x+w,y),T(x+w,y+hh),T(x,y+hh)],'vl',true)+ctrLn(T(x+w/2,y-3),T(x+w/2,y+hh+3))});
  const ty=hh+g;if(kind==='c'){const c=T(w/2,ty+w/2);h+=`<circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="${f2(w/2*s)}" class="vl"/>`}else h+=plyl([T(0,ty),T(w,ty),T(w,ty+w),T(0,ty+w)],'vl',true);
  h+=ctrLn(T(-3,ty+w/2),T(w+3,ty+w/2))+ctrLn(T(w/2,ty-3),T(w/2,ty+w+3));return h+'</svg>'}
function cyl3(n){/* cylinder H25 ϕ20 drawn in 3, 2 or 1 view(s) (ص 37) */
  const s=3,pad=12,g=12,w=20,hh=25;const cols=n===3?2:1,rows=n===1?1:2;const W=(w*cols+(cols-1)*g+2*pad+10)*s,H=(hh+(rows-1)*(g+w)+2*pad)*s;const T=q=>[(q[0]+pad+8)*s,(q[1]+pad)*s];let h=svgOpen(W,H,'أسطوانة');
  const rect=(x,y)=>plyl([[x,y],[x+w,y],[x+w,y+hh],[x,y+hh]].map(T),'vl',true)+ctrLn(T([x+w/2,y-3]),T([x+w/2,y+hh+3]));
  h+=rect(0,0)+dim(T,[0,hh],[0,0],7,{t:'25'});if(n===3)h+=rect(w+g,0);
  if(n>=2){const c=[w/2,hh+g+w/2],p=T(c);h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(w/2*s)}" class="vl"/>`+ctrLn(T([c[0]-w/2-3,c[1]]),T([c[0]+w/2+3,c[1]]))+ctrLn(T([c[0],c[1]-w/2-3]),T([c[0],c[1]+w/2+3]));
    const a=Math.PI/4,A=[c[0]-w/2*Math.cos(a),c[1]+w/2*Math.sin(a)],Bq=[c[0]+w/2*Math.cos(a),c[1]-w/2*Math.sin(a)];h+=dim(T,A,Bq,0,{ext:false,t:'20'})}
  else h+=dim(T,[0,hh],[w,hh],-7,{t:'ϕ20'});return h+'</svg>'}
function phiSymSVG(){const W=300,H=150;let h=svgOpen(W,H,'رمز القطر');const c=[120,78],r=26;
  h+=`<circle cx="${c[0]}" cy="${c[1]}" r="${r}" style="fill:none;stroke:var(--fg);stroke-width:3"/>`;const a=75*Math.PI/180,L=56;h+=`<line x1="${f2(c[0]-L*Math.cos(a))}" y1="${f2(c[1]+L*Math.sin(a))}" x2="${f2(c[0]+L*Math.cos(a))}" y2="${f2(c[1]-L*Math.sin(a))}" style="stroke:var(--fg);stroke-width:3"/>`;
  h+=ln([60,c[1]+L*Math.sin(a)],[200,c[1]+L*Math.sin(a)],'tn',' stroke-dasharray="3 3"');h+=adim(q=>q,[c[0]-L*Math.cos(a),c[1]+L*Math.sin(a)],22,0,75,'75°');
  h+=ln([214,c[1]-L*Math.sin(a)],[290,c[1]-L*Math.sin(a)],'tn',' stroke-dasharray="3 3"')+ln([214,c[1]+L*Math.sin(a)],[290,c[1]+L*Math.sin(a)],'tn',' stroke-dasharray="3 3"');
  h+=`<text x="252" y="${f2(c[1]+L*Math.sin(a))}" style="font-family:var(--mono);font-size:${f2(2*L*Math.sin(a)*1.38)}px;fill:var(--fg)" text-anchor="middle">20</text>`;
  h+=tAr(120,16,'الدائرة بحجم الحرف الصغير',null,'lb','middle');return h+'</svg>'}
function spannerSVG(){const s=3.2,pad=14,T=q=>[(q[0]+pad+20)*s,(q[1]+pad+24)*s];const W=(80+20+pad*2+20)*s,H=(48+pad*2)*s;let h=svgOpen(W,H,'مفتاح ربط مسطح');
  /* ring Ø30 / hole 20 at (0,0); jaw outer arc Ø35 centred at 35; opening Ø40 centred at 50 (ص 38) */
  const R1=15,ro=17.5,cj=35,co=50,rp=20,nh=10;const yJ=Math.sqrt(ro*ro-(co-rp-cj)*(co-rp-cj));
  const xi=(R,c,y)=>c-Math.sqrt(Math.max(0,R*R-y*y));
  /* tips of the crescent: intersection of the two arcs */
  const xt=(ro*ro-rp*rp-cj*cj+co*co)/(2*(co-cj)),yt=Math.sqrt(Math.max(0,ro*ro-(xt-cj)*(xt-cj)));
  const ringX=Math.sqrt(R1*R1-nh*nh),jawX=xi(ro,cj,nh);
  const p=[`M${P2(T([ringX,-nh]))}`,`L${P2(T([jawX,-nh]))}`,`A${f2(ro*s)} ${f2(ro*s)} 0 0 1 ${P2(T([xt,-yt]))}`,`A${f2(rp*s)} ${f2(rp*s)} 0 0 0 ${P2(T([xt,yt]))}`,`A${f2(ro*s)} ${f2(ro*s)} 0 0 1 ${P2(T([jawX,nh]))}`,`L${P2(T([ringX,nh]))}`,`A${f2(R1*s)} ${f2(R1*s)} 0 1 1 ${P2(T([ringX,-nh]))}`].join('');
  h+=`<path d="${p}Z" class="vl" style="fill:var(--surface-2)"/>`;const c0=T([0,0]);h+=`<circle cx="${f2(c0[0])}" cy="${f2(c0[1])}" r="${f2(10*s)}" class="vl" style="fill:var(--surface)"/>`;const c3=T([23,0]);h+=`<circle cx="${f2(c3[0])}" cy="${f2(c3[1])}" r="${f2(1.5*s)}" class="vl" style="fill:var(--surface)"/>`;
  h+=ctrLn(T([-19,0]),T([co+4,0]))+ctrLn(T([0,-19]),T([0,19]))+ctrLn(T([co,-6]),T([co,6]))+ctrLn(T([cj,-4]),T([cj,4]));
  const a=Math.PI/4;h+=dim(T,[-10*Math.cos(a),10*Math.sin(a)],[10*Math.cos(a),-10*Math.sin(a)],0,{ext:false,t:'20'});
  h+=dim(T,[-15,15],[-15,-15],6,{t:'30',fa:[0,15],fb:[0,-15]})+dim(T,[0,22],[co,22],-4,{t:'50',fa:[0,15],fb:[co,6]})+dim(T,[cj,30],[co,30],0,{t:'15',fa:[cj,4],fb:[co,6],out:1});
  h+=dim(T,[cj+ro*Math.cos(2.4),-ro*Math.sin(2.4)],[cj-ro*Math.cos(2.4),ro*Math.sin(2.4)],0,{ext:false,t:'35',tdx:6});
  const op=T([co-rp*Math.cos(0.5),-rp*Math.sin(0.5)]),oc=T([co,0]);h+=ln(oc,op,'dm')+arrowHead(op,[op[0]-oc[0],op[1]-oc[1]])+tx((oc[0]+op[0])/2+4,(oc[1]+op[1])/2-4,'ϕ40','dt','start');
  h+=ln(T([23,-1.5]),T([26,-8]),'dm')+tx(...T([26.5,-9]),'ϕ3','dt','start');return h+'</svg>'}

B.lesson({
 id:'u1-l7',unit:1,order:7,pages:'37–39',
 title:'الأجسام الأسطوانية',
 summary:'المسقطان الرأسي والجانبي للأسطوانة كالموشور ذي القاعدة المربعة، والفرق في المسقط الأفقي (دائرة). ويكفي مسقط واحد للأسطوانة البسيطة إذا كتبنا علامة القطر ϕ قبل الرقم.',
 stations:[
  {intro:true},

  {st:1,short:'أجسام أسطوانية',title:'١-١٢ أجسام أسطوانية',ref:'ص 37–38',
   q:'من الأمام ومن الجانب تبدو الأسطوانة مستطيلاً تماماً كالموشور… فكيف يعرف القارئ أنها مستديرة؟',
   get art(){const a=DWS.put(cylGroup('p'),18,40,160,190),b=DWS.put(cylGroup('c'),182,40,160,190);
     const s=2.6,pad=8,T=(x,y)=>[(x+pad)*s,(y+pad)*s];const ty=52;
     let t=DWS.tipR(a.M,T(0,0),T(60,40),'المسقطان الرأسي والجانبي للموشور ذي القاعدة المربعة: مستطيلان بخط منتصف.',0)+DWS.tipR(b.M,T(0,0),T(60,40),'المسقطان الرأسي والجانبي للأسطوانة: مستطيلان بخط منتصف أيضاً — لا يختلفان عن الموشور.',0);
     t+=DWS.tipR(a.M,T(0,ty),T(24,ty+24),'المسقط الأفقي للموشور: مربع بخطي منتصف متقاطعين.',0)+DWS.tipR(b.M,T(0,ty),T(24,ty+24),'المسقط الأفقي للأسطوانة: دائرة بخطي منتصف — هنا فقط يظهر الفرق.',0);
     return DWS.art('موشور مربع القاعدة وأسطوانة: الفرق في المسقط الأفقي فقط',a.g+b.g+t+DWS.txt(98,258,'موشور مربع القاعدة',{fs:13,b:1})+DWS.txt(262,258,'أسطوانة',{fs:13,b:1}))},
   cap:'موشور قاعدته مربعة وأسطوانة (شكل ص 37).<br><b>مرّر المؤشر على المساقط (أو المسها في الجوال) لتعرف أين يظهر الفرق.</b>',
   side:[
    {predict:{q:'رسمت أسطوانة بمسقط واحد (المسقط الرأسي) فقط. كيف تبين أن قاعدتها دائرية؟',opts:[
     ['لا يمكن، لا بد من ثلاثة مساقط',false,'الكتاب (ص 37): «يكفي مسقطان أو مسقط واحد لتمثيل الأجسام الأسطوانية البسيطة».'],
     ['بكتابة علامة القطر <span class="ltr">ϕ</span> على يسار رقم القطر',true,'الكتاب: شكل القاعدة الدائري «فيعبر عنه بالعلامة المميزة للقطر (ϕ)»، وتكتب على يسار الرقم.'],
     ['بكتابة كلمة «دائري» بجانب الرسم',false,'الرسم الفني يستعمل الرموز المتفق عليها، والعلامة هنا ϕ.']]}}
   ],
   body:[
    {book:`<p>لا يختلف كل من المسقط الرأسي والجانبي للأسطوانة عنهما للموشور ذي القاعدة المربعة. ويكون الاختلاف فقط في المسقط الأفقي الذي يشكل قاعدة الجسم المميزة.</p><p>يكفي مسقطان أو مسقط واحد لتمثيل الأجسام الأسطوانية البسيطة، أما شكل القاعدة الدائري غير الممكن التعرف عليه من الرسم في هذه الحالة، فيعبر عنه بالعلامة المميزة للقطر (<span class="ltr">ϕ</span>).<br>والرمز المميز للقطر هو عبارة عن دائرة حجمها يعادل حرف الكتابة الصغير، أما المستقيم المائل المار بمركز الدائرة فيميل بزاوية قدرها <span class="ltr">75°</span> بالنسبة للأفقي، والارتفاع الكلي لرمز القطر يساوي ارتفاع الأرقام الدالة على مقدار القطر، وتكتب علامة القطر على يسار الرقم الدال عليه (<span class="ltr">DIN 406 1968</span>).</p>`,ref:'ص 37'},
    {get html(){return DWS.figHtml(B,'u1-l7','ص 37',1)+DWS.figHtml(B,'u1-l7','ص 37',2)}},
    {book:`<p>وتستعمل العلامة <span class="ltr">ϕ</span> أيضاً مع أبعاد الأقطار المكتوبة على قوس والممثلة فقط بسهم بعد واحد، وكذلك مع أرقام الأبعاد المكتوبة بدون خطوط أبعاد، أو بدون خطوط أبعاد مساعدة (<span class="ltr">DIN 406; 1968</span>).</p>`,ref:'ص 37'},
    {get html(){return DWS.figHtml(B,'u1-l7','ص 38',0)+DWS.figHtml(B,'u1-l7','ص 38',1)}},
    {tip:`<p>في الرسم بثلاثة مساقط ترى الدائرة فتعرف أن الجسم أسطواني، فيكتب القطر بلا علامة (مثل <span class="ltr">20</span> على الدائرة). أما في المسقط الواحد فلا ترى الدائرة، فتقوم العلامة <span class="ltr">ϕ</span> مقامها: <span class="ltr">ϕ20</span> تعني «مقطع دائري قطره 20». لهذا يكفي مسقط واحد للمسمار المدرج.</p>`,title:'متى نكتب ϕ؟'},
    {title:'مختبر مصغّر: كم مسقطاً تحتاج؟',widget:(el,B)=>DCML.lab(el,B,{intro:'أسطوانة ص 37: ارتفاعها <span class="ltr">25</span> وقطرها <span class="ltr">20</span>. اختر عدد المساقط وشاهد كيف يكتب القطر.',
     ins:[{k:'n',l:'عدد المساقط',seg:[[3,'ثلاثة'],[2,'مسقطان'],[1,'مسقط واحد']],v:3}],
     calc:s=>({pic:`<div class="dw-sheet" style="max-width:${s.n===1?180:300}px;margin-inline:auto">${cyl3(s.n)}</div>`,msg:s.n===1?'بمسقط واحد لا نرى الدائرة، فيكتب القطر <span class="ltr">ϕ20</span> بعلامة القطر على يسار الرقم (ص 37).':`بـ${s.n===3?'ثلاثة مساقط':'مسقطين'} تظهر الدائرة في المسقط الأفقي، فيكتب القطر <span class="ltr">20</span> على خط مائل يمر بالمركز دون علامة.`})})},
    {title:'تحقق سريع: علامة القطر',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['يميل المستقيم في علامة القطر بزاوية <span class="ltr">75°</span> بالنسبة للأفقي.',true,'نص الكتاب (ص 37).'],
     ['تكتب علامة القطر على يمين الرقم.',false,'«وتكتب علامة القطر على يسار الرقم الدال عليه».'],
     ['الارتفاع الكلي لرمز القطر يساوي ارتفاع الأرقام.',true,'نص الكتاب (ص 37).']]})}
   ]},

  {st:2,short:'خطوات التشغيل',title:'مشغولة أسطوانية: خطوات التشغيل',ref:'ص 38–39',
   q:'عمود مدرج مثقوب من أوله إلى آخره… بأي ترتيب يصنعه الخراط؟',
   get art(){const px0=320,dims=wpDims();const b=DWS.fit(v=>shaftSVG(WP,{bore:10,px:v,extraH:34,dims}),20,60,320,200);const s=b.px/158,cy=48,T=q=>[(q[0]+16)*s,(q[1]+cy)*s];
     let t=DWS.tipR(b.M,T([25,-12.5]),T([35,12.5]),'الانحسار (المجرى): ⟦ϕ25⟧ عرضه 10.',0)+DWS.tipR(b.M,T([40,-10]),T([80,10]),'الجزء ⟦ϕ20⟧ طوله 40 (من الطرف الأيمن).',0)+DWS.tipR(b.M,T([0,-5]),T([25,5]),'الثقب النافذ ⟦ϕ10⟧: خطان متقطعان على طول المشغولة كلها (حافتان مختفيتان).',0);
     t+=DWS.tipR(b.M,T([96,-15]),T([126,15]),'المسقط الجانبي (نراه من اليسار): الدائرة ⟦ϕ30⟧ ظاهرة، والثقب ⟦ϕ10⟧ ظاهر، أما ⟦ϕ25⟧ و⟦ϕ20⟧ فمتقطعتان لأن الطوق ⟦ϕ30⟧ يحجبهما.',0);
     return DWS.art('رسم المشغولة الأسطوانية ومسقطها الجانبي',b.g+t+DWS.txt(180,284,'الطول الكلي 80',{fs:13,b:1}),'#FBE6C4')},
   cap:'رسم المشغولة (ص 38): عمود مدرج طوله 80 مثقوب بثقب نافذ <span class="ltr">ϕ10</span>، ومسقطه الجانبي.<br><b>مرّر المؤشر على الأجزاء وعلى المسقط الجانبي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في المسقط الجانبي (من اليسار) لماذا رسمت دائرة <span class="ltr">ϕ25</span> متقطعة؟',opts:[
     ['لأن المجرى مخفي داخل الثقب',false,'المجرى على السطح الخارجي، لا داخل الثقب.'],
     ['لأن الطوق <span class="ltr">ϕ30</span> على يسارها يحجبها عن الناظر',true,'نراه من اليسار، والطوق الأيسر أكبر قطراً فيغطي الدائرة الأصغر خلفه.'],
     ['لأن كل الدوائر الداخلية تكون متقطعة',false,'دائرة الثقب ϕ10 ظاهرة (كاملة) لأننا نرى من خلال الثقب.']]}}
   ],
   body:[
    {book:`<ul style="list-style:none;padding-inline-start:4px"><li>رسم المشغولة</li><li>١ - تحديد المركز ثم الثقب</li><li>٢ - خراطة العمود</li><li>٣ - تشغيل الانحسار</li><li>٤ - قطع المشغولة بالطول المطلوب</li></ul>`,ref:'ص 38–39'},
    {tip:`<p>الكتاب لا يكتب نصاً لخطوات التشغيل؛ هي عناوين تحت الأشكال فقط (أعلاه). أطوال الطوقين <span class="ltr">ϕ30</span> (15 و15) غير مكتوبة على الرسم، وتستنتج من الأبعاد: <span class="ltr">80 − 55 − 10 = 15</span> و<span class="ltr">55 − 40 = 15</span>. وطول الخام في الخطوة الأولى غير مذكور، فرسمناه أطول قليلاً من 80.</p>`,title:'اقرأ الأشكال'},
    {get html(){return DWS.figHtml(B,'u1-l7','ص 38–39',0)}},
    {title:'مختبر مصغّر: رتّب خطوات التشغيل',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب خطوات تشغيل المشغولة كما يعرضها الكتاب.',steps:[
     ['تحديد المركز ثم الثقب <span class="ltr">ϕ10</span>','الثقب أولاً في الخام الكامل: «١ - تحديد المركز ثم الثقب».'],
     ['خراطة العمود إلى <span class="ltr">ϕ20</span> بطول 40','«٢ - خراطة العمود» بعد الثقب.'],
     ['تشغيل الانحسار <span class="ltr">ϕ25</span> بعرض 10','«٣ - تشغيل الانحسار».'],
     ['قطع المشغولة بالطول المطلوب 80','آخر خطوة: «٤ - قطع المشغولة بالطول المطلوب».']],done:'كل خطوة في الكتاب رسم كامل بمسقطين.'})},
    {title:'مختبر مصغّر: ظاهرة أم متقطعة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'دوائر المسقط الجانبي للمشغولة النهائية (نراها من اليسار): ظاهرة أم متقطعة؟',cats:['ظاهرة (كاملة)','مختفية (متقطعة)'],items:[
     ['الدائرة <span class="ltr">ϕ30</span>',0,'أكبر قطر وفي أقصى اليسار، فلا يحجبها شيء.'],
     ['الدائرة <span class="ltr">ϕ25</span> (الانحسار)',1,'يحجبها الطوق ϕ30 الذي على يسارها.'],
     ['الدائرة <span class="ltr">ϕ20</span>',1,'يحجبها الطوق ϕ30.'],
     ['الدائرة <span class="ltr">ϕ10</span> (الثقب النافذ)',0,'نرى حافة الثقب من خلال فتحته.']]})}
   ]},

  {recap:[
   'المسقطان الرأسي والجانبي للأسطوانة كالموشور ذي القاعدة المربعة؛ والفرق في المسقط الأفقي فقط (دائرة).',
   'يكفي مسقطان أو مسقط واحد للجسم الأسطواني البسيط، مع علامة القطر ϕ على يسار الرقم.',
   'خط علامة القطر يميل 75° على الأفقي، وارتفاعها يساوي ارتفاع الأرقام (DIN 406).',
   'المشغولة الأسطوانية: تحديد المركز والثقب، ثم خراطة العمود، ثم الانحسار، ثم القطع بالطول؛ وفي المسقط الجانبي تتقطع الدوائر التي يحجبها قطر أكبر على يسارها.']}
],
 theory:[
  {h:'١-١٢ أجسام أسطوانية',ref:'ص 37',html:`<p>«لا يختلف كل من المسقط الرأسي والجانبي للأسطوانة عنهما للموشور ذي القاعدة المربعة. ويكون الاختلاف فقط في المسقط الأفقي الذي يشكل قاعدة الجسم المميزة».</p>`},
  {fig:'',ref:'ص 37',caption:'موشور قاعدته مربعة (يمين) وأسطوانة (يسار): المسقطان الرأسي والجانبي متماثلان، والمسقط الأفقي مربع أو دائرة بخطي منتصف',draw:()=>`<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:440px;margin-inline:auto">${wrap(cylGroup('p'),200)}${wrap(cylGroup('c'),200)}</div>`},
  {html:`<p>«يكفي مسقطان أو مسقط واحد لتمثيل الأجسام الأسطوانية البسيطة، أما شكل القاعدة الدائري غير الممكن التعرف عليه من الرسم في هذه الحالة، فيعبر عنه بالعلامة المميزة للقطر (<span class="ltr">ϕ</span>)».</p>`},
  {fig:'',ref:'ص 37',caption:'ثلاث طرق لتمثيل أسطوانة ارتفاعها 25 وقطرها 20: بثلاثة مساقط، وبمسقطين، وبمسقط واحد مع علامة القطر <span class="ltr">ϕ20</span>',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;align-items:end">${[3,2,1].map(n=>`<div>${wrap(cyl3(n),220)}<p class="sub" style="text-align:center;margin:2px 0 0">${n===3?'ثلاثة مساقط':n===2?'مسقطان':'مسقط واحد'}</p></div>`).join('')}</div>`},
  {html:`<p>«والرمز المميز للقطر هو عبارة عن دائرة حجمها يعادل حرف الكتابة الصغير، أما المستقيم المائل المار بمركز الدائرة فيميل بزاوية قدرها <span class="ltr">75°</span> بالنسبة للأفقي، والارتفاع الكلي لرمز القطر يساوي ارتفاع الأرقام الدالة على مقدار القطر، وتكتب علامة القطر على يسار الرقم الدال عليه (<span class="ltr">DIN 406 1968</span>)».</p>`},
  {fig:'',ref:'ص 37',caption:'رمز القطر مكبراً: الخط المائل بزاوية 75° مع الأفقي، وارتفاع الرمز كله يساوي ارتفاع الأرقام، ويكتب على يسار الرقم (رسم توضيحي)',draw:()=>wrap(phiSymSVG(),340)},
  {html:`<p>«وتستعمل العلامة <span class="ltr">ϕ</span> أيضاً مع أبعاد الأقطار المكتوبة على قوس والممثلة فقط بسهم بعد واحد، وكذلك مع أرقام الأبعاد المكتوبة بدون خطوط أبعاد، أو بدون خطوط أبعاد مساعدة (<span class="ltr">DIN 406; 1968</span>)».</p>`},
  {fig:'',ref:'ص 38',caption:'مسمار مدرج بمسقط واحد: الأقطار بعلامة ϕ، والطولان 33 و20 مقاسان من الطرف الأيمن',draw:()=>wrap(shaftSVG(PIN,{side:false,px:360,extraH:22,dims:[phiD(3.5,25,'ϕ25',{tdx:0}),phiD(13.5,20),phiD(30,10,'ϕ10',{out:1,tdx:-10}),[[0,12.5],[40,12.5],-8,{t:'40'}],[[7,-12.5],[40,-12.5],14,{t:'33',fa:[7,-12.5],fb:[40,-5]}],[[20,-5],[40,-5],10,{t:'20',fb:[40,-5]}]]}),380)},
  {fig:'',ref:'ص 38',caption:'مفتاح ربط مسطح بمسقط واحد: قطر الثقب 20 مكتوب على خط مائل يمر بالمركز بسهمين (بلا ϕ)، وفتحة الفك ϕ40 بسهم واحد من المركز (رسم بنسب الأبعاد المكتوبة)',draw:()=>wrap(spannerSVG(),440)},
  {h:'مشغولة أسطوانية: خطوات التشغيل',ref:'ص 38–39',html:'<p>يعرض الكتاب رسم المشغولة ثم أربعة أشكال لخطوات تشغيلها بلا نص شرح: (١) تحديد المركز ثم الثقب، (٢) خراطة العمود، (٣) تشغيل الانحسار، (٤) قطع المشغولة بالطول المطلوب. لاحظ في المسقط الجانبي (نراه من اليسار) أن الدائرة الخارجية <span class="ltr">ϕ30</span> تحجب دائرتي <span class="ltr">ϕ25</span> و<span class="ltr">ϕ20</span> فترسمان متقطعتين، أما الثقب النافذ <span class="ltr">ϕ10</span> فظاهر.</p>'},
  {fig:'',ref:'ص 38',caption:'رسم المشغولة: عمود مدرج طوله 80 مثقوب بثقب نافذ ϕ10، ومسقطه الجانبي',draw:()=>wrap(shaftSVG(WP,{bore:10,px:470,extraH:34,dims:wpDims()}),500)},
  {fig:'',ref:'ص 38–39',caption:'خطوات التشغيل الأربع (التفاصيل خطوة بخطوة في تبويب «الأمثلة المحلولة»)',draw:()=>{const st=[[[{d:30,L:90}],'١ - تحديد المركز ثم الثقب'],[[{d:30,L:50},{d:20,L:40}],'٢ - خراطة العمود'],[[{d:30,L:25},{d:25,L:10},{d:30,L:15},{d:20,L:40}],'٣ - تشغيل الانحسار'],[WP,'٤ - قطع المشغولة بالطول المطلوب']];
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${st.map(([sg,t])=>`<div>${wrap(shaftSVG(sg,{bore:10,px:300}),300)}<p class="sub" style="text-align:center;margin:2px 0 0">${t}</p></div>`).join('')}</div>`}},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> أطوال الطوقين <span class="ltr">ϕ30</span> (15 و15) غير مكتوبة على الرسم، وتستنتج من الأبعاد: <span class="ltr">80 − 55 − 10 = 15</span> و<span class="ltr">55 − 40 = 15</span>. وطول الخام في الخطوة الأولى غير مذكور، فرسمناه أطول قليلاً من 80.'}
 ],
 lab:(el)=>{
  let segs=WP.map(s=>Object.assign({},s)),bore=10,views='2';const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c7"><h2>ابنِ عموداً مدرجاً <small>مبنية على المشغولة ص 38–39 والمسمار ص 38</small></h2>
    <div class="dw-row"><span class="sub">ابدأ من:</span><button class="btn" data-pre="wp">مشغولة الكتاب (ص 38)</button><button class="btn" data-pre="pin">المسمار المدرج (ص 38)</button></div>
    <div class="dw-row"><span class="sub">التمثيل:</span>${segHTML('cv',[['2','مسقطان (رأسي + جانبي)'],['1','مسقط واحد مع ϕ']],views)}</div>
    <div class="dw-sheet" id="l7s"></div><div class="dw-msg" id="l7m"></div></div>
   <div class="panel c5"><h2>الأجزاء من اليسار إلى اليمين</h2><div class="tablebox"><table class="tt" id="l7t"></table></div>
    <div class="dw-row"><button class="btn" id="l7add">أضف جزءاً</button><button class="btn" id="l7del">احذف آخر جزء</button></div>
    <div class="dw-row"><label class="sub">قطر الثقب النافذ (0 = بلا ثقب) <input type="number" class="dw-num" id="l7b" min="0" max="60" step="1" value="${bore}"></label></div>
    <div class="dw-chk" id="l7c"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l7st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const table=()=>{$('#l7t').innerHTML='<thead><tr><th>#</th><th>القطر ϕ</th><th>الطول</th></tr></thead><tbody>'+segs.map((s,i)=>`<tr><td>${i+1}</td><td><input type="number" class="dw-num" data-i="${i}" data-k="d" min="1" max="60" step="1" value="${s.d}"></td><td><input type="number" class="dw-num" data-i="${i}" data-k="L" min="1" max="120" step="1" value="${s.L}"></td></tr>`).join('')+'</tbody>'};
  const draw=()=>{const Ltot=segs.reduce((a,s)=>a+s.L,0);let x=0;const dims=[];segs.forEach((s,i)=>{dims.push(phiD(x+s.L/2,s.d,(views==='1'?'ϕ':'ϕ')+s.d,s.L<12?{out:1,tdx:-12}:{}));x+=s.L});dims.push([[0,Math.max(...segs.map(s=>s.d))/2],[Ltot,Math.max(...segs.map(s=>s.d))/2],-8,{t:String(Ltot),fa:[0,segs[0].d/2],fb:[Ltot,segs[segs.length-1].d/2]}]);
    $('#l7s').innerHTML=shaftSVG(segs,{bore,side:views==='2',px:520,extraH:16,dims});
    const C=shaftCircles(segs,bore);$('#l7c').innerHTML=views==='2'?'<b>دوائر المسقط الجانبي (نراه من اليسار):</b>'+C.map(c=>`<div class="${c.vis?'ok':'no'}"><i>${c.vis?'—':'- -'}</i><span><span class="ltr">ϕ${fm(c.d)}</span>: ${c.vis?'ظاهرة (خط كامل)':'مختفية (متقطعة) — يحجبها جزء أكبر قطراً على يسارها'}${c.d===bore?' (الثقب النافذ)':''}</span></div>`).join(''):'<b>بمسقط واحد</b>: لا نرى الدوائر، فتدل علامة <span class="ltr">ϕ</span> قبل الرقم على أن المقطع دائري (ص 37).';
    $('#l7m').innerHTML=views==='2'?'كل جزء يظهر في المسقط الجانبي دائرة. الدائرة ظاهرة إذا لم يكن على يسارها (جهة النظر) جزء أكبر منها قطراً.':'المسقط الواحد يكفي للجسم الأسطواني البسيط إذا كتبنا علامة القطر <span class="ltr">ϕ</span> على يسار الرقم.'};
  $('#l7t').addEventListener('input',e=>{const t=e.target.closest('[data-i]');if(!t)return;const v=parseFloat(t.value);if(!isFinite(v)||v<=0)return;segs[+t.dataset.i][t.dataset.k]=clamp(v,1,t.dataset.k==='d'?60:120);did.edit=1;if(+t.dataset.i===0&&t.dataset.k==='d'&&v<20)did.small=1;draw()});
  $('#l7add').onclick=()=>{if(segs.length<6){segs.push({d:15,L:15});did.add=1;table();draw()}};$('#l7del').onclick=()=>{if(segs.length>1){segs.pop();table();draw()}};
  $('#l7b').oninput=e=>{const v=parseFloat(e.target.value);if(isFinite(v)&&v>=0){bore=clamp(v,0,Math.min(...segs.map(s=>s.d))-1);if(bore===0)did.nobore=1;draw()}};
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{const p=b.dataset.pre;segs=(p==='wp'?WP:PIN).map(s=>Object.assign({},s));bore=p==='wp'?10:0;$('#l7b').value=bore;did['pre'+p]=1;table();draw()});
  segBind(el,'cv',v=>{views=v;if(v==='1')did.one=1;draw()});
  const st=stepsUI($('#l7st'),[
   {t:'اقرأ المسقط الجانبي',x:'في مشغولة الكتاب: الدائرتان <span class="ltr">ϕ25</span> و<span class="ltr">ϕ20</span> متقطعتان لأن الطوق <span class="ltr">ϕ30</span> على اليسار يحجبهما. اضغط «التالي».'},
   {t:'صغّر الجزء الأول',x:'اجعل قطر الجزء الأول <span class="ltr">15</span>: تصبح دائرته ظاهرة ودوائر أخرى تتغير. لماذا؟',done:()=>did.small},
   {t:'المسمار المدرج',x:'اضغط «المسمار المدرج (ص 38)»: الأقطار تتناقص من اليسار، فكل الدوائر ظاهرة.',done:()=>did.prepin},
   {t:'مسقط واحد',x:'اختر «مسقط واحد مع ϕ» كما رسمه الكتاب في ص 38.',done:()=>did.one},
   {t:'أضف جزءاً',x:'أضف جزءاً جديداً وغيّر قطره وطوله، وتابع الطول الكلي.',done:()=>did.add}]);
  table();draw();loopOn(el,()=>st.check())},
 examples:[
  drawnEx('خطوات تشغيل المشغولة الأسطوانية','ص 38–39','<p>عمود مدرج طوله 80 مثقوب بثقب نافذ <span class="ltr">ϕ10</span>: طوق <span class="ltr">ϕ30</span>، ومجرى (انحسار) <span class="ltr">ϕ25</span> عرضه 10، وطوق <span class="ltr">ϕ30</span>، ثم جزء <span class="ltr">ϕ20</span> طوله 40. ارسم مراحل تشغيله كما في الكتاب.</p>',[
   ['١ - تحديد المركز ثم الثقب: خام أسطواني <span class="ltr">ϕ30</span> أطول من 80، والثقب <span class="ltr">ϕ10</span> بخطين متقطعين. المسقط الجانبي: دائرة خارجية ودائرة الثقب ظاهرتان.',shaftSVG([{d:30,L:90}],{bore:10,px:460,extraH:26,dims:[phiD(5,30,'ϕ30',{tdx:6}),phiD(14,10,'ϕ10',{out:1,tdx:-12})]})],
   ['٢ - خراطة العمود: يخرط الطرف الأيمن إلى <span class="ltr">ϕ20</span> بطول 40. في المسقط الجانبي تظهر دائرة <span class="ltr">ϕ20</span> متقطعة (يحجبها <span class="ltr">ϕ30</span>).',shaftSVG([{d:30,L:50},{d:20,L:40}],{bore:10,px:460,extraH:26,dims:[phiD(70,20),[[50,-10],[90,-10],10,{t:'40',fa:[50,-15]}]]})],
   ['٣ - تشغيل الانحسار: مجرى <span class="ltr">ϕ25</span> عرضه 10، حافته اليمنى على بعد 55 من الطرف الأيمن. تظهر دائرة <span class="ltr">ϕ25</span> متقطعة.',shaftSVG([{d:30,L:25},{d:25,L:10},{d:30,L:15},{d:20,L:40}],{bore:10,px:460,extraH:34,dims:[phiD(30,25),[[25,-15],[35,-15],8,{t:'10',out:1,fa:[25,-12.5],fb:[35,-12.5]}],[[35,-15],[90,-15],16,{t:'55'}]]})],
   ['٤ - قطع المشغولة بالطول المطلوب 80، وتكتب الأبعاد كاملة.',shaftSVG(WP,{bore:10,px:460,extraH:34,dims:wpDims()})]]),
  drawnEx('المسمار المدرج بمسقط واحد','ص 38','<p>ارسم المسمار المدرج بمسقط واحد: رأس <span class="ltr">ϕ25</span>، ثم <span class="ltr">ϕ20</span>، ثم <span class="ltr">ϕ10</span> طوله 20؛ الطول الكلي 40، والبعد 33 من الطرف الأيمن إلى الرأس.</p>',[
   ['ارسم خط المنتصف أولاً (محور الجسم)، ثم الأجزاء الثلاثة متماثلة حوله بأطوالها: 7 و13 و20.',shaftSVG(PIN,{side:false,px:380,extraH:22})],
   ['اكتب الأقطار بعلامة <span class="ltr">ϕ</span> على يسار الرقم؛ القطر الصغير <span class="ltr">ϕ10</span> بأسهم من الخارج لضيق المكان.',shaftSVG(PIN,{side:false,px:380,extraH:22,dims:[phiD(3.5,25,'ϕ25'),phiD(13.5,20),phiD(30,10,'ϕ10',{out:1,tdx:-10})]})],
   ['اكتب الأطوال: الكلي 40 أسفل، و33 و20 أعلى مقاسة من الطرف الأيمن. يكفي هذا المسقط الواحد لتحديد المسمار تماماً.',shaftSVG(PIN,{side:false,px:380,extraH:22,dims:[phiD(3.5,25,'ϕ25'),phiD(13.5,20),phiD(30,10,'ϕ10',{out:1,tdx:-10}),[[0,12.5],[40,12.5],-8,{t:'40'}],[[7,-12.5],[40,-12.5],14,{t:'33',fa:[7,-12.5],fb:[40,-5]}],[[20,-5],[40,-5],10,{t:'20',fb:[40,-5]}]]})]])
 ],
 quiz:[
  {q:'في أي مسقط يختلف الموشور ذو القاعدة المربعة عن الأسطوانة؟',o:['المسقط الرأسي','المسقط الجانبي','المسقط الأفقي','لا يختلفان'],c:2,e:'ص 37: يكون الاختلاف فقط في المسقط الأفقي الذي يشكل قاعدة الجسم المميزة.'},
  {q:'بأي زاوية يميل خط رمز القطر ϕ بالنسبة للأفقي؟',o:['45°','60°','75°','90°'],c:2,e:'ص 37 (DIN 406).'},
  {q:'أين تكتب علامة القطر بالنسبة للرقم؟',o:['على يمينه','على يساره','فوقه','تحته'],c:1,e:'ص 37: «وتكتب علامة القطر على يسار الرقم الدال عليه».'},
  {q:'كم مسقطاً يكفي لتمثيل أسطوانة بسيطة إذا استعملنا علامة ϕ؟',o:['مسقط واحد','مسقطان على الأقل','ثلاثة مساقط دائماً','أربعة مساقط'],c:0,e:'ص 37.'},
  {q:'في المسقط الجانبي لمشغولة ص 38 تظهر دائرة ϕ25 متقطعة لأن:',o:['المجرى مخفي داخل الثقب','الطوق ϕ30 على يسارها يحجبها عن الناظر','الكتاب أخطأ','كل الدوائر الداخلية متقطعة'],c:1,e:'المسقط الجانبي نراه من اليسار، والطوق الأيسر أكبر قطراً.'},
  {q:'ما أول خطوة في تشغيل المشغولة الأسطوانية (ص 38)؟',o:['خراطة العمود','تشغيل الانحسار','تحديد المركز ثم الثقب','قطع المشغولة بالطول'],c:2,e:'ص 38: «١ - تحديد المركز ثم الثقب».'}
 ]
});

/* =====================================================================
   LESSON 8 — المقاطع + نصائح عامة (ص 39–45)
   revolved parts as bands {z0,z1,r0,r1} (r0 = bore radius in that band), optional bolt holes {R,r,ang[],z0,z1}
   ===================================================================== */
const FLANGE={bands:[{z0:-3,z1:0,r0:15,r1:35},{z0:0,z1:15,r0:15,r1:60},{z0:15,z1:50,r0:15,r1:25},{z0:50,z1:60,r0:15,r1:30}],holes:{R:45,r:7,ang:[45,135,225,315],z0:0,z1:15},pcd:90};
const BUSH={bands:[{z0:0,z1:14,r0:11,r1:30},{z0:14,z1:44,r0:7,r1:16}]};
/* o: {mode:'none'|'full'|'half'|'part', th:deg (cutting plane direction in the top view), s:offset (mm), hid:true draws hidden edges inside the section (the book's «خطأ»),
       plan:true add the top view under it, px, steps:n (for drawn examples: 1 outline, 2 +centre line, 3 +cut zone cleared, 4 +hatching)} */
function revSVG(Pf,o){o=o||{};const B_=Pf.bands,Rm=Math.max(...B_.map(b=>b.r1)),zmin=Math.min(...B_.map(b=>b.z0)),zmax=Math.max(...B_.map(b=>b.z1));
  const th=(o.th||0)*Math.PI/180,s0=o.s||0,mode=o.mode||'none',plan=o.plan!==false,pad=14,g=16,Hs=zmax-zmin,W=2*Rm+2*pad,H=Hs+(plan?g+2*Rm:0)+2*pad,sc=(o.px||420)/W;
  const T=q=>[(q[0]+Rm+pad)*sc,(zmax-q[1]+pad)*sc],TP=q=>[(q[0]+Rm+pad)*sc,(Hs+g+Rm+pad+q[1])*sc];
  const tv=[Math.cos(th),Math.sin(th)],nv=[-Math.sin(th),Math.cos(th)];const holes=Pf.holes?Pf.holes.ang.map(a=>[Pf.holes.R*Math.cos(a*Math.PI/180),Pf.holes.R*Math.sin(a*Math.PI/180)]):[];
  const stp=o.step||9;let h=svgOpen(W*sc,H*sc,'قطاع جسم دوراني')+HATCH;
  /* cut zone (u range) */
  const zone=mode==='full'?[-Rm-1,Rm+1]:mode==='half'?[0,Rm+1]:mode==='part'?[Rm*0.3,Rm+1]:null;const zz=mode==='part'?[zmin-1,zmin+(Hs*0.45)]:[zmin-1,zmax+1];
  const inZ=(u,z)=>zone&&u>=zone[0]-1e-9&&u<=zone[1]+1e-9&&z>=zz[0]-1e-9&&z<=zz[1]+1e-9;
  /* exterior outline */
  let ext='';B_.forEach(b=>{ext+=plyl([[-b.r1,b.z0],[b.r1,b.z0],[b.r1,b.z1],[-b.r1,b.z1]].map(T),'vl',true,' style="fill:none"')});h+=ext;
  /* hidden edges of the exterior view: bore steps and holes */
  const hidE=[];B_.forEach(b=>{[-1,1].forEach(sg=>hidE.push([[sg*b.r0,b.z0],[sg*b.r0,b.z1]]))});
  for(let i=1;i<B_.length;i++){const a=B_[i-1],b=B_[i];if(a.r0!==b.r0){const r=Math.max(a.r0,b.r0);[-1,1].forEach(sg=>hidE.push([[sg*Math.min(a.r0,b.r0),a.z1],[sg*r,a.z1]]))}}
  holes.forEach(c=>{const u=c[0]*tv[0]+c[1]*tv[1];[-1,1].forEach(sg=>hidE.push([[u+sg*Pf.holes.r,Pf.holes.z0],[u+sg*Pf.holes.r,Pf.holes.z1]]))});
  const clipU=(seg,keepIn)=>{/* keep the part of a vertical/horizontal hidden segment outside (or inside) the cut zone */const [a,b]=seg;if(!zone)return keepIn?[]:[seg];
    if(a[0]===b[0]){const u=a[0];const inU=u>=zone[0]&&u<=zone[1];if(!inU)return keepIn?[]:[seg];const lo=Math.max(a[1],zz[0]),hi=Math.min(b[1],zz[1]);if(lo>=hi)return keepIn?[]:[seg];
      if(keepIn)return [[[u,lo],[u,hi]]];const out=[];if(a[1]<lo)out.push([[u,a[1]],[u,lo]]);if(b[1]>hi)out.push([[u,hi],[u,b[1]]]);return out}
    const z=a[1];if(z<zz[0]||z>zz[1])return keepIn?[]:[seg];const lo=Math.max(Math.min(a[0],b[0]),zone[0]),hi=Math.min(Math.max(a[0],b[0]),zone[1]);if(lo>=hi)return keepIn?[]:[seg];
    if(keepIn)return [[[lo,z],[hi,z]]];const out=[],x0=Math.min(a[0],b[0]),x1=Math.max(a[0],b[0]);if(x0<lo)out.push([[x0,z],[lo,z]]);if(x1>hi)out.push([[hi,z],[x1,z]]);return out};
  if(mode==='none'&&stp>=1)hidE.forEach(sg=>h+=hidLn(T(sg[0]),T(sg[1])));
  /* section */
  if(zone&&stp>=3){const ZA=T([zone[0],zz[1]]),ZB=T([zone[1],zz[0]]);
    if(mode==='part'){/* free-hand break line */let d=`M${P2(T([zone[0],zz[0]]))}`;const N=10;for(let i=1;i<=N;i++){const z=zz[0]+(zz[1]-zz[0])*i/N,u=zone[0]+(i%2?2.5:-2.5);d+=`L${P2(T([u,z]))}`}d+=`L${P2(T([zone[1],zz[1]]))}`;
      h+=`<rect x="${f2(ZA[0])}" y="${f2(ZA[1])}" width="${f2(ZB[0]-ZA[0])}" height="${f2(ZB[1]-ZA[1])}" style="fill:var(--surface)"/>`+`<path d="${d}" class="tn" style="fill:none;stroke-width:1.1"/>`}
    else h+=`<rect x="${f2(ZA[0])}" y="${f2(ZA[1])}" width="${f2(ZB[0]-ZA[0])}" height="${f2(ZB[1]-ZA[1])}" style="fill:var(--surface)"/>`;
    /* visible outline behind the plane inside the zone */
    const vis=[];B_.forEach(b=>{[-1,1].forEach(sg=>vis.push([[sg*b.r1,b.z0],[sg*b.r1,b.z1]]));vis.push([[-b.r1,b.z0],[b.r1,b.z0]],[[-b.r1,b.z1],[b.r1,b.z1]])});
    vis.forEach(sg=>clipU(sg,true).forEach(q=>{const ub=Math.sqrt(Math.max(0,15*15-s0*s0));if(q[0][1]===q[1][1]&&q[0][1]>zmin+1e-9&&q[0][1]<zmax-1e-9){/* inner horizontal: not across the bore (the top and bottom rims of the bore are visible) */const lo=Math.min(q[0][0],q[1][0]),hi=Math.max(q[0][0],q[1][0]);[[lo,Math.min(hi,-ub)],[Math.max(lo,ub),hi]].forEach(([x0,x1])=>{if(x1>x0+0.01)h+=ln(T([x0,q[0][1]]),T([x1,q[0][1]]),'vl')})}else h+=ln(T(q[0]),T(q[1]),'vl')}));
    /* cut faces */
    if(stp>=4)B_.forEach(b=>{if(b.r1<=s0)return;const ui=Math.sqrt(Math.max(0,b.r0*b.r0-s0*s0)),uo=Math.sqrt(b.r1*b.r1-s0*s0);let iv=b.r0>s0?[[-uo,-ui],[ui,uo]]:[[-uo,uo]];
      if(Pf.holes&&b.z0>=Pf.holes.z0&&b.z1<=Pf.holes.z1)holes.forEach(c=>{const d=c[0]*nv[0]+c[1]*nv[1]-s0;if(Math.abs(d)>=Pf.holes.r)return;const uc=c[0]*tv[0]+c[1]*tv[1],w=Math.sqrt(Pf.holes.r**2-d*d);const nx=[];iv.forEach(([a,c2])=>{if(uc+w<=a||uc-w>=c2){nx.push([a,c2]);return}if(uc-w>a)nx.push([a,uc-w]);if(uc+w<c2)nx.push([uc+w,c2])});iv=nx});
      iv.forEach(([a,c2])=>{const lo=Math.max(a,zone[0]),hi=Math.min(c2,zone[1]),z0=Math.max(b.z0,zz[0]),z1=Math.min(b.z1,zz[1]);if(hi-lo<0.05||z1-z0<0.05)return;const A=T([lo,z1]),Bq=T([hi,z0]);
        h+=`<rect x="${f2(A[0])}" y="${f2(A[1])}" width="${f2(Bq[0]-A[0])}" height="${f2(Bq[1]-A[1])}" class="hatch"/>`+plyl([[lo,z0],[hi,z0],[hi,z1],[lo,z1]].map(T),'vl',true,' style="fill:none"')})});
    if(o.hid)hidE.forEach(sg=>clipU(sg,true).forEach(q=>h+=hidLn(T(q[0]),T(q[1]),{cls:'bad'})));
    hidE.forEach(sg=>clipU(sg,false).forEach(q=>{if(mode==='part')h+=hidLn(T(q[0]),T(q[1]))}))}
  if(stp>=2)h+=ctrLn(T([0,zmin-4]),T([0,zmax+4]));
  if(Pf.holes&&stp>=2&&zone)holes.forEach(c=>{const d=c[0]*nv[0]+c[1]*nv[1]-s0;if(Math.abs(d)<Pf.holes.r){const uc=c[0]*tv[0]+c[1]*tv[1];if(inZ(uc,(Pf.holes.z0+Pf.holes.z1)/2))h+=ctrLn(T([uc,Pf.holes.z0-3]),T([uc,Pf.holes.z1+3]))}});
  /* dims are given as (u, z); the toolkit's dim() works with v downward, so flip z */
  const fl=q=>q&&[q[0],-q[1]],TF=q=>T([q[0],-q[1]]);(o.dims||[]).forEach(d=>h+=dim(TF,fl(d[0]),fl(d[1]),d[2],Object.assign({},d[3],{fa:fl(d[3].fa),fb:fl(d[3].fb)})));
  if(plan){const cpt=TP([0,0]),R=r=>r*sc;const circ=(r,cls,dash)=>`<circle cx="${f2(cpt[0])}" cy="${f2(cpt[1])}" r="${f2(R(r))}" class="${cls}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
    const topR=[...new Set(B_.map(b=>b.r1))].sort((a,b)=>b-a);const zTop=r=>Math.max(...B_.filter(b=>b.r1>=r-1e-9).map(b=>b.z1));
    topR.forEach(r=>{/* a band's outer circle is visible from above unless a wider band lies above it */const vis=B_.filter(b=>Math.abs(b.r1-r)<1e-9).some(b0=>!B_.some(b=>b.r1>r+1e-9&&b.z0>=b0.z1-1e-9));h+=circ(r,vis?'vl':'hl',vis?null:`${f2(2*Math.PI*R(r)/Math.max(10,Math.round(2*Math.PI*R(r)/8.5))*0.65)} ${f2(2*Math.PI*R(r)/Math.max(10,Math.round(2*Math.PI*R(r)/8.5))*0.35)}`)});
    h+=circ(Math.min(...B_.map(b=>b.r0)),'vl');
    if(Pf.pcd)h+=circ(Pf.pcd/2,'cl','14 2.5 1.5 2.5');
    holes.forEach(c=>{const p=TP([c[0],-c[1]]);h+=`<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(R(Pf.holes.r))}" class="vl"/>`;const dx=Math.cos(Math.atan2(-c[1],c[0])),dy=Math.sin(Math.atan2(-c[1],c[0]));h+=ctrLn([p[0]-dx*R(10),p[1]-dy*R(10)],[p[0]+dx*R(10),p[1]+dy*R(10)])+ctrLn([p[0]+dy*R(10),p[1]-dx*R(10)],[p[0]-dy*R(10),p[1]+dx*R(10)])});
    h+=ctrLn(TP([-Rm-4,0]),TP([Rm+4,0]))+ctrLn(TP([0,-Rm-4]),TP([0,Rm+4]));
    if(zone){/* cutting path: thick dash-dot with thick ends and view arrows; letters A–A (ص 39) */const p0=mode==='half'?[0,0]:[-(Rm+6)*tv[0]+s0*nv[0],-(Rm+6)*tv[1]+s0*nv[1]],p1=[(Rm+6)*tv[0]+s0*nv[0],(Rm+6)*tv[1]+s0*nv[1]];
      const S=q=>TP([q[0],-q[1]]);h+=ln(S(p0),S(p1),'cl',' style="stroke:var(--blue-ink);stroke-width:1.4" stroke-dasharray="14 3 2 3"');
      [p0,p1].forEach((p,i)=>{const e=S(p),dirc=i?[tv[0],-tv[1]]:[-tv[0],tv[1]];const e2=[e[0]-dirc[0]*R(7),e[1]-dirc[1]*R(7)];h+=ln(e2,e,'',' style="stroke:var(--blue-ink);stroke-width:4"');
        const av=[nv[0],-nv[1]];const a0=[e[0]+av[0]*R(10),e[1]+av[1]*R(10)];h+=ln(a0,e,'',' style="stroke:var(--blue-ink);stroke-width:1.4"')+arrowHead(e,[-av[0],-av[1]],8).replace('class="ar"','style="fill:var(--blue-ink)"')+tx(a0[0]+av[0]*8,a0[1]+av[1]*8+4,'A','dt','middle',0,' style="font-weight:700;fill:var(--blue-ink)"')})}}
  return h+'</svg>'}

B.lesson({
 id:'u1-l8',unit:1,order:8,pages:'39–45',
 title:'المقاطع ونصائح عامة',
 summary:'نتصور قطع المشغولة لتظهر تفاصيلها الداخلية بوضوح بدل كثرة الحواف المختفية: قطاع كامل أو نصف قطاع أو قطاع جزئي. يميز سطح القطاع بخطوط رقن (تهشير) رفيعة مائلة بزاوية 45°، ولا ترسم الحواف المختفية في القطاع.',
 stations:[
  {intro:true},

  {st:1,short:'مقاطع الأجسام (١)',title:'١-١٣ مقاطع الأجسام (١)',ref:'ص 39–40',
   q:'جسم مفرغ مليء بالخطوط المتقطعة حتى صار الرسم شبكة لا تقرأ… ما الحل؟',
   get art(){const b=DWS.fit(v=>revSVG(BUSH,{mode:'half',px:v}),50,22,260,262);const sc=b.px/88,T=q=>[(q[0]+44)*sc,(44-q[1]+14)*sc],TP=q=>[(q[0]+44)*sc,(44+16+30+14+q[1])*sc];
     let t=DWS.tipR(b.M,T([-30,44]),T([-1,0]),'النصف الأيسر: منظر خارجي بلا حواف مختفية.',0)+DWS.tipR(b.M,T([1,44]),T([30,0]),'النصف الأيمن: مقطوع، والسطح المقطوع مهشر بخطوط رفيعة مائلة؛ ويظهر الثقب المدرج بخطوط كاملة.',0)+DWS.tipR(b.M,TP([-30,-30]),TP([30,30]),'المسقط الأفقي: دوائر متحدة المركز، وعليه مسار القطع بالحرف ⟦A⟧ وأسهم اتجاه النظر.',0);
     return DWS.art('جلبة بفلانشة بنصف قطاع',b.g+t)},
   cap:'جلبة بفلانشة بنصف قطاع (من أشكال ص 39، الأبعاد للتوضيح).<br><b>مرّر المؤشر على النصفين والمسقط الأفقي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا نتصور قطع المشغولة المفرغة؟',opts:[
     ['لتقليل عدد المساقط',false,'ليس هذا السبب الذي يذكره الكتاب.'],
     ['لأن كثرة الحواف المختفية تجعل الرسم غير واضح، والقطع يظهر التفاصيل بوضوح',true,'الكتاب (ص 39): «وللتغلب على هذه الصعوبة نتصور قطع المشغولات ومن ثم يمكن تمثيل التفاصيل بدقة كافية وبوضوح».'],
     ['لإخفاء الأبعاد الداخلية',false,'العكس: القطع يظهر الداخل لتوضع أبعاده بوضوح.']]}}
   ],
   body:[
    {book:`<p>تنتج عن التمثيل المعتاد للمشغولات بثلاثة مساقط رسومات تحتوي على العديد من الحواف المختفية، وذلك خاصة في حالة الأجسام المفرغة. إلا أن الرسم في مجموعه يصبح غير واضح وكثيراً ما تصعب قراءته.<br>وللتغلب على هذه الصعوبة نتصور قطع المشغولات ومن ثم يمكن تمثيل التفاصيل بدقة كافية وبوضوح. وقد حددت المواصفات (<span class="ltr">DIN 6</span>) قواعد تمثيل الأجسام المقطوعة. ويمكن التفرقة بين القطاع الكامل ونصف القطاع والقطاع الجزئي تبعاً لأسلوب القطع.</p>`,ref:'ص 39'},
    {get html(){return DWS.figHtml(B,'u1-l8','ص 39',0)}},
    {book:`<p>لا يحدد مسار القطع بشكل خاص في الرسم عند تمثيل الأجزاء البسيطة. أما إذا لزم التركيز على مسار معقد للقطع، فإنه يمثل بشرط ونقط عريضة وذلك عند نهاية وبداية خط المنتصف وعند نقط تغيير اتجاه مسار القطع. ويحدد اتجاه النظر إلى المساحة المقطوعة بواسطة أسهم. وتميز الأسهم ونقط التحول بحروف هجائية.<br>وإذا كوَّن مستويا القطع فيما بينهما زاوية فيتصور دورانهما إلى مستوى واحد.</p>`,ref:'ص 40'},
    {get html(){return DWS.figHtml(B,'u1-l8','ص 40',0)}},
    {tip:`<p>تخيل منشاراً يقطع الجسم بمستوى، ثم تزيل الجزء الأمامي وتنظر إلى الباقي: <b>القطاع الكامل</b> يقطع الجسم كله، و<b>نصف القطاع</b> يقطع ربعه فيبقى نصف المسقط منظراً خارجياً ونصفه داخلياً (مناسب للأجسام المتماثلة)، و<b>القطاع الجزئي</b> يقطع جزءاً صغيراً محدوداً بخط كسر متعرج.</p>`,title:'ثلاثة أنواع بالمنشار الوهمي'},
    {title:'مختبر مصغّر: اختر أسلوب القطع',widget:(el,B)=>DCML.lab(el,B,{intro:'الجلبة نفسها بأساليب القطع الثلاثة. قارن وضوح الثقب المدرج في كل حالة.',
     predict:{q:'أي أسلوب يبين الشكل الخارجي والداخلي معاً في مسقط واحد لجسم متماثل؟',opts:[['القطاع الكامل',false,'القطاع الكامل يخفي الشكل الخارجي كله.'],['نصف القطاع',true,'نصف المسقط منظر خارجي ونصفه مقطوع، ويفصل بينهما خط المنتصف (ص 39، 41).'],['بلا قطع',false,'بلا قطع يبقى الداخل حواف مختفية متقطعة.']]},
     ins:[{k:'m',l:'أسلوب القطع',seg:[['none','بلا قطع'],['full','قطاع كامل'],['half','نصف قطاع'],['part','قطاع جزئي']],v:'none'}],
     calc:s=>({pic:`<div class="dw-sheet" style="max-width:260px;margin-inline:auto">${revSVG(BUSH,{mode:s.m,px:260})}</div>`,msg:s.m==='none'?'بلا قطع: الثقب المدرج خطوط متقطعة.':s.m==='full'?'قطاع كامل: الجسم مقطوع كله، والسطح المقطوع مهشر، والثقب المدرج بخطوط كاملة.':s.m==='half'?'نصف قطاع: النصف الأيسر خارجي بلا حواف مختفية، والأيمن مقطوع.':'قطاع جزئي: جزء فقط مقطوع ومحدود بخط كسر حر متعرج.'})})}
   ]},

  {st:2,short:'نصف قطاع لشفة',title:'نصف قطاع لشفة (فلانشة)',ref:'ص 41',
   q:'أربعة ثقوب براغٍ في قاعدة الفلانشة… متى يظهر أحدها مقطوعاً في نصف القطاع؟',
   get art(){const D=[[[-30,60],[30,60],10,{t:'ϕ60'}],[[-15,60],[15,60],4,{t:'ϕ30'}],[[-25,35],[25,35],0,{ext:false,t:'ϕ50'}],[[-60,0],[-60,60],8,{t:'60',fb:[-30,60]}],[[60,60],[60,50],8,{t:'10',out:1,fa:[30,60],fb:[30,50]}],[[60,15],[60,0],8,{t:'15'}],[[60,0],[60,-3],8,{t:'3',out:1,fb:[35,-3],tdx:6}],[[-35,-3],[35,-3],-6,{t:'ϕ70'}],[[-60,-3],[60,-3],-13,{t:'ϕ120'}],[[38,15],[52,15],7,{t:'ϕ14',out:1,ext:false}]];
     const b=DWS.fit(v=>revSVG(FLANGE,{mode:'half',th:45,px:v,dims:D}),50,20,260,276);const sc=b.px/148,T=q=>[(q[0]+74)*sc,(60-q[1]+14)*sc],TP=q=>[(q[0]+74)*sc,(63+16+60+14+q[1])*sc];
     let t=DWS.tipR(b.M,T([-60,60]),T([-1,-3]),'النصف الأيسر: منظر خارجي — الطوق ⟦ϕ60⟧ والرقبة ⟦ϕ50⟧ والقاعدة ⟦ϕ120⟧ والبروز ⟦ϕ70⟧.',0)+DWS.tipR(b.M,T([1,60]),T([60,-3]),'النصف الأيمن: مقطوع ومهشر بين الثقب ⟦ϕ30⟧ والحافة الخارجية، ويظهر ثقب البرغي ⟦ϕ14⟧ مقطوعاً غير مهشر.',0)+DWS.tipR(b.M,TP([-60,-60]),TP([60,60]),'المسقط الأفقي: أربعة ثقوب ⟦ϕ14⟧ على دائرة مراكز قطرها 90، ومسار القطع يمر بالمحور وبثقب.',0);
     return DWS.art('فلانشة بنصف قطاع ومسقطها الأفقي',b.g+t,'#FBE6C4')},
   cap:'نصف قطاع لشفة (فلانشة) والمسقط الأفقي (لوحة ص 41).<br><b>مرّر المؤشر على النصفين والمسقط الأفقي (أو المسها في الجوال) لتعرف ما يبينه كل منها.</b>',
   side:[
    {predict:{q:'في نصف القطاع للفلانشة، ثقب البرغي <span class="ltr">ϕ14</span> المقطوع: هل يهشر؟',opts:[
     ['نعم، كل ما يقطعه المستوى يهشر',false,'التهشير للمادة المقطوعة فقط، والثقب فراغ لا مادة فيه.'],
     ['لا، يبقى فراغاً بلا تهشير، ويهشر ما حوله من القاعدة',true,'كما في لوحة ص 41: الثقب يظهر مقطوعاً غير مهشر بخط منتصفه، والقاعدة خارجه مهشرة.'],
     ['يرسم بخط متقطع',false,'لا ترسم الحواف المختفية في القطاع (ص 42).']]}}
   ],
   body:[
    {tip:`<p>لوحة بلا نص على ورقة مربعات: الفلانشة بنصف قطاع؛ النصف الأيسر منظر خارجي، والنصف الأيمن مقطوع ومهشر، ويظهر فيه ثقب البرغي <span class="ltr">ϕ14</span> مقطوعاً. في المسقط الأفقي أربعة ثقوب على دائرة مراكز قطرها 90.</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l8','ص 41',0)}},
    {watch:`<p>رسم الكتاب ثقوب البراغي في المسقط الأفقي عند <span class="ltr">45°</span> و<span class="ltr">135°</span>…، ورسم ثقباً مقطوعاً في نصف القطاع. لا يذكر الكتاب موضع مستوى القطع، فرسمناه هنا مارّاً بالمحور وبثقبين متقابلين (اتجاه <span class="ltr">45°</span>) ليتفق الشكلان. في تبويب «المختبر» دوّر مستوى القطع ولاحظ متى يظهر الثقب مقطوعاً.</p>`,fix:true},
    {title:'مختبر مصغّر: اقرأ نصف القطاع',widget:(el,B)=>DCML.cases(el,B,{intro:'سؤالان من لوحة الفلانشة.',cases:[
     {q:'ما الذي يفصل النصف الخارجي عن النصف المقطوع؟',opts:[['خط كامل عريض',false,'لو رسم خطاً كاملاً لبدا حافة في الجسم وهي غير موجودة.'],['خط المنتصف (محور الفلانشة)',true,'نصف القطاع يفصل بين نصفيه خط المنتصف (ص 39، 41).'],['خط متقطع',false,'الخط المتقطع للحواف المختفية.']]},
     {q:'هل ترسم الحواف المختفية في النصف الخارجي (الأيسر)؟',opts:[['نعم، حتى يظهر الثقب الأوسط',false,'النصف المقطوع يبين الداخل، فالحواف المختفية في النصف الآخر تكرار يزحم الرسم.'],['لا، يكفي ما يبينه النصف المقطوع',true,'في الشكل «نصف قطاع» (ص 39) النصف الخارجي بلا حواف مختفية.']]}]})}
   ]},

  {st:3,short:'مقاطع الأجسام (٢)',title:'١-١٤ مقاطع الأجسام (٢)',ref:'ص 42–43',
   q:'عمود مصمت يمر به مستوى القطع… هل تهشّره كالجلبة التي حوله؟',
   get art(){const sv=DWS.fig(B,'u1-l8','ص 42',0);const a=DWS.put(sv[0],20,50,156,92),b=DWS.put(sv[1],184,46,156,100);
     const c=DWS.put(DWS.fig(B,'u1-l8','ص 43',0)[0],40,170,280,105);
     let t=DWS.tip(20,50,156,92,'قطع خطوط الرقن: إذا كتب بعد أو كتابة على السطح المرقن تقطع خطوط الرقن حول الرقم.')+DWS.tip(184,46,156,100,'مشغولة مركبة من ثلاثة أجزاء: كل جزء يرقن بخطوط تختلف في اتجاهها أو كثافتها عن الجزء المجاور.')+DWS.tip(40,170,280,105,'عمود داخل جلبة: الجلبة المقطوعة مهشرة، والعمود المصمت يرسم كما هو دون قطع رغم مرور مستوى القطع بمحوره.');
     return DWS.art('قواعد التهشير في القطاع',a.g+b.g+c.g+t)},
   cap:'قواعد خطوط الرقن (التهشير) من أشكال ص 42–43.<br><b>مرّر المؤشر على كل شكل (أو المسه في الجوال) لتعرف قاعدته.</b>',
   side:[
    {predict:{q:'بأي زاوية تميل خطوط الرقن (التهشير) على سطح القطاع؟',opts:[
     ['<span class="ltr">30°</span>',false,'ليست هذه زاوية الكتاب.'],
     ['<span class="ltr">45°</span>',true,'الكتاب (ص 42): «خطوط رقن (تهشير) كاملة رفيعة مائلة بزاوية قدرها 45».'],
     ['<span class="ltr">90°</span>',false,'الخطوط الرأسية قد تختلط بحواف الجسم.']]}}
   ],
   body:[
    {book:`<p>يقطع الجسم عادة إما في اتجاه موازٍ للمحور الطولي أو عمودياً عليه. ويميز سطح القطاع باستخدام خطوط رقن (تهشير) كاملة رفيعة مائلة بزاوية قدرها <span class="ltr">45</span>. وإذا تطلب الأمر وضع قيمة البعد أو أي كتابة أخرى على السطح المرقن فتقطع خطوط الرقن. وإذا قطعت مشغولة مركبة من عدة أجزاء يرقن كل جزء بخطوط تختلف في اتجاهها أو كثافتها عن خطوط ترقين الجزء المجاور.</p><p>عند تمثيل الأجسام المقطوعة، لا ترسم الحواف غير المرئية بخطوطها المنقطة وذلك لضمان وضوح القطاع. إلا أن هذه الحواف ترسم فقط إذا ما تطلب وضوح الرسم ضرورة وجودها.</p>`,ref:'ص 42'},
    {get html(){return DWS.figHtml(B,'u1-l8','ص 42',1)}},
    {book:`<p>إذا مر مسار القطع طولياً بوترة (عصب) فتمثل الوترة كما هي دون قطع. وكذلك الحال في الأجسام البسيطة المصمتة مثل التيل، البرشام، الأعمدة، المحاور، المسامير الملولبة، الصواميل، النوابض، الخوابير وحلقات إحكام الربط والأسافين.</p>`,ref:'ص 42–43'},
    {tip:`<p>لماذا لا يهشر العمود المصمت؟ لأن قطعه لا يكشف أي تفصيل داخلي جديد: داخله مادة مصمتة فقط. ولو هُشّر لظن القارئ أنه جزء مفرغ مقطوع. والعصب (الوترة) كذلك: لو هُشّر عند القطع الطولي لبدا الجسم كتلة مصمتة سميكة.</p>`,title:'لماذا يستثنى العمود والعصب؟'},
    {title:'مختبر مصغّر: يهشر أم لا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'مستوى القطع يمر طولياً بكل جزء مما يأتي. هل يهشر؟',cats:['يهشر','لا يهشر (يرسم كما هو)'],items:[
     ['جلبة مفرغة تحيط بعمود',0,'الجلبة جسم مفرغ مقطوع فيهشر سطحها المقطوع (ص 43).'],
     ['العمود داخل الجلبة',1,'«الأعمدة» من الأجسام البسيطة المصمتة التي لا تقطع.'],
     ['مسمار برشام يربط لوحين',1,'«البرشام» في قائمة الكتاب.'],
     ['عصب (وترة) في حامل',1,'«إذا مر مسار القطع طولياً بوترة (عصب) فتمثل الوترة كما هي دون قطع».'],
     ['قاعدة الحامل المقطوعة',0,'جزء من الجسم المقطوع، فيهشر.'],
     ['صامولة',1,'«الصواميل» في قائمة الكتاب.']]})},
    {title:'مختبر مصغّر: الحواف المختفية داخل القطاع',widget:(el,B)=>DCML.lab(el,B,{intro:'قطاع كامل للفلانشة. ارسم الحواف المختفية داخله أو احذفها، وقارن الوضوح.',
     ins:[{k:'h',l:'',sw:true,v:0,on:'الحواف المختفية مرسومة (خطأ) — اضغط لحذفها',off:'بلا حواف مختفية (صواب) — اضغط لرسمها'}],
     calc:s=>({pic:`<div class="dw-sheet" style="max-width:300px;margin-inline:auto">${revSVG(FLANGE,{mode:'full',th:0,hid:!!s.h,plan:false,px:300})}</div>`,cls:s.h?'bad':'',msg:s.h?'«لا ترسم الحواف غير المرئية بخطوطها المنقطة وذلك لضمان وضوح القطاع» (ص 42): الخطوط الحمراء تزحم القطاع بلا فائدة.':'هذا الصواب: القطاع واضح بلا خطوط متقطعة.'})})}
   ]},

  {st:4,short:'رافعة توجيه',title:'رافعة توجيه',ref:'ص 44',
   q:'مستوى القطع يمر في وسط الرافعة من أعلاها إلى أسفلها… فلماذا لا تهشر الشوكة في القطاع؟',
   get art(){const sv=DWS.fig(B,'u1-l8','ص 44',0)[0];const b=DWS.put(sv,30,22,300,276);const s=1.6,pad=18,T=(x,y)=>[(x+pad+30)*s,(135-y+pad)*s];
     let t=DWS.tipR(b.M,T(-25,140),T(25,-32),'المسقط الرأسي: ذراع متماثلة حول خط المنتصف؛ أعلاها شوكة بمجرى عرضه 25، وأسفلها عين ⟦ϕ60⟧ بثقب ⟦ϕ40⟧. مسار القطع ⟦A–B⟧ على خط المنتصف.',0)+DWS.tipR(b.M,T(65,135),T(100,62),'القطاع ⟦A–B⟧ في الشوكة: غير مهشر، لأن مستوى القطع يمر في فراغ المجرى.',0)+DWS.tipR(b.M,T(65,30),T(100,-30),'القطاع ⟦A–B⟧ في العين: مهشر فوق الثقب وتحته، والثقب ⟦ϕ40⟧ فراغ غير مهشر.',0);
     return DWS.art('رافعة توجيه: المسقط الرأسي والقطاع A-B',b.g+t)},
   cap:'رافعة توجيه (لوحة ص 44، رسم مبسط بالأبعاد الرئيسية).<br><b>مرّر المؤشر على المسقط وعلى أجزاء القطاع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في القطاع <span class="ltr">A–B</span> تظهر الشوكة العلوية بلا تهشير. لماذا؟',opts:[
     ['لأنها عصب',false,'الشوكة ليست عصباً؛ السبب في مكان مستوى القطع.'],
     ['لأن مستوى القطع يمر في فراغ المجرى بين جناحي الشوكة',true,'خط المنتصف (مسار القطع) يمر في المجرى، فلا مادة مقطوعة هناك؛ نرى جناح الشوكة خلفه كما هو.'],
     ['لأن الكتاب نسي تهشيرها',false,'التهشير في الكتاب صحيح: العين وحدها مقطوعة.']]}}
   ],
   body:[
    {tip:`<p>لوحة بلا نص على ورقة مربعات: رافعة توجيه طرفها العلوي شوكة بمجرى عرضه 25 والسفلي عين دائرية بثقب <span class="ltr">ϕ40</span>. مسار القطع <span class="ltr">A–B</span> على خط المنتصف، والقطاع <span class="ltr">A–B</span> مرسوم على يمين المسقط الرأسي: العين مهشرة فوق الثقب وتحته، والشوكة غير مهشرة لأن القطع يمر في فراغ المجرى.</p>`,title:'كيف تقرأ هذه اللوحة؟'},
    {get html(){return DWS.figHtml(B,'u1-l8','ص 44',0)}},
    {title:'مختبر مصغّر: اقرأ القطاع A–B',widget:(el,B)=>DCML.cases(el,B,{intro:'سؤالان من لوحة رافعة التوجيه.',cases:[
     {q:'أين يرسم مسار القطع <span class="ltr">A–B</span>؟',opts:[['على خط المنتصف الرأسي للمسقط الرأسي، وعند طرفيه الحرفان وأسهم اتجاه النظر',true,'الأسهم والحروف تحدد المسار واتجاه النظر (ص 40).'],['على حافة الرافعة اليسرى',false,'لو مر بالحافة لما قطع الثقب ولا المجرى.']]},
     {q:'في القطاع، الثقب <span class="ltr">ϕ40</span> في العين:',opts:[['مهشر مثل العين',false,'الثقب فراغ، والتهشير للمادة المقطوعة فقط.'],['غير مهشر، والعين فوقه وتحته مهشرة',true,'كما في لوحة ص 44.']]}]})}
   ]},

  {st:5,short:'نصائح عامة',title:'نصائح عامة',ref:'ص 45',
   q:'أدواتك ستبقى معك سنوات… ما العادات الصغيرة التي تحفظها وتحفظ رسمك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أفعال ممنوعة مع أدوات الرسم: قطع الورق بالمسطرة، تزييت الفرجار، ثني الورق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/>
<g data-tip="لا تستعمل حافة المسطرة حرف ⟦T⟧ كسكين لقطع الورق: تتلف الحافة فتعوج خطوطك."><rect x="40" y="70" width="130" height="90" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="56" y="104" width="98" height="10" fill="#BFD7EA" stroke="#2C4A40" stroke-width="1.6"/><path d="M70 126l40 -6l-34 18z" fill="#C9D3D8" stroke="#2C4A40" stroke-width="1.6"/><path d="M50 80l110 70M160 80l-110 70" stroke="#B8402E" stroke-width="4" opacity=".75"/></g>
<g data-tip="لا تقم بتزييت مفصل الفرجار، ولا تضعه في علبته قبل تخفيف اليايات."><rect x="190" y="70" width="130" height="90" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M255 84l-18 60M255 84l18 58" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><path d="M280 96q8 10 0 16q-8 -6 0 -16z" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.4"/><path d="M200 80l110 70M310 80l-110 70" stroke="#B8402E" stroke-width="4" opacity=".75"/></g>
<g data-tip="لا تثنِ ورق الرسم والشف: يبقى أثر الثني على الرسم ويصعب الرسم عليه."><rect x="40" y="176" width="130" height="90" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M66 196h50l-10 54h-50z" fill="#E9F0E8" stroke="#2C4A40" stroke-width="1.6"/><path d="M116 196l20 20l-30 34" fill="#D3E4F1" stroke="#2C4A40" stroke-width="1.6"/><path d="M50 186l110 70M160 186l-110 70" stroke="#B8402E" stroke-width="4" opacity=".75"/></g>
<g data-tip="ابدأ العمل بعد تنظيف لوحة الرسم وأدوات الرسم، ولا تزحم اللوحة بالأدوات التي لا تحتاج إليها."><rect x="190" y="176" width="130" height="90" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="208" y="194" width="94" height="56" rx="4" fill="#E6C99A" stroke="#2C4A40" stroke-width="2"/><rect x="226" y="202" width="58" height="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.2"/><circle cx="296" cy="252" r="12" fill="#12855A"/><path d="M290 252l4 5l8 -9" fill="none" stroke="#FBF6EE" stroke-width="2.6"/></g>
<text x="180" y="292" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">عادات تحفظ أدواتك ورسمك</text></svg>`,
   cap:'ثلاثة أفعال ينهى عنها الكتاب، وعادة صحيحة.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف النصيحة.</b>',
   side:[
    {predict:{q:'تريد رسم خط رأسي على اللوحة. أي طريقة تخالف نصائح الكتاب؟',opts:[
     ['المثلث منزلقاً على الحافة العليا للمسطرة حرف T',false,'هذه الطريقة الصحيحة (ص 10).'],
     ['الحافة السفلية للمسطرة حرف T',true,'من النصائح (ص 45): «لا ترسم الخطوط الرأسية مستعملاً الحافة السفلية للمسطرة حرف (T)».'],
     ['تثبيت الورقة بشريط لاصق قبل الرسم',false,'هذا صحيح، فالورق يثبت بشريط لاصق أو مشابك (ص 10).']]}}
   ],
   body:[
    {book:`<p>هناك بعض النصائح الهامة يجب مراعاتها ومن أهمها ما يلي:</p><ul class="dw-tips"><li>لا تبدأ العمل قبل تنظيف لوحة الرسم الخشبية وأدوات الرسم.</li><li>لا تستعمل لوحة الرسم وهي مزدحمة بالأدوات الهندسية التي لا تحتاج إليها.</li><li>لا تستعمل مسطرة القياس في رسم الخطوط.</li><li>لا ترسم الخطوط الرأسية مستعملاً الحافة السفلية للمسطرة حرف (<span class="ltr">T</span>).</li><li>لا تستعمل حافة المسطرة حرف (<span class="ltr">T</span>) كسكين لقطع الورق.</li><li>لا تستعمل قلم الرصاص الرديء في الرسم.</li><li>لا تقم بتزييت مفصل الفرجار.</li><li>لا تضع الفرجار في علبته قبل تخفيف اليايات.</li><li>لا تضع الأدوات في علبتها بعد استعمالها إلا وهي نظيفة.</li><li>لا تثنِ ورق الرسم والشف.</li></ul>`,ref:'ص 45'},
    {tip:`<p>كل نصيحة لها سبب تعرفه من دروس الوحدة: حافة المسطرة دليل الخطوط المتوازية فإذا جرحتها السكين اعوجت الخطوط، ومسطرة القياس للقياس فتلفها يفسد دقتها، والزيت في مفصل الفرجار يجمع الغبار ويجعله ينزلق فيتغير نصف القطر أثناء الرسم. (تعليل منا.)</p>`,title:'لكل نصيحة سبب'},
    {title:'تحقق سريع: النصائح العامة',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل فعل بحسب نصائح الكتاب.',items:[
     ['أرسم الخطوط بمسطرة القياس لأنها مستقيمة.',false,'«لا تستعمل مسطرة القياس في رسم الخطوط».'],
     ['أنظف لوحة الرسم والأدوات قبل أن أبدأ.',true,'«لا تبدأ العمل قبل تنظيف لوحة الرسم الخشبية وأدوات الرسم».'],
     ['أزيت مفصل الفرجار ليتحرك بسهولة.',false,'«لا تقم بتزييت مفصل الفرجار».'],
     ['أخفف يايات الفرجار قبل وضعه في علبته.',true,'«لا تضع الفرجار في علبته قبل تخفيف اليايات».'],
     ['أثني ورق الشف ليسهل حمله.',false,'«لا تثن ورق الرسم والشف».']]})}
   ]},

  {recap:[
   'نتصور قطع الأجسام المفرغة لتظهر تفاصيلها الداخلية بوضوح بدل كثرة الحواف المختفية: قطاع كامل أو نصف قطاع أو قطاع جزئي (DIN 6).',
   'المسار المعقد للقطع يمثل بشرط ونقط عريضة عند طرفيه ونقط تحوله، وتحدد أسهم اتجاه النظر وتميز بحروف.',
   'سطح القطاع يرقن بخطوط كاملة رفيعة مائلة 45°، وتقطع حول الأرقام، وتختلف في اتجاهها أو كثافتها بين الأجزاء المتجاورة؛ ولا ترسم الحواف المختفية في القطاع.',
   'العصب والأجسام المصمتة (الأعمدة، المسامير، البرشام، الصواميل…) لا تقطع إذا مر بها مسار القطع طولياً.',
   'حافظ على أدواتك: نظفها، ولا تستعمل مسطرة القياس أو حافة المسطرة T في غير عملها، ولا تزيت الفرجار، ولا تثنِ الورق.']}
],
 theory:[
  {h:'١-١٣ مقاطع الأجسام (١)',ref:'ص 39',html:`<p>«تنتج عن التمثيل المعتاد للمشغولات بثلاثة مساقط رسومات تحتوي على العديد من الحواف المختفية، وذلك خاصة في حالة الأجسام المفرغة. إلا أن الرسم في مجموعه يصبح غير واضح وكثيراً ما تصعب قراءته. وللتغلب على هذه الصعوبة نتصور قطع المشغولات ومن ثم يمكن تمثيل التفاصيل بدقة كافية وبوضوح. وقد حددت المواصفات (<span class="ltr">DIN 6</span>) قواعد تمثيل الأجسام المقطوعة. ويمكن التفرقة بين <b>القطاع الكامل</b> و<b>نصف القطاع</b> و<b>القطاع الجزئي</b> تبعاً لأسلوب القطع».</p>`},
  {fig:'',ref:'ص 39',caption:'جلبة بفلانشة: تمثيل عادي بحواف مختفية، وقطاع كامل، ونصف قطاع، وقطاع جزئي (الأبعاد للتوضيح)',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;align-items:end">${[['none','تمثيل عادي'],['full','قطاع كامل'],['half','نصف قطاع'],['part','قطاع جزئي']].map(([m,t])=>`<div>${wrap(revSVG(BUSH,{mode:m,px:220}),220)}<p class="sub" style="text-align:center;margin:2px 0 0">${t}</p></div>`).join('')}</div>`},
  {html:`<p>«لا يحدد مسار القطع بشكل خاص في الرسم عند تمثيل الأجزاء البسيطة. أما إذا لزم التركيز على مسار معقد للقطع، فإنه يمثل بشرط ونقط عريضة وذلك عند نهاية وبداية خط المنتصف وعند نقط تغيير اتجاه مسار القطع. ويحدد اتجاه النظر إلى المساحة المقطوعة بواسطة أسهم. وتميز الأسهم ونقط التحول بحروف هجائية. وإذا كوَّن مستويا القطع فيما بينهما زاوية فيتصور دورانهما إلى مستوى واحد».</p>`},
  {fig:'',ref:'ص 40',caption:'قطع بمسار متدرج في لوح: المسار من A إلى F يمر بالثقب الصغير ثم الكبير ثم المربع، وأسهم اتجاه النظر عند طرفيه؛ والقطاع على يمينه مهشر تتخلله فراغات الثقوب (رسم مبسط)',draw:()=>{const s=2.4,W=200*s,H=120*s;let h=svgOpen(W,H,'قطع بمسار متدرج')+HATCH;const T=(x,y)=>[x*s,y*s];
    h+=plyl([T(10,10),T(110,10),T(110,110),T(10,110)],'vl',true)+plyl([T(14,14),T(106,14),T(106,106),T(14,106)],'tn',true);
    const holes=[[30,30,6,'c'],[90,30,6,'c'],[60,60,16,'c'],[30,88,7,'s'],[90,88,7,'s']];holes.forEach(([x,y,r,k])=>{const p=T(x,y);h+=k==='c'?`<circle cx="${p[0]}" cy="${p[1]}" r="${r*s}" class="vl"/>`:plyl([T(x-r,y-r),T(x+r,y-r),T(x+r,y+r),T(x-r,y+r)],'vl',true)});
    const path=[[30,2],[30,45],[60,45],[60,75],[90,75],[90,118]];h+=plyl(path.map(p=>T(...p)),'cl',false,' style="stroke:var(--blue-ink);stroke-width:1.3" stroke-dasharray="12 3 2 3"');
    ['A','B','C','D','E','F'].forEach((L,i)=>{const p=T(...path[i]);h+=tx(p[0]+(i%2?-8:8),p[1]+(i===0?8:i===5?-2:4),L,'dt','middle',0,' style="font-weight:700;fill:var(--blue-ink)"')});
    [[30,2],[90,118]].forEach(([x,y])=>{const a=T(x-14,y),b=T(x,y);h+=ln(a,b,'',' style="stroke:var(--blue-ink);stroke-width:1.4"')});[[30,2],[90,118]].forEach(([x,y])=>h+=arrowHead(T(x-14,y),[-1,0],8).replace('class="ar"','style="fill:var(--blue-ink)"').replace(/M[^L]+/,m=>m));
    const x0=135,x1=175;h+=`<rect x="${x0*s}" y="${10*s}" width="${(x1-x0)*s}" height="${100*s}" class="hatch"/>`;[[30,6],[60,16],[88,7]].forEach(([y,r])=>h+=`<rect x="${x0*s}" y="${(y-r)*s}" width="${(x1-x0)*s}" height="${2*r*s}" style="fill:var(--surface)"/>`+ln(T(x0,y-r),T(x1,y-r),'tn')+ln(T(x0,y+r),T(x1,y+r),'tn'));
    h+=plyl([T(x0,10),T(x1,10),T(x1,110),T(x0,110)],'vl',true)+`<rect x="${x1*s}" y="${10*s}" width="${6*s}" height="${100*s}" class="vl" style="fill:none"/>`+tx(155*s,118*s,'A – F','dt','middle');
    return wrap(h+'</svg>',480)}},
  {h:'نصف قطاع لشفة (فلانشة)',ref:'ص 41',html:'<p>لوحة على ورقة مربعات: الفلانشة بنصف قطاع؛ النصف الأيسر منظر خارجي، والنصف الأيمن مقطوع ومهشر، ويظهر فيه ثقب البرغي <span class="ltr">ϕ14</span> مقطوعاً. في المسقط الأفقي أربعة ثقوب على دائرة مراكز قطرها 90.</p>'},
  {fig:'',ref:'ص 41',caption:'نصف قطاع لشفة (فلانشة) والمسقط الأفقي — مستوى القطع يمر بالمحور وبثقبين متقابلين (عند 45°)',draw:()=>wrap(revSVG(FLANGE,{mode:'half',th:45,px:420,dims:[[[-30,60],[30,60],10,{t:'ϕ60'}],[[-15,60],[15,60],4,{t:'ϕ30'}],[[-25,35],[25,35],0,{ext:false,t:'ϕ50'}],[[-60,0],[-60,60],8,{t:'60',fb:[-30,60]}],[[60,60],[60,50],8,{t:'10',out:1,fa:[30,60],fb:[30,50]}],[[60,15],[60,0],8,{t:'15'}],[[60,0],[60,-3],8,{t:'3',out:1,fb:[35,-3],tdx:6}],[[-35,-3],[35,-3],-6,{t:'ϕ70'}],[[-60,-3],[60,-3],-13,{t:'ϕ120'}],[[38,15],[52,15],7,{t:'ϕ14',out:1,ext:false}]]}),460)},
  {err:'رسم الكتاب ثقوب البراغي في المسقط الأفقي عند <span class="ltr">45°</span> و<span class="ltr">135°</span>…، ورسم ثقباً مقطوعاً في نصف القطاع. لا يذكر الكتاب موضع مستوى القطع، فرسمناه هنا مارّاً بالمحور وبثقبين متقابلين (اتجاه <span class="ltr">45°</span>) ليتفق الشكلان. في تبويب «المختبر» دوّر مستوى القطع ولاحظ متى يظهر الثقب مقطوعاً.'},
  {h:'١-١٤ مقاطع الأجسام (٢)',ref:'ص 42',html:`<p>«يقطع الجسم عادة إما في اتجاه موازٍ للمحور الطولي أو عمودياً عليه. ويميز سطح القطاع باستخدام خطوط رقن (تهشير) كاملة رفيعة مائلة بزاوية قدرها <span class="ltr">45°</span>. وإذا تطلب الأمر وضع قيمة البعد أو أي كتابة أخرى على السطح المرقن فتقطع خطوط الرقن. وإذا قطعت مشغولة مركبة من عدة أجزاء يرقن كل جزء بخطوط تختلف في اتجاهها أو كثافتها عن خطوط ترقين الجزء المجاور».</p>`},
  {fig:'',ref:'ص 42',caption:'(يمين) خطوط الرقن تقطع حول الرقم — (يسار) مجموعة من ثلاثة أجزاء: تهشير باتجاهين متعاكسين وجزء ثالث بتهشير أكثف',draw:()=>{const a=svgOpen(200,110,'قطع خطوط الرقن')+HATCH+`<rect x="20" y="20" width="160" height="70" class="hatch"/><rect x="20" y="20" width="160" height="70" class="vl" style="fill:none"/><rect x="80" y="44" width="40" height="22" style="fill:var(--surface)"/>`+ln([60,55],[140,55],'dm')+arrowHead([60,55],[-1,0])+arrowHead([140,55],[1,0])+tx(100,60,'10','dt','middle')+'</svg>';
    const b=svgOpen(200,130,'مجموعة مركبة')+HATCH+`<rect x="20" y="15" width="160" height="50" style="fill:url(#dwh)"/><rect x="20" y="65" width="160" height="50" style="fill:url(#dwh2)"/><rect x="70" y="15" width="60" height="100" style="fill:url(#dwh3)"/><rect x="88" y="15" width="24" height="100" style="fill:var(--surface)"/>`+plyl([[20,15],[180,15],[180,115],[20,115]],'vl',true)+ln([20,65],[70,65],'vl')+ln([130,65],[180,65],'vl')+plyl([[70,15],[130,15],[130,115],[70,115]],'vl',true)+ln([88,15],[88,115],'vl')+ln([112,15],[112,115],'vl')+ctrLn([100,8],[100,122])+'</svg>';
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">${wrap(a,260)}${wrap(b,260)}</div>`}},
  {html:`<p>«عند تمثيل الأجسام المقطوعة، لا ترسم الحواف غير المرئية بخطوطها المنقطة وذلك لضمان وضوح القطاع. إلا أن هذه الحواف ترسم فقط إذا ما تطلب وضوح الرسم ضرورة وجودها».</p>`},
  {fig:'',ref:'ص 42',caption:'قطاع جلبة بفلانشة: رسم الحواف المختفية (بالأحمر) داخل القطاع خطأ، والصواب بلا خطوط متقطعة',draw:()=>pairFig([[revSVG(FLANGE,{mode:'full',th:0,hid:true,plan:false,px:300}),'',0],[revSVG(FLANGE,{mode:'full',th:0,plan:false,px:300}),'',1]])},
  {html:`<p>«إذا مر مسار القطع طولياً بوترة (عصب) فتمثل الوترة كما هي دون قطع. وكذلك الحال في الأجسام البسيطة المصمتة مثل التيل، البرشام، الأعمدة، المحاور، المسامير الملولبة، الصواميل، النوابض، الخوابير وحلقات إحكام الربط والأسافين».</p>`},
  {fig:'',ref:'ص 43',caption:'عمود داخل جلبة مقطوعة: الجلبة مهشرة، أما العمود المصمت فلا يهشر رغم مرور مستوى القطع بمحوره',draw:()=>{let h=svgOpen(320,120,'عمود داخل جلبة')+HATCH;h+=`<rect x="80" y="20" width="160" height="22" class="hatch"/><rect x="80" y="78" width="160" height="22" class="hatch"/>`+plyl([[80,20],[240,20],[240,42],[80,42]],'vl',true)+plyl([[80,78],[240,78],[240,100],[80,100]],'vl',true);
    h+=ln([30,42],[290,42],'vl')+ln([30,78],[290,78],'vl')+`<path d="M30 42q6 9 0 18q-6 9 0 18" class="tn"/>`+ln([290,42],[290,78],'vl')+ctrLn([22,60],[298,60])+tAr(160,64,'عمود (غير مهشر)',null,'lb','middle')+tAr(160,114,'جلبة مقطوعة (مهشرة)',null,'lb','middle');return wrap(h+'</svg>',420)}},
  {h:'رافعة توجيه',ref:'ص 44',html:'<p>لوحة على ورقة مربعات: رافعة توجيه طرفها العلوي شوكة بمجرى عرضه 25 والسفلي عين دائرية بثقب <span class="ltr">ϕ40</span>. مسار القطع <span class="ltr">A–B</span> على خط المنتصف، والقطاع <span class="ltr">A–B</span> مرسوم على يمين المسقط الرأسي: العين مهشرة فوق الثقب وتحته، والشوكة غير مهشرة لأن القطع يمر في فراغ المجرى.</p>'},
  {fig:'',ref:'ص 44',caption:'رافعة توجيه: المسقط الرأسي بمسار القطع A–B، والقطاع A–B (رسم مبسط بالأبعاد الرئيسية: الارتفاع الكلي ≈ 164، والعرض 50، والعين ϕ60 بثقب ϕ40، والشوكة ثخانتها 20 ومجراها 25)',draw:()=>{const s=1.6,pad=18,W=(60+40+50+pad*2)*s,H=(166+pad*2)*s;const T=(x,y)=>[(x+pad+30)*s,(135-y+pad)*s];let h=svgOpen(W,H,'رافعة توجيه')+HATCH;
    /* front view: eye centre (0,0), arms ±25 up to the fork arc R135 */
    const yA=Math.sqrt(135*135-25*25);h+=`<path d="M${P2(T(-25,0))}L${P2(T(-25,yA))}A${135*s} ${135*s} 0 0 1 ${P2(T(25,yA))}L${P2(T(25,0))}" class="vl" style="fill:none"/>`;
    h+=`<path d="M${P2(T(-25,0))}A${30*s} ${30*s} 0 1 0 ${P2(T(25,0))}" class="vl" style="fill:none"/>`;const c=T(0,0);h+=`<circle cx="${c[0]}" cy="${c[1]}" r="${20*s}" class="vl"/>`;
    const ys=135-62;h+=`<path d="M${P2(T(-12.5,Math.sqrt(135*135-12.5*12.5)))}L${P2(T(-12.5,ys))}A${12.5*s} ${12.5*s} 0 0 0 ${P2(T(12.5,ys))}L${P2(T(12.5,Math.sqrt(135*135-12.5*12.5)))}" class="vl" style="fill:none"/>`+ln(T(-25,45),T(25,45),'tn')+ln(T(-25,50),T(25,50),'tn');
    h+=ctrLn(T(0,142),T(0,-36))+ctrLn(T(-34,0),T(34,0));h+=tx(...T(7,145),'A','dt','start',0,' style="font-weight:700;fill:var(--blue-ink)"')+tx(...T(7,-40),'B','dt','start',0,' style="font-weight:700;fill:var(--blue-ink)"');
    /* section A–B to the right: x is thickness (eye 0..30) */
    const X=x=>x+65;const poly=(pts,cls,st)=>plyl(pts.map(([x,y])=>T(X(x),y)),cls,true,st||'');
    h+=poly([[0,20],[30,20],[30,30],[0,30]],'hatch')+poly([[0,-30],[30,-30],[30,-20],[0,-20]],'hatch')+poly([[5,30],[25,30],[25,40],[35,50],[35,ys-12.5],[15,ys-12.5],[15,50],[5,40]],'hatch');
    h+=poly([[0,-30],[30,-30],[30,30],[0,30]],'vl',' style="fill:none"')+poly([[5,30],[25,30],[25,40],[35,50],[35,135],[15,135],[15,50],[5,40]],'vl',' style="fill:none"')+ln(T(X(15),ys-12.5),T(X(35),ys-12.5),'vl')+ln(T(X(0),20),T(X(30),20),'vl')+ln(T(X(0),-20),T(X(30),-20),'vl')+ctrLn(T(X(-4),0),T(X(34),0));
    h+=dim((q)=>T(X(q[0]),q[1]),[35,135],[35,-30],-8,{t:'164'})+dim((q)=>T(X(q[0]),q[1]),[15,135],[35,135],6,{t:'20'})+tx(...T(X(15),-40),'A – B','dt','middle');
    return wrap(h+'</svg>',360)}},
  {h:'نصائح عامة',ref:'ص 45',html:`<p>«هناك بعض النصائح الهامة يجب مراعاتها ومن أهمها ما يلي:»</p><ul class="dw-tips"><li>لا تبدأ العمل قبل تنظيف لوحة الرسم الخشبية وأدوات الرسم.</li><li>لا تستعمل لوحة الرسم وهي مزدحمة بالأدوات الهندسية التي لا تحتاج إليها.</li><li>لا تستعمل مسطرة القياس في رسم الخطوط.</li><li>لا ترسم الخطوط الرأسية مستعملاً الحافة السفلية للمسطرة حرف (<span class="ltr">T</span>).</li><li>لا تستعمل حافة المسطرة حرف (<span class="ltr">T</span>) كسكين لقطع الورق.</li><li>لا تستعمل قلم الرصاص الرديء في الرسم.</li><li>لا تقم بتزييت مفصل الفرجار.</li><li>لا تضع الفرجار في علبته قبل تخفيف اليايات.</li><li>لا تضع الأدوات في علبتها بعد استعمالها إلا وهي نظيفة.</li><li>لا تثنِ ورق الرسم والشف.</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لا توجد في الوحدة الأولى أسئلة أو تمارين في الكتاب؛ لوحات المشغولات (ص 27، 30، 33، 36، 41، 44) تصلح للتدريب على «ارسم المسقط الناقص»، وحلولها خطوة بخطوة في تبويب «الأمثلة المحلولة» للدروس 5 و6 و8.'}
 ],
 lab:(el)=>{
  let mode='half',th=45,s=0,hid=false;const did={};
  el.innerHTML=`<div class="grid dw-lab">
   <div class="panel c7"><h2>قاطع المقاطع <small>مبني على الفلانشة ص 41 وأنواع القطاع ص 39</small></h2>
    <div class="dw-row">${segHTML('sm',[['none','بلا قطع'],['full','قطاع كامل'],['half','نصف قطاع'],['part','قطاع جزئي']],mode)}</div>
    <div class="dw-sheet" id="l8s" style="max-width:460px;margin-inline:auto"></div></div>
   <div class="panel c5"><h2>مستوى القطع</h2>
    <div class="dw-row">${slHTML('l8t','اتجاه مستوى القطع في المسقط الأفقي',0,90,1,th)}</div>
    <div class="dw-row">${slHTML('l8o','بعد مستوى القطع عن المحور',0,55,1,s)}</div>
    <div class="dw-row"><span class="sub">الحواف المختفية داخل القطاع:</span>${segHTML('sh',[['0','لا ترسم (صواب)'],['1','ترسم (خطأ)']],'0')}</div>
    <div class="facts"><div class="fact"><span>ثقوب البراغي المقطوعة</span><b id="l8h"></b></div><div class="fact"><span>عرض القاعدة في القطاع</span><b id="l8w"></b></div></div>
    <div class="dw-msg" id="l8m"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l8st"></ol></div></div>`;
  const $=x=>el.querySelector(x);
  const draw=()=>{$('#l8s').innerHTML=revSVG(FLANGE,{mode,th,s,hid,px:440});$('#l8t-v').textContent=fm(th,0)+'°';$('#l8o-v').textContent=fm(s,0)+' mm';
    const t=th*Math.PI/180,nv=[-Math.sin(t),Math.cos(t)];const cut=FLANGE.holes.ang.filter(a=>{const c=[45*Math.cos(a*Math.PI/180),45*Math.sin(a*Math.PI/180)];return Math.abs(c[0]*nv[0]+c[1]*nv[1]-s)<7}).length;
    $('#l8h').textContent=mode==='none'?'—':String(mode==='full'?cut:Math.ceil(cut/2));$('#l8w').textContent=mode==='none'?'—':fm(2*Math.sqrt(Math.max(0,3600-s*s)),1)+' mm';
    const m=$('#l8m');m.className='dw-msg'+(hid&&mode!=='none'?' bad':'');
    m.innerHTML=hid&&mode!=='none'?'«لا ترسم الحواف غير المرئية بخطوطها المنقطة وذلك لضمان وضوح القطاع» (ص 42). الخطوط الحمراء تزحم القطاع بلا فائدة.':
      mode==='none'?'بلا قطع: التفاصيل الداخلية (الثقب الأوسط وثقوب البراغي) حواف مختفية متقطعة، والرسم صعب القراءة في الأجسام المفرغة (ص 39).':
      mode==='half'?'نصف قطاع: النصف الأيسر منظر خارجي بلا حواف مختفية، والأيمن مقطوع ومهشر؛ يفصل بينهما خط المنتصف (ص 39، 41).':
      mode==='part'?'قطاع جزئي: جزء فقط مقطوع، محدود بخط كسر حر متعرج (ص 39).':'قطاع كامل: الجسم مقطوع كله بمستوى القطع، والسطح المقطوع مهشر بخطوط رفيعة مائلة 45° (ص 39، 42).';
    if(mode!=='none'&&s>0)m.innerHTML+=' مستوى القطع لا يمر بالمحور الآن، فيضيق السطح المقطوع؛ قطاعات الكتاب كلها تمر بالمحور.'};
  segBind(el,'sm',v=>{mode=v;did[v]=1;draw()});segBind(el,'sh',v=>{hid=v==='1';if(hid)did.hid=1;draw()});
  $('#l8t').oninput=e=>{th=+e.target.value;did.rot=1;draw()};$('#l8o').oninput=e=>{s=+e.target.value;draw()};
  const st=stepsUI($('#l8st'),[
   {t:'بلا قطع',x:'اختر «بلا قطع»: لاحظ كثرة الخطوط المتقطعة للثقب الأوسط وثقوب البراغي.',done:()=>did.none},
   {t:'قطاع كامل',x:'اختر «قطاع كامل» واجعل الاتجاه <span class="ltr">0°</span>: القطع يمر بين الثقوب فلا يظهر أي ثقب مقطوع.',done:()=>mode==='full'&&th<=2},
   {t:'اقطع عبر الثقوب',x:'دوّر اتجاه مستوى القطع إلى <span class="ltr">45°</span>: يمر المستوى بثقبين متقابلين فيظهران فراغين داخل التهشير.',done:()=>mode==='full'&&Math.abs(th-45)<=1&&s===0},
   {t:'نصف قطاع',x:'اختر «نصف قطاع» عند <span class="ltr">45°</span>: هكذا رسم الكتاب الفلانشة في ص 41.',done:()=>mode==='half'&&Math.abs(th-45)<=1},
   {t:'قاعدة الحواف المختفية',x:'اختر «ترسم (خطأ)» لترى لماذا لا ترسم الحواف المختفية داخل القطاع، ثم أعدها «لا ترسم».',done:()=>did.hid&&!hid},
   {t:'أبعد مستوى القطع',x:'حرّك «بعد مستوى القطع عن المحور» إلى <span class="ltr">30 mm</span> أو أكثر مع قطاع كامل ولاحظ ضيق السطح المقطوع.',done:()=>mode==='full'&&s>=30}]);
  draw();loopOn(el,()=>st.check())},
 examples:[
  drawnEx('نصف قطاع للفلانشة','ص 41','<p>ارسم الفلانشة بنصف قطاع: طوق <span class="ltr">ϕ60</span> ثخانته 10، ورقبة <span class="ltr">ϕ50</span>، وقاعدة <span class="ltr">ϕ120</span> ثخانتها 15، وبروز <span class="ltr">ϕ70</span> ارتفاعه 3، وثقب نافذ <span class="ltr">ϕ30</span>، وأربعة ثقوب <span class="ltr">ϕ14</span> على دائرة مراكز <span class="ltr">ϕ90</span>.</p>',[
   ['ارسم المسقط الأفقي (الدوائر وثقوب البراغي)، ثم المحيط الخارجي للمسقط الرأسي: الطوق والرقبة والقاعدة والبروز.',revSVG(FLANGE,{mode:'half',th:45,px:400,step:1})],
   ['ارسم خط المنتصف الرأسي: يفصل النصف الأيسر (منظر خارجي) عن الأيمن (القطاع). وحدد مسار القطع في المسقط الأفقي بحرفي <span class="ltr">A</span> وأسهم اتجاه النظر.',revSVG(FLANGE,{mode:'half',th:45,px:400,step:2})],
   ['في النصف الأيمن امحُ ما يقع أمام مستوى القطع، وارسم ما يظهر خلفه: حدود الثقب الأوسط وثقب البرغي المقطوع.',revSVG(FLANGE,{mode:'half',th:45,px:400,step:3})],
   ['هشّر السطوح المقطوعة بخطوط رفيعة مائلة 45°، واترك الثقبين بلا تهشير. لا ترسم أي حافة مختفية في القطاع، ولا في النصف الخارجي.',revSVG(FLANGE,{mode:'half',th:45,px:400})]]),
  drawnEx('من التمثيل العادي إلى القطاع الكامل','ص 39، 42','<p>جلبة بفلانشة وثقب مدرج نافذ. حوّل رسمها العادي (بحواف مختفية) إلى قطاع كامل.</p>',[
   ['التمثيل العادي: الثقب المدرج حواف مختفية متقطعة.',revSVG(BUSH,{mode:'none',px:300})],
   ['نتصور قطع الجسم بمستوى يمر بالمحور ونزيل النصف الأمامي: تظهر حدود الثقب المدرج بخطوط كاملة.',revSVG(BUSH,{mode:'full',px:300,step:3})],
   ['نهشّر السطح المقطوع بخطوط رفيعة مائلة 45° على جانبي الثقب، ولا نرسم أي خط متقطع.',revSVG(BUSH,{mode:'full',px:300})]])
 ],
 quiz:[
  {q:'لماذا نلجأ إلى رسم المقاطع؟',o:['لتقليل عدد المساقط فقط','لأن كثرة الحواف المختفية في الأجسام المفرغة تجعل الرسم غير واضح','لأن الكتاب يشترط ذلك دائماً','لإخفاء الأبعاد'],c:1,e:'ص 39.'},
  {q:'أنواع القطاع حسب أسلوب القطع:',o:['أفقي ورأسي وجانبي','كامل ونصف وجزئي','مائل ومستقيم','داخلي وخارجي'],c:1,e:'ص 39.'},
  {q:'بأي زاوية تميل خطوط الرقن (التهشير)؟',o:['30°','45°','60°','90°'],c:1,e:'ص 42: «خطوط رقن (تهشير) كاملة رفيعة مائلة بزاوية قدرها 45°».'},
  {q:'هل ترسم الحواف المختفية داخل القطاع؟',o:['نعم دائماً','لا، إلا إذا تطلب وضوح الرسم وجودها','نعم بخط كامل','نعم بالأحمر'],c:1,e:'ص 42.'},
  {q:'إذا مر مستوى القطع طولياً بعمود مصمت أو مسمار:',o:['يهشر بخطوط أكثف','يرسم كما هو دون تهشير','يحذف من الرسم','يرسم بخطوط متقطعة'],c:1,e:'ص 42–43.'},
  {q:'أي مما يأتي من النصائح العامة (ص 45)؟',o:['ارسم الخطوط الرأسية بالحافة السفلية للمسطرة T','لا تستعمل مسطرة القياس في رسم الخطوط','زيّت مفصل الفرجار','اثنِ ورق الرسم ليسهل حمله'],c:1,e:'ص 45.'}
 ]
});
})(PLCBOOK);
