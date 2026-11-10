/* Unit 3 — محركات التحكم (ص 44–56) */
(function(B){
const {S,clamp,W}=B;

/* =====================================================================
   Small helpers for this unit (local copies; other units may not be loaded)
   ===================================================================== */
const q=(el,s)=>el.querySelector(s);
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group" style="flex-wrap:wrap">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,cur)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(cur)));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const slHTML=(id,label,min,max,step,val)=>`<label style="display:flex;flex-direction:column;gap:2px;min-width:200px;flex:1 1 220px;font-size:13.5px"><span>${label}: <b class="ltr" id="${id}-v" style="font-family:var(--mono)"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" dir="ltr" style="width:100%;accent-color:var(--blue);direction:ltr"></label>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryBox=id=>`<h3 style="font-size:15px;margin-top:12px">جرّب</h3><ol class="steps" id="${id}"></ol>`;
/* free-order «جرّب» list: each item ticks itself when its condition first becomes true */
function tryList(host,items){const done=items.map(()=>false);
  const draw=()=>{host.innerHTML=items.map((s,j)=>`<li class="${done[j]?'done':''}" style="color:var(--fg)"><span class="k">${done[j]?'✓':j+1}</span><div><h4>${s.t}</h4><p style="display:block">${s.x}</p></div></li>`).join('')};draw();
  return {check(w){let ch=false;items.forEach((s,j)=>{if(!done[j]&&s.done&&s.done(w)){done[j]=true;ch=true}});if(ch)draw()},redraw:draw};}
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const tx=(x,y,s,o)=>{o=o||{};return `<text class="txt${o.ar?' ar':''}${o.c?' '+o.c:''}" x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const nf=(v,d)=>(Math.abs(v)<1e-12?0:v).toFixed(d);
const bdi=s=>`<span class="ltr" style="direction:ltr;unicode-bidi:isolate">${s}</span>`;
function cp(x1,y1,x2,y2,n){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${x1.toFixed(1)} ${y1.toFixed(1)}L${(x1+ux*lead).toFixed(1)} ${(y1+uy*lead).toFixed(1)}`;
  for(let i=1;i<=n;i++){p+=`A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(x1+ux*(lead+seg*i)).toFixed(1)} ${(y1+uy*(lead+seg*i)).toFixed(1)}`}
  return p+`L${x2.toFixed(1)} ${y2.toFixed(1)}`}
const zig=(x1,y,x2)=>{const n=6,w=(x2-x1)/n;let p=`M${x1} ${y}`;for(let i=0;i<n;i++)p+=`L${(x1+w*(i+.5)).toFixed(1)} ${y+(i%2?7:-7)}`;return p+`L${x2} ${y}`};
const arrowHead=(x,y,ang,sz,col)=>{const a1=ang+2.6,a2=ang-2.6;return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${(x+sz*Math.cos(a1)).toFixed(1)} ${(y+sz*Math.sin(a1)).toFixed(1)}L${(x+sz*Math.cos(a2)).toFixed(1)} ${(y+sz*Math.sin(a2)).toFixed(1)}Z" fill="var(${col})"/>`};

/* generic SVG x–y plot. ticks: numbers or [value,label] */
let PID=0;
function plot(o){
  const Wd=o.W||520,H=o.H||300,ml=o.ml||54,mr=o.mr||16,mt=o.mt||22,mb=o.mb||40,[x0,x1]=o.x,[y0,y1]=o.y,id='u3p'+(++PID);
  const X=v=>ml+(v-x0)/(x1-x0)*(Wd-ml-mr),Y=v=>mt+(1-(v-y0)/(y1-y0))*(H-mt-mb);
  const tk=t=>Array.isArray(t)?t:[t,String(t)];
  let s=`<svg viewBox="0 0 ${Wd} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${id}"><rect x="${ml}" y="${mt-2}" width="${Wd-ml-mr}" height="${H-mt-mb+4}"/></clipPath></defs>`;
  (o.shade||[]).forEach(r=>{const a=X(Math.max(x0,r.x0)),b=X(Math.min(x1,r.x1));s+=`<rect x="${a.toFixed(1)}" y="${mt}" width="${(b-a).toFixed(1)}" height="${H-mt-mb}" fill="var(${r.col||'--surface-2'})"/>`;if(r.label)s+=tx((a+b)/2,mt+14,r.label,{ar:1,c:'m'})});
  (o.xt||[]).forEach(t=>{const [v,l]=tk(t);s+=`<path d="M${X(v).toFixed(1)} ${mt}V${H-mb}" stroke="var(--line)" stroke-width="1"/>`+tx(X(v),H-mb+15,l,{c:'m'})});
  (o.yt||[]).forEach(t=>{const [v,l]=tk(t);s+=`<path d="M${ml} ${Y(v).toFixed(1)}H${Wd-mr}" stroke="var(--line)" stroke-width="1"/>`+tx(ml-6,Y(v)+4,l,{c:'m',a:'end'})});
  const ax=o.ax0!==false&&x0<=0&&x1>=0?X(0):ml,ay=y0<=0&&y1>=0?Y(0):H-mb;
  s+=`<path d="M${ml} ${ay.toFixed(1)}H${Wd-mr}M${ax.toFixed(1)} ${mt-6}V${H-mb}" stroke="var(--fg)" stroke-width="1.4"/>`;
  if(o.xl)s+=tx(Wd-mr,H-6,o.xl,{a:'end'});if(o.yl)s+=tx(ml-2,12,o.yl,{a:'start'});
  s+=`<g clip-path="url(#${id})">`;
  (o.hl||[]).forEach(h=>{s+=`<path d="M${ml} ${Y(h.y).toFixed(1)}H${Wd-mr}" stroke="var(${h.col||'--muted'})" stroke-width="1.4" stroke-dasharray="${h.dash||'6 5'}"/>`});
  (o.vl||[]).forEach(h=>{s+=`<path d="M${X(h.x).toFixed(1)} ${mt}V${H-mb}" stroke="var(${h.col||'--muted'})" stroke-width="1.4" stroke-dasharray="${h.dash||'6 5'}"/>`});
  (o.lines||[]).forEach(l=>{if(!l.pts||l.pts.length<2)return;const d=l.pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
    s+=`<path d="${d}" fill="none" stroke="var(${l.col||'--blue'})" stroke-width="${l.w||2.4}"${l.dash?` stroke-dasharray="${l.dash}"`:''} opacity="${l.op==null?1:l.op}" stroke-linejoin="round" stroke-linecap="round"/>`});
  (o.dots||[]).forEach(p=>{s+=`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${p.r||6}" fill="var(${p.col||'--stop'})" stroke="var(--surface)" stroke-width="2"/>`});
  s+='</g>';
  (o.hl||[]).forEach(h=>{if(h.label)s+=tx(h.lx!=null?X(h.lx):Wd-mr-4,Y(h.y)-5,h.label,{a:h.la||'end',col:h.col||'--muted',ar:h.ar})});
  (o.vl||[]).forEach(h=>{if(h.label)s+=tx(X(h.x)+4,h.ly!=null?Y(h.ly):H-mb-6,h.label,{a:'start',col:h.col||'--muted',ar:h.ar})});
  (o.labels||[]).forEach(l=>{s+=tx(X(l.x)+(l.dx||0),Y(l.y)+(l.dy||0),l.s,{a:l.a||'middle',col:l.col,ar:l.ar,c:l.c,fs:l.fs})});
  return s+'</svg>';
}
const fn2pts=(f,a,b,n)=>{n=n||120;const r=[];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;r.push([x,f(x)])}return r};

/* =====================================================================
   AC two-phase servo drawings
   ===================================================================== */
/* الشكل (٣-١): schematic as in the book (control winding a vertical, constant-voltage winding m horizontal, cage rotor) */
function fig31SVG(){
  let s=`<svg viewBox="0 0 460 250" role="img" aria-label="محرك التحكم للتيار المتردد: ملفان متعامدان ودوار قفص">`;
  s+=`<path class="w" d="${cp(120,40,120,150,5)}" style="stroke:var(--blue);stroke-width:2.6"/>`+S.w('M120 40H70')+S.dot(70,40)+tx(60,44,'a',{a:'end'});
  s+=`<path class="w" d="${cp(130,180,250,180,5)}" style="stroke:var(--live);stroke-width:2.6"/>`+S.w('M250 180V215')+S.dot(250,215)+tx(262,220,'m',{a:'start'});
  s+=tx(150,95,'Control Winding',{a:'start'})+tx(190,212,'Constant Voltage Winding',{a:'middle'});
  s+=tx(205,140,'Stator Windings',{a:'start',c:'m'})+`<path d="M200 136L136 104" class="sym dim"/>`+arrowHead(136,104,Math.atan2(104-136,136-200),9,'--wire')+`<path d="M215 146L196 172" class="sym dim"/>`+arrowHead(196,172,Math.atan2(172-146,196-215),9,'--wire');
  s+=`<circle cx="370" cy="110" r="62" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle cx="370" cy="110" r="22" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<circle cx="${(370+44*Math.cos(a)).toFixed(1)}" cy="${(110+44*Math.sin(a)).toFixed(1)}" r="7" fill="var(--live-soft)" stroke="var(--live)" stroke-width="1.6"/>`}
  s+=tx(370,196,'Rotor');
  return s+'</svg>';
}
/* live cross-section: stator with 4 poles (a = vertical pair, m = horizontal pair), cage rotor, field vector */
function acServoSVG(id){
  const c=160;let s=`<svg viewBox="0 0 320 320" role="img" aria-label="مقطع محرك التحكم ثنائي الوجه">`;
  s+=`<circle cx="${c}" cy="${c}" r="152" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/><circle cx="${c}" cy="${c}" r="94" fill="var(--surface)" stroke="var(--line)"/>`;
  [[0,'a','--blue'],[90,'m','--live'],[180,'a','--blue'],[270,'m','--live']].forEach(([ang,l,col],i)=>{
    s+=`<g transform="rotate(${ang} ${c} ${c})"><rect x="${c-20}" y="18" width="40" height="50" fill="var(--wire)" opacity=".55"/><rect x="${c-30}" y="66" width="60" height="6" rx="2" fill="var(--wire)"/>`+
      `<rect id="${id}-c${i}" x="${c-30}" y="30" width="60" height="26" rx="5" fill="var(${col})" opacity=".35" stroke="var(${col})" stroke-width="2"/>`;
    for(let k=0;k<5;k++)s+=`<path d="M${c-26+k*13} 30V56" stroke="var(${col})" stroke-width="1.2"/>`;
    s+=`</g>`;
    const r=ang%180?144:136,rad=(ang-90)*Math.PI/180;s+=tx(c+r*Math.cos(rad)+(ang%180?0:18),c+r*Math.sin(rad)+(ang===0?6:ang===180?2:5),l,{col:col,fs:14})});
  s+=`<g id="${id}-rot"><circle cx="${c}" cy="${c}" r="82" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<circle cx="${(c+68*Math.cos(a)).toFixed(1)}" cy="${(c+68*Math.sin(a)).toFixed(1)}" r="8" fill="var(--live-soft)" stroke="var(--live)" stroke-width="1.6"/>`}
  s+=`<circle cx="${c}" cy="${c}" r="12" fill="var(--fg)"/><circle cx="${c}" cy="${c-46}" r="6" fill="var(--stop)"/></g>`;
  s+=`<path id="${id}-tr" d="" fill="none" stroke="var(--on)" stroke-width="1.4" stroke-dasharray="4 4"/><path id="${id}-B" d="" stroke="var(--on)" stroke-width="5" stroke-linecap="round" fill="none"/><path id="${id}-Bh" d="" fill="var(--on)"/>`;
  return s+'</svg>';
}
/* field components (screen coords; x = axis of m winding, y = axis of a winding) */
const fieldAt=(src,k,d,phi)=>src==='1ph'?[Math.cos(phi),k*Math.cos(phi)]:[Math.cos(phi),k*d*Math.sin(phi)];
function fieldPaths(src,k,d,phi,c,R){const [bx,by]=fieldAt(src,k,d,phi);const x=c+R*bx,y=c+R*by,a=Math.atan2(y-c,x-c),L=Math.hypot(x-c,y-c);
  let tr='';for(let i=0;i<=48;i++){const [u,v]=fieldAt(src,k,d,i/48*2*Math.PI);tr+=(i?'L':'M')+(c+R*u).toFixed(1)+' '+(c+R*v).toFixed(1)}
  const hx=x,hy=y;const head=L>8?`M${hx.toFixed(1)} ${hy.toFixed(1)}L${(hx+13*Math.cos(a+2.6)).toFixed(1)} ${(hy+13*Math.sin(a+2.6)).toFixed(1)}L${(hx+13*Math.cos(a-2.6)).toFixed(1)} ${(hy+13*Math.sin(a-2.6)).toFixed(1)}Z`:'';
  const bx0=c+(L>8?(L-10)/L:0)*(x-c),by0=c+(L>8?(L-10)/L:0)*(y-c);
  return {B:`M${c} ${c}L${bx0.toFixed(1)} ${by0.toFixed(1)}`,H:head,T:tr,im:Math.cos(phi),ia:src==='1ph'?k*Math.cos(phi):k*d*Math.sin(phi)}}
/* supply wiring for lesson 1: reference winding m (with series capacitor in 'cap' mode), control winding a from Va */
function wiringSVG(src,k,d,shorted){
  const on=1,ca=k>0;let s=`<svg viewBox="-34 0 554 190" role="img" aria-label="توصيل الملفين بالمصدر">`;
  const _w=0;const srcC=(x,y,lbl,act)=>`<circle cx="${x}" cy="${y}" r="17" fill="var(--surface)" stroke="${act?'var(--live)':'var(--wire)'}" stroke-width="2.2"/><path d="M${x-9} ${y}q4.5 -9 9 0t9 0" fill="none" stroke="var(--fg)" stroke-width="1.8"/>`+tx(x-24,y+5,lbl,{a:'end'});
  // row 1: m winding
  s+=srcC(50,60,'Vm',on)+S.w('M50 43V20H180','live');
  if(src==='cap'){s+=`<path d="M180 8V32M190 8V32" stroke="var(--fg)" stroke-width="2.6"/>`+tx(185,48,'C',{})+S.w('M190 20H300','live')}else s+=S.w('M180 20H300','live');
  s+=`<path class="w" d="${cp(300,20,420,20,5)}" style="stroke:var(--live);stroke-width:2.6"/>`+tx(360,48,'m  (constant voltage)',{c:'m'})+S.w('M420 20H480V100H50V77','live');
  // row 2: a winding
  s+=srcC(50,140,src==='1ph'||src==='cap'?'Va':'Va',ca)+`<path d="M34 156L66 124" stroke="var(--blue)" stroke-width="2"/>`+arrowHead(66,124,-Math.PI/4,9,'--blue');
  const ac=ca?'live':'';s+=S.w('M50 123V115H300',ac)+`<path class="w" d="${cp(300,115,420,115,5)}" style="stroke:var(--blue);stroke-width:2.6"/>`+S.w('M420 115H480V178H50V157',ac);
  s+=tx(360,143,'a  (control)',{c:'m'});
  // short switch across a (only at Va = 0)
  s+=S.w('M300 115V160',shorted?'live':'')+S.w('M420 115V160',shorted?'live':'');
  s+=shorted?S.w('M300 160H420','live'):`<path d="M300 160L352 146" stroke="var(--fg)" stroke-width="2"/>`+S.w('M372 160H420','')+S.dot(372,160);
  s+=S.dot(300,160)+tx(360,176,'S (short)',{c:'m'});
  if(src!=='2ph')s+=`<path d="M50 77V100M50 123V115" stroke="var(--live)" stroke-width="0"/>`+tx(250,92,src==='cap'?'1~ supply + C':'1~ supply',{c:'m'});
  else s+=tx(250,92,'2~ supply',{c:'m'});
  return s+'</svg>';
}

/* =====================================================================
   Torque–speed (rotor resistance) model — توضيح: Kloss-type curve, Tmax constant
   ===================================================================== */
const kloss=(w,sm)=>{const s=1-w;if(Math.abs(s)<1e-6)return 0;return 2/(s/sm+sm/s)};

/* =====================================================================
   Lesson 3.1
   ===================================================================== */
B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'44–46',
 title:'محرك التحكم للتيار المتردد ثنائي الوجه: التركيب وكيفية العمل',
 summary:'ما هي محركات التحكم (محركات الخدمة Servo-Motors)، وتركيب محرك التحكم الحثي ثنائي الوجه بملفيه المتعامدين، وكيف يتحكم جهد ملف التحكم في عزمه واتجاه دورانه.',
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
})())/*DCML-END*/,{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'أهداف الوحدة الثالثة: محركات التحكم',ref:'ص 44',
   q:'محرك صغير يحرّك ذراع روبوت أو قلم جهاز رسم بدقة… ما الذي يجب أن نعرفه عنه لنختاره ونفهمه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أهداف الوحدة الأربعة في أربع بطاقات مرقمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الهدف 1: أن يعرف المتدرب أنواع وتركيب محركات التحكم."><rect x="46" y="40" width="268" height="46" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="63" r="15" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="68" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">1</text><text x="160" y="68" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الأنواع والتركيب</text></g><g data-tip="الهدف 2: أن يعرف المتدرب كيفية عمل محركات التحكم."><rect x="46" y="100" width="268" height="46" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="123" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="128" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">2</text><text x="160" y="128" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">كيف تعمل</text></g><g data-tip="الهدف 3: أن يحدد المتدرب الشروط الواجب توافرها في محركات التحكم."><rect x="46" y="160" width="268" height="46" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="183" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="188" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">3</text><text x="160" y="188" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الشروط الواجب توافرها</text></g><g data-tip="الهدف 4: أن يعدد المتدرب خواص محركات التحكم واستخداماتها."><rect x="46" y="220" width="268" height="46" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="243" r="15" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="248" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">4</text><text x="160" y="248" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الخواص والاستخدامات</text></g><text x="180" y="298" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">أربعة أهداف لهذه الوحدة</text></svg>`,
   cap:'الأهداف التفصيلية الأربعة للوحدة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ الهدف كاملاً.</b>',
   side:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة أنواع وتركيب وخواص وكيفية عمل محركات التحكم.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يعرف المتدرب أنواع وتركيب محركات التحكم.</li><li>أن يعرف المتدرب كيفية عمل محركات التحكم.</li><li>أن يحدد المتدرب الشروط الواجب توافرها في محركات التحكم.</li><li>أن يعدد المتدرب خواص محركات التحكم واستخداماتها.</li></ol>`,ref:'ص 44'}
   ],
   body:[
    {tip:String.raw`<p>الوحدة كلها عن محركات صغيرة <b>تُطيع الأوامر بسرعة</b>. نبدأ بمحرك التحكم للتيار المتردد: تركيبه وكيف يعمل (هذا الدرس)، ثم خواصه (الدرس الثاني)، ثم نوع خاص منه اسمه «الكأس المجرور» (الدرس الثالث)، ثم مصطلحات وحسابات سرعة الاستجابة (الدرس الرابع)، ثم محركات التحكم للتيار المستمر (الدرس الخامس)، وأخيراً أسئلة الوحدة.</p>`,title:'خريطة الوحدة'},
    {predict:{q:'كم نوعاً رئيسياً من محركات التحكم ستدرس في هذه الوحدة؟',opts:[
     ['نوع واحد فقط: محرك التحكم الحثي',false,'الحثي ثنائي الوجه هو أشهر محركات التحكم للتيار المتردد، لكن الوحدة تدرس أيضاً محركات التحكم للتيار المستمر.'],
     ['نوعان: محركات تحكم للتيار المتردد ومحركات تحكم للتيار المستمر',true,'هذا ما يقوله الكتاب ص 45 في المحطة التالية: «يوجد نوعان من محركات التحكم».'],
     ['ثلاثة أنواع: متردد ومستمر وخطوي',false,'محرك الخطوة لا يُذكر في هذه الوحدة؛ الكتاب يذكر نوعين فقط.']]}},
    {title:'تحقق سريع: ماذا تقول أهداف الوحدة؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اضغط «صح» أو «خطأ» لكل عبارة.',items:[
 ['الوحدة تدرس أنواع محركات التحكم وتركيبها وكيفية عملها وخواصها واستخداماتها.',true,'هذا هو الهدف العام مع الأهداف التفصيلية الأربعة (ص 44).'],
 ['محركات التحكم في هذه الوحدة نوع واحد فقط هو المحرك الحثي.',false,'يوجد نوعان: محركات تحكم للتيار المتردد ومحركات تحكم للتيار المستمر (ص 45).'],
 ['من الأهداف أن يحدد المتدرب الشروط الواجب توافرها في محركات التحكم.',true,'هذا الهدف الثالث (ص 44)، وأهم هذه الشروط سرعة الاستجابة كما في المحطة التالية.']]})}
   ]},

  {st:2,short:'ما محرك التحكم؟',title:'محركات التحكم (محركات الخدمة)',ref:'ص 45',
   q:'لماذا لا نستعمل أي محرك عادي في نظام تحكم؟ ما الذي يجعل محرك التحكم مختلفاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حلقة تحكم ذات تغذية عكسية: المطلوب، المقارنة، محرك التحكم، الحمل، القياس" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="155" r="140" fill="#DDEFE6"/><text x="262" y="26" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">المطلوب</text><path d="M262 32V44" stroke="#2C4A40" stroke-width="3"/><polygon points="262,50 256,40 268,40" fill="#2C4A40"/><g data-tip="المقارنة: يُطرح ما تم قياسه فعلاً من المطلوب، والفرق هو الذي يُعطى للمحرك جهداً يصحح الخطأ."><circle cx="262" cy="68" r="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M250 56L274 80M274 56L250 80" stroke="#2C4A40" stroke-width="2"/><text x="278" y="50" font-size="13" fill="#2C4A40" font-weight="700">+</text><text x="276" y="100" font-size="15" fill="#2C4A40" font-weight="700">−</text></g><g data-tip="الفرق بين المطلوب والمقاس يصير جهداً على محرك التحكم: كلما كبر الفرق كبر الجهد."><path d="M245 68H168" stroke="#E8735A" stroke-width="4"/><polygon points="160,68 172,61 172,75" fill="#E8735A"/><text x="206" y="58" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الفرق</text></g><g data-tip="محرك التحكم: يتلقى جهد الفرق فيغيّر سرعته فوراً. لذلك يجب أن تكون استجابته سريعة لأي تغيير في الجهد."><rect x="36" y="44" width="124" height="48" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="98" y="74" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">محرك التحكم</text></g><path d="M98 92V164" stroke="#2C4A40" stroke-width="6"/><g data-tip="الحمل: ما يحرّكه المحرك، مثل ذراع أو طاولة ماكينة قطع أو مؤشر جهاز تسجيل."><rect x="36" y="166" width="124" height="48" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="98" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الحمل</text></g><path d="M160 190H198" stroke="#2C4A40" stroke-width="3"/><polygon points="206,190 194,183 194,197" fill="#2C4A40"/><g data-tip="القياس: حساس يقيس الموضع أو السرعة الفعلية ويعيدها إلى المقارنة. هذه العودة هي «التغذية العكسية»."><rect x="208" y="166" width="108" height="48" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="262" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">القياس</text></g><g data-tip="التغذية العكسية: ما حدث فعلاً يعود إلى المقارنة، فيصحح النظام نفسه باستمرار."><path d="M262 166V94" stroke="#2C4A40" stroke-width="3" stroke-dasharray="7 5"/><polygon points="262,86 255,98 269,98" fill="#2C4A40"/></g><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">يقيس، يقارن، يصحّح… باستمرار</text><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40">نظام تحكم ذو تغذية عكسية</text></svg>`,
   cap:'محرك التحكم جزء من حلقة: كل تغيير في الفرق يصل إليه جهداً، فيجب أن يستجيب بسرعة.<br><b>مرّر المؤشر على أجزاء الحلقة (أو المسها في الجوال) لتعرف دور كل جزء.</b>',
   side:[
    {book:String.raw`<p>تسمى محركات التحكم أحياناً <b>محركات الخدمة (<span class="ltr">Servo-Motors</span>)</b>، وتعمل في أنظمة التحكم ذات التغذية العكسية، تصمم هذه المحركات بحيث تكون <b>استجابتها سريعة</b>، من حيث التغيير في السرعة لأي تغيير في الجهد.</p>
     <p>ويمكن تحقيق ذلك ببناء العضو الدوار من <b>مواد خفيفة وصغيرة القطر</b>، مما يجعل المحرك ذا <b>قصور ذاتي صغير</b> وذا استجابة سريعة للتغيير في السرعة.</p>`,ref:'ص 45'}
   ],
   body:[
    {tip:String.raw`<p>«نظام تحكم ذو تغذية عكسية» يعني أن النظام يقيس ما حدث فعلاً (مثلاً موضع ذراع أو سرعته) ويقارنه بالمطلوب، ثم يعطي المحرك جهداً يصحح الفرق. لذلك نحتاج محركاً يستجيب بسرعة لكل تغيير في الجهد، ومفتاح ذلك <b>دوار خفيف صغير القطر</b> (قصور ذاتي صغير).</p>`,title:'ما معنى التغذية العكسية؟'},
    {book:String.raw`<p>وهذه المحركات يكون قطرها صغيراً وطويلة نسبياً، وقدرة هذه المحركات تتراوح من أجزاء حصان القدرة إلى عدة مئات من حصان القدرة.</p>
     <p><b>استخداماتها:</b> مسجلات التوازن، وأنظمة التوجيه، وأجهزة التحكم عن بعد، والحاسبات، وماكينات القطع.</p>
     <p>يوجد نوعان من محركات التحكم، وهما <b>محركات التحكم للتيار المتردد</b>، و<b>محركات التحكم للتيار المستمر</b>.</p>`,ref:'ص 45'},
    {add:String.raw`<p>في ماكينة القطع المبرمجة (<span class="ltr">CNC</span>) يحرّك محرك تحكم كل محور من محاور الطاولة: الحاسب يطلب موضعاً، وحساس على المحور يقيس الموضع الفعلي، والفرق يدير المحرك حتى يصل. ومثله توجيه الهوائيات (الأطباق) وأذرع الروبوت الصناعي.</p>`,title:'أين تراه؟'},
    {predict:{q:'لماذا يُبنى دوار محرك التحكم من مواد خفيفة وبقطر صغير؟',opts:[
     ['لكي تزيد قدرته إلى مئات الأحصنة',false,'القدرة لا تأتي من خفة الدوار؛ الكتاب يذكر الخفة لسبب آخر.'],
     ['لكي يكون رخيص الثمن',false,'الكتاب لا يذكر الثمن؛ السبب فني.'],
     ['ليكون قصوره الذاتي صغيراً فيستجيب بسرعة لأي تغيير في الجهد',true,'الدوار الخفيف الصغير القطر يسهل تسريعه وإبطاؤه، وهذا ما يحتاجه نظام التحكم (ص 45).']]}},
    {title:'مختبر مصغّر: هل يناسب محرك التحكم؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل صفة اضغط: هل يريدها المصمم في محرك التحكم أم لا؟',cats:['يناسب محرك التحكم','لا يناسبه'],items:[
 ['دوار من مواد خفيفة وصغير القطر',0,'«ببناء العضو الدوار من مواد خفيفة وصغيرة القطر» يصير القصور الذاتي صغيراً (ص 45).'],
 ['قصور ذاتي كبير',1,'القصور الذاتي الكبير يبطئ تغيّر السرعة، والمطلوب «قصور ذاتي صغير» واستجابة سريعة (ص 45).'],
 ['تتغير السرعة بسرعة مع أي تغيير في الجهد',0,'«تصمم هذه المحركات بحيث تكون استجابتها سريعة، من حيث التغيير في السرعة لأي تغيير في الجهد» (ص 45).'],
 ['محرك قصير وقطره كبير',1,'الكتاب يقول العكس: «قطرها صغيراً وطويلة نسبياً» (ص 45).'],
 ['يعمل في نظام تحكم ذي تغذية عكسية',0,'«وتعمل في أنظمة التحكم ذات التغذية العكسية» (ص 45).']]})}
   ]},

  {st:3,short:'محرك التحكم المتردد',title:'٣-١ محركات التحكم للتيار المتردد',ref:'ص 45',
   q:'محرك حثي… لكن بملفين فقط على العضو الثابت ودوار نحيف. كيف يبدو من الداخل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع في محرك التحكم ثنائي الوجه: ملف التحكم رأسي وملف الجهد الثابت أفقي بينهما تسعون درجة، ودوار قفص صغير القطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#E6E2F8"/><circle data-tip="قلب العضو الثابت: رقائق حديد تحمل الملفين." cx="180" cy="150" r="120" fill="#2C4A40"/><circle data-tip="الثغرة الهوائية بين العضو الثابت والعضو الدوار." cx="180" cy="150" r="96" fill="#FBF6EE"/><g fill="#2C4A40"><rect x="164" y="32" width="32" height="48" transform="rotate(0 180 150)"/><rect x="164" y="32" width="32" height="48" transform="rotate(90 180 150)"/><rect x="164" y="32" width="32" height="48" transform="rotate(180 180 150)"/><rect x="164" y="32" width="32" height="48" transform="rotate(270 180 150)"/></g><g data-tip="ملف التحكم ⟦a⟧ (control winding): يُغذّى بجهد متغير ⟦Va⟧ يتحكم فيه النظام."><rect x="150" y="56" width="60" height="20" rx="6" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2" transform="rotate(0 180 150)"/><rect x="150" y="56" width="60" height="20" rx="6" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2" transform="rotate(180 180 150)"/></g><g data-tip="ملف الجهد الثابت ⟦m⟧ (constant voltage winding): يُغذّى بجهد ثابت القيمة والتردد."><rect x="150" y="56" width="60" height="20" rx="6" fill="#E8735A" stroke="#FBF6EE" stroke-width="2" transform="rotate(90 180 150)"/><rect x="150" y="56" width="60" height="20" rx="6" fill="#E8735A" stroke="#FBF6EE" stroke-width="2" transform="rotate(270 180 150)"/></g><text x="180" y="22" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">a</text><text x="336" y="155" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">m</text><g data-tip="العضو الدوار: قفص سنجابي صغير القطر لتصغير القصور الذاتي، ومقاومة قضبانه كبيرة نسبياً."><circle cx="180" cy="150" r="62" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><g fill="#E9B949" stroke="#B9852A" stroke-width="1.5"><circle cx="230" cy="150" r="6"/><circle cx="215.4" cy="185.4" r="6"/><circle cx="180" cy="200" r="6"/><circle cx="144.6" cy="185.4" r="6"/><circle cx="130" cy="150" r="6"/><circle cx="144.6" cy="114.6" r="6"/><circle cx="180" cy="100" r="6"/><circle cx="215.4" cy="114.6" r="6"/></g></g><g data-tip="الزاوية بين محوري الملفين في الفراغ: تسعون درجة (الملفان متعامدان)."><path d="M180 150V112M180 150H218" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 3"/><path d="M180 124A26 26 0 0 1 206 150" fill="none" stroke="#E8735A" stroke-width="3"/><text x="203" y="133" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr">90°</text></g><circle cx="180" cy="150" r="8" fill="#2C4A40"/><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ملفان متعامدان ودوار قفص نحيف</text></svg>`,
   cap:'الفيروزي = ملف التحكم <span class="ltr">a</span>، والبرتقالي = ملف الجهد الثابت <span class="ltr">m</span>، وهي فكرة الشكل (٣-١) ص 46.<br><b>مرّر المؤشر على الملفات والدوار والزاوية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يصمم محرك التحكم عند القدرات الصغيرة نسبياً، ولكن من عيوب هذه المحركات أن <b>منحنى السرعة والعزم غير خطي</b>.</p>`,ref:'ص 45'},
    {predict:{q:'لماذا يكون دوار محرك التحكم المتردد صغير القطر عادةً؟',opts:[
     ['للحرص على تصغير القصور الذاتي ليكون سريع الاستجابة',true,'هذا نص الكتاب ص 45: «يكون عادة صغير القطر، للحرص على تصغير القصور الذاتي للمحرك، لكي يكون سريع الاستجابة».'],
     ['ليتسع العضو الثابت لملفات أكثر',false,'العضو الثابت فيه ملفان فقط؛ صغر القطر لأجل الدوار نفسه.'],
     ['لأن القفص السنجابي لا يُصنع بأقطار كبيرة',false,'القفص السنجابي يُصنع بكل الأقطار في المحركات الحثية العادية.']]}}
   ],
   body:[
    {book:String.raw`<p>معظم محركات التحكم للتيار المتردد التي تستعمل في وسائل التحكم عبارة عن <b>محرك حثي ثنائي الوجه</b> ذي ملفين على العضو الثابت، بينهما زاوية <b>تسعون درجة في الفراغ</b>، العضو الدوار عليه ملفات <b>القفص السنجابي</b>، ويكون عادة صغير القطر، للحرص على تصغير القصور الذاتي للمحرك، لكي يكون سريع الاستجابة.</p>
     <p>كما يجب أن تكون المقاومة المادية للقفص السنجابي <b>كبيرة نسبياً</b>، حتى يمكننا بقدر المستطاع الحصول على علاقة خطية بين العزم والسرعة، ابتداء من اللاحمل وحتى أقصى حمل للمحرك (حيث يتوقف المحرك).</p>`,ref:'ص 45'},
    {tip:String.raw`<p>المحرك الحثي العادي منحناه «غير خطي»، وهذا عيب في التحكم. العلاج الذي يذكره الكتاب: <b>قضبان دوار ذات مقاومة كبيرة</b>، فيقترب المنحنى من خط مستقيم. سترى ذلك بالرسم في الدرس التالي (الشكل (٣-٢)).</p>`,title:'لماذا مقاومة كبيرة؟'},
    {watch:String.raw`<p>«تسعون درجة <b>في الفراغ</b>» تعني مكان الملفين على العضو الثابت (متعامدان). وفي المحطة التالية ستجد «تسعون درجة» أخرى، لكنها <b>فرق زمني</b> بين تياري الملفين. الشرطان مطلوبان معاً.</p>`},
    {title:'مختبر مصغّر: ماذا لو غيّرنا التصميم؟',widget:(el,B)=>DCML.cases(el,B,{intro:'موقفان: اختر ما يحدث، ثم اقرأ السبب.',cases:[
 {q:'ماذا لو وضعنا الملفين في المكان نفسه على العضو الثابت، بدل أن يكون بينهما تسعون درجة في الفراغ؟',opts:[
  ['يزيد العزم لأن كل ملف يساعد الآخر',false,'المجالان على خط واحد يصيران مجالاً واحداً نابضاً على هذا الخط، لا يدور.'],
  ['لا يتكون مجال دوار، فلا شيء يسحب الدوار في اتجاه معين',true,'لذلك يشترط الكتاب «زاوية تسعون درجة في الفراغ» بين الملفين (ص 45)، ومعها فرق زمني بين التيارين (المحطة التالية).'],
  ['لا يتغير شيء',false,'مكان الملفين أساسي لتكوين المجال الدوار.']]},
 {q:'ماذا لو صنعنا القفص السنجابي بمقاومة صغيرة كما في المحرك الحثي العادي؟',opts:[
  ['تصبح العلاقة بين العزم والسرعة خطية تماماً',false,'العكس: الخطية تأتي من المقاومة الكبيرة.'],
  ['يبقى منحنى العزم والسرعة غير خطي، وهذا عيب في التحكم',true,'الكتاب يطلب أن تكون مقاومة القفص «كبيرة نسبياً، حتى يمكننا بقدر المستطاع الحصول على علاقة خطية بين العزم والسرعة» (ص 45).'],
  ['لا يدور المحرك أبداً',false,'المحرك يدور، لكن منحناه غير خطي كالمحرك الحثي العادي.']]}]})}
   ]},

  {st:4,short:'كيف يعمل؟',title:'٣-١-١ كيفية عمل المحرك',ref:'ص 45–46',
   q:'ملف بجهد ثابت وملف بجهد نتحكم فيه… كيف يصير هذا الجهد المتغير عزماً واتجاه دوران؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="توصيل المحرك من مصدر أحادي الوجه: مكثف على التوالي مع ملف الجهد الثابت، ومصدر جهد متغير على ملف التحكم، ومفتاح لقصر ملف التحكم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"><path d="M64 70V42H136M152 42H204M304 42H330V120H64V106"/><path d="M64 196V176H204M304 176H330V256H64V234"/><path d="M204 176V216H232M276 216H304V176"/></g><g data-tip="مصدر جهد متردد أحادي الوجه، ثابت القيمة والتردد (يُستعمل عند تعذر الحصول على مصدر ثنائي الوجه)."><circle cx="64" cy="88" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M54 88q5 -10 10 0t10 0" fill="none" stroke="#2C4A40" stroke-width="2.2"/></g><g data-tip="المكثف ⟦C⟧: يوصل بصفة دائمة على التوالي مع ملف الجهد الثابت، فيصنع فارقاً زمنياً تسعين درجة بين تياري الملفين."><rect x="130" y="24" width="28" height="36" fill="transparent"/><path d="M138 26V58M150 26V58" stroke="#2C4A40" stroke-width="4"/><text x="144" y="80" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">C</text></g><g data-tip="ملف الجهد الثابت ⟦m⟧: جهده ثابت في كل الحالات."><path d="M204 42a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0" fill="none" stroke="#E8735A" stroke-width="5"/><text x="254" y="76" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">m</text></g><g data-tip="مصدر جهد متغير ⟦Va⟧ يتحكم فيه النظام (السهم المائل = قابل للتغيير). العزم يتناسب طردياً مع هذا الجهد."><circle cx="64" cy="215" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M54 215q5 -10 10 0t10 0" fill="none" stroke="#2C4A40" stroke-width="2.2"/><path d="M46 236L80 196" stroke="#4FB3A9" stroke-width="3"/><polygon points="84,191 72,196 80,204" fill="#4FB3A9"/><text x="22" y="220" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Va</text></g><g data-tip="ملف التحكم ⟦a⟧: جهده متغير، ومنه نتحكم في العزم واتجاه الدوران."><path d="M204 176a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0a12.5 12.5 0 0 1 25 0" fill="none" stroke="#4FB3A9" stroke-width="5"/><text x="254" y="158" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">a</text></g><g data-tip="المفتاح ⟦S⟧: يقصر ملف التحكم عندما يكون الجهد عليه صفراً، لمنع المحرك من بدء الحركة كمحرك ذي وجه واحد إذا تلقى دفعة خارجية."><rect x="226" y="196" width="56" height="30" fill="transparent"/><circle cx="232" cy="216" r="4" fill="#2C4A40"/><circle cx="276" cy="216" r="4" fill="#2C4A40"/><path d="M232 216L270 200" stroke="#2C4A40" stroke-width="3"/><text x="254" y="242" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ملف جهد ثابت مع مكثف، وملف تحكم بجهد متغير</text></svg>`,
   cap:'التوصيل عند التغذية من مصدر أحادي الوجه (رسم توضيحي؛ الشكل (٣-١) في الكتاب لا يبين المصدر ولا المكثف).<br><b>مرّر المؤشر على المصدرين والمكثف والملفين والمفتاح (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>يعمل المحرك بتسليط مصدر جهد <b>ثابت القيمة والتردد</b> على أحد ملفات العضو الثابت، ويسمى بملف الجهد الثابت (<span class="ltr">constant voltage winding</span>)، وجهد <b>متغير يمكن التحكم فيه</b> على الملف الآخر، ويسمى بملف التحكم (<span class="ltr">control winding</span>).</p>`,ref:'ص 45'}
   ],
   body:[
    {book:String.raw`<ul><li>يمكن تشغيل المحرك من مصدر ثنائي الوجه، أو من مصدر أحادي الوجه (في حالة تعذر الحصول على مصدر ثنائي الوجه)، في الحالة الأخيرة يكون من الضروري استخدام <b>مكثف</b> يوصل بصفة دائمة على التوالي مع ملف الجهد الثابت، وذلك للحصول على فارق زمني مقداره <b>تسعون درجة</b> بين تياري ملفات العضو الثابت.</li>
     <li>في كلتا الحالتين يظل الجهد ثابتاً على ملف الجهد الثابت.</li>
     <li>عندما يكون الجهد على ملف التحكم صفراً، بينما تتم تغذية ملف الجهد الثابت، فإنه يلزم <b>قصر ملف التحكم</b>، لمنع المحرك من بدء الحركة كمحرك ذي وجه واحد في حالة تلقيه دفعة خارجية.</li>
     <li>وعند تغيير الجهد على ملفات التحكم بينما يكون الجهد ثابتاً على ملفات الجهد الثابت فإن العزم الناتج عن المحرك يتناسب تناسباً طردياً مع جهد ملفات التحكم كما في المعادلة (٣-١):</li></ul>
     <div class="eq">$$T \;\alpha\; V_a$$<span class="eqno">(٣-١)</span></div>`,ref:'ص 46'},
    {tip:String.raw`<p><span class="ltr">\(T\)</span> هو العزم، و <span class="ltr">\(V_a\)</span> جهد ملف التحكم. والرمز <span class="ltr">\(\alpha\)</span> في المعادلة (٣-١) مطبوع بمعنى «يتناسب مع»، أي <span class="ltr">\(T \propto V_a\)</span>: إذا ضاعفنا جهد ملف التحكم تضاعف العزم، وإذا جعلناه نصفاً صار العزم نصفاً.</p>`,title:'اقرأ المعادلة (٣-١)'},
    {title:'لماذا يلزم فرق تسعين درجة؟',widget:(el,B)=>{
      let sh=90,k=1,d=1,phi=0;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">غيّر الفرق الزمني بين التيارين وجهد ملف التحكم، وراقب السهم الأخضر (المجال المحصّل للملفين).</p>
       <div class="w-row" style="margin-top:0">${segHTML('sh',[[90,'فرق زمني 90°'],[0,'بلا فرق (0°)']],sh)}${segHTML('k',[[1,'جهد التحكم كامل'],[0.5,'نصف الجهد'],[0,'صفر']],k)}<button class="btn" type="button" data-rv aria-pressed="false">عكس جهد ملف التحكم 180°</button></div>
       <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;align-items:center;margin-top:8px"><div class="svgbox" style="max-width:250px;margin-inline:auto">${acServoSVG('u3s1')}</div><p class="sub" data-o style="margin:0"></p></div>
       <p class="sub" style="margin-top:6px">رسم توضيحي: الأزرق ملف التحكم <span class="ltr">a</span> والبرتقالي ملف الجهد الثابت <span class="ltr">m</span>، والخط المتقطع هو المسار الذي يرسمه طرف السهم. الدوار مثبت هنا لنرى المجال وحده.</p>`;
      const out=el.querySelector('[data-o]'),rv=el.querySelector('[data-rv]');
      const upd=()=>{segSet(el,'sh',sh);segSet(el,'k',k);rv.setAttribute('aria-pressed',d<0?'true':'false');
        const dir=d>0?'مع عقارب الساعة':'عكس عقارب الساعة';
        out.innerHTML=k===0?'<b>مجال نابض لا يدور:</b> ملف الجهد الثابت وحده يعمل، فلا يوجد عزم بدء. لكن لو دُفع الدوار فقد يستمر في الدوران كمحرك ذي وجه واحد؛ لذلك يُقصر ملف التحكم في هذه الحالة.'
         :sh===0?'<b>مجال نابض لا يدور:</b> التياران في الطور نفسه، فالسهم يكبر ويصغر على خط واحد، ولا شيء يسحب الدوار في اتجاه معين.'
         :k===1?`<b>مجال دوار منتظم</b> يدور ${dir}: طرف السهم يرسم دائرة، فيسحب الدوار معه.`
         :`<b>مجال دوار أضعف</b> يدور ${dir}: المسار صار بيضاوياً، والعزم أقل؛ العزم يتناسب طردياً مع جهد ملف التحكم.`};
      el.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{sh=+b.dataset.sh;upd()});
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;upd()});
      rv.onclick=()=>{d=-d;upd()};upd();
      loopOn(el,dt=>{phi+=dt*2*Math.PI*0.45;const f=fieldPaths(sh===90?'2ph':'1ph',k,d,phi,160,74);
        q(el,'#u3s1-B').setAttribute('d',f.B);q(el,'#u3s1-Bh').setAttribute('d',f.H);q(el,'#u3s1-tr').setAttribute('d',f.T);
        [0,2].forEach(i=>q(el,'#u3s1-c'+i).setAttribute('opacity',(0.15+0.75*Math.abs(f.ia)).toFixed(2)));[1,3].forEach(i=>q(el,'#u3s1-c'+i).setAttribute('opacity',(0.15+0.75*Math.abs(f.im)).toFixed(2)))});
    }},
    {predict:{q:'جهد ملف التحكم صفر، وملف الجهد الثابت متصل بالمصدر، وملف التحكم مفتوح (غير مقصور). دفع أحدهم الدوار بيده. ماذا يحدث؟',opts:[
     ['يتوقف الدوار فوراً لأن جهد التحكم صفر',false,'بدون قصر ملف التحكم لا يوجد ما يمنع الدوران؛ لهذا يطلب الكتاب القصر.'],
     ['يدور في الاتجاه المعاكس',false,'لا يوجد ما يعكس الاتجاه؛ الخطر هو أن يستمر في اتجاه الدفعة.'],
     ['قد يستمر في الدوران كمحرك ذي وجه واحد',true,'هذا ما يحذّر منه الكتاب ص 46، ولذلك يلزم قصر ملف التحكم عندما يكون جهده صفراً.']]}},
    {tip:String.raw`<p>اتجاه دوران المجال يحدده أي التيارين متقدم على الآخر. إذا عكسنا جهد ملف التحكم <span class="ltr">180°</span> صار تياره متأخراً بدل متقدم، فيدور المجال، ومعه الدوار، في <b>الاتجاه المعاكس</b>. هكذا يعكس نظام التحكم حركة المحرك (وسيستعمل الكتاب ذلك في تعريف «زمن عكس الحركة» ص 49).</p>`,title:'وكيف نعكس الاتجاه؟'},
    {watch:String.raw`<p>لا تخلط بين <span class="ltr">\(\alpha\)</span> في المعادلة (٣-١) (بمعنى «يتناسب مع») وبين <span class="ltr">\(\alpha\)</span> «التسارع» الذي سيأتي في المعادلة (٣-٣) ص 49.</p>`}
   ]},

  {recap:[
   String.raw`محركات التحكم (محركات الخدمة) تعمل في أنظمة التحكم ذات التغذية العكسية، ودوارها خفيف صغير القطر ليكون قصورها الذاتي صغيراً واستجابتها سريعة (ص 45).`,
   String.raw`محرك التحكم المتردد محرك حثي ثنائي الوجه: ملفان على العضو الثابت بينهما تسعون درجة في الفراغ، ودوار قفص سنجابي صغير القطر مقاومته كبيرة نسبياً (ص 45).`,
   String.raw`ملف الجهد الثابت جهده ثابت دائماً، ومع المصدر أحادي الوجه يوصل معه مكثف على التوالي ليصنع فارقاً زمنياً تسعين درجة بين التيارين (ص 46).`,
   String.raw`عندما يكون جهد ملف التحكم صفراً يُقصر ملف التحكم حتى لا يدور المحرك كمحرك ذي وجه واحد (ص 46).`,
   String.raw`العزم يتناسب طردياً مع جهد ملف التحكم، المعادلة (٣-١): <span class="ltr">\(T \propto V_a\)</span>`]}
],
 theory:[
  {h:'أهداف الوحدة الثالثة',ref:'ص 44',html:`<p><b>الهدف العام للوحدة:</b> «معرفة أنواع وتركيب وخواص وكيفية عمل محركات التحكم.»</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يعرف المتدرب أنواع وتركيب محركات التحكم.</li><li>أن يعرف المتدرب كيفية عمل محركات التحكم.</li><li>أن يحدد المتدرب الشروط الواجب توافرها في محركات التحكم.</li><li>أن يعدد المتدرب خواص محركات التحكم واستخداماتها.</li></ol>`},
  {h:'محركات التحكم',ref:'ص 45',html:`<p>«تسمى محركات التحكم أحياناً محركات الخدمة (<span class="ltr">Servo-Motors</span>)، وتعمل في أنظمة التحكم ذات التغذية العكسية، تصمم هذه المحركات بحيث تكون استجابتها سريعة، من حيث التغيير في السرعة لأي تغيير في الجهد.»</p>
   <p>«ويمكن تحقيق ذلك ببناء العضو الدوار من مواد خفيفة وصغيرة القطر، مما يجعل المحرك ذا قصور ذاتي صغير وذا استجابة سريعة للتغيير في السرعة.»</p>
   <p>«وهذه المحركات يكون قطرها صغيراً وطويلة نسبياً، وقدرة هذه المحركات تتراوح من أجزاء حصان القدرة إلى عدة مئات من حصان القدرة.»</p>
   <p><b>استخداماتها:</b> مسجلات التوازن، وأنظمة التوجيه، وأجهزة التحكم عن بعد، والحاسبات، وماكينات القطع.</p>
   <p>«يوجد نوعان من محركات التحكم، وهما محركات التحكم للتيار المتردد، ومحركات التحكم للتيار المستمر.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «نظام تحكم ذو تغذية عكسية» يعني أن النظام يقيس ما حدث فعلاً (مثلاً موضع ذراع أو سرعته) ويقارنه بالمطلوب، ثم يعطي المحرك جهداً يصحح الفرق. لذلك نحتاج محركاً يستجيب بسرعة لكل تغيير في الجهد، ومفتاح ذلك <b>دوار خفيف صغير القطر</b> (قصور ذاتي صغير).'},
  {h:'٣-١ محركات التحكم للتيار المتردد A.C Servo-Motors',ref:'ص 45',html:`<p>«يصمم محرك التحكم عند القدرات الصغيرة نسبياً، ولكن من عيوب هذه المحركات أن منحنى السرعة والعزم غير خطي.»</p>
   <p>«معظم محركات التحكم للتيار المتردد التي تستعمل في وسائل التحكم عبارة عن <b>محرك حثي ثنائي الوجه</b> ذي ملفين على العضو الثابت، بينهما زاوية <b>تسعون درجة في الفراغ</b>، العضو الدوار عليه ملفات <b>القفص السنجابي</b>، ويكون عادة صغير القطر، للحرص على تصغير القصور الذاتي للمحرك، لكي يكون سريع الاستجابة.»</p>
   <p>«كما يجب أن تكون المقاومة المادية للقفص السنجابي <b>كبيرة نسبياً</b>، حتى يمكننا بقدر المستطاع الحصول على علاقة خطية بين العزم والسرعة، ابتداء من اللاحمل وحتى أقصى حمل للمحرك (حيث يتوقف المحرك).» (سنرى ذلك في الدرس التالي.)</p>`},
  {h:'٣-١-١ كيفية عمل المحرك',ref:'ص 45–46',html:`<p>«يعمل المحرك بتسليط مصدر جهد ثابت القيمة والتردد على أحد ملفات العضو الثابت، ويسمى بملف الجهد الثابت (<span class="ltr">constant voltage winding</span>)، وجهد متغير يمكن التحكم فيه على الملف الآخر، ويسمى بملف التحكم (<span class="ltr">control winding</span>).» الشكل (٣-١) يوضح التركيب.</p>`},
  {fig:'(٣-١)',ref:'ص 46',caption:'محركات التحكم للتيار المتردد — ملف التحكم (a) وملف الجهد الثابت (m) على العضو الثابت، والدوار قفص سنجابي (إعادة رسم)',draw:()=>box(fig31SVG(),560)},
  {html:`<ul><li>«يمكن تشغيل المحرك من مصدر ثنائي الوجه، أو من مصدر أحادي الوجه (في حالة تعذر الحصول على مصدر ثنائي الوجه)، في الحالة الأخيرة يكون من الضروري استخدام <b>مكثف</b> يوصل بصفة دائمة على التوالي مع ملف الجهد الثابت، وذلك للحصول على فارق زمني مقداره <b>تسعون درجة</b> بين تياري ملفات العضو الثابت.»</li>
   <li>«في كلتا الحالتين يظل الجهد ثابتاً على ملف الجهد الثابت.»</li>
   <li>«عندما يكون الجهد على ملف التحكم صفراً، بينما تتم تغذية ملف الجهد الثابت، فإنه يلزم <b>قصر ملف التحكم</b>، لمنع المحرك من بدء الحركة كمحرك ذي وجه واحد في حالة تلقيه دفعة خارجية.»</li>
   <li>«وعند تغيير الجهد على ملفات التحكم بينما يكون الجهد ثابتاً على ملفات الجهد الثابت فإن العزم الناتج عن المحرك يتناسب تناسباً طردياً مع جهد ملفات التحكم كما في المعادلة (٣-١):»</li></ul>
   <div dir="ltr" style="direction:ltr">$$T \\;\\alpha\\; V_a \\qquad \\text{(٣-١)}$$</div>
   <p>حيث <span class="ltr">\\(T\\)</span> العزم، و <span class="ltr">\\(V_a\\)</span> جهد ملف التحكم.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الرمز <span class="ltr">\\(\\alpha\\)</span> في المعادلة (٣-١) مطبوع بمعنى «يتناسب مع»، أي <span class="ltr">\\(T \\propto V_a\\)</span>: إذا ضاعفنا جهد ملف التحكم تضاعف العزم. لا تخلط بينه وبين <span class="ltr">\\(\\alpha\\)</span> «التسارع» الذي سيأتي في المعادلة (٣-٣) ص 49.'},
  {h:'لماذا يلزم فرق تسعين درجة؟',html:'<p>الكتاب يشترط أن يكون الملفان متعامدين في الفراغ (90°) وأن يكون بين تياريهما فرق زمني 90° (بالمصدر ثنائي الوجه أو بالمكثف). جرّب في الرسم التالي:</p>'},
  {widget:(el)=>{let sh=90,k=1,phi=0;
    el.innerHTML=`<div class="fig"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${segHTML('sh',[[90,'فرق زمني 90° بين التيارين'],[0,'التياران في الطور نفسه (0°)']],sh)}${segHTML('k',[[1,'جهد التحكم كامل'],[0.5,'نصف الجهد']],k)}</div>
     <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:center"><div class="svgbox" style="max-width:280px;margin-inline:auto">${acServoSVG('u3w1')}</div><p class="sub" id="u3w1t"></p></div>
     <p class="sub">الرسم توضيحي (ليس من الكتاب): السهم الأخضر هو المجال المغناطيسي المحصّل للملفين، والخط المتقطع هو المسار الذي يرسمه طرف السهم. الدوار مثبت هنا لنرى المجال وحده.</p></div>`;
    const upd=()=>{segSet(el,'sh',sh);segSet(el,'k',k);q(el,'#u3w1t').innerHTML=sh===90?(k===1?'<b>مجال دوار منتظم:</b> طرف السهم يرسم دائرة. هذا المجال يسحب الدوار معه فيدور.':'<b>مجال دوار بيضاوي:</b> ما زال يدور لكنه أضعف في اتجاه ملف التحكم، فيقل العزم.'):'<b>مجال نابض لا يدور:</b> السهم يكبر ويصغر على خط واحد، فلا يوجد ما يسحب الدوار إلى اتجاه معين، ولا يبدأ المحرك الحركة.'};
    el.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{sh=+b.dataset.sh;upd()});el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;upd()});upd();
    loopOn(el,dt=>{phi+=dt*2*Math.PI*0.45;const f=fieldPaths(sh===90?'2ph':'1ph',k,1,phi,160,74);q(el,'#u3w1-B').setAttribute('d',f.B);q(el,'#u3w1-Bh').setAttribute('d',f.H);q(el,'#u3w1-tr').setAttribute('d',f.T);
      [0,2].forEach(i=>q(el,'#u3w1-c'+i).setAttribute('opacity',(0.15+0.75*Math.abs(f.ia)).toFixed(2)));[1,3].forEach(i=>q(el,'#u3w1-c'+i).setAttribute('opacity',(0.15+0.75*Math.abs(f.im)).toFixed(2)))})}},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اتجاه دوران المجال يحدده أي التيارين متقدم على الآخر. إذا عكسنا جهد ملف التحكم <b>180°</b> صار تياره متأخراً بدل متقدم، فيدور المجال — ومعه الدوار — في <b>الاتجاه المعاكس</b>. هذه هي الطريقة التي يعكس بها نظام التحكم حركة المحرك (وسيستعملها الكتاب في تعريف «زمن عكس الحركة» ص 49).'}
 ],
 lab:(el)=>{
  let src='2ph',k=0,d=1,shorted=false,w=0,th=0,phi=0,t=0,hist=[],ht=0,lastSig='';const flags={};
  el.innerHTML=`<div id="u3l1tp"></div><div class="grid">
   <div class="panel c12"><h2>مختبر المحرك ثنائي الوجه <small>مبني على الشكل (٣-١) ص 46 والمعادلة (٣-١)</small></h2>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">المصدر</div>${segHTML('src',[['2ph','ثنائي الوجه'],['cap','أحادي الوجه + مكثف'],['1ph','أحادي الوجه بدون مكثف']],src)}</div>
     ${slHTML('va','جهد ملف التحكم V<sub>a</sub>',0,100,5,0)}
     <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn" id="rev" aria-pressed="false">⇄ عكس جهد ملف التحكم 180°</button>${swHTML('sh','S','قصر ملف التحكم',0)}<button class="btn" id="push">✋ دفعة خارجية للدوار</button></div>
    </div>
    <div class="facts">${fact('المجال المغناطيسي','fState')}${fact('عزم البدء T ∝ V<sub>a</sub> (من العزم عند الجهد الكامل)','fT')}${fact('السرعة (من سرعة اللاحمل عند الجهد الكامل)','fW')}${fact('اتجاه الدوران','fD')}</div>
    <div id="msg"></div></div>
   <div class="panel c7"><h2>مقطع المحرك <small>السهم الأخضر = المجال المحصّل · النقطة الحمراء على الدوار لرؤية دورانه</small></h2>
    <div class="svgbox" style="max-width:340px;margin-inline:auto">${acServoSVG('u3l1')}</div>
    <div class="legend"><span><i style="background:var(--blue)"></i>ملف التحكم a (رأسي)</span><span><i style="background:var(--live)"></i>ملف الجهد الثابت m (أفقي)</span><span><i style="background:var(--on)"></i>المجال المحصّل</span></div></div>
   <div class="panel c5"><h2>التوصيل</h2><div class="svgbox" id="wir"></div>
    <h2 style="margin-top:12px">السرعة مع الزمن <small>آخر 10 ثوانٍ</small></h2><div class="svgbox" id="ch"></div></div>
   <div class="panel c12"><p class="sub"><b id="u3l1w">أرقام توضيحية</b>: السرعة والعزم معروضان كنسبة مئوية (الكتاب لا يعطي أرقاماً لهذا الدرس). أضفنا احتكاكاً صغيراً قدره <span class="ltr" id="u3l1fr"></span> % من عزم البدء عند الجهد الكامل، لذلك تستقر السرعة عند الجهد الكامل على <span class="ltr" id="u3l1ws"></span> % وليس 100 % تماماً. سرعة رسم المجال والدوار مبطأة كثيراً حتى تراها العين، والدوران كمحرك وجه واحد بعد الدفعة نموذج توضيحي لما ذكره الكتاب.</p>${tryBox('try')}</div>
  </div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'شغّل المحرك',x:'ارفع جهد ملف التحكم إلى 50 % أو أكثر. يتكون مجال دوار ويبدأ الدوار الدوران، وكلما زاد الجهد زاد العزم والسرعة.',done:()=>src!=='1ph'&&k>=0.5&&w>0.3},
   {t:'اعكس الاتجاه',x:'اضغط «عكس جهد ملف التحكم 180°»: يعكس المجال اتجاه دورانه فيتباطأ الدوار ثم يدور في الاتجاه المعاكس.',done:()=>flags.rev&&w<-0.2},
   {t:'خطر الوجه الواحد',x:'أنزل الجهد إلى 0 % واترك ملف التحكم مفتوحاً (بدون قصر)، ثم اضغط «دفعة خارجية»: يستمر الدوار في الدوران كمحرك ذي وجه واحد.',done:()=>k===0&&!shorted&&flags.pushed&&Math.abs(w)>0.3},
   {t:'قصر ملف التحكم',x:'شغّل مفتاح «قصر ملف التحكم» والجهد صفر: يتوقف الدوار، وإذا دفعته لا يستمر. هذا ما يطلبه الكتاب ص 46.',done:()=>flags.single&&shorted&&Math.abs(w)<0.02},
   {t:'بدون مكثف',x:'اختر «أحادي الوجه بدون مكثف» وارفع الجهد: التياران في الطور نفسه، فالمجال نابض لا يدور، والمحرك لا يبدأ الحركة وحده.',done:()=>src==='1ph'&&k>=0.5&&Math.abs(w)<0.02},
   {t:'أضف المكثف',x:'اختر «أحادي الوجه + مكثف»: المكثف على التوالي مع ملف الجهد الثابت يصنع فرق 90°، فيعود المجال دواراً ويدور المحرك.',done:()=>src==='cap'&&k>=0.3&&Math.abs(w)>0.2}]);
  const tpLbl=()=>{q(el,'#u3l1w').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية';q(el,'#u3l1fr').textContent=B.fmtN(TP.v.fr);q(el,'#u3l1ws').textContent=B.fmtN(Math.max(0,100-TP.v.fr))};
  const TP=B.params(q(el,'#u3l1tp'),'u3-l1',[
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.45,min:0.05,max:20,step:0.05},
   {k:'fr',label:'عزم الاحتكاك (نسبة من عزم البدء عند الجهد الكامل)',unit:'%',value:2,min:0,max:30,step:0.5}],tpLbl);
  tpLbl();
  const va=q(el,'#va'),shB=q(el,'#sh'),revB=q(el,'#rev');
  const sync=()=>{q(el,'#va-v').textContent=Math.round(k*100)+' %';segSet(el,'src',src);shB.setAttribute('aria-pressed',shorted?'true':'false');shB.disabled=k>0;shB.style.opacity=k>0?.45:1;revB.setAttribute('aria-pressed',d<0?'true':'false')};
  va.addEventListener('input',()=>{k=+va.value/100;if(k>0)shorted=false;sync()});
  el.querySelectorAll('[data-src]').forEach(b=>b.addEventListener('click',()=>{src=b.dataset.src;sync()}));
  revB.addEventListener('click',()=>{d=-d;flags.rev=1;sync()});
  shB.addEventListener('click',()=>{if(k>0)return;shorted=!shorted;sync()});
  q(el,'#push').addEventListener('click',()=>{flags.pushed=1;w+=(w<0?-0.4:0.4)});
  sync();
  const T1=x=>{const u=Math.abs(x);return Math.sign(x)*0.5*Math.min(1,u/0.06)*Math.max(0,1-u/0.6)};
  loopOn(el,dt=>{
   t+=dt;phi+=dt*2*Math.PI*0.5;
   /* القيم الفعلية (تختلف عن المضبوطة فقط بعطل مخفي): capopen المكثف تالف (مفتوح) فلا تيار في ملف الجهد الثابت، aopen ملف التحكم مقطوع، arev أطراف ملف التحكم معكوسة، shopen مفتاح القصر لا يلامس */
   const srcE=src==='cap'&&chF('capopen')?'1ph':src,kE=chF('aopen')?0:k,dE=chF('arev')?-d:d,shE=shorted&&!chF('shopen')&&!chF('aopen');
   const rotating=srcE!=='1ph'&&kE>0;let T;
   const tau=TP.v.tau,fr=TP.v.fr/100,ns=Math.max(1,Math.ceil(dt/(0.5*tau)-1e-9)),h=dt/ns;  // خطوات أصغر فقط عند ثابت زمن صغير جداً (للثبات)
   for(let i=0;i<ns;i++){
   if(rotating)T=kE*dE-w;else if(shE)T=-w;else T=T1(w);
   if(!rotating&&!shorted&&Math.abs(w)>0.3&&k===0)flags.single=1;
   let a=T-fr*Math.sign(w);if(Math.abs(w)<0.01&&Math.abs(T)<=fr){w=0;a=0}
   w+=a/tau*h}
   th+=w*dt*360*0.45;
   const f=fieldPaths(srcE,kE,dE,phi,160,74);
   q(el,'#u3l1-B').setAttribute('d',f.B);q(el,'#u3l1-Bh').setAttribute('d',f.H);q(el,'#u3l1-tr').setAttribute('d',f.T);
   q(el,'#u3l1-rot').setAttribute('transform',`rotate(${(th%360).toFixed(1)} 160 160)`);
   [0,2].forEach(i=>q(el,'#u3l1-c'+i).setAttribute('opacity',(0.12+0.75*Math.abs(f.ia)).toFixed(2)));[1,3].forEach(i=>q(el,'#u3l1-c'+i).setAttribute('opacity',(0.12+0.75*Math.abs(f.im)).toFixed(2)));
   ht+=dt;if(ht>0.08){ht=0;hist.push([t,w*100]);while(hist.length&&hist[0][0]<t-10)hist.shift();
     q(el,'#ch').innerHTML=plot({W:420,H:200,x:[t-10,t],y:[-110,110],yt:[-100,-50,0,50,100],xt:[],ax0:false,xl:'t →',yl:'speed %',lines:[{pts:hist,col:'--blue'}],aria:'السرعة مع الزمن'})}
   q(el,'#fState').textContent=rotating?(kE>=0.999?'دوار منتظم':'دوار (بيضاوي)'):(srcE==='1ph'?'نابض (لا يدور)':'وجه واحد فقط');
   q(el,'#fT').textContent=(rotating?Math.round(kE*100):0)+' %';q(el,'#fW').textContent=Math.round(Math.abs(w)*100)+' %';
   q(el,'#fD').textContent=Math.abs(w)<0.01?'متوقف':w>0?'⟳ مع عقارب الساعة':'⟲ عكس عقارب الساعة';
   const sg=[src,k,d,shorted,rotating,Math.abs(w)>0.05].join();
   if(sg!==lastSig){lastSig=sg;q(el,'#wir').innerHTML=wiringSVG(src,k,d,shorted);let m='';
     if(src==='1ph')m='<div class="callout err">التياران في الطور نفسه: لا يوجد فرق 90°، فالمجال <b>نابض</b> ولا يبدأ المحرك الحركة وحده. الكتاب يشترط مكثفاً على التوالي مع ملف الجهد الثابت عند التغذية من مصدر أحادي الوجه.</div>';
     else if(k===0&&!shorted)m=`<div class="callout err">جهد ملف التحكم صفر وملف التحكم <b>غير مقصور</b>: ${Math.abs(w)>0.05?'الدوار يستمر في الدوران كمحرك ذي وجه واحد — وهذا ما يمنعه الكتاب بقصر ملف التحكم.':'إذا تلقى الدوار دفعة خارجية فقد يبدأ الدوران كمحرك ذي وجه واحد (ص 46). جرّب زر «دفعة خارجية».'}</div>`;
     else if(k===0&&shorted)m='<div class="callout">ملف التحكم مقصور والجهد عليه صفر: لا يبدأ المحرك الحركة حتى لو دُفع الدوار، وهذا ما يطلبه الكتاب.</div>';
     q(el,'#msg').innerHTML=m}
   tl.check();
  });
 },
 quiz:[
  {q:'ما الاسم الآخر لمحركات التحكم حسب الكتاب؟',o:['محركات الخطوة','محركات الخدمة (Servo-Motors)','المحركات العامة','المولدات التاكو'],c:1,e:'ص 45: «تسمى محركات التحكم أحياناً محركات الخدمة (Servo-Motors)».'},
  {q:'لماذا يُبنى دوار محرك التحكم من مواد خفيفة وصغيرة القطر؟',o:['لزيادة القدرة','ليكون القصور الذاتي صغيراً والاستجابة سريعة','لتقليل الجهد','لزيادة عدد الأقطاب'],c:1,e:'ص 45: يجعل المحرك ذا قصور ذاتي صغير وذا استجابة سريعة للتغيير في السرعة.'},
  {q:'كم الزاوية في الفراغ بين ملفي العضو الثابت في محرك التحكم الحثي ثنائي الوجه؟',o:['45°','120°','90°','180°'],c:2,e:'ص 45: ملفان على العضو الثابت بينهما زاوية تسعون درجة في الفراغ.'},
  {q:'عند التشغيل من مصدر أحادي الوجه، أين يوصل المكثف؟',o:['على التوازي مع ملف التحكم','على التوالي مع ملف الجهد الثابت بصفة دائمة','على التوالي مع الدوار','لا حاجة لمكثف'],c:1,e:'ص 46: مكثف يوصل بصفة دائمة على التوالي مع ملف الجهد الثابت للحصول على فارق زمني 90° بين التيارين.'},
  {q:'لماذا يُقصر ملف التحكم عندما يكون الجهد عليه صفراً؟',o:['لزيادة السرعة','لمنع المحرك من بدء الحركة كمحرك ذي وجه واحد إذا تلقى دفعة خارجية','لحماية المكثف','لعكس الاتجاه'],c:1,e:'ص 46 كما في النص.'},
  {q:'حسب المعادلة (٣-١)، إذا خفّضنا جهد ملف التحكم إلى النصف فإن العزم:',o:['يتضاعف','يبقى ثابتاً','ينخفض إلى النصف','ينعدم'],c:2,e:'T ∝ Va: العزم يتناسب طردياً مع جهد ملف التحكم.'},
  {q:'ما نوع ملفات العضو الدوار في محرك التحكم للتيار المتردد؟',o:['ملفات مع مبدل وفرش','قفص سنجابي','مغناطيس دائم','حلقات انزلاق'],c:1,e:'ص 45: العضو الدوار عليه ملفات القفص السنجابي، ومقاومتها كبيرة نسبياً.'},
  {q:'كيف نعكس اتجاه دوران محرك التحكم ثنائي الوجه؟',o:['بعكس جهد ملف التحكم 180°','بزيادة التردد','بفصل ملف الجهد الثابت','بقصر الملفين'],c:0,e:'عكس جهد ملف التحكم يعكس اتجاه المجال الدوار (الكتاب يذكره في تعريف زمن عكس الحركة ص 49).'}
 ]
});

/* =====================================================================
   Lesson 3.2 — characteristics
   ===================================================================== */
const SM={a:0.15,b:0.5,c:1.0};
function fig32SVG(cur){
  const lines=Object.entries(SM).map(([l,sm])=>({pts:fn2pts(w=>kloss(w,sm),0,1),col:'--fg',w:2.2}));
  if(cur!=null)lines.forEach(l=>{l.op=.3;l.dash='5 4';l.col='--muted'});
  if(cur!=null)lines.push({pts:fn2pts(w=>kloss(w,cur),-0.6,1,160),col:'--blue',w:3});
  const lab=Object.entries(SM).map(([l,sm])=>{const wp=Math.max(0,1-sm);return {x:wp,y:kloss(wp,sm),s:l,dy:-10,dx:l==='c'?10:0,c:'b',fs:15}});
  return plot({W:520,H:290,x:cur!=null?[-0.6,1.05]:[0,1.05],y:[0,1.15],xt:cur!=null?[-0.5,0,0.5,1]:[0,0.5,1],yt:[],xl:'Speed (pu)',yl:'Torque',lines,labels:lab,
    shade:cur!=null?[{x0:-0.6,x1:0,col:'--surface-2',label:'سرعة بعكس اتجاه المجال'}]:[],aria:'أثر مقاومة الدوار على منحنى العزم والسرعة'})+
    (cur==null?'':'');
}
function fig33SVG(){
  const L=[1,0.8,0.6].map(v=>({pts:[[0,v],[v,0]],col:'--fg',w:2.4}));
  return plot({W:460,H:270,x:[0,1.1],y:[0,1.15],xt:[],yt:[],xl:'Speed',yl:'Torque',lines:L,labels:[1,0.8,0.6].map(v=>({x:0.02,y:v,s:'Va = '+v.toFixed(1)+' pu',dx:4,dy:-8,a:'start',c:'b'})),aria:'أثر جهد ملف التحكم'});
}
B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'47',
 title:'خواص محرك التحكم المتردد: مقاومة الدوار وجهد ملف التحكم',
 summary:'كيف تجعل زيادة مقاومة الدوار منحنى العزم والسرعة خطاً مستقيماً ذا ميل سالب، وكيف يحرّك جهد ملف التحكم هذا الخط، ومعادلة الخواص (٣-٢).',
 stations:[
  {intro:true},

  {st:1,short:'أثر مقاومة الدوار',title:'٣-١-٢ خواص محرك التحكم: أثر مقاومة الدوار',ref:'ص 47',
   q:'المحرك الحثي العادي منحناه «غير خطي»… فكيف نجعل العزم ينقص بانتظام كلما زادت السرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة منحنيات عزم وسرعة a و b و c لثلاث قيم لمقاومة الدوار، قممها على الارتفاع نفسه وتنتقل نحو السرعة صفر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="165" r="140" fill="#DDEFE6"/><g data-tip="محور السرعة بالوحدة النسبية ⟦pu⟧: القيمة ⟦1.0⟧ هي السرعة التزامنية للمجال الدوار."><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/></g><g data-tip="محور العزم."><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/></g><text x="80" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العزم</text><text x="318" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><path d="M190 250V256M318 250V256" stroke="#2C4A40" stroke-width="2"/><text x="62" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">0</text><text x="190" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">0.5</text><text x="318" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">1.0</text><path data-tip="أقصى عزم: القمم الثلاث على الارتفاع نفسه، فزيادة مقاومة الدوار لا تغيّر أقصى عزم." d="M62 80H330" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 5"/><g data-tip="المنحنى ⟦a⟧: أصغر مقاومة دوار، كالمحرك الحثي العادي. القمة قرب السرعة التزامنية، والعلاقة غير خطية."><path d="M62.0 200.1L68.4 198.9L74.8 197.6L81.2 196.3L87.6 194.9L94.0 193.4L100.4 191.8L106.8 190.2L113.2 188.4L119.6 186.6L126.0 184.6L132.4 182.5L138.8 180.3L145.2 178.0L151.6 175.5L158.0 172.8L164.4 170.0L170.8 167.0L177.2 163.7L183.6 160.2L190.0 156.4L196.4 152.4L202.8 148.0L209.2 143.3L215.6 138.2L222.0 132.8L228.4 126.9L234.8 120.6L241.2 114.0L247.6 107.1L254.0 100.0L260.4 93.1L266.8 86.8L273.2 82.0L279.6 80.0L286.0 82.8L292.4 93.1L298.8 114.0L305.2 148.0L311.6 194.9L318.0 250.0" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 200.1L68.4 198.9L74.8 197.6L81.2 196.3L87.6 194.9L94.0 193.4L100.4 191.8L106.8 190.2L113.2 188.4L119.6 186.6L126.0 184.6L132.4 182.5L138.8 180.3L145.2 178.0L151.6 175.5L158.0 172.8L164.4 170.0L170.8 167.0L177.2 163.7L183.6 160.2L190.0 156.4L196.4 152.4L202.8 148.0L209.2 143.3L215.6 138.2L222.0 132.8L228.4 126.9L234.8 120.6L241.2 114.0L247.6 107.1L254.0 100.0L260.4 93.1L266.8 86.8L273.2 82.0L279.6 80.0L286.0 82.8L292.4 93.1L298.8 114.0L305.2 148.0L311.6 194.9L318.0 250.0" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linejoin="round"/></g><g data-tip="المنحنى ⟦b⟧: مقاومة أكبر، فانتقلت القمة إلى سرعة أقل، بالارتفاع نفسه."><path d="M62.0 114.0L68.4 111.9L74.8 109.9L81.2 107.8L87.6 105.7L94.0 103.5L100.4 101.4L106.8 99.3L113.2 97.2L119.6 95.1L126.0 93.1L132.4 91.1L138.8 89.2L145.2 87.4L151.6 85.7L158.0 84.1L164.4 82.8L170.8 81.6L177.2 80.8L183.6 80.2L190.0 80.0L196.4 80.2L202.8 80.9L209.2 82.2L215.6 84.1L222.0 86.8L228.4 90.3L234.8 94.6L241.2 100.0L247.6 106.4L254.0 114.0L260.4 122.8L266.8 132.8L273.2 144.0L279.6 156.4L286.0 170.0L292.4 184.6L298.8 200.1L305.2 216.3L311.6 233.0L318.0 250.0" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 114.0L68.4 111.9L74.8 109.9L81.2 107.8L87.6 105.7L94.0 103.5L100.4 101.4L106.8 99.3L113.2 97.2L119.6 95.1L126.0 93.1L132.4 91.1L138.8 89.2L145.2 87.4L151.6 85.7L158.0 84.1L164.4 82.8L170.8 81.6L177.2 80.8L183.6 80.2L190.0 80.0L196.4 80.2L202.8 80.9L209.2 82.2L215.6 84.1L222.0 86.8L228.4 90.3L234.8 94.6L241.2 100.0L247.6 106.4L254.0 114.0L260.4 122.8L266.8 132.8L273.2 144.0L279.6 156.4L286.0 170.0L292.4 184.6L298.8 200.1L305.2 216.3L311.6 233.0L318.0 250.0" fill="none" stroke="#B9852A" stroke-width="3.5" stroke-linejoin="round"/></g><g data-tip="المنحنى ⟦c⟧: أكبر مقاومة، فصار أقصى عزم عند بدء الحركة (السرعة صفر). هكذا يُصمم دوار محرك التحكم."><path d="M62.0 80.0L68.4 80.1L74.8 80.2L81.2 80.5L87.6 80.9L94.0 81.5L100.4 82.2L106.8 83.1L113.2 84.1L119.6 85.4L126.0 86.8L132.4 88.4L138.8 90.3L145.2 92.3L151.6 94.6L158.0 97.2L164.4 100.0L170.8 103.1L177.2 106.4L183.6 110.1L190.0 114.0L196.4 118.2L202.8 122.8L209.2 127.6L215.6 132.8L222.0 138.2L228.4 144.0L234.8 150.1L241.2 156.4L247.6 163.1L254.0 170.0L260.4 177.2L266.8 184.6L273.2 192.3L279.6 200.1L286.0 208.2L292.4 216.3L298.8 224.6L305.2 233.0L311.6 241.5L318.0 250.0" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 80.0L68.4 80.1L74.8 80.2L81.2 80.5L87.6 80.9L94.0 81.5L100.4 82.2L106.8 83.1L113.2 84.1L119.6 85.4L126.0 86.8L132.4 88.4L138.8 90.3L145.2 92.3L151.6 94.6L158.0 97.2L164.4 100.0L170.8 103.1L177.2 106.4L183.6 110.1L190.0 114.0L196.4 118.2L202.8 122.8L209.2 127.6L215.6 132.8L222.0 138.2L228.4 144.0L234.8 150.1L241.2 156.4L247.6 163.1L254.0 170.0L260.4 177.2L266.8 184.6L273.2 192.3L279.6 200.1L286.0 208.2L292.4 216.3L298.8 224.6L305.2 233.0L311.6 241.5L318.0 250.0" fill="none" stroke="#12855A" stroke-width="4" stroke-linejoin="round"/></g><text x="280" y="70" text-anchor="middle" font-size="16" fill="#E8735A" font-weight="700" font-family="var(--mono)">a</text><text x="190" y="70" text-anchor="middle" font-size="16" fill="#B9852A" font-weight="700" font-family="var(--mono)">b</text><text x="80" y="70" text-anchor="middle" font-size="16" fill="#12855A" font-weight="700" font-family="var(--mono)">c</text><text x="196" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">R<tspan font-size="9" dy="3">2</tspan><tspan dy="-3">(c) &gt; R</tspan><tspan font-size="9" dy="3">2</tspan><tspan dy="-3">(b) &gt; R</tspan><tspan font-size="9" dy="3">2</tspan><tspan dy="-3">(a)</tspan></text></svg>`,
   cap:'فكرة الشكل (٣-٢) ص 47: كلما زادت مقاومة الدوار <span class="ltr">R<sub>2</sub></span> انتقلت القمة نحو السرعة صفر، وبقي ارتفاعها كما هو.<br><b>مرّر المؤشر على المنحنيات والخط المتقطع والمحورين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>منحنى العلاقة بين العزم والسرعة لمحرك التحكم ثنائي الوجه، يشبه تماماً نفس المنحنى للمحرك الحثي الثلاثي الأوجه، حيث يتكون مجال مغناطيسي دوار في كل منهما، هذه العلاقة تتأثر بقيمة مقاومة الدوار، فيتغير شكل منحنى العلاقة كلما ازدادت مقاومة الدوار كما في الشكل (٣-٢).</p>
     <p>يتضح من الشكل، أنه كلما ازدادت مقاومة الدوار، فإن <b>أقصى عزم</b> يولده المحرك <b>يظل ثابتاً</b>، بينما <b>تقل السرعة</b> التي يحدث عندها أقصى عزم.</p>`,ref:'ص 47'}
   ],
   body:[
    {predict:{q:'زدنا مقاومة قضبان الدوار. ماذا يحدث لقمة منحنى العزم والسرعة؟',opts:[
     ['ترتفع القمة (يزيد أقصى عزم)',false,'الكتاب يقول إن أقصى عزم يظل ثابتاً مهما زادت مقاومة الدوار.'],
     ['تبقى بالارتفاع نفسه وتنتقل إلى سرعة أقل',true,'أقصى عزم ثابت، والسرعة التي يحدث عندها تقل (ص 47). قارن المنحنيات a و b و c في الرسم.'],
     ['تنخفض القمة وتبقى عند السرعة نفسها',false,'العكس: الارتفاع ثابت، والذي يتغير هو مكان القمة على محور السرعة.']]}},
    {book:String.raw`<p>عند تصميم محركات التحكم ثنائية الوجه، يصمم الدوار بزيادة مقاومته حتى نحصل على المنحنى "c" المبين في الشكل (٣-٢)، بحيث يتولد <b>أقصى عزم عند بدء الحركة</b>، وفي أحيانٍ كثيرة يصمم المحرك بحيث يتولد أقصى عزم عند سرعات في عكس اتجاه دوران مجاله الدوار، بحيث تصبح العلاقة بين العزم والسرعة <b>خطاً مستقيماً ذا ميل سالب</b>، فيتحقق بذلك تشغيل المحرك بصورة مستقرة عند أي سرعة ابتداء من الصفر وحتى سرعة اللاحمل.</p>`,ref:'ص 47'},
    {tip:String.raw`<p>قال الكتاب ص 45 إن من عيوب هذه المحركات أن منحنى السرعة والعزم «غير خطي»، وهذا هو شكل المنحنى <span class="ltr">a</span> في المحرك الحثي العادي. العلاج هنا: <b>مقاومة دوار كبيرة</b> تجعل المنحنى قريباً من الخط المستقيم. والخط المستقيم ذو الميل السالب يعني أن العزم يقل بانتظام كلما زادت السرعة، فلكل حمل سرعة واحدة ثابتة يستقر عندها المحرك.</p>`,title:'لماذا يريد المصمم المنحنى c أو أبعد منه؟'},
    {watch:String.raw`<p>داخل صورتي الشكلين (٣-٢) و (٣-٣) في الكتاب مكتوب «<span class="ltr">Fig4-2</span>» و «<span class="ltr">Fig4-3</span>» لأنهما منقولان من مرجع آخر. المقصود هو الشكلان (٣-٢) و (٣-٣) نفسهما.</p>`,fix:true},
    {title:'مختبر مصغّر: كبّر مقاومة الدوار',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مقاومة الدوار وراقب أين تقع قمة منحنى العزم والسرعة وكم ارتفاعها. السرعة على المحور الأفقي نسبة من السرعة التزامنية (<span class="ltr">pu</span>)، والسرعة السالبة سرعة في عكس اتجاه دوران المجال الدوار.',
 predict:{q:'كبّرنا مقاومة الدوار أكثر مما في المنحنى c. أين تنتقل قمة العزم؟',opts:[
  ['إلى سرعة أعلى من سرعة اللاحمل',false,'زيادة المقاومة تنقل القمة نحو سرعة أقل، لا أعلى.'],
  ['إلى سرعات في عكس اتجاه دوران المجال الدوار (يسار الصفر)',true,'«وفي أحيانٍ كثيرة يصمم المحرك بحيث يتولد أقصى عزم عند سرعات في عكس اتجاه دوران مجاله الدوار» (ص 47)، فيصير الجزء من الصفر حتى سرعة اللاحمل قريباً من خط مستقيم ذي ميل سالب.'],
  ['تبقى عند بدء الحركة مهما زادت المقاومة',false,'المنحنى c وحده قمته عند بدء الحركة؛ بعده تنتقل القمة إلى ما قبل الصفر.']]},
 ins:[{k:'r',l:'مقاومة الدوار',seg:[['a','a (صغيرة)'],['b','b'],['c','c'],['d','أكبر من c']],v:'a'}],ill:true,
 calc:(s)=>{const M={a:0.15,b:0.5,c:1.0,d:1.6},sm=M[s.r],f=w=>kloss(w,sm);
  const others=Object.keys(M).filter(k=>k!==s.r).map(k=>({f:w=>kloss(w,M[k]),col:'--muted',w:1.4,dash:'4 4'}));
  return {plot:{xr:[-0.6,1],yr:[0,1.15],xt:[-0.5,0,0.5,1],yt:[0,0.5,1],xl:'السرعة (pu)',yl:'العزم / أقصى عزم',curves:others.concat([{f,col:'--blue',w:3,n:120}]),cur:[1-sm,1],dots:[[0,f(0),'--live']]},
   facts:[['سرعة أقصى عزم',DCML.fm(B,1-sm,2)+' pu','hi'],['أقصى عزم','1.00'],['العزم عند بدء الحركة',DCML.fm(B,f(0),2)]],
   msg:{a:'المنحنى a: القمة قريبة من سرعة اللاحمل والمنحنى غير خطي — شكل المحرك الحثي العادي.',b:'المنحنى b: انتقلت القمة إلى سرعة أقل، وبقي ارتفاعها كما هو.',c:'المنحنى c: أقصى عزم عند بدء الحركة (السرعة صفر)، وهو ما يصمم عليه دوار محرك التحكم (ص 47).',d:'القمة صارت في عكس اتجاه المجال الدوار، والجزء من الصفر حتى سرعة اللاحمل يكاد يكون خطاً مستقيماً ذا ميل سالب.'}[s.r]}}})}
   ]},

  {st:2,short:'جهد ملف التحكم',title:'التحكم بجهد ملف التحكم ومعادلة الخواص',ref:'ص 47',
   q:'صار عندنا خط مستقيم… فكيف نحرّكه لنحصل على عزم أقل أو سرعة أقل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة خطوط عزم وسرعة متوازية لثلاث قيم لجهد ملف التحكم: 1.0 و 0.8 و 0.6 بالوحدة النسبية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="165" r="140" fill="#E6E2F8"/><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="80" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العزم</text><text x="318" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><g data-tip="خط الجهد الكامل ⟦Va = 1.0 pu⟧: أعلى عزم بدء وأعلى سرعة لاحمل."><path d="M62 80L318 250" stroke="transparent" stroke-width="14"/><path d="M62 80L318 250" stroke="#12855A" stroke-width="4"/><text x="70" y="74" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)">1.0</text></g><g data-tip="خط ⟦Va = 0.8 pu⟧: موازٍ للأول (الميل نفسه)، لكن عزم البدء وسرعة اللاحمل أقل."><path d="M62 114L266.8 250" stroke="transparent" stroke-width="14"/><path d="M62 114L266.8 250" stroke="#4FB3A9" stroke-width="4"/><text x="70" y="108" font-size="13" fill="#2C8A80" font-weight="700" font-family="var(--mono)">0.8</text></g><g data-tip="خط ⟦Va = 0.6 pu⟧: أدنى الخطوط الثلاثة، وما زال موازياً لها."><path d="M62 148L215.6 250" stroke="transparent" stroke-width="14"/><path d="M62 148L215.6 250" stroke="#E8735A" stroke-width="4"/><text x="70" y="142" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)">0.6</text></g><g data-tip="الوحدة النسبية ⟦pu⟧: الجهد منسوباً إلى الجهد الكامل؛ ⟦0.8 pu⟧ تعني ثمانين في المئة من الجهد الكامل."><rect x="196" y="56" width="132" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="262" y="77" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="3">a</tspan><tspan dy="-3"> (pu)</tspan></text></g><text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">خطوط متوازية: الميل ثابت</text></svg>`,
   cap:'فكرة الشكل (٣-٣) ص 47: كل جهد لملف التحكم يعطي خطاً، والخطوط متوازية.<br><b>مرّر المؤشر على الخطوط والمربع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يمكن أيضاً التحكم في المنحنى "c" بتغيير جهد ملف التحكم (<span class="ltr">\(V_a\)</span>)، فنحصل على مجموعة من الخواص كما هو مبين في الشكل (٣-٣)، يمكن كتابة معادلة الخواص كما في المعادلة (٣-٢):</p>
     <div class="eq">$$T = -K_{\omega}\cdot\omega + K_{v}\cdot V_a$$<span class="eqno">(٣-٢)</span></div>`,ref:'ص 47'}
   ],
   body:[
    {tip:String.raw`<p><span class="ltr">\(T\)</span> العزم بوحدة <span class="ltr">N.m</span>، و <span class="ltr">\(\omega\)</span> السرعة بوحدة <span class="ltr">rad/sec</span>، و <span class="ltr">\(V_a\)</span> جهد ملف التحكم.</p>
     <p>الكتاب لا يعرّف الثابتين هنا، ومعناهما يظهر من حل المثال (٣-١) ص 51: <span class="ltr">\(K_\omega\)</span> هو <b>ميل خط العزم والسرعة</b> <span class="ltr">(slope of torque speed line)</span>، و <span class="ltr">\(K_v\)</span> <b>ثابت الجهد</b>.</p>`,title:'ماذا تعني رموز المعادلة (٣-٢)؟'},
    {tip:String.raw`<p>عوّض في المعادلة (٣-٢) عند طرفي الخط:</p>
     <ul><li>عند بدء الحركة <span class="ltr">\(\omega = 0\)</span> فيكون العزم <b>عزم البدء</b>: <span class="ltr">\(T_{st} = K_v V_a\)</span></li>
     <li>عند اللاحمل <span class="ltr">\(T = 0\)</span> فتكون <b>سرعة اللاحمل</b>: <span class="ltr">\(\omega_o = K_v V_a / K_\omega\)</span></li></ul>
     <p>كلاهما يتناسب مع <span class="ltr">\(V_a\)</span>، أما الميل <span class="ltr">\(K_\omega\)</span> فلا يتغير؛ لذلك تكون الخطوط في الشكل (٣-٣) <b>متوازية</b>، وكلما قل <span class="ltr">\(V_a\)</span> قل عزم البدء وسرعة اللاحمل معاً.</p>`,title:'طرفا الخط'},
    {predict:{q:String.raw`خفّضنا جهد ملف التحكم من <span class="ltr">1.0 pu</span> إلى <span class="ltr">0.6 pu</span>. ماذا يحدث لخط العزم والسرعة؟`,opts:[
     ['يدور الخط فيصير ميله أكبر',false,String.raw`الميل هو <span class="ltr">\(K_\omega\)</span>، ولا علاقة له بالجهد؛ الخطوط في الشكل (٣-٣) متوازية.`],
     ['لا يتغير الخط، فقط يقل التيار',false,String.raw`الحد <span class="ltr">\(K_v V_a\)</span> في المعادلة (٣-٢) يقل مع الجهد، فيتغير مكان الخط.`],
     ['ينزل الخط موازياً لنفسه: يقل عزم البدء وسرعة اللاحمل معاً',true,String.raw`الحد <span class="ltr">\(K_v V_a\)</span> يقل والميل <span class="ltr">\(K_\omega\)</span> ثابت، كما في الشكل (٣-٣).`]]}},
    {watch:String.raw`<p>إشارة السالب في <span class="ltr">\(-K_\omega\cdot\omega\)</span> هي التي تجعل الخط <b>ينزل</b> كلما زادت السرعة (ميل سالب). و <span class="ltr">\(K_\omega\)</span> نفسه رقم موجب.</p>`},
    {title:'مختبر مصغّر: غيّر جهد ملف التحكم والحمل',widget:(el,B)=>DCML.lab(el,B,{intro:'الثابتان هنا من حل المثال (٣-١) ص 51: <span class="ltr">K<sub>v</sub> = 0.75/95</span> و <span class="ltr">K<sub>ω</sub> = 0.75/225</span>، والخط من المعادلة (٣-٢). غيّر جهد ملف التحكم وعزم الحمل (رقم تختاره أنت)، وراقب نقطة التشغيل حيث عزم المحرك يساوي عزم الحمل.',
 predict:{q:'رفعنا جهد ملف التحكم والحمل كما هو. ماذا يحدث لسرعة المحرك؟',opts:[
  ['تقل',false,'خفض الجهد هو الذي يقلل السرعة.'],
  ['لا تتغير لأن الحمل لم يتغير',false,'الحمل نفسه، لكن خط المحرك ارتفع فتغيرت نقطة التقاطع.'],
  ['تزيد، لأن الخط يرتفع موازياً لنفسه فيقطع خط الحمل عند سرعة أعلى',true,'من المعادلة (٣-٢): <span class="ltr">ω = (K<sub>v</sub>V<sub>a</sub> − T)/K<sub>ω</sub></span>؛ كلما زاد <span class="ltr">V<sub>a</sub></span> زادت السرعة عند العزم نفسه.']]},
 ins:[{k:'Va',l:'جهد ملف التحكم V<sub>a</sub>',min:0,max:110,step:1,v:95,dp:0,u:'V'},{k:'TL',l:'عزم الحمل T<sub>L</sub> (رقم تختاره أنت)',min:0,max:0.8,step:0.01,v:0.3,dp:2,u:'N.m'}],
 calc:(s)=>{const Kv=0.75/95,Kw=0.75/225,Tst=Kv*s.Va,w0=Tst/Kw,w=(Tst-s.TL)/Kw,run=w>0.01;
  const cv=[{pts:[[0,s.TL],[330,s.TL]],col:'--stop',w:1.8,dash:'6 4'}];if(s.Va!==95)cv.push({pts:[[0,0.75],[225,0]],col:'--muted',w:1.4,dash:'4 4'});
  if(Tst>0)cv.push({pts:[[0,Tst],[w0,0]],col:'--blue',w:3});
  return {plot:{xr:[0,330],yr:[0,0.9],xt:[0,100,200,300],yt:[0,0.25,0.5,0.75],xl:'ω (rad/s)',yl:'T (N.m)',curves:cv,cur:run?[w,s.TL]:null},
   facts:[['عزم البدء T<sub>st</sub>',DCML.fm(B,Tst,3)+' N.m'],['سرعة اللاحمل ω<sub>o</sub>',DCML.fm(B,w0,0)+' rad/s'],['سرعة التشغيل',run?DCML.fm(B,w,0)+' rad/s':'لا يدور',run?'hi':'bad']],
   msg:s.Va===0?'جهد ملف التحكم صفر: لا عزم، المعادلة (٣-١).':!run?'عزم الحمل أكبر من عزم البدء أو يساويه، فلا يبدأ المحرك الحركة. ارفع <span class="ltr">V<sub>a</sub></span> أو خفّف الحمل.':s.Va===95?'هذا خط المثال (٣-١): الخط المتقطع الأحمر هو الحمل، والنقطة البرتقالية نقطة التشغيل.':'الخط الرمادي المتقطع هو خط <span class="ltr">95 V</span> للمقارنة: الخط الجديد موازٍ له.',cls:(s.Va===0||!run)?'warn':''}}})}
   ]},

  {recap:[
   String.raw`منحنى العزم والسرعة لمحرك التحكم ثنائي الوجه يشبه منحنى المحرك الحثي الثلاثي الأوجه، ويتأثر بمقاومة الدوار (ص 47).`,
   String.raw`زيادة مقاومة الدوار تُبقي أقصى عزم ثابتاً وتنقل مكانه إلى سرعة أقل؛ ويُصمم الدوار ليعطي المنحنى c (أقصى عزم عند البدء) أو أبعد منه (الشكل (٣-٢)).`,
   String.raw`النتيجة خط مستقيم ذو ميل سالب، فيعمل المحرك بصورة مستقرة عند أي سرعة من الصفر حتى سرعة اللاحمل.`,
   String.raw`معادلة الخواص، المعادلة (٣-٢): <span class="ltr">\(T = -K_\omega\,\omega + K_v V_a\)</span>؛ وتغيير <span class="ltr">\(V_a\)</span> يحرّك الخط موازياً لنفسه (الشكل (٣-٣)).`]}
],
 theory:[
  {h:'٣-١-٢ خواص محرك التحكم للتيار المتردد',ref:'ص 47',html:`<p>«منحنى العلاقة بين العزم والسرعة لمحرك التحكم ثنائي الوجه، يشبه تماماً نفس المنحنى للمحرك الحثي الثلاثي الأوجه، حيث يتكون مجال مغناطيسي دوار في كل منهما، هذه العلاقة تتأثر بقيمة مقاومة الدوار، فيتغير شكل منحنى العلاقة كلما ازدادت مقاومة الدوار كما في الشكل (٣-٢).»</p>
   <p>«يتضح من الشكل، أنه كلما ازدادت مقاومة الدوار، فإن <b>أقصى عزم</b> يولده المحرك <b>يظل ثابتاً</b>، بينما <b>تقل السرعة</b> التي يحدث عندها أقصى عزم.»</p>`},
  {fig:'(٣-٢)',ref:'ص 47',caption:'كيفية تغيير خواص المحرك الحثي مع تغيير مقاومة الدوار — <span class="ltr">\\(R_2(c) > R_2(b) > R_2(a)\\)</span> (إعادة رسم)',draw:()=>box(fig32SVG(null),520)},
  {html:`<p>«عند تصميم محركات التحكم ثنائية الوجه، يصمم الدوار بزيادة مقاومته حتى نحصل على المنحنى "c" المبين في الشكل (٣-٢)، بحيث يتولد <b>أقصى عزم عند بدء الحركة</b>، وفي أحيانٍ كثيرة يصمم المحرك بحيث يتولد أقصى عزم عند سرعات في عكس اتجاه دوران مجاله الدوار، بحيث تصبح العلاقة بين العزم والسرعة <b>خطاً مستقيماً ذا ميل سالب</b>، فيتحقق بذلك تشغيل المحرك بصورة مستقرة عند أي سرعة ابتداء من الصفر وحتى سرعة اللاحمل.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> قال الكتاب ص 45 إن من عيوب هذه المحركات أن منحنى السرعة والعزم «غير خطي» — وهذا هو شكل المنحنى a في المحرك الحثي العادي. العلاج هو ما يشرحه هنا: <b>مقاومة دوار كبيرة</b> تجعل المنحنى قريباً من الخط المستقيم. والخط المستقيم ذو الميل السالب يعني أن العزم يقل بانتظام كلما زادت السرعة، فلكل حمل سرعة واحدة ثابتة يستقر عندها المحرك.'},
  {h:'التحكم بجهد ملف التحكم ومعادلة الخواص',ref:'ص 47',html:`<p>«يمكن أيضاً التحكم في المنحنى "c" بتغيير جهد ملف التحكم (<span class="ltr">\\(V_a\\)</span>)، فنحصل على مجموعة من الخواص كما هو مبين في الشكل (٣-٣)، يمكن كتابة معادلة الخواص كما في المعادلة (٣-٢):»</p>
   <div dir="ltr" style="direction:ltr">$$T = -K_{\\omega}\\cdot\\omega + K_{v}\\cdot V_a \\qquad \\text{(٣-٢)}$$</div>
   <p>حيث <span class="ltr">\\(T\\)</span> العزم (<span class="ltr">N.m</span>)، و <span class="ltr">\\(\\omega\\)</span> السرعة (<span class="ltr">rad/sec</span>)، و <span class="ltr">\\(V_a\\)</span> جهد ملف التحكم.</p>`},
  {fig:'(٣-٣)',ref:'ص 47',caption:'خواص محرك التحكم ثنائي الوجه مع تغيير جهد ملف التحكم (إعادة رسم)',draw:()=>box(fig33SVG(),460)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب لا يعرّف الثابتين هنا، ومعناهما يظهر من حل المثال (٣-١) ص 51: <span class="ltr">\\(K_\\omega\\)</span> هو <b>ميل خط العزم والسرعة</b> (slope of torque speed line)، و <span class="ltr">\\(K_v\\)</span> <b>ثابت الجهد</b>. عند بدء الحركة <span class="ltr">\\(\\omega = 0\\)</span> فيكون عزم البدء <span class="ltr">\\(T_{st} = K_v V_a\\)</span>، وعند اللاحمل <span class="ltr">\\(T = 0\\)</span> فتكون سرعة اللاحمل <span class="ltr">\\(\\omega_o = K_v V_a / K_\\omega\\)</span>. لذلك في الشكل (٣-٣) الخطوط <b>متوازية</b> (الميل نفسه)، وكلما قل <span class="ltr">\\(V_a\\)</span> قل عزم البدء وسرعة اللاحمل معاً.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الشكلان (٣-٢) و (٣-٣) ص 47 منقولان من مرجع آخر، ومكتوب داخل الصورتين «Fig4-2» و «Fig4-3» بدل (٣-٢) و (٣-٣). أعدنا رسمهما بدون هذه العناوين.'+'</div>'}
 ],
 lab:(el)=>{
  let sm=0.15,va=1,wop=0.4;const flags={};
  el.innerHTML=`<div id="u3l2tp"></div><div class="grid">
   <div class="panel c6"><h2>(١) أثر مقاومة الدوار <small>مبني على الشكل (٣-٢) ص 47</small></h2>
    ${slHTML('r2','مقاومة الدوار R<sub>2</sub> (نسبية)',0,100,1,0)}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button class="btn" data-p="a">المنحنى a</button><button class="btn" data-p="b">المنحنى b</button><button class="btn" data-p="c">المنحنى c</button><button class="btn" data-p="d">أكبر من c</button></div>
    <div class="svgbox" id="p1"></div>
    <div class="facts">${fact('سرعة أقصى عزم (pu)','f1')}${fact('عزم البدء ÷ أقصى عزم','f2')}${fact('البعد عن الخط المستقيم','f3')}</div><div id="m1"></div></div>
   <div class="panel c6"><h2>(٢) أثر جهد ملف التحكم <small>مبني على الشكل (٣-٣) والمعادلة (٣-٢)</small></h2>
    ${slHTML('va','جهد ملف التحكم V<sub>a</sub>',0,100,5,100)}${slHTML('wo','سرعة الدوار ω (نقطة التشغيل)',0,110,1,40)}
    <div class="svgbox" id="p2"></div><div class="ex-f" id="eq" style="text-align:center"></div>
    <div class="facts">${fact('عزم البدء T<sub>st</sub> = K<sub>v</sub>V<sub>a</sub>','g1')}${fact('سرعة اللاحمل ω<sub>o</sub>','g2')}${fact('العزم عند السرعة المختارة','g3')}</div><div id="m2"></div></div>
   <div class="panel c12"><p class="sub"><b>أرقام توضيحية:</b> القيم بالوحدة النسبية (pu). في اللوحة (١) استعملنا علاقة المحرك الحثي المعروفة لرسم المنحنيات (ليست من الكتاب)، مع بقاء أقصى عزم ثابتاً كما يقول الكتاب. في اللوحة (٢) أخذنا <span id="u3l2k"></span> (<span id="u3l2kw"></span>).</p>${tryBox('try')}</div></div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'المحرك الحثي العادي',x:'ابدأ بالمنحنى a: القمة قرب سرعة التزامن، وعزم البدء صغير، والمنحنى بعيد عن الخط المستقيم.',done:()=>sm<0.2},
   {t:'زِد مقاومة الدوار',x:'حرّك منزلق R₂: القمة تنتقل نحو السرعة صفر، لكن ارتفاعها (أقصى عزم) لا يتغير.',done:()=>sm>0.4&&sm<0.7},
   {t:'المنحنى c',x:'اجعل أقصى عزم عند بدء الحركة (سرعة أقصى عزم = 0).',done:()=>Math.abs(sm-1)<0.06},
   {t:'خط مستقيم',x:'زد R₂ أكثر من c: صار أقصى العزم عند سرعات بعكس اتجاه المجال، والجزء من 0 إلى 1 شبه خط مستقيم ذي ميل سالب.',done:()=>sm>1.5},
   {t:'حرّك الخط بالجهد',x:'في اللوحة (٢) خفّض V_a إلى 60 %: الخط ينزل موازياً لنفسه، فيقل عزم البدء وسرعة اللاحمل معاً.',done:()=>flags.low},
   {t:'نقطة التشغيل',x:'حرّك سرعة الدوار: العزم يقل خطياً كلما زادت السرعة، ويصير صفراً عند سرعة اللاحمل.',done:()=>flags.moved}]);
  const r2=q(el,'#r2'),smOf=v=>0.1*Math.pow(25,v/100),vOf=s=>100*Math.log(s/0.1)/Math.log(25);
  r2.value=vOf(sm);
  const draw1=()=>{q(el,'#r2-v').textContent=(sm/0.15).toFixed(1)+' × R2(a)';q(el,'#p1').innerHTML=fig32SVG(sm);
    const wp=1-sm;q(el,'#f1').textContent=nf(wp,2)+(wp<0?' (عكسية)':'');q(el,'#f2').textContent=nf(kloss(0,sm),2);
    let dev=0;for(let i=0;i<=50;i++){const x=i/50;dev=Math.max(dev,Math.abs(kloss(x,sm)-kloss(0,sm)*(1-x)))}q(el,'#f3').textContent=Math.round(dev*100)+' %';
    q(el,'#m1').innerHTML=`<div class="callout">${sm<0.3?'مثل المنحنى <b>a</b>: محرك حثي عادي، قمة العزم قرب التزامن، والعلاقة غير خطية.':sm<0.9?'مثل المنحنى <b>b</b>: القمة انتقلت إلى سرعة أقل، والارتفاع نفسه.':sm<1.15?'مثل المنحنى <b>c</b>: أقصى عزم عند بدء الحركة — هكذا يُصمم دوار محرك التحكم.':'أقصى عزم عند سرعة <b>بعكس اتجاه المجال</b>: من السرعة 0 إلى 1 العلاقة شبه <b>خط مستقيم ذي ميل سالب</b>، فيعمل المحرك مستقراً عند أي سرعة.'}</div>`};
  r2.addEventListener('input',()=>{sm=smOf(+r2.value);draw1()});
  el.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{sm=b.dataset.p==='d'?2.2:SM[b.dataset.p];r2.value=vOf(sm);draw1()}));
  const draw2=()=>{const Kw=TP.v.Kw,Kv=TP.v.Kv,xs=Kv/Kw,ys=Kv,tl=v=>[v,String(+v.toPrecision(3))];
    q(el,'#va-v').textContent=va.toFixed(2)+' pu';q(el,'#wo-v').textContent=wop.toFixed(2)+' pu';const T=-Kw*wop+Kv*va,Tst=Kv*va,w0=Kv*va/Kw;
    const L=[1,0.8,0.6].map(v=>({pts:[[0,Kv*v],[v*xs,0]],col:'--muted',w:1.8,dash:'5 4'}));L.push({pts:[[0,Tst],[Math.max(w0,0.001),0]],col:'--blue',w:3});
    const lab=[1,0.8,0.6].map(v=>({x:v*xs,y:0,s:v.toFixed(1),dy:16,c:'m'}));
    q(el,'#p2').innerHTML=plot({W:460,H:270,x:[0,1.12*xs],y:[-0.25*ys,1.12*ys],xt:[0,0.5,1].map(v=>tl(v*xs)),yt:[0,0.5,1].map(v=>tl(v*ys)),xl:'ω (pu)',yl:'T (pu)',lines:L,dots:[{x:wop,y:T,col:T<0?'--stop':'--on'}],hl:[],labels:[{x:wop,y:T,s:`(${wop.toFixed(2)}, ${T.toFixed(2)})`,dy:-12,a:'start',dx:6}],aria:'خطوط العزم والسرعة'});
    q(el,'#eq').innerHTML=B.tex(`T=-K_\\omega\\,\\omega+K_v V_a=-(${B.fmtN(Kw)})(${wop.toFixed(2)})+(${B.fmtN(Kv)})(${va.toFixed(2)})=${T.toFixed(2)}\\ \\text{pu}`,true);
    q(el,'#g1').textContent=Tst.toFixed(2)+' pu';q(el,'#g2').textContent=w0.toFixed(2)+' pu';q(el,'#g3').textContent=T.toFixed(2)+' pu';
    q(el,'#m2').innerHTML=T<-0.001?'<div class="callout err">السرعة المختارة أكبر من سرعة اللاحمل لهذا الجهد: العزم سالب (يعمل المحرك على فرملة الحمل). توضيح ليس من الكتاب.</div>':Math.abs(T)<0.011?'<div class="callout">العزم صفر: هذه هي <b>سرعة اللاحمل</b> لهذا الجهد.</div>':wop<0.011?'<div class="callout">السرعة صفر: هذا هو <b>عزم البدء</b>، وهو أقصى عزم للمحرك.</div>':''};
  q(el,'#va').addEventListener('input',e=>{va=+e.target.value/100;if(va<=0.6)flags.low=1;draw2()});
  q(el,'#wo').addEventListener('input',e=>{wop=+e.target.value/100;flags.moved=1;draw2()});
  const tpK=()=>{const Kw=TP.v.Kw,Kv=TP.v.Kv;q(el,'#u3l2k').innerHTML=B.tex(`K_\\omega = ${B.fmtN(Kw)}`)+' pu و '+B.tex(`K_v = ${B.fmtN(Kv)}`)+' pu';q(el,'#u3l2kw').textContent=TP.trainer?'قيم المدرب':'قيم توضيحية';
    const wo=q(el,'#wo'),mx=Math.max(5,Math.round(110*Kv/Kw));wo.max=mx;if(wop*100>mx){wop=mx/100;wo.value=mx}};
  const TP=B.params(q(el,'#u3l2tp'),'u3-l2',[
   {k:'Kw',label:'ميل خط العزم والسرعة K<sub>ω</sub> — اللوحة (٢)',unit:'pu',value:1,min:0.1,max:10,step:0.01},
   {k:'Kv',label:'ثابت الجهد K<sub>v</sub> (عزم البدء عند الجهد الكامل) — اللوحة (٢)',unit:'pu',value:1,min:0.1,max:10,step:0.01}],()=>{tpK();draw2()});
  tpK();
  draw1();draw2();B.math(el);
  loopOn(el,()=>tl.check());
 },
 quiz:[
  {q:'منحنى العزم والسرعة لمحرك التحكم ثنائي الوجه يشبه منحنى:',o:['محرك التيار المستمر التوالي','المحرك الحثي الثلاثي الأوجه','المحرك التزامني','محرك الخطوة'],c:1,e:'ص 47: يشبه تماماً نفس المنحنى للمحرك الحثي الثلاثي الأوجه، لأن في كل منهما مجالاً مغناطيسياً دواراً.'},
  {q:'عند زيادة مقاومة الدوار، ماذا يحدث لأقصى عزم؟',o:['يزيد','يقل','يظل ثابتاً','ينعدم'],c:2,e:'ص 47: أقصى عزم يظل ثابتاً، بينما تقل السرعة التي يحدث عندها.'},
  {q:'ما الذي يميز المنحنى c في الشكل (٣-٢)؟',o:['أقصى عزم عند سرعة التزامن','أقصى عزم عند بدء الحركة','لا يوجد عزم بدء','أقل عزم عند البدء'],c:1,e:'ص 47: يصمم الدوار حتى نحصل على المنحنى c بحيث يتولد أقصى عزم عند بدء الحركة.'},
  {q:'ما فائدة أن تصبح العلاقة بين العزم والسرعة خطاً مستقيماً ذا ميل سالب؟',o:['زيادة القدرة','تشغيل المحرك بصورة مستقرة عند أي سرعة من الصفر حتى اللاحمل','إلغاء ملف التحكم','رفع التردد'],c:1,e:'ص 47 كما في النص.'},
  {q:'في المعادلة (٣-٢) T = −K<sub>ω</sub>·ω + K<sub>v</sub>·V<sub>a</sub>، ماذا يمثل K<sub>ω</sub>؟',o:['جهد ملف التحكم','ميل خط العزم والسرعة','القصور الذاتي','سرعة اللاحمل'],c:1,e:'كما يظهر من المثال (٣-١): Kω = slope of torque speed line.'},
  {q:'عند خفض جهد ملف التحكم في الشكل (٣-٣):',o:['يتغير ميل الخط','ينخفض الخط موازياً لنفسه فيقل عزم البدء وسرعة اللاحمل','يزيد عزم البدء','لا يتغير شيء'],c:1,e:'الخطوط متوازية: الميل Kω ثابت، والجزء Kv·Va هو الذي يقل.'},
  {q:'عند السرعة ω = 0 يكون العزم حسب المعادلة (٣-٢):',o:['صفراً','K<sub>v</sub>·V<sub>a</sub> (عزم البدء)','−K<sub>ω</sub>','لا نهائياً'],c:1,e:'T = −Kω·0 + Kv·Va = Kv·Va، وهو عزم بدء الحركة.'}
 ]
});
/* =====================================================================
   Lesson 3.3 — drag-cup servo motor
   ===================================================================== */
/* الشكل (٣-٤): longitudinal section. hi = 'stator'|'cup'|'iron'|'shaft'|'' */
function fig34SVG(hi){
  const H=p=>hi===p?'var(--live)':'var(--fg)',sw=p=>hi===p?3.2:1.8,op=p=>hi&&hi!==p?.35:1;
  let s=`<svg viewBox="0 0 520 260" role="img" aria-label="تركيب المحرك ذي الكأس المجرور"><defs><pattern id="u3hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" stroke="var(--wire)" stroke-width="2"/></pattern></defs>`;
  // stator windings top & bottom
  [[30,'top'],[184,'bot']].forEach(([y])=>{s+=`<g opacity="${op('stator')}"><rect x="170" y="${y}" width="250" height="46" fill="url(#u3hatch)" stroke="${H('stator')}" stroke-width="${sw('stator')}"/></g>`});
  // drag cup (⊐ open to the right): bottom of cup on the left, connected to the shaft
  s+=`<g opacity="${op('cup')}"><path d="M150 84H410M150 176H410M150 84V176" fill="none" stroke="${H('cup')}" stroke-width="${hi==='cup'?7:5}" stroke-linecap="square"/></g>`;
  // fixed iron inside the cup, held by the frame on the right
  s+=`<g opacity="${op('iron')}"><rect x="190" y="98" width="250" height="64" fill="url(#u3hatch)" stroke="${H('iron')}" stroke-width="${sw('iron')}"/><path d="M440 110H486M440 150H486M486 90V170" stroke="${H('iron')}" stroke-width="${sw('iron')}"/></g>`;
  // shaft
  s+=`<g opacity="${op('shaft')}"><rect x="40" y="122" width="110" height="16" fill="var(--surface-2)" stroke="${H('shaft')}" stroke-width="${sw('shaft')}"/><path d="M70 104A16 26 0 1 0 70 156" fill="none" stroke="${H('shaft')}" stroke-width="2"/>${arrowHead(70,156,0.3,9,'--fg')}</g>`;
  s+=tx(295,24,'Stator Winding',{})+tx(295,250,'Stator Winding',{})+tx(110,74,'Drag Cup Rotor',{a:'middle'})+tx(315,134,'Fixed Iron',{})+tx(95,170,'shaft',{c:'m'});
  return s+'</svg>';
}
/* end views for the comparison: cup (thin ring, smooth) vs ordinary toothed cage rotor */
function endCupSVG(id){const c=90;let s=`<svg viewBox="0 0 180 180" role="img" aria-label="الدوار ذو الكأس"><circle cx="${c}" cy="${c}" r="86" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/><circle cx="${c}" cy="${c}" r="64" fill="var(--surface)" stroke="var(--line)"/>`;
  s+=`<g id="${id}"><circle cx="${c}" cy="${c}" r="58" fill="none" stroke="var(--live)" stroke-width="7"/><circle cx="${c}" cy="${c-58}" r="5" fill="var(--stop)"/></g>`;
  s+=`<circle cx="${c}" cy="${c}" r="50" fill="url(#u3hatchE)" stroke="var(--fg)" stroke-width="1.4"/><defs><pattern id="u3hatchE" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V7" stroke="var(--wire)" stroke-width="2"/></pattern></defs>`+tx(c,c+4,'Fixed iron',{c:'m',fs:10});
  return s+'</svg>'}
function endCageSVG(id){const c=90;let s=`<svg viewBox="0 0 180 180" role="img" aria-label="دوار قفص عادي بأسنان"><circle cx="${c}" cy="${c}" r="86" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>`;
  for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<rect x="${c-5}" y="${c-84}" width="10" height="20" fill="var(--surface)" transform="rotate(${i*30+15} ${c} ${c})"/>`}
  s+=`<circle cx="${c}" cy="${c}" r="64" fill="none" stroke="var(--line)"/><g id="${id}"><circle cx="${c}" cy="${c}" r="62" fill="var(--wire)" opacity=".55"/>`;
  for(let i=0;i<12;i++){s+=`<rect x="${c-5}" y="${c-63}" width="10" height="14" rx="2" fill="var(--surface)" transform="rotate(${i*30} ${c} ${c})"/><circle cx="${c}" cy="${c-42}" r="6" fill="var(--live-soft)" stroke="var(--live)" transform="rotate(${i*30} ${c} ${c})"/>`}
  s+=`<circle cx="${c}" cy="${c}" r="10" fill="var(--fg)"/><circle cx="${c}" cy="${c-26}" r="5" fill="var(--stop)"/></g>`;
  return s+'</svg>'}

B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'48',
 title:'محرك التحكم ذو الكأس المجرور (Drag-Cup)',
 summary:'تركيب الدوار على شكل كأس نحاسي مفرغ يدور حول حديد ثابت، ولماذا يكون قصوره الذاتي ضعيفاً جداً وخالياً من العضة المغناطيسية.',
 stations:[
  {intro:true},

  {st:1,short:'التركيب',title:'٣-١-٣ محركات التحكم ذات الكأس المجرور: التركيب',ref:'ص 48',
   q:'كيف نجعل الجزء الدوار أخف ما يمكن… مع أن المجال يحتاج حديداً ليكتمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع طولي في محرك الكأس المجرور: ملفات العضو الثابت أعلى وأسفل، والكأس النحاسي الدوار، والحديد الثابت داخله، والمحور من جهة واحدة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="150" r="140" fill="#F7DCC8"/><text x="230" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ملفات العضو الثابت</text><g data-tip="ملفات العضو الثابت: تشبه تماماً العضو الثابت في المحركات الأخرى."><rect x="130" y="50" width="200" height="38" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="130" y="212" width="200" height="38" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="هيكل المحرك: يحمل ملفات العضو الثابت والحديد الثابت، ولا يدور."><rect x="330" y="50" width="12" height="200" fill="#2C4A40"/><rect x="316" y="140" width="16" height="20" fill="#2C4A40"/></g><g data-tip="الحديد الثابت: داخل الكأس ومثبت بهيكل المحرك، لا يدور؛ وظيفته فقط تكملة الدائرة المغناطيسية."><rect x="132" y="116" width="186" height="68" rx="4" fill="#9DB5AC" stroke="#2C4A40" stroke-width="2.5"/><text x="225" y="155" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الحديد الثابت</text></g><g data-tip="الكأس المجرور (الدوار): نحاس أو سبيكة نحاس على شكل كأس مفرغ، يدور في الفجوة بين ملفات الثابت والحديد الثابت."><path d="M310 102H108V198H310" fill="none" stroke="transparent" stroke-width="16"/><path d="M310 102H108V198H310" fill="none" stroke="#E9B949" stroke-width="8" stroke-linejoin="miter"/><path d="M310 102H108V198H310" fill="none" stroke="#B9852A" stroke-width="1.5"/></g><g data-tip="المحور: محور واحد على أحد جانبي الكأس، يدور معه ويحمل الحمل."><rect x="28" y="142" width="80" height="16" rx="3" fill="#2C4A40"/><path d="M60 128A10 24 0 1 0 60 172" fill="none" stroke="#12855A" stroke-width="3"/><polygon points="60,178 52,168 66,166" fill="#12855A"/></g><text x="74" y="98" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الكأس الدوار</text><path d="M86 104L106 116" stroke="#2C4A40" stroke-width="1.5"/><text x="64" y="200" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المحور</text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">يدور الكأس والمحور فقط</text></svg>`,
   cap:'فكرة الشكل (٣-٤) ص 48: الكأس الأصفر يدور بين ملفات الثابت والحديد الثابت.<br><b>مرّر المؤشر على الملفات والكأس والحديد والمحور (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>أحد أشكال محركات التحكم للتيار المتردد، ويستخدم في بعض تطبيقات التحكم ذات القدرات الصغيرة جداً لأن هذه المحركات يكون <b>قصورها الذاتي ضعيفاً جداً</b>.</p>`,ref:'ص 48'},
    {predict:{q:'في هذا المحرك، أي جزء من الأجزاء التالية لا يدور؟',opts:[
     ['الكأس النحاسي',false,'الكأس هو العضو الدوار نفسه.'],
     ['الحديد الذي داخل الكأس',true,'الحديد مثبت بهيكل المحرك، ووظيفته فقط تكملة الدائرة المغناطيسية (ص 48).'],
     ['المحور',false,'المحور متصل بالكأس ويدور معه.']]}}
   ],
   body:[
    {book:String.raw`<p>في هذه المحركات يكون العضو الثابت يشبه تماماً العضو الثابت في المحركات الأخرى، العضو الدوار يتكون من <b>النحاس أو سبيكة من النحاس على شكل كأس (كوب) مفرغ</b> ذي محور واحد على أحد جانبيه، الدائرة المغناطيسية تكتمل بواسطة <b>حديد داخل الكأس ومثبت بهيكل المحرك</b>.</p>`,ref:'ص 48'},
    {tip:String.raw`<p>في الدوار العادي يدور الحديد كله مع الموصلات، فيكون ثقيلاً وقصوره الذاتي كبيراً. في الكأس المجرور يدور <b>جدار نحاسي رقيق فقط</b>، والحديد واقف في مكانه، فيصير الجزء الدوار خفيفاً جداً ويستجيب بسرعة.</p>`,title:'أين السر؟'},
    {add:String.raw`<p>كلمة «المجرور» وصف لطريقة الدوران: المجال الدوار يحث تيارات في جدار الكأس النحاسي، فيُسحب (يُجَر) الكأس مع المجال كما يُسحب القفص السنجابي في أي محرك حثي.</p>`,title:'لماذا «مجرور»؟'},
    {title:'مختبر مصغّر: يدور أم ثابت؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل جزء من محرك الكأس المجرور اضغط: هل يدور مع المحور أم يبقى ثابتاً؟',cats:['يدور','ثابت لا يدور'],items:[
 ['الكأس المفرغ من النحاس أو سبيكته',0,'الكأس هو العضو الدوار نفسه (ص 48).'],
 ['ملفات العضو الثابت',1,'العضو الثابت «يشبه تماماً العضو الثابت في المحركات الأخرى»، وملفاته تصنع المجال الدوار (ص 48).'],
 ['الحديد الذي داخل الكأس',1,'«حديد داخل الكأس ومثبت بهيكل المحرك» يكمل الدائرة المغناطيسية فقط (ص 48). لهذا يكون الجزء الدوار خفيفاً جداً.'],
 ['المحور',0,'الكأس «ذي محور واحد على أحد جانبيه»، والمحور يدور معه (ص 48).']]})}
   ]},

  {st:2,short:'لماذا هو مميز؟',title:'الكأس: قفص سنجابي بلا أسنان',ref:'ص 48',
   q:'ما الذي نكسبه حين نزيل الأسنان من الدوار ونترك الحديد واقفاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقارنة مقطعين: دوار قفص عادي بأسنان أمام أسنان الثابت، ودوار الكأس الأملس حول حديد ثابت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#DDEFE6"/><g data-tip="العضو الثابت وأسنانه: متشابه في المحركين."><circle cx="95" cy="140" r="78" fill="#2C4A40"/><circle cx="265" cy="140" r="78" fill="#2C4A40"/><circle cx="95" cy="140" r="66" fill="#FBF6EE"/><circle cx="265" cy="140" r="66" fill="#FBF6EE"/><g fill="#2C4A40"><rect x="90" y="72" width="10" height="7" transform="rotate(0 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(30 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(60 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(90 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(120 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(150 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(180 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(210 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(240 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(270 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(300 95 140)"/><rect x="90" y="72" width="10" height="7" transform="rotate(330 95 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(0 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(30 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(60 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(90 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(120 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(150 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(180 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(210 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(240 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(270 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(300 265 140)"/><rect x="260" y="72" width="10" height="7" transform="rotate(330 265 140)"/></g></g><g data-tip="دوار قفص عادي: حديد يدور كله، وبين مجاري القضبان أسنان. تقابل أسنانه مع أسنان الثابت يسبب «العضة» (الفرملة) المغناطيسية."><circle cx="95" cy="140" r="56" fill="#7F9A90" stroke="#2C4A40" stroke-width="2"/><g fill="#E9B949" stroke="#B9852A" stroke-width="1.2"><circle cx="95" cy="94" r="6" transform="rotate(0 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(30 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(60 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(90 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(120 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(150 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(180 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(210 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(240 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(270 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(300 95 140)"/><circle cx="95" cy="94" r="6" transform="rotate(330 95 140)"/></g><circle cx="95" cy="140" r="9" fill="#2C4A40"/></g><g data-tip="الكأس: القفص السنجابي صار أسطوانة نحاسية مكتملة رقيقة بلا أسنان ولا مجاري، فلا توجد عضة مغناطيسية."><circle cx="265" cy="140" r="56" fill="none" stroke="transparent" stroke-width="14"/><circle cx="265" cy="140" r="56" fill="none" stroke="#E9B949" stroke-width="6"/></g><g data-tip="الحديد الثابت داخل الكأس: لا يدور، ووظيفته فقط تكملة الدائرة المغناطيسية."><circle cx="265" cy="140" r="49" fill="#9DB5AC" stroke="#2C4A40" stroke-width="2"/><text x="265" y="145" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">لا يدور</text></g><text x="95" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">دوار قفص عادي</text><text x="265" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الكأس المجرور</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">بلا أسنان على الدوار، بلا عضة مغناطيسية</text></svg>`,
   cap:'مقطعان عرضيان للمقارنة (رسم توضيحي): يميناً الكأس الرقيق حول حديد ثابت، ويساراً دوار قفص عادي بأسنان.<br><b>مرّر المؤشر على أجزاء المقطعين (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {book:String.raw`<p>يمكن وصف تركيب الدوار ذي الكأس، على أنه حالة خاصة من الدوار ذي القفص السنجابي، حيث <b>أزيلت الأسنان</b> وأصبح القفص السنجابي على شكل <b>أسطوانة مكتملة</b>، وأصبح القلب الحديدي للعضو الدوار ثابتاً، ووظيفته هي فقط لتكملة الدائرة المغناطيسية.</p>`,ref:'ص 48'}
   ],
   body:[
    {book:String.raw`<p>يمتاز هذا النوع من المحركات بخلوه من المجاري والأسنان، وهذا بدوره يؤدي إلى خلو المحرك تماماً من <b>الفرملة (العضة) المغناطيسية</b>، التي تحدث بين أسنان العضو الثابت وأسنان الدوار.</p>
     <p>يمكن التحكم في سرعة هذا المحرك عن طريق تغيير الجهد على ملفات العضو الثابت.</p>`,ref:'ص 48'},
    {tip:String.raw`<p>«العضة المغناطيسية» هي ميل الدوار ذي الأسنان إلى التوقف في مواضع معينة تتقابل فيها أسنانه مع أسنان الثابت؛ تشعر بها كاهتزاز في السرعة عند السرعات المنخفضة. الكأس أملس تماماً، فلا توجد مواضع مفضلة، ويدور بنعومة حتى عند السرعة البطيئة جداً.</p>`,title:'ما العضة المغناطيسية؟'},
    {title:'تابع السلسلة خطوة خطوة',widget:(el,B)=>{
      const S=['أزيلت الأسنان من الدوار','صار القفص أسطوانة نحاسية مكتملة (كأس)','الحديد لا يدور، يدور جدار رقيق فقط','قصور ذاتي ضعيف جداً','استجابة سريعة، وبلا عضة مغناطيسية'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «ابدأ» وتابع كيف يقود كل تغيير في التصميم إلى الذي بعده.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>ابدأ</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {predict:{q:'لماذا يخلو محرك الكأس المجرور تماماً من العضة المغناطيسية؟',opts:[
     ['لأن العضو الثابت فيه بلا أسنان',false,'العضو الثابت يشبه تماماً الثابت في المحركات الأخرى، أي له أسنان.'],
     ['لأن جهد ملفات الثابت فيه منخفض',false,'العضة سببها شكل الحديد، لا قيمة الجهد.'],
     ['لأن الدوار (الكأس) خالٍ من المجاري والأسنان',true,'العضة تحدث بين أسنان الثابت وأسنان الدوار، والكأس لا أسنان له (ص 48).']]}},
    {watch:String.raw`<p>تُتحكم سرعة هذا المحرك بتغيير الجهد على <b>ملفات العضو الثابت</b>؛ فالكأس نفسه لا تصله أي أسلاك.</p>`},
    {title:'تحقق سريع: الكأس بلا أسنان',widget:(el,B)=>DCML.tf(el,B,{intro:'اضغط «صح» أو «خطأ» لكل عبارة.',items:[
 ['العضة المغناطيسية تحدث بين أسنان العضو الثابت وأسنان الدوار.',true,'هذا نص الكتاب ص 48.'],
 ['القلب الحديدي في محرك الكأس المجرور يدور مع الكأس.',false,'«وأصبح القلب الحديدي للعضو الدوار ثابتاً، ووظيفته هي فقط لتكملة الدائرة المغناطيسية» (ص 48).'],
 ['دوار هذا المحرك خالٍ من المجاري والأسنان، فالمحرك خالٍ تماماً من العضة المغناطيسية.',true,'«يمتاز هذا النوع من المحركات بخلوه من المجاري والأسنان، وهذا بدوره يؤدي إلى خلو المحرك تماماً من الفرملة (العضة) المغناطيسية» (ص 48).'],
 ['نتحكم في سرعة هذا المحرك بتوصيل جهد إلى الكأس عبر فرش.',false,'«يمكن التحكم في سرعة هذا المحرك عن طريق تغيير الجهد على ملفات العضو الثابت» (ص 48)؛ الكأس لا تصله أي أسلاك.']]})}
   ]},

  {recap:[
   String.raw`محرك الكأس المجرور أحد أشكال محركات التحكم للتيار المتردد، للقدرات الصغيرة جداً، وقصوره الذاتي ضعيف جداً (ص 48).`,
   String.raw`عضوه الثابت كالمحركات الأخرى، ودواره كأس مفرغ من النحاس أو سبيكته بمحور على جانب واحد، والحديد داخل الكأس ثابت يكمل الدائرة المغناطيسية (الشكل (٣-٤)).`,
   String.raw`الكأس قفص سنجابي أزيلت أسنانه، فلا مجاري ولا أسنان، ولا عضة (فرملة) مغناطيسية.`,
   String.raw`تُتحكم سرعته بتغيير الجهد على ملفات العضو الثابت.`]}
],
 theory:[
  {h:'٣-١-٣ محركات التحكم ذات الكأس المجرور (Drag-Cup Servo-Motors)',ref:'ص 48',html:`<p>«أحد أشكال محركات التحكم للتيار المتردد، ويستخدم في بعض تطبيقات التحكم ذات القدرات الصغيرة جداً لأن هذه المحركات يكون <b>قصورها الذاتي ضعيفاً جداً</b>.»</p>
   <p>«في هذه المحركات يكون العضو الثابت يشبه تماماً العضو الثابت في المحركات الأخرى، العضو الدوار يتكون من <b>النحاس أو سبيكة من النحاس على شكل كأس (كوب) مفرغ</b> ذي محور واحد على أحد جانبيه، الدائرة المغناطيسية تكتمل بواسطة <b>حديد داخل الكأس ومثبت بهيكل المحرك</b>.»</p>`},
  {fig:'(٣-٤)',ref:'ص 48',caption:'تركيب المحرك ذي الكأس المجرور: ملفات الثابت، والكأس الدوار، والحديد الثابت داخله (إعادة رسم)',draw:()=>box(fig34SVG(''),560)},
  {html:`<p>«يمكن وصف تركيب الدوار ذي الكأس، على أنه حالة خاصة من الدوار ذي القفص السنجابي، حيث <b>أزيلت الأسنان</b> وأصبح القفص السنجابي على شكل <b>أسطوانة مكتملة</b>، وأصبح القلب الحديدي للعضو الدوار ثابتاً، ووظيفته هي فقط لتكملة الدائرة المغناطيسية.»</p>
   <p>«يمتاز هذا النوع من المحركات بخلوه من المجاري والأسنان، وهذا بدوره يؤدي إلى خلو المحرك تماماً من <b>الفرملة (العضة) المغناطيسية</b>، التي تحدث بين أسنان العضو الثابت وأسنان الدوار.»</p>
   <p>«يمكن التحكم في سرعة هذا المحرك عن طريق تغيير الجهد على ملفات العضو الثابت.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في الدوار العادي يدور الحديد كله مع الموصلات، فيكون ثقيلاً وقصوره الذاتي كبيراً. في الكأس المجرور يدور <b>جدار نحاسي رقيق فقط</b>، والحديد واقف في مكانه، فيصير الجزء الدوار خفيفاً جداً ويستجيب بسرعة. و«العضة المغناطيسية» هي ميل الدوار ذي الأسنان إلى التوقف في مواضع معينة تتقابل فيها أسنانه مع أسنان الثابت؛ تشعر بها كاهتزاز في السرعة عند السرعات المنخفضة.'},
  {widget:(el)=>{let hi='';const P={stator:'ملفات العضو الثابت: مثل الثابت في المحركات الأخرى تماماً.',cup:'الكأس الدوار: نحاس أو سبيكة نحاس على شكل كأس مفرغ، له محور واحد على أحد جانبيه.',iron:'الحديد الثابت: داخل الكأس ومثبت بهيكل المحرك، وظيفته فقط تكملة الدائرة المغناطيسية.',shaft:'المحور: يخرج من جانب واحد من الكأس ويحمل الحمل.'};
    const draw=()=>{el.innerHTML=`<div class="fig"><div class="sub">اضغط على جزء لإبرازه:</div>${segHTML('hp',[['','الكل'],['stator','الثابت'],['cup','الكأس'],['iron','الحديد الثابت'],['shaft','المحور']],hi)}<div class="svgbox" style="max-width:560px;margin-inline:auto">${fig34SVG(hi)}</div><p class="sub">${hi?P[hi]:'الكأس يدور في الفجوة بين ملفات الثابت والحديد الثابت.'}</p></div>`;
      el.querySelectorAll('[data-hp]').forEach(b=>b.onclick=()=>{hi=b.dataset.hp;draw()})};draw()}}
 ],
 lab:(el)=>{
  let V=0.6,d=0,t=0,ht=0,hist=[];const R={cup:{w:0,th:0,t0:null,tau:null},cage:{w:0,th:0,t0:null,tau:null}};const flags={};
  el.innerHTML=`<div id="u3l3tp"></div><div class="grid">
   <div class="panel c12"><h2>سباق الاستجابة: الكأس المجرور ضد الدوار العادي <small>مبني على الشكل (٣-٤) ونص ص 48</small></h2>
    <div class="wrap-in" style="align-items:flex-end">${slHTML('v','جهد ملفات الثابت (يتحكم في السرعة)',0,100,5,60)}
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" id="go">▶ تشغيل</button><button class="btn" id="rv">⇄ عكس الاتجاه</button><button class="btn" id="st">■ إيقاف</button></div></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:10px">
     <div style="text-align:center"><b>الكأس المجرور</b><div class="svgbox" style="max-width:180px;margin-inline:auto">${endCupSVG('u3cup')}</div><div class="facts">${fact('السرعة','sCup')}${fact('زمن الوصول إلى 63 %','tCup')}</div></div>
     <div style="text-align:center"><b>دوار قفص عادي بأسنان</b><div class="svgbox" style="max-width:180px;margin-inline:auto">${endCageSVG('u3cage')}</div><div class="facts">${fact('السرعة','sCage')}${fact('زمن الوصول إلى 63 %','tCage')}</div></div>
    </div><div id="msg"></div></div>
   <div class="panel c12"><h2>السرعة مع الزمن <small>آخر 8 ثوانٍ</small></h2><div class="svgbox" id="ch"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>الكأس المجرور</span><span><i style="background:var(--live)"></i>الدوار العادي</span></div>
    <p class="sub"><b id="u3l3w">أرقام توضيحية</b>: ثابت زمن التسارع للكأس <span class="ltr" id="u3l3a"></span> s وللدوار العادي <span class="ltr" id="u3l3b"></span> s، وأضفنا للدوار العادي عزماً صغيراً متذبذباً قدره <span class="ltr" id="u3l3c"></span> % يمثل العضة المغناطيسية بين الأسنان، واحتكاكاً قدره <span class="ltr" id="u3l3f"></span> % للاثنين (نسبةً إلى عزم المحرك عند الجهد الكامل). لذلك يختلف «زمن الوصول إلى 63 %» المقاس قليلاً عن ثابت الزمن نفسه، خصوصاً في الدوار العادي. الكتاب يذكر الفكرة فقط ولا يعطي أرقاماً.</p>${tryBox('try')}</div></div>`;
  const TP=B.params(q(el,'#u3l3tp'),'u3-l3',[
   {k:'Jc',label:'ثابت زمن التسارع للكأس المجرور (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.15,min:0.02,max:20,step:0.01},
   {k:'Jg',label:'ثابت زمن التسارع للدوار العادي (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.6,min:0.02,max:20,step:0.01},
   {k:'TC',label:'عزم العضة المغناطيسية في الدوار العادي (نسبة من عزم المحرك عند الجهد الكامل)',unit:'%',value:7,min:0,max:50,step:0.5},
   {k:'fr',label:'عزم الاحتكاك (نسبة من عزم المحرك عند الجهد الكامل)',unit:'%',value:1,min:0,max:20,step:0.5}],()=>{tpLbl();tl.redraw()});
  const TC=()=>TP.v.TC/100,FR=()=>TP.v.fr/100;
  /* حدود خطوتي «سرعة منخفضة» و«جهد صغير جداً» من القيم الحالية (المنزلق بخطوة 5 %): بالقيم التوضيحية 10–20 % و 5 % */
  const lowR=()=>{const lo=Math.max(5,Math.ceil((TP.v.TC+TP.v.fr)/5-1e-9)*5);return [lo,lo+10]},stuckV=()=>Math.floor(TP.v.TC/5+1e-9)*5;
  const tpLbl=()=>{q(el,'#u3l3w').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية';q(el,'#u3l3a').textContent=B.fmtN(TP.v.Jc);q(el,'#u3l3b').textContent=B.fmtN(TP.v.Jg);q(el,'#u3l3c').textContent=B.fmtN(TP.v.TC);q(el,'#u3l3f').textContent=B.fmtN(TP.v.fr)};
  const tl=tryList(q(el,'#try'),[
   {t:'شغّل الاثنين معاً',get x(){return TP.v.Jc<TP.v.Jg?'اضغط «تشغيل»: الكأس المجرور يصل إلى سرعته أسرع'+(TP.v.Jg>=2*TP.v.Jc?' بكثير':'')+' لأن قصوره الذاتي أضعف (ثابت زمن تسارعه أصغر).':TP.v.Jc>TP.v.Jg?'اضغط «تشغيل»: بقيم المدرب هذه جعلت الكأس المجرور أثقل، فيصل <b>الدوار العادي</b> إلى سرعته أولاً. في الواقع الكأس المجرور أخف بكثير، لذلك يكون عادة هو الأسرع.':'اضغط «تشغيل»: بقيم المدرب هذه للكأس والدوار العادي ثابت زمن التسارع نفسه، فالفرق بينهما يأتي من العضة المغناطيسية والاحتكاك فقط. في الواقع الكأس المجرور أخف بكثير فيكون أسرع.'},done:()=>R.cup.tau&&R.cage.tau},
   {t:'اعكس الاتجاه',x:'اضغط «عكس الاتجاه» وقارن: الكأس يعكس حركته قبل الدوار العادي بوقت واضح.',done:()=>flags.rev&&R.cup.w<-0.3},
   {t:'سرعة منخفضة',get x(){const [a,b]=lowR();return `خفّض الجهد إلى ${a}–${b} %: لاحظ اهتزاز سرعة الدوار العادي (العضة المغناطيسية) بينما يدور الكأس بنعومة.`},done:()=>{const b=lowR()[1];return d!==0&&V<=b/100&&V>TC()+FR()&&Math.abs(R.cup.w)>0.05}},
   {t:'جهد صغير جداً',get x(){const v=stuckV();return v>=5?`اجعل الجهد ${v} %: الدوار العادي قد يعلق بين الأسنان ولا يدور، أما الكأس فيدور ببطء.`:'عزم العضة بالقيم الحالية أصغر من 5 %، فلن يعلق الدوار العادي عند أي جهد على المنزلق (أصغر خطوة 5 %). ارفع عزم العضة لترى التعلق.'},done:()=>{const v=stuckV();return v>=5&&d!==0&&V<=v/100+0.01&&V>0&&Math.abs(R.cage.w)<0.01&&Math.abs(R.cup.w)>0.02}},
   {t:'التحكم بالجهد',x:'غيّر الجهد أثناء الدوران: سرعة الكأس تتبع الجهد (الكتاب: التحكم في السرعة بتغيير جهد ملفات الثابت).',done:()=>flags.vchg&&d!==0}]);
  tpLbl();
  const vs=q(el,'#v');const sv=()=>{q(el,'#v-v').textContent=Math.round(V*100)+' %'};sv();
  vs.addEventListener('input',()=>{V=+vs.value/100;if(d)flags.vchg=1;sv()});
  const step=nd=>{d=nd;['cup','cage'].forEach(k=>{R[k].t0=t;R[k].tau=null;R[k].w0=R[k].w})};
  q(el,'#go').addEventListener('click',()=>step(d||1));q(el,'#rv').addEventListener('click',()=>{flags.rev=1;step(d?-d:-1)});q(el,'#st').addEventListener('click',()=>step(0));
  loopOn(el,dt=>{t+=dt;const n=6,h=dt/n;
   const tc=TC(),fr=FR();
   ['cup','cage'].forEach(k=>{const r=R[k],J=k==='cup'?TP.v.Jc:TP.v.Jg;for(let i=0;i<n;i++){let T=d*V-r.w;if(k==='cage')T-=tc*Math.sin(12*r.th);
     let a=T-fr*Math.sign(r.w);if(Math.abs(r.w)<0.004&&Math.abs(T)<=fr){r.w=0;a=0}r.w+=a/J*h;r.th+=r.w*h*2*Math.PI*0.6}
     if(r.t0!=null&&r.tau==null&&d!==0){const tgt=d*V,frac=(r.w-r.w0)/(tgt-r.w0||1e-9);if(Math.abs(tgt-r.w0)>0.05&&frac>=0.632)r.tau=t-r.t0}
     const g=q(el,'#u3'+k);if(g)g.setAttribute('transform',`rotate(${((r.th*180/Math.PI)%360).toFixed(1)} 90 90)`);});
   ht+=dt;if(ht>0.05){ht=0;hist.push([t,R.cup.w*100,R.cage.w*100]);while(hist.length&&hist[0][0]<t-8)hist.shift();
     q(el,'#ch').innerHTML=plot({W:760,H:240,x:[t-8,t],y:[-110,110],yt:[-100,-50,0,50,100],xt:[],ax0:false,xl:'t →',yl:'speed %',lines:[{pts:hist.map(p=>[p[0],p[2]]),col:'--live'},{pts:hist.map(p=>[p[0],p[1]]),col:'--blue'}],aria:'السرعة مع الزمن للدوارين'});
     q(el,'#sCup').textContent=Math.round(R.cup.w*100)+' %';q(el,'#sCage').textContent=Math.round(R.cage.w*100)+' %';
     q(el,'#tCup').textContent=R.cup.tau!=null?R.cup.tau.toFixed(2)+' s':'—';q(el,'#tCage').textContent=R.cage.tau!=null?R.cage.tau.toFixed(2)+' s':'—';
     q(el,'#msg').innerHTML=d!==0&&V>0&&V<=tc&&Math.abs(R.cage.w)<0.01?'<div class="callout err">الدوار العادي عالق: عزم المحرك عند هذا الجهد أصغر من «العضة» بين أسنانه. الكأس المجرور لا أسنان له فيدور. (توضيح)</div>':''}
   tl.check()});
 },
 quiz:[
  {q:'مم يتكون العضو الدوار في محرك الكأس المجرور؟',o:['حديد مصفح بأسنان','نحاس أو سبيكة نحاس على شكل كأس مفرغ','مغناطيس دائم','ملفات مع مبدل'],c:1,e:'ص 48 كما في النص.'},
  {q:'كيف تكتمل الدائرة المغناطيسية في هذا المحرك؟',o:['بالكأس نفسه','بحديد داخل الكأس مثبت بهيكل المحرك','بالمحور','لا تكتمل'],c:1,e:'ص 48: الدائرة المغناطيسية تكتمل بواسطة حديد داخل الكأس ومثبت بهيكل المحرك.'},
  {q:'لماذا يستخدم محرك الكأس المجرور في تطبيقات القدرات الصغيرة جداً؟',o:['لأن قصوره الذاتي ضعيف جداً','لأن عزمه كبير جداً','لأنه رخيص','لأنه لا يحتاج جهداً'],c:0,e:'ص 48: لأن هذه المحركات يكون قصورها الذاتي ضعيفاً جداً.'},
  {q:'الدوار ذو الكأس حالة خاصة من الدوار:',o:['ذي القطب البارز','ذي القفص السنجابي أزيلت أسنانه','ذي الحلقات المنزلقة','ذي المغناطيس الدائم'],c:1,e:'ص 48: أزيلت الأسنان وأصبح القفص السنجابي أسطوانة مكتملة، وأصبح القلب الحديدي ثابتاً.'},
  {q:'ما الذي يجعل محرك الكأس خالياً تماماً من العضة المغناطيسية؟',o:['المكثف','خلوه من المجاري والأسنان','صغر الجهد','المحور الواحد'],c:1,e:'ص 48: العضة تحدث بين أسنان الثابت وأسنان الدوار، والكأس بلا مجار ولا أسنان.'},
  {q:'كيف نتحكم في سرعة محرك الكأس المجرور حسب الكتاب؟',o:['بتغيير عدد الأقطاب','بتغيير الجهد على ملفات العضو الثابت','بتغيير قطر الكأس','بتغيير التردد فقط'],c:1,e:'ص 48 كما في النص.'},
  {q:'ما وظيفة القلب الحديدي داخل الكأس؟',o:['يدور مع الكأس','تكملة الدائرة المغناطيسية فقط','يحمل الفرش','يبرد الملفات'],c:1,e:'ص 48: وظيفته هي فقط لتكملة الدائرة المغناطيسية، وهو ثابت.'}
 ]
});

/* =====================================================================
   Lesson 3.4 — servo terms, time response, example (٣-١)
   ===================================================================== */
const FIG36={110:{T:1.0,w:300},95:{T:0.75,w:225},70:{T:0.5,w:150}};
const KV=0.75/95,KW=0.75/225; // from the 95 V line (example ٣-١)
const eqLine=v=>({T:KV*v,w:KV*v/KW});
function fig35SVG(){const tau=1,f=t=>1-Math.exp(-t/tau);
  return plot({W:520,H:280,x:[0,5],y:[0,1.15],xt:[[1,'τ']],yt:[[0.632,'0.632ωo'],[1,'ωo']],xl:'Time (sec.)',yl:'Speed (rad/sec.)',ml:76,
    lines:[{pts:[[0,0],[1,1]],col:'--muted',w:1.6,dash:'5 4'},{pts:fn2pts(f,0,5),col:'--fg',w:2.6}],hl:[{y:1,col:'--muted'},{y:0.632,col:'--muted'}],vl:[{x:1,col:'--muted'}],dots:[{x:1,y:0.632,col:'--blue',r:5}],aria:'منحنى السرعة مع الزمن'})}
function fig36SVG(mode){
  const L=[];[110,95,70].forEach(v=>{const fg=FIG36[v],eq=eqLine(v);
    if(mode!=='eq')L.push({pts:[[0,fg.T],[fg.w,0]],col:'--fg',w:2.4});
    if(mode!=='fig')L.push({pts:[[0,eq.T],[eq.w,0]],col:'--blue',w:2.4,dash:mode==='both'?'7 5':''})});
  const lab=[110,95,70].map(v=>{const fg=FIG36[v],eq=eqLine(v);const p=mode==='eq'?eq:fg;return {x:p.w*0.5,y:p.T*0.5,s:'Va = '+v+' V',dx:8,dy:-6,a:'start',c:'b'}});
  return plot({W:520,H:290,x:[0,330],y:[0,1.1],xt:[150,225,300],yt:[[0.5,'0.5'],[0.75,'0.75'],[1,'1.0']],xl:'Speed (rad/sec.)',yl:'Torque (Nm)',lines:L,labels:lab,aria:'الشكل ٣-٦'})}

/* worked-example solver shared with the questions lesson */
function servoSolve(o,B,dp){ // o:{Tst,w0,J,Va?,t?}  dp:{kv,kw}
  const out=[],Tst=o.Tst,w0=o.w0,J=o.J;
  if(o.Va!=null){const kv=B.round(Tst/o.Va,dp.kv);out.push({t:'(أ) عند \u202Bω = 0\u202C يكون العزم هو عزم البدء: T = 0.75 = K<sub>v</sub> · V<sub>a</sub>'.replace('0.75',String(Tst)),f:`K_v=\\frac{T_{st}}{V_a}=\\frac{${Tst}}{${o.Va}}`,v:kv,dp:dp.kv});o.kv=kv}
  const kw=B.round(Tst/w0,dp.kw);out.push({t:'وعند T = 0 تكون السرعة سرعة اللاحمل: 0 = −K<sub>ω</sub> × ω<sub>o</sub> + T<sub>st</sub> ، و K<sub>ω</sub> هو ميل خط العزم والسرعة',f:`K_\\omega=\\frac{T_{st}}{\\omega_o}=\\frac{${Tst}}{${w0}}`,v:kw,dp:dp.kw});
  out.push({t:'المعادلة التي تصف منحنى الخواص:',f:(o.Va!=null?`T=-${kw}\\,\\omega+${o.kv}\\,V_a\\\\`:'')+`T=-${kw}\\,\\omega+${Tst}\\ \\ \\text{N.m}`});
  const al=Tst/J;out.push({t:'(ب) التسارع عند بدء الحركة — المعادلة (٣-٣):',f:`\\alpha=\\frac{T_{st}}{J}=\\frac{${Tst}}{${J}}`,v:B.round(al,2),unit:'rad/sec²',dp:al%1?2:0});
  out.push({t:'(ج) سرعة اللاحمل:',f:`\\omega_o=${w0}`,v:w0,unit:'rad/sec',dp:w0%1?2:0});
  const tau=J*w0/Tst;out.push({t:'(د) ثابت الزمن الميكانيكي — المعادلة (٣-٤):',f:`\\tau=\\frac{J\\times\\omega_o}{T_{st}}=\\frac{${J}\\times${w0}}{${Tst}}`,v:B.round(tau,2),unit:'sec',dp:B.round(tau,2)%1?2:0});
  const tr=1.7*B.round(tau,2);out.push({t:'(هـ) زمن عكس الحركة:',f:`\\tau_r=1.7\\times\\tau=1.7\\times${B.round(tau,2)}`,v:B.round(tr,2),unit:'sec',dp:B.round(tr,2)%1?(B.round(tr,1)===B.round(tr,2)?1:2):0});
  const inv=B.round(1/tau,2);out.push({t:'(و) معادلة السرعة مع الزمن — المعادلة (٣-٥):',f:`\\omega=\\omega_o\\left(1-e^{-t/\\tau}\\right)=${w0}\\left(1-e^{-t/${B.round(tau,2)}}\\right)=${w0}\\left(1-e^{-${inv}t}\\right)\\ \\text{rad/sec}`,final:true});
  return {out,tau,kw,al};
}

B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'49–51',
 title:'مصطلحات محركات التحكم والاستجابة الزمنية — مثال (٣-١)',
 summary:'سرعة اللاحمل، وعزم البدء، والقصور الذاتي، والتسارع، وثابت الزمن الميكانيكي، وزمن عكس الحركة، ومعادلة السرعة مع الزمن، ثم حل المثال (٣-١).',
 stations:[
  {intro:true},

  {st:1,short:'أربعة مصطلحات',title:'بعض المصطلحات المستخدمة لمحركات التحكم',ref:'ص 49',
   q:'لكي نقارن محركي تحكم ونعرف أيهما أسرع استجابة، ما الأرقام التي نحتاج أن نقرأها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خط العزم والسرعة عليه عزم بدء الحركة وسرعة اللاحمل، وحدافة تمثل القصور الذاتي، وعلاقة التسارع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="185" cy="155" r="140" fill="#FBE6C4"/><path d="M62 230H330" stroke="#2C4A40" stroke-width="2.5"/><polygon points="338,230 326,224 326,236" fill="#2C4A40"/><path d="M62 230V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="84" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العزم</text><text x="318" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><path d="M62 80L290 230" stroke="#2C4A40" stroke-width="3.5"/><g data-tip="عزم بدء الحركة ⟦Tst⟧: العزم المتولد عند بدء الحركة (السرعة صفر)، وهو أقصى عزم للمحرك، ووحداته نيوتن.متر ⟦N.m⟧."><circle cx="62" cy="80" r="9" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="78" y="74" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="10" dy="4">st</tspan></text></g><g data-tip="سرعة اللاحمل ⟦ωo⟧: السرعة التي يدور بها المحرك بدون أحمال (العزم صفر)، ووحداتها راديان/ثانية ⟦rad/s⟧."><circle cx="290" cy="230" r="9" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="290" y="254" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ω<tspan font-size="10" dy="4">o</tspan></text></g><g data-tip="القصور الذاتي ⟦J⟧ (أو عزم الحدافة)، ووحداته كيلوجرام.متر² ⟦kg.m²⟧. كلما كبر صعُب تغيير سرعة الدوار."><circle cx="250" cy="104" r="36" fill="#FBF6EE" stroke="#2C4A40" stroke-width="9"/><path d="M250 72V136M218 104H282M227 81L273 127M273 81L227 127" stroke="#2C4A40" stroke-width="3"/><circle cx="250" cy="104" r="9" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="164" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">J</text></g><g data-tip="التسارع عند بدء الحركة ⟦α⟧ = عزم البدء ÷ القصور الذاتي، المعادلة (٣-٣)، ووحداته راديان/ثانية² ⟦rad/s²⟧."><rect x="110" y="270" width="140" height="34" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="292" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">α = T<tspan font-size="10" dy="4">st</tspan><tspan dy="-4"> / J</tspan></text></g></svg>`,
   cap:'المصطلحات الأربعة الأولى: طرفا خط العزم والسرعة، والقصور الذاتي، والتسارع.<br><b>مرّر المؤشر على النقطتين والحدافة والمربع (أو المسها في الجوال) لتعرف كل مصطلح ووحدته.</b>',
   side:[
    {book:String.raw`<ul>
     <li><b>أ- سرعة اللاحمل (<span class="ltr">ω<sub>o</sub></span>):</b> هي السرعة التي يدور بها المحرك عند تشغيله بدون أحمال، ووحداتها راديان/ثانية.</li>
     <li><b>ب- عزم بدء الحركة (<span class="ltr">T<sub>st</sub></span>):</b> العزم المتولد عند بدء الحركة وهو أقصى عزم للمحرك، ووحداته نيوتن.متر.</li>
     <li><b>ت- القصور الذاتي للمحرك (<span class="ltr">J</span>):</b> (أو عزم الحدافة)، ووحداته كيلوجرام.متر².</li></ul>`,ref:'ص 49'}
   ],
   body:[
    {book:String.raw`<ul><li><b>ث- التسارع (<span class="ltr">\(\alpha\)</span>):</b> يقصد به التسارع عند بدء الحركة، ويحسب من خارج قسمة العزم عند بدء الحركة على القصور الذاتي، ووحداته راديان/ثانية².</li></ul>
     <div class="eq">$$\alpha=\frac{T_{st}}{J}$$<span class="eqno">(٣-٣)</span></div>`,ref:'ص 49'},
    {tip:String.raw`<p>الكميات الأربع تجيب عن أسئلة بسيطة: إلى أي سرعة يصل المحرك وحده؟ <span class="ltr">\((\omega_o)\)</span> بأي قوة يبدأ؟ <span class="ltr">\((T_{st})\)</span> كم هو ثقيل على الدوران؟ <span class="ltr">\((J)\)</span> وبأي سرعة يبدأ في التسارع؟ <span class="ltr">\((\alpha)\)</span>. لاحظ أن عزم البدء وسرعة اللاحمل هما طرفا الخط المستقيم الذي رأيته في الدرس السابق.</p>`,title:'الفكرة'},
    {predict:{q:'محركان لهما عزم البدء نفسه، لكن دوار الأول أخف (قصوره الذاتي أصغر). أيهما تسارعه عند البدء أكبر؟',opts:[
     ['الثاني، لأن دواره أثقل',false,String.raw`القصور الذاتي في المقام في المعادلة (٣-٣)؛ كلما كبر صغر التسارع.`],
     ['الأول، لأن قصوره الذاتي أصغر',true,String.raw`<span class="ltr">\(\alpha = T_{st}/J\)</span>: العزم نفسه مقسوم على <span class="ltr">\(J\)</span> أصغر يعطي تسارعاً أكبر، ولهذا تُصمم محركات التحكم بدوار خفيف.`],
     ['متساويان، لأن عزم البدء واحد',false,String.raw`التسارع لا يعتمد على العزم وحده؛ يعتمد على العزم مقسوماً على <span class="ltr">\(J\)</span>.`]]}},
    {watch:String.raw`<p><span class="ltr">\(\alpha\)</span> هنا هو <b>التسارع</b> (المعادلة (٣-٣))، وليس رمز «يتناسب مع» الذي في المعادلة (٣-١).</p>`},
    {title:'مختبر مصغّر: العزم والقصور الذاتي والتسارع',widget:(el,B)=>DCML.lab(el,B,{intro:'القيمتان في البداية من المثال (٣-١): <span class="ltr">T<sub>st</sub> = 0.75 N.m</span> و <span class="ltr">J = 0.01 kg.m²</span>. حرّك المقبضين (أرقام تختارها أنت) وراقب التسارع عند بدء الحركة، المعادلة (٣-٣).',
 predict:{q:'لو ضاعفنا القصور الذاتي <span class="ltr">J</span> وبقي عزم البدء كما هو، ماذا يحدث للتسارع عند البدء؟',opts:[
  ['يتضاعف',false,'<span class="ltr">J</span> في المقام: كلما كبر صغر التسارع.'],
  ['لا يتغير',false,'التسارع يعتمد على <span class="ltr">J</span> مباشرة في المعادلة (٣-٣).'],
  ['يصير نصفه',true,'<span class="ltr">α = T<sub>st</sub>/J</span>: مضاعفة المقام تنصّف الناتج. لهذا يريد المصمم دواراً خفيفاً.']]},
 ins:[{k:'T',l:'عزم بدء الحركة T<sub>st</sub>',min:0.1,max:1.5,step:0.05,v:0.75,dp:2,u:'N.m'},{k:'J',l:'القصور الذاتي J',min:0.002,max:0.03,step:0.001,v:0.01,dp:3,u:'kg.m²'}],
 calc:(s)=>{const al=s.T/s.J,bk=Math.abs(s.T-0.75)<1e-6&&Math.abs(s.J-0.01)<1e-6;
  return {facts:[['T<sub>st</sub>',DCML.fm(B,s.T,2)+' N.m'],['J',DCML.fm(B,s.J,3)+' kg.m²'],['التسارع α',DCML.fm(B,al,al<100?1:0)+' rad/s²','hi']],
   bars:[{l:'التسارع عند بدء الحركة',v:al,max:750,txt:DCML.fm(B,al,al<100?1:0)+' rad/s²'}],
   msg:bk?'هذه أرقام المثال (٣-١): <span class="ltr">α = 0.75/0.01 = 75 rad/sec²</span> (ص 51).':''}}})}
   ]},

  {st:2,short:'ثابت الزمن الميكانيكي',title:'ثابت الزمن الميكانيكي ومنحنى السرعة مع الزمن',ref:'ص 49–50',
   q:'المحرك لا يصل إلى سرعته النهائية فجأة… فكيف نقيس «كم يتأخر» برقم واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى أسي للسرعة مع الزمن يقترب من سرعة اللاحمل، ويصل إلى 0.632 منها عند ثابت الزمن، والمماس من الأصل يصل إلى سرعة اللاحمل عند ثابت الزمن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#E6E2F8"/><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="86" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><text x="318" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الزمن</text><g data-tip="سرعة اللاحمل ⟦ωo⟧: السرعة النهائية التي يقترب منها المنحنى ولا يتجاوزها."><path d="M62 80H330" stroke="transparent" stroke-width="12"/><path d="M62 80H330" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="6 5"/><text x="56" y="85" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ω<tspan font-size="9" dy="3">o</tspan></text></g><g data-tip="المماس عند بدء الحركة: ميله هو التسارع ⟦α⟧. لو استمرت السرعة تزداد بهذا الميل لوصلت إلى ⟦ωo⟧ بعد زمن ⟦τ⟧ بالضبط."><path d="M62 250L114 80" stroke="transparent" stroke-width="12"/><path d="M62 250L114 80" stroke="#E8735A" stroke-width="2.2" stroke-dasharray="6 4"/></g><g data-tip="منحنى السرعة مع الزمن: يزداد في منحنى أسي، المعادلة (٣-٥)."><path d="M62.0 250.0L68.5 230.0L75.0 212.4L81.5 196.8L88.0 183.1L94.5 171.0L101.0 160.3L107.5 150.9L114.0 142.5L120.5 135.2L127.0 128.7L133.5 123.0L140.0 117.9L146.5 113.5L153.0 109.5L159.5 106.1L166.0 103.0L172.5 100.3L179.0 97.9L185.5 95.8L192.0 94.0L198.5 92.3L205.0 90.9L211.5 89.6L218.0 88.5L224.5 87.5L231.0 86.6L237.5 85.8L244.0 85.1L250.5 84.5L257.0 84.0L263.5 83.5L270.0 83.1L276.5 82.7L283.0 82.4L289.5 82.1L296.0 81.9L302.5 81.7L309.0 81.5L315.5 81.3L322.0 81.1" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 250.0L68.5 230.0L75.0 212.4L81.5 196.8L88.0 183.1L94.5 171.0L101.0 160.3L107.5 150.9L114.0 142.5L120.5 135.2L127.0 128.7L133.5 123.0L140.0 117.9L146.5 113.5L153.0 109.5L159.5 106.1L166.0 103.0L172.5 100.3L179.0 97.9L185.5 95.8L192.0 94.0L198.5 92.3L205.0 90.9L211.5 89.6L218.0 88.5L224.5 87.5L231.0 86.6L237.5 85.8L244.0 85.1L250.5 84.5L257.0 84.0L263.5 83.5L270.0 83.1L276.5 82.7L283.0 82.4L289.5 82.1L296.0 81.9L302.5 81.7L309.0 81.5L315.5 81.3L322.0 81.1" fill="none" stroke="#12855A" stroke-width="4" stroke-linejoin="round"/></g><g data-tip="عند ⟦t = τ⟧ تكون السرعة ⟦0.632 ωo⟧، أي ⟦63.2%⟧ من سرعة اللاحمل. هذا هو تعريف ثابت الزمن الميكانيكي."><path d="M62 142.6H114V250" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="114" cy="142.6" r="7" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="56" y="147" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)">0.632ω<tspan font-size="8" dy="3">o</tspan></text><text x="114" y="270" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">τ</text></g></svg>`,
   cap:'فكرة الشكل (٣-٥) ص 50: الأخضر = السرعة مع الزمن، والبرتقالي المتقطع = المماس عند البدء.<br><b>مرّر المؤشر على المنحنى والمماس والنقطة الصفراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>ج- ثابت الزمن الميكانيكي (<span class="ltr">\(\tau\)</span>):</b> ويعرف بالزمن اللازم للدوار ليتسارع من السكون وحتى تصل سرعته إلى <b><span class="ltr">63.2%</span> من سرعة اللاحمل</b> عند تسليط الجهد الكامل على ملف التحكم، ووحداته بالثانية.</p>`,ref:'ص 49'}
   ],
   body:[
    {book:String.raw`<p>عند حساب هذا الزمن فإنه يفترض أن العزم يتناقص خطياً من أقصى عزم عند سرعة الصفر وحتى سرعة اللاحمل، متسبباً في زيادة السرعة في منحنى أسي مع الزمن، كما في الشكل (٣-٥)، ويحسب ثابت الزمن الميكانيكي من العلاقة:</p>
     <p>ثابت الزمن الميكانيكي = القصور الذاتي × سرعة اللاحمل ÷ عزم بدء الحركة.</p>
     <div class="eq">$$\tau=\frac{J\times\omega_o}{T_{st}}$$<span class="eqno">(٣-٤)</span></div>
     <p>كما يمكن حساب السرعة مع الزمن من المعادلة التالية:</p>
     <div class="eq">$$\omega=\omega_o\left(1-e^{-t/\tau}\right)$$<span class="eqno">(٣-٥)</span></div>`,ref:'ص 49'},
    {predict:{q:String.raw`بعد مرور زمن يساوي <span class="ltr">\(\tau\)</span> من بدء الحركة، كم تكون سرعة المحرك؟`,opts:[
     [String.raw`سرعة اللاحمل كاملة <span class="ltr">\(\omega_o\)</span>`,false,'المنحنى الأسي لا يصل إلى سرعة اللاحمل إلا بعد زمن طويل؛ هو يقترب منها فقط.'],
     [String.raw`نصف سرعة اللاحمل <span class="ltr">\(0.5\,\omega_o\)</span>`,false,String.raw`النصف يتحقق قبل <span class="ltr">\(\tau\)</span> بقليل؛ التعريف في الكتاب رقم آخر.`],
     [String.raw`<span class="ltr">63.2%</span> من سرعة اللاحمل`,true,String.raw`هذا تعريف ثابت الزمن الميكانيكي ص 49، ومن المعادلة (٣-٥): <span class="ltr">\(\omega=\omega_o(1-e^{-1})=0.632\,\omega_o\)</span>.`]]}},
    {title:'اسحب الزمن وشاهد السرعة',widget:(el,B)=>{
      let x=1;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">الزمن هنا بمضاعفات ثابت الزمن \\(\\tau\\)، والسرعة نسبة من سرعة اللاحمل، فالنتيجة تصلح لأي محرك تحكم (المعادلة (٣-٥)).</p>
       <label class="w-sl"><span>الزمن منذ بدء الحركة <span class="ltr">t = <b data-o="x"></b> τ</span></span><input type="range" min="0" max="5" step="0.05" dir="ltr" value="${x}"></label>
       <div class="w-row"><span class="w-l">قيم جاهزة:</span>${[1,2,3,5].map(v=>`<button class="btn" type="button" data-x="${v}"><span class="ltr">t = ${v===1?'':v}τ</span></button>`).join('')}</div>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i><i class="spd-gap"></i></div><div class="spd-ax"><span>0</span><span>ω<sub>o</sub></span></div></div>
       <p class="sub" style="margin-top:4px">الأزرق = السرعة التي وصل إليها المحرك، والأصفر = ما بقي حتى سرعة اللاحمل.</p>
       <div class="w-facts"><div><span>السرعة نسبة من ω<sub>o</sub></span><b data-o="p"></b></div><div><span>الباقي حتى ω<sub>o</sub></span><b data-o="r"></b></div></div>
       <p class="sub" data-o="m" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const f=1-Math.exp(-x);o('x').textContent=(+x.toFixed(2)).toString();o('p').textContent=(f*100).toFixed(1)+' %';o('r').textContent=((1-f)*100).toFixed(1)+' %';
        el.querySelector('.spd-n').style.width=f*100+'%';el.querySelector('.spd-gap').style.width=(1-f)*100+'%';
        o('m').innerHTML=Math.abs(x-1)<0.001?'عند <span class="ltr">t = τ</span> وصلت السرعة إلى <b><span class="ltr">63.2%</span></b> من سرعة اللاحمل: هذا تعريف ثابت الزمن الميكانيكي.':x>=4.99?'حتى بعد <span class="ltr">5τ</span> لم تصل السرعة إلى <span class="ltr">100%</span> تماماً، لكن الفرق صار صغيراً جداً.':''};
      rg.oninput=()=>{x=+rg.value;draw()};
      el.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{x=+b.dataset.x;rg.value=x;draw()});
      draw();B.math(el);
    }},
    {tip:String.raw`<p>من المعادلة (٣-٤): كلما <b>صغر القصور الذاتي</b> <span class="ltr">\(J\)</span> صغر <span class="ltr">\(\tau\)</span>، فيصل المحرك إلى سرعته أسرع. وهذا ما رأيته في أول الوحدة: دوار خفيف صغير القطر يعني استجابة سريعة.</p>`,title:'ماذا يغيّر τ؟'},
    {watch:String.raw`<p>عنوان الشكل (٣-٥) في الكتاب «منحني السرعة مع العزم»، بينما المحور الأفقي في الرسم هو <b>الزمن</b> <span class="ltr">(Time (sec.))</span>، والمنحنى هو <b>السرعة مع الزمن</b> حسب المعادلة (٣-٥).</p>`,fix:true}
   ]},

  {st:3,short:'زمن عكس الحركة',title:'زمن عكس الحركة',ref:'ص 49',
   q:'المحرك يدور بأقصى سرعته في اتجاه، ونريده في الاتجاه المعاكس… كم يستغرق ذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى السرعة عند عكس جهد ملف التحكم: تبدأ من سرعة اللاحمل الموجبة وتتجه إلى سرعة اللاحمل السالبة، وتصل إلى سالب 0.632 منها بعد زمن عكس الحركة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#DDEFE6"/><path d="M62 160H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,160 330,154 330,166" fill="#2C4A40"/><path d="M62 272V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="86" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><text x="318" y="182" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الزمن</text><text x="56" y="165" text-anchor="end" font-size="12" fill="#2C4A40" font-family="var(--mono)">0</text><g data-tip="سرعة اللاحمل في الاتجاه الأول ⟦+ωo⟧ (قبل العكس)."><path d="M62 70H330" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="6 5"/><text x="48" y="75" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">+ω<tspan font-size="8" dy="3">o</tspan></text></g><g data-tip="سرعة اللاحمل في الاتجاه المضاد ⟦−ωo⟧: السرعة النهائية بعد العكس."><path d="M62 250H330" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="6 5"/><text x="56" y="255" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">−ω<tspan font-size="8" dy="3">o</tspan></text></g><g data-tip="لحظة عكس جهد ملف التحكم ⟦180°⟧ والمحرك يدور بسرعة اللاحمل بدون أحمال."><circle cx="62" cy="70" r="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><text x="200" y="58" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">لحظة عكس جهد ملف التحكم</text><path d="M120 54L76 66" stroke="#2C4A40" stroke-width="1.5"/><g data-tip="السرعة بعد العكس: تتباطأ، تمر بالصفر، ثم تتجه إلى سرعة اللاحمل في الاتجاه المضاد."><path d="M62.0 70.0L68.5 87.1L75.0 102.6L81.5 116.7L88.0 129.3L94.5 140.8L101.0 151.2L107.5 160.6L114.0 169.1L120.5 176.8L127.0 183.8L133.5 190.1L140.0 195.8L146.5 200.9L153.0 205.6L159.5 209.8L166.0 213.7L172.5 217.1L179.0 220.2L185.5 223.1L192.0 225.6L198.5 228.0L205.0 230.1L211.5 232.0L218.0 233.7L224.5 235.2L231.0 236.6L237.5 237.9L244.0 239.1L250.5 240.1L257.0 241.0L263.5 241.9L270.0 242.7L276.5 243.4L283.0 244.0L289.5 244.6L296.0 245.1L302.5 245.5L309.0 246.0L315.5 246.4L322.0 246.7" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 70.0L68.5 87.1L75.0 102.6L81.5 116.7L88.0 129.3L94.5 140.8L101.0 151.2L107.5 160.6L114.0 169.1L120.5 176.8L127.0 183.8L133.5 190.1L140.0 195.8L146.5 200.9L153.0 205.6L159.5 209.8L166.0 213.7L172.5 217.1L179.0 220.2L185.5 223.1L192.0 225.6L198.5 228.0L205.0 230.1L211.5 232.0L218.0 233.7L224.5 235.2L231.0 236.6L237.5 237.9L244.0 239.1L250.5 240.1L257.0 241.0L263.5 241.9L270.0 242.7L276.5 243.4L283.0 244.0L289.5 244.6L296.0 245.1L302.5 245.5L309.0 246.0L315.5 246.4L322.0 246.7" fill="none" stroke="#12855A" stroke-width="4" stroke-linejoin="round"/></g><g data-tip="زمن عكس الحركة ⟦τr⟧: الزمن حتى تصل السرعة إلى ⟦63.2%⟧ من سرعة اللاحمل في الاتجاه المضاد، وهو تقريباً ⟦1.7τ⟧."><path d="M62 216.9H172V160" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="172" cy="216.9" r="7" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="56" y="221" text-anchor="end" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">−0.632ω<tspan font-size="8" dy="3">o</tspan></text><text x="186" y="150" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">τ<tspan font-size="10" dy="3">r</tspan><tspan dy="-3"> ≈ 1.7τ</tspan></text></g></svg>`,
   cap:'السرعة عند عكس جهد ملف التحكم (رسم توضيحي على فرض أن العزم خطي مع السرعة كما في الكتاب).<br><b>مرّر المؤشر على المنحنى والنقطتين والخطين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>د. زمن عكس الحركة (<span class="ltr">\(\tau_r\)</span>):</b> هو الزمن اللازم للمحرك لكي يعكس اتجاه حركته الدورانية، ابتداءً من سرعة اللاحمل في اتجاه معين وحتى تصل سرعته إلى <span class="ltr">63.2%</span> من سرعة اللاحمل في الاتجاه المضاد، وذلك عند عكس اتجاه جهد ملف التحكم مئة وثمانين درجة بينما يكون المحرك بدون أحمال، وعلى وجه العموم فإن:</p>
     <p>زمن عكس الحركة = <span class="ltr">1.7</span> × ثابت الزمن الميكانيكي.</p>
     <div class="eq">$$\tau_r = 1.7\,\tau$$</div>`,ref:'ص 49'}
   ],
   body:[
    {predict:{q:String.raw`محرك ثابت الزمن الميكانيكي له <span class="ltr">3 s</span>. كم زمن عكس الحركة؟`,opts:[
     [String.raw`<span class="ltr">1.7 s</span>`,false,String.raw`هذا هو المعامل وحده؛ يجب ضربه في <span class="ltr">\(\tau\)</span>.`],
     [String.raw`<span class="ltr">3 s</span>`,false,String.raw`العكس أطول من التسارع من السكون، لأن المحرك يجب أن يتباطأ إلى الصفر أولاً ثم يتسارع في الاتجاه الآخر.`],
     [String.raw`<span class="ltr">6 s</span>`,false,String.raw`هذا ضعف <span class="ltr">\(\tau\)</span>؛ الكتاب يعطي المعامل 1.7 لا 2.`],
     [String.raw`<span class="ltr">5.1 s</span>`,true,String.raw`<span class="ltr">\(\tau_r = 1.7 \times 3 = 5.1\ \text{s}\)</span>، وهذا ما ستجده في المثال (٣-١).`]]}},
    {tip:String.raw`<p>عند العكس تبدأ السرعة من <span class="ltr">\(+\omega_o\)</span> وتتجه نحو <span class="ltr">\(-\omega_o\)</span> بالثابت الزمني نفسه: <span class="ltr">\(\omega=-\omega_o+2\omega_o e^{-t/\tau}\)</span>. نصل إلى <span class="ltr">\(-0.632\,\omega_o\)</span> عندما <span class="ltr">\(e^{-t/\tau}=0.184\)</span> أي <span class="ltr">\(t\approx1.69\,\tau\approx1.7\,\tau\)</span>. يمكنك قياس ذلك بنفسك في المختبر.</p>`,title:'من أين جاء الرقم 1.7؟'},
    {watch:String.raw`<p>شرطان في التعريف: <b>عكس جهد ملف التحكم <span class="ltr">180°</span></b>، و<b>المحرك بدون أحمال</b>.</p>`},
    {watch:String.raw`<p>معادلة زمن عكس الحركة <b>بلا رقم</b> في الكتاب. وترقيم البنود ص 49 مطبوع «أ، ب، ت، ث، ج» ثم «د.»، ونقلناه كما هو.</p>`,fix:true},
    {title:'مختبر مصغّر: اعكس الجهد وتابع السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'المحرك يدور بسرعة اللاحمل، وعند <span class="ltr">t = 0</span> نعكس جهد ملف التحكم <span class="ltr">180°</span> والمحرك بدون حمل. الزمن بمضاعفات <span class="ltr">τ</span> والسرعة نسبة من <span class="ltr">ω<sub>o</sub></span>، على فرض أن العزم خطي مع السرعة كما في الكتاب: <span class="ltr">ω/ω<sub>o</sub> = −1 + 2e<sup>−t/τ</sup></span>.',
 predict:{q:'بعد عكس الجهد، متى تمر السرعة بالصفر (يقف الدوار لحظة ثم يدور في الاتجاه الآخر)؟',opts:[
  ['عند <span class="ltr">t = 1.7 τ</span>',false,'عند <span class="ltr">1.7 τ</span> تكون السرعة قد وصلت إلى <span class="ltr">63.2%</span> في الاتجاه المضاد؛ الصفر قبل ذلك.'],
  ['عند <span class="ltr">t = τ</span> بالضبط',false,'جرّب المقبض: عند <span class="ltr">τ</span> تكون السرعة قد صارت سالبة.'],
  ['قبل <span class="ltr">τ</span>، عند <span class="ltr">t ≈ 0.69 τ</span> تقريباً',true,'<span class="ltr">−1 + 2e<sup>−t/τ</sup> = 0</span> عندما <span class="ltr">e<sup>−t/τ</sup> = 0.5</span>، أي <span class="ltr">t ≈ 0.69 τ</span>. الإبطاء سريع لأن العزم المعاكس كبير في البداية.']]},
 ins:[{k:'t',l:'الزمن منذ عكس الجهد (بمضاعفات τ)',min:0,max:4,step:0.01,v:0,fmt:v=>'t = '+(+v).toFixed(2)+' τ'}],
 calc:(s)=>{const r=-1+2*Math.exp(-s.t),pc=r*100;
  return {plot:{xr:[0,4],yr:[-1.1,1.1],xt:[0,1,1.7,3,4],yt:[-1,-0.632,0,1],fx:v=>v===0?'0':(v===1?'':v)+'τ',fy:v=>v===-0.632?'−0.632':DCML.fm(B,v),xl:'t',yl:'ω / ωo',
    curves:[{pts:[[0,-0.632],[4,-0.632]],col:'--muted',w:1.2,dash:'4 4'},{pts:[[0,0],[4,0]],col:'--line',w:1},{f:t=>-1+2*Math.exp(-t),col:'--blue',w:3,n:120}],cur:[s.t,r]},
   facts:[['السرعة نسبة من ω<sub>o</sub>',(pc<-0.05?'−':'')+DCML.fm(B,Math.abs(pc),1)+' %','hi'],['الاتجاه',r>0.005?'الأصلي':r<-0.005?'المضاد':'متوقف لحظياً']],
   msg:s.t>=1.69?'وصلت السرعة إلى <span class="ltr">63.2%</span> من سرعة اللاحمل في الاتجاه المضاد عند <span class="ltr">t ≈ 1.69 τ ≈ 1.7 τ</span>: هذا هو زمن عكس الحركة <span class="ltr">τ<sub>r</sub> = 1.7 τ</span>. وفي المثال (٣-١) <span class="ltr">τ = 3 s</span> فيكون <span class="ltr">τ<sub>r</sub> = 5.1 s</span>.':Math.abs(r)<0.01?'السرعة صفر لحظياً: انتهى الإبطاء، ويبدأ الدوران في الاتجاه الآخر.':''}}})}
   ]},

  {st:4,short:'مثال (٣-١)',title:'مثال (٣-١)',ref:'ص 50–51',
   q:'ثلاثة خطوط في الشكل وجهد واحد في السؤال… أي خط نستعمل، وكيف نستخرج منه كل المطلوب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 3-6: ثلاثة خطوط عزم وسرعة لجهود 110 و 95 و 70 فولت، وخط 95 فولت من 0.75 نيوتن متر إلى 225 راديان في الثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#F7DCC8"/><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="96" y="40" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">T (N.m)</text><text x="296" y="290" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ω (rad/s)</text><g font-size="11" fill="#2C4A40" font-family="var(--mono)"><text x="52" y="84" text-anchor="end">1.0</text><text x="52" y="126.5" text-anchor="end">0.75</text><text x="52" y="169" text-anchor="end">0.5</text><text x="185" y="268" text-anchor="middle">150</text><text x="246.5" y="268" text-anchor="middle">225</text><text x="308" y="268" text-anchor="middle">300</text></g><path d="M58 80H62M58 122.5H62M58 165H62M185 250V254M246.5 250V254M308 250V254" stroke="#2C4A40" stroke-width="2"/><g data-tip="خط ⟦Va = 110 V⟧ في الشكل: عزم البدء ⟦1.0 N.m⟧ وسرعة اللاحمل ⟦300 rad/s⟧."><path d="M62 80L308 250" stroke="transparent" stroke-width="14"/><path d="M62 80L308 250" stroke="#2C4A40" stroke-width="2.6"/><text x="72" y="74" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">110 V</text></g><g data-tip="خط ⟦Va = 95 V⟧: جهد ملف التحكم في المثال. عزم البدء ⟦0.75 N.m⟧ وسرعة اللاحمل ⟦225 rad/s⟧، وهو الخط الوحيد المستعمل في الحل."><path d="M62 122.5L246.5 250" stroke="transparent" stroke-width="14"/><path d="M62 122.5L246.5 250" stroke="#12855A" stroke-width="4.5"/><circle cx="62" cy="122.5" r="5" fill="#12855A"/><circle cx="246.5" cy="250" r="6" fill="#12855A"/><text x="72" y="116.5" font-size="12" fill="#12855A" font-weight="700" font-family="var(--mono)">95 V</text></g><g data-tip="خط ⟦Va = 70 V⟧ في الشكل: عزم البدء ⟦0.5 N.m⟧ وسرعة اللاحمل ⟦150 rad/s⟧."><path d="M62 165L185 250" stroke="transparent" stroke-width="14"/><path d="M62 165L185 250" stroke="#2C4A40" stroke-width="2.6"/><text x="72" y="159" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">70 V</text></g></svg>`,
   cap:'الشكل (٣-٦) ص 50 بأرقامه، والخط الأخضر هو خط <span class="ltr">95 V</span> المستعمل في الحل.<br><b>مرّر المؤشر على الخطوط الثلاثة (أو المسها في الجوال) لتقرأ طرفي كل خط.</b>',
   side:[
    {book:String.raw`<p>محرك تحكم للتيار المتردد، ثنائي الوجه <span class="ltr">120</span> فولت، <span class="ltr">60</span> هيرتز، له منحنيات الخواص المبينة بالشكل (٣-٦)، قصوره الذاتي <span class="ltr">0.01</span> كيلوجرام.متر²، الجهد على ملف التحكم <span class="ltr">95</span> فولت أوجد:</p>
     <p>أ. المعادلة التي تصف منحنى الخواص (العلاقة بين العزم والسرعة). ب. التسارع عند بدء الحركة. ج. سرعة اللاحمل. د. ثابت الزمن الميكانيكي. هـ. زمن عكس الحركة. و. معادلة السرعة مع الزمن.</p>`,ref:'ص 50'}
   ],
   body:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٣-١) <span class="ref">ص 50–51</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(V_a=95\ \text{V}\)</span><span class="kv ltr">\(J=0.01\ \text{kg.m}^2\)</span><span class="kv">من خط <span class="ltr">95 V</span>:</span><span class="kv ltr">\(T_{st}=0.75\ \text{N.m}\)</span><span class="kv ltr">\(\omega_o=225\ \text{rad/s}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(K_v=0.00789\)</span><span class="kv res ltr">\(K_\omega=0.0033\)</span><span class="kv res ltr">\(T=-0.0033\,\omega+0.75\ \text{N.m}\)</span><span class="kv res ltr">\(\alpha=75\ \text{rad/s}^2\)</span><span class="kv res ltr">\(\omega_o=225\ \text{rad/s}\)</span><span class="kv res ltr">\(\tau=3\ \text{s}\)</span><span class="kv res ltr">\(\tau_r=5.1\ \text{s}\)</span><span class="kv res ltr">\(\omega=225\left(1-e^{-t/3}\right)\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة وغيّر الأرقام</button></div></div>`},
    {tip:String.raw`<p>نقرأ من خط <span class="ltr">95 V</span> طرفيه: عند <span class="ltr">\(\omega=0\)</span> يكون العزم عزم البدء <span class="ltr">0.75 N.m</span>، فيكون <span class="ltr">\(K_v = 0.75/95\)</span>؛ وعند <span class="ltr">\(T=0\)</span> تكون السرعة سرعة اللاحمل <span class="ltr">225 rad/s</span>، فيكون الميل <span class="ltr">\(K_\omega = 0.75/225\)</span>. بعدها كل المطلوب تعويض مباشر في المعادلات (٣-٣) و (٣-٤) و (٣-٥) وفي <span class="ltr">\(\tau_r=1.7\,\tau\)</span>.</p>`,title:'طريقة الحل باختصار'},
    {predict:{q:String.raw`لو استعملنا خط <span class="ltr">110 V</span> في الشكل بدل خط <span class="ltr">95 V</span> (عزم بدء <span class="ltr">1.0 N.m</span> وسرعة لاحمل <span class="ltr">300 rad/s</span>)، والقصور الذاتي نفسه <span class="ltr">0.01</span>، كم يكون ثابت الزمن الميكانيكي؟`,opts:[
     [String.raw`<span class="ltr">4 s</span>`,false,String.raw`<span class="ltr">\(\tau = 0.01\times300/1.0\)</span>؛ أعد الحساب.`],
     [String.raw`<span class="ltr">2.25 s</span>`,false,String.raw`هذا ناتج <span class="ltr">\(0.01\times225\)</span>؛ المطلوب <span class="ltr">\(J\times\omega_o\)</span> مقسوماً على <span class="ltr">\(T_{st}\)</span> للخط نفسه.`],
     [String.raw`<span class="ltr">3 s</span>، مثل خط <span class="ltr">95 V</span> تماماً`,true,String.raw`<span class="ltr">\(\tau=\frac{0.01\times300}{1.0}=3\ \text{s}\)</span>. الخطوط متوازية (الميل نفسه)، و <span class="ltr">\(\tau=\frac{J\,\omega_o}{T_{st}}=\frac{J}{K_\omega}\)</span>، فلا يتغير ثابت الزمن مع جهد ملف التحكم؛ الذي يغيّره هو <span class="ltr">\(J\)</span>.`]]}},
    {watch:String.raw`<p>الشكل (٣-٦) لا يتفق مع المعادلة (٣-١) <span class="ltr">\(T \propto V_a\)</span>: من خط <span class="ltr">95 V</span> نحصل على <span class="ltr">\(K_v = 0.75/95 = 0.00789\)</span>، فيكون عزم البدء عند <span class="ltr">110 V</span> هو <span class="ltr">0.868 N.m</span> وعند <span class="ltr">70 V</span> هو <span class="ltr">0.553 N.m</span>، بينما الشكل يرسمهما <span class="ltr">1.0</span> و <span class="ltr">0.5 N.m</span> (والخطوط ليست متناسبة مع الجهد). الحل في الكتاب يستعمل خط <span class="ltr">95 V</span> فقط فلا يتأثر.</p>`,fix:true},
    {watch:String.raw`<p>في الحل ص 51 طُبع الأس «<span class="ltr">\(e^{-0..33t}\)</span>» بنقطتين، والصحيح <span class="ltr">\(e^{-0.33t}\)</span> أي <span class="ltr">\(e^{-t/3}\)</span>. كذلك المعطى «<span class="ltr">120</span> فولت، <span class="ltr">60</span> هيرتز» لا يُستعمل في الحل.</p>`,fix:true},
    {title:'مختبر مصغّر: اختر خطاً من الشكل (٣-٦)',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر أحد خطوط الشكل (٣-٦) بأرقامه، والقصور الذاتي <span class="ltr">J = 0.01 kg.m²</span> كما في المثال، وراقب كل المطلوب محسوباً من طرفي الخط.',
 predict:{q:'أي الخطوط الثلاثة يعطي أكبر تسارع عند بدء الحركة؟',opts:[
  ['خط <span class="ltr">70 V</span>',false,'عزم بدئه أصغر (<span class="ltr">0.5 N.m</span>)، فتسارعه أصغر.'],
  ['خط <span class="ltr">110 V</span>',true,'عزم بدئه أكبر (<span class="ltr">1.0 N.m</span>)، و <span class="ltr">α = T<sub>st</sub>/J = 1.0/0.01 = 100 rad/sec²</span>.'],
  ['الثلاثة متساوية',false,'المتساوي في الخطوط الثلاثة هو ثابت الزمن، لا التسارع.']]},
 ins:[{k:'v',l:'خط جهد ملف التحكم',seg:[[110,'110 V'],[95,'95 V'],[70,'70 V']],v:95}],
 calc:(s)=>{const L=FIG36[s.v],J=0.01,Kw=L.T/L.w,al=L.T/J,tau=J*L.w/L.T,tr=1.7*tau;
  const cv=[110,95,70].filter(v=>v!==s.v).map(v=>({pts:[[0,FIG36[v].T],[FIG36[v].w,0]],col:'--muted',w:1.4,dash:'4 4'}));cv.push({pts:[[0,L.T],[L.w,0]],col:'--blue',w:3});
  return {plot:{xr:[0,330],yr:[0,1.1],xt:[0,150,225,300],yt:[0,0.5,0.75,1],xl:'ω (rad/s)',yl:'T (N.m)',curves:cv,dots:[[0,L.T,'--live'],[L.w,0,'--live']]},
   facts:[['عزم البدء T<sub>st</sub>',DCML.fm(B,L.T,2)+' N.m'],['سرعة اللاحمل ω<sub>o</sub>',L.w+' rad/s'],['الميل K<sub>ω</sub>',DCML.fm(B,Kw,4)],['التسارع α',DCML.fm(B,al,0)+' rad/s²','hi'],['ثابت الزمن τ',DCML.fm(B,tau,1)+' s','hi'],['زمن العكس τ<sub>r</sub>',DCML.fm(B,tr,1)+' s']],
   msg:s.v===95?'هذا خط المثال (٣-١): النتائج نفسها في الحل ص 51.':'ثابت الزمن بقي <span class="ltr">3 s</span>: الخطوط الثلاثة في الشكل لها الميل نفسه <span class="ltr">K<sub>ω</sub> = 1/300</span>، و <span class="ltr">τ = J ω<sub>o</sub>/T<sub>st</sub> = J/K<sub>ω</sub></span>.'}}})}
   ]},

  {recap:[
   String.raw`سرعة اللاحمل <span class="ltr">\(\omega_o\)</span> (rad/s)، وعزم بدء الحركة <span class="ltr">\(T_{st}\)</span> وهو أقصى عزم (N.m)، والقصور الذاتي <span class="ltr">\(J\)</span> (kg.m²) (ص 49).`,
   String.raw`التسارع عند بدء الحركة، المعادلة (٣-٣): <span class="ltr">\(\alpha=T_{st}/J\)</span>`,
   String.raw`ثابت الزمن الميكانيكي، المعادلة (٣-٤): <span class="ltr">\(\tau=J\,\omega_o/T_{st}\)</span>، وعنده تصل السرعة إلى <span class="ltr">63.2%</span> من سرعة اللاحمل.`,
   String.raw`السرعة مع الزمن، المعادلة (٣-٥): <span class="ltr">\(\omega=\omega_o\left(1-e^{-t/\tau}\right)\)</span>`,
   String.raw`زمن عكس الحركة (بلا رقم معادلة في الكتاب): <span class="ltr">\(\tau_r=1.7\,\tau\)</span>؛ وفي المثال (٣-١): <span class="ltr">\(\tau=3\)</span> s و <span class="ltr">\(\tau_r=5.1\)</span> s.`]}
],
 theory:[
  {h:'بعض المصطلحات المستخدمة لمحركات التحكم',ref:'ص 49',html:`<ul>
   <li><b>أ- سرعة اللاحمل (\u202Bω<sub>o</sub>\u202C):</b> «هي السرعة التي يدور بها المحرك عند تشغيله بدون أحمال، ووحداتها راديان/ثانية.»</li>
   <li><b>ب- عزم بدء الحركة (T<sub>st</sub>):</b> «العزم المتولد عند بدء الحركة وهو أقصى عزم للمحرك، ووحداته نيوتن.متر.»</li>
   <li><b>ت- القصور الذاتي للمحرك (J):</b> «(أو عزم الحدافة)، ووحداته كيلوجرام.متر².»</li>
   <li><b>ث- التسارع (α):</b> «يقصد به التسارع عند بدء الحركة، ويحسب من خارج قسمة العزم عند بدء الحركة على القصور الذاتي، ووحداته راديان/ثانية².»</li></ul>
   <div dir="ltr" style="direction:ltr">$$\\alpha=\\frac{T_{st}}{J} \\qquad \\text{(٣-٣)}$$</div>`},
  {html:`<p><b>ج- ثابت الزمن الميكانيكي (τ):</b> «ويعرف بالزمن اللازم للدوار ليتسارع من السكون وحتى تصل سرعته إلى <b>63.2٪ من سرعة اللاحمل</b> عند تسليط الجهد الكامل على ملف التحكم، ووحداته بالثانية. عند حساب هذا الزمن فإنه يفترض أن العزم يتناقص خطياً من أقصى عزم عند سرعة الصفر وحتى سرعة اللاحمل، متسبباً في زيادة السرعة في منحنى أسي مع الزمن، كما في الشكل (٣-٥)، ويحسب ثابت الزمن الميكانيكي من العلاقة:» ثابت الزمن الميكانيكي = القصور الذاتي × سرعة اللاحمل ÷ عزم بدء الحركة.</p>
   <div dir="ltr" style="direction:ltr">$$\\tau=\\frac{J\\times\\omega_o}{T_{st}} \\qquad \\text{(٣-٤)}$$</div>
   <p>«كما يمكن حساب السرعة مع الزمن من المعادلة التالية:»</p>
   <div dir="ltr" style="direction:ltr">$$\\omega=\\omega_o\\left(1-e^{-t/\\tau}\\right) \\qquad \\text{(٣-٥)}$$</div>`},
  {fig:'(٣-٥)',ref:'ص 50',caption:'«منحني السرعة مع العزم» كما طُبع — والمرسوم في الحقيقة السرعة مع الزمن: المنحنى الأسي، وخط المماس من الأصل يصل إلى ωo عند الزمن τ (إعادة رسم)',draw:()=>box(fig35SVG(),520)},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوان الشكل (٣-٥) ص 50 «منحني السرعة مع العزم»، بينما المحور الأفقي في الرسم هو <b>الزمن</b> (Time (sec.)) والمنحنى هو <b>السرعة مع الزمن</b> حسب المعادلة (٣-٥).'+'</div>'},
  {html:`<p><b>د. زمن عكس الحركة (τ<sub>r</sub>):</b> «هو الزمن اللازم للمحرك لكي يعكس اتجاه حركته الدورانية، ابتداءً من سرعة اللاحمل في اتجاه معين وحتى تصل سرعته إلى 63.2٪ من سرعة اللاحمل في الاتجاه المضاد، وذلك عند عكس اتجاه جهد ملف التحكم مئة وثمانين درجة بينما يكون المحرك بدون أحمال، وعلى وجه العموم فإن:» زمن عكس الحركة = 1.7 × ثابت الزمن الميكانيكي.</p>
   <div dir="ltr" style="direction:ltr">$$\\tau_r = 1.7\\,\\tau$$</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> من أين جاء الرقم 1.7؟ عند العكس تبدأ السرعة من <span class="ltr">\\(+\\omega_o\\)</span> وتتجه نحو <span class="ltr">\\(-\\omega_o\\)</span> بالثابت الزمني نفسه: <span class="ltr">\\(\\omega=-\\omega_o+2\\omega_o e^{-t/\\tau}\\)</span>. نصل إلى <span class="ltr">\\(-0.632\\,\\omega_o\\)</span> عندما <span class="ltr">\\(e^{-t/\\tau}=0.184\\)</span> أي <span class="ltr">\\(t\\approx1.69\\,\\tau\\approx1.7\\,\\tau\\)</span>. يمكنك قياس ذلك بنفسك في المختبر.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ترقيم البنود ص 49 مطبوع «أ، ب، ت، ث، ج» ثم «د.» — خليط بين الترتيب الأبجدي والهجائي. نقلناه كما هو.'+'</div>'},
  {h:'مثال (٣-١)',ref:'ص 50–51',html:`<p>«محرك تحكم للتيار المتردد، ثنائي الوجه 120 فولت، 60 هيرتز، له منحنيات الخواص المبينة بالشكل (٣-٦)، قصوره الذاتي 0.01 كيلوجرام.متر²، الجهد على ملف التحكم 95 فولت. أوجد: أ. المعادلة التي تصف منحنى الخواص (العلاقة بين العزم والسرعة). ب. التسارع عند بدء الحركة. ج. سرعة اللاحمل. د. ثابت الزمن الميكانيكي. هـ. زمن عكس الحركة. و. معادلة السرعة مع الزمن.»</p><p>الحل خطوة بخطوة (وبأرقامك أنت) في تبويب <b>«الأمثلة المحلولة»</b>.</p>`},
  {fig:'(٣-٦)',ref:'ص 50',caption:'منحنيات خواص محرك المثال (٣-١): ثلاثة خطوط متوازية (إعادة رسم). بدّل لترى الفرق بين الرسم والمعادلة.',draw:()=>'<div id="u3f36">'+box(fig36SVG('fig'),520)+'</div>'},
  {widget:(el)=>{let m='fig';const draw=()=>{el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${segHTML('m',[['fig','كما في الشكل (٣-٦)'],['eq','حسب المعادلة (٣-١)'],['both','الاثنان معاً']],m)}</div>
     <div class="tablebox" style="margin-top:8px"><table class="tt"><thead><tr><th>V<sub>a</sub></th><th>T<sub>st</sub> في الشكل</th><th>T<sub>st</sub> = 0.00789 V<sub>a</sub></th><th>ω<sub>o</sub> في الشكل</th><th>ω<sub>o</sub> حسب المعادلة</th></tr></thead><tbody>${[110,95,70].map(v=>`<tr><td class="mono">${v} V</td><td class="mono">${FIG36[v].T.toFixed(2)}</td><td class="mono">${eqLine(v).T.toFixed(3)}</td><td class="mono">${FIG36[v].w}</td><td class="mono">${eqLine(v).w.toFixed(1)}</td></tr>`).join('')}</tbody></table></div>`;
     const f=document.getElementById('u3f36');if(f)f.innerHTML=box(fig36SVG(m),520);
     el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw()}},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الشكل (٣-٦) ص 50 لا يتفق مع المعادلة (٣-١) <span class="ltr">\\(T \\propto V_a\\)</span>: من خط 95 V نحصل على <span class="ltr">\\(K_v = 0.75/95 = 0.00789\\)</span>، فيكون عزم البدء عند 110 V هو 0.868 N.m وعند 70 V هو 0.553 N.m، بينما الشكل يرسمهما 1.0 و 0.5 N.m (والخطوط ليست متناسبة مع الجهد). الحل في الكتاب يستعمل خط 95 V فقط فلا يتأثر. في المختبر يمكنك الاختيار بين «كما في الشكل» و «حسب المعادلة».'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الحل ص 51 طُبع الأس «<span class="ltr">\\(e^{-0..33t}\\)</span>» بنقطتين، والصحيح <span class="ltr">\\(e^{-0.33t}\\)</span> أي <span class="ltr">\\(e^{-t/3}\\)</span>. كذلك المعطى «120 فولت، 60 هيرتز» لا يستعمل في الحل.'+'</div>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن <span class="ltr">\\(\\tau=\\frac{J\\,\\omega_o}{T_{st}}=\\frac{J}{K_\\omega}\\)</span>. لأن الخطوط متوازية (الميل نفسه)، فإن ثابت الزمن لا يتغير مع جهد ملف التحكم: في المثال <span class="ltr">\\(\\tau = 3\\)</span> ثوانٍ لكل الخطوط. الذي يغيّر τ هو القصور الذاتي J — لهذا تُصمم محركات التحكم بدوار خفيف.'}
 ],
 lab:(el)=>{
  let mode='fig',Va=95,J=0.01,sp=1,w=0,t=0,dir=0,tStart=null,tRev=null,hist=[],ht=0,mT=null,mR=null,lastSig='';const flags={};
  const par=()=>{const p=mode==='fig'&&FIG36[Va]?FIG36[Va]:eqLine(Va);const Tst=p.T,w0=p.w;return {Tst,w0,Kw:Tst/w0,tau:w0>0?J*w0/Tst:0,al:Tst/J}};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>سباق التسارع <small>مبني على الشكلين (٣-٥) و (٣-٦) والمعادلات (٣-٣) إلى (٣-٥)</small></h2>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">الخطوط</div>${segHTML('md',[['fig','كما في الشكل (٣-٦)'],['eq','حسب المعادلة (٣-١)']],mode)}</div>
     <div><div class="sub">جهد ملف التحكم</div>${segHTML('va',[[70,'70 V'],[95,'95 V'],[110,'110 V']],Va)}</div>
     <div id="vaBox" style="flex:1 1 220px">${slHTML('vas','أو أي جهد (حسب المعادلة فقط)',10,120,1,95)}</div>
     ${slHTML('j','القصور الذاتي J',2,50,1,10)}
     <div><div class="sub">سرعة العرض</div>${segHTML('sp',[[1,'×1'],[2,'×2'],[5,'×5']],sp)}</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn primary" id="go">▶ تشغيل بالجهد الكامل من السكون</button><button class="btn" id="rv">⇄ عكس جهد ملف التحكم 180°</button><button class="btn" id="rs">↺ إعادة</button></div>
    <div class="facts">${fact('عزم البدء T<sub>st</sub>','fT')}${fact('سرعة اللاحمل ω<sub>o</sub>','fW')}${fact('التسارع α = T<sub>st</sub>/J','fA')}${fact('ثابت الزمن τ (المعادلة ٣-٤)','fTau')}${fact('زمن العكس 1.7τ','fTr')}${fact('الزمن t','fT2')}${fact('السرعة ω','fW2')}${fact('τ المقاس في المحاكاة','fM1')}${fact('τ<sub>r</sub> المقاس في المحاكاة','fM2')}</div><div id="msg"></div></div>
   <div class="panel c7"><h2>السرعة مع الزمن <small>مثل الشكل (٣-٥)</small></h2><div class="svgbox" id="c1"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>السرعة في المحاكاة</span><span><i style="background:var(--muted)"></i>ωo و 0.632ωo والمماس</span><span><i style="background:var(--live)"></i>τ و τr</span></div></div>
   <div class="panel c5"><h2>نقطة التشغيل على خط العزم والسرعة <small>الشكل (٣-٦)</small></h2><div class="svgbox" id="c2"></div><p class="sub">النقطة الحمراء تنزلق على الخط من عزم البدء إلى سرعة اللاحمل: كلما زادت السرعة قل العزم فقل التسارع، لذلك يكون المنحنى أسياً.</p></div>
   <div class="panel c12"><p class="sub">المحرك بدون حمل، والعزم يتناقص خطياً مع السرعة كما يفترض الكتاب ص 49. الحساب دقيق من المعادلات؛ قيم الشكل (٣-٦) من الكتاب.</p>${tryBox('try')}</div></div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'مثال الكتاب',x:'اختر 95 V و J = 0.01 واضغط «تشغيل». انتظر حتى تصل السرعة إلى 0.632 × 225 = 142 rad/s: يحدث ذلك عند τ = 3 s كما في المثال (٣-١).',done:()=>mT!=null&&Va===95&&Math.abs(J-0.01)<1e-9},
   {t:'عكس الحركة',x:'بعد أن تقترب السرعة من 225 اضغط «عكس جهد ملف التحكم». قِس الزمن حتى −0.632ωo: يقارب 1.7τ = 5.1 s.',done:()=>mR!=null},
   {t:'غيّر القصور الذاتي',x:'ضاعف J ثم أعد التشغيل: ثابت الزمن يتضاعف والمنحنى أبطأ — لهذا تُصمم محركات التحكم بقصور ذاتي صغير.',done:()=>J>=0.02&&mT!=null},
   {t:'غيّر الجهد',x:'جرّب 70 V و 110 V: تتغير سرعة اللاحمل والتسارع، لكن τ يبقى 3 s (الخطوط متوازية).',done:()=>flags.va2&&mT!=null},
   {t:'الشكل أم المعادلة؟',x:'بدّل بين «كما في الشكل» و «حسب المعادلة» عند 110 V: لاحظ اختلاف عزم البدء (1.0 مقابل 0.868 N.m).',done:()=>flags.mode}]);
  const vas=q(el,'#vas'),js=q(el,'#j');
  const reset=()=>{w=0;t=0;dir=0;tStart=null;tRev=null;hist=[];mT=null;mR=null};
  const sync=()=>{segSet(el,'md',mode);segSet(el,'va',Va);segSet(el,'sp',sp);vas.disabled=mode==='fig';q(el,'#vaBox').style.opacity=mode==='fig'?.45:1;q(el,'#vas-v').textContent=Va+' V';q(el,'#j-v').textContent=J.toFixed(3)+' kg.m²'};
  el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.md;flags.mode=1;if(mode==='fig'&&!FIG36[Va])Va=95;vas.value=Va;reset();sync()}));
  el.querySelectorAll('[data-va]').forEach(b=>b.addEventListener('click',()=>{Va=+b.dataset.va;if(Va!==95)flags.va2=1;vas.value=Va;reset();sync()}));
  vas.addEventListener('input',()=>{Va=+vas.value;reset();sync()});
  js.addEventListener('input',()=>{J=+js.value/1000;reset();sync()});
  el.querySelectorAll('[data-sp]').forEach(b=>b.addEventListener('click',()=>{sp=+b.dataset.sp;sync()}));
  q(el,'#go').addEventListener('click',()=>{reset();dir=1;tStart=0});
  q(el,'#rv').addEventListener('click',()=>{if(!dir){reset();dir=1;tStart=0}dir=-dir;tRev=t;mR=null});
  q(el,'#rs').addEventListener('click',()=>reset());
  sync();
  loopOn(el,dt=>{const P=par();
   if(dir){const h=dt*sp,tgt=dir*P.w0,wPrev=w;w=tgt+(w-tgt)*Math.exp(-h/P.tau);t+=h;
     if(mT==null&&tRev==null&&w>=0.632*P.w0){mT=t-(w-0.632*P.w0)/((w-wPrev)/h||1)}
     if(tRev!=null&&mR==null&&dir*w>=0.632*P.w0){mR=t-tRev-(dir*w-0.632*P.w0)/(Math.abs(w-wPrev)/h||1)}}
   ht+=dt;if(ht<0.06)return;ht=0;if(dir)hist.push([t,w]);
   const span=tRev!=null?tRev+6*P.tau:6*P.tau,neg=tRev!=null;
   const vl=[{x:P.tau,col:'--live',label:'τ',ly:P.w0*0.2}];if(neg)vl.push({x:tRev+1.7*P.tau,col:'--live',label:'τr',ly:-P.w0*0.3},{x:tRev,col:'--muted',label:'عكس',ar:1,ly:P.w0*0.4});
   const hl=[{y:P.w0,label:'ωo'},{y:0.632*P.w0,label:'0.632ωo'}];if(neg)hl.push({y:-P.w0,label:'−ωo'},{y:-0.632*P.w0,label:'−0.632ωo'});
   const ideal={pts:fn2pts(x=>P.w0*(1-Math.exp(-x/P.tau)),0,neg?tRev:span,80),col:'--muted',w:1.4,dash:'3 4'};
   q(el,'#c1').innerHTML=plot({W:560,H:300,x:[0,span],y:[neg?-P.w0*1.15:0,P.w0*1.15],xt:fn2pts(x=>x,0,span,6).map(p=>[p[0],p[0].toFixed(1)]),yt:[],xl:'t (s)',yl:'ω (rad/s)',
     lines:[{pts:[[0,0],[P.tau,P.w0]],col:'--muted',w:1.4,dash:'5 4'},ideal,{pts:hist,col:'--blue',w:2.8}],hl,vl,dots:dir?[{x:t,y:w,col:'--stop',r:5}]:[],aria:'السرعة مع الزمن'});
   const Tn=dir?dir*P.Tst-P.Kw*w:0;
   const oth=mode==='fig'?eqLine(Va):FIG36[Va];
   const sg2=dir<0?-1:1,L=[{pts:[[0,sg2*P.Tst],[sg2*P.w0,0]],col:'--blue',w:2.8},{pts:[[0,-sg2*P.Tst],[-sg2*P.w0,0]],col:'--blue',w:1.6,dash:'4 4',op:.6}];if(oth)L.push({pts:[[0,oth.T],[oth.w,0]],col:'--muted',w:1.6,dash:'6 5'});
   q(el,'#c2').innerHTML=plot({W:420,H:300,x:[-330,330],y:[-1.1,1.1],xt:[-300,-150,150,300],yt:[-1,-0.5,0.5,1],xl:'ω',yl:'T (N.m)',lines:L,dots:dir?[{x:w,y:Tn}]:[],aria:'خط العزم والسرعة'})+(oth?`<p class="sub">الخط المتقطع الرمادي = ${mode==='fig'?'حسب المعادلة (٣-١)':'كما في الشكل (٣-٦)'} لنفس الجهد.</p>`:'');
   q(el,'#fT').textContent=P.Tst.toFixed(3)+' N.m';q(el,'#fW').textContent=P.w0.toFixed(1)+' rad/s';q(el,'#fA').textContent=P.al.toFixed(1)+' rad/s²';q(el,'#fTau').textContent=P.tau.toFixed(2)+' s';q(el,'#fTr').textContent=(1.7*P.tau).toFixed(2)+' s';
   q(el,'#fT2').textContent=t.toFixed(2)+' s';q(el,'#fW2').textContent=w.toFixed(1)+' rad/s';q(el,'#fM1').textContent=mT!=null?mT.toFixed(2)+' s':'—';q(el,'#fM2').textContent=mR!=null?mR.toFixed(2)+' s':'—';
   const sg=[mode,Va].join();if(sg!==lastSig){lastSig=sg;q(el,'#msg').innerHTML=mode==='fig'?'<div class="callout">قيم عزم البدء وسرعة اللاحمل مأخوذة من رسم الشكل (٣-٦) للخطوط الثلاثة.</div>':`<div class="callout err">حسب المعادلة (٣-١): \u202BT<sub>st</sub> = 0.00789 × ${Va} = ${eqLine(Va).T.toFixed(3)} N.m\u202C — ${FIG36[Va]&&Va!==95?`بينما الشكل (٣-٦) يرسمه ${FIG36[Va].T.toFixed(2)} N.m.`:'تطابق الشكل عند 95 V فقط.'}</div>`}
   tl.check()});
 },
 examples:[{
  title:'مثال (٣-١)',ref:'ص 50–51',
  q:'<p>«محرك تحكم للتيار المتردد، ثنائي الوجه 120 فولت، 60 هيرتز، له منحنيات الخواص المبينة بالشكل (٣-٦)، قصوره الذاتي 0.01 كيلوجرام.متر²، الجهد على ملف التحكم 95 فولت أوجد: أ. المعادلة التي تصف منحنى الخواص. ب. التسارع عند بدء الحركة. ج. سرعة اللاحمل. د. ثابت الزمن الميكانيكي. هـ. زمن عكس الحركة. و. معادلة السرعة مع الزمن.»</p><p class="sub">من خط 95 V في الشكل (٣-٦): عزم البدء 0.75 N.m وسرعة اللاحمل 225 rad/sec.</p>',
  given:[{id:'Va',label:'جهد ملف التحكم',sym:'V_a',unit:'V',value:95},{id:'Tst',label:'عزم البدء (من الشكل)',sym:'T_{st}',unit:'N.m',value:0.75},{id:'w0',label:'سرعة اللاحمل (من الشكل)',sym:'\\omega_o',unit:'rad/s',value:225},{id:'J',label:'القصور الذاتي',sym:'J',unit:'kg.m²',value:0.01}],
  solve:(g,B)=>servoSolve({Va:g.Va,Tst:g.Tst,w0:g.w0,J:g.J},B,{kv:5,kw:4}).out,
  note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> طُبع الأس في الجواب (و) «e<sup>−0..33t</sup>» بنقطتين؛ والصحيح e<sup>−0.33t</sup> (أي e<sup>−t/3</sup>) كما يظهر أعلاه. </span>التقريب كما في الكتاب: K<sub>v</sub> = 0.00789 (الدقيق 0.0078947)، و K<sub>ω</sub> = 0.0033 (الدقيق 0.003333). المعطى «120 فولت، 60 هيرتز» لا يُستعمل في الحل.'
 }],
 quiz:[
  {q:'ما تعريف ثابت الزمن الميكانيكي τ؟',o:['زمن وصول السرعة إلى سرعة اللاحمل كاملة','زمن وصول السرعة من السكون إلى 63.2٪ من سرعة اللاحمل بالجهد الكامل','زمن توقف المحرك','نصف زمن عكس الحركة'],c:1,e:'ص 49 كما في التعريف.'},
  {q:'محرك: T_st = 0.75 N.m و J = 0.01 kg.m². التسارع عند بدء الحركة:',o:['7.5 rad/s²','75 rad/s²','0.0075 rad/s²','750 rad/s²'],c:1,e:'α = T_st / J = 0.75 / 0.01 = 75 rad/s² (المعادلة ٣-٣).'},
  {q:'إذا كان τ = 3 s فإن زمن عكس الحركة حسب الكتاب:',o:['3 s','1.7 s','5.1 s','6 s'],c:2,e:'τr = 1.7 × τ = 1.7 × 3 = 5.1 s.'},
  {q:'وحدة القصور الذاتي J:',o:['N.m','rad/s','kg.m²','rad/s²'],c:2,e:'ص 49: كيلوجرام.متر².'},
  {q:'ماذا يرسم الشكل (٣-٥) فعلاً؟',o:['العزم مع السرعة','السرعة مع الزمن','التيار مع الجهد','العزم مع الزمن'],c:1,e:'المحور الأفقي هو الزمن، والعنوان المطبوع «السرعة مع العزم» خطأ.'},
  {q:'عند t = τ تكون السرعة حسب المعادلة (٣-٥):',o:['ωo','0.5 ωo','0.632 ωo','0.368 ωo'],c:2,e:'ω = ωo(1 − e⁻¹) = 0.632 ωo.'},
  {q:'أي تغيير يجعل محرك التحكم يستجيب أسرع (τ أصغر)؟',o:['زيادة القصور الذاتي J','تصغير القصور الذاتي J','تقليل عزم البدء مع بقاء سرعة اللاحمل','زيادة سرعة اللاحمل مع بقاء العزم'],c:1,e:'τ = J × ωo / T_st: كلما صغر J صغر τ.'},
  {q:'في المثال (٣-١)، K_ω = 0.75 / 225 طُبع:',o:['0.0033','0.033','0.00789','0.33'],c:0,e:'0.75 / 225 = 0.00333، وطُبع 0.0033.'}
 ]
});

/* =====================================================================
   Lesson 3.5 — DC servo motors
   ===================================================================== */
function dcCircuitSVG(o){o=o||{};const pm=!!o.pm,L=!!o.live,c=L?'live':'',va=o.Va||0;
  let s=`<svg viewBox="0 0 540 240" role="img" aria-label="محرك التحكم للتيار المستمر ذو التغذية المستقلة">`;
  if(!pm){s+=S.dot(30,50)+S.dot(30,180)+tx(18,120,'Vf',{a:'end'})+tx(30,40,'+',{})+S.w('M30 50H50',c)+`<path class="w ${c}" d="${zig(50,50,110)}"/>`+S.w('M110 50H150V70',c)+tx(80,36,'Rf',{})+
    `<path class="w ${c}" d="${cp(150,70,150,160,5)}"/>`+S.w('M150 160V180H30',c)+tx(110,120,'If',{})+arrowHead(130,110,Math.PI/2,8,L?'--live':'--fg')+`<path d="M130 92V110" class="sym"/>`;}
  else{s+=`<rect x="70" y="70" width="60" height="45" fill="var(--stop-soft)" stroke="var(--stop)"/><rect x="70" y="115" width="60" height="45" fill="var(--blue-soft)" stroke="var(--blue)"/>`+tx(100,98,'N',{fs:16})+tx(100,143,'S',{fs:16})}
  s+=`<text class="txt ar" x="100" y="222" text-anchor="middle">${pm?'العضو الثابت (مغناطيس دائم)':'العضو الثابت (المجال)'}</text>`;
  s+=`<circle cx="280" cy="115" r="38" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+tx(280,121,'M',{fs:18})+`<rect x="272" y="68" width="16" height="10" fill="var(--fg)"/><rect x="272" y="152" width="16" height="10" fill="var(--fg)"/>`;
  s+=S.w('M280 68V40H340',c)+`<path class="w ${c}" d="${zig(340,40,410)}"/>`+S.w('M410 40H500',c)+S.dot(500,40)+tx(375,26,'Ra',{})+S.w('M280 162V190H500',c)+S.dot(500,190);
  s+=tx(512,44,va<0?'−':'+',{})+tx(512,194,va<0?'+':'−',{})+tx(512,120,'Va',{a:'start'});
  s+=`<path d="M440 52H470" class="sym"/>`+arrowHead(va<0?440:470,52,va<0?Math.PI:0,8,'--fg')+tx(455,70,'Ia',{});
  s+=tx(330,100,'+',{})+tx(330,140,'−',{})+tx(340,122,'Ea',{a:'start'});
  s+=`<text class="txt ar" x="400" y="222" text-anchor="middle">العضو الدوار (المنتج)</text>`;
  if(L)s+=tx(375,62,o.lbl||'',{c:'b'});
  return s+'</svg>'}
function fig38SVG(cur){const ref=[[1,'Va1'],[0.75,'Va2'],[0.5,'Va3']];
  const xs=cur&&cur.xs||1,ys=cur&&cur.ys||1,tk=v=>[v,String(+v.toPrecision(3))];   // xs = ωo و ys = Tst عند الجهد الكامل (لقيم المدرب)
  const L=ref.map(([v])=>({pts:[[0,v*ys],[v*xs,0]],col:cur?'--muted':'--fg',w:cur?1.6:2.4,dash:cur?'5 4':''}));
  if(cur)L.push({pts:[[0,cur.Va*ys],[cur.Va*xs,0]],col:'--blue',w:3});
  return plot({W:460,H:270,x:cur?[-1.1*xs,1.1*xs]:[0,1.1],y:cur?[-1.1*ys,1.1*ys]:[0,1.1],xt:cur?[-1,-0.5,0.5,1].map(v=>tk(v*xs)):[[0.5,'ωo3'],[0.75,'ωo2'],[1,'ωo1']],yt:cur?[-1,-0.5,0.5,1].map(v=>tk(v*ys)):[[0.5,'Tst3'],[0.75,'Tst2'],[1,'Tst1']],ml:cur?44:58,xl:'ω',yl:'T',lines:L,
    labels:ref.map(([v,l])=>({x:v*0.5*xs,y:v*0.5*ys,s:l,dx:6,dy:-4,a:'start',c:'b'})),dots:cur&&cur.dot?[cur.dot]:[],hl:cur&&cur.TL?[{y:cur.TL,col:'--stop',label:'TL'}]:[],aria:'منحنى العزم والسرعة لمحرك التحكم للتيار المستمر'})}
/* DC servo forms */
function pcMotorSVG(id){let s=`<svg viewBox="0 0 360 180" role="img" aria-label="المحرك ذو الدائرة المطبوعة">`;
  s+=`<circle cx="90" cy="90" r="78" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.8"/>`;
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<circle cx="${(90+50*Math.cos(a)).toFixed(1)}" cy="${(90+50*Math.sin(a)).toFixed(1)}" r="14" fill="var(${i%2?'--blue-soft':'--stop-soft'})" stroke="var(${i%2?'--blue':'--stop'})" stroke-width="1.6"/>`+tx(90+50*Math.cos(a),94+50*Math.sin(a),i%2?'S':'N',{fs:11})}
  s+=tx(90,94,'8 PM',{c:'m',fs:10});
  s+=`<g id="${id}"><circle cx="270" cy="90" r="78" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2"/>`;
  for(let i=0;i<28;i++){const a=i*2*Math.PI/28,b=a+0.5;s+=`<path d="M${(270+16*Math.cos(a)).toFixed(1)} ${(90+16*Math.sin(a)).toFixed(1)}Q${(270+50*Math.cos(a+0.1)).toFixed(1)} ${(90+50*Math.sin(a+0.1)).toFixed(1)} ${(270+74*Math.cos(b)).toFixed(1)} ${(90+74*Math.sin(b)).toFixed(1)}" fill="none" stroke="var(--live)" stroke-width="1.4"/>`}
  s+=`<circle cx="270" cy="90" r="9" fill="var(--fg)"/></g><rect x="263" y="36" width="14" height="20" fill="var(--fg)" opacity=".8"/><rect x="263" y="124" width="14" height="20" fill="var(--fg)" opacity=".8"/>`+tx(270,176,'disc rotor (no iron)',{c:'m',fs:10});
  return s+'</svg>'}
function surfSVG(id){let s=`<svg viewBox="0 0 360 180" role="img" aria-label="دوار بملفات سطحية">`;
  s+=`<path d="M20 20A70 70 0 0 1 20 160" fill="none" stroke="var(--stop)" stroke-width="14" transform="translate(68 0)"/>`;
  s+=`<path d="M90 25A66 66 0 0 0 90 155" fill="none" stroke="var(--stop)" stroke-width="12"/><path d="M90 25A66 66 0 0 1 90 155" fill="none" stroke="var(--blue)" stroke-width="12"/>`.replace(/M90 25A66 66 0 0 0 90 155/,'M80 28A64 64 0 0 0 80 152').replace(/M90 25A66 66 0 0 1 90 155/,'M100 28A64 64 0 0 1 100 152');
  s=s.replace(/<path d="M20 20A70 70 0 0 1 20 160"[^>]*>/,'');
  s+=tx(48,92,'N',{fs:14})+tx(132,92,'S',{fs:14});
  s+=`<g id="${id}"><circle cx="90" cy="90" r="44" fill="var(--wire)" opacity=".6" stroke="var(--fg)"/>`;
  for(let i=0;i<20;i++){const a=i*Math.PI/10;s+=`<rect x="86" y="42" width="8" height="6" rx="1.5" fill="var(--live)" transform="rotate(${i*18} 90 90)"/>`}
  s+=`<circle cx="90" cy="90" r="6" fill="var(--fg)"/></g>`;
  s+=`<rect x="200" y="74" width="140" height="32" rx="4" fill="var(--wire)" opacity=".6" stroke="var(--fg)"/>`;for(let i=0;i<14;i++)s+=`<path d="M${206+i*10} 74V106" stroke="var(--live)" stroke-width="2"/>`;
  s+=S.w('M180 90H200')+S.w('M340 90H352')+tx(270,128,'long, small diameter',{c:'m',fs:10})+tx(270,62,'side view',{c:'m',fs:10});
  return s+'</svg>'}
function mcSVG(id){let s=`<svg viewBox="0 0 360 180" role="img" aria-label="المحرك ذو الملف المتحرك">`;
  s+=`<path d="M80 28A64 64 0 0 0 80 152" fill="none" stroke="var(--stop)" stroke-width="12"/><path d="M100 28A64 64 0 0 1 100 152" fill="none" stroke="var(--blue)" stroke-width="12"/>`+tx(48,92,'N',{fs:14})+tx(132,92,'S',{fs:14});
  s+=`<g id="${id}"><circle cx="90" cy="90" r="46" fill="none" stroke="var(--live)" stroke-width="6" stroke-dasharray="5 3"/><circle cx="90" cy="90" r="6" fill="var(--fg)"/><path d="M90 90L90 44" stroke="var(--fg)" stroke-width="2"/></g>`;
  // side view of the basket (cylinder, shaft on one side)
  s+=`<ellipse cx="320" cy="90" rx="14" ry="44" fill="none" stroke="var(--fg)" stroke-width="1.6"/><path d="M210 46H320M210 134H320" stroke="var(--fg)" stroke-width="1.6"/><ellipse cx="210" cy="90" rx="14" ry="44" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let i=0;i<9;i++)s+=`<path d="M${216+i*12} 46L${236+i*12} 134" stroke="var(--live)" stroke-width="1.6"/>`;
  s+=`<rect x="170" y="85" width="40" height="10" fill="var(--surface-2)" stroke="var(--fg)"/>`+tx(265,30,'basket coil',{c:'m',fs:10})+tx(186,112,'shaft',{c:'m',fs:10});
  return s+'</svg>'}
const FORMS={
 pc:{t:'ذو الدائرة المطبوعة',ref:'ص 53–54',fig:'(٣-٩)',svg:pcMotorSVG,txt:'«أنتجت فرنسا هذا النوع من المحركات في الخمسينيات الميلادية… العضو الثابت يتكون من عدد من الأقطاب المغناطيسية الدائمة (الشكل يبين ثمانية أقطاب دائمة)، تكتمل الدائرة المغناطيسية بواسطة الغطاء الذي يستعمل أيضاً لتثبيت الفرش. العضو الدوار على شكل قرص خال من الحديد، ملفات المنتج وضعت على جانبي القرص باستخدام تقنية الدائرة المطبوعة، التوصيل بين جانبي القرص يتم بواسطة ثقوب موصلة بين الجانبين، الفرش تتلامس مباشرة مع الملفات وتقوم بعمل المبدل.»'},
 sw:{t:'ذو ملفات المنتج السطحية',ref:'ص 54',fig:null,svg:surfSVG,txt:'«في هذا التصميم لا توجد مجار على السطح الخارجي للدوار، ملفات المنتج مثبتة على السطح الخارجي للدوار بواسطة مواد لاصقة قوية، العضو الثابت يتكون من أقطاب مغناطيسية دائمة، أو مغناطيسات كهربائية في المحركات الكبيرة نسبياً. العضو الدوار يصمم بحيث يكون طويلاً وصغير القطر للتقليل من قوة الطرد المركزية على ملفاته وأيضاً ليكون قصوره الذاتي صغيراً.»'},
 mc:{t:'ذو الملف المتحرك',ref:'ص 54',fig:'(٣-١٠)',svg:mcSVG,txt:'«تصميم آخر لمحركات التحكم للتيار المستمر بحيث يراعى فيه صغر القصور الذاتي للدوار وصغر محاثة ملفات الدوار، لتلبية متطلبات نظم التحكم. الجزء الوحيد المتحرك في هذا المحرك هو ملفات الدوار، حيث تم لفها على مادة غير موصلة وغير مغناطيسية على هيئة سلة (Basket) ذات محور واحد على أحد جانبيها، المجال المغناطيسي للعضو الثابت يحصل عليه بواسطة أقطاب مغناطيسية دائمة قوية.»'}
};
/* comparison features: value per type: 1 stated in the book, 0 not stated */
const FEAT=[
 ['iner','قصور ذاتي صغير',{pc:'«صغيراً جداً»',sw:'«ليكون قصوره الذاتي صغيراً»',mc:'«صغر القصور الذاتي للدوار»'}],
 ['ind','محاثة ملفات صغيرة',{pc:'«صغيرة جداً» ← ثابت زمني صغير جداً',mc:'«صغر محاثة ملفات الدوار»'}],
 ['noiron','الدوار بلا حديد',{pc:'«قرص خال من الحديد»',mc:'الملفات على مادة غير مغناطيسية، وهي الجزء الوحيد المتحرك'}],
 ['noslot','لا مجاري على سطح الدوار',{sw:'«لا توجد مجار على السطح الخارجي للدوار»'}],
 ['pm','أقطاب مغناطيسية دائمة في الثابت',{pc:'ثمانية أقطاب دائمة في الشكل',sw:'دائمة، أو مغناطيسات كهربائية في المحركات الكبيرة',mc:'«أقطاب مغناطيسية دائمة قوية»'}],
 ['cool','تبريد أفضل للملفات',{pc:'الملفات على السطح الخارجي للقرص'}],
 ['shape','طويل وصغير القطر',{sw:'لتقليل قوة الطرد المركزية على الملفات'}],
 ['use','الاستخدام مذكور',{pc:'أنظمة التحكم التي تتطلب حركة متقطعة'}]
];
B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'52–54',
 title:'محركات التحكم للتيار المستمر وأشكالها',
 summary:'محرك التحكم للتيار المستمر منفصل التغذية أو دائم المغناطيسية، والتحكم في سرعته بجهد المنتج، وثلاثة أشكال مصممة لقصور ذاتي صغير: الدائرة المطبوعة، والملفات السطحية، والملف المتحرك.',
 stations:[
  {intro:true},

  {st:1,short:'محرك التحكم المستمر',title:'٣-٢ محركات التحكم للتيار المستمر',ref:'ص 52',
   q:'في محرك التيار المستمر دائرتان: دائرة المجال ودائرة الدوار… فأي جهد نغيّره لنتحكم في السرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة محرك التحكم للتيار المستمر منفصل التغذية: دائرة المجال بجهد ومقاومة وملف، ودائرة المنتج بمقاومة وجهد الأطراف والقوة الدافعة العكسية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#E6E2F8"/><g fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"><path d="M30 80H44M92 80H112V96M112 184V214H30"/><path d="M200 112V60H236M292 60H334M200 188V230H334"/></g><g data-tip="جهد المجال ⟦Vf⟧: جهد ثابت يغذي ملفات المجال (العضو الثابت) من مصدر منفصل."><rect x="12" y="90" width="36" height="110" fill="transparent"/><circle cx="30" cy="80" r="5" fill="#2C4A40"/><circle cx="30" cy="214" r="5" fill="#2C4A40"/><text x="24" y="152" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="3">f</tspan></text></g><g data-tip="مقاومة دائرة المجال ⟦Rf⟧."><path d="M44 80l4 -8l8 16l8 -16l8 16l8 -16l8 16l4 -8" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><text x="68" y="62" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="10" dy="3">f</tspan></text></g><g data-tip="ملفات المجال على العضو الثابت، ويمر فيها تيار المجال ⟦If⟧. جهد المجال ثابت، فالمجال ثابت."><path d="M112 96a11 11 0 0 1 0 22a11 11 0 0 1 0 22a11 11 0 0 1 0 22a11 11 0 0 1 0 22" fill="none" stroke="#E8735A" stroke-width="5"/><text x="146" y="146" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="3">f</tspan></text></g><g data-tip="العضو الدوار (المنتج) مع الفرشتين: تتولد فيه القوة الدافعة الكهربائية العكسية ⟦Ea⟧ أثناء الدوران."><circle cx="200" cy="150" r="36" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><rect x="192" y="104" width="16" height="10" fill="#2C4A40"/><rect x="192" y="186" width="16" height="10" fill="#2C4A40"/><text x="200" y="146" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="10" dy="3">a</tspan></text><text x="200" y="170" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">+ −</text></g><g data-tip="مقاومة العضو الدوار ⟦Ra⟧: غالباً تكون كبيرة جداً حتى يصير منحنى العزم والسرعة خطياً ذا ميل سالب."><path d="M236 60l4 -8l8 16l8 -16l8 16l8 -16l8 16l8 -16l4 8" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><text x="264" y="42" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="10" dy="3">a</tspan></text></g><g data-tip="تيار المنتج ⟦Ia⟧ الداخل إلى العضو الدوار."><path d="M300 74H322" stroke="#2C4A40" stroke-width="2"/><polygon points="296,74 306,69 306,79" fill="#2C4A40"/><text x="312" y="92" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">a</tspan></text></g><g data-tip="جهد العضو الدوار ⟦Va⟧: هو الجهد الذي نغيّره للتحكم في السرعة، بينما يبقى جهد المجال ثابتاً."><rect x="318" y="72" width="36" height="150" fill="transparent"/><circle cx="334" cy="60" r="5" fill="#2C4A40"/><circle cx="334" cy="230" r="5" fill="#2C4A40"/><text x="334" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="334" y="252" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="336" y="152" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="3">a</tspan></text></g><text x="70" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العضو الثابت</text><text x="262" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العضو الدوار (المنتج)</text><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">مجال ثابت، وجهد دوار متغير</text></svg>`,
   cap:'فكرة الشكل (٣-٧) ص 52: دائرة المجال يساراً منفصلة عن دائرة المنتج يميناً.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف اسم كل جزء ودوره.</b>',
   side:[
    {book:String.raw`<p>محركات التحكم للتيار المستمر هي عبارة عن محرك تيار مستمر <b>منفصل التغذية</b> أو محرك تيار مستمر <b>دائم المغناطيسية</b>.</p>`,ref:'ص 52'},
    {predict:{q:'كيف نتحكم في سرعة محرك التحكم للتيار المستمر حسب الكتاب؟',opts:[
     ['بتغيير جهد المجال مع بقاء جهد الدوار ثابتاً',false,'العكس هو ما يذكره الكتاب: جهد المجال يبقى ثابتاً.'],
     ['بتغيير جهد العضو الدوار مع بقاء جهد المجال ثابتاً',true,String.raw`الكتاب ص 52: «يمكن التحكم في سرعته عن طريق التحكم في جهد العضو الدوار <span class="ltr">\(V_a\)</span> ويكون جهد المجال ثابتاً».`],
     ['بتغيير عدد الأقطاب',false,'تغيير عدد الأقطاب لا يُذكر هنا؛ التحكم بالجهد.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (٣-٧) يوضح شكل هذا المحرك الذي يمكن التحكم في سرعته عن طريق التحكم في <b>جهد العضو الدوار (<span class="ltr">V<sub>a</sub></span>)</b> ويكون <b>جهد المجال ثابتاً</b>، وغالباً تكون مقاومة العضو الدوار كبيرة جداً حتى يكون منحنى العزم والسرعة خطياً ذا ميل سالب كما هو واضح من الشكل (٣-٨).</p>`,ref:'ص 52'},
    {html:'<figure class="fig" style="margin-top:0"><div class="svgbox" style="max-width:440px;margin-inline:auto">'+fig38SVG(null)+'</div><figcaption><b>الشكل (٣-٨)</b> منحنى العزم والسرعة لمحرك التحكم للتيار المستمر عند تغيير الجهد <span class="ltr">(V<sub>a1</sub> &gt; V<sub>a2</sub> &gt; V<sub>a3</sub>)</span> (إعادة رسم) <span class="ref">ص 52</span></figcaption></figure>'},
    {tip:String.raw`<p>في هذا الدرس <span class="ltr">\(V_a\)</span> هو جهد <b>المنتج (العضو الدوار)</b> في محرك التيار المستمر، وليس جهد ملف التحكم في المحرك المتردد. الرموز في الشكل (٣-٧): <span class="ltr">\(V_f, R_f, I_f\)</span> لدائرة المجال، و <span class="ltr">\(V_a, R_a, I_a\)</span> لدائرة المنتج، و <span class="ltr">\(E_a\)</span> القوة الدافعة الكهربائية العكسية.</p>`,title:'انتبه للرموز'},
    {add:String.raw`<p>لاحظ التشابه مع محرك التحكم المتردد: هناك جعلنا مقاومة القفص كبيرة، وهنا مقاومة العضو الدوار كبيرة جداً؛ والنتيجة في الحالتين خطوط عزم وسرعة مستقيمة متوازية ذات ميل سالب تتحرك بتغيير الجهد (قارن الشكل (٣-٨) بالشكل (٣-٣)).</p>`,title:'نفس الفكرة في المحركين'},
    {title:'مختبر مصغّر: جهد المنتج والحمل',widget:(el,B)=>DCML.lab(el,B,{intro:'خطوط العزم والسرعة في الشكل (٣-٨) متوازية، لكل جهد للمنتج خط. اختر الجهد وعزم الحمل، وراقب السرعة التي يستقر عندها المحرك. القيم نسبية (<span class="ltr">pu</span>): عزم البدء وسرعة اللاحمل عند <span class="ltr">V<sub>a1</sub></span> كل منهما <span class="ltr">1</span>.',
 predict:{q:'خفّضنا جهد المنتج من <span class="ltr">V<sub>a1</sub></span> إلى <span class="ltr">V<sub>a3</sub></span> والحمل كما هو. ماذا يحدث؟',opts:[
  ['تزيد السرعة',false,'جهد أقل يعطي خطاً أدنى، فيقطع خط الحمل عند سرعة أقل.'],
  ['تقل السرعة، لأن الخط ينزل موازياً لنفسه',true,'«يمكن التحكم في سرعته عن طريق التحكم في جهد العضو الدوار (Va)» (ص 52)، والخطوط في الشكل (٣-٨) متوازية ذات ميل سالب.'],
  ['يتغير ميل الخط فقط',false,'الخطوط في الشكل (٣-٨) متوازية؛ الذي يتغير هو مكانها.']]},
 ins:[{k:'Va',l:'جهد المنتج',seg:[[1,'V<sub>a1</sub>'],[0.75,'V<sub>a2</sub>'],[0.5,'V<sub>a3</sub>']],v:1},{k:'TL',l:'عزم الحمل (pu)',min:0,max:0.9,step:0.05,v:0.3,dp:2}],ill:true,
 calc:(s)=>{const w=s.Va-s.TL,run=w>0.005;const cv=[1,0.75,0.5].filter(v=>v!==s.Va).map(v=>({pts:[[0,v],[v,0]],col:'--muted',w:1.4,dash:'4 4'}));
  cv.push({pts:[[0,s.TL],[1.1,s.TL]],col:'--stop',w:1.8,dash:'6 4'},{pts:[[0,s.Va],[s.Va,0]],col:'--blue',w:3});
  return {plot:{xr:[0,1.1],yr:[0,1.1],xt:[0,0.5,1],yt:[0,0.5,1],xl:'ω (pu)',yl:'T (pu)',curves:cv,cur:run?[w,s.TL]:null},
   facts:[['عزم البدء',DCML.fm(B,s.Va,2)+' pu'],['سرعة اللاحمل',DCML.fm(B,s.Va,2)+' pu'],['سرعة التشغيل',run?DCML.fm(B,w,2)+' pu':'لا يدور',run?'hi':'bad']],
   msg:run?'':'عزم الحمل أكبر من عزم البدء عند هذا الجهد أو يساويه، فلا يبدأ المحرك الحركة.',cls:run?'':'warn'}}})}
   ]},

  {st:2,short:'أشكال مختلفة',title:'٣-٢-١ أشكال مختلفة من محركات التحكم للتيار المستمر',ref:'ص 53',
   q:'الأجزاء الرئيسية هي نفسها في كل آلات التيار المستمر… فماذا يمكن أن يغيّر المصمم ليناسب التحكم؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات للأشكال الثلاثة: الدائرة المطبوعة، ملفات المنتج السطحية، الملف المتحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الشكل الأول: ذو الدائرة المطبوعة. الدوار قرص خالٍ من الحديد وملفاته مطبوعة على وجهيه."><rect x="40" y="34" width="280" height="70" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="284" cy="69" r="26" fill="#E9B949" stroke="#2C4A40" stroke-width="2.5"/><path d="M284 69Q296 58 302 52M284 69Q299 72 309 70M284 69Q292 84 296 92M284 69Q272 80 266 86M284 69Q269 66 259 68M284 69Q276 54 272 46" fill="none" stroke="#B9852A" stroke-width="2"/><circle cx="284" cy="69" r="5" fill="#2C4A40"/><text x="150" y="75" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">ذو الدائرة المطبوعة</text></g><g data-tip="الشكل الثاني: ذو ملفات المنتج السطحية. لا مجاري على الدوار، والملفات ملصقة على سطحه، وهو طويل وصغير القطر."><rect x="40" y="122" width="280" height="70" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="143" width="58" height="28" rx="4" fill="#7F9A90" stroke="#2C4A40" stroke-width="2"/><path d="M258 143V171M268 143V171M278 143V171M288 143V171M298 143V171" stroke="#E9B949" stroke-width="3"/><path d="M240 157H250" stroke="#2C4A40" stroke-width="4"/><text x="150" y="163" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">ذو ملفات المنتج السطحية</text></g><g data-tip="الشكل الثالث: ذو الملف المتحرك. الجزء الوحيد المتحرك هو الملفات، ملفوفة على هيئة سلة بلا حديد."><rect x="40" y="210" width="280" height="70" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><ellipse cx="302" cy="245" rx="7" ry="20" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M256 225H302M256 265H302" stroke="#2C4A40" stroke-width="2"/><ellipse cx="256" cy="245" rx="7" ry="20" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><path d="M264 225L276 265M276 225L288 265M288 225L300 265" stroke="#B9852A" stroke-width="2"/><path d="M236 245H250" stroke="#2C4A40" stroke-width="4"/><text x="150" y="251" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">ذو الملف المتحرك</text></g><text x="180" y="306" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ثلاثة تصميمات لدوار خفيف</text></svg>`,
   cap:'الأشكال الثلاثة التي يذكرها الكتاب، وكل منها في محطة خاصة به بعد هذه.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف ما يميزها.</b>',
   side:[
    {book:String.raw`<p>توجد بعض الأشكال المختلفة من محركات التحكم للتيار المستمر وتتكون من نفس الأجزاء الرئيسية لآلات التيار المستمر، إلا أنه تم تعديل التصميم من أجل أن يتناسب مع تطبيقات التحكم، وفيما يلي بعض الأشكال المختلفة للمحرك:</p>`,ref:'ص 53'}
   ],
   body:[
    {tip:String.raw`<p>الفكرة المشتركة بين الأشكال الثلاثة: <b>دوار خفيف</b> (قصور ذاتي صغير) و<b>محاثة ملفات صغيرة</b>، فيصير الثابت الزمني صغيراً ويستجيب المحرك بسرعة لتغير الجهد. اقرأ كل شكل وابحث: كيف حقق المصمم هذين الهدفين؟</p>`,title:'ابحث عن الهدف المشترك'},
    {predict:{q:'ما الذي تغيّر في هذه الأشكال مقارنة بآلة التيار المستمر العادية؟',opts:[
     ['تصميم الأجزاء ليناسب تطبيقات التحكم، مع بقاء الأجزاء الرئيسية نفسها',true,'الكتاب ص 53: «تتكون من نفس الأجزاء الرئيسية لآلات التيار المستمر، إلا أنه تم تعديل التصميم».'],
     ['أُلغي المبدل والفرش في الأشكال الثلاثة',false,'في محرك الدائرة المطبوعة مثلاً الفرش موجودة وتقوم بعمل المبدل.'],
     ['صارت تعمل بالتيار المتردد',false,'ما زالت محركات تيار مستمر.']]}},
    {title:'مختبر مصغّر: أي شكل هذا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اضغط شكل محرك التحكم للتيار المستمر الذي يصفه (الأشكال الثلاثة في المحطات التالية).',cats:['الدائرة المطبوعة','الملفات السطحية','الملف المتحرك'],items:[
 ['دوار على شكل قرص خالٍ من الحديد، وملفاته على جانبي القرص',0,'«العضو الدوار على شكل قرص خال من الحديد، ملفات المنتج وضعت على جانبي القرص باستخدام تقنية الدائرة المطبوعة» (ص 53–54).'],
 ['لا مجاري على سطح الدوار، والملفات مثبتة عليه بمواد لاصقة قوية',1,'هذا وصف المحرك ذي ملفات المنتج السطحية (ص 54).'],
 ['الملفات ملفوفة على مادة غير موصلة وغير مغناطيسية على هيئة سلة',2,'«الجزء الوحيد المتحرك في هذا المحرك هو ملفات الدوار، حيث تم لفها على مادة غير موصلة وغير مغناطيسية على هيئة سلة» (ص 54).'],
 ['الفرش تلامس الملفات مباشرة وتقوم بعمل المبدل',0,'في محرك الدائرة المطبوعة «الفرش تتلامس مباشرة مع الملفات وتقوم بعمل المبدل» (ص 53–54).'],
 ['دوار طويل وصغير القطر لتقليل قوة الطرد المركزية على ملفاته',1,'لأن الملفات ملصقة على السطح الخارجي للدوار (ص 54).']]})}
   ]},

  {st:3,short:'الدائرة المطبوعة',title:'٣-٢-١-١ محركات التحكم ذات الدائرة المطبوعة',ref:'ص 53–54',
   q:'دوار على شكل قرص رقيق بلا حديد… فكيف يدور، ومن أين يأتيه التيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك ذو الدائرة المطبوعة: قاعدة عليها ثمانية أقطاب دائمة، وقرص دوار بملفات مطبوعة وفرشتين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#DDEFE6"/><circle cx="95" cy="140" r="76" fill="#9DB5AC" stroke="#2C4A40" stroke-width="3"/><g data-tip="القطب الشمالي ⟦N⟧: قطب مغناطيسي دائم على القاعدة."><circle cx="145" cy="140" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="95" cy="190" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="45" cy="140" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="95" cy="90" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="القطب الجنوبي ⟦S⟧: قطب مغناطيسي دائم على القاعدة. الأقطاب الدائمة تتبادل شمالي وجنوبي."><circle cx="130.4" cy="175.4" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="59.6" cy="175.4" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="59.6" cy="104.6" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="130.4" cy="104.6" r="15" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" text-anchor="middle"><text x="145" y="144">N</text><text x="95" y="194">N</text><text x="45" y="144">N</text><text x="95" y="94">N</text><text x="130.4" y="179.4">S</text><text x="59.6" y="179.4">S</text><text x="59.6" y="108.6">S</text><text x="130.4" y="108.6">S</text></g><circle cx="95" cy="140" r="8" fill="#2C4A40"/><g data-tip="القرص الدوار: خالٍ من الحديد، وملفات المنتج مطبوعة على وجهيه بتقنية الدائرة المطبوعة."><circle cx="265" cy="140" r="76" fill="#E9B949" stroke="#B9852A" stroke-width="3"/><g fill="none" stroke="#B9852A" stroke-width="1.8"><path d="M265 116Q290 96 296 70"/><path d="M265 116Q300 108 320 88"/><path d="M265 116Q306 124 334 116"/><path d="M265 116Q302 140 326 156"/><path d="M265 116Q292 152 302 182"/><path d="M265 116Q276 160 270 208"/><path d="M265 116Q256 160 236 204"/><path d="M265 116Q236 150 210 180"/><path d="M265 116Q228 132 196 150"/><path d="M265 116Q226 110 196 112"/><path d="M265 116Q234 92 216 76"/><path d="M265 116Q252 88 250 66"/></g></g><g data-tip="ثقوب موصلة بين وجهي القرص: تصل الملفات المطبوعة على الوجه الأمامي بالتي على الوجه الخلفي."><circle cx="265" cy="140" r="30" fill="#E9B949" stroke="none"/><g fill="#2C4A40"><circle cx="265" cy="114" r="3"/><circle cx="291" cy="140" r="3"/><circle cx="265" cy="166" r="3"/><circle cx="239" cy="140" r="3"/><circle cx="283.4" cy="121.6" r="3"/><circle cx="283.4" cy="158.4" r="3"/><circle cx="246.6" cy="158.4" r="3"/><circle cx="246.6" cy="121.6" r="3"/></g></g><circle cx="265" cy="140" r="9" fill="#2C4A40"/><g data-tip="الفرش: تتلامس مباشرة مع الملفات المطبوعة وتقوم بعمل المبدل. ويُثبتها الغطاء الذي يكمل الدائرة المغناطيسية."><rect x="257" y="52" width="16" height="22" rx="2" fill="#2C4A40"/><rect x="257" y="206" width="16" height="22" rx="2" fill="#2C4A40"/></g><text x="95" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ثمانية أقطاب دائمة</text><text x="265" y="248" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قرص بلا حديد</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">القاعدة يساراً والقرص الدوار يميناً</text></svg>`,
   cap:'رسم مبسط لفكرة الشكل (٣-٩) ص 53 (الأصل صورة فوتوغرافية).<br><b>مرّر المؤشر على الأقطاب والقرص والثقوب والفرش (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>أنتجت فرنسا هذا النوع من المحركات في الخمسينيات الميلادية، وتركيبه كما هو مبين في الشكل (٣-٩) العضو الثابت يتكون من عدد من <b>الأقطاب المغناطيسية الدائمة</b> (الشكل يبين ثمانية أقطاب دائمة)، تكتمل الدائرة المغناطيسية بواسطة الغطاء الذي يستعمل أيضاً لتثبيت الفرش.</p>`,ref:'ص 53'}
   ],
   body:[
    {book:String.raw`<p>العضو الدوار على شكل <b>قرص خال من الحديد</b>، ملفات المنتج وضعت على جانبي القرص باستخدام تقنية الدائرة المطبوعة، التوصيل بين جانبي القرص يتم بواسطة ثقوب موصلة بين الجانبين، الفرش تتلامس مباشرة مع الملفات وتقوم بعمل المبدل.</p>
     <p>بسبب خلو تركيب العضو الدوار من الحديد فإن <b>قصوره الذاتي يصبح صغيراً جداً</b>، كما أن <b>محاثة ملفاته تكون صغيرة جداً</b> وبالتالي ذات ثابت زمني صغير جداً، وهذه من أهم متطلبات نظم التحكم الآلي، كما أن وجود ملفات الدوار على السطح الخارجي للقرص يحسن من تبريد الملفات، يستخدم هذا النوع من المحركات في أنظمة التحكم التي تتطلب <b>حركة متقطعة</b>.</p>`,ref:'ص 53–54'},
    {predict:{q:'ما سبب صغر الثابت الزمني لملفات الدوار في هذا المحرك؟',opts:[
     ['كثرة الأقطاب الدائمة على القاعدة',false,'عدد الأقطاب لا يحدد محاثة ملفات الدوار.'],
     ['تبريد الملفات الجيد',false,'التبريد ميزة أخرى يذكرها الكتاب، لكنه لا يصغّر المحاثة.'],
     ['الدوار خالٍ من الحديد، فمحاثة ملفاته صغيرة جداً',true,'بلا حديد تصير المحاثة صغيرة جداً، فيصير الثابت الزمني صغيراً جداً (ص 54).']]}},
    {tip:String.raw`<p>«المبدل» في المحرك العادي حلقة من القطع النحاسية تلامسها الفرش. هنا لا يوجد مبدل منفصل: الفرش تلامس <b>الملفات المطبوعة نفسها</b> على القرص، فتقوم بعمل المبدل.</p>`,title:'أين المبدل؟'},
    {add:String.raw`<p>يُعرف هذا النوع أيضاً بالمحرك القرصي لأنه مسطح ورقيق. ومن أمثلة «الحركة المتقطعة» تقديم شريط أو ورق خطوة بعد خطوة، وتحريك رأس طابعة أو راسمة: يبدأ المحرك ويتوقف مرات كثيرة في الثانية، فيلزم دوار خفيف جداً.</p>`,title:'أمثلة للحركة المتقطعة'},
    {title:'تحقق سريع: محرك الدائرة المطبوعة',widget:(el,B)=>DCML.tf(el,B,{intro:'اضغط «صح» أو «خطأ» لكل عبارة.',items:[
 ['العضو الثابت في هذا المحرك أقطاب مغناطيسية دائمة، وتكتمل دائرتها المغناطيسية بالغطاء الذي يثبت الفرش.',true,'(ص 53).'],
 ['قصوره الذاتي كبير لأن ملفاته على جانبي القرص.',false,'«بسبب خلو تركيب العضو الدوار من الحديد فإن قصوره الذاتي يصبح صغيراً جداً» (ص 54).'],
 ['وجود الملفات على السطح الخارجي للقرص يحسّن تبريدها.',true,'(ص 54).'],
 ['يستخدم في أنظمة التحكم التي تتطلب حركة مستمرة بسرعة ثابتة فقط.',false,'الكتاب يقول: «يستخدم هذا النوع من المحركات في أنظمة التحكم التي تتطلب حركة متقطعة» (ص 54).']]})}
   ]},

  {st:4,short:'الملفات السطحية',title:'٣-٢-١-٢ محركات التحكم ذات ملفات المنتج السطحية',ref:'ص 54',
   q:'إذا لم نحفر مجاري في الدوار… فأين نضع الملفات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دوار أملس بلا مجاري ملفاته ملصقة على سطحه بين قطبين دائمين، ومنظر جانبي يبين أنه طويل وصغير القطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#F7DCC8"/><g data-tip="أقطاب العضو الثابت: مغناطيسية دائمة، أو مغناطيسات كهربائية في المحركات الكبيرة نسبياً."><path d="M70 74A70 70 0 0 0 70 206" fill="none" stroke="#E8735A" stroke-width="16"/><path d="M110 74A70 70 0 0 1 110 206" fill="none" stroke="#4FB3A9" stroke-width="16"/><text x="34" y="145" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">N</text><text x="146" y="145" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><g data-tip="قلب الدوار: أملس، لا توجد مجار على سطحه الخارجي."><circle cx="90" cy="140" r="40" fill="#7F9A90" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="ملفات المنتج: مثبتة على السطح الخارجي للدوار بمواد لاصقة قوية، بدل وضعها في مجار."><g fill="#E9B949" stroke="#B9852A" stroke-width="1"><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(0 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(24 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(48 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(72 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(96 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(120 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(144 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(168 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(192 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(216 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(240 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(264 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(288 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(312 90 140)"/><rect x="86" y="96" width="8" height="6" rx="1.5" transform="rotate(336 90 140)"/></g></g><circle cx="90" cy="140" r="7" fill="#2C4A40"/><g data-tip="منظر جانبي للدوار: طويل وصغير القطر، لتقليل قوة الطرد المركزية على ملفاته وليكون قصوره الذاتي صغيراً."><rect x="196" y="120" width="140" height="40" rx="5" fill="#7F9A90" stroke="#2C4A40" stroke-width="2.5"/><path d="M206 120V160M218 120V160M230 120V160M242 120V160M254 120V160M266 120V160M278 120V160M290 120V160M302 120V160M314 120V160M326 120V160" stroke="#E9B949" stroke-width="3"/><path d="M178 140H196M336 140H350" stroke="#2C4A40" stroke-width="5"/></g><text x="266" y="106" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">منظر جانبي</text><text x="266" y="186" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">طويل وصغير القطر</text><text x="90" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مقطع عرضي</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لا مجاري: الملفات على السطح</text></svg>`,
   cap:'رسم توضيحي (الكتاب لا يعطي شكلاً لهذا النوع): مقطع عرضي يساراً ومنظر جانبي يميناً.<br><b>مرّر المؤشر على الأقطاب والقلب والملفات والمنظر الجانبي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>في هذا التصميم <b>لا توجد مجار</b> على السطح الخارجي للدوار، ملفات المنتج مثبتة على السطح الخارجي للدوار بواسطة <b>مواد لاصقة قوية</b>، العضو الثابت يتكون من أقطاب مغناطيسية دائمة، أو مغناطيسات كهربائية في المحركات الكبيرة نسبياً.</p>`,ref:'ص 54'}
   ],
   body:[
    {book:String.raw`<p>العضو الدوار يصمم بحيث يكون <b>طويلاً وصغير القطر</b> للتقليل من قوة الطرد المركزية على ملفاته وأيضاً ليكون قصوره الذاتي صغيراً.</p>`,ref:'ص 54'},
    {predict:{q:'لماذا يُصمم دوار هذا المحرك طويلاً وصغير القطر؟',opts:[
     ['ليتسع لعدد أكبر من المجاري',false,'هذا التصميم لا مجاري فيه أصلاً.'],
     ['لكي يدور ببطء',false,'الكتاب لا يذكر ذلك؛ الهدف حماية الملفات وتصغير القصور الذاتي.'],
     ['لتقليل قوة الطرد المركزية على ملفاته الملصقة، وليكون قصوره الذاتي صغيراً',true,'السببان معاً في نص الكتاب ص 54.']]}},
    {tip:String.raw`<p>الملفات هنا ليست محبوسة داخل مجاري، بل ملصقة على السطح. عند الدوران السريع تحاول قوة الطرد المركزية قذفها إلى الخارج، وهذه القوة تكبر كلما كبر قطر الدوار. لذلك يُصغّر القطر، ويُعوَّض بزيادة الطول.</p>`,title:'لماذا يهم الطرد المركزي هنا؟'},
    {title:'مختبر مصغّر: ماذا لو غيّرنا شكل الدوار؟',widget:(el,B)=>DCML.cases(el,B,{intro:'الملفات في هذا المحرك ملصقة على سطح الدوار، لا محبوسة في مجارٍ.',cases:[
 {q:'ماذا لو صممنا الدوار قصيراً وكبير القطر بدل طويل وصغير القطر؟',opts:[
  ['تقل قوة الطرد المركزية على الملفات',false,'العكس: القطر الأكبر يجعل الملفات أبعد عن المحور فتزيد القوة التي تحاول قذفها.'],
  ['تزيد قوة الطرد المركزية على الملفات الملصقة، ويكبر القصور الذاتي',true,'الكتاب يجعله «طويلاً وصغير القطر للتقليل من قوة الطرد المركزية على ملفاته وأيضاً ليكون قصوره الذاتي صغيراً» (ص 54).'],
  ['لا يتغير شيء ما دام عدد الملفات نفسه',false,'شكل الدوار هو ما يحدد بُعد الملفات عن المحور وقصوره الذاتي.']]},
 {q:'محرك كبير نسبياً من هذا النوع: من أي شيء يُصنع عضوه الثابت؟',opts:[
  ['من قفص سنجابي',false,'القفص السنجابي دوار المحرك الحثي، لا ثابت هذا المحرك.'],
  ['من أقطاب مغناطيسية دائمة فقط في كل الأحجام',false,'الكتاب يذكر بديلاً في المحركات الكبيرة نسبياً.'],
  ['من مغناطيسات كهربائية (والأقطاب الدائمة في غيره)',true,'«العضو الثابت يتكون من أقطاب مغناطيسية دائمة، أو مغناطيسات كهربائية في المحركات الكبيرة نسبياً» (ص 54).']]}]})}
   ]},

  {st:5,short:'الملف المتحرك',title:'٣-٢-١-٣ محركات التحكم ذات الملف المتحرك',ref:'ص 54',
   q:'ماذا لو لم يدُر في المحرك إلا الملفات وحدها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك ذو الملف المتحرك: سلة ملفات أسطوانية بمحور من جانب واحد بين قطبين مغناطيسيين دائمين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#E6E2F8"/><g data-tip="أقطاب مغناطيسية دائمة قوية: تعطي المجال المغناطيسي للعضو الثابت."><rect x="120" y="40" width="200" height="34" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="120" y="226" width="200" height="34" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="220" y="62" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">N</text><text x="220" y="248" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">S</text></g><g data-tip="سلة الملفات ⟦Basket⟧: ملفات الدوار ملفوفة على مادة غير موصلة وغير مغناطيسية، وهي الجزء الوحيد المتحرك في المحرك."><path d="M134 104H306M134 196H306" stroke="#2C4A40" stroke-width="2.5"/><ellipse cx="306" cy="150" rx="15" ry="46" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#B9852A" stroke-width="2.5"><path d="M146 104L176 196M168 104L198 196M190 104L220 196M212 104L242 196M234 104L264 196M256 104L286 196M278 104L302 180"/></g><ellipse cx="134" cy="150" rx="15" ry="46" fill="#E9B949" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="المحور: محور واحد على أحد جانبي السلة، يدور معها."><rect x="40" y="143" width="80" height="14" rx="3" fill="#2C4A40"/><path d="M74 128A9 22 0 1 0 74 172" fill="none" stroke="#12855A" stroke-width="3"/><polygon points="74,178 66,168 80,166" fill="#12855A"/></g><text x="220" y="94" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">سلة الملفات</text><text x="80" y="198" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المحور</text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الجزء الوحيد المتحرك: الملفات</text></svg>`,
   cap:'رسم مبسط لفكرة الشكل (٣-١٠) ص 54 (الأصل صورة فوتوغرافية).<br><b>مرّر المؤشر على الأقطاب والسلة والمحور (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>تصميم آخر لمحركات التحكم للتيار المستمر بحيث يراعى فيه، <b>صغر القصور الذاتي للدوار</b> و<b>صغر محاثة ملفات الدوار</b>، لتلبية متطلبات نظم التحكم.</p>`,ref:'ص 54'}
   ],
   body:[
    {book:String.raw`<p>الجزء الوحيد المتحرك في هذا المحرك هو ملفات الدوار، حيث تم لفها على مادة غير موصلة وغير مغناطيسية على هيئة <b>سلة (<span class="ltr">Basket</span>)</b> ذات محور واحد على أحد جانبيها، المجال المغناطيسي للعضو الثابت يحصل عليه بواسطة أقطاب مغناطيسية دائمة قوية. الشكل (٣-١٠) يوضح تركيب الدوار لهذا المحرك.</p>`,ref:'ص 54'},
    {predict:{q:'ما الجزء الوحيد المتحرك في محرك الملف المتحرك؟',opts:[
     ['الأقطاب المغناطيسية الدائمة',false,'الأقطاب الدائمة في العضو الثابت، ولا تتحرك.'],
     ['ملفات الدوار الملفوفة على هيئة سلة',true,'الكتاب ص 54: «الجزء الوحيد المتحرك في هذا المحرك هو ملفات الدوار».'],
     ['قلب حديدي داخل الملفات',false,'الملفات ملفوفة على مادة غير مغناطيسية؛ لا يدور معها حديد.']]}},
    {tip:String.raw`<p>لا حديد يدور مع الملفات: فالجزء الدوار خفيف (قصور ذاتي صغير)، ومحاثة الملفات صغيرة لأن المادة التي لُفّت عليها غير مغناطيسية. الهدفان اللذان رأيتهما في محرك الدائرة المطبوعة تحققا هنا بطريقة أخرى.</p>`,title:'قارن بالدائرة المطبوعة'},
    {title:'لماذا شرطان؟',tip:String.raw`<p>«غير موصلة» و«غير مغناطيسية» شرطان مختلفان: غير موصلة حتى لا تمر فيها تيارات تضيع القدرة، وغير مغناطيسية حتى لا تزيد المحاثة والقصور الذاتي كما يفعل الحديد.</p>`},
    {title:'تحقق سريع: محرك الملف المتحرك',widget:(el,B)=>DCML.tf(el,B,{intro:'اضغط «صح» أو «خطأ» لكل عبارة.',items:[
 ['الجزء الوحيد المتحرك في هذا المحرك هو ملفات الدوار.',true,'(ص 54).'],
 ['تُلف ملفات الدوار على قلب من الحديد لتقوية المجال.',false,'تُلف «على مادة غير موصلة وغير مغناطيسية على هيئة سلة» (ص 54)، فتبقى المحاثة والقصور الذاتي صغيرين.'],
 ['يحصل العضو الثابت على مجاله من أقطاب مغناطيسية دائمة قوية.',true,'(ص 54).'],
 ['الهدفان من هذا التصميم: صغر القصور الذاتي للدوار وصغر محاثة ملفاته.',true,'«لتلبية متطلبات نظم التحكم» (ص 54).']]})}
   ]},

  {recap:[
   String.raw`محرك التحكم للتيار المستمر محرك منفصل التغذية أو دائم المغناطيسية، نتحكم في سرعته بجهد العضو الدوار <span class="ltr">\(V_a\)</span> مع ثبات جهد المجال (الشكل (٣-٧)).`,
   String.raw`مقاومة العضو الدوار كبيرة جداً، فيصير منحنى العزم والسرعة خطياً ذا ميل سالب، والخطوط متوازية لقيم <span class="ltr">\(V_a\)</span> المختلفة (الشكل (٣-٨)).`,
   String.raw`الدائرة المطبوعة: قرص بلا حديد ملفاته مطبوعة على وجهيه والفرش تقوم بعمل المبدل؛ قصور ذاتي ومحاثة صغيران جداً، للحركة المتقطعة (ص 53–54).`,
   String.raw`الملفات السطحية: لا مجاري، والملفات ملصقة على سطح دوار طويل صغير القطر (ص 54).`,
   String.raw`الملف المتحرك: الجزء الوحيد المتحرك سلة ملفات على مادة غير موصلة وغير مغناطيسية، بين أقطاب دائمة قوية (ص 54).`]}
],
 theory:[
  {h:'٣-٢ محركات التحكم للتيار المستمر D.C Servo-Motors',ref:'ص 52',html:`<p>«محركات التحكم للتيار المستمر هي عبارة عن محرك تيار مستمر <b>منفصل التغذية</b> أو محرك تيار مستمر <b>دائم المغناطيسية</b>.»</p>
   <p>«الشكل (٣-٧) يوضح شكل هذا المحرك الذي يمكن التحكم في سرعته عن طريق التحكم في <b>جهد العضو الدوار (\u202BV<sub>a</sub>\u202C)</b> ويكون <b>جهد المجال ثابتاً</b>، وغالباً تكون مقاومة العضو الدوار كبيرة جداً حتى يكون منحنى العزم والسرعة خطياً ذا ميل سالب كما هو واضح من الشكل (٣-٨).»</p>`},
  {fig:'(٣-٧)',ref:'ص 52',caption:'محرك التحكم للتيار المستمر ذو التغذية المستقلة لملفات المجال (إعادة رسم)',draw:()=>box(dcCircuitSVG({}),560)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في هذا الدرس <span class="ltr">\\(V_a\\)</span> هو جهد <b>المنتج (العضو الدوار)</b> في محرك التيار المستمر، وليس جهد ملف التحكم في المحرك المتردد. الرموز في الشكل: <span class="ltr">\\(V_f, R_f, I_f\\)</span> لدائرة المجال، و <span class="ltr">\\(V_a, R_a, I_a\\)</span> لدائرة المنتج، و <span class="ltr">\\(E_a\\)</span> القوة الدافعة الكهربائية العكسية.'},
  {fig:'(٣-٨)',ref:'ص 52',caption:'منحنى العزم والسرعة لمحرك التحكم للتيار المستمر عند تغيير الجهد \u202B(Va1 > Va2 > Va3)\u202C (إعادة رسم)',draw:()=>box(fig38SVG(null),460)},
  {h:'٣-٢-١ أشكال مختلفة من محركات التحكم للتيار المستمر',ref:'ص 53',html:'<p>«توجد بعض الأشكال المختلفة من محركات التحكم للتيار المستمر وتتكون من نفس الأجزاء الرئيسية لآلات التيار المستمر، إلا أنه تم تعديل التصميم من أجل أن يتناسب مع تطبيقات التحكم، وفيما يلي بعض الأشكال المختلفة للمحرك:»</p>'},
  {h:'٣-٢-١-١ محركات التحكم ذات الدائرة المطبوعة (Printed-Circuit Motors)',ref:'ص 53–54',html:`<p>${FORMS.pc.txt}</p><p>«بسبب خلو تركيب العضو الدوار من الحديد فإن قصوره الذاتي يصبح صغيراً جداً، كما أن محاثة ملفاته تكون صغيرة جداً وبالتالي ذات ثابت زمني صغير جداً، وهذه من أهم متطلبات نظم التحكم الآلي، كما أن وجود ملفات الدوار على السطح الخارجي للقرص يحسن من تبريد الملفات، يستخدم هذا النوع من المحركات في أنظمة التحكم التي تتطلب حركة متقطعة.»</p>`},
  {fig:'(٣-٩)',ref:'ص 53',caption:'المحرك ذو الدائرة المطبوعة: يساراً القاعدة بثمانية أقطاب دائمة، ويميناً القرص الدوار بملفاته المطبوعة (رسم مبسط بدل الصورة)',draw:()=>box(pcMotorSVG('u3pcS'),520)},
  {h:'٣-٢-١-٢ محركات التحكم ذات ملفات المنتج السطحية',ref:'ص 54',html:`<p>${FORMS.sw.txt}</p>`},
  {fig:'',caption:'<b>رسم توضيحي (ليس في الكتاب شكل لهذا النوع):</b> دوار أملس بلا مجار وملفاته ملصقة على سطحه، وهو طويل وصغير القطر',ref:'',draw:()=>box(surfSVG('u3swS'),520)},
  {h:'٣-٢-١-٣ محركات التحكم ذات الملف المتحرك',ref:'ص 54',html:`<p>${FORMS.mc.txt} الشكل (٣-١٠) يوضح تركيب الدوار لهذا المحرك.</p>`},
  {fig:'(٣-١٠)',ref:'ص 54',caption:'المحرك ذو الملف المتحرك: الدوار سلة من الملفات بمحور على جانب واحد، والثابت أقطاب دائمة (رسم مبسط بدل الصورة)',draw:()=>box(mcSVG('u3mcS'),520)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الشكلان (٣-٩) و (٣-١٠) في الكتاب صورتان فوتوغرافيتان؛ أعدنا رسم الفكرة فقط. الفكرة المشتركة بين الأشكال الثلاثة: <b>دوار خفيف</b> (قصور ذاتي صغير) و<b>محاثة صغيرة</b>، فيصير الثابت الزمني صغيراً ويستجيب المحرك بسرعة لتغير الجهد.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'العنوان ص 53 مطبوع «٣-٢-١ اشكال مختلفة…» والأنواع بعده مرقمة ٣-٢-١-١ إلى ٣-٢-١-٣. وفي ص 54 سقطت نقطة قبل «الشكل (٣-١٠)» في عبارة «أقطاب مغناطيسية دائمة قوية الشكل (٣-١٠) يوضح…». نقلنا المعنى بعلامات ترقيم مصححة.'+'</div>'}
 ],
 lab:(el)=>{
  let Va=0.75,TL=0.1,pm=false,w=0,th=0,form='pc',feat=null,ht=0,lastSig='';const flags={},angF={pc:0,sw:0,mc:0};
  el.innerHTML=`<div id="u3l5tp"></div><div class="grid">
   <div class="panel c12"><h2>محرك تحكم للتيار المستمر <small>مبني على الشكلين (٣-٧) و (٣-٨) ص 52</small></h2>
    <div class="wrap-in" style="align-items:flex-end">${slHTML('va','جهد المنتج V<sub>a</sub> (والإشارة = الاتجاه)',-100,100,5,75)}${slHTML('tl','عزم الحمل T<sub>L</sub>',0,60,2,10)}
     <div><div class="sub">المجال</div>${segHTML('pm',[[0,'تغذية مستقلة V<sub>f</sub> ثابت'],[1,'مغناطيس دائم']],0)}</div></div>
    <div class="facts">${fact('السرعة ω','fw')}${fact('العزم T','fT')}${fact('تيار المنتج I<sub>a</sub>','fI')}${fact('القوة الدافعة العكسية E<sub>a</sub>','fE')}${fact('الاتجاه','fd')}</div><div id="msg"></div></div>
   <div class="panel c7"><h2>الدائرة <small>الشكل (٣-٧)</small></h2><div class="svgbox" id="cir"></div></div>
   <div class="panel c5"><h2>العزم والسرعة <small>الشكل (٣-٨)</small></h2><div class="svgbox" id="tw"></div><p class="sub">الخطوط الرمادية Va1 و Va2 و Va3 من الشكل، والخط الأخضر لجهدك الآن، والخط الأحمر عزم الحمل.</p></div>
   <div class="panel c12"><p class="sub"><b><span id="u3l5w">أرقام توضيحية</span> بالوحدة النسبية (pu):</b> استعملنا علاقات محرك التيار المستمر المعروفة (ليست من نص الكتاب): <span class="ltr">\\(E_a = K\\omega\\)</span>، <span class="ltr">\\(I_a = (V_a - E_a)/R_a\\)</span>، <span class="ltr">\\(T = K I_a\\)</span> مع <span id="u3l5k"></span>، فيصير <span class="ltr" id="u3l5eq"></span>: خط مستقيم ذو ميل سالب كما يقول الكتاب. السرعة أقل من سرعة اللاحمل لأن عزم الحمل T<sub>L</sub> لا يساوي صفراً. وثابت زمن التسارع هو الزمن الذي يحتاجه عزم قدره 1 pu ليرفع السرعة من الصفر إلى 1 pu.</p>${tryBox('try')}</div>
   <div class="panel c12"><h2>قارن أشكال محركات التحكم للتيار المستمر <small>ص 53–54</small></h2>
    ${segHTML('fm',Object.entries(FORMS).map(([k,f])=>[k,f.t]),form)}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;align-items:start;margin-top:10px"><div class="svgbox" id="fsv" style="max-width:420px;margin-inline:auto"></div><div id="ftx"></div></div>
    <h3 style="font-size:15px;margin-top:14px">اختر صفة لترى أي الأشكال ذكر الكتاب أنها فيه:</h3>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">${FEAT.map(([k,l])=>`<button class="btn" data-ft="${k}" aria-pressed="false">${l}</button>`).join('')}</div>
    <div class="tablebox" id="ftab" style="margin-top:10px"></div>
    <p class="sub">✓ = ذكره الكتاب صراحة (مع نص الكتاب)، — = لم يذكره الكتاب لهذا النوع (لا يعني أنه غير موجود).</p></div></div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'غيّر جهد المنتج',x:'خفّض V_a من 100 % إلى 50 %: الخط ينزل موازياً لنفسه (مثل Va1 ← Va3) فتقل السرعة.',done:()=>flags.lo&&flags.hi},
   {t:'اعكس الجهد',x:'اجعل V_a سالباً: ينعكس اتجاه التيار والعزم فيدور المحرك في الاتجاه المعاكس.',done:()=>w<-0.1},
   {t:'زِد الحمل',x:'زِد عزم الحمل: نقطة التشغيل تنزلق على الخط نحو سرعة أقل وتيار أكبر.',done:()=>TL>=0.4&&Math.abs(w)>0.05},
   {t:'المغناطيس الدائم',x:'بدّل المجال إلى «مغناطيس دائم»: السلوك نفسه، لأن المهم أن يبقى المجال ثابتاً.',done:()=>pm},
   {t:'قارن الأشكال',x:'في لوحة المقارنة اضغط «محاثة ملفات صغيرة» ثم «تبريد أفضل»: أيّ الأنواع ذكرها الكتاب؟',done:()=>flags.f2}]);
  const tpLbl=()=>{const K=TP.v.K,Ra=TP.v.Ra;q(el,'#u3l5w').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية';
    q(el,'#u3l5k').innerHTML=B.tex(`K = ${B.fmtN(K)}`)+' pu و '+B.tex(`R_a = ${B.fmtN(Ra)}`)+' pu';
    q(el,'#u3l5eq').innerHTML=K===1&&Ra===1?B.tex('T = V_a - \\omega'):B.tex(`T = \\frac{${B.fmtN(K)}}{${B.fmtN(Ra)}}\\left(V_a - ${B.fmtN(K)}\\,\\omega\\right)`)};
  const TP=B.params(q(el,'#u3l5tp'),'u3-l5',[
   {k:'K',label:'ثابت المحرك K (E<sub>a</sub> = Kω و T = K I<sub>a</sub>)',unit:'pu',value:1,min:0.2,max:5,step:0.01},
   {k:'Ra',label:'مقاومة المنتج R<sub>a</sub>',unit:'pu',value:1,min:0.1,max:10,step:0.01},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.35,min:0.05,max:20,step:0.05}],()=>{tpLbl();lastSig=''});
  tpLbl();
  const sync=()=>{q(el,'#va-v').textContent=Math.round(Va*100)+' %';q(el,'#tl-v').textContent=Math.round(TL*100)+' %';segSet(el,'pm',pm?1:0);segSet(el,'fm',form);
    el.querySelectorAll('[data-ft]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ft===feat?'true':'false'));
    q(el,'#fsv').innerHTML=FORMS[form].svg('u3fm');q(el,'#ftx').innerHTML=`<p><b>${FORMS[form].t}</b> <span class="ref">${FORMS[form].ref}</span> ${FORMS[form].fig?`— الشكل ${FORMS[form].fig}`:'— لا يوجد شكل في الكتاب (رسم توضيحي)'}</p><p class="sub">${FORMS[form].txt}</p>`;
    q(el,'#ftab').innerHTML=`<table class="tt"><thead><tr><th>الصفة</th>${Object.entries(FORMS).map(([k,f])=>`<th style="${k===form?'box-shadow:inset 0 -4px 0 var(--live)':''}">${f.t}</th>`).join('')}</tr></thead><tbody>${FEAT.map(([k,l,m])=>`<tr style="${feat===k?'background:var(--live-soft)':feat?'opacity:.45':''}"><td>${l}</td>${['pc','sw','mc'].map(f=>`<td>${m[f]?'<b style="color:var(--on)">✓</b> <span class="sub">'+m[f]+'</span>':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table>`};
  q(el,'#va').addEventListener('input',e=>{Va=+e.target.value/100;if(Va>=0.95)flags.hi=1;if(Va>0&&Va<=0.55)flags.lo=1;sync()});
  q(el,'#tl').addEventListener('input',e=>{TL=+e.target.value/100;sync()});
  el.querySelectorAll('[data-pm]').forEach(b=>b.addEventListener('click',()=>{pm=b.dataset.pm==='1';lastSig='';sync()}));
  el.querySelectorAll('[data-fm]').forEach(b=>b.addEventListener('click',()=>{form=b.dataset.fm;sync()}));
  const fseen=new Set();el.querySelectorAll('[data-ft]').forEach(b=>b.addEventListener('click',()=>{feat=feat===b.dataset.ft?null:b.dataset.ft;if(feat)fseen.add(feat);if(fseen.has('ind')&&fseen.has('cool'))flags.f2=1;sync()}));
  sync();B.math(el);
  /* أعطال مخفية: aopen دائرة المنتج مفتوحة (لا تيار)، arev أطراف المنتج معكوسة؛ وضعف المغناطيس وتآكل الفرش بأرقام الآلة (K و Ra) */
  loopOn(el,dt=>{const K=TP.v.K,Ra=TP.v.Ra,tau=TP.v.tau,VaE=chF('arev')?-Va:Va,Tq=x=>chF('aopen')?0:K*(VaE-K*x)/Ra;let T=0;
   const n=Math.max(4,Math.ceil(dt*K*K/(Ra*tau)/0.5-1e-9)),h=dt/n;   // خطوات أصغر فقط عند قيم مدرب حادة (للثبات)؛ بالقيم التوضيحية 4 دائماً
   for(let i=0;i<n;i++){T=Tq(w);const sgn=Math.abs(w)>1e-3?Math.sign(w):Math.sign(T);let net=T-TL*sgn;if(Math.abs(w)<2e-3&&Math.abs(T)<=TL){net=0;w=0}w+=net/tau*h}
   th+=w*dt*360*0.6;const g=q(el,'#u3fm');angF[form]+=0.5*dt*360*0.4;if(g){const c=form==='pc'?'270 90':'90 90';g.setAttribute('transform',`rotate(${(angF[form]%360).toFixed(1)} ${c})`)}
   ht+=dt;if(ht<0.06)return;ht=0;T=Tq(w);const Ia=chF('aopen')?0:(VaE-K*w)/Ra;
   q(el,'#fw').textContent=w.toFixed(2)+' pu';q(el,'#fT').textContent=T.toFixed(2)+' pu';q(el,'#fI').textContent=Ia.toFixed(2)+' pu';q(el,'#fE').textContent=(K*w).toFixed(2)+' pu';q(el,'#fd').textContent=Math.abs(w)<0.01?'متوقف':w>0?'⟳ أمامي':'⟲ عكسي';
   q(el,'#cir').innerHTML=dcCircuitSVG({pm,live:Math.abs(Va)>0.001,Va,lbl:`Ia = ${Ia.toFixed(2)} pu`});
   q(el,'#tw').innerHTML=fig38SVG({Va,TL:TL*(w<-0.01||(Va<0&&Math.abs(w)<0.01)?-1:1),dot:{x:w,y:T,col:'--stop'},xs:1/K,ys:K/Ra});
   const dflt=K===1&&Ra===1,sg=[Math.abs(w)<0.01&&Math.abs(Va)>0,dflt?'':Math.round(Va*100)].join();if(sg!==lastSig){lastSig=sg;q(el,'#msg').innerHTML=Math.abs(w)<0.01&&Math.abs(Va)>0?`<div class="callout err">عزم المحرك عند السرعة صفر (${dflt?'عزم البدء = V<sub>a</sub> بالـ pu':`عزم البدء = K V<sub>a</sub>/R<sub>a</sub> = ${nf(Math.abs(K*Va/Ra),2)} pu`}) لا يكفي لتحريك الحمل: زِد الجهد أو خفّف الحمل.</div>`:''}
   tl.check()});
 },
 quiz:[
  {q:'محرك التحكم للتيار المستمر عبارة عن محرك تيار مستمر:',o:['توالي','مركب','منفصل التغذية أو دائم المغناطيسية','توازي ذاتي التغذية'],c:2,e:'ص 52 كما في النص.'},
  {q:'كيف تُتحكم سرعة محرك التحكم للتيار المستمر حسب الكتاب؟',o:['بجهد المجال مع ثبات جهد المنتج','بجهد العضو الدوار مع ثبات جهد المجال','بعدد الأقطاب','بالتردد'],c:1,e:'ص 52: التحكم في جهد العضو الدوار Va ويكون جهد المجال ثابتاً.'},
  {q:'لماذا تكون مقاومة العضو الدوار كبيرة جداً غالباً؟',o:['لتقليل السرعة','ليكون منحنى العزم والسرعة خطياً ذا ميل سالب','لتقليل الجهد','لزيادة المحاثة'],c:1,e:'ص 52 كما في النص والشكل (٣-٨).'},
  {q:'في المحرك ذي الدائرة المطبوعة، شكل العضو الدوار:',o:['أسطوانة حديدية','قرص خال من الحديد','كأس نحاسي','سلة'],c:1,e:'ص 53: العضو الدوار على شكل قرص خال من الحديد، والملفات على جانبيه.'},
  {q:'من يقوم بعمل المبدل في المحرك ذي الدائرة المطبوعة؟',o:['حلقات انزلاق','الفرش تتلامس مباشرة مع الملفات','مبدل نحاسي منفصل','دائرة إلكترونية'],c:1,e:'ص 53: الفرش تتلامس مباشرة مع الملفات وتقوم بعمل المبدل.'},
  {q:'لماذا يصمم دوار المحرك ذي الملفات السطحية طويلاً وصغير القطر؟',o:['لزيادة الجهد','لتقليل قوة الطرد المركزية على ملفاته وليكون قصوره الذاتي صغيراً','لتحسين التبريد فقط','لزيادة عدد الأقطاب'],c:1,e:'ص 54 كما في النص.'},
  {q:'الجزء الوحيد المتحرك في المحرك ذي الملف المتحرك هو:',o:['الأقطاب الدائمة','ملفات الدوار الملفوفة على هيئة سلة','الفرش','الحديد'],c:1,e:'ص 54: ملفات الدوار ملفوفة على مادة غير موصلة وغير مغناطيسية على هيئة سلة.'},
  {q:'يستخدم المحرك ذو الدائرة المطبوعة في أنظمة التحكم التي تتطلب:',o:['سرعة ثابتة دائماً','حركة متقطعة','قدرات كبيرة جداً','تياراً متردداً'],c:1,e:'ص 54: يستخدم في أنظمة التحكم التي تتطلب حركة متقطعة.'}
 ]
});

/* =====================================================================
   Lesson 3.6 — book questions
   ===================================================================== */
const det=(q,a)=>`<details style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:10px;background:var(--surface)"><summary style="cursor:pointer;font-weight:600">${q}</summary><div style="margin-top:8px;border-inline-start:3px solid var(--live);padding-inline-start:10px"><b style="color:var(--live)">إجابة مقترحة (ليست من الكتاب):</b> ${a}</div></details>`;
const lineSVG=(Tst,w0)=>plot({W:440,H:230,x:[0,w0*1.12],y:[0,Tst*1.2],xt:[[w0/2,String(+(w0/2).toFixed(1))],[w0,String(w0)]],yt:[[Tst/2,String(+(Tst/2).toFixed(3))],[Tst,String(Tst)]],xl:'ω (rad/s)',yl:'T (N.m)',lines:[{pts:[[0,Tst],[w0,0]],col:'--blue',w:2.8}],dots:[{x:0,y:Tst,r:5,col:'--blue'},{x:w0,y:0,r:5,col:'--blue'}],aria:'خط العزم والسرعة'});
const wtSVG=(w0,tau,tEnd,mark)=>plot({W:440,H:230,x:[0,tEnd],y:[0,w0*1.12],xt:fn2pts(x=>x,0,tEnd,Math.min(6,Math.round(tEnd))).map(p=>[p[0],String(+p[0].toFixed(1))]),yt:[[w0,String(w0)]],xl:'t (s)',yl:'ω (rad/s)',
  lines:[{pts:fn2pts(x=>w0*(1-Math.exp(-x/tau)),0,tEnd),col:'--blue',w:2.8}],hl:[{y:w0},{y:0.632*w0,label:'0.632ωo'}],vl:[{x:tau,col:'--live',label:'τ'}],dots:mark?[{x:mark,y:w0*(1-Math.exp(-mark/tau)),r:5}]:[],aria:'السرعة مع الزمن'});
const SUG='<b style="color:var(--live)">إجابة مقترحة (ليست من الكتاب).</b> ';
B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'55–56',
 title:'أسئلة الوحدة الثالثة',
 summary:'الأسئلة المتنوعة في نهاية الوحدة، مع إجابات مقترحة مكتوبة من نص الكتاب، وحاسبات للأسئلة العددية (س ٣-٩ و س ٣-١٠ وتمرين ٣-١١).',
 stations:[
  {intro:true},

  {st:1,short:'تعريفات وتصميم',title:'أسئلة متنوعة: المصطلحات واعتبارات التصميم',ref:'ص 55',
   q:'أربعة أسئلة قصيرة تختبر الأفكار الأساسية للوحدة… حاول الإجابة قبل أن تفتح الإجابة المقترحة.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقارنة منحنى عزم وسرعة غير خطي لمحرك حثي عادي مع خط مستقيم ذي ميل سالب لمحرك التحكم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#DDEFE6"/><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="84" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">العزم</text><text x="318" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السرعة</text><g data-tip="منحنى غير خطي: محرك حثي عادي بمقاومة دوار صغيرة؛ العزم لا يتغير بانتظام مع السرعة."><path d="M62.0 200.1L68.4 198.9L74.8 197.6L81.2 196.3L87.6 194.9L94.0 193.4L100.4 191.8L106.8 190.2L113.2 188.4L119.6 186.6L126.0 184.6L132.4 182.5L138.8 180.3L145.2 178.0L151.6 175.5L158.0 172.8L164.4 170.0L170.8 167.0L177.2 163.7L183.6 160.2L190.0 156.4L196.4 152.4L202.8 148.0L209.2 143.3L215.6 138.2L222.0 132.8L228.4 126.9L234.8 120.6L241.2 114.0L247.6 107.1L254.0 100.0L260.4 93.1L266.8 86.8L273.2 82.0L279.6 80.0L286.0 82.8L292.4 93.1L298.8 114.0L305.2 148.0L311.6 194.9L318.0 250.0" fill="none" stroke="transparent" stroke-width="14"/><path d="M62.0 200.1L68.4 198.9L74.8 197.6L81.2 196.3L87.6 194.9L94.0 193.4L100.4 191.8L106.8 190.2L113.2 188.4L119.6 186.6L126.0 184.6L132.4 182.5L138.8 180.3L145.2 178.0L151.6 175.5L158.0 172.8L164.4 170.0L170.8 167.0L177.2 163.7L183.6 160.2L190.0 156.4L196.4 152.4L202.8 148.0L209.2 143.3L215.6 138.2L222.0 132.8L228.4 126.9L234.8 120.6L241.2 114.0L247.6 107.1L254.0 100.0L260.4 93.1L266.8 86.8L273.2 82.0L279.6 80.0L286.0 82.8L292.4 93.1L298.8 114.0L305.2 148.0L311.6 194.9L318.0 250.0" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-dasharray="7 5" stroke-linejoin="round"/></g><g data-tip="خط مستقيم ذو ميل سالب: محرك تحكم بمقاومة دوار كبيرة؛ العزم يقل بانتظام كلما زادت السرعة، فيعمل مستقراً عند أي سرعة."><path d="M62 80L318 250" stroke="transparent" stroke-width="14"/><path d="M62 80L318 250" stroke="#12855A" stroke-width="4.5"/></g><text x="250" y="66" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">غير خطي</text><text x="215" y="230" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700">خط مستقيم</text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مقاومة الدوار تصنع الفرق</text></svg>`,
   cap:'تذكير بفكرة س ٣-٣ و س ٣-٤: المتقطع البرتقالي منحنى محرك حثي عادي، والأخضر خط محرك التحكم.<br><b>مرّر المؤشر على المنحنيين (أو المسهما في الجوال) لتعرف الفرق.</b>',
   side:[
    {book:String.raw`<ul>
     <li><b>س ٣-١:</b> عرف كلاً من المصطلحات التالية لمحركات التحكم: التسارع – ثابت الزمن الميكانيكي – زمن عكس الحركة.</li>
     <li><b>س ٣-٢:</b> ما هي الاعتبارات الواجب اتخاذها عند تصميم محركات التحكم؟</li>
     <li><b>س ٣-٣:</b> في محركات التحكم، كيف يمكن الحصول على علاقة خطية بين العزم والسرعة ابتداءً من بدء الحركة وحتى سرعة اللاحمل؟</li>
     <li><b>س ٣-٤:</b> ما فائدة الحصول على علاقة خطية بين العزم والسرعة في محركات التحكم؟</li></ul>`,ref:'ص 55'}
   ],
   body:[
    {predict:{q:'(س ٣-٣) كيف نحصل على علاقة خطية بين العزم والسرعة في محرك التحكم؟',opts:[
     ['بتكبير القصور الذاتي للدوار',false,'القصور الذاتي يؤثر في سرعة الاستجابة، لا في شكل منحنى العزم والسرعة.'],
     ['بتصغير مقاومة الدوار',false,'مقاومة الدوار الصغيرة تعطي المنحنى a غير الخطي (الشكل (٣-٢)).'],
     ['بزيادة مقاومة الدوار',true,'في المحرك المتردد ص 47، وفي المحرك المستمر مقاومة العضو الدوار كبيرة جداً ص 52.']]}},
    {tip:String.raw`<p>الكتاب لا يعطي إجابات لهذه الأسئلة، ولا يوجد اختبار ذاتي لهذه الوحدة. الإجابات التالية مقترحة ومكتوبة من نص الكتاب؛ افتح كل واحدة بعد أن تحاول بنفسك.</p>`
     +det('س ٣-١: التسارع – ثابت الزمن الميكانيكي – زمن عكس الحركة',`<ul><li><b>التسارع:</b> التسارع عند بدء الحركة، ويساوي عزم بدء الحركة مقسوماً على القصور الذاتي ‫α = T<sub>st</sub> / J‬، ووحداته راديان/ثانية² (ص 49).</li><li><b>ثابت الزمن الميكانيكي:</b> الزمن اللازم للدوار ليتسارع من السكون حتى تصل سرعته إلى 63.2٪ من سرعة اللاحمل عند تسليط الجهد الكامل على ملف التحكم، و ‫τ = J × ω<sub>o</sub> / T<sub>st</sub>‬ بالثانية.</li><li><b>زمن عكس الحركة:</b> الزمن اللازم ليعكس المحرك اتجاه دورانه من سرعة اللاحمل في اتجاه حتى 63.2٪ من سرعة اللاحمل في الاتجاه المضاد، عند عكس جهد ملف التحكم 180° والمحرك بدون حمل، ويساوي تقريباً ‫1.7 τ‬.</li></ul>`)
     +det('س ٣-٢: اعتبارات تصميم محركات التحكم',`<ul><li>أن تكون استجابتها سريعة للتغيير في السرعة لأي تغيير في الجهد، وذلك ببناء الدوار من مواد خفيفة وصغير القطر (قصور ذاتي صغير)؛ لذلك يكون المحرك صغير القطر طويلاً نسبياً (ص 45).</li><li>في المحرك المتردد: ملفان متعامدان على الثابت، ودوار قفص سنجابي صغير القطر ذو مقاومة كبيرة نسبياً للحصول على علاقة خطية بين العزم والسرعة (ص 45، 47).</li><li>في المحرك المستمر: مقاومة دوار كبيرة لخطية المنحنى (ص 52)، وصغر القصور الذاتي وصغر محاثة ملفات الدوار (ص 53–54).</li></ul>`)
     +det('س ٣-٣: كيف نحصل على علاقة خطية؟','بزيادة مقاومة الدوار: في المحرك المتردد يُصمم الدوار بمقاومة كبيرة حتى نحصل على المنحنى c (أقصى عزم عند بدء الحركة)، وكثيراً ما يُصمم بحيث يكون أقصى عزم عند سرعات في عكس اتجاه المجال الدوار فتصبح العلاقة خطاً مستقيماً ذا ميل سالب (ص 47). وفي المحرك المستمر تكون مقاومة العضو الدوار كبيرة جداً (ص 52).')
     +det('س ٣-٤: فائدة العلاقة الخطية','يتحقق تشغيل المحرك بصورة مستقرة عند أي سرعة ابتداءً من الصفر وحتى سرعة اللاحمل (ص 47)، ويمكن وصف المحرك بمعادلة بسيطة ‫T = −K<sub>ω</sub>ω + K<sub>v</sub>V<sub>a</sub>‬ فيتغير العزم والسرعة بانتظام مع جهد التحكم.'),title:'إجابات مقترحة (ليست من الكتاب)'},
    {title:'مختبر مصغّر: صِل التعريف بالمصطلح (س ٣-١)',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل تعريف اضغط المصطلح الذي يعرّفه.',cats:['التسارع','ثابت الزمن الميكانيكي','زمن عكس الحركة'],items:[
 ['الزمن اللازم للدوار ليتسارع من السكون حتى تصل سرعته إلى <span class="ltr">63.2%</span> من سرعة اللاحمل',1,'<span class="ltr">τ = J ω<sub>o</sub>/T<sub>st</sub></span>، المعادلة (٣-٤) (ص 49).'],
 ['عزم بدء الحركة مقسوماً على القصور الذاتي، ووحداته راديان/ثانية²',0,'<span class="ltr">α = T<sub>st</sub>/J</span>، المعادلة (٣-٣) (ص 49).'],
 ['الزمن من سرعة اللاحمل في اتجاه حتى <span class="ltr">63.2%</span> من سرعة اللاحمل في الاتجاه المضاد، عند عكس جهد ملف التحكم <span class="ltr">180°</span>',2,'ويساوي تقريباً <span class="ltr">1.7 τ</span> (ص 49).']]})}
   ]},

  {st:2,short:'اشرح مع الرسم',title:'أسئلة متنوعة: التركيب والتصميم',ref:'ص 55',
   q:'أسئلة «اشرح مع الرسم»: ما الرسم الذي يكفي لكل سؤال؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات برسوم مختصرة: المحرك المتردد ثنائي الوجه، الكأس المجرور، الدائرة المطبوعة، والملف المتحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="س ٣-٥: ارسم ملفين متعامدين على العضو الثابت (ملف التحكم وملف الجهد الثابت) ودوار قفص سنجابي صغير القطر، كما في الشكل (٣-١)."><rect x="26" y="34" width="148" height="122" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="100" cy="88" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><rect x="88" y="44" width="24" height="10" rx="3" fill="#4FB3A9"/><rect x="88" y="122" width="24" height="10" rx="3" fill="#4FB3A9"/><rect x="51" y="83" width="10" height="24" rx="3" fill="#E8735A" transform="translate(5 -7)"/><rect x="139" y="83" width="10" height="24" rx="3" fill="#E8735A" transform="translate(-5 -7)"/><text x="100" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">س ٣-٥</text></g><g data-tip="س ٣-٦: ارسم المقطع الطولي: ملفات الثابت، والكأس النحاسي بمحور على جانب واحد، والحديد الثابت داخله، كما في الشكل (٣-٤)."><rect x="186" y="34" width="148" height="122" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="226" y="50" width="96" height="14" fill="#E8735A"/><rect x="226" y="112" width="96" height="14" fill="#E8735A"/><rect x="236" y="80" width="86" height="16" fill="#9DB5AC"/><path d="M318 72H216V104H318" fill="none" stroke="#E9B949" stroke-width="5"/><rect x="194" y="84" width="22" height="8" fill="#2C4A40"/><text x="260" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">س ٣-٦</text></g><g data-tip="س ٣-٧: محرك الدائرة المطبوعة: قرص بلا حديد ملفاته مطبوعة على وجهيه، وأقطاب دائمة، وفرش تقوم بعمل المبدل."><rect x="26" y="168" width="148" height="122" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="100" cy="222" r="34" fill="#E9B949" stroke="#B9852A" stroke-width="2"/><path d="M100 222Q114 208 118 196M100 222Q118 226 132 222M100 222Q106 240 104 254M100 222Q84 236 74 242M100 222Q82 216 68 214M100 222Q92 206 90 192" fill="none" stroke="#B9852A" stroke-width="1.8"/><circle cx="100" cy="222" r="5" fill="#2C4A40"/><text x="100" y="282" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">س ٣-٧</text></g><g data-tip="س ٣-٨: محاثة ملفات المنتج تصغر بإبعاد الحديد عن الملفات المتحركة، كما في القرص المطبوع أو سلة الملف المتحرك."><rect x="186" y="168" width="148" height="122" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M220 200H300M220 248H300" stroke="#2C4A40" stroke-width="2"/><ellipse cx="300" cy="224" rx="8" ry="24" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M228 200L244 248M244 200L260 248M260 200L276 248M276 200L292 248" stroke="#B9852A" stroke-width="2"/><ellipse cx="220" cy="224" rx="8" ry="24" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><rect x="196" y="220" width="16" height="8" fill="#2C4A40"/><text x="260" y="282" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">س ٣-٨</text></g></svg>`,
   cap:'رسم مختصر يساعدك في كل سؤال؛ الرسوم الكاملة في دروس الوحدة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف ماذا ترسم.</b>',
   side:[
    {book:String.raw`<ul>
     <li><b>س ٣-٥:</b> اشرح مع الرسم تركيب ونظرية عمل محرك التحكم ذو التيار المتردد.</li>
     <li><b>س ٣-٦:</b> اشرح مع الرسم تركيب محرك التحكم ذي الكأس المجرور.</li>
     <li><b>س ٣-٧:</b> ما هي التعديلات التي أدخلت على تصميم محركات التحكم للتيار المستمر ذي الدائرة المطبوعة لتتلاءم مع متطلبات التحكم؟</li>
     <li><b>س ٣-٨:</b> ما فائدة تصغير محاثة ملفات المنتج في محركات التحكم للتيار المستمر؟ وكيف يمكن تحقيق ذلك؟</li></ul>`,ref:'ص 55'}
   ],
   body:[
    {predict:{q:'(س ٣-٨) كيف تصغر محاثة ملفات المنتج في محركات التحكم للتيار المستمر؟',opts:[
     ['بإبعاد الحديد عن الملفات المتحركة (قرص بلا حديد، أو سلة على مادة غير مغناطيسية)',true,'هذا ما فعله محرك الدائرة المطبوعة ومحرك الملف المتحرك (ص 53–54).'],
     ['بزيادة عدد لفات الملفات',false,'زيادة اللفات تزيد المحاثة.'],
     ['بوضع الملفات في مجاري حديدية عميقة',false,'الحديد حول الملفات يزيد المحاثة، والتصميمات في الكتاب تبتعد عنه.']]}},
    {tip:det('س ٣-٥: تركيب ونظرية عمل محرك التحكم المتردد','<b>التركيب:</b> محرك حثي ثنائي الوجه، على ثابته ملفان بينهما 90° في الفراغ: ملف الجهد الثابت وملف التحكم، والدوار قفص سنجابي صغير القطر عالي المقاومة (الشكل ٣-١). <b>العمل:</b> يغذى ملف الجهد الثابت بجهد ثابت القيمة والتردد، وملف التحكم بجهد متغير. يلزم فرق زمني 90° بين التيارين (مصدر ثنائي الوجه، أو مكثف على التوالي مع ملف الجهد الثابت عند المصدر الأحادي) فيتكون مجال دوار يدير الدوار. العزم يتناسب طردياً مع جهد ملف التحكم ‫T ∝ V<sub>a</sub>‬، وعند الجهد صفر يُقصر ملف التحكم لمنع الدوران كمحرك وجه واحد (ص 45–46). ارسم الشكل (٣-١) كما في الدرس 3.1.')
     +det('س ٣-٦: تركيب محرك الكأس المجرور','الثابت مثل ثابت المحركات الأخرى؛ الدوار كأس مفرغ من النحاس أو سبيكته بمحور واحد على أحد جانبيه، يدور في الفجوة بين ملفات الثابت وحديد ثابت داخل الكأس مثبت بالهيكل يكمل الدائرة المغناطيسية. هو قفص سنجابي أزيلت أسنانه وصار أسطوانة مكتملة، لذلك قصوره الذاتي ضعيف جداً ولا توجد فيه عضة مغناطيسية، وتُتحكم سرعته بجهد ملفات الثابت (ص 48، الشكل ٣-٤).')
     +det('س ٣-٧: تعديلات محرك الدائرة المطبوعة','الدوار قرص خالٍ من الحديد (قصور ذاتي صغير جداً)، والملفات مطبوعة على جانبي القرص ومتصلة بثقوب موصلة (محاثة صغيرة جداً فثابت زمني صغير جداً، وتبريد أفضل لأنها على السطح الخارجي)، والفرش تلامس الملفات مباشرة وتقوم بعمل المبدل، والثابت أقطاب مغناطيسية دائمة تكتمل دائرتها بالغطاء الذي يثبت الفرش (ص 53–54).')
     +det('س ٣-٨: فائدة تصغير محاثة ملفات المنتج وطريقته','<b>الفائدة:</b> يصبح الثابت الزمني صغيراً جداً، وهو من أهم متطلبات نظم التحكم الآلي (ص 54) — أي يتغير التيار والعزم بسرعة مع تغير الجهد. <b>التحقيق:</b> بإبعاد الحديد عن الملفات المتحركة: الدوار القرصي الخالي من الحديد في محرك الدائرة المطبوعة، أو لف ملفات الدوار على مادة غير موصلة وغير مغناطيسية على هيئة سلة في محرك الملف المتحرك (ص 53–54).'),title:'إجابات مقترحة (ليست من الكتاب)'},
    {title:'مختبر مصغّر: أي محرك هذا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اضغط المحرك الذي يصفه؛ ستحتاج هذا في أسئلة «اشرح مع الرسم».',cats:['محرك التحكم المتردد','الكأس المجرور','الدائرة المطبوعة'],items:[
 ['ملفان على العضو الثابت بينهما تسعون درجة في الفراغ، ودوار قفص سنجابي',0,'هذا محرك التحكم للتيار المتردد ثنائي الوجه (ص 45، الشكل (٣-١)).'],
 ['دوار كأس مفرغ من النحاس، وحديد ثابت داخله يكمل الدائرة المغناطيسية',1,'هذا محرك الكأس المجرور: الحديد داخل الكأس مثبت بالهيكل (ص 48، الشكل (٣-٤)).'],
 ['دوار قرص خالٍ من الحديد، ملفاته على جانبيه متصلة بثقوب موصلة',2,'هذا محرك الدائرة المطبوعة (ص 53–54، الشكل (٣-٩)).'],
 ['مكثف على التوالي مع ملف الجهد الثابت عند التغذية من مصدر أحادي الوجه',0,'ليصنع فارقاً زمنياً تسعين درجة بين التيارين (ص 46).'],
 ['خالٍ تماماً من العضة المغناطيسية لأن دواره بلا مجاري ولا أسنان',1,'الكأس المجرور هو الذي أزيلت أسنان دواره (ص 48).']]})}
   ]},

  {st:3,short:'المسائل العددية',title:'أسئلة متنوعة: المسائل العددية',ref:'ص 55–56',
   q:'ثلاث مسائل بطريقة المثال (٣-١): ما الذي تقرؤه أولاً من كل مسألة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 3-11: خط عزم وسرعة واحد لجهد 115 فولت، من 0.5 نيوتن متر إلى 300 راديان في الثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#E6E2F8"/><path d="M62 250H334" stroke="#2C4A40" stroke-width="2.5"/><polygon points="342,250 330,244 330,256" fill="#2C4A40"/><path d="M62 250V44" stroke="#2C4A40" stroke-width="2.5"/><polygon points="62,36 56,48 68,48" fill="#2C4A40"/><text x="96" y="40" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">T (N.m)</text><text x="296" y="290" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">ω (rad/s)</text><g data-tip="عزم البدء من الشكل: ⟦Tst = 0.5 N.m⟧ (عند السرعة صفر)."><circle cx="62" cy="90" r="7" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="54" y="95" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">0.5</text></g><g data-tip="سرعة اللاحمل من الشكل: ⟦ωo = 300 rad/s⟧ (عند العزم صفر)."><circle cx="300" cy="250" r="7" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="300" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">300</text></g><g data-tip="خط العزم والسرعة لمحرك السؤال ٣-٩ عند جهد ملف التحكم ⟦115 V⟧."><path d="M62 90L300 250" stroke="transparent" stroke-width="14"/><path d="M62 90L300 250" stroke="#12855A" stroke-width="4.5"/></g><text x="200" y="130" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">Va = 115 Volt</text></svg>`,
   cap:'الشكل (٣-١١) ص 55 للسؤال ٣-٩ بأرقامه.<br><b>مرّر المؤشر على طرفي الخط (أو المسهما في الجوال) لتقرأ ما يعطيه الشكل.</b>',
   side:[
    {book:String.raw`<p><b>س ٣-٩:</b> محرك تحكم للتيار المتردد ثنائي الوجه <span class="ltr">115</span> فولت، <span class="ltr">60</span> هيرتز قصوره الذاتي <span class="ltr">0.005</span> كيلوجرام.متر²، له الخواص المبينة بالشكل (٣-١١) إذا كان جهد ملف التحكم <span class="ltr">115</span> فولت أوجد: أ. المعادلة التي تصف منحنى الخواص (العلاقة بين العزم والسرعة). ب. التسارع عند بدء الحركة. ج. ثابت الزمن الميكانيكي للمحرك. د. الزمن اللازم لعكس اتجاه دوران المحرك. هـ. معادلة السرعة مع الزمن. و. السرعة بعد انقضاء زمن يساوي ثابت الزمن الميكانيكي للمحرك.</p>`,ref:'ص 55'}
   ],
   body:[
    {book:String.raw`<p><b>س ٣-١٠:</b> محرك تحكم للتيار المتردد ثنائي الوجه <span class="ltr">120</span> فولت، قصوره الذاتي <span class="ltr">0.008</span> كيلوجرام.متر²، العلاقة بين العزم والسرعة تعطى من المعادلة الآتية: <span class="ltr">T = − 0.002 . ω + 0.6 N.m</span> حيث <span class="ltr">T</span> هو العزم بالنيوتن متر، <span class="ltr">ω</span> سرعة الدوران بالراديان لكل ثانية، المطلوب: أ. ارسم العلاقة بين العزم والسرعة. ب. التسارع عند بدء الحركة. ج. سرعة المحرك عند اللاحمل. د. ثابت الزمن الميكانيكي للمحرك. هـ. الزمن اللازم لعكس اتجاه دوران المحرك. و. معادلة السرعة مع الزمن. ز. السرعة بعد انقضاء ثانيتين من بدء الحركة.</p>
     <p><b>تمرين ٣-١١:</b> محرك تحكم للتيار المتردد ثنائي الوجه <span class="ltr">120</span> فولت، قصوره الذاتي <span class="ltr">0.006</span> كيلوجرام.متر²، عزم بدء الحركة <span class="ltr">0.6</span> نيوتن متر وسرعة اللاحمل <span class="ltr">300</span> راديان في الثانية: أ. ارسم العلاقة بين العزم والسرعة. ب. المعادلة التي تصف منحنى الخواص (العلاقة بين العزم والسرعة). ج. احسب التسارع عند بدء الحركة. د. احسب ثابت الزمن الميكانيكي للمحرك. هـ. احسب الزمن اللازم لعكس اتجاه دوران المحرك. و. ارسم منحنى السرعة مع الزمن خلال ست ثوان من بدء الحركة.</p>`,ref:'ص 56'},
    {tip:String.raw`<p>قبل أي حساب استخرج <b>عزم البدء</b> <span class="ltr">\(T_{st}\)</span> و<b>سرعة اللاحمل</b> <span class="ltr">\(\omega_o\)</span>: من الشكل في س ٣-٩، ومن المعادلة في س ٣-١٠ (عند <span class="ltr">\(\omega=0\)</span> يكون <span class="ltr">\(T=T_{st}\)</span>، وعند <span class="ltr">\(T=0\)</span> تكون <span class="ltr">\(\omega=\omega_o\)</span>)، ومعطيين مباشرة في تمرين ٣-١١. بعدها كل شيء تعويض في المعادلات (٣-٣) و (٣-٤) و (٣-٥) و <span class="ltr">\(\tau_r = 1.7\,\tau\)</span>.</p>
     <p>في س ٣-١٠ وتمرين ٣-١١ لا يُعطى جهد ملف التحكم، لذلك نكتب المعادلة بصيغة <span class="ltr">\(T = -K_\omega\,\omega + T_{st}\)</span> حيث <span class="ltr">\(T_{st} = K_v V_a\)</span>.</p>`,title:'من أين تبدأ؟'},
    {predict:{q:String.raw`في س ٣-١٠: <span class="ltr">T = −0.002 ω + 0.6</span>. كم سرعة اللاحمل؟`,opts:[
     [String.raw`<span class="ltr">0.6 rad/s</span>`,false,'هذا عزم البدء (بالنيوتن متر)، لا السرعة.'],
     [String.raw`<span class="ltr">1200 rad/s</span>`,false,String.raw`هذا ناتج <span class="ltr">\(0.6\times2000\)</span>؛ المطلوب قسمة <span class="ltr">\(0.6\)</span> على <span class="ltr">\(0.002\)</span>.`],
     [String.raw`<span class="ltr">300 rad/s</span>`,true,String.raw`عند اللاحمل <span class="ltr">\(T=0\)</span>: <span class="ltr">\(0=-0.002\,\omega_o+0.6\)</span> فتكون <span class="ltr">\(\omega_o=0.6/0.002=300\ \text{rad/s}\)</span>.`],
     [String.raw`<span class="ltr">0.002 rad/s</span>`,false,'هذا الميل، وليس سرعة.']]}},
    {tip:String.raw`<p>إجابات نهائية مقترحة للتحقق من حلك (الكتاب لا يعطي إجابات؛ الحل خطوة بخطوة في تبويب «الأمثلة المحلولة»):</p>`
     +det('س ٣-٩','من الشكل (٣-١١): ‫T<sub>st</sub> = 0.5 N.m‬ و ‫ω<sub>o</sub> = 300 rad/s‬. ‫K<sub>v</sub> = 0.5/115 = 0.00435‬ و ‫K<sub>ω</sub> = 0.5/300 = 0.00167‬، فتكون ‫T = −0.00167 ω + 0.5 N.m‬؛ ‫α = 0.5/0.005 = 100 rad/s²‬؛ ‫τ = 0.005 × 300 / 0.5 = 3 s‬؛ ‫τ<sub>r</sub> = 1.7 × 3 = 5.1 s‬؛ ‫ω = 300 (1 − e<sup>−t/3</sup>)‬؛ وعند ‫t = τ‬: ‫ω = 0.632 × 300 = 189.6 rad/s‬.')
     +det('س ٣-١٠','‫T<sub>st</sub> = 0.6 N.m‬ و ‫ω<sub>o</sub> = 300 rad/s‬؛ ‫α = 0.6/0.008 = 75 rad/s²‬؛ ‫τ = 0.008 × 300 / 0.6 = 4 s‬؛ ‫τ<sub>r</sub> = 1.7 × 4 = 6.8 s‬؛ ‫ω = 300 (1 − e<sup>−t/4</sup>)‬؛ وبعد ثانيتين: ‫ω = 300 (1 − e<sup>−0.5</sup>) ≈ 118.0 rad/s‬.')
     +det('تمرين ٣-١١','‫K<sub>ω</sub> = 0.6/300 = 0.002‬، فتكون ‫T = −0.002 ω + 0.6 N.m‬؛ ‫α = 0.6/0.006 = 100 rad/s²‬؛ ‫τ = 0.006 × 300 / 0.6 = 3 s‬؛ ‫τ<sub>r</sub> = 5.1 s‬؛ ‫ω = 300 (1 − e<sup>−t/3</sup>)‬، وعند نهاية الثواني الست: ‫ω = 300 (1 − e<sup>−2</sup>) ≈ 259.4 rad/s‬.')
     +'<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector(\'.ltabs button[data-tab=examples]\');if(b)b.click()">افتح الحل خطوة بخطوة والرسوم</button></div>',title:'تحقق من إجاباتك'},
    {title:'مختبر مصغّر: السرعة مع الزمن في المسائل الثلاث',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر المسألة، وحرّك الزمن، واقرأ السرعة من المعادلة (٣-٥). الأرقام كلها من نصوص المسائل ص 55–56، وأرقام س ٣-٩ من الشكل (٣-١١).',
 predict:{q:'في س ٣-١٠ ثابت الزمن <span class="ltr">τ = 4 s</span>. بعد ثانيتين من بدء الحركة، كم تكون السرعة تقريباً من سرعة اللاحمل؟',opts:[
  ['<span class="ltr">50%</span>، لأن ثانيتين نصف <span class="ltr">τ</span>',false,'السرعة لا تزيد خطياً مع الزمن؛ المنحنى أسي.'],
  ['<span class="ltr">39%</span> تقريباً',true,'<span class="ltr">1 − e<sup>−2/4</sup> = 1 − e<sup>−0.5</sup> ≈ 0.393</span>، أي نحو <span class="ltr">118 rad/s</span> من <span class="ltr">300</span>.'],
  ['<span class="ltr">63.2%</span>',false,'<span class="ltr">63.2%</span> تكون عند <span class="ltr">t = τ = 4 s</span>، لا بعد ثانيتين.']]},
 ins:[{k:'p',l:'المسألة',seg:[['9','س ٣-٩'],['10','س ٣-١٠'],['11','تمرين ٣-١١']],v:10},{k:'t',l:'الزمن منذ بدء الحركة t',min:0,max:12,step:0.1,v:2,dp:1,u:'s'}],
 calc:(s)=>{const P={9:{T:0.5,w:300,J:0.005},10:{T:0.6,w:300,J:0.008},11:{T:0.6,w:300,J:0.006}}[s.p],tau=P.J*P.w/P.T,om=P.w*(1-Math.exp(-s.t/tau));
  return {plot:{xr:[0,12],yr:[0,320],xt:[0,3,4,6,9,12],yt:[0,100,189.6,300],fy:v=>v===189.6?'189.6':DCML.fm(B,v),xl:'t (s)',yl:'ω (rad/s)',curves:[{pts:[[0,0.632*300],[12,0.632*300]],col:'--muted',w:1.2,dash:'4 4'},{f:t=>P.w*(1-Math.exp(-t/tau)),col:'--blue',w:3,n:120}],cur:[s.t,om]},
   facts:[['T<sub>st</sub>',DCML.fm(B,P.T,1)+' N.m'],['ω<sub>o</sub>',P.w+' rad/s'],['J',DCML.fm(B,P.J,3)+' kg.m²'],['τ',DCML.fm(B,tau,0)+' s'],['السرعة ω',DCML.fm(B,om,1)+' rad/s','hi']],
   msg:Math.abs(s.t-tau)<0.05?'<span class="ltr">t = τ</span>: السرعة <span class="ltr">0.632 × 300 = 189.6 rad/s</span>.':''}}})}
   ]},

  {recap:[
   String.raw`ابدأ كل مسألة باستخراج <span class="ltr">\(T_{st}\)</span> و <span class="ltr">\(\omega_o\)</span>، ثم المعادلة (٣-٢): <span class="ltr">\(T=-K_\omega\,\omega+K_v V_a\)</span> مع <span class="ltr">\(K_\omega=T_{st}/\omega_o\)</span>`,
   String.raw`التسارع عند البدء، المعادلة (٣-٣): <span class="ltr">\(\alpha=T_{st}/J\)</span>؛ وثابت الزمن، المعادلة (٣-٤): <span class="ltr">\(\tau=J\,\omega_o/T_{st}\)</span>`,
   String.raw`السرعة مع الزمن، المعادلة (٣-٥): <span class="ltr">\(\omega=\omega_o\left(1-e^{-t/\tau}\right)\)</span>، وعند <span class="ltr">\(t=\tau\)</span> تكون <span class="ltr">\(0.632\,\omega_o\)</span>؛ وزمن عكس الحركة <span class="ltr">\(\tau_r=1.7\,\tau\)</span>`,
   String.raw`الخطية تأتي من مقاومة دوار كبيرة، وسرعة الاستجابة من قصور ذاتي صغير ومحاثة صغيرة.`]}
],
 theory:[
  {h:'أسئلة متنوعة',ref:'ص 55–56',html:'<p>الكتاب لا يعطي إجابات لهذه الأسئلة، ولا يوجد اختبار ذاتي لهذه الوحدة. الإجابات أدناه مقترحة ومكتوبة من نص الكتاب؛ افتح كل سؤال بعد أن تحاول بنفسك.</p>'},
  {html:det('س ٣-١: عرف كلاً من المصطلحات التالية لمحركات التحكم: التسارع – ثابت الزمن الميكانيكي – زمن عكس الحركة.',`<ul><li><b>التسارع:</b> التسارع عند بدء الحركة، ويساوي عزم بدء الحركة مقسوماً على القصور الذاتي \u202Bα = T<sub>st</sub> / J\u202C، ووحداته راديان/ثانية² (ص 49).</li><li><b>ثابت الزمن الميكانيكي:</b> الزمن اللازم للدوار ليتسارع من السكون حتى تصل سرعته إلى 63.2٪ من سرعة اللاحمل عند تسليط الجهد الكامل على ملف التحكم، و \u202Bτ = J × ω<sub>o</sub> / T<sub>st</sub>\u202C بالثانية.</li><li><b>زمن عكس الحركة:</b> الزمن اللازم ليعكس المحرك اتجاه دورانه من سرعة اللاحمل في اتجاه حتى 63.2٪ من سرعة اللاحمل في الاتجاه المضاد، عند عكس جهد ملف التحكم 180° والمحرك بدون حمل، ويساوي تقريباً \u202B1.7 τ\u202C.</li></ul>`)},
  {html:det('س ٣-٢: ما هي الاعتبارات الواجب اتخاذها عند تصميم محركات التحكم؟',`<ul><li>أن تكون استجابتها سريعة للتغيير في السرعة لأي تغيير في الجهد، وذلك ببناء الدوار من مواد خفيفة وصغير القطر (قصور ذاتي صغير)؛ لذلك يكون المحرك صغير القطر طويلاً نسبياً (ص 45).</li><li>في المحرك المتردد: ملفان متعامدان على الثابت، ودوار قفص سنجابي صغير القطر ذو مقاومة كبيرة نسبياً للحصول على علاقة خطية بين العزم والسرعة (ص 45، 47).</li><li>في المحرك المستمر: مقاومة دوار كبيرة لخطية المنحنى (ص 52)، وصغر القصور الذاتي وصغر محاثة ملفات الدوار (ص 53–54).</li></ul>`)},
  {html:det('س ٣-٣: في محركات التحكم، كيف يمكن الحصول على علاقة خطية بين العزم والسرعة ابتداءً من بدء الحركة وحتى سرعة اللاحمل؟','بزيادة مقاومة الدوار: في المحرك المتردد يُصمم الدوار بمقاومة كبيرة حتى نحصل على المنحنى c (أقصى عزم عند بدء الحركة)، وكثيراً ما يُصمم بحيث يكون أقصى عزم عند سرعات في عكس اتجاه المجال الدوار فتصبح العلاقة خطاً مستقيماً ذا ميل سالب (ص 47). وفي المحرك المستمر تكون مقاومة العضو الدوار كبيرة جداً (ص 52).')},
  {html:det('س ٣-٤: ما فائدة الحصول على علاقة خطية بين العزم والسرعة في محركات التحكم؟','يتحقق تشغيل المحرك بصورة مستقرة عند أي سرعة ابتداءً من الصفر وحتى سرعة اللاحمل (ص 47)، ويمكن وصف المحرك بمعادلة بسيطة \u202BT = −K<sub>ω</sub>ω + K<sub>v</sub>V<sub>a</sub>\u202C فيتغير العزم والسرعة بانتظام مع جهد التحكم.')},
  {html:det('س ٣-٥: اشرح مع الرسم تركيب ونظرية عمل محرك التحكم ذي التيار المتردد.','<b>التركيب:</b> محرك حثي ثنائي الوجه، على ثابته ملفان بينهما 90° في الفراغ: ملف الجهد الثابت وملف التحكم، والدوار قفص سنجابي صغير القطر عالي المقاومة (الشكل ٣-١). <b>العمل:</b> يغذى ملف الجهد الثابت بجهد ثابت القيمة والتردد، وملف التحكم بجهد متغير. يلزم فرق زمني 90° بين التيارين (مصدر ثنائي الوجه، أو مكثف على التوالي مع ملف الجهد الثابت عند المصدر الأحادي) فيتكون مجال دوار يدير الدوار. العزم يتناسب طردياً مع جهد ملف التحكم \u202BT ∝ V<sub>a</sub>\u202C، وعند الجهد صفر يُقصر ملف التحكم لمنع الدوران كمحرك وجه واحد (ص 45–46). ارسم الشكل (٣-١) كما في الدرس 3.1.')},
  {html:det('س ٣-٦: اشرح مع الرسم تركيب محرك التحكم ذي الكأس المجرور.','الثابت مثل ثابت المحركات الأخرى؛ الدوار كأس مفرغ من النحاس أو سبيكته بمحور واحد على أحد جانبيه، يدور في الفجوة بين ملفات الثابت وحديد ثابت داخل الكأس مثبت بالهيكل يكمل الدائرة المغناطيسية. هو قفص سنجابي أزيلت أسنانه وصار أسطوانة مكتملة، لذلك قصوره الذاتي ضعيف جداً ولا توجد فيه عضة مغناطيسية، وتُتحكم سرعته بجهد ملفات الثابت (ص 48، الشكل ٣-٤).')},
  {html:det('س ٣-٧: ما هي التعديلات التي أدخلت على تصميم محركات التحكم للتيار المستمر ذي الدائرة المطبوعة لتتلاءم مع متطلبات التحكم؟','الدوار قرص خالٍ من الحديد (قصور ذاتي صغير جداً)، والملفات مطبوعة على جانبي القرص ومتصلة بثقوب موصلة (محاثة صغيرة جداً فثابت زمني صغير جداً، وتبريد أفضل لأنها على السطح الخارجي)، والفرش تلامس الملفات مباشرة وتقوم بعمل المبدل، والثابت أقطاب مغناطيسية دائمة تكتمل دائرتها بالغطاء الذي يثبت الفرش (ص 53–54).')},
  {html:det('س ٣-٨: ما فائدة تصغير محاثة ملفات المنتج في محركات التحكم للتيار المستمر؟ وكيف يمكن تحقيق ذلك؟','<b>الفائدة:</b> يصبح الثابت الزمني صغيراً جداً، وهو من أهم متطلبات نظم التحكم الآلي (ص 54) — أي يتغير التيار والعزم بسرعة مع تغير الجهد. <b>التحقيق:</b> بإبعاد الحديد عن الملفات المتحركة: الدوار القرصي الخالي من الحديد في محرك الدائرة المطبوعة، أو لف ملفات الدوار على مادة غير موصلة وغير مغناطيسية على هيئة سلة في محرك الملف المتحرك (ص 53–54).')},
  {html:det('س ٣-٩: «محرك تحكم للتيار المتردد ثنائي الوجه 115 فولت، 60 هيرتز قصوره الذاتي 0.005 كيلوجرام.متر²، له الخواص المبينة بالشكل (٣-١١) إذا كان جهد ملف التحكم 115 فولت أوجد: أ. المعادلة التي تصف منحنى الخواص. ب. التسارع عند بدء الحركة. ج. ثابت الزمن الميكانيكي للمحرك. د. الزمن اللازم لعكس اتجاه دوران المحرك. هـ. معادلة السرعة مع الزمن. و. السرعة بعد انقضاء زمن يساوي ثابت الزمن الميكانيكي للمحرك.» <span class="ref">ص 55</span>','من الشكل (٣-١١): \u202BT<sub>st</sub> = 0.5 N.m\u202C و \u202Bω<sub>o</sub> = 300 rad/s\u202C. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».')},
  {fig:'(٣-١١)',ref:'ص 55',caption:'خواص محرك السؤال ٣-٩: خط واحد Va = 115 Volt (إعادة رسم)',draw:()=>box(lineSVG(0.5,300).replace('aria-label="خط العزم والسرعة"','aria-label="الشكل ٣-١١"'),440)},
  {html:det('س ٣-١٠: «محرك تحكم للتيار المتردد ثنائي الوجه 120 فولت، قصوره الذاتي 0.008 كيلوجرام.متر²، العلاقة بين العزم والسرعة تعطى من المعادلة الآتية: T = − 0.002 . ω + 0.6 N.m … المطلوب: أ. ارسم العلاقة بين العزم والسرعة. ب. التسارع عند بدء الحركة. ج. سرعة المحرك عند اللاحمل. د. ثابت الزمن الميكانيكي للمحرك. هـ. الزمن اللازم لعكس اتجاه دوران المحرك. و. معادلة السرعة مع الزمن. ز. السرعة بعد انقضاء ثانيتين من بدء الحركة.» <span class="ref">ص 56</span>','من المعادلة: عزم البدء 0.6 N.m (عند ω = 0) والميل 0.002، فسرعة اللاحمل 0.6 ÷ 0.002 = 300 rad/s. الحل والرسم في «الأمثلة المحلولة».')},
  {html:det('تمرين ٣-١١: «محرك تحكم للتيار المتردد ثنائي الوجه 120 فولت، قصوره الذاتي 0.006 كيلوجرام.متر²، عزم بدء الحركة 0.6 نيوتن متر وسرعة اللاحمل 300 راديان في الثانية: أ. ارسم العلاقة بين العزم والسرعة. ب. المعادلة التي تصف منحنى الخواص. ج. احسب التسارع عند بدء الحركة. د. احسب ثابت الزمن الميكانيكي للمحرك. هـ. احسب الزمن اللازم لعكس اتجاه دوران المحرك. و. ارسم منحنى السرعة مع الزمن خلال ست ثوان من بدء الحركة.» <span class="ref">ص 56</span>','الحل والرسمان في «الأمثلة المحلولة».')},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في س ٣-١٠ وتمرين ٣-١١ لا يُعطى جهد ملف التحكم، لذلك نكتب المعادلة بصيغة \u202BT = −K<sub>ω</sub>ω + T<sub>st</sub>\u202C حيث \u202BT<sub>st</sub> = K<sub>v</sub>V<sub>a</sub>\u202C.'}
 ],
 examples:[
  {title:'س ٣-٩',ref:'ص 55',q:'<p>محرك تحكم ثنائي الوجه 115 V، 60 Hz، J = 0.005 kg.m²، خواصه في الشكل (٣-١١)، جهد ملف التحكم 115 V. من الشكل: T<sub>st</sub> = 0.5 N.m و ω<sub>o</sub> = 300 rad/s.</p><p class="sub">'+SUG+'الكتاب لا يعطي جواباً؛ اتبعنا طريقة المثال (٣-١).</p>',
   given:[{id:'Va',label:'جهد ملف التحكم',sym:'V_a',unit:'V',value:115},{id:'Tst',label:'عزم البدء (من الشكل)',sym:'T_{st}',unit:'N.m',value:0.5},{id:'w0',label:'سرعة اللاحمل (من الشكل)',sym:'\\omega_o',unit:'rad/s',value:300},{id:'J',label:'القصور الذاتي',sym:'J',unit:'kg.m²',value:0.005}],
   solve:(g,B)=>{const r=servoSolve({Va:g.Va,Tst:g.Tst,w0:g.w0,J:g.J},B,{kv:5,kw:5});const o=r.out;o[o.length-1].final=false;o.forEach(s=>{s.t=s.t.replace('(ج) سرعة اللاحمل','سرعة اللاحمل (من الشكل)').replace('(د)','(ج)').replace('(هـ)','(د)').replace('(و)','(هـ)')});
     o.push({t:'(و) السرعة بعد زمن يساوي τ: نعوض t = τ في المعادلة (٣-٥)',f:`\\omega=\\omega_o\\left(1-e^{-1}\\right)=0.632\\times${g.w0}`,v:B.round(0.632*g.w0,1),unit:'rad/sec',dp:1,final:true});
     o.push({t:'رسم السرعة مع الزمن (توضيح):<div class="svgbox" style="max-width:440px">'+wtSVG(g.w0,r.tau,6*r.tau,r.tau)+'</div>'});return o}},
  {title:'س ٣-١٠',ref:'ص 56',q:'<p>محرك تحكم ثنائي الوجه 120 V، J = 0.008 kg.m²، و T = − 0.002 ω + 0.6 N.m. المطلوب أيضاً: السرعة بعد ثانيتين من بدء الحركة.</p><p class="sub">'+SUG+'</p>',
   given:[{id:'kw',label:'الميل',sym:'K_\\omega',unit:'',value:0.002},{id:'Tst',label:'عزم البدء (الحد الثابت)',sym:'T_{st}',unit:'N.m',value:0.6},{id:'J',label:'القصور الذاتي',sym:'J',unit:'kg.m²',value:0.008},{id:'t',label:'الزمن المطلوب',sym:'t',unit:'s',value:2}],
   solve:(g,B)=>{const w0=g.Tst/g.kw,tau=g.J*w0/g.Tst,o=[];
     o.push({t:'(أ) الرسم: عند ω = 0 يكون T = T<sub>st</sub>، وعند T = 0 تكون ω = ω<sub>o</sub>:<div class="svgbox" style="max-width:440px">'+lineSVG(g.Tst,+w0.toFixed(2))+'</div>'});
     o.push({t:'(ب) التسارع عند بدء الحركة:',f:`\\alpha=\\frac{T_{st}}{J}=\\frac{${g.Tst}}{${g.J}}`,v:B.round(g.Tst/g.J,2),unit:'rad/sec²',dp:B.round(g.Tst/g.J,2)%1?2:0});
     o.push({t:'(ج) سرعة اللاحمل (T = 0):',f:`0=-${g.kw}\\,\\omega_o+${g.Tst}\\Rightarrow\\omega_o=\\frac{${g.Tst}}{${g.kw}}`,v:B.round(w0,2),unit:'rad/sec',dp:B.round(w0,2)%1?2:0});
     o.push({t:'(د) ثابت الزمن الميكانيكي:',f:`\\tau=\\frac{J\\times\\omega_o}{T_{st}}=\\frac{${g.J}\\times${B.round(w0,2)}}{${g.Tst}}`,v:B.round(tau,2),unit:'sec',dp:B.round(tau,2)%1?2:0});
     {const r2=B.round(1.7*B.round(tau,2),2);o.push({t:'(هـ) زمن عكس الحركة:',f:`\\tau_r=1.7\\times${B.round(tau,2)}`,v:r2,unit:'sec',dp:r2%1?(B.round(r2,1)===r2?1:2):0})}
     o.push({t:'(و) معادلة السرعة مع الزمن:',f:`\\omega=${B.round(w0,2)}\\left(1-e^{-t/${B.round(tau,2)}}\\right)`});
     const wt=w0*(1-Math.exp(-g.t/tau));o.push({t:`(ز) السرعة بعد ${g.t} ثانية:`,f:`\\omega=${B.round(w0,2)}\\left(1-e^{-${g.t}/${B.round(tau,2)}}\\right)`,v:B.round(wt,1),unit:'rad/sec',dp:1,final:true});
     o.push({t:'منحنى السرعة مع الزمن (توضيح):<div class="svgbox" style="max-width:440px">'+wtSVG(+w0.toFixed(2),tau,Math.max(5*tau,g.t*1.2),g.t)+'</div>'});return o}},
  {title:'تمرين ٣-١١',ref:'ص 56',q:'<p>محرك تحكم ثنائي الوجه 120 V، J = 0.006 kg.m²، عزم بدء الحركة 0.6 N.m وسرعة اللاحمل 300 rad/s.</p><p class="sub">'+SUG+'</p>',
   given:[{id:'Tst',label:'عزم البدء',sym:'T_{st}',unit:'N.m',value:0.6},{id:'w0',label:'سرعة اللاحمل',sym:'\\omega_o',unit:'rad/s',value:300},{id:'J',label:'القصور الذاتي',sym:'J',unit:'kg.m²',value:0.006},{id:'tE',label:'مدة الرسم',sym:'t',unit:'s',value:6}],
   solve:(g,B)=>{const o=[],kw=B.round(g.Tst/g.w0,5),tau=g.J*g.w0/g.Tst,tr=B.round(tau,2),dpx=v=>v%1?(B.round(v,1)===v?1:2):0;
     o.push({t:'(أ) الرسم: خط مستقيم من (0 , T<sub>st</sub>) إلى (ω<sub>o</sub> , 0):<div class="svgbox" style="max-width:440px">'+lineSVG(g.Tst,g.w0)+'</div>'});
     o.push({t:'(ب) الميل: عند T = 0 تكون ω = ω<sub>o</sub>',f:`K_\\omega=\\frac{T_{st}}{\\omega_o}=\\frac{${g.Tst}}{${g.w0}}`,v:kw});
     o.push({t:'المعادلة التي تصف منحنى الخواص:',f:`T=-${kw}\\,\\omega+${g.Tst}\\ \\ \\text{N.m}`});
     const al=B.round(g.Tst/g.J,2);o.push({t:'(ج) التسارع عند بدء الحركة:',f:`\\alpha=\\frac{T_{st}}{J}=\\frac{${g.Tst}}{${g.J}}`,v:al,unit:'rad/sec²',dp:dpx(al)});
     o.push({t:'(د) ثابت الزمن الميكانيكي:',f:`\\tau=\\frac{J\\times\\omega_o}{T_{st}}=\\frac{${g.J}\\times${g.w0}}{${g.Tst}}`,v:tr,unit:'sec',dp:dpx(tr)});
     const r2=B.round(1.7*tr,2);o.push({t:'(هـ) زمن عكس الحركة:',f:`\\tau_r=1.7\\times${tr}`,v:r2,unit:'sec',dp:dpx(r2)});
     const wE=g.w0*(1-Math.exp(-g.tE/tau));
     o.push({t:`(و) السرعة مع الزمن خلال ${g.tE} ثوانٍ؛ عند نهايتها:`,f:`\\omega=${g.w0}\\left(1-e^{-t/${tr}}\\right),\\quad \\omega(${g.tE})=${g.w0}\\left(1-e^{-${g.tE}/${tr}}\\right)`,v:B.round(wE,1),unit:'rad/sec',dp:1,final:true});
     o.push({t:'<div class="svgbox" style="max-width:440px">'+wtSVG(g.w0,tau,g.tE,g.tE)+'</div>'});return o}}
 ],
 quiz:[
  {q:'محرك تحكم: T = −0.002ω + 0.6. سرعة اللاحمل:',o:['0.6 rad/s','300 rad/s','0.002 rad/s','1200 rad/s'],c:1,e:'عند T = 0: ω = 0.6 / 0.002 = 300 rad/s.'},
  {q:'J = 0.008 و T_st = 0.6 و ωo = 300. ثابت الزمن الميكانيكي:',o:['4 s','3 s','2.4 s','6.8 s'],c:0,e:'τ = 0.008 × 300 / 0.6 = 4 s.'},
  {q:'إذا كان τ = 4 s فزمن عكس الحركة:',o:['4 s','6.8 s','2.35 s','8 s'],c:1,e:'τr = 1.7 × 4 = 6.8 s.'},
  {q:'أي محرك تحكم دواره كأس نحاسي يدور حول حديد ثابت؟',o:['ذو الدائرة المطبوعة','ذو الكأس المجرور','ذو الملف المتحرك','ذو الملفات السطحية'],c:1,e:'الدرس 3.3 (ص 48).'},
  {q:'ما الشرط الذي يجعل منحنى العزم والسرعة خطياً في المحركين المتردد والمستمر؟',o:['مقاومة دوار كبيرة','قصور ذاتي كبير','جهد مجال متغير','دوار حديدي كبير'],c:0,e:'ص 47 و ص 52.'},
  {q:'محرك: ωo = 300 rad/s و τ = 3 s. سرعته عند t = 3 s تقريباً:',o:['300','189.6','110.4','150'],c:1,e:'ω = 0.632 × 300 = 189.6 rad/s.'}
 ]
});

})(PLCBOOK);
