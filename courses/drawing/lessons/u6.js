/* Unit 6 — مخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية (ص 127–141)
   u6-l1 بدء محركات التيار المستمر والتحكم في سرعتها وعكس اتجاهها (ص 127–133)
   u6-l2 بدء المحرك الحثي ثلاثي الأوجه وعكس اتجاهه (ص 133–137)
   u6-l3 تمارين الوحدة السادسة (ص 138–141)
   Labs: starting currents / speeds are illustrative (B.params «قيم المدرب»); the book gives no numbers here.
   Book error that changes the wiring: star–delta starter (6-9) → «كما في الكتاب / المصحح» switch (key 'sd69'). */
(function(B){
const {S}=B;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
const fm=(x,d)=>B.fmtN(x,d);
const lt=s=>`<span class="ltr">${s}</span>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const EXT='<b>إضافة من خارج الكتاب:</b> ';
const SOL='<b>حل مقترح (ليس من الكتاب).</b> ';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const box=(svg,max)=>`<div class="svgbox" style="max-width:${max||520}px;margin-inline:auto">${svg}</div>`;
const T=(x,y,s,c,a,fs)=>S.t(x,y,s,c||'',a||'middle',fs||null);
const AR=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.fs||12}"${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const dot=(x,y)=>S.dot(x,y);
const odot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`;

/* ---------- small css for this file ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('dr6-css'))return;const s=document.createElement('style');s.id='dr6-css';s.textContent=`
.d6 .seg{flex-wrap:wrap;max-width:100%}
.d6 .seg button{white-space:nowrap}
.d6-row{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin-top:10px}
.d6-row .sub{margin:0}
.d6-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;min-width:210px;flex:1}
.d6-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
.d6-sl input{width:100%;accent-color:var(--blue);direction:ltr}
.d6-msg{margin-top:10px;font-size:14px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px}
.d6-msg.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.d6-msg.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.d6-msg:empty{display:none}
.d6 .fact.bad{background:var(--stop-soft)}.d6 .fact.bad b{color:var(--stop)}
.d6-ch svg{width:100%;height:auto;display:block}
.d6-try{margin:6px 0 0;padding-inline-start:20px;line-height:1.8}
.d6-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.d6-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.d6-wire{font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
table.d6-t{border-collapse:collapse;font-size:13.5px;margin-top:8px;width:100%}
table.d6-t th,table.d6-t td{border:1px solid var(--line);padding:5px 8px;text-align:center}
table.d6-t th{background:var(--surface-2)}
table.d6-t td.bad{color:var(--stop);font-weight:700;background:var(--stop-soft)}
table.d6-t td.ok{color:var(--on);font-weight:700}
.ex-t .svgbox{margin-top:8px}
`;document.head.appendChild(s)})();

/* ---------- helpers (local copies) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${B.ltrU(s.t)}</h4><p>${B.ltrU(typeof s.x==='function'?s.x():s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب حالات أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let m=0,moved=false;while(m++<steps.length){const s=steps[i];if(s&&s.done&&s.done()){i++;moved=true}else break}if(moved)draw()},redraw:draw};}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="d6-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const Q=(n,q,ans)=>`<details class="d6-q"><summary>${n}: ${q}</summary><div class="callout">${ans}</div></details>`;
const fact=(l,v,bad)=>`<div class="fact${bad?' bad':''}"><span>${l}</span><b>${v}</b></div>`;
const niceMax=v=>{const p=Math.pow(10,Math.floor(Math.log10(Math.max(v,1e-9))));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*p>=v)return k*p;return 10*p};

/* time chart (last 12 s): hist=[{t,…}] */
function tChart(h,key,ymax,lab,unit,tNow,ref){const W=330,H=118,L=46,R=10,Tp=16,Bm=20,WIN=12,t0=Math.max(0,tNow-WIN);
  const x=t=>L+(t-t0)/WIN*(W-L-R),y=v=>Tp+(1-clamp(v,0,ymax*1.05)/ymax)*(H-Tp-Bm);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${lab}">`;
  s+=`<path d="M${L} ${Tp}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.2"/>`;
  [0,0.5,1].forEach(k=>{const yy=y(ymax*k);s+=`<path d="M${L} ${yy}H${W-R}" stroke="var(--line)" stroke-dasharray="3 3"/>`+T(L-4,yy+4,fm(ymax*k,ymax>=10?0:1),'m','end',10)});
  if(ref!=null&&ref<=ymax)s+=`<path d="M${L} ${y(ref)}H${W-R}" stroke="var(--muted)" stroke-dasharray="6 3"/>`;
  const pts=h.filter(p=>p.t>=t0);if(pts.length>1)s+=`<path d="${pts.map((p,i)=>(i?'L':'M')+x(p.t).toFixed(1)+' '+y(p[key]).toFixed(1)).join('')}" stroke="var(--blue)" stroke-width="2.2" fill="none"/>`;
  s+=AR(W-R,11,lab,{a:'start',fs:11.5})+T(L-4,11,unit,'m','end',10)+T(W-R,H-5,'t (s)','m','end',10);
  return s+'</svg>'}

/* ---------- symbol kit ---------- */
const dblUp=(x,y)=>`<path class="sym" d="M${x-2} ${y+20}V${y+6}M${x+2} ${y+20}V${y+6}M${x-6} ${y+9}L${x} ${y+1}L${x+6} ${y+9}" stroke-width="1.4"/>`;
const handle=(x,y)=>`<path class="sym" d="M${x} ${y-7}V${y+7}M${x} ${y}H${x+6}M${x+5} ${y-4}l3 5l3-5" stroke-width="1.6"/>`;
/* multi-pole switch: poles at xs, contact from y (fixed) to y+24 (pivot) */
function mainSw(xs,y,closed,hx,o){o=o||{};let s='';const xl=Math.max(...xs);
  xs.forEach(x=>{s+=`<path class="sym" d="M${x-4} ${y+3}H${x+4}" stroke-width="1.4"/>`;
    s+=closed?`<path class="sym${o.hot?' hot':''}" d="M${x} ${y+24}L${x} ${y+1}"/>`:`<path class="sym" d="M${x} ${y+24}L${x-11} ${y+5}"/>`});
  const ly=y+13;if(!o.noLink){s+=`<path class="mech" d="M${hx+6} ${ly}H${closed?xl:xl-6}"/>`+handle(hx,ly);if(!o.noArrow)s+=dblUp(hx+8,ly-32)}
  return s}
/* single NO contact (vertical) with its own stubs, from y0 to y1 */
const noC=(x,y0,y1,closed,cin,cout)=>S.w(`M${x} ${y0}V${y0+8}`,cin)+S.w(`M${x} ${y1-8}V${y1}`,cout)+`<path class="sym${closed&&cin?' hot':''}" d="M${x-4} ${y0+9}H${x+4}" stroke-width="1.4"/>`+(closed?`<path class="sym${cin?' hot':''}" d="M${x} ${y1-8}L${x} ${y0+8}"/>`:`<path class="sym" d="M${x} ${y1-8}L${x-11} ${y0+10}"/>`);
const resV=(x,y,h)=>`<rect x="${x-7}" y="${y}" width="14" height="${h}" class="sym" fill="var(--surface)"/>`;
const resH=(x,y,w)=>`<rect x="${x}" y="${y-6}" width="${w}" height="12" class="sym" fill="var(--surface)"/>`;
const blk=(x,y,w,h,on)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${on?'var(--live)':'var(--fg)'}" stroke="var(--fg)" stroke-width="1"/>`;
const head=(x,y,dir,col)=>{const c=col||'var(--fg)';const d={l:`M${x} ${y}l7 -4v8z`,r:`M${x} ${y}l-7 -4v8z`,u:`M${x} ${y}l-4 7h8z`,d:`M${x} ${y}l-4 -7h8z`}[dir];return `<path d="${d}" fill="${c}" stroke="none"/>`};
const arrV=(x,y1,y2,col)=>`<path d="M${x} ${y1}V${y2}" stroke="${col||'var(--fg)'}" stroke-width="1.5" fill="none"/>`+head(x,y2,y2<y1?'u':'d',col);
const arrH=(x1,x2,y,col)=>`<path d="M${x1} ${y}H${x2}" stroke="${col||'var(--fg)'}" stroke-width="1.5" fill="none"/>`+head(x2,y,x2<x1?'l':'r',col);
/* rotating marker inside a motor circle (frame() turns every .rotm) */
const rotm=(cx,cy,r)=>`<g class="rotm" data-c="${cx} ${cy}"><circle cx="${cx}" cy="${cy-r+4.5}" r="2.6" fill="var(--blue)"/></g>`;
const turn=(el,ang)=>el.querySelectorAll('.rotm').forEach(g=>g.setAttribute('transform',`rotate(${ang.toFixed(1)} ${g.dataset.c})`));
/* curved rotation arrow beside a motor: dir +1 clockwise, -1 counter-clockwise */
function rotArr(cx,cy,r,dir,col){const c=col||'var(--blue)';if(!dir)return '';const a0=-60,a1=60,R=r+7,P=a=>[cx+R*Math.sin(a*Math.PI/180),cy-R*Math.cos(a*Math.PI/180)];
  const [x0,y0]=P(dir>0?a0:a1),[x1,y1]=P(dir>0?a1:a0);const sw=dir>0?1:0;
  const hd=dir>0?`M${x1} ${y1}l-7 -3l2 7z`:`M${x1} ${y1}l7 -3l-2 7z`;
  return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 ${sw} ${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="${c}" stroke-width="2" fill="none"/><path d="${hd}" fill="${c}"/>`}
/* DC motor symbol: circle, M with bar, two brushes (top/bottom) */
const dcMot=(cx,cy,r,on)=>`<circle cx="${cx}" cy="${cy}" r="${r}" class="coil ${on?'on':''}"/>`+T(cx,cy+3,'M')+`<path class="sym" d="M${cx-6} ${cy+8}H${cx+6}" stroke-width="1.4"/>`+`<rect x="${cx-4}" y="${cy-r-5}" width="8" height="5" fill="var(--fg)"/><rect x="${cx-4}" y="${cy+r}" width="8" height="5" fill="var(--fg)"/>`;
const acMot=(cx,cy,r,on,sub)=>`<circle cx="${cx}" cy="${cy}" r="${r}" class="coil ${on?'on':''}"/>`+T(cx,cy+(sub?0:4),'M')+(sub?T(cx,cy+12,sub,'',null,10):'');
/* battery (vertical branch): plates horizontal at y (long) and y+8 (short) */
const batV=(x,y)=>`<path class="sym" d="M${x-12} ${y}H${x+12}M${x-6} ${y+8}H${x+6}" stroke-width="2.4"/>`;
/* battery (horizontal branch): plates vertical at x (long) and x+8 (short) */
const batH=(x,y)=>`<path class="sym" d="M${x} ${y-12}V${y+12}M${x+8} ${y-6}V${y+6}" stroke-width="2.4"/>`;
const dashBox=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="9 3 2 3"/>`;

/* =====================================================================
   DC motor figures
   ===================================================================== */
/* (6-1-أ/ب) and (6-2-أ/ب): shunt motor, starting resistor in the armature branch
   o:{kind:'var'|'fix'|'none', main, pos(0 = whole R … 1 = none), short, arrow, noHandle, lab} */
function dcStartSVG(o){const on=!!o.main,f=on?'flow':'',lv='live';
  let s=`<svg viewBox="0 0 320 262" role="img" aria-label="محرك تيار مستمر توازٍ مع مقاومة بدء في دائرة العضو الدوار">`;
  s+=T(110,13,'L-')+T(150,13,'L+')+S.w('M110 18V40',lv)+S.w('M150 18V40',lv);
  s+=mainSw([110,150],40,on||!!o.closed,46,{noLink:o.noHandle,hot:on});
  s+=S.w('M110 64V246H234',f)+S.w('M150 64V84H286V204H276',f);
  s+=blk(240,198,36,12)+S.w('M240 204H234V246',f);
  s+=dcMot(190,206,17,on)+(o.lab?rotm(190,206,17):'')+S.w('M190 228V246',f)+dot(190,246);
  if(o.kind==='var'){const ys=110+clamp(o.pos||0,0,1)*42;
    s+=S.w('M190 98V106','')+resV(190,106,48)+S.w('M190 154V184',f);
    if(on&&o.pos<1)s+=`<rect x="185" y="${ys}" width="10" height="${154-ys}" fill="var(--live-soft)"/>`;
    s+=dot(222,84)+S.w(`M222 84V${ys}H200`,f)+head(198,ys,'l');
    if(o.arrow)s+=arrV(240,104,150);}
  else if(o.kind==='fix'){const sh=!!o.short;
    s+=dot(190,84)+S.w('M190 84V104',sh?lv:f)+resV(190,104,44)+S.w('M190 148V170',sh?lv:f)+S.w('M190 170V184',f)+dot(190,170);
    s+=dot(226,84)+S.w('M226 84V100',sh?f:(on?lv:''))+noC(226,100,150,sh,sh?f:(on?lv:''),sh?f:(on?lv:''))+S.w('M226 150V170H190',sh?f:(on?lv:''));
    if(o.arrow)s+=dblUp(246,112);}
  else{s+=dot(190,84)+S.w('M190 84V184',f)}
  return s+'</svg>'}

/* (6-3)/(6-4) terminal box. o:{br:'63'|'64', swap(L+↔L-), book(arrows as printed), on, lab} */
function dcBoxSVG(o){const on=!!o.on,f=on?'flow':'';
  /* potentials: A1 gets left supply lead, A2 right lead */
  const pA1=o.swap?1:0,pA2=1-pA1;const pE1=o.br==='63'?pA2:pA1;
  const sA=pA2>pA1?1:-1,sF=(o.br==='63'?1:-1)*(o.swap?-1:1);
  let s=`<svg viewBox="0 0 300 250" role="img" aria-label="لوحة أطراف محرك تيار مستمر توازٍ">`;
  s+=T(135,13,o.swap?'L+':'L-')+T(200,13,o.swap?'L-':'L+')+S.w('M135 18V72',f)+S.w('M200 18V100',f);
  s+=dashBox(30,46,240,190)+dashBox(112,58,112,58);
  const P=o.br==='63'?{A1:[135,72],E1:[185,72],E2:[150,100],A2:[200,100]}:{A1:[135,72],E1:[185,72],E2:[150,100],A2:[200,100]};
  /* bridges */
  if(o.br==='63')s+=S.w('M135 72L150 100',f)+S.w('M185 72L200 100',f);else s+=S.w('M135 72H185',f)+S.w('M150 100H200',f);
  /* armature: A1 → left → top brush; bottom brush → right → A2 */
  s+=S.w('M135 72H62V160',f)+dcMot(62,182,17,on)+(o.lab?rotm(62,182,17):'')+S.w('M62 204V222H242V100H200',f);
  /* field: E2 → down → left end of field; right end → E1 */
  s+=S.w('M150 100V190H158',f)+blk(158,184,48,12)+S.w('M206 190H218V86H185V72',f);
  Object.entries(P).forEach(([k,[x,y]])=>{s+=odot(x,y)+T(x+(k==='A1'||k==='E1'?-8:10),y+(k==='A1'||k==='E1'?-7:15),k,'',(k==='A1'||k==='E1')?'end':'start',10.5)});
  /* arrows */
  let up,left;if(o.book){up=o.br==='63';left=true}else{up=sA>0;left=sF>0}
  s+=up?arrV(38,196,166,'var(--blue)'):arrV(38,166,196,'var(--blue)');
  s+=left?arrH(204,160,212,'var(--blue)'):arrH(160,204,212,'var(--blue)');
  if(o.lab&&on)s+=rotArr(62,182,17,sA*sF);
  return s+'</svg>'}

/* (6-5) field weakening / (6-6) armature series rheostat / variable armature voltage
   o:{m:'field'|'arm'|'volt', p:0..1, on, lab, dir} */
function dcSpeedSVG(o){const on=!!o.on,f=on?'flow':'';const p=clamp(o.p||0,0,1);
  let s=`<svg viewBox="0 0 360 190" role="img" aria-label="التحكم في سرعة محرك تيار مستمر">`;
  /* armature loop */
  s+=S.w('M40 30V88',f)+(o.m==='volt'?batV(40,88)+`<path class="sym" d="M22 106L58 78" stroke-width="1.3"/>`+head(58,78,'u'):batV(40,88))+S.w('M40 96V165H170V151',f);
  if(o.m==='arm'){const xs=72+p*48;s+=S.w('M40 30H66',f)+resH(66,30,58);if(on&&p>0)s+=`<rect x="67" y="25" width="${xs-67}" height="10" fill="var(--live-soft)"/>`;
    s+=S.w(`M${xs} 52V38`,f)+head(xs,37,'u')+S.w(`M${xs} 52H170V112`,f)}
  else s+=S.w('M40 30H170V112',f);
  s+=dcMot(170,134,17,on)+(o.lab?rotm(170,134,17):'')+T(150,106,'A1','',null,11)+T(150,168,'A2','',null,11)+arrV(140,122,148)+(o.lab&&on?rotArr(170,134,17,o.dir||1):`<path d="M193 120a24 24 0 0 1 0 28" stroke="var(--fg)" stroke-width="1.4" fill="none"/>`+head(193,148,'d'));
  /* field circuit */
  s+=batH(242,24)+S.w('M242 24H214V126H226',on?'flow':'');
  if(o.m==='field'){const xs=276+p*44;s+=S.w('M250 24H270',f)+resH(270,24,56);if(on&&p>0)s+=`<rect x="271" y="19" width="${xs-271}" height="10" fill="var(--live-soft)"/>`;
    s+=S.w(`M${xs} 44V31`,f)+head(xs,30,'u')+S.w(`M${xs} 44V60H344V126H290`,f)}
  else s+=S.w('M250 24H312V126H290',f);
  s+=blk(226,120,64,12)+T(226,112,'F1','',null,11)+T(290,112,'F2','',null,11)+arrH(282,234,146);
  return s+'</svg>'}

/* ---------- drawn examples: each step adds layers, earlier ones stay ---------- */
function drawSteps(vb,aria,list,max){/* list=[[text, svgFragment], …] → steps for examples.solve */
  let acc='';return list.map(([t,frag],k)=>{acc+=frag;const svg=`<svg viewBox="${vb}" role="img" aria-label="${aria}">${acc}</svg>`;return {t:`${t}${box(svg,max||420)}`,final:k===list.length-1}})}

/* layers of (6-1-أ) and (6-1-ب) for the drawn example */
function ex61Layers(kind){const L=[];
  L.push(['<b>1) خطا التغذية والمفتاح الرئيس:</b> خطان رأسيان L- (يسار) وL+ (يمين)، وعليهما مفتاح ثنائي القطب بذراع وخط ربط متقطع وسهم التشغيل ⇑.',
    T(110,13,'L-')+T(150,13,'L+')+S.w('M110 18V40')+S.w('M150 18V40')+mainSw([110,150],40,false,46)+S.w('M110 64V72')+S.w('M150 64V72')]);
  L.push(['<b>2) السلكان الرئيسان:</b> L- ينزل إلى سلك أفقي سفلي، وL+ ينزل ثم يتجه يميناً سلكاً أفقياً علوياً.',
    S.w('M110 72V246H234')+S.w('M150 72V84H286V204H276')]);
  L.push(['<b>3) ملف المجال على التوازي:</b> مستطيل أسود أفقي أسفل اليمين، طرفه الأيمن من السلك العلوي وطرفه الأيسر إلى السلك السفلي.',
    blk(240,198,36,12)+S.w('M240 204H234V246')]);
  L.push(['<b>4) المحرك M:</b> دائرة بفرشاتين (أعلى وأسفل)؛ الفرشاة السفلى إلى السلك السفلي بعقدة.',
    dcMot(190,206,17,false)+S.w('M190 228V246')+dot(190,246)]);
  if(kind==='var')L.push(['<b>5) مقاومة البدء المتغيرة:</b> مستطيل رأسي فوق المحرك على التوالي مع العضو الدوار فقط؛ طرفه العلوي حر، وسهمه المنزلق يأتي من عقدة على السلك العلوي. طرفه السفلي إلى الفرشاة العليا.',
    S.w('M190 98V106')+resV(190,106,48)+S.w('M190 154V184')+dot(222,84)+S.w('M222 84V110H200')+head(198,110,'l')]);
  else L.push(['<b>5) مقاومة البدء الثابتة:</b> مستطيل رأسي بلا سهم بين عقدة على السلك العلوي والفرشاة العليا، وتحته عقدة.',
    dot(190,84)+S.w('M190 84V104')+resV(190,104,44)+S.w('M190 148V184')+dot(190,170)],
    ['<b>6) تلامس التقصير:</b> تلامس مفتوح (NO) على التوازي مع المقاومة: من عقدة على السلك العلوي إلى العقدة تحت المقاومة. إغلاقه يقصر المقاومة بعد ارتفاع السرعة.',
    dot(226,84)+S.w('M226 84V100')+noC(226,100,150,false)+S.w('M226 150V170H190')]);
  return L}

/* =====================================================================
   Lesson u6-l1
   ===================================================================== */
const DC_DEFS=()=>[
 {k:'V',label:'جهد المصدر',unit:'V',value:220,min:12,max:1000},
 {k:'Ra',label:'مقاومة ملفات العضو الدوار R<sub>a</sub>',unit:'Ω',value:0.5,min:0.01,max:50,step:0.01},
 {k:'Rst',label:'مقاومة البدء الكلية',unit:'Ω',value:4,min:0,max:500,step:0.1},
 {k:'IL',label:'تيار الحمل (المقنن)',unit:'A',value:20,min:0.5,max:2000,step:0.5},
 {k:'nr',label:'السرعة المقننة',unit:'rpm',value:1500,min:100,max:6000},
 {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:0.1,max:30,step:0.1},
 {k:'phmin',label:'أضعف مجال عند أكبر مقاومة لمنظم المجال (٪ من الفيض المقنن)',unit:'%',value:60,min:20,max:95},
 {k:'Rmax',label:'أكبر مقاومة على التوالي مع العضو في الشكل (6-6)',unit:'Ω',value:5,min:0.1,max:500,step:0.1}];

function dcLab(el){
  const st={part:'start',kind:'var',main:false,pos:0,short:false,m:'field',p:0,br:'63',swap:false,on2:false,n:0,I:0,peak:0,t:0,hist:[],ang:0,startN0:false,startShort:null,fixStartOk:false};
  el.innerHTML=`<div id="u6tp1"></div><div class="grid d6">
   <div class="panel c12"><h2>محرك تيار مستمر توازٍ <small>مبني على الأشكال (6-1) إلى (6-6) ص 129–133</small></h2>
    ${segHTML('part',[['start','1) البدء بمقاومة'],['speed','2) التحكم في السرعة'],['rev','3) عكس الاتجاه']],'start')}
    <div id="ctl"></div></div>
   <div class="panel c7"><h2 id="ftitle"></h2><div class="svgbox" id="fig" style="max-width:440px;margin-inline:auto"></div><div class="d6-msg" id="msg"></div>
    <p class="sub">العرض مبطأ: النقطة الزرقاء داخل المحرك تدور أبطأ من المحرك الحقيقي بكثير. الخط البرتقالي المتقطع = مسار التيار.</p></div>
   <div class="panel c5"><h2>القراءات <small id="rsub">أرقام توضيحية</small></h2><div class="facts" id="facts"></div><div class="d6-ch" id="ch1"></div><div class="d6-ch" id="ch2"></div></div>
   <div class="panel c12"><h2>خطوات التجربة</h2><ol class="steps" id="steps"></ol>
    ${tryList(['ابدأ بالمقاومة كلها، ثم أنقصها كلها مرة واحدة والمحرك ما زال بطيئاً: كم يقفز التيار؟','قارن «أكبر تيار» في البدء بلا مقاومة والبدء بها.','في التحكم بالسرعة: أي طريقة ترفع السرعة فوق المقننة، وأيها تخفضها تحتها؟','بدّل سلكي التغذية: لماذا لم يتغير اتجاه الدوران؟'])}</div></div>`;
  const $=s=>el.querySelector(s);
  let TP;const P=()=>TP.v;
  const kphi=()=>{const v=P();return Math.max(v.V-v.IL*v.Ra,0.05*v.V)/v.nr};
  TP=B.params($('#u6tp1'),'u6-l1',DC_DEFS(),()=>{const v=P();TP.warn&&TP.warn(v.V-v.IL*v.Ra<=0.05*v.V?'جهد المصدر صغير جداً بالنسبة لـ «تيار الحمل × R<sub>a</sub>»: المحاكاة تفترض أن الجهد المتولد عند السرعة المقننة 5 % من جهد المصدر على الأقل.':'');st.hist=[];draw()});
  const ctl=$('#ctl');
  const phi=()=>(st.part==='speed'&&st.m==='field'?1-(1-P().phmin/100)*st.p:1)*(chF('fopen')?0:chF('fweak')?0.6:1);
  const Rs=()=>{const v=P();if(st.part==='start')return st.kind==='var'?v.Rst*(1-st.pos):st.kind==='fix'?(st.short?0:v.Rst):0;if(st.part==='speed'&&st.m==='arm')return v.Rmax*st.p;return 0};
  const Va=()=>{const v=P();if(st.part==='rev')return st.on2?v.V:0;if(!st.main)return 0;return st.part==='speed'&&st.m==='volt'?v.V*(1-0.6*st.p):v.V};
  const running=()=>st.part==='rev'?st.on2:st.main;
  function ctlHTML(){
    if(st.part==='start')return `<div class="d6-row">${segHTML('kind',[['var','مقاومة متغيرة (6-1-أ)'],['fix','ثابتة مع تلامس تقصير (6-1-ب)'],['none','بلا مقاومة (للمقارنة)']],st.kind)}</div>
      <div class="d6-row">${swHTML('mainSw','Q','المفتاح الرئيس',st.main)}${st.kind==='var'?`<button class="btn" id="dn">أنقص المقاومة خطوة ▼</button><button class="btn" id="up">أرجع خطوة ▲</button><span class="sub" id="posTxt"></span>`:st.kind==='fix'?swHTML('shSw','K','تلامس التقصير',st.short):''}</div>`;
    if(st.part==='speed')return `<div class="d6-row">${segHTML('m',[['field','إضعاف المجال (6-5)'],['arm','مقاومة على التوالي مع العضو (6-6)'],['volt','تغيير جهد المصدر']],st.m)}</div>
      <div class="d6-row">${swHTML('mainSw','Q','تشغيل المحرك',st.main)}<label class="d6-sl"><span id="pl"></span><b id="pv"></b><input type="range" id="pr" min="0" max="100" step="5" value="${Math.round(st.p*100)}"></label></div>`;
    return `<div class="d6-row">${segHTML('br',[['63','قناطر الشكل (6-3)'],['64','قناطر الشكل (6-4)']],st.br)}</div><div class="d6-row">${swHTML('onSw','Q','تشغيل',st.on2)}${swHTML('swapSw','L±','بدّل سلكي التغذية L+ و L−',st.swap)}</div>`}
  function bind(){
    ctl.innerHTML=ctlHTML();
    ctl.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{st.kind=b.dataset.kind;bind();draw()});
    ctl.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{st.m=b.dataset.m;st.p=0;bind();draw()});
    ctl.querySelectorAll('[data-br]').forEach(b=>b.onclick=()=>{st.br=b.dataset.br;segSet(ctl,'br',st.br);draw()});
    const ms=$('#mainSw');if(ms)ms.onclick=()=>{st.main=!st.main;ms.setAttribute('aria-pressed',st.main);if(st.main){st.peak=0;st.startN0=st.n<0.05*P().nr;st.startShort=st.kind==='fix'?st.short:null;st.fixStartOk=st.kind==='fix'&&!st.short&&st.startN0}draw()};
    const sh=$('#shSw');if(sh)sh.onclick=()=>{st.short=!st.short;sh.setAttribute('aria-pressed',st.short);draw()};
    const on=$('#onSw');if(on)on.onclick=()=>{st.on2=!st.on2;on.setAttribute('aria-pressed',st.on2);draw()};
    const sw=$('#swapSw');if(sw)sw.onclick=()=>{st.swap=!st.swap;sw.setAttribute('aria-pressed',st.swap);draw()};
    const dn=$('#dn'),up=$('#up');if(dn)dn.onclick=()=>{st.pos=Math.min(1,B.round(st.pos+0.25,2));draw()};if(up)up.onclick=()=>{st.pos=Math.max(0,B.round(st.pos-0.25,2));draw()};
    const pr=$('#pr');if(pr)pr.oninput=()=>{st.p=+pr.value/100;draw()};
  }
  el.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{const np=b.dataset.part;if(np===st.part)return;st.part=np;segSet(el,'part',np);
    if(np==='speed'){st.main=true;st.p=0;if(st.n<0.5*P().nr)st.n=P().nr}else if(np==='start'){st.main=false;st.n=0;st.pos=0;st.short=false}else{st.on2=false}
    st.hist=[];st.peak=0;bind();draw()});
  let sig='';
  function draw(){const v=P();
    const titles={start:{var:'الشكلان (6-1-أ) و(6-2-أ): مقاومة بدء متغيرة',fix:'الشكلان (6-1-ب) و(6-2-ب): مقاومة ثابتة وتلامس تقصير',none:'للمقارنة: بلا مقاومة بدء (ليس من الكتاب)'}[st.kind],speed:{field:'الشكل (6-5): إضعاف المجال',arm:'الشكل (6-6): تقليل جهد العضو بمقاومة على التوالي',volt:'تغيير الجهد المطبق على العضو (مذكور في النص ص 131)'}[st.m],rev:st.br==='63'?'الشكل (6-3): لوحة الأطراف':'الشكل (6-4): لوحة الأطراف'};
    $('#ftitle').innerHTML=B.ltrFig(st.part==='start'?titles.start:st.part==='speed'?titles.speed:titles.rev);
    if(st.part==='start')$('#fig').innerHTML=dcStartSVG({kind:st.kind,main:st.main,pos:st.pos,short:st.short,arrow:true,lab:1});
    else if(st.part==='speed')$('#fig').innerHTML=dcSpeedSVG({m:st.m,p:st.p,on:st.main,lab:1,dir:1});
    else $('#fig').innerHTML=dcBoxSVG({br:st.br,swap:st.swap,on:st.on2,lab:1});
    const pt=$('#posTxt');if(pt)pt.innerHTML=st.pos>=1?'المقاومة خرجت كلها':`في الدائرة ${lt(fm((1-st.pos)*100,0)+' %')} من المقاومة`;
    const pl=$('#pl'),pv=$('#pv');if(pl){pl.innerHTML={field:'مقاومة منظم المجال',arm:'المقاومة على التوالي مع العضو',volt:'خفض جهد العضو'}[st.m];
      pv.textContent=st.m==='field'?`${fm(st.p*100,0)} %`:st.m==='arm'?`${fm(Rs(),2)} Ω`:`V = ${fm(Va(),0)} V`}
    sig='';info()}
  function info(){const v=P();const facts=$('#facts');$('#rsub').textContent=st.part==='rev'?'منطق فقط بلا أرقام':'أرقام توضيحية';
    if(st.part==='rev'){const pA1=st.swap?1:0,sA=(1-pA1)>pA1?1:-1,sF=(st.br==='63'?1:-1)*(st.swap?-1:1);
      facts.innerHTML=fact('تيار العضو الدوار',st.on2?(sA>0?'↑':'↓'):'—')+fact('تيار المجال',st.on2?(sF>0?'←':'→'):'—')+fact('اتجاه الدوران',st.on2?(sA*sF>0?'⟳':'⟲'):'متوقف');
      $('#ch1').innerHTML='';$('#ch2').innerHTML='';
      const m=$('#msg');m.className='d6-msg';m.innerHTML=st.on2?(st.swap&&st.br==='63'?'بدّلت سلكي التغذية: انعكس تيار العضو <b>و</b>تيار المجال معاً، فبقي الاتجاه كما هو (الشكل 6-3).':st.br==='64'?'في قناطر الشكل (6-4) انعكس اتجاه أحد التيارين بالنسبة للآخر، فانعكس اتجاه الدوران.':'المحرك يدور. جرّب تبديل سلكي التغذية، ثم قناطر الشكل (6-4).'):'شغّل المحرك.';m.innerHTML=B.ltrFig(m.innerHTML);return}
    const E=kphi()*phi()*st.n;
    facts.innerHTML=fact('التيار I',`${fm(st.I,1)} A`,st.I>2.5*v.IL)+fact('أكبر تيار منذ التشغيل',`${fm(st.peak,0)} A`,st.peak>2.5*v.IL)+fact('السرعة n',`${fm(st.n,0)} rpm`)+fact('الجهد المتولد E',`${fm(E,0)} V`)+
      (st.part==='start'?fact('مقاومة البدء في الدائرة',`${fm(Rs(),2)} Ω`):fact('الفيض',`${fm(phi()*100,0)} %`));
    const now=st.t,im=niceMax(Math.max(2*v.IL,...st.hist.map(p=>p.I),1)),nm=niceMax(Math.max(v.nr*1.1,...st.hist.map(p=>p.n)));
    $('#ch1').innerHTML=tChart(st.hist,'n',nm,'السرعة','rpm',now,v.nr);$('#ch2').innerHTML=tChart(st.hist,'I',im,'التيار','A',now,v.IL);
    const m=$('#msg');let cls='d6-msg',t='';
    if(st.part==='start'){if(!st.main)t=st.n>1?'المفتاح مفتوح: المحرك يتباطأ.':'أغلق المفتاح الرئيس لتبدأ.';
      else{const r=st.peak/v.IL;t=`أكبر تيار منذ التشغيل ${lt(fm(st.peak,0)+' A')}، أي ${lt(fm(r,1))} مرة من تيار الحمل. `;
        if(st.I>2.5*v.IL){cls+=' warn';t+=st.kind==='none'?'بلا مقاومة بدء لا يحد التيارَ عند السكون إلا مقاومة ملفات العضو الصغيرة جداً.':'التيار كبير الآن: انتظر حتى ترتفع السرعة قبل أن تنقص المقاومة.'}
        else if(st.kind!=='none'&&Rs()>0&&st.n>0.6*v.nr&&Math.abs(st.I-v.IL)<0.3*v.IL)t+='ارتفعت السرعة واستقر التيار: يمكنك الآن إنقاص المقاومة.';
        else if(Rs()===0&&st.n>0.9*v.nr)t+='مقاومة البدء خارج الدائرة والمحرك يعمل بسرعته.'}}
    else{const nr=st.n/v.nr;t=st.main?`السرعة ${lt(fm(nr*100,0)+' %')} من المقننة. `+(st.m==='field'?'إضعاف المجال يرفع السرعة فوق المقننة، ويزيد تيار العضو لأن الحمل ثابت.':st.m==='arm'?'المقاومة على التوالي تخفض الجهد الواصل للعضو فتنخفض السرعة تحت المقننة، وتضيع قدرة حرارية فيها.':'خفض الجهد المطبق على العضو يخفض السرعة تحت المقننة.'):'المحرك متوقف.'}
    m.className=cls;m.innerHTML=B.ltrFig(t)}
  const steps=[
    {t:'البدء بمقاومة متغيرة — الشكل (6-1-أ)',x:'المنزلق في أعلى المقاومة (المقاومة كلها في الدائرة). أغلق المفتاح الرئيس وراقب تيار البدء.',done:()=>st.part==='start'&&st.kind==='var'&&st.main&&st.n>0.2*P().nr},
    {t:'أنقص المقاومة خطوة كلما ارتفعت السرعة — الشكل (6-2-أ)',x:'انتظر حتى ينخفض التيار ثم اضغط «أنقص المقاومة خطوة»، وكرر حتى تخرج المقاومة كلها. لاحظ قفزة التيار عند كل خطوة.',done:()=>st.part==='start'&&st.kind==='var'&&st.pos>=1&&st.main&&st.n>0.9*P().nr},
    {t:'مقاومة ثابتة مع تلامس تقصير — الشكل (6-1-ب)',x:'افصل المفتاح وانتظر حتى يقف المحرك، واختر «ثابتة مع تلامس تقصير». شغّل والتلامس مفتوح، وبعد ارتفاع السرعة أغلق تلامس التقصير (الشكل 6-2-ب).',done:()=>st.part==='start'&&st.kind==='fix'&&st.short&&st.main&&st.n>0.9*P().nr&&st.fixStartOk},
    {t:'للمقارنة: البدء بلا مقاومة',x:'افصل المفتاح وانتظر حتى يقف المحرك، ثم اختر «بلا مقاومة» وشغّل: قارن «أكبر تيار» بما رأيته مع مقاومة البدء.',done:()=>st.part==='start'&&st.kind==='none'&&st.main&&st.startN0&&st.n>0.5*P().nr},
    {t:'إضعاف المجال — الشكل (6-5)',x:'افتح «التحكم في السرعة» واختر «إضعاف المجال»، ثم زد مقاومة منظم المجال: ترتفع السرعة فوق المقننة.',done:()=>st.part==='speed'&&st.m==='field'&&st.main&&st.n>1.1*P().nr},
    {t:'مقاومة على التوالي مع العضو — الشكل (6-6)',x:'اختر «مقاومة على التوالي مع العضو» وزدها: تنخفض السرعة تحت المقننة.',done:()=>st.part==='speed'&&st.m==='arm'&&st.main&&st.n<0.8*P().nr&&st.n>1},
    {t:'بدّل سلكي التغذية — الشكل (6-3)',x:'افتح «عكس الاتجاه»، شغّل المحرك ثم بدّل L+ و L−: ينعكس تيار العضو وتيار المجال معاً، فيبقى الاتجاه كما هو.',done:()=>st.part==='rev'&&st.on2&&st.swap&&st.br==='63'},
    {t:'اعكس قطبية العضو بالنسبة للمجال — الشكل (6-4)',x:'اختر قناطر الشكل (6-4): انعكس أحد التيارين فقط، فانعكس اتجاه الدوران.',done:()=>st.part==='rev'&&st.on2&&st.br==='64'}];
  const SU=stepsUI($('#steps'),steps);
  bind();draw();
  let acc=0;
  loopOn(el,dt=>{const v=P();
    if(st.part!=='rev'){const h=0.002,N=Math.max(1,Math.round(dt/h));const kp=kphi(),ph=phi(),R=v.Ra+(chF('rshort')&&st.part==='start'?0:Rs()),Vv=Va(),acc_k=v.nr/(v.IL*v.tau);
      const rop=chF('ropen')&&st.part==='start'&&Rs()>0;for(let i=0;i<N;i++){const E=kp*ph*st.n;let I=st.main&&!rop?(Vv-E)/R:0;const Te=ph*I;let dn=(Te-v.IL)*acc_k*(dt/N);
        if(st.n<=0&&Te<v.IL){dn=0;I=st.main?I:0}st.n=Math.max(0,st.n+dn);st.I=I}
      if(st.main)st.peak=Math.max(st.peak,st.I)}
    else{st.n=st.on2?v.nr:Math.max(0,st.n-v.nr/v.tau*dt);st.I=0}
    st.t+=dt;acc+=dt;
    const pA1=st.swap?1:0,dir=st.part==='rev'?((1-pA1>pA1?1:-1)*(st.br==='63'?1:-1)*(st.swap?-1:1)):1;
    st.ang+=dir*st.n/60*360*dt*0.02;turn(el,st.ang);
    if(acc>=0.08){acc=0;st.hist.push({t:st.t,n:st.n,I:Math.max(0,st.I)});while(st.hist.length&&st.hist[0].t<st.t-13)st.hist.shift();info();SU.check()}});
}

B.lesson({
 id:'u6-l1',unit:6,order:1,pages:'127–133',
 title:'بدء محركات التيار المستمر والتحكم في سرعتها وعكس اتجاهها',
 summary:'مقاومة البدء على التوالي مع العضو الدوار تُنقص أو تُقصر كلما ارتفعت السرعة؛ والسرعة تُضبط بإضعاف المجال (فوق المقننة) أو بتقليل جهد العضو (تحتها)؛ والاتجاه ينعكس بعكس قطبية العضو، لا بتبديل سلكي التغذية.',
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
})())/*DCML-END*/,(/*DRA-BEGIN*/window.DRA=window.DRA||(function(){
/* رسوم المحطات لمقرر الرسم الفني (الوحدتان 6 و7): نعيد استعمال رسوم الدرس نفسه داخل إطار المحطة 360×320.
   ألوان ثابتة فاتحة داخل الرسم (خلفية الرسم فاتحة في الوضعين الفاتح والداكن). */
const V='--fg:#2C4A40;--muted:#66665A;--surface:#FBF6EE;--surface-2:#EEE5D3;--bg:#FBF6EE;--line:#CDBFA6;--wire:#7E8C80;--live:#C2620F;--live-soft:#F7DDBE;--blue:#2F6FB0;--blue-ink:#1F4E80;--blue-soft:#DCE8F5;--on:#12855A;--on-soft:#D3EEDF;--stop:#B8322A;--stop-soft:#F6D5CF';
const f1=v=>(+v).toFixed(1);
/* parts:[{svg, box:[x,y,w,h], vb:'x y w h' (اختياري: جزء من الرسم), tips:[[x,y,w,h,نص]] بإحداثيات الرسم الأصلي}] ; rt: تلميحات بإحداثيات الإطار ; extra: عناصر إضافية */
function art(o){let s=`<svg viewBox="0 0 360 320" role="img" aria-label="${o.aria||''}" style="font-family:var(--font);${V}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="150" fill="${o.bg||'#DDEFE6'}"/>`;
 (o.parts||[]).forEach(p=>{let svg=p.svg;const m=/viewBox="([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)"/.exec(svg);
  const vb=(p.vb||m.slice(1,5).join(' ')).split(/[\s,]+/).map(Number);const [vx,vy,vw,vh]=vb;const b=p.box;
  const k=Math.min(b[2]/vw,b[3]/vh),ox=b[0]+(b[2]-vw*k)/2,oy=b[1]+(b[3]-vh*k)/2;
  svg=svg.replace(/viewBox="[^"]*"/,`viewBox="${vb.join(' ')}"`).replace(/<svg\b/,`<svg x="${f1(ox)}" y="${f1(oy)}" width="${f1(vw*k)}" height="${f1(vh*k)}" preserveAspectRatio="xMidYMid meet" overflow="hidden"`);
  svg=svg.replace(/<svg\b([^>]*?)>/,(a,g)=>/style=/.test(g)?a:`<svg${g} style="width:${f1(vw*k)}px;height:${f1(vh*k)}px">`);
  s+=svg;
  (p.tips||[]).forEach(([x,y,w,h,t])=>{s+=`<rect x="${f1(ox+(x-vx)*k)}" y="${f1(oy+(y-vy)*k)}" width="${f1(w*k)}" height="${f1(h*k)}" rx="5" fill="transparent" data-tip="${t}"/>`})});
 (o.rt||[]).forEach(([x,y,w,h,t])=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="transparent" data-tip="${t}"/>`});
 return s+(o.extra||'')+'</svg>'}
/* نص عربي في الإطار */
const L=(x,y,t,fs,w,col)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs||13}" fill="${col||'#2C4A40'}"${w?` font-weight="${w}"`:''}${/[0-9A-Za-z]/.test(t)?' direction="rtl"':''}>${t}</text>`;
return {art,L,V};
})()/*DRA-END*/),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة السادسة: مخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية',ref:'ص 127–128',
   q:'ماذا ستستطيع أن ترسم في نهاية هذه الوحدة؟',
   art:DRA.art({aria:'دائرة بدء محرك تيار مستمر يساراً ودائرة بدء محرك حثي ثلاثي الأوجه يميناً',bg:'#E4ECF6',
    parts:[{svg:dcStartSVG({kind:'var',main:false,pos:0}),box:[22,40,150,200],tips:[[60,10,240,240,'دائرة بدء محرك ⟦DC⟧ توازٍ: مقاومة بدء على التوالي مع العضو الدوار (الدرس الأول من هذه الوحدة).']]},
           ],
    rt:[[196,40,140,200,'محرك حثي ثلاثي الأوجه ⟦M 3~⟧: يبدأ بمقاومة على التوالي مع كل وجه، أو نجمة ثم مثلث، أو بمقاومات في العضو الدوار (الدرس الثاني).']],
    extra:`<g stroke="#2C4A40" stroke-width="2.4" fill="none">${[230,262,294].map((x,i)=>`<path d="M${x} 56V${120}"/><rect x="${x-7}" y="120" width="14" height="40" fill="#FBF6EE"/><path d="M${x} 160V178L262 196"/>`).join('')}</g><circle cx="262" cy="212" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.6"/><text x="262" y="210" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">M</text><text x="262" y="224" text-anchor="middle" font-size="10" fill="#2C4A40">3~</text>`+['L1','L2','L3'].map((l,i)=>`<text x="${230+32*i}" y="50" text-anchor="middle" font-size="11" fill="#2C4A40">${l}</text>`).join('')+DRA.L(97,262,'محركات التيار المستمر',12.5,700)+DRA.L(261,262,'المحركات الحثية',12.5,700)+DRA.L(180,292,'بدء الحركة والتحكم في السرعة',14,700)}),
   cap:'الوحدة تدرس نوعين من المحركات.<br><b>مرّر المؤشر على كل رسم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[{predict:{q:'الوحدة تتكلم عن «بدء الحركة» و«التحكم في السرعة». لأي نوعين من المحركات؟',opts:[
     ['المحركات أحادية الوجه ومحركات الخطوة',false,'لم تذكرهما أهداف الوحدة.'],
     ['محركات التيار المستمر والمحركات الحثية ثلاثية الأوجه',true,'هذا نص الهدف العام للوحدة (ص 128).'],
     ['المولدات والمحولات',false,'هذه موضوع الوحدة السابعة (نظم القوى وحمايتها).']]}}],
   body:[
    {book:'<p><b>الهدف العام للوحدة:</b> معرفة مخططات دوائر بدء الحركة والتحكم في سرعة محركات التيار المستمر والمحركات الحثية ثلاثية الأوجه.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم دوائر بدء الحركة للمحركات الكهربائية.</li><li>أن يتمكن المتدرب من رسم دوائر التحكم في سرعة المحركات الكهربائية.</li></ol>',ref:'ص 128'},
    {tip:'<p>الوحدة ثلاثة دروس: (1) محركات التيار المستمر: البدء والسرعة وعكس الاتجاه، (2) المحرك الحثي ثلاثي الأوجه: طرق البدء وعكس الاتجاه، (3) تمارين رسم. في كل درس: اقرأ الشكل، ثم جرّبه في «المختبر»، ثم ارسمه خطوة بخطوة في «الأمثلة المحلولة».</p>',title:'كيف تسير الوحدة؟'},
    {title:'مختبر مصغّر: هل فهمت الأهداف؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اضغط «صح» أو «خطأ» لكل عبارة.',items:[
     ['الوحدة تطلب أن ترسم دوائر بدء الحركة للمحركات الكهربائية.',true,'الهدف التفصيلي الأول (ص 128).'],
     ['الوحدة تدرس حماية المحولات من التسرب الأرضي.',false,'هذا في الوحدة السابعة. الوحدة السادسة عن البدء والتحكم في السرعة.'],
     ['الكتاب يحدد الزمن المتوقع لهذه الوحدة.',false,'الوقت المتوقع والوسائل غير مذكورة في الكتاب.']]})}
   ]},

  {st:2,short:'6-1 مقدمة',title:'6-1 مقدمة: كيف تُغيَّر سرعة الدوران؟',ref:'ص 129',
   q:'سيارة تغيّر سرعتها بعلبة التروس… فهل المحرك الكهربائي يحتاج تروساً ليغيّر سرعته؟',
   art:DRA.art({aria:'يساراً مسننان متعشقان (طريقة ميكانيكية)، ويميناً دائرة محرك تيار مستمر بمنظم مجال (طريقة كهربائية)',bg:'#F7DCC8',
    parts:[{svg:dcSpeedSVG({m:'field',p:0.3}),box:[176,70,170,110],tips:[[262,10,72,30,'منظم المجال: مقاومة متغيرة في دائرة ملف المجال. بتحريكها تتغير السرعة كهربائياً بلا تروس.']]}],
    extra:`<g data-tip="مجموعة مسننات: تُركّب في المحرك لتغيير السرعة بطريقة ميكانيكية. قد تكون غير قابلة للضبط أو قابلة للضبط بشكل تدريجي."><circle cx="78" cy="130" r="34" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-dasharray="8 5"/><circle cx="78" cy="130" r="8" fill="#2C4A40"/><circle cx="128" cy="160" r="22" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-dasharray="6 4"/><circle cx="128" cy="160" r="6" fill="#2C4A40"/></g>`+DRA.L(95,222,'طريقة ميكانيكية',13,700)+DRA.L(95,240,'مجموعة مسننات',12)+DRA.L(262,222,'طريقة كهربائية',13,700)+DRA.L(262,240,'بلا مسننات',12)+DRA.L(180,290,'طريقتان لتغيير السرعة',14,700)}),
   cap:'<b>مرّر المؤشر على المسننات ومنظم المجال (أو المسها في الجوال) لتعرف معناهما.</b>',
   side:[{predict:{q:'حسب الكتاب، بأي طريقة يمكن تغيير سرعة الدوران في الآلات الكهربائية؟',opts:[
     ['بطرق ميكانيكية فقط',false,'الكتاب يذكر الطرق الكهربائية أيضاً، وهي موضوع الوحدة.'],
     ['بطرق كهربائية فقط',false,'الكتاب يذكر أيضاً الطريقة الميكانيكية بمجموعة مسننات.'],
     ['بطرق ميكانيكية أو كهربائية',true,'ص 129: «يمكن أن يتم في جميع الآلات الكهربائية بطرق ميكانيكية أو كهربائية».']]}}],
   body:[
    {book:'<p>تغيير سرعة الدوران أو التحكم فيها يمكن أن يتم في جميع الآلات الكهربائية بطرق ميكانيكية أو كهربائية. يتم تغيير سرعة الدوران بطريقة ميكانيكية بتركيب مجموعة مسننات في المحرك تكون غير قابلة للضبط أو قابلة للضبط بشكل تدريجي. الشروط المطلوبة من المحرك عند ضبط سرعة الدوران بالطرق الكهربائية تتعلق بمجال سرعة الدوران التي يجب أن يغطيها المحرك و اعتماد سرعة دوران المحرك على التحميل.</p>',ref:'ص 129'},
    {tip:'<p>عند اختيار طريقة كهربائية نسأل سؤالين: <b>ما مدى السرعات المطلوب؟</b> (من أقل سرعة إلى أعلى سرعة) و<b>هل تتغير السرعة كثيراً إذا تغير الحمل؟</b> هذا معنى «مجال سرعة الدوران» و«اعتماد سرعة الدوران على التحميل».</p>',title:'معنى الشرطين'},
    {add:'<p>مثال: مروحة سقف تكفيها سرعات قليلة ثابتة، أما رافعة أو مخرطة فتحتاج مدى واسعاً من السرعات وسرعة لا تهبط كثيراً عند زيادة الحمل.</p>',title:'من الواقع'},
    {title:'مختبر مصغّر: ميكانيكية أم كهربائية؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل طريقة لتغيير السرعة.',cats:['ميكانيكية','كهربائية'],items:[
     ['تركيب مجموعة مسننات قابلة للضبط بشكل تدريجي في المحرك.',0,'المسننات طريقة ميكانيكية (ص 129).'],
     ['ضبط منظم المجال في محرك تيار مستمر.',1,'تغيير الفيض المغناطيسي طريقة كهربائية (ص 131).'],
     ['توصيل مقاومة على التوالي مع دائرة العضو الدوار.',1,'طريقة التحكم بالمقاومة (ص 131).'],
     ['مسننات غير قابلة للضبط بين المحرك والحمل.',0,'ما زالت طريقة ميكانيكية، لكن نسبتها ثابتة.']]})}
   ]},

  {st:3,short:'مقاومة البدء',title:'6-2 دوائر بدء الحركة لمحركات التيار المستمر: مقاومة البدء',ref:'ص 129–131',
   q:'مقاومة ملفات العضو الدوار صغيرة جداً… فماذا يحدث لو وصلنا المحرك مباشرة بالجهد الكامل وهو ساكن؟',
   art:DRA.art({aria:'الشكل 6-1-أ: محرك تيار مستمر توازٍ مع مقاومة بدء متغيرة على التوالي مع العضو الدوار',
    parts:[{svg:dcStartSVG({kind:'var',main:false,pos:0,arrow:true}),box:[34,18,292,250],tips:[
     [96,30,66,40,'المفتاح الرئيس (مفتاح القدرة) ثنائي القطب. لحظة إغلاقه يمر أكبر تيار: تيار البدء.'],
     [36,16,30,52,'ذراع تشغيل المفتاح، والسهم المزدوج ⇑ يدل على اتجاه التشغيل.'],
     [182,104,24,54,'مقاومة البدء المتغيرة: على التوالي مع العضو الدوار فقط. تُنقص كلما ارتفعت سرعة الدوران.'],
     [198,80,30,36,'المنزلق: يأتي من السلك العلوي، وتحريكه إلى أسفل يُخرج جزءاً من المقاومة.'],
     [232,100,18,54,'السهم إلى أسفل في الشكل (6-2-أ): نحرك المنزلق نحو الأسفل كلما زادت السرعة.'],
     [170,186,40,44,'العضو الدوار (عضو الاستنتاج) ⟦M⟧ بفرشاتيه: مقاومة ملفاته صغيرة جداً.'],
     [236,194,46,22,'ملف المجال (المستطيل الأسود): على التوازي، يأخذ جهد المصدر كاملاً فلا تمر فيه مقاومة البدء.']]}],
    extra:DRA.L(180,300,'الشكل (6-1-أ) مع سهم الشكل (6-2-أ)',13,700)}),
   cap:'مقاومة البدء المتغيرة (الشكلان <span class="ltr">(6-1-أ)</span> و<span class="ltr">(6-2-أ)</span>).<br><b>مرّر المؤشر على المفتاح والمقاومة والمنزلق والمحرك وملف المجال (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'لماذا توصل مقاومة البدء على التوالي مع عضو الاستنتاج؟',opts:[
     ['لتقوية المجال المغناطيسي عند البدء',false,'المقاومة ليست في دائرة المجال أصلاً؛ ملف المجال موصول مباشرة على المصدر.'],
     ['لأن مقاومة ملفاته صغيرة جداً فقد يمر تيار زائد يحرقها',true,'ص 129: «تكون مقاومة ملفات عضو الاستنتاج صغيرة جداً وبالتالي فإن تياراً زائداً من المحتمل أن يمر ويمكن أن تحترق الملفات».'],
     ['لعكس اتجاه الدوران',false,'عكس الاتجاه يكون بعكس قطبية العضو (المحطة 5).']]}}],
   body:[
    {book:'<p>في محركات التيار المستمر تكون مقاومة ملفات عضو الاستنتاج صغيرة جداً وبالتالي فإن تياراً زائداً من المحتمل أن يمر ويمكن أن تحترق الملفات ولمنع تلك المشكلة فإنه توصل مقاومة على التوالٍ مع ملفات عضو الاستنتاج ثم يطبق الجهد الطرفي ويتم إنقاص تلك المقاومة كلما ارتفعت سرعة الدوران وتسمى تلك المقاومة بمقاومة البدء ويسمى التيار الأقصى الذي يمر بمجرد إغلاق مفتاح القدرة للمحرك بتيار البدء. ومقاومة البدء يمكن أن تكون متغيرة كما في الشكل (6-1-أ) أو تكون مقاومة ثابتة كما في الشكل (6-1-ب).</p>',ref:'ص 129'},
    {book:'<p>وأثناء زيادة سرعة الدوران تقلل المقاومة المتغيرة بعد زيادة سرعة الدوران تقصر مقاومة بدء التشغيل كما في الشكل (6-2-أ و ب).</p>',ref:'ص 130'},
    {tip:String.raw`<p>الجملة السابقة مختصرة، ومعناها: <b>المقاومة المتغيرة</b> تُقلَّل تدريجياً أثناء زيادة السرعة (يتحرك المنزلق إلى أسفل)، و<b>المقاومة الثابتة</b> تُقصَر مرة واحدة بإغلاق تلامس موصول على التوازي معها بعد أن تزيد السرعة (الشكل 6-1-ب و6-2-ب).</p><p>لماذا يصغر التيار مع السرعة؟ العضو الدائر يولّد جهداً عكسياً \(E\) يعاكس جهد المصدر ويزيد مع السرعة. عند السكون \(E = 0\):</p><div class="eq">$$I = \frac{V - E}{R_a + R_s}$$</div><p>(\(R_s\) مقاومة البدء، و\(R_a\) مقاومة ملفات العضو.) فعند السكون لا يحد التيار إلا المقاومة، ثم يكبر \(E\) مع السرعة فيصغر التيار ونستطيع إخراج المقاومة.</p>`,title:'المتغيرة والثابتة، ولماذا ننتظر السرعة؟'},
    {watch:'<p>لا تُخرج مقاومة البدء كلها والمحرك ما زال بطيئاً: الجهد العكسي ما زال صغيراً فيقفز التيار. وملف المجال لا يوضع بعد مقاومة البدء: يجب أن يكون المجال كاملاً عند البدء.</p>'},
    {title:'مختبر مصغّر: أنقص المقاومة في الوقت المناسب',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر سرعة المحرك الحالية، ثم الجزء الباقي من مقاومة البدء، واقرأ التيار. الرسم هو الشكل <span class="ltr">(6-1-أ)</span>.',
     predict:{q:'المحرك ساكن، وأخرجنا مقاومة البدء كلها ثم أغلقنا المفتاح. كيف يكون التيار؟',opts:[
      ['قريباً من تيار الحمل',false,'عند السكون لا يوجد جهد عكسي، فلا يحد التيار إلا مقاومة ملفات العضو الصغيرة.'],
      ['كبيراً جداً، أضعاف تيار الحمل',true,'لهذا نضع مقاومة البدء ونخرجها تدريجياً مع ارتفاع السرعة.'],
      ['صفراً لأن المحرك ساكن',false,'السكون لا يمنع التيار؛ بل يجعله أكبر ما يكون.']]},
     ins:[{k:'n',l:'سرعة المحرك الآن (من المقننة)',seg:[[0,'ساكن'],[0.25,'<span class="ltr">25 %</span>'],[0.5,'<span class="ltr">50 %</span>'],[0.75,'<span class="ltr">75 %</span>'],[0.95,'<span class="ltr">95 %</span>']],v:0},
          {k:'r',l:'الجزء الباقي من مقاومة البدء',seg:[[1,'كلها'],[0.75,'<span class="ltr">75 %</span>'],[0.5,'<span class="ltr">50 %</span>'],[0.25,'<span class="ltr">25 %</span>'],[0,'خرجت كلها']],v:1}],
     tp:{id:'u6-l1',defs:DC_DEFS()},
     calc:(s,v,B)=>{const kp=Math.max(v.V-v.IL*v.Ra,0.05*v.V)/v.nr,E=kp*s.n*v.nr,R=v.Ra+v.Rst*s.r,I=Math.max(0,(v.V-E)/R),k=I/v.IL;
      return {pic:`<div style="max-width:300px;margin:auto">${dcStartSVG({kind:'var',main:true,pos:1-s.r})}</div>`,
       facts:[['الجهد العكسي E',DCML.fm(B,E,0)+' V'],['المقاومة في الدائرة',DCML.fm(B,R,2)+' Ω'],['التيار I',DCML.fm(B,I,0)+' A',k>2.5?'bad':'hi'],['التيار ÷ تيار الحمل',DCML.fm(B,k,1),k>2.5?'bad':'']],
       bars:[{l:'التيار بالنسبة لتيار الحمل',v:k,max:Math.max(3,Math.min(k,40)),txt:DCML.fm(B,k,1)+' ×',col:k>2.5?'--stop':'--on'}],
       msg:k>2.5?'التيار كبير جداً: لا تُنقص المقاومة أكثر حتى ترتفع السرعة.':s.r>0&&s.n>=0.75?'السرعة ارتفعت والتيار معتدل: يمكنك الآن إنقاص المقاومة خطوة أخرى.':'التيار معتدل.',cls:k>2.5?'bad':''}}})}
   ]},

  {st:4,short:'التحكم في السرعة',title:'طرق التحكم في سرعة محرك التيار المستمر',ref:'ص 131–133',
   q:'تريد المحرك أسرع من سرعته الاسمية مرة، وأبطأ منها مرة أخرى… هل تستعمل الطريقة نفسها؟',
   art:DRA.art({aria:'الشكل 6-5: دائرة العضو الدوار ودائرة المجال بمنظم مجال',bg:'#E4ECF6',
    parts:[{svg:dcSpeedSVG({m:'field',p:0.3}),box:[18,60,324,172],tips:[
     [24,80,34,26,'مصدر العضو الدوار (بطارية): الخط الطويل الموجب والقصير السالب.'],
     [148,110,46,48,'المحرك ⟦M⟧ بطرفيه ⟦A1⟧ و⟦A2⟧. السهم المنحني يمينه يدل على اتجاه الدوران.'],
     [130,118,18,34,'سهم تيار العضو الدوار.'],
     [234,8,24,34,'مصدر دائرة المجال (منفصل).'],
     [266,14,66,46,'منظم المجال: مقاومة متغيرة على التوالي مع ملف المجال. زيادتها تُضعف المجال فترتفع السرعة فوق الاسمية.'],
     [222,108,72,28,'ملف المجال ⟦F1–F2⟧ (المستطيل الأسود)، والسهم تحته اتجاه تيار المجال.']]}],
    extra:DRA.L(180,262,'الشكل (6-5): إضعاف المجال',14,700)+DRA.L(180,284,'سرعات أكبر من الاسمية',12.5)}),
   cap:'دائرتان منفصلتان: دائرة العضو الدوار ودائرة المجال.<br><b>مرّر المؤشر على المصدرين والمحرك ومنظم المجال وملف المجال (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'زدنا مقاومة منظم المجال في الشكل (6-5). ماذا يحدث للسرعة؟',opts:[
     ['ترتفع فوق السرعة الاسمية',true,'ص 132: إضعاف المجال «للتحكم في سرعات هي أكبر من سرعة الدوران الاسمية».'],
     ['تنخفض تحت السرعة الاسمية',false,'هذا ما تفعله المقاومة على التوالي مع العضو الدوار (6-6)، لا منظم المجال.'],
     ['يتوقف المحرك',false,'إضعاف المجال يزيد السرعة؛ لكن لا نفصل المجال كلياً أبداً.']]}}],
   body:[
    {book:'<p>يمكن تغيير سرعة دوران المحرك الموصل مباشرة بالحمل. ولتغيير سرعة دوران المحرك فإنه من الضروري تغيير الفيض المغناطيسي أو مقاومة التوالي مع العضو الدائر أو جهد عضو الإنتاج. ففي طريقة التحكم عن طريق الفيض المغناطيسي يمكن تغيير الفيض بضبط منظم المجال وفى محرك التوالٍ يتم التحكم في السرعة بتغيير قيمة مقاومة المجال. وفى طريقة التحكم بالمقاومة فإن التحكم في السرعة يتم بتوصيل مقاومة على التوالي مع دائرة عضو الاستنتاج وتستخدم أساساً للتحكم في محرك التوالٍ. وفى طريقة التحكم في الجهد فإن التحكم في السرعة يتم بتغيير الجهد المطبق على ملف عضو الاستنتاج وتوجد طرق أخرى مثل نظام "وارد ليونارد" المستخدم أساساً في المحركات ذات الاستثارة المنفصلة وكذلك طرق التحكم توالي/توازي المستخدمة في محركات التوالي.</p>',ref:'ص 131'},
    {book:'<p>الشكل (6-5) يوضح زيادة سرعة الدوران عن طريق إضعاف المجال للتحكم في سرعات هي أكبر من سرعة الدوران الاسمية.</p>',ref:'ص 132'},
    {book:'<p>الشكل (6-6) يوضح التحكم في سرعة محرك تيار مستمر عن طريق تقليل جهد عضو الإنتاج بتوصيل مقاومات على التوالٍ للتحكم في سرعات هي أقل من سرعة الدوران الاسمية.</p>',ref:'ص 133'},
    {tip:String.raw`<p>العلاقة التي تجمع الطرق الثلاث:</p><div class="eq">$$n = \frac{V - I\,(R_a + R)}{k\,\phi}$$</div><ul><li>إضعاف الفيض \(\phi\) يكبّر السرعة: <b>فوق</b> الاسمية (6-5).</li><li>زيادة المقاومة \(R\) على التوالي، أو تقليل الجهد \(V\) على العضو، يصغّر البسط: <b>تحت</b> الاسمية (6-6).</li></ul>`,title:'لماذا اتجاهان مختلفان؟'},
    {html:`<figure class="fig" style="margin:10px 0"><div class="svgbox" style="max-width:440px;margin-inline:auto">${dcSpeedSVG({m:'arm',p:0.5})}</div><figcaption><b>الشكل <span class="ltr">(6-6)</span></b> التحكم في السرعة بتقليل جهد عضو الإنتاج: الجزء المستعمل من المقاومة (من طرفها الأيسر حتى المنزلق) على التوالي مع العضو. <span class="ref">ص 133</span></figcaption></figure>`},
    {watch:'<p>المقاومة على التوالي مع العضو تحمل تيار العضو كله، فتضيع فيها قدرة على شكل حرارة. ومنظم المجال يحمل تيار المجال الصغير فقط.</p>'},
    {title:'مختبر مصغّر: فوق الاسمية أم تحتها؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الطريقة، ثم حرّك المنزلق، واقرأ السرعة بالنسبة للسرعة الاسمية (الحمل ثابت).',
     predict:{q:'أي الطريقتين تستطيع رفع السرعة فوق الاسمية؟',opts:[
      ['المقاومة على التوالي مع العضو (6-6)',false,'هذه تخفض الجهد الواصل للعضو فتخفض السرعة.'],
      ['إضعاف المجال بمنظم المجال (6-5)',true,'أضعف فيض يعني سرعة أعلى ليتولد الجهد العكسي نفسه.']]},
     ins:[{k:'m',l:'الطريقة',seg:[['field','إضعاف المجال (6-5)'],['arm','مقاومة مع العضو (6-6)']],v:'field'},
          {k:'p',l:'موضع المنزلق (من أقل مقاومة إلى أكبرها)',min:0,max:100,step:10,v:0,u:'%',dp:0}],
     tp:{id:'u6-l1',defs:DC_DEFS()},
     calc:(s,v,B)=>{const p=s.p/100,kp=Math.max(v.V-v.IL*v.Ra,0.05*v.V)/v.nr;let n,I;
      if(s.m==='field'){const ph=1-(1-v.phmin/100)*p;I=v.IL/ph;n=(v.V-I*v.Ra)/(kp*ph)}else{I=v.IL;n=Math.max(0,(v.V-I*(v.Ra+v.Rmax*p))/kp)}
      const r=n/v.nr;return {pic:`<div style="max-width:380px;margin:auto">${dcSpeedSVG({m:s.m,p,on:true})}</div>`,
       facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['السرعة ÷ الاسمية',DCML.fm(B,r*100,0)+' %'],['تيار العضو',DCML.fm(B,I,1)+' A']],
       bars:[{l:'السرعة (الخط الكامل = الاسمية)',v:r,max:2,txt:DCML.fm(B,r*100,0)+' %',col:r>1.02?'--blue':r<0.98?'--live':'--on'}],
       msg:p===0?'المنزلق على أقل مقاومة: السرعة هي الاسمية تقريباً.':s.m==='field'?'ضعف المجال فارتفعت السرعة فوق الاسمية، وزاد تيار العضو لأن الحمل ثابت.':'انخفض الجهد الواصل للعضو فانخفضت السرعة تحت الاسمية.'}}})}
   ]},

  {st:5,short:'عكس الاتجاه',title:'عكس اتجاه دوران محرك التيار المستمر',ref:'ص 131–132',
   q:'بدّلت سلكي التغذية L+ و L− … هل سيدور المحرك في الاتجاه المعاكس؟',
   art:DRA.art({aria:'الشكل 6-3: لوحة أطراف محرك تيار مستمر توازٍ بقنطرتين مائلتين',bg:'#F7DCC8',
    parts:[{svg:dcBoxSVG({br:'63',book:1}),box:[40,16,280,236],tips:[
     [118,62,100,48,'القنطرتان على لوحة الأطراف: في (6-3) مائلتان ⟦A1–E2⟧ و⟦E1–A2⟧، وفي (6-4) أفقيتان ⟦A1–E1⟧ و⟦E2–A2⟧.'],
     [40,160,44,48,'العضو الدوار ⟦M⟧ بين ⟦A1⟧ و⟦A2⟧.'],
     [26,160,22,40,'سهم تيار العضو الدوار.'],
     [152,178,60,24,'ملف المجال بين ⟦E1⟧ و⟦E2⟧ (المستطيل الأسود).'],
     [154,204,56,16,'سهم تيار المجال.']]}],
    extra:DRA.L(180,276,'الشكل (6-3): تبديل الأطراف الخارجية',13.5,700)+DRA.L(180,296,'الاتجاه لا يتغير',12.5)}),
   cap:'لوحة أطراف المحرك والقنطرتان.<br><b>مرّر المؤشر على القنطرتين والمحرك وملف المجال والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'ماذا يحدث لاتجاه الدوران إذا بدّلنا أطراف التوصيل الخارجية؟',opts:[
     ['ينعكس الاتجاه',false,'تبديل السلكين يعكس تيار العضو وتيار المجال معاً، فيبقى اتجاه أحدهما بالنسبة للآخر كما هو.'],
     ['يتوقف المحرك',false,'المحرك يستمر في الدوران.'],
     ['يظل يدور في نفس الاتجاه السابق',true,'ص 131: «فإنه يظل يدور في نفس الاتجاه السابق كما في الشكل (6-3)».']]}}],
   body:[
    {book:'<p>إذا بدلت أطراف التوصيل الخارجية لمحرك تيار مستمر فإنه يظل يدور في نفس الاتجاه السابق كما في الشكل (6-3). يمكن عكس اتجاه الدوران فقط عن طريق تغيير قطبية عضو الإنتاج الشكل (6-4).</p>',ref:'ص 131'},
    {tip:'<p>اتجاه الدوران يحدده اتجاه تيار العضو الدوار <b>بالنسبة</b> لاتجاه تيار المجال. تبديل سلكي التغذية يعكس التيارين معاً فيبقى الاتجاه. أما إذا انعكس أحدهما فقط فينعكس الدوران. وكلمة «فقط» في الكتاب مقابل تبديل الأطراف الخارجية: عكس توصيل المجال وحده يعكس الدوران أيضاً (كما في الوحدة الخامسة)، لكن المعتاد عكس العضو.</p>',title:'القاعدة'},
    {watch:'<p>في الشكلين (6-3) و(6-4) لا يتفق السهمان مع التوصيل المرسوم: السهمان يقولان إن تيار العضو هو الذي انعكس في (6-4)، بينما التوصيل المرسوم في (6-4) يعكس تيار المجال ويبقي تيار العضو. النتيجة واحدة: انعكس أحد التيارين بالنسبة للآخر فانعكس الدوران. في المختبر المصغّر أدناه يُحسب السهمان من التوصيل.</p>',fix:true},
    {title:'مختبر مصغّر: بدّل وانظر',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر القنطرتين، وبدّل سلكي التغذية، وانظر إلى السهمين واتجاه الدوران (منطق فقط بلا أرقام).',
     ins:[{k:'br',l:'القناطر على لوحة الأطراف',seg:[['63','مائلتان (6-3)'],['64','أفقيتان (6-4)']],v:'63'},
          {k:'sw',l:'بدّل سلكي التغذية',sw:true,v:0,on:'السلكان مبدّلان: L+ يسار',off:'التوصيل الأصلي: L− يسار'}],
     calc:(s,v,B)=>{const pA1=s.sw?1:0,sA=(1-pA1)>pA1?1:-1,sF=(s.br==='63'?1:-1)*(s.sw?-1:1),d=sA*sF;
      return {pic:`<div style="max-width:300px;margin:auto">${dcBoxSVG({br:s.br,swap:!!s.sw,on:true,lab:1})}</div>`,
       facts:[['تيار العضو',sA>0?'↑':'↓'],['تيار المجال',sF>0?'←':'→'],['اتجاه الدوران',d>0?'⟳':'⟲','hi']],
       msg:s.br==='63'?(s.sw?'انعكس التياران معاً: بقي الاتجاه كما هو (الشكل 6-3).':'التوصيل الأصلي. بدّل السلكين وقارن.'):'في قناطر (6-4) انعكس أحد التيارين بالنسبة للآخر، فانعكس الدوران. جرّب تبديل السلكين هنا أيضاً.'}}})}
   ]},

  {recap:[
   'مقاومة البدء توصل على التوالي مع عضو الاستنتاج لأن مقاومة ملفاته صغيرة جداً، وتُنقص كلما ارتفعت السرعة (ص 129).',
   'المقاومة المتغيرة تُقلَّل تدريجياً (6-1-أ)، والثابتة تُقصر بتلامس موازٍ لها بعد ارتفاع السرعة (6-1-ب).',
   'إضعاف المجال يرفع السرعة فوق الاسمية (6-5)، والمقاومة على التوالي مع العضو تخفضها تحتها (6-6).',
   'تبديل سلكي التغذية لا يعكس الدوران (6-3)؛ عكس قطبية العضو وحده يعكسه (6-4).']}
],
 theory:[
  {h:'الوحدة السادسة: مخططات دوائر البدء والتحكم في سرعة المحركات الكهربائية',ref:'ص 127–128',html:`<p><b>الهدف العام للوحدة:</b> معرفة مخططات دوائر بدء الحركة والتحكم في سرعة محركات التيار المستمر والمحركات الحثية ثلاثية الأوجه.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم دوائر بدء الحركة للمحركات الكهربائية.</li><li>أن يتمكن المتدرب من رسم دوائر التحكم في سرعة المحركات الكهربائية.</li></ol><p class="sub">الوقت المتوقع والوسائل غير مذكورة في الكتاب.</p>`},
  {h:'6-1 مقدمه',ref:'ص 129',html:`<p>تغيير سرعة الدوران أو التحكم فيها يمكن أن يتم في جميع الآلات الكهربائية بطرق ميكانيكية أو كهربائية. يتم تغيير سرعة الدوران بطريقة ميكانيكية بتركيب مجموعة مسننات في المحرك تكون غير قابلة للضبط أو قابلة للضبط بشكل تدريجي. الشروط المطلوبة من المحرك عند ضبط سرعة الدوران بالطرق الكهربائية تتعلق بمجال سرعة الدوران التي يجب أن يغطيها المحرك و اعتماد سرعة دوران المحرك على التحميل.</p>`},
  {h:'6-2 دوائر بدء الحركة والتحكم في سرعة محركات التيار المستمر',ref:'ص 129',html:`<p>في محركات التيار المستمر تكون مقاومة ملفات عضو الاستنتاج صغيرة جداً وبالتالي فإن تياراً زائداً من المحتمل أن يمر ويمكن أن تحترق الملفات ولمنع تلك المشكلة فإنه توصل مقاومة على التوالٍ مع ملفات عضو الاستنتاج ثم يطبق الجهد الطرفي ويتم إنقاص تلك المقاومة كلما ارتفعت سرعة الدوران وتسمى تلك المقاومة بمقاومة البدء ويسمى التيار الأقصى الذي يمر بمجرد إغلاق مفتاح القدرة للمحرك بتيار البدء. ومقاومة البدء يمكن أن تكون متغيرة كما في الشكل (6-1-أ) أو تكون مقاومة ثابتة كما في الشكل (6-1-ب).</p>`},
  {note:String.raw`${ADD}لماذا يكون تيار البدء كبيراً؟ عندما يدور العضو الدوار يتولد فيه جهد عكسي \(E\) يعاكس جهد المصدر، ويزيد مع السرعة. عند السكون \(E = 0\)، فلا يحد التيار إلا المقاومة:
  $$I = \frac{V - E}{R_a + R_{\text{بدء}}}$$
  عند السكون وبلا مقاومة بدء يصبح \(I = V/R_a\) كبيراً جداً لأن \(R_a\) صغيرة. ومع ارتفاع السرعة يكبر \(E\) فيصغر التيار، فنستطيع إنقاص مقاومة البدء خطوة بعد خطوة. في المختبر ترى ذلك بأرقام توضيحية.`},
  {fig:lt('(6-1-أ)'),ref:'ص 129',caption:'بدء تشغيل محركات التيار المستمر عن طريق مقاومة متغيرة. المقاومة على التوالي مع العضو الدوار فقط، وملف المجال (المستطيل الأسود) على التوازي مع المقاومة والعضو معاً. الطرف العلوي للمقاومة حر، والسهم المنزلق يأتي من السلك العلوي.',draw:()=>box(dcStartSVG({kind:'var',main:false,pos:0}),400)},
  {fig:lt('(6-1-ب)'),ref:'ص 130',caption:'بدء تشغيل محركات التيار المستمر عن طريق مقاومة ثابتة، وعلى التوازي معها تلامس مفتوح يقصرها عند إغلاقه.',draw:()=>box(dcStartSVG({kind:'fix',main:false,short:false}),400)},
  {html:`<p>وأثناء زيادة سرعة الدوران تقلل المقاومة المتغيرة بعد زيادة سرعة الدوران تقصر مقاومة بدء التشغيل كما في الشكل (6-2-أ و ب).</p><div class="callout">${ADD}الجملة مختصرة في الكتاب، ومعناها: <b>المقاومة المتغيرة</b> تُقلَّل تدريجياً أثناء زيادة السرعة (يتحرك المنزلق إلى أسفل كما يدل السهم في (6-2-أ))، و<b>المقاومة الثابتة</b> تُقصَر بإغلاق التلامس بعد أن تزيد السرعة (السهم ⇑ بجانب التلامس في (6-2-ب)).</div>`},
  {fig:lt('(6-2-أ)'),ref:'ص 130',caption:'تغيير المقاومة وعلاقته بسرعة الدوران: المفتاح مغلق، والسهم بجانب المقاومة المتغيرة يشير إلى أسفل (إنقاص المقاومة مع زيادة السرعة).',draw:()=>box(dcStartSVG({kind:'var',main:false,closed:true,pos:0.5,arrow:true,noHandle:true}),400)},
  {fig:lt('(6-2-ب)'),ref:'ص 131',caption:'تغيير المقاومة وعلاقته بسرعة الدوران: سهم ⇑ بجانب تلامس التقصير (يُغلق التلامس فتُقصر المقاومة عند ارتفاع السرعة).',draw:()=>box(dcStartSVG({kind:'fix',main:false,short:false,arrow:true}),400)},
  {h:'طرق التحكم في سرعة محرك التيار المستمر',ref:'ص 131',html:`<p>يمكن تغيير سرعة دوران المحرك الموصل مباشرة بالحمل. ولتغيير سرعة دوران المحرك فإنه من الضروري تغيير الفيض المغناطيسي أو مقاومة التوالي مع العضو الدائر أو جهد عضو الإنتاج. ففي طريقة التحكم عن طريق الفيض المغناطيسي يمكن تغيير الفيض بضبط منظم المجال وفى محرك التوالٍ يتم التحكم في السرعة بتغيير قيمة مقاومة المجال. وفى طريقة التحكم بالمقاومة فإن التحكم في السرعة يتم بتوصيل مقاومة على التوالي مع دائرة عضو الاستنتاج وتستخدم أساساً للتحكم في محرك التوالٍ. وفى طريقة التحكم في الجهد فإن التحكم في السرعة يتم بتغيير الجهد المطبق على ملف عضو الاستنتاج وتوجد طرق أخرى مثل نظام "وارد ليونارد" المستخدم أساساً في المحركات ذات الاستثارة المنفصلة وكذلك طرق التحكم توالي/توازي المستخدمة في محركات التوالي.</p>`},
  {note:String.raw`${ADD}العلاقة التي تجمع الطرق الثلاث: $$n = \frac{V - I\,(R_a + R)}{k\,\phi}$$ <ul><li><b>إضعاف الفيض</b> \(\phi\) (زيادة مقاومة منظم المجال) يرفع السرعة <b>فوق</b> المقننة — الشكل (6-5).</li><li><b>مقاومة على التوالي</b> \(R\) أو <b>تقليل الجهد</b> \(V\) على العضو يخفض السرعة <b>تحت</b> المقننة — الشكل (6-6).</li></ul>`},
  {h:'عكس اتجاه الدوران',ref:'ص 131',html:`<p>إذا بدلت أطراف التوصيل الخارجية لمحرك تيار مستمر فإنه يظل يدور في نفس الاتجاه السابق كما في الشكل (6-3). يمكن عكس اتجاه الدوران فقط عن طريق تغيير قطبية عضو الإنتاج الشكل (6-4).</p>`},
  {fig:'(6-3)',ref:'ص 132',caption:'تبديل الأطراف الخارجية لمحرك تيار مستمر: لوحة الأطراف بقنطرتين مائلتين A1–E2 وE1–A2. السهمان كما رُسما في الكتاب.',draw:()=>box(dcBoxSVG({br:'63',book:1}),330)},
  {fig:'(6-4)',ref:'ص 132',caption:'عكس اتجاه دوران محرك تيار مستمر عن طريق تغيير قطبية عضو الإنتاج: قنطرتان أفقيتان A1–E1 وE2–A2. السهمان كما رُسما في الكتاب.',draw:()=>box(dcBoxSVG({br:'64',book:1}),330)},
  {note:`${ADD}اتجاه الدوران يحدده اتجاه تيار العضو الدوار <b>بالنسبة</b> لاتجاه تيار المجال. تبديل سلكي التغذية يعكس التيارين معاً فيبقى الاتجاه. أما إذا انعكس أحدهما فقط فينعكس الدوران. وكلمة «فقط» في الكتاب مقابل تبديل الأطراف الخارجية: عكس توصيل المجال وحده يعكس الدوران أيضاً (كما في الوحدة الخامسة)، لكن المعتاد عكس العضو.`},
  {html:`<p>الشكل (6-5) يوضح زيادة سرعة الدوران عن طريق إضعاف المجال للتحكم في سرعات هي أكبر من سرعة الدوران الاسمية.</p>`},
  {fig:'(6-5)',ref:'ص 132',caption:'التحكم في سرعة محرك تيار مستمر عن طريق إضعاف المجال: دائرة العضو (بطارية والمحرك A1–A2)، ودائرة المجال (بطارية ومقاومة متغيرة = منظم المجال، وملف المجال F1–F2).',draw:()=>box(dcSpeedSVG({m:'field',p:0.3}),440)},
  {html:`<p>الشكل (6-6) يوضح التحكم في سرعة محرك تيار مستمر عن طريق تقليل جهد عضو الإنتاج بتوصيل مقاومات على التوالٍ للتحكم في سرعات هي أقل من سرعة الدوران الاسمية.</p>`},
  {fig:'(6-6)',ref:'ص 133',caption:'التحكم في سرعة محرك تيار مستمر عن طريق تقليل جهد عضو الإنتاج: مقاومة متغيرة في دائرة العضو، الجزء المستعمل منها (من طرفها الأيسر حتى المنزلق) على التوالي مع العضو. المجال منفصل F1–F2.',draw:()=>box(dcSpeedSVG({m:'arm',p:0.5}),440)},
  {err:`<div class="fixnote"><ul style="margin:4px 0 0;padding-inline-start:18px"><li>في الشكلين (6-3) و(6-4) لا يتفق السهمان مع التوصيل المرسوم: السهمان يقولان إن تيار العضو هو الذي انعكس في (6-4)، بينما التوصيل المرسوم في (6-4) يعكس تيار المجال (قنطرة A1–E1 بدل A1–E2) ويبقي تيار العضو. النتيجة واحدة في الحالتين: انعكس أحد التيارين بالنسبة للآخر فانعكس الدوران. في المختبر يُحسب السهمان من التوصيل.</li><li>الشكل (6-3) لا يُظهر تبديل الأطراف نفسه؛ في المختبر يمكنك تبديل L+ و L− لترى أن الاتجاه لا يتغير.</li></ul></div>`}
 ],
 lab:(el)=>dcLab(el),
 examples:[
  {title:'مثال مرسوم: الشكل (6-1-أ) خطوة بخطوة',ref:'ص 129',q:`<p>ارسم دائرة بدء محرك التيار المستمر التوازي بمقاومة بدء متغيرة كما في الشكل (6-1-أ). (تُكشف الخطوط خطوة بعد خطوة، وما رُسم يبقى.)</p>`,solve:()=>drawSteps('0 0 320 262','رسم الشكل 6-1-أ',ex61Layers('var'),380)},
  {title:'مثال مرسوم: الشكل (6-1-ب) ومقارنته بـ (6-1-أ)',ref:'ص 130',q:`<p>ارسم الدائرة نفسها بمقاومة بدء ثابتة وتلامس تقصير كما في الشكل (6-1-ب)، ثم قارن بين الطريقتين.</p>`,solve:()=>drawSteps('0 0 320 262','رسم الشكل 6-1-ب',ex61Layers('fix'),380).concat([{t:`<b>المقارنة:</b> في (6-1-أ) تُقلَّل المقاومة تدريجياً بتحريك المنزلق، فيتغير التيار على مراحل صغيرة. في (6-1-ب) تبقى المقاومة كاملة حتى ترتفع السرعة ثم تُقصر مرة واحدة بإغلاق التلامس. في الحالتين ملف المجال موصول مباشرة على جهد المصدر (لا تمر فيه مقاومة البدء) حتى يكون المجال كاملاً عند البدء.`,final:true}]).map((x,i,a)=>Object.assign(x,{final:i===a.length-1}))}
 ],
 quiz:[
  {q:'لماذا توصل مقاومة البدء على التوالي مع عضو الاستنتاج في محرك التيار المستمر؟',o:['لزيادة السرعة','لأن مقاومة ملفاته صغيرة جداً فيمر تيار زائد قد يحرقها','لعكس اتجاه الدوران','لتقوية المجال'],c:1,e:'ص 129: مقاومة ملفات عضو الاستنتاج صغيرة جداً، فبدون مقاومة البدء يمر تيار بدء كبير.'},
  {q:'متى تُنقص مقاومة البدء؟',o:['قبل إغلاق المفتاح','كلما ارتفعت سرعة الدوران','عند زيادة الحمل فقط','لا تُنقص أبداً'],c:1,e:'ص 129: يتم إنقاص تلك المقاومة كلما ارتفعت سرعة الدوران.'},
  {q:'في الشكل (6-1-ب)، ما الذي يقصر مقاومة البدء الثابتة؟',o:['ملف المجال','تلامس مفتوح موصول على التوازي معها يُغلق','المفتاح الرئيس','عكس القطبية'],c:1,e:'التلامس NO على التوازي مع المقاومة؛ إغلاقه بعد ارتفاع السرعة يقصرها.'},
  {q:'إضعاف المجال (الشكل 6-5) يجعل سرعة المحرك:',o:['أقل من الاسمية','أكبر من الاسمية','صفراً','لا تتغير'],c:1,e:'ص 132: إضعاف المجال للتحكم في سرعات أكبر من سرعة الدوران الاسمية.'},
  {q:'توصيل مقاومات على التوالي مع العضو (الشكل 6-6) يستخدم للتحكم في سرعات:',o:['أكبر من الاسمية','أقل من الاسمية','تساوي التزامنية','عكسية'],c:1,e:'ص 133: تقليل جهد عضو الإنتاج للتحكم في سرعات أقل من الاسمية.'},
  {q:'إذا بدلنا سلكي التغذية L+ و L− لمحرك تيار مستمر توازٍ، فإن اتجاه الدوران:',o:['ينعكس','يبقى كما هو','يتوقف المحرك','يتذبذب'],c:1,e:'الشكل (6-3): ينعكس تيار العضو وتيار المجال معاً فيبقى الاتجاه. لعكسه نغير قطبية العضو (6-4).'}
 ]
});

/* =====================================================================
   Induction motor figures
   ===================================================================== */
const LX=[110,160,210];
/* (6-7)/(6-8): stator starter. o:{kind:'fix'|'var'|'none', main, short, pos (0 whole R … 1 none), arrows, lab} */
function imStatorSVG(o){const on=!!o.main,f=on?'flow':'',lv='live';
  let s=`<svg viewBox="0 0 300 272" role="img" aria-label="بادئ تشغيل للعضو الساكن">`;
  ['L1','L2','L3'].forEach((l,i)=>{const x=LX[i];s+=T(x,13,l)+S.w(`M${x} 18V40`,lv)+S.w(`M${x} 64V92`,f)+blk(x-8,92,16,46)+T(x+16,100,['U1','V1','W1'][i],'','start',10.5)+T(x+16,138,['U2','V2','W2'][i],'','start',10.5)+S.w(`M${x} 138V158`,f)});
  s+=mainSw(LX,40,on,38,{hot:on});s+=acMot(52,115,15,on)+(o.lab?rotm(52,115,15):'');
  if(o.kind==='fix'){const sh=!!o.short;
    LX.forEach(x=>{s+=dot(x,158)+S.w(`M${x} 158V166`,sh?lv:f)+resV(x,166,40)+S.w(`M${x} 206V226`,sh?lv:f)+dot(x,226)+S.w(`M${x} 158H${x+22}`,sh?f:(on?lv:''))+noC(x+22,158,226,sh,sh?f:(on?lv:''),sh?f:(on?lv:''))+S.w(`M${x+22} 226H${x}`,sh?f:(on?lv:''))+S.w(`M${x} 226V244`,f);if(o.arrows)s+=dblUp(x+34,178)});
    s+=S.w('M110 244H210',f)+dot(160,244)}
  else if(o.kind==='var'){const ys=200-clamp(o.pos||0,0,1)*36;
    LX.forEach(x=>{s+=S.w(`M${x} 158V160`,f)+resV(x,160,46)+(on&&o.pos<1?`<rect x="${x-5}" y="161" width="10" height="${ys-161}" fill="var(--live-soft)"/>`:'')+S.w(`M${x} 206V226`,'')+S.w(`M${x-18} ${ys}H${x-9}`,f)+head(x-7,ys,'r')+S.w(`M${x-18} ${ys}V248`,f)});
    s+=S.w('M110 226H210','')+dot(160,226)+S.w('M92 248H192',f)+dot(142,248);if(o.arrows)s+=arrV(72,252,196)}
  else{LX.forEach(x=>{s+=S.w(`M${x} 158V200`,f)});s+=S.w('M110 200H210',f)+dot(160,200)}
  return s+'</svg>'}

/* star–delta starter (6-9). Returns layer fragments; o:{book, pos:'Y'|'D', main, aux:'Y'|'D'|'', bad(highlight error)} */
function sdLayers(o){const on=!!o.main,f=on?'flow':'',lv='live',Y=o.pos!=='D';
  const XS=[90,140,190],SW=[270,320,370],NY={90:120,140:104,190:88};
  /* which line node feeds each right contact */
  const feed=o.book?[90,140,190]:[90,190,140];/* sw1 (W2), sw2 (V2), sw3 (U2) */
  const L=[];
  let a='';['L1','L2','L3'].forEach((l,i)=>{const x=XS[i];a+=T(x,13,l)+S.w(`M${x} 18V40`,lv)});a+=mainSw(XS,40,on,30,{hot:on});L.push(a);
  let b='';XS.forEach((x,i)=>{b+=S.w(`M${x} 64V160`,f)+dot(x,NY[x])+blk(x-9,160,18,48)+T(x+14,156,['U1','V1','W1'][i],'','start',10.5)+T(x+14,222,['U2','V2','W2'][i],'','start',10.5)});b+=acMot(40,184,15,on)+(o.lab?rotm(40,184,15):'');L.push(b);
  let c='';SW.forEach(x=>{c+=`<path class="sym" d="M${x-16} 196H${x-8}M${x+8} 196H${x+16}" stroke-width="1.3"/>`+`<path class="sym${on?' hot':''}" d="M${x} 236L${Y?x-12:x+12} 198"/>`});
  c+=`<path class="mech" d="M238 218H${Y?358:382}"/>`+handle(232,218)+dblUp(240,186);L.push(c);
  /* star bar (left contacts) with hops over the feeds at 282 and 332 */
  L.push(S.w('M258 196V178',Y?f:'')+S.w('M308 196V178',Y?f:'')+S.w('M358 196V178',Y?f:'')+S.w('M258 178H276a6 6 0 0 1 12 0H326a6 6 0 0 1 12 0H358',Y?f:'')+dot(308,178));
  /* winding ends to the arms */
  const bad=o.book&&!Y;
  L.push(S.w('M190 208V248H270V236',f)+S.w('M140 208V262H320V236',bad?lv:f)+S.w('M90 208V276H370V236',f));
  /* right contacts fed from the line nodes */
  let g='';feed.forEach((xn,k)=>{const xr=SW[k]+12,yn=NY[xn];const cl=Y?(on?lv:''):(bad&&k===1?lv:f);
    let d=`M${xn} ${yn}H${xr}`;if(!o.book&&k===2)d=`M${xn} ${yn}H${SW[1]+6}a6 6 0 0 1 12 0H${xr}`;
    g+=S.w(d+`V196`,cl)});L.push(g);
  if(o.aux){let x='';const ax=[290,330,370];['L1','L2','L3'].forEach((l,i)=>{x+=T(ax[i],13,l,'',null,10)});
    if(o.aux==='Y'){x+=S.w('M330 18V30')+S.w('M290 18V74')+S.w('M370 18V74')+blk(326,30,8,20)+`<path d="M330 50L330 56" class="w"/>`+dot(330,56)+`<g transform="rotate(55 330 56)">${blk(326,56,8,18)}</g><g transform="rotate(-55 330 56)">${blk(326,56,8,18)}</g>`+S.w('M296 70L290 74')+S.w('M364 70L370 74')}
    else{x+=S.w('M330 18V28')+S.w('M290 18V72H296')+S.w('M370 18V72H364')+dot(330,28)+dot(296,72)+dot(364,72)+`<path class="w" d="M330 28L296 72H364Z"/>`+`<g transform="rotate(38 313 50)">${blk(309,40,8,20)}</g><g transform="rotate(-38 347 50)">${blk(343,40,8,20)}</g>${blk(320,68,20,8)}`}
    L.push(x)}
  if(o.bad&&bad)L.push(`<path d="M140 208V262H320V236L332 198V104H140" stroke="var(--stop)" stroke-width="3" fill="none" stroke-dasharray="5 4"/><rect x="128" y="157" width="24" height="54" fill="none" stroke="var(--stop)" stroke-width="2.4" rx="3"/>`);
  return L}
const sdSVG=o=>`<svg viewBox="0 0 410 290" role="img" aria-label="بادئ نجمة مثلث بمفتاح">${sdLayers(o).join('')}</svg>`;
/* terminals of each winding → what it is connected to */
function sdConn(book,pos){if(pos==='Y')return {U:['L1','★'],V:['L2','★'],W:['L3','★']};
  return book?{U:['L1','L3'],V:['L2','L2'],W:['L3','L1']}:{U:['L1','L2'],V:['L2','L3'],W:['L3','L1']}}
function sdTable(book,pos){const c=sdConn(book,pos);return `<table class="d6-t"><thead><tr><th>الملف</th><th>طرفه الأول</th><th>طرفه الثاني</th><th>الحالة</th></tr></thead><tbody>${['U','V','W'].map(k=>{const [a,b]=c[k];const sh=a===b;
  return `<tr><th class="d6-wire">${k}1–${k}2</th><td class="d6-wire">${a}</td><td class="d6-wire${sh?' bad':''}">${b==='★'?'نقطة النجمة':b}</td><td class="${sh?'bad':'ok'}">${b==='★'?'جهد الوجه':sh?'مقصور: طرفاه على الخط نفسه':'جهد الخط '+lt(a+'–'+b)}</td></tr>`}).join('')}</tbody></table>`}

/* (6-10) slip-ring motor, wiring diagram. o:{main, stage 0..3 (0 = whole R, 3 = shorted), lab} */
function imRotorSVG(o){const on=!!o.main,f=on?'flow':'',lv='live';const xs=[114,150,186];
  let s=`<svg viewBox="0 0 330 446" role="img" aria-label="بدء محرك حثي ذي حلقات انزلاق بمقاومات في العضو الدوار">`;
  s+=T(165,11,'380/220 V 3/N/PE ~ 60 Hz','m',null,10.5);
  ['L1','L2','L3','N'].forEach((l,i)=>{s+=T(32,24+i*10,l,'','end',10)+S.w(`M38 ${20+i*10}H300`,'live')});s+=T(32,64,'PE','','end',10)+`<path d="M38 60H300" stroke="var(--fg)" stroke-width="1.4" stroke-dasharray="9 3 2 3"/>`;
  xs.forEach((x,i)=>{s+=dot(x,20+i*10)+S.w(`M${x} ${20+i*10}V80`,f)+S.fuse(x,80,f)+S.w(`M${x} 104V124`,f)+T(x+8,121,String(2*i+1),'m','start',9)});s+=T(100,96,'F1..3','','end',10);
  s+=dashBox(98,114,104,82)+mainSw(xs,124,on,80,{noArrow:1,hot:on})+`<rect x="62" y="130" width="12" height="12" class="sym" fill="var(--surface)"/><path class="sym" d="M68 130v12M62 136h12" stroke-width="1"/><path class="mech" d="M74 136H80"/>`+T(58,140,'Q1','','end',10);
  xs.forEach((x,i)=>{s+=S.w(`M${x} 148V156`,f)+S.thermal(x,156,f)+T(x+8,200,String(2*i+2),'m','start',9)+S.w(`M${x} 188V218`,f)});
  /* motor box */
  s+=dashBox(92,208,148,136)+`<path d="M92 252H240M92 286H240M92 318H240" stroke="var(--muted)" stroke-dasharray="9 3 2 3" fill="none"/>`;
  [['U1','W2'],['V1','U2'],['W1','V2']].forEach(([a,b],i)=>{const x=xs[i];s+=odot(x,220)+odot(x,240)+S.w(`M${x} 223V237`,f)+T(x+5,217,a,'','start',8.5)+T(x-5,250,b,'','end',8.5)});
  s+=odot(220,240)+T(220,232,'PE','','middle',8.5)+`<path d="M220 243V256M214 256h12M216 259h8M218 262h4" class="sym" stroke-width="1.2"/>`+`<path d="M220 60V200" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="9 3 2 3" fill="none"/>`;
  xs.forEach(x=>{s+=blk(x-5,258,10,24,false)});
  s+=acMot(150,300,12,on)+(o.lab?rotm(150,300,12):'');
  [['K',114],['L',150],['M',186]].forEach(([l,x])=>{s+=S.w(`M${x===150?150:150+(x-150)*0.3} 312L${x} 327`,f)+odot(x,330)+T(x-7,334,l,'','end',10)});
  /* rotor starter */
  const st=clamp(o.stage||0,0,3),ys=398-st/3*32;
  s+=dashBox(84,350,152,86);
  xs.forEach(x=>{s+=S.w(`M${x} 333V362`,f)+resV(x,362,40)+(on&&st<3?`<rect x="${x-5}" y="363" width="10" height="${ys-363}" fill="var(--live-soft)"/>`:'')+S.w(`M${x} 402V414`,'')+S.w(`M${x-16} ${ys}H${x-9}`,f)+head(x-7,ys,'r')+S.w(`M${x-16} ${ys}V424`,f)});
  s+=S.w('M114 414H186','')+dot(150,414)+S.w('M98 424H170',f)+dot(134,424)+`<path class="mech" d="M70 424H98"/>`+handle(64,424)+T(250,380,'PE','','start',9)+`<path d="M246 372V436" stroke="var(--fg)" stroke-width="1.2" stroke-dasharray="9 3 2 3" fill="none"/>`;
  return s+'</svg>'}
/* (6-10) line («single-line») diagram */
function lineDia610(){let s=`<svg viewBox="0 0 200 330" role="img" aria-label="المخطط الخطي لبدء محرك حلقات الانزلاق">`;
  s+=T(100,12,'380/220 V 3/N/PE ~ 60 Hz','m',null,10)+S.w('M30 20H170')+dot(100,20)+S.w('M100 20V44')+S.fuse(100,44)+`<path class="sym" d="M92 60l16 -10" stroke-width="1.3"/>`+T(114,54,'3','','start',10)+S.w('M100 68V90');
  s+=T(60,86,'380 V','','end',10)+`<path class="sym" d="M100 112L90 94"/>`+`<path class="sym" d="M96 94H104" stroke-width="1.3"/>`+S.w('M100 112V124')+`<path class="mech" d="M68 104H92"/>`+handle(62,104);
  s+=`<path class="sym" d="M92 132h6v-6h6v6h6" stroke-width="1.4"/>`+`<path class="sym" d="M92 140l16 -10" stroke-width="1.3"/>`+T(114,136,'3','','start',10)+S.w('M100 124V176')+`<path class="sym" d="M92 160l16 -10" stroke-width="1.3"/>`+T(114,156,'4','','start',10);
  s+=`<circle cx="100" cy="198" r="22" class="coil"/><circle cx="100" cy="198" r="16" class="sym"/>`+T(100,203,'M')+T(130,176,'3~Δ','','start',10);
  s+=S.w('M100 220V286')+dot(100,232)+`<path class="sym" d="M92 258l16 -10" stroke-width="1.3"/>`+T(114,254,'4','','start',10);
  s+=`<rect x="80" y="286" width="40" height="26" class="sym" fill="var(--surface)"/><path class="sym" d="M80 286L100 300L120 286" stroke-width="1.3"/>`;
  return s+'</svg>'}

/* (6-11) reversal: conn 'Y'|'D'; perm[i] = index of the line feeding terminal i (0 = BL/U, 1 = top/V, 2 = BR/W) */
function imRevSVG(o){const on=o.on!==false,f=on&&o.lab?'flow':'',X=[60,110,160],P=o.perm||[0,1,2];
  let s=`<svg viewBox="0 0 220 250" role="img" aria-label="${o.conn==='D'?'مثلث':'نجمة'}">`;
  /* line index i at top x=X[i] goes to terminal j where P[j]===i */
  const term=o.conn==='D'?[[60,160],[110,82],[160,160]]:[[66,150],[110,80],[154,150]];
  ['L1','L2','L3'].forEach((l,i)=>{const j=P.indexOf(i);const [tx]=term[j];const x=X[i];s+=T(x,13,l,'',null,11)+S.w(`M${x} 18V36L${tx} 58V${o.conn==='D'?term[j][1]:j===1?80:150}`,f)});
  if(o.conn==='D'){s+=`<path class="w ${f}" d="M110 82L60 160H160Z"/>`+[[110,82],[60,160],[160,160]].map(([x,y])=>dot(x,y)).join('')+`<g transform="rotate(57 85 121)">${blk(80,106,10,30)}</g><g transform="rotate(-57 135 121)">${blk(130,106,10,30)}</g>${blk(95,155,30,10)}`+T(68,124,'U','','end',11)+T(152,124,'V','','start',11)+T(110,178,'W','',null,11)}
  else{s+=`<path class="w ${f}" d="M110 80V118M110 118L66 150M110 118L154 150"/>`+dot(110,118)+blk(105,84,10,26)+`<g transform="rotate(54 110 118)">${blk(105,118,10,26)}</g><g transform="rotate(-54 110 118)">${blk(105,118,10,26)}</g>`+T(98,96,'V','','end',11)+T(62,166,'U','','middle',11)+T(158,166,'W','','middle',11)}
  const par=[[0,1,2],[1,2,0],[2,0,1]].some(p=>p.join()===P.join())?1:-1;
  s+=acMot(110,214,16,on&&o.lab)+(o.lab?rotm(110,214,16):'')+rotArr(110,214,16,on?par:0,o.lab?'var(--blue)':'var(--fg)');
  return s+'</svg>'}
const permDir=P=>[[0,1,2],[1,2,0],[2,0,1]].some(p=>p.join()===P.join())?1:-1;

/* ---------- induction motor model (per unit; illustrative shape constants) ---------- */
const IMC={R1:0.02,R2:0.04,X:0.2,Im:0.3};
function imRaw(s,r1x,r2x){s=Math.max(s,1e-4);const R=IMC.R1+r1x+(IMC.R2+r2x)/s,D=R*R+IMC.X*IMC.X,re=R/D,im=-IMC.X/D;return {I:Math.hypot(re,im-IMC.Im),T:(re*re+im*im)*(IMC.R2+r2x)/s}}
const IMN=imRaw(0.04,0,0);
const imCalc=(s,r1x,r2x)=>{const r=imRaw(s,r1x,r2x);return {I:r.I/IMN.I,T:r.T/IMN.T}};
/* «اكتشف العطل» فقط: المحرك على وجهين (انقطع خط): مركّبتا التتابع الموجب والسالب متساويتان؛ العزم = الأمامي − الخلفي (صفر عند السكون)، وتيار الخط = √3 ÷ |Zf+Zb| (بإهمال تيار المغنطة) */
const imCalc1=(s,r1x,r2x)=>{s=Math.max(s,1e-4);const R1=IMC.R1+r1x,R2=IMC.R2+r2x,Rf=R1+R2/s,Rb=R1+R2/(2-s),D=(Rf+Rb)*(Rf+Rb)+4*IMC.X*IMC.X;return {I:Math.sqrt(3/D)/IMN.I,T:(R2/s-R2/(2-s))/D/IMN.T}};

const IM_DEFS=()=>[
 {k:'In',label:'التيار المقنن للمحرك',unit:'A',value:20,min:0.5,max:2000,step:0.5},
 {k:'ns',label:'السرعة التزامنية',unit:'rpm',value:1800,min:300,max:3600},
 {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1.5,min:0.1,max:30,step:0.1},
 {k:'TL',label:'عزم الحمل عند السرعة الكاملة (٪ من العزم المقنن)',unit:'%',value:80,min:0,max:150},
 {k:'Rs',label:'مقاومة بدء العضو الساكن لكل وجه',unit:'Ω',value:2.2,min:0,max:500,step:0.1},
 {k:'kr',label:'مقاومة بدء العضو الدوار الكلية (كم مرة من مقاومة ملفه)',unit:'',value:4,min:0,max:50,step:0.5}];

/* torque–speed curve with the operating point */
function tnCurve(fn,w,ymax,lab){const W=330,H=150,L=40,R=10,Tp=16,Bm=24;const x=v=>L+v*(W-L-R),y=v=>Tp+(1-clamp(v,0,ymax)/ymax)*(H-Tp-Bm);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="منحنى العزم والسرعة">`+`<path d="M${L} ${Tp}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.2"/>`;
  [0,0.5,1].forEach(k=>{s+=T(L-4,y(ymax*k)+4,fm(ymax*k*100,0),'m','end',10)});
  let pm='',pl='';for(let i=0;i<=60;i++){const v=i/60*0.995;const r=fn(v);pm+=(i?'L':'M')+x(v).toFixed(1)+' '+y(r.T).toFixed(1);pl+=(i?'L':'M')+x(v).toFixed(1)+' '+y(r.TL).toFixed(1)}
  s+=`<path d="${pl}" stroke="var(--muted)" stroke-dasharray="5 3" fill="none" stroke-width="1.5"/><path d="${pm}" stroke="var(--blue)" stroke-width="2.2" fill="none"/>`;
  const r=fn(clamp(w,0,0.995));s+=`<circle cx="${x(clamp(w,0,0.995))}" cy="${y(r.T)}" r="4.5" fill="var(--live)"/>`;
  s+=AR(W-R,11,lab,{a:'start',fs:11.5})+T(L-4,11,'%','m','end',10)+T(W-R,H-6,'n / ns','m','end',10)+T(L,H-6,'0','m','middle',10)+T(W-R-4,H-14,'1','m','end',9);
  return s+'</svg>'}

function imLab(el){
  const st={part:'stat',kind:'fix',main:false,short:false,pos:0,sd:'Y',stage:0,conn:'Y',perm:[0,1,2],on2:false,w:0,I:0,Tm:0,peak:0,t:0,hist:[],ang:0,startW0:false,startShort:null,swaps:0};
  el.innerHTML=`<div id="u6tp2"></div><div class="grid d6">
   <div class="panel c12"><h2>محرك حثي ثلاثي الأوجه <small>مبني على الأشكال (6-7) إلى (6-11) ص 133–137</small></h2>
    ${segHTML('part',[['stat','1) مقاومات العضو الساكن'],['sd','2) نجمة / مثلث'],['rot','3) مقاومات العضو الدوار'],['rev','4) عكس الاتجاه']],'stat')}
    <div id="ctl"></div></div>
   <div class="panel c7"><h2 id="ftitle"></h2><div class="svgbox" id="fig" style="max-width:440px;margin-inline:auto"></div><div id="tbl"></div><div class="d6-msg" id="msg"></div>
    <p class="sub">العرض مبطأ: النقطة الزرقاء داخل المحرك تدور أبطأ من المحرك الحقيقي بكثير. الخط البرتقالي المتقطع = مسار التيار. جهد الشبكة <span class="ltr">380 V</span> من الكتاب.</p></div>
   <div class="panel c5"><h2>القراءات <small id="rsub">أرقام توضيحية</small></h2><div class="facts" id="facts"></div><div class="d6-ch" id="ch1"></div><div class="d6-ch" id="ch2"></div><div class="d6-ch" id="ch3"></div></div>
   <div class="panel c12"><h2>خطوات التجربة</h2><ol class="steps" id="steps"></ol>
    ${tryList(['قارن «أكبر تيار» عند البدء المباشر وعند البدء بمقاومات العضو الساكن وعند البدء نجمة.','في نجمة/مثلث شغّل والمفتاح على المثلث مباشرة: كم يصبح تيار البدء؟','في «كما في الكتاب» انقل المفتاح إلى المثلث وانظر الجدول: أي ملف صار مقصوراً؟','في مقاومات العضو الدوار راقب منحنى العزم: كيف يتغير عزم البدء مع كل مرحلة؟','بدّل خطين ثم بدّل خطين آخرين: ماذا يحدث للاتجاه؟'])}</div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#u6tp2'),'u6-l2',IM_DEFS(),()=>{st.hist=[];draw()});const P=()=>TP.v;
  const bookSD=()=>!B.bkOn('sd69');
  const Zb=()=>(380/Math.sqrt(3))/P().In;
  const model=()=>{const v=P();/* returns {r1x,r2x,k(scale I,T),ok} */
    if(st.part==='stat')return {r1x:st.kind==='fix'?(st.short||chF('kweld')?0:v.Rs/Zb()):st.kind==='var'?v.Rs/Zb()*(1-st.pos):0,r2x:0,kI:1,kT:1,ok:true};
    if(st.part==='sd'){if(st.sd==='Y')return chF('sdD')?{r1x:0,r2x:0,kI:1,kT:1,ok:true}:{r1x:0,r2x:0,kI:1/3,kT:1/3,ok:true};return bookSD()?{ok:false}:chF('sdY')?{r1x:0,r2x:0,kI:1/3,kT:1/3,ok:true}:{r1x:0,r2x:0,kI:1,kT:1,ok:true}}
    if(st.part==='rot')return {r1x:0,r2x:chF('rotsh')?0:v.kr*IMC.R2*(3-st.stage)/3,kI:1,kT:1,ok:true};
    return {r1x:0,r2x:0,kI:1,kT:1,ok:true}};
  const on=()=>st.part==='rev'?st.on2:st.main;
  const ctl=$('#ctl');
  function ctlHTML(){
    if(st.part==='stat')return `<div class="d6-row">${segHTML('kind',[['fix','مقاومات ثابتة وتلامسات تقصير'],['var','مقاومات متغيرة'],['none','بلا مقاومات (للمقارنة)']],st.kind)}</div>
      <div class="d6-row">${swHTML('mainSw','Q','المفتاح الرئيس',st.main)}${st.kind==='fix'?swHTML('shSw','K','تلامسات التقصير',st.short):st.kind==='var'?`<button class="btn" id="dn">حرّك المنزلقات خطوة ▲ (أنقص)</button><button class="btn" id="up">أرجع خطوة ▼</button><span class="sub" id="posTxt"></span>`:''}</div>`;
    if(st.part==='sd')return `<div class="d6-row">${B.bkCtl('sd69','توصيل مفتاح نجمة/مثلث:')}</div><div class="d6-row">${swHTML('mainSw','Q','المفتاح الرئيس',st.main)}<span class="sub">مفتاح نجمة/مثلث:</span>${segHTML('sd',[['Y','نجمة Y'],['D','مثلث Δ']],st.sd)}</div>`;
    if(st.part==='rot')return `<div class="d6-row">${swHTML('mainSw','Q1','مفتاح وقاية المحرك',st.main)}<span class="sub">ذراع بادئ العضو الدوار:</span>${segHTML('stage',[[0,'1: كل المقاومة'],[1,'2'],[2,'3'],[3,'4: مقصورة']],st.stage)}</div>`;
    return `<div class="d6-row">${segHTML('conn',[['Y','نجمة'],['D','مثلث']],st.conn)}${swHTML('onSw','Q','تشغيل',st.on2)}</div><div class="d6-row"><button class="btn" data-sw="0,1">بدّل L1 و L2</button><button class="btn" data-sw="1,2">بدّل L2 و L3</button><button class="btn" data-sw="0,2">بدّل L1 و L3</button><button class="btn" id="rst">التوصيل الأصلي</button></div>`}
  function bind(){ctl.innerHTML=ctlHTML();
    ctl.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{st.kind=b.dataset.kind;bind();draw()});
    ctl.querySelectorAll('[data-sd]').forEach(b=>b.onclick=()=>{st.sd=b.dataset.sd;segSet(ctl,'sd',st.sd);draw()});
    ctl.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{st.stage=+b.dataset.stage;segSet(ctl,'stage',st.stage);draw()});
    ctl.querySelectorAll('[data-conn]').forEach(b=>b.onclick=()=>{st.conn=b.dataset.conn;segSet(ctl,'conn',st.conn);draw()});
    ctl.querySelectorAll('[data-bkfix]').forEach(b=>b.addEventListener('click',()=>setTimeout(draw,0)));
    ctl.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>{const [i,j]=b.dataset.sw.split(',').map(Number);const a=st.perm.indexOf(i),c=st.perm.indexOf(j);st.perm[a]=j;st.perm[c]=i;st.swaps++;draw()});
    const rs=$('#rst');if(rs)rs.onclick=()=>{st.perm=[0,1,2];draw()};
    const ms=$('#mainSw');if(ms)ms.onclick=()=>{st.main=!st.main;ms.setAttribute('aria-pressed',st.main);if(st.main){st.peak=0;st.startW0=st.w<0.05;st.startShort=st.short;st.startSD=st.sd;st.startStage=st.stage}draw()};
    const sh=$('#shSw');if(sh)sh.onclick=()=>{st.short=!st.short;sh.setAttribute('aria-pressed',st.short);draw()};
    const o2=$('#onSw');if(o2)o2.onclick=()=>{st.on2=!st.on2;o2.setAttribute('aria-pressed',st.on2);draw()};
    const dn=$('#dn'),up=$('#up');if(dn)dn.onclick=()=>{st.pos=Math.min(1,B.round(st.pos+0.25,2));draw()};if(up)up.onclick=()=>{st.pos=Math.max(0,B.round(st.pos-0.25,2));draw()};}
  el.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{const np=b.dataset.part;if(np===st.part)return;st.part=np;segSet(el,'part',np);st.main=false;st.on2=false;st.w=0;st.peak=0;st.hist=[];st.short=false;st.pos=0;st.sd='Y';st.stage=0;bind();draw()});
  document.addEventListener('click',function h(e){if(!document.body.contains(el)){document.removeEventListener('click',h);return}if(e.target.closest&&e.target.closest('[data-bkfix="sd69"]')&&!ctl.contains(e.target))setTimeout(draw,0)});
  function draw(){const book=bookSD();
    const ttl={stat:{fix:'الشكلان (6-7) و(6-8) يساراً: مقاومات ثابتة وتلامسات تقصير',var:'الشكلان (6-7) و(6-8) يميناً: مقاومات متغيرة',none:'للمقارنة: بدء مباشر بلا مقاومات (ليس من الكتاب)'}[st.kind],
      sd:`الشكل (6-9): بادئ نجمة/مثلث — ${book?'التوصيل كما في الكتاب':'التوصيل المصحح'}`,rot:'الشكل (6-10): مقاومات بدء العضو الدوار (الدائرة التنفيذية)',rev:'الشكل (6-11): عكس اتجاه الدوران'}[st.part];
    $('#ftitle').innerHTML=B.ltrFig(typeof ttl==='string'?ttl:ttl);
    const F=$('#fig');$('#tbl').innerHTML='';
    if(st.part==='stat')F.innerHTML=imStatorSVG({kind:st.kind,main:st.main,short:st.short,pos:st.pos,arrows:true,lab:1});
    else if(st.part==='sd'){F.innerHTML=sdSVG({book,pos:st.sd,main:st.main,aux:'',bad:1,lab:1});$('#tbl').innerHTML=sdTable(book,st.sd)}
    else if(st.part==='rot')F.innerHTML=imRotorSVG({main:st.main,stage:st.stage,lab:1});
    else F.innerHTML=`<div style="max-width:250px;margin-inline:auto">${imRevSVG({conn:st.conn,perm:st.perm,on:st.on2,lab:1})}</div>`;
    const pt=$('#posTxt');if(pt)pt.innerHTML=st.pos>=1?'المقاومات خرجت كلها':`في الدائرة ${lt(fm((1-st.pos)*100,0)+' %')} من المقاومات`;
    info()}
  function info(){const v=P(),facts=$('#facts'),m=$('#msg');let cls='d6-msg',t='';
    if(st.part==='rev'){const d=permDir(st.perm),lines=['L1','L2','L3'];
      facts.innerHTML=fact('الطرف U ← ',lines[st.perm[0]])+fact('الطرف V ← ',lines[st.perm[1]])+fact('الطرف W ← ',lines[st.perm[2]])+fact('اتجاه الدوران',st.on2?(d>0?'⟳':'⟲'):'متوقف');
      $('#rsub').textContent='منطق فقط بلا أرقام';['#ch1','#ch2','#ch3'].forEach(k=>$(k).innerHTML='');
      t=st.on2?(d>0?'تتابع الأوجه على U و V و W هو L1 ثم L2 ثم L3 (أو ما يكافئه): المجال يدور في الاتجاه الأصلي.':'تبديل خطين عكس تتابع الأوجه، فعكس اتجاه دوران المجال وعكس اتجاه المحرك.'):'شغّل المحرك ثم بدّل أي خطين.';
      if(st.on2&&st.swaps>=2&&d>0&&st.perm.join()!=='0,1,2')t+=' تبديلان متتاليان يعيدان الاتجاه الأصلي.';
      m.className=cls;m.innerHTML=t;return}
    $('#rsub').textContent='أرقام توضيحية';
    const md=model();const n=st.w*v.ns;
    if(!md.ok&&st.main){facts.innerHTML=fact('التيار',`—`,true)+fact('السرعة',`${fm(n,0)} rpm`)+fact('الحالة','خطأ توصيل',true);
      m.className='d6-msg bad';m.innerHTML=`<b>توصيل الكتاب في وضع المثلث خاطئ:</b> الملف V طرفاه V1 و V2 على الخط L2 نفسه فهو مقصور ولا يعمل، والملفان U و W كلاهما على الخطين L1 و L3، والخط L2 لا يغذي أي ملف. لا يتكوّن مجال دوار ثلاثي الأوجه، فلا يعمل المحرك تشغيلاً سليماً. افصل المفتاح الرئيس، واختر «المصحح» لترى التوصيل الصحيح. (لا نعرض أرقاماً لهذه الحالة.)`;
      ['#ch1','#ch2','#ch3'].forEach(k=>$(k).innerHTML='');return}
    const Ia=st.I*v.In;
    facts.innerHTML=fact('تيار الخط',`${fm(Ia,1)} A`,st.I>2.5)+fact('أكبر تيار منذ التشغيل',`${fm(st.peak*v.In,0)} A`,st.peak>2.5)+fact('السرعة n',`${fm(n,0)} rpm`)+fact('عزم المحرك',`${fm(st.Tm*100,0)} %`);
    const now=st.t;$('#ch1').innerHTML=tChart(st.hist,'n',niceMax(v.ns),'السرعة','rpm',now,v.ns);$('#ch2').innerHTML=tChart(st.hist,'I',niceMax(Math.max(2*v.In,...st.hist.map(p=>p.I))),'تيار الخط','A',now,v.In);
    if(st.part==='rot'||st.part==='stat'){const r2=md.r2x,r1=md.r1x,tl=v.TL/100;$('#ch3').innerHTML=tnCurve(w=>{const c=imCalc(1-w,r1,r2);return {T:c.T*md.kT,TL:tl*w*w}},st.w,niceMax(Math.max(2.5,...[0,0.2,0.4,0.6,0.8,0.9].map(w=>imCalc(1-w,r1,r2).T*md.kT))),'العزم مع السرعة (٪ من المقنن)')}else $('#ch3').innerHTML='';
    if(!st.main)t=st.w>0.01?'المفتاح مفتوح: المحرك يتباطأ.':'أغلق المفتاح الرئيس لتبدأ.';
    else{t=`أكبر تيار منذ التشغيل ${lt(fm(st.peak*v.In,0)+' A')}، أي ${lt(fm(st.peak,1))} مرة من التيار المقنن. `;
      if(st.part==='sd')t+=st.sd==='Y'?'في النجمة يقع على كل ملف جهد الوجه فقط، فيكون تيار الخط وعزم البدء ثلث قيمتهما في المثلث تقريباً.':'في المثلث يقع على كل ملف جهد الخط كاملاً.';
      if(st.part==='rot')t+='مقاومة العضو الدوار تصغّر تيار البدء وتكبّر عزم البدء (المنحنى الأزرق عند السرعة صفر).';
      if(st.I>2.5)cls+=' warn'}
    m.className=cls;m.innerHTML=t}
  const steps=[
    {t:'مقاومات ثابتة في العضو الساكن — الشكل (6-7)',x:'شغّل المفتاح الرئيس والتلامسات مفتوحة (المقاومات في الدائرة)، ثم أغلق تلامسات التقصير بعد ارتفاع السرعة (الشكل 6-8).',done:()=>st.part==='stat'&&st.kind==='fix'&&st.main&&st.short&&st.startW0&&st.startShort===false&&st.w>0.85},
    {t:'مقاومات متغيرة',x:'افصل وانتظر الوقوف، واختر «مقاومات متغيرة». شغّل، ثم حرّك المنزلقات معاً خطوة بعد خطوة حتى تخرج المقاومات كلها.',done:()=>st.part==='stat'&&st.kind==='var'&&st.main&&st.pos>=1&&st.w>0.85},
    {t:'البدء نجمة — الشكل (6-9)',x:'افتح «نجمة / مثلث». المفتاح على نجمة: أغلق المفتاح الرئيس وراقب تيار البدء.',done:()=>st.part==='sd'&&st.main&&st.sd==='Y'&&st.startSD==='Y'&&st.startW0&&st.w>0.6},
    {t:'انقل إلى المثلث — بالتوصيل المصحح',x:'اختر «المصحح» ثم انقل المفتاح إلى المثلث بعد ارتفاع السرعة. انظر الجدول: كل ملف على خطين مختلفين.',done:()=>st.part==='sd'&&st.main&&st.sd==='D'&&!bookSD()&&st.w>0.85},
    {t:'انظر توصيل الكتاب في وضع المثلث',x:'اختر «كما في الكتاب» والمفتاح على المثلث: الجدول يبيّن أن الملف V صار مقصوراً.',done:()=>st.part==='sd'&&st.sd==='D'&&bookSD()},
    {t:'مقاومات العضو الدوار — الشكل (6-10)',x:'افتح «مقاومات العضو الدوار». شغّل والذراع على «كل المقاومة»، ثم انقله مرحلة بعد مرحلة حتى «مقصورة» مع ارتفاع السرعة.',done:()=>st.part==='rot'&&st.main&&st.stage===3&&st.startStage===0&&st.w>0.85},
    {t:'اعكس الاتجاه — الشكل (6-11)',x:'افتح «عكس الاتجاه»، شغّل المحرك وبدّل أي خطين.',done:()=>st.part==='rev'&&st.on2&&permDir(st.perm)<0},
    {t:'بدّل خطين آخرين',x:'بدّل زوجاً آخر من الخطوط: ماذا يحدث للاتجاه؟',done:()=>st.part==='rev'&&st.on2&&permDir(st.perm)>0&&st.perm.join()!=='0,1,2'}];
  const SU=stepsUI($('#steps'),steps);
  bind();draw();let acc=0,lastOk=null;
  loopOn(el,dt=>{const v=P();
    if(st.part!=='rev'){const md=model(),tl=v.TL/100;const N=Math.max(1,Math.round(dt/0.002));
      for(let i=0;i<N;i++){let Te=0,I=0;if(st.main&&md.ok){const c=(chF('ph1')?imCalc1:imCalc)(1-st.w,md.r1x,md.r2x);I=c.I*md.kI;Te=c.T*md.kT}
        const TLd=tl*st.w*st.w;let dw=(Te-TLd-(st.main&&md.ok?0:0.15))/v.tau*(dt/N);if(st.w<=0&&dw<0)dw=0;st.w=clamp(st.w+dw,0,0.9999);st.I=I;st.Tm=Te}
      if(st.main&&md.ok)st.peak=Math.max(st.peak,st.I);if(md.ok!==lastOk){lastOk=md.ok;info()}}
    else{st.w=st.on2?0.97:Math.max(0,st.w-dt/v.tau);st.I=0}
    st.t+=dt;acc+=dt;const dir=st.part==='rev'?permDir(st.perm):1;st.ang+=dir*st.w*v.ns/60*360*dt*0.02;turn(el,st.ang);
    if(acc>=0.08){acc=0;st.hist.push({t:st.t,n:st.w*v.ns,I:st.I*v.In});while(st.hist.length&&st.hist[0].t<st.t-13)st.hist.shift();info();SU.check()}});
}

/* (6-9) widget in theory: book/fixed switch + star/delta */
function sdWidget(el){let pos='Y';
  const draw=()=>{const book=!B.bkOn('sd69');el.querySelector('#sdw-fig').innerHTML=sdSVG({book,pos,main:false,aux:pos,bad:1});el.querySelector('#sdw-t').innerHTML=sdTable(book,pos);
    el.querySelector('#sdw-cap').innerHTML=B.ltrFig(pos==='Y'?'الشكل (6-9-أ): بدء تشغيل المحركات ثلاثية الأوجه بتوصيل نجمي عن طريق مفتاح':'الشكل (6-9-ب): بدء تشغيل المحركات ثلاثية الأوجه بتوصيل مثلثي عن طريق مفتاح')};
  el.innerHTML=`<div class="d6"><div class="d6-row">${B.bkCtl('sd69','التوصيل:')}<span class="sub">وضع المفتاح:</span>${segHTML('p',[['Y','نجمة (6-9-أ)'],['D','مثلث (6-9-ب)']],pos)}</div>
   <div class="svgbox" id="sdw-fig" style="max-width:520px;margin:10px auto 0"></div><p class="sub" style="text-align:center"><b id="sdw-cap"></b> <span class="ref">ص 134–135</span></p><div id="sdw-t"></div></div>`;
  el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pos=b.dataset.p;segSet(el,'p',pos);draw()});
  document.addEventListener('click',function h(e){if(!document.body.contains(el)){document.removeEventListener('click',h);return}if(e.target.closest&&e.target.closest('[data-bkfix="sd69"]'))setTimeout(draw,0)});
  draw()}

B.lesson({
 id:'u6-l2',unit:6,order:2,pages:'133–137',
 title:'بدء المحرك الحثي ثلاثي الأوجه وعكس اتجاهه',
 summary:'نخفض تيار البدء بمقاومات في العضو الساكن تُقصر بعد ارتفاع السرعة، أو بالبدء نجمة ثم الانتقال إلى المثلث، أو بمقاومات في العضو الدوار لمحرك حلقات الانزلاق؛ ونعكس الاتجاه بتبديل أي خطين.',
 stations:[
  {intro:true},

  {st:1,short:'بادئ العضو الساكن',title:'6-3 بدء المحرك الحثي ثلاثي الأوجه ببادئ تشغيل للعضو الساكن',ref:'ص 133–134',
   q:'المحرك الحثي الساكن يسحب عند توصيله مباشرة تياراً كبيراً… فكيف نخفضه دون أن نغيّر المحرك نفسه؟',
   art:DRA.art({aria:'الشكل 6-7 و6-8 يساراً: مقاومة ثابتة على التوالي مع كل ملف، وتلامس تقصير موازٍ لها',
    parts:[{svg:imStatorSVG({kind:'fix',arrows:1}),box:[40,14,280,262],tips:[
     [96,36,128,32,'المفتاح الرئيس ثلاثي الأقطاب يوصل الخطوط ⟦L1⟧ و⟦L2⟧ و⟦L3⟧ إلى الملفات.'],
     [100,88,124,54,'ملفات العضو الساكن الثلاثة ⟦U1–U2⟧ و⟦V1–V2⟧ و⟦W1–W2⟧.'],
     [100,160,22,52,'مقاومة بدء ثابتة على التوالي مع ملف الوجه.'],
     [124,156,22,74,'تلامس تقصير مفتوح (⟦NO⟧) على التوازي مع المقاومة؛ يُغلق بعد زيادة السرعة فيقصر المقاومة.'],
     [136,164,28,36,'السهم ⇑ في الشكل (6-8): إغلاق تلامس التقصير.'],
     [146,232,28,22,'نقطة النجمة: الأطراف السفلى الثلاثة متصلة معاً.'],
     [34,96,36,38,'رمز المحرك ⟦M⟧.']]}],
    extra:DRA.L(180,302,'الشكل (6-7)/(6-8): مقاومات ثابتة وتلامسات تقصير',12.5,700)}),
   cap:'الرسم الأيسر من الشكلين <span class="ltr">(6-7)</span> و<span class="ltr">(6-8)</span>.<br><b>مرّر المؤشر على المفتاح والملفات والمقاومة والتلامس ونقطة النجمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'في بادئ العضو الساكن بمقاومات ثابتة، متى تُقصر المقاومات؟',opts:[
     ['قبل إغلاق المفتاح الرئيس',false,'لو قُصرت قبل البدء لبدأ المحرك بالجهد الكامل وتيار البدء الكبير.'],
     ['بعد زيادة سرعة الدوران',true,'ص 133: «بعد زيادة سرعة الدوران تقصر مقاومات بدء التشغيل كما في الشكل (6-8)».'],
     ['لا تُقصر أبداً',false,'لو بقيت لضاعت فيها قدرة دائماً وانخفض جهد المحرك.']]}}],
   body:[
    {book:'<p>عند توصيل المحرك الحثي ثلاثي الأوجه إلى مصدر الجهد مباشرة فإن التيار الذي يسحبه المحرك عند بدء الحركة مع تسليط الجهد الكامل على أطراف المحرك تكون قيمته كبيرة ، لذا فإنه يستلزم استخدام إحدى طرق بدء الحركة لتوصيل المحرك إلى المصدر والتي تؤدي إلى خفض التيار الذي يسحبه المحرك عند توصيله ومن هذه الطرق بدء التشغيل ببادئ تشغيل للعضو الساكن وفيه تستخدم إما مقاومة متغيرة أو مقاومة ثابتة عند الوصل تكون مع كل ملفات وجه مقاومة على التوالي كما في الشكل (6-7) أثناء زيادة سرعة الدوران تقلل المقاومات المتغيرة ، أما في حالة المقاومات الثابتة فإنه بعد زيادة سرعة الدوران تقصر مقاومات بدء التشغيل كما في الشكل (6-8).</p>',ref:'ص 133'},
    {tip:'<p>عند السكون يقطع العضو الدوار المجال الدوار بالسرعة التزامنية كلها، فيتولد فيه تيار كبير يسحبه المحرك من الشبكة (يعمل كمحول ثانويه مقصور). كلما ارتفعت السرعة صغر هذا التيار. لذلك نضع مقاومة على التوالي مع كل ملف عند البدء ثم نخرجها: <b>المتغيرة</b> تُقلَّل بتحريك المنزلقات الثلاثة معاً، و<b>الثابتة</b> تُقصر بإغلاق تلامساتها.</p>',title:'لماذا يكون تيار البدء كبيراً؟'},
    {html:`<figure class="fig" style="margin:10px 0"><div class="svgbox" style="max-width:300px;margin-inline:auto">${imStatorSVG({kind:'var',pos:0.5,arrows:1})}</div><figcaption>الرسم الأيمن من الشكل <span class="ltr">(6-8)</span>: مقاومات متغيرة منزلقاتها مربوطة بخط واحد فتتحرك معاً، والسهم إلى أعلى يدل على تحريكها. <span class="ref">ص 134</span></figcaption></figure>`},
    {watch:'<p>النص يربط المقاومات المتغيرة بالشكل (6-7) والثابتة المقصورة بالشكل (6-8)، بينما يعرض كل من الشكلين النوعين معاً (الثابت يساراً والمتغير يميناً)؛ الفرق أن (6-8) يضيف أسهم التشغيل.</p>',fix:true},
    {title:'مختبر مصغّر: شغّل البادئ بالترتيب',widget:(el,B)=>DCML.lab(el,B,{intro:'أغلق المفتاح الرئيس، ثم تلامسات التقصير، وتابع مسار التيار في الرسم (منطق فقط بلا أرقام).',
     predict:{q:'أغلقنا تلامسات التقصير ثم أغلقنا المفتاح الرئيس والمحرك ساكن. ماذا حدث؟',opts:[
      ['بدأ المحرك بتيار صغير',false,'المقاومات مقصورة قبل البدء، فلا تحد شيئاً.'],
      ['بدأ المحرك بالجهد الكامل وتيار بدء كبير، كأنه بلا بادئ',true,'ترتيب التشغيل الصحيح: المفتاح الرئيس أولاً والتلامسات مفتوحة، ثم التقصير بعد ارتفاع السرعة.']]},
     ins:[{k:'m',l:'المفتاح الرئيس',sw:true,v:0,on:'المفتاح الرئيس مغلق',off:'المفتاح الرئيس مفتوح'},
          {k:'k',l:'تلامسات التقصير',sw:true,v:0,on:'تلامسات التقصير مغلقة',off:'تلامسات التقصير مفتوحة'}],
     calc:(s)=>({pic:`<div style="max-width:300px;margin:auto">${imStatorSVG({kind:'fix',main:!!s.m,short:!!s.k})}</div>`,
      facts:[['التيار يمر في',s.m?(s.k?'التلامسات (المقاومات مقصورة)':'المقاومات'):'لا شيء',s.m?'hi':''],['تيار البدء',!s.m?'—':s.k?'كبير (بلا بادئ)':'محدود بالمقاومات',s.m&&s.k?'bad':'']],
      msg:!s.m?(s.k?'التلامسات مغلقة قبل البدء: هذا خطأ في الترتيب. افتحها قبل أن تغلق المفتاح الرئيس.':'أغلق المفتاح الرئيس.'):s.k?'الآن المقاومات مقصورة. هذا صحيح فقط إذا كانت السرعة قد ارتفعت.':'المحرك يبدأ والمقاومات على التوالي مع الملفات. بعد ارتفاع السرعة أغلق تلامسات التقصير.',cls:!s.m&&s.k?'warn':''})})}
   ]},

  {st:2,short:'نجمة / مثلث',title:'البدء بتوصيل نجمي ثم مثلثي (الشكل 6-9)',ref:'ص 134–135',
   q:'المحرك مصمم ليعمل مثلثاً… فلماذا نبدؤه نجمة؟',
   art:DRA.art({aria:'الشكل 6-9-أ: بادئ نجمة/مثلث بمفتاح، والرسم المساعد نجمة',bg:'#E4ECF6',
    parts:[{svg:sdSVG({book:true,pos:'Y',main:false,aux:'Y'}),box:[16,30,328,232],tips:[
     [76,34,130,34,'المفتاح الرئيس ثلاثي الأقطاب، وبعده عقدة على كل خط.'],
     [76,154,128,60,'ملفات المحرك ⟦U1–U2⟧ و⟦V1–V2⟧ و⟦W1–W2⟧: الأطراف الستة تخرج إلى المفتاح.'],
     [252,170,112,16,'قضيب نقطة النجمة: يربط الأطراف اليسرى الثلاثة لمفتاح نجمة/مثلث.'],
     [250,186,140,54,'مفتاح نجمة/مثلث: ثلاثة تلامسات تحويل؛ الذراع على اليسار = نجمة، وعلى اليمين = مثلث.'],
     [222,180,30,50,'ذراع تشغيل مفتاح نجمة/مثلث.'],
     [280,4,104,78,'الرسم المساعد: يبيّن شكل التوصيل الحالي (نجمة في 6-9-أ، ومثلث في 6-9-ب).']]}],
    extra:DRA.L(180,290,'الشكل (6-9-أ): المفتاح على النجمة',13.5,700)}),
   cap:'رسم الكتاب والمفتاح على النجمة.<br><b>مرّر المؤشر على المفتاحين والملفات وقضيب النجمة والرسم المساعد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'متى تُستخدم طريقة البدء نجمة/مثلث؟',opts:[
     ['إذا كانت توصيلة المحرك في التشغيل المستقر نجمة',false,'لو كان يعمل نجمة أصلاً لما بقي شيء ننتقل إليه.'],
     ['لمحركات التيار المستمر',false,'هذه طريقة للمحركات الحثية ثلاثية الأوجه.'],
     ['إذا كانت توصيلة المحرك عند حالة الأداء المستقر هي المثلث',true,'ص 134: «تستخدم هذه الطريقة إذا كانت توصيلة المحرك عندما يعمل عند حالة الأداء المستقر هي توصيلة المثلث».']]}}],
   body:[
    {book:'<p>يمكن أيضا بدء التشغيل بتوصيل نجمي- مثلثي وتستخدم هذه الطريقة إذا كانت توصيلة المحرك عندما يعمل عند حالة الأداء المستقر هي توصيلة المثلث أثناء بدء الحركة حيث تكون التوصيلة نجمة وتستمر حتى تزيد سرعة المحرك وينخفض التيار إلى قيمة مناسبة عندها يوصل المحرك على شكل مثلث كما في الشكل (6-9-أ و ب).</p>',ref:'ص 134'},
    {tip:String.raw`<p>في النجمة يقع على كل ملف جهد الوجه \(V_L/\sqrt{3}\) بدل جهد الخط \(V_L\) في المثلث، فيصغر تيار الخط وعزم البدء كلاهما إلى نحو الثلث. ولكي يعمل هذا البادئ يجب أن يُخرج المحرك أطراف ملفاته الستة <span class="ltr">U1 … W2</span>.</p>`,title:'لماذا تقل قيمة التيار في النجمة؟'},
    {watch:'<p>في الشكلين (6-9-أ) و(6-9-ب) أُخذت أسلاك المثلث إلى المفتاح هكذا: <span class="ltr">W2 ← L1</span> (صحيح)، لكن <span class="ltr">V2 ← L2</span> و<span class="ltr">U2 ← L3</span>. فعند نقل المفتاح إلى المثلث يصبح طرفا الملف V على الخط L2 نفسه (مقصوراً لا يعمل)، ويقع الملفان U و W كلاهما على الخطين L1 و L3، ولا يغذي L2 أي ملف. الصحيح: <span class="ltr">W2 ← U1 (L1)</span>، <span class="ltr">U2 ← V1 (L2)</span>، <span class="ltr">V2 ← W1 (L3)</span>. وكذلك الرسمان (أ) و(ب) متطابقان في الكتاب عدا الرسم المساعد؛ هنا يظهر الذراع على النجمة في (أ) وعلى المثلث في (ب).</p>',fix:true},
    {title:'جرّب الرسم: كما في الكتاب / المصحح',widget:(el,B)=>sdWidget(el)},
    {title:'مختبر مصغّر: أي ملف على أي خطين؟',widget:(el,B)=>DCML.cases(el,B,{intro:'استعن بالجدول تحت الرسم السابق.',cases:[
     {q:'المفتاح على المثلث <b>كما في الكتاب</b>. ما حال الملف V؟',opts:[['طرفاه V1 و V2 على الخط L2 نفسه: مقصور لا يعمل',true,'V2 أُخذ إلى L2 وهو متصل أصلاً بـ V1.'],['على L2 و L3 ويعمل سليماً',false,'هذا في التوصيل المصحح فقط.'],['على نقطة النجمة',false,'نقطة النجمة تُستعمل في وضع النجمة فقط.']]},
     {q:'المفتاح على النجمة. هل يظهر خطأ الكتاب؟',opts:[['نعم، يقصر الملف V',false,'في النجمة تتصل النهايات الثلاث بقضيب النجمة، والأطراف اليمنى غير مستعملة.'],['لا، الخطأ في أسلاك الأطراف اليمنى (المثلث) فقط',true,'لذلك يبدأ المحرك سليماً ويظهر العطل عند الانتقال إلى المثلث.']]}]})}
   ]},

  {st:3,short:'حلقات الانزلاق',title:'بدء المحرك ذي حلقات الانزلاق (الشكل 6-10)',ref:'ص 135–136',
   q:'هل يمكن أن نصغّر تيار البدء ونكبّر عزم البدء في الوقت نفسه؟',
   art:DRA.art({aria:'الشكل 6-10: الدائرة التنفيذية لبدء محرك ذي حلقات انزلاق بمقاومات في العضو الدوار',bg:'#F7DCC8',
    parts:[{svg:imRotorSVG({stage:0}),box:[30,8,300,290],tips:[
     [100,76,96,32,'المصاهر ⟦F1..3⟧.'],
     [96,112,108,86,'مفتاح وقاية المحرك ⟦Q1⟧ بمرحلات حرارية.'],
     [90,208,152,48,'لوحة أطراف العضو الساكن موصولة مثلثاً: ⟦U1–W2⟧، ⟦V1–U2⟧، ⟦W1–V2⟧.'],
     [100,318,100,22,'أطراف العضو الدوار ⟦K⟧ و⟦L⟧ و⟦M⟧ (حلقات الانزلاق).'],
     [84,350,152,86,'بادئ العضو الدوار: ثلاث مقاومات متغيرة موصولة نجمة، منزلقاتها يحركها ذراع واحد.'],
     [54,412,44,24,'ذراع البادئ: ينقل المنزلقات معاً مرحلة بعد مرحلة.']]}],
    extra:DRA.L(250,140,'الدائرة',12,700)+DRA.L(250,156,'التنفيذية',12,700)}),
   cap:'الدائرة التنفيذية للشكل <span class="ltr">(6-10)</span>.<br><b>مرّر المؤشر على المصاهر والمفتاح ولوحتي الأطراف والبادئ (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'إضافة مقاومة على ملفات العضو الدوار عند البدء تجعل:',opts:[
     ['التيار أكبر والعزم أصغر',false,'العكس تماماً.'],
     ['التيار والعزم أصغر معاً',false,'هذا ما يحدث في بادئ العضو الساكن أو النجمة، لا هنا.'],
     ['تيار البدء أصغر وعزم البدء أكبر',true,'ص 135: «فتصبح شدة تيار بدء الدوران أصغر وعزم دوران البدء يصبح أكبر».']]}}],
   body:[
    {book:'<p>يمكن التحكم في بدء المحركات ثلاثية الأوجه ذات العضو الدوار الملفوف ذي حلقات الانزلاق بإضافة مقاومة على ملفات العضو الدوار عند بدء الدوران. فتصبح شدة تيار بدء الدوران أصغر وعزم دوران البدء يصبح أكبر كما في الشكل (6-10).</p>',ref:'ص 135'},
    {tip:'<p>هذه الطريقة لا تُستعمل إلا مع العضو الدوار <b>الملفوف</b>، لأن أطراف ملفاته تخرج عبر حلقات الانزلاق إلى الأطراف K و L و M فنصل بها مقاومات من الخارج. أما المحرك ذو القفص السنجابي فلا أطراف لعضوه الدوار.</p>',title:'لماذا «حلقات انزلاق»؟'},
    {html:`<figure class="fig" style="margin:10px 0"><div class="svgbox" style="max-width:180px;margin-inline:auto">${lineDia610()}</div><figcaption>المخطط الخطي للشكل <span class="ltr">(6-10)</span> (سمّاه الكتاب «الدائرة الرمزية»). <span class="ref">ص 136</span></figcaption></figure>`},
    {watch:'<p>في المخطط الخطي للشكل (6-10) كُتب عدد الموصلات «4» بين المحرك ومقاومة العضو الدوار، والأطراف ثلاثة فقط (K و L و M)؛ والصحيح 3.</p>',fix:true},
    {title:'مختبر مصغّر: حرّك ذراع البادئ',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مرحلة ذراع البادئ، وقارن تيار البدء وعزم البدء (والمحرك ساكن).',
     ins:[{k:'g',l:'مرحلة الذراع',seg:[[0,'1: كل المقاومة'],[1,'2'],[2,'3'],[3,'4: مقصورة']],v:3}],
     tp:{id:'u6-l2',defs:IM_DEFS()},
     calc:(s,v,B)=>{const c=imCalc(1,0,v.kr*IMC.R2*(3-s.g)/3);
      return {pic:`<div style="max-width:220px;margin:auto">${imRotorSVG({main:true,stage:s.g}).replace('viewBox="0 0 330 446"','viewBox="60 200 220 246"')}</div>`,
       bars:[{l:'تيار البدء (٪ من المقنن)',v:c.I*100,max:800,txt:DCML.fm(B,c.I*100,0)+' %',col:'--live'},{l:'عزم البدء (٪ من المقنن)',v:c.T*100,max:300,txt:DCML.fm(B,c.T*100,0)+' %',col:'--blue'}],
       msg:s.g===3?'المقاومة مقصورة: تيار البدء أكبر ما يكون، وعزم البدء صغير.':'مع مقاومة في العضو الدوار: التيار أصغر والعزم أكبر مما هو والمقاومة مقصورة.'}}})}
   ]},

  {st:4,short:'عكس الاتجاه',title:'عكس اتجاه دوران المحرك الحثي ثلاثي الأوجه (الشكل 6-11)',ref:'ص 137',
   q:'المحرك الحثي له ثلاثة خطوط… كم خطاً يجب أن نبدّل حتى ينعكس دورانه؟',
   art:DRA.art({aria:'الشكل 6-11: نجمة عادية تدور مع عقارب الساعة، ونجمة بعد تبديل L1 و L2 تدور عكسها',bg:'#E4ECF6',
    parts:[{svg:imRevSVG({conn:'Y',perm:[0,1,2],on:true}),box:[22,24,150,232],tips:[[80,186,60,56,'سهم الدوران: مع عقارب الساعة في التوصيل العادي.']]},
           {svg:imRevSVG({conn:'Y',perm:[1,0,2],on:true}),box:[188,24,150,232],tips:[[40,10,90,50,'الخطان ⟦L1⟧ و⟦L2⟧ متقاطعان: بُدّل طرفاهما.'],[80,186,60,56,'سهم الدوران: عكس عقارب الساعة بعد التبديل.']]}],
    extra:DRA.L(97,282,'نجمة عادية',13,700)+DRA.L(263,282,'بعد تبديل L1 و L2',13,700)}),
   cap:'رسمان من الشكل <span class="ltr">(6-11)</span>.<br><b>مرّر المؤشر على الخطين المتقاطعين وسهمي الدوران (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'كيف يُعكس اتجاه دوران المحرك الحثي ثلاثي الأوجه؟',opts:[
     ['بتبديل طرفي أي موصلين خارجيين',true,'ص 137 والشكل (6-11).'],
     ['بتبديل الخطوط الثلاثة دورياً (L1←L2←L3←L1)',false,'التبديل الدوري يبقي ترتيب الأوجه كما هو، فلا ينعكس الدوران.'],
     ['بتحويل النجمة إلى مثلث',false,'الشكل (6-11) يعكس الاتجاه في النجمة وفي المثلث كليهما بتبديل خطين.']]}}],
   body:[
    {book:'<p>يمكن عكس اتجاه الدوران في حالة المحركات الثلاثية الأوجه بتبديل طرفي أي موصلين خارجيين في المحرك الشكل (6-11).</p>',ref:'ص 137'},
    {tip:'<p>الأوجه الثلاثة تبلغ قممها بالترتيب L1 ثم L2 ثم L3، فيدور المجال من الملف الموصول بـ L1 إلى الموصول بـ L2 إلى الموصول بـ L3. تبديل أي خطين يقلب هذا الترتيب فيدور المجال، ومعه المحرك، في الاتجاه المعاكس. أما تبديل خطين مرة ثانية فيعيد الاتجاه الأصلي.</p>',title:'لماذا خطان فقط؟'},
    {add:'<p>في لوحات التحكم يُعكس الاتجاه بكونتاكتورين: أحدهما يوصل الخطوط كما هي والآخر يبدّل خطين، ولا يُسمح بعملهما معاً لأن ذلك قصر بين خطين.</p>',title:'في الواقع'},
    {title:'مختبر مصغّر: بدّل الخطوط',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر التوصيل والتبديل وانظر إلى سهم الدوران (منطق فقط بلا أرقام).',
     predict:{q:'بدّلنا L1 و L2، ثم بدّلنا L2 و L3. ما اتجاه الدوران؟',opts:[
      ['معكوس مرتين، أي الاتجاه الأصلي',true,'كل تبديل لخطين يعكس الاتجاه، فتبديلان يعيدانه.'],
      ['معكوس',false,'التبديل الثاني يعكس الاتجاه مرة أخرى.']]},
     ins:[{k:'c',l:'توصيل الملفات',seg:[['Y','نجمة'],['D','مثلث']],v:'Y'},
          {k:'p',l:'تبديل الخطوط',seg:[['p012','بلا تبديل'],['p102','L1 و L2'],['p021','L2 و L3'],['p210','L1 و L3'],['p120','L1 و L2 ثم L2 و L3']],v:'p012'}],
     calc:(s)=>{const P=s.p.slice(1).split('').map(Number),d=permDir(P),ln=['L1','L2','L3'];
      return {pic:`<div style="max-width:220px;margin:auto">${imRevSVG({conn:s.c,perm:P,on:true})}</div>`,
       facts:[['U ←',ln[P[0]]],['V ←',ln[P[1]]],['W ←',ln[P[2]]],['الدوران',d>0?'الأصلي ⟳':'معكوس ⟲',d>0?'':'hi']],
       msg:d>0?(s.p==='p012'?'التوصيل الأصلي.':'ترتيب الأوجه على U و V و W ما زال L1 ثم L2 ثم L3 (دورياً): الاتجاه الأصلي.'):'انقلب ترتيب الأوجه، فانعكس دوران المجال والمحرك.'}}})}
   ]},

  {recap:[
   'تيار بدء المحرك الحثي مع الجهد الكامل كبير، فنستعمل طريقة بدء تخفضه (ص 133).',
   'بادئ العضو الساكن: مقاومة على التوالي مع كل ملف وجه، تُقلَّل (المتغيرة) أو تُقصر (الثابتة) بعد زيادة السرعة (6-7، 6-8).',
   'نجمة ثم مثلث للمحرك الذي يعمل مثلثاً؛ وتوصيل المثلث في رسم الكتاب (6-9) يقصر الملف V، والصحيح W2←U1، U2←V1، V2←W1.',
   'مقاومة في العضو الدوار الملفوف: تيار بدء أصغر وعزم بدء أكبر (6-10). وتبديل أي خطين يعكس الاتجاه (6-11).']}
],
 theory:[
  {h:'6-3 دوائر بدء الحركة والتحكم في سرعة المحركات الحثية ثلاثية الأوجه',ref:'ص 133',html:`<p>عند توصيل المحرك الحثي ثلاثي الأوجه إلى مصدر الجهد مباشرة فإن التيار الذي يسحبه المحرك عند بدء الحركة مع تسليط الجهد الكامل على أطراف المحرك تكون قيمته كبيرة ، لذا فإنه يستلزم استخدام إحدى طرق بدء الحركة لتوصيل المحرك إلى المصدر والتي تؤدي إلى خفض التيار الذي يسحبه المحرك عند توصيله ومن هذه الطرق بدء التشغيل ببادئ تشغيل للعضو الساكن وفيه تستخدم إما مقاومة متغيرة أو مقاومة ثابتة عند الوصل تكون مع كل ملفات وجه مقاومة على التوالي كما في الشكل (6-7) أثناء زيادة سرعة الدوران تقلل المقاومات المتغيرة ، أما في حالة المقاومات الثابتة فإنه بعد زيادة سرعة الدوران تقصر مقاومات بدء التشغيل كما في الشكل (6-8).</p>`},
  {note:`${ADD}عند السكون لا يقطع العضو الدوار المجال الدوار بسرعة نسبية صغيرة كما في التشغيل العادي، بل بالسرعة التزامنية كلها، فيتولد فيه تيار كبير جداً يسحبه المحرك من الشبكة (يعمل كمحول ثانويه مقصور). كلما ارتفعت السرعة صغر هذا التيار. لذلك نضع مقاومة على التوالي مع كل ملف عند البدء ثم نخرجها.`},
  {fig:'(6-7)',ref:'ص 133',caption:'بدء تشغيل المحركات الحثية ثلاثية الأوجه ببادئ تشغيل للعضو الساكن. يساراً: مقاومة ثابتة وعلى التوازي معها تلامس مفتوح لكل ملف، والأطراف السفلى تتصل في نقطة نجمة. يميناً: مقاومات متغيرة، منزلقاتها مربوطة بخط واحد فتتحرك معاً.',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${box(imStatorSVG({kind:'fix'}),300)}${box(imStatorSVG({kind:'var',pos:0}),300)}</div>`},
  {fig:'(6-8)',ref:'ص 134',caption:'تغيير المقاومة وعلاقته بسرعة الدوران: سهم ⇑ بجانب كل تلامس تقصير (يساراً)، وسهم إلى أعلى على يسار المقاومات المتغيرة (تحريك المنزلقات معاً) (يميناً).',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${box(imStatorSVG({kind:'fix',arrows:1}),300)}${box(imStatorSVG({kind:'var',pos:0.5,arrows:1}),300)}</div>`},
  {html:`<p>يمكن أيضا بدء التشغيل بتوصيل نجمي- مثلثي وتستخدم هذه الطريقة إذا كانت توصيلة المحرك عندما يعمل عند حالة الأداء المستقر هي توصيلة المثلث أثناء بدء الحركة حيث تكون التوصيلة نجمة وتستمر حتى تزيد سرعة المحرك وينخفض التيار إلى قيمة مناسبة عندها يوصل المحرك على شكل مثلث كما في الشكل (6-9-أ و ب).</p>`},
  {note:String.raw`${ADD}في النجمة يقع على كل ملف جهد الوجه \(V_L/\sqrt{3}\) بدل جهد الخط \(V_L\) في المثلث، فيصغر تيار الخط وعزم البدء كلاهما إلى نحو الثلث. ولكي يعمل هذا البادئ يجب أن يُخرج المحرك أطراف ملفاته الستة U1 … W2، وأن يكون مصمماً للعمل مثلثاً على جهد الشبكة.`},
  {widget:el=>sdWidget(el)},
  {err:`<div class="fixnote">في الشكلين (6-9-أ) و(6-9-ب) أُخذت أسلاك المثلث إلى المفتاح هكذا: <span class="ltr">W2 ← L1</span> (صحيح)، لكن <span class="ltr">V2 ← L2</span> و<span class="ltr">U2 ← L3</span>. فعند نقل المفتاح إلى المثلث يصبح طرفا الملف V على الخط L2 نفسه (مقصوراً لا يعمل)، ويقع الملفان U و W كلاهما على الخطين L1 و L3، ولا يغذي L2 أي ملف، فلا يتكوّن مجال دوار ثلاثي الأوجه. الصحيح لتكوين المثلث: <span class="ltr">W2 ← U1 (L1)</span>، <span class="ltr">U2 ← V1 (L2)</span>، <span class="ltr">V2 ← W1 (L3)</span>. وفي «المصحح» بُدّل السلكان الذاهبان إلى الذراعين الثاني والثالث. وكذلك الرسمان (أ) و(ب) متطابقان في الكتاب عدا الرسم المساعد أعلى اليمين؛ هنا يظهر الذراع على النجمة في (أ) وعلى المثلث في (ب).</div>`},
  {h:'بدء المحرك ذي حلقات الانزلاق',ref:'ص 135',html:`<p>يمكن التحكم في بدء المحركات ثلاثية الأوجه ذات العضو الدوار الملفوف ذي حلقات الانزلاق بإضافة مقاومة على ملفات العضو الدوار عند بدء الدوران. فتصبح شدة تيار بدء الدوران أصغر وعزم دوران البدء يصبح أكبر كما في الشكل (6-10).</p>`},
  {fig:'(6-10)',ref:'ص 136',caption:'الدائرة التنفيذية (يساراً) والمخطط الخطي (يميناً) لبدء تشغيل المحركات ثلاثية الأوجه ذات العضو الدوار الملفوف ذي حلقات الانزلاق: مصاهر F1..3، مفتاح وقاية Q1 بمرحلات حرارية، لوحة أطراف العضو الساكن موصولة مثلثاً (U1–W2، V1–U2، W1–V2)، أطراف العضو الدوار K و L و M إلى ثلاث مقاومات متغيرة موصولة نجمة يحركها ذراع واحد.',draw:()=>`<div style="display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:10px;align-items:end"><div><div class="svgbox" style="max-width:340px;margin-inline:auto">${imRotorSVG({stage:0})}</div><p class="sub" style="text-align:center">الدائرة التنفيذية</p></div><div><div class="svgbox" style="max-width:190px;margin-inline:auto">${lineDia610()}</div><p class="sub" style="text-align:center">الدائرة الرمزية (مخطط خطي)</p></div></div>`},
  {h:'عكس اتجاه دوران المحرك الحثي',ref:'ص 137',html:`<p>يمكن عكس اتجاه الدوران في حالة المحركات الثلاثية الأوجه بتبديل طرفي أي موصلين خارجين في المحرك الشكل (6-11).</p>`},
  {fig:'(6-11)',ref:'ص 137',caption:'عكس اتجاه الدوران في المحركات ثلاثية الأوجه، من اليمين: نجمة عادية (مع عقارب الساعة)، نجمة مع تبديل L1 و L2 (عكس عقارب الساعة)، مثلث عادي، مثلث مع تبديل L1 و L2.',draw:()=>`<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;direction:ltr">${[['D',[1,0,2]],['D',[0,1,2]],['Y',[1,0,2]],['Y',[0,1,2]]].map(([c,p])=>`<div class="svgbox" style="margin:0">${imRevSVG({conn:c,perm:p,on:true})}</div>`).join('')}</div>`},
  {note:`${ADD}الأوجه الثلاثة تبلغ قممها بالترتيب L1 ثم L2 ثم L3، فيدور المجال من الملف الموصول بـ L1 إلى الموصول بـ L2 إلى الموصول بـ L3. تبديل أي خطين يقلب هذا الترتيب فيدور المجال، ومعه المحرك، في الاتجاه المعاكس. أما تبديل خطين مرة ثانية فيعيد الاتجاه الأصلي.`},
  {err:`<div class="fixnote"><ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 133: النص يربط المقاومات المتغيرة بالشكل (6-7) والثابتة المقصورة بالشكل (6-8)، بينما يعرض كل من الشكلين النوعين معاً (الثابت يساراً والمتغير يميناً)؛ الفرق أن (6-8) يضيف أسهم التشغيل.</li><li>ص 136: في المخطط الخطي للشكل (6-10) كُتب عدد الموصلات «4» بين المحرك ومقاومة العضو الدوار، والأطراف ثلاثة فقط (K و L و M)؛ والصحيح 3. وسُمّي المخطط الخطي «الدائرة الرمزية».</li><li>ص 137: «موصلين خارجين» والمقصود «خارجيين».</li></ul></div>`}
 ],
 lab:(el)=>imLab(el),
 examples:[
  {title:'مثال مرسوم: بادئ نجمة/مثلث (6-9) خطوة بخطوة',ref:'ص 134–135',q:`<p>ارسم دائرة بدء محرك ثلاثي الأوجه بمفتاح نجمة/مثلث كما في الشكل (6-9)، بالتوصيل المصحح للمثلث. (تُكشف الخطوط خطوة بعد خطوة.)</p>`,
   solve:()=>{const L=sdLayers({book:false,pos:'Y',main:false});const tx=['<b>1) الخطوط والمفتاح الرئيس:</b> L1 و L2 و L3 من أعلى، ومفتاح ثلاثي الأقطاب بذراع وخط ربط متقطع وسهم التشغيل ⇑.',
     '<b>2) الملفات:</b> بعد المفتاح عقدة على كل خط، ثم ينزل الخط إلى بداية ملفه: L1 ← U1، L2 ← V1، L3 ← W1. نهايات الملفات U2 و V2 و W2 في الأسفل، ورمز المحرك M يساراً.',
     '<b>3) مفتاح نجمة/مثلث:</b> ثلاثة تلامسات تحويل (ذراع متحرك لكل منها وطرفان ثابتان: أيسر وأيمن) يربطها خط متقطع إلى ذراع التشغيل.',
     '<b>4) نقطة النجمة:</b> الأطراف اليسرى الثلاثة تُربط بقضيب أفقي واحد عليه عقدة. حيث يعبر القضيب سلكاً آخر بلا عقدة رُسم قوس صغير.',
     '<b>5) نهايات الملفات إلى الأذرع:</b> W2 إلى الذراع الأول، V2 إلى الثاني، U2 إلى الثالث (أسلاك أفقية متدرجة في الأسفل). على النجمة تتصل النهايات الثلاث معاً.',
     '<b>6) الأطراف اليمنى (المثلث):</b> الأول من عقدة L1، الثاني من عقدة L3، الثالث من عقدة L2. فعلى المثلث: W2 مع U1، و V2 مع W1، و U2 مع V1، فيقع كل ملف على خطين مختلفين. (في الكتاب أُخذ الثاني من L2 والثالث من L3، وهذا يقصر الملف V — انظر الشرح.)'];
     return tx.map((t,k)=>({t:`${t}${box(`<svg viewBox="0 0 410 290" role="img" aria-label="رسم بادئ نجمة مثلث">${L.slice(0,k+1).join('')}</svg>`,460)}`,final:k===tx.length-1}))}}
 ],
 quiz:[
  {q:'لماذا نستعمل طريقة بدء للمحرك الحثي ثلاثي الأوجه بدل توصيله مباشرة؟',o:['لزيادة سرعته','لأن تيار البدء مع الجهد الكامل كبير','لعكس اتجاهه','لتقليل تردد الشبكة'],c:1,e:'ص 133: التيار الذي يسحبه المحرك عند البدء مع الجهد الكامل تكون قيمته كبيرة.'},
  {q:'في بادئ العضو الساكن بمقاومات ثابتة، متى تُقصر المقاومات؟',o:['قبل البدء','بعد زيادة سرعة الدوران','عند الإيقاف فقط','لا تُقصر'],c:1,e:'ص 133: بعد زيادة سرعة الدوران تقصر مقاومات بدء التشغيل.'},
  {q:'متى تستخدم طريقة البدء نجمة/مثلث؟',o:['إذا كان المحرك يعمل نجمة في التشغيل العادي','إذا كانت توصيلة المحرك في التشغيل المستقر مثلثاً','لمحركات التيار المستمر','لمحركات حلقات الانزلاق فقط'],c:1,e:'ص 134: تستخدم إذا كانت توصيلة المحرك عند حالة الأداء المستقر هي توصيلة المثلث.'},
  {q:'في الشكل (6-9) كما في الكتاب، ماذا يحدث عند نقل المفتاح إلى المثلث؟',o:['يعمل المحرك مثلثاً سليماً','يصبح طرفا الملف V على الخط L2 نفسه فيقصر','ينعكس الاتجاه','تبقى الملفات نجمة'],c:1,e:'V2 أُخذ إلى L2 (وهو متصل بـ V1)، فالملف V مقصور؛ الصحيح V2 ← W1.'},
  {q:'إضافة مقاومة على ملفات العضو الدوار لمحرك حلقات الانزلاق عند البدء تجعل:',o:['التيار أكبر والعزم أصغر','التيار أصغر وعزم البدء أكبر','التيار والعزم أصغر','لا تغيير'],c:1,e:'ص 135: تصبح شدة تيار بدء الدوران أصغر وعزم دوران البدء يصبح أكبر.'},
  {q:'كيف يُعكس اتجاه دوران المحرك الحثي ثلاثي الأوجه؟',o:['بتبديل الخطوط الثلاثة دورياً','بتبديل طرفي أي موصلين خارجيين','بفصل خط واحد','بتغيير النجمة إلى مثلث'],c:1,e:'ص 137 والشكل (6-11): تبديل أي خطين يعكس تتابع الأوجه.'}
 ]
});

/* =====================================================================
   Lesson u6-l3 — exercises (6-12 … 6-15)
   ===================================================================== */
/* horizontal wire with hops over vertical wires at xs (y fixed) */
function hopH(x1,x2,y,xs,c){const dir=x2>x1?1:-1;let d=`M${x1} ${y}`;(xs||[]).filter(x=>(x-x1)*dir>6&&(x2-x)*dir>6).sort((a,b)=>(a-b)*dir).forEach(x=>{d+=`H${x-6*dir}a6 6 0 0 ${dir>0?1:0} ${12*dir} 0`});return S.w(d+`H${x2}`,c)}
const lbl=(x,y,s,a,fs)=>T(x,y,s,'',a||'middle',fs||10.5);
const frameDD=(x,y,w,h)=>dashBox(x,y,w,h);
/* motor-protective circuit breaker, 3 poles at x0, x0+22, x0+44; top terminals at y, bottom at yb */
function mpcb(x0,y,o){o=o||{};const px=[x0,x0+22,x0+44],yb=y+(o.mag?72:52);let s='';
  px.forEach((x,i)=>{s+=`<path class="sym" d="M${x-4} ${y+3}H${x+4}" stroke-width="1.3"/><path class="sym" d="M${x} ${y+24}L${x-10} ${y+6}"/>`+S.w(`M${x} ${y}V${y+2}`)+S.w(`M${x} ${y+24}V${yb}`)+
    `<rect x="${x-7}" y="${y+30}" width="14" height="16" class="sym" fill="var(--surface)"/><path class="sym dim" d="M${x-4} ${y+42}h4v-8h4" stroke-width="1.3"/>`+
    (o.mag?`<rect x="${x-7}" y="${y+50}" width="14" height="16" class="sym" fill="var(--surface)"/>`+T(x,y+62,'I>','',null,8):'')+
    T(x+7,y-3,String(2*i+1),'m','start',9)+T(x+7,yb+10,String(2*i+2),'m','start',9)});
  const hx=x0-30;s+=`<rect x="${hx-5}" y="${y+7}" width="10" height="10" class="sym" fill="var(--surface)"/><path class="sym" d="M${hx} ${y+7}v10M${hx-5} ${y+12}h10" stroke-width="1"/>`+`<path class="mech" d="M${hx+5} ${y+12}H${x0+40}M${hx+5} ${y+12}V${y+38}H${x0-7}${o.mag?`M${hx+5} ${y+38}V${y+58}H${x0-7}`:''}"/>`;
  if(o.bridge)s+=S.w(`M${px[1]} ${y}V${y-9}H${px[2]}V${y}`);
  return {s,px,y,yb}}
/* terminal board: items [[label,x,y],…] */
/* terminal board: items [[label,x,y,row]] row 't' → label above-right, 'b' → label below-left */
function tboard(x,y,w,h,items,name){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--fg)" stroke-width="1.2"/>`+lbl(x-2,y-4,name,'end',10);
  items.forEach(([l,tx,ty,r])=>{s+=dot(tx,ty)+(r==='b'?T(tx-4,ty+12,l,'','end',9):T(tx+4,ty-5,l,'','start',9))});return s}
/* manual multi-step starter R1 with -X2 slots (L, A[, E]) */
function starterBox(x,y,slots,o){o=o||{};const h=slots.length*14;let s=frameDD(x,y,104,Math.max(64,h+30))+lbl(x-6,y+28,'-R1','end');
  slots.forEach((l,i)=>{s+=`<rect x="${x+6}" y="${y+6+i*14}" width="18" height="14" fill="none" stroke="var(--fg)" stroke-width="1"/>`+T(x+15,y+17+i*14,l,'',null,9)});
  s+=T(x+15,y+20+h,'-X2','',null,9);
  s+=`<path class="mech" d="M${x+104} ${y+30}H${x+122}"/><path class="sym" d="M${x+122} ${y+23}V${y+37}" stroke-width="1.6"/>`;
  return s}
/* DC line-diagram pieces (vertical at x) */
const slashes=(x,y,n)=>{let s='';for(let i=0;i<n;i++)s+=`<path class="sym" d="M${x-6} ${y+5+i*5}l12 -8" stroke-width="1.2"/>`;return s};
const lineQ=(x,y,o)=>{o=o||{};return `<path class="sym" d="M${x} ${y+24}L${x-10} ${y+6}"/><path class="sym" d="M${x-4} ${y+3}H${x+4}" stroke-width="1.3"/>`+`<path class="mech" d="M${x-28} ${y+14}H${x-6}"/>`+handle(x-30,y+14)+
  `<path class="sym" d="M${x+10} ${y+30}h4v-6h6v6h4" stroke-width="1.3"/>`+T(x+30,y+30,'3','','start',9)+(o.mag?`<path d="M${x+24} ${y+42}H${x+12}" stroke="var(--fg)" stroke-width="1.3"/>`+head(x+11,y+42,'l')+T(x+30,y+46,'3','','start',9):'')};
const starterSym=(x,y)=>`<rect x="${x}" y="${y}" width="30" height="22" class="sym" fill="var(--surface)"/><path class="sym" d="M${x} ${y}L${x+15} ${y+11}L${x+30} ${y}" stroke-width="1.2"/>`;
const dcMotSym=(x,y,dir)=>`<circle cx="${x}" cy="${y}" r="15" class="coil"/>`+T(x,y+4,'M')+`<path class="sym" d="M${x-6} ${y+8}H${x+6}" stroke-width="1.3"/>`+(dir?rotArr(x,y,15,dir,'var(--fg)'):'');

/* ---- exercise 1 & 2 & 3 sheets: common frame ---- */
const DCVB='0 0 520 352';
function dcSheet(k){/* k: 1, 2, 3 → given figure fragments + key points */
  let s='';const ex3=k===3;
  if(!ex3){s+=T(64,12,'220V –; 2','',null,10)+lbl(16,28,'L+','end')+lbl(16,40,'L-','end')+S.w('M20 24H300')+S.w('M20 36H300')}
  else s+=dot(80,22)+lbl(86,26,'L+','start')+dot(130,22)+lbl(136,26,'L-','start');
  const Q=mpcb(120,62,{mag:k===1,bridge:!ex3});s+=Q.s+lbl(60,94,'-Q1','end');
  if(!ex3){s+=dot(120,24)+S.w('M120 24V62')+dot(190,36)+S.w(`M190 36V${Q.yb+14}H164V${Q.yb}`)+S.w(`M120 ${Q.yb}V${Q.yb+8}`)+S.w(`M142 ${Q.yb}V${Q.yb+8}`)}
  if(ex3)s+=`<rect x="58" y="100" width="12" height="12" class="sym" fill="none" stroke-width="1"/><rect x="61" y="103" width="6" height="6" class="sym" fill="none" stroke-width="1"/>`;
  if(k===1)s+=AR(330,112,'المفاتيح الثلاثية الأقطاب',{fs:10,col:'--muted'})+AR(330,125,'متداولة تجاريا',{fs:10,col:'--muted'});
  s+=frameDD(40,212,212,134)+lbl(34,280,'-M1','end');
  let tb;if(k===1)tb={B1:[100,238,'t'],D1:[150,238,'t'],D2:[100,254,'b'],A2:[150,254,'b']};
  else if(k===2)tb={E2:[100,238,'t'],B1:[140,238,'t'],E1:[180,238,'t'],D2:[100,254,'b'],D1:[140,254,'b'],A2:[180,254,'b']};
  else tb={E2:[100,238,'t'],'1B1':[140,238,'t'],E1:[180,238,'t'],PE:[220,238,'t'],D2:[100,254,'b'],D1:[140,254,'b'],'2B2':[180,254,'b']};
  s+=tboard(84,226,ex3?156:(k===1?92:122),42,Object.entries(tb).map(([l,[x,y,r]])=>[l,x,y,r]),'-X1');
  if(ex3)s+=`<path class="sym" d="M300 286V296M292 296h16M295 300h10M298 304h4" stroke-width="1.3"/><rect x="314" y="282" width="14" height="14" fill="none" stroke="var(--fg)" stroke-width="1"/>`+T(321,293,'E','',null,10);
  const sl=k===1?['L','A']:['L','A','E'];const sx=262,sy=170;s+=starterBox(sx,sy,sl);
  if(k===1)s+=resH(300,sy+40,44)+`<path class="sym" d="M300 ${sy+50}l44 -20" stroke-width="1.2"/>`+head(344,sy+30,'u')+S.w(`M${sx+24} ${sy+13}H330V${sy+30}`)+head(330,sy+33,'d')+S.w(`M${sx+24} ${sy+27}H292V${sy+40}H300`);
  else if(k===2)s+=resH(300,sy+38,44)+`<path class="sym" d="M300 ${sy+48}l44 -20" stroke-width="1.2"/>`+S.w(`M${sx+24} ${sy+13}H354V${sy+26}`)+head(354,sy+31,'d')+S.w(`M354 ${sy+13}V${sy+56}`)+dot(354,sy+13)+head(338,sy+60,'d')+S.w(`M354 ${sy+56}H338V${sy+58}`)+S.w(`M${sx+24} ${sy+27}H292V${sy+38}H300`)+S.w(`M${sx+24} ${sy+41}H286V${sy+66}H330`)+dot(286,sy+52)+S.w(`M286 ${sy+52}H300V${sy+44}`);
  else s+=S.w(`M${sx+24} ${sy+13}H352`)+dot(352,sy+13)+S.w(`M352 ${sy+13}V${sy+40}H340`)+head(340,sy+46,'d')+S.w(`M340 ${sy+40}V${sy+42}`)+S.w(`M352 ${sy+40}V${sy+60}H340V${sy+64}`)+head(340,sy+68,'d')+`<rect x="${sx+6}" y="${sy+56}" width="12" height="12" class="sym" fill="none" stroke-width="1"/><rect x="${sx+9}" y="${sy+59}" width="6" height="6" class="sym" fill="none" stroke-width="1"/>`;
  const lx=440;
  if(k===1){s+=T(lx,32,'220V –; 2','',null,10)+S.w(`M405 46H475`)+slashes(lx-18,40,2)+dot(lx,46)+S.w(`M${lx} 46V70`)+lineQ(lx,70,{mag:true})+lbl(lx-38,78,'-Q1','end')+S.w(`M${lx} 94V170`)+slashes(lx,128,2)+starterSym(lx+12,150)+lbl(lx+48,164,'-R1','start')+dot(lx,170)+lbl(lx-24,286,'-M1','end')+dcMotSym(lx,280,1)+S.w(`M${lx} 295V304`)}
  else if(k===2){s+=T(lx,32,'220V –; 2','',null,10)+S.w(`M405 46H475`)+slashes(lx-18,40,2)+dot(lx,46)+dot(lx,190)+S.w(`M${lx} 190V214`)+slashes(lx,196,1)+T(lx+10,206,'3','','start',9)+dot(lx,224)+S.w(`M${lx} 214V264`)+slashes(lx+16,230,2)+S.w(`M${lx} 224H${lx+26}`)+dcMotSym(lx,280,-1)}
  else{s+=dot(lx,22)+lbl(lx+6,26,'220V-','start')+starterSym(lx+6,110)+lbl(lx-4,124,'-R1','end')}
  return {s,Q,tb,sx,sy,lx}}

/* horizontal DC motor (brushes left/right) centred at (cx,cy) */
const dcMotHz=(cx,cy)=>`<circle cx="${cx}" cy="${cy}" r="10" class="coil"/>`+T(cx,cy+3,'M','',null,9)+`<rect x="${cx-15}" y="${cy-4}" width="5" height="8" fill="var(--fg)"/><rect x="${cx+10}" y="${cy-4}" width="5" height="8" fill="var(--fg)"/>`;
/* proposed solutions (layers) */
function dcSolution(k){const G=dcSheet(k),L=[];const ex3=k===3;const yb=G.Q.yb,sx=G.sx,sy=G.sy,lx=G.lx;let n=1;const N=()=>n++;
  L.push(['<b>المعطى:</b> ورقة التمرين كما هي (انظرها أعلاه): التغذية ومفتاح الوقاية Q1 ولوحة أطراف المحرك -X1 وبادئ التشغيل -R1 وجزء من المخطط الخطي. نضيف إليها خطوة بعد خطوة.',G.s]);
  if(ex3)L.push([`<b>${N()}) التغذية عبر Q1:</b> L+ إلى القطب الأول، و L− إلى القطب الثالث، ونصل القطبين الثاني والثالث بقنطرة 3–5 (كما في التمرينين السابقين) حتى يقطع المفتاح الموصلين معاً.`,
    S.w('M80 22V40H120V62')+S.w(`M130 22V32H190V${yb+14}H164V${yb}`)+S.w('M142 62V53H164V62')+S.w(`M120 ${yb}V${yb+8}`)+S.w(`M142 ${yb}V${yb+8}`)]);
  let m,mt;
  if(k===1){mt=`<b>${N()}) داخل المحرك:</b> العضو الدوار مع ملف الأقطاب البينية (المستطيل الصغير) بين B1 و A2، وملف التوالي (المستطيل الأسود الطويل) بين D1 و D2.`;
    m=S.w('M100 238H78V264')+blk(74,264,8,12)+S.w('M78 276V300')+hopH(78,105,300,[100])+dcMotHz(120,300)+S.w('M135 300H150V254')+S.w('M150 238H162V334H100V254')+blk(158,272,8,32)}
  else{mt=`<b>${N()}) داخل المحرك:</b> العضو الدوار مع ${ex3?'الأقطاب البينية بين 1B1 و 2B2':'ملف الأقطاب البينية بين B1 و A2'}، وملف التوالي بين D1 و D2، وملف التوازي (الأطول) بين E1 و E2.`;
    m=S.w('M100 238H76V330H112')+blk(112,326,56,8)+S.w('M168 330H192V238H180')+S.w('M140 238H150V276')+blk(146,276,8,12)+S.w('M150 288V306H155')+dcMotHz(170,306)+S.w('M185 306H180V254')+S.w('M100 254V284H106')+blk(106,280,28,8)+S.w('M134 284H140V254')}
  L.push([mt,m]);
  if(k===1)L.push([`<b>${N()}) قنطرة التوالي:</b> نصل A2 بـ D1 على اللوحة، فيصير العضو الدوار وملف التوالي على التوالي.`,`<path d="M150 254V238" stroke="var(--blue)" stroke-width="3"/>`]);
  else L.push([`<b>${N()}) قنطرتان على اللوحة:</b> ${ex3?'1B1':'B1'} مع D1 (العضو مع ملف التوالي)، و E2 مع D2 (نهاية ملف التوازي إلى السالب).`,`<path d="M140 238V254M100 238V254" stroke="var(--blue)" stroke-width="3"/>`]);
  L.push([`<b>${N()}) الموجب إلى البادئ:</b> من الطرف 2 في Q1 إلى الطرف L في -X2.`,S.w(`M120 ${yb+8}V${yb+28}H248V${sy+13}H${sx+6}`)]);
  if(k===1)L.push([`<b>${N()}) من البادئ إلى المحرك:</b> من الطرف A في -X2 إلى B1.`,S.w(`M${sx+6} ${sy+27}H236V218H100V238`)]);
  else L.push([`<b>${N()}) من البادئ إلى المحرك:</b> الطرف A إلى ${ex3?'2B2':'A2'} (يدخل التيار العضو من طرفه الثاني لأن الدوران إلى اليسار)، والطرف E إلى E1 (ملف التوازي يأخذ جهده من البادئ قبل المقاومة، فيبقى المجال كاملاً عند البدء).`,
    S.w(`M${sx+6} ${sy+27}H240V266`)+hopH(240,180,266,ex3?[220,192]:[192])+S.w('M180 266V254')+S.w(`M${sx+6} ${sy+41}H252V222`)+hopH(252,180,222,[240])+S.w('M180 222V238')]);
  L.push([`<b>${N()}) السالب:</b> من D2 إلى الطرف 4 في Q1 (يعود عبر القطبين 3–4 و 5–6).`,S.w(`M142 ${yb+8}V${yb+18}`)+hopH(142,54,yb+18,[120])+S.w(`M54 ${yb+18}V254`)+hopH(54,100,254,[k===1?78:76])]);
  if(ex3)L.push([`<b>${N()}) التأريض الوقائي:</b> طرف PE في لوحة المحرك إلى طرف التأريض E. <span class="sub">(الرمز ⧈ بجانب Q1 و R1 يعني عزلاً مزدوجاً فلا يحتاجان موصل وقاية — توضيح للمتدرب ليس من الكتاب.)</span>`,S.w('M220 238V340H321V296')]);
  if(k===1)L.push([`<b>${N()}) المخطط الخطي:</b> نكمل الخط من العقدة إلى المحرك -M1، ونكتب شرطتين (موصلان) على الخط. السهم فوق المحرك إلى اليمين.`,S.w(`M${lx} 170V264`)+slashes(lx,212,2)]);
  else if(k===2)L.push([`<b>${N()}) المخطط الخطي:</b> من خط التغذية إلى Q1 (رمز حراري فقط: بلا فصل مغناطيسي) ثم البادئ -R1 ثم المحرك؛ والسهم فوق المحرك إلى اليسار.`,S.w(`M${lx} 46V70`)+lineQ(lx,70)+lbl(lx-38,78,'-Q1','end')+S.w(`M${lx} 94V190`)+slashes(lx,120,2)+starterSym(lx+12,150)+lbl(lx+48,164,'-R1','start')]);
  else L.push([`<b>${N()}) المخطط الخطي:</b> من 220V- إلى Q1 (حراري ومغناطيسي) ثم البادئ -R1 ثم المحرك M بسهم إلى اليسار.`,S.w(`M${lx} 22V50`)+lineQ(lx,50,{mag:true})+lbl(lx-38,58,'-Q1','end')+S.w(`M${lx} 74V200`)+slashes(lx,90,2)+dot(lx,121)+S.w(`M${lx} 121H${lx+6}`)+slashes(lx,160,3)+dcMotSym(lx,216,-1)]);
  const chk=k===1?'L+ ← Q1 (1–2) ← L ← المقاومة ← A ← B1 ← الأقطاب البينية ← العضو ← A2 ← D1 ← ملف التوالي ← D2 ← Q1 (4–3، 5–6) ← L−. التيار يمر في العضو وفي ملف التوالي من الطرف 1 إلى الطرف 2 في كليهما، فيدور المحرك إلى اليمين.'
    :`العضو: من ${ex3?'2B2 إلى 1B1':'A2 إلى B1'} (معكوس)، وملف التوالي من D1 إلى D2، وملف التوازي من E1 إلى E2. انعكس تيار العضو وحده بالنسبة للمجالين، فيدور المحرك إلى اليسار.`;
  L.push([`<b>التحقق من الاتجاه:</b> ${chk} <span class="sub">(قاعدة تسمية الأطراف: إذا مر التيار في العضو وفي ملف المجال من الطرف 1 إلى الطرف 2 كان الدوران إلى اليمين — توضيح للمتدرب ليس من الكتاب.)</span>`,'']);
  return L}

/* ---- exercise 4 (6-15) sheet ---- */
const E4VB='0 0 700 600';
const FX=[270,300,330];
function s3sym(x,y,closed){return `<path class="sym" d="M${x} ${y}V${y+6}M${x} ${y+22}V${y+28}"/>`+(closed?`<path class="sym" d="M${x} ${y+22}L${x} ${y+6}"/>`:`<path class="sym" d="M${x} ${y+22}L${x-9} ${y+8}"/>`)}
function ex4Sheet(){let s='';
  s+=`<path d="M200 20V452M10 452H690" stroke="var(--muted)" stroke-width="1"/>`;
  s+=AR(100,440,'مخطط رمزي',{fs:11,col:'--muted'})+AR(450,440,'جمع بين مخطط مسار التيار ومخطط التوصيلات ومخطط الترتيب',{fs:10.5,col:'--muted'})+AR(110,592,'مخطط مسار التيار للتحكم',{fs:11,col:'--muted'});
  /* symbolic field */
  s+=T(100,40,'380/220V; 3/N/PE ~ 60Hz','',null,9)+S.w('M30 48H170')+dot(100,48)+`<circle cx="100" cy="290" r="22" class="sym"/><circle cx="100" cy="290" r="16" class="sym"/>`;
  /* power field: bars */
  s+=T(460,16,'380/220V, 3/N/PE ~ 60Hz','',null,9);['L1','L2','L3','N'].forEach((l,i)=>{s+=lbl(232,34+i*10,l,'end',9.5)+S.w(`M236 ${30+i*10}H690`,'live')});s+=lbl(232,76,'PE','end',9.5)+`<path d="M236 72H690" stroke="var(--fg)" stroke-width="1.3" stroke-dasharray="9 3 2 3"/>`;
  s+=lbl(352,98,'-F1-3','start')+lbl(352,112,'-F4','start');
  /* K1: coil + aux 13/14 */
  s+=lbl(258,146,'-K1','end')+`<path class="sym" d="M372 128V134M372 150V156M372 150L363 136" stroke-width="1.4"/>`+T(380,130,'13','m','start',8)+T(380,158,'14','m','start',8)+`<path class="mech" d="M370 142H392"/><rect x="392" y="134" width="28" height="16" class="sym" fill="var(--surface)"/>`+T(406,129,'A2','m',null,8)+T(406,162,'A1','m',null,8);
  /* F5 */
  s+=lbl(258,190,'-F5','end');FX.forEach((x,i)=>{s+=`<rect x="${x-8}" y="176" width="16" height="20" class="sym" fill="var(--surface)"/><path class="sym dim" d="M${x-4} 191h4v-10h4" stroke-width="1.2"/>`+T(x+7,206,String(2*i+2),'m','start',8)});
  s+=`<path class="sym" d="M372 172V178M372 194V200M372 178H380M372 194L381 180" stroke-width="1.4"/>`+T(366,174,'95','m','end',8)+T(366,202,'96','m','end',8)+`<path class="mech" d="M338 186H374"/>`;
  /* S1 S2 */
  s+=lbl(238,262,'-S1','end')+`<path class="sym" d="M256 244V250M256 266V272M256 250H264M256 266L265 252" stroke-width="1.4"/><path class="mech" d="M242 258H260"/>`+handle(240,258)+T(262,242,'11','m','start',8)+T(262,280,'12','m','start',8);
  s+=lbl(238,308,'-S2','end')+`<path class="sym" d="M256 292V298M256 314V320M256 314L247 300" stroke-width="1.4"/><path class="mech" d="M242 306H250"/>`+handle(240,306)+T(262,292,'13','m','start',8)+T(262,326,'14','m','start',8);
  /* R1 + S3 */
  const rx=[290,330,370];s+=lbl(236,392,'-R1','end')+handle(242,360)+`<path class="mech" d="M248 360H${rx[2]}"/>`;
  rx.forEach((x,i)=>{s+=dot(x,360)+S.w(`M${x} 360V372`)+S.w(`M${x} 372H${x+6}`)+head(x+12,372,'r')+`<path class="sym" d="M${x+14} 378L${x+30} 410" stroke-width="2"/>`+T(x+24,412,String(i+1),'m','end',9)});s+=T(282,412,'PE','m','end',8);
  s+=lbl(396,318,'-S3','end')+s3sym(410,306,true)+T(416,306,'13','m','start',8)+T(416,336,'14','m','start',8)+`<rect x="392" y="340" width="8" height="8" class="sym" fill="none" stroke-width="1"/><path class="mech" d="M396 348V360M400 320H404"/>`+dblUp(428,316);
  /* M1 */
  s+=frameDD(470,236,210,196)+lbl(478,352,'-M1','start')+lbl(478,366,'380V Δ','start',9)+tboard(486,254,178,42,[['U1',504,268,'t'],['V1',544,268,'t'],['W1',584,268,'t'],['PE',630,268,'t'],['W2',504,284,'b'],['U2',544,284,'b'],['V2',584,284,'b']],'-X1')+`<path class="sym" d="M630 272V290M622 290h16M625 294h10M628 298h4" stroke-width="1.2"/>`;
  s+=acMot(575,336,16,false)+tboard(520,382,112,26,[['K',536,398,'t'],['L',572,398,'t'],['M',608,398,'t']],'-X2');
  /* control field */
  s+=lbl(30,476,'L1')+S.w('M30 482V580')+dot(30,510)+S.w('M30 510H52')+`<rect x="52" y="504" width="26" height="12" class="sym" fill="var(--surface)"/>`+S.w('M78 510H90')+T(50,500,'1','m',null,8)+T(82,500,'2','m',null,8)+lbl(66,532,'-F4');
  [['95',128],['96',160],['11',218],['12',250],['13',304],['14',336]].forEach(([n,x])=>{s+=T(x,500,n,'m',null,9)});
  s+=lbl(670,476,'N')+S.w('M670 482V580')+dot(670,510);
  return s}
/* exercise-4 control rung (bottom field); o:{upTo, live:{F5trip,S1,S2,S3,K1}} */
function ctrl4(o){o=o||{};const y=510,L=o.live;let s='';
  const NC=(x,yy,closed,ci,co)=>S.w(`M${x} ${yy}H${x+8}`,ci)+S.w(`M${x+28} ${yy}H${x+40}`,co)+`<path class="sym" d="M${x+27} ${yy}V${yy-10}" stroke-width="1.3"/>`+(closed?`<path class="sym${ci&&co?' hot':''}" d="M${x+8} ${yy}L${x+29} ${yy-1}"/>`:`<path class="sym" d="M${x+8} ${yy}L${x+25} ${yy+12}"/>`);
  const NO=(x,yy,closed,ci,co)=>S.w(`M${x} ${yy}H${x+8}`,ci)+S.w(`M${x+28} ${yy}H${x+40}`,co)+(closed?`<path class="sym${ci&&co?' hot':''}" d="M${x+8} ${yy}L${x+28} ${yy-1}"/>`:`<path class="sym" d="M${x+8} ${yy}L${x+25} ${yy-12}"/>`);
  const f=v=>L&&v?'flow':'';
  const p1=!!L,p2=p1&&!L.F5trip,p3=p2&&!L.S1,pS2=p3&&L.S2,pS3=pS2&&L.S3,pK=p3&&L.K1,pc=L&&L.K1;
  s+=S.w(`M90 ${y}H120`,f(p1))+NC(120,y,!L||!L.F5trip,f(p1),f(p2))+lbl(140,y+24,'-F5');
  s+=S.w(`M160 ${y}H210`,f(p2))+NC(210,y,!L||!L.S1,f(p2),f(p3))+lbl(230,y+24,'-S1');
  if(o.upTo===1)return s;
  s+=S.w(`M250 ${y}H296`,f(p3))+dot(296,y)+S.w(`M296 ${y}V${y+34}`,f(p3));
  s+=NO(296,y,!!(L&&L.S2),f(p3),f(pS2))+lbl(316,y-18,'-S2')+S.w(`M336 ${y}H350`,f(pS2))+NO(350,y,!L||!!L.S3,f(pS2),f(pS3))+lbl(370,y-18,'-S3');
  s+=NO(296,y+34,!!(L&&L.K1),f(p3),f(pK))+lbl(316,y+54,'-K1')+S.w(`M336 ${y+34}H400V${y}`,f(pK));
  s+=S.w(`M390 ${y}H470`,f(pc))+dot(400,y)+`<rect x="470" y="${y-10}" width="34" height="20" class="coil ${pc?'on':''}"/>`+T(487,y+5,'K1','',null,10)+T(466,y-12,'A1','m','end',8)+T(508,y-12,'A2','m','start',8)+S.w(`M504 ${y}H670`,f(pc))+lbl(487,y+24,'-K1');
  [['13',300],['14',332],['13',354],['14',386]].forEach(([n,x])=>{s+=T(x,y+14,n,'m',null,8)});s+=T(300,y+48,'13','m',null,8)+T(332,y+48,'14','m',null,8);
  return s}
/* exercise-4 solution layers */
function ex4Solution(){const L=[];
  L.push(['<b>المعطى:</b> ورقة التمرين (انظرها أعلاه) بثلاثة حقول: المخطط الرمزي، والمخطط الجامع (القوى والتوصيل والترتيب)، ومخطط مسار التيار للتحكم.',ex4Sheet()]);
  let p='';FX.forEach((x,i)=>{p+=dot(x,30+i*10)+S.w(`M${x} ${30+i*10}V86`)+S.fuse(x,86)+S.w(`M${x} 110V122`)+`<path class="sym" d="M${x} 146L${x-9} 128"/><path class="sym" d="M${x-4} 124H${x+4}" stroke-width="1.2"/>`+S.w(`M${x} 122V124`)});
  L.push(['<b>1) المصاهر والكونتاكتور:</b> من L1 و L2 و L3 إلى المصاهر F1-3، ثم إلى التلامسات الرئيسة الثلاثة للكونتاكتور K1 (تُرسم فوق ملفه، ويربطها به خط ترتيب متقطع).',p+`<path class="mech" d="M262 138H364"/>`]);
  let q='';FX.forEach(x=>{q+=S.w(`M${x} 146V176`)});
  q+=S.w('M270 196V214H504V268')+S.w('M300 196V208H544V268')+S.w('M330 196V202H584V268')+`<path d="M504 268V284M544 268V284M584 268V284" stroke="var(--blue)" stroke-width="3"/>`+`<path d="M630 268V244H684V72" stroke="var(--fg)" stroke-width="1.3" stroke-dasharray="9 3 2 3" fill="none"/>`+dot(684,72);
  L.push(['<b>2) المرحل الحراري F5 ثم المحرك:</b> من K1 إلى الخانات الحرارية في F5، ومن أطرافها 2 و 4 و 6 إلى U1 و V1 و W1. وعلى اللوحة قناطر المثلث (380 V Δ): U1–W2، V1–U2، W1–V2. والطرف PE إلى قضيب PE.',q]);
  L.push(['<b>3) العضو الدوار إلى البادئ:</b> أطراف حلقات الانزلاق K و L و M في -X2 إلى الأطراف 1 و 2 و 3 في البادئ -R1. نقطة النجمة هي قضيب المنزلقات الذي يحركه الذراع.',
    S.w('M536 398V426')+hopH(536,320,426,[])+S.w('M320 426V410')+S.w('M572 398V420')+hopH(572,360,420,[536])+S.w('M360 420V410')+S.w('M608 398V414')+hopH(608,400,414,[572,536])+S.w('M400 414V410')]);
  L.push(['<b>4) المفتاح المساعد S3:</b> مرتبط بذراع البادئ (الخط المتقطع والكامة)؛ يكون <b>مغلقاً فقط</b> والذراع في وضعه الأولي (كل المقاومة في الدائرة)، فيُستعمل في دائرة التحكم لمنع التشغيل في غير هذا الوضع.','']);
  L.push(['<b>5) دائرة التحكم — الوقاية والإيقاف:</b> من L1 عبر المصهر F4 ثم التلامس المغلق 95–96 للمرحل الحراري F5 ثم زر الإيقاف S1 (11–12 مغلق).',ctrl4({upTo:1})]);
  L.push(['<b>6) التشغيل مع شرط البادئ:</b> زر التشغيل S2 (13–14) على التوالي مع S3 (13–14)، وعلى التوازي معهما التلامس المساعد K1 (13–14) للتثبيت الذاتي. ثم ملف K1 (A1–A2) إلى N.',ctrl4({upTo:2}).replace(ctrl4({upTo:1}),'')]);
  L.push(['<b>7) المخطط الرمزي:</b> خط التغذية ← المصاهر (3) ← K1 ← المرحل الحراري F5 ← المحرك 3~ Δ ← (3) ← البادئ -R1.',
    S.w('M100 48V70')+S.fuse(100,70)+lbl(84,86,'-F1-3','end',9)+S.w('M100 94V128')+slashes(100,104,3)+`<path class="sym" d="M100 152L91 134"/><path class="sym" d="M96 130H104" stroke-width="1.3"/>`+lbl(84,146,'-K1','end',9)+S.w('M100 152V184')+`<path class="sym" d="M110 176h4v-6h6v6h4" stroke-width="1.3"/>`+lbl(130,176,'-F5','start',9)+S.w('M100 184V268')+slashes(100,226,3)+T(126,270,'3~ Δ','','start',9)+T(100,295,'M')+S.w('M100 312V350')+slashes(100,324,3)+starterSym(85,350)+lbl(80,366,'-R1','end',9)]);
  L.push(['<b>لماذا يمنع S3 التشغيل؟</b> S3 في فرع التشغيل فقط (مع S2)، لا في فرع التثبيت. فإذا لم يكن الذراع في وضعه الأولي يبقى S3 مفتوحاً، فلا يصل التيار إلى ملف K1 مهما ضُغط S2. وبعد التشغيل يحرك المشغل الذراع فيُفتح S3، لكن K1 يبقى مثبتاً عبر تلامسه 13–14. جرّب ذلك في المختبر.','']);
  return L}

/* lab for u6-l3: exercise 4 control logic */
function ex4Lab(el){const st={S1:false,S2:false,F5trip:false,K1:false,stage:0,ang:0,w:0,tries:0,blocked:false,ranAndMoved:false};
  el.innerHTML=`<div class="grid d6">
   <div class="panel c12"><h2>دائرة التحكم المقترحة للتمرين (4) <small>الشكل (6-15) ص 141 — حل مقترح (ليس من الكتاب)، منطق فقط بلا أرقام</small></h2>
    <div class="d6-row"><button class="pb green" id="s2"><span class="cap">I</span><small>S2 تشغيل</small></button><button class="pb red" id="s1"><span class="cap">O</span><small>S1 إيقاف</small></button>${swHTML('f5','F5','فصل المرحل الحراري (حمل زائد)',false)}</div>
    <div class="d6-row"><span class="sub">ذراع بادئ العضو الدوار -R1:</span>${segHTML('stage',[[0,'1: الوضع الأولي (كل المقاومة)'],[1,'2'],[2,'3'],[3,'4: مقصورة']],0)}</div></div>
   <div class="panel c12"><h2>مسار التيار في دائرة التحكم</h2><div class="svgbox" id="cfig" style="max-width:900px;margin-inline:auto;overflow-x:auto"><div style="min-width:560px"></div></div><div class="d6-msg" id="msg"></div></div>
   <div class="panel c12"><h2>المحرك</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;align-items:center"><div class="svgbox" id="mfig" style="max-width:220px;margin:0 auto"></div><div class="facts" id="facts" style="margin-top:0"></div></div></div>
   <div class="panel c12"><h2>خطوات التجربة</h2><ol class="steps" id="steps"></ol>${tryList(['حرّك الذراع إلى المرحلة 2 ثم اضغط S2: هل يعمل؟','شغّل من الوضع الأولي، ثم حرّك الذراع: لماذا لا يفصل K1 مع أن S3 فُتح؟','افصل F5 والمحرك يعمل: ماذا يحدث؟'])}</div></div>`;
  const $=s=>el.querySelector(s);
  const press=(id,k)=>{const b=$(id);const dn=e=>{e.preventDefault();st[k]=true;if(k==='S2'){st.tries++;if(st.stage!==0)st.blocked=true}upd()},up=()=>{st[k]=false;upd()};b.addEventListener('pointerdown',dn);b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up)};
  press('#s2','S2');press('#s1','S1');
  $('#f5').onclick=()=>{st.F5trip=!st.F5trip;$('#f5').setAttribute('aria-pressed',st.F5trip);upd()};
  el.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{st.stage=+b.dataset.stage;segSet(el,'stage',st.stage);if(st.K1&&st.stage>0)st.ranAndMoved=true;upd()});
  function logic(){const S3=st.stage===0||chF('s3weld');const pre=!st.F5trip&&!st.S1;st.K1=!chF('k1coil')&&pre&&((st.S2&&S3)||(st.K1&&!chF('hold')));return S3}
  function upd(){const S3=logic();
    $('#cfig').firstChild.innerHTML=`<svg viewBox="10 466 680 100" role="img" aria-label="دائرة التحكم">`+S.t(30,480,'L1')+S.w('M30 486V560','live')+dot(30,510)+S.w('M30 510H52','flow')+`<rect x="52" y="504" width="26" height="12" class="sym" fill="var(--surface)"/>`+S.w('M78 510H90','flow')+S.t(66,534,'-F4','',null,10)+S.t(670,480,'N')+S.w('M670 486V560','live')+
      ctrl4({live:{p1:'flow',p2:'flow',p3:'flow',F5trip:st.F5trip,S1:st.S1,S2:st.S2,S3,K1:st.K1}})+'</svg>';
    $('#facts').innerHTML=fact('K1',st.K1?'موصول':'مفصول')+fact('S3',S3?'مغلق':'مفتوح')+fact('مقاومة العضو الدوار',['كاملة','2/3','1/3','مقصورة'][st.stage]);
    const m=$('#msg');let t='',c='d6-msg';
    if(st.F5trip){t='المرحل الحراري F5 فصل: تلامسه 95–96 مفتوح فلا يصل التيار إلى K1.';c+=' bad'}
    else if(st.S2&&!S3){t='S3 مفتوح لأن الذراع ليس في وضعه الأولي: لا يعمل التشغيل. أرجع الذراع إلى «1».';c+=' warn'}
    else if(st.K1&&st.stage<3)t='K1 مثبت ذاتياً عبر تلامسه 13–14. حرّك الذراع مرحلة بعد مرحلة حتى «مقصورة».';
    else if(st.K1)t='المحرك يعمل ومقاومة العضو الدوار مقصورة.';
    else t='اضغط S2 والذراع في الوضع الأولي.';m.className=c;m.innerHTML=t;SU&&SU.check()}
  $('#mfig').innerHTML=`<svg viewBox="0 0 200 120" role="img" aria-label="المحرك">${acMot(100,60,30,false)}${rotm(100,60,30)}</svg>`;
  const steps=[
    {t:'جرّب التشغيل والذراع ليس في وضعه الأولي',x:'اختر المرحلة 2 أو 3 ثم اضغط S2: لا يعمل K1 لأن S3 مفتوح.',done:()=>st.blocked},
    {t:'أرجع الذراع إلى الوضع الأولي وشغّل',x:'اختر «1: الوضع الأولي» ثم اضغط S2 واتركه: يبقى K1 موصولاً بالتثبيت الذاتي.',done:()=>st.K1&&!st.S2},
    {t:'أخرج مقاومة العضو الدوار على مراحل',x:'حرّك الذراع إلى 2 ثم 3 ثم 4: يفتح S3 لكن K1 يبقى موصولاً.',done:()=>st.K1&&st.stage===3},
    {t:'افصل المرحل الحراري F5',x:'شغّل «فصل المرحل الحراري»: يفتح 95–96 فيفصل K1.',done:()=>st.F5trip&&!st.K1},
    {t:'أوقف بالزر S1',x:'أعد F5، وأرجع الذراع، وشغّل، ثم اضغط S1.',done:()=>!st.F5trip&&st.S1&&!st.K1&&st.tries>1}];
  const SU=stepsUI($('#steps'),steps);upd();
  loopOn(el,dt=>{st.w=st.K1?Math.min(1,st.w+dt*0.8):Math.max(0,st.w-dt*0.6);st.ang+=st.w*360*dt*0.6;turn(el,st.ang);const mc=el.querySelector('#mfig circle.coil');if(mc)mc.classList.toggle('on',st.K1)});
}

const EX_TXT=[
 `<p>(١) في الشكل (6-12) ارسم رسماً يجمع بين مخطط مسار التيار والمخطط الرمزي للدوائر الموصوفة:</p><ul><li>المحرك: للتيار المستمر وباستثارة على التوالٍ <span class="ltr">220 V</span> (دوران إلى اليمين)</li><li>المفتاح: مفتاح وقاية محرك بفصل مغناطيسي سريع</li><li>بادئ التشغيل: متعدد المراحل ، يشغل يدوياً</li></ul>`,
 `<p>(٢) في الشكل (6-13) ارسم رسماً يجمع بين مخطط مسار التيار والمخطط الرمزي للدوائر الموصوفة:</p><ul><li>المحرك: للتيار المستمر وباستثارة مزدوجة <span class="ltr">220 V</span> (دوران إلى اليسار)</li><li>المفتاح: مفتاح وقاية محرك بدون فصل مغناطيسي سريع</li><li>بادئ التشغيل: متعدد المراحل ، يشغل يدوياً</li></ul>`,
 `<p>(٣) في الشكل (6-14) في إدارة تيار مستمر ، يتم التحكم في سرعة دوران محرك تيار مستمر ذي استثارة مزدوجة <span class="ltr">220 V</span> وذي أقطاب بينية متماثلة ببادئ تشغيل مقاومة متغيرة "ريوستاتي" (دوران إلى اليسار)</p><p>التوصيل والفصل يتمان عن طريق مفتاح وقاية محرك مع وقاية للمحرك للموصل إجراء الوقاية ، تأريض وقائي. ارسم رسماً يجمع بين مخطط الدائرة التنفيذية "التوصيلات" ومخطط الدائرة الرمزي.</p>`,
 `<p>(٤) في الشكل (6-15) محرك ثلاثي بعضو دوار ذي حلقات انزلاق لجهد <span class="ltr">380 V</span> يوصل مفتاح تلامس وعن طريق مفتاح مساعد S3 على بادئ تشغيل ، يمنع توصيل الإدارة إذا لم يكن بادئ التشغيل في وضعه الأولي. ارسم في الحقول لوحات التوزيع.</p>`];
const exFig=(k)=>k<4?`<svg viewBox="${DCVB}" role="img" aria-label="ورقة التمرين ${k}">${dcSheet(k).s}</svg>`:`<svg viewBox="${E4VB}" role="img" aria-label="ورقة التمرين 4">${ex4Sheet()}</svg>`;
const solSteps=(k)=>{const L=k<4?dcSolution(k):ex4Solution();let acc='';const vb=k<4?DCVB:E4VB;
  return L.map(([t,f],i)=>{acc+=f;return {t:`${i===0?SOL:''}${t}${f&&i>0?box(`<svg viewBox="${vb}" role="img" aria-label="حل مقترح">${acc}</svg>`,k<4?560:600):''}`,final:i===L.length-1}})};

B.lesson({
 id:'u6-l3',unit:6,order:3,pages:'138–141',
 title:'تمارين الوحدة السادسة',
 summary:'أربعة تمارين رسم: محرك تيار مستمر توالٍ، ومحركان مزدوجا الاستثارة ببادئ يدوي ومفتاح وقاية، ومحرك حثي ذو حلقات انزلاق بكونتاكتور ومفتاح مساعد S3 يمنع التشغيل إلا والبادئ في وضعه الأولي. الحلول المرسومة في «الأمثلة المحلولة» مقترحة وليست من الكتاب.',
 stations:[
  {intro:true},

  {st:1,short:'التمرين (١)',title:'التمرين (١): محرك تيار مستمر توالٍ ببادئ يدوي (الشكل 6-12)',ref:'ص 138',
   q:'المفتاح ثلاثي الأقطاب والدائرة فيها موصلان فقط… فماذا نفعل بالقطب الثالث؟',
   art:DRA.art({aria:'ورقة التمرين الأول: التغذية ومفتاح الوقاية ولوحة أطراف المحرك والبادئ وجزء من المخطط الخطي',
    parts:[{svg:exFig(1),box:[14,40,332,226],tips:[
     [14,8,290,36,'قضيبا التغذية ⟦L+⟧ و⟦L−⟧: ⟦220V –; 2⟧ = تيار مستمر بموصلين.'],
     [84,52,96,96,'مفتاح وقاية المحرك ⟦-Q1⟧: صف حراري وصف مغناطيسي ⟦I>⟧، وقنطرة ⟦3–5⟧ في الأعلى.'],
     [40,212,212,134,'إطار المحرك ⟦-M1⟧ ولوحة أطرافه ⟦-X1⟧: ⟦B1⟧، ⟦D1⟧، ⟦D2⟧، ⟦A2⟧. المطلوب الرسم داخله.'],
     [258,166,132,80,'بادئ التشغيل ⟦-R1⟧ بلوحة ⟦-X2⟧ (الطرفان ⟦L⟧ و⟦A⟧) ومقاومة متدرجة وذراع يدوي.'],
     [398,20,92,300,'المخطط الخطي المعطى جزئياً: نكمله حتى المحرك.']]}],
    extra:DRA.L(180,296,'الشكل (6-12): ورقة التمرين',13.5,700)}),
   cap:'ما يعطيه الكتاب مرسوماً، والمطلوب إكماله.<br><b>مرّر المؤشر على التغذية والمفتاح ولوحة المحرك والبادئ والمخطط الخطي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'ما فائدة القنطرة 3–5 في مفتاح الوقاية ثلاثي الأقطاب هنا؟',opts:[
     ['تقصر المحرك عند الفصل',false,'القنطرة بين قطبين من المفتاح، لا على المحرك.'],
     ['توصل القطبين الثاني والثالث على التوالي في الموصل السالب',true,'الدائرة بموصلين فقط، فيُقطع السالب بقطبين على التوالي.'],
     ['تعكس اتجاه الدوران',false,'الاتجاه يحدده توصيل العضو والمجال، لا القنطرة.']]}}],
   body:[
    {book:EX_TXT[0],ref:'ص 138'},
    {tip:'<p>في المحرك التوالي يمر تيار واحد في العضو الدوار وفي ملف المجال (D1–D2). والطرف <span class="ltr">B1</span> في لوحة المحرك هو بداية ملف الأقطاب البينية (B) الموصول داخل المحرك بالعضو الدوار؛ لذلك يظهر B1 بدل A1. ونكتب على المخطط الخطي عدد الموصلات بالشرطات المائلة.</p>',title:'قبل أن ترسم'},
    {add:'<p>عبارة «المفاتيح الثلاثية الأقطاب متداولة تجاريا» في الشكل تعني أن المفتاح ثنائي الأقطاب قليل في السوق، فنستعمل ثلاثي الأقطاب ونصل قطبيه الثاني والثالث على التوالي.</p>',title:'لماذا ثلاثي الأقطاب؟'},
    {tip:'<p>الحل المقترح (ليس من الكتاب) مرسوم خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>'},
    {title:'مختبر مصغّر: رتّب خطوات الحل',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات رسم الحل المقترح بالترتيب.',steps:[
     ['ارسم داخل المحرك: العضو الدوار مع الأقطاب البينية بين B1 و A2، وملف التوالي بين D1 و D2','نبدأ بما داخل المحرك لنعرف الأطراف.'],
     ['صل A2 بـ D1 بقنطرة على اللوحة','القنطرة تجعل العضو وملف التوالي على التوالي، بعد أن رسمنا داخل المحرك.'],
     ['صل الطرف 2 في Q1 بالطرف L في البادئ','الموجب يدخل البادئ قبل المحرك.'],
     ['صل الطرف A في البادئ بـ B1','من البادئ إلى المحرك.'],
     ['صل D2 بالطرف 4 في Q1','عودة السالب عبر القطبين 3–4 و5–6.'],
     ['أكمل المخطط الخطي حتى المحرك -M1 بشرطتين','المخطط الخطي يأتي بعد اكتمال التوصيل.']],done:'تحقق بعدها أن التيار يمر في العضو وملف التوالي من الطرف 1 إلى الطرف 2 فيدور المحرك إلى اليمين.'})}
   ]},

  {st:2,short:'التمرين (٢)',title:'التمرين (٢): محرك مزدوج الاستثارة يدور إلى اليسار (الشكل 6-13)',ref:'ص 139',
   q:'المطلوب هذه المرة دوران إلى اليسار… أي سلك ستعكسه؟',
   art:DRA.art({aria:'ورقة التمرين الثاني: مفتاح وقاية بصف حراري فقط، ولوحة المحرك بستة أطراف، وبادئ بثلاثة أطراف',bg:'#E4ECF6',
    parts:[{svg:exFig(2),box:[14,40,332,226],tips:[
     [84,52,96,80,'⟦-Q1⟧ بصف حراري فقط: «بدون فصل مغناطيسي سريع».'],
     [84,222,128,50,'لوحة ⟦-X1⟧: ⟦E2⟧، ⟦B1⟧، ⟦E1⟧ في الأعلى و⟦D2⟧، ⟦D1⟧، ⟦A2⟧ في الأسفل. ⟦E1–E2⟧ ملف التوازي، و⟦D1–D2⟧ ملف التوالي.'],
     [258,166,132,90,'البادئ ⟦-R1⟧ بثلاثة أطراف ⟦L⟧ و⟦A⟧ و⟦E⟧: الطرف ⟦E⟧ يغذي ملف التوازي.'],
     [410,250,60,60,'المحرك في المخطط الخطي، والسهم المنحني فوقه إلى اليسار.']]}],
    extra:DRA.L(180,296,'الشكل (6-13): ورقة التمرين',13.5,700)}),
   cap:'<b>مرّر المؤشر على المفتاح ولوحة المحرك والبادئ والمحرك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'كيف نجعل المحرك مزدوج الاستثارة يدور إلى اليسار بدل اليمين؟',opts:[
     ['نبدّل L+ و L−',false,'هذا يعكس التيارات كلها فيبقى الاتجاه (الشكل 6-3).'],
     ['نعكس المجالين والعضو معاً',false,'عكسها كلها يبقي الاتجاه.'],
     ['نعكس توصيل العضو الدوار وحده بالنسبة للمجالين',true,'عكس تيار واحد بالنسبة للآخرين يعكس الدوران.']]}}],
   body:[
    {book:EX_TXT[1],ref:'ص 139'},
    {tip:'<p>«باستثارة مزدوجة» = ملف توالٍ (D1–D2) وملف توازٍ (E1–E2) معاً. ملف التوازي يُوصل إلى الطرف <span class="ltr">E</span> في البادئ، أي قبل مقاومة البدء، حتى يبقى المجال كاملاً عند البدء.</p>',title:'ملفان للمجال'},
    {watch:'<p>أحد أطراف لوحة -X1 في الشكل (6-13) غير واضح في الطباعة («D?»)؛ قُرئ D2 لأن أطراف ملف التوالي D1 و D2.</p>',fix:true},
    {title:'مختبر مصغّر: مواقف من التمرين',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'«مفتاح وقاية محرك بدون فصل مغناطيسي سريع». ماذا نرسم فيه؟',opts:[['صفاً حرارياً فقط',true,'كما في الشكل (6-13): بلا «I>».'],['صفاً حرارياً وصفاً مغناطيسياً',false,'هذا مفتاح التمرين (١) «بفصل مغناطيسي سريع».'],['صفاً مغناطيسياً فقط',false,'الحماية الحرارية من التحميل الزائد موجودة دائماً.']]},
     {q:'إلى أي طرف في البادئ يُوصل ملف التوازي E1؟',opts:[['A',false,'A بعد المقاومة: لو أخذ منه المجال جهده لضعف عند البدء.'],['E',true,'E يأخذ الجهد قبل مقاومة البدء، فالمجال كامل عند البدء.'],['L+ مباشرة دون البادئ',false,'المطلوب التوصيل عبر البادئ كما في لوحته -X2.']]}]})}
   ]},

  {st:3,short:'التمرين (٣)',title:'التمرين (٣): تحكم ريوستاتي في سرعة محرك مزدوج الاستثارة (الشكل 6-14)',ref:'ص 140',
   q:'ما معنى «تأريض وقائي»، وأين ترسمه في هذه الورقة؟',
   art:DRA.art({aria:'ورقة التمرين الثالث: عناصر متفرقة غير موصلة',bg:'#F7DCC8',
    parts:[{svg:exFig(3),box:[14,40,332,226],tips:[
     [70,12,80,20,'نقطتا التغذية ⟦L+⟧ و⟦L−⟧.'],
     [56,96,16,18,'الرمز ⧈ (مربع داخل مربع): عزل مزدوج للجهاز (توضيح للمتدرب ليس من الكتاب).'],
     [84,222,160,50,'لوحة ⟦-X1⟧: ⟦E2⟧، ⟦1B1⟧، ⟦E1⟧، ⟦PE⟧ / ⟦D2⟧، ⟦D1⟧، ⟦2B2⟧. ⟦1B1⟧ و⟦2B2⟧ أقطاب بينية متماثلة.'],
     [292,278,40,30,'طرف التأريض ⟦E⟧ ورمز الأرضي.'],
     [258,166,110,110,'البادئ الريوستاتي ⟦-R1⟧: ذراعان منزلقان مرتبطان.']]}],
    extra:DRA.L(180,296,'الشكل (6-14): ورقة التمرين',13.5,700)}),
   cap:'<b>مرّر المؤشر على التغذية ولوحة المحرك وطرف التأريض والبادئ (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'في هذه الورقة أين يُوصل طرف PE في لوحة المحرك؟',opts:[
     ['إلى L−',false,'موصل الوقاية لا يحمل تيار التشغيل ولا يوصل بموصل تغذية.'],
     ['إلى طرف التأريض E',true,'هذا «إجراء الوقاية: تأريض وقائي» المطلوب في نص التمرين.'],
     ['لا يوصل',false,'نص التمرين يطلب تأريضاً وقائياً.']]}}],
   body:[
    {book:EX_TXT[2],ref:'ص 140'},
    {watch:'<p>جملة «مع وقاية للمحرك للموصل إجراء الوقاية» مضطربة في الكتاب؛ المقصود أن إجراء الوقاية هو التأريض الوقائي.</p>',fix:true},
    {tip:'<p>هذه الورقة لا تعطي أي سلك؛ ترسم كل التوصيلات بنفسك: التغذية عبر Q1 (بقنطرة 3–5 كالتمرينين السابقين)، وما داخل المحرك، والقناطر، والبادئ، والتأريض، ثم المخطط الخطي من «220V-».</p>',title:'ماذا ترسم؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['الطرفان 1B1 و 2B2 لملف الأقطاب البينية الموصول مع العضو الدوار.',true,'ولهذا نصل التغذية إليهما بدل A1 و A2.'],
     ['للدوران إلى اليسار نعكس تيار العضو وحده بالنسبة للمجالين.',true,'كما في التمرين (٢).'],
     ['التأريض الوقائي يوصل بين PE في المحرك و L−.',false,'يوصل PE بطرف التأريض E.']]})}
   ]},

  {st:4,short:'التمرين (٤)',title:'التمرين (٤): محرك حلقات انزلاق بكونتاكتور ومفتاح مساعد S3 (الشكل 6-15)',ref:'ص 141',
   q:'كيف نمنع العامل من تشغيل المحرك والبادئ ليس في وضعه الأولي؟',
   art:DRA.art({aria:'ورقة التمرين الرابع: ثلاثة حقول للمخطط الرمزي والمخطط الجامع ومخطط التحكم',bg:'#E4ECF6',
    parts:[{svg:exFig(4),vb:'226 112 464 330',box:[16,36,328,236],tips:[
     [340,124,84,44,'الكونتاكتور ⟦-K1⟧: ملفه ⟦A1–A2⟧ وتلامسه المساعد ⟦13–14⟧.'],
     [256,170,136,42,'المرحل الحراري ⟦-F5⟧ وتلامسه المغلق ⟦95–96⟧.'],
     [226,238,50,94,'زر الإيقاف ⟦-S1⟧ (مغلق ⟦11–12⟧) وزر التشغيل ⟦-S2⟧ (مفتوح ⟦13–14⟧).'],
     [236,350,184,66,'بادئ العضو الدوار ⟦-R1⟧: ثلاث مقاومات متغيرة بذراع واحد.'],
     [390,300,48,52,'المفتاح المساعد ⟦-S3⟧ مرتبط بذراع البادئ: مغلق فقط والبادئ في وضعه الأولي.'],
     [470,236,210,196,'المحرك ⟦-M1 380V Δ⟧ بلوحتي ⟦-X1⟧ (العضو الساكن) و⟦-X2⟧ (⟦K⟧، ⟦L⟧، ⟦M⟧).']]}],
    extra:DRA.L(180,290,'الشكل (6-15): الحقل الجامع من ورقة التمرين',13,700)}),
   cap:'الجزء الأوسط من الورقة؛ الحقلان الآخران (المخطط الرمزي ومخطط التحكم) فارغان تقريباً.<br><b>مرّر المؤشر على والعناصر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'أين يوضع المفتاح المساعد S3 في دائرة التحكم؟',opts:[
     ['على التوالي مع زر التشغيل S2 فقط',true,'في فرع التشغيل؛ فإذا لم يكن الذراع في وضعه الأولي لا يصل التيار إلى K1.'],
     ['على التوالي مع ملف K1 بعد التثبيت الذاتي',false,'هكذا يُفصل K1 عند أول تحريك للذراع أثناء البدء.'],
     ['على التوازي مع S1',false,'على التوازي مع الإيقاف يلغي زر الإيقاف.']]}}],
   body:[
    {book:EX_TXT[3],ref:'ص 141'},
    {tip:'<p>S3 يكون <b>مغلقاً فقط</b> والذراع في وضعه الأولي (كل المقاومة في الدائرة). نضعه على التوالي مع S2، وعلى التوازي معهما التلامس المساعد K1 (13–14) للتثبيت الذاتي؛ فبعد التشغيل يحرك العامل الذراع فيُفتح S3 ويبقى K1 مثبتاً.</p>',title:'فكرة الشرط'},
    {tip:'<p>جرّب منطق هذه الدائرة في تبويب «المختبر»، والحل المقترح مرسوم في «الأمثلة المحلولة».</p>'},
    {title:'مختبر مصغّر: ماذا يحدث لو…؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'الذراع في المرحلة 2، وضغط العامل S2.',opts:[['يعمل K1',false,'S3 مفتوح لأن الذراع ليس في وضعه الأولي.'],['لا يعمل K1',true,'هذا هو الغرض من S3: منع التشغيل والمقاومة ليست كلها في الدائرة.']]},
     {q:'شغّل العامل من الوضع الأولي، ثم حرّك الذراع إلى «مقصورة».',opts:[['يفصل K1 لأن S3 فُتح',false,'S3 في فرع التشغيل فقط، والتيار يمر الآن عبر تلامس التثبيت.'],['يبقى K1 موصولاً عبر تلامسه 13–14',true,'التثبيت الذاتي على التوازي مع فرع S2–S3.']]},
     {q:'فصل المرحل الحراري F5 والمحرك يعمل.',opts:[['يُفتح 95–96 فيفصل K1',true,'تلامس F5 على التوالي في أول دائرة التحكم.'],['لا شيء؛ K1 مثبت',false,'التثبيت لا يتجاوز تلامس F5.']]}]})}
   ]},

  {recap:[
   'التمارين تعطي ورقة فيها بعض العناصر، والمطلوب إكمال الرسم؛ الكتاب لا يعطي إجابات.',
   'في دائرة تيار مستمر بمفتاح ثلاثي الأقطاب يوصل القطبان الثاني والثالث على التوالي بقنطرة 3–5.',
   'ملف التوازي يأخذ جهده من الطرف E في البادئ قبل المقاومة؛ وللدوران المعاكس نعكس تيار العضو وحده.',
   'المفتاح المساعد S3 على التوالي مع زر التشغيل فقط، والتثبيت الذاتي بتلامس K1 13–14.']}
],
 theory:[
  {h:'6-4 تمارين',ref:'ص 138–141',html:`<p>كل تمرين يعطي ورقة فيها بعض العناصر مرسومة (التغذية، المفتاح، لوحة أطراف المحرك، البادئ…) والمطلوب إكمال الرسم. الكتاب لا يعطي إجابات؛ في تبويب «الأمثلة المحلولة» حل مقترح لكل تمرين يُرسم خطوة بخطوة.</p>`},
  {h:'التمرين (١)',ref:'ص 138',html:EX_TXT[0]},
  {fig:'(6-12)',ref:'ص 138',caption:'آلات التيار المستمر — ورقة التمرين (١): قضيبا التغذية، ومفتاح وقاية -Q1 بصف حراري وصف مغناطيسي «I&gt;» وقنطرة 3–5، ولوحة أطراف المحرك -X1 (B1، D1، D2، A2)، والبادئ -R1 بالطرفين L و A، وجزء من المخطط الخطي يميناً.',draw:()=>box(exFig(1),620)},
  {note:`${ADD}المفتاح ثلاثي الأقطاب في دائرة تيار مستمر بموصلين: القطب الثالث يوصل على التوالي بالقطب الثاني بقنطرة 3–5، فيقطع المفتاح السالب بقطبين. والطرف <span class="ltr">B1</span> في لوحة المحرك هو بداية ملف الأقطاب البينية (B) الموصول داخل المحرك بالعضو الدوار؛ لذلك يظهر B1 بدل A1 (تسمية الأطراف حسب المواصفة الدولية IEC 60034-8).`},
  {h:'التمرين (٢)',ref:'ص 139',html:EX_TXT[1]},
  {fig:'(6-13)',ref:'ص 139',caption:'آلات التيار المستمر — ورقة التمرين (٢): -Q1 بصف حراري فقط، ولوحة -X1 (E2، B1، E1 / D2، D1، A2)، والبادئ -R1 بالأطراف L و A و E، والمخطط الخطي فيه خط التغذية وجزء قرب المحرك.',draw:()=>box(exFig(2),620)},
  {h:'التمرين (٣)',ref:'ص 140',html:EX_TXT[2]},
  {fig:'(6-14)',ref:'ص 140',caption:'آلات التيار المستمر — ورقة التمرين (٣): عناصر متفرقة غير موصلة: نقطتا التغذية L+ و L−، و-Q1 بثلاثة تلامسات، و-R1 بالأطراف L و A و E وذراعين منزلقين مرتبطين، ولوحة المحرك -X1 (E2، 1B1، E1، PE / D2، D1، 2B2)، ورمز الأرضي مع الطرف E.',draw:()=>box(exFig(3),620)},
  {h:'التمرين (٤)',ref:'ص 141',html:EX_TXT[3]},
  {fig:'(6-15)',ref:'ص 141',caption:'محرك ثلاثي الأوجه — ورقة التمرين (٤) بثلاثة حقول: «مخطط رمزي»، و«جمع بين مخطط مسار التيار ومخطط التوصيلات ومخطط الترتيب» (القضبان، -F1-3، -F4، الكونتاكتور -K1، المرحل الحراري -F5، الزران -S1 و -S2، البادئ -R1 والمفتاح المساعد -S3، المحرك -M1 بلوحتي -X1 و -X2)، و«مخطط مسار التيار للتحكم».',draw:()=>box(exFig(4),660)},
  {err:`<div class="fixnote"><ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 140: جملة «مع وقاية للمحرك للموصل إجراء الوقاية» مضطربة في الكتاب؛ المقصود أن إجراء الوقاية هو التأريض الوقائي.</li><li>ص 139: أحد أطراف لوحة -X1 في الشكل (6-13) غير واضح في الطباعة («D?»)؛ قُرئ D2 لأن أطراف ملف التوالي D1 و D2.</li></ul></div>`}
 ],
 lab:(el)=>ex4Lab(el),
 examples:[1,2,3,4].map(k=>({title:`التمرين (${['','١','٢','٣','٤'][k]}) — حل مقترح`,ref:['','ص 138','ص 139','ص 140','ص 141'][k],q:EX_TXT[k-1]+box(exFig(k),k<4?560:600),solve:()=>solSteps(k),note:'<b>حل مقترح (ليس من الكتاب).</b> قد توجد طرق رسم أخرى صحيحة؛ المهم أن يكون التوصيل صحيحاً واتجاه الدوران كما هو مطلوب.'})),
 quiz:[
  {q:'في التمرين (١)، ما فائدة القنطرة 3–5 في مفتاح الوقاية ثلاثي الأقطاب؟',o:['تزيد التيار','توصل القطبين الثاني والثالث على التوالي في الموصل السالب','تعكس الاتجاه','تقصر المحرك'],c:1,e:'الدائرة بموصلين فقط؛ القطب الثالث يوضع على التوالي مع الثاني فيُقطع السالب بقطبين.'},
  {q:'المطلوب في التمرين (٢) «مفتاح وقاية محرك بدون فصل مغناطيسي سريع». ماذا نرسم فيه؟',o:['صفاً حرارياً وصفاً مغناطيسياً','صفاً حرارياً فقط','صفاً مغناطيسياً فقط','لا وقاية'],c:1,e:'الشكل (6-13): Q1 بصف حراري فقط بلا «I>».'},
  {q:'كيف نجعل محركاً مزدوج الاستثارة يدور إلى اليسار بدل اليمين؟',o:['نبدل L+ و L−','نعكس توصيل العضو الدوار وحده بالنسبة للمجالين','نعكس المجالين والعضو معاً','نزيد مقاومة البدء'],c:1,e:'عكس أحد التيارات بالنسبة للآخر يعكس الدوران؛ عكسها كلها يبقيه (الشكل 6-3).'},
  {q:'لماذا يُوصل ملف التوازي في التمرينين (٢) و(٣) إلى الطرف E في البادئ؟',o:['ليأخذ المجال جهده كاملاً عند البدء فلا تمر فيه مقاومة البدء','لتقليل المجال عند البدء','لعكس الاتجاه','لأنه موصل أرضي'],c:0,e:'المجال يجب أن يكون كاملاً عند البدء حتى يكون العزم كبيراً والتيار محدوداً.'},
  {q:'في التمرين (٤)، أين يوضع المفتاح المساعد S3 في دائرة التحكم؟',o:['على التوالي مع ملف K1 بعد التثبيت','على التوالي مع زر التشغيل S2 فقط','على التوازي مع S1','في دائرة القوى'],c:1,e:'في فرع التشغيل فقط؛ لو وُضع بعد التثبيت لفصل K1 عند تحريك الذراع.'},
  {q:'ما الذي يحفظ K1 موصولاً بعد ترك زر التشغيل وتحريك ذراع البادئ؟',o:['S3','التلامس المساعد K1 13–14 (تثبيت ذاتي)','المرحل F5','المصهر F4'],c:1,e:'التلامس 13–14 لـ K1 على التوازي مع فرع S2–S3.'}
 ]
});
})(PLCBOOK);
