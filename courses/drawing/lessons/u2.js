/* Unit 2 — الرموز الكهربائية والإلكترونية (ص 46–60)
   u2-l1 الرموز الأساسية وعناصر التوصيلات (ص 47–51) · u2-l2 إلكترونيات القدرة والبوابات (ص 52–53)
   u2-l3 التحكم والحماية (ص 54–56) · u2-l4 الآلات والمحولات (ص 57–60)
   Every symbol of the book's three-column tables is redrawn as SVG (one function per symbol below).
   Cells the book leaves empty are filled from IEC 60617 and tagged «إضافة من خارج الكتاب».
   Lab = tap-based matching «الوصف ↔ الرمز الرمزي ↔ الرمز التنفيذي». */
(function(B){
"use strict";

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('drw-u2-css'))return;const s=document.createElement('style');s.id='drw-u2-css';s.textContent=`
svg.u2s{stroke:var(--fg);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;overflow:visible;display:block;margin:0 auto;max-width:100%;height:auto}
svg.u2s .f{fill:var(--fg)}
svg.u2s .o{fill:var(--surface)}
svg.u2s .dt{stroke-dasharray:2 3;stroke-width:1.6}
svg.u2s .dd{stroke-dasharray:9 3 2 3;stroke-width:1.4}
svg.u2s .tn{stroke-width:1.3}
svg.u2s .tk{stroke-width:4}
svg.u2s text{fill:var(--fg);stroke:none;font-family:Arial,Helvetica,sans-serif;font-size:12px}
svg.u2s text.it{font-style:italic;font-weight:700;font-family:'Times New Roman',serif;font-size:17px}
svg.u2s text.bf{font-weight:700;font-family:'Times New Roman',serif}
svg.u2s .hl{stroke:var(--live);stroke-width:3.2}
svg.u2s .hlf{fill:var(--live);stroke:var(--live)}
svg.u2s .hlb{fill:var(--live-soft);stroke:var(--live)}
.u2tw{margin-top:10px}
table.u2t{width:100%;border-collapse:collapse;font-size:14px;table-layout:fixed}
table.u2t th{background:var(--head);color:#fff;font-weight:600;padding:7px 6px;font-size:13px;text-align:center;line-height:1.5}
table.u2t td{border:1px solid var(--line);padding:6px 5px;text-align:center;vertical-align:middle;line-height:1.6}
table.u2t th:first-child{width:30%}
table.u2t td:first-child{text-align:start;padding-inline-start:8px}
table.u2t td.u2add{background:var(--tg-add-bg);outline:1.5px dashed var(--tg-add-line);outline-offset:-4px}
table.u2t td.u2add svg.u2s .o{fill:var(--tg-add-bg)}
table.u2t .tg{white-space:normal;margin-top:5px;font-size:11px;padding:1px 7px;line-height:1.4}
table.u2t td.u2txt{font-size:13px;text-align:start;color:var(--fg)}
table.u2t td .u2same{display:block;font-size:11.5px;color:var(--muted)}
.u2leg{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;font-size:13px;color:var(--muted);margin-top:8px}
.u2pw .u2pb{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.u2pw .u2pb button{min-width:42px;min-height:40px;border:1.5px solid var(--line);border-radius:10px;background:var(--surface);color:var(--fg);font:600 15px var(--mono);cursor:pointer}
.u2pw .u2pb button[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.u2pw .u2pbox{max-width:420px;margin:10px auto 0}
.u2m .mrow{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:10px}
.u2m .seg{flex-wrap:wrap;max-width:100%}
.u2m .mstat{font-size:14px;color:var(--muted)}
.u2m .mstat b{color:var(--fg);font-family:var(--mono)}
.u2m .mboard{display:grid;grid-template-columns:repeat(var(--nc),minmax(0,1fr));gap:14px;margin-top:12px}
@media(max-width:720px){.u2m .mboard{grid-template-columns:minmax(0,1fr)}}
.u2m .mcol h3{font-size:14px;margin:0 0 6px;color:var(--muted);font-weight:600}
.u2m .mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.u2m .mt{position:relative;min-height:88px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--fg);font:inherit;font-size:14px;padding:10px 8px;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.55;touch-action:manipulation;min-width:0;-webkit-tap-highlight-color:transparent}
.u2m .mt svg.u2s{max-height:118px;width:auto}
.u2m .mt.tx{font-size:12.5px;line-height:1.6}
.u2m .mt[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-soft);box-shadow:inset 0 0 0 2px var(--blue)}
.u2m .mt.ok{border-color:var(--on);background:var(--on-soft);cursor:default}
.u2m .mt.no{border-color:var(--stop);background:var(--stop-soft);animation:u2shake .35s}
.u2m .mt .bd{position:absolute;top:4px;inset-inline-start:6px;font:700 12px var(--mono);background:var(--on);color:#fff;border-radius:99px;padding:0 7px;line-height:1.6}
.u2m .mt .ad{position:absolute;bottom:3px;inset-inline-end:6px;font-size:10.5px;color:var(--tg-add);font-weight:600}
.u2m .mfb{margin-top:12px}
.u2m .mtry{margin:6px 0 0;padding-inline-start:4px;list-style:none}
.u2m .mtry li{margin:5px 0;line-height:1.7}
.u2m .mtry li::before{content:"○";display:inline-block;width:22px;color:var(--muted)}
.u2m .mtry li.dn::before{content:"✓";color:var(--on);font-weight:700}
.u2m .mtry li.dn{color:var(--muted)}
@keyframes u2shake{0%,100%{transform:none}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
`;document.head.appendChild(s)})();

/* =====================================================================
   SVG primitives
   ===================================================================== */
const P=(d,c)=>`<path d="${d}"${c?` class="${c}"`:''}/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}"${c?` class="${c}"`:''}/>`;
const R=(x,y,w,h,c,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx?` rx="${rx}"`:''}${c?` class="${c}"`:''}/>`;
const T=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.c?` class="${o.c}"`:''}${o.s?` style="font-size:${o.s}px"`:''}>${t}</text>`};
const sv=(w,h,inner,lab)=>`<svg class="u2s" viewBox="0 0 ${w} ${h}" style="width:${Math.round(w*1.3)}px" role="img" aria-label="${lab||'رمز'}">${inner}</svg>`;
const term=(x,y)=>C(x,y,3.5,'o');                     // open terminal / detachable point
const dot=(x,y)=>C(x,y,3,'f');                         // connection point
const tickV=(x,y)=>P(`M${x-6} ${y+3}L${x+6} ${y-3}`);  // conductor-count slash on a vertical line
const tickH=(x,y)=>P(`M${x-3} ${y+6}L${x+3} ${y-6}`);  // … on a horizontal line
const ticksV=(x,y,n)=>{let s='';for(let i=0;i<n;i++)s+=tickV(x,y+i*5-(n-1)*2.5);return s};
const ticksH=(x,y,n)=>{let s='';for(let i=0;i<n;i++)s+=tickH(x+i*5-(n-1)*2.5,y);return s};
const head=(x1,y1,x2,y2,sz,open)=>{const a=Math.atan2(y2-y1,x2-x1),s=sz||7,p=(k)=>[(x2-s*Math.cos(a+k)).toFixed(1),(y2-s*Math.sin(a+k)).toFixed(1)];const [ax,ay]=p(0.42),[bx,by]=p(-0.42);return `<path d="M${x2} ${y2}L${ax} ${ay}L${bx} ${by}Z" class="${open?'o':'f'}"/>`};
const arrow=(x1,y1,x2,y2,sz)=>P(`M${x1} ${y1}L${x2} ${y2}`)+head(x1,y1,x2,y2,sz);
const wave=(x,y,w)=>{const h=w/4;return P(`M${x} ${y}q${h} ${-h*1.3} ${2*h} 0t${2*h} 0`)};   // «~»
/* switching contact, vertical: no = make, nc = break. returns {s,mx,my} (mx,my = point where a linkage meets the blade) */
function contact(x,y0,y1,nc){const yb=y1-14,yt=y0+(nc?14:12);
  if(nc)return {s:P(`M${x} ${y0}V${yt}H${x+9}`)+P(`M${x} ${y1}V${yb}L${x+12} ${y0+10}`),mx:x+6,my:(yb+y0+10)/2};
  return {s:P(`M${x} ${y0}V${yt}`)+P(`M${x} ${y1}V${yb}L${x-10} ${y0+16}`),mx:x-5,my:(yb+y0+16)/2}}
/* contact between two terminal circles (installation-switch style of the book) */
function contactO(x,yT,yB){return {s:term(x,yT)+P(`M${x} ${yT+3.5}V${yT+10}`)+P(`M${x} ${yB-3.5}L${x-9} ${yT+12}`)+term(x,yB),mx:x-4.5,my:(yB-3.5+yT+12)/2}}
const coilBox=(x,y,w,h)=>R(x,y,w||24,h||13);
const mc=(cx,cy,r,lab,o)=>{o=o||{};let s=C(cx,cy,r);const ty=o.sub?cy+1:cy+5;
  s+=T(cx,ty,lab,{c:'bf',s:o.fs||15});if(o.ul)s+=P(`M${cx-7} ${ty+4}H${cx+7}`,'tn');
  if(o.sub)s+=T(cx,cy+14,o.sub,{s:11});return s};
const brushes=(cx,cy,r)=>R(cx-3,cy-r-7,6,7,'f')+R(cx-3,cy+r,6,7,'f');

/* =====================================================================
   The symbols (keys used in the tables below)
   ===================================================================== */
const SY={
 /* ---- ص 48 ---- */
 dcS:()=>sv(80,40,P('M24 20H56','tk'),'تيار مستمر'),
 acS:()=>sv(80,40,`<g style="stroke-width:3">${wave(24,22,32)}</g>`,'تيار متردد'),
 dcW:()=>sv(70,56,C(35,28,20)+T(35,30,'G',{s:17})+P('M28 36H42'),'مولد تيار مستمر'),
 acW:()=>sv(70,56,C(35,28,20)+T(35,27,'G',{s:16})+wave(28,37,14),'مولد تيار متردد'),
 bat:()=>sv(100,50,P('M8 25H38M38 11V39M62 25H92M45 25H55M55 11V39')+P('M45 17V33M62 17V33','tk')+T(30,12,'+',{s:13})+T(72,12,'−',{s:13}),'بطارية'),
 earth:()=>sv(80,50,P('M40 6V28M24 28H56M30 35H50M36 42H44'),'أرضي'),
 res:()=>sv(100,46,P('M8 23H28M72 23H92')+R(28,15,44,16),'مقاومة'),
 resV:()=>sv(100,50,P('M8 25H28M72 25H92')+R(28,17,44,16)+arrow(32,44,70,7),'مقاومة متغيرة'),
 ind:()=>sv(100,40,P('M8 26H24a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H92'),'ملف'),
 indV:()=>sv(100,50,P('M8 30H24a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H92')+arrow(30,46,70,8),'ملف متغير'),
 /* ---- ص 49 ---- */
 cap:()=>sv(80,58,P('M40 4V24M24 24H56M24 33H56M40 33V54'),'مكثف'),
 capV:()=>sv(80,58,P('M40 4V24M24 24H56M24 33H56M40 33V54')+arrow(24,50,58,8),'مكثف متغير'),
 meterS:t=>sv(90,56,C(34,28,17)+T(34,33,t,{s:t.length>1?13:15})+P('M51 28H84')+ticksH(66,28,2),'جهاز قياس'),
 meterW:t=>sv(76,56,P('M4 28H21M55 28H72')+C(38,28,17)+T(38,33,t,{s:t.length>1?13:15}),'جهاز قياس'),
 kwhS:n=>sv(110,64,R(34,6,42,52)+P('M34 15H76')+T(55,34,'KWh',{s:11})+(n===3?T(55,51,'3~',{s:14}):wave(47,47,16))+P('M6 36H34M76 36H104')+ticksH(19,36,n===3?3:2)+ticksH(90,36,n===3?3:2),'عداد'),
 kwhW:n=>{const ys=n===3?[28,33,38,43]:[33,39];return sv(110,64,R(34,6,42,52)+P('M34 15H76')+T(55,34,'KWh',{s:11})+(n===3?T(55,51,'3~',{s:14}):wave(47,47,16))+ys.map(y=>P(`M12 ${y}H34M76 ${y}H98`)).join(''),'عداد')},
 sw1S:()=>sv(70,48,C(28,34,8)+P('M34 28L50 12L56 18'),'مفتاح مفرد'),
 sw2S:()=>sv(80,48,C(40,34,8)+P('M46 28L62 12L68 18M34 28L18 12L12 18'),'مفتاح مزدوج'),
 sw1W:()=>sv(78,58,swUnit(8)+P('M22 4H68V54H22Z','dd'),'مفتاح مفرد — دائرة تنفيذية'),
 sw2W:()=>sv(130,58,swUnit(6)+swUnit(62)+P('M18 4H120V54H18Z','dd'),'مفتاح مزدوج — دائرة تنفيذية'),
 /* ---- ص 50 ---- */
 sw3S:()=>sv(80,56,C(40,28,8)+P('M46 22L60 8L66 14M34 34L20 48L14 42'),'مفتاح طرف سلم'),
 sw4S:()=>sv(80,56,C(40,28,8)+P('M46 22L60 8L66 14M34 34L20 48L14 42M34 22L20 8L14 14M46 34L60 48L66 42'),'مفتاح وسط سلم'),
 sw3W:()=>{const x0=8,cx=x0+46;return sv(84,58,opLatch(x0,30,cx-6)+term(cx,46)+P(`M${cx} ${42.5}L${cx-8} 21`)+term(cx-8,12)+P(`M${cx-8} 15.5V20`)+term(cx+9,12)+P(`M${cx+9} 15.5V22`)+P('M24 4H74V54H24Z','dd'),'مفتاح طرف سلم — دائرة تنفيذية')},
 sw4W:()=>{const a=52,b=74;return sv(100,58,opLatch(6,30,a-3)+P(`M${a-3} 30H${b-3}`,'dt')+
   P(`M${a} 42.5L${a-6} 21M${b} 42.5L${b-6} 21`)+term(a,46)+term(b,46)+
   P(`M${a-6} 15.5V20M${a+6} 15V20M${b-6} 15.5V20M${b+6} 15V20`)+P(`M${a-6} 8.5V4H${b+6}V9`)+P(`M${a+6} 12H${b-6}`)+
   term(a-6,12)+dot(a+6,12)+term(b-6,12)+dot(b+6,12)+P('M24 2H92V56H24Z','dd'),'مفتاح وسط سلم — دائرة تنفيذية')},
 pushS:()=>sv(60,48,C(30,24,10)+C(30,24,4.5,'f'),'ضاغط'),
 pushW:()=>{const k=contactO(54,12,46);return sv(78,58,P('M16 22H10V38H16')+P(`M10 30H${k.mx}`,'dt')+k.s+P('M24 4H68V54H24Z','dd'),'ضاغط — دائرة تنفيذية')},
 jbox:()=>sv(80,58,C(40,26,14)+P('M6 26H74M40 26V54')+C(40,26,3.5,'f'),'علبة توزيع'),
 lamp:()=>sv(80,56,P('M6 28H22M58 28H74')+C(40,28,18)+P('M27.3 15.3L52.7 40.7M52.7 15.3L27.3 40.7'),'لمبة'),
 sockS:()=>sv(80,46,P('M24 24A16 16 0 0 0 56 24ZM40 24V6M26 16H54'),'بريزة'),
 sockW:()=>sv(80,58,[26,40,54].map(x=>term(x,13)+P(`M${x} 16.5V37M${x-7} 45A7 7 0 0 1 ${x+7} 45`)).join('')+P('M35 37H45')+P('M12 4H68V54H12Z','dd'),'بريزة — دائرة تنفيذية'),
 flS:w=>sv(100,46,P('M6 30H18M82 30H94M18 20V40M82 20V40')+P('M18 30H82','tk')+T(50,16,w+'W',{s:11}),'لمبة فلورسانت'),
 flW:w=>sv(200,110,
   P('M4 4H196V106H4Z','dd')+R(88,9,24,10,'f')+P('M83.5 14H88M112 14H116.5')+term(80,14)+term(120,14)+
   R(28,28,146,30,'',15)+P('M40 36A8 8 0 0 0 40 50')+P('M162 36A8 8 0 0 1 162 50')+
   P('M40 36H16')+term(12.5,36)+P('M40 50H24V92H88')+P('M162 36H184V14H123.5')+P('M162 50H180V92H112')+
   C(100,92,12)+C(94,93,2.2)+C(106,93,2.2)+P('M95.5 91.5Q100 85 104.5 91.5','tn')+T(101,48,w+'W  ×',{s:12}),'لمبة فلورسانت — دائرة تنفيذية'),
 starter:()=>sv(80,52,P('M6 26H26M54 26H74')+C(40,26,14)+C(33.5,27,2.4)+C(46.5,27,2.4)+P('M35 25Q40 17 45 25','tn'),'بادئ إضاءة'),
 chokeS:()=>sv(100,44,P('M8 30H22a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0a6 6 0 0 1 12 0H92M22 18H70'),'ملف خانق'),
 chokeW:()=>sv(100,40,term(18,20)+term(82,20)+P('M21.5 20H32M68 20H78.5')+R(32,14,36,12,'f'),'ملف خانق'),
 impS:()=>sv(80,50,R(16,10,48,30)+P('M26 20H38V30H54'),'مفتاح صدمة تيار'),
 impW:()=>{const k=contactO(74,12,52);return sv(96,64,coilBox(14,26,22,12)+P('M25 26V15.5M25 38V48.5')+term(25,12)+term(25,52)+P(`M36 32H${k.mx}`,'dt')+k.s+P('M6 4H90V60H6Z','dd'),'مفتاح صدمة تيار — دائرة تنفيذية')},
 bell:()=>sv(80,54,P('M20 32A20 20 0 0 1 60 32Z')+P('M32 32V50M48 32V50'),'جرس'),
 /* ---- ص 51 ---- */
 det:()=>sv(80,40,P('M6 20H33.5M46.5 20H74')+C(40,20,6.5,'o'),'نقطة قابلة للفك'),
 ndet:()=>sv(80,44,P('M6 18H74M40 18V40')+C(40,18,3.8,'f'),'نقطة غير قابلة للفك'),
 pn12S:()=>{let s=R(16,4,68,116)+R(30,16,40,90);for(let i=0;i<6;i++){const y=16+i*15;if(i)s+=P(`M30 ${y}H70`,'tn');s+=T(40,y+11.5,i+1,{s:10.5})+T(60,y+11.5,i+7,{s:10.5})}return sv(100,124,s+P('M50 16V106','tn'),'طبلون 12 قاطعاً — رمزي')},
 pn8S:()=>{let s=R(6,6,108,62)+R(20,18,80,38)+P('M20 37H100M40 18V56M60 18V56M80 18V56','tn');for(let i=0;i<4;i++)s+=T(30+i*20,32,i+1,{s:11})+T(30+i*20,51,i+5,{s:11});return sv(120,74,s,'طبلون 8 قواطع — رمزي')},
 pn12W:o=>pn12(o),
 pn8W:()=>{let s=R(4,4,192,162);s+=R(14,10,12,66,'',6);[0,1,2,3,4,5].forEach(i=>{const y=17+i*10.5;s+=i===0||i===5?C(20,y,3,'f'):C(20,y,3,'o')});
   for(let i=0;i<4;i++){s+=R(60+i*16,58,16,20)+T(68+i*16,72,i+1,{s:11});s+=R(80+i*16,110,16,20)+T(88+i*16,124,i+5,{s:11})}
   s+=term(24,90)+P('M27.5 90H128')+dot(76,90)+dot(108,90)+P('M76 90V78M108 90V78');
   s+=term(176,98)+P('M172.5 98H72')+dot(96,98)+dot(136,98)+P('M96 98V110M136 98V110');
   return sv(200,170,s,'طبلون 8 قواطع — دائرة تنفيذية')},
 /* ---- ص 52 ---- */
 diode:()=>sv(100,50,P('M6 25H36M58 25H94M58 13V37')+P('M36 13L58 25L36 37Z'),'دايود'),
 zener:()=>sv(100,50,P('M6 25H36M58 25H94M58 13V37H52')+P('M36 13L58 25L36 37Z'),'دايود زينر'),
 zener2:()=>sv(100,50,P('M4 25H20M64 25H96M42 13V37M42 13H48M42 37H36')+P('M20 13L42 25L20 37ZM64 13L42 25L64 37Z'),'دايودا زينر متقابلان'),
 photo:()=>sv(100,56,P('M6 34H36M58 34H94M58 22V46')+P('M36 22L58 34L36 46Z')+arrow(62,2,52,12,6)+arrow(72,2,62,12,6),'دايود ضوئي'),
 led:()=>sv(100,56,P('M6 34H36M58 34H94M58 22V46')+P('M36 22L58 34L36 46Z')+arrow(50,14,60,4,6)+arrow(60,14,70,4,6),'دايود مشع'),
 diac:()=>sv(100,64,P('M36 6V58M62 6V58M6 32H36M62 32H94')+P('M36 6L62 19L36 32ZM62 32L36 45L62 58Z'),'داياك'),
 thyK:()=>sv(100,56,P('M6 22H36M58 22H94M58 10V34')+P('M36 10L58 22L36 34Z')+P('M58 30L68 40V54'),'ثايرستور بوابة المهبط'),
 thyA:()=>sv(100,56,P('M6 22H36M58 22H94M58 10V34')+P('M36 10L58 22L36 34Z')+P('M44 30L32 40V54'),'ثايرستور بوابة المصعد'),
 pnp:()=>sv(80,62,P('M14 31H38M38 17V45M38 24L56 12V4M38 38L56 50V58')+head(56,50,41,40,7),'ترانزستور PNP'),
 npn:()=>sv(80,62,P('M14 31H38M38 17V45M38 24L56 12V4M38 38L56 50V58')+head(38,38,54,49,7),'ترانزستور NPN'),
 conv:(a,b)=>{const g=(k,x,y)=>k==='dc'?P(`M${x-6} ${y}H${x+6}`):wave(x-7,y+2,14);
   return sv(110,52,R(36,6,40,40)+P('M36 46L76 6')+g(a,47,17)+g(b,65,36)+P('M6 26H24M76 26H92')+head(6,26,34,26,9,1)+head(76,26,104,26,9,1),'محول إلكتروني')},
 gate:(t,n,neg)=>{let s=R(28,6,32,44)+T(44,t==='&'?33:32,t,{s:t==='&'?15:13});const ys=n===1?[28]:[16,28,40];ys.forEach(y=>s+=P(`M14 ${y}H28`));
   s+=neg?C(63.5,28,3.5,'o')+P('M67 28H78'):P('M60 28H78');return sv(90,56,s,'بوابة منطقية')},
 /* ---- ص 54–56 ---- */
 autoNO:()=>{const k=contact(56,4,56);return sv(80,60,k.s+P(`M12 ${k.my}H${k.mx}`)+P(`M18 ${k.my}L30 ${k.my-6}V${k.my+6}Z`),'مفتاح وصل برجوع تلقائي')},
 autoNC:()=>{const k=contact(52,4,56,1);return sv(80,60,k.s+P(`M12 ${k.my}H${k.mx}`)+P(`M18 ${k.my}L30 ${k.my-6}V${k.my+6}Z`),'مفتاح فصل برجوع تلقائي')},
 latNO:()=>{const k=contact(60,4,56);return sv(80,60,k.s+P(`M6 ${k.my}H22L26 ${k.my+8}L30 ${k.my}H${k.mx}`,'dt'),'مفتاح وصل بدون رجوع تلقائي')},
 latNC:()=>{const k=contact(56,4,56,1);return sv(80,60,k.s+P(`M6 ${k.my}H22L26 ${k.my+8}L30 ${k.my}H${k.mx}`,'dt'),'مفتاح فصل بدون رجوع تلقائي')},
 pushNO:()=>{const k=contact(56,4,56);return sv(80,60,k.s+P(`M22 ${k.my-8}H14V${k.my+8}H22`)+P(`M14 ${k.my}H${k.mx}`,'dt'),'ضاغط رجوع ذاتي')},
 lockNO:()=>{const k=contact(76,4,60);return sv(96,64,k.s+P(`M8 ${k.my-10}V${k.my+10}`)+P(`M8 ${k.my}H26M46 ${k.my}H${k.mx}`,'dt')+R(26,k.my-10,20,20)+P(`M36 ${k.my-10}V${k.my+10}M26 ${k.my}H46`),'مفتاح يدوي مع قفل')},
 mechNO:()=>{const k=contact(62,4,58);return sv(80,62,k.s+R(12,k.my-10,22,20)+P(`M34 ${k.my}H${k.mx}`,'dt'),'مفتاح تشغيل ميكانيكي')},
 nNO:()=>{const k=contact(66,4,58);return sv(84,62,k.s+R(10,k.my-10,30,20)+T(25,k.my+4.5,'n&gt;',{s:12})+P(`M40 ${k.my}H${k.mx}`,'dt'),'مفتاح طرد مركزي')},
 emNO:()=>{const k=contact(62,4,58);return sv(80,62,k.s+coilBox(8,k.my-7,26,14)+P(`M21 ${k.my-7}V8M21 ${k.my+7}V54`)+P(`M34 ${k.my}H${k.mx}`,'dt'),'مفتاح كهرومغناطيسي')},
 delay:(nc,arc,t)=>{const k=contact(nc?66:70,4,58,nc);const y=k.my,ax=46;const a=arc==='('?P(`M${ax+4} ${y-7}A7 7 0 0 0 ${ax+4} ${y+7}`):P(`M${ax-4} ${y-7}A7 7 0 0 1 ${ax-4} ${y+7}`);
   return sv(90,62,k.s+coilBox(6,y-7,24,14)+P(`M18 ${y-7}V10M18 ${y+7}V52`)+P(`M30 ${y}H${k.mx}`,'dt')+a+T(52,y+20,t,{s:12}),'مفتاح بتأخير زمني')},
 p3S:()=>sv(80,100,P('M40 4V36M34 30H46')+tickV(40,14)+T(54,16,'3',{s:12})+P('M18 30H62V80H18Z','dd')+P('M30 44L40 70V96M34 80H46'),'مفتاح قدرة ثلاثي — رمزي'),
 p3W:()=>{let s=P('M18 14H80V60H18Z','dd');[32,50,68].forEach(x=>{s+=P(`M${x} 4V22M${x-5} 26L${x} 46V70M${x-4} 14H${x+4}M${x-4} 60H${x+4}`)});s+=P('M6 36H66','dt');return sv(90,74,s,'مفتاح قدرة ثلاثي — تنفيذي')},
 brkS:()=>{const k=contact(84,4,70);return sv(110,100,k.s+tickV(84,14)+T(98,14,'3',{s:12})+P('M84 70V96')+P('M84 80H66')+head(84,80,58,80,9,1)+tickV(78,84)+T(78,98,'3',{s:12})+
   P(`M10 ${k.my-10}V${k.my+10}`)+P(`M10 ${k.my}H26M46 ${k.my}H${k.mx}`,'dt')+R(26,k.my-10,20,20)+P(`M36 ${k.my-10}V${k.my+10}M26 ${k.my}H46`),'قاطع بقفل ومطلق تيار زائد — رمزي')},
 brkW:()=>{let s='';const xs=[72,92,112];let my=0,mx=0;xs.forEach(x=>{const k=contact(x,4,62);s+=k.s;my=k.my;mx=k.mx});
   s+=P(`M10 ${my-10}V${my+10}`)+R(24,my-10,20,20)+P(`M34 ${my-10}V${my+10}M24 ${my}H44`)+P(`M10 ${my}H24M44 ${my}H${mx}`,'dt')+P(`M34 ${my+10}V70H62`,'dt');
   xs.forEach(x=>{s+=R(x-10,62,20,16)+T(x,75,'I&gt;',{c:'it',s:13})+P(`M${x} 78V94`)});return sv(126,98,s,'قاطع بقفل ومطلقات مغناطيسية — تنفيذي')},
 ctS:()=>{const k=contact(84,4,72);return sv(110,100,k.s+tickV(84,14)+T(98,14,'3',{s:12})+P('M84 72V96')+coilBox(20,k.my-7,30,14)+P(`M50 ${k.my}H${k.mx}`,'dt')+P('M50 82H60V76H68V82H84')+tickV(78,88)+T(76,100,'3',{s:12}),'كونتاكتور مع حراري — رمزي')},
 ctW:()=>{let s='';const xs=[72,92,112];let my=0,mx=0;xs.forEach(x=>{const k=contact(x,4,60);s+=k.s;my=k.my;mx=k.mx});
   s+=coilBox(8,my-8,30,15)+P(`M23 ${my-8}V4`)+P(`M38 ${my}H${mx}`,'dt');
   const n=contact(23,my+7,100,1);s+=n.s+P(`M${n.mx} ${n.my}H62`);
   xs.forEach(x=>{s+=R(x-10,60,20,16)+P(`M${x} 60V64H${x-5}V72H${x}V76`)+P(`M${x} 76V100`)});return sv(126,104,s,'كونتاكتور مع حراري — تنفيذي')},
 tOn:()=>sv(80,52,R(14,15,52,22)+R(14,15,20,22)+P('M14 15L34 37M34 15L14 37M44 4V15M44 37V48'),'مؤقت تأخير عند التوصيل'),
 tOff:()=>sv(80,52,R(14,15,52,22)+R(14,15,20,22,'f')+P('M44 4V15M44 37V48'),'مؤقت تأخير عند الفصل'),
 thr:()=>sv(80,52,R(18,12,44,28)+P('M40 2V18H30V34H40V50'),'متمم حراري'),
 iMaxS:()=>sv(70,52,P('M50 4V48M50 22H24')+head(50,22,18,22,9),'مطلق تيار زائد — رمزي'),
 iMinS:()=>sv(70,52,P('M50 4V48M16 22H40')+head(16,22,50,22,10),'مطلق تيار منخفض — رمزي'),
 uMinS:()=>sv(70,52,P('M50 4V48M16 22H42')+C(46,22,4,'o'),'مطلق جهد منخفض — رمزي'),
 relW:(t,fault)=>sv(80,56,P('M40 2V14M40 38V52')+R(16,14,48,24)+(fault?P('M23 26H29M29 20V32')+T(48,32,'U&lt;',{c:'it',s:17}):T(40,32,t,{c:'it',s:17})),'مطلق'),
 fuse:()=>sv(70,56,P('M35 4V52')+R(27,14,16,28),'مصهر'),
 /* ---- ص 57–60 ---- */
 tr2S:()=>sv(80,68,P('M40 4V14')+C(40,26,12)+C(40,42,12)+P('M40 54V64'),'محول أحادي الوجه — رمزي'),
 tr2W:()=>sv(80,56,R(20,14,40,9,'f')+R(20,30,40,9,'f')+P('M22 4V14M58 4V14M22 39V52M58 39V52'),'محول أحادي الوجه — تنفيذي'),
 trAdjS:()=>sv(80,84,P('M40 4V20')+ticksV(40,10,2)+C(40,32,12)+C(40,48,12)+P('M40 60V80')+ticksV(40,72,2)+P('M24 70L54 14Q58 4 64 9Q68 14 62 18'),'محول قابل للضبط — رمزي'),
 trAdjW:()=>sv(90,80,R(18,26,52,10,'f')+R(18,42,52,10,'f')+P('M20 6V26M68 6V26M20 52V74M68 52V74')+P('M30 70L54 18Q58 8 64 12Q68 17 62 21'),'محول قابل للضبط — تنفيذي'),
 autoS:()=>sv(80,72,P('M40 4V18Q40 26 50 26Q58 27 52 38')+C(40,44,12)+P('M40 56V68'),'محول ذاتي — رمزي'),
 autoW:()=>sv(84,56,R(20,18,44,12,'f')+P('M22 4V18M62 4V18M22 30V50M48 30V50'),'محول ذاتي — تنفيذي'),
 autoAdjS:()=>sv(84,76,P('M40 4V18Q40 26 50 26Q58 27 52 38')+C(40,44,12)+P('M40 56V72')+arrow(18,70,66,18,8),'محول ذاتي قابل للضبط — رمزي'),
 autoAdjW:()=>sv(84,64,R(20,24,44,12,'f')+P('M22 6V24M62 6V24M22 36V58M48 36V58')+arrow(28,56,54,8,8),'محول ذاتي قابل للضبط — تنفيذي'),
 auto3S:()=>sv(80,96,P('M40 4V24Q40 32 52 32Q60 34 52 48')+tickV(40,12)+T(54,12,'3',{s:12})+C(40,56,12)+P('M40 62V54M40 54L34 49M40 54L46 49')+P('M40 68V92')+tickV(40,82)+T(54,86,'3',{s:12}),'محول ذاتي ثلاثي نجمة — رمزي'),
 auto3W:()=>{let s='';[32,52,72].forEach(x=>{s+=R(x-4,22,8,28,'f')+P(`M${x} 6V22M${x} 50V76M${x-4} 40H${x-10}V76`)});s+=P('M18 32H84Q86 42 92 42Q98 42 98 34');return sv(104,80,s,'محول ذاتي ثلاثي نجمة — تنفيذي')},
 ydS:()=>sv(80,100,P('M40 4V18')+tickV(40,10)+T(54,10,'3',{s:12})+C(40,30,12)+C(40,52,12)+P('M40 31V24M40 31L34.5 36M40 31L45.5 36')+P('M40 46L34.5 56H45.5Z','tn')+P('M40 64V96')+tickV(40,84)+T(54,90,'3',{s:12}),'محول نجمة/دلتا — رمزي'),
 ydW:()=>{let s='';[30,50,70].forEach(x=>{s+=R(x-5,14,10,22,'f')+P(`M${x} 4V14M${x} 36V40`)});s+=P('M30 40H70');
   [30,50,70].forEach(x=>{s+=R(x-5,52,10,22,'f')+P(`M${x} 74V94`)});s+=P('M30 74H36L42 50H50V52M50 74H56L62 50H70V52M30 52V46H82V74H70');return sv(96,98,s,'محول نجمة/دلتا — تنفيذي')},
 ctrS:()=>sv(90,68,P('M40 4V22M40 46V64')+C(40,34,12)+P('M38 16A18 18 0 0 0 38 52')+P('M52 34H84')+ticksH(68,34,2),'محول تيار — رمزي'),
 ctrW:()=>sv(70,68,P('M28 4V64','tn')+P('M42 4V18M42 50V64')+R(38,18,8,32,'f'),'محول تيار — تنفيذي'),
 vtS:()=>sv(80,72,P('M40 4V23')+ticksV(40,11,2)+P('M24 30A16 16 0 0 1 56 30')+C(40,34,11)+P('M40 45V68'),'محول جهد — رمزي'),
 vtW:()=>sv(80,60,R(24,12,8,36,'f')+R(48,12,8,36,'f')+P('M12 12H32M12 48H32M48 12H68M48 48H68'),'محول جهد — تنفيذي'),
 mS:(l,o)=>sv(70,56,mc(35,28,22,l,o),'آلة كهربائية'),
 dcMW:l=>sv(80,82,mc(40,41,18,l,{ul:1})+brushes(40,41,18)+P('M40 16V4M40 66V78')+T(22,20,'A1',{s:11})+T(22,72,'A2',{s:11}),'آلة تيار مستمر — تنفيذي'),
 ac3W:l=>sv(80,82,P('M27 14V33M40 14V26M53 14V33')+mc(40,46,20,l,{sub:'3~'})+T(27,10,'U',{s:11})+T(40,10,'V',{s:11})+T(53,10,'W',{s:11}),'آلة ثلاثية الأوجه — تنفيذي'),
 ac1W:()=>sv(80,82,P('M32 4V28M48 4V28')+mc(40,46,20,'M',{sub:'1~'})+T(20,12,'U1',{s:11})+T(62,12,'U2',{s:11}),'محرك أحادي الوجه — تنفيذي'),
 sepS:l=>sv(70,78,P('M28 4V45M42 4V45')+ticksV(28,14,2)+ticksV(42,26,2)+mc(35,58,17,l,{ul:1}),'آلة منفصلة التغذية — رمزي'),
 sepW:(l,gErr)=>sv(112,92,mc(36,52,16,l,{ul:1})+brushes(36,52,16)+P('M36 29V4M36 75V84H98V4')+R(58,40,32,11,'f')+P('M60 40V12M88 40V12')+
   T(18,26,'A1',{s:11})+T(18,82,'A2',{s:11})+T(60,9,'F1',{s:11})+T(86,9,'F2',{s:11})+(gErr?T(102,14,'G',{c:'bf',s:13})+P('M90 18H110','tn'):''),'آلة منفصلة التغذية — تنفيذي'),
 shS:l=>sv(70,80,P('M30 4V47')+dot(30,24)+P('M30 24H44V48')+ticksV(30,12,2)+ticksV(44,36,2)+mc(36,60,17,l,{ul:1}),'آلة توازي — رمزي'),
 shW:l=>sv(112,92,mc(36,52,16,l,{ul:1})+brushes(36,52,16)+P('M36 29V4M36 75V82H98V4')+dot(36,16)+P('M36 16H84V44')+R(58,44,28,11,'f')+P('M60 55V82')+dot(60,82)+
   T(18,26,'A1',{s:11})+T(18,82,'A2',{s:11})+T(74,40,'E2',{s:11})+T(72,72,'E1',{s:11}),'آلة توازي — تنفيذي'),
 seS:(l,noUl)=>sv(70,78,P('M35 4V41')+ticksV(35,16,2)+mc(35,58,17,l,{ul:!noUl}),'آلة توالي — رمزي'),
 seW:l=>sv(112,92,mc(36,52,16,l,{ul:1})+brushes(36,52,16)+P('M36 29V4M36 75V82H90V55M58 44V4')+R(58,44,32,11,'f')+
   T(18,26,'A1',{s:11})+T(18,82,'A2',{s:11})+T(72,14,'D2',{s:11})+T(80,70,'D1',{s:11}),'آلة توالي — تنفيذي'),
 cpW:l=>sv(124,92,mc(30,52,16,l,{ul:1})+brushes(30,52,16)+P('M30 29V4M30 75V84H112V56')+P('M30 14H72V44')+R(48,44,26,11,'f')+P('M48 55V66H82')+P('M82 4V66')+R(82,44,30,11,'f')+
   T(13,26,'A1',{s:11})+T(13,82,'A2',{s:11})+T(64,40,'E1',{s:11})+T(58,76,'E2',{s:11})+T(96,14,'D2',{s:11})+T(102,70,'D1',{s:11}),'آلة مركبة — تنفيذي'),
 capRunS:()=>sv(80,96,P('M22 4V62M38 4V58')+dot(38,14)+P('M38 14H54V30M46 30H62M46 36H62M54 36V60')+mc(38,74,17,'M',{sub:'1~'})+T(14,10,'U1',{s:11})+T(50,10,'U2',{s:11}),'محرك بمكثف تشغيل — رمزي'),
 capRunW:()=>sv(124,104,P('M14 4V64H45M45 4V30')+dot(45,14)+R(40,30,10,34,'f')+P('M45 64H66V78')+R(64,78,36,11,'f')+P('M45 14H102V38M94 38H110M94 45H110M102 45V78')+mc(30,88,11,'M',{fs:12})+
   T(8,10,'U1',{s:11})+T(56,10,'U2',{s:11})+T(74,73,'Z1',{s:11})+T(112,73,'Z2',{s:11}),'محرك بمكثف تشغيل — تنفيذي'),
 capSRS:()=>sv(84,96,P('M22 4V62M38 4V58')+dot(38,14)+P('M38 14H66M50 14V30M42 30H58M42 36H58M66 14V28M56 28H76M56 37H76M59 37V33M73 37V33M66 37V44H50M50 36V60')+mc(38,74,17,'M',{sub:'1~'})+T(14,10,'U1',{s:11})+T(50,10,'U2',{s:11}),'محرك بمكثف بدء وتشغيل — رمزي'),
 capSRW:()=>{const k=contact(104,14,56,1);return sv(150,108,P('M14 4V64H45M45 4V30')+dot(45,14)+R(40,30,10,34,'f')+P('M45 64H66V80')+R(66,80,36,11,'f')+P('M102 85H134')+P('M45 14H134V62M126 62H142M126 69H142M134 69V85')+
   k.s+R(64,k.my-8,26,16)+T(77,k.my+4,'n&gt;',{s:11})+P(`M90 ${k.my}H${k.mx}`,'dt')+P('M104 56V62M96 62H112M96 69H112M104 69V85')+mc(30,90,11,'M',{fs:12})+
   T(8,10,'U1',{s:11})+T(56,10,'U2',{s:11})+T(72,104,'Z2',{s:11})+T(98,104,'Z1',{s:11}),'محرك بمكثف بدء وتشغيل — تنفيذي')},
 starS:()=>sv(80,84,P('M28 4V42M40 4V40M52 4V42')+C(40,58,18)+T(40,57,'M',{c:'bf',s:14})+T(34,71,'3~',{s:10})+P('M51 66V62M51 66L47 69M51 66L55 69','tn'),'محرك ثلاثي نجمة — رمزي'),
 deltaS:()=>sv(80,84,P('M28 4V42M40 4V40M52 4V42')+C(40,58,18)+T(40,57,'M',{c:'bf',s:14})+T(34,71,'3~',{s:10})+P('M51 61L46.5 69H55.5Z','tn'),'محرك ثلاثي دلتا — رمزي'),
 starW:()=>{const cx=50,cy=52,g=a=>`<g transform="rotate(${a} ${cx} ${cy})">${P(`M${cx} ${cy}V${cy-40}`)}${R(cx-4,cy-34,8,20,'f')}</g>`;return sv(100,100,g(0)+g(120)+g(240)+C(cx,cy,3.5,'f')+C(50,80,7)+T(50,83.5,'M',{c:'bf',s:9})+T(58,14,'U',{s:12})+T(10,80,'V',{s:12})+T(90,80,'W',{s:12}),'محرك ثلاثي نجمة — تنفيذي')},
 deltaW:()=>{const A=[50,40],L=[26,76],Rr=[74,76];const side=(p,q)=>{const a=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI,mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;return P(`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`)+`<g transform="rotate(${a.toFixed(1)} ${mx} ${my})">${R(mx-11,my-4,22,8,'f')}</g>`};
   return sv(100,104,side(A,L)+side(A,Rr)+side(L,Rr)+P('M26 6V76M50 6V40M74 6V76')+C(50,92,7)+T(50,95.5,'M',{c:'bf',s:9})+T(32,10,'U',{s:12})+T(56,10,'V',{s:12})+T(80,10,'W',{s:12}),'محرك ثلاثي دلتا — تنفيذي')}
};
/* the operator + latch used in the book's installation switches (ص 49–50) */
function opLatch(x0,y,toX){return P(`M${x0} ${y-12}V${y+12}M${x0} ${y}H${x0+6}`)+P(`M${x0+6} ${y}H${x0+16}`,'dt')+P(`M${x0+16} ${y}H${x0+20}L${x0+24} ${y+8}L${x0+28} ${y}H${toX}`)}
function swUnit(x0){const cx=x0+46,k=contactO(cx,12,46);return opLatch(x0,k.my,k.mx)+k.s}
/* 12-way three-phase panel (ص 51). o.hl = breaker number to highlight */
const PH=[0,1,2,0,1,2],BARX=[100,122,144];
function pn12(o){o=o||{};const hl=o.hl||0,hr=hl?((hl-1)%6):-1,hp=hr>=0?PH[hr]:-1;let s=R(4,4,242,312);
  s+=R(14,22,14,96,'',7);for(let i=0;i<6;i++){const y=32+i*15.5;s+=C(21,y,4.2)+P(`M18.5 ${y+2.5}L23.5 ${y-2.5}`,'tn')}
  s+=P('M21 300V126')+head(21,300,21,120,8)+T(12,312,'N',{s:12});
  BARX.forEach((x,j)=>{s+=P(`M${x} 30V224`,hp===j?'hl':'')});
  for(let i=0;i<6;i++){const y=30+i*30,on=i===hr;s+=P(`M66 ${y}H184`,on?'hl':'');s+=R(40,y-9,26,18,on&&hl===i+1?'hlb':'')+T(53,y+4.5,i+1,{s:12})+R(184,y-9,26,18,on&&hl===i+7?'hlb':'')+T(197,y+4.5,i+7,{s:12});
    s+=C(BARX[PH[i]],y,4,on?'hlf':'f')}
  BARX.forEach((x,j)=>{s+=C(x,228,3.5,hp===j?'hlf':'f')+P(`M${x-9} 234L${x} 256`)+C(x,262,3.5,hp===j?'hlf':'f')});
  s+=P('M58 233V257M58 245H64')+P('M64 245H68L72 252L76 245H140','dt');
  s+=P('M40 290H100V267',hp===0?'hl':'')+head(100,290,100,266,8)+P('M122 304V267',hp===1?'hl':'')+head(122,304,122,266,8)+P('M206 290H144V267',hp===2?'hl':'')+head(144,290,144,266,8);
  s+=T(30,294,'L1',{s:12})+T(134,308,'L2',{s:12})+T(220,294,'L3',{s:12});
  return sv(250,320,s,'طبلون ثلاثي الأوجه 12 قاطعاً — دائرة تنفيذية')}

/* =====================================================================
   The tables — rows exactly as printed (description, symbolic, wiring)
   s / w : html of the symbol; sA / wA : cell is an addition from IEC 60617; wT : the book prints text instead of a symbol
   same : the book draws the same symbol in both columns
   ===================================================================== */
const r=(d,s,w,o)=>Object.assign({d,s,w},o||{});
const TAB={
 t48:{ref:'ص 48',rows:[
  r('مصدر تيار مستمر',SY.dcS(),SY.dcW(),{sA:1,tip:'العلامة «—» تعني تيار مستمر و«~» تعني تيار متردد. الحرف G يعني مولّداً (مصدراً).'}),
  r('مصدر تيار متردد',SY.acS(),SY.acW()),
  r('بطارية أو منبع قدرة تيار مستمر',SY.bat(),SY.bat(),{sA:1,wA:1,tip:'الخط الطويل هو القطب الموجب والقصير السميك هو السالب؛ كل زوج خلية.'}),
  r('نقطة توصيل أرضي',SY.earth(),SY.earth(),{sA:1,wA:1}),
  r('مقاومة',SY.res(),SY.res(),{sA:1,wA:1}),
  r('مقاومة متغيرة القيمة',SY.resV(),SY.resV(),{sA:1,wA:1,tip:'السهم المائل الذي يخترق الرمز يعني «قابل للتغيير».'}),
  r('ملف',SY.ind(),SY.ind(),{sA:1,wA:1}),
  r('ملف متغير القيمة',SY.indV(),SY.indV(),{sA:1,wA:1})]},
 t49:{ref:'ص 49',rows:[
  r('مكثف',SY.cap(),SY.cap(),{same:1}),
  r('مكثف متغير القيمة',SY.capV(),SY.capV(),{same:1}),
  r('مقياس تيار ( أمبير ميتر )',SY.meterS('A'),SY.meterW('A'),{tip:'في الرمزية خط واحد عليه شرطتان (سلكان)، وفي التنفيذية يظهر طرفا الجهاز.'}),
  r('مقياس فولت ( فولت ميتر )',SY.meterS('V'),SY.meterW('V')),
  r('مقياس أوم ( أوم ميتر )',SY.meterS('Ω'),SY.meterW('Ω')),
  r('مقياس قدرة ( وات ميتر )',SY.meterS('W'),SY.meterW('W')),
  r('مقياس تردد ( هرتز )',SY.meterS('Hz'),SY.meterW('Hz')),
  r('عداد تيار متردد ( أحادي الوجه )',SY.kwhS(1),SY.kwhW(1),{tip:'أحادي الوجه: شرطتان في الرمزية = خطان في التنفيذية من كل جانب.'}),
  r('عداد تيار متردد ( ثلاثي الوجه )',SY.kwhS(3),SY.kwhW(3),{tip:'ثلاثي الوجه: ثلاث شرطات في الرمزية، وأربعة خطوط (ثلاثة أطوار + التعادل) في التنفيذية.'}),
  r('مفتاح مفرد',SY.sw1S(),SY.sw1W(),{tip:'في التنفيذية: مشغّل يدوي ← وصلة ← حجز ← ملامس مفتوح بين طرفين، داخل إطار الجهاز.'}),
  r('مفتاح مزدوج',SY.sw2S(),SY.sw2W(),{tip:'ذراعان في الرمزية = ملامسان مستقلان في التنفيذية.'})]},
 t50:{ref:'ص 50',rows:[
  r('مفتاح طرف سلم',SY.sw3S(),SY.sw3W(),{sA:1,tip:'ملامس قلاب: طرف مشترك يتحوّل بين طرفين.'}),
  r('مفتاح وسط سلم',SY.sw4S(),SY.sw4W(),{sA:1}),
  r('ضاغط',SY.pushS(),SY.pushW(),{sA:1,tip:'الضاغط بلا رمز حجز: يرجع وحده عند ترك الزر.'}),
  r('علبة توزيع',SY.jbox(),SY.jbox(),{sA:1,wA:1}),
  r('لمبة',SY.lamp(),SY.lamp(),{sA:1,wA:1}),
  r('بريزة أحادية الوجه',SY.sockS(),SY.sockW(),{sA:1,tip:'ثلاثة أطراف: الطور والمحايد والأرضي.'}),
  r('لمبة فلورسانت ٢٠ وات',SY.flS(20),SY.flW(20),{sA:1,tip:'التنفيذية تُظهر الأنبوب وفتيلتيه والملف الخانق والبادئ.'}),
  r('لمبة فلورسانت ٤٠ وات',SY.flS(40),SY.flW(40),{sA:1}),
  r('بادئ إضاءة ( ستارتر )',SY.starter(),SY.starter(),{sA:1,wA:1}),
  r('ملف خانق',SY.chokeS(),SY.chokeW(),{sA:1,wA:1}),
  r('مفتاح صدمة تيار',SY.impS(),SY.impW(),{tip:'كل نبضة تيار في الملف تقلب حالة الملامس.'}),
  r('جرس كهربائي',SY.bell(),SY.bell(),{sA:1,wA:1})]},
 t51:{ref:'ص 51',rows:[
  r('نقطة قابلة للفك',SY.det(),SY.det(),{sA:1,wA:1,tip:'دائرة صغيرة مفرغة = طرف يُفك (مثل برغي التوصيل).'}),
  r('نقطة غير قابلة للفك',SY.ndet(),SY.ndet(),{sA:1,wA:1,tip:'نقطة مصمتة = توصيل ثابت.'}),
  r('طبلون ثلاثي الأوجه ١٢ قاطع فرعي مع قاطع رئيس وخط التعادل ( N )',SY.pn12S(),SY.pn12W(),{big:1,tip:'القواطع الفرعية موزعة بالتناوب على L1 وL2 وL3.'}),
  r('طبلون ثنائي الخط ٨ قواطع فرعية مع خط التعادل ( N )',SY.pn8S(),SY.pn8W(),{big:1})]},
 t52:{ref:'ص 52',rows:[
  r('دايود',SY.diode(),SY.diode(),{same:1,tip:'السهم (المثلث) يشير إلى اتجاه مرور التيار؛ الخط عند رأسه هو المهبط.'}),
  r('دايود زينر',SY.zener(),SY.zener(),{same:1}),
  r('دايود زينر متقابلان',SY.zener2(),SY.zener2(),{same:1}),
  r('دايود ضوئي',SY.photo(),SY.photo(),{same:1,tip:'السهمان داخلان: الضوء يسقط عليه.'}),
  r('دايود مشع',SY.led(),SY.led(),{same:1,tip:'السهمان خارجان: هو الذي يُطلق الضوء.'}),
  r('داياك',SY.diac(),SY.diac(),{same:1}),
  r('ثايرستور قابل للتحكم من جهة المهبط',SY.thyK(),SY.thyK(),{same:1,tip:'البوابة تخرج من جهة المهبط (الخط).'}),
  r('ثايرستور قابل للتحكم من جهة المصعد',SY.thyA(),SY.thyA(),{same:1,tip:'البوابة تخرج من جهة المصعد (قاعدة المثلث).'}),
  r('ترانزستور PNP',SY.pnp(),SY.pnp(),{same:1,tip:'PNP: سهم الباعث داخل نحو القاعدة.'}),
  r('ترانزستور NPN',SY.npn(),SY.npn(),{same:1,tip:'NPN: سهم الباعث خارج من القاعدة.'}),
  r('محول جهد مستمر',SY.conv('dc','dc'),SY.conv('dc','dc'),{same:1}),
  r('محول ( مقوم عكسي )',SY.conv('dc','ac'),SY.conv('dc','ac'),{same:1,tip:'الأعلى «—» والأسفل «~»: من مستمر إلى متردد.'}),
  r('جهاز إمداد بالتيار ( محول )',SY.conv('ac','dc'),SY.conv('ac','dc'),{same:1,tip:'الأعلى «~» والأسفل «—»: من متردد إلى مستمر.'})]},
 t53:{ref:'ص 53',rows:[
  r('بوابة " و " AND',SY.gate('&amp;',3),SY.gate('&amp;',3),{same:1}),
  r('بوابة " أو " OR',SY.gate('≥1',3),SY.gate('≥1',3),{same:1}),
  r('بوابة " لا " Not',SY.gate('1',1,1),SY.gate('1',1,1),{same:1,tip:'الدائرة الصغيرة على الخرج تعني النفي.'}),
  r('بوابة " و منفية " NAND',SY.gate('&amp;',3,1),SY.gate('&amp;',3,1),{same:1}),
  r('بوابة " أو منفية " NOR',SY.gate('≥1',3,1),SY.gate('≥1',3,1),{same:1})]},
 t54:{ref:'ص 54',rows:[
  r('مفتاح وصل برجوع تلقائي',SY.autoNO(),SY.autoNO(),{same:1,tip:'المثلث الصغير = رجوع تلقائي.'}),
  r('مفتاح فصل برجوع تلقائي',SY.autoNC(),SY.autoNC(),{same:1}),
  r('مفتاح وصل بدون رجوع تلقائي',SY.latNO(),SY.latNO(),{same:1,tip:'رمز الحجز ∨ على الوصلة = يبقى في وضعه.'}),
  r('مفتاح فصل بدون رجوع تلقائي',SY.latNC(),SY.latNC(),{same:1}),
  r('مفتاح تشغيل يدوي ( ضاغط ) رجوع ذاتي',SY.pushS(),SY.pushNO()),
  r('مفتاح تشغيل يدوي مع قفل تشغيل',SY.lockNO(),SY.lockNO(),{same:1}),
  r('مفتاح تشغيل ميكانيكي',SY.mechNO(),SY.mechNO(),{same:1}),
  r('مفتاح تشغيل ميكانيكي يعمل بالقوة الطاردة المركزية',SY.nNO(),SY.nNO(),{same:1}),
  r('مفتاح مع تشغيل كهرومغناطيسي',SY.emNO(),SY.emNO(),{same:1}),
  r('مفتاح وصل تشغيل متأخر',SY.delay(0,'(','5s'),'مفتاح الوصل يغلق بعد خمس ثوانٍ من وصل التيار لملف التشغيل',{wT:1}),
  r('مفتاح وصل لتشغيل متأخر',SY.delay(0,')','3s'),'عند وصول التيار للملف يصل النقاط ويستمر في التوصيل ثم يفصل بعد ثلاث ثوانٍ ثم فصل الملف',{wT:1,fix:'المقصود: يصل فور وصول التيار للملف، ويبقى موصولاً بعد فصل الملف ثلاث ثوانٍ ثم يفصل (تأخير عند الفصل).'}),
  r('مفتاح فصل تشغيل متأخر',SY.delay(1,')','3s'),'مفتاح الفصل يفصل فوراً لكنه يوصل من جديد بعد ثلاث ثوانٍ من فصل الملف',{wT:1})]},
 t55:{ref:'ص 55',rows:[
  r('مفتاح فصل تشغيل متأخر',SY.delay(1,'(','5s'),'مفتاح الفصل يفصل بعد خمس ثوانٍ من وصول التيار للملف',{wT:1}),
  r('مفتاح قدرة ثلاثي',SY.p3S(),SY.p3W(),{tip:'شرطة مائلة و3 على خط واحد = ثلاثة خطوط (ثلاثة أقطاب).'}),
  r('مفتاح قابض مع قاطع كهرومغناطيسي بوقاية من زيادة التيار',SY.brkS(),SY.brkW()),
  r('مفتاح تلامس مع قاطع حراري عند زيادة التيار',SY.ctS(),SY.ctW(),{tip:'الحراري يفتح ملامساً على التوالي مع الملف فيفصل الكونتاكتور.'}),
  r('مؤقت زمني يؤخر عند التوصيل',SY.tOn(),SY.tOn(),{same:1,tip:'مربع بداخله X = تأخير عند التوصيل.'}),
  r('مؤقت زمني يؤخر عند الفصل',SY.tOff(),SY.tOff(),{same:1,tip:'مربع مصمت = تأخير عند الفصل.'}),
  r('متمم حراري يعمل عند زيادة الحمل',SY.thr(),SY.thr(),{same:1}),
  r('قاطع كهرومغناطيسي ضد زيادة التيار الزائد',SY.iMaxS(),SY.relW('I &gt;'),{tip:'I&gt; : يعمل إذا زاد التيار عن الحد.'}),
  r('قاطع كهرومغناطيسي ضد التيار المنخفض',SY.iMinS(),SY.relW('I&lt;')),
  r('قاطع عند الجهد المنخفض',SY.uMinS(),SY.relW('U&lt;'),{tip:'U&lt; : يفصل إذا انخفض الجهد.'})]},
 t56:{ref:'ص 56',rows:[
  r('قاطع عند جهد الخلل',SY.relW('',1),SY.relW('',1),{sA:1}),
  r('مصهر',SY.fuse(),SY.fuse(),{sA:1,wA:1})]},
 t57:{ref:'ص 57',rows:[
  r('محول آحادي الوجه بملفين منفصلين',SY.tr2S(),SY.tr2W(),{tip:'دائرتان متداخلتان = ملفان؛ في التنفيذية كل ملف مستطيل أسود.'}),
  r('محول آحادي الوجه قابل للضبط على مراحل عند التشغيل',SY.trAdjS(),SY.trAdjW()),
  r('محول ذاتي',SY.autoS(),SY.autoW(),{tip:'ملف واحد يأخذ منه الخرج من نقطة وسطه.'}),
  r('محول ذاتي قابل للضبط',SY.autoAdjS(),SY.autoAdjW()),
  r('محول ذاتي ثلاثي الأوجه بتوصيل نجمه قابل للضبط',SY.auto3S(),SY.auto3W()),
  r('محول ثلاثي نجمة / دلتا',SY.ydS(),SY.ydW()),
  r('محول تيار',SY.ctrS(),SY.ctrW())]},
 t58:{ref:'ص 58',rows:[
  r('محول جهد',SY.vtS(),SY.vtW()),
  r('مولد تيار مستمر',SY.mS('G',{ul:1}),SY.dcMW('G'),{wA:1}),
  r('محرك تيار مستمر',SY.mS('M',{ul:1}),SY.dcMW('M'),{wA:1}),
  r('مولد تيار متردد ثلاثي الأوجه',SY.mS('G',{sub:'3~'}),SY.ac3W('G'),{wA:1}),
  r('محرك تيار متردد ثلاثي الأوجه',SY.mS('M',{sub:'3~'}),SY.ac3W('M'),{wA:1}),
  r('محرك تيار متردد آحادي الأوجه',SY.mS('M',{sub:'1~'}),SY.ac1W(),{wA:1}),
  r('مولد تيار مستمر منفصل التغذية',SY.sepS('G'),SY.sepW('G'),{tip:'دائرة المنتج (A1–A2) ودائرة المجال (F1–F2) منفصلتان.'}),
  r('محرك تيار مستمر منفصل التغذية',SY.sepS('M'),SY.sepW('M')),
  r('مولد تيار مستمر توازي',SY.shS('G'),SY.shW('G'),{tip:'ملف المجال E1–E2 على التوازي مع المنتج A1–A2.'}),
  r('مولد تيار مستمر توالي',SY.seS('G'),SY.seW('G'),{tip:'ملف المجال D1–D2 على التوالي مع المنتج.'})]},
 t59:{ref:'ص 59',rows:[
  r('محرك تيار مستمر توازي',SY.shS('M'),SY.shW('M'),{sA:1,wA:1}),
  r('محرك تيار مستمر توالٍ',SY.seS('M'),SY.seW('M')),
  r('مولد تيار مستمر مركب',SY.shS('G'),SY.cpW('G'),{tip:'ملفان للمجال: توازي E1–E2 وتوالي D1–D2.'}),
  r('محرك تيار مستمر مركب',SY.shS('M'),SY.cpW('M')),
  r('محرك تيار متردد أحادي الوجه مع مكثف تشغيل',SY.capRunS(),SY.capRunW(),{tip:'الملف الرئيس بين U1 وU2، والمساعد Z1–Z2 مع المكثف على التوالي.'}),
  r('محرك تيار متردد أحادي الوجه مع مكثف بدء ومكثف تشغيل',SY.capSRS(),SY.capSRW(),{tip:'مفتاح الطرد المركزي يفصل مكثف البدء بعد أن تكبر السرعة.'}),
  r('محرك تيار متردد ثلاثي الأوجه عضو دائر قفص سنجابي توصيلة نجمة',SY.starS(),SY.starW())]},
 t60:{ref:'ص 60',rows:[
  r('محرك تيار متردد ثلاثي الأوجه عضو دائر قفص سنجابي توصيلة دلتا',SY.deltaS(),SY.deltaW())]}
};
Object.keys(TAB).forEach(k=>TAB[k].rows.forEach((x,i)=>{x.id=k+'-'+i;x.ref=TAB[k].ref}));

const ADD_TAG='<span class="tg t-add">إضافة من خارج الكتاب</span>';
function tableHTML(key){const t=TAB[key];
  return `<div class="u2tw"><table class="u2t"><thead><tr><th>الوصف</th><th>الرمز في الدائرة الرمزية</th><th>الرمز في الدائرة التنفيذية</th></tr></thead><tbody>`+
   t.rows.map(x=>`<tr><td>${x.d}</td>`+
     `<td${x.sA?' class="u2add"':''}>${x.s}${x.sA?ADD_TAG:''}</td>`+
     (x.wT?`<td class="u2txt">${x.w}</td>`:`<td${x.wA?' class="u2add"':''}>${x.w}${x.wA?ADD_TAG:''}</td>`)+`</tr>`).join('')+`</tbody></table></div>`}
const LEGEND=`<div class="u2leg">${ADD_TAG}<span>خلية فارغة في الكتاب أكملناها من المواصفة الدولية IEC 60617 (أو من رسم آخر في الكتاب نفسه حيث ذُكر ذلك).</span></div>`;

/* =====================================================================
   Lab — tap-based symbol matching
   ===================================================================== */
function matchLab(el,B,o){
  const all=[].concat(...o.tables.map(k=>TAB[k].rows)),COL={d:'الوصف',s:'الرمز في الدائرة الرمزية',w:'الرمز في الدائرة التنفيذية'};
  const MODES=o.modes||[['ds','الوصف ↔ الرمزي'],['dw','الوصف ↔ التنفيذي'],['sw','الرمزي ↔ التنفيذي'],['dsw','الثلاثة معاً']];
  let mode=MODES[0][0],sect='all',round=[],cols=[],sel={},doneR=new Set(),matched=new Set(),miss=0,roundMiss=0,queue=[],revealed=false;
  const did={};
  const cols_=m=>m==='ds'?['d','s']:m==='dw'?['d','w']:m==='sw'?['s','w']:['d','s','w'];
  const pool=()=>all.filter(x=>(sect==='all'||x.ref===sect)&&!(mode==='sw'&&x.s===x.w));
  const key=(x,c)=>c==='d'?x.d:x[c];   // content key: identical-looking tiles are interchangeable
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const N=4;
  const tries=o.tries||[];
  el.innerHTML=`<div class="grid u2m">
   <div class="panel c12"><h2>مطابقة الرموز <small>مبنية على جداول ${o.pages}</small></h2>
    <p class="sub">${o.intro||'اضغط بطاقة من كل مجموعة لتكوّن زوجاً (أو ثلاثية): الوصف، ورمزه في الدائرة الرمزية، ورمزه في الدائرة التنفيذية. إذا كان الاختيار صحيحاً تثبت البطاقات باللون الأخضر ويظهر رقم الزوج.'}</p>
    <div class="mrow"><div><div class="sub">نوع المطابقة</div><div class="seg" role="group" id="mMode">${MODES.map(([v,l])=>`<button data-m="${v}" aria-pressed="${v===mode}">${l}</button>`).join('')}</div></div>
     ${o.tables.length>1?`<div><div class="sub">الجدول</div><div class="seg" role="group" id="mSect"><button data-s="all" aria-pressed="true">كل رموز الدرس</button>${o.tables.map(k=>`<button data-s="${TAB[k].ref}" aria-pressed="false">جدول ${TAB[k].ref}</button>`).join('')}</div></div>`:''}</div>
    <div class="mrow"><span class="mstat">طابقت <b id="mDone">0</b> من <b id="mAll">${all.length}</b> رمزاً · الأخطاء: <b id="mMiss">0</b></span>
     <button class="btn" id="mNext">جولة جديدة</button><button class="btn" id="mShow">أظهر الحل</button></div>
    <div class="mboard" id="mBoard"></div>
    <div class="callout mfb" id="mFb">ابدأ: اضغط بطاقة من أي مجموعة.</div>
   </div>
   <div class="panel c12"><h2>جرّب</h2><ul class="mtry" id="mTry"></ul>
    <p class="sub">البطاقات الموسومة «إضافة» رموز أكملناها من IEC 60617 لأن خانتها فارغة في الكتاب.</p></div>
  </div>`;
  const $=s=>el.querySelector(s),$$=s=>[...el.querySelectorAll(s)];
  const drawTry=()=>{$('#mTry').innerHTML=tries.map(t=>`<li class="${t.ok(did)?'dn':''}">${t.t}</li>`).join('')};
  const stat=()=>{$('#mDone').textContent=matched.size;$('#mAll').textContent=all.length;$('#mMiss').textContent=miss;did.all=matched.size>=all.length;drawTry()};
  function newRound(){const p=pool();if(!p.length){round=[];draw();return}
    if(!queue.length||!queue.every(x=>p.includes(x)))queue=shuffle(p.filter(x=>!matched.has(x.id))).concat(shuffle(p.filter(x=>matched.has(x.id))));
    round=[];while(round.length<Math.min(N,p.length)){if(!queue.length)queue=shuffle(p);const x=queue.shift();if(!round.includes(x))round.push(x)}
    cols=cols_(mode);sel={};doneR=new Set();roundMiss=0;revealed=false;
    const order={};cols.forEach(c=>order[c]=shuffle(round.map((x,i)=>i)));round.order=order;draw();
    $('#mFb').innerHTML=`جولة جديدة: ${round.length} ${round.length>2?'رموز':'رمز'}. اختر بطاقة من كل مجموعة.`;$('#mFb').className='callout mfb'}
  function tile(x,i,c){const ok=[...doneR].find(d=>d.tiles[c]===i);const pr=sel[c]===i;
    const cont=c==='d'?x.d:x[c],isTxt=c==='d'||(c==='w'&&x.wT),add=(c==='s'&&x.sA)||(c==='w'&&x.wA);
    return `<button type="button" class="mt${isTxt?' tx':''}${ok?' ok':''}" data-c="${c}" data-i="${i}" aria-pressed="${pr}"${ok?' disabled':''}>${ok?`<span class="bd">${ok.n}</span>`:''}${cont}${add?'<span class="ad">إضافة</span>':''}</button>`}
  function draw(){const b=$('#mBoard');b.style.setProperty('--nc',cols.length||2);
    if(!round.length){b.innerHTML='<p class="sub">لا رموز في هذا الاختيار.</p>';return}
    b.innerHTML=cols.map(c=>`<div class="mcol"><h3>${COL[c]}</h3><div class="mgrid">${round.order[c].map(i=>tile(round[i],i,c)).join('')}</div></div>`).join('');
    $$('#mBoard .mt').forEach(t=>t.addEventListener('click',()=>pick(t.dataset.c,+t.dataset.i)));stat()}
  function pick(c,i){if(revealed)return;if([...doneR].some(d=>d.tiles[c]===i))return;
    sel[c]=sel[c]===i?undefined:i;if(sel[c]===undefined)delete sel[c];
    if(cols.every(k=>sel[k]!==undefined)){
      // correct if some unmatched item of the round carries exactly these contents in every column
      const used=new Set([...doneR].map(d=>d.item));
      const hit=round.findIndex((x,j)=>!used.has(j)&&cols.every(k=>key(x,k)===key(round[sel[k]],k)));
      if(hit>=0){const n=doneR.size+1;doneR.add({item:hit,n,tiles:Object.assign({},sel)});matched.add(round[hit].id);const x=round[hit];
        $('#mFb').className='callout mfb';$('#mFb').innerHTML=`<b>صحيح (${n}).</b> ${x.d} <span class="sub">(جدول ${x.ref})</span>${x.tip?' — '+x.tip:''}${x.fix?` <span class="fixnote">${x.fix}</span>`:''}`;
        sel={};
        if(doneR.size===round.length){did[mode]=1;if(!roundMiss)did.clean=1;$('#mFb').innerHTML+=`<br><b>انتهت الجولة${roundMiss?` بخطأ ${roundMiss===1?'واحد':roundMiss}`:' بلا أخطاء'}.</b> اضغط «جولة جديدة».`}
        draw()}
      else{miss++;roundMiss++;const bad=cols.map(k=>sel[k]);
        $('#mFb').className='callout mfb err';$('#mFb').innerHTML='<b>ليست متطابقة.</b> '+wrongWhy(cols.map(k=>[k,round[sel[k]]]));
        sel={};draw();cols.forEach((k,j)=>{const t=$(`#mBoard .mt[data-c="${k}"][data-i="${bad[j]}"]`);if(t)t.classList.add('no')});
        setTimeout(()=>{$$('#mBoard .mt.no').forEach(t=>t.classList.remove('no'))},700)}
    } else draw()}
  function wrongWhy(pairs){const d=pairs.find(p=>p[0]==='d');if(d)return `بطاقة الوصف المختارة «${d[1].d}». ابحث عن رمزها.`;return 'الرمزان المختاران لعنصرين مختلفين. ابحث عن العنصر نفسه في الجهة الأخرى.'}
  $$('#mMode button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.m;$$('#mMode button').forEach(x=>x.setAttribute('aria-pressed',x===b));queue=[];newRound()}));
  $$('#mSect button').forEach(b=>b.addEventListener('click',()=>{sect=b.dataset.s;$$('#mSect button').forEach(x=>x.setAttribute('aria-pressed',x===b));queue=[];newRound()}));
  $('#mNext').addEventListener('click',newRound);
  $('#mShow').addEventListener('click',()=>{if(!round.length)return;revealed=true;const used=new Set([...doneR].map(d=>d.item));let n=doneR.size;
    round.forEach((x,j)=>{if(used.has(j))return;const t={};cols.forEach(c=>{t[c]=j});doneR.add({item:j,n:++n,tiles:t})});
    draw();$('#mFb').className='callout mfb';$('#mFb').innerHTML='هذا هو الحل (الأرقام المتساوية متطابقة). الرموز المكشوفة لا تُحسب ضمن ما طابقته؛ اضغط «جولة جديدة».'});
  newRound();
}
const TRIES=(n,full)=>[
 {t:'أكمل جولة «الوصف ↔ الرمزي».',ok:d=>!!d.ds},
 ...(full?[{t:'أكمل جولة «الوصف ↔ التنفيذي».',ok:d=>!!d.dw},{t:'أكمل جولة «الرمزي ↔ التنفيذي»: تعرّف الرمزين للعنصر نفسه دون الوصف.',ok:d=>!!d.sw},{t:'أكمل جولة «الثلاثة معاً».',ok:d=>!!d.dsw}]:[]),
 {t:'أكمل جولة كاملة بلا أي خطأ.',ok:d=>!!d.clean},
 {t:`طابق كل رموز الدرس (${n} رمزاً) ولو في جولات مختلفة.`,ok:d=>!!d.all}];

/* panel widget for u2-l1: tap a breaker → its phase */
function panelWidget(el){let hl=4;
  const draw=()=>{const i=(hl-1)%6,ph='L'+(PH[i]+1),same=[1,2,3,4,5,6,7,8,9,10,11,12].filter(n=>PH[(n-1)%6]===PH[i]);
    el.querySelector('.u2pbox').innerHTML=pn12({hl});
    el.querySelector('.u2pr').innerHTML=`القاطع <b>${hl}</b> في الصف الذي فيه القاطعان ${i+1} و${i+7}، ونقطة توصيل هذا الصف على القضيب <b class="ltr">${ph}</b>. على ${ph} أربعة قواطع: ${same.join(' و')}.`;
    el.querySelectorAll('.u2pb button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===hl))};
  el.innerHTML=`<div class="u2pw"><div class="callout"><b>توضيح للمتدرب — ليس من الكتاب:</b> اضغط رقم قاطع لترى من أي طور يتغذى. هكذا قرأنا الرمز التنفيذي للطبلون ص 51: كل صف (قاطعان متقابلان) يتصل بقضيب واحد فقط، والصفوف تدور على L1 ثم L2 ثم L3 فيتوزع الحمل على الأطوار الثلاثة بالتساوي.</div>
   <div class="u2pb">${Array.from({length:12},(x,i)=>`<button data-n="${i+1}">${i+1}</button>`).join('')}</div><div class="u2pbox"></div><p class="u2pr"></p></div>`;
  el.querySelectorAll('.u2pb button').forEach(b=>b.addEventListener('click',()=>{hl=+b.dataset.n;draw()}));draw()}

const NOTE_COLS=`<b>توضيح للمتدرب — ليس من الكتاب:</b> كل جدول في هذه الوحدة بثلاثة أعمدة. <b>الدائرة الرمزية</b> مخطط مختصر يرسم كل مجموعة أسلاك بخط واحد ويكتب عددها بشرطات مائلة (// = سلكان، /// = ثلاثة، أو شرطة ورقم 3)، فتعرف منه «ماذا يتصل بماذا». <b>الدائرة التنفيذية</b> هي التي يُنفَّذ منها التوصيل: يظهر فيها كل سلك وكل طرف وكل ملامس، فتعرف منها «كيف أوصل».`;

/* =====================================================================
   LESSON 1 — ص 47–51
   ===================================================================== */
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'46–51',
 title:'الرموز الأساسية وعناصر التوصيلات',
 summary:'لماذا يرسم الكهربائي رموزاً لا أشكالاً، ورموز المصادر والمقاومات والملفات والمكثفات وأجهزة القياس والعدادات والمفاتيح واللمبات والطبلونات في الدائرتين الرمزية والتنفيذية.',
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
})())/*DCML-END*/,(window.U2ST=window.U2ST||(function(){
/* أدوات رسم صغيرة لمحطات الوحدة الثانية: تضع رموز الدرس (SY) داخل رسم المحطة بألوان ثابتة على خلفية الرسم الفاتحة */
const strip=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const vb=s=>{const m=s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);return m?[+m[1],+m[2]]:[80,50]};
const sym=(s,cx,cy,k)=>{const [w,h]=vb(s);return `<g transform="translate(${(cx-w*k/2).toFixed(1)} ${(cy-h*k/2).toFixed(1)}) scale(${k})">${strip(s)}</g>`};
const t=(x,y,s,o)=>{o=o||{};const ar=/[؀-ۿ]/.test(s);return `<text x="${x}" y="${y}" text-anchor="middle"${ar?' direction="rtl"':' direction="ltr"'} style="font-family:${o.mono?'var(--mono)':'var(--font)'};font-size:${o.sz||13}px;font-weight:${o.w||700};fill:${o.c||'#2C4A40'};font-style:normal">${s}</text>`};
const tip=(tx,inner,b)=>`<g data-tip="${tx}">${b?`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="12" fill="transparent" style="stroke:none"/>`:''}${inner}</g>`;
const card=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" style="fill:${f||'#FBF6EE'};stroke:#2C4A40;stroke-width:2.5"/>`;
const art=(inner,aria,bg)=>`<svg class="u2s" viewBox="0 0 360 320" role="img" aria-label="${aria}" style="font-family:var(--font);--fg:#2C4A40;--surface:#FBF6EE;--live:#E8735A;--live-soft:#F7DCC8;max-width:none" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" style="fill:${bg||'#DDEFE6'};stroke:none"/>${inner}</svg>`;
/* صورة صغيرة لمختبر مصغّر: رمز واحد كبير في الوسط */
const pic=(s,k)=>{const [w,h]=vb(s);k=k||2;return `<svg class="u2s" viewBox="0 0 ${Math.round(w*k+20)} ${Math.round(h*k+20)}" style="max-width:${Math.round(w*k+20)}px" role="img" aria-label="رمز">${sym(s,(w*k+20)/2,(h*k+20)/2,k)}</svg>`};
return {sym,t,tip,card,art,pic,strip,vb};
})()),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثانية: الرموز الكهربائية والإلكترونية',ref:'ص 46–47',
   q:'المفتاح نفسه يُرسم في المخطط بطريقتين مختلفتين… فلماذا لا يكفي رسم واحد؟',
   art:U2ST.art(
     U2ST.card(196,46,136,190)+U2ST.t(264,72,'الدائرة الرمزية',{sz:14})
    +U2ST.tip('الرمز في الدائرة الرمزية: دائرة صغيرة وذراع. يكفي لتعرف أين المفتاح وماذا يتصل به، ولا يبين أطرافه.',U2ST.sym(SY.sw1S(),264,150,1.9),[204,90,120,120])
    +U2ST.card(28,46,136,190)+U2ST.t(96,72,'الدائرة التنفيذية',{sz:14})
    +U2ST.tip('الرمز في الدائرة التنفيذية: يظهر المشغّل اليدوي والحجز والملامس بين طرفين داخل إطار الجهاز، فتعرف منه كيف توصّل.',U2ST.sym(SY.sw1W(),96,152,1.55),[36,90,120,120])
    +U2ST.t(180,270,'مفتاح مفرد بطريقتين',{sz:15})+U2ST.t(180,292,'من جدول ص 49',{sz:12,w:500}),
    'رمز المفتاح المفرد في الدائرة الرمزية وفي الدائرة التنفيذية'),
   cap:'رمزا المفتاح المفرد كما في جدول <span class="ltr">ص 49</span>.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف ما يبينه.</b>',
   side:[
    {predict:{q:'تريد أن تعرف من الرسم أي طرف من أطراف المفتاح توصّل به السلك. أي الدائرتين تقرأ؟',opts:[
     ['الدائرة الرمزية',false,'الرمزية تختصر الأسلاك والأطراف، فتعرف منها «ماذا يتصل بماذا» فقط.'],
     ['الدائرة التنفيذية',true,'في التنفيذية يظهر كل طرف وكل ملامس، وهي التي يُنفَّذ منها التوصيل.'],
     ['لا فرق بينهما',false,'الوحدة كلها تقارن بين عمودين مختلفين لكل عنصر: الرمزي والتنفيذي.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> الإلمام ورسم مجموعات الرموز الكهربائية والإلكترونية.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على رموز الدوائر الرمزية الكهربائية والإلكترونية.</li><li>أن يتقن المتدرب رسم الدوائر الرمزية الكهربائية والإلكترونية.</li><li>أن يتعرف المتدرب على رموز الدوائر التنفيذية الكهربائية والإلكترونية.</li><li>أن يتقن المتدرب رسم الدوائر التنفيذية الكهربائية والإلكترونية.</li></ol>`,ref:'ص 47'},
    {tip:String.raw`<p>كل جدول في هذه الوحدة بثلاثة أعمدة: الوصف، والرمز في <b>الدائرة الرمزية</b>، والرمز في <b>الدائرة التنفيذية</b>.</p><ul><li><b>الرمزية</b> مخطط مختصر يرسم كل مجموعة أسلاك بخط واحد ويكتب عددها بشرطات مائلة (// = سلكان، /// = ثلاثة، أو شرطة ورقم 3)، فتعرف منه «ماذا يتصل بماذا».</li><li><b>التنفيذية</b> هي التي يُنفَّذ منها التوصيل: يظهر فيها كل سلك وكل طرف وكل ملامس، فتعرف منها «كيف أوصّل».</li></ul>`,title:'عمودان لكل عنصر'},
    {title:'مختبر مصغّر: رمزية أم تنفيذية؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اضغط الدائرة التي يصفها، ثم اقرأ السبب.',cats:['الدائرة الرمزية','الدائرة التنفيذية'],items:[
     ['مجموعة الأسلاك تُرسم خطاً واحداً، وعليه شرطتان مائلتان تبينان أنهما سلكان.',0,'هذا اختصار الدائرة الرمزية: الشرطات تخبرك بعدد الأسلاك بدل رسمها.'],
     ['يظهر فيها كل طرف من أطراف الجهاز وكل ملامس.',1,'التنفيذية تبين كل شيء ستوصّله بيدك.'],
     ['تعرف منها «ماذا يتصل بماذا» دون تفاصيل الأطراف.',0,'الرمزية تبين الفكرة العامة للدائرة.'],
     ['يُنفَّذ منها التوصيل على اللوحة أو في المبنى.',1,'لذلك سميت «تنفيذية».']]})}
   ]},

  {st:2,short:'لماذا الرموز؟',title:'٢-١ الرموز والمصطلحات المستعملة في الدوائر الكهربائية',ref:'ص 48',
   q:'لو رسمت جهاز القياس كما تراه بعينك، هل يعرف الفني من الرسم كيف يوصّله؟',
   art:U2ST.art(
     U2ST.tip('شكل الجهاز كما تراه: علبة فيها تدريج ومؤشر وطرفان. هذا ما يهتم به الرسم الفني الميكانيكي (منظر القطعة وشكلها).',
      `<rect x="34" y="70" width="124" height="112" rx="12" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:3"/><path d="M54 140 A42 42 0 0 1 138 140" style="fill:none;stroke:#2C4A40;stroke-width:2.5"/>`+[0,1,2,3,4,5,6].map(i=>{const a=Math.PI*(1-i/6),x1=96+42*Math.cos(a),y1=140-42*Math.sin(a),x2=96+34*Math.cos(a),y2=140-34*Math.sin(a);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:#2C4A40;stroke-width:2"/>`}).join('')+`<line x1="96" y1="140" x2="124" y2="112" style="stroke:#E8735A;stroke-width:3.5;stroke-linecap:round"/><circle cx="96" cy="140" r="5" style="fill:#2C4A40;stroke:none"/><circle cx="66" cy="196" r="7" style="fill:#2C4A40;stroke:none"/><circle cx="126" cy="196" r="7" style="fill:#E8735A;stroke:none"/><line x1="66" y1="182" x2="66" y2="190" style="stroke:#2C4A40;stroke-width:3"/><line x1="126" y1="182" x2="126" y2="190" style="stroke:#2C4A40;stroke-width:3"/>`+U2ST.t(96,170,'A',{sz:16,mono:1}),[30,66,132,140])
    +U2ST.t(96,232,'شكل الجهاز',{sz:14})
    +`<path d="M168 130 H196" style="stroke:#2C4A40;stroke-width:3;fill:none"/><path d="M196 122 L208 130 L196 138 Z" style="fill:#2C4A40;stroke:none"/>`
    +U2ST.tip('رمز مقياس التيار (أمبير ميتر) من جدول ص 49: دائرة بداخلها ⟦A⟧. لا يبين شكل الجهاز الخارجي، إنما يبين فائدته في الدائرة.',U2ST.sym(SY.meterW('A'),272,130,1.8),[212,90,124,80])
    +U2ST.t(272,232,'رمز الجهاز',{sz:14})
    +U2ST.t(180,280,'الرمز يبين فائدة الجزء لا شكله',{sz:14}),
    'جهاز قياس التيار كما يُرى، ورمزه في رسم التوصيلات'),
   cap:'جهاز القياس نفسه: شكله الخارجي ورمزه.<br><b>مرّر المؤشر على الشكل والرمز (أو المسهما في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'بماذا يهتم رسم التوصيلات الكهربائية بحسب الكتاب؟',opts:[
     ['بأبعاد الجهاز وشكله الخارجي',false,'هذا اهتمام الرسم الفني الميكانيكي: «منظر أو شكل القطعة».'],
     ['بلون الأسلاك وأنواعها',false,'الكتاب لا يذكر الألوان هنا.'],
     ['بأداء الجهاز ومسار التيار وطريقة مد الأسلاك',true,'«يهتم بتوضيح أداء الجهاز أو تركيبة دائرة مسار التيار، أو يبين طريقة مد أسلاك التوصيل» (ص 48).']]}}
   ],
   body:[
    {book:String.raw`<p>يختلف هدف رسم التوصيلات في الهندسة الكهربائية عن هدف الرسم الفني في الهندسة الميكانيكية. ففي الرسم الفني الميكانيكي يكون الاهتمام بمنظر أو شكل القطعة أو الجزء المراد رسمه. أما رسم التوصيلات الكهربائية فيهتم بتوضيح أداء الجهاز أو تركيبة دائرة مسار التيار ، أو يبين طريقة مد أسلاك التوصيل بين الأجهزة أو الوحدات المختلفة. وتمثل الأجهزة في رسم التوصيلات الكهربائية برموز خاصة. وهذه الرموز تكون في صورة رسم دال على مغزى الجزء ، ولا تتيح هذه الرسومات التعرف على الشكل الخارجي للجزء الممثل إنما توضح فقط فائدة الجزء بطريقة رمزية. وقد تم توحيد الرموز المستخدمة في رسم الدوائر الكهربائية.</p>`,ref:'ص 48'},
    {tip:String.raw`<p>الرمز «رسم دال على مغزى الجزء»: دائرة فيها <span class="ltr">A</span> تعني «يقيس التيار» مهما كان شكل الجهاز أو حجمه أو الشركة التي صنعته. ولأن الرموز <b>موحّدة</b> يقرأ أي فني المخطط نفسه بالطريقة نفسها.</p>`,title:'رسم دال على مغزى الجزء'},
    {add:String.raw`<p>المواصفة الدولية التي تجمع هذه الرموز الموحّدة اليوم هي <span class="ltr">IEC 60617</span>، ومنها أكملنا الخانات الفارغة في جداول هذه الوحدة.</p>`,title:'من وحّد الرموز؟'},
    {title:'مختبر مصغّر: أي الرسمين؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل عبارة اضغط نوع الرسم الذي تصفه بحسب نص الكتاب.',cats:['رسم فني ميكانيكي','رسم توصيلات كهربائية'],items:[
     ['يهتم بمنظر أو شكل القطعة المراد رسمها.',0,'«ففي الرسم الفني الميكانيكي يكون الاهتمام بمنظر أو شكل القطعة» (ص 48).'],
     ['يبين طريقة مد أسلاك التوصيل بين الأجهزة.',1,'من مهام رسم التوصيلات الكهربائية بحسب الكتاب.'],
     ['تمثَّل فيه الأجهزة برموز خاصة لا تبين شكلها الخارجي.',1,'«لا تتيح هذه الرسومات التعرف على الشكل الخارجي للجزء الممثل».'],
     ['يوضح أداء الجهاز أو تركيبة دائرة مسار التيار.',1,'هذا أول ما يهتم به رسم التوصيلات (ص 48).']]})}
   ]},

  {st:3,short:'العناصر الأساسية',title:'٢-٢ رموز العناصر الأساسية للدوائر الكهربائية',ref:'ص 48',
   q:'السهم المائل نفسه يحوّل المقاومة والملف والمكثف إلى «متغير القيمة»… فما الذي يخبرك به؟',
   art:U2ST.art(
     U2ST.card(30,40,140,112)+U2ST.tip('مصدر تيار مستمر (من الكتاب، العمود التنفيذي): دائرة فيها ⟦G⟧ وتحتها خط قصير. العلامة «—» تعني تياراً مستمراً.',U2ST.sym(SY.dcW(),100,86,1.5),[34,44,132,104])+U2ST.t(100,140,'مصدر مستمر',{sz:12})
    +U2ST.card(190,40,140,112)+U2ST.tip('مصدر تيار متردد (من الكتاب): دائرة فيها ⟦G⟧ وتحتها «~». العلامة «~» تعني تياراً متردداً.',U2ST.sym(SY.acW(),260,86,1.5),[194,44,132,104])+U2ST.t(260,140,'مصدر متردد',{sz:12})
    +U2ST.card(30,168,140,112,'#FFF4D6')+U2ST.tip('بطارية — إضافة من خارج الكتاب (⟦IEC 60617⟧): الخط الطويل القطب الموجب والقصير السميك السالب. خانتها فارغة في الكتاب.',U2ST.sym(SY.bat(),100,214,1.25),[34,172,132,104])+U2ST.t(100,268,'بطارية',{sz:12})
    +U2ST.card(190,168,140,112,'#FFF4D6')+U2ST.tip('مقاومة متغيرة القيمة — إضافة من خارج الكتاب (⟦IEC 60617⟧): مستطيل المقاومة يخترقه سهم مائل يعني «قابل للتغيير».',U2ST.sym(SY.resV(),260,214,1.25),[194,172,132,104])+U2ST.t(260,268,'مقاومة متغيرة',{sz:12}),
    'أربعة رموز من جدول ص 48: مصدر مستمر، مصدر متردد، بطارية، مقاومة متغيرة'),
   cap:'رمزان من الكتاب (فوق) ورمزان أكملناهما من <span class="ltr">IEC 60617</span> (تحت، بخلفية صفراء).<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف معنى الرمز.</b>',
   side:[
    {predict:{q:'رمز مصدر فيه الحرف G وتحته «~». ماذا يمثل؟',opts:[
     ['مصدر تيار متردد',true,'«~» علامة التيار المتردد، و«—» علامة التيار المستمر (جدول ص 48).'],
     ['مصدر تيار مستمر',false,'المستمر علامته خط قصير «—» تحت G.'],
     ['جهاز قياس الجهد',false,'جهاز القياس يُكتب داخله اسم الكمية مثل V أو A (جدول ص 49).']]}}
   ],
   body:[
    {book:LEGEND+tableHTML('t48'),ref:'ص 48'},
    {add:String.raw`<p>الكتاب يترك صفوف البطارية والأرضي والمقاومة والملف فارغة. رسمناها برموز <span class="ltr">IEC 60617</span>: البطارية خلايا (خط طويل موجب وقصير سالب)، والأرضي خط تحته ثلاثة خطوط متناقصة، والمقاومة مستطيل، والملف أقواس متتالية، والسهم المائل يعني «متغير القيمة». وهذه الرموز واحدة في الدائرتين. ورمز المصدر المستمر في العمود الرمزي «—» قياساً على «~» للمتردد في الصف الذي يليه.</p>`,title:'الخانات الفارغة في جدول ص 48'},
    {title:'مختبر مصغّر: ثابت أم متغير القيمة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر العنصر، ثم اضغط الزر لتجعله متغير القيمة وراقب ما يتغير في رمزه.',
     predict:{q:'ماذا تضيف إلى رمز المقاومة لتصبح «مقاومة متغيرة القيمة»؟',opts:[['دائرة حول الرمز',false,'الدائرة في هذه الجداول للأجهزة مثل المولد وأجهزة القياس.'],['سهماً مائلاً يخترق الرمز',true,'السهم المائل علامة «قابل للتغيير» في المقاومة والملف (ص 48) والمكثف (ص 49).'],['خطاً قصيراً تحته',false,'الخط القصير علامة التيار المستمر في رمز المصدر.']]},
     ins:[{k:'el',l:'العنصر',seg:[['r','مقاومة'],['l','ملف'],['c','مكثف']],v:'r'},{k:'v',l:'',sw:true,v:0,on:'متغير القيمة — اضغط لتجعله ثابتاً',off:'ثابت القيمة — اضغط لتجعله متغيراً'}],
     calc:s=>{const N={r:['مقاومة',SY.res,SY.resV,'ص 48'],l:['ملف',SY.ind,SY.indV,'ص 48'],c:['مكثف',SY.cap,SY.capV,'ص 49']}[s.el];
      return {pic:U2ST.pic((s.v?N[2]:N[1])(),2.2),msg:`<b>${N[0]}${s.v?' متغير القيمة':''}</b> (جدول ${N[3]}). ${s.v?'السهم المائل الذي يخترق الرمز هو كل الفرق: يعني أن القيمة تُضبط.':'بلا سهم: قيمة ثابتة.'}${s.el!=='c'?' <span class="ml-tag">إضافة</span> رمز هذا الصف من <span class="ltr">IEC 60617</span> لأن خانته فارغة في الكتاب.':''}`}}})}
   ]},

  {st:4,short:'القياس والعدادات والمفاتيح',title:'تابع الجدول: المكثفات وأجهزة القياس والعدادات والمفاتيح',ref:'ص 49',
   q:'خط واحد عليه شرطتان في الرمزية… كم سلكاً ستمد فعلاً إلى جهاز القياس؟',
   art:U2ST.art(
     U2ST.card(30,44,300,104)+U2ST.t(276,68,'الرمزية',{sz:13})
    +U2ST.tip('الرمز في الدائرة الرمزية: دائرة فيها ⟦V⟧ يخرج منها خط واحد عليه شرطتان مائلتان = سلكان يمثلهما خط واحد.',U2ST.sym(SY.meterS('V'),150,98,1.6),[70,56,170,88])
    +U2ST.card(30,168,300,104)+U2ST.t(276,192,'التنفيذية',{sz:13})
    +U2ST.tip('الرمز في الدائرة التنفيذية: يظهر طرفا الجهاز، يدخل سلك من جهة ويخرج من الجهة الأخرى.',U2ST.sym(SY.meterW('V'),150,222,1.6),[70,180,170,88])
    +U2ST.t(180,300,'مقياس الفولت بالطريقتين',{sz:14}),
    'رمز الفولتميتر في الدائرة الرمزية وفي الدائرة التنفيذية'),
   cap:'مقياس الفولت كما في جدول <span class="ltr">ص 49</span>.<br><b>مرّر المؤشر على الرمزين (أو المسهما في الجوال) لتعرف معنى الشرطتين.</b>',
   side:[
    {predict:{q:'في الدائرة الرمزية لعداد ثلاثي الوجه خط عليه ثلاث شرطات. كم خطاً تراه من كل جانب في التنفيذية؟',opts:[
     ['خطان',false,'خطان من كل جانب للعداد أحادي الوجه.'],
     ['ثلاثة خطوط',false,'الأطوار ثلاثة، لكن التنفيذية ترسم معها خط التعادل.'],
     ['أربعة خطوط',true,'ثلاثة أطوار وخط التعادل (جدول ص 49). جرّب ذلك في المختبر المصغّر بالأسفل.']]}}
   ],
   body:[
    {book:tableHTML('t49'),ref:'ص 49'},
    {tip:String.raw`<p>في أجهزة القياس الحرف داخل الدائرة هو اسم الكمية: <span class="ltr">A</span> تيار، <span class="ltr">V</span> جهد، <span class="ltr">Ω</span> مقاومة، <span class="ltr">W</span> قدرة، <span class="ltr">Hz</span> تردد. والعداد مستطيل مكتوب فيه <span class="ltr">KWh</span>، وتحتها «~» لأحادي الوجه أو «<span class="ltr">3~</span>» لثلاثي الأوجه.</p>`,title:'اقرأ الحرف داخل الرمز'},
    {title:'مختبر مصغّر: من الرمزية إلى التنفيذية',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الجهاز ثم بدّل بين الدائرتين، وعُدّ الشرطات في الرمزية والخطوط في التنفيذية.',
     ins:[{k:'d',l:'الجهاز',seg:[['A','أمبير ميتر'],['V','فولت ميتر'],['W','وات ميتر'],['k1','عداد أحادي'],['k3','عداد ثلاثي']],v:'A'},{k:'w',l:'الدائرة',seg:[['s','الرمزية'],['w','التنفيذية']],v:'s'}],
     calc:s=>{const k=s.d[0]==='k',n=s.d==='k3'?3:1;const g=k?(s.w==='s'?SY.kwhS(n):SY.kwhW(n)):(s.w==='s'?SY.meterS(s.d):SY.meterW(s.d));
      const nm={A:'مقياس التيار',V:'مقياس الفولت',W:'مقياس القدرة',k1:'عداد تيار متردد أحادي الوجه',k3:'عداد تيار متردد ثلاثي الوجه'}[s.d];
      const m=k?(s.w==='s'?`في الرمزية خط من كل جانب عليه <b>${n===3?'ثلاث شرطات':'شرطتان'}</b>.`:`في التنفيذية <b>${n===3?'أربعة خطوط':'خطان'}</b> من كل جانب${n===3?': ثلاثة أطوار وخط التعادل':''}.`)
       :(s.w==='s'?'خط واحد عليه <b>شرطتان</b>: يمثل سلكين.':'يظهر <b>طرفا</b> الجهاز: سلك يدخل وسلك يخرج.');
      return {pic:U2ST.pic(g,k?1.9:2.1),msg:`<b>${nm}</b> — ${s.w==='s'?'الدائرة الرمزية':'الدائرة التنفيذية'} (جدول ص 49). ${m}`}}})},
    {watch:String.raw`<p>المفتاح المزدوج في الرمزية دائرة واحدة <b>بذراعين</b>، وفي التنفيذية <b>ملامسان مستقلان</b> كلٌّ بطرفيه. لا تخلطه بمفتاح وسط السلم (أربعة أذرع، جدول ص 50).</p>`}
   ]},

  {st:5,short:'السلم والإنارة والجرس',title:'تابع الجدول: مفاتيح السلم والضاغط واللمبات والجرس',ref:'ص 50',
   q:'ذراعان متعاكسان أم أربعة أذرع؟ كيف تميّز مفتاح طرف السلم من مفتاح وسط السلم بنظرة واحدة؟',
   art:U2ST.art(
     U2ST.card(24,46,100,118,'#FFF4D6')+U2ST.tip('مفتاح طرف السلم (رمزي، إضافة من ⟦IEC 60617⟧): دائرة بذراعين متعاكسين. ملامس قلاب: طرف مشترك يتحول بين طرفين.',U2ST.sym(SY.sw3S(),74,98,1.3),[28,50,92,110])+U2ST.t(74,150,'طرف سلم',{sz:12})
    +U2ST.card(130,46,100,118,'#FFF4D6')+U2ST.tip('مفتاح وسط السلم (رمزي، إضافة من ⟦IEC 60617⟧): دائرة بأربعة أذرع. يوضع بين مفتاحي طرف السلم.',U2ST.sym(SY.sw4S(),180,98,1.3),[134,50,92,110])+U2ST.t(180,150,'وسط سلم',{sz:12})
    +U2ST.card(236,46,100,118,'#FFF4D6')+U2ST.tip('الضاغط (رمزي، إضافة): دائرة بداخلها نقطة، وهو الرمز نفسه الذي يستعمله الكتاب في ص 54. يرجع وحده عند ترك الزر.',U2ST.sym(SY.pushS(),286,98,1.4),[240,50,92,110])+U2ST.t(286,150,'ضاغط',{sz:12})
    +U2ST.card(52,182,256,96)+U2ST.tip('مفتاح صدمة التيار (تنفيذي، من الكتاب): ملف ثم ملامس بينهما وصلة منقطة. كل نبضة تيار في الملف تقلب حالة الملامس.',U2ST.sym(SY.impW(),180,222,1.15),[56,186,248,88])+U2ST.t(180,272,'مفتاح صدمة تيار',{sz:12}),
    'رموز مفتاح طرف السلم ووسط السلم والضاغط ومفتاح صدمة التيار'),
   cap:'ثلاثة رموز رمزية أكملناها من <span class="ltr">IEC 60617</span> (صفراء) ورمز تنفيذي من الكتاب.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف الرمز.</b>',
   side:[
    {predict:{q:'رمز تنفيذي فيه ملف (مستطيل) وملامس بينهما خط منقط. ما هو؟',opts:[
     ['جرس كهربائي',false,'الجرس نصف دائرة على طرفين.'],
     ['ملف خانق',false,'الخانق في التنفيذية مستطيل أسود بين طرفين، بلا ملامس.'],
     ['مفتاح صدمة تيار',true,'كل نبضة تيار في الملف تقلب حالة الملامس (جدول ص 50).']]}}
   ],
   body:[
    {book:tableHTML('t50'),ref:'ص 50'},
    {add:String.raw`<p>في الدائرة الرمزية (مخطط التركيبات) استعملنا رموز <span class="ltr">IEC 60617</span> المعمارية: مفتاح طرف السلم دائرة بذراعين متعاكسين، ومفتاح وسط السلم بأربعة أذرع، والضاغط دائرة بداخلها نقطة (وهو الرمز نفسه الذي يستعمله الكتاب في ص 54)، والبريزة نصف دائرة بخط أرضي، والفلورسنت خط سميك بين شرطتين. واللمبة دائرة بداخلها X، والجرس نصف دائرة على طرفين، وعلبة التوزيع دائرة تلتقي فيها الأسلاك. أما <b>البادئ</b> و<b>الملف الخانق</b> فأخذنا شكلهما من رسم لمبة الفلورسنت في الكتاب نفسه (ص 50)، وفي الرمزي للخانق رمز الملف ذي القلب الحديدي من <span class="ltr">IEC 60617</span>.</p>`,title:'الخانات الفارغة في جدول ص 50'},
    {title:'مختبر مصغّر: ما اسم هذا الرمز؟',widget:(el,B)=>DCML.cases(el,B,{intro:'انظر إلى الرمز واختر اسمه. كل الرموز من جدول ص 50.',cases:[
     {q:`ما هذا الرمز التنفيذي؟ ${SY.sw3W()}`,opts:[['مفتاح مفرد',false,'المفرد ملامس واحد بين طرفين فقط.'],['مفتاح طرف سلم',true,'ملامس قلاب: الطرف المشترك في الأسفل يتحول بين طرفين في الأعلى.'],['ضاغط',false,'الضاغط ملامس بين طرفين يحركه زر ضغط بلا حجز.']]},
     {q:`ما هذا الرمز التنفيذي؟ ${SY.sockW()}`,opts:[['بريزة أحادية الوجه',true,'ثلاثة أطراف: الطور والمحايد والأرضي.'],['علبة توزيع',false,'علبة التوزيع دائرة تلتقي فيها الأسلاك.'],['جرس كهربائي',false,'الجرس نصف دائرة على طرفين.']]},
     {q:`ما هذا الرمز التنفيذي؟ ${SY.flW(40)}`,opts:[['ملف خانق وحده',false,'الخانق جزء من الرسم فقط (المستطيل الأسود في الأعلى).'],['لمبة فلورسانت ٤٠ وات',true,'التنفيذية تُظهر الأنبوب وفتيلتيه والملف الخانق والبادئ.'],['جرس كهربائي',false,'الجرس نصف دائرة على طرفين.']]}]})}
   ]},

  {st:6,short:'نقاط التوصيل والطبلونات',title:'تابع الجدول: نقاط التوصيل والطبلونات',ref:'ص 51',
   q:'في طبلون فيه اثنا عشر قاطعاً وثلاثة أطوار… كيف يتوزع الحمل على الأطوار بالتساوي؟',
   art:U2ST.art(
     U2ST.card(30,40,140,96,'#FFF4D6')+U2ST.tip('نقطة قابلة للفك (إضافة من ⟦IEC 60617⟧): دائرة صغيرة مفرغة = طرف يُفك مثل برغي التوصيل.',U2ST.sym(SY.det(),100,80,1.6),[34,44,132,88])+U2ST.t(100,124,'قابلة للفك',{sz:12})
    +U2ST.card(190,40,140,96,'#FFF4D6')+U2ST.tip('نقطة غير قابلة للفك (إضافة من ⟦IEC 60617⟧): نقطة مصمتة = توصيل ثابت.',U2ST.sym(SY.ndet(),260,80,1.6),[194,44,132,88])+U2ST.t(260,124,'غير قابلة للفك',{sz:12})
    +U2ST.card(80,150,200,140)+U2ST.tip('الطبلون ثنائي الخط ثمانية قواطع فرعية مع خط التعادل (⟦N⟧) — رمزه في الدائرة الرمزية كما في الكتاب: مستطيل فيه القواطع مرقمة.',U2ST.sym(SY.pn8S(),180,206,1.35),[84,154,192,104])+U2ST.t(180,276,'طبلون 8 قواطع',{sz:12}),
    'نقطتا التوصيل ورمز الطبلون ثنائي الخط'),
   cap:'نقطتا التوصيل (أكملناهما من <span class="ltr">IEC 60617</span>) ورمز الطبلون من الكتاب.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الطبلون ثلاثي الأوجه ص 51 القاطعان 1 و 7 في صف واحد على L1، والصفوف تدور L1 ثم L2 ثم L3. من أي طور يتغذى القاطع 9؟',opts:[
     ['L1',false,'القاطع 9 يقابل القاطع 3 في الصف الثالث، لا الأول.'],
     ['L2',false,'L2 للصف الثاني (القاطعان 2 و 8) والخامس (5 و 11).'],
     ['L3',true,'القاطع 9 في الصف الثالث مع القاطع 3، والصف الثالث على L3. تأكد في المختبر المصغّر.']]}}
   ],
   body:[
    {book:tableHTML('t51'),ref:'ص 51'},
    {tip:String.raw`<p>«طبلون» = لوحة توزيع. في الطبلون ثنائي الخط كل خط تغذية (طرف دائري على اليسار وآخر على اليمين) يغذي صفاً من القواطع، وقضيب التعادل في الأعلى يجمع أسلاك المحايد. ونقطة التوصيل المفرغة (القابلة للفك) والمصمتة (غير القابلة للفك) تظهران هنا داخل الطبلون نفسه.</p>`,title:'اقرأ الطبلون'},
    {title:'مختبر مصغّر: من أي طور يتغذى القاطع؟',widget:(el,B)=>panelWidget(el)},
    {watch:String.raw`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 51: الرقم 8 في الرمز التنفيذي للطبلون ثنائي الخط مطبوع مشوهاً؛ رسمناه 8.</li><li>أرقام الصفحات في فهرس الكتاب تزيد واحداً عن المطبوع على الصفحات (الوحدة الثانية في الفهرس ٤٧ وفعلياً ص 46)؛ نعتمد هنا المطبوع على الصفحة.</li></ul>`,fix:1}
   ]},

  {recap:[
   'رسم التوصيلات يهتم بأداء الجهاز ومسار التيار وطريقة مد الأسلاك، لا بشكل الجزء؛ والرموز موحّدة (ص 48).',
   'لكل عنصر رمزان: في الدائرة الرمزية (خط واحد وشرطات تبين عدد الأسلاك) وفي الدائرة التنفيذية (كل سلك وكل طرف).',
   'السهم المائل الذي يخترق الرمز يعني «متغير القيمة»، و«—» تيار مستمر و«~» تيار متردد (ص 48–49).',
   'العداد ثلاثي الوجه: ثلاث شرطات في الرمزية وأربعة خطوط في التنفيذية (ص 49).',
   'في الطبلون ثلاثي الأوجه تدور الصفوف على L1 ثم L2 ثم L3 فيتوزع الحمل بالتساوي (ص 51).']}
],
 theory:[
  {h:'الوحدة الثانية: الرموز الكهربائية و الإلكترونية',ref:'ص 46–47',html:`<p><b>الهدف العام للوحدة:</b> الإلمام ورسم مجموعات الرموز الكهربائية والإلكترونية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على رموز الدوائر الرمزية الكهربائية والإلكترونية.</li><li>أن يتقن المتدرب رسم الدوائر الرمزية الكهربائية والإلكترونية.</li><li>أن يتعرف المتدرب على رموز الدوائر التنفيذية الكهربائية والإلكترونية.</li><li>أن يتقن المتدرب رسم الدوائر التنفيذية الكهربائية والإلكترونية.</li></ol>`},
  {h:'٢-١ الرموز والمصطلحات المستعملة في الدوائر الكهربائية',ref:'ص 48',html:`<p>يختلف هدف رسم التوصيلات في الهندسة الكهربائية عن هدف الرسم الفني في الهندسة الميكانيكية. ففي الرسم الفني الميكانيكي يكون الاهتمام بمنظر أو شكل القطعة أو الجزء المراد رسمه. أما رسم التوصيلات الكهربائية فيهتم بتوضيح أداء الجهاز أو تركيبة دائرة مسار التيار ، أو يبين طريقة مد أسلاك التوصيل بين الأجهزة أو الوحدات المختلفة. وتمثل الأجهزة في رسم التوصيلات الكهربائية برموز خاصة. وهذه الرموز تكون في صورة رسم دال على مغزى الجزء ، ولا تتيح هذه الرسومات التعرف على الشكل الخارجي للجزء الممثل إنما توضح فقط فائدة الجزء بطريقة رمزية. وقد تم توحيد الرموز المستخدمة في رسم الدوائر الكهربائية.</p>`},
  {note:NOTE_COLS},
  {h:'٢-٢ رموز العناصر الأساسية للدوائر الكهربائية',ref:'ص 48',html:LEGEND+tableHTML('t48')},
  {note:`<b>إضافة من خارج الكتاب:</b> الكتاب يترك صفوف البطارية والأرضي والمقاومة والملف فارغة. رسمناها برموز IEC 60617: البطارية خلايا (خط طويل موجب وقصير سالب)، والأرضي خط تحته ثلاثة خطوط متناقصة، والمقاومة مستطيل، والملف أقواس متتالية، والسهم المائل يعني «متغير القيمة». وهذه الرموز واحدة في الدائرتين. ورمز المصدر المستمر في العمود الرمزي «—» قياساً على «~» للمتردد في الصف الذي يليه.`},
  {h:'تابع الجدول: المكثفات وأجهزة القياس والعدادات والمفاتيح',ref:'ص 49',html:tableHTML('t49')},
  {h:'تابع الجدول: مفاتيح السلم والضاغط واللمبات والجرس',ref:'ص 50',html:tableHTML('t50')},
  {note:`<b>إضافة من خارج الكتاب:</b> في الدائرة الرمزية (مخطط التركيبات) استعملنا رموز IEC 60617 المعمارية: مفتاح طرف السلم دائرة بذراعين متعاكسين، ومفتاح وسط السلم بأربعة أذرع، والضاغط دائرة بداخلها نقطة (وهو الرمز نفسه الذي يستعمله الكتاب في ص 54)، والبريزة نصف دائرة بخط أرضي، والفلورسنت خط سميك بين شرطتين. واللمبة دائرة بداخلها X، والجرس نصف دائرة على طرفين، وعلبة التوزيع دائرة تلتقي فيها الأسلاك. أما <b>البادئ</b> و<b>الملف الخانق</b> فأخذنا شكلهما من رسم لمبة الفلورسنت في الكتاب نفسه (ص 50)، وفي الرمزي للخانق رمز الملف ذي القلب الحديدي من IEC 60617.`},
  {h:'تابع الجدول: نقاط التوصيل والطبلونات',ref:'ص 51',html:tableHTML('t51')},
  {widget:panelWidget},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> «طبلون» = لوحة توزيع. في الطبلون ثنائي الخط كل خط تغذية (طرف دائري على اليسار وآخر على اليمين) يغذي صفاً من القواطع، وقضيب التعادل في الأعلى يجمع أسلاك المحايد. ونقطة التوصيل المفرغة (القابلة للفك) والمصمتة (غير القابلة للفك) — وهما من رموز IEC 60617 أكملنا بهما صفي ص 51 — تظهران هنا داخل الطبلون نفسه.`},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 51: الرقم 8 في الرمز التنفيذي للطبلون ثنائي الخط مطبوع مشوهاً؛ رسمناه 8.</li><li>أرقام الصفحات في فهرس الكتاب تزيد واحداً عن المطبوع على الصفحات (الوحدة الثانية في الفهرس ٤٧ وفعلياً ص 46)؛ نعتمد هنا المطبوع على الصفحة.</li></ul>`}
 ],
 lab:(el,B)=>matchLab(el,B,{tables:['t48','t49','t50','t51'],pages:'ص 48–51',tries:TRIES(35,1)}),
 quiz:[
  {q:'بماذا يهتم رسم التوصيلات الكهربائية بحسب الكتاب؟',o:['بالشكل الخارجي للجهاز','بتوضيح أداء الجهاز أو تركيبة دائرة مسار التيار وطريقة مد الأسلاك','بأبعاد القطعة ومساقطها','بلون الأسلاك فقط'],c:1,e:'الرموز «لا تتيح التعرف على الشكل الخارجي … إنما توضح فقط فائدة الجزء» (ص 48).'},
  {q:'شرطتان مائلتان على خط في الدائرة الرمزية لجهاز قياس تعنيان:',o:['جهازين','سلكين يمثلهما خط واحد','تياراً مستمراً','أرضياً'],c:1,e:'في التنفيذية يظهر الطرفان (السلكان) منفصلين.'},
  {q:'في الرمز التنفيذي لعداد ثلاثي الوجه نرى من كل جانب:',o:['خطين','ثلاثة خطوط','أربعة خطوط','خطاً واحداً بشرطتين'],c:2,e:'ثلاثة أطوار وخط التعادل، بينما الرمزي خط عليه ثلاث شرطات (ص 49).'},
  {q:'ما الفرق في الدائرة التنفيذية بين المفتاح المفرد والضاغط (ص 49–50)؟',o:['لا فرق','الضاغط بلا رمز حجز فيرجع وحده، والمفتاح فيه حجز','المفتاح بلا مشغّل','الضاغط بملامسين'],c:1,e:'مشغّل الضاغط زر ضغط متصل مباشرة بالملامس، ومشغّل المفتاح يمر بحجز يبقيه في وضعه.'},
  {q:'في الطبلون ثلاثي الأوجه ص 51، القاطع رقم 5 يتغذى من:',o:['L1','L2','L3','N'],c:1,e:'الصف 5–11 نقطته على L2 (التوزيع L1، L2، L3 ثم يتكرر).'},
  {q:'مفتاح الصدمة في الدائرة التنفيذية يتكون من:',o:['مقاومة وملامس','ملف وملامس مفتوح بينهما وصلة منقطة','مصهر ومفتاح','بادئ وملف خانق'],c:1,e:'الملف يقلب حالة الملامس مع كل نبضة (ص 50).'}
 ]
});

/* =====================================================================
   LESSON 2 — ص 52–53
   ===================================================================== */
B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'52–53',
 title:'رموز إلكترونيات القدرة والبوابات المنطقية',
 summary:'رموز الدايودات والثايرستور والترانزستور ومحولات القدرة الإلكترونية، ثم البوابات المنطقية AND وOR وNOT وNAND وNOR — الرمز واحد في الدائرتين.',
 stations:[
  {intro:true},

  {st:1,short:'إلكترونيات القدرة',title:'٢-٣ رموز عناصر إلكترونيات القدرة',ref:'ص 52',
   q:'سهمان فوق الدايود… داخلان أم خارجان؟ الفرق بينهما هو الفرق بين جهاز يرى الضوء وجهاز يُطلقه.',
   art:U2ST.art(
     U2ST.card(30,40,140,112)+U2ST.tip('دايود: المثلث يشير إلى اتجاه مرور التيار، والخط عند رأسه هو المهبط، وقاعدة المثلث المصعد.',U2ST.sym(SY.diode(),100,88,1.25),[34,44,132,104])+U2ST.t(100,140,'دايود',{sz:12})
    +U2ST.card(190,40,140,112)+U2ST.tip('دايود مشع: السهمان خارجان من الرمز لأنه هو الذي يُطلق الضوء.',U2ST.sym(SY.led(),260,86,1.25),[194,44,132,104])+U2ST.t(260,140,'دايود مشع',{sz:12})
    +U2ST.card(30,168,140,112)+U2ST.tip('دايود ضوئي: السهمان داخلان نحو الرمز لأن الضوء يسقط عليه.',U2ST.sym(SY.photo(),100,214,1.25),[34,172,132,104])+U2ST.t(100,268,'دايود ضوئي',{sz:12})
    +U2ST.card(190,168,140,112)+U2ST.tip('ترانزستور ⟦NPN⟧: سهم الباعث خارج من القاعدة. (في ⟦PNP⟧ يكون داخلاً نحوها.)',U2ST.sym(SY.npn(),260,212,1.25),[194,172,132,104])+U2ST.t(260,268,'ترانزستور NPN',{sz:12}),
    'رموز الدايود والدايود المشع والدايود الضوئي والترانزستور NPN'),
   cap:'أربعة رموز من جدول <span class="ltr">ص 52</span>، وهي نفسها في الدائرتين الرمزية والتنفيذية.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف كيف تقرأ الرمز.</b>',
   side:[
    {predict:{q:'في رمز الدايود، أين المهبط؟',opts:[
     ['عند قاعدة المثلث',false,'قاعدة المثلث هي المصعد.'],
     ['عند الخط الرأسي الذي يلمس رأس المثلث',true,'المثلث يشير إلى اتجاه التيار، والخط عند رأسه هو المهبط.'],
     ['عند البوابة',false,'الدايود العادي ليس له بوابة؛ البوابة في الثايرستور.']]}}
   ],
   body:[
    {book:tableHTML('t52'),ref:'ص 52'},
    {tip:String.raw`<p>في هذا الجدول يرسم الكتاب <b>الرمز نفسه</b> في عمودي الدائرة الرمزية والتنفيذية. وفي كل رموز الدايود يشير المثلث إلى اتجاه مرور التيار، والخط عند رأسه هو <b>المهبط</b> وقاعدة المثلث <b>المصعد</b>. الأسهم فوق الدايود تبيّن الضوء: داخلة = يستقبل الضوء (ضوئي)، خارجة = يُطلق الضوء (مشع). وفي الترانزستور يكون سهم الباعث خارجاً في <span class="ltr">NPN</span> وداخلاً في <span class="ltr">PNP</span>. وفي مربعات المحولات: العلامة في الأعلى نوع الدخل والعلامة في الأسفل نوع الخرج («—» مستمر، «~» متردد).</p>`,title:'كيف تقرأ هذه الرموز'},
    {title:'مختبر مصغّر: في أي اتجاه يمر التيار؟',widget:(el,B)=>DCML.lab(el,B,{intro:'دائرة صغيرة فيها بطارية ودايود ولمبة. اقلب البطارية وراقب اللمبة.',
     predict:{q:'الدايود في الأعلى يشير إلى اليمين. إذا كان القطب الموجب للبطارية على اليمين، هل تضيء اللمبة؟',opts:[['نعم، الدايود يمرر التيار في الاتجاهين',false,'لو كان كذلك لما احتجنا إلى مثلث يبين الاتجاه.'],['لا، لأن التيار يصل إلى الدايود من جهة المهبط',true,'التيار يخرج من الموجب (يمين) فيصعد عبر اللمبة ثم يصل إلى الدايود من جهة الخط (المهبط) فلا يمر.'],['تضيء بنصف إضاءتها',false,'الدايود هنا إما يمرر التيار أو يمنعه.']]},
     ins:[{k:'p',l:'وضع البطارية',seg:[['L','الموجب على اليسار'],['R','الموجب على اليمين']],v:'L'}],
     calc:s=>{const on=s.p==='L';const st=on?'stroke:var(--live)':'';
      const wire=(d)=>`<path d="${d}" style="fill:none;${st}"/>`;
      let g=wire('M40 40 H90')+wire('M210 40 H260 V56')+wire('M260 144 V160 H156')+wire('M144 160 H40 V40');
      g+=U2ST.sym(SY.diode(),150,40,1.2);
      g+=(on?'<circle cx="260" cy="100" r="30" style="fill:#ffd36b;stroke:none;opacity:.8"/>':'')+`<g transform="rotate(90 260 100)">${U2ST.sym(SY.lamp(),260,100,1.1)}</g>`;
      const xl=on?144:156,xs=on?156:144;g+=`<path d="M${xl} 144 V176" style="stroke-width:2.4"/><path d="M${xs} 152 V168" style="stroke-width:5"/>`;
      g+=`<text x="${xl+(on?-12:12)}" y="140" text-anchor="middle" style="font-size:16px;font-weight:700">+</text><text x="${xs+(on?12:-12)}" y="140" text-anchor="middle" style="font-size:16px;font-weight:700">−</text>`;
      if(on)g+=`<path d="M60 110 L66 98 L72 110" style="fill:none;stroke:var(--live);stroke-width:2.4"/><path d="M228 34 L240 40 L228 46" style="fill:none;stroke:var(--live);stroke-width:2.4"/>`;
      return {pic:`<svg class="u2s" viewBox="0 0 300 200" role="img" aria-label="بطارية ودايود ولمبة">${g}</svg>`,
       facts:[['اتجاه الدايود','من اليسار إلى اليمين'],['التيار',on?'يمر':'لا يمر',on?'hi':'bad'],['اللمبة',on?'مضاءة':'مطفأة',on?'hi':'bad']],
       msg:on?'التيار يخرج من الموجب على اليسار، ويصل إلى الدايود من جهة المصعد (قاعدة المثلث)، فيمر في اتجاه المثلث وتضيء اللمبة.':'التيار يصل إلى الدايود من جهة المهبط (الخط)، أي عكس اتجاه المثلث، فلا يمر وتبقى اللمبة مطفأة.',cls:on?'':'warn'}}})},
    {title:'مختبر مصغّر: تعرّف الرمز',widget:(el,B)=>DCML.cases(el,B,{intro:'اختر اسم كل رمز من جدول ص 52.',cases:[
     {q:`ما هذا الرمز؟ ${SY.pnp()}`,opts:[['ترانزستور NPN',false,'في NPN يكون سهم الباعث خارجاً من القاعدة.'],['ترانزستور PNP',true,'سهم الباعث داخل نحو القاعدة.'],['ثايرستور',false,'الثايرستور مثلث وخط وبوابة.']]},
     {q:`ما هذا الرمز؟ ${SY.thyA()}`,opts:[['ثايرستور قابل للتحكم من جهة المصعد',true,'البوابة تخرج من جهة قاعدة المثلث (المصعد).'],['ثايرستور قابل للتحكم من جهة المهبط',false,'في هذا النوع تخرج البوابة من جهة الخط (المهبط).'],['داياك',false,'الداياك مثلثان متعاكسان بين خطين، بلا بوابة.']]},
     {q:`مربع مقطوع بقطر: في أعلاه «~» وفي أسفله «—». ما هو؟ ${SY.conv('ac','dc')}`,opts:[['محول جهد مستمر',false,'هذا «—» في الأعلى و«—» في الأسفل.'],['جهاز إمداد بالتيار (من متردد إلى مستمر)',true,'العلامة العليا الدخل والسفلى الخرج: متردد إلى مستمر، أي مقوّم.'],['محول (مقوم عكسي)',false,'هذا «—» في الأعلى و«~» في الأسفل: من مستمر إلى متردد.']]}]})},
    {watch:String.raw`<p>ص 52: اسم «محول ( مقوم عكسي )» للجهاز الذي يحول المستمر إلى متردد (العاكس <span class="ltr">Inverter</span>)، واسم «جهاز إمداد بالتيار ( محول )» للجهاز الذي يحول المتردد إلى مستمر (المقوم <span class="ltr">Rectifier</span>). التسميتان مربكتان؛ اعتمد على العلامتين داخل المربع. والرموز نفسها صحيحة.</p>`,fix:1}
   ]},

  {st:2,short:'البوابات المنطقية',title:'البوابات المنطقية',ref:'ص 53',
   q:'المستطيل نفسه لكل البوابات… فما الذي يحدد عمل كل بوابة؟',
   art:U2ST.art(
     U2ST.card(30,40,140,112)+U2ST.tip('بوابة «و» ⟦AND⟧: داخل المستطيل ⟦&amp;⟧. خرجها 1 إذا كانت كل المداخل 1.',U2ST.sym(SY.gate('&amp;',3),100,88,1.3),[34,44,132,104])+U2ST.t(100,142,'AND',{sz:13,mono:1})
    +U2ST.card(190,40,140,112)+U2ST.tip('بوابة «أو» ⟦OR⟧: داخل المستطيل ⟦≥1⟧. خرجها 1 إذا كان مدخل واحد على الأقل 1.',U2ST.sym(SY.gate('≥1',3),260,88,1.3),[194,44,132,104])+U2ST.t(260,142,'OR',{sz:13,mono:1})
    +U2ST.card(30,168,140,112)+U2ST.tip('بوابة «لا» ⟦NOT⟧: مدخل واحد، والدائرة الصغيرة على الخرج تعني النفي (قلب المدخل).',U2ST.sym(SY.gate('1',1,1),100,214,1.3),[34,172,132,104])+U2ST.t(100,270,'NOT',{sz:13,mono:1})
    +U2ST.card(190,168,140,112)+U2ST.tip('بوابة «أو منفية» ⟦NOR⟧: ⟦≥1⟧ ومعها دائرة النفي على الخرج.',U2ST.sym(SY.gate('≥1',3,1),260,214,1.3),[194,172,132,104])+U2ST.t(260,270,'NOR',{sz:13,mono:1}),
    'رموز البوابات AND وOR وNOT وNOR'),
   cap:'أربع بوابات من جدول <span class="ltr">ص 53</span>.<br><b>مرّر المؤشر على أي بوابة (أو المسها في الجوال) لتعرف عملها.</b>',
   side:[
    {predict:{q:'بوابة رمزها مستطيل بداخله ≥1 وعلى خرجها دائرة صغيرة. ما اسمها؟',opts:[
     ['OR',false,'OR بلا دائرة على الخرج.'],
     ['NAND',false,'NAND بداخلها &amp; لا ≥1.'],
     ['NOR',true,'≥1 = OR، والدائرة = نفي، فهي NOR (جدول ص 53).']]}}
   ],
   body:[
    {book:tableHTML('t53'),ref:'ص 53'},
    {tip:String.raw`<p>الرمز المكتوب داخل المستطيل يحدد عمل البوابة: <b class="ltr">&amp;</b> خرجها 1 إذا كانت كل المداخل 1، و<b class="ltr">≥1</b> خرجها 1 إذا كان مدخل واحد على الأقل 1، و<b class="ltr">1</b> مع دائرة النفي تقلب المدخل. والدائرة الصغيرة على خرج <span class="ltr">NAND</span> و<span class="ltr">NOR</span> تعني نفي خرج <span class="ltr">AND</span> و<span class="ltr">OR</span>.</p><p>تأتي البوابات في الكتاب بعد جدول إلكترونيات القدرة مباشرة، تحت العنوان نفسه.</p>`,title:'اقرأ ما داخل المستطيل'},
    {title:'مختبر مصغّر: جرّب البوابة',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر البوابة، واضغط المداخل لتجعلها 1 أو 0، وراقب الخرج.',
     predict:{q:'بوابة AND بثلاثة مداخل: مدخلان 1 ومدخل 0. ما الخرج؟',opts:[['1',false,'AND تحتاج كل المداخل 1.'],['0',true,'يكفي مدخل واحد 0 ليصير خرج AND صفراً.']]},
     ins:[{k:'g',l:'البوابة',seg:[['and','AND'],['or','OR'],['not','NOT'],['nand','NAND'],['nor','NOR']],v:'and'},
      {k:'a',l:'',sw:true,v:1,on:'المدخل الأول = 1',off:'المدخل الأول = 0'},{k:'b',l:'',sw:true,v:1,on:'المدخل الثاني = 1',off:'المدخل الثاني = 0'},{k:'c',l:'',sw:true,v:0,on:'المدخل الثالث = 1',off:'المدخل الثالث = 0'}],
     calc:s=>{const g=s.g,one=g==='not',ins=one?[s.a]:[s.a,s.b,s.c];const and=ins.every(x=>x),or=ins.some(x=>x);
      const y={and:and,or:or,not:!s.a,nand:!and,nor:!or}[g]?1:0;
      const sy=g==='and'?SY.gate('&amp;',3):g==='or'?SY.gate('≥1',3):g==='not'?SY.gate('1',1,1):g==='nand'?SY.gate('&amp;',3,1):SY.gate('≥1',3,1);
      const why={and:'خرج AND = 1 فقط إذا كانت كل المداخل 1.',or:'خرج OR = 1 إذا كان مدخل واحد على الأقل 1.',not:'NOT تقلب المدخل الوحيد (المدخلان الثاني والثالث لا يدخلان فيها).',nand:'NAND = نفي AND: خرجها 0 فقط إذا كانت كل المداخل 1.',nor:'NOR = نفي OR: خرجها 1 فقط إذا كانت كل المداخل 0.'}[g];
      return {pic:U2ST.pic(sy,2.2),facts:[['المداخل',ins.join(' ، ')],['الخرج',String(y),y?'hi':'bad']],msg:why}}})}
   ]},

  {recap:[
   'في جدولي ص 52–53 الرمز واحد في الدائرتين الرمزية والتنفيذية.',
   'مثلث الدايود يشير إلى اتجاه التيار، والخط عند رأسه المهبط؛ السهمان الداخلان = ضوئي، والخارجان = مشع.',
   'سهم الباعث خارج في NPN وداخل في PNP؛ وفي مربع المحول: العلامة العليا الدخل والسفلى الخرج.',
   'داخل مستطيل البوابة: &amp; = AND، ≥1 = OR، 1 = NOT؛ ودائرة على الخرج = نفي (NAND، NOR).']}
],
 theory:[
  {h:'٢-٣ رموز عناصر إلكترونيات القدرة',ref:'ص 52',html:`<p>في هذا الجدول يرسم الكتاب الرمز نفسه في عمودي الدائرة الرمزية والتنفيذية.</p>`+tableHTML('t52')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> في كل رموز الدايود يشير المثلث إلى اتجاه مرور التيار، والخط عند رأسه هو <b>المهبط</b> وقاعدة المثلث <b>المصعد</b>. الأسهم فوق الدايود تبيّن الضوء: داخلة = يستقبل الضوء (ضوئي)، خارجة = يُطلق الضوء (مشع). وفي الترانزستور يكون سهم الباعث خارجاً في NPN وداخلاً في PNP. وفي مربعات المحولات: العلامة في الأعلى نوع الدخل والعلامة في الأسفل نوع الخرج («—» مستمر، «~» متردد).`},
  {err:`<span class="fixnote">ص 52: اسم «محول ( مقوم عكسي )» للجهاز الذي يحول المستمر إلى متردد (العاكس Inverter)، واسم «جهاز إمداد بالتيار ( محول )» للجهاز الذي يحول المتردد إلى مستمر (المقوم Rectifier). التسميتان مربكتان؛ اعتمد على العلامتين داخل المربع. والرموز نفسها صحيحة.</span>`},
  {h:'البوابات المنطقية',ref:'ص 53',html:`<p>تأتي البوابات المنطقية في الكتاب بعد جدول إلكترونيات القدرة مباشرة، تحت العنوان نفسه.</p>`+tableHTML('t53')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> الرمز المكتوب داخل المستطيل يحدد عمل البوابة: <b class="ltr">&amp;</b> خرجها 1 إذا كانت كل المداخل 1، و<b class="ltr">≥1</b> خرجها 1 إذا كان مدخل واحد على الأقل 1، و<b class="ltr">1</b> مع دائرة النفي تقلب المدخل. والدائرة الصغيرة على خرج NAND وNOR تعني نفي خرج AND وOR.`}
 ],
 lab:(el,B)=>matchLab(el,B,{tables:['t52','t53'],pages:'ص 52–53',modes:[['ds','الوصف ↔ الرمز']],
   intro:'في هذين الجدولين الرمز واحد في الدائرتين الرمزية والتنفيذية، فالمطابقة هنا بين الوصف والرمز. اضغط وصفاً ثم رمزه (أو العكس).',tries:TRIES(18,0)}),
 quiz:[
  {q:'في رمز الدايود، الخط الرأسي عند رأس المثلث يمثل:',o:['المصعد','المهبط','البوابة','الباعث'],c:1,e:'التيار يمر في اتجاه المثلث نحو المهبط.'},
  {q:'كيف تميز رمز الدايود المشع من الدايود الضوئي (ص 52)؟',o:['المشع بلا أسهم','سهما المشع خارجان وسهما الضوئي داخلان','المشع له بوابة','لا فرق'],c:1,e:'المشع يُطلق الضوء فالسهمان خارجان.'},
  {q:'ثايرستور تخرج بوابته من جهة الخط (المهبط) هو:',o:['قابل للتحكم من جهة المصعد','قابل للتحكم من جهة المهبط','داياك','زينر'],c:1,e:'ص 52: «ثايرستور قابل للتحكم من جهة المهبط».'},
  {q:'في رمز الترانزستور NPN يكون سهم الباعث:',o:['داخلاً نحو القاعدة','خارجاً من القاعدة','على المجمّع','غير موجود'],c:1,e:'في PNP يكون داخلاً.'},
  {q:'مربع مقطوع بقطر، في أعلاه «~» وفي أسفله «—»، هو:',o:['محول جهد مستمر','العاكس (من مستمر إلى متردد)','جهاز إمداد بالتيار (من متردد إلى مستمر)','بوابة OR'],c:2,e:'العلامة العليا الدخل والسفلى الخرج: متردد إلى مستمر، أي مقوّم.'},
  {q:'بوابة رمزها مستطيل بداخله ≥1 وعلى خرجها دائرة صغيرة هي:',o:['AND','OR','NAND','NOR'],c:3,e:'≥1 = OR، والدائرة = نفي، فهي NOR.'}
 ]
});

/* =====================================================================
   LESSON 3 — ص 54–56
   ===================================================================== */
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'54–56',
 title:'رموز عناصر التحكم والحماية',
 summary:'الملامس المفتوح والمغلق وطرق تشغيله (يدوي، ميكانيكي، كهرومغناطيسي، تأخير زمني)، ومفاتيح القدرة والقواطع والمتمم الحراري والمطلقات I> وI< وU<.',
 stations:[
  {intro:true},

  {st:1,short:'الملامسات وتشغيلها',title:'٢-٤ رموز عناصر التحكم والحماية',ref:'ص 54',
   q:'الملامس واحد، لكن ما يحرّكه يختلف: يد، أو كامة، أو ملف، أو ملف مع تأخير… كيف يبين الرمز ذلك؟',
   art:U2ST.art(
     U2ST.card(30,40,140,112)+U2ST.tip('مفتاح وصل برجوع تلقائي: ملامس مفتوح ذراعه مائل بعيداً عن الطرف العلوي، والمثلث الصغير على الوصلة يعني الرجوع التلقائي.',U2ST.sym(SY.autoNO(),100,86,1.3),[34,44,132,104])+U2ST.t(100,142,'وصل برجوع تلقائي',{sz:11})
    +U2ST.card(190,40,140,112)+U2ST.tip('مفتاح فصل برجوع تلقائي: ملامس مغلق ذراعه يرتكز على شرطة الطرف العلوي.',U2ST.sym(SY.autoNC(),260,86,1.3),[194,44,132,104])+U2ST.t(260,142,'فصل برجوع تلقائي',{sz:11})
    +U2ST.card(30,168,140,112)+U2ST.tip('مفتاح مع تشغيل كهرومغناطيسي: المستطيل بطرفين ملف، والخط المنقط وصلة ميكانيكية منه إلى الملامس.',U2ST.sym(SY.emNO(),100,214,1.3),[34,172,132,104])+U2ST.t(100,270,'تشغيل كهرومغناطيسي',{sz:11})
    +U2ST.card(190,168,140,112)+U2ST.tip('مفتاح وصل تشغيل متأخر (⟦5s⟧): القوس «(» على الوصلة يعني أن التأخير عند وصل التيار للملف.',U2ST.sym(SY.delay(0,'(','5s'),260,212,1.25),[194,172,132,104])+U2ST.t(260,270,'وصل متأخر',{sz:11}),
    'أربعة رموز من جدول ص 54: وصل وفصل برجوع تلقائي، وتشغيل كهرومغناطيسي، ووصل متأخر'),
   cap:'رموز من جدول <span class="ltr">ص 54</span>: ملامس + ما يحرّكه.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف كيف تقرأ الرمز.</b>',
   side:[
    {predict:{q:'رمز ملامس على وصلته ∨ (حجز). ماذا يعني ذلك؟',opts:[
     ['يرجع وحده عند ترك المشغّل',false,'الرجوع التلقائي علامته المثلث الصغير.'],
     ['يبقى في وضعه بعد تشغيله',true,'∨ رمز الحجز: «مفتاح وصل بدون رجوع تلقائي» (ص 54).'],
     ['يعمل بتأخير زمني',false,'التأخير علامته القوس «(» أو «)».']]}}
   ],
   body:[
    {book:LEGEND+tableHTML('t54'),ref:'ص 54'},
    {tip:String.raw`<p>كل رمز هنا <b>ملامس</b> و«شيء يحركه». <b>ملامس الوصل</b> (مفتوح) ذراعه مائل بعيداً عن الطرف العلوي، و<b>ملامس الفصل</b> (مغلق) ذراعه يرتكز على شرطة الطرف العلوي. والخط المنقط وصلة ميكانيكية إلى المشغّل: المثلث = رجوع تلقائي، ∨ = حجز (يبقى في وضعه)، ⊏ = زر ضغط، ⊞ = قفل، مربع = تشغيل ميكانيكي، مستطيل بطرفين = ملف كهرومغناطيسي. وقوس التأخير على الوصلة: «(» يؤخر عند وصل التيار للملف، و«)» يؤخر عند فصله — هكذا تقرأ شروح الكتاب نفسها في الصفوف الأربعة.</p>`,title:'ملامس وما يحرّكه'},
    {title:'مختبر مصغّر: متى يتحرك ملامس التأخير؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر أحد مفاتيح التأخير الأربعة (ثلاثة في ص 54 والرابع أول صف في ص 55). الملف يوصل عند الثانية 1 ويبقى موصولاً المدة التي تختارها. <span class="ml-tag">أرقام تختارها أنت</span> مدة بقاء الملف موصولاً؛ أما <span class="ltr">5 s</span> و<span class="ltr">3 s</span> فمن الكتاب.',
     predict:{q:'«مفتاح وصل تشغيل متأخر 5s» وصلنا ملفه ثانيتين فقط ثم فصلناه. هل يغلق الملامس؟',opts:[['نعم، بعد 5 ثوانٍ',false,'الملامس يغلق بعد خمس ثوانٍ «من وصل التيار لملف التشغيل»، والملف فُصل قبل ذلك.'],['لا يغلق أبداً في هذه المرة',true,'لم يبق الملف موصولاً خمس ثوانٍ، فلم يكتمل التأخير. جرّب مدة 2 ثم 8 في الأسفل.'],['يغلق فوراً',false,'الإغلاق الفوري هو مفتاح الوصل العادي، لا المتأخر.']]},
     ins:[{k:'t',l:'نوع المفتاح',seg:[['a','وصل متأخر 5s'],['b','وصل، يفصل بعد 3s'],['c','فصل، يوصل بعد 3s'],['d','فصل متأخر 5s']],v:'a'},
      {k:'D',l:'مدة بقاء الملف موصولاً',u:'s',min:1,max:12,step:1,v:8,dp:0}],
     calc:s=>{const on=1,off=1+s.D;const R={a:{no:1,d:5,at:'on'},b:{no:1,d:3,at:'off'},c:{no:0,d:3,at:'off'},d:{no:0,d:5,at:'on'}}[s.t];
      const st=t=>{const coil=t>=on&&t<off;let act;if(R.at==='on')act=coil&&t>=on+R.d;else act=coil||(t>=off&&t<off+R.d);return R.no?(act?1:0):(act?0:1)};
      const pts=[],cp=[];for(let i=0;i<=400;i++){const t=i*20/400;pts.push([t,st(t)]);cp.push([t,(t>=on&&t<off?1:0)+1.6])}
      const nm={a:'مفتاح وصل تشغيل متأخر (5s): يغلق بعد خمس ثوانٍ من وصل التيار لملف التشغيل.',b:'مفتاح وصل لتشغيل متأخر (3s): يصل فور وصول التيار للملف، ويبقى موصولاً بعد فصل الملف ثلاث ثوانٍ ثم يفصل.',c:'مفتاح فصل تشغيل متأخر (3s): يفصل فوراً، ويوصل من جديد بعد ثلاث ثوانٍ من فصل الملف.',d:'مفتاح فصل تشغيل متأخر (5s): يفصل بعد خمس ثوانٍ من وصول التيار للملف.'}[s.t];
      const sy=s.t==='a'?SY.delay(0,'(','5s'):s.t==='b'?SY.delay(0,')','3s'):s.t==='c'?SY.delay(1,')','3s'):SY.delay(1,'(','5s');
      let warn='';if(R.at==='on'&&s.D<R.d)warn=' لاحظ: الملف لم يبق موصولاً خمس ثوانٍ، فلم يتحرك الملامس أبداً.';
      return {pic:U2ST.pic(sy,1.8),plot:{xr:[0,20],yr:[-0.3,3],xl:'t (s)',yl:'',noYt:true,curves:[{pts:cp,col:'--live'},{pts,col:'--blue'}],aria:'حالة الملف والملامس مع الزمن'},
       msg:`<b>${nm}</b> في الرسم: الخط العلوي البرتقالي حالة <b>الملف</b> (مرتفع = موصول)، والسفلي الأخضر حالة <b>الملامس</b> (مرتفع = مغلق).${warn}`,cls:warn?'warn':''}}})},
    {watch:String.raw`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 54–55: في صفوف التأخير الزمني الأربعة كتب الكتاب شرحاً نصياً في عمود الرمز التنفيذي بدل الرمز؛ نقلناه كما هو. والرمز التنفيذي لهذه المفاتيح هو نفسه الرمزي، كما في باقي الجدول.</li><li>شرح الصف الثاني «…ثم يفصل بعد ثلاث ثوانٍ ثم فصل الملف» مرتبك. المقصود: يصل فور وصول التيار للملف، ويبقى موصولاً بعد فصل الملف ثلاث ثوانٍ ثم يفصل (تأخير عند الفصل، القوس «)»).</li><li>اسما الصفين الأولين متقاربان («مفتاح وصل تشغيل متأخر» و«مفتاح وصل لتشغيل متأخر»)، واسم «مفتاح فصل تشغيل متأخر» مكرر لصفين مختلفين (3s بقوس «)» و5s بقوس «(»). فرّق بينهما بالقوس والشرح.</li><li>«لكنة» في الكتاب خطأ طباعي، والصحيح «لكنه».</li></ul>`,fix:1}
   ]},

  {st:2,short:'القدرة والقواطع والمطلقات',title:'تابع الجدول: مفاتيح القدرة والقواطع والمطلقات',ref:'ص 55',
   q:'المحرك سخن من زيادة الحمل… من الذي يفصل الكونتاكتور، والملف لا يعرف شيئاً عن الحرارة؟',
   art:U2ST.art(
     U2ST.card(30,40,300,140)+U2ST.tip('مفتاح تلامس مع قاطع حراري (الدائرة التنفيذية): ملف يغلق ثلاثة ملامسات قدرة، وتحتها العناصر الحرارية، ومن طرف الملف ملامس فصل يفتحه الحراري.',U2ST.sym(SY.ctW(),180,110,1.2),[40,46,280,128])+U2ST.t(180,172,'كونتاكتور مع حراري',{sz:12})
    +U2ST.card(30,196,92,90)+U2ST.tip('مؤقت زمني يؤخر عند التوصيل: مربع بداخله ⟦X⟧ في جانب المستطيل.',U2ST.sym(SY.tOn(),76,232,1.05),[34,200,84,82])+U2ST.t(76,276,'يؤخر عند التوصيل',{sz:9.5})
    +U2ST.card(134,196,92,90)+U2ST.tip('مؤقت زمني يؤخر عند الفصل: المربع في جانب المستطيل مصمت.',U2ST.sym(SY.tOff(),180,232,1.05),[138,200,84,82])+U2ST.t(180,276,'يؤخر عند الفصل',{sz:9.5})
    +U2ST.card(238,196,92,90)+U2ST.tip('قاطع عند الجهد المنخفض (تنفيذي): مستطيل فيه ⟦U&lt;⟧ — يفصل إذا انخفض الجهد.',U2ST.sym(SY.relW('U&lt;'),284,234,0.95),[242,200,84,82])+U2ST.t(284,276,'جهد منخفض',{sz:9.5}),
    'رموز الكونتاكتور مع الحراري والمؤقتين ومطلق الجهد المنخفض'),
   cap:'رموز من جدول <span class="ltr">ص 55</span>.<br><b>مرّر المؤشر على أي رمز (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'في رمز المؤقت الزمني، المربع الصغير في جانب المستطيل <b>مصمت</b>. ماذا يعني؟',opts:[
     ['يؤخر عند الفصل',true,'المربع المصمت = «مؤقت زمني يؤخر عند الفصل»، والمربع الذي بداخله X = يؤخر عند التوصيل (ص 55).'],
     ['يؤخر عند التوصيل',false,'هذا المربع الذي بداخله X.'],
     ['متمم حراري',false,'المتمم الحراري مستطيل يمر به خط متعرج.']]}}
   ],
   body:[
    {book:tableHTML('t55'),ref:'ص 55'},
    {tip:String.raw`<p>«مفتاح قابض» المقصود به مفتاح بقفل (قاطع يدوي يُمسك في وضع الوصل). و«مفتاح تلامس» هو الكونتاكتور: ملف يغلق ثلاثة ملامسات قدرة، وتحتها العناصر الحرارية، ومن طرف الملف ملامس فصل يفتحه الحراري عند زيادة الحمل فينقطع تيار الملف.</p>`,title:'قابض وتلامس'},
    {title:'مختبر مصغّر: الحراري يفصل الكونتاكتور',widget:(el,B)=>DCML.lab(el,B,{intro:'شغّل الملف ثم اجعل الحمل يزيد، وتتبّع السلسلة: الحراري ← ملامس الفصل ← الملف ← ملامسات القدرة.',
     predict:{q:'الملف موصول والمحرك يعمل، ثم زاد الحمل. ماذا يحدث؟',opts:[['يستمر المحرك لأن الملف ما زال موصولاً بالمصدر',false,'ملامس الفصل الذي يفتحه الحراري على التوالي مع الملف، فينقطع تيار الملف.'],['ينفصل الكونتاكتور ويقف المحرك',true,'الحراري يفتح ملامس الفصل، فينقطع تيار الملف، فتنفتح ملامسات القدرة الثلاثة.'],['يحترق المصهر',false,'الرمز هنا للحماية الحرارية لا للمصهر.']]},
     ins:[{k:'c',l:'',sw:true,v:1,on:'تيار الملف: موصول — اضغط للفصل',off:'تيار الملف: مفصول — اضغط للوصل'},{k:'o',l:'',sw:true,v:0,on:'الحمل: زائد — اضغط ليعود طبيعياً',off:'الحمل: طبيعي — اضغط لزيادته'}],
     calc:s=>{const nc=!s.o,coil=s.c&&nc;return {pic:U2ST.pic(SY.ctW(),1.7),
      facts:[['ملامس الحراري (فصل)',nc?'مغلق':'مفتوح',nc?'':'bad'],['ملف الكونتاكتور',coil?'فيه تيار':'بلا تيار',coil?'hi':''],['ملامسات القدرة',coil?'مغلقة':'مفتوحة',coil?'hi':''],['المحرك',coil?'يعمل':'متوقف',coil?'hi':'bad']],
      msg:s.o?'الحمل زائد: العنصر الحراري فتح ملامس الفصل الموصول مع الملف، فانقطع تيار الملف وانفتحت ملامسات القدرة.':s.c?'الملف فيه تيار فأغلق ملامسات القدرة الثلاثة.':'لا تيار في الملف، فالملامسات مفتوحة.',cls:s.o?'warn':''}}})},
    {title:'مختبر مصغّر: أي مطلق؟',widget:(el,B)=>DCML.cases(el,B,{intro:'اقرأ الحرف والإشارة داخل المستطيل: I للتيار وU للجهد، و&gt; زيادة و&lt; نقص.',cases:[
     {q:`ما هذا الرمز التنفيذي؟ ${SY.relW('I &gt;')}`,opts:[['قاطع ضد التيار المنخفض',false,'التيار المنخفض علامته I&lt;.'],['قاطع كهرومغناطيسي ضد زيادة التيار',true,'I&gt;: يعمل إذا زاد التيار عن الحد (ص 55).'],['قاطع عند الجهد المنخفض',false,'الجهد علامته U.']]},
     {q:`ما هذا الرمز التنفيذي؟ ${SY.relW('U&lt;')}`,opts:[['قاطع عند الجهد المنخفض',true,'U&lt;: يفصل إذا انخفض الجهد (ص 55).'],['قاطع ضد التيار المنخفض',false,'التيار علامته I.'],['متمم حراري',false,'المتمم الحراري مستطيل يمر به خط متعرج.']]}]})}
   ]},

  {st:3,short:'جهد الخلل والمصهر',title:'تابع الجدول: قاطع جهد الخلل والمصهر',ref:'ص 56',
   q:'المصهر من أبسط عناصر الحماية… فكيف يُرسم؟',
   art:U2ST.art(
     U2ST.card(40,60,130,170,'#FFF4D6')+U2ST.tip('قاطع عند جهد الخلل: مستطيل بداخله ⊣⟦U&lt;⟧. الكتاب رسمه في العمود التنفيذي فقط، واستعملناه في الرمزي أيضاً.',U2ST.sym(SY.relW('',1),105,140,1.5),[44,64,122,162])+U2ST.t(105,214,'جهد الخلل',{sz:12})
    +U2ST.card(190,60,130,170,'#FFF4D6')+U2ST.tip('المصهر — إضافة من خارج الكتاب (⟦IEC 60617⟧): مستطيل يمر به الخط على طوله، والرمز نفسه في الدائرتين. صفه فارغ في الكتاب.',U2ST.sym(SY.fuse(),255,140,1.6),[194,64,122,162])+U2ST.t(255,214,'مصهر',{sz:12})
    +U2ST.t(180,270,'آخر صفين في جدول التحكم والحماية',{sz:13}),
    'رمزا قاطع جهد الخلل والمصهر'),
   cap:'خانتان أكملناهما (بخلفية صفراء).<br><b>مرّر المؤشر على الرمزين (أو المسهما في الجوال) لتعرف مصدرهما.</b>',
   side:[
    {predict:{q:'ما رمز المصهر الذي استعملناه لإكمال الصف الفارغ؟',opts:[
     ['مستطيل يمر به الخط على طوله',true,'هذا رمز المصهر في IEC 60617، وهو نفسه في الدائرتين.'],
     ['دائرة بداخلها X',false,'هذا رمز اللمبة.'],
     ['خط متعرج داخل مستطيل',false,'هذا رمز المتمم الحراري (ص 55).']]}}
   ],
   body:[
    {book:tableHTML('t56'),ref:'ص 56'},
    {add:String.raw`<p>المصهر في <span class="ltr">IEC 60617</span> مستطيل يمر به الخط على طوله، وهو الرمز نفسه في الدائرتين. ولقاطع جهد الخلل لم يرسم الكتاب رمزاً في الدائرة الرمزية؛ استعملنا فيها رمزه التنفيذي نفسه (مستطيل بداخله ⊣<span class="ltr">U&lt;</span>) كما يفعل الكتاب مع أغلب عناصر هذا الجدول.</p>`,title:'الخانات الفارغة في ص 56'},
    {title:'تحقق سريع: رموز التحكم والحماية',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب جداول ص 54–56.',items:[
     ['ذراع ملامس الفصل (المغلق) يرتكز على شرطة صغيرة في الطرف العلوي.',true,'وذراع ملامس الوصل مائل بعيداً عن الطرف العلوي.'],
     ['شرطة مائلة ورقم 3 على خط مفتاح القدرة تعني ثلاث ثوانٍ.',false,'تعني ثلاثة أقطاب (ثلاثة خطوط)، وفي التنفيذية تظهر ثلاثة ملامسات متوازية بتشغيل مشترك.'],
     ['القوس «(» على الوصلة يعني تأخيراً عند وصل التيار للملف.',true,'مثل «مفتاح الوصل يغلق بعد خمس ثوانٍ من وصل التيار لملف التشغيل».'],
     ['U&lt; في المستطيل تعني قاطعاً يعمل عند زيادة التيار.',false,'U للجهد و&lt; للانخفاض: قاطع عند الجهد المنخفض.']]})},
    {watch:String.raw`<p>«ضد زيادة التيار الزائد» (ص 55) تكرار في المعنى، والمقصود: ضد زيادة التيار. وعنوان ٢-٤ في الفهرس «رموز عناصر التحكم والصيانة» وفي المتن «…والحماية».</p>`,fix:1}
   ]},

  {recap:[
   'كل رمز تحكم = ملامس (وصل مفتوح أو فصل مغلق) + وصلة منقطة إلى ما يحرّكه (ص 54).',
   'المثلث رجوع تلقائي، و∨ حجز، والمستطيل بطرفين ملف كهرومغناطيسي؛ وقوس «(» تأخير عند الوصل و«)» تأخير عند الفصل.',
   'الكونتاكتور مع الحراري: الحراري يفتح ملامس فصل مع الملف فتنفتح ملامسات القدرة (ص 55).',
   'I&gt; زيادة تيار، I&lt; نقص تيار، U&lt; جهد منخفض؛ والمصهر مستطيل يمر به الخط (إضافة من IEC 60617، ص 56).']}
],
 theory:[
  {h:'٢-٤ رموز عناصر التحكم والحماية',ref:'ص 54',html:LEGEND+tableHTML('t54')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> كل رمز هنا <b>ملامس</b> و«شيء يحركه». <b>ملامس الوصل</b> (مفتوح) ذراعه مائل بعيداً عن الطرف العلوي، و<b>ملامس الفصل</b> (مغلق) ذراعه يرتكز على شرطة الطرف العلوي. والخط المنقط وصلة ميكانيكية إلى المشغّل: المثلث = رجوع تلقائي، ∨ = حجز (يبقى في وضعه)، ⊏ = زر ضغط، ⊞ = قفل، مربع = تشغيل ميكانيكي، مستطيل بطرفين = ملف كهرومغناطيسي. وقوس التأخير على الوصلة: «(» يؤخر عند وصل التيار للملف، و«)» يؤخر عند فصله — هكذا تقرأ شروح الكتاب نفسها في الصفوف الأربعة.`},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 54–55: في صفوف التأخير الزمني الأربعة كتب الكتاب شرحاً نصياً في عمود الرمز التنفيذي بدل الرمز؛ نقلناه كما هو. والرمز التنفيذي لهذه المفاتيح هو نفسه الرمزي، كما في باقي الجدول.</li><li>شرح الصف الثاني «…ثم يفصل بعد ثلاث ثوانٍ ثم فصل الملف» مرتبك. المقصود: يصل فور وصول التيار للملف، ويبقى موصولاً بعد فصل الملف ثلاث ثوانٍ ثم يفصل (تأخير عند الفصل، القوس «)»).</li><li>اسما الصفين الأولين متقاربان («مفتاح وصل تشغيل متأخر» و«مفتاح وصل لتشغيل متأخر»)، واسم «مفتاح فصل تشغيل متأخر» مكرر لصفين مختلفين (3s بقوس «)» و5s بقوس «(»). فرّق بينهما بالقوس والشرح.</li><li>«لكنة» في الكتاب خطأ طباعي، والصحيح «لكنه».</li></ul>`},
  {h:'تابع الجدول',ref:'ص 55',html:tableHTML('t55')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> «مفتاح قابض» المقصود به مفتاح بقفل (قاطع يدوي يُمسك في وضع الوصل). و«مفتاح تلامس» هو الكونتاكتور: ملف يغلق ثلاثة ملامسات قدرة، وتحتها العناصر الحرارية، ومن طرف الملف ملامس فصل يفتحه الحراري عند زيادة الحمل فينقطع تيار الملف.`},
  {h:'تابع الجدول',ref:'ص 56',html:tableHTML('t56')},
  {note:`<b>إضافة من خارج الكتاب:</b> المصهر في IEC 60617 مستطيل يمر به الخط على طوله، وهو الرمز نفسه في الدائرتين. ولقاطع جهد الخلل لم يرسم الكتاب رمزاً في الدائرة الرمزية؛ استعملنا فيها رمزه التنفيذي نفسه (مستطيل بداخله ⊣U&lt;) كما يفعل الكتاب مع أغلب عناصر هذا الجدول.`},
  {err:`<span class="fixnote">«ضد زيادة التيار الزائد» (ص 55) تكرار في المعنى، والمقصود: ضد زيادة التيار. وعنوان ٢-٤ في الفهرس «رموز عناصر التحكم والصيانة» وفي المتن «…والحماية».</span>`}
 ],
 lab:(el,B)=>matchLab(el,B,{tables:['t54','t55','t56'],pages:'ص 54–56',tries:TRIES(24,1)}),
 quiz:[
  {q:'كيف تميز ملامس الفصل (المغلق) من ملامس الوصل (المفتوح) في الرسم؟',o:['الفصل أطول','ذراع الفصل يرتكز على شرطة صغيرة في الطرف العلوي','الوصل له دائرة','لا فرق'],c:1,e:'ذراع ملامس الوصل مائل بعيداً عن الطرف العلوي.'},
  {q:'المثلث الصغير على الوصلة يعني:',o:['حجزاً','رجوعاً تلقائياً','تأخيراً زمنياً','قفلاً'],c:1,e:'ص 54: «مفتاح وصل برجوع تلقائي».'},
  {q:'في رمز المؤقت الزمني (ص 55)، المربع الذي بداخله X في جانب المستطيل يعني أن المؤقت:',o:['يؤخر عند التوصيل','يؤخر عند الفصل','متمم حراري','مطلق جهد منخفض'],c:0,e:'المربع المصمت = يؤخر عند الفصل (ص 55).'},
  {q:'رمز تنفيذي: مستطيل بطرفين بداخله U<، هو:',o:['قاطع ضد زيادة التيار','قاطع ضد التيار المنخفض','قاطع عند الجهد المنخفض','مصهر'],c:2,e:'U للجهد و< للانخفاض.'},
  {q:'شرطة مائلة ورقم 3 على خط في الدائرة الرمزية لمفتاح القدرة تعني:',o:['ثلاث ثوانٍ','ثلاثة أقطاب (خطوط)','ثلاثة مفاتيح على التوالي','تيار 3 A'],c:1,e:'في التنفيذية تظهر ثلاثة ملامسات متوازية بتشغيل مشترك.'},
  {q:'«مفتاح الوصل يغلق بعد خمس ثوانٍ من وصل التيار لملف التشغيل» — أي قوس على الوصلة؟',o:['«(»','«)»','مثلث','∨'],c:0,e:'«(» تأخير عند الوصل في رموز ص 54–55.'}
 ]
});

/* =====================================================================
   LESSON 4 — ص 57–60
   ===================================================================== */
B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'57–60',
 title:'رموز الآلات الكهربائية والمحولات',
 summary:'رموز المحولات (أحادي، قابل للضبط، ذاتي، نجمة/دلتا، محولات القياس)، وآلات التيار المستمر بأنواع تغذية مجالها، والمحركات أحادية الوجه بمكثف والمحرك ثلاثي الأوجه نجمة ودلتا.',
 stations:[
  {intro:true},

  {st:1,short:'المحولات',title:'٢-٥ رموز عناصر الآلات الكهربائية: المحولات',ref:'ص 57',
   q:'دائرتان متداخلتان في الرمزية، ومستطيلان أسودان في التنفيذية… كيف تعرف من الرسم أن المحول ذاتي؟',
   art:U2ST.art(
     U2ST.card(30,40,140,118)+U2ST.tip('محول أحادي الوجه بملفين منفصلين (رمزي): كل دائرة ملف، فالدائرتان المتداخلتان ملفان.',U2ST.sym(SY.tr2S(),100,92,1.2),[34,44,132,110])+U2ST.t(100,148,'محول — رمزي',{sz:11})
    +U2ST.card(190,40,140,118)+U2ST.tip('المحول نفسه (تنفيذي): كل ملف مستطيل أسود مصمت، وتظهر أطرافه الأربعة.',U2ST.sym(SY.tr2W(),260,92,1.3),[194,44,132,110])+U2ST.t(260,148,'محول — تنفيذي',{sz:11})
    +U2ST.card(30,170,140,118)+U2ST.tip('محول ذاتي (رمزي): دائرة واحدة يخرج منها الخرج من نقطة على الملف نفسه.',U2ST.sym(SY.autoS(),100,220,1.15),[34,174,132,110])+U2ST.t(100,278,'ذاتي — رمزي',{sz:11})
    +U2ST.card(190,170,140,118)+U2ST.tip('محول ذاتي (تنفيذي): مستطيل أسود واحد يؤخذ منه طرف من وسطه.',U2ST.sym(SY.autoW(),260,222,1.3),[194,174,132,110])+U2ST.t(260,278,'ذاتي — تنفيذي',{sz:11}),
    'رموز المحول بملفين والمحول الذاتي في الدائرتين'),
   cap:'المحول بملفين والمحول الذاتي كما في جدول <span class="ltr">ص 57</span>.<br><b>مرّر المؤشر على أي رمز (أو المسه في الجوال) لتعرف كيف تقرأه.</b>',
   side:[
    {predict:{q:'رمز تنفيذي: مستطيل أسود واحد، وطرف يخرج من وسطه. ما هو؟',opts:[
     ['محول بملفين منفصلين',false,'المحول بملفين يُرسم مستطيلين أسودين منفصلين.'],
     ['محول ذاتي',true,'ملف واحد مشترك بين الابتدائي والثانوي، يؤخذ الخرج من نقطة فيه (ص 57).'],
     ['محول تيار',false,'محول التيار في التنفيذية مستطيل رفيع بجانب الخط المار به.']]}}
   ],
   body:[
    {book:LEGEND+tableHTML('t57'),ref:'ص 57'},
    {tip:String.raw`<p>في الدائرة الرمزية يُرسم كل ملف دائرة، فالمحول بملفين دائرتان متداخلتان. وفي الدائرة التنفيذية يرسم الكتاب كل ملف <b>مستطيلاً أسود مصمتاً</b> (أسلوب المواصفة الألمانية القديمة) وتظهر كل أطرافه. السهم المائل يعني «قابل للضبط»، والخطاف في نهايته ضبط على مراحل.</p>`,title:'دائرة أم مستطيل؟'},
    {title:'مختبر مصغّر: المحول بالرسمين',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر المحول، ثم بدّل بين الدائرتين وقارن.',
     ins:[{k:'t',l:'المحول',seg:[['tr2','بملفين'],['trAdj','قابل للضبط'],['auto','ذاتي'],['autoAdj','ذاتي قابل للضبط'],['yd','نجمة / دلتا'],['ctr','محول تيار']],v:'tr2'},{k:'w',l:'الدائرة',seg:[['S','الرمزية'],['W','التنفيذية']],v:'S'}],
     calc:s=>{const nm={tr2:'محول آحادي الوجه بملفين منفصلين',trAdj:'محول آحادي الوجه قابل للضبط على مراحل',auto:'محول ذاتي',autoAdj:'محول ذاتي قابل للضبط',yd:'محول ثلاثي نجمة / دلتا',ctr:'محول تيار'}[s.t];
      const hint={tr2:'ملفان: دائرتان أو مستطيلان.',trAdj:'السهم المائل بخطاف في نهايته = ضبط على مراحل.',auto:'ملف واحد يؤخذ منه الخرج من نقطة وسطه.',autoAdj:'ملف واحد والسهم المائل = قابل للضبط.',yd:'في الرمزي علامة النجمة في دائرة والمثلث في الأخرى، والشرطة و3 = ثلاثة أوجه.',ctr:'الخط المار بالمحول هو الابتدائي، ويخرج الثانوي إلى جهاز القياس.'}[s.t];
      return {pic:U2ST.pic(SY[s.t+s.w](),1.9),msg:`<b>${nm}</b> — ${s.w==='S'?'الدائرة الرمزية':'الدائرة التنفيذية'} (جدول ص 57). ${hint}`}}})}
   ]},

  {st:2,short:'آلات التيار المستمر',title:'تابع الجدول: محول الجهد وآلات التيار المستمر',ref:'ص 58',
   q:'المنتج نفسه والفرشتان نفسهما… ما الذي يجعل آلة التيار المستمر «توازي» أو «توالي»؟',
   art:U2ST.art(
     U2ST.card(24,40,152,130)+U2ST.tip('مولد تيار مستمر منفصل التغذية (تنفيذي): المنتج بين ⟦A1⟧ و⟦A2⟧، وملف المجال بين ⟦F1⟧ و⟦F2⟧ يتغذى من مصدر مستقل.',U2ST.sym(SY.sepW('G'),100,98,1.15),[28,44,144,122])+U2ST.t(100,160,'منفصل التغذية',{sz:11})
    +U2ST.card(184,40,152,130)+U2ST.tip('مولد تيار مستمر توازي (تنفيذي): ملف المجال ⟦E1–E2⟧ على التوازي مع المنتج ⟦A1–A2⟧.',U2ST.sym(SY.shW('G'),260,98,1.15),[188,44,144,122])+U2ST.t(260,160,'توازي',{sz:11})
    +U2ST.card(104,180,152,120)+U2ST.tip('مولد تيار مستمر توالي (تنفيذي): ملف المجال ⟦D1–D2⟧ على التوالي مع المنتج.',U2ST.sym(SY.seW('G'),180,232,1.1),[108,184,144,112])+U2ST.t(180,290,'توالي',{sz:11}),
    'رموز مولد التيار المستمر منفصل التغذية والتوازي والتوالي'),
   cap:'ثلاثة أنواع لتغذية المجال من جدول <span class="ltr">ص 58</span>.<br><b>مرّر المؤشر على أي رمز (أو المسه في الجوال) لتعرف أطرافه.</b>',
   side:[
    {predict:{q:'في رسوم آلات التيار المستمر، الطرفان D1–D2 هما طرفا:',opts:[
     ['المنتج',false,'المنتج A1–A2 (الفرشتان).'],
     ['مجال التوازي',false,'مجال التوازي E1–E2.'],
     ['مجال التوالي',true,'D1–D2 مجال التوالي، يتصل على التوالي مع المنتج (ص 58).']]}}
   ],
   body:[
    {book:tableHTML('t58'),ref:'ص 58'},
    {tip:String.raw`<p>رموز أطراف الآلات في الرسوم: <span class="ltr">A1–A2</span> المنتج (الفرشتان، المربعان الأسودان)، <span class="ltr">F1–F2</span> مجال منفصل التغذية، <span class="ltr">E1–E2</span> مجال التوازي، <span class="ltr">D1–D2</span> مجال التوالي، <span class="ltr">U1–U2</span> الملف الرئيس و<span class="ltr">Z1–Z2</span> الملف المساعد في المحرك أحادي الوجه، و<span class="ltr">U V W</span> أطراف المحرك ثلاثي الأوجه. والخط تحت <span class="ltr">G</span> أو <span class="ltr">M</span> يعني تياراً مستمراً.</p>`,title:'أسماء الأطراف'},
    {add:String.raw`<p>العمود التنفيذي فارغ في الكتاب لمولد ومحرك التيار المستمر، ولمولد ومحرك التيار المتردد ثلاثي الأوجه، والمحرك أحادي الوجه (ص 58). رسمناه على أسلوب الكتاب نفسه: دائرة الآلة بفرشاتيها <span class="ltr">A1</span> و<span class="ltr">A2</span> للتيار المستمر، وبأطرافها <span class="ltr">U V W</span> أو <span class="ltr">U1 U2</span> للتيار المتردد.</p>`,title:'الخانات الفارغة في ص 58'},
    {title:'مختبر مصغّر: كيف يتصل ملف المجال؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر طريقة تغذية المجال، وتتبّع في الرسم أين يتصل ملف المجال بالمنتج.',
     ins:[{k:'f',l:'تغذية المجال',seg:[['sep','منفصل التغذية'],['sh','توازي'],['se','توالي'],['cp','مركب']],v:'sep'},{k:'m',l:'الآلة',seg:[['G','مولد G'],['M','محرك M']],v:'G'}],
     calc:s=>{const sy={sep:SY.sepW,sh:SY.shW,se:SY.seW,cp:SY.cpW}[s.f](s.m);
      const m={sep:'المجال <span class="ltr">F1–F2</span> لا يتصل بالمنتج <span class="ltr">A1–A2</span>: له مصدر خاص.',sh:'المجال <span class="ltr">E1–E2</span> بين طرفي المنتج <span class="ltr">A1</span> و<span class="ltr">A2</span>: على التوازي.',se:'المجال <span class="ltr">D1–D2</span> في طريق تيار المنتج نفسه: <span class="ltr">A2</span> متصل بـ <span class="ltr">D1</span>، والطرفان الخارجيان <span class="ltr">A1</span> و<span class="ltr">D2</span>.',cp:'ملفان للمجال: توازي <span class="ltr">E1–E2</span> وتوالي <span class="ltr">D1–D2</span>.'}[s.f];
      const pg=s.f==='cp'||(s.m==='M'&&s.f!=='sep')?'ص 59':'ص 58';
      return {pic:U2ST.pic(sy,1.9),msg:`${m} (جدول ${pg}).${s.m==='M'&&s.f==='sh'?' <span class="ml-tag">إضافة</span> صف «محرك تيار مستمر توازي» فارغ في الكتاب، فرسمناه مثل المولد التوازي.':''}`}}})},
    {watch:String.raw`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 58: في الرمز التنفيذي لمولد التيار المستمر منفصل التغذية حرف «G» زائد مطبوع بجوار F2؛ حذفناه من الرسم.</li><li>ص 58: في الرمز الرمزي لمولد التيار المستمر التوالي سقط الخط تحت G (وهو موجود في رمزه التنفيذي وفي باقي آلات التيار المستمر)؛ رسمناه بالخط.</li></ul>`,fix:1}
   ]},

  {st:3,short:'المحركات بمكثف',title:'تابع الجدول: المحركات',ref:'ص 59',
   q:'مكثف البدء يساعد المحرك على الإقلاع… فمن يخرجه من الدائرة بعد أن يدور المحرك؟',
   art:U2ST.art(
     U2ST.card(24,40,140,170)+U2ST.tip('محرك أحادي الوجه مع مكثف تشغيل (رمزي): الملف الرئيس بين ⟦U1⟧ و⟦U2⟧، والمكثف على فرع الملف المساعد.',U2ST.sym(SY.capRunS(),94,124,1.3),[28,44,132,162])+U2ST.t(94,200,'مكثف تشغيل',{sz:11})
    +U2ST.card(172,40,164,170)+U2ST.tip('مع مكثف بدء ومكثف تشغيل (تنفيذي): مكثف البدء على التوالي مع ملامس فصل يحركه مربع ⟦n&gt;⟧ — مفتاح الطرد المركزي.',U2ST.sym(SY.capSRW(),254,122,0.98),[176,44,156,162])+U2ST.t(254,200,'مكثف بدء وتشغيل',{sz:11})
    +U2ST.t(180,250,'مفتاح الطرد المركزي يفصل',{sz:13})+U2ST.t(180,272,'مكثف البدء بعد أن تكبر السرعة',{sz:13}),
    'محرك أحادي الوجه بمكثف تشغيل، ومحرك بمكثف بدء ومكثف تشغيل'),
   cap:'محركان من جدول <span class="ltr">ص 59</span>.<br><b>مرّر المؤشر على الرمزين (أو المسهما في الجوال) لتعرف أجزاءهما.</b>',
   side:[
    {predict:{q:'في المحرك أحادي الوجه بمكثف بدء ومكثف تشغيل، ما الذي يفصل مكثف البدء؟',opts:[
     ['المصهر',false,'لا يوجد مصهر في هذا الرمز.'],
     ['مفتاح الطرد المركزي n&gt;',true,'ملامس فصل يحركه مربع n&gt; على التوالي مع مكثف البدء (ص 59).'],
     ['المتمم الحراري',false,'المتمم الحراري للحماية من زيادة الحمل، وليس في هذا الرمز.']]}}
   ],
   body:[
    {book:tableHTML('t59'),ref:'ص 59'},
    {add:String.raw`<p>صف «محرك تيار مستمر توازي» فارغ تماماً في الكتاب (ص 59). رسمناه مثل «مولد تيار مستمر توازي» في ص 58 مع الحرف <span class="ltr">M</span>: المجال <span class="ltr">E1–E2</span> على التوازي مع المنتج <span class="ltr">A1–A2</span>.</p>`,title:'الصف الفارغ في ص 59'},
    {title:'مختبر مصغّر: مفتاح الطرد المركزي',widget:(el,B)=>DCML.lab(el,B,{intro:'ابدأ والمحرك متوقف، ثم اجعله يدور وتكبر سرعته، وراقب ملامس <span class="ltr">n&gt;</span>.',
     ins:[{k:'r',l:'',sw:true,v:0,on:'السرعة كبرت — اضغط لإيقاف المحرك',off:'المحرك متوقف / يبدأ الدوران — اضغط لتكبر السرعة'}],
     calc:s=>({pic:U2ST.pic(SY.capSRW(),1.6),facts:[['ملامس n&gt;',s.r?'مفتوح':'مغلق',s.r?'bad':'hi'],['مكثف البدء',s.r?'خارج الدائرة':'في الدائرة',s.r?'':'hi'],['مكثف التشغيل','في الدائرة دائماً','hi']],
      msg:s.r?'بعد أن كبرت السرعة فتح مفتاح الطرد المركزي ملامسه، فخرج مكثف البدء، وبقي مكثف التشغيل.':'عند البدء ملامس الطرد المركزي مغلق، فيعمل المكثفان معاً.'})})}
   ]},

  {st:4,short:'نجمة ودلتا',title:'تابع الجدول: المحرك ثلاثي الأوجه دلتا',ref:'ص 60',
   q:'الملفات الثلاثة نفسها… تلتقي في نقطة واحدة أم تصنع مثلثاً؟',
   art:U2ST.art(
     U2ST.card(30,50,140,190)+U2ST.tip('محرك ثلاثي الأوجه نجمة (تنفيذي، ص 59): نهايات الملفات الثلاثة تلتقي في نقطة واحدة، ويخرج من كل ملف طرف ⟦U⟧ أو ⟦V⟧ أو ⟦W⟧.',U2ST.sym(SY.starW(),100,140,1.35),[34,54,132,182])+U2ST.t(100,228,'نجمة',{sz:13})
    +U2ST.card(190,50,140,190)+U2ST.tip('محرك ثلاثي الأوجه دلتا (تنفيذي، ص 60): الملفات تتصل على شكل مثلث، ويتصل كل طرف بركن منه.',U2ST.sym(SY.deltaW(),260,140,1.35),[194,54,132,182])+U2ST.t(260,228,'دلتا',{sz:13})
    +U2ST.t(180,282,'المحرك ذو القفص السنجابي بالتوصيلتين',{sz:13}),
    'المحرك ثلاثي الأوجه بتوصيلة نجمة وتوصيلة دلتا'),
   cap:'التوصيلتان من جدولي <span class="ltr">ص 59–60</span>.<br><b>مرّر المؤشر على الرمزين (أو المسهما في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'في الدائرة الرمزية للمحرك ثلاثي الأوجه، كيف تعرف أن توصيلته دلتا؟',opts:[
     ['من عدد الخطوط الداخلة',false,'ثلاثة خطوط في النجمة وفي الدلتا.'],
     ['من المثلث الصغير المرسوم بجانب 3~',true,'في الرمزي يكفي أن تكتب ⅄ أو Δ بجانب 3~.'],
     ['من الحرف G',false,'G للمولد؛ والمحرك M.']]}}
   ],
   body:[
    {book:tableHTML('t60'),ref:'ص 60'},
    {tip:String.raw`<p>قارن رسمي المحرك ثلاثي الأوجه: في <b>النجمة</b> تلتقي نهايات الملفات الثلاثة في نقطة واحدة ويخرج من كل ملف طرف (<span class="ltr">U</span> أو <span class="ltr">V</span> أو <span class="ltr">W</span>)، وفي <b>الدلتا</b> تتصل الملفات على شكل مثلث ويتصل كل طرف بركن منه. وفي الرمزي يكفي أن تكتب ⅄ أو Δ بجانب <span class="ltr">3~</span>.</p>`,title:'نقطة أم مثلث؟'},
    {title:'مختبر مصغّر: بدّل التوصيلة',widget:(el,B)=>DCML.lab(el,B,{intro:'بدّل بين النجمة والدلتا، وبين الدائرتين.',
     ins:[{k:'c',l:'التوصيلة',seg:[['star','نجمة'],['delta','دلتا']],v:'star'},{k:'w',l:'الدائرة',seg:[['S','الرمزية'],['W','التنفيذية']],v:'W'}],
     calc:s=>({pic:U2ST.pic(SY[s.c+s.w](),1.9),msg:s.w==='S'?`في الرمزي دائرة فيها <span class="ltr">M</span> و<span class="ltr">3~</span>، وبجانبها علامة ${s.c==='star'?'النجمة ⅄':'المثلث Δ'}.`:s.c==='star'?'نهايات الملفات الثلاثة تلتقي في النقطة الوسطى (ص 59).':'الملفات الثلاثة أضلاع مثلث، وكل طرف عند ركن (ص 60).'})})},
    {title:'تحقق سريع: رموز الآلات',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب جداول ص 57–60.',items:[
     ['الخط تحت الحرف M داخل الدائرة يعني محرك تيار مستمر.',true,'وفي المتردد يُكتب 1~ أو 3~ تحت M.'],
     ['في الدائرة التنفيذية يرسم الكتاب ملفات المحولات دوائر متداخلة.',false,'الدوائر في الرمزية؛ وفي التنفيذية مستطيلات سوداء مصمتة.'],
     ['في المولد التوازي يتصل ملف المجال E1–E2 بين طرفي المنتج A1 وA2.',true,'لذلك سمي «توازي».'],
     ['المحرك أحادي الوجه بمكثف تشغيل له أطراف U وV وW.',false,'U V W لثلاثي الأوجه؛ أحادي الوجه U1–U2 للملف الرئيس وZ1–Z2 للمساعد.']]})}
   ]},

  {recap:[
   'المحولات: دوائر في الرمزية ومستطيلات سوداء في التنفيذية؛ الذاتي ملف واحد يؤخذ الخرج من نقطة فيه (ص 57).',
   'أطراف آلات التيار المستمر: A1–A2 المنتج، F1–F2 مجال منفصل، E1–E2 توازي، D1–D2 توالي (ص 58).',
   'مفتاح الطرد المركزي n&gt; يفصل مكثف البدء بعد أن تكبر السرعة (ص 59).',
   'النجمة: نهايات الملفات في نقطة واحدة؛ الدلتا: الملفات مثلث وكل طرف عند ركن (ص 59–60).']}
],
 theory:[
  {h:'٢-٥ رموز عناصر الآلات الكهربائية',ref:'ص 57',html:LEGEND+tableHTML('t57')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> في الدائرة الرمزية يُرسم كل ملف دائرة، فالمحول بملفين دائرتان متداخلتان. وفي الدائرة التنفيذية يرسم الكتاب كل ملف <b>مستطيلاً أسود مصمتاً</b> (أسلوب المواصفة الألمانية القديمة) وتظهر كل أطرافه. السهم المائل يعني «قابل للضبط»، والخطاف في نهايته ضبط على مراحل.`},
  {h:'تابع الجدول: محول الجهد وآلات التيار المستمر',ref:'ص 58',html:tableHTML('t58')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> رموز أطراف الآلات في الرسوم: <span class="ltr">A1–A2</span> المنتج (الفرشتان، المربعان الأسودان)، <span class="ltr">F1–F2</span> مجال منفصل التغذية، <span class="ltr">E1–E2</span> مجال التوازي، <span class="ltr">D1–D2</span> مجال التوالي، <span class="ltr">U1–U2</span> الملف الرئيس و<span class="ltr">Z1–Z2</span> الملف المساعد في المحرك أحادي الوجه، و<span class="ltr">U V W</span> أطراف المحرك ثلاثي الأوجه. والخط تحت G أو M يعني تياراً مستمراً.`},
  {note:`<b>إضافة من خارج الكتاب:</b> العمود التنفيذي فارغ في الكتاب لمولد ومحرك التيار المستمر، ولمولد ومحرك التيار المتردد ثلاثي الأوجه، والمحرك أحادي الوجه (ص 58). رسمناه على أسلوب الكتاب نفسه: دائرة الآلة بفرشاتيها A1 وA2 للتيار المستمر، وبأطرافها U V W أو U1 U2 للتيار المتردد.`},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>ص 58: في الرمز التنفيذي لمولد التيار المستمر منفصل التغذية حرف «G» زائد مطبوع بجوار F2؛ حذفناه من الرسم.</li><li>ص 58: في الرمز الرمزي لمولد التيار المستمر التوالي سقط الخط تحت G (وهو موجود في رمزه التنفيذي وفي باقي آلات التيار المستمر)؛ رسمناه بالخط.</li></ul>`},
  {h:'تابع الجدول: المحركات',ref:'ص 59',html:tableHTML('t59')},
  {note:`<b>إضافة من خارج الكتاب:</b> صف «محرك تيار مستمر توازي» فارغ تماماً في الكتاب (ص 59). رسمناه مثل «مولد تيار مستمر توازي» في ص 58 مع الحرف M: المجال E1–E2 على التوازي مع المنتج A1–A2.`},
  {h:'تابع الجدول',ref:'ص 60',html:tableHTML('t60')},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> قارن رسمي المحرك ثلاثي الأوجه: في <b>النجمة</b> تلتقي نهايات الملفات الثلاثة في نقطة واحدة ويخرج من كل ملف طرف (U أو V أو W)، وفي <b>الدلتا</b> تتصل الملفات على شكل مثلث ويتصل كل طرف بركن منه. وفي الرمزي يكفي أن تكتب ⅄ أو Δ بجانب 3~.`}
 ],
 lab:(el,B)=>matchLab(el,B,{tables:['t57','t58','t59','t60'],pages:'ص 57–60',tries:TRIES(25,1)}),
 quiz:[
  {q:'دائرتان متداخلتان في الدائرة الرمزية تمثلان:',o:['محركاً','محولاً بملفين منفصلين','محول تيار','مولداً'],c:1,e:'كل دائرة ملف (ص 57).'},
  {q:'محول ذاتي في الدائرة التنفيذية يُرسم:',o:['مستطيلين أسودين منفصلين','مستطيلاً أسود واحداً يؤخذ منه طرف من وسطه','دائرتين','خطين متوازيين'],c:1,e:'ملف واحد مشترك بين الابتدائي والثانوي.'},
  {q:'في مولد التيار المستمر التوازي يتصل ملف المجال E1–E2:',o:['على التوالي مع المنتج','على التوازي مع المنتج A1–A2','بمصدر منفصل F1–F2','بالمكثف'],c:1,e:'ص 58: المجال بين A1 وA2.'},
  {q:'الطرفان D1–D2 في رسوم آلات التيار المستمر هما طرفا:',o:['المنتج','مجال التوازي','مجال التوالي','المجال المنفصل'],c:2,e:'في المولد التوالي A2 متصل بـ D1 والطرفان الخارجيان A1 وD2.'},
  {q:'في المحرك أحادي الوجه بمكثف بدء ومكثف تشغيل، ما الذي يفصل مكثف البدء؟',o:['مصهر','مفتاح الطرد المركزي n>','المتمم الحراري','الملف الخانق'],c:1,e:'ملامس فصل يحركه مربع n> على التوالي مع مكثف البدء (ص 59).'},
  {q:'الخط تحت الحرف M داخل الدائرة يعني:',o:['محرك تيار متردد','محرك تيار مستمر','مولد','محول'],c:1,e:'وفي المتردد يُكتب 1~ أو 3~ تحت M.'}
 ]
});

})(PLCBOOK);
