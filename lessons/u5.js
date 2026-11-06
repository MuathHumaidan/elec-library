/* Unit 5 — التحكم في درجات الحرارة باستخدام حساسات درجة الحرارة (ص 97–106) */
(function(B){
const {S,clamp,W}=B;

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
 theory:[
  {h:'الجدارة والأهداف',ref:'ص 97–98',html:`<p><b>الجدارة:</b> استخدام مكونات التحكم في العمليات الصناعية (PLC) في تنفيذ التطبيقات.</p>
   <p><b>الأهداف:</b> أن يعرف المتدرب كيف يتم عمل دائرة التحكم في درجة الحرارة (طريقة التحكم في درجات الحرارة)، وأن يكتب برامج للتحكم في درجة الحرارة.</p>
   <p><b>محتوى الوحدة (ص 98):</b> أولاً: فكرة عمل التحكم في درجات الحرارة. ثانياً: كتابة برنامج للتحكم في درجات الحرارة (PLC) باللغة (LAD).</p>
   <p><b>مستوى الأداء:</b> 100٪. <b>الوقت المتوقع:</b> ساعتان. <b>الوسائل:</b> مختبر التحكم المنطقي المبرمج، حاسب آلي، جهاز عرض، سبورة، كراسة الطالب، قلم.</p>`},
  {err:'صفحة المقدمة مكررة بصيغتين: متطلبات الجدارة في ص 97 «اجتياز ورشة أساسيات الكهرباء، اجتياز الرسم الفني»، وفي ص 98 «اجتياز ورشة التحكم في المحركات الثلاثية الأوجه»، والوسائل في ص 97 بلا «كراسة الطالب».'},
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
  el.innerHTML=`<div class="grid"><div class="panel c12"><h2>منظومة التحكم في حرارة غرفة <small>مخطط كتلي تفاعلي — توضيحي</small></h2>
   <div class="viewseg" style="margin-top:8px"><div class="seg" role="group"><button data-lp="1" aria-pressed="true">حلقة مغلقة (مع الحساس)</button><button data-lp="0" aria-pressed="false">حلقة مفتوحة (بدون حساس)</button></div></div>
   <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:8px"><label class="toggle">القيمة المطلوبة <input type="range" id="sv" min="20" max="70" step="1" value="40" style="width:180px;height:auto"> <b class="ltr" id="svv"></b></label>
   <label class="toggle">حرارة الجو المحيط <input type="range" id="ta" min="0" max="40" step="1" value="25" style="width:180px;height:auto"> <b class="ltr" id="tav"></b></label></div>
   <div class="svgbox" id="bd"></div></div>
   <div class="panel c7"><h2>الحرارة مع الزمن <small>آخر 60 ثانية</small></h2><div class="chart"><canvas id="ch"></canvas></div><div class="legend"><span><i style="background:var(--blue)"></i>الحرارة الفعلية</span><span><i style="background:var(--muted)"></i>القيمة المطلوبة</span></div></div>
   <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="stp"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  el.querySelectorAll('[data-lp]').forEach(b=>b.onclick=()=>{st.closed=b.dataset.lp==='1';el.querySelectorAll('[data-lp]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  $('#sv').oninput=e=>st.set=+e.target.value;$('#ta').oninput=e=>st.Ta=+e.target.value;
  const flags={};
  const chk=checklist($('#stp'),[
   {t:'الحلقة المغلقة',x:'اترك القيمة المطلوبة 40°C. راقب كيف يشغّل الحاكم السخان ويوقفه حتى تستقر الحرارة حول 40°C.',done:()=>st.closed&&st.t>8&&Math.abs(st.T-st.set)<1.5},
   {t:'غيّر الجو',x:'اخفض حرارة الجو إلى 10°C أو أقل. الحساس يكشف الانخفاض، والمقارن يعطي جهد خطأ موجباً، فيعمل السخان أكثر وتبقى الحرارة قرب المطلوب.',done:()=>{if(st.closed&&st.Ta<=10)flags.c=(flags.c||0)+1;return st.closed&&st.Ta<=10&&flags.c>200&&Math.abs(st.T-st.set)<2}},
   {t:'الحلقة المفتوحة',x:'اختر «حلقة مفتوحة». الحاكم الآن يشغّل السخان بقدر ثابت محسوب على أساس جو 25°C ولا يرى الحرارة الفعلية. انتظر وراقب ابتعاد الحرارة عن المطلوب.',done:()=>!st.closed&&Math.abs(st.T-st.set)>5},
   {t:'عد إلى المغلقة',x:'اختر «حلقة مغلقة» من جديد ولاحظ تصحيح الخطأ. هذه فائدة الحساس والمقارن.',done:()=>st.closed&&Math.abs(st.T-st.set)<1.5}]);
  const box=(x,y,w,t1,t2,on,dim)=>`<rect x="${x}" y="${y}" width="${w}" height="46" rx="6" class="sym" fill="${on?'var(--on-soft)':'var(--surface)'}" ${dim?'opacity=".4"':''}/>`+ar(x+w/2,y+19,t1,'','middle',12)+S.t(x+w/2,y+37,t2,'b');
  const draw=()=>{const Vr=st.set/5,Vs=st.T/5,e=Vr-Vs,cl=st.closed;const fb=cl?'live':'';
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
  runLoop(el,dt=>{st.t+=dt;const tau=8;
   if(st.closed){const e=st.set/5-st.T/5;if(e>0.1)st.H=1;else if(e<-0.1)st.H=0;st.duty=st.H}
   else{st.duty=clamp((st.set-25)/60,0,1);st.H=0}
   const P=st.closed?st.H:st.duty;st.T+=dt*(60*P-(st.T-st.Ta))/tau;
   ht+=dt;if(ht>0.1){ht=0;hist.push({t:st.t,v:st.T,sv:st.set});while(hist.length&&st.t-hist[0].t>60.3)hist.shift()}
   rd+=dt;if(rd>0.1){rd=0;draw()}
   const c=$('#ch');if(c)W.chart(c,hist,{now:st.t,span:60,ymax:80,ticks:[0,20,40,60,80],unit:'°',series:[{key:'v',color:'--blue'},{key:'sv',color:'--muted'}]});chk()});
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
 theory:[
  {h:'التحكم في درجة حرارة غرفة باستخدام حاكم ذي موضعين',ref:'ص 100',html:'<p>«والشكل التالي يبين مخطط توصيل وحدة (PLC) للتحكم في درجة حرارة الغرفة:»</p><ul><li>المداخل: <b>I0.1</b> ← الضاغط <b>S1</b> «Heat enable»، و <b>I0.0</b> ← الضاغط <b>S0</b> «Stop Heating».</li><li>المداخل التناظرية: <b>PIW290</b> ← الثرموكبل <b>K-Type</b>، و <b>PIW288</b> ← منزلق المقاومة المتغيرة <b>R</b> بين <span class="ltr">10 VDC</span> و <span class="ltr">0 VDC</span>.</li><li>المخارج: <b>Q4.0</b> ← متمم السخان <b>K1</b>، و <b>Q4.1</b> ← المصباح <b>H1</b>.</li><li>دائرة القدرة: L1 و L2 و L3 ← مصهرات ← نقاط K1 الرئيسة ← ثلاث مقاومات تسخين موصولة نجمة، ونقطة النجمة <b>E</b>.</li></ul>'},
  {fig:'(1-5)',ref:'ص 100',caption:'مخطط توصيل وحدة PLC ودائرة القدرة للسخان (القيم المكتوبة مثال: R على 5 v والغرفة 25°C)',draw:()=>`<div class="svgbox">${fig15({})}</div>`},
  {h:'جدول قائمة التشغيل',ref:'ص 101',html:'<p>«والجدول التالي يوضح قائمة التشغيل حسب الشكل (1-5)»، كما هو مطبوع:</p>'},
  {fig:'',ref:'ص 101',caption:'قائمة التشغيل كما في الكتاب',draw:()=>IO5_BOOK},
  {err:ERR_ADDR},
  {h:'تهيئة وحدة المدخل التناظري',ref:'ص 101–102',html:`<p>«توصل وحدة الدخل التناظري بحساس درجة الحرارة الثيرموكبل <span class="ltr">Thermocouple K-type</span> وتتم تهيئته كما هو موضح بالشكل (2-5). يتم إدراج موديول <span class="ltr">AI 8x12 bit</span> في مكونات النظام ثم نضغط على العنصر مرتين لفتح خصائصه وسوف تظهر لنا نافذة <span class="ltr">Properties</span> وبها ثلاث نوافذ فرعية هي <span class="ltr">General</span> و <span class="ltr">Address</span> و <span class="ltr">Inputs</span>.»</p>
   <ul><li><b>General:</b> بيانات التوصيف العامة وإمكانية كتابة تعليق.</li><li><b>Address:</b> عناوين قنوات التوصيل (Channels) بدايتها ونهايتها ويمكن تغييرها — نستخدم العنوان <b>PIW290</b>.</li><li><b>Input:</b> بيانات التهيئة المختلفة للموديول: <span class="ltr">Measuring Type = TC-IL</span> و <span class="ltr">Measuring Range = Type K</span>.</li></ul>`},
  {fig:'(2-5)',ref:'ص 102',caption:'تهيئة الموديول AI8xTC في برنامج SIMATIC (معاد رسمها؛ الإطار الأحمر حول المجموعة 0-1 كما في الكتاب)',draw:()=>HWCFG},
  {err:'النص يقول الموديول «AI 8x12 bit» بينما اللقطة في الشكل (2-5) تُظهر «AI8xTC» (موديول ثرموكبل). والنص يسمي النوافذ General و Address و Inputs، واللقطة فيها General و Addresses و Inputs - Part 1 و Inputs - Part 2.'},
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
  runLoop(el,()=>{const c=chain(st.V,st.T),R=tcReading(st.T);$('#vv').textContent=st.V.toFixed(1)+' v';$('#tv').textContent=st.T+' °C';
   $('#fig').innerHTML=fig15({V:st.V,T:clamp(st.T,-999,9999)}).replace('= '+c.piw290,'= '+(ok()?R.v:'?'));
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

function roomSVG(T,Ta,H){const lvl=clamp(T,0,100)/100;let s=`<svg viewBox="0 0 320 180" role="img" aria-label="الغرفة">`;
  s+=`<rect x="10" y="10" width="220" height="150" rx="6" class="sym" fill="${H?'var(--live-soft)':'var(--surface-2)'}"/>`+ar(120,32,'الغرفة','','middle',13);
  s+=`<path d="M30 140h12l6-12 6 24 6-24 6 24 6-24 6 24 6-12h12" fill="none" stroke="${H?'var(--stop)':'var(--wire)'}" stroke-width="${H?3.2:2}"/>`+S.t(72,170,'K1 heater','m');
  s+=S.w('M230 70H200','live')+`<circle cx="198" cy="70" r="4" fill="var(--stop)"/>`+S.t(196,60,'TC','m','end');
  s+=`<rect x="262" y="20" width="18" height="130" rx="9" class="sym" fill="var(--surface)"/><rect x="266" y="${(146-122*lvl).toFixed(1)}" width="10" height="${(122*lvl).toFixed(1)}" rx="5" fill="var(--stop)"/><circle cx="271" cy="158" r="12" fill="var(--stop)"/>`;
  s+=S.t(300,30,'100','m','start')+S.t(300,148,'0','m','start')+S.t(120,92,T.toFixed(1)+' °C','',  'middle',22)+ar(120,118,'الجو المحيط '+Ta+'°','m','middle',11);
  return s+'</svg>'}
function heatPlant(){return {
  title:'الغرفة والسخان',
  init:()=>({T:25,Ta:25,V:5,man:false,Tm:25,SV:50,L80:40,L120:60,H:0,prevH:0,offs:0,reon:0,v:chain(5,25)}),
  step(dt,st,p){const P=st.plc;patchP(P);const H=st.Q('Q4.0');const tau=10;
    if(p.man)p.T=p.Tm;else p.T+=dt*(60*H-(p.T-p.Ta))/tau;
    const c=chain(p.V,p.T);p.v=c;
    Object.assign(P.words,{PIW288:c.piw288,LD0:c.ld0,MD0:r2(c.md0),PIW290:c.piw290,LD10:c.ld10,MD10:r2(c.md10b),MD100:r2(c.md100),MD200:r2(c.md200),MD80:r2(c.md80),MD120:r2(c.md120)});
    p.SV=c.md100;p.L80=c.md80;p.L120=c.md120;
    if(p.prevH&&!H){p.offs++;p.wasOff=1}if(!p.prevH&&H&&p.wasOff)p.reon++;p.prevH=H;p.H=H},
  render(el,st,p){el._p=p;if(!el.querySelector('.u5room')){
    el.innerHTML=`<div class="u5room svgbox" style="max-width:340px;margin-inline:auto"></div>
     <label class="toggle">المقاومة R (الحرارة المطلوبة) <input type="range" data-k="V" min="0" max="10" step="0.1" style="width:150px;height:auto"> <b class="ltr" data-o="V"></b></label>
     <label class="toggle">حرارة الجو المحيط <input type="range" data-k="Ta" min="0" max="40" step="1" style="width:150px;height:auto"> <b class="ltr" data-o="Ta"></b></label>
     <label class="toggle"><input type="checkbox" data-k="man"> تحريك الحرارة يدوياً (بدل نموذج الغرفة)</label>
     <label class="toggle" data-man>الحرارة اليدوية <input type="range" data-k="Tm" min="0" max="100" step="0.5" style="width:150px;height:auto"> <b class="ltr" data-o="Tm"></b></label>
     <div class="facts u5vals"></div>
     <p class="sub">القيم تحسبها الشبكات 1–5 (عمليات الأعداد الحقيقية) قبل الشبكتين 6 و 7. انظر الشرح لرسمها.</p>`;
    el.querySelectorAll('[data-k]').forEach(i=>{const k=i.dataset.k;const q=el._p;if(i.type==='checkbox')i.checked=!!q[k];else i.value=q[k];
      i.addEventListener('input',()=>{const q=el._p;if(i.type==='checkbox'){q[k]=i.checked;if(i.checked)q.Tm=Math.round(q.T*2)/2;const m=el.querySelector('[data-k="Tm"]');m.value=q.Tm}else q[k]=+i.value})})}
    this.frame(el,st,p)},
  frame(el,st,p){if(!el||!el.querySelector('.u5room'))return;el._p=p;const now=performance.now();if(el._t&&now-el._t<90)return;el._t=now;
    el.querySelector('.u5room').innerHTML=roomSVG(p.T,p.Ta,st.Q('Q4.0'));
    const set=(k,t)=>{const o=el.querySelector(`[data-o="${k}"]`);if(o)o.textContent=t};set('V',p.V.toFixed(1)+' v = '+p.SV.toFixed(0)+' °C');set('Ta',p.Ta+' °C');set('Tm',p.Tm+' °C');
    el.querySelector('[data-man]').style.opacity=p.man?1:.45;
    const c=p.v;el.querySelector('.u5vals').innerHTML=[['PIW288',c.piw288],['MD100 مطلوبة',fnum(c.md100,1)],['PIW290',c.piw290],['MD200 فعلية',fnum(c.md200,1)],['MD80 (80٪)',fnum(c.md80,1)],['MD120 (120٪)',fnum(c.md120,1)]].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('')},
  sig:p=>p.man+'|'+p.H,
  label:p=>p.man?'حرارة يدوية':'نموذج الغرفة (توضيحي)',
  readouts:[{l:'الحرارة الفعلية',v:p=>p.T.toFixed(1)+' °C'},{l:'المطلوبة',v:p=>p.SV.toFixed(0)+' °C'},{l:'الحدان',v:p=>p.L80.toFixed(0)+' / '+p.L120.toFixed(0)+' °C'},{l:'السخان',chip:(p,s)=>[s.Q('Q4.0')?'يعمل':'متوقف',s.Q('Q4.0')?'run':'']}],
  chart:{key:'T',ymax:100,ticks:[0,25,50,75,100],unit:'°',span:60,label:'درجة الحرارة مع الزمن (آخر 60 ثانية) — نموذج توضيحي',series:[{key:'SV',color:'--muted'},{key:'L80',color:'--on'},{key:'L120',color:'--stop'}],
   legend:'<span><i style="background:var(--blue)"></i>الحرارة الفعلية MD200</span><span><i style="background:var(--muted)"></i>المطلوبة MD100</span><span><i style="background:var(--on)"></i>80٪ (MD80): حد التشغيل</span><span><i style="background:var(--stop)"></i>120٪ (MD120): حد الإيقاف</span>'}
 }}

B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'103–105',
 title:'خطوات البرنامج وبرنامج LAD للحاكم ذي الموضعين',
 summary:'تحويل القراءتين إلى أعداد حقيقية ومعايرتهما (الشبكات 1–5)، ثم تشغيل السخان عند 80٪ من الحرارة المطلوبة وإيقافه عند 120٪ بدالتي التخزين والإلغاء (الشبكتان 6 و 7).',
 theory:[
  {h:'خطوات عمل البرنامج',ref:'ص 103',html:`<ol><li>للتعبير عن درجة الحرارة المطلوبة بالقيمة العشرية يُحوَّل الرقم من Integer إلى Double Integer بالدالة <b>I_DI</b> ثم إلى Real بالدالة <b>DI_R</b> وتمريرها داخل العنوان LD0.</li>
   <li>ثم تُعايَر درجة الحرارة المطلوبة بحيث: <span class="ltr">0 v = 0 = 0°C</span> و <span class="ltr">10 v = 27648 = 100°C</span>، بدالة القسمة <b>DIV_R</b> على <span class="ltr">27648.0</span> ثم الضرب <b>MUL_R</b> في <span class="ltr">100.0</span> (أقصى درجة حرارة مطلوبة) وتمرر القيمة في <b>MD100</b>.</li>
   <li>للتعبير عن درجة الحرارة الفعلية: I_DI ثم DI_R ثم القسمة على <span class="ltr">10.0</span> وتمريرها في <b>MD200</b>.</li>
   <li>تستخدم دالة المقارنة للمقارنة بين الحرارة الفعلية والمطلوبة.</li>
   <li>يعمل متمم السخان <b>Q4.0</b> إذا كانت الحرارة الفعلية أقل من <b>80٪</b> من الحرارة المطلوبة.</li>
   <li>ويتوقف السخان إذا كانت الحرارة الفعلية أكبر من <b>120٪</b> من الحرارة المطلوبة.</li></ol>
   <p><b>ملاحظة من الكتاب:</b> قبل البدء في تنفيذ الدائرة على (PLC) يجب مراجعة الكتالوج الخاص بالوحدة وتحديد المداخل والمخارج الرقمية والتناظرية وترقيمها حسب المتوفر في المختبر والبلوكات.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مثال: R على 5 v ← PIW288 = 13824 ← 13824 ÷ 27648 × 100 = <b>50°C</b> مطلوبة. فيعمل السخان عندما تنزل الحرارة إلى 40°C (80٪) ويتوقف عندما تتجاوز 60°C (120٪). المسافة بين الحدين تمنع تشغيل السخان وإيقافه بسرعة.'},
  {err:'الخطوة 1 تقول القيمة الحقيقية تُمرَّر في <b>LD0</b>، لكن في البرنامج LD0 هو ناتج I_DI (عدد صحيح مزدوج) والقيمة الحقيقية تذهب إلى <b>MD0</b>. والخطوة 4 مكتوبة «≤CMP» والخطوة 5 تقول «أقل من 80٪» بينما البرنامج يستخدم <span class="ltr">CMP &lt;=R</span> (أقل من <b>أو يساوي</b>).'},
  {h:'ثانياً: برنامج LAD — الشبكات 1–5 (تحويل ومعايرة)',ref:'ص 104',html:'<p>كل شبكة فيها صناديق حسابية موصولة EN ← ENO. القيم الخضراء مثال (R على 5 v والغرفة 25°C):</p>'},
  {fig:'',ref:'ص 104',caption:'Network 1–5 بلغة LAD (معاد رسمها)',draw:()=>mathNets(chain(5,25))},
  {err:'عنوان Network 5 «80% And 120% of <b>Actual</b> Value»، لكن الحساب على <b>MD100</b> وهي القيمة <b>المطلوبة</b> (Set Value)، وهذا المتفق مع خطوات العمل. كذلك يُستخدم MD10 مرتين: ناتجاً وسيطاً في Network 2 ثم يُكتب فوقه في Network 3 (لا يضر لأن Network 2 استهلكه قبلها). والإملاء «Temprature» و «Scalling» كما في الكتاب.'},
  {h:'الشبكتان 6 و 7 (التخزين والإلغاء بالمقارنات)',ref:'ص 105',html:'<ul><li><b>Network 6 : Start Heating</b> — I0.1 (Start "S1") على التوالي مع مقارن <span class="ltr">CMP &lt;=R</span> (IN1 = MD200، IN2 = MD80) ← ملفا <b>(S)</b> للمخرجين Q4.0 Heater "K1" و Q4.1 Heater Lamp "H1".</li><li><b>Network 7 : End Heating</b> — [ I0.0 (stop "S0") ∥ <span class="ltr">CMP &gt;R</span> (IN1 = MD200، IN2 = MD120) ] ← ملفا <b>(R)</b> للمخرجين Q4.0 و Q4.1.</li></ul>'},
  {draw:'lad',caption:'Network 6–7 بلغة LAD (النسخة المختارة حالياً)',ref:'ص 105'},
  {note:'المحاكي يرسم الشبكتين من STL مكافئ (الكتاب أعطاهما بلغة LAD فقط): <span class="ltr">L MD 200 / L MD 80 / &lt;=R</span> هو صندوق المقارنة نفسه.'},
  {err:'<b>سلوك يختلف عن خطوات العمل (يغيّر عمل البرنامج):</b> شرط التشغيل في Network 6 هو <b>S1 مضغوط و</b> الحرارة ≤ 80٪. و S1 «ضاغط» حسب الجدول. فبعد أن يفصل السخان عند تجاوز 120٪ لن يعود للعمل تلقائياً عندما تنخفض الحرارة إلى 80٪ إلا إذا ضُغط S1 مرة أخرى في تلك اللحظة، بينما الخطوتان 5 و 6 تصفان تشغيلاً وإيقافاً تلقائياً (حاكم ذو موضعين). <b>المصحح</b> يضيف علامة M0.0 يثبتها S1 ويلغيها S0، وتحل محل I0.1 في Network 6. بدّل بين النسختين في المختبر.'},
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
 variants:{default:'book',note:'Network 6 في الكتاب يشترط أن يكون S1 مضغوطاً لحظة نزول الحرارة إلى 80٪. المصحح يحفظ أمر التشغيل في M0.0.',
  book:{label:'كما في الكتاب',program:[N6('I'),N7],note:'كما في الكتاب (ص 105): <span class="ltr">I0.1 AND MD200 &lt;= MD80</span>. بعد أول إيقاف عند 120٪ لا يعود السخان للعمل وحده.'},
  fixed:{label:'المصحح',program:[NM,N6('M'),N7],note:'المصحح: أضيفت شبكة تحفظ أمر S1 في M0.0 (يلغيها S0)، و Network 6 تستخدم M0.0 بدل I0.1. يعمل الحاكم ذو الموضعين تلقائياً بين 80٪ و 120٪.'}},
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
 theory:[
  {h:'ملاحظة الكتاب قبل البرنامج',ref:'ص 105',html:'<p>«في حالة عدم توفر حساس درجة الحرارة الثرموكبل يمكن استخدام مقاومة لمحاكاة عمله بحيث يكون دخل درجة الحرارة الفعلية ممثلاً بجهد من 0 إلى 10 فولت. البرنامج التالي يبين ذلك مكتوباً بلغة قائمة الإجراءات STL».</p>'},
  {h:'دائرة STL باستخدام دالة التخزين مع دالة الإلغاء والإبقاء',ref:'ص 106',html:'<p>منقول حرفياً (الأسطر الفارغة كما في الكتاب):</p>'},
  {fig:'',ref:'ص 106',caption:'برنامج STL كما في الكتاب',draw:()=>`<table class="stl"><tbody>${STL_BOOK.map(o=>{const p=o.l.trim().split(/\s+/);return `<tr><td>${B.esc(p[0]||'')}</td><td>${B.esc(p.slice(1).join(' '))}</td></tr>`}).join('')}</tbody></table>`},
  {html:`<table class="tt"><thead><tr><th>التعليمة</th><th>ما تفعله (ACCU1 = المركم 1، ACCU2 = المركم 2)</th></tr></thead><tbody>
   <tr><td class="ltr">L PIW 290</td><td>تحميل قراءة المدخل التناظري في ACCU1 (وما كان في ACCU1 ينتقل إلى ACCU2)</td></tr>
   <tr><td class="ltr">ITD</td><td>تحويل ACCU1 من Integer إلى Double Integer (مثل I_DI)</td></tr>
   <tr><td class="ltr">DTR</td><td>تحويل ACCU1 من Double Integer إلى Real (مثل DI_R)</td></tr>
   <tr><td class="ltr">/R ، *R</td><td>ACCU1 = ACCU2 ÷ ACCU1 ، ACCU1 = ACCU2 × ACCU1 (أعداد حقيقية)</td></tr>
   <tr><td class="ltr">T MD 200</td><td>نقل ACCU1 إلى العنوان MD200</td></tr>
   <tr><td class="ltr">&lt;=R ، &gt;R</td><td>مقارنة ACCU2 مع ACCU1، والنتيجة RLO</td></tr>
   <tr><td class="ltr">S Q 4.0 ، R Q 4.0</td><td>تثبيت / إلغاء السخان إذا كانت RLO = 1</td></tr></tbody></table>`},
  {err:'<b>مقياس الحرارة الفعلية مختلف عن LAD:</b> في LAD تُقسم قراءة الثرموكبل على 10.0، وفي STL تُقسم على 27648.0 وتُضرب في 100.0 (0–10 v ← 0–100°C). هذا مقصود حسب ملاحظة الكتاب (محاكاة الثرموكبل بمقاومة)، لكن البرنامج ما زال يقرأ العنوان <span class="ltr">PIW 290</span>. كذلك السطر <span class="ltr">L MD 200</span> بعد <span class="ltr">T MD 200</span> مباشرة ثم <span class="ltr">L PIW 288</span> تحميل زائد بلا أثر.'},
  {err:'<b>STL ناقص مقارنة بـ LAD (يغيّر عمل البرنامج):</b> لا يتضمن الضاغط S1 (I0.1) ولا S0 (I0.0) ولا المصباح Q4.1؛ فقط <span class="ltr">S Q 4.0</span> عند <span class="ltr">&lt;=R</span> و <span class="ltr">R Q 4.0</span> عند <span class="ltr">&gt;R</span>. النتيجة: السخان يعمل تلقائياً بمجرد تشغيل الـ PLC ولا يمكن إيقافه بضاغط. <b>المصحح</b> في المختبر يضيف S1 و S0 بعلامة M0.0 والمصباح H1 (الأسطر المضافة مظللة).'},
  {h:'والمطلوب',ref:'ص 105',html:'<p>«إعادة كتابة البرنامج السابق باستخدام لغة FBD ولغة STL.» برنامج STL أعلاه هو صيغة الكتاب لمحاكاة الثرموكبل. نفّذه في المختبر سطراً سطراً وراقب المركمين.</p>'}
 ],
 lab:(el)=>{
  const S={src:'pot',Va:2,Vs:5,Ta:25,T:25,var:'book',step:false,pc:0,cnt:0,t:0,cyc:0,prevQ:0,wasOff:0,s1:0,s0:0,flags:{}};
  let mem={bits:{},words:{},a1:0,a2:0,t1:'',t2:'',rlo:false,fc:true},trace=[];const hist=[];let ht=0,rt=0;
  const prog=()=>S.var==='fixed'?STL_FIX:STL_BOOK;
  el.innerHTML=`<div class="variant"><span>نسخة البرنامج:</span><div class="seg" role="group"><button data-var="book" aria-pressed="true">كما في الكتاب</button><button data-var="fixed" aria-pressed="false">المصحح</button></div><div class="callout err" id="vnote"></div></div>
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
  const hdr=()=>{const f=S.var==='fixed';$('#vnote').innerHTML=f?'المصحح: أضيف S1 و S0 بالعلامة M0.0 (مثل المصحح في الدرس 5.3) والمصباح H1 مع السخان.':'كما في الكتاب (ص 106): لا يوجد S1 ولا S0 ولا H1. السخان يُثبَّت ويُلغى بالمقارنة فقط.';
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
   if(!S.step){S.t+=dt;const H=mem.bits['Q4.0']?1:0;if(S.src==='room')S.T+=dt*(60*H-(S.T-S.Ta))/10;scan();
     const q=mem.bits['Q4.0']?1:0;if(S.prevQ&&!q)S.wasOff=1;if(!S.prevQ&&q&&S.wasOff)S.cyc++;S.prevQ=q;
     ht+=dt;if(ht>0.1){ht=0;hist.push({t:S.t,v:mem.words.MD200||0,a:mem.words.MD80||0,b:mem.words.MD120||0});while(hist.length&&S.t-hist[0].t>60.3)hist.shift()}
     rt+=dt;if(rt>0.25){rt=0;drawStl()}}
   $('#vav').textContent=S.Va.toFixed(1)+' v';$('#vsv').textContent=S.Vs.toFixed(1)+' v';$('#tav').textContent=S.Ta+' °C';
   $('#lq0').classList.toggle('on',!!mem.bits['Q4.0']);$('#lq1').classList.toggle('on',!!mem.bits['Q4.1']);
   const w=mem.words;$('#vals').innerHTML=[['PIW290',w.PIW290||0],['PIW288',w.PIW288||0],['MD200 فعلية',fnum(w.MD200||0,1)+' °C'],['MD100 مطلوبة',fnum(w.MD100||0,1)+' °C'],['MD80',fnum(w.MD80||0,1)],['MD120',fnum(w.MD120||0,1)]].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('')+(S.src==='room'?`<div class="fact"><span>حرارة الغرفة</span><b>${S.T.toFixed(1)} °C</b></div>`:'');
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
