/* Unit 5 — الآلات ذاتية التزامن (ص 68–81) */
(function(B){
const {S,clamp}=B;
const D=Math.PI/180;
/* ---------------- small helpers for this unit ---------------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
const fx=v=>(+v).toFixed(1);
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const slHTML=(id,lab,min,max,step,val,unit)=>`<label style="display:flex;flex-direction:column;gap:3px;flex:1 1 170px;min-width:140px;font-size:13.5px"><span>${lab} <b class="ltr" id="${id}-v" style="font-family:var(--mono)"></b> <span class="ltr">${unit||''}</span></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;accent-color:var(--blue)"></label>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const facts=arr=>arr.map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('');
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(12,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function coil(x1,y1,x2,y2,n,cls,extra){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}" ${extra||''}/>`}
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||48,R=14,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.xl)s+=S.t((L+W-R)/2,H-6,o.xl,'');if(o.yl)s+=`<text class="txt" x="12" y="${(T+H-Bm)/2}" text-anchor="middle" transform="rotate(-90 12 ${(T+H-Bm)/2})">${o.yl}</text>`;
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const wrap=a=>((a%360)+540)%360-180; // to (-180,180]
const u=th=>[-Math.sin(th*D),-Math.cos(th*D)]; // unit vector, angle CCW from top (screen coords)
const SANG={S1:0,S2:-120,S3:120};       // stator coil axes: S1 top, S2 lower-right, S3 lower-left (as drawn in الأشكال ٥-١ … ٥-٣)
// coil voltages of a transmitter with rotor at th (illustrative, not in the book): E·cos(th − axis)
const coilV=th=>['S1','S2','S3'].map(k=>Math.cos((th-SANG[k])*D));

/* synchro schematic symbol. o:{lab, rot (deg, physical rotor-axis angle CCW from top), kind:'coil'|'star', R, leads:'left'|'right'|null, volts:[3] (signed pu), hi} */
function synSym(cx,cy,o){const R=o.R||40,RT=R+50;let s='';
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  ['S1','S2','S3'].forEach((k,i)=>{const [ux,uy]=u(SANG[k]);const v=o.volts?o.volts[i]:null;const cls=v!=null&&Math.abs(v)>0.05?'live':'';
    s+=coil(cx+ux*R,cy+uy*R,cx+ux*(R+38),cy+uy*(R+38),3,cls,v!=null?`style="stroke-width:${(1.6+2.4*Math.abs(v)).toFixed(1)}"`:'')+S.w(`M${fx(cx+ux*(R+38))} ${fx(cy+uy*(R+38))}L${fx(cx+ux*RT)} ${fx(cy+uy*RT)}`,cls)+S.dot(fx(cx+ux*RT),fx(cy+uy*RT));
    const lx=cx+ux*(RT+4)+(i===0?16:i===1?14:-14),ly=cy+uy*(RT+4)+(i===0?4:12);s+=S.t(fx(lx),fx(ly),k,'b',i===2?'end':'start')});
  if(o.kind==='star'){[0,-120,120].forEach((d,i)=>{const [ux,uy]=u(o.rot+d);s+=coil(cx,cy,cx+ux*(R-8),cy+uy*(R-8),2,'')+S.t(fx(cx+ux*(R-17)+(uy*9)),fx(cy+uy*(R-17)-ux*9+4),'R'+(i+1),'m')});
    s+=`<circle cx="${cx}" cy="${cy}" r="3" fill="var(--fg)"/>`+`<path d="M${cx+14} ${cy-8}A16 16 0 0 1 ${cx+8} ${cy+14}" fill="none" stroke="var(--blue)" stroke-width="1.6"/>`;}
  else{const [ux,uy]=u(o.rot),rr=R-9;s+=coil(cx-ux*rr,cy-uy*rr,cx+ux*rr,cy+uy*rr,4,o.rotLive?'live':'')+`<circle cx="${fx(cx+ux*rr)}" cy="${fx(cy+uy*rr)}" r="3.4" fill="var(--blue)"/>`;
    if(o.leads){const sx=o.leads==='left'?-1:1;s+=`<path d="M${cx+sx*R} ${cy-8}H${cx+sx*(R+20)}M${cx+sx*R} ${cy+8}H${cx+sx*(R+20)}" stroke="var(--fg)" stroke-width="1.6"/>`+S.dot(cx+sx*(R+20),cy-8)+S.dot(cx+sx*(R+20),cy+8)}}
  s+=`<text class="txt b" x="${cx+(o.labDx||0)}" y="${cy+R*0.62}" text-anchor="middle" font-size="12">${o.lab}</text>`;
  return s}
/* section drawings (الأشكال ٥-١، ٥-٢أ، ٥-٣) */
function statorRing(cx,cy,R1,R2,n){let s=`<circle cx="${cx}" cy="${cy}" r="${R1}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="${R2}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/>`;
  for(let i=0;i<n;i++){const a=i*360/n*D;s+=`<circle cx="${fx(cx+(R2+7)*Math.cos(a))}" cy="${fx(cy+(R2+7)*Math.sin(a))}" r="3.6" fill="var(--live)" opacity=".8"/>`}return s}
function sectionSVG(kind,th){const cx=110,cy=110;let s=`<svg viewBox="0 0 220 220" role="img" aria-label="مقطع">`+statorRing(cx,cy,100,74,24);
  const g=`transform="rotate(${fx(-th)} ${cx} ${cy})"`;
  if(kind==='salient'){s+=`<g ${g}><path d="M${cx-18} ${cy-38}H${cx+18}V${cy+38}H${cx-18}Z" fill="var(--surface-2)" stroke="var(--fg)"/><path d="M${cx-40} ${cy-70}A80 80 0 0 1 ${cx+40} ${cy-70}L${cx+18} ${cy-38}H${cx-18}Z" fill="var(--surface-2)" stroke="var(--fg)"/><path d="M${cx-40} ${cy+70}A80 80 0 0 0 ${cx+40} ${cy+70}L${cx+18} ${cy+38}H${cx-18}Z" fill="var(--surface-2)" stroke="var(--fg)"/>${[-26,-14,-2,10,22].map(y=>`<path d="M${cx-22} ${cy+y}H${cx+22}" stroke="var(--blue)" stroke-width="3"/>`).join('')}</g>`}
  if(kind==='cyl'){s+=`<g ${g}><circle cx="${cx}" cy="${cy}" r="70" fill="var(--surface-2)" stroke="var(--fg)"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*30*D;return `<circle cx="${fx(cx+62*Math.cos(a))}" cy="${fx(cy+62*Math.sin(a))}" r="3.4" fill="${i%6<3?'var(--blue)':'var(--muted)'}"/>`}).join('')}<path d="M${cx} ${cy-58}V${cy+58}" stroke="var(--blue)" stroke-dasharray="4 3"/></g>`}
  if(kind==='umbrella'){s+=`<g ${g}><path d="M${cx-68} ${cy-14}A70 70 0 0 1 ${cx+68} ${cy-14}L${cx+12} ${cy-14}V${cy+40}H${cx-12}V${cy-14}Z" fill="var(--surface-2)" stroke="var(--fg)"/><path d="M${cx-68} ${cy+14}A70 70 0 0 0 ${cx+68} ${cy+14}L${cx+12} ${cy+14}" fill="none" stroke="var(--line)"/>${[-24,-12,0,12].map(x=>`<path d="M${cx+x} ${cy-34}v14" stroke="var(--blue)" stroke-width="5"/>`).join('')}</g>`}
  if(kind==='cd'){s+=`<g ${g}><circle cx="${cx}" cy="${cy}" r="70" fill="var(--surface-2)" stroke="var(--fg)"/>${Array.from({length:18},(_,i)=>{const a=i*20*D;return `<circle cx="${fx(cx+62*Math.cos(a))}" cy="${fx(cy+62*Math.sin(a))}" r="3.4" fill="var(--blue)"/>`}).join('')}<circle cx="${cx}" cy="${cy}" r="20" fill="var(--surface)" stroke="var(--fg)"/><path d="M${cx} ${cy-58}V${cy-74}" stroke="var(--stop)" stroke-width="3"/></g>`}
  s+=`<circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/>`;
  return s+'</svg>'}
/* pointer drag helper: rotates the knob nearest to the pointer (targets in viewBox coords) */
function dragKnobs(host,vbW,vbH,targets){let cur=null;
  const pos=e=>{const svg=host.querySelector('svg');const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;return [(e.clientX-r.left)/r.width*(vb&&vb.width||vbW),(e.clientY-r.top)/r.height*(vb&&vb.height||vbH)]};
  const upd=e=>{if(!cur)return;const [x,y]=pos(e);cur.set(Math.atan2(-(x-cur.cx),-(y-cur.cy))/D)};
  host.style.touchAction='none';
  host.addEventListener('pointerdown',e=>{const [x,y]=pos(e);let best=null,bd=1e9;targets().forEach(t=>{const d=Math.hypot(x-t.cx,y-t.cy);if(d<(t.r||70)&&d<bd){bd=d;best=t}});cur=best;if(cur){host.setPointerCapture&&host.setPointerCapture(e.pointerId);upd(e)}});
  host.addEventListener('pointermove',upd);['pointerup','pointercancel'].forEach(ev=>host.addEventListener(ev,()=>{cur=null}))}
const dial=(cx,cy,r,th,lab)=>{const [ux,uy]=u(th);let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let i=0;i<12;i++){const [a,b]=u(i*30);s+=`<path d="M${fx(cx+a*(r-5))} ${fx(cy+b*(r-5))}L${fx(cx+a*r)} ${fx(cy+b*r)}" stroke="var(--muted)"/>`}
  return s+`<path d="M${cx} ${cy}L${fx(cx+ux*(r-6))} ${fx(cy+uy*(r-6))}" stroke="var(--stop)" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="4" fill="var(--fg)"/>`+(lab?arT(cx,cy+r+16,lab,{fs:11.5}):'')};
const degTxt=a=>{const r=Math.round(a);return (r<0?'−':'')+Math.abs(r)+'°'};

/* wiring CX → (CT|CR) as الشكل (٥-٤): S1–S1, S2–S2, S3–S3 */
function pairSVG(o){// o:{thx, thy (physical), right:'CT'|'CR', volts, e, rightRotLive}
  const A=130,Bx=430,cy=150,R=40,RT=R+50;const T=(cx,k)=>{const [ux,uy]=u(SANG[k]);return [cx+ux*RT,cy+uy*RT]};
  let s=`<svg viewBox="0 0 560 330" role="img" aria-label="توصيل ${o.right==='CT'?'مرسل التحكم مع محول التحكم':'مرسل التحكم مع مستقبل التحكم'}">`;
  const v=o.volts||[0,0,0],wc=i=>Math.abs(v[i])>0.05?'live':'';
  const a1=T(A,'S1'),b1=T(Bx,'S1'),a2=T(A,'S2'),b2=T(Bx,'S2'),a3=T(A,'S3'),b3=T(Bx,'S3');
  s+=S.w(`M${fx(a1[0])} ${fx(a1[1])}V28H${fx(b1[0])}V${fx(b1[1])}`,wc(0))+S.w(`M${fx(a2[0])} ${fx(a2[1])}V282H${fx(b2[0])}V${fx(b2[1])}`,wc(1))+S.w(`M${fx(a3[0])} ${fx(a3[1])}V304H${fx(b3[0])}V${fx(b3[1])}`,wc(2));
  s+=S.t(280,22,'S1 — S1','m')+S.t(330,276,'S2 — S2','m')+S.t(230,318,'S3 — S3','m');
  s+=synSym(A,cy,{lab:'CX',rot:o.thx,kind:'coil',leads:'left',volts:v,rotLive:1});
  s+=synSym(Bx,cy,{lab:o.right,rot:o.thy,kind:'coil',leads:o.right==='CT'?'right':'left',volts:v,rotLive:o.rightRotLive});
  s+=`<circle cx="${A-R-34}" cy="${cy}" r="12" fill="var(--surface)" stroke="var(--fg)"/><path d="M${A-R-41} ${cy}q3.5 -7 7 0t7 0" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`+S.w(`M${A-R-20} ${cy-8}V${cy-18}H${A-R-34}V${cy-12}`,'live')+S.w(`M${A-R-20} ${cy+8}V${cy+18}H${A-R-34}V${cy+12}`,'live')+S.t(A-R-34,cy+34,'AC','m');
  if(o.right==='CT'){const ex=Bx+R+20;const on=Math.abs(o.e||0)>0.5;s+=`<circle cx="${ex+26}" cy="${cy}" r="17" fill="var(--surface)" stroke="${on?'var(--live)':'var(--fg)'}" stroke-width="${on?2.4:1.4}"/>`+S.t(ex+26,cy+5,'V','',null,13)+S.w(`M${ex} ${cy-8}H${ex+26}V${cy-17}`,on?'live':'')+S.w(`M${ex} ${cy+8}H${ex+26}V${cy+17}`,on?'live':'')+S.t(ex+26,cy+36,'e','b')}
  return s+'</svg>'}

/* =================== Lesson 5.1 =================== */
const ELEM={
 CX:{n:'مرسل التحكم',en:'The control transmitter (CX)',fig:'(٥-١)',pg:'ص 70–71',sec:'salient',kind:'coil',zero:0,
   txt:'«يتركب من عضو ثابت وآخر دوار، توجد مجار على السطح الداخلي للعضو الثابت ملفوف بداخلها ثلاثة ملفات … موصلة على شكل نجمة وبحيث تكون الزاوية بين محاورها 120° كهربائية … الدوار له قطبان بارزان وملفوف على جزءه ملف أحادي الوجه ذو عدد كبير من اللفات.»',
   ztxt:'موضع الصفر: «عندما ينطبق محور ملف الدوار مع محور أحد ملفات الثابت (عادة ملف رقم واحد).»'},
 CT:{n:'محول التحكم',en:'The control transformer (CT)',fig:'(٥-٢)',pg:'ص 71–72',sec:'cyl',kind:'coil',zero:90,
   txt:'«تركيبه يشبه تركيب مرسل التحكم … الدوار مختلف في الشكل بحيث يأخذ الشكل الأسطواني أو على شكل يشبه الشمسية (umbrella construction)، بحيث تكون الثغرة منتظمة وصغيرة من جميع الجهات للتقليل من تيار المغنطة. يختلف الثابت في أن ملفاته الثلاثية لها معاوقة كبيرة، هذه الاختلافات تتيح إمكانية توصيل مرسل واحد لعدة محولات تحكم.»',
   ztxt:'موضع الصفر: «عند تعامد محور ملف الدوار مع محور الملف رقم واحد للثابت.»'},
 CD:{n:'المتحكم الفرقي',en:'The control differential (CD)',fig:'(٥-٣)',pg:'ص 72',sec:'cd',kind:'star',zero:null,
   txt:'«كل من عضوه الثابت والدوار على شكل أسطواني، وكل منهما يحمل ملفات ثلاثية، موزعة داخل مجاري وموصلة على شكل نجمة. فهو يشبه محول ثلاثي الأوجه ملفاته الثانوية قابلة للدوران.»',
   ztxt:'الكتاب لا يعرّف موضع صفر للمتحكم الفرقي.'},
 CR:{n:'مستقبل التحكم',en:'The control receiver (CR)',fig:'—',pg:'ص 73',sec:'salient',kind:'coil',zero:0,
   txt:'«يشبه تماما مرسل التحكم فيتكون من عضو ثابت عليه ملفات ثلاثية، وعضو دوار ذو أقطاب بارزة ويحمل ملفاً أحادي الوجه. إلا أن المستقبل مزود <b>بعنصر كبح</b> على محوره.»',
   ztxt:'لا يوجد شكل للمستقبل في الكتاب؛ رسمناه مثل المرسل.'}
};
B.lesson({
 id:'u5-l1',unit:5,order:1,pages:'69–73',
 title:'عناصر أجهزة التزامن الذاتية: CX و CT و CD و CR',
 summary:'الأنواع الأربعة لأجهزة التزامن الذاتية: تركيب كل منها، وموضع الصفر للمرسل والمحول، والفرق بين الدوار البارز والأسطواني والشمسية.',
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة',ref:'ص 69',html:`<p><b>الهدف العام:</b> «معرفة عناصر واستخدامات الآلات ذاتية التزامن.»</p><ol><li>أن يحدد المتدرب عناصر الآلات ذاتية التزامن: مرسل التحكم ومحول التحكم ومستقبل التحكم والمتحكم الفرقي.</li><li>أن يتمكن المتدرب من عمل بعض التطبيقات على استخدام عناصر الآلات ذاتية التزامن في أجهزة نقل البيانات وأجهزة نقل العزم.</li></ol>`},
  {h:'٥-١ الآلات ذاتية التزامن',ref:'ص 70',html:`<p>«هذا النوع من الآلات يأتي تحت أسماء كثيرة مختلفة ولأغراض مختلفة وذات قدرات متفاوتة. وهذه القدرات تتراوح من قدرات صغيرة جدا وهذه الآلات تستخدم في دوائر التحكم، وقدرات كبيرة قد تصل إلى عشرات من حصان القدرة.»</p>
   <p>«الآلات ذاتية التزامن عبارة عن أجهزة تيار متردد كهرومغناطيسية لها تطبيقات واسعة في نظم التحكم الآلي ذات التغذية العكسية، فيمكن استخدامها <b>كجهاز لنقل بيانات موضع محور ميكانيكي</b> أو <b>كجهاز لنقل العزم</b>.»</p>`},
  {h:'٥-٢ تركيب الآلات ذاتية التزامن',ref:'ص 70',html:`<p>«هناك أربعة أنواع أساسية لأجهزة التزامن الذاتية:»</p><ol><li>مرسل التحكم — <span class="ltr">The control transmitter (CX)</span></li><li>محول التحكم — <span class="ltr">The control transformer (CT)</span></li><li>المتحكم الفرقي — <span class="ltr">The control differential (CD)</span></li><li>مستقبل التحكم — <span class="ltr">The control receiver (CR)</span></li></ol>`},
  {err:'ترقيم هذه القائمة مكسور في الكتاب ص 70: الرقم ٤ ملتصق بسطر المتحكم الفرقي، وسطر مستقبل التحكم بلا رقم. رقّمناها هنا ١–٤.'},
  {h:'٥-٢-١ مرسل التحكم (CX)',ref:'ص 70–71',html:`<p>${ELEM.CX.txt}</p><p><b>${ELEM.CX.ztxt}</b></p><p>«عند تغذية الدوار بالتيار المتردد عبر زوج من حلقات الانزلاق ينشأ مجال مغناطيسي متردد ويتولد جهد تحويل في كل ملف من ملفات الثابت، تعتمد قيمة الجهد المتولد على مقدار الزاوية بين محور الملف المعني ومحور ملف الدوار، تقاس الزاوية من موضع الصفر.»</p>`},
  {fig:'(٥-١)',ref:'ص 71',caption:'تركيب وكيفية تمثيل مرسل التحكم: يساراً المقطع (ثابت بملفات ثلاثية متزنة، ودوار بقطبين بارزين يتغذى من AC عبر حلقات الانزلاق)، ويميناً الرمز Control Transmitter',draw:()=>`<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;direction:ltr"><div style="width:220px">${sectionSVG('salient',0)}</div><div style="width:260px"><svg viewBox="0 0 260 250">${synSym(130,120,{lab:'CX',rot:0,kind:'coil',leads:'left'})}</svg></div></div>`},
  {err:'النص يقول إن ملفات ثابت المرسل «مركزة»، بينما الشكل (٥-١) مكتوب عليه <span class="ltr">Balanced three-phase distributed winding</span> أي «موزعة».'},
  {h:'٥-٢-٢ محول التحكم (CT)',ref:'ص 71–72',html:`<p>${ELEM.CT.txt}</p><p><b>${ELEM.CT.ztxt}</b></p>`},
  {fig:'(٥-٢أ)',ref:'ص 71–72',caption:'تركيب محول التحكم: دوار أسطواني بملف أحادي الوجه موزع (يسار)، ودوار على شكل الشمسية Umbrella بملف مركز (يمين)',draw:()=>`<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;direction:ltr"><div style="width:220px">${sectionSVG('cyl',90)}</div><div style="width:220px">${sectionSVG('umbrella',90)}</div></div>`},
  {fig:'(٥-٢ب)',ref:'ص 72',caption:'كيفية تمثيل محول التحكم: ملف الدوار أفقي، أي متعامد مع S1 (موضع الصفر)',draw:()=>box(`<svg viewBox="0 0 260 250">${synSym(130,120,{lab:'CT',rot:90,kind:'coil',leads:'right'})}</svg>`,280)},
  {h:'٥-٢-٣ المتحكم الفرقي (CD)',ref:'ص 72',html:`<p>${ELEM.CD.txt}</p>`},
  {fig:'(٥-٣)',ref:'ص 72',caption:'تركيب وكيفية تمثيل المتحكم الفرقي: ثابت ودوار أسطوانيان كلاهما بملفات ثلاثية موزعة (S1 S2 S3 و R1 R2 R3)',draw:()=>`<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;direction:ltr"><div style="width:260px"><svg viewBox="0 0 260 250">${synSym(130,120,{lab:'CD',rot:0,kind:'star',labDx:0})}</svg></div><div style="width:220px">${sectionSVG('cd',0)}</div></div>`},
  {h:'٥-٢-٤ مستقبل التحكم (CR)',ref:'ص 73',html:`<p>${ELEM.CR.txt}</p>`},
  {h:'مقارنة سريعة',html:`<table class="tt"><tr><th>العنصر</th><th>الثابت</th><th>الدوار</th><th>موضع الصفر</th></tr>
   <tr><td>CX مرسل</td><td>3 ملفات نجمة بزاوية 120°</td><td>قطبان بارزان، ملف أحادي الوجه كثير اللفات</td><td>الدوار <b>منطبق</b> على S1</td></tr>
   <tr><td>CT محول</td><td>3 ملفات ذات <b>معاوقة كبيرة</b></td><td>أسطواني أو شمسية، ثغرة منتظمة صغيرة</td><td>الدوار <b>متعامد</b> على S1</td></tr>
   <tr><td>CD متحكم فرقي</td><td>أسطواني، 3 ملفات نجمة</td><td>أسطواني، 3 ملفات نجمة</td><td>لا يذكره الكتاب</td></tr>
   <tr><td>CR مستقبل</td><td>مثل المرسل</td><td>مثل المرسل + <b>عنصر كبح</b> على المحور</td><td>—</td></tr></table>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يقول إن جهد كل ملف من ملفات الثابت يعتمد على الزاوية بينه وبين ملف الدوار، ولا يعطي معادلة. في المختبر نعرض الجهود بالعلاقة المعروفة <span class="ltr">E·cos(θ − زاوية الملف)</span>، حيث محاور S1 و S2 و S3 بينها 120°. وكذلك ربط المرسل بالمستقبل وعمل المتحكم الفرقي (طرح أو جمع زاويتين) توضيح من خارج الكتاب.'}
 ],
 lab:(el,B)=>{
  let mode='gal',elk='CX',th={CX:30,CT:0,CD:0,CR:0},thx=40,thr=0,wr=0,brake=1,thd=30,diff='sub',thr2=0,wr2=0;
  el.innerHTML=`<div class="grid"><div class="panel c12"><h2>مختبر أجهزة التزامن الذاتية <small>مبني على الأشكال (٥-١) و(٥-٢) و(٥-٣) ص 71–72</small></h2>
    ${segHTML('m',[['gal','معرض العناصر الأربعة'],['tx','المرسل يحرك المستقبل'],['cd','المتحكم الفرقي']],mode)}</div><div class="c12" id="body" style="min-width:0"></div></div>`;
  const $=s=>el.querySelector(s);let frame=null;
  const show=()=>{segSet(el,'m',mode);frame=null;const b=$('#body');
   if(mode==='gal'){b.innerHTML=`<div class="grid"><div class="panel c7"><h2 id="gT"></h2><div style="margin:6px 0">${segHTML('e',Object.keys(ELEM).map(k=>[k,k+' — '+ELEM[k].n]),elk)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;direction:ltr"><div style="width:210px" id="gSec"></div><div style="width:250px;cursor:grab" id="gSym"></div></div>
      ${slHTML('gA','زاوية الدوار (من محور S1) =',-180,180,1,0,'°')}<p class="sub">اسحب الدوار في الرمز، أو استخدم المنزلق.</p></div>
     <div class="panel c5"><h2>ماذا يقول الكتاب؟</h2><p id="gTx"></p><div class="lamps" style="justify-content:flex-start;margin-top:8px"><div class="lamp" id="gL"><i></i><b>0°</b><span>موضع الصفر</span></div></div><p class="sub" id="gZ"></p><div id="gV"></div></div>
     <div class="panel c12">${tryList(['في CX أدر الدوار حتى ينطبق على S1: يضيء مصباح موضع الصفر.','انتقل إلى CT: موضع الصفر هنا عندما يكون الدوار <b>متعامداً</b> على S1 (90°).','قارن شكل الدوار: بارز في CX و CR، أسطواني أو شمسية في CT (ثغرة منتظمة صغيرة لتقليل تيار المغنطة).','في CD لاحظ أن الدوار يحمل ثلاثة ملفات R1 R2 R3 مثل الثابت.'])}</div></div>`;
     const upd=()=>{const E=ELEM[elk],a=th[elk];segSet(el,'e',elk);$('#gT').innerHTML=`${E.n} <small>${E.en} — ${E.fig!=='—'?'الشكل '+E.fig+' ':''}${E.pg}</small>`;
       $('#gA').value=a;$('#gA-v').textContent=a;
       $('#gSec').innerHTML=sectionSVG(elk==='CT'?'umbrella':E.sec,a);
       $('#gSym').innerHTML=`<svg viewBox="0 0 260 250">${synSym(130,120,{lab:elk,rot:a,kind:E.kind,leads:elk==='CT'?'right':E.kind==='coil'?'left':null,volts:elk==='CX'||elk==='CR'?coilV(a):null,rotLive:elk!=='CD'})}${elk==='CR'?`<rect x="196" y="196" width="50" height="34" rx="4" fill="var(--surface-2)" stroke="var(--fg)"/>`+arT(221,217,'كبح',{fs:11}):''}</svg>`;
       $('#gTx').innerHTML=E.txt;const z=E.zero==null?null:Math.abs(wrap(a-E.zero))<=2||(elk==='CT'&&Math.abs(wrap(a+90))<=2);
       $('#gL').classList.toggle('on',!!z);$('#gL').style.display=E.zero==null?'none':'';$('#gZ').innerHTML=E.ztxt+(z?' <b>← الدوار الآن في موضع الصفر.</b>':'');
       if(elk==='CX'||elk==='CR'){const v=coilV(a);$('#gV').innerHTML=`<div class="facts">${facts(['S1','S2','S3'].map((k,i)=>[`جهد الملف ${k} (نسبي)`,(v[i]>=0?'+':'−')+Math.abs(v[i]).toFixed(2)]))}</div><p class="sub"><b>إضافة خارج الكتاب:</b> الجهود بالعلاقة <span class="ltr">cos(θ − زاوية الملف)</span> عند تغذية الدوار بالتيار المتردد؛ الإشارة السالبة تعني أن الجهد معاكس في الطور. الكتاب يقول فقط إن كل جهد «يعتمد على الزاوية بين محور الملف المعني ومحور ملف الدوار».</p>`}
       else $('#gV').innerHTML=elk==='CT'?'<p class="sub">ملفات ثابت المحول ذات معاوقة كبيرة؛ لذلك يمكن توصيل مرسل واحد لعدة محولات تحكم (ص 72). عمل المحول تراه في الدرس التالي.</p>':'<p class="sub">الكتاب لا يشرح طريقة استخدام المتحكم الفرقي. شاهد التوضيح في «المتحكم الفرقي» أعلى المختبر.</p>'};
     el.querySelectorAll('[data-e]').forEach(x=>x.addEventListener('click',()=>{elk=x.dataset.e;upd()}));
     $('#gA').addEventListener('input',e=>{th[elk]=+e.target.value;upd()});
     dragKnobs($('#gSym'),260,250,()=>[{cx:130,cy:120,r:95,set:v=>{th[elk]=Math.round(wrap(v));upd()}}]);upd();}
   else if(mode==='tx'){b.innerHTML=`<div class="grid"><div class="panel c8"><h2>المرسل CX يدير المستقبل CR <small>توصيل الأطراف S1–S1 و S2–S2 و S3–S3 كالشكل (٥-٤)</small></h2>
      <div class="svgbox" id="tP" style="max-width:600px;margin-inline:auto;cursor:grab"></div>${slHTML('tA','زاوية محور المرسل θx =',-180,180,1,thx,'°')}<p class="sub">أدر دوار المرسل (يسار) بالسحب أو بالمنزلق، وراقب دوار المستقبل (يمين).</p></div>
     <div class="panel c4"><h2>القراءات</h2><div class="facts" id="tF"></div><div style="margin-top:10px"><div class="sub">عنصر الكبح على محور المستقبل</div>${segHTML('br',[[1,'موجود'],[0,'منزوع']],brake)}</div>
      <p class="sub" style="margin-top:8px"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يذكر تركيب المستقبل فقط وأنه «مزود بعنصر كبح على محوره». هنا نوضح فكرته: جهود ملفات المرسل تنتقل بالأسلاك إلى ثابت المستقبل فيصنع مجالاً في نفس الاتجاه، فيدور دوار المستقبل حتى ينطبق عليه. عنصر الكبح يمنعه من التأرجح حول الموضع الجديد. أرقام الجهود والحركة توضيحية.</p></div>
     <div class="panel c12">${tryList(['أدر المرسل إلى 60°: يتبعه المستقبل ويقف عند 60°.','لاحظ تغير الجهود S1 و S2 و S3 مع الزاوية، وأيها يصير سالباً (معاكساً في الطور).','انزع عنصر الكبح ثم حرّك المرسل بسرعة: يتأرجح المستقبل حول الموضع قبل أن يستقر.'])}</div></div>`;
     $('#tA').addEventListener('input',e=>{thx=+e.target.value});el.querySelectorAll('[data-br]').forEach(x=>x.addEventListener('click',()=>{brake=+x.dataset.br;segSet(el,'br',brake)}));
     dragKnobs($('#tP'),560,330,()=>[{cx:130,cy:150,r:110,set:v=>{thx=Math.round(wrap(v))}}]);
     frame=dt=>{const err=wrap(thr-thx)*D;const b=brake?11:0.7;wr+=(-40*Math.sin(err)-b*wr)*dt;thr=wrap(thr+wr*dt/D);
       const v=coilV(thx);$('#tP').innerHTML=pairSVG({thx,thy:thr,right:'CR',volts:v,rightRotLive:1});$('#tA').value=thx;$('#tA-v').textContent=thx;
       $('#tF').innerHTML=facts([['زاوية المرسل θx',degTxt(thx)],['زاوية المستقبل',degTxt(thr)],['الفرق',degTxt(wrap(thr-thx))]].concat(['S1','S2','S3'].map((k,i)=>[`جهد ${k} (نسبي)`,(v[i]>=0?'+':'−')+Math.abs(v[i]).toFixed(2)])))}}
   else{b.innerHTML=`<div class="grid"><div class="panel c8"><h2>المتحكم الفرقي بين المرسل والمستقبل <small>توضيح — ليس من الكتاب</small></h2><div class="svgbox" id="dP" style="max-width:640px;margin-inline:auto"></div>
      <div class="wrap-in">${slHTML('dX','زاوية المرسل θx =',-180,180,1,thx,'°')}${slHTML('dD','زاوية دوار المتحكم الفرقي θd =',-180,180,1,thd,'°')}</div>
      <div><div class="sub">طريقة التوصيل</div>${segHTML('dw',[['sub','عادي: الفرق'],['add','بتبديل طرفين: المجموع']],diff)}</div></div>
     <div class="panel c4"><h2>النتيجة</h2><div class="facts" id="dF"></div><p class="sub"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب يصف تركيب المتحكم الفرقي فقط (ثابت ودوار بملفات ثلاثية، «يشبه محول ثلاثي الأوجه ملفاته الثانوية قابلة للدوران»). عملياً يوضع بين المرسل والمستقبل، فيستقبل زاوية المرسل على ثابته ويخرج من دواره زاوية مطروحاً منها (أو مضافاً إليها) زاوية دواره.</p></div>
     <div class="panel c12">${tryList(['اجعل θx = 70° و θd = 30°: يقف المستقبل عند 40°.','بدّل التوصيل إلى «المجموع»: يقف المستقبل عند 100°.','اجعل θd = 0°: المتحكم الفرقي يمرر الزاوية كما هي.'])}</div></div>`;
     const sl=()=>{$('#dX').value=thx;$('#dX-v').textContent=thx;$('#dD').value=thd;$('#dD-v').textContent=thd};
     $('#dX').addEventListener('input',e=>{thx=+e.target.value});$('#dD').addEventListener('input',e=>{thd=+e.target.value});
     el.querySelectorAll('[data-dw]').forEach(x=>x.addEventListener('click',()=>{diff=x.dataset.dw;segSet(el,'dw',diff)}));
     frame=dt=>{const tgt=wrap(diff==='sub'?thx-thd:thx+thd);const err=wrap(thr2-tgt)*D;wr2+=(-40*Math.sin(err)-11*wr2)*dt;thr2=wrap(thr2+wr2*dt/D);sl();
       let s=`<svg viewBox="0 0 640 260" role="img" aria-label="مرسل ثم متحكم فرقي ثم مستقبل">`;
       const bundle=(x1,x2,lab)=>[0,1,2].map(i=>S.w(`M${x1} ${118+i*12}H${x2}`,'live')).join('')+S.t((x1+x2)/2,106,lab,'m');
       s+=bundle(150,250,'S1 S2 S3 → S1 S2 S3')+bundle(390,490,'R1 R2 R3 → S1 S2 S3');
       s+=`<circle cx="100" cy="130" r="50" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+coil(100-u(thx)[0]*40,130-u(thx)[1]*40,100+u(thx)[0]*40,130+u(thx)[1]*40,4,'live')+S.t(100,200,'CX','b');
       s+=`<circle cx="320" cy="130" r="56" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+[0,-120,120].map(d=>{const [a,c]=u(thd+d);return coil(320,130,320+a*44,130+c*44,2,'')}).join('')+`<path d="M${320} 130L${fx(320+u(thd)[0]*44)} ${fx(130+u(thd)[1]*44)}" stroke="var(--stop)" stroke-width="2.4"/>`+S.t(320,206,'CD','b');
       s+=`<circle cx="540" cy="130" r="50" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+coil(540-u(thr2)[0]*40,130-u(thr2)[1]*40,540+u(thr2)[0]*40,130+u(thr2)[1]*40,4,'live')+S.t(540,200,'CR','b');
       s+=arT(100,236,'θx = '+degTxt(thx),{fs:12})+arT(320,236,'θd = '+degTxt(thd),{fs:12})+arT(540,236,(diff==='sub'?'θx − θd':'θx + θd')+' = '+degTxt(tgt),{fs:12});
       $('#dP').innerHTML=s+'</svg>';
       $('#dF').innerHTML=facts([['المطلوب',diff==='sub'?'θx − θd':'θx + θd'],['= ',degTxt(tgt)],['زاوية المستقبل الآن',degTxt(thr2)]])}}
  };
  el.querySelectorAll('[data-m]').forEach(x=>x.addEventListener('click',()=>{mode=x.dataset.m;show()}));
  show();loopOn(el,dt=>{if(frame)frame(dt)});
 },
 quiz:[
  {q:'كم نوعاً أساسياً لأجهزة التزامن الذاتية في الكتاب؟',o:['نوعان','ثلاثة','أربعة','خمسة'],c:2,e:'CX و CT و CD و CR (ص 70).'},
  {q:'كيف توصل ملفات ثابت مرسل التحكم؟',o:['دلتا بزاوية 90°','نجمة بزاوية 120° كهربائية بين محاورها','على التوالي','ملف واحد'],c:1,e:'ثلاثة ملفات متماثلة موصلة على شكل نجمة والزاوية بين محاورها 120° كهربائية (ص 70).'},
  {q:'ما شكل دوار مرسل التحكم؟',o:['أسطواني','شمسية','قطبان بارزان عليهما ملف أحادي الوجه','قفص سنجابي'],c:2,e:'«الدوار له قطبان بارزان وملفوف على جزءه ملف أحادي الوجه ذو عدد كبير من اللفات».'},
  {q:'موضع الصفر لمرسل التحكم هو عندما يكون محور ملف الدوار:',o:['منطبقاً على محور S1','متعامداً على محور S1','بزاوية 45° مع S1','بزاوية 120° مع S1'],c:0,e:'«عندما ينطبق محور ملف الدوار مع محور أحد ملفات الثابت (عادة ملف رقم واحد)».'},
  {q:'موضع الصفر لمحول التحكم هو عندما يكون محور ملف الدوار:',o:['منطبقاً على S1','متعامداً على S1','بزاوية 60° مع S1','في أي وضع'],c:1,e:'«عند تعامد محور ملف الدوار مع محور الملف رقم واحد للثابت» (ص 72).'},
  {q:'لماذا يصنع دوار محول التحكم أسطوانياً أو على شكل الشمسية؟',o:['لزيادة العزم','لتكون الثغرة منتظمة وصغيرة فيقل تيار المغنطة','لزيادة الوزن','لتقليل عدد اللفات'],c:1,e:'ص 71–72.'},
  {q:'ما الذي يتيح توصيل مرسل واحد لعدة محولات تحكم؟',o:['المعاوقة الكبيرة لملفات ثابت المحول وشكل دواره','عنصر الكبح','الأقطاب البارزة','حلقات الانزلاق'],c:0,e:'«ملفاته الثلاثية لها معاوقة كبيرة، هذه الاختلافات تتيح إمكانية توصيل مرسل واحد لعدة محولات تحكم».'},
  {q:'بماذا يختلف مستقبل التحكم عن مرسل التحكم؟',o:['دواره أسطواني','مزود بعنصر كبح على محوره','ثابته بملف واحد','لا يحتاج تياراً متردداً'],c:1,e:'«يشبه تماما مرسل التحكم … إلا أن المستقبل مزود بعنصر كبح على محوره» (ص 73).'}
 ]
});

/* =================== Lesson 5.2 — data transmission =================== */
function servoSVG(thx,tht,e,G){// الشكل (٥-٥) simplified block diagram, live
  let s=`<svg viewBox="0 0 640 300" role="img" aria-label="تركيبة تحكم آلي لأجهزة نقل المعلومات">`;
  s+=S.w('M20 26H620','live')+S.t(30,18,'AC supply','m','start');
  // CX with input shaft
  s+=`<circle cx="110" cy="150" r="38" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+coil(110-u(thx)[0]*30,150-u(thx)[1]*30,110+u(thx)[0]*30,150+u(thx)[1]*30,4,'live')+S.t(110,206,'CX','b');
  s+=S.w('M110 26V60','live')+S.w('M110 60H96V112','live')+S.w('M110 60H124V112','live');
  s+=dial(110,252,22,thx,'')+`<path d="M110 188V230" stroke="var(--muted)" stroke-dasharray="5 4" stroke-width="2"/>`+arT(160,268,'محور الدخل',{fs:11.5});
  // three wires
  const live=Math.abs(e)>0.02;[0,1,2].map(i=>{s+=S.w(`M148 ${140+i*10}H232`,'live')});s+=S.t(190,130,'S1 S2 S3','m');
  // CT
  s+=`<circle cx="270" cy="150" r="38" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+coil(270-u(tht+90)[0]*30,150-u(tht+90)[1]*30,270+u(tht+90)[0]*30,150+u(tht+90)[1]*30,4,live?'live':'')+S.t(270,206,'CT','b');
  // CT rotor -> amplifier
  s+=S.w('M308 146H350',live?'live':'')+`<path d="M350 120V176L404 148Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(372,152,'A','')+arT(378,112,'المكبر',{fs:11.5})+S.w('M377 26V134','live');
  s+=S.t(330,138,'e','b');
  // two-phase control motor
  s+=S.w('M404 148H452',live?'live':'')+`<circle cx="490" cy="150" r="34" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+coil(458,150,474,150,2,live?'live':'')+coil(490,92,490,118,2,'live')+S.w('M490 26V92','live')+S.t(490,154,'M','')+arT(490,204,'محرك تحكم ثنائي الوجه',{fs:11.5});
  // mechanical links: motor -> output shaft and -> CT rotor
  s+=`<path d="M524 150H570M490 184V236H270V190" stroke="var(--muted)" stroke-dasharray="6 4" stroke-width="2" fill="none"/>`+dial(596,150,22,tht,'')+arT(596,192,'محور الخرج',{fs:11.5});
  return s+'</svg>'}
B.lesson({
 id:'u5-l2',unit:5,order:2,pages:'73–75',
 title:'نقل المعلومات: كاشف الخطأ والتحكم في الموضع',
 summary:'مرسل التحكم ومحول التحكم معاً يحولان زاوية محور إلى جهد e = E sinα على دوار المحول، وبإضافة مكبر ومحرك تحكم يتبع محور الخرج محور الدخل.',
 theory:[
  {h:'٥-٣ تطبيقات على استخدام أجهزة التزامن الذاتية',ref:'ص 73'},
  {h:'٥-٣-١ أجهزة نقل المعلومات أو البيانات: Data Transmitting Elements',ref:'ص 73',html:`<p>«استخدام أجهزة التزامن الذاتية في نظم التحكم الآلي العكسية يعتبر من أهم تطبيقات هذه الأجهزة، الشكل (٥-٤) يبين جزءاً من أحد هذه المنظومات، هذا الجزء من المنظومة يسمى <b>بكاشف الخطأ (error detector)</b>، مهمته الرئيسة هي تحويل توجيه ميكانيكي في شكل زاوية انحراف ميكانيكية لمحور المرسل، إلى إشارة كهربائية تظهر بشكل جهد على أطراف ملف الدوار لمحول التحكم (CT)، فيوفر فائدة عظيمة، ألا وهي الإدلاء بمعلومات عن إزاحة محور بواسطة أسلاك مما يسمح بوضع محول التحكم (CT) بعيدا عن مرسل التحكم (CX).»</p>`},
  {fig:'(٥-٤)',ref:'ص 73',caption:'نظام تزامني لتحويل زاوية ميكانيكية إلى جهد كهربائي على ملف دوار المحول — الوضع الصفري: دوار CX منطبق على S1 ودوار CT متعامد عليه، والأطراف موصلة S1–S1 و S2–S2 و S3–S3',draw:()=>box(pairSVG({thx:0,thy:90,right:'CT',e:0}),600)},
  {h:'كيف تعمل التركيبة؟',ref:'ص 74',html:`<p>«لشرح كيفية عمل التركيبة المبينة في الشكل (٥-٤)، تتم تغذية ملف دوار المرسل بتيار متردد، فتتولد جهود بالتحويل في ملفات الثابت الثلاثية للمرسل، كل جهد يعتمد على الزاوية بين محور الدوار ومحور الملف المعني، تنتقل الجهود المتولدة عبر الأسلاك إلى الملفات الثلاثية لثابت المحول، وبإهمال الجهد المفقود في النقل، تتساوى الجهود في كل من الملفات الثلاثية للمرسل والمحول في القيمة والزاوية، وتكون ضد بعضها في الدائرة الكهربائية المشتركة، فينتج كل عضو ثابت مجالاً مغناطيسياً مشابهاً للآخر.»</p>
   <p>«تعمل المجموعة كما لو كانت ملفات الدوارين مشتركة في نفس الدائرة المغناطيسية، وكل من الملفين له الحرية بأن يأخذ أي وضع اختياري في الفراغ. فالتركيبة إذا تكافئ محاثة متبادلة قابلة للضبط بين ملفي الدوارين، مع إمكانية تواجد كل من الملفين بعيدا عن الآخر.»</p>
   <p>«عندما تكون الزاوية بين محور الملفين <b>تسعين درجة</b> ويكون كل من الملفين في وضع الصفر حسب التعريف السابق، <b>لا يتولد أي جهد</b> على ملف دوار المحول، وهو يمثل <b>وضع الاتزان</b> بين الملفين، وضع الاتزان يحدث أيضا عندما تكون الزاوية بين الملفين تسعين أو مئتين وسبعين درجة بصرف النظر عن تواجد الدوارين في موضع الصفر، عندما تكتسب الزاوية بين الملفين أي قيمة غير تسعين أو مئتين وسبعين درجة يتولد جهد في ملف المحول تعتمد قيمته على فرق الزاوية من وضع الاتزان»:</p>
   $$e = E_r \\sin\\alpha$$<p>حيث \\(E_r\\) أقصى جهد يمكن أن يتولد على ملف دوار المحول، و\\(\\alpha\\) فرق الزاوية عن وضع الاتزان.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> إذا قسنا زاوية كل دوار من موضع صفره (θx للمرسل و θt للمحول) فإن \\(\\alpha = \\theta_x - \\theta_t\\). عند α = 0° أو 180° تكون الزاوية الفعلية بين الملفين 90° أو 270° فيكون e = 0. إشارة e (موجب أو سالب، أي في الطور أو عكسه) تخبرنا في أي اتجاه انحرف المحور.'},
  {h:'تطبيق: التحكم في موضع محور الخرج',ref:'ص 74–75',html:`<p>«الشكل (٥-٥) يوضح إحدى تطبيقات التركيبة الموضحة في الشكل (٥-٤)، للتحكم في موضع محور خرج (output shaft)، طبقا لمحور دخل (input shaft)، محور الدخل متصل ميكانيكيا مع دوار المرسل، بينما ملف دوار محول التحكم متصل كهربائيا مع ملف التحكم لمحرك تحكم حثي ثنائي الوجه (سبق شرحه في الوحدة الثالثة) عبر مكبر للقدرة. محور محرك التحكم متصل ميكانيكيا بمحور الخرج لإدارة الحمل وفي نفس الوقت متصل ميكانيكيا بدوار المحول. القدرة الميكانيكية اللازمة لإدارة محور الخرج والحمل الميكانيكي المرتبط به يوفرها محرك التحكم الثنائي الوجه.»</p>
   <p>«عندما يكون دوارا كل من المرسل والمحول متعامدين، أي في وضع الاتزان، فإن الجهد الداخل لمكبر القدرة يكون صفرا، فيظل محرك التحكم ساكنا، عندما يدور محور الدخل ومعه محور دوار المرسل بزاوية α في الاتجاه الموجب مبتعدا عن موضع الاتزان، يتولد جهد على ملف دوار المحول قيمته \\((E \\sin\\alpha)\\) حيث (E) هي أقصى قيمة للجهد المتولد على ملف دوار المحول.»</p>
   <p>«الجهد المتولد يتسبب في دوران محرك التحكم ومحور الخرج، وفي نفس الوقت يعيد دوار المحول لوضع الاتزان من جديد مع دوار المرسل فيتوقف المحرك عن الدوران.»</p>`},
  {fig:'(٥-٥)',ref:'ص 75',caption:'تركيبة تحكم آلي لأجهزة نقل المعلومات: CX على محور الدخل، CT يغذي المكبر، والمكبر يغذي ملف التحكم لمحرك ثنائي الوجه يدير محور الخرج ودوار CT (الخط المتقطع = ربط ميكانيكي)',draw:()=>box(servoSVG(0,0,0),660)}
 ],
 lab:(el,B)=>{
  let mode='det',thx=0,tht=0,Er=100,G=1,v=0,hist=[],t=0;
  el.innerHTML=`<div class="grid"><div class="panel c12"><h2>كاشف الخطأ وسيرفو الموضع <small>مبني على الشكلين (٥-٤) و(٥-٥) ص 73–75</small></h2>
    ${segHTML('m',[['det','كاشف الخطأ — الشكل (٥-٤)'],['servo','التحكم في الموضع — الشكل (٥-٥)']],mode)}</div>
   <div class="panel c8"><h2 id="hT"></h2><div class="svgbox" id="P" style="max-width:640px;margin-inline:auto;cursor:grab"></div>
    <div class="wrap-in">${slHTML('sX','محور الدخل (دوار المرسل) θx =',-180,180,1,thx,'°')}<span id="tBox" style="display:contents">${slHTML('sT','دوار المحول θt =',-180,180,1,tht,'°')}</span>${slHTML('sE','أقصى جهد Er =',10,200,1,Er,'V')}<span id="gBox" style="display:contents">${slHTML('sG','كسب المكبر =',0.2,3,0.1,G,'')}</span></div>
    <p class="sub" id="hint"></p></div>
   <div class="panel c4"><h2>جهد دوار المحول</h2><div class="facts" id="F"></div><div class="lamps" style="justify-content:flex-start;margin-top:10px"><div class="lamp" id="L"><i></i><b>e = 0</b><span>وضع الاتزان</span></div></div>
    <div class="svgbox" id="C"></div><p class="sub">المنحنى \\(e = E_r\\sin\\alpha\\) من الكتاب؛ النقطة = الوضع الحالي.</p></div>
   <div class="panel c12" id="tr"></div></div>`;
  const $=s=>el.querySelector(s);
  const setMode=m=>{mode=m;segSet(el,'m',m);$('#tBox').style.display=m==='det'?'contents':'none';$('#gBox').style.display=m==='servo'?'contents':'none';hist=[];
    $('#hT').innerHTML=m==='det'?'مرسل التحكم CX ومحول التحكم CT <small>اسحب أي دوار</small>':'نظام التحكم في الموضع <small>اسحب محور الدخل (المؤشر يسار أسفل) أو دوار CX</small>';
    $('#hint').innerHTML=m==='det'?'دوار CX يسار ودوار CT يمين. الزاويتان مقيستان من موضع صفر كل جهاز: CX منطبق على S1، و CT متعامد على S1.':'المحرك يدير محور الخرج ودوار CT معاً حتى يصير e = 0. السرعة والكسب أرقام توضيحية.';
    $('#tr').innerHTML=m==='det'?tryList(['ابدأ والدواران في موضع الصفر: e = 0 (وضع الاتزان).','أدر المرسل وحده 60° ضد عقارب الساعة: <span class="ltr">e = 100 sin 60° = 86.6 V</span> (هذا س٥-١١).','أدر المحول بنفس الزاوية: يعود e إلى الصفر لأن α = θx − θt = 0.','اجعل α = 180°: e = 0 أيضاً (الزاوية بين الملفين 270°)، لكن لاحظ أن الإشارة تنقلب حولها.']):tryList(['أدر محور الدخل إلى 90°: يظهر جهد e فيدور المحرك ومحور الخرج حتى يتبع محور الدخل ويعود e إلى الصفر.','زد كسب المكبر: يتبع محور الخرج أسرع.','لاحظ مخطط e مع الزمن: يبدأ كبيراً ثم ينزل إلى الصفر.'])};
  el.querySelectorAll('[data-m]').forEach(x=>x.addEventListener('click',()=>setMode(x.dataset.m)));
  [['sX',x=>thx=x],['sT',x=>tht=x],['sE',x=>Er=x],['sG',x=>G=x]].forEach(([id,f])=>$('#'+id).addEventListener('input',e=>f(+e.target.value)));
  dragKnobs($('#P'),mode==='det'?560:640,330,()=>mode==='det'?[{cx:130,cy:150,r:110,set:a=>{thx=Math.round(wrap(a))}},{cx:430,cy:150,r:110,set:a=>{tht=Math.round(wrap(a-90))}}]:[{cx:110,cy:150,r:60,set:a=>{thx=Math.round(wrap(a))}},{cx:110,cy:252,r:40,set:a=>{thx=Math.round(wrap(a))}}]);
  setMode(mode);
  loopOn(el,dt=>{t+=dt;const al=wrap(thx-tht),e=Er*Math.sin(al*D);
   if(mode==='servo'){v+=(G*180*Math.sin(al*D)-v)*dt/0.3;tht=wrap(tht+v*dt);hist.push([t,e]);while(hist.length&&t-hist[0][0]>10)hist.shift()}else v=0;
   $('#sX').value=thx;$('#sX-v').textContent=thx;$('#sT').value=Math.round(tht);$('#sT-v').textContent=Math.round(tht);$('#sE-v').textContent=Er;$('#sG-v').textContent=G.toFixed(1);
   $('#P').innerHTML=mode==='det'?pairSVG({thx,thy:tht+90,right:'CT',volts:coilV(thx),e,rightRotLive:Math.abs(e)>0.5}):servoSVG(thx,tht,e/Er,G);
   $('#F').innerHTML=facts([['α = θx − θt',degTxt(al)],['e = Er sin α',(e<=-0.05?'−':'')+Math.abs(e).toFixed(1)+' V'],['الطور',Math.abs(e)<0.5?'—':e>0?'في طور المصدر':'عكس طور المصدر']].concat(mode==='servo'?[['سرعة المحرك',Math.abs(v)<0.5?'متوقف':(v>0?'↺ ':'↻ ')+Math.abs(v).toFixed(0)+' °/s']]:[]));
   $('#L').classList.toggle('on',Math.abs(e)<0.5);
   $('#C').innerHTML=mode==='det'||hist.length<2?plotSVG({w:360,h:220,x0:-180,x1:180,y0:-1.1*Er,y1:1.1*Er,xt:[-180,-90,0,90,180],yt:[-Er,0,Er],yf:v=>v.toFixed(0),xl:'α (°)',aria:'e مع α',series:[{pts:Array.from({length:73},(_,i)=>[i*5-180,Er*Math.sin((i*5-180)*D)]),col:'--blue'}],extra:(X,Y)=>`<circle cx="${fx(X(al))}" cy="${fx(Y(e))}" r="6" fill="var(--live)"/>`})
     :plotSVG({w:360,h:220,x0:t-10,x1:t,y0:-1.1*Er,y1:1.1*Er,xt:[],yt:[-Er,0,Er],yf:v=>v.toFixed(0),xl:'t — آخر 10 ثوانٍ',aria:'e مع الزمن',series:[{pts:hist,col:'--live'}]});
  });
 },
 quiz:[
  {q:'ماذا يسمى الجزء من المنظومة المكوّن من CX و CT في الشكل (٥-٤)؟',o:['المكبر','كاشف الخطأ (error detector)','المتحكم الفرقي','المستقبل'],c:1,e:'ص 73.'},
  {q:'وظيفة كاشف الخطأ هي تحويل:',o:['جهد إلى عزم','زاوية انحراف ميكانيكية لمحور المرسل إلى جهد على دوار المحول','تيار مستمر إلى متردد','سرعة إلى تردد'],c:1,e:'«تحويل توجيه ميكانيكي في شكل زاوية انحراف … إلى إشارة كهربائية تظهر بشكل جهد على أطراف ملف الدوار لمحول التحكم».'},
  {q:'كيف توصل أطراف ثابت المرسل بأطراف ثابت المحول في الشكل (٥-٤)؟',o:['S1–S2، S2–S3، S3–S1','S1–S1، S2–S2، S3–S3','S1–S3 فقط','لا توصل'],c:1,e:'كل طرف بنظيره.'},
  {q:'متى يكون الجهد على دوار المحول صفراً؟',o:['عندما تكون الزاوية بين محوري الملفين 90° أو 270°','عندما تكون الزاوية صفراً فقط','عند 45°','دائماً'],c:0,e:'وضع الاتزان (ص 74).'},
  {q:'دوار المرسل أدير 30° عن وضع الاتزان، وأقصى جهد 100 V. كم e؟',o:['30 V','50 V','86.6 V','100 V'],c:1,e:'e = 100 sin 30° = 50 V.'},
  {q:'في الشكل (٥-٥) ما الذي يغذيه جهد دوار المحول؟',o:['ملف دوار المرسل مباشرة','ملف التحكم لمحرك ثنائي الوجه عبر مكبر القدرة','المصدر','ثابت المرسل'],c:1,e:'«متصل كهربائيا مع ملف التحكم لمحرك تحكم حثي ثنائي الوجه … عبر مكبر للقدرة».'},
  {q:'لماذا يتوقف محرك التحكم في الشكل (٥-٥) بعد أن يدور؟',o:['لأن المكبر يحترق','لأنه يعيد دوار المحول إلى وضع الاتزان فيصير الجهد صفراً','لأن المصدر ينفصل','لأن المرسل يتوقف'],c:1,e:'«يعيد دوار المحول لوضع الاتزان من جديد مع دوار المرسل فيتوقف المحرك».'},
  {q:'ما الفائدة الكبرى من نقل الزاوية بالأسلاك؟',o:['زيادة العزم','إمكانية وضع محول التحكم بعيداً عن مرسل التحكم','تقليل الجهد','الاستغناء عن التيار المتردد'],c:1,e:'ص 73.'}
 ]
});

/* =================== Lesson 5.3 — torque transmission =================== */
function powers(T,n,poles,f){const P=poles/2,ns=60*f/P,s=(ns-n)/ns,Tk=T*9.81/1000,wr=2*Math.PI*n/60,ws=2*Math.PI*ns/60;
  return {ns,s,Tk,wr,ws,PmI:Tk*wr,Par:s*Tk*ws,PSI:Tk*ws,Pmo:Tk*wr,PSO:Tk*ws}}
function shaftSVG(o){// o: {ang, p (powers), labels:bool}
  const p=o.p,mx=Math.max(p.PSI,1),wd=v=>+(2+12*Math.max(0,v)/mx).toFixed(1);
  let s=`<svg viewBox="0 0 640 330" role="img" aria-label="جهاز تزامن لنقل عزم الدوران">`;
  [30,42,54].forEach((y,i)=>{s+=S.w(`M30 ${y}H610`,'live')+S.t(22,y+4,'L'+(i+1),'m','end')});
  const mach=(cx,lab)=>{let g=`<rect x="${cx-70}" y="110" width="140" height="120" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
    [-20,0,20].forEach((d,i)=>{g+=S.w(`M${cx+d} ${[30,42,54][i]}V110`,'live')+S.dot(cx+d,[30,42,54][i])});
    [0,-120,120].forEach(d=>{const [a,b]=u(d+o.ang);g+=coil(cx,170,cx+a*36,170+b*36,2,'live')});
    g+=`<circle cx="${cx}" cy="170" r="3" fill="var(--fg)"/>`+S.t(cx,218,lab,'b',null,14);
    [-16,0,16].forEach(d=>{g+=`<rect x="${cx+d-5}" y="232" width="10" height="16" fill="var(--fg)"/>`});return g};
  s+=mach(180,'I')+mach(460,'II');
  // slip-ring connection between rotors
  [0,1,2].forEach(i=>{s+=S.w(`M${180-16+i*16} 248V${262+i*10}H${460-16+i*16}V248`,'live')});
  // shafts
  s+=`<path d="M40 170H110M530 170H600" stroke="var(--fg)" stroke-width="6" stroke-linecap="round"/>`;
  // power arrows (widths ∝ kW)
  s+=arrow(40,140,104,140,'--blue',wd(p.PmI))+S.t(60,128,'PmI','b')+S.t(60,192,'Td','','middle')+arrow(46,184,80,184,'--fg',1.6);
  s+=arrow(240,104,240,62,'--live',wd(p.PSI))+S.t(250,90,'PSI','','start');
  s+=arrow(400,62,400,104,'--live',wd(p.PSO))+S.t(390,90,'PSO','','end');
  s+=arrow(400,300,240,300,'--on',wd(p.Par))+S.t(320,320,'Par','b');
  s+=arrow(536,140,600,140,'--blue',wd(p.Pmo))+S.t(580,128,'Pmo','b')+S.t(580,192,'Tb','')+arrow(560,184,594,184,'--fg',1.6);
  if(o.labels){const k=v=>v.toFixed(o.dp==null?0:o.dp)+' kW';s+=S.t(72,110,k(p.PmI),'m')+S.t(250,78,k(p.PSI),'m','start')+S.t(390,78,k(p.PSO),'m','end')+S.t(320,292,k(p.Par),'m')+S.t(570,110,k(p.Pmo),'m')}
  s+=`<g transform="rotate(${fx(-o.ang*3)} 40 170)"><circle cx="40" cy="170" r="12" fill="var(--surface)" stroke="var(--fg)"/><path d="M40 170V158" stroke="var(--stop)" stroke-width="3"/></g><g transform="rotate(${fx(-o.ang*3)} 600 170)"><circle cx="600" cy="170" r="12" fill="var(--surface)" stroke="var(--fg)"/><path d="M600 170V158" stroke="var(--stop)" stroke-width="3"/></g>`;
  s+=S.t(110,160,'n','m')+S.t(530,160,'n','m');
  return s+'</svg>'}
function torqSteps(g,B,isBook){const P=g.poles/2,ns=B.round(60*g.f/P,2),s=B.round((ns-g.n)/ns,4),Tk=g.T*9.81/1000;
  const wr=isBook?86.3:B.round(2*Math.PI*g.n/60,2),ws=B.round(2*Math.PI*ns/60,0);
  const PmI=B.round(Tk*wr,0),Par=B.round(s*Tk*ws,0),PSI=B.round(Tk*ws,0),Pmo=B.round((1-s)/s*Par,0),PSO=B.round(Pmo/(1-s),0);const n=v=>B.fmtN(v);
  const ck1=PmI+Par,ck2=Pmo+Par;
  return [
   {t:'السرعة التزامنية (P هنا عدد أزواج الأقطاب):',f:`n_s=\\frac{60f}{P}=\\frac{60\\times${n(g.f)}}{${n(P)}}`,v:ns,unit:'r.p.m'},
   {t:'الانزلاق:',f:`s=\\frac{n_S-n_m}{n_S}=\\frac{${n(ns)}-${n(g.n)}}{${n(ns)}}`,v:s},
   {t:'السرعة الزاوية للدوار:',f:`\\omega_r=\\frac{2\\pi n_r}{60}=\\frac{2\\pi\\times${n(g.n)}}{60}`,v:wr,unit:'rad/sec'},
   {t:'السرعة الزاوية التزامنية:',f:`\\omega_S=\\frac{2\\pi n_S}{60}=\\frac{2\\pi\\times${n(ns)}}{60}`,v:ws,unit:'rad/sec',dp:0},
   {t:'<b>الجهاز الأول (المحرك المدار):</b> القدرة الداخلة على عمود إدارته:',f:`P_{mI}=T\\omega_r=${n(g.T)}\\times\\frac{9.81}{1000}\\times${n(wr)}`,v:PmI,unit:'kW',dp:0,final:true},
   {t:'القدرة المنقولة من دائرة العضو الدائر لمحرك الإدارة (II) إلى دائرة العضو الدائر للمحرك المدار:',f:`P_{ar}=sP_g=s\\,T\\,\\omega_S=${n(s)}\\times${n(g.T)}\\times\\frac{9.81}{1000}\\times${n(ws)}`,v:Par,unit:'kW',dp:0,final:true},
   {t:'القدرة الداخلة في المصدر:',f:`P_{SI}=T\\omega_S=P_{gI}=${n(g.T)}\\times\\frac{9.81}{1000}\\times${n(ws)}`,v:PSI,unit:'kW',dp:0,final:true},
   {t:'Check'+(ck1===PSI?'':' (الفرق بسبب التقريب)'),f:`P_{SI}=P_{mI}+P_{ar}=${n(PmI)}+${n(Par)}=${n(ck1)}`,v:ck1,unit:'kW',dp:0},
   {t:'<b>الجهاز الثاني (محرك الإدارة):</b> القدرة الخارجة على عمود الإدارة:',f:`P_{mo}=\\frac{1-s}{s}P_{ar}=\\frac{1-${n(s)}}{${n(s)}}\\times${n(Par)}`,v:Pmo,unit:'kW',dp:0,final:true},
   {t:'القدرة الداخلة من المصدر لإدارة المحرك:',f:`P_{SO}=\\frac{P_{mo}}{1-s}=\\frac{${n(Pmo)}}{1-${n(s)}}`,v:PSO,unit:'kW',dp:0,final:true},
   {t:'Check'+(ck2===PSO?'':' (الفرق بسبب التقريب)'),f:`P_{SO}=P_{mo}+P_{ar}=${n(Pmo)}+${n(Par)}=${n(ck2)}`,v:ck2,unit:'kW',dp:0}]}
const G51=[{id:'T',label:'العزم المنقول',sym:'T',unit:'kg.m',value:70.75},{id:'n',label:'السرعة',sym:'n',unit:'rpm',value:825},{id:'poles',label:'عدد الأقطاب',sym:'',unit:'قطب',value:4,step:2,min:2},{id:'f',label:'التردد',sym:'f',unit:'Hz',value:50}];
B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'76–79',
 title:'نقل العزم (عمود الإدارة الكهربائي) ومثال (٥-١)',
 summary:'محركان حثيان بحلقات انزلاق، ثابتاهما على مصدر واحد ودواراهما موصلان معاً، ينقلان العزم والسرعة إلى مكان بعيد. نتتبع تدفق القدرة في المثال (٥-١).',
 theory:[
  {h:'٥-٣-٢ أجهزة نقل العزم: Torque Transmitting Elements',ref:'ص 76',html:`<p>«يمكن استخدام الآلات ذاتية التزامن لنقل العزم عن طريق <b>عمود الإدارة الكهربي</b> (توصيلات التزامن الذاتي) ويتكون من <b>محركين تأثيريين من ذوات الحلقات الانزلاقية</b> متصلين معا. ويوصل عضوهما الثابتان علي التوازي معا على نفس المصدر الكهربي كما هو مبين بالشكل (٥-٦).»</p>
   <p>«ويستخدم هذا النظام في نقل عزم دوران ميكانيكي معين \\(T_d\\) عند سرعة معينة n من مكان معين الي مكان آخر بعيد جدا عنه بحيث يصعب معه استخدام عمود إدارة ميكانيكي عادي وذلك بنفس السرعة n. وفي هذه الحالة يكون عزم الدوران المنقول \\(T_b\\) مساويا لعزم الدوران الأصلي \\(T_d\\) إذا اهملنا مفقدات القدرة خلال عملية النقل. في هذه الحالة تكون القدرة التي تسري بين العضوين الدائرين للمحركين عبارة عن <b>قدرة تزامن</b>.»</p>
   <p>«عند دخول عزم الدوران \\(T_d\\) على الجهاز الأول ويكون العضوان الثابتين للجهازين متصلين من مصدر واحد (تردد واحد) يتولد نفس المجال المغناطيسي الدائر في كل من العضوين الثابتين في الجهازين. وبذلك يعمل <b>الجهاز الأول كمولد</b> وتتولد قوة دافعة كهربية في العضو الدائر الأول وهذه القوة الدافعة الكهربية تنتقل إلى العضو الدائر للجهاز الثاني عن طريق حلقات الانزلاق ويعمل <b>الجهاز الثاني كمحرك</b> وبذلك ينتقل نفس العزم من الجهاز الأول (مولد) \\(T_d\\) إلى الجهاز الثاني (محرك) \\(T_b\\) علي أساس أن القوة الدافعة الكهربية متساوية تماما في العضوين الدائرين وكذلك نفس المجالين المغناطيسيين في العضوين الثابتين لانهما يتغذيان من نفس المصدر.»</p>`},
  {fig:'(٥-٦)',ref:'ص 76',caption:'جهاز تزامن لنقل عزم الدوران: الثابتان على التوازي على المصدر الثلاثي، والدواران موصلان بحلقات الانزلاق. Td داخل على محور الجهاز I و Tb خارج من محور الجهاز II بنفس السرعة n',draw:()=>box(shaftSVG({ang:0,p:powers(70.75,825,4,50)}),660)},
  {h:'مثال (٥-١)',ref:'ص 77–79',html:`<p>«يراد نقل عزم قدرة 70.75 kg.m عند سرعة 825 rpm مستخدما محركين تأثرين متماثلين وعدد اقطاب كلا منهما أربعة أقطاب. وصل عضواهما الثابتين إلى جهد تردده 50 Hz. وضح تدفق القدرة في هذا النظام لنقل العزم.»</p>
   <p><b>الحل كما في الكتاب:</b> \\(n_s = 1500\\) r.p.m، \\(s = 0.45\\)، \\(\\omega_r = 86.3\\)، \\(\\omega_S = 157\\) rad/sec.</p>
   <ul><li>الجهاز الأول (المحرك المدار): \\(P_{mI} = T\\omega_r = 60\\) kW، \\(P_{ar} = sT\\omega_S = 49\\) kW، \\(P_{SI} = T\\omega_S = 109\\) kW، والتحقق \\(60 + 49 = 109\\).</li>
   <li>الجهاز الثاني (محرك الإدارة): \\(P_{ar} = 49\\) kW، \\(P_{mo} = \\frac{1-s}{s}P_{ar} = 60\\) kW، \\(P_{SO} = \\frac{P_{mo}}{1-s} = 109\\) kW، والتحقق \\(60 + 49 = 109\\).</li></ul>
   <p>الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>`},
  {fig:'مثال (٥-١)',ref:'ص 77',caption:'تدفق القدرة في المثال: PmI = 60 kW داخلة بمحور I، و PSI = 109 kW من I إلى المصدر، و PSO = 109 kW من المصدر إلى II، و Par = 49 kW من دوار II إلى دوار I، و Pmo = 60 kW خارجة بمحور II (سماكة الأسهم تتناسب مع القدرة)',draw:()=>box(shaftSVG({ang:0,p:{PmI:60,PSI:109,PSO:109,Par:49,Pmo:60},labels:true}),660)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> (١) \\(P\\) في \\(n_s = 60f/P\\) هو عدد <b>أزواج</b> الأقطاب (2 للمحرك ذي الأربعة أقطاب)، وهو نفس \\(120f/p\\) إذا كان p عدد الأقطاب. (٢) العزم بوحدة kg.m يُحوَّل إلى N.m بالضرب في 9.81، والقسمة على 1000 تجعل القدرة بالكيلوواط.'},
  {err:'في المثال (٥-١): \\(\\omega_r = 2\\pi\\times825/60 = 86.39\\) طُبعت 86.3 (مقطوعة لا مقربة)، و \\(\\omega_S = 157.08\\) طُبعت 157. الفرق لا يغير النتائج المقربة إلى أقرب كيلوواط. كتب الكتاب «Cheak» والصحيح Check، و«عزم قدرة 70.75 kg.m» والمقصود «عزم مقداره 70.75 kg.m».'}
 ],
 lab:(el,B)=>{
  let T=70.75,n=825,poles=4,f=50,ang=0;
  el.innerHTML=`<div class="grid"><div class="panel c8"><h2>العمود الكهربائي <small>مبني على الشكل (٥-٦) ص 76 وشكل المثال ص 77</small></h2><div class="svgbox" id="P" style="max-width:660px;margin-inline:auto"></div>
    <div class="wrap-in">${slHTML('sT','العزم Td =',10,120,0.25,T,'kg.m')}${slHTML('sN','السرعة n =',50,1450,5,n,'rpm')}</div>
    <div class="wrap-in"><div><div class="sub">عدد الأقطاب</div>${segHTML('p',[[2,'2'],[4,'4'],[6,'6'],[8,'8']],poles)}</div><div><div class="sub">التردد</div>${segHTML('f',[[50,'50 Hz'],[60,'60 Hz']],f)}</div><button class="btn primary" id="bk">قيم مثال (٥-١)</button></div></div>
   <div class="panel c4"><h2>القراءات</h2><div class="facts" id="F"></div><p class="sub">القيم محسوبة بمعادلات المثال بدون تقريب (لذلك قد تختلف عن الكتاب في الكسر العشري). دوران المحورين في الرسم مبطّأ.</p></div>
   <div class="panel c12">${tryList(['اضغط «قيم مثال (٥-١)»: قارن الأسهم بأرقام الكتاب 60 و 49 و 109 kW.','قرّب السرعة n من السرعة التزامنية: يقل الانزلاق s فتقل Par المتبادلة بين الدوارين.','قلّل السرعة: تزيد Par، ويبقى PSI = PmI + Par و PSO = Pmo + Par.','لاحظ أن الجهاز II يدور بنفس السرعة n وأن Tb = Td (بإهمال المفاقيد).'])}</div></div>`;
  const $=s=>el.querySelector(s);
  const clampN=()=>{const ns=60*f/(poles/2);$('#sN').max=Math.floor(ns*0.97/5)*5;if(n>+$('#sN').max)n=+$('#sN').max};
  $('#sT').addEventListener('input',e=>{T=+e.target.value});$('#sN').addEventListener('input',e=>{n=+e.target.value});
  el.querySelectorAll('[data-p]').forEach(x=>x.addEventListener('click',()=>{poles=+x.dataset.p;segSet(el,'p',poles);clampN()}));
  el.querySelectorAll('[data-f]').forEach(x=>x.addEventListener('click',()=>{f=+x.dataset.f;segSet(el,'f',f);clampN()}));
  $('#bk').addEventListener('click',()=>{T=70.75;n=825;poles=4;f=50;segSet(el,'p',4);segSet(el,'f',50);clampN()});
  clampN();
  loopOn(el,dt=>{ang+=n/60*360*dt*0.02;const p=powers(T,n,poles,f);
   $('#sT').value=T;$('#sT-v').textContent=T.toFixed(2);$('#sN').value=n;$('#sN-v').textContent=n;
   $('#P').innerHTML=shaftSVG({ang,p,labels:true,dp:1});
   $('#F').innerHTML=facts([['ns',p.ns.toFixed(0)+' rpm'],['الانزلاق s',p.s.toFixed(3)],['ωr',p.wr.toFixed(2)+' rad/s'],['ωS',p.ws.toFixed(2)+' rad/s'],['PmI = Pmo',p.PmI.toFixed(1)+' kW'],['Par',p.Par.toFixed(1)+' kW'],['PSI = PSO',p.PSI.toFixed(1)+' kW'],['Tb = Td',T.toFixed(2)+' kg.m'],['سرعة الجهاز II',n+' rpm']]);
  });
 },
 examples:[{title:'مثال (٥-١)',ref:'ص 77–79',
   q:'<p>«يراد نقل عزم قدرة 70.75 kg.m عند سرعة 825 rpm مستخدما محركين تأثرين متماثلين وعدد اقطاب كلا منهما أربعة أقطاب. وصل عضواهما الثابتين إلى جهد تردده 50 Hz. وضح تدفق القدرة في هذا النظام لنقل العزم.»</p>',
   given:G51,solve:(g,B,isBook)=>torqSteps(g,B,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة \\(\\omega_r = 86.3\\) كما طُبعت (الصحيح 86.39). إذا غيّرت الأرقام تُقرَّب \\(\\omega_r\\) إلى منزلتين، و \\(\\omega_S\\) والقدرات إلى أعداد صحيحة كما فعل الكتاب. عدد الأقطاب يُقسم على 2 ليصير عدد الأزواج P.'}],
 quiz:[
  {q:'مما يتكون عمود الإدارة الكهربائي في الكتاب؟',o:['محرك تيار مستمر ومولد','محركين تأثيريين من ذوات الحلقات الانزلاقية متصلين معاً','مرسل ومحول تحكم','محرك عام ومحرك تنافري'],c:1,e:'ص 76.'},
  {q:'كيف يوصل الثابتان في جهاز نقل العزم؟',o:['على التوالي','على التوازي على نفس المصدر','كل واحد على مصدر مختلف التردد','لا يوصلان'],c:1,e:'«يوصل عضوهما الثابتان علي التوازي معا على نفس المصدر الكهربي».'},
  {q:'بإهمال المفاقيد، العزم المنقول Tb يساوي:',o:['نصف Td','Td','ضعف Td','صفراً'],c:1,e:'«يكون عزم الدوران المنقول Tb مساويا لعزم الدوران الأصلي Td إذا اهملنا مفقدات القدرة».'},
  {q:'الجهاز الأول (الذي يدخل عليه Td) يعمل:',o:['كمحرك','كمولد','كمحول','كمكبر'],c:1,e:'«يعمل الجهاز الأول كمولد … ويعمل الجهاز الثاني كمحرك».'},
  {q:'محرك 4 أقطاب على 50 Hz، كم سرعته التزامنية؟',o:['3000 rpm','1500 rpm','1000 rpm','750 rpm'],c:1,e:'n_s = 60 × 50 / 2 = 1500 rpm (P = عدد الأزواج = 2).'},
  {q:'في المثال (٥-١) كم الانزلاق عند 825 rpm؟',o:['0.55','0.45','0.825','0.15'],c:1,e:'s = (1500 − 825)/1500 = 0.45.'},
  {q:'في المثال (٥-١) كم القدرة Par التي تسري بين الدوارين؟',o:['60 kW','49 kW','109 kW','157 kW'],c:1,e:'P_ar = s·T·ω_S = 0.45 × 0.694 × 157 ≈ 49 kW.'},
  {q:'أي علاقة تحقق منها الكتاب في المثال؟',o:['PSI = PmI + Par','PSI = PmI − Par','Pmo = PSO + Par','Par = PmI + PSI'],c:0,e:'«Check: PSI = PmI + Par = 60 + 49 = 109 kW».'}
 ]
});

/* =================== Lesson 5.4 — unit questions =================== */
const det=(q,body,ans)=>`<details style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:8px;background:var(--surface)"><summary style="cursor:pointer;font-weight:600">${q}</summary><div style="margin-top:6px">${body||''}<div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></div></details>`;
const opts=a=>`<ul style="list-style:none;padding-inline-start:8px;margin:4px 0">${a.map((x,i)=>`<li>${'أبجده'[i]}. ${x}</li>`).join('')}</ul>`;
const ZOPT=['عندما ينطبق محور ملف الدوار مع محور أحد ملفات الثابت.','عندما يتعامد محور ملف الدوار مع محور أحد ملفات الثابت.','عندما توجد زاوية مقدارها تسعون درجة بين محور ملف الدوار مع محور أحد ملفات الثابت.','كل ما سبق.'];
B.lesson({
 id:'u5-l4',unit:5,order:4,pages:'80–81',
 title:'أسئلة الوحدة الخامسة واختبارها الذاتي',
 summary:'الاختبار الذاتي والأسئلة المتنوعة للوحدة كما في الكتاب، مع إجابات مقترحة من نص الكتاب، وحاسبتان للسؤالين س٥-١١ و س٥-١٢.',
 theory:[
  {h:'اختبار ذاتي',ref:'ص 80',html:`<p>«اختر الإجابة أو الإجابات الصحيحة:» — الكتاب لا يعطي مفتاح إجابة؛ الإجابات المقترحة من نص الكتاب ويعتمدها المدرب.</p>`+
   det('س١: من استخدامات الآلات ذاتية التزامن ……….',opts(['كجهاز لنقل العزم.','كجهاز لتوليد الطاقة.','للاستخدامات المنزلية.','كل ما سبق.']),'(أ) — «يمكن استخدامها كجهاز لنقل بيانات موضع محور ميكانيكي أو كجهاز لنقل العزم» (ص 70).')+
   det('س٢: موضع الصفر لمرسل التحكم ……….',opts(ZOPT),'(أ) — ص 71.')+
   det('س٣: موضع الصفر لمحول ……….',opts(ZOPT),'(ب) — «عند تعامد محور ملف الدوار مع محور الملف رقم واحد للثابت» (ص 72). ويمكن قبول (ج) أيضاً لأن التعامد يعني زاوية 90°؛ صياغة الخيارات فيها تداخل.')+
   det('س٤: العضو الثابت والدوار للمتحكم الفرقي ……….',opts(['على شكل أسطواني.','قفص سنجابي.','عضو ملفوف.','كل ما سبق.']),'(أ) — «كل من عضوه الثابت والدوار على شكل أسطواني» (ص 72). و(ج) صحيحة نصياً أيضاً لأن كلاً منهما «يحمل ملفات ثلاثية».')},
  {err:'خيارات س٢ و س٣ متداخلة: (ب) «يتعامد» و(ج) «زاوية تسعون درجة» معناهما واحد، فإذا كانت (ب) صحيحة كانت (ج) صحيحة.'},
  {h:'أسئلة متنوعة',ref:'ص 81',html:
   det('س٥-١: ما هي أجهزة التزامن الذاتية؟','','أجهزة تيار متردد كهرومغناطيسية لها تطبيقات واسعة في نظم التحكم الآلي ذات التغذية العكسية، تستخدم لنقل بيانات موضع محور ميكانيكي أو لنقل العزم، وقدراتها من صغيرة جداً إلى عشرات الأحصنة (ص 70). أنواعها: CX و CT و CD و CR.')+
   det('س٥-٢: اشرح مع الرسم تركيب مرسل التحكم.','','ثابت بمجار عليه ثلاثة ملفات متماثلة موصلة نجمة بزاوية 120° كهربائية بين محاورها، ودوار بقطبين بارزين عليه ملف أحادي الوجه كثير اللفات يتغذى بالتيار المتردد عبر حلقتي انزلاق. الرسم: الشكل (٥-١) في الدرس الأول.')+
   det('س٥-٣: اشرح مع الرسم تركيب محول التحكم.','','يشبه المرسل، لكن دواره أسطواني أو على شكل الشمسية لتكون الثغرة منتظمة وصغيرة فيقل تيار المغنطة، وملفات ثابته ذات معاوقة كبيرة. الرسم: الشكل (٥-٢).')+
   det('س٥-٤: لماذا يصنع دوار محول التحكم على شكل الشمسية؟','','لتكون الثغرة الهوائية منتظمة وصغيرة من جميع الجهات فيقل تيار المغنطة (ص 71–72).')+
   det('س٥-٥: ما الفرق بين تركيب مرسل التحكم ومحول التحكم.','','(١) الدوار: بارز في المرسل، أسطواني أو شمسية في المحول. (٢) الثابت: ملفات المحول ذات معاوقة كبيرة. (٣) موضع الصفر: انطباق الدوار على S1 في المرسل، وتعامده عليه في المحول. هذه الفروق تسمح بتوصيل مرسل واحد لعدة محولات.')+
   det('س٥-٦: عرف وضع الصفر في كل من مرسل ومحول التحكم.','','المرسل: عندما ينطبق محور ملف الدوار مع محور ملف الثابت رقم واحد. المحول: عندما يتعامد محور ملف الدوار مع محور ملف الثابت رقم واحد.')+
   det('س٥-٧: اشرح مع الرسم تركيب المتحكم الفرقي','','ثابت ودوار أسطوانيان، كل منهما يحمل ملفات ثلاثية موزعة في مجار وموصلة نجمة؛ يشبه محولاً ثلاثي الأوجه ثانويه قابل للدوران. الرسم: الشكل (٥-٣).')+
   det('س٥-٨: ما الفرق بين تركيب المتحكم الفرقي ومستقبل التحكم.','','المتحكم الفرقي: ثابت ودوار أسطوانيان وكلاهما بملفات ثلاثية. المستقبل: مثل المرسل تماماً — ثابت بملفات ثلاثية ودوار بأقطاب بارزة يحمل ملفاً أحادي الوجه — ومزود بعنصر كبح على محوره.')+
   det('س٥-٩: اشرح كيفية عمل جهاز نقل المعلومات.','','يغذى دوار المرسل بالتيار المتردد فتتولد في ملفات ثابته جهود تعتمد على زاوية الدوار، وتنتقل بالأسلاك (S1–S1، S2–S2، S3–S3) إلى ثابت المحول فيتكون فيه مجال مشابه. إذا كانت الزاوية بين ملفي الدوارين 90° أو 270° فلا جهد على دوار المحول (اتزان)، وإلا يتولد \\(e = E_r\\sin\\alpha\\). في الشكل (٥-٥) يُكبَّر e ويغذي ملف التحكم لمحرك ثنائي الوجه يدير محور الخرج ودوار المحول حتى يعود الاتزان (ص 73–75).')+
   det('س٥-١٠: اشرح كيفية عمل جهاز نقل العزم.','','محركان حثيان بحلقات انزلاق، ثابتاهما على التوازي على مصدر واحد فيتولد فيهما نفس المجال الدائر، ودواراهما موصلان بحلقات الانزلاق. يدخل العزم Td على الأول فيعمل مولداً، وتنتقل القوة الدافعة الكهربية إلى دوار الثاني فيعمل محركاً ويخرج منه Tb = Td بنفس السرعة n (ص 76–77).')+
   det('س٥-١١: «مجموعة مكونة من مرسل ومحول تحكم، مرسل التحكم يقوم بتغذية محول التحكم، كل من جهازي التزامن الذاتي مضبوط في موضع الصفر الشكل (٥-٤) إذا أدير دوار المرسل 60° ضد عقارب الساعة. احسب الجهد المتولد على أطراف محول التحكم، إذا كان أقصى جهد يمكن توليده هو 100 فولت، ثم ارسم رسماً توضيحياً يوضح طريقة توصيل المجموعة.»','','الجهازان في موضع الصفر يعني اتزاناً، فإدارة المرسل 60° تجعل α = 60°: \\(e = 100\\sin 60^\\circ \\approx 86.6\\) V. الرسم: الشكل (٥-٤) بتوصيل S1–S1 و S2–S2 و S3–S3. الحاسبة في تبويب «الأمثلة المحلولة».')+
   det('س٥-١٢: «يراد نقل عزم قدرة 100 kg.m عند سرعة 1000 rpm مستخدما محركين تأثريين متماثلين وعدد اقطاب كلا منهما أربعة أقطاب. وصل عضويهما الثابتين إلى جهد تردده 50 Hz. وضح تدفق القدرة في هذا النظام لنقل العزم.»','','بخطوات المثال (٥-١): \\(n_s = 1500\\)، \\(s = 0.3333\\)، \\(\\omega_r = 104.72\\)، \\(\\omega_S = 157\\) rad/sec، \\(P_{mI} \\approx 103\\) kW، \\(P_{ar} \\approx 51\\) kW، \\(P_{SI} \\approx 154\\) kW، \\(P_{mo} \\approx 102\\) kW، \\(P_{SO} \\approx 153\\) kW. (فرق 1 kW بين الجهازين بسبب التقريب إلى أعداد صحيحة كما في الكتاب؛ بدون تقريب: PmI = Pmo ≈ 102.7 kW و PSI = PSO ≈ 154.1 kW.)')}
 ],
 examples:[
  {title:'س٥-١١ (حساب مقترح — ليس من الكتاب)',ref:'ص 81',q:'<p>الجهازان في موضع الصفر (وضع الاتزان) ثم أدير دوار المرسل بزاوية α. أقصى جهد على دوار المحول \\(E_r\\).</p>',
   given:[{id:'E',label:'أقصى جهد',sym:'E_r',unit:'V',value:100},{id:'a',label:'زاوية إدارة المرسل عن الاتزان',sym:'\\alpha',unit:'°',value:60}],
   solve:(g,B)=>[{t:'من العلاقة في ص 74:',f:`e=E_r\\sin\\alpha=${B.fmtN(g.E)}\\times\\sin ${B.fmtN(g.a)}^\\circ`,v:B.round(g.E*Math.sin(g.a*D),1),unit:'V',dp:1,final:true}]},
  {title:'س٥-١٢ (حساب مقترح — ليس من الكتاب)',ref:'ص 81',q:'<p>بنفس خطوات مثال (٥-١) وتقريبه.</p>',
   given:G51.map(x=>Object.assign({},x,{value:{T:100,n:1000,poles:4,f:50}[x.id]})),solve:(g,B)=>torqSteps(g,B,false)}
 ],
 quiz:[
  {q:'س١: من استخدامات الآلات ذاتية التزامن ……….',o:['كجهاز لنقل العزم','كجهاز لتوليد الطاقة','للاستخدامات المنزلية','كل ما سبق'],c:0,e:'إجابة مقترحة من نص ص 70.'},
  {q:'س٢: موضع الصفر لمرسل التحكم ……….',o:ZOPT.map(x=>x.replace(/\.$/,'')),c:0,e:'إجابة مقترحة من نص ص 71.'},
  {q:'س٣: موضع الصفر لمحول التحكم ……….',o:ZOPT.map(x=>x.replace(/\.$/,'')),c:1,e:'إجابة مقترحة من نص ص 72. (ج) لها نفس المعنى تقريباً — انظر الملاحظة في الشرح.'},
  {q:'س٤: العضو الثابت والدوار للمتحكم الفرقي ……….',o:['على شكل أسطواني','قفص سنجابي','عضو ملفوف','كل ما سبق'],c:0,e:'إجابة مقترحة من نص ص 72.'},
  {q:'مرسل ومحول في موضع الصفر، أدير المرسل 60° وأقصى جهد 100 V. كم الجهد على دوار المحول؟',o:['50 V','60 V','86.6 V','100 V'],c:2,e:'e = 100 sin 60° ≈ 86.6 V (س٥-١١).'},
  {q:'محرك 4 أقطاب على 50 Hz يدور بسرعة 1000 rpm في نظام نقل العزم. كم الانزلاق؟',o:['0.25','0.33','0.5','0.67'],c:1,e:'s = (1500 − 1000)/1500 ≈ 0.333 (س٥-١٢).'}
 ]
});
})(PLCBOOK);
