/* Unit 5 — مخططات دوائر توصيل الآلات الكهربائية (ص 100–126) */
(function(B){
"use strict";
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
/* =====================================================================
   1) أدوات الرسم: مشهد (Scene) يجمع عناصر SVG، وكل عنصر له «خطوة» (لرسم الأمثلة خطوة بخطوة)
      و«شبكة» net اختيارية (لتلوين التيار في المختبر).
   ===================================================================== */
const FN=x=>`<span class="ltr">(${x})</span>`;          // رقم الشكل
const LT=t=>`<span class="ltr">${t}</span>`;
const r1=n=>Math.round(n*10)/10;
const PD=pts=>pts.map((p,i)=>(i?'L':'M')+r1(p[0])+' '+r1(p[1])).join('');
const DA={pe:'10 3 2 3',n:'7 4',m:'4 3'};
const SK='stroke:var(--fg);stroke-width:1.5;fill:none';
function Sc(w,h,label){const E=[];let s=0;
  const S={w,h,label,
    at(n){s=n;return S},
    add(fn,net){E.push({s,net,fn:typeof fn==='function'?fn:()=>fn});return S},
    last(){return E.reduce((m,e)=>Math.max(m,e.s),0)},
    svg(o){o=o||{};const up=o.upto==null?1e9:o.upto;let a='',b='';
      for(const e of E){if(e.s>up)continue;const c=(o.cls&&e.net!=null)?(o.cls(e.net)||''):'';const g=e.fn(c);if(o.hi&&e.s===up)b+=g;else a+=g}
      return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${a}${b?`<g style="--wire:var(--blue);--fg:var(--blue)">${b}</g>`:''}${o.extra||''}</svg>`}};
  return S}
/* ---- عناصر أولية (نصوص لاتينية فقط داخل SVG) ---- */
const T=(x,y,s,o)=>{o=o||{};return `<text class="txt${o.m?' m':''}${o.b?' b':''}" x="${r1(x)}" y="${r1(y)}" text-anchor="${o.a||'middle'}"${o.sz?` style="font-size:${o.sz}px"`:''}>${s}</text>`};
const ah=(x,y,dx,dy,z,col)=>{const L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,s=z||7;return `<path d="M${r1(x)} ${r1(y)}L${r1(x-ux*s-uy*s*.45)} ${r1(y-uy*s+ux*s*.45)}L${r1(x-ux*s+uy*s*.45)} ${r1(y-uy*s-ux*s*.45)}Z" style="fill:${col||'var(--fg)'}"/>`};
const wire=(S,pts,net,d)=>S.add(c=>`<path class="w ${c}" d="${PD(pts)}"${d?` style="stroke-dasharray:${DA[d]}"`:''}/>`,net);
const txt=(S,x,y,s,o)=>S.add(T(x,y,s,o));
const dot=(S,x,y)=>S.add(`<circle class="dot" cx="${x}" cy="${y}" r="2.8"/>`);
const term=(S,x,y)=>S.add(`<circle cx="${x}" cy="${y}" r="3.3" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.3"/>`);
const arrow=(S,x1,y1,x2,y2,col)=>S.add(`<path d="M${x1} ${y1}L${x2} ${y2}" style="stroke:${col||'var(--fg)'};stroke-width:1.6"/>`+ah(x2,y2,x2-x1,y2-y1,8,col));
/* سهم الدوران المنحني: dir 1 = مع عقارب الساعة (إلى اليمين)، -1 = عكسها (إلى اليسار)، 2 = الاتجاهان */
function rotArr(S,x,y,r,dir,col){if(!dir)return S;const p=a=>[x+r*Math.sin(a*Math.PI/180),y-r*Math.cos(a*Math.PI/180)],t=a=>[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)];
  const a0=40,a1=140,P0=p(a0),P1=p(a1),cl=col||'var(--fg)';
  let g=`<path d="M${r1(P0[0])} ${r1(P0[1])}A${r} ${r} 0 0 1 ${r1(P1[0])} ${r1(P1[1])}" style="stroke:${cl};stroke-width:1.6;fill:none"/>`;
  if(dir===1||dir===2){const d=t(a1);g+=ah(P1[0],P1[1],d[0],d[1],7,cl)}
  if(dir===-1||dir===2){const d=t(a0);g+=ah(P0[0],P0[1],-d[0],-d[1],7,cl)}
  return S.add(g)}
/* بطارية أفقية: plusLeft = القطب الموجب (اللوح الطويل) يساراً */
function bat(S,x,y,plusLeft,net){S.add(c=>{const hl=plusLeft?12:6,hr=plusLeft?6:12;
  return `<path class="w ${c}" d="M${x-16} ${y}H${x-3}M${x+3} ${y}H${x+16}"/><path d="M${x-3} ${y-hl}V${y+hl}" style="stroke:var(--fg);stroke-width:${plusLeft?1.6:3.6}"/><path d="M${x+3} ${y-hr}V${y+hr}" style="stroke:var(--fg);stroke-width:${plusLeft?3.6:1.6}"/>`+
   T(x-9,y-12,plusLeft?'+':'-',{sz:13})+T(x+9,y-12,plusLeft?'-':'+',{sz:13})},net);return S}
/* آلة تيار مستمر: دائرة + فرشتان + حرف مسطّر (M أو G). الطرفان عند y-24 و y+24 */
function dcm(S,x,y,L,o){o=o||{};S.add(c=>`<circle cx="${x}" cy="${y}" r="17" style="fill:var(--surface);stroke:${c?'var(--live)':'var(--fg)'};stroke-width:1.7"/>`+
  `<rect x="${x-6}" y="${y-24}" width="12" height="7" style="fill:var(--fg)"/><rect x="${x-6}" y="${y+17}" width="12" height="7" style="fill:var(--fg)"/>`+
  (o.rot?`<g data-rot="${x} ${y}"><path d="M${x} ${y-14}V${y-9}" style="stroke:var(--live);stroke-width:3;stroke-linecap:round"/></g>`:'')+
  T(x,y+5,L,{sz:15})+`<path d="M${x-5} ${y+8}H${x+5}" style="stroke:var(--fg);stroke-width:1.4"/>`,o.net);return S}
/* آلة تيار متردد: دائرة مع سطرين (M / 3~) */
function acm(S,x,y,r,l1,l2,o){o=o||{};S.add(c=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--surface);stroke:${c?'var(--live)':'var(--fg)'};stroke-width:1.7"/>`+(o.dbl?`<circle cx="${x}" cy="${y}" r="${r-5}" style="fill:none;stroke:var(--fg);stroke-width:1.3"/>`:'')+
  (o.rot?`<g data-rot="${x} ${y}"><path d="M${x} ${y-r+3}V${y-r+9}" style="stroke:var(--live);stroke-width:3;stroke-linecap:round"/></g>`:'')+
  T(x,y+(l2?0:5),l1,{sz:o.sz||15})+(l2?T(x,y+14,l2,{sz:11}):''),o.net);return S}
/* ملف (مستطيل مصمت) */
const coil=(S,x,y,w,h,net)=>S.add(c=>`<rect x="${r1(x-w/2)}" y="${r1(y-h/2)}" width="${w}" height="${h}" style="fill:${c==='flow'?'var(--live)':'var(--fg)'}"/>`,net);
/* مصهر على خط رأسي */
const fuse=(S,x,y,net,blown)=>S.add(c=>`<rect x="${x-5}" y="${y-11}" width="10" height="22" style="fill:${blown?'var(--stop-soft)':'var(--surface)'};stroke:${blown?'var(--stop)':'var(--fg)'};stroke-width:1.4"/>`+(blown?`<path d="M${x-4} ${y+8}L${x+4} ${y-8}" style="stroke:var(--stop);stroke-width:1.6"/>`:`<path class="w ${c}" d="M${x} ${y-11}V${y+11}"/>`),net);
/* مصهر على خط أفقي */
const fuseH=(S,x,y,net)=>S.add(c=>`<rect x="${x-10}" y="${y-4}" width="20" height="8" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.3"/><path class="w ${c}" d="M${x-10} ${y}H${x+10}"/>`,net);
/* تلامس مفتوح/مغلق على خط رأسي: الطرف الثابت أعلى (y0)، والمحور أسفل (y1) */
const cont=(S,x,y0,y1,closed,net)=>S.add(c=>`<path class="w ${closed?c:''}" d="M${x} ${y1}L${closed?x:x-10} ${closed?y0:y0+3}"/><path d="M${x} ${y0}h4" style="${SK}"/>`,net);
/* تلامس مغلق (NC) على خط رأسي */
const contNC=(S,x,y0,y1,closed,net)=>S.add(c=>`<path d="M${x} ${y0}h7" style="${SK}"/><path class="w ${closed?c:''}" d="M${x} ${y1}L${closed?x+8:x+1} ${closed?y0+1:y0+8}"/>`,net);
/* ربط ميكانيكي متقطع + مقبض يدوي (h: ⊢، b: ⊞ لمفتاح الوقاية) */
function qlink(S,x0,x1,y,kind,lbl){S.add(`<path d="M${x0} ${y}H${x1}" style="stroke:var(--fg);stroke-width:1.2;stroke-dasharray:${DA.m}"/>`+
  (kind==='b'?`<rect x="${x0-12}" y="${y-6}" width="12" height="12" style="${SK}"/><path d="M${x0-6} ${y-6}V${y+6}M${x0-12} ${y}H${x0}" style="${SK}"/>`:`<path d="M${x0} ${y-6}V${y+6}" style="${SK}"/>`)+
  (lbl?T(x0-(kind==='b'?16:5),y+4,lbl,{a:'end'}):''));return S}
/* أرضي */
const gnd=(S,x,y)=>S.add(`<path d="M${x} ${y}v7M${x-8} ${y+7}h16M${x-5} ${y+11}h10M${x-2} ${y+15}h4" style="${SK}"/>`);
/* إطار شرطة-نقطة (صندوق المحرك / لوحة الأطراف / مفتاح الوقاية) */
const frame=(S,x,y,w,h,d)=>S.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:${DA[d||'pe']}"/>`);
/* جهاز قياس: v = نسبة انحراف المؤشر 0..1 (null = بلا مؤشر) */
const meter=(S,x,y,lbl,v,r)=>{r=r||11;S.add(`<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`+(v==null?T(x,y+4,lbl,{sz:lbl.length>1?9.5:12}):(()=>{const a=(-60+120*Math.max(0,Math.min(1,v)))*Math.PI/180;return T(x,y+r-3,lbl,{sz:7.5,m:1})+`<path d="M${x} ${y+3}L${r1(x+(r-3)*Math.sin(a))} ${r1(y+3-(r-3)*Math.cos(a))}" style="stroke:var(--stop);stroke-width:1.6"/>`})()));return S};
/* صندوق مرحّل (I> ، n>) */
const rbox=(S,x,y,t,w)=>S.add(`<rect x="${x-(w||13)}" y="${y-8}" width="${2*(w||13)}" height="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.3"/>`+T(x,y+4,t,{sz:10}));
/* مكثف على خط رأسي (اللوحان أفقيان عند y±3) / على خط أفقي */
const capV=(S,x,y)=>S.add(`<path d="M${x-9} ${y-3}H${x+9}M${x-9} ${y+3}H${x+9}" style="stroke:var(--fg);stroke-width:2"/>`);
const capH=(S,x,y)=>S.add(`<path d="M${x-3} ${y-9}V${y+9}M${x+3} ${y-9}V${y+9}" style="stroke:var(--fg);stroke-width:2"/>`);
/* مقاومة متغيرة أفقية بذراع منزلق من أسفل (pos 0..1) */
const rheo=(S,x,y,w,pos)=>{const sx=x-w/2+w*(pos==null?.35:pos);S.add(`<rect x="${x-w/2}" y="${y-6}" width="${w}" height="12" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/><path d="M${r1(sx)} ${y+18}V${y+9}" style="stroke:var(--fg);stroke-width:1.5"/>`+ah(sx,y+7,0,-1,6));return S};
/* شرطة مائلة مع عدد الموصلات (المخطط الخطي) */
const slash=(S,x,y,n)=>S.add(`<path d="M${x-6} ${y+5}L${x+6} ${y-5}" style="${SK}"/>`+(n!=null?T(x+9,y-3,String(n),{a:'start',sz:10.5}):''));
/* رمز المرحل الحراري والمغناطيسي (لمفتاح الوقاية) */
const thermSym=(S,x,y)=>S.add(`<rect x="${x-9}" y="${y-8}" width="18" height="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/><path d="M${x-5} ${y+4}V${y-3}H${x+1}V${y+4}H${x+5}" style="${SK};stroke-width:1.3"/>`);
const magSym=(S,x,y)=>S.add(`<rect x="${x-9}" y="${y-8}" width="18" height="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/>`+T(x,y+4,'I&gt;',{sz:9}));

/* مفتاح وقاية محرك ثلاثي الأقطاب (الأشكال 5-10، 5-19، 5-22): xs = مواقع الأقطاب، y = أعلى التلامسات */
function protSw(S,xs,y,o){o=o||{};const on=o.on,x0=xs[0]-14,x1=xs[xs.length-1]+14;frame(S,x0,y-6,x1-x0,96,'n');
  xs.forEach((x,i)=>{const n=o.nets?o.nets[i]:null;txt(S,x-6,y-9,String(2*i+1),{sz:9.5,a:'end'});
    cont(S,x,y+4,y+26,on,n);wire(S,[[x,y-12],[x,y+4]],n);wire(S,[[x,y+26],[x,y+38]],n);thermSym(S,x,y+46);magSym(S,x,y+66);wire(S,[[x,y+74],[x,y+96]],n);
    txt(S,x-6,y+93,String(2*i+2),{sz:9.5,a:'end'})});
  qlink(S,x0-10,xs[xs.length-1]-4,y+16,'b',o.lbl||'Q1');
  S.add(`<path d="M${x0-4} ${y+16}V${y+66}H${xs[0]-9}M${x0-4} ${y+46}H${xs[0]-9}" style="stroke:var(--fg);stroke-width:1;stroke-dasharray:2 2;fill:none"/>`);
  return S}
/* بداية مخطط DC (L+ / L- / 220v Dc / F1,2 / Q1): الفرعان عند xl و xr، والنهاية عند y0+150 */
function dcSupply(S,xl,xr,y0,o){o=o||{};const n=o.nets||{},xa=xl-50,xb=xr+90;
  wire(S,[[xa,y0],[xb,y0]],n.Lp);wire(S,[[xa,y0+12],[xb,y0+12]],n.Lm);txt(S,xa-4,y0+4,'L+',{a:'end'});txt(S,xa-4,y0+16,'L-',{a:'end'});txt(S,(xl+xr)/2,y0-7,o.title||'220v Dc');
  dot(S,xl,y0);dot(S,xr,y0+12);
  wire(S,[[xl,y0],[xl,y0+44]],n.Lp);wire(S,[[xr,y0+12],[xr,y0+44]],n.Lm);
  fuse(S,xl,y0+55,n.fl,o.blownL);fuse(S,xr,y0+55,n.fr,o.blownR);txt(S,xl-9,y0+59,'F1,2',{a:'end',sz:10.5});
  [[xl,1],[xr,1]].forEach(([x])=>{txt(S,x+8,y0+46,'1',{a:'start',sz:9});txt(S,x+8,y0+70,'2',{a:'start',sz:9})});
  wire(S,[[xl,y0+66],[xl,y0+100]],n.fl);wire(S,[[xr,y0+66],[xr,y0+100]],n.fr);txt(S,xl+7,y0+88,'1',{a:'start',sz:10});txt(S,xr+7,y0+88,'3',{a:'start',sz:10});
  cont(S,xl,y0+100,y0+124,o.on,n.ql);cont(S,xr,y0+100,y0+124,o.on,n.qr);qlink(S,xl-50,xr-6,y0+112,'h','Q1');
  wire(S,[[xl,y0+124],[xl,y0+150]],n.ql);wire(S,[[xr,y0+124],[xr,y0+150]],n.qr);txt(S,xl+7,y0+140,'2',{a:'start',sz:10});txt(S,xr+7,y0+140,'4',{a:'start',sz:10});
  return y0+150}
/* لوحة أطراف: أطراف (دوائر مفرغة) مع أسمائها، ومناطق ضغط شفافة في المختبر (data-t) */
function terms(S,T0,o){o=o||{};T0.forEach(([nm,x,y,pos])=>{term(S,x,y);txt(S,x+(pos==='l'?-7:pos==='r'?7:0),y+(pos==='b'?15:-7),nm,{a:pos==='l'?'end':pos==='r'?'start':'middle',sz:10.5});
  if(o.click)S.add(`<circle data-t="${nm}" cx="${x}" cy="${y}" r="13" style="fill:${o.sel===nm?'var(--blue-soft)':'transparent'};stroke:${o.sel===nm?'var(--blue)':'none'};cursor:pointer"/>`)});return S}
/* قنطرة بين طرفين: قوس صغير فوق الصف (أو خط مستقيم) */
function jump(S,a,b,o){o=o||{};const [x1,y1]=a,[x2,y2]=b,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);
  const bend=o.straight?0:Math.min(26,6+L*0.12),mx=(x1+x2)/2+(dy?bend*0.6*Math.sign(dy)*(o.side||1):0),my=(y1+y2)/2-(dy?0:bend);
  S.add(c=>`<path class="w ${c}" d="M${x1} ${y1}Q${r1(mx)} ${r1(my)} ${x2} ${y2}" style="stroke-width:${c?3.4:3};${c?'':'stroke:var(--blue)'}"/>`+(o.id?`<path data-j="${o.id}" d="M${x1} ${y1}Q${r1(mx)} ${r1(my)} ${x2} ${y2}" style="stroke:transparent;stroke-width:14;fill:none;cursor:pointer"/>`:''),o.net);return S}

/* =====================================================================
   2) حلّال عُقد صغير (للمختبرات المنطقية): عناصر {id,a,b,R} بين عُقد، المصدر بين P و N.
      يرجع تيار كل عنصر (من a إلى b) وتيار المصدر. لا تظهر أي أرقام للمتدرب — تُستخدم الإشارة فقط.
   ===================================================================== */
function solve(els,P,N){const nodes=new Set();els.forEach(e=>{nodes.add(e.a);nodes.add(e.b)});nodes.add(P);nodes.add(N);
  const id={};let n=0;nodes.forEach(k=>{if(k!==P&&k!==N)id[k]=n++});
  const A=Array.from({length:n},()=>new Float64Array(n+1));for(let i=0;i<n;i++)A[i][i]=1e-9;
  const V0={[P]:1,[N]:0};
  els.forEach(e=>{if(e.a===e.b)return;const g=1/e.R,ia=id[e.a],ib=id[e.b];
    if(ia!=null){A[ia][ia]+=g;if(ib!=null)A[ia][ib]-=g;else A[ia][n]+=g*V0[e.b]}
    if(ib!=null){A[ib][ib]+=g;if(ia!=null)A[ib][ia]-=g;else A[ib][n]+=g*V0[e.a]}});
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];const d=A[c][c];if(Math.abs(d)<1e-15)continue;
    for(let r=0;r<n;r++){if(r===c)continue;const f=A[r][c]/d;if(f)for(let k=c;k<=n;k++)A[r][k]-=f*A[c][k]}}
  const V={[P]:1,[N]:0};for(const k in id){const i=id[k];V[k]=Math.abs(A[i][i])>1e-15?A[i][n]/A[i][i]:0}
  const I={};let Is=0;els.forEach(e=>{I[e.id]=e.a===e.b?0:(V[e.a]-V[e.b])/e.R;if(e.a===P)Is+=I[e.id];if(e.b===P)Is-=I[e.id]});
  return {V,I,Is}}
/* اتصال العناصر بالمصدر (لتلوين «موصول بالجهد» بلا تيار) */
function reach(els,starts){const adj={};els.forEach(e=>{(adj[e.a]=adj[e.a]||[]).push(e.b);(adj[e.b]=adj[e.b]||[]).push(e.a)});const seen=new Set(starts),q=[...starts];
  while(q.length){const k=q.pop();(adj[k]||[]).forEach(m=>{if(!seen.has(m)){seen.add(m);q.push(m)}})}return seen}
const sgn=(v,e)=>Math.abs(v)<(e||1e-4)?0:Math.sign(v);
/* اتحاد-بحث للوحات التيار المتردد */
function UF(){const p={};const f=k=>{if(p[k]==null)p[k]=k;return p[k]===k?k:(p[k]=f(p[k]))};return {f,u(a,b){p[f(a)]=f(b)},same(a,b){return f(a)===f(b)}}}

/* =====================================================================
   3) أدوات واجهة المختبر (كما في الملفات المرجعية)
   ===================================================================== */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة أو تجربة توصيل آخر.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}}}
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group" style="flex-wrap:wrap">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const LEG=`<div class="legend"><span><i style="background:var(--live)"></i>متقطع متحرك = يمر تيار</span><span><i style="background:var(--live);height:2px"></i>خط برتقالي = موصول بالجهد بلا تيار</span><span><i style="background:var(--blue)"></i>قنطرة (وصلة) على اللوحة</span></div>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
const DIRT=d=>d>0?'إلى اليمين ⟳':d<0?'إلى اليسار ⟲':'متوقف';
/* هيكل مختبر عام: لوحة التحكم + الدائرة + الخطوات */
function shell(el,o){el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>${o.title} <small>${o.ref}</small></h2><div class="wrap-in" id="ctl" style="align-items:flex-end"></div>
    <div class="wrap-in" style="padding-top:0"><div class="reads" id="rd" style="margin-inline-start:0"></div></div><div class="callout" id="say"></div></div>
   <div class="panel c7"><h2>${o.figT||'الدائرة'} <small>${o.figRef||''}</small></h2>${o.figNote?`<p class="sub">${o.figNote}</p>`:''}<div class="svgbox" id="fig" style="max-width:${o.mw||560}px;margin-inline:auto"></div>${o.leg===false?'':LEG}${o.after||''}</div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(o.tries)}</div></div>`;
  const $=s=>el.querySelector(s);return $}
/* دوّار: يحرّك علامات [data-rot] بسرعة تقترب من الهدف */
function spinner(el){let ang=0,sp=0;return {tick(dt,tg,tau){sp+=(tg-sp)*Math.min(1,dt/(tau||0.5));if(Math.abs(sp)<1e-3&&!tg)sp=0;ang=(ang+sp*dt*300)%360;
  el.querySelectorAll('[data-rot]').forEach(g=>g.setAttribute('transform',`rotate(${ang.toFixed(1)} ${g.dataset.rot})`));return sp},get sp(){return sp}}}
const speedBar=(v,max,warn)=>`<span style="display:inline-block;width:120px;height:10px;border-radius:6px;background:var(--surface-2);vertical-align:middle;overflow:hidden"><i style="display:block;height:100%;width:${Math.min(100,Math.abs(v)/max*100).toFixed(0)}%;background:${warn?'var(--stop)':'var(--on)'}"></i></span>`;
/* مثال مرسوم خطوة بخطوة: كل خطوة تضيف عناصر المشهد ذات الرقم نفسه (وتبقى السابقة) */
function drawEx(o){return {title:o.title,ref:o.ref,q:o.q,note:o.note,
  solve:()=>o.steps.map((t,k)=>({t:`<p>${t}</p>`+box(o.scene.svg({upto:k+1,hi:true}),o.mw||520),final:k===o.steps.length-1}))}}

/* =====================================================================
   الدرس 1 — تركيب آلات التيار المستمر والتغذية المنفصلة (الأشكال 5-1 … 5-3)
   ===================================================================== */
/* الشكل (5-1): مقطع آلة التيار المستمر + رمزا المحرك والمولد (الأرقام 1،2،3 تشير إلى التسميات في التعليق) */
function fig51(){const S=Sc(560,250,'تركيب آلات التيار المستمر'),cx=280,cy=118;
  S.add(`<path d="M${cx-58} ${cy+78}L${cx-72} ${cy+100}H${cx+72}L${cx+58} ${cy+78}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/>`);
  S.add(`<path fill-rule="evenodd" d="M${cx-86} ${cy}a86 86 0 1 0 172 0a86 86 0 1 0 -172 0ZM${cx-72} ${cy}a72 72 0 1 0 144 0a72 72 0 1 0 -144 0Z" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/><circle cx="${cx}" cy="${cy-94}" r="7" style="fill:none;stroke:var(--fg);stroke-width:2"/>`);
  [-1,1].forEach(sg=>{const yb=cy+sg*72;
    S.add(`<path d="M${cx-16} ${yb}V${cy+sg*50}H${cx-30}Q${cx} ${cy+sg*34} ${cx+30} ${cy+sg*50}H${cx+16}V${yb}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.5"/>`);
    [-1,1].forEach(sx=>{const x=sx<0?cx-34:cx+18,y=sg<0?yb:yb-20;S.add(`<rect x="${x}" y="${y}" width="16" height="20" style="fill:var(--stop-soft);stroke:var(--fg);stroke-width:1.2"/><path d="M${x} ${y}l16 20M${x} ${y+10}l8 10M${x+8} ${y}l8 10" style="stroke:var(--fg);stroke-width:.8"/>`)})});
  let sl='';for(let k=0;k<16;k++){const a=k*22.5*Math.PI/180;sl+=`<circle cx="${r1(cx+29*Math.sin(a))}" cy="${r1(cy-29*Math.cos(a))}" r="3" style="fill:var(--fg)"/>`}
  S.add(`<circle cx="${cx}" cy="${cy}" r="34" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.5"/>${sl}<circle cx="${cx}" cy="${cy}" r="7" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/>`);
  const call=(n,x,y,tx,ty)=>S.add(`<path d="M${x} ${y}L${tx} ${ty}" style="stroke:var(--blue);stroke-width:1.2"/><circle cx="${tx}" cy="${ty}" r="9" style="fill:var(--blue-soft);stroke:var(--blue);stroke-width:1.2"/>`+T(tx,ty+4,String(n),{b:1,sz:11}));
  call(1,cx+34,cy-58,cx+120,cy-80);call(2,cx+24,cy+44,cx+120,cy+62);call(3,cx-24,cy+22,cx-120,cy+72);
  [[70,'M'],[490,'G']].forEach(([x,L])=>{dcm(S,x-18,120,L);wire(S,[[x-18,96],[x-18,84]]);wire(S,[[x-18,144],[x-18,156]]);
    S.add(`<path d="M${x+14} 92V120M${x+40} 92V120" style="${SK}"/><rect x="${x+12}" y="120" width="30" height="10" style="fill:var(--fg)"/>`)});
  S.add(T(70,62,'Motor',{m:1})+T(490,62,'Generator',{m:1}));
  return S}

/* الأشكال (5-2أ) و(5-2ب) و(5-3): الآلة منفصلة التغذية.
   o.ra / o.rf: بطارية العضو الدوار / المجال مقلوبة (+ يساراً). o.aA: سهم تيار العضو الدوار (1 إلى أسفل، -1 إلى أعلى، 0 بلا سهم)؛
   o.aF: سهم تيار المجال (1 إلى اليسار، -1 إلى اليمين)؛ o.rot: سهم الدوران؛ o.gen: مولد؛ o.sw: مفتاحا المختبر؛ o.steps: خطوات الأمثلة */
function figSep(o){o=o||{};const S=Sc(330,190,'آلة تيار مستمر منفصلة التغذية'),k=i=>o.steps?i:0,mx=100,my=104,y0=o.gen?24:30;
  S.at(k(1));
  if(o.gen){term(S,42,24);term(S,mx,24);txt(S,71,30,'U',{sz:13});
    if(o.lamp){const on=o.U&&o.qa;wire(S,[[42,21],[42,8],[63,8]],'L');wire(S,[[79,8],[mx,8],[mx,21]],'L');S.add(`<circle cx="71" cy="8" r="8" style="fill:${on?'#ffd23f':'var(--lamp-off)'};stroke:var(--fg);stroke-width:1.3"/><path d="M65.5 2.5l11 11M76.5 2.5l-11 11" style="stroke:var(--fg);stroke-width:1.1"/>`)}}
  else{bat(S,71,30,!!o.ra,'a0');wire(S,[[55,30],[42,30]],'a0');wire(S,[[87,30],[mx,30]],'a0')}
  S.at(k(2));
  wire(S,[[mx,y0+(o.gen?3:0)],[mx,my-24]],'a');
  if(o.sw){wire(S,[[42,y0+(o.gen?3:0)],[42,58]],'a0');cont(S,42,58,80,o.qa,'a');txt(S,34,74,o.gen?'S':'Qa',{a:'end',sz:10});wire(S,[[42,80],[42,154],[mx,154],[mx,my+24]],'a')}
  else wire(S,[[42,y0+(o.gen?3:0)],[42,154],[mx,154],[mx,my+24]],'a');
  dcm(S,mx,my,o.gen?'G':'M',{rot:o.sw,net:'a'});txt(S,mx-12,my-22,'A1',{a:'end',sz:11});txt(S,mx-12,my+30,'A2',{a:'end',sz:11});
  S.at(k(3));
  bat(S,232,30,!!o.rf,'f0');
  S.at(k(4));
  wire(S,[[216,30],[204,30],[204,92]],'f');
  if(o.sw){wire(S,[[248,30],[262,30],[262,48]],'f0');cont(S,262,48,70,o.qf,'f');txt(S,272,64,'Qf',{a:'start',sz:10});wire(S,[[262,70],[262,92]],'f')}
  else wire(S,[[248,30],[262,30],[262,92]],'f');
  coil(S,233,98,66,12,'f');txt(S,196,88,'F1',{a:'end',sz:11});txt(S,270,88,'F2',{a:'start',sz:11});
  S.at(k(5));
  if(o.aA&&!o.gen){const d=o.aA>0;arrow(S,74,d?my-14:my+14,74,d?my+14:my-14)}
  if(o.aF){const d=o.aF>0;arrow(S,d?256:210,122,d?210:256,122)}
  if(o.rot)rotArr(S,mx,my,27,o.rot);
  return S}
const F52A=()=>figSep({aA:1,aF:1,rot:1});
const F52B_book=()=>figSep({ra:1,aA:-1,aF:-1,rot:-1});
const F52B_fix=()=>figSep({ra:1,aA:-1,aF:1,rot:-1});
const F53=()=>figSep({gen:1,aF:1,rot:2});
/* مفتاح «كما في الكتاب / المصحح» حول رسمين */
const bkFig=(k,lbl,svgBook,svgFix,mw,note)=>`<div style="margin-bottom:6px">${B.bkCtl(k,lbl)}</div><div class="bkb" data-bk="${k}">${box(svgBook,mw)}</div><div class="bkf blk" data-bk="${k}" style="background:none;padding:0">${box(svgFix,mw)}${note?`<p class="sub fixnote">${note}</p>`:''}</div>`;

/* ---------- مختبر الآلة منفصلة التغذية ---------- */
function labSep(el){
  const st={mode:'mot',qa:0,qf:0,ra:0,rf:0,drive:1};const w={dir:0,U:0,flips:0};let lastU=0;
  const $=shell(el,{title:'مختبر الآلة منفصلة التغذية',ref:'مبني على الأشكال (5-2أ) ص 103 و(5-2ب) ص 104 و(5-3) ص 104',mw:420,
    figNote:'أضفنا مفتاحين (Qa للعضو الدوار، Qf للمجال) لتشغيل الدائرة؛ وفي وضع المولد يحل مصباح محل البطارية بين طرفي الخرج U. الأسهم تُرسم من التوصيل الحالي.',
    tries:['أغلق Qa و Qf: يدور المحرك إلى اليمين كما في الشكل (5-2أ).','اعكس قطبية العضو الدوار فقط: ينعكس الاتجاه — هذا هو الشكل (5-2ب).','اعكس الاثنين معاً: يعود الاتجاه كما كان.','في وضع المولد بدّل اتجاه الإدارة: تنعكس قطبية الطرف A1.']});
  const sp=spinner(el);
  $('#ctl').innerHTML=`<div><div class="sub">نوع التشغيل</div>${segHTML('md',[['mot','محرك'],['gen','مولد']],st.mode)}</div>
   ${swHTML('sQa','Qa','مفتاح العضو الدوار',0)}${swHTML('sQf','Qf','مفتاح المجال',0)}
   <button class="btn" id="bRa">اعكس قطبية العضو الدوار (A1/A2)</button><button class="btn" id="bRf">اعكس قطبية المجال (F1/F2)</button>
   <div id="drv"><div class="sub">اتجاه إدارة المولد (المحرك الأولي)</div>${segHTML('dv',[['1','إلى اليمين'],['-1','إلى اليسار'],['0','متوقف']],'1')}</div>`;
  const calc=()=>{const If=st.qf&&!chF('fopen')?(st.rf?-1:1)*(chF('frev')?-1:1):0;
    if(st.mode==='mot'){const Ia=st.qa&&!chF('aopen')?(st.ra?-1:1):0;return {Ia,If,dir:Ia&&If?Ia*If:0,U:0}}
    const U=chF('aopen')?0:st.drive*If;return {Ia:U&&st.qa?U:0,If,dir:st.drive,U}};
  const render=()=>{const r=calc();Object.assign(w,{dir:st.mode==='mot'?r.dir:0,U:r.U,mode:st.mode,qa:st.qa,qf:st.qf,ra:st.ra,rf:st.rf});
    if(st.mode==='gen'&&r.U&&lastU&&r.U!==lastU)w.flips++;if(st.mode==='gen'&&r.U)lastU=r.U;
    const cls=n=>n==='a0'?(r.Ia?'flow':'live'):n==='a'?(r.Ia?'flow':(st.mode==='gen'&&r.U?'live':'')):n==='L'?(r.Ia?'flow':''):n==='f0'?(r.If?'flow':'live'):n==='f'?(r.If?'flow':''):'';
    const S=figSep({sw:1,gen:st.mode==='gen',lamp:1,U:r.U,qa:st.qa,qf:st.qf,ra:st.ra,rf:st.rf,aA:st.mode==='gen'?0:r.Ia,aF:r.If,rot:st.mode==='mot'?r.dir:(r.U?st.drive:0)});
    $('#fig').innerHTML=S.svg({cls});
    $('#sQa').setAttribute('aria-pressed',String(!!st.qa));$('#sQf').setAttribute('aria-pressed',String(!!st.qf));
    $('#sQa b').textContent=st.mode==='gen'?'S':'Qa';$('#sQa small').textContent=st.mode==='gen'?'مفتاح الحمل (المصباح)':'مفتاح العضو الدوار';
    $('#bRa').style.display=st.mode==='gen'?'none':'';$('#drv').style.display=st.mode==='gen'?'':'none';
    el.querySelectorAll('[data-md]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.md===st.mode)));
    el.querySelectorAll('[data-dv]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.dv===st.drive)));
    const chip=(t,c)=>`<em class="mode-chip ${c||''}">${t}</em>`;
    $('#rd').innerHTML=st.mode==='mot'?
      `<div class="read"><span>اتجاه الدوران</span>${chip(DIRT(r.dir),r.dir>0?'run':r.dir<0?'rev':'')}</div><div class="read"><span>تيار العضو الدوار</span>${chip(r.Ia>0?'من A1 إلى A2':r.Ia<0?'من A2 إلى A1':'لا يمر')}</div><div class="read"><span>تيار المجال (السهم)</span>${chip(r.If>0?'إلى اليسار ←':r.If<0?'إلى اليمين →':'لا يمر')}</div>`:
      `<div class="read"><span>الإدارة</span>${chip(DIRT(st.drive),st.drive?'run':'')}</div><div class="read"><span>جهد الخرج U</span>${chip(r.U?'يتولد':'لا يتولد',r.U?'run':'')}</div><div class="read"><span>قطبية الطرف A1</span>${chip(r.U>0?'موجب +':r.U<0?'سالب −':'—',r.U?'star':'')}</div>`;
    $('#say').innerHTML=st.mode==='mot'?(!st.qa&&!st.qf?'المفتاحان مفتوحان. أغلق Qa و Qf لتشغيل المحرك.':st.qa&&!st.qf?'يمر تيار في العضو الدوار لكن <b>لا يوجد مجال</b> (Qf مفتوح)، فلا يدور المحرك. أغلق Qf.':!st.qa?'المجال موجود لكن دائرة العضو الدوار مفتوحة: لا يدور.':
      `يدور المحرك <b>${DIRT(r.dir)}</b>. الطرف A1 الآن <b>${st.ra?'سالب':'موجب'}</b>.${!st.rf?' «إذا دار العضو الدوار إلى اليمين فإن A1 يكون طرف التوصيل الموجب» (ص 103).':' المجال هنا معكوس عن الشكل (5-2أ)، لذلك لا تنطبق القاعدة كما هي: مع مجال معكوس يدور المحرك إلى اليمين عندما يكون A1 سالباً.'}`):
      (!st.qf?'المولد يدار لكن <b>المجال بلا تغذية</b> (Qf مفتوح): لا يتولد جهد.':!st.drive?'المجال مغذّى لكن العضو الدوار متوقف: لا يتولد جهد.':`يتولد جهد U بين الطرفين، والطرف A1 <b>${r.U>0?'موجب':'سالب'}</b>. ${st.qa?'المصباح مضاء.':'أغلق مفتاح الحمل S ليضيء المصباح.'} الشكل (5-3) يرسم سهماً مزدوجاً لأن المولد يمكن أن يدار في الاتجاهين.`)};
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.md){st.mode=t.dataset.md;lastU=0}else if(t.dataset.dv!=null){st.drive=+t.dataset.dv}
    else if(t.id==='sQa')st.qa^=1;else if(t.id==='sQf')st.qf^=1;else if(t.id==='bRa')st.ra^=1;else if(t.id==='bRf')st.rf^=1;else return;render();G.check()});
  const G=stepsUI($('#gs'),[
    {t:'شغّل المحرك',x:'أغلق Qa ثم Qf. يدور المحرك إلى اليمين (مع عقارب الساعة) كما في الشكل (5-2أ).',done:w=>w.mode==='mot'&&w.dir===1&&!w.ra&&!w.rf},
    {t:'اعكس قطبية العضو الدوار',x:'اضغط «اعكس قطبية العضو الدوار»: يصبح A1 سالباً فيدور المحرك إلى اليسار — الشكل (5-2ب).',done:w=>w.mode==='mot'&&w.ra&&!w.rf&&w.dir===-1},
    {t:'اعكس المجال أيضاً',x:'اضغط «اعكس قطبية المجال» والعضو الدوار ما زال معكوساً: يعود الدوران إلى اليمين. عكسُ الاثنين معاً لا يغيّر الاتجاه.',done:w=>w.mode==='mot'&&w.ra&&w.rf&&w.dir===1},
    {t:'المجال وحده معكوس',x:'أعد العضو الدوار إلى قطبيته الأولى (اضغط زره مرة أخرى): المجال وحده معكوس فيدور إلى اليسار.',done:w=>w.mode==='mot'&&!w.ra&&w.rf&&w.dir===-1},
    {t:'افصل المجال',x:'افتح Qf والعضو الدوار موصول: لا يدور المحرك، لأنه لا يوجد مجال.',done:w=>w.mode==='mot'&&w.qa&&!w.qf},
    {t:'التشغيل كمولد',x:'اختر «مولد»، وأغلق Qf ومفتاح الحمل S: يضيء المصباح — الشكل (5-3).',done:w=>w.mode==='gen'&&w.U!==0&&w.qa},
    {t:'اعكس اتجاه الإدارة',x:'اختر «إلى اليسار»: تنعكس قطبية الطرف A1 والمصباح يبقى مضاء.',done:w=>w.mode==='gen'&&w.flips>=1}
  ],()=>w);
  render();
  loopOn(el,dt=>{const r=calc();sp.tick(dt,st.mode==='mot'?r.dir:st.drive,0.5)})}

B.lesson({
 id:'u5-l1',unit:5,order:1,pages:'100–104',
 title:'تركيب آلات التيار المستمر والتغذية المنفصلة',
 summary:'أهداف الوحدة الخامسة، وتصنيف الآلات الكهربائية، وتركيب آلة التيار المستمر، ومخطط توصيل الآلة منفصلة التغذية كمحرك (وعكس اتجاه دورانه) وكمولد.',
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
(window.U5S=window.U5S||(function(){
/* أدوات صغيرة لمحطات الوحدة الخامسة (الرسم الفني): تضع رسوم الدرس نفسها داخل لوحة المحطة بألوان ثابتة
   (خلفية اللوحة فاتحة في الوضعين)، مع مناطق تلميح شفافة data-tip بإحداثيات الرسم الأصلي. */
const PAL='--fg:#2C4A40;--wire:#2C4A40;--surface:#FBF6EE;--surface-2:#EFE6D6;--muted:#6B6F63;--blue:#2F6FA8;--blue-soft:#D6E5F2;--blue-ink:#1F4E79;--live:#D9822B;--live-soft:#F7E2C8;--stop:#C4473A;--stop-soft:#F6D5CE;--on:#2E8B57;--lamp-off:#E3DCCB;--line:#D9CFBD';
let n=0;
const strip=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
/* o: {S: مشهد الدرس | svg:نص, w,h (للنص), vb:[x,y,w,h] جزء الرسم المعروض, so: خيارات S.svg, tips:[[x,y,w,h,نص]], bg, label, title, box:[x,y,w,h], extra: عناصر بإحداثيات اللوحة} */
function art(o){const bx=o.box||[24,22,312,256],id='u5clip'+(n++);
 const tips=(o.tips||[]).map(t=>`<rect data-tip="${t[4]}" x="${t[0]}" y="${t[1]}" width="${t[2]}" height="${t[3]}" rx="5" fill="transparent"/>`).join('');
 let body,W,H;if(o.S){body=strip(o.S.svg(o.so||{}));W=o.S.w;H=o.S.h}else{body=strip(o.svg);W=o.w;H=o.h}
 const vb=o.vb||[0,0,W,H],pad=8,aw=bx[2]-2*pad,ah=bx[3]-2*pad,k=Math.min(aw/vb[2],ah/vb[3]),tx=bx[0]+pad+(aw-vb[2]*k)/2,ty=bx[1]+pad+(ah-vb[3]*k)/2;
 return `<svg viewBox="0 0 360 320" role="img" aria-label="${o.label||''}" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${id}"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"/></clipPath></defs><circle cx="180" cy="160" r="140" fill="${o.bg||'#DDEFE6'}"/><g style="${PAL}"><rect x="${bx[0]}" y="${bx[1]}" width="${bx[2]}" height="${bx[3]}" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${-vb[0]} ${-vb[1]})"><g clip-path="url(#${id})">${body}</g>${tips}</g>${o.extra||''}</g>${o.title?`<text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">${o.title}</text>`:''}</svg>`}
/* شكل من الكتاب داخل نص المحطة: svg + عنوان الشكل + وصف */
const fig=(html,mw,cap)=>`<figure style="margin:12px 0"><div style="max-width:${mw||520}px;margin-inline:auto">${html}</div><figcaption class="sub" style="text-align:center;margin-top:6px;line-height:1.7">${cap||''}</figcaption></figure>`;
const lt=s=>`<span class="ltr">${s}</span>`;
return {art,fig,PAL,lt,strip};
})()),{intro:true}),
{st:1,short:'أهداف الوحدة',title:'الوحدة الخامسة: مخططات دوائر توصيل الآلات الكهربائية — الأهداف',ref:'ص 100–101',
   q:'آلات كثيرة بأسماء كثيرة… فما الذي يطلب منك الكتاب أن ترسمه في نهاية هذه الوحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شجرة أنواع الآلات التي تغطيها الوحدة: آلات تيار مستمر بأربعة أنواع وآلات تيار متردد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="110" y="34" width="140" height="40" rx="12" fill="#2C4A40"/><text x="180" y="60" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">الآلات الكهربائية</text><path d="M180 74V92M104 92H256M104 92V108M256 92V108" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="آلات التيار المستمر: يقسمها الكتاب حسب توصيل ملفات المجال إلى منفصلة التغذية وذاتية التغذية (توالٍ، توازٍ، مركبة). الدروس 1 إلى 4."><rect x="190" y="108" width="132" height="166" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="190" y="108" width="132" height="34" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="256" y="131" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">تيار مستمر</text><text x="256" y="168" text-anchor="middle" font-size="13" fill="#2C4A40">منفصل التغذية</text><text x="256" y="196" text-anchor="middle" font-size="13" fill="#2C4A40">توالٍ</text><text x="256" y="224" text-anchor="middle" font-size="13" fill="#2C4A40">توازٍ</text><text x="256" y="252" text-anchor="middle" font-size="13" fill="#2C4A40">مركب</text></g><g data-tip="آلات التيار المتردد: التزامنية (المولد التزامني أحادي وثلاثي الأوجه — الدرسان 5 و6) والحثية (المحرك أحادي الوجه وثلاثي الأوجه — الدرسان 7 و8)."><rect x="38" y="108" width="132" height="166" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="38" y="108" width="132" height="34" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="104" y="131" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">تيار متردد</text><text x="104" y="168" text-anchor="middle" font-size="13" fill="#2C4A40">تزامني</text><text x="104" y="196" text-anchor="middle" font-size="13" fill="#2C4A40">حثي</text><text x="104" y="224" text-anchor="middle" font-size="13" fill="#2C4A40">أحادي الوجه</text><text x="104" y="252" text-anchor="middle" font-size="13" fill="#2C4A40">ثلاثي الأوجه</text></g><text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لكل نوع مخطط توصيل ترسمه</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لأنواع الآلات في أهداف الوحدة.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'الهدف العام للوحدة يذكر آلات التيار المستمر «بأنواعها». كم نوعاً يعدّ الهدف التفصيلي الأول؟',opts:[
     ['نوعان: محرك ومولد',false,'المحرك والمولد طريقتا تشغيل للآلة نفسها، وليسا الأنواع التي يعدّها الهدف.'],
     ['ثلاثة أنواع',false,'الهدف يعدّ أربعة بين القوسين.'],
     ['أربعة: منفصل التغذية، توالٍ، توازٍ، مركب',true,'هكذا يعدّها الهدف التفصيلي الأول (ص 101)، ولكل نوع درس في هذه الوحدة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة مخططات دوائر توصيل آلات التيار المستمر بأنواعها وآلات التيار المتردد ثلاثية الأوجه</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم الدائرة الكهربائية الممثلة لآلات التيار المستمر بأنواعها (منفصل التغذية – توالٍ – توازٍ – مركب).</li><li>أن يتمكن المتدرب من رسم الدائرة الكهربائية الممثلة لآلات التيار المتردد بأنواعها (تزامني – وحثي – وأحادي الوجه – وثلاثي الوجه).</li></ol>`,ref:'ص 100–101'},
    {tip:String.raw`<p>ترتيب هذه الوحدة: <b>آلات التيار المستمر</b> (منفصلة التغذية، توالٍ، توازٍ، مركبة — الدروس 1 إلى 4)، ثم <b>آلات التيار المتردد</b>: التزامنية (المولد التزامني — الدرسان 5 و6) والحثية (أحادية الوجه وثلاثية الأوجه — الدرسان 7 و8)، ثم تمارين الوحدة.</p><p>في كل درس سترى المخطط نفسه بأكثر من طريقة: رسم المبدأ، ثم <b>مخطط مسار التيار مع مخطط التوصيلات</b> على لوحة الأطراف، ثم <b>الدائرة الخطية</b> بخط واحد.</p>`,title:'خريطة الوحدة'},
    {title:'مختبر مصغّر: إلى أي عائلة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل نوع من أنواع الآلات في أهداف الوحدة.',cats:['تيار مستمر','تيار متردد'],items:[
     ['آلة توالٍ',0,'ملف المجال على التوالي مع العضو الدوار — من أنواع آلات التيار المستمر (الدرس 2).'],
     ['آلة تزامنية',1,'المولد التزامني آلة تيار متردد (الدرسان 5 و6).'],
     ['آلة منفصلة التغذية',0,'مجالها يتغذى من مصدر خارجي — تيار مستمر (الدرس 1).'],
     ['محرك حثي ثلاثي الأوجه',1,'آلة تيار متردد، وهو الأكثر استخداماً في الصناعة (الدرس 8).'],
     ['آلة مركبة',0,'فيها ملف توالٍ وملف توازٍ — تيار مستمر (الدرس 4).'],
     ['محرك حثي أحادي الوجه',1,'آلة تيار متردد للأجهزة الصغيرة (الدرس 7).']]})}
   ]},

  {st:2,short:'المقدمة',title:'5-1 المقدمة',ref:'ص 102',
   q:'الآلة نفسها قد تكون محركاً وقد تكون مولداً… فما الذي يحدد اسمها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الطاقة الكهربائية تتحول إلى ميكانيكية في المحرك، والميكانيكية إلى كهربائية في المولد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الطاقة الكهربائية: تدخل المحرك من المصدر، وتخرج من المولد إلى الحمل."><rect x="222" y="58" width="104" height="74" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M276 70L262 96H276L266 120L292 90H278L288 70Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="274" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">طاقة كهربائية</text></g><g data-tip="الطاقة الميكانيكية: حركة دوران على عمود الآلة؛ يخرجها المحرك إلى الحمل، ويأخذها المولد من المحرك الأولي."><rect x="34" y="58" width="104" height="74" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="86" cy="95" r="22" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="86" cy="95" r="6" fill="#2C4A40"/><path d="M86 73V84M86 106V117M64 95H75M97 95H108" stroke="#2C4A40" stroke-width="3"/><text x="86" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">طاقة ميكانيكية</text></g><g data-tip="المحرك ⟦M⟧: يحوّل الطاقة الكهربائية إلى طاقة ميكانيكية."><path d="M222 186H146" stroke="#E8735A" stroke-width="5"/><path d="M146 186l14-9v18z" fill="#E8735A"/><circle cx="184" cy="186" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="184" y="192" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="184" y="222" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">محرك</text></g><g data-tip="المولد ⟦G⟧: يحوّل الطاقة الميكانيكية إلى طاقة كهربائية."><path d="M138 250H214" stroke="#2F6FA8" stroke-width="5"/><path d="M214 250l-14-9v18z" fill="#2F6FA8"/><circle cx="176" cy="250" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="176" y="256" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><text x="176" y="286" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مولد</text></g><text x="180" y="308" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">اتجاه التحويل هو الذي يسمّي الآلة</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لتعريف المحرك والمولد في ص 102.<br><b>مرّر المؤشر على الطاقتين والسهمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'آلة في محطة توليد يديرها توربين فتخرج منها كهرباء. ماذا تسمى؟',opts:[
     ['محرك، لأنها تدور',false,'الدوران وحده لا يحدد الاسم؛ المهم اتجاه تحويل الطاقة.'],
     ['مولد، لأنها تحوّل الطاقة الميكانيكية إلى كهربائية',true,'«إذا كان التحويل من الطاقة الميكانيكية إلى طاقة كهربائية تسمى الآلة مولداً» (ص 102).'],
     ['محول، لأنها تغيّر الجهد',false,'المحول لا يدور ولا يحوّل طاقة ميكانيكية.']]}}
   ],
   body:[
    {book:String.raw`<p>تستخدم الآلات الكهربائية في تحويل الطاقة الكهربائية إلى طاقة ميكانيكية والعكس إذا كان التحويل من الطاقة الكهربائية إلى طاقة ميكانيكية تسمى الآلة <b>محركاً</b> و إذا كان التحويل من الطاقة الميكانيكية إلى طاقة كهربائية تسمى الآلة <b>مولداً</b>. وتصنف الآلات إلى آلات تيار مستمر وآلات تيار متردد وتصنف آلات التيار المتردد إلى آلات حثيه وآلات تزامنيه. عندما يتحرك موصل كهربائي موضوع عمودياً على اتجاه المجال المغناطيسي في اتجاه عمودي على ذلك المجال فإنه يتم توليد قوة دافعة كهربائية وهذه هي فكرة عمل مولد التيار المستمر. وأيضاً عندما يمر تيار مستمر خلال ذلك الموصل فإن ثمة قوة تؤثر على ذلك الموصل وهذه هي فكرة عمل محرك التيار المستمر. وتسمى هذه الأجهزة بآلات التيار المستمر.</p>`,ref:'ص 102'},
    {tip:String.raw`<p>الفكرتان وجهان لعملة واحدة: <b>موصل يتحرك في مجال</b> ← يتولد فيه جهد (مولد). <b>موصل يمر فيه تيار وهو في مجال</b> ← تؤثر عليه قوة فيتحرك (محرك). لذلك يمكن للآلة نفسها أن تعمل بالطريقتين.</p>`,title:'فكرتان في جملتين'},
    {book:String.raw`<p>الآلات الحثية هي آلات التيار المتردد التي فيها يستقبل الملف الطاقة عند أحد الجوانب من الملف عند الجانب الآخر عن طريق الحث الكهرومغناطيسي. وهناك آلات حثيه ثلاثية الوجه وهي الأكثر استخداماً في الصناعة وأخرى أحادية الوجه تستخدم في آلات القدرة الصغيرة مثل الأجهزة المنزلية.</p>`,ref:'ص 102'},
    {watch:'جملة الآلات الحثية ناقصة في الكتاب (ص 102): «يستقبل الملف الطاقة عند أحد الجوانب من الملف عند الجانب الآخر». المقصود: يستقبل الملفُّ في أحد الجانبين الطاقةَ من الملف في الجانب الآخر عن طريق الحث الكهرومغناطيسي.',fix:true},
    {book:String.raw`<p>أما بالنسبة للآلات التزامنية فهي آلات لها سرعة متزامنة مع المجال المغناطيسي الدوار في الثغرة الهوائية عند ظروف التشغيل في حالة الاستقرار تعرف بسرعة التزامن. المولدات التي تعمل في محطات توليد الكهرباء هي مولدات تزامنيه تدار بالسرعة التزامنية لتوليد جهد متغير بتردد ثابت. كما أن المولدات تصبح محركات تدور بالسرعة التزامنية عند التغذية بجهد متغير إلى لفائف عضو الإنتاج وعندئذ تعرف بالمحركات التزامنية.</p>`,ref:'ص 102'},
    {add:String.raw`<p>في البيت: الغسالة والمكيف الصغير والمروحة فيها غالباً محركات حثية <b>أحادية الوجه</b>. في المصنع: المضخات والسيور والضواغط تعمل غالباً بمحركات حثية <b>ثلاثية الأوجه</b>. وفي محطة الكهرباء: <b>مولدات تزامنية</b> كبيرة تديرها التوربينات.</p>`,title:'أين تقابل هذه الآلات؟'},
    {title:'مختبر مصغّر: سمِّ الآلة',widget:(el,B)=>DCML.cases(el,B,{intro:'اقرأ كل موقف واختر اسم الآلة كما يصنّفها الكتاب.',cases:[
     {q:'آلة تأخذ الكهرباء من المقبس وتدير حوض غسالة منزلية.',opts:[['محرك حثي أحادي الوجه',true,'تحوّل الكهرباء إلى حركة (محرك)، وهي آلة قدرة صغيرة منزلية (ص 102).'],['مولد تزامني',false,'المولد يُخرج الكهرباء ولا يأخذها.'],['محرك حثي ثلاثي الأوجه',false,'الكتاب يجعل ثلاثي الوجه للصناعة، وأحادي الوجه للأجهزة المنزلية.']]},
     {q:'آلة في محطة توليد تدار بالسرعة التزامنية وتعطي جهداً بتردد ثابت.',opts:[['محرك تيار مستمر',false,'هذه آلة تُخرج كهرباء متغيرة.'],['مولد تزامني',true,'«المولدات التي تعمل في محطات توليد الكهرباء هي مولدات تزامنيه» (ص 102).'],['محرك حثي',false,'المحرك يأخذ الطاقة الكهربائية.']]},
     {q:'موصل يمر فيه تيار مستمر وهو داخل مجال مغناطيسي فتؤثر عليه قوة.',opts:[['فكرة عمل مولد التيار المستمر',false,'المولد: موصل يتحرك فيتولد فيه جهد.'],['فكرة عمل الآلة الحثية',false,'الكتاب يربط هذه الجملة بآلات التيار المستمر.'],['فكرة عمل محرك التيار المستمر',true,'«فإن ثمة قوة تؤثر على ذلك الموصل وهذه هي فكرة عمل محرك التيار المستمر» (ص 102).']]}]})}
   ]},

  {st:3,short:'آلات التيار المستمر',title:'5-2 آلات التيار المستمر',ref:'ص 102–103',
   q:'محرك التيار المستمر يغيّر سرعته وعزمه بطرق كثيرة… فما الذي يتغير فيه بين نوع وآخر؟',
   art:U5S.art({S:fig51(),vb:[150,10,262,214],label:'مقطع آلة التيار المستمر من الشكل (5-1) مع الأرقام 1 و2 و3',bg:'#FBE6C4',title:'مقطع الآلة: ثابت ودوار',
    tips:[[389,27,22,22,'الرقم 1: ملفات العضو الثابت (ملفات المجال) — ملفوفة حول الأقطاب، وتوصيلها هو الذي يميّز أنواع الآلات.'],[389,169,22,22,'الرقم 2: الأقطاب — يلتف حولها ملف المجال فتصنع المجال المغناطيسي.'],[149,179,22,22,'الرقم 3: ملفات العضو الدائر — في مجاري العضو الدوار في وسط الآلة.'],[228,26,104,40,'القطب العلوي وعليه ملفا المجال (المربعات المظللة مقطع الملف).'],[246,84,68,68,'العضو الدوار: أسطوانة فيها مجارٍ (النقاط) تحمل ملفاته، وفي وسطها العمود.']]}),
   cap:'مقطع الآلة من الشكل <span class="ltr">(5-1)</span> ص 103.<br><b>مرّر المؤشر على الأرقام والأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب الكتاب، على أي أساس تُصنَّف آلات التيار المستمر؟',opts:[
     ['حسب قدرتها',false,'الكتاب لا يصنّفها هنا بالقدرة.'],
     ['حسب توصيلات ملفات المجال',true,'«تصنف آلات التيار المستمر وفقاً لتوصيلات ملفات المجال» (ص 103).'],
     ['حسب عدد الفرش',false,'الفرش موجودة في كل الأنواع.']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن لآلات التيار المستمر العمل كمولد أو محرك. في الوقت الحاضر استخدام المولد محدود نظراً لاستخدام مولدات التيار المتردد. لكن تستخدم محركات التيار المستمر بكثرة في الصناعة. وتتميز محركات التيار المستمر بإمكانية الحصول على نطاق واسع لتغير السرعة مع العزم بتوصيلات مختلفة لملفات المجال. تصنف آلات التيار المستمر وفقاً لتوصيلات ملفات المجال إلى <b>آلات منفصلة التغذية</b> و<b>آلات ذاتية التغذية</b> وتنقسم الآلات ذاتية التغذية إلى <b>آلات توالٍ</b> و<b>آلات توازٍ</b> و<b>آلات مركبة</b>. الشكل ${FN('5-1')} يبين تركيب آلات التيار المستمر.</p>`,ref:'ص 102–103'},
    {html:U5S.fig(box(fig51().svg(),560),560,'<b>الشكل <span class="ltr">(5-1)</span> تركيب آلات التيار المستمر</b> (ص 103) — في الوسط مقطع الآلة: (1) ملفات العضو الثابت، (2) الأقطاب، (3) ملفات العضو الدائر. يساراً رمز <b>محرك تيار مستمر</b> (M مسطّر) وبجانبه رمز ملف المجال، ويميناً رمز <b>مولد تيار مستمر</b> (G مسطّر).')},
    {tip:String.raw`<p>الخط تحت الحرف M أو G في الرمز يعني أن الآلة تعمل بالتيار المستمر، والمستطيلان الصغيران أعلى الدائرة وأسفلها هما الفرشتان.</p><p>«ذاتية التغذية» معناها أن ملف المجال يأخذ تياره من الآلة نفسها (من أطراف العضو الدوار أو من خطه)، لا من مصدر آخر.</p>`,title:'اقرأ الرمز'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة من نص ص 102–103.',items:[
     ['استخدام مولدات التيار المستمر اليوم واسع جداً.',false,'«في الوقت الحاضر استخدام المولد محدود نظراً لاستخدام مولدات التيار المتردد».'],
     ['محركات التيار المستمر تستخدم بكثرة في الصناعة.',true,'هكذا يقول النص، لأنها تعطي نطاقاً واسعاً لتغيير السرعة مع العزم.'],
     ['الآلات ذاتية التغذية ثلاثة أنواع: توالٍ وتوازٍ ومركبة.',true,'«وتنقسم الآلات ذاتية التغذية إلى آلات توالٍ وآلات توازٍ وآلات مركبة».'],
     ['الآلة منفصلة التغذية نوع من الآلات ذاتية التغذية.',false,'هي قسم مستقل: منفصلة التغذية في مقابل ذاتية التغذية.']]})}
   ]},

  {st:4,short:'التغذية المنفصلة',title:'5-2-1 مخطط توصيل آلات التيار المستمر المنفصل التغذية',ref:'ص 103',
   q:'بطاريتان في رسم واحد… لماذا لا يكفي مصدر واحد لهذه الآلة؟',
   art:U5S.art({S:figSep({}),vb:[24,0,286,172],label:'دائرتان مستقلتان: العضو الدوار ببطارية، والمجال ببطارية أخرى',title:'دائرتان لا يربطهما سلك',
    tips:[[50,14,42,32,'بطارية العضو الدوار: تغذي الفرشتين ⟦A1⟧ و⟦A2⟧ فقط.'],[211,14,42,32,'بطارية المجال: مصدر خارجي مستقل يغذي ملف المجال وحده.'],[196,84,74,28,'ملف المجال ⟦F1–F2⟧: يصنع المجال المغناطيسي، ويأخذ طاقته من مصدر خارج الآلة.'],[78,78,44,56,'المحرك ⟦M⟧ (حرف مسطّر = تيار مستمر)، والمستطيلان الأسودان فرشتاه.']]}),
   cap:'رسم الشكل <span class="ltr">(5-2)</span> بلا أسهم.<br><b>مرّر المؤشر على البطاريتين والملف والمحرك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'هل يوجد في هذا المخطط سلك يصل دائرة العضو الدوار بدائرة المجال؟',opts:[
     ['نعم، عند الطرف A2',false,'الطرف A2 يعود إلى بطارية العضو الدوار نفسها.'],
     ['نعم، عبر ملف المجال',false,'ملف المجال بين F1 و F2 فقط، على بطاريته.'],
     ['لا، الدائرتان منفصلتان كهربياً',true,'«ملف العضو الدوار وملفات التغذية (المجال) منفصلة كهربياً» (ص 103).']]}}
   ],
   body:[
    {book:String.raw`<p>في التغذية المنفصلة الطاقة التي تستعمل لتوليد المجال المغناطيسي تؤخذ من مصدر تيار يقع خارج الآلة كما أن ملف العضو الدوار وملفات التغذية (المجال) منفصلة كهربياً.</p>`,ref:'ص 103'},
    {tip:String.raw`<p>«منفصلة كهربياً» يعني: لو تتبعت الأسلاك بإصبعك من بطارية العضو الدوار فلن تصل أبداً إلى ملف المجال. لذلك تستطيع أن تتحكم في كل دائرة وحدها: تغيّر تيار المجال دون أن تلمس العضو الدوار، والعكس.</p><p>أطراف ملف المجال في هذه الآلة <span class="ltr">F1–F2</span>، وأطراف العضو الدوار <span class="ltr">A1–A2</span>.</p>`,title:'ما معنى «منفصلة»؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['في الآلة منفصلة التغذية تؤخذ طاقة المجال من مصدر يقع خارج الآلة.',true,'هذا تعريف التغذية المنفصلة (ص 103).'],
     ['ملف المجال موصل على التوالي مع العضو الدوار.',false,'هذا محرك التوالي (الدرس 2). هنا الدائرتان منفصلتان.'],
     ['يرمز لطرفي ملف المجال في الآلة منفصلة التغذية بالرمزين F1 و F2.',true,'كما في الشكل (5-2). (التوالي D1–D2، والتوازي E1–E2.)']]})}
   ]},

  {st:5,short:'التشغيل كمحرك',title:'أ) التشغيل كمحرك',ref:'ص 103–104',
   q:'نريد أن يدور المحرك إلى اليسار بدلاً من اليمين… ماذا نقلب: بطارية واحدة أم الاثنتين؟',
   art:U5S.art({S:F52A(),vb:[24,0,286,172],label:'الشكل (5-2أ) محرك منفصل التغذية يدور إلى اليمين مع أسهمه',bg:'#DDEFE6',title:'ثلاثة أسهم تحكي القصة',
    tips:[[62,86,22,36,'سهم تيار العضو الدوار: إلى أسفل، من ⟦A1⟧ (الموجب) إلى ⟦A2⟧.'],[204,112,58,20,'سهم تيار المجال: تحت الملف، من ⟦F2⟧ إلى ⟦F1⟧ (يخرج التيار من القطب الموجب للبطارية).'],[112,76,26,58,'سهم الدوران المنحني: مع عقارب الساعة = دوران إلى اليمين.'],[66,72,24,16,'الطرف ⟦A1⟧: موجب عند الدوران إلى اليمين.']]}),
   cap:'الشكل <span class="ltr">(5-2أ)</span> ص 103.<br><b>مرّر المؤشر على الأسهم والطرف A1 (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محرك منفصل التغذية يدور إلى اليسار. ما قطبية الطرف A1؟ (والمجال كما هو)',opts:[
     ['موجب',false,'الموجب يكون عند الدوران إلى اليمين.'],
     ['سالب',true,'«إذا دار العضو الدوار إلى اليسار فإن A1 يكون طرف التوصيل السالب» (ص 103).'],
     ['لا يتغير شيء في الطرف',false,'قطبية A1 هي التي تغيرت لتغيير الاتجاه في الشكل (5-2ب).']]}}
   ],
   body:[
    {book:String.raw`<p><b>أ) التشغيل كمحرك:</b> إذا دار العضو الدوار إلى اليمين فإن <b>${LT('A1')}</b> يكون طرف التوصيل الموجب و إذا دار العضو الدوار إلى اليسار فإن <b>${LT('A1')}</b> يكون طرف التوصيل السالب. الشكل ${FN('5-2')} يبين التشغيل كمحرك.</p>`,ref:'ص 103'},
    {watch:'كتب الكتاب (ص 103) «الشكل (٤- ٢)» والصحيح الشكل <span class="ltr">(5-2)</span>.',fix:true},
    {html:U5S.fig(box(F52A().svg(),420),420,'<b>الشكل <span class="ltr">(5-2أ)</span> محرك تيار مستمر منفصل التغذية دوران العضو إلى اليمين</b> (ص 103) — دائرة العضو الدوار (بطارية، A1، A2) ودائرة المجال (بطارية، F1، F2، ملف المجال). السهم المستقيم بجانب المحرك = اتجاه تيار العضو الدوار، والسهم تحت الملف = اتجاه تيار المجال، والسهم المنحني = اتجاه الدوران.')},
    {html:U5S.fig(bkFig('u5a','سهم المجال في الشكل:',F52B_book().svg(),F52B_fix().svg(),420,'المصحح: قطبية بطارية المجال لم تتغير بين (5-2أ) و(5-2ب)، فتيار المجال لم يتغير اتجاهه، ويبقى سهمه إلى اليسار كما في (5-2أ). الكتاب رسمه إلى اليمين.'),460,'<b>الشكل <span class="ltr">(5-2ب)</span> محرك تيار مستمر منفصل التغذية دوران إلى اليسار</b> (ص 104) — عُكست قطبية بطارية العضو الدوار فقط، فأصبح A1 سالباً.')},
    {watch:'في الشكل <span class="ltr">(5-2ب)</span> ص 104 بقيت بطارية المجال كما هي («-» يساراً و«+» يميناً) ومع ذلك رُسم سهم تيار المجال إلى اليمين (معكوساً عن (5-2أ)). لو انعكس المجال والعضو الدوار معاً لما تغير اتجاه الدوران؛ الذي عُكس فعلاً هو العضو الدوار وحده، فسهم المجال الصحيح إلى اليسار. استخدم المفتاح فوق الرسم للمقارنة.',fix:true},
    {tip:String.raw`<p>لعكس اتجاه دوران محرك التيار المستمر نعكس <b>أحد</b> التيارين فقط: تيار العضو الدوار (تبديل A1 و A2) <b>أو</b> تيار المجال (تبديل F1 و F2). إذا عكسناهما معاً بقي الاتجاه كما هو.</p>`,title:'قاعدة عكس الاتجاه'},
    {title:'مختبر مصغّر: اقلب البطاريتين',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر قطبية كل بطارية في الشكل (5-2)، وراقب أسهم التيار واتجاه الدوران.',
     predict:{q:'عكسنا قطبية بطارية العضو الدوار <b>وبطارية المجال معاً</b>. ماذا يحدث لاتجاه الدوران؟',opts:[
      ['ينعكس',false,'عكس أحدهما فقط هو الذي يعكس الاتجاه.'],
      ['يتوقف المحرك',false,'التياران موجودان، فالمحرك يدور.'],
      ['يبقى كما كان',true,'عكس العضو الدوار يقلب الاتجاه، وعكس المجال يقلبه مرة أخرى فيعود كما كان.']]},
     ins:[{k:'ra',l:'بطارية العضو الدوار',seg:[[0,'A1 على الموجب'],[1,'A1 على السالب']],v:0},{k:'rf',l:'بطارية المجال',seg:[[0,'كما في (5-2أ)'],[1,'معكوسة']],v:0}],
     calc:s=>{const Ia=s.ra?-1:1,If=s.rf?-1:1,d=Ia*If;
      return {pic:figSep({ra:s.ra,rf:s.rf,aA:Ia,aF:If,rot:d}).svg({cls:n=>/^(a0|a|f0|f)$/.test(n)?'flow':''}),
       msg:`يدور المحرك <b>${DIRT(d)}</b>. الطرف A1 <b>${s.ra?'سالب':'موجب'}</b>، وتيار المجال ${s.rf?'معكوس':'كما في (5-2أ)'}.`+(s.ra&&!s.rf?' هذا هو الشكل (5-2ب).':s.ra&&s.rf?' عكسنا الاثنين فعاد الاتجاه كما كان.':s.rf?' عكسنا المجال وحده فانعكس الاتجاه، مع أن A1 ما زال موجباً.':' هذا هو الشكل (5-2أ).')}}})}
   ]},

  {st:6,short:'التشغيل كمولد',title:'ب) التشغيل كمولد',ref:'ص 104',
   q:'في المولد لا توجد بطارية على العضو الدوار… فمن أين يأتي الجهد U؟',
   art:U5S.art({S:F53(),vb:[24,0,286,172],label:'الشكل (5-3) مولد تيار مستمر منفصل التغذية',bg:'#E3ECF7',title:'المولد يُخرج الجهد U',
    tips:[[48,10,48,26,'⟦U⟧: جهد الخرج بين الطرفين المفتوحين؛ هنا يتصل الحمل.'],[112,76,28,58,'السهم المنحني المزدوج: يمكن أن يدار المولد في الاتجاهين.'],[78,78,44,56,'المولد ⟦G⟧ (حرف مسطّر = تيار مستمر): يديره محرك أولي من الخارج.'],[196,84,74,28,'ملف المجال ⟦F1–F2⟧: ما زال يتغذى من بطارية خارجية (تغذية منفصلة).']]}),
   cap:'الشكل <span class="ltr">(5-3)</span> ص 104.<br><b>مرّر المؤشر على U والسهم والمولد والملف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي يلزم ليتولد جهد بين طرفي الخرج U؟',opts:[
     ['أن يُدار العضو الدوار وأن يتغذى ملف المجال',true,'موصل يتحرك في مجال مغناطيسي ← تتولد قوة دافعة (ص 102). بلا دوران أو بلا مجال لا يتولد جهد.'],
     ['تغذية المجال فقط',false,'المجال وحده بلا حركة لا يولّد جهداً.'],
     ['إدارة العضو الدوار فقط',false,'الحركة بلا مجال (مجال المولد منفصل التغذية من مصدره) لا تولّد جهداً.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ب) التشغيل كمولد:</b> الشكل ${FN('5-3')} يبين التشغيل كمولد.</p>`,ref:'ص 104'},
    {html:U5S.fig(box(F53().svg(),420),420,'<b>الشكل <span class="ltr">(5-3)</span> مولد تيار مستمر منفصل التغذية</b> (ص 104) — طرفا الخرج مفتوحان أعلى الرسم وبينهما <span class="ltr">U</span> (جهد الخرج)، ودائرة المجال مغذاة من بطارية. السهم المنحني المزدوج: يمكن أن يدار المولد في الاتجاهين.')},
    {tip:String.raw`<p>قارن (5-3) بـ (5-2أ): دائرة المجال كما هي تماماً. الذي تغير هو دائرة العضو الدوار: حلّ <b>طرفا الخرج U</b> محل البطارية، لأن العضو الدوار هنا <b>يُخرج</b> الطاقة الكهربائية بدل أن يأخذها.</p>`,title:'ما الذي تغيّر عن المحرك؟'},
    {title:'مختبر مصغّر: أدِر المولد',widget:(el,B)=>DCML.lab(el,B,{intro:'وصلنا مصباحاً بين طرفي الخرج (إضافة للتجربة). اختر اتجاه الإدارة وحالة المجال.',
     predict:{q:'المولد يدور والمصباح مضاء. أوقفنا تغذية المجال. ماذا يحدث للمصباح؟',opts:[
      ['يبقى مضاء لأن المولد ما زال يدور',false,'الدوران بلا مجال لا يولّد جهداً.'],
      ['ينطفئ',true,'بلا مجال لا يتولد جهد U، فلا يمر تيار في المصباح.'],
      ['يضيء أكثر',false,'لا يوجد ما يزيد الجهد.']]},
     ins:[{k:'dv',l:'اتجاه إدارة المولد',seg:[[1,'إلى اليمين'],[-1,'إلى اليسار'],[0,'متوقف']],v:1},{k:'qf',l:'تغذية المجال',seg:[[1,'موصولة'],[0,'مفصولة']],v:1}],
     calc:s=>{const U=s.dv*s.qf;
      return {pic:figSep({sw:1,gen:1,lamp:1,U,qa:1,qf:s.qf,aF:s.qf,rot:U?s.dv:0}).svg({cls:n=>n==='a'||n==='L'?(U?'flow':''):n==='f0'?(s.qf?'flow':'live'):n==='f'?(s.qf?'flow':''):''}),
       msg:!s.qf?'المجال بلا تغذية: لا يتولد جهد، والمصباح مطفأ.':!s.dv?'المجال مغذّى لكن المولد متوقف: لا يتولد جهد.':`يتولد جهد U والمصباح مضاء. المولد يدار <b>${DIRT(s.dv)}</b>؛ عند عكس اتجاه الإدارة تنعكس قطبية طرفي الخرج، ولهذا رسم الكتاب السهم المزدوج.`}}})}
   ]},

  {recap:[
   'المحرك يحوّل الطاقة الكهربائية إلى ميكانيكية، والمولد يحوّل الميكانيكية إلى كهربائية (ص 102).',
   'تُصنَّف آلات التيار المستمر حسب توصيل ملفات المجال: منفصلة التغذية، وذاتية التغذية (توالٍ، توازٍ، مركبة).',
   'في التغذية المنفصلة: دائرة العضو الدوار <span class="ltr">A1–A2</span> ودائرة المجال <span class="ltr">F1–F2</span> منفصلتان كهربياً، والمجال من مصدر خارجي.',
   'A1 موجب عند الدوران إلى اليمين وسالب عند الدوران إلى اليسار؛ ولعكس الاتجاه نعكس تياراً واحداً فقط (العضو الدوار أو المجال).',
   'في المولد يحل طرفا الخرج U محل بطارية العضو الدوار، ويمكن أن يدار في الاتجاهين.']}
],
 theory:[
  {h:'الوحدة الخامسة: مخططات دوائر توصيل الآلات الكهربائية',ref:'ص 100–101',html:`<p><b>الهدف العام للوحدة:</b> معرفة مخططات دوائر توصيل آلات التيار المستمر بأنواعها وآلات التيار المتردد ثلاثية الأوجه</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم الدائرة الكهربائية الممثلة لآلات التيار المستمر بأنواعها (منفصل التغذية – توالٍ – توازٍ – مركب).</li><li>أن يتمكن المتدرب من رسم الدائرة الكهربائية الممثلة لآلات التيار المتردد بأنواعها (تزامني – وحثي – وأحادي الوجه – وثلاثي الوجه).</li></ol>`},
  {h:'5-1 المقدمة',ref:'ص 102',html:`<p>تستخدم الآلات الكهربائية في تحويل الطاقة الكهربائية إلى طاقة ميكانيكية والعكس إذا كان التحويل من الطاقة الكهربائية إلى طاقة ميكانيكية تسمى الآلة <b>محركاً</b> و إذا كان التحويل من الطاقة الميكانيكية إلى طاقة كهربائية تسمى الآلة <b>مولداً</b>. وتصنف الآلات إلى آلات تيار مستمر وآلات تيار متردد وتصنف آلات التيار المتردد إلى آلات حثيه وآلات تزامنيه. عندما يتحرك موصل كهربائي موضوع عمودياً على اتجاه المجال المغناطيسي في اتجاه عمودي على ذلك المجال فإنه يتم توليد قوة دافعة كهربائية وهذه هي فكرة عمل مولد التيار المستمر. وأيضاً عندما يمر تيار مستمر خلال ذلك الموصل فإن ثمة قوة تؤثر على ذلك الموصل وهذه هي فكرة عمل محرك التيار المستمر. وتسمى هذه الأجهزة بآلات التيار المستمر.</p>
   <p>الآلات الحثية هي آلات التيار المتردد التي فيها يستقبل الملف الطاقة عند أحد الجوانب من الملف عند الجانب الآخر عن طريق الحث الكهرومغناطيسي. وهناك آلات حثيه ثلاثية الوجه وهي الأكثر استخداماً في الصناعة وأخرى أحادية الوجه تستخدم في آلات القدرة الصغيرة مثل الأجهزة المنزلية.</p>
   <p>أما بالنسبة للآلات التزامنية فهي آلات لها سرعة متزامنة مع المجال المغناطيسي الدوار في الثغرة الهوائية عند ظروف التشغيل في حالة الاستقرار تعرف بسرعة التزامن. المولدات التي تعمل في محطات توليد الكهرباء هي مولدات تزامنيه تدار بالسرعة التزامنية لتوليد جهد متغير بتردد ثابت. كما أن المولدات تصبح محركات تدور بالسرعة التزامنية عند التغذية بجهد متغير إلى لفائف عضو الإنتاج وعندئذ تعرف بالمحركات التزامنية.</p>`},
  {err:'جملة الآلات الحثية ناقصة في الكتاب (ص 102): «يستقبل الملف الطاقة عند أحد الجوانب من الملف عند الجانب الآخر». المقصود: يستقبل الملفُّ في أحد الجانبين الطاقةَ من الملف في الجانب الآخر عن طريق الحث الكهرومغناطيسي.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ترتيب هذه الوحدة: <b>آلات التيار المستمر</b> (منفصلة التغذية، توالٍ، توازٍ، مركبة — الدروس 1 إلى 4)، ثم <b>آلات التيار المتردد</b>: التزامنية (المولد التزامني — الدرسان 5 و6) والحثية (أحادية الوجه وثلاثية الأوجه — الدرسان 7 و8)، ثم تمارين الوحدة.'},
  {h:'5-2 آلات التيار المستمر',ref:'ص 102–103',html:`<p>يمكن لآلات التيار المستمر العمل كمولد أو محرك. في الوقت الحاضر استخدام المولد محدود نظراً لاستخدام مولدات التيار المتردد. لكن تستخدم محركات التيار المستمر بكثرة في الصناعة. وتتميز محركات التيار المستمر بإمكانية الحصول على نطاق واسع لتغير السرعة مع العزم بتوصيلات مختلفة لملفات المجال. تصنف آلات التيار المستمر وفقاً لتوصيلات ملفات المجال إلى <b>آلات منفصلة التغذية</b> و<b>آلات ذاتية التغذية</b> وتنقسم الآلات ذاتية التغذية إلى <b>آلات توالٍ</b> و<b>آلات توازٍ</b> و<b>آلات مركبة</b>. الشكل ${FN('5-1')} يبين تركيب آلات التيار المستمر.</p>`},
  {fig:FN('5-1'),ref:'ص 103',caption:'تركيب آلات التيار المستمر — في الوسط مقطع الآلة: (1) ملفات العضو الثابت، (2) الأقطاب، (3) ملفات العضو الدائر. يساراً رمز <b>محرك تيار مستمر</b> (M مسطّر) وبجانبه رمز ملف المجال، ويميناً رمز <b>مولد تيار مستمر</b> (G مسطّر).',draw:()=>box(fig51().svg(),560)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الخط تحت الحرف M أو G في الرمز يعني أن الآلة تعمل بالتيار المستمر، والمستطيلان الصغيران أعلى الدائرة وأسفلها هما الفرشتان.'},
  {h:'5-2-1 مخطط توصيل آلات التيار المستمر المنفصل التغذية',ref:'ص 103',html:`<p>في التغذية المنفصلة الطاقة التي تستعمل لتوليد المجال المغناطيسي تؤخذ من مصدر تيار يقع خارج الآلة كما أن ملف العضو الدوار وملفات التغذية (المجال) منفصلة كهربياً.</p>
   <p><b>أ) التشغيل كمحرك:</b> إذا دار العضو الدوار إلى اليمين فإن <b>${LT('A1')}</b> يكون طرف التوصيل الموجب و إذا دار العضو الدوار إلى اليسار فإن <b>${LT('A1')}</b> يكون طرف التوصيل السالب. الشكل ${FN('5-2')} يبين التشغيل كمحرك.</p>`},
  {err:'كتب الكتاب (ص 103) «الشكل (٤- ٢)» والصحيح الشكل (5-2).'},
  {fig:FN('5-2أ'),ref:'ص 103',caption:'محرك تيار مستمر منفصل التغذية دوران العضو إلى اليمين — دائرتان مستقلتان: دائرة العضو الدوار (بطارية، A1، A2) ودائرة المجال (بطارية، F1، F2، ملف المجال). السهم المستقيم بجانب المحرك = اتجاه تيار العضو الدوار، والسهم تحت الملف = اتجاه تيار المجال، والسهم المنحني = اتجاه الدوران.',draw:()=>box(F52A().svg(),420)},
  {fig:FN('5-2ب'),ref:'ص 104',caption:'محرك تيار مستمر منفصل التغذية دوران إلى اليسار — عُكست قطبية بطارية العضو الدوار فقط، فأصبح A1 سالباً.',draw:()=>bkFig('u5a','سهم المجال في الشكل:',F52B_book().svg(),F52B_fix().svg(),420,'المصحح: قطبية بطارية المجال لم تتغير بين (5-2أ) و(5-2ب)، فتيار المجال لم يتغير اتجاهه، ويبقى سهمه إلى اليسار كما في (5-2أ). الكتاب رسمه إلى اليمين.')},
  {err:'<span class="fixnote">في الشكل (5-2ب) ص 104 بقيت بطارية المجال كما هي («-» يساراً و«+» يميناً) ومع ذلك رُسم سهم تيار المجال إلى اليمين (معكوساً عن (5-2أ)). لو انعكس المجال والعضو الدوار معاً لما تغير اتجاه الدوران؛ الذي عُكس فعلاً هو العضو الدوار وحده، فسهم المجال الصحيح إلى اليسار. استخدم المفتاح فوق الرسم للمقارنة.</span>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لعكس اتجاه دوران محرك التيار المستمر نعكس <b>أحد</b> التيارين فقط: تيار العضو الدوار (تبديل A1 و A2) <b>أو</b> تيار المجال (تبديل F1 و F2). إذا عكسناهما معاً بقي الاتجاه كما هو. جرّب ذلك في تبويب «المختبر».'},
  {h:'ب) التشغيل كمولد',ref:'ص 104',html:`<p>الشكل ${FN('5-3')} يبين التشغيل كمولد.</p>`},
  {fig:FN('5-3'),ref:'ص 104',caption:'مولد تيار مستمر منفصل التغذية — طرفا الخرج مفتوحان أعلى الرسم وبينهما <span class="ltr">U</span> (جهد الخرج)، ودائرة المجال مغذاة من بطارية. السهم المنحني المزدوج: يمكن أن يدار المولد في الاتجاهين.',draw:()=>box(F53().svg(),420)}
 ],
 lab:(el)=>labSep(el),
 examples:[
  drawEx({title:'رسم الشكل (5-2أ) خطوة بخطوة',ref:'ص 103',scene:figSep({steps:1,aA:1,aF:1,rot:1}),mw:420,
   q:'<p>ارسم مخطط توصيل محرك تيار مستمر منفصل التغذية يدور إلى اليمين (الشكل (5-2أ)).</p>',
   steps:['ارسم بطارية العضو الدوار أعلى يسار الورقة: اللوح القصير السميك (−) يساراً واللوح الطويل (+) يميناً.',
    'صِل القطب الموجب بخط رأسي إلى الفرشاة العلوية <b>A1</b> لرمز المحرك (دائرة فيها M مسطّر)، ثم صِل الفرشاة السفلية <b>A2</b> بخط ينزل ثم يتجه يساراً ويصعد إلى القطب السالب. هذه دائرة العضو الدوار.',
    'ارسم بطارية ثانية مستقلة على اليمين لدائرة المجال (− يساراً، + يميناً).',
    'انزل من طرفي البطارية بخطين رأسيين إلى الطرفين <b>F1</b> (يساراً) و <b>F2</b> (يميناً)، وارسم ملف المجال مستطيلاً مصمتاً يصل بينهما.',
    'أضف الأسهم: سهم تيار العضو الدوار بجانب المحرك إلى أسفل (من A1 إلى A2)، وسهم تيار المجال تحت الملف إلى اليسار (يخرج التيار من القطب الموجب)، وسهم الدوران المنحني مع عقارب الساعة.']}),
  drawEx({title:'من (5-2أ) إلى (5-2ب): ماذا نغيّر لعكس الاتجاه؟',ref:'ص 104',scene:figSep({steps:1,ra:1,aA:-1,aF:1,rot:-1}),mw:420,
   q:'<p>ارسم المحرك نفسه وهو يدور إلى اليسار بتغيير دائرة العضو الدوار فقط.</p>',
   steps:['اقلب بطارية العضو الدوار: + يساراً و − يميناً.','يبقى توصيل A1 و A2 كما هو، لكن A1 أصبح الآن متصلاً بالقطب <b>السالب</b>.','دائرة المجال لا تتغير: البطارية كما هي.','F1 و F2 والملف كما هي.',
    'الأسهم: سهم تيار العضو الدوار ينقلب إلى أعلى، وسهم الدوران عكس عقارب الساعة، أما سهم المجال فيبقى إلى اليسار (انظر الملاحظة على الشكل (5-2ب) في الشرح).']})
 ],
 quiz:[
  {q:'تسمى الآلة الكهربائية «محركاً» عندما:',o:['تحوّل الطاقة الميكانيكية إلى كهربائية','تحوّل الطاقة الكهربائية إلى ميكانيكية','ترفع الجهد','تعمل بالتيار المتردد فقط'],c:1,e:'«إذا كان التحويل من الطاقة الكهربائية إلى طاقة ميكانيكية تسمى الآلة محركاً» (ص 102).'},
  {q:'كيف تصنف آلات التيار المستمر؟',o:['حثية وتزامنية','وفق توصيلات ملفات المجال: منفصلة التغذية وذاتية التغذية','أحادية وثلاثية الوجه','قفص سنجابي وحلقات انزلاق'],c:1,e:'(ص 102–103)؛ وذاتية التغذية: توالٍ وتوازٍ ومركبة.'},
  {q:'في الآلة منفصلة التغذية، دائرة المجال:',o:['على التوالي مع العضو الدوار','على التوازي مع العضو الدوار','منفصلة كهربياً وتتغذى من مصدر خارج الآلة','غير موجودة'],c:2,e:'(ص 103).'},
  {q:'محرك منفصل التغذية يدور إلى اليمين (كما في الشكل 5-2أ). ما قطبية الطرف A1؟',o:['موجب','سالب','لا قطبية له','يتغير باستمرار'],c:0,e:'«إذا دار العضو الدوار إلى اليمين فإن A1 يكون طرف التوصيل الموجب» (ص 103).'},
  {q:'عكسنا قطبية العضو الدوار والمجال معاً. ماذا يحدث لاتجاه الدوران؟',o:['ينعكس','لا يتغير','يتوقف المحرك','يتضاعف'],c:1,e:'عكس أحدهما فقط يعكس الاتجاه؛ عكسهما معاً يُبقيه كما هو (توضيح، وجرّبه في المختبر).'},
  {q:'ماذا يعني السهم المنحني المزدوج في الشكل (5-3)؟',o:['أن المولد معطل','أن المولد يمكن أن يدار في الاتجاهين','أن الجهد متردد','أن هناك مصدرين'],c:1,e:'في وضع المولد يدار العضو الدوار من الخارج، ويمكن إدارته في أي اتجاه.'}
 ]
});

/* =====================================================================
   مخطط خطي (أحادي الخط): عناصر تُرسم من أعلى إلى أسفل على خط رأسي واحد
   ['bar',عنوان] ['w',طول] ['n',عدد,شرطات] ['fuse',اسم] ['sw',اسم,'h'|'b'] ['prot'] ['M',سطر1,سطر2,dc] ['G',سطر1,سطر2]
   ===================================================================== */
function sld(S,x,y,items){for(const it of items){const [k,a,b,c]=it;
  if(k==='bar'){S.add(`<path d="M${x-26} ${y}H${x+26}" style="stroke:var(--fg);stroke-width:2"/>`);dot(S,x,y);txt(S,x,y-7,a,{sz:10})}
  else if(k==='w'){wire(S,[[x,y],[x,y+a]]);y+=a}
  else if(k==='n'){const m=b||1;wire(S,[[x,y],[x,y+20]]);for(let i=0;i<m;i++)S.add(`<path d="M${x-6} ${y+10+(i-(m-1)/2)*6+5}L${x+6} ${y+10+(i-(m-1)/2)*6-5}" style="${SK}"/>`);if(a!=null)txt(S,x+10,y+12,String(a),{a:'start',sz:10});y+=20}
  else if(k==='fuse'){wire(S,[[x,y],[x,y+4]]);fuse(S,x,y+15);if(a)txt(S,x-9,y+19,a,{a:'end',sz:10});wire(S,[[x,y+26],[x,y+30]]);y+=30}
  else if(k==='sw'){wire(S,[[x,y],[x,y+6]]);cont(S,x,y+6,y+28,false);qlink(S,x-24,x-8,y+17,b||'h',a);wire(S,[[x,y+28],[x,y+32]]);y+=32}
  else if(k==='prot'){wire(S,[[x,y],[x,y+44]]);thermSym(S,x-26,y+12);magSym(S,x-26,y+33);S.add(`<path d="M${x-17} ${y+12}H${x-4}M${x-17} ${y+33}H${x-4}" style="stroke:var(--fg);stroke-width:1;stroke-dasharray:2 2"/>`);y+=44}
  else if(k==='M'||k==='G'){if(c){dcm(S,x,y+24,k==='G'?'G':'M');if(a)txt(S,x+22,y+28,a,{a:'start',sz:10});y+=48}else{acm(S,x,y+20,19,a||k,b,{dbl:k==='G'});y+=40}}
 }return y}

/* =====================================================================
   لوحات أطراف آلات التيار المستمر (الأشكال 5-5، 5-9، 5-10، 5-12) — رسم مشترك للشرح والمختبر
   cfg: {W,H,label,top:'fuse'|'ms',terms:[[اسم,x,y,موضع]],pe:[x,y],plate:[x,y,w,h],box:[x,y,w,h],
         r2(start), r4:{طرف:(start)=>pts}, inner(S,st,o), arrows(S,info), els:[...]}
   ===================================================================== */
function msTop(S,st){const on=st.on&&!st.trip;
  wire(S,[[60,20],[300,20]],'Lp');wire(S,[[60,32],[300,32]],'Lm');txt(S,56,24,'L+',{a:'end'});txt(S,56,36,'L-',{a:'end'});txt(S,180,12,'220v Dc');
  dot(S,120,20);dot(S,215,32);wire(S,[[120,20],[120,54]],'Lp');
  S.add(`<path d="M150 54V48H180V54" style="${SK};stroke-width:2"/>`);
  protSw(S,[120,150,180],66,{on,nets:['pl1','pl2','pl3']});
  wire(S,[[215,32],[215,176],[180,176],[180,162]],'wl');
  return {s2:[120,162],s4:[150,162]}}
function boardFig(cfg,st,o){o=o||{};const S=Sc(cfg.W,cfg.H,cfg.label),k=n=>o.steps?n:0;
  S.at(k(1));let s2,s4;
  if(cfg.top==='fuse'){dcSupply(S,130,210,30,{on:st.on,blownL:st.blown,blownR:st.blown,nets:{Lp:'Lp',Lm:'Lm',fl:'fu1',fr:'fu2',ql:'q1a',qr:'q1b'}});s2=[130,180];s4=[210,180]}
  else{const r=msTop(S,st);s2=r.s2;s4=r.s4}
  if(o.sld)o.sld(S,k);
  S.at(k(3));cfg.inner(S,st,o);
  S.at(k(2));const [bx,by,bw,bh]=cfg.box,[px,py,pw,ph]=cfg.plate;frame(S,bx,by,bw,bh);
  S.add(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:${DA.pe}"/>`);
  if(cfg.pe){const [ex,ey]=cfg.pe;term(S,ex,ey);txt(S,ex+6,ey-7,'PE',{a:'start',sz:9.5});gnd(S,ex,ey+3);if(o.peLine)wire(S,[[ex,ey-3],...o.peLine],null,'pe')}
  terms(S,cfg.terms,{click:o.click,sel:st.sel});
  S.at(k(4));wire(S,cfg.r2(s2),'w2');wire(S,cfg.r4[st.l4||cfg.l4def](s4),'w4');
  S.at(k(5));const pos=n=>{const t=cfg.terms.find(q=>q[0]===n);return [t[1],t[2]]};
  (st.j||[]).forEach(key=>{const [a,b]=key.split('|');jump(S,pos(a),pos(b),{id:o.click?key:null,net:'j:'+key,side:cfg.jside||1})});
  S.at(k(6));if(o.arr)cfg.arrows(S,o.arr);
  return S}
/* عناصر الحلّال لدائرة اللوحة الحالية */
function boardEls(cfg,st){const E=[],sw=1e-3;
  if(cfg.top==='fuse'){if(!st.blown){E.push({id:'fu1',a:'Lp',b:'p1',R:sw},{id:'fu2',a:'n1',b:'Lm',R:sw})}if(st.on){E.push({id:'q1a',a:'p1',b:'P',R:sw},{id:'q1b',a:'N',b:'n1',R:sw})}
    E.push({id:'w2',a:'P',b:cfg.land2,R:sw},{id:'w4',a:'N',b:st.l4||cfg.l4def,R:sw})}
  else{const on=st.on&&!st.trip;if(on)E.push({id:'pl1',a:'Lp',b:'t2',R:sw},{id:'pl2',a:'t4',b:'t3',R:sw},{id:'pl3',a:'t5',b:'t6',R:sw});
    E.push({id:'br',a:'t3',b:'t5',R:sw},{id:'wl',a:'t6',b:'Lm',R:sw},{id:'w2',a:'t2',b:cfg.land2,R:sw},{id:'w4',a:'t4',b:st.l4||cfg.l4def,R:sw})}
  cfg.els.forEach(e=>{if(chF('open:'+e.id))return;const x=Object.assign({},e);if(chF('rev:'+e.id)){x.a=e.b;x.b=e.a}E.push(x)});
  if(chF('gshort'))E.push({id:'chs',a:cfg.land2,b:cfg.l4def,R:1e-3});
  (st.j||[]).forEach(key=>{const [a,b]=key.split('|');E.push({id:'j:'+key,a,b,R:sw})});
  if(st.fault)E.push({id:'fault',a:cfg.fault[0],b:cfg.fault[1],R:sw});
  return E}
function evalBoard(cfg,st){const els=boardEls(cfg,st),r=solve(els,'Lp','Lm'),rs=reach(els,['Lp','Lm']);
  const live=new Set(els.filter(e=>rs.has(e.a)||rs.has(e.b)).map(e=>e.id));
  const cls=n=>n==='Lp'||n==='Lm'?(Math.abs(r.Is)>1e-4?'flow':'live'):r.I[n]!=null&&Math.abs(r.I[n])>1e-4?'flow':live.has(n)?'live':'';
  return {I:r.I,Is:r.Is,cls,short:Math.abs(r.Is)>20}}

/* ---------- محرك التوالي: الشكل (5-5) ---------- */
const SER={W:350,H:420,label:'محرك تيار مستمر توالٍ — لوحة الأطراف',top:'fuse',land2:'A1',l4def:'D2',
  box:[64,204,262,212],plate:[78,214,234,40],pe:[296,234],
  terms:[['A1',100,232],['D2',155,232],['D1',210,232],['A2',265,232]],
  r2:s=>[s,[130,198],[100,198],[100,229]],r4:{D2:s=>[s,[210,192],[155,192],[155,229]],D1:s=>[s,[210,229]]},
  els:[{id:'arm',a:'A1',b:'A2',R:1},{id:'ser',a:'D1',b:'D2',R:.5}],fault:['A1','A2'],
  inner(S){wire(S,[[100,236],[100,326]],'arm');wire(S,[[100,374],[100,400],[265,400],[265,236]],'arm');dcm(S,100,350,'M',{rot:1,net:'arm'});
    wire(S,[[155,236],[155,312],[170,312],[170,339]],'ser');wire(S,[[210,236],[210,300],[230,300],[230,339]],'ser');coil(S,200,345,60,12,'ser');},
  arrows(S,a){if(a.a)arrow(S,76,a.a>0?336:364,76,a.a>0?364:336);if(a.f)arrow(S,a.f>0?226:174,368,a.f>0?174:226,368);if(a.rot)rotArr(S,100,350,27,a.rot)}};
/* ---------- محرك التوازي: الشكلان (5-9) و(5-10) ---------- */
const SHU_base={W:350,H:420,label:'محرك تيار مستمر توازٍ — لوحة الأطراف',land2:'A1',l4def:'A2',
  box:[64,204,262,212],plate:[78,212,234,56],pe:[298,240],
  terms:[['A1',110,226],['E1',210,226],['E2',150,252,'b'],['A2',250,252,'b']],
  r4:{A2:s=>[s,[s[0],s[1]+(s[1]>170?12:26)],[282,s[1]+(s[1]>170?12:26)],[282,252],[254,252]]},
  els:[{id:'arm',a:'A1',b:'A2',R:1},{id:'sh',a:'E1',b:'E2',R:20}],fault:['A1','A2'],
  inner(S){wire(S,[[110,230],[110,326]],'arm');wire(S,[[110,374],[110,400],[250,400],[250,256]],'arm');dcm(S,110,350,'M',{rot:1,net:'arm'});
    wire(S,[[214,230],[214,300],[220,300],[220,339]],'sh');wire(S,[[150,256],[150,300],[160,300],[160,339]],'sh');coil(S,190,345,60,12,'sh')},
  arrows(S,a){if(a.a)arrow(S,86,a.a>0?336:364,86,a.a>0?364:336);if(a.f)arrow(S,a.f>0?216:164,368,a.f>0?164:216,368);if(a.rot)rotArr(S,110,350,27,a.rot)}};
const SHU=Object.assign({},SHU_base,{top:'fuse',r2:s=>[s,[130,198],[110,198],[110,223]]});
const SHUms=Object.assign({},SHU_base,{top:'ms',r2:s=>[s,[120,196],[110,196],[110,223]]});
/* ---------- المحرك المركب: الشكل (5-12) (أعيد رسمه بالتوصيل القياسي — انظر الملاحظة) ---------- */
const CMP={W:350,H:462,label:'محرك تيار مستمر مركب — لوحة الأطراف',top:'fuse',land2:'E2',l4def:'E1',
  box:[64,204,262,252],plate:[84,212,214,54],pe:[312,240],
  terms:[['E2',120,226],['A1',190,226],['E1',260,226],['D2',120,252,'b'],['D1',190,252,'b'],['2B2',260,252,'b']],
  r2:s=>[s,[130,198],[120,198],[120,223]],r4:{E1:s=>[s,[210,192],[260,192],[260,223]]},
  els:[{id:'arm',a:'A1',b:'2B2',R:1},{id:'ser',a:'D1',b:'D2',R:.5},{id:'sh',a:'E1',b:'E2',R:20}],fault:['E2','E1'],
  inner(S){wire(S,[[190,226],[208,244],[208,300],[230,300],[230,326]],'arm');wire(S,[[230,374],[230,398],[268,398],[268,262],[260,252]],'arm');dcm(S,230,350,'M',{rot:1,net:'arm'});
    wire(S,[[120,252],[120,339]],'ser');wire(S,[[190,252],[182,262],[182,320],[170,320],[170,339]],'ser');coil(S,145,345,50,12,'ser');
    wire(S,[[120,226],[110,240],[110,432],[159,432]],'sh');wire(S,[[260,226],[278,240],[278,432],[229,432]],'sh');coil(S,194,432,70,12,'sh');},
  arrows(S,a){if(a.a)arrow(S,206,a.a>0?336:364,206,a.a>0?364:336);if(a.f)arrow(S,a.f>0?165:125,366,a.f>0?125:165,366);if(a.f2)arrow(S,a.f2>0?220:168,452,a.f2>0?168:220,452);if(a.rot)rotArr(S,230,350,27,a.rot)}};
/* أسهم من التيارات المحسوبة */
const arrFrom=(I,st,kind)=>{const a=sgn(I.arm),s=sgn(I.ser||0),h=sgn(I.sh||0);
  if(kind==='ser')return {a,f:s,rot:a&&s?a*s:0};if(kind==='shu')return {a,f:h,rot:a&&h?a*h:0};
  const fd=s||h;return {a,f:s,f2:h,rot:a&&fd&&!(s&&h&&s!==h)?a*fd:0}};
const staticBoard=(cfg,st,kind,o)=>{const ev=evalBoard(cfg,Object.assign({on:1},st));return boardFig(cfg,Object.assign({on:0},st),Object.assign({arr:arrFrom(ev.I,st,kind)},o||{}))};

/* =====================================================================
   مختبر عام للوحات أطراف التيار المستمر
   ===================================================================== */
function dcBoardLab(el,cfg,L){
  const st={on:0,l4:cfg.l4def,j:(L.start||[]).slice(),sel:null,blown:0,trip:'',over:0,fault:0,heat:0,load:1};
  const w={d:0,kind:'',j:st.j,on:0,runaway:0,blown:0,trip:'',l4:st.l4,pres:{}};
  const $=shell(el,{title:L.title,ref:L.ref,mw:400,figT:'الدائرة',figNote:'<b>لوضع قنطرة:</b> اضغط طرفاً على اللوحة ثم طرفاً آخر. <b>لإزالتها:</b> اضغط القنطرة نفسها.'+(L.figNote?' '+L.figNote:''),tries:L.tries,after:L.after});
  const sp=spinner(el);
  $('#ctl').innerHTML=`${swHTML('sQ','Q1',cfg.top==='ms'?'مفتاح وقاية المحرك':'المفتاح الرئيس',0)}
   ${L.presets.map(p=>`<button class="btn" data-pr="${p.k}">${p.label}</button>`).join('')}<button class="btn" data-pr="clr">إزالة كل القناطر</button>
   ${L.land?`<div><div class="sub">السلك 4 يصل إلى</div>${segHTML('l4',L.land.map(t=>[t,t]),st.l4)}</div>`:''}
   ${L.series?swHTML('sLd','حمل','حمل على عمود المحرك',1):''}
   ${cfg.top==='fuse'?'<button class="btn" id="bFu" disabled>استبدل المصهرين</button>':`${swHTML('sOv','حمل زائد','زيادة الحمل الميكانيكي',0)}${swHTML('sFl','قصر','قصر عند أطراف المحرك',0)}`}`;
  let ev=null,res=null,msg2='';
  const compute=()=>{ev=evalBoard(cfg,st);
    if(ev.short&&(st.on&&!st.blown&&!st.trip)){if(cfg.top==='fuse'){st.blown=1;msg2='<b>قصر في الدائرة:</b> احترق المصهران F1,2 فانقطع التيار. أصلح التوصيل ثم «استبدل المصهرين».'}else{st.trip='mag';msg2='<b>قصر:</b> فصل المرحل المغناطيسي «I>» في مفتاح الوقاية <b>فوراً</b>. أزل القصر ثم أعد تشغيل Q1.'}ev=evalBoard(cfg,st)}
    res=L.classify(ev.I,st);w.d=res.d;w.kind=res.kind;w.on=st.on&&!st.trip;w.blown=st.blown;w.trip=st.trip;w.l4=st.l4;w.j=st.j;w.load=st.load;w.fault=st.fault;w.over=st.over};
  const render=()=>{compute();
    $('#fig').innerHTML=boardFig(cfg,st,{click:1,arr:arrFrom(ev.I,st,L.kind),peLine:null}).svg({cls:ev.cls});
    $('#sQ').setAttribute('aria-pressed',String(!!(st.on&&!st.trip)));
    el.querySelectorAll('[data-l4]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l4===st.l4)));
    const bf=$('#bFu');if(bf)bf.disabled=!st.blown;
    if($('#sOv'))$('#sOv').setAttribute('aria-pressed',String(!!st.over));if($('#sFl'))$('#sFl').setAttribute('aria-pressed',String(!!st.fault));if($('#sLd'))$('#sLd').setAttribute('aria-pressed',String(!!st.load));
    reads();
    $('#say').innerHTML=(msg2?msg2+'<br>':'')+res.msg};
  const reads=()=>{const chip=(t,c)=>`<em class="mode-chip ${c||''}">${t}</em>`,run=w.d&&sp.sp;
    $('#rd').innerHTML=`<div class="read"><span>اتجاه الدوران</span>${chip(DIRT(w.d),w.d>0?'run':w.d<0?'rev':'')}</div><div class="read"><span>نوع التوصيل الحاصل</span>${chip(w.kind||'—',w.kind?'star':'')}</div>`+
      `<div class="read"><span>السرعة (نوعياً)</span><b>${speedBar(sp.sp,3,w.runaway)}</b></div>`+(cfg.top==='ms'?`<div class="read"><span>حرارة المرحل الحراري</span><b>${speedBar(st.heat,1,st.heat>0.7)}</b></div><div class="read"><span>حالة Q1</span>${chip(st.trip==='mag'?'فصل مغناطيسي':st.trip==='th'?'فصل حراري':st.on?'مغلق':'مفتوح',st.trip?'trip':st.on?'run':'')}</div>`:`<div class="read"><span>المصهران</span>${chip(st.blown?'محترقان':'سليمان',st.blown?'trip':'')}</div>`);void run};
  const pres=k=>{if(k==='clr'){st.j=[];return}const p=L.presets.find(q=>q.k===k);st.j=p.j.slice();if(p.l4)st.l4=p.l4;w.pres[k]=1};
  el.addEventListener('click',e=>{const t=e.target.closest('button,[data-t],[data-j]');if(!t||!el.contains(t))return;msg2='';
    if(t.dataset.t){const n=t.dataset.t;if(!st.sel)st.sel=n;else if(st.sel===n)st.sel=null;else{const key=[st.sel,n].sort().join('|');const i=st.j.indexOf(key);if(i>=0)st.j.splice(i,1);else st.j.push(key);st.sel=null}}
    else if(t.dataset.j){const i=st.j.indexOf(t.dataset.j);if(i>=0)st.j.splice(i,1)}
    else if(t.dataset.pr)pres(t.dataset.pr);
    else if(t.dataset.l4)st.l4=t.dataset.l4;
    else if(t.id==='sQ'){if(st.trip){if(st.trip==='th'&&st.heat>0.35){msg2='المرحل الحراري ما زال ساخناً؛ انتظر قليلاً ثم أعد التشغيل.';render();return}st.trip='';st.on=1}else st.on^=1}
    else if(t.id==='bFu')st.blown=0;
    else if(t.id==='sOv')st.over^=1;else if(t.id==='sFl')st.fault^=1;else if(t.id==='sLd')st.load^=1;
    else return;render();G.check()});
  const G=stepsUI($('#gs'),L.steps,()=>w);
  render();let acc=0;
  loopOn(el,dt=>{w.runaway=L.series&&w.d&&!st.load?1:0;
    if(cfg.top==='ms'){const run=st.on&&!st.trip&&w.d;if(st.over&&run){st.heat=Math.min(1,st.heat+dt/3);if(st.heat>=1){st.trip='th';msg2='<b>حمل زائد:</b> سخن المرحل الحراري فـ<b>فصل بعد مدة</b> (لا فوراً كالمغناطيسي). أزل الحمل الزائد وانتظر حتى يبرد ثم أعد تشغيل Q1.';render();G.check()}}else st.heat=Math.max(0,st.heat-dt/4)}
    sp.tick(dt,w.d*(w.runaway?3:1),w.runaway?2.5:0.5);acc+=dt;if(acc>0.15){acc=0;reads();G.check()}})}

/* ---------- رسوم المبدأ (5-4) و(5-7) لمحرك/مولد التوالي ---------- */
function figSerP(o){o=o||{};const S=Sc(240,170,'محرك تيار مستمر توالٍ'),mx=70,my=82;
  if(o.gen){term(S,40,14);if(o.rev)term(S,190,14);txt(S,82,22,'U',{sz:13});wire(S,[[40,17],[40,24],[mx,24],[mx,58]]);}
  else{txt(S,mx,10,'+',{sz:14});wire(S,[[mx,14],[mx,58]])}
  dcm(S,mx,my,o.gen?'G':'M');txt(S,mx-12,my-22,'A1',{a:'end',sz:11});txt(S,mx-12,my+30,'A2',{a:'end',sz:11});
  coil(S,150,my,56,12);txt(S,118,my-11,'D2',{a:'end',sz:11});txt(S,182,my-11,'D1',{a:'start',sz:11});
  if(!o.rev){if(o.gen)term(S,124,14);else txt(S,124,10,'-',{sz:14});wire(S,[[124,o.gen?17:14],[124,my-6]]);wire(S,[[178,my+6],[178,134],[mx,134],[mx,my+24]])}
  else{if(!o.gen)txt(S,190,10,'-',{sz:14});wire(S,[[190,o.gen?17:14],[190,40],[178,40],[178,my-6]]);wire(S,[[122,my+6],[122,134],[mx,134],[mx,my+24]])}
  if(o.aA)arrow(S,46,o.aA>0?my-13:my+13,46,o.aA>0?my+13:my-13);
  if(o.aF)arrow(S,o.aF>0?172:128,my+20,o.aF>0?128:172,my+20);
  if(o.rot)rotArr(S,mx,my,27,o.rot);
  return S}
/* ---------- رسوم المبدأ (5-8) و(5-11) لمحرك/مولد التوازي. o.lbl: علامتا القطبية ['+','-'] على الخط الأيسر/خط A1 ---------- */
function figShuP(o){o=o||{};const S=Sc(250,170,'محرك تيار مستمر توازٍ'),mx=110,my=86;
  if(o.gen){term(S,40,14);term(S,mx,14);txt(S,75,22,'U',{sz:13})}else{txt(S,40,10,o.lbl[0],{sz:14});txt(S,mx,10,o.lbl[1],{sz:14})}
  wire(S,[[40,o.gen?17:14],[40,140],[o.rev?192:150,140]]);dot(S,mx,140);
  wire(S,[[mx,o.gen?17:14],[mx,my-24]]);dot(S,mx,40);wire(S,[[mx,40],[o.rev?150:200,40],[o.rev?150:200,my-6]]);
  dcm(S,mx,my,o.gen?'G':'M');txt(S,mx-12,my-22,'A1',{a:'end',sz:11});txt(S,mx-12,my+30,'A2',{a:'end',sz:11});wire(S,[[mx,my+24],[mx,140]]);
  coil(S,175,my,52,12);txt(S,146,my+22,'E2',{a:'end',sz:11});txt(S,204,my+22,'E1',{a:'start',sz:11});
  if(!o.rev)wire(S,[[150,my+6],[150,140]]);else wire(S,[[200,my+6],[200,140],[192,140]]);
  if(o.aA)arrow(S,86,o.aA>0?my-13:my+13,86,o.aA>0?my+13:my-13);
  if(o.aF)arrow(S,o.aF>0?196:154,my-16,o.aF>0?154:196,my-16);
  if(o.rot)rotArr(S,mx,my,27,o.rot);
  return S}

/* =====================================================================
   الدرس 2 — آلات التيار المستمر توالٍ
   ===================================================================== */
const sldSer=(S,k)=>{S.at(k(1));txt(S,400,14,'220v-',{sz:10});sld(S,400,22,[['bar',''],['n',3,2],['fuse','F1,2'],['n',3,2],['sw','Q1','h'],['n',3,2],['M','M1','',1]])};
B.lesson({
 id:'u5-l2',unit:5,order:2,pages:'104–107',
 title:'آلات التيار المستمر توالٍ',
 summary:'مخطط توصيل محرك التوالي ودوران إلى اليمين أو اليسار بعكس أطراف ملف المجال، والجمع بين مسار التيار ومخطط التوصيلات على لوحة الأطراف، ومولد التوالي.',
 stations:[
  {intro:true},
{st:1,short:'التوصيل توالٍ',title:'5-2-2 مخطط توصيل آلات التيار المستمر توالٍ',ref:'ص 104',
   q:'تيار واحد يمر في العضو الدوار ثم في ملف المجال… ماذا يحدث للمجال إذا كبر تيار المحرك؟',
   art:U5S.art({S:figSerP({}),vb:[20,0,200,150],label:'مبدأ محرك التوالي: ملف المجال على التوالي مع العضو الدوار',bg:'#FBE6C4',title:'مسار واحد للتيار',
    tips:[[58,0,24,18,'القطب الموجب للمصدر: يدخل منه التيار إلى ⟦A1⟧.'],[112,0,24,18,'القطب السالب للمصدر: يعود إليه التيار من ملف المجال.'],[48,56,44,54,'العضو الدوار ⟦A1–A2⟧ (حرف M مسطّر = تيار مستمر).'],[120,72,62,22,'ملف مجال التوالي ⟦D1–D2⟧: سميك قليل اللفات، لأن تيار المحرك كله يمر فيه.'],[66,126,118,16,'السلك من ⟦A2⟧ إلى ملف المجال: هو الذي يضع المجال على التوالي مع العضو الدوار.']]}),
   cap:'رسم مبدأ محرك التوالي (الشكل <span class="ltr">(5-4)</span> بلا أسهم).<br><b>مرّر المؤشر على القطبين والملفين والسلك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في محرك التوالي، كم مساراً يسلكه التيار بين القطبين + و −؟',opts:[
     ['مساران: واحد للعضو الدوار وواحد للمجال',false,'هذا توصيل التوازي (الدرس 3).'],
     ['مسار واحد يمر في العضو الدوار ثم في ملف المجال',true,'«تقع دائرة المجال على التوالٍ مع دائرة العضو الدوار» (ص 104): التيار نفسه يمر في الاثنين.'],
     ['لا مسار، لأن المجال من مصدر منفصل',false,'المصدر المنفصل للمجال في الآلة منفصلة التغذية (الدرس 1).']]}}
   ],
   body:[
    {book:String.raw`<p>في توصيل آلات التيار المستمر توالٍ تقع دائرة المجال على التوالٍ مع دائرة العضو الدوار.</p>`,ref:'ص 104'},
    {tip:String.raw`<p>«على التوالي» = على طريق واحد: التيار الذي يخرج من <span class="ltr">A2</span> يدخل ملف المجال مباشرة. لذلك تيار المجال هنا = تيار العضو الدوار، وكلما زاد حمل المحرك زاد التيار فقوي المجال.</p><p>أطراف ملف مجال التوالي يرمز لها <span class="ltr">D1–D2</span>، وأطراف العضو الدوار <span class="ltr">A1–A2</span>.</p>`,title:'ماذا يعني «توالٍ» هنا؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['في آلة التوالي يمر في ملف المجال التيار نفسه الذي يمر في العضو الدوار.',true,'لأن الدائرتين على التوالي، أي على مسار واحد (ص 104).'],
     ['يرمز لطرفي ملف مجال التوالي بالرمزين E1 و E2.',false,'E1–E2 لملف التوازي. ملف التوالي D1–D2.'],
     ['آلة التوالي من الآلات ذاتية التغذية.',true,'المجال يأخذ تياره من دائرة الآلة نفسها، لا من مصدر خارجي (ص 103).']]})}
   ]},

  {st:2,short:'التشغيل كمحرك',title:'أ) التشغيل كمحرك',ref:'ص 104–105',
   q:'محرك التوالي يدور بقوة تحت الحمل… فلماذا يمنع الكتاب تشغيله بلا حمل؟',
   art:U5S.art({S:figSerP({aA:1,aF:1,rot:1}),vb:[20,0,200,150],label:'الشكل (5-4أ) محرك توالٍ يدور إلى اليمين مع أسهمه',bg:'#DDEFE6',title:'دوران إلى اليمين',
    tips:[[34,62,22,40,'سهم تيار العضو الدوار: إلى أسفل، من ⟦A1⟧ إلى ⟦A2⟧ — ⟦A1⟧ موجب عند الدوران إلى اليمين.'],[124,92,52,20,'سهم تيار المجال: من ⟦D1⟧ إلى ⟦D2⟧، كما يشترط النص.'],[80,54,24,58,'سهم الدوران: مع عقارب الساعة = إلى اليمين.'],[120,72,62,22,'ملف مجال التوالي ⟦D1–D2⟧.']]}),
   cap:'الشكل <span class="ltr">(5-4أ)</span> ص 105.<br><b>مرّر المؤشر على الأسهم والملف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محرك توالٍ يعمل بحمل، ثم انفصل الحمل عن عموده فجأة. ماذا يحدث؟',opts:[
     ['تتسارع السرعة حتى قد يتدمر المحرك',true,'«لا يسمح بتشغيلها بدون حمل حيث تتسارع… حتى التدمير الذاتي للمحرك» (ص 104).'],
     ['يتوقف المحرك لأن التيار يقل',false,'التيار يقل فعلاً، لكن المجال يضعف معه فتزداد السرعة لا تقل.'],
     ['تبقى السرعة كما هي',false,'هذا أقرب إلى سلوك محرك التوازي، لا التوالي.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أ ) التشغيل كمحرك:</b> إذا سرى التيار في ملفات التغذية من <b>${LT('D1')}</b> إلى <b>${LT('D2')}</b> يكون <b>${LT('A1')}</b> هو الطرف الموجب عند الدوران إلى اليمين وعند الدوران إلى اليسار يكون <b>${LT('A1')}</b> طرف التوصيل السالب. شكل ${FN('5-4')} يبين تشغيل محرك التوالٍ. الشكل ${FN('5-5')} يبين تشغيل محرك التوالٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات. الشكل ${FN('5-6')} يبين تشغيل محرك التوالٍ مع مفتاح يدوي كمفتاح تغذية. <b>هذه المحركات لا يسمح بتشغيلها بدون حمل حيث تتسارع هذه المحركات أي أن عدد اللفات يزداد حتى التدمير الذاتي للمحرك.</b></p>`,ref:'ص 104'},
    {tip:String.raw`<p>«عدد اللفات» في الجملة الأخيرة يقصد به عدد اللفات في الدقيقة، أي <b>السرعة</b>.</p><p>لماذا يتسارع؟ بلا حمل يقل التيار كثيراً، والتيار نفسه هو تيار المجال؛ فيضعف المجال، والمحرك الذي يضعف مجاله يسرع أكثر… وهكذا تزداد السرعة بلا حد.</p>`,title:'«عدد اللفات» ولماذا يتسارع'},
    {html:U5S.fig(box(figSerP({aA:1,aF:1,rot:1}).svg(),300),320,'<b>الشكل <span class="ltr">(5-4أ)</span> محرك تيار مستمر توالٍ دوران إلى اليمين</b> (ص 105) — المسار: + ← A1 ← A2 ← D1 ← D2 ← −.')},
    {html:U5S.fig(bkFig('u5b','سهم العضو الدوار:',figSerP({rev:1,aA:-1,aF:-1,rot:-1}).svg(),figSerP({rev:1,aA:1,aF:-1,rot:-1}).svg(),300,'المصحح: A1 ما زال متصلاً بالقطب الموجب، فتيار العضو الدوار ما زال من A1 إلى A2 (السهم إلى أسفل). الذي انعكس هو تيار المجال فقط.'),340,'<b>الشكل <span class="ltr">(5-4ب)</span> محرك تيار مستمر توالٍ دوران إلى اليسار</b> (ص 105) — عُكست أطراف ملف المجال: التيار في الملف الآن من D2 إلى D1، أما العضو الدوار فما زال A1 فيه متصلاً بالموجب.')},
    {watch:'في الشكل <span class="ltr">(5-4ب)</span> ص 105 رُسم سهم تيار العضو الدوار إلى أعلى، مع أن A1 ما زال متصلاً بالقطب «+» في الرسم نفسه. الذي عُكس فعلياً هو ملف المجال فقط (السهم تحته صحيح إلى اليمين)، فسهم العضو الدوار الصحيح إلى أسفل. وانتبه: قاعدة النص «A1 سالب عند الدوران إلى اليسار» تخص عكس الاتجاه بعكس العضو الدوار، أما الشكل فعكس الاتجاه بعكس المجال.',fix:true},
    {title:'مختبر مصغّر: الاتجاه والحمل',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر توصيل ملف المجال، ثم ضع الحمل أو أزله. السرعة هنا نوعية بلا أرقام.',
     predict:{q:'في الشكل (5-4ب) بدّلنا طرفي ملف المجال فقط. ما اتجاه الدوران؟',opts:[
      ['إلى اليمين كما كان',false,'تبديل طرفي المجال يعكس تيار المجال، فينعكس الاتجاه.'],
      ['إلى اليسار',true,'عكسنا تياراً واحداً (المجال) فانعكس الدوران — هذا هو الشكل (5-4ب).'],
      ['يتوقف المحرك',false,'المسار ما زال مكتملاً، فالمحرك يدور.']]},
     ins:[{k:'fl',l:'توصيل ملف المجال',seg:[[0,'كما في (5-4أ): التيار من D1 إلى D2'],[1,'معكوس: التيار من D2 إلى D1']],v:0},{k:'ld',l:'الحمل على عمود المحرك',seg:[[1,'بحمل'],[0,'بلا حمل']],v:1}],
     calc:s=>{const d=s.fl?-1:1;
      return {pic:figSerP({rev:s.fl,aA:1,aF:s.fl?-1:1,rot:d}).svg(),
       bars:[{l:'السرعة (نوعياً)',v:s.ld?0.45:1,max:1,txt:s.ld?'ثابتة تقريباً':'تزداد بلا توقف',col:s.ld?'--on':'--stop'}],
       msg:`يدور المحرك <b>${DIRT(d)}</b>. ${s.ld?'':'<b>بلا حمل:</b> «تتسارع هذه المحركات… حتى التدمير الذاتي للمحرك» (ص 104). أعد الحمل فوراً.'}`,cls:s.ld?'':'bad'}}})}
   ]},

  {st:3,short:'لوحة الأطراف (5-5)',title:'الشكلان <span class="ltr">(5-5)</span> و<span class="ltr">(5-6)</span>: مسار التيار ومخطط التوصيلات',ref:'ص 105–106',
   q:'أربعة أطراف على اللوحة وسلكان من المفتاح… أين تضع القنطرة الوحيدة؟',
   art:U5S.art({S:staticBoard(SER,{l4:'D2',j:['A2|D1']},'ser'),vb:[60,196,280,222],label:'لوحة أطراف محرك التوالي في الشكل (5-5) وعليها القنطرة D1–A2',bg:'#E3ECF7',title:'قنطرة واحدة تصنع التوالي',
    tips:[[86,212,28,30,'الطرف ⟦A1⟧: يصله السلك 2 (الموجب بعد المفتاح).'],[141,212,28,30,'الطرف ⟦D2⟧: يصله السلك 4 (السالب بعد المفتاح).'],[214,204,48,26,'القنطرة ⟦D1–A2⟧: تصل نهاية العضو الدوار ببداية ملف المجال، فيصيران على التوالي.'],[282,222,28,40,'طرف الأرضي ⟦PE⟧: يوصل بهيكل المحرك للحماية.'],[78,322,44,56,'العضو الدوار: بين ⟦A1⟧ و⟦A2⟧ داخل صندوق المحرك.'],[166,334,68,22,'ملف مجال التوالي: بين ⟦D2⟧ و⟦D1⟧.'],[66,206,256,52,'لوحة الأطراف (المستطيل المتقطع): عليها تُربط الأسلاك والقناطر.']]}),
   cap:'الجزء السفلي من الشكل <span class="ltr">(5-5)</span>: صندوق المحرك ولوحة أطرافه.<br><b>مرّر المؤشر على الأطراف والقنطرة والملفين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'السلك 2 على A1 والسلك 4 على D2. أي قنطرة تجعل المجال على التوالي مع العضو الدوار؟',opts:[
     ['A1–D2',false,'تصل السلكين 2 و4 مباشرة: قصر على المصدر.'],
     ['D1–A2',true,'هكذا في الشكل (5-5): المسار A1 ← العضو الدوار ← A2 ← القنطرة ← D1 ← الملف ← D2.'],
     ['D1–D2',false,'تقصّر ملف المجال، ويبقى A2 بلا اتصال.']]}}
   ],
   body:[
    {html:U5S.fig(box(staticBoard(SER,{l4:'D2',j:['A2|D1']},'ser').svg(),400),420,'<b>الشكل <span class="ltr">(5-5)</span> محرك توالٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات</b> (ص 105) — قضيبا التغذية <span class="ltr">L+</span> و<span class="ltr">L-</span> (<span class="ltr">220 V</span> مستمر)، والمصهران <span class="ltr">F1,2</span>، والمفتاح <span class="ltr">Q1</span>، وصندوق أطراف المحرك. السلك 2 إلى A1، والسلك 4 إلى D2، و<b>قنطرة من D1 إلى A2</b>.')},
    {tip:String.raw`<p>المسار كاملاً: <span class="ltr">L+</span> ← F1 ← Q1 ← السلك 2 ← A1 ← العضو الدوار ← A2 ← القنطرة ← D1 ← ملف المجال ← D2 ← السلك 4 ← Q1 ← F2 ← <span class="ltr">L-</span>.</p><p>رسمنا لوحة الأطراف صفاً واحداً (A1، D2، D1، A2) لتتضح القنطرة؛ في الكتاب الأطراف على صفين. الخطوط تحت اللوحة (داخل المحرك) تصل كل طرف بملفه.</p>`,title:'تتبّع المسار بإصبعك'},
    {html:U5S.fig(box(boardFig(Object.assign({},SER,{W:450}),{l4:'D2',j:['A2|D1']},{sld:sldSer,arr:{a:1,f:1}}).svg(),520),540,'<b>الشكل <span class="ltr">(5-6)</span> تشغيل محرك توالٍ مفتاح يدوي كمفتاح أجهزة</b> (ص 106) — يساراً المخطط التنفيذي (كما في (5-5))، ويميناً المخطط الخطي (بخط واحد): <span class="ltr">220v-</span>، المصهر <span class="ltr">F1,2</span>، المفتاح <span class="ltr">Q1</span> بوضعيه 0 و1، ثم المحرك <span class="ltr">M1</span>. الشرطات المائلة والرقم بجانبها تبين عدد الموصلات.')},
    {watch:'في المخطط الخطي للشكل <span class="ltr">(5-6)</span> رُسمت شرطتان مائلتان بجانب الرقم «3»؛ الرقم 3 يوافق ثلاثة موصلات (<span class="ltr">L+</span> و<span class="ltr">L-</span> و PE كما في المخطط التنفيذي)، والشرطتان توافقان موصلين. وعنوان الشكل «مفتاح يدوي كمفتاح أجهزة» يختلف عن النص «كمفتاح تغذية».'},
    {title:'مختبر مصغّر: جرّب القنطرة',widget:(el,B)=>DCML.lab(el,B,{intro:'السلك 2 على A1 والسلك 4 على D2، والمفتاح Q1 مغلق. اختر القنطرة وراقب مسار التيار (الخط المتقطع المتحرك).',
     ins:[{k:'j',l:'القنطرة على اللوحة',seg:[['A2|D1','D1–A2'],['A1|D2','A1–D2'],['D1|D2','D1–D2'],['A1|A2','A1–A2']],v:'A2|D1'}],
     calc:s=>{const st={on:1,l4:'D2',j:[s.j]};let ev=evalBoard(SER,st);const sh=ev.short;if(sh){st.blown=1;ev=evalBoard(SER,st)}
      const a=sgn(ev.I.arm),f=sgn(ev.I.ser),d=a&&f?a*f:0;
      return {pic:boardFig(SER,st,{arr:arrFrom(ev.I,st,'ser')}).svg({cls:ev.cls}),
       msg:sh?'<b>قصر على المصدر:</b> القنطرة تصل السلك 2 بالسلك 4 مباشرة، فاحترق المصهران F1,2.':d?`<b>صحيح.</b> يدور المحرك ${DIRT(d)}: التيار يمر في العضو الدوار ثم في ملف المجال — هذا هو الشكل (5-5).`:'لا يكتمل مسار التيار: أحد طرفي العضو الدوار أو ملف المجال بقي بلا اتصال، فلا يدور المحرك.',cls:sh?'bad':d?'':'warn'}}})},
    {title:'مختبر مصغّر: رتّب المخطط الخطي',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب رموز المخطط الخطي للشكل (5-6) من أعلى إلى أسفل.',steps:[
     ['خط التغذية القصير وعليه <span class="ltr">220v-</span>','نبدأ دائماً من التغذية.'],['المصهر <span class="ltr">F1,2</span>','المصهر يأتي قبل المفتاح، أول ما بعد التغذية.'],['المفتاح اليدوي <span class="ltr">Q1</span> بوضعيه 0 و1','المفتاح بعد المصهر وقبل المحرك.'],['المحرك <span class="ltr">M1</span>','المحرك في نهاية الخط.']],done:'وعلى الخط بين الرموز شرطات مائلة مع رقم يبين عدد الموصلات.'})}
   ]},

  {st:4,short:'التشغيل كمولد',title:'ب) التشغيل كمولد',ref:'ص 107',
   q:'في مولد التوالي يمر تيار الحمل في ملف المجال… فهل يبقى الجهد ثابتاً إذا تغير الحمل؟',
   art:U5S.art({S:figSerP({gen:1,aF:1,rot:2}),vb:[20,0,200,150],label:'الشكل (5-7) مولد تيار مستمر توالٍ',bg:'#E3ECF7',title:'المولد: طرفا خرج بدل المصدر',
    tips:[[30,2,104,26,'طرفا الخرج و⟦U⟧ جهد المولد: هنا يتصل الحمل.'],[48,56,44,54,'المولد ⟦G⟧ (حرف مسطّر = تيار مستمر)، يديره محرك أولي.'],[120,72,62,22,'ملف مجال التوالي ⟦D1–D2⟧: يمر فيه تيار الحمل نفسه.'],[80,54,26,58,'السهم المنحني المزدوج: يمكن أن يدار المولد في الاتجاهين.']]}),
   cap:'الشكل <span class="ltr">(5-7)</span> ص 107.<br><b>مرّر المؤشر على U والمولد والملف والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قارن الشكل (5-7) بالشكل (5-4أ). ما الذي حل محل قطبي المصدر + و −؟',opts:[
     ['بطارية للمجال',false,'لا بطارية في مولد التوالي؛ المجال على التوالي مع العضو الدوار.'],
     ['طرفا خرج مفتوحان وبينهما U',true,'المولد يُخرج الطاقة الكهربائية، فيوصل الحمل بين الطرفين.'],
     ['مفتاح وقاية',false,'لا مفتاح في رسم المبدأ.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ب ) التشغيل كمولد:</b> الشكل ${FN('5-7')} يبين تشغيل مولد التوالٍ.</p>`,ref:'ص 107'},
    {html:U5S.fig(box(figSerP({gen:1,aF:1,rot:2}).svg(),300),320,'<b>الشكل <span class="ltr">(5-7)</span> مولد تيار مستمر توالٍ</b> (ص 107) — طرفا الخرج U مفتوحان أعلى الرسم، والملف D1–D2 على التوالي مع العضو الدوار.')},
    {tip:String.raw`<p>لأن ملف المجال على التوالي مع الحمل، فتيار المجال = تيار الحمل: <b>بلا حمل</b> يكاد لا يوجد مجال، ومع زيادة الحمل يقوى المجال فيرتفع الجهد. لذلك جهد مولد التوالي يتغير كثيراً مع الحمل.</p>`,title:'المجال يتبع الحمل'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['في مولد التوالي يمر تيار الحمل نفسه في ملف المجال.',true,'الملف D1–D2 على التوالي مع العضو الدوار وطرفي الخرج.'],
     ['مولد التوالي يحتاج بطارية خارجية لملف المجال.',false,'هذا المولد منفصل التغذية (الشكل 5-3). مولد التوالي ذاتي التغذية.'],
     ['السهم المنحني المزدوج في الشكل (5-7) يعني أن المولد يمكن أن يدار في الاتجاهين.',true,'كما في الشكل (5-3) للمولد منفصل التغذية.']]})}
   ]},

  {recap:[
   'في آلة التوالي تقع دائرة المجال <span class="ltr">D1–D2</span> على التوالي مع دائرة العضو الدوار <span class="ltr">A1–A2</span> (ص 104).',
   'إذا سرى التيار في المجال من D1 إلى D2 يكون A1 موجباً عند الدوران إلى اليمين؛ وعكس طرفي المجال وحده يعكس الاتجاه.',
   'على لوحة الأطراف: السلك 2 إلى A1، والسلك 4 إلى D2، وقنطرة واحدة D1–A2 (الشكل <span class="ltr">(5-5)</span>).',
   'لا يُشغَّل محرك التوالي بلا حمل: يتسارع حتى التدمير الذاتي.',
   'المخطط الخطي يرسم الدائرة بخط واحد: التغذية ← المصهر ← المفتاح ← المحرك، وعدد الموصلات بالشرطات.']}
],
 theory:[
  {h:'5-2-2 مخطط توصيل آلات التيار المستمر توالٍ',ref:'ص 104',html:`<p>في توصيل آلات التيار المستمر توالٍ تقع دائرة المجال على التوالٍ مع دائرة العضو الدوار.</p>
   <p><b>أ ) التشغيل كمحرك:</b> إذا سرى التيار في ملفات التغذية من <b>${LT('D1')}</b> إلى <b>${LT('D2')}</b> يكون <b>${LT('A1')}</b> هو الطرف الموجب عند الدوران إلى اليمين وعند الدوران إلى اليسار يكون <b>${LT('A1')}</b> طرف التوصيل السالب. شكل ${FN('5-4')} يبين تشغيل محرك التوالٍ. الشكل ${FN('5-5')} يبين تشغيل محرك التوالٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات. الشكل ${FN('5-6')} يبين تشغيل محرك التوالٍ مع مفتاح يدوي كمفتاح تغذية. <b>هذه المحركات لا يسمح بتشغيلها بدون حمل حيث تتسارع هذه المحركات أي أن عدد اللفات يزداد حتى التدمير الذاتي للمحرك.</b></p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «عدد اللفات» في الجملة الأخيرة يقصد به عدد اللفات في الدقيقة، أي <b>السرعة</b>. وأطراف ملف مجال التوالي تُرمز <span class="ltr">D1–D2</span>، وأطراف العضو الدوار <span class="ltr">A1–A2</span>.'},
  {fig:FN('5-4أ'),ref:'ص 105',caption:'محرك تيار مستمر توالٍ دوران إلى اليمين — المسار: + ← A1 ← A2 ← D1 ← D2 ← −.',draw:()=>box(figSerP({aA:1,aF:1,rot:1}).svg(),300)},
  {fig:FN('5-4ب'),ref:'ص 105',caption:'محرك تيار مستمر توالٍ دوران إلى اليسار — عُكست أطراف ملف المجال: التيار في الملف الآن من D2 إلى D1، أما العضو الدوار فما زال A1 فيه متصلاً بالموجب.',draw:()=>bkFig('u5b','سهم العضو الدوار:',figSerP({rev:1,aA:-1,aF:-1,rot:-1}).svg(),figSerP({rev:1,aA:1,aF:-1,rot:-1}).svg(),300,'المصحح: A1 ما زال متصلاً بالقطب الموجب، فتيار العضو الدوار ما زال من A1 إلى A2 (السهم إلى أسفل). الذي انعكس هو تيار المجال فقط.')},
  {err:'<span class="fixnote">في الشكل (5-4ب) ص 105 رُسم سهم تيار العضو الدوار إلى أعلى، مع أن A1 ما زال متصلاً بالقطب «+» في الرسم نفسه. الذي عُكس فعلياً هو ملف المجال فقط (السهم تحته صحيح إلى اليمين)، فسهم العضو الدوار الصحيح إلى أسفل. وانتبه: قاعدة النص «A1 سالب عند الدوران إلى اليسار» تخص عكس الاتجاه بعكس العضو الدوار، أما الشكل فعكس الاتجاه بعكس المجال.</span>'},
  {fig:FN('5-5'),ref:'ص 105',caption:'محرك توالٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات — قضيبا التغذية <span class="ltr">L+</span> و<span class="ltr">L-</span> (<span class="ltr">220 V</span> مستمر)، والمصهران <span class="ltr">F1,2</span>، والمفتاح <span class="ltr">Q1</span>، وصندوق أطراف المحرك. السلك 2 إلى A1، والسلك 4 إلى D2، و<b>قنطرة من D1 إلى A2</b>. المسار: L+ ← F1 ← Q1 ← A1 ← المحرك ← A2 ← القنطرة ← D1 ← ملف المجال ← D2 ← Q1 ← F2 ← L-.',draw:()=>box(staticBoard(SER,{l4:'D2',j:['A2|D1']},'ser').svg(),400)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> رسمنا لوحة الأطراف صفاً واحداً (A1، D2، D1، A2) لتتضح القنطرة؛ في الكتاب الأطراف على صفين. الخطوط تحت اللوحة (داخل المحرك) تصل كل طرف بملفه.'},
  {fig:FN('5-6'),ref:'ص 106',caption:'تشغيل محرك توالٍ مفتاح يدوي كمفتاح أجهزة — يساراً المخطط التنفيذي (كما في (5-5))، ويميناً المخطط الخطي (بخط واحد): <span class="ltr">220v-</span>، المصهر <span class="ltr">F1,2</span>، المفتاح <span class="ltr">Q1</span> بوضعيه 0 و1، ثم المحرك <span class="ltr">M1</span>. الشرطات المائلة والرقم بجانبها تبين عدد الموصلات.',draw:()=>box(boardFig(Object.assign({},SER,{W:450}),{l4:'D2',j:['A2|D1']},{sld:sldSer,arr:{a:1,f:1}}).svg(),520)},
  {err:'في المخطط الخطي للشكل (5-6) رُسمت شرطتان مائلتان بجانب الرقم «3»؛ الرقم 3 يوافق ثلاثة موصلات (L+ و L- و PE كما في المخطط التنفيذي)، والشرطتان توافقان موصلين. وعنوان الشكل «مفتاح يدوي كمفتاح أجهزة» يختلف عن النص «كمفتاح تغذية».'},
  {h:'ب ) التشغيل كمولد',ref:'ص 107',html:`<p>الشكل ${FN('5-7')} يبين تشغيل مولد التوالٍ.</p>`},
  {fig:FN('5-7'),ref:'ص 107',caption:'مولد تيار مستمر توالٍ — طرفا الخرج U مفتوحان أعلى الرسم، والملف D1–D2 على التوالي مع العضو الدوار.',draw:()=>box(figSerP({gen:1,aF:1,rot:2}).svg(),300)}
 ],
 lab:(el)=>dcBoardLab(el,SER,{title:'مختبر محرك التوالي على لوحة الأطراف',ref:'مبني على الأشكال (5-4) و(5-5) ص 105',kind:'ser',series:1,land:['D2','D1'],
   presets:[{k:'book',label:'قنطرة الشكل (5-5)',l4:'D2',j:['A2|D1']},{k:'rev',label:'عكس الاتجاه (عكس أطراف المجال)',l4:'D1',j:['A2|D2']}],
   classify(I,st){const a=sgn(I.arm),f=sgn(I.ser),d=a&&f?a*f:0;
     const kind=a&&f?'توالٍ':a&&!f?'عضو دوار بلا مجال':f&&!a?'مجال بلا عضو دوار':'';
     let msg=!st.on?'المفتاح Q1 مفتوح. ضع القنطرة ثم أغلق Q1.':st.blown?'لا تغذية: المصهران محترقان.':d?`يدور المحرك <b>${DIRT(d)}</b>: التيار في المجال من ${f>0?'D1 إلى D2':'D2 إلى D1'}، وفي العضو الدوار من ${a>0?'A1 إلى A2':'A2 إلى A1'}.`+(st.load?'':' <b style="color:var(--stop)">بلا حمل: السرعة تزداد بلا توقف — «لا يسمح بتشغيلها بدون حمل… حتى التدمير الذاتي للمحرك» (ص 104). أعد الحمل فوراً.</b>'):
      a&&!f?'يمر تيار في العضو الدوار لكن ملف المجال خارج المسار: لا يدور.':f&&!a?'يمر تيار في ملف المجال وحده: لا يدور.':'لا يكتمل مسار التيار: تأكد من القنطرة بين D1 و A2.';return {d,kind,msg}},
   steps:[
    {t:'ضع القنطرة',x:'اضغط D1 ثم A2 لتضع بينهما قنطرة (أو اضغط «قنطرة الشكل (5-5)»).',done:w=>w.j.includes('A2|D1')},
    {t:'أغلق المفتاح',x:'أغلق Q1: يمر التيار في A1 ثم A2 ثم القنطرة ثم D1 ثم D2، فيدور المحرك إلى اليمين.',done:w=>w.on&&w.d===1},
    {t:'اعكس أطراف المجال',x:'افتح Q1، ثم انقل السلك 4 إلى D1 وانقل القنطرة إلى D2–A2 (أو الزر «عكس الاتجاه»)، ثم أغلق Q1: يدور إلى اليسار — الشكل (5-4ب).',done:w=>w.on&&w.d===-1},
    {t:'جرّب قنطرة خاطئة',x:'ضع قنطرة بين A1 و D2 (مع السلك 4 على D2) وأغلق Q1: يصبح قصراً على المصدر فيحترق المصهران.',done:w=>w.blown},
    {t:'أصلح واستبدل المصهرين',x:'أزل القنطرة الخاطئة، وأعد توصيل الشكل (5-5)، ثم «استبدل المصهرين» وأغلق Q1.',done:w=>!w.blown&&w.on&&w.d!==0},
    {t:'أزل الحمل',x:'افصل «حمل»: تتسارع السرعة بلا حد (الشريط أحمر). هذا سبب منع تشغيل محرك التوالي بلا حمل.',done:w=>w.runaway}
   ],
   tries:['ضع قنطرة D1–A2 وأغلق Q1.','انقل السلك 4 إلى D1 والقنطرة إلى D2–A2: ينعكس الاتجاه.','ضع قنطرة A1–A2: ماذا يحدث للمحرك؟','افصل الحمل وراقب شريط السرعة.']}),
 examples:[
  drawEx({title:'رسم الشكل (5-5) خطوة بخطوة',ref:'ص 105',mw:400,scene:staticBoard(SER,{l4:'D2',j:['A2|D1']},'ser',{steps:1}),
   q:'<p>ارسم محرك التوالي مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>',
   steps:['ارسم قضيبي التغذية <b>L+</b> و<b>L-</b> واكتب فوقهما <span class="ltr">220v Dc</span>. انزل بفرع من كل قضيب (نقطة توصيل سوداء)، وعلى كل فرع مصهر (<span class="ltr">F1,2</span>) ثم المفتاح ثنائي القطب <b>Q1</b> بمقبضه وخط الربط المتقطع. رقّم الأسلاك: 1 و3 قبل المفتاح، 2 و4 بعده.',
    'ارسم صندوق المحرك بخط شرطة-نقطة، وداخله لوحة الأطراف، وعليها الأطراف <b>A1، D2، D1، A2</b> وطرف الأرضي <b>PE</b>.',
    'ارسم داخل الصندوق رمز المحرك (M مسطّر) وصِل فرشته العليا بـ A1 والسفلى بـ A2، وارسم ملف المجال (مستطيل مصمت) وصِل طرفيه بـ D2 و D1.',
    'صِل السلك <b>2</b> بالطرف A1، والسلك <b>4</b> بالطرف D2.',
    'ضع <b>القنطرة D1–A2</b>: هي التي تجعل المجال على التوالي مع العضو الدوار.',
    'أضف سهم تيار العضو الدوار (إلى أسفل) وسهم تيار المجال (إلى اليسار: من D1 إلى D2) وسهم الدوران.']}),
  drawEx({title:'المخطط الخطي للشكل (5-6)',ref:'ص 106',mw:300,scene:(()=>{const S=Sc(170,250,'المخطط الخطي');S.at(1);txt(S,85,14,'220v-',{sz:10});sld(S,85,22,[['bar','']]);S.at(2);let y=sld(S,85,22,[['n',3,2],['fuse','F1,2']]);S.at(3);y=sld(S,85,y,[['n',3,2],['sw','Q1','h']]);S.add(T(116,y-16,'0 / 1',{sz:9,m:1}));S.at(4);sld(S,85,y,[['n',3,2],['M','M1','',1]]);return S})(),
   q:'<p>ارسم المخطط الخطي (بخط واحد) لدائرة محرك التوالي في الشكل (5-6).</p>',
   steps:['ارسم خطاً أفقياً قصيراً بنقطة توصيل واكتب نوع التغذية وجهدها (<span class="ltr">220v-</span>).','انزل بخط رأسي واحد، وضع عليه شرطات مائلة مع رقم عدد الموصلات، ثم رمز المصهر <span class="ltr">F1,2</span>.','ثم رمز المفتاح اليدوي <b>Q1</b> (تلامس مائل ومقبض) ووضعيه 0 و1.','ثم الشرطات والرقم مرة أخرى، وفي النهاية دائرة المحرك <b>M1</b> (M مسطّر). خط واحد يمثل كل الموصلات.']})
 ],
 quiz:[
  {q:'في محرك التوالي، دائرة المجال موصلة:',o:['على التوازي مع العضو الدوار','على التوالي مع العضو الدوار','من مصدر منفصل','غير موصلة'],c:1,e:'«تقع دائرة المجال على التوالٍ مع دائرة العضو الدوار» (ص 104).'},
  {q:'ما رمز طرفي ملف مجال التوالي في الكتاب؟',o:['F1–F2','E1–E2','D1–D2','U1–U2'],c:2,e:'(ص 104–105).'},
  {q:'لماذا لا يُشغَّل محرك التوالي بلا حمل؟',o:['لأنه لا يدور','لأنه يتسارع حتى التدمير الذاتي','لأن المصهر يحترق','لأن المجال ينعكس'],c:1,e:'«لا يسمح بتشغيلها بدون حمل حيث تتسارع… حتى التدمير الذاتي للمحرك» (ص 104).'},
  {q:'في الشكل (5-5)، ما القنطرة على لوحة الأطراف؟',o:['A1–D2','D1–A2','A1–A2','D1–D2'],c:1,e:'قنطرة مائلة من D1 إلى A2 تضع المجال على التوالي مع العضو الدوار.'},
  {q:'كيف عُكس اتجاه الدوران في الشكل (5-4ب)؟',o:['بعكس قطبية المصدر كله','بعكس أطراف ملف المجال','بفصل المجال','بإضافة مقاومة'],c:1,e:'التيار في الملف أصبح من D2 إلى D1 والعضو الدوار كما هو.'},
  {q:'ماذا يحدث لو وضعنا قنطرة بين A1 و D2 والسلكان 2 و4 عليهما؟',o:['يدور أسرع','قصر على المصدر فيحترق المصهران','ينعكس الاتجاه','لا شيء'],c:1,e:'تصل القنطرة السلك 2 بالسلك 4 مباشرة (جرّبه في المختبر).'}
 ]
});

/* =====================================================================
   الدرس 3 — آلات التيار المستمر توازٍ
   ===================================================================== */
const sldShu=(S,k)=>{S.at(k(1));txt(S,410,14,'220v-',{sz:10});sld(S,410,22,[['bar',''],['n',3,2],['fuse','F1,2'],['n',3,1],['sw','Q1','b'],['prot'],['n',3,1],['M','M1','',1]])};
const F58=(fix,b)=>figShuP({lbl:fix?['-','+']:['+','-'],rev:b,aA:b&&!fix?-1:1,aF:b?-1:1,rot:b?-1:1});
B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'107–110',
 title:'آلات التيار المستمر توازٍ',
 summary:'مخطط توصيل محرك التوازي وعكس اتجاهه بعكس أطراف المجال، ولوحة الأطراف بقنطرتين، وتشغيله مع مفتاح وقاية فيه مرحل حراري ومغناطيسي، ومولد التوازي.',
 stations:[
  {intro:true},
{st:1,short:'التوصيل توازٍ',title:'5-2-3 مخطط توصيل آلات التيار المستمر توازٍ',ref:'ص 107',
   q:'العضو الدوار وملف المجال على طرفي المصدر نفسيهما… فهل يتغير تيار المجال إذا تغير الحمل؟',
   art:U5S.art({S:figShuP({lbl:['','']}),vb:[24,0,200,150],label:'مبدأ محرك التوازي: العضو الدوار وملف المجال على خطي التغذية نفسيهما',bg:'#DDEFE6',title:'فرعان على خطين',
    tips:[[100,30,20,20,'نقطة تفرع: من هنا يذهب جزء من التيار إلى العضو الدوار وجزء إلى ملف المجال.'],[146,74,58,24,'ملف مجال التوازي ⟦E1–E2⟧: رفيع كثير اللفات، موصل بين خطي التغذية مباشرة.'],[88,60,44,54,'العضو الدوار ⟦A1–A2⟧.'],[100,130,20,20,'نقطة تفرع ثانية: يلتقي عندها الفرعان على الخط الآخر.']]}),
   cap:'رسم مبدأ محرك التوازي (الشكل <span class="ltr">(5-8)</span> بلا أسهم ولا علامات قطبية).<br><b>مرّر المؤشر على الخطين ونقطتي التفرع والملفين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في محرك التوازي، أين يتفرع التيار؟',opts:[
     ['لا يتفرع؛ يمر في الملفين على التوالي',false,'هذا محرك التوالي.'],
     ['عند نقطتي التفرع: فرع للعضو الدوار وفرع لملف المجال',true,'«تكون ملفات العضو الدوار وملفات التغذية موصلة على التوازي» (ص 107).'],
     ['داخل ملف المجال',false,'التفرع عند النقطتين السوداوين على الخطين.']]}}
   ],
   body:[
    {book:String.raw`<p>في آلات التيار المستمر الموصلة على التوازي تكون ملفات العضو الدوار وملفات التغذية موصلة على التوازي .</p>`,ref:'ص 107'},
    {tip:String.raw`<p>«على التوازي» = كل ملف على خطي التغذية مباشرة. لذلك جهد ملف المجال = جهد المصدر، وتياره لا يتبع الحمل كما في التوالي؛ فيبقى المجال ثابتاً تقريباً.</p><p>أطراف ملف مجال التوازي <span class="ltr">E1–E2</span>.</p>`,title:'ماذا يعني «توازٍ» هنا؟'},
    {title:'مختبر مصغّر: توالٍ أم توازٍ؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل وصف.',cats:['توالٍ','توازٍ'],items:[
     ['أطراف ملف المجال D1–D2',0,'D1–D2 رمز ملف التوالي.'],['أطراف ملف المجال E1–E2',1,'E1–E2 رمز ملف التوازي.'],
     ['التيار نفسه يمر في العضو الدوار وفي ملف المجال',0,'مسار واحد = توالٍ.'],['ملف المجال بين خطي التغذية مباشرة',1,'كل فرع على الخطين = توازٍ.']]})}
   ]},

  {st:2,short:'التشغيل كمحرك',title:'أ) التشغيل كمحرك',ref:'ص 107–108',
   q:'لعكس اتجاه محرك التوازي… هل تبدّل سلكي المصدر أم طرفي ملف المجال؟',
   art:U5S.art({S:F58(1,0),vb:[24,0,200,150],label:'الشكل (5-8أ) محرك توازٍ يدور إلى اليمين، بعلامتي القطبية المصححتين',bg:'#FBE6C4',title:'دوران إلى اليمين',
    tips:[[100,0,20,18,'القطب الموجب على الخط المتصل بـ ⟦A1⟧ و⟦E1⟧ (بعد التصحيح؛ انظر الملاحظة).'],[74,64,22,42,'سهم تيار العضو الدوار: من ⟦A1⟧ إلى ⟦A2⟧.'],[150,60,50,20,'سهم تيار المجال: من ⟦E1⟧ إلى ⟦E2⟧، كما يشترط النص.'],[118,56,28,62,'سهم الدوران: مع عقارب الساعة = إلى اليمين.']]}),
   cap:'الشكل <span class="ltr">(5-8أ)</span> ص 107 بعلامتي قطبية مصححتين.<br><b>مرّر المؤشر على العلامة والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (5-8ب) يدور المحرك إلى اليسار. ما الذي تغيّر عن (5-8أ)؟',opts:[
     ['قطبية المصدر كله',false,'عكس المصدر يعكس التيارين معاً، فلا يتغير الاتجاه.'],
     ['طرفا ملف المجال فقط',true,'التيار في الملف أصبح من E2 إلى E1، والعضو الدوار كما هو.'],
     ['طرفا العضو الدوار والمجال معاً',false,'عكس الاثنين معاً يُبقي الاتجاه كما هو.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أ ) التشغيل كمحرك:</b> إذا سرى التيار في ملفات التغذية من <b>${LT('E1')}</b> إلى <b>${LT('E2')}</b> يكون <b>${LT('A1')}</b> هو الطرف الموجب عند الدوران إلى اليمين وعند الدوران إلى اليسار يكون <b>${LT('A1')}</b> طرف التوصيل السالب. الشكل ${FN('5-8')} يبين تشغيل محرك التوازي.</p>`,ref:'ص 107'},
    {html:U5S.fig(bkFig('u5c','علامتا القطبية والأسهم في الشكلين (5-8):',F58(0,0).svg(),F58(1,0).svg(),320,'المصحح: الأسهم والنص يجعلان A1 و E1 موجبين، فالقطب «+» على الخط المتصل بـ A1 و E1، و«-» على الخط الآخر. الكتاب كتب العلامتين بالعكس.'),360,'<b>الشكل <span class="ltr">(5-8أ)</span> محرك تيار مستمر توازٍ دوران إلى اليمين</b> (ص 107) — الخط المتصل بـ A1 يتصل أيضاً بـ E1، والخط الآخر بـ A2 و E2: العضو الدوار والمجال على التوازي.')},
    {html:U5S.fig(`<p class="sub">المفتاح نفسه فوق الشكل (5-8أ) يبدّل هذا الرسم أيضاً.</p><div class="bkb" data-bk="u5c">${box(F58(0,1).svg(),320)}</div><div class="bkf blk" data-bk="u5c" style="background:none;padding:0">${box(F58(1,1).svg(),320)}<p class="sub fixnote">المصحح: توصيل العضو الدوار لم يتغير، فسهم تياره يبقى إلى أسفل؛ الذي انعكس هو سهم المجال (إلى اليمين).</p></div>`,360,'<b>الشكل <span class="ltr">(5-8ب)</span> محرك تيار مستمر توازٍ دوران إلى اليسار</b> (ص 108) — عُكست أطراف ملف المجال فقط (التيار في الملف من E2 إلى E1)، وتوصيل العضو الدوار لم يتغير.')},
    {watch:'في الشكل <span class="ltr">(5-8أ)</span> ص 107 كُتب «-» على الخط المتصل بـ A1 و E1 و«+» على الخط الآخر، بينما الأسهم (من A1 إلى A2 ومن E1 إلى E2) والنص («A1 هو الطرف الموجب عند الدوران إلى اليمين») تجعل A1 و E1 موجبين؛ فالعلامتان معكوستان. وفي <span class="ltr">(5-8ب)</span> ص 108 انعكس سهم العضو الدوار إلى أعلى مع أن توصيله لم يتغير؛ الذي تغير فعلاً هو أطراف المجال.',fix:true},
    {title:'مختبر مصغّر: اعكس المجال',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر توصيل طرفي ملف المجال، وراقب الأسهم واتجاه الدوران (الرسم بالعلامتين المصححتين).',
     ins:[{k:'b',l:'طرفا ملف المجال',seg:[[0,'E1 على خط A1 (الشكل 5-8أ)'],[1,'E2 على خط A1 (الشكل 5-8ب)']],v:0}],
     calc:s=>({pic:F58(1,s.b).svg(),msg:`يدور المحرك <b>${DIRT(s.b?-1:1)}</b>. تيار المجال ${s.b?'من E2 إلى E1 (معكوس)':'من E1 إلى E2'}، وتيار العضو الدوار من A1 إلى A2 في الحالتين، لأن توصيله لم يتغير.`})})}
   ]},

  {st:3,short:'لوحة الأطراف (5-9)',title:'الشكل <span class="ltr">(5-9)</span>: مسار التيار ومخطط التوصيلات لمحرك التوازي',ref:'ص 108',
   q:'محرك التوالي احتاج قنطرة واحدة… فكم قنطرة يحتاج محرك التوازي، ولماذا؟',
   art:U5S.art({S:staticBoard(SHU,{j:['A1|E1','A2|E2']},'shu'),vb:[60,190,272,228],label:'لوحة أطراف محرك التوازي في الشكل (5-9) وعليها القنطرتان',bg:'#DDEFE6',title:'قنطرتان تصنعان التوازي',
    tips:[[96,210,28,30,'الطرف ⟦A1⟧: يصله السلك 2، ومنه تبدأ القنطرة إلى ⟦E1⟧.'],[140,198,64,26,'القنطرة ⟦A1–E1⟧: تضع بداية ملف المجال على الخط نفسه مع ⟦A1⟧.'],[186,236,68,30,'القنطرة ⟦E2–A2⟧: تضع نهاية ملف المجال على الخط نفسه مع ⟦A2⟧.'],[236,240,28,30,'الطرف ⟦A2⟧: يصله السلك 4.'],[88,322,44,56,'العضو الدوار بين ⟦A1⟧ و⟦A2⟧.'],[156,334,68,22,'ملف مجال التوازي بين ⟦E2⟧ و⟦E1⟧.']]}),
   cap:'الجزء السفلي من الشكل <span class="ltr">(5-9)</span>.<br><b>مرّر المؤشر على الأطراف والقنطرتين والملفين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'السلك 2 على A1 والسلك 4 على A2. لماذا نحتاج قنطرتين؟',opts:[
     ['لأن كل طرف من طرفي ملف المجال يجب أن يتصل بخط تغذية',true,'A1–E1 تصل بداية الملف بخط، و E2–A2 تصل نهايته بالخط الآخر؛ فيصير الملف على التوازي.'],
     ['لأن العضو الدوار يحتاج قنطرة خاصة',false,'العضو الدوار موصول مباشرة بالسلكين 2 و4.'],
     ['لتأريض المحرك',false,'التأريض عن طريق الطرف PE.']]}}
   ],
   body:[
    {book:String.raw`<p>و الشكل ${FN('5-9')} يبين تشغيل محرك التوازي مع الجمع بين مخطط مسار التيار ومخطط التوصيلات .</p>`,ref:'ص 108'},
    {html:U5S.fig(box(staticBoard(SHU,{j:['A1|E1','A2|E2']},'shu').svg(),400),420,'<b>الشكل <span class="ltr">(5-9)</span> تشغيل محرك تيار مستمر توازٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات</b> (ص 108) — السلك 2 إلى A1 والسلك 4 إلى A2، و<b>قنطرتان: A1–E1 و E2–A2</b>.')},
    {tip:String.raw`<p>المسار: <span class="ltr">L+</span> ← F1 ← Q1 ← A1 ثم يتفرع: (أ) العضو الدوار ← A2، (ب) القنطرة ← E1 ← الملف ← E2 ← القنطرة ← A2؛ ثم A2 ← Q1 ← F2 ← <span class="ltr">L-</span>.</p>`,title:'تتبّع الفرعين'},
    {title:'مختبر مصغّر: ضع القنطرتين',widget:(el,B)=>DCML.lab(el,B,{intro:'السلك 2 على A1 والسلك 4 على A2، و Q1 مغلق. اختر القناطر وراقب مسار التيار.',
     ins:[{k:'j',l:'القناطر على اللوحة',seg:[['A1|E1,A2|E2','A1–E1 و E2–A2'],['A1|E2,A2|E1','A1–E2 و E1–A2'],['A1|E1','A1–E1 فقط'],['A1|A2,E1|E2','A1–A2 و E1–E2']],v:'A1|E1,A2|E2'}],
     calc:s=>{const st={on:1,j:s.j.split(',')};let ev=evalBoard(SHU,st);const sh=ev.short;if(sh){st.blown=1;ev=evalBoard(SHU,st)}
      const a=sgn(ev.I.arm),f=sgn(ev.I.sh),d=a&&f?a*f:0;
      return {pic:boardFig(SHU,st,{arr:arrFrom(ev.I,st,'shu')}).svg({cls:ev.cls}),
       msg:sh?'<b>قصر على المصدر:</b> القنطرة A1–A2 تصل السلكين 2 و4 مباشرة، فاحترق المصهران.':d?`يدور المحرك <b>${DIRT(d)}</b>: تيار المجال من ${f>0?'E1 إلى E2 — هذا هو الشكل (5-9).':'E2 إلى E1 — عكسنا طرفي المجال فانعكس الاتجاه.'}`:a&&!f?'العضو الدوار مغذّى لكن ملف المجال ليس بين الخطين (نقصت قنطرة): لا يدور.':'لا يكتمل المسار.',cls:sh?'bad':d?'':'warn'}}})}
   ]},

  {st:4,short:'مفتاح الوقاية (5-10)',title:'محرك التوازي مع مفتاح وقاية محرك',ref:'ص 109',
   q:'مفتاح بثلاثة أقطاب لدائرة فيها خطان فقط… كيف نستفيد من القطب الثالث؟',
   art:U5S.art({S:staticBoard(SHUms,{j:['A1|E1','A2|E2']},'shu'),vb:[54,36,216,140],label:'مفتاح وقاية المحرك Q1 في الشكل (5-10) بأقطابه الثلاثة ومرحلاته',bg:'#FBE6C4',title:'مفتاح يحمي ويفصل',
    tips:[[104,100,92,18,'المرحلات الحرارية (مربع بخط متعرج): تفصل بعد مدة عند زيادة الحمل.'],[104,120,92,20,'المرحلات المغناطيسية ⟦I&gt;⟧: تفصل فوراً عند القصر.'],[144,42,42,18,'القنطرة ⟦3–5⟧: تمرّر القطب السالب في قطبين متتاليين ليمر التيار في المرحلات الثلاثة.'],[76,70,26,24,'مقبض المفتاح اليدوي ⟦Q1⟧ وخط الربط المتقطع إلى التلامسات.'],[108,64,84,30,'التلامسات الثلاثة ⟦1–2⟧ و⟦3–4⟧ و⟦5–6⟧.']]}),
   cap:'الجزء العلوي من الشكل <span class="ltr">(5-10)</span>: مفتاح وقاية المحرك.<br><b>مرّر المؤشر على المرحلات والقنطرة والمقبض (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محرك يعمل وحدث قصر عند أطرافه. أي جزء من مفتاح الوقاية يفصل أولاً؟',opts:[
     ['المرحل الحراري بعد أن يسخن',false,'الحراري بطيء؛ يناسب زيادة الحمل لا القصر.'],
     ['المرحل المغناطيسي «I>» فوراً',true,'تيار القصر كبير جداً فيجذب المرحل المغناطيسي تلامساته فوراً.'],
     ['لا يفصل شيء',false,'هذه وظيفة مفتاح الوقاية بالذات.']]}}
   ],
   body:[
    {book:String.raw`<p>شكل ${FN('5-10')} يبين تشغيل محرك التوازي مع مفتاح وقاية محرك.</p>`,ref:'ص 109'},
    {html:U5S.fig(box(staticBoard(Object.assign({},SHUms,{W:460}),{j:['A1|E1','A2|E2']},'shu',{sld:sldShu}).svg(),540),560,'<b>الشكل <span class="ltr">(5-10)</span> محرك تيار مستمر توازٍ مع مفتاح يدوي مع وقاية مغناطيسية</b> (ص 109) — يساراً «الدائرة التنفيذية»: مفتاح الوقاية <span class="ltr">Q1</span> بثلاثة أقطاب (1–2، 3–4، 5–6) وتحت كل قطب مرحّل حراري ومرحّل مغناطيسي <span class="ltr">I&gt;</span>. القطب الموجب يمر في 1–2 إلى A1، والسالب يدخل من 6 إلى 5 ثم عبر القنطرة 5–3 إلى 3–4 ثم إلى A2. ويميناً «الدائرة الخطية».')},
    {tip:String.raw`<p>مفتاح الوقاية ثلاثي الأقطاب، والدائرة مستمرة بموصلين؛ لذلك يُمرَّر القطب السالب في قطبين متتاليين (6–5 ثم 3–4) عبر القنطرة 3–5، فيمر التيار في المرحلات الثلاثة. <b>المرحل الحراري</b> يفصل بعد مدة عند زيادة الحمل، و<b>المغناطيسي «I>»</b> يفصل فوراً عند القصر.</p>`,title:'لماذا القنطرة 3–5؟'},
    {watch:'النص يقول «مفتاح وقاية محرك» وعنوان الشكل <span class="ltr">(5-10)</span> «مفتاح يدوي مع وقاية مغناطيسية»، والرسم فيه مرحلات حرارية ومغناطيسية معاً. وفي المخطط الخطي كُتب الرقم «3» لعدد الموصلات مع أن الدائرة مستمرة بموصلين (رسمنا الرقم كما في الكتاب).'},
    {title:'مختبر مصغّر: من يفصل؟',widget:(el,B)=>DCML.cases(el,B,{intro:'اختر الجزء الذي يتصرف في كل موقف.',cases:[
     {q:'زاد الحمل الميكانيكي على المحرك قليلاً فوق المقنن واستمر دقائق.',opts:[['المرحل الحراري: يفصل بعد مدة',true,'التيار أكبر قليلاً من المقنن فيسخن المرحل الحراري تدريجياً ثم يفصل.'],['المرحل المغناطيسي: يفصل فوراً',false,'المغناطيسي لا يتحرك إلا بتيار كبير جداً كتيار القصر.'],['المصهر فقط',false,'في الشكل (5-10) لا يوجد مصهر؛ الوقاية في Q1.']]},
     {q:'لو أزلنا القنطرة 3–5 وأغلقنا Q1، ماذا يحدث؟',opts:[['يعمل المحرك كما هو',false,'القطب السالب يدخل من 6 إلى 5، ولا طريق له إلى 3–4 بلا القنطرة.'],['لا يكتمل مسار القطب السالب فلا يدور المحرك',true,'القنطرة هي التي تنقل السالب من القطب 5–6 إلى القطب 3–4 ثم إلى A2.'],['يحدث قصر',false,'إزالة وصلة تفتح الدائرة ولا تقصّرها.']]}]})}
   ]},

  {st:5,short:'التشغيل كمولد',title:'ب) التشغيل كمولد',ref:'ص 110',
   q:'مولد التوازي يغذي ملف مجاله من جهده هو… فماذا يحدث لو لم يتولد أي جهد في البداية؟',
   art:U5S.art({S:figShuP({gen:1,aF:1,rot:2}),vb:[24,0,200,150],label:'الشكل (5-11) مولد تيار مستمر توازٍ',bg:'#E3ECF7',title:'المجال على طرفي الخرج',
    tips:[[30,2,90,26,'طرفا الخرج و⟦U⟧: هنا يتصل الحمل.'],[146,74,58,24,'ملف مجال التوازي ⟦E1–E2⟧: على طرفي الخرج نفسيهما.'],[88,60,44,54,'المولد ⟦G⟧ (حرف مسطّر = تيار مستمر).'],[118,56,28,62,'السهم المنحني المزدوج: يمكن أن يدار المولد في الاتجاهين.']]}),
   cap:'الشكل <span class="ltr">(5-11)</span> ص 110.<br><b>مرّر المؤشر على U والملف والمولد والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (5-11)، ملف المجال موصل بين:',opts:[
     ['طرفي الخرج (على التوازي مع العضو الدوار)',true,'من نقطتي التفرع إلى E1 و E2، كما في محرك التوازي.'],
     ['بطارية منفصلة',false,'هذا المولد منفصل التغذية.'],
     ['A2 وطرف الخرج على التوالي',false,'هذا مولد التوالي.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ب ) التشغيل كمولد:</b> الشكل ${FN('5-11')} يوضح التشغيل كمولد.</p>`,ref:'ص 110'},
    {watch:'عنوان الشكل في الكتاب (ص 110) «الشكل (٤- ١١) مولد تيار مستمر» والصحيح الشكل <span class="ltr">(5-11)</span>.',fix:true},
    {html:U5S.fig(box(figShuP({gen:1,aF:1,rot:2}).svg(),320),340,'<b>الشكل <span class="ltr">(5-11)</span> مولد تيار مستمر</b> (ص 110) — طرفا الخرج U أعلى الرسم، والملف E1–E2 على التوازي مع العضو الدوار.')},
    {add:String.raw`<p>مولد التوازي يبدأ من <b>المغناطيسية المتبقية</b> في أقطابه: جهد صغير يتولد أولاً، فيمر تيار صغير في ملف المجال فيقوى المجال فيرتفع الجهد… حتى يستقر. لو فقدت الأقطاب مغناطيسيتها المتبقية لما بنى المولد جهده.</p>`,title:'كيف يبني مولد التوازي جهده؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['في مولد التوازي يتغذى ملف المجال من جهد المولد نفسه.',true,'الملف على طرفي الخرج، فهو ذاتي التغذية.'],
     ['رمز طرفي ملف مجال التوازي في الشكل (5-11) هو D1–D2.',false,'E1–E2 للتوازي؛ D1–D2 للتوالي.'],
     ['يرسم الكتاب للمولد سهماً منحنياً مزدوجاً كما في الشكلين (5-3) و(5-7).',true,'لأن المولد يمكن أن يدار في الاتجاهين.']]})}
   ]},

  {recap:[
   'في آلة التوازي يكون العضو الدوار <span class="ltr">A1–A2</span> وملف المجال <span class="ltr">E1–E2</span> على التوازي، كلٌّ بين خطي التغذية (ص 107).',
   'إذا سرى تيار المجال من E1 إلى E2 فـ A1 موجب عند الدوران إلى اليمين؛ ونعكس الاتجاه بعكس طرفي المجال.',
   'على لوحة الأطراف: السلك 2 إلى A1 والسلك 4 إلى A2، وقنطرتان A1–E1 و E2–A2 (الشكل <span class="ltr">(5-9)</span>).',
   'مفتاح وقاية المحرك: مرحل حراري يفصل بعد مدة عند زيادة الحمل، ومغناطيسي <span class="ltr">I&gt;</span> يفصل فوراً عند القصر؛ والقنطرة 3–5 تُمرّر التيار في الأقطاب الثلاثة.',
   'مولد التوازي: ملف المجال على طرفي الخرج (الشكل <span class="ltr">(5-11)</span>).']}
],
 theory:[
  {h:'5-2-3 مخطط توصيل آلات التيار المستمر توازٍ',ref:'ص 107',html:`<p>في آلات التيار المستمر الموصلة على التوازي تكون ملفات العضو الدوار وملفات التغذية موصلة على التوازي .</p>
   <p><b>أ ) التشغيل كمحرك:</b> إذا سرى التيار في ملفات التغذية من <b>${LT('E1')}</b> إلى <b>${LT('E2')}</b> يكون <b>${LT('A1')}</b> هو الطرف الموجب عند الدوران إلى اليمين وعند الدوران إلى اليسار يكون <b>${LT('A1')}</b> طرف التوصيل السالب. الشكل ${FN('5-8')} يبين تشغيل محرك التوازي.</p>`},
  {fig:FN('5-8أ'),ref:'ص 107',caption:'محرك تيار مستمر توازٍ دوران إلى اليمين — الخط المتصل بـ A1 يتصل أيضاً بـ E1، والخط الآخر بـ A2 و E2: العضو الدوار والمجال على التوازي.',draw:()=>bkFig('u5c','علامتا القطبية والأسهم في الشكلين (5-8):',F58(0,0).svg(),F58(1,0).svg(),320,'المصحح: الأسهم والنص يجعلان A1 و E1 موجبين، فالقطب «+» على الخط المتصل بـ A1 و E1، و«-» على الخط الآخر. الكتاب كتب العلامتين بالعكس.')},
  {fig:FN('5-8ب'),ref:'ص 108',caption:'محرك تيار مستمر توازٍ دوران إلى اليسار — عُكست أطراف ملف المجال فقط (التيار في الملف من E2 إلى E1)، وتوصيل العضو الدوار لم يتغير.',draw:()=>`<p class="sub">المفتاح نفسه فوق الشكل (5-8أ) يبدّل هذا الرسم أيضاً.</p><div class="bkb" data-bk="u5c">${box(F58(0,1).svg(),320)}</div><div class="bkf blk" data-bk="u5c" style="background:none;padding:0">${box(F58(1,1).svg(),320)}<p class="sub fixnote">المصحح: توصيل العضو الدوار لم يتغير، فسهم تياره يبقى إلى أسفل؛ الذي انعكس هو سهم المجال (إلى اليمين).</p></div>`},
  {err:'<span class="fixnote">في الشكل (5-8أ) ص 107 كُتب «-» على الخط المتصل بـ A1 و E1 و«+» على الخط الآخر، بينما الأسهم (من A1 إلى A2 ومن E1 إلى E2) والنص («A1 هو الطرف الموجب عند الدوران إلى اليمين») تجعل A1 و E1 موجبين؛ فالعلامتان معكوستان. وفي (5-8ب) ص 108 انعكس سهم العضو الدوار إلى أعلى مع أن توصيله لم يتغير؛ الذي تغير فعلاً هو أطراف المجال.</span>'},
  {html:`<p>و الشكل ${FN('5-9')} يبين تشغيل محرك التوازي مع الجمع بين مخطط مسار التيار ومخطط التوصيلات .</p>`},
  {fig:FN('5-9'),ref:'ص 108',caption:'تشغيل محرك تيار مستمر توازٍ مع الجمع بين مخطط مسار التيار ومخطط التوصيلات — السلك 2 إلى A1 والسلك 4 إلى A2، و<b>قنطرتان: A1–E1 و E2–A2</b>. المسار: L+ ← F1 ← Q1 ← A1 ثم يتفرع: (أ) المحرك ← A2، (ب) E1 ← الملف ← E2 ← A2؛ ثم A2 ← Q1 ← F2 ← L-.',draw:()=>box(staticBoard(SHU,{j:['A1|E1','A2|E2']},'shu').svg(),400)},
  {h:'محرك التوازي مع مفتاح وقاية محرك',ref:'ص 109',html:`<p>شكل ${FN('5-10')} يبين تشغيل محرك التوازي مع مفتاح وقاية محرك.</p>`},
  {fig:FN('5-10'),ref:'ص 109',caption:'محرك تيار مستمر توازٍ مع مفتاح يدوي مع وقاية مغناطيسية — يساراً «الدائرة التنفيذية»: مفتاح الوقاية <span class="ltr">Q1</span> بثلاثة أقطاب (1–2، 3–4، 5–6) وتحت كل قطب مرحّل حراري ومرحّل مغناطيسي <span class="ltr">I&gt;</span>. القطب الموجب يمر في 1–2 إلى A1، والسالب يدخل من 6 إلى 5 ثم عبر القنطرة 5–3 إلى 3–4 ثم إلى A2. ويميناً «الدائرة الخطية».',draw:()=>box(staticBoard(Object.assign({},SHUms,{W:460}),{j:['A1|E1','A2|E2']},'shu',{sld:sldShu}).svg(),540)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مفتاح الوقاية ثلاثي الأقطاب، والدائرة مستمرة بموصلين؛ لذلك يُمرَّر القطب السالب في قطبين متتاليين (6–5 ثم 3–4) عبر القنطرة 3–5، فيمر التيار في المرحلات الثلاثة. <b>المرحل الحراري</b> يفصل بعد مدة عند زيادة الحمل، و<b>المغناطيسي «I>»</b> يفصل فوراً عند القصر. جرّب الاثنين في المختبر.'},
  {err:'النص يقول «مفتاح وقاية محرك» وعنوان الشكل (5-10) «مفتاح يدوي مع وقاية مغناطيسية»، والرسم فيه مرحلات حرارية ومغناطيسية معاً. وفي المخطط الخطي كُتب الرقم «3» لعدد الموصلات مع أن الدائرة مستمرة بموصلين (رسمنا الرقم كما في الكتاب).'},
  {h:'ب ) التشغيل كمولد',ref:'ص 110',html:`<p>الشكل ${FN('5-11')} يوضح التشغيل كمولد.</p>`},
  {err:'عنوان الشكل في الكتاب (ص 110) «الشكل (٤- ١١) مولد تيار مستمر» والصحيح الشكل (5-11).'},
  {fig:FN('5-11'),ref:'ص 110',caption:'مولد تيار مستمر (توازٍ) — طرفا الخرج U أعلى الرسم، والملف E1–E2 على التوازي مع العضو الدوار.',draw:()=>box(figShuP({gen:1,aF:1,rot:2}).svg(),320)}
 ],
 lab:(el)=>dcBoardLab(el,SHUms,{title:'مختبر محرك التوازي مع مفتاح وقاية',ref:'مبني على الأشكال (5-8) و(5-9) ص 107–108 و(5-10) ص 109',kind:'shu',
   presets:[{k:'book',label:'قنطرتا الشكل (5-9)',j:['A1|E1','A2|E2']},{k:'rev',label:'عكس الاتجاه (عكس أطراف المجال)',j:['A1|E2','A2|E1']}],
   classify(I,st){const a=sgn(I.arm),f=sgn(I.sh),d=a&&f?a*f:0;const kind=a&&f?'توازٍ':a?'عضو دوار بلا مجال':f?'مجال وحده':'';
     const msg=!st.on&&!st.trip?'مفتاح الوقاية Q1 مفتوح.':st.trip?'Q1 مفصول بالوقاية.':st.fault?'':d?`يدور المحرك <b>${DIRT(d)}</b>: تيار المجال من ${f>0?'E1 إلى E2':'E2 إلى E1'}. ${st.over?'<b>الحمل زائد</b>: راقب حرارة المرحل الحراري.':''}`:a&&!f?'العضو الدوار مغذّى لكن ملف المجال ليس على أطراف التغذية: لا يدور. ضع قنطرتي المجال.':f&&!a?'المجال مغذّى والعضو الدوار لا.':'لا يكتمل مسار التيار.';return {d,kind,msg}},
   steps:[
    {t:'ضع القنطرتين',x:'ضع قنطرة A1–E1 وقنطرة E2–A2 (أو اضغط «قنطرتا الشكل (5-9)»).',done:w=>w.j.includes('A1|E1')&&w.j.includes('A2|E2')},
    {t:'شغّل Q1',x:'أغلق مفتاح الوقاية Q1: يتفرع التيار عند A1 إلى العضو الدوار والمجال، فيدور المحرك إلى اليمين.',done:w=>w.on&&w.d===1},
    {t:'اعكس الاتجاه',x:'افتح Q1 وضع القنطرتين A1–E2 و E1–A2 (أو «عكس الاتجاه») ثم أغلق Q1: يدور إلى اليسار.',done:w=>w.on&&w.d===-1},
    {t:'زيادة الحمل',x:'شغّل «حمل زائد» والمحرك يدور: يسخن المرحل الحراري ويفصل Q1 <b>بعد مدة</b>.',done:w=>w.trip==='th'},
    {t:'أعد التشغيل',x:'افصل «حمل زائد»، وانتظر حتى يبرد المرحل، ثم أعد تشغيل Q1.',done:w=>w.on&&!w.over&&w.d!==0},
    {t:'القصر',x:'شغّل «قصر» عند أطراف المحرك: يفصل المرحل المغناطيسي <b>فوراً</b>.',done:w=>w.trip==='mag'}
   ],
   tries:['ضع القنطرتين وشغّل Q1.','بدّل القنطرتين لعكس الاتجاه.','قارن زمن فصل الحراري (حمل زائد) بالمغناطيسي (قصر).','ضع قنطرة A1–A2 مباشرة: ماذا يفعل مفتاح الوقاية؟']}),
 examples:[
  drawEx({title:'رسم الشكل (5-9) خطوة بخطوة',ref:'ص 108',mw:400,scene:staticBoard(SHU,{j:['A1|E1','A2|E2']},'shu',{steps:1}),
   q:'<p>ارسم محرك التوازي مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>',
   steps:['ارسم القضيبين <b>L+</b> و<b>L-</b> (<span class="ltr">220v Dc</span>) والمصهرين <span class="ltr">F1,2</span> والمفتاح <b>Q1</b> وأرقام الأسلاك 1، 3، 2، 4 — كما في محرك التوالي.',
    'ارسم صندوق المحرك ولوحة الأطراف: <b>A1</b> و<b>E1</b> في الصف العلوي، <b>E2</b> و<b>A2</b> في الصف السفلي، و<b>PE</b>.',
    'ارسم المحرك وصِل فرشتيه بـ A1 و A2، وارسم ملف المجال وصِل طرفيه بـ E1 و E2.',
    'صِل السلك <b>2</b> بـ A1 والسلك <b>4</b> بـ A2.',
    'ضع القنطرتين: <b>A1–E1</b> و<b>E2–A2</b>. الآن المجال على أطراف التغذية نفسها، أي على التوازي مع العضو الدوار.',
    'أضف الأسهم: العضو الدوار إلى أسفل (A1 إلى A2)، والمجال إلى اليسار (E1 إلى E2)، والدوران مع عقارب الساعة.']}),
  drawEx({title:'من (5-9) إلى (5-10): إضافة مفتاح الوقاية والمخطط الخطي',ref:'ص 109',mw:540,scene:(()=>{const c=Object.assign({},SHUms,{W:460});const ev=evalBoard(c,{on:1,j:['A1|E1','A2|E2']});return boardFig(c,{on:0,j:['A1|E1','A2|E2']},{steps:1,arr:arrFrom(ev.I,{},'shu'),sld:sldShu})})(),
   q:'<p>أعد رسم محرك التوازي بمفتاح وقاية محرك بدل المصهرين والمفتاح، ثم ارسم الدائرة الخطية.</p>',
   steps:['ارسم القضيبين ومفتاح الوقاية <b>Q1</b> بأقطابه الثلاثة (1/3/5 أعلى، 2/4/6 أسفل) وتحت كل قطب مرحّل حراري ومرحّل مغناطيسي <span class="ltr">I&gt;</span>. صِل L+ بالطرف 1، و L- بالطرف 6 من أسفل، وضع القنطرة العلوية 3–5. وارسم بجانبه الدائرة الخطية: المصهر، ثم Q1 بمقبضه، ثم رمزا الحراري والمغناطيسي، ثم المحرك M1.',
    'ارسم صندوق المحرك ولوحة الأطراف (A1، E1، E2، A2، PE).','ارسم المحرك وملف المجال وصِلهما بأطرافهما.','صِل الطرف <b>2</b> بـ A1 والطرف <b>4</b> بـ A2.','ضع القنطرتين A1–E1 و E2–A2.','أضف الأسهم.']})
 ],
 quiz:[
  {q:'في محرك التوازي، ملف المجال موصل:',o:['على التوالي مع العضو الدوار','على التوازي مع العضو الدوار','من بطارية منفصلة','بين L+ و PE'],c:1,e:'(ص 107).'},
  {q:'ما رمز طرفي ملف مجال التوازي؟',o:['D1–D2','E1–E2','F1–F2','Z1–Z2'],c:1,e:'(ص 107–108).'},
  {q:'ما القنطرتان على لوحة أطراف الشكل (5-9)؟',o:['D1–A2 فقط','A1–E1 و E2–A2','A1–A2 و E1–E2','U1–W2 و V1–U2'],c:1,e:'(ص 108).'},
  {q:'في مفتاح الوقاية، أي مرحل يفصل فوراً عند القصر؟',o:['الحراري','المغناطيسي «I>»','المصهر','المقبض'],c:1,e:'المغناطيسي لحظي، والحراري يفصل بعد مدة عند زيادة الحمل (توضيح).'},
  {q:'لماذا توجد قنطرة بين الطرفين 3 و5 في الشكل (5-10)؟',o:['لتقصير المحرك','ليمر القطب السالب في قطبين متتاليين فتعمل المرحلات الثلاثة','لتأريض المفتاح','لعكس الاتجاه'],c:1,e:'المفتاح ثلاثي الأقطاب والدائرة مستمرة بموصلين.'},
  {q:'كيف نعكس اتجاه محرك التوازي في الشكل (5-8ب)؟',o:['بعكس أطراف ملف المجال','بعكس قطبية المصدر كله','بفصل المجال','بإضافة ملف توالٍ'],c:0,e:'التيار في الملف أصبح من E2 إلى E1.'}
 ]
});

/* =====================================================================
   الدرس 4 — آلات التيار المستمر المركبة
   ===================================================================== */
const CMPJ=['D2|E2','2B2|D1','A1|E1'];
B.lesson({
 id:'u5-l4',unit:5,order:4,pages:'110',
 title:'آلات التيار المستمر المركبة',
 summary:'على كل قطب نوعان من ملفات المجال: ملف توازٍ وملف توالٍ؛ ومخطط توصيل المحرك المركب على لوحة الأطراف مع الجمع بين مسار التيار والتوصيلات.',
 stations:[
  {intro:true},
{st:1,short:'ملفان على كل قطب',title:'5-2-4 مخطط التوصيل لآلات التيار المستمر المركب',ref:'ص 110',
   q:'محرك التوالي قوي عند البدء، ومحرك التوازي ثابت السرعة… فماذا لو وضعنا الملفين على القطب نفسه؟',
   art:U5S.art({S:staticBoard(CMP,{j:CMPJ},'cmp'),vb:[96,300,200,150],label:'ملفا المجال في المحرك المركب: ملف توالٍ وملف توازٍ، مع العضو الدوار',bg:'#FBE6C4',title:'توالٍ + توازٍ = مركب',
    tips:[[114,332,62,26,'ملف مجال التوالي ⟦D1–D2⟧: قصير سميك، على التوالي مع العضو الدوار.'],[154,418,82,28,'ملف مجال التوازي ⟦E1–E2⟧: طويل رفيع، على أطراف التغذية.'],[206,324,48,54,'العضو الدوار بين ⟦A1⟧ و⟦2B2⟧.']]}),
   cap:'الجزء الداخلي من صندوق المحرك في الشكل <span class="ltr">(5-12)</span>.<br><b>مرّر المؤشر على الملفين والعضو الدوار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كم نوعاً من ملفات المجال على كل قطب رئيس في الآلة المركبة؟',opts:[
     ['نوع واحد',false,'هذا في آلات التوالي أو التوازي.'],
     ['نوعان: توازٍ وتوالٍ',true,'«يكون على كل قطب رئيس نوعان من لفائف المجال» (ص 110).'],
     ['ثلاثة أنواع',false,'الكتاب يذكر نوعين.']]}}
   ],
   body:[
    {book:String.raw`<p>في آلات التيار المستمر المركبة يكون على كل قطب رئيس نوعان من لفائف المجال ملفات استثارة على التوازي موصلة مع دائرة عضو الإنتاج وملفات استثارة على التوالٍ موصلة مع دائرة عضو الإنتاج على التوالٍ. الشكل ${FN('5-12')} يبين تشغيل محرك مركب مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>`,ref:'ص 110'},
    {tip:String.raw`<p>المحرك المركب يجمع ما رأيته في الدرسين السابقين: ملف توازٍ <span class="ltr">E1–E2</span> على أطراف التغذية (كمحرك التوازي)، وملف توالٍ <span class="ltr">D1–D2</span> في مسار العضو الدوار (كمحرك التوالي). «عضو الإنتاج» هنا هو العضو الدوار.</p>`,title:'درسان في محرك واحد'},
    {add:String.raw`<p>لهذا يُختار المحرك المركب للأحمال التي تحتاج عزم بدء كبيراً مع سرعة لا تنفلت بلا حمل، مثل المكابس والرافعات وبعض الضواغط.</p>`,title:'أين يُستخدم؟'},
    {title:'مختبر مصغّر: لمن هذا الطرف؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف أطراف لوحة المحرك المركب حسب الملف الذي تنتمي إليه.',cats:['العضو الدوار','ملف التوالي','ملف التوازي'],items:[
     ['D1',1,'D1–D2 طرفا ملف التوالي.'],['E2',2,'E1–E2 طرفا ملف التوازي.'],['A1',0,'A1 طرف العضو الدوار.'],['2B2',0,'2B2 نهاية العضو الدوار مع ملفات الأقطاب المساعدة.'],['E1',2,'طرف ملف التوازي.'],['D2',1,'طرف ملف التوالي.']]})}
   ]},

  {st:2,short:'لوحة الأطراف (5-12)',title:'الشكل <span class="ltr">(5-12)</span>: المحرك المركب على لوحة الأطراف',ref:'ص 110',
   q:'ثلاث قناطر على لوحة واحدة… أيها يجعل ملف التوالي في طريق العضو الدوار؟',
   art:U5S.art({S:staticBoard(CMP,{j:CMPJ},'cmp'),vb:[76,186,252,90],label:'لوحة أطراف المحرك المركب في الشكل (5-12) بقناطرها الثلاث',bg:'#DDEFE6',title:'ثلاث قناطر',
    tips:[[98,224,40,34,'القنطرة ⟦E2–D2⟧: توصل الموجب (السلك 2) إلى بداية ملف التوالي.'],[192,236,66,20,'القنطرة ⟦D1–2B2⟧: نهاية ملف التوالي إلى طرف العضو الدوار.'],[192,204,66,22,'القنطرة ⟦A1–E1⟧: الطرف الآخر للعضو الدوار إلى السلك 4.'],[296,226,28,32,'طرف الأرضي ⟦PE⟧.'],[84,196,30,20,'السلك 2 يصل إلى ⟦E2⟧ والسلك 4 إلى ⟦E1⟧: ملف التوازي على أطراف التغذية.']]}),
   cap:'لوحة أطراف الشكل <span class="ltr">(5-12)</span> كما أعدنا رسمها.<br><b>مرّر المؤشر على القناطر والأطراف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لو أزلنا قنطرة A1–E1 فقط، ماذا يبقى مغذّى؟',opts:[
     ['المحرك كله يعمل كما هو',false,'A1–E1 تكمل مسار العضو الدوار إلى السلك 4.'],
     ['ملف التوازي وحده، والمحرك لا يدور',true,'السلكان على E2 و E1 فيبقى ملف التوازي مغذّى، أما مسار العضو الدوار فمقطوع.'],
     ['لا شيء على الإطلاق',false,'ملف التوازي موصول مباشرة بالسلكين 2 و4.']]}}
   ],
   body:[
    {html:U5S.fig(box(staticBoard(CMP,{j:CMPJ},'cmp').svg(),400),420,'<b>الشكل <span class="ltr">(5-12)</span> محرك تيار مستمر مركب مع الجمع بين مخطط مسار التيار ومخطط التوصيلات</b> (ص 110) — الجزء العلوي كما في (5-5). السلك 2 إلى E2 والسلك 4 إلى E1. القناطر: <b>E2–D2</b>، و<b>D1–2B2</b>، و<b>A1–E1</b>.')},
    {watch:'رسم الشكل <span class="ltr">(5-12)</span> ص 110 ممسوح بدقة منخفضة، وتقاطع القناطر عند E2/D2/2B2 غير واضح، والاسم «2B2» مطبوع مرتين (طرف في الصف العلوي وآخر في الصف السفلي). أعدنا الرسم بالتوصيل القياسي للمحرك المركب: ملف التوازي E1–E2 على أطراف التغذية، وملف التوالي D1–D2 على التوالي مع العضو الدوار. سمّينا طرف الصف العلوي الأوسط <b>A1</b> (طرف العضو الدوار الآخر)، وأبقينا <b>2B2</b> للطرف السفلي (نهاية العضو الدوار مع ملفات الأقطاب المساعدة)، ورسمنا الأسهم حسب التوصيل.',fix:true},
    {tip:String.raw`<p>المسار: <span class="ltr">L+</span> ← السلك 2 ← E2 ثم يتفرع: (أ) ملف التوازي E2 ← E1، (ب) القنطرة ← D2 ← ملف التوالي ← D1 ← القنطرة ← 2B2 ← العضو الدوار ← A1 ← القنطرة ← E1؛ ثم E1 ← السلك 4 ← <span class="ltr">L-</span>.</p><p>لو قصرت ملف التوالي (قنطرة D1–D2) لصار المحرك يعمل كمحرك توازٍ فقط.</p>`,title:'تتبّع الفرعين'},
    {title:'مختبر مصغّر: ضع القناطر واحدة واحدة',widget:(el,B)=>DCML.lab(el,B,{intro:'السلك 2 على E2 والسلك 4 على E1، والمفتاح مغلق. ضع القناطر وراقب أي ملف يمر فيه التيار.',
     ins:[{k:'a',l:'',sw:true,v:0,on:'✓ قنطرة E2–D2',off:'ضع قنطرة E2–D2'},{k:'b',l:'',sw:true,v:0,on:'✓ قنطرة D1–2B2',off:'ضع قنطرة D1–2B2'},{k:'c',l:'',sw:true,v:0,on:'✓ قنطرة A1–E1',off:'ضع قنطرة A1–E1'},{k:'d',l:'',sw:true,v:0,on:'✓ قنطرة D1–D2 (تقصير ملف التوالي)',off:'قصّر ملف التوالي بقنطرة D1–D2'}],
     calc:s=>{const j=[];if(s.a)j.push('D2|E2');if(s.b)j.push('2B2|D1');if(s.c)j.push('A1|E1');if(s.d)j.push('D1|D2');const st={on:1,j};const ev=evalBoard(CMP,st);
      const a=sgn(ev.I.arm),sr=sgn(ev.I.ser),h=sgn(ev.I.sh),d=a&&(sr||h)&&!(sr&&h&&sr!==h)?a*(sr||h):0;
      return {pic:boardFig(CMP,st,{arr:arrFrom(ev.I,st,'cmp')}).svg({cls:ev.cls}),
       msg:d?(sr&&h?`<b>محرك مركب:</b> يمر التيار في ملف التوالي وملف التوازي معاً، ويدور المحرك ${DIRT(d)}.`:`ملف التوالي مقصور: يمر التيار في ملف التوازي وحده، فيعمل كمحرك <b>توازٍ</b> فقط.`):a?'العضو الدوار مغذّى بلا مجال.':h?'يمر التيار في <b>ملف التوازي وحده</b> (السلكان على E2 و E1)، ومسار العضو الدوار لم يكتمل بعد.':'لا يكتمل المسار.',cls:d&&sr&&h?'':'warn'}}})}
   ]},

  {recap:[
   'في الآلة المركبة على كل قطب رئيس ملفان: ملف توازٍ <span class="ltr">E1–E2</span> وملف توالٍ <span class="ltr">D1–D2</span> (ص 110).',
   'ملف التوازي على أطراف التغذية: السلك 2 إلى E2 والسلك 4 إلى E1.',
   'ملف التوالي في طريق العضو الدوار عبر القناطر E2–D2 و D1–2B2 و A1–E1 (الشكل <span class="ltr">(5-12)</span>).',
   'تقصير ملف التوالي يجعل المحرك يعمل كمحرك توازٍ فقط.']}
],
 theory:[
  {h:'5-2-4 مخطط التوصيل لآلات التيار المستمر المركب',ref:'ص 110',html:`<p>في آلات التيار المستمر المركبة يكون على كل قطب رئيس نوعان من لفائف المجال ملفات استثارة على التوازي موصلة مع دائرة عضو الإنتاج وملفات استثارة على التوالٍ موصلة مع دائرة عضو الإنتاج على التوالٍ. الشكل ${FN('5-12')} يبين تشغيل محرك مركب مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المحرك المركب يجمع ما رأيته في الدرسين السابقين: ملف توازٍ <span class="ltr">E1–E2</span> على أطراف التغذية (كمحرك التوازي)، وملف توالٍ <span class="ltr">D1–D2</span> في مسار العضو الدوار (كمحرك التوالي). في الرسم: ملف التوالي يساراً تحت D2/D1، وملف التوازي أسفل الرسم.'},
  {fig:FN('5-12'),ref:'ص 110',caption:'محرك تيار مستمر مركب مع الجمع بين مخطط مسار التيار ومخطط التوصيلات — الجزء العلوي كما في (5-5). السلك 2 إلى E2 والسلك 4 إلى E1. القناطر: <b>E2–D2</b>، و<b>D1–2B2</b>، و<b>A1–E1</b>. المسار: L+ ← E2 ثم يتفرع: (أ) ملف التوازي E2–E1، (ب) D2 ← ملف التوالي ← D1 ← 2B2 ← العضو الدوار ← A1 ← E1؛ ثم E1 ← Q1 ← F2 ← L-.',draw:()=>box(staticBoard(CMP,{j:CMPJ},'cmp').svg(),400)},
  {err:'<span class="fixnote">رسم الشكل (5-12) ص 110 ممسوح بدقة منخفضة، وتقاطع القناطر عند E2/D2/2B2 غير واضح، والاسم «2B2» مطبوع مرتين (طرف في الصف العلوي وآخر في الصف السفلي). أعدنا الرسم بالتوصيل القياسي للمحرك المركب: ملف التوازي E1–E2 على أطراف التغذية، وملف التوالي D1–D2 على التوالي مع العضو الدوار. سمّينا طرف الصف العلوي الأوسط <b>A1</b> (طرف العضو الدوار الآخر)، وأبقينا <b>2B2</b> للطرف السفلي (نهاية العضو الدوار مع ملفات الأقطاب المساعدة)، ورسمنا الأسهم حسب التوصيل.</span>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لو أزلت قنطرة A1–E1 لانقطع مسار العضو الدوار؛ ولو قصرت ملف التوالي (قنطرة D1–D2) لصار المحرك يعمل كمحرك توازٍ فقط. جرّب ذلك في المختبر.'}
 ],
 lab:(el)=>dcBoardLab(el,CMP,{title:'مختبر لوحة أطراف المحرك المركب',ref:'مبني على الشكل (5-12) ص 110',kind:'cmp',
   presets:[{k:'book',label:'قناطر الشكل (5-12)',j:CMPJ}],
   classify(I,st){const a=sgn(I.arm),s=sgn(I.ser),h=sgn(I.sh);const diff=s&&h&&s!==h;const fd=s||h,d=a&&fd&&!diff?a*fd:0;
     const kind=a?(s&&h?(diff?'المجالان متعاكسان':'مركب'):s?'توالٍ فقط':h?'توازٍ فقط':'بلا مجال'):h?'مجال التوازي وحده':'';
     const msg=!st.on?'المفتاح Q1 مفتوح.':st.blown?'لا تغذية: المصهران محترقان.':d?`يدور المحرك <b>${DIRT(d)}</b>. ${s&&h?'يمر التيار في <b>ملف التوالي وملف التوازي</b> معاً: هذا هو المحرك المركب.':s?'يمر التيار في ملف التوالي وحده: المحرك يعمل كمحرك توالٍ.':'يمر التيار في ملف التوازي وحده (ملف التوالي مقصور أو خارج المسار): يعمل كمحرك توازٍ.'}`:
       diff?'التيار في الملفين باتجاهين متعاكسين: يضعف المجال. هذا توصيل غير مطلوب هنا.':a?'العضو الدوار مغذّى بلا مجال: لا يدور.':h?'ملف التوازي مغذّى لكن مسار العضو الدوار غير مكتمل: ضع القنطرتين D1–2B2 و A1–E1.':'لا يكتمل مسار التيار: ابدأ بقنطرة E2–D2.';return {d,kind,msg}},
   steps:[
    {t:'أغلق Q1 بلا قناطر',x:'أغلق Q1: يمر التيار في ملف التوازي وحده (السلكان على E2 و E1)، والمحرك لا يدور.',done:w=>w.on&&w.j.length===0},
    {t:'قنطرة E2–D2',x:'ضع قنطرة بين E2 و D2: الآن يصل الموجب إلى ملف التوالي، لكن المسار لم يكتمل بعد.',done:w=>w.j.includes('D2|E2')},
    {t:'قنطرة D1–2B2',x:'ضع قنطرة بين D1 و 2B2 (الصف السفلي): ملف التوالي متصل بالعضو الدوار.',done:w=>w.j.includes('2B2|D1')},
    {t:'قنطرة A1–E1',x:'ضع القنطرة الأخيرة A1–E1: يكتمل المسار ويدور المحرك كمحرك مركب.',done:w=>w.on&&w.kind==='مركب'},
    {t:'قصّر ملف التوالي',x:'أضف قنطرة بين D1 و D2: يتجاوز التيار ملف التوالي فيعمل المحرك كمحرك توازٍ فقط.',done:w=>w.on&&w.kind==='توازٍ فقط'},
    {t:'قنطرة خاطئة',x:'أزل قنطرة D1–D2 وضع قنطرة بين E2 و E1: قصر على المصدر يحرق المصهرين.',done:w=>w.blown}
   ],
   tries:['ابنِ التوصيل قنطرة قنطرة وراقب أي ملف يمر فيه التيار.','قصّر ملف التوالي بقنطرة D1–D2.','أزل قنطرة A1–E1: ماذا يبقى مغذّى؟']}),
 examples:[
  drawEx({title:'رسم الشكل (5-12) خطوة بخطوة',ref:'ص 110',mw:400,scene:staticBoard(CMP,{j:CMPJ},'cmp',{steps:1}),
   q:'<p>ارسم المحرك المركب مع الجمع بين مخطط مسار التيار ومخطط التوصيلات، وميّز ملف التوالي من ملف التوازي.</p>',
   steps:['ارسم الجزء العلوي كما في الشكل (5-5): L+ و L- و <span class="ltr">220v Dc</span>، المصهران، Q1، والأسلاك 1، 3، 2، 4.',
    'ارسم صندوق المحرك ولوحة الأطراف بصفين: <b>E2، A1، E1</b> أعلى، و<b>D2، D1، 2B2</b> أسفل، و<b>PE</b>.',
    'ارسم داخل الصندوق: المحرك بين A1 و 2B2، و<b>ملف التوالي</b> بين D2 و D1، و<b>ملف التوازي</b> (أطول) بين E2 و E1.',
    'صِل السلك <b>2</b> بـ E2 والسلك <b>4</b> بـ E1: ملف التوازي الآن على أطراف التغذية.',
    'ضع القناطر: <b>E2–D2</b> ثم <b>D1–2B2</b> ثم <b>A1–E1</b>: ملف التوالي على التوالي مع العضو الدوار.',
    'أضف الأسهم حسب اتجاه التيار في كل ملف وسهم الدوران.']})
 ],
 quiz:[
  {q:'كم نوعاً من ملفات المجال على كل قطب في الآلة المركبة؟',o:['نوع واحد','نوعان: توازٍ وتوالٍ','ثلاثة أنواع','لا يوجد مجال'],c:1,e:'(ص 110).'},
  {q:'ملف التوالي في المحرك المركب يوصل:',o:['على أطراف التغذية','على التوالي مع دائرة عضو الإنتاج','بين PE و L-','من مصدر منفصل'],c:1,e:'(ص 110).'},
  {q:'ملف التوازي في المحرك المركب يرمز له:',o:['D1–D2','E1–E2','A1–A2','U1–U2'],c:1,e:'كما في محرك التوازي.'},
  {q:'إذا قصرنا ملف التوالي بقنطرة D1–D2 فإن المحرك يعمل:',o:['كمحرك توالٍ','كمحرك توازٍ','لا يعمل','كمولد'],c:1,e:'يبقى ملف التوازي وحده في الدائرة (جرّبه في المختبر).'},
  {q:'ما الذي يربط الشكل (5-12) بالشكل (5-5)؟',o:['الجزء العلوي (التغذية والمصهران وQ1) متطابق','لا شيء','كلاهما تيار متردد','كلاهما بلا لوحة أطراف'],c:0,e:'الجزء العلوي مطابق لـ (5-5).'}
 ]
});

/* =====================================================================
   المولد التزامني: العضو الدوار (الأقطاب) وحلقات الانزلاق ودائرة التيار المستمر (التنبيه)
   o: {rx,ry,rr,dx,dy,pos,qdc,meters,title,arc,k,s:[خطوة الدوار، خطوة التيار المستمر]} — نتائج القياس في o.mv = {V,A}
   ===================================================================== */
function rotorDC(S,o){const {rx,ry,dx,dy}=o,rr=o.rr||32,px=dx+50,sx=rx+rr+48,k=o.k||(()=>0),s=o.s||[0,0],mv=o.mv||{};
  S.at(k(s[0]));
  if(o.arc)S.add(`<path d="M${r1(rx-(rr+9)*Math.sin(35*Math.PI/180))} ${r1(ry-(rr+9)*Math.cos(35*Math.PI/180))}A${rr+9} ${rr+9} 0 0 0 ${r1(rx-(rr+9)*Math.sin(145*Math.PI/180))} ${r1(ry-(rr+9)*Math.cos(145*Math.PI/180))}" style="stroke:var(--fg);stroke-width:2.2;fill:none"/>`);
  S.add(c=>`<circle cx="${rx}" cy="${ry}" r="${rr}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/>`+(o.rot?`<g data-rot="${rx} ${ry}"><path d="M${rx} ${ry-rr+3}V${ry-rr+9}" style="stroke:var(--live);stroke-width:3;stroke-linecap:round"/></g>`:''),'rot');
  coil(S,rx,ry,40,9,'rot');
  wire(S,[[rx+20,ry],[rx+rr+12,ry],[rx+rr+12,ry-14],[sx,ry-14]],'rot');wire(S,[[rx-20,ry+2],[rx-rr-8,ry+2],[rx-rr-8,ry+rr+10],[rx+rr+22,ry+rr+10],[rx+rr+22,ry+14],[sx,ry+14]],'rot');
  [ry-14,ry+14].forEach(y=>S.add(`<rect x="${sx}" y="${y-5}" width="14" height="10" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/><rect x="${sx+14}" y="${y-5}" width="6" height="10" style="fill:var(--fg)"/>`));
  S.at(k(s[1]));
  wire(S,[[dx-20,dy],[px+36,dy]],'dc0');wire(S,[[dx-20,dy+12],[px+36,dy+12]],'dc0');txt(S,dx-24,dy+4,'-',{a:'end',sz:13});txt(S,dx-24,dy+16,'+',{a:'end',sz:13});txt(S,dx+25,dy-7,o.title||'110vDC',{sz:10.5});
  dot(S,dx,dy);dot(S,px,dy+12);wire(S,[[dx,dy],[dx,dy+29]],'dc0');wire(S,[[px,dy+12],[px,dy+29]],'dc0');fuse(S,dx,dy+40,'dc0');fuse(S,px,dy+40,'dc0');
  wire(S,[[dx,dy+51],[dx,dy+62]],'dc0');wire(S,[[px,dy+51],[px,dy+62]],'dc0');cont(S,dx,dy+62,dy+86,o.qdc,'dc');cont(S,px,dy+62,dy+86,o.qdc,'dc');qlink(S,dx-24,px-6,dy+74,'h');
  const rh=Math.min(dy+150,ry-40);
  if(o.meters){term(S,dx,dy+105);term(S,px,dy+105);wire(S,[[dx,dy+105],[dx+15,dy+105]],'dcv');wire(S,[[dx+35,dy+105],[px,dy+105]],'dcv');meter(S,dx+25,dy+105,'V',mv.Vd,10)}
  wire(S,[[dx,dy+86],[dx,ry-14],[sx+20,ry-14]],'dc');
  if(o.meters){wire(S,[[px,dy+86],[px,dy+117]],'dc');meter(S,px,dy+128,'A',mv.Ad,10);wire(S,[[px,dy+138],[px,rh]],'dc')}else wire(S,[[px,dy+86],[px,rh]],'dc');
  rheo(S,px-20,rh,40,o.pos);const sxl=px-40+40*(o.pos==null?.35:o.pos);wire(S,[[sxl,rh+18],[sxl,ry+14],[sx+20,ry+14]],'dc');
  return S}

/* =====================================================================
   الشكلان (5-13) و(5-14): مولد تزامني أحادي الوجه — الدائرة التنفيذية + الدائرة الخطية
   ===================================================================== */
function figSG1(o){o=o||{};const S=Sc(560,370,'مولد تيار متغير وجه واحد'),k=n=>o.steps?n:0,mv=o.mv||{},m=o.meters;
  S.at(k(1));
  wire(S,[[24,30],[215,30]],'acb');wire(S,[[24,42],[215,42]],'acb');wire(S,[[24,54],[215,54]],null,'pe');txt(S,20,34,'L1',{a:'end'});txt(S,20,46,'N',{a:'end'});txt(S,20,58,'PE',{a:'end'});txt(S,110,19,'L1/N/PE 220v 50Hz',{sz:10.5});
  dot(S,90,30);dot(S,150,42);wire(S,[[90,30],[90,69]],'acb');fuse(S,90,80,'acb');wire(S,[[90,91],[90,104]],'acb');wire(S,[[150,42],[150,104]],'acb');
  cont(S,90,104,128,o.qac,'ac');cont(S,150,104,128,o.qac,'ac');qlink(S,62,144,116,'h');
  S.at(k(2));
  if(m){term(S,90,150);wire(S,[[90,128],[90,251]],'ac');wire(S,[[90,150],[225,150]],'acv');wire(S,[[190,150],[190,164]],'acv');wire(S,[[190,186],[190,200]],'acv');wire(S,[[225,150],[225,164]],'acv');wire(S,[[225,186],[225,200]],'acv');
    meter(S,190,175,'V',mv.V,11);meter(S,225,175,'Hz',mv.Hz,11);wire(S,[[150,128],[150,161]],'ac');meter(S,150,172,'A',mv.A,11);wire(S,[[150,183],[150,251]],'ac');term(S,150,200);wire(S,[[150,200],[225,200]],'acv')}
  else{wire(S,[[90,128],[90,251]],'ac');wire(S,[[150,128],[150,251]],'ac')}
  coil(S,120,256,64,10,'stator');
  S.at(k(3));dot(S,40,54);wire(S,[[40,54],[40,282]],null,'pe');dot(S,40,282);gnd(S,40,285);wire(S,[[40,282],[78,293]],null,'pe');
  rotorDC(S,{rx:120,ry:305,rr:32,dx:270,dy:100,arc:1,rot:o.rot,qdc:o.qdc,pos:o.pos,meters:m,mv,k,s:[3,4]});
  S.at(k(5));sld1(S,o,k);
  return S}
function sld1(S,o,k){const x=450,m=o.meters,mv=o.mv||{};txt(S,x,14,'L1/N/PE 220v 50Hz',{sz:10});let y=sld(S,x,24,[['bar',''],['w',8],['fuse',''],['sw','','h']]);
  if(m){wire(S,[[x,y],[x,y+6]]);meter(S,x,y+17,'A',null,11);y+=28;term(S,x,y+6);wire(S,[[x,y],[x,y+12]]);wire(S,[[x,y+6],[x+80,y+6]]);term(S,x+40,y+6);
    wire(S,[[x+40,y+6],[x+40,y+14]]);wire(S,[[x+80,y+6],[x+80,y+14]]);
    S.add(`<circle cx="${x+40}" cy="${y+25}" r="11" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`+(o.book514?T(x+40,y+29,'A',{sz:12}):T(x+40,y+29,'V',{sz:12})));meter(S,x+80,y+25,'Hz',null,11);y+=12}
  y=sld(S,x,y,[['G','G','',0]]);dot(S,x,y+6);wire(S,[[x,y],[x,y+60]]);wire(S,[[x,y+6],[x+40,y+6],[x+40,y+16]]);rheo(S,x+40,y+24,16,.5);S.add(`<path d="M${x+40} ${y+42}H${x+52}" style="${SK}"/>`);
  y+=20;cont(S,x,y+10,y+32,false);S.add(`<path d="M${x} ${y+32}V${y+38}" style="stroke:var(--wire);stroke-width:2"/>`);y=sld(S,x,y+38,[['fuse','']]);wire(S,[[x,y],[x,y+8]]);S.add(`<path d="M${x-26} ${y+8}H${x+26}" style="stroke:var(--fg);stroke-width:2"/>`);dot(S,x,y+8);txt(S,x+30,y+22,'110vDC',{sz:10,a:'middle'})}

function labSG1(el){
  const st={drive:0,qdc:0,qac:0,pos:.5};const w={};
  const $=shell(el,{title:'مختبر المولد التزامني أحادي الوجه',ref:'مبني على الشكلين (5-13) ص 111 و(5-14) ص 112',mw:560,figNote:'المؤشرات نوعية (بلا أرقام): مؤشر V يبين هل الجهد أكبر أم أصغر، ومؤشر Hz يبين أن التردد ثابت ما دامت السرعة ثابتة.',
    tries:['أدر المولد قبل التنبيه: يظهر التردد ولا يظهر جهد.','أغلق مفتاح التيار المستمر: يتولد الجهد.','حرّك ذراع مقاومة تنظيم الجهد: يتغير مؤشر V ويبقى Hz ثابتاً.','أغلق مفتاح التيار المتردد ليغذي المولد القضبان: يتحرك مؤشر الأميتر A.']});
  const sp=spinner(el);
  $('#ctl').innerHTML=`${swHTML('sDr','~','المحرك الأولي يدير المولد',0)}${swHTML('sDc','DC','مفتاح التيار المستمر 110 V',0)}${swHTML('sAc','AC','مفتاح التيار المتردد',0)}
   <label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:190px">ذراع مقاومة تنظيم الجهد<input type="range" id="rh" min="0" max="1" step="0.05" value="${st.pos}" style="accent-color:var(--blue)"><span style="display:flex;justify-content:space-between"><small>مقاومة أكبر</small><small>مقاومة أصغر</small></span></label>`;
  const calc=()=>{const If=st.qdc&&!chF('brush')&&!chF('dcfuse')?0.3+0.7*(chF('rheo')?0:st.pos):0,V=st.drive?If*0.9:0;return {If,V,Hz:st.drive?.5:0,A:st.qac&&V&&!chF('acfuse')?V*.85:0}};
  const render=()=>{const r=calc();Object.assign(w,st,{V:r.V});w.moved=w.moved||0;
    const cls=n=>n==='dc0'?(st.qdc&&r.If?'flow':'live'):n==='dcv'&&chF('dcfuse')?'':n==='dc'&&st.qdc&&!r.If&&!chF('dcfuse')?'live':n==='dc'||n==='rot'||n==='dcv'?(st.qdc&&r.If?'flow':''):n==='ac'||n==='acv'?(r.A?'flow':r.V?'live':''):n==='acb'?(r.A?'flow':''):n==='stator'?(r.A?'flow':''):'';
    $('#fig').innerHTML=figSG1({meters:1,rot:1,qdc:st.qdc,qac:st.qac,pos:st.pos,mv:{V:r.V,Hz:r.Hz,A:r.A,Vd:chF('dcfuse')?0:.75,Ad:st.qdc?r.If:0}}).svg({cls});
    ['sDr','sDc','sAc'].forEach((id,i)=>$('#'+id).setAttribute('aria-pressed',String(!![st.drive,st.qdc,st.qac][i])));
    const chip=(t,c)=>`<em class="mode-chip ${c||''}">${t}</em>`;
    $('#rd').innerHTML=`<div class="read"><span>تيار التنبيه (الأقطاب)</span><b>${speedBar(r.If,1)}</b></div><div class="read"><span>جهد المولد V</span><b>${speedBar(r.V,1)}</b></div><div class="read"><span>التردد Hz</span>${chip(st.drive?'ثابت':'صفر',st.drive?'run':'')}</div><div class="read"><span>المولد على القضبان</span>${chip(r.A?'يغذّي':'لا',r.A?'run':'')}</div>`;
    $('#say').innerHTML=!st.drive&&!st.qdc?'المولد متوقف وبلا تنبيه. شغّل المحرك الأولي.':st.drive&&!st.qdc?'المولد يدور لكن الأقطاب بلا تيار مستمر، فلا يوجد مجال ثابت ولا يتولد جهد (مؤشر V على الصفر). أغلق مفتاح التيار المستمر.':!st.drive&&st.qdc?'الأقطاب مغذاة بالتيار المستمر (عبر حلقات الانزلاق والفرش) لكن المولد لا يدور: لا جهد ولا تردد.':
      `يتولد جهد متردد. «يتم تنظيم تيار التنبيه بمقاومة تنظيم الجهد» (ص 111): حرّك الذراع فيتغير الجهد، أما التردد فثابت لأنه يعتمد على السرعة.${st.qac?' المولد الآن موصول بالقضبان ويمر تيار في الأميتر.':''}`};
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;if(t.id==='sDr')st.drive^=1;else if(t.id==='sDc')st.qdc^=1;else if(t.id==='sAc')st.qac^=1;else return;render();G.check()});
  $('#rh').addEventListener('input',e=>{st.pos=+e.target.value;w.moved=(w.moved||0)+1;render();G.check()});
  const G=stepsUI($('#gs'),[
    {t:'أدر المولد',x:'شغّل «المحرك الأولي». يتحرك مؤشر Hz، أما مؤشر V فيبقى على الصفر: لا تنبيه.',done:w=>w.drive&&!w.qdc},
    {t:'غذِّ الأقطاب',x:'أغلق مفتاح التيار المستمر 110 V: يمر التيار عبر الفرش وحلقات الانزلاق إلى ملف الأقطاب فيتولد الجهد.',done:w=>w.drive&&w.qdc},
    {t:'نظّم الجهد',x:'حرّك ذراع المقاومة المتغيرة: يتغير مؤشر V، ويبقى Hz ثابتاً.',done:w=>w.moved>=2&&w.qdc},
    {t:'صِل المولد بالقضبان',x:'أغلق مفتاح التيار المتردد: يمر تيار في الأميتر A الموصل على التوالي في الخط N.',done:w=>w.qac&&w.V>0},
    {t:'افصل التنبيه',x:'افتح مفتاح التيار المستمر والمولد يدور: ينهار الجهد إلى الصفر.',done:w=>w.drive&&!w.qdc&&w.qac}
  ],()=>w);
  render();loopOn(el,dt=>sp.tick(dt,st.drive?1:0,0.8))}

B.lesson({
 id:'u5-l5',unit:5,order:5,pages:'111–112',
 title:'المولد التزامني أحادي الوجه',
 summary:'تركيب المولد التزامني، والدائرة التنفيذية والخطية لمولد وجه واحد تتغذى أقطابه بالتيار المستمر عبر حلقات الانزلاق، مع مقاومة تنظيم الجهد وأجهزة القياس.',
 stations:[
  {intro:true},
{st:1,short:'تركيب المولد التزامني',title:'5-3 آلات التيار المتردد — 5-3-1 الدائرة الكهربية الممثلة للمولدات التزامنية أحادية الوجه',ref:'ص 111',
   q:'في المولد التزامني الملف الذي يتولد فيه الجهد ثابت لا يدور… فما الذي يدور إذن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع مبسط لمولد تزامني: عضو استنتاج ساكن خارجي، وأقطاب دوارة في الداخل تتغذى بالتيار المستمر عبر حلقتي انزلاق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="العضو الساكن = عضو الاستنتاج: فيه الملفات التي يتولد فيها الجهد المتردد، ولا يدور."><path fill-rule="evenodd" d="M44 150a96 96 0 1 0 192 0a96 96 0 1 0 -192 0ZM70 150a70 70 0 1 0 140 0a70 70 0 1 0 -140 0Z" fill="#EFE6D6" stroke="#2C4A40" stroke-width="3"/><g fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"><rect x="133" y="58" width="14" height="10"/><rect x="133" y="232" width="14" height="10"/><rect x="72" y="113" width="12" height="14" transform="rotate(-60 78 120)"/><rect x="196" y="113" width="12" height="14" transform="rotate(60 202 120)"/><rect x="72" y="173" width="12" height="14" transform="rotate(60 78 180)"/><rect x="196" y="173" width="12" height="14" transform="rotate(-60 202 180)"/></g></g><g data-tip="العضو الدوار = الأقطاب (هنا قطبان بارزان ⟦N⟧ و⟦S⟧): تتغذى ملفاتها بالتيار المستمر فتصنع مجالاً مغناطيسياً ثابتاً يدور معها."><rect x="128" y="96" width="24" height="108" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M106 96Q140 78 174 96V104H106Z M106 204Q140 222 174 204V196H106Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="122" y="108" width="36" height="22" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="122" y="170" width="36" height="22" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="140" y="93" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">N</text><text x="140" y="216" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="حلقتا الانزلاق والفرشتان: الطريق الذي يصل منه التيار المستمر إلى ملفات الأقطاب وهي تدور."><path d="M152 150H312" stroke="#2C4A40" stroke-width="5"/><rect x="262" y="128" width="12" height="44" rx="3" fill="#D9822B" stroke="#2C4A40" stroke-width="2"/><rect x="286" y="128" width="12" height="44" rx="3" fill="#D9822B" stroke="#2C4A40" stroke-width="2"/><rect x="261" y="108" width="14" height="14" fill="#2C4A40"/><rect x="285" y="108" width="14" height="14" fill="#2C4A40"/><path d="M268 108V84M292 108V84" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مصدر التيار المستمر ⟦DC⟧ لتنبيه الأقطاب (في الشكل (5-13) قضبان توزيع التيار المستمر)."><rect x="250" y="56" width="62" height="28" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="281" y="75" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">DC</text></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">أقطاب تدور داخل عضو استنتاج ساكن</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لتركيب المولد التزامني كما يصفه نص ص 111.<br><b>مرّر المؤشر على العضو الساكن والأقطاب والحلقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بماذا تُغذّى ملفات أقطاب المولد التزامني؟',opts:[
     ['بالتيار المتردد من الشبكة',false,'المتردد يعطي مجالاً متغيراً، والمطلوب مجال ثابت في الأقطاب.'],
     ['بالتيار المستمر',true,'«وتغذي ملفات أقطاب المولد بالتيار المستمر للحصول على مجال مغناطيسي ثابت في الأقطاب» (ص 111).'],
     ['لا تُغذّى؛ هي مغناطيس دائم',false,'الكتاب يصف أقطاباً تتغذى بالتيار المستمر.']]}}
   ],
   body:[
    {book:String.raw`<p>يتكون المولد التزامني من عضو ساكن وهو عضو استنتاج فقط والعضو الدوار وهو يمثل الأقطاب وهي إما بارزة وتركب في المولدات ذات السرعة المنخفضة وإما غاطسه وتركب في مولدات السرعة العالية. وتغذي ملفات أقطاب المولد بالتيار المستمر للحصول على مجال مغناطيسي ثابت في الأقطاب. مولد التيار المتغير ذو الوجه الواحد قدرته صغيرة ولا يصلح استخدامه في محطات التوليد الكبيرة.</p>`,ref:'ص 111'},
    {tip:String.raw`<p>«<b>عضو الاستنتاج</b>» هو الذي يتولد فيه الجهد (هنا العضو الساكن). و«<b>غاطسه</b>» يقصد بها الأقطاب غير البارزة (الأسطوانية): سطح العضو الدوار أملس والملفات داخل مجارٍ فيه.</p><p>الأقطاب البارزة تناسب السرعة المنخفضة لأنها كثيرة العدد وقطرها كبير، والأسطوانية تناسب السرعة العالية لأنها متينة أمام قوة الطرد المركزي.</p>`,title:'كلمات النص'},
    {add:String.raw`<p>مولدات المحطات المائية تدور ببطء فأقطابها بارزة كثيرة، أما مولدات المحطات البخارية والغازية فتدور بسرعة عالية فأقطابها أسطوانية (غاطسة) قليلة.</p>`,title:'من محطات الكهرباء'},
    {title:'مختبر مصغّر: بارزة أم غاطسة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل وصف حسب نوع الأقطاب.',cats:['أقطاب بارزة','أقطاب غاطسة'],items:[
     ['تركب في المولدات ذات السرعة المنخفضة',0,'«إما بارزة وتركب في المولدات ذات السرعة المنخفضة» (ص 111).'],
     ['تركب في مولدات السرعة العالية',1,'«وإما غاطسه وتركب في مولدات السرعة العالية» (ص 111).'],
     ['مولد محطة مائية يدور ببطء',0,'سرعة منخفضة ← أقطاب بارزة (مثال من خارج الكتاب).'],
     ['مولد يديره توربين بخاري سريع',1,'سرعة عالية ← أقطاب غاطسة (مثال من خارج الكتاب).']]})}
   ]},

  {st:2,short:'الدائرة (5-13)',title:'الشكل <span class="ltr">(5-13)</span>: الدائرة الخطية والتنفيذية لمولد وجه واحد',ref:'ص 111–112',
   q:'المولد يدور بسرعته الثابتة… فبأي مقبض نرفع جهده أو نخفضه؟',
   art:U5S.art({S:figSG1({}),vb:[70,88,290,262],label:'جزء من الشكل (5-13): العضو الدوار وحلقتا الانزلاق ودائرة التيار المستمر بمقاومة تنظيم الجهد',bg:'#FBE6C4',title:'التنبيه يأتي من التيار المستمر',
    tips:[[246,90,114,30,'قضيبا التيار المستمر ⟦110vDC⟧ (⟦P.N⟧): الموجب والسالب.'],[256,126,78,30,'مصهران على خطي التيار المستمر.'],[230,156,104,34,'مفتاح التيار المستمر ثنائي القطب.'],[274,236,54,40,'مقاومة تنظيم الجهد: مقاومة متغيرة في دائرة التيار المستمر، يغيّر ذراعها تيار التنبيه.'],[194,280,32,48,'حلقتا الانزلاق والفرشتان: يصل منهما التيار المستمر إلى الأقطاب الدوارة.'],[84,268,72,72,'العضو الدوار (الأقطاب) وفيه ملف التنبيه، والقوس فوقه رمز العضو الساكن.'],[84,246,72,20,'ملف العضو الساكن (عضو الاستنتاج) الذي يتولد فيه الجهد المتردد.']]}),
   cap:'جزء من الدائرة التنفيذية في الشكل <span class="ltr">(5-13)</span>.<br><b>مرّر المؤشر على القضبان والمقاومة والحلقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب النص، كيف يُنظَّم تيار التنبيه؟',opts:[
     ['بتغيير سرعة المولد',false,'السرعة تحدد التردد؛ والنص يذكر مقاومة.'],
     ['بمقاومة تنظيم الجهد في دائرة التيار المستمر',true,'«يتم تنظيم تيار التنبيه بمقاومة تنظيم الجهد وهي مقاومة متغيرة موصلة في دائرة التيار المستمر» (ص 111).'],
     ['بالمصهر على الخط L1',false,'المصهر للحماية فقط.']]}}
   ],
   body:[
    {book:String.raw`<p>شكل ${FN('5-13')} يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد فيه عضو الاستنتاج هو العضو الساكن والأقطاب هي العضو الدائر حيث تغذى من قضبان توزيع التيار المستمر <span class="ltr">P.N</span> عن طريق حلقات الانزلاق والفرش كما يتم تنظيم تيار التنبيه بمقاومة تنظيم الجهد وهي مقاومة متغيرة موصلة في دائرة التيار المستمر.</p>`,ref:'ص 111'},
    {tip:String.raw`<p>«<span class="ltr">P.N</span>» قضيبا الموجب والسالب للتيار المستمر. و«تيار التنبيه» هو تيار ملف الأقطاب: كلما زاد قوي المجال فارتفع جهد المولد.</p>`,title:'اقرأ الرموز'},
    {html:U5S.fig(box(figSG1({}).svg(),560),580,'<b>الشكل <span class="ltr">(5-13)</span> الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد</b> (ص 111–112) — يساراً «الدائرة التنفيذية»: قضبان <span class="ltr">L1/N/PE 220v 50Hz</span>، مصهر على L1، مفتاح ثنائي القطب، ملف العضو الساكن، هيكل الآلة مؤرّض، والأقطاب الدوارة تتغذى من <span class="ltr">110vDC</span> عبر مصهرين ومفتاح ومقاومة متغيرة وحلقتي انزلاق. يميناً «الدائرة الخطية».')},
    {watch:'عنوان الشكل <span class="ltr">(5-13)</span> مطبوع في أعلى ص 112، بعيداً عن رسمه الذي في ص 111.'},
    {title:'مختبر مصغّر: نبّه المولد',widget:(el,B)=>DCML.lab(el,B,{intro:'شغّل المولد ونبّه أقطابه، ثم حرّك ذراع مقاومة تنظيم الجهد. الأشرطة نوعية بلا أرقام.',
     predict:{q:'المولد يدور، لكن مفتاح التيار المستمر مفتوح. هل يتولد جهد؟',opts:[
      ['نعم، لأنه يدور',false,'الدوران وحده لا يكفي؛ يلزم مجال الأقطاب.'],
      ['لا، لأن الأقطاب بلا تيار مستمر فلا يوجد مجال',true,'المجال الثابت في الأقطاب يأتي من التيار المستمر (ص 111).'],
      ['نعم، لكن بتردد مختلف',false,'بلا مجال لا يتولد جهد أصلاً.']]},
     ins:[{k:'dr',l:'المحرك الأولي',seg:[[1,'يدير المولد'],[0,'متوقف']],v:1},{k:'dc',l:'مفتاح التيار المستمر',seg:[[0,'مفتوح'],[1,'مغلق']],v:0},{k:'pos',l:'ذراع مقاومة تنظيم الجهد',seg:[[0.1,'مقاومة كبيرة'],[0.5,'في الوسط'],[0.9,'مقاومة صغيرة']],v:0.5}],
     calc:s=>{const If=s.dc?0.3+0.7*s.pos:0,V=s.dr?If*0.9:0,lv=x=>x>0.75?'كبير':x>0.45?'متوسط':x>0?'صغير':'صفر';
      return {pic:figSG1({qdc:s.dc,pos:s.pos}).svg({cls:n=>n==='dc0'?(s.dc?'flow':'live'):n==='dc'||n==='rot'?(s.dc?'flow':''):n==='ac'?(V?'live':''):''}),
       bars:[{l:'تيار التنبيه (الأقطاب)',v:If,max:1,txt:lv(If),col:'--live'},{l:'جهد المولد',v:V,max:1,txt:lv(V/0.9),col:'--blue'},{l:'التردد',v:s.dr?0.6:0,max:1,txt:s.dr?'ثابت':'صفر',col:'--on'}],
       msg:!s.dr&&!s.dc?'المولد متوقف وبلا تنبيه.':s.dr&&!s.dc?'المولد يدور لكن الأقطاب بلا تيار مستمر: لا مجال ولا جهد.':!s.dr?'الأقطاب مغذاة لكن المولد لا يدور: لا جهد ولا تردد.':'يتولد الجهد. حرّك ذراع المقاومة: يتغير الجهد، ويبقى التردد ثابتاً لأنه يعتمد على السرعة.'}}})}
   ]},

  {st:3,short:'أجهزة القياس (5-14)',title:'الشكل <span class="ltr">(5-14)</span>: المولد موصلاً مع أجهزة القياس',ref:'ص 112',
   q:'الأميتر والفولتميتر جهازان متشابهان في الشكل… فلماذا يوصل أحدهما على الخط والآخر بين الخطين؟',
   art:U5S.art({S:figSG1({meters:1}),vb:[64,120,200,100],label:'أجهزة القياس في جانب التيار المتردد من الشكل (5-14)',bg:'#DDEFE6',title:'توالٍ للتيار، توازٍ للجهد',
    tips:[[138,160,24,24,'الأميتر ⟦A⟧: على التوالي في الخط ⟦N⟧، يمر فيه تيار الخط نفسه.'],[178,163,24,24,'الفولتميتر ⟦V⟧: على التوازي بين الخطين، يقيس الجهد بينهما.'],[213,163,24,24,'مقياس التردد ⟦Hz⟧: على التوازي بين الخطين مثل الفولتميتر.'],[84,140,12,120,'الخط ⟦L1⟧ بعد المفتاح.']]}),
   cap:'جانب التيار المتردد في الدائرة التنفيذية للشكل <span class="ltr">(5-14)</span>.<br><b>مرّر المؤشر على الأجهزة الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (5-14)، كيف يوصل الأميتر في جانب التيار المتردد؟',opts:[
     ['على التوازي بين الخطين',false,'هكذا يوصل الفولتميتر ومقياس التردد.'],
     ['على التوالي في الخط N',true,'يمر فيه تيار الخط نفسه ليقيسه.'],
     ['بين N و PE',false,'لا يقاس شيء بين N والأرضي هنا.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل ${FN('5-14')} يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد ضغط منخفض موصلة بين أجهزة قياس.</p>`,ref:'ص 112'},
    {html:U5S.fig(bkFig('u5d','الجهاز الثاني في الدائرة الخطية:',figSG1({meters:1,book514:1}).svg(),figSG1({meters:1}).svg(),560,'المصحح: الجهاز الموصل على التوازي في الدائرة الخطية هو الفولتميتر V، كما في الدائرة التنفيذية. الكتاب كتب عليه A.'),600,'<b>الشكل <span class="ltr">(5-14)</span> الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد موصلة مع أجهزة القياس</b> (ص 112) — في جانب التيار المتردد: <b>فولتميتر V ومقياس تردد Hz على التوازي</b> بين الخطين، و<b>أميتر A على التوالي</b> في الخط N. وفي جانب التيار المستمر: فولتميتر بين الخطين وأميتر على التوالي في الخط الموجب.')},
    {watch:'في الدائرة الخطية للشكل <span class="ltr">(5-14)</span> ص 112 رُسم الجهاز الثاني (الموصل على التوازي بجانب مقياس التردد) بالحرف A، بينما هو في الدائرة التنفيذية فولتميتر V. الصحيح V.',fix:true},
    {tip:String.raw`<p>قاعدة توصيل أجهزة القياس: <b>الأميتر على التوالي</b> (يمر فيه تيار الخط نفسه)، و<b>الفولتميتر ومقياس التردد على التوازي</b> (بين الخطين).</p>`,title:'قاعدة الأجهزة'},
    {watch:'لا توصل الأميتر أبداً بين خطين: مقاومته صغيرة جداً، فيصير كأنه قصر على المصدر.'},
    {title:'مختبر مصغّر: توالٍ أم توازٍ؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف توصيل كل جهاز في الشكل (5-14).',cats:['على التوالي','على التوازي'],items:[
     ['الأميتر A في جانب التيار المتردد',0,'في الخط N على التوالي.'],['الفولتميتر V في جانب التيار المتردد',1,'بين الخطين.'],['مقياس التردد Hz',1,'بين الخطين مثل الفولتميتر.'],
     ['الأميتر في دائرة التيار المستمر',0,'على التوالي في الخط الموجب.'],['الفولتميتر في دائرة التيار المستمر',1,'بين الخطين.']]})}
   ]},

  {recap:[
   'المولد التزامني: العضو الساكن عضو الاستنتاج، والعضو الدوار هو الأقطاب (بارزة للسرعة المنخفضة، غاطسة للسرعة العالية) (ص 111).',
   'تتغذى الأقطاب بالتيار المستمر عبر حلقات الانزلاق والفرش للحصول على مجال ثابت.',
   'ينظَّم تيار التنبيه، ومن ثم الجهد، بمقاومة متغيرة في دائرة التيار المستمر؛ والتردد يتبع السرعة.',
   'الأميتر على التوالي، والفولتميتر ومقياس التردد على التوازي (الشكل <span class="ltr">(5-14)</span>).']}
],
 theory:[
  {h:'5-3 آلات التيار المتردد — 5-3-1 الدائرة الكهربية الممثلة للمولدات التزامنية أحادية الوجه',ref:'ص 111',html:`<p>يتكون المولد التزامني من عضو ساكن وهو عضو استنتاج فقط والعضو الدوار وهو يمثل الأقطاب وهي إما بارزة وتركب في المولدات ذات السرعة المنخفضة وإما غاطسه وتركب في مولدات السرعة العالية. وتغذي ملفات أقطاب المولد بالتيار المستمر للحصول على مجال مغناطيسي ثابت في الأقطاب. مولد التيار المتغير ذو الوجه الواحد قدرته صغيرة ولا يصلح استخدامه في محطات التوليد الكبيرة. شكل ${FN('5-13')} يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد فيه عضو الاستنتاج هو العضو الساكن والأقطاب هي العضو الدائر حيث تغذى من قضبان توزيع التيار المستمر <span class="ltr">P.N</span> عن طريق حلقات الانزلاق والفرش كما يتم تنظيم تيار التنبيه بمقاومة تنظيم الجهد وهي مقاومة متغيرة موصلة في دائرة التيار المستمر.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «غاطسه» يقصد بها الأقطاب غير البارزة (الأسطوانية)، و«<span class="ltr">P.N</span>» قضيبا الموجب والسالب للتيار المستمر. «عضو الاستنتاج» هو الذي يتولد فيه الجهد (هنا العضو الساكن).'},
  {fig:FN('5-13'),ref:'ص 111–112',caption:'الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد — يساراً «الدائرة التنفيذية»: قضبان <span class="ltr">L1/N/PE 220v 50Hz</span>، مصهر على L1، مفتاح ثنائي القطب، ملف العضو الساكن، هيكل الآلة مؤرّض، والأقطاب الدوارة تتغذى من <span class="ltr">110vDC</span> عبر مصهرين ومفتاح ومقاومة متغيرة وحلقتي انزلاق. يميناً «الدائرة الخطية».',draw:()=>box(figSG1({}).svg(),560)},
  {err:'عنوان الشكل (5-13) مطبوع في أعلى ص 112، بعيداً عن رسمه الذي في ص 111.'},
  {html:`<p>الشكل ${FN('5-14')} يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد ضغط منخفض موصلة بين أجهزة قياس.</p>`},
  {fig:FN('5-14'),ref:'ص 112',caption:'الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير وجه واحد موصلة مع أجهزة القياس — في جانب التيار المتردد: <b>فولتميتر V ومقياس تردد Hz على التوازي</b> بين الخطين، و<b>أميتر A على التوالي</b> في الخط N. وفي جانب التيار المستمر: فولتميتر بين الخطين وأميتر على التوالي في الخط الموجب.',draw:()=>bkFig('u5d','الجهاز الثاني في الدائرة الخطية:',figSG1({meters:1,book514:1}).svg(),figSG1({meters:1}).svg(),560,'المصحح: الجهاز الموصل على التوازي في الدائرة الخطية هو الفولتميتر V، كما في الدائرة التنفيذية. الكتاب كتب عليه A.')},
  {err:'<span class="fixnote">في الدائرة الخطية للشكل (5-14) ص 112 رُسم الجهاز الثاني (الموصل على التوازي بجانب مقياس التردد) بالحرف A، بينما هو في الدائرة التنفيذية فولتميتر V. الصحيح V.</span>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> قاعدة توصيل أجهزة القياس: <b>الأميتر على التوالي</b> (يمر فيه تيار الخط نفسه)، و<b>الفولتميتر ومقياس التردد على التوازي</b> (بين الخطين). جرّبها في «المختبر».'}
 ],
 lab:(el)=>labSG1(el),
 examples:[
  drawEx({title:'رسم الشكل (5-13) ثم إضافة أجهزة القياس (5-14)',ref:'ص 111–112',mw:560,scene:figSG1({steps:1,meters:1}),
   q:'<p>ارسم الدائرة التنفيذية لمولد تيار متغير وجه واحد مع أجهزة القياس، ثم الدائرة الخطية.</p>',
   steps:['ارسم القضبان <b>L1</b> و<b>N</b> و<b>PE</b> (خط شرطة-نقطة) واكتب <span class="ltr">L1/N/PE 220v 50Hz</span>. انزل من L1 بمصهر، ومن N بلا مصهر، ثم المفتاح ثنائي القطب.',
    'أكمل الخطين إلى طرفي <b>ملف العضو الساكن</b>. وأضف أجهزة القياس: <b>A</b> على التوالي في الخط N، و<b>V</b> و<b>Hz</b> على التوازي بين الخطين.',
    'ارسم رمز الآلة: قوس العضو الساكن، ودائرة العضو الدوار وفيها ملف الأقطاب، وطرفاه إلى <b>حلقتي الانزلاق والفرشتين</b>. وأرّض الهيكل من خط PE.',
    'ارسم قضيبي التيار المستمر <span class="ltr">110vDC</span> (− و +)، والمصهرين والمفتاح، وفولتميتر بين الخطين وأميتر في الخط الموجب، ثم <b>مقاومة تنظيم الجهد</b> على التوالي، وصِل الخطين بالفرشتين.',
    'ارسم الدائرة الخطية بخط واحد: القضيب، المصهر، المفتاح، الأميتر، الفولتميتر ومقياس التردد، المولد G (دائرتان)، ثم فرع المقاومة المتغيرة، والمفتاح والمصهر وقضيب <span class="ltr">110vDC</span>.']})
 ],
 quiz:[
  {q:'في المولد التزامني الموصوف، عضو الاستنتاج هو:',o:['العضو الدوار','العضو الساكن','حلقات الانزلاق','مقاومة التنبيه'],c:1,e:'«عضو الاستنتاج هو العضو الساكن والأقطاب هي العضو الدائر» (ص 111).'},
  {q:'بماذا تغذى ملفات أقطاب المولد التزامني؟',o:['بالتيار المتردد','بالتيار المستمر','لا تغذى','من الشبكة مباشرة'],c:1,e:'«للحصول على مجال مغناطيسي ثابت في الأقطاب» (ص 111).'},
  {q:'كيف يصل التيار المستمر إلى الأقطاب الدوارة؟',o:['عبر المصهر فقط','عن طريق حلقات الانزلاق والفرش','عبر الأرضي','لاسلكياً'],c:1,e:'(ص 111).'},
  {q:'ما وظيفة المقاومة المتغيرة في دائرة التيار المستمر؟',o:['تنظيم تيار التنبيه (ومن ثم الجهد)','تنظيم التردد','الحماية من القصر','التأريض'],c:0,e:'«يتم تنظيم تيار التنبيه بمقاومة تنظيم الجهد» (ص 111).'},
  {q:'في الشكل (5-14)، الأميتر في جانب التيار المتردد موصل:',o:['على التوازي بين الخطين','على التوالي في الخط N','بين N و PE','على حلقات الانزلاق'],c:1,e:'والفولتميتر ومقياس التردد على التوازي.'},
  {q:'الأقطاب البارزة تركب في مولدات:',o:['السرعة العالية','السرعة المنخفضة','التيار المستمر فقط','المحطات النووية فقط'],c:1,e:'«إما بارزة وتركب في المولدات ذات السرعة المنخفضة وإما غاطسه وتركب في مولدات السرعة العالية» (ص 111).'}
 ]
});

/* =====================================================================
   الدرس 6 — المولد التزامني ثلاثي الأوجه (الأشكال 5-15 … 5-17)
   ===================================================================== */
/* ملفات العضو الساكن: مثلث (رأسه أعلى) أو نجمة */
function deltaW(S,cx,cy,R,net,lab){const P=[[cx,cy-R],[cx-R*0.87,cy+R*0.5],[cx+R*0.87,cy+R*0.5]];
  [[0,1],[1,2],[2,0]].forEach(([a,b])=>{wire(S,[P[a],P[b]],net);const mx=(P[a][0]+P[b][0])/2,my=(P[a][1]+P[b][1])/2,ang=Math.atan2(P[b][1]-P[a][1],P[b][0]-P[a][0])*180/Math.PI;
    S.add(c=>`<rect x="${r1(mx-R*0.32)}" y="${r1(my-4.5)}" width="${r1(R*0.64)}" height="9" transform="rotate(${r1(ang)} ${r1(mx)} ${r1(my)})" style="fill:${c==='flow'?'var(--live)':'var(--fg)'}"/>`,net)});
  P.forEach(p=>term(S,p[0],p[1]));if(lab)[[0,lab[0],0,-9],[1,lab[1],-10,6],[2,lab[2],10,6]].forEach(([i,t,dx,dy])=>txt(S,P[i][0]+dx,P[i][1]+dy,t,{a:dx<0?'end':dx>0?'start':'middle',sz:10.5}));return P}
function starW(S,cx,cy,R,net,lab){const P=[[cx,cy-R],[cx-R*0.87,cy+R*0.5],[cx+R*0.87,cy+R*0.5]];
  P.forEach(p=>{wire(S,[p,[cx,cy]],net);const mx=(p[0]+cx)/2,my=(p[1]+cy)/2,ang=Math.atan2(cy-p[1],cx-p[0])*180/Math.PI;S.add(c=>`<rect x="${r1(mx-R*0.3)}" y="${r1(my-4.5)}" width="${r1(R*0.6)}" height="9" transform="rotate(${r1(ang)} ${r1(mx)} ${r1(my)})" style="fill:${c==='flow'?'var(--live)':'var(--fg)'}"/>`,net)});
  dot(S,cx,cy);P.forEach(p=>term(S,p[0],p[1]));if(lab)[[0,lab[0],0,-9],[1,lab[1],-10,6],[2,lab[2],10,6]].forEach(([i,t,dx,dy])=>txt(S,P[i][0]+dx,P[i][1]+dy,t,{a:dx<0?'end':dx>0?'start':'middle',sz:10.5}));return P}
/* الشكل (5-15): الدائرة التنفيذية لمولد ثلاثي الأوجه ملفاته مثلث */
function fig515(o){o=o||{};const S=Sc(o.W||470,350,'الدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه'),k=n=>o.steps?n:0;
  S.at(k(1));['L1','L2','L3','PE'].forEach((l,i)=>{wire(S,[[24,22+i*12],[210,22+i*12]],i<3?'b':null,i===3?'pe':null);txt(S,20,26+i*12,l,{a:'end'})});
  [70,100,130].forEach((x,i)=>{dot(S,x,22+i*12);wire(S,[[x,22+i*12],[x,84]],'b');fuse(S,x,95,'b');wire(S,[[x,106],[x,120]],'b');cont(S,x,120,144,o.q,'ac')});qlink(S,40,124,132,'h');
  S.at(k(2));const P=deltaW(S,100,240,50,'st');wire(S,[[100,144],[100,P[0][1]]],'ac');wire(S,[[70,144],[70,166],[30,166],[30,P[1][1]],[P[1][0],P[1][1]]],'ac');wire(S,[[130,144],[130,166],[170,166],[170,P[2][1]],[P[2][0],P[2][1]]],'ac');
  dot(S,196,58);wire(S,[[196,58],[196,300]],null,'pe');gnd(S,196,300);
  rotorDC(S,{rx:262,ry:262,rr:30,dx:370,dy:130,rot:o.rot,qdc:o.qdc,pos:o.pos,k,s:[3,4],mv:o.mv});
  if(o.sld)o.sld(S,k);
  return S}
/* المخطط الخطي للشكل (5-16) ثم (5-17): رموز المحولات وأجهزة القياس */
const ctSym=(S,x,y)=>S.add(`<path d="M${x-9} ${y}A9 9 0 0 0 ${x+9} ${y}" style="${SK}"/><path d="M${x+9} ${y}H${x+24}" style="${SK}"/>`);
const tr2=(S,x,y,a,b)=>S.add(`<circle cx="${x}" cy="${y-8}" r="11" style="fill:none;stroke:var(--fg);stroke-width:1.4"/><circle cx="${x}" cy="${y+8}" r="11" style="fill:none;stroke:var(--fg);stroke-width:1.4"/>`+T(x,y-6,a,{sz:9})+T(x,y+14,b,{sz:9}));
function sld516(S,x,y,k){k=k||(()=>0);S.at(k(1));txt(S,x,y-10,'L1,L2,L3.N,PE, 33K.V',{sz:10});y=sld(S,x,y,[['bar',''],['n',3,1],['fuse',''],['n',3,1],['sw','','h']]);
  S.at(k(2));ctSym(S,x,y+10);wire(S,[[x,y],[x,y+30]]);dot(S,x,y+24);wire(S,[[x,y+24],[x+40,y+24]]);fuseH(S,x+54,y+24);wire(S,[[x+64,y+24],[x+76,y+24]]);tr2(S,x+88,y+24,'Y','Y');txt(S,x+105,y+4,'3',{sz:9.5,a:'start'});y+=30;
  S.at(k(3));wire(S,[[x,y],[x,y+12]]);dot(S,x,y+12);txt(S,x+12,y+16,'33Kv',{a:'start',sz:10});tr2(S,x,y+33,'△','Y');wire(S,[[x,y+52],[x,y+62]]);dot(S,x,y+62);txt(S,x+12,y+66,'3.3Kv',{a:'start',sz:10});y+=62;
  S.at(k(4));y=sld(S,x,y,[['sw','','h']]);txt(S,x+24,y+6,'3~Y',{a:'start',sz:9.5});y=sld(S,x,y,[['G','G','',0]]);
  S.at(k(5));y=sld(S,x,y,[['w',6],['sw','','h']]);wire(S,[[x,y],[x,y+8]]);dcm(S,x,y+32,'G');txt(S,x+22,y+36,'220v Dc',{a:'start',sz:9.5});return y+56}
function sld517(S,x,y,k){k=k||(()=>0);S.at(k(1));txt(S,x,y-10,'L1,L2,L3.N,PE, 33K.V',{sz:10});y=sld(S,x,y,[['bar',''],['n',3,1],['fuse',''],['n',3,1],['sw','','h']]);
  S.at(k(2));ctSym(S,x,y+10);txt(S,x-14,y+14,'3',{a:'end',sz:9.5});wire(S,[[x,y],[x,y+30]]);dot(S,x,y+24);wire(S,[[x,y+24],[x+40,y+24]]);fuseH(S,x+54,y+24);wire(S,[[x+64,y+24],[x+76,y+24]]);tr2(S,x+88,y+24,'Y','Y');y+=30;
  S.at(k(3));['3 A','W 3~','φ','~','V'].forEach((t,i)=>meter(S,x+140,y-50+i*26,t,null,11));
  S.at(k(4));y=sld(S,x,y,[['n',5,1]]);txt(S,x+24,y+6,'3~Y',{a:'start',sz:9.5});y=sld(S,x,y,[['G','G','',0]]);
  S.at(k(5));y=sld(S,x,y,[['w',6],['sw','','h']]);wire(S,[[x,y],[x,y+8]]);dcm(S,x,y+32,'G');txt(S,x+22,y+30,'220v Dc',{a:'start',sz:9.5});meter(S,x+100,y+24,'V',null,10);meter(S,x+126,y+24,'A',null,10);return y+56}
/* الدائرة التنفيذية للشكل (5-17) مبسطة: نجمة U-V-W ونقطة التعادل N وأجهزة القياس على محولات القياس */
function fig517x(o){o=o||{};const S=Sc(470,330,'الدائرة التنفيذية لمولد ثلاثي الأوجه نجمة'),k=n=>o.steps?n:0;
  S.at(k(1));[['L1',0],['L2',0],['L3',0],['N','n'],['PE','pe']].forEach(([l,d],i)=>{wire(S,[[24,20+i*12],[220,20+i*12]],null,d||null);txt(S,20,24+i*12,l,{a:'end'})});txt(S,120,11,'L1,L2,L3.N,PE, 33K.V',{sz:10});
  [80,110,140].forEach((x,i)=>{dot(S,x,20+i*12);wire(S,[[x,20+i*12],[x,84]]);fuse(S,x,95);wire(S,[[x,106],[x,118]]);cont(S,x,118,140,false)});qlink(S,50,134,129,'h');
  S.at(k(2));[80,110,140].forEach((x,i)=>{wire(S,[[x,140],[x,206]]);S.add(`<rect x="${x-3}" y="158" width="6" height="16" style="fill:var(--fg)"/><path d="M${x+7} 156V176" style="stroke:var(--fg);stroke-width:1.2"/>`);wire(S,[[x+7,156],[x+7,150-i*6],[300,150-i*6]]);dot(S,x,190);wire(S,[[x,190-i*0],[x+0,190]])});
  [0,1,2].forEach(i=>{wire(S,[[80+30*i,190+i*5],[180,190+i*5]]);dot(S,80+30*i,190+i*5)});fuseH(S,195,190);fuseH(S,195,195);fuseH(S,195,200);
  S.add(`<rect x="214" y="182" width="26" height="26" style="${SK}"/>`+T(227,199,'VT',{sz:9}));wire(S,[[240,195],[300,195]]);
  S.at(k(3));['A','A','A','W','φ','~','V'].forEach((t,i)=>meter(S,300+i*24,120,t==='W'?'W':t,null,10));txt(S,372,98,'3~ / φ / Hz / V',{sz:9,m:1});S.add(`<rect x="370" y="140" width="44" height="30" style="${SK}"/>`+T(392,152,'L1,L2',{sz:7})+T(392,160,'L1,L3',{sz:7})+T(392,168,'L2,L3',{sz:7}));
  S.at(k(4));const P=starW(S,110,262,40,null,['U','V','W']);void P;
  wire(S,[[80,206],[80,214],[P[1][0],P[1][1]]]);wire(S,[[110,206],[110,P[0][1]]]);wire(S,[[140,206],[140,214],[P[2][0],P[2][1]]]);dot(S,30,56);wire(S,[[30,56],[30,262],[110,262]],null,'n');
  dot(S,40,68);wire(S,[[40,68],[40,300]],null,'pe');gnd(S,40,300);
  S.at(k(5));rotorDC(S,{rx:270,ry:280,rr:26,dx:390,dy:210,title:'220v Dc',k,s:[5,5]});
  return S}

/* ---------- مختبر المولد ثلاثي الأوجه: التوصيل نجمة/مثلث والأوجه المزاحة 120° ---------- */
function labSG3(el){
  const st={con:'Y',drive:0,qdc:0,meas:'LL'};const w={};
  el.innerHTML=`<div class="grid"><div class="panel c12"><h2>مختبر المولد التزامني ثلاثي الأوجه <small>مبني على الأشكال (5-15) ص 113 و(5-16) ص 114 و(5-17) ص 116</small></h2>
    <div class="wrap-in" id="ctl" style="align-items:flex-end"></div><div class="wrap-in" style="padding-top:0"><div class="reads" id="rd" style="margin-inline-start:0"></div></div><div class="callout" id="say"></div></div>
   <div class="panel c7"><h2>ملفات العضو الساكن والأوجه الثلاثة</h2><p class="sub">يساراً توصيل الملفات، ويميناً متجهات جهود الأوجه الثلاثة وهي تدور. الخط المتقطع = الجهد الذي يقيسه الفولتميتر. رسم نوعي بلا أرقام.</p><div class="svgbox" id="fig" style="max-width:560px;margin-inline:auto"></div></div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['أدر المولد ونبّه أقطابه: تظهر ثلاثة متجهات متساوية بينها 120°.','في النجمة قِس بين خطين ثم بين خط و N: جهد الخط أكبر.','بدّل إلى المثلث: لا توجد نقطة تعادل N، وجهد الخط = جهد الوجه.'])}</div></div>`;
  const $=s=>el.querySelector(s);let th=0;
  $('#ctl').innerHTML=`<div><div class="sub">توصيل ملفات العضو الساكن</div>${segHTML('cn',[['Y','نجمة (الشكلان 5-16، 5-17)'],['D','مثلث (الشكل 5-15)']],st.con)}</div>${swHTML('sDr','~','إدارة المولد',0)}${swHTML('sDc','DC','تغذية الأقطاب',0)}
    <div><div class="sub">الفولتميتر بين</div>${segHTML('ms',[['LL','L1 و L2'],['LN','L1 و N']],st.meas)}</div>`;
  const draw=()=>{const on=st.drive&&st.qdc,S=Sc(520,260,'ملفات العضو الساكن ومتجهات الأوجه');const net=on?'flow':'';
    ['L1','L2','L3'].forEach((l,i)=>{const x=40+i*60;wire(S,[[x,16],[x,40]],'x');txt(S,x,12,l,{sz:10.5})});
    let P;if(st.con==='Y'){P=starW(S,100,150,58,'x',['V','U','W']);txt(S,100,236,'N',{sz:10.5});wire(S,[[100,150],[100,226]],'x','n')}else P=deltaW(S,100,150,62,'x',['V','U','W']);
    wire(S,[[40,40],[40,60],[16,60],[16,P[1][1]],[P[1][0],P[1][1]]],'x');wire(S,[[100,40],[100,P[0][1]]],'x');wire(S,[[160,40],[160,60],[184,60],[184,P[2][1]],[P[2][0],P[2][1]]],'x');
    const cx=350,cy=130,R=on?80:0,tip=a=>[cx+R*Math.cos(a),cy-R*Math.sin(a)],cols=['--stop','--live','--blue'];
    S.add(`<circle cx="${cx}" cy="${cy}" r="84" style="fill:none;stroke:var(--line);stroke-dasharray:3 4"/>`);
    const ph=[0,1,2].map(i=>th-i*2*Math.PI/3);
    if(on){ph.forEach((a,i)=>{const t=tip(a);S.add(`<path d="M${cx} ${cy}L${r1(t[0])} ${r1(t[1])}" style="stroke:var(${cols[i]});stroke-width:3"/>`+ah(t[0],t[1],t[0]-cx,t[1]-cy,9,`var(${cols[i]})`)+T(t[0]+(t[0]-cx)*0.16,t[1]+(t[1]-cy)*0.16+4,'L'+(i+1),{sz:10}))});
      if(st.meas==='LL'&&st.con==='Y'){const a=tip(ph[0]),b=tip(ph[1]);S.add(`<path d="M${r1(b[0])} ${r1(b[1])}L${r1(a[0])} ${r1(a[1])}" style="stroke:var(--fg);stroke-width:2;stroke-dasharray:5 4"/>`)}
      else if(st.meas==='LN'||st.con==='D'){const a=tip(ph[0]);S.add(`<path d="M${cx} ${cy}L${r1(a[0])} ${r1(a[1])}" style="stroke:var(--fg);stroke-width:2;stroke-dasharray:5 4"/>`)}
      {const q=(a,r)=>[r1(cx+r*Math.cos(a)),r1(cy-r*Math.sin(a))],p0=q(ph[1],24),p1=q(ph[0],24),pm=q(ph[0]-Math.PI/3,38);S.add(`<path d="M${p0[0]} ${p0[1]}A24 24 0 0 0 ${p1[0]} ${p1[1]}" style="fill:none;stroke:var(--muted)"/>`+T(pm[0],pm[1]+4,'120°',{sz:10,m:1}))}}
    else S.add(T(cx,cy+4,'0',{m:1}));
    $('#fig').innerHTML=S.svg({cls:n=>n==='x'?net:''})};
  const render=()=>{if(st.con==='D'&&st.meas==='LN')st.meas='LL';Object.assign(w,st);
    el.querySelectorAll('[data-cn]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cn===st.con)));el.querySelectorAll('[data-ms]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.ms===st.meas));if(b.dataset.ms==='LN')b.disabled=st.con==='D'});
    $('#sDr').setAttribute('aria-pressed',String(!!st.drive));$('#sDc').setAttribute('aria-pressed',String(!!st.qdc));
    const on=st.drive&&st.qdc,Y=st.con==='Y';
    $('#rd').innerHTML=`<div class="read"><span>العلاقة في هذا التوصيل</span><b style="font-family:inherit">${Y?B.tex('V_L=\\sqrt{3}\\,V_{ph}\\quad I_L=I_{ph}'):B.tex('V_L=V_{ph}\\quad I_L=\\sqrt{3}\\,I_{ph}')}</b></div><div class="read"><span>نقطة التعادل N</span><em class="mode-chip ${Y?'run':''}">${Y?'موجودة':'غير موجودة'}</em></div><div class="read"><span>الفولتميتر يقرأ</span><em class="mode-chip star">${!on?'صفر':Y&&st.meas==='LL'?'جهد الخط (الأكبر)':Y?'جهد الوجه':'جهد الخط = جهد الوجه'}</em></div>`;
    $('#say').innerHTML=!st.drive?'المولد متوقف. شغّل الإدارة.':!st.qdc?'المولد يدور لكن الأقطاب بلا تيار مستمر: لا جهد.':
      `في العضو الساكن «٣ أفرع ملفات منفصلة مرتبة بحيث تكون مزاحة \\(120^\\circ\\) بالنسبة إلى بعضها البعض يمكن أن توصل نجمة أو مثلث» (ص 113). ${Y?(st.meas==='LL'?'جهد الخط هو الفرق بين متجهي وجهين (الخط المتقطع)، وهو أطول من متجه الوجه: \\(V_L=\\sqrt{3}\\,V_{ph}\\).':'بين خط ونقطة التعادل N نقيس جهد الوجه نفسه.'):'في المثلث كل ملف موصول بين خطين مباشرة، فجهد الخط يساوي جهد الوجه، ولا توجد نقطة تعادل.'}`;
    B.math&&B.math(el);draw()};
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;if(t.dataset.cn)st.con=t.dataset.cn;else if(t.dataset.ms){st.meas=t.dataset.ms;w['m'+st.con+st.meas]=1}else if(t.id==='sDr')st.drive^=1;else if(t.id==='sDc')st.qdc^=1;else return;render();G.check()});
  const G=stepsUI($('#gs'),[
    {t:'شغّل المولد ونبّهه',x:'شغّل «إدارة المولد» و«تغذية الأقطاب»: تظهر ثلاثة متجهات متساوية تدور، بين كل اثنين 120°.',done:w=>w.drive&&w.qdc},
    {t:'جهد الخط في النجمة',x:'في توصيل النجمة اختر الفولتميتر بين L1 و L2: الخط المتقطع أطول من متجه الوجه.',done:w=>w.drive&&w.qdc&&w.con==='Y'&&w.meas==='LL'},
    {t:'جهد الوجه في النجمة',x:'اختر الفولتميتر بين L1 و N: يقرأ جهد الوجه.',done:w=>w.drive&&w.qdc&&w.con==='Y'&&w.meas==='LN'},
    {t:'توصيل المثلث',x:'بدّل إلى «مثلث» (كما في الشكل 5-15): لا يوجد N، وجهد الخط = جهد الوجه.',done:w=>w.drive&&w.qdc&&w.con==='D'}
  ],()=>w);
  render();loopOn(el,dt=>{if(st.drive&&st.qdc){th+=dt*1.2;draw()}})}

B.lesson({
 id:'u5-l6',unit:5,order:6,pages:'113–116',
 title:'المولد التزامني ثلاثي الأوجه',
 summary:'ملفات العضو الساكن الثلاثة المزاحة 120° وتوصيلها مثلثاً أو نجمة، والدائرة التنفيذية لمولد ملفاته مثلث، ورفع جهد المولد بمحول قدرة مع محولات القياس وأجهزة القياس.',
 stations:[
  {intro:true},
{st:1,short:'ثلاثة ملفات مزاحة',title:'5-3-2 الدائرة الكهربية الممثلة للمولدات التزامنية ثلاثية الأوجه',ref:'ص 113',
   q:'ثلاثة ملفات في العضو الساكن نفسه… لماذا لا توضع متجاورة بل مزاحة بعضها عن بعض؟',
   art:U5S.art({S:(()=>{const S=Sc(240,210,'ثلاثة ملفات مزاحة');starW(S,120,118,74,null,['U','V','W']);
     const a0=-90*Math.PI/180,a1=30*Math.PI/180,r=34,p=a=>[120+r*Math.cos(a),118+r*Math.sin(a)];const P0=p(a0),P1=p(a1);
     S.add(`<path d="M${r1(P0[0])} ${r1(P0[1])}A${r} ${r} 0 0 1 ${r1(P1[0])} ${r1(P1[1])}" style="fill:none;stroke:var(--live);stroke-width:2.2"/>`+T(160,84,'120°',{sz:12,b:1}));return S})(),label:'ثلاثة ملفات للعضو الساكن مزاحة 120 درجة',bg:'#E3ECF7',title:'ثلاثة أفرع، والزاوية بينها ثابتة',
    tips:[[106,40,28,48,'الملف الأول ⟦U⟧: أحد الأفرع الثلاثة لملفات عضو الاستنتاج.'],[56,110,52,44,'الملف الثاني ⟦V⟧.'],[132,110,52,44,'الملف الثالث ⟦W⟧.'],[140,70,46,30,'الإزاحة ⟦120°⟧ بين كل ملفين (ص 113): لذلك تتأخر موجة كل وجه عن الذي قبله ثلث دورة.']]}),
   cap:'رسم توضيحي للأفرع الثلاثة المزاحة <span class="ltr">120°</span> (هنا موصلة نجمة).<br><b>مرّر المؤشر على الملفات والزاوية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب النص، على ماذا يعتمد تردد الجهد المتولد؟',opts:[
     ['على تيار التنبيه',false,'تيار التنبيه يغيّر الجهد لا التردد.'],
     ['على نوع التوصيل نجمة أو مثلث',false,'التوصيل يغيّر علاقة جهد الخط بجهد الوجه.'],
     ['على عدد أزواج الأقطاب وسرعة دوران المولد',true,'«تردد الجهد المتردد يعتمد على عدد أزواج الأقطاب وسرعة دوران المولد» (ص 113).']]}}
   ],
   body:[
    {book:String.raw`<p>يتركب المولد التزامني ثلاثي الأوجه من هيكل خارجي وغطاءين جانبيين ، في المحيط الداخلي للهيكل رقائق حديدية مثبتة فيها فتحات المجاري التي تحمل ملفات عضو الاستنتاج حيث يكون ٣ أفرع ملفات منفصلة مرتبة بحيث تكون مزاحة \(120^\circ\) بالنسبة إلى بعضها البعض يمكن أن توصل نجمة أو مثلث. تردد الجهد المتردد يعتمد على عدد أزواج الأقطاب وسرعة دوران المولد.</p>`,ref:'ص 113'},
    {tip:String.raw`<p>عندما يمر قطب دوار أمام الملف الأول يكون جهده في قمته، ثم بعد ثلث دورة يمر أمام الثاني، ثم الثالث. لذلك نحصل على ثلاثة جهود متساوية، كل واحد متأخر عن الذي قبله <span class="ltr">120°</span>.</p><p>وكلما أسرع الدوران، أو زاد عدد أزواج الأقطاب، مرّ عدد أكبر من الأقطاب أمام الملف في الثانية فزاد التردد.</p>`,title:'من أين تأتي الإزاحة؟'},
    {title:'مختبر مصغّر: ما الذي يرفع التردد؟',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر عدد أزواج الأقطاب وسرعة الدوران، وراقب التردد (شريط نوعي بلا أرقام).',
     predict:{q:'ضاعفنا سرعة الدوران وأبقينا عدد أزواج الأقطاب. ماذا يحدث للتردد؟',opts:[
      ['يقل',false,'الأقطاب تمر أمام الملف أسرع، فلا يقل التردد.'],
      ['لا يتغير',false,'التردد يعتمد على السرعة (ص 113).'],
      ['يزداد',true,'عدد الأقطاب التي تمر أمام الملف في الثانية يزداد، فيزداد التردد.']]},
     ins:[{k:'p',l:'عدد أزواج الأقطاب',seg:[[1,'زوج واحد'],[2,'زوجان']],v:1},{k:'n',l:'سرعة الدوران',seg:[[1,'أبطأ'],[2,'أسرع (الضعف)']],v:1}],
     calc:s=>{const k=s.p*s.n;return {bars:[{l:'التردد (نوعياً)',v:k,max:4,txt:k===1?'منخفض':k===2?'الضعف':'أربعة أضعاف',col:'--blue'}],
      msg:k===1?'نقطة البداية.':k===2?(s.p===2?'ضاعفنا أزواج الأقطاب فتضاعف التردد.':'ضاعفنا السرعة فتضاعف التردد.'):'ضاعفنا الاثنين فصار التردد أربعة أضعاف.'}}})}
   ]},

  {st:2,short:'الدائرة (5-15)',title:'الشكل <span class="ltr">(5-15)</span>: الدائرة التنفيذية لمولد ثلاثي الأوجه ملفاته مثلث',ref:'ص 113',
   q:'الجهد المتولد يذهب إلى القضبان العمومية مباشرة… فما الذي يقع بين الملفات والقضبان؟',
   art:U5S.art({S:fig515(),vb:[14,12,300,300],label:'الشكل (5-15) الدائرة التنفيذية لمولد ثلاثي الأوجه ملفاته مثلث',bg:'#DDEFE6',title:'مثلث على القضبان مباشرة',
    tips:[[14,14,200,44,'القضبان العمومية ⟦L1 L2 L3⟧ وخط الأرضي ⟦PE⟧ (شرطة-نقطة).'],[58,82,84,28,'ثلاثة مصاهر، واحد على كل خط.'],[38,114,104,34,'القاطع الرئيس: يدوي هوائي ثلاثي الأقطاب.'],[44,184,112,92,'ملفات العضو الساكن (عضو الاستنتاج) موصلة مثلث: على كل ضلع ملف.'],[228,228,68,68,'العضو الدوار (الأقطاب) يتغذى بالتيار المستمر.']]}),
   cap:'الشكل <span class="ltr">(5-15)</span> ص 113 (الجزء الأيسر).<br><b>مرّر المؤشر على القضبان والقاطع والمثلث والعضو الدوار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (5-15)، ما نوع القاطع الرئيس لدائرة التيار المتغير؟',opts:[
     ['يدوي هوائي',true,'«والقاطع الرئيس لدائرة التيار المتغير من النوع اليدوي الهوائي» (ص 113).'],
     ['أوتوماتيكي بأزرار',false,'القاطع الأوتوماتيكي يظهر في التمرين (٤).'],
     ['مصهر فقط',false,'المصاهر موجودة، لكن القاطع شيء آخر.']]}}
   ],
   body:[
    {book:String.raw`<p>والشكل ${FN('5-15')} يبين الدائرة التنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج الموصلة ملفاته على شكل مثلث، ويوصل الضغط المتغير المتولد في ملفات عضو الاستنتاج إلى القضبان العمومية مباشرة والقاطع الرئيس لدائرة التيار المتغير من النوع اليدوي الهوائي أما العضو الدائر (الأقطاب) فتتغذى ملفاته من قضبان توزيع التيار المستمر عن طريق حلقات انزلاق وفرش كما يتم تنظيم تيار التنبيه بمنظم جهد (مقاومة متغيرة) موصلة في دائرة التيار المستمر.</p>`,ref:'ص 113'},
    {html:U5S.fig(box(fig515().svg(),520),540,'<b>الشكل <span class="ltr">(5-15)</span> الدائرة التنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه</b> (ص 113) — القضبان L1، L2، L3، PE، ثلاثة مصاهر ومفتاح ثلاثي الأقطاب، ثم ملفات العضو الساكن <b>مثلث</b> (L2 إلى الرأس العلوي، L1 إلى الرأس الأيسر، L3 إلى الرأس الأيمن)، والأقطاب الدوارة تتغذى من <span class="ltr">110vDC</span> عبر مقاومة متغيرة وحلقتي انزلاق.')},
    {tip:String.raw`<p>«الضغط» في لغة الكتاب يعني الجهد. والرسم يتكون من دائرتين لا يربطهما سلك: <b>دائرة التيار المتردد</b> (القضبان ← المصاهر ← القاطع ← المثلث) و<b>دائرة التيار المستمر</b> (القضبان ← المصهران ← المفتاح ← المقاومة المتغيرة ← الحلقتان ← الأقطاب).</p>`,title:'دائرتان في رسم واحد'},
    {title:'مختبر مصغّر: أسئلة على الشكل',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'إلى أين يذهب الجهد المتولد في ملفات عضو الاستنتاج؟',opts:[['إلى محول رفع أولاً',false,'هذا في الشكل (5-16)، لا هنا.'],['إلى القضبان العمومية مباشرة',true,'«ويوصل الضغط المتغير المتولد… إلى القضبان العمومية مباشرة» (ص 113).'],['إلى حلقات الانزلاق',false,'حلقات الانزلاق في دائرة التيار المستمر للأقطاب.']]},
     {q:'ما الذي يغيّر تيار التنبيه في هذا المولد؟',opts:[['منظم الجهد (المقاومة المتغيرة) في دائرة التيار المستمر',true,'كما في المولد أحادي الوجه.'],['القاطع اليدوي الهوائي',false,'القاطع يصل المولد بالقضبان أو يفصله.'],['المصاهر',false,'المصاهر للحماية.']]}]})}
   ]},

  {st:3,short:'رفع الجهد بمحول (5-16)',title:'رفع جهد المولد بمحول — الشكل <span class="ltr">(5-16)</span>',ref:'ص 114',
   q:'المولد يعطي <span class="ltr">3.3 kV</span> والقضبان <span class="ltr">33 kV</span>… فماذا يقع بينهما؟',
   art:U5S.art({S:(()=>{const S=Sc(260,480,'المخطط الخطي');sld516(S,90,40);return S})(),vb:[40,130,180,190],label:'الجزء الأوسط من المخطط الخطي للشكل (5-16): محولات القياس ومحول القدرة والمولد',bg:'#FBE6C4',title:'محول قدرة بين المولد والقضبان',
    tips:[[72,142,38,22,'محول التيار: حلقة حول الخط تغذي أجهزة قياس التيار.'],[160,140,40,48,'محول الجهد ⟦Y/Y⟧ (فرع عبر مصهر): يغذي أجهزة قياس الجهد.'],[70,182,44,50,'محول القدرة الرافع: ⟦△⟧ على جانب ⟦33 kV⟧ و⟦Y⟧ على جانب ⟦3.3 kV⟧.'],[100,180,40,16,'جانب ⟦33 kV⟧ (القضبان).'],[100,230,48,16,'جانب ⟦3.3 kV⟧ (المولد).'],[66,262,48,48,'المولد ⟦3~Y⟧: ثلاثي الأوجه، ملفاته نجمة.']]}),
   cap:'المخطط الخطي للشكل <span class="ltr">(5-16)</span> ص 114.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما وظيفة محول القدرة في الشكل (5-16)؟',opts:[
     ['خفض جهد القضبان ليناسب المولد',false,'الاتجاه عكسي: من المولد إلى القضبان.'],
     ['رفع جهد المولد من 3.3 kV إلى 33 kV',true,'«ويرفع الجهد المتغير المتولد من المولد باستخدام محول قدرة رفع Δ/Y إلى 33 kV» (ص 114).'],
     ['تشغيل أجهزة القياس',false,'هذه وظيفة محولات القياس (التيار والجهد).']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل ${FN('5-16')} يبين الدائرة الخطية والتنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج توصل ملفاته على شكل نجمة وجهد<span class="ltr">3.3kV</span> تيار متغير وتغذى أقطابه عن طريق مغذٍ بالتيار المستمر بضغط<span class="ltr">220 V</span> ويرفع الجهد المتغير المتولد من المولد باستخدام محول قدرة رفع <span class="ltr">Δ/Y</span> إلى <span class="ltr">33 kV</span> حيث يصل إلى القضبان العمومية المقننة لهذا الجهد علاوة على أجهزة قياس الجهد والتيار باستخدام محولات تيار ومحول جهد ثلاثي الأوجه <span class="ltr">Y/ Y</span> وذلك في دائرة التيار المتغير ، كذلك شدة التيار وجهد التيار المستمر المغذي للأقطاب باستخدام أميتر وفولت ميتر.</p>`,ref:'ص 114'},
    {html:U5S.fig(box((()=>{const S=Sc(260,480,'المخطط الخطي');sld516(S,90,40);return S})().svg(),260),280,'<b>الشكل <span class="ltr">(5-16)</span> الدائرة الخطية لمولد تيار متغير ثلاثي الأوجه يرفع الجهد المتولد باستخدام محول</b> (ص 114) — من أعلى: قضبان <span class="ltr">33 kV</span>، مصهر، مفتاح، محول تيار ومنه فرع عبر مصهر إلى محول جهد <span class="ltr">Y/Y</span>، ثم محول القدرة، مفتاح، المولد <span class="ltr">3~Y</span>، مفتاح، ثم المثير (<span class="ltr">220v Dc</span>).')},
    {tip:String.raw`<p>نصفها بنوداً لأن رسمها في الكتاب ممسوح بخط صغير: (1) خمسة قضبان L1، L2، L3، N، PE (<span class="ltr">33K.V 60Hz</span>)؛ (2) ثلاثة مصاهر ومفتاح ثلاثي الأقطاب؛ (3) ثلاثة محولات تيار وأمامها ثلاثة أميترات A، وأطراف الثانويات السفلية مجمعة ومؤرّضة؛ (4) فولتميتر واحد مع مبدّل فولتميتر (L1,L2 / L1,L3 / L2,L3)؛ (5) محول جهد بثلاثة مصاهر صغيرة؛ (6) محول القدرة: جانب <span class="ltr">33 kV</span> مثلث △؛ (7) جانب <span class="ltr">3.3 kV</span> نجمة Y؛ (8) مفتاح ثلاثي الأقطاب ثانٍ؛ (9) ملفات العضو الساكن نجمة ونقطتها متصلة بالخط N؛ (10) تأريض PE؛ (11) العضو الدوار وحلقتا الانزلاق ومفتاح ثنائي القطب <span class="ltr">220v Dc</span>؛ (12) المثير: مولد تيار مستمر G وفولتميتران، وملف مجال توازٍ على التوالي مع مقاومة متغيرة.</p>`,title:'الدائرة التنفيذية للشكل (5-16) بنوداً'},
    {watch:'النص (ص 114) يقول «محول قدرة رفع Δ/Y» بينما الرسم يجعل جانب <span class="ltr">33 kV</span> مثلثاً وجانب <span class="ltr">3.3 kV</span> (جهة المولد) نجمة. والنص يذكر «أميتر وفولت ميتر» للتيار المستمر بينما المرسوم فولتميتران. والتردد في هذا الشكل <span class="ltr">60Hz</span> بينما هو في الشكلين <span class="ltr">(5-13)</span> و<span class="ltr">(5-14)</span> <span class="ltr">50Hz</span>. رسمنا المخطط الخطي كما طُبع.'},
    {add:String.raw`<p>لماذا نرفع الجهد؟ لنقل القدرة نفسها بتيار أصغر: فيقل الفقد الحراري في الخطوط وتصغر مقاطع الموصلات. لذلك تُرفع جهود المولدات قبل ربطها بشبكة النقل.</p>`,title:'لماذا نرفع الجهد؟'},
    {title:'مختبر مصغّر: رتّب المخطط الخطي',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب رموز الشكل (5-16) من القضبان (أعلى) إلى المثير (أسفل).',steps:[
     ['قضبان <span class="ltr">33 kV</span>','نبدأ من القضبان العمومية أعلى الرسم.'],['المصهر ثم المفتاح','الحماية والفصل مباشرة تحت القضبان.'],['محول التيار ومحول الجهد للقياس','محولات القياس على الخط قبل محول القدرة.'],['محول القدرة (△ و Y)','يقع بين جانب 33 kV وجانب 3.3 kV.'],['المفتاح ثم المولد <span class="ltr">3~Y</span>','المولد على جانب الجهد المنخفض.'],['المثير (مولد تيار مستمر <span class="ltr">220v Dc</span>)','المثير في أسفل الرسم يغذي الأقطاب.']],done:'هذا هو ترتيب الشكل (5-16).'})}
   ]},

  {st:4,short:'أجهزة القياس (5-17)',title:'الشكل <span class="ltr">(5-17)</span>: المولد مع محولات القياس وأجهزة القياس',ref:'ص 115–116',
   q:'لا يوجد فولتميتر يتحمل <span class="ltr">33 kV</span> مباشرة… فكيف نقرأ جهد هذا المولد؟',
   art:U5S.art({S:fig517x(),vb:[196,86,268,128],label:'أجهزة القياس في الشكل (5-17) ومحول الجهد',bg:'#E3ECF7',title:'محولات القياس تغذي الأجهزة',
    tips:[[288,108,24,24,'أميتر ⟦A⟧ للخط الأول (يغذيه محول تيار).'],[312,108,24,24,'أميتر ⟦A⟧ للخط الثاني.'],[336,108,24,24,'أميتر ⟦A⟧ للخط الثالث.'],[360,108,24,24,'واطميتر ثلاثي الأوجه ⟦W⟧: يحتاج ملفات تيار وملفات جهد.'],[384,108,24,24,'مقياس معامل القدرة ⟦φ⟧.'],[408,108,24,24,'مقياس التردد ⟦~⟧ (⟦Hz⟧).'],[432,108,24,24,'الفولتميتر ⟦V⟧ ومعه مبدّل الفولتميتر تحته.'],[212,180,30,30,'محول الجهد ⟦VT⟧: يخفض الجهد العالي لأجهزة القياس.'],[368,138,48,34,'مبدّل الفولتميتر: يختار الجهد بين ⟦L1,L2⟧ أو ⟦L1,L3⟧ أو ⟦L2,L3⟧.']]}),
   cap:'جزء أجهزة القياس من الدائرة التنفيذية المبسطة للشكل <span class="ltr">(5-17)</span>.<br><b>مرّر المؤشر على الأجهزة ومحول الجهد والمبدّل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا توصل أجهزة القياس عبر محولات قياس؟',opts:[
     ['لرفع الجهد قبل القياس',false,'محولات القياس تخفض ولا ترفع.'],
     ['لخفض الجهد والتيار إلى قيم تناسب الأجهزة',true,'«ومحولات القياس الموصلة بها لخفض الجهد والتيار لتشغيل هذه الأجهزة» (ص 115).'],
     ['لتغذية الأقطاب',false,'الأقطاب تتغذى بالتيار المستمر.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل ${FN('5-17')} يوضح الدائرة الخطية والتنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج توصل ملفاته على شكل نجمة وجهد<span class="ltr">33 kV</span> تيار متغير وتغذى أقطابه عن طريق قضبان توزيع للتيار المستمر خلال حلقات انزلاق وفرش . ويتم تنظيم ضغط المولد بتوصيل مقاومة متغيرة توالٍ مع ملفات التنبيه لمغذي الأقطاب. علاوة على أجهزة القياس اللازمة ومحولات القياس الموصلة بها لخفض الجهد والتيار لتشغيل هذه الأجهزة .</p>`,ref:'ص 115'},
    {html:U5S.fig(box((()=>{const S=fig517x();sld517(S,560,40);return S})().svg().replace('viewBox="0 0 470 330"','viewBox="0 0 720 470"'),700),720,'<b>الشكل <span class="ltr">(5-17)</span> الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه مزود بوقاية حرارية ضد زيادة التيار مع أجهزة القياس المختلفة</b> (ص 116) — يساراً الدائرة التنفيذية (مبسطة): محولات تيار على الخطوط الثلاثة تغذي ثلاثة أميترات وملفات التيار في الواطميتر ثلاثي الأوجه ومقياس معامل القدرة φ؛ ومحول جهد ثلاثي الأوجه (VT) يغذي ملفات الجهد ومقياس التردد والفولتميتر مع مبدّله؛ وملفات العضو الساكن <b>نجمة U-V-W</b> ونقطتها متصلة بـ N. يميناً الدائرة الخطية: <span class="ltr">3 A</span>، <span class="ltr">W 3~</span>، φ، ~، V.')},
    {watch:'عنوان الشكل <span class="ltr">(5-17)</span> يذكر «مزود بوقاية حرارية ضد زيادة التيار» ولا يظهر في الرسم أي رمز لمرحل حراري (المرسوم أجهزة قياس فقط). ونص ص 115 يصف مولداً «بجهد 33 kV» مباشرة، بينما مولد الشكل <span class="ltr">(5-16)</span> جهده 3.3 kV ويُرفع إلى 33 kV بمحول.'},
    {tip:String.raw`<p>في توصيل النجمة \(V_L=\sqrt{3}\,V_{ph}\) وتوجد نقطة تعادل يخرج منها الخط N (كما في الشكلين 5-16 و5-17)، وفي توصيل المثلث \(V_L=V_{ph}\) ولا توجد نقطة تعادل (الشكل 5-15). هاتان العلاقتان يذكرهما الكتاب في ص 120–121 (الدرس 8).</p>`,title:'نجمة أم مثلث؟'},
    {title:'مختبر مصغّر: من يغذي كل جهاز؟',widget:(el,B)=>DCML.sort(el,B,{intro:'حسب وصف الشكل (5-17): هل يحتاج الجهاز محول التيار، أم محول الجهد، أم الاثنين؟',cats:['محول التيار','محول الجهد','الاثنان'],items:[
     ['الأميتر A',0,'يقيس التيار، فيتغذى من محول تيار.'],['الفولتميتر V',1,'يقيس الجهد، فيتغذى من محول الجهد.'],['مقياس التردد',1,'يحتاج الجهد فقط.'],
     ['الواطميتر ثلاثي الأوجه W',2,'القدرة = جهد × تيار، فله ملفات تيار وملفات جهد.'],['مقياس معامل القدرة φ',2,'يقارن بين الجهد والتيار، فيحتاج الاثنين.']]})}
   ]},

  {recap:[
   'العضو الساكن للمولد ثلاثي الأوجه فيه ثلاثة أفرع ملفات مزاحة <span class="ltr">120°</span>، توصل نجمة أو مثلث (ص 113).',
   'تردد الجهد يعتمد على عدد أزواج الأقطاب وسرعة الدوران؛ والجهد ينظَّم بمقاومة متغيرة في دائرة التنبيه.',
   'الشكل <span class="ltr">(5-15)</span>: ملفات مثلث إلى القضبان مباشرة عبر قاطع يدوي هوائي.',
   'الشكل <span class="ltr">(5-16)</span>: مولد <span class="ltr">3.3 kV</span> نجمة يُرفع جهده بمحول قدرة إلى <span class="ltr">33 kV</span>.',
   'محولات التيار والجهد تخفض القيم العالية لتشغيل أجهزة القياس (الشكل <span class="ltr">(5-17)</span>).']}
],
 theory:[
  {h:'5-3-2 الدائرة الكهربية الممثلة للمولدات التزامنية ثلاثية الأوجه',ref:'ص 113',html:`<p>يتركب المولد التزامني ثلاثي الأوجه من هيكل خارجي وغطاءين جانبيين ، في المحيط الداخلي للهيكل رقائق حديدية مثبتة فيها فتحات المجاري التي تحمل ملفات عضو الاستنتاج حيث يكون ٣ أفرع ملفات منفصلة مرتبة بحيث تكون مزاحة \\(120^\\circ\\) بالنسبة إلى بعضها البعض يمكن أن توصل نجمة أو مثلث. تردد الجهد المتردد يعتمد على عدد أزواج الأقطاب وسرعة دوران المولد. والشكل ${FN('5-15')} يبين الدائرة التنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج الموصلة ملفاته على شكل مثلث، ويوصل الضغط المتغير المتولد في ملفات عضو الاستنتاج إلى القضبان العمومية مباشرة والقاطع الرئيس لدائرة التيار المتغير من النوع اليدوي الهوائي أما العضو الدائر (الأقطاب) فتتغذى ملفاته من قضبان توزيع التيار المستمر عن طريق حلقات انزلاق وفرش كما يتم تنظيم تيار التنبيه بمنظم جهد (مقاومة متغيرة) موصلة في دائرة التيار المستمر.</p>`},
  {fig:FN('5-15'),ref:'ص 113',caption:'الدائرة التنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه — القضبان L1، L2، L3، PE، ثلاثة مصاهر ومفتاح ثلاثي الأقطاب، ثم ملفات العضو الساكن <b>مثلث</b> (L2 إلى الرأس العلوي، L1 إلى الرأس الأيسر، L3 إلى الرأس الأيمن)، والأقطاب الدوارة تتغذى من <span class="ltr">110vDC</span> عبر مقاومة متغيرة وحلقتي انزلاق.',draw:()=>box(fig515().svg(),520)},
  {h:'رفع جهد المولد بمحول',ref:'ص 114',html:`<p>الشكل ${FN('5-16')} يبين الدائرة الخطية والتنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج توصل ملفاته على شكل نجمة وجهد<span class="ltr">3.3kV</span> تيار متغير وتغذى أقطابه عن طريق مغذٍ بالتيار المستمر بضغط<span class="ltr">220 V</span> ويرفع الجهد المتغير المتولد من المولد باستخدام محول قدرة رفع <span class="ltr">Δ/Y</span> إلى <span class="ltr">33 kV</span> حيث يصل إلى القضبان العمومية المقننة لهذا الجهد علاوة على أجهزة قياس الجهد والتيار باستخدام محولات تيار ومحول جهد ثلاثي الأوجه <span class="ltr">Y/ Y</span> وذلك في دائرة التيار المتغير ، كذلك شدة التيار وجهد التيار المستمر المغذي للأقطاب باستخدام أميتر وفولت ميتر.</p>`},
  {fig:FN('5-16'),ref:'ص 114',caption:'الدائرة الخطية لمولد تيار متغير ثلاثي الأوجه يرفع الجهد المتولد باستخدام محول — من أعلى: قضبان <span class="ltr">33 kV</span>، مصهر، مفتاح، محول تيار (حلقة حول الخط) ومنه فرع عبر مصهر إلى محول جهد <span class="ltr">Y/Y</span>، ثم محول القدرة (دائرتان: △ على جانب <span class="ltr">33 kV</span> و Y على جانب <span class="ltr">3.3 kV</span>)، مفتاح، المولد <span class="ltr">3~Y</span>، مفتاح، ثم المثير (مولد تيار مستمر <span class="ltr">220v Dc</span>).',draw:()=>box((()=>{const S=Sc(260,480,'المخطط الخطي');sld516(S,90,40);return S})().svg(),260)},
  {note:'<b>الدائرة التنفيذية للشكل (5-16)</b> (ص 114) — نصفها هنا بنوداً لأن رسمها ممسوح بخط صغير: (1) خمسة قضبان L1، L2، L3، N، PE (<span class="ltr">33K.V 60Hz</span>)؛ (2) ثلاثة مصاهر ومفتاح ثلاثي الأقطاب؛ (3) ثلاثة محولات تيار وأمامها ثلاثة أميترات A، وأطراف الثانويات السفلية مجمعة ومؤرّضة؛ (4) فولتميتر واحد مع مبدّل فولتميتر (L1,L2 / L1,L3 / L2,L3)؛ (5) محول جهد بثلاثة مصاهر صغيرة؛ (6) محول القدرة: جانب <span class="ltr">33 kV</span> مثلث △؛ (7) جانب <span class="ltr">3.3 kV</span> نجمة Y؛ (8) مفتاح ثلاثي الأقطاب ثانٍ؛ (9) ملفات العضو الساكن نجمة ونقطتها متصلة بالخط N؛ (10) تأريض PE؛ (11) العضو الدوار وحلقتا الانزلاق ومفتاح ثنائي القطب <span class="ltr">220v Dc</span>؛ (12) المثير: مولد تيار مستمر G وفولتميتران، وملف مجال توازٍ على التوالي مع مقاومة متغيرة.'},
  {err:'النص (ص 114) يقول «محول قدرة رفع Δ/Y» بينما الرسم يجعل جانب <span class="ltr">33 kV</span> مثلثاً وجانب <span class="ltr">3.3 kV</span> (جهة المولد) نجمة. والنص يذكر «أميتر وفولت ميتر» للتيار المستمر بينما المرسوم فولتميتران. والتردد في هذا الشكل <span class="ltr">60Hz</span> بينما هو في الشكلين (5-13) و(5-14) <span class="ltr">50Hz</span>. رسمنا المخطط الخطي كما طُبع.'},
  {html:`<p>الشكل ${FN('5-17')} يوضح الدائرة الخطية والتنفيذية لتوصيل مولد تيار متغير ثلاثي الأوجه العضو الساكن هو عضو الاستنتاج توصل ملفاته على شكل نجمة وجهد<span class="ltr">33 kV</span> تيار متغير وتغذى أقطابه عن طريق قضبان توزيع للتيار المستمر خلال حلقات انزلاق وفرش . ويتم تنظيم ضغط المولد بتوصيل مقاومة متغيرة توالٍ مع ملفات التنبيه لمغذي الأقطاب. علاوة على أجهزة القياس اللازمة ومحولات القياس الموصلة بها لخفض الجهد والتيار لتشغيل هذه الأجهزة .</p>`},
  {fig:FN('5-17'),ref:'ص 116',caption:'الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه مزود بوقاية حرارية ضد زيادة التيار مع أجهزة القياس المختلفة — يساراً الدائرة التنفيذية (مبسطة): محولات تيار على الخطوط الثلاثة تغذي ثلاثة أميترات وملفات التيار في الواطميتر ثلاثي الأوجه ومقياس معامل القدرة φ؛ ومحول جهد ثلاثي الأوجه (VT) يغذي ملفات الجهد ومقياس التردد والفولتميتر مع مبدّله؛ وملفات العضو الساكن <b>نجمة U-V-W</b> ونقطتها متصلة بـ N. يميناً الدائرة الخطية: <span class="ltr">3 A</span>، <span class="ltr">W 3~</span>، φ، ~، V.',draw:()=>box((()=>{const S=fig517x();sld517(S,560,40);return S})().svg().replace('viewBox="0 0 470 330"','viewBox="0 0 720 470"'),700)},
  {err:'عنوان الشكل (5-17) يذكر «مزود بوقاية حرارية ضد زيادة التيار» ولا يظهر في الرسم أي رمز لمرحل حراري (المرسوم أجهزة قياس فقط). ونص ص 115 يصف مولداً «بجهد 33 kV» مباشرة، بينما مولد الشكل (5-16) جهده 3.3 kV ويُرفع إلى 33 kV بمحول.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في توصيل النجمة \\(V_L=\\sqrt{3}\\,V_{ph}\\) وتوجد نقطة تعادل يخرج منها الخط N (كما في الشكلين 5-16 و5-17)، وفي توصيل المثلث \\(V_L=V_{ph}\\) ولا توجد نقطة تعادل (الشكل 5-15). هاتان العلاقتان يذكرهما الكتاب في ص 120–121 (الدرس 8). و«محولات القياس» تخفض الجهد والتيار العاليين إلى قيم صغيرة تناسب أجهزة القياس.'}
 ],
 lab:(el)=>labSG3(el),
 examples:[
  drawEx({title:'رسم الشكل (5-15) خطوة بخطوة',ref:'ص 113',mw:520,scene:fig515({steps:1}),
   q:'<p>ارسم الدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه ملفات عضوه الساكن مثلث.</p>',
   steps:['ارسم القضبان <b>L1، L2، L3</b> وخط <b>PE</b> (شرطة-نقطة). انزل من كل خط بمصهر، ثم ارسم المفتاح ثلاثي الأقطاب بخط ربط ومقبض.',
    'ارسم المثلث وعلى كل ضلع ملف: صِل L2 بالرأس العلوي، و L1 بالرأس السفلي الأيسر، و L3 بالرأس السفلي الأيمن. وأرّض من خط PE.',
    'ارسم العضو الدوار (دائرة فيها ملف الأقطاب) وطرفيه إلى حلقتي الانزلاق والفرشتين.',
    'ارسم قضيبي التيار المستمر <span class="ltr">110vDC</span> والمصهرين والمفتاح، ثم صِل الخط السالب بالفرشاة العليا، والخط الموجب عبر <b>المقاومة المتغيرة</b> بالفرشاة السفلى.']}),
  drawEx({title:'المخطط الخطي للشكل (5-17) رمزاً رمزاً',ref:'ص 116',mw:300,scene:(()=>{const S=Sc(260,480,'المخطط الخطي');sld517(S,80,40,n=>n);return S})(),
   q:'<p>ارسم الدائرة الخطية لمولد ثلاثي الأوجه نجمة مع محولات القياس وأجهزة القياس.</p>',
   steps:['القضيب (<span class="ltr">L1,L2,L3.N,PE 33K.V</span>)، ثم المصهر والمفتاح وعلى كل منهما شرطة مائلة والرقم 3.',
    '<b>محول التيار</b>: نصف حلقة حول الخط وذيل أفقي. ومن نقطة على الخط فرع عبر مصهر إلى <b>محول الجهد</b> (دائرتان متداخلتان فيهما Y و Y).',
    'أجهزة القياس التي تغذيها محولات القياس: <span class="ltr">3 A</span> (ثلاثة أميترات)، <span class="ltr">W 3~</span> (واطميتر ثلاثي الأوجه)، φ (معامل القدرة)، ~ (التردد)، V.',
    'على الخط شرطة والرقم 5 (خمسة موصلات)، ثم المولد: دائرتان متحدتا المركز فيهما G وفوقهما <span class="ltr">3~Y</span>.',
    'المفتاح، ثم المثير: مولد تيار مستمر G (<span class="ltr">220v Dc</span>) ومعه V و A.']})
 ],
 quiz:[
  {q:'كم فرعاً من الملفات في العضو الساكن للمولد ثلاثي الأوجه، وكم الإزاحة بينها؟',o:['فرعان، 90°','ثلاثة أفرع، 120°','ثلاثة أفرع، 60°','ستة أفرع، 30°'],c:1,e:'(ص 113).'},
  {q:'يعتمد تردد الجهد المتولد على:',o:['تيار التنبيه فقط','عدد أزواج الأقطاب وسرعة الدوران','نوع التوصيل نجمة أو مثلث','عدد المصاهر'],c:1,e:'(ص 113).'},
  {q:'في الشكل (5-15) ملفات العضو الساكن موصلة:',o:['نجمة','مثلث','على التوالي','غير موصلة'],c:1,e:'(ص 113).'},
  {q:'ما فائدة محول الجهد ومحولات التيار في الشكلين (5-16) و(5-17)؟',o:['رفع جهد المولد','خفض الجهد والتيار لتشغيل أجهزة القياس','تغذية الأقطاب','حماية المولد من الصواعق'],c:1,e:'«محولات القياس الموصلة بها لخفض الجهد والتيار لتشغيل هذه الأجهزة» (ص 115).'},
  {q:'في توصيل النجمة، جهد الخط:',o:['يساوي جهد الوجه','\\(\\sqrt{3}\\) مرة جهد الوجه','نصف جهد الوجه','صفر'],c:1,e:'\\(V_L=\\sqrt{3}\\,V_{ph}\\) (ص 120).'},
  {q:'إلى أي جهد يُرفع جهد مولد الشكل (5-16)؟',o:['من 3.3 kV إلى 33 kV','من 33 kV إلى 3.3 kV','من 220 V إلى 380 V','لا يُرفع'],c:0,e:'(ص 114).'}
 ]
});

/* =====================================================================
   الدرس 7 — المحرك الحثي أحادي الوجه (الأشكال 5-18 أ…د و5-19)
   ===================================================================== */
/* t: 'a' مكثف تشغيل مستمر، 'b' مكثف بدء + مرحل تيار، 'c' مكثف بدء ومكثف تشغيل، 'd' القطب المظلل. o.rel: تلامس المرحل مغلق */
function fig518(t,o){o=o||{};const S=Sc(240,185,'محرك أحادي الوجه');
  if(t==='d'){frame(S,30,20,180,150);term(S,50,48);term(S,50,72);txt(S,42,52,'U1',{a:'end',sz:10.5});txt(S,42,76,'U2',{a:'end',sz:10.5});
    wire(S,[[53,48],[96,48],[96,52]],'m');wire(S,[[53,72],[84,72],[84,100],[96,100],[96,96]],'m');S.add(c=>`<rect x="90" y="50" width="12" height="48" style="fill:${c==='flow'?'var(--live)':'var(--fg)'}"/><rect x="99" y="52" width="3" height="44" style="fill:var(--surface);opacity:.5"/>`,'m');
    S.add(`<g transform="rotate(-45 150 72)"><rect x="128" y="64" width="22" height="16" style="fill:var(--fg)"/><rect x="150" y="64" width="22" height="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/></g>`);
    acm(S,120,140,15,'M','',{rot:o.rot,net:'m'});return S}
  const rel=t==='b'||t==='c';
  txt(S,40,10,'L1',{sz:11});txt(S,180,10,'N',{sz:11});
  wire(S,[[180,14],[180,40]],'n');dot(S,180,40);wire(S,[[180,40],[90,40],[90,rel?54:76]],'m');
  if(rel){rbox(S,90,62,'I&gt;');wire(S,[[90,70],[90,76]],'m');S.add(`<path d="M103 62H150V71H172" style="stroke:var(--fg);stroke-width:1.1;stroke-dasharray:3 3;fill:none"/>`)}
  coil(S,90,96,10,40,'m');
  wire(S,[[40,14],[40,132],[90,132],[90,116]],'m');dot(S,90,132);wire(S,[[90,132],[124,132],[124,155],[132,155]],'x');coil(S,152,155,40,9,'x');wire(S,[[172,155],[180,155],[180,128]],'x');
  if(t==='a'){wire(S,[[180,128],[180,98]],'x');capV(S,180,95);wire(S,[[180,92],[180,40]],'x')}
  else{wire(S,[[180,128],[180,108]],'xs');capV(S,180,105);wire(S,[[180,102],[180,82]],'xs');cont(S,180,60,82,o.rel,'xs');wire(S,[[180,40],[180,60]],'xs');
    if(t==='c'){dot(S,180,128);wire(S,[[180,40],[212,40],[212,102]],'xr');capV(S,212,105);wire(S,[[212,108],[212,128],[180,128]],'xr')}}
  if(t!=='b')acm(S,58,162,11,'M','',{sz:11,rot:o.rot,net:'m'});
  return S}

/* الشكل (5-19): التنفيذية بلوحة الأطراف U1/Z1/Z2/U2 + الخطية. o.top: 'ms' (مفتاح وقاية) أو 'q2' (مفتاح يدوي ثنائي القطب — تمرين 2)
   o.book: قضبان L+/L- كما طُبعت؛ o.j: القناطر؛ o.ns: مفتاح السرعة n> مغلق */
const SPT=[['U1',110,244],['Z1',190,244],['Z2',110,272,'b'],['U2',190,272,'b']];
function fig519(o){o=o||{};const S=Sc(o.sld===false?300:420,440,'محرك تيار متردد أحادي الوجه مع مفتاح وقاية'),k=n=>o.steps?n:0,on=o.on&&!o.trip;
  S.at(k(1));const l1=o.book?'L+':'L1',l2=o.book?'L-':'N';
  wire(S,[[30,20],[300,20]],'L');wire(S,[[30,32],[300,32]],'N');wire(S,[[30,44],[300,44]],null,'pe');txt(S,26,24,l1,{a:'end'});txt(S,26,36,l2,{a:'end'});txt(S,26,48,'PE',{a:'end'});txt(S,165,12,o.title||(o.top==='q2'?'220v ~':'220v 1/N/PE ~ 60Hz'),{sz:10});
  dot(S,110,20);dot(S,140,32);wire(S,[[110,20],[110,41]],'L');fuse(S,110,52,'L');wire(S,[[110,63],[110,70]],'L');wire(S,[[140,32],[140,70]],'N');
  if(o.top==='q2'){frame(S,92,62,70,50,'n');cont(S,110,76,98,on,'p1');cont(S,140,76,98,on,'p2');wire(S,[[110,70],[110,76]],'L');wire(S,[[140,70],[140,76]],'N');qlink(S,80,134,87,'h','Q1');
    txt(S,104,74,'1',{a:'end',sz:9});txt(S,134,74,'3',{a:'end',sz:9});txt(S,104,108,'2',{a:'end',sz:9});txt(S,134,108,'4',{a:'end',sz:9});
    if(!o.given){wire(S,[[110,98],[110,178]],'p1');wire(S,[[140,98],[140,160],[262,160],[262,220],[200,220],[200,272],[193,272]],'p2')}else wire(S,[[290,44],[290,120]],null,'pe')}
  else{protSw(S,[110,140,170],82,{on,nets:['p1','p2','p3']});S.add(`<path d="M140 178V186H170V178" style="${SK};stroke-width:2"/>`);wire(S,[[170,70],[170,60],[262,60],[262,220],[200,220],[200,272],[193,272]],'p3')}
  S.at(k(3));
  wire(S,[[190,272],[204,286],[204,310]],'m');coil(S,204,330,10,40,'m');wire(S,[[204,350],[204,365],[122,365],[122,286],[110,248]],'m');
  wire(S,[[110,272],[100,286],[100,300],[60,300],[60,306]],'x');contNC(S,60,306,328,o.ns!==false,'x');rbox(S,30,317,'n&gt;');S.add(`<path d="M43 317H58" style="stroke:var(--fg);stroke-width:1.1;stroke-dasharray:3 3"/>`);
  wire(S,[[60,328],[60,337]],'x');capV(S,60,340);wire(S,[[60,343],[60,400],[80,400]],'x');coil(S,100,400,40,9,'x');wire(S,[[120,400],[240,400],[240,286],[190,248]],'x');
  acm(S,150,330,13,'M','',{sz:12,rot:o.rot,net:'m'});
  S.at(k(2));frame(S,14,226,262,200,'n');S.add(`<rect x="70" y="230" width="170" height="56" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:${DA.n}"/>`);
  terms(S,SPT,{click:o.click,sel:o.sel});term(S,226,258);txt(S,232,262,'PE',{a:'start',sz:9.5});gnd(S,226,261);dot(S,290,44);wire(S,[[290,44],[290,258],[229,258]],null,'pe');
  S.at(k(4));if(!o.given)wire(S,[[110,178],[110,241]],'p1');
  S.at(k(5));const pos=n=>{const t=SPT.find(q=>q[0]===n);return [t[1],t[2]]};(o.j||[]).forEach(key=>{const [a,b]=key.split('|');jump(S,pos(a),pos(b),{id:o.click?key:null,net:'j:'+key})});
  if(o.sld!==false){S.at(k(6));const x=362;txt(S,x,12,o.sldT||(o.top==='q2'?'220v ~':'220v 1/N/PE ~ 60Hz'),{sz:8.5});let y=sld(S,x,22,[['bar',''],['n',3,1],['fuse','F1'],['n',3,1],['sw','Q1',o.top==='q2'?'h':'b']]);
    if(o.top!=='q2')y=sld(S,x,y,[['prot']]);y=sld(S,x,y,[['n',3,1]]);dot(S,x,y+4);wire(S,[[x,y],[x,y+8]]);wire(S,[[x,y+4],[x+22,y+4],[x+22,y+16]]);capV(S,x+22,y+19);wire(S,[[x+22,y+22],[x+22,y+30]]);sld(S,x,y+8,[['M','M','1~']])}
  return S}

function labSP(el,opt){opt=opt||{};
  const st={type:opt.ex||chF('te')?'e':'b',on:0,trip:'',j:[],sel:null,v:0,dir:0,hum:0,rc:0,ro:0};const w={};
  const $=shell(el,{title:opt.ex?'تحقق من حلك: التمرين (٢)':'مختبر المحرك الحثي أحادي الوجه',ref:opt.ex?'لوحة أطراف الشكل (5-24) ص 124':'مبني على الأشكال (5-18أ…د) ص 117–118 و(5-19) ص 119',mw:420,leg:true,
    figNote:'المحاكاة منطقية: شريط السرعة نوعي بلا أرقام.'+(opt.ex?'':' في النوع (هـ) ضع القناطر على اللوحة بالضغط على طرفين.'),
    tries:opt.ex?['ضع القنطرتين اللتين تجعلان الملف المساعد على التوازي مع الرئيس، ثم أغلق Q1.','بدّل طرفي الملف المساعد لعكس الاتجاه.']:['في (ب) راقب المرحل «I>»: يغلق عند البدء ثم يفتح.','في (ج) يبقى مكثف التشغيل موصولاً بعد البدء.','في (هـ) بدّل Z1 و Z2: ينعكس الاتجاه.','في (هـ) أزل قنطرتي الملف المساعد: يطن المحرك ولا يبدأ.']});
  const sp=spinner(el);
  $('#ctl').innerHTML=`${opt.ex?'':`<div><div class="sub">نوع المحرك</div>${segHTML('ty',[['a','(أ) مكثف تشغيل مستمر'],['b','(ب) مكثف بدء'],['c','(ج) مكثف بدء وتشغيل'],['d','(د) القطب المظلل'],['e','(هـ) لوحة الأطراف (5-19)']],st.type)}</div>`}
   ${swHTML('sQ','Q1','تشغيل / إيقاف',0)}<span id="bjs">${opt.ex?'':'<button class="btn" data-pr="book">قنطرتا الشكل (5-19)</button><button class="btn" data-pr="rev">بدّل Z1 و Z2</button>'}<button class="btn" data-pr="clr">إزالة القناطر</button></span>`;
  const conn=()=>{const u=UF(),on=st.on&&!st.trip;if(on){u.u('U1','L');u.u('U2','N')}st.j.forEach(k=>{const [a,b]=k.split('|');u.u(a,b)});
    const short=on&&u.same('L','N');let ad=0;if(on){if(u.same('Z1','L')&&u.same('Z2','N'))ad=1;else if(u.same('Z1','N')&&u.same('Z2','L'))ad=-1}return {short,ad,u}};
  const step=dt=>{const on=st.on&&!st.trip,T=st.type;let aux=0,ad=1,relay=0,ns=(st.v<0.75||chF('nsweld'))&&!chF('nsopen');
    if(T==='e'){const c=conn();if(c.short){st.trip='mag';st.on=0;render();return}ad=c.ad;aux=on&&c.ad&&ns&&!chF('capopen')}
    else if(T==='a')aux=on;else if(T==='b'||T==='c'){relay=on&&st.v<0.7;aux=relay||(T==='c'&&on)}
    if(relay&&!st.rc)st.rc=1;if(st.rc&&!relay&&on&&st.v>0.6)st.ro=1;
    let run=0;if(on){if(T==='d'){run=1;st.dir=1}else if(st.v>0.05){run=1}else if(aux){run=1;st.dir=T==='e'?ad:1}else st.hum=1}
    if(run)st.hum=0;
    st.v+=((run?1:0)-st.v)*dt/(run?1.1:1.6);if(st.v<0.01&&!run){st.v=0;st.dir=0}
    const sig=[on,aux,relay,ns,st.dir,run,st.hum].join()+(chF('nsweld')&&st.v>0.02?'+':'');if(sig!==st.sig){st.sig=sig;st.aux=aux;st.relay=relay;st.ns=ns;render()}
    Object.assign(w,{type:T,on,v:st.v,dir:st.dir,hum:st.hum&&on,ro:st.ro,j:st.j,trip:st.trip});
    sp.tick(dt,st.dir*st.v,0.2)};
  const render=()=>{const T=st.type,on=st.on&&!st.trip;
    const cls=n=>n==='L'||n==='N'||n==='n'?(on?'flow':'live'):n==='m'||n==='p1'||n==='p2'||n==='p3'?(on?'flow':''):n==='x'?(st.aux?'flow':''):n==='xs'?(st.relay?'flow':''):n==='xr'?(on?'flow':''):n&&n.startsWith('j:')?(on?'flow':''):'';
    $('#fig').innerHTML=(T==='e'?fig519({top:opt.ex?'q2':'ms',on:st.on,trip:st.trip,j:st.j,click:1,sel:st.sel,ns:st.ns,rot:1,sld:false}):fig518(T,{rel:st.relay,rot:1})).svg({cls});
    $('#sQ').setAttribute('aria-pressed',String(!!on));el.querySelectorAll('[data-ty]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ty===T)));$('#bjs').style.display=T==='e'?'':'none';
    const chip=(t,c)=>`<em class="mode-chip ${c||''}">${t}</em>`;
    $('#rd').innerHTML=`<div class="read"><span>اتجاه الدوران</span>${chip(DIRT(st.v>0.02?st.dir:0),st.dir>0&&st.v>0.02?'run':st.dir<0&&st.v>0.02?'rev':'')}</div><div class="read"><span>السرعة (نوعياً)</span><b id="spb">${speedBar(st.v,1)}</b></div>`+
      (T==='b'||T==='c'?`<div class="read"><span>تلامس المرحل I&gt;</span>${chip(st.relay?'مغلق':'مفتوح',st.relay?'star':'')}</div>`:'')+(T==='e'?`<div class="read"><span>مفتاح السرعة n&gt;</span>${chip(st.ns?'مغلق':'مفتوح',st.ns?'':'star')}</div><div class="read"><span>Q1</span>${chip(st.trip?'فصل مغناطيسي':on?'مغلق':'مفتوح',st.trip?'trip':on?'run':'')}</div>`:'')+
      (T!=='d'?`<div class="read"><span>الملف المساعد</span>${chip(st.aux?'موصول':'مفصول',st.aux?'run':'')}</div>`:'');
    const D={a:'«يمتاز بمعامل قدرة جيد» (ص 117): المكثف دائم في الفرع المساعد، فالملف المساعد يبقى موصولاً أثناء التشغيل.',
      b:'«يوصل المرحل الدائرة المساعدة عندما يكون تيار البدء عالياً فقط ويمتاز بعزم دوران بدئي جيد» (ص 117).',
      c:'«يمتاز بمعامل قدرة جيد عند عزم دوران بدئي عالٍ» (ص 118): مكثف البدء يخرج بعد البدء ويبقى مكثف التشغيل.',
      d:'القطب المظلل: حلقة نحاسية تقصّر جزءاً من القطب فيبدأ المحرك وحده، في اتجاه ثابت يحدده موضع الحلقة (لا يُعكس بتبديل الأطراف).',
      e:'الملف المساعد يصل بين Z1 و Z2 عبر مفتاح السرعة n> والمكثف، والقنطرتان U1–Z1 و Z2–U2 تضعانه على التوازي مع الملف الرئيس.'}[T];
    $('#say').innerHTML=(st.trip?(opt.ex?'<b>قصر:</b> قنطرة تصل L1 بـ N مباشرة، فاحترق المصهر (افترضنا تغييره). أصلح القناطر ثم أغلق Q1. ':'<b>قصر:</b> قنطرة تصل L1 بـ N مباشرة، ففصل المرحل المغناطيسي. أصلح القناطر ثم أغلق Q1. '):'')+(!on?D:st.hum&&st.v<0.05?'<b>المحرك يطن ولا يبدأ:</b> الملف الرئيس وحده لا يعطي عزم بدء. يلزم الفرع المساعد.':
      T==='b'||T==='c'?(st.relay?'تيار البدء عالٍ: أغلق المرحل I> الفرع المساعد (مكثف البدء). '+D:'ارتفعت السرعة فانخفض التيار وفتح المرحل I> الفرع المساعد. '+D):T==='e'?(st.ns?'عند البدء مفتاح السرعة n> مغلق فالفرع المساعد موصول. ':'ارتفعت السرعة ففتح مفتاح الطرد المركزي n> الفرع المساعد. ')+D:D)};
  el.addEventListener('click',e=>{const t=e.target.closest('button,[data-t],[data-j]');if(!t||!el.contains(t))return;
    if(t.dataset.ty){st.type=t.dataset.ty;st.on=0;st.trip='';st.v=0;st.dir=0;st.rc=st.ro=0}
    else if(t.id==='sQ'){if(st.trip){st.trip='';st.on=1}else st.on^=1;if(!st.on)st.rc=st.ro=0}
    else if(t.dataset.pr){st.j=t.dataset.pr==='book'?['U1|Z1','U2|Z2']:t.dataset.pr==='rev'?['U1|Z2','U2|Z1']:[]}
    else if(t.dataset.t){const n=t.dataset.t;if(!st.sel)st.sel=n;else if(st.sel===n)st.sel=null;else{const key=[st.sel,n].sort().join('|');const i=st.j.indexOf(key);if(i>=0)st.j.splice(i,1);else st.j.push(key);st.sel=null}}
    else if(t.dataset.j){const i=st.j.indexOf(t.dataset.j);if(i>=0)st.j.splice(i,1)}else return;st.sig='';render();G.check()});
  const G=stepsUI($('#gs'),opt.ex?[
    {t:'ضع القنطرتين',x:'صِل Z1 بـ U1 و Z2 بـ U2 (اضغط طرفين لكل قنطرة).',done:w=>w.j.includes('U1|Z1')&&w.j.includes('U2|Z2')},
    {t:'شغّل',x:'أغلق Q1: يبدأ المحرك، ثم يفصل مفتاح الطرد المركزي الفرع المساعد.',done:w=>w.on&&w.v>0.8},
    {t:'اعكس الاتجاه',x:'افتح Q1 وانتظر حتى يتوقف، ثم صِل Z2 بـ U1 و Z1 بـ U2 وأعد التشغيل.',done:w=>w.on&&w.dir===-1&&w.v>0.5}]:[
    {t:'مكثف البدء (ب)',x:'اختر (ب) وأغلق Q1: يغلق المرحل I> الفرع المساعد عند البدء ثم يفتحه بعد ارتفاع السرعة.',done:w=>w.type==='b'&&w.ro},
    {t:'مكثف البدء والتشغيل (ج)',x:'اختر (ج) وشغّل: يخرج مكثف البدء ويبقى مكثف التشغيل والملف المساعد موصولين.',done:w=>w.type==='c'&&w.on&&w.v>0.8},
    {t:'القطب المظلل (د)',x:'اختر (د) وشغّل: يبدأ وحده بلا ملف مساعد ولا مكثف.',done:w=>w.type==='d'&&w.on&&w.v>0.5},
    {t:'لوحة الأطراف (هـ)',x:'اختر (هـ)، واضغط «قنطرتا الشكل (5-19)»، ثم أغلق Q1: يدور إلى اليمين، ثم يفتح n>.',done:w=>w.type==='e'&&w.dir===1&&w.v>0.8},
    {t:'اعكس الاتجاه',x:'افتح Q1 وانتظر حتى يتوقف، ثم «بدّل Z1 و Z2» وأغلق Q1: يدور إلى اليسار.',done:w=>w.type==='e'&&w.dir===-1&&w.v>0.5},
    {t:'بلا ملف مساعد',x:'افتح Q1 وانتظر التوقف، ثم «إزالة القناطر» وأغلق Q1: يطن المحرك ولا يبدأ.',done:w=>w.type==='e'&&w.hum}],()=>w);
  render();loopOn(el,dt=>{step(dt);const b=el.querySelector('#spb');if(b)b.innerHTML=speedBar(st.v,1);G.check()})}

B.lesson({
 id:'u5-l7',unit:5,order:7,pages:'117–119',
 title:'المحرك الحثي أحادي الوجه',
 summary:'الملف الرئيس والملف المساعد، وأنواع المحرك أحادي الوجه (مكثف التشغيل المستمر، مكثف البدء، مكثف البدء والتشغيل، القطب المظلل)، ودائرته مع مفتاح يدوي لوقاية المحرك ولوحة الأطراف U1/U2/Z1/Z2.',
 stations:[
  {intro:true},
{st:1,short:'ملف رئيس وملف مساعد',title:'5-3-3 الدائرة الكهربية الممثلة للمحركات الحثية أحادية الوجه',ref:'ص 117',
   q:'ملف واحد على وجه واحد لا يعرف في أي اتجاه يدور… فما حاجة المحرك إلى ملف ثانٍ؟',
   art:(()=>{const cx=180,cy=146,R=104,r=74,pt=(a,rr)=>[(cx+rr*Math.cos(a*Math.PI/180)).toFixed(1),(cy+rr*Math.sin(a*Math.PI/180)).toFixed(1)];
    const seg=(a0,a1,col,tip)=>{const [x0,y0]=pt(a0,R),[x1,y1]=pt(a1,R),[x2,y2]=pt(a1,r),[x3,y3]=pt(a0,r),lg=(a1-a0)>180?1:0;return `<path data-tip="${tip}" d="M${x0} ${y0}A${R} ${R} 0 ${lg} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${lg} 0 ${x3} ${y3}Z" fill="${col}" stroke="#2C4A40" stroke-width="2.5"/>`};
    let bars='';for(let k=0;k<10;k++){const [x,y]=pt(k*36,40);bars+=`<circle cx="${x}" cy="${y}" r="5" fill="#B9C2BC" stroke="#2C4A40" stroke-width="1.5"/>`}
    return `<svg viewBox="0 0 360 320" role="img" aria-label="مجاري العضو الساكن: الثلثان لملفات التشغيل والثلث للملفات المساعدة، وفي الوسط عضو دوار مقصر الدائرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/>${seg(-90,150,'#E8735A','الفرع الرئيس (ملفات التشغيل): في ثلثي مجاري العضو الساكن.')}${seg(150,270,'#4FB3A9','الفرع المساعد (الملفات المساعدة): في ثلث المجاري، ومعه مكثف في بعض الأنواع.')}<g data-tip="العضو الدوار مقصر الدائرة (قفص): قضبان تقصّرها حلقتان، لا يتصل بالمصدر."><circle cx="${cx}" cy="${cy}" r="56" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/>${bars}<circle cx="${cx}" cy="${cy}" r="10" fill="#2C4A40"/></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثلثان للتشغيل، وثلث للمساعد</text></svg>`})(),
   cap:'رسم توضيحي (ليس من الكتاب) لتوزيع الملفات في مجاري العضو الساكن كما في نص ص 117.<br><b>مرّر المؤشر على الجزأين الملونين والعضو الدوار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب النص، أين توضع ملفات التشغيل (الفرع الرئيس)؟',opts:[
     ['في ثلث المجاري',false,'الثلث للملفات المساعدة.'],
     ['في ثلثي المجاري',true,'«توضع ملفات التشغيل في ثلثي مجارى… والملفات المساعدة في ثلث هذه المجاري» (ص 117).'],
     ['على العضو الدوار',false,'العضو الدوار مقصر الدائرة؛ الفرعان على العضو الساكن.']]}}
   ],
   body:[
    {book:String.raw`<p>في المحرك الحثي أحادي الوجه تتكون ملفات العضو الثابت من فرعين الفرع الرئيس (ملفات التشغيل) والفرع المساعد (الملفات المساعدة) وعند لف الآلة نحصل على أفضل الظروف عندما توضع ملفات التشغيل في ثلثي مجارى العضو الدوار الساكن والملفات المساعدة في ثلث هذه المجاري . والعضو الدوار هو من النوع المقصر الدائرة. في المحرك ذي الملفات المساعدة تعتمد خصائص بدء الحركة والتشغيل على توصيل مكثف في الدائرة المساعدة لبعض أنواع المحركات.</p>`,ref:'ص 117'},
    {watch:'«مجارى العضو الدوار الساكن» (ص 117) والمقصود مجاري <b>العضو الساكن</b>، فالملفات الرئيسة والمساعدة على العضو الساكن والعضو الدوار مقصر الدائرة.'},
    {tip:String.raw`<p>الملف الرئيس وحده على وجه واحد يصنع مجالاً «ينبض» في مكانه ولا يدور، فلا يبدأ المحرك وحده (يطن). الملف المساعد — ومعه المكثف غالباً — يزيح تياره عن تيار الملف الرئيس فيصنعان معاً مجالاً دواراً يبدأ به المحرك. وسترى في المحطات التالية أربعة أنواع تختلف في <b>متى</b> يبقى الفرع المساعد موصولاً.</p>`,title:'لماذا الملف المساعد؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['ملفات العضو الثابت في المحرك أحادي الوجه فرعان: رئيس ومساعد.',true,'كما في ص 117.'],
     ['العضو الدوار في هذا المحرك ملفوف ويتصل بالمصدر بفرش.',false,'«والعضو الدوار هو من النوع المقصر الدائرة».'],
     ['خصائص البدء والتشغيل في بعض الأنواع تعتمد على مكثف في الدائرة المساعدة.',true,'هذا ما تفصّله الأشكال (5-18أ…ج).']]})}
   ]},

  {st:2,short:'مكثف التشغيل المستمر',title:'المحرك الأحادي الوجه مع مكثف التشغيل المستمر',ref:'ص 117',
   q:'مكثف يبقى موصولاً طوال التشغيل… فما الذي يكسبه المحرك من بقائه؟',
   art:U5S.art({S:fig518('a'),vb:[20,0,210,185],label:'الشكل (5-18أ) محرك أحادي الوجه بمكثف تشغيل مستمر',bg:'#DDEFE6',title:'المكثف دائم في الفرع المساعد',
    tips:[[80,72,20,48,'الملف الرئيس (ملفات التشغيل): بين ⟦L1⟧ و⟦N⟧.'],[128,146,48,18,'الملف المساعد: في فرع ثانٍ بين ⟦L1⟧ و⟦N⟧.'],[166,84,28,22,'مكثف التشغيل: على التوالي مع الملف المساعد، ويبقى موصولاً دائماً.'],[44,148,28,28,'رمز المحرك ⟦M⟧.'],[28,0,24,16,'الخط ⟦L1⟧.'],[168,0,24,16,'الخط المحايد ⟦N⟧.']]}),
   cap:'الشكل <span class="ltr">(5-18أ)</span> ص 117.<br><b>مرّر المؤشر على الملفين والمكثف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بماذا يمتاز المحرك ذو مكثف التشغيل المستمر حسب الكتاب؟',opts:[
     ['بعزم بدء عالٍ جداً',false,'هذا ما يُنسب إلى النوعين (ب) و(ج).'],
     ['بمعامل قدرة جيد',true,'«يمتاز بمعامل قدرة جيد» (ص 117).'],
     ['بأنه لا يحتاج ملفاً مساعداً',false,'الملف المساعد والمكثف موجودان.']]}}
   ],
   body:[
    {book:String.raw`<p>يمتاز بمعامل قدرة جيد الشكل ${FN('5-18أ')}.</p>`,ref:'ص 117'},
    {html:U5S.fig(box(fig518('a').svg(),300),320,'<b>الشكل <span class="ltr">(5-18أ)</span> المحرك الأحادي الوجه مع مكثف التشغيل المستمر</b> (ص 117) — الملف الرئيس (رأسي) بين L1 و N، والملف المساعد (أفقي) مع المكثف على التوالي بين L1 و N، والمكثف دائم.')},
    {title:'مختبر مصغّر: افصل الفرع المساعد',widget:(el,B)=>DCML.lab(el,B,{intro:'المحرك متوقف ثم وصلناه بالمصدر. اختر حالة الفرع المساعد لحظة التشغيل.',
     ins:[{k:'x',l:'الفرع المساعد (الملف + المكثف)',seg:[[1,'موصول'],[0,'مقطوع']],v:1}],
     calc:s=>({pic:fig518('a').svg({cls:n=>n==='m'||n==='n'?'flow':n==='x'?(s.x?'flow':''):''}),
      msg:s.x?'يبدأ المحرك ويدور، ويبقى المكثف والملف المساعد موصولين أثناء التشغيل.':'<b>يطن المحرك ولا يبدأ:</b> الملف الرئيس وحده لا يعطي عزم بدء.',cls:s.x?'':'bad'})})}
   ]},

  {st:3,short:'مكثف البدء',title:'المحرك الأحادي الوجه مع مكثف بدء التشغيل',ref:'ص 117',
   q:'مرحل يغلق عند البدء ثم يفتح وحده… كيف يعرف أن المحرك بدأ؟',
   art:U5S.art({S:fig518('b'),vb:[20,0,210,185],label:'الشكل (5-18ب) محرك أحادي الوجه بمكثف بدء ومرحل تيار',bg:'#E3ECF7',title:'المرحل يقرر متى يعمل المكثف',
    tips:[[72,52,36,22,'مرحل التيار ⟦I&gt;⟧: على التوالي مع الملف الرئيس، يشعر بتيار البدء العالي.'],[166,56,28,30,'تلامس المرحل (مفتوح عادة): يغلق ما دام تيار البدء عالياً.'],[104,58,70,18,'الخط المتقطع: ربط ميكانيكي بين المرحل وتلامسه.'],[166,96,28,20,'مكثف البدء.'],[128,146,48,18,'الملف المساعد.'],[80,74,20,46,'الملف الرئيس.']]}),
   cap:'الشكل <span class="ltr">(5-18ب)</span> ص 117.<br><b>مرّر المؤشر على المرحل وتلامسه والمكثف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى يوصل المرحل الدائرة المساعدة؟',opts:[
     ['طوال التشغيل',false,'هذا مكثف التشغيل المستمر (أ).'],
     ['عندما يكون تيار البدء عالياً فقط',true,'«يوصل المرحل الدائرة المساعدة عندما يكون تيار البدء عالياً فقط» (ص 117).'],
     ['عند إيقاف المحرك',false,'عند الإيقاف لا تيار.']]}}
   ],
   body:[
    {book:String.raw`<p>يوصل المرحل الدائرة المساعدة عندما يكون تيار البدء عالياً فقط ويمتاز بعزم دوران بدئي جيد الشكل ${FN('5-18ب')}.</p>`,ref:'ص 117'},
    {html:U5S.fig(box(fig518('b').svg(),300),320,'<b>الشكل <span class="ltr">(5-18ب)</span> محرك أحادي الوجه مع مكثف بدء</b> (ص 117) — مرحّل تيار <span class="ltr">I&gt;</span> على التوالي مع الملف الرئيس، وتلامسه المفتوح في الفرع المساعد فوق المكثف.')},
    {tip:String.raw`<p>لحظة البدء يكون تيار الملف الرئيس كبيراً جداً، فيجذب مرحل التيار تلامسه فيوصل الفرع المساعد. ومع ارتفاع السرعة ينخفض التيار، فيترك المرحل تلامسه فيفتح ويخرج المكثف.</p>`,title:'التيار هو الإشارة'},
    {title:'مختبر مصغّر: لحظة البدء وما بعدها',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر اللحظة، وراقب تلامس المرحل والفرع المساعد.',
     predict:{q:'ارتفعت سرعة المحرك وانخفض تياره. ماذا يحدث لتلامس المرحل؟',opts:[
      ['يبقى مغلقاً',false,'المرحل يحتاج تياراً عالياً ليبقى مغلقاً.'],
      ['يفتح فيخرج مكثف البدء والملف المساعد',true,'المرحل يوصل الدائرة المساعدة «عندما يكون تيار البدء عالياً فقط».'],
      ['يحترق المكثف',false,'التلامس يفتح فلا يمر تيار في المكثف.']]},
     ins:[{k:'t',l:'اللحظة',seg:[[1,'لحظة البدء (تيار عالٍ)'],[0,'بعد ارتفاع السرعة']],v:1}],
     calc:s=>({pic:fig518('b',{rel:!!s.t}).svg({cls:n=>n==='m'||n==='n'?'flow':n==='x'||n==='xs'?(s.t?'flow':''):''}),
      msg:s.t?'تيار البدء عالٍ: أغلق المرحل I> تلامسه، فالمكثف والملف المساعد موصولان، والعزم البدئي جيد.':'انخفض التيار ففتح المرحل: يدور المحرك على الملف الرئيس وحده.'})})}
   ]},

  {st:4,short:'مكثف البدء والتشغيل',title:'المحرك الأحادي الوجه ذو مكثف البدء ومكثف التشغيل',ref:'ص 118',
   q:'مكثفان في فرع واحد: أحدهما يخرج بعد البدء والآخر يبقى… لماذا نحتاج الاثنين؟',
   art:U5S.art({S:fig518('c'),vb:[20,0,210,185],label:'الشكل (5-18ج) محرك أحادي الوجه بمكثف بدء ومكثف تشغيل',bg:'#FBE6C4',title:'مكثف للبدء، وآخر للتشغيل',
    tips:[[166,96,28,20,'مكثف البدء: يعمل مع تلامس المرحل عند البدء فقط.'],[198,96,28,20,'مكثف التشغيل: على التوازي مع (التلامس + مكثف البدء)، ويبقى موصولاً.'],[166,56,28,30,'تلامس المرحل ⟦I&gt;⟧.'],[72,52,36,22,'مرحل التيار ⟦I&gt;⟧.'],[128,146,48,18,'الملف المساعد: على التوالي مع مجموعة المكثفين.']]}),
   cap:'الشكل <span class="ltr">(5-18ج)</span> ص 118.<br><b>مرّر المؤشر على المكثفين والمرحل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بعد أن يفتح تلامس المرحل في الشكل (5-18ج)، هل يبقى الملف المساعد موصولاً؟',opts:[
     ['نعم، عبر مكثف التشغيل',true,'مكثف التشغيل على التوازي مع (التلامس + مكثف البدء)، فيبقى طريق للتيار.'],
     ['لا، يخرج كله كما في (ب)',false,'في (ب) لا يوجد مكثف تشغيل؛ هنا يوجد.'],
     ['يخرج الملف الرئيس',false,'الملف الرئيس موصول دائماً.']]}}
   ],
   body:[
    {book:String.raw`<p>يمتاز بمعامل قدرة جيد عند عزم دوران بدئي عالٍ الشكل ${FN('5-18ج')}.</p>`,ref:'ص 118'},
    {html:U5S.fig(box(fig518('c').svg(),300),320,'<b>الشكل <span class="ltr">(5-18ج)</span> محرك أحادي الوجه مع مكثف البدء ومكثف التشغيل المستمر</b> (ص 118) — (تلامس المرحل + مكثف البدء) على التوازي مع مكثف التشغيل، والمجموعة على التوالي مع الملف المساعد.')},
    {tip:String.raw`<p>هذا النوع يجمع ميزتي (أ) و(ب): عند البدء يعمل المكثفان معاً (عزم بدئي عالٍ)، وبعده يبقى مكثف التشغيل وحده (معامل قدرة جيد).</p>`,title:'ميزتان في محرك واحد'},
    {title:'مختبر مصغّر: من يبقى بعد البدء؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر اللحظة وراقب الفرعين: مكثف البدء ومكثف التشغيل.',
     ins:[{k:'t',l:'اللحظة',seg:[[1,'لحظة البدء'],[0,'بعد ارتفاع السرعة']],v:1}],
     calc:s=>({pic:fig518('c',{rel:!!s.t}).svg({cls:n=>n==='m'||n==='n'||n==='x'||n==='xr'?'flow':n==='xs'?(s.t?'flow':''):''}),
      msg:s.t?'عند البدء: المرحل مغلق، فالمكثفان معاً على التوالي مع الملف المساعد — عزم بدئي عالٍ.':'بعد البدء: فتح المرحل فخرج مكثف البدء، وبقي <b>مكثف التشغيل</b> والملف المساعد — معامل قدرة جيد.'})})}
   ]},

  {st:5,short:'القطب المظلل',title:'محرك أحادي الوجه ذو القطب المظلل',ref:'ص 118',
   q:'لا ملف مساعد ولا مكثف… فكيف يبدأ هذا المحرك وحده؟',
   art:U5S.art({S:fig518('d'),vb:[24,14,196,166],label:'الشكل (5-18د) محرك أحادي الوجه ذو القطب المظلل',bg:'#DDEFE6',title:'حلقة نحاسية بدل الملف المساعد',
    tips:[[34,38,22,46,'طرفا التوصيل ⟦U1⟧ و⟦U2⟧: يدخلان إلى ملف القطب مباشرة.'],[86,46,20,56,'ملف القطب (العضو الساكن له أقطاب بارزة).'],[124,50,54,44,'القطب المظلل: جزء من القطب في مجراه حلقة نحاسية تقصّر الدائرة (النصف الأسود).'],[102,122,36,36,'رمز المحرك ⟦M⟧.']]}),
   cap:'الشكل <span class="ltr">(5-18د)</span> ص 118.<br><b>مرّر المؤشر على الطرفين والملف والقطب المظلل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يوضع في المجرى المقطوع من القطب؟',opts:[
     ['مكثف',false,'لا مكثف في هذا النوع.'],
     ['ملف مساعد',false,'لا ملف مساعد؛ الحلقة تؤدي دوره.'],
     ['حلقة نحاسية لتقصير الدائرة',true,'«أزيل جزء من القطب لتكوين مجرى توضع فيه حلقة نحاسية لتقصير الدائرة» (ص 118).']]}}
   ],
   body:[
    {book:String.raw`<p>في المحرك ذي القطب المظلل "المشطور" ألواح العضو الساكن لها أقطاب بارزة وقد أزيل جزء من القطب لتكوين مجرى توضع فيه حلقة نحاسية لتقصير الدائرة الشكل ${FN('5-18د')}.</p>`,ref:'ص 118'},
    {html:U5S.fig(box(fig518('d').svg(),300),320,'<b>الشكل <span class="ltr">(5-18د)</span> المحرك الأحادي الوجه ذو القطب المشطور</b> (ص 118) — الطرفان U1 و U2 إلى ملف القطب، والجزء المظلل (الحلقة النحاسية) مرسوم مائلاً نصفه أسود.')},
    {tip:String.raw`<p>التيار المستحث في الحلقة النحاسية يؤخّر المجال في الجزء المظلل عن باقي القطب، فيبدو المجال كأنه ينتقل من الجزء غير المظلل إلى المظلل؛ فيبدأ المحرك في هذا الاتجاه دائماً. لذلك لا يُعكس اتجاهه بتبديل طرفي التوصيل.</p>`,title:'كيف يبدأ؟'},
    {add:String.raw`<p>عزم البدء في هذا النوع صغير، لذلك يستخدم في الأجهزة الصغيرة جداً، مثل المراوح الصغيرة ومراوح تبريد الأجهزة.</p>`,title:'أين تجده؟'},
    {title:'مختبر مصغّر: لأي نوع هذه الميزة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل وصف حسب نوع المحرك أحادي الوجه في الأشكال (5-18أ…د).',cats:['(أ) تشغيل مستمر','(ب) بدء','(ج) بدء وتشغيل','(د) قطب مظلل'],items:[
     ['يمتاز بمعامل قدرة جيد، ومكثفه موصول دائماً',0,'«يمتاز بمعامل قدرة جيد» (ص 117).'],
     ['المرحل يوصل الدائرة المساعدة عند تيار البدء العالي فقط',1,'(ص 117).'],
     ['معامل قدرة جيد عند عزم دوران بدئي عالٍ',2,'(ص 118).'],
     ['حلقة نحاسية في مجرى القطب ولا مكثف',3,'(ص 118).']]})}
   ]},

  {st:6,short:'مع مفتاح وقاية (5-19)',title:'محرك أحادي الوجه مع مفتاح وقاية',ref:'ص 119',
   q:'أربعة أطراف على اللوحة U1، U2، Z1، Z2… أي قنطرتين تجعلان الفرع المساعد على التوازي مع الرئيس؟',
   art:U5S.art({S:fig519({j:['U1|Z1','U2|Z2']}),vb:[10,222,286,206],label:'لوحة أطراف المحرك أحادي الوجه في الشكل (5-19) والفرع المساعد',bg:'#E3ECF7',title:'قنطرتان ومفتاح سرعة',
    tips:[[98,232,24,24,'⟦U1⟧ بداية الملف الرئيس، ويصله الخط من الطرف 2 في Q1.'],[178,232,24,24,'⟦Z1⟧ بداية الملف المساعد.'],[98,262,24,24,'⟦Z2⟧ نهاية الفرع المساعد.'],[178,262,24,24,'⟦U2⟧ نهاية الملف الرئيس، ويصله الخط من الطرف 5.'],[118,226,64,18,'القنطرة ⟦U1–Z1⟧.'],[118,264,64,18,'القنطرة ⟦Z2–U2⟧.'],[14,304,52,28,'مفتاح السرعة ⟦n&gt;⟧ (طرد مركزي): تلامس مغلق عند السكون، يفتح عند ارتفاع السرعة.'],[46,330,28,20,'المكثف في الفرع المساعد.'],[76,390,48,20,'الملف المساعد.'],[194,306,20,48,'الملف الرئيس بين ⟦U1⟧ و⟦U2⟧.']]}),
   cap:'لوحة الأطراف والفرع المساعد من الشكل <span class="ltr">(5-19)</span>.<br><b>مرّر المؤشر على الأطراف والقنطرتين ومفتاح السرعة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تلامس مفتاح السرعة n> في الشكل (5-19) عند سكون المحرك:',opts:[
     ['مفتوح، ويغلق عند ارتفاع السرعة',false,'العكس: لو كان مفتوحاً عند السكون لما بدأ المحرك.'],
     ['مغلق، ويفتح عند ارتفاع السرعة',true,'فيكون الفرع المساعد موصولاً عند البدء، ويخرج بعد ارتفاع السرعة.'],
     ['لا علاقة له بالسرعة',false,'رمزه n> يعني أنه يعمل بالسرعة.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل${FN('5-19')} يبين مخطط دائرة محرك تيار متغير أحادي الوجه مع مفتاح يدوي لوقاية المحرك ومخطط لمسار التيار.</p>`,ref:'ص 119'},
    {html:U5S.fig(bkFig('u5e','اسما القضيبين:',fig519({book:1,j:['U1|Z1','U2|Z2']}).svg(),fig519({j:['U1|Z1','U2|Z2']}).svg(),460,'المصحح: التغذية تيار متردد <span class="ltr">1/N/PE</span>، فالقضيبان L1 و N، لا L+ و L- (رمزا التيار المستمر).'),500,'<b>الشكل <span class="ltr">(5-19)</span> محرك التيار المتردد أحادي الوجه مع مفتاح يدوي لوقاية المحرك</b> (ص 119) — يساراً الدائرة التنفيذية: المصهر، ومفتاح الوقاية Q1 بقنطرة سفلية بين 4 و6، والسلك من 5 إلى U2؛ ولوحة الأطراف: <b>U1، Z1</b> أعلى و<b>Z2، U2</b> أسفل مع <b>قنطرتي U1–Z1 و Z2–U2</b>؛ والفرع المساعد: Z2 ← مفتاح السرعة <span class="ltr">n&gt;</span> ← المكثف ← الملف المساعد ← Z1. يميناً الدائرة الخطية.')},
    {watch:'في الشكل <span class="ltr">(5-19)</span> ص 119 العنوان «<span class="ltr">220v 1/N/PE ~ 60Hz</span>» (تيار متردد) ومع ذلك كُتب على القضيبين <span class="ltr">L+</span> و<span class="ltr">L-</span>، وهما رمزا التيار المستمر. الصحيح L1 و N.',fix:true},
    {tip:String.raw`<p>مفتاح السرعة <span class="ltr">n&gt;</span> (الطرد المركزي) تلامسه مغلق عند السكون، فيكون الفرع المساعد موصولاً عند البدء، ويفتح عندما ترتفع السرعة. ولعكس اتجاه الدوران تُبدَّل نهايتا الملف المساعد على اللوحة (قنطرتا U1–Z2 و Z1–U2).</p>`,title:'البدء وعكس الاتجاه'},
    {title:'مختبر مصغّر: القنطرتان والاتجاه',widget:(el,B)=>DCML.lab(el,B,{intro:'Q1 مغلق والمحرك ساكن. اختر القناطر على اللوحة وراقب الفرع المساعد.',
     ins:[{k:'j',l:'القناطر',seg:[['U1|Z1,U2|Z2','U1–Z1 و Z2–U2 (الكتاب)'],['U1|Z2,U2|Z1','U1–Z2 و Z1–U2'],['','بلا قناطر']],v:'U1|Z1,U2|Z2'}],
     calc:s=>{const j=s.j?s.j.split(','):[],ax=j.length>0,d=s.j==='U1|Z1,U2|Z2'?1:s.j?-1:0;
      return {pic:fig519({on:1,j,sld:false,ns:true}).svg({cls:n=>n==='L'||n==='N'||n==='m'||/^p\d$/.test(n)?'flow':n==='x'||(n&&n.startsWith('j:'))?(ax?'flow':''):''}),
       msg:!ax?'<b>يطن المحرك ولا يبدأ:</b> الفرع المساعد غير موصول بالخطين.':`يبدأ المحرك ويدور <b>${DIRT(d)}</b>، ثم يفتح مفتاح السرعة n> عند ارتفاع السرعة فيخرج الفرع المساعد.${d<0?' بدّلنا نهايتي الفرع المساعد فانعكس الاتجاه.':''}`,cls:ax?'':'bad'}}})}
   ]},

  {recap:[
   'ملفات العضو الساكن للمحرك أحادي الوجه فرعان: رئيس (ثلثا المجاري) ومساعد (ثلثها)، والعضو الدوار مقصر الدائرة (ص 117).',
   '(أ) مكثف تشغيل مستمر: معامل قدرة جيد. (ب) مكثف بدء مع مرحل تيار <span class="ltr">I&gt;</span>: عزم بدئي جيد.',
   '(ج) مكثف بدء ومكثف تشغيل: معامل قدرة جيد عند عزم بدئي عالٍ. (د) القطب المظلل: حلقة نحاسية في مجرى القطب.',
   'الشكل <span class="ltr">(5-19)</span>: قنطرتا U1–Z1 و Z2–U2، ومفتاح سرعة <span class="ltr">n&gt;</span> يفصل الفرع المساعد بعد البدء؛ وتبديل Z1 و Z2 يعكس الاتجاه.']}
],
 theory:[
  {h:'5-3-3 الدائرة الكهربية الممثلة للمحركات الحثية أحادية الوجه',ref:'ص 117',html:`<p>في المحرك الحثي أحادي الوجه تتكون ملفات العضو الثابت من فرعين الفرع الرئيس (ملفات التشغيل) والفرع المساعد (الملفات المساعدة) وعند لف الآلة نحصل على أفضل الظروف عندما توضع ملفات التشغيل في ثلثي مجارى العضو الدوار الساكن والملفات المساعدة في ثلث هذه المجاري . والعضو الدوار هو من النوع المقصر الدائرة. في المحرك ذي الملفات المساعدة تعتمد خصائص بدء الحركة والتشغيل على توصيل مكثف في الدائرة المساعدة لبعض أنواع المحركات.</p>`},
  {err:'«مجارى العضو الدوار الساكن» (ص 117) والمقصود مجاري <b>العضو الساكن</b>، فالملفات الرئيسة والمساعدة على العضو الساكن والعضو الدوار مقصر الدائرة.'},
  {h:'المحرك الأحادي الوجه مع مكثف التشغيل المستمر',ref:'ص 117',html:`<p>يمتاز بمعامل قدرة جيد الشكل ${FN('5-18أ')}.</p>`},
  {fig:FN('5-18أ'),ref:'ص 117',caption:'المحرك الأحادي الوجه مع مكثف التشغيل المستمر — الملف الرئيس (رأسي) بين L1 و N، والملف المساعد (أفقي) مع المكثف على التوالي بين L1 و N، والمكثف دائم.',draw:()=>box(fig518('a').svg(),300)},
  {h:'المحرك الأحادي الوجه مع مكثف بدء التشغيل',ref:'ص 117',html:`<p>يوصل المرحل الدائرة المساعدة عندما يكون تيار البدء عالياً فقط ويمتاز بعزم دوران بدئي جيد الشكل ${FN('5-18ب')}.</p>`},
  {fig:FN('5-18ب'),ref:'ص 117',caption:'محرك أحادي الوجه مع مكثف بدء — مرحّل تيار <span class="ltr">I&gt;</span> على التوالي مع الملف الرئيس، وتلامسه المفتوح في الفرع المساعد فوق المكثف.',draw:()=>box(fig518('b').svg(),300)},
  {h:'المحرك الأحادي الوجه ذو مكثف البدء ومكثف التشغيل',ref:'ص 118',html:`<p>يمتاز بمعامل قدرة جيد عند عزم دوران بدئي عالٍ الشكل ${FN('5-18ج')}.</p>`},
  {fig:FN('5-18ج'),ref:'ص 118',caption:'محرك أحادي الوجه مع مكثف البدء ومكثف التشغيل المستمر — (تلامس المرحل + مكثف البدء) على التوازي مع مكثف التشغيل، والمجموعة على التوالي مع الملف المساعد.',draw:()=>box(fig518('c').svg(),300)},
  {h:'محرك أحادي الوجه ذو القطب المظلل',ref:'ص 118',html:`<p>في المحرك ذي القطب المظلل "المشطور" ألواح العضو الساكن لها أقطاب بارزة وقد أزيل جزء من القطب لتكوين مجرى توضع فيه حلقة نحاسية لتقصير الدائرة الشكل ${FN('5-18د')}.</p>`},
  {fig:FN('5-18د'),ref:'ص 118',caption:'المحرك الأحادي الوجه ذو القطب المشطور — الطرفان U1 و U2 إلى ملف القطب، والجزء المظلل (الحلقة النحاسية) مرسوم مائلاً نصفه أسود.',draw:()=>box(fig518('d').svg(),300)},
  {h:'محرك أحادي الوجه مع مفتاح وقاية',ref:'ص 119',html:`<p>الشكل${FN('5-19')} يبين مخطط دائرة محرك تيار متغير أحادي الوجه مع مفتاح يدوي لوقاية المحرك ومخطط لمسار التيار.</p>`},
  {fig:FN('5-19'),ref:'ص 119',caption:'محرك التيار المتردد أحادي الوجه مع مفتاح يدوي لوقاية المحرك — يساراً الدائرة التنفيذية (مسار التيار والتوصيلات): المصهر، ومفتاح الوقاية Q1 بقنطرة سفلية بين 4 و6، والسلك من 5 إلى U2؛ ولوحة الأطراف: <b>U1، Z1</b> أعلى و<b>Z2، U2</b> أسفل مع <b>قنطرتي U1–Z1 و Z2–U2</b>؛ والفرع المساعد: Z2 ← مفتاح السرعة <span class="ltr">n&gt;</span> (تلامس مغلق) ← المكثف ← الملف المساعد ← Z1. يميناً الدائرة الخطية. (في الكتاب أيضاً رسم تنفيذي مبسط بالرمز <span class="ltr">M 1~</span> وفيه المكثف، لم نكرره.)',draw:()=>bkFig('u5e','اسما القضيبين:',fig519({book:1,j:['U1|Z1','U2|Z2']}).svg(),fig519({j:['U1|Z1','U2|Z2']}).svg(),460,'المصحح: التغذية تيار متردد <span class="ltr">1/N/PE</span>، فالقضيبان L1 و N، لا L+ و L- (رمزا التيار المستمر).')},
  {err:'<span class="fixnote">في الشكل (5-19) ص 119 العنوان «<span class="ltr">220v 1/N/PE ~ 60Hz</span>» (تيار متردد) ومع ذلك كُتب على القضيبين L+ و L-، وهما رمزا التيار المستمر. الصحيح L1 و N.</span>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مفتاح السرعة <span class="ltr">n&gt;</span> (الطرد المركزي) تلامسه مغلق عند السكون، فيكون الفرع المساعد موصولاً عند البدء، ويفتح عندما ترتفع السرعة. ولعكس اتجاه الدوران تُبدَّل نهايتا الملف المساعد على اللوحة (قنطرتا U1–Z2 و Z1–U2). جرّب ذلك في المختبر.'}
 ],
 lab:(el)=>labSP(el),
 examples:[
  drawEx({title:'رسم الشكل (5-18ب) خطوة بخطوة',ref:'ص 117',mw:300,scene:(()=>{const S=Sc(240,185,'');const a=fig518('a'),b=fig518('b');void a;S.at(1).add(b.svg().replace(/^<svg[^>]*>|<\/svg>$/g,''));return S})(),
   q:'<p>ارسم مخطط محرك أحادي الوجه مع مكثف بدء ومرحل تيار.</p>',
   steps:['ارسم الخطين L1 و N. صِل N عبر <b>مرحل التيار I></b> (مستطيل) إلى الطرف العلوي للملف الرئيس (رأسي)، وصِل طرفه السفلي بـ L1. ثم ارسم الملف المساعد (أفقي) من L1، وطرفه الآخر يصعد عبر <b>المكثف</b> ثم <b>تلامس المرحل المفتوح</b> إلى N، واربط التلامس بالمرحل بخط متقطع.']}),
  drawEx({title:'الشكل (5-19): التنفيذية مع لوحة الأطراف ثم الخطية',ref:'ص 119',mw:460,scene:fig519({steps:1,j:['U1|Z1','U2|Z2']}),
   q:'<p>ارسم دائرة محرك أحادي الوجه بمكثف ومفتاح طرد مركزي مع مفتاح وقاية، ثم الدائرة الخطية.</p>',
   steps:['ارسم القضبان L1 و N و PE (<span class="ltr">220v 1/N/PE ~ 60Hz</span>)، والمصهر على L1، ومفتاح الوقاية Q1 بثلاثة أقطاب ومرحلاته. صِل L1 بالطرف 1 و N بالطرف 3، وضع القنطرة السفلية 4–6، وصِل الطرف 5 بسلك طويل إلى U2.',
    'ارسم صندوق المحرك ولوحة الأطراف: <b>U1، Z1</b> أعلى، و<b>Z2، U2</b> أسفل، وطرف PE مؤرّض.',
    'ارسم الملف الرئيس بين U1 و U2، والفرع المساعد: من Z2 إلى <b>مفتاح السرعة n></b> (تلامس مغلق) ثم <b>المكثف</b> ثم <b>الملف المساعد</b> إلى Z1.',
    'صِل الطرف <b>2</b> بالطرف U1.','ضع القنطرتين <b>U1–Z1</b> و<b>Z2–U2</b>.',
    'الدائرة الخطية: القضيب، المصهر F1، المفتاح Q1 بمقبضه، رمزا الحراري والمغناطيسي، ثم المحرك <span class="ltr">M 1~</span> مع فرع المكثف. وعلى الخط شرطة مائلة والرقم 3.']})
 ],
 quiz:[
  {q:'مم تتكون ملفات العضو الثابت في المحرك الحثي أحادي الوجه؟',o:['فرع واحد','فرعان: رئيس ومساعد','ثلاثة فروع مزاحة 120°','ملف مجال توالٍ وتوازٍ'],c:1,e:'(ص 117).'},
  {q:'العضو الدوار للمحرك الحثي أحادي الوجه من النوع:',o:['الملفوف بحلقات انزلاق','المقصر الدائرة','ذي الأقطاب البارزة','ذي الفرش'],c:1,e:'(ص 117).'},
  {q:'متى يوصل المرحل I> الدائرة المساعدة في محرك مكثف البدء؟',o:['دائماً','عندما يكون تيار البدء عالياً فقط','عند التوقف','عند زيادة الجهد'],c:1,e:'(ص 117).'},
  {q:'أي نوع يمتاز بمعامل قدرة جيد عند عزم دوران بدئي عالٍ؟',o:['مكثف التشغيل المستمر','مكثف البدء فقط','مكثف البدء ومكثف التشغيل','القطب المظلل'],c:2,e:'(ص 118).'},
  {q:'في القطب المظلل، ماذا يوضع في المجرى المقطوع من القطب؟',o:['مكثف','حلقة نحاسية لتقصير الدائرة','مرحل تيار','ملف مساعد'],c:1,e:'(ص 118).'},
  {q:'في الشكل (5-19)، ما القنطرتان على لوحة الأطراف؟',o:['U1–U2 و Z1–Z2','U1–Z1 و Z2–U2','U1–Z2 و U2–Z1','لا قناطر'],c:1,e:'(ص 119).'}
 ]
});

/* =====================================================================
   الدرس 8 — المحرك الحثي ثلاثي الأوجه: نجمة ومثلث (الأشكال 5-20 … 5-22)
   ===================================================================== */
/* لوحة أطراف ثلاثية: صف علوي U1 V1 W1، صف سفلي W2 U2 V2، والملفات تحت اللوحة */
function board3(S,x,y,o){o=o||{};const T3=[['U1',x,y],['V1',x+50,y],['W1',x+100,y],['W2',x,y+28,'b'],['U2',x+50,y+28,'b'],['V2',x+100,y+28,'b']];
  const C=[['U',x,x+44,112,'cu'],['V',x+50,x+94,120,'cv'],['W',x+100,x-6,128,'cw']];
  C.forEach(([nm,x1,xr,dy,net])=>{wire(S,[[x1,y],[x1+6,y+14],[x1+6,y+62]],net);coil(S,x1+6,y+80,9,36,net);txt(S,x1+14,y+84,nm,{a:'start',sz:9.5,m:1});wire(S,[[x1+6,y+98],[x1+6,y+dy],[xr,y+dy],[xr,y+40],[xr+6,y+28]],net)});
  S.add(`<rect x="${x-22}" y="${y-16}" width="152" height="58" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:${DA.pe}"/>`);
  if(o.pe){term(S,x+122,y+14);txt(S,x+126,y+6,'PE',{a:'start',sz:9});}
  terms(S,T3.map(t=>[t[0],t[1],t[2],t[3]||(o.lr?'t':'t')]),{click:o.click,sel:o.sel});
  const pos=n=>{const t=T3.find(q=>q[0]===n);return [t[1],t[2]]};
  (o.j||[]).forEach(key=>{const [a,b]=key.split('|');const A=pos(a),Bp=pos(b);jump(S,A,Bp,{id:o.click?key:null,net:'j:'+key,straight:A[0]===Bp[0]||A[1]===Bp[1]&&Math.abs(A[0]-Bp[0])<60})});
  return T3}
const J_Y=['U2|W2','U2|V2'],J_D=['U1|W2','U2|V1','V2|W1'];
/* الأشكال (5-20)/(5-21): الرسوم الأربعة */
function fig520(D,o){o=o||{};const S=Sc(640,330,D?'توصيلة المثلث':'توصيلة النجمة'),k=n=>o.steps?n:0;
  S.at(k(1));wire(S,[[50,30],[50,140]]);slash(S,50,70,4);acm(S,50,170,26,'M',D?'3~△':'3~Y');
  S.at(k(2));['L1','L2','L3','PE'].forEach((l,i)=>{const x=120+i*24;txt(S,x,22,l,{sz:9.5});if(i<3){wire(S,[[x,28],[x,148]])}});wire(S,[[192,28],[192,170],[180,170]],null,'pe');dot(S,180,170);
  acm(S,148,180,32,'M',D?'3~△':'3~Y');txt(S,124,144,'U',{sz:9});txt(S,152,140,'V',{sz:9});txt(S,176,144,'W',{sz:9});txt(S,200,166,'PE',{sz:8.5,a:'start'});
  S.at(k(3));['L1','L2','L3'].forEach((l,i)=>txt(S,250+i*50,22,D?['U','V','W'][i]:l,{sz:9.5}));
  const P=D?deltaW(S,300,170,58):starW(S,300,170,58);
  wire(S,[[250,28],[250,P[1][1]],[P[1][0],P[1][1]]]);wire(S,[[300,28],[300,P[0][1]]]);wire(S,[[350,28],[350,P[2][1]],[P[2][0],P[2][1]]]);
  if(!D){txt(S,P[0][0]+8,P[0][1]+4,'V',{a:'start',sz:9.5});txt(S,P[1][0]-6,P[1][1]+14,'U',{sz:9.5});txt(S,P[2][0]+6,P[2][1]+14,'W',{sz:9.5});wire(S,[[372,28],[372,250]],null,'pe');gnd(S,372,250);txt(S,372,22,'PE',{sz:9.5})}
  acm(S,300,282,11,'M','',{sz:11});
  S.at(k(4));['L1','L2','L3','PE'].forEach((l,i)=>{txt(S,450+i*50,22,l,{sz:9.5});if(i<3)wire(S,[[450+i*50,28],[450+i*50,77]])});wire(S,[[600,28],[600,112]],null,'pe');gnd(S,600,112);
  frame(S,420,64,200,240);board3(S,450,80,{j:D?J_D:J_Y,pe:0});acm(S,500,286,11,'M','',{sz:11});
  return S}
/* الشكل (5-22): مفتاح وقاية + لوحة أطراف مثلث، والتنفيذية المبسطة، والخطية. o.lab: للمختبر (قناطر حرة وتلوين) */
function fig522(o){o=o||{};const S=Sc(o.lab?300:640,450,'المحرك الحثي ثلاثي الأوجه مع مفتاح وقاية'),k=n=>o.steps?n:0,on=o.on&&!o.trip;
  S.at(k(1));['L1','L2','L3','N','PE'].forEach((l,i)=>{wire(S,[[30,20+i*12],[o.lab?280:380,20+i*12]],i<3?'b':null,i===3?'n':i===4?'pe':null);txt(S,26,24+i*12,l,{a:'end'})});txt(S,150,11,'380/220v 3/N/PE ~ 60Hz',{sz:10});
  [90,120,150].forEach((x,i)=>{dot(S,x,20+i*12);wire(S,[[x,20+i*12],[x,84]],'b');fuse(S,x,95,'b');wire(S,[[x,106],[x,118]],'b')});txt(S,80,99,'F1..3',{a:'end',sz:10});
  protSw(S,[90,120,150],130,{on,nets:['l1','l2','l3']});
  S.at(k(2));wire(S,[[90,226],[90,240],[70,240],[70,287]],'l1');wire(S,[[120,226],[120,287]],'l2');wire(S,[[150,226],[150,240],[170,240],[170,287]],'l3');
  dot(S,250,68);wire(S,[[250,68],[250,294],[192,294]],null,'pe');frame(S,40,262,210,180);
  board3(S,70,290,{j:o.j,click:o.click,sel:o.sel,pe:1});acm(S,120,428,10,'M','',{sz:10,rot:o.rot,net:o.lab?'cu':null});
  if(!o.lab){S.at(k(3));[290,320,350].forEach((x,i)=>{dot(S,x,20+i*12);wire(S,[[x,20+i*12],[x,84]]);fuse(S,x,95);wire(S,[[x,106],[x,118]])});
    const S2=Sc(1,1,'');protSw(S2,[290,320,350],130,{lbl:'Q1'});S.add(S2.svg().replace(/^<svg[^>]*>|<\/svg>$/g,''));
    [290,320,350].forEach((x,i)=>{wire(S,[[x,226],[x,236+(i===1?10:0)]]);term(S,x,239+(i===1?10:0))});wire(S,[[290,242],[300,262]]);wire(S,[[320,252],[320,262]]);wire(S,[[350,242],[340,262]]);
    txt(S,282,250,'U',{a:'end',sz:9.5});txt(S,327,262,'V',{a:'start',sz:9.5});txt(S,358,250,'W',{a:'start',sz:9.5});acm(S,320,292,30,'M','3~△');dot(S,370,68);wire(S,[[370,68],[370,292],[350,292]],null,'pe');
    S.at(k(4));const x=520;txt(S,x,14,'380/220v 3/N/PE ~ 60Hz',{sz:9});sld(S,x,24,[['bar',''],['n',3,1],['fuse','F1'],['n',3,1],['sw','Q1','b'],['prot'],['n',3,1],['M','M','3~△']])}
  return S}
/* تصنيف قناطر لوحة الأطراف الثلاثية */
function cls3(j,on){const u=UF();const m=n=>chF('urev')?(n==='U1'?'U2':n==='U2'?'U1':n):n;if(on){u.u(m('U1'),'L1');u.u('V1','L2');u.u('W1','L3')}j.forEach(k=>{const [a,b]=k.split('|');u.u(m(a),m(b))});
  const L=['L1','L2','L3'],lineOf=n=>L.find(l=>u.same(n,l))||null;
  if(on&&(u.same('L1','L2')||u.same('L2','L3')||u.same('L1','L3')))return {kind:'short'};
  const W=[['U','U1','U2'],['V','V1','V2'],['W','W1','W2']].map(([n,a,b])=>({n,a,b,la:lineOf(a),lb:lineOf(b),sh:u.same(a,b)}));
  const pt=u.f('U2'),star=u.same('U2','V2')&&u.same('V2','W2')&&!lineOf('U2');
  const delta=W.every(w=>w.la&&w.lb&&w.la!==w.lb)&&new Set(W.map(w=>[w.la,w.lb].sort().join())).size===3;void pt;
  if(!on)return {kind:star?'Y':delta?'D':'',W};
  if(star&&!W.some(w=>w.sh))return {kind:'Y',W};if(delta)return {kind:'D',W};
  return {kind:'bad',W,why:W.filter(w=>w.sh).length?'ملف مقصور (طرفاه على عقدة واحدة)':W.some(w=>!(w.la&&w.lb)&&!star)?'ملف أو أكثر غير مكتمل الدائرة':'توصيل غير متماثل'}}
function lab3(el){
  const st={on:0,trip:'',j:[],sel:null};const w={};
  const $=shell(el,{title:'مختبر لوحة أطراف المحرك ثلاثي الأوجه',ref:'مبني على الأشكال (5-20) ص 120 و(5-21) ص 121 و(5-22) ص 122',mw:320,
    figNote:'ضع القناطر بين أطراف اللوحة: أفقية (W2–U2–V2) للنجمة، أو رأسية (U1–W2، V1–U2، W1–V2) للمثلث.',
    after:'<h3 class="sm" style="margin-top:12px">التوصيل الناتج</h3><div class="svgbox" id="res" style="max-width:240px;margin-inline:auto"></div><div id="rel" class="sub" style="text-align:center"></div>',
    tries:['ضع قنطرتي النجمة وأغلق Q1.','بدّلها بقناطر المثلث الثلاث.','ضع قنطرة واحدة فقط (W2–U2) وأغلق Q1: ماذا يحدث؟','ضع قنطرة U1–V1: قصر بين خطين.']});
  const sp=spinner(el);
  $('#ctl').innerHTML=`${swHTML('sQ','Q1','مفتاح وقاية المحرك',0)}<button class="btn" data-pr="Y">قناطر النجمة (5-20)</button><button class="btn" data-pr="D">قناطر المثلث (5-21)</button><button class="btn" data-pr="clr">إزالة القناطر</button>`;
  let r;
  const render=()=>{r=cls3(st.j,st.on&&!st.trip);if(r.kind==='short'){st.trip='mag';r=cls3(st.j,false);r.trip=1}
    const on=st.on&&!st.trip,ok=on&&(r.kind==='Y'||r.kind==='D')&&!chF('f3')&&!chF('urev')&&!(chF('vopen')&&r.kind==='Y');Object.assign(w,{on,kind:r.kind,trip:st.trip,j:st.j.slice()});
    const cls=n=>n==='b'?'live':n==='l3'&&chF('f3')?'':n==='cv'&&chF('vopen')?'':['l1','l2','l3'].includes(n)?(on?(ok?'flow':'live'):''):['cu','cv','cw'].includes(n)?(ok?'flow':''):n&&n.startsWith('j:')?(ok?'flow':''):'';
    $('#fig').innerHTML=fig522({lab:1,on:st.on,trip:st.trip,j:st.j,click:1,sel:st.sel,rot:1}).svg({cls});
    const R=Sc(240,200,'التوصيل الناتج');if(r.kind==='Y'){starW(R,120,110,70,ok?'x':null,['V','U','W']);txt(R,120,195,'Y',{sz:14})}else if(r.kind==='D'){deltaW(R,120,115,72,ok?'x':null,['V','U','W']);txt(R,120,195,'△',{sz:14})}else R.add(T(120,100,'?',{sz:30,m:1}));
    $('#res').innerHTML=R.svg({cls:n=>n==='x'?'flow':''});
    $('#rel').innerHTML=r.kind==='Y'?`نجمة: ${B.tex('V_L=\\sqrt{3}\\,V_{ph}')} و ${B.tex('I_L=I_{ph}')}`:r.kind==='D'?`مثلث: ${B.tex('V_L=V_{ph}')} و ${B.tex('I_L=\\sqrt{3}\\,I_{ph}')}`:'';
    $('#sQ').setAttribute('aria-pressed',String(!!on));
    const chip=(t,c)=>`<em class="mode-chip ${c||''}">${t}</em>`;
    $('#rd').innerHTML=`<div class="read"><span>التوصيل</span>${chip(r.kind==='Y'?'نجمة Y':r.kind==='D'?'مثلث △':r.kind==='bad'?'غير صحيح':'—',r.kind==='Y'?'star':r.kind==='D'?'delta':r.kind==='bad'?'trip':'')}</div><div class="read"><span>المحرك</span>${chip(ok?'يدور':st.trip?'مفصول (قصر)':on?'لا يدور':'متوقف',ok?'run':st.trip?'trip':'')}</div>`+
      (on&&r.W?`<div class="read"><span>جهد كل ملف</span>${chip(r.kind==='Y'?'جهد الوجه':r.kind==='D'?'جهد الخط':'غير متساوٍ','')}</div>`:'');
    $('#say').innerHTML=st.trip?'<b>قصر بين خطين:</b> قنطرة تصل طرفين متصلين بخطين مختلفين، ففصل المرحل المغناطيسي في Q1. أزل القنطرة ثم أغلق Q1.':!on?(r.kind==='Y'?'القناطر الآن نجمة. أغلق Q1.':r.kind==='D'?'القناطر الآن مثلث. أغلق Q1.':'ضع القناطر ثم أغلق Q1.'):
      r.kind==='Y'?'«في توصيلة النجمة يتم توصيل أطراف بداية الملفات أو أطراف نهاية الملفات معاً في نقطة تسمى بنقطة التعادل» (ص 120): الأطراف W2، U2، V2 معاً. كل ملف بين خط ونقطة التعادل، فعليه <b>جهد الوجه</b>، و'+B.tex('V_L=\\sqrt{3}\\,V_{ph}')+'.':
      r.kind==='D'?'«يتم توصيل بداية الوجه الأول في نهاية الوجه الثالث وبداية الوجه الثاني في نهاية الوجه الأول وبداية الوجه الثالث في نهاية الوجه الثاني» (ص 121). كل ملف بين خطين، فعليه <b>جهد الخط</b>، و'+B.tex('I_L=\\sqrt{3}\\,I_{ph}')+'.':
      '<b>توصيل غير صحيح:</b> '+(r.why||'')+'. المحرك لا يدور دوراناً سليماً. (هذه الحالة ليست في الكتاب؛ الصحيح نجمة أو مثلث.)';
    B.math&&B.math(el)};
  el.addEventListener('click',e=>{const t=e.target.closest('button,[data-t],[data-j]');if(!t||!el.contains(t))return;
    if(t.id==='sQ'){if(st.trip){st.trip='';st.on=1}else st.on^=1}
    else if(t.dataset.pr)st.j=t.dataset.pr==='Y'?J_Y.slice():t.dataset.pr==='D'?J_D.slice():[];
    else if(t.dataset.t){const n=t.dataset.t;if(!st.sel)st.sel=n;else if(st.sel===n)st.sel=null;else{const key=[st.sel,n].sort().join('|');const i=st.j.indexOf(key);if(i>=0)st.j.splice(i,1);else st.j.push(key);st.sel=null}}
    else if(t.dataset.j){const i=st.j.indexOf(t.dataset.j);if(i>=0)st.j.splice(i,1)}else return;render();G.check()});
  const G=stepsUI($('#gs'),[
    {t:'قناطر النجمة',x:'صِل W2 بـ U2 و U2 بـ V2 (قنطرتان أفقيتان في الصف السفلي)، أو اضغط «قناطر النجمة».',done:w=>w.kind==='Y'},
    {t:'شغّل',x:'أغلق Q1: يدور المحرك، وكل ملف عليه جهد الوجه.',done:w=>w.on&&w.kind==='Y'},
    {t:'قناطر المثلث',x:'افتح Q1، وأزل القناطر، وضع ثلاث قناطر رأسية: U1–W2، V1–U2، W1–V2 ثم أغلق Q1.',done:w=>w.on&&w.kind==='D'},
    {t:'قنطرة ناقصة',x:'أزل قنطرة واحدة من المثلث والمحرك موصول: لا يكتمل التوصيل.',done:w=>w.on&&w.kind==='bad'},
    {t:'قصر بين خطين',x:'ضع قنطرة بين U1 و V1 وأغلق Q1: يفصل المرحل المغناطيسي.',done:w=>w.trip==='mag'}
  ],()=>w);
  render();loopOn(el,dt=>sp.tick(dt,(w.on&&(w.kind==='Y'||w.kind==='D'))?1:0,0.6))}

B.lesson({
 id:'u5-l8',unit:5,order:8,pages:'119–122',
 title:'المحرك الحثي ثلاثي الأوجه: نجمة ومثلث',
 summary:'نوعا المحرك الحثي ثلاثي الأوجه، وتوصيلة النجمة وتوصيلة المثلث لملفات العضو الساكن على لوحة الأطراف U1…W2 مع علاقتي الجهد والتيار، والمحرك مع مفتاح وقاية.',
 stations:[
  {intro:true},
{st:1,short:'نوعا العضو الدوار',title:'5-3-4 الدائرة الكهربية الممثلة للمحركات الحثية ثلاثية الأوجه',ref:'ص 119–120',
   q:'محركان من الخارج متشابهان… فما الذي يجعل أحدهما يبدأ بعزم كبير وتيار أقل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نوعا العضو الدوار: قفص سنجابي بقضبان وحلقتين، وعضو ملفوف بحلقات انزلاق وفرش ومقاومة متغيرة نجمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="العضو الدوار ذو القفص السنجابي: أسطوانة من شرائح الصلب السليكوني فيها قضبان من الألمنيوم، تُوصل نهاياتها بحلقتين من الناحيتين."><rect x="200" y="70" width="120" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="218" y="96" width="84" height="12" rx="4" fill="#D9822B" stroke="#2C4A40" stroke-width="2"/><rect x="218" y="184" width="84" height="12" rx="4" fill="#D9822B" stroke="#2C4A40" stroke-width="2"/><g stroke="#2C4A40" stroke-width="5"><path d="M228 108V184M246 108V184M264 108V184M282 108V184M296 108V184"/></g><text x="260" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قفص سنجابي</text></g><g data-tip="العضو الدائر الملفوف: ملفات نحاس معزول موصلة نجمة، تكتمل دائرتها عبر حلقات انزلاق وفرش كربونية ومقاومة متغيرة ثلاثية الأوجه نجمة."><rect x="40" y="70" width="140" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g fill="#F2C14E" stroke="#2C4A40" stroke-width="2"><rect x="130" y="88" width="14" height="44" rx="3"/><rect x="110" y="88" width="14" height="44" rx="3"/><rect x="90" y="88" width="14" height="44" rx="3"/></g><g fill="#2C4A40"><rect x="131" y="136" width="12" height="10"/><rect x="111" y="136" width="12" height="10"/><rect x="91" y="136" width="12" height="10"/></g><path d="M137 146V166M117 146V166M97 146V166" stroke="#2C4A40" stroke-width="2"/><g fill="none" stroke="#2C4A40" stroke-width="2"><path d="M97 166L117 192M137 166L117 192M117 166V192"/></g><g fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"><rect x="100" y="168" width="8" height="14" transform="rotate(-38 104 175)"/><rect x="126" y="168" width="8" height="14" transform="rotate(38 130 175)"/><rect x="113" y="170" width="8" height="14"/></g><circle cx="117" cy="192" r="3.5" fill="#2C4A40"/><path d="M60 110H86" stroke="#2C4A40" stroke-width="5"/><text x="110" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">حلقات انزلاق</text></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">نوعان من حيث التركيب</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لنوعي العضو الدوار كما يصفهما نص ص 119–120.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'أي النوعين يتميز بعزم دوران بدئي كبير عند تيار بدء منخفض؟',opts:[
     ['ذو القفص السنجابي',false,'الكتاب ينسب هذه الميزة إلى النوع الآخر.'],
     ['ذو العضو الدوار بحلقات انزلاق',true,'«وتتميز المحركات ذات العضو الدوار بحلقات انزلاق لها عزم دوران بدئي كبير عند تيار بدء منخفض» (ص 120).'],
     ['لا فرق بينهما',false,'المقاومة المتغيرة في دائرة العضو الدوار هي التي تصنع الفرق.']]}}
   ],
   body:[
    {book:String.raw`<p>تنقسم المحركات الحثية من حيث التركيب إلى نوعين النوع الأول ذو <b>القفص السنجابي</b> والنوع الثاني ذو <b>العضو الدائر الملفوف حلقات الانزلاق</b>.</p>
   <p>يتكون العضو الدوار ذو القفص السنجابي من أسطوانة مصنوعة من شرائح من الصلب السليكوني فيها قضبان من الألمينيوم ويتم توصيل نهايات القضبان مع بعضها البعض من الناحيتين بواسطة حلقتين.</p>
   <p>أما النوع الثاني ذو العضو الدائر الملفوف "حلقات الانزلاق" فيتكون من ملفات من النحاس المعزول ويتم توصيل الملفات للأوجه الثلاثة للعضو الدوار على شكل نجمة ويتم إكمال دائرة الملفات عبر مجموعة من حلقات الانزلاق وفرش كربونية ومقاومة متغيرة ثلاثية الأوجه على شكل نجمة. وتتميز المحركات ذات العضو الدوار بحلقات انزلاق لها عزم دوران بدئي كبير عند تيار بدء منخفض. يمكن توصيل ملفات العضو الساكن للمحركات الحثية بتوصيلة نجمة أو مثلث.</p>`,ref:'ص 119–120'},
    {tip:String.raw`<p>المقاومة المتغيرة الخارجية تُضاف إلى دائرة العضو الدوار عند البدء، فتحدّ تيار البدء وتحسّن العزم؛ ثم تُخرج تدريجياً مع ارتفاع السرعة (ستراه في الوحدة السادسة). أما القفص فقضبانه مقصورة دائماً، فلا يمكن إضافة مقاومة إليه.</p>`,title:'لماذا الحلقات؟'},
    {add:String.raw`<p>أغلب المحركات في المصانع (المضخات، المراوح، السيور) ذات قفص سنجابي لأنها بسيطة ورخيصة وقليلة الصيانة. أما ذات حلقات الانزلاق فتُختار للأحمال الثقيلة عند البدء، مثل الرافعات والكسارات.</p>`,title:'أيهما أكثر انتشاراً؟'},
    {title:'مختبر مصغّر: قفص أم حلقات؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل وصف حسب نوع العضو الدوار.',cats:['قفص سنجابي','حلقات انزلاق'],items:[
     ['قضبان من الألمنيوم تقصّرها حلقتان من الناحيتين',0,'(ص 119).'],['ملفات من النحاس المعزول موصلة نجمة',1,'(ص 120).'],
     ['فرش كربونية ومقاومة متغيرة ثلاثية الأوجه',1,'تكمل دائرة ملفات العضو الدوار (ص 120).'],['عزم دوران بدئي كبير عند تيار بدء منخفض',1,'(ص 120).']]})}
   ]},

  {st:2,short:'توصيلة النجمة',title:'أ - توصيلة النجمة',ref:'ص 120',
   q:'نهايات الملفات الثلاث مجموعة في نقطة واحدة… فما الجهد الذي يقع على كل ملف؟',
   art:U5S.art({S:fig520(0),vb:[416,12,210,206],label:'لوحة أطراف المحرك ثلاثي الأوجه بقنطرة النجمة من الشكل (5-20)',bg:'#FBE6C4',title:'قنطرة أفقية = نقطة التعادل',
    tips:[[430,66,124,26,'الصف العلوي ⟦U1 V1 W1⟧: بدايات الملفات، تتصل بالخطوط ⟦L1 L2 L3⟧.'],[430,96,124,26,'الصف السفلي ⟦W2 U2 V2⟧ والقنطرة الأفقية: تجمع نهايات الملفات في نقطة التعادل (نقطة النجمة).'],[446,142,110,70,'الملفات الثلاثة داخل المحرك، كل واحد بين طرفيه.'],[590,14,22,104,'خط الأرضي ⟦PE⟧.']]}),
   cap:'لوحة الأطراف في الشكل <span class="ltr">(5-20)</span> (الرسم الرابع).<br><b>مرّر المؤشر على الصفين والملفات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في توصيلة النجمة، كيف يرتبط جهد الخط بجهد الوجه؟',opts:[
     ['جهد الخط = جهد الوجه',false,'هذا في توصيلة المثلث.'],
     ['جهد الخط = \\(\\sqrt{3}\\) × جهد الوجه',true,'«ويرتبط جهد الخط بجهد الوجه بالعلاقة: جهد الخط = \\(\\sqrt{3}\\) جهد الوجه» (ص 120).'],
     ['جهد الخط = 3 × جهد الوجه',false,'المعامل \\(\\sqrt{3}\\) لا 3.']]}}
   ],
   body:[
    {book:String.raw`<p>في توصيلة النجمة يتم توصيل أطراف بداية الملفات أو أطراف نهاية الملفات معاً في نقطة تسمى بنقطة التعادل. في هذه الحالة الجهد بين الخطوط يسمى جهد الخط والجهد بين الخط ونقطة لتعادل يسمى جهد الوجه ويرتبط جهد الخط بجهد الوجه بالعلاقة:</p>
   <div class="eq">$$\text{جهد الخط}=\sqrt{3}\;\text{جهد الوجه}$$</div><div class="eq">$$V_L=\sqrt{3}\,V_{ph}$$</div><p>أما تيار الخط فيساوي تيار الوجه. \(I_L=I_{ph}\)</p><p>الشكل ${FN('5-20')} يبين توصيلة العضو الساكن توصيلة نجمة.</p>`,ref:'ص 120'},
    {html:U5S.fig(box(fig520(0).svg(),640),660,'<b>الشكل <span class="ltr">(5-20)</span> توصيلة العضو الساكن توصيلة نجمة للمحرك ثلاثي الأوجه</b> (ص 120) — أربعة رسوم من اليسار: (1) خطي بشرطة والرقم 4 (أربعة موصلات)، (2) رمزي متعدد الخطوط L1، L2، L3، PE، (3) مخطط الملفات على شكل Y ونقطة النجمة، (4) لوحة الأطراف: U1، V1، W1 أعلى و W2، U2، V2 أسفل، و<b>قنطرة أفقية</b> تجمع W2 و U2 و V2 (نقطة النجمة).')},
    {tip:String.raw`<p>ترتيب الصف السفلي <b>W2، U2، V2</b> (مزاح بموضع واحد عن العلوي) هو الذي يجعل قناطر المثلث رأسية مستقيمة: U1 فوق W2، و V1 فوق U2، و W1 فوق V2. ورسمنا قنطرة النجمة قطعتين (W2–U2 و U2–V2) لأنها تصل ثلاثة أطراف.</p><p>كل ملف في النجمة بين خط ونقطة التعادل، فعليه <b>جهد الوجه</b>؛ وجهد الخط بين خطين أكبر منه بالمعامل \(\sqrt{3}\) لأن الجهدين بينهما <span class="ltr">120°</span>.</p>`,title:'اقرأ اللوحة'},
    {title:'مختبر مصغّر: أين تضع الفولتميتر؟',widget:(el,B)=>DCML.lab(el,B,{intro:'متجهات جهود الأوجه الثلاثة في توصيلة النجمة (رسم نوعي). اختر بين أي نقطتين تقيس.',
     ins:[{k:'m',l:'الفولتميتر بين',seg:[['LN','الخط L1 ونقطة التعادل N'],['LL','الخطين L1 و L2']],v:'LN'}],
     calc:s=>{const cx=120,cy=104,R=74,t=a=>[cx+R*Math.cos(a),cy-R*Math.sin(a)],ang=[90,-30,210].map(d=>d*Math.PI/180),cols=['--stop','--live','--blue'];
      let g=`<svg viewBox="0 0 240 200" role="img" aria-label="متجهات جهود الأوجه" direction="ltr" style="font-family:var(--font)">`;
      ang.forEach((a,i)=>{const p=t(a);g+=`<path d="M${cx} ${cy}L${p[0].toFixed(1)} ${p[1].toFixed(1)}" style="stroke:var(${cols[i]});stroke-width:3"/>`+ah(p[0],p[1],p[0]-cx,p[1]-cy,9,`var(${cols[i]})`)+T(p[0]+(p[0]-cx)*0.18,p[1]+(p[1]-cy)*0.18+4,'L'+(i+1),{sz:11})});
      g+=`<circle cx="${cx}" cy="${cy}" r="4" style="fill:var(--fg)"/>`+T(cx-12,cy+16,'N',{sz:11});
      const a=t(ang[0]),b=t(ang[1]);g+=s.m==='LL'?`<path d="M${b[0].toFixed(1)} ${b[1].toFixed(1)}L${a[0].toFixed(1)} ${a[1].toFixed(1)}" style="stroke:var(--fg);stroke-width:2.4;stroke-dasharray:6 4"/>`:`<path d="M${cx} ${cy}L${a[0].toFixed(1)} ${a[1].toFixed(1)}" style="stroke:var(--fg);stroke-width:2.4;stroke-dasharray:6 4"/>`;
      g+='</svg>';
      return {pic:g,bars:[{l:'جهد الوجه (على كل ملف)',v:1,max:1.8,txt:'Vph',col:'--muted'},{l:'ما يقرؤه الفولتميتر (الخط المتقطع)',v:s.m==='LL'?1.732:1,max:1.8,txt:s.m==='LL'?'√3 × Vph':'Vph',col:'--blue'}],
       msg:s.m==='LL'?'بين خطين نقيس <b>جهد الخط</b>: الخط المتقطع أطول من متجه الوجه بالمعامل \\(\\sqrt{3}\\).':'بين خط ونقطة التعادل نقيس <b>جهد الوجه</b> نفسه — وهو الجهد الذي على كل ملف.'}}})}
   ]},

  {st:3,short:'توصيلة المثلث',title:'ب- توصيلة المثلث',ref:'ص 121',
   q:'«بداية الأول في نهاية الثالث…» جملة طويلة… كيف تترجمها إلى قناطر على اللوحة؟',
   art:U5S.art({S:fig520(1),vb:[416,12,210,206],label:'لوحة أطراف المحرك ثلاثي الأوجه بقناطر المثلث من الشكل (5-21)',bg:'#E3ECF7',title:'ثلاث قناطر رأسية',
    tips:[[436,70,28,46,'القنطرة ⟦U1–W2⟧: بداية الوجه الأول مع نهاية الوجه الثالث.'],[486,70,28,46,'القنطرة ⟦V1–U2⟧: بداية الوجه الثاني مع نهاية الوجه الأول.'],[536,70,28,46,'القنطرة ⟦W1–V2⟧: بداية الوجه الثالث مع نهاية الوجه الثاني.'],[446,142,110,70,'الملفات الثلاثة داخل المحرك.']]}),
   cap:'لوحة الأطراف في الشكل <span class="ltr">(5-21)</span> (الرسم الرابع).<br><b>مرّر المؤشر على القناطر الثلاث (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في توصيلة المثلث، أي علاقة صحيحة؟',opts:[
     ['تيار الخط = تيار الوجه',false,'هذا في النجمة.'],
     ['جهد الخط = \\(\\sqrt{3}\\) × جهد الوجه',false,'هذا في النجمة أيضاً.'],
     ['تيار الخط = \\(\\sqrt{3}\\) × تيار الوجه، وجهد الخط = جهد الوجه',true,'(ص 121).']]}}
   ],
   body:[
    {book:String.raw`<p>في توصيلة المثلث يتم توصيل بداية الوجه الأول في نهاية الوجه الثالث وبداية الوجه الثاني في نهاية الوجه الأول وبداية الوجه الثالث في نهاية الوجه الثاني. وتكون جهود الخطوط مساوية لجهود الأوجه ويرتبط تيار الخط بتيار الوجه بالعلاقة:</p>
   <div class="eq">$$\text{تيار الخط}=\sqrt{3}\;\text{تيار الوجه}$$</div><div class="eq">$$I_L=\sqrt{3}\,I_{ph}\quad (V_L=V_{ph})$$</div><p>الشكل ${FN('5-21')} يبين توصيلة العضو الساكن توصيلة المثلث.</p>`,ref:'ص 121'},
    {html:U5S.fig(box(fig520(1).svg(),640),660,'<b>الشكل <span class="ltr">(5-21)</span> توصيلة العضو الساكن توصيلة المثلث للمحرك ثلاثي الأوجه</b> (ص 121) — «الدائرة الرمزية» (الرسمان الأيسران) و«الدائرة التنفيذية» (الأيمنان). على اللوحة <b>ثلاث قناطر رأسية: U1–W2، V1–U2، W1–V2</b>.')},
    {tip:String.raw`<p>طبّق جملة الكتاب على اللوحة: بداية الوجه الأول U1 مع نهاية الوجه الثالث W2، وبداية الثاني V1 مع نهاية الأول U2، وبداية الثالث W1 مع نهاية الثاني V2 — وهي القناطر الرأسية الثلاث. كل ملف الآن بين خطين، فعليه <b>جهد الخط</b> كاملاً.</p>`,title:'من الجملة إلى القناطر'},
    {title:'مختبر مصغّر: ترجم الجملة إلى قناطر',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر لكل بداية (الصف العلوي) النهاية التي تصلها بها، وراقب اللوحة.',
     ins:[{k:'u',l:'بداية الوجه الأول U1 تُوصل مع',seg:[['W2','W2'],['U2','U2'],['V2','V2']],v:'U2'},{k:'v',l:'بداية الوجه الثاني V1 تُوصل مع',seg:[['W2','W2'],['U2','U2'],['V2','V2']],v:'V2'},{k:'w',l:'بداية الوجه الثالث W1 تُوصل مع',seg:[['W2','W2'],['U2','U2'],['V2','V2']],v:'W2'}],
     calc:s=>{const j=[['U1',s.u],['V1',s.v],['W1',s.w]].map(p=>p.sort().join('|'));const r=cls3(j,true);const book=s.u==='W2'&&s.v==='U2'&&s.w==='V2';
      const S=Sc(210,186,'لوحة الأطراف');[['L1',50],['L2',100],['L3',150]].forEach(([l,x])=>{wire(S,[[x,14],[x,37]]);txt(S,x,10,l,{sz:10})});board3(S,50,40,{j});
      const self=[['U',s.u==='U2'],['V',s.v==='V2'],['W',s.w==='W2']].filter(x=>x[1]).map(x=>x[0]);
      return {pic:S.svg(),msg:r.kind==='short'?'<b>قصر بين خطين:</b> بدايتان (متصلتان بخطين مختلفين) وُصلتا بالنهاية نفسها.':self.length?`<b>ملف مقصور:</b> وصلت بداية الملف ${self.join(' و ')} بنهايته هو، فطرفاه على نقطة واحدة.`:book?'<b>صحيح — هذه قناطر الكتاب:</b> U1–W2، V1–U2، W1–V2، رأسية مستقيمة. كل ملف بين خطين.':'هذا مثلث أيضاً (كل ملف بين خطين)، لكن قناطره مائلة. اتّبع جملة الكتاب لتحصل على القناطر الرأسية.',cls:r.kind==='short'||self.length?'bad':book?'':'warn'}}})}
   ]},

  {st:4,short:'مع مفتاح وقاية (5-22)',title:'محرك حثي ثلاثي الأوجه مع مفتاح وقاية',ref:'ص 122',
   q:'ثلاثة خطوط وثلاثة مرحلات حرارية… ماذا لو انقطع خط واحد والمحرك يعمل؟',
   art:U5S.art({S:fig522({j:J_D}),vb:[28,64,206,170],label:'مفتاح وقاية المحرك ثلاثي الأقطاب والمصاهر في الشكل (5-22)',bg:'#DDEFE6',title:'ثلاثة أقطاب، لكل خط وقايته',
    tips:[[78,82,84,28,'المصاهر ⟦F1..3⟧: واحد على كل خط.'],[78,128,84,32,'تلامسات مفتاح الوقاية ⟦Q1⟧: ⟦1/3/5⟧ أعلى و⟦2/4/6⟧ أسفل.'],[78,166,84,20,'المرحلات الحرارية: تفصل بعد مدة عند زيادة التيار.'],[78,186,84,22,'المرحلات المغناطيسية ⟦I&gt;⟧: تفصل فوراً عند القصر.'],[50,134,26,24,'مقبض المفتاح وخط الربط.']]}),
   cap:'مفتاح الوقاية في الشكل <span class="ltr">(5-22)</span>.<br><b>مرّر المؤشر على المصاهر والتلامسات والمرحلات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (5-22) إلى أي أطراف تصل الأطراف السفلية 2 و4 و6 لمفتاح الوقاية؟',opts:[
     ['U2 و V2 و W2',false,'هذه النهايات، وعليها القناطر.'],
     ['U1 و V1 و W1',true,'الخطوط الثلاثة تصل بدايات الملفات في الصف العلوي.'],
     ['PE فقط',false,'PE يصل بخط الأرضي.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل ${FN('5-22')} يبين محركاً حثياً ثلاثي الأوجه مع مفتاح لوقاية المحرك مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>`,ref:'ص 122'},
    {html:U5S.fig(box(fig522({j:J_D}).svg(),640),660,'<b>الشكل <span class="ltr">(5-22)</span> المحرك الحثي ثلاثي الأوجه مع مفتاح لوقاية المحرك كمفتاح أجهزة</b> (ص 122) — يساراً «الدائرة التنفيذية»: <span class="ltr">380/220v 3/N/PE ~ 60Hz</span>، المصاهر <span class="ltr">F1..3</span>، مفتاح الوقاية Q1، ولوحة أطراف بقناطر مثلث. وسطاً تنفيذية مبسطة بالرمز <span class="ltr">M 3~△</span>. يميناً «الدائرة الخطية».')},
    {tip:String.raw`<p>القناطر على اللوحة في هذا الشكل قناطر <b>المثلث</b> الرأسية، ولهذا كُتب في الرمز <span class="ltr">3~△</span>. ولو وضعنا قنطرة النجمة الأفقية لصار الرمز <span class="ltr">3~Y</span>.</p>`,title:'مثلث أم نجمة هنا؟'},
    {add:String.raw`<p>إذا انقطع خط واحد والمحرك يعمل (احتراق مصهر مثلاً) يستمر المحرك في الدوران على وجهين بتيار أكبر في الخطين الباقيين؛ فتسخن مرحلاتهما الحرارية وتفصل Q1 بعد مدة، فتحمي الملفات من الاحتراق.</p>`,title:'انقطاع خط'},
    {title:'مختبر مصغّر: رتّب الدائرة الخطية',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب رموز الدائرة الخطية للشكل (5-22) من أعلى إلى أسفل.',steps:[
     ['القضيب <span class="ltr">380/220v 3/N/PE ~ 60Hz</span>','نبدأ من التغذية.'],['المصهر <span class="ltr">F1</span>','المصهر قبل المفتاح.'],['مفتاح الوقاية <span class="ltr">Q1</span> بمقبضه','المفتاح بعد المصهر.'],['رمزا المرحل الحراري والمغناطيسي','جزء من مفتاح الوقاية، تحت تلامساته.'],['المحرك <span class="ltr">M 3~△</span>','المحرك في النهاية.']],done:'وعلى الخط شرطات مائلة مع الرقم 3 (ثلاثة موصلات).'})}
   ]},

  {recap:[
   'المحرك الحثي ثلاثي الأوجه نوعان: قفص سنجابي، وعضو دائر ملفوف بحلقات انزلاق (عزم بدئي كبير عند تيار بدء منخفض) (ص 119–120).',
   'النجمة: البدايات أو النهايات في نقطة التعادل (قنطرة أفقية W2–U2–V2)، و\\(V_L=\\sqrt{3}\\,V_{ph}\\)، \\(I_L=I_{ph}\\) (ص 120).',
   'المثلث: بداية كل وجه في نهاية الذي قبله (قناطر رأسية U1–W2، V1–U2، W1–V2)، و\\(I_L=\\sqrt{3}\\,I_{ph}\\)، \\(V_L=V_{ph}\\) (ص 121).',
   'الشكل <span class="ltr">(5-22)</span>: Q1 ثلاثي الأقطاب بمرحلات حرارية ومغناطيسية، وأطرافه 2، 4، 6 إلى U1، V1، W1.']}
],
 theory:[
  {h:'5-3-4 الدائرة الكهربية الممثلة للمحركات الحثية ثلاثية الأوجه',ref:'ص 119–120',html:`<p>تنقسم المحركات الحثية من حيث التركيب إلى نوعين النوع الأول ذو <b>القفص السنجابي</b> والنوع الثاني ذو <b>العضو الدائر الملفوف حلقات الانزلاق</b>.</p>
   <p>يتكون العضو الدوار ذو القفص السنجابي من أسطوانة مصنوعة من شرائح من الصلب السليكوني فيها قضبان من الألمينيوم ويتم توصيل نهايات القضبان مع بعضها البعض من الناحيتين بواسطة حلقتين.</p>
   <p>أما النوع الثاني ذو العضو الدائر الملفوف "حلقات الانزلاق" فيتكون من ملفات من النحاس المعزول ويتم توصيل الملفات للأوجه الثلاثة للعضو الدوار على شكل نجمة ويتم إكمال دائرة الملفات عبر مجموعة من حلقات الانزلاق وفرش كربونية ومقاومة متغيرة ثلاثية الأوجه على شكل نجمة. وتتميز المحركات ذات العضو الدوار بحلقات انزلاق لها عزم دوران بدئي كبير عند تيار بدء منخفض. يمكن توصيل ملفات العضو الساكن للمحركات الحثية بتوصيلة نجمة أو مثلث.</p>`},
  {h:'أ - توصيلة النجمة',ref:'ص 120',html:`<p>في توصيلة النجمة يتم توصيل أطراف بداية الملفات أو أطراف نهاية الملفات معاً في نقطة تسمى بنقطة التعادل. في هذه الحالة الجهد بين الخطوط يسمى جهد الخط والجهد بين الخط ونقطة لتعادل يسمى جهد الوجه ويرتبط جهد الخط بجهد الوجه بالعلاقة:</p>
   $$\\text{جهد الخط}=\\sqrt{3}\\;\\text{جهد الوجه}\\qquad V_L=\\sqrt{3}\\,V_{ph}$$<p>أما تيار الخط فيساوي تيار الوجه. \\(I_L=I_{ph}\\)</p><p>الشكل ${FN('5-20')} يبين توصيلة العضو الساكن توصيلة نجمة.</p>`},
  {fig:FN('5-20'),ref:'ص 120',caption:'توصيلة العضو الساكن توصيلة نجمة للمحرك ثلاثي الأوجه — أربعة رسوم من اليسار: (1) خطي بشرطة والرقم 4 (أربعة موصلات)، (2) رمزي متعدد الخطوط L1، L2، L3، PE، (3) مخطط الملفات على شكل Y ونقطة النجمة، (4) لوحة الأطراف: U1، V1، W1 أعلى و W2، U2، V2 أسفل، و<b>قنطرة أفقية</b> تجمع W2 و U2 و V2 (نقطة النجمة).',draw:()=>box(fig520(0).svg(),640)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ترتيب الصف السفلي <b>W2، U2، V2</b> (مزاح بموضع واحد عن العلوي) هو الذي يجعل قناطر المثلث رأسية مستقيمة: U1 فوق W2، و V1 فوق U2، و W1 فوق V2. ورسمنا قنطرة النجمة قطعتين (W2–U2 و U2–V2) لأنها تصل ثلاثة أطراف.'},
  {h:'ب- توصيلة المثلث',ref:'ص 121',html:`<p>في توصيلة المثلث يتم توصيل بداية الوجه الأول في نهاية الوجه الثالث وبداية الوجه الثاني في نهاية الوجه الأول وبداية الوجه الثالث في نهاية الوجه الثاني. وتكون جهود الخطوط مساوية لجهود الأوجه ويرتبط تيار الخط بتيار الوجه بالعلاقة:</p>
   $$\\text{تيار الخط}=\\sqrt{3}\\;\\text{تيار الوجه}\\qquad I_L=\\sqrt{3}\\,I_{ph}\\quad (V_L=V_{ph})$$<p>الشكل ${FN('5-21')} يبين توصيلة العضو الساكن توصيلة المثلث.</p>`},
  {fig:FN('5-21'),ref:'ص 121',caption:'توصيلة العضو الساكن توصيلة المثلث للمحرك ثلاثي الأوجه — «الدائرة الرمزية» (الرسمان الأيسران) و«الدائرة التنفيذية» (الأيمنان). على اللوحة <b>ثلاث قناطر رأسية: U1–W2، V1–U2، W1–V2</b>.',draw:()=>box(fig520(1).svg(),640)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> طبّق جملة الكتاب على اللوحة: بداية الوجه الأول U1 مع نهاية الوجه الثالث W2، وبداية الثاني V1 مع نهاية الأول U2، وبداية الثالث W1 مع نهاية الثاني V2 — وهي القناطر الرأسية الثلاث.'},
  {h:'محرك حثي ثلاثي الأوجه مع مفتاح وقاية',ref:'ص 122',html:`<p>الشكل ${FN('5-22')} يبين محركاً حثياً ثلاثي الأوجه مع مفتاح لوقاية المحرك مع الجمع بين مخطط مسار التيار ومخطط التوصيلات.</p>`},
  {fig:FN('5-22'),ref:'ص 122',caption:'المحرك الحثي ثلاثي الأوجه مع مفتاح لوقاية المحرك كمفتاح أجهزة — يساراً «الدائرة التنفيذية»: <span class="ltr">380/220v 3/N/PE ~ 60Hz</span>، المصاهر <span class="ltr">F1..3</span>، مفتاح الوقاية Q1، ولوحة أطراف بقناطر مثلث. وسطاً تنفيذية مبسطة بالرمز <span class="ltr">M 3~△</span>. يميناً «الدائرة الخطية».',draw:()=>box(fig522({j:J_D}).svg(),640)}
 ],
 lab:(el)=>lab3(el),
 examples:[
  drawEx({title:'الرسوم الأربعة لتوصيلة النجمة (5-20)',ref:'ص 120',mw:640,scene:fig520(0,{steps:1}),q:'<p>ارسم توصيلة النجمة للمحرك ثلاثي الأوجه بالطرق الأربع.</p>',
   steps:['<b>الخطي:</b> خط واحد عليه شرطة مائلة والرقم 4 (L1، L2، L3، PE) ينتهي بدائرة المحرك <span class="ltr">M 3~</span> ورمز النجمة.',
    '<b>الرمزي متعدد الخطوط:</b> أربعة خطوط L1، L2، L3، PE تدخل دائرة المحرك عند U، V، W، و PE إلى نقطة على محيطها.',
    '<b>مخطط الملفات:</b> ثلاثة ملفات على شكل Y: V إلى L2، و U إلى L1، و W إلى L3، والأطراف الداخلية في نقطة النجمة.',
    '<b>لوحة الأطراف:</b> U1، V1، W1 أعلى (إلى L1، L2، L3)، و W2، U2، V2 أسفل وتجمعها قنطرة أفقية.']}),
  drawEx({title:'الرسوم الأربعة لتوصيلة المثلث (5-21)',ref:'ص 121',mw:640,scene:fig520(1,{steps:1}),q:'<p>ارسم توصيلة المثلث للمحرك ثلاثي الأوجه بالطرق الأربع.</p>',
   steps:['<b>الخطي:</b> كما في النجمة، لكن داخل الدائرة <span class="ltr">3~△</span>.','<b>الرمزي:</b> كما في النجمة مع رمز المثلث.','<b>مخطط الملفات:</b> مثلث رأسه أعلى وعلى كل ضلع ملف؛ الرأس العلوي إلى V، والسفلي الأيسر إلى U، والسفلي الأيمن إلى W.','<b>لوحة الأطراف:</b> ثلاث قناطر رأسية U1–W2، V1–U2، W1–V2.']}),
  drawEx({title:'الشكل (5-22): المحرك مع مفتاح الوقاية',ref:'ص 122',mw:640,scene:fig522({steps:1,j:J_D}),q:'<p>ارسم المحرك الحثي ثلاثي الأوجه (مثلث) مع مفتاح وقاية المحرك: التنفيذية ثم الخطية.</p>',
   steps:['القضبان L1، L2، L3، N، PE، والمصاهر <span class="ltr">F1..3</span>، ومفتاح الوقاية Q1 بتلامساته (1/3/5 و 2/4/6) ومرحلاته الحرارية والمغناطيسية.',
    'من 2 و 4 و 6 إلى U1 و V1 و W1 على لوحة الأطراف، وقناطر المثلث الرأسية، وطرف PE إلى خط PE.','التنفيذية المبسطة: الأطراف U، V، W على دائرة <span class="ltr">M 3~△</span>.','الخطية: القضيب، الشرطة والرقم 3، المصهر F1، Q1 بمقبضه، رمزا الحراري والمغناطيسي، ثم <span class="ltr">M 3~△</span>.']})
 ],
 quiz:[
  {q:'نوعا المحرك الحثي ثلاثي الأوجه من حيث التركيب:',o:['توالٍ وتوازٍ','قفص سنجابي وعضو دائر ملفوف بحلقات انزلاق','بارز وغاطس','مكثف بدء ومكثف تشغيل'],c:1,e:'(ص 119).'},
  {q:'في توصيلة النجمة:',o:['\\(V_L=V_{ph}\\)','\\(V_L=\\sqrt{3}\\,V_{ph}\\) و \\(I_L=I_{ph}\\)','\\(I_L=\\sqrt{3}\\,I_{ph}\\)','لا توجد نقطة تعادل'],c:1,e:'(ص 120).'},
  {q:'في توصيلة المثلث:',o:['\\(V_L=\\sqrt{3}\\,V_{ph}\\)','\\(I_L=I_{ph}\\)','\\(V_L=V_{ph}\\) و \\(I_L=\\sqrt{3}\\,I_{ph}\\)','الجهد والتيار صفر'],c:2,e:'(ص 121).'},
  {q:'قناطر النجمة على لوحة الأطراف:',o:['ثلاث قناطر رأسية','قنطرة أفقية تجمع W2 و U2 و V2','قنطرة بين U1 و V1','بلا قناطر'],c:1,e:'الشكل (5-20).'},
  {q:'أي قنطرة من قناطر المثلث؟',o:['U1–U2','V1–U2','W2–V2','U1–V1'],c:1,e:'U1–W2، V1–U2، W1–V2 (الشكل 5-21).'},
  {q:'المحرك ذو العضو الدوار بحلقات انزلاق يتميز بـ:',o:['عزم بدئي صغير','عزم دوران بدئي كبير عند تيار بدء منخفض','لا يحتاج مقاومة','سرعة ثابتة تماماً'],c:1,e:'(ص 120).'}
 ]
});

/* =====================================================================
   الدرس 9 — تمارين الوحدة الخامسة (الأشكال 5-23 … 5-26)
   ===================================================================== */
const CMPms=Object.assign({},CMP,{top:'ms',W:470,r2:s=>[s,[120,223]],r4:{E1:s=>[s,[150,192],[260,192],[260,223]]}});
const sldEx1=(S,k)=>{S.at(k(1));const x=410;txt(S,x,14,'220v Dc',{sz:10});sld(S,x,22,[['bar',''],['n',3,1],['fuse','F1..2'],['sw','Q1','b'],['prot'],['n',3,2],['M','','',1]]);};
/* الشكل (5-23) كما طُبع: بداية المخطط فقط + لوحة أطراف غير موصلة + المخطط الخطي */
function ex1Given(){const S=Sc(470,462,'التمرين الأول: محرك تيار مستمر مركب');
  wire(S,[[60,30],[300,30]]);wire(S,[[60,42],[300,42]]);txt(S,56,34,'L+',{a:'end'});txt(S,56,46,'L-',{a:'end'});txt(S,170,22,'220v Dc');dot(S,130,30);wire(S,[[130,30],[130,74]]);fuse(S,130,85);txt(S,121,89,'F1,2',{a:'end',sz:10.5});wire(S,[[130,96],[130,130]]);txt(S,137,118,'1',{a:'start',sz:10});
  CMP.inner(S,{},{});const [bx,by,bw,bh]=CMP.box,[px,py,pw,ph]=CMP.plate;frame(S,bx,by,bw,bh);S.add(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:${DA.pe}"/>`);
  terms(S,CMP.terms);term(S,312,240);txt(S,318,233,'PE',{a:'start',sz:9.5});gnd(S,312,243);sldEx1(S,()=>0);return S}
/* الشكل (5-25) كما طُبع (غير مكتمل) */
function ex3Given(){const S=Sc(470,350,'التمرين الثالث: مولد ثلاثي الأوجه غير مكتمل');
  ['L1','L2','L3','PE'].forEach((l,i)=>{wire(S,[[24,22+i*12],[210,22+i*12]],null,i===3?'pe':null);txt(S,20,26+i*12,l,{a:'end'})});[70,100,130].forEach((x,i)=>dot(S,x+20,22+i*12));
  dot(S,40,58);wire(S,[[40,58],[40,300]],null,'pe');dot(S,40,300);gnd(S,40,303);
  [70,100,130].forEach(x=>{wire(S,[[x,72],[x,84]]);fuse(S,x,95);wire(S,[[x,106],[x,120]]);cont(S,x,120,144,false);term(S,x,150)});qlink(S,48,124,132,'h');
  deltaW(S,100,250,46);
  rotorDC(S,{rx:262,ry:262,rr:30,dx:370,dy:130});
  return S}
/* حل التمرين الثالث: الشكل (5-15) مكتملاً + الخطية بأجهزة القياس */
function ex3Sol(){const S=fig515({W:640,steps:1});S.at(5);const x=570;txt(S,x,14,'L1,L2,L3,PE',{sz:9.5});let y=sld(S,x,22,[['bar',''],['n',3,1],['fuse',''],['n',3,1],['sw','','h']]);
  wire(S,[[x,y],[x,y+6]]);meter(S,x,y+17,'A',null,11);y+=28;dot(S,x,y+6);wire(S,[[x,y],[x,y+12]]);wire(S,[[x,y+6],[x+44,y+6],[x+44,y+14]]);meter(S,x+44,y+25,'V',null,11);wire(S,[[x+44,y+6],[x+44,y+6]]);meter(S,x+44,y+51,'Hz',null,11);wire(S,[[x+44,y+36],[x+44,y+40]]);y+=12;
  y=sld(S,x,y,[['n',3,1],['G','G','3~△']]);dot(S,x,y+6);wire(S,[[x,y],[x,y+56]]);wire(S,[[x,y+6],[x+34,y+6],[x+34,y+16]]);rheo(S,x+34,y+24,16,.5);y+=20;
  cont(S,x,y+10,y+32,false);y=sld(S,x,y+32,[['w',4],['fuse','']]);S.add(`<path d="M${x-26} ${y+6}H${x+26}" style="stroke:var(--fg);stroke-width:2"/>`);wire(S,[[x,y],[x,y+6]]);dot(S,x,y+6);txt(S,x,y+22,'110vDC',{sz:10});
  return S}
/* الشكل (5-26) كما طُبع: المخطط الخطي المعطى */
function ex4Given(){const S=Sc(200,470,'التمرين الرابع: المخطط الخطي');const x=90;txt(S,x,14,'L1,L2,L3.N,PE 380v',{sz:10});let y=sld(S,x,24,[['bar',''],['n',3,1],['fuse',''],['n',3,1]]);txt(S,x+14,y-4,'380v',{a:'start',sz:9.5});
  wire(S,[[x,y],[x,y+6]]);cont(S,x,y+6,y+30,false);S.add(`<path d="M${x-10} ${y+18}H${x-30}" style="stroke:var(--fg);stroke-width:1.2;stroke-dasharray:3 2"/><rect x="${x-50}" y="${y+8}" width="20" height="22" style="${SK}"/><path d="M${x-48} ${y+28}L${x-32} ${y+10}" style="${SK}"/>`);txt(S,x-40,y+44,'U&lt;',{sz:9.5});y+=30;
  wire(S,[[x,y],[x,y+30]]);thermSym(S,x-26,y+15);S.add(`<path d="M${x-17} ${y+15}H${x}" style="stroke:var(--fg);stroke-width:1;stroke-dasharray:2 2"/>`);slash(S,x,y+24,3);y+=30;
  wire(S,[[x,y],[x,y+12]]);dot(S,x,y+12);txt(S,x+26,y+18,'3~Y',{a:'start',sz:9.5});y=sld(S,x,y+12,[['G','G','']]);dot(S,x,y);y=sld(S,x,y,[['n',2,1],['sw','','h']]);wire(S,[[x,y],[x,y+8]]);dcm(S,x,y+32,'G');txt(S,x+22,y+30,'220v Dc',{a:'start',sz:9.5});return S}
/* حل مقترح للتمرين الرابع: الدائرة التنفيذية */
function ex4Sol(){const S=Sc(570,470,'حل مقترح: الدائرة التنفيذية لمولد 380 V');
  S.at(1);['L1','L2','L3','N','PE'].forEach((l,i)=>{wire(S,[[30,20+i*12],[330,20+i*12]],null,i===3?'n':i===4?'pe':null);txt(S,26,24+i*12,l,{a:'end'})});txt(S,180,11,'L1,L2,L3.N,PE 380v',{sz:10});
  [90,120,150].forEach((x,i)=>{dot(S,x,20+i*12);wire(S,[[x,20+i*12],[x,84]]);fuse(S,x,95);wire(S,[[x,106],[x,120]])});
  S.at(2);[90,120,150].forEach(x=>{cont(S,x,120,144,false);wire(S,[[x,144],[x,152]]);thermSym(S,x,162);wire(S,[[x,170],[x,186]])});qlink(S,62,144,132,'b');
  S.add(`<path d="M58 132V162H81" style="stroke:var(--fg);stroke-width:1;stroke-dasharray:2 2;fill:none"/>`);rbox(S,40,186,'U&lt;',13);S.add(`<path d="M40 178V138" style="stroke:var(--fg);stroke-width:1;stroke-dasharray:2 2"/>`);
  dot(S,90,178);wire(S,[[90,178],[60,178],[60,186],[53,186]]);wire(S,[[27,186],[18,186],[18,56],[30,56]],null,'n');
  rbox(S,40,110,'I',8);rbox(S,40,90,'0',8);S.add(`<path d="M48 110H58M48 90H62V132" style="stroke:var(--fg);stroke-width:1;fill:none;stroke-dasharray:2 2"/>`);
  S.at(3);[90,120,150].forEach(x=>{meter(S,x,200,'A',null,9);wire(S,[[x,209],[x,226]])});
  [[90,232],[120,238],[150,244]].forEach(([x,y])=>{dot(S,x,y);wire(S,[[x,y],[200,y]])});S.add(`<rect x="200" y="226" width="40" height="24" style="${SK}"/>`+T(220,236,'L1,L2',{sz:6.5})+T(220,243,'L1,L3',{sz:6.5})+T(220,250,'L2,L3',{sz:6.5}));
  wire(S,[[240,232],[262,232]]);meter(S,272,232,'V',null,10);wire(S,[[240,244],[282,244],[282,232]]);
  dot(S,90,256);dot(S,120,262);wire(S,[[90,256],[300,256],[300,246]]);wire(S,[[120,262],[324,262],[324,246]]);meter(S,312,236,'Hz',null,10);
  S.at(4);const P=starW(S,120,330,40,null,['V','U','W']);wire(S,[[90,232],[90,270],[P[1][0],P[1][1]]]);wire(S,[[120,238],[120,P[0][1]]]);wire(S,[[150,244],[150,270],[P[2][0],P[2][1]]]);
  dot(S,18,56);wire(S,[[18,186],[18,330],[120,330]],null,'n');dot(S,40,68);wire(S,[[40,68],[40,96]],null,'pe');wire(S,[[340,68],[340,420]],null,'pe');gnd(S,340,420);dot(S,340,68);
  S.at(5);const rx=240,ry=380,sx=rx+26+48;S.add(`<circle cx="${rx}" cy="${ry}" r="26" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/>`);coil(S,rx,ry,34,9);
  wire(S,[[rx+17,ry],[rx+38,ry],[rx+38,ry-14],[sx,ry-14]]);wire(S,[[rx-17,ry+2],[rx-34,ry+2],[rx-34,ry+36],[rx+48,ry+36],[rx+48,ry+14],[sx,ry+14]]);
  [ry-14,ry+14].forEach(y=>S.add(`<rect x="${sx}" y="${y-5}" width="14" height="10" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/><rect x="${sx+14}" y="${y-5}" width="6" height="10" style="fill:var(--fg)"/>`));
  dcm(S,440,380,'G');wire(S,[[sx+20,ry-14],[372,ry-14],[372,340],[404,340]]);meter(S,404,340,'A',null,9);wire(S,[[413,340],[440,340],[440,356]]);wire(S,[[440,404],[440,424],[372,424],[372,ry+14],[sx+20,ry+14]]);
  wire(S,[[440,340],[480,340],[480,369]]);meter(S,480,380,'V',null,10);wire(S,[[480,391],[480,424],[440,424]]);
  wire(S,[[480,340],[540,340],[540,362]]);rheo(S,512,340,22,.5);coil(S,540,380,9,34);wire(S,[[540,398],[540,424],[480,424]]);
  S.add(`<path d="M${rx} ${ry+26}V450H440V428" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:8 4;fill:none"/>`);
  return S}

function labEx(el){el.innerHTML=`<div class="panel" style="margin-bottom:12px"><div class="sub">اختر التمرين الذي تريد التحقق من حله بالتوصيل الفعلي</div>${segHTML('ex',[['1','التمرين (١): المحرك المركب'],['2','التمرين (٢): المحرك أحادي الوجه']],'1')}</div><div id="exh"></div>`;
  const show=k=>{el.querySelectorAll('[data-ex]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ex===k)));const h=el.querySelector('#exh');h.innerHTML='';const d=document.createElement('div');h.appendChild(d);
    if(k==='2')labSP(d,{ex:1});
    else dcBoardLab(d,CMPms,{title:'تحقق من حلك: التمرين (١)',ref:'لوحة أطراف الشكل (5-23) ص 123 مع مفتاح وقاية كما في مخططه الخطي',kind:'cmp',presets:[],
      figNote:'ابدأ بلوحة بلا قناطر، وضع القناطر التي تجعل ملف التوازي على أطراف التغذية وملف التوالي على التوالي مع العضو الدوار.',
      classify(I,st){const a=sgn(I.arm),s=sgn(I.ser),h=sgn(I.sh);const diff=s&&h&&s!==h,fd=s||h,d=a&&fd&&!diff?a*fd:0;const kind=a?(s&&h?(diff?'المجالان متعاكسان':'مركب'):s?'توالٍ فقط':h?'توازٍ فقط':'بلا مجال'):h?'مجال التوازي وحده':'';
        return {d,kind,msg:!st.on&&!st.trip?'Q1 مفتوح.':st.trip?'Q1 مفصول بالوقاية.':kind==='مركب'?'<b>حل صحيح:</b> التيار يمر في ملف التوالي وملف التوازي معاً.':kind?'التوصيل الحالي: '+kind+'. لم يكتمل المحرك المركب بعد.':'لا يكتمل مسار العضو الدوار.'}},
      steps:[{t:'ضع القناطر',x:'ضع ثلاث قناطر تكمل التوصيل (فكّر: أين يتصل ملف التوالي بالعضو الدوار؟).',done:w=>w.j.length>=3},{t:'تحقق',x:'أغلق Q1: يجب أن يظهر «مركب» في نوع التوصيل.',done:w=>w.on&&w.kind==='مركب'}],
      tries:['إذا ظهر «توازٍ فقط» فمسار العضو الدوار لا يمر في ملف التوالي.','قارن حلك بالحل المقترح في «الأمثلة المحلولة».']})};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-ex]');if(b)show(b.dataset.ex)});show('1')}

B.lesson({
 id:'u5-l9',unit:5,order:9,pages:'123–126',
 title:'تمارين الوحدة الخامسة',
 summary:'أربعة تمارين رسم: المحرك المركب، والمحرك أحادي الوجه بمكثف ومفتاح طرد مركزي، ومولد ثلاثي الأوجه مثلث، ومولد 380 V بقاطع أوتوماتيكي — مع حلول مقترحة مرسومة خطوة بخطوة.',
 stations:[
  {intro:true},
{st:1,short:'التمرين (١)',title:'5-4 تمارين — التمرين (١): المحرك المركب',ref:'ص 123',
   q:'لوحة أطراف بلا أي سلك أو قنطرة… من أين تبدأ؟',
   art:U5S.art({S:ex1Given(),vb:[60,196,272,262],label:'لوحة أطراف المحرك المركب المعطاة في التمرين الأول غير موصلة',bg:'#FBE6C4',title:'المعطى: لوحة بلا قناطر',
    tips:[[106,212,28,28,'⟦E2⟧ أحد طرفي ملف التوازي.'],[176,212,28,28,'الطرف الأوسط العلوي (سمّيناه ⟦A1⟧ — في الكتاب ⟦2B2⟧): طرف العضو الدوار.'],[246,212,28,28,'⟦E1⟧ الطرف الآخر لملف التوازي.'],[106,240,28,28,'⟦D2⟧ أحد طرفي ملف التوالي.'],[176,240,28,28,'⟦D1⟧ الطرف الآخر لملف التوالي.'],[246,240,28,28,'⟦2B2⟧ طرف العضو الدوار مع ملفات الأقطاب المساعدة.'],[116,334,62,24,'ملف التوالي.'],[154,420,82,26,'ملف التوازي.']]}),
   cap:'لوحة الأطراف المعطاة في الشكل <span class="ltr">(5-23)</span>.<br><b>مرّر المؤشر على الأطراف والملفين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في المحرك المركب، أين يجب أن يكون ملف التوازي E1–E2؟',opts:[
     ['على التوالي مع العضو الدوار',false,'هذا مكان ملف التوالي D1–D2.'],
     ['على أطراف التغذية (السلكان 2 و4)',true,'كما في الشكل (5-12): السلك 2 إلى E2 والسلك 4 إلى E1.'],
     ['بين PE و L-',false,'PE للتأريض فقط.']]}}
   ],
   body:[
    {tip:String.raw`<p>التمارين التالية كما وردت، وتحت كل شكل معطى ما يطلبه التمرين. الحلول المقترحة (ليست من الكتاب) في تبويب «الأمثلة المحلولة» مرسومة خطوة بخطوة، ويمكنك التحقق من حلّي التمرينين (١) و(٢) بالتوصيل في تبويب «المختبر».</p>`,title:'كيف تستعمل هذه المحطات؟'},
    {book:String.raw`<p>(١) في شكل ${FN('5-23')} المحرك ذو الاستثارة " أقطاب "المزدوجة فيه ملفات استثارة " أقطاب " على التوازي وملفات استثارة " أقطاب "على التوالي ، ارسم المخطط الأساسي المعطى رسماً يجمع بين مسار التيار ومخطط التوصيل.</p>`,ref:'ص 123'},
    {html:U5S.fig(box(ex1Given().svg(),470),490,'<b>الشكل <span class="ltr">(5-23)</span> محرك تيار مستمر مركب</b> (ص 123) — المعطى: بداية المخطط (L+، L-، <span class="ltr">220v Dc</span>، مصهر F1,2 على الفرع الموجب)، وصندوق المحرك ولوحة الأطراف (E2، 2B2، E1 / D2، D1، 2B2، PE) غير موصلة، والمخطط الخطي يميناً (Q1 بمرحلين حراري ومغناطيسي).')},
    {watch:'في الشكل <span class="ltr">(5-23)</span> كما في <span class="ltr">(5-6)</span> و<span class="ltr">(5-10)</span>: المخطط الخطي لدائرة تيار مستمر يكتب الرقم «3» لعدد الموصلات. وطرف «2B2» مطبوع مرتين على اللوحة؛ سمّينا الطرف العلوي الأوسط A1 كما في الدرس 4.'},
    {tip:String.raw`<p>ابدأ من المخطط الخطي المعطى: فيه <b>مفتاح وقاية</b> بمرحل حراري ومغناطيسي، فارسم الجزء العلوي كما في الشكل <span class="ltr">(5-10)</span>. ثم طبّق قناطر الشكل <span class="ltr">(5-12)</span> من الدرس 4.</p>`,title:'من أين تبدأ؟'},
    {title:'مختبر مصغّر: خطة الحل',widget:(el,B)=>DCML.cases(el,B,{intro:'أجب عن أسئلة الخطة قبل أن ترسم.',cases:[
     {q:'إلى أي طرفين تصل السلكين القادمين من مفتاح الوقاية؟',opts:[['E2 و E1',true,'فيصير ملف التوازي على أطراف التغذية.'],['A1 و 2B2',false,'هكذا يصير العضو الدوار وحده على التغذية، ويخرج ملف التوالي من المسار.'],['D1 و D2',false,'هذا يضع ملف التوالي وحده على التغذية.']]},
     {q:'ما القنطرة التي تصل ملف التوالي بالعضو الدوار؟',opts:[['A1–E1',false,'هذه تكمل المسار من العضو الدوار إلى السلك الثاني.'],['D1–2B2',true,'نهاية ملف التوالي إلى طرف العضو الدوار.'],['D1–D2',false,'هذه تقصّر ملف التوالي.']]}]})}
   ]},

  {st:2,short:'التمرين (٢)',title:'التمرين (٢): المحرك أحادي الوجه بمكثف ومفتاح طرد مركزي',ref:'ص 124',
   q:'مفتاح يدوي ثنائي القطب، وأطرافه السفلية بلا أسلاك… أين يذهب كل سلك؟',
   art:U5S.art({S:fig519({top:'q2',given:1,title:'',sldT:'220v-'}),vb:[14,56,284,368],label:'المعطى في التمرين الثاني: المفتاح اليدوي ولوحة الأطراف غير موصلين',bg:'#E3ECF7',title:'المعطى: مفتاح ولوحة',
    tips:[[90,62,74,52,'المفتاح اليدوي ثنائي القطب ⟦Q1⟧: ⟦1، 3⟧ أعلى و⟦2، 4⟧ أسفل.'],[98,232,24,24,'⟦U1⟧ بداية الملف الرئيس.'],[178,232,24,24,'⟦Z1⟧ بداية الملف المساعد.'],[98,262,24,24,'⟦Z2⟧ نهاية الفرع المساعد.'],[178,262,24,24,'⟦U2⟧ نهاية الملف الرئيس.'],[14,304,52,28,'مفتاح الطرد المركزي ⟦n&gt;⟧.'],[46,330,28,20,'المكثف.']]}),
   cap:'الجزء المعطى من الشكل <span class="ltr">(5-24)</span>.<br><b>مرّر المؤشر على المفتاح والأطراف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'يطلب التمرين «تمثيلاً متعدد الأقطاب». ماذا يعني ذلك؟',opts:[
     ['رسم كل موصل بخطه الخاص (الدائرة التنفيذية)',true,'عكس المخطط الخطي الذي يرسم كل الموصلات بخط واحد.'],
     ['رسم المحرك بأقطاب أكثر',false,'«الأقطاب» هنا أقطاب الدائرة (الموصلات)، لا أقطاب المحرك.'],
     ['رسم المخطط الخطي فقط',false,'المخطط الخطي معطى أصلاً.']]}}
   ],
   body:[
    {book:String.raw`<p>(٢) في شكل ${FN('5-24')} ارسم تمثيلاً متعدد الأقطاب للمخططات الأساسية المعطاة (في الرسم الأول ، الجزء المميز بشكل خاص فقط).</p>`,ref:'ص 124'},
    {html:U5S.fig(box(fig519({top:'q2',given:1,title:'',sldT:'220v-'}).svg(),460),480,'<b>الشكل <span class="ltr">(5-24)</span> آلات تيار متردد أحادي الوجه بمكثف ومفتاح طرد مركزي</b> (ص 124) — المعطى: المفتاح اليدوي ثنائي القطب Q1 (1، 3 / 2، 4) والأسلاك غير موصلة تحته، ولوحة الأطراف U1، Z1 / Z2، U2 والملفان والمكثف ومفتاح الطرد المركزي <span class="ltr">n&gt;</span>، والمخطط الخطي يميناً مكتوب عليه <span class="ltr">220v-</span>.')},
    {watch:'المخطط الخطي في الشكل <span class="ltr">(5-24)</span> ص 124 مكتوب عليه «<span class="ltr">220v-</span>» (رمز التيار المستمر) مع أن المحرك أحادي الوجه متردد «<span class="ltr">1~</span>». في الحل المقترح كتبنا <span class="ltr">220v ~</span>.'},
    {title:'مختبر مصغّر: خطة الحل',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'إلى أي طرفين يصل الطرفان 2 و4 من المفتاح اليدوي؟',opts:[['Z1 و Z2',false,'هكذا يصير الفرع المساعد وحده على التغذية.'],['U1 و U2',true,'طرفا الملف الرئيس على التغذية، ثم تضع القنطرتين للفرع المساعد.'],['U1 و PE',false,'PE للتأريض فقط.']]},
     {q:'أي قنطرتين تضع الملف المساعد على التوازي مع الرئيس؟',opts:[['U1–U2 و Z1–Z2',false,'هاتان تقصّران الملفين.'],['U1–Z1 و Z2–U2',true,'كما في الشكل (5-19).'],['لا حاجة لقناطر',false,'بلا قناطر لا يتصل الفرع المساعد بالخطين فيطن المحرك.']]}]})}
   ]},

  {st:3,short:'التمرين (٣)',title:'التمرين (٣): المولد ثلاثي الأوجه دلتا',ref:'ص 125',
   q:'ملفات مثلث منفصلة وقضبان غير متصلة… ما الذي ينقص لتكتمل الدائرة؟',
   art:U5S.art({S:ex3Given(),vb:[14,14,360,320],label:'المعطى غير المكتمل في التمرين الثالث',bg:'#DDEFE6',title:'المعطى غير مكتمل',
    tips:[[14,16,200,46,'القضبان ⟦L1 L2 L3⟧ و⟦PE⟧: غير متصلة بالخطوط بعد.'],[58,82,84,28,'المصاهر الثلاثة.'],[44,116,100,42,'المفتاح ثلاثي الأقطاب وأطرافه السفلية.'],[44,196,112,82,'ملفات المثلث منفصلة: يجب وصل رؤوسها بخرج المفتاح.'],[228,228,68,68,'العضو الدوار وحلقتا الانزلاق.'],[300,120,74,110,'دائرة التيار المستمر للتنبيه.']]}),
   cap:'المعطى في الشكل <span class="ltr">(5-25)</span>.<br><b>مرّر المؤشر على الأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الحل يتبع أي شكل من الدرس 6؟',opts:[
     ['الشكل (5-15): مولد ثلاثي الأوجه ملفاته مثلث',true,'المعطى نفس عناصر الشكل (5-15) بلا توصيلات.'],
     ['الشكل (5-17): مولد نجمة بمحولات قياس',false,'الملفات هنا مثلث، ولا محولات قياس في المعطى.'],
     ['الشكل (5-13): مولد وجه واحد',false,'هنا ثلاثة خطوط.']]}}
   ],
   body:[
    {book:String.raw`<p>(٣)شكل ${FN('5-25')} يوضح الرسم التنفيذي لمولد تيار متغير ثلاثي الأوجه موصل دلتا صغير القدرة ذا عضو استنتاج دائر وتغذي الأقطاب من قضبان توزيع التيار المستمر. المطلوب إعادة رسم الدائرة التنفيذية بعد تكملتها ثم ارسم الدائرة الخطية مع استكمال الأجهزة اللازمة.</p>`,ref:'ص 125'},
    {html:U5S.fig(box(ex3Given().svg(),470),490,'<b>الشكل <span class="ltr">(5-25)</span> مولد تيار متغير ثلاثي الأوجه</b> (ص 125) — المعطى غير مكتمل: القضبان L1، L2، L3، PE غير متصلة بالخطوط، والمصاهر والمفتاح ثلاثي الأقطاب وأطرافه، وملفات المثلث منفصلة، ودائرة التيار المستمر والعضو الدوار.')},
    {watch:'نص التمرين (٣) يقول «ذا عضو استنتاج دائر» بينما الرسم يجعل ملفات المثلث ثابتة والأقطاب (الملف داخل الدائرة) هي الدوارة عبر الفرش، أي أن عضو الاستنتاج ساكن كما في الشكل <span class="ltr">(5-15)</span>. الحل المقترح يتبع الرسم.'},
    {title:'مختبر مصغّر: ماذا تضيف؟',widget:(el,B)=>DCML.tf(el,B,{intro:'أي هذه الخطوات من تكملة الدائرة؟',items:[
     ['وصل القضبان L1 و L2 و L3 بالمصاهر ثم المفتاح.',true,'هذا أول ما ينقص المعطى.'],
     ['وصل خرج المفتاح برؤوس المثلث الثلاثة.',true,'كما في الشكل (5-15): L2 إلى الرأس العلوي، L1 إلى الأيسر، L3 إلى الأيمن.'],
     ['وصل الملفات نجمة وإخراج خط N.',false,'التمرين يقول «موصل دلتا»، والدلتا بلا نقطة تعادل.'],
     ['أميتر على التوالي وفولتميتر ومقياس تردد على التوازي في الدائرة الخطية.',true,'هذه «الأجهزة اللازمة» في اقتراحنا، كما في الشكل (5-14).']]})}
   ]},

  {st:4,short:'التمرين (٤)',title:'التمرين (٤): مولد 380 V بقاطع أوتوماتيكي',ref:'ص 126',
   q:'دائرة خطية من سطر واحد… كم جهاز قياس تحتاج حين ترسمها تنفيذية؟',
   art:U5S.art({S:ex4Given(),vb:[20,0,180,330],label:'الدائرة الخطية المعطاة في التمرين الرابع',bg:'#FBE6C4',title:'المعطى: دائرة خطية',
    tips:[[30,2,140,30,'القضبان ⟦L1,L2,L3.N,PE 380v⟧.'],[34,98,34,46,'ملف نقص الجهد ⟦U&lt;⟧: وقاية مغناطيسية ضد نقص الجهد.'],[50,126,30,26,'المرحل الحراري: وقاية ضد زيادة التيار.'],[66,164,48,44,'المولد ⟦3~Y⟧.'],[66,264,48,52,'المغذي: مولد تيار مستمر ⟦220v Dc⟧ على محور الدوران.']]}),
   cap:'الشكل <span class="ltr">(5-26)</span> المعطى.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الوقاية ضد نقص الجهد في هذا المولد؟',opts:[
     ['مرحل حراري',false,'الحراري ضد زيادة التيار.'],
     ['مصهر',false,'المصهر ضد القصر.'],
     ['وقاية مغناطيسية (ملف نقص الجهد U<)',true,'«ووقاية مغناطيسية ضد نقص الجهد» (ص 126).']]}}
   ],
   body:[
    {book:String.raw`<p>(٤) شكل ${FN('5-26')} يوضح الدائرة الخطية لمولد تيار متغير ثلاثي الأوجه <span class="ltr">380 V</span> وهذا المولد يتصل بالقضبان العمومية بقاطع أوتوماتيكي ذي أزرار ضاغطة للتشغيل والإيقاف ومزود بوقاية حرارية ضد زيادة التيار ووقاية مغناطيسية ضد نقص الجهد و تغذى أقطابه بالتيار المستمر من مغذٍ مركب على محور الدوران. المطلوب رسم الدائرة التنفيذية مع بيان أجهزة القياس اللازمة لتشغيل المولد في كل من دائرتي تيار المولد.</p>`,ref:'ص 126'},
    {watch:'هذا التمرين غير مرقم في الكتاب (ص 126)؛ هو التمرين الرابع.'},
    {html:U5S.fig(box(ex4Given().svg(),220),240,'<b>الشكل <span class="ltr">(5-26)</span> مولد تيار متغير ثلاثي الأوجه</b> (ص 126) — الدائرة الخطية المعطاة: القضيب <span class="ltr">380v</span>، المصهر، القاطع الأوتوماتيكي بملف نقص الجهد ومرحل حراري، المولد <span class="ltr">3~Y</span>، المفتاح، والمثير <span class="ltr">220v Dc</span>.')},
    {tip:String.raw`<p>«دائرتا تيار المولد» هما: <b>دائرة التيار المتردد</b> (الخرج إلى القضبان) و<b>دائرة التيار المستمر</b> (تغذية الأقطاب). لكل دائرة أجهزة قياسها.</p>`,title:'ما «دائرتا التيار»؟'},
    {title:'مختبر مصغّر: أي جهاز لأي دائرة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف أجهزة القياس المقترحة في الحل (ليست من الكتاب) حسب الدائرة التي توضع فيها.',cats:['دائرة التيار المتردد','دائرة التيار المستمر'],items:[
     ['ثلاثة أميترات، واحد في كل خط',0,'تقيس تيارات الخطوط الثلاثة للمولد.'],['فولتميتر مع مبدّل (L1,L2 / L1,L3 / L2,L3)',0,'يقيس جهود الخطوط.'],['مقياس تردد Hz',0,'تردد الجهد المتردد.'],
     ['أميتر في دائرة ملف الأقطاب',1,'يقيس تيار التنبيه المستمر.'],['فولتميتر على المغذي',1,'يقيس جهد التيار المستمر المغذي للأقطاب.']]})}
   ]},

  {recap:[
   'التمرين (١): محرك مركب — السلكان إلى E2 و E1، والقناطر E2–D2 و D1–2B2 و A1–E1، مع مفتاح وقاية كما في الشكل <span class="ltr">(5-10)</span>.',
   'التمرين (٢): الطرفان 2 و4 إلى U1 و U2، وقنطرتا U1–Z1 و Z2–U2؛ ومفتاح الطرد المركزي في الفرع المساعد.',
   'التمرين (٣): أكمل الشكل <span class="ltr">(5-15)</span> (مثلث) ثم ارسم الخطية مع أميتر وفولتميتر ومقياس تردد.',
   'التمرين (٤): قاطع أوتوماتيكي بوقاية حرارية ومغناطيسية، وأجهزة قياس في دائرتي التيار المتردد والمستمر.']}
],
 theory:[
  {h:'5-4 تمارين',ref:'ص 123',html:'<p>التمارين التالية كما وردت، وتحت كل شكل معطى ما يطلبه التمرين. الحلول المقترحة (ليست من الكتاب) في تبويب «الأمثلة المحلولة» مرسومة خطوة بخطوة، ويمكنك التحقق من حلّي التمرينين (١) و(٢) بالتوصيل في تبويب «المختبر».</p>'},
  {h:'التمرين (١)',ref:'ص 123',html:`<p>(١) في شكل ${FN('5-23')} المحرك ذو الاستثارة " أقطاب "المزدوجة فيه ملفات استثارة " أقطاب " على التوازي وملفات استثارة " أقطاب "على التوالي ، ارسم المخطط الأساسي المعطى رسماً يجمع بين مسار التيار ومخطط التوصيل.</p>`},
  {fig:FN('5-23'),ref:'ص 123',caption:'محرك تيار مستمر مركب — المعطى: بداية المخطط (L+، L-، <span class="ltr">220v Dc</span>، مصهر F1,2 على الفرع الموجب)، وصندوق المحرك ولوحة الأطراف (E2، 2B2، E1 / D2، D1، 2B2، PE) غير موصلة، والمخطط الخطي يميناً (Q1 بمرحلين حراري ومغناطيسي).',draw:()=>box(ex1Given().svg(),470)},
  {err:'في الشكل (5-23) كما في (5-6) و(5-10): المخطط الخطي لدائرة تيار مستمر يكتب الرقم «3» لعدد الموصلات. وطرف «2B2» مطبوع مرتين على اللوحة؛ سمّينا الطرف العلوي الأوسط A1 كما في الدرس 4.'},
  {h:'التمرين (٢)',ref:'ص 124',html:`<p>(٢) في شكل ${FN('5-24')} ارسم تمثيلاً متعدد الأقطاب للمخططات الأساسية المعطاة (في الرسم الأول ، الجزء المميز بشكل خاص فقط).</p>`},
  {fig:FN('5-24'),ref:'ص 124',caption:'آلات تيار متردد أحادي الوجه بمكثف ومفتاح طرد مركزي — المعطى: المفتاح اليدوي ثنائي القطب Q1 (1، 3 / 2، 4) والأسلاك غير موصلة تحته، ولوحة الأطراف U1، Z1 / Z2، U2 والملفان والمكثف ومفتاح الطرد المركزي <span class="ltr">n&gt;</span>، والمخطط الخطي يميناً مكتوب عليه <span class="ltr">220v-</span>.',draw:()=>box(fig519({top:'q2',given:1,title:'',sldT:'220v-'}).svg(),460)},
  {err:'المخطط الخطي في الشكل (5-24) ص 124 مكتوب عليه «<span class="ltr">220v-</span>» (رمز التيار المستمر) مع أن المحرك أحادي الوجه متردد «<span class="ltr">1~</span>». في الحل المقترح كتبنا <span class="ltr">220v ~</span>.'},
  {h:'التمرين (٣)',ref:'ص 125',html:`<p>(٣)شكل ${FN('5-25')} يوضح الرسم التنفيذي لمولد تيار متغير ثلاثي الأوجه موصل دلتا صغير القدرة ذا عضو استنتاج دائر وتغذي الأقطاب من قضبان توزيع التيار المستمر. المطلوب إعادة رسم الدائرة التنفيذية بعد تكملتها ثم ارسم الدائرة الخطية مع استكمال الأجهزة اللازمة.</p>`},
  {fig:FN('5-25'),ref:'ص 125',caption:'مولد تيار متغير ثلاثي الأوجه — المعطى غير مكتمل: القضبان L1، L2، L3، PE غير متصلة بالخطوط، والمصاهر والمفتاح ثلاثي الأقطاب وأطرافه، وملفات المثلث منفصلة، ودائرة التيار المستمر والعضو الدوار.',draw:()=>box(ex3Given().svg(),470)},
  {err:'نص التمرين (٣) يقول «ذا عضو استنتاج دائر» بينما الرسم يجعل ملفات المثلث ثابتة والأقطاب (الملف داخل الدائرة) هي الدوارة عبر الفرش، أي أن عضو الاستنتاج ساكن كما في الشكل (5-15). الحل المقترح يتبع الرسم.'},
  {h:'التمرين (٤)',ref:'ص 126',html:`<p>(٤) شكل ${FN('5-26')} يوضح الدائرة الخطية لمولد تيار متغير ثلاثي الأوجه <span class="ltr">380 V</span> وهذا المولد يتصل بالقضبان العمومية بقاطع أوتوماتيكي ذي أزرار ضاغطة للتشغيل والإيقاف ومزود بوقاية حرارية ضد زيادة التيار ووقاية مغناطيسية ضد نقص الجهد و تغذى أقطابه بالتيار المستمر من مغذٍ مركب على محور الدوران. المطلوب رسم الدائرة التنفيذية مع بيان أجهزة القياس اللازمة لتشغيل المولد في كل من دائرتي تيار المولد.</p>`},
  {err:'هذا التمرين غير مرقم في الكتاب (ص 126)؛ هو التمرين الرابع.'},
  {fig:FN('5-26'),ref:'ص 126',caption:'مولد تيار متغير ثلاثي الأوجه — الدائرة الخطية المعطاة: القضيب <span class="ltr">380v</span>، المصهر، القاطع الأوتوماتيكي بملف نقص الجهد ومرحل حراري، المولد <span class="ltr">3~Y</span>، المفتاح، والمثير <span class="ltr">220v Dc</span>.',draw:()=>box(ex4Given().svg(),220)}
 ],
 lab:(el)=>labEx(el),
 examples:[
  drawEx({title:'التمرين (١) — حل مقترح (ليس من الكتاب)',ref:'ص 123',mw:470,scene:(()=>{const ev=evalBoard(CMPms,{on:1,j:CMPJ});return boardFig(CMPms,{on:0,j:CMPJ},{steps:1,arr:arrFrom(ev.I,{},'cmp'),sld:sldEx1})})(),
   q:'<p>ارسم مخطط المحرك المركب الذي يجمع بين مسار التيار ومخطط التوصيل، حسب المخطط الخطي المعطى (مفتاح Q1 بوقاية حرارية ومغناطيسية).</p>',
   steps:['ارسم القضيبين L+ و L- ومفتاح الوقاية Q1 كما في الشكل (5-10): L+ إلى الطرف 1، و L- إلى الطرف 6، وقنطرة علوية 3–5. والمخطط الخطي المعطى بجانبه.',
    'ارسم صندوق المحرك ولوحة الأطراف كما هي معطاة: E2، A1، E1 أعلى، و D2، D1، 2B2 أسفل، و PE.','صِل الملفات داخل الصندوق: العضو الدوار بين A1 و 2B2، وملف التوالي بين D2 و D1، وملف التوازي بين E2 و E1.',
    'صِل الطرف 2 بـ E2، والطرف 4 بـ E1.','ضع القناطر E2–D2، و D1–2B2، و A1–E1.','أضف الأسهم.']}),
  drawEx({title:'التمرين (٢) — حل مقترح (ليس من الكتاب)',ref:'ص 124',mw:460,scene:fig519({steps:1,top:'q2',j:['U1|Z1','U2|Z2']}),
   q:'<p>ارسم التمثيل متعدد الأقطاب للمحرك أحادي الوجه بمكثف ومفتاح طرد مركزي مع المفتاح اليدوي Q1.</p>',
   steps:['القضيبان L1 و N وخط PE (<span class="ltr">220v ~</span>)، والمصهر على L1، والمفتاح اليدوي ثنائي القطب Q1 (1–2 و 3–4).','لوحة الأطراف U1، Z1 / Z2، U2 وطرف PE مؤرّض.','داخل الصندوق: الملف الرئيس بين U1 و U2، والفرع المساعد Z2 ← n> ← المكثف ← الملف المساعد ← Z1.',
    'صِل الطرف 2 بـ U1، والطرف 4 بـ U2.','ضع القنطرتين U1–Z1 و Z2–U2 (الملف المساعد على التوازي مع الرئيس).','المخطط الخطي: القضيب، المصهر، Q1، ثم المحرك <span class="ltr">M 1~</span> وفرع المكثف.']}),
  drawEx({title:'التمرين (٣) — حل مقترح (ليس من الكتاب)',ref:'ص 125',mw:640,scene:ex3Sol(),
   q:'<p>أكمل الدائرة التنفيذية لمولد ثلاثي الأوجه مثلث، ثم ارسم الدائرة الخطية مع أجهزة القياس.</p>',
   steps:['صِل القضبان L1، L2، L3 بالمصاهر ثم المفتاح ثلاثي الأقطاب.','صِل خرج المفتاح برؤوس المثلث: L2 إلى الرأس العلوي، و L1 إلى الأيسر، و L3 إلى الأيمن، وأرّض من PE.','ارسم العضو الدوار وحلقتي الانزلاق.',
    'أكمل دائرة التيار المستمر: الخط السالب إلى الفرشاة العليا، والموجب عبر المقاومة المتغيرة إلى السفلى.','الدائرة الخطية مع الأجهزة اللازمة (اقتراحنا): أميتر A في الخط، وفولتميتر V ومقياس تردد Hz على التوازي، ثم المولد <span class="ltr">3~△</span>، وفرع المقاومة المتغيرة ومفتاح ومصهر وقضيب <span class="ltr">110vDC</span>.']}),
  drawEx({title:'التمرين (٤) — حل مقترح (ليس من الكتاب)',ref:'ص 126',mw:570,scene:ex4Sol(),
   q:'<p>ارسم الدائرة التنفيذية لمولد 380 V يتصل بالقضبان بقاطع أوتوماتيكي، مع أجهزة القياس في دائرتي التيار المتردد والمستمر.</p>',
   steps:['القضبان L1، L2، L3، N، PE (<span class="ltr">380v</span>) والمصاهر الثلاثة.','القاطع الأوتوماتيكي ثلاثي الأقطاب: تحت كل قطب مرحل حراري ضد زيادة التيار، وملف نقص الجهد <span class="ltr">U&lt;</span> بين L1 و N، وزرا التشغيل I والإيقاف 0.',
    'أجهزة القياس في دائرة التيار المتردد: ثلاثة أميترات A (أميتر في كل خط)، وفولتميتر V مع مبدّل (L1,L2 / L1,L3 / L2,L3)، ومقياس تردد Hz.','ملفات العضو الساكن نجمة U، V، W، ونقطة النجمة إلى N.',
    'العضو الدوار وحلقتا الانزلاق، والمغذي: مولد تيار مستمر G على محور الدوران نفسه (الخط المتقطع)، بملف مجال توازٍ ومقاومة متغيرة، وفي دائرته أميتر A وفولتميتر V.']})
 ],
 quiz:[
  {q:'في التمرين (١)، ما المطلوب رسمه؟',o:['مخطط خطي فقط','رسم يجمع بين مسار التيار ومخطط التوصيل للمحرك المركب','مخطط الملفات فقط','لا شيء'],c:1,e:'(ص 123).'},
  {q:'ما وظيفة مفتاح الطرد المركزي n> في محرك التمرين (٢)؟',o:['يفصل الملف الرئيس','يفصل الفرع المساعد عند ارتفاع السرعة','يعكس الاتجاه','يحمي من القصر'],c:1,e:'كما في الشكل (5-19).'},
  {q:'في التمرين (٣)، ملفات العضو الساكن موصلة:',o:['نجمة','دلتا (مثلث)','على التوالي','غير موصلة'],c:1,e:'(ص 125).'},
  {q:'في التمرين (٤)، ما الوقاية ضد نقص الجهد؟',o:['مرحل حراري','وقاية مغناطيسية (ملف نقص الجهد)','مصهر','مانعة صواعق'],c:1,e:'«ووقاية مغناطيسية ضد نقص الجهد» (ص 126).'},
  {q:'من أين تتغذى أقطاب مولد التمرين (٤)؟',o:['من البطارية','من مغذٍ مركب على محور الدوران','من الشبكة مباشرة','لا تتغذى'],c:1,e:'(ص 126).'},
  {q:'ما الخطأ في المخطط الخطي للشكل (5-24)؟',o:['كُتب 220v- (مستمر) لمحرك متردد 1~','لا يوجد مصهر','رقم الشكل خطأ','لا يوجد مكثف'],c:0,e:'(ص 124).'}
 ]
});

})(PLCBOOK);
