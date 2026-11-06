/* Unit 3 — محركات التحكم (ص 44–56) */
(function(B){
const {S,clamp,W}=B;

/* =====================================================================
   Small helpers for this unit (local copies; other units may not be loaded)
   ===================================================================== */
const q=(el,s)=>el.querySelector(s);
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
  return {check(w){let ch=false;items.forEach((s,j)=>{if(!done[j]&&s.done&&s.done(w)){done[j]=true;ch=true}});if(ch)draw()}};}
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
  el.innerHTML=`<div class="grid">
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
   <div class="panel c12"><p class="sub"><b>أرقام توضيحية:</b> السرعة والعزم معروضان كنسبة مئوية (الكتاب لا يعطي أرقاماً لهذا الدرس). سرعة رسم المجال والدوار مبطأة كثيراً حتى تراها العين، والدوران كمحرك وجه واحد بعد الدفعة نموذج توضيحي لما ذكره الكتاب.</p>${tryBox('try')}</div>
  </div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'شغّل المحرك',x:'ارفع جهد ملف التحكم إلى 50 % أو أكثر. يتكون مجال دوار ويبدأ الدوار الدوران، وكلما زاد الجهد زاد العزم والسرعة.',done:()=>src!=='1ph'&&k>=0.5&&w>0.3},
   {t:'اعكس الاتجاه',x:'اضغط «عكس جهد ملف التحكم 180°»: يعكس المجال اتجاه دورانه فيتباطأ الدوار ثم يدور في الاتجاه المعاكس.',done:()=>flags.rev&&w<-0.2},
   {t:'خطر الوجه الواحد',x:'أنزل الجهد إلى 0 % واترك ملف التحكم مفتوحاً (بدون قصر)، ثم اضغط «دفعة خارجية»: يستمر الدوار في الدوران كمحرك ذي وجه واحد.',done:()=>k===0&&!shorted&&flags.pushed&&Math.abs(w)>0.3},
   {t:'قصر ملف التحكم',x:'شغّل مفتاح «قصر ملف التحكم» والجهد صفر: يتوقف الدوار، وإذا دفعته لا يستمر. هذا ما يطلبه الكتاب ص 46.',done:()=>flags.single&&shorted&&Math.abs(w)<0.02},
   {t:'بدون مكثف',x:'اختر «أحادي الوجه بدون مكثف» وارفع الجهد: التياران في الطور نفسه، فالمجال نابض لا يدور، والمحرك لا يبدأ الحركة وحده.',done:()=>src==='1ph'&&k>=0.5&&Math.abs(w)<0.02},
   {t:'أضف المكثف',x:'اختر «أحادي الوجه + مكثف»: المكثف على التوالي مع ملف الجهد الثابت يصنع فرق 90°، فيعود المجال دواراً ويدور المحرك.',done:()=>src==='cap'&&k>=0.3&&Math.abs(w)>0.2}]);
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
   const rotating=src!=='1ph'&&k>0;let T;
   if(rotating)T=k*d-w;else if(shorted)T=-w;else T=T1(w);
   if(!rotating&&!shorted&&Math.abs(w)>0.3&&k===0)flags.single=1;
   const fr=0.02;let a=T-fr*Math.sign(w);if(Math.abs(w)<0.01&&Math.abs(T)<=fr){w=0;a=0}
   w+=a/0.45*dt;th+=w*dt*360*0.45;
   const f=fieldPaths(src,k,d,phi,160,74);
   q(el,'#u3l1-B').setAttribute('d',f.B);q(el,'#u3l1-Bh').setAttribute('d',f.H);q(el,'#u3l1-tr').setAttribute('d',f.T);
   q(el,'#u3l1-rot').setAttribute('transform',`rotate(${(th%360).toFixed(1)} 160 160)`);
   [0,2].forEach(i=>q(el,'#u3l1-c'+i).setAttribute('opacity',(0.12+0.75*Math.abs(f.ia)).toFixed(2)));[1,3].forEach(i=>q(el,'#u3l1-c'+i).setAttribute('opacity',(0.12+0.75*Math.abs(f.im)).toFixed(2)));
   ht+=dt;if(ht>0.08){ht=0;hist.push([t,w*100]);while(hist.length&&hist[0][0]<t-10)hist.shift();
     q(el,'#ch').innerHTML=plot({W:420,H:200,x:[t-10,t],y:[-110,110],yt:[-100,-50,0,50,100],xt:[],ax0:false,xl:'t →',yl:'speed %',lines:[{pts:hist,col:'--blue'}],aria:'السرعة مع الزمن'})}
   q(el,'#fState').textContent=rotating?(k>=0.999?'دوار منتظم':'دوار (بيضاوي)'):(src==='1ph'?'نابض (لا يدور)':'وجه واحد فقط');
   q(el,'#fT').textContent=(rotating?Math.round(k*100):0)+' %';q(el,'#fW').textContent=Math.round(Math.abs(w)*100)+' %';
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
  {err:'الشكلان (٣-٢) و (٣-٣) ص 47 منقولان من مرجع آخر، ومكتوب داخل الصورتين «Fig4-2» و «Fig4-3» بدل (٣-٢) و (٣-٣). أعدنا رسمهما بدون هذه العناوين.'}
 ],
 lab:(el)=>{
  let sm=0.15,va=1,wop=0.4;const flags={};
  el.innerHTML=`<div class="grid">
   <div class="panel c6"><h2>(١) أثر مقاومة الدوار <small>مبني على الشكل (٣-٢) ص 47</small></h2>
    ${slHTML('r2','مقاومة الدوار R<sub>2</sub> (نسبية)',0,100,1,0)}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button class="btn" data-p="a">المنحنى a</button><button class="btn" data-p="b">المنحنى b</button><button class="btn" data-p="c">المنحنى c</button><button class="btn" data-p="d">أكبر من c</button></div>
    <div class="svgbox" id="p1"></div>
    <div class="facts">${fact('سرعة أقصى عزم (pu)','f1')}${fact('عزم البدء ÷ أقصى عزم','f2')}${fact('البعد عن الخط المستقيم','f3')}</div><div id="m1"></div></div>
   <div class="panel c6"><h2>(٢) أثر جهد ملف التحكم <small>مبني على الشكل (٣-٣) والمعادلة (٣-٢)</small></h2>
    ${slHTML('va','جهد ملف التحكم V<sub>a</sub>',0,100,5,100)}${slHTML('wo','سرعة الدوار ω (نقطة التشغيل)',0,110,1,40)}
    <div class="svgbox" id="p2"></div><div class="ex-f" id="eq" style="text-align:center"></div>
    <div class="facts">${fact('عزم البدء T<sub>st</sub> = K<sub>v</sub>V<sub>a</sub>','g1')}${fact('سرعة اللاحمل ω<sub>o</sub>','g2')}${fact('العزم عند السرعة المختارة','g3')}</div><div id="m2"></div></div>
   <div class="panel c12"><p class="sub"><b>أرقام توضيحية:</b> القيم بالوحدة النسبية (pu). في اللوحة (١) استعملنا علاقة المحرك الحثي المعروفة لرسم المنحنيات (ليست من الكتاب)، مع بقاء أقصى عزم ثابتاً كما يقول الكتاب. في اللوحة (٢) أخذنا <span class="ltr">\\(K_\\omega = K_v = 1\\)</span> pu.</p>${tryBox('try')}</div></div>`;
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
  const draw2=()=>{q(el,'#va-v').textContent=va.toFixed(2)+' pu';q(el,'#wo-v').textContent=wop.toFixed(2)+' pu';const T=-wop+va;
    const L=[1,0.8,0.6].map(v=>({pts:[[0,v],[v,0]],col:'--muted',w:1.8,dash:'5 4'}));L.push({pts:[[0,va],[Math.max(va,0.001),0]],col:'--blue',w:3});
    const lab=[1,0.8,0.6].map(v=>({x:v,y:0,s:v.toFixed(1),dy:16,c:'m'}));
    q(el,'#p2').innerHTML=plot({W:460,H:270,x:[0,1.12],y:[-0.25,1.12],xt:[0,0.5,1],yt:[0,0.5,1],xl:'ω (pu)',yl:'T (pu)',lines:L,dots:[{x:wop,y:T,col:T<0?'--stop':'--on'}],hl:[],labels:[{x:wop,y:T,s:`(${wop.toFixed(2)}, ${T.toFixed(2)})`,dy:-12,a:'start',dx:6}],aria:'خطوط العزم والسرعة'});
    q(el,'#eq').innerHTML=B.tex(`T=-K_\\omega\\,\\omega+K_v V_a=-(1)(${wop.toFixed(2)})+(1)(${va.toFixed(2)})=${T.toFixed(2)}\\ \\text{pu}`,true);
    q(el,'#g1').textContent=va.toFixed(2)+' pu';q(el,'#g2').textContent=va.toFixed(2)+' pu';q(el,'#g3').textContent=T.toFixed(2)+' pu';
    q(el,'#m2').innerHTML=T<-0.001?'<div class="callout err">السرعة المختارة أكبر من سرعة اللاحمل لهذا الجهد: العزم سالب (يعمل المحرك على فرملة الحمل). توضيح ليس من الكتاب.</div>':Math.abs(T)<0.011?'<div class="callout">العزم صفر: هذه هي <b>سرعة اللاحمل</b> لهذا الجهد.</div>':wop<0.011?'<div class="callout">السرعة صفر: هذا هو <b>عزم البدء</b>، وهو أقصى عزم للمحرك.</div>':''};
  q(el,'#va').addEventListener('input',e=>{va=+e.target.value/100;if(va<=0.6)flags.low=1;draw2()});
  q(el,'#wo').addEventListener('input',e=>{wop=+e.target.value/100;flags.moved=1;draw2()});
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
  let V=0.6,d=0,t=0,ht=0,hist=[];const R={cup:{w:0,th:0,J:0.15,t0:null,tau:null},cage:{w:0,th:0,J:0.6,t0:null,tau:null}};const TC=0.07,flags={};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>سباق الاستجابة: الكأس المجرور ضد الدوار العادي <small>مبني على الشكل (٣-٤) ونص ص 48</small></h2>
    <div class="wrap-in" style="align-items:flex-end">${slHTML('v','جهد ملفات الثابت (يتحكم في السرعة)',0,100,5,60)}
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" id="go">▶ تشغيل</button><button class="btn" id="rv">⇄ عكس الاتجاه</button><button class="btn" id="st">■ إيقاف</button></div></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:10px">
     <div style="text-align:center"><b>الكأس المجرور</b><div class="svgbox" style="max-width:180px;margin-inline:auto">${endCupSVG('u3cup')}</div><div class="facts">${fact('السرعة','sCup')}${fact('زمن الوصول إلى 63 %','tCup')}</div></div>
     <div style="text-align:center"><b>دوار قفص عادي بأسنان</b><div class="svgbox" style="max-width:180px;margin-inline:auto">${endCageSVG('u3cage')}</div><div class="facts">${fact('السرعة','sCage')}${fact('زمن الوصول إلى 63 %','tCage')}</div></div>
    </div><div id="msg"></div></div>
   <div class="panel c12"><h2>السرعة مع الزمن <small>آخر 8 ثوانٍ</small></h2><div class="svgbox" id="ch"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>الكأس المجرور</span><span><i style="background:var(--live)"></i>الدوار العادي</span></div>
    <p class="sub"><b>أرقام توضيحية:</b> افترضنا أن القصور الذاتي للكأس ربع قصور الدوار العادي، وأضفنا للدوار العادي عزماً صغيراً متذبذباً يمثل العضة المغناطيسية بين الأسنان. الكتاب يذكر الفكرة فقط ولا يعطي أرقاماً.</p>${tryBox('try')}</div></div>`;
  const tl=tryList(q(el,'#try'),[
   {t:'شغّل الاثنين معاً',x:'اضغط «تشغيل»: الكأس المجرور يصل إلى سرعته أسرع بكثير لأن قصوره الذاتي ضعيف جداً.',done:()=>R.cup.tau&&R.cage.tau},
   {t:'اعكس الاتجاه',x:'اضغط «عكس الاتجاه» وقارن: الكأس يعكس حركته قبل الدوار العادي بوقت واضح.',done:()=>flags.rev&&R.cup.w<-0.3},
   {t:'سرعة منخفضة',x:'خفّض الجهد إلى 10–20 %: لاحظ اهتزاز سرعة الدوار العادي (العضة المغناطيسية) بينما يدور الكأس بنعومة.',done:()=>d!==0&&V<=0.2&&V>0.08&&Math.abs(R.cup.w)>0.05},
   {t:'جهد صغير جداً',x:'اجعل الجهد 5 %: الدوار العادي قد يعلق بين الأسنان ولا يدور، أما الكأس فيدور ببطء.',done:()=>d!==0&&V<=0.06&&V>0&&Math.abs(R.cage.w)<0.01&&Math.abs(R.cup.w)>0.02},
   {t:'التحكم بالجهد',x:'غيّر الجهد أثناء الدوران: سرعة الكأس تتبع الجهد (الكتاب: التحكم في السرعة بتغيير جهد ملفات الثابت).',done:()=>flags.vchg&&d!==0}]);
  const vs=q(el,'#v');const sv=()=>{q(el,'#v-v').textContent=Math.round(V*100)+' %'};sv();
  vs.addEventListener('input',()=>{V=+vs.value/100;if(d)flags.vchg=1;sv()});
  const step=nd=>{d=nd;['cup','cage'].forEach(k=>{R[k].t0=t;R[k].tau=null;R[k].w0=R[k].w})};
  q(el,'#go').addEventListener('click',()=>step(d||1));q(el,'#rv').addEventListener('click',()=>{flags.rev=1;step(d?-d:-1)});q(el,'#st').addEventListener('click',()=>step(0));
  loopOn(el,dt=>{t+=dt;const n=6,h=dt/n;
   ['cup','cage'].forEach(k=>{const r=R[k];for(let i=0;i<n;i++){let T=d*V-r.w;if(k==='cage')T-=TC*Math.sin(12*r.th);
     const fr=0.01;let a=T-fr*Math.sign(r.w);if(Math.abs(r.w)<0.004&&Math.abs(T)<=fr){r.w=0;a=0}r.w+=a/r.J*h;r.th+=r.w*h*2*Math.PI*0.6}
     if(r.t0!=null&&r.tau==null&&d!==0){const tgt=d*V,frac=(r.w-r.w0)/(tgt-r.w0||1e-9);if(Math.abs(tgt-r.w0)>0.05&&frac>=0.632)r.tau=t-r.t0}
     const g=q(el,'#u3'+k);if(g)g.setAttribute('transform',`rotate(${((r.th*180/Math.PI)%360).toFixed(1)} 90 90)`);});
   ht+=dt;if(ht>0.05){ht=0;hist.push([t,R.cup.w*100,R.cage.w*100]);while(hist.length&&hist[0][0]<t-8)hist.shift();
     q(el,'#ch').innerHTML=plot({W:760,H:240,x:[t-8,t],y:[-110,110],yt:[-100,-50,0,50,100],xt:[],ax0:false,xl:'t →',yl:'speed %',lines:[{pts:hist.map(p=>[p[0],p[2]]),col:'--live'},{pts:hist.map(p=>[p[0],p[1]]),col:'--blue'}],aria:'السرعة مع الزمن للدوارين'});
     q(el,'#sCup').textContent=Math.round(R.cup.w*100)+' %';q(el,'#sCage').textContent=Math.round(R.cage.w*100)+' %';
     q(el,'#tCup').textContent=R.cup.tau!=null?R.cup.tau.toFixed(2)+' s':'—';q(el,'#tCage').textContent=R.cage.tau!=null?R.cage.tau.toFixed(2)+' s':'—';
     q(el,'#msg').innerHTML=d!==0&&V>0&&V<=TC&&Math.abs(R.cage.w)<0.01?'<div class="callout err">الدوار العادي عالق: عزم المحرك عند هذا الجهد أصغر من «العضة» بين أسنانه. الكأس المجرور لا أسنان له فيدور. (توضيح)</div>':''}
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
  {err:'عنوان الشكل (٣-٥) ص 50 «منحني السرعة مع العزم»، بينما المحور الأفقي في الرسم هو <b>الزمن</b> (Time (sec.)) والمنحنى هو <b>السرعة مع الزمن</b> حسب المعادلة (٣-٥).'},
  {html:`<p><b>د. زمن عكس الحركة (τ<sub>r</sub>):</b> «هو الزمن اللازم للمحرك لكي يعكس اتجاه حركته الدورانية، ابتداءً من سرعة اللاحمل في اتجاه معين وحتى تصل سرعته إلى 63.2٪ من سرعة اللاحمل في الاتجاه المضاد، وذلك عند عكس اتجاه جهد ملف التحكم مئة وثمانين درجة بينما يكون المحرك بدون أحمال، وعلى وجه العموم فإن:» زمن عكس الحركة = 1.7 × ثابت الزمن الميكانيكي.</p>
   <div dir="ltr" style="direction:ltr">$$\\tau_r = 1.7\\,\\tau$$</div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> من أين جاء الرقم 1.7؟ عند العكس تبدأ السرعة من <span class="ltr">\\(+\\omega_o\\)</span> وتتجه نحو <span class="ltr">\\(-\\omega_o\\)</span> بالثابت الزمني نفسه: <span class="ltr">\\(\\omega=-\\omega_o+2\\omega_o e^{-t/\\tau}\\)</span>. نصل إلى <span class="ltr">\\(-0.632\\,\\omega_o\\)</span> عندما <span class="ltr">\\(e^{-t/\\tau}=0.184\\)</span> أي <span class="ltr">\\(t\\approx1.69\\,\\tau\\approx1.7\\,\\tau\\)</span>. يمكنك قياس ذلك بنفسك في المختبر.'},
  {err:'ترقيم البنود ص 49 مطبوع «أ، ب، ت، ث، ج» ثم «د.» — خليط بين الترتيب الأبجدي والهجائي. نقلناه كما هو.'},
  {h:'مثال (٣-١)',ref:'ص 50–51',html:`<p>«محرك تحكم للتيار المتردد، ثنائي الوجه 120 فولت، 60 هيرتز، له منحنيات الخواص المبينة بالشكل (٣-٦)، قصوره الذاتي 0.01 كيلوجرام.متر²، الجهد على ملف التحكم 95 فولت. أوجد: أ. المعادلة التي تصف منحنى الخواص (العلاقة بين العزم والسرعة). ب. التسارع عند بدء الحركة. ج. سرعة اللاحمل. د. ثابت الزمن الميكانيكي. هـ. زمن عكس الحركة. و. معادلة السرعة مع الزمن.»</p><p>الحل خطوة بخطوة (وبأرقامك أنت) في تبويب <b>«الأمثلة المحلولة»</b>.</p>`},
  {fig:'(٣-٦)',ref:'ص 50',caption:'منحنيات خواص محرك المثال (٣-١): ثلاثة خطوط متوازية (إعادة رسم). بدّل لترى الفرق بين الرسم والمعادلة.',draw:()=>'<div id="u3f36">'+box(fig36SVG('fig'),520)+'</div>'},
  {widget:(el)=>{let m='fig';const draw=()=>{el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${segHTML('m',[['fig','كما في الشكل (٣-٦)'],['eq','حسب المعادلة (٣-١)'],['both','الاثنان معاً']],m)}</div>
     <div class="tablebox" style="margin-top:8px"><table class="tt"><thead><tr><th>V<sub>a</sub></th><th>T<sub>st</sub> في الشكل</th><th>T<sub>st</sub> = 0.00789 V<sub>a</sub></th><th>ω<sub>o</sub> في الشكل</th><th>ω<sub>o</sub> حسب المعادلة</th></tr></thead><tbody>${[110,95,70].map(v=>`<tr><td class="mono">${v} V</td><td class="mono">${FIG36[v].T.toFixed(2)}</td><td class="mono">${eqLine(v).T.toFixed(3)}</td><td class="mono">${FIG36[v].w}</td><td class="mono">${eqLine(v).w.toFixed(1)}</td></tr>`).join('')}</tbody></table></div>`;
     const f=document.getElementById('u3f36');if(f)f.innerHTML=box(fig36SVG(m),520);
     el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw()}},
  {err:'الشكل (٣-٦) ص 50 لا يتفق مع المعادلة (٣-١) <span class="ltr">\\(T \\propto V_a\\)</span>: من خط 95 V نحصل على <span class="ltr">\\(K_v = 0.75/95 = 0.00789\\)</span>، فيكون عزم البدء عند 110 V هو 0.868 N.m وعند 70 V هو 0.553 N.m، بينما الشكل يرسمهما 1.0 و 0.5 N.m (والخطوط ليست متناسبة مع الجهد). الحل في الكتاب يستعمل خط 95 V فقط فلا يتأثر. في المختبر يمكنك الاختيار بين «كما في الشكل» و «حسب المعادلة».'},
  {err:'في الحل ص 51 طُبع الأس «<span class="ltr">\\(e^{-0..33t}\\)</span>» بنقطتين، والصحيح <span class="ltr">\\(e^{-0.33t}\\)</span> أي <span class="ltr">\\(e^{-t/3}\\)</span>. كذلك المعطى «120 فولت، 60 هيرتز» لا يستعمل في الحل.'},
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
  note:'<b>ملاحظة على الكتاب:</b> طُبع الأس في الجواب (و) «e<sup>−0..33t</sup>» بنقطتين؛ والصحيح e<sup>−0.33t</sup> (أي e<sup>−t/3</sup>) كما يظهر أعلاه. التقريب كما في الكتاب: K<sub>v</sub> = 0.00789 (الدقيق 0.0078947)، و K<sub>ω</sub> = 0.0033 (الدقيق 0.003333). المعطى «120 فولت، 60 هيرتز» لا يُستعمل في الحل.'
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
  const L=ref.map(([v])=>({pts:[[0,v],[v,0]],col:cur?'--muted':'--fg',w:cur?1.6:2.4,dash:cur?'5 4':''}));
  if(cur)L.push({pts:[[0,cur.Va],[cur.Va,0]],col:'--blue',w:3});
  return plot({W:460,H:270,x:cur?[-1.1,1.1]:[0,1.1],y:cur?[-1.1,1.1]:[0,1.1],xt:cur?[-1,-0.5,0.5,1]:[[0.5,'ωo3'],[0.75,'ωo2'],[1,'ωo1']],yt:cur?[-1,-0.5,0.5,1]:[[0.5,'Tst3'],[0.75,'Tst2'],[1,'Tst1']],ml:cur?44:58,xl:'ω',yl:'T',lines:L,
    labels:ref.map(([v,l])=>({x:v*0.5,y:v*0.5,s:l,dx:6,dy:-4,a:'start',c:'b'})),dots:cur&&cur.dot?[cur.dot]:[],hl:cur&&cur.TL?[{y:cur.TL,col:'--stop',label:'TL'}]:[],aria:'منحنى العزم والسرعة لمحرك التحكم للتيار المستمر'})}
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
  {err:'العنوان ص 53 مطبوع «٣-٢-١ اشكال مختلفة…» والأنواع بعده مرقمة ٣-٢-١-١ إلى ٣-٢-١-٣. وفي ص 54 سقطت نقطة قبل «الشكل (٣-١٠)» في عبارة «أقطاب مغناطيسية دائمة قوية الشكل (٣-١٠) يوضح…». نقلنا المعنى بعلامات ترقيم مصححة.'}
 ],
 lab:(el)=>{
  let Va=0.75,TL=0.1,pm=false,w=0,th=0,form='pc',feat=null,ht=0,lastSig='';const flags={},angF={pc:0,sw:0,mc:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>محرك تحكم للتيار المستمر <small>مبني على الشكلين (٣-٧) و (٣-٨) ص 52</small></h2>
    <div class="wrap-in" style="align-items:flex-end">${slHTML('va','جهد المنتج V<sub>a</sub> (والإشارة = الاتجاه)',-100,100,5,75)}${slHTML('tl','عزم الحمل T<sub>L</sub>',0,60,2,10)}
     <div><div class="sub">المجال</div>${segHTML('pm',[[0,'تغذية مستقلة V<sub>f</sub> ثابت'],[1,'مغناطيس دائم']],0)}</div></div>
    <div class="facts">${fact('السرعة ω','fw')}${fact('العزم T','fT')}${fact('تيار المنتج I<sub>a</sub>','fI')}${fact('القوة الدافعة العكسية E<sub>a</sub>','fE')}${fact('الاتجاه','fd')}</div><div id="msg"></div></div>
   <div class="panel c7"><h2>الدائرة <small>الشكل (٣-٧)</small></h2><div class="svgbox" id="cir"></div></div>
   <div class="panel c5"><h2>العزم والسرعة <small>الشكل (٣-٨)</small></h2><div class="svgbox" id="tw"></div><p class="sub">الخطوط الرمادية Va1 و Va2 و Va3 من الشكل، والخط الأخضر لجهدك الآن، والخط الأحمر عزم الحمل.</p></div>
   <div class="panel c12"><p class="sub"><b>أرقام توضيحية بالوحدة النسبية (pu):</b> استعملنا علاقات محرك التيار المستمر المعروفة (ليست من نص الكتاب): <span class="ltr">\\(E_a = K\\omega\\)</span>، <span class="ltr">\\(I_a = (V_a - E_a)/R_a\\)</span>، <span class="ltr">\\(T = K I_a\\)</span> مع <span class="ltr">\\(K = R_a = 1\\)</span> pu، فيصير <span class="ltr">\\(T = V_a - \\omega\\)</span>: خط مستقيم ذو ميل سالب كما يقول الكتاب.</p>${tryBox('try')}</div>
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
  loopOn(el,dt=>{const n=4,h=dt/n;let T=0;
   for(let i=0;i<n;i++){T=Va-w;const sgn=Math.abs(w)>1e-3?Math.sign(w):Math.sign(T);let net=T-TL*sgn;if(Math.abs(w)<2e-3&&Math.abs(T)<=TL){net=0;w=0}w+=net/0.35*h}
   th+=w*dt*360*0.6;const g=q(el,'#u3fm');angF[form]+=0.5*dt*360*0.4;if(g){const c=form==='pc'?'270 90':'90 90';g.setAttribute('transform',`rotate(${(angF[form]%360).toFixed(1)} ${c})`)}
   ht+=dt;if(ht<0.06)return;ht=0;T=Va-w;
   q(el,'#fw').textContent=w.toFixed(2)+' pu';q(el,'#fT').textContent=T.toFixed(2)+' pu';q(el,'#fI').textContent=T.toFixed(2)+' pu';q(el,'#fE').textContent=w.toFixed(2)+' pu';q(el,'#fd').textContent=Math.abs(w)<0.01?'متوقف':w>0?'⟳ أمامي':'⟲ عكسي';
   q(el,'#cir').innerHTML=dcCircuitSVG({pm,live:Math.abs(Va)>0.001,Va,lbl:`Ia = ${T.toFixed(2)} pu`});
   q(el,'#tw').innerHTML=fig38SVG({Va,TL:TL*(w<-0.01||(Va<0&&Math.abs(w)<0.01)?-1:1),dot:{x:w,y:T,col:'--stop'}});
   const sg=[Math.abs(w)<0.01&&Math.abs(Va)>0].join();if(sg!==lastSig){lastSig=sg;q(el,'#msg').innerHTML=Math.abs(w)<0.01&&Math.abs(Va)>0?'<div class="callout err">عزم المحرك عند السرعة صفر (عزم البدء = V<sub>a</sub> بالـ pu) لا يكفي لتحريك الحمل: زِد الجهد أو خفّف الحمل.</div>':''}
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
