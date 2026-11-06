/* Unit 1 (part A) — المحركات الحثية ثلاثية الأوجه: التمهيد + الفصل الأول والفصل الثاني (ص 7–37)
   Lessons u1-l1 … u1-l6. (Chapters 3–4 are in u1b.js from u1-l7 on.) */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180,SQ3=Math.sqrt(3);
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const sig=(x,n)=>(!isFinite(x)||x===0)?x:+(+x).toPrecision(n);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('acu1a-css'))return;const s=document.createElement('style');s.id='acu1a-css';s.textContent=`
.im-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.im-sl .im-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.im-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.im-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.im-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.im-row .sub{margin:0}
.im-parts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.im-parts .btn[aria-pressed="true"]{border-color:var(--stop);background:var(--stop-soft)}
.im-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.im-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.im-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.im-tbl{overflow-x:auto}
.im-tbl table.tt td,.im-tbl table.tt th{padding:6px 6px}
.im-tbl tr.cur td{background:var(--live-soft);font-weight:700}
.im-sgn-p{color:var(--blue-ink);font-weight:700}
.im-sgn-m{color:var(--live);font-weight:700}
.im-figs{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.im-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.im-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.im-chip.ok{background:var(--on-soft);color:var(--on)}
.im-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.im-chip.warn{background:var(--stop-soft);color:var(--stop)}
.im-chip.hot{background:var(--live-soft);color:var(--live)}
.im-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:10px}
.im-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 10px;text-align:center}
.im-meter span{display:block;font-size:12px;color:var(--muted)}
.im-meter b{font:700 20px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.im-rec{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}
.im-rec th,.im-rec td{border-bottom:1px solid var(--line);padding:5px 6px;text-align:center}
.im-rec td.l{font-family:var(--mono);direction:ltr}
.im-fine{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}
.im-fine .btn{padding:4px 10px;font-family:var(--mono);direction:ltr}
.im-try{margin:6px 0 0;padding-inline-start:20px}
.im-lab .seg{flex-wrap:wrap;max-width:100%}
.im-lab .seg button{white-space:nowrap}
.svgbox.im-wide svg{min-width:600px}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}}};}
const sl=(id,label,min,max,step,val)=>`<label class="im-sl"><span class="im-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="im-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max,wide)=>`<div class="svgbox${wide?' im-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* zig-zag resistor between two points */
function zig(x1,y1,x2,y2,n,cls,st){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.16,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w ${cls||''}" ${st||''} d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
/* inductor (loops) between two points */
function ind(x1,y1,x2,y2,n,cls,st){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.14,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" ${st||''} d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||46,R=14,T=14,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-1e6,o.y1+1e6)))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${o.cid||'imclip'}"><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-Bm}"/></clipPath></defs>${s}</svg>`}
/* render a list of solution steps like the worked-examples tab */
function stepsHTML(steps){return `<ol class="ex-steps">${steps.map(st=>`<li class="${st.final?'final':''}">${st.t?`<div class="ex-t">${st.t}</div>`:''}${st.f?`<div class="ex-f">${B.tex(st.f,true)}</div>`:''}${st.v!=null?`<div class="ex-v"><span class="ltr">${fm(st.v,st.dp)} ${st.unit||''}</span></div>`:''}</li>`).join('')}</ol>`}
const Q=(n,q,ans)=>`<details class="im-q"><summary>${n}: ${q}</summary><div class="im-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;

/* ======================================================================
   Lesson 1 — construction
   ====================================================================== */
const PARTS1=[
 {k:'stator',n:'العضو الثابت (Stator)',g:'stator',d:'«يتكون العضو الثابت من شرائح متراصة من الحديد المغناطيسي يتراوح سمكها من 0.3 مم إلى 0.6 مم حسب حجم المحرك، ومعزولة عن بعضها بعازل كهربائي بحيث تكون مع بعضها جسماً أسطوانياً محفوراً بداخله عدد من المجاري وذلك لتركيب الملفات» (ص 11).'},
 {k:'lam',n:'الشرائح المعزولة',g:'stator',d:'«الهدف من تصنيع العضو الثابت بهذه الطريقة هو تقليل حرارة الحديد الناتجة عن التيارات الدوامية التي تتكون بسبب تعرض الحديد للمجال المغناطيسي المتغير داخل المحرك»، وفي المحركات الكبيرة «فتحات تهوية بين الشرائح» (ص 11). والعضو الدوار أيضاً من شرائح متراصة معزولة (ص 12).'},
 {k:'slots',n:'المجاري',g:'slots',d:'مجارٍ محفورة في الجسم الأسطواني «لتركيب الملفات». «يتم تقسيمه إلى العدد المطلوب من الأقطاب وتقسم المجاري تحت كل قطب على الأوجه الثلاثة» (ص 11).'},
 {k:'swind',n:'ملفات العضو الثابت',g:'swind',d:'«يتم تركيب ملفات كل وجه في المجاري الخاصة بها تحت كل قطب بحيث يفصل بين كل وجه وآخر 120° كهربائية، وفي نهاية عملية اللف يكون قد تم تركيب ثلاثة ملفات في العضو الثابت لكل ملف طرفان» (ص 11).'},
 {k:'term',n:'الأطراف الستة',g:'term',d:'«من خلال هذه الأطراف الستة يتم تغذية العضو الثابت بعد توصيلها إما على شكل نجمة أو دلتا» (ص 11، الشكل 1-3).'},
 {k:'gap',n:'الثغرة الهوائية',g:'gap',d:'المسافة الصغيرة بين العضو الثابت والعضو الدوار. فيها «سينشأ … مجال مغناطيسي دوار منتظم» (ص 14) — موضوع الدرس التالي.'},
 {k:'rotor',n:'العضو الدوار (Rotor)',g:'rotor',d:'«يوجد منه نوعان مختلفان في التركيب ومتقاربان في الخواص الكهربائية، ويسمى المحرك عادةً باسم عضوه الدوار»: الملفوف (ذو حلقات الانزلاق) وذو القفص السنجابي (ص 12). قلبه شرائح متراصة من الحديد المغناطيسي معزولة عن بعضها.'},
 {k:'shaft',n:'عمود المحرك',g:'shaft',d:'شرائح العضو الدوار «مركبة على عمود المحرك» (ص 12)، وحلقات الانزلاق «مركبة على نفس العمود» (ص 12).'},
 {k:'rwind',n:'ملفات العضو الدوار',g:'rwind',only:'wound',d:'«يقسم العضو الدوار إلى عدد من الأقطاب مساوٍ لأقطاب العضو الثابت … بحيث يكون بين كل وجه وآخر 120° كهربائية، عادةً هذه الملفات الثلاثة توصل على شكل نجمة حيث تقصر ثلاثة أطراف مع بعضها البعض داخل العضو الدوار» (ص 12).'},
 {k:'rings',n:'حلقات الانزلاق Slip Rings',g:'rings',only:'wound',d:'الأطراف الثلاثة الأخرى لملفات الدوار «يتم توصيلها إلى ثلاث حلقات انزلاق Slip Rings مركبة على نفس العمود» (ص 12).'},
 {k:'brush',n:'الفرش الكربونية',g:'brush',only:'wound',d:'«من خلال حلقات الانزلاق وعن طريق فرش كربونية مماسة لحلقات الانزلاق أثناء الدوران يتم توصيل ملفات العضو الدوار إلى خارج المحرك» (ص 13).'},
 {k:'rext',n:'المقاومات الخارجية المتغيرة',g:'rext',only:'wound',d:'توصل «على التوالي مع مقاومات خارجية متغيرة وذلك من أجل التحكم في بدء دوران المحرك أو في تنظيم سرعته» (ص 13، الشكل 1-5: Starting Resistance).'},
 {k:'bars',n:'القضبان',g:'bars',only:'cage',d:'«بدلاً من وضع ملفات في المجاري فإنه توضع قضبان من النحاس أو الألمنيوم» (ص 14).'},
 {k:'erings',n:'حلقتا القصر الطرفيتان',g:'erings',only:'cage',d:'«هذه القضبان مقصورة أطرافها مع بعض من الجهتين بحلقتين من نفس مادة القضبان» (ص 14). لا حلقات انزلاق ولا فرش، لذلك «لا يمكن توصيله بدائرة خارجية».'}
];
/* longitudinal section of the motor (redrawn, simplified from الشكل 1-1) */
function motorSectionSVG(o){o=o||{};const type=o.type||'cage',hi=o.hi||'',hide=!!o.hide,rx=o.rext==null?50:o.rext,ang=o.ang||0;
  const g=(k,inner)=>`<g data-part="${k}" style="cursor:pointer;${hi&&hi!==k?'opacity:.32':''}">${inner}</g>`;
  const hs=k=>hi===k?'stroke="var(--stop)" stroke-width="3"':'stroke="var(--fg)" stroke-width="1.4"';
  const cu='var(--live)';
  let s=`<svg viewBox="0 0 720 320" role="img" aria-label="مقطع طولي مبسط في محرك حثي"><defs><pattern id="imHatch" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--surface-2)"/><path d="M1 0V6" stroke="var(--muted)" stroke-width="1"/></pattern></defs>`;
  // frame (not a book part)
  s+=`<rect x="128" y="44" width="374" height="242" rx="16" fill="none" stroke="var(--line)" stroke-width="6"/>`;
  for(let i=0;i<9;i++)s+=`<path d="M${150+i*40} 38V44M${150+i*40} 286V292" stroke="var(--line)" stroke-width="4"/>`;
  // shaft
  s+=g('shaft',`<rect x="24" y="157" width="${type==='wound'?560:672}" height="16" rx="4" fill="var(--surface-2)" ${hs('shaft')}/>`);
  // stator core
  s+=g('stator',`<rect x="170" y="58" width="290" height="56" fill="url(#imHatch)" ${hs('stator')}/><rect x="170" y="216" width="290" height="56" fill="url(#imHatch)" ${hs('stator')}/>`);
  // slots
  s+=g('slots',`<rect x="176" y="97" width="278" height="15" fill="var(--surface)" ${hs('slots')}/><rect x="176" y="218" width="278" height="15" fill="var(--surface)" ${hs('slots')}/>`);
  // stator windings: conductors in slots + end turns
  s+=g('swind',`<rect x="178" y="100" width="274" height="9" fill="${cu}" opacity=".9"/><rect x="178" y="221" width="274" height="9" fill="${cu}" opacity=".9"/>
    ${[[146,94],[452,94],[146,217],[452,217]].map(([x,y])=>`<rect x="${x}" y="${y}" width="32" height="20" rx="9" fill="${cu}" opacity=".7"/>`).join('')}
    ${hi==='swind'?'<rect x="140" y="94" width="350" height="142" fill="none" stroke="var(--stop)" stroke-width="2" stroke-dasharray="6 4"/>':''}`);
  // terminal box (six terminals)
  s+=g('term',`<rect x="278" y="6" width="84" height="34" rx="5" fill="var(--surface)" ${hs('term')}/>${[0,1,2].map(i=>`<circle cx="${296+i*24}" cy="16" r="3.6" fill="var(--fg)"/><circle cx="${296+i*24}" cy="30" r="3.6" fill="var(--fg)"/>`).join('')}<path d="M300 40V58M340 40V58" stroke="${cu}" stroke-width="2"/>`);
  // air gap
  s+=g('gap',`<rect x="176" y="112" width="278" height="7" fill="${hi==='gap'?'var(--stop-soft)':'var(--surface)'}" stroke="${hi==='gap'?'var(--stop)':'none'}"/><rect x="176" y="211" width="278" height="7" fill="${hi==='gap'?'var(--stop-soft)':'var(--surface)'}" stroke="${hi==='gap'?'var(--stop)':'none'}"/>`);
  // rotor core
  s+=g('rotor',`<rect x="190" y="120" width="250" height="90" fill="url(#imHatch)" ${hs('rotor')} ${hide&&type==='cage'?'opacity=".08"':''}/>`);
  if(type==='cage'){
    // bars (stripes moving when spinning)
    let bars='';
    for(let i=-1;i<5;i++){const y=124+i*17.2;bars+=`<rect x="186" y="${fx(y)}" width="258" height="6" fill="${cu}" ${hi==='bars'?'stroke="var(--stop)" stroke-width="1.6"':''}/>`}
    s+=`<defs><clipPath id="imBarClip"><rect x="184" y="121" width="262" height="88"/></clipPath></defs>`+g('bars',`<g clip-path="url(#imBarClip)"><g id="imBarsMove" transform="translate(0 ${fx((ang%17.2))})">${bars}</g></g>`);
    s+=g('erings',`<rect x="178" y="118" width="12" height="94" rx="3" fill="${cu}" ${hs('erings')}/><rect x="440" y="118" width="12" height="94" rx="3" fill="${cu}" ${hs('erings')}/>`);
  }else{
    s+=g('rwind',`<rect x="192" y="124" width="246" height="8" fill="${cu}" opacity=".85"/><rect x="192" y="198" width="246" height="8" fill="${cu}" opacity=".85"/>
      ${[[180,122],[436,122],[180,196],[436,196]].map(([x,y])=>`<rect x="${x}" y="${y}" width="16" height="12" rx="5" fill="${cu}" opacity=".75"/>`).join('')}
      ${hi==='rwind'?'<rect x="176" y="118" width="278" height="94" fill="none" stroke="var(--stop)" stroke-width="2" stroke-dasharray="6 4"/>':''}
      <path d="M448 150H${530}M448 160H${552}M448 170H${574}" stroke="${cu}" stroke-width="1.6" fill="none"/>`);
    s+=g('rings',[530,552,574].map(x=>`<rect x="${x-5}" y="136" width="11" height="58" rx="3" fill="${cu}" ${hs('rings')}/>`).join(''));
    s+=g('brush',[530,552,574].map(x=>`<rect x="${x-5}" y="118" width="11" height="16" fill="var(--fg)" ${hi==='brush'?'stroke="var(--stop)" stroke-width="2"':''}/>`).join(''));
    // external variable resistors (star) — wiper position = rx (0..100)
    let r='';[612,646,680].forEach((x,i)=>{const bx=[530,552,574][i];r+=`<path class="w" d="M${bx} 118V${96-i*8}H${x}V70"/>`+zig(x,70,x,150,6,'');const wy=74+rx/100*72;r+=arrow(x+18,wy+10,x+3,wy,'--blue',1.8)});
    r+=`<path class="w" d="M612 150V160H680V150M646 150V160"/><path d="M612 160V172" stroke="none"/>`;
    s+=g('rext',`<rect x="596" y="56" width="104" height="112" rx="8" fill="none" ${hi==='rext'?'stroke="var(--stop)" stroke-width="2.4"':'stroke="var(--line)"'} stroke-dasharray="5 4"/>${r}`);
  }
  // labels
  const L=[[315,306,'العضو الثابت (شرائح + ملفات)'],[90,148,'عمود المحرك']];
  if(type==='cage')L.push([620,148,'لا حلقات ولا فرش']);else L.push([648,190,'مقاومات خارجية'],[552,212,'حلقات + فرش']);
  L.forEach(([x,y,t])=>{s+=arT(x,y,t,{fs:12.5,col:'--muted'})});
  s+=S.t(315,168,type==='cage'?'Squirrel cage rotor':'Wound rotor','m');
  return s+'</svg>';
}
/* الشكل (1-2) / (1-4): laminations */
function lamSVG(kind){const cx=150,cy=150;let s=`<svg viewBox="0 0 300 300" role="img" aria-label="${kind==='rotor'?'شريحة العضو الدوار':'شريحة عضو ثابت'}">`;
  if(kind!=='rotor'){s+=`<circle cx="${cx}" cy="${cy}" r="136" fill="url(#imHatch2)" stroke="var(--fg)" stroke-width="1.6"/><defs><pattern id="imHatch2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--surface-2)"/><path d="M0 0V7" stroke="var(--muted)" stroke-width="1"/></pattern></defs>`;
    s+=`<circle cx="${cx}" cy="${cy}" r="86" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
    for(let i=0;i<24;i++){const a=i*15*D;s+=`<g transform="rotate(${i*15} ${cx} ${cy})"><rect x="${cx-5}" y="${cy-108}" width="10" height="24" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/></g>`}
    s+=`<circle cx="${cx}" cy="${cy}" r="64" fill="var(--surface-2)" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 3"/><circle cx="${cx}" cy="${cy}" r="12" fill="var(--surface)" stroke="var(--muted)"/>`;
    s+=S.t(cx,cy-26,'Rotor','m')+S.t(cx,cy+126,'Stator','');}
  else{const cols=['--blue','--live','--stop'];s+=`<circle cx="${cx}" cy="${cy}" r="128" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="20" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect x="${cx-4}" y="${cy-26}" width="8" height="8" fill="var(--surface)" stroke="var(--fg)"/>`;
    for(let i=0;i<36;i++){s+=`<g transform="rotate(${i*10} ${cx} ${cy})"><rect x="${cx-5}" y="${cy-124}" width="10" height="26" rx="3" fill="var(${cols[Math.floor(i/3)%3]})" opacity=".85" stroke="var(--fg)" stroke-width=".8"/></g>`}
    s+=S.t(cx,cy+50,'36 slots','m');}
  return s+'</svg>'}
/* الشكل (1-3): completed small stator (simplified) */
function statorDoneSVG(){const cx=150,cy=140;let s=`<svg viewBox="0 0 300 290" role="img" aria-label="عضو ثابت مكتمل">`;
  s+=`<rect x="40" y="250" width="220" height="16" rx="4" fill="var(--surface-2)" stroke="var(--fg)"/><circle cx="${cx}" cy="${cy}" r="118" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="76" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  const cols=['--blue','--live','--stop'];for(let i=0;i<24;i++)s+=`<g transform="rotate(${i*15} ${cx} ${cy})"><rect x="${cx-5}" y="${cy-96}" width="10" height="20" rx="2" fill="var(${cols[Math.floor(i/2)%3]})" opacity=".9"/></g>`;
  ['A','B','C','A\'','B\'','C\''].forEach((t,i)=>{const x=200+i*14;s+=`<path d="M${170+i*6} 40Q${x} 10 ${x+30} ${6+i*3}" fill="none" stroke="var(${cols[i%3]})" stroke-width="2"/>`});
  s+=S.t(cx,cy+4,'Stator','m');return s+'</svg>'}
/* الشكل (1-5): wound rotor schematic */
function woundSchemSVG(rx){rx=rx==null?50:rx;const cols=['--blue','--live','--stop'];let s=`<svg viewBox="0 0 580 300" role="img" aria-label="عضو دوار ملفوف ذو حلقات انزلاق">`;
  s+=`<rect x="16" y="30" width="200" height="190" rx="10" fill="none" stroke="var(--line)" stroke-dasharray="6 4"/>`+S.t(116,22,'Rotor Winding','');
  [70,125,180].forEach((y,i)=>{s+=ind(60,y,170,y,4,'',`style="stroke:var(${cols[i]})"`);s+=`<path class="w" d="M170 ${y}H${250+i*36}V${150-10}"/>`});
  s+=`<path class="w" d="M60 70V180M40 70H60M40 125H60M40 180H60"/><path class="w" d="M40 70V180"/>`+S.t(30,240,'star','m');
  // shaft + rings
  s+=`<rect x="226" y="146" width="170" height="10" fill="var(--surface-2)" stroke="var(--fg)"/>`;
  [250,286,322].forEach((x,i)=>{s+=`<ellipse cx="${x}" cy="151" rx="8" ry="40" fill="var(--live-soft)" stroke="var(${cols[i]})" stroke-width="2.4"/><rect x="${x-6}" y="194" width="12" height="16" fill="var(--fg)"/>`});
  s+=S.t(286,104,'Slip Rings','');
  // resistors
  [250,286,322].forEach((x,i)=>{const xr=380+i*40;s+=`<path class="w" d="M${x} 210V${226+i*6}H${xr}V232"/>`+zig(xr,232,xr,282,5,'');const wy=236+rx/100*42;s+=arrow(xr+18,wy+8,xr+3,wy,'--blue',1.8)});
  s+=`<path class="w" d="M380 282V292H460V282M420 282V292"/>`+S.t(470,226,'Starting','m','start')+S.t(470,240,'Resistance','m','start');
  return s+'</svg>'}
/* الشكل (1-6a) / (1-6b) */
function cageSVG(withCore){let s=`<svg viewBox="0 0 520 240" role="img" aria-label="${withCore?'عضو دوار ذو القفص السنجابي':'قضبان القفص السنجابي'}">`;
  const x1=120,x2=400,cy=120,ry=80,rx=24;
  if(withCore){s+=`<rect x="${x1}" y="${cy-ry}" width="${x2-x1}" height="${2*ry}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><ellipse cx="${x2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
    for(let k=-5;k<=5;k++){const y=cy+k*14;s+=`<path d="M${x1} ${y+6}L${x2} ${y-6}" stroke="var(--live)" stroke-width="2" opacity=".75"/>`}
    [[-30,0],[30,0],[0,-40],[0,40]].forEach(([dy,dz])=>{s+=`<circle cx="${x2+dz/4}" cy="${cy+dy+dz}" r="6" fill="var(--surface)" stroke="var(--fg)"/>`});
    s+=`<rect x="30" y="${cy-8}" width="${x1-30}" height="16" fill="var(--surface)" stroke="var(--fg)"/><rect x="${x2+rx-2}" y="${cy-8}" width="90" height="16" fill="var(--surface)" stroke="var(--fg)"/>`;}
  else{for(let i=0;i<16;i++){const a=i*22.5*D,y=cy-ry*Math.cos(a),z=Math.sin(a);const back=z<0;s+=`<path d="M${fx(x1+rx*z)} ${fx(y)}L${fx(x2+rx*z)} ${fx(y)}" stroke="var(--live)" stroke-width="${back?2:3.4}" opacity="${back?.4:1}"/>`}
    s+=`<ellipse cx="${x1}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--live)" stroke-width="9"/><ellipse cx="${x2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--live)" stroke-width="9"/>`;
    s+=arT(x1,cy+ry+28,'حلقة نحاسية',{fs:13})+arT(x2,cy+ry+28,'حلقة نحاسية',{fs:13})+arT((x1+x2)/2,24,'قضبان نحاسية',{fs:13});}
  return s+'</svg>'}
/* star / delta of the six terminals (A A' B B' C C' — letters of الشكل 1-7) */
function starDeltaSVG(conn){const cols={A:'--blue',B:'--live',C:'--stop'};let s=`<svg viewBox="0 0 560 230" role="img" aria-label="توصيل الأطراف الستة">`;
  // terminal board: top row A B C, bottom row C' A' B'
  const T={A:[60,60],B:[120,60],C:[180,60],"C'":[60,140],"A'":[120,140],"B'":[180,140]};
  s+=`<rect x="30" y="30" width="180" height="140" rx="10" fill="var(--surface-2)" stroke="var(--line)"/>`;
  // links
  if(conn==='star')s+=`<path d="M60 140H180" stroke="var(--fg)" stroke-width="7" stroke-linecap="round" opacity=".55"/>`;
  else s+=`<path d="M60 60V140M120 60V140M180 60V140" stroke="var(--fg)" stroke-width="7" stroke-linecap="round" opacity=".55"/>`;
  Object.entries(T).forEach(([k,[x,y]])=>{s+=`<circle cx="${x}" cy="${y}" r="11" fill="var(--surface)" stroke="var(${cols[k[0]]})" stroke-width="3"/>`+S.t(x,y+(y<100?-18:30),k,'')});
  s+=`<path d="M60 49V14M120 49V14M180 49V14" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(120,10,'L1   L2   L3','m');
  // schematic
  const cx=400,cy=120;
  if(conn==='star'){[[-90,'A'],[30,'B'],[150,'C']].forEach(([a,k])=>{const ex=cx+80*Math.cos(a*D),ey=cy+80*Math.sin(a*D);s+=zig(cx,cy,ex,ey,5,'',`style="stroke:var(${cols[k]})"`)+S.t(ex+(a===-90?0:a===30?14:-14),ey+(a===-90?-8:16),k,'')+S.t(cx+(a===-90?14:a===30?6:-14),cy+(a===-90?-30:a===30?26:24),k+"'",'m')});
    s+=`<circle cx="${cx}" cy="${cy}" r="4" fill="var(--fg)"/>`+arT(cx,214,'نجمة: الأطراف A\' و B\' و C\' مقصورة معاً',{fs:12.5});}
  else{const P=[[cx,cy-80],[cx+76,cy+50],[cx-76,cy+50]];s+=zig(P[0][0],P[0][1],P[1][0],P[1][1],5,'',`style="stroke:var(--blue)"`)+zig(P[1][0],P[1][1],P[2][0],P[2][1],5,'',`style="stroke:var(--live)"`)+zig(P[2][0],P[2][1],P[0][0],P[0][1],5,'',`style="stroke:var(--stop)"`);
    s+=S.t(cx+50,cy-24,"A-A'",'')+S.t(cx,cy+72,"B-B'",'')+S.t(cx-52,cy-24,"C-C'",'');P.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--fg)"/>`});
    s+=arT(cx,214,'دلتا: نهاية كل ملف مع بداية الملف التالي',{fs:12.5});}
  return s+'</svg>'}
/* eddy currents: solid core vs laminations */
function eddySVG(solid,t){let s=`<svg viewBox="0 0 520 200" role="img" aria-label="التيارات الدوامية">`;const x0=40,y0=30,W=260,H=140;
  s+=`<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  if(solid){s+=`<rect x="${x0+14}" y="${y0+14}" width="${W-28}" height="${H-28}" rx="40" fill="none" stroke="var(--stop)" stroke-width="5"/>`+arrow(x0+W/2+10,y0+14,x0+W/2-14,y0+14,'--stop',4);}
  else{const n=Math.round(W/(t*26));const w=W/n;for(let i=0;i<n;i++){const x=x0+i*w;s+=`<rect x="${fx(x)}" y="${y0}" width="${fx(w)}" height="${H}" fill="none" stroke="var(--fg)" stroke-width="${i?1.6:0}"/><rect x="${fx(x+w*0.25)}" y="${y0+12}" width="${fx(w*0.5)}" height="${H-24}" rx="${fx(w*0.25)}" fill="none" stroke="var(--stop)" stroke-width="1.6" opacity=".9"/>`}}
  s+=arrow(x0+W+30,y0+H-10,x0+W+30,y0+10,'--blue',3)+S.t(x0+W+44,y0+H/2,'B ~','b','start')+arT(x0+W+120,y0+H/2+24,'مجال متغير',{fs:12,col:'--muted'});
  return s+'</svg>'}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'7، 9–14',
 title:'مقدمة المحرك الحثي ثلاثي الأوجه وتركيبه',
 summary:'لماذا المحرك الحثي هو الأكثر انتشاراً في الصناعة، ومزاياه وعيوبه، ثم أجزاؤه: العضو الثابت المصنوع من شرائح معزولة وملفاته الثلاثة، ونوعا العضو الدوار: الملفوف ذو حلقات الانزلاق وذو القفص السنجابي.',
 theory:[
  {h:'تمهيد الحقيبة',ref:'ص 7',html:`<p>«تهدف هذه الحقيبة التدريبية … إلى تعريف المتدرب بتركيب وأساسيات تشغيل وأداء آلات التيار المتردد الشائعة الاستخدام كالمحركات الحثية والآلات التزامنية، كذلك تهدف إلى تعريف المتدرب تطبيقات هذه الآلات واستخداماتها في الصناعة، كما تهدف أيضاً إلى تدريب المتدرب على كيفية قياس الخواص الهامة لهذه الآلات وتحديد مدى تشغيلها وكذلك تدريبه على إجراء الحسابات المتعلقة بتلك الآلات.» وتشتمل على أربع وحدات:</p>
   <ol><li>الوحدة الأولى: المحركات الحثية ثلاثية الأوجه.</li><li>الوحدة الثانية: المحركات الحثية أحادية الوجه.</li><li>الوحدة الثالثة: المولدات التزامنية ثلاثية الأوجه.</li><li>الوحدة الرابعة: المحركات التزامنية ثلاثية الأوجه.</li></ol>
   <p>«وقد قسمت كل وحدة إلى عدد من الفصول … بالإضافة إلى عدد من الأمثلة الحسابية المحلولة حلاً تفصيلياً … كما يوجد في نهاية كل فصل مجموعة من الأسئلة والتمارين.»</p>`},
  {h:'الوحدة الأولى: الهدف العام والأهداف التفصيلية',ref:'ص 9',html:`<p><b>الهدف العام للوحدة:</b> «الإلمام الشامل بتركيب ونظرية العمل وأداء المحركات الحثية ثلاثية الأوجه.»</p>
   <p><b>الأهداف التفصيلية:</b> أن يتمكن المتدرب من:</p>
   <ol><li>الإلمام بأنواع وتركيب المحركات الحثية ثلاثية الأوجه.</li><li>الإلمام بكيفية توليد المجال المغناطيسي الدوار في هذه المحركات.</li><li>فهم نظرية عمل المحركات الحثية ثلاثية الأوجه.</li><li>«أن يتمكن المتدرب من بخواص المحركات الحثية ثلاثية الأوجه وطبيعة عملها» (كما طُبع).</li><li>الإلمام بطرق عكس اتجاه دوران المحركات الحثية ثلاثية الأوجه.</li><li>إجراء الاختبارات الروتينية على هذه المحركات.</li><li>حساب ثوابت الدائرة المكافئة لهذه المحركات.</li><li>فهم المنحنيات الخاصة بأداء هذه المحركات.</li><li>إجراء الحسابات المتعلقة بهذه المحركات مثل حساب القدرة والعزم والكفاءة.</li><li>الإلمام بطرق بدء الحركة للمحركات الحثية ثلاثية الأوجه.</li><li>الإلمام بكيفية تغيير سرعة دوران المحركات الحثية ثلاثية الأوجه.</li></ol>
   <p class="sub">هذا الجزء من الكتاب (الفصلان الأول والثاني) يغطي الأهداف 1 و2 و3 و5 و6 و7. والفصلان الثالث والرابع في الدروس التالية من الوحدة.</p>`},
  {err:'الهدف التفصيلي الرابع (ص 9) طُبع «أن يتمكن المتدرب <b>من بخواص</b> المحركات…» وفيه كلمة ناقصة؛ المقصود غالباً «أن يتمكن المتدرب من <b>الإلمام</b> بخواص المحركات…». ولا تذكر صفحة الوحدة «الوقت المتوقع» ولا «الوسائل».'},
  {h:'الفصل الأول: التركيب ونظرية العمل — تمهيد',ref:'ص 10',html:`<p>«المحرك الحثي ثلاثي الأوجه الذي قام باختراعه <b>نيكولا تسلا عام 1886م</b> يعتبر المحرك الأكثر انتشاراً في عالم الصناعة اليوم، ويقدر أن في مصانع أمريكا وحدها ما يزيد عن <b>خمسين مليون محرك</b> من هذا النوع تعطي جميعها ما مقداره <b>150 مليون حصان</b> <span class="ltr">(1 hp = 746 W)</span>، ويعتقد أن هذا العدد يزداد بما يقارب <b>مليون محرك كل عام</b>.»</p>
   <p>«هذا الانتشار الواسع جاء نتيجةً لما يتمتع به من مزايا مثل: المتانة وبساطة التركيب، وقلة الصيانة وانخفاض الثمن مقارنة بالمحركات الأخرى. كما أنه يتوفر بقدرات تتراوح من جزء من الحصان إلى أكثر من <span class="ltr">10000</span> حصان ولا يحتاج إلى أي وسيلة إثارة بالإضافة إلى كفاءته العالية إذ أن مميزات تشغيله حسنة ومرضية في الأعمال التي لا تتطلب تغيراً في السرعة.»</p>
   <p>«<b>عيوبه:</b> ليس من السهل التحكم في سرعته، كما أن تيار البدء لهذا المحرك عالٍ (<b>6-8 أضعاف تيار الحمل الكامل</b>)، وكذلك معامل القدرة منخفض عند الأحمال الخفيفة. ولكن مميزات هذا المحرك تفوق عيوبه في معظم التطبيقات الصناعية كما أنه وجد حديثاً وسائل تحكم إلكترونية أدت إلى التغلب على هذه العيوب.»</p>
   <table class="tt"><thead><tr><th>المزايا (ص 10)</th><th>العيوب (ص 10)</th></tr></thead><tbody>
   <tr><td>المتانة وبساطة التركيب</td><td>ليس من السهل التحكم في سرعته</td></tr>
   <tr><td>قلة الصيانة وانخفاض الثمن</td><td>تيار البدء عالٍ: 6–8 أضعاف تيار الحمل الكامل</td></tr>
   <tr><td>قدرات من جزء من الحصان إلى أكثر من 10000 حصان</td><td>معامل القدرة منخفض عند الأحمال الخفيفة</td></tr>
   <tr><td>لا يحتاج إلى أي وسيلة إثارة، وكفاءته عالية</td><td>(تغلبت عليها حديثاً وسائل التحكم الإلكترونية)</td></tr></tbody></table>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «6–8 أضعاف» تعني أن محركاً تيار حمله الكامل <span class="ltr">10 A</span> يسحب لحظة التشغيل من <span class="ltr">60 A</span> إلى <span class="ltr">80 A</span>. لذلك نحتاج طرق بدء الحركة (الفصل الرابع من الوحدة). و<span class="ltr">150</span> مليون حصان تساوي تقريباً <span class="ltr">150000000 × 746 W ≈ 112 GW</span>.'},
  {h:'تركيب المحرك الحثي',ref:'ص 10–11',html:'<p>«المحرك الحثي ثلاثي الأوجه <span class="ltr">Three Phase Induction Motor</span> يتركب من عضوين رئيسين كأي محرك آخر: هما <b>العضو الثابت Stator</b> و<b>العضو الدوار Rotor</b>، انظر الشكل (1-1).»</p>'},
  {fig:'(1-1)',ref:'ص 11',caption:'مقطع في محرك حثي — في الكتاب صورة فوتوغرافية لمحرك مقطوع. هنا رسم مبسط لمقطع طولي يبين العضو الثابت (الشرائح والملفات) والعضو الدوار والعمود. افتح تبويب «المختبر» لتضغط على كل جزء.',draw:()=>box(motorSectionSVG({type:'cage'}),640)},
  {h:'العضو الثابت',ref:'ص 11–12',html:`<p>«يتكون العضو الثابت من <b>شرائح متراصة من الحديد المغناطيسي</b> يتراوح سمكها <b>من 0.3 مم إلى 0.6 مم</b> حسب حجم المحرك، ومعزولة عن بعضها بعازل كهربائي بحيث تكون مع بعضها جسماً أسطوانياً محفوراً بداخله عدد من المجاري وذلك لتركيب الملفات، انظر الشكل (1-2).»</p>
   <p>«الهدف من تصنيع العضو الثابت بهذه الطريقة هو <b>تقليل حرارة الحديد الناتجة عن التيارات الدوامية</b> التي تتكون بسبب تعرض الحديد للمجال المغناطيسي المتغير داخل المحرك، كما أنه يوجد في المحركات الكبيرة عادةً فتحات تهوية بين الشرائح في العضو الثابت.»</p>`},
  {fig:'(1-2)',ref:'ص 11',caption:'شريحة عضو ثابت: حلقة من الحديد على محيطها الداخلي مجارٍ موزعة بانتظام (حوالي 24 مجرى)، وفي داخلها مكان العضو الدوار (Rotor)',draw:()=>box(lamSVG('stator'),300)},
  {widget:(el)=>{let solid=0,t=0.5;const draw=()=>{const rel=solid?Math.pow(20/0.5,2):Math.pow(t/0.5,2);
    el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">لماذا شرائح؟ التيارات الدوامية <span class="sub">(توضيح للمتدرب — ليس من الكتاب، أرقام توضيحية)</span></h3>
     <div class="im-row">${segHTML('ed',[[0,'شرائح معزولة'],[1,'قلب مصمت']],solid)}</div>
     ${solid?'':sl('edt','سمك الشريحة',0.3,0.6,0.05,t)}
     ${box(eddySVG(solid,t),520)}
     <div class="facts"><div class="fact"><span>حرارة التيارات الدوامية (نسبة إلى شريحة 0.5 مم)</span><b>${solid?'≈ '+fm(rel,0)+' ×':fm(rel,2)+' ×'}</b></div></div>
     <p class="sub">المجال المتغير يولد في الحديد تيارات دائرية (دوامات). العازل بين الشرائح يقطع طريقها فتصبح صغيرة جداً. التقريب المستعمل: حرارة الدوامات تتناسب مع مربع السمك، والقلب المصمت مأخوذ كقطعة واحدة سمكها <span class="ltr">20 mm</span>.</p></figure>`;
    el.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>{solid=+b.dataset.ed;draw()});const r=el.querySelector('#edt');if(r){el.querySelector('#edt-v').textContent=fm(t,2)+' mm';r.oninput=e=>{t=+e.target.value;draw()}}};draw()}},
  {html:'<p>«بعد اكتمال تصنيع العضو الثابت يتم تقسيمه إلى العدد المطلوب من الأقطاب وتقسم المجاري تحت كل قطب على الأوجه الثلاثة ثم بعد ذلك يتم تركيب ملفات كل وجه في المجاري الخاصة بها تحت كل قطب بحيث <b>يفصل بين كل وجه وآخر 120° كهربائية</b> وفي نهاية عملية اللف يكون قد تم تركيب ثلاثة ملفات في العضو الثابت لكل ملف طرفان.» «من خلال هذه <b>الأطراف الستة</b> يتم تغذية العضو الثابت بعد توصيلها إما على شكل <b>نجمة أو دلتا</b>، انظر الشكل (1-3).» <span class="ref">ص 11–12</span></p>'},
  {fig:'(1-3)',ref:'ص 12',caption:'عضو ثابت مكتمل لمحرك صغير — في الكتاب صورة لهيكل بداخله الملفات النحاسية في المجاري وتخرج أسلاك الأطراف من الجانب. هنا رسم مبسط (ألوان الأوجه الثلاثة توضيحية).',draw:()=>box(statorDoneSVG(),300)},
  {widget:(el)=>{let c='star';const draw=()=>{el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">الأطراف الستة: نجمة أو دلتا <span class="sub">(توضيح للمتدرب — ترتيب لوحة الأطراف ليس من الكتاب، والحروف A و A' … من الشكل 1-7)</span></h3>
     <div class="im-row">${segHTML('sd',[['star','نجمة Y'],['delta','دلتا Δ']],c)}</div>${box(starDeltaSVG(c),560)}
     <p class="sub">لكل ملف بداية ونهاية: الملف الأول A–A' والثاني B–B' والثالث C–C'. في <b>النجمة</b> نقصر النهايات الثلاث معاً ونغذي البدايات. في <b>الدلتا</b> نصل نهاية كل ملف ببداية التالي فتتكون حلقة مغلقة، ونغذي نقاط الاتصال الثلاث.</p></figure>`;
    el.querySelectorAll('[data-sd]').forEach(b=>b.onclick=()=>{c=b.dataset.sd;draw()})};draw()}},
  {h:'العضو الدوار',ref:'ص 12',html:'<p>«يوجد منه نوعان مختلفان في التركيب ومتقاربان في الخواص الكهربائية، ويسمى المحرك عادةً باسم عضوه الدوار للتمييز بين نوعيه وهما: <b>العضو الدوار الملفوف أو ذو حلقات الانزلاق</b> و<b>العضو الدوار ذو القفص السنجابي</b>.»</p>'},
  {h:'العضو الدوار الملفوف (ذو حلقات الانزلاق)',ref:'ص 12–13',html:`<p>«العضو الدوار الملفوف <span class="ltr">Wound Rotor</span> يتركب من شرائح متراصة من الحديد المغناطيسي معزولة عن بعضها البعض مركبة على عمود المحرك ومحفور عليها عدد من المجاري لتركيب الملفات، انظر الشكل (1-4).»</p>
   <p>«يقسم العضو الدوار إلى عدد من الأقطاب <b>مساوٍ لأقطاب العضو الثابت</b> الذي سيركب فيه وتقسم المجاري في كل قطب إلى ثلاثة أقسام كل قسم يركب فيه ملفات أحد الأوجه الثلاثة بحيث يكون بين كل وجه وآخر 120° كهربائية، عادةً هذه الملفات الثلاثة <b>توصل على شكل نجمة</b> حيث تقصر ثلاثة أطراف مع بعضها البعض داخل العضو الدوار بينما الثلاثة الأخرى يتم توصيلها إلى <b>ثلاث حلقات انزلاق Slip Rings</b> مركبة على نفس العمود.»</p>
   <p>«من خلال حلقات الانزلاق وعن طريق <b>فرش كربونية</b> مماسة لحلقات الانزلاق أثناء الدوران يتم توصيل ملفات العضو الدوار إلى خارج المحرك على التوالي مع <b>مقاومات خارجية متغيرة</b> وذلك من أجل التحكم في بدء دوران المحرك أو في تنظيم سرعته، لذلك فإن هذا النوع من المحركات يتميز بإمكانية تغيير خواص تشغيله على نطاق واسع عن طريق توصيل ملفات العضو الدوار بدائرة خارجية، انظر الشكل (1-5).»</p>`},
  {fig:'(1-4)',ref:'ص 13',caption:'شريحة العضو الدوار: مجارٍ كثيرة على المحيط الخارجي (حوالي 36) ملونة بألوان متعاقبة دلالة على توزيع ملفات الأوجه',draw:()=>box(lamSVG('rotor'),300)},
  {fig:'(1-5)',ref:'ص 13',caption:'عضو دوار ملفوف (ذو حلقات الانزلاق): ثلاثة ملفات Rotor Winding موصلة نجمة، وأطرافها الأخرى إلى ثلاث حلقات Slip Rings، ومن كل حلقة عبر فرشاة إلى مقاومة متغيرة Starting Resistance (المقاومات الثلاث موصلة نجمة). في الكتاب بجانبه صورة لعضو دوار ملفوف.',draw:()=>box(woundSchemSVG(50),540)},
  {h:'العضو الدوار ذو القفص السنجابي',ref:'ص 14',html:`<p>«العضو الدوار ذو القفص السنجابي <span class="ltr">Squirrel cage</span> مشابه تماماً للعضو الدوار ذو حلقات الانزلاق من حيث التركيب الميكانيكي ولكن بدلاً من وضع ملفات في المجاري فإنه توضع <b>قضبان من النحاس أو الألمنيوم</b> وهذه القضبان مقصورة أطرافها مع بعض من الجهتين <b>بحلقتين من نفس مادة القضبان</b>.»</p>
   <p>«هذا النوع <b>لا يقسم إلى عدد معين من الأقطاب</b> وإنما يستطيع التكيف تلقائياً مع عدد الأقطاب والأوجه للعضو الثابت الذي سيركب فيه.» «وحيث إنه لا يوجد به حلقات انزلاق فإنه <b>لا يمكن توصيله بدائرة خارجية</b> وبالتالي لا يمكن تغيير خواص تشغيل هذا المحرك أو التحكم في سرعته. انظر الشكلين (1-6a) و(1-6b).»</p>`},
  {fig:'(1-6a)',ref:'ص 14',caption:'عضو دوار ذو القفص السنجابي: قلب من الشرائح على عمود، تظهر على سطحه خطوط القضبان المائلة قليلاً (في الكتاب صورة)',draw:()=>box(cageSVG(true),520)},
  {fig:'(1-6b)',ref:'ص 14',caption:'قضبان القفص السنجابي: حلقتان نحاسيتان في الطرفين تصل بينهما القضبان النحاسية على شكل قفص',draw:()=>box(cageSVG(false),520)},
  {h:'مقارنة بين نوعي العضو الدوار',ref:'ص 12–14',html:`<table class="tt"><thead><tr><th>البند</th><th>الملفوف (حلقات انزلاق)</th><th>القفص السنجابي</th></tr></thead><tbody>
   <tr><td>الموصلات في المجاري</td><td>ملفات ثلاثية الأوجه بينها 120° كهربائية</td><td>قضبان نحاس أو ألمنيوم</td></tr>
   <tr><td>عدد الأقطاب</td><td>مساوٍ لأقطاب العضو الثابت</td><td>لا يقسم إلى أقطاب، يتكيف تلقائياً</td></tr>
   <tr><td>طريقة القصر</td><td>نجمة داخل الدوار + حلقات انزلاق وفرش</td><td>حلقتان من نفس مادة القضبان</td></tr>
   <tr><td>توصيله بدائرة خارجية</td><td>ممكن (مقاومات متغيرة على التوالي)</td><td>غير ممكن</td></tr>
   <tr><td>تغيير خواص التشغيل / التحكم في السرعة</td><td>ممكن على نطاق واسع</td><td>غير ممكن</td></tr></tbody></table>`}
 ],
 lab:(el)=>{
  let type='wound',hi='',hide=0,rext=40,spin=0,ang=0;const seen=new Set();
  el.innerHTML=`<div class="grid im-lab">
   <div class="panel c12"><h2>فكّك المحرك <small>مبنية على الشكل (1-1) ص 11 والأشكال (1-5) و(1-6b) ص 13–14</small></h2>
    <div class="im-row"><div><div class="sub">نوع العضو الدوار</div>${segHTML('rt',[['wound','ملفوف (حلقات انزلاق)'],['cage','قفص سنجابي']],type)}</div>
     <div id="l1hideB">${swHTML('l1hide','القلب','إخفاء قلب الدوار لرؤية القفص',0)}</div><div id="l1spinB">${swHTML('l1spin','الدوران','حرّك القفص',0)}</div></div>
    <div class="svgbox" id="l1sec" style="max-width:860px;margin-inline:auto"></div>
    <p class="sub">اضغط على أي جزء في الرسم أو على اسمه تحت الرسم. (الرسم مبسط؛ الإطار الخارجي الرمادي ليس من أجزاء الكتاب.)</p>
    <div class="im-parts" id="l1parts"></div><div id="l1info"></div></div>
   <div class="panel c7"><h2 id="l1h2"></h2><div class="svgbox" id="l1fig" style="max-width:560px;margin-inline:auto"></div><div id="l1ctl"></div></div>
   <div class="panel c5"><h2>المقارنة الآن</h2><div class="facts" id="l1facts"></div><p class="sub" id="l1seen"></p></div>
   <div class="panel c12">${tryList(['اختر «ملفوف» واضغط على <b>حلقات الانزلاق</b> ثم <b>الفرش</b> ثم <b>المقاومات الخارجية</b>: هذا هو الطريق الذي يصل ملفات الدوار بالخارج.','حرّك منزلق المقاومة الخارجية: يتحرك المنزلق على المقاومات الثلاث معاً (الكتاب: للتحكم في بدء الدوران أو تنظيم السرعة).','اختر «قفص سنجابي» وشغّل «إخفاء القلب»: يظهر القفص كما في الشكل (1-6b): قضبان وحلقتان.','اضغط على <b>العضو الثابت</b> ثم <b>الشرائح المعزولة</b>: لماذا لا يصنع من حديد مصمت؟ (راجع رسم التيارات الدوامية في الشرح).'])}</div></div>`;
  const $=s=>el.querySelector(s);
  const parts=()=>PARTS1.filter(p=>!p.only||p.only===type);
  const draw=()=>{
   $('#l1sec').innerHTML=motorSectionSVG({type,hi:(PARTS1.find(p=>p.k===hi)||{}).g,hide,rext,ang});
   $('#l1hideB').style.display=type==='cage'?'':'none';$('#l1spinB').style.display=type==='cage'?'':'none';
   $('#l1parts').innerHTML=parts().map(p=>`<button class="btn" data-pk="${p.k}" aria-pressed="${p.k===hi}">${p.n}</button>`).join('');
   const p=PARTS1.find(x=>x.k===hi);$('#l1info').innerHTML=p?`<div class="callout"><b>${p.n}:</b> ${p.d}</div>`:'<div class="callout">اختر جزءاً لتقرأ وصفه من الكتاب.</div>';
   if(type==='wound'){$('#l1h2').innerHTML='الدوار الملفوف ودائرته الخارجية <small>الشكل (1-5) ص 13</small>';$('#l1fig').innerHTML=woundSchemSVG(rext);}
   else{$('#l1h2').innerHTML='قضبان القفص السنجابي <small>الشكل (1-6b) ص 14</small>';$('#l1fig').innerHTML=cageSVG(!hide);}
   const tot=parts().length,sn=parts().filter(p=>seen.has(p.k)).length;$('#l1seen').textContent=`تعرفت على ${sn} من ${tot} أجزاء في هذا النوع.`;
   $('#l1facts').innerHTML=(type==='wound'?[['الموصلات','ملفات 3 أوجه'],['التوصيل بدائرة خارجية','ممكن'],['تغيير خواص التشغيل','ممكن'],['المقاومة الخارجية الموصلة',rext+' %']]:[['الموصلات','قضبان نحاس/ألمنيوم'],['التوصيل بدائرة خارجية','غير ممكن'],['تغيير خواص التشغيل','غير ممكن'],['عدد الأقطاب','يتكيف تلقائياً']]).map(([a,b])=>`<div class="fact"><span>${a}</span><b style="font-family:var(--font);font-size:15px">${b}</b></div>`).join('');
  };
  const ctl=()=>{$('#l1ctl').innerHTML=type==='wound'?sl('l1rx','موضع منزلق المقاومات الخارجية (توضيحي — بلا حسابات)',0,100,1,rext)+'<p class="sub">المنزلقات الثلاثة مربوطة معاً، فتتغير مقاومة الأوجه الثلاثة بنفس القدر.</p>':'<p class="sub">لا توجد أطراف خارجة من الدوار: القضبان مقصورة بالحلقتين داخل المحرك نفسه، لذلك لا يمكن إضافة مقاومات.</p>';
   const r=$('#l1rx');if(r){$('#l1rx-v').textContent=rext+' %';r.oninput=e=>{rext=+e.target.value;$('#l1rx-v').textContent=rext+' %';draw()}}};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-pk]');const g=e.target.closest('[data-part]');let k=null;
   if(b)k=b.dataset.pk;else if(g){const gp=g.dataset.part;const c=parts().filter(p=>p.g===gp);k=c.length?(c.find(p=>p.k===hi)?(c[(c.findIndex(p=>p.k===hi)+1)%c.length].k):c[0].k):null}
   if(k){hi=k;seen.add(k);draw()}});
  segBind(el,'rt',v=>{type=v;if(hi&&!parts().find(p=>p.k===hi))hi='';draw();ctl()});
  $('#l1hide').onclick=()=>{hide=hide?0:1;$('#l1hide').setAttribute('aria-pressed',hide?'true':'false');draw()};
  $('#l1spin').onclick=()=>{spin=spin?0:1;$('#l1spin').setAttribute('aria-pressed',spin?'true':'false')};
  draw();ctl();
  loopOn(el,dt=>{if(spin&&type==='cage'){ang+=dt*12;const m=$('#imBarsMove');if(m)m.setAttribute('transform',`translate(0 ${fx(ang%17.2)})`)}});
 },
 quiz:[
  {q:'من اخترع المحرك الحثي ثلاثي الأوجه، ومتى؟',o:['أديسون عام 1879م','نيكولا تسلا عام 1886م','فاراداي عام 1831م','تسلا عام 1900م'],c:1,e:'ص 10: «الذي قام باختراعه نيكولا تسلا عام 1886م».'},
  {q:'كم يبلغ تيار البدء للمحرك الحثي تقريباً؟',o:['مساوٍ لتيار الحمل الكامل','ضعف تيار الحمل الكامل','6–8 أضعاف تيار الحمل الكامل','نصف تيار الحمل الكامل'],c:2,e:'ص 10: «تيار البدء لهذا المحرك عالٍ (6-8 أضعاف تيار الحمل الكامل)».'},
  {q:'أي مما يلي <b>ليس</b> من مزايا المحرك الحثي حسب الكتاب؟',o:['المتانة وبساطة التركيب','قلة الصيانة وانخفاض الثمن','سهولة التحكم في سرعته','لا يحتاج إلى وسيلة إثارة'],c:2,e:'من عيوبه: «ليس من السهل التحكم في سرعته» (ص 10).'},
  {q:'لماذا يصنع العضو الثابت من شرائح معزولة؟',o:['لتقليل وزنه فقط','لتقليل حرارة الحديد الناتجة عن التيارات الدوامية','لزيادة المجال المغناطيسي','لتسهيل اللف فقط'],c:1,e:'ص 11.'},
  {q:'سمك شرائح العضو الثابت يتراوح بين:',o:['0.03 و 0.06 مم','0.3 و 0.6 مم','3 و 6 مم','30 و 60 مم'],c:1,e:'ص 11: «من 0.3 مم إلى 0.6 مم حسب حجم المحرك».'},
  {q:'كم طرفاً يخرج من ملفات العضو الثابت، وكيف توصل؟',o:['ثلاثة أطراف نجمة فقط','ستة أطراف نجمة أو دلتا','أربعة أطراف','ستة أطراف دلتا فقط'],c:1,e:'ص 11: «من خلال هذه الأطراف الستة … إما على شكل نجمة أو دلتا».'},
  {q:'ما فائدة حلقات الانزلاق والفرش في الدوار الملفوف؟',o:['تبريد المحرك','توصيل ملفات الدوار بمقاومات خارجية للتحكم في البدء أو تنظيم السرعة','تغذية العضو الثابت','تقليل التيارات الدوامية'],c:1,e:'ص 13.'},
  {q:'لماذا لا يمكن التحكم في سرعة محرك القفص السنجابي بمقاومات خارجية؟',o:['لأن قضبانه من الألمنيوم','لأنه لا توجد به حلقات انزلاق فلا يمكن توصيله بدائرة خارجية','لأن عدد أقطابه ثابت','لأنه صغير القدرة'],c:1,e:'ص 14.'}
 ]
});


/* ======================================================================
   Lesson 2 — rotating magnetic field (الشكل 1-7 + رسم الموجات ص 15)
   ====================================================================== */
/* slot positions of الشكل (1-7) clockwise from 12 o'clock: label, clock angle, phase, side (+1 start / -1 return) */
const SLOTS=[['A',0,'a',1],["C'",60,'c',-1],['B',120,'b',1],["A'",180,'a',-1],['C',240,'c',1],["B'",300,'b',-1]];
const IM=10;
function phaseCur(th,rev){const a=IM*Math.cos(th*D),b=IM*Math.cos((th-120)*D),c=IM*Math.cos((th-240)*D);return rev?{a,b:c,c:b}:{a,b,c}}
const sgnTxt=v=>Math.abs(v)<0.05?'0':v>0?'+':'−';
/* resultant (2-pole): Σ s·u(clock) rotated 90° counter-clockwise on screen. returns {x,y} with y up */
function fieldVec(cur){let x=0,y=0;SLOTS.forEach(([l,c,ph,sd])=>{const v=cur[ph]*sd;x+=v*Math.sin(c*D);y+=v*Math.cos(c*D)});return {x:-y,y:x}}
/* the book's table of الشكل (1-7) */
const T17=[[0,'الأولى','صفر','+','+','−','−','−','+','أفقي نحو اليسار'],[60,'الثانية','60°','+','+','+','−','−','−','نحو أعلى اليسار'],[120,'الثالثة','120°','−','+','+','+','−','−','نحو أعلى اليمين'],[180,'الرابعة','180°','−','−','+','+','+','−','أفقي نحو اليمين'],
 [240,'الخامسة','240°','−','−','−','+','+','+','نحو أسفل اليمين'],[300,'السادسة','300°','+','−','−','−','+','+','نحو أسفل اليسار'],[360,'السابعة','360°','+','+','−','−','−','+','أفقي نحو اليسار (مثل الأولى)'],[420,'الثامنة','420°','+','+','+','−','−','−','مثل الثانية']];
function t17HTML(cur){const sp=v=>`<span class="${v==='+'?'im-sgn-p':'im-sgn-m'}">${v}</span>`;
  return `<div class="im-tbl"><table class="tt"><thead><tr><th>اللحظة</th><th>θ</th><th>A</th><th>C'</th><th>B</th><th>A'</th><th>C</th><th>B'</th><th>اتجاه المحصلة</th></tr></thead><tbody>${T17.map(r=>`<tr class="${cur===r[0]?'cur':''}"><td>${r[1]}</td><td><span class="ltr">${r[2]}</span></td>${r.slice(3,9).map(sp).join('')
   .replace(/<span/g,'<td><span').replace(/<\/span>/g,'</span></td>')}<td>${r[9]}</td></tr>`).join('')}</tbody></table></div>`}
/* ring of الشكل (1-7): o={size,rev,label} */
function ringSVG(th,o){o=o||{};const cur=phaseCur(th,o.rev),cx=110,cy=110,R=84,r0=60;let s=`<svg viewBox="0 0 220 ${o.label?246:220}" role="img" aria-label="المجال الدوار عند θ = ${fm(th,0)}°">`;
  // sectors coloured by sign (book: + blue, − yellow)
  SLOTS.forEach(([l,c,ph,sd])=>{const v=cur[ph]*sd,a0=(c-30-90)*D,a1=(c+30-90)*D;const col=Math.abs(v)<0.05?'--surface-2':v>0?'--blue-soft':'--live-soft';
    s+=`<path d="M${fx(cx+R*Math.cos(a0))} ${fx(cy+R*Math.sin(a0))}A${R} ${R} 0 0 1 ${fx(cx+R*Math.cos(a1))} ${fx(cy+R*Math.sin(a1))}L${fx(cx+r0*Math.cos(a1))} ${fx(cy+r0*Math.sin(a1))}A${r0} ${r0} 0 0 0 ${fx(cx+r0*Math.cos(a0))} ${fx(cy+r0*Math.sin(a0))}Z" fill="var(${col})"/>`});
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${r0}" fill="none" stroke="var(--fg)" stroke-width="1.2"/>`;
  SLOTS.forEach(([l,c,ph,sd])=>{const v=cur[ph]*sd,a=(c-90)*D,x=cx+72*Math.cos(a),y=cy+72*Math.sin(a),xl=cx+100*Math.cos(a),yl=cy+100*Math.sin(a);const t=sgnTxt(v);
    s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="10" fill="var(--surface)" stroke="var(${t==='+'?'--blue':t==='−'?'--live':'--muted'})" stroke-width="2.4"/>`+S.t(fx(x),fx(y+4.5),t,'',null,15)+S.t(fx(xl),fx(yl+4),l,'b',null,13)});
  const v=fieldVec(cur),m=Math.hypot(v.x,v.y),L=48;if(m>0.5){const ux=v.x/m,uy=-v.y/m;s+=arrow(cx-ux*L,cy-uy*L,cx+ux*L,cy+uy*L,'--stop',4)}
  if(o.label)s+=arT(cx,238,o.label,{fs:13});
  return s+'</svg>'}
/* current waveforms (no figure number in the book, ص 15) */
function wavesSVG(th,rev,o){o=o||{};const pts=k=>{const p=[];for(let x=0;x<=420;x+=5){const c=phaseCur(x,rev);p.push([x,c[k]])}return p};
  return plotSVG({w:620,h:o.h||250,x0:0,x1:420,y0:-11,y1:11,xt:[0,60,120,180,240,300,360,420],yt:[-10,-5,0,5,10],xl:'angle θ (degrees)',yl:'I',aria:'التيارات اللحظية في الأوجه الثلاثة',cid:'imwv',
   series:[{pts:pts('a'),col:'--blue',w:2.6},{pts:pts('b'),col:'--live',w:2.6},{pts:pts('c'),col:'--stop',w:2.6}],
   extra:(X,Y)=>{let s='';[0,60,120,180,240,300,360,420].forEach((x,i)=>{s+=`<circle cx="${fx(X(x))}" cy="22" r="8" fill="var(--surface)" stroke="var(--muted)"/>`+S.t(fx(X(x)),26,String(i+1),'m')});
    s+=S.t(X(14),Y(7.4),'Ia','b','start')+`<text class="txt" x="${fx(X(134))}" y="${fx(Y(7.4))}" style="fill:var(--live)">${rev?'Ic':'Ib'}</text><text class="txt" x="${fx(X(254))}" y="${fx(Y(7.4))}" style="fill:var(--stop)">${rev?'Ib':'Ic'}</text>`;
    if(th!=null){const c=phaseCur(th,rev);s+=`<path d="M${fx(X(th))} 14V${fx(Y(-11))}" stroke="var(--fg)" stroke-width="2"/>`;[['a','--blue'],['b','--live'],['c','--stop']].forEach(([k,col])=>{s+=`<circle cx="${fx(X(th))}" cy="${fx(Y(c[k]))}" r="5" fill="var(${col})" stroke="var(--surface)" stroke-width="1.5"/>`})}
    return s}})}
/* generalisation to p poles (illustration): 3p slot positions, N/S markers */
function ringPSVG(th,p,rev){const pp=p/2,cur=phaseCur(th,rev),cx=130,cy=130,R=100;let s=`<svg viewBox="0 0 260 260" role="img" aria-label="المجال في آلة ذات ${p} أقطاب">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${R-26}" fill="none" stroke="var(--line)"/>`;
  const n=6*pp;for(let j=0;j<n;j++){const [l,c,ph,sd]=SLOTS[j%6];const v=cur[ph]*sd,ma=(j*360/n-90)*D,x=cx+(R-13)*Math.cos(ma),y=cy+(R-13)*Math.sin(ma);const t=sgnTxt(v);
    s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="${p>4?6:8}" fill="var(${t==='+'?'--blue-soft':t==='−'?'--live-soft':'--surface-2'})" stroke="var(${t==='+'?'--blue':t==='−'?'--live':'--muted'})" stroke-width="1.6"/>`;if(p<=4)s+=S.t(fx(cx+(R+12)*Math.cos(ma)),fx(cy+(R+12)*Math.sin(ma)+4),l,'m',null,10)}
  const v=fieldVec(cur);const ae=Math.atan2(v.x,v.y)/D;   // electrical clock angle of the arrow head (N)
  for(let k=0;k<pp;k++){[[ae,'N','--stop'],[ae+180,'S','--muted']].forEach(([e,t,col])=>{const ma=((e+360*k)/pp-90)*D,x=cx+50*Math.cos(ma),y=cy+50*Math.sin(ma);
    if(t==='N')s+=arrow(cx+20*Math.cos(ma),cy+20*Math.sin(ma),cx+62*Math.cos(ma),cy+62*Math.sin(ma),col,2.6);s+=`<circle cx="${fx(x+18*Math.cos(ma))}" cy="${fx(y+18*Math.sin(ma))}" r="9" fill="var(--surface)" stroke="var(${col})" stroke-width="1.8"/>`+S.t(fx(x+18*Math.cos(ma)),fx(y+18*Math.sin(ma)+4),t,'',null,11)})}
  return s+'</svg>'}

B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'14–17',
 title:'المجال المغناطيسي الدوار والسرعة التزامنية',
 summary:'ثلاثة ملفات بينها 120° تغذيها ثلاثة تيارات بينها 120° فينشأ في الثغرة الهوائية مجال مغناطيسي دوار منتظم يدور بالسرعة التزامنية ns = 120 fs / p. نتتبع الشكل (1-7) لحظة بلحظة، ونرى كيف يعكس تبديل طرفين اتجاه الدوران.',
 theory:[
  {h:'المجال المغناطيسي الدوار',ref:'ص 14',html:`<p>«حيث إن ملفات العضو الثابت موصلة إما على شكل نجمة أو دلتا ويوجد بين كل ملف وآخر <b>زاوية فراغية قدرها 120°</b> فإنه عند توصيل هذه الملفات بمصدر جهد متردد ثلاثي الأوجه بين كل وجه وآخر 120° فإنه سيمر في هذه الملفات <b>تيارات متزنة بين كل تيار وآخر 120°</b>، ونتيجة لمرور هذه التيارات بهذه الصفة في تلك الملفات التي يفصل بين كل ملف وآخر زاوية قدرها 120° فإنه سينشأ في الثغرة الهوائية <b>مجال مغناطيسي دوار منتظم</b>، انظر الشكل (1-7).»</p>
   <p>«هذا المجال المغناطيسي يدور بسرعة تسمى <b>السرعة التزامنية Synchronous speed</b> وتحسب من المعادلة التالية:»</p>
   $$n_s=\\frac{120\\,f_s}{p} \\qquad (1\\text{-}1)$$
   <p>حيث: \\(n_s\\): السرعة التزامنية. \\(f_s\\): تردد تيار العضو الثابت. \\(p\\): عدد أقطاب الآلة.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب لا يذكر الوحدات عند المعادلة، وتستعمل الأمثلة \\(n_s\\) بالدورة في الدقيقة <span class="ltr">(rpm)</span> و \\(f_s\\) بالهرتز <span class="ltr">(Hz)</span>. الرقم 120 يأتي من 60 ثانية في الدقيقة × 2 (كل زوج من الأقطاب يحتاج دورة تيار كاملة ليدور المجال دورة واحدة). جدول من المعادلة (1-1): <table class="tt"><thead><tr><th>p</th><th>عند 50 Hz</th><th>عند 60 Hz</th></tr></thead><tbody><tr><td>2</td><td>3000 rpm</td><td>3600 rpm</td></tr><tr><td>4</td><td>1500 rpm</td><td>1800 rpm</td></tr><tr><td>6</td><td>1000 rpm</td><td>1200 rpm</td></tr><tr><td>8</td><td>750 rpm</td><td>900 rpm</td></tr></tbody></table>'},
  {fig:'(بلا رقم)',ref:'ص 15',caption:'التيارات اللحظية في الأوجه الثلاثة لمحرك حثي ثلاثي الأوجه: Ia قمتها عند 0° و Ib عند 120° و Ic عند 240° (القمة 10)، والخطوط ① … ⑦ هي لحظات الشكل (1-7). أضفنا اللحظة ⑧ عند 420°.',draw:()=>box(wavesSVG(null,0),640)},
  {err:'رسم الموجات في ص 15 <b>بلا رقم شكل</b>، والقيم السالبة على محوره الرأسي طُبعت «5» و«10» بلا إشارة السالب (الصحيح −5 و −10). رسمناها هنا بالإشارة الصحيحة.'},
  {html:`<p><b>قيم مقروءة من الرسم</b> (ص 15):</p><table class="tt"><thead><tr><th>θ</th><th>Ia</th><th>Ib</th><th>Ic</th></tr></thead><tbody>
   <tr><td>0°</td><td>+10</td><td>−5</td><td>−5</td></tr><tr><td>60°</td><td>+5</td><td>+5</td><td>−10</td></tr><tr><td>120°</td><td>−5</td><td>+10</td><td>−5</td></tr><tr><td>180°</td><td>−10</td><td>+5</td><td>+5</td></tr><tr><td>240°</td><td>−5</td><td>−5</td><td>+10</td></tr><tr><td>300°</td><td>+5</td><td>−10</td><td>+5</td></tr></tbody></table>`},
  {fig:'(1-7)',ref:'ص 15–16',caption:'رسم توضيحي للمجال المغناطيسي الدوار في محرك ذو قطبين: ثماني لحظات. المواضع مع عقارب الساعة A ثم C\' ثم B ثم A\' ثم C ثم B\'. النصف ذو الإشارة + ملون (في الكتاب أزرق) والنصف − ملون (في الكتاب أصفر)، والسهم الأحمر اتجاه محصلة المجال.',
   draw:()=>`<div class="im-figs">${T17.map(r=>`<figure>${ringSVG(r[0],{label:'اللحظة '+r[1]+' ('+r[2]+')'})}</figure>`).join('')}</div>`},
  {html:`<p><b>جدول الشكل (1-7):</b></p>${t17HTML(null)}`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف نقرأ الإشارات؟</b> كل ملف له جانبان متقابلان: A و A\' للوجه الأول، B و B\' للثاني، C و C\' للثالث. عندما يكون تيار الوجه موجباً نكتب + على بدايته (A مثلاً) و − على نهايته (A\')، والعكس عندما يكون سالباً. قارن العمود A في الجدول بإشارة Ia في رسم الموجات: عند 0° التيار <span class="ltr">Ia = +10</span> فإشارة A هي + و A\' هي −. الموصلات ذات الإشارة + تجتمع في نصف الدائرة والموصلات − في النصف الآخر، والمجال يمر عمودياً على الخط الفاصل بين النصفين.'},
  {h:'ماذا نلاحظ؟',ref:'ص 17',html:`<p>«يتضح من تتبع اتجاه محصلة المجال الناتج عن الأوجه الثلاثة للمحرك، نتيجة لمرور التيارات اللحظية ثلاثية الأوجه بملفات العضو الثابت، عند اللحظات المتتالية المبينة في الشكل (1-7) أن <b>المجال يدور 60° في الفراغ كلما مرت لحظة زمنية معينة</b>، ويكتمل دوران المجال <b>360° كل دورة كاملة للتيار</b>.»</p>
   <p>«يلاحظ أنه <b>إذا تم عكس طرفين من بين الأطراف الثلاثة فإن اتجاه المجال سيتغير</b> وبالتالي يمكن عكس اتجاه دوران المحرك.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الشكل (1-7) لمحرك ذي قطبين، فيه يدور المجال دورة كاملة مع كل دورة للتيار: عند <span class="ltr">50 Hz</span> خمسون دورة في الثانية = <span class="ltr">3000 rpm</span> وهو ما تعطيه المعادلة (1-1) لـ <span class="ltr">p = 2</span>. في محرك ذي أربعة أقطاب تتكرر المواضع الستة مرتين حول الدائرة، فيقطع المجال نصف دورة فقط مع كل دورة تيار. جرّب ذلك في تبويب «المختبر».'}
 ],
 lab:(el)=>{
  let th=0,play=0,rev=0,f=50,p=2,elapsed=0;const vis=new Set();let maxTh=0,revTurn=0;
  el.innerHTML=`<div class="grid im-lab">
   <div class="panel c12"><h2>التيارات اللحظية <small>رسم الموجات ص 15 (بلا رقم في الكتاب)</small></h2><div class="svgbox" id="l2w" style="max-width:760px;margin-inline:auto"></div>
    ${sl('l2t','الزاوية الكهربائية θ (الزمن)',0,420,1,0)}
    <div class="im-row"><button class="btn primary" id="l2play">▶ تشغيل</button><span class="sub">لحظات الشكل (1-7):</span>${[0,60,120,180,240,300,360,420].map((x,i)=>`<button class="btn" data-ins="${x}">${'①②③④⑤⑥⑦⑧'[i]}</button>`).join('')}</div>
    <div class="facts">${fact('Ia','l2ia')}${fact(`Ib (الملف B)`,'l2ib')}${fact('Ic (الملف C)','l2ic')}${fact('اتجاه المحصلة (بلغة الساعة)','l2dir')}</div></div>
   <div class="panel c6"><h2>الشكل (1-7) حياً <small>محرك ذو قطبين ص 15–16</small></h2><div class="svgbox" id="l2r" style="max-width:330px;margin-inline:auto"></div>
    <div class="im-row">${swHTML('l2rev','اعكس طرفين','تبديل تغذية الملفين B و C',0)}</div><div id="l2msg"></div></div>
   <div class="panel c6"><h2>السرعة التزامنية <small>المعادلة (1-1) ص 14</small></h2>
    <div class="im-row"><div><div class="sub">تردد المصدر f<sub>s</sub></div>${segHTML('f',[[50,'50 Hz'],[60,'60 Hz']],f)}</div><div><div class="sub">عدد الأقطاب p</div>${segHTML('p',[[2,'2'],[4,'4'],[6,'6'],[8,'8']],p)}</div></div>
    <div id="l2ns"></div>
    <div class="svgbox" id="l2rp" style="max-width:260px;margin-inline:auto"></div>
    <p class="sub"><b>توضيح للمتدرب (ليس من الكتاب):</b> تعميم الشكل (1-7) لعدد p من الأقطاب: المواضع الستة تتكرر p/2 مرة، و N و S أقطاب المجال. العرض مبطأ: دورة التيار الواحدة تأخذ 4 ثوانٍ هنا بدلاً من <span class="ltr" id="l2T"></span>.</p></div>
   <div class="panel c12"><h2>جدول الشكل (1-7) <small>الصف الملون = اللحظة الحالية</small></h2><div id="l2tbl"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const clock=v=>{const a=((Math.atan2(v.x,v.y)/D)%360+360)%360;let h=Math.round(a/30)%12;return (h===0?12:h)};
  const draw=()=>{$('#l2t').value=th;$('#l2t-v').textContent=fm(th,0)+'°';const c=phaseCur(th,rev);
   $('#l2w').innerHTML=wavesSVG(th,rev);$('#l2r').innerHTML=ringSVG(th,{rev});$('#l2rp').innerHTML=ringPSVG(th,p,rev);
   $('#l2ia').textContent=fm(c.a,2);$('#l2ib').textContent=fm(c.b,2);$('#l2ic').textContent=fm(c.c,2);
   const v=fieldVec(c);$('#l2dir').textContent='الساعة '+clock(v);
   const ins=T17.find(r=>Math.abs(r[0]-th)<0.5);$('#l2tbl').innerHTML=t17HTML(ins&&!rev?ins[0]:null);
   $('#l2msg').innerHTML=rev?'<div class="callout err">عكسنا طرفين: الملف B يأخذ الآن تيار الوجه الثالث، والملف C تيار الوجه الثاني. شغّل وراقب: السهم يدور <b>عكس</b> عقارب الساعة (ص 17). (الجدول الملون يخص التوصيل الأصلي فقط.)</div>':(ins?`<div class="callout">اللحظة ${ins[1]} (${ins[2]}): الإشارات والسهم مطابقة للكتاب — المحصلة ${ins[9]}.</div>`:'<div class="callout">بين لحظتين من لحظات الكتاب: السهم يدور بانتظام، ولا يقفز.</div>');
   const ns=120*f/p;$('#l2ns').innerHTML=`<div class="ex-f">${B.tex(`n_s=\\frac{120\\,f_s}{p}=\\frac{120\\times ${f}}{${p}}=${fm(ns,0)}\\ \\text{rpm}`,true)}</div><div class="facts"><div class="fact"><span>دوران المجال في كل دورة تيار</span><b>${fm(720/p,0)}°</b></div><div class="fact"><span>دورات المجال في الثانية</span><b>${fm(ns/60,2)}</b></div></div>`;
   $('#l2T').textContent=fm(1000/f,2)+' ms';};
  $('#l2t').oninput=e=>{th=+e.target.value;play=0;$('#l2play').textContent='▶ تشغيل';draw()};
  el.querySelectorAll('[data-ins]').forEach(b=>b.onclick=()=>{th=+b.dataset.ins;vis.add(th);play=0;$('#l2play').textContent='▶ تشغيل';draw()});
  $('#l2play').onclick=()=>{play=play?0:1;$('#l2play').textContent=play?'⏸ إيقاف':'▶ تشغيل'};
  $('#l2rev').onclick=()=>{rev=rev?0:1;$('#l2rev').setAttribute('aria-pressed',rev?'true':'false');draw()};
  segBind(el,'f',v=>{f=+v;draw()});segBind(el,'p',v=>{p=+v;draw()});
  const steps=stepsUI($('#l2st'),[
   {t:'اللحظة الأولى',x:'اضغط ①. عند θ = 0: <span class="ltr">Ia = +10</span> و <span class="ltr">Ib = Ic = −5</span>. الإشارات A + و C\' + و B − … والسهم أفقي نحو اليسار (ص 15).',done:()=>vis.has(0)},
   {t:'اللحظة الثانية',x:'اضغط ②. زاد الزمن 60° كهربائية، فدار السهم 60° في الفراغ مع عقارب الساعة.',done:()=>vis.has(60)},
   {t:'دورة كاملة',x:'اضغط «تشغيل» واترك θ تكمل دورة كاملة للتيار: يكمل السهم 360° (ص 17).',done:()=>maxTh>=350},
   {t:'اعكس طرفين',x:'شغّل «اعكس طرفين» مع التشغيل: يدور المجال عكس عقارب الساعة، ولهذا ينعكس دوران المحرك.',done:()=>rev&&revTurn>120},
   {t:'أقطاب أكثر',x:'اختر <span class="ltr">p = 4</span>: في الرسم الصغير يقطع المجال نصف دورة فقط لكل دورة تيار، وتنخفض n<sub>s</sub> من 3000 إلى <span class="ltr">1500 rpm</span>.',done:()=>p===4},
   {t:'تردد 60 Hz',x:'اختر <span class="ltr">60 Hz</span>: تزيد السرعة التزامنية بنسبة 60/50 (مثلاً 1800 rpm لأربعة أقطاب).',done:()=>f===60}
  ]);
  draw();
  loopOn(el,dt=>{if(play){th=(th+90*dt);if(th>=360)th-=360;maxTh+= 90*dt;if(rev)revTurn+=90*dt;draw()}steps.check()});
 },
 examples:[
  {title:'حاسبة السرعة التزامنية — المعادلة (1-1)',ref:'ص 14',
   q:'<p>ليست مثالاً من الكتاب: حاسبة للمعادلة (1-1) لتجرّب بها قيماً مختلفة. أول مثال يستعمل المعادلة في الكتاب هو مثال (1-1) في الدرس التالي.</p>',
   given:[{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:50},{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:4,step:2,min:2}],
   solve:(g)=>{const ns=B.round(120*g.f/g.p,2);return [{t:'من المعادلة (1-1):',f:`n_s=\\frac{120\\,f_s}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm',final:true},
    {t:'سرعة المجال بالدورة في الثانية (توضيح):',f:`\\frac{n_s}{60}=\\frac{${fm(ns)}}{60}`,v:B.round(ns/60,3),unit:'rev/s'},
    (g.p%2)?{t:'تنبيه: عدد الأقطاب يجب أن يكون زوجياً (الأقطاب أزواج شمالي وجنوبي).'}:{t:''}]}}
 ],
 quiz:[
  {q:'ما الشرطان اللازمان لنشوء مجال مغناطيسي دوار منتظم حسب الكتاب؟',o:['ملفات بينها 120° فراغية وتيارات متزنة بينها 120°','ملف واحد وتيار مستمر','ملفات بينها 90° وتيار واحد','مغناطيس دائم يدور'],c:0,e:'ص 14.'},
  {q:'محرك ذو 6 أقطاب على مصدر 50 Hz. سرعته التزامنية:',o:['3000 rpm','1500 rpm','1000 rpm','750 rpm'],c:2,e:'\\(n_s = 120 \\times 50 / 6 = 1000\\) rpm.'},
  {q:'في الشكل (1-7) كم يدور المجال في الفراغ بين لحظتين متتاليتين؟',o:['30°','60°','120°','180°'],c:1,e:'ص 17: «المجال يدور 60° في الفراغ كلما مرت لحظة زمنية معينة».'},
  {q:'في محرك ذي قطبين، كم يدور المجال خلال دورة كاملة للتيار؟',o:['90°','180°','360°','720°'],c:2,e:'ص 17: «ويكتمل دوران المجال 360° كل دورة كاملة للتيار».'},
  {q:'عند اللحظة الأولى (θ = 0) في الشكل (1-7)، إشارة الموضع A هي:',o:['+','−','صفر','لا يمكن تحديدها'],c:0,e:'عند 0° يكون Ia = +10 فإشارة A موجبة (جدول الشكل 1-7).'},
  {q:'كيف نعكس اتجاه دوران المحرك الحثي ثلاثي الأوجه؟',o:['بعكس الأطراف الثلاثة كلها','بعكس طرفين من الأطراف الثلاثة','بزيادة التردد','بتقليل الجهد'],c:1,e:'ص 17: «إذا تم عكس طرفين من بين الأطراف الثلاثة فإن اتجاه المجال سيتغير».'},
  {q:'إذا زاد عدد الأقطاب مع ثبات التردد فإن السرعة التزامنية:',o:['تزيد','تقل','لا تتغير','تصبح صفراً'],c:1,e:'من (1-1): p في المقام.'},
  {q:'محرك يعمل على 60 Hz وسرعته التزامنية 1800 rpm. عدد أقطابه:',o:['2','4','6','8'],c:1,e:'\\(p = 120 \\times 60 / 1800 = 4\\).'}
 ]
});


/* ======================================================================
   Lesson 3 — how the motor runs, slip, rotor frequency (ص 17–21)
   ====================================================================== */
/* book procedures (shared with the chapter-1 exercises) */
function solveEx11(g,o){o=o||{};const S=g.S/100,ns=B.round(120*g.f/g.p,2),n=B.round(ns*(1-S),2),fr=B.round(S*g.f,3);return [
  {t:'أ) السرعة التزامنية من المعادلة (1-1):',f:`n_s=\\frac{120\\,f_s}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm',final:true},
  {t:'ب) سرعة العضو الدوار عند الحمل الكامل من المعادلة (1-4):',f:`n=n_s(1-S)=${fm(ns)}\\,(1-${fm(S)})`,v:n,unit:'rpm',final:true},
  {t:'جـ) تردد التيارات في العضو الدوار من المعادلة (1-5):',f:`f_r=S\\,f_s=${fm(S)}\\times ${g.f}`,v:fr,unit:'Hz',final:true}].concat(o.extra||[])}
function solveEx12(g){const ns=B.round(120*g.f/g.p,2),nsl=B.round(ns-g.n,2),S=B.round((ns-g.n)/ns,4);return [
  {t:'تحسب السرعة التزامنية من المعادلة (1-1):',f:`n_s=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
  {t:'سرعة الانزلاق عند الحمل الكامل من المعادلة (1-2):',f:`n_{slip}=n_s-n=${fm(ns)}-${fm(g.n)}`,v:nsl,unit:'rpm',final:true},
  {t:'معامل الانزلاق عند الحمل الكامل من المعادلة (1-3):',f:`S=\\frac{n_s-n}{n_s}=\\frac{${fm(ns)}-${fm(g.n)}}{${fm(ns)}}`,v:S,final:true},
  (S<0||S>1)?{t:'تنبيه: قيمة الانزلاق خارج المدى 0 إلى 1 (ص 18): راجع السرعة المدخلة.'}:{t:''}]}
function solveEx13(g,o){o=o||{};const S=B.round(g.fr/g.f,4),ns=B.round(120*g.f/g.p,2),n=B.round(ns*(1-S),2);return [
  {t:'معامل الانزلاق من المعادلة (1-5):',f:`S=\\frac{f_r}{f_s}=\\frac{${fm(g.fr)}}{${fm(g.f)}}`,v:S,final:true},
  {t:'أولاً: السرعة التزامنية من المعادلة (1-1):',f:`n_s=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
  {t:'ثانياً: سرعة العضو الدوار من المعادلة (1-4):',f:`n=n_s(1-S)=${fm(ns)}\\,(1-${fm(S)})`,v:n,unit:'rpm',final:true}].concat(o.extra?o.extra(g,S,ns):[])}

/* motor view: stator ring + field arrow (angle af) + cage rotor (angle ar); glow 0..1 */
function slipViewSVG(af,ar,glow,o){o=o||{};const cx=130,cy=130;let s=`<svg viewBox="0 0 260 272" role="img" aria-label="المجال الدوار والعضو الدوار">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="118" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="92" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.2"/>`;
  s+=`<g transform="rotate(${fx(ar)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="86" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let i=0;i<16;i++){const a=i*22.5*D,x=cx+74*Math.cos(a),y=cy+74*Math.sin(a);s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="7" fill="var(--live)" opacity="${fx(0.18+0.82*glow)}" stroke="var(--fg)" stroke-width=".8"/>`}
  s+=`<path d="M${cx} ${cy}L${cx} ${cy-60}" stroke="var(--fg)" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/></g>`;
  const a=(af-90)*D;s+=arrow(cx-104*Math.cos(a)*0.0,cy,cx+104*Math.cos(a),cy+104*Math.sin(a),'--stop',4);
  if(o.lbl)s+=S.t(cx,266,o.lbl,'m');
  return s+'</svg>'}

const EX11G=[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:4,step:2},{id:'V',label:'جهد المصدر (لا يدخل في الحل)',sym:'V',unit:'V',value:240},{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:50},{id:'S',label:'الانزلاق عند الحمل الكامل',sym:'S',unit:'%',value:5}];
const EX12G=[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:4,step:2},{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:60},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n',unit:'rpm',value:1740}];
const EX13G=[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:6,step:2},{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:50},{id:'fr',label:'تردد القوة الدافعة في الدوار',sym:'f_r',unit:'Hz',value:2.5}];
const cloneG=(arr,vals)=>arr.map(g=>Object.assign({},g,vals&&vals[g.id]!=null?{value:vals[g.id]}:{}));

B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'17–21',
 title:'كيف يدور المحرك الحثي؟ الانزلاق وتردد تيارات العضو الدوار',
 summary:'المجال الدوار يحث جهداً وتياراً في موصلات الدوار فيتولد عزم يديره، لكن الدوار لا يلحق بالمجال أبداً: الفرق هو سرعة الانزلاق، ونسبته هي معامل الانزلاق S، ومنه سرعة الدوار n = ns(1 − S) وتردد تياراته fr = S·fs. مع الأمثلة (1-1) و(1-2) و(1-3).',
 theory:[
  {h:'كيفية عمل المحرك الحثي ثلاثي الأوجه',ref:'ص 17',html:`<p>«عند توصيل أطراف العضو الثابت بمصدر جهد متردد ثلاثي الأوجه فإنه سينشأ مجال مغناطيسي دوار. هذا المجال المغناطيسي الدوار سيولد <b>قوة دافعة كهربائية ثلاثية الأوجه في موصلات العضو الدوار</b> وذلك طبقاً لظاهرة <b>الحث الكهرومغناطيسي</b>، بما أن موصلات العضو الدوار مقصورة من الطرفين فإنه سيمر فيها تيارات ثلاثية الأوجه بين كل وجه وآخر 120° ومن ثم سيتولد مجال مغناطيسي دوار آخر في الثغرة الهوائية نتيجةً لمرور تلك التيارات.»</p>
   <p>«في هذه الحالة أصبح لدينا <b>مجالان مغناطيسيان دواران</b>: الأول ناتج عن العضو الثابت ويدور بالسرعة التزامنية \\((n_s)\\)، والثاني ناتج عن العضو الدوار ويدور بالسرعة \\((n_s-n)\\) بالنسبة للعضو الدوار (\\(n\\) هي سرعة العضو الدوار) وبالسرعة التزامنية \\((n_s)\\) بالنسبة للعضو الثابت. وحيث أن هذين المجالين يدوران بنفس السرعة والاتجاه فإنه سيتولد <b>عزم فعال</b> على العضو الدوار يؤدي إلى دورانه بنفس اتجاه دوران المجالين وذلك طبقاً لمبدأ إنتاج العزم.»</p>`},
  {html:`<p>«بعدما يبدأ العضو الدوار بالتسارع فإن سرعة تعرض موصلاته لقطع خطوط المجال المغناطيسي الدوار ستقل كلما زادت سرعة العضو الدوار وبالتالي فإن القوة الدافعة الكهربائية المتولدة في موصلات العضو الدوار ستقل … وذلك لأن القوة الدافعة الكهربائية المتولدة بسبب الحث الكهرومغناطيسي <b>تتناسب طردياً مع السرعة \\((n_s-n)\\)</b> بين موصلات العضو الدوار والمجال الذي يتعرض له. وبالتالي فإن قيمة التيارات المارة في موصلات العضو الدوار ستقل وكذلك شدة المجال المغناطيسي المتولد ومن ثم يقل العزم المؤثر على العضو الدوار، وهكذا حتى تصل سرعة العضو الدوار إلى سرعة قريبة من السرعة التزامنية … وعندما تستقر سرعة العضو الدوار فإن <b>العزم المؤثر عليه يكون مساوياً لقوة الاحتكاك</b> التي يتعرض لها العضو الدوار.» <span class="ref">ص 17–18</span></p>
   <p>«<b>عند تحميل المحرك</b> تقل سرعة العضو الدوار وينتج عن ذلك زيادة في سرعة قطع المجال المغناطيسي لموصلات العضو الدوار مما يؤدي إلى زيادة قيم التيارات المارة في موصلاته وبالتالي زيادة شدة المجال المغناطيسي الناشئ عنها ومن ثم زيادة العزم المؤثر على العضو الدوار، ثم تستقر سرعة العضو الدوار عند سرعة جديدة وعندها يكون <b>العزم المتولد مساوياً لعزم الحمل المسلط عليه</b>.» <span class="ref">ص 18</span></p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — السلسلة باختصار:</b> حمل أكبر ← سرعة أقل ← فرق أكبر \\((n_s-n)\\) ← جهد وتيار أكبر في الدوار ← عزم أكبر ← تستقر السرعة عندما يتساوى عزم المحرك وعزم الحمل. ولو وصل الدوار إلى \\(n_s\\) لتوقف قطع خطوط المجال فلا جهد ولا تيار ولا عزم؛ لذلك يبقى الدوار دائماً أبطأ قليلاً من المجال (ومن هنا اسم «اللاتزامني»).'},
  {h:'مفهوم الانزلاق',ref:'ص 18–19',html:`<p>«القوة الدافعة الكهربائية المتولدة في موصلات العضو الدوار تعتمد على السرعة النسبية بين سرعة العضو الدوار وسرعة المجال المغناطيسي الدوار الناتج عن العضو الثابت … فإن السرعة النسبية … هي الفرق بين السرعتين \\((n_s-n)\\) وتسمى <b>سرعة الانزلاق Slip speed</b>:»</p>
   $$n_{slip}=n_s-n \\qquad (1\\text{-}2)$$
   <p>«وإذا نسبت سرعة الانزلاق إلى السرعة التزامنية للآلة نفسها فإنها تعطي معاملاً هاماً ومفيداً جداً عند دراسة الآلات الحثية يسمى <b>معامل الانزلاق Slip</b> ويرمز له بالرمز \\((S)\\) وتتراوح قيمته في المحركات الصغيرة ما بين <b>0.01 إلى 0.02</b> وقد تصل إلى <b>0.005</b> في المحركات الكبيرة في حالة عدم التحميل وعند التحميل يتراوح الانزلاق من <b>0.03 إلى 0.05</b>، ويمكن حسابه من المعادلة التالية:»</p>
   $$S=\\frac{n_s-n}{n_s} \\qquad (1\\text{-}3)$$
   <p>«يلاحظ أن قيمة الانزلاق <b>لا تقل عن الصفر</b> وذلك عندما يدور العضو الدوار بنفس السرعة التزامنية <b>ولا تزيد عن الواحد</b> وذلك عندما يكون العضو الدوار ثابت.» «من الممكن حساب سرعة العضو الدوار بدلالة السرعة التزامنية والانزلاق وذلك بعد حل المعادلة (1-3) كما يلي:»</p>
   $$n=n_s\\,(1-S) \\qquad (1\\text{-}4)$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الانزلاق يكتب أحياناً نسبة مئوية: <span class="ltr">S = 0.05</span> هي <span class="ltr">5%</span> (كما في مثال 1-1). وفي محرك سرعته التزامنية <span class="ltr">1500 rpm</span> يعني انزلاق <span class="ltr">0.04</span> أن الدوار يدور بـ <span class="ltr">1440 rpm</span> وأن المجال «ينزلق» عليه بـ <span class="ltr">60 rpm</span>.'},
  {h:'تردد الجهود والتيارات في العضو الدوار',ref:'ص 19',html:`<p>«المحرك الحثي يعمل طبقاً لنظرية الحث الكهرومغناطيسي حيث يتولد الجهد والتيار في العضو الدوار طبقاً لهذا المبدأ كما هو الحال في المحول، لذلك فإنه أحياناً يسمى <b>محولاً دواراً</b>، الابتدائي هو العضو الثابت والثانوي هو العضو الدوار ولكن لا يشابه المحول من حيث تردد الجهد والتيار في العضو الدوار (الثانوي).»</p>
   <p>«فعندما يكون العضو الدوار ثابتاً فإن تردد التيارات المتولدة فيه هي نفسها تردد التيارات في العضو الثابت (كالمحول تماماً) بينما إذا كان العضو الدوار يدور بالسرعة التزامنية فإن تردد التيارات فيه يكون صفراً.»</p>
   <ul><li>عندما تكون \\((n=0)\\) فإن \\((S=1)\\) والتردد \\((f_r=f_s)\\)</li><li>وعندما تكون \\((n=n_s)\\) فإن \\((S=0)\\) والتردد \\((f_r=0)\\)</li></ul>
   <p>«عند أي سرعة للعضو الدوار بين الصفر والسرعة التزامنية فإن تردد التيار في العضو الدوار سيتناسب طردياً مع الفرق بين السرعة التزامنية \\((n_s)\\) وسرعة العضو الدوار \\((n)\\) … فإنه يمكن التعبير عن تردد التيارات في العضو الدوار بالمعادلة التالية:»</p>
   $$f_r=S\\cdot f_s \\qquad (1\\text{-}5)$$
   <p class="sub">(\\(f_r\\): تردد تيارات العضو الدوار.)</p>`},
  {h:'أمثلة محلولة',ref:'ص 20–21',html:`<p>الأمثلة الثلاثة محلولة في تبويب «الأمثلة المحلولة» بأرقام الكتاب ويمكنك تغيير الأرقام:</p><table class="tt"><thead><tr><th>المثال</th><th>المعطيات</th><th>النتائج</th></tr></thead><tbody>
   <tr><td>(1-1) ص 20</td><td>4 أقطاب، 50 Hz، S = 5%</td><td>\\(n_s=1500\\) rpm، \\(n=1425\\) rpm، \\(f_r=2.5\\) Hz</td></tr>
   <tr><td>(1-2) ص 20–21</td><td>4 أقطاب، 60 Hz، n = 1740 rpm</td><td>\\(n_s=1800\\)، \\(n_{slip}=60\\) rpm، \\(S=0.0333\\)</td></tr>
   <tr><td>(1-3) ص 21</td><td>6 أقطاب، 50 Hz، \\(f_r=2.5\\) Hz</td><td>\\(S=0.05\\)، \\(n_s=1000\\)، \\(n=950\\) rpm</td></tr></tbody></table>`},
  {note:'<b>ملاحظة:</b> في مثال (1-1) الجهد <span class="ltr">240 V</span> والتوصيل «نجمة» معطيات لا تدخل في الحل؛ السرعات والتردد لا تعتمد عليها.'}
 ],
 lab:(el)=>{
  let f=50,p=4,mode='load',load=0,nset=1440,n=null,af=0,ar=0,t=0,Er0=100;const did={};
  el.innerHTML=`<div class="grid im-lab">
   <div class="panel c5"><h2>المجال والدوار <small>مبنية على ص 17–19 والمعادلات (1-2) إلى (1-5)</small></h2>
    <div class="svgbox" id="l3v" style="max-width:300px;margin-inline:auto"></div>
    <p class="sub">السهم الأحمر = المجال الدوار (يدور بـ n<sub>s</sub>)، والخط الأسود = علامة على الدوار (يدور بـ n). القضبان تتوهج أكثر كلما زاد تيار الدوار. العرض مبطأ 50 مرة.</p></div>
   <div class="panel c7"><h2>التحكم</h2>
    <div class="im-row"><div><div class="sub">f<sub>s</sub></div>${segHTML('f',[[50,'50 Hz'],[60,'60 Hz']],f)}</div><div><div class="sub">p</div>${segHTML('p',[[2,'2'],[4,'4'],[6,'6'],[8,'8']],p)}</div><div><div class="sub">أتحكم في</div>${segHTML('md',[['load','الحمل'],['speed','السرعة مباشرة']],mode)}</div></div>
    <div id="l3ld">${sl('l3l','الحمل على العمود (نسبة من الحمل الكامل)',0,150,1,load)}</div>
    <div id="l3sp">${sl('l3n','سرعة العضو الدوار n',0,1500,1,nset)}<div class="im-row"><button class="btn" id="l3lock">الدوار ثابت (n = 0)</button><button class="btn" id="l3sync">n = n<sub>s</sub></button></div></div>
    <div class="facts">${fact('n<sub>s</sub> (1-1)','l3ns')}${fact('n','l3nn')}${fact('n<sub>slip</sub> (1-2)','l3nsl')}${fact('S (1-3)','l3S')}${fact('f<sub>r</sub> = S·f<sub>s</sub> (1-5)','l3fr')}${fact('جهد الدوار E<sub>r</sub> (توضيحي)','l3er')}</div>
    <div class="im-row"><span id="l3chip" class="im-chip"></span></div><div id="l3tq"></div></div>
   <div class="panel c12"><h2><span>جهد العضو الدوار مع الزمن (ثانية واحدة)</span> <small>السعة ∝ S والتردد = f<sub>r</sub> — أرقام توضيحية: E<sub>r</sub> عند السكون = ${Er0} V، والمحور الرأسي يتكبر تلقائياً</small></h2><div class="svgbox" id="l3wv"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const ns=()=>120*f/p;
  const Starget=()=>0.0333*(0.35+load/100);   // أرقام توضيحية: S ≈ 0.012 بلا حمل و ≈ 0.045 عند الحمل الكامل
  const ui=()=>{$('#l3ld').style.display=mode==='load'?'':'none';$('#l3sp').style.display=mode==='speed'?'':'none';const r=$('#l3n');r.max=ns()};
  segBind(el,'f',v=>{const k=(n==null?0:n)/ns();f=+v;n=k*ns();nset=Math.min(nset,ns());ui()});segBind(el,'p',v=>{const k=(n==null?0:n)/ns();p=+v;n=k*ns();nset=Math.round(k*ns());ui();$('#l3n').value=nset});
  segBind(el,'md',v=>{mode=v;if(mode==='speed'){nset=Math.round(n);$('#l3n').value=nset}ui()});
  $('#l3l').oninput=e=>{load=+e.target.value};$('#l3n').oninput=e=>{nset=+e.target.value};
  $('#l3lock').onclick=()=>{nset=0;$('#l3n').value=0;did.lock=1};$('#l3sync').onclick=()=>{nset=ns();$('#l3n').value=nset;did.sync=1};
  const steps=stepsUI($('#l3st'),[
   {t:'بلا حمل',x:'اترك الحمل صفراً: يستقر الدوار قريباً جداً من n<sub>s</sub> والانزلاق في نطاق اللاحمل (0.01–0.02 للمحركات الصغيرة، ص 18). العزم يساوي الاحتكاك فقط.',done:()=>mode==='load'&&load===0&&n>0.985*ns()},
   {t:'حمّل المحرك',x:'ارفع الحمل إلى <span class="ltr">100%</span>: تهبط السرعة، يزيد (n<sub>s</sub> − n)، تتوهج القضبان أكثر، ويزيد العزم حتى يساوي عزم الحمل ثم تستقر السرعة. الانزلاق الآن في نطاق 0.03–0.05.',done:()=>mode==='load'&&load>=100&&Math.abs(n-ns()*(1-Starget()))<1},
   {t:'الدوار ثابت',x:'اختر «السرعة مباشرة» ثم «الدوار ثابت»: <span class="ltr">S = 1</span> و f<sub>r</sub> = f<sub>s</sub> تماماً كالمحول (ص 19).',done:()=>mode==='speed'&&nset===0&&did.lock},
   {t:'الدوار بالسرعة التزامنية',x:'اضغط «n = n<sub>s</sub>»: <span class="ltr">S = 0</span> و <span class="ltr">f<sub>r</sub> = 0</span>: لا قطع لخطوط المجال، فلا جهد ولا تيار في الدوار. لذلك لا يصل الدوار وحده إلى n<sub>s</sub>.',done:()=>mode==='speed'&&did.sync&&Math.abs(nset-ns())<0.5},
   {t:'مثال (1-1) حياً',x:'اختر <span class="ltr">p = 4</span> و <span class="ltr">50 Hz</span> وفي «السرعة مباشرة» اضبط <span class="ltr">n = 1425 rpm</span>: تقرأ <span class="ltr">S = 0.05</span> و <span class="ltr">f<sub>r</sub> = 2.5 Hz</span> كما في المثال.',done:()=>mode==='speed'&&p===4&&f===50&&nset===1425}
  ]);
  ui();
  loopOn(el,dt=>{t+=dt;const Ns=ns();if(n==null)n=Ns*(1-Starget());
   let nt=mode==='load'?Ns*(1-Starget()):nset;n+=(nt-n)*(mode==='load'?(1-Math.exp(-dt/0.7)):1);if(Math.abs(n-nt)<0.05)n=nt;
   const Sx=(Ns-n)/Ns,fr=Sx*f,Er=Sx*Er0;
   af=(af+Ns/60*360*dt/50)%360;ar=(ar+n/60*360*dt/50)%360;
   $('#l3v').innerHTML=slipViewSVG(af,ar,clamp(Sx/0.06,0,1),{lbl:'n_slip = '+fm(Ns-n,1)+' rpm'});
   $('#l3l-v').textContent=load+' %';$('#l3n-v').textContent=fm(nset,0)+' rpm';
   $('#l3ns').textContent=fm(Ns,0)+' rpm';$('#l3nn').textContent=fm(n,1)+' rpm';$('#l3nsl').textContent=fm(Ns-n,1)+' rpm';$('#l3S').textContent=fm(Sx,4);$('#l3fr').textContent=fm(fr,2)+' Hz';$('#l3er').textContent=fm(Er,1)+' V';
   const ch=$('#l3chip');if(Sx<1e-6){ch.className='im-chip warn';ch.textContent='S = 0: لا جهد ولا تيار ولا عزم في الدوار'}else if(Sx>=0.999){ch.className='im-chip warn';ch.textContent='S = 1: الدوار ثابت، fr = fs'}else if(Sx>=0.005&&Sx<=0.02){ch.className='im-chip ok';ch.textContent='نطاق اللاحمل (0.005–0.02)'}else if(Sx>=0.03&&Sx<=0.05){ch.className='im-chip ld';ch.textContent='نطاق التحميل (0.03–0.05)'}else{ch.className='im-chip hot';ch.textContent=Sx>0.05?'انزلاق أكبر من نطاق الحمل الكامل':'بين النطاقين'}
   if(mode==='load'){const Tm=Sx/0.0333,TL=0.35+load/100;$('#l3tq').innerHTML=`<div class="facts"><div class="fact"><span>عزم المحرك (نسبي)</span><b>${fm(Tm,2)}</b></div><div class="fact"><span>عزم الحمل + الاحتكاك (نسبي)</span><b>${fm(TL,2)}</b></div><div class="fact"><span>الحالة</span><b style="font-family:var(--font);font-size:15px">${Math.abs(Tm-TL)<0.01?'مستقر: العزمان متساويان':Tm<TL?'العزم أقل: السرعة تهبط':'العزم أكبر: السرعة تزيد'}</b></div></div><p class="sub">العزم هنا أرقام توضيحية تتناسب مع S في نطاق الانزلاق الصغير (ليس من الكتاب).</p>`}
   else $('#l3tq').innerHTML='';
   const pts=[];for(let i=0;i<=900;i++){const x=i/900;pts.push([x,Er*Math.sin(2*PI*fr*x)])}
   const ym=[2,5,10,20,50,100].find(v=>v>=Er*1.1)||110;
   $('#l3wv').innerHTML=plotSVG({w:760,h:200,x0:0,x1:1,y0:-ym*1.05,y1:ym*1.05,xt:[0,0.2,0.4,0.6,0.8,1],yt:[-ym,-ym/2,0,ym/2,ym],xl:'t (s)',yl:'e_r (V)',series:[{pts,col:'--live',w:1.8}],aria:'جهد الدوار مع الزمن'});
   steps.check()});
 },
 examples:[
  {title:'مثال (1-1)',ref:'ص 20',q:'<p>«محرك حثي ثلاثي الأوجه ذو <b>أربعة أقطاب</b> ملفاته موصلة على شكل <b>نجمة</b> يغذى من مصدر جهده <span class="ltr">240 V</span> وتردده <span class="ltr">50 Hz</span>، فإذا كانت قيمة الانزلاق عند الحمل الكامل <span class="ltr">5%</span> احسب ما يلي: أ) السرعة التزامنية لهذا المحرك. ب) سرعة العضو الدوار عند الحمل الكامل. جـ) تردد التيارات في العضو الدوار عند الحمل الكامل.»</p>',
   given:EX11G,solve:g=>solveEx11(g),note:'الجهد والتوصيل (نجمة) لا يدخلان في الحل: غيّر الجهد وسترى أن النتائج لا تتغير.'},
  {title:'مثال (1-2)',ref:'ص 20–21',q:'<p>«محرك حثي ثلاثي الأوجه ذو <b>أربعة أقطاب</b> يعمل على مصدر تردده <span class="ltr">60 Hz</span>، وسرعته عند الحمل الكامل <span class="ltr">1740 rpm</span>، احسب سرعة الانزلاق ومعامل الانزلاق عند الحمل الكامل.»</p>',given:EX12G,solve:g=>solveEx12(g)},
  {title:'مثال (1-3)',ref:'ص 21',q:'<p>«محرك حثي ثلاثي الأوجه ذو <b>ستة أقطاب</b> يعمل على مصدر تردده <span class="ltr">50 Hz</span>، القوة الدافعة الكهربائية في العضو الدوار ترددها <span class="ltr">2.5 Hz</span>، احسب معامل الانزلاق وكذلك سرعة العضو الدوار.»</p>',given:EX13G,solve:g=>solveEx13(g)}
 ],
 quiz:[
  {q:'بأي ظاهرة يتولد الجهد في موصلات العضو الدوار؟',o:['الحث الكهرومغناطيسي','التأثير الحراري','الخاصية القشرية','التنافر الكهروستاتيكي'],c:0,e:'ص 17.'},
  {q:'بالنسبة للعضو الثابت، يدور مجال العضو الدوار بالسرعة:',o:['n','n<sub>s</sub> − n','n<sub>s</sub> (التزامنية)','صفر'],c:2,e:'ص 17: يدور بالسرعة (ns − n) بالنسبة للدوار وبالسرعة التزامنية بالنسبة للثابت.'},
  {q:'عند زيادة الحمل على المحرك الحثي فإن:',o:['السرعة تزيد والانزلاق يقل','السرعة تقل والانزلاق يزيد وتيارات الدوار تزيد','السرعة لا تتغير','التيار يقل'],c:1,e:'ص 18.'},
  {q:'قيمة الانزلاق عندما يكون العضو الدوار ثابتاً:',o:['0','0.05','0.5','1'],c:3,e:'ص 18: لا تزيد عن الواحد وذلك عندما يكون العضو الدوار ثابت.'},
  {q:'الانزلاق عند التحميل يتراوح عادة بين:',o:['0.3 و 0.5','0.03 و 0.05','0.001 و 0.002','1 و 2'],c:1,e:'ص 18.'},
  {q:'محرك 4 أقطاب على 50 Hz وانزلاقه 0.04. سرعة دواره:',o:['1500 rpm','1440 rpm','1460 rpm','60 rpm'],c:1,e:'\\(n=1500(1-0.04)=1440\\) rpm.'},
  {q:'محرك على 60 Hz وانزلاقه 0.05. تردد تيارات الدوار:',o:['60 Hz','3 Hz','0.05 Hz','57 Hz'],c:1,e:'\\(f_r=S\\,f_s=0.05\\times 60=3\\) Hz.'},
  {q:'لماذا يسمى المحرك الحثي أحياناً «محولاً دواراً»؟',o:['لأنه يحول الجهد','لأن الجهد والتيار يتولدان في الدوار بالحث كما في ثانوي المحول','لأن فيه محولاً داخلياً','لأنه يعمل بالتيار المستمر'],c:1,e:'ص 19: الابتدائي هو العضو الثابت والثانوي هو العضو الدوار.'}
 ]
});


/* ======================================================================
   Lesson 4 — per-phase equivalent circuit (الأشكال 1-8 … 1-12)
   ====================================================================== */
const Cx=(re,im)=>({re,im:im||0}),cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im),csub=(a,b)=>Cx(a.re-b.re,a.im-b.im),cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},cabs=a=>Math.hypot(a.re,a.im),cpar=(a,b)=>cdiv(cmul(a,b),cadd(a,b));
const SYM={Vph:['V<sub>ph</sub>','جهد الوجه (الطرف)'],Iph:['I<sub>ph</sub>','تيار العضو الثابت لكل وجه'],I2:['I<sub>2</sub>','تيار العضو الدوار لكل وجه'],I2p:["I<sub>2</sub>'","تيار العضو الدوار منسوباً إلى العضو الثابت: \\(I_2'=I_2\\,(N_r/N_s)\\)"],
 R1:['R<sub>1</sub>','مقاومة ملفات العضو الثابت لكل وجه'],R2S:['R<sub>2</sub>/S','مقاومة ملفات العضو الدوار مقسومة على الانزلاق: «تم تمثيل الحركة في الدائرة المكافئة بالمقاومة \\(R_2/S\\)» (ص 23)'],R2pS:["R<sub>2</sub>'/S","\\(\\frac{R_2'}{S}=\\frac{R_2}{S}\\left(\\frac{N_s}{N_r}\\right)^2\\) (ص 24)"],R2p:["R<sub>2</sub>'","مقاومة ملفات الدوار منسوبة إلى الثابت"],
 X1:['X<sub>1</sub>','ممانعة التسرب الحثية لملفات العضو الثابت لكل وجه'],X2:['X<sub>2</sub>','ممانعة التسرب الحثية لملفات العضو الدوار لكل وجه'],X2p:["X<sub>2</sub>'","\\(X_2'=X_2\\left(\\frac{N_s}{N_r}\\right)^2\\) (ص 24)"],
 I10:['I<sub>10</sub>','التيار الابتدائي عند اللاحمل'],Ic:['I<sub>c</sub>','التيار الفعال'],Im:['I<sub>m</sub>','التيار الغير فعال (تيار التمغنط)'],Rc:['R<sub>c</sub>','مقاومة القلب الحديدي: تمثل المفاقيد الحديدية'],Xm:['X<sub>m</sub>','ممانعة القلب الحديدي: تمثل المفاقيد المغناطيسية'],
 NsNr:['N<sub>s</sub> و N<sub>r</sub>','عدد لفات العضو الثابت والدوار لكل وجه'],RL:["R<sub>2</sub>'(1−S)/S","«تعتبر المقاومة \\(R_2'\\left(\\frac{1-S}{S}\\right)\\) حملاً للمحول، والقدرة المفقودة في هذه المقاومة تمثل القدرة الميكانيكية المتولدة من المحرك» (ص 26)"],
 Req:['R<sub>eq</sub>',"\\(R_{eq}=R_1+R_2'\\) (ص 26)"],Xeq:['X<sub>eq</sub>',"\\(X_{eq}=X_1+X_2'\\) (ص 26)"]};
const EQFIG=[null,{fig:'(1-8)',ref:'ص 23',t:'الدائرة المكافئة لكل وجه للمحرك الحثي ثلاثي الأوجه'},{fig:'(1-9)',ref:'ص 24',t:'الدائرة المكافئة لكل وجه للمحرك الحثي منسوبة إلى العضو الثابت'},{fig:'(1-10)',ref:'ص 25',t:'الدائرة المكافئة لكل وجه للمحرك الحثي في وضعها النهائي'},{fig:'(1-11)',ref:'ص 25',t:'الدائرة المكافئة التقريبية لكل وجه للمحرك الحثي ثلاثي الأوجه'},{fig:'(1-12)',ref:'ص 26',t:'الدائرة المكافئة التقريبية لكل وجه للمحرك الحثي ثلاثي الأوجه (بعد دمج R_eq و X_eq)'}];
/* o={hi,vals:{key:text}} */
function eqcSVG(step,o){o=o||{};const hi=o.hi,V=o.vals||{},T=50,Bt=210;
  const E=(k,inner,x,y,w,h)=>`<g data-el="${k}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${hi===k?'var(--stop-soft)':'transparent'}" stroke="${hi===k?'var(--stop)':'none'}"/>${inner}</g>`;
  const val=(k,x,y,a)=>V[k]?`<text class="txt m" x="${x}" y="${y}" text-anchor="${a||'middle'}" style="fill:var(--blue-ink)">${V[k]}</text>`:'';
  const hR=(k,x1,x2,lb)=>E(k,zig(x1,T,x2,T,6,'')+S.t((x1+x2)/2,T-14,lb,'')+val(k,(x1+x2)/2,T+24),x1,T-28,x2-x1,58);
  const hX=(k,x1,x2,lb)=>E(k,ind(x1,T,x2,T,4,'')+S.t((x1+x2)/2,T-16,lb,'')+val(k,(x1+x2)/2,T+24),x1,T-30,x2-x1,60);
  const vVar=(k,x,lb,lb2)=>E(k,zig(x,T+14,x,Bt-14,7,'')+`<path class="w" d="M${x} ${T}V${T+14}M${x} ${Bt-14}V${Bt}"/>`+arrow(x-18,Bt-40,x+20,T+44,'--fg',1.6)+S.t(x+28,(T+Bt)/2-4,lb,'','start')+(lb2?S.t(x+28,(T+Bt)/2+12,lb2,'m','start'):'')+val(k,x+28,(T+Bt)/2+(lb2?28:14),'start'),x-26,T+6,120,Bt-T-12);
  const shunt=(xn)=>{let s=`<path class="w" d="M${xn} ${T}V80M${xn-30} 80H${xn+30}M${xn-30} 180H${xn+30}M${xn} 180V${Bt}"/>`+arrow(xn+8,58,xn+8,76,'--blue',1.8)+S.t(xn+14,72,sb('I','10'),'b','start')+val('I10',xn+14,88,'start');
    s+=E('Rc',zig(xn-30,80,xn-30,180,6,'')+S.t(xn-44,134,sb('R','c'),'','end')+arrow(xn-42,104,xn-42,120,'--blue',1.6)+S.t(xn-48,116,sb('I','c'),'b','end')+val('Ic',xn-44,152,'end'),xn-80,84,48,92);
    s+=E('Xm',ind(xn+30,80,xn+30,180,4,'')+S.t(xn+46,134,sb('X','m'),'','start')+arrow(xn+44,104,xn+44,120,'--blue',1.6)+S.t(xn+50,116,sb('I','m'),'b','start')+val('Im',xn+46,152,'start'),xn+18,84,62,92);
    return s};
  let s=`<svg viewBox="-36 0 796 250" role="img" aria-label="${(EQFIG[step]||{}).t||'الدائرة المكافئة'}">`;
  // input
  s+=`<circle cx="30" cy="${T}" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="30" cy="${Bt}" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
  s+=E('Vph',arrow(16,Bt-20,16,T+20,'--fg',1.6)+S.t(12,(T+Bt)/2+4,sb('V','ph'),'','end'),0,T+10,30,Bt-T-20).replace('<rect x="0"','<rect x="-40"').replace('width="30"','width="70"');
  s+=E('Iph',arrow(40,T-12,74,T-12,'--blue',1.8)+S.t(57,T-18,sb('I','ph'),'b')+val('Iph',57,T-34),36,T-48,46,30);
  const top=(x1,x2)=>`<path class="w" d="M${x1} ${T}H${x2}"/>`,bot=(x1,x2)=>`<path class="w" d="M${x1} ${Bt}H${x2}"/>`;
  if(step===1){s+=top(35,60)+hR('R1',60,130,sb('R','1'))+hX('X1',140,210,sb('X','1'))+top(130,140)+top(210,390)+shunt(270)+bot(35,400);
    s+=`<path class="w" d="M360 ${T}H400V70"/>`+ind(400,70,400,190,5,'')+`<path class="w" d="M400 190V${Bt}"/><path d="M418 66V194M426 66V194" stroke="var(--fg)" stroke-width="2"/>`+ind(444,70,444,190,5,'');
    s+=E('NsNr',S.t(384,134,sb('N','s'),'','end')+S.t(460,134,sb('N','r'),'','start')+val('a',422,232),360,60,120,140);
    s+=`<path class="w" d="M444 70V${T}H470"/>`+hX('X2',470,540,sb('X','2'))+`<path class="w" d="M540 ${T}H620"/><path class="w" d="M444 190V${Bt}H620"/>`+vVar('R2S',620,"R2/S",'')+E('I2',arrow(476,T-12,510,T-12,'--blue',1.8)+S.t(493,T-18,sb('I','2'),'b')+val('I2',497,T-34),472,T-48,46,30);}
  else if(step===2){s+=top(35,60)+hR('R1',60,130,sb('R','1'))+hX('X1',140,210,sb('X','1'))+top(130,140)+top(210,380)+shunt(270)+hX('X2p',380,460,"X2'")+top(460,560)+bot(35,560)+vVar('R2pS',560,"R2'/S",'')+E('I2p',arrow(318,T-12,352,T-12,'--blue',1.8)+S.t(335,T-18,"I2'",'b')+val('I2p',335,T-34),314,T-48,46,30);}
  else if(step===3){s+=top(35,60)+hR('R1',60,130,sb('R','1'))+hX('X1',140,210,sb('X','1'))+top(130,140)+top(210,360)+shunt(270)+hR('R2p',360,430,"R2'")+top(430,450)+hX('X2p',450,530,"X2'")+top(530,600)+bot(35,600)+vVar('RL',600,"R2'(1-S)/S",'')+E('I2p',arrow(318,T-12,352,T-12,'--blue',1.8)+S.t(335,T-18,"I2'",'b')+val('I2p',335,T-34),314,T-48,46,30);}
  else if(step===4){s+=top(35,170)+shunt(110)+hR('R1',170,230,sb('R','1'))+hX('X1',245,305,sb('X','1'))+top(230,245)+top(305,320)+hR('R2p',320,380,"R2'")+top(380,395)+hX('X2p',395,455,"X2'")+top(455,560)+bot(35,560)+vVar('RL',560,"R2'(1-S)/S",'')+E('I2p',arrow(140,T-12,166,T-12,'--blue',1.8)+S.t(153,T-18,"I2'",'b')+val('I2p',153,T-34),134,T-48,40,30);}
  else{s+=top(35,190)+shunt(110)+hR('Req',190,280,sb('R','eq'))+top(280,310)+hX('Xeq',310,400,sb('X','eq'))+top(400,520)+bot(35,520)+vVar('RL',520,"R2'(1-S)/S",'')+E('I2p',arrow(140,T-12,166,T-12,'--blue',1.8)+S.t(153,T-18,"I2'",'b')+val('I2p',153,T-34),134,T-48,40,30);}
  return s+'</svg>'}
/* circuit solution. P={V,R1,X1,R2,X2,Rc,Xm} with R2,X2 referred */
function eqSolve(approx,Sx,P){const Zm=cpar(Cx(P.Rc),Cx(0,P.Xm)),V=Cx(P.V);let Iph,I2,I10,E;
  if(!approx){const Z2=Cx(P.R2/Sx,P.X2),Zp=cpar(Zm,Z2),Zin=cadd(Cx(P.R1,P.X1),Zp);Iph=cdiv(V,Zin);E=csub(V,cmul(Iph,Cx(P.R1,P.X1)));I2=cdiv(E,Z2);I10=cdiv(E,Zm)}
  else{E=V;I10=cdiv(V,Zm);I2=cdiv(V,Cx(P.R1+P.R2/Sx,P.X1+P.X2));Iph=cadd(I10,I2)}
  const Ic=cabs(E)/P.Rc,Im=cabs(E)/P.Xm,RL=P.R2*(1-Sx)/Sx,i2=cabs(I2);return {Iph:cabs(Iph),I2:i2,I10:cabs(I10),Ic,Im,RL,Pm:i2*i2*RL,E:cabs(E)}}
const P15={V:127,R1:0.675,X1:0.829,R2:0.379,X2:0.829,Rc:270.78,Xm:29.435};   // مثال (1-5) بالأرقام المطبوعة
const fmR=r=>!isFinite(r)||r>1e6?'∞':r>=100?fm(r,1):fm(r,3);

B.lesson({
 id:'u1-l4',unit:1,order:4,pages:'23–26',
 title:'الدائرة المكافئة لكل وجه للمحرك الحثي',
 summary:'نمثل وجهاً واحداً من المحرك بدائرة تشبه دائرة المحول، ونمثل الحركة بالمقاومة R2/S، ثم ننسب الدوار إلى الثابت، ونفصل مقاومة الحمل R2\'(1−S)/S التي تمثل القدرة الميكانيكية، ونصل إلى الدائرة التقريبية بنقل الفرع المغناطيسي إلى جهة الدخل.',
 theory:[
  {h:'الفصل الثاني: الدائرة المكافئة لكل وجه',ref:'ص 23',html:'<p>«الدائرة المكافئة لكل وجه للمحرك الحثي ثلاثي الأوجه <b>تشبه تماماً الدائرة المكافئة للمحول</b>، غير أن المحرك دوار لذلك تم <b>تمثيل الحركة في الدائرة المكافئة بالمقاومة \\(\\left(\\frac{R_2}{S}\\right)\\)</b> كما هو موضح في الشكل (1-8).»</p>'},
  {fig:'(1-8)',ref:'ص 23',caption:'الدائرة المكافئة لكل وجه للمحرك الحثي ثلاثي الأوجه: R1 و X1 على التوالي، ثم الفرع المغناطيسي (Rc ∥ Xm)، ثم محول مثالي Ns : Nr، ودائرة الدوار X2 مع المقاومة المتغيرة R2/S',draw:()=>box(eqcSVG(1),720,1)},
  {h:'جدول الرموز',ref:'ص 23',html:`<table class="tt"><thead><tr><th>الرمز</th><th>المعنى</th><th>الرمز</th><th>المعنى</th></tr></thead><tbody>
   <tr><td>\\(V_{ph}\\)</td><td>جهد الوجه (الطرف)</td><td>\\(I_{ph}\\) و \\(I_2\\)</td><td>تيار العضو الثابت والدوار لكل وجه</td></tr>
   <tr><td>\\(R_1\\) و \\(R_2\\)</td><td>مقاومة ملفات العضو الثابت والدوار لكل وجه</td><td>\\(X_1\\) و \\(X_2\\)</td><td>ممانعة التسرب الحثية لملفات العضو الثابت والدوار لكل وجه</td></tr>
   <tr><td>\\(I_{10}\\)</td><td>التيار الابتدائي عند اللاحمل</td><td>\\(I_c\\)</td><td>التيار الفعال</td></tr>
   <tr><td>\\(I_m\\)</td><td>التيار الغير فعال (تيار التمغنط)</td><td>\\(N_s\\) و \\(N_r\\)</td><td>عدد لفات العضو الثابت والدوار لكل وجه</td></tr>
   <tr><td>\\(R_c\\)</td><td>مقاومة القلب الحديدي: تمثل المفاقيد الحديدية</td><td>\\(X_m\\)</td><td>ممانعة القلب الحديدي: تمثل المفاقيد المغناطيسية</td></tr></tbody></table>`},
  {err:'في جدول الرموز (ص 23) كُتب معنى \\(V_{ph}\\) «جهد الوجه (الطرف)»، وهذا يجمع بين شيئين مختلفين: جهد الوجه وجهد الطرف (الخط). المقصود في الدائرة <b>جهد الوجه</b>؛ وفي الأمثلة يُحسب من جهد الخط: نجمة \\(V_{ph}=V_L/\\sqrt3\\)، دلتا \\(V_{ph}=V_L\\).'},
  {h:'نسبة دائرة الدوار إلى العضو الثابت',ref:'ص 24',html:`<p>«ويمكن أن ترسم الدائرة المكافئة بحيث تكون <b>دائرة العضو الدوار منسوبة إلى العضو الثابت</b> للتخلص من الدائرة المغناطيسية كما هو موضح في الشكل (1-9)»، حيث:</p>
   $$\\frac{R_2'}{S}=\\frac{R_2}{S}\\left(\\frac{N_s}{N_r}\\right)^2 \\qquad X_2'=X_2\\left(\\frac{N_s}{N_r}\\right)^2 \\qquad I_2'=I_2\\left(\\frac{N_r}{N_s}\\right)$$`},
  {fig:'(1-9)',ref:'ص 24',caption:'الدائرة المكافئة لكل وجه للمحرك الحثي منسوبة إلى العضو الثابت: اختفى المحول، وبعد الفرع المغناطيسي يمر التيار I2\' في X2\' ثم المقاومة المتغيرة R2\'/S',draw:()=>box(eqcSVG(2),720,1)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> إذا كانت <span class="ltr">N<sub>s</sub>/N<sub>r</sub> = 2</span> و <span class="ltr">R<sub>2</sub> = 0.1 Ω</span> فإن <span class="ltr">R<sub>2</sub>\' = 0.1 × 4 = 0.4 Ω</span>، و <span class="ltr">I<sub>2</sub> = 20 A</span> يصبح <span class="ltr">I<sub>2</sub>\' = 20 × ½ = 10 A</span>. القدرة في المقاومة لا تتغير: <span class="ltr">20² × 0.1 = 10² × 0.4 = 40 W</span>. لذلك يمكن حذف المحول دون أن تتغير القدرات.'},
  {h:'فصل مقاومة الحمل',ref:'ص 24–25',html:`<p>«كما أن مقاومة ملفات العضو الدوار \\(\\left(\\frac{R_2'}{S}\\right)\\) يمكن تقسيمها إلى مقاومتين كما يلي:»</p>
   $$\\frac{R_2'}{S}=\\frac{R_2'}{S}+R_2'-R_2'=R_2'+\\frac{R_2'}{S}-R_2'=R_2'+R_2'\\left(\\frac{1}{S}-1\\right)=R_2'+R_2'\\left(\\frac{1-S}{S}\\right)$$
   <p>«وبالتالي يمكن إعادة رسم الدائرة المكافئة كما يلي:»</p>`},
  {fig:'(1-10)',ref:'ص 25',caption:'الدائرة المكافئة لكل وجه للمحرك الحثي في وضعها النهائي: R2\' ثم X2\' ثم المقاومة المتغيرة R2\'(1−S)/S',draw:()=>box(eqcSVG(3),720,1)},
  {h:'الدائرة المكافئة التقريبية',ref:'ص 25–26',html:`<p>«ويمكن أيضاً الحصول على <b>الدائرة المكافئة التقريبية</b> عندما <b>نهمل تيار اللاحمل \\((I_{10})\\)</b> وذلك لأن قيمته صغيرة جداً عند مقارنتها بتيار الحمل \\((I_{ph})\\). وعلى هذا الأساس يمكن <b>نقل الفرع الممثل للدائرة المغناطيسية إلى جهة جهد الابتدائي \\((V_{ph})\\)</b> كما هو موضح في الشكل (1-11).»</p>`},
  {fig:'(1-11)',ref:'ص 25',caption:'الدائرة المكافئة التقريبية لكل وجه: الفرع المغناطيسي عند أطراف الدخل، ثم R1 و X1 و R2\' و X2\' والحمل R2\'(1−S)/S على التوالي',draw:()=>box(eqcSVG(4),720,1)},
  {html:`<p>«ونتيجة لهذا التقريب يمكن أن نعتبر أن:» <span class="ref">ص 26</span></p>$$R_{eq}=R_1+R_2' \\qquad X_{eq}=X_1+X_2'$$<p>«وبالتالي يمكن إعادة رسم الدائرة المكافئة كما في الشكل التالي:»</p>`},
  {fig:'(1-12)',ref:'ص 26',caption:'الدائرة المكافئة التقريبية لكل وجه للمحرك الحثي ثلاثي الأوجه: Req و Xeq والحمل R2\'(1−S)/S',draw:()=>box(eqcSVG(5),720,1)},
  {err:'الشكلان (1-11) ص 25 و(1-12) ص 26 يحملان العنوان نفسه «الدائرة المكافئة التقريبية لكل وجه للمحرك الحثي ثلاثي الأوجه» مع أنهما مختلفان: الثاني بعد دمج \\(R_{eq}\\) و \\(X_{eq}\\).'},
  {h:'ماذا تعني الدائرة التقريبية؟',ref:'ص 26',html:`<p>«وبهذا التبسيط تصبح الدائرة المكافئة التقريبية لكل وجه للمحرك الحثي ثلاثي الأوجه مشابهة تماماً للدائرة المكافئة التقريبية للمحول، حيث <b>تعتبر المقاومة \\(R_2'\\left(\\frac{1-S}{S}\\right)\\) حملاً للمحول</b>، و<b>القدرة المفقودة في هذه المقاومة تمثل القدرة الميكانيكية المتولدة من المحرك</b>.»</p>
   <p>«يلاحظ أن الدائرة المكافئة التقريبية لكل وجه أعلاه تعبر عن وجه واحد من أوجه المحرك الثلاثة وذلك للتشابه التام بين الأوجه الثلاثة، فليس هناك ما يدعو إلى تكرارها ثلاث مرات، ولكن عند إجراء الحسابات على هذه الدائرة يجب أن يؤخذ ذلك في الاعتبار حيث تحتاج بعض الكميات إلى <b>ضربها بعدد الأوجه أو بجذر ثلاثة</b> حسب طريقة توصيل ملفات المحرك.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — المقاومة المتغيرة تحكي حالة المحرك:</b><table class="tt"><thead><tr><th>الحالة</th><th>S</th><th>\\(R_2\'(1-S)/S\\)</th><th>الدائرة من جهة الثانوي</th></tr></thead><tbody><tr><td>بلا حمل (يدور قريباً من \\(n_s\\))</td><td>≈ 0</td><td>∞</td><td>مفتوحة</td></tr><tr><td>يدور بحمل</td><td>0.03–0.05</td><td>كبيرة</td><td>حمل عادي</td></tr><tr><td>الدوار ممنوع من الحركة</td><td>1</td><td>0</td><td>مقصورة</td></tr></tbody></table>هاتان الحالتان الطرفيتان هما أساس اختباري اللاحمل وعدم الحركة في الدرس التالي. جرّب ذلك بمنزلق S في «المختبر».'}
 ],
 lab:(el)=>{
  let step=1,hi='',lu=55,a=2,seen=new Set([1]);
  el.innerHTML=`<div class="grid im-lab">
   <div class="panel c12"><h2>من الشكل (1-8) إلى الشكل (1-12) خطوة بخطوة <small>مبنية على الأشكال (1-8) إلى (1-12) ص 23–26</small></h2>
    <div class="im-row"><button class="btn" id="l4prev">→ السابق</button>${segHTML('st',[[1,'(1-8)'],[2,'(1-9)'],[3,'(1-10)'],[4,'(1-11)'],[5,'(1-12)']],step)}<button class="btn primary" id="l4next">التالي ←</button></div>
    <div id="l4cap"></div><div class="svgbox im-wide" id="l4c" style="max-width:820px;margin-inline:auto"></div>
    <p class="sub">اضغط على أي عنصر في الدائرة لترى معناه من جدول الرموز (ص 23). الأرقام الزرقاء حساب حي للدائرة المعروضة.</p><div id="l4info"></div></div>
   <div class="panel c6"><h2>الانزلاق S والقيم الحية <small>حساب توضيحي (ليس من الكتاب) بعناصر مثال (1-5)</small></h2>
    ${sl('l4s','الانزلاق S',0,100,1,lu)}<div class="im-row"><button class="btn" data-sv="0.001">S ≈ 0 (بلا حمل)</button><button class="btn" data-sv="0.04">S = 0.04</button><button class="btn" data-sv="1">S = 1 (الدوار ثابت)</button></div>
    <div id="l4a"></div><div class="facts" id="l4f"></div><div id="l4msg"></div>
    <p class="sub">العناصر لكل وجه من مثال (1-5) (ص 33–35): <span class="ltr">V<sub>ph</sub> = 127 V، R<sub>1</sub> = 0.675، X<sub>1</sub> = X<sub>2</sub>' = 0.829، R<sub>2</sub>' = 0.379، R<sub>c</sub> = 270.78، X<sub>m</sub> = 29.435 Ω</span>.</p></div>
   <div class="panel c6"><h2>التيارات مع الانزلاق</h2><div class="svgbox" id="l4p"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>I<sub>ph</sub></span><span><i style="background:var(--live)"></i>I<sub>2</sub>'</span><span><i style="background:var(--muted)"></i>I<sub>10</sub></span></div>
    <p class="sub">المحور الأفقي لوغاريتمي (من 0.001 إلى 1).</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const Sx=()=>Math.pow(10,-3+3*lu/100);
  const draw=()=>{const s=Sx(),ap=step>=4,r=eqSolve(ap,s,P15),f=EQFIG[step];
   $('#l4cap').innerHTML=`<div class="callout"><b>الشكل ${f.fig}</b> ${f.t} <span class="ref">${f.ref}</span><br>${['','الحركة ممثلة بالمقاومة R<sub>2</sub>/S، والدوار مربوط بالثابت عبر محول مثالي N<sub>s</sub> : N<sub>r</sub>.','نسبنا الدوار إلى الثابت بمربع نسبة اللفات، فاختفى المحول.','قسمنا R<sub>2</sub>\'/S إلى R<sub>2</sub>\' + R<sub>2</sub>\'(1−S)/S: الجزء الثاني هو «الحمل» الذي تمثل قدرته القدرة الميكانيكية.','أهملنا تيار اللاحمل فنقلنا الفرع المغناطيسي إلى أطراف الدخل (تقريب).','جمعنا R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>\' و X<sub>eq</sub> = X<sub>1</sub> + X<sub>2</sub>\'.'][step]}</div>`;
   const vals={Iph:fm(r.Iph,2)+' A',I2p:fm(r.I2,2)+' A',I10:fm(r.I10,2)+' A',Ic:fm(r.Ic,3)+' A',Im:fm(r.Im,2)+' A',R1:'0.675 Ω',X1:'0.829 Ω',R2p:'0.379 Ω',X2p:'0.829 Ω',Req:'1.054 Ω',Xeq:'1.658 Ω',RL:fmR(r.RL)+' Ω',R2pS:fmR(0.379/s)+' Ω'};
   if(step===1){vals.I2=fm(r.I2*a,2)+' A';vals.X2=fm(0.829/a/a,4)+' Ω';vals.R2S=fmR(0.379/a/a/s)+' Ω';vals.a='Ns/Nr = '+a}
   $('#l4c').innerHTML=eqcSVG(step,{hi,vals});
   const sy=SYM[hi];$('#l4info').innerHTML=sy?`<div class="callout"><b class="ltr">${sy[0]}</b>: ${sy[1]}</div>`:'';B.math($('#l4info'));
   $('#l4s-v').textContent=fm(s,s<0.01?4:3);
   $('#l4a').innerHTML=step===1?sl('l4ar','نسبة اللفات N<sub>s</sub>/N<sub>r</sub> (توضيحية)',1,4,0.5,a):'';const ar=$('#l4ar');if(ar){$('#l4ar-v').textContent=fm(a,1);ar.oninput=e=>{a=+e.target.value;draw()}}
   $('#l4f').innerHTML=[['R<sub>2</sub>\'(1−S)/S',fmR(r.RL)+' Ω'],['I<sub>ph</sub>',fm(r.Iph,2)+' A'],['I<sub>2</sub>\'',fm(r.I2,2)+' A'],['I<sub>10</sub>',fm(r.I10,2)+' A'],['القدرة الميكانيكية لكل وجه',fm(r.Pm,0)+' W'],['القدرة الميكانيكية ×3',fm(3*r.Pm,0)+' W']].map(([l,v])=>`<div class="fact"><span>${l}</span><b>${v}</b></div>`).join('');
   $('#l4msg').innerHTML=s<=0.0011?'<div class="callout">S ≈ 0: مقاومة الحمل كبيرة جداً (∞ تقريباً) فالدائرة <b>مفتوحة</b> من جهة الثانوي، ويكاد التيار كله يمر في R<sub>c</sub> و X<sub>m</sub> — هذا هو اختبار اللاحمل.</div>':s>=0.999?'<div class="callout err">S = 1: مقاومة الحمل = 0 فالدائرة <b>مقصورة</b> من جهة الثانوي، والتيار كبير جداً ويحدده R<sub>eq</sub> و X<sub>eq</sub> فقط — هذا هو اختبار عدم الحركة (لكن بجهد مخفض).</div>':'';
   const pts=k=>{const p=[];for(let i=0;i<=90;i++){const lx=-3+3*i/90;p.push([lx,eqSolve(ap,Math.pow(10,lx),P15)[k]])}return p};
   const ymax=ap?140:120;$('#l4p').innerHTML=plotSVG({w:460,h:250,x0:-3,x1:0,y0:0,y1:ymax,xt:[-3,-2,-1,0],xf:v=>String(Math.pow(10,v)),yt:[0,40,80,120],xl:'S',yl:'I (A)',cid:'iml4',
    series:[{pts:pts('Iph'),col:'--blue'},{pts:pts('I2'),col:'--live'},{pts:pts('I10'),col:'--muted',dash:'5 4'}],
    extra:(X,Y)=>`<path d="M${fx(X(Math.log10(s)))} 14V${fx(Y(0))}" stroke="var(--fg)" stroke-dasharray="3 3"/><circle cx="${fx(X(Math.log10(s)))}" cy="${fx(Y(Math.min(r.Iph,ymax)))}" r="5" fill="var(--blue)"/><circle cx="${fx(X(Math.log10(s)))}" cy="${fx(Y(Math.min(r.I2,ymax)))}" r="5" fill="var(--live)"/>`});
  };
  const go=v=>{step=clamp(v,1,5);seen.add(step);segSet(el,'st',step);if(hi&&!['Vph','Iph'].includes(hi)&&!$('#l4c').querySelector(`[data-el="${hi}"]`))hi='';draw();if(hi&&!$('#l4c').querySelector(`[data-el="${hi}"]`)){hi='';draw()}};
  segBind(el,'st',v=>go(+v));$('#l4prev').onclick=()=>go(step-1);$('#l4next').onclick=()=>go(step+1);
  $('#l4s').oninput=e=>{lu=+e.target.value;draw()};
  el.querySelectorAll('[data-sv]').forEach(b=>b.onclick=()=>{lu=Math.round((Math.log10(+b.dataset.sv)+3)/3*100);$('#l4s').value=lu;draw()});
  $('#l4c').addEventListener('click',e=>{const g=e.target.closest('[data-el]');if(g){hi=g.dataset.el;draw()}});
  const steps=stepsUI($('#l4st'),[
   {t:'تعرّف على الشكل (1-8)',x:'اضغط على <b>R<sub>2</sub>/S</b> ثم على <b>N<sub>s</sub> و N<sub>r</sub></b>: الحركة ممثلة بمقاومة تتغير مع الانزلاق.',done:()=>hi==='NsNr'},
   {t:'انسب الدوار إلى الثابت',x:'اضغط «التالي» إلى الشكل (1-9): يختفي المحول وتصبح العناصر R<sub>2</sub>\'/S و X<sub>2</sub>\'.',done:()=>seen.has(2)},
   {t:'افصل مقاومة الحمل',x:'إلى الشكل (1-10): ثم حرّك S. لاحظ أن R<sub>2</sub>\'(1−S)/S تكبر جداً عندما يصغر S.',done:()=>seen.has(3)},
   {t:'بلا حمل ثم الدوار ثابت',x:'اضغط «S ≈ 0» ثم «S = 1»: الأولى دائرة مفتوحة من جهة الثانوي، والثانية مقصورة والتيار كبير جداً.',done:()=>seen.has(3)&&Sx()>0.99},
   {t:'الدائرة التقريبية',x:'انتقل إلى (1-11) ثم (1-12) وقارن التيارات بالدائرة الدقيقة عند <span class="ltr">S = 0.04</span>: الفرق صغير، لذلك يقبل التقريب.',done:()=>seen.has(5)}
  ]);
  draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'حاسبة: نسبة دائرة الدوار إلى العضو الثابت',ref:'ص 24',
   q:'<p>ليست مثالاً من الكتاب (الكتاب لا يعطي مثالاً عددياً لهذه المعادلات): أدخل عناصر الدوار ونسبة اللفات والانزلاق لترى العناصر المنسوبة إلى الثابت ومقاومة الحمل. الأرقام الافتراضية توضيحية.</p>',
   given:[{id:'R2',label:'مقاومة ملفات الدوار',sym:'R_2',unit:'Ω',value:0.1},{id:'X2',label:'ممانعة تسرب الدوار',sym:'X_2',unit:'Ω',value:0.2},{id:'I2',label:'تيار الدوار',sym:'I_2',unit:'A',value:20},{id:'Ns',label:'لفات الثابت لكل وجه',sym:'N_s',unit:'',value:200},{id:'Nr',label:'لفات الدوار لكل وجه',sym:'N_r',unit:'',value:100},{id:'S',label:'الانزلاق',sym:'S',unit:'',value:0.04,step:0.001}],
   solve:g=>{const k=g.Ns/g.Nr,R2p=B.round(g.R2*k*k,4);return [
    {t:'نسبة اللفات:',f:`\\frac{N_s}{N_r}=\\frac{${g.Ns}}{${g.Nr}}`,v:B.round(k,4)},
    {t:'',f:`\\frac{R_2'}{S}=\\frac{R_2}{S}\\left(\\frac{N_s}{N_r}\\right)^2=\\frac{${g.R2}}{${g.S}}\\times ${fm(k,4)}^2`,v:B.round(g.R2/g.S*k*k,4),unit:'Ω'},
    {t:'',f:`X_2'=X_2\\left(\\frac{N_s}{N_r}\\right)^2=${g.X2}\\times ${fm(k,4)}^2`,v:B.round(g.X2*k*k,4),unit:'Ω',final:true},
    {t:'',f:`I_2'=I_2\\left(\\frac{N_r}{N_s}\\right)=${g.I2}\\times\\frac{${g.Nr}}{${g.Ns}}`,v:B.round(g.I2/k,4),unit:'A',final:true},
    {t:'المقاومة المنسوبة نفسها:',f:`R_2'=R_2\\left(\\frac{N_s}{N_r}\\right)^2`,v:R2p,unit:'Ω'},
    {t:'تقسيم R<sub>2</sub>\'/S (ص 24): مقاومة الحمل',f:`R_2'\\left(\\frac{1-S}{S}\\right)=${fm(R2p)}\\times\\frac{1-${g.S}}{${g.S}}`,v:B.round(R2p*(1-g.S)/g.S,4),unit:'Ω',final:true},
    {t:'تحقق (توضيح): القدرة في مقاومة الدوار لا تتغير بالنسبة',f:`I_2^2R_2=${fm(B.round(g.I2*g.I2*g.R2,3))}\\ \\text{W}\\qquad I_2'^2R_2'=${fm(B.round(Math.pow(g.I2/k,2)*R2p,3))}\\ \\text{W}`}]}}
 ],
 quiz:[
  {q:'كيف مُثّلت الحركة في الدائرة المكافئة للمحرك الحثي؟',o:['بمكثف','بالمقاومة R<sub>2</sub>/S','بمصدر جهد','بمحول ثانٍ'],c:1,e:'ص 23.'},
  {q:'ماذا يمثل R<sub>c</sub> في الدائرة المكافئة؟',o:['مقاومة ملفات الثابت','المفاقيد الحديدية','الحمل الميكانيكي','مقاومة الدوار'],c:1,e:'ص 23: مقاومة القلب الحديدي تمثل المفاقيد الحديدية.'},
  {q:'عند نسبة الدوار إلى الثابت، X<sub>2</sub>\' يساوي:',o:['\\(X_2\\,(N_s/N_r)\\)','\\(X_2\\,(N_s/N_r)^2\\)','\\(X_2\\,(N_r/N_s)^2\\)','\\(X_2\\)'],c:1,e:'ص 24.'},
  {q:'القدرة المفقودة في المقاومة R<sub>2</sub>\'(1−S)/S تمثل:',o:['المفاقيد النحاسية','المفاقيد الحديدية','القدرة الميكانيكية المتولدة من المحرك','قدرة الدخل'],c:2,e:'ص 26.'},
  {q:'كيف نحصل على الدائرة المكافئة التقريبية؟',o:['بإهمال تيار اللاحمل ونقل الفرع المغناطيسي إلى جهة الدخل','بحذف R<sub>1</sub>','بجعل S = 1','بحذف الحمل'],c:0,e:'ص 25.'},
  {q:'في الدائرة التقريبية R<sub>eq</sub> يساوي:',o:['R<sub>1</sub> − R<sub>2</sub>\'','R<sub>1</sub> + R<sub>2</sub>\'','R<sub>c</sub> + R<sub>1</sub>','R<sub>2</sub>\'/S'],c:1,e:'ص 26.'},
  {q:'عندما يكون الدوار ثابتاً (S = 1) تصبح مقاومة الحمل R<sub>2</sub>\'(1−S)/S:',o:['∞','صفراً','R<sub>2</sub>\'','R<sub>eq</sub>'],c:1,e:'\\(R_2\'(1-1)/1=0\\): الدائرة مقصورة (ص 29).'}
 ]
});


/* ======================================================================
   Lesson 5 — determining the equivalent-circuit constants (ص 27–35)
   ====================================================================== */
/* book procedure of أمثلة (1-4) و(1-5). g:{conn(1=Y,2=Δ),VL0,IL0,P0,VLs,ILs,Ps,Vdc,Idc}
   o:{bk:{th,Rc,Xm} printed slips, ty:{num:bool,acos:'…'} printed typos, dc:bool, split:'x'|'xr'|null, skin:% } */
function paramSteps(g,o){o=o||{};const Y=g.conn===1,bk=o.bk||{},ty=o.ty||{},out=[];const n=v=>fm(v);
  if(g.conn!==1&&g.conn!==2)out.push({t:'تنبيه: طريقة التوصيل 1 = نجمة و 2 = دلتا. أي رقم آخر يُعامل كدلتا.'});
  const cn=Y?'نجمة':'دلتا';let R1=null;
  if(o.dc){R1=sig(Y?g.Vdc/(2*g.Idc):3*g.Vdc/(2*g.Idc),4);
    out.push({t:`<b>أولاً: من اختبار التيار المستمر</b> تحسب قيمة R<sub>1</sub> من المعادلة ${Y?'(1-14)':'(1-15)'} (التوصيل ${cn}):`,f:Y?`R_1=\\frac{V_{DC}}{2I_{DC}}=\\frac{${n(g.Vdc)}}{2\\times ${n(g.Idc)}}`:`R_1=\\frac{3V_{DC}}{2I_{DC}}=\\frac{3\\times ${n(g.Vdc)}}{2\\times ${n(g.Idc)}}`,v:R1,unit:'Ω',final:!o.skin});
    if(o.skin){const R1a=sig(R1*(1+o.skin/100),4);out.push({t:`نضيف حوالي ${o.skin}% من قيمة المقاومة المقاسة لتأثير الخاصية القشرية (ص 31):`,f:`R_1=${n(R1)}\\times(1+${n(o.skin/100)})`,v:R1a,unit:'Ω',final:true});R1=R1a}}
  // no-load
  const Vph=Y?sig(g.VL0/SQ3,4):g.VL0,I10=Y?g.IL0:sig(g.IL0/SQ3,4);
  out.push({t:`<b>${o.dc?'ثانياً':'أولاً'}: من نتائج تجربة عدم الحمل</b> نحسب R<sub>c</sub> و X<sub>m</sub>. بما أن الملفات موصلة على شكل ${cn} إذاً:`,f:Y?`V_{ph}=\\frac{V_L}{\\sqrt3}=\\frac{${n(g.VL0)}}{\\sqrt3}`:`V_{ph}=V_L`,v:Vph,unit:'V'});
  out.push({t:'',f:Y?`I_{10}=I_L`:`I_{10}=\\frac{I_L}{\\sqrt3}=\\frac{${n(g.IL0)}}{\\sqrt3}`,v:I10,unit:'A'});
  const cr=g.P0/(3*Vph*I10);if(!(cr>0&&cr<1)){out.push({t:'تعذّر الحساب: يجب أن تكون P<sub>10</sub> أقل من 3V<sub>ph</sub>I<sub>10</sub> (معامل القدرة بين 0 و 1). راجع القراءات.'});return out}
  const cs=sig(cr,3),th=bk.th!=null?bk.th:B.round(Math.acos(cs)/D,2);
  out.push({t:'باستخدام المعادلات من (1-6) إلى (1-10):'+(ty.num?' <span class="sub">(البسط هنا كما طُبع في الكتاب: 127 بدل 600)</span>':''),f:`\\cos\\theta=\\frac{P_{10}}{3V_{ph}I_{10}}=\\frac{${ty.num?n(Vph):n(g.P0)}}{3\\times ${n(Vph)}\\times ${n(I10)}}`,v:cs});
  out.push({t:ty.acos?'<span class="sub">(داخل القوس كما طُبع في الكتاب: 0.0787 بدل 0.108)</span>':'',f:`\\theta=\\cos^{-1}(${ty.acos||n(cs)})`,v:th,unit:'°'});
  const Rc=bk.Rc!=null?bk.Rc:B.round(Vph/(I10*cs),2),Xm=bk.Xm!=null?bk.Xm:B.round(Vph/(I10*Math.sin(th*D)),3);
  out.push({t:'',f:`R_c=\\frac{V_{ph}}{I_{10}\\cos\\theta}=\\frac{${n(Vph)}}{${n(I10)}\\times ${n(cs)}}`,v:Rc,unit:'Ω',final:true});
  out.push({t:'',f:`X_m=\\frac{V_{ph}}{I_{10}\\sin\\theta}=\\frac{${n(Vph)}}{${n(I10)}\\times\\sin(${n(th)}^\\circ)}`,v:Xm,unit:'Ω',final:true});
  // blocked rotor
  const Vsc=Y?sig(g.VLs/SQ3,4):g.VLs,Isc=Y?g.ILs:sig(g.ILs/SQ3,4);
  out.push({t:`<b>${o.dc?'ثالثاً':'ثانياً'}: من نتائج تجربة عدم الحركة</b> نحسب R<sub>eq</sub> و X<sub>eq</sub>. بما أن الملفات موصلة على شكل ${cn}:`,f:Y?`V_{sc}=\\frac{V_L}{\\sqrt3}=\\frac{${n(g.VLs)}}{\\sqrt3}`:`V_{sc}=V_L`,v:Vsc,unit:'V'});
  out.push({t:'',f:Y?`I_{sc}=I_L`:`I_{sc}=\\frac{I_L}{\\sqrt3}=\\frac{${n(g.ILs)}}{\\sqrt3}`,v:Isc,unit:'A'});
  const Req=sig(g.Ps/(3*Isc*Isc),4),Zeq=sig(Vsc/Isc,4);
  out.push({t:'باستخدام المعادلات من (1-11) إلى (1-13):',f:`R_{eq}=\\frac{P_{sc}}{3I_{sc}^2}=\\frac{${n(g.Ps)}}{3\\times ${n(Isc)}^2}`,v:Req,unit:'Ω',final:true});
  out.push({t:'',f:`Z_{eq}=\\frac{V_{sc}}{I_{sc}}=\\frac{${n(Vsc)}}{${n(Isc)}}`,v:Zeq,unit:'Ω'});
  if(Zeq<=Req){out.push({t:'تعذّر الحساب: Z<sub>eq</sub> يجب أن تكون أكبر من R<sub>eq</sub>. راجع قراءات تجربة عدم الحركة.'});return out}
  const Xeq=sig(Math.sqrt(Zeq*Zeq-Req*Req),4);
  out.push({t:'',f:`X_{eq}=\\sqrt{Z_{eq}^2-R_{eq}^2}=\\sqrt{${n(Zeq)}^2-${n(Req)}^2}`,v:Xeq,unit:'Ω',final:true});
  const res={Vph,I10,cs,th,Rc,Xm,Req,Zeq,Xeq,R1};
  if(o.dc&&R1!=null){const R2=B.round(Req-R1,4);res.R2=R2;out.push({t:'بما أن R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>\' و R<sub>1</sub> معلومة إذاً:',f:`R_2'=R_{eq}-R_1=${n(Req)}-${n(R1)}`,v:R2,unit:'Ω',final:true});
    if(R2<=0)out.push({t:'تنبيه: الناتج سالب أو صفر — R<sub>1</sub> المقاسة أكبر من R<sub>eq</sub>، راجع القراءات.'})}
  if(o.split==='xr'){const r=B.round(Req/2,4);res.R1=res.R2=r;out.push({t:'بما أن R<sub>1</sub> = R<sub>2</sub>\' و R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub>\':',f:`R_1=R_2'=\\frac{R_{eq}}{2}=\\frac{${n(Req)}}{2}`,v:r,unit:'Ω',final:true})}
  if(o.split==='x'||o.split==='xr'){const x=B.round(Xeq/2,4);res.X1=x;out.push({t:'بما أن X<sub>1</sub> = X<sub>2</sub>\' و X<sub>eq</sub> = X<sub>1</sub> + X<sub>2</sub>\' إذاً:',f:`X_1=X_2'=\\frac{X_{eq}}{2}=\\frac{${n(Xeq)}}{2}`,v:x,unit:'Ω',final:true})}
  out.res=res;return out}
const G44=[{id:'conn',label:'التوصيل (1 = نجمة، 2 = دلتا)',sym:'',unit:'',value:1,step:1,min:1,max:2},
 {id:'VL0',label:'عدم الحمل: جهد الخط',sym:'V_L',unit:'V',value:220},{id:'P0',label:'عدم الحمل: القدرة',sym:'P_{10}',unit:'W',value:600},{id:'IL0',label:'عدم الحمل: تيار الخط',sym:'I_L',unit:'A',value:20},
 {id:'VLs',label:'عدم الحركة: جهد الخط',sym:'V_L',unit:'V',value:30},{id:'Ps',label:'عدم الحركة: القدرة',sym:'P_{sc}',unit:'W',value:1500},{id:'ILs',label:'عدم الحركة: تيار الخط',sym:'I_L',unit:'A',value:50}];
const G45=[{id:'conn',label:'التوصيل (1 = نجمة، 2 = دلتا)',sym:'',unit:'',value:2,step:1,min:1,max:2},
 {id:'VLs',label:'الدائرة المقصورة: جهد الخط',sym:'V_L',unit:'V',value:39.3},{id:'ILs',label:'الدائرة المقصورة: تيار الخط',sym:'I_L',unit:'A',value:34.64},{id:'Ps',label:'الدائرة المقصورة: القدرة',sym:'P_{sc}',unit:'W',value:1265},
 {id:'VL0',label:'الدائرة المفتوحة: جهد الخط',sym:'V_L',unit:'V',value:127},{id:'IL0',label:'الدائرة المفتوحة: تيار الخط',sym:'I_L',unit:'A',value:7.53},{id:'P0',label:'الدائرة المفتوحة: القدرة',sym:'P_{10}',unit:'W',value:179},
 {id:'Vdc',label:'التيار المستمر: الجهد',sym:'V_{DC}',unit:'V',value:9},{id:'Idc',label:'التيار المستمر: التيار',sym:'I_{DC}',unit:'A',value:20}];
const BK44={th:85.48,Rc:80.68},TY44={num:true},BK45={Rc:270.78,Xm:29.435},TY45={acos:'0.0787'};
const Q44='<p>«أثناء تجربتي عدم الحمل وعدم الحركة لمحرك حثي ثلاثي الأوجه ملفاته موصلة على شكل <b>نجمة</b> كانت النتائج كما يلي:</p><table class="tt"><thead><tr><th>تجربة عدم الحركة</th><th>تجربة عدم الحمل</th></tr></thead><tbody><tr><td>V<sub>L</sub> = 30 V</td><td>V<sub>L</sub> = 220 V</td></tr><tr><td>P<sub>sc</sub> = 1500 W</td><td>P<sub>10</sub> = 600 W</td></tr><tr><td>I<sub>L</sub> = 50 A</td><td>I<sub>L</sub> = 20 A</td></tr></tbody></table><p>احسب مكونات الدائرة المكافئة التقريبية لهذا المحرك.»</p>';
const Q45='<p>«محرك حثي ثلاثي الأوجه ملفاته موصلة على شكل <b>دلتا</b>، أجريت له اختبارات تحديد عناصر الدائرة المكافئة فأعطى النتائج التالية:</p><table class="tt"><thead><tr><th>اختبار الدائرة المقصورة</th><th>اختبار الدائرة المفتوحة</th><th>اختبار التيار المستمر</th></tr></thead><tbody><tr><td>V<sub>L</sub> = 39.3 V</td><td>V<sub>L</sub> = 127 V</td><td>V<sub>DC</sub> = 9 V</td></tr><tr><td>I<sub>L</sub> = 34.64 A</td><td>I<sub>L</sub> = 7.53 A</td><td>I<sub>DC</sub> = 20 A</td></tr><tr><td>P<sub>sc</sub> = 1265 W</td><td>P<sub>10</sub> = 179 W</td><td>—</td></tr></tbody></table><p>احسب مكونات الدائرة المكافئة إذا كان \\(X_1=X_2\'\\).»</p>';

/* الشكل (1-13) / (1-15): two-wattmeter test circuit */
function testCktSVG(o){o=o||{};const locked=!!o.locked,on=(o.V||0)>0,c=on?'w flow':'w',vc=on?'w live':'w',r=o.rd||{};
  let s=`<svg viewBox="0 0 640 250" role="img" aria-label="${locked?'اختبار إعاقة الحركة':'اختبار اللاحمل'}">`;
  s+=`<rect x="14" y="44" width="104" height="152" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`+arT(66,108,'مصدر جهد',{fs:12})+arT(66,126,'متردد ثلاثي',{fs:12})+arT(66,144,'الأوجه',{fs:12})+arT(66,162,'(متغير)',{fs:11,col:'--muted'});
  s+=`<path class="${c}" d="M118 70H430"/><path class="${on?'w live':'w'}" d="M118 120H430"/><path class="${c}" d="M118 170H430"/>`;
  s+=`<path class="${c}" d="M430 70Q458 70 466 96M430 120H458M430 170Q458 170 466 144"/>`;
  // wattmeters
  [[70,'W1',r.W1],[170,'W2',r.W2]].forEach(([y,l,v])=>{s+=`<rect x="150" y="${y-14}" width="56" height="28" rx="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(178,y+4,l,'b')+`<path class="${vc}" d="M178 ${y+(y<120?14:-14)}V120" stroke-dasharray="4 3"/>`+(v!=null?S.t(178,y+(y<120?-20:34),v,''):'')});
  // ammeter
  s+=`<circle cx="270" cy="70" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(270,75,'A','')+(r.A!=null?S.t(270,44,r.A,''):'');
  // voltmeter between L1 and L2
  s+=`<path class="${vc}" d="M340 70V80M340 110V120"/><circle cx="340" cy="95" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(340,100,'V','')+(r.V!=null?S.t(360,99,r.V,'','start'):'');
  // motor
  s+=`<circle cx="500" cy="120" r="44" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+S.t(500,116,'M','',null,20)+S.t(500,136,'3~','m');
  s+=`<g id="tcSpin" transform="rotate(${fx(o.ang||0)} 500 120)"><path d="M500 84V96" stroke="var(--blue)" stroke-width="4" stroke-linecap="round"/></g>`;
  s+=`<rect x="544" y="113" width="80" height="14" fill="var(--fg)"/>`;
  if(locked)s+=`<rect x="580" y="96" width="30" height="48" fill="url(#imHatch3)" stroke="var(--fg)" stroke-width="1.6"/><defs><pattern id="imHatch3" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--surface-2)"/><path d="M0 0V6" stroke="var(--fg)"/></pattern></defs>`;
  s+=arT(584,174,locked?'العمود مثبت تماماً':'العمود بدون حمل',{fs:12.5});
  s+=S.t(126,62,'1','m','start')+S.t(126,112,'2','m','start')+S.t(126,162,'3','m','start');
  return s+'</svg>'}
/* الشكل (1-14): no-load phasor diagram */
function phasorNLSVG(th){const ox=40,oy=60,L=220,t=th*D;const I=170,ex=ox+I*Math.cos(t),ey=oy+I*Math.sin(t);
  let s=`<svg viewBox="0 0 300 250" role="img" aria-label="المخطط الاتجاهي في حالة اللاحمل">`;
  s+=arrow(ox,oy,ox+L,oy,'--fg',2.4)+S.t(ox+L+4,oy+5,'Vph','','start');
  s+=`<path d="M${fx(ex)} ${fx(ey)}V${oy}M${fx(ex)} ${fx(ey)}H${ox}" stroke="var(--muted)" stroke-dasharray="4 3" fill="none"/>`;
  s+=arrow(ox,oy,ex,oy,'--blue',3)+S.t((ox+ex)/2+6,oy-8,'Ic','b');
  s+=arrow(ox,oy,ox,ey,'--live',3)+`<text class="txt" x="${ox-6}" y="${fx((oy+ey)/2)}" text-anchor="end" style="fill:var(--live)">Im</text>`;
  s+=arrow(ox,oy,ex,ey,'--stop',3)+`<text class="txt" x="${fx(ex+6)}" y="${fx(ey+4)}" style="fill:var(--stop)">I10</text>`;
  const ar=34;s+=`<path d="M${ox+ar} ${oy}A${ar} ${ar} 0 0 1 ${fx(ox+ar*Math.cos(t))} ${fx(oy+ar*Math.sin(t))}" fill="none" stroke="var(--fg)"/>`+S.t(ox+ar+10,oy+24,'θ='+fm(th,1)+'°','','start');
  return s+'</svg>'}
/* الشكل (1-16) / (1-17): DC test */
function dcTestSVG(o){o=o||{};const Y=o.conn===1,on=(o.V||0)>0,c=on?'w flow':'w';const r=o.rd||{};
  let s=`<svg viewBox="0 0 560 260" role="img" aria-label="${Y?'قياس مقاومة الملفات نجمة':'قياس مقاومة الملفات دلتا'}">`;
  // source
  s+=`<path class="${c}" d="M60 40H330M60 220H300"/><path class="w" d="M60 40V112M60 148V220"/><path d="M44 112H76M52 122H68M44 132H76M52 142H68" stroke="var(--fg)" stroke-width="2.4"/>`+arrow(34,160,90,96,'--fg',1.5)+S.t(84,108,'+','')+S.t(84,156,'−','');
  s+=`<path class="w ${on?'live':''}" d="M130 40V112M130 148V220"/><circle cx="130" cy="130" r="17" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(130,135,'V','')+S.t(156,124,'VDC','','start')+(r.V!=null?S.t(156,140,r.V,'b','start'):'');
  s+=`<circle cx="210" cy="40" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(210,45,'A','')+arrow(240,22,280,22,'--blue',1.8)+S.t(260,16,'IDC','b')+(r.A!=null?S.t(210,76,r.A,'b'):'');
  s+=`<circle cx="410" cy="140" r="104" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;
  const P=[[410,64],[344,190],[476,190]];
  if(Y){const C=[410,150];s+=`<path class="${c}" d="M330 40H410V64"/><path class="${c}" d="M300 220V190H344"/>`;
    s+=zig(P[0][0],P[0][1],C[0],C[1],5,on?'flow':'')+zig(P[1][0],P[1][1],C[0],C[1],5,on?'flow':'')+zig(P[2][0],P[2][1],C[0],C[1],5,'');
    s+=S.t(428,108,'R1','','start')+S.t(360,160,'R1','','end')+S.t(458,160,'R1','','start');}
  else{s+=`<path class="${c}" d="M330 40H410V64"/><path class="${c}" d="M300 220V190H344"/>`;
    s+=zig(P[0][0],P[0][1],P[1][0],P[1][1],5,on?'flow':'')+zig(P[0][0],P[0][1],P[2][0],P[2][1],5,on?'flow':'')+zig(P[1][0],P[1][1],P[2][0],P[2][1],5,on?'flow':'');
    s+=S.t(362,124,'R1','','end')+S.t(458,124,'R1','','start')+S.t(410,212,'R1','');}
  P.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--fg)"/>`});
  s+=arT(410,252,Y?'ملفان على التوالي: 2R₁':'ملف واحد على التوازي مع ملفين على التوالي: ⅔R₁',{fs:12.5});
  return s+'</svg>'}

const MOT={
 m4:{name:'محرك مثال (1-4) — نجمة',conn:1,VLr:220,NL:{V:220,I:20,P:600},BR:{V:30,I:50,P:1500},R1:0.1,Idc:50,dcIll:1,book:{NL:[220,20,600],BR:[30,50,1500],DC:null}},
 m5:{name:'محرك مثال (1-5) — دلتا',conn:2,VLr:127,NL:{V:127,I:7.53,P:179},BR:{V:39.3,I:34.64,P:1265},R1:0.675,Idc:20,dcIll:0,book:{NL:[127,7.53,179],BR:[39.3,34.64,1265],DC:[9,20]}}};

B.lesson({
 id:'u1-l5',unit:1,order:5,pages:'27–35',
 title:'تعيين ثوابت الدائرة المكافئة: اختبارات اللاحمل وعدم الحركة والتيار المستمر',
 summary:'ثلاثة اختبارات تحدد عناصر الدائرة المكافئة: اختبار اللاحمل يعطي Rc و Xm، واختبار إعاقة الحركة يعطي Req و Xeq، واختبار التيار المستمر يعطي R1. منضدة اختبار افتراضية تأخذ فيها القراءات بنفسك، والمثالان (1-4) و(1-5).',
 theory:[
  {h:'تعيين ثوابت الدائرة المكافئة التقريبية',ref:'ص 27',html:'<p>«تعتبر الدائرة المكافئة للمحرك الحثي أداةً مفيدةً جداً لتحديد استجابة المحرك عند التغير في الأحمال، وإذا أردنا تطبيقها على آلة حقيقية فإن ذلك يتطلب تحديد قيم ثوابت الآلة \\((R_1, R_2, X_1, X_2, R_c, X_m)\\). ولكي يتم تحديد قيم هذه الثوابت يتوجب القيام عملياً بالاختبارات التالية:»</p><table class="tt"><thead><tr><th>الاختبار</th><th>حالة الدوار</th><th>القدرة المقروءة تمثل تقريباً</th><th>يعطي</th></tr></thead><tbody><tr><td>اللاحمل (الدائرة المفتوحة)</td><td>يدور حراً، S ≈ 0</td><td>المفاقيد الحديدية (الثابتة)</td><td>\\(R_c, X_m\\)</td></tr><tr><td>إعاقة الحركة (الدائرة المقصورة)</td><td>ممنوع من الحركة، S = 1</td><td>المفاقيد النحاسية (المتغيرة)</td><td>\\(R_{eq}, X_{eq}\\)</td></tr><tr><td>التيار المستمر</td><td>ساكن</td><td>—</td><td>\\(R_1\\)</td></tr></tbody></table>'},
  {h:'اختبار اللاحمل No load Test',ref:'ص 27–28',html:`<p>«في هذا الاختبار يوصل المحرك كما هو موضح في الشكل (1-13) ثم يسلط <b>الجهد المقنن</b> على أطراف المحرك ويترك العضو الدوار يدور بحرية تامة بدون أي حمل، بعد ذلك تسجل قراءات الأجهزة.» القدرة الكلية هي مجموع قراءتي الواطميتر:</p>$$P_{10}=W_1+W_2$$<p>«مع ملاحظة أن <b>قيم الجهد والتيار المقروءة هي للخط</b> وأن <b>القدرة المقروءة تمثل تقريباً المفاقيد الحديدية (المفاقيد الثابتة)</b>.»</p>`},
  {fig:'(1-13)',ref:'ص 27',caption:'اختبار اللاحمل للمحرك الحثي ثلاثي الأوجه: ملف تيار W1 والأميتر في الخط 1، وملف تيار W2 في الخط 3، والفولتميتر بين الخطين 1 و2، وملفا جهد الواطميترين إلى الخط 2 (طريقة الواطميترين). العمود بدون حمل.',draw:()=>box(testCktSVG({}),640,1)},
  {html:`<p>«حيث أن العضو الدوار يدور بدون حمل فهذا يعني أن سرعة دورانه مساوية تقريباً للسرعة التزامنية مما يعني أن <b>الانزلاق صغير جداً (S&lt;0.001)</b> أو لنقل إنه يساوي صفراً تقريباً. وعند التعويض عن قيمة الانزلاق في هذه الحالة في المقاومة \\(R_2'\\left(\\frac{1-S}{S}\\right)\\) في الدائرة المكافئة نجد أن قيمة هذه المقاومة تصل إلى ما لانهاية \\(R_2'\\left(\\frac{1-0}{0}\\right)=\\infty\\) وهذا يعني أن الدائرة المكافئة أصبحت <b>مفتوحة من جهة الثانوي</b>.» <span class="ref">ص 27</span></p>
   <p>«ولذلك فإن هذا الاختبار يمكن أن يسمى <b>اختبار الدائرة المفتوحة</b> أسوةً بالمحول. بما أن جهة الثانوي أصبحت مفتوحة فهذا يعني أن تيار الاختبار سيمر من خلال \\(R_c, X_m\\) فقط. لذلك يمكن من نتائج هذه التجربة وبعد إجراء حسابات بسيطة تحديد قيم \\(R_c, X_m\\) كما يلي مع الأخذ في الاعتبار طريقة توصيل ملفات المحرك أهي على شكل نجمة أو دلتا.» «من الدائرة المكافئة في الشكل رقم (1-12) يمكن إيجاد قيم \\(R_c, X_m\\) كما يلي:» <span class="ref">ص 28</span></p>
   $$R_c=\\frac{V_{ph}}{I_c} \\qquad (1\\text{-}6)$$ $$X_m=\\frac{V_{ph}}{I_m} \\qquad (1\\text{-}7)$$
   <p>«من المخطط الاتجاهي: شكل (1-14) يمكننا إيجاد قيم \\(I_m, I_c\\) بدلالة \\(I_{10}\\) كما يلي:»</p>
   $$I_c=I_{10}\\cos\\theta \\qquad (1\\text{-}8)$$ $$I_m=I_{10}\\sin\\theta \\qquad (1\\text{-}9)$$ $$\\theta=\\cos^{-1}\\left(\\frac{P_{10}}{3V_{ph}I_{10}}\\right) \\qquad (1\\text{-}10)$$`},
  {fig:'(1-14)',ref:'ص 28',caption:'المخطط الاتجاهي في حالة اللاحمل: V<sub>ph</sub> مرجع أفقي، و I<sub>c</sub> في طوره، و I<sub>m</sub> متأخر 90°، و I<sub>10</sub> بينه وبين V<sub>ph</sub> الزاوية θ (مرسوم هنا بزاوية مثال 1-5)',draw:()=>box(phasorNLSVG(83.8),300)},
  {h:'اختبار إعاقة الحركة Locked Rotor Test',ref:'ص 28–29',html:`<p>«في هذا الاختبار يوصل المحرك كما هو موضح في الشكل (1-15) ولكن <b>العضو الدوار يمنع من الحركة بأي وسيلة مناسبة</b>، بعد ذلك يتم <b>زيادة الجهد المسلط على أطراف المحرك تدريجياً حتى يصل التيار المار في ملفات المحرك إلى القيمة المقننة</b>. وذلك لأن توصيل المحرك على الجهد المقنن سوف يتسبب في مرور تيار كبير جداً قد يتلف ملفات المحرك، بعد ذلك تسجل قراءات الأجهزة.»</p>$$P_{sc}=W_1+W_2$$<p>«مع ملاحظة أن قيم الجهد والتيار المقروءة هي للخط وأن <b>القدرة المقروءة تمثل تقريباً المفاقيد النحاسية (المفاقيد المتغيرة)</b>.»</p>`},
  {fig:'(1-15)',ref:'ص 29',caption:'اختبار إعاقة الحركة للمحرك الحثي ثلاثي الأوجه: نفس دائرة الشكل (1-13)، لكن العمود مثبت تماماً',draw:()=>box(testCktSVG({locked:1}),640,1)},
  {html:`<p>«حيث أن العضو الدوار ثابت في هذه الحالة فإن ذلك يعني أن <b>الانزلاق مساوٍ للواحد (S=1)</b> وعند التعويض عن قيمته في المقاومة \\(R_2'\\left(\\frac{1-S}{S}\\right)\\) في الدائرة المكافئة نجد أن قيمة هذه المقاومة أصبحت صفراً \\(R_2'\\left(\\frac{1-1}{1}\\right)=0\\) وهذا يعني أن الدائرة المكافئة <b>أصبحت مقصورة من جهة الثانوي</b>، ولذلك فإن هذا الاختبار يسمى أحياناً <b>اختبار الدائرة المقصورة</b>.»</p>
   <p>«بما أن جهة الثانوي أصبحت مقصورة فهذا يعني أن تيار الاختبار سيمر من خلال \\(R_{eq}, X_{eq}\\) فقط. أي أن \\((I_{ph}=I_2')\\)، لذلك يمكن من نتائج هذه التجربة وبعد إجراء حسابات بسيطة تحديد قيم \\(R_{eq}, X_{eq}\\) كما يلي، مع الأخذ في الاعتبار طريقة توصيل ملفات المحرك هل على شكل نجمة أو دلتا.»</p>
   $$R_{eq}=\\frac{P_{sc}}{3I_{sc}^2} \\qquad (1\\text{-}11)$$ $$Z_{eq}=\\frac{V_{sc}}{I_{sc}} \\qquad (1\\text{-}12)$$ $$X_{eq}=\\sqrt{Z_{eq}^2-R_{eq}^2} \\qquad (1\\text{-}13)$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — قيم الخط وقيم الوجه:</b> الأجهزة تقرأ قيم <b>الخط</b>، أما المعادلات (1-6) إلى (1-13) فتستعمل قيم <b>الوجه</b> (\\(V_{sc}\\) و \\(I_{sc}\\) قيم وجه، وهذا يتضح من الأمثلة لا من نص المعادلات). التحويل كما في المثالين (1-4) و(1-5):<table class="tt"><thead><tr><th>التوصيل</th><th>جهد الوجه</th><th>تيار الوجه</th></tr></thead><tbody><tr><td>نجمة Y</td><td>\\(V_{ph}=V_L/\\sqrt3\\)</td><td>\\(I_{ph}=I_L\\)</td></tr><tr><td>دلتا Δ</td><td>\\(V_{ph}=V_L\\)</td><td>\\(I_{ph}=I_L/\\sqrt3\\)</td></tr></tbody></table>والعدد 3 في \\(3V_{ph}I_{10}\\) و \\(3I_{sc}^2\\) لأن القدرة المقروءة لثلاثة أوجه.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — قراءة سالبة لأحد الواطميترين:</b> في اختبار اللاحمل معامل القدرة صغير جداً (أقل من 0.5)، وعندها يقرأ أحد الواطميترين قيمة <b>سالبة</b> (ينحرف مؤشره عكسياً فتُعكس أطراف ملف الجهد وتُسجل القراءة بإشارة سالب). القدرة الكلية تبقى \\(W_1+W_2\\) بالإشارة. سترى ذلك في منضدة الاختبار.'},
  {h:'اختبار التيار المستمر DC Test',ref:'ص 30–31',html:'<p>«هذا الاختبار يجرى من أجل <b>قياس مقاومة ملفات العضو الثابت \\(R_1\\)</b> وذلك بتوصيل ملفات المحرك كما هو موضح في الشكل (1-16) أو الشكل (1-17).»</p>'},
  {fig:'(1-16)',ref:'ص 30',caption:'دائرة قياس مقاومة ملفات العضو الثابت إذا كانت موصلة نجمة: المصدر بين طرفين، فيمر التيار في ملفين على التوالي',draw:()=>box(dcTestSVG({conn:1}),560)},
  {fig:'(1-17)',ref:'ص 30',caption:'دائرة قياس مقاومة ملفات العضو الثابت إذا كانت موصلة دلتا: ملف واحد على التوازي مع ملفين على التوالي',draw:()=>box(dcTestSVG({conn:2}),560)},
  {html:`<p>«في هذا الاختبار يتم <b>زيادة الجهد تدريجياً حتى يصل التيار المار في ملفات المحرك إلى القيمة المقننة</b> وذلك لكي ترتفع درجة حرارة الملفات كما هو الحال في وضع التشغيل الطبيعي، وذلك لأن المقاومة تتغير بتغير درجة الحرارة ثم تسجل بعد ذلك قيمة الجهد والتيار وتحسب المقاومة كما يلي:» <span class="ref">ص 30–31</span></p>
   <p>في حالة التوصيلة نجمة:</p>$$2R_1=\\frac{V_{DC}}{I_{DC}} \\quad\\Rightarrow\\quad R_1=\\frac{V_{DC}}{2I_{DC}} \\qquad (1\\text{-}14)$$
   <p>في حالة التوصيلة دلتا:</p>$$\\frac{2}{3}R_1=\\frac{V_{DC}}{I_{DC}} \\quad\\Rightarrow\\quad R_1=\\frac{3V_{DC}}{2I_{DC}} \\qquad (1\\text{-}15)$$
   <p>«وحيث أن المحرك يعمل بالتيار المتردد فيجب أن يؤخذ <b>تأثير الخاصية القشرية skin effect</b> في الاعتبار وذلك <b>بإضافة حوالي 10% من قيمة المقاومة المقاسة</b> عند مرور التيار المتردد داخل الملفات.» <span class="ref">ص 31</span></p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — من أين جاءت 2/3؟</b> في الدلتا: ملف \\(R_1\\) على التوازي مع ملفين على التوالي \\(2R_1\\)، فالمقاومة بين الطرفين \\(\\frac{R_1\\times 2R_1}{R_1+2R_1}=\\frac{2}{3}R_1\\). وفي النجمة ملفان على التوالي \\(2R_1\\).'},
  {err:'اسم الاختبار غير موحد في الكتاب: الفهرس «اختبار عدم الحركة»، والمتن «اختبار إعاقة الحركة Locked Rotor Test»، ومثال (1-4) «تجربة عدم الحركة»، ومثال (1-5) «اختبار الدائرة المقصورة»، والتمارين «تجربة القصر». وكذلك «اللاحمل / عدم الحمل / الدائرة المفتوحة». كلها تعني الاختبار نفسه.'},
  {h:'أمثلة محلولة',ref:'ص 32–35',html:'<p>المثالان (1-4) و(1-5) محلولان في تبويب «الأمثلة المحلولة» مرتين: <b>كما في الكتاب</b> (بأرقامه المطبوعة) و<b>المصحح</b>. يمكنك تغيير التوصيل (1 = نجمة، 2 = دلتا) والقراءات.</p><table class="tt"><thead><tr><th>المثال</th><th>R<sub>c</sub></th><th>X<sub>m</sub></th><th>R<sub>eq</sub></th><th>Z<sub>eq</sub></th><th>X<sub>eq</sub></th><th>R<sub>1</sub></th><th>R<sub>2</sub>\'</th><th>X<sub>1</sub> = X<sub>2</sub>\'</th></tr></thead><tbody><tr><td>(1-4) نجمة</td><td>80.68</td><td>6.37</td><td>0.2</td><td>0.3464</td><td>0.2828</td><td>—</td><td>—</td><td>—</td></tr><tr><td>(1-5) دلتا</td><td>270.78</td><td>29.435</td><td>1.054</td><td>1.965</td><td>1.658</td><td>0.675</td><td>0.379</td><td>0.829</td></tr></tbody></table><p class="sub">القيم بالأوم كما طُبعت في الكتاب.</p>'},
  {err:'<b>مثال (1-4) ص 32:</b> (١) في سطر \\(\\cos\\theta\\) طُبع البسط <b>127</b> والصحيح <b>\\(P_{10}=600\\)</b>: \\(\\cos\\theta=\\frac{600}{3\\times127\\times20}=0.0787\\)؛ الناتج 0.0787 صحيح. (٢) طُبع \\(\\theta=85.48^\\circ\\) و \\(R_c=80.68\\ \\Omega\\) بالبتر، والتقريب الصحيح \\(85.49^\\circ\\) و \\(80.69\\ \\Omega\\) (الفرق صغير جداً، و \\(X_m=6.37\\) لا يتغير).'},
  {err:'<b>مثال (1-5) ص 34:</b> (١) طُبع \\(\\theta=\\cos^{-1}(0.0787)\\) (منقولة من المثال السابق) والصحيح \\(\\cos^{-1}(0.108)\\)؛ الناتج 83.8° صحيح. (٢) طُبع \\(R_c=\\frac{127}{4.347\\times0.108}=270.78\\ \\Omega\\) والصحيح <b>270.51 Ω</b>. (٣) طُبع \\(X_m=29.435\\ \\Omega\\) والصحيح <b>29.387 Ω</b>. (٤) ذكر الكتاب في ص 31 إضافة حوالي 10% للخاصية القشرية، لكن المثال لم يضفها: لو أضيفت لكانت \\(R_1=0.675\\times1.1=0.7425\\ \\Omega\\) و \\(R_2\'=1.054-0.7425=0.3115\\ \\Omega\\) بدل 0.379. الحل <b>المصحح</b> في تبويب الأمثلة يطبق التصحيحات الأربعة، ومنضدة الاختبار في المختبر فيها مفتاح «كما في الكتاب / المصحح».'}
 ],
 lab:(el)=>{
  let mk='m5',test='NL',mode='book',V=0,ang=0,warned=0;const rec={};const did={};
  el.innerHTML=`<div class="grid im-lab">
   <div class="panel c12"><h2>منضدة الاختبار <small>مبنية على الأشكال (1-13) و(1-15) و(1-16) و(1-17) ص 27–31</small></h2>
    <div class="im-row"><div><div class="sub">المحرك</div>${segHTML('mk',[['m5','محرك مثال (1-5) — دلتا'],['m4','محرك مثال (1-4) — نجمة']],mk)}</div>
     <div><div class="sub">الاختبار</div>${segHTML('ts',[['NL','اللاحمل'],['BR','إعاقة الحركة'],['DC','التيار المستمر']],test)}</div></div>
    <p class="sub">المحرك الافتراضي مبني من قراءات الكتاب: عند جهد الكتاب تقرأ الأجهزة أرقام الكتاب تماماً، وعند جهد آخر تتغير القراءات بنسبة الجهد. <span id="l5ill"></span></p></div>
   <div class="panel c7"><h2 id="l5h"></h2><div class="svgbox im-wide" id="l5c" style="max-width:680px;margin-inline:auto"></div>
    <div id="l5sl"></div><div class="im-fine" id="l5fine"></div>
    <div class="im-row"><button class="btn primary" id="l5rec">سجّل القراءات</button><button class="btn" id="l5zero">أعد الجهد إلى الصفر</button><button class="btn" id="l5full">طبّق الجهد المقنن مباشرة</button></div></div>
   <div class="panel c5"><h2>قراءات الأجهزة</h2><div class="im-meters" id="l5m"></div><div id="l5warn"></div><div id="l5ph"></div></div>
   <div class="panel c12"><h2>القراءات المسجلة والحساب بطريقة الكتاب</h2>
    <div class="im-row"><span class="sub">طريقة الحساب:</span>${segHTML('md',[['book','كما في الكتاب'],['fixed','المصحح']],mode)}</div>
    <div id="l5tbl"></div><div id="l5res"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const M=()=>MOT[mk];
  const vmax=()=>test==='DC'?(M().conn===1?2*M().R1:2/3*M().R1)*M().Idc*1.4:M().VLr*(test==='NL'?1.15:1);
  const vstep=()=>test==='DC'?0.01:0.1;
  const read=()=>{const m=M();if(test==='DC'){const Rt=m.conn===1?2*m.R1:2/3*m.R1;const v=B.round(V,2),i=B.round(v/Rt,2);return {V:v,I:i}}
   const T=test==='NL'?m.NL:m.BR,k=V/T.V,v=B.round(V,1),i=B.round(T.I*k,2),p=B.round(T.P*k*k,0);let w1=0,w2=0,phi=0;
   if(i>0){const pf=clamp(T.P/(SQ3*T.V*T.I),0,1);phi=Math.acos(pf)/D;w1=B.round(v*i*Math.cos((30-phi)*D),0);w2=p-w1}return {V:v,I:i,P:p,W1:w1,W2:w2,phi}};
  const ratedI=()=>test==='DC'?M().Idc:test==='BR'?M().BR.I:null;
  const setV=v=>{V=clamp(B.round(v,test==='DC'?2:1),0,vmax());const r=$('#l5v');if(r)r.value=V;draw()};
  const ui=()=>{const tl={NL:'اختبار اللاحمل <small>الشكل (1-13) ص 27</small>',BR:'اختبار إعاقة الحركة <small>الشكل (1-15) ص 29</small>',DC:`اختبار التيار المستمر <small>الشكل ${M().conn===1?'(1-16)':'(1-17)'} ص 30</small>`}[test];$('#l5h').innerHTML=tl;
   $('#l5sl').innerHTML=sl('l5v',test==='DC'?'جهد المصدر المستمر':'جهد الخط المسلط',0,fx(vmax()),vstep(),V);$('#l5v').oninput=e=>{V=+e.target.value;draw()};
   const st=vstep();$('#l5fine').innerHTML=[-10,-1,1,10].map(k=>`<button class="btn" data-fv="${k*st}">${k>0?'+':''}${fm(k*st,2)}</button>`).join('');
   $('#l5full').style.display=test==='BR'?'':'none';
   $('#l5ill').textContent=mk==='m4'?'(مثال 1-4 لا يعطي اختبار تيار مستمر: R1 = 0.1 Ω في هذا المحرك أرقام توضيحية.)':'';};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-fv]');if(b)setV(V+ +b.dataset.fv)});
  $('#l5zero').onclick=()=>setV(0);$('#l5full').onclick=()=>{setV(M().VLr);did.full=1};
  segBind(el,'mk',v=>{mk=v;V=0;Object.keys(rec).forEach(k=>delete rec[k]);ui();draw()});
  segBind(el,'ts',v=>{test=v;V=0;ui();draw()});segBind(el,'md',v=>{mode=v;did['md'+v]=1;results()});
  $('#l5rec').onclick=()=>{const r=read();if(!(r.I>0)){$('#l5warn').innerHTML='<div class="callout err">لا توجد قراءة: ارفع الجهد أولاً.</div>';return}rec[test]=r;did['rec'+test]=1;results()};
  const draw=()=>{const r=read(),m=M();$('#l5v-v').textContent=fm(V,test==='DC'?2:1)+' V';
   if(test==='DC'){$('#l5c').innerHTML=dcTestSVG({conn:m.conn,V,rd:{V:fm(r.V,2)+' V',A:fm(r.I,2)+' A'}});
    $('#l5m').innerHTML=[['V<sub>DC</sub>',fm(r.V,2)+' V'],['I<sub>DC</sub>',fm(r.I,2)+' A'],['المقاومة بين الطرفين V/I',r.I>0?fm(r.V/r.I,4)+' Ω':'—']].map(([a,b])=>`<div class="im-meter"><span>${a}</span><b>${b}</b></div>`).join('');$('#l5ph').innerHTML=''}
   else{$('#l5c').innerHTML=testCktSVG({locked:test==='BR',V,ang,rd:{V:fm(r.V,1)+' V',A:fm(r.I,2)+' A',W1:fm(r.W1,0)+' W',W2:fm(r.W2,0)+' W'}});
    $('#l5m').innerHTML=[['V (خط)',fm(r.V,1)+' V'],['A (خط)',fm(r.I,2)+' A'],['W1',fm(r.W1,0)+' W'],['W2',fm(r.W2,0)+' W'],[test==='NL'?'P<sub>10</sub> = W1 + W2':'P<sub>sc</sub> = W1 + W2',fm(r.P,0)+' W']].map(([a,b])=>`<div class="im-meter"><span>${a}</span><b>${b}</b></div>`).join('');
    $('#l5ph').innerHTML=test==='NL'&&r.I>0?`<h3 class="sm">المخطط الاتجاهي — الشكل (1-14)</h3>${box(phasorNLSVG(r.phi),280)}`:''}
   const Ir=ratedI();let w='';
   if(test==='NL'){if(V>0&&Math.abs(V-m.VLr)>m.VLr*0.005)w=`<div class="callout">الكتاب: يسلط <b>الجهد المقنن</b> (<span class="ltr">${m.VLr} V</span>) ويدور العمود حراً.</div>`;else if(V>0)w='<div class="callout">الجهد المقنن مسلط والعمود يدور حراً قريباً من السرعة التزامنية (S &lt; 0.001). سجّل القراءات.</div>';if(r.W2<0)w+='<div class="callout err">W2 يقرأ قيمة سالبة لأن معامل القدرة صغير جداً (توضيح — راجع الشرح). القدرة الكلية = W1 + W2.</div>'}
   else if(Ir){const x=r.I/Ir;if(x>1.05){warned=1;w=`<div class="callout err"><b>خطر!</b> التيار <span class="ltr">${fm(r.I,2)} A</span> تجاوز القيمة المقننة <span class="ltr">${Ir} A</span>${x>2?' بكثير':''}: «تيار كبير جداً قد يتلف ملفات المحرك» (ص 28–29). اخفض الجهد.</div>`}
    else if(x>=0.995)w=`<div class="callout">وصل التيار إلى القيمة المقننة (<span class="ltr">${Ir} A</span>). سجّل القراءات.</div>`;else if(V>0)w=`<div class="callout">ارفع الجهد <b>تدريجياً</b> حتى يصل التيار إلى القيمة المقننة <span class="ltr">${Ir} A</span>.</div>`}
   $('#l5warn').innerHTML=w;};
  const isBk=()=>{const b=M().book,eq=(r,a,keys)=>r&&a&&keys.every((k,i)=>Math.abs(r[k]-a[i])<1e-9);return eq(rec.NL,b.NL,['V','I','P'])&&eq(rec.BR,b.BR,['V','I','P'])&&(!rec.DC||eq(rec.DC,b.DC,['V','I']))};
  const results=()=>{const m=M(),rows=[['اللاحمل',rec.NL?`V<sub>L</sub> = ${fm(rec.NL.V)} V، I<sub>L</sub> = ${fm(rec.NL.I)} A، P<sub>10</sub> = ${fm(rec.NL.P)} W`:'—'],['إعاقة الحركة',rec.BR?`V<sub>L</sub> = ${fm(rec.BR.V)} V، I<sub>L</sub> = ${fm(rec.BR.I)} A، P<sub>sc</sub> = ${fm(rec.BR.P)} W`:'—'],['التيار المستمر',rec.DC?`V<sub>DC</sub> = ${fm(rec.DC.V)} V، I<sub>DC</sub> = ${fm(rec.DC.I)} A`:'—']];
   $('#l5tbl').innerHTML=`<table class="im-rec"><tbody>${rows.map(([a,b])=>`<tr><th>${a}</th><td class="l">${b}</td></tr>`).join('')}</tbody></table>`;
   if(!rec.NL||!rec.BR){$('#l5res').innerHTML='<div class="callout">سجّل قراءات اختبار اللاحمل واختبار إعاقة الحركة على الأقل (واختبار التيار المستمر لحساب R<sub>1</sub> و R<sub>2</sub>\').</div>';return}
   const bk=isBk()&&mode==='book';const g={conn:m.conn,VL0:rec.NL.V,IL0:rec.NL.I,P0:rec.NL.P,VLs:rec.BR.V,ILs:rec.BR.I,Ps:rec.BR.P};const dc=!!rec.DC;if(dc){g.Vdc=rec.DC.V;g.Idc=rec.DC.I}
   const o={dc,split:dc?'x':null,skin:mode==='fixed'&&dc?10:0};if(bk){Object.assign(o,mk==='m5'?{bk:BK45,ty:TY45}:{bk:BK44,ty:TY44})}
   const st=paramSteps(g,o),rs=st.res;
   let h=(isBk()?`<div class="callout ${mode==='book'?'err':''}">قراءاتك تطابق قراءات مثال ${mk==='m5'?'(1-5)':'(1-4)'}. ${mode==='book'?'الحساب يعرض أرقام الكتاب المطبوعة كما هي (ومنها أخطاؤه — راجع ملاحظات الشرح).':'الحساب المصحح: أرقام صحيحة'+(dc?' مع إضافة 10% للخاصية القشرية إلى R<sub>1</sub> (ص 31)':'')+'.'}</div>`:'<div class="callout">القراءات ليست قراءات الكتاب تماماً، فالحساب بطريقة الكتاب وتقريبه على قراءاتك.</div>')+(dc&&mk==='m4'?'<p class="sub">مثال (1-4) لا يذكر نسبة X<sub>1</sub> إلى X<sub>2</sub>\'؛ هنا فرضنا X<sub>1</sub> = X<sub>2</sub>\' كما في مثال (1-5).</p>':'')+stepsHTML(st);
   if(rs)h+=`<h3 class="sm" style="margin-top:14px">الدائرة المكافئة التقريبية بالقيم المحسوبة — الشكل (1-12)</h3>${box(eqcSVG(5,{vals:{Ic:fm(rs.Rc)+' Ω',Im:fm(rs.Xm)+' Ω',Req:fm(rs.Req)+' Ω',Xeq:fm(rs.Xeq)+' Ω',RL:rs.R2!=null?"R2' = "+fm(rs.R2)+' Ω':''}}),720,1)}<p class="sub">القيمتان تحت R<sub>c</sub> و X<sub>m</sub> هنا مقاومتان بالأوم.</p>`;
   $('#l5res').innerHTML=h;B.math($('#l5res'));did.res=1};
  const steps=stepsUI($('#l5st'),[
   {t:'اختبار اللاحمل',x:'في «اللاحمل» ارفع الجهد إلى الجهد المقنن <span class="ltr">127 V</span> (استعمل أزرار الضبط الدقيق) ثم «سجّل القراءات». يجب أن تقرأ <span class="ltr">7.53 A</span> و <span class="ltr">179 W</span> كما في مثال (1-5).',done:()=>rec.NL&&mk==='m5'&&Math.abs(rec.NL.V-127)<0.05},
   {t:'خطأ شائع: الجهد المقنن والدوار مثبت',x:'انتقل إلى «إعاقة الحركة» واضغط «طبّق الجهد المقنن مباشرة»: التيار أكبر من ثلاثة أضعاف المقنن — لهذا يرفع الجهد تدريجياً (ص 28).',done:()=>did.full&&warned},
   {t:'اختبار إعاقة الحركة',x:'أعد الجهد إلى الصفر وارفعه تدريجياً حتى يصل التيار إلى <span class="ltr">34.64 A</span> (عند <span class="ltr">39.3 V</span>)، ثم سجّل.',done:()=>rec.BR&&mk==='m5'&&Math.abs(rec.BR.I-34.64)<0.01},
   {t:'اختبار التيار المستمر',x:'في «التيار المستمر» (دلتا: الشكل 1-17) ارفع الجهد حتى <span class="ltr">20 A</span> (عند <span class="ltr">9 V</span>) ثم سجّل. الحساب الآن يطابق مثال (1-5).',done:()=>rec.DC&&mk==='m5'&&Math.abs(rec.DC.I-20)<0.01},
   {t:'كما في الكتاب أم المصحح؟',x:'بدّل طريقة الحساب إلى «المصحح» وقارن: R<sub>c</sub> = 270.51 بدل 270.78، و X<sub>m</sub> = 29.387 بدل 29.435، و R<sub>1</sub> = 0.7425 فيصبح R<sub>2</sub>\' = 0.3115 بدل 0.379.',done:()=>did.mdfixed&&did.res},
   {t:'محرك النجمة',x:'اختر «محرك مثال (1-4)» وكرر اختباري اللاحمل (220 V) وإعاقة الحركة (50 A): تحصل على R<sub>c</sub> = 80.68 و X<sub>m</sub> = 6.37 و R<sub>eq</sub> = 0.2 و X<sub>eq</sub> = 0.2828.',done:()=>mk==='m4'&&rec.NL&&rec.BR}
  ]);
  ui();draw();results();
  loopOn(el,dt=>{if(test==='NL'&&V>0){ang=(ang+dt*360*V/M().VLr)%360;const g=$('#tcSpin');if(g)g.setAttribute('transform',`rotate(${fx(ang)} 500 120)`)}steps.check()});
 },
 examples:[
  {title:'مثال (1-4) — الحل كما في الكتاب',ref:'ص 32–33',q:Q44,given:G44,solve:(g,B,isBook)=>paramSteps(g,isBook?{bk:BK44,ty:TY44}:{}),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة السطر كما طُبع: بسط \\(\\cos\\theta\\) مكتوب 127 والصحيح 600 (الناتج 0.0787 صحيح)، و \\(\\theta=85.48^\\circ\\) و \\(R_c=80.68\\) بالبتر (الصحيح 85.49 و 80.69). إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة وبتقريب الكتاب.'},
  {title:'مثال (1-4) — الحل المصحح',ref:'ص 32–33',q:'<p>نفس المثال بالبسط الصحيح \\(P_{10}=600\\) وبالتقريب الصحيح (حساب مصحح — ليس من الكتاب).</p>',given:G44,solve:g=>paramSteps(g,{}),
   note:'الفرق عن الكتاب: \\(\\theta=85.49^\\circ\\) بدل 85.48 و \\(R_c=80.69\\ \\Omega\\) بدل 80.68. باقي النتائج كما في الكتاب.'},
  {title:'مثال (1-5) — الحل كما في الكتاب',ref:'ص 33–35',q:Q45,given:G45,solve:(g,B,isBook)=>paramSteps(g,Object.assign({dc:true,split:'x'},isBook?{bk:BK45,ty:TY45}:{})),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة أرقامه المطبوعة: \\(\\cos^{-1}(0.0787)\\) (والصحيح 0.108)، و \\(R_c=270.78\\) (والصحيح 270.51)، و \\(X_m=29.435\\) (والصحيح 29.387)، ولم تُضف 10% للخاصية القشرية. قارن بالحل المصحح أسفل هذه الصفحة.'},
  {title:'مثال (1-5) — الحل المصحح',ref:'ص 33–35',q:'<p>نفس المثال بحساب صحيح لـ \\(R_c\\) و \\(X_m\\)، مع إضافة حوالي 10% إلى \\(R_1\\) لتأثير الخاصية القشرية كما ينص الكتاب في ص 31 (حساب مصحح — ليس من الكتاب). اجعل النسبة 0 لترى الحل دون إضافة.</p>',
   given:G45.concat([{id:'skin',label:'إضافة الخاصية القشرية',sym:'',unit:'%',value:10}]),solve:g=>paramSteps(g,{dc:true,split:'x',skin:g.skin}),
   note:'النتائج المصححة: \\(R_1=0.7425\\)، \\(R_c=270.51\\)، \\(X_m=29.387\\)، \\(R_2\'=0.3115\\ \\Omega\\)؛ وباقي القيم كما في الكتاب. بدون إضافة 10% يكون \\(R_2\'=0.379\\ \\Omega\\) كما في الكتاب.'}
 ],
 quiz:[
  {q:'في اختبار اللاحمل يسلط على المحرك:',o:['جهد مخفض حتى التيار المقنن','الجهد المقنن والدوار يدور حراً','جهد مستمر','لا جهد'],c:1,e:'ص 27.'},
  {q:'لماذا يسمى اختبار اللاحمل «اختبار الدائرة المفتوحة»؟',o:['لأن المفتاح مفتوح','لأن S ≈ 0 فتصبح R<sub>2</sub>\'(1−S)/S = ∞ والثانوي مفتوح','لأن الدوار مثبت','لأن التيار صفر'],c:1,e:'ص 27–28.'},
  {q:'القدرة المقروءة في اختبار إعاقة الحركة تمثل تقريباً:',o:['المفاقيد الحديدية','المفاقيد النحاسية (المتغيرة)','القدرة الميكانيكية','لا شيء'],c:1,e:'ص 29.'},
  {q:'لماذا يرفع الجهد تدريجياً في اختبار إعاقة الحركة؟',o:['لتوفير الطاقة','لأن الجهد المقنن مع دوار ثابت يمرر تياراً كبيراً جداً قد يتلف الملفات','لأن الواطميتر لا يتحمل','لتسخين المحرك فقط'],c:1,e:'ص 28.'},
  {q:'محرك موصل دلتا، قراءة جهد الخط في اختبار اللاحمل 127 V. جهد الوجه:',o:['73.3 V','127 V','220 V','42.3 V'],c:1,e:'في الدلتا \\(V_{ph}=V_L\\) (مثال 1-5).'},
  {q:'في اختبار التيار المستمر لمحرك موصل نجمة: R<sub>1</sub> =',o:['\\(V_{DC}/I_{DC}\\)','\\(V_{DC}/(2I_{DC})\\)','\\(3V_{DC}/(2I_{DC})\\)','\\(2V_{DC}/I_{DC}\\)'],c:1,e:'المعادلة (1-14).'},
  {q:'لماذا يضاف حوالي 10% إلى المقاومة المقاسة بالتيار المستمر؟',o:['لتأثير الخاصية القشرية عند مرور التيار المتردد','لخطأ الأجهزة','لتأثير الاحتكاك','لأن المحرك دلتا'],c:0,e:'ص 31.'},
  {q:'من نتائج اختبار عدم الحركة: R<sub>eq</sub> = 1.054 Ω و Z<sub>eq</sub> = 1.965 Ω. إذن X<sub>eq</sub> ≈',o:['0.911 Ω','1.658 Ω','3.019 Ω','2.23 Ω'],c:1,e:'\\(\\sqrt{1.965^2-1.054^2}=1.658\\) (مثال 1-5).'}
 ]
});


/* ======================================================================
   Lesson 6 — أسئلة وتمارين الفصلين الأول والثاني (ص 22، 36–37)
   ====================================================================== */
const SUG='<b>حل مقترح (ليس من الكتاب)</b> بطريقة الكتاب وتقريبه: الكتاب لا يعطي إجابات للتمارين.';
const exQ=(n,txt,given,solve)=>({title:`${n} — حل مقترح (ليس من الكتاب)`,ref:n.includes('الفصل الثاني')?'ص 36–37':'ص 22',q:`<p>«${txt}»</p>`,given,solve,note:SUG});
const GP=(conn,a,b,c,d,e,f)=>[{id:'conn',label:'التوصيل (1 = نجمة، 2 = دلتا)',sym:'',unit:'',value:conn,step:1,min:1,max:2},{id:'VL0',label:'اللاحمل: الجهد',sym:'V_L',unit:'V',value:a},{id:'IL0',label:'اللاحمل: التيار',sym:'I_L',unit:'A',value:b},{id:'P0',label:'اللاحمل: القدرة',sym:'P_{10}',unit:'W',value:c},
 {id:'VLs',label:'القصر: الجهد',sym:'V_L',unit:'V',value:d},{id:'ILs',label:'القصر: التيار',sym:'I_L',unit:'A',value:e},{id:'Ps',label:'القصر: القدرة',sym:'P_{sc}',unit:'W',value:f}];
B.lesson({
 id:'u1-l6',unit:1,order:6,pages:'22، 36–37',
 title:'أسئلة وتمارين الفصلين الأول والثاني',
 summary:'أسئلة وتمارين الفصل الأول (ص 22) والفصل الثاني (ص 36–37)، وتحت كل سؤال إجابة مقترحة مكتوبة من نص الكتاب، وحاسبات للتمارين الحسابية بطريقة الأمثلة المحلولة.',
 theory:[
  {h:'أسئلة وتمارين الفصل الأول',ref:'ص 22',html:`<p class="sub">الكتاب لا يعطي إجابات. اضغط على السؤال لترى إجابة مقترحة مكتوبة من نص الكتاب.</p>
   ${Q('س1','لماذا يصنع العضو الثابت أو الدوار من شرائح حديدية؟','لتقليل حرارة الحديد الناتجة عن التيارات الدوامية التي تتكون بسبب تعرض الحديد للمجال المغناطيسي المتغير داخل المحرك (ص 11). الشرائح (0.3–0.6 مم) معزولة عن بعضها فتقطع مسار هذه التيارات.')}
   ${Q('س2','ما المقصود بالحث الكهرومغناطيسي؟','الكتاب يستعمل المصطلح دون تعريف صريح. من نص ص 17: هو تولد قوة دافعة كهربائية في موصل عندما يتعرض لمجال مغناطيسي متغير أو يقطع خطوطه؛ فالمجال الدوار يولد قوة دافعة كهربائية في موصلات الدوار «طبقاً لظاهرة الحث الكهرومغناطيسي»، وقيمتها تتناسب مع سرعة القطع (n<sub>s</sub> − n).')}
   ${Q('س3','ما المقصود بالتيارات الدوامية؟ وكيف تنشأ؟','تيارات دائرية تسري داخل الحديد نفسه. تنشأ «بسبب تعرض الحديد للمجال المغناطيسي المتغير داخل المحرك» (ص 11) فيتولد فيه جهد بالحث فتدور فيه تيارات تسخنه وتضيع جزءاً من القدرة. وتقل بتصنيع القلب من شرائح رقيقة معزولة.')}
   ${Q('س4','ما فائدة وجود حلقات الانزلاق؟','في الدوار الملفوف توصل الأطراف الثلاثة لملفات الدوار إلى ثلاث حلقات انزلاق، ومنها عبر فرش كربونية إلى خارج المحرك على التوالي مع مقاومات خارجية متغيرة «من أجل التحكم في بدء دوران المحرك أو في تنظيم سرعته»، فيمكن تغيير خواص تشغيله على نطاق واسع (ص 12–13).')}
   ${Q('س5','ما هي الشروط اللازمة لتوليد مجال مغناطيسي دوار منتظم؟','(ص 14) ثلاثة ملفات في العضو الثابت بين كل ملف وآخر زاوية فراغية قدرها 120°، تغذى من مصدر ثلاثي الأوجه فتمر فيها تيارات متزنة بين كل تيار وآخر 120° (زمنية).')}
   ${Q('س6','اشرح كيف يتولد عزم فعال يؤدي إلى دوران العضو الدوار.','(ص 17) المجال الدوار للعضو الثابت يولد بالحث قوة دافعة كهربائية ثلاثية الأوجه في موصلات الدوار، ولأنها مقصورة تمر فيها تيارات ثلاثية الأوجه تولد مجالاً دواراً ثانياً. المجالان يدوران بنفس السرعة (n<sub>s</sub> بالنسبة للثابت) ونفس الاتجاه، فيتولد عزم فعال يدير الدوار في اتجاه المجالين.')}
   ${Q('س7','هل يمكن لسرعة العضو الدوار أن تصل إلى السرعة التزامنية؟','لا (بقوته الذاتية). لو وصل الدوار إلى n<sub>s</sub> لأصبح S = 0 فلا قطع لخطوط المجال، ولا قوة دافعة كهربائية ولا تيار في الدوار (f<sub>r</sub> = 0، ص 19) وبالتالي لا عزم، فتنقص السرعة بفعل الاحتكاك. تستقر السرعة قريباً من n<sub>s</sub> عندما يساوي العزم الاحتكاك أو عزم الحمل (ص 18).')}
   ${Q('س8','ما المقصود بمعامل الانزلاق؟','سرعة الانزلاق (n<sub>s</sub> − n) منسوبة إلى السرعة التزامنية: \\(S=\\frac{n_s-n}{n_s}\\) (1-3). قيمته بين 0 (الدوار بالسرعة التزامنية) و 1 (الدوار ثابت)؛ 0.01–0.02 عند اللاحمل للمحركات الصغيرة (وقد تصل 0.005 للكبيرة)، و 0.03–0.05 عند التحميل (ص 18).')}
   ${Q('س9','محرك حثي ثلاثي الأوجه ذو قطبين يغذى من مصدر تردده 60 Hz، احسب سرعة العضو الدوار إذا كان تردد التيارات في العضو الدوار 2 Hz.','بطريقة مثال (1-3): \\(S=2/60=0.0333\\)، \\(n_s=120\\times60/2=3600\\) rpm، \\(n=3600(1-0.0333)=3480.12\\) rpm (بالانزلاق غير المقرب \\(1/30\\) تكون <span class="ltr">3480 rpm</span> تماماً). الحاسبة في تبويب «الأمثلة المحلولة».')}
   ${Q('س10','محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يعمل على مصدر تردده 50 Hz، وسرعته عند الحمل الكامل 716 rpm، احسب سرعة الانزلاق ومعامل الانزلاق عند الحمل الكامل.','بطريقة مثال (1-2): \\(n_s=120\\times50/8=750\\) rpm، \\(n_{slip}=750-716=34\\) rpm، \\(S=34/750=0.0453\\).')}
   ${Q('س11','محرك حثي ذو أربعة أقطاب يعمل على مصدر تردده 60 Hz، القوة الدافعة الكهربائية في العضو الدوار ترددها 2.7 Hz، احسب معامل الانزلاق وكذلك سرعة العضو الدوار.','بطريقة مثال (1-3): \\(S=2.7/60=0.045\\)، \\(n_s=1800\\) rpm، \\(n=1800(1-0.045)=1719\\) rpm.')}
   ${Q('س12','محرك حثي ثلاثي الأوجه ذو قطبين ملفاته موصلة على شكل نجمة يغذى من مصدر جهده 220 V وتردده 60 Hz، فإذا كانت قيمة الانزلاق عند الحمل الكامل 0.05 احسب ما يلي: أ) السرعة التزامنية لهذا المحرك. ب) سرعة العضو الدوار عند الحمل الكامل. جـ) تردد التيارات في العضو الدوار عند الحمل الكامل.','بطريقة مثال (1-1): أ) \\(n_s=3600\\) rpm، ب) \\(n=3600(1-0.05)=3420\\) rpm، جـ) \\(f_r=0.05\\times60=3\\) Hz. (الجهد والتوصيل لا يدخلان في الحل.)')}`},
  {h:'أسئلة وتمارين الفصل الثاني',ref:'ص 36–37',html:`
   ${Q('س1','لماذا يسمى اختبار عدم الحمل أحياناً اختبار الدائرة المفتوحة؟','لأن الدوار يدور بدون حمل قريباً من السرعة التزامنية فيكون S ≈ 0، فتصبح مقاومة الحمل \\(R_2\'\\frac{1-S}{S}\\) ما لانهاية، أي أن الدائرة المكافئة مفتوحة من جهة الثانوي «أسوةً بالمحول» (ص 27–28).')}
   ${Q('س2','لماذا يسمى اختبار عدم الحركة أحياناً اختبار الدائرة المقصورة؟','لأن الدوار ثابت فيكون S = 1، فتصبح \\(R_2\'\\frac{1-S}{S}=0\\)، أي أن الدائرة المكافئة مقصورة من جهة الثانوي (ص 29).')}
   ${Q('س3','لماذا تحدد R<sub>c</sub> و X<sub>m</sub> باستخدام اختبار عدم الحمل وليس اختبار عدم الحركة؟','في اختبار عدم الحمل يكون الثانوي مفتوحاً فيمر تيار الاختبار في R<sub>c</sub> و X<sub>m</sub> فقط (ص 28)، والجهد هو المقنن فتظهر المفاقيد الحديدية كاملة. أما في اختبار عدم الحركة فالثانوي مقصور والجهد منخفض فيمر التيار تقريباً في R<sub>eq</sub> و X<sub>eq</sub> فقط ويكون أثر الفرع المغناطيسي مهملاً.')}
   ${Q('س4','لماذا تحدد R<sub>eq</sub> و X<sub>eq</sub> باستخدام اختبار عدم الحركة وليس اختبار عدم الحمل؟','في اختبار عدم الحركة الثانوي مقصور فيمر تيار الاختبار في R<sub>eq</sub> و X<sub>eq</sub> فقط (\\(I_{ph}=I_2\'\\)) والتيار هو المقنن فتظهر المفاقيد النحاسية (ص 29). في اختبار عدم الحمل التيار صغير ويكاد لا يمر شيء في فرع الدوار.')}
   ${Q('س5','لماذا يسلط الجهد تدريجياً على المحرك في اختبار عدم الحركة؟','لأن «توصيل المحرك على الجهد المقنن سوف يتسبب في مرور تيار كبير جداً قد يتلف ملفات المحرك»، فيرفع الجهد تدريجياً حتى يصل التيار إلى القيمة المقننة (ص 28).')}
   ${Q('س6','ما المقصود بالخاصية القشرية skin effect؟','الكتاب يذكرها دون تعريف (ص 31). المقصود: عند مرور التيار المتردد في موصل يميل التيار إلى التركز قرب سطحه الخارجي، فتقل المساحة الفعالة وتزيد المقاومة عن قيمتها بالتيار المستمر؛ لذلك يضيف الكتاب حوالي 10% إلى المقاومة المقاسة في اختبار التيار المستمر.')}
   ${Q('س7','محرك حثي ثلاثي الأوجه 5 hp ذو أربعة أقطاب، عند إجراء تجربتي اللاحمل والقصر له أعطى النتائج التالية: تجربة اللاحمل: 220 V, 3.86 A, 550 W — تجربة القصر: 35 V, 12.9 A, 490 W. فإذا كانت ملفات المحرك موصلة على شكل Δ احسب مكونات الدائرة المكافئة لهذا المحرك.','بطريقة مثال (1-5) (دلتا) وتقريبه: \\(V_{ph}=220\\)، \\(I_{10}=2.229\\) A، \\(\\cos\\theta=0.374\\)، \\(\\theta=68.04^\\circ\\)، <b>\\(R_c=263.9\\ \\Omega\\)، \\(X_m=106.42\\ \\Omega\\)</b>؛ \\(V_{sc}=35\\)، \\(I_{sc}=7.448\\) A، <b>\\(R_{eq}=2.944\\ \\Omega\\)</b>، \\(Z_{eq}=4.699\\)، <b>\\(X_{eq}=3.662\\ \\Omega\\)</b>. القدرة 5 hp وعدد الأقطاب لا يدخلان في الحل. الحاسبة في تبويب «الأمثلة المحلولة».')}
   ${Q('س8','محرك حثي ثلاثي الأوجه قدرته 29.84 KW ملفاته موصلة على شكل Δ عند اختباره أعطى النتائج التالية: تجربة اللاحمل: 415 V, 21 A, 1250 W — تجربة عدم الحركة: 100 V, 45 A, 2730 W. احسب مكونات الدائرة المكافئة التقريبية لهذا المحرك.','بطريقة مثال (1-5) (دلتا): \\(V_{ph}=415\\)، \\(I_{10}=12.12\\) A، \\(\\cos\\theta=0.0828\\)، <b>\\(R_c\\approx 413.5\\ \\Omega\\)، \\(X_m\\approx 34.36\\ \\Omega\\)</b>؛ \\(V_{sc}=100\\)، \\(I_{sc}=25.98\\) A، <b>\\(R_{eq}\\approx 1.348\\ \\Omega\\)</b>، \\(Z_{eq}=3.849\\)، <b>\\(X_{eq}\\approx 3.605\\ \\Omega\\)</b>. الأرقام الدقيقة بخطواتها في الحاسبة.')}
   ${Q('س9','محرك حثي ثلاثي الأوجه قدرته 20 hp ملفاته موصلة على شكل Y عند إجراء تجربتي اللاحمل والقصر له أعطى النتائج التالية: تجربة اللاحمل: 380 V, 16.5 A, 1050 W — تجربة القصر: 86 V, 32 A, 1854 W. احسب مكونات الدائرة المكافئة لهذا المحرك إذا كان \\(X_1=X_2\'\\ \\&\\ R_1=R_2\'\\).','بطريقة مثال (1-4) (نجمة): \\(V_{ph}=219.4\\) V، \\(I_{10}=16.5\\) A، \\(\\cos\\theta=0.0967\\)، <b>\\(R_c\\approx 137.5\\ \\Omega\\)، \\(X_m\\approx 13.36\\ \\Omega\\)</b>؛ \\(V_{sc}=49.65\\) V، \\(I_{sc}=32\\) A، \\(R_{eq}=0.6035\\)، \\(X_{eq}=1.43\\ \\Omega\\)، ومنها <b>\\(R_1=R_2\'\\approx 0.302\\ \\Omega\\)</b> و <b>\\(X_1=X_2\'\\approx 0.715\\ \\Omega\\)</b>.')}`},
  {err:'في التمرين 8 (ص 36) كُتبت القدرة «29.84 <b>KW</b>» بحرف K كبير، والصحيح «kW». والقدرات (5 hp و 29.84 kW و 20 hp) وعدد الأقطاب في التمرين 7 معطيات لا تلزم للحل.'}
 ],
 examples:[
  exQ('الفصل الأول — س9','محرك حثي ثلاثي الأوجه ذو قطبين يغذى من مصدر تردده 60 Hz، احسب سرعة العضو الدوار إذا كان تردد التيارات في العضو الدوار 2 Hz.',cloneG(EX13G,{p:2,f:60,fr:2}),g=>solveEx13(g,{extra:(g,S,ns)=>[{t:'للمقارنة: بالانزلاق غير المقرب',f:`n=${fm(ns)}\\left(1-\\frac{${fm(g.fr)}}{${fm(g.f)}}\\right)`,v:B.round(ns*(1-g.fr/g.f),2),unit:'rpm'}]})),
  exQ('الفصل الأول — س10','محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يعمل على مصدر تردده 50 Hz، وسرعته عند الحمل الكامل 716 rpm، احسب سرعة الانزلاق ومعامل الانزلاق عند الحمل الكامل.',cloneG(EX12G,{p:8,f:50,n:716}),g=>solveEx12(g)),
  exQ('الفصل الأول — س11','محرك حثي ذو أربعة أقطاب يعمل على مصدر تردده 60 Hz، القوة الدافعة الكهربائية في العضو الدوار ترددها 2.7 Hz، احسب معامل الانزلاق وكذلك سرعة العضو الدوار.',cloneG(EX13G,{p:4,f:60,fr:2.7}),g=>solveEx13(g)),
  exQ('الفصل الأول — س12','محرك حثي ثلاثي الأوجه ذو قطبين ملفاته موصلة على شكل نجمة يغذى من مصدر جهده 220 V وتردده 60 Hz، فإذا كانت قيمة الانزلاق عند الحمل الكامل 0.05 احسب: السرعة التزامنية، وسرعة العضو الدوار، وتردد التيارات في العضو الدوار عند الحمل الكامل.',cloneG(EX11G,{p:2,V:220,f:60,S:5}),g=>solveEx11(g)),
  exQ('الفصل الثاني — س7','محرك حثي ثلاثي الأوجه 5 hp ذو أربعة أقطاب … تجربة اللاحمل: 220 V, 3.86 A, 550 W — تجربة القصر: 35 V, 12.9 A, 490 W. الملفات موصلة Δ. احسب مكونات الدائرة المكافئة.',GP(2,220,3.86,550,35,12.9,490),g=>paramSteps(g,{})),
  exQ('الفصل الثاني — س8','محرك حثي ثلاثي الأوجه قدرته 29.84 KW ملفاته موصلة Δ: تجربة اللاحمل: 415 V, 21 A, 1250 W — تجربة عدم الحركة: 100 V, 45 A, 2730 W. احسب مكونات الدائرة المكافئة التقريبية.',GP(2,415,21,1250,100,45,2730),g=>paramSteps(g,{})),
  exQ('الفصل الثاني — س9','محرك حثي ثلاثي الأوجه قدرته 20 hp ملفاته موصلة Y: تجربة اللاحمل: 380 V, 16.5 A, 1050 W — تجربة القصر: 86 V, 32 A, 1854 W. احسب مكونات الدائرة المكافئة إذا كان X1 = X2\' و R1 = R2\'.',GP(1,380,16.5,1050,86,32,1854),g=>paramSteps(g,{split:'xr'}))
 ],
 quiz:[
  {q:'محرك 8 أقطاب على 50 Hz سرعته 716 rpm. معامل الانزلاق:',o:['0.034','0.0453','0.0477','0.716'],c:1,e:'\\(n_s=750\\)، \\(S=34/750=0.0453\\).'},
  {q:'محرك ذو قطبين على 60 Hz وتردد تيارات دواره 3 Hz. انزلاقه:',o:['0.03','0.05','0.5','3'],c:1,e:'\\(S=f_r/f_s=3/60=0.05\\).'},
  {q:'ما فائدة حلقات الانزلاق؟',o:['تقليل التيارات الدوامية','توصيل ملفات الدوار بمقاومات خارجية للتحكم في البدء والسرعة','تغذية العضو الثابت','قصر قضبان القفص'],c:1,e:'ص 13.'},
  {q:'في اختبار عدم الحركة تمر التيارات تقريباً في:',o:['R<sub>c</sub> و X<sub>m</sub>','R<sub>eq</sub> و X<sub>eq</sub>','R<sub>1</sub> فقط','الحمل R<sub>2</sub>\'(1−S)/S'],c:1,e:'ص 29.'},
  {q:'محرك دلتا، تيار الخط في تجربة اللاحمل 21 A. تيار الوجه I<sub>10</sub> ≈',o:['21 A','12.12 A','36.37 A','7 A'],c:1,e:'\\(21/\\sqrt3\\approx12.12\\) A (التمرين 8).'},
  {q:'إذا كان X<sub>1</sub> = X<sub>2</sub>\' و X<sub>eq</sub> = 1.658 Ω فإن X<sub>1</sub> =',o:['1.658 Ω','0.829 Ω','3.316 Ω','0.415 Ω'],c:1,e:'\\(X_1=X_{eq}/2\\) (مثال 1-5).'},
  {q:'الخاصية القشرية تجعل مقاومة الملف بالتيار المتردد:',o:['أقل منها بالتيار المستمر','أكبر منها بالتيار المستمر (يضيف الكتاب حوالي 10%)','مساوية لها','صفراً'],c:1,e:'ص 31.'}
 ]
});

})(PLCBOOK);
