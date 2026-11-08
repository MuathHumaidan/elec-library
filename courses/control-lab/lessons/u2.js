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
 th:{init:P=>({q:0,x:0}),step:(s,u,z,h,P)=>{s.q=lag(s.q,P.Ks*u-P.Kz*z,P.T1,h);s.x=lag(s.x,s.q,P.T2,h)},y:(s,P)=>P.xa+s.x,hmax:P=>Math.min(P.T1,P.T2)/4},
 mot:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.Km*u,P.Tm,h)},y:s=>s.x,hmax:()=>Infinity},
 pt1:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.K1*u,P.T1,h)},y:s=>s.x,hmax:()=>Infinity},
 light:{init:()=>({x:0}),step:(s,u,z,h,P)=>{s.x=lag(s.x,P.KL*u,P.TL,h)},y:s=>s.x,hmax:()=>Infinity}};

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
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>أرقام أشكال الوحدة لا تتبع ترتيب التجارب: هذه التجربة تبدأ بالشكل ${lt('(2-3)')}، وشكل التجربة الثانية ${lt('(2-1)')} (طُبع ${lt('(1-2)')})، وشكل الثالثة ${lt('(2-2)')}. أبقينا أرقام الكتاب.</li><li>الشكل ${lt('(2-4)')} بلا عنوان، والكتاب لا يشرح وظيفة الوصلة بين ${lt('ϑ')} و ${lt('Sense')} في الشكل ${lt('(2-5)')}.</li><li>الكتاب يرمز لكسب النظام هنا \\(K_p\\) وفي التجربتين التاليتين \\(K_s\\)، ويرمز للخرج هنا \\(X_0\\) بينما \\(X_0\\) في التجربتين التاليتين هو الدخل.</li><li>الوحدة كلها بلا شرح نظري، فأضفنا التوضيحات الموسومة.</li></ol>`}
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
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>الخطوة 1 تحيل إلى الشكل ${lt('(2-1)')} بينما الشكل في ص 16 مطبوع برقم ${lt('(1-2)')}؛ استعملنا ${lt('(2-1)')}.</li><li>صيغة الكسب في الجدول \\(K_s=X_0/Y_0\\) مقلوبة؛ الصحيح \\(K_s=Y_0/X_0\\) (انظر مفتاح «كما في الكتاب / المصحح» أعلاه وفي جدول المختبر).</li><li>الرمز \\(X_0\\) هنا قيمة الخطوة (الدخل)، بينما كان في التجربة الأولى الخرج.</li><li>«الكارت» و«الكرت» و«الدرجة الأولى» و«الرتبة الأولى» بمعنى واحد في الكتاب.</li></ol>`}
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
   spin:(c,y)=>c.kind==='mot'?y/10*c.P.nmax*0.12:0,
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
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>صيغة الكسب في الجدول \\(K_s=X_0/Y_0\\) مقلوبة كما في التجربة الثانية؛ الصحيح \\(K_s=Y_0/X_0\\).</li><li>توصيل القناتين معكوس عن التجربة الثانية: هناك Y1 = الخرج و Y2 = الدخل، وهنا Y1 = الدخل و Y2 = الخرج. المختبر يتبع كل شكل كما هو؛ انتبه عند القراءة.</li><li>لا يوجد في هذه التجربة مخطط Simulink.</li></ol>`}
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
