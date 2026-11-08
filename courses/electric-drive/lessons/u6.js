/* Unit 6 — فرملة المحركات الكهربائية (ص 65–78)
   Lessons u6-l1 … u6-l3 (source: /home/claude/c5/ex/drv_c.md, lessons 5–7). Formal theory tab only. */
(function(B){
const {S}=B;
const PI=Math.PI,G=9.81;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const R=(x,d)=>B.round(x,d);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---------- styles used only by this course's lesson files (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('edu6-css'))return;const s=document.createElement('style');s.id='edu6-css';s.textContent=`
.ed-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.ed-sl .ed-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ed-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.ed-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.ed-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.ed-row .sub{margin:0}
.ed-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.ed-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.ed-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.ed-tbl{overflow-x:auto}
.ed-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.ed-chip.ok{background:var(--on-soft);color:var(--on)}
.ed-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.ed-chip.warn{background:var(--stop-soft);color:var(--stop)}
.ed-chip.hot{background:var(--live-soft);color:var(--live)}
.ed-lab .seg{flex-wrap:wrap;max-width:100%}
.ed-lab .seg button{white-space:nowrap}
.ed-lab .facts{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.ed-lab .fact b{font-size:16px}
.ed-try{margin:6px 0 0;padding-inline-start:20px}
.ed-cap{font-size:13px;color:var(--muted);margin-top:6px}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local to this file) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="ed-sl"><span class="ed-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const TS=s=>`<tspan direction="ltr" unicode-bidi="embed">${s}</tspan>`;          // Latin/digits inside Arabic SVG text
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function niceMax(v){if(!(v>0)||!isFinite(v))return 1;const e=Math.pow(10,Math.floor(Math.log10(v)));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*e>=v*0.99999)return k*e;return 10*e}
const ticks=(a,b,n)=>{n=n||4;const r=[];for(let i=0;i<=n;i++)r.push(a+(b-a)*i/n);return r};
const tk=v=>fm(+(+v).toPrecision(4));
/* x-y plot: o={w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y),under(X,Y),cid} */
function plotSVG(o){const W=o.w||520,H=o.h||250,L=o.left||54,Rm=16,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-Rm),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-Rm}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):tk(v),'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):tk(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-Rm}" stroke="var(--fg)" fill="none" stroke-width="1.3"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-Rm}" stroke="var(--fg)" stroke-width="1.1"/>`;
  if(o.x0<0&&o.x1>0)s+=`<path d="M${fx(X(0))} ${T}V${H-Bm}" stroke="var(--fg)" stroke-width="1.1"/>`;
  if(o.xl)s+=S.t(W-Rm,H-5,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  const cid=o.cid||'edclip';s+=`<g clip-path="url(#${cid})">`;
  (o.series||[]).forEach(se=>{if(!se.pts||se.pts.length<2)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  s+='</g>';if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${cid}"><rect x="${L}" y="${T-2}" width="${W-L-Rm+2}" height="${H-T-Bm+4}"/></clipPath></defs>${s}</svg>`}
const Q=(n,q,ans)=>`<details class="ed-q"><summary>${n}: ${q}</summary><div class="ed-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const Z=a=>{a.forEach(q=>{if(q&&typeof q.v==='number'&&q.dp==null&&Number.isInteger(q.v))q.dp=0});return a};
const SUG='<b>حل مقترح (ليس من الكتاب):</b> الكتاب لا يطبع إجابات للتمارين؛ الحل هنا بطريقة الكتاب نفسها وبتقريبه.';

const cloneG=(arr,vals)=>arr.map(q=>Object.assign({},q,vals&&vals[q.id]!=null?{value:vals[q.id]}:{}));

/* ---------- DC shunt machine circuits: figures (6-1), (6-2), (6-3) and their live versions ----------
   mode: 'motor' | 'gen' | 'dyn' | 'plug'. o: {on, lab:{V,I,If,Ia,E,R}, title} */
function dcCkt(mode,o){o=o||{};const on=o.on!==false,L=o.lab||{},W=420,H=244,yT=40,yB=200,xT=340;
  const cf=on?'w flow':'w live';
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'دائرة محرك التيار المستمر التوازي'}">`;
  s+=`<path class="w live" d="M60 ${yT}H${xT}M60 ${yB}H${xT}"/>`;
  s+=`<circle cx="${xT}" cy="${yT}" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${xT}" cy="${yB}" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(xT+10,yT+5,'+','','start')+S.t(xT+10,yB+5,'−','','start');
  s+=arrow(xT+18,yB-22,xT+18,yT+24,'--fg',1.6)+S.t(xT+26,(yT+yB)/2+4,L.V||'V','','start');
  // field branch
  s+=`<path class="${cf}" d="M60 ${yT}V80"/>`+ind(60,80,60,160,4,on?'flow':'live')+`<path class="${cf}" d="M60 160V${yB}"/>`;
  s+=arrow(84,94,84,146,'--blue',1.8)+S.t(90,124,L.If||sb('I','f'),'b','start');
  const arm=(x,y,r,rev)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`+S.t(x,y+5,sb('E','b'),'')+S.t(x-r-8,y-r+10,rev?'−':'+','','end')+S.t(x-r-8,y+r,rev?'+':'−','','end');
  if(mode==='motor'||mode==='gen'){const x=190;s+=`<path class="${cf}" d="M${x} ${yT}V94M${x} 146V${yB}"/>`+arm(x,120,26);
    s+=(mode==='motor'?arrow(232,98,232,142,'--live',2):arrow(232,142,232,98,'--live',2))+S.t(238,124,L.Ia||sb('I','a'),'','start');
    s+=(mode==='motor'?arrow(316,yT-12,276,yT-12,'--live',2):arrow(276,yT-12,316,yT-12,'--live',2))+S.t(296,yT-18,L.I||'I','','middle');}
  if(mode==='dyn'){const x=170;s+=`<path class="w live" d="M${x} ${yT}V54M${x} ${yB}V186"/><circle cx="${x}" cy="56" r="2.6" fill="var(--fg)"/><circle cx="${x}" cy="184" r="2.6" fill="var(--fg)"/>`;
    s+=`<path class="${on?'w flow':'w'}" d="M${x} 99V74H250V96"/>`+zig(250,96,250,156,6,on?'flow':'')+`<path class="${on?'w flow':'w'}" d="M250 156V176H${x}V151"/>`+arm(x,125,24)+arrow(232,148,268,104,'--fg',1.4)+S.t(262,130,L.R||'R','','start');
    s+=arrow(132,146,132,104,'--live',2)+S.t(126,128,L.Ia||sb('I','a'),'','end');}
  if(mode==='plug'){const x=170;s+=`<path class="${cf}" d="M250 ${yT}V70"/>`+zig(250,70,250,130,6,on?'flow':'live')+`<path class="${cf}" d="M250 130V176H${x}V149M${x} 101V72H120V${yB}"/>`+arm(x,125,24)+arrow(232,122,268,78,'--fg',1.4)+S.t(262,104,L.R||'R','','start');
    s+=arrow(208,146,208,104,'--live',2)+S.t(214,128,L.Ia||sb('I','a'),'','start');}
  if(o.title)s+=S.t(W/2,H-8,o.title,'','middle');
  return s+'</svg>'}
function ind(x1,y1,x2,y2,n,cls){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
function zig(x1,y1,x2,y2,n,cls){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.12,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const k=(i%2?-1:1)*8,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*k)} ${fx(y1+uy*m+ny*k)}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
const two=(a,b)=>`<div class="grid" style="margin-top:0"><div class="c6">${box(a,380)}</div><div class="c6">${box(b,380)}</div></div>`;
const rpm=w=>w*60/(2*PI),rad=n=>n*2*PI/60;

/* ======================================================================
   Lesson u6-l1 — أنواع الفرامل الكهربائية + الفرملة بإعادة التوليد
   ====================================================================== */
function solve61(g,o){o=o||{};const w1=R(2*PI*g.n1/60,2),IaEx=g.TL*w1/g.E1,bk=!!o.bk;
  const Ia=bk?104.4:R(IaEx,1),E2=bk?224.17:R(g.V+Ia*g.Ra,2),N2=bk?1200:R(g.n1*E2/g.E1,1);
  const out=[{t:'بثبات تيار المجال تتناسب القوة الدافعة مع السرعة:',f:'\\frac{E_1}{E_2}=\\frac{n_1}{n_2}=\\frac{\\omega_1}{\\omega_2}'},
   {t:'السرعة الزاوية عند سرعة المحرك:',f:`\\omega_1=\\frac{2\\pi n_1}{60}=\\frac{2\\pi\\times ${fm(g.n1)}}{60}`,v:w1,unit:'rad/s',dp:2},
   {t:'تيار المنتج في حالة المولد من المعادلة (6-4)، ولأن \\(\\omega_2/E_2=\\omega_1/E_1\\):'+(bk?' <span class="sub">(الناتج كما طُبع: 104.4 — والحساب الصحيح 106.4)</span>':''),f:`I_{a2}=\\frac{T_L\\,\\omega_2}{E_2}=\\frac{T_L\\,\\omega_1}{E_1}=\\frac{${fm(g.TL)}\\times ${fm(w1,2)}}{${fm(g.E1)}}`,v:Ia,unit:'A',dp:1},
   {t:'القوة الدافعة للمولد (تزيد عن جهد المصدر بهبوط الجهد في المنتج):'+(bk?' <span class="sub">(مطبوعة 224.17)</span>':''),f:`E_2=V+I_{a2}R_a=${fm(g.V)}+${fm(Ia,1)}\\times ${fm(g.Ra)}`,v:E2,unit:'V',dp:2},
   {t:'أقل سرعة فرملية:'+(bk?' <span class="sub">(مطبوعة 1200؛ وناتج القسمة 1199.0)</span>':''),f:`N_2=N_1\\,\\frac{E_2}{E_1}=${fm(g.n1)}\\times\\frac{${fm(E2,2)}}{${fm(g.E1)}}`,v:N2,unit:'rpm',dp:bk?0:1,final:true}];
  if(!bk&&g.TL>0)out.push({t:'أي أن الآلة يجب أن تدور أسرع من سرعتها بلا حمل حتى تعمل مولداً وتعيد الطاقة إلى المصدر.'});
  return out}
const G61=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:220},{id:'E1',label:'القوة الدافعة المتولدة (محركاً)',sym:'E_1',unit:'V',value:215},{id:'n1',label:'سرعة المحرك',sym:'n_1',unit:'rpm',value:1150},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.04},{id:'TL',label:'عزم الحمل',sym:'T_L',unit:'Nm',value:190}];
const Q61='<p>محرك تيار مستمر توازي، <span class="ltr">220 V</span>، القوة الدافعة الكهربائية المتولدة <span class="ltr">215 V</span>، عندما كانت سرعة المحرك <span class="ltr">1150 rpm</span>، مقاومة المنتج <span class="ltr">0.04 Ω</span>، الحمل عبارة عن عزم دوران مقداره <span class="ltr">190 Nm</span>. أوجد أقل سرعة فرملية للمحرك، إذا كان المطلوب استخدام الفرملة بطريقة التوليد المرتجع مع الاحتفاظ بثبات تيار المجال.</p><p>أقل سرعة فرملية للمحرك هي تلك السرعة التي تصل إليها الآلة ويصبح عندها عزم الدوران المضاد للمولد مساوياً لعزم دوران الحمل <span class="ltr">(190 Nm)</span>.</p>';

/* speed–torque plane (n vertical, T horizontal) */
function ntPlane(o){const xm=o.xm,ym=o.ym,y0=o.y0==null?0:o.y0;
  return plotSVG({w:540,h:300,left:58,cid:o.cid,x0:-xm,x1:xm,y0:y0,y1:ym,xt:ticks(-xm,xm,4),yt:ticks(y0,ym,y0<0?4:4),xl:'T (Nm)',yl:'n (rpm)',series:o.series,
   under:(X,Y)=>(o.zones||[]).map(z=>arT(fx(X(z[0])),fx(Y(z[1])),z[2],{fs:12,col:z[3]||'--muted'})).join(''),
   extra:(X,Y)=>(o.pts||[]).map(p=>`<circle cx="${fx(X(clamp(p[0],-xm,xm)))}" cy="${fx(Y(clamp(p[1],y0,ym)))}" r="${p[3]||6}" fill="var(${p[2]||'--live'})" stroke="var(--surface)" stroke-width="2"/>`).join('')+(o.more?o.more(X,Y):''),aria:'مستوى السرعة والعزم'})}

B.lesson({
 id:'u6-l1',unit:6,order:1,pages:'65–71، 78',
 title:'أنواع الفرامل الكهربائية والفرملة بإعادة التوليد',
 summary:'لماذا نحتاج إلى الفرملة، ومزايا الفرامل الكهربائية على الميكانيكية، وطرقها الثلاث بالمحرك نفسه. ثم الفرملة بإعادة التوليد: تعمل الآلة مولداً وهي موصلة بالمصدر عندما تزيد قوتها الدافعة عن جهده، فتعيد الطاقة إليه، لكنها لا توقف المحرك. مع مثال (6-1).',
 theory:[
  {h:'الوحدة السادسة: فرملة المحركات الكهربائية',ref:'ص 65–66',html:`<p><b>الهدف العام للوحدة:</b> معرفة أنواع الكوابح (الفرامل) الكهربائية وكيفية تطبيقها على المحركات الكهربائية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب الفرملة بإعادة التوليد وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعرف المتدرب الفرملة الديناميكية وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعرف المتدرب الفرملة بالتيار المعكوس أو التبديل وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعدد المتدرب مميزات وعيوب الطرق المختلفة لأنواع الفرامل الكهربائية.</li></ul>`},
  {h:'أنواع الفرامل الكهربائية',ref:'ص 67',html:`<p>في كثير من التطبيقات الصناعية لابد من تواجد وسيلة لإيقاف وفرملة الكتل المتحركة، ممثلة في المحرك والحمل الميكانيكي المتصل به، لأسباب اقتصادية ولتحقيق السلامة الصناعية، ولا بد أيضاً من تواجد وسيلة للحد من السرعة الزائدة في حالة <b>الأحمال الهابطة</b> تحت تأثير الجاذبية الأرضية، كما في الروافع والأوناش والمصاعد الكهربائية، أو الكتل المنحدرة على مستوى مائل كما يحدث في المركبات الكهربائية. حيث تمتلك هذه الكتل كميات كبيرة من الطاقة الكامنة <span class="ltr">(Potential Energy)</span> التي تتحول إلى طاقة حركة <span class="ltr">(Kinetic Energy)</span> فتكتسب هذه الكتل المتحركة سرعات كبيرة، لذا فإنه يلزم في مثل هذه الحالات بذل <b>عزم مضاد لاتجاه حركة الدوران</b>، للتأثير على الكتل المتحركة لكي يمنع زيادة سرعتها عن الحد المسموح به، وقد يعمل أيضاً على تباطؤ سرعتها حتى تتوقف تماماً. هذا العزم المضاد يمكن توليده والحصول عليه بواسطة النوع المناسب من الفرامل، لذلك فإنه يجب اختيار نوع الفرملة المناسب حسب نوع نظام التحريك، وبصفة عامة فهناك نوعان من الفرامل: <b>الفرامل الميكانيكية</b> و<b>الفرامل الكهربائية</b>.</p>
   <p><b>تمتاز الفرامل الكهربائية عن نظيرتها الميكانيكية بما يلي:</b></p><ul>
   <li>تحتاج إلى جهد وتكلفة أقل للصيانة وللعناية بالأجهزة المستخدمة.</li>
   <li>النظافة لعدم وجود المخلفات الناتجة عن الاحتكاك كما في الفرامل الميكانيكية.</li>
   <li>يمكن السيطرة على كميات الحرارة الكبيرة الناتجة عن عملية تحويل طاقة الحركة، ففي معظم الأحيان يمكن تجهيز الوسائل المناسبة للاستفادة من الحرارة المتولدة أثناء الفرامل، باستعمالها للتدفئة (مثلاً) أثناء فصل الشتاء، أو لإعادة تحويل طاقة الحركة إلى طاقة كهربائية وإعادة تغذيتها إلى الشبكة الكهربائية.</li>
   <li>يمكن الحصول على تباطؤ أقل بكثير في حالة الفرامل الكهربائية عن نظيرتها الميكانيكية، بحيث يتم الإيقاف بنعومة تامة، حفاظاً على راحة الركاب على ظهر المصعد أو الحافلة الكهربائية. <span class="ref">ص 68</span></li></ul>`},
  {h:'تقسيم الفرامل الكهربائية',ref:'ص 68',html:`<p>في حالة الأحمال الميكانيكية الثقيلة، فإن الفرامل الكهربائية والميكانيكية يستخدمان معاً للتحكم الجيد في فرملة الأجزاء المتحركة.</p>
   <p><b>يمكن تقسيم الفرامل الكهربائية إلى نوعين:</b></p><ul><li>الفرامل بواسطة المحرك الكهربائي نفسه المستخدم للتحريك بعد إجراء التعديلات اللازمة لدائرته الكهربائية.</li><li>الفرامل بواسطة وحدة فرامل كهربائية مستقلة بذاتها مثل وحدة الفرامل باستخدام التيارات الإعصارية.</li></ul>
   <p>وفيما يلي أنواع الفرامل بواسطة المحرك الكهربائي المستخدم للتحريك وطرقها المختلفة الشائعة الاستعمال في الحياة العملية وكيفية تطبيقها:</p>
   <ol><li>الفرملة بإعادة التوليد.</li><li>الفرملة الديناميكية أو باستخدام المقاومة المتغيرة.</li><li>الفرملة بالتيار المعكوس أو التبديل.</li></ol>
   <p>يمكن تطبيق هذه الطرق الثلاث على أنواع آلات التيار المستمر والمتردد الشائعة الاستخدام في الصناعة.</p>`},
  {note:ADD+'الفكرة المشتركة في الطرق الثلاث: نجعل <b>تيار المنتج ينعكس</b> فينعكس العزم ويصبح مضاداً للدوران. والفرق بينها أين تذهب الطاقة: تعود إلى المصدر (إعادة التوليد)، أو تتحول حرارة في مقاومة (الديناميكية)، أو تتحول حرارة ومعها طاقة إضافية من المصدر (التبديل).'},
  {h:'فرملة محركات التيار المستمر — 1) الفرملة بإعادة التوليد Regenerative Braking',ref:'ص 69',html:String.raw`<p>عند تطبيق هذه الطريقة، يعمل المحرك الكهربائي <b>كمولد</b> للطاقة الكهربائية <b>بينما يظل موصلاً بمصدر الجهد</b>، وعندها يقوم بتحويل طاقة الحركة المخزونة في الكتل المتحركة إلى طاقة كهربائية ويعيدها إلى الشبكة. يجب أن تكون قيمة القوة الدافعة الكهربائية المتولدة <b>أكبر من جهد المصدر</b> المتصل به المحرك، وهذا يتحقق إما <b>بخفض جهد المصدر</b> حتى يصبح أقل من القوة الدافعة الكهربائية للمحرك، أو <b>بزيادة القوة الدافعة الكهربائية للمحرك بزيادة تيار المجال</b>.</p>
   <p>ففي حالة محركات التيار المستمر سواء أكان من النوع ذي التغذية المستقلة أم من النوع ذي التغذية الذاتية (توصيلة التوازي) كما يوضح ذلك الشكل (6-1)، فإن قيمة القوة الدافعة الكهربائية المتولدة يتم زيادتها عن طريق زيادة قيمة تيار المجال، أو عندما <b>تزداد سرعة المحرك عن سرعة اللاحمل</b> (كما يحدث في حالة الأحمال الهابطة تحت تأثير الجاذبية الأرضية).</p>
   <p>يجب أن يكون واضحاً أن الفرملة بإعادة التوليد <b>تخفض من سرعة المحرك فقط ولا تسبب إيقافه كلياً</b> عن الدوران. ومن أهم مميزاتها التوفير في الطاقة المستخدمة، وإعادة طاقة الحركة المخزونة في الكتل المتحركة إلى مصدر الجهد.</p>
   <p>إذا رمزنا للقوة الدافعة الكهربائية لكل من المحرك \(E_1\) والمولد \(E_2\)، وفي حالة الاحتفاظ بثبات تيار المجال \((\phi=\text{constant})\) فإن:</p>
   $$E_1=K\phi\,n_1 \qquad (6\text{-}1)$$ $$E_2=K\phi\,n_2 \qquad (6\text{-}2)$$
   <p>وبقسمة \(E_1\) على \(E_2\) ينتج:</p>$$\frac{E_1}{E_2}=\frac{n_1}{n_2}=\frac{\omega_1}{\omega_2}$$
   <p>وحيث أن عزم الدوران المضاد للمولد يساوي عزم دوران الحمل (عزم المحرك): <span class="ref">ص 70</span></p>
   $$T_L=\frac{E_1\,I_{a1}}{\omega_1}=\frac{E_2\,I_{a2}}{\omega_2} \qquad (6\text{-}3)$$
   <p>ومنها نحصل على تيار المنتج في حالة المولد:</p>$$I_{a2}=\frac{T_L\,\omega_2}{E_2} \qquad (6\text{-}4)$$`},
  {fig:'(6-1)',ref:'ص 70',caption:'الفرملة بإعادة التوليد: (a) الآلة محرك — التيار I يدخل من المصدر و I<sub>a</sub> يدخل المنتج. (b) الآلة مولد — انعكس تيار المنتج I<sub>a</sub> وتيار الخط I (يخرج إلى المصدر) بينما بقي تيار المجال I<sub>f</sub> في اتجاهه.',draw:()=>two(dcCkt('motor',{on:false,title:'(a) Motor'}),dcCkt('gen',{on:false,title:'(b) generator'}))},
  {note:ADD+'متى يعمل المحرك مولداً؟ تيار المنتج \\(I_a=\\dfrac{V-E}{R_a}\\). ما دامت \\(E<V\\) يدخل التيار المنتج (محرك). فإذا صارت \\(E>V\\) — بسرعة أعلى من سرعة اللاحمل أو بمجال أقوى أو بجهد مصدر أقل — ينعكس \\(I_a\\) ويخرج إلى المصدر (مولد)، ويصبح عزمه مضاداً للدوران. ولذلك يكون جهد المولد \\(E_2=V+I_{a2}R_a\\) كما في مثال (6-1).'},
  {h:'مثال (6-1)',ref:'ص 71',html:String.raw`<p>محرك توازي <span class="ltr">220 V</span>، \(E_1=215\) V عند <span class="ltr">1150 rpm</span>، \(R_a=0.04\ \Omega\)، والحمل عزم <span class="ltr">190 Nm</span>. المطلوب أقل سرعة فرملية بالتوليد المرتجع مع ثبات تيار المجال. الحل في تبويب «الأمثلة المحلولة» مرتين (كما في الكتاب / المصحح):</p>
   <div class="ed-tbl"><table class="tt"><thead><tr><th></th><th>\(\omega_1\)</th><th>\(I_{a2}\)</th><th>\(E_2\)</th><th>\(N_2\)</th></tr></thead><tbody><tr><td>المطبوع</td><td class="ltr">120.43 rad/s</td><td class="ltr">104.4 A</td><td class="ltr">224.17 V</td><td class="ltr">1200 rpm</td></tr><tr><td>المصحح</td><td class="ltr">120.43 rad/s</td><td class="ltr">106.4 A</td><td class="ltr">224.26 V</td><td class="ltr">1199.5 ≈ 1200 rpm</td></tr></tbody></table></div>`},
  {err:'<b>ملاحظات على الكتاب (ص 68–71):</b> (١) يقول الكتاب إن الطرق الثلاث «يمكن تطبيقها على آلات التيار المستمر والمتردد»، لكنه يشرح تطبيقها على محركات التيار المستمر فقط. (٢) كُتب «وبقسمة E<sub>2</sub> على E<sub>1</sub>» والناتج المكتوب \\(E_1/E_2\\)، أي قسمة E<sub>1</sub> على E<sub>2</sub>؛ صُحح في النص. (٣) مثال (6-1): \\(I_{a2}=190\\times120.43/215\\) طُبع <b>104.4 A</b> والصحيح <b>106.4 A</b>، فيصبح \\(E_2=224.26\\) V بدل 224.17 (والرقم 224.17 نفسه مقطوع من 224.176)، و \\(N_2=1199.5\\) rpm بدل 1200 (ناتج قسمة أرقام الكتاب نفسها 1199.0). الجواب النهائي ≈ <b>1200 rpm</b> سليم في الحالتين.'},
  {h:'أسئلة وتمارين',ref:'ص 78',html:Q('6-1','اذكر مميزات استخدام الفرامل الكهربائية عن نظيرتها الميكانيكية.','(ص 67–68): (1) تحتاج إلى جهد وتكلفة أقل للصيانة. (2) النظافة لعدم وجود مخلفات الاحتكاك. (3) يمكن السيطرة على الحرارة الكبيرة الناتجة والاستفادة منها (للتدفئة مثلاً)، أو إعادة تحويل طاقة الحركة إلى طاقة كهربائية وإعادتها إلى الشبكة. (4) تباطؤ أقل بكثير فيتم الإيقاف بنعومة تامة حفاظاً على راحة الركاب في المصعد أو الحافلة الكهربائية.')+
   Q('6-3','محرك تيار مستمر، توازي، 250 V، القوة الدافعة الكهربائية المتولدة 245 V، عندما كانت سرعة المحرك 1200 rpm، مقاومة المنتج 0.05 Ω، وكان الحمل ذا عزم دوران مقداره 200 N.m. احسب أقل سرعة فرملية للمحرك، إذا كان المطلوب استخدام الفرملة بطريقة التوليد المرتجع، مع الاحتفاظ بثبات تيار المجال.','بطريقة مثال (6-1): \\(\\omega_1=2\\pi\\times1200/60=125.66\\) rad/s، \\(I_{a2}=200\\times125.66/245=102.6\\) A، \\(E_2=250+102.6\\times0.05=255.13\\) V، \\(N_2=1200\\times255.13/245\\approx\\) <b>1249.6 rpm ≈ 1250 rpm</b>. الحاسبة في تبويب «الأمثلة المحلولة».')}
 ],
 lab:(el)=>{
  const w1=rad(1150),K0=215/w1,Ra=0.04;const st={TL:190,fld:100,V:220,w:null,sawT:false,pre:''};
  el.innerHTML=`<div id="r1tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة الآن <small>مبنية على الشكل (6-1) ص 70 وآلة مثال (6-1)</small></h2><div class="svgbox" id="r1c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><span class="ed-chip" id="r1chip"></span></div>
    <div class="facts">${fact('السرعة n','r1n')}${fact('القوة الدافعة E','r1E')}${fact('تيار المنتج I<sub>a</sub>','r1Ia')}${fact('تيار الخط I = I<sub>a</sub> + I<sub>f</sub>','r1I')}${fact('القدرة من المصدر V·I','r1P')}</div></div>
   <div class="panel c6"><h2>التحكم</h2>
    <div class="ed-row" style="margin-top:0"><button class="btn" id="r1ex">مثال (6-1): حمل هابط 190 Nm</button></div>
    ${sl('r1T','عزم الحمل (موجب = يعاكس الدوران، سالب = حمل هابط يدفع الآلة)',-300,300,1,st.TL)}${sl('r1f','تيار المجال (نسبة من قيمته الأصلية)',70,130,1,st.fld)}${sl('r1V','جهد المصدر V',120,240,1,st.V)}
    <p class="ed-cap">الآلة من مثال (6-1): <span class="ltr">E = 215 V</span> عند <span class="ltr">1150 rpm</span> و <span class="ltr">R<sub>a</sub> = 0.04 Ω</span>. نفترض أن الفيض يتناسب مع تيار المجال (توضيح — ليس من الكتاب).</p></div>
   <div class="panel c12"><h2>مستوى السرعة والعزم <small>المستقيم = كل نقاط التشغيل الممكنة بالجهد والمجال الحاليين؛ النقطة = نقطة التشغيل الآن</small></h2><div class="svgbox" id="r1nt" style="max-width:760px;margin-inline:auto"></div>
    <p class="ed-cap">يمين المحور الرأسي: الآلة <b>محرك</b> (عزمها مع الدوران). يساره: <b>مولد — فرملة بإعادة التوليد</b> (عزمها ضد الدوران وتعيد الطاقة إلى المصدر). الخط الأفقي المتقطع = سرعة اللاحمل.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="r1st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#r1tp'),'u6-l1',[{k:'If',label:'تيار المجال I<sub>f</sub>',unit:'A',value:2,min:0,max:50,step:0.1,hint:'لا يعطيه الكتاب؛ يدخل فقط في تيار الخط.'},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.8,min:0.05,max:30,step:0.05}],()=>steps.redraw());
  const bind=(id,k)=>{$('#'+id).oninput=e=>{st[k]=+e.target.value;st.pre=''}};bind('r1T','TL');bind('r1f','fld');bind('r1V','V');
  $('#r1ex').onclick=()=>{st.TL=-190;st.fld=100;st.V=220;$('#r1T').value=-190;$('#r1f').value=100;$('#r1V').value=220;st.pre='e61'};
  const K=()=>K0*st.fld/100,wss=()=>Math.max(0,(st.V-st.TL/K()*Ra)/K());
  const steps=stepsUI($('#r1st'),[
   {t:'بلا حمل',x:'اجعل عزم الحمل صفراً: تستقر السرعة عند سرعة اللاحمل <span class="ltr">≈ 1176.7 rpm</span>، حيث \\(E\\approx V\\) وتيار المنتج صفر تقريباً.',done:()=>Math.abs(st.TL)<1&&st.fld===100&&st.V===220&&Math.abs(st.w-wss())<0.05},
   {t:'محرك محمّل',x:'اجعل العزم <span class="ltr">+190 Nm</span> (حمل يعاكس الدوران): السرعة أقل من سرعة اللاحمل، \\(E<V\\)، والتيار يدخل المنتج — الآلة محرك.',done:()=>st.TL>=150&&st.fld===100&&st.V===220},
   {t:'مثال (6-1): حمل هابط',x:'اضغط زر «مثال (6-1)»: الحمل يدفع الآلة بعزم <span class="ltr">190 Nm</span> فتتجاوز سرعة اللاحمل وتستقر عند <span class="ltr">≈ 1199.5 rpm</span> — أقل سرعة فرملية. \\(E>V\\) وتيار المنتج <b>سالب</b> (≈ <span class="ltr">−106.4 A</span>): الطاقة تعود إلى المصدر.',done:()=>st.TL<=-185&&st.fld===100&&st.V===220&&Math.abs(st.w-wss())<0.05},
   {t:'زد تيار المجال',x:'والحمل ما زال هابطاً، ارفع تيار المجال إلى <span class="ltr">115%</span>: يقوى المجال فتكفي سرعة أقل لتوليد القوة الدافعة نفسها؛ تنخفض السرعة الفرملية (ص 69).',done:()=>st.TL<0&&st.fld>=115},
   {t:'اخفض جهد المصدر',x:'أرجع الحمل إلى <span class="ltr">0</span> أو قيمة موجبة والمجال إلى <span class="ltr">100%</span>، ثم اخفض الجهد فجأة إلى <span class="ltr">180 V</span> أو أقل: أثناء تباطؤ الآلة تكون \\(E>V\\) فيصبح التيار سالباً لحظياً — فرملة بإعادة التوليد بخفض جهد المصدر.',done:()=>st.sawT},
   {t:'لا توقف كلي',x:'لاحظ أن الآلة في كل الحالات استقرت على سرعة جديدة ولم تتوقف: الفرملة بإعادة التوليد <b>تخفض السرعة فقط</b> (ص 69). للإيقاف نحتاج الطريقتين في الدرسين التاليين.'}]);
  loopOn(el,dt=>{const k=K(),ws=wss();if(st.w==null)st.w=ws;st.w+=(ws-st.w)*(1-Math.exp(-dt/TP.v.tau));if(Math.abs(st.w-ws)<1e-4)st.w=ws;
   const E=k*st.w,Ia=(st.V-E)/Ra,Il=Ia+TP.v.If,P=st.V*Il;if(Ia<-1&&st.TL>=0&&st.V<=180)st.sawT=true;
   $('#r1T-v').textContent=st.TL+' Nm';$('#r1f-v').textContent=st.fld+' %';$('#r1V-v').textContent=st.V+' V';
   $('#r1n').textContent=fm(rpm(st.w),1)+' rpm';$('#r1E').textContent=fm(E,2)+' V';$('#r1Ia').textContent=fm(Ia,1)+' A';$('#r1I').textContent=fm(Il,1)+' A';$('#r1P').textContent=fm(P/1000,2)+' kW';
   const gen=Ia<-0.5,ch=$('#r1chip');if(gen){ch.className='ed-chip ok';ch.textContent='مولد: E > V — فرملة بإعادة التوليد، الطاقة تعود إلى المصدر'}else if(Ia>0.5){ch.className='ed-chip ld';ch.textContent='محرك: E < V — الطاقة من المصدر إلى الحمل'}else{ch.className='ed-chip';ch.textContent='لا حمل تقريباً: E ≈ V'}
   if(ws<=0){ch.className='ed-chip warn';ch.textContent='العزم أكبر مما تقدر عليه الآلة بهذا الجهد'}
   $('#r1c').innerHTML=dcCkt(gen?'gen':'motor',{lab:{V:fm(st.V,0)+' V'},title:gen?'generator':'Motor'});
   const xm=300,line=T=>rpm((st.V-T/k*Ra)/k),base=T=>rpm((220-T/K0*Ra)/K0),n0=rpm(st.V/k),vals=[line(-xm),line(xm),base(-xm),base(xm),rpm(st.w)],y0=Math.max(0,Math.floor(Math.min(...vals)/50)*50-50),ym=Math.ceil(Math.max(...vals)/50)*50+50,yz=y0+(ym-y0)*0.12;
   $('#r1nt').innerHTML=ntPlane({cid:'r1ntc',xm,ym,y0,series:[{pts:[[-xm,base(-xm)],[xm,base(xm)]],col:'--muted',w:1.4,dash:'5 4'},{pts:[[-xm,line(-xm)],[xm,line(xm)]],col:'--blue'}],
    zones:[[-150,yz,'مولد — فرملة بإعادة التوليد','--on'],[150,yz,'محرك','--blue-ink']],pts:[[k*Ia,rpm(st.w),'--live']],
    more:(X,Y)=>`<path d="M${fx(X(-xm))} ${fx(Y(n0))}H${fx(X(xm))}" stroke="var(--fg)" stroke-dasharray="3 4" stroke-width="1"/>`+S.t(fx(X(xm)-4),fx(Y(n0)-6),'n0 = '+fm(n0,1)+' rpm','m','end')});
   steps.check()});
 },
 examples:[
  {title:'مثال (6-1) — الحل كما في الكتاب',ref:'ص 71',q:Q61,given:G61,solve:(g,B,isBook)=>Z(solve61(g,{bk:isBook})),note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الأرقام المطبوعة: \\(I_{a2}=104.4\\) A (والصحيح 106.4)، و \\(E_2=224.17\\) V، و \\(N_2=1200\\) rpm. إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة. قارن بالحل المصحح أدناه.'},
  {title:'مثال (6-1) — الحل المصحح',ref:'ص 71',q:'<p>نفس المثال بحساب صحيح لتيار المنتج (حساب مصحح — ليس من الكتاب).</p>',given:G61,solve:g=>Z(solve61(g,{})),note:'الفرق عن الكتاب: \\(I_{a2}=106.4\\) A بدل 104.4، و \\(E_2=224.26\\) V، و \\(N_2=1199.5\\) rpm — أي ≈ 1200 rpm كجواب الكتاب.'},
  {title:'تمرين (6-3) — حل مقترح (ليس من الكتاب)',ref:'ص 78',q:'<p>محرك تيار مستمر، توازي، <span class="ltr">250 V</span>، القوة الدافعة الكهربائية المتولدة <span class="ltr">245 V</span>، عندما كانت سرعة المحرك <span class="ltr">1200 rpm</span>، مقاومة المنتج <span class="ltr">0.05 Ω</span>، وكان الحمل ذا عزم دوران مقداره <span class="ltr">200 N.m</span>. احسب أقل سرعة فرملية للمحرك بطريقة التوليد المرتجع مع الاحتفاظ بثبات تيار المجال.</p>',
   given:cloneG(G61,{V:250,E1:245,n1:1200,Ra:0.05,TL:200}),solve:g=>Z(solve61(g,{})),note:SUG}
 ],
 quiz:[
  {q:'لماذا نحتاج إلى الفرملة في الأحمال الهابطة كالروافع والمصاعد؟',o:['لأن طاقتها الكامنة تتحول إلى طاقة حركة فتزيد سرعتها عن الحد المسموح','لتقليل التيار فقط','لأن المحرك لا يعمل إلا بفرامل','لزيادة الكفاءة'],c:0,e:'ص 67.'},
  {q:'أي مما يلي من مزايا الفرامل الكهربائية على الميكانيكية؟',o:['تحتاج صيانة أكثر','الإيقاف بنعومة تامة وتباطؤ أقل','تولد مخلفات احتكاك','لا يمكن الاستفادة من حرارتها'],c:1,e:'ص 68.'},
  {q:'في الفرملة بإعادة التوليد يكون المحرك:',o:['مفصولاً عن المصدر','موصلاً بالمصدر ويعمل مولداً','موصلاً بمقاومة فقط','معكوس طرفي المنتج'],c:1,e:'ص 69.'},
  {q:'شرط عمل الآلة مولداً يعيد الطاقة إلى المصدر:',o:['E < V','E = 0','E > V','V = 0'],c:2,e:'ص 69: القوة الدافعة المتولدة أكبر من جهد المصدر.'},
  {q:'كيف نجعل E أكبر من V في الفرملة بإعادة التوليد؟',o:['بخفض تيار المجال','بخفض جهد المصدر أو زيادة تيار المجال (أو بسرعة أعلى من سرعة اللاحمل)','بزيادة مقاومة المنتج','بعكس طرفي المجال'],c:1,e:'ص 69.'},
  {q:'هل توقف الفرملة بإعادة التوليد المحرك كلياً؟',o:['نعم دائماً','لا، تخفض السرعة فقط','نعم إذا زاد المجال','نعم إذا خُفض الجهد إلى الصفر'],c:1,e:'ص 69.'},
  {q:'بثبات تيار المجال، القوة الدافعة E تتناسب مع:',o:['التيار','السرعة n','مربع السرعة','مقاومة المنتج'],c:1,e:'المعادلتان (6-1) و(6-2): E = Kϕn.'},
  {q:'في مثال (6-1) كانت أقل سرعة فرملية تقريباً:',o:['1150 rpm','1176 rpm','1200 rpm','1250 rpm'],c:2,e:'≈ 1200 rpm (بالحساب الصحيح 1199.5).'}
 ]
});

/* ======================================================================
   Lesson u6-l2 — الفرملة الديناميكية
   ====================================================================== */
function solve62(g){const Eb=R(g.kE*g.V,2),Ib=R(g.kI*g.IFL,2),Rt=R(Eb/Ib,2),Rx=R(Rt-g.Ra,2);
  const out=[{t:'القوة الدافعة عند لحظة الفرملة:',f:`E_b=${fm(g.kE)}\\times ${fm(g.V)}`,v:Eb,unit:'V'},
   {t:'أقصى تيار مسموح أثناء الفرملة:',f:`I_b=${fm(g.kI)}\\times ${fm(g.IFL)}`,v:Ib,unit:'A'},
   {t:'من المعادلة (6-5):',f:`E_b=I_b\\,R_t\\ \\Rightarrow\\ R_t=\\frac{E_b}{I_b}=\\frac{${fm(Eb)}}{${fm(Ib)}}`,v:Rt,unit:'Ω',dp:2},
   {t:'المقاومة الإضافية:',f:`R=R_t-R_a=${fm(Rt,2)}-${fm(g.Ra)}`,v:Rx,unit:'Ω',dp:2,final:true}];
  if(Rx<=0)out.push({t:'الناتج صفر أو سالب: مقاومة المنتج وحدها تحدّ التيار دون الحد المطلوب، فلا حاجة إلى مقاومة إضافية.'});
  out.push({t:'<span class="sub">القدرة بالحصان لا تدخل في الحل.</span>'});return out}
const G62=[{id:'hp',label:'القدرة (لا تدخل في الحل)',sym:'P',unit:'hp',value:15},{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:230},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.38},{id:'IFL',label:'تيار الحمل الكامل',sym:'I_{FL}',unit:'A',value:54},
 {id:'kE',label:'نسبة القوة الدافعة عند الفرملة إلى جهد المصدر',sym:'',unit:'',value:0.9},{id:'kI',label:'أقصى تيار فرملة (مضاعف تيار الحمل الكامل)',sym:'',unit:'',value:1.75}];

B.lesson({
 id:'u6-l2',unit:6,order:2,pages:'72–74، 78',
 title:'الفرملة الديناميكية',
 summary:'يُفصل المنتج عن المصدر ويوصل بمقاومة إضافية R، فيعمل الآلة مولداً وتتحول طاقة الحركة إلى حرارة في المقاومة حتى تتباطأ الآلة. تُحسب المقاومة من المعادلة (6-5) بحيث لا يتعدى التيار حداً معيناً. مع مثال (6-2).',
 theory:[
  {h:'2) الفرملة الديناميكية Dynamic Braking',ref:'ص 72',html:String.raw`<p>في هذه الطريقة يعمل المحرك الكهربائي أيضاً كمولد للطاقة الكهربائية، وبدلاً من إعادة الطاقة المتولدة إلى مصدر الجهد، فإنها <b>تُستهلك على شكل حرارة في مقاومة إضافية</b> \((R)\) خصصت لهذا الغرض مضافة بدائرة المحرك، فيتم توصيل المحرك بها <b>بعد فصله من المصدر</b> مباشرة، فيؤدي ذلك إلى تباطؤ الآلة تدريجياً.</p>
   <p>يفضل في هذه الحالة الاحتفاظ بقيمة ثابتة للتيار المار في المقاومة الإضافية، وذلك إما <b>بخفض قيمة المقاومة</b> بما يتناسب مع الخفض المستمر في السرعة، أو <b>بزيادة تيار المجال تدريجياً</b> لزيادة الجهد المتولد وتعويض النقص المستمر الناتج عن تباطؤ السرعة، وهذا ما يحدث في محركات التيار المستمر ذات التغذية المستقلة أو الموصلة على التوازي. الشكل (6-2) يبين كيفية توصيل محرك التوازي أثناء الفرملة الديناميكية.</p>
   <p>ويمكن حساب المقاومة الإضافية \((R)\) من المعادلة:</p>
   $$E_b=I_b\,R_t=I_b\,(R_a+R) \qquad (6\text{-}5)$$
   <p>حيث: \(E_b\) القوة الدافعة الكهربائية المتولدة عند لحظة الفرملة، و \(I_b\) أقصى قيمة للتيار أثناء الفرملة (التيار الابتدائي)، و \(R_t=R_a+R\) المقاومة الكلية لدائرة المنتج.</p>`},
  {fig:'(6-2)',ref:'ص 73',caption:'كيفية توصيل محرك التوازي أثناء الفرملة الديناميكية: يسار — التشغيل محركاً. يمين — ملف المجال وحده باقٍ على المصدر، والمنتج مفصول عن المصدر وموصل في حلقة مغلقة مع المقاومة المتغيرة R، وتيار المنتج I<sub>a</sub> انعكس (يخرج من الطرف +).',draw:()=>two(dcCkt('motor',{on:false,title:'Motor'}),dcCkt('dyn',{on:false,title:'Dynamic Braking'}))},
  {note:ADD+'لماذا يقل عزم الفرملة مع الوقت إذا بقيت R ثابتة؟ التيار \\(I=E/(R_a+R)\\) والقوة الدافعة \\(E\\) تتناسب مع السرعة؛ فكلما تباطأت الآلة قلّ التيار وقلّ العزم، فيصبح التباطؤ أبطأ فأبطأ. لذلك يفضّل الكتاب خفض R أو زيادة تيار المجال حتى يبقى التيار (والعزم) ثابتاً. وهذا تراه في المختبر.'},
  {h:'مثال (6-2)',ref:'ص 73',html:String.raw`<p>محرك تيار مستمر، قدرته <span class="ltr">15</span> حصان، <span class="ltr">230 V</span>، مقاومة المنتج <span class="ltr">0.38 Ω</span>، وتيار حمله الكامل <span class="ltr">54 A</span>، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي <span class="ltr">0.9</span> من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">1.75</span> من قيمة تيار الحمل الكامل.</p>
   <p>الحل: \(E_b=0.9\times230=207\) V، \(I_b=1.75\times54=94.5\) A، \(R_t=207/94.5=2.19\ \Omega\)، \(R=2.19-0.38=\) <b>1.81 Ω</b>.</p>`},
  {h:'ملاحظة على محركات التوالي',ref:'ص 74',html:`<p>عند استخدام الطريقتين السابقتين في حالة محركات التيار المستمر ذات تغذية التوالي، لابد من <b>فصل ملفات المجال عن ملفات المنتج وتغذيتها تغذية مستقلة</b> أثناء استخدام الفرامل، حتى يتسنى زيادة تيار المجال للحصول على قيمة القوة الدافعة الكهربائية اللازمة لتحويل الآلة إلى مولد. ومما يجدر بالذكر هنا أن جميع أنواع الآلات الكهربائية تتحول في نعومة تامة من محرك إلى مولد إذا ما انعكس اتجاه تيار المنتج بها.</p>`},
  {note:ADD+'لماذا يُفصل مجال محرك التوالي؟ في محرك التوالي يمر تيار المنتج نفسه في المجال. فإذا انعكس تيار المنتج عند الفرملة لانعكس المجال معه، فتنعكس القوة الدافعة ويضعف التوليد بدل أن يستمر. لذلك يُغذّى المجال تغذية مستقلة أثناء الفرملة.'},
  {err:'<b>ملاحظة على الكتاب (ص 73):</b> نص مثال (6-2) يقول «محرك تيار مستمر، <b>توالي</b>»، بينما الشرح والشكل (6-2) لمحرك التوازي — لا يؤثر ذلك على الحل. وقدرة المحرك (15 حصان) معطاة ولا تُستعمل في الحل.'},
  {h:'تمرين من أسئلة الوحدة',ref:'ص 78',html:Q('6-4','محرك تيار مستمر، توالي، قدرته 25 حصان، 240 V، مقاومة المنتج 0.38 Ω، وتيار حمله الكامل 90 A، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي 0.95 من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى 1.6 من قيمة تيار الحمل الكامل.','بطريقة مثال (6-2): \\(E_b=0.95\\times240=228\\) V، \\(I_b=1.6\\times90=144\\) A، \\(R_t=228/144=1.58\\ \\Omega\\)، \\(R=1.58-0.38=\\) <b>1.2 Ω</b> (بثلاثة أرقام: 1.583 − 0.38 = 1.203 Ω). ولأن المحرك توالي يُغذّى مجاله تغذية مستقلة أثناء الفرملة (ص 74).')}
 ],
 lab:(el)=>{
  const V=230,Ra=0.38,IFL=54,Iset=1.75*IFL;
  const st={ph:'run',mode:'fix',R:1.81,w:0,f:1,t:0,E0:0,I0:0,heat:0,runs:[],cur:[],over:false,done:{},spd:1};
  el.innerHTML=`<div id="d2tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة <small>مبنية على الشكل (6-2) ص 73 وآلة مثال (6-2)</small></h2><div class="svgbox" id="d2c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><button class="btn primary" id="d2go">افصل المصدر وابدأ الفرملة</button><button class="btn" id="d2rs">أعد تشغيل المحرك</button><span class="ed-chip" id="d2chip"></span></div>
    <div class="facts">${fact('السرعة n','d2n')}${fact('القوة الدافعة E','d2E')}${fact('تيار الفرملة I','d2I')}${fact('المقاومة المستعملة R','d2R')}${fact('عزم الفرملة T = Kϕ·I','d2T')}${fact('الحرارة في R حتى الآن','d2H')}${fact('زمن الفرملة','d2t')}</div></div>
   <div class="panel c6"><h2>طريقة الفرملة</h2>
    <div class="ed-row" style="margin-top:0">${segHTML('md',[['fix','R ثابتة'],['stepR','خفض R تدريجياً'],['field','زيادة تيار المجال']],st.mode)}</div>
    ${sl('d2Rs','المقاومة الإضافية R',0,5,0.01,st.R)}
    <p class="ed-cap">آلة مثال (6-2): <span class="ltr">230 V</span>، <span class="ltr">R<sub>a</sub> = 0.38 Ω</span>، تيار الحمل الكامل <span class="ltr">54 A</span>، والقوة الدافعة عند لحظة الفرملة <span class="ltr">0.9 × 230 = 207 V</span>. الحد الأقصى للتيار <span class="ltr">1.75 × 54 = 94.5 A</span>. في «خفض R تدريجياً» و«زيادة تيار المجال» يُحفظ التيار عند <span class="ltr">94.5 A</span> ما أمكن.</p>
    <div class="ed-row"><span class="sub">سرعة العرض</span>${segHTML('sp',[[1,'عادي'],[0.25,'أبطأ ×¼']],st.spd)}</div></div>
   <div class="panel c6"><h2>السرعة مع الزمن <small>يبقى آخر ثلاث محاولات للمقارنة</small></h2><div class="svgbox" id="d2p1"></div></div>
   <div class="panel c6"><h2>تيار الفرملة مع الزمن</h2><div class="svgbox" id="d2p2"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="d2st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#d2tp'),'u6-l2',[{k:'n0',label:'سرعة المحرك عند لحظة الفرملة',unit:'rpm',value:1000,min:100,max:5000,step:10,hint:'الكتاب لا يعطي سرعة المحرك في مثال (6-2).'},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:0.1,max:60,step:0.1,hint:'الزمن الذي يحتاجه العزم المقنن لتغيير السرعة من الصفر إلى سرعة الفرملة.'},
   {k:'fr',label:'عزم الاحتكاك (نسبة من العزم المقنن)',unit:'%',value:3,min:0,max:30,step:0.5},
   {k:'fmax',label:'أقصى زيادة لتيار المجال',unit:'%',value:150,min:100,max:300,step:5}],()=>{reset();steps.redraw()});
  const P=()=>{const w0=rad(TP.v.n0),K0=207/w0,Tn=K0*IFL;return {w0,K0,Tn,J:TP.v.tau*Tn/w0,Tf:TP.v.fr/100*Tn}};
  const reset=()=>{const p=P();st.ph='run';st.w=p.w0;st.f=1;st.t=0;st.heat=0;st.cur=[]};
  segBind(el,'md',v=>{st.mode=v});segBind(el,'sp',v=>{st.spd=+v});$('#d2Rs').oninput=e=>{st.R=+e.target.value};
  $('#d2go').onclick=()=>{if(st.ph!=='run')reset();const p=P();st.ph='brake';st.t=0;st.heat=0;st.cur=[[0,rpm(st.w),0]];const E=p.K0*st.w;const Ru=st.mode==='fix'?st.R:st.mode==='stepR'?Math.max(0,E/Iset-Ra):st.R;st.I0=E/(Ra+Ru);st.over=st.I0>Iset+0.5;st.R0=Ru};
  $('#d2rs').onclick=reset;
  const steps=stepsUI($('#d2st'),[
   {t:'الفرملة بالمقاومة المحسوبة',x:'المقاومة على <span class="ltr">1.81 Ω</span> (ناتج مثال 6-2) والطريقة «R ثابتة». اضغط «افصل المصدر وابدأ الفرملة»: التيار الابتدائي <span class="ltr">207 ÷ (0.38 + 1.81) ≈ 94.5 A</span> — لا يتعدى الحد.',done:()=>st.ph!=='run'&&st.mode==='fix'&&Math.abs(st.R0-1.81)<0.02},
   {t:'التيار يتناقص',x:'تابع المنحنيين: مع تباطؤ الآلة تقل \\(E\\) فيقل التيار والعزم، فيصبح التباطؤ أبطأ. انتظر حتى تتوقف الآلة.',done:()=>st.ph==='stop'&&st.mode==='fix'},
   {t:'مقاومة أصغر من اللازم',x:'اجعل R نحو <span class="ltr">0.5 Ω</span> وأعد التجربة (أعد التشغيل ثم افصل): التيار الابتدائي يتعدى <span class="ltr">94.5 A</span> — لذلك نحسب R من المعادلة (6-5).',done:()=>st.over},
   {t:'خفض R تدريجياً',x:'اختر «خفض R تدريجياً» وأعد التجربة: تبدأ R من <span class="ltr">1.81 Ω</span> وتنقص مع السرعة فيبقى التيار <span class="ltr">94.5 A</span> حتى تصل R إلى الصفر. قارن زمن التوقف بالمحاولة الأولى.',done:()=>st.done.stepR},
   {t:'زيادة تيار المجال',x:'اختر «زيادة تيار المجال» (و R على <span class="ltr">1.81 Ω</span>) وأعد التجربة: يقوى المجال فيعوّض نقص السرعة، ويبقى التيار ثابتاً حتى يبلغ المجال حده الأقصى.',done:()=>st.done.field}]);
  reset();
  loopOn(el,dt=>{const p=P();let h=dt*st.spd;
   while(h>1e-9&&st.ph==='brake'){const d=Math.min(h,0.01);h-=d;let E0=p.K0*st.w,Ru=st.R;
    if(st.mode==='stepR')Ru=Math.max(0,E0/Iset-Ra);
    if(st.mode==='field'){const need=Iset*(Ra+st.R)/Math.max(1e-9,E0);st.f=clamp(need,1,TP.v.fmax/100)}else st.f=1;
    const E=p.K0*st.f*st.w,I=E/(Ra+Ru),T=p.K0*st.f*I;st.w-=(T+p.Tf)/p.J*d;st.t+=d;st.heat+=I*I*Ru*d;st.Ru=Ru;
    if(st.w<=0){st.w=0;st.ph='stop';st.done[st.mode]=1;st.runs.push({mode:st.mode,pts:st.cur.slice()});if(st.runs.length>3)st.runs.shift()}
    if(!st.cur.length||st.t-st.cur[st.cur.length-1][0]>=0.03)st.cur.push([st.t,rpm(st.w),I])}
   const brake=st.ph==='brake';let Ru=st.mode==='fix'?st.R:(st.Ru!=null?st.Ru:st.R);const E=p.K0*(brake?st.f:1)*st.w,I=st.ph==='run'?(V-207)/Ra:(st.ph==='stop'?0:E/(Ra+Ru));
   $('#d2Rs-v').textContent=fm(st.R,2)+' Ω';
   $('#d2n').textContent=fm(rpm(st.w),0)+' rpm';$('#d2E').textContent=fm(E,1)+' V';$('#d2I').textContent=fm(I,1)+' A';$('#d2R').textContent=st.ph==='run'?'—':fm(Ru,2)+' Ω';$('#d2T').textContent=st.ph==='run'?'—':fm(p.K0*st.f*I,1)+' Nm';$('#d2H').textContent=fm(st.heat/1000,1)+' kJ';$('#d2t').textContent=fm(st.t,2)+' s';
   const ch=$('#d2chip');if(st.ph==='run'){ch.className='ed-chip ld';ch.textContent='يعمل محركاً'}else if(st.ph==='stop'){ch.className='ed-chip ok';ch.textContent='توقف في '+fm(st.t,2)+' s'}else if(st.over){ch.className='ed-chip warn';ch.textContent='التيار الابتدائي '+fm(st.I0,1)+' A يتعدى 94.5 A'}else{ch.className='ed-chip hot';ch.textContent='فرملة ديناميكية'}
   $('#d2c').innerHTML=st.ph==='run'?dcCkt('motor',{lab:{V:'230 V'},title:'Motor'}):dcCkt('dyn',{on:brake,lab:{V:'230 V',R:'R = '+fm(Ru,2)+' Ω'},title:'Dynamic Braking'});
   const all=st.runs.map(r=>r.pts).concat([st.cur]),tm=niceMax(Math.max(1,...all.map(a=>a.length?a[a.length-1][0]:0))),nm=niceMax(TP.v.n0*1.05),im=niceMax(Math.max(Iset*1.1,...all.flat().map(q=>q[2])));
   const cols={fix:'--fg',stepR:'--live',field:'--blue'},ser=k=>st.runs.map(r=>({pts:r.pts.map(q=>[q[0],q[k]]),col:cols[r.mode],w:1.6,dash:'5 4'})).concat([{pts:st.cur.map(q=>[q[0],q[k]]),col:cols[st.mode]}]);
   const lg=(X,Y)=>[['fix','R ثابتة'],['stepR','خفض R'],['field','زيادة المجال']].map((q,i)=>`<rect x="${fx(X(tm)-112)}" y="${18+i*16}" width="14" height="4" fill="var(${cols[q[0]]})"/>`+arT(fx(X(tm)-118),24+i*16,q[1],{a:'start',fs:11})).join('');
   $('#d2p1').innerHTML=plotSVG({w:520,h:230,cid:'d2c1',x0:0,x1:tm,y0:0,y1:nm,xt:ticks(0,tm,5),yt:ticks(0,nm,4),xl:'t (s)',yl:'n (rpm)',series:ser(1),extra:lg});
   $('#d2p2').innerHTML=plotSVG({w:520,h:230,cid:'d2c2',x0:0,x1:tm,y0:0,y1:im,xt:ticks(0,tm,5),yt:ticks(0,im,4),xl:'t (s)',yl:'I (A)',series:ser(2),extra:(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(Iset))}H${fx(X(tm))}" stroke="var(--stop)" stroke-dasharray="4 4"/>`+S.t(fx(X(0)+4),fx(Y(Iset)-5),'94.5 A','m','start')});
   steps.check()});
 },
 examples:[
  {title:'مثال (6-2)',ref:'ص 73',q:'<p>محرك تيار مستمر، توالي، قدرته <span class="ltr">15</span> حصان، <span class="ltr">230 V</span>، مقاومة المنتج <span class="ltr">0.38 Ω</span>، وتيار حمله الكامل <span class="ltr">54 A</span>، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي <span class="ltr">0.9</span> من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">1.75</span> من قيمة تيار الحمل الكامل.</p>',given:G62,solve:g=>Z(solve62(g)),note:'كلمة «توالي» في نص المثال لا تغيّر الحل؛ الشرح والشكل (6-2) لمحرك التوازي.'},
  {title:'تمرين (6-4) — حل مقترح (ليس من الكتاب)',ref:'ص 78',q:'<p>محرك تيار مستمر، توالي، قدرته <span class="ltr">25</span> حصان، <span class="ltr">240 V</span>، مقاومة المنتج <span class="ltr">0.38 Ω</span>، وتيار حمله الكامل <span class="ltr">90 A</span>، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي <span class="ltr">0.95</span> من جهد المصدر، وأن أقصى تيار أثناء الفرملة لا يتعدى <span class="ltr">1.6</span> من تيار الحمل الكامل.</p>',
   given:cloneG(G62,{hp:25,V:240,Ra:0.38,IFL:90,kE:0.95,kI:1.6}),solve:g=>Z(solve62(g)),note:SUG}
 ],
 quiz:[
  {q:'في الفرملة الديناميكية تذهب طاقة الحركة إلى:',o:['المصدر','حرارة في مقاومة إضافية','المجال','الفرامل الميكانيكية'],c:1,e:'ص 72.'},
  {q:'في الفرملة الديناميكية لمحرك التوازي يكون المنتج:',o:['موصلاً بالمصدر','مفصولاً عن المصدر وموصلاً بالمقاومة R','معكوس الطرفين على المصدر','مقصوراً مباشرة'],c:1,e:'الشكل (6-2).'},
  {q:'المعادلة (6-5) لحساب المقاومة:',o:['E<sub>b</sub> = I<sub>b</sub>(R<sub>a</sub> + R)','E<sub>b</sub> + V = I<sub>b</sub>R<sub>t</sub>','V = E<sub>b</sub> − I<sub>a</sub>R<sub>a</sub>','I<sub>b</sub> = V/R'],c:0,e:'ص 72.'},
  {q:'E<sub>b</sub> = 200 V، وأقصى تيار 100 A، و R<sub>a</sub> = 0.4 Ω. المقاومة الإضافية:',o:['2 Ω','1.6 Ω','2.4 Ω','0.4 Ω'],c:1,e:'\\(R_t=200/100=2\\) و \\(R=2-0.4=1.6\\ \\Omega\\).'},
  {q:'كيف يُحفظ تيار الفرملة ثابتاً أثناء التباطؤ؟',o:['بزيادة R','بخفض R تدريجياً أو بزيادة تيار المجال','بخفض تيار المجال','بعكس المجال'],c:1,e:'ص 72.'},
  {q:'إذا بقيت R ثابتة فإن عزم الفرملة مع تباطؤ الآلة:',o:['يزيد','يبقى ثابتاً','يقل','ينعكس'],c:2,e:'E تقل مع السرعة فيقل التيار والعزم.'},
  {q:'في محرك التوالي أثناء الفرملة الديناميكية يجب:',o:['قصر المجال','فصل المجال عن المنتج وتغذيته تغذية مستقلة','عكس المجال مع المنتج','زيادة الجهد'],c:1,e:'ص 74.'}
 ]
});

/* ======================================================================
   Lesson u6-l3 — الفرملة بالتيار المعكوس (التبديل)
   ====================================================================== */
function solve63(g,o){o=o||{};const bk=!!o.bk,Eb=R(g.V-g.IFL*g.Ra,2),S1=R(g.V+Eb,2),Rt=R(S1/g.Ib,3),Rx=R(Rt-g.Ra,3),w=R(2*PI*g.n/60,1),Tf=R(g.P*1000/w,0),Tb=R(Tf*g.Ib/g.IFL,0),Eh=R(Eb/2,2),Rt4=bk?3.3123:R(S1/g.Ib,4);
  const S2=bk?S1:R(g.V+Eh,2),Ih=R((g.V+Eh)/Rt4,1),Th=bk?302:R(Tf*Ih/g.IFL,0);
  return [
   {t:'<b>1)</b> القوة الدافعة قبل تبديل طرفي المنتج من (6-6):',f:`E_b=V-I_aR_a=${fm(g.V)}-${fm(g.IFL)}\\times ${fm(g.Ra)}`,v:Eb,unit:'V'},
   {t:'بعد التبديل تُضاف القوة الدافعة إلى جهد المصدر:',f:`V+E_b=${fm(g.V)}+${fm(Eb)}`,v:S1,unit:'V'},
   {t:'من (6-7):',f:`R_t=\\frac{V+E_b}{I_b}=\\frac{${fm(S1)}}{${fm(g.Ib)}}`,v:Rt,unit:'Ω',dp:3},
   {t:'المقاومة الإضافية:',f:`R=R_t-R_a=${fm(Rt,3)}-${fm(g.Ra)}`,v:Rx,unit:'Ω',dp:3,final:true},
   {t:'<b>2)</b> السرعة الزاوية عند الحمل الكامل:',f:`\\omega_f=\\frac{2\\pi n_f}{60}=\\frac{2\\pi\\times ${fm(g.n)}}{60}`,v:w,unit:'rad/s',dp:1},
   {t:'عزم الحمل الكامل من القدرة:',f:`T_f=\\frac{P_f}{\\omega_f}=\\frac{${fm(g.P)}\\times1000}{${fm(w,1)}}`,v:Tf,unit:'Nm'},
   {t:'العزم يتناسب مع تيار المنتج (\\(f\\) هنا = الحمل الكامل):',f:`\\frac{T_f}{T_b}=\\frac{I_f}{I_b}\\Rightarrow T_b=${fm(Tf)}\\times\\frac{${fm(g.Ib)}}{${fm(g.IFL)}}`,v:Tb,unit:'Nm',final:true},
   {t:'<b>3)</b> عند نصف السرعة تهبط القوة الدافعة إلى النصف:',f:`E_{b0.5}=\\frac{${fm(Eb)}}{2}`,v:Eh,unit:'V'},
   {t:bk?'<span class="sub">(السطر كما طُبع: الجمع بالقوة الدافعة الكاملة 210.5 — خطأ؛ والصحيح 220 + 105.25 = 325.25، وهو ما استُعمل فعلاً في السطر التالي)</span>':'',f:bk?`V+E_{b0.5}=${fm(g.V)}+${fm(Eb)}`:`V+E_{b0.5}=${fm(g.V)}+${fm(Eh)}`,v:S2,unit:'V'},
   {t:'تيار الفرملة عند نصف السرعة:',f:`I_{b0.5}=\\frac{${fm(g.V)}+${fm(Eh)}}{${fm(Rt4)}}`,v:Ih,unit:'A',dp:1},
   {t:'عزم الفرملة عند نصف السرعة:'+(bk?' <span class="sub">(مطبوع 302؛ والناتج 302.9 ≈ 303)</span>':''),f:`T_{b0.5}=${fm(Tf)}\\times\\frac{${fm(Ih,1)}}{${fm(g.IFL)}}`,v:Th,unit:'Nm',final:true}]}
function solve64(g,o){o=o||{};const bk=!!o.bk,Eb=R(g.V-g.IFL*g.Ra,2),S1=R(g.V+Eb,2),Rt=R(S1/g.Ib,3),Rx=R(Rt-g.Ra,3),w=R(2*PI*g.n/60,1),Tf=bk?1209.2:R(Eb*g.IFL/w,1),Tb=bk?1815.3:R(Tf*g.Ib/g.IFL,1),Eh=R(Eb/2,2),Ih=R((g.V+Eh)/Rt,2),Th=R(Tf*Ih/g.IFL,2);
  return [
   {t:'<b>1)</b> من (6-6):',f:`E_b=V-I_aR_a=${fm(g.V)}-${fm(g.IFL)}\\times ${fm(g.Ra)}`,v:Eb,unit:'V'},
   {t:'',f:`V+E_b=${fm(g.V)}+${fm(Eb)}`,v:S1,unit:'V'},
   {t:'من (6-7):',f:`R_t=\\frac{V+E_b}{I_b}=\\frac{${fm(S1)}}{${fm(g.Ib)}}`,v:Rt,unit:'Ω'},
   {t:'المقاومة الإضافية:',f:`R=R_t-R_a=${fm(Rt)}-${fm(g.Ra)}`,v:Rx,unit:'Ω',final:true},
   {t:'<b>2)</b> السرعة الزاوية:',f:`\\omega_f=\\frac{2\\pi\\times ${fm(g.n)}}{60}`,v:w,unit:'rad/s',dp:1},
   {t:'عزم الحمل الكامل (هنا من القدرة الكهرومغناطيسية \\(E_b I_a\\)):'+(bk?' <span class="sub">(مطبوع 1209.2؛ وناتج القسمة 1210.2)</span>':''),f:`T_f=\\frac{E_b\\,I_a}{\\omega_f}=\\frac{${fm(Eb)}\\times ${fm(g.IFL)}}{${fm(w,1)}}`,v:Tf,unit:'Nm',dp:1},
   {t:'عزم الفرملة الابتدائي:'+(bk?' <span class="sub">(مطبوع 1815.3، وهو ناتج 1210.2 × 1.5 لا 1209.2 × 1.5 = 1813.8)</span>':''),f:`T_b=T_f\\times\\frac{I_b}{I_f}=${fm(Tf,1)}\\times\\frac{${fm(g.Ib)}}{${fm(g.IFL)}}`,v:Tb,unit:'Nm',dp:1,final:true},
   {t:'<b>3)</b> \\(E_b\\propto n\\)، فعند نصف السرعة:',f:`E_{b0.5}=\\frac{${fm(Eb)}}{2}`,v:Eh,unit:'V'},
   {t:'',f:`I_{b0.5}=\\frac{${fm(g.V)}+${fm(Eh)}}{${fm(Rt)}}`,v:Ih,unit:'A',dp:2},
   {t:'',f:`T_{b0.5}=${fm(Tf,1)}\\times\\frac{${fm(Ih,2)}}{${fm(g.IFL)}}`,v:Th,unit:'Nm',dp:2,final:true}]}
function solveX65(g){const Po=R(g.hp*746,0),Pi=R(Po/(g.eff/100),0),IFL=R(Pi/g.V,2),Eb=R(g.V-IFL*g.Ra,2),Ib=R(g.k*IFL,2),Rt=R((g.V+Eb)/Ib,3),Rx=R(Rt-g.Ra,3),w=R(2*PI*g.n/60,1),Tf=R(Po/w,1),Tb=R(Tf*Ib/IFL,1),I0=R(g.V/Rt,2),T0=R(Tf*I0/IFL,1);
  return [{t:'القدرة الخارجة (إضافة من خارج الكتاب: <span class="ltr">1 hp = 746 W</span>):',f:`P_{out}=${fm(g.hp)}\\times746`,v:Po,unit:'W'},
   {t:'القدرة الداخلة عند الحمل الكامل:',f:`P_{in}=\\frac{${Po}}{${fm(g.eff/100)}}`,v:Pi,unit:'W'},
   {t:'تيار الحمل الكامل:',f:`I_f=\\frac{${Pi}}{${fm(g.V)}}`,v:IFL,unit:'A',dp:2},
   {t:'من (6-6):',f:`E_b=${fm(g.V)}-${fm(IFL)}\\times ${fm(g.Ra)}`,v:Eb,unit:'V',dp:2},
   {t:'أقصى تيار = ضعف تيار الحمل الكامل:',f:`I_b=${fm(g.k)}\\times ${fm(IFL)}`,v:Ib,unit:'A'},
   {t:'من (6-7):',f:`R_t=\\frac{${fm(g.V)}+${fm(Eb)}}{${fm(Ib)}}`,v:Rt,unit:'Ω',dp:3},
   {t:'المقاومة الإضافية:',f:`R=${fm(Rt)}-${fm(g.Ra)}`,v:Rx,unit:'Ω',dp:3,final:true},
   {t:'عزم الحمل الكامل بطريقة مثال (6-3):',f:`\\omega_f=\\frac{2\\pi\\times ${fm(g.n)}}{60}=${fm(w,1)},\\quad T_f=\\frac{${Po}}{${fm(w,1)}}`,v:Tf,unit:'Nm',dp:1},
   {t:'أقصى عزم فرملي:',f:`T_b=${fm(Tf,1)}\\times\\frac{${fm(Ib)}}{${fm(IFL)}}`,v:Tb,unit:'Nm',dp:1,final:true},
   {t:'عند توقف المحرك \\(E_b=0\\) فيبقى جهد المصدر وحده:',f:`I_0=\\frac{V}{R_t}=\\frac{${fm(g.V)}}{${fm(Rt)}}`,v:I0,unit:'A',dp:2},
   {t:'العزم عند التوقف:',f:`T_0=${fm(Tf,1)}\\times\\frac{${fm(I0)}}{${fm(IFL)}}`,v:T0,unit:'Nm',dp:1,final:true},
   {t:'<span class="sub">لو حُسب عزم الحمل الكامل بطريقة مثال (6-4) (\\(E_bI_a/\\omega\\)) لخرجت قيم العزم أكبر؛ الكتاب غير متسق بين المثالين.</span>'}]}
const G63=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:220},{id:'P',label:'القدرة',sym:'P_f',unit:'kW',value:18.4},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n_f',unit:'rpm',value:600},{id:'IFL',label:'تيار الحمل الكامل',sym:'I_f',unit:'A',value:95},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.1},{id:'Ib',label:'أقصى تيار ابتدائي أثناء الفرملة',sym:'I_b',unit:'A',value:130}];
const G64=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:400},{id:'IFL',label:'تيار الحمل الكامل',sym:'I_f',unit:'A',value:200},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.1},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n_f',unit:'rpm',value:600},{id:'Ib',label:'أقصى تيار ابتدائي أثناء الفرملة',sym:'I_b',unit:'A',value:300}];
const GX65=[{id:'hp',label:'القدرة',sym:'P',unit:'hp',value:25},{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:400},{id:'Ra',label:'مقاومة المنتج',sym:'R_a',unit:'Ω',value:0.2},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n_f',unit:'rpm',value:450},{id:'eff',label:'الكفاءة عند الحمل الكامل',sym:'\\eta',unit:'%',value:74.6},{id:'k',label:'أقصى تيار (مضاعف تيار الحمل الكامل)',sym:'',unit:'',value:2}];
const Q63='<p>محرك للتيار المستمر توصيلة التوازي، <span class="ltr">220 V</span>، <span class="ltr">18.4 kW</span>، سرعته عند الحمل الكامل <span class="ltr">600 rpm</span>، مطلوب فرملته بالتيار المعكوس (التبديل)، إذا كان تيار الحمل الكامل <span class="ltr">95 A</span>، ومقاومة المنتج <span class="ltr">0.1 Ω</span>. أوجد: 1) قيمة المقاومة الإضافية التي يجب توصيلها على التوالي مع ملف المنتج، إذا كانت قيمة التيار الابتدائي أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">130 A</span>. 2) القيمة الابتدائية لعزم الفرملة. 3) قيمة عزم الفرملة عندما تهبط سرعة الدوران إلى نصف قيمتها عند الحمل الكامل.</p>';
const Q64='<p>محرك للتيار المستمر توصيلة التوازي، <span class="ltr">400 V</span>، تيار الحمل الكامل <span class="ltr">200 A</span>، ومقاومة المنتج <span class="ltr">0.1 Ω</span>، سرعته عند الحمل الكامل <span class="ltr">600 rpm</span>، مطلوب فرملته بالتيار المعكوس (التبديل). احسب: 1) قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج لتمنع زيادة التيار الابتدائي أثناء الفرملة الكهربائية عن <span class="ltr">300 A</span>. 2) القيمة الابتدائية لعزم الفرملة. 3) قيمة عزم الفرملة عندما تهبط سرعة الدوران إلى نصف قيمتها عند الحمل الكامل.</p>';

B.lesson({
 id:'u6-l3',unit:6,order:3,pages:'74–78',
 title:'الفرملة بالتيار المعكوس (التبديل)',
 summary:'يُعكس طرفا المنتج أثناء الدوران فتُضاف قوته الدافعة إلى جهد المصدر، فيلزم مقاومة على التوالي تحدّ التيار، ويبذل المحرك عزماً معاكساً يوقفه بسرعة — لكن يجب فصل المصدر عند السرعة صفر وإلا دار عكسياً. المعادلتان (6-6) و(6-7)، والمثالان (6-3) و(6-4)، ومقارنة الطرق الثلاث.',
 theory:[
  {h:'3) الفرملة بالتيار المعكوس أو التبديل Reverse Current Braking or Plugging',ref:'ص 74',html:`<p>في هذه الطريقة يتم <b>عكس اتجاه عزم دوران المحرك</b> بحيث يحاول عكس اتجاه دورانه، وذلك بعكس اتجاه التيار إما في ملف المنتج أو في ملف المجال (ولكن ليس في الاثنين معاً)، والأنسب هو عكس اتجاه التيار في ملف المنتج، فتتباطأ سرعة المحرك والحمل حتى تصل إلى الصفر، ثم يبدأ المحرك حركته في الاتجاه المضاد، لذلك فإنه <b>يلزم استخدام جهاز خاص لفصل التيار عن المحرك عندما تصل سرعته إلى الصفر</b>.</p>
   <p>يلاحظ أنه عند تبديل طرفي المنتج أثناء دوران المحرك تصبح قطبية القوة الدافعة الكهربائية المتولدة <b>مضافة لجهد المصدر</b> بعد أن كانت تضاده، وهذا يعني أن <b>ضعف جهد المصدر</b> أصبح مسلطاً على طرفي المنتج، مما يستدعي ضرورة اتخاذ الاحتياطات اللازمة لحماية ملفات المنتج من التيار الابتدائي للفرملة \\((I_b)\\)، وذلك بتوصيل <b>مقاومة خارجية على التوالي</b> \\((R)\\) مع مقاومة المنتج، تماماً كما يحدث عند بدء الحركة. ومن عيوب هذه الطريقة الطاقة المهدرة من المصدر بالإضافة إلى الطاقة المطلوب تبديدها من الكتل المتحركة، واحتمال عدم الدقة في فصل المصدر الكهربائي عند وصول السرعة إلى الصفر، إلا أنها طريقة فعالة لفرملة المحرك.</p>
   <p>الشكل (6-3) يبين كيفية توصيل محركات التيار المستمر أثناء التشغيل العادي، والتوصيل أثناء استعمال الفرامل بالتبديل لمحرك التوازي.</p>`},
  {fig:'(6-3)',ref:'ص 75',caption:'توصيل محرك التيار المستمر التوازي: يسار — التشغيل العادي. يمين — الفرملة بالتبديل: المجال باقٍ على المصدر، والمنتج معكوس الطرفين وعلى التوالي معه المقاومة المتغيرة R، وتيار المنتج I<sub>a</sub> انعكس.',draw:()=>two(dcCkt('motor',{on:false,title:'Normal Running'}),dcCkt('plug',{on:false,title:'Plugging'}))},
  {html:String.raw`<p><b>ويجب ملاحظة أن</b> القوة الدافعة الكهربائية المتولدة عند لحظة الفرملة \((E_b)\) <b>تحسب قبل</b> تبديل طرفي المنتج أثناء دوران المحرك من المعادلة: <span class="ref">ص 75</span></p>
   $$E_b=V-I_a\,R_a \qquad (6\text{-}6)$$
   <p>ويمكن حساب المقاومة الإضافية \((R)\) التي يجب توصيلها على التوالي مع ملف المنتج لتمنع زيادة التيار الابتدائي أثناء الفرملة، مع ملاحظة أن قطبية القوة الدافعة الكهربائية المتولدة مضافة لجهد المصدر:</p>
   $$E_b+V=I_b\,R_t \qquad (6\text{-}7)$$ $$R_t=R_a+R$$
   <p>في محرك التيار المستمر توازي يتناسب العزم طردياً مع قيمة تيار المنتج وذلك لثبوت تيار المجال: \(T\propto I_a\)، وبالتالي فإن القيمة الابتدائية لعزم الفرملة \((T_b)\) تتناسب طردياً مع قيمة التيار الابتدائي أثناء الفرملة \((I_b)\): \(T_b\propto I_b\).</p>
   <p><b>ويجب ملاحظة أنه كلما انخفضت سرعة دوران المحرك تنخفض القوة الدافعة الكهربائية المتولدة، وبالتالي ينخفض تيار الفرملة الذي يؤدي إلى انخفاض عزم الفرملة.</b></p>`},
  {note:ADD+'قارن التيار الابتدائي في الطريقتين بنفس المقاومة الكلية \\(R_t\\): في الفرملة الديناميكية \\(I=E_b/R_t\\)، وفي التبديل \\(I=(V+E_b)/R_t\\) — أي ضعف التيار تقريباً. ولذلك يحتاج التبديل مقاومة أكبر بنحو الضعف لنفس التيار. وحتى عند السرعة صفر يبقى في التبديل تيار \\(V/R_t\\) وعزم معاكس، فلا يتوقف المحرك من تلقاء نفسه بل يبدأ الدوران عكسياً — وهذا سبب جهاز الفصل.'},
  {h:'مقارنة الطرق الثلاث',ref:'ص 69–75',html:`<div class="ed-tbl"><table class="tt"><thead><tr><th>الطريقة</th><th>المنتج موصل بـ</th><th>أين تذهب الطاقة</th><th>توقف المحرك؟</th><th>ملاحظة من الكتاب</th></tr></thead><tbody>
   <tr><td>إعادة التوليد</td><td>المصدر نفسه</td><td>تعود إلى المصدر</td><td>لا، تخفض السرعة فقط</td><td>تحتاج <span class="ltr">E &gt; V</span>: سرعة أعلى من سرعة اللاحمل أو مجال أقوى أو جهد أقل</td></tr>
   <tr><td>الديناميكية</td><td>مقاومة R بعد فصل المصدر</td><td>حرارة في R</td><td>تتباطأ تدريجياً</td><td>يفضّل خفض R أو زيادة المجال لتثبيت التيار</td></tr>
   <tr><td>التبديل</td><td>المصدر معكوس الطرفين مع R على التوالي</td><td>حرارة في R، ومعها طاقة إضافية من المصدر</td><td>نعم بسرعة — ثم يعكس إن لم يُفصل</td><td>ضعف الجهد على المنتج؛ يلزم جهاز فصل عند السرعة صفر</td></tr></tbody></table></div><p class="sub">الجدول تلخيص من نص الكتاب في الصفحات المذكورة.</p>`},
  {h:'مثال (6-3)',ref:'ص 76–77',html:String.raw`<p>محرك توازي <span class="ltr">220 V</span>، <span class="ltr">18.4 kW</span>، <span class="ltr">600 rpm</span> عند الحمل الكامل، تيار الحمل الكامل <span class="ltr">95 A</span>، \(R_a=0.1\ \Omega\)، والتيار الابتدائي للفرملة لا يتعدى <span class="ltr">130 A</span>. النتائج: \(E_b=210.5\) V، \(R_t=3.312\ \Omega\)، <b>\(R=3.212\ \Omega\)</b>، \(T_f=293\) Nm، <b>\(T_b=401\) Nm</b>، وعند نصف السرعة \(I_{b0.5}=98.2\) A و <b>\(T_{b0.5}\approx303\) Nm</b> (مطبوع 302). الحل كاملاً في تبويب «الأمثلة المحلولة» (كما في الكتاب / المصحح).</p>`},
  {h:'مثال (6-4)',ref:'ص 77',html:String.raw`<p>محرك توازي <span class="ltr">400 V</span>، تيار الحمل الكامل <span class="ltr">200 A</span>، \(R_a=0.1\ \Omega\)، <span class="ltr">600 rpm</span>، والتيار الابتدائي لا يتعدى <span class="ltr">300 A</span>. النتائج: \(E_b=380\) V، \(R_t=2.6\ \Omega\)، <b>\(R=2.5\ \Omega\)</b>، \(T_f=1210.2\) Nm (مطبوع 1209.2)، <b>\(T_b=1815.3\) Nm</b>، وعند نصف السرعة \(I_{b0.5}=226.92\) A و <b>\(T_{b0.5}=1373.1\) Nm</b> (مطبوع 1371.96).</p>`},
  {err:String.raw`<b>ملاحظات على الكتاب (ص 76–77):</b> (١) <b>مثال (6-3)</b>: في الجزء الثالث طُبع \(V+E_{b0.5}=220+210.5=430.5\) V، والصحيح \(220+105.25=325.25\) V، وهو ما استُعمل فعلاً في السطر التالي (\(I_{b0.5}=98.2\) A صحيح). وطُبع \(R_t\) في ذلك السطر 3.3123 والسابق 3.312 (الدقيق 3.3115) — لا أثر له. وطُبع \(T_{b0.5}=302\) Nm والناتج 302.9 ≈ <b>303 Nm</b>. وفي ص 77 تكررت أسطر حساب \(T_f\) و \(T_b\) دون جديد. الرمز \(I_f\) في \(T_f/T_b=I_f/I_b\) يعني تيار الحمل الكامل (95 A) لا تيار المجال. (٢) <b>مثال (6-4)</b>: \(T_f=380\times200/62.8\) طُبع <b>1209.2</b> والناتج <b>1210.2</b> Nm؛ ثم \(T_b\) طُبع 1815.3 وهو ناتج 1210.2 × 1.5 (أي أن 1209.2 خطأ في النقل)، بينما \(T_{b0.5}=1371.96\) حُسب بالرقم الخاطئ 1209.2، والصحيح <b>1373.1 Nm</b>. ووحدة \(T_{b0.5}\) طُبعت «N» والصحيح Nm. (٣) الكتاب غير متسق في حساب عزم الحمل الكامل: في مثال (6-3) من القدرة المقننة الخارجة \(P/\omega\)، وفي مثال (6-4) من القدرة الكهرومغناطيسية \(E_bI_a/\omega\).`},
  {h:'أسئلة وتمارين',ref:'ص 78',html:Q('6-2','وضح كيف يمكن استخدام الفرملة بالتيار المعكوس والفرملة الديناميكية والفرملة بإعادة التوليد لمحرك التيار المستمر التوازي.','<b>إعادة التوليد</b> (ص 69–70، الشكل 6-1): يبقى المحرك موصلاً بالمصدر، ونجعل قوته الدافعة أكبر من جهد المصدر — بزيادة تيار المجال أو خفض جهد المصدر، أو تلقائياً عندما يدفعه حمل هابط فوق سرعة اللاحمل — فينعكس تيار المنتج وتعود الطاقة إلى المصدر؛ تخفض السرعة ولا توقف المحرك. <b>الديناميكية</b> (ص 72، الشكل 6-2): يُفصل المنتج عن المصدر ويوصل بمقاومة R والمجال باقٍ على المصدر، فتعمل الآلة مولداً على المقاومة وتتحول طاقة الحركة إلى حرارة؛ R من \\(E_b=I_b(R_a+R)\\)، ويُخفض R أو يُزاد المجال تدريجياً لتثبيت التيار. <b>التبديل</b> (ص 74–75، الشكل 6-3): يُعكس طرفا المنتج مع إضافة R على التوالي والمجال كما هو، فتُضاف القوة الدافعة إلى جهد المصدر؛ R من \\(E_b+V=I_bR_t\\)، ويجب فصل المصدر عند السرعة صفر.')+
   Q('6-5','محرك للتيار المستمر (تغذية مستقلة)، 25 حصان، 400 V، ومقاومة المنتج 0.2 Ω، سرعته عند الحمل الكامل 450 rpm، كفاءته عند الحمل الكامل 74.6%، مطلوب فرملته بالتيار المعكوس (التبديل). احسب: قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج إذا كان أقصى تيار أثناء الفرملة ينبغي ألا يتعدى ضعف تيار الحمل الكامل، وأقصى عزم فرملي، وقيمة العزم عندما يتوقف المحرك.','الكتاب لا يعطي تحويل الحصان؛ باستعمال <span class="ltr">1 hp = 746 W</span> (إضافة من خارج الكتاب): \\(P_{out}=18650\\) W، \\(P_{in}=18650/0.746=25000\\) W، \\(I_f=62.5\\) A، \\(E_b=400-62.5\\times0.2=387.5\\) V، \\(I_b=125\\) A، \\(R_t=787.5/125=6.3\\ \\Omega\\)، إذن <b>\\(R=6.1\\ \\Omega\\)</b>. بطريقة مثال (6-3): \\(\\omega=47.1\\) rad/s، \\(T_f=18650/47.1\\approx396\\) Nm، فأقصى عزم <b>\\(T_b\\approx792\\) Nm</b>. وعند التوقف \\(E_b=0\\): \\(I=400/6.3\\approx63.5\\) A، والعزم <b>≈ 402 Nm</b> — لا يصل إلى الصفر، ولذلك يلزم جهاز الفصل. (بطريقة مثال 6-4 تخرج قيم العزم أكبر؛ الكتاب غير متسق.)')}
 ],
 lab:(el)=>{
  const PRE={p63:{V:220,IFL:95,Ra:0.1,n:600,R:3.212,Ib:130},p64:{V:400,IFL:200,Ra:0.1,n:600,R:2.5,Ib:300}};
  const st=Object.assign({pre:'p63',meth:'plug',cut:true,ph:'run',w:0,t:0,cur:[],traj:[],half:null,I0:0,rev:false,runs:[],done:{},spd:1,warn:false},PRE.p63);
  el.innerHTML=`<div id="p3tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة <small>مبنية على الشكلين (6-2) و(6-3)</small></h2><div class="svgbox" id="p3c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><button class="btn primary" id="p3go">ابدأ الفرملة</button><button class="btn" id="p3rs">أعد تشغيل المحرك</button><span class="ed-chip" id="p3chip"></span></div>
    <div class="facts">${fact('السرعة n','p3n')}${fact('القوة الدافعة E','p3E')}${fact('الجهد على R<sub>t</sub>','p3VR')}${fact('تيار المنتج I<sub>a</sub>','p3I')}${fact('العزم T = Kϕ·I<sub>a</sub>','p3T')}${fact('الزمن','p3t')}</div>
    <div class="callout" id="p3half" style="display:none"></div></div>
   <div class="panel c6"><h2>التحكم</h2>
    <div class="ed-row" style="margin-top:0">${segHTML('pre',[['p63','آلة مثال (6-3)'],['p64','آلة مثال (6-4)']],st.pre)}</div>
    <div class="ed-row">${segHTML('me',[['plug','التبديل (التيار المعكوس)'],['dyn','الديناميكية']],st.meth)}</div>
    ${sl('p3R','المقاومة الإضافية R',0,8,0.001,st.R)}
    <div class="ed-row">${swHTML('p3cut','الفصل','جهاز فصل التيار عند السرعة صفر',st.cut)}</div>
    <div class="ed-row"><span class="sub">سرعة العرض</span>${segHTML('sp',[[1,'عادي'],[0.25,'أبطأ ×¼']],st.spd)}</div>
    <p class="ed-cap" id="p3cap"></p></div>
   <div class="panel c12"><h2>مستوى السرعة والعزم <small>مسار نقطة التشغيل أثناء الفرملة</small></h2><div class="svgbox" id="p3nt" style="max-width:760px;margin-inline:auto"></div>
    <p class="ed-cap">الأسود = خط التشغيل العادي (محرك)، وامتداده يسار المحور الرأسي هو منطقة الفرملة بإعادة التوليد (المصدر نفسه بلا R). الأحمر = خط التبديل، والأخضر = خط الفرملة الديناميكية بنفس R. النقطة البرتقالية = نقطة التشغيل الآن، والخط البرتقالي الرفيع = مسارها.</p></div>
   <div class="panel c6"><h2>السرعة مع الزمن <small>تبقى آخر ثلاث محاولات</small></h2><div class="svgbox" id="p3p1"></div></div>
   <div class="panel c6"><h2>تيار المنتج مع الزمن</h2><div class="svgbox" id="p3p2"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="p3st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#p3tp'),'u6-l3',[{k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:0.1,max:60,step:0.1,hint:'الزمن الذي يحتاجه العزم المقنن لتغيير السرعة من الصفر إلى سرعة الحمل الكامل.'},
   {k:'fr',label:'عزم الاحتكاك (نسبة من العزم المقنن)',unit:'%',value:3,min:0,max:30,step:0.5}],()=>{reset();steps.redraw()});
  const P=()=>{const wf=rad(st.n),Eb=st.V-st.IFL*st.Ra,K=Eb/wf,Tn=K*st.IFL;return {wf,Eb,K,Tn,J:TP.v.tau*Tn/wf,Tf:TP.v.fr/100*Tn,Rt:st.Ra+st.R}};
  const reset=()=>{const p=P();st.ph='run';st.w=p.wf;st.t=0;st.cur=[];st.traj=[];st.half=null;st.rev=false;$('#p3half').style.display='none'};
  const Ia=(p,w)=>st.ph==='run'?st.IFL:st.ph==='stop'?0:st.meth==='plug'?(-st.V-p.K*w)/p.Rt:-(p.K*w)/p.Rt;
  segBind(el,'pre',v=>{Object.assign(st,PRE[v]);st.pre=v;$('#p3R').value=st.R;reset()});segBind(el,'me',v=>{st.meth=v;reset()});segBind(el,'sp',v=>{st.spd=+v});
  $('#p3R').oninput=e=>{st.R=+e.target.value;if(st.ph!=='brake')reset()};
  $('#p3cut').onclick=()=>{st.cut=!st.cut;$('#p3cut').setAttribute('aria-pressed',String(st.cut))};
  $('#p3go').onclick=()=>{if(st.ph!=='run')reset();const p=P();st.ph='brake';st.t=0;st.I0=Ia(p,st.w);st.warn=Math.abs(st.I0)>2*st.Ib;st.R0=st.R;st.meth0=st.meth;st.cur=[[0,rpm(st.w),st.I0]];st.traj=[[p.K*st.IFL,rpm(st.w)],[p.K*st.I0,rpm(st.w)]]};
  $('#p3rs').onclick=reset;
  const steps=stepsUI($('#p3st'),[
   {t:'مثال (6-3): التبديل',x:'آلة مثال (6-3) و R = <span class="ltr">3.212 Ω</span> وطريقة «التبديل». اضغط «ابدأ الفرملة»: التيار الابتدائي <span class="ltr">(220 + 210.5) ÷ 3.312 ≈ 130 A</span> بالاتجاه المعاكس.',done:()=>st.pre==='p63'&&st.meth0==='plug'&&st.ph!=='run'&&Math.abs(st.R0-3.212)<0.002},
   {t:'عند نصف السرعة',x:'عندما تهبط السرعة إلى <span class="ltr">300 rpm</span> يظهر صندوق «عند نصف السرعة»: التيار ≈ <span class="ltr">98.2 A</span> كما في الجزء الثالث من المثال — العزم أقل لأن القوة الدافعة نقصت إلى النصف.',done:()=>st.half&&st.pre==='p63'&&st.meth0==='plug'},
   {t:'التوقف والفصل',x:'عند السرعة صفر يفصل الجهاز التيار فتتوقف الآلة. لاحظ أن التيار قبل الفصل مباشرة لم يكن صفراً (بقي \\(V/R_t\\)).',done:()=>st.ph==='stop'&&st.meth0==='plug'},
   {t:'بدون جهاز الفصل',x:'أطفئ مفتاح «الفصل» وأعد التشغيل ثم ابدأ الفرملة: بعد السرعة صفر يبدأ المحرك <b>الدوران عكسياً</b> — لهذا يلزم الجهاز الخاص (ص 74).',done:()=>st.rev},
   {t:'قارن بالديناميكية',x:'اختر «الديناميكية» بنفس المقاومة، أعد التشغيل وافرمل: التيار الابتدائي نحو النصف (\\(E_b/R_t\\) بدل \\((V+E_b)/R_t\\)) والتوقف أبطأ بكثير. قارن المنحنيات.',done:()=>st.meth0==='dyn'&&st.ph==='stop'},
   {t:'بلا مقاومة إضافية',x:'اجعل R أقل من <span class="ltr">0.5 Ω</span> وجرّب التبديل: ضعف جهد المصدر تقريباً على مقاومة المنتج الصغيرة فقط — تيار هائل يتلف الملفات. هذا سبب المقاومة (ص 74).',done:()=>st.warn&&st.meth0==='plug'},
   {t:'مثال (6-4)',x:'اختر «آلة مثال (6-4)» (R = <span class="ltr">2.5 Ω</span>) وافرمل بالتبديل: التيار الابتدائي <span class="ltr">300 A</span>، وعند نصف السرعة ≈ <span class="ltr">226.9 A</span>. العزم الابتدائي في المحاكاة ≈ <span class="ltr">1814 Nm</span> قريب من رقم الكتاب <span class="ltr">1815.3 Nm</span>.',done:()=>st.pre==='p64'&&st.half&&st.meth0==='plug'}]);
  reset();
  loopOn(el,dt=>{const p=P();let h=dt*st.spd;
   while(h>1e-9&&st.ph==='brake'){const d=Math.min(h,0.005);h-=d;const I=Ia(p,st.w),T=p.K*I,wPrev=st.w;
    st.w+=(T-p.Tf*Math.sign(st.w||(-1)))/p.J*d;st.t+=d;
    if(!st.half&&st.w<=p.wf/2&&wPrev>p.wf/2){const Ih=Ia(p,p.wf/2);st.half={I:Ih,T:p.K*Ih}}
    if(wPrev>0&&st.w<=0){if(st.cut||st.meth==='dyn'){st.w=0;st.ph='stop'}}
    if(st.w<-0.02*p.wf)st.rev=true;
    if(st.ph==='brake'&&!st.cut&&st.meth==='plug'&&st.t>40*TP.v.tau)st.ph='stop';
    if(st.ph==='brake'&&st.meth==='dyn'&&st.t>200*TP.v.tau){st.ph='stop'}
    if(!st.cur.length||st.t-st.cur[st.cur.length-1][0]>=0.02||st.ph==='stop'){const I2=st.ph==='stop'?0:Ia(p,st.w);st.cur.push([st.t,rpm(st.w),I2]);st.traj.push([p.K*I2,rpm(st.w)])}
    if(st.ph==='stop'){st.runs.push({m:st.meth0,pts:st.cur.slice()});if(st.runs.length>3)st.runs.shift()}}
   const I=Ia(p,st.w),E=p.K*st.w,T=p.K*I;
   $('#p3R-v').textContent=fm(st.R,3)+' Ω';$('#p3n').textContent=fm(rpm(st.w),1)+' rpm';$('#p3E').textContent=fm(E,1)+' V';
   $('#p3VR').textContent=st.ph==='brake'?fm(Math.abs(I)*p.Rt,1)+' V':'—';$('#p3I').textContent=fm(I,1)+' A';$('#p3T').textContent=fm(T,1)+' Nm';$('#p3t').textContent=fm(st.t,2)+' s';
   const ch=$('#p3chip');if(st.ph==='run'){ch.className='ed-chip ld';ch.textContent='تشغيل عادي بالحمل الكامل'}else if(st.ph==='stop'){ch.className='ed-chip ok';ch.textContent=st.rev?'دار عكسياً!':'توقف وفُصل التيار'}else if(st.rev){ch.className='ed-chip warn';ch.textContent='يدور عكسياً — لم يُفصل المصدر'}else if(st.warn){ch.className='ed-chip warn';ch.textContent='تيار ابتدائي خطير: '+fm(Math.abs(st.I0),0)+' A'}else{ch.className='ed-chip hot';ch.textContent=st.meth==='plug'?'فرملة بالتبديل':'فرملة ديناميكية'}
   $('#p3cap').innerHTML=`الآلة: <span class="ltr">${st.V} V</span>، تيار الحمل الكامل <span class="ltr">${st.IFL} A</span>، <span class="ltr">R<sub>a</sub> = ${st.Ra} Ω</span>، <span class="ltr">${st.n} rpm</span>؛ ومنها <span class="ltr">E<sub>b</sub> = ${fm(p.Eb,1)} V</span> من (6-6) و <span class="ltr">Kϕ = ${fm(p.K,3)} V·s/rad</span>. العزم هنا هو العزم الكهرومغناطيسي <span class="ltr">Kϕ·I<sub>a</sub></span>${st.pre==='p63'?'؛ لذلك يخرج عزم الفرملة الابتدائي ≈ <span class="ltr">'+fm(p.K*st.Ib,0)+' Nm</span> أكبر من رقم الكتاب 401 Nm الذي بُني على القدرة الخارجة 18.4 kW':''}.`;
   if(st.half){const e=$('#p3half');e.style.display='';e.innerHTML=`<b>عند نصف السرعة</b> (<span class="ltr">${fm(st.n/2,0)} rpm</span>): التيار <b class="ltr">${fm(Math.abs(st.half.I),1)} A</b> والعزم <span class="ltr">${fm(Math.abs(st.half.T),0)} Nm</span>${st.meth0==='plug'?'':' (فرملة ديناميكية)'}.`}
   const mode=st.ph==='run'?'motor':st.meth==='plug'?'plug':'dyn';
   $('#p3c').innerHTML=dcCkt(mode,{on:st.ph!=='stop',lab:{V:st.V+' V',R:'R = '+fm(st.R,3)+' Ω'},title:mode==='motor'?'Normal Running':mode==='plug'?'Plugging':'Dynamic Braking'});
   const nf=st.n,ym=niceMax(nf*1.3),xm=niceMax(Math.max(p.K*(st.V+p.Eb)/p.Rt,p.K*st.IFL)*1.15),Tn=T2=>T2;
   const nOf=(f)=>[[-xm,f(-xm)],[xm,f(xm)]];
   const mot=T2=>rpm((st.V-T2/p.K*st.Ra)/p.K),plg=T2=>rpm((-st.V-T2/p.K*p.Rt)/p.K),dyn=T2=>rpm(-(T2/p.K)*p.Rt/p.K);
   $('#p3nt').innerHTML=ntPlane({cid:'p3ntc',xm,ym,y0:-ym,series:[{pts:nOf(mot),col:'--fg',w:2},{pts:nOf(plg),col:'--stop'},{pts:nOf(dyn),col:'--on'},{pts:st.traj,col:'--live',w:1.6}],
    zones:[[-xm*0.5,ym*0.85,'فرملة','--muted'],[xm*0.5,ym*0.85,'محرك','--muted'],[-xm*0.5,-ym*0.85,'دوران عكسي','--muted']],pts:[[T,rpm(st.w),'--live']]});
   const all=st.runs.map(r=>r.pts).concat([st.cur]),tm=niceMax(Math.max(0.5,...all.map(a=>a.length?a[a.length-1][0]:0))),nm=niceMax(nf*1.1),imx=niceMax(Math.max(st.Ib*1.2,...all.flat().map(q=>Math.abs(q[2]))));
   const cols={plug:'--stop',dyn:'--on'},ser=k=>st.runs.map(r=>({pts:r.pts.map(q=>[q[0],k===2?Math.abs(q[2]):q[k]]),col:cols[r.m],w:1.5,dash:'5 4'})).concat([{pts:st.cur.map(q=>[q[0],k===2?Math.abs(q[2]):q[k]]),col:cols[st.meth0||st.meth]}]);
   const lg=(X,Y)=>[['plug','التبديل'],['dyn','الديناميكية']].map((q,i)=>`<rect x="${fx(X(tm)-96)}" y="${18+i*16}" width="14" height="4" fill="var(${cols[q[0]]})"/>`+arT(fx(X(tm)-102),24+i*16,q[1],{a:'start',fs:11})).join('');
   $('#p3p1').innerHTML=plotSVG({w:520,h:230,cid:'p3c1',x0:0,x1:tm,y0:-nm,y1:nm,xt:ticks(0,tm,5),yt:ticks(-nm,nm,4),xl:'t (s)',yl:'n (rpm)',series:ser(1),extra:lg});
   $('#p3p2').innerHTML=plotSVG({w:520,h:230,cid:'p3c2',x0:0,x1:tm,y0:0,y1:imx,xt:ticks(0,tm,5),yt:ticks(0,imx,4),xl:'t (s)',yl:'|Ia| (A)',series:ser(2),extra:(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(st.Ib))}H${fx(X(tm))}" stroke="var(--stop)" stroke-dasharray="4 4"/>`+S.t(fx(X(tm)-4),fx(Y(st.Ib)-5),'Ib = '+st.Ib+' A','m','end')});
   steps.check()});
 },
 examples:[
  {title:'مثال (6-3) — الحل كما في الكتاب',ref:'ص 76–77',q:Q63,given:G63,solve:(g,B,isBook)=>Z(solve63(g,{bk:isBook})),note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الأسطر كما طُبعت: \\(V+E_{b0.5}=220+210.5=430.5\\) (خطأ — الصحيح 325.25 وهو المستعمل في السطر التالي)، و \\(R_t=3.3123\\)، و \\(T_{b0.5}=302\\) Nm (الصحيح ≈ 303). إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة.'},
  {title:'مثال (6-3) — الحل المصحح',ref:'ص 76–77',q:'<p>نفس المثال بالجمع الصحيح عند نصف السرعة وبالتقريب الصحيح (حساب مصحح — ليس من الكتاب).</p>',given:G63,solve:g=>Z(solve63(g,{})),note:'الفرق عن الكتاب: \\(V+E_{b0.5}=325.25\\) V، و \\(T_{b0.5}=303\\) Nm بدل 302. باقي النتائج كما في الكتاب.'},
  {title:'مثال (6-4) — الحل كما في الكتاب',ref:'ص 77',q:Q64,given:G64,solve:(g,B,isBook)=>Z(solve64(g,{bk:isBook})),note:'<b>ملاحظة على الكتاب:</b> \\(T_f\\) مطبوع 1209.2 والناتج 1210.2؛ و \\(T_b=1815.3\\) يوافق 1210.2 (لا 1209.2)؛ و \\(T_{b0.5}=1371.96\\) حُسب بالرقم الخاطئ 1209.2؛ ووحدته طُبعت N والصحيح Nm.'},
  {title:'مثال (6-4) — الحل المصحح',ref:'ص 77',q:'<p>نفس المثال بالقيمة الصحيحة \\(T_f=1210.2\\) Nm في كل الأسطر (حساب مصحح — ليس من الكتاب).</p>',given:G64,solve:g=>Z(solve64(g,{})),note:'النتائج المصححة: \\(T_f=1210.2\\) Nm، \\(T_b=1815.3\\) Nm، \\(T_{b0.5}=1373.1\\) Nm.'},
  {title:'تمرين (6-5) — حل مقترح (ليس من الكتاب)',ref:'ص 78',q:'<p>محرك للتيار المستمر (تغذية مستقلة)، <span class="ltr">25</span> حصان، <span class="ltr">400 V</span>، ومقاومة المنتج <span class="ltr">0.2 Ω</span>، سرعته عند الحمل الكامل <span class="ltr">450 rpm</span>، كفاءته عند الحمل الكامل <span class="ltr">74.6%</span>، مطلوب فرملته بالتيار المعكوس (التبديل). احسب: قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج إذا كان أقصى تيار أثناء الفرملة ينبغي ألا يتعدى ضعف تيار الحمل الكامل، وأقصى عزم فرملي، وقيمة العزم عندما يتوقف المحرك.</p>',given:GX65,solve:g=>Z(solveX65(g)),note:SUG+' التحويل <span class="ltr">1 hp = 746 W</span> إضافة من خارج الكتاب، والعزم بطريقة مثال (6-3).'}
 ],
 quiz:[
  {q:'في الفرملة بالتبديل يُعكس اتجاه التيار في:',o:['المنتج والمجال معاً','المنتج (الأنسب) أو المجال، وليس الاثنين معاً','المصدر فقط','لا شيء'],c:1,e:'ص 74.'},
  {q:'لماذا يلزم جهاز فصل عند وصول السرعة إلى الصفر؟',o:['لأن المحرك سيبدأ الدوران في الاتجاه المضاد','لأن التيار يصبح صفراً','لتوفير الطاقة','لأن المجال ينعكس'],c:0,e:'ص 74.'},
  {q:'عند تبديل طرفي المنتج أثناء الدوران يكون الجهد المؤثر في دائرة المنتج:',o:['V − E<sub>b</sub>','E<sub>b</sub> فقط','V + E<sub>b</sub> (ضعف جهد المصدر تقريباً)','صفراً'],c:2,e:'ص 74 والمعادلة (6-7).'},
  {q:'القوة الدافعة E<sub>b</sub> في مسائل التبديل تُحسب:',o:['بعد التبديل','قبل التبديل من E<sub>b</sub> = V − I<sub>a</sub>R<sub>a</sub>','من E<sub>b</sub> = V + I<sub>a</sub>R<sub>a</sub>','بالقياس فقط'],c:1,e:'المعادلة (6-6) ص 75.'},
  {q:'V = 200 V، I<sub>a</sub> = 50 A، R<sub>a</sub> = 0.2 Ω، وأقصى تيار تبديل 100 A. المقاومة الكلية R<sub>t</sub>:',o:['1.9 Ω','3.9 Ω','2 Ω','4.1 Ω'],c:1,e:'\\(E_b=190\\)، \\(R_t=(200+190)/100=3.9\\ \\Omega\\).'},
  {q:'في محرك التوازي، عزم الفرملة الابتدائي يتناسب مع:',o:['مربع التيار','التيار الابتدائي I<sub>b</sub>','الجهد فقط','السرعة'],c:1,e:'\\(T_b\\propto I_b\\) لثبوت تيار المجال.'},
  {q:'من عيوب الفرملة بالتبديل:',o:['لا توقف المحرك','الطاقة المهدرة من المصدر واحتمال عدم دقة الفصل عند السرعة صفر','تحتاج مولداً منفصلاً','لا تحتاج مقاومة'],c:1,e:'ص 74.'},
  {q:'أي الطرق الثلاث تعيد الطاقة إلى المصدر؟',o:['التبديل','الديناميكية','إعادة التوليد','كلها'],c:2,e:'ص 69.'}
 ]
});

})(PLCBOOK);
