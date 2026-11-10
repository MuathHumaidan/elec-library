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

/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));

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
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${LTU(s.t)}</h4><p>${LTU(s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
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
const LTU=x=>B.ltrU(x).replace(/<span class="ltr">(\(\d+-\d+\))<\/span>/g,'$1');   // units LTR; equation/figure numbers stay as printed (like the other courses)
const LT=x=>typeof x==='string'?LTU(x):x;
const FIXL=L=>{(L.theory||[]).forEach(b=>{['h','html','note','err','caption'].forEach(k=>{if(b[k])b[k]=LT(b[k])})});(L.examples||[]).forEach(x=>{['title','q','note'].forEach(k=>{if(x[k])x[k]=LT(x[k])})});return L};
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

B.lesson(FIXL({
 id:'u6-l1',unit:6,order:1,pages:'65–71، 78',
 title:'أنواع الفرامل الكهربائية والفرملة بإعادة التوليد',
 summary:'لماذا نحتاج إلى الفرملة، ومزايا الفرامل الكهربائية على الميكانيكية، وطرقها الثلاث بالمحرك نفسه. ثم الفرملة بإعادة التوليد: تعمل الآلة مولداً وهي موصلة بالمصدر عندما تزيد قوتها الدافعة عن جهده، فتعيد الطاقة إليه، لكنها لا توقف المحرك. مع مثال (6-1).',
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

  {st:1,short:'أهداف الوحدة',title:'الوحدة السادسة: فرملة المحركات الكهربائية — الأهداف',ref:'ص 66',
   q:'ما الذي يُنتظر منك أن تعرفه عن فرملة المحركات حين تنتهي من هذه الوحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لأهداف الوحدة السادسة، والأولى والرابعة مظللتان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="46" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">الأهداف التفصيلية للوحدة السادسة</text><g data-tip="هذا الدرس: المحطات 5–7."><rect x="40" y="64" width="280" height="42" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="85" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="300" y="89.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">1</text><text x="166" y="90" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الفرملة بإعادة التوليد</text></g><g data-tip="الدرس الثاني من الوحدة."><rect x="40" y="116" width="280" height="42" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="137" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="300" y="141.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">2</text><text x="166" y="142" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الفرملة الديناميكية</text></g><g data-tip="الدرس الثالث من الوحدة."><rect x="40" y="168" width="280" height="42" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="189" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="300" y="193.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">3</text><text x="166" y="194" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الفرملة بالتيار المعكوس (التبديل)</text></g><g data-tip="مزايا الفرامل الكهربائية في هذا الدرس (المحطة 3)، والمقارنة بين الطرق الثلاث في الدرس الثالث."><rect x="40" y="220" width="280" height="42" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="241" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="300" y="245.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">4</text><text x="166" y="246" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مميزات وعيوب الطرق المختلفة</text></g><rect x="206" y="282" width="16" height="16" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="150" y="295" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">يُدرس في هذا الدرس</text></svg>`,
   cap:'الأهداف الأربعة مختصرة، والبطاقتان الصفراوان يغطيهما هذا الدرس.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف أين يُدرس الهدف.</b>',
   side:[
    {predict:{q:'على أي نوع من المحركات تطبق الوحدة طرق الفرملة الثلاث؟',opts:[
     ['محركات التيار المتردد الحثية',false,'الأهداف كلها تقول «وكيفية تطبيقها على محركات التيار المستمر».'],
     ['محركات التيار المستمر',true,'كل هدف من الأهداف الثلاثة الأولى ينتهي بـ «على محركات التيار المستمر» (ص 66).'],
     ['المحركات التزامنية',false,'لا تذكرها أهداف هذه الوحدة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة أنواع الكوابح (الفرامل) الكهربائية وكيفية تطبيقها على المحركات الكهربائية.</p>
     <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب الفرملة بإعادة التوليد وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعرف المتدرب الفرملة الديناميكية وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعرف المتدرب الفرملة بالتيار المعكوس أو التبديل وكيفية تطبيقها على محركات التيار المستمر.</li><li>أن يعدد المتدرب مميزات وعيوب الطرق المختلفة لأنواع الفرامل الكهربائية.</li></ul>`,ref:'ص 66'},
    {tip:String.raw`<p>الوحدة ثلاثة دروس، درس لكل طريقة: هذا الدرس (أنواع الفرامل + إعادة التوليد)، ثم الفرملة الديناميكية، ثم الفرملة بالتبديل مع مقارنة الطرق الثلاث.</p>`},
    {title:'مختبر مصغّر: في أي درس؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل طريقة فرملة اختر الدرس الذي يشرحها في هذه الوحدة.',cats:['هذا الدرس','الدرس الثاني','الدرس الثالث'],items:[
 ['الفرملة بالتيار المعكوس أو التبديل',2,'الدرس الثالث، ومعها مقارنة الطرق الثلاث.'],
 ['الفرملة بإعادة التوليد',0,'المحطات 5 إلى 7 من هذا الدرس.'],
 ['الفرملة الديناميكية (باستخدام المقاومة المتغيرة)',1,'الدرس الثاني.']]})}
   ]},

  {st:2,short:'لماذا نفرمل؟',title:'أنواع الفرامل الكهربائية: لماذا نحتاج إلى الفرملة؟',ref:'ص 67',
   q:'مصعد ينزل بحمولة ثقيلة… ما الذي يمنعه من أن يسرع أكثر فأكثر حتى يرتطم بالأرض؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رافعة: محرك على بكرة وكتلة هابطة تزيد سرعتها، وسهم عزم مضاد للدوران" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="40" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">حمل هابط تحت تأثير الجاذبية</text><rect x="60" y="56" width="130" height="14" rx="3" fill="#8FA39B" stroke="#2C4A40" stroke-width="2"/><line x1="72" y1="70" x2="72" y2="262" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><rect x="50" y="262" width="50" height="10" rx="2" fill="#8FA39B" stroke="#2C4A40" stroke-width="2"/><g data-tip="المحرك على البكرة: يرفع الحمل ويُنزله، ويجب أن يبذل عزماً مضاداً حتى لا تزيد سرعة الحمل."><circle cx="160" cy="98" r="20" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="160" y="103" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">M</text></g><line x1="160" y1="118" x2="160" y2="180" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><g data-tip="الكتلة الهابطة: طاقتها الكامنة ⟦Potential Energy⟧ تتحول إلى طاقة حركة ⟦Kinetic Energy⟧ فتكتسب سرعة كبيرة."><rect x="130" y="180" width="60" height="46" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="160" y="208" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">m</text></g><line x1="210" y1="186" x2="210.0" y2="236.0" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="210.0,246.0 204.5,236.0 215.5,236.0" fill="#E8735A"/><text x="268" y="222" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="rtl">السرعة تزيد</text><g data-tip="العزم المضاد لاتجاه الدوران: يولّده نوع الفرامل المناسب، فيمنع زيادة السرعة عن الحد المسموح أو يوقف الحمل تماماً."><path d="M177.0 68.6 A34 34 0 0 0 128.1 86.4" fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polygon points="125.0,94.8 123.4,84.7 132.7,88.1" fill="#12855A"/><text x="262" y="92" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="rtl">عزم مضاد</text><rect x="120" y="56" width="190" height="50" fill="transparent"/></g><text x="180" y="296" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">روافع · أوناش · مصاعد · مركبات على منحدر</text></svg>`,
   cap:'الكتلة الهابطة تكتسب سرعة كبيرة، والفرامل تبذل عزماً مضاداً لاتجاه الدوران.<br><b>مرّر المؤشر على المحرك والكتلة والسهم الأخضر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا تكتسب الأحمال الهابطة (في الروافع والمصاعد) سرعات كبيرة؟',opts:[
     ['لأن المحرك يزيد سرعته تلقائياً',false,'المحرك ليس هو السبب؛ السبب الجاذبية.'],
     ['لأن طاقتها الكامنة تتحول إلى طاقة حركة',true,'نص الكتاب في ص 67: «تمتلك هذه الكتل كميات كبيرة من الطاقة الكامنة التي تتحول إلى طاقة حركة فتكتسب هذه الكتل المتحركة سرعات كبيرة».'],
     ['لأن الاحتكاك يزيد مع السرعة',false,'زيادة الاحتكاك تبطئ الحمل، لا تسرعه.']]}}
   ],
   body:[
    {book:String.raw`<p>في كثير من التطبيقات الصناعية لابد من تواجد وسيلة لإيقاف وفرملة الكتل المتحركة، ممثلة في المحرك والحمل الميكانيكي المتصل به، لأسباب اقتصادية ولتحقيق السلامة الصناعية، ولا بد أيضاً من تواجد وسيلة للحد من السرعة الزائدة في حالة <b>الأحمال الهابطة</b> تحت تأثير الجاذبية الأرضية، كما في الروافع والأوناش والمصاعد الكهربائية، أو الكتل المنحدرة على مستوى مائل كما يحدث في المركبات الكهربائية. حيث تمتلك هذه الكتل كميات كبيرة من الطاقة الكامنة <span class="ltr">(Potential Energy)</span> التي تتحول إلى طاقة حركة <span class="ltr">(Kinetic Energy)</span> فتكتسب هذه الكتل المتحركة سرعات كبيرة، لذا فإنه يلزم في مثل هذه الحالات بذل <b>عزم مضاد لاتجاه حركة الدوران</b>، للتأثير على الكتل المتحركة لكي يمنع زيادة سرعتها عن الحد المسموح به، وقد يعمل أيضاً على تباطؤ سرعتها حتى تتوقف تماماً. هذا العزم المضاد يمكن توليده والحصول عليه بواسطة النوع المناسب من الفرامل، لذلك فإنه يجب اختيار نوع الفرملة المناسب حسب نوع نظام التحريك، وبصفة عامة فهناك نوعان من الفرامل: <b>الفرامل الميكانيكية</b> و<b>الفرامل الكهربائية</b>.</p>`,ref:'ص 67'},
    {tip:String.raw`<p>للفرملة هدفان ذكرهما الكتاب: <b>منع زيادة السرعة</b> عن الحد المسموح (حمل هابط)، أو <b>التباطؤ حتى التوقف</b> التام. وفي الحالتين المطلوب واحد: عزم يعاكس اتجاه الدوران.</p>`},
    {add:String.raw`<p>المصعد مثال واضح: حين ينزل وهو ممتلئ، الحمولة «تسحب» المصعد إلى الأسفل، والمحرك هنا لا يدفع بل «يمسك». ونفس الشيء في الحافلة أو القطار وهو ينزل منحدراً طويلاً.</p>`},
    {title:'تحقق سريع: لماذا نفرمل؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الفرملة تعني أن نبذل عزماً في اتجاه الدوران نفسه.',false,'الفرملة عزم <b>مضاد</b> لاتجاه حركة الدوران (ص 67).'],
 ['قد تكون الفرملة للحد من السرعة الزائدة فقط، دون إيقاف الحمل.',true,'الكتاب: العزم المضاد يمنع زيادة السرعة عن الحد المسموح، «وقد يعمل أيضاً» على التباطؤ حتى التوقف.'],
 ['الحمل الهابط في المصعد يكتسب سرعة لأن طاقته الكامنة تتحول إلى طاقة حركة.',true,'نص الكتاب في ص 67.'],
 ['هناك بصفة عامة ثلاثة أنواع من الفرامل: ميكانيكية وكهربائية وهيدروليكية.',false,'الكتاب يقول: «فهناك نوعان من الفرامل: الفرامل الميكانيكية والفرامل الكهربائية».']]})}
   ]},

  {st:3,short:'مزايا الكهربائية',title:'مزايا الفرامل الكهربائية على الميكانيكية',ref:'ص 67–68',
   q:'الفرامل الميكانيكية تعمل بالاحتكاك. ماذا نكسب إذا جعلنا المحرك نفسه هو الذي يفرمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لمزايا الفرامل الكهربائية، وبطاقة صفراء: في الأحمال الثقيلة يستخدم النوعان معاً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الكهربائية مقابل الميكانيكية</text><g data-tip="تحتاج إلى جهد وتكلفة أقل للصيانة وللعناية بالأجهزة."><rect x="188" y="62" width="144" height="80" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><circle cx="312" cy="82" r="11" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="312" y="86.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">1</text><text x="260" y="114" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">صيانة أقل</text></g><g data-tip="لا توجد مخلفات ناتجة عن الاحتكاك كما في الفرامل الميكانيكية."><rect x="28" y="62" width="144" height="80" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><circle cx="152" cy="82" r="11" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="152" y="86.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">2</text><text x="100" y="114" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">نظافة</text></g><g data-tip="يمكن السيطرة على الحرارة الكبيرة والاستفادة منها (للتدفئة مثلاً)، أو إعادة طاقة الحركة إلى الشبكة كهرباءً."><rect x="188" y="154" width="144" height="80" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><circle cx="312" cy="174" r="11" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="312" y="178.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">3</text><text x="260" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">حرارة يُستفاد منها</text></g><g data-tip="تباطؤ أقل بكثير، فيتم الإيقاف بنعومة تامة حفاظاً على راحة الركاب في المصعد أو الحافلة الكهربائية."><rect x="28" y="154" width="144" height="80" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><circle cx="152" cy="174" r="11" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="152" y="178.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">4</text><text x="100" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">إيقاف ناعم</text></g><g data-tip="في الأحمال الميكانيكية الثقيلة تُستخدم الفرامل الكهربائية والميكانيكية معاً للتحكم الجيد في الفرملة."><rect x="40" y="256" width="280" height="40" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="281" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الأحمال الثقيلة: النوعان معاً</text></g></svg>`,
   cap:'أربع مزايا للفرامل الكهربائية، والبطاقة الصفراء حالة الأحمال الثقيلة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ نص الميزة.</b>',
   side:[
    {predict:{q:'لماذا يناسب الإيقاف بالفرامل الكهربائية المصاعد والحافلات الكهربائية خاصة؟',opts:[
     ['لأنها أرخص من الفرامل الميكانيكية',false,'التكلفة الأقل للصيانة ميزة، لكن الكتاب ربط المصعد والحافلة بميزة أخرى.'],
     ['لأن التباطؤ أقل بكثير فيكون الإيقاف ناعماً',true,'نص الكتاب في ص 68: «بحيث يتم الإيقاف بنعومة تامة، حفاظاً على راحة الركاب على ظهر المصعد أو الحافلة الكهربائية».'],
     ['لأنها لا تحتاج إلى محرك',false,'الفرامل الكهربائية في هذه الوحدة تتم بالمحرك نفسه.']]}}
   ],
   body:[
    {book:String.raw`<p><b>تمتاز الفرامل الكهربائية عن نظيرتها الميكانيكية بما يلي:</b></p><ul>
     <li>تحتاج إلى جهد وتكلفة أقل للصيانة وللعناية بالأجهزة المستخدمة.</li>
     <li>النظافة لعدم وجود المخلفات الناتجة عن الاحتكاك كما في الفرامل الميكانيكية.</li>
     <li>يمكن السيطرة على كميات الحرارة الكبيرة الناتجة عن عملية تحويل طاقة الحركة، ففي معظم الأحيان يمكن تجهيز الوسائل المناسبة للاستفادة من الحرارة المتولدة أثناء الفرامل، باستعمالها للتدفئة (مثلاً) أثناء فصل الشتاء، أو لإعادة تحويل طاقة الحركة إلى طاقة كهربائية وإعادة تغذيتها إلى الشبكة الكهربائية.</li>
     <li>يمكن الحصول على تباطؤ أقل بكثير في حالة الفرامل الكهربائية عن نظيرتها الميكانيكية، بحيث يتم الإيقاف بنعومة تامة، حفاظاً على راحة الركاب على ظهر المصعد أو الحافلة الكهربائية.</li></ul>
     <p>في حالة الأحمال الميكانيكية الثقيلة، فإن الفرامل الكهربائية والميكانيكية يستخدمان معاً للتحكم الجيد في فرملة الأجزاء المتحركة.</p>`,ref:'ص 67–68'},
    {tip:String.raw`<p>كل فرملة تحوّل طاقة الحركة إلى شيء آخر. في الفرامل الميكانيكية تتحول حرارةً في أقراص الاحتكاك وتتآكل الأقراص. وفي الفرامل الكهربائية تتحول كهرباء: إما تعود إلى الشبكة، وإما حرارة في مقاومة يمكن التحكم فيها والاستفادة منها.</p>`},
    {add:String.raw`<p>القطارات والحافلات الكهربائية الحديثة تستعمل الفرامل الكهربائية في أغلب التوقفات، وتبقى الفرامل الميكانيكية للتثبيت النهائي وللطوارئ؛ وهذا ما يقصده الكتاب باستخدام النوعين معاً.</p>`},
    {title:'تحقق سريع: مزايا الفرامل الكهربائية',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الفرامل الكهربائية أنظف لأنه لا مخلفات احتكاك فيها.',true,'الميزة الثانية في ص 67.'],
 ['حرارة الفرملة الكهربائية تضيع دائماً ولا يمكن الاستفادة منها.',false,'الكتاب: «يمكن السيطرة على كميات الحرارة الكبيرة… للاستفادة من الحرارة المتولدة»، مثلاً للتدفئة في الشتاء.'],
 ['التباطؤ في الفرامل الكهربائية أكبر بكثير، فيتوقف المصعد فجأة.',false,'العكس: «تباطؤ أقل بكثير… بحيث يتم الإيقاف بنعومة تامة».'],
 ['مع الأحمال الميكانيكية الثقيلة تستخدم الفرامل الكهربائية والميكانيكية معاً.',true,'آخر سطر في ص 68.']]})}
   ]},

  {st:4,short:'تقسيم الفرامل',title:'تقسيم الفرامل الكهربائية وطرقها الثلاث',ref:'ص 68',
   q:'هل نحتاج جهازاً خاصاً للفرملة الكهربائية، أم يكفي أن نغير توصيل المحرك نفسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شجرة: الفرامل الكهربائية بالمحرك نفسه بثلاث طرق، أو بوحدة مستقلة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الفرامل الكهربائية: موضوع هذه الوحدة."><rect x="110" y="34" width="140" height="34" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="56" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الفرامل الكهربائية</text></g><path d="M180 68 L180 84 M95 84 L265 84 M95 84 L95 98 M265 84 L265 98" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="بواسطة المحرك نفسه المستخدم للتحريك، بعد تعديل دائرته الكهربائية. هذه هي الطرق التي تشرحها الوحدة."><rect x="186" y="98" width="158" height="48" rx="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="265" y="118" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">بالمحرك نفسه</text><text x="265" y="136" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">بعد تعديل دائرته</text></g><g data-tip="وحدة فرامل كهربائية مستقلة بذاتها، مثل وحدة الفرامل باستخدام التيارات الإعصارية. لا تشرحها الوحدة."><rect x="16" y="98" width="158" height="48" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="95" y="118" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">وحدة مستقلة</text><text x="95" y="136" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">مثل التيارات الإعصارية</text></g><path d="M265 146 L265 164 M180 164 L180 290" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M180 190 L196 190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="196" y="176" width="148" height="28" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="328" cy="190" r="9" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="328" y="194.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">1</text><text x="262" y="195" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">إعادة التوليد</text><path d="M180 230 L196 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="196" y="216" width="148" height="28" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="328" cy="230" r="9" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="328" y="234.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">2</text><text x="262" y="235" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الديناميكية</text><path d="M180 270 L196 270" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="196" y="256" width="148" height="28" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="328" cy="270" r="9" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="328" y="274.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">3</text><text x="262" y="275" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">التبديل</text><path d="M180 164 L265 164" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="95" y="220" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">تُطبق على آلات</text><text x="95" y="238" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">المستمر والمتردد</text></svg>`,
   cap:'الفرامل الكهربائية نوعان، والوحدة تشرح الطرق الثلاث بالمحرك نفسه. الأولى (الصفراء) موضوع هذا الدرس.<br><b>مرّر المؤشر على المربعات العليا (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'وحدة الفرامل باستخدام التيارات الإعصارية مثال على:',opts:[
     ['الفرملة بإعادة التوليد',false,'هذه طريقة بالمحرك نفسه.'],
     ['وحدة فرامل كهربائية مستقلة بذاتها',true,'نص الكتاب في ص 68: «الفرامل بواسطة وحدة فرامل كهربائية مستقلة بذاتها مثل وحدة الفرامل باستخدام التيارات الإعصارية».'],
     ['الفرامل الميكانيكية',false,'هي فرامل كهربائية، لكنها وحدة مستقلة عن المحرك.']]}}
   ],
   body:[
    {book:String.raw`<p><b>يمكن تقسيم الفرامل الكهربائية إلى نوعين:</b></p><ul><li>الفرامل بواسطة المحرك الكهربائي نفسه المستخدم للتحريك بعد إجراء التعديلات اللازمة لدائرته الكهربائية.</li><li>الفرامل بواسطة وحدة فرامل كهربائية مستقلة بذاتها مثل وحدة الفرامل باستخدام التيارات الإعصارية.</li></ul>
     <p>وفيما يلي سوف نستعرض أنواع الفرامل بواسطة المحرك الكهربائي المستخدم للتحريك وطرقها المختلفة الشائعة الاستعمال في الحياة العملية وكيفية تطبيقها:</p>
     <ol><li>الفرملة بإعادة التوليد.</li><li>الفرملة الديناميكية أو باستخدام المقاومة المتغيرة.</li><li>الفرملة بالتيار المعكوس أو التبديل.</li></ol>
     <p>يمكن تطبيق هذه الطرق الثلاث على أنواع آلات التيار المستمر والمتردد الشائعة الاستخدام في الصناعة.</p>`,ref:'ص 68'},
    {tip:String.raw`<p>الفكرة المشتركة في الطرق الثلاث: نجعل <b>تيار المنتج ينعكس</b> فينعكس العزم ويصبح مضاداً للدوران. والفرق بينها أين تذهب الطاقة: تعود إلى المصدر (إعادة التوليد)، أو تتحول حرارة في مقاومة (الديناميكية)، أو تتحول حرارة ومعها طاقة إضافية من المصدر (التبديل).</p>`},
    {watch:String.raw`<p>يقول الكتاب إن الطرق الثلاث «يمكن تطبيقها على آلات التيار المستمر والمتردد»، لكنه يشرح بعد ذلك تطبيقها على <b>محركات التيار المستمر فقط</b>.</p>`,fix:true},
    {title:'مختبر مصغّر: بالمحرك نفسه أم بوحدة مستقلة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف الفرامل الكهربائية بحسب النوعين في ص 68.',cats:['بالمحرك نفسه','وحدة مستقلة بذاتها'],items:[
 ['الفرملة بإعادة التوليد',0,'المحرك نفسه يعمل مولداً بعد تعديل دائرته.'],
 ['وحدة الفرامل باستخدام التيارات الإعصارية',1,'المثال الذي ذكره الكتاب للوحدة المستقلة.'],
 ['الفرملة الديناميكية',0,'المحرك نفسه يوصل بمقاومة إضافية.'],
 ['الفرملة بالتيار المعكوس (التبديل)',0,'المحرك نفسه بعد عكس تيار منتجه.']]})}
   ]},

  {st:5,short:'إعادة التوليد',title:'فرملة محركات التيار المستمر — 1) الفرملة بإعادة التوليد <span class="ltr">Regenerative Braking</span>',ref:'ص 69',
   q:'المحرك موصل بالشبكة ولم نفصله… فكيف يمكن أن يعيد إليها كهرباء بدل أن يأخذ منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مصدر جهد وآلة: إذا كانت E أقل من V فالطاقة تذهب إلى الآلة، وإذا كانت أكبر عادت الطاقة إلى المصدر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="40" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الآلة موصلة بالمصدر طوال الوقت</text><g data-tip="مصدر الجهد ⟦V⟧: الشبكة التي يتصل بها المحرك."><rect x="30" y="70" width="70" height="120" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="65" y="136" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><g data-tip="القوة الدافعة الكهربائية المتولدة في الآلة ⟦E⟧؛ تزيد بزيادة السرعة أو بزيادة تيار المجال."><circle cx="285" cy="130" r="32" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="285" y="135" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">E</text></g><line x1="110" y1="104" x2="234.0" y2="104.0" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="244.0,104.0 234.0,109.5 234.0,98.5" fill="#E8735A"/><text x="178" y="94" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">E</tspan> أقل من <tspan direction="ltr" unicode-bidi="embed">V</tspan>: محرك</text><line x1="244" y1="156" x2="120.0" y2="156.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="110.0,156.0 120.0,150.5 120.0,161.5" fill="#12855A"/><text x="178" y="178" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">E</tspan> أكبر من <tspan direction="ltr" unicode-bidi="embed">V</tspan>: مولد</text><text x="178" y="196" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="600" direction="rtl">والطاقة تعود إلى الشبكة</text><rect x="30" y="224" width="300" height="72" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="248" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">نجعل <tspan direction="ltr" unicode-bidi="embed">E</tspan> أكبر من <tspan direction="ltr" unicode-bidi="embed">V</tspan> بـ:</text><text x="180" y="270" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">زيادة تيار المجال · خفض جهد المصدر</text><text x="180" y="288" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">أو سرعة أعلى من سرعة اللاحمل</text></svg>`,
   cap:String.raw`اتجاه الطاقة بين المصدر والآلة يحدده أيهما أكبر: \(V\) أم \(E\).<br><b>مرّر المؤشر على المصدر والآلة (أو المسهما في الجوال) لتعرف معناهما.</b>`,
   side:[
    {predict:{q:'هل تستطيع الفرملة بإعادة التوليد أن توقف المحرك تماماً؟',opts:[
     ['نعم، توقفه بسرعة',false,'الكتاب ينفي ذلك صراحة.'],
     ['لا، تخفض سرعته فقط',true,'نص الكتاب في ص 69: «الفرملة بإعادة التوليد تخفض من سرعة المحرك فقط ولا تسبب إيقافه كلياً عن الدوران».'],
     ['نعم، لكن بعد فصل المصدر',false,'في هذه الطريقة يظل المحرك موصلاً بمصدر الجهد.']]}}
   ],
   body:[
    {book:String.raw`<p>عند تطبيق هذه الطريقة، يعمل المحرك الكهربائي <b>كمولد</b> للطاقة الكهربائية <b>بينما يظل موصلاً بمصدر الجهد</b>، وعندها يقوم بتحويل طاقة الحركة المخزونة في الكتل المتحركة إلى طاقة كهربائية ويعيدها إلى الشبكة. يجب أن تكون قيمة القوة الدافعة الكهربائية المتولدة <b>أكبر من جهد المصدر</b> المتصل به المحرك، وهذا يتحقق إما <b>بخفض جهد المصدر</b> حتى يصبح أقل من القوة الدافعة الكهربائية للمحرك، أو <b>بزيادة القوة الدافعة الكهربائية للمحرك بزيادة تيار المجال</b>.</p>
     <p>ففي حالة محركات التيار المستمر سواء أكان من النوع ذي التغذية المستقلة أم من النوع ذي التغذية الذاتية (توصيلة التوازي) كما يوضح ذلك الشكل (6-1)، فإن قيمة القوة الدافعة الكهربائية المتولدة يتم زيادتها عن طريق زيادة قيمة تيار المجال، أو عندما <b>تزداد سرعة المحرك عن سرعة اللاحمل</b> (كما يحدث في حالة الأحمال الهابطة تحت تأثير الجاذبية الأرضية).</p>
     <p>يجب أن يكون واضحاً أن الفرملة بإعادة التوليد <b>تخفض من سرعة المحرك فقط ولا تسبب إيقافه كلياً</b> عن الدوران. ومن أهم مميزاتها التوفير في الطاقة المستخدمة، وإعادة طاقة الحركة المخزونة في الكتل المتحركة إلى مصدر الجهد.</p>`,ref:'ص 69'},
    {title:'حرّك سرعة الآلة وشاهد متى تصبح مولداً (أرقام مثال 6-1)',widget:(el,B)=>{
      const V=220,E1=215,n1=1150,Ra=0.04;let n=1150;
      el.innerHTML=`<label class="w-sl"><span>سرعة الآلة <span class="ltr">n = <b data-o="n"></b> rpm</span></span><input type="range" min="1000" max="1300" step="1" dir="ltr" value="${n}"></label>
       <div class="w-facts"><div><span>جهد المصدر \\(V\\)</span><b>220 V</b></div><div><span>القوة الدافعة \\(E\\)</span><b data-o="e"></b></div><div><span>تيار المنتج \\(I_a=(V-E)/R_a\\)</span><b data-o="i"></b></div><div><span>الآلة تعمل</span><b data-o="m" style="font-family:var(--font);direction:rtl"></b></div></div>
       <p class="sub" style="margin-top:8px">محرك مثال (6-1): \\(E_1=215\\ \\text{V}\\) عند <span class="ltr">1150&nbsp;rpm</span> و \\(R_a=0.04\\ \\Omega\\)، وتيار المجال ثابت فتتناسب \\(E\\) مع السرعة (المعادلتان 6-1 و6-2). الأمبيرات الكبيرة هنا لأن \\(R_a\\) صغيرة جداً.</p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const E=E1*n/n1,I=(V-E)/Ra;o('n').textContent=n;o('e').textContent=E.toFixed(1)+' V';o('i').textContent=(I<0?'−':'')+Math.abs(I).toFixed(0)+' A';
        const m=o('m');m.textContent=Math.abs(I)<3?'على الحد (E = V)':I>0?'محركاً':'مولداً';m.style.color=Math.abs(I)<3?'':I>0?'var(--live)':'var(--on)'};
      rg.oninput=()=>{n=+rg.value;draw()};draw();B.math(el);
    }},
    {tip:String.raw`<p>تيار المنتج \(I_a=\dfrac{V-E}{R_a}\). ما دامت \(E\lt V\) يدخل التيار المنتج (محرك). فإذا صارت \(E\gt V\) — بسرعة أعلى من سرعة اللاحمل أو بمجال أقوى أو بجهد مصدر أقل — ينعكس \(I_a\) ويخرج إلى المصدر (مولد)، ويصبح عزمه مضاداً للدوران. لهذا لا توقف هذه الطريقة المحرك: عند السرعات المنخفضة تصغر \(E\) فلا تتعدى \(V\).</p>`,title:'متى يعمل المحرك مولداً؟'},
    {add:String.raw`<p>القطار الكهربائي وهو ينزل منحدراً طويلاً، أو المصعد وهو ينزل ممتلئاً: الحمل يدفع المحرك فوق سرعة اللاحمل فيصبح مولداً تلقائياً ويعيد الطاقة إلى الشبكة بدل أن تضيع حرارة في الفرامل.</p>`}
   ]},

  {st:6,short:'المعادلات والشكل 6-1',title:'معادلات الفرملة بإعادة التوليد والشكل <span class="ltr">(6&#8209;1)</span>',ref:'ص 69–70',
   q:'إذا عرفنا عزم الحمل، كيف نحسب التيار الذي يولّده المولد وهو يفرمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 6-1 مبسطاً: يسار الآلة محرك، ويمين الآلة مولد وقد انعكس تيار المنتج وتيار الخط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="(a) الآلة محرك: التيار ⟦I⟧ يدخل من المصدر، و⟦Ia⟧ يدخل المنتج ⟦Eb⟧، و⟦If⟧ تيار ملف المجال."><circle cx="138" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="138" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="148" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="148" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="152" y1="198" x2="152.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="152.0,92.0 155.8,99.0 148.2,99.0" fill="#2C4A40"/><text x="160" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="48" y1="70" x2="134" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="48" y1="220" x2="134" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M48 70 L48 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 100 L48 110.8 A8.6 8.6 0 0 1 48 127.9 A8.6 8.6 0 0 1 48 145.0 A8.6 8.6 0 0 1 48 162.1 A8.6 8.6 0 0 1 48 179.2 L48 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 190 L48 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="36" y1="120" x2="36.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="36.0,154.0 32.7,148.0 39.3,148.0" fill="#4FB3A9"/><text x="32" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><line x1="84" y1="70" x2="84" y2="127.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="84" y1="163.0" x2="84" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="84" cy="145.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="84" y="150.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="108" y="133.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="108" y="169.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="72" y1="88" x2="72.0" y2="110.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="72.0,116.0 68.7,110.0 75.3,110.0" fill="#E8735A"/><line x1="132" y1="60" x2="104.0" y2="60.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="98.0,60.0 104.0,56.7 104.0,63.3" fill="#E8735A"/><text x="115" y="55" text-anchor="middle" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I</text><text x="68" y="106" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="0" y="52" width="172" height="180" fill="transparent"/></g><g data-tip="(b) الآلة مولد: انعكس تيار المنتج ⟦Ia⟧ (يخرج من المنتج) وتيار الخط ⟦I⟧ (يخرج إلى المصدر)، وبقي تيار المجال ⟦If⟧ في اتجاهه."><circle cx="316" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="316" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="326" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="326" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="330" y1="198" x2="330.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="330.0,92.0 333.9,99.0 326.1,99.0" fill="#2C4A40"/><text x="338" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="226" y1="70" x2="312" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="226" y1="220" x2="312" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M226 70 L226 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 100 L226 110.8 A8.6 8.6 0 0 1 226 127.9 A8.6 8.6 0 0 1 226 145.0 A8.6 8.6 0 0 1 226 162.1 A8.6 8.6 0 0 1 226 179.2 L226 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 190 L226 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="214" y1="120" x2="214.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="214.0,154.0 210.7,148.0 217.3,148.0" fill="#4FB3A9"/><text x="210" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><line x1="262" y1="70" x2="262" y2="127.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="262" y1="163.0" x2="262" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="262" cy="145.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="150.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="286" y="133.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="286" y="169.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="250" y1="116" x2="250.0" y2="94.0" stroke="#12855A" stroke-width="2" stroke-linecap="round"/><polygon points="250.0,88.0 253.3,94.0 246.7,94.0" fill="#12855A"/><line x1="276" y1="60" x2="304.0" y2="60.0" stroke="#12855A" stroke-width="2" stroke-linecap="round"/><polygon points="310.0,60.0 304.0,63.3 304.0,56.7" fill="#12855A"/><text x="293" y="55" text-anchor="middle" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">I</text><text x="246" y="106" text-anchor="end" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="178" y="52" width="182" height="180" fill="transparent"/></g><text x="90" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(a) Motor</text><text x="268" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(b) generator</text><text x="180" y="266" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">تيار المجال باقٍ في اتجاهه،</text><text x="180" y="288" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">وانعكس تيار المنتج وتيار الخط</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(6&#8209;1)</span>: الآلة نفسها محركاً (يسار) ومولداً (يمين).<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف ما تغيّر فيها.</b>',
   side:[
    {predict:{q:'عند التحول من محرك إلى مولد في الشكل <span class="ltr">(6&#8209;1)</span>، أي تيار <b>لا</b> ينعكس؟',opts:[
     [String.raw`تيار المنتج \(I_a\)`,false,'هذا ينعكس: يخرج من المنتج في حالة المولد.'],
     [String.raw`تيار المجال \(I_f\)`,true,String.raw`المجال ما زال موصلاً بالمصدر نفسه، فيبقى تياره في اتجاهه؛ وانعكس \(I_a\) و\(I\).`],
     [String.raw`تيار الخط \(I\)`,false,'تيار الخط ينعكس: يخرج إلى المصدر بدل أن يدخل منه.']]}}
   ],
   body:[
    {book:String.raw`<p>إذا رمزنا للقوة الدافعة الكهربائية لكل من المحرك \(E_1\) والمولد \(E_2\)، وفي حالة الاحتفاظ بثبات تيار المجال \((\phi=\text{constant})\) فإن:</p>
     <div class="eq">$$E_1=K\phi\,n_1$$<span class="eqno">(6-1)</span></div>
     <div class="eq">$$E_2=K\phi\,n_2$$<span class="eqno">(6-2)</span></div>
     <p>وبقسمة \(E_1\) على \(E_2\) ينتج:</p>
     <div class="eq">$$\frac{E_1}{E_2}=\frac{n_1}{n_2}=\frac{\omega_1}{\omega_2}$$</div>
     <p>وحيث أن عزم الدوران المضاد للمولد يساوي عزم دوران الحمل (عزم المحرك):</p>
     <div class="eq">$$T_L=\frac{E_1\,I_{a1}}{\omega_1}=\frac{E_2\,I_{a2}}{\omega_2}$$<span class="eqno">(6-3)</span></div>
     <p>ومنها نحصل على تيار المنتج في حالة المولد:</p>
     <div class="eq">$$I_{a2}=\frac{T_L\,\omega_2}{E_2}$$<span class="eqno">(6-4)</span></div>`,ref:'ص 69–70'},
    {tip:String.raw`<p>(6-1) و(6-2): مع ثبات المجال تتناسب القوة الدافعة مع السرعة. و(6-3) تقول: العزم = القدرة الكهرومغناطيسية \(E\,I_a\) ÷ السرعة الزاوية \(\omega\). ولأن \(E\) و\(\omega\) تتغيران بالنسبة نفسها فإن \(\frac{\omega_2}{E_2}=\frac{\omega_1}{E_1}\)، وهذا ما سيستعمله مثال (6-1) ليحسب \(I_{a2}\) من بيانات المحرك.</p>`},
    {watch:String.raw`<p>\(\omega\) بوحدة <span class="ltr">rad/s</span> وليست <span class="ltr">rpm</span>: \(\omega=\frac{2\pi n}{60}\). نسيان هذا التحويل خطأ شائع في حساب العزم.</p>`},
    {title:'مختبر مصغّر: تيار المولد لا يتغير مع السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'محرك مثال (6-1): \\(E_1=215\\ \\text{V}\\) عند <span class="ltr">1150 rpm</span>، والمجال ثابت، وعزم الحمل <span class="ltr">190 Nm</span>. حرّك سرعة الآلة وهي مولد (رقم تختاره أنت) وطبّق (6-2) و(6-4).',
 predict:{q:'زادت سرعة المولد. ماذا يحدث لتيار المنتج \\(I_{a2}\\) اللازم ليعطي عزماً مضاداً <span class="ltr">190 Nm</span>؟',opts:[
  ['يزيد مع السرعة',false,'\\(\\omega_2\\) تزيد فعلاً، لكن \\(E_2\\) تزيد بالنسبة نفسها.'],
  ['يقل مع السرعة',false,'النسبة \\(\\omega_2/E_2\\) لا تتغير مع ثبات المجال.'],
  ['لا يتغير',true,'\\(I_{a2}=T_L\\,\\omega_2/E_2\\) و\\(\\omega_2/E_2=\\omega_1/E_1\\) ثابتة؛ ولهذا يحسب مثال (6-1) التيار من بيانات المحرك مباشرة.']]},
 ins:[{k:'n',l:'سرعة الآلة n<sub>2</sub>',u:'rpm',min:1150,max:1400,step:10,v:1200,dp:0}],
 calc:(s,P,B)=>{const w=2*Math.PI*s.n/60,E=215*s.n/1150,I=190*w/E;
  return {facts:[['ω<sub>2</sub> = 2πn/60',DCML.fm(B,w,2)+' rad/s'],['E<sub>2</sub> = E<sub>1</sub>·n<sub>2</sub>/n<sub>1</sub> (6-2)',DCML.fm(B,E,1)+' V'],['I<sub>a2</sub> = T<sub>L</sub>·ω<sub>2</sub>/E<sub>2</sub> (6-4)',DCML.fm(B,I,1)+' A','hi']],
   msg:'\\(\\omega_2\\) و\\(E_2\\) تتغيران معاً بالنسبة نفسها، فيبقى \\(I_{a2}\\approx106.4\\ \\text{A}\\) (والكتاب طبعه 104.4 خطأً).'}}})}
   ]},

  {st:7,short:'مثال 6-1',title:'مثال <span class="ltr">(6&#8209;1)</span>: أقل سرعة فرملية',ref:'ص 71',
   q:'المحرك يفرمل حملاً عزمه <span class="ltr">190 Nm</span>. عند أي سرعة يصبح عزم المولد المضاد مساوياً لعزم الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="معطيات مثال 6-1 والنتيجة أقل سرعة فرملية نحو 1200 لفة في الدقيقة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">معطيات مثال <tspan direction="ltr" unicode-bidi="embed">6-1</tspan></text><rect x="70" y="58" width="220" height="140" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="165" y="82" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="177" y="82" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 220 V</text><text x="165" y="107" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">1</tspan><tspan dy="-4">​</tspan></text><text x="177" y="107" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 215 V</text><text x="165" y="132" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n<tspan font-size="0.72em" dy="4">1</tspan><tspan dy="-4">​</tspan></text><text x="177" y="132" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 1150 rpm</text><text x="165" y="157" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><text x="177" y="157" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.04 Ω</text><text x="165" y="182" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="0.72em" dy="4">L</tspan><tspan dy="-4">​</tspan></text><text x="177" y="182" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 190 Nm</text><g data-tip="أقل سرعة فرملية: السرعة التي يصبح عندها عزم المولد المضاد مساوياً لعزم الحمل ⟦190 Nm⟧."><rect x="80" y="214" width="200" height="32" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="236" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N<tspan font-size="0.72em" dy="4">2</tspan><tspan dy="-4">​</tspan> ≈ 1200 rpm</text></g><text x="180" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">ثبات تيار المجال</text><text x="180" y="296" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">التوليد المرتجع = إعادة التوليد</text></svg>`,
   cap:'معطيات المثال والنتيجة النهائية.<br><b>مرّر المؤشر على النتيجة الصفراء (أو المسها في الجوال) لتعرف معنى «أقل سرعة فرملية».</b>',
   side:[
    {predict:{q:'هل أقل سرعة فرملية أكبر أم أصغر من سرعة المحرك الأصلية <span class="ltr">1150&nbsp;rpm</span>؟',opts:[
     ['أصغر، لأن الفرملة تبطئ المحرك',false,String.raw`حتى يعمل مولداً يجب أن تكون \(E_2\gt V\gt E_1\)، أي سرعة أكبر.`],
     ['تساويها',false,String.raw`عند <span class="ltr">1150&nbsp;rpm</span> تكون \(E_1=215\ \text{V}\) أقل من \(V\)، فالآلة محرك.`],
     [String.raw`أكبر، لأن \(E_2\) يجب أن تزيد عن جهد المصدر`,true,String.raw`\(E_2=V+I_{a2}R_a\approx224\ \text{V}\)، والسرعة تتناسب معها: \(N_2\approx1200\ \text{rpm}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>محرك تيار مستمر توازي، <span class="ltr">220&nbsp;V</span>، القوة الدافعة الكهربائية المتولدة <span class="ltr">215&nbsp;V</span>، عندما كانت سرعة المحرك <span class="ltr">1150&nbsp;rpm</span>، مقاومة المنتج <span class="ltr">0.04&nbsp;Ω</span>، الحمل عبارة عن عزم دوران مقداره <span class="ltr">190 Nm</span>. أوجد أقل سرعة فرملية للمحرك، إذا كان المطلوب استخدام الفرملة بطريقة التوليد المرتجع مع الاحتفاظ بثبات تيار المجال.</p>
     <p>أقل سرعة فرملية للمحرك، هي تلك السرعة التي تصل إليها الآلة ويصبح عندها عزم الدوران المضاد للمولد مساوياً لعزم دوران الحمل <span class="ltr">(190 Nm)</span>.</p>
     <p><b>الحل:</b></p>
     <div class="eq">$$\frac{E_1}{E_2}=\frac{n_1}{n_2}=\frac{\omega_1}{\omega_2}$$</div>
     <div class="eq">$$I_{a2}=T_L\times\frac{\omega_2}{E_2}=T_L\times\frac{\omega_1}{E_1}=190\times\frac{2\pi n_1}{60}\times\frac{1}{E_1}$$</div>
     <div class="eq">$$I_{a2}=190\times\frac{2\pi\times1150}{60}\times\frac{1}{215}=104.4\ \text{A}$$</div>
     <div class="eq">$$E_2=V+I_{a2}R_a=220+104.4\times0.04=224.17\ \text{V}$$</div>
     <div class="eq">$$N_2=N_1\frac{E_2}{E_1}=1150\times\frac{224.17}{215}=1200\ \text{rpm}$$</div>`,ref:'ص 71'},
    {watch:String.raw`<p>خطأ حسابي في الكتاب: \(I_{a2}=190\times120.43/215\) طُبع <b><span class="ltr">104.4&nbsp;A</span></b> والصحيح <b><span class="ltr">106.4&nbsp;A</span></b>، فيصبح \(E_2=224.26\ \text{V}\) بدل 224.17 (والرقم 224.17 نفسه مقطوع من 224.176)، و\(N_2=1199.5\ \text{rpm}\) بدل 1200 (وناتج قسمة أرقام الكتاب نفسها 1199.0). الجواب النهائي ≈ <b><span class="ltr">1200&nbsp;rpm</span></b> سليم في الحالتين. الحل كما في الكتاب والحل المصحح في تبويب «الأمثلة المحلولة».</p>`,fix:true},
    {tip:String.raw`<p>لماذا \(E_2=V+I_{a2}R_a\) (بإشارة +)؟ لأن الآلة مولد: التيار يخرج منها إلى المصدر، فجهدها الداخلي \(E_2\) يجب أن يغطي جهد المصدر وهبوط الجهد في مقاومة المنتج معاً. في المحرك كانت \(E=V-I_aR_a\).</p>`},
    {title:'مختبر مصغّر: الحمل الأثقل يحتاج سرعة فرملة أعلى',widget:(el,B)=>DCML.lab(el,B,{intro:'معطيات مثال (6-1)، وتستطيع تغيير عزم الحمل (رقم تختاره أنت؛ الكتاب <span class="ltr">190 Nm</span>). الحساب بالأرقام الصحيحة دون أخطاء الطباعة.',
 predict:{q:'لو كان عزم الحمل الهابط أكبر من <span class="ltr">190 Nm</span>، فإن أقل سرعة فرملية \\(N_2\\):',opts:[
  ['تكبر',true,'العزم الأكبر يحتاج \\(I_{a2}\\) أكبر، فتكبر \\(E_2=V+I_{a2}R_a\\)، والسرعة تتناسب معها.'],
  ['تصغر',false,'التيار الأكبر يحتاج قوة دافعة أكبر، أي سرعة أعلى لا أقل.'],
  ['لا تتغير',false,'\\(E_2\\) تعتمد على \\(I_{a2}\\)، و\\(I_{a2}\\) يعتمد على عزم الحمل.']]},
 ins:[{k:'T',l:'عزم الحمل T<sub>L</sub>',u:'Nm',min:50,max:400,step:10,v:190,dp:0}],
 calc:(s,P,B)=>{const w1=2*Math.PI*1150/60,I=s.T*w1/215,E2=220+I*0.04,N2=1150*E2/215;
  return {facts:[['I<sub>a2</sub> = T<sub>L</sub>·ω<sub>1</sub>/E<sub>1</sub>',DCML.fm(B,I,1)+' A'],['E<sub>2</sub> = V + I<sub>a2</sub>·R<sub>a</sub>',DCML.fm(B,E2,2)+' V'],['N<sub>2</sub> = N<sub>1</sub>·E<sub>2</sub>/E<sub>1</sub>',DCML.fm(B,N2,1)+' rpm','hi']],
   plot:{xr:[50,400],yr:[1170,1240],xl:'T<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (Nm)</tspan>',yl:'N<tspan font-size="9" dy="3">2</tspan><tspan dy="-3"> (rpm)</tspan>',curves:[{f:t=>1150*(220+t*w1/215*0.04)/215}],cur:[s.T,N2],xt:[50,100,200,300,400],yt:[1170,1190,1210,1230]},
   msg:s.T===190?'أرقام المثال: \\(I_{a2}=106.4\\ \\text{A}\\) (طُبع 104.4)، و\\(N_2\\approx1200\\ \\text{rpm}\\) في الحالتين.':'كل السرعات أعلى من <span class="ltr">1176.7 rpm</span>، وهي السرعة التي تصبح عندها \\(E=V=220\\ \\text{V}\\): تحتها لا تعمل الآلة مولداً.'}}})}
   ]},

  {st:8,short:'أسئلة الدرس',title:'أسئلة وتمارين: <span class="ltr">6&#8209;1</span> و<span class="ltr">6&#8209;3</span>',ref:'ص 78',
   q:'سؤال نظري وتمرين حسابي من آخر الوحدة يخصان هذا الدرس. هل تعرف من أين تبدأ في كل منهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان لسؤالي الدرس 6-1 و6-3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أسئلة وتمارين · ص <tspan direction="ltr" unicode-bidi="embed">78</tspan></text><g data-tip="جوابه في المحطة الثالثة (ص 67–68): أربع مزايا."><rect x="40" y="76" width="280" height="72" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="86" width="58" height="26" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="279" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">6-1</text><text x="150" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">مزايا الفرامل الكهربائية</text><text x="150" y="128" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">عن نظيرتها الميكانيكية</text></g><g data-tip="مثل مثال ⟦6-1⟧ بأرقام أخرى: ⟦250 V⟧ و⟦245 V⟧ و⟦1200 rpm⟧ و⟦0.05 Ω⟧ و⟦200 Nm⟧."><rect x="40" y="166" width="280" height="72" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="176" width="58" height="26" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="279" y="194" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">6-3</text><text x="150" y="194" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">أقل سرعة فرملية</text><text x="150" y="218" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">بطريقة مثال <tspan direction="ltr" unicode-bidi="embed">6-1</tspan></text></g><text x="180" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">التمارين <tspan direction="ltr" unicode-bidi="embed">6-2</tspan> و<tspan direction="ltr" unicode-bidi="embed">6-4</tspan> و<tspan direction="ltr" unicode-bidi="embed">6-5</tspan> في الدرسين التاليين</text></svg>`,
   cap:'سؤالا الدرس من ص 78.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف أين تجد طريقة الحل.</b>',
   side:[
    {predict:{q:String.raw`في التمرين <span class="ltr">6&#8209;3</span>، كم \(\omega_1\)؟`,opts:[
     [String.raw`\(1200\ \text{rad/s}\)`,false,'هذه السرعة باللفة في الدقيقة، ولا بد من تحويلها.'],
     [String.raw`\(2\pi\times1200/60\approx125.66\ \text{rad/s}\)`,true,String.raw`\(\omega=2\pi n/60\)، تماماً كما في مثال (6-1).`],
     [String.raw`\(1200/60=20\ \text{rad/s}\)`,false,String.raw`هذه لفات في الثانية؛ نضربها في \(2\pi\) لنحصل على الراديان في الثانية.`]]}}
   ],
   body:[
    {book:String.raw`<p><b>6-1</b> اذكر مميزات استخدام الفرامل الكهربائية عن نظيرتها الميكانيكية.</p>
     <p><b>6-3</b> محرك تيار مستمر، توازي، <span class="ltr">250&nbsp;V</span>، القوة الدافعة الكهربائية المتولدة <span class="ltr">245&nbsp;V</span>، عندما كانت سرعة المحرك <span class="ltr">1200&nbsp;rpm</span>، مقاومة المنتج <span class="ltr">0.05&nbsp;Ω</span>، وكان الحمل ذا عزم دوران مقداره <span class="ltr">200 N.m</span>. احسب أقل سرعة فرملية للمحرك، إذا كان المطلوب استخدام الفرملة بطريقة التوليد المرتجع، مع الاحتفاظ بثبات تيار المجال.</p>`,ref:'ص 78'},
    {tip:String.raw`<p><b>لـ 6-1:</b> المزايا الأربع في المحطة الثالثة. <b>لـ 6-3:</b> خطوات مثال (6-1) نفسها: \(\omega_1\) ← \(I_{a2}=T_L\,\omega_1/E_1\) ← \(E_2=V+I_{a2}R_a\) ← \(N_2=N_1E_2/E_1\). الإجابة المقترحة في الأسلوب الرسمي، والحاسبة في تبويب «الأمثلة المحلولة» (الكتاب لا يطبع إجابات التمارين).</p>`},
    {title:'مختبر مصغّر: تحقق من أرقامك في التمرين 6-3',widget:(el,B)=>DCML.cases(el,B,{intro:'حلّ التمرين على ورقة بخطوات مثال (6-1)، ثم اختر ما وصلت إليه. (الكتاب لا يطبع إجابات؛ هذه نتائج الحل المقترح.)',cases:[
 {q:'تيار المنتج في حالة المولد \\(I_{a2}=T_L\\,\\omega_1/E_1\\):',opts:[
  ['<span class="ltr">≈ 979.6 A</span>',false,'استعملت <span class="ltr">1200</span> بدل \\(\\omega_1\\) بالراديان في الثانية.'],
  ['<span class="ltr">≈ 102.6 A</span>',true,'<span class="ltr">200 × 125.66 ÷ 245 ≈ 102.6 A</span>.'],
  ['<span class="ltr">≈ 16.3 A</span>',false,'استعملت <span class="ltr">1200 ÷ 60 = 20</span> دون الضرب في \\(2\\pi\\).']]},
 {q:'أقل سرعة فرملية \\(N_2\\):',opts:[
  ['<span class="ltr">≈ 1199.4 rpm</span>',false,'طرحت هبوط الجهد: \\(E_2=V-I_{a2}R_a\\). في المولد يُجمع.'],
  ['<span class="ltr">≈ 1224.5 rpm</span>',false,'نسيت هبوط الجهد في المنتج: جعلت \\(E_2=V=250\\ \\text{V}\\) فقط.'],
  ['<span class="ltr">≈ 1249.6 rpm</span>',true,'\\(E_2=250+102.6\\times0.05=255.13\\ \\text{V}\\)، ثم \\(N_2=1200\\times255.13/245\\).']]}]})}
   ]},

  {recap:[
   String.raw`نفرمل لإيقاف الكتل المتحركة، أو للحد من سرعة الأحمال الهابطة التي تتحول طاقتها الكامنة إلى طاقة حركة، ببذل عزم مضاد لاتجاه الدوران (ص 67).`,
   String.raw`الفرامل الكهربائية أقل صيانة وأنظف ويُستفاد من حرارتها أو تُعاد طاقتها إلى الشبكة، وإيقافها ناعم؛ وتكون بالمحرك نفسه (ثلاث طرق) أو بوحدة مستقلة (ص 67–68).`,
   String.raw`إعادة التوليد: الآلة موصلة بالمصدر و\(E\gt V\) (مجال أقوى أو جهد أقل أو سرعة فوق سرعة اللاحمل)، فتعيد الطاقة إلى الشبكة؛ تخفض السرعة ولا توقف المحرك (ص 69).`,
   String.raw`\(E_1=K\phi n_1\) (6-1)، \(E_2=K\phi n_2\) (6-2)، \(T_L=E_1I_{a1}/\omega_1=E_2I_{a2}/\omega_2\) (6-3)، \(I_{a2}=T_L\omega_2/E_2\) (6-4).`,
   String.raw`مثال (6-1): \(I_{a2}=T_L\omega_1/E_1\) ثم \(E_2=V+I_{a2}R_a\) ثم \(N_2=N_1E_2/E_1\approx1200\ \text{rpm}\).`]}
],
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
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب (ص 68–71):</b> (١) يقول الكتاب إن الطرق الثلاث «يمكن تطبيقها على آلات التيار المستمر والمتردد»، لكنه يشرح تطبيقها على محركات التيار المستمر فقط. (٢) كُتب «وبقسمة E<sub>2</sub> على E<sub>1</sub>» والناتج المكتوب \\(E_1/E_2\\)، أي قسمة E<sub>1</sub> على E<sub>2</sub>؛ صُحح في النص. (٣) مثال (6-1): \\(I_{a2}=190\\times120.43/215\\) طُبع <b>104.4 A</b> والصحيح <b>106.4 A</b>، فيصبح \\(E_2=224.26\\) V بدل 224.17 (والرقم 224.17 نفسه مقطوع من 224.176)، و \\(N_2=1199.5\\) rpm بدل 1200 (ناتج قسمة أرقام الكتاب نفسها 1199.0). الجواب النهائي ≈ <b>1200 rpm</b> سليم في الحالتين.</div>'},
  {h:'أسئلة وتمارين',ref:'ص 78',html:Q('6-1','اذكر مميزات استخدام الفرامل الكهربائية عن نظيرتها الميكانيكية.','(ص 67–68): (1) تحتاج إلى جهد وتكلفة أقل للصيانة. (2) النظافة لعدم وجود مخلفات الاحتكاك. (3) يمكن السيطرة على الحرارة الكبيرة الناتجة والاستفادة منها (للتدفئة مثلاً)، أو إعادة تحويل طاقة الحركة إلى طاقة كهربائية وإعادتها إلى الشبكة. (4) تباطؤ أقل بكثير فيتم الإيقاف بنعومة تامة حفاظاً على راحة الركاب في المصعد أو الحافلة الكهربائية.')+
   Q('6-3','محرك تيار مستمر، توازي، 250 V، القوة الدافعة الكهربائية المتولدة 245 V، عندما كانت سرعة المحرك 1200 rpm، مقاومة المنتج 0.05 Ω، وكان الحمل ذا عزم دوران مقداره 200 N.m. احسب أقل سرعة فرملية للمحرك، إذا كان المطلوب استخدام الفرملة بطريقة التوليد المرتجع، مع الاحتفاظ بثبات تيار المجال.','بطريقة مثال (6-1): \\(\\omega_1=2\\pi\\times1200/60=125.66\\) rad/s، \\(I_{a2}=200\\times125.66/245=102.6\\) A، \\(E_2=250+102.6\\times0.05=255.13\\) V، \\(N_2=1200\\times255.13/245\\approx\\) <b>1249.6 rpm ≈ 1250 rpm</b>. الحاسبة في تبويب «الأمثلة المحلولة».')}
 ],
 lab:(el)=>{
  const w1=rad(1150),K0=215/w1,Ra=0.04;const st={TL:190,fld:100,V:220,w:null,sawT:false,pre:''};
  el.innerHTML=`<div id="r1tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة الآن <small>مبنية على الشكل (6-1) ص 70 وآلة مثال (6-1)</small></h2><div class="svgbox" id="r1c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><span class="ed-chip" id="r1chip"></span></div>
    <div class="facts" id="r1fx">${fact('السرعة n','r1n')}${fact('القوة الدافعة E','r1E')}${fact('تيار المنتج I<sub>a</sub>','r1Ia')}${fact('تيار الخط I = I<sub>a</sub> + I<sub>f</sub>','r1I')}${fact('القدرة من المصدر V·I','r1P')}</div></div>
   <div class="panel c6"><h2>التحكم</h2>
    <div class="ed-row" style="margin-top:0"><button class="btn" id="r1ex">مثال (6-1): حمل هابط 190 Nm</button></div>
    ${sl('r1T','عزم الحمل (موجب = يعاكس الدوران، سالب = حمل هابط يدفع الآلة)',-300,300,1,st.TL)}${sl('r1f','تيار المجال (نسبة من قيمته الأصلية)',70,130,1,st.fld)}${sl('r1V','جهد المصدر V',120,240,1,st.V)}
    <p class="ed-cap">الآلة من مثال (6-1): <span class="ltr">E = 215 V</span> عند <span class="ltr">1150 rpm</span> و <span class="ltr">R<sub>a</sub> = 0.04 Ω</span>. نفترض أن الفيض يتناسب مع تيار المجال (توضيح — ليس من الكتاب).</p></div>
   <div class="panel c12"><h2>مستوى السرعة والعزم <small>المستقيم = كل نقاط التشغيل الممكنة بالجهد والمجال الحاليين؛ النقطة = نقطة التشغيل الآن</small></h2><div class="svgbox" id="r1nt" style="max-width:760px;margin-inline:auto"></div>
    <p class="ed-cap">يمين المحور الرأسي: الآلة <b>محرك</b> (عزمها مع الدوران). يساره: <b>مولد — فرملة بإعادة التوليد</b> (عزمها ضد الدوران وتعيد الطاقة إلى المصدر). الخط الأفقي المتقطع = سرعة اللاحمل.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="r1st"></ol></div></div>`;
  el.innerHTML=LTU(el.innerHTML);B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#r1tp'),'u6-l1',[{k:'If',label:'تيار المجال I<sub>f</sub>',unit:'A',value:2,min:0,max:50,step:0.1,hint:'لا يعطيه الكتاب؛ يدخل فقط في تيار الخط.'},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.8,min:0.05,max:30,step:0.05}],()=>steps.redraw());
  const bind=(id,k)=>{$('#'+id).oninput=e=>{st[k]=+e.target.value;st.pre=''}};bind('r1T','TL');bind('r1f','fld');bind('r1V','V');
  $('#r1ex').onclick=()=>{st.TL=-190;st.fld=100;st.V=220;$('#r1T').value=-190;$('#r1f').value=100;$('#r1V').value=220;st.pre='e61'};
  const K=()=>K0*st.fld/100;
  /* أعطال مخفية: الآلة الفعلية (فرش متآكلة Ra×5 / حلقات مقصورة في ملف المجال / منظم المجال عالق على 100%)؛ K و Ra السليمان لخط التشغيل المرسوم */
  const KA=()=>K0*(chF('fstuck')?100:st.fld)/100*(chF('kF')?0.85:1),RaA=()=>chF('brush')?5*Ra:Ra;
  const wss=()=>Math.max(0,(st.V-st.TL/KA()*RaA())/KA());
  const steps=stepsUI($('#r1st'),[
   {t:'بلا حمل',x:'اجعل عزم الحمل صفراً: تستقر السرعة عند سرعة اللاحمل <span class="ltr">≈ 1176.7 rpm</span>، حيث \\(E\\approx V\\) وتيار المنتج صفر تقريباً.',done:()=>Math.abs(st.TL)<1&&st.fld===100&&st.V===220&&Math.abs(st.w-wss())<0.05},
   {t:'محرك محمّل',x:'اجعل العزم <span class="ltr">+190 Nm</span> (حمل يعاكس الدوران): السرعة أقل من سرعة اللاحمل، \\(E<V\\)، والتيار يدخل المنتج — الآلة محرك.',done:()=>st.TL>=150&&st.fld===100&&st.V===220},
   {t:'مثال (6-1): حمل هابط',x:'اضغط زر «مثال (6-1)»: الحمل يدفع الآلة بعزم <span class="ltr">190 Nm</span> فتتجاوز سرعة اللاحمل وتستقر عند <span class="ltr">≈ 1199.5 rpm</span> — أقل سرعة فرملية. \\(E>V\\) وتيار المنتج <b>سالب</b> (≈ <span class="ltr">−106.4 A</span>): الطاقة تعود إلى المصدر.',done:()=>st.TL<=-185&&st.fld===100&&st.V===220&&Math.abs(st.w-wss())<0.05},
   {t:'زد تيار المجال',x:'والحمل ما زال هابطاً، ارفع تيار المجال إلى <span class="ltr">115%</span>: يقوى المجال فتكفي سرعة أقل لتوليد القوة الدافعة نفسها؛ تنخفض السرعة الفرملية (ص 69).',done:()=>st.TL<0&&st.fld>=115},
   {t:'اخفض جهد المصدر',x:'أرجع الحمل إلى <span class="ltr">0</span> أو قيمة موجبة والمجال إلى <span class="ltr">100%</span>، ثم اخفض الجهد فجأة إلى <span class="ltr">180 V</span> أو أقل: أثناء تباطؤ الآلة تكون \\(E>V\\) فيصبح التيار سالباً لحظياً — فرملة بإعادة التوليد بخفض جهد المصدر.',done:()=>st.sawT},
   {t:'لا توقف كلي',x:'لاحظ أن الآلة في كل الحالات استقرت على سرعة جديدة ولم تتوقف: الفرملة بإعادة التوليد <b>تخفض السرعة فقط</b> (ص 69). للإيقاف نحتاج الطريقتين في الدرسين التاليين.'}]);
  loopOn(el,dt=>{const k=K(),ws=wss();if(st.w==null)st.w=ws;st.w+=(ws-st.w)*(1-Math.exp(-dt/TP.v.tau));if(Math.abs(st.w-ws)<1e-4)st.w=ws;
   const E=KA()*st.w,Ia=(st.V-E)/RaA(),Il=Ia+TP.v.If,P=st.V*Il;if(Ia<-1&&st.TL>=0&&st.V<=180)st.sawT=true;
   $('#r1T-v').textContent=st.TL+' Nm';$('#r1f-v').textContent=st.fld+' %';$('#r1V-v').textContent=st.V+' V';
   $('#r1n').textContent=fm(rpm(st.w),1)+' rpm';$('#r1E').textContent=fm(E,2)+' V';$('#r1Ia').textContent=fm(Ia,1)+' A';$('#r1I').textContent=fm(Il,1)+' A';$('#r1P').textContent=fm(P/1000,2)+' kW';
   const gen=Ia<-0.5,ch=$('#r1chip');if(gen){ch.className='ed-chip ok';ch.textContent='مولد: E > V — فرملة بإعادة التوليد، الطاقة تعود إلى المصدر'}else if(Ia>0.5){ch.className='ed-chip ld';ch.textContent='محرك: E < V — الطاقة من المصدر إلى الحمل'}else{ch.className='ed-chip';ch.textContent='لا حمل تقريباً: E ≈ V'}
   if(ws<=0){ch.className='ed-chip warn';ch.textContent='العزم أكبر مما تقدر عليه الآلة بهذا الجهد'}
   $('#r1c').innerHTML=dcCkt(gen?'gen':'motor',{lab:{V:fm(st.V,0)+' V'},title:gen?'generator':'Motor'});
   const xm=300,line=T=>rpm((st.V-T/k*Ra)/k),base=T=>rpm((220-T/K0*Ra)/K0),n0=rpm(st.V/k),vals=[line(-xm),line(xm),base(-xm),base(xm),rpm(st.w)],y0=Math.max(0,Math.floor(Math.min(...vals)/50)*50-50),ym=Math.ceil(Math.max(...vals)/50)*50+50,yz=y0+(ym-y0)*0.12;
   $('#r1nt').innerHTML=ntPlane({cid:'r1ntc',xm,ym,y0,series:[{pts:[[-xm,base(-xm)],[xm,base(xm)]],col:'--muted',w:1.4,dash:'5 4'},{pts:[[-xm,line(-xm)],[xm,line(xm)]],col:'--blue'}],
    zones:[[-150,yz,'مولد — فرملة بإعادة التوليد','--on'],[150,yz,'محرك','--blue-ink']],pts:[[KA()*Ia,rpm(st.w),'--live']],
    more:(X,Y)=>`<path d="M${fx(X(-xm))} ${fx(Y(n0))}H${fx(X(xm))}" stroke="var(--fg)" stroke-dasharray="3 4" stroke-width="1"/>`+S.t(fx(X(xm)-4),fx(Y(n0)-6),'n0 = '+fm(n0,1)+' rpm','m','end')});
   steps.check()});
 },
 examples:[
  {title:'مثال (6-1) — الحل كما في الكتاب',ref:'ص 71',q:Q61,given:G61,solve:(g,B,isBook)=>Z(solve61(g,{bk:isBook})),note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الأرقام المطبوعة: \\(I_{a2}=104.4\\) A (والصحيح 106.4)، و \\(E_2=224.17\\) V، و \\(N_2=1200\\) rpm. إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة. قارن بالحل المصحح أدناه.'},
  {title:'مثال (6-1) — الحل المصحح',ref:'ص 71',q:'<p>نفس المثال بحساب صحيح لتيار المنتج (حساب مصحح — ليس من الكتاب).</p>',given:G61,solve:g=>Z(solve61(g,{})),note:'<span class="fixnote">الفرق عن الكتاب: \\(I_{a2}=106.4\\) A بدل 104.4، و \\(E_2=224.26\\) V، و \\(N_2=1199.5\\) rpm — أي ≈ 1200 rpm كجواب الكتاب.</span>'},
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
}));

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

B.lesson(FIXL({
 id:'u6-l2',unit:6,order:2,pages:'72–74، 78',
 title:'الفرملة الديناميكية',
 summary:'يُفصل المنتج عن المصدر ويوصل بمقاومة إضافية R، فيعمل الآلة مولداً وتتحول طاقة الحركة إلى حرارة في المقاومة حتى تتباطأ الآلة. تُحسب المقاومة من المعادلة (6-5) بحيث لا يتعدى التيار حداً معيناً. مع مثال (6-2).',
 stations:[
  {intro:true},

  {st:1,short:'الفكرة',title:'2) الفرملة الديناميكية <span class="ltr">Dynamic Braking</span>',ref:'ص 72',
   q:'في إعادة التوليد تعود الطاقة إلى الشبكة. فماذا نفعل بها إذا فصلنا المحرك عن الشبكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="طاقة الحركة تمر إلى الآلة وهي مولد ثم تتحول حرارة في المقاومة، والمصدر مفصول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="40" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أين تذهب طاقة الحركة؟</text><g data-tip="الكتل المتحركة: المحرك والحمل المتصل به، ومعها طاقة حركة مخزونة."><rect x="240" y="66" width="100" height="60" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="92" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700" direction="rtl">طاقة</text><text x="290" y="110" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700" direction="rtl">الحركة</text></g><line x1="236" y1="96" x2="215.0" y2="96.0" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="206.0,96.0 215.0,91.0 215.0,101.0" fill="#2C4A40"/><g data-tip="الآلة تعمل مولداً: يبقى مجالها على المصدر، ومنتجها مفصول عن المصدر."><circle cx="180" cy="96" r="24" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="101" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">G</text></g><line x1="154" y1="96" x2="133.0" y2="96.0" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="124.0,96.0 133.0,91.0 133.0,101.0" fill="#2C4A40"/><g data-tip="المقاومة الإضافية ⟦R⟧: خُصصت لهذا الغرض، تُستهلك فيها الطاقة المتولدة على شكل حرارة."><rect x="20" y="66" width="100" height="60" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M34 90 L44.8 90 L49.0 95 L57.4 85 L65.8 95 L74.2 85 L82.6 95 L91.0 85 L95.2 90 L106 90" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="70" y="116" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">حرارة</text></g><g data-tip="المصدر: مفصول عن المنتج، فلا تعود إليه الطاقة (بخلاف إعادة التوليد)."><rect x="120" y="160" width="120" height="44" rx="8" fill="#FBF6EE" stroke="#E8735A" stroke-width="2" stroke-dasharray="6 4"/><text x="180" y="187" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="rtl">المصدر مفصول</text></g><text x="180" y="244" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">المنتج يُفصل عن المصدر ويوصل بالمقاومة</text><text x="180" y="270" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">فتتباطأ الآلة تدريجياً</text><text x="180" y="296" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">ليثبت التيار: نخفض <tspan direction="ltr" unicode-bidi="embed">R</tspan> أو نزيد تيار المجال</text></svg>`,
   cap:'طاقة الحركة تمر إلى الآلة (وهي مولد) ثم تتحول حرارةً في المقاومة الإضافية؛ والمصدر مفصول.<br><b>مرّر المؤشر على المربعات والدائرة (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'في الفرملة الديناميكية، أين تذهب الطاقة المتولدة؟',opts:[
     ['تعود إلى مصدر الجهد',false,'هذا في الفرملة بإعادة التوليد؛ هنا المحرك مفصول عن المصدر.'],
     ['تُستهلك حرارةً في مقاومة إضافية',true,'نص الكتاب في ص 72: «فإنها تُستهلك على شكل حرارة في مقاومة إضافية (R) خصصت لهذا الغرض».'],
     ['تُخزن في ملف المجال',false,'ملف المجال لا يخزن طاقة الحركة؛ هو باقٍ على المصدر لينتج المجال.']]}}
   ],
   body:[
    {book:String.raw`<p>في هذه الطريقة يعمل المحرك الكهربائي أيضاً كمولد للطاقة الكهربائية، وبدلاً من إعادة الطاقة المتولدة إلى مصدر الجهد، فإنها <b>تُستهلك على شكل حرارة في مقاومة إضافية</b> \((R)\) خصصت لهذا الغرض مضافة بدائرة المحرك، فيتم توصيل المحرك بها <b>بعد فصله من المصدر</b> مباشرة، فيؤدي ذلك إلى تباطؤ الآلة تدريجياً.</p>
     <p>يفضل في هذه الحالة الاحتفاظ بقيمة ثابتة للتيار المار في المقاومة الإضافية، وذلك إما <b>بخفض قيمة المقاومة</b> بما يتناسب مع الخفض المستمر في السرعة، أو <b>بزيادة تيار المجال تدريجياً</b> لزيادة الجهد المتولد وتعويض النقص المستمر الناتج عن تباطؤ السرعة، وهذا ما يحدث في محركات التيار المستمر ذات التغذية المستقلة أو الموصلة على التوازي.</p>`,ref:'ص 72'},
    {title:'تابع السلسلة: مقاومة ثابتة أم مقاومة تُخفض مع السرعة؟',widget:(el,B)=>{
      const C={fix:['السرعة تقل','القوة الدافعة E تقل معها','المقاومة R ثابتة','التيار I = E/(Ra+R) يقل','عزم الفرملة يقل','التباطؤ يضعف مع الوقت'],
               red:['السرعة تقل','القوة الدافعة E تقل معها','نخفض R بالنسبة نفسها (أو نزيد تيار المجال)','التيار يبقى ثابتاً','عزم الفرملة يبقى ثابتاً','تباطؤ منتظم حتى السرعات المنخفضة']};
      let k='fix',tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=C[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">المقاومة الإضافية:</span><span class="mseg">${[['fix','ثابتة'],['red','تُخفض مع السرعة']].map(([v,l])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
         <div class="chain" style="margin-top:12px">${S.map((s,i)=>`<span class="ck${i===S.length-1&&k==='red'?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {tip:String.raw`<p>لماذا يفضّل الكتاب تثبيت التيار؟ لأن عزم الفرملة يتناسب مع التيار. فلو تركنا \(R\) ثابتة لضعف العزم كلما تباطأت الآلة، وصار التوقف بطيئاً جداً في آخره. وهذا تراه أيضاً في تبويب «المختبر».</p>`},
    {add:String.raw`<p>المقاومات التي تراها فوق سطح بعض القطارات الكهربائية والحافلات (صناديق بفتحات تهوية) هي مقاومات الفرملة الديناميكية: تسخن أثناء الفرملة وتطرد الحرارة إلى الهواء.</p>`}
   ]},

  {st:2,short:'المقاومة الإضافية',title:'حساب المقاومة الإضافية والشكل <span class="ltr">(6&#8209;2)</span>',ref:'ص 72–73',
   q:'لحظة الفرملة تكون السرعة في أعلاها. كم يجب أن تكون المقاومة حتى لا يتعدى التيار حداً معيناً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 6-2 مبسطاً: يسار التشغيل محركاً، ويمين الفرملة الديناميكية والمنتج موصل بالمقاومة R" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="التشغيل محركاً: المجال والمنتج كلاهما على التوازي مع المصدر، و⟦Ia⟧ يدخل المنتج."><circle cx="138" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="138" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="148" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="148" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="152" y1="198" x2="152.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="152.0,92.0 155.8,99.0 148.2,99.0" fill="#2C4A40"/><text x="160" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="48" y1="70" x2="134" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="48" y1="220" x2="134" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M48 70 L48 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 100 L48 110.8 A8.6 8.6 0 0 1 48 127.9 A8.6 8.6 0 0 1 48 145.0 A8.6 8.6 0 0 1 48 162.1 A8.6 8.6 0 0 1 48 179.2 L48 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 190 L48 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="36" y1="120" x2="36.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="36.0,154.0 32.7,148.0 39.3,148.0" fill="#4FB3A9"/><text x="32" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><line x1="84" y1="70" x2="84" y2="127.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="84" y1="163.0" x2="84" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="84" cy="145.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="84" y="150.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="108" y="133.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="108" y="169.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="72" y1="88" x2="72.0" y2="110.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="72.0,116.0 68.7,110.0 75.3,110.0" fill="#E8735A"/><line x1="132" y1="60" x2="104.0" y2="60.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="98.0,60.0 104.0,56.7 104.0,63.3" fill="#E8735A"/><text x="115" y="55" text-anchor="middle" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I</text><text x="68" y="106" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="0" y="52" width="172" height="180" fill="transparent"/></g><g data-tip="الفرملة الديناميكية: المجال وحده باقٍ على المصدر، والمنتج ⟦Eb⟧ مفصول عن المصدر في حلقة مغلقة مع المقاومة المتغيرة ⟦R⟧، و⟦Ia⟧ انعكس (يخرج من الطرف +)."><circle cx="316" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="316" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="326" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="326" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="330" y1="198" x2="330.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="330.0,92.0 333.9,99.0 326.1,99.0" fill="#2C4A40"/><text x="338" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="226" y1="70" x2="312" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="226" y1="220" x2="312" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M226 70 L226 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 100 L226 110.8 A8.6 8.6 0 0 1 226 127.9 A8.6 8.6 0 0 1 226 145.0 A8.6 8.6 0 0 1 226 162.1 A8.6 8.6 0 0 1 226 179.2 L226 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 190 L226 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="214" y1="120" x2="214.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="214.0,154.0 210.7,148.0 217.3,148.0" fill="#4FB3A9"/><text x="210" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><path d="M262 127.0 L262 98 L292 98 L292 115" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M292 115 L292 124.0 L298 127.5 L286 134.5 L298 141.5 L286 148.5 L298 155.5 L286 162.5 L292 166.0 L292 175" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M292 175 L292 192 L262 192 L262 163.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="262" cy="145.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="150.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="301" y="149.0" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="284" y="131.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><line x1="250" y1="132" x2="250.0" y2="112.0" stroke="#12855A" stroke-width="2" stroke-linecap="round"/><polygon points="250.0,106.0 253.3,112.0 246.7,112.0" fill="#12855A"/><text x="246" y="122" text-anchor="end" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="178" y="52" width="182" height="180" fill="transparent"/></g><text x="90" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Motor</text><text x="268" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Dynamic Braking</text><text x="180" y="268" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> = I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> (R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan> + R)</text><text x="180" y="296" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">المقاومة تحدّ تيار الفرملة</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(6&#8209;2)</span>: يسار التشغيل محركاً، ويمين الفرملة الديناميكية.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف ما تغيّر فيها.</b>',
   side:[
    {predict:{q:'لماذا نحسب المقاومة عند <b>لحظة</b> الفرملة بالذات؟',opts:[
     ['لأن التيار يكون أقصى ما يمكن عندها',true,String.raw`عند لحظة الفرملة تكون السرعة والقوة الدافعة \(E_b\) في أعلاهما، فيكون التيار \(I_b\) أقصى قيمة (التيار الابتدائي).`],
     ['لأن المقاومة تكون صفراً عندها',false,'المقاومة الإضافية موصلة من اللحظة الأولى.'],
     ['لأن المجال يكون مفصولاً عندها',false,'المجال باقٍ على المصدر طوال الفرملة.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (6-2) يبين كيفية توصيل محرك التوازي أثناء الفرملة الديناميكية.</p>
     <p>ويمكن حساب المقاومة الإضافية \((R)\) من المعادلة:</p>
     <div class="eq">$$E_b=I_b\,R_t=I_b\,(R_a+R)$$<span class="eqno">(6-5)</span></div>
     <p>حيث:</p><ul><li>\(E_b\) هي القوة الدافعة الكهربائية المتولدة عند لحظة الفرملة.</li><li>\(I_b\) أقصى قيمة للتيار أثناء الفرملة (التيار الابتدائي).</li><li>\(R_t=R_a+R\) هي المقاومة الكلية لدائرة المنتج.</li></ul>`,ref:'ص 72–73'},
    {tip:String.raw`<p>المعادلة (6-5) هي قانون أوم لحلقة المنتج المغلقة: المنتج هو المصدر الوحيد في الحلقة (المصدر الخارجي مفصول)، والمقاومة الكلية \(R_a+R\). ومنها: \(R=\dfrac{E_b}{I_b}-R_a\).</p>`},
    {watch:String.raw`<p>لا تنسَ طرح \(R_a\): المعادلة تعطي المقاومة <b>الكلية</b> \(R_t\)، والمطلوب المقاومة <b>الإضافية</b> \(R=R_t-R_a\).</p>`},
    {title:'مختبر مصغّر: اختر المقاومة الإضافية',widget:(el,B)=>DCML.lab(el,B,{intro:'لحظة الفرملة في مثال (6-2): \\(E_b=207\\ \\text{V}\\) و\\(R_a=0.38\\ \\Omega\\)، وأقصى تيار مسموح <span class="ltr">94.5 A</span>. حرّك المقاومة الإضافية \\(R\\) وطبّق (6-5).',
 predict:{q:'لو فرملنا ديناميكياً <b>بلا</b> مقاومة إضافية (\\(R=0\\))، كم يكون تيار لحظة الفرملة تقريباً؟',opts:[
  ['<span class="ltr">≈ 94.5 A</span>',false,'هذا الحد المسموح؛ بلا مقاومة إضافية يتجاوزه كثيراً.'],
  ['<span class="ltr">≈ 545 A</span>',true,'\\(207/0.38\\approx545\\ \\text{A}\\)، عشرة أضعاف تيار الحمل الكامل تقريباً.'],
  ['صفر، لأن المصدر مفصول',false,'المنتج نفسه يولد \\(E_b\\) ويدفع التيار في الحلقة.']]},
 ins:[{k:'R',l:'المقاومة الإضافية R',u:'Ω',min:0,max:4,step:0.01,v:1,dp:2}],
 calc:(s,P,B)=>{const Rt=0.38+s.R,I=207/Rt,ok=I<=94.5+0.05;
  return {facts:[['R<sub>t</sub> = R<sub>a</sub> + R',DCML.fm(B,Rt,2)+' Ω'],['I<sub>b</sub> = E<sub>b</sub> ÷ R<sub>t</sub>',DCML.fm(B,I,1)+' A',ok?'hi':'bad'],['مضاعف تيار الحمل الكامل',DCML.fm(B,I/54,2)+' ×',ok?'':'bad']],
   plot:{xr:[0,4],yr:[0,600],xl:'R (Ω)',yl:'I (A)',curves:[{f:r=>207/(0.38+r),n:120},{pts:[[0,94.5],[4,94.5]],col:'--stop',dash:'5 4',w:1.6}],cur:[s.R,I],xt:[0,1,2,3,4],yt:[0,200,400,600]},
   msg:ok?(Math.abs(s.R-1.81)<0.015?'هذه قيمة الكتاب: \\(R=1.81\\ \\Omega\\) تجعل التيار <span class="ltr">94.5 A</span> تماماً.':'التيار داخل الحد المسموح (الخط الأحمر المتقطع). أصغر مقاومة تحقق ذلك <span class="ltr">1.81 Ω</span>.'):'التيار فوق الحد المسموح <span class="ltr">94.5 A</span>: زد \\(R\\).',cls:ok?'':'bad'}}})}
   ]},

  {st:3,short:'مثال 6-2',title:'مثال <span class="ltr">(6&#8209;2)</span>: قيمة المقاومة الإضافية',ref:'ص 73',
   q:'تيار الحمل الكامل <span class="ltr">54&nbsp;A</span>، ولا نريد أن يتعدى تيار الفرملة <span class="ltr">1.75</span> منه. كم أوم نضيف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="معطيات مثال 6-2 والنتيجة المقاومة الإضافية 1.81 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">معطيات مثال <tspan direction="ltr" unicode-bidi="embed">6-2</tspan></text><rect x="70" y="58" width="220" height="140" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="165" y="82" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="177" y="82" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 230 V</text><text x="165" y="107" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><text x="177" y="107" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.38 Ω</text><text x="165" y="132" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><text x="177" y="132" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 54 A</text><text x="165" y="157" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="157" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.9 × V</text><text x="165" y="182" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="182" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 1.75 × I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><g data-tip="المقاومة الإضافية التي توصل مع المنتج: ⟦R = Rt − Ra = 2.19 − 0.38⟧."><rect x="90" y="214" width="180" height="32" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="236" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R = 1.81 Ω</text></g><g data-tip="القدرة ⟦15⟧ حصان معطاة في نص المثال ولا تُستعمل في الحل."><text x="180" y="278" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">القدرة <tspan direction="ltr" unicode-bidi="embed">15</tspan> حصان لا تدخل في الحل</text><rect x="60" y="262" width="240" height="24" fill="transparent"/></g></svg>`,
   cap:'معطيات المثال والنتيجة.<br><b>مرّر المؤشر على النتيجة الصفراء والسطر الأخير (أو المسهما في الجوال) لتعرف التفاصيل.</b>',
   side:[
    {predict:{q:'كم أقصى تيار مسموح أثناء الفرملة في هذا المثال؟',opts:[
     [String.raw`\(54\ \text{A}\)`,false,'هذا تيار الحمل الكامل، والمسموح أكبر منه.'],
     [String.raw`\(1.75\times54=94.5\ \text{A}\)`,true,String.raw`\(I_b=1.75\times I_{FL}=94.5\ \text{A}\).`],
     [String.raw`\(0.9\times230=207\ \text{A}\)`,false,'هذه القوة الدافعة بالفولت، لا التيار.']]}}
   ],
   body:[
    {book:String.raw`<p>محرك تيار مستمر، توالي، قدرته <span class="ltr">15</span> حصان، <span class="ltr">230&nbsp;V</span>، مقاومة المنتج <span class="ltr">0.38&nbsp;Ω</span>، وتيار حمله الكامل <span class="ltr">54&nbsp;A</span>، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية، التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة، تساوي <span class="ltr">0.9</span> من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">1.75</span> من قيمة تيار الحمل الكامل.</p>
     <p><b>الحل:</b></p>
     <div class="eq">$$E_b=0.9\times230=207\ \text{V}$$</div>
     <div class="eq">$$I_b=1.75\times54=94.5\ \text{A}$$</div>
     <div class="eq">$$E_b=I_b\cdot R_t\ \Rightarrow\ R_t=\frac{207}{94.5}=2.19\ \Omega$$</div>
     <div class="eq">$$R=R_t-R_a=2.19-0.38=1.81\ \Omega$$</div>`,ref:'ص 73'},
    {watch:String.raw`<p>نص المثال يقول «محرك تيار مستمر، <b>توالي</b>»، بينما الشرح والشكل (6-2) لمحرك التوازي — لا يؤثر ذلك على الحل. وقدرة المحرك (<span class="ltr">15</span> حصان) معطاة ولا تُستعمل في الحل.</p>`,fix:true},
    {tip:String.raw`<p>تحقق سريع: بعد إضافة \(R=1.81\ \Omega\) يكون تيار لحظة الفرملة \(207/(0.38+1.81)=94.5\ \text{A}\) تماماً. ولو لم نضف مقاومة لكان \(207/0.38\approx545\ \text{A}\) — عشرة أضعاف تيار الحمل الكامل تقريباً، وهذا يتلف المنتج.</p>`},
    {title:'مختبر مصغّر: افحص خطوتين في الحل',widget:(el,B)=>DCML.cases(el,B,{intro:'موضعان يقع فيهما الخطأ غالباً في مثال (6-2).',cases:[
 {q:'\\(R_t=E_b/I_b\\). أي تيار نضعه في المقام؟',opts:[
  ['تيار الحمل الكامل <span class="ltr">54 A</span>',false,'المطلوب ألا يتعدى تيار الفرملة <span class="ltr">1.75</span> منه، فنستعمل التيار الأقصى.'],
  ['أقصى تيار للفرملة <span class="ltr">94.5 A</span>',true,'\\(R_t=207/94.5=2.19\\ \\Omega\\).'],
  ['<span class="ltr">1.75 A</span>',false,'<span class="ltr">1.75</span> مضاعف، وليس تياراً.']]},
 {q:'المقاومة الإضافية \\(R\\):',opts:[
  ['<span class="ltr">2.19 Ω</span>',false,'هذه المقاومة الكلية؛ نسيت طرح \\(R_a\\).'],
  ['<span class="ltr">2.57 Ω</span>',false,'جمعت \\(R_a\\) بدل أن تطرحها.'],
  ['<span class="ltr">1.81 Ω</span>',true,'\\(R=R_t-R_a=2.19-0.38\\).']]}]})}
   ]},

  {st:4,short:'محركات التوالي',title:'ملاحظة على محركات التوالي في الطريقتين السابقتين',ref:'ص 74',
   q:'في محرك التوالي يمر تيار المنتج نفسه في ملف المجال. ماذا يحدث للمجال إذا انعكس تيار المنتج عند الفرملة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك التوالي: يسار المجال على التوالي مع المنتج، ويمين المجال مفصول ومغذى تغذية مستقلة أثناء الفرملة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="40" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">محرك التوالي أثناء الفرملة</text><g data-tip="في محرك التوالي يمر تيار المنتج نفسه في ملف المجال؛ فإذا انعكس تيار المنتج انعكس المجال معه."><rect x="24" y="62" width="146" height="150" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="97" y="84" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">قبل: توالي</text><path d="M60 100 L60 108.4 A6.7 6.7 0 0 1 60 121.7 A6.7 6.7 0 0 1 60 135.0 A6.7 6.7 0 0 1 60 148.3 A6.7 6.7 0 0 1 60 161.6 L60 170" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="124" cy="136" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="124" y="141" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><path d="M60 100 L60 94 L124 94 L124 118" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M60 170 L60 180 L124 180 L124 154" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></g><g data-tip="أثناء الفرملة يُفصل ملف المجال عن المنتج ويُغذى تغذية مستقلة، حتى يمكن زيادة تيار المجال للحصول على القوة الدافعة اللازمة لتحويل الآلة إلى مولد."><rect x="190" y="62" width="146" height="150" rx="10" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><text x="263" y="84" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="rtl">أثناء الفرملة</text><path d="M220 110 L220 117.2 A5.7 5.7 0 0 1 220 128.6 A5.7 5.7 0 0 1 220 140.0 A5.7 5.7 0 0 1 220 151.4 A5.7 5.7 0 0 1 220 162.8 L220 170" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M220 110 L220 102 L248 102 L248 185 L236 185" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="204" y="176" width="32" height="18" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/><text x="220" y="189" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DC</text><circle cx="298" cy="140" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="298" y="145" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><path d="M298 122 L298 104 M298 158 L298 176" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></g><text x="180" y="246" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المجال يُغذى تغذية مستقلة</text><text x="180" y="274" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">وكل الآلات تتحول بنعومة من محرك إلى مولد</text><text x="180" y="294" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">إذا انعكس اتجاه تيار المنتج</text></svg>`,
   cap:'يسار: محرك التوالي في التشغيل العادي. يمين: المجال مفصول ومغذى تغذية مستقلة أثناء الفرملة.<br><b>مرّر المؤشر على كل لوحة (أو المسها في الجوال) لتعرف التفاصيل.</b>',
   side:[
    {predict:{q:'ماذا يلزم في محرك التوالي عند فرملته بإعادة التوليد أو ديناميكياً؟',opts:[
     ['فصل ملفات المجال عن المنتج وتغذيتها تغذية مستقلة',true,'نص الكتاب في ص 74، حتى يتسنى زيادة تيار المجال والحصول على القوة الدافعة اللازمة لتحويل الآلة إلى مولد.'],
     ['زيادة جهد المصدر',false,'هذا لم يذكره الكتاب، وزيادة الجهد تعاكس فكرة إعادة التوليد.'],
     ['قصر ملفات المجال',false,'قصر المجال يلغي المجال، فلا تتولد قوة دافعة أصلاً.']]}}
   ],
   body:[
    {book:String.raw`<p>عند استخدام الطريقتين السابقتين، في حالة محركات التيار المستمر ذات تغذية التوالي، لابد من <b>فصل ملفات المجال عن ملفات المنتج، وتغذيتها تغذية مستقلة</b> أثناء استخدام الفرامل، حتى يتسنى زيادة تيار المجال للحصول على قيمة القوة الدافعة الكهربائية اللازمة لتحويل الآلة إلى مولد. ومما يجدر بالذكر هنا أن جميع أنواع الآلات الكهربائية تتحول في نعومة تامة من محرك إلى مولد إذا ما انعكس اتجاه تيار المنتج بها.</p>`,ref:'ص 74'},
    {tip:String.raw`<p>في محرك التوالي، لو بقي المجال على التوالي مع المنتج وانعكس تيار المنتج عند الفرملة، لانعكس المجال معه، فتنعكس القوة الدافعة ويضعف التوليد بدل أن يستمر. لذلك يُغذّى المجال تغذية مستقلة أثناء الفرملة.</p>`,title:'لماذا يُفصل المجال؟'},
    {tip:String.raw`<p>«الطريقتان السابقتان» هما الفرملة بإعادة التوليد (الدرس السابق) والفرملة الديناميكية (هذا الدرس)؛ ففي الاثنتين تعمل الآلة مولداً.</p>`},
    {title:'مختبر مصغّر: أين يوصل مجال محرك التوالي أثناء الفرملة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'محرك توالي تحوّل إلى مولد للفرملة (بإعادة التوليد أو ديناميكياً). اختر توصيل ملف المجال وتابع ما يحدث.',
 predict:{q:'لو بقي ملف المجال على التوالي مع المنتج، وانعكس تيار المنتج عند الفرملة، فإن المجال:',opts:[
  ['يبقى في اتجاهه',false,'التيار نفسه يمر في الملفين؛ فما يحدث للمنتج يحدث للمجال.'],
  ['ينعكس معه',true,'التيار المعكوس يمر في ملف المجال أيضاً، فينعكس المجال وتنعكس القوة الدافعة ويضعف التوليد.'],
  ['يختفي تماماً',false,'لا يختفي؛ بل ينعكس.']]},
 ins:[{k:'f',l:'ملف المجال أثناء الفرملة',seg:[['s','باقٍ على التوالي مع المنتج'],['x','مفصول ومغذى تغذية مستقلة']],v:'s'}],
 calc:(s,P,B)=>s.f==='s'?{facts:[['تيار المنتج','<span dir="rtl" style="font-family:var(--font)">ينعكس</span>'],['المجال','<span dir="rtl" style="font-family:var(--font)">ينعكس معه</span>','bad'],['القوة الدافعة','<span dir="rtl" style="font-family:var(--font)">تنعكس</span>','bad']],msg:'المجال يتبع التيار المعكوس، فلا تستمر الآلة مولداً بشكل مستقر. لهذا يشترط الكتاب فصل المجال (ص 74).',cls:'bad'}
  :{facts:[['تيار المنتج','<span dir="rtl" style="font-family:var(--font)">ينعكس</span>'],['المجال','<span dir="rtl" style="font-family:var(--font)">ثابت</span>','hi'],['القوة الدافعة','<span dir="rtl" style="font-family:var(--font)">باقية</span>','hi']],msg:'هذا ما يطلبه الكتاب: بتغذية مستقلة نستطيع «زيادة تيار المجال للحصول على قيمة القوة الدافعة الكهربائية اللازمة لتحويل الآلة إلى مولد».'}})}
   ]},

  {st:5,short:'تمرين 6-4',title:'تمرين من أسئلة الوحدة: <span class="ltr">6&#8209;4</span>',ref:'ص 78',
   q:'التمرين يشبه مثال <span class="ltr">(6&#8209;2)</span> بأرقام أخرى. ما الخطوات الثلاث للحل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة معطيات التمرين 6-4" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">تمرين <tspan direction="ltr" unicode-bidi="embed">6-4</tspan> · ص <tspan direction="ltr" unicode-bidi="embed">78</tspan></text><rect x="70" y="58" width="220" height="140" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="165" y="82" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="177" y="82" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 240 V</text><text x="165" y="107" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><text x="177" y="107" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.38 Ω</text><text x="165" y="132" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><text x="177" y="132" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 90 A</text><text x="165" y="157" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="157" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.95 × V</text><text x="165" y="182" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="182" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 1.6 × I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><g data-tip="الطريقة نفسها في مثال ⟦6-2⟧. والمحرك توالي، فيُغذى مجاله تغذية مستقلة أثناء الفرملة."><rect x="100" y="216" width="160" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">بطريقة مثال <tspan direction="ltr" unicode-bidi="embed">6-2</tspan></text></g><text x="180" y="280" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">القدرة <tspan direction="ltr" unicode-bidi="embed">25</tspan> حصان لا تدخل في الحل</text></svg>`,
   cap:'معطيات التمرين <span class="ltr">6&#8209;4</span>.<br><b>مرّر المؤشر على المستطيل الأصفر (أو المسه في الجوال) لتعرف طريقة الحل.</b>',
   side:[
    {predict:{q:String.raw`في التمرين <span class="ltr">6&#8209;4</span> كم \(E_b\) لحظة الفرملة؟`,opts:[
     [String.raw`\(0.95\times240=228\ \text{V}\)`,true,'القوة الدافعة لحظة الفرملة <span class="ltr">0.95</span> من جهد المصدر.'],
     [String.raw`\(240\ \text{V}\)`,false,'نص التمرين يجعلها <span class="ltr">0.95</span> من جهد المصدر لا الجهد كله.'],
     [String.raw`\(1.6\times90=144\ \text{V}\)`,false,String.raw`\(1.6\times90=144\) هو أقصى <b>تيار</b> بالأمبير.`]]}}
   ],
   body:[
    {book:String.raw`<p><b>6-4</b> محرك تيار مستمر، توالي، قدرته <span class="ltr">25</span> حصان، <span class="ltr">240&nbsp;V</span>، مقاومة المنتج <span class="ltr">0.38&nbsp;Ω</span>، وتيار حمله الكامل <span class="ltr">90&nbsp;A</span>، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي <span class="ltr">0.95</span> من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">1.6</span> من قيمة تيار الحمل الكامل.</p>`,ref:'ص 78'},
    {tip:String.raw`<p>الخطوات: \(E_b\) ← \(I_b\) ← \(R_t=E_b/I_b\) ← \(R=R_t-R_a\). ولأن المحرك <b>توالي</b> تذكّر ملاحظة المحطة الرابعة: يُغذى مجاله تغذية مستقلة أثناء الفرملة. تحقق من جوابك بالحل المقترح في تبويب «الأمثلة المحلولة».</p>`},
    {title:'مختبر مصغّر: تحقق من أرقامك في التمرين 6-4',widget:(el,B)=>DCML.cases(el,B,{intro:'حلّ التمرين على ورقة بخطوات مثال (6-2)، ثم اختر ما وصلت إليه. (الكتاب لا يطبع إجابات؛ هذه نتائج الحل المقترح.)',cases:[
 {q:'أقصى تيار أثناء الفرملة \\(I_b\\):',opts:[
  ['<span class="ltr">90 A</span>',false,'هذا تيار الحمل الكامل.'],
  ['<span class="ltr">144 A</span>',true,'<span class="ltr">1.6 × 90 = 144 A</span>.'],
  ['<span class="ltr">228 A</span>',false,'228 هي \\(E_b\\) بالفولت.']]},
 {q:'المقاومة الإضافية \\(R\\):',opts:[
  ['<span class="ltr">≈ 1.20 Ω</span>',true,'\\(R_t=228/144\\approx1.58\\ \\Omega\\)، ثم \\(R=1.58-0.38\\).'],
  ['<span class="ltr">≈ 1.58 Ω</span>',false,'هذه المقاومة الكلية؛ اطرح \\(R_a\\).'],
  ['<span class="ltr">≈ 2.15 Ω</span>',false,'قسمت على تيار الحمل الكامل <span class="ltr">90 A</span> بدل أقصى تيار الفرملة: <span class="ltr">228/90 − 0.38</span>.']]}]})}
   ]},

  {recap:[
   String.raw`الفرملة الديناميكية: يُفصل المنتج عن المصدر ويوصل بمقاومة إضافية \(R\)، فتعمل الآلة مولداً وتتحول طاقة الحركة حرارةً في \(R\) وتتباطأ الآلة تدريجياً (ص 72).`,
   String.raw`يفضّل تثبيت تيار الفرملة بخفض \(R\) مع السرعة أو بزيادة تيار المجال تدريجياً (ص 72).`,
   String.raw`\(E_b=I_b R_t=I_b(R_a+R)\) (6-5)، ومنها \(R=E_b/I_b-R_a\)؛ مثال (6-2): \(R=1.81\ \Omega\).`,
   String.raw`في محركات التوالي يُفصل المجال عن المنتج ويُغذى تغذية مستقلة أثناء الفرملة بالطريقتين (ص 74).`]}
],
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
  {err:'<div class="fixnote"><b>ملاحظة على الكتاب (ص 73):</b> نص مثال (6-2) يقول «محرك تيار مستمر، <b>توالي</b>»، بينما الشرح والشكل (6-2) لمحرك التوازي — لا يؤثر ذلك على الحل. وقدرة المحرك (15 حصان) معطاة ولا تُستعمل في الحل.</div>'},
  {h:'تمرين من أسئلة الوحدة',ref:'ص 78',html:Q('6-4','محرك تيار مستمر، توالي، قدرته 25 حصان، 240 V، مقاومة المنتج 0.38 Ω، وتيار حمله الكامل 90 A، المطلوب فرملته ديناميكياً. احسب قيمة المقاومة الإضافية التي يجب أن توصل مع المنتج لاستهلاك القدرة المتولدة أثناء الفرملة، بفرض أن القوة الدافعة المتولدة عند لحظة الفرملة تساوي 0.95 من قيمة جهد المصدر، وأن أقصى قيمة للتيار أثناء الفرملة ينبغي ألا تتعدى 1.6 من قيمة تيار الحمل الكامل.','بطريقة مثال (6-2): \\(E_b=0.95\\times240=228\\) V، \\(I_b=1.6\\times90=144\\) A، \\(R_t=228/144=1.58\\ \\Omega\\)، \\(R=1.58-0.38=\\) <b>1.2 Ω</b> (بثلاثة أرقام: 1.583 − 0.38 = 1.203 Ω). ولأن المحرك توالي يُغذّى مجاله تغذية مستقلة أثناء الفرملة (ص 74).')}
 ],
 lab:(el)=>{
  const V=230,Ra=0.38,IFL=54,Iset=1.75*IFL;
  const st={ph:'run',mode:'fix',R:1.81,w:0,f:1,t:0,E0:0,I0:0,heat:0,runs:[],cur:[],over:false,done:{},spd:1};
  el.innerHTML=`<div id="d2tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة <small>مبنية على الشكل (6-2) ص 73 وآلة مثال (6-2)</small></h2><div class="svgbox" id="d2c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><button class="btn primary" id="d2go">افصل المصدر وابدأ الفرملة</button><button class="btn" id="d2rs">أعد تشغيل المحرك</button><span class="ed-chip" id="d2chip"></span></div>
    <div class="facts" id="d2fx">${fact('السرعة n','d2n')}${fact('القوة الدافعة E','d2E')}${fact('تيار الفرملة I','d2I')}${fact('المقاومة المستعملة R','d2R')}${fact('عزم الفرملة T = Kϕ·I','d2T')}${fact('الحرارة في R حتى الآن','d2H')}${fact('زمن الفرملة','d2t')}</div></div>
   <div class="panel c6"><h2>طريقة الفرملة</h2>
    <div class="ed-row" style="margin-top:0">${segHTML('md',[['fix','R ثابتة'],['stepR','خفض R تدريجياً'],['field','زيادة تيار المجال']],st.mode)}</div>
    ${sl('d2Rs','المقاومة الإضافية R',0,5,0.01,st.R)}
    <p class="ed-cap">آلة مثال (6-2): <span class="ltr">230 V</span>، <span class="ltr">R<sub>a</sub> = 0.38 Ω</span>، تيار الحمل الكامل <span class="ltr">54 A</span>، والقوة الدافعة عند لحظة الفرملة <span class="ltr">0.9 × 230 = 207 V</span>. الحد الأقصى للتيار <span class="ltr">1.75 × 54 = 94.5 A</span>. في «خفض R تدريجياً» و«زيادة تيار المجال» يُحفظ التيار عند <span class="ltr">94.5 A</span> ما أمكن.</p>
    <div class="ed-row"><span class="sub">سرعة العرض</span>${segHTML('sp',[[1,'عادي'],[0.25,'أبطأ ×¼']],st.spd)}</div></div>
   <div class="panel c6"><h2>السرعة مع الزمن <small>يبقى آخر ثلاث محاولات للمقارنة</small></h2><div class="svgbox" id="d2p1"></div></div>
   <div class="panel c6"><h2>تيار الفرملة مع الزمن</h2><div class="svgbox" id="d2p2"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="d2st"></ol></div></div>`;
  el.innerHTML=LTU(el.innerHTML);B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#d2tp'),'u6-l2',[{k:'n0',label:'سرعة المحرك عند لحظة الفرملة',unit:'rpm',value:1000,min:100,max:5000,step:10,hint:'الكتاب لا يعطي سرعة المحرك في مثال (6-2).'},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:0.1,max:60,step:0.1,hint:'الزمن الذي يحتاجه العزم المقنن لتغيير السرعة من الصفر إلى سرعة الفرملة.'},
   {k:'fr',label:'عزم الاحتكاك (نسبة من العزم المقنن)',unit:'%',value:3,min:0,max:30,step:0.5},
   {k:'fmax',label:'أقصى زيادة لتيار المجال',unit:'%',value:150,min:100,max:300,step:5}],()=>{reset();steps.redraw()});
  const P=()=>{const w0=rad(TP.v.n0),K0=207/w0,Tn=K0*IFL;return {w0,K0,Tn,J:TP.v.tau*Tn/w0,Tf:TP.v.fr/100*Tn}};
  const reset=()=>{const p=P();st.ph='run';st.w=p.w0;st.f=1;st.t=0;st.heat=0;st.cur=[]};
  /* أعطال مخفية: مقاومة الفرملة الفعلية (مفتوحة / جزء منها مقصور / أكبر من المكتوب عليها) */
  const RuA=r=>chF('ropen')?1e9:chF('rshort')?0.4*r:chF('rhigh')?2.5*r:r;
  segBind(el,'md',v=>{st.mode=v});segBind(el,'sp',v=>{st.spd=+v});$('#d2Rs').oninput=e=>{st.R=+e.target.value};
  $('#d2go').onclick=()=>{if(st.ph!=='run')reset();const p=P();st.ph='brake';st.t=0;st.heat=0;st.cur=[[0,rpm(st.w),0]];const E=p.K0*st.w;const Ru=st.mode==='fix'?st.R:st.mode==='stepR'?Math.max(0,E/Iset-Ra):st.R;st.I0=E/(Ra+RuA(Ru));st.over=st.I0>Iset+0.5;st.R0=Ru};
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
    const E=p.K0*st.f*st.w,I=E/(Ra+RuA(Ru)),T=p.K0*st.f*I;st.w-=(T+p.Tf)/p.J*d;st.t+=d;st.heat+=I*I*RuA(Ru)*d;st.Ru=Ru;
    if(st.w<=0){st.w=0;st.ph='stop';st.done[st.mode]=1;st.runs.push({mode:st.mode,pts:st.cur.slice()});if(st.runs.length>3)st.runs.shift()}
    if(!st.cur.length||st.t-st.cur[st.cur.length-1][0]>=0.03)st.cur.push([st.t,rpm(st.w),I])}
   const brake=st.ph==='brake';let Ru=st.mode==='fix'?st.R:(st.Ru!=null?st.Ru:st.R);const E=p.K0*(brake?st.f:1)*st.w,I=st.ph==='run'?(V-207)/Ra:(st.ph==='stop'?0:E/(Ra+RuA(Ru)));
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
}));

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

B.lesson(FIXL({
 id:'u6-l3',unit:6,order:3,pages:'74–78',
 title:'الفرملة بالتيار المعكوس (التبديل)',
 summary:'يُعكس طرفا المنتج أثناء الدوران فتُضاف قوته الدافعة إلى جهد المصدر، فيلزم مقاومة على التوالي تحدّ التيار، ويبذل المحرك عزماً معاكساً يوقفه بسرعة — لكن يجب فصل المصدر عند السرعة صفر وإلا دار عكسياً. المعادلتان (6-6) و(6-7)، والمثالان (6-3) و(6-4)، ومقارنة الطرق الثلاث.',
 stations:[
  {intro:true},

  {st:1,short:'الفكرة',title:'3) الفرملة بالتيار المعكوس أو التبديل <span class="ltr">Reverse Current Braking or Plugging</span>',ref:'ص 74',
   q:'ماذا لو جعلنا المحرك يحاول الدوران في الاتجاه المعاكس وهو ما زال يدور للأمام؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى السرعة: تتباطأ حتى الصفر ثم تنعكس إن لم يفصل التيار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="40" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">نعكس العزم والآلة ما زالت تدور</text><line x1="50" y1="170" x2="330" y2="170" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="50" y1="60" x2="50" y2="280" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="40" y="70" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text><text x="318" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">الزمن</text><g data-tip="بعد التبديل تتباطأ سرعة المحرك والحمل حتى تصل إلى الصفر."><path d="M50 80 L200 170" fill="none" stroke="#12855A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></g><g data-tip="لو لم يُفصل التيار عند السرعة صفر، يبدأ المحرك الدوران في الاتجاه المضاد."><path d="M200 170 L300 230" fill="none" stroke="#E8735A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="8 6"/></g><g data-tip="جهاز خاص يفصل التيار عن المحرك عندما تصل سرعته إلى الصفر."><circle cx="200" cy="170" r="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="200" y="175" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text></g><text x="118" y="108" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="rtl">تباطؤ</text><text x="268" y="262" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="rtl">دوران عكسي</text><rect x="60" y="286" width="240" height="26" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="304" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">يلزم جهاز يفصل التيار عند الصفر</text></svg>`,
   cap:'بعد التبديل تتباطأ السرعة حتى الصفر، ثم تنعكس إن لم يُفصل التيار.<br><b>مرّر المؤشر على الخطين والدائرة الصفراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لعكس عزم المحرك بالتبديل، أي تيار نعكسه حسب الكتاب؟',opts:[
     ['تيار المنتج وتيار المجال معاً',false,'عكسهما معاً يُبقي العزم في اتجاهه؛ الكتاب يقول «ولكن ليس في الاثنين معاً».'],
     ['تيار المجال فقط، وهو الأنسب',false,'يمكن عكس المجال، لكن الكتاب يقول إن الأنسب عكس تيار المنتج.'],
     ['تيار المنتج، وهو الأنسب',true,'نص الكتاب في ص 74: «والأنسب هو عكس اتجاه التيار في ملف المنتج».']]}}
   ],
   body:[
    {book:String.raw`<p>في هذه الطريقة يتم <b>عكس اتجاه عزم دوران المحرك</b>، بحيث يحاول عكس اتجاه دورانه، وذلك بعكس اتجاه التيار إما في ملف المنتج أو في ملف المجال (ولكن ليس في الاثنين معاً)، والأنسب هو عكس اتجاه التيار في ملف المنتج، فتتباطأ سرعة المحرك والحمل حتى تصل إلى الصفر، ثم يبدأ المحرك حركته في الاتجاه المضاد، لذلك فإنه <b>يلزم استخدام جهاز خاص لفصل التيار عن المحرك، عندما تصل سرعته إلى الصفر</b>.</p>`,ref:'ص 74'},
    {tip:String.raw`<p>عزم محرك التيار المستمر يعتمد على اتجاهي المجال وتيار المنتج معاً. عكس أحدهما يعكس العزم؛ وعكس الاثنين يعيد العزم كما كان (سالب × سالب = موجب).</p>`},
    {add:String.raw`<p>«التبديل» هو الترجمة المعتادة لـ <span class="ltr">Plugging</span>: كأننا «نقلب القابس» والمحرك يدور. وهي طريقة تستعمل حيث يلزم إيقاف سريع، مع وجود مفتاح سرعة صفرية يفصل التيار عند التوقف.</p>`},
    {title:'مختبر مصغّر: اعكس تياراً وشاهد العزم',widget:(el,B)=>DCML.lab(el,B,{intro:'المحرك يدور للأمام. اعكس تيار المنتج أو تيار المجال (أو كليهما) وشاهد اتجاه العزم بالنسبة لاتجاه الدوران.',
 predict:{q:'عكسنا تيار المنتج وتيار المجال <b>معاً</b>. ماذا يحدث للعزم؟',opts:[
  ['ينعكس مرتين فيصبح فرملة أقوى',false,'العكس مرتين يعيد العزم إلى اتجاهه الأصلي.'],
  ['يبقى في اتجاه الدوران، فلا فرملة',true,'العزم يعتمد على اتجاهي المجال وتيار المنتج معاً: سالب × سالب = موجب؛ ولهذا يقول الكتاب «ولكن ليس في الاثنين معاً».'],
  ['يصبح صفراً',false,'لا يختفي العزم؛ يعود إلى اتجاهه.']]},
 ins:[{k:'a',l:'',sw:true,v:0,on:'تيار المنتج: معكوس',off:'تيار المنتج: عادي'},{k:'f',l:'',sw:true,v:0,on:'تيار المجال: معكوس',off:'تيار المجال: عادي'}],
 calc:(s,P,B)=>{const rev=(s.a?1:0)^(s.f?1:0);
  return {facts:[['اتجاه العزم',rev?'<span dir="rtl" style="font-family:var(--font)">ضد الدوران</span>':'<span dir="rtl" style="font-family:var(--font)">مع الدوران</span>',rev?'hi':''],['الحالة',rev?'<span dir="rtl" style="font-family:var(--font)">فرملة بالتبديل</span>':'<span dir="rtl" style="font-family:var(--font)">تشغيل عادي</span>']],
   msg:rev?(s.a?'هذا ما يفضّله الكتاب: عكس تيار المنتج. تتباطأ السرعة حتى الصفر، ثم يدور المحرك عكسياً إن لم يفصل جهاز خاص التيار عند السرعة صفر.':'عكس المجال يعكس العزم أيضاً، لكن الكتاب يقول إن الأنسب عكس تيار المنتج.'):(s.a&&s.f?'العكسان يلغي أحدهما الآخر: لا فرملة.':'لا شيء معكوس: العزم مع الدوران.'),cls:rev?'':(s.a&&s.f?'warn':'')}}})}
   ]},

  {st:2,short:'ضعف الجهد والشكل 6-3',title:'ضعف جهد المصدر على المنتج والشكل <span class="ltr">(6&#8209;3)</span>',ref:'ص 74–75',
   q:'قبل التبديل كانت القوة الدافعة تضاد جهد المصدر. ماذا يحدث لها بعد قلب طرفي المنتج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 6-3 مبسطاً: يسار التشغيل العادي، ويمين الفرملة بالتبديل والمنتج معكوس مع مقاومة على التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="التشغيل العادي ⟦Normal Running⟧: المجال والمنتج موصلان على التوازي مباشرة بين خطي المصدر."><circle cx="138" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="138" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="148" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="148" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="152" y1="198" x2="152.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="152.0,92.0 155.8,99.0 148.2,99.0" fill="#2C4A40"/><text x="160" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="48" y1="70" x2="134" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="48" y1="220" x2="134" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M48 70 L48 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 100 L48 110.8 A8.6 8.6 0 0 1 48 127.9 A8.6 8.6 0 0 1 48 145.0 A8.6 8.6 0 0 1 48 162.1 A8.6 8.6 0 0 1 48 179.2 L48 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 190 L48 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="36" y1="120" x2="36.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="36.0,154.0 32.7,148.0 39.3,148.0" fill="#4FB3A9"/><text x="32" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><line x1="84" y1="70" x2="84" y2="127.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="84" y1="163.0" x2="84" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="84" cy="145.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="84" y="150.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="108" y="133.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="108" y="169.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="72" y1="88" x2="72.0" y2="110.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="72.0,116.0 68.7,110.0 75.3,110.0" fill="#E8735A"/><line x1="132" y1="60" x2="104.0" y2="60.0" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="98.0,60.0 104.0,56.7 104.0,63.3" fill="#E8735A"/><text x="115" y="55" text-anchor="middle" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I</text><text x="68" y="106" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="0" y="52" width="172" height="180" fill="transparent"/></g><g data-tip="الفرملة بالتبديل ⟦Plugging⟧: المجال باقٍ على المصدر، والمنتج معكوس الطرفين، وعلى التوالي معه المقاومة المتغيرة ⟦R⟧، وتيار المنتج ⟦Ia⟧ انعكس."><circle cx="316" cy="70" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="316" cy="220" r="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="326" y="75" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="326" y="225" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><line x1="330" y1="198" x2="330.0" y2="99.0" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round"/><polygon points="330.0,92.0 333.9,99.0 326.1,99.0" fill="#2C4A40"/><text x="338" y="150.0" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><line x1="226" y1="70" x2="312" y2="70" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="226" y1="220" x2="312" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M226 70 L226 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 100 L226 110.8 A8.6 8.6 0 0 1 226 127.9 A8.6 8.6 0 0 1 226 145.0 A8.6 8.6 0 0 1 226 162.1 A8.6 8.6 0 0 1 226 179.2 L226 190" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M226 190 L226 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="214" y1="120" x2="214.0" y2="148.0" stroke="#4FB3A9" stroke-width="1.8" stroke-linecap="round"/><polygon points="214.0,154.0 210.7,148.0 217.3,148.0" fill="#4FB3A9"/><text x="210" y="142" text-anchor="end" font-size="11" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">f</tspan><tspan dy="-4">​</tspan></text><path d="M262 70 L262 76.9 L268 79.6 L256 85.0 L268 90.3 L256 95.7 L268 101.1 L256 106.4 L262 109.1 L262 116" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M262 116 L262 143.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M262 179.0 L262 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="262" cy="161.0" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="166.0" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="272" y="98" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="286" y="149.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><text x="286" y="185.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><line x1="250" y1="195.0" x2="250.0" y2="179.0" stroke="#12855A" stroke-width="2" stroke-linecap="round"/><polygon points="250.0,173.0 253.3,179.0 246.7,179.0" fill="#12855A"/><text x="246" y="191.0" text-anchor="end" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><rect x="178" y="52" width="182" height="180" fill="transparent"/></g><text x="90" y="50" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Normal Running</text><text x="268" y="50" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Plugging</text><text x="180" y="266" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">طرفا المنتج معكوسان، والمقاومة <tspan direction="ltr" unicode-bidi="embed">R</tspan> معه</text><text x="180" y="290" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">تماماً كما عند بدء الحركة</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(6&#8209;3)</span>: يسار التشغيل العادي، ويمين الفرملة بالتبديل لمحرك التوازي.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف ما تغيّر فيها.</b>',
   side:[
    {predict:{q:'لماذا يجب توصيل مقاومة خارجية على التوالي مع المنتج عند التبديل؟',opts:[
     ['لأن ضعف جهد المصدر تقريباً يصبح مسلطاً على المنتج',true,'نص الكتاب في ص 74: القوة الدافعة تصبح «مضافة لجهد المصدر… وهذا يعني أن ضعف جهد المصدر أصبح مسلطاً على طرفي المنتج».'],
     ['لأن المنتج يُفصل عن المصدر',false,'هذا في الفرملة الديناميكية؛ في التبديل يبقى المنتج على المصدر (معكوساً).'],
     ['لتعيد الطاقة إلى الشبكة',false,'الطاقة لا تعود إلى الشبكة في التبديل؛ بل تُهدر طاقة إضافية من المصدر.']]}}
   ],
   body:[
    {book:String.raw`<p>يلاحظ أنه عند تبديل طرفي المنتج أثناء دوران المحرك تصبح قطبية القوة الدافعة الكهربائية المتولدة <b>مضافة لجهد المصدر</b> بعد أن كانت تضاده، وهذا يعني أن <b>ضعف جهد المصدر</b> أصبح مسلطاً على طرفي المنتج، مما يستدعي ضرورة اتخاذ الاحتياطات اللازمة لحماية ملفات المنتج من التيار الابتدائي للفرملة \((I_b)\)، وذلك بتوصيل <b>مقاومة خارجية على التوالي</b> \((R)\) مع مقاومة المنتج، تماماً كما يحدث عند بدء الحركة، ومن عيوب هذه الطريقة الطاقة المهدرة من المصدر بالإضافة إلى الطاقة المطلوب تبديدها من الكتل المتحركة، واحتمال عدم الدقة في فصل المصدر الكهربائي عند وصول السرعة إلى الصفر، إلا أنها طريقة فعالة لفرملة المحرك.</p>
     <p>الشكل (6-3) يبين كيفية توصيل محركات التيار المستمر أثناء التشغيل العادي، والتوصيل أثناء استعمال الفرامل بالتبديل لمحرك التوازي.</p>`,ref:'ص 74–75'},
    {tip:String.raw`<table class="tt"><thead><tr><th>المزايا</th><th>العيوب</th></tr></thead><tbody>
     <tr><td>طريقة فعالة لفرملة المحرك</td><td>طاقة مهدرة من المصدر، فوق طاقة الكتل المتحركة المطلوب تبديدها</td></tr>
     <tr><td></td><td>احتمال عدم الدقة في فصل المصدر عند وصول السرعة إلى الصفر</td></tr></tbody></table>`,title:'مزايا وعيوب التبديل كما ذكرها الكتاب'},
    {watch:String.raw`<p>«تماماً كما يحدث عند بدء الحركة»: عند البدء تكون القوة الدافعة صفراً فيكون التيار كبيراً ونضيف مقاومة بدء. وعند التبديل الوضع أسوأ: القوة الدافعة <b>تُضاف</b> إلى الجهد، فالمقاومة المطلوبة أكبر.</p>`},
    {title:'مختبر مصغّر: لحظة التبديل',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام مثال (6-3): \\(V=220\\ \\text{V}\\)، \\(E_b=210.5\\ \\text{V}\\)، \\(R_a=0.1\\ \\Omega\\)، والمقاومة الإضافية \\(R=3.212\\ \\Omega\\). اختر قبل التبديل أو بعده، ووصّل \\(R\\) أو افصلها.',
 predict:{q:'بعد تبديل طرفي المنتج مباشرة، ما الجهد الذي يدفع التيار في دائرة المنتج؟',opts:[
  ['\\(V-E_b=9.5\\ \\text{V}\\)',false,'هذا قبل التبديل، حين كانت القوة الدافعة تضاد جهد المصدر.'],
  ['\\(V+E_b=430.5\\ \\text{V}\\)',true,'القوة الدافعة تصبح مضافة لجهد المصدر: «ضعف جهد المصدر» تقريباً (ص 74).'],
  ['\\(V=220\\ \\text{V}\\) فقط',false,'المحرك ما زال يدور، فقوته الدافعة ما زالت موجودة وتُضاف.']]},
 ins:[{k:'p',l:'اللحظة',seg:[['b','قبل التبديل (تشغيل)'],['a','بعد التبديل مباشرة']],v:'a'},{k:'r',l:'',sw:true,v:0,on:'المقاومة الإضافية R: موصلة',off:'المقاومة الإضافية R: غير موصلة'}],
 calc:(s,P,B)=>{const Rt=0.1+(s.r&&s.p==='a'?3.212:0),U=s.p==='b'?220-210.5:220+210.5,I=U/Rt,bad=I>200;
  return {facts:[['الجهد الدافع في الدائرة',DCML.fm(B,U,1)+' V'],['R<sub>t</sub>',DCML.fm(B,Rt,3)+' Ω'],['تيار المنتج',DCML.fm(B,I,0)+' A',bad?'bad':'hi']],
   bars:[{l:'تيار المنتج (المقياس حتى 4400 A)',v:I,max:4400,txt:DCML.fm(B,I,0)+' A',col:bad?'--stop':'--on'}],
   msg:s.p==='b'?'التشغيل العادي: \\(I_a=(220-210.5)/0.1=95\\ \\text{A}\\)، تيار الحمل الكامل. المقاومة \\(R\\) لا تدخل الدائرة إلا لحظة التبديل.'
    :(s.r?'مع \\(R\\) يصبح التيار الابتدائي <span class="ltr">130 A</span>، الحد المطلوب في المثال.':'بلا مقاومة إضافية: <span class="ltr">430.5 ÷ 0.1 ≈ 4305 A</span> — أكثر من أربعين ضعف تيار الحمل الكامل، فتتلف ملفات المنتج.'),cls:bad?'bad':''}}})}
   ]},

  {st:3,short:'حساب المقاومة والعزم',title:'حساب القوة الدافعة والمقاومة الإضافية وعزم الفرملة',ref:'ص 75',
   q:'كلما تباطأ المحرك قلّت قوته الدافعة. فماذا يحدث لتيار الفرملة وعزمها وهو يقترب من التوقف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهد المصدر والقوة الدافعة يتجمعان، والمقاومة الكلية تحد التيار الابتدائي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="40" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">لحظة التبديل: الجهدان يتجمعان</text><g data-tip="جهد المصدر ⟦V⟧."><rect x="40" y="70" width="100" height="50" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="90" y="101" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><text x="180" y="102" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><g data-tip="القوة الدافعة ⟦Eb⟧: تُحسب قبل التبديل من ⟦Eb = V − Ia Ra⟧، وبعد التبديل تصبح مضافة لجهد المصدر."><rect x="220" y="70" width="100" height="50" rx="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="270" y="101" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text></g><line x1="180" y1="128" x2="180.0" y2="147.0" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="180.0,156.0 175.1,147.0 184.9,147.0" fill="#2C4A40"/><g data-tip="المقاومة الكلية ⟦Rt = Ra + R⟧ تحدّ التيار الابتدائي للفرملة ⟦Ib⟧."><rect x="60" y="160" width="240" height="46" rx="8" fill="#FBF6EE" stroke="#E8735A" stroke-width="2.5"/><text x="180" y="190" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> = (V + E<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan>) / R<tspan font-size="0.72em" dy="4">t</tspan><tspan dy="-4">​</tspan></text></g><text x="180" y="236" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="rtl">ضعف جهد المصدر تقريباً على المنتج</text><g data-tip="في محرك التوازي يثبت تيار المجال، فيتناسب العزم مع تيار المنتج."><text x="180" y="272" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> ∝ I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><rect x="110" y="254" width="140" height="26" fill="transparent"/></g><text x="180" y="300" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">السرعة تقل ← التيار يقل ← العزم يقل</text></svg>`,
   cap:'لحظة التبديل يتجمع جهد المصدر والقوة الدافعة، والمقاومة الكلية تحدّ التيار.<br><b>مرّر المؤشر على المربعات والعلاقة السفلى (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`متى تُحسب القوة الدافعة \(E_b\) في المعادلة (6-6)؟`,opts:[
     ['بعد تبديل طرفي المنتج',false,'الكتاب يقول إنها «تحسب قبل تبديل طرفي المنتج».'],
     ['قبل تبديل طرفي المنتج، والمحرك يدور',true,String.raw`نص الكتاب في ص 75: \(E_b=V-I_aR_a\) قبل التبديل.`],
     ['عند توقف المحرك',false,String.raw`عند التوقف تكون \(E_b=0\).`]]}}
   ],
   body:[
    {book:String.raw`<p><b>ويجب ملاحظة أن</b> القوة الدافعة الكهربائية المتولدة عند لحظة الفرملة \((E_b)\) <b>تحسب قبل</b> تبديل طرفي المنتج أثناء دوران المحرك من المعادلة:</p>
     <div class="eq">$$E_b=V-I_a\,R_a$$<span class="eqno">(6-6)</span></div>
     <p>ويمكن حساب المقاومة الإضافية \((R)\) التي يجب توصيلها على التوالي مع ملف المنتج لتمنع زيادة التيار الابتدائي أثناء الفرملة، مع ملاحظة أن قطبية القوة الدافعة الكهربائية المتولدة مضافة لجهد المصدر:</p>
     <div class="eq">$$E_b+V=I_b\,R_t$$<span class="eqno">(6-7)</span></div>
     <p>حيث:</p><div class="eq">$$R_t=R_a+R$$</div>
     <p>في محرك التيار المستمر توازي يتناسب العزم طردياً مع قيمة تيار المنتج وذلك لثبوت تيار المجال:</p><div class="eq">$$T\propto I_a$$</div>
     <p>وبالتالي فإن القيمة الابتدائية لعزم الفرملة \((T_b)\) تتناسب طردياً مع قيمة التيار الابتدائي أثناء الفرملة \((I_b)\):</p><div class="eq">$$T_b\propto I_b$$</div>
     <p><b>ويجب ملاحظة أنه كلما انخفضت سرعة دوران المحرك تنخفض القوة الدافعة الكهربائية المتولدة، وبالتالي ينخفض تيار الفرملة الذي يؤدي إلى انخفاض عزم الفرملة.</b></p>`,ref:'ص 75'},
    {title:'حرّك سرعة المحرك أثناء الفرملة (أرقام مثال 6-3)',widget:(el,B)=>{
      const V=220,Eb=210.5,Rt=430.5/130,Tf=18400/(2*Math.PI*600/60),If=95;let k=1;
      el.innerHTML=`<label class="w-sl"><span>السرعة نسبةً إلى سرعة الحمل الكامل <span class="ltr"><b data-o="k"></b> × 600 rpm</span></span><input type="range" min="0" max="1" step="0.01" dir="ltr" value="1"></label>
       <div class="w-facts"><div><span>القوة الدافعة \\(E_b\\)</span><b data-o="e"></b></div><div><span>تيار الفرملة بالتبديل</span><b data-o="ip"></b></div><div><span>عزم الفرملة \\(T\\propto I\\)</span><b data-o="t"></b></div><div><span>لو كانت ديناميكية بنفس \\(R_t\\)</span><b data-o="id"></b></div></div>
       <p class="sub" style="margin-top:8px">من مثال (6-3): \\(V=220\\ \\text{V}\\)، \\(E_b=210.5\\ \\text{V}\\) عند <span class="ltr">600&nbsp;rpm</span>، \\(R_t=430.5/130\\ \\Omega\\)، وعزم الحمل الكامل <span class="ltr">293 Nm</span> عند <span class="ltr">95&nbsp;A</span>. العزم هنا بالتناسب \\(T=T_f\\,I/I_f\\) كما في الكتاب. عند السرعة صفر لا يصل التيار إلى الصفر في التبديل — ولهذا يلزم جهاز الفصل.</p>`;
      const o=x=>el.querySelector(`[data-o="${x}"]`),rg=el.querySelector('input');
      const draw=()=>{const E=Eb*k,Ip=(V+E)/Rt,Id=E/Rt;o('k').textContent=k.toFixed(2);o('e').textContent=E.toFixed(1)+' V';o('ip').textContent=Ip.toFixed(1)+' A';o('t').textContent=(Tf*Ip/If).toFixed(0)+' Nm';o('id').textContent=Id.toFixed(1)+' A'};
      rg.oninput=()=>{k=+rg.value;draw()};draw();B.math(el);
    }},
    {tip:String.raw`<p>قارن التيار الابتدائي في الطريقتين بنفس المقاومة الكلية \(R_t\): في الفرملة الديناميكية \(I=E_b/R_t\)، وفي التبديل \(I=(V+E_b)/R_t\) — أي ضعف التيار تقريباً. وحتى عند السرعة صفر يبقى في التبديل تيار \(V/R_t\) وعزم معاكس، فلا يتوقف المحرك من تلقاء نفسه بل يبدأ الدوران عكسياً.</p>`}
   ]},

  {st:4,short:'مقارنة الطرق',title:'مقارنة الطرق الثلاث',ref:'ص 69–75',
   q:'ثلاث طرق تجعل المحرك يفرمل. ما الذي يفرّق بينها في النهاية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أعمدة تقارن طرق الفرملة الثلاث من حيث مصير الطاقة والنتيجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="40" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الطرق الثلاث جنباً إلى جنب</text><g data-tip="المنتج موصل بالمصدر و⟦E &gt; V⟧؛ الطاقة تعود إلى المصدر، وتخفض السرعة فقط."><rect x="246" y="56" width="98" height="236" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="3"/><rect x="246" y="56" width="98" height="40" rx="12" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="295" y="81" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">إعادة التوليد</text><text x="295" y="126" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">الطاقة:</text><text x="295" y="148" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">تعود إلى المصدر</text><text x="295" y="210" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">النتيجة:</text><text x="295" y="232" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">لا توقف المحرك</text></g><g data-tip="المنتج مفصول عن المصدر وموصل بالمقاومة ⟦R⟧؛ الطاقة حرارة في ⟦R⟧."><rect x="140" y="56" width="98" height="236" rx="12" fill="#FBF6EE" stroke="#F2C14E" stroke-width="3"/><rect x="140" y="56" width="98" height="40" rx="12" fill="#F2C14E" stroke="#F2C14E" stroke-width="0"/><text x="189" y="81" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الديناميكية</text><text x="189" y="126" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">الطاقة:</text><text x="189" y="148" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">حرارة في <tspan direction="ltr" unicode-bidi="embed">R</tspan></text><text x="189" y="210" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">النتيجة:</text><text x="189" y="232" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">تباطؤ تدريجي</text></g><g data-tip="المنتج معكوس الطرفين على المصدر مع ⟦R⟧ على التوالي؛ ضعف الجهد على المنتج، ويلزم جهاز فصل عند الصفر."><rect x="34" y="56" width="98" height="236" rx="12" fill="#FBF6EE" stroke="#E8735A" stroke-width="3"/><rect x="34" y="56" width="98" height="40" rx="12" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="83" y="81" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">التبديل</text><text x="83" y="126" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">الطاقة:</text><text x="83" y="148" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">حرارة</text><text x="83" y="166" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" direction="rtl">+ طاقة من المصدر</text><text x="83" y="210" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">النتيجة:</text><text x="83" y="232" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">إيقاف سريع</text></g></svg>`,
   cap:'الطرق الثلاث مقارنةً بمصير الطاقة والنتيجة.<br><b>مرّر المؤشر على أي عمود (أو المسه في الجوال) لتعرف طريقة توصيله.</b>',
   side:[
    {predict:{q:'أي الطرق الثلاث <b>لا</b> تستطيع إيقاف المحرك تماماً؟',opts:[
     ['التبديل',false,'التبديل يوقف المحرك بسرعة، بل يعكسه إن لم يُفصل.'],
     ['الديناميكية',false,'الديناميكية تبطئ الآلة تدريجياً حتى تتوقف.'],
     ['إعادة التوليد',true,String.raw`تحتاج \(E\gt V\)، وهذا لا يتحقق عند السرعات المنخفضة؛ فهي تخفض السرعة فقط (ص 69).`]]}}
   ],
   body:[
    {tip:String.raw`<div class="ed-tbl" style="overflow-x:auto"><table class="tt"><thead><tr><th>الطريقة</th><th>المنتج موصل بـ</th><th>أين تذهب الطاقة</th><th>توقف المحرك؟</th><th>ملاحظة من الكتاب</th></tr></thead><tbody>
     <tr><td>إعادة التوليد</td><td>المصدر نفسه</td><td>تعود إلى المصدر</td><td>لا، تخفض السرعة فقط</td><td>تحتاج \(E\gt V\): سرعة أعلى من سرعة اللاحمل أو مجال أقوى أو جهد أقل</td></tr>
     <tr><td>الديناميكية</td><td>مقاومة \(R\) بعد فصل المصدر</td><td>حرارة في \(R\)</td><td>تتباطأ تدريجياً</td><td>يفضّل خفض \(R\) أو زيادة المجال لتثبيت التيار</td></tr>
     <tr><td>التبديل</td><td>المصدر معكوس الطرفين مع \(R\) على التوالي</td><td>حرارة في \(R\)، ومعها طاقة إضافية من المصدر</td><td>نعم بسرعة — ثم يعكس إن لم يُفصل</td><td>ضعف الجهد على المنتج؛ يلزم جهاز فصل عند السرعة صفر</td></tr></tbody></table></div>`,title:'جدول المقارنة (تلخيص من نص الكتاب)'},
    {tip:String.raw`<p>المعادلتان اللتان تحسب بهما المقاومة:</p>
     <p>الديناميكية:</p><div class="eq">$$E_b=I_b\,R_t$$<span class="eqno">(6-5)</span></div>
     <p>التبديل:</p><div class="eq">$$E_b+V=I_b\,R_t$$<span class="eqno">(6-7)</span></div><p>حيث \(R_t=R_a+R\) في الحالتين.</p>
     <p>الفرق الوحيد إضافة \(V\) في التبديل، لأن المصدر باقٍ في الدائرة ومعكوس.</p>`},
    {title:'مختبر مصغّر: أي طريقة هذه؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل عبارة اختر طريقة الفرملة التي تصفها.',cats:['إعادة التوليد','الديناميكية','التبديل'],items:[
 ['الطاقة تعود إلى المصدر',0,'المحرك يبقى موصلاً بالمصدر ويعمل مولداً (ص 69).'],
 ['يُفصل المنتج عن المصدر ويوصل بمقاومة إضافية',1,'الطاقة تتحول حرارة في \\(R\\) (ص 72).'],
 ['يلزم جهاز يفصل التيار عند السرعة صفر',2,'وإلا بدأ المحرك يدور في الاتجاه المضاد (ص 74).'],
 ['تخفض السرعة فقط ولا توقف المحرك',0,'تحتاج \\(E\\gt V\\)، وهذا لا يتحقق في السرعات المنخفضة.'],
 ['طاقة مهدرة من المصدر فوق طاقة الكتل المتحركة',2,'من عيوب التبديل التي ذكرها الكتاب (ص 75).'],
 ['المقاومة من \\(E_b=I_b(R_a+R)\\)',1,'المعادلة (6-5)؛ وفي التبديل نضيف \\(V\\): (6-7).']]})}
   ]},

  {st:5,short:'مثال 6-3',title:'مثال <span class="ltr">(6&#8209;3)</span>: المقاومة وعزم الفرملة بالتبديل',ref:'ص 76–77',
   q:'محرك <span class="ltr">18.4&nbsp;kW</span> نريد ألا يتعدى تيار فرملته <span class="ltr">130&nbsp;A</span>. كم أوم نضيف، وكم يكون عزم الفرملة عند البدء وعند نصف السرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="معطيات مثال 6-3 ونتائجه الثلاث" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">معطيات مثال <tspan direction="ltr" unicode-bidi="embed">6-3</tspan></text><rect x="70" y="58" width="220" height="152" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="165" y="80" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="177" y="80" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 220 V</text><text x="165" y="102" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">P</text><text x="177" y="102" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 18.4 kW</text><text x="165" y="124" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text><text x="177" y="124" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 600 rpm</text><text x="165" y="146" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><text x="177" y="146" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 95 A</text><text x="165" y="168" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><text x="177" y="168" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.1 Ω</text><text x="165" y="190" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="190" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">≤ 130 A</text><g data-tip="المقاومة الإضافية على التوالي مع المنتج."><rect x="80" y="224" width="200" height="26" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="242" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R = 3.212 Ω</text></g><g data-tip="القيمة الابتدائية لعزم الفرملة."><rect x="80" y="254" width="200" height="26" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="272" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> = 401 Nm</text></g><g data-tip="عزم الفرملة عند نصف السرعة: طُبع ⟦302 Nm⟧ والناتج ⟦302.9 ≈ 303 Nm⟧."><rect x="80" y="286" width="200" height="26" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="304" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n/2: ≈ 303 Nm</text></g></svg>`,
   cap:'معطيات المثال ونتائجه الثلاث.<br><b>مرّر المؤشر على كل نتيجة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`عند نصف السرعة، كم تصبح القوة الدافعة \(E_b\) في هذا المثال؟`,opts:[
     [String.raw`\(210.5\ \text{V}\) كما هي`,false,'القوة الدافعة تتناسب مع السرعة، فتنخفض.'],
     [String.raw`\(105.25\ \text{V}\)`,true,String.raw`«تهبط أيضاً قيمة القوة الدافعة الكهربائية العكسية إلى نصف قيمتها»: \(210.5/2=105.25\ \text{V}\).`],
     [String.raw`\(0\ \text{V}\)`,false,'الصفر عند التوقف التام فقط.']]}}
   ],
   body:[
    {book:String.raw`<p>محرك للتيار المستمر توصيلة التوازي، <span class="ltr">220&nbsp;V</span>، <span class="ltr">18.4&nbsp;kW</span>، سرعته عند الحمل الكامل <span class="ltr">600&nbsp;rpm</span>، مطلوب فرملته بالتيار المعكوس (التبديل)، إذا كان تيار الحمل الكامل <span class="ltr">95&nbsp;A</span>، ومقاومة المنتج <span class="ltr">0.1&nbsp;Ω</span>. أوجد:</p>
     <ol><li>قيمة المقاومة الإضافية التي يجب توصيلها على التوالي مع ملف المنتج، إذا كانت قيمة التيار الابتدائي أثناء الفرملة ينبغي ألا تتعدى <span class="ltr">130&nbsp;A</span>.</li><li>القيمة الابتدائية لعزم الفرملة.</li><li>قيمة عزم الفرملة عندما تهبط سرعة الدوران إلى نصف قيمتها عند الحمل الكامل.</li></ol>
     <p><b>الحل:</b></p>
     <div class="eq">$$E_b=V-I_aR_a=220-95\times0.1=210.5\ \text{V}$$</div>
     <div class="eq">$$V+E_b=220+210.5=430.5\ \text{V}$$</div>
     <div class="eq">$$R_t=\frac{V+E_b}{I_b}=\frac{430.5}{130}=3.312\ \Omega$$</div>
     <div class="eq">$$R=R_t-R_a=3.312-0.1=3.212\ \Omega$$</div>
     <div class="eq">$$\omega_f=\frac{2\pi n_f}{60}=62.8\ \text{rad/s}$$</div>
     <div class="eq">$$T_f=\frac{P_f}{\omega_f}=\frac{18.4\times1000}{62.8}=293\ \text{Nm}$$</div>
     <div class="eq">$$T_f\propto I_f\qquad\frac{T_f}{T_b}=\frac{I_f}{I_b}$$</div>
     <div class="eq">$$T_b=293\times\frac{130}{95}=401\ \text{Nm}$$</div>
     <p>عندما تهبط سرعة الدوران إلى نصف قيمتها عند الحمل الكامل، تهبط أيضاً قيمة القوة الدافعة الكهربائية العكسية إلى نصف قيمتها عند الحمل الكامل.</p>
     <div class="eq">$$E_{b0.5}=\frac{210.5}{2}=105.25\ \text{V}$$</div>
     <div class="eq">$$V+E_{b0.5}=220+210.5=430.5\ \text{V}$$</div>
     <div class="eq">$$I_{b0.5}=\frac{220+105.25}{3.3123}=98.2\ \text{A}$$</div>
     <div class="eq">$$T_{b0.5}=293\times\frac{98.2}{95}=302\ \text{Nm}$$</div>`,ref:'ص 76–77'},
    {watch:String.raw`<p>في الجزء الثالث طُبع \(V+E_{b0.5}=220+210.5=430.5\ \text{V}\)، والصحيح \(220+105.25=325.25\ \text{V}\)، وهو ما استُعمل فعلاً في السطر التالي (\(I_{b0.5}=98.2\ \text{A}\) صحيح). وطُبع \(R_t\) في ذلك السطر 3.3123 والسابق 3.312 (الدقيق 3.3115) — لا أثر له. وطُبع \(T_{b0.5}=302\ \text{Nm}\) والناتج 302.9 ≈ <b><span class="ltr">303 Nm</span></b>. وفي ص 77 تكررت أسطر حساب \(T_f\) و\(T_b\) دون جديد. الحل كما في الكتاب والحل المصحح في تبويب «الأمثلة المحلولة».</p>`,fix:true},
    {tip:String.raw`<p>الرمز \(I_f\) في \(T_f/T_b=I_f/I_b\) يعني هنا <b>تيار الحمل الكامل</b> (<span class="ltr">95&nbsp;A</span>، و f من full load)، لا تيار المجال. وعزم الحمل الكامل \(T_f\) حُسب من القدرة المقننة <span class="ltr">18.4&nbsp;kW</span> والسرعة <span class="ltr">600&nbsp;rpm</span>.</p>`},
    {title:'مختبر مصغّر: سطر 430.5 عند نصف السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'في الجزء الثالث من المثال طُبع \\(V+E_{b0.5}=430.5\\ \\text{V}\\). بدّل بين المطبوع والصحيح، وشاهد أيهما يتفق مع ما يحدث فعلاً عند نصف السرعة (\\(R_t=3.312\\ \\Omega\\)).',
 predict:{q:'لو كان الجهد الدافع عند نصف السرعة <span class="ltr">430.5 V</span> كما طُبع، كم يكون تيار الفرملة؟',opts:[
  ['<span class="ltr">≈ 98.2 A</span>',false,'هذا ما في الكتاب، لكنه ناتج <span class="ltr">325.25 ÷ 3.3123</span> لا 430.5.'],
  ['<span class="ltr">130 A</span>، مثل لحظة بدء الفرملة',true,'وهذا مستحيل: القوة الدافعة نقصت إلى النصف فلا بد أن ينقص التيار. فالسطر المطبوع خطأ، والصحيح <span class="ltr">325.25 V</span>.'],
  ['صفر',false,'الصفر لا يكون حتى عند التوقف في التبديل (يبقى \\(V/R_t\\)).']]},
 ins:[{k:'u',l:'الجهد الدافع عند نصف السرعة',seg:[[430.5,'430.5 V (كما طُبع)'],[325.25,'325.25 V (الصحيح)']],v:325.25}],
 calc:(s,P,B)=>{const I=s.u/3.3123,T=293*I/95,bk=s.u>400;
  return {facts:[['I<sub>b0.5</sub>',DCML.fm(B,I,1)+' A',bk?'bad':'hi'],['T<sub>b0.5</sub> = 293 × I ÷ 95',DCML.fm(B,T,1)+' Nm',bk?'bad':'hi']],
   bars:[{l:'تيار لحظة بدء الفرملة',v:130,max:140,txt:'130 A',col:'--muted'},{l:'تيار الفرملة عند نصف السرعة',v:I,max:140,txt:DCML.fm(B,I,1)+' A',col:bk?'--stop':'--on'}],
   msg:bk?'التيار لم ينقص مع أن السرعة نقصت إلى النصف — يناقض قاعدة ص 75. السطر المطبوع خطأ.':'\\(220+105.25=325.25\\ \\text{V}\\) يعطي <span class="ltr">98.2 A</span> كما في الكتاب، والعزم <span class="ltr">302.9 ≈ 303 Nm</span> (طُبع 302).',cls:bk?'bad':''}}})}
   ]},

  {st:6,short:'مثال 6-4',title:'مثال <span class="ltr">(6&#8209;4)</span>: محرك <span class="ltr">400&nbsp;V</span> بالتبديل',ref:'ص 77',
   q:'المثال نفسه بأرقام أكبر، لكن الكتاب حسب عزم الحمل الكامل هنا بطريقة مختلفة. هل تلاحظ الفرق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="معطيات مثال 6-4 ونتائجه الثلاث" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">معطيات مثال <tspan direction="ltr" unicode-bidi="embed">6-4</tspan></text><rect x="70" y="58" width="220" height="130" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="165" y="80" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="177" y="80" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 400 V</text><text x="165" y="102" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">FL</tspan><tspan dy="-4">​</tspan></text><text x="177" y="102" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 200 A</text><text x="165" y="124" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="0.72em" dy="4">a</tspan><tspan dy="-4">​</tspan></text><text x="177" y="124" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 0.1 Ω</text><text x="165" y="146" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text><text x="177" y="146" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">= 600 rpm</text><text x="165" y="168" text-anchor="end" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan></text><text x="177" y="168" text-anchor="start" font-size="13.5" fill="#2C4A40" font-weight="500" font-family="var(--mono)" direction="ltr">≤ 300 A</text><g data-tip="المقاومة على التوالي مع دائرة المنتج."><rect x="80" y="208" width="200" height="26" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="226" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R = 2.5 Ω</text></g><g data-tip="القيمة الابتدائية لعزم الفرملة كما طُبعت ⟦1815.3 Nm⟧ (وهي ناتج ⟦1210.2 × 1.5⟧)."><rect x="80" y="240" width="200" height="26" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="258" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="0.72em" dy="4">b</tspan><tspan dy="-4">​</tspan> = 1815.3 Nm</text></g><g data-tip="عند نصف السرعة: طُبع ⟦1371.96⟧ بالرقم الخاطئ ⟦1209.2⟧، والصحيح ⟦1373.1 Nm⟧."><rect x="80" y="272" width="200" height="26" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="290" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n/2: 1373.1 Nm</text></g></svg>`,
   cap:'معطيات المثال ونتائجه الثلاث.<br><b>مرّر المؤشر على كل نتيجة (أو المسها في الجوال) لتعرف تفاصيلها.</b>',
   side:[
    {predict:{q:String.raw`كم المقاومة الكلية \(R_t\) في هذا المثال؟`,opts:[
     [String.raw`\(780/300=2.6\ \Omega\)`,true,String.raw`\(V+E_b=400+380=780\ \text{V}\)، و\(I_b=300\ \text{A}\).`],
     [String.raw`\(380/300=1.27\ \Omega\)`,false,String.raw`هذه طريقة الفرملة الديناميكية؛ في التبديل نضيف \(V\) إلى \(E_b\).`],
     [String.raw`\(400/300=1.33\ \Omega\)`,false,'نسيت القوة الدافعة التي تُضاف إلى جهد المصدر.']]}}
   ],
   body:[
    {book:String.raw`<p>محرك للتيار المستمر توصيلة التوازي، <span class="ltr">400&nbsp;V</span>، تيار الحمل الكامل <span class="ltr">200&nbsp;A</span>، ومقاومة المنتج <span class="ltr">0.1&nbsp;Ω</span>، سرعته عند الحمل الكامل <span class="ltr">600&nbsp;rpm</span>، مطلوب فرملته بالتيار المعكوس (التبديل) احسب:</p>
     <ol><li>قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج، لتمنع زيادة التيار الابتدائي أثناء الفرملة الكهربائية عن <span class="ltr">300&nbsp;A</span>.</li><li>القيمة الابتدائية لعزم الفرملة.</li><li>قيمة عزم الفرملة عندما تهبط سرعة الدوران إلى نصف قيمتها عند الحمل الكامل.</li></ol>
     <p><b>الحل:</b></p>
     <div class="eq">$$E_b=V-I_aR_a=400-200\times0.1=380\ \text{V}$$</div>
     <div class="eq">$$V+E_b=400+380=780\ \text{V}$$</div>
     <div class="eq">$$R_t=\frac{780}{300}=2.6\ \Omega\qquad R=2.6-0.1=2.5\ \Omega$$</div>
     <div class="eq">$$\omega_f=\frac{2\pi n_f}{60}=62.8\ \text{rad/s}$$</div>
     <div class="eq">$$T_f=\frac{P_f}{\omega_f}=\frac{380\times200}{62.8}=1209.2\ \text{Nm}$$</div>
     <div class="eq">$$\frac{T_f}{T_b}=\frac{I_f}{I_b}\qquad T_b=1209.2\times\frac{300}{200}=1815.3\ \text{Nm}$$</div>
     <div class="eq">$$E_b\propto n\qquad E_{b0.5}=\frac{380}{2}=190\ \text{V}$$</div>
     <div class="eq">$$I_{b0.5}=\frac{400+190}{2.6}=226.92\ \text{A}$$</div>
     <div class="eq">$$T_{b0.5}=1209.2\times\frac{226.92}{200}=1371.96\ \text{Nm}$$</div>`,ref:'ص 77'},
    {watch:String.raw`<p>\(T_f=380\times200/62.8\) طُبع <b>1209.2</b> والناتج <b>1210.2</b> Nm؛ ثم \(T_b\) طُبع 1815.3 وهو ناتج 1210.2 × 1.5 (أي أن 1209.2 خطأ في النقل)، بينما \(T_{b0.5}=1371.96\) حُسب بالرقم الخاطئ 1209.2، والصحيح <b><span class="ltr">1373.1 Nm</span></b>. الحل كما في الكتاب والحل المصحح في تبويب «الأمثلة المحلولة».</p>`,fix:true},
    {watch:String.raw`<p>الكتاب غير متسق في حساب عزم الحمل الكامل: في مثال (6-3) من القدرة المقننة الخارجة \(P/\omega\)، وفي مثال (6-4) من القدرة الكهرومغناطيسية \(E_bI_a/\omega\) (لأن المثال لا يعطي القدرة المقننة).</p>`,fix:true},
    {title:'مختبر مصغّر: راجع حساب العزم',widget:(el,B)=>DCML.cases(el,B,{intro:'احسب بالحاسبة ثم اختر. (الأرقام من مثال (6-4).)',cases:[
 {q:'عزم الحمل الكامل \\(T_f=\\dfrac{380\\times200}{62.8}\\):',opts:[
  ['<span class="ltr">1209.2 Nm</span>',false,'هذا ما طُبع، وهو خطأ في النقل.'],
  ['<span class="ltr">1210.2 Nm</span>',true,'<span class="ltr">76000 ÷ 62.8 = 1210.2</span>؛ والكتاب نفسه استعمل 1210.2 في \\(T_b=1815.3\\).'],
  ['<span class="ltr">1815.3 Nm</span>',false,'هذا العزم الابتدائي للفرملة \\(T_b\\)، لا عزم الحمل الكامل.']]},
 {q:'عزم الفرملة عند نصف السرعة \\(T_{b0.5}=T_f\\times\\dfrac{226.92}{200}\\) بالرقم الصحيح لـ \\(T_f\\):',opts:[
  ['<span class="ltr">1371.96 Nm</span>',false,'هذا ناتج الرقم الخاطئ 1209.2.'],
  ['<span class="ltr">1373.1 Nm</span>',true,'<span class="ltr">1210.2 × 1.1346 ≈ 1373.1 Nm</span>.'],
  ['<span class="ltr">1815.3 Nm</span>',false,'هذا عند لحظة بدء الفرملة؛ عند نصف السرعة ينقص التيار فينقص العزم.']]}]})}
   ]},

  {st:7,short:'أسئلة الدرس',title:'أسئلة وتمارين: <span class="ltr">6&#8209;2</span> و<span class="ltr">6&#8209;5</span>',ref:'ص 78',
   q:'السؤال الأول يجمع الوحدة كلها، والثاني تمرين تبديل. هل تستطيع شرح الطرق الثلاث في دقيقتين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان لسؤالي الدرس 6-2 و6-5" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أسئلة وتمارين · ص <tspan direction="ltr" unicode-bidi="embed">78</tspan></text><g data-tip="سؤال نظري يجمع الطرق الثلاث لمحرك التوازي: الدرس الأول والثاني والثالث من الوحدة، والمحطة الرابعة هنا."><rect x="40" y="76" width="280" height="72" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="86" width="58" height="26" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="279" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">6-2</text><text x="150" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الطرق الثلاث</text><text x="150" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">لمحرك التيار المستمر التوازي</text></g><g data-tip="مثل مثالي ⟦6-3⟧ و⟦6-4⟧، لكنه يحتاج تحويل الحصان إلى واط، والكتاب لا يعطي هذا التحويل في الوحدة."><rect x="40" y="166" width="280" height="72" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="176" width="58" height="26" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="279" y="194" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">6-5</text><text x="150" y="194" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">فرملة بالتبديل</text><text x="150" y="218" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">تغذية مستقلة · <tspan direction="ltr" unicode-bidi="embed">25</tspan> حصان</text></g><text x="180" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">تمرين حسابي وسؤال نظري</text></svg>`,
   cap:'سؤالا الدرس من ص 78.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف أين تجد طريقة الحل.</b>',
   side:[
    {predict:{q:'في التمرين <span class="ltr">6&#8209;5</span>: كم يكون عزم الفرملة عندما يتوقف المحرك؟',opts:[
     ['صفر، لأن السرعة صفر',false,String.raw`في التبديل يبقى تيار \(V/R_t\) حتى عند السرعة صفر، فيبقى عزم.`],
     [String.raw`ليس صفراً؛ يبقى تيار \(V/R_t\) وعزم معاكس`,true,String.raw`عند التوقف \(E_b=0\) فيصبح التيار \(V/R_t\)، والعزم يتناسب معه — ولذلك يلزم جهاز الفصل.`],
     ['يساوي العزم الابتدائي',false,String.raw`العزم الابتدائي يكون بالتيار \((V+E_b)/R_t\)، وهو أكبر.`]]}}
   ],
   body:[
    {book:String.raw`<p><b>6-2</b> وضح كيف يمكن استخدام الفرملة بالتيار المعكوس والفرملة الديناميكية والفرملة بإعادة التوليد لمحرك التيار المستمر التوازي.</p>
     <p><b>6-5</b> محرك للتيار المستمر (تغذية مستقلة)، <span class="ltr">25</span> حصان، <span class="ltr">400&nbsp;V</span>، ومقاومة المنتج <span class="ltr">0.2&nbsp;Ω</span>، سرعته عند الحمل الكامل <span class="ltr">450&nbsp;rpm</span>، كفاءته عند الحمل الكامل <span class="ltr">74.6&#37;</span>، مطلوب فرملته بالتيار المعكوس (التبديل) احسب:</p>
     <ul><li>قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج، إذا كان أقصى تيار أثناء الفرملة ينبغي ألا يتعدى ضعف تيار الحمل الكامل.</li><li>أقصى عزم فرملي.</li><li>قيمة العزم عندما يتوقف المحرك.</li></ul>`,ref:'ص 78'},
    {tip:String.raw`<p><b>لـ 6-2:</b> لكل طريقة اذكر: كيف يُوصل المنتج (الأشكال 6-1 و6-2 و6-3)، وأين تذهب الطاقة، والمعادلة التي تحسب بها المقاومة — جدول المحطة الرابعة يلخص ذلك.</p>
     <p><b>لـ 6-5:</b> تيار الحمل الكامل غير معطى مباشرة؛ يُحسب من القدرة والكفاءة والجهد. والكتاب لا يعطي تحويل الحصان إلى واط في هذه الوحدة؛ الحل المقترح في تبويب «الأمثلة المحلولة» يستعمل <span class="ltr">1 hp = 746&nbsp;W</span>.</p>`},
    {title:'مختبر مصغّر: قرارات في التمرين 6-5',widget:(el,B)=>DCML.cases(el,B,{intro:'قراران يحددان حل التمرين قبل الأرقام. (الأرقام في الأسباب من الحل المقترح، بافتراض <span class="ltr">1 hp = 746 W</span>.)',cases:[
 {q:'تيار الحمل الكامل غير معطى. كيف نحسبه؟',opts:[
  ['\\(I_f=\\dfrac{P_o}{V}\\)',false,'نسيت الكفاءة: القدرة الداخلة أكبر من القدرة الخارجة.'],
  ['\\(I_f=\\dfrac{P_o}{\\eta\\,V}\\)',true,'\\(P_o=25\\times746=18650\\ \\text{W}\\)، \\(P_{in}=18650/0.746=25000\\ \\text{W}\\)، \\(I_f=25000/400=62.5\\ \\text{A}\\).'],
  ['\\(I_f=\\dfrac{P_o\\,\\eta}{V}\\)',false,'الضرب في الكفاءة يعطي قدرة أقل؛ والداخل إلى المحرك أكبر من الخارج منه.']]},
 {q:'عندما يتوقف المحرك (السرعة صفر)، أي تيار يمر في المنتج؟',opts:[
  ['لا تيار',false,'في التبديل يبقى المصدر موصلاً، فيبقى تيار.'],
  ['\\((V+E_b)/R_t\\)',false,'هذا عند لحظة بدء الفرملة، حين كانت \\(E_b\\) في أعلاها.'],
  ['\\(V/R_t\\)',true,'عند التوقف \\(E_b=0\\): مع \\(R_t=787.5/125=6.3\\ \\Omega\\) يكون التيار ≈ <span class="ltr">63.5 A</span>، والعزم يتناسب معه.']]}]})}
   ]},

  {recap:[
   String.raw`التبديل: نعكس تيار المنتج (لا المنتج والمجال معاً) فينعكس العزم وتتباطأ السرعة حتى الصفر، ويلزم جهاز يفصل التيار عند الصفر وإلا دار المحرك عكسياً (ص 74).`,
   String.raw`بعد التبديل تُضاف القوة الدافعة إلى جهد المصدر فيصبح ضعفه تقريباً على المنتج، فنضيف مقاومة على التوالي؛ ومن عيوبه الطاقة المهدرة من المصدر (ص 74–75).`,
   String.raw`\(E_b=V-I_aR_a\) قبل التبديل (6-6)، و\(E_b+V=I_bR_t\) مع \(R_t=R_a+R\) (6-7)، و\(T_b\propto I_b\) في محرك التوازي.`,
   String.raw`مثال (6-3): \(R=3.212\ \Omega\) و\(T_b=401\ \text{Nm}\)؛ مثال (6-4): \(R=2.5\ \Omega\). وكلما قلت السرعة قل تيار الفرملة وعزمها.`]}
],
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
  {err:String.raw`<div class="fixnote"><b>ملاحظات على الكتاب (ص 76–77):</b> (١) <b>مثال (6-3)</b>: في الجزء الثالث طُبع \(V+E_{b0.5}=220+210.5=430.5\) V، والصحيح \(220+105.25=325.25\) V، وهو ما استُعمل فعلاً في السطر التالي (\(I_{b0.5}=98.2\) A صحيح). وطُبع \(R_t\) في ذلك السطر 3.3123 والسابق 3.312 (الدقيق 3.3115) — لا أثر له. وطُبع \(T_{b0.5}=302\) Nm والناتج 302.9 ≈ <b>303 Nm</b>. وفي ص 77 تكررت أسطر حساب \(T_f\) و \(T_b\) دون جديد. الرمز \(I_f\) في \(T_f/T_b=I_f/I_b\) يعني تيار الحمل الكامل (95 A) لا تيار المجال. (٢) <b>مثال (6-4)</b>: \(T_f=380\times200/62.8\) طُبع <b>1209.2</b> والناتج <b>1210.2</b> Nm؛ ثم \(T_b\) طُبع 1815.3 وهو ناتج 1210.2 × 1.5 (أي أن 1209.2 خطأ في النقل)، بينما \(T_{b0.5}=1371.96\) حُسب بالرقم الخاطئ 1209.2، والصحيح <b>1373.1 Nm</b>. ووحدة \(T_{b0.5}\) طُبعت «N» والصحيح Nm. (٣) الكتاب غير متسق في حساب عزم الحمل الكامل: في مثال (6-3) من القدرة المقننة الخارجة \(P/\omega\)، وفي مثال (6-4) من القدرة الكهرومغناطيسية \(E_bI_a/\omega\).</div>`},
  {h:'أسئلة وتمارين',ref:'ص 78',html:Q('6-2','وضح كيف يمكن استخدام الفرملة بالتيار المعكوس والفرملة الديناميكية والفرملة بإعادة التوليد لمحرك التيار المستمر التوازي.','<b>إعادة التوليد</b> (ص 69–70، الشكل 6-1): يبقى المحرك موصلاً بالمصدر، ونجعل قوته الدافعة أكبر من جهد المصدر — بزيادة تيار المجال أو خفض جهد المصدر، أو تلقائياً عندما يدفعه حمل هابط فوق سرعة اللاحمل — فينعكس تيار المنتج وتعود الطاقة إلى المصدر؛ تخفض السرعة ولا توقف المحرك. <b>الديناميكية</b> (ص 72، الشكل 6-2): يُفصل المنتج عن المصدر ويوصل بمقاومة R والمجال باقٍ على المصدر، فتعمل الآلة مولداً على المقاومة وتتحول طاقة الحركة إلى حرارة؛ R من \\(E_b=I_b(R_a+R)\\)، ويُخفض R أو يُزاد المجال تدريجياً لتثبيت التيار. <b>التبديل</b> (ص 74–75، الشكل 6-3): يُعكس طرفا المنتج مع إضافة R على التوالي والمجال كما هو، فتُضاف القوة الدافعة إلى جهد المصدر؛ R من \\(E_b+V=I_bR_t\\)، ويجب فصل المصدر عند السرعة صفر.')+
   Q('6-5','محرك للتيار المستمر (تغذية مستقلة)، 25 حصان، 400 V، ومقاومة المنتج 0.2 Ω، سرعته عند الحمل الكامل 450 rpm، كفاءته عند الحمل الكامل 74.6%، مطلوب فرملته بالتيار المعكوس (التبديل). احسب: قيمة المقاومة التي يجب توصيلها على التوالي مع دائرة المنتج إذا كان أقصى تيار أثناء الفرملة ينبغي ألا يتعدى ضعف تيار الحمل الكامل، وأقصى عزم فرملي، وقيمة العزم عندما يتوقف المحرك.','الكتاب لا يعطي تحويل الحصان؛ باستعمال <span class="ltr">1 hp = 746 W</span> (إضافة من خارج الكتاب): \\(P_{out}=18650\\) W، \\(P_{in}=18650/0.746=25000\\) W، \\(I_f=62.5\\) A، \\(E_b=400-62.5\\times0.2=387.5\\) V، \\(I_b=125\\) A، \\(R_t=787.5/125=6.3\\ \\Omega\\)، إذن <b>\\(R=6.1\\ \\Omega\\)</b>. بطريقة مثال (6-3): \\(\\omega=47.1\\) rad/s، \\(T_f=18650/47.1\\approx396\\) Nm، فأقصى عزم <b>\\(T_b\\approx792\\) Nm</b>. وعند التوقف \\(E_b=0\\): \\(I=400/6.3\\approx63.5\\) A، والعزم <b>≈ 402 Nm</b> — لا يصل إلى الصفر، ولذلك يلزم جهاز الفصل. (بطريقة مثال 6-4 تخرج قيم العزم أكبر؛ الكتاب غير متسق.)')}
 ],
 lab:(el)=>{
  const PRE={p63:{V:220,IFL:95,Ra:0.1,n:600,R:3.212,Ib:130},p64:{V:400,IFL:200,Ra:0.1,n:600,R:2.5,Ib:300}};
  const st=Object.assign({pre:'p63',meth:'plug',cut:true,ph:'run',w:0,t:0,cur:[],traj:[],half:null,I0:0,rev:false,runs:[],done:{},spd:1,warn:false},PRE.p63);
  el.innerHTML=`<div id="p3tp"></div><div class="grid ed-lab">
   <div class="panel c6"><h2>الدائرة <small>مبنية على الشكلين (6-2) و(6-3)</small></h2><div class="svgbox" id="p3c" style="max-width:420px;margin-inline:auto"></div>
    <div class="ed-row"><button class="btn primary" id="p3go">ابدأ الفرملة</button><button class="btn" id="p3rs">أعد تشغيل المحرك</button><span class="ed-chip" id="p3chip"></span></div>
    <div class="facts" id="p3fx">${fact('السرعة n','p3n')}${fact('القوة الدافعة E','p3E')}${fact('الجهد على R<sub>t</sub>','p3VR')}${fact('تيار المنتج I<sub>a</sub>','p3I')}${fact('العزم T = Kϕ·I<sub>a</sub>','p3T')}${fact('الزمن','p3t')}</div>
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
  el.innerHTML=LTU(el.innerHTML);B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#p3tp'),'u6-l3',[{k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:0.1,max:60,step:0.1,hint:'الزمن الذي يحتاجه العزم المقنن لتغيير السرعة من الصفر إلى سرعة الحمل الكامل.'},
   {k:'fr',label:'عزم الاحتكاك (نسبة من العزم المقنن)',unit:'%',value:3,min:0,max:30,step:0.5}],()=>{reset();steps.redraw()});
  const P=()=>{const wf=rad(st.n),Eb=st.V-st.IFL*st.Ra,K=Eb/wf,Tn=K*st.IFL;/* RtA = المقاومة الفعلية (عطل مخفي: مقاومة الفرملة مفتوحة / جزء منها مقصور)؛ Rt السليمة لخطوط المستوى المرسومة */
   return {wf,Eb,K,Tn,J:TP.v.tau*Tn/wf,Tf:TP.v.fr/100*Tn,Rt:st.Ra+st.R,RtA:st.Ra+(chF('ropen')?1e9:chF('rshort')?0.3*st.R:st.R)}};
  const reset=()=>{const p=P();st.ph='run';st.w=p.wf;st.t=0;st.cur=[];st.traj=[];st.half=null;st.rev=false;$('#p3half').style.display='none'};
  const Ia=(p,w)=>st.ph==='run'?st.IFL:st.ph==='stop'?0:st.meth==='plug'?(-st.V-p.K*w)/p.RtA:-(p.K*w)/p.RtA;
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
    if(wPrev>0&&st.w<=0){if((st.cut&&!chF('zss'))||st.meth==='dyn'){st.w=0;st.ph='stop'}}
    if(st.w<-0.02*p.wf)st.rev=true;
    if(st.ph==='brake'&&(!st.cut||chF('zss'))&&st.meth==='plug'&&st.t>40*TP.v.tau)st.ph='stop';
    if(st.ph==='brake'&&st.meth==='dyn'&&st.t>200*TP.v.tau){st.ph='stop'}
    if(!st.cur.length||st.t-st.cur[st.cur.length-1][0]>=0.02||st.ph==='stop'){const I2=st.ph==='stop'?0:Ia(p,st.w);st.cur.push([st.t,rpm(st.w),I2]);st.traj.push([p.K*I2,rpm(st.w)])}
    if(st.ph==='stop'){st.runs.push({m:st.meth0,pts:st.cur.slice()});if(st.runs.length>3)st.runs.shift()}}
   const I=Ia(p,st.w),E=p.K*st.w,T=p.K*I;
   $('#p3R-v').textContent=fm(st.R,3)+' Ω';$('#p3n').textContent=fm(rpm(st.w),1)+' rpm';$('#p3E').textContent=fm(E,1)+' V';
   $('#p3VR').textContent=st.ph==='brake'?fm(Math.abs(I)*p.RtA,1)+' V':'—';$('#p3I').textContent=fm(I,1)+' A';$('#p3T').textContent=fm(T,1)+' Nm';$('#p3t').textContent=fm(st.t,2)+' s';
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
  {title:'مثال (6-3) — الحل المصحح',ref:'ص 76–77',q:'<p>نفس المثال بالجمع الصحيح عند نصف السرعة وبالتقريب الصحيح (حساب مصحح — ليس من الكتاب).</p>',given:G63,solve:g=>Z(solve63(g,{})),note:'<span class="fixnote">الفرق عن الكتاب: \\(V+E_{b0.5}=325.25\\) V، و \\(T_{b0.5}=303\\) Nm بدل 302. باقي النتائج كما في الكتاب.</span>'},
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
}));

})(PLCBOOK);
