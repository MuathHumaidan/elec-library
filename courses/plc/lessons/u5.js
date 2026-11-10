/* Unit 5 — التحكم في درجات الحرارة باستخدام حساسات درجة الحرارة (ص 97–106) */
(function(B){
const {S,clamp,W}=B;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());

/* ================= shared helpers ================= */
const r2=v=>Math.round(v*100)/100;
const fnum=(v,d)=>{if(v===undefined||v===null||isNaN(v))return '—';const x=Number(v.toFixed(d===undefined?2:d));return String(x)};
const hex=v=>((v&0xFFFF)>>>0).toString(16).toUpperCase().padStart(4,'0')+'H';
function runLoop(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(.05,(now-last)/1000);last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
// simple self-checking step list for custom labs
function checklist(host,items){let i=0;const draw=()=>{host.innerHTML=items.map((s,k)=>`<li class="${k<i?'done':k===i?'cur':''}"><span class="k">${k<i?'✓':k+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${k===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span>':'<button class="btn primary" data-nx>التالي</button>'}</div>`:''}</div></li>`).join('')+(i>=items.length?'<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك متابعة التجريب بحرية.</p><div class="act"><button class="btn" data-rs>إعادة</button></div></div></li>':'');
  const nx=host.querySelector('[data-nx]');if(nx)nx.onclick=()=>{i++;draw()};const rs=host.querySelector('[data-rs]');if(rs)rs.onclick=()=>{i=0;draw()}};
  draw();return ()=>{const s=items[i];if(s&&s.done&&s.done()){i++;draw()}}}
const ar=(x,y,t,cls,anchor,fs)=>`<text class="txt ar ${cls||''}" x="${x}" y="${y}" text-anchor="${anchor||'middle'}"${fs?` font-size="${fs}"`:''}>${t}</text>`;

// The book's analog chain (Networks 1–5, ص 104) computed from the pot voltage V (0–10 V) and the thermocouple temperature T (°C)
function chain(V,T){const piw288=Math.round(clamp(V,0,10)/10*27648),ld0=piw288,md0=ld0,md10a=md0/27648,md100=md10a*100;
  const piw290=Math.round(T*10),ld10=piw290,md10b=ld10,md200=md10b/10,md80=md100*0.8,md120=md100*1.2;
  return {piw288,ld0,md0,md10a,md100,piw290,ld10,md10b,md200,md80,md120}}

/* ---------- الشكل (1-5): PLC wiring + heater power circuit ---------- */
function fig15(o){o=o||{};const V=o.V===undefined?5:o.V,T=o.T===undefined?25:o.T,K=!!o.Q40,H=!!o.Q41;const c=chain(V,T);
  let s=`<svg viewBox="0 0 680 330" role="img" aria-label="مخطط توصيل وحدة PLC للتحكم في درجة حرارة الغرفة">`;
  // PLC box
  s+=`<rect x="210" y="20" width="112" height="285" rx="6" class="sym" fill="var(--surface-2)"/>`+S.t(266,44,'PLC','',  'middle',18);
  // S1 Heat enable -> I0.1
  const btn=(y,lbl,sub,pr)=>{const c1=pr?'live':'';return S.w(`M70 ${y}H120`,'live')+`<circle cx="70" cy="${y}" r="3" class="dot"/>`+S.dot(120,y)+S.dot(160,y)+
    `<path class="sym ${pr?'hot':''}" d="M116 ${pr?y-3:y-10}H164M140 ${pr?y-3:y-10}V${pr?y-15:y-22}M132 ${pr?y-15:y-22}H148"/>`+S.w(`M160 ${y}H210`,c1)+S.t(140,y-27,lbl)+S.t(140,y+18,sub,'m')+S.t(216,y+4,lbl==='S1'?'I0.1':'I0.0','','start')};
  s+=btn(70,'S1','Heat enable',o.S1)+btn(124,'S0','Stop Heating',o.S0);
  // thermocouple -> PIW290
  s+=S.w('M210 172H130L96 182','live')+S.w('M210 192H130L96 182','live')+`<circle cx="96" cy="182" r="4" fill="var(--stop)"/>`+S.t(150,164,'Thermocouple K-Type','m')+S.t(70,186,fnum(T,1)+' °C','b','end')+S.t(216,186,'PIW290','','start')+S.t(216,202,'= '+c.piw290,'b','start');
  // potentiometer R -> PIW288
  const wy=292-clamp(V,0,10)/10*56;
  s+=`<rect x="104" y="236" width="14" height="56" class="sym" fill="var(--surface)"/>`+S.w('M111 224V236','live')+S.w('M111 292V304','')+S.t(111,220,'10 VDC','m')+S.t(111,318,'0 VDC','m')+S.t(92,268,'R','','end')+
    S.w(`M210 262H150V${wy.toFixed(1)}H124`,'live')+`<path class="sym" d="M124 ${wy.toFixed(1)}l8 -5v10z" fill="var(--fg)"/>`+S.t(170,252,fnum(V,1)+' V','b')+S.t(216,266,'PIW288','','start')+S.t(216,282,'= '+c.piw288,'b','start');
  // outputs
  s+=S.t(316,84,'Q4.0','','end')+S.w('M322 80H380',K?'live':'')+`<rect x="380" y="66" width="86" height="28" rx="3" class="coil ${K?'on':''}"/>`+S.t(423,85,'Heater K1');
  s+=S.t(316,154,'Q4.1','','end')+S.w('M322 150H392',H?'live':'')+`<circle cx="404" cy="150" r="12" fill="${H?'#f6c343':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1.6"/><path class="sym" d="M396 142l16 16M412 142l-16 16" stroke-width="1.3"/>`+S.t(422,154,'H1','','start');
  // power circuit of the heater
  const cols=[540,570,600],bus=[30,44,58],sup=S.cls(1,K),out=S.cls(K,K);
  bus.forEach((y,i)=>{s+=S.w(`M520 ${y}H660`,sup)+S.t(512,y+4,'L'+(i+1),'','end')});
  cols.forEach((x,i)=>{s+=S.w(`M${x} ${bus[i]}V74`,sup)+S.dot(x,bus[i])+S.fuse(x,74,sup)+S.w(`M${x} 98V124`,sup)+S.vC(x,124,156,{closed:K,inC:sup,outC:out})+S.w(`M${x} 156V186`,out)+
    `<rect x="${x-7}" y="186" width="14" height="50" class="sym" fill="${K?'var(--live-soft)':'var(--surface)'}" ${K?'stroke="var(--stop)"':''}/>`+S.w(`M${x} 236V266`,out)});
  s+=S.w('M540 266H600',out)+S.dot(570,266)+S.t(570,284,'E')+S.mech(528,612,140)+S.t(618,144,'K1','','start');
  return s+'</svg>';
}

/* ---------- Networks 1–5 (math boxes, ص 104) drawn as LAD boxes ---------- */
function mbox(x,y,name,ins,outs){const w=150,rows=Math.max(ins.length,outs.length)+1,h=20+rows*22;let s=`<rect class="fbox" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/><text class="lad-txt" x="${x+w/2}" y="${y+15}" text-anchor="middle">${name}</text>`;
  const ry=k=>y+30+k*22;s+=`<text class="lad-val" x="${x+6}" y="${ry(0)+4}" fill="var(--fg)">EN</text><text class="lad-val" x="${x+w-6}" y="${ry(0)+4}" text-anchor="end" fill="var(--fg)">ENO</text>`;
  ins.forEach(([pin,op,val],k)=>{const yy=ry(k+1);s+=`<path class="w live" d="M${x-22} ${yy}H${x}"/><text class="lad-val" x="${x+6}" y="${yy+4}" fill="var(--fg)">${pin}</text><text class="lad-txt" x="${x-26}" y="${yy-2}" text-anchor="end">${op}</text>${val!==''?`<text class="lad-val" x="${x-26}" y="${yy+12}" text-anchor="end" fill="var(--on)">${val}</text>`:''}`});
  outs.forEach(([pin,op,val],k)=>{const yy=ry(k+1);s+=`<path class="w live" d="M${x+w} ${yy}H${x+w+22}"/><text class="lad-val" x="${x+w-6}" y="${yy+4}" text-anchor="end" fill="var(--fg)">${pin}</text><text class="lad-txt" x="${x+w+26}" y="${yy-2}">${op}</text><text class="lad-val" x="${x+w+26}" y="${yy+12}" fill="var(--on)">${val}</text>`});
  return {s,h,en:ry(0)}}
function mnet(title,b1,b2){let s='';const A=mbox(130,10,...b1);s+=A.s+`<path class="w live" d="M16 ${A.en}H130"/>`;let h=A.h;
  if(b2){const Bx=mbox(470,10,...b2);s+=Bx.s+`<path class="w live" d="M280 ${A.en}H470"/>`;h=Math.max(h,Bx.h)}
  return `<div class="net static"><header><h3>${title}</h3><span class="ref">ص 104</span></header><div class="svgbox fixed"><svg viewBox="0 0 760 ${h+20}"><path class="w live" d="M16 4V${h+16}"/>${s}</svg></div></div>`}
function mathNets(c){const f=v=>fnum(v,3);return [
  mnet('Network 1 : Set Value of Temprature as Real',['I_DI',[['IN','PIW288',c.piw288]],[['OUT','LD0',c.ld0]]],['DI_R',[['IN','LD0',c.ld0]],[['OUT','MD0',f(c.md0)]]]),
  mnet('Network 2 : Scalling for Set Value',['DIV_R',[['IN1','MD0',f(c.md0)],['IN2','2.764800e+004','']],[['OUT','MD10',f(c.md10a)]]],['MUL_R',[['IN1','MD10',f(c.md10a)],['IN2','1.000000e+002','']],[['OUT','MD100',f(c.md100)]]]),
  mnet('Network 3 : Actual Value of Temprature as Real',['I_DI',[['IN','PIW290',c.piw290]],[['OUT','LD10',c.ld10]]],['DI_R',[['IN','LD10',c.ld10]],[['OUT','MD10',f(c.md10b)]]]),
  mnet('Network 4 :',['DIV_R',[['IN1','MD10',f(c.md10b)],['IN2','1.000000e+001','']],[['OUT','MD200',f(c.md200)]]]),
  mnet('Network 5 : 80% And 120% of Actual Value',['MUL_R',[['IN1','MD100',f(c.md100)],['IN2','8.000000e-001','']],[['OUT','MD80',f(c.md80)]]],['MUL_R',[['IN1','MD100',f(c.md100)],['IN2','1.200000e+000','']],[['OUT','MD120',f(c.md120)]]])
 ].join('')}

// the engine draws compare boxes as "CMP <=I"; the book's compares are REAL (<=R, >R) — fix the label on unit-5 pages
(function(){const v=document.getElementById('view');if(!v||typeof MutationObserver==='undefined')return;
  new MutationObserver(()=>{if(!/^#?u5-/.test(location.hash))return;v.querySelectorAll('text.lad-txt').forEach(t=>{const m=/^CMP (<=|>=|==|<>|<|>)I$/.exec(t.textContent);if(m)t.textContent='CMP '+m[1]+'R'})}).observe(v,{childList:true,subtree:true})})();

// Table 4-26 (ص 102)
const T426=`<div class="tablebox" style="direction:ltr"><table class="tt" style="font-size:12.5px"><thead><tr><th>Type K in °C</th><th>decimal</th><th>hexa-decimal</th><th>Type K in °F</th><th>decimal</th><th>hexa-decimal</th><th>Type K in K</th><th>decimal</th><th>hexa-decimal</th><th>Range</th></tr></thead><tbody>
 <tr><td>&gt; 1622.0</td><td>32767</td><td>7FFFH</td><td>&gt;2951.6</td><td>32767</td><td>7FFFH</td><td>&gt; 1895.2</td><td>32767</td><td>7FFFH</td><td>Overflow</td></tr>
 <tr><td>1622.0 : 1373.0</td><td>16220 : 13730</td><td>3F5CH : 35A2H</td><td>2951.6 : 2503.4</td><td>29516 : 25034</td><td>734CH : 61CAH</td><td>1895.2 : 1646.2</td><td>18952 : 16462</td><td>4A08H : 404EH</td><td>Overrange</td></tr>
 <tr><td>1372.0 : –270.0</td><td>13720 : –2700</td><td>3598H : F574H</td><td>2501.6 : –454.0</td><td>25061 : –4540</td><td>61B8H : EE44H</td><td>1645.2 : 0</td><td>16452 : 0</td><td>4044H : 0000H</td><td>Rated range</td></tr>
 <tr><td>&lt; –270.0</td><td>&lt; –2700</td><td>&lt; F574H</td><td>&lt; –454.0</td><td>&lt; –4540</td><td>&lt;EE44H</td><td>0 %</td><td>0 %</td><td>&lt; 0000H</td><td>Underflow</td></tr></tbody></table>
 <p class="sub" style="text-align:left">In the case of incorrect wiring (e.g. polarity reversal or open inputs) or of a sensor error in the negative range (e.g. incorrect thermocouple type), the analog input module signals underflow ... of F0C4H and outputs 8000H. | ... of E5D4H and outputs 8000H. | ... of FB70H and outputs 8000H.</p></div>`;
// الشكل (2-5): HW Config properties dialog (redrawn)
const HWCFG=`<div style="direction:ltr;text-align:left;font-family:var(--mono);font-size:12.5px;display:grid;grid-template-columns:minmax(160px,1fr) 2.4fr;gap:10px">
 <div style="border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--surface-2)"><b>(0) UR</b><br>1 &nbsp;PS 307 10A<br>2 &nbsp;CPU314C-2 DP(1)<br>&nbsp;&nbsp;X2 DP<br>&nbsp;&nbsp;2.2 DI24/DO16<br>&nbsp;&nbsp;2.3 AI5/AO2<br>&nbsp;&nbsp;2.4 Count<br>&nbsp;&nbsp;2.5 Position<br>3<br><b>4 &nbsp;AI8xTC</b></div>
 <div style="border:1px solid var(--line);border-radius:8px;padding:8px"><b>Properties - AI8xTC - (R0/S4)</b><div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap"><span class="bit">General</span><span class="bit">Addresses</span><span class="bit one">Inputs - Part 1</span><span class="bit">Inputs - Part 2</span></div>
 <div>Enable: ☐ Diagnostic Interrupt &nbsp;☐ Hardware interrupt when limit exceeded &nbsp;☐ Hardware interrupt at end of scan cycle</div>
 <table class="tt" style="font-size:12px"><thead><tr><th>Input</th><th style="outline:2px solid var(--stop)">0-1</th><th>2-3</th><th>4-5</th><th>6-7</th></tr></thead><tbody>
 <tr><td>Diagnostics: Group Diagnostics</td><td>☐</td><td>☐</td><td>☐</td><td>☐</td></tr><tr><td>with Check for Wire Break</td><td>☐</td><td>☐</td><td>☐</td><td>☐</td></tr>
 <tr><td>Measuring Type</td><td><b>TC-IL</b></td><td>TC-IL</td><td>TC-IL</td><td>TC-IL</td></tr><tr><td>Measuring Range</td><td><b>Type K</b></td><td>Type K</td><td>Type K</td><td>Type K</td></tr><tr><td>Reaction to Open Thermocouple</td><td>Overflow</td><td>Overflow</td><td>Overflow</td><td>Overflow</td></tr></tbody></table>
 <p style="color:var(--stop);font-weight:600;margin-top:6px">Adjust type to Type K</p></div></div>`;
function tcReading(T){if(T>1622)return {v:32767,r:'Overflow'};if(T>1372)return {v:Math.round(T*10),r:'Overrange'};if(T>=-270)return {v:Math.round(T*10),r:'Rated range'};return {v:-32768,r:'Underflow'}}

const IO5_BOOK=`<div class="tablebox"><table class="io"><thead><tr><th>نقاط الدخل والخرج</th><th>الوصف</th><th>الترميز في (PLC)</th></tr></thead><tbody>
 <tr><td class="mono">R</td><td>مقاومة متغيرة خرجها من 0 حتى 10 فولت DC لإدخال قيمة الحرارة المطلوبة وتوصل بموديول الدخل التناظري تكون القراءة داخل PLC برقم صحيح يتراوح بين 0 و 27648</td><td class="mono">PIW288</td></tr>
 <tr><td class="mono">Thermocouple K-type</td><td>حساس درجة الحرارة ثرموكبل من النوع K الدقة 0.1 درجة مئوية يوصل بموديول الدخل التناظري</td><td class="mono">PIW290</td></tr>
 <tr><td class="mono">S1</td><td>ضاغط التشغيل لبدأ عملية التسخين</td><td class="mono">I0.0</td></tr>
 <tr><td class="mono">S0</td><td>ضاغط الفصل لانهاء عملية التسخين</td><td class="mono">I0.1</td></tr>
 <tr><td class="mono">K1</td><td>متمم تشغيل السخان</td><td class="mono">Q4.0</td></tr>
 <tr><td class="mono">H1</td><td>مصباح بيان عمل السخان</td><td class="mono">Q4.1</td></tr></tbody></table></div>`;
const ERR_ADDR='الجدول (ص 101) يعطي <b>S1 = I0.0</b> و <b>S0 = I0.1</b>، بينما الشكل (1-5) وبرنامج LAD (Network 6: <span class="ltr">I0.1 Start "S1"</span>، Network 7: <span class="ltr">I0.0 stop "S0"</span>) يعطيان <b>S1 = I0.1</b> و <b>S0 = I0.0</b>. في المحاكاة نتبع الشكل والبرنامج. لو وصّلت حسب الجدول لصار S1 يوقف التسخين و S0 لا يبدؤه.';

/* =================== Lesson 5.1 =================== */
B.lesson({
 id:'u5-l1',unit:5,order:1,pages:'97–100',
 title:'عناصر منظومة التحكم في درجة الحرارة، والحلقة المفتوحة والمغلقة',
 summary:'القيمة الفعلية والقيمة المرغوبة وجهد الخطأ، ثم العناصر الستة: النظام والحاكم والحساس وجهد المرجع والمقارن وعنصر التحكم النهائي، وقسما أنظمة التحكم.',
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
})())/*DCML-END*/,(window.U5STL=window.U5STL||function(el,B,o){
/* «مختبر مصغّر» للوحدة 5: تنفيذ جزء من برنامج STL (ص 106) سطراً سطراً بمنزلق، مع ACCU1 و ACCU2 و RLO.
   o={from,to (فهرسان في STL_BOOK), intro, predict, vt, vr, q0, show:[عناوين MD تُعرض]} — يعيد تنفيذ الأسطر من البداية في كل مرة. */
 const L=STL_BOOK,N=o.to-o.from+1,lt=s=>`<span class="ltr">${s}</span>`,cl=s=>s.replace(/\s+/g,' ').trim();
 return DCML.lab(el,B,{intro:o.intro,predict:o.predict,
  ins:[{k:'n',l:'عدد الأسطر المنفّذة من هذا الجزء',min:0,max:N,step:1,v:0,fmt:v=>v+' / '+N},
   {k:'vt',l:'جهد مدخل الحرارة الفعلية '+lt('PIW 290'),min:0,max:10,step:0.5,v:o.vt,u:'v',dp:1},
   ...(o.vr!=null?[{k:'vr',l:'جهد مقاومة الحرارة المطلوبة '+lt('PIW 288'),min:0,max:10,step:0.5,v:o.vr,u:'v',dp:1}]:[]),
   ...(o.q0!=null?[{k:'q0',l:'Q4.0',sw:true,v:o.q0,on:'قبل هذا المسح: السخان يعمل '+lt('Q 4.0 = 1'),off:'قبل هذا المسح: السخان متوقف '+lt('Q 4.0 = 0')}]:[])],
  calc:s=>{const S={words:{PIW290:Math.round(s.vt/10*27648),PIW288:Math.round((s.vr==null?0:s.vr)/10*27648)},bits:{'Q4.0':s.q0?1:0},a1:undefined,a2:undefined,t1:'',t2:'',fc:true,rlo:false};
   for(let i=1;i<o.from;i++)stlExec(L[i].l,S);
   const R=[];for(let i=o.from;i<=o.to;i++){if(i-o.from<s.n){const r=stlExec(L[i].l,S);R.push(r)}else R.push(undefined)}
   const cur=o.from+s.n-1;
   const row=(i,r)=>{const ln=cl(L[i].l),done=r!==undefined,now=i===cur;
    return `<tr style="${now?'background:var(--blue-soft);font-weight:700':''}${!done?';color:var(--muted)':''}"><td>${i}</td><td style="white-space:nowrap">${ln||'<i>(سطر فارغ)</i>'}</td><td>${done&&r?fa(r.a1,r.t1):''}</td><td>${done&&r?fa(r.a2,r.t2):''}</td><td>${done&&r&&r.rlo!=null?r.rlo:''}</td></tr>`};
   const tbl=`<div style="overflow-x:auto;direction:ltr"><table style="border-collapse:collapse;font-family:var(--mono);font-size:13px;width:100%;min-width:300px;text-align:left" class="ml-stl"><thead><tr style="color:var(--muted)"><th>#</th><th>STL</th><th>ACCU1</th><th>ACCU2</th><th>RLO</th></tr></thead><tbody>${R.map((r,j)=>row(o.from+j,r)).join('')}</tbody></table></div>`;
   const last=s.n?R[s.n-1]:null,ln=s.n?cl(L[cur].l):'';
   const facts=[['ACCU1',S.a1===undefined?'—':fa(S.a1,S.t1)],['ACCU2',S.a2===undefined?'—':fa(S.a2,S.t2)]];
   (o.show||[]).forEach(k=>facts.push([k,S.words[k]===undefined?'—':fa(S.words[k],'REAL'),'hi']));
   facts.push(['Q 4.0',String(S.bits['Q4.0']?1:0),S.bits['Q4.0']?'hi':'']);
   const op=ln.split(' ')[0],ar=ln.slice(op.length).replace(/\s+/g,''),A1=S.a1===undefined?'':lt(fa(S.a1,S.t1)),A2=S.a2===undefined?'':lt(fa(S.a2,S.t2));
   const say=!ln?'سطر فارغ مطبوع هكذا في الكتاب: لا يفعل شيئاً.'
    :op==='L'?(/^PIW/.test(ar)?`حُمّلت قراءة المدخل ${lt(ar)} في ACCU1 (${A1})، وانتقل ما كان فيه إلى ACCU2.`:/^MD/.test(ar)?`حُمّلت قيمة ${lt(ar)} في ACCU1 (${A1})، وانتقل ما كان فيه إلى ACCU2 (${A2}).`:`حُمّل الثابت ${A1} في ACCU1، وانتقل ما كان فيه إلى ACCU2 (${A2}).`)
    :op==='ITD'?'تحويل ACCU1 من Integer إلى Double Integer: الرقم نفسه في مكان أكبر.'
    :op==='DTR'?'تحويل ACCU1 إلى Real: الرقم نفسه، لكنه الآن يقبل الكسور.'
    :op==='/R'?`ACCU1 = ACCU2 ÷ ACCU1 = ${A1}`:op==='*R'?`ACCU1 = ACCU2 × ACCU1 = ${A1}`
    :op==='T'?`نُقل ACCU1 (${A1}) إلى العنوان ${lt(ar)}.`
    :(op==='<=R'||op==='>R')?`المقارنة: هل ACCU2 ${lt(op[0]==='<'?'≤':'>')} ACCU1؟ ${lt(A2.replace(/<[^>]+>/g,'')+' '+(op[0]==='<'?'≤':'>')+' '+A1.replace(/<[^>]+>/g,''))} ← ${lt('RLO = '+(last&&last.rlo))}`
    :op==='S'?(S.rlo?`${lt('RLO = 1')}، فثُبّت السخان ${lt('Q 4.0 = 1')}.`:`${lt('RLO = 0')}، فلا يفعل الأمر ${lt('S')} شيئاً: ${lt('Q 4.0')} تبقى كما كانت.`)
    :op==='R'?(S.rlo?`${lt('RLO = 1')}، فأُلغي السخان ${lt('Q 4.0 = 0')}.`:`${lt('RLO = 0')}، فلا يفعل الأمر ${lt('R')} شيئاً: ${lt('Q 4.0')} تبقى كما كانت.`):'';
   const msg=!s.n?'حرّك المنزلق الأول لتنفيذ أول سطر، وراقب ACCU1 و ACCU2.':`<b>السطر ${lt(ln||'—')}:</b> ${say}`;
   return {pic:tbl,facts,msg}}})}),{intro:true}),

  {st:1,short:'ماذا ستتعلم؟',title:'ماذا ستتعلم في هذه الوحدة؟',ref:'ص 97–98',
   q:'في الوحدات السابقة كانت المداخل ضواغط: إما مضغوطة أو لا… فكيف سيعرف الـ PLC أن الغرفة صارت باردة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة أهداف الوحدة: معرفة كيف تعمل دائرة التحكم في الحرارة وكتابة برامج لها، مع الوقت المتوقع ومستوى الإتقان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="56" y="46" width="248" height="236" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><rect x="146" y="34" width="68" height="26" rx="8" fill="#2C4A40"/><text x="180" y="92" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">أهداف الوحدة</text><line x1="76" y1="104" x2="284" y2="104" stroke="#CFC6B4" stroke-width="2"/><rect x="264" y="118" width="20" height="20" rx="4" fill="#12855A"/><path d="M268 128 l5 5 l8 -10" fill="none" stroke="#FBF6EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="256" y="133" text-anchor="start" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">كيف تعمل دائرة التحكم في الحرارة</text><rect x="264" y="152" width="20" height="20" rx="4" fill="#12855A"/><path d="M268 162 l5 5 l8 -10" fill="none" stroke="#FBF6EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="256" y="167" text-anchor="start" direction="rtl" font-size="12.5" fill="#2C4A40" font-weight="600">كتابة برامج للتحكم في الحرارة</text><line x1="76" y1="190" x2="284" y2="190" stroke="#CFC6B4" stroke-width="2"/><circle cx="232" cy="222" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M232 212 V222 H240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="232" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ساعتان</text><circle cx="128" cy="222" r="16" fill="#E8735A"/><circle cx="128" cy="222" r="10" fill="#FBF6EE"/><circle cx="128" cy="222" r="4" fill="#E8735A"/><text x="128" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">إتقان 100٪</text></svg>`,
   cap:'هدفا الوحدة كما في ص 97، والوقت المتوقع للتدريب، ومستوى الأداء المطلوب.',
   side:[
    {predict:{q:'محتوى الوحدة (ص 98) قسمان: «فكرة عمل التحكم في درجات الحرارة» ثم… ماذا؟',opts:[
     ['تصميم حساس درجة الحرارة وتصنيعه',false,'الحساس جاهز؛ الوحدة تشرح كيف نوصله ونقرأه، لا كيف نصنعه.'],
     [String.raw`كتابة برنامج للتحكم في درجات الحرارة باللغة <span class="ltr">(LAD)</span>`,true,'هذا «ثانياً» في محتوى الوحدة ص 98، وستجد البرنامج في الدرس 5.3.'],
     ['تشغيل محرك ثلاثي الأوجه بطريقة نجمة/دلتا',false,'الحمل في هذه الوحدة سخان كهربي، وليس محركاً.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
     <p><b>الأهداف:</b> عند إكمال هذه الوحدة يكون لدى المتدرب القدرة بإذن الله على:</p><ul><li>أن يعرف المتدرب كيف يتم عمل دائرة التحكم في درجة الحرارة.</li><li>أن يكتب المتدرب برامج للتحكم في درجة الحرارة.</li></ul>
     <p><b>مستوى الأداء المطلوب:</b> أن يصل المتدرب إلى إتقان هذه الجدارة بإذن الله بنسبة 100٪.</p>
     <p><b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج – حاسب آلي – جهاز عرض (داتا شو) – سبورة – قلم.</p>
     <p><b>متطلبات الجدارة:</b> اجتياز ورشة أساسيات الكهرباء – اجتياز الرسم الفني.</p>`,ref:'ص 97'},
    {book:String.raw`<p><b>أولاً:</b> فكرة عمل التحكم في درجات الحرارة.</p><p><b>ثانياً:</b> كتابة برنامج للتحكم في درجات الحرارة (PLC) باللغة <span class="ltr">(LAD)</span>.</p>
     <p><b>الأهداف:</b> عند إكمال هذا الباب يكون لدى المتدرب القدرة بإذن الله على:</p><ul><li>أن يعرف المتدرب طريقة التحكم في درجات الحرارة.</li><li>أن يكتب المتدرب برنامجاً للتحكم في درجات الحرارة.</li></ul>
     <p><b>مستوى الأداء المطلوب:</b> 100٪. <b>الوقت المتوقع للتدريب:</b> ساعتان.</p>
     <p><b>الوسائل المساعدة:</b> مختبر التحكم المنطقي المبرمج – حاسب آلي – جهاز عرض (داتا شو) – سبورة – كراسة الطالب – قلم.</p>
     <p><b>متطلبات الجدارة:</b> اجتياز ورشة التحكم في المحركات الثلاثية الأوجه.</p>`,ref:'ص 98'},
    {watch:String.raw`<p>صفحة المقدمة مكررة في الكتاب بصيغتين: متطلبات الجدارة في ص 97 «اجتياز ورشة أساسيات الكهرباء، اجتياز الرسم الفني»، وفي ص 98 «اجتياز ورشة التحكم في المحركات الثلاثية الأوجه»، والوسائل في ص 97 بلا «كراسة الطالب».</p>`,fix:true},
    {tip:String.raw`<p>إلى الآن كانت المداخل «ثنائية»: ضاغط مضغوط <span class="ltr">1</span> أو غير مضغوط <span class="ltr">0</span>. في هذه الوحدة يدخل إلى الـ PLC <b>رقم</b> يتغير باستمرار: درجة الحرارة. سنقرؤه، ونحوّله، ونقارنه بالحرارة المطلوبة، ثم نشغّل السخان أو نوقفه.</p>`,title:'الجديد في هذه الوحدة'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اقرأ كل عبارة عن مقدمة الوحدة (ص 97–98) وقرّر: صح أم خطأ؟',items:[
     [String.raw`في هذه الوحدة كل مداخل الـ <span class="ltr">PLC</span> ضواغط: إما <span class="ltr">0</span> أو <span class="ltr">1</span>.`,false,String.raw`يدخل إلى الـ <span class="ltr">PLC</span> هنا رقم يتغير باستمرار: درجة الحرارة (ومعها قيمة الحرارة المطلوبة).`],
     [String.raw`محتوى الوحدة: فكرة عمل التحكم في درجات الحرارة، ثم كتابة برنامج للتحكم فيها باللغة <span class="ltr">(LAD)</span>.`,true,String.raw`هذان هما القسمان المذكوران في ص 98.`],
     [String.raw`من أهداف الوحدة أن يكتب المتدرب برامج للتحكم في درجة الحرارة.`,true,String.raw`الهدف الثاني في ص 97: «أن يكتب المتدرب برامج للتحكم في درجة الحرارة».`],
     [String.raw`الوقت المتوقع للتدريب على هذه الجدارة يوم كامل.`,false,String.raw`الوقت المتوقع في الكتاب: ساعتان.`]]})}
   ]},

  {st:2,short:'فكرة العمل',title:'أولاً: فكرة عمل التحكم في درجات الحرارة',ref:'ص 99',
   q:'كيف يعرف السخان متى يعمل ومتى يتوقف، وهو لا «يشعر» بحرارة الغرفة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="غرفة فيها سخان ومقياس حرارة، والحرارة الفعلية تقارن بالمرغوبة، والخطأ يحدد سلوك المنظومة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="60" y="36" width="240" height="134" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="60" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الغرفة</text><g data-tip="السخان الكهربي: يرفع حرارة الغرفة عندما يعمل."><rect x="84" y="112" width="132" height="50" fill="transparent"/><path d="M90 148 h10 l6 -12 l12 24 l12 -24 l12 24 l12 -24 l12 24 l12 -24 l12 24 l6 -12 h10" fill="none" stroke="#E8735A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="150" y="124" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السخان</text></g><g data-tip="مقياس الحرارة: يقيس درجة الحرارة الفعلية للغرفة ⟦actual value⟧."><rect x="248" y="70" width="14" height="76" rx="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="251" y="104" width="8" height="44" rx="4" fill="#E8735A"/><circle cx="255" cy="152" r="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g><line x1="271" y1="170" x2="271" y2="188" stroke="#2C4A40" stroke-width="3"/><polygon points="271,196 264,184 278,184" fill="#2C4A40"/><g data-tip="درجة الحرارة الفعلية ⟦actual value⟧: الحرارة الموجودة الآن في الغرفة كما يقيسها الحساس."><rect x="212" y="198" width="118" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="271" y="219" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الفعلية</text><text x="271" y="238" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">actual value</text></g><g data-tip="درجة الحرارة المرغوب بها ⟦set value⟧: الحرارة التي نريد أن تصل إليها الغرفة."><rect x="30" y="198" width="118" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="89" y="219" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">المرغوبة</text><text x="89" y="238" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">set value</text></g><line x1="212" y1="223" x2="206" y2="223" stroke="#2C4A40" stroke-width="3"/><line x1="148" y1="223" x2="154" y2="223" stroke="#2C4A40" stroke-width="3"/><g data-tip="المقارنة: نقارن الحرارة الفعلية بالحرارة المرغوب بها."><circle cx="180" cy="223" r="25" fill="#2C4A40"/><text x="180" y="228" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">مقارنة</text></g><line x1="180" y1="248" x2="180" y2="258" stroke="#2C4A40" stroke-width="3"/><g data-tip="قيمة الخطأ: الفرق بين القيمة المرغوب بها والقيمة الفعلية، وهي التي تحدد سلوك منظومة التحكم (يعمل السخان أو يتوقف)."><rect x="86" y="260" width="188" height="36" rx="9" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="283" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الخطأ يحدد سلوك المنظومة</text></g></svg>`,
   cap:'نقيس الحرارة الفعلية ونقارنها بالمرغوبة، والفرق بينهما (الخطأ) يقرر ما يفعله السخان.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>من المعلوم أن التحكم في درجة الحرارة من الأمور المهمة في التطبيقات العملية.</p><p>وحتى تتم عملية التحكم في درجة الحرارة عن طريق سخان كهربي فيلزم <b>قياس درجة الحرارة الفعلية <span class="ltr">actual value</span></b> ومقارنتها <b>بدرجة الحرارة المرغوب بها <span class="ltr">set value</span></b> وبالتالي فإن <b>قيمة الخطأ</b> بين القيمة المرغوب بها والقيمة الفعلية تحدد سلوك منظومة التحكم.</p>`,ref:'ص 99'}
   ],
   body:[
    {predict:{q:'الغرفة الآن أبرد من الحرارة المرغوب بها. ماذا يجب أن تفعل منظومة التحكم؟',opts:[
     ['توقف السخان حتى لا يزيد الخطأ',false,'إيقاف السخان يترك الغرفة تبرد أكثر، فيكبر الفرق بدل أن يصغر.'],
     ['تشغّل السخان حتى تقترب الحرارة الفعلية من المرغوبة',true,'الخطأ يقول إن الغرفة أبرد من المطلوب، فالتصحيح هو التسخين.'],
     ['لا شيء؛ المهم أن السخان موصول',false,'بلا قياس ومقارنة لا يعرف أحد أن الغرفة باردة؛ هذا ما يشرحه الكتاب في ص 99.']]}},
    {tip:String.raw`<p>الفكرة كلها في ثلاث كلمات: <b>نقيس</b> الحرارة الفعلية، <b>نقارن</b>ها بالمرغوبة، <b>نصحّح</b> بحسب الفرق. فإذا كانت الغرفة أبرد من المطلوب يعمل السخان، وإذا صارت أسخن منه يتوقف.</p>`,title:'الفكرة في سطر'},
    {add:String.raw`<p>المكيّف في البيت يعمل بالفكرة نفسها: تضبط على جهاز التحكم الحرارة التي تريدها (المرغوبة)، وفي داخل المكيف حساس يقيس حرارة الغرفة (الفعلية)، فيشغّل الضاغط أو يوقفه بحسب الفرق بينهما.</p>`,title:'مثال من البيت'},
    {title:'مختبر مصغّر: القيمة المرغوبة والقيمة الفعلية',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك الحرارتين (أرقام تختارها أنت) وراقب الفرق بينهما وماذا يجب أن يفعل السخان.',
      predict:{q:String.raw`الحرارة المرغوب بها أقل من الحرارة الفعلية للغرفة. ماذا يجب أن يفعل السخان؟`,opts:[
       [String.raw`يعمل، لأن هناك فرقاً بين القيمتين`,false,String.raw`وجود فرق وحده لا يكفي؛ المهم اتجاهه. الغرفة هنا أسخن من المطلوب.`],
       [String.raw`يتوقف، لأن الغرفة أسخن من المطلوب`,true,String.raw`الخطأ بين المرغوبة والفعلية هو الذي يحدد سلوك المنظومة: الغرفة أسخن من المطلوب، فلا داعي للتسخين.`],
       [String.raw`لا يتأثر؛ السخان يعمل دائماً`,false,String.raw`لو عمل دائماً لما كانت هناك منظومة تحكم؛ الهدف أن تقترب الفعلية من المرغوبة.`]]},
      ins:[{k:'sv',l:'الحرارة المرغوب بها set value',min:10,max:40,step:1,v:25,u:'°C'},{k:'av',l:'الحرارة الفعلية actual value',min:10,max:40,step:1,v:30,u:'°C'}],
      calc:s=>{const e=s.sv-s.av,on=e>0;
       return {bars:[{l:'المرغوبة',v:s.sv,max:40,u:'°C',col:'--blue'},{l:'الفعلية',v:s.av,max:40,u:'°C',col:'--live'}],
        facts:[['الفرق: المرغوبة − الفعلية',`${DCML.fm(B,e)} °C`,e?'hi':''],['السخان',on?'يعمل':'متوقف',on?'hi':'']],
        msg:e>0?'الغرفة أبرد من المطلوب: يعمل السخان حتى تقترب الفعلية من المرغوبة.':e<0?'الغرفة أسخن من المطلوب: يتوقف السخان وتبرد الغرفة وحدها.':'لا فرق بين القيمتين: لا شيء يحتاج إلى تصحيح الآن.'}}})}
   ]},

  {st:3,short:'النظام والحاكم والحساس',title:'العناصر 1–3: النظام، والحاكم، والحساس',ref:'ص 99',
   q:'الحرارة ليست كهرباء… فكيف تدخل إلى جهاز لا يفهم إلا الجهد والتيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الحاكم يغذي النظام بالدخل، والنظام يخرج درجة الحرارة، والحساس يحولها إلى جهد كهربائي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الحاكم ⟦Controller⟧: يتحكم في دخل النظام ليثبّت خرجه عند القيمة المطلوبة."><rect x="282" y="44" width="44" height="32" rx="4" fill="#2C4A40"/><path d="M290 44 v-7 M300 44 v-7 M310 44 v-7 M318 44 v-7 M290 76 v7 M300 76 v7 M310 76 v7 M318 76 v7" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="96" width="84" height="56" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="304" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">الحاكم</text><text x="304" y="141" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Controller</text></g><g data-tip="النظام ⟦System⟧: ما نريد التحكم في خرجه وعلاقته مع الدخل. في تطبيقنا: الغرفة، ودخلها حرارة السخان، وخرجها درجة حرارتها."><path d="M160 82 V58 L180 40 L200 58 V82 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><rect x="138" y="96" width="84" height="56" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">النظام</text><text x="180" y="141" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">System</text></g><g data-tip="الحساس أو محوّل الإشارة ⟦Transducer⟧: يحوّل خرج النظام من كمية غير كهربائية (الحرارة) إلى كمية كهربائية، مثل الازدواج الحراري (الثرموكبل)."><path d="M42 42 L56 76 M70 42 L56 76" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M70 42 L56 76" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="78" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="14" y="96" width="84" height="56" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="56" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">الحساس</text><text x="56" y="141" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Transducer</text></g><line x1="262" y1="124" x2="234" y2="124" stroke="#2C4A40" stroke-width="3"/><polygon points="226,124 238,117 238,131" fill="#2C4A40"/><text x="244" y="174" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الدخل</text><line x1="138" y1="124" x2="110" y2="124" stroke="#2C4A40" stroke-width="3"/><polygon points="102,124 114,117 114,131" fill="#2C4A40"/><text x="120" y="174" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الخرج</text><g data-tip="خرج الحساس كمية كهربائية (جهد)، وهذا ما يستطيع جهاز التحكم أن يتعامل معه."><line x1="56" y1="152" x2="56" y2="196" stroke="#2C4A40" stroke-width="3"/><polygon points="56,206 49,194 63,194" fill="#2C4A40"/><rect x="10" y="210" width="92" height="32" rx="8" fill="#4FB3A9"/><text x="56" y="231" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">جهد كهربائي</text></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الحساس يحوّل الحرارة إلى جهد</text></svg>`,
   cap:'الحاكم يتحكم في دخل النظام، والحساس يحوّل خرج النظام (الحرارة) إلى جهد كهربائي.<br><b>مرّر المؤشر على العناصر (أو المسها في الجوال) لتعرف وظيفة كل منها.</b>',
   side:[
    {book:String.raw`<p>وقبل البدء في التطبيق يجب توضيح بعض العناصر المستخدمة في مثل هذه التطبيقات وهي كالتالي:</p>
     <ol><li><b>النظام <span class="ltr">(System)</span>:</b> وهو النظام المراد التحكم بخرجه وعلاقته مع الدخل.</li>
     <li><b>الحاكم <span class="ltr">(Controller)</span>:</b> وهو الذي يقوم بالتحكم في دخل النظام لتثبيت خرجه عند القيمة المطلوبة وهناك عدة أنواع من الحاكمات تم دراستها بالتفصيل في مادة التحكم الآلي وطريقة عملها واستخداماتها وكذلك في مادة التحكم في الآلات. وهذه الحاكمات هي:<br>أ. الحاكم التناسبي.<br>ب. الحاكم التكاملي.<br>ت. الحاكم التناسبي التكاملي.<br>ث. الحاكم التناسبي التكاملي التفاضلي.</li>
     <li><b>الحساسات أو محولات الإشارة <span class="ltr">(Transducers)</span>:</b> وهي عناصر تقوم بتحويل خرج النظام من كميات غير كهربائية إلى كميات كهربائية. مثل الازدواج الحراري الذي يحول درجة الحرارة إلى جهد كهربائي.</li></ol>`,ref:'ص 99'}
   ],
   body:[
    {predict:{q:'في تطبيق التحكم في حرارة الغرفة، أيّ هذه العناصر هو «الحساس»؟',opts:[
     ['السخان',false,'السخان يغيّر الحرارة ولا يقيسها؛ هو الذي يغذي النظام بالدخل.'],
     ['الغرفة نفسها',false,'الغرفة هي «النظام» الذي نريد التحكم في خرجه (حرارتها).'],
     ['الازدواج الحراري (الثرموكبل)',true,'يحوّل درجة الحرارة إلى جهد كهربائي، كما في البند 3 ص 99.']]}},
    {tip:String.raw`<p>في تطبيقنا: <b>النظام</b> = الغرفة، و<b>دخله</b> = الحرارة التي يعطيها السخان، و<b>خرجه</b> = درجة حرارة الغرفة. و<b>الحساس</b> يقيس هذا الخرج ويحوّله إلى جهد، لأن الحاكم لا يتعامل إلا مع الإشارات الكهربائية.</p>`,title:'العناصر في غرفتنا'},
    {add:String.raw`<p>الازدواج الحراري (الثرموكبل) سلكان من معدنين مختلفين ملحومان من طرف واحد. عندما يسخن طرف اللحام يظهر بين الطرفين الآخرين جهد صغير جداً يزيد كلما زادت الحرارة؛ وبهذا الجهد «يقرأ» الجهاز درجة الحرارة.</p>`,title:'كيف يحوّل الثرموكبل الحرارة إلى جهد؟'},
    {watch:String.raw`<p>الحاكمات الأربعة في البند 2 (التناسبي والتكاملي…) درستها في مواد أخرى. الحاكم الذي سنبنيه بالـ PLC في هذه الوحدة هو <b>الحاكم ذو الموضعين</b> (تشغيل/إيقاف)، وستراه في آخر محطة من هذا الدرس.</p>`},
    {title:'مختبر مصغّر: من يقوم بهذا الدور؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل عبارة اضغط العنصر الذي تصفه في تطبيق التحكم في حرارة الغرفة.',cats:['النظام','الحاكم','الحساس'],items:[
     ['الغرفة التي نريد تثبيت حرارتها',0,'النظام هو «المراد التحكم بخرجه»، وخرج الغرفة هو درجة حرارتها.'],
     ['يحوّل حرارة الغرفة إلى جهد كهربائي',2,'هذا عمل الحساس (محوّل الإشارة): يحوّل كمية غير كهربائية إلى كمية كهربائية.'],
     ['يتحكم في دخل الغرفة (تشغيل السخان) ليثبّت حرارتها عند القيمة المطلوبة',1,'الحاكم «يقوم بالتحكم في دخل النظام لتثبيت خرجه عند القيمة المطلوبة».'],
     ['الازدواج الحراري (الثرموكبل)',2,'مثال الكتاب على الحساس: يحوّل درجة الحرارة إلى جهد كهربائي.'],
     ['الحاكم التناسبي التكاملي',1,'أحد أنواع الحاكمات التي ذكرها الكتاب.']]})}
   ]},

  {st:4,short:'جهد المرجع',title:'العنصر 4: جهد المرجع',ref:'ص 99',
   q:'الحاكم يقارن جهوداً… فكيف «نكتب» له الحرارة التي نريدها بالفولت؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقياسان متقابلان: الجهد من صفر إلى 5 فولت والحرارة من صفر إلى 25 درجة، وكل 1 فولت يقابل 5 درجات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="236" y="40" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">الجهد</text><text x="124" y="40" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">الحرارة</text><rect x="228" y="56" width="16" height="214" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="232" y="60" width="8" height="206" rx="4" fill="#4FB3A9"/><rect x="116" y="56" width="16" height="214" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="120" y="60" width="8" height="206" rx="4" fill="#E8735A"/><path d="M244 266 h10 M244 225 h7 M244 184 h7 M244 143 h7 M244 102 h7 M244 61 h10" stroke="#2C4A40" stroke-width="2.5"/><path d="M116 266 h-10 M116 225 h-7 M116 184 h-7 M116 143 h-7 M116 102 h-7 M116 61 h-10" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="271" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 v</text><text x="100" y="271" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 °C</text><g data-tip="في مثال الكتاب: كل ⟦1 v⟧ من الجهد يمثل ⟦5 °C⟧."><rect x="96" y="214" width="180" height="22" fill="transparent"/><line x1="138" y1="225" x2="222" y2="225" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><text x="260" y="230" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1 v</text><text x="100" y="230" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">5 °C</text></g><g data-tip="مثال الكتاب: الحرارة المطلوبة ⟦25 °C⟧ يمثلها جهد المرجع ⟦5 v⟧."><rect x="96" y="50" width="180" height="22" fill="transparent"/><line x1="138" y1="61" x2="222" y2="61" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><text x="260" y="66" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">5 v</text><text x="100" y="66" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">25 °C</text></g><text x="180" y="302" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">كل خط على المقياس يقابل الخط الذي أمامه</text></svg>`,
   cap:'مقياس الجهد ومقياس الحرارة متقابلان: الخط نفسه على المقياسين يعني القيمة نفسها.<br><b>مرّر المؤشر على الخطين المتقطعين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>4. <b>جهد المرجع <span class="ltr">(Reference Voltage)</span>:</b> هذا الجهد الذي يمثل خرج النظام فمثلاً إذا كانت الحرارة المطلوبة <span class="ltr">(25°C)</span> تمثل <span class="ltr">(5v)</span> هذا يعني أن كل <span class="ltr">(1v)</span> يمثل <span class="ltr">(5°C)</span>.</p>`,ref:'ص 99'},
    {predict:{q:String.raw`بمقياس مثال الكتاب نفسه، كم درجةً يمثل جهد <span class="ltr">1 v</span>؟`,opts:[
     [String.raw`<span class="ltr">0.2 °C</span>`,false,String.raw`هذا ناتج قسمة الجهد على الحرارة <span class="ltr">(5 ÷ 25)</span>، أي كم فولتاً لكل درجة، وليس العكس.`],
     [String.raw`<span class="ltr">25 °C</span>`,false,String.raw`<span class="ltr">25 °C</span> يمثلها <span class="ltr">5 v</span> كاملة، لا فولت واحد.`],
     [String.raw`<span class="ltr">5 °C</span>`,true,String.raw`<span class="ltr">25 ÷ 5 = 5</span>: كل فولت يمثل خمس درجات، كما يقول الكتاب.`]]}}
   ],
   body:[
    {tip:String.raw`<p>المقارن والحاكم لا يتعاملان مع «درجات» بل مع «فولتات». لذلك نعبّر عن الحرارة المطلوبة بجهد يسمى <b>جهد المرجع</b>، ونتفق على مقياس ثابت بين الاثنين؛ في مثال الكتاب: <span class="ltr">25°C ↔ 5 v</span>، فيكون كل <span class="ltr">1 v</span> خمس درجات.</p>`,title:'لماذا نحتاج جهد المرجع؟'},
    {title:'حرّك الجهد وشاهد الحرارة التي يمثلها',widget:(el,B)=>{
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">بمقياس مثال الكتاب: كل <span class="ltr">1 v</span> يمثل <span class="ltr">5 °C</span>.</p>
       <label class="w-sl"><span>جهد المرجع <span class="ltr"><b data-o="v"></b> v</span></span><input type="range" min="0" max="5" step="0.5" value="5" dir="ltr"></label>
       <div class="w-facts"><div><span>الجهد</span><b class="ltr" data-o="v2"></b></div><div><span>الحرارة التي يمثلها</span><b class="ltr" data-o="t"></b></div><div><span>المقياس (ص 99)</span><b class="ltr">25 °C = 5 v</b></div></div>`;
      const rg=el.querySelector('input'),o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const v=+rg.value;o('v').textContent=v.toFixed(1);o('v2').textContent=v.toFixed(1)+' v';o('t').textContent=(v*5).toFixed(1)+' °C'};
      rg.oninput=draw;draw();
    }},
    {watch:String.raw`<p>هذا المقياس <span class="ltr">(1 v = 5 °C)</span> مثال فقط. في برنامج الدرس 5.3 يتغير المقياس: هناك <span class="ltr">10 v</span> تمثل <span class="ltr">100 °C</span> (ص 103)، أي كل <span class="ltr">1 v</span> عشر درجات. المهم أن نعرف المقياس المستخدم قبل أن نحوّل.</p>`}
   ]},

  {st:5,short:'المقارن وعنصر التحكم النهائي',title:'العنصران 5 و 6: المقارن، وعنصر التحكم النهائي',ref:'ص 99',
   q:'من الذي «يلاحظ» أن الحرارة ابتعدت عن المطلوب، ومن الذي يوصل الكهرباء إلى السخان فعلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حلقة تحكم مغلقة: القيمة المطلوبة إلى المقارن ثم الحاكم ثم عنصر التحكم النهائي ثم النظام، والحساس يعيد الخرج إلى المقارن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="318" y="34" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">القيمة المطلوبة</text><line x1="318" y1="42" x2="318" y2="68" stroke="#2C4A40" stroke-width="3"/><polygon points="318,77 311,65 325,65" fill="#2C4A40"/><g data-tip="المقارن ⟦Comparator⟧: يقارن جهد القيمة المطلوبة بجهد القيمة الحقيقية القادمة من الحساس، والفرق بينهما هو جهد الخطأ."><circle cx="318" cy="94" r="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M306 82 L330 106 M330 82 L306 106" stroke="#2C4A40" stroke-width="2"/></g><text x="338" y="78" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">+</text><text x="338" y="126" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">−</text><g data-tip="جهد الخطأ: فرق الجهد الناتج من المقارن، يدخل على الحاكم ليصحح الخطأ."><rect x="264" y="82" width="38" height="44" fill="transparent"/><line x1="301" y1="94" x2="276" y2="94" stroke="#E8735A" stroke-width="3.5"/><polygon points="266,94 278,87 278,101" fill="#E8735A"/><text x="284" y="118" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الخطأ</text></g><g data-tip="الحاكم ⟦Controller⟧: يستقبل جهد الخطأ ويقرر كيف يصحح (في تطبيقنا: يشغّل السخان أو يوقفه)."><rect x="180" y="74" width="84" height="40" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="222" y="99" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الحاكم</text></g><line x1="180" y1="94" x2="158" y2="94" stroke="#2C4A40" stroke-width="3"/><polygon points="150,94 162,87 162,101" fill="#2C4A40"/><g data-tip="عنصر التحكم النهائي ⟦Final Controller⟧: يتحكم مباشرة في النظام تبعاً لإشارة الحاكم، مثل متمم السخان."><rect x="22" y="70" width="126" height="48" rx="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="85" y="91" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">عنصر التحكم</text><text x="85" y="109" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">النهائي</text></g><line x1="85" y1="118" x2="85" y2="152" stroke="#2C4A40" stroke-width="3"/><polygon points="85,162 78,150 92,150" fill="#2C4A40"/><g data-tip="النظام ⟦System⟧: الغرفة التي نتحكم في حرارتها."><rect x="22" y="164" width="126" height="44" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="85" y="191" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">النظام (الغرفة)</text></g><path d="M85 208 V262 H176" fill="none" stroke="#2C4A40" stroke-width="3"/><polygon points="186,262 174,255 174,269" fill="#2C4A40"/><text x="112" y="240" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الخرج</text><g data-tip="الحساس: يحوّل حرارة الغرفة إلى جهد (القيمة الحقيقية) ويعيده إلى المقارن."><rect x="188" y="242" width="88" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="232" y="267" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الحساس</text></g><path d="M276 262 H318 V122" fill="none" stroke="#2C4A40" stroke-width="3"/><polygon points="318,112 311,124 325,124" fill="#2C4A40"/><text x="180" y="308" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الخرج يرجع إلى المقارن عبر الحساس</text></svg>`,
   cap:'العناصر الستة معاً في حلقة واحدة: المقارن يحسب الخطأ، والحاكم يقرر، وعنصر التحكم النهائي ينفّذ.<br><b>مرّر المؤشر على العناصر والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>5. <b>المقارن <span class="ltr">(Comparator)</span>:</b> وهو العنصر الذي يقارن بين القيمة المطلوبة للنظام وبين القيمة الحقيقية القادمة من الحساس وذلك على شكل جهود كهربائية فينتج فرق في الجهد يسمى <b>جهد الخطأ</b>، وهذا الفرق في الجهد يدخل على الحاكم للتعامل معه وتصحيح الخطأ لتشغيل مروحة التسخين أو إيقافها.</p>
     <p>6. <b>عنصر التحكم النهائي <span class="ltr">(Final Controller)</span>:</b> هذا العنصر يقوم بالتحكم المباشر في النظام المراد التحكم فيه وذلك تبعاً للإشارة القادمة من الحاكم للحصول على الخرج المثالي للنظام.</p>`,ref:'ص 99'}
   ],
   body:[
    {predict:{q:'أيّ عنصر يُخرج «جهد الخطأ»؟',opts:[
     ['المقارن',true,'يقارن جهد القيمة المطلوبة بجهد الحساس، والفرق بينهما هو جهد الخطأ.'],
     ['الحساس',false,'الحساس يعطي القيمة الحقيقية فقط، والمقارن هو الذي يطرحها من المطلوبة.'],
     ['عنصر التحكم النهائي',false,'هذا آخر الحلقة: ينفّذ أمر الحاكم على النظام مباشرة.']]}},
    {title:'تابع الحلقة خطوة خطوة',widget:(el,B)=>{
      const S=['انخفضت حرارة الغرفة','قلّ جهد الحساس','المقارن: ظهر جهد خطأ','الحاكم يقرر التشغيل','عنصر التحكم النهائي يوصل السخان','ترتفع الحرارة ويصغر الخطأ'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «افتح الباب في الشتاء» وتابع كيف تنتقل الإشارة في الحلقة.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>افتح الباب في الشتاء</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>في تطبيق الغرفة الذي ستبنيه: <b>عنصر التحكم النهائي</b> هو متمم السخان <span class="ltr">K1</span> الذي يوصل الكهرباء إلى مقاومات التسخين (الشكل <span class="ltr">(1-5)</span> في الدرس القادم)، و<b>المقارن والحاكم</b> كلاهما داخل برنامج الـ PLC.</p>`,title:'أين هذه العناصر في تطبيقنا؟'},
    {watch:String.raw`<p>يقول الكتاب «لتشغيل <b>مروحة</b> التسخين أو إيقافها»، والحمل في تطبيق الوحدة سخان كهربي (مقاومات تسخين). الفكرة واحدة: الحاكم يشغّل عنصر التسخين أو يوقفه.</p>`,fix:true}
   ]},

  {st:6,short:'أنظمة التحكم',title:'أنظمة التحكم: الحلقة المفتوحة والحلقة المغلقة',ref:'ص 100',
   q:'لو حذفنا الحساس من الحلقة، هل يبقى السخان قادراً على تثبيت الحرارة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حلقة مفتوحة بلا رجوع للخرج، وحلقة مغلقة يرجع فيها الخرج عبر الحساس" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="34" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">حلقة مفتوحة</text><text x="180" y="50" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Open Loop</text><rect x="244" y="60" width="80" height="34" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="284" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الحاكم</text><rect x="140" y="60" width="80" height="34" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="82" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700">عنصر التحكم</text><rect x="36" y="60" width="80" height="34" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="76" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">النظام</text><path d="M244 77 H228 M140 77 H124" stroke="#2C4A40" stroke-width="2.5"/><polygon points="221,77 230,72 230,82" fill="#2C4A40"/><polygon points="117,77 126,72 126,82" fill="#2C4A40"/><g data-tip="في الحلقة المفتوحة يخرج الخرج ولا يرجع: الحاكم لا يعرف الحرارة الفعلية، فلا يصحح إذا تغيّر الجو."><rect x="6" y="64" width="32" height="26" fill="transparent"/><line x1="36" y1="77" x2="20" y2="77" stroke="#2C4A40" stroke-width="2.5"/><polygon points="12,77 22,72 22,82" fill="#2C4A40"/></g><line x1="30" y1="122" x2="330" y2="122" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 5" opacity=".5"/><text x="180" y="146" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">حلقة مغلقة</text><text x="180" y="162" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Closed Loop</text><rect x="244" y="172" width="80" height="34" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="284" y="194" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الحاكم</text><rect x="140" y="172" width="80" height="34" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="194" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700">عنصر التحكم</text><rect x="36" y="172" width="80" height="34" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="76" y="194" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">النظام</text><path d="M244 189 H228 M140 189 H124" stroke="#2C4A40" stroke-width="2.5"/><polygon points="221,189 230,184 230,194" fill="#2C4A40"/><polygon points="117,189 126,184 126,194" fill="#2C4A40"/><g data-tip="التغذية الراجعة: في الحلقة المغلقة يرجع الخرج عبر الحساس إلى المقارن والحاكم، فيُصحَّح الخطأ باستمرار."><path d="M76 206 V256 H140 M220 256 H284 V214" fill="none" stroke="#12855A" stroke-width="3"/><polygon points="284,207 278,218 290,218" fill="#12855A"/><rect x="140" y="240" width="80" height="32" rx="8" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/><text x="180" y="261" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الحساس</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الفرق: هل يرجع الخرج إلى الحاكم؟</text></svg>`,
   cap:'العناصر نفسها في الحالتين؛ الفرق الوحيد هو المسار الأخضر الذي يعيد الخرج عبر الحساس.<br><b>مرّر المؤشر على سهم الخرج في الأعلى وعلى المسار الأخضر (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>تنقسم أنظمة التحكم كما سبق شرحها في مقررات أخرى إلى قسمين:</p><ol><li>نظام التحكم المفتوح <span class="ltr">(Open Loop)</span>.</li><li>نظام التحكم المغلق <span class="ltr">(Closed Loop)</span>.</li></ol><p><b>ملاحظة:</b> يجب مراجعة الوحدة الأولى لعملية التنسيق بين البلوكات وطريقة ربطها.</p>`,ref:'ص 100'}
   ],
   body:[
    {tip:String.raw`<p>في الحلقة <b>المفتوحة</b> يشغّل الحاكم السخان بقدر ثابت محسوب مسبقاً ولا يقيس النتيجة؛ فإذا تغيّر الجو تغيّرت الحرارة ولا أحد يصحح. في الحلقة <b>المغلقة</b> يرجع الحساس بالقيمة الفعلية إلى المقارن فيُصحَّح الخطأ باستمرار. جرّب ذلك في المختبر: غيّر حرارة الجو مرة في الحلقة المغلقة ومرة في المفتوحة.</p>`,title:'ما الفرق عملياً؟'},
    {predict:{q:'سخان يعمل بمؤقت فقط: يشتغل مدة محددة ثم يفصل، دون أي حساس حرارة. من أي نوع هذا النظام؟',opts:[
     ['حلقة مغلقة، لأن فيه حاكماً (المؤقت)',false,'وجود الحاكم لا يكفي؛ الحلقة المغلقة تحتاج أن يرجع الخرج (الحرارة) إلى الحاكم.'],
     ['حلقة مفتوحة، لأن الحرارة الفعلية لا تُقاس ولا ترجع إلى الحاكم',true,'المؤقت يفصل بعد المدة سواء سخنت الغرفة أم لا.'],
     ['ليس نظام تحكم أصلاً',false,'هو نظام تحكم، لكنه مفتوح: يتحكم في الدخل دون أن يراقب الخرج.']]}},
    {add:String.raw`<p>الغسالة التي تعمل ببرنامج زمني ثابت مثال على الحلقة المفتوحة: تغسل المدة المبرمجة ولا «ترى» هل نظفت الملابس. أما سخان الماء في البيت فحلقة مغلقة: فيه حساس يفصل السخان عندما يصل الماء إلى الحرارة المضبوطة.</p>`,title:'مثالان من البيت'},
    {title:'مختبر مصغّر: مفتوحة أم مغلقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'السؤال الفاصل: هل تُقاس النتيجة وترجع إلى الحاكم؟ صنّف كل مثال.',cats:['حلقة مفتوحة','حلقة مغلقة'],items:[
     ['غسالة تغسل المدة المبرمجة ولا تفحص هل نظفت الملابس',0,'لا شيء يقيس النتيجة ويرجع بها؛ تعمل بالزمن فقط.'],
     ['سخان ماء فيه حساس يفصله عندما يصل الماء إلى الحرارة المضبوطة',1,'الحساس يرجع بالحرارة الفعلية فيُصحَّح التشغيل.'],
     ['سخان يعمل بقدر ثابت محسوب مسبقاً، ولا تُقاس حرارة الغرفة',0,'لو تغيّر الجو تغيّرت الحرارة ولا أحد يصحح.'],
     ['منظومة هذه الوحدة: ثرموكبل يرجع بالحرارة الفعلية إلى الـ <span class="ltr">PLC</span> ليقارنها بالمطلوبة',1,'القيمة الفعلية ترجع وتُقارن بالمرغوبة باستمرار.']]})}
   ]},

  {st:7,short:'الحاكم ذو الموضعين',title:'الحاكم ذو الموضعين',ref:'ص 100',
   q:'لماذا لا نحتاج حاكماً معقداً للسخان، ويكفي أن «يعمل أو يتوقف»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مفتاح بوضعين تشغيل وإيقاف، ومنحنى حرارة يرتفع ببطء عند التشغيل وينخفض ببطء عند الإيقاف بين حدين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الحاكم ذو الموضعين: له وضعان فقط — السخان يعمل بكامل قدرته (تشغيل) أو يتوقف تماماً (إيقاف)، ولا يوجد وضع بينهما."><rect x="100" y="40" width="160" height="56" rx="28" fill="#2C4A40"/><rect x="182" y="46" width="72" height="44" rx="22" fill="#12855A"/><text x="218" y="74" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">تشغيل</text><text x="142" y="74" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" opacity=".75">إيقاف</text></g><line x1="50" y1="140" x2="50" y2="272" stroke="#2C4A40" stroke-width="2.5"/><line x1="50" y1="272" x2="320" y2="272" stroke="#2C4A40" stroke-width="2.5"/><text x="60" y="134" font-size="12" fill="#2C4A40" font-weight="700">الحرارة</text><text x="318" y="290" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700">الزمن</text><g data-tip="الحد الأعلى: عندما تتجاوزه الحرارة يتوقف السخان. في برنامج الدرس 5.3 هو ⟦120%⟧ من الحرارة المطلوبة."><rect x="50" y="166" width="270" height="18" fill="transparent"/><line x1="50" y1="175" x2="320" y2="175" stroke="#E8735A" stroke-width="2" stroke-dasharray="6 5"/><text x="318" y="168" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700">حد الإيقاف</text></g><g data-tip="الحد الأدنى: عندما تنخفض الحرارة إليه يعمل السخان. في برنامج الدرس 5.3 هو ⟦80%⟧ من الحرارة المطلوبة."><rect x="50" y="236" width="270" height="18" fill="transparent"/><line x1="50" y1="245" x2="320" y2="245" stroke="#12855A" stroke-width="2" stroke-dasharray="6 5"/><text x="318" y="262" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700">حد التشغيل</text></g><g data-tip="السخان يعمل: الحرارة ترتفع ببطء لأن أنظمة التسخين بطيئة الاستجابة."><path d="M54 245 Q 80 186 112 175 M178 245 Q 204 186 236 175" fill="none" stroke="transparent" stroke-width="16"/><path d="M54 245 Q 80 186 112 175 M178 245 Q 204 186 236 175" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/></g><g data-tip="السخان متوقف: الحرارة تنخفض ببطء حتى تصل إلى حد التشغيل فيعمل من جديد."><path d="M112 175 Q 150 184 178 245 M236 175 Q 274 184 302 245" fill="none" stroke="transparent" stroke-width="16"/><path d="M112 175 Q 150 184 178 245 M236 175 Q 274 184 302 245" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/></g><line x1="190" y1="300" x2="212" y2="300" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><text x="184" y="305" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700">يعمل</text><line x1="104" y1="300" x2="126" y2="300" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="98" y="305" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700">متوقف</text></svg>`,
   cap:'شكل توضيحي بلا أرقام: البرتقالي = السخان يعمل، والفيروزي = متوقف. الحرارة تتأرجح ببطء بين الحدين.<br><b>مرّر المؤشر على المفتاح والخطين والمنحنى (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يستخدم <b>الحاكم ذو الموضعين</b> بشكل واسع في مجال التحكم في درجة الحرارة وذلك لكون <b>أنظمة التسخين تكون بطيئة الاستجابة</b>.</p>`,ref:'ص 100'},
    {predict:{q:'لماذا يناسب الحاكم ذو الموضعين أنظمة التسخين بالذات؟',opts:[
     ['لأنها سريعة الاستجابة فتحتاج قراراً سريعاً',false,'العكس: الكتاب يقول إن أنظمة التسخين بطيئة الاستجابة.'],
     ['لأنه لا يحتاج إلى حساس حرارة',false,'يحتاج حساساً ليعرف متى يشغّل ومتى يوقف؛ هو حلقة مغلقة.'],
     ['لأن الحرارة تتغير ببطء، فلا يتكرر التشغيل والإيقاف بسرعة',true,'بطء التسخين والتبريد يجعل كل وضع يستمر مدة معقولة.']]}}
   ],
   body:[
    {tip:String.raw`<p>«موضعان» = وضعان فقط: السخان إما <b>يعمل بكامل قدرته</b> أو <b>يتوقف تماماً</b>. ولأن الغرفة تسخن وتبرد ببطء، تبقى الحرارة تتأرجح قليلاً حول المطلوب دون أن يُرهَق المتمم بالتشغيل والإيقاف المتكرر. سنبني هذا الحاكم بالـ PLC في الدرسين 5.3 و 5.4.</p>`,title:'ما معنى «ذو الموضعين»؟'},
    {add:String.raw`<p>مكواة الملابس مثال يومي: تسمع «طقّة» عندما يفصل منظم الحرارة بداخلها، ثم «طقّة» أخرى بعد قليل عندما يعيد التوصيل. هذا حاكم ذو موضعين: تسخين كامل أو لا تسخين.</p>`,title:'مثال من البيت'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['الحاكم ذو الموضعين يشغّل السخان بنصف قدرته عندما تقترب الحرارة من المطلوب.',false,'«موضعان» = وضعان فقط: السخان يعمل بكامل قدرته أو يتوقف تماماً.'],
     ['يُستخدم الحاكم ذو الموضعين بشكل واسع في التحكم في درجة الحرارة لأن أنظمة التسخين بطيئة الاستجابة.',true,'هذا نص الكتاب (ص 100).'],
     ['مع الحاكم ذي الموضعين تبقى الحرارة تتأرجح قليلاً حول المطلوب بدل أن تثبت عليه تماماً.',true,'السخان يعمل أو يتوقف، والغرفة تسخن وتبرد ببطء، فتتأرجح الحرارة حول المطلوب.']]})}
   ]},

  {recap:[
   String.raw`للتحكم في الحرارة نقيس الحرارة الفعلية <span class="ltr">actual value</span> ونقارنها بالمرغوبة <span class="ltr">set value</span>، والخطأ بينهما يحدد سلوك المنظومة (ص 99).`,
   String.raw`العناصر الستة: النظام، الحاكم، الحساس (مثل الازدواج الحراري)، جهد المرجع، المقارن (يُخرج جهد الخطأ)، عنصر التحكم النهائي (ص 99).`,
   String.raw`جهد المرجع يمثل الحرارة بالفولت؛ في مثال الكتاب <span class="ltr">25°C ↔ 5 v</span>، فكل <span class="ltr">1 v</span> يمثل <span class="ltr">5°C</span>.`,
   String.raw`أنظمة التحكم قسمان: مفتوح <span class="ltr">(Open Loop)</span> لا يرجع فيه الخرج، ومغلق <span class="ltr">(Closed Loop)</span> يرجع فيه الخرج عبر الحساس (ص 100).`,
   String.raw`الحاكم ذو الموضعين (تشغيل/إيقاف) واسع الاستخدام في التحكم في الحرارة لأن أنظمة التسخين بطيئة الاستجابة (ص 100).`]}
],
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 97–98',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> أن يعرف المتدرب كيف يتم عمل دائرة التحكم في درجة الحرارة (طريقة التحكم في درجات الحرارة)، وأن يكتب برامج للتحكم في درجة الحرارة.</p>
   <p><b>محتوى الوحدة (ص 98):</b> أولاً: فكرة عمل التحكم في درجات الحرارة. ثانياً: كتابة برنامج للتحكم في درجات الحرارة (PLC) باللغة (LAD).</p>
   <p><b>مستوى الأداء:</b> 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'صفحة المقدمة مكررة بصيغتين: متطلبات الجدارة في ص 97 «اجتياز ورشة أساسيات الكهرباء، اجتياز الرسم الفني»، وفي ص 98 «اجتياز ورشة التحكم في المحركات الثلاثية الأوجه»، والوسائل في ص 97 بلا «كراسة الطالب».'+'</div>'},
  {h:'أولاً: فكرة عمل التحكم في درجات الحرارة',ref:'ص 99',html:`<p>«من المعلوم أن التحكم في درجة الحرارة من الأمور المهمة في التطبيقات العملية. وحتى تتم عملية التحكم في درجة الحرارة عن طريق سخان كهربي فيلزم قياس درجة الحرارة الفعلية <span class="ltr">actual value</span> ومقارنتها بدرجة الحرارة المرغوب بها <span class="ltr">set value</span> وبالتالي فإن قيمة الخطأ بين القيمة المرغوب بها والقيمة الفعلية تحدد سلوك منظومة التحكم.»</p>
   <p>العناصر المستخدمة في مثل هذه التطبيقات:</p>
   <ol><li><b>النظام (System):</b> النظام المراد التحكم بخرجه وعلاقته مع الدخل.</li>
   <li><b>الحاكم (Controller):</b> يتحكم في دخل النظام لتثبيت خرجه عند القيمة المطلوبة. وأنواعه (درست في مادة التحكم الآلي ومادة التحكم في الآلات): أ. التناسبي، ب. التكاملي، ت. التناسبي التكاملي، ث. التناسبي التكاملي التفاضلي.</li>
   <li><b>الحساسات أو محولات الإشارة (Transducers):</b> تحول خرج النظام من كميات غير كهربائية إلى كميات كهربائية، مثل الازدواج الحراري الذي يحول درجة الحرارة إلى جهد كهربائي.</li>
   <li><b>جهد المرجع (Reference Voltage):</b> الجهد الذي يمثل خرج النظام؛ فمثلاً إذا كانت الحرارة المطلوبة <span class="ltr">25°C</span> تمثل <span class="ltr">5 v</span> فهذا يعني أن كل <span class="ltr">1 v</span> يمثل <span class="ltr">5°C</span>.</li>
   <li><b>المقارن (Comparator):</b> يقارن بين القيمة المطلوبة والقيمة الحقيقية القادمة من الحساس على شكل جهود كهربائية، فينتج فرق في الجهد يسمى <b>جهد الخطأ</b>، يدخل على الحاكم لتصحيح الخطأ لتشغيل مروحة التسخين أو إيقافها.</li>
   <li><b>عنصر التحكم النهائي (Final Controller):</b> يتحكم مباشرة في النظام تبعاً للإشارة القادمة من الحاكم للحصول على الخرج المثالي.</li></ol>`},
  {widget:(el)=>{el.innerHTML=`<div class="fig"><p><b>مثال جهد المرجع من الكتاب:</b> حرّك الجهد وشاهد درجة الحرارة التي يمثلها (كل 1 v = 5°C).</p>
     <label class="toggle" style="margin-top:6px">الجهد <input type="range" min="0" max="10" step="0.5" value="5" style="width:220px;height:auto"></label><div class="facts"></div></div>`;
     const f=el.querySelector('.facts'),i=el.querySelector('input');const upd=()=>{const v=+i.value;f.innerHTML=`<div class="fact"><span>الجهد</span><b>${v.toFixed(1)} v</b></div><div class="fact"><span>الحرارة التي يمثلها</span><b>${(v*5).toFixed(1)} °C</b></div><div class="fact"><span>القاعدة</span><b>25°C ↔ 5 v</b></div>`};i.oninput=upd;upd()}},
  {h:'أنظمة التحكم',ref:'ص 100',html:'<p>«تنقسم أنظمة التحكم كما سبق شرحها في مقررات أخرى إلى قسمين:» <b>1- نظام التحكم المفتوح (Open Loop)</b>، و <b>2- نظام التحكم المغلق (Closed Loop)</b>.</p><p><b>ملاحظة من الكتاب:</b> يجب مراجعة الوحدة الأولى لعملية التنسيق بين البلوكات وطريقة ربطها.</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في الحلقة <b>المفتوحة</b> يشغّل الحاكم السخان بقدر ثابت محسوب مسبقاً ولا يقيس النتيجة، فإذا تغيّر الجو تغيّرت الحرارة ولا أحد يصحح. في الحلقة <b>المغلقة</b> يرجع الحساس بالقيمة الفعلية إلى المقارن فيُصحَّح الخطأ باستمرار. جرّب ذلك في المختبر: غيّر حرارة الجو مرة في الحلقة المغلقة ومرة في المفتوحة.'},
  {h:'الحاكم ذو الموضعين',ref:'ص 100',html:'<p>«يستخدم الحاكم ذو الموضعين بشكل واسع في مجال التحكم في درجة الحرارة وذلك لكون أنظمة التسخين تكون بطيئة الاستجابة.» أي أن السخان إما يعمل بالكامل أو يتوقف (موضعان: تشغيل / إيقاف). سنبني هذا الحاكم بالـ PLC في الدرسين 5.3 و 5.4.</p>'}
 ],
 lab:(el)=>{
  const st={T:22,Ta:25,set:40,closed:true,H:0,t:0};const hist=[];let ht=0;
  el.innerHTML=`<div id="l1tp"></div><div class="grid"><div class="panel c12"><h2>منظومة التحكم في حرارة غرفة <small>مخطط كتلي تفاعلي — <span id="l1tpw">توضيحي</span></small></h2>
   <div class="viewseg" style="margin-top:8px"><div class="seg" role="group"><button data-lp="1" aria-pressed="true">حلقة مغلقة (مع الحساس)</button><button data-lp="0" aria-pressed="false">حلقة مفتوحة (بدون حساس)</button></div></div>
   <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:8px"><label class="toggle">القيمة المطلوبة <input type="range" id="sv" min="20" max="70" step="1" value="40" style="width:180px;height:auto"> <b class="ltr" id="svv"></b></label>
   <label class="toggle">حرارة الجو المحيط <input type="range" id="ta" min="0" max="40" step="1" value="25" style="width:180px;height:auto"> <b class="ltr" id="tav"></b></label></div>
   <div class="svgbox" id="bd"></div>${chOn()?'<div class="reads" id="l1m"></div>':''}</div>
   <div class="panel c7"><h2>الحرارة مع الزمن <small>آخر 60 ثانية</small></h2><div class="chart"><canvas id="ch"></canvas></div><div class="legend"><span><i style="background:var(--blue)"></i>الحرارة الفعلية</span><span><i style="background:var(--muted)"></i>القيمة المطلوبة</span></div><p class="sub" id="l1tpn" hidden></p></div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="stp"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  // قيم المدرب: نموذج الغرفة (أرقام توضيحية ليست من الكتاب). الافتراضي = النموذج السابق تماماً
  let ymx=80,tks=[0,20,40,60,80];
  const tpU=()=>{const G=TP.v.G;ymx=G<=60?80:Math.ceil((40+G)/20)*20;tks=[0,1,2,3,4].map(i=>ymx*i/4);$('#l1tpw').textContent=TP.trainer?'قيم المدرب':'توضيحي'};
  const TP=B.params($('#l1tp'),'u5-l1',[
   {k:'G',label:'أقصى ارتفاع لحرارة الغرفة فوق حرارة الجو عندما يعمل السخان بكامل قدرته',unit:'°C',value:60,min:5,max:500,step:1},
   {k:'tau',label:'ثابت زمن الغرفة (كلما كبر تسخن الغرفة وتبرد أبطأ)',unit:'s',value:8,min:1,max:600,step:0.5}],tpU);tpU();
  el.querySelectorAll('[data-lp]').forEach(b=>b.onclick=()=>{st.closed=b.dataset.lp==='1';el.querySelectorAll('[data-lp]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  $('#sv').oninput=e=>st.set=+e.target.value;$('#ta').oninput=e=>st.Ta=+e.target.value;
  const flags={};
  const chk=checklist($('#stp'),[
   {t:'الحلقة المغلقة',x:'اترك القيمة المطلوبة 40°C. راقب كيف يشغّل الحاكم السخان ويوقفه حتى تستقر الحرارة حول 40°C.',done:()=>st.closed&&st.t>8&&Math.abs(st.T-st.set)<1.5},
   {t:'غيّر الجو',x:'اخفض حرارة الجو إلى 10°C أو أقل. الحساس يكشف الانخفاض، والمقارن يعطي جهد خطأ موجباً، فيعمل السخان أكثر وتبقى الحرارة قرب المطلوب.',done:()=>{if(st.closed&&st.Ta<=10)flags.c=(flags.c||0)+1;return st.closed&&st.Ta<=10&&flags.c>200&&Math.abs(st.T-st.set)<2}},
   {t:'الحلقة المفتوحة',x:'اختر «حلقة مفتوحة». الحاكم الآن يشغّل السخان بقدر ثابت محسوب على أساس جو 25°C ولا يرى الحرارة الفعلية. انتظر وراقب ابتعاد الحرارة عن المطلوب.',done:()=>!st.closed&&Math.abs(st.T-st.set)>5},
   {t:'عد إلى المغلقة',x:'اختر «حلقة مغلقة» من جديد ولاحظ تصحيح الخطأ. هذه فائدة الحساس والمقارن.',done:()=>st.closed&&Math.abs(st.T-st.set)<1.5}]);
  const box=(x,y,w,t1,t2,on,dim)=>`<rect x="${x}" y="${y}" width="${w}" height="46" rx="6" class="sym" fill="${on?'var(--on-soft)':'var(--surface)'}" ${dim?'opacity=".4"':''}/>`+ar(x+w/2,y+19,t1,'','middle',12)+S.t(x+w/2,y+37,t2,'b');
  /* أعطال مخفية: الحساس مقطوع (يقرأ صفراً) أو منحرف (يقرأ أقل بـ 10°C) — meas = الحرارة كما يراها الحاكم */
  const meas=()=>chF('tcOpen')?0:chF('tcOff')?st.T-10:st.T;
  const draw=()=>{const Vr=st.set/5,Vs=meas()/5,e=Vr-Vs,cl=st.closed;const fb=cl?'live':'';
   let s=`<svg viewBox="0 0 760 250">`;
   s+=box(10,30,110,'القيمة المطلوبة','Set = '+st.set+' °C');
   s+=S.w('M120 53H150','live')+box(150,30,120,'جهد المرجع','Vref = '+Vr.toFixed(2)+' v');
   s+=S.w('M270 53H312','live')+`<circle cx="330" cy="53" r="18" class="sym" fill="var(--surface)" ${cl?'':'opacity=".4"'}/>`+S.t(330,58,'Σ')+S.t(306,46,'+','m')+S.t(340,86,'−','m')+ar(330,20,'المقارن','m','middle',11);
   s+=S.w('M348 53H380',cl?'live':'')+S.t(364,46,cl?'e='+e.toFixed(2):'—','m');
   s+=box(380,30,110,'الحاكم',cl?(st.H?'ON':'OFF'):'P = '+Math.round(st.duty*100)+'%',st.H||(!cl&&st.duty>0));
   s+=S.w('M490 53H520',st.H||(!cl&&st.duty)?'flow':'')+box(520,30,110,'عنصر التحكم النهائي','K1 '+(cl?(st.H?'ON':'OFF'):'~'),st.H||(!cl&&st.duty>0));
   s+=S.w('M630 53H650','live')+box(650,30,100,'النظام: الغرفة','T = '+st.T.toFixed(1)+' °C');
   s+=S.w('M700 76V180H560',fb)+box(440,157,120,'الحساس (ثرموكبل)','Vs = '+(cl?Vs.toFixed(2)+' v':'—'),false,!cl);
   s+=S.w('M440 180H330V71',cl?'live':'',cl?'':'stroke-dasharray="4 5"');
   s+=ar(380,235,cl?'حلقة مغلقة: الخرج يرجع إلى المقارن عبر الحساس.':'حلقة مفتوحة: لا رجوع للخرج، الحاكم لا يعرف الحرارة الفعلية.','m','middle',12);
   $('#bd').innerHTML=s+'</svg>';$('#svv').textContent=st.set+' °C';$('#tav').textContent=st.Ta+' °C'};
  let rd=0;
  runLoop(el,dt=>{st.t+=dt;const tau=TP.v.tau,G=TP.v.G;
   if(st.closed){const e=st.set/5-meas()/5;if(e>0.1)st.H=1;else if(e<-0.1)st.H=0;st.duty=st.H}
   else{st.duty=clamp((st.set-25)/G,0,1);st.H=0}
   const P=chF('heatOpen')?0:chF('k1weld')?1:st.closed?st.H:st.duty;st.T+=dt*(G*P-(st.T-st.Ta))/tau;   // أعطال مخفية: عنصر التسخين مقطوع، أو تلامسات K1 ملتحمة
   const l1m=$('#l1m');if(l1m)l1m.innerHTML=`<div class="read"><span>حرارة الغرفة T</span><b>${st.T.toFixed(1)} °C</b></div><div class="read"><span>القيمة المطلوبة</span><b>${st.set} °C</b></div><div class="read"><span>حرارة الجو</span><b>${st.Ta} °C</b></div>`;
   const tn=$('#l1tpn'),mx=st.Ta+G,lim=mx<st.set;if(tn){tn.hidden=!lim;if(lim)tn.innerHTML=`بهذه القيم أقصى حرارة تصلها الغرفة والسخان يعمل باستمرار = حرارة الجو + <span class="ltr">${fnum(G,1)}</span> = <span class="ltr">${fnum(mx,1)} °C</span>، وهي أقل من القيمة المطلوبة، فلن تصل الحرارة إليها.`}
   ht+=dt;if(ht>0.1){ht=0;hist.push({t:st.t,v:st.T,sv:st.set});while(hist.length&&st.t-hist[0].t>60.3)hist.shift()}
   rd+=dt;if(rd>0.1){rd=0;draw()}
   const c=$('#ch');if(c)W.chart(c,hist,{now:st.t,span:60,ymax:ymx,ticks:tks,unit:'°',series:[{key:'v',color:'--blue'},{key:'sv',color:'--muted'}]});chk()});
  draw();
 },
 quiz:[
  {q:'لكي نتحكم في الحرارة بسخان كهربي، ماذا يلزم حسب الكتاب؟',o:['تشغيل السخان دائماً','قياس الحرارة الفعلية ومقارنتها بالمرغوبة','قياس التيار فقط','تغيير الجهد يدوياً'],c:1,e:'«فيلزم قياس درجة الحرارة الفعلية actual value ومقارنتها بدرجة الحرارة المرغوب بها set value» ص 99.'},
  {q:'ما وظيفة الحساس (Transducer)؟',o:['يقارن بين قيمتين','يحول كمية غير كهربائية (مثل الحرارة) إلى كمية كهربائية','يشغل السخان','يخزن البرنامج'],c:1,e:'مثل الازدواج الحراري الذي يحول درجة الحرارة إلى جهد.'},
  {q:'إذا كانت 25°C تمثلها 5 v، فكم تمثل 1 v؟',o:['1°C','5°C','25°C','0.2°C'],c:1,e:'25 ÷ 5 = 5°C لكل فولت (ص 99).'},
  {q:'ما اسم الفرق في الجهد الذي يخرجه المقارن؟',o:['جهد المرجع','جهد الخطأ','جهد التغذية','الجهد الفعلي'],c:1,e:'المقارن ينتج «جهد الخطأ» ويدخله على الحاكم.'},
  {q:'أي مما يلي ليس من أنواع الحاكمات المذكورة؟',o:['التناسبي','التكاملي','التناسبي التكاملي التفاضلي','الحاكم الحراري المغناطيسي'],c:3,e:'المذكور: التناسبي، التكاملي، التناسبي التكاملي، التناسبي التكاملي التفاضلي.'},
  {q:'لماذا يستخدم الحاكم ذو الموضعين كثيراً في التحكم في الحرارة؟',o:['لأنه أغلى','لأن أنظمة التسخين بطيئة الاستجابة','لأنه لا يحتاج حساساً','لأنه يتحكم في السرعة'],c:1,e:'ص 100.'},
  {q:'إلى كم قسم تنقسم أنظمة التحكم؟',o:['قسم واحد','قسمان: مفتوح ومغلق','ثلاثة','أربعة'],c:1,e:'Open Loop و Closed Loop (ص 100).'},
  {q:'أي عنصر يتحكم مباشرة في النظام تبعاً لإشارة الحاكم (مثل متمم السخان)؟',o:['المقارن','عنصر التحكم النهائي','الحساس','جهد المرجع'],c:1,e:'Final Controller.'}
 ]
});

/* =================== Lesson 5.2 =================== */
B.lesson({
 id:'u5-l2',unit:5,order:2,pages:'100–102',
 title:'مخطط توصيل الـ PLC، جدول التشغيل، وتهيئة موديول الدخل التناظري للثرموكبل',
 summary:'الشكل (1-5): الضاغطان S1 و S0، والثرموكبل على PIW290، والمقاومة المتغيرة على PIW288، والسخان K1 والمصباح H1. ثم تهيئة الموديول (الشكل 2-5) وجدول قراءة الثرموكبل: القراءة = الحرارة × 10.',
 stations:[
  {intro:true},

  {st:1,short:'مخطط التوصيل',title:'التحكم في درجة حرارة غرفة باستخدام حاكم ذي موضعين: الشكل <span class="ltr">(1-5)</span>',ref:'ص 100',
   q:'ضاغطان ومخرجان تعرفهما… فما الجديد في هذا الـ PLC؟ انظر إلى المدخلين اللذين يبدأ عنوانهما بـ PIW.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-5: الضاغطان S1 و S0 والثرموكبل والمقاومة المتغيرة R على مداخل الـ PLC، والمتمم K1 والمصباح H1 على مخارجه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="وحدة الـ ⟦PLC⟧: المداخل على يسارها والمخارج على يمينها، كما في الشكل ⟦(1-5)⟧."><rect x="140" y="30" width="80" height="252" rx="8" fill="#2C4A40"/><text x="180" y="54" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text></g><text x="146" y="78" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><text x="146" y="128" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><text x="146" y="183" font-size="11" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">PIW290</text><text x="146" y="250" font-size="11" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">PIW288</text><text x="214" y="94" text-anchor="end" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.0</text><text x="214" y="174" text-anchor="end" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><g data-tip="⟦S1⟧ «⟦Heat enable⟧»: ضاغط بدء التسخين، موصول على المدخل ⟦I0.1⟧ حسب الشكل."><rect x="10" y="38" width="130" height="58" fill="transparent"/><path d="M14 74 H28 M58 74 H140" stroke="#2C4A40" stroke-width="2.5"/><circle cx="28" cy="74" r="3" fill="#2C4A40"/><circle cx="58" cy="74" r="3" fill="#2C4A40"/><path d="M24 64 H62 M43 64 V52 M36 52 H50" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="43" y="46" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text><text x="100" y="89" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Heat enable</text></g><g data-tip="⟦S0⟧ «⟦Stop Heating⟧»: ضاغط إنهاء التسخين، موصول على المدخل ⟦I0.0⟧ حسب الشكل."><rect x="10" y="98" width="130" height="50" fill="transparent"/><path d="M14 124 H28 M58 124 H140" stroke="#2C4A40" stroke-width="2.5"/><circle cx="28" cy="124" r="3" fill="#2C4A40"/><circle cx="58" cy="124" r="3" fill="#2C4A40"/><path d="M24 114 H62 M43 114 V102 M36 102 H50" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="72" y="110" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S0</text><text x="100" y="139" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Stop Heating</text></g><g data-tip="الثرموكبل نوع ⟦K⟧ ⟦(Thermocouple K-Type)⟧: حساس الحرارة الفعلية، سلكاه على المدخل التناظري ⟦PIW290⟧."><rect x="10" y="154" width="130" height="44" fill="transparent"/><path d="M140 173 H72 L44 180 M140 187 H72 L44 180" fill="none" stroke="#2C4A40" stroke-width="2.5"/><path d="M140 187 H72 L44 180" fill="none" stroke="#4FB3A9" stroke-width="2.5"/><circle cx="42" cy="180" r="5" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><text x="82" y="166" text-anchor="middle" font-size="9" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Thermocouple K-Type</text></g><g data-tip="المقاومة المتغيرة ⟦R⟧: طرفاها بين ⟦10 VDC⟧ و⟦0 VDC⟧، ومنزلقها على المدخل التناظري ⟦PIW288⟧؛ بها نضبط الحرارة المطلوبة."><rect x="10" y="200" width="130" height="104" fill="transparent"/><path d="M37 212 V222 M37 272 V282" stroke="#2C4A40" stroke-width="2.5"/><rect x="30" y="222" width="14" height="50" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M140 246 H56" stroke="#2C4A40" stroke-width="2.5"/><polygon points="46,246 58,240 58,252" fill="#2C4A40"/><text x="37" y="207" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">10 VDC</text><text x="37" y="296" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 VDC</text><text x="74" y="237" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text></g><g data-tip="⟦K1⟧ ⟦(Heater K1)⟧: متمم تشغيل السخان على المخرج ⟦Q4.0⟧؛ نقاطه الرئيسة توصل مقاومات التسخين في دائرة القدرة."><path d="M220 90 H262" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="76" width="76" height="28" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="300" y="94" text-anchor="middle" font-size="10.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Heater K1</text></g><g data-tip="⟦H1⟧: مصباح بيان عمل السخان على المخرج ⟦Q4.1⟧."><path d="M220 170 H281" stroke="#2C4A40" stroke-width="2.5"/><circle cx="294" cy="170" r="13" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M285 161 L303 179 M303 161 L285 179" stroke="#2C4A40" stroke-width="2"/><text x="294" y="200" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">H1</text></g><text x="290" y="252" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">المخارج</text><text x="290" y="270" text-anchor="middle" font-size="11" fill="#2C4A40">رقمية</text></svg>`,
   cap:'دائرة التحكم من الشكل <span class="ltr">(1-5)</span>: المداخل يساراً والمخارج يميناً. العنوانان الأصفران مدخلان تناظريان.<br><b>مرّر المؤشر على العناصر (أو المسها في الجوال) لتعرف اسم كل منها وعنوانه.</b>',
   side:[
    {book:String.raw`<p>يستخدم الحاكم ذو الموضعين بشكل واسع في مجال التحكم في درجة الحرارة وذلك لكون أنظمة التسخين تكون بطيئة الاستجابة. والشكل التالي يبين مخطط توصيل وحدة <span class="ltr">(PLC)</span> للتحكم في درجة حرارة الغرفة:</p>`,ref:'ص 100'},
    {predict:{q:String.raw`ما الذي يدخل إلى العنوان <span class="ltr">PIW288</span>؟`,opts:[
     ['الثرموكبل',false,String.raw`الثرموكبل على <span class="ltr">PIW290</span>.`],
     ['الضاغط S1',false,String.raw`الضواغط على مداخل رقمية تبدأ بالحرف <span class="ltr">I</span>.`],
     ['منزلق المقاومة المتغيرة R',true,'به يضبط المشغّل الحرارة المطلوبة، كما في الشكل (1-5).']]}}
   ],
   body:[
    {tip:String.raw`<ul><li><b>مداخل رقمية:</b> <span class="ltr">I0.1</span> ← الضاغط <span class="ltr">S1</span> «Heat enable»، و<span class="ltr">I0.0</span> ← الضاغط <span class="ltr">S0</span> «Stop Heating».</li><li><b>مداخل تناظرية:</b> <span class="ltr">PIW290</span> ← الثرموكبل <span class="ltr">K-Type</span>، و<span class="ltr">PIW288</span> ← منزلق المقاومة المتغيرة <span class="ltr">R</span> بين <span class="ltr">10 VDC</span> و<span class="ltr">0 VDC</span>.</li><li><b>مخارج:</b> <span class="ltr">Q4.0</span> ← متمم السخان <span class="ltr">K1</span>، و<span class="ltr">Q4.1</span> ← المصباح <span class="ltr">H1</span>.</li></ul>`,title:'اقرأ الشكل'},
    {html:String.raw`<figure class="fig"><div class="svgbox" style="max-width:320px;margin-inline:auto"><svg viewBox="0 0 300 260" role="img" aria-label="دائرة القدرة: الخطوط الثلاثة ثم المصهرات ثم نقاط المتمم K1 ثم ثلاث مقاومات تسخين موصولة نجمة" style="font-family:var(--font)"><path d="M40 20 H280 M40 34 H280 M40 48 H280" stroke="#2C4A40" stroke-width="2.5"/><text x="32" y="24" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">L1</text><text x="32" y="38" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">L2</text><text x="32" y="52" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">L3</text><g stroke="#2C4A40" stroke-width="2.5" fill="none"><path d="M120 20 V70 M160 34 V70 M200 48 V70"/><path d="M120 94 V112 M160 94 V112 M200 94 V112"/><path d="M120 112 L108 134 M160 112 L148 134 M200 112 L188 134"/><path d="M120 136 V160 M160 136 V160 M200 136 V160"/><path d="M120 206 V226 M160 206 V226 M200 206 V226 M120 226 H200"/></g><circle cx="120" cy="20" r="3.5" fill="#2C4A40"/><circle cx="160" cy="34" r="3.5" fill="#2C4A40"/><circle cx="200" cy="48" r="3.5" fill="#2C4A40"/><g fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"><rect x="114" y="70" width="12" height="24"/><rect x="154" y="70" width="12" height="24"/><rect x="194" y="70" width="12" height="24"/></g><path d="M100 124 H214" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="5 4"/><text x="222" y="128" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">K1</text><g fill="#F7DCC8" stroke="#E8735A" stroke-width="2.5"><rect x="113" y="160" width="14" height="46"/><rect x="153" y="160" width="14" height="46"/><rect x="193" y="160" width="14" height="46"/></g><circle cx="160" cy="226" r="4" fill="#2C4A40"/><text x="160" y="248" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">E</text></svg></div><figcaption>دائرة القدرة في الشكل <span class="ltr">(1-5)</span>: مصهر على كل خط، ثم نقاط <span class="ltr">K1</span> الرئيسة (الخط المتقطع يربطها ميكانيكياً)، ثم ثلاث مقاومات تسخين موصولة نجمة ونقطة النجمة <span class="ltr">E</span>. <span class="ref">ص 100</span></figcaption></figure>`},
    {tip:String.raw`<p>المدخل الرقمي (مثل <span class="ltr">I0.1</span>) يعطي البرنامج <span class="ltr">0</span> أو <span class="ltr">1</span> فقط. أما المدخل التناظري (الذي يبدأ بـ <span class="ltr">PIW</span>) فيعطيه <b>رقماً</b> يتغير بتغيّر الجهد أو الحرارة؛ ولهذا يحتاج الثرموكبل والمقاومة المتغيرة إلى موديول دخل تناظري.</p>`,title:'رقمي أم تناظري؟'},
    {add:String.raw`<p>الحرف <span class="ltr">P</span> في <span class="ltr">PIW</span> يعني أن القيمة تُقرأ من الموديول مباشرة <span class="ltr">(Peripheral)</span>، و<span class="ltr">IW</span> تعني «كلمة دخل» <span class="ltr">(Input Word)</span>: مكان يتسع لرقم كامل، لا لبت واحد مثل <span class="ltr">I0.1</span>.</p>`,title:'ماذا تعني PIW؟'},
    {title:'مختبر مصغّر: رقمي أم تناظري أم مخرج؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل عنصر في الشكل <span class="ltr">(1-5)</span> بحسب ما يدخل إلى الـ <span class="ltr">PLC</span> أو يخرج منه.',cats:['مدخل رقمي','مدخل تناظري','مخرج'],items:[
     ['الضاغط <span class="ltr">S1</span> «Heat enable»',0,'على <span class="ltr">I0.1</span>: مضغوط <span class="ltr">1</span> أو غير مضغوط <span class="ltr">0</span>.'],
     ['الثرموكبل <span class="ltr">K-Type</span>',1,'على <span class="ltr">PIW290</span>: يعطي رقماً يتغير مع الحرارة.'],
     ['منزلق المقاومة المتغيرة <span class="ltr">R</span>',1,'على <span class="ltr">PIW288</span>: جهد بين <span class="ltr">0 VDC</span> و <span class="ltr">10 VDC</span> يُقرأ رقماً.'],
     ['متمم السخان <span class="ltr">K1</span>',2,'على <span class="ltr">Q4.0</span>: البرنامج يشغّله أو يوقفه.'],
     ['الضاغط <span class="ltr">S0</span> «Stop Heating»',0,'على <span class="ltr">I0.0</span>.'],
     ['المصباح <span class="ltr">H1</span>',2,'على <span class="ltr">Q4.1</span>.']]})}
   ]},

  {st:2,short:'جدول قائمة التشغيل',title:'جدول قائمة التشغيل',ref:'ص 101',
   q:'جدول العناوين هو «العقد» بين الأسلاك والبرنامج… فماذا يحدث إذا اختلف عن الرسم؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة قائمة التشغيل: كل نقطة دخل أو خرج وعنوانها في الـ PLC كما طبعت في الجدول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="46" y="30" width="268" height="268" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/><text x="180" y="56" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">قائمة التشغيل</text><text x="244" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">النقطة</text><text x="128" y="82" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الترميز في الـ PLC</text><line x1="62" y1="90" x2="298" y2="90" stroke="#2C4A40" stroke-width="2"/><g data-tip="المقاومة المتغيرة ⟦R⟧: خرجها من ⟦0⟧ حتى ⟦10⟧ فولت ⟦DC⟧ لإدخال الحرارة المطلوبة، وقراءتها داخل الـ ⟦PLC⟧ رقم صحيح بين ⟦0⟧ و⟦27648⟧."><rect x="62" y="92" width="236" height="32" fill="transparent"/><circle cx="290" cy="108" r="5" fill="#4FB3A9"/><text x="244" y="113" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="128" y="113" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PIW288</text></g><g data-tip="الثرموكبل نوع ⟦K⟧: حساس الحرارة بدقة ⟦0.1⟧ درجة مئوية، على موديول الدخل التناظري."><rect x="62" y="124" width="236" height="32" fill="transparent"/><circle cx="290" cy="140" r="5" fill="#4FB3A9"/><text x="244" y="145" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Thermocouple</text><text x="128" y="145" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PIW290</text></g><g data-tip="الجدول يطبع ⟦S1 = I0.0⟧، بينما الشكل ⟦(1-5)⟧ وبرنامج ⟦LAD⟧ يضعان ⟦S1⟧ على ⟦I0.1⟧. نتبع الشكل والبرنامج."><rect x="62" y="156" width="236" height="32" fill="#F7DCC8"/><circle cx="290" cy="172" r="5" fill="#12855A"/><text x="244" y="177" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1</text><text x="128" y="177" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><path d="M72 182 L80 166 L88 182 Z" fill="#E8735A"/><text x="80" y="181" text-anchor="middle" font-size="10" fill="#FBF6EE" font-weight="700">!</text></g><g data-tip="الجدول يطبع ⟦S0 = I0.1⟧، بينما الشكل ⟦(1-5)⟧ وبرنامج ⟦LAD⟧ يضعان ⟦S0⟧ على ⟦I0.0⟧. نتبع الشكل والبرنامج."><rect x="62" y="188" width="236" height="32" fill="#F7DCC8"/><circle cx="290" cy="204" r="5" fill="#12855A"/><text x="244" y="209" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S0</text><text x="128" y="209" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><path d="M72 214 L80 198 L88 214 Z" fill="#E8735A"/><text x="80" y="213" text-anchor="middle" font-size="10" fill="#FBF6EE" font-weight="700">!</text></g><g data-tip="⟦K1⟧: متمم تشغيل السخان."><rect x="62" y="220" width="236" height="32" fill="transparent"/><circle cx="290" cy="236" r="5" fill="#E8735A"/><text x="244" y="241" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">K1</text><text x="128" y="241" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.0</text></g><g data-tip="⟦H1⟧: مصباح بيان عمل السخان."><rect x="62" y="252" width="236" height="32" fill="transparent"/><circle cx="290" cy="268" r="5" fill="#E8735A"/><text x="244" y="273" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">H1</text><text x="128" y="273" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text></g></svg>`,
   cap:'العناوين كما طُبعت في الجدول. النقطة الفيروزية = مدخل تناظري، والخضراء = مدخل رقمي، والبرتقالية = مخرج. السطران المظللان فيهما تناقض مع الشكل.<br><b>مرّر المؤشر على أي سطر (أو المسه في الجوال) لتعرف وصفه.</b>',
   side:[
    {predict:{q:'حسب الجدول، ما أكبر رقم يقرؤه الـ PLC من المقاومة المتغيرة R؟',opts:[
     [String.raw`<span class="ltr">10</span>`,false,'10 هو أقصى جهد بالفولت، لكن الـ PLC لا يقرأ فولتات بل رقماً صحيحاً.'],
     [String.raw`<span class="ltr">32767</span>`,false,'هذا أكبر رقم في جدول الثرموكبل (Overflow)، وليس مدى المقاومة.'],
     [String.raw`<span class="ltr">27648</span>`,true,'«تكون القراءة داخل PLC برقم صحيح يتراوح بين 0 و 27648» (ص 101).']]}}
   ],
   body:[
    {book:String.raw`<p>والجدول التالي يوضح قائمة التشغيل حسب الشكل <span class="ltr">(1-5)</span> وهي على النحو التالي:</p>`+IO5_BOOK,ref:'ص 101'},
    {watch:ERR_ADDR,fix:true},
    {tip:String.raw`<p>المدخلان التناظريان لا يعطيان الحرارة بالدرجات مباشرة: المقاومة تعطي رقماً من <span class="ltr">0</span> إلى <span class="ltr">27648</span> (حسب الجهد من <span class="ltr">0</span> إلى <span class="ltr">10</span> فولت)، والثرموكبل يعطي رقماً سنعرف قاعدته في المحطة الرابعة. تحويل هذه الأرقام إلى درجات هو أول ما يفعله البرنامج (الدرس 5.3).</p>`,title:'أرقام لا درجات'},
    {title:'مختبر مصغّر: ماذا لو وصّلت حسب الجدول؟',widget:(el,B)=>DCML.lab(el,B,{intro:'الغرفة باردة (الحرارة الفعلية أقل من 80٪ من المطلوبة). اختر طريقة التوصيل ثم الضاغط، وراقب السخان. البرنامج نفسه في الحالتين: <span class="ltr">Network 6</span> تقرأ التشغيل من <span class="ltr">I0.1</span>، و <span class="ltr">Network 7</span> تقرأ الإيقاف من <span class="ltr">I0.0</span>.',
      predict:{q:String.raw`وصّلت الضاغطين حسب الجدول (<span class="ltr">S1 ← I0.0</span>) والسخان متوقف، ثم ضغطت <span class="ltr">S1</span>. ماذا يحدث؟`,opts:[
       [String.raw`يعمل السخان كالعادة`,false,String.raw`البرنامج لا يعرف أسماء الضواغط؛ يعرف العناوين فقط.`],
       [String.raw`لا يعمل السخان، لأن <span class="ltr">S1</span> صار على مدخل الإيقاف <span class="ltr">I0.0</span>`,true,String.raw`<span class="ltr">I0.0</span> في البرنامج هو «stop». فضغط <span class="ltr">S1</span> يُلغي التسخين بدل أن يبدأه.`],
       [String.raw`يتوقف الـ <span class="ltr">PLC</span> عن العمل`,false,String.raw`الـ <span class="ltr">PLC</span> يستمر في المسح؛ المشكلة في معنى المدخل لا في الجهاز.`]]},
      ins:[{k:'w',l:'طريقة التوصيل:',seg:[['fig','حسب الشكل والبرنامج'],['tab','حسب الجدول (ص 101)']],v:'fig'},
       {k:'h',l:'السخان قبل الضغط:',seg:[[0,'متوقف'],[1,'يعمل']],v:0},
       {k:'b',l:'الضاغط الذي تضغطه:',seg:[['S1','S1 (تشغيل)'],['S0','S0 (إيقاف)']],v:'S1'}],
      calc:s=>{const a=s.w==='fig'?(s.b==='S1'?'I0.1':'I0.0'):(s.b==='S1'?'I0.0':'I0.1'),start=a==='I0.1',after=start?1:0,want=s.b==='S1'?1:0,bad=after!==want;
       return {facts:[['المدخل الذي وصله 1',a],['معناه في البرنامج','<bdi dir="rtl">'+(start?'تشغيل <bdi dir="ltr">(Network 6)</bdi>':'إيقاف <bdi dir="ltr">(Network 7)</bdi>')+'</bdi>',bad?'bad':''],['السخان K1 بعد الضغط',after?'يعمل':'متوقف',after?'hi':'']],
        msg:(bad?'<b>عكس المطلوب!</b> ':'')+`ضغطت <span class="ltr">${s.b}</span> فوصل <span class="ltr">1</span> إلى <span class="ltr">${a}</span>، وهو في البرنامج مدخل ${start?'التشغيل: والحرارة تحت 80٪ فيُثبَّت السخان':'الإيقاف: فيُلغى السخان'}.`+(s.w==='tab'?' لهذا نتبع في الأسلاك الشكل <span class="ltr">(1-5)</span> والبرنامج.':''),cls:bad?'bad':''}}})}
   ]},

  {st:3,short:'تهيئة الموديول',title:'تهيئة وحدة المدخل التناظري: الشكل <span class="ltr">(2-5)</span>',ref:'ص 101–102',
   q:'الموديول نفسه يقبل أنواعاً كثيرة من الحساسات… فكيف «يعرف» أن الموصول عليه ثرموكبل من النوع K؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رف الـ PLC وفيه موديول AI8xTC في المكان 4، ونافذة خصائصه بتبويباتها وإعداد نوع القياس ومداه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="30" y="38" width="300" height="80" rx="8" fill="#2C4A40"/><g data-tip="المكان 1: مصدر القدرة ⟦PS 307⟧."><rect x="38" y="52" width="44" height="58" rx="4" fill="#CFC6B4"/><text x="60" y="86" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PS</text></g><g data-tip="المكان 2: وحدة المعالجة ⟦CPU314C-2 DP⟧."><rect x="88" y="52" width="80" height="58" rx="4" fill="#4FB3A9"/><text x="128" y="86" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">CPU</text></g><g data-tip="المكان 3: فارغ في الشكل ⟦(2-5)⟧."><rect x="174" y="52" width="36" height="58" rx="4" fill="none" stroke="#CFC6B4" stroke-width="1.5" stroke-dasharray="4 4"/></g><g data-tip="المكان 4: موديول الدخل التناظري للثرموكبل ⟦AI8xTC⟧. نضغط عليه مرتين لفتح نافذة خصائصه ⟦Properties⟧."><rect x="216" y="52" width="56" height="58" rx="4" fill="#F2C14E" stroke="#E8735A" stroke-width="3"/><text x="244" y="86" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AI8xTC</text></g><g font-size="10" fill="#FBF6EE" font-family="var(--mono)" text-anchor="middle"><text x="60" y="48">1</text><text x="128" y="48">2</text><text x="192" y="48">3</text><text x="244" y="48">4</text></g><path d="M244 118 V140" stroke="#2C4A40" stroke-width="2.5"/><polygon points="244,148 237,136 251,136" fill="#2C4A40"/><rect x="30" y="150" width="300" height="140" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M30 158 a8 8 0 0 1 8 -8 h284 a8 8 0 0 1 8 8 v16 h-300z" fill="#2C4A40"/><text x="44" y="167" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Properties</text><g data-tip="⟦General⟧: بيانات التوصيف العامة، وإمكانية كتابة أي تعليق."><rect x="42" y="182" width="78" height="24" rx="4" fill="#F1EBDD" stroke="#2C4A40" stroke-width="1.5"/><text x="81" y="198" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">General</text></g><g data-tip="⟦Address⟧: عناوين قنوات التوصيل ⟦Channels⟧ بدايتها ونهايتها، ويمكن تغييرها."><rect x="126" y="182" width="78" height="24" rx="4" fill="#F1EBDD" stroke="#2C4A40" stroke-width="1.5"/><text x="165" y="198" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Address</text></g><g data-tip="⟦Inputs⟧: بيانات التهيئة المختلفة للموديول، ومنها نوع القياس ومداه."><rect x="210" y="182" width="78" height="24" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="249" y="198" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Inputs</text></g><g data-tip="الإعداد المطلوب في الشكل ⟦(2-5)⟧: ⟦Measuring Type = TC-IL⟧ و⟦Measuring Range = Type K⟧، والنص الأحمر في الشكل: ⟦Adjust type to Type K⟧."><rect x="40" y="214" width="280" height="68" fill="transparent"/><g font-size="11.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr"><text x="48" y="236">Measuring Type</text><text x="48" y="262">Measuring Range</text><text x="186" y="236" font-weight="700">TC-IL</text><text x="186" y="262" font-weight="700">Type K</text></g><rect x="179" y="246" width="60" height="24" rx="4" fill="none" stroke="#E8735A" stroke-width="2.5"/></g></svg>`,
   cap:'رسم مبسّط للشكل <span class="ltr">(2-5)</span>: الموديول في المكان <span class="ltr">4</span> من الرف، ونافذة خصائصه بتبويباتها.<br><b>مرّر المؤشر على الأماكن والتبويبات وسطري القياس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>توصل وحدة الدخل التناظري بحساس درجة الحرارة الثيرموكبل <span class="ltr">Thermocouple K-type</span> وتتم تهيئته كما هو موضح بالشكل <span class="ltr">(2-5)</span>.</p>
     <p>يتم إدراج موديول <span class="ltr">AI 8x12 bit</span> في مكونات النظام ثم نضغط على العنصر مرتين لفتح خصائصه وسوف تظهر لنا نافذة <span class="ltr">Properties AI 8x12 bits</span> وبها ثلاث نوافذ فرعية هي <span class="ltr">General</span>، <span class="ltr">Address</span>، <span class="ltr">Inputs</span>.</p>`,ref:'ص 101'}
   ],
   body:[
    {book:String.raw`<p>النافذة <span class="ltr">General</span> تحتوي على بيانات التوصيف العامة وكذلك إمكانية كتابة أي تعليق.</p><p>أما الجزء <span class="ltr">Address</span> فيشمل عناوين التعامل لقنوات التوصيل <span class="ltr">Channels</span> بدايتها ونهايتها ويمكن تغييرها.</p><p>والجزء الثالث <span class="ltr">Input</span> وهو الذي يشمل بيانات التهيئة المختلفة للموديول كالصورة الموضحة.</p>`,ref:'ص 101–102'},
    {html:String.raw`<figure class="fig">${HWCFG}<figcaption><b>الشكل (2-5)</b> تهيئة الموديول <span class="ltr">AI8xTC</span> في برنامج <span class="ltr">SIMATIC</span> (معاد رسمها؛ الإطار الأحمر حول المجموعة <span class="ltr">0-1</span>) <span class="ref">ص 102</span></figcaption></figure>`},
    {predict:{q:'إلى أي إعداد ينبّه الإطار الأحمر في الشكل (2-5)؟',opts:[
     [String.raw`نوع الثرموكبل: <span class="ltr">Measuring Range = Type K</span>`,true,String.raw`النص الأحمر في الشكل: <span class="ltr">Adjust type to Type K</span>، لأن الحساس الموصول من النوع K.`],
     [String.raw`تفعيل المقاطعة <span class="ltr">Diagnostic Interrupt</span>`,false,'هذه الخيارات غير مفعّلة في الشكل، والإطار الأحمر ليس حولها.'],
     [String.raw`تغيير العنوان إلى <span class="ltr">PIW288</span>`,false,String.raw`العنوان يُضبط في <span class="ltr">Address</span>، و<span class="ltr">PIW288</span> للمقاومة R لا للثرموكبل.`]]}},
    {tip:String.raw`<p>في تبويب <span class="ltr">Address</span> نتأكد أن عنوان قناة الثرموكبل هو <span class="ltr">PIW290</span> كما في الشكل <span class="ltr">(1-5)</span>؛ لأن البرنامج سيقرأ الحرارة من هذا العنوان. وفي تبويب الإدخال نختار نوع القياس <span class="ltr">TC-IL</span> والمدى <span class="ltr">Type K</span>.</p>`,title:'ماذا نضبط فعلاً؟'},
    {add:String.raw`<p>لكل نوع من الثرموكبل (<span class="ltr">K</span>، <span class="ltr">J</span>، <span class="ltr">N</span>…) معدنان مختلفان، فيعطي كل نوع جهداً مختلفاً عند الحرارة نفسها. لو اخترنا نوعاً غير الموصول لحوّل الموديول الجهد إلى حرارة بجدول خاطئ، فتظهر قراءة خاطئة مع أن الأسلاك سليمة.</p>`,title:'لماذا يهم نوع الثرموكبل؟'},
    {watch:String.raw`<p>النص يقول الموديول «<span class="ltr">AI 8x12 bit</span>» بينما اللقطة في الشكل <span class="ltr">(2-5)</span> تُظهر «<span class="ltr">AI8xTC</span>» (موديول ثرموكبل). والنص يسمي النوافذ <span class="ltr">General</span> و<span class="ltr">Address</span> و<span class="ltr">Inputs</span>، واللقطة فيها <span class="ltr">General</span> و<span class="ltr">Addresses</span> و<span class="ltr">Inputs - Part 1</span> و<span class="ltr">Inputs - Part 2</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: ماذا لو أخطأت في التهيئة؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'اخترت في التهيئة ثرموكبل من النوع <span class="ltr">J</span>، والموصول فعلاً من النوع <span class="ltr">K</span>. الأسلاك سليمة. ماذا تتوقع؟',opts:[
      ['قراءة صحيحة، لأن الأسلاك سليمة',false,'سلامة الأسلاك لا تكفي؛ الموديول يحوّل الجهد إلى حرارة بحسب النوع المختار.'],
      ['قراءة حرارة خاطئة مع أن الأسلاك سليمة',true,'لكل نوع جهد مختلف عند الحرارة نفسها، فيحوّل الموديول بجدول نوع غير الموصول.'],
      ['تتوقف قراءة المقاومة <span class="ltr">R</span> فقط',false,'المقاومة <span class="ltr">R</span> على عنوان آخر <span class="ltr">PIW288</span>، والخطأ هنا في قناة الثرموكبل.']]},
     {q:'في تبويب <span class="ltr">Addresses</span> غيّرت عنوان قناة الثرموكبل، والبرنامج ما زال يقرأ <span class="ltr">PIW290</span>. ماذا يحدث؟',opts:[
      ['البرنامج لا يقرأ حرارة الثرموكبل، لأنه يقرأ عنواناً لم يعد للثرموكبل',true,'البرنامج يقرأ من العنوان المكتوب فيه؛ لذلك نتأكد أن عنوان القناة <span class="ltr">PIW290</span> كما في الشكل <span class="ltr">(1-5)</span>.'],
      ['البرنامج يتبع العنوان الجديد تلقائياً',false,'العنوان مكتوب داخل البرنامج نفسه، ولا يتغير وحده.'],
      ['لا شيء؛ العنوان لا يهم',false,'العنوان هو «العقد» بين الموديول والبرنامج.']]},
     {q:'في الشكل <span class="ltr">(2-5)</span> خانات <span class="ltr">Diagnostic Interrupt</span> وما بعدها غير مفعّلة. هل يمنع ذلك قراءة الحرارة؟',opts:[
      ['نعم، يجب تفعيلها كلها',false,'الكتاب تركها غير مفعّلة في الشكل، والإعداد الذي ينبّه إليه هو نوع الثرموكبل.'],
      ['لا؛ الإعداد الذي ينبّه إليه الإطار الأحمر هو نوع الثرموكبل <span class="ltr">Type K</span>',true,'نوع القياس والمدى هما ما يحدد كيف يقرأ الموديول الحرارة.']]}]})}
   ]},

  {st:4,short:'قراءة الثرموكبل',title:'قراءة الثرموكبل داخل الـ PLC',ref:'ص 102',
   q:'الحرارة فيها كسور مثل 1372.0… والمدخل يقرأ أعداداً صحيحة فقط. كيف تُحفظ الخانة العشرية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الحرارة 1372.0 درجة تقرأ 13720 داخل الـ PLC، وتحتها مناطق القراءة: Overflow و Overrange و Rated range و Underflow" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="حرارة الثرموكبل بالدرجات المئوية؛ ⟦1372.0 °C⟧ أعلى حد في المدى المقنن ⟦(Rated range)⟧ في جدول الكتاب."><rect x="222" y="40" width="112" height="64" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="278" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الحرارة</text><text x="278" y="90" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1372.0 °C</text></g><g data-tip="القاعدة (ص 102): القراءة داخل الـ ⟦PLC⟧ = الحرارة ⟦× 10⟧؛ فالخانة العشرية تصبح جزءاً من العدد الصحيح."><rect x="146" y="50" width="72" height="44" fill="transparent"/><line x1="220" y1="78" x2="160" y2="78" stroke="#E8735A" stroke-width="4"/><polygon points="148,78 162,70 162,86" fill="#E8735A"/><text x="186" y="66" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">× 10</text></g><g data-tip="ما يقرؤه البرنامج من العنوان ⟦PIW290⟧: عدد صحيح ⟦Integer⟧."><rect x="30" y="40" width="112" height="64" rx="10" fill="#2C4A40"/><text x="86" y="62" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PIW290</text><text x="86" y="90" text-anchor="middle" font-size="17" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">13720</text></g><text x="180" y="132" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Type K in °C</text><g data-tip="⟦Overflow⟧: فوق ⟦1622.0 °C⟧ تكون القراءة ⟦32767⟧ ⟦(7FFFH)⟧ مهما ارتفعت الحرارة."><rect x="150" y="140" width="60" height="30" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><text x="218" y="160" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Overflow</text></g><g data-tip="⟦Overrange⟧: من ⟦1373.0⟧ إلى ⟦1622.0 °C⟧ فوق المدى المقنن، والقراءة ما زالت الحرارة ⟦× 10⟧ ⟦(13730 : 16220)⟧."><rect x="150" y="170" width="60" height="30" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/><text x="218" y="190" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Overrange</text></g><g data-tip="⟦Rated range⟧ المدى المقنن: من ⟦−270.0⟧ إلى ⟦1372.0 °C⟧، والقراءة = الحرارة ⟦× 10⟧ ⟦(−2700 : 13720)⟧."><rect x="150" y="200" width="60" height="62" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="218" y="236" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Rated range</text></g><g data-tip="⟦Underflow⟧: تحت ⟦−270.0 °C⟧ تكون القراءة أقل من ⟦−2700⟧، ويشير الموديول إلى ⟦Underflow⟧. وعند خطأ في التوصيل أو نوع الحساس يخرج ⟦8000H⟧."><rect x="150" y="262" width="60" height="30" fill="#CFC6B4" stroke="#2C4A40" stroke-width="1.5"/><text x="218" y="282" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Underflow</text></g><g font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr" text-anchor="end"><text x="144" y="174">1622.0</text><text x="144" y="204">1372.0</text><text x="144" y="266">−270.0</text></g></svg>`,
   cap:'مثال من جدول الكتاب: <span class="ltr">1372.0 °C</span> تُقرأ <span class="ltr">13720</span>. والعمود الملوّن مناطق القراءة حسب <span class="ltr">Table 4-26</span>.<br><b>مرّر المؤشر على البطاقات والمناطق الملوّنة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>وباستخدام الثيرموكبل ستكون قراءة الحرارة داخل <span class="ltr">PLC</span> كعدد صحيح <span class="ltr">Integer</span> كما بالجدول.</p><p>وبحسب الجدول فإن القراءة للقيمة الفعلية للحرارة داخل <span class="ltr">PLC</span> = القراءة الفعلية للحرارة <span class="ltr">X 10</span>.</p>`,ref:'ص 102'},
    {predict:{q:String.raw`قراءة <span class="ltr">PIW290</span> تساوي <span class="ltr">13720</span>. كم الحرارة الفعلية؟`,opts:[
     [String.raw`<span class="ltr">137.2 °C</span>`,false,'قسمت على 100؛ القاعدة × 10، فنقسم على 10 فقط.'],
     [String.raw`<span class="ltr">13720 °C</span>`,false,'هذه القراءة نفسها؛ الـ PLC يحفظ الحرارة مضروبة في 10.'],
     [String.raw`<span class="ltr">1372.0 °C</span>`,true,'13720 ÷ 10 = 1372.0، وهو السطر Rated range في الجدول.']]}}
   ],
   body:[
    {book:String.raw`<p class="sub"><span class="ltr">Table 4-26 Analog value representation for thermocouples type K</span></p>`+T426,ref:'ص 102'},
    {tip:String.raw`<p>المدخل التناظري يعطي <b>عدداً صحيحاً</b> فقط (بلا كسور). لكي لا تضيع الخانة العشرية (دقة الثرموكبل <span class="ltr">0.1</span> درجة)، يضرب الموديول الحرارة في <span class="ltr">10</span>: فـ <span class="ltr">1372.0</span> تصبح <span class="ltr">13720</span>، و<span class="ltr">−270.0</span> تصبح <span class="ltr">−2700</span>. وفي البرنامج نقسم على <span class="ltr">10.0</span> لنرجع إلى الدرجات (الدرس 5.3).</p>`,title:'لماذا × 10؟'},
    {tip:String.raw`<p>اقرأ الجدول بالعمود الأول <span class="ltr">Type K in °C</span> ثم العمود <span class="ltr">decimal</span> (القراءة بالنظام العشري)؛ و<span class="ltr">hexa-decimal</span> هو الرقم نفسه مكتوباً بالنظام السداسي عشر. الأعمدة الأخرى للوحدتين <span class="ltr">°F</span> و<span class="ltr">K</span> إذا اخترتهما في التهيئة.</p>`,title:'كيف تقرأ الجدول؟'},
    {predict:{q:String.raw`الحرارة أعلى من <span class="ltr">1622.0 °C</span>. ماذا يقرأ الـ PLC؟`,opts:[
     [String.raw`الحرارة <span class="ltr">× 10</span> كالعادة`,false,'قاعدة × 10 تتوقف بعد 1622.0؛ فوقها منطقة Overflow.'],
     [String.raw`<span class="ltr">32767</span> دائماً <span class="ltr">(7FFFH)</span>`,true,'هذا سطر Overflow في الجدول: الرقم ثابت مهما ارتفعت الحرارة.'],
     [String.raw`<span class="ltr">0</span>`,false,'الصفر قراءة صحيحة لحرارة 0.0°C، وليس علامة تجاوز.']]}},
    {watch:String.raw`<p>القراءة <span class="ltr">32767</span> لا تعني أن الحرارة = <span class="ltr">32767 ÷ 10</span>؛ هي «علامة» أن الحرارة تجاوزت المدى (<span class="ltr">Overflow</span>). وكذلك <span class="ltr">8000H</span> في ذيل الجدول علامة خطأ (توصيل معكوس، أو مدخل مفتوح، أو نوع ثرموكبل خاطئ)، وليست حرارة.</p>`},
    {title:'مختبر مصغّر: من الحرارة إلى قراءة الـ PLC',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك حرارة الثرموكبل واقرأ ما يصل إلى الـ <span class="ltr">PLC</span> بحسب الجدول <span class="ltr">Table 4-26</span> (عمود <span class="ltr">Type K in °C</span>).',
      predict:{q:String.raw`الحرارة <span class="ltr">25.5 °C</span>. ماذا يقرأ الـ <span class="ltr">PLC</span>؟`,opts:[
       [String.raw`<span class="ltr">25</span>`,false,String.raw`لو قرأ <span class="ltr">25</span> لضاع نصف الدرجة؛ الموديول لا يحذف الكسر بل يضرب في <span class="ltr">10</span>.`],
       [String.raw`<span class="ltr">2550</span>`,false,String.raw`هذا ضرب في <span class="ltr">100</span>؛ القاعدة في الكتاب ضرب في <span class="ltr">10</span>.`],
       [String.raw`<span class="ltr">255</span>`,true,String.raw`القراءة داخل الـ <span class="ltr">PLC</span> = الحرارة × <span class="ltr">10</span>، فـ <span class="ltr">25.5</span> تصبح <span class="ltr">255</span>.`]]},
      ins:[{k:'t',l:'حرارة طرف الثرموكبل',min:-300,max:1700,step:0.5,v:25.5,u:'°C',dp:1}],
      calc:s=>{const r=tcReading(s.t),bad=r.r!=='Rated range';
       const ar={'Rated range':'المدى المقنن','Overrange':'فوق المدى المقنن','Overflow':'تجاوز (Overflow)','Underflow':'تحت المدى (Underflow)'}[r.r];
       return {facts:[['القراءة decimal',String(r.v),bad?'bad':'hi'],['hexa-decimal',hex(r.v)],['Range',r.r,bad?'bad':'']],
        msg:r.r==='Rated range'?`المدى المقنن (من <span class="ltr">−270.0</span> إلى <span class="ltr">1372.0 °C</span>): القراءة = الحرارة × <span class="ltr">10</span>. وفي البرنامج نقسم على <span class="ltr">10.0</span> فنرجع إلى الدرجات.`
         :r.r==='Overrange'?`${ar}: القراءة ما زالت الحرارة × <span class="ltr">10</span>، لكنها خارج المدى المقنن للثرموكبل.`
         :r.r==='Overflow'?`فوق <span class="ltr">1622.0 °C</span> تبقى القراءة <span class="ltr">32767 (7FFFH)</span> مهما ارتفعت الحرارة: هي «علامة» تجاوز وليست حرارة.`
         :`تحت <span class="ltr">−270.0 °C</span>: علامة خطأ وليست حرارة. ويخرج الموديول <span class="ltr">8000H</span> أيضاً عند التوصيل المعكوس أو المدخل المفتوح أو نوع الثرموكبل الخاطئ.`,cls:bad?'warn':''}}})}
   ]},

  {recap:[
   String.raw`الشكل (1-5): <span class="ltr">S1 = I0.1</span> و<span class="ltr">S0 = I0.0</span> (الجدول يعكسهما)، الثرموكبل على <span class="ltr">PIW290</span>، والمقاومة <span class="ltr">R</span> على <span class="ltr">PIW288</span>، و<span class="ltr">K1 = Q4.0</span> و<span class="ltr">H1 = Q4.1</span> (ص 100–101).`,
   String.raw`دائرة القدرة: مصهرات ثم نقاط <span class="ltr">K1</span> ثم ثلاث مقاومات تسخين نجمة (ص 100).`,
   String.raw`قراءة المقاومة <span class="ltr">R</span> داخل الـ PLC رقم صحيح من <span class="ltr">0</span> إلى <span class="ltr">27648</span> (الجهد من 0 إلى 10 فولت) (ص 101).`,
   String.raw`تهيئة الموديول (الشكل (2-5)): <span class="ltr">Measuring Type = TC-IL</span> و<span class="ltr">Measuring Range = Type K</span> (ص 102).`,
   String.raw`قراءة الثرموكبل = الحرارة <span class="ltr">× 10</span> في المدى المقنن، وفوق <span class="ltr">1622.0 °C</span> تثبت على <span class="ltr">32767</span> (ص 102).`]}
],
 theory:[
  {h:'التحكم في درجة حرارة غرفة باستخدام حاكم ذي موضعين',ref:'ص 100',html:'<p>«والشكل التالي يبين مخطط توصيل وحدة (PLC) للتحكم في درجة حرارة الغرفة:»</p><ul><li>المداخل: <b>I0.1</b> ← الضاغط <b>S1</b> «Heat enable»، و <b>I0.0</b> ← الضاغط <b>S0</b> «Stop Heating».</li><li>المداخل التناظرية: <b>PIW290</b> ← الثرموكبل <b>K-Type</b>، و <b>PIW288</b> ← منزلق المقاومة المتغيرة <b>R</b> بين <span class="ltr">10 VDC</span> و <span class="ltr">0 VDC</span>.</li><li>المخارج: <b>Q4.0</b> ← متمم السخان <b>K1</b>، و <b>Q4.1</b> ← المصباح <b>H1</b>.</li><li>دائرة القدرة: L1 و L2 و L3 ← مصهرات ← نقاط K1 الرئيسة ← ثلاث مقاومات تسخين موصولة نجمة، ونقطة النجمة <b>E</b>.</li></ul>'},
  {fig:'(1-5)',ref:'ص 100',caption:'مخطط توصيل وحدة PLC ودائرة القدرة للسخان (القيم المكتوبة مثال: R على 5 v والغرفة 25°C)',draw:()=>`<div class="svgbox">${fig15({})}</div>`},
  {h:'جدول قائمة التشغيل',ref:'ص 101',html:'<p>«والجدول التالي يوضح قائمة التشغيل حسب الشكل (1-5)»، كما هو مطبوع:</p>'},
  {fig:'',ref:'ص 101',caption:'قائمة التشغيل',draw:()=>IO5_BOOK},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+ERR_ADDR+'</div>'},
  {h:'تهيئة وحدة المدخل التناظري',ref:'ص 101–102',html:`<p>«توصل وحدة الدخل التناظري بحساس درجة الحرارة الثيرموكبل <span class="ltr">Thermocouple K-type</span> وتتم تهيئته كما هو موضح بالشكل (2-5). يتم إدراج موديول <span class="ltr">AI 8x12 bit</span> في مكونات النظام ثم نضغط على العنصر مرتين لفتح خصائصه وسوف تظهر لنا نافذة <span class="ltr">Properties</span> وبها ثلاث نوافذ فرعية هي <span class="ltr">General</span> و <span class="ltr">Address</span> و <span class="ltr">Inputs</span>.»</p>
   <ul><li><b>General:</b> بيانات التوصيف العامة وإمكانية كتابة تعليق.</li><li><b>Address:</b> عناوين قنوات التوصيل (Channels) بدايتها ونهايتها ويمكن تغييرها — نستخدم العنوان <b>PIW290</b>.</li><li><b>Input:</b> بيانات التهيئة المختلفة للموديول: <span class="ltr">Measuring Type = TC-IL</span> و <span class="ltr">Measuring Range = Type K</span>.</li></ul>`},
  {fig:'(2-5)',ref:'ص 102',caption:'تهيئة الموديول AI8xTC في برنامج SIMATIC (معاد رسمها؛ الإطار الأحمر حول المجموعة 0-1)',draw:()=>HWCFG},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'النص يقول الموديول «AI 8x12 bit» بينما اللقطة في الشكل (2-5) تُظهر «AI8xTC» (موديول ثرموكبل). والنص يسمي النوافذ General و Address و Inputs، واللقطة فيها General و Addresses و Inputs - Part 1 و Inputs - Part 2.'+'</div>'},
  {h:'قراءة الثرموكبل داخل الـ PLC',ref:'ص 102',html:'<p>«وباستخدام الثيرموكبل ستكون قراءة الحرارة داخل PLC كعدد صحيح Integer كما بالجدول» — Table 4-26 من كتالوج سيمنز:</p>'},
  {fig:'',ref:'ص 102',caption:'Table 4-26 Analog value representation for thermocouples type K',draw:()=>T426},
  {html:'<p>«وبحسب الجدول فإن القراءة للقيمة الفعلية للحرارة داخل PLC = القراءة الفعلية للحرارة × 10». أي أن <span class="ltr">25.0°C</span> تُقرأ <b>250</b>. أما المقاومة R فقراءتها من 0 (عند 0 v) إلى <b>27648</b> (عند 10 v).</p>'}
 ],
 lab:(el)=>{
  const st={V:5,T:25,typ:'TC-IL',rng:'Type K'};
  el.innerHTML=`<div class="grid"><div class="panel c7"><h2>الشكل (1-5) تفاعلياً <small>ص 100</small></h2>
   <label class="toggle">جهد المقاومة R <input type="range" id="v" min="0" max="10" step="0.1" value="5" style="width:200px;height:auto"> <b class="ltr" id="vv"></b></label>
   <label class="toggle">حرارة الثرموكبل <input type="range" id="t" min="-300" max="1700" step="1" value="25" style="width:200px;height:auto"> <b class="ltr" id="tv"></b></label>
   <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">${[25,100,1372,1500,1650,-280].map(v=>`<button class="btn" data-t="${v}">${v} °C</button>`).join('')}</div>
   <div class="svgbox" id="fig"></div></div>
   <div class="panel c5"><h2>تهيئة الموديول <small>الشكل (2-5)</small></h2>
   <div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;margin-top:8px;direction:ltr"><span class="mono">Measuring Type</span><select id="typ">${['TC-IL','TC-EL','TC-L00C','RTD-4L','+/- 80 mV'].map(x=>`<option>${x}</option>`).join('')}</select><span class="mono">Measuring Range</span><select id="rng">${['Type K','Type J','Type N','Type E'].map(x=>`<option>${x}</option>`).join('')}</select></div>
   <div id="rd"></div><h2 style="margin-top:14px">التجربة خطوة بخطوة</h2><ol class="steps" id="stp"></ol></div></div>`;
  const $=s=>el.querySelector(s);const seen={};
  $('#v').oninput=e=>st.V=+e.target.value;$('#t').oninput=e=>st.T=+e.target.value;
  el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{st.T=+b.dataset.t;$('#t').value=st.T});
  $('#typ').onchange=e=>st.typ=e.target.value;$('#rng').onchange=e=>st.rng=e.target.value;
  const ok=()=>st.typ==='TC-IL'&&st.rng==='Type K';
  const chk=checklist($('#stp'),[
   {t:'قراءة المقاومة R',x:'اضبط جهد R على 5.0 v. القراءة PIW288 = 13824 (نصف 27648).',done:()=>Math.abs(st.V-5)<0.05&&ok()},
   {t:'أقصى قراءة',x:'ارفع R إلى 10.0 v: القراءة 27648. هذا الرقم سنقسم عليه في البرنامج.',done:()=>st.V>=9.95},
   {t:'قراءة الثرموكبل',x:'اضبط الحرارة على 100°C: PIW290 = 1000 (الحرارة × 10).',done:()=>st.T===100&&ok()},
   {t:'حدود النطاق',x:'جرّب 1500°C (Overrange، ما زالت × 10) ثم 1650°C (Overflow: 32767 = 7FFFH).',done:()=>{if(st.T>1372&&st.T<=1622)seen.o=1;return seen.o&&st.T>1622}},
   {t:'تحت النطاق',x:'جرّب −280°C: Underflow، والموديول يخرج 8000H حسب ذيل الجدول.',done:()=>st.T<-270},
   {t:'تهيئة خاطئة',x:'غيّر Measuring Range إلى Type J. الكتاب ينبه «Adjust type to Type K»: نوع ثرموكبل خاطئ يعطي قراءة خاطئة. ثم أعده إلى Type K.',done:()=>{if(!ok())seen.w=1;return seen.w&&ok()}}]);
  /* أعطال مخفية: منزلق المقاومة مقطوع، أو مصدر 10 V للمقاومة ضعيف (8 V)، أو سلك الثرموكبل مقطوع، أو قطبية الثرموكبل معكوسة (الوصلة الباردة 25°C) */
  const Vin=()=>chF('wiper')?0:chF('ref8')?st.V*0.8:st.V,tcR=()=>chF('tcOpen')?{v:32767,r:'Overflow'}:tcReading(chF('tcRev')?50-st.T:st.T);
  runLoop(el,()=>{const c=chain(Vin(),st.T),R=tcR();$('#vv').textContent=st.V.toFixed(1)+' v';$('#tv').textContent=st.T+' °C';
   $('#fig').innerHTML=fig15({V:Vin(),T:clamp(st.T,-999,9999)}).replace('= '+c.piw290,'= '+(ok()?R.v:'?'));
   $('#rd').innerHTML=`<div class="facts"><div class="fact"><span>PIW288 (R)</span><b>${c.piw288}</b></div><div class="fact"><span>PIW290 (decimal)</span><b>${ok()?R.v:'—'}</b></div><div class="fact"><span>hexa-decimal</span><b>${ok()?hex(R.v):'—'}</b></div><div class="fact"><span>Range</span><b>${ok()?R.r:'—'}</b></div></div>`+
    (ok()?(R.r==='Rated range'?`<p class="sub">الحرارة الفعلية داخل الـ PLC = ${R.v} ÷ 10 = <b class="ltr">${(R.v/10).toFixed(1)} °C</b></p>`:`<div class="callout err">${R.r==='Underflow'?'تحت النطاق: الموديول يشير إلى Underflow ويخرج 8000H (= −32768).':R.r==='Overflow'?'فوق النطاق تماماً: القراءة 32767 (7FFFH) مهما ارتفعت الحرارة.':'Overrange: فوق النطاق المقنن (حتى 1622°C) والقراءة ما زالت × 10.'}</div>`):`<div class="callout err"><b class="ltr">Adjust type to Type K</b> — التهيئة لا تطابق الحساس المركب (الكتاب: TC-IL و Type K)، فالقراءة غير صحيحة.</div>`);chk()});
 },
 quiz:[
  {q:'على أي عنوان يُقرأ الثرموكبل في الشكل (1-5)؟',o:['PIW288','PIW290','I0.1','Q4.0'],c:1,e:'الثرموكبل K-Type على PIW290، والمقاومة R على PIW288.'},
  {q:'ما مدى قراءة المقاومة R داخل الـ PLC؟',o:['0 – 100','0 – 1000','0 – 27648','0 – 32767'],c:2,e:'«تكون القراءة داخل PLC برقم صحيح يتراوح بين 0 و 27648» (ص 101).'},
  {q:'الحرارة الفعلية 25.0°C. ما قراءة PIW290؟',o:['25','250','2500','27648'],c:1,e:'القراءة = الحرارة × 10 (ص 102).'},
  {q:'ما المخرج الذي يشغل متمم السخان K1؟',o:['Q4.0','Q4.1','I0.0','PIW288'],c:0,e:'Q4.0 ← Heater K1، و Q4.1 ← المصباح H1.'},
  {q:'كيف وُصّلت مقاومات التسخين في دائرة القدرة؟',o:['دلتا','نجمة ونقطتها E','على التوالي مع المحرك','لا توجد مقاومات'],c:1,e:'ثلاث مقاومات تسخين موصولة نجمة ونقطة النجمة معلّمة E.'},
  {q:'ما التهيئة المطلوبة للموديول في الشكل (2-5)؟',o:['Measuring Type = TC-IL و Range = Type K','RTD و Type J','4 mA – 20 mA','0 – 10 V'],c:0,e:'والنص الأحمر في الشكل: «Adjust type to Type K».'},
  {q:'حرارة الثرموكبل أعلى من 1622°C. ما القراءة؟',o:['16220','32767 (Overflow)','0','8000H'],c:1,e:'حسب Table 4-26: أعلى من 1622.0 ← 32767 = 7FFFH.'},
  {q:'ما التناقض في عناوين S1 و S0؟',o:['لا يوجد','الجدول يعطي S1 = I0.0 والشكل والبرنامج يعطيان S1 = I0.1','S1 على Q4.0','S0 على PIW288'],c:1,e:'الجدول ص 101 يخالف الشكل (1-5) وبرنامج LAD.'}
 ]
});

/* =================== Lesson 5.3 =================== */
function patchP(P){if(P.__u5)return;const o=P.val;P.val=v=>{const k=String(v==null?'':v).replace(/\s+/g,'').toUpperCase();if(/^(MD|LD|PIW)\d+$/.test(k))return P.words[k]||0;return o(v)};P.__u5=1}
const N6=(en)=>({title:'Network 6 : Start Heating',ref:'ص 105',read:`السخان K1 (Q4.0) والمصباح H1 (Q4.1) يُثبَّتان إذا كان ${en==='M'?'أمر التشغيل محفوظاً (M0.0)':'S1 مضغوطاً (I0.1)'} <b>و</b> الحرارة الفعلية MD200 ≤ 80٪ من المطلوبة (MD80).`,
  stl:[en==='M'?'A    M    0.0':'A    I    0.1','A(','L    MD   200','L    MD   80','<=R',')','S    Q    4.0','S    Q    4.1']});
const N7={title:'Network 7 : End Heating',ref:'ص 105',read:'يُلغى السخان والمصباح إذا ضُغط S0 (I0.0) <b>أو</b> الحرارة الفعلية MD200 &gt; 120٪ من المطلوبة (MD120).',
  stl:['O    I    0.0','O(','L    MD   200','L    MD   120','>R',')','R    Q    4.0','R    Q    4.1']};
const NM={title:'Network 5a — حفظ أمر التشغيل M0.0 (إضافة في النسخة المصححة)',ref:'ليس في الكتاب',read:'S1 يثبّت العلامة M0.0 و S0 يلغيها، فيبقى «التسخين مسموحاً» بعد رفع الإصبع عن S1.',stl:['A    I    0.1','S    M    0.0','A    I    0.0','R    M    0.0']};

function roomSVG(T,Ta,H,top){top=top||100;const lvl=clamp(T,0,top)/top;let s=`<svg viewBox="0 0 320 180" role="img" aria-label="الغرفة">`;
  s+=`<rect x="10" y="10" width="220" height="150" rx="6" class="sym" fill="${H?'var(--live-soft)':'var(--surface-2)'}"/>`+ar(120,32,'الغرفة','','middle',13);
  s+=`<path d="M30 140h12l6-12 6 24 6-24 6 24 6-24 6 24 6-12h12" fill="none" stroke="${H?'var(--stop)':'var(--wire)'}" stroke-width="${H?3.2:2}"/>`+S.t(72,170,'K1 heater','m');
  s+=S.w('M230 70H200','live')+`<circle cx="198" cy="70" r="4" fill="var(--stop)"/>`+S.t(196,60,'TC','m','end');
  s+=`<rect x="262" y="20" width="18" height="130" rx="9" class="sym" fill="var(--surface)"/><rect x="266" y="${(146-122*lvl).toFixed(1)}" width="10" height="${(122*lvl).toFixed(1)}" rx="5" fill="var(--stop)"/><circle cx="271" cy="158" r="12" fill="var(--stop)"/>`;
  s+=S.t(300,30,String(top),'m','start')+S.t(300,148,'0','m','start')+S.t(120,92,T.toFixed(1)+' °C','',  'middle',22)+ar(120,118,'الجو المحيط '+Ta+'°','m','middle',11);
  return s+'</svg>'}
// قيم المدرب لنموذج الغرفة (أرقام توضيحية ليست من الكتاب) — الافتراضي = النموذج السابق تماماً (60 و 10 s)
const ROOM_DEFS=()=>[
  {k:'G',label:'أقصى ارتفاع لحرارة الغرفة فوق حرارة الجو عندما يعمل السخان باستمرار',unit:'°C',value:60,min:5,max:500,step:1},
  {k:'tau',label:'ثابت زمن الغرفة (كلما كبر تسخن الغرفة وتبرد أبطأ)',unit:'s',value:10,min:1,max:600,step:0.5}];
const roomTop=G=>G<=60?100:Math.ceil((40+G)/25)*25;  // أعلى المحور: 100 بالقيم التوضيحية
const roomNote=(TP,Ta,L120)=>{const mx=Ta+TP.v.G;return mx<=L120?`بهذه القيم أقصى حرارة تصلها الغرفة والسخان يعمل باستمرار = حرارة الجو + <span class="ltr">${fnum(TP.v.G,1)}</span> = <span class="ltr">${fnum(mx,1)} °C</span>، وهي لا تتجاوز حد الإيقاف (120٪)، فلن يفصل السخان وحده.`:''};
function heatPlant(){let TP=null;const tpv=()=>TP?TP.v:{G:60,tau:10};
 const tpU=el=>{const top=roomTop(TP.v.G),ch=this_.chart;ch.ymax=top;ch.ticks=[0,1,2,3,4].map(i=>top*i/4);
   const pn=el.closest('.panel');if(pn){const lb=pn.querySelector('#plantLabel');if(lb&&el._p)lb.textContent=this_.label(el._p);const h=pn.querySelector('h3.sm');if(h)h.textContent=ch.label.replace('نموذج توضيحي',TP.trainer?'قيم المدرب':'نموذج توضيحي')}};
 const this_={
  title:'الغرفة والسخان',
  init:()=>{if(!TP)TP=B.params(document.createElement('div'),'u5-l3',ROOM_DEFS());const top=roomTop(TP.v.G);this_.chart.ymax=top;this_.chart.ticks=[0,1,2,3,4].map(i=>top*i/4);return {T:25,Ta:25,V:5,man:false,Tm:25,SV:50,L80:40,L120:60,H:0,prevH:0,offs:0,reon:0,v:chain(5,25)}},
  step(dt,st,p){const P=st.plc;patchP(P);const H=st.Q('Q4.0');const tau=tpv().tau;
    if(p.man)p.T=p.Tm;else p.T+=dt*(tpv().G*H-(p.T-p.Ta))/tau;
    const c=chain(p.V,p.T);p.v=c;
    Object.assign(P.words,{PIW288:c.piw288,LD0:c.ld0,MD0:r2(c.md0),PIW290:c.piw290,LD10:c.ld10,MD10:r2(c.md10b),MD100:r2(c.md100),MD200:r2(c.md200),MD80:r2(c.md80),MD120:r2(c.md120)});
    p.SV=c.md100;p.L80=c.md80;p.L120=c.md120;
    if(p.prevH&&!H){p.offs++;p.wasOff=1}if(!p.prevH&&H&&p.wasOff)p.reon++;p.prevH=H;p.H=H},
  render(el,st,p){el._p=p;if(!el.querySelector('.u5room')){
    el.innerHTML=`<div class="u5tp"></div><div class="u5room svgbox" style="max-width:340px;margin-inline:auto"></div>
     <label class="toggle">المقاومة R (الحرارة المطلوبة) <input type="range" data-k="V" min="0" max="10" step="0.1" style="width:150px;height:auto"> <b class="ltr" data-o="V"></b></label>
     <label class="toggle">حرارة الجو المحيط <input type="range" data-k="Ta" min="0" max="40" step="1" style="width:150px;height:auto"> <b class="ltr" data-o="Ta"></b></label>
     <label class="toggle"><input type="checkbox" data-k="man"> تحريك الحرارة يدوياً (بدل نموذج الغرفة)</label>
     <label class="toggle" data-man>الحرارة اليدوية <input type="range" data-k="Tm" min="0" max="100" step="0.5" style="width:150px;height:auto"> <b class="ltr" data-o="Tm"></b></label>
     <div class="facts u5vals"></div><p class="sub u5tpn" hidden></p>
     <p class="sub">القيم تحسبها الشبكات 1–5 (عمليات الأعداد الحقيقية) قبل الشبكتين 6 و 7. انظر الشرح لرسمها.</p>`;
    el.querySelectorAll('[data-k]').forEach(i=>{const k=i.dataset.k;const q=el._p;if(i.type==='checkbox')i.checked=!!q[k];else i.value=q[k];
      i.addEventListener('input',()=>{const q=el._p;if(i.type==='checkbox'){q[k]=i.checked;if(i.checked)q.Tm=Math.round(q.T*2)/2;const m=el.querySelector('[data-k="Tm"]');m.value=q.Tm}else q[k]=+i.value})});
    TP=B.params(el.querySelector('.u5tp'),'u5-l3',ROOM_DEFS(),()=>tpU(el));tpU(el)}
    this.frame(el,st,p)},
  frame(el,st,p){if(!el||!el.querySelector('.u5room'))return;el._p=p;const now=performance.now();if(el._t&&now-el._t<90)return;el._t=now;
    el.querySelector('.u5room').innerHTML=roomSVG(p.T,p.Ta,st.Q('Q4.0'),roomTop(tpv().G));
    const tn=el.querySelector('.u5tpn'),nt=p.man?'':roomNote(TP,p.Ta,p.L120);if(tn){tn.hidden=!nt;if(nt)tn.innerHTML=nt}
    const set=(k,t)=>{const o=el.querySelector(`[data-o="${k}"]`);if(o)o.textContent=t};set('V',p.V.toFixed(1)+' v = '+p.SV.toFixed(0)+' °C');set('Ta',p.Ta+' °C');set('Tm',p.Tm+' °C');
    el.querySelector('[data-man]').style.opacity=p.man?1:.45;
    const c=p.v;el.querySelector('.u5vals').innerHTML=[['PIW288',c.piw288],['MD100 مطلوبة',fnum(c.md100,1)],['PIW290',c.piw290],['MD200 فعلية',fnum(c.md200,1)],['MD80 (80٪)',fnum(c.md80,1)],['MD120 (120٪)',fnum(c.md120,1)]].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('')},
  sig:p=>p.man+'|'+p.H,
  label:p=>p.man?'حرارة يدوية':TP&&TP.trainer?'نموذج الغرفة (قيم المدرب)':'نموذج الغرفة (توضيحي)',
  readouts:[{l:'الحرارة الفعلية',v:p=>p.T.toFixed(1)+' °C'},{l:'المطلوبة',v:p=>p.SV.toFixed(0)+' °C'},{l:'الحدان',v:p=>p.L80.toFixed(0)+' / '+p.L120.toFixed(0)+' °C'},{l:'السخان',chip:(p,s)=>[s.Q('Q4.0')?'يعمل':'متوقف',s.Q('Q4.0')?'run':'']}],
  chart:{key:'T',ymax:100,ticks:[0,25,50,75,100],unit:'°',span:60,label:'درجة الحرارة مع الزمن (آخر 60 ثانية) — نموذج توضيحي',series:[{key:'SV',color:'--muted'},{key:'L80',color:'--on'},{key:'L120',color:'--stop'}],
   legend:'<span><i style="background:var(--blue)"></i>الحرارة الفعلية MD200</span><span><i style="background:var(--muted)"></i>المطلوبة MD100</span><span><i style="background:var(--on)"></i>80٪ (MD80): حد التشغيل</span><span><i style="background:var(--stop)"></i>120٪ (MD120): حد الإيقاف</span>'}
 };return this_}

B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'103–105',
 title:'خطوات البرنامج وبرنامج LAD للحاكم ذي الموضعين',
 summary:'تحويل القراءتين إلى أعداد حقيقية ومعايرتهما (الشبكات 1–5)، ثم تشغيل السخان عند 80٪ من الحرارة المطلوبة وإيقافه عند 120٪ بدالتي التخزين والإلغاء (الشبكتان 6 و 7).',
 stations:[
  {intro:true},

  {st:1,short:'الحرارة المطلوبة',title:'خطوات عمل البرنامج 1 و 2: الحرارة المطلوبة من المقاومة R',ref:'ص 103',
   q:'المقاومة R تعطي الـ PLC رقماً من 0 إلى 27648… فكيف نحوّله إلى درجات من 0 إلى 100؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة مقاييس متقابلة: الجهد من 0 إلى 10 فولت، والقراءة من 0 إلى 27648، والحرارة من 0 إلى 100 درجة، وتحتها دوال التحويل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="جهد منزلق المقاومة ⟦R⟧: من ⟦0⟧ إلى ⟦10⟧ فولت."><rect x="90" y="64" width="210" height="12" rx="6" fill="#4FB3A9"/><text x="80" y="75" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R</text><text x="90" y="58" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 v</text><text x="300" y="58" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">10 v</text></g><g data-tip="القراءة داخل الـ ⟦PLC⟧ من ⟦PIW288⟧: عدد صحيح من ⟦0⟧ إلى ⟦27648⟧."><rect x="90" y="114" width="210" height="12" rx="6" fill="#F2C14E"/><text x="80" y="125" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">PIW288</text><text x="90" y="108" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text><text x="300" y="108" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">27648</text></g><g data-tip="الحرارة المطلوبة بعد المعايرة في ⟦MD100⟧: من ⟦0⟧ إلى ⟦100⟧ درجة (أقصى درجة حرارة مطلوبة)."><rect x="90" y="164" width="210" height="12" rx="6" fill="#E8735A"/><text x="80" y="175" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">MD100</text><text x="90" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 °C</text><text x="300" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100 °C</text></g><g data-tip="⟦I_DI⟧: يحوّل العدد الصحيح ⟦Integer⟧ إلى عدد صحيح مزدوج ⟦Double Integer⟧."><rect x="14" y="206" width="66" height="30" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="47" y="226" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I_DI</text></g><g data-tip="⟦DI_R⟧: يحوّل العدد الصحيح المزدوج إلى عدد حقيقي ⟦Real⟧ (يقبل الكسور)."><rect x="98" y="206" width="66" height="30" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="131" y="226" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DI_R</text></g><g data-tip="⟦DIV_R⟧: قسمة القيمة على ⟦27648.0⟧ (أعداد حقيقية)."><rect x="182" y="206" width="66" height="30" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="215" y="226" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DIV_R</text><text x="215" y="254" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">÷ 27648.0</text></g><g data-tip="⟦MUL_R⟧: ضرب الناتج في ⟦100.0⟧ (أقصى درجة حرارة مطلوبة)، وتمرير القيمة إلى ⟦MD100⟧."><rect x="266" y="206" width="66" height="30" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="299" y="226" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">MUL_R</text><text x="299" y="254" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">× 100.0</text></g><path d="M80 221 H94 M164 221 H178 M248 221 H262" stroke="#2C4A40" stroke-width="2"/><text x="180" y="294" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">النتيجة في <tspan font-family="var(--mono)">MD100</tspan></text></svg>`,
   cap:'المقاييس الثلاثة متقابلة: طرفها الأيسر صفر، والأيمن الحد الأقصى. وتحتها الدوال الأربع بالترتيب.<br><b>مرّر المؤشر على المقاييس والدوال (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<ol><li>للتعبير عن درجة الحرارة المطلوبة بالقيمة العشرية يتم تحويل الرقم من <span class="ltr">Integer</span> إلى <span class="ltr">Double Integer</span> باستخدام الدالة <span class="ltr">I_DI</span> ثم إلى <span class="ltr">Real</span> باستخدام الدالة <span class="ltr">DI_R</span> وتمريرها داخل العنوان <span class="ltr">LD0</span>.</li>
     <li>ثم تتم معايرة درجة الحرارة المطلوبة بحيث يصبح: صفر فولت = صفر صحيح = صفر درجة حرارة؛ <span class="ltr">10</span> فولت = <span class="ltr">27648</span> صحيح = <span class="ltr">100</span> درجة حرارة. وذلك باستخدام دالة القسمة <span class="ltr">DIV_R</span> لقسمة قيمة الدخل على الرقم <span class="ltr">27648.0</span> ويتبعه استخدام دالة الضرب <span class="ltr">MUL_R</span> للضرب في الرقم <span class="ltr">100.0</span> (أقصى درجة حرارة مطلوبة) وتمرر القيمة داخل العنوان <span class="ltr">MD100</span>.</li></ol>`,ref:'ص 103'}
   ],
   body:[
    {predict:{q:String.raw`أدرت المقاومة R إلى آخرها (<span class="ltr">10</span> فولت). كم تصبح القيمة في <span class="ltr">MD100</span>؟`,opts:[
     [String.raw`<span class="ltr">27648</span>`,false,'هذه قراءة PIW288 قبل المعايرة؛ بعد القسمة والضرب تصبح درجات.'],
     [String.raw`<span class="ltr">10</span>`,false,'هذا الجهد بالفولت، والمعايرة تحوّله إلى درجات من 0 إلى 100.'],
     [String.raw`<span class="ltr">100.0</span>`,true,'27648 ÷ 27648.0 × 100.0 = 100.0، أي أقصى درجة حرارة مطلوبة.']]}},
    {tip:String.raw`<p>لماذا التحويل إلى <span class="ltr">Real</span>؟ لأن القسمة على <span class="ltr">27648</span> تعطي كسراً (مثلاً نصف المدى = <span class="ltr">0.5</span>). العدد الصحيح لا يحفظ الكسور، فنحوّله أولاً: <span class="ltr">Integer</span> ← <span class="ltr">Double Integer</span> ← <span class="ltr">Real</span>، ثم نقسم ونضرب. القسمة تعطي «نسبة من المدى» بين <span class="ltr">0</span> و<span class="ltr">1</span>، والضرب في <span class="ltr">100.0</span> يحوّلها إلى درجات.</p>`,title:'لماذا هذه الخطوات بالذات؟'},
    {title:'حرّك المقاومة R وتابع الأرقام',widget:(el,B)=>{
      el.innerHTML=`<label class="w-sl"><span>جهد المقاومة R <span class="ltr"><b data-o="v"></b> v</span></span><input type="range" min="0" max="10" step="0.1" value="10" dir="ltr"></label>
       <div class="w-facts"><div><span>PIW288 (Integer)</span><b class="ltr" data-o="p"></b></div><div><span>LD0 بعد I_DI</span><b class="ltr" data-o="l"></b></div><div><span>MD0 بعد DI_R</span><b class="ltr" data-o="m0"></b></div><div><span>MD10 بعد ÷ 27648.0</span><b class="ltr" data-o="m10"></b></div><div><span>MD100 بعد × 100.0</span><b class="ltr" data-o="m100"></b></div></div>
       <p class="sub" style="margin-top:6px">القراءة = الجهد ÷ 10 × 27648 (مقربة لأقرب عدد صحيح).</p>`;
      const rg=el.querySelector('input'),o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const c=chain(+rg.value,0);o('v').textContent=(+rg.value).toFixed(1);o('p').textContent=c.piw288;o('l').textContent=c.ld0;o('m0').textContent=c.md0.toFixed(1);o('m10').textContent=fnum(c.md10a,4);o('m100').textContent=fnum(c.md100,2)+' °C'};
      rg.oninput=draw;draw();
    }},
    {watch:String.raw`<p>الخطوة 1 تقول إن القيمة الحقيقية تُمرَّر في <span class="ltr">LD0</span>، لكن في البرنامج <span class="ltr">LD0</span> هو ناتج <span class="ltr">I_DI</span> (عدد صحيح مزدوج)، والقيمة الحقيقية <span class="ltr">Real</span> تذهب إلى <span class="ltr">MD0</span> (الشبكة 1، ص 104).</p>`,fix:true}
   ]},

  {st:2,short:'الحرارة الفعلية',title:'خطوة العمل 3: الحرارة الفعلية من الثرموكبل',ref:'ص 103',
   q:'قراءة الثرموكبل عرفناها: الحرارة × 10. فهل نحتاج هنا القسمة على 27648 أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مسار الحرارة الفعلية: الثرموكبل ثم PIW290 ثم I_DI ثم DI_R ثم القسمة على 10.0 ثم MD200، ومثال 1372.0 درجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الثرموكبل نوع ⟦K⟧: الحرارة الفعلية في الغرفة."><rect x="120" y="26" width="120" height="30" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="46" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">الثرموكبل</text></g><g data-tip="⟦PIW290⟧: القراءة = الحرارة ⟦× 10⟧ (عدد صحيح)."><rect x="120" y="70" width="120" height="30" rx="8" fill="#2C4A40"/><text x="180" y="90" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PIW290</text></g><g data-tip="⟦I_DI⟧: ⟦Integer⟧ إلى ⟦Double Integer⟧، والناتج في ⟦LD10⟧."><rect x="120" y="114" width="120" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="134" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I_DI</text></g><g data-tip="⟦DI_R⟧: ⟦Double Integer⟧ إلى ⟦Real⟧، والناتج في ⟦MD10⟧."><rect x="120" y="158" width="120" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="178" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DI_R</text></g><g data-tip="⟦DIV_R⟧: القسمة على ⟦10.0⟧ تلغي الضرب في ⟦10⟧ الذي فعله الموديول، فنرجع إلى الدرجات."><rect x="120" y="202" width="120" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="222" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DIV_R ÷ 10.0</text></g><g data-tip="⟦MD200⟧: الحرارة الفعلية بالدرجات (عدد حقيقي)."><rect x="120" y="246" width="120" height="30" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="180" y="266" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">MD200</text></g><path d="M180 56 V70 M180 100 V114 M180 144 V158 M180 188 V202 M180 232 V246" stroke="#2C4A40" stroke-width="2.5"/><g font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"><text x="250" y="46">1372.0 °C</text><text x="250" y="90">13720</text><text x="250" y="222">÷ 10.0</text><text x="250" y="266">1372.0</text></g><text x="62" y="160" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مثال من</text><text x="62" y="176" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">جدول الكتاب</text><text x="180" y="304" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ضرب في 10 ثم قسمة على 10</text></svg>`,
   cap:'المسار من أعلى إلى أسفل، والأرقام على اليمين مثال من جدول الثرموكبل في ص 102.<br><b>مرّر المؤشر على كل مربع (أو المسه في الجوال) لتعرف ما يفعله.</b>',
   side:[
    {book:String.raw`<p>3. للتعبير عن درجة الحرارة الفعلية بالقيمة العشرية يتم تحويل الرقم من <span class="ltr">Integer</span> إلى <span class="ltr">Double Integer</span> باستخدام الدالة <span class="ltr">I_DI</span> ثم إلى <span class="ltr">Real</span> باستخدام الدالة <span class="ltr">DI_R</span> ثم قسمتها على القيمة <span class="ltr">10.0</span> للحصول على القيمة الفعلية للحرارة من الثيرموكبل وتمريرها داخل العنوان <span class="ltr">MD200</span>.</p>`,ref:'ص 103'},
    {predict:{q:'لماذا نقسم قراءة الثرموكبل على 10.0 وليس على 27648.0 كما فعلنا مع المقاومة؟',opts:[
     ['لأن قراءة الثرموكبل = الحرارة × 10، فالقسمة على 10 ترجعها درجات',true,'هذه القاعدة من جدول ص 102؛ الثرموكبل لا يحتاج معايرة من مدى 27648.'],
     ['لأن أقصى جهد للثرموكبل 10 فولت',false,'الـ 10 هنا ليست فولتات؛ هي معامل الضرب الذي يحفظ الخانة العشرية.'],
     ['لأن القسمة على 27648.0 ممنوعة مع الأعداد الحقيقية',false,'ليست ممنوعة؛ استعملناها مع المقاومة R. الفرق في طريقة قراءة كل حساس.']]}}
   ],
   body:[
    {tip:String.raw`<p>قارن المسارين: <b>المقاومة R</b> تعطي نسبة من مدى <span class="ltr">0–27648</span>، فنحتاج قسمة ثم ضرباً لنصل إلى الدرجات. أما <b>الثرموكبل</b> فقراءته أصلاً «درجات × 10»، فتكفي القسمة على <span class="ltr">10.0</span>. وفي الحالتين التحويل إلى <span class="ltr">Real</span> أولاً لكي لا تضيع الكسور.</p>`,title:'مساران مختلفان'},
    {watch:String.raw`<p>القسمة تكون على <span class="ltr">10.0</span> (عدد حقيقي) لا على <span class="ltr">10</span> (عدد صحيح): الدالة <span class="ltr">DIV_R</span> تعمل على الأعداد الحقيقية، فيبقى الكسر العشري (مثلاً <span class="ltr">0.1</span> درجة).</p>`},
    {title:'مختبر مصغّر: من قراءة الثرموكبل إلى MD200',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك حرارة الثرموكبل (أرقام تختارها أنت) وتابع القيمة في كل مرحلة حتى تصل إلى <span class="ltr">MD200</span>.',
      predict:{q:String.raw`قراءة الثرموكبل <span class="ltr">PIW290 = 253</span>. ما القيمة التي تُخزَّن في <span class="ltr">MD200</span>؟`,opts:[
       [String.raw`<span class="ltr">25.3</span>`,true,String.raw`<span class="ltr">253</span> بعد التحويل إلى <span class="ltr">Real</span> تصبح <span class="ltr">253.0</span>، ثم ÷ <span class="ltr">10.0</span> = <span class="ltr">25.3</span> درجة.`],
       [String.raw`<span class="ltr">253</span>`,false,String.raw`هذه القراءة نفسها (الحرارة × 10) قبل القسمة.`],
       [String.raw`<span class="ltr">0.009</span>`,false,String.raw`هذا ناتج القسمة على <span class="ltr">27648.0</span>، وهي قسمة المقاومة <span class="ltr">R</span> لا الثرموكبل.`]]},
      ins:[{k:'t',l:'حرارة الثرموكبل',min:0,max:150,step:0.1,v:25.3,u:'°C',dp:1}],
      calc:s=>{const piw=Math.round(s.t*10),md=piw/10;
       return {facts:[['PIW290 (Integer)',String(piw)],['بعد I_DI (Double Integer)',String(piw)],['بعد DI_R (Real)',piw.toFixed(1)],['DIV_R ÷ 10.0 ← MD200',fnum(md,1),'hi']],
        msg:`الرقم لا يتغير في <span class="ltr">I_DI</span> و <span class="ltr">DI_R</span>؛ يتغير نوعه فقط حتى يقبل الكسور. ولو قسمناه خطأً على <span class="ltr">27648.0</span> لحصلنا على <span class="ltr">${fnum(piw/27648,4)}</span> بدل <span class="ltr">${fnum(md,1)}</span> درجة.`}}})}
   ]},

  {st:3,short:'المقارنة: 80٪ و 120٪',title:'خطوات العمل 4 إلى 6: المقارنة، والتشغيل عند 80٪، والإيقاف عند 120٪',ref:'ص 103',
   q:'لو شغّلنا السخان تحت الحرارة المطلوبة مباشرة وأوقفناه فوقها مباشرة… ماذا يحدث للمتمم؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محور الحرارة عليه ثلاثة خطوط: 120 بالمئة من المطلوبة للإيقاف، والمطلوبة، و80 بالمئة للتشغيل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="فوق ⟦120%⟧ من الحرارة المطلوبة ⟦(MD120)⟧: يتوقف السخان."><rect x="70" y="36" width="220" height="64" fill="#F7DCC8"/><text x="180" y="74" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">يتوقف السخان</text></g><g data-tip="بين الحدين: لا شرط تشغيل ولا شرط إيقاف، فيبقى السخان على حاله (يعمل إن كان يعمل، ومتوقفاً إن كان متوقفاً). ستعرف السبب في المحطة الخامسة."><rect x="70" y="100" width="220" height="120" fill="#FBF6EE"/><text x="180" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">بين الحدين: يبقى على حاله</text></g><g data-tip="عند ⟦80%⟧ من الحرارة المطلوبة ⟦(MD80)⟧ أو أقل: يعمل السخان."><rect x="70" y="220" width="220" height="64" fill="#DDEFE6"/><text x="180" y="258" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">يعمل السخان</text></g><line x1="70" y1="100" x2="290" y2="100" stroke="#E8735A" stroke-width="3"/><line x1="70" y1="160" x2="290" y2="160" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 5"/><line x1="70" y1="220" x2="290" y2="220" stroke="#12855A" stroke-width="3"/><line x1="70" y1="290" x2="70" y2="30" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,24 64,36 76,36" fill="#2C4A40"/><g font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"><text x="64" y="104" text-anchor="end">MD120</text><text x="64" y="164" text-anchor="end">MD100</text><text x="64" y="224" text-anchor="end">MD80</text><text x="296" y="104">120%</text><text x="296" y="164">100%</text><text x="296" y="224">80%</text></g><text x="180" y="152" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600">الحرارة المطلوبة</text><text x="180" y="306" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">النسب كلها من الحرارة المطلوبة</text></svg>`,
   cap:'الخطوط الثلاثة نسب من الحرارة المطلوبة <span class="ltr">MD100</span>. المنطقة البيضاء بينها لا تغيّر شيئاً.<br><b>مرّر المؤشر على المناطق الثلاث (أو المسها في الجوال) لتعرف ما يحدث في كل منها.</b>',
   side:[
    {book:String.raw`<ol start="4"><li>تستخدم دالة المقارنة <span class="ltr">CMP</span> للمقارنة بين الحرارة الفعلية والحرارة المطلوبة.</li><li>و من ثم يتم تشغيل السخان متمم السخان <span class="ltr">Q4.0</span> إذا كانت الحرارة الفعلية أقل من <span class="ltr">80%</span> من الحرارة المطلوبة.</li><li>ويتوقف عمل السخان إذا كانت الحرارة الفعلية أكبر من <span class="ltr">120%</span> من الحرارة المطلوبة.</li></ol>`,ref:'ص 103'},
    {predict:{q:String.raw`الحرارة المطلوبة <span class="ltr">100 °C</span> (أقصى قيمة). متى يعمل السخان؟`,opts:[
     [String.raw`عندما تنزل الحرارة الفعلية إلى <span class="ltr">100 °C</span> أو أقل`,false,'التشغيل ليس عند الحرارة المطلوبة نفسها، بل عند 80٪ منها.'],
     [String.raw`عندما تنزل الحرارة الفعلية إلى <span class="ltr">80 °C</span> أو أقل`,true,'MD80 = 0.8 × 100 = 80، والمقارنة في البرنامج «أقل من أو يساوي».'],
     [String.raw`عندما تتجاوز الحرارة الفعلية <span class="ltr">120 °C</span>`,false,'هذا شرط الإيقاف لا التشغيل.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ملاحظة:</b> قبل البدء في تنفيذ الدائرة على <span class="ltr">(PLC)</span> يجب مراجعة الكتالوج الخاص بالوحدة وتحديد المداخل والمخارج الرقمية والتناظرية وترقيمها حسب المتوفر في المختبر والبلوكات.</p>`,ref:'ص 103'},
    {tip:String.raw`<p>لو كان حد التشغيل وحد الإيقاف هما الحرارة المطلوبة نفسها، لتأرجحت الحرارة حولها بفروق صغيرة جداً، فيعمل المتمم ويفصل عشرات المرات. المسافة بين <span class="ltr">80%</span> و<span class="ltr">120%</span> تجعل كل تشغيل وكل إيقاف يستمر مدة معقولة.</p>`,title:'لماذا حدّان وليس حداً واحداً؟'},
    {title:'حرّك الحرارتين وشاهد قرار المقارنة',widget:(el,B)=>{
      el.innerHTML=`<label class="w-sl"><span>الحرارة المطلوبة <span class="ltr">MD100 = <b data-o="sv"></b> °C</span></span><input type="range" data-k="sv" min="0" max="100" step="1" value="100" dir="ltr"></label>
       <label class="w-sl"><span>الحرارة الفعلية <span class="ltr">MD200 = <b data-o="av"></b> °C</span></span><input type="range" data-k="av" min="0" max="130" step="1" value="25" dir="ltr"></label>
       <div class="w-facts"><div><span>MD80 = MD100 × 0.8</span><b class="ltr" data-o="m80"></b></div><div><span>MD120 = MD100 × 1.2</span><b class="ltr" data-o="m120"></b></div><div><span>MD200 &lt;= MD80 ؟ (التشغيل)</span><b class="ltr" data-o="c1"></b></div><div><span>MD200 &gt; MD120 ؟ (الإيقاف)</span><b class="ltr" data-o="c2"></b></div></div>
       <p class="sub" style="margin-top:8px" data-o="d"></p>`;
      const g=k=>+el.querySelector(`[data-k="${k}"]`).value,o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const sv=g('sv'),av=g('av'),a=sv*0.8,b=sv*1.2,c1=av<=a,c2=av>b;
        o('sv').textContent=sv;o('av').textContent=av;o('m80').textContent=fnum(a,1);o('m120').textContent=fnum(b,1);o('c1').textContent=c1?'1 نعم':'0 لا';o('c2').textContent=c2?'1 نعم':'0 لا';
        o('d').innerHTML=c1?'<b>شرط التشغيل متحقق:</b> يُثبَّت السخان (ما دام شرط التشغيل الآخر في Network 6 متحققاً — المحطة الخامسة).':c2?'<b>شرط الإيقاف متحقق:</b> يُلغى السخان.':'<b>بين الحدين:</b> لا شرط تشغيل ولا شرط إيقاف، فيبقى السخان على حاله.'};
      el.querySelectorAll('input').forEach(i=>i.oninput=draw);draw();
    }},
    {watch:String.raw`<p>الخطوة 4 مطبوعة في الكتاب «≤CMP»، والخطوة 5 تقول «أقل من <span class="ltr">80%</span>»، بينما البرنامج (ص 105) يستخدم <span class="ltr">CMP &lt;=R</span>، أي «أقل من <b>أو يساوي</b>». وشرط الإيقاف <span class="ltr">CMP &gt;R</span>: «أكبر من» فقط.</p>`,fix:true}
   ]},

  {st:4,short:'الشبكات 1–5',title:'ثانياً: برنامج LAD — الشبكات 1 إلى 5 (التحويل والمعايرة)',ref:'ص 104',
   q:'الخطوات 1 إلى 3 كلام… فكيف تبدو صناديقاً موصولة في المخطط السلّمي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشبكات الخمس الأولى: تحويل قراءة المقاومة ومعايرتها، وتحويل قراءة الثرموكبل، وحساب 80 و120 بالمئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="⟦Network 1⟧: ⟦I_DI⟧ يحوّل ⟦PIW288⟧ إلى ⟦LD0⟧، ثم ⟦DI_R⟧ يحوّل ⟦LD0⟧ إلى العدد الحقيقي ⟦MD0⟧."><rect x="26" y="26" width="308" height="46" rx="8" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="36" y="44" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 1</text><text x="36" y="63" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">PIW288 → I_DI → DI_R → MD0</text></g><g data-tip="⟦Network 2⟧: ⟦DIV_R⟧ يقسم ⟦MD0⟧ على ⟦27648.0⟧ والناتج في ⟦MD10⟧، ثم ⟦MUL_R⟧ يضربه في ⟦100.0⟧ والناتج ⟦MD100⟧ = الحرارة المطلوبة."><rect x="26" y="80" width="308" height="46" rx="8" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="36" y="98" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 2</text><text x="36" y="117" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">MD0 ÷ 27648.0 × 100.0 → MD100</text></g><g data-tip="⟦Network 3⟧: ⟦I_DI⟧ يحوّل ⟦PIW290⟧ إلى ⟦LD10⟧، ثم ⟦DI_R⟧ يحوّله إلى العدد الحقيقي ⟦MD10⟧."><rect x="26" y="134" width="308" height="46" rx="8" fill="#FBF6EE" stroke="#E8735A" stroke-width="3"/><text x="36" y="152" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 3</text><text x="36" y="171" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">PIW290 → I_DI → DI_R → MD10</text></g><g data-tip="⟦Network 4⟧: ⟦DIV_R⟧ يقسم ⟦MD10⟧ على ⟦10.0⟧ والناتج ⟦MD200⟧ = الحرارة الفعلية."><rect x="26" y="188" width="308" height="46" rx="8" fill="#FBF6EE" stroke="#E8735A" stroke-width="3"/><text x="36" y="206" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 4</text><text x="36" y="225" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">MD10 ÷ 10.0 → MD200</text></g><g data-tip="⟦Network 5⟧: ⟦MUL_R⟧ يضرب ⟦MD100⟧ في ⟦0.8⟧ والناتج ⟦MD80⟧، وفي ⟦1.2⟧ والناتج ⟦MD120⟧: حدّا التشغيل والإيقاف."><rect x="26" y="242" width="308" height="46" rx="8" fill="#FBF6EE" stroke="#F2C14E" stroke-width="3"/><text x="36" y="260" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 5</text><text x="36" y="279" font-size="11" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">MD100 × 0.8 → MD80 , × 1.2 → MD120</text></g></svg>`,
   cap:'ملخص الشبكات الخمس: الإطار الفيروزي للحرارة المطلوبة، والبرتقالي للفعلية، والأصفر للحدين.<br><b>مرّر المؤشر على كل شبكة (أو المسها في الجوال) لتعرف صناديقها ومخارجها.</b>',
   side:[
    {book:String.raw`<p><b>دائرة <span class="ltr">(LAD)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء والمقارنات</b></p>
     <div class="tablebox" style="direction:ltr"><table class="tt" style="font-size:12.5px;text-align:left"><tbody>
     <tr><td><b>Network 1 : Set Value of Temprature as Real</b><br>I_DI: IN = PIW288 → OUT = LD0 ; DI_R: IN = LD0 → OUT = MD0</td></tr>
     <tr><td><b>Network 2 : Scalling for Set Value</b><br>DIV_R: IN1 = MD0, IN2 = 2.764800e+004 → OUT = MD10 ; MUL_R: IN1 = MD10, IN2 = 1.000000e+002 → OUT = MD100</td></tr>
     <tr><td><b>Network 3 : Actual Value of Temprature as Real</b><br>I_DI: IN = PIW290 → OUT = LD10 ; DI_R: IN = LD10 → OUT = MD10</td></tr>
     <tr><td><b>Network 4 :</b><br>DIV_R: IN1 = MD10, IN2 = 1.000000e+001 → OUT = MD200</td></tr>
     <tr><td><b>Network 5 : 80% And 120% of Actual Value</b><br>MUL_R: IN1 = MD100, IN2 = 8.000000e-001 → OUT = MD80 ; MUL_R: IN1 = MD100, IN2 = 1.200000e+000 → OUT = MD120</td></tr></tbody></table></div>`,ref:'ص 104'}
   ],
   body:[
    {tip:String.raw`<p>كل صندوق له مدخل تمكين <span class="ltr">EN</span> ومخرج <span class="ltr">ENO</span>. في كل شبكة يتصل <span class="ltr">ENO</span> الصندوق الأول بـ <span class="ltr">EN</span> الصندوق الثاني، فيعملان بالترتيب. والأرقام مثل <span class="ltr">2.764800e+004</span> هي الكتابة العلمية للعدد الحقيقي <span class="ltr">27648.0</span> (أي <span class="ltr">2.7648 × 10⁴</span>)، و<span class="ltr">8.000000e-001</span> = <span class="ltr">0.8</span>.</p>`,title:'كيف تقرأ الصناديق والأرقام؟'},
    {predict:{q:String.raw`إذا كانت <span class="ltr">MD100 = 100.0</span>، فما ناتجا Network 5؟`,opts:[
     [String.raw`<span class="ltr">MD80 = 0.8</span> و<span class="ltr">MD120 = 1.2</span>`,false,'هذان المعاملان نفساهما؛ الصندوق يضربهما في MD100.'],
     [String.raw`<span class="ltr">MD80 = 20.0</span> و<span class="ltr">MD120 = 120.0</span>`,false,'80 ليست 100 − 80؛ الصندوق MUL_R يضرب في 0.8.'],
     [String.raw`<span class="ltr">MD80 = 80.0</span> و<span class="ltr">MD120 = 120.0</span>`,true,'100.0 × 0.8 = 80.0 و 100.0 × 1.2 = 120.0.']]}},
    {title:'حرّك المدخلين وتابع القيم في الشبكات',widget:(el,B)=>{
      el.innerHTML=`<label class="w-sl"><span>جهد المقاومة R <span class="ltr"><b data-o="v"></b> v</span></span><input type="range" data-k="v" min="0" max="10" step="0.1" value="5" dir="ltr"></label>
       <label class="w-sl"><span>حرارة الثرموكبل <span class="ltr"><b data-o="t"></b> °C</span></span><input type="range" data-k="t" min="0" max="100" step="0.5" value="25" dir="ltr"></label>
       <p class="sub" style="margin:4px 0 0">القيم الخضراء تحت كل مدخل ومخرج تتغير مع المدخلين.</p><div data-o="n"></div>`;
      const g=k=>+el.querySelector(`[data-k="${k}"]`).value,o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{o('v').textContent=g('v').toFixed(1);o('t').textContent=g('t').toFixed(1);o('n').innerHTML=mathNets(chain(g('v'),g('t')))};
      el.querySelectorAll('input').forEach(i=>i.oninput=draw);draw();
    }},
    {watch:String.raw`<p>عنوان <span class="ltr">Network 5</span> «<span class="ltr">80% And 120% of <b>Actual</b> Value</span>»، لكن الحساب على <span class="ltr">MD100</span> وهي القيمة <b>المطلوبة</b> <span class="ltr">(Set Value)</span>، وهذا المتفق مع خطوات العمل. كذلك يُستخدم <span class="ltr">MD10</span> مرتين: ناتجاً وسيطاً في <span class="ltr">Network 2</span> ثم يُكتب فوقه في <span class="ltr">Network 3</span> (لا يضر لأن <span class="ltr">Network 2</span> استهلكه قبلها). والإملاء «<span class="ltr">Temprature</span>» و«<span class="ltr">Scalling</span>» كما في الكتاب.</p>`,fix:true}
   ]},

  {st:5,short:'الشبكتان 6 و 7',title:'الشبكتان 6 و 7: التخزين والإلغاء بالمقارنات',ref:'ص 105',
   q:'المقارنة تعطي 1 لحظة نزول الحرارة إلى 80٪ فقط… فما الذي يُبقي السخان يعمل بعد أن ترتفع الحرارة فوقها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="Network 6: I0.1 مع مقارن أقل من أو يساوي يثبت Q4.0 و Q4.1. Network 7: I0.0 أو مقارن أكبر من يلغي Q4.0 و Q4.1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="20" y1="24" x2="20" y2="296" stroke="#2C4A40" stroke-width="3"/><text x="28" y="34" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 6 : Start Heating</text><path d="M20 72 H50 M62 72 H86 M152 72 H200 M200 72 V112 M200 72 H230 M200 112 H230" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="تلامس مفتوح ⟦I0.1⟧ ⟦(Start S1)⟧: يمرر المسار ما دام ⟦S1⟧ مضغوطاً."><rect x="44" y="50" width="24" height="54" fill="transparent"/><path d="M50 60 V84 M62 60 V84" stroke="#2C4A40" stroke-width="2.5"/><text x="56" y="54" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.1</text><text x="56" y="98" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">S1</text></g><g data-tip="مقارن ⟦CMP &lt;=R⟧: يعطي ⟦1⟧ إذا كانت ⟦IN1 = MD200⟧ (الفعلية) أقل من أو تساوي ⟦IN2 = MD80⟧ (80% من المطلوبة)."><rect x="86" y="50" width="66" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="119" y="64" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">CMP &lt;=R</text><text x="119" y="77" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">MD200</text><text x="119" y="89" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">MD80</text></g><g data-tip="ملف تثبيت ⟦(S)⟧ للسخان ⟦Q4.0 K1⟧: إذا وصله التيار ولو لحظة يبقى ⟦1⟧ حتى يلغيه ملف ⟦(R)⟧."><path d="M236 62 a12 12 0 0 0 0 20 M252 62 a12 12 0 0 1 0 20" fill="none" stroke="#12855A" stroke-width="2.5"/><text x="244" y="77" text-anchor="middle" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)">S</text><text x="244" y="56" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.0</text><text x="262" y="76" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Heater K1</text></g><g data-tip="ملف تثبيت ⟦(S)⟧ لمصباح البيان ⟦Q4.1 H1⟧."><path d="M236 102 a12 12 0 0 0 0 20 M252 102 a12 12 0 0 1 0 20" fill="none" stroke="#12855A" stroke-width="2.5"/><text x="244" y="117" text-anchor="middle" font-size="11" fill="#12855A" font-weight="700" font-family="var(--mono)">S</text><text x="244" y="98" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><text x="262" y="116" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Lamp H1</text></g><line x1="20" y1="146" x2="340" y2="146" stroke="#2C4A40" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/><text x="28" y="164" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Network 7 : End Heating</text><path d="M20 196 H50 M62 196 H160 M20 250 H40 M106 250 H160 V196 M160 196 H200 M200 196 V236 M200 196 H230 M200 236 H230" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="تلامس مفتوح ⟦I0.0⟧ ⟦(stop S0)⟧: الضغط على ⟦S0⟧ يلغي السخان والمصباح."><rect x="44" y="174" width="24" height="54" fill="transparent"/><path d="M50 184 V208 M62 184 V208" stroke="#2C4A40" stroke-width="2.5"/><text x="56" y="178" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I0.0</text><text x="56" y="222" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">S0</text></g><g data-tip="مقارن ⟦CMP &gt;R⟧ على التوازي مع ⟦S0⟧: يعطي ⟦1⟧ إذا كانت ⟦MD200⟧ أكبر من ⟦MD120⟧ (120% من المطلوبة)."><rect x="40" y="228" width="66" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="73" y="242" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">CMP &gt;R</text><text x="73" y="255" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">MD200</text><text x="73" y="267" text-anchor="middle" font-size="9.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">MD120</text></g><g data-tip="ملفا إلغاء ⟦(R)⟧: يجعلان ⟦Q4.0⟧ و⟦Q4.1⟧ صفراً، فيتوقف السخان وينطفئ المصباح."><path d="M236 186 a12 12 0 0 0 0 20 M252 186 a12 12 0 0 1 0 20 M236 226 a12 12 0 0 0 0 20 M252 226 a12 12 0 0 1 0 20" fill="none" stroke="#E8735A" stroke-width="2.5"/><text x="244" y="201" text-anchor="middle" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)">R</text><text x="244" y="241" text-anchor="middle" font-size="11" fill="#E8735A" font-weight="700" font-family="var(--mono)">R</text><text x="244" y="180" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.0</text><text x="244" y="222" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text></g><text x="180" y="300" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">التثبيت يشغّل، والإلغاء يوقف</text></svg>`,
   cap:'رسم مبسّط للشبكتين 6 و 7: ملفا التثبيت <span class="ltr">(S)</span> بالأخضر وملفا الإلغاء <span class="ltr">(R)</span> بالبرتقالي.<br><b>مرّر المؤشر على التلامسات والمقارنات والملفات (أو المسها في الجوال) لتعرف وظيفة كل منها.</b>',
   side:[
    {book:String.raw`<div class="tablebox" style="direction:ltr"><table class="tt" style="font-size:12.5px;text-align:left"><tbody>
     <tr><td><b>Network 6 : Start Heating</b><br>I0.1 Start "S1" — CMP &lt;=R (IN1 = MD200, IN2 = MD80) → (S) Q4.0 Heater "K1" , (S) Q4.1 Heater Lamp "H1"</td></tr>
     <tr><td><b>Network 7 : End Heating</b><br>[ I0.0 stop "S0" | CMP &gt;R (IN1 = MD200, IN2 = MD120) ] → (R) Q4.0 Heater "K1" , (R) Q4.1 Heater Lamp "H1"</td></tr></tbody></table></div>`,ref:'ص 105'}
   ],
   body:[
    {tip:String.raw`<p>المقارن <span class="ltr">&lt;=R</span> يعطي <span class="ltr">1</span> ما دامت الحرارة تحت <span class="ltr">MD80</span> فقط؛ فإذا ارتفعت فوقها صار <span class="ltr">0</span>. لو كان الملف عادياً لتوقف السخان فوراً. لكن الملف <span class="ltr">(S)</span> «يحفظ» التشغيل، فيبقى السخان يعمل حتى يأتي أمر الإلغاء <span class="ltr">(R)</span> من <span class="ltr">Network 7</span>: إما ضغط <span class="ltr">S0</span> أو تجاوز <span class="ltr">MD120</span>. هذا هو «التخزين مع الإلغاء والإبقاء».</p>`,title:'دور التثبيت والإلغاء'},
    {predict:{q:'السخان يعمل، والحرارة ارتفعت إلى منتصف المسافة بين 80٪ و 120٪. ماذا يحدث له؟',opts:[
     [String.raw`يبقى يعمل، لأن <span class="ltr">(S)</span> ثبّته ولم يأتِ بعد شرط الإلغاء`,true,'المقارن الأول صار 0، لكن الملف المثبّت لا يتأثر بذلك؛ ينتظر Network 7.'],
     [String.raw`يتوقف، لأن شرط <span class="ltr">&lt;=R</span> لم يعد متحققاً`,false,'هذا يحدث مع ملف عادي (=)، لا مع ملف تثبيت (S).'],
     ['يعمل ويتوقف بسرعة متكررة',false,'المسافة بين الحدين والتثبيت هما بالضبط ما يمنع ذلك.']]}},
    {watch:String.raw`<p><b>سلوك يختلف عن خطوات العمل (يغيّر عمل البرنامج):</b> شرط التشغيل في <span class="ltr">Network 6</span> هو <b><span class="ltr">S1</span> مضغوط و</b> الحرارة ≤ <span class="ltr">80%</span>. و<span class="ltr">S1</span> «ضاغط» حسب الجدول. فبعد أن يفصل السخان عند تجاوز <span class="ltr">120%</span> لن يعود للعمل تلقائياً عندما تنخفض الحرارة إلى <span class="ltr">80%</span> إلا إذا ضُغط <span class="ltr">S1</span> مرة أخرى في تلك اللحظة، بينما الخطوتان 5 و 6 تصفان تشغيلاً وإيقافاً تلقائياً (حاكم ذو موضعين). <b>المصحح</b> في المختبر يضيف علامة <span class="ltr">M0.0</span> يثبتها <span class="ltr">S1</span> ويلغيها <span class="ltr">S0</span>، وتحل محل <span class="ltr">I0.1</span> في <span class="ltr">Network 6</span>. بدّل بين النسختين في المختبر.</p>`,fix:true},
    {title:'مختبر مصغّر: الشبكتان 6 و 7 مع الزمن',widget:(el,B)=>{let q=0;
      return DCML.lab(el,B,{intro:'السخان هنا يتذكّر حالته بين حركة وأخرى، كما في الـ <span class="ltr">PLC</span>. اضبط الحرارة المطلوبة بالمقاومة <span class="ltr">R</span>، ثم غيّر الحرارة الفعلية واضغط الضاغطين، وتابع ما يحدث للسخان (نسخة الكتاب).',
      predict:{q:String.raw`فصل السخان لأن الحرارة تجاوزت <span class="ltr">120٪</span>. ثم بردت الغرفة إلى ما تحت <span class="ltr">80٪</span>، و <span class="ltr">S1</span> متروك. هل يعود السخان للعمل وحده؟`,opts:[
       [String.raw`نعم، لأن المقارن <span class="ltr">&lt;=R</span> صار <span class="ltr">1</span>`,false,String.raw`المقارن وحده لا يكفي في <span class="ltr">Network 6</span>؛ هو على التوالي مع <span class="ltr">S1</span>.`],
       [String.raw`لا، يبقى متوقفاً حتى يُضغط <span class="ltr">S1</span> والحرارة تحت <span class="ltr">80٪</span>`,true,String.raw`شرط التثبيت في <span class="ltr">Network 6</span> هو <span class="ltr">S1</span> مضغوط <b>و</b> الحرارة ≤ <span class="ltr">80٪</span>. لهذا أضافت النسخة المصححة في المختبر العلامة <span class="ltr">M0.0</span>.`],
       [String.raw`يعمل ويتوقف بسرعة متكررة`,false,String.raw`بين <span class="ltr">80٪</span> و <span class="ltr">120٪</span> لا يتحقق شرط التثبيت ولا شرط الإلغاء، فلا تتكرر الحركة.`]]},
      ins:[{k:'vr',l:'جهد المقاومة R ← الحرارة المطلوبة MD100',min:1,max:10,step:0.5,v:5,u:'v',dp:1},
       {k:'t',l:'الحرارة الفعلية MD200',min:0,max:100,step:1,v:30,u:'°C'},
       {k:'s1',l:'S1',sw:true,v:0,on:'S1 مضغوط <span class="ltr">(I0.1 = 1)</span>',off:'S1 متروك <span class="ltr">(I0.1 = 0)</span>'},
       {k:'s0',l:'S0',sw:true,v:0,on:'S0 مضغوط <span class="ltr">(I0.0 = 1)</span>',off:'S0 متروك <span class="ltr">(I0.0 = 0)</span>'}],
      calc:s=>{const c=chain(s.vr,s.t),lo=s.t<=c.md80,hi=s.t>c.md120,n6=s.s1&&lo,n7=s.s0||hi,was=q;if(n6)q=1;if(n7)q=0;
       const msg=n6&&n7?'شرط التثبيت وشرط الإلغاء معاً: <span class="ltr">Network 7</span> تأتي بعد <span class="ltr">Network 6</span>، فالكلمة الأخيرة للإلغاء.'
        :n6?'<span class="ltr">S1</span> مضغوط <b>و</b> الحرارة ≤ <span class="ltr">MD80</span>: ثُبّت السخان والمصباح بالملف <span class="ltr">(S)</span>.'
        :n7?(s.s0?'<span class="ltr">S0</span> مضغوط: أُلغي السخان والمصباح بالملف <span class="ltr">(R)</span>.':'الحرارة تجاوزت <span class="ltr">MD120</span>: أُلغي السخان والمصباح بالملف <span class="ltr">(R)</span>.')
        :q?'لا شرط تثبيت ولا شرط إلغاء الآن، فيبقى السخان <b>يعمل</b>: الملف <span class="ltr">(S)</span> حفظ التشغيل. ارفع الحرارة فوق <span class="ltr">MD120</span> لترى الإلغاء.'
        :lo?'الحرارة تحت <span class="ltr">MD80</span> لكن <span class="ltr">S1</span> متروك: في نسخة الكتاب لا يعود السخان إلا بضغط <span class="ltr">S1</span>.'
        :'لا شرط تثبيت ولا شرط إلغاء الآن، فيبقى السخان على حاله: <b>متوقف</b>.';
       return {facts:[['MD100 المطلوبة',fnum(c.md100,1)+' °C'],['<bdi class="ltr">MD80 (80%)</bdi>',fnum(c.md80,1)+' °C'],['<bdi class="ltr">MD120 (120%)</bdi>',fnum(c.md120,1)+' °C'],['MD200 ≤ MD80',lo?'1':'0',lo?'hi':''],['MD200 > MD120',hi?'1':'0',hi?'bad':''],['K1 و H1',q?'يعملان':'متوقفان',q?'hi':'']],
        bars:[{l:'الحرارة الفعلية MD200',v:s.t,max:100,u:'°C',col:q?'--stop':'--blue'}],msg,cls:n6&&n7?'warn':''}}})}}
   ]},

  {st:6,short:'والمطلوب',title:'والمطلوب',ref:'ص 105',
   q:'البرنامج على الورق لا يسخّن غرفة… ما الذي بقي لتنفيذه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث خطوات: كتابة البرنامج على الحاسب ثم نقله إلى الـ PLC ثم اختبار الدائرة، وبعدها إعادة الكتابة بلغتي FBD و STL" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g><rect x="60" y="34" width="240" height="44" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="56" r="13" fill="#2C4A40"/><text x="278" y="61" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">1</text><text x="250" y="61" text-anchor="start" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">التنفيذ على الحاسب الآلي</text></g><g><rect x="60" y="90" width="240" height="44" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="112" r="13" fill="#2C4A40"/><text x="278" y="117" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">2</text><text x="250" y="117" text-anchor="start" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">النقل إلى وحدة الـ PLC</text></g><g><rect x="60" y="146" width="240" height="44" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="278" cy="168" r="13" fill="#2C4A40"/><text x="278" y="173" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">3</text><text x="250" y="173" text-anchor="start" direction="rtl" font-size="13" fill="#2C4A40" font-weight="700">اختبار صحة عمل الدائرة</text></g><text x="180" y="224" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ثم إعادة الكتابة بلغتين</text><g data-tip="مخطط البوابات المنطقية ⟦FBD⟧: الصناديق نفسها ⟦(I_DI، DIV_R، CMP…)⟧ تُرسم بلوكات، والتثبيت والإلغاء بلوك ⟦SR⟧ أو ملفا ⟦S⟧ و⟦R⟧."><rect x="194" y="238" width="96" height="46" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="242" y="268" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">FBD</text></g><g data-tip="قائمة الإجراءات ⟦STL⟧: نسخة الكتاب منها في الدرس 5.4 (ص 106)."><rect x="70" y="238" width="96" height="46" rx="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="118" y="268" text-anchor="middle" font-size="17" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">STL</text></g></svg>`,
   cap:'المطلوب الأول: ثلاث خطوات على الجهاز. والمطلوب الثاني: البرنامج نفسه بلغتين أخريين.<br><b>مرّر المؤشر على بطاقتي اللغتين (أو المسهما في الجوال) لتعرف أين تجدهما.</b>',
   side:[
    {book:String.raw`<ol><li>تنفيذ التمرين السابق على جهاز الحاسب الآلي. ثم نقله إلى وحدة <span class="ltr">(PLC)</span>. مع اختبار صحة عمل الدائرة.</li><li>إعادة كتابة البرنامج السابق باستخدام لغة <span class="ltr">FBD</span> ولغة <span class="ltr">STL</span>.</li></ol>`,ref:'ص 105'}
   ],
   body:[
    {predict:{q:'عند اختبار الدائرة على الجهاز، أيّ تجربة تتأكد بها من حد الإيقاف؟',opts:[
     ['اضغط S0 وانظر هل يتوقف السخان',false,'هذا يختبر الإيقاف اليدوي (Network 7، الفرع الأول)، لا حد 120٪.'],
     [String.raw`سخّن حتى تتجاوز الحرارة <span class="ltr">MD120</span> وانظر هل يفصل السخان وحده`,true,'هذا يختبر المقارن CMP >R في Network 7.'],
     ['غيّر المقاومة R إلى الصفر',false,'هذا يجعل الحرارة المطلوبة صفراً؛ لا يختبر حد الإيقاف مباشرة.']]}},
    {tip:String.raw`<p>جرّب البرنامج في تبويب «المختبر» قبل الجهاز الحقيقي: اضغط <span class="ltr">S1</span> وراقب منحنى الحرارة بين الخطين، ثم بدّل إلى النسخة «المصححة» ولاحظ الفرق. وستجد نسخة الكتاب بلغة <span class="ltr">STL</span> في الدرس التالي.</p>`,title:'قبل الجهاز'},
    {title:'مختبر مصغّر: ماذا لو تخطّيت خطوة؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'كتبت البرنامج على الحاسب، وتخطّيت نقله إلى وحدة الـ <span class="ltr">PLC</span>. ماذا يحدث عند اختبار الدائرة؟',opts:[
      ['الوحدة لا تنفّذ برنامجك؛ فهو موجود على الحاسب فقط',true,'الكتاب يطلب التنفيذ على الحاسب <b>ثم</b> النقل إلى وحدة الـ <span class="ltr">PLC</span>.'],
      ['يعمل البرنامج لأن الحاسب موصول بالوحدة',false,'وجود الكابل لا يكفي؛ يجب نقل البرنامج إلى الوحدة.']]},
     {q:'اختبرت <span class="ltr">S1</span> و <span class="ltr">S0</span> فقط، ولم تترك الحرارة تتجاوز <span class="ltr">MD120</span>. ماذا فاتك؟',opts:[
      ['لا شيء؛ اختبار <span class="ltr">S0</span> يكفي للإيقاف',false,'<span class="ltr">S0</span> طريق واحد من طريقي الإلغاء في <span class="ltr">Network 7</span>؛ المقارن <span class="ltr">&gt;R</span> طريق آخر قد يكون فيه خطأ.'],
      ['لن تعرف هل يفصل السخان وحده عند <span class="ltr">120٪</span>',true,'هذا قلب الحاكم ذي الموضعين، ولا يُختبر إلا بتجاوز الحرارة حد الإيقاف.']]},
     {q:'نجح اختبار برنامج <span class="ltr">LAD</span>، وتخطّيت إعادة كتابته بلغتي <span class="ltr">FBD</span> و <span class="ltr">STL</span>. هل أكملت المطلوب؟',opts:[
      ['نعم، لغة واحدة تكفي',false,'المطلوب في الكتاب ينص على إعادة كتابة البرنامج بلغتي <span class="ltr">FBD</span> و <span class="ltr">STL</span>.'],
      ['لا، بقيت إعادة كتابته بلغتي <span class="ltr">FBD</span> و <span class="ltr">STL</span>',true,'هذا الجزء الأخير من المطلوب.']]}]})}
   ]},

  {recap:[
   String.raw`الحرارة المطلوبة: <span class="ltr">PIW288</span> ← <span class="ltr">I_DI</span> ← <span class="ltr">DI_R</span> ← <span class="ltr">÷ 27648.0</span> ← <span class="ltr">× 100.0</span> ← <span class="ltr">MD100</span> (من <span class="ltr">0</span> إلى <span class="ltr">100</span> درجة) (ص 103–104).`,
   String.raw`الحرارة الفعلية: <span class="ltr">PIW290</span> ← <span class="ltr">I_DI</span> ← <span class="ltr">DI_R</span> ← <span class="ltr">÷ 10.0</span> ← <span class="ltr">MD200</span> (ص 103–104).`,
   String.raw`الحدّان من الحرارة المطلوبة: <span class="ltr">MD80 = MD100 × 0.8</span> و<span class="ltr">MD120 = MD100 × 1.2</span> (Network 5).`,
   String.raw`Network 6: <span class="ltr">S1</span> و<span class="ltr">MD200 &lt;= MD80</span> ← تثبيت <span class="ltr">(S)</span> للسخان والمصباح. Network 7: <span class="ltr">S0</span> أو <span class="ltr">MD200 &gt; MD120</span> ← إلغاء <span class="ltr">(R)</span> (ص 105).`,
   'المطلوب: تنفيذ البرنامج واختباره على الـ PLC، ثم إعادة كتابته بلغتي FBD و STL (ص 105).']}
],
 theory:[
  {h:'خطوات عمل البرنامج',ref:'ص 103',html:`<ol><li>للتعبير عن درجة الحرارة المطلوبة بالقيمة العشرية يُحوَّل الرقم من Integer إلى Double Integer بالدالة <b>I_DI</b> ثم إلى Real بالدالة <b>DI_R</b> وتمريرها داخل العنوان LD0.</li>
   <li>ثم تُعايَر درجة الحرارة المطلوبة بحيث: <span class="ltr">0 v = 0 = 0°C</span> و <span class="ltr">10 v = 27648 = 100°C</span>، بدالة القسمة <b>DIV_R</b> على <span class="ltr">27648.0</span> ثم الضرب <b>MUL_R</b> في <span class="ltr">100.0</span> (أقصى درجة حرارة مطلوبة) وتمرر القيمة في <b>MD100</b>.</li>
   <li>للتعبير عن درجة الحرارة الفعلية: I_DI ثم DI_R ثم القسمة على <span class="ltr">10.0</span> وتمريرها في <b>MD200</b>.</li>
   <li>تستخدم دالة المقارنة للمقارنة بين الحرارة الفعلية والمطلوبة.</li>
   <li>يعمل متمم السخان <b>Q4.0</b> إذا كانت الحرارة الفعلية أقل من <b>80٪</b> من الحرارة المطلوبة.</li>
   <li>ويتوقف السخان إذا كانت الحرارة الفعلية أكبر من <b>120٪</b> من الحرارة المطلوبة.</li></ol>
   <p><b>ملاحظة من الكتاب:</b> قبل البدء في تنفيذ الدائرة على (PLC) يجب مراجعة الكتالوج الخاص بالوحدة وتحديد المداخل والمخارج الرقمية والتناظرية وترقيمها حسب المتوفر في المختبر والبلوكات.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مثال: R على 5 v ← PIW288 = 13824 ← 13824 ÷ 27648 × 100 = <b>50°C</b> مطلوبة. فيعمل السخان عندما تنزل الحرارة إلى 40°C (80٪) ويتوقف عندما تتجاوز 60°C (120٪). المسافة بين الحدين تمنع تشغيل السخان وإيقافه بسرعة.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الخطوة 1 تقول القيمة الحقيقية تُمرَّر في <b>LD0</b>، لكن في البرنامج LD0 هو ناتج I_DI (عدد صحيح مزدوج) والقيمة الحقيقية تذهب إلى <b>MD0</b>. والخطوة 4 مكتوبة «≤CMP» والخطوة 5 تقول «أقل من 80٪» بينما البرنامج يستخدم <span class="ltr">CMP &lt;=R</span> (أقل من <b>أو يساوي</b>).'+'</div>'},
  {h:'ثانياً: برنامج LAD — الشبكات 1–5 (تحويل ومعايرة)',ref:'ص 104',html:'<p>كل شبكة فيها صناديق حسابية موصولة EN ← ENO. القيم الخضراء مثال (R على 5 v والغرفة 25°C):</p>'},
  {fig:'',ref:'ص 104',caption:'Network 1–5 بلغة LAD (معاد رسمها)',draw:()=>mathNets(chain(5,25))},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوان Network 5 «80% And 120% of <b>Actual</b> Value»، لكن الحساب على <b>MD100</b> وهي القيمة <b>المطلوبة</b> (Set Value)، وهذا المتفق مع خطوات العمل. كذلك يُستخدم MD10 مرتين: ناتجاً وسيطاً في Network 2 ثم يُكتب فوقه في Network 3 (لا يضر لأن Network 2 استهلكه قبلها). والإملاء «Temprature» و «Scalling» كما في الكتاب.'+'</div>'},
  {h:'الشبكتان 6 و 7 (التخزين والإلغاء بالمقارنات)',ref:'ص 105',html:'<ul><li><b>Network 6 : Start Heating</b> — I0.1 (Start "S1") على التوالي مع مقارن <span class="ltr">CMP &lt;=R</span> (IN1 = MD200، IN2 = MD80) ← ملفا <b>(S)</b> للمخرجين Q4.0 Heater "K1" و Q4.1 Heater Lamp "H1".</li><li><b>Network 7 : End Heating</b> — [ I0.0 (stop "S0") ∥ <span class="ltr">CMP &gt;R</span> (IN1 = MD200، IN2 = MD120) ] ← ملفا <b>(R)</b> للمخرجين Q4.0 و Q4.1.</li></ul>'},
  {draw:'lad',caption:'Network 6–7 بلغة LAD (النسخة المختارة حالياً)',ref:'ص 105'},
  {note:'المحاكي يرسم الشبكتين من STL مكافئ (الكتاب أعطاهما بلغة LAD فقط): <span class="ltr">L MD 200 / L MD 80 / &lt;=R</span> هو صندوق المقارنة نفسه.'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>سلوك يختلف عن خطوات العمل (يغيّر عمل البرنامج):</b> شرط التشغيل في Network 6 هو <b>S1 مضغوط و</b> الحرارة ≤ 80٪. و S1 «ضاغط» حسب الجدول. فبعد أن يفصل السخان عند تجاوز 120٪ لن يعود للعمل تلقائياً عندما تنخفض الحرارة إلى 80٪ إلا إذا ضُغط S1 مرة أخرى في تلك اللحظة، بينما الخطوتان 5 و 6 تصفان تشغيلاً وإيقافاً تلقائياً (حاكم ذو موضعين). <b>المصحح</b> يضيف علامة M0.0 يثبتها S1 ويلغيها S0، وتحل محل I0.1 في Network 6. بدّل بين النسختين في المختبر.'+'</div>'},
  {h:'والمطلوب',ref:'ص 105',html:'<ol><li>تنفيذ التمرين السابق على جهاز الحاسب الآلي ثم نقله إلى وحدة (PLC) مع اختبار صحة عمل الدائرة.</li><li>إعادة كتابة البرنامج السابق باستخدام لغة FBD ولغة STL (انظر الدرس 5.4).</li></ol>'}
 ],
 io:[
  {sym:'R',desc:'مقاومة متغيرة 0–10 v DC لإدخال الحرارة المطلوبة (قراءة 0–27648)',addr:'PIW288'},
  {sym:'TC',desc:'حساس درجة الحرارة ثرموكبل نوع K (القراءة = الحرارة × 10)',addr:'PIW290'},
  {sym:'S1',desc:'ضاغط التشغيل لبدء التسخين (العنوان حسب الشكل والبرنامج)',addr:'I0.1'},
  {sym:'S0',desc:'ضاغط الفصل لإنهاء التسخين (العنوان حسب الشكل والبرنامج)',addr:'I0.0'},
  {sym:'K1',desc:'متمم تشغيل السخان',addr:'Q4.0'},
  {sym:'H1',desc:'مصباح بيان عمل السخان',addr:'Q4.1'}
 ],
 inputs:[
  {id:'S0',addr:'I0.0',type:'push',color:'red',label:'Stop Heating'},
  {id:'S1',addr:'I0.1',type:'push',color:'green',label:'Heat enable'}
 ],
 variants:{default:'book',note:'<span class="fixnote">Network 6 في الكتاب يشترط أن يكون S1 مضغوطاً لحظة نزول الحرارة إلى 80٪. المصحح يحفظ أمر التشغيل في M0.0.</span>',
  book:{label:'كما في الكتاب',program:[N6('I'),N7],note:'كما في الكتاب (ص 105): <span class="ltr">I0.1 AND MD200 &lt;= MD80</span>. بعد أول إيقاف عند 120٪ لا يعود السخان للعمل وحده.'},
  fixed:{label:'المصحح',program:[NM,N6('M'),N7],note:'<span class="fixnote">المصحح: أضيفت شبكة تحفظ أمر S1 في M0.0 (يلغيها S0)، و Network 6 تستخدم M0.0 بدل I0.1. يعمل الحاكم ذو الموضعين تلقائياً بين 80٪ و 120٪.</span>'}},
 power:st=>fig15({S1:st.btn('S1'),S0:st.btn('S0'),T:st.plant.T,V:st.plant.V,Q40:st.Q('Q4.0'),Q41:st.Q('Q4.1')}),powerRef:'الشكل (1-5) ص 100',
 plant:heatPlant(),
 plcNote:'قيم MD200 و MD80 و MD120 تحسبها الشبكات 1–5 (عمليات أعداد حقيقية تُعرض في الشرح وفي لوحة الغرفة)، ثم تقارنها الشبكتان 6 و 7 هنا. عمود «الحالة» للمدخلين التناظريين PIW288 و PIW290 لا معنى له (هما أرقام وليسا بتات).',
 steps:[
  {t:'الوضع الابتدائي',x:'R على 5 v ← المطلوبة 50°C، فحد التشغيل 40°C وحد الإيقاف 60°C. الغرفة 25°C والسخان متوقف. النسخة «كما في الكتاب».'},
  {t:'ابدأ التسخين',x:'اضغط S1. الحرارة 25°C ≤ 40°C، فيُثبَّت Q4.0 و Q4.1: يعمل السخان ويضيء H1.',done:s=>s.Q('Q4.0')},
  {t:'الإيقاف عند 120٪',x:'انتظر. تبقى الحرارة ترتفع (السخان مثبّت) حتى تتجاوز 60°C فيلغي Network 7 السخان والمصباح.',done:s=>s.plant.offs>=1&&!s.Q('Q4.0')},
  {t:'لاحظ مشكلة نسخة الكتاب',x:'الحرارة تنخفض تحت 40°C والسخان لا يعود! السبب أن Network 6 يحتاج S1 مضغوطاً. (في المصحح لن يحدث هذا.)',done:s=>s.variant!=='fixed'&&s.plant.T<39&&!s.Q('Q4.0')},
  {t:'بدّل إلى المصحح',x:'اختر «المصحح». يُعاد تشغيل الـ PLC والغرفة.',done:s=>s.variant==='fixed'},
  {t:'ضغطة واحدة تكفي',x:'اضغط S1 مرة واحدة. انتظر دورة كاملة: إيقاف عند 60°C ثم عودة تلقائية عند 40°C. شاهد المنحنى بين الخطين الأخضر والأحمر.',done:s=>s.variant==='fixed'&&s.plant.reon>=1},
  {t:'غيّر المطلوب والجو',x:'حرّك المقاومة R (مثلاً 7 v = 70°C) أو اخفض حرارة الجو، وراقب تحرك الحدين وتغير سرعة التسخين والتبريد. يمكنك أيضاً تفعيل «تحريك الحرارة يدوياً».'},
  {t:'أوقف التسخين',x:'اضغط S0. يُلغى السخان والمصباح (و M0.0 في المصحح).',done:s=>!s.Q('Q4.0')&&!s.Q('Q4.1')&&!s.btn('S0')&&s.plant.H===0&&s.plant.offs>=1&&!s.M('M0.0')}
 ],
 quiz:[
  {q:'ما الدالة التي تحول العدد الصحيح Integer إلى Double Integer؟',o:['DI_R','I_DI','DIV_R','MUL_R'],c:1,e:'I_DI = Integer to Double Integer، ثم DI_R = Double Integer to Real.'},
  {q:'كيف تُعاير الحرارة المطلوبة من قراءة R؟',o:['تقسم على 10','تقسم على 27648 ثم تضرب في 100','تضرب في 27648','تجمع 100'],c:1,e:'DIV_R على 27648.0 ثم MUL_R في 100.0 (أقصى حرارة مطلوبة) ← MD100.'},
  {q:'كيف تُحسب الحرارة الفعلية MD200 من الثرموكبل في برنامج LAD؟',o:['قراءة PIW290 ÷ 10','قراءة PIW290 × 10','قراءة PIW288 ÷ 27648','قراءة PIW290 × 100'],c:0,e:'لأن قراءة الثرموكبل = الحرارة × 10.'},
  {q:'الحرارة المطلوبة 50°C. متى يعمل السخان؟',o:['عند 50°C','عند 40°C أو أقل (80٪)','عند 60°C','دائماً'],c:1,e:'MD80 = 0.8 × 50 = 40. و Network 6 تستخدم <=R.'},
  {q:'الحرارة المطلوبة 50°C. متى يتوقف السخان تلقائياً؟',o:['عند تجاوز 50°C','عند تجاوز 60°C (120٪)','عند 40°C','لا يتوقف'],c:1,e:'MD120 = 1.2 × 50 = 60، و Network 7 تستخدم &gt;R.'},
  {q:'ما نوع الملفات Q4.0 و Q4.1 في Network 6؟',o:['ملفات عادية =','ملفات تثبيت (S)','ملفات إلغاء (R)','مزمنات'],c:1,e:'(S) في Network 6 للتشغيل و (R) في Network 7 للإيقاف: دالة التخزين والإلغاء.'},
  {q:'في نسخة الكتاب، لماذا لا يعود السخان للعمل بعد أول إيقاف؟',o:['لأن الثرموكبل تعطل','لأن Network 6 يشترط أن يكون S1 مضغوطاً (I0.1)','لأن MD80 صفر','لأن Q4.1 مثبت'],c:1,e:'الشرط I0.1 AND (MD200 ≤ MD80). الحل: حفظ أمر التشغيل في علامة (المصحح).'},
  {q:'ما الخطأ في عنوان Network 5؟',o:['يقول Actual Value والحساب على القيمة المطلوبة MD100','يقول 90٪','لا يوجد','الأرقام معكوسة'],c:0,e:'80٪ و 120٪ من الحرارة المطلوبة حسب خطوات العمل.'}
 ]
});

/* =================== Lesson 5.4 =================== */
const STL_BOOK=['Network1:','L      PIW  290','ITD','DTR','L      2.764800e+004','/R','L      1.000000e+002','*R','T      MD   200','L      MD   200','L      PIW  288','ITD','DTR','L      2.764800e+004','/R','L      1.000000e+002','*R','T      MD   100','L      MD   100','L      8.000000e-001','*R','T      MD   80','L      MD   200','L      MD   80','','<=R','S      Q    4.0','L      MD   100','L      1.200000e+000','','*R','','T      MD   120','L      MD   200','','L      MD   120','>R','R      Q    4.0'].map(l=>({l}));
const STL_FIX=(()=>{const out=[];STL_BOOK.forEach(o=>{if(o.l==='Network1:'){out.push(o);['A      I    0.1','S      M    0.0','A      I    0.0','R      M    0.0'].forEach(l=>out.push({l,add:1}));return}
  out.push(o);if(o.l==='<=R')out.push({l:'A      M    0.0',add:1});if(o.l==='S      Q    4.0')out.push({l:'S      Q    4.1',add:1});if(o.l==='>R')out.push({l:'ON     M    0.0',add:1});if(o.l==='R      Q    4.0')out.push({l:'R      Q    4.1',add:1})});return out})();
function stlExec(line,S){const raw=line.trim();if(!raw||/^Network/i.test(raw))return null;const p=raw.split(/\s+/),op=p[0].toUpperCase(),arg=p.slice(1).join('').toUpperCase();let shows=false;
  if(op==='L'){let v,ty;if(/^PIW\d+$/.test(arg)){v=S.words[arg]||0;ty='INT'}else if(/^MD\d+$/.test(arg)){v=S.words[arg]||0;ty='REAL'}else{v=parseFloat(arg);ty='REAL'}S.a2=S.a1;S.t2=S.t1;S.a1=v;S.t1=ty}
  else if(op==='ITD')S.t1='DINT';else if(op==='DTR')S.t1='REAL';
  else if(op==='/R'){S.a1=S.a2/S.a1;S.t1='REAL'}else if(op==='*R'){S.a1=S.a2*S.a1;S.t1='REAL'}
  else if(op==='T')S.words[arg]=S.a1;
  else if(op==='<=R'||op==='>R'){const v=op==='<=R'?S.a2<=S.a1:S.a2>S.a1;S.rlo=S.fc?v:(S.rlo&&v);S.fc=false;shows=true}
  else if(/^(A|AN|O|ON)$/.test(op)){let v=!!S.bits[arg];if(op.length===2)v=!v;S.rlo=S.fc?v:op[0]==='A'?(S.rlo&&v):(S.rlo||v);S.fc=false;shows=true}
  else if(op==='S'||op==='R'){if(S.rlo)S.bits[arg]=op==='S'?1:0;S.fc=true;shows=true}
  return {a1:S.a1,a2:S.a2,t1:S.t1,t2:S.t2,rlo:shows?(S.rlo?1:0):null}}
const fa=(v,t)=>v===undefined?'':t==='REAL'?fnum(v,3):String(Math.round(v));

B.lesson({
 id:'u5-l4',unit:5,order:4,pages:'105–106',
 title:'برنامج STL ومحاكاة الثرموكبل بمقاومة 0–10 v',
 summary:'عندما لا يتوفر الثرموكبل تُمثَّل الحرارة الفعلية بجهد 0–10 v من مقاومة. برنامج STL في ص 106 ينفذ الحساب كله بالمركمين ACCU1 و ACCU2 ثم يثبت السخان ويلغيه بالمقارنة.',
 stations:[
  {intro:true},

  {st:1,short:'محاكاة الثرموكبل',title:'ملاحظة الكتاب: محاكاة الثرموكبل بمقاومة <span class="ltr">0–10 v</span>',ref:'ص 105',
   q:'المختبر ليس فيه ثرموكبل… فهل نتوقف عن التجربة، أم يمكن أن «نمثّل» الحرارة بشيء آخر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثرموكبل غير متوفر، وبدلاً منه مقاومة متغيرة جهدها من 0 إلى 10 فولت على المدخل PIW 290" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الثرموكبل غير متوفر في المختبر: لا نستطيع قياس الحرارة الفعلية الحقيقية."><path d="M48 40 L68 82 M88 40 L68 82" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" opacity=".45"/><circle cx="68" cy="84" r="6" fill="#E8735A" opacity=".45"/><path d="M40 36 L96 92 M96 36 L40 92" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><text x="68" y="114" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">لا يوجد ثرموكبل</text></g><path d="M68 124 V142" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="4 4"/><polygon points="68,150 61,138 75,138" fill="#2C4A40"/><text x="102" y="142" font-size="11" fill="#2C4A40" font-weight="600">بدلاً منه</text><g data-tip="مقاومة متغيرة تحاكي الثرموكبل: جهد منزلقها من ⟦0⟧ إلى ⟦10⟧ فولت يمثل الحرارة الفعلية."><path d="M68 168 V178 M68 268 V280" stroke="#2C4A40" stroke-width="2.5"/><rect x="58" y="178" width="20" height="90" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="68" y="163" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">10 v</text><text x="68" y="296" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 v</text><path d="M220 222 H92" stroke="#2C4A40" stroke-width="2.5"/><polygon points="82,222 96,215 96,229" fill="#2C4A40"/></g><g data-tip="البرنامج ما زال يقرأ الحرارة الفعلية من العنوان ⟦PIW 290⟧، لكن مصدرها الآن جهد المقاومة."><rect x="220" y="176" width="110" height="92" rx="8" fill="#2C4A40"/><text x="275" y="200" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">PLC</text><text x="226" y="226" font-size="11.5" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">PIW 290</text></g><g data-tip="في برنامج ⟦STL⟧ (ص 106) تُقسم القراءة على ⟦27648.0⟧ وتُضرب في ⟦100.0⟧، فيصبح ⟦0⟧ فولت = ⟦0⟧ درجة و⟦10⟧ فولت = ⟦100⟧ درجة."><rect x="196" y="40" width="140" height="92" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="266" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">المقياس في البرنامج</text><text x="266" y="90" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0 v → 0 °C</text><text x="266" y="116" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">10 v → 100 °C</text></g></svg>`,
   cap:'نضع مقاومة متغيرة مكان الثرموكبل، ونحرّكها بأيدينا لنمثّل ارتفاع الحرارة وانخفاضها.<br><b>مرّر المؤشر على الأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>ملاحظة:</b> في حالة عدم توفر حساس درجة الحرارة الثيرموكبل يمكن استخدام مقاومة لمحاكاة عمله بحيث يكون دخل درجة الحرارة الفعلية ممثلاً بجهد من <span class="ltr">0</span> إلى <span class="ltr">10</span> فولت. البرنامج التالي يبين ذلك مكتوباً بلغة قائمة الإجراءات <span class="ltr">STL</span>.</p>`,ref:'ص 105'},
    {predict:{q:String.raw`بهذه الطريقة، جهد <span class="ltr">10 v</span> على مدخل الحرارة الفعلية يعطي كم درجة في <span class="ltr">MD200</span>؟`,opts:[
     [String.raw`<span class="ltr">10</span>`,false,'هذا الجهد نفسه؛ البرنامج يحوّله إلى درجات.'],
     [String.raw`<span class="ltr">100.0</span>`,true,'القراءة 27648 ÷ 27648.0 × 100.0 = 100.0، تماماً مثل الحرارة المطلوبة.'],
     [String.raw`<span class="ltr">2764.8</span>`,false,'هذا ما ينتج لو قسمنا على 10 كما في برنامج LAD؛ هنا المقياس مختلف.']]}}
   ],
   body:[
    {tip:String.raw`<p>المقاومة المتغيرة تعطي جهداً من <span class="ltr">0</span> إلى <span class="ltr">10</span> فولت، والمدخل التناظري يقرؤه رقماً من <span class="ltr">0</span> إلى <span class="ltr">27648</span> — تماماً مثل مقاومة الحرارة المطلوبة <span class="ltr">R</span>. لذلك يعاير البرنامج الحرارتين <b>بالطريقة نفسها</b>: قسمة على <span class="ltr">27648.0</span> ثم ضرب في <span class="ltr">100.0</span>.</p>`,title:'لماذا تتغير المعايرة؟'},
    {add:String.raw`<p>المحاكاة بمقاومة طريقة شائعة في التدريب والصيانة: تختبر البرنامج كله (التحويل، والمقارنة، والتثبيت والإلغاء) دون أن تنتظر الغرفة لتسخن فعلاً؛ تدير المقاومة فتقفز «الحرارة» فوراً إلى القيمة التي تريد.</p>`,title:'فائدة عملية'},
    {title:'مختبر مصغّر: المقاومة بدل الثرموكبل',widget:(el,B)=>DCML.lab(el,B,{intro:'أدر المقاومة التي تمثّل الحرارة الفعلية (<span class="ltr">0–10 v</span>)، وتابع القراءة ثم الحرارة في <span class="ltr">MD200</span> كما يحسبها برنامج <span class="ltr">STL</span>.',
      predict:{q:String.raw`جهد المقاومة <span class="ltr">2.5 v</span>. كم درجة تصبح في <span class="ltr">MD200</span>؟`,opts:[
       [String.raw`<span class="ltr">2.5</span>`,false,String.raw`الجهد لا يُنقل كما هو؛ يُقرأ رقماً ثم يُعاير إلى <span class="ltr">0–100</span>.`],
       [String.raw`<span class="ltr">25.0</span>`,true,String.raw`<span class="ltr">2.5 v</span> ربع المدى، فالقراءة <span class="ltr">6912</span>، ثم ÷ <span class="ltr">27648.0</span> × <span class="ltr">100.0</span> = <span class="ltr">25.0</span>.`],
       [String.raw`<span class="ltr">6912</span>`,false,String.raw`هذه قراءة المدخل قبل المعايرة.`]]},
      ins:[{k:'v',l:'جهد المقاومة على PIW 290',min:0,max:10,step:0.1,v:2.5,u:'v',dp:1}],
      calc:s=>{const piw=Math.round(s.v/10*27648),md=piw/27648*100;
       return {facts:[['PIW 290',String(piw)],['÷ 27648.0',fnum(piw/27648,4)],['× 100.0 ← MD200',fnum(md,2),'hi']],
        bars:[{l:'«الحرارة» MD200',v:md,max:100,u:'°C',dp:1,col:'--live'}],
        msg:'تدير المقاومة فتقفز «الحرارة» فوراً إلى القيمة التي تريد، دون أن تنتظر الغرفة لتسخن. وهذا المقياس <span class="ltr">0–10 v ← 0–100</span> هو نفسه مقياس الحرارة المطلوبة.'}}})}
   ]},

  {st:2,short:'STL: الحرارة الفعلية',title:'دائرة STL (1): حساب الحرارة الفعلية <span class="ltr">MD200</span>',ref:'ص 106',
   q:'لا صناديق ولا أسلاك هنا… فأين «يضع» الـ PLC الأرقام بين سطر وآخر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المركمان ACCU1 و ACCU2: التعليمة L تضع قيمة جديدة في ACCU1 وتنقل القديمة إلى ACCU2، والقسمة والضرب تعمل على الاثنين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="105" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">المركمان</text><g data-tip="المركم الثاني ⟦ACCU2⟧: يستقبل ما كان في ⟦ACCU1⟧ عند كل تحميل جديد ⟦L⟧."><rect x="40" y="70" width="130" height="42" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="96" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU2</text></g><g data-tip="المركم الأول ⟦ACCU1⟧: مكان العمل الرئيسي؛ فيه تُحمَّل القيمة وتظهر نتيجة كل عملية."><rect x="40" y="150" width="130" height="42" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="176" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU1</text></g><path d="M105 150 V122" stroke="#E8735A" stroke-width="3"/><polygon points="105,114 98,126 112,126" fill="#E8735A"/><text x="118" y="138" font-size="11" fill="#2C4A40" font-weight="600">القديم ينتقل</text><g data-tip="⟦L⟧ (تحميل): يضع القيمة الجديدة في ⟦ACCU1⟧، وما كان في ⟦ACCU1⟧ ينتقل إلى ⟦ACCU2⟧."><rect x="214" y="150" width="116" height="42" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="272" y="176" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">L  …</text><path d="M214 171 H186" stroke="#2C4A40" stroke-width="3"/><polygon points="176,171 190,164 190,178" fill="#2C4A40"/></g><g data-tip="⟦/R⟧ و⟦*R⟧: قسمة أو ضرب أعداد حقيقية بين المركمين، والنتيجة في ⟦ACCU1⟧."><rect x="40" y="214" width="290" height="70" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="185" y="242" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">/R : ACCU1 = ACCU2 ÷ ACCU1</text><text x="185" y="268" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">*R : ACCU1 = ACCU2 × ACCU1</text></g><g data-tip="⟦T⟧ (نقل): ينسخ محتوى ⟦ACCU1⟧ إلى عنوان في الذاكرة، مثل ⟦T MD 200⟧."><rect x="214" y="70" width="116" height="42" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="272" y="96" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">T MD 200</text></g><path d="M170 160 L214 104" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 4"/></svg>`,
   cap:'برنامج STL يعمل بمكانين مؤقتين: <span class="ltr">ACCU1</span> و<span class="ltr">ACCU2</span>.<br><b>مرّر المؤشر على المركمين والتعليمات (أو المسها في الجوال) لتعرف عمل كل منها.</b>',
   side:[
    {book:String.raw`<p><b>دائرة <span class="ltr">(STL)</span> باستخدام <span class="ltr">(PLC)</span> باستخدام دالة التخزين مع دالة الإلغاء والإبقاء</b></p>`+'<table class="stl"><tbody>'+STL_BOOK.slice(0,9).map(o=>{const p=o.l.trim().split(/\s+/);return '<tr><td>'+(B.esc(p[0]||'')||'&nbsp;')+'</td><td>'+B.esc(p.slice(1).join(' '))+'</td></tr>'}).join('')+'</tbody></table>',ref:'ص 106'}
   ],
   body:[
    {tip:String.raw`<table class="tt"><thead><tr><th>التعليمة</th><th>ما تفعله</th></tr></thead><tbody>
     <tr><td class="ltr">L PIW 290</td><td>تحميل قراءة المدخل التناظري في <span class="ltr">ACCU1</span> (وما كان في <span class="ltr">ACCU1</span> ينتقل إلى <span class="ltr">ACCU2</span>)</td></tr>
     <tr><td class="ltr">ITD</td><td>تحويل <span class="ltr">ACCU1</span> من <span class="ltr">Integer</span> إلى <span class="ltr">Double Integer</span> (مثل <span class="ltr">I_DI</span>)</td></tr>
     <tr><td class="ltr">DTR</td><td>تحويل <span class="ltr">ACCU1</span> من <span class="ltr">Double Integer</span> إلى <span class="ltr">Real</span> (مثل <span class="ltr">DI_R</span>)</td></tr>
     <tr><td class="ltr">L 2.764800e+004</td><td>تحميل الثابت <span class="ltr">27648.0</span>؛ فتنتقل القراءة إلى <span class="ltr">ACCU2</span></td></tr>
     <tr><td class="ltr">/R ، *R</td><td><span class="ltr">ACCU1 = ACCU2 ÷ ACCU1</span> ، <span class="ltr">ACCU1 = ACCU2 × ACCU1</span></td></tr>
     <tr><td class="ltr">T MD 200</td><td>نقل <span class="ltr">ACCU1</span> إلى العنوان <span class="ltr">MD200</span></td></tr></tbody></table>`,title:'معنى كل سطر'},
    {predict:{q:String.raw`بعد <span class="ltr">L PIW 290</span> و<span class="ltr">ITD</span> و<span class="ltr">DTR</span> جاء السطر <span class="ltr">L 2.764800e+004</span>. أين صارت قراءة <span class="ltr">PIW 290</span>؟`,opts:[
     [String.raw`في <span class="ltr">ACCU1</span>`,false,'ACCU1 فيه الآن الثابت 27648.0 الذي حُمّل للتو.'],
     ['ضاعت، لأن التحميل الجديد كتب فوقها',false,'لا تضيع: كل تحميل ينقل القيمة القديمة إلى ACCU2.'],
     [String.raw`في <span class="ltr">ACCU2</span>`,true,'ولذلك يقسم /R بعدها: ACCU2 ÷ ACCU1 = القراءة ÷ 27648.0.']]}},
    {tip:String.raw`<p>الأسطر 2 إلى 9 هي الشبكات 3 و 4 من برنامج LAD مكتوبة بحروف: <span class="ltr">ITD</span> بدل <span class="ltr">I_DI</span>، و<span class="ltr">DTR</span> بدل <span class="ltr">DI_R</span>، و<span class="ltr">/R</span> بدل <span class="ltr">DIV_R</span>، و<span class="ltr">*R</span> بدل <span class="ltr">MUL_R</span>. الفرق الوحيد هو المقياس (المحطة السابقة).</p>`,title:'قارن بـ LAD'},
    {watch:String.raw`<p><b>مقياس الحرارة الفعلية مختلف عن LAD:</b> في LAD تُقسم قراءة الثرموكبل على <span class="ltr">10.0</span>، وفي STL تُقسم على <span class="ltr">27648.0</span> وتُضرب في <span class="ltr">100.0</span> (<span class="ltr">0–10 v</span> ← <span class="ltr">0–100°C</span>). هذا مقصود حسب ملاحظة الكتاب (محاكاة الثرموكبل بمقاومة)، لكن البرنامج ما زال يقرأ العنوان <span class="ltr">PIW 290</span>. فلو وصلت ثرموكبلاً حقيقياً مع هذا البرنامج لكانت الحرارة المحسوبة خاطئة.</p>`,fix:true},
    {title:'مختبر مصغّر: نفّذ الأسطر 1 إلى 8',widget:(el,B)=>U5STL(el,B,{from:1,to:8,vt:5,show:['MD200'],intro:'حرّك المنزلق الأول سطراً سطراً وراقب أين يذهب كل رقم: <span class="ltr">ACCU1</span> أم <span class="ltr">ACCU2</span>. وغيّر الجهد لترى أثره.',
      predict:{q:String.raw`جهد المدخل <span class="ltr">5 v</span>، فـ <span class="ltr">PIW 290 = 13824</span>. بعد السطر <span class="ltr">/R</span> ماذا يكون في <span class="ltr">ACCU1</span>؟`,opts:[
       [String.raw`<span class="ltr">50</span>`,false,String.raw`هذه النتيجة بعد السطر التالي <span class="ltr">*R</span> (الضرب في <span class="ltr">100.0</span>).`],
       [String.raw`<span class="ltr">0.5</span>`,true,String.raw`<span class="ltr">/R</span>: <bdi dir="ltr">ACCU2 ÷ ACCU1 = 13824 ÷ 27648 = 0.5</bdi>.`],
       [String.raw`<span class="ltr">13824</span>`,false,String.raw`هذه القراءة قبل القسمة؛ كانت في <span class="ltr">ACCU2</span> قبل السطر <span class="ltr">/R</span>.`]]}})}
   ]},

  {st:3,short:'STL: التشغيل',title:'دائرة STL (2): الحرارة المطلوبة <span class="ltr">MD100</span> وحد التشغيل <span class="ltr">MD80</span>',ref:'ص 106',
   q:'في LAD كان المقارن صندوقاً له مدخلان IN1 و IN2… فما مدخلاه في STL؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المقارنة في STL: MD200 في ACCU2 و MD80 في ACCU1، والمقارنة أقل من أو يساوي تعطي RLO يثبت Q 4.0" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦L MD 200⟧ أولاً: الحرارة الفعلية، ثم انتقلت إلى ⟦ACCU2⟧ عند تحميل ⟦MD80⟧."><rect x="196" y="40" width="134" height="56" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="263" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU2</text><text x="263" y="84" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">MD200</text></g><g data-tip="⟦L MD 80⟧ ثانياً: حد التشغيل (⟦80%⟧ من المطلوبة) في ⟦ACCU1⟧."><rect x="30" y="40" width="134" height="56" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="97" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU1</text><text x="97" y="84" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">MD80</text></g><path d="M263 96 V118 H200 M97 96 V118 H160" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="⟦&lt;=R⟧: هل ⟦ACCU2 ≤ ACCU1⟧؟ أي هل الحرارة الفعلية ⟦MD200⟧ أقل من أو تساوي ⟦MD80⟧؟"><polygon points="180,104 232,140 180,176 128,140" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="146" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&lt;=R</text></g><path d="M180 176 V198" stroke="#2C4A40" stroke-width="2.5"/><polygon points="180,206 173,194 187,194" fill="#2C4A40"/><g data-tip="⟦RLO⟧ نتيجة العملية المنطقية: ⟦1⟧ إذا تحقق الشرط، و⟦0⟧ إذا لم يتحقق."><rect x="128" y="208" width="104" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="229" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">RLO = 1</text></g><path d="M180 240 V254" stroke="#2C4A40" stroke-width="2.5"/><polygon points="180,262 173,250 187,250" fill="#2C4A40"/><g data-tip="⟦S Q 4.0⟧: إذا كانت ⟦RLO = 1⟧ يُثبَّت متمم السخان ويبقى يعمل حتى يُلغى."><rect x="108" y="264" width="144" height="36" rx="8" fill="#12855A"/><text x="180" y="288" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">S  Q 4.0</text></g></svg>`,
   cap:'ترتيب التحميل يحدد المقارنة: الأول (<span class="ltr">MD200</span>) يصبح في <span class="ltr">ACCU2</span>، والثاني (<span class="ltr">MD80</span>) في <span class="ltr">ACCU1</span>.<br><b>مرّر المؤشر على المربعات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:'<table class="stl"><tbody>'+STL_BOOK.slice(9,27).map(o=>{const p=o.l.trim().split(/\s+/);return '<tr><td>'+(B.esc(p[0]||'')||'&nbsp;')+'</td><td>'+B.esc(p.slice(1).join(' '))+'</td></tr>'}).join('')+'</tbody></table>',ref:'ص 106'}
   ],
   body:[
    {tip:String.raw`<p>في هذه الأسطر ثلاثة أجزاء: <b>(1)</b> حساب الحرارة المطلوبة من <span class="ltr">PIW 288</span> بالطريقة نفسها ← <span class="ltr">T MD 100</span>. <b>(2)</b> ضربها في <span class="ltr">0.8</span> ← <span class="ltr">T MD 80</span>. <b>(3)</b> تحميل <span class="ltr">MD 200</span> ثم <span class="ltr">MD 80</span> ثم <span class="ltr">&lt;=R</span> ثم <span class="ltr">S Q 4.0</span>.</p>`,title:'ثلاثة أجزاء'},
    {predict:{q:String.raw`<span class="ltr">L MD 200</span> ثم <span class="ltr">L MD 80</span> ثم <span class="ltr">&lt;=R</span>. متى تكون <span class="ltr">RLO = 1</span>؟`,opts:[
     [String.raw`إذا كانت <span class="ltr">MD200 ≤ MD80</span>`,true,'المقارنة بين ACCU2 (MD200، المحمَّل أولاً) و ACCU1 (MD80).'],
     [String.raw`إذا كانت <span class="ltr">MD80 ≤ MD200</span>`,false,'هذا عكس الترتيب: الأول المحمَّل هو الطرف الأيسر في المقارنة.'],
     ['دائماً، لأن المقارنة لا تحتاج شرطاً',false,'المقارنة نفسها هي الشرط؛ نتيجتها RLO = 0 أو 1.']]}},
    {watch:String.raw`<p>السطر <span class="ltr">L MD 200</span> مباشرة بعد <span class="ltr">T MD 200</span> ثم <span class="ltr">L PIW 288</span> تحميل زائد بلا أثر (منقول كما في الكتاب). والأسطر الفارغة مطبوعة هكذا في الكتاب ولا تفعل شيئاً.</p>`,fix:true},
    {title:'مختبر مصغّر: نفّذ أسطر التشغيل',widget:(el,B)=>U5STL(el,B,{from:9,to:26,vt:5,vr:5,show:['MD100','MD80'],intro:'الأسطر 1 إلى 8 نُفّذت قبل هذا الجزء. حرّك المنزلق الأول وتابع الحرارة المطلوبة ثم حد التشغيل ثم المقارنة.',
      predict:{q:String.raw`الجهدان متساويان (<span class="ltr">5 v</span> و <span class="ltr">5 v</span>)، أي الحرارة الفعلية = المطلوبة. هل يُثبَّت <span class="ltr">Q 4.0</span> في آخر هذا الجزء؟`,opts:[
       [String.raw`نعم، لأن الحرارتين متساويتان`,false,String.raw`المقارنة ليست مع <span class="ltr">MD100</span> بل مع <span class="ltr">MD80</span>.`],
       [String.raw`لا، لأن <span class="ltr">MD200 = 50</span> أكبر من <span class="ltr">MD80 = 40</span>`,true,String.raw`<span class="ltr">&lt;=R</span> تسأل: هل <span class="ltr">MD200 ≤ MD80</span>؟ والجواب لا، فـ <span class="ltr">RLO = 0</span> ولا يفعل <span class="ltr">S Q 4.0</span> شيئاً.`]]}})}
   ]},

  {st:4,short:'STL: الإيقاف',title:'دائرة STL (3): حد الإيقاف <span class="ltr">MD120</span> والإلغاء',ref:'ص 106',
   q:'نسخة LAD كان فيها ضاغطا تشغيل وإيقاف ومصباح… هل تجدها في آخر برنامج STL؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المقارنة أكبر من بين MD200 و MD120 تعطي RLO يلغي Q 4.0" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="⟦L MD 200⟧: الحرارة الفعلية، وتصبح في ⟦ACCU2⟧ بعد تحميل ⟦MD120⟧."><rect x="196" y="40" width="134" height="56" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="263" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU2</text><text x="263" y="84" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">MD200</text></g><g data-tip="⟦L MD 120⟧: حد الإيقاف (⟦120%⟧ من المطلوبة) في ⟦ACCU1⟧؛ حُسب قبلها بالأسطر ⟦L MD 100⟧ و⟦L 1.200000e+000⟧ و⟦*R⟧ و⟦T MD 120⟧."><rect x="30" y="40" width="134" height="56" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="97" y="62" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ACCU1</text><text x="97" y="84" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">MD120</text></g><path d="M263 96 V118 H200 M97 96 V118 H160" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="⟦&gt;R⟧: هل ⟦ACCU2 &gt; ACCU1⟧؟ أي هل تجاوزت الحرارة الفعلية ⟦MD120⟧؟"><polygon points="180,104 232,140 180,176 128,140" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="146" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&gt;R</text></g><path d="M180 176 V198" stroke="#2C4A40" stroke-width="2.5"/><polygon points="180,206 173,194 187,194" fill="#2C4A40"/><rect x="128" y="208" width="104" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="229" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">RLO = 1</text><path d="M180 240 V254" stroke="#2C4A40" stroke-width="2.5"/><polygon points="180,262 173,250 187,250" fill="#2C4A40"/><g data-tip="⟦R Q 4.0⟧: إذا كانت ⟦RLO = 1⟧ يُلغى متمم السخان فيتوقف."><rect x="108" y="264" width="144" height="36" rx="8" fill="#E8735A"/><text x="180" y="288" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">R  Q 4.0</text></g><g data-tip="غير موجود في برنامج ⟦STL⟧ الكتاب: الضاغطان ⟦S1⟧ ⟦(I0.1)⟧ و⟦S0⟧ ⟦(I0.0)⟧ والمصباح ⟦H1⟧ ⟦(Q4.1)⟧."><rect x="262" y="210" width="78" height="80" rx="8" fill="none" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><text x="301" y="236" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S1  S0</text><text x="301" y="256" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Q4.1</text><text x="301" y="278" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">غائبة</text></g></svg>`,
   cap:'آخر البرنامج مثل وسطه، لكن بـ <span class="ltr">&gt;R</span> و<span class="ltr">R Q 4.0</span>. والمربع المتقطع يذكّرك بما ليس في البرنامج.<br><b>مرّر المؤشر على المربعات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:'<table class="stl"><tbody>'+STL_BOOK.slice(27).map(o=>{const p=o.l.trim().split(/\s+/);return '<tr><td>'+(B.esc(p[0]||'')||'&nbsp;')+'</td><td>'+B.esc(p.slice(1).join(' '))+'</td></tr>'}).join('')+'</tbody></table>',ref:'ص 106'}
   ],
   body:[
    {tip:String.raw`<p><span class="ltr">S Q 4.0</span> في الجزء السابق و<span class="ltr">R Q 4.0</span> هنا يعملان معاً عمل الحاكم ذي الموضعين: يُثبَّت السخان عند <span class="ltr">80%</span> أو أقل، ويبقى يعمل حتى تتجاوز الحرارة <span class="ltr">120%</span> فيُلغى، ثم يبقى متوقفاً حتى تنزل إلى <span class="ltr">80%</span> من جديد. ولأنه لا يوجد شرط ضاغط هنا، يتكرر ذلك تلقائياً.</p>`,title:'التثبيت والإلغاء معاً'},
    {predict:{q:'في برنامج STL هذا كما في الكتاب، كيف يوقف المشغّل السخان يدوياً؟',opts:[
     [String.raw`بالضغط على <span class="ltr">S0</span>`,false,'البرنامج لا يقرأ I0.0 أصلاً، فلا أثر للضاغط.'],
     ['لا توجد طريقة في البرنامج؛ السخان يتبع المقارنة فقط',true,'هذا ما ينقص STL الكتاب مقارنة بـ LAD (انظر «انتبه»).'],
     [String.raw`بإطفاء المصباح <span class="ltr">H1</span>`,false,'المصباح Q4.1 غير موجود في هذا البرنامج، والمصباح مخرج لا يتحكم في شيء.']]}},
    {watch:String.raw`<p><b>STL ناقص مقارنة بـ LAD (يغيّر عمل البرنامج):</b> لا يتضمن الضاغط <span class="ltr">S1 (I0.1)</span> ولا <span class="ltr">S0 (I0.0)</span> ولا المصباح <span class="ltr">Q4.1</span>؛ فقط <span class="ltr">S Q 4.0</span> عند <span class="ltr">&lt;=R</span> و<span class="ltr">R Q 4.0</span> عند <span class="ltr">&gt;R</span>. النتيجة: السخان يعمل تلقائياً بمجرد تشغيل الـ PLC ولا يمكن إيقافه بضاغط. <b>المصحح</b> في المختبر يضيف <span class="ltr">S1</span> و<span class="ltr">S0</span> بعلامة <span class="ltr">M0.0</span> والمصباح <span class="ltr">H1</span> (الأسطر المضافة مظللة).</p>`,fix:true},
    {title:'مختبر مصغّر: نفّذ أسطر الإيقاف',widget:(el,B)=>U5STL(el,B,{from:27,to:37,vt:5,vr:5,q0:1,show:['MD120'],intro:'الأسطر 1 إلى 26 نُفّذت قبل هذا الجزء. حرّك المنزلق الأول، وجرّب بعدها رفع جهد الحرارة الفعلية.',
      predict:{q:String.raw`السخان يعمل قبل هذا المسح، والحرارة الفعلية = المطلوبة (بين <span class="ltr">80٪</span> و <span class="ltr">120٪</span>). ماذا تكون <span class="ltr">Q 4.0</span> بعد آخر سطر؟`,opts:[
       [String.raw`<span class="ltr">1</span>: يبقى يعمل`,true,String.raw`<span class="ltr">&gt;R</span> تعطي <span class="ltr">0</span> لأن <span class="ltr">50</span> ليست أكبر من <span class="ltr">60</span>، فلا ينفّذ <span class="ltr">R Q 4.0</span> شيئاً.`],
       [String.raw`<span class="ltr">0</span>: يتوقف عند آخر سطر`,false,String.raw`الأمر <span class="ltr">R</span> لا يُلغي إلا إذا كانت <span class="ltr">RLO = 1</span>.`]]}})}
   ]},

  {st:5,short:'والمطلوب',title:'والمطلوب: البرنامج بلغتي FBD و STL',ref:'ص 105',
   q:'رأيت البرنامج بلغة LAD ثم بلغة STL… فما الذي بقي عليك أن تكتبه بنفسك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات للغات البرمجة: LAD في الدرس 5.3، و STL في ص 106، و FBD مطلوبة منك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="المخطط السلّمي ⟦LAD⟧: البرنامج الكامل في ص 104–105 (الدرس 5.3)."><rect x="226" y="60" width="104" height="130" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="278" y="104" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">LAD</text><circle cx="278" cy="144" r="15" fill="#12855A"/><path d="M271 144 l5 5 l9 -11" fill="none" stroke="#FBF6EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="قائمة الإجراءات ⟦STL⟧: نسخة الكتاب في ص 106 (بمحاكاة الثرموكبل وبلا ضاغطين ولا مصباح)."><rect x="128" y="60" width="104" height="130" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="104" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">STL</text><circle cx="180" cy="144" r="15" fill="#F2C14E"/><text x="180" y="150" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">!</text></g><g data-tip="مخطط البوابات ⟦FBD⟧: لم يعطه الكتاب؛ المطلوب أن تكتبه أنت بالبلوكات نفسها."><rect x="30" y="60" width="104" height="130" rx="12" fill="#FBF6EE" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="6 4"/><text x="82" y="104" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">FBD</text><circle cx="82" cy="144" r="15" fill="#E8735A"/><text x="82" y="150" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700">?</text></g><text x="180" y="236" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">برنامج واحد بثلاث لغات</text><text x="180" y="262" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">الأخضر جاهز، والأصفر يحتاج إكمالاً، والبرتقالي عليك</text></svg>`,
   cap:'البرنامج واحد، واللغة تتغير. مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف أين تجد اللغة أو ما المطلوب فيها.',
   side:[
    {book:String.raw`<p>إعادة كتابة البرنامج السابق باستخدام لغة <span class="ltr">FBD</span> ولغة <span class="ltr">STL</span>.</p>`,ref:'ص 105'},
    {predict:{q:'أيّ اللغات الثلاث لم يعطِ الكتاب البرنامج بها جاهزاً؟',opts:[
     [String.raw`<span class="ltr">FBD</span>`,true,'LAD في ص 104–105 و STL في ص 106؛ أما FBD فهي التمرين المطلوب منك.'],
     [String.raw`<span class="ltr">STL</span>`,false,'برنامج STL مطبوع في ص 106 (بعد ملاحظة محاكاة الثرموكبل).'],
     [String.raw`<span class="ltr">LAD</span>`,false,'LAD هو البرنامج الأساسي في ص 104–105.']]}}
   ],
   body:[
    {tip:String.raw`<p>في <span class="ltr">FBD</span> تبقى الصناديق نفسها كما في LAD (<span class="ltr">I_DI</span>، <span class="ltr">DI_R</span>، <span class="ltr">DIV_R</span>، <span class="ltr">MUL_R</span>، <span class="ltr">CMP &lt;=R</span>، <span class="ltr">CMP &gt;R</span>)، لكن التوالي يصبح بوابة <span class="ltr">AND</span> والتوازي بوابة <span class="ltr">OR</span>، ثم ملفات التثبيت والإلغاء. وفي <span class="ltr">STL</span> أكمل نسخة الكتاب بأسطر <span class="ltr">S1</span> و<span class="ltr">S0</span> و<span class="ltr">Q 4.1</span>، كما في النسخة «المصححة» في المختبر.</p>`,title:'من أين تبدأ؟'},
    {tip:String.raw`<p>في تبويب «المختبر» نفّذ برنامج الكتاب سطراً سطراً وراقب <span class="ltr">ACCU1</span> و<span class="ltr">ACCU2</span> بعد كل تعليمة، ثم بدّل إلى «المصحح» وقارن.</p>`,title:'جرّبه قبل أن تكتبه'},
    {title:'مختبر مصغّر: من LAD إلى FBD',widget:(el,B)=>DCML.sort(el,B,{intro:'عندما تكتب البرنامج بلغة <span class="ltr">FBD</span>، ماذا يصبح كل جزء من <span class="ltr">LAD</span>؟',cats:['بوابة <span class="ltr">&amp;</span> (و)','بوابة <span class="ltr">&gt;=1</span> (أو)','الصندوق نفسه'],items:[
     ['في <span class="ltr">Network 6</span>: تلامس <span class="ltr">S1</span> على التوالي مع المقارن <span class="ltr">CMP &lt;=R</span>',0,'التوالي = «و»: يُثبَّت السخان إذا تحقق الشرطان معاً.'],
     ['في <span class="ltr">Network 7</span>: تلامس <span class="ltr">S0</span> على التوازي مع المقارن <span class="ltr">CMP &gt;R</span>',1,'التوازي = «أو»: يكفي أحد الشرطين للإلغاء.'],
     ['الدالة <span class="ltr">DIV_R</span>',2,'صناديق التحويل والحساب تبقى كما هي في <span class="ltr">FBD</span>.'],
     ['المقارن <span class="ltr">CMP &gt;R</span>',2,'صندوق المقارنة نفسه؛ يتغير فقط ما يُوصل بخرجه.'],
     ['الدالة <span class="ltr">I_DI</span>',2,'صندوق التحويل نفسه.']]})}
   ]},

  {recap:[
   String.raw`عند عدم توفر الثرموكبل تُمثَّل الحرارة الفعلية بمقاومة جهدها من <span class="ltr">0</span> إلى <span class="ltr">10</span> فولت، فتُعاير مثل الحرارة المطلوبة: <span class="ltr">÷ 27648.0 × 100.0</span> (ص 105–106).`,
   String.raw`STL يعمل بالمركمين: <span class="ltr">L</span> يحمّل في <span class="ltr">ACCU1</span> وينقل القديم إلى <span class="ltr">ACCU2</span>، و<span class="ltr">/R</span> و<span class="ltr">*R</span> تعملان على الاثنين، و<span class="ltr">T</span> ينقل النتيجة إلى الذاكرة.`,
   String.raw`<span class="ltr">ITD</span> و<span class="ltr">DTR</span> تقابلان <span class="ltr">I_DI</span> و<span class="ltr">DI_R</span> في LAD.`,
   String.raw`<span class="ltr">L MD 200 / L MD 80 / &lt;=R / S Q 4.0</span> للتشغيل، و<span class="ltr">L MD 200 / L MD 120 / &gt;R / R Q 4.0</span> للإيقاف.`,
   'برنامج STL الكتاب بلا ضاغطين ولا مصباح؛ والمطلوب إعادة كتابة البرنامج بلغتي FBD و STL (ص 105).']}
],
 theory:[
  {h:'ملاحظة الكتاب قبل البرنامج',ref:'ص 105',html:'<p>«في حالة عدم توفر حساس درجة الحرارة الثرموكبل يمكن استخدام مقاومة لمحاكاة عمله بحيث يكون دخل درجة الحرارة الفعلية ممثلاً بجهد من 0 إلى 10 فولت. البرنامج التالي يبين ذلك مكتوباً بلغة قائمة الإجراءات STL».</p>'},
  {h:'دائرة STL باستخدام دالة التخزين مع دالة الإلغاء والإبقاء',ref:'ص 106',html:'<p>منقول حرفياً (الأسطر الفارغة كما في الكتاب):</p>'},
  {fig:'',ref:'ص 106',caption:'برنامج STL',draw:()=>`<table class="stl"><tbody>${STL_BOOK.map(o=>{const p=o.l.trim().split(/\s+/);return `<tr><td>${B.esc(p[0]||'')}</td><td>${B.esc(p.slice(1).join(' '))}</td></tr>`}).join('')}</tbody></table>`},
  {html:`<table class="tt"><thead><tr><th>التعليمة</th><th>ما تفعله (ACCU1 = المركم 1، ACCU2 = المركم 2)</th></tr></thead><tbody>
   <tr><td class="ltr">L PIW 290</td><td>تحميل قراءة المدخل التناظري في ACCU1 (وما كان في ACCU1 ينتقل إلى ACCU2)</td></tr>
   <tr><td class="ltr">ITD</td><td>تحويل ACCU1 من Integer إلى Double Integer (مثل I_DI)</td></tr>
   <tr><td class="ltr">DTR</td><td>تحويل ACCU1 من Double Integer إلى Real (مثل DI_R)</td></tr>
   <tr><td class="ltr">/R ، *R</td><td>ACCU1 = ACCU2 ÷ ACCU1 ، ACCU1 = ACCU2 × ACCU1 (أعداد حقيقية)</td></tr>
   <tr><td class="ltr">T MD 200</td><td>نقل ACCU1 إلى العنوان MD200</td></tr>
   <tr><td class="ltr">&lt;=R ، &gt;R</td><td>مقارنة ACCU2 مع ACCU1، والنتيجة RLO</td></tr>
   <tr><td class="ltr">S Q 4.0 ، R Q 4.0</td><td>تثبيت / إلغاء السخان إذا كانت RLO = 1</td></tr></tbody></table>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>مقياس الحرارة الفعلية مختلف عن LAD:</b> في LAD تُقسم قراءة الثرموكبل على 10.0، وفي STL تُقسم على 27648.0 وتُضرب في 100.0 (0–10 v ← 0–100°C). هذا مقصود حسب ملاحظة الكتاب (محاكاة الثرموكبل بمقاومة)، لكن البرنامج ما زال يقرأ العنوان <span class="ltr">PIW 290</span>. كذلك السطر <span class="ltr">L MD 200</span> بعد <span class="ltr">T MD 200</span> مباشرة ثم <span class="ltr">L PIW 288</span> تحميل زائد بلا أثر.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'<b>STL ناقص مقارنة بـ LAD (يغيّر عمل البرنامج):</b> لا يتضمن الضاغط S1 (I0.1) ولا S0 (I0.0) ولا المصباح Q4.1؛ فقط <span class="ltr">S Q 4.0</span> عند <span class="ltr">&lt;=R</span> و <span class="ltr">R Q 4.0</span> عند <span class="ltr">&gt;R</span>. النتيجة: السخان يعمل تلقائياً بمجرد تشغيل الـ PLC ولا يمكن إيقافه بضاغط. <b>المصحح</b> في المختبر يضيف S1 و S0 بعلامة M0.0 والمصباح H1 (الأسطر المضافة مظللة).'+'</div>'},
  {h:'والمطلوب',ref:'ص 105',html:'<p>«إعادة كتابة البرنامج السابق باستخدام لغة FBD ولغة STL.» برنامج STL أعلاه هو صيغة الكتاب لمحاكاة الثرموكبل. نفّذه في المختبر سطراً سطراً وراقب المركمين.</p>'}
 ],
 lab:(el)=>{
  const S={src:'pot',Va:2,Vs:5,Ta:25,T:25,var:'book',step:false,pc:0,cnt:0,t:0,cyc:0,prevQ:0,wasOff:0,s1:0,s0:0,flags:{}};
  let mem={bits:{},words:{},a1:0,a2:0,t1:'',t2:'',rlo:false,fc:true},trace=[];const hist=[];let ht=0,rt=0;
  const prog=()=>S.var==='fixed'?STL_FIX:STL_BOOK;
  el.innerHTML=`<div id="l4tp"></div><div class="variant"><span>نسخة البرنامج:</span><div class="seg" role="group"><button data-var="book" aria-pressed="true">كما في الكتاب</button><button data-var="fixed" aria-pressed="false">المصحح</button></div><div class="callout err" id="vnote"></div></div>
   <div class="grid"><div class="panel c7"><h2>المداخل والمخارج</h2>
    <div class="seg" role="group" style="margin-top:8px"><button data-src="pot" aria-pressed="true">الحرارة الفعلية من مقاومة (ملاحظة الكتاب)</button><button data-src="room" aria-pressed="false">غرفة + محوّل 0–10 v (توضيحي)</button></div>
    <label class="toggle" data-pot>جهد الحرارة الفعلية (PIW 290) <input type="range" id="va" min="0" max="10" step="0.1" value="2" style="width:150px;height:auto"> <b class="ltr" id="vav"></b></label>
    <label class="toggle" data-room>حرارة الجو المحيط <input type="range" id="ta" min="0" max="40" step="1" value="25" style="width:150px;height:auto"> <b class="ltr" id="tav"></b></label>
    <label class="toggle">جهد الحرارة المطلوبة (PIW 288) <input type="range" id="vs" min="0" max="10" step="0.1" value="5" style="width:150px;height:auto"> <b class="ltr" id="vsv"></b></label>
    <div class="pbs" style="margin-top:10px" id="btns"><button class="pb red" data-b="s0"><span class="cap">S0</span><small>I0.0</small></button><button class="pb green" data-b="s1"><span class="cap">S1</span><small>I0.1</small></button><div class="lamps"><div class="lamp" id="lq0"><i></i><b>K1</b><span class="mono">Q4.0</span></div><div class="lamp" id="lq1"><i></i><b>H1</b><span class="mono">Q4.1</span></div></div></div>
    <p class="sub" id="bnote"></p><div class="facts" id="vals"></div></div>
   <div class="panel c5"><h2>MD200 مع الزمن <small>آخر 60 ثانية</small></h2><div class="chart"><canvas id="ch"></canvas></div><div class="legend"><span><i style="background:var(--blue)"></i>الفعلية MD200</span><span><i style="background:var(--on)"></i>MD80</span><span><i style="background:var(--stop)"></i>MD120</span></div>
    <h2 style="margin-top:12px">التجربة خطوة بخطوة</h2><ol class="steps" id="stp"></ol></div>
   <div class="panel c12"><div class="viewseg"><h2>تنفيذ STL <small>ص 106</small></h2><div style="display:flex;gap:8px;flex-wrap:wrap"><div class="seg" role="group"><button data-mode="run" aria-pressed="true">تشغيل مستمر</button><button data-mode="step" aria-pressed="false">خطوة بخطوة</button></div><button class="btn primary" id="nx">نفّذ السطر التالي</button></div></div>
    <p class="sub">في الوضع خطوة بخطوة يتوقف الزمن، وكل ضغطة تنفذ سطراً واحداً وتظهر محتوى ACCU1 و ACCU2 و RLO بعده. الأسطر المظللة أضيفت في النسخة المصححة.</p><div class="tablebox" id="stl"></div></div></div>`;
  const $=s=>el.querySelector(s);
  // قيم المدرب: نموذج الغرفة في وضع «غرفة + محوّل» (أرقام توضيحية ليست من الكتاب)
  const TP=B.params($('#l4tp'),'u5-l4',ROOM_DEFS().map(d=>Object.assign(d,{label:d.label+' — وضع «غرفة + محوّل»'})));
  const reset=()=>{mem={bits:{},words:{},a1:0,a2:0,t1:'',t2:'',rlo:false,fc:true};trace=[];S.pc=0;S.cyc=0;S.wasOff=0;S.prevQ=0};
  const segs=(attr,val)=>el.querySelectorAll(`[${attr}]`).forEach(b=>b.setAttribute('aria-pressed',b.getAttribute(attr)===val));
  el.querySelectorAll('[data-var]').forEach(b=>b.onclick=()=>{S.var=b.dataset.var;segs('data-var',S.var);reset();S.T=S.Ta;hdr()});
  el.querySelectorAll('[data-src]').forEach(b=>b.onclick=()=>{S.src=b.dataset.src;segs('data-src',S.src);S.T=S.src==='room'?S.Ta:S.T;hdr()});
  el.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{S.step=b.dataset.mode==='step';segs('data-mode',b.dataset.mode);S.pc=0;trace=[];hdr()});
  $('#va').oninput=e=>S.Va=+e.target.value;$('#vs').oninput=e=>S.Vs=+e.target.value;$('#ta').oninput=e=>S.Ta=+e.target.value;
  el.querySelectorAll('[data-b]').forEach(b=>{const k=b.dataset.b;const dn=e=>{e.preventDefault();S[k]=1;b.classList.add('down')};const up=()=>setTimeout(()=>{S[k]=0;b.classList.remove('down')},250);
    b.addEventListener('pointerdown',dn);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,up))});
  const readIn=()=>{mem.words.PIW290=Math.round((S.src==='room'?clamp(S.T,0,100)/10:S.Va)/10*27648);mem.words.PIW288=Math.round(S.Vs/10*27648);mem.bits['I0.1']=S.s1;mem.bits['I0.0']=S.s0};
  const execLine=i=>{const o=prog()[i];if(i===0)readIn();if(!o){return}const r=stlExec(o.l,mem);trace[i]=r;if(r)S.cnt++};
  const scan=()=>{readIn();mem.fc=true;trace=[];prog().forEach((o,i)=>{trace[i]=stlExec(o.l,mem)})};
  $('#nx').onclick=()=>{if(!S.step){S.step=true;segs('data-mode','step')}if(S.pc===0){trace=[];mem.fc=true}execLine(S.pc);S.pc=(S.pc+1)%prog().length;drawStl()};
  const hdr=()=>{const f=S.var==='fixed';$('#vnote').innerHTML=f?'<span class="fixnote">المصحح: أضيف S1 و S0 بالعلامة M0.0 (مثل المصحح في الدرس 5.3) والمصباح H1 مع السخان.</span>':'كما في الكتاب (ص 106): لا يوجد S1 ولا S0 ولا H1. السخان يُثبَّت ويُلغى بالمقارنة فقط.';
    $('#bnote').textContent=f?'':'في نسخة الكتاب الضاغطان لا أثر لهما: البرنامج لا يقرأ I0.0 ولا I0.1.';$('#btns').style.opacity=f?1:.5;
    el.querySelector('[data-pot]').style.display=S.src==='pot'?'':'none';el.querySelector('[data-room]').style.display=S.src==='room'?'':'none';$('#nx').textContent=S.step?'نفّذ السطر التالي':'خطوة بخطوة: السطر الأول';drawStl()};
  const drawStl=()=>{const P=prog();$('#stl').innerHTML=`<table class="stl" style="width:100%"><thead><tr><td>#</td><td>التعليمة</td><td></td><td class="r">ACCU1</td><td class="r">ACCU2</td><td class="r">RLO</td></tr></thead><tbody>`+P.map((o,i)=>{const p=o.l.trim().split(/\s+/),r=trace[i];const cur=S.step&&i===(S.pc-1+P.length)%P.length&&trace[i]!==undefined;
    return `<tr style="${o.add?'background:var(--on-soft);':''}${cur?'outline:2px solid var(--blue);':''}"><td class="r">${i+1}</td><td>${B.esc(p[0]||'')}</td><td>${B.esc(p.slice(1).join(' '))}</td><td class="r">${r?fa(r.a1,r.t1)+(r.t1?' <small>'+r.t1+'</small>':''):''}</td><td class="r">${r?fa(r.a2,r.t2):''}</td><td class="r">${r&&r.rlo!==null?`<span class="bit ${r.rlo?'one':''}">${r.rlo}</span>`:''}</td></tr>`}).join('')+'</tbody></table>'};
  const chk=checklist($('#stp'),[
   {t:'سطراً سطراً',x:'اضغط «نفّذ السطر التالي» حتى السطر 9 (<span class="ltr">T MD 200</span>). لاحظ: 5530 ← قسمة على 27648 ← ضرب في 100 = 20.0 (جهد 2 v = 20°C).',done:()=>S.step&&S.cnt>=8},
   {t:'تشغيل مستمر',x:'اختر «تشغيل مستمر». المقاومة الفعلية 2 v (20°C) والمطلوبة 5 v (50°C): 20 ≤ 40 فيُثبَّت Q4.0.',done:()=>!S.step&&mem.bits['Q4.0']},
   {t:'فوق 120٪',x:'ارفع جهد الحرارة الفعلية فوق 6 v (أكثر من 60°C). يُلغى Q4.0.',done:()=>{if(mem.bits['Q4.0'])S.flags.on=1;return S.flags.on&&!mem.bits['Q4.0']&&(mem.words.MD200||0)>(mem.words.MD120||0)}},
   {t:'بين الحدين',x:'أنزل الجهد إلى 5 v (50°C). السخان يبقى متوقفاً: التثبيت والإلغاء يصنعان المسافة بين 40 و 60.',done:()=>!mem.bits['Q4.0']&&mem.words.MD200>mem.words.MD80&&mem.words.MD200<=mem.words.MD120},
   {t:'غرفة حقيقية',x:'اختر «غرفة + محوّل». الآن يدور الحاكم وحده: تسخين حتى 60 ثم تبريد حتى 40 ثم تسخين…',done:()=>S.src==='room'&&S.cyc>=1},
   {t:'المصحح',x:'اختر «المصحح». السخان لا يعمل حتى تضغط S1 مرة واحدة (M0.0)، والمصباح H1 يضيء معه.',done:()=>S.var==='fixed'&&mem.bits['M0.0']&&mem.bits['Q4.0']},
   {t:'إيقاف',x:'اضغط S0: تُلغى M0.0 والسخان والمصباح.',done:()=>S.var==='fixed'&&S.flags.s0seen&&!mem.bits['M0.0']&&!mem.bits['Q4.0']}]);
  hdr();
  runLoop(el,dt=>{if(S.s0)S.flags.s0seen=1;
   if(!S.step){S.t+=dt;const H=mem.bits['Q4.0']?1:0;if(S.src==='room')S.T+=dt*(TP.v.G*H-(S.T-S.Ta))/TP.v.tau;scan();
     const q=mem.bits['Q4.0']?1:0;if(S.prevQ&&!q)S.wasOff=1;if(!S.prevQ&&q&&S.wasOff)S.cyc++;S.prevQ=q;
     ht+=dt;if(ht>0.1){ht=0;hist.push({t:S.t,v:mem.words.MD200||0,a:mem.words.MD80||0,b:mem.words.MD120||0});while(hist.length&&S.t-hist[0].t>60.3)hist.shift()}
     rt+=dt;if(rt>0.25){rt=0;drawStl()}}
   $('#vav').textContent=S.Va.toFixed(1)+' v';$('#vsv').textContent=S.Vs.toFixed(1)+' v';$('#tav').textContent=S.Ta+' °C';
   $('#lq0').classList.toggle('on',!!mem.bits['Q4.0']);$('#lq1').classList.toggle('on',!!mem.bits['Q4.1']);
   const w=mem.words;$('#vals').innerHTML=[['PIW290',w.PIW290||0],['PIW288',w.PIW288||0],['MD200 فعلية',fnum(w.MD200||0,1)+' °C'],['MD100 مطلوبة',fnum(w.MD100||0,1)+' °C'],['MD80',fnum(w.MD80||0,1)],['MD120',fnum(w.MD120||0,1)]].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('')+(S.src==='room'?`<div class="fact"><span>حرارة الغرفة</span><b>${S.T.toFixed(1)} °C</b></div>`+(S.T>100?'<p class="sub" style="flex-basis:100%">المحوّل يعطي 10 v عند 100°C ولا يزيد، لذلك تبقى MD200 عند 100 مع أن الغرفة أسخن.</p>':'')+(roomNote(TP,S.Ta,mem.words.MD120||0)?`<p class="sub" style="flex-basis:100%">${roomNote(TP,S.Ta,mem.words.MD120||0)}</p>`:''):'');
   const c=$('#ch');if(c)W.chart(c,hist,{now:S.t,span:60,ymax:100,ticks:[0,25,50,75,100],unit:'°',series:[{key:'v',color:'--blue'},{key:'a',color:'--on'},{key:'b',color:'--stop'}]});chk()});
 },
 quiz:[
  {q:'ماذا تفعل التعليمة ITD؟',o:['تحول Integer إلى Double Integer','تقسم عددين','تحمل ثابتاً','تقارن'],c:0,e:'ITD = Integer To Double، ثم DTR = Double To Real.'},
  {q:'بعد L 2.764800e+004 مباشرة، ماذا تفعل /R؟',o:['ACCU1 = ACCU1 ÷ 27648','ACCU1 = ACCU2 ÷ ACCU1 أي القراءة ÷ 27648','تخزن في MD200','تمسح ACCU2'],c:1,e:'القراءة كانت في ACCU1 وانتقلت إلى ACCU2 عند تحميل 27648.'},
  {q:'في STL الكتاب، جهد الحرارة الفعلية 3 v. كم MD200؟',o:['3','30','300','8294'],c:1,e:'3 v ← 8294 ← ÷ 27648 × 100 ≈ 30.0°C.'},
  {q:'لماذا يختلف حساب MD200 في STL عن LAD؟',o:['خطأ مطبعي فقط','لأن STL يحاكي الثرموكبل بمقاومة 0–10 v (0–100°C)','لأن STL أسرع','لا يختلف'],c:1,e:'ملاحظة ص 105: دخل الحرارة الفعلية ممثل بجهد من 0 إلى 10 فولت.'},
  {q:'ما الذي ينقص برنامج STL مقارنة بـ LAD؟',o:['المقارنة >R','S1 و S0 والمصباح Q4.1','MD80','التحويل DTR'],c:1,e:'فيه فقط S Q 4.0 و R Q 4.0.'},
  {q:'ماذا تفعل T MD 120؟',o:['تحمل MD120','تنقل محتوى ACCU1 إلى MD120','تقارن مع MD120','تضرب في 1.2'],c:1,e:'T = Transfer.'},
  {q:'في STL الكتاب: L MD 200 ثم L MD 80 ثم <=R. متى RLO = 1؟',o:['إذا كانت MD200 ≤ MD80','إذا كانت MD80 ≤ MD200','دائماً','إذا كان S1 مضغوطاً'],c:0,e:'المقارنة بين ACCU2 (MD200) و ACCU1 (MD80).'}
 ]
});
})(PLCBOOK);
