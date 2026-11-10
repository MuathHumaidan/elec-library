/* Unit 2 — تحليل الاستجابة الزمنية لبعض الأنظمة الصناعية ذات الدائرة المفتوحة (ص 9–20)
   Lessons u2-l1 (thermal system), u2-l2 (DC motor / PT1), u2-l3 (light system).
   Each lab is a virtual Com3Lab bench: the book's connection figure redrawn and live, a function generator with the
   book's step values, the plant, a two-channel recorder/oscilloscope wired as the book wires it (Y1/Y2), a cursor and
   the 63.2 % construction, and «سجّل» filling the book's results table (K_s with «كما في الكتاب / المصحح»).
   Plant parameters are NOT in the book → B.params trainer fields («قيم توضيحية / قيم المدرب»), one panel per lesson. */
(function(B){
const {S}=B;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const R=(x,d)=>B.round(x,d);
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---------- styles used only by this file ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('cl2-css'))return;const s=document.createElement('style');s.id='cl2-css';s.textContent=`
.c2-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.c2-sl .c2-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.c2-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.c2-sl input[type=range]{width:<span class="ltr">100%</span>;accent-color:var(--blue);direction:ltr;margin:4px 0}
.c2-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.c2-row .sub{margin:0}
.c2-lab .seg{flex-wrap:wrap;max-width:<span class="ltr">100%</span>}
.c2-lab .seg button{white-space:nowrap}
.c2-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px;margin-top:10px}
.c2-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 10px;text-align:center}
.c2-meter span{display:block;font-size:12px;color:var(--muted)}
.c2-meter b{font:700 18px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.c2-tbl{overflow-x:auto;margin-top:8px}
table.c2-bt{border-collapse:collapse;font-size:13.5px;min-width:<span class="ltr">100%</span>}
table.c2-bt th,table.c2-bt td{border:1px solid var(--line);padding:5px 8px;text-align:center}
table.c2-bt th{background:var(--surface-2);font-weight:600}
table.c2-bt td{font-family:var(--mono);direction:ltr;min-width:52px}
table.c2-bt td.bad{color:var(--stop);font-weight:700}
.c2-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.c2-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.c2-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.c2-scope{background:linear-gradient(170deg,var(--con1),var(--con2));border-radius:14px;padding:8px;color:var(--con-ink)}
.c2-scope .c2-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;padding:2px 6px}
.c2-scope .c2-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:6px}
.c2-cur{display:flex;gap:10px;flex-wrap:wrap;font-family:var(--mono);direction:ltr;font-size:13px;margin-top:4px;justify-content:flex-end}
.c2-cur span{background:var(--surface-2);border-radius:8px;padding:2px 8px}
.c2-try{margin:6px 0 0;padding-inline-start:20px}
.c2-calc{font-family:var(--mono);direction:ltr;text-align:left;white-space:pre;background:var(--surface-2);border-radius:10px;padding:8px 12px;overflow-x:auto;font-size:13.5px;margin-top:8px}
.c2-gs{font-size:16px;margin-top:8px}
.c2-hide{display:none}
@media (max-width:700px){.svgbox.c2-wide svg{min-width:600px}}
`;document.head.appendChild(s)})();

/* ---------- helpers (local copies) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let m=false;while(i<steps.length&&steps[i].done&&steps[i].done()){i++;m=true}if(m)draw()},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="c2-sl"><span class="c2-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const meters=list=>list.map(([a,b])=>`<div class="c2-meter"><span>${a}</span><b>${b}</b></div>`).join('');
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox${max>=700?' c2-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.4" fill="var(--fg)"/>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2;const a=Math.atan2(y2-y1,x2-x1),h=9;const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
const Q=(n,q,ans)=>`<details class="c2-q"><summary>${n?n+': ':''}${q}</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const ptable=(cols,rows)=>`<div class="c2-tbl"><table class="c2-bt"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const bookFixW=(bookH,fixH)=>(el)=>{let v='book';const draw=()=>{el.innerHTML=`<div class="c2-row" style="margin-top:0">${segHTML('bf',[['book','كما في الكتاب'],['fixed','المصحح']],v)}</div><div class="callout${v==='book'?' err':''}" style="margin-top:8px">${v==='book'?bookH:fixH}</div>`;B.math(el);segBind(el,'bf',x=>{v=x;draw()})};draw()};
function niceMax(v){if(!(v>0)||!isFinite(v))return 1;const e=Math.pow(10,Math.floor(Math.log10(v)));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*e>=v*0.99999)return k*e;return 10*e}
const tS=v=>String(+(+v).toPrecision(4));
/* time formatting with a sensible unit for the scope */
const tUnit=W=>W<0.5?{k:1000,u:'ms'}:{k:1,u:'s'};

/* ======================================================================
   Drawing the Com3Lab bench (figures 2-1 … 2-5 redrawn)
   ====================================================================== */
const RED='--stop',BLK='--fg';
const sock=(x,y,col)=>`<circle cx="${x}" cy="${y}" r="6.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="2.6" fill="var(${col||'--fg'})"/>`;
const wire=(d,col,on)=>`<path d="${d}" fill="none" stroke="var(${col})" stroke-width="${on?3:2.2}" stroke-linejoin="round" stroke-linecap="round"/>`;
const board=(x,y,w,h,title)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>${title?S.t(x+12,y+18,title,'b','start'):''}`;
function genSVG(o){const x=20,y=196;return `<rect x="${x}" y="${y}" width="170" height="126" rx="9" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.5"/>${S.t(x+85,y+16,'FUNCTION GENERATOR','m')}
 <rect x="${x+12}" y="${y+24}" width="104" height="34" rx="4" fill="var(--lcd)"/><text class="txt" x="${x+64}" y="${y+46}" style="fill:var(--lcd-ink)" font-size="13">${o.gen||'0.0 V'}</text>
 <circle cx="${x+146}" cy="${y+44}" r="15" fill="var(--fg)" opacity=".75"/><path d="M${x+146} ${y+44}L${x+146} ${y+31}" stroke="var(--surface)" stroke-width="2.4"/>
 ${S.t(x+30,y+86,'OUT','m')}${S.t(x+85,y+86,'SYNC','m')}${S.t(x+140,y+86,'⊥','m')}${sock(x+30,y+100,RED)}${sock(x+85,y+100)}${sock(x+140,y+100,BLK)}`}
/* instrument (multimeter or oscilloscope) top-left, sockets on its right edge */
const INS={mm:{V:46,A:66,'Ω':86,COM:110},osc:{TRIG:40,'⊥':60,Y1:80,Y2:100,COM:120}};
function insSVG(kind,o){const x=20,y=20,w=150;let s=`<rect x="${x}" y="${y}" width="${w}" height="${kind==='mm'?110:120}" rx="9" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.5"/>`;
  if(kind==='mm')s+=S.t(x+70,y+16,'MULTIMETER 1','m')+`<rect x="${x+12}" y="${y+26}" width="104" height="38" rx="4" fill="var(--lcd)"/><text class="txt" x="${x+64}" y="${y+51}" style="fill:var(--lcd-ink)" font-size="15">${o.meter||'0.00 V'}</text>`+S.t(x+64,y+86,'V DC','m');
  else s+=S.t(x+70,y+16,'OSCILLOSCOPE','m')+`<rect x="${x+12}" y="${y+26}" width="104" height="60" rx="4" fill="var(--lcd)"/><path d="M${x+18} ${y+76}H${x+40}V${y+40}H${x+110}" stroke="var(--live)" stroke-width="1.6" fill="none"/><path d="M${x+18} ${y+76}H${x+40}C${x+52} ${y+50} ${x+62} ${y+44} ${x+110} ${y+42}" stroke="var(--lcd-ink)" stroke-width="1.6" fill="none"/>`;
  Object.entries(INS[kind]).forEach(([k,yy])=>{s+=S.t(x+w-4,yy+4,k,'m','end')+sock(x+w+8,yy,k==='COM'||k==='⊥'?BLK:k==='TRIG'||k==='A'||k==='Ω'?null:RED)});
  return s}
const GND=[266,300];
function gndSVG(){return board(232,276,68,48,'')+S.t(266,292,'⊥','')+sock(GND[0],GND[1]+8,BLK)}
/* plant boards: return {svg, inX,inY,outX,outY} */
function plantBoard(kind,o){let s='';const inX=284,outX=708,yy=150;
  const lab=(x,t)=>S.t(x,yy-16,t,'');
  if(kind==='th'){s+=board(250,66,490,190,'Temperature Control');
    const g=clamp((o.u||0)/10,0,1);s+=`<rect x="330" y="122" width="56" height="56" rx="4" fill="var(--live)" fill-opacity="${fx(0.12+0.75*g)}" stroke="var(--fg)" stroke-width="1.5"/>`;for(let i=0;i<6;i++)s+=`<path d="M${338+i*8} 126V174" stroke="var(--fg)" stroke-width="1.2"/>`;
    s+=`<path d="M386 150H470" stroke="var(--fg)" stroke-dasharray="5 4"/><rect x="470" y="124" width="52" height="52" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><path d="M470 176L522 124" stroke="var(--fg)"/>`+S.t(482,142,'ϑ','')+S.t(510,170,'u','')+`<path d="M522 150H${outX}" stroke="var(--fg)" stroke-width="1.6"/><path d="M${inX} 150H330" stroke="var(--fg)" stroke-width="1.6"/>`;
    if(o.fan){const a=o.fanAng||0;s+=`<g transform="translate(425 104)"><circle r="17" fill="var(--surface)" stroke="var(--fg)"/>${[0,120,240].map(k=>`<path transform="rotate(${fx(a+k)})" d="M0 0C4 -6 10 -12 2 -15C-4 -12 -3 -6 0 0Z" fill="var(--blue)"/>`).join('')}<circle r="2.6" fill="var(--fg)"/></g>`+arT(448,108,'مروحة',{fs:11,a:'start'})}
    s+=`<rect x="300" y="196" width="300" height="52" rx="6" fill="none" stroke="var(--blue)" stroke-dasharray="4 3"/>`+S.t(310,210,'ϑ-Calibration','m','start');
    [['25°',330],['100°',385],['ϑ',440],['|',495],['Sense',550]].forEach(([t,x])=>{s+=S.t(x,226,t,'m')+sock(x,238)});
    if(o.jump)s+=`<path d="M440 238C460 262 530 262 550 238" stroke="var(--stop)" stroke-width="3.2" fill="none"/>`;
    s+=lab(inX,sb('y','T'))+lab(outX,sb('x','T'))}
  else if(kind==='pt1'){s+=board(250,66,490,190,'PT1');s+=`<path d="M${inX} 150H430M570 150H${outX}" stroke="var(--fg)" stroke-width="1.6"/><rect x="430" y="104" width="140" height="92" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
     <path d="M442 184H452C470 130 500 118 560 116" stroke="var(--blue)" stroke-width="2.2" fill="none"/>`+S.t(520,170,sb('T','1'),'');s+=lab(inX,sb('X','5'))+lab(outX,sb('X','6'))}
  else if(kind==='mot'){s+=board(250,66,490,190,'Speed Control');const a=o.ang||0;
    s+=`<path d="M${inX} 150H344M380 150H420" stroke="var(--fg)" stroke-width="1.6"/><path d="M380 150H420" stroke="var(--fg)" stroke-dasharray="5 4"/><circle cx="362" cy="150" r="22" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(362,155,'M','')+
      `<g transform="rotate(${fx(a)} 362 150)"><path d="M362 128V136" stroke="var(--live)" stroke-width="3"/></g>`+
      `<rect x="420" y="124" width="74" height="52" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(457,146,'RPM','m')+`<path d="M424 150H490" stroke="var(--fg)"/>`+S.t(457,166,'TTL','m')+
      `<path d="M494 150H540" stroke="var(--fg)" stroke-width="1.6"/><rect x="540" y="124" width="56" height="52" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><path d="M540 176L596 124" stroke="var(--fg)"/>`+S.t(554,142,'f','')+S.t(584,170,'u','')+`<path d="M596 150H${outX}" stroke="var(--fg)" stroke-width="1.6"/>`;
    s+=lab(inX,sb('y','S'))+lab(outX,sb('x','S'))}
  else if(kind==='light'){s+=board(250,66,490,190,'Light Control');const g=clamp((o.u||0)/10,0,1),g2=clamp((o.y||0)/10,0,1);
    s+=`<path d="M${inX} 150H400" stroke="var(--fg)" stroke-width="1.6"/><rect x="400" y="116" width="70" height="68" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>
     <circle cx="430" cy="150" r="22" fill="var(--live)" fill-opacity="${fx(0.08+0.6*g)}"/><path d="M416 150H444M432 138V162L444 150Z M444 138V162" stroke="var(--fg)" stroke-width="1.6" fill="var(--fg)"/>`+arrow(446,132,462,118,'--live',1.6)+arrow(452,140,468,126,'--live',1.6)+
     `${[0,1,2].map(k=>`<path d="M476 ${138+k*12}H524" stroke="var(--live)" stroke-opacity="${fx(0.15+0.8*g)}" stroke-width="2" stroke-dasharray="4 4"/>`).join('')}
     <rect x="530" y="116" width="70" height="68" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/><circle cx="572" cy="150" r="20" fill="var(--blue)" fill-opacity="${fx(0.05+0.4*g2)}" stroke="var(--fg)"/><path d="M566 136V164M566 144L582 134M566 156L582 166" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`+arrow(538,128,556,140,'--live',1.6)+arrow(538,142,556,154,'--live',1.6)+
     `<path d="M600 150H${outX}" stroke="var(--fg)" stroke-width="1.6"/>`;s+=lab(inX,sb('y','L'))+lab(outX,sb('x','L'))}
  s+=sock(inX,yy,RED)+sock(outX,yy,RED);
  return {svg:s,inX,inY:yy,outX,outY:yy}}
/* the whole bench. o:{kind, ins:'mm'|'osc', inCh:'Y1'|'Y2'|null, outCh:'Y1'|'Y2'|'V', wired, gen, meter, u, y, ...} */
function benchSVG(o){const p=plantBoard(o.kind,o);let s=insSVG(o.ins,o)+genSVG(o)+gndSVG()+p.svg;const ins=INS[o.ins];const X=178;
  if(o.wired!==false){const on=!!o.on;
    s+=wire(`M50 296V334H212V${p.inY}H${p.inX}`,RED,on);
    s+=wire(`M${p.outX} ${p.outY}H726V44H200V${ins[o.outCh]}H${X}`,RED,on);
    if(o.inCh){s+=wire(`M${X} ${ins[o.inCh]}H212V${p.inY}`,RED,on)+dot(212,p.inY)}
    s+=wire(`M${X} ${ins.COM}H224V${GND[1]+8}H${GND[0]}`,BLK)+wire(`M160 296V330H${GND[0]}V${GND[1]+8}`,BLK)}
  if(o.note)s+=o.note;
  return `<svg viewBox="0 0 760 340" role="img" aria-label="${o.aria||'توصيل التجربة على لوحة Com3Lab'}">${s}</svg>`}
/* figure 2-4: the Speed Control board as a fan (disturbance) + constant-voltage board + the orange box */
function fanBoardSVG(o){o=o||{};const on=!!o.on,a=o.ang||0;let s=board(10,20,420,130,'Speed Control');
  s+=sock(40,85,RED)+S.t(40,68,sb('y','S'),'')+`<path d="M46 85H90" stroke="var(--fg)" stroke-width="1.6"/><circle cx="110" cy="85" r="20" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(110,90,'M','')+
   `<path d="M130 85H170" stroke="var(--fg)" stroke-dasharray="5 4"/><rect x="170" y="62" width="64" height="46" fill="var(--surface)" stroke="var(--fg)"/>`+S.t(202,80,'RPM','m')+`<path d="M174 85H230" stroke="var(--fg)"/>`+S.t(202,100,'TTL','m')+
   `<path d="M234 85H262" stroke="var(--fg)"/><rect x="262" y="62" width="50" height="46" fill="var(--surface)" stroke="var(--fg)"/><path d="M262 108L312 62" stroke="var(--fg)"/>`+S.t(274,78,'f','')+S.t(300,102,'u','')+`<path d="M312 85H392" stroke="var(--fg)" stroke-width="1.6"/>`+sock(398,85,RED)+S.t(398,68,sb('x','S'),'')+
   `<path d="M110 105L150 132" stroke="var(--fg)" stroke-dasharray="4 4"/><g transform="translate(170 134)"><circle r="14" fill="var(--surface)" stroke="var(--fg)"/>${[0,120,240].map(k=>`<path transform="rotate(${fx(a+k)})" d="M0 0C3 -5 8 -10 2 -12C-3 -10 -2 -5 0 0Z" fill="var(--blue)"/>`).join('')}</g>`+arT(192,138,'المروحة فوق عنصر التسخين',{fs:11,a:'end'});
  s+=board(10,170,180,64,'');[['10V',45],['5V',100],['1V',155]].forEach(([t,x])=>{s+=S.t(x,190,t,'m')+sock(x,210,RED)});
  if(on)s+=wire('M100 210V250H-2V85H34',RED,true);
  s+=`<rect x="230" y="170" width="200" height="74" rx="6" fill="var(--live-soft)" stroke="var(--live)"/>`+
   `<text class="txt" x="240" y="192" text-anchor="start" font-size="12">ϑ = 60° => w = ${o.w||'....'} V</text><text class="txt" x="240" y="213" text-anchor="start" font-size="12">z = 0  => x = ${o.x0||'....'} V</text><text class="txt" x="240" y="234" text-anchor="start" font-size="12">z = 5V => x = ${o.x1||'....'} V</text>`;
  return `<svg viewBox="-8 10 450 250" role="img" aria-label="لوحة Speed Control تشغّل المروحة بجهد 5 V كتشويش على النظام الحراري">${s}</svg>`}

/* ======================================================================
   The two-channel virtual oscilloscope / recorder
   ====================================================================== */
function scopeSVG(o){const W=640,H=300,L=50,Rr=14,T=12,Bm=36,pw=W-L-Rr,ph=H-T-Bm;const t0=-o.pre,t1=o.W,vmax=o.vmax;
  const X=t=>L+(t-t0)/(t1-t0)*pw,Y=v=>T+ph-v/vmax*ph;const tu=tUnit(o.W);let s=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="var(--lcd)" stroke="var(--con-dim)"/>`;
  for(let i=0;i<=10;i++){const t=o.W*i/10;s+=`<path d="M${fx(X(t))} ${T}V${T+ph}" stroke="var(--con1)" stroke-width="1"/>`;if(i%2===0)s+=`<text class="txt" style="fill:var(--con-ink)" x="${fx(X(t))}" y="${T+ph+15}" font-size="11">${tS(t*tu.k)}</text>`}
  const vt=vmax<=12?2:vmax/5;for(let v=0;v<=vmax+1e-9;v+=vt)s+=`<path d="M${L} ${fx(Y(v))}H${L+pw}" stroke="var(--con1)"/><text class="txt" style="fill:var(--con-ink)" x="${L-6}" y="${fx(Y(v)+4)}" text-anchor="end" font-size="11">${tS(v)}</text>`;
  s+=`<text class="txt" style="fill:var(--con-ink)" x="${L+pw}" y="${H-3}" text-anchor="end" font-size="11">t (${tu.u})</text><text class="txt" style="fill:var(--con-ink)" x="${L+5}" y="${T+13}" text-anchor="start" font-size="11">V</text>`;
  const cid='c2sc'+Math.random().toString(36).slice(2,7);s+=`<defs><clipPath id="${cid}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs><g clip-path="url(#${cid})">`;
  const d=o.data||[];const st=Math.max(1,Math.floor(d.length/700));
  (o.chs||[]).forEach(c=>{if(!d.length)return;let p='';for(let i=0;i<d.length;i+=st){const r=d[i];p+=(p?'L':'M')+fx(X(r[0]))+' '+fx(Y(clamp(r[c.i],-1,vmax*1.2)))}const r=d[d.length-1];p+='L'+fx(X(r[0]))+' '+fx(Y(clamp(r[c.i],-1,vmax*1.2)));
    s+=`<path d="${p}" fill="none" stroke="var(${c.col})" stroke-width="2.2" stroke-linejoin="round"${c.dash?` stroke-dasharray="${c.dash}"`:''}/>`});
  (o.extra||[]).forEach(c=>{if(!c.pts.length)return;s+=`<path d="${c.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],-1,vmax*1.2)))).join('')}" fill="none" stroke="var(${c.col})" stroke-width="2" stroke-dasharray="${c.dash||'6 5'}"/>`});
  const m=o.meas;if(o.show63&&m&&m.T63!=null){const y63=m.y0+0.632*m.dY;s+=`<path d="M${L} ${fx(Y(m.Yend))}H${L+pw}" stroke="var(--con-ink)" stroke-dasharray="3 4"/><path d="M${L} ${fx(Y(y63))}H${fx(X(m.T63))}V${T+ph}" stroke="var(--live)" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/><circle cx="${fx(X(m.T63))}" cy="${fx(Y(y63))}" r="4.5" fill="var(--live)"/>`+
    `<text class="txt" style="fill:var(--live)" x="${fx(X(m.T63)+6)}" y="${fx(Y(y63)-6)}" text-anchor="start" font-size="12">63.2%  T = ${tS(m.T63*tu.k)} ${tu.u}</text>`}
  if(o.cursor!=null){const x=X(o.cursor);s+=`<path d="M${fx(x)} ${T}V${T+ph}" stroke="var(--con-ink)" stroke-width="1.2" stroke-dasharray="2 3"/>`}
  s+='</g>';return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="شاشة راسم الذبذبات">${s}</svg>`}
const sampleAt=(d,t,i)=>{if(!d.length)return null;if(t<=d[0][0])return d[0][i];for(let k=1;k<d.length;k++)if(d[k][0]>=t){const a=d[k-1],b=d[k];const f=(t-a[0])/((b[0]-a[0])||1);return a[i]+(b[i]-a[i])*f}return d[d.length-1][i]};
/* measurement on a finished capture: initial value, settled value, 63.2 % time */
function measure(d,W){const post=d.filter(r=>r[0]>=0);if(post.length<5)return null;const y0=post[0][2];const nE=Math.max(2,Math.floor(post.length*0.01));const Yend=post.slice(-nE).reduce((a,r)=>a+r[2],0)/nE;const dY=Yend-y0;
  const y90=sampleAt(d,0.9*W,2);const settled=Math.abs(post[post.length-1][2]-y90)<=0.01*Math.max(Math.abs(dY),0.05);
  let T63=null;if(Math.abs(dY)>1e-6){const lv=y0+0.632*dY;for(let k=1;k<post.length;k++){const a=post[k-1],b=post[k];if((a[2]-lv)*(b[2]-lv)<=0&&b[2]!==a[2]){T63=a[0]+(lv-a[2])/(b[2]-a[2])*(b[0]-a[0]);break}}}
  return {y0,Yend,dY,T63,settled}}

/* ======================================================================
   Plant models (linear; exact first-order updates).  All parameters = trainer fields.
   ====================================================================== */
const lag=(x,tg,T,h)=>tg+(x-tg)*Math.exp(-h/Math.max(T,1e-9));
const PLANTS={
 th:{init:P=>({q:0,x:0}),step:(s,u,z,h,P)=>{if(chF('hopen')){u=0;z=0}s.q=lag(s.q,P.Ks*u*(chF('hweak')?0.5:1)-P.Kz*z,P.T1,h);s.x=lag(s.x,s.q,P.T2*(chF('sslow')?6:1),h)},y:(s,P)=>chF('sopen')?0:P.xa+(chF('scal')?1.5:0)+s.x,hmax:P=>Math.min(P.T1,P.T2)/4},
 mot:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.Km*u*(chF('mopen')?0:chF('mfric')?0.6:chF('mbrush')?0.9:1),P.Tm*(chF('mfric')?0.6:chF('mbrush')?3:1),h)},y:s=>chF('tacho')?0:s.x,hmax:()=>Infinity},
 pt1:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.K1*u,P.T1,h)},y:s=>s.x,hmax:()=>Infinity},
 light:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.KL*u*(chF('ledopen')?0:chF('dirty')?0.5:1),P.TL*(chF('slow')?5:1),h)},y:s=>s.x+(chF('amb')?0.8:0),hmax:()=>Infinity}};

/* ======================================================================
   Generic step-response bench (used by all three lessons)
   cfg: {k, TP (getter), kinds:[[v,label]], kind0, ins, chans:{kind:{inCh,outCh}}, amp0, ampBook, wins, winBook, speeds, speed0,
         fan, title, plotNames, extraSVG(ctx) …}
   ====================================================================== */
function stepBench(host,cfg){
  const k=cfg.k;const ctx={kind:cfg.kind0,amp:cfg.amp0||0,W:cfg.winBook,speed:cfg.speed0,z:0,wired:false,show63:true,cursor:null,
    cap:null,did:{},plant:null,fanAng:0,ang:0,get P(){return cfg.TP()}};
  host.innerHTML=`<div class="grid c2-lab">
   <div class="panel c12"><h2>${cfg.title}</h2><div id="${k}bench" class="svgbox c2-wide" style="max-width:820px;margin-inline:auto"></div>
    <div class="c2-row">${swHTML(k+'wire','','وصّل الأجهزة حسب الشكل',false)}${cfg.kinds?`<span class="sub">الوحدة المحكومة:</span>${segHTML(k+'kd',cfg.kinds,ctx.kind)}`:''}${cfg.fan?swHTML(k+'fan','z','المروحة 5 V (تشويش)',false):''}</div>
    ${cfg.fan?`<div id="${k}fanb" class="svgbox" style="max-width:520px;margin-inline:auto"></div>`:''}<div id="${k}msg"></div></div>
   <div class="panel c7"><h2>${cfg.ins==='mm'?'راسم الدخل والخرج':'راسم الذبذبات'} <small>${cfg.scopeNote||''}</small></h2>
    <div class="c2-scope"><div class="c2-leg" id="${k}leg"></div><div class="svgbox" id="${k}sc" style="margin:0"></div></div>
    ${sl(k+'cur','مؤشر القراءة على الزمن',0,1000,1,0)}<div class="c2-cur" id="${k}curv"></div>
    <div class="c2-row"><button class="btn" id="${k}63" aria-pressed="true">طريقة <span class="ltr">63.2%</span> على الرسم</button></div></div>
   <div class="panel c5"><h2>مولد الإشارة <small class="ltr">FUNCTION GENERATOR</small></h2>
    ${sl(k+'amp','ارتفاع الخطوة (الدخل)',0,10,0.1,ctx.amp)}<div class="c2-row"><button class="btn" id="${k}ab">${lt(fm(cfg.ampBook,0)+' V')} — قيمة الكتاب</button></div>
    <div class="c2-row"><span class="sub">زمن التسجيل:</span>${segHTML(k+'w',cfg.wins.map(w=>[w,lt(tS(w*tUnit(w).k)+' '+tUnit(w).u)+(w===cfg.winBook?' ★':'')]),ctx.W)}</div>
    <div class="c2-row"><span class="sub">سرعة العرض:</span>${segHTML(k+'sp',cfg.speeds.map(v=>[v,(v<1?'بطيء ':'')+lt('×'+tS(v))]),ctx.speed)}</div>
    <p class="sub" style="margin-top:4px">★ = قيمة الكتاب. سرعة العرض للمشاهدة فقط ولا تغيّر النتائج.</p>
    <div class="c2-row"><button class="btn primary" id="${k}run">شغّل الخطوة وسجّل</button><button class="btn" id="${k}stop">أوقف</button></div>
    <div class="c2-meters" id="${k}m"></div></div>
   <div class="panel c12"><h2>${cfg.tblTitle}</h2><div id="${k}tbl"></div></div>
   ${cfg.extraHTML?cfg.extraHTML(k):''}
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${k}st"></ol></div></div>`;
  const $=s=>host.querySelector(s);ctx.$=$;
  const chans=()=>cfg.chans[ctx.kind];
  const msg=(h,bad)=>{$('#'+k+'msg').innerHTML=h?`<div class="callout${bad?' err':''}">${h}</div>`:''};ctx.msg=msg;
  const plant=()=>PLANTS[ctx.kind];
  ctx.st=plant().init(ctx.P);
  const yNow=()=>plant().y(ctx.st,ctx.P);
  const uNow=()=>ctx.cap&&(ctx.cap.run||ctx.cap.done)&&ctx.cap.t>=0?ctx.cap.amp:0;
  const vmax=()=>{let m=10;if(ctx.cap)ctx.cap.data.forEach(r=>{m=Math.max(m,r[1],r[2])});return niceMax(m*1.08)};
  const chList=()=>{const c=chans();if(cfg.ins==='mm')return [{i:1,col:'--live',name:'الدخل '+cfg.inName},{i:2,col:'--lcd-ink',name:'الخرج '+cfg.outName}];
    const L=[{i:1,col:'--live',ch:c.inCh,name:c.inCh+' = الدخل '+cfg.inName},{i:2,col:'--lcd-ink',ch:c.outCh,name:c.outCh+' = الخرج '+cfg.outName}];return L.sort((x,y)=>x.ch<y.ch?-1:1)};
  ctx.redraw=(fast)=>{const c=chans(),cap=ctx.cap,u=uNow(),y=yNow();
    $('#'+k+'bench').innerHTML=benchSVG(Object.assign({kind:ctx.kind,ins:cfg.ins,inCh:cfg.ins==='mm'?null:c.inCh,outCh:cfg.ins==='mm'?'V':c.outCh,wired:ctx.wired,on:u>0,u,y,
      gen:fm(cap?cap.amp:ctx.amp,1)+' V',meter:fm(y,2)+' V',fan:cfg.fan,fanAng:ctx.fanAng,ang:ctx.ang,jump:false},cfg.benchExtra?cfg.benchExtra(ctx):{}));
    if(cfg.fan)$('#'+k+'fanb').innerHTML=fanBoardSVG({on:ctx.z>0,ang:ctx.fanAng,w:fm(60*ctx.P.sc,1),x0:ctx.rows.x0?fm(ctx.rows.x0.Y,2):null,x1:ctx.rows.x1?fm(ctx.rows.x1.Y,2):null});
    const W=cap?cap.W:ctx.W,data=cap?cap.data:[];
    const L=chList();$('#'+k+'leg').innerHTML=L.map(x=>`<span><i style="background:var(${x.col})"></i>${x.name}</span>`).join('')+(cap&&cap.run?'<span>● يسجّل…</span>':'');
    const m=cap&&cap.done?cap.meas:null;
    $('#'+k+'sc').innerHTML=scopeSVG({W,pre:0.05*W,data,chs:L,vmax:vmax(),cursor:ctx.cursor,meas:m,show63:ctx.show63&&cfg.show63!==false,extra:cfg.scopeExtra?cfg.scopeExtra(ctx):[]});
    const tc=ctx.cursor;const tu=tUnit(W);$('#'+k+'cur-v').textContent=tc==null?'—':tS(tc*tu.k)+' '+tu.u;
    $('#'+k+'curv').innerHTML=tc==null||!data.length?'<span>حرّك المؤشر لتقرأ القيم</span>':L.map(x=>`<span>${x.ch||(x.i===1?'in':'out')}: ${fm(sampleAt(data,tc,x.i),2)} V</span>`).join('');
    $('#'+k+'amp-v').textContent=fm(ctx.amp,1)+' V';
    $('#'+k+'m').innerHTML=meters(cfg.meters(ctx,u,y));
    if(!fast)cfg.table(ctx,$('#'+k+'tbl'));
    if(ctx.steps)ctx.steps.check()};
  ctx.rows=cfg.rows0?cfg.rows0():[];
  /* controls */
  $('#'+k+'wire').onclick=()=>{ctx.wired=!ctx.wired;$('#'+k+'wire').setAttribute('aria-pressed',String(ctx.wired));if(ctx.wired)ctx.did.wired=1;msg(ctx.wired?'التوصيل جاهز (والمدرب راجعه). اضبط المولد ثم «شغّل».':'');ctx.redraw()};
  if(cfg.kinds)segBind(host,k+'kd',v=>{ctx.kind=v;ctx.cap=null;ctx.st=plant().init(ctx.P);ctx.did['kind_'+v]=1;msg(cfg.kindMsg?cfg.kindMsg(v):'');ctx.redraw()});
  if(cfg.fan)$('#'+k+'fan').onclick=()=>{ctx.z=ctx.z?0:5;$('#'+k+'fan').setAttribute('aria-pressed',String(!!ctx.z));if(ctx.cap&&ctx.cap.run)ctx.cap.zchg=true;ctx.redraw()};
  $('#'+k+'amp').oninput=e=>{ctx.amp=+e.target.value;ctx.redraw()};
  $('#'+k+'ab').onclick=()=>{ctx.amp=cfg.ampBook;$('#'+k+'amp').value=ctx.amp;ctx.redraw()};
  segBind(host,k+'w',v=>{ctx.W=+v;if(!(ctx.cap&&ctx.cap.run)){ctx.cap=null;ctx.cursor=null;$('#'+k+'cur').value=0}ctx.redraw()});
  segBind(host,k+'sp',v=>{ctx.speed=+v});
  $('#'+k+'63').onclick=()=>{ctx.show63=!ctx.show63;$('#'+k+'63').setAttribute('aria-pressed',String(ctx.show63));ctx.redraw()};
  $('#'+k+'cur').oninput=e=>{const W=ctx.cap?ctx.cap.W:ctx.W;ctx.cursor=+e.target.value/1000*W;ctx.did.cursor=1;ctx.redraw()};
  $('#'+k+'run').onclick=()=>{if(!ctx.wired){msg('وصّل الأجهزة أولاً حسب الشكل، واطلب من المدرب مراجعة التوصيل.',1);return}
    if(ctx.amp<=0){msg('ارتفاع الخطوة صفر: ارفعه أولاً.',1);return}
    const W=ctx.W;ctx.st=plant().init(ctx.P);ctx.cap={W,pre:0.05*W,ds:1.05*W/4200,t:-0.05*W,amp:ctx.amp,z:ctx.z,zchg:false,kind:ctx.kind,data:[],run:true,done:false};
    ctx.cap.data.push([ctx.cap.t,0,yNow()]);msg(cfg.fan?'يبدأ التسجيل من درجة حرارة الغرفة (في المختبر الحقيقي انتظر حتى يبرد العنصر قبل كل تشغيل).':'');ctx.redraw()};
  $('#'+k+'stop').onclick=()=>{if(ctx.cap&&ctx.cap.run){ctx.cap.run=false;msg('أوقفت التسجيل قبل نهايته: لا يمكن تسجيل النتائج من تسجيل ناقص.',1)}ctx.redraw()};
  /* simulation loop */
  loopOn(host,dt=>{let dirty=false;const P=ctx.P;
    if(ctx.cap&&ctx.cap.run){const c=ctx.cap;let adv=dt*ctx.speed;const pl=plant();const hm=pl.hmax(P);
      while(adv>1e-12&&c.t<c.W-1e-12){const ch=Math.min(c.ds,c.W-c.t);const n=Math.max(1,Math.ceil(ch/hm));const h=ch/n;const u=c.t>=-1e-12?c.amp:0;
        for(let i=0;i<n;i++)pl.step(ctx.st,u,ctx.z,h,P);c.t+=ch;adv-=ch;c.data.push([c.t,c.t>=-1e-12?c.amp:0,pl.y(ctx.st,P)])}
      if(c.t>=c.W-1e-12){c.run=false;c.done=true;c.meas=measure(c.data,c.W);ctx.did.cap=1;if(cfg.onDone)cfg.onDone(ctx);ctx.redraw();return}dirty=true}
    else if(ctx.cap&&ctx.cap.done){/* generator stays on: keep the plant at its state (steady) */}
    const y=yNow();if(cfg.spin){const r=cfg.spin(ctx,y);if(r){ctx.ang=(ctx.ang+r*dt)%360;dirty=true}}
    if(cfg.fan&&ctx.z>0){ctx.fanAng=(ctx.fanAng+720*dt)%360;dirty=true}
    if(dirty)ctx.redraw(true)});
  ctx.reset=(m)=>{ctx.cap=null;ctx.st=plant().init(ctx.P);ctx.cursor=null;$('#'+k+'cur').value=0;if(cfg.clearRows)cfg.clearRows(ctx);if(m)msg(m);ctx.redraw()};
  ctx.steps=stepsUI($('#'+k+'st'),cfg.steps(ctx));
  if(cfg.init)cfg.init(ctx);
  ctx.redraw();
  return ctx}

/* the gain table used by u2-l2 and u2-l3 (book: K_s = X0/Y0 ; corrected: K_s = Y0/X0) */
function gainTable(ctx,el,o){const rows=ctx.rows;const mode=ctx.mode||'book';const tu=tUnit(ctx.W);
  const recBtn=`<div class="c2-row"><button class="btn primary" data-rec="1">سجّل القياس في الجدول</button><button class="btn" data-clr="1">امسح الجدول</button><span class="sub">الصيغة:</span>${segHTML('gm',[['book','كما في الكتاب'],['fixed','المصحح']],mode)}</div>`;
  const K=r=>mode==='book'?r.X0/r.Y0:r.Y0/r.X0;
  const tbl=`<div class="c2-tbl"><table class="c2-bt"><thead><tr><th>#</th><th>الوحدة</th><th>قيمة الخطوة ${lt('X<sub>0</sub> (V)')}</th><th>القيمة التي استقر عليها الخرج ${lt('Y<sub>0</sub> (V)')}</th><th>الكسب ${lt(mode==='book'?'K<sub>s</sub> = X<sub>0</sub> / Y<sub>0</sub>':'K<sub>s</sub> = Y<sub>0</sub> / X<sub>0</sub>')}</th><th>الثابت الزمني ${lt('T')}</th></tr></thead><tbody>${rows.length?rows.map((r,i)=>`<tr><td>${i+1}</td><td style="font-family:var(--font);direction:rtl">${o.kname(r.kind)}</td><td>${fm(r.X0,2)}</td><td>${fm(r.Y0,2)}</td><td class="${mode==='book'?'bad':''}">${fm(K(r),3)}</td><td>${r.T==null?'—':fm(r.T*tUnit(r.W).k,tUnit(r.W).k>1?2:3)+' '+tUnit(r.W).u}</td></tr>`).join(''):'<tr><td colspan="6" style="font-family:var(--font);direction:rtl">الجدول فارغ: شغّل الخطوة ثم «سجّل القياس».</td></tr>'}</tbody></table></div>`;
  const last=rows[rows.length-1];let res='';
  if(last){const Kb=last.X0/last.Y0,Kf=last.Y0/last.X0,Tv=last.T;const Tt=Tv==null?'T':tS(Tv);
    res=`<div class="c2-calc">Ks = ${mode==='book'?'X0 / Y0':'Y0 / X0'} = ${mode==='book'?fm(last.X0,2)+' / '+fm(last.Y0,2):fm(last.Y0,2)+' / '+fm(last.X0,2)} = ${fm(mode==='book'?Kb:Kf,3)}
T  = time for output to reach <span class="ltr">63.2%</span> of Y0 = ${Tv==null?'—':fm(Tv,4)+' s'}</div>
     <p class="c2-gs">${o.gsLabel}: ${B.tex(`G(s)=\\frac{K_s}{T\\,s+1}=\\frac{${fm(mode==='book'?Kb:Kf,3)}}{${Tt}\\,s+1}`,false)}</p>
     ${mode==='book'?`<div class="callout err">بصيغة الكتاب \\(K_s=X_0/Y_0\\) يخرج <b class="ltr">${fm(Kb,3)}</b>، وهو <b>مقلوب</b> الكسب: الكسب = الخرج ÷ الدخل = <b class="ltr">${fm(Kf,3)}</b>. اختر «المصحح».</div>`:`<div class="callout">الكسب = الخرج المستقر ÷ قيمة الخطوة = <b class="ltr">${fm(Kf,3)}</b>${o.model?`، وفي نموذج المحاكاة <b class="ltr">${fm(o.model(last.kind).K,3)}</b>، والثابت الزمني في النموذج <b class="ltr">${fm(o.model(last.kind).T,4)} s</b>`:''}.${last.settled?'':' <b>تنبيه:</b> الخرج لم يستقر تماماً خلال زمن التسجيل، فالقياس تقريبي: اختر زمناً أطول.'}</div>`}`}
  el.innerHTML=recBtn+tbl+res;B.math(el);
  el.querySelector('[data-rec]').onclick=()=>{const c=ctx.cap;if(!c||!c.done){ctx.msg('لا يوجد تسجيل مكتمل: شغّل الخطوة وانتظر حتى ينتهي زمن التسجيل.',1);return}
    if(ctx.rows.length>=6)ctx.rows.shift();const m=c.meas;ctx.rows.push({X0:c.amp,Y0:m.Yend,T:m.T63,W:c.W,kind:c.kind,settled:m.settled});ctx.did.rec=1;if(o.onRec)o.onRec(ctx);ctx.msg('سُجّل القياس في الجدول.');ctx.redraw()};
  el.querySelector('[data-clr]').onclick=()=>{ctx.rows.length=0;ctx.redraw()};
  segBind(el,'gm',v=>{ctx.mode=v;ctx.did['mode_'+v]=1;ctx.redraw()})}

/* static figure: an ideal PT1 step response with the 63.2 % construction (theory) */
function pt1FigSVG(){const W=560,H=260,L=46,T=18,pw=W-L-20,ph=H-T-40;const X=t=>L+t/5*pw,Y=v=>T+ph-v/1.1*ph;let s='';
  for(let i=0;i<=5;i++)s+=`<path d="M${fx(X(i))} ${T}V${T+ph}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(i)),T+ph+16,i?i+'T':'0','m');
  [0,0.632,1].forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${L+pw}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),v===0?'0':v===1?'K·X0':'0.632','m','end')});
  s+=`<path d="M${L} ${T}V${T+ph}H${L+pw}" stroke="var(--fg)" fill="none"/>`;
  let p='';for(let i=0;i<=100;i++){const t=i/20;p+=(i?'L':'M')+fx(X(t))+' '+fx(Y(1-Math.exp(-t)))}s+=`<path d="${p}" stroke="var(--blue)" stroke-width="2.4" fill="none"/>`;
  s+=`<path d="M${L} ${fx(Y(0.632))}H${fx(X(1))}V${T+ph}" stroke="var(--live)" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/><circle cx="${fx(X(1))}" cy="${fx(Y(0.632))}" r="4.5" fill="var(--live)"/>`;
  s+=`<path d="M${L} ${T+ph}L${fx(X(1))} ${fx(Y(1))}" stroke="var(--muted)" stroke-dasharray="2 4"/>`;
  s+=arT(X(1)+12,Y(0.632)+18,'عند '+'<tspan direction="ltr" unicode-bidi="embed">'+'t = T</tspan> يصل الخرج إلى '+'<tspan direction="ltr" unicode-bidi="embed">'+'63.2%</tspan>',{a:'end',fs:12,col:'--live'})+arT(X(3.6),Y(0.72),'بعد '+'<tspan direction="ltr" unicode-bidi="embed">'+'4T</tspan> إلى '+'<tspan direction="ltr" unicode-bidi="embed">'+'5T</tspan>: '+'<tspan direction="ltr" unicode-bidi="embed">'+'98%</tspan> إلى '+'<tspan direction="ltr" unicode-bidi="embed">'+'99%</tspan>',{fs:12});
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="استجابة نظام الرتبة الأولى للخطوة وطريقة 63.2 بالمئة">${s}</svg>`}
/* open-loop block diagram */
function openLoopSVG(o){o=o||{};let s='';const bx=(x,y,w,h,t1,t2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+arT(x+w/2,y+h/2+(t2?-4:5),t1,{fs:13})+(t2?S.t(x+w/2,y+h/2+16,t2,'m'):'');
  s+=bx(20,50,120,56,'مولد الإشارة','w')+bx(220,50,160,56,o.plant||'الوحدة المحكومة',o.sym||'')+bx(460,50,120,56,o.meter||'جهاز القياس','');
  s+=arrow(140,78,220,78,'--fg')+arrow(380,78,460,78,'--fg')+S.t(180,70,o.u||'y','')+S.t(420,70,o.y||'x','');
  if(o.z)s+=arrow(300,8,300,50,'--stop')+S.t(312,22,'z','','start')+arT(360,22,'تشويش',{fs:12,col:'--stop'});
  return `<svg viewBox="0 0 600 120" role="img" aria-label="مخطط الحلقة المفتوحة">${s}</svg>`}
/* Simulink diagram of u2-l2 (Step → Ks/(T.s+1) → Mux ← Step ; Mux → Scope) */
function slk2SVG(o){o=o||{};const num=o.num||'Ks',den=o.den||'T.s+1';let s='';const blk=(x,y,w,h,inner,name)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>${inner}${S.t(x+w/2,y+h+16,name,'m')}`;
  s+=blk(20,90,60,50,`<path d="M30 130H46V102H70" stroke="var(--fg)" stroke-width="2" fill="none"/>`,'Step');
  s+=blk(190,80,150,70,`<text class="txt" x="265" y="108">${num}</text><path d="M204 115H326" stroke="var(--fg)"/><text class="txt" x="265" y="138">${den}</text>`,'Transfer Fcn');
  s+=`<rect x="420" y="60" width="10" height="110" fill="var(--fg)"/>`+S.t(425,186,'Mux','m');
  s+=blk(500,90,60,50,`<rect x="508" y="98" width="44" height="30" fill="var(--lcd)"/><path d="M510 124H520V106H550" stroke="var(--live)" stroke-width="1.4" fill="none"/><path d="M510 124H520C528 110 535 107 550 106" stroke="var(--lcd-ink)" stroke-width="1.4" fill="none"/>`,'Scope');
  s+=`<path d="M80 115H130" stroke="var(--fg)" stroke-width="1.6"/>`+dot(130,115)+arrow(130,115,190,115,'--fg',1.6)+`<path d="M130 115V30H390V80" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`+arrow(390,80,420,80,'--fg',1.6)+`<path d="M340 115H380V150" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`+arrow(380,150,420,150,'--fg',1.6)+arrow(430,115,500,115,'--fg',1.6);
  return `<svg viewBox="0 0 580 200" role="img" aria-label="مخطط Simulink: Step ثم دالة الرتبة الأولى، والدخل والخرج معاً عبر Mux إلى Scope">${s}</svg>`}
/* figure 2-6: slope of the static curve */
function slopeFigSVG(){const W=520,H=300,L=58,T=20,pw=W-L-20,ph=H-T-48;const X=y=>L+(y-1.6)/(7.4-1.6)*pw,Y=x=>T+ph-(x-3.6)/(10.4-3.6)*ph;let s='';
  [2,3,4,5,6,7].forEach(v=>{s+=S.t(fx(X(v)),T+ph+16,v,'m')});[4,5,6,7,8,9,10].forEach(v=>{s+=S.t(L-8,fx(Y(v)+4),v,'m','end')});
  s+=`<path d="M${L} ${T}V${T+ph}H${L+pw}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`+S.t(L+pw,H-6,sb('y','T')+' /V','','end')+S.t(L+6,T+4,sb('x','T')+' /V','','start');
  s+=`<path d="M${fx(X(2))} ${fx(Y(5.6))}L${fx(X(7))} ${fx(Y(9.85))}" stroke="var(--live)" stroke-width="5" stroke-linecap="round"/>`;
  s+=`<path d="M${fx(X(2.4))} ${fx(Y(5.8))}H${fx(X(5.6))}V${fx(Y(8.6))}" stroke="var(--fg)" stroke-width="1.8" fill="none"/>`+S.t(fx(X(4)),fx(Y(5.8)+16),'Δ'+sb('y','T'),'')+S.t(fx(X(5.6)+8),fx(Y(7.2)),'Δ'+sb('x','T'),'','start');
  s+=`<rect x="${L+pw-200}" y="${T+ph-70}" width="190" height="34" rx="4" fill="var(--live-soft)" stroke="var(--live)"/>`+S.t(L+pw-105,T+ph-48,'KP = ΔxT / ΔyT = ……','');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الشكل 2-6: حساب الميل من منحنى الخواص">${s}</svg>`}

/* ======================================================================
   u2-l1 — thermal system
   ====================================================================== */
const TH_DEF=[
 {k:'Ks',label:'كسب النظام الحراري (زيادة الخرج لكل 1 V دخل)',unit:'V/V',value:0.85,min:0.1,max:2,step:0.01,hint:'0.85 مأخوذة تقريباً من ميل الشكل (2-6)'},
 {k:'xa',label:'جهد الحساس عند حرارة الغرفة (الدخل صفر)',unit:'V',value:2.5,min:0,max:5,step:0.1},
 {k:'T1',label:'الثابت الزمني للتسخين',unit:'s',value:40,min:2,max:200,step:1},
 {k:'T2',label:'الثابت الزمني لحساس الحرارة (سبب البداية البطيئة)',unit:'s',value:6,min:0.5,max:60,step:0.5},
 {k:'Kz',label:'نقص الخرج لكل 1 V على المروحة',unit:'V/V',value:0.2,min:0,max:1,step:0.01},
 {k:'sc',label:'مقياس الحساس (فولت لكل درجة مئوية)',unit:'V/°C',value:0.1,min:0.02,max:0.5,step:0.01}];
const thFinal=(P,w,z)=>P.xa+P.Ks*w-P.Kz*z;

B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'9–14',
 title:'التجربة الأولى: استجابة نظام حراري لإشارة الخطوة',
 summary:'نسلّط خطوة جهد w = 7 V على عنصر التسخين ونسجّل خرج حساس الحرارة 200 ثانية، ثم نعيدها والمروحة تعمل بجهد 5 V كتشويش فنرى أن الحلقة المفتوحة لا تصحح نقص الخرج. وفي الجزء الثاني نرسم منحنى الخواص الاستاتيكي (الخرج المستقر مع الدخل) ونحسب ميله K<sub>p</sub>.',
 stations:[
  (/*DCML-BEGIN*/(window.DCML=window.DCML||(function(){
/* «مختبر مصغّر» — أدوات صغيرة مشتركة لمحطات الأسلوب التفاعلي في مقرر مختبر التحكم الآلي.
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

  {st:1,short:'الدائرة المفتوحة',title:'الوحدة الثانية: الاستجابة الزمنية لأنظمة ذات دائرة مفتوحة',ref:'ص 9',
   q:'نعطي النظام دخلاً ثابتاً ولا نراقب خرجه لنصححه… فماذا يحدث لو تغيّر شيء من الخارج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الحلقة المفتوحة: مولد الإشارة ثم الوحدة المحكومة ثم جهاز القياس، والتشويش يدخل من أعلى، ومسار الرجوع مشطوب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="22" y="128" width="90" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="67.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مولد</text><text x="67.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">الإشارة</text><g data-tip="الوحدة المحكومة: النظام الحراري أو المحرك أو نظام الإضاءة في تجارب هذه الوحدة."><rect x="135" y="128" width="90" height="62" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="180.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة</text><text x="180.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">المحكومة</text></g><rect x="248" y="128" width="90" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="293.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">جهاز</text><text x="293.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">القياس</text><line x1="112" y1="159" x2="124.0" y2="159.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M135.0 159.0 L124.0 164.5 L124.0 153.5 Z" fill="#2C4A40"/><line x1="225" y1="159" x2="237.0" y2="159.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M248.0 159.0 L237.0 164.5 L237.0 153.5 Z" fill="#2C4A40"/><text x="123" y="148" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y</text><text x="237" y="148" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x</text><g data-tip="التشويش ⟦z⟧: مؤثر خارجي لا نتحكم فيه؛ في التجربة الأولى مروحة تبرّد عنصر التسخين."><line x1="180" y1="66" x2="180.0" y2="115.0" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M180.0 126.0 L174.5 115.0 L185.5 115.0 Z" fill="#E8735A"/><text x="180" y="56" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">z</tspan> تشويش</text><rect x="150" y="40" width="60" height="86" fill="transparent"/></g><g data-tip="في الدائرة المفتوحة لا يوجد هذا المسار: لا يُقاس الخرج ليُصحَّح الدخل. هذا المسار موجود في الدائرة المغلقة (الوحدة الثالثة)."><path d="M293 190 V232 H67 V190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 5"/><line x1="171" y1="223" x2="189" y2="241" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><line x1="171" y1="241" x2="189" y2="223" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><rect x="60" y="200" width="240" height="44" fill="transparent"/></g><text x="180" y="274" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">لا يرجع الخرج ليصحح الدخل</text></svg>`,
   cap:'في الدائرة المفتوحة تسير الإشارة في اتجاه واحد، ولا يرجع قياس الخرج إلى الدخل.<br><b>مرّر المؤشر على التشويش والصندوق الأصفر والمسار المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة المفتوحة، هل يُقاس الخرج ويرجع ليصحح الدخل؟',opts:[
     ['نعم، دائماً',false,'هذا وصف الدائرة المغلقة (الوحدة الثالثة)، لا المفتوحة.'],
     ['لا، الدخل يذهب إلى النظام ولا يرجع قياس الخرج',true,'لهذا لا تصحح الدائرة المفتوحة أثر التشويش، كما ستجد في هذه التجربة.'],
     ['نعم، لكن عند التشويش فقط',false,'لا يوجد مسار رجوع في الدائرة المفتوحة أصلاً.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الوحدة الثانية: تحليل الاستجابة الزمنية لبعض الأنظمة الصناعية ذات الدائرة المفتوحة</b></p>`,ref:'ص 9'},
    {tip:String.raw`<p>في هذه الوحدة لا يوجد «حاكم»: نعطي النظام دخلاً ثابتاً ونقيس كيف يتصرف خرجه مع الزمن. نسمي ذلك <b>الاستجابة الزمنية</b>. ونستخدم <b>إشارة الخطوة</b>: جهد يقفز فجأة من الصفر إلى قيمة ثابتة. من شكل الاستجابة نعرف: إلى أين يصل الخرج (الكسب)، وبأي سرعة (الثابت الزمني). و<b>التشويش</b> \(z\) مؤثر خارجي لا نتحكم فيه (هنا مروحة تبرّد العنصر).</p>`},
    {tip:box(openLoopSVG({plant:'النظام الحراري',z:1,u:'y',y:'x'}),600)+String.raw`<p class="sub">الحلقة (الدائرة) المفتوحة للنظام الحراري: الدخل يذهب إلى الوحدة المحكومة، ولا يرجع قياس الخرج ليصحح الدخل.</p>`,title:'مخطط الحلقة المفتوحة'},
    {add:String.raw`<p>مثال من الحياة: سخّان ماء تشغّله بمؤقت لمدة ثابتة دون منظم حرارة (ثرموستات). إذا كان الجو بارداً يخرج الماء أبرد من المعتاد، لأن السخّان لا «يعرف» درجة الماء ليعوّض. هذه دائرة مفتوحة.</p>`,title:'دائرة مفتوحة في البيت'},
    {title:'مختبر مصغّر: مفتوحة أم مغلقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'السؤال الذي يفرّق بينهما: هل يُقاس الخرج ويرجع ليصحح الدخل؟ صنّف كل نظام.',cats:['دائرة مفتوحة','دائرة مغلقة'],items:[
 ['سخّان ماء يعمل بمؤقت لمدة ثابتة، بلا منظم حرارة.',0,'لا أحد يقيس حرارة الماء ليعوّض؛ إذا برد الجو يخرج الماء أبرد.'],
 ['تجربة هذا الدرس: المولد يعطي جهد التسخين، والملتيميتر يقرأ الخرج فقط.',0,'الملتيميتر يعرض القراءة لنا، ولا يرجع قياسه ليغيّر جهد المولد.'],
 ['مكيّف يقيس حرارة الغرفة ويزيد التبريد إذا ارتفعت عن الدرجة المضبوطة.',1,'القياس يرجع ويغيّر عمل المكيّف: هذه تغذية راجعة (موضوع الوحدة الثالثة).'],
 ['نشغّل المروحة (تشويش) فينخفض الخرج ويبقى منخفضاً.',0,'هذا ما يحدث في الدائرة المفتوحة: لا شيء يصحح أثر التشويش.']]})}
   ]},

  {st:2,short:'الهدف من التجربة',title:'التجربة الأولى — الهدف من التجربة',ref:'ص 10',
   q:'ما الذي يُنتظر أن تتعلمه من تسخين عنصر وتشغيل مروحة عليه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لأهداف التجربة الأولى" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المختبر ⟦Com3Lab⟧: كرت إلكتروني عليه لوحات، وأجهزته تظهر على شاشة الحاسب."><rect x="184" y="48" width="136" height="88" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="302" cy="66" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="302" y="71" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="248" y="96" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">أجهزة مختبر</text><text x="252" y="116" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">Com3Lab</tspan></text></g><rect x="40" y="48" width="136" height="88" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="158" cy="66" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="158" y="71" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="104" y="96" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">تشغيل الكرت</text><text x="108" y="116" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">الإلكتروني</text><g data-tip="إشارة الخطوة: جهد يقفز فجأة من الصفر إلى قيمة ثابتة، ونراقب كيف يتغير الخرج مع الزمن."><rect x="184" y="148" width="136" height="88" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="302" cy="166" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="302" y="171" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3</text><text x="248" y="196" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">استجابة نظام</text><text x="252" y="216" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">حراري للخطوة</text></g><g data-tip="التشويش: مؤثر خارجي لا نتحكم فيه، وهو هنا المروحة."><rect x="40" y="148" width="136" height="88" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="158" cy="166" r="11" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="158" y="171" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">4</text><text x="104" y="196" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">تأثير التشويش</text><text x="108" y="216" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">على الحلقة المفتوحة</text></g><text x="180" y="272" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أهداف التجربة الأولى</text></svg>`,
   cap:'أهداف التجربة الأربعة بترتيب الكتاب، والهدف الأصفر هو موضوع القياس الرئيس.<br><b>مرّر المؤشر على البطاقات 1 و3 و4 (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي من هذه <b>ليس</b> من أهداف التجربة الأولى؟',opts:[
     ['تأثير التشويش على الحلقة المفتوحة',false,'هذا الهدف الرابع في ص 10.'],
     ['ضبط حاكم تناسبي تكاملي تفاضلي',true,'الحاكمات موضوع الوحدة الثالثة؛ هذه التجربة بلا حاكم.'],
     ['استجابة نظام حراري لإشارة الخطوة',false,'هذا الهدف الثالث في ص 10.'],
     ['طريقة تشغيل الكرت الإلكتروني',false,'هذا الهدف الثاني في ص 10.']]}}
   ],
   body:[
    {book:String.raw`<p><b>التجربة الأولى: استجابة نظام حراري لإشارة الخطوة</b></p><p><b>الهدف من التجربة:</b></p><p>أن يتعرف المتدرب من خلال هذه التجربة على:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم <span class="ltr">Com3Lab</span></li><li>طريقة تشغيل الكرت الإلكتروني المبني عليه هذا المختبر.</li><li>استجابة نظام حراري لإشارة الخطوة.</li><li>تأثير التشويش على الحلقة المفتوحة.</li></ul>`,ref:'ص 10'},
    {tip:String.raw`<p><span class="ltr">Com3Lab</span> كرت إلكتروني عليه عدة «لوحات» (حراري، سرعة، إضاءة، حاكمات)، والأجهزة (المولد، الملتيميتر، راسم الذبذبات) أجهزة افتراضية تظهر على شاشة الحاسب ونوصل أسلاكها على صورة اللوحة.</p>`},
    {title:'تحقق سريع: أهداف التجربة',widget:(el,B)=>DCML.tf(el,B,{intro:'قائمة أهداف للحفظ: احكم على كل عبارة بحسب نص الكتاب (ص 10).',items:[
 ['من أهداف التجربة معرفة طريقة تشغيل الكرت الإلكتروني المبني عليه المختبر.',true,'هذا الهدف الثاني.'],
 ['تدرس التجربة استجابة نظام حراري لإشارة الخطوة.',true,'هذا الهدف الثالث، وهو عنوان التجربة.'],
 ['تدرس التجربة تأثير التشويش على الحلقة المغلقة.',false,'الهدف الرابع: «تأثير التشويش على الحلقة المفتوحة»؛ الحلقة المغلقة في الوحدة الثالثة.']]})}
   ]},

  {st:3,short:'الأجهزة والمكونات',title:'الأجهزة والمكونات',ref:'ص 10',
   q:'خمسة أجهزة على الطاولة… أيها يعطي الدخل، وأيها يقرأ الخرج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خمسة أجهزة: مصدر التغذية والكرت الإلكتروني ومولد الإشارة والوحدة المتحكم فيها وجهاز قياس الجهد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="مصدر التغذية ⟦Power Supply⟧: يغذي الكرت الإلكتروني بالكهرباء."><rect x="234" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="268" y="74" width="32" height="24" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><line x1="277" y1="74" x2="277" y2="64" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="291" y1="74" x2="291" y2="64" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M284 98 V108" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="284.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مصدر التغذية</text></g><g data-tip="الكرت الإلكتروني: اللوحة التي يُبنى عليها المختبر، وعليها لوحات التجارب."><rect x="130" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="154" y="69" width="52" height="34" rx="4" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><rect x="160" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="174" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="188" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><line x1="160" y1="96" x2="200" y2="96" stroke="#F2C14E" stroke-width="2" stroke-linecap="round"/><text x="180.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">الكرت الإلكتروني</text></g><g data-tip="مولد الإشارة ⟦Function Generator⟧: يعطي إشارة الخطوة، أي جهداً يقفز فجأة إلى قيمة نختارها."><rect x="26" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="52" y="69" width="48" height="34" rx="4" fill="#1F3A33" stroke="#2C4A40" stroke-width="2"/><path d="M58 95 H70 V77 H94" fill="none" stroke="#F2C14E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="76.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مولد إشارة</text></g><g data-tip="الوحدة المتحكم فيها ⟦Controlled Unit⟧: هنا لوحة ⟦Temperature Control⟧ (عنصر تسخين وحساس حرارة)."><rect x="182" y="160" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="208" y="184" width="48" height="28" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="216" y1="188" x2="216" y2="208" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="224" y1="188" x2="224" y2="208" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="232" y1="188" x2="232" y2="208" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="240" y1="188" x2="240" y2="208" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="248" y1="188" x2="248" y2="208" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><text x="232.0" y="246" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">وحدة متحكم فيها</text></g><g data-tip="جهاز قياس الجهد ⟦Multimeter⟧: يقرأ جهد الخرج ⟦x_T⟧."><rect x="78" y="160" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="106" y="179" width="44" height="38" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="112" y="184" width="32" height="14" rx="2" fill="#1F3A33" stroke="#2C4A40" stroke-width="0"/><text x="128" y="213" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="128.0" y="246" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">جهاز قياس الجهد</text></g><text x="180" y="288" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الأجهزة والمكونات</text></svg>`,
   cap:'الأجهزة والمكونات الخمسة بترتيب الكتاب.<br><b>مرّر المؤشر على كل جهاز (أو المسه في الجوال) لتعرف اسمه الإنجليزي ودوره.</b>',
   side:[
    {predict:{q:'أي جهاز يقرأ جهد الخرج في هذه التجربة؟',opts:[
     ['مولد الإشارة',false,'المولد يعطي الدخل (الخطوة)، لا يقرأ الخرج.'],
     ['مصدر التغذية',false,'مصدر التغذية يغذي الكرت فقط.'],
     ['جهاز قياس الجهد <span class="ltr">Multimeter</span>',true,'الملتيميتر موصول بمقبس الخرج في الشكل <span class="ltr">(2-3)</span>.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية <span class="ltr">(Power Supply)</span></li><li>الكرت الإلكتروني.</li><li>مولد إشارة <span class="ltr">Function Generator</span></li><li>وحدة متحكم فيها <span class="ltr">(Controlled Unit)</span></li><li>جهاز قياس الجهد <span class="ltr">Multimeter</span></li></ul>`,ref:'ص 10'},
    {tip:String.raw`<p>المولد يعطي <b>الدخل</b> (خطوة الجهد)، والوحدة المتحكم فيها هي <b>النظام</b> نفسه (لوحة <span class="ltr">Temperature Control</span>)، والملتيميتر يقرأ <b>الخرج</b>. ومصدر التغذية والكرت يشغّلان كل ذلك.</p>`},
    {title:'مختبر مصغّر: ما دور كل جهاز؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل جهاز من قائمة الكتاب اختر دوره في التجربة.',cats:['يعطي الدخل','النظام نفسه','يقرأ الخرج','يشغّل اللوحة'],items:[
 ['مولد إشارة Function Generator',0,'يعطي خطوة الجهد w على دخل عنصر التسخين.'],
 ['وحدة متحكم فيها Controlled Unit (لوحة Temperature Control)',1,'هي النظام الحراري الذي ندرس استجابته.'],
 ['جهاز قياس الجهد Multimeter',2,'موصول بمقبس خرج الحساس في الشكل (2-3).'],
 ['مصدر التغذية Power Supply',3,'يغذي الكرت الإلكتروني فقط، ولا يدخل في الإشارة.']]})}
   ]},

  {st:4,short:'خطوات إجراء التجربة',title:'خطوات إجراء التجربة — الشكل <span class="ltr">(2-3)</span>',ref:'ص 10–11',
   q:'وصّلنا المولد بعنصر التسخين والملتيميتر بالحساس… هل يرتفع الخرج لحظة القفزة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة Temperature Control: مقبس الدخل ثم عنصر التسخين ثم الحساس ثم مقبس الخرج، والمولد موصول بالدخل والملتيميتر بالخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="20" y="40" width="320" height="110" rx="14" fill="#CFE6DB" stroke="#12855A" stroke-width="2.5"/><text x="32" y="58" text-anchor="start" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">Temperature Control</text><g data-tip="مقبس الدخل ⟦y_T⟧: جهد التسخين من المولد."><circle cx="50" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="50" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="50" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y<tspan font-size="0.72em" dy="4">T</tspan><tspan dy="-4">​</tspan></text><rect x="36" y="86" width="30" height="50" fill="transparent"/></g><g data-tip="مقاومة التسخين: يسخنها الجهد ⟦y_T⟧."><rect x="86" y="86" width="48" height="28" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="94" y1="90" x2="94" y2="110" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="102" y1="90" x2="102" y2="110" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="110" y1="90" x2="110" y2="110" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="118" y1="90" x2="118" y2="110" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="126" y1="90" x2="126" y2="110" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/></g><g data-tip="الحرارة تنتقل من المقاومة إلى الحساس، وهذا يحتاج زمناً."><line x1="140" y1="100" x2="173.0" y2="100.0" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><path d="M184.0 100.0 L173.0 105.5 L173.0 94.5 Z" fill="#E8735A"/><rect x="140" y="90" width="46" height="20" fill="transparent"/></g><g data-tip="الصندوق ⟦ϑ/u⟧: حساس يحوّل الحرارة ⟦ϑ⟧ إلى جهد ⟦u⟧."><rect x="188" y="78" width="50" height="44" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="188" y1="122" x2="238" y2="78" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><text x="200" y="96" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ϑ</text><text x="228" y="116" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">u</text></g><line x1="238" y1="100" x2="292" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="مقبس الخرج ⟦x_T⟧: جهد الحساس، نقيسه بالملتيميتر."><circle cx="300" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="300" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x<tspan font-size="0.72em" dy="4">T</tspan><tspan dy="-4">​</tspan></text><rect x="286" y="86" width="30" height="50" fill="transparent"/></g><g data-tip="مولد الإشارة: نختار خطوة ⟦w = 7 V⟧ على دخل عنصر التسخين."><rect x="20" y="180" width="120" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="30" y="190" width="70" height="26" rx="4" fill="#1F3A33"/><text x="65" y="208" text-anchor="middle" font-size="13" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">7 V</text><circle cx="124" cy="210" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="124" cy="210" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="124" y="236" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">OUT</text></g><g data-tip="جهاز قياس الجهد ⟦MULTIMETER⟧: موصول بالخرج ⟦x_T⟧ ليقرأ القيمة التي يستقر عليها ⟦X0⟧."><rect x="220" y="180" width="120" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="250" y="190" width="80" height="26" rx="4" fill="#1F3A33"/><text x="290" y="208" text-anchor="middle" font-size="13" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">— V</text><circle cx="236" cy="210" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="236" cy="210" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="236" y="236" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><path d="M50 108 V166 H124 V202" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M300 108 V166 H236 V202" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="288" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">ارسم الدخل والخرج معاً خلال <tspan direction="ltr" unicode-bidi="embed">200 s</tspan></text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(2-3)</span>: المولد على دخل التسخين، والملتيميتر على خرج الحساس.<br><b>مرّر المؤشر على المقابس والصناديق والأجهزة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'إلى أي مقبس يوصل خرج المولد <span class="ltr">OUT</span>؟',opts:[
     ['إلى مقبس الخرج \\(x_T\\)',false,'\\(x_T\\) خرج الحساس، ويذهب إلى الملتيميتر.'],
     ['إلى مقبس الدخل \\(y_T\\) لعنصر التسخين',true,'المولد يعطي جهد التسخين، فيوصل بدخل اللوحة \\(y_T\\).'],
     ['إلى الأرضي فقط',false,'الأرضي للطرف الأسود ⊥، أما OUT فإلى الدخل.']]}}
   ],
   body:[
    {book:String.raw`<p><b>خطوات إجراء التجربة:</b></p><ul><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>قم بتوصيل الأجهزة وفق الشكل <span class="ltr">(2-3)</span>.</li><li>قم بمعايرة جهاز العرض وتأكد من عمل كل الأجهزة.</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيلات.</li><li>اختر إشارة خطوة <span class="ltr">w = 7 v</span> ثم ارسم إشارة الدخل والخرج معا خلال زمن قدره <span class="ltr">200 s</span> سجل القيمة التي استقر عليها الخرج \(X_0\)</li><li>أعد التجربة بإدخال تشويش على عملية التسخين (تشغيل المروحة بجهد <span class="ltr">5 v</span>) وسجل القيمة التي استقر عليها الخرج \(X_{01}\)</li></ul>`,ref:'ص 10'},
    {book:box(benchSVG({kind:'th',ins:'mm',outCh:'V',wired:true,gen:'7.0 V',meter:'—'}),760)+String.raw`<p class="sub">الشكل <span class="ltr">(2-3)</span>: توصيل التجربة</p>`,ref:'ص 11'},
    {tip:String.raw`<p>داخل لوحة <span class="ltr">Temperature Control</span>: الجهد \(y_T\) يسخّن مقاومة، والحرارة تصل إلى حساس يحوّلها إلى جهد \(x_T\) (الصندوق <span class="ltr">ϑ/u</span>). لا يرتفع الخرج فوراً: المقاومة تسخن أولاً، ثم تنتقل الحرارة إلى الحساس، لذلك تبدأ الاستجابة <b>ببطء</b> كأن فيها تأخيراً، ثم تصعد، ثم تقترب من قيمتها النهائية بهدوء دون أن تتجاوزها. أنظمة الحرارة <b>بطيئة</b>: ثوابتها الزمنية عشرات الثواني أو أكثر.</p>`,title:'ماذا يحدث داخل اللوحة؟'},
    {title:'مختبر مصغّر: رتّب خطوات التجربة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي يذكره الكتاب (ص 10).',steps:[
 ['شغّل لوحة العمليات وأجب عن الأسئلة','البداية دائماً بتشغيل اللوحة.'],
 ['وصّل الأجهزة وفق الشكل (2-3)','المعايرة والمراجعة تأتيان بعد التوصيل.'],
 ['عاير جهاز العرض وتأكد من عمل كل الأجهزة','نعاير بعد التوصيل وقبل طلب المراجعة.'],
 ['اطلب من المسؤول مراجعة التوصيلات','المراجعة قبل التشغيل، لا بعده.'],
 ['خطوة <span class="ltr">w = 7 V</span> وارسم الدخل والخرج خلال <span class="ltr">200 s</span> وسجّل <span class="ltr">X<sub>0</sub></span>','القياس بلا تشويش أولاً.'],
 ['شغّل المروحة بجهد <span class="ltr">5 V</span> وسجّل <span class="ltr">X<sub>01</sub></span>','التشويش يأتي بعد تسجيل القيمة الأولى لنقارن بها.']],
 done:'لاحظ أن القياس بلا تشويش يسبق القياس مع المروحة، لنقارن القيمتين.'})}
   ]},

  {st:5,short:'تسجيل النتائج',title:'تسجيل النتائج: بدون تشويش ومع التشويش — الشكل <span class="ltr">(2-4)</span>',ref:'ص 11',
   q:'شغّلنا المروحة فوق عنصر التسخين… هل سيرجع الخرج وحده إلى قيمته الأولى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مروحة تنفخ على عنصر التسخين، وتحتها عمودان: الخرج بلا تشويش أطول من الخرج مع التشويش" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المروحة المركّبة فوق عنصر التسخين، تُشغَّل من لوحة ⟦Speed Control⟧ بجهد ⟦5 V⟧ فتكون مصدر التشويش ⟦z⟧."><circle cx="180" cy="70" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><ellipse cx="191.0" cy="70.0" rx="12" ry="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5" transform="rotate(0 191.0 70.0)"/><ellipse cx="174.5" cy="79.5" rx="12" ry="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5" transform="rotate(120 174.5 79.5)"/><ellipse cx="174.5" cy="60.5" rx="12" ry="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5" transform="rotate(240 174.5 60.5)"/><circle cx="180" cy="70" r="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="30" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المروحة: <tspan direction="ltr" unicode-bidi="embed">z = 5 V</tspan></text></g><line x1="165" y1="98" x2="165.0" y2="109.0" stroke="#4FB3A9" stroke-width="2.5" stroke-linecap="round"/><path d="M165.0 120.0 L159.5 109.0 L170.5 109.0 Z" fill="#4FB3A9"/><line x1="180" y1="98" x2="180.0" y2="109.0" stroke="#4FB3A9" stroke-width="2.5" stroke-linecap="round"/><path d="M180.0 120.0 L174.5 109.0 L185.5 109.0 Z" fill="#4FB3A9"/><line x1="195" y1="98" x2="195.0" y2="109.0" stroke="#4FB3A9" stroke-width="2.5" stroke-linecap="round"/><path d="M195.0 120.0 L189.5 109.0 L200.5 109.0 Z" fill="#4FB3A9"/><rect x="156" y="126" width="48" height="28" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="164" y1="130" x2="164" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="172" y1="130" x2="172" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="180" y1="130" x2="180" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="188" y1="130" x2="188" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="196" y1="130" x2="196" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><line x1="50" y1="262" x2="310" y2="262" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="الخرج المستقر بلا تشويش ⟦X0⟧ (المروحة متوقفة)."><rect x="250" y="180" width="40" height="82" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="270" y="172" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">0</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="الخرج المستقر مع التشويش ⟦X01⟧ أصغر من ⟦X0⟧. المقارنة شكلية بلا أرقام."><rect x="70" y="206" width="40" height="56" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="90" y="198" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">01</tspan><tspan dy="-4">​</tspan></text></g><text x="270" y="280" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Z = 0</text><text x="90" y="280" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Z = 5 V</text><text x="180" y="300" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">المروحة تخفض الخرج</text></svg>`,
   cap:'المروحة (التشويش) تبرّد عنصر التسخين، فيستقر الخرج عند قيمة أصغر (رسم شكلي بلا أرقام).<br><b>مرّر المؤشر على المروحة والعمودين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'شغّلنا المروحة بجهد <span class="ltr">5 V</span>. ماذا يحدث للخرج المستقر؟',opts:[
     ['يرتفع، لأن المروحة تشغّل محركاً إضافياً',false,'المروحة لا تغذي عنصر التسخين؛ إنها تسحب منه الحرارة.'],
     ['يبقى كما هو، لأن جهد التسخين لم يتغير',false,'جهد التسخين لم يتغير، لكن الحرارة المفقودة زادت فانخفضت درجة الحرارة.'],
     ['ينخفض ويبقى منخفضاً ما دامت المروحة تعمل',true,'الدائرة مفتوحة: لا يوجد ما يرفع جهد التسخين ليعوّض، فيبقى \\(X_{01}\\) أصغر من \\(X_0\\).']]}}
   ],
   body:[
    {book:String.raw`<p><b>تسجيل النتائج:</b></p><p>بدون تشويش: <span class="ltr">Z=0 v</span> جهد الخرج يساوي:</p><p>\(X_0=\ldots\ldots\ \text{v}\)</p><p>أدخل تشويشاً على إشارة الخرج وسجل القيمة النهائية</p>`,ref:'ص 11'},
    {book:box(fanBoardSVG({on:true}),520)+String.raw`<p class="sub">شكل <span class="ltr">(2-4)</span></p><p>بوجود تشويش: <span class="ltr">Z = 5 v</span> جهد الخرج يساوي</p><p>\(X_{01}=\ldots\ldots\ \text{v}\)</p><p>قارن بين القيمتين، ماذا تستنتج؟</p><p>ماذا تلاحظ في بداية استجابة النظام الحراري لإشارة الخطوة؟</p>`,ref:'ص 11'},
    {title:'تابع السلسلة: بلا تشويش ومع التشويش',widget:(el,B)=>{
      const C={z0:['جهد التسخين ثابت \\(y_T\\)','الحرارة ترتفع حتى تستقر','الحساس يعطي جهداً ثابتاً \\(x_T\\)','نسجل \\(X_0\\)'],
               z5:['المروحة تعمل بجهد <span class="ltr">5 V</span>','تسحب جزءاً من الحرارة','الحرارة تستقر عند قيمة أقل','\\(X_{01}\\) أصغر من \\(X_0\\)','لا يرجع قياس الخرج ليرفع \\(y_T\\): الدائرة مفتوحة']};
      let k='z0',tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=C[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">التشويش:</span><span class="mseg">${[['z0','Z = 0'],['z5','Z = 5 V']].map(([v,l])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}">${l}</button>`).join('')}</span></div>
         <div class="chain" style="margin-top:12px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        B.math(el);
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {tip:String.raw`<details class="c2-q"><summary>قارن بين القيمتين، ماذا تستنتج؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> \(X_{01}\) أصغر من \(X_0\): المروحة تسحب الحرارة فتنخفض درجة الحرارة ومعها جهد الحساس. ولأن الدائرة مفتوحة لا يوجد ما يرفع جهد التسخين ليعوّض، فيبقى الخرج منخفضاً ما دامت المروحة تعمل.</div></details><details class="c2-q"><summary>ماذا تلاحظ في بداية استجابة النظام الحراري لإشارة الخطوة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> الخرج لا يبدأ بالصعود فوراً عند لحظة القفزة: يبقى تقريباً ثابتاً ثوانيَ قليلة ثم يبدأ يصعد ببطء ثم أسرع، أي أن البداية «منحنية» وليست حادة. السبب أن الحرارة تحتاج زمناً لتسخن المقاومة ثم تصل إلى الحساس.</div></details>`,title:'إجابات مقترحة — افتحها بعد أن تجرّب'},
    {watch:String.raw`<p>المروحة تُشغَّل من لوحة <span class="ltr">Speed Control</span> بسلك من المقبس <span class="ltr">5V</span> إلى \(y_S\).</p>`},
    {watch:String.raw`<p>المربع البرتقالي في الشكل <span class="ltr">(2-4)</span> للتعبئة، والشكل بلا عنوان في الكتاب.</p>`,fix:true}
   ]},

  {st:6,short:'منحنى الخواص الاستاتيكي',title:'الجزء الثاني: منحنى الخواص الاستاتيكي — الشكل <span class="ltr">(2-5)</span>',ref:'ص 12',
   q:'لو رفعنا جهد التسخين خطوة بعد خطوة… هل يزيد الخرج المستقر بالمقدار نفسه كل مرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع قيم للدخل من جدول الكتاب، لكل منها خانة للخرج المستقر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="50" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">يُقرأ الخرج بعد <tspan direction="ltr" unicode-bidi="embed">3</tspan> دقائق من تثبيت الدخل</text><text x="100" y="80" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y (v)</text><text x="260" y="80" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x (v)</text><g data-tip="قيمة الدخل كما في جدول الكتاب: ⟦4 V⟧."><rect x="54" y="92" width="92" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="112" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y = 4 V</text></g><line x1="150" y1="107" x2="195.0" y2="107.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M206.0 107.0 L195.0 112.5 L195.0 101.5 Z" fill="#2C4A40"/><g data-tip="القيمة التي يستقر عليها الخرج: تسجلها أنت في الجدول."><rect x="212" y="92" width="96" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="112" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x = …</text></g><g data-tip="قيمة الدخل كما في جدول الكتاب: ⟦5 V⟧."><rect x="54" y="132" width="92" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y = 5 V</text></g><line x1="150" y1="147" x2="195.0" y2="147.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M206.0 147.0 L195.0 152.5 L195.0 141.5 Z" fill="#2C4A40"/><g data-tip="القيمة التي يستقر عليها الخرج: تسجلها أنت في الجدول."><rect x="212" y="132" width="96" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x = …</text></g><g data-tip="قيمة الدخل كما في جدول الكتاب: ⟦6 V⟧."><rect x="54" y="172" width="92" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="192" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y = 6 V</text></g><line x1="150" y1="187" x2="195.0" y2="187.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M206.0 187.0 L195.0 192.5 L195.0 181.5 Z" fill="#2C4A40"/><g data-tip="القيمة التي يستقر عليها الخرج: تسجلها أنت في الجدول."><rect x="212" y="172" width="96" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="192" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x = …</text></g><g data-tip="قيمة الدخل كما في جدول الكتاب: ⟦7 V⟧."><rect x="54" y="212" width="92" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="232" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y = 7 V</text></g><line x1="150" y1="227" x2="195.0" y2="227.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M206.0 227.0 L195.0 232.5 L195.0 221.5 Z" fill="#2C4A40"/><g data-tip="القيمة التي يستقر عليها الخرج: تسجلها أنت في الجدول."><rect x="212" y="212" width="96" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="232" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x = …</text></g><text x="180" y="272" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">لكل قيمة دخل خرج مستقر واحد</text></svg>`,
   cap:'لكل قيمة دخل من جدول الكتاب ننتظر حتى يستقر الخرج ثم نسجله.<br><b>مرّر المؤشر على الخانات (أو المسها في الجوال) لتعرف ما تسجله فيها.</b>',
   side:[
    {predict:{q:'لماذا ننتظر <span class="ltr">3</span> دقائق بعد تثبيت الدخل قبل تسجيل الخرج؟',opts:[
     ['لأن الملتيميتر يحتاج وقتاً ليعمل',false,'الملتيميتر يقرأ فوراً؛ الذي يحتاج وقتاً هو النظام نفسه.'],
     ['لأن النظام الحراري بطيء ويحتاج وقتاً حتى يستقر خرجه',true,'نريد القيمة التي «يستقر» عليها الخرج، والنظام الحراري يحتاج دقائق ليصل إليها.'],
     ['لأن المروحة يجب أن تبرد أولاً',false,'المروحة لا تعمل في هذا الجزء.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الجزء الثاني: منحنى الخواص الاستاتيكي</b></p><p>وصل التجربة شكل <span class="ltr">(2-5)</span> وذلك بتثبيت إشارة الدخل على القيم المبينة في الجدول وتسجيل القيمة التي يستقر عليها الخرج بعد 3 دقائق من تثبيت الدخل على القيمة المطلوبة وسجل النتائج في الجدول التالي.</p>`+box(benchSVG({kind:'th',ins:'mm',outCh:'V',wired:true,jump:true,gen:'4.0 V',meter:'—'}),760)+String.raw`<p class="sub">الشكل <span class="ltr">(2-5)</span>: توصيل التجربة</p>`+ptable(['قيمة إشارة الدخل y (v)','4','5','6','7'],[['قيمة إشارة الخرج x (v)','','','','']])+String.raw`<ul><li>ارسم منحنى إشارة الخرج \(x\) بدلالة إشارة الدخل \(y\) باستخدام راسم <span class="ltr">Characteristic curve plotter</span> في اللوحة <span class="ltr">Com3Lab</span></li></ul><p>ماذا تلاحظ حول المنحنى؟</p>`,ref:'ص 12'},
    {tip:String.raw`<p><b>«استاتيكي»</b> أي بعد الاستقرار: لا يهمنا هنا كيف يصعد الخرج مع الزمن، بل أين يستقر لكل قيمة دخل. نقطة واحدة لكل قيمة دخل، ثم نصل النقاط فنحصل على منحنى الخواص.</p><details class="c2-q"><summary>ماذا تلاحظ حول المنحنى؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> المنحنى خط مستقيم تقريباً: كل زيادة متساوية في جهد الدخل تعطي زيادة متساوية في الخرج المستقر، أي أن النظام «خطي» في هذا المدى. والخط لا يمر بالصفر لأن الحساس يقرأ حرارة الغرفة حتى عندما يكون الدخل صفراً.</div></details>`},
    {watch:String.raw`<p>الشكل <span class="ltr">(2-5)</span> مثل الشكل <span class="ltr">(2-3)</span> مع وصلة قصيرة بين المقبسين <span class="ltr">ϑ</span> و <span class="ltr">Sense</span> في إطار <span class="ltr">ϑ-Calibration</span>، والكتاب لا يشرح وظيفة هذه الوصلة. لا تنسها عند التوصيل.</p>`},
    {title:'مختبر مصغّر: سجّل نقاط المنحنى',widget:(el,B)=>{const done=new Set();
 DCML.lab(el,B,{intro:'اختر قيمة الدخل من جدول الكتاب، وانتظر (هنا فوراً) القيمة التي يستقر عليها الخرج؛ كل قيمة تختارها تضاف نقطة على المنحنى.',
  predict:{q:'لو رفعنا الدخل من 4 إلى 5 V ثم من 6 إلى 7 V، هل يزيد الخرج المستقر بالمقدار نفسه؟',opts:[
   ['لا، الزيادة تكبر كثيراً مع كل خطوة',false,'لو كان كذلك لكان المنحنى منحنياً إلى أعلى.'],
   ['نعم تقريباً، فالمنحنى خط مستقيم',true,'زيادات متساوية في الدخل تعطي زيادات متساوية في الخرج المستقر، كما في الشكل (2-6).'],
   ['لا يتغير الخرج المستقر',false,'الخرج المستقر يتبع جهد التسخين: دخل أكبر = حرارة أعلى.']]},
  ins:[{k:'y',l:'قيمة إشارة الدخل y (من جدول الكتاب)',seg:[[4,'4 V'],[5,'5 V'],[6,'6 V'],[7,'7 V']],v:4}],
  tp:{id:'u2-l1',defs:TH_DEF},
  calc:(s,P,B)=>{done.add(s.y);const x=thFinal(P,s.y,0),xm=thFinal(P,8,0);const pts=[...done].sort().map(y=>[y,thFinal(P,y,0),'--live']);
   return {facts:[['الدخل y',s.y+' V'],['الخرج المستقر x',DCML.fm(B,x,2)+' V','hi'],['نقاط مسجلة',done.size+' / 4']],
    plot:{xr:[0,8],yr:[0,Math.ceil(xm+0.5)],xl:'y (V)',yl:'x (V)',xt:[0,2,4,6,8],curves:done.size===4?[{f:y=>thFinal(P,y,0),col:'--blue',dash:'5 4',w:2}]:[],dots:pts,cur:[s.y,x]},
    msg:done.size<4?'سجّل القيم الأربع لترى الخط كاملاً.':'الخط مستقيم. ولو مددناه (المتقطع) إلى دخل صفر لقطع محور الخرج عند '+DCML.fm(B,P.xa,1)+' V لا عند الصفر: الحساس يقرأ حرارة الغرفة.'}}})}}
   ]},

  {st:7,short:'حساب الميل',title:'حساب الميل \\(K_p\\) — الشكل <span class="ltr">(2-6)</span>',ref:'ص 13',
   q:'الخط صاعد… فكيف نعبّر برقم واحد عن «مقدار صعوده»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى الخواص خط صاعد، وعليه نقطتان ومثلث الميل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="60" y1="250" x2="319.0" y2="250.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M330.0 250.0 L319.0 255.5 L319.0 244.5 Z" fill="#2C4A40"/><line x1="60" y1="250" x2="60.0" y2="51.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M60.0 40.0 L65.5 51.0 L54.5 51.0 Z" fill="#2C4A40"/><text x="318" y="272" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y<tspan font-size="0.72em" dy="4">T</tspan><tspan dy="-4">​</tspan></text><text x="76" y="44" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x<tspan font-size="0.72em" dy="4">T</tspan><tspan dy="-4">​</tspan></text><path d="M80 220 L310 80" fill="none" stroke="#F2C14E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المثلث: ⟦Δy⟧ فرق الدخل بين النقطتين، و⟦Δx⟧ فرق الخرج بينهما."><path d="M120 196 H260 V110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="190" y="216" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Δy</text><text x="272" y="158" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Δx</text></g><g data-tip="نقطتان نختارهما على الخط: الأولى ⟦(y1, x1)⟧ والثانية ⟦(y2, x2)⟧."><circle cx="120" cy="196" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="260" cy="110" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="112" y="180" text-anchor="end" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(y1,x1)</text><text x="250" y="96" text-anchor="end" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(y2,x2)</text></g><g data-tip="الميل = فرق الخرج ÷ فرق الدخل، ويرمز له الكتاب هنا ⟦Kp⟧."><rect x="76" y="52" width="140" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="146" y="73" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Kp = Δx / Δy</text></g><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الميل = فرق الخرج ÷ فرق الدخل</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(2-6)</span>: نقطتان على الخط ومثلث الميل.<br><b>مرّر المؤشر على النقطتين والمثلث والمعادلة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا نحسب الميل من <b>فرقين</b> بين نقطتين، لا بقسمة الخرج على الدخل عند نقطة واحدة؟',opts:[
     ['لأن الفرقين يلغيان أثر حرارة الغرفة (الخط لا يمر بالصفر)',true,'الخرج عند دخل صفر ليس صفراً؛ الفرق يحذف هذا الجزء الثابت فيبقى الميل فقط.'],
     ['لأن القسمة عند نقطة واحدة ممنوعة رياضياً',false,'ليست ممنوعة، لكنها تعطي رقماً خاطئاً هنا لأن الخط لا يمر بالصفر.'],
     ['لا فرق بين الطريقتين',false,'الفرق كبير لأن الخط لا يمر بنقطة الأصل.']]}}
   ],
   body:[
    {book:box(slopeFigSVG(),520)+String.raw`<p class="sub">الشكل <span class="ltr">(2-6)</span>: حساب الميل</p><p>احسب ميل المنحنى \(K_p\)</p><p>اختر نقطتين على المنحنى ثم أكمل ما يلي:</p><pre class="cl-code" style="direction:ltr;text-align:left;font-family:var(--mono)">Δx = x₂ – x₁                 Δy = y₂ – y₁
Δx = …….. – ……….            Δy = …….. – ……...
Δx = ……….                    Δy = ……….

Kp = …….</pre><p>ماذا يمثل الثابت \(K_p\) للنظام الحراري؟</p>`,ref:'ص 13'},
    {tip:String.raw`<div class="eq">$$K_p=\frac{\Delta x}{\Delta y}=\frac{x_2-x_1}{y_2-y_1}$$</div><details class="c2-q"><summary>ماذا يمثل الثابت K<sub>p</sub> للنظام الحراري؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> يمثل <b>كسب النظام الحراري</b> (الكسب الاستاتيكي): كم فولتاً يزيد الخرج المستقر إذا زاد الدخل فولتاً واحداً.</div></details>`,title:'الميل في سطر واحد'},
    {watch:String.raw`<p>الرمز \(K_p\) يُستعمل عادة لكسب <b>الحاكم التناسبي</b> (الوحدة الثالثة)، أما هنا فهو كسب <b>النظام نفسه</b>، ويسميه الكتاب في التجربتين التاليتين \(K_s\).</p>`},
    {title:'مختبر مصغّر: اختر نقطتين واحسب الميل',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر نقطتين من قيم الجدول، وشاهد \\(\\Delta x\\) و \\(\\Delta y\\) والميل \\(K_p=\\Delta x/\\Delta y\\).',
 predict:{q:'حسبت الميل من النقطتين 4 و 7 V. لو اخترت النقطتين 5 و 6 V بدلاً منهما، ماذا يحدث للميل؟',opts:[
  ['يكبر لأن النقطتين أقرب',false,'المسافة الأقصر تصغّر \\(\\Delta x\\) و\\(\\Delta y\\) معاً، فتبقى نسبتهما نفسها.'],
  ['يصغر',false,'لا: على خط مستقيم النسبة ثابتة.'],
  ['يبقى كما هو، لأن الخط مستقيم',true,'ميل الخط المستقيم واحد في كل مكان عليه؛ لكن النقطتين المتباعدتين تقللان أثر خطأ القراءة.']]},
 ins:[{k:'a',l:'النقطة الأولى y<sub>1</sub>',seg:[[4,'4 V'],[5,'5 V'],[6,'6 V'],[7,'7 V']],v:4},{k:'b',l:'النقطة الثانية y<sub>2</sub>',seg:[[4,'4 V'],[5,'5 V'],[6,'6 V'],[7,'7 V']],v:7}],
 tp:{id:'u2-l1',defs:TH_DEF},
 calc:(s,P,B)=>{const x1=thFinal(P,s.a,0),x2=thFinal(P,s.b,0),dy=s.b-s.a,dx=x2-x1,xm=thFinal(P,8,0);
  if(!dy)return {facts:[['Δy','0 V','bad']],msg:'اخترت النقطة نفسها مرتين: \\(\\Delta y=0\\) ولا يمكن القسمة عليه. اختر نقطتين مختلفتين.',cls:'bad',plot:{xr:[0,8],yr:[0,Math.ceil(xm+0.5)],xl:'y (V)',yl:'x (V)',xt:[0,2,4,6,8],curves:[{f:y=>thFinal(P,y,0),col:'--blue',w:2}],dots:[[s.a,x1,'--live']]}};
  return {facts:[['Δx = x₂ − x₁',DCML.fm(B,dx,2)+' V'],['Δy = y₂ − y₁',DCML.fm(B,dy,0)+' V'],['K<sub>p</sub> = Δx/Δy',DCML.fm(B,dx/dy,2),'hi'],['x₂ ÷ y₂ (نقطة واحدة)',DCML.fm(B,x2/s.b,2),'bad']],
   plot:{xr:[0,8],yr:[0,Math.ceil(xm+0.5)],xl:'y (V)',yl:'x (V)',xt:[0,2,4,6,8],curves:[{f:y=>thFinal(P,y,0),col:'--blue',w:2},{pts:[[s.a,x1],[s.b,x1],[s.b,x2]],col:'--live',dash:'5 4',w:2}],dots:[[s.a,x1,'--live'],[s.b,x2,'--live']]},
   msg:'المثلث المتقطع: ضلعه الأفقي \\(\\Delta y\\) وضلعه الرأسي \\(\\Delta x\\). البطاقة الحمراء قسمة الخرج على الدخل عند نقطة واحدة: رقم أكبر من الميل لأن الخط لا يمر بالصفر.'}}})}
   ]},

  {st:8,short:'أسئلة ومناقشة',title:'أسئلة ومناقشة',ref:'ص 14',
   q:'بداية بطيئة، ثم استقرار، ثم مروحة تخفض الخرج… ماذا تخبرنا هذه الصورة عن النظام وعن الدائرة المفتوحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رسم شكلي لاستجابة النظام الحراري: بداية بطيئة ثم استقرار ثم انخفاض عند تشغيل المروحة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="50" y1="250" x2="323.0" y2="250.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M334.0 250.0 L323.0 255.5 L323.0 244.5 Z" fill="#2C4A40"/><line x1="50" y1="250" x2="50.0" y2="67.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M50.0 56.0 L55.5 67.0 L44.5 67.0 Z" fill="#2C4A40"/><text x="312" y="272" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">الزمن</text><text x="78" y="58" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">الخرج</text><path d="M50 250 H70 C100 250 110 246 130 222 C160 182 190 164 220 162 H250 C264 162 270 192 290 196 H330" fill="none" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="البداية بطيئة: الحرارة تحتاج زمناً لتسخن المقاومة ثم تصل إلى الحساس."><circle cx="92" cy="246" r="18" fill="none" stroke="#E8735A" stroke-width="2.5"/><text x="132" y="276" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">بداية بطيئة</text></g><g data-tip="الخرج يستقر وحده عند قيمة ثابتة."><text x="200" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">يستقر</text></g><g data-tip="لحظة تشغيل المروحة (التشويش)."><line x1="250" y1="76" x2="250" y2="248" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 5"/><text x="250" y="68" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">تشغيل المروحة</text></g><g data-tip="الخرج ينخفض ويبقى منخفضاً: الدائرة المفتوحة لا تصحح نفسها."><text x="296" y="222" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700" direction="rtl">ينخفض ولا يرجع</text></g><text x="220" y="300" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الدائرة المفتوحة لا تصحح نفسها</text></svg>`,
   cap:'رسم شكلي (بلا أرقام) يجمع ما تلاحظه في التجربة.<br><b>مرّر المؤشر على الكلمات والدائرة والخط المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'هل تصحح الدائرة المفتوحة أثر التشويش وحدها؟',opts:[
     ['نعم، يرجع الخرج إلى قيمته بعد قليل',false,'لا يوجد قياس للخرج يرجع إلى الدخل، فلا شيء يصحح.'],
     ['نعم، إذا انتظرنا 3 دقائق',false,'الانتظار يجعل الخرج يستقر، لكن عند القيمة الأقل.'],
     ['لا، يبقى الخرج منخفضاً ما دام التشويش موجوداً',true,'التصحيح يحتاج دائرة مغلقة (الوحدة الثالثة).']]}}
   ],
   body:[
    {book:String.raw`<p><b>أسئلة ومناقشة</b></p><ul><li>ماذا تلاحظ حول استجابة النظام الحراري لإشارة الخطوة؟</li><li>ما نوع هذا النظام؟</li><li>ما تأثير التشويش (تشغيل المروحة) على خرج النظام؟</li><li>هل تتأثر الدائرة المفتوحة بالتشويش؟</li></ul>`,ref:'ص 14'},
    {title:'تحقق سريع: قبل أن تفتح الإجابات',widget:(el,B)=>DCML.tf(el,B,{intro:'عبارات تلخّص ما رأيته في التجربة. احكم عليها، ثم قارن بالإجابات المقترحة تحت.',items:[
 ['خرج النظام الحراري يقفز فوراً لحظة تسليط الخطوة.',false,'يبدأ متأخراً قليلاً ثم يصعد ببطء: الحرارة تحتاج وقتاً لتصل إلى الحساس.'],
 ['تشغيل المروحة يخفض الخرج المستقر.',true,'المروحة تسحب الحرارة، فيستقر الخرج عند \\(X_{01}\\) أصغر من \\(X_0\\).'],
 ['الدائرة المفتوحة تعيد الخرج وحدها إلى قيمته بعد قليل من تشغيل المروحة.',false,'لا يوجد قياس للخرج يرجع إلى الدخل، فيبقى الخرج منخفضاً ما دامت المروحة تعمل.'],
 ['يحتاج النظام الحراري دقائق ليستقر خرجه.',true,'لهذا ينتظر الكتاب 3 دقائق قبل تسجيل كل نقطة في الجزء الثاني.']]})},
    {tip:String.raw`<details class="c2-q"><summary>1: ماذا تلاحظ حول استجابة النظام الحراري لإشارة الخطوة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> استجابة بطيئة جداً (تحتاج نحو 3 دقائق لتستقر)، تبدأ متأخرة قليلاً ثم تصعد وتقترب من قيمتها النهائية تدريجياً، ولا تتجاوز القيمة النهائية ولا تتأرجح.</div></details><details class="c2-q"><summary>2: ما نوع هذا النظام؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نظام من <b>الرتبة الأولى تقريباً مع تأخير صغير في البداية</b> (يُسمى أحياناً PT1 مع زمن ميت، أو نظامين من الرتبة الأولى على التوالي). وهو نظام «ذاتي الاستقرار»: يصل وحده إلى قيمة ثابتة.</div></details><details class="c2-q"><summary>3: ما تأثير التشويش (تشغيل المروحة) على خرج النظام؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> يخفض الخرج المستقر (\(X_{01}<X_0\))، لأن المروحة تزيد فقد الحرارة.</div></details><details class="c2-q"><summary>4: هل تتأثر الدائرة المفتوحة بالتشويش؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نعم، تتأثر ولا تصحح نفسها: لا يوجد قياس للخرج يرجع إلى الدخل، فيبقى الخطأ ما دام التشويش موجوداً. التصحيح يحتاج دائرة مغلقة (الوحدة الثالثة).</div></details>`,title:'إجابات مقترحة — افتحها بعد أن تحاول'},
    {watch:String.raw`<p>انتبه للرموز: في هذه التجربة \(X_0\) هو <b>الخرج</b> المستقر، أما في التجربتين التاليتين فالكتاب يستعمل \(X_0\) لقيمة الخطوة (<b>الدخل</b>).</p>`}
   ]},

  {recap:[
   String.raw`في الدائرة المفتوحة يذهب الدخل إلى النظام ولا يرجع قياس الخرج ليصحح الدخل (ص 9).`,
   String.raw`خطوة <span class="ltr">w = 7 V</span> على عنصر التسخين وتسجيل الخرج خلال <span class="ltr">200 s</span>: استجابة بطيئة تبدأ متأخرة ثم تستقر عند \(X_0\) — الشكل <span class="ltr">(2-3)</span> (ص 10–11).`,
   String.raw`المروحة بجهد <span class="ltr">5 V</span> تشويش يخفض الخرج إلى \(X_{01}\)، والدائرة المفتوحة لا تصحح ذلك (ص 11).`,
   String.raw`منحنى الخواص الاستاتيكي: الخرج المستقر بعد <span class="ltr">3</span> دقائق لكل قيمة دخل من <span class="ltr">4</span> إلى <span class="ltr">7 v</span> — الشكل <span class="ltr">(2-5)</span> (ص 12).`,
   String.raw`ميل المنحنى \(K_p=\Delta x/\Delta y\) من نقطتين، وهو كسب النظام الحراري — الشكل <span class="ltr">(2-6)</span> (ص 13).`]}
],
 theory:[
  {h:'الوحدة الثانية: تحليل الاستجابة الزمنية لبعض الأنظمة الصناعية ذات الدائرة المفتوحة',ref:'ص 9'},
  {fig:'',caption:'الحلقة (الدائرة) المفتوحة: الدخل يذهب إلى الوحدة المحكومة، ولا يرجع قياس الخرج ليصحح الدخل (توضيح للمتدرب — ليس من الكتاب).',draw:()=>box(openLoopSVG({plant:'النظام الحراري',z:1,u:'y',y:'x'}),600)},
  {note:ADD+'في هذه الوحدة لا يوجد «حاكم»: نعطي النظام دخلاً ثابتاً ونقيس كيف يتصرف خرجه مع الزمن. نسمي ذلك <b>الاستجابة الزمنية</b>. ونستخدم <b>إشارة الخطوة</b>: جهد يقفز فجأة من الصفر إلى قيمة ثابتة. من شكل الاستجابة نعرف: إلى أين يصل الخرج (الكسب)، وبأي سرعة (الثابت الزمني). و<b>التشويش</b> \\(z\\) مؤثر خارجي لا نتحكم فيه (هنا مروحة تبرّد العنصر).'},
  {h:'التجربة الأولى: استجابة نظام حراري لإشارة الخطوة',ref:'ص 10',html:`<p><b>الهدف من التجربة:</b> أن يتعرف المتدرب من خلال هذه التجربة على:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم ${lt('Com3Lab')}.</li><li>طريقة تشغيل الكرت الإلكتروني المبني عليه هذا المختبر.</li><li>استجابة نظام حراري لإشارة الخطوة.</li><li>تأثير التشويش على الحلقة المفتوحة.</li></ul>
   <p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية ${lt('(Power Supply)')}.</li><li>الكرت الإلكتروني.</li><li>مولد إشارة ${lt('Function Generator')}.</li><li>وحدة متحكم فيها ${lt('(Controlled Unit)')}.</li><li>جهاز قياس الجهد ${lt('Multimeter')}.</li></ul>`},
  {note:ADD+`${lt('Com3Lab')} كرت إلكتروني عليه عدة «لوحات» (حراري، سرعة، إضاءة، حاكمات)، والأجهزة (المولد، الملتيميتر، راسم الذبذبات) أجهزة افتراضية تظهر على شاشة الحاسب ونوصل أسلاكها على صورة اللوحة.`},
  {h:'خطوات إجراء التجربة',ref:'ص 10',html:`<ol><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>قم بتوصيل الأجهزة وفق الشكل ${lt('(2-3)')}.</li><li>قم بمعايرة جهاز العرض وتأكد من عمل كل الأجهزة.</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيلات.</li><li>اختر إشارة خطوة ${lt('w = 7 v')} ثم ارسم إشارة الدخل والخرج معاً خلال زمن قدره ${lt('200 s')}، سجل القيمة التي استقر عليها الخرج \\(X_0\\).</li><li>أعد التجربة بإدخال تشويش على عملية التسخين (تشغيل المروحة بجهد ${lt('5 v')}) وسجل القيمة التي استقر عليها الخرج \\(X_{01}\\).</li></ol>`},
  {fig:'(2-3)',ref:'ص 11',caption:'توصيل التجربة: خرج المولد OUT إلى دخل عنصر التسخين y<sub>T</sub>، وخرج الحساس x<sub>T</sub> إلى الفولتميتر V، والأطراف السوداء إلى لوحة الأرضي.',draw:()=>box(benchSVG({kind:'th',ins:'mm',outCh:'V',wired:true,gen:'7.0 V',meter:'—'}),760)},
  {note:ADD+`داخل لوحة ${lt('Temperature Control')}: الجهد \\(y_T\\) يسخّن مقاومة، والحرارة تصل إلى حساس يحوّلها إلى جهد \\(x_T\\) (الصندوق ${lt('ϑ/u')}). لا يرتفع الخرج فوراً: المقاومة تسخن أولاً، ثم تنتقل الحرارة إلى الحساس، لذلك تبدأ الاستجابة <b>ببطء</b> كأن فيها تأخيراً، ثم تصعد، ثم تقترب من قيمتها النهائية بهدوء دون أن تتجاوزها. أنظمة الحرارة <b>بطيئة</b>: ثوابتها الزمنية عشرات الثواني أو أكثر.`},
  {h:'تسجيل النتائج',ref:'ص 11',html:`<p>بدون تشويش: ${lt('Z = 0 v')} جهد الخرج يساوي: \\(X_0=\\ldots\\ \\text{v}\\)</p><p>أدخل تشويشاً على إشارة الخرج وسجل القيمة النهائية:</p>`},
  {fig:'(2-4)',ref:'ص 11',caption:'لوحة Speed Control تشغّل المروحة المركّبة فوق عنصر التسخين: سلك من المقبس 5V إلى y<sub>S</sub>، فتكون المروحة مصدر التشويش z. والمربع البرتقالي للتعبئة.',draw:()=>box(fanBoardSVG({on:true}),520)},
  {html:`<p>بوجود تشويش: ${lt('Z = 5 v')} جهد الخرج يساوي: \\(X_{01}=\\ldots\\ \\text{v}\\)</p>`+
   Q('','قارن بين القيمتين، ماذا تستنتج؟',`\\(X_{01}\\) أصغر من \\(X_0\\): المروحة تسحب الحرارة فتنخفض درجة الحرارة ومعها جهد الحساس. ولأن الدائرة مفتوحة لا يوجد ما يرفع جهد التسخين ليعوّض، فيبقى الخرج منخفضاً ما دامت المروحة تعمل. (في المختبر بالقيم التوضيحية الفرق نحو ${lt('1 V')}.)`)+
   Q('','ماذا تلاحظ في بداية استجابة النظام الحراري لإشارة الخطوة؟','الخرج لا يبدأ بالصعود فوراً عند لحظة القفزة: يبقى تقريباً ثابتاً ثوانيَ قليلة ثم يبدأ يصعد ببطء ثم أسرع، أي أن البداية «منحنية» وليست حادة. السبب أن الحرارة تحتاج زمناً لتسخن المقاومة ثم تصل إلى الحساس.')},
  {h:'الجزء الثاني: منحنى الخواص الاستاتيكي',ref:'ص 12–13',html:`<p>وصّل التجربة شكل ${lt('(2-5)')} وذلك بتثبيت إشارة الدخل على القيم المبينة في الجدول وتسجيل القيمة التي يستقر عليها الخرج بعد ${lt('3')} دقائق من تثبيت الدخل على القيمة المطلوبة، وسجل النتائج في الجدول التالي.</p>`},
  {fig:'(2-5)',ref:'ص 12',caption:'توصيل التجربة: مثل الشكل (2-3) مع وصلة قصيرة بين المقبسين <span class="ltr">ϑ</span> و <span class="ltr">Sense</span> في إطار <span class="ltr">ϑ-Calibration</span>.',draw:()=>box(benchSVG({kind:'th',ins:'mm',outCh:'V',wired:true,jump:true,gen:'4.0 V',meter:'—'}),760)},
  {html:ptable(['قيمة إشارة الدخل y (v)','4','5','6','7'],[['قيمة إشارة الخرج x (v)','','','','']])+`<p>ارسم منحنى إشارة الخرج \\(x\\) بدلالة إشارة الدخل \\(y\\) باستخدام راسم ${lt('Characteristic curve plotter')} في اللوحة ${lt('Com3Lab')}.</p>`+
   Q('','ماذا تلاحظ حول المنحنى؟','المنحنى خط مستقيم تقريباً: كل زيادة متساوية في جهد الدخل تعطي زيادة متساوية في الخرج المستقر، أي أن النظام «خطي» في هذا المدى. والخط لا يمر بالصفر لأن الحساس يقرأ حرارة الغرفة حتى عندما يكون الدخل صفراً.')},
  {fig:'(2-6)',ref:'ص 13',caption:'حساب الميل: نختار نقطتين على الخط، فالميل = فرق الخرج ÷ فرق الدخل.',draw:()=>box(slopeFigSVG(),520)},
  {html:`<p>احسب ميل المنحنى \\(K_p\\). اختر نقطتين على المنحنى ثم أكمل ما يلي:</p>$$\\Delta x=x_2-x_1 \\qquad \\Delta y=y_2-y_1 \\qquad K_p=\\frac{\\Delta x}{\\Delta y}$$`+
   Q('','ماذا يمثل الثابت K<sub>p</sub> للنظام الحراري؟',`يمثل <b>كسب النظام الحراري</b> (الكسب الاستاتيكي): كم فولتاً يزيد الخرج المستقر إذا زاد الدخل فولتاً واحداً. مثلاً \\(K_p=0.85\\) يعني أن رفع جهد التسخين ${lt('1 V')} يرفع جهد الحساس بعد الاستقرار ${lt('0.85 V')}.`)},
  {note:ADD+'الرمز \\(K_p\\) يُستعمل عادة لكسب <b>الحاكم التناسبي</b> (الوحدة الثالثة)، أما هنا فهو كسب <b>النظام نفسه</b>، ويسميه الكتاب في التجربتين التاليتين \\(K_s\\). وطريقة حسابه من فرقين (لا من نقطة واحدة) تلغي أثر حرارة الغرفة.'},
  {h:'أسئلة ومناقشة',ref:'ص 14',html:
   Q('1','ماذا تلاحظ حول استجابة النظام الحراري لإشارة الخطوة؟','استجابة بطيئة جداً (تحتاج نحو 3 دقائق لتستقر)، تبدأ متأخرة قليلاً ثم تصعد وتقترب من قيمتها النهائية تدريجياً، ولا تتجاوز القيمة النهائية ولا تتأرجح.')+
   Q('2','ما نوع هذا النظام؟','نظام من <b>الرتبة الأولى تقريباً مع تأخير صغير في البداية</b> (يُسمى أحياناً PT1 مع زمن ميت، أو نظامين من الرتبة الأولى على التوالي). وهو نظام «ذاتي الاستقرار»: يصل وحده إلى قيمة ثابتة.')+
   Q('3','ما تأثير التشويش (تشغيل المروحة) على خرج النظام؟','يخفض الخرج المستقر (\\(X_{01}<X_0\\))، لأن المروحة تزيد فقد الحرارة.')+
   Q('4','هل تتأثر الدائرة المفتوحة بالتشويش؟','نعم، تتأثر ولا تصحح نفسها: لا يوجد قياس للخرج يرجع إلى الدخل، فيبقى الخطأ ما دام التشويش موجوداً. التصحيح يحتاج دائرة مغلقة (الوحدة الثالثة).')},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>أرقام أشكال الوحدة لا تتبع ترتيب التجارب: هذه التجربة تبدأ بالشكل ${lt('(2-3)')}، وشكل التجربة الثانية ${lt('(2-1)')} (طُبع ${lt('(1-2)')})، وشكل الثالثة ${lt('(2-2)')}. أبقينا أرقام الكتاب.</li><li>الشكل ${lt('(2-4)')} بلا عنوان، والكتاب لا يشرح وظيفة الوصلة بين ${lt('ϑ')} و ${lt('Sense')} في الشكل ${lt('(2-5)')}.</li><li>الكتاب يرمز لكسب النظام هنا \\(K_p\\) وفي التجربتين التاليتين \\(K_s\\)، ويرمز للخرج هنا \\(X_0\\) بينما \\(X_0\\) في التجربتين التاليتين هو الدخل.</li><li>الوحدة كلها بلا شرح نظري، فأضفنا التوضيحات الموسومة.</li></ol></div>`}
 ],
 lab:(el)=>{
  el.innerHTML=`<div id="thtp"></div><div class="c2-row" style="margin-bottom:8px">${segHTML('thpart',[['p1','الجزء الأول: الاستجابة للخطوة والتشويش (ص 10–11)'],['p2','الجزء الثاني: منحنى الخواص (ص 12–13)']],'p1')}</div><div id="thp1"></div><div id="thp2" class="c2-hide"></div>`;
  const $=s=>el.querySelector(s);let A=null,Bp=null;const did={};
  const TP=B.params($('#thtp'),'u2-l1',TH_DEF,()=>{if(A)A.reset('تغيّرت أرقام المحاكاة، فمسحنا التسجيل والنتائج: أعد التشغيل.');if(Bp)Bp.reset();if(A)A.steps.redraw()});
  const P=()=>TP.v;
  /* ---------- part 1 ---------- */
  A=stepBench($('#thp1'),{k:'th',TP:P,kind0:'th',ins:'mm',inName:'y<sub>T</sub>',outName:'x<sub>T</sub>',title:'منضدة النظام الحراري <small>مبنية على الشكلين (2-3) و (2-4) ص 11</small>',
   scopeNote:'(الشكل 2-3 يضع الملتيميتر على الخرج، وبرنامج Com3Lab يرسم الدخل والخرج معاً)',chans:{th:{}},amp0:0,ampBook:7,wins:[100,200,400],winBook:200,speeds:[1,10,20,50],speed0:20,fan:true,show63:false,
   rows0:()=>({}),clearRows:c=>{c.rows={}},
   meters:(c,u,y)=>[['الدخل y<sub>T</sub>',fm(u,1)+' V'],['الخرج x<sub>T</sub>',fm(y,2)+' V'],['درجة الحرارة ≈',fm(y/c.P.sc,0)+' °C'],['التشويش z',c.z?'5 V':'0 V'],['زمن التسجيل',c.cap?fm(Math.max(0,c.cap.t),0)+' s':'—']],
   tblTitle:'تسجيل النتائج ص 11 — يمتلئ بقراءاتك',
   table:(c,host)=>{const r=c.rows;const cap=c.cap;
    host.innerHTML=`<div class="c2-row"><button class="btn primary" data-rec>سجّل القيمة التي استقر عليها الخرج</button><button class="btn" data-clr>امسح</button></div>
     <div class="c2-tbl"><table class="c2-bt"><thead><tr><th></th><th>الدخل ${lt('w (V)')}</th><th>الخرج المستقر (V)</th></tr></thead><tbody>
     <tr><th>بدون تشويش ${lt('Z = 0 v')}: ${lt('X<sub>0</sub>')}</th><td>${r.x0?fm(r.x0.w,1):''}</td><td>${r.x0?fm(r.x0.Y,2):''}</td></tr>
     <tr><th>بوجود تشويش ${lt('Z = 5 v')}: ${lt('X<sub>01</sub>')}</th><td>${r.x1?fm(r.x1.w,1):''}</td><td>${r.x1?fm(r.x1.Y,2):''}</td></tr></tbody></table></div>
     ${r.x0&&r.x1?`<div class="c2-calc">X0 − X01 = ${fm(r.x0.Y,2)} − ${fm(r.x1.Y,2)} = ${fm(r.x0.Y-r.x1.Y,2)} V   (${fm((r.x0.Y-r.x1.Y)/(r.x0.Y)*100,1)} %)</div><div class="callout">المروحة خفّضت الخرج المستقر بمقدار <b class="ltr">${fm(r.x0.Y-r.x1.Y,2)} V</b> (نحو <b class="ltr">${fm((r.x0.Y-r.x1.Y)/c.P.sc,0)} °C</b>)، والحلقة المفتوحة لم تصحح شيئاً: جهد التسخين بقي ${lt(fm(r.x1.w,1)+' V')}.${Math.abs(r.x0.w-r.x1.w)>1e-9?' <b>تنبيه:</b> سجلت القيمتين بجهدي دخل مختلفين، فالمقارنة غير عادلة: أعد إحداهما بنفس w.':''}</div>`:''}
     ${cap&&cap.done&&cap.meas?`<p class="sub">في آخر تسجيل: بدأ الخرج من <span class="ltr">${fm(cap.meas.y0,2)} V</span> (حرارة الغرفة) واستقر عند <span class="ltr">${fm(cap.meas.Yend,2)} V</span>${cap.meas.settled?'':' — <b>لم يستقر تماماً</b>، اختر زمن تسجيل أطول'}.</p>`:''}`;
    host.querySelector('[data-rec]').onclick=()=>{const cp=c.cap;if(!cp||!cp.done){c.msg('لا يوجد تسجيل مكتمل: شغّل الخطوة وانتظر انتهاء زمن التسجيل.',1);return}
      if(cp.zchg){c.msg('غيّرت حالة المروحة أثناء التسجيل، فالخرج لم يستقر على حالة واحدة. أعد التشغيل والمروحة ثابتة على حالتها.',1);return}
      r[cp.z?'x1':'x0']={w:cp.amp,Y:cp.meas.Yend,settled:cp.meas.settled};did[cp.z?'x1':'x0']=1;c.msg(`سُجّلت القيمة في سطر ${cp.z?'X<sub>01</sub>':'X<sub>0</sub>'}.`);c.redraw()};
    host.querySelector('[data-clr]').onclick=()=>{c.rows={};c.redraw()}},
   steps:c=>[
    {t:'وصّل الأجهزة',x:'شغّل «وصّل الأجهزة حسب الشكل»: OUT المولد إلى <span class="ltr">y<sub>T</sub></span>، و <span class="ltr">x<sub>T</sub></span> إلى الملتيميتر، والأسود إلى الأرضي (الخطوات 1–4).',done:()=>c.wired},
    {t:'خطوة w = 7 V',x:'اضغط «7 V — قيمة الكتاب» (أو حرّك المنزلق) وتأكد أن زمن التسجيل <span class="ltr">200 s</span> (الخطوة 5).',done:()=>Math.abs(c.amp-7)<1e-9&&c.W===200},
    {t:'سجّل 200 ثانية بلا تشويش',get x(){return `المروحة مطفأة. اضغط «شغّل». راقب البداية: الخرج يتأخر ثم يصعد ببطء. يستقر قرب <span class="ltr">${fm(thFinal(c.P,7,0),2)} V</span>.`},done:()=>c.cap&&c.cap.done&&c.cap.z===0&&!c.cap.zchg&&c.cap.amp===7&&c.cap.W===200},
    {t:'سجّل X<sub>0</sub>',x:'اضغط «سجّل القيمة التي استقر عليها الخرج».',done:()=>!!c.rows.x0},
    {t:'أعد التجربة والمروحة تعمل',get x(){return `شغّل المروحة <span class="ltr">z = 5 V</span> ثم «شغّل» من جديد (الخطوة 6). الخرج يستقر أدنى: قرب <span class="ltr">${fm(thFinal(c.P,7,5),2)} V</span>.`},done:()=>c.cap&&c.cap.done&&c.cap.z===5&&!c.cap.zchg&&c.cap.amp===7},
    {t:'سجّل X<sub>01</sub> وقارن',x:'اضغط «سجّل» ثم اقرأ الفرق تحت الجدول وفي المربع البرتقالي.',done:()=>!!c.rows.x1},
    {t:'غيّر حالة المروحة أثناء التسجيل',x:'شغّل الخطوة والمروحة مطفأة، وبعد أن يقترب الخرج من الاستقرار شغّل المروحة: ينخفض الخرج ولا يرجع. هكذا يتأثر النظام المفتوح بالتشويش (السؤال 4).'},
    {t:'انتقل إلى الجزء الثاني',x:'اختر «الجزء الثاني: منحنى الخواص» في أعلى المختبر. (قائمة «جرّب» هذه تكمل معك هناك: ارجع إليها هنا.)',done:()=>!!did.p2},
    {t:'الجزء الثاني: ضع الوصلة',x:'اضغط زر الوصلة <span class="ltr">ϑ–Sense</span> كما في الشكل <span class="ltr">(2-5)</span>.',done:()=>!!did.jump},
    {t:'ثبّت الدخل على 4 V وانتظر 3 دقائق',x:'اضغط «4 V» وانتظر حتى يصبح العداد <span class="ltr">180 s</span> (السرعة ×20 تختصر الانتظار)، ثم «سجّل الخرج في الجدول».',done:()=>!!did.y4},
    {t:'أكمل 5 و 6 و 7 V',get x(){return `كرر لكل قيمة. يجب أن يزيد الخرج تقريباً <span class="ltr">${fm(P().Ks,2)} V</span> لكل فولت.`},done:()=>did.y5&&did.y6&&did.y7},
    {t:'احسب الميل K<sub>p</sub>',x:'اختر نقطتين أسفل المنحنى واقرأ \\(\\Delta x\\) و \\(\\Delta y\\) و \\(K_p\\). جرّب نقطتين مختلفتين: يخرج الميل نفسه تقريباً لأن المنحنى خط مستقيم.',done:()=>!!did.kp}]});
  /* ---------- part 2: static characteristic ---------- */
  Bp=(function(host){const st={s:PLANTS.th.init(),t:0,y:0,hold:0,wired:true,jump:false,speed:20,hist:[],rows:{},free:[],pa:null,pb:null};
   host.innerHTML=`<div class="grid c2-lab">
    <div class="panel c12"><h2>منحنى الخواص الاستاتيكي <small>مبني على الشكل (2-5) ص 12</small></h2><div id="tbB" class="svgbox c2-wide" style="max-width:820px;margin-inline:auto"></div>
     <div class="c2-row">${swHTML('tbJ','ϑ–Sense','الوصلة كما في الشكل (2-5)',false)}</div><div id="tbmsg"></div></div>
    <div class="panel c7"><h2>تسجيل مستمر للدخل والخرج</h2><div class="c2-scope"><div class="c2-leg"><span><i style="background:var(--live)"></i>الدخل y</span><span><i style="background:var(--lcd-ink)"></i>الخرج x</span></div><div class="svgbox" id="tbsc" style="margin:0"></div></div></div>
    <div class="panel c5"><h2>جهد دخل ثابت</h2>${sl('tby','قيمة إشارة الدخل y',0,10,0.1,0)}
     <div class="c2-row"><span class="sub">قيم الجدول:</span>${[4,5,6,7].map(v=>`<button class="btn" data-yv="${v}">${lt(v+' V')}</button>`).join('')}</div>
     <div class="c2-row"><span class="sub">سرعة العرض:</span>${segHTML('tbsp',[[1,lt('×1')],[10,lt('×10')],[20,lt('×20')],[50,lt('×50')]],20)}</div>
     <div class="c2-meters" id="tbm"></div><div class="c2-row"><button class="btn primary" id="tbrec">سجّل الخرج في الجدول</button><button class="btn" id="tbclr">امسح الجدول</button></div></div>
    <div class="panel c12"><h2>الجدول ص 12 — يمتلئ بقراءاتك</h2><div id="tbt"></div></div>
    <div class="panel c12"><h2>منحنى الخواص وحساب الميل <small>الشكل (2-6) ص 13</small></h2><div id="tbp"></div></div></div>`;
   const $=s=>host.querySelector(s);const msg=(h,bad)=>{$('#tbmsg').innerHTML=h?`<div class="callout${bad?' err':''}">${h}</div>`:''};
   const yNow=()=>PLANTS.th.y(st.s,P());
   const allPts=()=>[4,5,6,7].filter(v=>st.rows[v]).map(v=>[v,st.rows[v]]).concat(st.free.map(f=>[f.y,f.x]));
   const draw=(fast)=>{const p=P(),x=yNow();
    $('#tbB').innerHTML=benchSVG({kind:'th',ins:'mm',outCh:'V',wired:true,jump:st.jump,on:st.y>0,u:st.y,gen:fm(st.y,1)+' V',meter:fm(x,2)+' V'});
    const W=400,h=st.hist;const t0=Math.max(0,st.t-W);const data=h.filter(r=>r[0]>=t0).map(r=>[r[0]-t0,r[1],r[2]]);
    $('#tbsc').innerHTML=scopeSVG({W,pre:0,data,chs:[{i:1,col:'--live'},{i:2,col:'--lcd-ink'}],vmax:niceMax(1.08*Math.max(10,...data.map(r=>r[2])))});
    $('#tby-v').textContent=fm(st.y,1)+' V';
    const ok=st.hold>=180;$('#tbm').innerHTML=meters([['الدخل y',fm(st.y,1)+' V'],['الخرج x',fm(x,2)+' V'],['مرّ على تثبيت الدخل',`${fm(Math.min(st.hold,999),0)} / 180 s${ok?' ✓':''}`]]);
    if(fast){if(A&&A.steps)A.steps.check();return}
    $('#tbt').innerHTML=`<div class="c2-tbl"><table class="c2-bt"><thead><tr><th>قيمة إشارة الدخل y (v)</th>${[4,5,6,7].map(v=>`<th>${v}</th>`).join('')}${st.free.map((f,i)=>`<th>${fm(f.y,1)} (حرة)</th>`).join('')}</tr></thead><tbody><tr><th>قيمة إشارة الخرج x (v)</th>${[4,5,6,7].map(v=>`<td>${st.rows[v]!=null?fm(st.rows[v],2):''}</td>`).join('')}${st.free.map(f=>`<td>${fm(f.x,2)}</td>`).join('')}</tr></tbody></table></div>`;
    const pts=allPts().sort((a,b)=>a[0]-b[0]);
    let plot='',calc='';
    if(pts.length){const xs=pts.map(q=>q[1]);const ymin=Math.floor(Math.min(...xs))-1,ymax=Math.ceil(Math.max(...xs))+1;const Wp=520,Hp=280,L=52,T=16,pw=Wp-L-20,ph=Hp-T-44;
      const X=v=>L+v/10*pw,Y=v=>T+ph-(v-ymin)/(ymax-ymin)*ph;let s='';
      for(let v=0;v<=10;v+=1)s+=`<path d="M${fx(X(v))} ${T}V${T+ph}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),T+ph+15,v,'m');
      for(let v=ymin;v<=ymax;v+=1)s+=`<path d="M${L} ${fx(Y(v))}H${L+pw}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),v,'m','end');
      s+=`<path d="M${L} ${T}V${T+ph}H${L+pw}" stroke="var(--fg)" fill="none"/>`+S.t(L+pw,Hp-6,'y (V)','','end')+S.t(L+6,T+8,'x (V)','','start');
      if(pts.length>1)s+=`<path d="${pts.map((q,i)=>(i?'L':'M')+fx(X(q[0]))+' '+fx(Y(q[1]))).join('')}" stroke="var(--live)" stroke-width="3" fill="none"/>`;
      const a=pts.find(q=>q[0]===st.pa)||pts[0],b=pts.find(q=>q[0]===st.pb)||pts[pts.length-1];
      if(pts.length>1&&a!==b){s+=`<path d="M${fx(X(a[0]))} ${fx(Y(a[1]))}H${fx(X(b[0]))}V${fx(Y(b[1]))}" stroke="var(--fg)" stroke-width="1.8" fill="none" stroke-dasharray="5 3"/>`+S.t(fx((X(a[0])+X(b[0]))/2),fx(Y(a[1])+16),'Δy','')+S.t(fx(X(b[0])+8),fx((Y(a[1])+Y(b[1]))/2),'Δx','','start');
        const dx=b[1]-a[1],dy=b[0]-a[0];calc=`<div class="c2-calc">Δx = x2 − x1 = ${fm(b[1],2)} − ${fm(a[1],2)} = ${fm(dx,2)} V        Δy = y2 − y1 = ${fm(b[0],1)} − ${fm(a[0],1)} = ${fm(dy,1)} V

Kp = Δx / Δy = ${fm(dx,2)} / ${fm(dy,1)} = ${fm(dx/dy,3)}</div><p class="sub">في نموذج المحاكاة الكسب <span class="ltr">${fm(p.Ks,3)}</span>. الخط لا يمر بالصفر: عند <span class="ltr">y = 0</span> يقرأ الحساس حرارة الغرفة <span class="ltr">${fm(p.xa,2)} V</span>.</p>`;did.kp=1}
      s+=pts.map(q=>`<circle cx="${fx(X(q[0]))}" cy="${fx(Y(q[1]))}" r="5" fill="var(--blue)"/>`).join('');
      plot=`<div class="svgbox" style="max-width:560px;margin-inline:auto"><svg viewBox="0 0 ${Wp} ${Hp}" role="img" aria-label="منحنى الخرج x مع الدخل y">${s}</svg></div>`+
       (pts.length>1?`<div class="c2-row"><span class="sub">النقطة الأولى:</span>${segHTML('pa',pts.map(q=>[q[0],lt(fm(q[0],1)+' V')]),a[0])}<span class="sub">النقطة الثانية:</span>${segHTML('pb',pts.map(q=>[q[0],lt(fm(q[0],1)+' V')]),b[0])}</div>`:'<p class="sub">سجّل نقطة ثانية على الأقل لحساب الميل.</p>')}
    else plot='<p class="sub">سجّل قراءات لتظهر النقاط والخط.</p>';
    $('#tbp').innerHTML=plot+calc;segBind($('#tbp'),'pa',v=>{st.pa=+v;draw()});segBind($('#tbp'),'pb',v=>{st.pb=+v;draw()});
    if(A&&A.steps)A.steps.check()};
   const setY=v=>{v=clamp(R(v,1),0,10);if(v!==st.y){st.y=v;st.hold=0}$('#tby').value=v;draw()};
   $('#tby').oninput=e=>setY(+e.target.value);
   host.addEventListener('click',e=>{const b=e.target.closest('[data-yv]');if(b)setY(+b.dataset.yv)});
   segBind(host,'tbsp',v=>{st.speed=+v});
   $('#tbJ').onclick=()=>{st.jump=!st.jump;$('#tbJ').setAttribute('aria-pressed',String(st.jump));if(st.jump)did.jump=1;msg(st.jump?'وُضعت الوصلة بين ϑ و Sense كما في الشكل (2-5). (الكتاب لا يشرح وظيفتها؛ المحاكاة لا تتغير بها.)':'');draw()};
   $('#tbrec').onclick=()=>{if(st.y<=0){msg('ثبّت الدخل على قيمة أولاً.',1);return}if(st.hold<180){msg(`لم تمر 3 دقائق على تثبيت الدخل (مرّ ${fm(st.hold,0)} s). انتظر حتى يستقر الخرج كما تطلب الحقيبة.`,1);return}
     const x=R(yNow(),2);if([4,5,6,7].includes(st.y)){st.rows[st.y]=x;did['y'+st.y]=1}else{st.free.push({y:st.y,x});if(st.free.length>4)st.free.shift()}msg(`سُجّل: <span class="ltr">y = ${fm(st.y,1)} V ⇐ x = ${fm(x,2)} V</span>.`);draw()};
   $('#tbclr').onclick=()=>{st.rows={};st.free=[];draw()};
   let acc=0;loopOn(host,dt=>{if(host.classList.contains('c2-hide')&&!st.y)return;const p=P();let adv=dt*st.speed;const hm=PLANTS.th.hmax(p);
     while(adv>1e-9){const h=Math.min(adv,hm,0.5);PLANTS.th.step(st.s,st.y,0,h,p);st.t+=h;st.hold+=h;adv-=h;acc+=h;if(acc>=1){acc=0;st.hist.push([st.t,st.y,yNow()]);if(st.hist.length>1200)st.hist.shift()}}
     if(!host.classList.contains('c2-hide'))draw(true)});
   draw();
   return {reset(){st.s=PLANTS.th.init();st.hold=0;st.hist=[];st.rows={};st.free=[];draw()},st}})($('#thp2'));
  segBind(el.querySelector('.c2-row'),'thpart',v=>{$('#thp1').classList.toggle('c2-hide',v!=='p1');$('#thp2').classList.toggle('c2-hide',v!=='p2');if(v==='p2')did.p2=1;A.steps.check()});
 },
 quiz:[
  {q:'ما قيمة إشارة الخطوة التي يطلبها الكتاب للنظام الحراري، وما زمن الرسم؟',o:['5 V و 1 s','7 V و 200 s','10 V و 5 s','4 V و 3 s'],c:1,e:'الخطوة 5 ص 10: w = 7 v خلال زمن قدره 200 s.'},
  {q:'كيف أدخل الكتاب التشويش على النظام الحراري؟',o:['بفصل الحساس','بتشغيل المروحة بجهد 5 V','برفع جهد الدخل','بعكس أسلاك المولد'],c:1,e:'الخطوة 6 والشكل (2-4): المروحة على 5 V.'},
  {q:'عند تشغيل المروحة يكون الخرج المستقر \\(X_{01}\\):',o:['أكبر من \\(X_0\\)','أصغر من \\(X_0\\)','مساوياً لـ \\(X_0\\)','صفراً'],c:1,e:'المروحة تبرّد العنصر، والحلقة المفتوحة لا تعوّض.'},
  {q:'لماذا لا تصحح الدائرة المفتوحة أثر التشويش؟',o:['لأن المولد ضعيف','لأنه لا يوجد قياس للخرج يرجع إلى الدخل','لأن الحساس معطل','لأن التشويش صغير'],c:1,e:'التصحيح يحتاج تغذية راجعة (دائرة مغلقة).'},
  {q:'كم ننتظر بعد تثبيت الدخل قبل تسجيل الخرج في الجزء الثاني؟',o:['3 ثوانٍ','30 ثانية','3 دقائق','200 دقيقة'],c:2,e:'ص 12: بعد 3 دقائق من تثبيت الدخل.'},
  {q:'الميل \\(K_p=\\Delta x/\\Delta y\\) لمنحنى الخواص يمثل:',o:['الثابت الزمني','كسب النظام الحراري','قيمة التشويش','حرارة الغرفة'],c:1,e:'كم يزيد الخرج المستقر لكل فولت زيادة في الدخل.'},
  {q:'بداية استجابة النظام الحراري للخطوة تكون:',o:['قفزة فورية','بطيئة ومتأخرة قليلاً ثم تصعد','متأرجحة بشدة','هابطة'],c:1,e:'الحرارة تحتاج زمناً لتصل إلى الحساس.'},
  {q:'لماذا لا يمر منحنى الخواص بنقطة الصفر؟',o:['خطأ في القياس','لأن الحساس يقرأ حرارة الغرفة عند دخل صفر','لأن المروحة تعمل','لأن الكسب سالب'],c:1,e:'توضيح للمتدرب: عند y = 0 تبقى الحرارة حرارة الغرفة.'}
 ]
});

/* ======================================================================
   u2-l2 — DC motor (or the PT1 board) step response
   ====================================================================== */
const MO_DEF=[
 {k:'Km',label:'كسب المحرك (جهد السرعة ÷ جهد الدخل)',unit:'V/V',value:0.8,min:0.05,max:2,step:0.01},
 {k:'Tm',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.4,min:0.02,max:5,step:0.01},
 {k:'nmax',label:'سرعة المحرك المقابلة لخرج 10 V',unit:'rpm',value:3000,min:100,max:20000,step:10},
 {k:'K1',label:'كسب وحدة PT1',unit:'V/V',value:1,min:0.05,max:2,step:0.01},
 {k:'T1',label:'الثابت الزمني لوحدة PT1 (T₁)',unit:'s',value:0.5,min:0.02,max:5,step:0.01}];
const GAIN_BOOK=`<p>الكسب كما طُبع في جدول النتائج:</p>$$K_s=\\frac{X_0}{Y_0}=\\frac{\\text{قيمة الخطوة}}{\\text{القيمة التي استقر عليها الخرج}}$$<p>هذا <b>الدخل ÷ الخرج</b>، أي مقلوب الكسب: لنظام خرجه نصف دخله يعطي 2 بدل 0.5.</p>`;
const GAIN_FIX=`<p>الكسب = الخرج المستقر ÷ قيمة الخطوة:</p>$$K_s=\\frac{Y_0}{X_0}$$<p>ومنه النموذج الرياضي \\(G(s)=\\dfrac{K_s}{T\\,s+1}\\): بعد الاستقرار \\(Y_0=K_s\\,X_0\\).</p>`;

B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'15–17',
 title:'التجربة الثانية: استجابة محرك تيار مستمر لإشارة الخطوة',
 summary:'نسلّط خطوة 10 V لمدة 5 ثوانٍ على وحدة من الرتبة الأولى (PT1، ويفضل الكتاب محرك المروحة)، ونرى الدخل والخرج على راسم الذبذبات، ثم نقيس الكسب K<sub>s</sub> والثابت الزمني T (زمن الوصول إلى <span class="ltr">63.2%</span>) ونكتب النموذج <span class="ltr">G(s) = K<sub>s</sub>/(T s + 1)</span> ونعيد التجربة في Simulink.',
 stations:[
  {intro:true},

  {st:1,short:'الهدف من التجربة',title:'التجربة الثانية — الهدف من التجربة',ref:'ص 15',
   q:'محرك له عضو دوار ثقيل… لماذا يمكن أن نصفه بالنموذج البسيط نفسه الذي نصف به صندوق PT1؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صندوق PT1 فيه منحنى صاعد يستقر، تقريباً يساوي محرك تيار مستمر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="نظام من الرتبة الأولى ⟦PT1⟧: عند الخطوة يصعد خرجه بسرعة ثم تقل سرعته حتى يستقر، دون تأرجح ودون تجاوز."><rect x="196" y="86" width="130" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="261" y="108" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PT1</text><path d="M210 172 C226 132 244 124 312 120" fill="none" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g><text x="180" y="144" text-anchor="middle" font-size="30" fill="#2C4A40" font-weight="700" direction="rtl">≈</text><g data-tip="محرك التيار المستمر: الكتاب يفترض أنه نظام من الرتبة الأولى."><circle cx="96" cy="136" r="48" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="96" y="146" text-anchor="middle" font-size="30" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><rect x="38" y="128" width="10" height="16" rx="2" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/></g><text x="261" y="212" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">نظام الرتبة الأولى</text><text x="96" y="212" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">محرك تيار مستمر</text><text x="180" y="268" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">نفترض أن المحرك من الرتبة الأولى</text></svg>`,
   cap:'الكتاب يفترض أن محرك التيار المستمر نظام من الرتبة الأولى، مثل وحدة <span class="ltr">PT1</span>.<br><b>مرّر المؤشر على الصندوق والمحرك (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما المقصود بالرمز <span class="ltr">PT1</span> في هذه التجربة؟',opts:[
     ['نوع من أجهزة القياس',false,'PT1 ليس جهاز قياس، بل النظام الذي ندرس استجابته.'],
     ['نظام من الرتبة الأولى',true,'الكتاب في ص 15: «نظام من الرتبة الأولى (PT1 أو محرك التيار المستمر)».'],
     ['مصدر التغذية',false,'مصدر التغذية مذكور في الأجهزة باسم Power Supply.']]}}
   ],
   body:[
    {book:String.raw`<p><b>التجربة الثانية: استجابة محرك تيار مستمر لإشارة الخطوة</b></p><p><b>الهدف من التجربة:</b></p><p>أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم <span class="ltr">Com3Lab</span></li><li>نظام من الرتبة الأولى (<span class="ltr">PT<sub>1</sub></span> أو محرك التيار المستمر)</li><li>استجابة النظام من الدرجة الأولى لإشارة الخطوة</li></ul>`,ref:'ص 15'},
    {tip:String.raw`<p><b>نظام الرتبة الأولى</b> <span class="ltr">(PT1)</span> يتصرف مثل خزان يمتلئ: عند الخطوة يبدأ الخرج يصعد بسرعة ثم تقل سرعته حتى يستقر، دون تأرجح ودون أن يتجاوز قيمته النهائية. يوصف برقمين فقط:</p><ul><li><b>الكسب</b> \(K_s\): الخرج المستقر ÷ قيمة الخطوة.</li><li><b>الثابت الزمني</b> \(T\): يخبرنا بسرعة الصعود (تفصيله في المحطة الرابعة).</li></ul>`},
    {watch:String.raw`<p>الكتاب يقول «الرتبة الأولى» مرة و«الدرجة الأولى» مرة، والمعنى واحد.</p>`,fix:true},
    {title:'تحقق سريع: صفات نظام الرتبة الأولى',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة عن نظام الرتبة الأولى (PT1)، ثم اقرأ السبب.',items:[
 ['عند الخطوة يقفز خرج نظام الرتبة الأولى فوراً إلى قيمته النهائية.',false,'يصعد بسرعة في البداية ثم تقل سرعته حتى يستقر؛ لا يقفز.'],
 ['نظام الرتبة الأولى لا يتجاوز قيمته النهائية ولا يتأرجح حولها.',true,'هذا ما يميزه عن الأنظمة التي ستراها مع الحاكم التكاملي في الوحدة الثالثة.'],
 ['يكفي رقمان لوصفه: الكسب \\(K_s\\) والثابت الزمني \\(T\\).',true,'الكسب يخبر إلى أين يصل الخرج، والثابت الزمني بأي سرعة.'],
 ['«الرتبة الأولى» و«الدرجة الأولى» في الكتاب شيئان مختلفان.',false,'الكتاب يستعمل الكلمتين بالمعنى نفسه.']]})}
   ]},

  {st:2,short:'الأجهزة والمكونات',title:'الأجهزة والمكونات',ref:'ص 15',
   q:'المحرك لا يعطي جهداً بل سرعة… فكيف نقرأ سرعته على راسم الذبذبات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة أجهزة: مصدر التغذية والكارت الإلكتروني ومولد الإشارة ونظام الرتبة الأولى مع المحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="مصدر التغذية ⟦Power Supply⟧: يغذي الكرت الإلكتروني بالكهرباء."><rect x="188" y="52" width="120" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="232" y="80" width="32" height="24" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><line x1="241" y1="80" x2="241" y2="70" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="255" y1="80" x2="255" y2="70" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M248 104 V114" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="248.0" y="138" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مصدر التغذية</text></g><g data-tip="الكارت الإلكتروني ⟦COM3LAB⟧: عليه لوحات التجارب، ومنها ⟦PT1⟧ ولوحة ⟦Speed Control⟧."><rect x="52" y="52" width="120" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="86" y="75" width="52" height="34" rx="4" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><rect x="92" y="83" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="106" y="83" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="120" y="83" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><line x1="92" y1="102" x2="132" y2="102" stroke="#F2C14E" stroke-width="2" stroke-linecap="round"/><text x="112.0" y="138" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">الكارت COM3LAB</text></g><g data-tip="مولد الإشارة ⟦Function Generator⟧: يعطي إشارة الخطوة، أي جهداً يقفز فجأة إلى قيمة نختارها."><rect x="188" y="164" width="120" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="224" y="187" width="48" height="34" rx="4" fill="#1F3A33" stroke="#2C4A40" stroke-width="2"/><path d="M230 213 H242 V195 H266" fill="none" stroke="#F2C14E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="248.0" y="250" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مولد إشارة</text></g><g data-tip="وحدة ⟦PT1⟧ ومحرك التيار المستمر (محرك المروحة): الكتاب يفضّل استعمال المحرك بدل ⟦PT1⟧."><rect x="52" y="164" width="120" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="68" y="187" width="48" height="34" rx="4" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2"/><path d="M74 215 C82 198 90 194 110 193" fill="none" stroke="#4FB3A9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="140" cy="204" r="17" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="140" y="209" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="112.0" y="250" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">PT1 ومحرك</text></g><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الأجهزة والمكونات</text></svg>`,
   cap:'الأجهزة والمكونات الأربعة بترتيب الكتاب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف دورها.</b>',
   side:[
    {predict:{q:'لماذا لا تقفز سرعة المحرك فوراً عند تسليط الجهد؟',opts:[
     ['لأن العضو الدوار له ثقل (قصور ذاتي) فتزيد السرعة تدريجياً',true,'تزيد السرعة بسرعة ثم ببطء حتى تتعادل القوة الدافعة مع الاحتكاك والحمل: سلوك الرتبة الأولى.'],
     ['لأن المولد يرفع الجهد ببطء',false,'المولد يعطي خطوة: الجهد يقفز فوراً؛ البطء من المحرك نفسه.'],
     ['لأن راسم الذبذبات بطيء',false,'راسم الذبذبات يعرض ما يحدث فعلاً، والتأخير من المحرك.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية <span class="ltr">(Power Supply)</span></li><li>الكارت الإلكتروني. <span class="ltr">COM3LAB</span></li><li>مولد إشارة <span class="ltr">Function Generator</span></li><li>نظام من الرتبة الأولى <span class="ltr">PT1</span> و محرك تيار مستمر (نفترض أن محرك التيار المستمر نظام من الدرجة الأولى)</li></ul>`,ref:'ص 15'},
    {tip:String.raw`<p>لماذا يُعدّ المحرك من الرتبة الأولى؟ عند تسليط الجهد لا تقفز السرعة فوراً لأن العضو الدوار له ثقل (قصور ذاتي)؛ تزيد السرعة بسرعة ثم ببطء حتى تتعادل القوة الدافعة مع الاحتكاك والحمل. الثابت الزمني يكبر مع ثقل العضو الدوار. على لوحة <span class="ltr">Speed Control</span> يقيس الصندوق <span class="ltr">RPM/TTL</span> عدد اللفات، ويحوّلها الصندوق <span class="ltr">f/u</span> إلى جهد \(x_S\) يتناسب مع السرعة.</p>`},
    {title:'مختبر مصغّر: عضو دوار أثقل',widget:(el,B)=>{const segs=[[1,'كما هو: T'],[2,'أثقل: 2T'],[3,'أثقل جداً: 3T']];
 DCML.lab(el,B,{intro:'الثابت الزمني يكبر مع ثقل العضو الدوار. اختر الثقل وشاهد منحنى جهد السرعة لخطوة <span class="ltr">10 V</span> على عرض <span class="ltr">5 s</span> (قيمتا الكتاب).',
  predict:{q:'جعلنا العضو الدوار أثقل. ماذا يتغير في المنحنى؟',opts:[
   ['تقل السرعة النهائية',false,'في هذا النموذج القيمة النهائية = الكسب × الخطوة، والثقل لا يغيّر الكسب.'],
   ['يتأرجح الخرج حول السرعة النهائية',false,'نظام الرتبة الأولى لا يتأرجح مهما ثقل.'],
   ['يصل إلى السرعة النهائية نفسها لكن أبطأ',true,'الثقل يكبّر الثابت الزمني \\(T\\) فيتأخر الوصول، والقيمة النهائية لا تتغير.']]},
  ins:[{k:'m',l:'ثقل العضو الدوار',seg:segs,v:1}],
  tp:{id:'u2-l2',defs:MO_DEF},
  calc:(s,P,B)=>{const T=P.Tm*s.m,Y=P.Km*10,f=k=>t=>P.Km*10*(1-Math.exp(-t/(P.Tm*k)));
   return {facts:[['الثابت الزمني T',DCML.fm(B,T,2)+' s','hi'],['الخرج المستقر Y<sub>0</sub>',DCML.fm(B,Y,2)+' V'],['زمن الاستقرار ≈ 5T',DCML.fm(B,5*T,2)+' s',5*T>5?'bad':'']],
    plot:{xr:[0,5],yr:[0,Math.max(10,Y)*1.1],xl:'t (s)',yl:'V',curves:[{pts:[[0,0],[0,10],[5,10]],col:'--live',dash:'5 4',w:1.8}].concat(segs.filter(x=>x[0]!==s.m).map(x=>({f:f(x[0]),col:'--muted',dash:'3 4',w:1.6}))).concat([{f:f(s.m),col:'--blue',w:2.6}]),cur:[T,0.632*Y]},
    msg:'النقطة البرتقالية عند \\(t=T\\): الخرج 63.2% من قيمته النهائية. الخط البرتقالي المتقطع = الخطوة، والرمادي = الثقلان الآخران.'+(5*T>5?' بهذا الثقل لا يستقر الخرج خلال <span class="ltr">5 s</span>؛ زد زمن العرض.':'')}}})}}
   ]},

  {st:3,short:'خطوات إجراء التجربة',title:'خطوات إجراء التجربة — الشكل <span class="ltr">(2-1)</span>',ref:'ص 15–16',
   q:'قناتان على راسم الذبذبات… أيهما تعرض الدخل وأيهما تعرض الخرج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="توصيل التجربة: المولد إلى دخل PT1، والخرج إلى القناة Y1، والدخل إلى القناة Y2" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="20" y="40" width="320" height="110" rx="14" fill="#CFE6DB" stroke="#12855A" stroke-width="2.5"/><text x="32" y="58" text-anchor="start" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">PT1</text><g data-tip="مقبس الدخل ⟦X5⟧ لوحدة ⟦PT1⟧: يصله خرج المولد."><circle cx="60" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="60" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="60" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">5</tspan><tspan dy="-4">​</tspan></text><rect x="46" y="86" width="30" height="50" fill="transparent"/></g><line x1="68" y1="100" x2="120" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="وحدة الرتبة الأولى، وثابتها الزمني ⟦T1⟧."><rect x="120" y="76" width="120" height="48" rx="4" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2.5"/><path d="M130 116 C146 90 166 84 230 84" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="222" y="112" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="0.72em" dy="4">1</tspan><tspan dy="-4">​</tspan></text></g><line x1="240" y1="100" x2="292" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="مقبس الخرج ⟦X6⟧: يذهب إلى القناة ⟦Y1⟧."><circle cx="300" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="300" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">6</tspan><tspan dy="-4">​</tspan></text><rect x="286" y="86" width="30" height="50" fill="transparent"/></g><g data-tip="مولد الإشارة: خطوة ⟦10 V⟧، وزمن العرض ⟦5 s⟧."><rect x="20" y="180" width="120" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="30" y="190" width="70" height="26" rx="4" fill="#1F3A33"/><text x="65" y="208" text-anchor="middle" font-size="13" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">10 V</text><circle cx="124" cy="210" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="124" cy="210" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="124" y="236" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">OUT</text></g><g data-tip="راسم الذبذبات: القناة ⟦Y1⟧ عليها الخرج، والقناة ⟦Y2⟧ عليها الدخل (المتقطع)."><rect x="196" y="180" width="144" height="80" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="204" y="188" width="76" height="64" rx="3" fill="#1F3A33"/><path d="M210 240 H220 V206 H274" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3"/><path d="M210 240 H220 C228 214 240 210 274 209" fill="none" stroke="#F2C14E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="212" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y1</text><text x="300" y="244" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y2</text><circle cx="324" cy="206" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="324" cy="206" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><circle cx="324" cy="238" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="324" cy="238" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/></g><path d="M124 202 V166 H60 V108" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="124" cy="166" r="3.5" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><path d="M300 108 V160 H344 V206 H332" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M324 246 V274 H160 V166 H124" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">خطوة <tspan direction="ltr" unicode-bidi="embed">10 V</tspan> وزمن <tspan direction="ltr" unicode-bidi="embed">5 s</tspan></text></svg>`,
   cap:'رسم مبسط لتوصيل التجربة: المولد على دخل <span class="ltr">PT1</span>، والخرج إلى القناة <span class="ltr">Y1</span>، والدخل إلى القناة <span class="ltr">Y2</span>.<br><b>مرّر المؤشر على المقابس والأجهزة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في هذا التوصيل، على أي قناة يظهر خرج النظام \\(X_6\\)؟',opts:[
     ['على القناة <span class="ltr">Y2</span>',false,'Y2 موصولة بخط الدخل (خط المولد) في هذه التجربة.'],
     ['على القناة <span class="ltr">TRIG</span>',false,'TRIG للتزامن، لا لعرض الإشارة.'],
     ['على القناة <span class="ltr">Y1</span>',true,'في الشكل: \\(X_6\\) إلى Y1، أي Y1 = الخرج و Y2 = الدخل.']]}}
   ],
   body:[
    {book:String.raw`<p><b>خطوات إجراء التجربة:</b></p><ul><li>قم بتوصيل الأجهزة كما في الشكل <span class="ltr">(2-1)</span> مع أفضلية تغيير النظام <span class="ltr">PT1</span> بمحرك المروحة.</li><li>قبل تشغيل التجربة اطلب من المدرب مراجعة التوصيل ومعايرة الأجهزة.</li><li>قم بتشغيل التجربة وتحديد الخطوة بـ <span class="ltr">10v</span> وزمن <span class="ltr">5s</span> وسجل إشارتي القناتين \(Y_1\) و \(Y_2\) على راسم الذبذبات.</li><li>سجل ملحوظاتك.</li></ul>`,ref:'ص 15'},
    {book:box(benchSVG({kind:'pt1',ins:'osc',inCh:'Y2',outCh:'Y1',wired:true,gen:'10.0 V'}),760)+String.raw`<p class="sub">الشكل <span class="ltr">(2-1)</span>: توصيل التجربة</p>`,ref:'ص 16'},
    {tip:String.raw`<p>اقرأ الشكل هكذا: خرج المولد <span class="ltr">OUT</span> إلى دخل <span class="ltr">PT1</span> \((X_5)\)، وخرجها \(X_6\) إلى القناة <span class="ltr">Y1</span>، والقناة <span class="ltr">Y2</span> على خط الدخل. أي: <b><span class="ltr">Y1</span> = الخرج</b> و<b><span class="ltr">Y2</span> = الدخل</b>. و«زمن <span class="ltr">5 s</span>» هو مدة العرض على الشاشة.</p>`},
    {watch:String.raw`<p>الخطوة الأولى تحيل إلى الشكل <span class="ltr">(2-1)</span> بينما الشكل في ص 16 مطبوع برقم <span class="ltr">(1-2)</span>؛ استعملنا <span class="ltr">(2-1)</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: أي قناة هذه؟',widget:(el,B)=>{const L=DCML.lt;DCML.cases(el,B,{intro:'في الشكل (2-1): '+L('X<sub>6</sub> → Y1')+' والقناة '+L('Y2')+' على خط الدخل. موقفان على شاشة راسم الذبذبات:',cases:[
 {q:'منحنى يقفز لحظة التشغيل إلى '+L('10 V')+' ويبقى أفقياً. على أي قناة هو؟',opts:[
  [L('Y1'),false,'Y1 موصولة بخرج النظام، والخرج لا يقفز.'],
  [L('Y2'),true,'Y2 على خط الدخل، والدخل خطوة: يقفز فوراً إلى 10 V.'],
  ['TRIG',false,'TRIG للتزامن، لا يعرض منحنى.']]},
 {q:'منحنى يصعد بسرعة ثم ببطء حتى يستقر. على أي قناة هو؟',opts:[
  [L('Y1'),true,'Y1 = الخرج \\(X_6\\): هذا سلوك نظام الرتبة الأولى.'],
  [L('Y2'),false,'Y2 تعرض الخطوة نفسها، وهي لا تصعد تدريجياً.']]},
 {q:'ماذا يعني «زمن <span class="ltr">5 s</span>» في الخطوة الثالثة؟',opts:[
  ['مدة العرض على شاشة راسم الذبذبات',true,'نرى على الشاشة ما يحدث خلال <span class="ltr">5 s</span> من لحظة الخطوة.'],
  ['الثابت الزمني للمحرك',false,'الثابت الزمني نقيسه نحن من المنحنى، لا نضبطه.'],
  ['مدة انتظار قبل تسليط الخطوة',false,'الخطوة تبدأ عند بداية العرض.']]}]})}}
   ]},

  {st:4,short:'تسجيل النتائج',title:'تسجيل النتائج: الكسب والثابت الزمني',ref:'ص 16',
   q:'من منحنى واحد نريد رقمين: إلى أين يصل الخرج، وبأي سرعة… كيف نقرؤهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى الاستجابة: الدخل المتقطع عند X0، والخرج يصعد ويستقر عند Y0، وعليه نقطة الثابت الزمني T" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="50" y1="250" x2="323.0" y2="250.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M334.0 250.0 L323.0 255.5 L323.0 244.5 Z" fill="#2C4A40"/><line x1="50" y1="250" x2="50.0" y2="67.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M50.0 56.0 L55.5 67.0 L44.5 67.0 Z" fill="#2C4A40"/><text x="312" y="272" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">الزمن</text><g data-tip="قيمة الخطوة ⟦X0⟧: جهد الدخل (المتقطع)."><path d="M50 250 H60 V90 H326" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 4"/><text x="42" y="95" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">0</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="⟦Y0⟧: القيمة التي استقر عليها الخرج."><path d="M50 250 H60 L60.0 250.0 L61.0 247.8 L62.0 245.7 L63.0 243.6 L64.0 241.5 L65.0 239.5 L66.0 237.6 L67.0 235.6 L68.0 233.7 L69.0 231.9 L70.0 230.1 L71.0 228.3 L72.0 226.5 L73.0 224.8 L74.0 223.1 L75.0 221.5 L76.0 219.9 L77.0 218.3 L78.0 216.7 L79.0 215.2 L80.0 213.7 L81.0 212.3 L82.0 210.8 L83.0 209.4 L84.0 208.1 L85.0 206.7 L86.0 205.4 L87.0 204.1 L88.0 202.8 L89.0 201.6 L90.0 200.4 L91.0 199.2 L92.0 198.0 L93.0 196.9 L94.0 195.7 L95.0 194.6 L96.0 193.5 L97.0 192.5 L98.0 191.4 L99.0 190.4 L100.0 189.4 L101.0 188.4 L102.0 187.5 L103.0 186.5 L104.0 185.6 L105.0 184.7 L106.0 183.8 L107.0 183.0 L108.0 182.1 L109.0 181.3 L110.0 180.5 L111.0 179.7 L112.0 178.9 L113.0 178.1 L114.0 177.4 L115.0 176.6 L116.0 175.9 L117.0 175.2 L118.0 174.5 L119.0 173.8 L120.0 173.1 L121.0 172.5 L122.0 171.8 L123.0 171.2 L124.0 170.6 L125.0 170.0 L126.0 169.4 L127.0 168.8 L128.0 168.2 L129.0 167.7 L130.0 167.1 L131.0 166.6 L132.0 166.1 L133.0 165.5 L134.0 165.0 L135.0 164.5 L136.0 164.1 L137.0 163.6 L138.0 163.1 L139.0 162.7 L140.0 162.2 L141.0 161.8 L142.0 161.3 L143.0 160.9 L144.0 160.5 L145.0 160.1 L146.0 159.7 L147.0 159.3 L148.0 158.9 L149.0 158.6 L150.0 158.2 L151.0 157.8 L152.0 157.5 L153.0 157.1 L154.0 156.8 L155.0 156.5 L156.0 156.1 L157.0 155.8 L158.0 155.5 L159.0 155.2 L160.0 154.9 L161.0 154.6 L162.0 154.3 L163.0 154.0 L164.0 153.7 L165.0 153.5 L166.0 153.2 L167.0 152.9 L168.0 152.7 L169.0 152.4 L170.0 152.2 L171.0 151.9 L172.0 151.7 L173.0 151.5 L174.0 151.3 L175.0 151.0 L176.0 150.8 L177.0 150.6 L178.0 150.4 L179.0 150.2 L180.0 150.0 L181.0 149.8 L182.0 149.6 L183.0 149.4 L184.0 149.2 L185.0 149.0 L186.0 148.9 L187.0 148.7 L188.0 148.5 L189.0 148.3 L190.0 148.2 L191.0 148.0 L192.0 147.8 L193.0 147.7 L194.0 147.5 L195.0 147.4 L196.0 147.2 L197.0 147.1 L198.0 147.0 L199.0 146.8 L200.0 146.7 L201.0 146.6 L202.0 146.4 L203.0 146.3 L204.0 146.2 L205.0 146.1 L206.0 145.9 L207.0 145.8 L208.0 145.7 L209.0 145.6 L210.0 145.5 L211.0 145.4 L212.0 145.3 L213.0 145.2 L214.0 145.1 L215.0 145.0 L216.0 144.9 L217.0 144.8 L218.0 144.7 L219.0 144.6 L220.0 144.5 L221.0 144.4 L222.0 144.3 L223.0 144.2 L224.0 144.1 L225.0 144.1 L226.0 144.0 L227.0 143.9 L228.0 143.8 L229.0 143.7 L230.0 143.7 L231.0 143.6 L232.0 143.5 L233.0 143.5 L234.0 143.4 L235.0 143.3 L236.0 143.3 L237.0 143.2 L238.0 143.1 L239.0 143.1 L240.0 143.0 L241.0 142.9 L242.0 142.9 L243.0 142.8 L244.0 142.8 L245.0 142.7 L246.0 142.7 L247.0 142.6 L248.0 142.6 L249.0 142.5 L250.0 142.5 L251.0 142.4 L252.0 142.4 L253.0 142.3 L254.0 142.3 L255.0 142.2 L256.0 142.2 L257.0 142.1 L258.0 142.1 L259.0 142.1 L260.0 142.0 L261.0 142.0 L262.0 141.9 L263.0 141.9 L264.0 141.9 L265.0 141.8 L266.0 141.8 L267.0 141.8 L268.0 141.7 L269.0 141.7 L270.0 141.6 L271.0 141.6 L272.0 141.6 L273.0 141.6 L274.0 141.5 L275.0 141.5 L276.0 141.5 L277.0 141.4 L278.0 141.4 L279.0 141.4 L280.0 141.4 L281.0 141.3 L282.0 141.3 L283.0 141.3 L284.0 141.2 L285.0 141.2 L286.0 141.2 L287.0 141.2 L288.0 141.2 L289.0 141.1 L290.0 141.1 L291.0 141.1 L292.0 141.1 L293.0 141.0 L294.0 141.0 L295.0 141.0 L296.0 141.0 L297.0 141.0 L298.0 140.9 L299.0 140.9 L300.0 140.9 L301.0 140.9 L302.0 140.9 L303.0 140.9 L304.0 140.8 L305.0 140.8 L306.0 140.8 L307.0 140.8 L308.0 140.8 L309.0 140.8 L310.0 140.7 L311.0 140.7 L312.0 140.7 L313.0 140.7 L314.0 140.7 L315.0 140.7 L316.0 140.7 L317.0 140.6 L318.0 140.6 L319.0 140.6 L320.0 140.6 L321.0 140.6 L322.0 140.6 L323.0 140.6 L324.0 140.6 L325.0 140.5 L326.0 140.5" fill="none" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><text x="42" y="145" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y<tspan font-size="0.72em" dy="4">0</tspan><tspan dy="-4">​</tspan></text><rect x="50" y="130" width="280" height="24" fill="transparent"/></g><g data-tip="الثابت الزمني ⟦T⟧: نقرؤه من المنحنى (انظر التوضيح تحت)."><path d="M50 180.5 H110 V250" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/><circle cx="110" cy="180.5" r="5.5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="110" y="268" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><text x="190" y="296" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الكسب = الخرج المستقر ÷ قيمة الخطوة</text></svg>`,
   cap:'رسم شكلي لمنحنى الاستجابة: الدخل المتقطع عند \\(X_0\\)، والخرج يستقر عند \\(Y_0\\)، والنقطة الصفراء عند الثابت الزمني \\(T\\).<br><b>مرّر المؤشر على الخطوط والنقطة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الثابت الزمني \\(T\\) هو الزمن الذي يصل فيه الخرج إلى…',opts:[
     ['قيمته النهائية كاملة',false,'الخرج يقترب من قيمته النهائية تدريجياً ولا يبلغها تماماً إلا بعد زمن طويل (نحو \\(4T\\) إلى \\(5T\\)).'],
     ['نصف قيمته النهائية',false,'ليس النصف؛ عند \\(t=T\\) يكون الخرج أكثر من النصف.'],
     ['<span class="ltr">63.2%</span> من قيمته النهائية',true,'هذا تعريف الثابت الزمني لنظام الرتبة الأولى.'],
     ['قيمة الخطوة \\(X_0\\)',false,'الخرج يستقر عند \\(Y_0\\)، لا عند قيمة الخطوة (إلا إذا كان الكسب 1).']]}}
   ],
   body:[
    {book:String.raw`<p><b>تسجيل النتائج:</b></p><p>وارسم منحنى استجابة النظام لإشارة الخطوة</p><p>ما نوع النظام؟</p><p>من خلال منحنى الاستجابة ومنحنى إشارة الدخل احسب كسب النظام و الثابت الزمني.</p><div class="c2-tbl"><table class="c2-bt"><thead><tr><th>قيمة الخطوة X<sub>0</sub></th><th>القيمة التي استقر عليها الخرج Y<sub>0</sub></th><th>الكسب K<sub>s</sub> = X<sub>0</sub> / Y<sub>0</sub></th><th>الثابت الزمني T</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>أكمل النموذج الرياضي للمحرك (دالة النظام بدلالة المتغير المركب \(s\))</p><p>\(G(s)=\ldots\ldots\)</p>`,ref:'ص 16'},
    {watch:String.raw`<p>صيغة الكسب في الجدول \(K_s=X_0/Y_0\) مقلوبة: \(X_0\) قيمة الخطوة (الدخل) و \(Y_0\) الخرج المستقر، فالصيغة كما طُبعت = الدخل ÷ الخرج. الصحيح \(K_s=Y_0/X_0\). قارن بالمفتاح تحت.</p>`,fix:true},
    {title:'الكسب: كما في الكتاب / المصحح',widget:bookFixW(GAIN_BOOK,GAIN_FIX)},
    {tip:box(pt1FigSVG(),560)+String.raw`<ul><li><b>الكسب</b> \(K_s\): الخرج المستقر ÷ قيمة الخطوة.</li><li><b>الثابت الزمني</b> \(T\): الزمن الذي يصل فيه الخرج إلى <b class="ltr">63.2%</b> من قيمته النهائية. بعد \(4T\) إلى \(5T\) يكون قد وصل <span class="ltr">98%</span> إلى <span class="ltr">99%</span> (نعتبره استقر).</li></ul>$$y(t)=K_s\,X_0\left(1-e^{-t/T}\right) \qquad G(s)=\frac{K_s}{T\,s+1}$$`,title:'كيف نقرأ الكسب والثابت الزمني؟'},
    {title:'كم وصل الخرج بعد T و 2T و 3T…؟',widget:(el,B)=>{
      let n=1;const X=t=>30+t/5*270,Y=v=>132-108*v;
      const draw=()=>{let d='';for(let i=0;i<=100;i++){const t=i/20;d+=(i?'L':'M')+X(t).toFixed(1)+' '+Y(1-Math.exp(-t)).toFixed(1)}
        const v=1-Math.exp(-n),p=(100*v).toFixed(1);
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الزمن منذ القفزة:</span><span class="mseg">${[1,2,3,4,5].map(k=>`<button type="button" data-n="${k}" aria-pressed="${k===n}">${k===1?'':k}T</button>`).join('')}</span></div>
         <div class="svgbox" style="max-width:440px;margin:10px auto 0"><svg viewBox="0 0 320 160" role="img" aria-label="منحنى الرتبة الأولى والنقطة عند الزمن المختار">
          <path d="M30 18V132H304" fill="none" stroke="var(--fg)" stroke-width="1.5"/>
          <path d="M30 ${Y(1).toFixed(1)}H304" stroke="var(--muted)" stroke-dasharray="4 4"/>
          ${[1,2,3,4,5].map(k=>`<text x="${X(k)}" y="150" text-anchor="middle" font-size="11" fill="var(--fg)" font-family="var(--mono)" direction="ltr">${k===1?'':k}T</text>`).join('')}
          <path d="${d}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>
          <path d="M30 ${Y(v).toFixed(1)}H${X(n)}V132" fill="none" stroke="var(--live)" stroke-width="1.6" stroke-dasharray="5 4"/>
          <circle cx="${X(n)}" cy="${Y(v).toFixed(1)}" r="5" fill="var(--live)"/></svg></div>
         <p class="sub" style="text-align:center">عند <span class="ltr">t = ${n===1?'':n}T</span> يكون الخرج <b class="ltr">${p}%</b> من قيمته النهائية.</p>`;
        el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{n=+b.dataset.n;draw()});};
      draw();
    }}
   ]},

  {st:5,short:'إعادة التجربة بـ SIMULINK',title:'أعد التجربة باستخدام <span class="ltr">SIMULINK</span>',ref:'ص 16',
   q:'قسنا \\(K_s\\) و \\(T\\) من المحرك الحقيقي… كيف نتأكد أن النموذج \\(G(s)\\) يصفه فعلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط Simulink: Step يتفرع إلى دالة التحويل وإلى Mux، وخرج الدالة إلى Mux، ثم Scope" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="⟦Step⟧: مصدر إشارة الخطوة."><rect x="16" y="150" width="48" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M24 184 H36 V160 H56" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="210" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Step</text></g><line x1="64" y1="172" x2="82" y2="172" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><circle cx="82" cy="172" r="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><line x1="82" y1="172" x2="93.0" y2="172.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M104.0 172.0 L93.0 177.5 L93.0 166.5 Z" fill="#2C4A40"/><g data-tip="⟦Transfer Fcn⟧: دالة الرتبة الأولى ⟦Ks/(T.s+1)⟧ بالقيم التي حسبتها."><rect x="104" y="142" width="96" height="60" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="152" y="164" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Ks</text><line x1="116" y1="172" x2="188" y2="172" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><text x="152" y="192" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T.s+1</text><text x="152" y="220" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Transfer Fcn</text></g><path d="M82 172 V110 H220 V150" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="220" y1="150" x2="221.0" y2="150.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M232.0 150.0 L221.0 155.5 L221.0 144.5 Z" fill="#2C4A40"/><path d="M200 172 H214 V194" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="214" y1="194" x2="221.0" y2="194.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M232.0 194.0 L221.0 199.5 L221.0 188.5 Z" fill="#2C4A40"/><g data-tip="⟦Mux⟧: يجمع إشارتين في خط واحد ليعرضهما ⟦Scope⟧ معاً: الدخل والخرج."><rect x="232" y="130" width="10" height="84" rx="2" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="237" y="232" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Mux</text></g><line x1="242" y1="172" x2="261.0" y2="172.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M272.0 172.0 L261.0 177.5 L261.0 166.5 Z" fill="#2C4A40"/><g data-tip="⟦Scope⟧: جهاز العرض؛ ننقر عليه مرتين فنرى الدخل والخرج معاً."><rect x="272" y="148" width="64" height="48" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="280" y="156" width="48" height="32" rx="3" fill="#1F3A33"/><path d="M284 182 H290 V164 H324" fill="none" stroke="#E8735A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 2"/><path d="M284 182 H290 C296 168 304 166 324 165" fill="none" stroke="#F2C14E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="304" y="212" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Scope</text></g><text x="180" y="64" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الدخل والخرج معاً على شاشة واحدة</text><text x="180" y="268" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">الفرع العلوي ينقل الدخل نفسه إلى العرض</text></svg>`,
   cap:'رسم مبسط لمخطط <span class="ltr">Simulink</span> في الكتاب: الدخل والخرج معاً على <span class="ltr">Scope</span> عبر <span class="ltr">Mux</span>.<br><b>مرّر المؤشر على الكتل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يتفرع خط <span class="ltr">Step</span> إلى <span class="ltr">Mux</span> مباشرة أيضاً؟',opts:[
     ['ليُعرض الدخل والخرج معاً على <span class="ltr">Scope</span>',true,'Mux يجمع الإشارتين، فنرى الخطوة ومنحنى الخرج على شاشة واحدة كما على راسم الذبذبات.'],
     ['لتكبير إشارة الخطوة',false,'التفرع لا يكبّر الإشارة؛ ينقلها كما هي.'],
     ['لأن دالة التحويل تحتاج دخلين',false,'دالة التحويل لها دخل واحد.']]}}
   ],
   body:[
    {book:String.raw`<p>أعد التجربة باستخدام <span class="ltr">SIMULINK</span></p>`+box(slk2SVG(),580)+String.raw`<p>قارن بين النتائج</p>`,ref:'ص 16'},
    {tip:String.raw`<p>المخطط: كتلة <span class="ltr">Step</span>، ومنها فرع إلى دالة التحويل وفرع إلى <span class="ltr">Mux</span>، وخرج دالة التحويل إلى <span class="ltr">Mux</span>، وخرج <span class="ltr">Mux</span> إلى <span class="ltr">Scope</span>، فيُعرض الدخل والخرج معاً. في كتلة <span class="ltr">Transfer Fcn</span> نكتب البسط \(K_s\) والمقام \(T\,s+1\) بالأرقام التي حسبتها.</p><details class="c2-q"><summary>قارن بين النتائج.</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> إذا وضعنا في كتلة دالة التحويل \(K_s\) و \(T\) المقاستين من المنحنى، يتطابق منحنى Simulink تقريباً مع منحنى المختبر: النموذج البسيط \(K_s/(Ts+1)\) يصف المحرك جيداً. الفروق الصغيرة من دقة القراءة ومن أن المحرك الحقيقي ليس من الرتبة الأولى تماماً. وإذا حُسب \(K_s\) بصيغة الكتاب المقلوبة يستقر منحنى Simulink عند قيمة خاطئة (جرّب ذلك في المختبر).</div></details>`},
    {watch:String.raw`<p>المخطط بلا رقم شكل في الكتاب. ضع في البسط \(K_s\) المحسوب بالصيغة المصححة \(Y_0/X_0\)، وإلا لن يتطابق المنحنيان.</p>`},
    {title:'مختبر مصغّر: ضع K<sub>s</sub> في Transfer Fcn وقارن',widget:(el,B)=>DCML.lab(el,B,{intro:'المنحنى المتصل = المحرك (المختبر). المتقطع = Simulink بالبسط الذي تختاره و \\(T\\) المقاس. خطوة <span class="ltr">X<sub>0</sub> = 10 V</span>.',
 predict:{q:'وضعت في Transfer Fcn البسط \\(K_s=X_0/Y_0\\) كما طُبع في الجدول. هل يتطابق منحنى Simulink مع منحنى المحرك؟',opts:[
  ['نعم، يتطابقان تماماً',false,'الصيغة كما طُبعت مقلوبة (الدخل ÷ الخرج)، فتعطي رقماً آخر.'],
  ['لا، يستقر منحنى Simulink عند قيمة أخرى',true,'البسط يحدد القيمة النهائية؛ مع الصيغة المقلوبة تصبح القيمة النهائية خاطئة.'],
  ['يختلفان في السرعة فقط',false,'السرعة يحددها \\(T\\) وهو نفسه في الحالتين؛ الفرق في القيمة النهائية.']]},
 ins:[{k:'f',l:'البسط في Transfer Fcn',seg:[['book','\\(K_s=X_0/Y_0\\) كما طُبع'],['fix','\\(K_s=Y_0/X_0\\) المصحح']],v:'book'}],
 tp:{id:'u2-l2',defs:MO_DEF},
 calc:(s,P,B)=>{const Y0=P.Km*10,Ks=s.f==='book'?10/Y0:Y0/10,T=P.Tm,W=Math.max(5,5*T),m=Math.max(Y0,Ks*10,10)*1.1;
  return {facts:[['Y<sub>0</sub> من المنحنى',DCML.fm(B,Y0,2)+' V'],['K<sub>s</sub> المستعمل',DCML.fm(B,Ks,3),s.f==='book'?'bad':'hi'],['نهاية Simulink',DCML.fm(B,Ks*10,2)+' V',s.f==='book'?'bad':'']],
   plot:{xr:[0,W],yr:[0,m],xl:'t (s)',yl:'V',curves:[{f:t=>Y0*(1-Math.exp(-t/T)),col:'--blue',w:2.8},{f:t=>Ks*10*(1-Math.exp(-t/T)),col:'--live',dash:'6 4',w:2.4}]},
   cls:s.f==='book'?'bad':'',msg:s.f==='book'?'لا يتطابقان: بالصيغة المقلوبة يصبح البسط مقلوب الكسب، فيستقر منحنى Simulink عند قيمة خاطئة.':'يتطابقان: الكسب = الخرج المستقر ÷ قيمة الخطوة، والنموذج \\(G(s)=K_s/(Ts+1)\\) يصف المحرك.'}}})}
   ]},

  {st:6,short:'أسئلة ومناقشة',title:'أسئلة ومناقشة',ref:'ص 17',
   q:'لماذا نبدأ دراسة أي نظام بإشارة خطوة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المخطط الصندوقي: مولد الإشارة ثم المحرك ثم راسم الذبذبات، بلا مسار رجوع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="22" y="128" width="90" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="67.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مولد</text><text x="67.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">الإشارة</text><g data-tip="المحرك (نظام من الرتبة الأولى)، ونموذجه ⟦G(s) = Ks/(T.s+1)⟧."><rect x="135" y="128" width="90" height="62" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="180.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">المحرك</text><text x="180.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">PT1</tspan></text></g><g data-tip="راسم الذبذبات: يعرض الدخل والخرج معاً."><rect x="248" y="128" width="90" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="293.0" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">راسم</text><text x="293.0" y="174" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">الذبذبات</text></g><line x1="112" y1="159" x2="124.0" y2="159.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M135.0 159.0 L124.0 164.5 L124.0 153.5 Z" fill="#2C4A40"/><line x1="225" y1="159" x2="237.0" y2="159.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M248.0 159.0 L237.0 164.5 L237.0 153.5 Z" fill="#2C4A40"/><text x="123" y="148" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X0</text><text x="237" y="148" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y</text><g data-tip="في الدائرة المفتوحة لا يوجد هذا المسار: لا يُقاس الخرج ليُصحَّح الدخل. هذا المسار موجود في الدائرة المغلقة (الوحدة الثالثة)."><path d="M293 190 V232 H67 V190" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 5"/><line x1="171" y1="223" x2="189" y2="241" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><line x1="171" y1="241" x2="189" y2="223" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><rect x="60" y="200" width="240" height="44" fill="transparent"/></g><text x="180" y="274" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">لا تغذية راجعة: حلقة مفتوحة</text></svg>`,
   cap:'المخطط الصندوقي للتجربة: حلقة مفتوحة بلا تغذية راجعة.<br><b>مرّر المؤشر على الصناديق والمسار المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي نعرفه عن النظام من استجابته لإشارة الخطوة؟',opts:[
     ['لونه وحجمه',false,'الاستجابة تخبرنا عن سلوك النظام مع الزمن، لا عن شكله.'],
     ['نوعه وكسبه وسرعته (الثابت الزمني)، فنكتب نموذجه \\(G(s)\\)',true,'الخطوة أبسط دخل وأشده تغيراً، ومن استجابتها نعرف «شخصية» النظام.'],
     ['جهد مصدر التغذية',false,'مصدر التغذية لا يظهر في الاستجابة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أسئلة ومناقشة</b></p><ul><li>ارسم المخطط الصندوقي للتجربة</li><li>ما الهدف من استجابة النظام لإشارة الخطوة؟</li><li>ماذا تستخلص من هذه التجربة؟</li></ul>`,ref:'ص 17'},
    {title:'تحقق سريع: ماذا تستخلص؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة، ثم قارن بالإجابات المقترحة تحت.',items:[
 ['المخطط الصندوقي لهذه التجربة فيه خط راجع من الخرج إلى الدخل.',false,'لا توجد تغذية راجعة: حلقة مفتوحة.'],
 ['من استجابة الخطوة نعرف نوع النظام وكسبه وثابته الزمني.',true,'ومنها نكتب نموذجه \\(G(s)\\).'],
 ['بعد زمن يساوي \\(T\\) يكون المحرك قد وصل إلى سرعته النهائية.',false,'بعد \\(T\\) يصل إلى 63.2% فقط، ويحتاج نحو \\(4T\\) إلى \\(5T\\) ليستقر.']]})},
    {tip:String.raw`<details class="c2-q"><summary>1: ارسم المخطط الصندوقي للتجربة.</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> `+box(openLoopSVG({plant:'المحرك (PT1)',sym:'Ks/(Ts+1)',meter:'راسم الذبذبات',u:'X0',y:'Y'}),600)+String.raw`<p>الدخل (من المولد) يذهب إلى المحرك وإلى القناة Y2، والخرج يذهب إلى القناة Y1. لا توجد تغذية راجعة: حلقة مفتوحة.</p></div></details><details class="c2-q"><summary>2: ما الهدف من استجابة النظام لإشارة الخطوة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> الخطوة أبسط دخل وأشده تغيراً، فمن استجابتها نعرف «شخصية» النظام: نوعه (رتبة أولى أم لا)، وكسبه (إلى أين يصل)، وسرعته (الثابت الزمني)، ومنها نكتب نموذجه الرياضي \(G(s)\) لنستعمله لاحقاً في تصميم الحاكم.</div></details><details class="c2-q"><summary>3: ماذا تستخلص من هذه التجربة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> المحرك يستجيب كنظام من الرتبة الأولى: لا تجاوز ولا تأرجح، ويصل إلى <span class="ltr">63.2%</span> من سرعته النهائية بعد زمن \(T\) وإلى سرعته النهائية تقريباً بعد \(4T\) إلى \(5T\). نموذجه \(G(s)=K_s/(Ts+1)\) بالقيم المقاسة، والكسب = الخرج ÷ الدخل.</div></details>`,title:'إجابات مقترحة — افتحها بعد أن تحاول'}
   ]},

  {recap:[
   String.raw`الكتاب يفترض أن محرك التيار المستمر نظام من الرتبة الأولى <span class="ltr">PT1</span> (ص 15).`,
   String.raw`خطوة <span class="ltr">10 V</span> وزمن عرض <span class="ltr">5 s</span>، و<span class="ltr">Y1</span> = الخرج و<span class="ltr">Y2</span> = الدخل — الشكل <span class="ltr">(2-1)</span> (ص 15–16).`,
   String.raw`الكسب = الخرج المستقر ÷ قيمة الخطوة \(K_s=Y_0/X_0\) (صيغة الجدول في الكتاب مقلوبة)، والثابت الزمني \(T\) زمن بلوغ <span class="ltr">63.2%</span> من القيمة النهائية (ص 16).`,
   String.raw`النموذج الرياضي \(G(s)=K_s/(T\,s+1)\)، ونتحقق منه في <span class="ltr">Simulink</span> بمقارنة المنحنيين (ص 16).`]}
],
 theory:[
  {h:'التجربة الثانية: استجابة محرك تيار مستمر لإشارة الخطوة',ref:'ص 15',html:`<p><b>الهدف من التجربة:</b> أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم ${lt('Com3Lab')}.</li><li>نظام من الرتبة الأولى (${lt('PT<sub>1</sub>')} أو محرك التيار المستمر).</li><li>استجابة النظام من الدرجة الأولى لإشارة الخطوة.</li></ul>
   <p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية ${lt('(Power Supply)')}.</li><li>الكارت الإلكتروني ${lt('COM3LAB')}.</li><li>مولد إشارة ${lt('Function Generator')}.</li><li>نظام من الرتبة الأولى ${lt('PT1')} ومحرك تيار مستمر (نفترض أن محرك التيار المستمر نظام من الدرجة الأولى).</li></ul>`},
  {h:'خطوات إجراء التجربة',ref:'ص 15',html:`<ol><li>قم بتوصيل الأجهزة كما في الشكل ${lt('(2-1)')} مع أفضلية تغيير النظام ${lt('PT1')} بمحرك المروحة.</li><li>قبل تشغيل التجربة اطلب من المدرب مراجعة التوصيل ومعايرة الأجهزة.</li><li>قم بتشغيل التجربة وتحديد الخطوة بـ ${lt('10 v')} وزمن ${lt('5 s')} وسجل إشارتي القناتين \\(Y_1\\) و \\(Y_2\\) على راسم الذبذبات.</li><li>سجل ملحوظاتك.</li></ol>`},
  {fig:'(2-1)',ref:'ص 16',caption:'توصيل التجربة: OUT المولد إلى دخل PT1 (X<sub>5</sub>)، وخرجها X<sub>6</sub> إلى القناة Y1، والقناة Y2 على خط الدخل؛ أي Y1 = الخرج و Y2 = الدخل. (رقم الشكل مطبوع في الكتاب (1-2).)',draw:()=>box(benchSVG({kind:'pt1',ins:'osc',inCh:'Y2',outCh:'Y1',wired:true,gen:'10.0 V'}),760)},
  {note:ADD+`<b>نظام الرتبة الأولى</b> ${lt('(PT1)')} يتصرف مثل خزان يمتلئ: عند الخطوة يبدأ الخرج يصعد بسرعة ثم تقل سرعته حتى يستقر، دون تأرجح ودون أن يتجاوز قيمته النهائية. يوصف برقمين فقط:<ul><li><b>الكسب</b> \\(K_s\\): الخرج المستقر ÷ قيمة الخطوة.</li><li><b>الثابت الزمني</b> \\(T\\): الزمن الذي يصل فيه الخرج إلى <b class="ltr">63.2%</b> من قيمته النهائية. بعد \\(4T\\) إلى \\(5T\\) يكون قد وصل <span class="ltr">98%</span> إلى <span class="ltr">99%</span> (نعتبره استقر).</li></ul>$$y(t)=K_s\\,X_0\\left(1-e^{-t/T}\\right) \\qquad G(s)=\\frac{K_s}{T\\,s+1}$$`},
  {fig:'',caption:'استجابة نظام الرتبة الأولى للخطوة وقراءة الثابت الزمني T (توضيح للمتدرب — ليس من الكتاب).',draw:()=>box(pt1FigSVG(),560)},
  {note:ADD+`لماذا يُعدّ المحرك من الرتبة الأولى؟ عند تسليط الجهد لا تقفز السرعة فوراً لأن العضو الدوار له ثقل (قصور ذاتي)؛ تزيد السرعة بسرعة ثم ببطء حتى تتعادل القوة الدافعة مع الاحتكاك والحمل. الثابت الزمني يكبر مع ثقل العضو الدوار. على لوحة ${lt('Speed Control')} يقيس الصندوق ${lt('RPM/TTL')} عدد اللفات، ويحوّلها الصندوق ${lt('f/u')} إلى جهد \\(x_S\\) يتناسب مع السرعة.`},
  {h:'تسجيل النتائج',ref:'ص 16',html:`<p>ارسم منحنى استجابة النظام لإشارة الخطوة. ما نوع النظام؟ من خلال منحنى الاستجابة ومنحنى إشارة الدخل احسب كسب النظام والثابت الزمني.</p>`+ptable(['قيمة الخطوة X<sub>0</sub>','القيمة التي استقر عليها الخرج Y<sub>0</sub>','الكسب K<sub>s</sub> = X<sub>0</sub> / Y<sub>0</sub>','الثابت الزمني T'],[['','','','']])+`<p>أكمل النموذج الرياضي للمحرك (دالة النظام بدلالة المتغير المركب \\(s\\)): \\(G(s)=\\ldots\\ldots\\)</p>`},
  {widget:bookFixW(GAIN_BOOK,GAIN_FIX)},
  {h:'أعد التجربة باستخدام SIMULINK',ref:'ص 16',html:'<p>المخطط: كتلة Step، ومنها فرع إلى دالة التحويل وفرع إلى Mux، وخرج دالة التحويل إلى Mux، وخرج Mux إلى Scope، فيُعرض الدخل والخرج معاً.</p>'},
  {fig:'',ref:'ص 16',caption:'مخطط Simulink للتجربة (بلا رقم في الكتاب).',draw:()=>box(slk2SVG(),580)},
  {html:Q('','قارن بين النتائج.','إذا وضعنا في كتلة دالة التحويل \\(K_s\\) و \\(T\\) المقاستين من المنحنى، يتطابق منحنى Simulink تقريباً مع منحنى المختبر: النموذج البسيط \\(K_s/(Ts+1)\\) يصف المحرك جيداً. الفروق الصغيرة من دقة القراءة ومن أن المحرك الحقيقي ليس من الرتبة الأولى تماماً. وإذا حُسب \\(K_s\\) بصيغة الكتاب المقلوبة يستقر منحنى Simulink عند قيمة خاطئة (جرّب ذلك في المختبر).')},
  {h:'أسئلة ومناقشة',ref:'ص 17',html:
   Q('1','ارسم المخطط الصندوقي للتجربة.',box(openLoopSVG({plant:'المحرك (PT1)',sym:'Ks/(Ts+1)',meter:'راسم الذبذبات',u:'X0',y:'Y'}),600)+'<p>الدخل (من المولد) يذهب إلى المحرك وإلى القناة Y2، والخرج يذهب إلى القناة Y1. لا توجد تغذية راجعة: حلقة مفتوحة.</p>')+
   Q('2','ما الهدف من استجابة النظام لإشارة الخطوة؟','الخطوة أبسط دخل وأشده تغيراً، فمن استجابتها نعرف «شخصية» النظام: نوعه (رتبة أولى أم لا)، وكسبه (إلى أين يصل)، وسرعته (الثابت الزمني)، ومنها نكتب نموذجه الرياضي \\(G(s)\\) لنستعمله لاحقاً في تصميم الحاكم.')+
   Q('3','ماذا تستخلص من هذه التجربة؟','المحرك يستجيب كنظام من الرتبة الأولى: لا تجاوز ولا تأرجح، ويصل إلى <span class="ltr">63.2%</span> من سرعته النهائية بعد زمن \\(T\\) وإلى سرعته النهائية تقريباً بعد \\(4T\\) إلى \\(5T\\). نموذجه \\(G(s)=K_s/(Ts+1)\\) بالقيم المقاسة، والكسب = الخرج ÷ الدخل.')},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>الخطوة 1 تحيل إلى الشكل ${lt('(2-1)')} بينما الشكل في ص 16 مطبوع برقم ${lt('(1-2)')}؛ استعملنا ${lt('(2-1)')}.</li><li>صيغة الكسب في الجدول \\(K_s=X_0/Y_0\\) مقلوبة؛ الصحيح \\(K_s=Y_0/X_0\\) (انظر مفتاح «كما في الكتاب / المصحح» أعلاه وفي جدول المختبر).</li><li>الرمز \\(X_0\\) هنا قيمة الخطوة (الدخل)، بينما كان في التجربة الأولى الخرج.</li><li>«الكارت» و«الكرت» و«الدرجة الأولى» و«الرتبة الأولى» بمعنى واحد في الكتاب.</li></ol></div>`}
 ],
 lab:(el)=>{
  el.innerHTML=`<div id="motp"></div><div id="mob"></div>`;
  let A=null;const TP=B.params(el.querySelector('#motp'),'u2-l2',MO_DEF,()=>{if(A){A.reset('تغيّرت أرقام المحاكاة، فمسحنا التسجيل والجدول: أعد التجربة.');A.steps.redraw();A.sl&&A.sl.draw()}});
  const P=()=>TP.v;const model=k=>k==='mot'?{K:P().Km,T:P().Tm}:{K:P().K1,T:P().T1};
  A=stepBench(el.querySelector('#mob'),{k:'mo',TP:P,kinds:[['mot','محرك المروحة'],['pt1','وحدة PT1']],kind0:'mot',ins:'osc',inName:'(خرج المولد)',outName:'(خرج الوحدة)',
   title:'منضدة الرتبة الأولى <small>مبنية على الشكل (2-1) ص 16</small>',kindMsg:v=>v==='mot'?'المحرك على لوحة Speed Control بدل PT1 (يفضله الكتاب).':'وحدة PT1 كما في الشكل (2-1).',
   benchExtra:c=>({aria:'توصيل التجربة: المولد إلى الوحدة، Y1 على الخرج و Y2 على الدخل'}),
   chans:{mot:{inCh:'Y2',outCh:'Y1'},pt1:{inCh:'Y2',outCh:'Y1'}},amp0:0,ampBook:10,wins:[1,2,5,10],winBook:5,speeds:[0.2,1],speed0:1,
   rows0:()=>[],clearRows:c=>{c.rows.length=0},
   spin:(c,y)=>c.kind==='mot'?(chF('tacho')?c.st.x:y)/10*c.P.nmax*0.12:0,
   meters:(c,u,y)=>[['الدخل (Y2)',fm(u,2)+' V'],['الخرج (Y1)',fm(y,2)+' V']].concat(c.kind==='mot'?[['سرعة المحرك',fm(y/10*c.P.nmax,0)+' rpm']]:[]).concat([['زمن التسجيل',c.cap?fm(Math.max(0,c.cap.t),2)+' s':'—']]),
   tblTitle:'جدول النتائج ص 16 — يمتلئ بقياساتك',
   table:(c,host)=>gainTable(c,host,{kname:k=>k==='mot'?'المحرك':'PT1',gsLabel:'النموذج الرياضي',model}),
   extraHTML:k=>`<div class="panel c12"><h2>أعد التجربة باستخدام SIMULINK <small>ص 16</small></h2><div class="svgbox" id="moslD" style="max-width:600px;margin-inline:auto"></div>
     <div class="c2-row"><label class="sub">K<sub>s</sub> <input id="moslK" type="number" step="any" style="width:90px;direction:ltr"></label><label class="sub">T (s) <input id="moslT" type="number" step="any" style="width:90px;direction:ltr"></label>
     <button class="btn" id="mosltake">خذ من آخر سطر في الجدول</button><button class="btn primary" id="moslrun"><span class="ltr">Simulation ▸ Start</span></button></div>
     <p class="sub">كتلة Step هنا بارتفاع قيمة الخطوة في آخر تسجيل (الكتاب 10 V) وتبدأ عند الصفر، وزمن المحاكاة = زمن التسجيل، حتى نقارن بالمختبر. المنحنى المتقطع = تسجيل المختبر.</p>
     <div class="c2-scope"><div class="c2-leg"><span><i style="background:var(--live)"></i>Step</span><span><i style="background:var(--lcd-ink)"></i>خرج دالة التحويل</span><span><i style="background:var(--con-ink)"></i>تسجيل المختبر (متقطع)</span></div><div class="svgbox" id="moslS" style="margin:0"></div></div><div id="moslR"></div></div>`,
   init:c=>{const $=c.$;const S2={K:null,T:null,ran:null};
    const draw=()=>{$('#moslD').innerHTML=slk2SVG({num:S2.K==null?'Ks':fm(S2.K,3),den:S2.T==null?'T.s+1':fm(S2.T,3)+'s+1'});const cap=c.cap&&c.cap.done?c.cap:null;const W=cap?cap.W:c.W,X0=cap?cap.amp:10;
      let data=[];if(S2.ran){const r=S2.ran;for(let i=0;i<=400;i++){const t=r.W*i/400;data.push([t,r.X0,r.K*r.X0*(1-Math.exp(-t/Math.max(r.T,1e-9)))])}}
      const ext=cap?[{pts:cap.data.filter((q,i)=>i%6===0).map(q=>[q[0],q[2]]),col:'--con-ink'}]:[];
      $('#moslS').innerHTML=scopeSVG({W:S2.ran?S2.ran.W:W,pre:0,data,chs:[{i:1,col:'--live'},{i:2,col:'--lcd-ink'}],vmax:niceMax(1.08*Math.max(10,...data.map(q=>q[2]),...(cap?cap.data.map(q=>q[2]):[0]))),extra:ext});
      if(S2.ran&&cap){const fs=S2.ran.K*S2.ran.X0,fb=cap.meas.Yend;const ok=Math.abs(fs-fb)<=0.03*Math.max(fb,0.1);
        $('#moslR').innerHTML=`<div class="callout${ok?'':' err'}">القيمة النهائية في Simulink <b class="ltr">${fm(fs,2)} V</b> وفي المختبر <b class="ltr">${fm(fb,2)} V</b>. ${ok?'المنحنيان متطابقان تقريباً: النموذج يصف الوحدة.':'لا يتطابقان: هل أخذت K<sub>s</sub> بصيغة الكتاب المقلوبة؟ اختر «المصحح» في الجدول ثم «خذ من آخر سطر» من جديد.'}</div>`}else $('#moslR').innerHTML=''};
    $('#mosltake').onclick=()=>{const r=c.rows[c.rows.length-1];if(!r){c.msg('الجدول فارغ: سجّل قياساً أولاً.',1);return}S2.K=R((c.mode||'book')==='book'?r.X0/r.Y0:r.Y0/r.X0,3);S2.T=r.T==null?null:R(r.T,3);$('#moslK').value=S2.K;$('#moslT').value=S2.T==null?'':S2.T;draw()};
    $('#moslK').oninput=e=>{S2.K=e.target.value===''?null:+e.target.value;draw()};$('#moslT').oninput=e=>{S2.T=e.target.value===''?null:+e.target.value;draw()};
    $('#moslrun').onclick=()=>{if(!(S2.K>0)||!(S2.T>0)){c.msg('اكتب K<sub>s</sub> و T (أو «خذ من آخر سطر في الجدول») قبل التشغيل.',1);return}const cap=c.cap&&c.cap.done?c.cap:null;
      S2.ran={K:S2.K,T:S2.T,W:cap?cap.W:c.W,X0:cap?cap.amp:10};c.did.sl=1;const r=c.rows[c.rows.length-1];if(r&&Math.abs(S2.K-r.Y0/r.X0)<=0.02*r.Y0/r.X0)c.did.slOK=1;draw();c.steps.check()};
    c.sl={draw};draw()},
   onDone:c=>{if(c.sl)c.sl.draw()},
   steps:c=>[
    {t:'وصّل الأجهزة',x:'شغّل «وصّل الأجهزة حسب الشكل»: Y1 على الخرج، و Y2 على الدخل. الوحدة المختارة محرك المروحة كما يفضل الكتاب.',done:()=>c.wired},
    {t:'خطوة 10 V وزمن 5 s',x:'اضغط «10 V — قيمة الكتاب»، وزمن التسجيل <span class="ltr">5 s</span> (الخطوة 3).',done:()=>c.amp===10&&c.W===5},
    {t:'شغّل وسجّل القناتين',x:'اضغط «شغّل». الدخل (Y2) يقفز فوراً، والخرج (Y1) يصعد منحنياً ثم يستقر.',done:()=>c.cap&&c.cap.done&&c.cap.amp===10},
    {t:'اقرأ T بالمؤشر',get x(){return `حرّك مؤشر القراءة حتى يصل الخرج إلى <span class="ltr">63.2%</span> من قيمته النهائية (النقطة البرتقالية). بالقيم الحالية يحدث ذلك قرب <span class="ltr">t = ${fm(model(c.kind).T,2)} s</span>.`},done:()=>!!c.did.cursor},
    {t:'سجّل في الجدول',x:'اضغط «سجّل القياس في الجدول».',done:()=>c.rows.length>0},
    {t:'صحح صيغة الكسب',get x(){return `الجدول بصيغة الكتاب يعطي \\(X_0/Y_0\\) (أكبر من 1 هنا). اختر «المصحح»: الكسب \\(Y_0/X_0\\) ≈ <span class="ltr">${fm(model(c.kind).K,2)}</span>، واكتمل النموذج \\(G(s)\\).`},done:()=>!!c.did.mode_fixed},
    {t:'أعدها في Simulink',x:'في لوحة Simulink اضغط «خذ من آخر سطر في الجدول» ثم <span class="ltr">Start</span>، وقارن المنحنى بالمتقطع (تسجيل المختبر).',done:()=>!!c.did.slOK},
    {t:'جرّب وحدة PT1',x:'اختر «وحدة PT1» وكرر التشغيل والتسجيل: سطر جديد بكسب وثابت زمني مختلفين.',done:()=>c.rows.some(r=>r.kind==='pt1')}]});
 },
 quiz:[
  {q:'ما قيمة الخطوة وزمنها في تجربة المحرك؟',o:['7 V و 200 s','10 V و 5 s','5 V و 1 s','10 V و 50 s'],c:1,e:'الخطوة 3 ص 15.'},
  {q:'في الشكل (2-1) القناة Y1 موصلة على:',o:['الدخل','الخرج X6','الأرضي','SYNC'],c:1,e:'X6 → Y1، و Y2 على خط الدخل.'},
  {q:'الثابت الزمني T لنظام الرتبة الأولى هو الزمن الذي يصل فيه الخرج إلى:',o:['<span class="ltr">50%</span>','<span class="ltr">63.2%</span>','<span class="ltr">90%</span>','<span class="ltr">100%</span>'],c:1,e:'توضيح للمتدرب: عند t = T يكون الخرج <span class="ltr">63.2%</span> من قيمته النهائية.'},
  {q:'خطوة 10 V والخرج استقر عند 8 V. الكسب الصحيح:',o:['1.25','0.8','18','2'],c:1,e:'Ks = Y0/X0 = 8/10 = 0.8؛ صيغة الكتاب X0/Y0 تعطي 1.25 وهي مقلوبة.'},
  {q:'النموذج الرياضي لنظام من الرتبة الأولى:',o:['\\(G(s)=K_s\\,s\\)','\\(G(s)=\\frac{K_s}{T\\,s+1}\\)','\\(G(s)=\\frac{1}{s}\\)','\\(G(s)=T\\,s+1\\)'],c:1,e:'كتلة Transfer Fcn في Simulink ص 16: Ks/(T.s+1).'},
  {q:'بعد كم ثابتاً زمنياً نعتبر استجابة الرتبة الأولى قد استقرت تقريباً؟',o:['T واحد','4T إلى 5T','0.1T','100T'],c:1,e:'بعد 4T يصل <span class="ltr">98%</span> وبعد 5T يصل <span class="ltr">99%</span>.'},
  {q:'لماذا تستعمل كتلة Mux في مخطط Simulink؟',o:['لتكبير الإشارة','لعرض الدخل والخرج معاً على Scope واحد','لحساب الكسب','لإيقاف المحاكاة'],c:1,e:'تجمع الإشارتين لتظهرا معاً.'},
  {q:'إذا زاد ثقل العضو الدوار للمحرك فإن ثابته الزمني:',o:['يقل','يزيد','لا يتغير','يصبح صفراً'],c:1,e:'توضيح للمتدرب: القصور الذاتي الأكبر يبطئ التسارع.'}
 ]
});

/* ======================================================================
   u2-l3 — light system
   ====================================================================== */
const LI_DEF=[
 {k:'KL',label:'كسب نظام الإضاءة',unit:'V/V',value:0.8,min:0.05,max:2,step:0.01},
 {k:'TL',label:'الثابت الزمني لنظام الإضاءة',unit:'s',value:0.004,min:0.0005,max:0.2,step:0.0005}];
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'18–20',
 title:'التجربة الثالثة: استجابة نظام الإضاءة لإشارة الخطوة',
 summary:'نسلّط خطوة 5 V على ثنائي باعث للضوء ونقيس خرج الترانزستور الضوئي على راسم الذبذبات. الاستجابة سريعة جداً حتى تبدو قفزة؛ نقصّر زمن العرض لنرى المنحنى ونقيس الكسب والثابت الزمني، ونقارنه بالمحرك والنظام الحراري.',
 stations:[
  {intro:true},

  {st:1,short:'الهدف من التجربة',title:'التجربة الثالثة — الهدف من التجربة',ref:'ص 18',
   q:'الضوء أسرع شيء نعرفه… فهل يعني ذلك أن نظام الإضاءة يستجيب فوراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة Light Control: مقبس الدخل ثم ثنائي باعث للضوء، والضوء يسقط على ترانزستور ضوئي ثم مقبس الخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="20" y="92" width="320" height="130" rx="14" fill="#CFE6DB" stroke="#12855A" stroke-width="2.5"/><text x="32" y="110" text-anchor="start" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">Light Control</text><g data-tip="مقبس الدخل ⟦y_L⟧: الجهد الذي يضيء الثنائي."><circle cx="46" cy="160" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="46" cy="160" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="46" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y<tspan font-size="0.72em" dy="4">L</tspan><tspan dy="-4">​</tspan></text><rect x="32" y="146" width="30" height="52" fill="transparent"/></g><line x1="54" y1="160" x2="94" y2="160" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="ثنائي باعث للضوء ⟦LED⟧: يضيء كلما زاد الجهد ⟦y_L⟧."><path d="M98 150 L98 170 L114 160 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="114" y1="150" x2="114" y2="170" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="110" y1="148" x2="112.2" y2="145.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M120.0 138.0 L116.1 149.7 L108.3 141.9 Z" fill="#2C4A40"/><line x1="118" y1="152" x2="120.2" y2="149.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M128.0 142.0 L124.1 153.7 L116.3 145.9 Z" fill="#2C4A40"/><text x="108" y="204" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="rtl">باعث للضوء</text><rect x="84" y="130" width="50" height="80" fill="transparent"/></g><g data-tip="الضوء يقطع المسافة بين الثنائي والترانزستور."><line x1="138" y1="150" x2="212" y2="150" stroke="#C9A227" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4"/><line x1="138" y1="160" x2="212" y2="160" stroke="#C9A227" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4"/><line x1="138" y1="170" x2="212" y2="170" stroke="#C9A227" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4"/><rect x="136" y="144" width="80" height="34" fill="transparent"/></g><g data-tip="ترانزستور ضوئي: يمرر تياراً يزيد مع شدة الضوء، فيعطي الجهد ⟦x_L⟧."><circle cx="238" cy="160" r="22" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2.5"/><line x1="231" y1="147" x2="231" y2="173" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="231" y1="153" x2="250" y2="142" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="231" y1="167" x2="250" y2="178" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="238" y="204" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="rtl">ترانزستور ضوئي</text><rect x="212" y="134" width="52" height="80" fill="transparent"/></g><line x1="260" y1="160" x2="306" y2="160" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="مقبس الخرج ⟦x_L⟧: جهد الترانزستور الضوئي."><circle cx="314" cy="160" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="314" cy="160" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="314" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x<tspan font-size="0.72em" dy="4">L</tspan><tspan dy="-4">​</tspan></text><rect x="300" y="146" width="30" height="52" fill="transparent"/></g><text x="180" y="64" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">نظام الإضاءة</text><text x="180" y="262" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">جهد ← ضوء ← جهد</text></svg>`,
   cap:'لوحة <span class="ltr">Light Control</span>: الجهد يضيء ثنائياً، والضوء يسقط على ترانزستور ضوئي يعطي جهد الخرج.<br><b>مرّر المؤشر على المقابس والعناصر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في لوحة <span class="ltr">Light Control</span>، ما الذي يحوّل الضوء إلى جهد الخرج \\(x_L\\)؟',opts:[
     ['الثنائي الباعث للضوء',false,'الثنائي يحوّل الجهد إلى ضوء، أي العكس.'],
     ['المولد',false,'المولد يعطي جهد الدخل \\(y_L\\).'],
     ['الترانزستور الضوئي',true,'يمرر تياراً يزيد مع شدة الضوء، فيعطي الجهد \\(x_L\\).']]}}
   ],
   body:[
    {book:String.raw`<p><b>التجربة الثالثة: استجابة نظام الإضاءة لإشارة الخطوة</b></p><p><b>الهدف من التجربة:</b></p><p>أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم <span class="ltr">Com3Lab</span></li><li>إشارة الخطوة وتأثيرها على خرج نظام الإضاءة</li><li>نوعية النظام من خلال الاستجابة</li><li>الكسب والثابت الزمني لنظام الإضاءة</li></ul>`,ref:'ص 18'},
    {tip:String.raw`<p>داخل لوحة <span class="ltr">Light Control</span>: الجهد \(y_L\) يضيء ثنائياً باعثاً للضوء <span class="ltr">(LED)</span>، والضوء يسقط على ترانزستور ضوئي يمرر تياراً يزيد مع شدة الضوء، فيعطي الجهد \(x_L\). الضوء يقطع المسافة في لحظة، والتأخير الوحيد من الدائرة الإلكترونية، لذلك <b>الثابت الزمني صغير جداً</b> (أجزاء من الألف من الثانية).</p>`},
    {add:String.raw`<p>الفكرة نفسها في حساس إنارة الشوارع: خلية ضوئية تقيس ضوء النهار، فتطفئ المصابيح صباحاً وتشغّلها مساءً.</p>`,title:'من الواقع'},
    {title:'مختبر مصغّر: رتّب سلسلة نظام الإضاءة',widget:(el,B)=>DCML.order(el,B,{intro:'من الجهد إلى الجهد: اضغط حلقات السلسلة بترتيب حدوثها داخل لوحة Light Control.',steps:[
 ['المولد يعطي جهد الدخل \\(y_L\\)','كل شيء يبدأ من جهد الدخل.'],
 ['الثنائي الباعث للضوء (LED) يضيء','الثنائي يحوّل الجهد إلى ضوء، فهو أول ما يتأثر بالجهد.'],
 ['الضوء يسقط على الترانزستور الضوئي','الضوء يصل إلى الترانزستور بعد أن يضيء الثنائي.'],
 ['الترانزستور يمرر تياراً يزيد مع شدة الضوء','التيار يتبع الضوء الساقط عليه.'],
 ['يظهر جهد الخرج \\(x_L\\)','هذا آخر السلسلة: ما يقرؤه راسم الذبذبات.']],
 done:'الضوء يقطع المسافة في لحظة، والتأخير الوحيد من الدائرة الإلكترونية، لذلك الثابت الزمني صغير جداً.'})}
   ]},

  {st:2,short:'الأجهزة والمكونات',title:'الأجهزة والمكونات',ref:'ص 18',
   q:'ما الجديد في أجهزة هذه التجربة مقارنة بتجربة المحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خمسة أجهزة: مصدر التغذية والكارت الإلكتروني ومولد الإشارة ونظام الإضاءة وجهاز الكمبيوتر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مصدر التغذية ⟦Power Supply⟧: يغذي الكرت الإلكتروني بالكهرباء."><rect x="234" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="268" y="74" width="32" height="24" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><line x1="277" y1="74" x2="277" y2="64" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="291" y1="74" x2="291" y2="64" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M284 98 V108" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="284.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مصدر التغذية</text></g><g data-tip="الكارت الإلكتروني: عليه لوحات التجارب، ومنها لوحة ⟦Light Control⟧."><rect x="130" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="154" y="69" width="52" height="34" rx="4" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><rect x="160" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="174" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><rect x="188" y="77" width="10" height="10" rx="2" fill="#F2C14E" stroke="#2C4A40" stroke-width="1"/><line x1="160" y1="96" x2="200" y2="96" stroke="#F2C14E" stroke-width="2" stroke-linecap="round"/><text x="180.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">الكارت الإلكتروني</text></g><g data-tip="مولد الإشارة ⟦Function Generator⟧: يعطي إشارة الخطوة، أي جهداً يقفز فجأة إلى قيمة نختارها."><rect x="26" y="48" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="52" y="69" width="48" height="34" rx="4" fill="#1F3A33" stroke="#2C4A40" stroke-width="2"/><path d="M58 95 H70 V77 H94" fill="none" stroke="#F2C14E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="76.0" y="134" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">مولد إشارة</text></g><g data-tip="نظام الإضاءة في اللوحة ⟦COM3LAB⟧: ثنائي باعث للضوء وترانزستور ضوئي."><rect x="182" y="160" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M222 188 L222 208 L238 198 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="238" y1="188" x2="238" y2="208" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="234" y1="186" x2="236.2" y2="183.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M244.0 176.0 L240.1 187.7 L232.3 179.9 Z" fill="#2C4A40"/><line x1="242" y1="190" x2="244.2" y2="187.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M252.0 180.0 L248.1 191.7 L240.3 183.9 Z" fill="#2C4A40"/><text x="232.0" y="246" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">نظام الإضاءة</text></g><g data-tip="جهاز الكمبيوتر: تظهر عليه الأجهزة الافتراضية وراسم الاستجابة."><rect x="78" y="160" width="100" height="100" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="104" y="179" width="48" height="30" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><rect x="108" y="183" width="40" height="22" rx="2" fill="#FFFFFF" stroke="#2C4A40" stroke-width="0"/><rect x="116" y="211" width="24" height="6" rx="2" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="128.0" y="246" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">جهاز الكمبيوتر</text></g><text x="180" y="288" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الأجهزة والمكونات</text></svg>`,
   cap:'الأجهزة والمكونات الخمسة بترتيب الكتاب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف دورها.</b>',
   side:[
    {predict:{q:'ما النظام الذي ندرس استجابته في هذه التجربة؟',opts:[
     ['محرك التيار المستمر',false,'المحرك كان في التجربة الثانية.'],
     ['نظام الإضاءة في اللوحة <span class="ltr">COM3LAB</span>',true,'نص الكتاب في ص 18.'],
     ['النظام الحراري',false,'النظام الحراري كان في التجربة الأولى.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية <span class="ltr">(Power Supply)</span></li><li>الكارت الإلكتروني.</li><li>مولد إشارة <span class="ltr">Function Generator</span></li><li>نظام الإضاءة في اللوحة <span class="ltr">COM3LAB</span></li><li>جهاز الكمبيوتر</li></ul>`,ref:'ص 18'},
    {tip:String.raw`<p>المولد يعطي الدخل (الخطوة)، ونظام الإضاءة هو النظام الذي ندرسه، والكمبيوتر تظهر عليه الأجهزة الافتراضية: المولد وراسم الذبذبات و«راسم الاستجابة لإشارة الخطوة».</p>`},
    {title:'مختبر مصغّر: في أي تجربة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'ثلاث تجارب في الوحدة الثانية. لكل عنصر اختر التجربة التي يخصها.',cats:['الأولى (حراري)','الثانية (محرك)','الثالثة (إضاءة)'],items:[
 ['المروحة تشويشاً بجهد <span class="ltr">5 V</span>',0,'تشغيل المروحة على عنصر التسخين في التجربة الأولى (ص 10–11).'],
 ['خطوة <span class="ltr">10 V</span> وزمن عرض <span class="ltr">5 s</span>',1,'هذا ما تطلبه التجربة الثانية (ص 15).'],
 ['خطوة 5 فولت وزمن عرض 1 ثانية',2,'هذا ما تطلبه هذه التجربة (ص 18).'],
 ['ثنائي باعث للضوء وترانزستور ضوئي',2,'هما نظام الإضاءة في لوحة Light Control.'],
 ['انتظار 3 دقائق قبل تسجيل كل نقطة',0,'في منحنى الخواص الاستاتيكي للنظام الحراري (ص 12).']]})}
   ]},

  {st:3,short:'خطوات إجراء التجربة',title:'خطوات إجراء التجربة — الشكل <span class="ltr">(2-2)</span>',ref:'ص 18–19',
   q:'التوصيل يشبه تجربة المحرك… لكن انتبه: هل القناتان في المكان نفسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="توصيل التجربة: المولد إلى دخل نظام الإضاءة، والقناة Y1 على الدخل، والقناة Y2 على الخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="20" y="40" width="320" height="110" rx="14" fill="#CFE6DB" stroke="#12855A" stroke-width="2.5"/><text x="32" y="58" text-anchor="start" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">Light Control</text><g data-tip="مقبس الدخل ⟦y_L⟧: يصله خرج المولد، وعليه أيضاً القناة ⟦Y1⟧."><circle cx="50" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="50" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="50" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">y<tspan font-size="0.72em" dy="4">L</tspan><tspan dy="-4">​</tspan></text><rect x="36" y="86" width="30" height="50" fill="transparent"/></g><line x1="58" y1="100" x2="96" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="ثنائي باعث للضوء ⟦LED⟧."><path d="M100 90 L100 110 L116 100 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="116" y1="90" x2="116" y2="110" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="112" y1="88" x2="114.2" y2="85.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M122.0 78.0 L118.1 89.7 L110.3 81.9 Z" fill="#2C4A40"/><line x1="120" y1="92" x2="122.2" y2="89.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><path d="M130.0 82.0 L126.1 93.7 L118.3 85.9 Z" fill="#2C4A40"/></g><g data-tip="الضوء من الثنائي إلى الترانزستور الضوئي."><line x1="140" y1="92" x2="206" y2="92" stroke="#C9A227" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/><line x1="140" y1="100" x2="206" y2="100" stroke="#C9A227" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/><line x1="140" y1="108" x2="206" y2="108" stroke="#C9A227" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4"/><rect x="138" y="86" width="70" height="28" fill="transparent"/></g><g data-tip="ترانزستور ضوئي."><circle cx="230" cy="100" r="20" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2.5"/><line x1="224" y1="88" x2="224" y2="112" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="224" y1="94" x2="240" y2="84" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="224" y1="106" x2="240" y2="116" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/></g><line x1="250" y1="100" x2="292" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="مقبس الخرج ⟦x_L⟧: يذهب إلى القناة ⟦Y2⟧."><circle cx="300" cy="100" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="300" cy="100" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="300" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">x<tspan font-size="0.72em" dy="4">L</tspan><tspan dy="-4">​</tspan></text><rect x="286" y="86" width="30" height="50" fill="transparent"/></g><g data-tip="مولد الإشارة: خطوة ⟦5 V⟧، وزمن العرض ⟦1 s⟧."><rect x="20" y="180" width="120" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="30" y="190" width="70" height="26" rx="4" fill="#1F3A33"/><text x="65" y="208" text-anchor="middle" font-size="13" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">5 V</text><circle cx="124" cy="210" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="124" cy="210" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><text x="124" y="236" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">OUT</text></g><g data-tip="راسم الذبذبات: هنا القناة ⟦Y1⟧ عليها الدخل، والقناة ⟦Y2⟧ عليها الخرج — عكس التجربة الثانية."><rect x="196" y="180" width="144" height="80" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="204" y="188" width="76" height="64" rx="3" fill="#1F3A33"/><path d="M210 240 H220 V206 H274" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3"/><path d="M210 240 H220 C221 212 224 209 274 209" fill="none" stroke="#F2C14E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="212" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y1</text><text x="300" y="244" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y2</text><circle cx="324" cy="206" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="324" cy="206" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/><circle cx="324" cy="238" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="324" cy="238" r="3.2" fill="#E8735A" stroke="#E8735A" stroke-width="0"/></g><path d="M124 202 V166 H50 V108" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="124" cy="166" r="3.5" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><path d="M300 108 V156 H350 V238 H332" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M324 198 V170 H190 V166 H124" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">خطوة <tspan direction="ltr" unicode-bidi="embed">5 V</tspan> وزمن <tspan direction="ltr" unicode-bidi="embed">1 s</tspan></text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(2-2)</span>: هنا <span class="ltr">Y1</span> على الدخل و<span class="ltr">Y2</span> على الخرج.<br><b>مرّر المؤشر على المقابس والعناصر والأجهزة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في هذا التوصيل، على أي قناة يظهر الخرج \\(x_L\\)؟',opts:[
     ['على القناة <span class="ltr">Y2</span>',true,'في الشكل <span class="ltr">(2-2)</span>: Y1 على خط الدخل \\(y_L\\)، و Y2 على الخرج \\(x_L\\) — عكس التجربة الثانية.'],
     ['على القناة <span class="ltr">Y1</span>',false,'هذا كان في تجربة المحرك؛ هنا Y1 على الدخل.'],
     ['لا يظهر الخرج على راسم الذبذبات',false,'يظهر، على القناة Y2.']]}}
   ],
   body:[
    {book:String.raw`<p><b>خطوات إجراء التجربة:</b></p><ul><li>شغل الكمبيوتر و لوحة العمليات ثم وصل التجربة حسب الشكل <span class="ltr">(2-2)</span></li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيل ومعايرة الأجهزة.</li><li>افتح راسم الاستجابة لإشارة الخطوة ثم حدد الخطوة على 5 فولت والزمن 1 ثانية.</li><li>قم بتشغيل التجربة وسجل إشارتي القناتين \(Y_1\) و \(Y_2\) على راسم الذبذبات.</li><li>سجل ملحوظاتك.</li></ul>`,ref:'ص 18'},
    {book:box(benchSVG({kind:'light',ins:'osc',inCh:'Y1',outCh:'Y2',wired:true,gen:'5.0 V',u:5,y:4}),760)+String.raw`<p class="sub">الشكل <span class="ltr">(2-2)</span>: توصيل التجربة</p>`,ref:'ص 19'},
    {watch:String.raw`<p>توصيل القناتين معكوس عن التجربة الثانية: هناك <span class="ltr">Y1</span> = الخرج و <span class="ltr">Y2</span> = الدخل، وهنا <span class="ltr">Y1</span> = الدخل و <span class="ltr">Y2</span> = الخرج. انتبه عند القراءة.</p>`},
    {tip:String.raw`<p>«الزمن <span class="ltr">1</span> ثانية» هو مدة العرض على الشاشة. ولأن الثابت الزمني لنظام الإضاءة صغير جداً، يبدو الخرج على عرض ثانية كاملة <b>قفزة</b> تقريباً؛ لنرى شكل المنحنى نقصّر زمن العرض.</p>`},
    {title:'مختبر مصغّر: انتبه للقناتين',widget:(el,B)=>{const L=DCML.lt;DCML.cases(el,B,{intro:'في الشكل (2-2): '+L('Y1')+' على خط الدخل \\(y_L\\)، و '+L('Y2')+' على الخرج \\(x_L\\) — عكس تجربة المحرك.',cases:[
 {q:'تريد أن تقرأ القيمة التي استقر عليها الخرج \\(Y_0\\). أي قناة تقرأ؟',opts:[
  [L('Y1'),false,'Y1 هنا على الدخل؛ في تجربة المحرك كانت على الخرج، فانتبه.'],
  [L('Y2'),true,'Y2 على \\(x_L\\) في هذا التوصيل.']]},
 {q:'تريد أن تقرأ قيمة الخطوة \\(X_0\\). أي قناة تقرأ؟',opts:[
  [L('Y2'),false,'Y2 على الخرج هنا.'],
  [L('Y1'),true,'Y1 على خط الدخل \\(y_L\\)، فيعرض الخطوة 5 فولت.']]}]})}}
   ]},

  {st:4,short:'تسجيل النتائج',title:'تسجيل النتائج: الكسب والثابت الزمني',ref:'ص 19',
   q:'المنحنى يصعد في لحظة تقريباً… فكيف نقيس ثابتاً زمنياً بهذا الصغر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى استجابة نظام الإضاءة: الخرج يصعد في لحظة تقريباً ويستقر عند Y0" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="50" y1="250" x2="323.0" y2="250.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M334.0 250.0 L323.0 255.5 L323.0 244.5 Z" fill="#2C4A40"/><line x1="50" y1="250" x2="50.0" y2="67.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M50.0 56.0 L55.5 67.0 L44.5 67.0 Z" fill="#2C4A40"/><text x="312" y="272" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">الزمن</text><g data-tip="قيمة الخطوة ⟦X0⟧: جهد الدخل (المتقطع)."><path d="M50 250 H60 V90 H326" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 4"/><text x="42" y="95" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">X<tspan font-size="0.72em" dy="4">0</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="⟦Y0⟧: القيمة التي استقر عليها الخرج."><path d="M50 250 H60 L60.0 250.0 L61.0 209.8 L62.0 184.3 L63.0 168.1 L64.0 157.9 L65.0 151.3 L66.0 147.2 L67.0 144.6 L68.0 142.9 L69.0 141.8 L70.0 141.2 L71.0 140.7 L72.0 140.5 L73.0 140.3 L74.0 140.2 L75.0 140.1 L76.0 140.1 L77.0 140.0 L78.0 140.0 L79.0 140.0 L80.0 140.0 L81.0 140.0 L82.0 140.0 L83.0 140.0 L84.0 140.0 L85.0 140.0 L86.0 140.0 L87.0 140.0 L88.0 140.0 L89.0 140.0 L90.0 140.0 L91.0 140.0 L92.0 140.0 L93.0 140.0 L94.0 140.0 L95.0 140.0 L96.0 140.0 L97.0 140.0 L98.0 140.0 L99.0 140.0 L100.0 140.0 L101.0 140.0 L102.0 140.0 L103.0 140.0 L104.0 140.0 L105.0 140.0 L106.0 140.0 L107.0 140.0 L108.0 140.0 L109.0 140.0 L110.0 140.0 L111.0 140.0 L112.0 140.0 L113.0 140.0 L114.0 140.0 L115.0 140.0 L116.0 140.0 L117.0 140.0 L118.0 140.0 L119.0 140.0 L120.0 140.0 L121.0 140.0 L122.0 140.0 L123.0 140.0 L124.0 140.0 L125.0 140.0 L126.0 140.0 L127.0 140.0 L128.0 140.0 L129.0 140.0 L130.0 140.0 L131.0 140.0 L132.0 140.0 L133.0 140.0 L134.0 140.0 L135.0 140.0 L136.0 140.0 L137.0 140.0 L138.0 140.0 L139.0 140.0 L140.0 140.0 L141.0 140.0 L142.0 140.0 L143.0 140.0 L144.0 140.0 L145.0 140.0 L146.0 140.0 L147.0 140.0 L148.0 140.0 L149.0 140.0 L150.0 140.0 L151.0 140.0 L152.0 140.0 L153.0 140.0 L154.0 140.0 L155.0 140.0 L156.0 140.0 L157.0 140.0 L158.0 140.0 L159.0 140.0 L160.0 140.0 L161.0 140.0 L162.0 140.0 L163.0 140.0 L164.0 140.0 L165.0 140.0 L166.0 140.0 L167.0 140.0 L168.0 140.0 L169.0 140.0 L170.0 140.0 L171.0 140.0 L172.0 140.0 L173.0 140.0 L174.0 140.0 L175.0 140.0 L176.0 140.0 L177.0 140.0 L178.0 140.0 L179.0 140.0 L180.0 140.0 L181.0 140.0 L182.0 140.0 L183.0 140.0 L184.0 140.0 L185.0 140.0 L186.0 140.0 L187.0 140.0 L188.0 140.0 L189.0 140.0 L190.0 140.0 L191.0 140.0 L192.0 140.0 L193.0 140.0 L194.0 140.0 L195.0 140.0 L196.0 140.0 L197.0 140.0 L198.0 140.0 L199.0 140.0 L200.0 140.0 L201.0 140.0 L202.0 140.0 L203.0 140.0 L204.0 140.0 L205.0 140.0 L206.0 140.0 L207.0 140.0 L208.0 140.0 L209.0 140.0 L210.0 140.0 L211.0 140.0 L212.0 140.0 L213.0 140.0 L214.0 140.0 L215.0 140.0 L216.0 140.0 L217.0 140.0 L218.0 140.0 L219.0 140.0 L220.0 140.0 L221.0 140.0 L222.0 140.0 L223.0 140.0 L224.0 140.0 L225.0 140.0 L226.0 140.0 L227.0 140.0 L228.0 140.0 L229.0 140.0 L230.0 140.0 L231.0 140.0 L232.0 140.0 L233.0 140.0 L234.0 140.0 L235.0 140.0 L236.0 140.0 L237.0 140.0 L238.0 140.0 L239.0 140.0 L240.0 140.0 L241.0 140.0 L242.0 140.0 L243.0 140.0 L244.0 140.0 L245.0 140.0 L246.0 140.0 L247.0 140.0 L248.0 140.0 L249.0 140.0 L250.0 140.0 L251.0 140.0 L252.0 140.0 L253.0 140.0 L254.0 140.0 L255.0 140.0 L256.0 140.0 L257.0 140.0 L258.0 140.0 L259.0 140.0 L260.0 140.0 L261.0 140.0 L262.0 140.0 L263.0 140.0 L264.0 140.0 L265.0 140.0 L266.0 140.0 L267.0 140.0 L268.0 140.0 L269.0 140.0 L270.0 140.0 L271.0 140.0 L272.0 140.0 L273.0 140.0 L274.0 140.0 L275.0 140.0 L276.0 140.0 L277.0 140.0 L278.0 140.0 L279.0 140.0 L280.0 140.0 L281.0 140.0 L282.0 140.0 L283.0 140.0 L284.0 140.0 L285.0 140.0 L286.0 140.0 L287.0 140.0 L288.0 140.0 L289.0 140.0 L290.0 140.0 L291.0 140.0 L292.0 140.0 L293.0 140.0 L294.0 140.0 L295.0 140.0 L296.0 140.0 L297.0 140.0 L298.0 140.0 L299.0 140.0 L300.0 140.0 L301.0 140.0 L302.0 140.0 L303.0 140.0 L304.0 140.0 L305.0 140.0 L306.0 140.0 L307.0 140.0 L308.0 140.0 L309.0 140.0 L310.0 140.0 L311.0 140.0 L312.0 140.0 L313.0 140.0 L314.0 140.0 L315.0 140.0 L316.0 140.0 L317.0 140.0 L318.0 140.0 L319.0 140.0 L320.0 140.0 L321.0 140.0 L322.0 140.0 L323.0 140.0 L324.0 140.0 L325.0 140.0 L326.0 140.0" fill="none" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><text x="42" y="145" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Y<tspan font-size="0.72em" dy="4">0</tspan><tspan dy="-4">​</tspan></text><rect x="50" y="130" width="280" height="24" fill="transparent"/></g><g data-tip="الثابت الزمني صغير جداً، فيصعد الخرج كأنه قفزة على زمن عرض طويل."><circle cx="64" cy="148" r="16" fill="none" stroke="#E8735A" stroke-width="2.5"/><text x="150" y="120" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="rtl">يكاد يكون قفزة</text><rect x="48" y="108" width="150" height="56" fill="transparent"/></g><text x="190" y="296" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">على زمن عرض <tspan direction="ltr" unicode-bidi="embed">1 s</tspan> يبدو الخرج قفزة</text></svg>`,
   cap:'رسم شكلي: على زمن عرض طويل يصعد خرج نظام الإضاءة كأنه قفزة ثم يستقر عند \\(Y_0\\).<br><b>مرّر المؤشر على الخطوط والدائرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'وضعت <span class="ltr">X0 = 5 V</span> واستقر الخرج عند <span class="ltr">Y0</span> أصغر منها. أي صيغة تعطي الكسب الصحيح؟',opts:[
     ['\\(K_s=X_0/Y_0\\) كما طُبعت في الجدول',false,'هذه الدخل ÷ الخرج، أي مقلوب الكسب: تعطي رقماً أكبر من 1 لنظام خرجه أصغر من دخله.'],
     ['\\(K_s=Y_0/X_0\\)',true,'الكسب = الخرج المستقر ÷ قيمة الخطوة.'],
     ['\\(K_s=Y_0-X_0\\)',false,'الكسب نسبة (قسمة)، لا فرق.']]}}
   ],
   body:[
    {book:String.raw`<p><b>تسجيل النتائج:</b></p><p>وارسم منحنى استجابة النظام لإشارة الخطوة</p><p>ما نوع النظام؟</p><p>احسب كسب النظام و الثابت الزمني.</p><div class="c2-tbl"><table class="c2-bt"><thead><tr><th>قيمة الخطوة X<sub>0</sub></th><th>القيمة التي استقر عليها الخرج Y<sub>0</sub></th><th>الكسب K<sub>s</sub> = X<sub>0</sub> / Y<sub>0</sub></th><th>الثابت الزمني T</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>أكمل النموذج الرياضي لنظام الإضاءة (دالة النظام بدلالة المتغير المركب \(s\))</p><p>\(G(s)=\ldots\ldots\)</p>`,ref:'ص 19'},
    {watch:String.raw`<p>صيغة الكسب في الجدول \(K_s=X_0/Y_0\) مقلوبة كما في التجربة الثانية؛ الصحيح \(K_s=Y_0/X_0\).</p>`,fix:true},
    {title:'الكسب: كما في الكتاب / المصحح',widget:bookFixW(GAIN_BOOK,GAIN_FIX)},
    {tip:String.raw`<p>نظام الإضاءة من الرتبة الأولى أيضاً، فنموذجه بالشكل نفسه:</p>$$G(s)=\frac{K_s}{T\,s+1}$$<p>والثابت الزمني \(T\) هو الزمن الذي يصل فيه الخرج إلى <span class="ltr">63.2%</span> من قيمته النهائية، لكنه هنا صغير جداً، فلا يُقرأ إلا إذا قصّرنا زمن العرض كثيراً.</p>`},
    {title:'مختبر مصغّر: قصّر زمن العرض لترى المنحنى',widget:(el,B)=>DCML.lab(el,B,{intro:'خطوة <span class="ltr">5 V</span> (الكتاب). اختر زمن العرض على راسم الذبذبات، وانظر متى يظهر شكل المنحنى وتظهر نقطة <span class="ltr">63.2%</span>.',
 predict:{q:'على زمن العرض الذي يطلبه الكتاب (1 ثانية)، كيف يبدو خرج نظام الإضاءة؟',opts:[
  ['منحنى صاعد بطيء واضح مثل المحرك',false,'المحرك ثابته الزمني أكبر بكثير؛ الإضاءة أسرع.'],
  ['قفزة تقريباً، ولا يُقرأ منه الثابت الزمني',true,'الصعود كله يحدث في جزء صغير جداً من الشاشة، فنقصّر زمن العرض لنراه.'],
  ['خط أفقي عند الصفر',false,'الخرج يصعد ويستقر عند \\(Y_0\\)، لكن بسرعة كبيرة.']]},
 ins:[{k:'w',l:'زمن العرض',seg:[[1,'<span class="ltr">1 s</span> (الكتاب)'],[0.1,'<span class="ltr">0.1 s</span>'],[0.02,'<span class="ltr">0.02 s</span>']],v:1}],
 tp:{id:'u2-l3',defs:LI_DEF},
 calc:(s,P,B)=>{const W=s.w,Y=P.KL*5,T=P.TL,n=600,pts=[[0,0]];for(let i=1;i<=n;i++){const t=W*i/n;pts.push([t,Y*(1-Math.exp(-t/T))])}
  const vis=T/W>0.03,ms=v=>W<0.5?DCML.fm(B,v*1000,0):DCML.fm(B,v,1);
  return {facts:[['Y<sub>0</sub>',DCML.fm(B,Y,2)+' V'],['الثابت الزمني T',vis?DCML.fm(B,T*1000,1)+' ms':'لا يُقرأ',vis?'hi':'bad'],['نسبة T إلى العرض',DCML.fm(B,100*T/W,1)+' %']],
   plot:{xr:[0,W],yr:[0,Math.max(5,Y)*1.12],xl:W<0.5?'t (ms)':'t (s)',yl:'V',fx:ms,curves:[{pts:[[0,0],[0,5],[W,5]],col:'--live',dash:'5 4',w:1.8},{pts,col:'--blue',w:2.6}],cur:vis?[T,0.632*Y]:null},
   msg:vis?'الآن يظهر المنحنى، والنقطة البرتقالية عند \\(t=T\\) (الخرج 63.2% من \\(Y_0\\)).':'الصعود كله في جزء صغير جداً من الشاشة، فيبدو قفزة. قصّر زمن العرض.'}}})}
   ]},

  {st:5,short:'أسئلة ومناقشة',title:'أسئلة ومناقشة',ref:'ص 20',
   q:'ثلاثة أنظمة من الرتبة الأولى في هذه الوحدة… فما الذي يفرّق بينها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة منحنيات استجابة شكلية: النظام الحراري بطيء، والمحرك أسرع، ونظام الإضاءة شبه فوري" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="النظام الحراري (التجربة الأولى): بطيء جداً، وبدايته متأخرة قليلاً."><line x1="40" y1="112" x2="234" y2="112" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="112" x2="40" y2="60" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M40 112 H50 C80 112 90 108 120 88 C150 72 180 68 230 68" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="252" y="72" width="84" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="92" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">النظام الحراري</text><rect x="36" y="60" width="304" height="56" fill="transparent"/></g><g data-tip="المحرك (التجربة الثانية): أسرع من الحراري."><line x1="40" y1="184" x2="234" y2="184" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="184" x2="40" y2="132" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M40 184 H50 L50.0 184.0 L51.0 182.0 L52.0 180.2 L53.0 178.4 L54.0 176.7 L55.0 175.1 L56.0 173.5 L57.0 172.0 L58.0 170.6 L59.0 169.2 L60.0 167.9 L61.0 166.7 L62.0 165.5 L63.0 164.4 L64.0 163.3 L65.0 162.3 L66.0 161.3 L67.0 160.3 L68.0 159.4 L69.0 158.6 L70.0 157.7 L71.0 156.9 L72.0 156.2 L73.0 155.5 L74.0 154.8 L75.0 154.1 L76.0 153.5 L77.0 152.9 L78.0 152.3 L79.0 151.8 L80.0 151.3 L81.0 150.8 L82.0 150.3 L83.0 149.8 L84.0 149.4 L85.0 149.0 L86.0 148.6 L87.0 148.2 L88.0 147.8 L89.0 147.5 L90.0 147.1 L91.0 146.8 L92.0 146.5 L93.0 146.2 L94.0 146.0 L95.0 145.7 L96.0 145.4 L97.0 145.2 L98.0 145.0 L99.0 144.7 L100.0 144.5 L101.0 144.3 L102.0 144.1 L103.0 144.0 L104.0 143.8 L105.0 143.6 L106.0 143.5 L107.0 143.3 L108.0 143.2 L109.0 143.0 L110.0 142.9 L111.0 142.7 L112.0 142.6 L113.0 142.5 L114.0 142.4 L115.0 142.3 L116.0 142.2 L117.0 142.1 L118.0 142.0 L119.0 141.9 L120.0 141.8 L121.0 141.7 L122.0 141.7 L123.0 141.6 L124.0 141.5 L125.0 141.5 L126.0 141.4 L127.0 141.3 L128.0 141.3 L129.0 141.2 L130.0 141.2 L131.0 141.1 L132.0 141.1 L133.0 141.0 L134.0 141.0 L135.0 140.9 L136.0 140.9 L137.0 140.8 L138.0 140.8 L139.0 140.8 L140.0 140.7 L141.0 140.7 L142.0 140.7 L143.0 140.6 L144.0 140.6 L145.0 140.6 L146.0 140.6 L147.0 140.5 L148.0 140.5 L149.0 140.5 L150.0 140.5 L151.0 140.4 L152.0 140.4 L153.0 140.4 L154.0 140.4 L155.0 140.4 L156.0 140.4 L157.0 140.3 L158.0 140.3 L159.0 140.3 L160.0 140.3 L161.0 140.3 L162.0 140.3 L163.0 140.3 L164.0 140.2 L165.0 140.2 L166.0 140.2 L167.0 140.2 L168.0 140.2 L169.0 140.2 L170.0 140.2 L171.0 140.2 L172.0 140.2 L173.0 140.2 L174.0 140.2 L175.0 140.1 L176.0 140.1 L177.0 140.1 L178.0 140.1 L179.0 140.1 L180.0 140.1 L181.0 140.1 L182.0 140.1 L183.0 140.1 L184.0 140.1 L185.0 140.1 L186.0 140.1 L187.0 140.1 L188.0 140.1 L189.0 140.1 L190.0 140.1 L191.0 140.1 L192.0 140.1 L193.0 140.1 L194.0 140.1 L195.0 140.1 L196.0 140.1 L197.0 140.1 L198.0 140.1 L199.0 140.1 L200.0 140.0 L201.0 140.0 L202.0 140.0 L203.0 140.0 L204.0 140.0 L205.0 140.0 L206.0 140.0 L207.0 140.0 L208.0 140.0 L209.0 140.0 L210.0 140.0 L211.0 140.0 L212.0 140.0 L213.0 140.0 L214.0 140.0 L215.0 140.0 L216.0 140.0 L217.0 140.0 L218.0 140.0 L219.0 140.0 L220.0 140.0 L221.0 140.0 L222.0 140.0 L223.0 140.0 L224.0 140.0 L225.0 140.0 L226.0 140.0 L227.0 140.0 L228.0 140.0 L229.0 140.0 L230.0 140.0" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="252" y="144" width="84" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="164" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">المحرك</text><rect x="36" y="132" width="304" height="56" fill="transparent"/></g><g data-tip="نظام الإضاءة (هذه التجربة): الثابت الزمني صغير جداً، فيكاد الخرج يقفز مع الدخل."><line x1="40" y1="256" x2="234" y2="256" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="256" x2="40" y2="204" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M40 256 H50 L50.0 256.0 L51.0 234.6 L52.0 223.6 L53.0 218.0 L54.0 215.1 L55.0 213.6 L56.0 212.8 L57.0 212.4 L58.0 212.2 L59.0 212.1 L60.0 212.1 L61.0 212.0 L62.0 212.0 L63.0 212.0 L64.0 212.0 L65.0 212.0 L66.0 212.0 L67.0 212.0 L68.0 212.0 L69.0 212.0 L70.0 212.0 L71.0 212.0 L72.0 212.0 L73.0 212.0 L74.0 212.0 L75.0 212.0 L76.0 212.0 L77.0 212.0 L78.0 212.0 L79.0 212.0 L80.0 212.0 L81.0 212.0 L82.0 212.0 L83.0 212.0 L84.0 212.0 L85.0 212.0 L86.0 212.0 L87.0 212.0 L88.0 212.0 L89.0 212.0 L90.0 212.0 L91.0 212.0 L92.0 212.0 L93.0 212.0 L94.0 212.0 L95.0 212.0 L96.0 212.0 L97.0 212.0 L98.0 212.0 L99.0 212.0 L100.0 212.0 L101.0 212.0 L102.0 212.0 L103.0 212.0 L104.0 212.0 L105.0 212.0 L106.0 212.0 L107.0 212.0 L108.0 212.0 L109.0 212.0 L110.0 212.0 L111.0 212.0 L112.0 212.0 L113.0 212.0 L114.0 212.0 L115.0 212.0 L116.0 212.0 L117.0 212.0 L118.0 212.0 L119.0 212.0 L120.0 212.0 L121.0 212.0 L122.0 212.0 L123.0 212.0 L124.0 212.0 L125.0 212.0 L126.0 212.0 L127.0 212.0 L128.0 212.0 L129.0 212.0 L130.0 212.0 L131.0 212.0 L132.0 212.0 L133.0 212.0 L134.0 212.0 L135.0 212.0 L136.0 212.0 L137.0 212.0 L138.0 212.0 L139.0 212.0 L140.0 212.0 L141.0 212.0 L142.0 212.0 L143.0 212.0 L144.0 212.0 L145.0 212.0 L146.0 212.0 L147.0 212.0 L148.0 212.0 L149.0 212.0 L150.0 212.0 L151.0 212.0 L152.0 212.0 L153.0 212.0 L154.0 212.0 L155.0 212.0 L156.0 212.0 L157.0 212.0 L158.0 212.0 L159.0 212.0 L160.0 212.0 L161.0 212.0 L162.0 212.0 L163.0 212.0 L164.0 212.0 L165.0 212.0 L166.0 212.0 L167.0 212.0 L168.0 212.0 L169.0 212.0 L170.0 212.0 L171.0 212.0 L172.0 212.0 L173.0 212.0 L174.0 212.0 L175.0 212.0 L176.0 212.0 L177.0 212.0 L178.0 212.0 L179.0 212.0 L180.0 212.0 L181.0 212.0 L182.0 212.0 L183.0 212.0 L184.0 212.0 L185.0 212.0 L186.0 212.0 L187.0 212.0 L188.0 212.0 L189.0 212.0 L190.0 212.0 L191.0 212.0 L192.0 212.0 L193.0 212.0 L194.0 212.0 L195.0 212.0 L196.0 212.0 L197.0 212.0 L198.0 212.0 L199.0 212.0 L200.0 212.0 L201.0 212.0 L202.0 212.0 L203.0 212.0 L204.0 212.0 L205.0 212.0 L206.0 212.0 L207.0 212.0 L208.0 212.0 L209.0 212.0 L210.0 212.0 L211.0 212.0 L212.0 212.0 L213.0 212.0 L214.0 212.0 L215.0 212.0 L216.0 212.0 L217.0 212.0 L218.0 212.0 L219.0 212.0 L220.0 212.0 L221.0 212.0 L222.0 212.0 L223.0 212.0 L224.0 212.0 L225.0 212.0 L226.0 212.0 L227.0 212.0 L228.0 212.0 L229.0 212.0 L230.0 212.0" fill="none" stroke="#12855A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="252" y="216" width="84" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="236" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">نظام الإضاءة</text><rect x="36" y="204" width="304" height="56" fill="transparent"/></g><text x="180" y="292" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الفرق في السرعة، ولا تجاوز في أي منها</text></svg>`,
   cap:'مقارنة شكلية (بلا أرقام) بين أنظمة الوحدة الثلاثة على محور زمن واحد.<br><b>مرّر المؤشر على كل منحنى (أو المسه في الجوال) لتعرف صاحبه.</b>',
   side:[
    {predict:{q:'بما أن الثابت الزمني صغير جداً في نظام الإضاءة، ماذا تستنتج؟',opts:[
     ['أن النظام لا يعمل',false,'يعمل، لكنه سريع جداً.'],
     ['أن كسبه كبير جداً',false,'الثابت الزمني يخبر عن السرعة، لا عن الكسب.'],
     ['أنه يستجيب تقريباً فوراً، ويمكن أحياناً اعتباره كسباً فقط',true,'\\(G(s)\\approx K_s\\) دون تأخير يذكر.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أسئلة ومناقشة</b></p><ul><li>ارسم المخطط الصندوقي للتجربة</li><li>ما الهدف من استجابة النظام لإشارة الخطوة؟</li><li>بما أن الثابت الزمني يعتبر صغيراً جداً في حالة نظام الإضاءة، ماذا تستنتج؟</li><li>ماذا تستخلص من هذه التجربة؟</li></ul>`,ref:'ص 20'},
    {title:'مختبر مصغّر: رتّب الأنظمة الثلاثة',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب أنظمة الوحدة الثانية من الأسرع استجابة إلى الأبطأ.',steps:[
 ['نظام الإضاءة','الضوء يتغير في لحظة، وثابته الزمني أجزاء من الألف من الثانية: هو الأسرع.'],
 ['محرك التيار المستمر','المحرك أسرع من النظام الحراري: يكفيه عرض <span class="ltr">5 s</span>.'],
 ['النظام الحراري','هو الأبطأ: ننتظر 3 دقائق ليستقر خرجه.']],
 done:'الثلاثة من الرتبة الأولى ولا تتجاوز قيمتها النهائية؛ الفرق بينها في الثابت الزمني.'})},
    {tip:String.raw`<details class="c2-q"><summary>1: ارسم المخطط الصندوقي للتجربة.</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> `+box(openLoopSVG({plant:'نظام الإضاءة',sym:'LED → phototransistor',meter:'راسم الذبذبات',u:'yL',y:'xL'}),600)+String.raw`</div></details><details class="c2-q"><summary>2: ما الهدف من استجابة النظام لإشارة الخطوة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نعرف منها نوع النظام وكسبه وسرعته (الثابت الزمني)، فنكتب نموذجه \(G(s)\).</div></details><details class="c2-q"><summary>3: بما أن الثابت الزمني يعتبر صغيراً جداً في حالة نظام الإضاءة، ماذا تستنتج؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> أن نظام الإضاءة يستجيب تقريباً فوراً: يمكن في كثير من الحسابات اعتباره كسباً فقط \(G(s)\approx K_s\) دون تأخير. ولقياس \(T\) نحتاج زمن عرض قصيراً جداً على راسم الذبذبات. وفي الدائرة المغلقة يسهل التحكم فيه لأنه لا يتأخر.</div></details><details class="c2-q"><summary>4: ماذا تستخلص من هذه التجربة؟</summary><div class="c2-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نظام الإضاءة من الرتبة الأولى أيضاً (لا تجاوز ولا تأرجح)، لكنه أسرع بكثير من المحرك والنظام الحراري. النموذج \(G(s)=K_s/(Ts+1)\) مع \(T\) صغير جداً.</div></details>`,title:'إجابات مقترحة — افتحها بعد أن تحاول'},
    {tip:String.raw`<p>مقارنة الأنظمة الثلاثة في هذه الوحدة: النظام الحراري بطيء جداً (ننتظر <span class="ltr">3</span> دقائق ليستقر)، والمحرك أسرع منه، ونظام الإضاءة سريع جداً. كلها لا تتجاوز قيمتها النهائية، والفرق بينها في <b>السرعة</b>، أي في الثابت الزمني.</p>`,title:'الأنظمة الثلاثة معاً'}
   ]},

  {recap:[
   String.raw`نظام الإضاءة: الجهد \(y_L\) يضيء ثنائياً باعثاً للضوء، والترانزستور الضوئي يحوّل الضوء إلى الجهد \(x_L\) (ص 18).`,
   String.raw`خطوة <span class="ltr">5</span> فولت وزمن عرض <span class="ltr">1</span> ثانية، وهنا <span class="ltr">Y1</span> = الدخل و<span class="ltr">Y2</span> = الخرج — الشكل <span class="ltr">(2-2)</span> (ص 18–19).`,
   String.raw`الكسب = الخرج المستقر ÷ قيمة الخطوة \(K_s=Y_0/X_0\) (صيغة الجدول في الكتاب مقلوبة)، والنموذج \(G(s)=K_s/(T\,s+1)\) (ص 19).`,
   String.raw`الثابت الزمني لنظام الإضاءة صغير جداً، فهو أسرع أنظمة الوحدة الثلاثة (ص 20).`]}
],
 theory:[
  {h:'التجربة الثالثة: استجابة نظام الإضاءة لإشارة الخطوة',ref:'ص 18',html:`<p><b>الهدف من التجربة:</b> أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم ${lt('Com3Lab')}.</li><li>إشارة الخطوة وتأثيرها على خرج نظام الإضاءة.</li><li>نوعية النظام من خلال الاستجابة.</li><li>الكسب والثابت الزمني لنظام الإضاءة.</li></ul>
   <p><b>الأجهزة والمكونات:</b></p><ul><li>مصدر التغذية ${lt('(Power Supply)')}.</li><li>الكارت الإلكتروني.</li><li>مولد إشارة ${lt('Function Generator')}.</li><li>نظام الإضاءة في اللوحة ${lt('COM3LAB')}.</li><li>جهاز الكمبيوتر.</li></ul>`},
  {h:'خطوات إجراء التجربة',ref:'ص 18',html:`<ol><li>شغل الكمبيوتر ولوحة العمليات ثم وصل التجربة حسب الشكل ${lt('(2-2)')}.</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيل ومعايرة الأجهزة.</li><li>افتح راسم الاستجابة لإشارة الخطوة ثم حدد الخطوة على ${lt('5')} فولت والزمن ${lt('1')} ثانية.</li><li>قم بتشغيل التجربة وسجل إشارتي القناتين \\(Y_1\\) و \\(Y_2\\) على راسم الذبذبات.</li><li>سجل ملحوظاتك.</li></ol>`},
  {fig:'(2-2)',ref:'ص 19',caption:'توصيل التجربة: OUT المولد إلى y<sub>L</sub> (الثنائي الباعث للضوء)، و Y1 على خط الدخل y<sub>L</sub>، و Y2 على خرج الترانزستور الضوئي x<sub>L</sub>.',draw:()=>box(benchSVG({kind:'light',ins:'osc',inCh:'Y1',outCh:'Y2',wired:true,gen:'5.0 V',u:5,y:4}),760)},
  {note:ADD+`داخل لوحة ${lt('Light Control')}: الجهد \\(y_L\\) يضيء ثنائياً باعثاً للضوء ${lt('(LED)')}، والضوء يسقط على ترانزستور ضوئي يمرر تياراً يزيد مع شدة الضوء، فيعطي الجهد \\(x_L\\). الضوء يقطع المسافة في لحظة، والتأخير الوحيد من الدائرة الإلكترونية، لذلك <b>الثابت الزمني صغير جداً</b> (أجزاء من الألف من الثانية). على زمن عرض ثانية كاملة يبدو الخرج قفزة؛ لنرى المنحنى نقصّر زمن العرض.`},
  {h:'تسجيل النتائج',ref:'ص 19',html:`<p>ارسم منحنى استجابة النظام لإشارة الخطوة. ما نوع النظام؟ احسب كسب النظام والثابت الزمني.</p>`+ptable(['قيمة الخطوة X<sub>0</sub>','القيمة التي استقر عليها الخرج Y<sub>0</sub>','الكسب K<sub>s</sub> = X<sub>0</sub> / Y<sub>0</sub>','الثابت الزمني T'],[['','','','']])+`<p>أكمل النموذج الرياضي لنظام الإضاءة (دالة النظام بدلالة المتغير المركب \\(s\\)): \\(G(s)=\\ldots\\ldots\\)</p>`},
  {widget:bookFixW(GAIN_BOOK,GAIN_FIX)},
  {note:ADD+`مقارنة الأنظمة الثلاثة في هذه الوحدة (بالقيم التوضيحية في مختبراتنا): النظام الحراري بطيء جداً (يستقر في نحو ${lt('3')} دقائق)، والمحرك متوسط (الثابت الزمني نحو ${lt('0.4 s')})، ونظام الإضاءة سريع جداً (نحو ${lt('4 ms')}). كلها لا تتجاوز قيمتها النهائية، والفرق بينها في <b>السرعة</b>.`},
  {h:'أسئلة ومناقشة',ref:'ص 20',html:
   Q('1','ارسم المخطط الصندوقي للتجربة.',box(openLoopSVG({plant:'نظام الإضاءة',sym:'LED → phototransistor',meter:'راسم الذبذبات',u:'yL',y:'xL'}),600))+
   Q('2','ما الهدف من استجابة النظام لإشارة الخطوة؟','نعرف منها نوع النظام وكسبه وسرعته (الثابت الزمني)، فنكتب نموذجه \\(G(s)\\).')+
   Q('3','بما أن الثابت الزمني يعتبر صغيراً جداً في حالة نظام الإضاءة، ماذا تستنتج؟','أن نظام الإضاءة يستجيب تقريباً فوراً: يمكن في كثير من الحسابات اعتباره كسباً فقط \\(G(s)\\approx K_s\\) دون تأخير. ولقياس \\(T\\) نحتاج زمن عرض قصيراً جداً على راسم الذبذبات. وفي الدائرة المغلقة يسهل التحكم فيه لأنه لا يتأخر.')+
   Q('4','ماذا تستخلص من هذه التجربة؟','نظام الإضاءة من الرتبة الأولى أيضاً (لا تجاوز ولا تأرجح)، لكنه أسرع بكثير من المحرك والنظام الحراري. النموذج \\(G(s)=K_s/(Ts+1)\\) مع \\(T\\) صغير جداً.')},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>صيغة الكسب في الجدول \\(K_s=X_0/Y_0\\) مقلوبة كما في التجربة الثانية؛ الصحيح \\(K_s=Y_0/X_0\\).</li><li>توصيل القناتين معكوس عن التجربة الثانية: هناك Y1 = الخرج و Y2 = الدخل، وهنا Y1 = الدخل و Y2 = الخرج. المختبر يتبع كل شكل كما هو؛ انتبه عند القراءة.</li><li>لا يوجد في هذه التجربة مخطط Simulink.</li></ol></div>`}
 ],
 lab:(el)=>{
  el.innerHTML=`<div id="litp"></div><div id="lib"></div>`;
  let A=null;const TP=B.params(el.querySelector('#litp'),'u2-l3',LI_DEF,()=>{if(A){A.reset('تغيّرت أرقام المحاكاة، فمسحنا التسجيل والجدول.');A.steps.redraw()}});
  const P=()=>TP.v;
  A=stepBench(el.querySelector('#lib'),{k:'li',TP:P,kind0:'light',ins:'osc',inName:'y<sub>L</sub>',outName:'x<sub>L</sub>',title:'منضدة نظام الإضاءة <small>مبنية على الشكل (2-2) ص 19</small>',
   chans:{light:{inCh:'Y1',outCh:'Y2'}},amp0:0,ampBook:5,wins:[0.02,0.05,0.2,1],winBook:1,speeds:[0.02,1],speed0:1,
   rows0:()=>[],clearRows:c=>{c.rows.length=0},
   meters:(c,u,y)=>[['الدخل (Y1)',fm(u,2)+' V'],['الخرج (Y2)',fm(y,2)+' V'],['زمن التسجيل',c.cap?fm(Math.max(0,c.cap.t)*1000,1)+' ms':'—']],
   tblTitle:'جدول النتائج ص 19 — يمتلئ بقياساتك',
   table:(c,host)=>gainTable(c,host,{kname:()=>'الإضاءة',gsLabel:'النموذج الرياضي',model:()=>({K:P().KL,T:P().TL})}),
   steps:c=>[
    {t:'وصّل الأجهزة',x:'شغّل «وصّل الأجهزة حسب الشكل»: Y1 على الدخل <span class="ltr">y<sub>L</sub></span> و Y2 على الخرج <span class="ltr">x<sub>L</sub></span>.',done:()=>c.wired},
    {t:'خطوة 5 V وزمن 1 s',x:'اضغط «5 V — قيمة الكتاب»، وزمن التسجيل <span class="ltr">1 s</span>.',done:()=>c.amp===5&&c.W===1},
    {t:'شغّل ولاحظ',x:'اضغط «شغّل». القناتان تقفزان معاً تقريباً: لا يظهر المنحنى لأن الثابت الزمني صغير جداً.',done:()=>c.cap&&c.cap.done&&c.cap.W===1&&c.cap.amp===5},
    {t:'قصّر زمن العرض',get x(){return `اختر زمن تسجيل <span class="ltr">20 ms</span> أو <span class="ltr">50 ms</span> وشغّل من جديد: الآن ترى منحنى الرتبة الأولى. الثابت الزمني بالقيم الحالية نحو <span class="ltr">${fm(P().TL*1000,1)} ms</span>.`},done:()=>c.cap&&c.cap.done&&c.cap.W<=0.05},
    {t:'سجّل في الجدول',x:'اضغط «سجّل القياس في الجدول».',done:()=>c.rows.some(r=>r.W<=0.05)},
    {t:'صحح صيغة الكسب',x:'اختر «المصحح» واقرأ \\(G(s)\\). قارن \\(T\\) هنا بثابت المحرك في التجربة السابقة.',done:()=>!!c.did.mode_fixed},
    {t:'جرّب سرعة بطيئة',x:'اختر «بطيء ×0.02» وشغّل بزمن <span class="ltr">1 s</span>: ترى الخرج يصعد بالحركة البطيئة.'}]});
 },
 quiz:[
  {q:'ما قيمة الخطوة وزمنها في تجربة الإضاءة؟',o:['5 V و 1 s','10 V و 5 s','7 V و 200 s','1 V و 5 s'],c:0,e:'الخطوة 3 ص 18.'},
  {q:'في الشكل (2-2) القناة Y2 موصلة على:',o:['الدخل y<sub>L</sub>','الخرج x<sub>L</sub>','الأرضي','المروحة'],c:1,e:'Y1 على الدخل و Y2 على الخرج — عكس التجربة الثانية.'},
  {q:'العنصر الذي يحوّل الضوء إلى جهد في لوحة Light Control:',o:['الثنائي الباعث للضوء','الترانزستور الضوئي','المحرك','عنصر التسخين'],c:1,e:'الـ LED يضيء والترانزستور الضوئي يستقبل.'},
  {q:'لماذا يبدو خرج نظام الإضاءة على زمن 1 ثانية كأنه قفزة؟',o:['لأن الكسب كبير','لأن الثابت الزمني صغير جداً بالنسبة لزمن العرض','لأن المولد معطل','لأن النظام غير خطي'],c:1,e:'بضعة أجزاء من الألف من الثانية لا تُرى على عرض ثانية كاملة.'},
  {q:'أي الأنظمة الثلاثة أبطأ؟',o:['الإضاءة','المحرك','النظام الحراري','كلها متساوية'],c:2,e:'الحراري يحتاج دقائق ليستقر.'},
  {q:'خطوة 5 V والخرج استقر عند 4 V. الكسب الصحيح:',o:['1.25','0.8','20','9'],c:1,e:'Ks = Y0/X0 = 4/5 = 0.8.'},
  {q:'لأن T صغير جداً يمكن تقريب نظام الإضاءة إلى:',o:['\\(G(s)\\approx K_s\\)','\\(G(s)\\approx 1/s\\)','\\(G(s)\\approx 0\\)','نظام متأرجح'],c:0,e:'تأخيره مهمل في أغلب الحسابات.'}
 ]
});

})(PLCBOOK);
