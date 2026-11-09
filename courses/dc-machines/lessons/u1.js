/* Unit 1 — تمهيد المعمل + تجارب مولدات التيار المستمر (التجارب 1–4) — ص 3–21
   Lessons u1-l1 … u1-l5. One shared DC-machine model (magnetisation curve with residual flux, armature
   resistance, optional brush drop, optional armature reaction) drives all four generator benches. */
(function(B){
const {S}=B;

/* Experiment 2 speed: step 2 prints 1500 rpm, table (2-1) header prints n = 1400 r.p.m — PENDING trainer decision.
   Change this one constant and the theory, the table header, the bench and the steps all follow. */
const EXP2_N = 1500;

const fm=(x,d)=>{const s=B.fmtN(x,d);return typeof s==='string'&&/^-0(\.0+)?$/.test(s)?s.slice(1):s};
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;
const sgn=(v,d)=>(B.round(v,d==null?6:d)<0?'−':'')+fm(Math.abs(v),d);
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('dcu1-css'))return;const s=document.createElement('style');s.id='dcu1-css';s.textContent=`
.dc-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.dc-sl .dc-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.dc-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.dc-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.dc-row{display:flex;gap:8px 12px;flex-wrap:wrap;margin-top:10px;align-items:center}
.dc-row .sub{margin:0}
.dc-fine{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;direction:ltr;justify-content:flex-end}
.dc-fine .btn{padding:4px 9px;font-family:var(--mono);font-size:13px}
.dc-chips{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
.dc-chips .btn{padding:4px 10px;font-size:13px}
.dc-chips .btn[aria-pressed="true"]{background:var(--blue);color:#fff;border-color:var(--blue)}
.dc-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px;margin-top:10px}
.dc-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 8px;text-align:center;min-width:0}
.dc-meter span{display:block;font-size:12px;color:var(--muted)}
.dc-meter b{font:700 19px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.dc-tbl{overflow-x:auto;margin-top:8px}
.dc-tbl table.tt{min-width:100%}
.dc-tbl table.tt td,.dc-tbl table.tt th{padding:6px 6px;text-align:center;font-family:var(--mono);font-size:13px;white-space:nowrap}
.dc-tbl table.tt th:first-child{font-family:var(--font)}.dc-tbl table.tt td:first-child{font-family:var(--font);background:var(--surface-2)}
.dc-tbl td.cur,.dc-tbl th.cur{background:var(--live-soft)!important;color:var(--fg)!important;font-weight:700}
.dc-tbl td.fill{color:var(--blue-ink);font-weight:700}
.dc-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.dc-chip.ok{background:var(--on-soft);color:var(--on)}
.dc-chip.warn{background:var(--live-soft);color:var(--live)}
.dc-chip.bad{background:var(--stop-soft);color:var(--stop)}
.dc-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.dc-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.dc-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.dc-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.dc-leg i{display:inline-block;width:12px;height:12px;border-radius:50%;vertical-align:middle;margin-inline-end:5px}
.dc-lab .seg{flex-wrap:wrap;max-width:100%}
.dc-lab .seg button{white-space:nowrap}
.svgbox.dc-wide svg{min-width:640px}
.dc-msg:empty{display:none}
.dc-sw{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.dc-sw .btn[aria-pressed="true"]{background:var(--on-soft);border-color:var(--on);color:var(--on)}
.dc-sw .btn.red[aria-pressed="true"]{background:var(--stop-soft);border-color:var(--stop);color:var(--stop)}
.dc-fit svg{touch-action:none;user-select:none;-webkit-user-select:none}
.dc-fit .hd{cursor:ns-resize}
.dc-lab .ex-f{overflow-x:auto;overflow-y:hidden;max-width:100%}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local copies, as in the other courses) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="dc-sl"><span class="dc-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const fineHTML=(attr,ds,unit)=>`<div class="dc-fine">${ds.map(d=>`<button class="btn" data-${attr}="${d}">${d>0?'+':'−'}${fm(Math.abs(d))}${unit?' '+unit:''}</button>`).join('')}</div>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const meter=(l,v)=>`<div class="dc-meter"><span>${l}</span><b>${v}</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max,wide)=>`<div class="svgbox${wide?' dc-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="dc-q"><summary>${n} ${q}</summary><div class="dc-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.2;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(10,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* zig-zag resistor between two points (+ optional variable arrow) */
function zig(x1,y1,x2,y2,n,cls,vr){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.14,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  let o=`<path class="w ${cls||''}" d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`;
  if(vr){const mx=(x1+x2)/2,my=(y1+y2)/2;o+=arrow(mx-ux*20-nx*16,my-uy*20-ny*16,mx+ux*20+nx*16,my+uy*20+ny*16,'--blue',1.6)}
  return o}
/* winding (loops) between two points */
function ind(x1,y1,x2,y2,n,cls){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* meter symbol: circle with letter; reading text placed at (rx,ry) */
function mtr(x,y,l,rd,rx,ry,anc){return `<circle cx="${x}" cy="${y}" r="14" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x,y+4.5,l,'')+(rd!=null?`<text class="txt b" x="${rx}" y="${ry}" text-anchor="${anc||'middle'}" font-size="12.5">${rd}</text>`:'')}
/* DC machine: circle + brushes + rotating mark (id) */
function machSym(cx,cy,r,lbl,id,ang){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+
  `<rect x="${cx-7}" y="${cy-r-4}" width="14" height="8" fill="var(--fg)"/><rect x="${cx-7}" y="${cy+r-4}" width="14" height="8" fill="var(--fg)"/>`+
  `<g id="${id}" transform="rotate(${fx(ang||0)} ${cx} ${cy})"><path d="M${cx} ${cy-r+7}V${cy-r+16}" stroke="var(--blue)" stroke-width="4" stroke-linecap="round"/></g>`+S.t(cx,cy+6,lbl,'',null,18)}
/* tacho on a shaft + speed display */
function tacho(x,y,dispY,rd){return `<rect x="${x-14}" y="${y-11}" width="28" height="22" rx="3" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(x,y-15,'Tacho','m')+
  `<path d="M${x} ${y-11}V${dispY+15}" stroke="var(--muted)" stroke-dasharray="3 3"/><rect x="${x-40}" y="${dispY-15}" width="80" height="30" rx="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`+
  `<text class="txt b" x="${x}" y="${dispY+5}" text-anchor="middle" font-size="13">${rd}</text>`+S.t(x,dispY-21,'Speed','m')}
function nice(x){x=Math.max(Math.abs(x),1e-9);const e=Math.pow(10,Math.floor(Math.log10(x)));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*e>=x*0.9999)return k*e;return 10*e}
function ticks(a,b){const span=b-a,st=(x=>{const e=Math.pow(10,Math.floor(Math.log10(x)));for(const k of [1,2,2.5,5,10])if(k*e>=x*0.9999)return k*e})(span/5);const out=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st)out.push(+v.toPrecision(10));return out}
/* x-y plot with point markers. o:{w,h,x0,x1,y0,y1,xl,yl,series:[{pts,col,line,hollow}],live:[x,y],aria} */
function plotXY(o){const W=o.w||560,H=o.h||290,L=50,R=14,T=16,Bm=38;const x0=o.x0||0,y0=o.y0||0;
  const X=x=>L+(x-x0)/(o.x1-x0)*(W-L-R),Y=y=>H-Bm-(y-y0)/(o.y1-y0)*(H-T-Bm);
  let s='';ticks(y0,o.y1).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),fm(v),'m','end')});
  ticks(x0,o.x1).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,fm(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(y0<0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  s+=S.t(W-R,H-5,o.xl||'','','end')+S.t(L+4,T+10,o.yl||'','','start');
  s+=`<g clip-path="url(#${o.cid||'dcclip'})">`;
  (o.series||[]).forEach(se=>{const p=se.sort===false?se.pts.slice():se.pts.slice().sort((a,b)=>a[0]-b[0]);
    if(se.line!==false&&p.length>1)s+=`<path d="${p.map((q,i)=>(i?'L':'M')+fx(X(q[0]))+' '+fx(Y(q[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="2.2" stroke-linejoin="round"/>`;
    p.forEach(q=>{s+=se.hollow?`<rect x="${fx(X(q[0])-4)}" y="${fx(Y(q[1])-4)}" width="8" height="8" fill="var(--surface)" stroke="var(${se.col})" stroke-width="2"/>`:`<circle cx="${fx(X(q[0]))}" cy="${fx(Y(q[1]))}" r="4.4" fill="var(${se.col})"/>`})});
  if(o.live&&isFinite(o.live[0])&&isFinite(o.live[1]))s+=`<circle cx="${fx(X(o.live[0]))}" cy="${fx(Y(o.live[1]))}" r="7" fill="none" stroke="var(--stop)" stroke-width="2"/><circle cx="${fx(X(o.live[0]))}" cy="${fx(Y(o.live[1]))}" r="2" fill="var(--stop)"/>`;
  s+='</g>';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${o.cid||'dcclip'}"><rect x="${L-8}" y="${T-8}" width="${W-L-R+16}" height="${H-T-Bm+16}"/></clipPath></defs>${s}</svg>`}
function stepsHTML(steps){return `<ol class="ex-steps">${steps.map(st=>`<li class="${st.final?'final':''}">${st.t?`<div class="ex-t">${st.t}</div>`:''}${st.f?`<div class="ex-f">${B.tex(st.f,true)}</div>`:''}${st.v!=null?`<div class="ex-v"><span class="ltr">${fm(st.v,st.dp)} ${st.unit||''}</span></div>`:''}</li>`).join('')}</ol>`}

/* ======================================================================
   THE SHARED DC-MACHINE MODEL (أرقام توضيحية — الحقيبة لا تعطي قيم الآلات)
   ----------------------------------------------------------------------
   Magnetisation (open-circuit) curve at the reference speed nref, as a function of the net field
   "ampere" F (field current, plus series-field effect, minus armature-reaction effect):
        Emag(F) = Er + A·F/(Fk + |F|)     with A chosen so that Emag(0.3 A) = E03
   Generated EMF at speed n:  E = (n/nref)·Emag(F)          (E ∝ Φ·n)
   Armature:   Va = E − Ia·Ra − Vbrush(Ia)                   (brush drop optional: Vb = 0 → off)
   Armature reaction (optional, kar = 0 → off):  F = F0 − kar·|Ia|
   Shunt field (self-excited): Rf·Ish + Tf·Rf·dIsh/dt = Va   (build-up from the residual voltage)
   Drive motor (shunt motor, field taken as constant): Eb = kE·φ·n, Ia_m = (Vs − Eb)/(Ram + Rst),
        steady speed when Ia_m = I0 + P_gen/Eb, reached with the acceleration time constant tau.
   The SAME parameter set (stored under one id 'u1-dcm') is used by the four benches, so the machine is
   the same in all four experiments; each bench shows only the fields it uses.
   ====================================================================== */
const MD={
 nref:{label:'سرعة الآلة التي رُسم عندها منحنى المغنطة',unit:'rpm',value:1500,min:100,max:6000,step:10},
 Er:{label:'الجهد المتبقي (تيار المجال = 0) عند تلك السرعة',unit:'V',value:8,min:0,max:200,step:0.5},
 E03:{label:'القوة الدافعة عند تيار مجال 0.3 A وعند تلك السرعة',unit:'V',value:220,min:5,max:2000,step:1},
 Fk:{label:'تيار «الركبة» في منحنى المغنطة (كلما صغر بدأ التشبع أبكر)',unit:'A',value:0.3,min:0.02,max:10,step:0.01},
 Ra:{label:'مقاومة دائرة المنتج للمولد R<sub>a</sub>',unit:'Ω',value:2.5,min:0,max:100,step:0.1},
 Vb:{label:'هبوط الجهد على الفرش (اكتب 0 لإهماله)',unit:'V',value:2,min:0,max:20,step:0.1},
 kar:{label:'رد فعل المنتج: كم ينقص تيار المجال الفعّال لكل 1 A في المنتج (اكتب 0 لإهماله)',unit:'A/A',value:0.008,min:0,max:0.2,step:0.001},
 Rsh:{label:'مقاومة ملف مجال التوازي',unit:'Ω',value:650,min:20,max:20000,step:1},
 Tf:{label:'ثابت زمن ملف المجال (سرعة بناء الجهد أو انهياره)',unit:'s',value:0.5,min:0.05,max:20,step:0.05},
 Vrat:{label:'الجهد المقنن للمولد',unit:'V',value:220,min:5,max:2000,step:1},
 Irat:{label:'تيار الحمل المقنن للمولد',unit:'A',value:4,min:0.05,max:100,step:0.05},
 nrat:{label:'السرعة المقننة للمولد (التجربة الرابعة)',unit:'rpm',value:1500,min:100,max:6000,step:10},
 RLmax:{label:'مقاومة الحمل المتغيرة عند الوضع 100%',unit:'Ω',value:220,min:1,max:100000,step:1},
 Rse:{label:'مقاومة ملف التوالي D1–D2',unit:'Ω',value:0.5,min:0,max:50,step:0.1},
 kse:{label:'قوة ملف التوالي: كل 1 A حمل فيه يعادل كم أمبير في ملف التوازي',unit:'A/A',value:0.015,min:0,max:1,step:0.001},
 Rfgmax:{label:'أكبر قيمة لمقاومة مجال المولد R<sub>fg</sub>',unit:'Ω',value:400,min:10,max:20000,step:1},
 Rlamp:{label:'مقاومة المصباح الواحد وهو مضاء (نعتبرها ثابتة)',unit:'Ω',value:380,min:5,max:100000,step:1},
 n0:{label:'سرعة المحرك المدير بلا حمل عند 220 V',unit:'rpm',value:1450,min:100,max:6000,step:10},
 Ram:{label:'مقاومة منتج المحرك المدير',unit:'Ω',value:2,min:0.05,max:100,step:0.05},
 I0:{label:'تيار المحرك المدير بلا حمل (يغطي الاحتكاك)',unit:'A',value:0.5,min:0,max:20,step:0.05},
 Rst:{label:'مقاومة البدء R<sub>st</sub>',unit:'Ω',value:30,min:1,max:2000,step:1},
 Rfmmax:{label:'أكبر قيمة لمقاومة مجال المحرك R<sub>fm</sub>',unit:'Ω',value:300,min:1,max:20000,step:1},
 tau:{label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.8,min:0.05,max:30,step:0.05}
};
const tpDefs=keys=>keys.map(k=>Object.assign({k},MD[k]));
const TPID='u1-dcm';
function mach(v){const A=Math.max(v.E03-v.Er,0.5)*(v.Fk+0.3)/0.3;
  const Emag=F=>v.Er+A*F/(v.Fk+Math.abs(F));
  return {A,Emag,E:(F,n)=>n/Math.max(v.nref,1)*Emag(F),vb:Ia=>{const a=Math.abs(Ia);return a>0?Math.sign(Ia)*(v.Vb||0)*a/(a+0.1):0}}}
/* armature solution for a given speed and given field currents.
   o:{n, Isep (separately-excited field current, signed), Ish (shunt-coil current), sig (+1/−1 shunt coil orientation),
      RL (Ω, Infinity = open), Rse (series field in the load path), s (+1/−1/0 series orientation), noAR, noVb} */
function armSolve(v,o){const M=mach(v),Rse=o.Rse||0,RLt=isFinite(o.RL)?o.RL+Rse:Infinity,kar=o.noAR?0:v.kar,Ra=v.Ra;
  const r=Va=>{const IL=isFinite(RLt)?Va/RLt:0,Ish=o.Ish||0,Ia=IL+Ish;
    const F0=(o.Isep||0)+(o.sig||1)*Ish+(o.s?o.s*v.kse*IL:0);const F=F0-(F0<0?-1:1)*kar*Math.abs(Ia);
    const E=M.E(F,o.n),vb=o.noVb?0:M.vb(Ia);return {res:E-Ia*Ra-vb-Va,IL,Ia,E,F,vb}};
  const top=2*(Math.abs(v.Er)+M.A)*Math.max(o.n,0)/Math.max(v.nref,1)+50;let lo=-top,hi=top;
  for(let k=0;k<64;k++){const m=(lo+hi)/2;if(r(m).res>0)lo=m;else hi=m}
  const Va=(lo+hi)/2,q=r(Va);return Object.assign(q,{Va,VL:Va-q.IL*Rse})}
const kEof=v=>Math.max(220-v.I0*v.Ram,1)/Math.max(v.n0,1);
/* one time step of the drive motor. o:{on,Vs,Rst,phi,Pg} */
function motorStep(S,v,dt,o){const phi=o.phi||1,kE=kEof(v)*phi,R=v.Ram+(o.Rst||0),Eb=kE*S.n;
  S.Im=o.on?Math.max(0,(o.Vs-Eb)/R):0;
  const Ireq=v.I0+Math.max(0,o.Pg||0)/Math.max(Eb,1);
  S.nss=o.on?Math.max(0,(o.Vs-Ireq*R)/kE):0;
  S.n+=(S.nss-S.n)*(1-Math.exp(-dt/Math.max(v.tau,0.01)));if(Math.abs(S.n-S.nss)<0.02)S.n=S.nss;}
/* critical speed of the shunt generator (field line tangent to the curve at the origin; Ra·If neglected) */
const nCrit=(v,Rf)=>v.nref*Rf*v.Fk/mach(v).A;

/* ---------- book tables in the lab ---------- */
/* T={cols:[{k,label}], head:'quantity label', rows:[{k,label,dp}], data:{colKey:{...}}, free:[{...}]} */
function tableHTML(T,cur){return `<div class="dc-tbl"><table class="tt"><thead><tr><th>${T.head}</th>${T.cols.map(c=>`<th class="${c.k===cur?'cur':''}">${c.label}</th>`).join('')}</tr></thead><tbody>${T.rows.map(r=>`<tr><td>${r.label}</td>${T.cols.map(c=>{const d=T.data[c.k];return `<td class="${c.k===cur?'cur':''} ${d?'fill':''}">${d?sgn(d[r.k],r.dp):''}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>`+
  (T.free.length?`<p class="sub" style="margin-top:8px">قراءات حرة (خارج نقاط الجدول): ${T.free.map(f=>lt(T.freeText(f))).join('، ')}</p>`:'')}
const tblDone=T=>T.cols.every(c=>T.data[c.k]);
const tblPts=(T,xk,yk)=>T.cols.filter(c=>T.data[c.k]).map(c=>[T.data[c.k][xk],T.data[c.k][yk]]);
/* voltage regulation from recorded rows (إضافة من خارج الكتاب) */
function vrSteps(pts,Irat){const p=pts.slice().sort((a,b)=>a[0]-b[0]);const nl=p.find(q=>Math.abs(q[0])<0.005);
  if(!nl)return {msg:'سجّل قراءة بلا حمل (I<sub>L</sub> = 0) أولاً: منها جهد اللاحمل V<sub>NL</sub>.'};
  const ld=p.filter(q=>q[0]>=0.005);if(!ld.length)return {msg:'سجّل قراءة واحدة على الأقل والمولد محمّل.'};
  let Vfl,how;const mx=ld[ld.length-1];
  if(mx[0]>=Irat-1e-9){let a=nl,b=null;for(const q of p){if(q[0]>=Irat-1e-9){b=q;break}a=q}
    Vfl=b[0]===a[0]?b[1]:a[1]+(b[1]-a[1])*(Irat-a[0])/(b[0]-a[0]);how=`عند التيار المقنن ${lt(fm(Irat)+' A')} (بالاستكمال الخطي بين أقرب قراءتين)`}
  else{Vfl=mx[1];how=`لم تصل قراءاتك إلى التيار المقنن ${lt(fm(Irat)+' A')}، فأخذنا أكبر حمل سجّلته ${lt('I<sub>L</sub> = '+fm(mx[0],2)+' A')}`}
  Vfl=B.round(Vfl,1);const VR=(nl[1]-Vfl)/Vfl*100;
  return {VR,steps:[{t:'جهد اللاحمل (I<sub>L</sub> = 0) من الجدول:',f:'V_{NL}',v:nl[1],unit:'V',dp:1},{t:'جهد الحمل الكامل '+how+':',f:'V_{FL}',v:Vfl,unit:'V',dp:1},
   {t:'معامل تنظيم الجهد (إضافة من خارج الكتاب):',f:`VR=\\frac{V_{NL}-V_{FL}}{V_{FL}}\\times100=\\frac{${fm(nl[1],1)}-${fm(Vfl,1)}}{${fm(Vfl,1)}}\\times100`,v:B.round(VR,2),unit:'%',dp:2,final:true}]}}
const VRBLOCK={h:'معامل تنظيم الجهد — إضافة من خارج الكتاب',html:`<p>تطلب أهداف التجربة «حساب معامل تنظيم الجهد» لكن الحقيبة لا تعطي قانونه. القانون المعتاد:</p>
  $$VR\\%=\\frac{V_{NL}-V_{FL}}{V_{FL}}\\times 100$$
  <p>\\(V_{NL}\\): الجهد على أطراف المولد بلا حمل، و\\(V_{FL}\\): الجهد عند الحمل الكامل (التيار المقنن)، والسرعة وضبط المجال ثابتان. كلما صغر \\(VR\\) كان المولد أفضل في المحافظة على جهده. في المختبر يُحسب \\(VR\\) من قراءاتك مباشرة: \\(V_{NL}\\) من قراءة اللاحمل، و\\(V_{FL}\\) عند التيار المقنن التوضيحي بالاستكمال بين أقرب قراءتين.</p>`};

/* ======================================================================
   Lesson 1 — تمهيد: السلامة في المختبر، كتابة التقرير، رسم أقرب منحنى (ص 3–9)
   ====================================================================== */
function rng(seed){let a=seed>>>0;return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
const SPf=x=>0.88-0.05*x-0.34*x*x, TQf=x=>0.08+1.25*x-0.45*x*x;   // shapes of the figure (no numbers in the book)
function figApts(seed){const r=rng(seed);const sp=[],tq=[];
  for(let i=0;i<9;i++){const x=0.06+i*0.88/8+(r()-0.5)*0.04;sp.push([x,SPf(x)+(r()-0.5)*0.09])}
  for(let i=0;i<8;i++){const x=0.08+i*0.86/7+(r()-0.5)*0.04;tq.push([x,TQf(x)+(r()-0.5)*0.09])}
  return {sp,tq}}
/* least-squares quadratic → [a,b,c] for y=a+bx+cx² */
function lsq2(p){let S0=p.length,S1=0,S2=0,S3=0,S4=0,T0=0,T1=0,T2=0;p.forEach(([x,y])=>{S1+=x;S2+=x*x;S3+=x*x*x;S4+=x*x*x*x;T0+=y;T1+=x*y;T2+=x*x*y});
  const M=[[S0,S1,S2,T0],[S1,S2,S3,T1],[S2,S3,S4,T2]];for(let i=0;i<3;i++){let m=i;for(let k=i+1;k<3;k++)if(Math.abs(M[k][i])>Math.abs(M[m][i]))m=k;[M[i],M[m]]=[M[m],M[i]];
   for(let k=0;k<3;k++)if(k!==i){const f=M[k][i]/M[i][i];for(let j=i;j<4;j++)M[k][j]-=f*M[i][j]}}return [M[0][3]/M[0][0],M[1][3]/M[1][1],M[2][3]/M[2][2]]}
const HX=[0.08,0.5,0.92];
const quad3=ys=>x=>{const [x0,x1,x2]=HX,[y0,y1,y2]=ys;return y0*(x-x1)*(x-x2)/((x0-x1)*(x0-x2))+y1*(x-x0)*(x-x2)/((x1-x0)*(x1-x2))+y2*(x-x0)*(x-x1)/((x2-x0)*(x2-x1))};
const rms=(p,f)=>Math.sqrt(p.reduce((s,[x,y])=>s+(y-f(x))**2,0)/p.length);
const FA={L:96,R:620,T:24,Bt:340};
const fax=x=>FA.L+x*(FA.R-FA.L),fay=y=>FA.Bt-y*(FA.Bt-FA.T);
const curvePath=f=>{let d='';for(let i=0;i<=60;i++){const x=i/60;d+=(i?'L':'M')+fx(fax(x))+' '+fx(fay(clamp(f(x),-0.05,1.05)))}return d};
const plusMk=(x,y,col)=>`<path d="M${fx(fax(x)-5)} ${fx(fay(y))}h10M${fx(fax(x))} ${fx(fay(y)-5)}v10" stroke="var(${col})" stroke-width="2"/>`;
const starMk=(x,y,col)=>{const cx=fax(x),cy=fay(y);return `<path d="M${fx(cx-5)} ${fx(cy)}h10M${fx(cx-2.5)} ${fx(cy-4.3)}l5 8.6M${fx(cx+2.5)} ${fx(cy-4.3)}l-5 8.6" stroke="var(${col})" stroke-width="1.8"/>`};
function figAframe(){return `<path d="M${FA.L} ${FA.T-6}V${FA.Bt}H${FA.R+8}" stroke="var(--fg)" stroke-width="1.6" fill="none"/><path d="M${FA.L-26} ${FA.T-6}V${FA.Bt}" stroke="var(--fg)" stroke-width="1.6"/>`+
  arrow(FA.R,FA.Bt,FA.R+14,FA.Bt,'--fg',1.6)+S.t(FA.R+6,FA.Bt+24,'load current','','end')+
  `<text class="txt" transform="translate(${FA.L-34} ${(FA.T+FA.Bt)/2}) rotate(-90)" text-anchor="middle">torque</text><text class="txt" transform="translate(${FA.L-8} ${(FA.T+FA.Bt)/2}) rotate(-90)" text-anchor="middle">speed</text>`}
function figAstatic(){const p=figApts(7);const fs=lsq2(p.sp),ft=lsq2(p.tq),f=c=>x=>c[0]+c[1]*x+c[2]*x*x;
  return `<svg viewBox="0 0 660 370" role="img" aria-label="الشكل (أ): رسم أقرب منحنى لنقاط معملية">${figAframe()}<path d="${curvePath(f(fs))}" fill="none" stroke="var(--blue)" stroke-width="2.4"/><path d="${curvePath(f(ft))}" fill="none" stroke="var(--live)" stroke-width="2.4"/>`+
   p.sp.map(q=>plusMk(q[0],q[1],'--blue')).join('')+p.tq.map(q=>starMk(q[0],q[1],'--live')).join('')+
   S.t(fax(0.12),fay(0.93),'+ speed','b','start')+`<text class="txt" x="${fax(0.8)}" y="${fay(0.62)}" style="fill:var(--live)">* torque</text></svg>`}

/* analog ammeter for the range-selection mini lab */
function gaugeSVG(I,rg){const cx=170,cy=170,r=130,a0=-60,a1=60;const k=rg?I/rg:0,over=k>1;const a=(a0+(a1-a0)*clamp(k,0,1.06))*Math.PI/180;
  let s=`<svg viewBox="0 0 340 210" role="img" aria-label="جهاز أميتر بتدريج قابل للتغيير"><rect x="10" y="10" width="320" height="190" rx="14" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  s+=`<path d="M${fx(cx+r*Math.sin(a0*Math.PI/180))} ${fx(cy-r*Math.cos(a0*Math.PI/180))}A${r} ${r} 0 0 1 ${fx(cx+r*Math.sin(a1*Math.PI/180))} ${fx(cy-r*Math.cos(a1*Math.PI/180))}" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let i=0;i<=50;i++){const t=(a0+(a1-a0)*i/50)*Math.PI/180,L=i%10===0?14:i%5===0?9:5;s+=`<path d="M${fx(cx+r*Math.sin(t))} ${fx(cy-r*Math.cos(t))}L${fx(cx+(r-L)*Math.sin(t))} ${fx(cy-(r-L)*Math.cos(t))}" stroke="var(--fg)" stroke-width="${i%10?1:1.6}"/>`;
    if(i%10===0&&rg)s+=S.t(fx(cx+(r-26)*Math.sin(t)),fx(cy-(r-26)*Math.cos(t)+4),fm(rg*i/50),'m')}
  s+=`<path d="M${cx} ${cy}L${fx(cx+(r-6)*Math.sin(a))} ${fx(cy-(r-6)*Math.cos(a))}" stroke="var(${over?'--stop':'--live'})" stroke-width="2.6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/>`;
  s+=S.t(cx,cy-40,'A','',null,20)+S.t(cx,cy+22,rg?('range '+fm(rg)+' A'):'—','m');
  return s+'</svg>'}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'3–9',
 title:'تمهيد: السلامة في المختبر، وكتابة التقرير، ورسم المنحنيات',
 summary:'قبل التجارب: لماذا نختبر الآلات (الاختبارات التقليدية واختبارات القبول)، وإرشادات الوقاية في المختبر، وقواعد توصيل الدائرة، وكيف تكتب تقرير التجربة وترسم «أقرب منحنى» بين النقاط كما في الشكل (أ)، ثم أهداف الوحدة الأولى.',
 stations:[
  {intro:true},

  {st:1,short:'لماذا نختبر الآلة؟',title:'تمهيد: لماذا نختبر الآلة الكهربائية؟',ref:'ص 3',
   q:'المصنع اختبر الآلة قبل أن تخرج منه… فلماذا يختبرها المشتري مرة أخرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الآلة تُختبر في المصنع بالاختبارات التقليدية، ثم عند المستخدم باختبارات القبول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المصنع: تُجرى فيه على الآلة اختبارات في معامل خاصة قبل أن تخرج في شكلها النهائي، وتسمى الاختبارات التقليدية ⟦Routine tests⟧. تُجرى على جميع الآلات أو على عينات من خط الإنتاج."><path d="M220 196 V122 L246 102 V122 L272 102 V122 L300 102 V196 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="284" y="70" width="12" height="40" fill="#2C4A40"/><rect x="250" y="158" width="22" height="38" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="228" y="134" width="14" height="14" fill="#FBF6EE"/><rect x="280" y="134" width="14" height="14" fill="#FBF6EE"/></g><text x="260" y="220" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">المصنع</text><text x="260" y="240" text-anchor="middle" font-size="12" fill="#2C4A40">الاختبارات التقليدية</text><text x="260" y="257" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Routine tests</text><g data-tip="الآلة الكهربائية: تُختبر مرتين — في المصنع قبل خروجها، ثم على يد المستخدم بعد شرائها."><line x1="214" y1="170" x2="148" y2="170" stroke="#2C4A40" stroke-width="3"/><polygon points="138,170 150,163 150,177" fill="#2C4A40"/><circle cx="180" cy="140" r="22" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="140" r="7" fill="#2C4A40"/><rect x="166" y="160" width="28" height="7" rx="2" fill="#2C4A40"/></g><g data-tip="المستخدم (المشتري): يجري اختبارات القبول ليتأكد من حسن الأداء وصحة المعلومات المرفقة مع الآلة، وقد يقارن نتائجها بمعلومات مرحلة التصميم."><circle cx="88" cy="108" r="15" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M60 196 V150 a28 24 0 0 1 56 0 V196 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="96" y="146" width="30" height="38" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M102 158 l4 4 l8 -8 M102 172 l4 4 l8 -8" fill="none" stroke="#12855A" stroke-width="2.4"/></g><text x="92" y="220" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">المستخدم</text><text x="92" y="240" text-anchor="middle" font-size="12" fill="#2C4A40">اختبارات القبول</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">اختبار في المصنع ثم اختبار عند المستخدم</text></svg>`,
   cap:'الآلة تمر بنوعين من الاختبارات.<br><b>مرّر المؤشر على المصنع والآلة والمستخدم (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'اشترت ورشة محركاً جديداً، فقاس فنيّها خواصه ليتأكد أنه مطابق لما كُتب عليه. ماذا يسمى هذا الاختبار؟',opts:[
     ['اختبار تقليدي (Routine test)',false,'الاختبار التقليدي يجريه المصنع قبل أن تخرج الآلة منه، لا المشتري.'],
     ['اختبار قبول',true,'الكتاب (ص 3): اختبارات يجريها المستخدم ليتأكد من حسن الأداء وصحة المعلومات المرفقة مع الآلة.'],
     ['اختبار تصميم',false,'الكتاب يذكر «مرحلة التصميم» مصدراً للمعلومات التي تُقارن بها النتائج، لا اسماً للاختبار.']]}}
   ],
   body:[
    {book:String.raw`<p>يعتبر اختبار الآلة الكهربائية مرحلة هامة من مراحل تصنيعها حيث يتم الاطمئنان على أداء الآلة وفقاً للخطة التي اتبعت في تنفيذ تصميمها. ويتم إجراء مثل هذه الاختبارات على الآلة في معامل خاصة قبل أن تخرج من المصنع في شكلها النهائي وهذه الاختبارات تسمى عادة بالاختبارات التقليدية <span class="ltr">(Routine tests)</span>.</p>
     <p>هذا وبالإضافة إلى هذه الاختبارات التقليدية والتي تجرى على جميع الآلات بدون استثناء أو على بعض العينات من خط الإنتاج لزيادة الاطمئنان، تمر الآلة الكهربائية باختبارات أخرى على يد المستخدم الذي يريد التأكد من حسن الأداء وصحة المعلومات المرفقة مع الآلة وهذه الاختبارات تسمى <b>اختبارات القبول</b>، وقد تحتاج بعض هذه الاختبارات لمعلومات اختبارية يتم مقارنتها بالمعلومات المتوفرة من مرحلة التصميم وذلك لاقتناع المستخدم أن هذه الآلة سوف تؤدي الغرض والوظيفة التي صممت واشتراها من أجله.</p>
     <p>والحقيقة أن هذه الحقيبة عن التجارب المعملية لآلات التيار المستمر تتيح للمتدرب فرصة التدرب على إجراء التجارب المختلفة على الآلات المتنوعة لكي يصبح في النهاية قادراً على القيام بدوره في حياته العملية المستقبلية.</p>`,ref:'ص 3'},
    {tip:String.raw`<p><b>الاختبار التقليدي</b> يجريه المصنع على كل آلة (أو على عينات منها) قبل خروجها. <b>اختبار القبول</b> يجريه المشتري ليتأكد أن الآلة تعمل كما كُتب على لوحة بياناتها. تجارب هذه الحقيبة من النوع الثاني: تقيس خواص الآلة بنفسك وتقارنها بما تتوقعه.</p>`,title:'الفرق في سطرين'}
   ]},

  {st:2,short:'الوقاية في المختبر',title:'إرشادات الوقاية خلال التواجد بالمختبر وأثناء إجراء التجارب',ref:'ص 3–4',
   q:'الجهد في مختبر الآلات قد يقتل… فمن يشغّل المفتاح الرئيس، ومتى يُسمح لك بلمس الأسلاك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات: المفتاح الرئيس للمدرب فقط، توصيل الأرضي، المصهر بقيمته المقننة، تفريغ المكثفات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="مفتاح التغذية الرئيس: المدرب فقط هو المسؤول عن توصيله وفصله (إلا في حالات التعرض للخطر). وعند حدوث حريق يُفصل المفتاح الرئيس بالمختبر وتُبلَّغ الطوارئ."><rect x="190" y="40" width="130" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="236" y="56" width="38" height="54" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="247" y="64" width="16" height="26" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="250" y="68" width="10" height="10" rx="2" fill="#2C4A40"/></g><text x="255" y="132" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المفتاح الرئيس</text><g data-tip="الأرضي: يجب مراجعة توصيل الأرضي بالنسبة للأجهزة التي يلزم توصيلها إلى منبع التغذية."><rect x="40" y="40" width="130" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="105" y1="56" x2="105" y2="84" stroke="#2C4A40" stroke-width="3.5"/><line x1="85" y1="84" x2="125" y2="84" stroke="#2C4A40" stroke-width="3.5"/><line x1="92" y1="94" x2="118" y2="94" stroke="#2C4A40" stroke-width="3.5"/><line x1="99" y1="104" x2="111" y2="104" stroke="#2C4A40" stroke-width="3.5"/></g><text x="105" y="132" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">توصيل الأرضي</text><g data-tip="المصهر: لا يجوز تركيب مصهرات بالأجهزة ذات قيمة أعلى من القيمة المقننة؛ المصهر الأكبر لا يحمي الجهاز."><rect x="190" y="168" width="130" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="206" y1="210" x2="304" y2="210" stroke="#2C4A40" stroke-width="3"/><rect x="226" y="198" width="58" height="24" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g><text x="255" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المصهر المقنن</text><g data-tip="المكثفات: يجب تفريغ المكثفات المستعملة قبل تغيير التوصيلات، لأنها قد تبقى مشحونة بعد فصل الجهد."><rect x="40" y="168" width="130" height="112" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="58" y1="210" x2="96" y2="210" stroke="#2C4A40" stroke-width="3"/><line x1="114" y1="210" x2="152" y2="210" stroke="#2C4A40" stroke-width="3"/><line x1="96" y1="190" x2="96" y2="230" stroke="#2C4A40" stroke-width="5"/><line x1="114" y1="190" x2="114" y2="230" stroke="#2C4A40" stroke-width="5"/></g><text x="105" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">تفريغ المكثفات</text></svg>`,
   cap:'أربع قواعد من القائمة لها رمز واضح على الطاولة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ القاعدة التي تخصها.</b>',
   side:[
    {predict:{q:'تريد تغيير سلك في دائرة التجربة وهي تعمل. ما الصحيح؟',opts:[
     ['تغيّره بحذر وأنت تلبس قفازاً',false,'الكتاب صريح: تغيير التوصيلات يكون «في حالة عدم توصيل الجهد»، لا مع الحذر فقط.'],
     ['تطلب من زميلك أن يمسك السلك الآخر',false,'هذا يعرّض الاثنين للخطر؛ القاعدة فصل الجهد أولاً.'],
     ['تفصل الجهد أولاً ثم تغيّر التوصيل',true,'«يجب أن يتم عمل توصيلات التجربة وكذلك تغيير التوصيلات في حالة عدم توصيل الجهد» (ص 3).']]}}
   ],
   body:[
    {book:String.raw`<ul>
     <li>نوصي بالحذر الشديد من الأجهزة والوحدات الكهربائية التي تحمل جهداً كهربياً لأن هذا يعرض إلى خطر الموت.</li>
     <li>المدرب فقط هو المسؤول عن توصيل وفصل مفتاح التغذية بالتيار الرئيس (إلا في حالات التعرض للخطر).</li>
     <li><b>توصيل التجارب:</b><ul>
      <li>يجب أن يتم عمل توصيلات التجربة وكذلك تغيير التوصيلات في حالة عدم توصيل الجهد.</li>
      <li>يجب مراجعة توصيل الأرضي بالنسبة للأجهزة التي يلزم توصيلها إلى منبع التغذية.</li>
      <li>يجب إبعاد كل الأجهزة التي لا تستخدم في التجربة المراد إجراؤها وذلك حتى يمكن التوصيل على الوجه الصحيح.</li>
      <li>لا يجوز تركيب مصهرات بالأجهزة ذات قيمة أعلى من القيمة المقننة.</li>
      <li>لا يجوز فك الغلاف للأجهزة إلا بإذن من المدرب، وعند السماح بذلك يجب أولاً فصل التيار الكهربي عن الجهاز.</li></ul></li>
     <li><b>توصيل الجهد:</b><ul>
      <li>قبل توصيل الجهد يجب مراعاة التوصيلات الكهربائية عدة مرات والتأكد من أنه لا يوجد تلامس بالنقط التي تحمل جهداً كهربياً والتأكد من عوازل الأجهزة والوصلات.</li>
      <li>يجب التبليغ عن الأجهزة المعطلة.</li>
      <li>يجب إخبار المدرب في حالة عدم التأكد من أي توصيل بالدائرة.</li></ul></li>
     <li>يجب تواجد المدرب عند استعمال الجهد العالي ويجب فصل الجهد أثناء فحص التوصيلات بالجهد العالي، وكذلك يجب تفريغ المكثفات المستعملة قبل تغيير التوصيلات.</li>
     <li>يجب فصل الجهد الموصل للتجربة في حالة مغادرة الطاولة ولو لوقت قصير.</li>
     <li>يجب فصل طرفي الجهد عن التجربة فوراً في حالة حدوث حريق وكذلك فصل المفتاح الرئيس بالمختبر وتبليغ الطوارئ.</li></ul>`,ref:'ص 3–4'},
    {tip:String.raw`<p>اقرأ القائمة على ثلاث لحظات:</p><ul><li><b>وأنت توصّل:</b> الجهد مفصول، والأرضي مراجَع، والأجهزة غير اللازمة بعيدة.</li><li><b>قبل أن تشغّل:</b> راجع التوصيلات عدة مرات، وإن شككت في أي توصيل فاسأل المدرب.</li><li><b>عند الطوارئ أو المغادرة:</b> افصل الجهد، وفي الحريق افصل المفتاح الرئيس وبلّغ الطوارئ.</li></ul>`,title:'ثلاث لحظات'},
    {predict:{q:'احترق مصهر جهاز القياس. أي مصهر تركّب مكانه؟',opts:[
     ['مصهراً بالقيمة المقننة للجهاز',true,'«لا يجوز تركيب مصهرات بالأجهزة ذات قيمة أعلى من القيمة المقننة» (ص 3).'],
     ['مصهراً أكبر حتى لا يحترق مرة أخرى',false,'المصهر الأكبر يترك التيار الزائد يمر فيتلف الجهاز، والكتاب يمنعه صراحة.'],
     ['سلكاً مكان المصهر مؤقتاً',false,'هذا يلغي الحماية تماماً، وهو أسوأ من المصهر الأكبر.']]}},
    {watch:String.raw`<p>المكثف قد يبقى مشحوناً بعد فصل الجهد؛ لذلك يطلب الكتاب تفريغ المكثفات قبل تغيير التوصيلات، لا مجرد فصل المصدر.</p>`}
   ]},

  {st:3,short:'التجربة الآمنة',title:'إرشادات لإجراء التجارب بطريقة آمنة',ref:'ص 4',
   q:'قبل أن تلمس أي سلك في التجربة، ما الذي يجب أن يكون جاهزاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوح قائمة تحقق فيها أربعة بنود قبل بدء التجربة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="76" y="44" width="208" height="248" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="4"/><rect x="146" y="32" width="68" height="26" rx="8" fill="#2C4A40"/><text x="180" y="88" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">قبل بدء التجربة</text><g data-tip="عدم دخول المختبر إلا في حضور المدرب المسؤول."><rect x="92" y="104" width="176" height="36" fill="transparent"/><rect x="242" y="110" width="22" height="22" rx="5" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><path d="M247 121 l5 5 l9 -10" fill="none" stroke="#12855A" stroke-width="3"/><text x="232" y="127" text-anchor="end" font-size="13" fill="#2C4A40">المدرب حاضر</text></g><g data-tip="قبل البدء في أي عمل يجب تعريف المتدربين بنظام الوقاية ونظام العمل داخل المختبر."><rect x="92" y="148" width="176" height="36" fill="transparent"/><rect x="242" y="154" width="22" height="22" rx="5" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><path d="M247 165 l5 5 l9 -10" fill="none" stroke="#12855A" stroke-width="3"/><text x="232" y="171" text-anchor="end" font-size="13" fill="#2C4A40">عرفت نظام الوقاية</text></g><g data-tip="تحضير التجربة: دراسة الأساسيات والإرشادات الخاصة بالتجربة وما تم دراسته ويتعلق بها، حتى يتحقق المطلوب منها بنجاح."><rect x="92" y="192" width="176" height="36" fill="transparent"/><rect x="242" y="198" width="22" height="22" rx="5" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><path d="M247 209 l5 5 l9 -10" fill="none" stroke="#12855A" stroke-width="3"/><text x="232" y="215" text-anchor="end" font-size="13" fill="#2C4A40">حضّرت التجربة</text></g><g data-tip="كل تجربة لها مكان ثابت وأجهزة خاصة بها: تأكد قبل البدء من تمام كل الأجهزة ومدى ملاءمتها للتجربة."><rect x="92" y="236" width="176" height="36" fill="transparent"/><rect x="242" y="242" width="22" height="22" rx="5" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><path d="M247 253 l5 5 l9 -10" fill="none" stroke="#12855A" stroke-width="3"/><text x="232" y="259" text-anchor="end" font-size="13" fill="#2C4A40">الأجهزة كاملة ومناسبة</text></g></svg>`,
   cap:'أربعة بنود من إرشادات ص 4 في صورة قائمة تحقق.<br><b>مرّر المؤشر على أي بند (أو المسه في الجوال) لتقرأ نصه في الكتاب.</b>',
   side:[
    {predict:{q:'وصلت إلى المختبر قبل المدرب بعشر دقائق والباب مفتوح. ماذا تفعل؟',opts:[
     ['أدخل وأبدأ التوصيل لأوفّر الوقت',false,'التوصيل نفسه عمل داخل المختبر، والقاعدة الأولى تمنع الدخول دون المدرب.'],
     ['أنتظر حتى يحضر المدرب المسؤول',true,'«عدم دخول المختبر إلا في حضور المدرب المسؤول» (ص 4).'],
     ['أدخل لأقرأ فقط دون أن ألمس شيئاً',false,'الكتاب لا يستثني أحداً: لا دخول إلا في حضور المدرب.']]}}
   ],
   body:[
    {book:String.raw`<ul>
     <li>عدم دخول المختبر إلا في حضور المدرب المسؤول.</li>
     <li>قبل البدء في أي عمل يجب تعريف المتدربين بنظام الوقاية ونظام العمل داخل المختبر.</li>
     <li>يجب على المتدربين تحضير التجربة لكي يتحقق المطلوب من إجرائها بنجاح ويتم ذلك عن طريق دراسة الأساسيات والإرشادات الخاصة بالتجارب وكذلك ما تم دراسته ويتعلق بالتجربة.</li>
     <li>كل تجربة لها مكان ثابت وأجهزة خاصة بها ويجب التأكد قبل بدء التجربة من تمام كل الأجهزة ومدى ملاءمتها للتجربة موضع التنفيذ.</li>
     <li>وسنتناول الآن بعض المعلومات الأساسية والتي ستعين المتدرب على فهم وإجراء هذه التجارب المعملية بطريقة سهلة بجانب المعلومات النظرية عن كل آلة والتي يستقيها من دراسته النظرية لها.</li></ul>`,ref:'ص 4'},
    {tip:String.raw`<p>«تحضير التجربة» عملياً: اقرأ محطات الدرس، وانظر إلى مخطط التوصيل حتى تعرف مكان كل جهاز، وجرّب المنضدة الافتراضية في تبويب «المختبر» قبل أن تقف أمام الآلة الحقيقية.</p>`,title:'كيف تحضّر التجربة؟'}
   ]},

  {st:4,short:'قواعد التوصيل',title:'قواعد عامة في توصيل الدائرة الكهربائية',ref:'ص 4–5',
   q:'أمامك مصدر وأميتر وحمل وفولتميتر وكومة أسلاك… من أين تبدأ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة: المصدر والأميتر والحمل على التوالي (الخطوة 1)، والفولتميتر على التوازي مع الحمل (الخطوة 2)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="مسار التيار الرئيس (التوالي): المصدر ثم الأميتر ثم الحمل ثم العودة إلى المصدر. يُوصَّل أولاً لقفل مسار التيار."><path d="M70 110 V70 H250 V120 M250 200 V250 H70 V190" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/></g><g data-tip="المصدر: منبع الجهد المستمر؛ الخط الطويل هو القطب الموجب."><line x1="52" y1="120" x2="88" y2="120" stroke="#2C4A40" stroke-width="4"/><line x1="60" y1="134" x2="80" y2="134" stroke="#2C4A40" stroke-width="6"/><line x1="52" y1="152" x2="88" y2="152" stroke="#2C4A40" stroke-width="4"/><line x1="60" y1="166" x2="80" y2="166" stroke="#2C4A40" stroke-width="6"/><line x1="70" y1="110" x2="70" y2="120" stroke="#2C4A40" stroke-width="4"/><line x1="70" y1="166" x2="70" y2="190" stroke="#2C4A40" stroke-width="4"/></g><g data-tip="الأميتر: يقيس التيار، فيوصل على التوالي داخل مسار التيار نفسه."><circle cx="160" cy="70" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="160" y="76" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text></g><g data-tip="الحمل: الجهاز الذي يستهلك القدرة (هنا مقاومة)."><rect x="238" y="120" width="24" height="80" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="الفولتميتر: يقيس الجهد بين نقطتين، فيوصل على التوازي بين طرفي الحمل — بعد قفل مسار التيار."><path d="M250 100 H310 V142 M310 178 V220 H250" fill="none" stroke="#4FB3A9" stroke-width="3.5" stroke-dasharray="8 5"/><circle cx="310" cy="160" r="18" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="310" y="166" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><circle cx="250" cy="100" r="4" fill="#2C4A40"/><circle cx="250" cy="220" r="4" fill="#2C4A40"/><g data-tip="الخطوة 1: أجزاء الدائرة التي على التوالي (قفل مسار التيار)."><circle cx="160" cy="250" r="15" fill="#E8735A"/><text x="160" y="256" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700">1</text></g><g data-tip="الخطوة 2: الأجزاء التي على التوازي (مثل الفولتميتر) بعد ذلك."><circle cx="310" cy="250" r="15" fill="#4FB3A9"/><text x="310" y="256" text-anchor="middle" font-size="16" fill="#FBF6EE" font-weight="700">2</text></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">التوالي أولاً، ثم التوازي</text></svg>`,
   cap:'الخط الداكن مسار التيار (يُوصَّل أولاً)، والخط المتقطع فرع الفولتميتر (يُوصَّل بعده).<br><b>مرّر المؤشر على الأجزاء والرقمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لا تعرف قيمة التيار في الدائرة، والأميتر فيه عدة تدريجات. على أي تدريج تبدأ؟',opts:[
     ['على أصغر تدريج لتكون القراءة أدق',false,'قد يكون التيار أكبر من التدريج فيتلف الجهاز؛ الدقة تأتي بعد أن تعرف القيمة.'],
     ['على تدريج في المنتصف',false,'لا يضمن ذلك أن التيار لن يتجاوزه، ما دمت لا تعرف قيمته.'],
     ['على أعلى تدريج، ثم تغيّره بعد ذلك',true,'«ويفضل أن يكون التدريج في البداية في وضع أعلى قيمة، لأننا لا نعرف بالضبط قيم التيار في الدائرة» (ص 5).']]}}
   ],
   body:[
    {book:String.raw`<ul>
     <li>عند عمل التوصيلات لتكوين دائرة كهربية لغرض معين يراعى قفل مسار التيار الكهربي أولاً ثم العناية بعد ذلك بالفروع المتوازية، وهذا يعني توصيل أجزاء الدائرة التي تدخل فيها على التوالي أولاً ثم توصيل الأجزاء التي تدخل في الدائرة على التوازي بعد ذلك.</li>
     <li>يراعى في اختيار الأسلاك التي تستخدم في توصيل الدائرة تحمل شدة التيار المار في الدائرة، فتتناسب مساحة مقطع هذه الأسلاك مع ازدياد شدة التيار.</li>
     <li>يراعى اختيار التدريج المناسب لأجهزة القياس المستخدمة مثل الأميتر، الفولتميتر، الواتميتر ويفضل أن يكون التدريج في البداية في وضع أعلى قيمة، لأننا لا نعرف بالضبط قيم التيار في الدائرة، ثم بعد ذلك يمكن تغيير التدريج والجهاز في الدائرة.</li></ul>`,ref:'ص 4–5'},
    {tip:String.raw`<p>الأميتر يوصل <b>على التوالي</b> في مسار التيار، والفولتميتر يوصل <b>على التوازي</b> بين النقطتين اللتين تقيس الجهد بينهما. لذلك توصل الدائرة الرئيسة مع الأميترات أولاً، ثم تضيف الفولتميترات والفروع المتوازية.</p>`,title:'أين يقع كل جهاز؟'},
    {title:'وصّل الدائرة بالترتيب الصحيح',widget:(el,B)=>{
      const W=[['p','الفولتميتر على طرفي الحمل'],['s','سلك: المصدر ← الأميتر'],['s','سلك: الأميتر ← الحمل'],['s','سلك: الحمل ← المصدر']];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط الأسلاك بالترتيب الذي توصّلها به. القاعدة في الكتاب: قفل مسار التيار أولاً.</p><div class="w-row" style="margin-top:0">${W.map((w,i)=>`<button class="btn" type="button" data-i="${i}">${w[1]}</button>`).join('')}</div><div class="w-row"><button class="btn" type="button" data-rs>ابدأ من جديد</button></div><p class="sub" data-o style="margin-top:8px"></p>`;
      const o=el.querySelector('[data-o]'),bs=[...el.querySelectorAll('[data-i]')];let done=new Set();
      const msg=t=>{o.innerHTML=t};
      bs.forEach(b=>b.onclick=()=>{const i=+b.dataset.i,w=W[i];
        if(w[0]==='p'&&[1,2,3].some(k=>!done.has(k))){msg('<b>ليس بعد.</b> مسار التيار لم يُقفل: صِل أجزاء التوالي (المصدر والأميتر والحمل) أولاً، ثم الفروع المتوازية.');return}
        done.add(i);b.disabled=true;b.setAttribute('aria-pressed','true');
        if(done.size===4)msg('<b>أحسنت.</b> قفلت مسار التيار أولاً ثم أضفت الفولتميتر على التوازي، كما تطلب القاعدة (ص 4–5).');
        else if(w[0]==='s')msg('وُصِّل جزء من مسار التيار. '+([1,2,3].every(k=>done.has(k))?'المسار مقفل الآن، فصِل الفولتميتر.':'أكمل بقية مسار التوالي.'))});
      el.querySelector('[data-rs]').onclick=()=>{done=new Set();bs.forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false')});msg('')};
    }},
    {tip:String.raw`<p>تمرين اختيار تدريج الأميتر (ابدأ بالأعلى ثم انزل) تجده في تبويب «المختبر».</p>`}
   ]},

  {st:5,short:'تقرير التجربة',title:'تنبيهات عامة لإعداد التقرير عن تجربة معملية',ref:'ص 5–6',
   q:'قراءاتك لا تقع على خط واحد أبداً… فهل تصل النقاط نقطة بنقطة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبسط عن الشكل أ: نقاط السرعة + ونقاط العزم * مع تيار الحمل، وعبر كل مجموعة منحنى أملس" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="62" y="52" width="270" height="206" rx="6" fill="#FBF6EE"/><g data-tip="المحور الأفقي: المتغير الأصلي (هنا تيار الحمل ⟦load current⟧)."><rect x="62" y="246" width="276" height="34" fill="transparent"/><line x1="66" y1="252" x2="330" y2="252" stroke="#2C4A40" stroke-width="2.5"/><polygon points="338,252 328,247 328,257" fill="#2C4A40"/><text x="330" y="274" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">load current</text></g><g data-tip="المحور الرأسي: المتغير التابع (هنا السرعة ⟦speed⟧ والعزم ⟦torque⟧ على المحور نفسه، لأنهما يشتركان في المتغير الأصلي)."><rect x="34" y="50" width="38" height="206" fill="transparent"/><line x1="66" y1="252" x2="66" y2="56" stroke="#2C4A40" stroke-width="2.5"/><text transform="translate(50 150) rotate(-90)" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)">speed · torque</text></g><g data-tip="أقرب منحنى للسرعة: منحنى أملس واحد يمر بين نقاط ⟦+⟧، بعضها فوقه وبعضها تحته."><path d="M70.0 82.8 L95.0 84.4 L120.0 87.3 L145.0 91.5 L170.0 96.9 L195.0 103.7 L220.0 111.8 L245.0 121.1 L270.0 131.7 L295.0 143.7 L320.0 156.9" fill="none" stroke="transparent" stroke-width="18"/><path d="M70.0 82.8 L95.0 84.4 L120.0 87.3 L145.0 91.5 L170.0 96.9 L195.0 103.7 L220.0 111.8 L245.0 121.1 L270.0 131.7 L295.0 143.7 L320.0 156.9" fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="قراءات السرعة ⟦+⟧: لا تقع على المنحنى مباشرة بسبب أخطاء القراءة." stroke="#12855A" stroke-width="2.4"><path d="M77.4 82.7h10M82.4 77.7v10"/><path d="M106.2 84.3h10M111.2 79.3v10"/><path d="M136.3 98.2h10M141.3 93.2v10"/><path d="M157.6 89.4h10M162.6 84.4v10"/><path d="M187.6 107.5h10M192.6 102.5v10"/><path d="M222.5 114.9h10M227.5 109.9v10"/><path d="M248.4 124.9h10M253.4 119.9v10"/><path d="M273.9 141.8h10M278.9 136.8v10"/><path d="M301.3 143.2h10M306.3 138.2v10"/></g><g data-tip="أقرب منحنى للعزم: منحنى أملس واحد يمر بين نقاط ⟦*⟧."><path d="M70.0 234.8 L95.0 211.9 L120.0 190.7 L145.0 171.2 L170.0 153.5 L195.0 137.4 L220.0 123.1 L245.0 110.4 L270.0 99.5 L295.0 90.3 L320.0 82.8" fill="none" stroke="transparent" stroke-width="18"/><path d="M70.0 234.8 L95.0 211.9 L120.0 190.7 L145.0 171.2 L170.0 153.5 L195.0 137.4 L220.0 123.1 L245.0 110.4 L270.0 99.5 L295.0 90.3 L320.0 82.8" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="قراءات العزم ⟦*⟧." stroke="#C2492F" stroke-width="2.2"><path d="M85.2 212.0h10M87.7 207.7l5 8.6M92.7 207.7l-5 8.6"/><path d="M117.4 196.2h10M119.9 191.9l5 8.6M124.9 191.9l-5 8.6"/><path d="M149.0 163.1h10M151.5 158.8l5 8.6M156.5 158.8l-5 8.6"/><path d="M175.2 154.8h10M177.7 150.5l5 8.6M182.7 150.5l-5 8.6"/><path d="M211.5 125.4h10M214.0 121.1l5 8.6M219.0 121.1l-5 8.6"/><path d="M240.8 103.6h10M243.3 99.3l5 8.6M248.3 99.3l-5 8.6"/><path d="M271.4 89.8h10M273.9 85.5l5 8.6M278.9 85.5l-5 8.6"/><path d="M298.9 82.3h10M301.4 78.0l5 8.6M306.4 78.0l-5 8.6"/></g><text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">أقرب منحنى، لا خط متعرج</text></svg>`,
   cap:'مبسّط عن الشكل (أ) ص 6 — النقاط توضيحية بلا أرقام كما في الكتاب.<br><b>مرّر المؤشر على المحورين والنقاط والمنحنيين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قست سرعة محرك عند عدة قيم لتيار الحمل. أي كمية تضعها على المحور الأفقي؟',opts:[
     ['السرعة، لأنها الأهم',false,'السرعة هنا هي التي «تتبع» تغيّر الحمل، فهي المتغير التابع وموضعه المحور الرأسي.'],
     ['تيار الحمل، لأنه المتغير الأصلي الذي غيّرته',true,'«أن يكون المتغير الأصلي على المحور الأفقي في ورق المربعات والمتغير التابع على المحور الرأسي» (ص 5–6).'],
     ['لا فرق، اختر أيهما شئت',false,'الكتاب يحدد القاعدة صراحة، وبها يُقرأ أي منحنى بالطريقة نفسها.']]}}
   ],
   body:[
    {book:String.raw`<ul>
     <li>يجب تحديد اسم للتجربة، على حسب نوعيتها والغرض منها، في البداية، ويتم تحديد هذا الغرض بعد ذلك في عبارات موجزة وواضحة، مع بيان مخطط التوصيلات موضحاً عليه الأجهزة المختلفة. يعطى بعد ذلك بيان شامل بالأجهزة كل باسمه. حيث يمكن أن نحتاج إلى أي من هذه التفاصيل بعد الانتهاء من إجراء التجربة، وخصوصاً إذا تقرر إعادتها لأي سبب من الأسباب. كذلك يعطى بيان آخر عن الأجهزة والآلات الكهربائية المستخدمة، ويكون ذلك عن رصد المعلومات الخاصة بها على لوحة التسمية <span class="ltr">(Name plate)</span> لكل منها. يتم بعد ذلك شرح طريقة إجراء التجربة ثم النظرية التي تستند إليها ويكون ذلك بمنتهى الاختصار مع التوضيح.</li>
     <li>تسجل النتائج في جداول ذات رؤوس تحدد عناوين القراءات المأخوذة وبعض النتائج المستنتجة، حيث يبين بعد كل جدول بطريقة مختصرة كيفية الحصول على النتائج المستنتجة، التي تستخدم غالباً في رسم المنحنيات التي يتم تسميتها على حسب الغرض منها. ويراعى تحديد الوحدات العملية. ويأتي بعد ذلك رسم المنحنيات مع مراعاة كتابة اسم كل منحنى بالتحديد. ويراعى في رسم المنحنيات أن يكون <b>المتغير الأصلي على المحور الأفقي</b> في ورق المربعات <b>والمتغير التابع على المحور الرأسي</b>. ويستحسن رسم المنحنيات التي تشترك في المتغير الأصلي في نفس اللوحة حيث يمكن المقارنة بين المتغيرات بسهولة.</li>
     <li>عند رسم المنحنيات يجب ألا نتوقع أن تقع القراءات والنتائج التي نحصل عليها على المنحنى المطلوب مباشرة، وفي هذه الحالة يجب رسم أقرب منحنى كما هو موضح في الشكل (أ).</li>
     <li>تأتي في نهاية التقرير مناقشة النتائج التي تم الحصول عليها، بحيث تعقد المقارنة بينها وبين ما كان متوقعاً على أساس النظريات التي تحكم التجربة، وتناقش الأسباب، من وجهة نظر القائم بعمل التجربة، والتي أدت إلى وجود فروق، إن وجدت. وتبين هذه المناقشة في الواقع مدى استفادة المتدرب من إجراء التجربة على أساس استيعابه للدراسة النظرية. ويجب أن يلاحظ المتدرب أن قيمة الدرجة التي يحصل عليها في التقرير تتوقف على دقة مناقشته للتجربة.</li></ul>`,ref:'ص 5–6'},
    {tip:String.raw`<ol style="margin:0;padding-inline-start:20px"><li>اسم التجربة والغرض منها.</li><li>مخطط التوصيل وعليه الأجهزة.</li><li>قائمة الأجهزة، وبيانات لوحة التسمية لكل آلة.</li><li>طريقة إجراء التجربة، ثم النظرية باختصار.</li><li>جداول القراءات بوحداتها، وكيف حُسبت النتائج.</li><li>المنحنيات مسماة: المتغير الأصلي أفقياً والتابع رأسياً.</li><li>مناقشة النتائج ومقارنتها بالمتوقع.</li></ol>`,title:'ترتيب أجزاء التقرير باختصار'},
    {predict:{q:'في الشكل (أ) لماذا رُسم منحنى السرعة ومنحنى العزم على اللوحة نفسها؟',opts:[
     ['لأنهما يشتركان في المتغير الأصلي (تيار الحمل)، فتسهل المقارنة بينهما',true,'«ويستحسن رسم المنحنيات التي تشترك في المتغير الأصلي في نفس اللوحة حيث يمكن المقارنة بين المتغيرات بسهولة» (ص 5–6).'],
     ['لأن لهما الوحدة نفسها',false,'السرعة والعزم كميتان مختلفتان ووحدتاهما مختلفتان؛ لذلك لكل منهما محور رأسي في الشكل (أ).'],
     ['لتوفير ورق الرسم فقط',false,'السبب في الكتاب هو سهولة المقارنة، لا توفير الورق.']]}},
    {watch:String.raw`<p>«أقرب منحنى» منحنى أملس واحد تتوزع النقاط فوقه وتحته؛ وليس خطاً متعرجاً يمر بكل نقطة. التوصيل نقطة بنقطة ينقل أخطاء القراءة إلى المنحنى. جرّب الفرق بنفسك في تبويب «المختبر» (اسحب المقابض حتى يمر المنحنى بين النقاط).</p>`}
   ]},

  {st:6,short:'أهداف الوحدة',title:'الوحدة الأولى: تجارب مولدات التيار المستمر',ref:'ص 7–8',
   q:'ثلاثة أنواع من المولدات في هذه الوحدة… ما الذي يميز كل نوع عن الآخر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة مولدات: منفصل التغذية مجاله من مصدر مستقل، والتوازي مجاله على أطرافه، والمركب له ملفا مجال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المولد منفصل التغذية: ملف مجاله يُغذى من مصدر مستقل عن أطراف المولد (التجربتان الأولى والثانية)."><rect x="250" y="64" width="96" height="176" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="298" cy="104" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="298" y="110" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><path d="M276 150 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" fill="none" stroke="#E8735A" stroke-width="3"/><line x1="276" y1="150" x2="276" y2="180" stroke="#2C4A40" stroke-width="2"/><line x1="324" y1="150" x2="324" y2="180" stroke="#2C4A40" stroke-width="2"/><rect x="266" y="180" width="64" height="26" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="298" y="198" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700">مصدر مستقل</text></g><text x="298" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">منفصل التغذية</text><g data-tip="مولد التوازي: ملف مجاله موصل على أطراف منتجه نفسه، فيغذي مجاله من جهده (التجربة الثالثة)."><rect x="132" y="64" width="96" height="176" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="104" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="180" y="110" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><path d="M162 104 H146 V190 H162 M198 104 H214 V190 H198" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M156 190 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" fill="none" stroke="#E8735A" stroke-width="3"/></g><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">التوازي</text><g data-tip="المولد المركب: له ملف توازي على الأطراف وملف توالي يمر فيه تيار الحمل؛ ونوعاه يُحصل عليهما بعكس أطراف ملف التوالي (التجربة الرابعة)."><rect x="14" y="64" width="96" height="176" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="62" cy="104" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="62" y="110" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><path d="M44 104 H28 V126 M28 168 V190 H44 M80 104 H96 V190 H80" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M38 190 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" fill="none" stroke="#E8735A" stroke-width="3"/><path d="M28 126 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14" fill="none" stroke="#2C4A40" stroke-width="5"/></g><text x="62" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">المركب</text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الفرق في طريقة تغذية المجال</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب): الملف البرتقالي ملف المجال، والملف الداكن السميك ملف التوالي.<br><b>مرّر المؤشر على كل مولد (أو المسه في الجوال) لتعرف طريقة تغذية مجاله وتجربته.</b>',
   side:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> تعيين منحنيات الخواص لمولدات التيار المستمر بأنواعها، وكذلك حساب معامل التنظيم.</p>`,ref:'ص 8'},
    {predict:{q:'كم «منحنى خواص» تتوقع أن ترسم للمولد المركب في التجربة الرابعة؟',opts:[
     ['منحنى واحداً',false,'الهدف الثالث يقول «بنوعيه»، فلكل نوع منحناه.'],
     ['منحنيين، واحداً لكل نوع من نوعيه',true,'«تعيين منحنيات الخواص للمولد المركب بنوعيه في حالة الحمل» (ص 8).'],
     ['لا شيء، لأنه مركب من مولدين',false,'المولد المركب آلة واحدة لها ملفا مجال، وله منحنيات خواص مثل غيره.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من تعيين منحنيات الخواص للمولد منفصل التغذية وحساب معامل التنظيم.</li><li>أن يتمكن المتدرب من تعيين منحنيات الخواص لمولد التوازي، وكذلك حساب معامل التنظيم.</li><li>أن يتمكن المتدرب من تعيين منحنيات الخواص للمولد المركب بنوعيه في حالة الحمل وحساب معامل التنظيم.</li></ol>`,ref:'ص 8'},
    {tip:String.raw`<p><b>منحنى الخواص</b> رسم يبين كيف تتغير كمية في الآلة عندما نغيّر كمية أخرى، مثل جهد المولد مع تيار الحمل. و<b>معامل التنظيم</b> رقم يقول: كم يهبط جهد المولد من حالة اللاحمل إلى الحمل الكامل؛ كلما صغر كان المولد أفضل في المحافظة على جهده. الكتاب لا يعطي قانونه، فأضفناه في التجربة الثانية مع تمييزه أنه من خارج الكتاب.</p>`,title:'مصطلحان ستقابلهما كثيراً'}
   ]},

  {st:7,short:'التجارب الأربع',title:'الجزء الأول: التجارب الخاصة بآلات التيار المستمر',ref:'ص 9',
   q:'لماذا هذه التجارب بالذات؟ وما الذي تشترك فيه كل الآلات الكهربائية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لتجارب الوحدة الأولى مع صفحاتها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="42" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">تجارب مولدات التيار المستمر</text><g data-tip="التجربة الأولى: اختبار اللاحمل للمولد منفصل التغذية (ص 10)."><rect x="188" y="58" width="140" height="104" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="258" y="90" text-anchor="middle" font-size="22" fill="#FBF6EE" font-weight="700">1</text><text x="258" y="116" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700">اللاحمل</text><text x="258" y="136" text-anchor="middle" font-size="11.5" fill="#FBF6EE">منفصل التغذية</text></g><g data-tip="التجربة الثانية: منحنى خواص الحمل للمولد منفصل التغذية (ص 14)."><rect x="32" y="58" width="140" height="104" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="102" y="90" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700">2</text><text x="102" y="116" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">خواص الحمل</text><text x="102" y="136" text-anchor="middle" font-size="11.5" fill="#2C4A40">منفصل التغذية</text></g><g data-tip="التجربة الثالثة: خواص مولد التوازي (ص 17)."><rect x="188" y="178" width="140" height="104" rx="12" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="258" y="210" text-anchor="middle" font-size="22" fill="#FBF6EE" font-weight="700">3</text><text x="258" y="236" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700">الخواص</text><text x="258" y="256" text-anchor="middle" font-size="11.5" fill="#FBF6EE">مولد التوازي</text></g><g data-tip="التجربة الرابعة: منحنى خواص الحمل للمولد المركب (ص 20)."><rect x="32" y="178" width="140" height="104" rx="12" fill="#2C4A40" stroke="#2C4A40" stroke-width="2.5"/><text x="102" y="210" text-anchor="middle" font-size="22" fill="#FBF6EE" font-weight="700">4</text><text x="102" y="236" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700">خواص الحمل</text><text x="102" y="256" text-anchor="middle" font-size="11.5" fill="#FBF6EE">المولد المركب</text></g></svg>`,
   cap:'تجارب الوحدة الأولى الأربع بترتيب الفهرس.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف عنوان التجربة كاملاً وصفحتها.</b>',
   side:[
    {predict:{q:'أي التجارب يقول الكتاب إنها «نمطية» تشترك فيها كل أنواع الآلات الكهربائية؟',opts:[
     ['تجارب اللاحمل وتجارب القصر والحمل',true,'«وتعتبر بعض التجارب نمطية تشترك فيها كل أنواع الآلات الكهربائية، مثل تجارب اللاحمل وتجارب القصر والحمل» (ص 9).'],
     ['تجارب المولد المركب فقط',false,'المولد المركب نوع واحد من مولدات التيار المستمر، لا تجربة مشتركة بين كل الآلات.'],
     ['تجارب عكس اتجاه الدوران',false,'الكتاب لا يذكرها بين التجارب النمطية.']]}}
   ],
   body:[
    {book:String.raw`<p>نعرض في هذا الجزء بعض التجارب والاختبارات المهمة الخاصة بآلات التيار المستمر والتي تعتبر الأساس في اختبارات القبول للآلة الكهربائية، التي يتعين على المهندس القيام بها عند شراء الأنواع المختلفة من الآلات الكهربائية، وسوف نقوم بتقسيم التجارب إلى قسمين رئيسين أحدهما خاص بالمولد، والآخر خاص بالمحرك.</p>
     <p>سوف نركز على عدد معين من التجارب تعتبر من ناحية المهمة التعليمية أساساً لكي يستطيع المتدرب بعد ذلك تنفيذ ما يطلب منه إجراؤه بعد ذلك في حياته العملية من تجارب دون صعوبة تذكر. وتعطي نتائج هذه التجارب في الواقع خواص الآلة الأساسية المتعارف عليها، وهي إلى جانب ما ذكر تعتبر بالنسبة للمتدرب تطبيقاً للعلم الذي درسه على العمل، كما أنها تساعد المتدرب على تفهم هذه الخواص واستيعابها والاقتناع بمبرراتها. وتعتبر بعض التجارب نمطية تشترك فيها كل أنواع الآلات الكهربائية، مثل تجارب اللاحمل وتجارب القصر والحمل.</p>`,ref:'ص 9'},
    {tip:String.raw`<p>تجارب هذه الحقيبة هي «اختبارات القبول» التي عرفتها في المحطة الأولى: ستقيس بنفسك خواص كل مولد. لاحظ أن الأشكال (1) و(2) و(3) فيها المنضدة نفسها تقريباً — محرك يدير المولد — ويتغير فقط طريقة توصيل مجال المولد وحمله.</p>`},
    {watch:String.raw`<p>الحقيبة لا تعطي قيماً مقننة للآلات (لا لوحات بيانات). لذلك القراءات في المختبرات الافتراضية لهذه الوحدة <b>أرقام توضيحية</b> لآلة صغيرة نموذجية، ويستطيع المدرب أن يضع أرقام آلات مختبره من «قيم المدرب».</p>`}
   ]},

  {recap:[
   'الاختبارات التقليدية <span class="ltr">(Routine tests)</span> يجريها المصنع، واختبارات القبول يجريها المستخدم، وتجارب الحقيبة من هذا النوع (ص 3، ص 9).',
   'المفتاح الرئيس للمدرب فقط، والتوصيل وتغييره والجهد مفصول، والمصهر بقيمته المقننة، والمكثفات تُفرَّغ قبل تغيير التوصيلات (ص 3–4).',
   'في التوصيل: قفل مسار التيار (التوالي) أولاً ثم الفروع المتوازية، وتدريج جهاز القياس يبدأ من أعلى قيمة (ص 4–5).',
   'في التقرير: المتغير الأصلي أفقياً والتابع رأسياً، ونرسم أقرب منحنى بين النقاط كما في الشكل (أ)، ثم نناقش النتائج (ص 5–6).',
   'الوحدة الأولى: منحنيات خواص المولد منفصل التغذية ومولد التوازي والمولد المركب بنوعيه، وحساب معامل التنظيم (ص 8).']}
],
 theory:[
  {h:'تمهيد',ref:'ص 3',html:`<p>يعتبر اختبار الآلة الكهربائية مرحلة هامة من مراحل تصنيعها حيث يتم الاطمئنان على أداء الآلة وفقاً للخطة التي اتبعت في تنفيذ تصميمها. ويتم إجراء مثل هذه الاختبارات على الآلة في معامل خاصة قبل أن تخرج من المصنع في شكلها النهائي وهذه الاختبارات تسمى عادة بالاختبارات التقليدية <span class="ltr">(Routine tests)</span>.</p>
   <p>هذا وبالإضافة إلى هذه الاختبارات التقليدية والتي تجرى على جميع الآلات بدون استثناء أو على بعض العينات من خط الإنتاج لزيادة الاطمئنان، تمر الآلة الكهربائية باختبارات أخرى على يد المستخدم الذي يريد التأكد من حسن الأداء وصحة المعلومات المرفقة مع الآلة وهذه الاختبارات تسمى <b>اختبارات القبول</b>، وقد تحتاج بعض هذه الاختبارات لمعلومات اختبارية يتم مقارنتها بالمعلومات المتوفرة من مرحلة التصميم وذلك لاقتناع المستخدم أن هذه الآلة سوف تؤدي الغرض والوظيفة التي صممت واشتراها من أجله.</p>
   <p>والحقيقة أن هذه الحقيبة عن التجارب المعملية لآلات التيار المستمر تتيح للمتدرب فرصة التدرب على إجراء التجارب المختلفة على الآلات المتنوعة لكي يصبح في النهاية قادراً على القيام بدوره في حياته العملية المستقبلية.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> <b>الاختبار التقليدي</b> يجريه المصنع على كل آلة (أو على عينات منها) قبل خروجها. <b>اختبار القبول</b> يجريه المشتري ليتأكد أن الآلة تعمل كما كُتب على لوحة بياناتها. تجارب هذه الحقيبة من النوع الثاني: تقيس خواص الآلة بنفسك وتقارنها بما تتوقعه.'},
  {h:'إرشادات خاصة بالوقاية خلال التواجد بالمختبر وأثناء إجراء التجارب المعملية',ref:'ص 3–4',html:`<ul>
   <li>نوصي بالحذر الشديد من الأجهزة والوحدات الكهربائية التي تحمل جهداً كهربياً لأن هذا يعرض إلى خطر الموت.</li>
   <li>المدرب فقط هو المسؤول عن توصيل وفصل مفتاح التغذية بالتيار الرئيس (إلا في حالات التعرض للخطر).</li>
   <li><b>توصيل التجارب:</b><ul>
    <li>يجب أن يتم عمل توصيلات التجربة وكذلك تغيير التوصيلات في حالة عدم توصيل الجهد.</li>
    <li>يجب مراجعة توصيل الأرضي بالنسبة للأجهزة التي يلزم توصيلها إلى منبع التغذية.</li>
    <li>يجب إبعاد كل الأجهزة التي لا تستخدم في التجربة المراد إجراؤها وذلك حتى يمكن التوصيل على الوجه الصحيح.</li>
    <li>لا يجوز تركيب مصهرات بالأجهزة ذات قيمة أعلى من القيمة المقننة.</li>
    <li>لا يجوز فك الغلاف للأجهزة إلا بإذن من المدرب، وعند السماح بذلك يجب أولاً فصل التيار الكهربي عن الجهاز.</li></ul></li>
   <li><b>توصيل الجهد:</b> <span class="ref">ص 4</span><ul>
    <li>قبل توصيل الجهد يجب مراعاة التوصيلات الكهربائية عدة مرات والتأكد من أنه لا يوجد تلامس بالنقط التي تحمل جهداً كهربياً والتأكد من عوازل الأجهزة والوصلات.</li>
    <li>يجب التبليغ عن الأجهزة المعطلة.</li>
    <li>يجب إخبار المدرب في حالة عدم التأكد من أي توصيل بالدائرة.</li></ul></li>
   <li>يجب تواجد المدرب عند استعمال الجهد العالي ويجب فصل الجهد أثناء فحص التوصيلات بالجهد العالي، وكذلك يجب تفريغ المكثفات المستعملة قبل تغيير التوصيلات.</li>
   <li>يجب فصل الجهد الموصل للتجربة في حالة مغادرة الطاولة ولو لوقت قصير.</li>
   <li>يجب فصل طرفي الجهد عن التجربة فوراً في حالة حدوث حريق وكذلك فصل المفتاح الرئيس بالمختبر وتبليغ الطوارئ.</li></ul>`},
  {h:'إرشادات لإجراء التجارب بطريقة آمنة',ref:'ص 4',html:`<ul>
   <li>عدم دخول المختبر إلا في حضور المدرب المسؤول.</li>
   <li>قبل البدء في أي عمل يجب تعريف المتدربين بنظام الوقاية ونظام العمل داخل المختبر.</li>
   <li>يجب على المتدربين تحضير التجربة لكي يتحقق المطلوب من إجرائها بنجاح ويتم ذلك عن طريق دراسة الأساسيات والإرشادات الخاصة بالتجارب وكذلك ما تم دراسته ويتعلق بالتجربة.</li>
   <li>كل تجربة لها مكان ثابت وأجهزة خاصة بها ويجب التأكد قبل بدء التجربة من تمام كل الأجهزة ومدى ملاءمتها للتجربة موضع التنفيذ.</li>
   <li>وسنتناول الآن بعض المعلومات الأساسية والتي ستعين المتدرب على فهم وإجراء هذه التجارب المعملية بطريقة سهلة بجانب المعلومات النظرية عن كل آلة والتي يستقيها من دراسته النظرية لها.</li></ul>`},
  {h:'قواعد عامة في توصيل الدائرة الكهربائية',ref:'ص 4–5',html:`<ul>
   <li>عند عمل التوصيلات لتكوين دائرة كهربية لغرض معين يراعى قفل مسار التيار الكهربي أولاً ثم العناية بعد ذلك بالفروع المتوازية، وهذا يعني توصيل أجزاء الدائرة التي تدخل فيها على التوالي أولاً ثم توصيل الأجزاء التي تدخل في الدائرة على التوازي بعد ذلك.</li>
   <li>يراعى في اختيار الأسلاك التي تستخدم في توصيل الدائرة تحمل شدة التيار المار في الدائرة، فتتناسب مساحة مقطع هذه الأسلاك مع ازدياد شدة التيار.</li>
   <li>يراعى اختيار التدريج المناسب لأجهزة القياس المستخدمة مثل الأميتر، الفولتميتر، الواتميتر ويفضل أن يكون التدريج في البداية في وضع أعلى قيمة، لأننا لا نعرف بالضبط قيم التيار في الدائرة، ثم بعد ذلك يمكن تغيير التدريج والجهاز في الدائرة.</li></ul>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الأميتر يوصل <b>على التوالي</b> في مسار التيار، والفولتميتر يوصل <b>على التوازي</b> بين النقطتين اللتين تقيس الجهد بينهما. لذلك توصل الدائرة الرئيسة مع الأميترات أولاً، ثم تضيف الفولتميترات والفروع المتوازية. في تبويب «المختبر» تمرين صغير على اختيار تدريج الأميتر.'},
  {h:'تنبيهات عامة بالنسبة لإعداد التقرير عن تجربة معملية',ref:'ص 5–6',html:`<ul>
   <li>يجب تحديد اسم للتجربة، على حسب نوعيتها والغرض منها، في البداية، ويتم تحديد هذا الغرض بعد ذلك في عبارات موجزة وواضحة، مع بيان مخطط التوصيلات موضحاً عليه الأجهزة المختلفة. يعطى بعد ذلك بيان شامل بالأجهزة كل باسمه. حيث يمكن أن نحتاج إلى أي من هذه التفاصيل بعد الانتهاء من إجراء التجربة، وخصوصاً إذا تقرر إعادتها لأي سبب من الأسباب. كذلك يعطى بيان آخر عن الأجهزة والآلات الكهربائية المستخدمة، ويكون ذلك عن رصد المعلومات الخاصة بها على لوحة التسمية <span class="ltr">(Name plate)</span> لكل منها. يتم بعد ذلك شرح طريقة إجراء التجربة ثم النظرية التي تستند إليها ويكون ذلك بمنتهى الاختصار مع التوضيح.</li>
   <li>تسجل النتائج في جداول ذات رؤوس تحدد عناوين القراءات المأخوذة وبعض النتائج المستنتجة، حيث يبين بعد كل جدول بطريقة مختصرة كيفية الحصول على النتائج المستنتجة، التي تستخدم غالباً في رسم المنحنيات التي يتم تسميتها على حسب الغرض منها. ويراعى تحديد الوحدات العملية. ويأتي بعد ذلك رسم المنحنيات مع مراعاة كتابة اسم كل منحنى بالتحديد. ويراعى في رسم المنحنيات أن يكون <b>المتغير الأصلي على المحور الأفقي</b> في ورق المربعات <b>والمتغير التابع على المحور الرأسي</b>. ويستحسن رسم المنحنيات التي تشترك في المتغير الأصلي في نفس اللوحة حيث يمكن المقارنة بين المتغيرات بسهولة.</li>
   <li>عند رسم المنحنيات يجب ألا نتوقع أن تقع القراءات والنتائج التي نحصل عليها على المنحنى المطلوب مباشرة، وفي هذه الحالة يجب رسم أقرب منحنى كما هو موضح في الشكل (أ).</li>
   <li>تأتي في نهاية التقرير مناقشة النتائج التي تم الحصول عليها، بحيث تعقد المقارنة بينها وبين ما كان متوقعاً على أساس النظريات التي تحكم التجربة، وتناقش الأسباب، من وجهة نظر القائم بعمل التجربة، والتي أدت إلى وجود فروق، إن وجدت. وتبين هذه المناقشة في الواقع مدى استفادة المتدرب من إجراء التجربة على أساس استيعابه للدراسة النظرية. ويجب أن يلاحظ المتدرب أن قيمة الدرجة التي يحصل عليها في التقرير تتوقف على دقة مناقشته للتجربة.</li></ul>`},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب: ترتيب أجزاء التقرير باختصار</b><ol style="margin:6px 0 0;padding-inline-start:20px"><li>اسم التجربة والغرض منها.</li><li>مخطط التوصيل وعليه الأجهزة.</li><li>قائمة الأجهزة، وبيانات لوحة التسمية لكل آلة.</li><li>طريقة إجراء التجربة، ثم النظرية باختصار.</li><li>جداول القراءات بوحداتها، وكيف حُسبت النتائج.</li><li>المنحنيات مسماة: المتغير الأصلي أفقياً والتابع رأسياً.</li><li>مناقشة النتائج ومقارنتها بالمتوقع.</li></ol>`},
  {fig:'(أ)',ref:'ص 6',caption:'كيفية رسم منحنيات لعدة نقاط معملية: نقاط «+» للسرعة ونقاط «*» للعزم مع تيار الحمل، وعبر كل مجموعة منحنى أملس واحد يمر بينها، لا خط يصل النقاط واحدة بواحدة. (أعيد رسمه، والنقاط توضيحية بلا أرقام كما في الكتاب)',draw:()=>box(figAstatic(),620)},
  {h:'الوحدة الأولى: تجارب مولدات التيار المستمر',ref:'ص 7–8',html:`<p><b>الهدف العام للوحدة:</b> تعيين منحنيات الخواص لمولدات التيار المستمر بأنواعها، وكذلك حساب معامل التنظيم.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من تعيين منحنيات الخواص للمولد منفصل التغذية وحساب معامل التنظيم.</li><li>أن يتمكن المتدرب من تعيين منحنيات الخواص لمولد التوازي، وكذلك حساب معامل التنظيم.</li><li>أن يتمكن المتدرب من تعيين منحنيات الخواص للمولد المركب بنوعيه في حالة الحمل وحساب معامل التنظيم.</li></ol>`},
  {h:'الجزء الأول: التجارب الخاصة بآلات التيار المستمر',ref:'ص 9',html:`<p>نعرض في هذا الجزء بعض التجارب والاختبارات المهمة الخاصة بآلات التيار المستمر والتي تعتبر الأساس في اختبارات القبول للآلة الكهربائية، التي يتعين على المهندس القيام بها عند شراء الأنواع المختلفة من الآلات الكهربائية، وسوف نقوم بتقسيم التجارب إلى قسمين رئيسين أحدهما خاص بالمولد، والآخر خاص بالمحرك.</p>
   <p>سوف نركز على عدد معين من التجارب تعتبر من ناحية المهمة التعليمية أساساً لكي يستطيع المتدرب بعد ذلك تنفيذ ما يطلب منه إجراؤه بعد ذلك في حياته العملية من تجارب دون صعوبة تذكر. وتعطي نتائج هذه التجارب في الواقع خواص الآلة الأساسية المتعارف عليها، وهي إلى جانب ما ذكر تعتبر بالنسبة للمتدرب تطبيقاً للعلم الذي درسه على العمل، كما أنها تساعد المتدرب على تفهم هذه الخواص واستيعابها والاقتناع بمبرراتها. وتعتبر بعض التجارب نمطية تشترك فيها كل أنواع الآلات الكهربائية، مثل تجارب اللاحمل وتجارب القصر والحمل.</p>
   <table class="tt"><thead><tr><th>التجربة</th><th>الموضوع</th><th>الصفحة</th></tr></thead><tbody><tr><td>الأولى</td><td>اختبار اللاحمل للمولد منفصل التغذية</td><td>10</td></tr><tr><td>الثانية</td><td>منحنى خواص الحمل للمولد منفصل التغذية</td><td>14</td></tr><tr><td>الثالثة</td><td>خواص مولد التوازي</td><td>17</td></tr><tr><td>الرابعة</td><td>منحنى خواص الحمل للمولد المركب</td><td>20</td></tr></tbody></table>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الحقيبة لا تعطي قيماً مقننة للآلات (لا لوحات بيانات). لذلك القراءات في المختبرات الافتراضية لهذه الوحدة <b>أرقام توضيحية</b> لآلة صغيرة نموذجية، ويستطيع المدرب أن يضع أرقام آلات مختبره من «قيم المدرب». والآلة نفسها (المنحنى والمقاومات) مستعملة في التجارب الأربع لتكون النتائج متسقة.'},
  {err:'<div class="fixnote">ص 4: العنوان مطبوع «إرشادات <b>لأجراء</b> التجارب بطريقة آمنة» والصحيح «لإجراء». وفي الفهرس تبدأ الوحدة الأولى في ص 7 (صفحة غلافها)، وأهدافها في ص 8.</div>'}
 ],
 lab:(el)=>{
  let seed=7,P=figApts(seed),H={sp:[0.5,0.5,0.5],tq:[0.3,0.3,0.3]},showPP=false,showBest=false,drag=null;const did={};
  let I=1.37,rg=null,startRg=null,exceeded=false;
  el.innerHTML=`<div class="grid dc-lab">
   <div class="panel c12"><h2>ارسم أقرب منحنى <small>مبنية على الشكل (أ) ص 6</small></h2>
    <p class="sub">النقاط قراءات توضيحية بلا أرقام كما في الشكل: «+» للسرعة و«*» للعزم مع تيار الحمل. اسحب المقابض الدائرية (ثلاثة لكل منحنى) إلى أعلى أو إلى أسفل حتى يمر كل منحنى <b>بين</b> نقاطه: بعضها فوقه وبعضها تحته، والمنحنى أملس بلا كسرات.</p>
    <div class="svgbox dc-fit" style="max-width:660px;margin-inline:auto"><svg id="l1svg" viewBox="0 0 660 370" role="img" aria-label="ارسم أقرب منحنى بسحب المقابض">${figAframe()}<g id="l1dyn"></g></svg></div>
    <div class="dc-sw"><button class="btn" id="l1pp" aria-pressed="false">صل النقاط نقطة بنقطة (الطريقة الخاطئة)</button><button class="btn" id="l1best" aria-pressed="false">أظهر أقرب منحنى محسوب</button><button class="btn" id="l1new">نقاط جديدة</button><button class="btn" id="l1rst">أرجع المقابض</button></div>
    <div class="facts" id="l1f"></div>
    <p class="sub">«متوسط البعد» = متوسط المسافة الرأسية بين النقاط ومنحناك (كلما صغر كان أفضل). «أقرب منحنى محسوب» هو منحنى أملس من الدرجة الثانية بأقل مربعات للبعد (طريقة رياضية — ليست من الكتاب) للمقارنة فقط.</p></div>
   <div class="panel c12"><h2>اختيار تدريج جهاز القياس <small>قواعد عامة في توصيل الدائرة ص 5</small></h2>
    <div class="grid" style="margin-top:0"><div class="c6">${box(gaugeSVG(0,null),340)}</div>
    <div class="c6"><p class="sub">في الدائرة تيار لا تعرف قيمته. اختر تدريج الأميتر:</p><div class="dc-chips" id="l1rg">${[10,3,1,0.3].map(r=>`<button class="btn" data-rg="${r}" aria-pressed="false">${fm(r)} A</button>`).join('')}</div>
     <div id="l1msg" style="margin-top:8px"></div><div class="dc-row"><button class="btn" id="l1newI">تيار جديد</button></div>
     <p class="sub">الأفضل: أصغر تدريج لا يتجاوزه التيار، فيكون المؤشر في النصف الأعلى من التدريج وتكون القراءة أدق.</p></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);const svg=$('#l1svg');
  const fitOf=c=>x=>c[0]+c[1]*x+c[2]*x*x;
  const score=()=>{const out={};['sp','tq'].forEach(k=>{const p=P[k],fu=quad3(H[k]),fb=fitOf(lsq2(p));const ru=rms(p,fu),rb=rms(p,fb);const above=p.filter(([x,y])=>y>fu(x)).length;out[k]={ru,rb,r:ru/Math.max(rb,1e-6),above,below:p.length-above}});return out};
  const grade=r=>r<=1.15?['ممتاز','ok']:r<=1.5?['جيد','ok']:r<=2.5?['يحتاج ضبطاً','warn']:['بعيد عن النقاط','bad'];
  const draw=()=>{let s='';
   if(showBest){['sp','tq'].forEach(k=>{s+=`<path d="${curvePath(fitOf(lsq2(P[k])))}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>`})}
   if(showPP){['sp','tq'].forEach(k=>{const p=P[k].slice().sort((a,b)=>a[0]-b[0]);s+=`<path d="${p.map((q,i)=>(i?'L':'M')+fx(fax(q[0]))+' '+fx(fay(q[1]))).join('')}" fill="none" stroke="var(--stop)" stroke-width="1.6"/>`})}
   s+=`<path d="${curvePath(quad3(H.sp))}" fill="none" stroke="var(--blue)" stroke-width="2.6"/><path d="${curvePath(quad3(H.tq))}" fill="none" stroke="var(--live)" stroke-width="2.6"/>`;
   s+=P.sp.map(q=>plusMk(q[0],q[1],'--blue')).join('')+P.tq.map(q=>starMk(q[0],q[1],'--live')).join('');
   ['sp','tq'].forEach(k=>H[k].forEach((y,i)=>{s+=`<circle class="hd" cx="${fx(fax(HX[i]))}" cy="${fx(fay(y))}" r="9" fill="var(--surface)" stroke="var(${k==='sp'?'--blue':'--live'})" stroke-width="3"/>`}));
   s+=S.t(FA.R-4,FA.Bt-26,'+ speed','b','end')+`<text class="txt" x="${FA.R-4}" y="${FA.Bt-10}" text-anchor="end" style="fill:var(--live)">* torque</text>`;
   if(showPP)s+=arT((FA.L+FA.R)/2,FA.T+12,'الخط الأحمر المتعرج: توصيل نقطة بنقطة — ليس منحنى الخواص',{fs:12,col:'--stop'});
   $('#l1dyn').innerHTML=s;
   const sc=score();$('#l1f').innerHTML=[['sp','منحنى السرعة (+)'],['tq','منحنى العزم (*)']].map(([k,n])=>{const g=grade(sc[k].r);return `<div class="fact"><span>${n}: متوسط البعد</span><b>${fm(sc[k].ru*100,1)}</b> <span>أفضل ممكن ${fm(sc[k].rb*100,1)} — نقاط فوقه ${sc[k].above} وتحته ${sc[k].below}</span><span class="dc-chip ${g[1]}">${g[0]}</span></div>`}).join('');};
  const toSvg=e=>{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())};
  svg.addEventListener('pointerdown',e=>{const p=toSvg(e);let best=null,bd=22;['sp','tq'].forEach(k=>H[k].forEach((y,i)=>{const d=Math.hypot(p.x-fax(HX[i]),p.y-fay(y));if(d<bd){bd=d;best=[k,i]}}));
   if(best){drag=best;svg.setPointerCapture(e.pointerId);e.preventDefault()}});
  svg.addEventListener('pointermove',e=>{if(!drag)return;const p=toSvg(e);H[drag[0]][drag[1]]=clamp((FA.Bt-p.y)/(FA.Bt-FA.T),0.02,1);did.drag=1;draw()});
  const up=()=>{drag=null};svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  $('#l1pp').onclick=()=>{showPP=!showPP;$('#l1pp').setAttribute('aria-pressed',String(showPP));if(showPP)did.pp=1;draw()};
  $('#l1best').onclick=()=>{showBest=!showBest;$('#l1best').setAttribute('aria-pressed',String(showBest));if(showBest)did.best=1;draw()};
  $('#l1new').onclick=()=>{seed=(seed*7+13)%9973;P=figApts(seed);did.newp=1;draw()};
  $('#l1rst').onclick=()=>{H={sp:[0.5,0.5,0.5],tq:[0.3,0.3,0.3]};draw()};
  /* range selection */
  const best=()=>[0.3,1,3,10].find(r=>r>=I)||10;
  const gdraw=()=>{el.querySelector('.c6 .svgbox').innerHTML=gaugeSVG(I,rg);el.querySelectorAll('[data-rg]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.rg===rg)));
   let m='';if(rg==null)m='<div class="callout">اختر تدريجاً. القاعدة: ابدأ بأعلى تدريج لأنك لا تعرف قيمة التيار.</div>';
   else if(I>rg)m='<div class="callout err"><b>تجاوز التدريج!</b> المؤشر ضرب نهاية التدريج. في جهاز حقيقي قد يتلف الأميتر — لهذا يكون التدريج في البداية في وضع أعلى قيمة (ص 5). ارجع إلى تدريج أكبر.</div>';
   else{const rd=Math.round(I/rg*50)/50*rg;m=`<div class="callout">القراءة ≈ ${lt(fm(rd,rg<1?3:2)+' A')} — المؤشر عند ${lt(fm(I/rg*100,0)+'%')} من التدريج. ${rg===best()?'<b>هذا أنسب تدريج</b>: أدق قراءة دون تجاوز.':'يمكنك النزول إلى تدريج أصغر لقراءة أدق ما دام التيار لا يتجاوزه.'}</div>`}
   $('#l1msg').innerHTML=m};
  segBind(el,'rg',v=>{rg=+v;if(startRg==null)startRg=rg;if(I>rg)exceeded=true;gdraw()});
  $('#l1newI').onclick=()=>{const r=rng(Date.now()%100000)();I=B.round(0.12+r*2.6,3);rg=null;startRg=null;exceeded=false;did.newI=1;gdraw()};
  const steps=stepsUI($('#l1st'),[
   {t:'منحنى السرعة',x:'اسحب المقابض الزرقاء الثلاثة حتى يصبح تقييم «منحنى السرعة» جيداً أو ممتازاً: المنحنى يمر بين نقاط «+» وتتوزع النقاط فوقه وتحته.',done:()=>score().sp.r<=1.5},
   {t:'منحنى العزم',x:'افعل الشيء نفسه بالمقابض البرتقالية لنقاط «*». لاحظ أن المنحنيين يتقاطعان قرب ثلثي المحور الأفقي كما في الشكل (أ).',done:()=>score().tq.r<=1.5},
   {t:'الطريقة الخاطئة',x:'اضغط «صل النقاط نقطة بنقطة»: خط متعرج يتبع أخطاء القراءة. الكتاب يطلب «أقرب منحنى» لأن القراءات لا تقع على المنحنى مباشرة (ص 6).',done:()=>did.pp},
   {t:'قارن بالمحسوب',x:'اضغط «أظهر أقرب منحنى محسوب» (متقطع) وقارنه بمنحنياتك، ثم جرّب «نقاط جديدة».',done:()=>did.best&&did.newp},
   {t:'ابدأ بأعلى تدريج',x:'في تمرين الأميتر اضغط «تيار جديد» ثم اختر أولاً أعلى تدريج <span class="ltr">10 A</span>.',done:()=>did.newI&&startRg===10},
   {t:'انزل إلى أنسب تدريج',x:'انزل تدريجاً بعد تدريج حتى تصل إلى أصغر تدريج لا يتجاوزه التيار، دون أن تتجاوز التدريج مرة.',done:()=>did.newI&&startRg===10&&rg===best()&&!exceeded}
  ]);
  draw();gdraw();
  loopOn(el,()=>steps.check());
 },
 quiz:[
  {q:'الاختبارات التي يجريها المصنع على الآلة قبل خروجها تسمى:',o:['اختبارات القبول','الاختبارات التقليدية (Routine tests)','اختبارات القصر','اختبارات المستخدم'],c:1,e:'ص 3.'},
  {q:'الاختبارات التي يجريها المستخدم ليتأكد من حسن أداء الآلة وصحة معلوماتها تسمى:',o:['اختبارات القبول','الاختبارات التقليدية','اختبارات التصميم','اختبارات العزل فقط'],c:0,e:'ص 3.'},
  {q:'من المسؤول عن توصيل وفصل مفتاح التغذية الرئيس (إلا في حالات الخطر)؟',o:['أي متدرب','المدرب فقط','أقرب متدرب للمفتاح','فني الصيانة'],c:1,e:'ص 3.'},
  {q:'متى تُعمل توصيلات التجربة أو تُغيَّر؟',o:['والجهد موصول بشرط الحذر','في حالة عدم توصيل الجهد','بعد رفع الجهد قليلاً','لا يهم'],c:1,e:'ص 3–4.'},
  {q:'عند توصيل دائرة نبدأ بـ:',o:['الفروع المتوازية','أجزاء الدائرة التي على التوالي (قفل مسار التيار) ثم الفروع المتوازية','الفولتميترات','لا ترتيب'],c:1,e:'ص 4–5.'},
  {q:'تدريج جهاز القياس في البداية يكون:',o:['أصغر قيمة','أعلى قيمة لأننا لا نعرف قيمة التيار بالضبط','في المنتصف','لا يهم'],c:1,e:'ص 5.'},
  {q:'في رسم المنحنى يوضع المتغير الأصلي على:',o:['المحور الرأسي','المحور الأفقي','أي محور','لا يرسم'],c:1,e:'ص 5–6: المتغير الأصلي أفقياً والتابع رأسياً.'},
  {q:'إذا لم تقع القراءات على منحنى واحد تماماً فإننا:',o:['نصل النقاط نقطة بنقطة','نرسم أقرب منحنى أملس يمر بينها (الشكل أ)','نحذف القراءات','نعيد التجربة دائماً'],c:1,e:'ص 6.'}
 ]
});

/* ======================================================================
   Circuit drawings — الأشكال (1) (2) (3) ص 10، 14، 17 and (4) ص 20, redrawn
   ====================================================================== */
/* o:{kind:'nl'|'sep'|'shunt', on, Vs, ang, If (A1), E, VL, IL, RLp (null = open), rev, fopen, frev, n} — readings optional */
function benchSVG(o){o=o||{};const k=o.kind||'nl',rd=o.rd!==false;const mOn=o.on&&o.Vs>0.05,mc=mOn?'flow':'';
  const gE=Math.abs(o.VL!=null?o.VL:(o.E||0))>0.5,gF=Math.abs(o.IL||0)>0.005,gc=gF?'flow':gE?'live':'';
  let s=`<svg viewBox="0 0 900 340" role="img" aria-label="${k==='nl'?'الشكل (1) اختبار اللاحمل للمولد منفصل التغذية':k==='sep'?'الشكل (2) تحميل المولد منفصل التغذية':'الشكل (3) مولد التوازي'}">`;
  /* drive motor side (blue in the book) */
  s+=`<rect x="18" y="125" width="76" height="90" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(56,158,'DC','')+S.t(56,175,'0-250 V','m')+(rd?S.t(56,200,o.on?fm(o.Vs||0,1)+' V':'OFF','b'):'');
  s+=S.w('M56 125V50H230V136',mc)+S.w('M56 215V290H230V196',mc)+S.t(44,66,'+','')+S.t(44,282,'−','');
  s+=S.w('M140 50V100',mc)+arrow(154,62,154,94,'--blue',1.6)+S.t(162,84,'If','b','start')+ind(140,100,140,230,5,mc)+S.w('M140 230V290',mc)+S.t(128,108,'E1','m','end')+S.t(128,234,'E2','m','end')+S.t(158,170,'Vf','','start')+S.dot(140,50)+S.dot(140,290);
  s+=machSym(230,166,30,'M','dcr1',o.ang)+S.t(246,128,'1B1','m','start')+S.t(246,214,'2B2','m','start');
  s+=`<rect x="260" y="161" width="290" height="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.2"/>`+tacho(320,166,98,rd&&o.n!=null?fm(Math.round(o.n),0)+' rpm':'—');
  s+=`<rect x="420" y="150" width="9" height="32" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/><rect x="432" y="150" width="9" height="32" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(430,200,'coupling','m');
  s+=`<path d="M478 150A16 22 0 0 1 506 150" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+arrow(500,146,508,154,'--fg',1.6)+S.t(492,138,'n','');
  s+=machSym(580,166,30,'G','dcr2',o.ang)+S.t(596,128,'1B1','m','start')+S.t(596,214,'2B2','m','start');
  /* generator output lines */
  const xr=k==='nl'?860:860;
  s+=S.w(`M580 136V50H${k==='nl'?850:860}`,gc)+S.w(`M580 196V290H${k==='nl'?850:860}`,gc);
  if(k==='nl'||k==='sep'){/* separately-excited field + its supply */
    const fOn=Math.abs(o.If||0)>1e-4,fc=fOn?'flow':'';
    s+=ind(440,240,530,240,5,fc)+S.t(440,228,o.rev?'E2':'E1','m')+S.t(530,228,o.rev?'E1':'E2','m')+S.t(485,226,'Vf','');
    s+=S.w('M440 240V258',fc)+mtr(440,272,'A1',rd?fm(o.If||0,3)+' A':null,422,276,'end')+S.w('M440 286V300',fc)+S.w('M530 240V300',fc);
    s+=arrow(458,296,458,262,'--blue',1.6)+S.t(466,286,'If','b','start');
    s+=`<rect x="420" y="300" width="130" height="34" rx="5" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(485,315,'0-240V / 0-6A','m')+S.t(485,329,'DC','m');
    if(o.rev)s+=arT(485,212,'أطراف المجال معكوسة',{fs:11.5,col:'--stop'});}
  else{/* shunt field across the armature */
    const fOn=!o.fopen&&Math.abs(o.If||0)>1e-4,fc=fOn?'flow':gE?'live':'';
    s+=S.dot(650,50)+S.dot(650,290);
    if(o.fopen)s+=S.w('M650 50V66','')+`<circle cx="650" cy="68" r="3" fill="var(--fg)"/><path d="M650 92L664 72" stroke="var(--stop)" stroke-width="2.6"/><circle cx="650" cy="92" r="3" fill="var(--fg)"/>`+arT(672,82,'دائرة المجال مفتوحة',{fs:11.5,col:'--stop',a:'start'})+S.w('M650 92V100','');
    else s+=S.w('M650 50V100',fc)+arrow(664,62,664,94,'--blue',1.6)+S.t(672,84,'If','b','start');
    s+=ind(650,100,650,236,5,fc)+S.w('M650 236V290',fc)+S.t(638,108,o.frev?'E2':'E1','m','end')+S.t(638,240,o.frev?'E1':'E2','m','end')+S.t(668,172,'Vf','','start');
    if(o.frev)s+=arT(668,196,'ملف المجال معكوس',{fs:11.5,col:'--stop',a:'start'});}
  /* voltmeter */
  const xv=k==='nl'?720:k==='sep'?690:740;
  s+=S.w(`M${xv} 50V152`,gE?'live':'')+S.w(`M${xv} 180V290`,gE?'live':'')+S.dot(xv,50)+S.dot(xv,290)+mtr(xv,166,'V',null)+S.t(xv+20,150,'VL','','start')+(rd&&o.VL!=null?`<text class="txt b" x="${xv+20}" y="192" font-size="12.5">${sgn(o.VL,1)} V</text>`:'');
  if(k==='nl'){s+=arrow(830,270,830,72,'--live',2)+S.t(814,176,'E0','','end')+`<circle cx="854" cy="50" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="854" cy="290" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+S.t(872,55,'+','')+S.t(872,295,'−','');}
  else{const xa=790;s+=arrow(752,36,778,36,'--blue',1.6)+S.t(744,40,'IL','b','end')+mtr(xa,50,k==='sep'?'A2':'A',null)+(rd&&o.IL!=null?`<text class="txt b" x="${xa}" y="26" text-anchor="middle" font-size="12.5">${fm(o.IL,2)} A</text>`:'');
    const open=o.RLp==null&&o.rdOpen!==false&&o.RLp!==undefined;
    if(o.RLp===null){s+=S.w('M860 50V74','')+`<circle cx="860" cy="76" r="3" fill="var(--fg)"/><path d="M860 98L874 80" stroke="var(--fg)" stroke-width="2.6"/><circle cx="860" cy="98" r="3" fill="var(--fg)"/>`+arT(852,88,'مفصول',{fs:11.5,a:'end'})+S.w('M860 98V110','')+zig(860,110,860,250,6,'',true)+S.w('M860 250V290','')}
    else s+=S.w('M860 50V110',gc)+zig(860,110,860,250,6,gc,true)+S.w('M860 250V290',gc);
    s+=S.t(842,176,'RL','','end')+(rd&&o.RLp!=null?S.t(842,192,o.RLp+'%','m','end'):'');}
  return s+'</svg>'}

/* الشكل (4): compound generator driven by a shunt motor with starter */
function fig4SVG(o){o=o||{};const rd=o.rd!==false;const sup=(o.Vs||0)>0.05,on=o.dp&&sup,mc=on?'flow':sup?'':'';
  const gE=Math.abs(o.VL||0)>0.5,gF=(o.IL||0)>0.005,gc=gF?'flow':gE?'live':'';const fc=Math.abs(o.Ifg||0)>1e-4?'flow':gE?'live':'';
  let s=`<svg viewBox="0 0 980 340" role="img" aria-label="الشكل (4) منحنى خواص الحمل للمولد المركب">`;
  s+=S.w('M10 24H960',sup?'live':'')+S.w('M10 44H960',sup?'live':'')+S.t(968,28,'+','','start')+S.t(968,48,'−','','start')+(rd?S.t(150,18,'DC '+fm(o.Vs||0,0)+' V','b','start'):S.t(150,18,'DC supply','m','start'));
  /* double-pole switch: + pole at x=100 (hops over the − bar), − pole at x=20 */
  s+=S.dot(100,24)+S.dot(20,44)+S.w('M100 24V36',sup?'live':'')+`<path class="w ${sup?'live':''}" d="M100 36A8 8 0 0 1 100 52"/>`+S.w('M100 52V60',sup?'live':'')+S.w('M20 44V60',sup?'live':'');
  [100,20].forEach(x=>{s+=`<circle cx="${x}" cy="60" r="3" fill="var(--fg)"/><circle cx="${x}" cy="86" r="3" fill="var(--fg)"/>`+(o.dp?`<path d="M${x} 60V86" stroke="var(--live)" stroke-width="2.6"/>`:`<path d="M${x} 86L${x+15} 64" stroke="var(--fg)" stroke-width="2.6"/>`)});
  s+=`<path d="M${o.dp?20:28} 73H${o.dp?100:108}" stroke="var(--muted)" stroke-dasharray="4 3"/>`;
  s+=S.w('M100 86V110',mc)+S.w('M20 86V320',mc)+S.dot(100,110);
  /* motor field branch with R_fm and I_fm ammeter */
  s+=S.w('M100 110H56V120',mc)+zig(56,120,56,180,5,mc,true)+S.t(72,150,'Rfm','','start')+(rd&&o.rfm!=null?S.t(72,164,fm(o.rfm*100,0)+'%','m','start'):'');
  s+=S.w('M56 180V190',mc)+ind(56,190,56,252,4,mc)+S.t(70,196,'f2','m','start')+S.t(70,252,'f1','m','start');
  s+=S.w('M56 252V268',mc)+mtr(56,282,'A',null)+S.t(76,278,'Ifm','','start')+(rd&&o.Ifm!=null?`<text class="txt b" x="76" y="294" font-size="12">${fm(o.Ifm,3)} A</text>`:'')+S.w('M56 296V320',mc);
  s+=S.w('M20 320H260',mc)+S.dot(56,320);
  /* starter R_st */
  const rIn=o.RstIn!==false;
  s+=S.w('M100 110H130',mc)+zig(130,110,210,110,6,rIn?mc:'',true)+S.t(170,92,'Rst','')+S.w('M210 110H260V142',mc);
  if(!rIn)s+=S.w('M124 110V130H216V110',mc)+arT(170,146,'مُخرجة',{fs:11,col:'--muted'});
  s+=machSym(260,172,30,'M','dcr1',o.ang)+S.t(276,138,'B1','m','start')+S.t(276,214,'B2','m','start');
  s+=S.w('M260 202V236',mc)+mtr(260,250,'A',null)+S.t(280,246,'Iam','','start')+(rd&&o.Im!=null?`<text class="txt b" x="280" y="262" font-size="12">${fm(o.Im,2)} A</text>`:'')+S.w('M260 264V320',mc);
  /* shaft, tacho, coupling */
  s+=`<rect x="290" y="167" width="180" height="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.2"/>`+tacho(345,172,96,rd&&o.n!=null?fm(Math.round(o.n),0)+' rpm':'—');
  s+=`<rect x="402" y="156" width="8" height="32" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/><rect x="413" y="156" width="8" height="32" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`;
  /* generator */
  s+=machSym(500,172,30,'G','dcr2',o.ang)+S.t(516,138,'B1','m','start')+S.t(516,214,'B2','m','start');
  s+=S.w('M500 142V110H550',gE?'live':'')+S.dot(550,110)+S.w('M500 202V320H950',gc);
  /* shunt field: I_fg ammeter, F2–F1, R_fg */
  s+=S.w('M550 110V126',fc)+mtr(550,140,'A',null)+S.t(570,136,'Ifg','','start')+(rd&&o.Ifg!=null?`<text class="txt b" x="570" y="152" font-size="12">${fm(o.Ifg,3)} A</text>`:'');
  s+=S.w('M550 154V164',fc)+ind(550,164,550,222,4,fc)+S.t(564,170,'F2','m','start')+S.t(564,224,'F1','m','start');
  s+=S.w('M550 222V232',fc)+zig(550,232,550,294,5,fc,true)+S.t(568,262,'Rfg','','start')+(rd&&o.rfg!=null?S.t(568,278,fm(o.rfg,0)+' Ω','m','start'):'')+S.w('M550 294V320',fc)+S.dot(550,320);
  /* series field D1–D2 */
  s+=S.w('M550 110H590',gF?'flow':gE?'live':'')+ind(590,110,670,110,4,gF?'flow':'')+S.t(590,96,o.rev?'D2':'D1','m')+S.t(670,96,o.rev?'D1':'D2','m');
  if(o.rev)s+=arT(630,80,'D1–D2 معكوس',{fs:11.5,col:'--stop'});
  s+=S.w('M670 110H740',gF?'flow':gE?'live':'')+S.dot(700,110);
  /* voltmeter */
  s+=S.w('M700 110V201',gE?'live':'')+mtr(700,215,'V',null)+S.w('M700 229V320',gE?'live':'')+S.dot(700,320)+S.t(718,200,'VL','','start')+(rd&&o.VL!=null?`<text class="txt b" x="718" y="236" font-size="12.5">${fm(o.VL,1)} V</text>`:'');
  /* switch S */
  s+=`<circle cx="740" cy="110" r="3" fill="var(--fg)"/><circle cx="776" cy="110" r="3" fill="var(--fg)"/>`+(o.S?`<path d="M740 110H776" stroke="var(--live)" stroke-width="2.6"/>`:`<path d="M740 110L772 92" stroke="var(--fg)" stroke-width="2.6"/>`)+S.t(758,84,'S','');
  /* lamp bank (9 lamps, connected one by one) */
  const nL=o.lamps||0,br=clamp(o.bright||0,0,1.3);
  s+=S.w('M776 110H936',o.S&&gE?(gF?'flow':'live'):'');
  for(let i=0;i<9;i++){const x=792+i*18,c=i<nL&&o.S;const lc=c?(gF?'flow':''):'';
    s+=`<g${i<nL?'':' opacity=".35"'}>`+S.w(`M${x} 110V150`,lc)+`<circle cx="${x}" cy="158" r="7.5" fill="${c&&br>0.02?`rgba(255,196,0,${fx(0.2+0.75*Math.min(br,1))})`:'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1.3"/><path d="M${x-5} ${153}L${x+5} 163M${x+5} 153L${x-5} 163" stroke="var(--fg)" stroke-width="1.1"/>`+S.w(`M${x} 166V200`,lc)+'</g>'}
  s+=S.w('M792 200H950V236',gF?'flow':'')+mtr(950,250,'A',null)+S.w('M950 264V320',gF?'flow':'')+S.t(932,246,'IL','','end')+(rd&&o.IL!=null?`<text class="txt b" x="932" y="262" text-anchor="end" font-size="12.5">${fm(o.IL,2)} A</text>`:'');
  s+=arT(864,226,rd?`مصابيح موصلة: ${nL} من 9`:'حمل: مصابيح على التوازي',{fs:11.5,col:'--muted'});
  return s+'</svg>'}

/* ---------- shared bench pieces ---------- */
const supplyHTML=(p,label,init)=>`<div class="dc-sw"><button class="btn" id="${p}on" aria-pressed="false">تشغيل المصدر</button></div>${sl(p+'vs',label||'جهد مصدر المحرك المدير',0,250,0.1,init||0)}${fineHTML(p+'d',[-10,-1,-0.1,0.1,1,10],'V')}`;
const TOL_N=5,TOL_I=0.0025;
const VsFor=(v,n,Pg)=>{const kE=kEof(v),Eb=kE*n;return Eb+(v.I0+(Pg||0)/Math.max(Eb,1))*v.Ram};
const okN=(n,t)=>Math.abs(n-t)<=TOL_N;
const recMsg=(ok,t)=>`<div class="callout ${ok?'':'err'}">${t}</div>`;

/* ======================================================================
   Lesson 2 — التجربة الأولى: اختبار اللاحمل للمولد منفصل التغذية (ص 10–13)
   ====================================================================== */
const T11COLS=[0,0.1,0.15,0.2,0.25,0.3],T12COLS=[300,600,900,1200,1600];
const emptyTbl=(head,cols,rows)=>`<div class="dc-tbl"><table class="tt"><thead><tr><th>${head}</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${r}</td>${cols.map(()=>'<td></td>').join('')}</tr>`).join('')}</tbody></table></div>`;
B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'10–13',
 title:'التجربة الأولى: اختبار اللاحمل للمولد منفصل التغذية',
 summary:'نُدير المولد بمحرك توازي ونغذي مجاله من مصدر مستقل، ثم نقيس القوة الدافعة المتولدة E₀ مرة مع تغيير تيار المجال عند سرعة ثابتة 1000 rpm (منحنى المغنطة)، ومرة مع تغيير السرعة عند تيار مجال ثابت 0.3 A.',
 stations:[
  {intro:true},

  {st:1,short:'أهداف التجربة',title:'أهداف التجربة الأولى: اختبار اللاحمل للمولد منفصل التغذية',ref:'ص 10',
   q:'المولد يدور ولا يتصل به أي حمل… فما الذي يحدد الجهد الذي يظهر على أطرافه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد له مقبضان: تيار المجال والسرعة، وفولتميتر يقرأ القوة الدافعة المتولدة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المولد ⟦G⟧: آلة تيار مستمر يديرها محرك، ولا يتصل بأطرافها حمل في هذه التجربة."><circle cx="180" cy="150" r="46" fill="#F2C14E" stroke="#2C4A40" stroke-width="4"/><text x="180" y="160" text-anchor="middle" font-size="28" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text></g><g data-tip="تيار المجال ⟦If⟧: يغذي ملف المجال فيصنع الفيض المغناطيسي. التجربة تغيّره في المرحلة الأولى وتثبّته في الثانية."><rect x="40" y="200" width="100" height="70" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="90" cy="226" r="14" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><line x1="90" y1="226" x2="98" y2="216" stroke="#FBF6EE" stroke-width="3"/><text x="90" y="260" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="3">f</tspan></text><line x1="128" y1="200" x2="150" y2="184" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="سرعة الدوران ⟦n⟧: يحددها المحرك المدير. التجربة تثبّتها في المرحلة الأولى وتغيّرها في الثانية."><rect x="220" y="200" width="100" height="70" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="270" cy="226" r="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><line x1="270" y1="226" x2="278" y2="216" stroke="#FBF6EE" stroke-width="3"/><text x="270" y="260" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">n</text><line x1="232" y1="200" x2="210" y2="184" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="القوة الدافعة الكهربائية المتولدة ⟦E0⟧: يقرؤها الفولتميتر على أطراف المولد، لأنه لا يمر تيار حمل."><line x1="180" y1="104" x2="180" y2="80" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="58" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="65" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text><text x="216" y="64" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="10" dy="3">0</tspan></text></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مقبضان ونتيجة واحدة</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) للعاملين اللذين تدرسهما التجربة.<br><b>مرّر المؤشر على المولد والمقبضين والفولتميتر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الهدفان 2 و3 يدرسان القوة الدافعة المتولدة مع عاملين. ما هما؟',opts:[
     ['تيار المجال والسرعة',true,'«عند تيار مجال متغير وسرعة ثابتة» ثم «عند سرعة متغيرة وتيار مجال ثابت» (ص 10).'],
     ['تيار الحمل وجهد الحمل',false,'لا حمل في هذه التجربة؛ تيار الحمل وجهده موضوع التجربة الثانية.'],
     ['جهد مصدر المجال ومقاومة الحمل',false,'مصدر المجال وسيلة لتغيير تيار المجال، ولا توجد مقاومة حمل في الشكل (1).']]}}
   ],
   body:[
    {book:String.raw`<p class="ltr" style="display:block;text-align:left">No-load test of a separately-excited DC generator</p><p><b>أهداف التجربة:</b></p><ol>
     <li>معرفة العوامل المؤثرة على القوة الدافعة الكهربائية المتولدة بالمولد \(E_0\).</li><li>دراسة خواص القوة الدافعة الكهربائية المتولدة عند تيار مجال متغير وسرعة ثابتة.</li><li>دراسة خواص القوة الدافعة الكهربائية المتولدة عند سرعة متغيرة وتيار مجال ثابت.</li><li>رسم العلاقة بين القوة الدافعة المتولدة \(E_0\) وتيار المجال \(I_f\) عندما تكون سرعة الدوران ثابتة.</li></ol>`,ref:'ص 10'},
    {tip:String.raw`<p>القوة الدافعة المتولدة في المولد تتناسب مع <b>الفيض المغناطيسي</b> \(\Phi\) ومع <b>السرعة</b> \(n\):</p><div class="eq">$$E_0=K\,\Phi\,n$$</div><p>والفيض يصنعه تيار المجال \(I_f\). لذلك تغيّر التجربة كل عامل وحده وتثبّت الآخر، لترى أثر كل واحد منفصلاً. (هذه العلاقة من دراستك النظرية، وليست في الحقيبة.)</p>`,title:'لماذا هذان العاملان؟'},
    {tip:String.raw`<p>«<b>لاحمل</b>» يعني أن أطراف المولد لا يتصل بها إلا الفولتميتر (تياره صغير جداً)، فلا هبوط جهد داخل المولد، ويقرأ الفولتميتر \(E_0\) نفسها.</p>`,title:'معنى «اللاحمل»'}
   ]},

  {st:2,short:'الأجهزة',title:'الأجهزة المستخدمة',ref:'ص 10',
   q:'ستة أجهزة على الطاولة… ما دور كل واحد منها في التجربة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ست بطاقات للأجهزة: مصدر جهد، مصدر تيار، آلتا توازي، فولتميتر، مقياس سرعة، أميتر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="مصدر جهد مستمر متحكم فيه ⟦0-250 V DC⟧: يغذي المحرك المدير، وبرفع جهده ترتفع السرعة."><rect x="248" y="40" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="268" y="58" width="56" height="40" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="296" y="83" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">V DC</text><text x="296" y="122" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مصدر جهد</text><text x="296" y="140" text-anchor="middle" font-size="11" fill="#2C4A40">للمحرك</text></g><g data-tip="مصدر تيار مستمر متحكم فيه ⟦0-240V / 0-6A⟧: يغذي ملف مجال المولد وحده، وبه نضبط تيار المجال."><rect x="132" y="40" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="152" y="58" width="56" height="40" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="83" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">A DC</text><text x="180" y="122" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مصدر تيار</text><text x="180" y="140" text-anchor="middle" font-size="11" fill="#2C4A40">لمجال المولد</text></g><g data-tip="آلتا تيار مستمر توازي: الأولى تعمل محركاً مديراً ⟦M⟧، والثانية مولداً ⟦G⟧ يُغذى مجاله منفصلاً."><rect x="16" y="40" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="46" cy="78" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="46" y="84" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><circle cx="82" cy="78" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="82" y="84" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><line x1="62" y1="78" x2="66" y2="78" stroke="#2C4A40" stroke-width="4"/><text x="64" y="122" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">آلتا توازي</text><text x="64" y="140" text-anchor="middle" font-size="11" fill="#2C4A40">محرك ومولد</text></g><g data-tip="الفولتميتر ⟦voltmeter⟧: على أطراف المولد، يقرأ القوة الدافعة المتولدة ⟦E0⟧."><rect x="248" y="168" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="296" cy="208" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="296" y="215" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text><text x="296" y="254" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">فولتميتر</text></g><g data-tip="مقياس السرعة ⟦Tachometer⟧: على العمود، يقرأ سرعة الدوران ⟦n⟧ باللفة في الدقيقة."><rect x="132" y="168" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M158 222 a22 22 0 0 1 44 0" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="180" y1="222" x2="194" y2="206" stroke="#E8735A" stroke-width="3"/><circle cx="180" cy="222" r="4" fill="#2C4A40"/><text x="180" y="254" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مقياس السرعة</text></g><g data-tip="الأميتر ⟦Ammeter⟧: الأميتر ⟦A1⟧ في دائرة مجال المولد، يقرأ تيار المجال ⟦If⟧."><rect x="16" y="168" width="96" height="112" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="64" cy="208" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="64" y="215" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text><text x="64" y="254" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">أميتر</text></g></svg>`,
   cap:'الأجهزة الستة بترتيب قائمة الكتاب.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف دور الجهاز ومكانه.</b>',
   side:[
    {predict:{q:'أي جهاز يقرأ القوة الدافعة المتولدة \\(E_0\\)؟',opts:[
     ['الأميتر',false,'الأميتر A1 في دائرة المجال، يقرأ تيار المجال If.'],
     ['مقياس السرعة',false,'مقياس السرعة يقرأ n، وهي أحد العاملين المؤثرين على E₀.'],
     ['الفولتميتر على أطراف المولد',true,'الخطوة 4 (ص 11): «قم بتسجيل قيمة القوة الدافعة الكهربائية المتولدة E₀ الظاهرة على جهاز الفولتميتر».']]}}
   ],
   body:[
    {book:String.raw`<ol><li>مصدر جهد مستمر متحكم فيه.</li><li>مصدر تيار مستمر متحكم فيه.</li><li>آلتا تيار مستمر توازي.</li><li>جهاز فولتميتر (voltmeter).</li><li>جهاز قياس السرعة (Tachometer).</li><li>جهاز أميتر (Ammeter).</li></ol>`,ref:'ص 10'},
    {tip:String.raw`<p>لاحظ أن عندنا <b>مصدرين</b>: مصدر جهد للمحرك (يتحكم في السرعة)، ومصدر تيار لمجال المولد (يتحكم في الفيض). وجود مصدر مستقل للمجال هو معنى «منفصل التغذية».</p>`,title:'مصدران لا مصدر واحد'}
   ]},

  {st:3,short:'دائرة التوصيل',title:'مخطط التوصيل — الشكل <span class="ltr">(1)</span>',ref:'ص 10',
   q:'دائرتان كهربائيتان لا يصل بينهما أي سلك… فكيف تنتقل الحركة من الأولى إلى الثانية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبسط عن الشكل 1: مصدر 0-250 فولت يغذي المحرك M، والعمود عليه مقياس السرعة والقارنة إلى المولد G، ومجال المولد من مصدر 0-240 فولت 0-6 أمبير عبر A1، والفولتميتر على أطراف المولد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="مصدر المحرك ⟦0-250 V DC⟧: يغذي منتج المحرك المدير وملف مجاله معاً (محرك توازي)."><rect x="14" y="54" width="70" height="54" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="49" y="78" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">DC</text><text x="49" y="96" text-anchor="middle" font-size="10.5" fill="#FBF6EE" font-family="var(--mono)" direction="ltr">0-250 V</text></g><path d="M49 108 V150 H72" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="المحرك المدير ⟦M⟧ (آلة توازي): يدير المولد بسرعة نضبطها بجهد المصدر."><circle cx="96" cy="150" r="24" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="96" y="157" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text></g><g data-tip="العمود المشترك: يربط المحرك بالمولد ميكانيكياً، فلا يوجد سلك كهربائي بين الدائرتين."><rect x="120" y="146" width="110" height="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="مقياس السرعة ⟦Tacho⟧: على العمود، يقرأ سرعة الدوران ⟦n⟧."><rect x="134" y="118" width="30" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="149" y="133" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)">n</text><line x1="149" y1="140" x2="149" y2="146" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="القارنة ⟦coupling⟧: تصل عمود المحرك بعمود المولد."><rect x="186" y="138" width="8" height="24" rx="2" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="196" y="138" width="8" height="24" rx="2" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="المولد ⟦G⟧: أطراف منتجه ⟦1B1⟧ و⟦2B2⟧ لا يتصل بها إلا الفولتميتر (لا حمل)."><circle cx="254" cy="150" r="24" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="254" y="157" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text></g><path d="M254 126 V70 H316 V128 M316 172 V230 H278" fill="none" stroke="#2C4A40" stroke-width="2.5"/><path d="M254 174 V230 H278" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="الفولتميتر ⟦V⟧ على أطراف المولد: يقرأ القوة الدافعة المتولدة ⟦E0⟧."><circle cx="316" cy="150" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="316" y="157" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><text x="316" y="62" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E<tspan font-size="10" dy="3">0</tspan></text><g data-tip="ملف مجال المولد ⟦E1–E2⟧: يُغذى منفصلاً من مصدر التيار، لا من أطراف المولد."><path d="M150 252 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0" fill="none" stroke="#E8735A" stroke-width="3.5"/></g><g data-tip="الأميتر ⟦A1⟧: يقرأ تيار مجال المولد ⟦If⟧."><circle cx="120" cy="252" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="120" y="257" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A1</text></g><path d="M135 252 H150 M214 252 H226 V284 M105 252 H94 V284" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="مصدر مجال المولد ⟦0-240V / 0-6A⟧: مصدر تيار مستمر متحكم فيه، مستقل عن مصدر المحرك."><rect x="84" y="276" width="152" height="30" rx="7" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="160" y="296" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">0-240V / 0-6A</text></g></svg>`,
   cap:'مبسّط عن الشكل <span class="ltr">(1)</span>: مصدر المحرك فيروزي، ومصدر مجال المولد برتقالي، والعمود يربط الآلتين ميكانيكياً.<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف اسمه ودوره.</b>',
   side:[
    {predict:{q:'لو رفعت جهد مصدر المحرك، أي قراءة تتغير مباشرة؟',opts:[
     ['قراءة الأميتر A1 (تيار المجال)',false,'A1 في دائرة مصدر المجال المستقل، ولا يتصل بمصدر المحرك.'],
     ['قراءة مقياس السرعة',true,'جهد المصدر يرفع سرعة المحرك المدير، كما في الخطوة 3: «ارفع في جهد مصدر التيار المستمر حتى تصل السرعة عند 1000 rpm».'],
     ['لا شيء يتغير',false,'المحرك يتسارع، وتتغير معه سرعة المولد وقراءة E₀ أيضاً.']]}}
   ],
   body:[
    {book:String.raw`<p><b>مخطط التوصيل — الشكل <span class="ltr">(1)</span></b></p>`+box(benchSVG({kind:'nl',rd:false}),900,1),ref:'ص 10'},
    {tip:String.raw`<p>يسار المخطط: المحرك المُدير <span class="ltr">M</span> (توازي)، ملف مجاله <span class="ltr">E1–E2</span> ومنتجه <span class="ltr">1B1–2B2</span> كلاهما على المصدر <span class="ltr">0-250 V DC</span>. على العمود مقياس السرعة ثم القارنة إلى المولد <span class="ltr">G</span>. يمين المخطط: مجال المولد يُغذى من مصدر <span class="ltr">0-240 V / 0-6 A</span> عبر الأميتر <span class="ltr">A1</span>، والفولتميتر <span class="ltr">V</span> على أطراف المنتج يقرأ \(E_0\).</p>`,title:'اقرأ المخطط من اليسار إلى اليمين'},
    {watch:String.raw`<p>لا يتصل مصدر المحرك بمجال المولد في هذا الشكل. لو وصلت مجال المولد على أطرافه لصار «مولد توازي» وهذا موضوع التجربة الثالثة.</p>`}
   ]},

  {st:4,short:'المرحلة الأولى',title:'خطوات إجراء التجربة — المرحلة الأولى وجدول <span class="ltr">(1-1)</span>',ref:'ص 11',
   q:'كيف نغيّر تيار المجال وحده، دون أن تتغير السرعة معه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مثبتة عند 1000 لفة في الدقيقة، وتيار المجال يتغير من 0 إلى 0.3 أمبير" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="السرعة ثابتة في هذه المرحلة: ⟦n = 1000 rpm⟧، نضبطها بجهد مصدر المحرك (الخطوة 3)."><rect x="196" y="56" width="140" height="140" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M226 140 a40 40 0 0 1 80 0" fill="none" stroke="#2C4A40" stroke-width="4"/><line x1="266" y1="140" x2="266" y2="104" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><circle cx="266" cy="140" r="6" fill="#2C4A40"/><text x="266" y="174" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1000 rpm</text><rect x="306" y="66" width="20" height="16" rx="3" fill="#2C4A40"/><path d="M310 66 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><text x="266" y="220" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ثابتة</text><g data-tip="تيار المجال يتغير بقيم جدول ⟦(1-1)⟧: ⟦0، 0.1، 0.15، 0.2، 0.25، 0.3 A⟧."><rect x="24" y="56" width="152" height="140" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="44" y1="150" x2="156" y2="150" stroke="#2C4A40" stroke-width="2.5"/><g fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"><circle cx="48" cy="150" r="5"/><circle cx="80" cy="150" r="5"/><circle cx="96" cy="150" r="5"/><circle cx="112" cy="150" r="5"/><circle cx="128" cy="150" r="5"/><circle cx="144" cy="150" r="5"/></g><g font-size="9.5" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="48" y="170">0</text><text x="80" y="170">.1</text><text x="96" y="182">.15</text><text x="112" y="170">.2</text><text x="128" y="182">.25</text><text x="144" y="170">.3</text></g><path d="M52 120 H136" stroke="#E8735A" stroke-width="3"/><polygon points="146,120 134,114 134,126" fill="#E8735A"/><text x="100" y="94" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="11" dy="4">f</tspan><tspan dy="-4"> (A)</tspan></text></g><text x="100" y="220" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">يتغير</text><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">نغيّر عاملاً واحداً ونثبّت الآخر</text></svg>`,
   cap:'المرحلة الأولى: السرعة مثبتة، وتيار المجال يأخذ قيم جدول <span class="ltr">(1-1)</span>.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف القيم.</b>',
   side:[
    {predict:{q:'قبل تشغيل مصدر المحرك، على أي قيمة يجب أن يكون مضبوطاً؟',opts:[
     ['على الصفر',true,'الخطوة 2: «تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر» — فيبدأ المحرك ببطء ونرفع الجهد تدريجياً.'],
     ['على أعلى قيمة 250 V',false,'هذا يدفع المحرك الواقف دفعة واحدة؛ الكتاب يطلب البدء من الصفر ثم الرفع.'],
     ['على أي قيمة، ثم نضبط السرعة بعد ذلك',false,'الكتاب يحدد البدء من الصفر صراحة.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>قم بتوصيل التجربة كما في الشكل (1).</li><li>تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر.</li><li>ارفع في جهد مصدر التيار المستمر حتى تصل السرعة عند <span class="ltr">1000 rpm</span>.</li><li>غير قيم تيار المجال للمولد \(I_f\) عن طريق مصدر التيار المستمر المتحكم فيه حسب الجدول (1-1) الموضح بالأسفل، ثم قم بتسجيل قيمة القوة الدافعة الكهربائية المتولدة \(E_0\) الظاهرة على جهاز الفولتميتر.</li><li>بعد الانتهاء أعد جهد المصدر إلى الصفر حتى يتوقف المحرك.</li><li>ارسم العلاقة بين تيار المجال \(I_f\) والقوة الدافعة الكهربائية المتولدة \(E_0\) وذلك عند ثبات السرعة \(n\).</li></ol>
     <p><b>جدول (1-1)</b> — <span class="ltr">n = 1000 r.p.m</span></p>`+emptyTbl('I<sub>f</sub> (A)',T11COLS.map(c=>fm(c)),['E<sub>0</sub> (v)']),ref:'ص 11'},
    {tip:String.raw`<p>المصدران لهما دوران مختلفان: <b>مصدر المحرك</b> ترفعه مرة واحدة حتى تصل السرعة إلى <span class="ltr">1000 rpm</span> ثم تتركه، و<b>مصدر المجال</b> هو الذي تحرّكه من قيمة إلى قيمة في الجدول. انظر إلى مقياس السرعة قبل كل قراءة لتتأكد أنها ما زالت <span class="ltr">1000 rpm</span>.</p>`,title:'أي مصدر تحرّك؟'},
    {watch:String.raw`<p>أول عمود في الجدول \(I_f=0\): لا تتوقع أن يقرأ الفولتميتر صفراً تماماً. سجّل ما تقرؤه فعلاً — ستعرف السبب في المحطة التالية.</p>`}
   ]},

  {st:5,short:'منحنى E₀ مع If',title:'منحنى العلاقة بين \\(E_0\\) وتيار المجال \\(I_f\\)',ref:'ص 11',
   q:'هل يكون المنحنى خطاً مستقيماً يبدأ من الصفر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكل توضيحي لمنحنى المغنطة: يبدأ من جهد صغير عند تيار مجال صفر، ثم يرتفع شبه مستقيم، ثم ينحني عند الركبة نحو التشبع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="62" y="56" width="262" height="200" rx="6" fill="#FBF6EE"/><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="62" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,54 65,64 75,64" fill="#2C4A40"/><text x="84" y="68" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">E (v)</text><text x="318" y="290" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">f</tspan><tspan dy="-3"> (A)</tspan></text><g font-size="10" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="70" y="266">0</text><text x="150" y="266">0.1</text><text x="190" y="266">0.15</text><text x="230" y="266">0.2</text><text x="270" y="266">0.25</text><text x="310" y="266">0.3</text></g><path d="M70.0 237.4 L78.0 227.6 L86.0 217.9 L94.0 208.2 L102.0 198.8 L110.0 189.6 L118.0 180.7 L126.0 172.1 L134.0 163.9 L142.0 156.0 L150.0 148.6 L158.0 141.6 L166.0 135.0 L174.0 128.8 L182.0 123.0 L190.0 117.7 L198.0 112.8 L206.0 108.2 L214.0 104.1 L222.0 100.2 L230.0 96.7 L238.0 93.6 L246.0 90.7 L254.0 88.0 L262.0 85.6 L270.0 83.5 L278.0 81.5 L286.0 79.7 L294.0 78.1 L302.0 76.7 L310.0 75.4" fill="none" stroke="#12855A" stroke-width="3.5"/><g data-tip="الجهد المتبقي: عند ⟦If = 0⟧ يتولد جهد صغير بسبب المغنطة المتبقية في الأقطاب."><circle cx="70" cy="237.4" r="12" fill="transparent"/><circle cx="70" cy="237.4" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="الجزء شبه المستقيم: الفيض يزيد تقريباً بنسبة زيادة تيار المجال، فيرتفع الجهد بانتظام."><path d="M80 225 L140 158" stroke="transparent" stroke-width="26"/><text x="100" y="166" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700">مستقيم</text></g><g data-tip="الركبة ثم التشبع: يتشبع الحديد فيقل أثر زيادة تيار المجال، فيقل ميل المنحنى."><circle cx="200" cy="112" r="16" fill="transparent"/><circle cx="200" cy="112" r="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="200" y="146" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700">الركبة</text><text x="290" y="104" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700">تشبع</text></g></svg>`,
   cap:'الكتاب يعطي شبكة فارغة بمحوريها؛ شكل المنحنى هنا <b>توضيحي</b> بلا أرقام على محور الجهد، وموضع الركبة يختلف من آلة إلى أخرى.<br><b>مرّر المؤشر على النقطتين والجزء المستقيم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تيار المجال صفر والمولد يدور بسرعته. ماذا يقرأ الفولتميتر؟',opts:[
     ['صفراً تماماً، لأنه لا يوجد تيار مجال',false,'يبقى في حديد الأقطاب قليل من المغناطيسية من تشغيل سابق، فيتولد جهد صغير.'],
     ['جهداً صغيراً (الجهد المتبقي)',true,'هذا ما يسأل عنه الكتاب في السؤالين 5 و6 (ص 13): المغنطة المتبقية تولد جهداً صغيراً.'],
     ['أعلى جهد يمكن أن يولده المولد',false,'أعلى جهد يحتاج أكبر فيض، أي أكبر تيار مجال.']]}}
   ],
   body:[
    {tip:String.raw`<p>هذا المنحنى يسمى <b>منحنى المغنطة</b> أو منحنى اللاحمل، وله ثلاثة أجزاء:</p><ul><li><b>البداية:</b> لا يبدأ من الصفر، بل من جهد صغير سببه <b>المغنطة المتبقية</b>.</li><li><b>جزء شبه مستقيم:</b> الفيض يزيد تقريباً بنسبة زيادة \(I_f\).</li><li><b>الركبة ثم التشبع:</b> يتشبع الحديد فيقل أثر زيادة \(I_f\) ويقل ميل المنحنى.</li></ul>`,title:'ماذا تتوقع أن ترسم؟'},
    {watch:String.raw`<p>المحور الأفقي لـ \(I_f\) لأنه المتغير الأصلي الذي غيّرته، والرأسي لـ \(E_0\) لأنها التابعة (قاعدة التقرير ص 5–6). وارسم أقرب منحنى أملس بين نقاطك، لا خطاً متعرجاً.</p>`},
    {add:String.raw`<p>عند أخذ قراءات منحنى المغنطة في المختبرات يُرفع تيار المجال في اتجاه واحد فقط (من الصغير إلى الكبير)؛ لأن الرجوع إلى قيمة أصغر ثم الصعود مرة أخرى يعطي قراءة مختلفة قليلاً بسبب مغنطة الحديد.</p>`,title:'عادة في المختبرات'}
   ]},

  {st:6,short:'المرحلة الثانية',title:'المرحلة الثانية وجدول <span class="ltr">(1-2)</span>',ref:'ص 12',
   q:'الآن نثبّت تيار المجال ونغيّر السرعة… فبأي جهاز نغيّرها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار المجال مثبت عند 0.3 أمبير، والسرعة تتغير بقيم جدول 1-2" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="تيار المجال ثابت في هذه المرحلة: ⟦If = 0.3 A⟧ (الخطوة 1)."><rect x="196" y="56" width="140" height="140" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="266" cy="120" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="266" y="127" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A1</text><text x="266" y="174" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.3 A</text><rect x="306" y="66" width="20" height="16" rx="3" fill="#2C4A40"/><path d="M310 66 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><text x="266" y="220" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ثابت</text><g data-tip="السرعة تتغير بقيم جدول ⟦(1-2)⟧: ⟦300، 600، 900، 1200، 1600 rpm⟧، بتغيير جهد مصدر المحرك."><rect x="24" y="56" width="152" height="140" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="44" y1="150" x2="156" y2="150" stroke="#2C4A40" stroke-width="2.5"/><g fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"><circle cx="58" cy="150" r="5"/><circle cx="79" cy="150" r="5"/><circle cx="100" cy="150" r="5"/><circle cx="121" cy="150" r="5"/><circle cx="149" cy="150" r="5"/></g><g font-size="9.5" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="58" y="170">300</text><text x="79" y="184">600</text><text x="100" y="170">900</text><text x="121" y="184">1200</text><text x="149" y="170">1600</text></g><path d="M52 120 H136" stroke="#4FB3A9" stroke-width="3"/><polygon points="146,120 134,114 134,126" fill="#4FB3A9"/><text x="100" y="94" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n (rpm)</text></g><text x="100" y="220" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">تتغير</text><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">عكس المرحلة الأولى</text></svg>`,
   cap:'المرحلة الثانية: تيار المجال مثبت، والسرعة تأخذ قيم جدول <span class="ltr">(1-2)</span>.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف القيم.</b>',
   side:[
    {predict:{q:'بأي مصدر تغيّر السرعة في هذه المرحلة؟',opts:[
     ['بمصدر التيار المتحكم فيه (مصدر المجال)',false,'هذا يغيّر تيار المجال، والمطلوب أن يبقى ثابتاً عند 0.3 A.'],
     ['بمصدر الجهد المستمر (مصدر المحرك)',true,'الخطوة 2: «قم بتغيير مصدر الجهد المستمر حتى تصل سرعة المحرك للسرعات المطلوبة في الجدول (1-2)».'],
     ['بفك القارنة',false,'فك القارنة يفصل المولد عن المحرك فيتوقف المولد.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>ارفع مصدر التيار المستمر حتى يصل تيار المجال إلى <span class="ltr">0.3 A</span> ثم توقف.</li><li>قم بتغيير مصدر الجهد المستمر حتى تصل سرعة المحرك للسرعات المطلوبة في الجدول (1-2) ثم سجل قيم القوة الدافعة الكهربائية المتولدة \(E_0\) عند كل قراءة.</li><li>ارسم العلاقة بين السرعة \(n\) والقوة الدافعة الكهربائية \(E_0\) وذلك عند ثبات تيار المجال \(I_f\).</li></ol>
     <p><b>جدول (1-2)</b> — <span class="ltr">I<sub>f</sub> = 0.3 A</span></p>`+emptyTbl('n (r.p.m)',T12COLS.map(c=>c),['E<sub>0</sub> (v)']),ref:'ص 12'},
    {tip:String.raw`<p>انظر إلى الأميتر <span class="ltr">A1</span> مع كل سرعة جديدة: يجب أن يبقى \(I_f\) عند <span class="ltr">0.3 A</span>، وإلا فلن تكون القراءات لتيار مجال ثابت.</p>`},
    {watch:String.raw`<p>آخر سرعة في جدول (1-2) مطبوعة بالأرقام الهندية «١٦٠٠» بين أرقام لاتينية؛ اعتمدنا <span class="ltr">1600 rpm</span> كما طُبعت، مع أن تدرج الجدول (300، 600، 900، 1200) يوحي بأن المقصود ربما 1500.</p>`,fix:true}
   ]},

  {st:7,short:'منحنى E₀ مع n',title:'منحنى العلاقة بين \\(E_0\\) والسرعة \\(n\\)',ref:'ص 12',
   q:'إذا ضاعفت السرعة وتيار المجال ثابت، ماذا يحدث لـ \\(E_0\\)؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكل توضيحي: خط مستقيم يمر قرب نقطة الأصل، القوة الدافعة تزيد بنسبة زيادة السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="62" y="56" width="262" height="200" rx="6" fill="#FBF6EE"/><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="62" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,54 65,64 75,64" fill="#2C4A40"/><text x="84" y="68" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">E<tspan font-size="9" dy="3">o</tspan><tspan dy="-3"> (v)</tspan></text><text x="318" y="290" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">n (rpm)</text><g font-size="10" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="70" y="266">0</text><text x="115" y="266">300</text><text x="160" y="266">600</text><text x="205" y="266">900</text><text x="250" y="266">1200</text><text x="310" y="266">1600</text></g><g data-tip="خط مستقيم يمر قرب نقطة الأصل: عند ثبات تيار المجال يثبت الفيض، فتتناسب ⟦E0⟧ طردياً مع السرعة."><path d="M70 250 L310 79" stroke="transparent" stroke-width="24"/><path d="M70 250 L310 79" stroke="#12855A" stroke-width="3.5"/></g><g data-tip="عند ⟦600 rpm⟧ ضعف ما عند ⟦300 rpm⟧ تقريباً."><circle cx="115" cy="217.9" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="160" cy="185.9" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="عند ⟦1200 rpm⟧ ضعف ما عند ⟦600 rpm⟧ تقريباً."><circle cx="205" cy="153.8" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="250" cy="121.8" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="310" cy="79" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g></svg>`,
   cap:'الكتاب يعطي شبكة فارغة؛ الخط هنا <b>توضيحي</b> بلا أرقام على محور الجهد.<br><b>مرّر المؤشر على الخط والنقاط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تيار المجال ثابت <span class="ltr">0.3 A</span>، والسرعة من <span class="ltr">600 rpm</span> إلى <span class="ltr">1200 rpm</span>. ماذا يحدث لـ \\(E_0\\)؟',opts:[
     ['تبقى ثابتة لأن تيار المجال ثابت',false,'تيار المجال الثابت يثبّت الفيض، لكن موصلات المنتج تقطعه الآن بسرعة أكبر.'],
     ['تنقص إلى النصف',false,'زيادة السرعة تزيد الجهد ولا تنقصه.'],
     ['تتضاعف تقريباً',true,'الفيض ثابت، و\\(E_0=K\\Phi n\\)، فضعف السرعة يعطي ضعف الجهد تقريباً (السؤال 7 ص 13).']]}}
   ],
   body:[
    {title:'غيّر السرعة وشاهد النسبة',widget:(el,B)=>{
      const N=[300,600,900,1200,1600];let n=300;
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اختر سرعة من جدول (1-2). الشريط يبين \\(E_0\\) نسبةً إلى قيمتها عند <span class="ltr">300 rpm</span> (تيار المجال ثابت، فالنسبة لا تحتاج أرقام الآلة).</p><div class="w-row" style="margin-top:0"><span class="w-l">السرعة</span><span class="mseg">${N.map(v=>`<button type="button" data-v="${v}">${v}</button>`).join('')}</span></div><div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i></div></div><div class="w-facts"><div><span>نسبة السرعة إلى 300 rpm</span><b data-o="r1"></b></div><div><span>نسبة E<sub>0</sub> إلى قيمتها عند 300 rpm (تقريباً)</span><b data-o="r2"></b></div></div>`;
      B.math(el);const o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const r=n/300;o('r1').textContent='× '+B.fmtN(r,2);o('r2').textContent='× '+B.fmtN(r,2);el.querySelector('.spd-n').style.width=(n/1600*100)+'%';el.querySelectorAll('.mseg button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v===n)))};
      el.querySelectorAll('.mseg button').forEach(b=>b.onclick=()=>{n=+b.dataset.v;draw()});draw();
    }},
    {tip:String.raw`<p>المنحنى المتوقع خط مستقيم تقريباً يمر قرب نقطة الأصل (عند السرعة صفر لا جهد). قراءاتك الفعلية ستكون قريبة منه لا عليه تماماً، فارسم أقرب خط بينها.</p>`},
    {watch:String.raw`<p>هذا التناسب يصح فقط و<b>تيار المجال ثابت</b>. في المرحلة الأولى كانت السرعة ثابتة وتيار المجال يتغير، فخرج منحنى منحنٍ لا خط مستقيم.</p>`}
   ]},

  {st:8,short:'الأسئلة',title:'الأسئلة',ref:'ص 13',
   q:'عكستَ طرفي ملف المجال… فهل يتغير مقدار الجهد أم إشارته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="فولتميتر قبل عكس طرفي المجال وبعده: المؤشر يتحرك في الاتجاه المعاكس" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="التوصيل الأصلي: ⟦E1⟧ إلى الموجب ⟦E2⟧ إلى السالب، فيعطي المولد قطبية معينة على أطرافه."><rect x="196" y="60" width="140" height="170" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M226 140 a40 40 0 0 1 80 0" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="266" y1="140" x2="292" y2="112" stroke="#12855A" stroke-width="4" stroke-linecap="round"/><circle cx="266" cy="140" r="5" fill="#2C4A40"/><path d="M226 186 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0" fill="none" stroke="#E8735A" stroke-width="3"/><text x="224" y="214" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">E1</text><text x="308" y="214" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">E2</text></g><text x="266" y="254" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قبل</text><g data-tip="بعد عكس طرفي ملف المجال: ينعكس اتجاه تيار المجال فينعكس الفيض، فتنعكس قطبية الجهد على الأطراف ويتحرك المؤشر في الاتجاه المعاكس."><rect x="24" y="60" width="140" height="170" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M54 140 a40 40 0 0 1 80 0" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="94" y1="140" x2="68" y2="112" stroke="#C2492F" stroke-width="4" stroke-linecap="round"/><circle cx="94" cy="140" r="5" fill="#2C4A40"/><path d="M54 186 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0" fill="none" stroke="#E8735A" stroke-width="3"/><text x="52" y="214" text-anchor="middle" font-size="11" fill="#C2492F" font-family="var(--mono)">E2</text><text x="136" y="214" text-anchor="middle" font-size="11" fill="#C2492F" font-family="var(--mono)">E1</text></g><text x="94" y="254" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">بعد عكس المجال</text><text x="180" y="294" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600" direction="rtl">السؤال 4: قطبية الجهد</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) للسؤال 4.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف ما تغيّر.</b>',
   side:[
    {predict:{q:'كيف تغيّر قطبية الجهد المتولد على طرفي المولد؟ (السؤال 4)',opts:[
     ['بزيادة السرعة',false,'زيادة السرعة تكبّر الجهد ولا تعكس إشارته.'],
     ['بعكس طرفي ملف المجال أو بعكس اتجاه الدوران',true,'عكس اتجاه تيار المجال يعكس الفيض، وعكس الدوران يعكس اتجاه قطع الموصلات له؛ وعكس الاثنين معاً يُبقي القطبية كما هي.'],
     ['بزيادة تيار المجال',false,'زيادة تيار المجال تكبّر الجهد في الاتجاه نفسه.']]}}
   ],
   body:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ol>
     <li>من خلال نتائج رسم العلاقة بين القوة الدافعة المتولدة وسرعة المحرك عند ثبوت تيار المجال، ماذا تلاحظ من هذا المنحنى؟</li>
     <li>ناقش المنحنيات التي حصلت عليها وسجل ملاحظاتك.</li>
     <li>ما هي العوامل التي تؤثر على القوة الدافعة الكهربائية المتولدة في المولد؟</li>
     <li>كيف يمكن تغيير قطبية الجهد المتولد على طرفي المولد؟</li>
     <li>ما هي قيمة القوة الدافعة المتولدة عندما يكون تيار المجال مساوياً للصفر وعندما يدور المولد بالسرعة المقننة؟</li>
     <li>بماذا تفسر تولد قوة دافعة إذا كان تيار المجال يساوي صفر؟</li>
     <li>ما تأثير زيادة السرعة على القوة الدافعة المتولدة عندما يكون تيار المجال ثابتاً؟</li></ol>`,ref:'ص 13'},
    {predict:{q:'بماذا تفسر تولد قوة دافعة وتيار المجال صفر؟ (السؤال 6)',opts:[
     ['بخطأ في الفولتميتر',false,'الجهد حقيقي ويتكرر في كل مولد، وليس خطأ قراءة.'],
     ['بأن مصدر المحرك يغذي المولد',false,'لا يوجد أي سلك بين مصدر المحرك وأطراف المولد في الشكل (1).'],
     ['بالمغنطة المتبقية في حديد الأقطاب',true,'بعد إيقاف تيار المجال يبقى فيض صغير في الأقطاب، فتقطعه موصلات المنتج عند الدوران فيتولد جهد صغير.']]}},
    {tip:String.raw`<p>لكل سؤال إجابة مقترحة (ليست من الكتاب) في الأسلوب الرسمي لهذا الدرس: غيّر «أسلوب الشرح» في الأعلى إلى «رسمي». وجرّب عكس أطراف المجال بنفسك في تبويب «المختبر».</p>`}
   ]},

  {recap:[
   'التجربة الأولى تدرس \\(E_0\\) مع عاملين: تيار المجال \\(I_f\\) (والسرعة ثابتة) والسرعة \\(n\\) (وتيار المجال ثابت)، والمولد بلا حمل (ص 10).',
   'الشكل <span class="ltr">(1)</span>: المحرك المدير يُغذى من <span class="ltr">0-250 V DC</span>، ومجال المولد من مصدر مستقل <span class="ltr">0-240 V / 0-6 A</span> عبر <span class="ltr">A1</span>، والفولتميتر يقرأ \\(E_0\\) (ص 10).',
   'المرحلة الأولى: <span class="ltr">n = 1000 rpm</span> و\\(I_f\\) من <span class="ltr">0</span> إلى <span class="ltr">0.3 A</span> — منحنى المغنطة يبدأ من الجهد المتبقي ثم ينحني نحو التشبع (ص 11).',
   'المرحلة الثانية: <span class="ltr">I<sub>f</sub> = 0.3 A</span> والسرعة من <span class="ltr">300</span> إلى <span class="ltr">1600 rpm</span> — \\(E_0\\) تزيد بنسبة زيادة السرعة (ص 12).',
   'قطبية الجهد تنعكس بعكس طرفي ملف المجال أو بعكس اتجاه الدوران (السؤال 4 ص 13).']}
],
 theory:[
  {h:'التجربة الأولى: اختبار اللاحمل للمولد منفصل التغذية',ref:'ص 10',html:`<p class="ltr" style="display:block;text-align:left">No-load test of a separately-excited DC generator</p><p><b>أهداف التجربة:</b></p><ol>
   <li>معرفة العوامل المؤثرة على القوة الدافعة الكهربائية المتولدة بالمولد \\(E_0\\).</li><li>دراسة خواص القوة الدافعة الكهربائية المتولدة عند تيار مجال متغير وسرعة ثابتة.</li><li>دراسة خواص القوة الدافعة الكهربائية المتولدة عند سرعة متغيرة وتيار مجال ثابت.</li><li>رسم العلاقة بين القوة الدافعة المتولدة \\(E_0\\) وتيار المجال \\(I_f\\) عندما تكون سرعة الدوران ثابتة.</li></ol>`},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> القوة الدافعة المتولدة في المولد تتناسب مع <b>الفيض المغناطيسي</b> \\(\\Phi\\) ومع <b>السرعة</b> \\(n\\):
   $$E_0=K\\,\\Phi\\,n$$
   <ul><li>الفيض يصنعه تيار المجال \\(I_f\\). في البداية يزيد الفيض تقريباً بنسبة زيادة \\(I_f\\) (جزء مستقيم)، ثم يتشبع الحديد فيقل أثر الزيادة (المنحنى «ينحني»: الركبة ثم التشبع). هذا هو <b>منحنى المغنطة</b> أو منحنى اللاحمل.</li>
   <li>عند \\(I_f=0\\) لا يكون الجهد صفراً تماماً: يبقى في الأقطاب الحديدية قليل من المغناطيسية من تشغيل سابق (<b>المغنطة المتبقية</b>) فيتولد جهد صغير.</li>
   <li>عند ثبات \\(I_f\\) يثبت الفيض، فيتناسب \\(E_0\\) طردياً مع السرعة: خط مستقيم يمر قرب نقطة الأصل.</li>
   <li>«لاحمل» يعني أن أطراف المولد لا يتصل بها إلا الفولتميتر (تياره صغير جداً)، فلا هبوط جهد داخل المولد ويقرأ الفولتميتر \\(E_0\\) نفسها.</li></ul>`},
  {h:'الأجهزة المستخدمة',ref:'ص 10',html:`<ol><li>مصدر جهد مستمر متحكم فيه.</li><li>مصدر تيار مستمر متحكم فيه.</li><li>آلتا تيار مستمر توازي.</li><li>جهاز فولتميتر (voltmeter).</li><li>جهاز قياس السرعة (Tachometer).</li><li>جهاز أميتر (Ammeter).</li></ol>`},
  {fig:'(1)',ref:'ص 10',caption:'مخطط التوصيل: يسار — المحرك المُدير M (توازي): ملف مجاله E1–E2 ومنتجه 1B1–2B2 كلاهما على المصدر 0-250 V DC. على العمود مقياس السرعة Tacho ثم القارنة إلى المولد G. يمين — مجال المولد E1–E2 يُغذى من مصدر التيار المتحكم فيه 0-240 V / 0-6 A عبر الأميتر A1، والفولتميتر V على أطراف المنتج يقرأ E₀ (لا حمل).',draw:()=>box(benchSVG({kind:'nl',rd:false}),900,1)},
  {h:'خطوات إجراء التجربة — المرحلة الأولى',ref:'ص 11',html:`<ol><li>قم بتوصيل التجربة كما في الشكل (1).</li><li>تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر.</li><li>ارفع في جهد مصدر التيار المستمر حتى تصل السرعة عند <span class="ltr">1000 rpm</span>.</li><li>غير قيم تيار المجال للمولد \\(I_f\\) عن طريق مصدر التيار المستمر المتحكم فيه حسب الجدول (1-1) الموضح بالأسفل، ثم قم بتسجيل قيمة القوة الدافعة الكهربائية المتولدة \\(E_0\\) الظاهرة على جهاز الفولتميتر.</li><li>بعد الانتهاء أعد جهد المصدر إلى الصفر حتى يتوقف المحرك.</li><li>ارسم العلاقة بين تيار المجال \\(I_f\\) والقوة الدافعة الكهربائية المتولدة \\(E_0\\) وذلك عند ثبات السرعة \\(n\\).</li></ol>
   <p><b>جدول (1-1)</b> — <span class="ltr">n = 1000 r.p.m</span></p>${emptyTbl('I<sub>f</sub> (A)',T11COLS.map(c=>fm(c)),['E<sub>0</sub> (v)'])}
   <p class="sub">المنحنى المطلوب: المحور الرأسي <span class="ltr">E (v)</span> والأفقي <span class="ltr">I<sub>f</sub> (A)</span>.</p>`},
  {h:'المرحلة الثانية',ref:'ص 12',html:`<ol><li>ارفع مصدر التيار المستمر حتى يصل تيار المجال إلى <span class="ltr">0.3 A</span> ثم توقف.</li><li>قم بتغيير مصدر الجهد المستمر حتى تصل سرعة المحرك للسرعات المطلوبة في الجدول (1-2) ثم سجل قيم القوة الدافعة الكهربائية المتولدة \\(E_0\\) عند كل قراءة.</li><li>ارسم العلاقة بين السرعة \\(n\\) والقوة الدافعة الكهربائية \\(E_0\\) وذلك عند ثبات تيار المجال \\(I_f\\).</li></ol>
   <p><b>جدول (1-2)</b> — <span class="ltr">I<sub>f</sub> = 0.3 A</span></p>${emptyTbl('n (r.p.m)',T12COLS.map(c=>c),['E<sub>0</sub> (v)'])}
   <p class="sub">المنحنى المطلوب: المحور الرأسي <span class="ltr">E<sub>o</sub> (v)</span> والأفقي <span class="ltr">n (rpm)</span>.</p>`},
  {err:'<div class="fixnote">(١) قائمة الأجهزة ص 10: الرقم 4 مكرر والرقم 5 مفقود — صُحح الترقيم أعلاه، و«آلتين» صُححت إلى «آلتا». (٢) الخطوة 1 ص 11: «قم بتوصل» والصحيح «بتوصيل»، وفي المرحلة الثانية «قم بتغير» والصحيح «بتغيير». (٣) جدول (1-2) ص 12: آخر سرعة مطبوعة بالأرقام الهندية «١٦٠٠» بين أرقام لاتينية؛ اعتمدنا <span class="ltr">1600 rpm</span> كما طُبعت، مع أن تدرج الجدول (300، 600، 900، 1200) يوحي بأن المقصود ربما 1500.</div>'},
  {h:'الأسئلة',ref:'ص 13',html:`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p>`+
   Q('1.','من خلال نتائج رسم العلاقة بين القوة الدافعة المتولدة وسرعة المحرك عند ثبوت تيار المجال، ماذا تلاحظ من هذا المنحنى؟','خط مستقيم تقريباً: \\(E_0\\) تزيد بنسبة زيادة السرعة (ضعف السرعة ← ضعف الجهد تقريباً)، لأن الفيض ثابت عند ثبات \\(I_f\\) و\\(E_0=K\\Phi n\\). ويمر الخط قرب نقطة الأصل (عند السرعة صفر لا جهد).')+
   Q('2.','ناقش المنحنيات التي حصلت عليها وسجل ملاحظاتك.','منحنى \\(E_0\\) مع \\(I_f\\): يبدأ من قيمة صغيرة (الجهد المتبقي) لا من الصفر، ثم يرتفع خطياً تقريباً، ثم يقل ميله مع الاقتراب من التشبع. منحنى \\(E_0\\) مع \\(n\\): مستقيم. الفروق عن المتوقع سببها أخطاء القراءة وعدم ثبات السرعة تماماً.')+
   Q('3.','ما هي العوامل التي تؤثر على القوة الدافعة الكهربائية المتولدة في المولد؟','السرعة \\(n\\)، والفيض \\(\\Phi\\) (أي تيار المجال \\(I_f\\) وحالة التشبع)، وثابت الآلة \\(K\\) (عدد الموصلات والأقطاب وطريقة اللف): \\(E_0=K\\Phi n\\).')+
   Q('4.','كيف يمكن تغيير قطبية الجهد المتولد على طرفي المولد؟','بعكس اتجاه تيار المجال (عكس طرفي ملف المجال E1–E2)، أو بعكس اتجاه الدوران. عكس الاثنين معاً يُبقي القطبية كما هي. جرّب عكس أطراف المجال في المختبر.')+
   Q('5.','ما هي قيمة القوة الدافعة المتولدة عندما يكون تيار المجال مساوياً للصفر وعندما يدور المولد بالسرعة المقننة؟','قيمة صغيرة وليست صفراً: الجهد المتبقي، وهو عادة نسبة صغيرة من الجهد المقنن (بضعة فولتات في آلات المختبر الصغيرة). في المختبر الافتراضي تقرؤه في أول عمود من جدول (1-1).')+
   Q('6.','بماذا تفسر تولد قوة دافعة إذا كان تيار المجال يساوي صفر؟','بالمغنطة المتبقية: بعد إيقاف تيار المجال يبقى في حديد الأقطاب فيض صغير، فتقطعه موصلات المنتج عند الدوران فيتولد جهد صغير.')+
   Q('7.','ما تأثير زيادة السرعة على القوة الدافعة المتولدة عندما يكون تيار المجال ثابتاً؟','تزيد القوة الدافعة بنسبة زيادة السرعة نفسها (تناسب طردي)، لأن الفيض ثابت.')},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في المختبر الافتراضي نعتبر مجال المحرك المدير قريباً من التشبع (ثابتاً تقريباً)، فتتناسب سرعته تقريباً مع جهد المصدر. لذلك ترفع الجهد لترفع السرعة كما في الخطوة 3.'}
 ],
 lab:(el)=>{
  const M0={n:0,nss:0,Im:0};let on=false,Vs=0,If=0,rev=false,phase=1,ang=0,E=0,sig='';const did={};
  const mkT=(head,cols,lab,ft)=>({head,cols:cols.map(v=>({k:String(v),v,label:lab(v)})),rows:[{k:'E',label:'E<sub>0</sub> (v)',dp:1}],data:{},free:[],freeText:ft});
  const ft=f=>`If = ${fm(f.If,3)} A، n = ${fm(f.n,0)} rpm، E0 = ${sgn(f.E,1)} V`;
  const T11=mkT('I<sub>f</sub> (A)',T11COLS,v=>fm(v),ft),T12=mkT('n (r.p.m)',T12COLS,v=>String(v),ft);
  el.innerHTML=`<div id="l2tp"></div><div class="grid dc-lab">
   <div class="panel c12"><h2>منضدة الاختبار <small>مبنية على الشكل (1) ص 10 — الدوران في الرسم مبطأ</small></h2>
    ${segHTML('ph',[[1,'المرحلة الأولى: n = 1000 rpm و I<sub>f</sub> متغير'],[2,'المرحلة الثانية: I<sub>f</sub> = 0.3 A و n متغيرة']],1)}
    <div class="svgbox dc-wide" id="l2c" style="max-width:900px;margin-inline:auto"></div><div id="l2msg" class="dc-msg"></div></div>
   <div class="panel c6"><h2>المحرك المدير <small>مصدر 0-250 V DC</small></h2>${supplyHTML('l2','جهد مصدر المحرك المدير')}
    <p class="sub">ارفع الجهد لترفع السرعة. السرعة تستقر بعد لحظات (ثابت زمن التسارع).</p></div>
   <div class="panel c6"><h2>مجال المولد <small>مصدر التيار المتحكم فيه</small></h2>${sl('l2if','تيار المجال I<sub>f</sub> (الأميتر A1)',0,0.35,0.005,0)}
    ${fineHTML('l2fd',[-0.05,-0.01,-0.005,0.005,0.01,0.05],'A')}<div class="dc-chips">${T11COLS.map(v=>`<button class="btn" data-l2c="${v}">${fm(v)} A</button>`).join('')}</div>
    <div class="dc-sw"><button class="btn red" id="l2rev" aria-pressed="false">اعكس أطراف ملف المجال (السؤال 4)</button></div></div>
   <div class="panel c12"><h2>قراءات الأجهزة</h2><div class="dc-meters" id="l2m"></div>
    <div class="dc-row"><button class="btn primary" id="l2rec">سجّل القراءة</button><button class="btn" id="l2clr">امسح جدول المرحلة الحالية</button></div><div id="l2rmsg" class="dc-msg"></div></div>
   <div class="panel c6"><h2>جدول (1-1) <small>${lt('n = 1000 r.p.m')}</small></h2><div id="l2t1"></div><div class="svgbox" id="l2p1"></div></div>
   <div class="panel c6"><h2>جدول (1-2) <small>${lt('I<sub>f</sub> = 0.3 A')}</small></h2><div id="l2t2"></div><div class="svgbox" id="l2p2"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l2tp'),TPID,tpDefs(['nref','Er','E03','Fk','n0','Ram','I0','tau']),()=>{T11.data={};T11.free=[];T12.data={};T12.free=[];sig='';tables();steps.redraw()});
  const setVs=x=>{Vs=clamp(B.round(x,1),0,250);$('#l2vs').value=Vs;$('#l2vs-v').textContent=fm(Vs,1)+' V'};
  const setIf=x=>{If=clamp(B.round(x,3),0,0.35);$('#l2if').value=If;$('#l2if-v').textContent=fm(If,3)+' A'};
  setVs(0);setIf(0);
  $('#l2vs').oninput=e=>setVs(+e.target.value);$('#l2if').oninput=e=>setIf(+e.target.value);
  el.querySelectorAll('[data-l2d]').forEach(b=>b.onclick=()=>setVs(Vs+ +b.dataset.l2d));
  el.querySelectorAll('[data-l2fd]').forEach(b=>b.onclick=()=>setIf(If+ +b.dataset.l2fd));
  el.querySelectorAll('[data-l2c]').forEach(b=>b.onclick=()=>setIf(+b.dataset.l2c));
  const msg=h=>{$('#l2msg').innerHTML=h};
  $('#l2on').onclick=()=>{if(!on&&Vs>0.05){msg(recMsg(0,'<b>لا تشغّل المصدر وجهده ليس صفراً!</b> الخطوة 2: «تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر». المحرك الواقف لا يولد قوة دافعة عكسية، فيسحب تياراً كبيراً جداً لو وُصل على جهد مرتفع مباشرة. أرجع الجهد إلى الصفر أولاً.'));return}
   on=!on;msg('');$('#l2on').setAttribute('aria-pressed',String(on));$('#l2on').textContent=on?'إيقاف المصدر':'تشغيل المصدر'};
  $('#l2rev').onclick=()=>{rev=!rev;$('#l2rev').setAttribute('aria-pressed',String(rev))};
  segBind(el,'ph',v=>{phase=+v;$('#l2rmsg').innerHTML=''});
  const tables=()=>{const cur1=T11.cols.find(c=>Math.abs(If-c.v)<TOL_I),cur2=T12.cols.find(c=>okN(M0.n,c.v));
   $('#l2t1').innerHTML=tableHTML(T11,phase===1&&cur1?cur1.k:null);$('#l2t2').innerHTML=tableHTML(T12,phase===2&&cur2?cur2.k:null);};
  const plots=()=>{const v=TP.v,Mx=mach(v);const pf1=T11.free.map(f=>[f.If,f.E]),pf2=T12.free.map(f=>[f.n,f.E]);
   const all1=tblPts(T11,'If','E').concat(pf1),all2=tblPts(T12,'n','E').concat(pf2);
   const y1a=nice(1.1*Math.max(Mx.E(0.35,1000),...all1.map(p=>p[1]),phase===1?E:0,1)),y0a=Math.min(0,...all1.map(p=>p[1]),phase===1?E:0)<0?-nice(-1.1*Math.min(...all1.map(p=>p[1]),phase===1?E:0)):0;
   $('#l2p1').innerHTML=plotXY({x1:0.35,y0:y0a,y1:y1a,xl:'If (A)',yl:'E (V)',cid:'dcp21',aria:'منحنى E0 مع If',series:[{pts:tblPts(T11,'If','E'),col:'--blue'},{pts:pf1,col:'--muted',line:false,hollow:true}],live:phase===1&&on?[If,E]:null});
   const y1b=nice(1.1*Math.max(Mx.E(0.3,1700),...all2.map(p=>p[1]),1)),y0b=Math.min(0,...all2.map(p=>p[1]),phase===2?E:0)<0?-nice(-1.1*Math.min(...all2.map(p=>p[1]),phase===2?E:0)):0;
   $('#l2p2').innerHTML=plotXY({x1:1800,y0:y0b,y1:y1b,xl:'n (rpm)',yl:'Eo (V)',cid:'dcp22',aria:'منحنى E0 مع n',series:[{pts:tblPts(T12,'n','E'),col:'--live'},{pts:pf2,col:'--muted',line:false,hollow:true}],live:phase===2&&on?[M0.n,E]:null})};
  $('#l2rec').onclick=()=>{const m=$('#l2rmsg');if(!on||M0.n<1){m.innerHTML=recMsg(0,'المحرك متوقف: شغّل المصدر وارفع الجهد أولاً.');return}
   if(Math.abs(M0.n-M0.nss)>1){m.innerHTML=recMsg(0,'انتظر حتى تستقر السرعة ثم سجّل.');return}
   const r={n:Math.round(M0.n),If:B.round(If,3),E:B.round(E,1)};
   if(phase===1){const c=T11.cols.find(c=>Math.abs(If-c.v)<TOL_I);const why=[];if(!okN(M0.n,1000))why.push('السرعة ليست 1000 rpm');if(!c)why.push('تيار المجال ليس من قيم الجدول');if(rev)why.push('أطراف المجال معكوسة');
    if(!why.length){T11.data[c.k]=r;m.innerHTML=recMsg(1,`سُجّلت في جدول (1-1) عند ${lt('I<sub>f</sub> = '+fm(c.v)+' A')}: ${lt('E<sub>0</sub> = '+sgn(r.E,1)+' V')}.`)}else{T11.free.push(r);m.innerHTML=recMsg(0,`سُجّلت قراءة حرة (المربعات الرمادية في المنحنى) لأن: ${why.join('، ')}.`)}}
   else{const c=T12.cols.find(c=>okN(M0.n,c.v));const why=[];if(Math.abs(If-0.3)>=TOL_I)why.push('تيار المجال ليس 0.3 A');if(!c)why.push('السرعة ليست من سرعات الجدول (±5 rpm)');if(rev)why.push('أطراف المجال معكوسة');
    if(!why.length){r.n=c.v;T12.data[c.k]=r;m.innerHTML=recMsg(1,`سُجّلت في جدول (1-2) عند ${lt('n = '+c.v+' rpm')}: ${lt('E<sub>0</sub> = '+sgn(r.E,1)+' V')}.`)}else{T12.free.push(r);m.innerHTML=recMsg(0,`سُجّلت قراءة حرة لأن: ${why.join('، ')}.`)}}
   tables();plots()};
  $('#l2clr').onclick=()=>{const T=phase===1?T11:T12;T.data={};T.free=[];tables();plots();$('#l2rmsg').innerHTML=''};
  const Er1000=()=>mach(TP.v).E(0,1000);
  const steps=stepsUI($('#l2st'),[
   {t:'شغّل المصدر وهو على الصفر',x:'الخطوة 2: تأكد أن جهد مصدر المحرك على الصفر ثم اضغط «تشغيل المصدر». (جرّب تشغيله والجهد ليس صفراً: سيمنعك المختبر ويشرح لماذا.)',done:()=>on},
   {t:'السرعة 1000 rpm',x:'الخطوة 3: ارفع جهد المصدر تدريجياً حتى يقرأ جهاز السرعة <span class="ltr">n = 1000 rpm</span> (استعمل أزرار الضبط الدقيق).',done:()=>on&&okN(M0.n,1000)},
   {t:'القراءة الأولى عند I<sub>f</sub> = 0',get x(){return `اجعل تيار المجال صفراً واضغط «سجّل القراءة»: يقرأ الفولتميتر نحو ${lt(fm(Er1000(),1)+' V')} مع أن تيار المجال صفر — هذا جهد المغنطة المتبقية (السؤالان 5 و6).`},done:()=>!!T11.data['0']},
   {t:'أكمل جدول (1-1)',x:'الخطوة 4: اجعل I<sub>f</sub> = 0.1 ثم 0.15 ثم 0.2 ثم 0.25 ثم 0.3 A وسجّل E<sub>0</sub> عند كل قيمة، والسرعة باقية 1000 rpm. لاحظ المنحنى: يرتفع بسرعة أولاً ثم يقل ميله (التشبع).',done:()=>tblDone(T11)},
   {t:'المرحلة الثانية',x:'اختر «المرحلة الثانية» واجعل <span class="ltr">I<sub>f</sub> = 0.3 A</span> (الخطوة 1 من المرحلة الثانية).',done:()=>phase===2&&Math.abs(If-0.3)<TOL_I},
   {t:'أكمل جدول (1-2)',get x(){return `غيّر جهد المصدر حتى تصل السرعة إلى 300 ثم 600 ثم 900 ثم 1200 ثم 1600 rpm وسجّل E<sub>0</sub> عند كل سرعة. عند 1600 rpm يحتاج المحرك نحو ${lt(fm(VsFor(TP.v,1600),0)+' V')}. المنحنى خط مستقيم (السؤالان 1 و7).`},done:()=>tblDone(T12)},
   {t:'اعكس قطبية الجهد (السؤال 4)',x:'اضغط «اعكس أطراف ملف المجال» والمولد يدور وتيار المجال 0.3 A: تنعكس إشارة الجهد على الفولتميتر. ثم أرجع التوصيل.',done:()=>did.revNeg},
   {t:'أوقف المحرك',x:'الخطوة 5: أعد جهد المصدر إلى الصفر حتى يتوقف المحرك.',done:()=>did.revNeg&&Vs===0&&M0.n<1}
  ]);
  tables();plots();
  let pt=0;
  loopOn(el,dt=>{const v=TP.v,Mx=mach(v);motorStep(M0,v,dt,{on,Vs,Pg:0});
   const IfA=chF('fopen')?0:If;E=Mx.E((rev!==chF('frev')?-1:1)*IfA*(chF('kF')?0.55:1),M0.n);if(rev&&E<-1&&If>0.25)did.revNeg=1;
   ang=(ang+M0.n/60*360*dt/25)%360;
   const sg=[on,fm(Vs,1),Math.round(M0.n),fm(If,3),rev,fm(E,1)].join('|');
   if(sg!==sig){sig=sg;$('#l2c').innerHTML=benchSVG({kind:'nl',on,Vs,ang,If:IfA,E,VL:E,n:M0.n,rev});
    $('#l2m').innerHTML=meter('السرعة n (Tacho)',fm(Math.round(M0.n),0)+' rpm')+meter('تيار المجال I<sub>f</sub> (A1)',fm(IfA,3)+' A')+meter('الفولتميتر V: E<sub>0</sub>',sgn(E,1)+' V')+meter('جهد مصدر المحرك',on?fm(Vs,1)+' V':'OFF');tables()}
   else{const g=el.querySelectorAll('#dcr1,#dcr2');if(g[0])g[0].setAttribute('transform',`rotate(${fx(ang)} 230 166)`);if(g[1])g[1].setAttribute('transform',`rotate(${fx(ang)} 580 166)`)}
   pt+=dt;if(pt>0.25){pt=0;plots()}
   steps.check()});
 },
 quiz:[
  {q:'في اختبار اللاحمل للمولد منفصل التغذية، ماذا يقرأ الفولتميتر على أطراف المنتج؟',o:['جهد الحمل','القوة الدافعة المتولدة E₀ نفسها تقريباً لأنه لا يمر تيار حمل','جهد المصدر','صفراً دائماً'],c:1,e:'لا حمل ← لا هبوط جهد داخل المولد.'},
  {q:'كيف يُغذى مجال المولد في هذه التجربة (الشكل 1)؟',o:['من أطراف المولد نفسه','من مصدر تيار مستمر متحكم فيه منفصل (0-240 V / 0-6 A)','من مصدر المحرك','لا يُغذى'],c:1,e:'لذلك يسمى «منفصل التغذية».'},
  {q:'في المرحلة الأولى نغيّر تيار المجال ونثبّت:',o:['الجهد','السرعة عند 1000 rpm','الحمل','تيار المنتج'],c:1,e:'ص 11، جدول (1-1).'},
  {q:'لماذا لا يكون E₀ صفراً عند I<sub>f</sub> = 0؟',o:['خطأ في الفولتميتر','بسبب المغنطة المتبقية في الأقطاب','لأن المحرك يغذيه','بسبب الحمل'],c:1,e:'السؤال 6.'},
  {q:'شكل منحنى E₀ مع I<sub>f</sub> عند سرعة ثابتة:',o:['خط مستقيم دائماً','يرتفع شبه مستقيم ثم يقل ميله بسبب التشبع','يهبط','دائرة'],c:1,e:'منحنى المغنطة.'},
  {q:'عند ثبات I<sub>f</sub> = 0.3 A ومضاعفة السرعة من 600 إلى 1200 rpm، فإن E₀:',o:['تبقى ثابتة','تتضاعف تقريباً','تنقص إلى النصف','تصبح صفراً'],c:1,e:'\\(E_0=K\\Phi n\\) والفيض ثابت.'},
  {q:'كيف نعكس قطبية جهد المولد؟',o:['بزيادة السرعة','بعكس أطراف ملف المجال أو عكس اتجاه الدوران','بزيادة تيار المجال','بفصل الفولتميتر'],c:1,e:'السؤال 4.'},
  {q:'قبل تشغيل مصدر المحرك يجب أن يكون جهده:',o:['250 V','على الصفر','نصف القيمة','لا يهم'],c:1,e:'الخطوة 2 ص 11.'}
 ]
});

/* ---------- load-bench helpers shared by experiments 2 and 3 ---------- */
const rlHTML=(p,cols)=>`<div class="dc-chips" id="${p}rlc">${cols.map(c=>`<button class="btn" data-${p}rl="${c}" aria-pressed="false">${c==='open'?'مفصول (∞)':c+'%'}</button>`).join('')}</div>${sl(p+'rl','مقاومة الحمل R<sub>L</sub> (نسبة من قيمتها الكاملة)',5,100,1,100)}`;
const loadTbl=(cols,ftxt)=>({head:'R<sub>L</sub>',cols:cols.map(c=>({k:String(c),v:c,label:c==='open'?'مفصول*':c+'%'})),rows:[{k:'IL',label:'I<sub>L</sub> (A)',dp:2},{k:'VL',label:'V<sub>L</sub> (v)',dp:1}],data:{},free:[],freeText:ftxt});
const ADDCOL='<p class="sub">* عمود «مفصول» (الحمل غير موصل، I<sub>L</sub> = 0) <b>إضافة من خارج الكتاب</b>: منه جهد اللاحمل اللازم لحساب معامل تنظيم الجهد.</p>';
function vrHTML(T,Irat){const r=vrSteps(tblPts(T,'IL','VL'),Irat);return r.msg?`<div class="callout">${r.msg}</div>`:stepsHTML(r.steps)}
function warnI(IL,Irat){if(IL>6)return recMsg(0,`<b>تنبيه:</b> التيار ${lt(fm(IL,2)+' A')} تجاوز تدريج الأميتر <span class="ltr">0-6 A</span>. قلل الحمل (زد R<sub>L</sub>).`);
  if(IL>Irat*1.02)return `<div class="callout">التيار ${lt(fm(IL,2)+' A')} أكبر من التيار المقنن التوضيحي ${lt(fm(Irat)+' A')} (${fm(IL/Irat*100,0)}%). لا تترك المولد طويلاً على هذا الحمل.</div>`;return ''}

/* ======================================================================
   Lesson 3 — التجربة الثانية: منحنى خواص الحمل للمولد منفصل التغذية (ص 14–16)
   ====================================================================== */
const T21COLS=['open',100,80,60,50,40,20];
const N2TXT=EXP2_N===1500?'كما في الخطوة 2':EXP2_N===1400?'كما في رأس الجدول (2-1)':'بقرار المدرب';
B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'14–16',
 title:'التجربة الثانية: منحنى خواص الحمل للمولد منفصل التغذية',
 summary:`نثبت سرعة المولد منفصل التغذية عند ${EXP2_N} rpm وتيار مجاله عند 0.3 A، ثم نزيد الحمل بتصغير مقاومة الحمل ونسجل تيار الحمل وجهده: منحنى الخواص الخارجية، ومنه معامل تنظيم الجهد.`,
 stations:[
  {intro:true},

  {st:1,short:'أهداف التجربة',title:'أهداف التجربة الثانية: منحنى خواص الحمل للمولد منفصل التغذية',ref:'ص 14',
   q:'وصلنا حملاً بالمولد فبدأ يعطي تياراً… هل يبقى جهد أطرافه كما كان بلا حمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد يغذي مقاومة حمل، مع أميتر لتيار الحمل وفولتميتر لجهد الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المولد منفصل التغذية ⟦G⟧: يدور بسرعة ثابتة، ومجاله من مصدر مستقل."><circle cx="80" cy="160" r="34" fill="#F2C14E" stroke="#2C4A40" stroke-width="4"/><text x="80" y="168" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text></g><path d="M80 126 V70 H180 M222 70 H290 V120 M290 200 V250 H80 V194" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="الأميتر: يقرأ تيار الحمل ⟦IL⟧."><circle cx="200" cy="70" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="200" y="77" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text></g><g data-tip="مقاومة الحمل المتغيرة ⟦RL⟧: كلما صغرت زاد الحمل وزاد تياره."><rect x="276" y="120" width="28" height="80" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><line x1="264" y1="196" x2="318" y2="126" stroke="#2C4A40" stroke-width="2.5"/><polygon points="322,120 310,124 318,132" fill="#2C4A40"/></g><g data-tip="الفولتميتر: يقرأ جهد الحمل ⟦VL⟧ على أطراف المولد."><path d="M150 70 V140 M150 180 V250" fill="none" stroke="#4FB3A9" stroke-width="3"/><circle cx="150" cy="160" r="20" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="150" y="167" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><circle cx="150" cy="70" r="4" fill="#2C4A40"/><circle cx="150" cy="250" r="4" fill="#2C4A40"/><text x="200" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="3">L</tspan></text><text x="186" y="166" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="3">L</tspan></text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">العلاقة بين تيار الحمل وجهده</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لجهة الحمل في التجربة.<br><b>مرّر المؤشر على المولد والجهازين والمقاومة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زدت الحمل (صغّرت مقاومته) والسرعة وتيار المجال ثابتان. ماذا تتوقع لجهد الأطراف؟',opts:[
     ['يرتفع',false,'التيار الأكبر يزيد الهبوط داخل المولد، فلا يرتفع الجهد.'],
     ['يهبط قليلاً',true,'هذا ما يرسمه «منحنى الخواص الخارجية»: جهد الحمل مع تيار الحمل، وتسأل عنه الأسئلة أ و ب و ج (ص 16).'],
     ['يبقى ثابتاً تماماً',false,'لو كان ثابتاً تماماً لما احتجنا إلى «معامل تنظيم الجهد» في الهدف.']]}}
   ],
   body:[
    {book:String.raw`<p class="ltr" style="display:block;text-align:left">Load characteristics of a separately excited DC generator</p><p><b>أهداف التجربة:</b> التعرف على العلاقة بين تيار الحمل وجهد الحمل عندما تكون سرعة الدوران ثابتة، وكذلك حساب معامل تنظيم الجهد ثم رسم منحنى الخواص الخارجية للمولد منفصل التغذية.</p>`,ref:'ص 14'},
    {add:String.raw`<p>الهدف يطلب «حساب معامل تنظيم الجهد» لكن الحقيبة لا تعطي قانونه. القانون المعتاد:</p><div class="eq">$$VR\%=\frac{V_{NL}-V_{FL}}{V_{FL}}\times 100$$</div><p>\(V_{NL}\): الجهد على أطراف المولد بلا حمل، و\(V_{FL}\): الجهد عند الحمل الكامل (التيار المقنن)، والسرعة وضبط المجال ثابتان. كلما صغر \(VR\) كان المولد أفضل في المحافظة على جهده.</p>`,title:'معامل تنظيم الجهد'},
    {tip:String.raw`<p>«<b>الخواص الخارجية</b>» تعني ما يراه الحمل من الخارج: الجهد على أطراف المولد مع تيار الحمل. أما في التجربة الأولى فكنا نقيس ما يتولد داخل المولد بلا حمل \(E_0\).</p>`}
   ]},

  {st:2,short:'الأجهزة',title:'الأجهزة المستخدمة',ref:'ص 14',
   q:'ما الجديد في قائمة الأجهزة مقارنة بالتجربة الأولى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثماني بطاقات للأجهزة: مصدر، محرك، مولد، مصدر المجال، أميتران، فولتميتر، حمل، مقياس سرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="مصدر تيار مستمر متحكم فيه: يغذي المحرك المدير ⟦0-250 V DC⟧."><rect x="266" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="281" y="60" width="48" height="32" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="305" y="81" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">DC</text><text x="305" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مصدر</text></g><g data-tip="محرك تيار مستمر توازي: المحرك المدير ⟦M⟧."><rect x="180" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="219" cy="76" r="17" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="219" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="219" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">محرك</text></g><g data-tip="مولد تيار مستمر توازي ⟦G⟧: يُغذى مجاله هنا منفصلاً."><rect x="94" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="133" cy="76" r="17" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="133" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><text x="133" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مولد</text></g><g data-tip="مصدر تيار مستمر لتغذية ملفات المجال ⟦0-240V / 0-6A⟧."><rect x="8" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="23" y="60" width="48" height="32" rx="5" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="47" y="81" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">DC</text><text x="47" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مصدر المجال</text></g><g data-tip="جهازا أميتر: ⟦A1⟧ لتيار المجال ⟦If⟧، و⟦A2⟧ لتيار الحمل ⟦IL⟧ — الجديد هو ⟦A2⟧."><rect x="266" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="198" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="290" y="203" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A1</text><circle cx="320" cy="198" r="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="320" y="203" text-anchor="middle" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A2</text><text x="305" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">أميتران</text></g><g data-tip="فولتميتر: على أطراف المولد، يقرأ جهد الحمل ⟦VL⟧."><rect x="180" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="219" cy="198" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="219" y="204" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text><text x="219" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">فولتميتر</text></g><g data-tip="حمل (مقاومة متغيرة) ⟦RL⟧: الجهاز الجديد في هذه التجربة."><rect x="94" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="121" y="180" width="24" height="40" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="113" y1="220" x2="152" y2="182" stroke="#2C4A40" stroke-width="2"/><text x="133" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">حمل متغير</text></g><g data-tip="جهاز قياس السرعة: لتثبيت السرعة قبل كل قراءة."><rect x="8" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M29 214 a18 18 0 0 1 36 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="47" y1="214" x2="58" y2="201" stroke="#E8735A" stroke-width="2.5"/><text x="47" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مقياس السرعة</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الجديد: الحمل المتغير وأميتره</text></svg>`,
   cap:'الأجهزة الثمانية بترتيب قائمة الكتاب.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف دور الجهاز.</b>',
   side:[
    {predict:{q:'لماذا صار في القائمة «جهازا أميتر» بدل جهاز واحد؟',opts:[
     ['واحد لتيار المجال وواحد لتيار الحمل',true,'الأميتر A1 لتيار المجال كما في التجربة الأولى، والأميتر A2 الجديد لتيار الحمل I_L (الخطوة 3 ص 15).'],
     ['واحد احتياطي إذا تلف الأول',false,'كلاهما موصل في المخطط ولكل منهما قراءة.'],
     ['واحد للمحرك وواحد للمولد',false,'دائرة المحرك في الشكل (2) ليس فيها أجهزة قياس.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>مصدر تيار مستمر متحكم فيه.</li><li>محرك تيار مستمر توازي.</li><li>مولد تيار مستمر توازي.</li><li>مصدر تيار مستمر لتغذية ملفات المجال.</li><li>جهازا أميتر.</li><li>جهاز فولتميتر.</li><li>حمل (مقاومة مادية متغيرة).</li><li>جهاز قياس السرعة.</li></ol>`,ref:'ص 14'},
    {tip:String.raw`<p>المولد «آلة توازي» من حيث صنعها، لكنه يُستعمل هنا «منفصل التغذية» لأن ملف مجاله يُغذى من مصدر مستقل (البند 4)، لا من أطرافه.</p>`}
   ]},

  {st:3,short:'القوانين',title:'القوانين المستنتجة من الدائرة',ref:'ص 14',
   q:'إذا عرفت قراءة الفولتميتر والأميتر، هل تحتاج جهازاً ثالثاً لتعرف مقاومة الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثلث قانون أوم: جهد الحمل في الأعلى، وتيار الحمل ومقاومة الحمل في الأسفل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M180 50 L310 260 H50 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/><line x1="102" y1="176" x2="258" y2="176" stroke="#2C4A40" stroke-width="3"/><line x1="180" y1="176" x2="180" y2="260" stroke="#2C4A40" stroke-width="3"/><g data-tip="جهد الحمل ⟦VL⟧: قراءة الفولتميتر. غطِّه بإصبعك يبقى ⟦IL × RL⟧."><rect x="140" y="100" width="80" height="60" fill="transparent"/><text x="180" y="146" text-anchor="middle" font-size="30" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="18" dy="6">L</tspan></text></g><g data-tip="تيار الحمل ⟦IL⟧: قراءة الأميتر ⟦A2⟧. غطِّه يبقى ⟦VL ÷ RL⟧."><rect x="190" y="184" width="80" height="66" fill="transparent"/><text x="226" y="230" text-anchor="middle" font-size="28" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="17" dy="6">L</tspan></text></g><g data-tip="مقاومة الحمل ⟦RL⟧: غطِّها يبقى ⟦VL ÷ IL⟧."><rect x="90" y="184" width="80" height="66" fill="transparent"/><text x="134" y="230" text-anchor="middle" font-size="28" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="17" dy="6">L</tspan></text></g><text x="180" y="208" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)">×</text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">غطِّ المجهول تظهر طريقة حسابه</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) يجمع القانونين في مثلث واحد.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف طريقة حسابه.</b>',
   side:[
    {book:String.raw`<div class="eq">$$V_L=I_L\times R_L$$</div><div class="eq">$$I_L=V_L\div R_L$$</div>`,ref:'ص 14'}
   ],
   body:[
    {tip:String.raw`<p>هذا قانون أوم على مقاومة الحمل. الكتاب يعطي قيم \(R_L\) في الجدول نسبةً مئوية من قيمتها الكاملة (<span class="ltr">100%</span>، <span class="ltr">80%</span>…) لا بالأوم؛ فإذا أردت قيمتها بالأوم عند أي قراءة فاحسبها من قراءتيك: \(R_L=V_L\div I_L\).</p>`,title:'ماذا نستفيد منهما؟'},
    {predict:{q:'صغّرت \\(R_L\\) من <span class="ltr">100%</span> إلى <span class="ltr">50%</span> وبقي الجهد تقريباً كما هو. ماذا يحدث لتيار الحمل؟',opts:[
     ['ينقص إلى النصف',false,'المقاومة في المقام: \\(I_L=V_L\\div R_L\\)، فنقصها يزيد التيار.'],
     ['يتضاعف تقريباً',true,'\\(I_L=V_L\\div R_L\\): الجهد شبه ثابت والمقاومة نصف ما كانت، فالتيار ضعف ما كان تقريباً.'],
     ['لا يتغير',false,'التيار يعتمد على المقاومة، وقد تغيرت.']]}},
    {watch:String.raw`<p>\(R_L\) الصغيرة تعني حملاً <b>كبيراً</b> (تياراً أكبر). فالسير في الجدول من <span class="ltr">100%</span> إلى <span class="ltr">20%</span> هو زيادة في الحمل، لا نقص.</p>`}
   ]},

  {st:4,short:'دائرة التوصيل',title:'مخطط التوصيل — الشكل <span class="ltr">(2)</span>',ref:'ص 14',
   q:'أين يوصل الأميتر الجديد A2، وأين الفولتميتر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبسط عن جهة المولد في الشكل 2: المجال من مصدر مستقل عبر A1، والفولتميتر على الأطراف، ثم A2 على التوالي مع مقاومة الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المولد ⟦G⟧: يديره المحرك ⟦M⟧ بالعمود من اليسار (جهة المحرك مطابقة للشكل 1)."><circle cx="78" cy="130" r="28" fill="#F2C14E" stroke="#2C4A40" stroke-width="3.5"/><text x="78" y="138" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><rect x="16" y="126" width="34" height="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/></g><path d="M78 102 V54 H210 M246 54 H306 V100 M306 180 V214 H78 V158" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="الفولتميتر ⟦V⟧: على أطراف المولد (على التوازي)، يقرأ جهد الحمل ⟦VL⟧."><path d="M150 54 V112 M150 148 V214" fill="none" stroke="#4FB3A9" stroke-width="3"/><circle cx="150" cy="130" r="18" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="150" y="137" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><circle cx="150" cy="54" r="4" fill="#2C4A40"/><circle cx="150" cy="214" r="4" fill="#2C4A40"/><g data-tip="الأميتر ⟦A2⟧: على التوالي مع الحمل، يقرأ تيار الحمل ⟦IL⟧."><circle cx="228" cy="54" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="228" y="60" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A2</text></g><g data-tip="مقاومة الحمل المتغيرة ⟦RL⟧: تُضبط بنسبة مئوية من قيمتها الكاملة حسب جدول ⟦(2-1)⟧."><rect x="294" y="100" width="24" height="80" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><line x1="282" y1="176" x2="330" y2="106" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="ملف مجال المولد ⟦E1–E2⟧: يُغذى من مصدر مستقل عبر الأميتر ⟦A1⟧ (منفصل التغذية)."><path d="M120 262 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0 q8 -12 16 0" fill="none" stroke="#E8735A" stroke-width="3.5"/></g><g data-tip="الأميتر ⟦A1⟧: يقرأ تيار المجال ⟦If⟧، ويُثبَّت عند ⟦0.3 A⟧."><circle cx="92" cy="262" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="92" y="267" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A1</text></g><path d="M106 262 H120 M184 262 H196 V290 M78 262 H70 V290" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="مصدر مجال المولد ⟦0-240V / 0-6A⟧."><rect x="60" y="284" width="146" height="26" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="133" y="302" text-anchor="middle" font-size="11.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">0-240V / 0-6A</text></g><text x="196" y="34" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">L</tspan></text><text x="250" y="140" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="9" dy="3">L</tspan></text></svg>`,
   cap:'مبسّط عن جهة المولد في الشكل <span class="ltr">(2)</span>؛ جهة المحرك مطابقة للشكل <span class="ltr">(1)</span>.<br><b>مرّر المؤشر على الأجهزة والملف والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يوصل الأميتر A2 على التوالي مع مقاومة الحمل؟',opts:[
     ['ليقيس الجهد على الحمل',false,'الجهد يقيسه الفولتميتر V الموصل على التوازي.'],
     ['ليمر فيه تيار الحمل كله فيقرأه',true,'الأميتر يقيس التيار المار فيه، فيوضع في مسار تيار الحمل نفسه (قاعدة التوصيل ص 4–5).'],
     ['ليحمي المولد من زيادة الحمل',false,'الأميتر جهاز قياس لا جهاز حماية.']]}}
   ],
   body:[
    {book:String.raw`<p><b>مخطط التوصيل — الشكل <span class="ltr">(2)</span></b></p>`+box(benchSVG({kind:'sep',rd:false,RLp:100}),900,1),ref:'ص 14'},
    {tip:String.raw`<p>جهة المحرك مطابقة للشكل <span class="ltr">(1)</span>. مجال المولد <span class="ltr">E1–E2</span> يُغذى منفصلاً عبر الأميتر <span class="ltr">A1</span>. على أطراف المولد الفولتميتر <span class="ltr">V</span> \((V_L)\)، ثم الأميتر <span class="ltr">A2</span> على التوالي \((I_L)\)، ثم مقاومة الحمل المتغيرة \(R_L\).</p>`,title:'ما الذي أُضيف على الشكل (1)؟'},
    {tip:String.raw`<p>في المولد منفصل التغذية تيار المنتج \(I_a\) هو نفسه تيار الحمل \(I_L\)، لأن المجال يأخذ تياره من مصدره المستقل لا من المنتج.</p>`}
   ]},

  {st:5,short:'الخطوات والجدول',title:'خطوات إجراء التجربة وجدول <span class="ltr">(2-1)</span>',ref:'ص 15',
   q:'السرعة وتيار المجال ثابتان، والحمل يتغير… فما الذي تسجله عند كل قيمة للحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة وتيار المجال مثبتان، ومقاومة الحمل تتدرج من 100 إلى 20 بالمئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="ثابتان طوال التجربة: السرعة ⟦n = ${EXP2_N} rpm⟧ وتيار المجال ⟦If = 0.3 A⟧ (الخطوة 3)."><rect x="40" y="40" width="280" height="64" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="250" y="80" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n = ${EXP2_N} rpm</text><text x="114" y="80" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="3">f</tspan><tspan dy="-3"> = 0.3 A</tspan></text><rect x="294" y="30" width="20" height="16" rx="3" fill="#2C4A40"/><path d="M298 30 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مقاومة الحمل ⟦RL⟧ تتغير بقيم جدول ⟦(2-1)⟧: ⟦100%، 80%، 60%، 50%، 40%، 20%⟧ من قيمتها الكاملة. كلما صغرت زاد الحمل."><rect x="40" y="124" width="280" height="120" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g fill="#E8735A" stroke="#2C4A40" stroke-width="2"><rect x="282" y="150" width="22" height="60" rx="3"/><rect x="238" y="162" width="22" height="48" rx="3"/><rect x="194" y="174" width="22" height="36" rx="3"/><rect x="150" y="180" width="22" height="30" rx="3"/><rect x="106" y="186" width="22" height="24" rx="3"/><rect x="62" y="198" width="22" height="12" rx="3"/></g><g font-size="11" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="293" y="230">100%</text><text x="249" y="230">80%</text><text x="205" y="230">60%</text><text x="161" y="230">50%</text><text x="117" y="230">40%</text><text x="73" y="230">20%</text></g><path d="M290 138 H80" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,138 82,132 82,144" fill="#2C4A40"/></g><text x="180" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مقاومة أصغر ← حمل أكبر</text><text x="180" y="294" text-anchor="middle" font-size="13" fill="#2C4A40">نسجّل عند كل قيمة قراءتي الحمل</text></svg>`,
   cap:'ارتفاع كل عمود يمثل قيمة <span class="ltr">R<sub>L</sub></span>؛ السهم اتجاه زيادة الحمل.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف القيم.</b>',
   side:[
    {predict:{q:'عند كل قيمة لـ \\(R_L\\)، أي قراءتين تسجّل في الجدول؟',opts:[
     ['السرعة وتيار المجال',false,'هاتان مثبتتان طوال التجربة، فلا داعي لتسجيلهما في كل عمود.'],
     ['تيار الحمل \\(I_L\\) من A2 وجهد الحمل \\(V_L\\) من الفولتميتر',true,'الخطوة 4: «سجل قيمة تيار الحمل I_L عن طريق جهاز الأميتر A2 وجهد الحمل V_L عن طريق جهاز الفولتميتر V».'],
     ['جهد مصدر المحرك وتياره',false,'لا توجد أجهزة قياس في دائرة المحرك في الشكل (2).']]}}
   ],
   body:[
    {book:String.raw`<ol><li>قم بتوصيل التجربة كما في الشكل (2).</li><li>تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر.</li><li>ثبت السرعة \(n\) عند <span class="ltr">${EXP2_N}</span> لفة في الدقيقة وكذلك قم بتثبيت تيار المجال \(I_f\) عند <span class="ltr">0.3 A</span>.</li><li>قم بتغيير قيمة الحمل \(R_L\) ومن ثم سجل قيمة تيار الحمل \(I_L\) عن طريق جهاز الأميتر A2 وجهد الحمل \(V_L\) عن طريق جهاز الفولتميتر V في الجدول (2-1).</li><li>قم برسم العلاقة بين تيار الحمل \(I_L\) وجهد الحمل \(V_L\).</li></ol>
     <p><b>جدول (2-1)</b> — <span class="ltr">n = ${EXP2_N} r.p.m &nbsp; I<sub>f</sub> = 0.3 A</span></p>`+emptyTbl('R<sub>L</sub>',['100%','80%','60%','50%','40%','20%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)']),ref:'ص 15'},
    {tip:String.raw`<p>عند تحميل المولد تهبط سرعة المحرك المدير قليلاً (المولد المحمّل يحتاج عزماً أكبر). لذلك انظر إلى مقياس السرعة قبل كل قراءة، وأعدها إلى <span class="ltr">${EXP2_N} rpm</span> بجهد مصدر المحرك، وتأكد أن \(I_f\) ما زال <span class="ltr">0.3 A</span>.</p>`,title:'قبل كل قراءة'},
    {watch:String.raw`<p><b>سرعة التجربة:</b> الخطوة الثالثة (المطبوعة برقم 2) تقول «ثبت السرعة n عند <span class="ltr">1500</span> لفة في الدقيقة»، بينما رأس جدول (2-1) يقول <span class="ltr">n = 1400 r.p.m</span>. اعتمدنا هنا <span class="ltr">${EXP2_N} rpm</span> (${N2TXT}).</p>`,fix:true}
   ]},

  {st:6,short:'المنحنى',title:'منحنى العلاقة بين تيار الحمل وجهد الحمل',ref:'ص 15',
   q:'كيف يبدو المنحنى: خط أفقي، أم خط يهبط بسرعة، أم شيء بينهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكل توضيحي لمنحنى الخواص الخارجية: جهد الحمل يهبط قليلاً مع زيادة تيار الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="62" y="56" width="262" height="200" rx="6" fill="#FBF6EE"/><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="62" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,54 65,64 75,64" fill="#2C4A40"/><text x="84" y="68" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (V)</tspan></text><text x="318" y="282" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (A)</tspan></text><text x="70" y="268" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">0</text><line x1="70" y1="97" x2="310" y2="97" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 5"/><g data-tip="جهد اللاحمل: عند ⟦IL = 0⟧ يساوي جهد الأطراف القوة الدافعة المتولدة تقريباً."><circle cx="70" cy="97" r="12" fill="transparent"/><circle cx="70" cy="97" r="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="منحنى الخواص الخارجية: يميل إلى أسفل ببطء — كلما زاد تيار الحمل هبط الجهد قليلاً."><path d="M70.0 97.0 L110.0 100.3 L150.0 104.2 L190.0 108.7 L230.0 113.8 L270.0 119.5 L310.0 125.8" fill="none" stroke="transparent" stroke-width="22"/><path d="M70.0 97.0 L110.0 100.3 L150.0 104.2 L190.0 108.7 L230.0 113.8 L270.0 119.5 L310.0 125.8" fill="none" stroke="#12855A" stroke-width="3.5"/></g><g data-tip="الهبوط: الفرق بين جهد اللاحمل (الخط المتقطع) وجهد الحمل يكبر مع التيار."><rect x="292" y="96" width="24" height="32" fill="transparent"/><line x1="304" y1="99" x2="304" y2="123" stroke="#E8735A" stroke-width="3"/><polygon points="304,128 298,118 310,118" fill="#E8735A"/></g></svg>`,
   cap:'الكتاب يعطي شبكة فارغة بمحوريها؛ شكل المنحنى هنا <b>توضيحي</b> بلا أرقام.<br><b>مرّر المؤشر على النقطة والمنحنى والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أين تضع \\(I_L\\) وأين \\(V_L\\) على ورقة الرسم؟',opts:[
     ['\\(V_L\\) أفقياً و\\(I_L\\) رأسياً',false,'الشبكة في الكتاب (ص 15) محورها الرأسي V_L(V) والأفقي I_L(A).'],
     ['\\(I_L\\) أفقياً و\\(V_L\\) رأسياً',true,'كما في شبكة الكتاب: المحور الرأسي V_L(V) والأفقي I_L(A).'],
     ['كلاهما على المحور الأفقي',false,'المنحنى علاقة بين كميتين، لكل منهما محور.']]}}
   ],
   body:[
    {title:'تابع ما يحدث عند زيادة الحمل',widget:(el,B)=>{
      const S=['صغّرت R<sub>L</sub>','زاد تيار الحمل I<sub>L</sub> = I<sub>a</sub>','زاد الهبوط داخل المولد (I<sub>a</sub>R<sub>a</sub> والفرش)','هبط جهد الأطراف V<sub>L</sub> قليلاً'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «زِد الحمل» وتابع السلسلة.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>زِد الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>عند توصيل حمل يمر في المنتج تيار \(I_a\)، فيهبط الجهد على الأطراف عن \(E\) لثلاثة أسباب:</p><div class="eq">$$V_L=E-I_aR_a-V_{brush}$$</div><ol><li><b>مقاومة المنتج \(R_a\)</b>: هبوط \(I_aR_a\) يكبر مع التيار.</li><li><b>هبوط الفرش</b>: نحو فولت أو فولتين تقريباً.</li><li><b>رد فعل المنتج</b>: مجال تيار المنتج يُضعف فيض الأقطاب قليلاً، فتنقص \(E\) نفسها مع زيادة الحمل.</li></ol><p>(هذه العلاقة من دراستك النظرية، وليست في الحقيبة.)</p>`,title:'لماذا يهبط الجهد؟'},
    {tip:String.raw`<p>بما أن مجال المولد يُغذى من مصدر مستقل، لا يتأثر تيار المجال بهبوط جهد الأطراف، فيكون الهبوط صغيراً. ارسم أقرب خط أملس بين نقاطك.</p>`}
   ]},

  {st:7,short:'الأسئلة',title:'الأسئلة',ref:'ص 16',
   q:'المولد يولد \\(E\\)، والحمل يأخذ \\(V_L\\)… فأين يذهب الفرق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عمود القوة الدافعة المتولدة مقسوم إلى جهد الحمل وهبوط المقاومة وهبوط الفرش" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="القوة الدافعة المتولدة ⟦E⟧ داخل المولد (تنقص قليلاً مع الحمل بسبب رد فعل المنتج)."><rect x="220" y="60" width="70" height="200" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="255" y="166" text-anchor="middle" font-size="24" fill="#2C4A40" font-weight="700" font-family="var(--mono)">E</text></g><text x="255" y="284" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">داخل المولد</text><text x="180" y="166" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700">=</text><g data-tip="جهد الحمل ⟦VL⟧: ما يقرؤه الفولتميتر على الأطراف."><rect x="70" y="100" width="70" height="160" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="105" y="186" text-anchor="middle" font-size="20" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="13" dy="5">L</tspan></text></g><g data-tip="هبوط الجهد على مقاومة المنتج ⟦Ia × Ra⟧: يكبر مع تيار الحمل."><rect x="70" y="72" width="70" height="28" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="92" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">a</tspan><tspan dy="-3">R</tspan><tspan font-size="9" dy="3">a</tspan></text></g><g data-tip="هبوط الجهد على الفرش الكربونية: نحو فولت أو فولتين تقريباً."><rect x="70" y="60" width="70" height="12" rx="3" fill="#2C4A40"/></g><text x="150" y="70" font-size="11" fill="#2C4A40" font-weight="700">الفرش</text><text x="105" y="284" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">على الأطراف + الهبوط</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) للسؤال (ج)، والأطوال غير مقيسة.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'ما سبب الفرق بين القوة الدافعة المتولدة والجهد على أطراف المولد؟ (السؤال ج)',opts:[
     ['مقاومة الفولتميتر',false,'الفولتميتر يأخذ تياراً صغيراً جداً، ولا يسبب هذا الفرق.'],
     ['جهد مصدر المجال',false,'مصدر المجال يغذي ملف المجال فقط، ولا يقع في مسار تيار الحمل.'],
     ['الهبوط داخل المولد: على مقاومة المنتج \\(I_aR_a\\) وعلى الفرش',true,'\\(V_L=E-I_aR_a-V_{brush}\\): الفرق صفر تقريباً بلا حمل ويكبر مع التيار.']]}}
   ],
   body:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ul style="list-style:none;padding-inline-start:0">
     <li>أ. ما هو تأثير زيادة الحمل على الجهد على طرفي المولد وعلى سرعة المولد؟</li>
     <li>ب. ما هو السبب في هبوط القوة الدافعة المتولدة عند تحميل المولد؟ وكيف يمكن تعويض ذلك؟</li>
     <li>ج. ما السبب في وجود فرق بين القوة الدافعة المتولدة والجهد على أطراف المولد؟</li>
     <li>د. هل معامل تنظيم الجهد للمولد منفصل التغذية جيد؟ علل إجابتك.</li></ul>`,ref:'ص 16'},
    {predict:{q:'هل معامل تنظيم الجهد للمولد منفصل التغذية جيد؟ (السؤال د)',opts:[
     ['نعم، صغير نسبياً، لأن تيار مجاله لا يعتمد على جهد الأطراف',true,'المجال من مصدر مستقل، فالهبوط سببه فقط \\(I_aR_a\\) والفرش ورد فعل المنتج. قارن نتيجتك بمولد التوازي في التجربة الثالثة.'],
     ['لا، لأن جهده ينهار مع أي حمل',false,'الانهيار مع الحمل صفة مولدات أخرى (مثل المركب التفاضلي)، لا منفصل التغذية.'],
     ['لا يمكن معرفته إلا بالحساب الدقيق',false,'يمكن الحكم من شكل المنحنى: الهبوط صغير لأن تيار المجال لا يتأثر بالحمل.']]}},
    {tip:String.raw`<p>لكل سؤال إجابة مقترحة (ليست من الكتاب) في الأسلوب الرسمي لهذا الدرس. وفي تبويب «المختبر» تستطيع إيقاف «رد فعل المنتج» لترى أثره وحده، ويحسب لك معامل تنظيم الجهد من قراءاتك.</p>`}
   ]},

  {recap:[
   'التجربة الثانية: العلاقة بين تيار الحمل وجهد الحمل عند سرعة ثابتة — منحنى الخواص الخارجية — ومعامل تنظيم الجهد (ص 14).',
   'القوانين المستنتجة من الدائرة: \\(V_L=I_L\\times R_L\\) و\\(I_L=V_L\\div R_L\\) (ص 14).',
   'الشكل <span class="ltr">(2)</span>: الفولتميتر على أطراف المولد، والأميتر <span class="ltr">A2</span> على التوالي مع مقاومة الحمل، ومجال المولد من مصدر مستقل عبر <span class="ltr">A1</span> (ص 14).',
   String.raw`السرعة وتيار المجال <span class="ltr">0.3 A</span> ثابتان، و\(R_L\) من <span class="ltr">100%</span> إلى <span class="ltr">20%</span> — مع كل زيادة في الحمل يهبط \(V_L\) قليلاً (ص 15).`,
   'معامل تنظيم الجهد (إضافة من خارج الكتاب): \\(VR\\%=\\dfrac{V_{NL}-V_{FL}}{V_{FL}}\\times100\\)، وهو صغير في المولد منفصل التغذية (السؤال د ص 16).']}
],
 theory:[
  {h:'التجربة الثانية: منحنى خواص الحمل للمولد منفصل التغذية',ref:'ص 14',html:`<p class="ltr" style="display:block;text-align:left">Load characteristics of a separately excited DC generator</p><p><b>أهداف التجربة:</b> التعرف على العلاقة بين تيار الحمل وجهد الحمل عندما تكون سرعة الدوران ثابتة، وكذلك حساب معامل تنظيم الجهد ثم رسم منحنى الخواص الخارجية للمولد منفصل التغذية.</p>`},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> عند توصيل حمل يمر في المنتج تيار \\(I_a\\) (في المولد منفصل التغذية \\(I_a=I_L\\))، فيهبط الجهد على الأطراف عن \\(E_0\\) لثلاثة أسباب:
   $$V_L=E-I_a R_a-V_{brush}$$
   <ol><li><b>مقاومة المنتج \\(R_a\\)</b>: هبوط \\(I_aR_a\\) يكبر مع التيار.</li><li><b>هبوط الفرش</b>: نحو فولت أو فولتين تقريباً.</li><li><b>رد فعل المنتج</b>: مجال تيار المنتج يُضعف فيض الأقطاب قليلاً، فتنقص \\(E\\) نفسها مع زيادة الحمل.</li></ol>
   وأيضاً تهبط سرعة المحرك المدير قليلاً عند التحميل، فيجب إعادة ضبطها إلى قيمتها قبل كل قراءة. وبما أن مجال المولد يُغذى من مصدر مستقل، لا يتأثر تيار المجال بهبوط جهد الأطراف، فيكون الهبوط صغيراً.`},
  VRBLOCK,
  {h:'الأجهزة المستخدمة',ref:'ص 14',html:`<ol><li>مصدر تيار مستمر متحكم فيه.</li><li>محرك تيار مستمر توازي.</li><li>مولد تيار مستمر توازي.</li><li>مصدر تيار مستمر لتغذية ملفات المجال.</li><li>جهازا أميتر.</li><li>جهاز فولتميتر.</li><li>حمل (مقاومة مادية متغيرة).</li><li>جهاز قياس السرعة.</li></ol>`},
  {h:'القوانين المستنتجة من الدائرة',ref:'ص 14',html:'$$V_L=I_L\\times R_L$$ $$I_L=V_L\\div R_L$$'},
  {fig:'(2)',ref:'ص 14',caption:'مخطط التوصيل: جهة المحرك مطابقة للشكل (1). مجال المولد E1–E2 يُغذى منفصلاً عبر الأميتر A1. على أطراف المولد الفولتميتر V (V<sub>L</sub>)، ثم الأميتر A2 على التوالي (I<sub>L</sub>)، ثم مقاومة الحمل المتغيرة R<sub>L</sub>.',draw:()=>box(benchSVG({kind:'sep',rd:false,RLp:100}),900,1)},
  {h:'خطوات إجراء التجربة',ref:'ص 15',html:`<ol><li>قم بتوصيل التجربة كما في الشكل (2).</li><li>تأكد أن مصدر التيار المستمر مضبوط على الصفر ثم شغل المصدر.</li><li>ثبت السرعة \\(n\\) عند <span class="ltr">${EXP2_N}</span> لفة في الدقيقة وكذلك قم بتثبيت تيار المجال \\(I_f\\) عند <span class="ltr">0.3 A</span>.</li><li>قم بتغيير قيمة الحمل \\(R_L\\) ومن ثم سجل قيمة تيار الحمل \\(I_L\\) عن طريق جهاز الأميتر A2 وجهد الحمل \\(V_L\\) عن طريق جهاز الفولتميتر V في الجدول (2-1).</li><li>قم برسم العلاقة بين تيار الحمل \\(I_L\\) وجهد الحمل \\(V_L\\).</li></ol>
   <p><b>جدول (2-1)</b> — <span class="ltr">n = ${EXP2_N} r.p.m &nbsp; I<sub>f</sub> = 0.3 A</span></p>${emptyTbl('R<sub>L</sub>',['100%','80%','60%','50%','40%','20%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)'])}
   <p class="sub">المنحنى المطلوب: المحور الرأسي <span class="ltr">V<sub>L</sub> (V)</span> والأفقي <span class="ltr">I<sub>L</sub> (A)</span>. قيم R<sub>L</sub> نسبة مئوية من قيمة المقاومة الكاملة (القيمة بالأوم غير مذكورة في الكتاب).</p>`},
  {err:`<div class="fixnote">(١) <b>سرعة التجربة:</b> الخطوة الثالثة (المطبوعة برقم 2) تقول «ثبت السرعة n عند <span class="ltr">1500</span> لفة في الدقيقة»، بينما رأس جدول (2-1) يقول <span class="ltr">n = 1400 r.p.m</span>. اعتمدنا هنا <span class="ltr">${EXP2_N} rpm</span> (${N2TXT}) في الخطوات والجدول والمختبر. (٢) الخطوة الأولى تحيل إلى «الشكل (1)» والصحيح الشكل (2)، والرقم 1 مكرر في ترقيم الخطوات — صُحح الترقيم أعلاه. (٣) «قم بتوصل» ← «بتوصيل»، و«وكذالك» ← «وكذلك». (٤) الخطوة 3 تسمي الفولتميتر «V1» وهو على المخطط V (V<sub>L</sub>). (٥) الجدول مسمى تحته «شكل (2-1)» والصحيح «جدول (2-1)». (٦) في الأجهزة: «الملفات المجال» ← «ملفات المجال»، و«جهازين» ← «جهازا»، والبند 7 يجمع بندين («حمل … جهاز قياس السرعة») ففصلناهما. (٧) السؤال (د): «منفصل التعدية» ← «منفصل التغذية». (٨) الهدف يطلب حساب معامل تنظيم الجهد ولا يعطي الكتاب قانونه — أضفناه أعلاه.</div>`},
  {h:'الأسئلة',ref:'ص 16',html:`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p>`+
   Q('أ.','ما هو تأثير زيادة الحمل على الجهد على طرفي المولد وعلى سرعة المولد؟','يهبط الجهد قليلاً كلما زاد الحمل (المنحنى يميل إلى أسفل ببطء). وتهبط سرعة المحرك المدير قليلاً لأن المولد المحمّل يحتاج عزماً أكبر، فيجب إعادة ضبط السرعة قبل كل قراءة.')+
   Q('ب.','ما هو السبب في هبوط القوة الدافعة المتولدة عند تحميل المولد؟ وكيف يمكن تعويض ذلك؟','السبب رد فعل المنتج (يضعف الفيض) وهبوط السرعة إن لم تُضبط. ويعوض ذلك بزيادة تيار المجال قليلاً، أو بالمحافظة على السرعة، وفي الآلات الكبيرة بأقطاب مساعدة وملفات تعويض. جرّب إيقاف «رد فعل المنتج» في المختبر لترى أثره وحده.')+
   Q('ج.','ما السبب في وجود فرق بين القوة الدافعة المتولدة والجهد على أطراف المولد؟','الهبوط داخل المولد: \\(I_aR_a\\) في مقاومة المنتج وهبوط الفرش: \\(V_L=E-I_aR_a-V_{brush}\\). الفرق صفر تقريباً بلا حمل ويكبر مع التيار.')+
   Q('د.','هل معامل تنظيم الجهد للمولد منفصل التغذية جيد؟ علل إجابتك.','نعم، جيد (صغير نسبياً) لأن تيار المجال لا يعتمد على جهد الأطراف (مصدر مستقل)، فالهبوط سببه فقط \\(I_aR_a\\) والفرش ورد فعل المنتج. قارن نتيجتك بمولد التوازي في التجربة الثالثة.')}
 ],
 lab:(el)=>{
  const M0={n:0,nss:0,Im:0};let on=false,Vs=0,If=0,RLp='open',ang=0,G=null,sig='',noAR=false,noVb=false;const did={};
  const T=loadTbl(T21COLS,f=>`RL=${f.RLp==='open'?'∞':f.RLp+'%'}، n=${fm(f.n,0)}، If=${fm(f.If,3)}: IL=${fm(f.IL,2)} A، VL=${fm(f.VL,1)} V`);
  el.innerHTML=`<div id="l3tp"></div><div class="grid dc-lab">
   <div class="panel c12"><h2>منضدة الاختبار <small>مبنية على الشكل (2) ص 14 — الدوران في الرسم مبطأ</small></h2>
    <div class="svgbox dc-wide" id="l3c" style="max-width:900px;margin-inline:auto"></div><div id="l3msg" class="dc-msg"></div></div>
   <div class="panel c6"><h2>المحرك المدير <small>مصدر 0-250 V DC</small></h2>${supplyHTML('l3','جهد مصدر المحرك المدير')}
    <p class="sub">عند زيادة الحمل تهبط السرعة قليلاً: أعد ضبطها بجهد المصدر إلى ${lt(EXP2_N+' rpm')} قبل التسجيل.</p></div>
   <div class="panel c6"><h2>المجال والحمل</h2>${sl('l3if','تيار مجال المولد I<sub>f</sub> (A1)',0,0.35,0.005,0)}${fineHTML('l3fd',[-0.05,-0.01,-0.005,0.005,0.01,0.05],'A')}
    <div class="dc-chips"><button class="btn" data-l3c="0.3">0.3 A</button></div>${rlHTML('l3',T21COLS)}
    <div class="dc-sw"><button class="btn" id="l3ar" aria-pressed="true">رد فعل المنتج: محسوب</button><button class="btn" id="l3vb" aria-pressed="true">هبوط الفرش: محسوب</button></div></div>
   <div class="panel c12"><h2>قراءات الأجهزة</h2><div class="dc-meters" id="l3m"></div><div id="l3why"></div>
    <div class="dc-row"><button class="btn primary" id="l3rec">سجّل القراءة</button><button class="btn" id="l3clr">امسح الجدول</button></div><div id="l3rmsg" class="dc-msg"></div><div id="l3w" class="dc-msg"></div></div>
   <div class="panel c7"><h2>جدول (2-1) <small>${lt('n = '+EXP2_N+' r.p.m &nbsp; I<sub>f</sub> = 0.3 A')}</small></h2><div id="l3t"></div>${ADDCOL}<div class="svgbox" id="l3p"></div></div>
   <div class="panel c5"><h2>معامل تنظيم الجهد <small>إضافة من خارج الكتاب</small></h2><div id="l3vr"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l3tp'),TPID,tpDefs(['nref','Er','E03','Fk','Ra','Vb','kar','RLmax','Irat','n0','Ram','I0','tau']),()=>{T.data={};T.free=[];sig='';redrawT();steps.redraw()});
  const setVs=x=>{Vs=clamp(B.round(x,1),0,250);$('#l3vs').value=Vs;$('#l3vs-v').textContent=fm(Vs,1)+' V'};
  const setIf=x=>{If=clamp(B.round(x,3),0,0.35);$('#l3if').value=If;$('#l3if-v').textContent=fm(If,3)+' A'};
  const setRL=x=>{RLp=x;el.querySelectorAll('[data-l3rl]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l3rl===String(x))));if(x!=='open')$('#l3rl').value=x;$('#l3rl-v').textContent=x==='open'?'مفصول':x+' %'};
  setVs(0);setIf(0);setRL('open');
  $('#l3vs').oninput=e=>setVs(+e.target.value);$('#l3if').oninput=e=>setIf(+e.target.value);$('#l3rl').oninput=e=>setRL(+e.target.value);
  el.querySelectorAll('[data-l3d]').forEach(b=>b.onclick=()=>setVs(Vs+ +b.dataset.l3d));el.querySelectorAll('[data-l3fd]').forEach(b=>b.onclick=()=>setIf(If+ +b.dataset.l3fd));
  el.querySelectorAll('[data-l3c]').forEach(b=>b.onclick=()=>setIf(+b.dataset.l3c));el.querySelectorAll('[data-l3rl]').forEach(b=>b.onclick=()=>setRL(b.dataset.l3rl==='open'?'open':+b.dataset.l3rl));
  $('#l3on').onclick=()=>{if(!on&&Vs>0.05){$('#l3msg').innerHTML=recMsg(0,'<b>أرجع جهد المصدر إلى الصفر قبل التشغيل</b> (الخطوة 2): المحرك الواقف يسحب تياراً كبيراً جداً لو وُصل على جهد مرتفع مباشرة.');return}
   on=!on;$('#l3msg').innerHTML='';$('#l3on').setAttribute('aria-pressed',String(on));$('#l3on').textContent=on?'إيقاف المصدر':'تشغيل المصدر'};
  $('#l3ar').onclick=()=>{noAR=!noAR;if(noAR)did.ar=1;$('#l3ar').setAttribute('aria-pressed',String(!noAR));$('#l3ar').textContent='رد فعل المنتج: '+(noAR?'مُهمَل':'محسوب')};
  $('#l3vb').onclick=()=>{noVb=!noVb;$('#l3vb').setAttribute('aria-pressed',String(!noVb));$('#l3vb').textContent='هبوط الفرش: '+(noVb?'مُهمَل':'محسوب')};
  const RLohm=()=>RLp==='open'?Infinity:TP.v.RLmax*RLp/100;
  const redrawT=()=>{const c=T.cols.find(c=>String(c.v)===String(RLp));$('#l3t').innerHTML=tableHTML(T,c?c.k:null);
   const v=TP.v,pts=tblPts(T,'IL','VL'),fr=T.free.map(f=>[f.IL,f.VL]),all=pts.concat(fr);const E0=mach(v).E(0.3,EXP2_N);
   $('#l3p').innerHTML=plotXY({x1:nice(Math.max(v.Irat*1.3,...all.map(p=>p[0]),G?G.IL*1.05:0,0.1)),y1:nice(Math.max(E0*1.12,...all.map(p=>p[1]),1)),xl:'IL (A)',yl:'VL (V)',cid:'dcp3',aria:'منحنى الخواص الخارجية',series:[{pts,col:'--blue'},{pts:fr,col:'--muted',line:false,hollow:true}],live:on&&G?[G.IL,G.VL]:null});
   $('#l3vr').innerHTML=vrHTML(T,v.Irat)};
  $('#l3rec').onclick=()=>{const m=$('#l3rmsg');if(!on||M0.n<1){m.innerHTML=recMsg(0,'المحرك متوقف: شغّل المصدر وارفع الجهد أولاً.');return}
   if(Math.abs(M0.n-M0.nss)>1){m.innerHTML=recMsg(0,'انتظر حتى تستقر السرعة ثم سجّل.');return}
   const r={RLp,n:Math.round(M0.n),If:B.round(If,3),IL:B.round(G.IL,2),VL:B.round(G.VL,1)};const why=[];
   if(!okN(M0.n,EXP2_N))why.push(`السرعة ليست ${EXP2_N} rpm (أعد ضبطها بجهد المصدر)`);if(Math.abs(If-0.3)>=TOL_I)why.push('تيار المجال ليس 0.3 A');const c=T.cols.find(c=>String(c.v)===String(RLp));if(!c)why.push('R<sub>L</sub> ليست من قيم الجدول');
   if(!why.length){T.data[c.k]=r;m.innerHTML=recMsg(1,`سُجّلت عند ${c.label}: ${lt('I<sub>L</sub> = '+fm(r.IL,2)+' A')} و ${lt('V<sub>L</sub> = '+fm(r.VL,1)+' V')}.`)}else{T.free.push(r);m.innerHTML=recMsg(0,`سُجّلت قراءة حرة لأن: ${why.join('، ')}.`)}redrawT()};
  $('#l3clr').onclick=()=>{T.data={};T.free=[];redrawT();$('#l3rmsg').innerHTML=''};
  const steps=stepsUI($('#l3st'),[
   {t:'شغّل المصدر وهو على الصفر',x:'الخطوة 2: جهد المصدر على الصفر ثم «تشغيل المصدر».',done:()=>on},
   {t:`ثبّت السرعة و I<sub>f</sub>`,x:`الخطوة 3 والحمل مفصول: اجعل <span class="ltr">I<sub>f</sub> = 0.3 A</span> وارفع جهد المصدر حتى <span class="ltr">n = ${EXP2_N} rpm</span>.`,done:()=>on&&okN(M0.n,EXP2_N)&&Math.abs(If-0.3)<TOL_I},
   {t:'قراءة اللاحمل',x:'سجّل والحمل «مفصول»: <span class="ltr">I<sub>L</sub> = 0</span> والجهد هو جهد اللاحمل V<sub>NL</sub> (عمود مضاف لحساب معامل التنظيم).',done:()=>!!T.data.open},
   {t:'أول حمل',x:`اختر <span class="ltr">R<sub>L</sub> = 100%</span>: لاحظ أن السرعة تهبط قليلاً (السؤال أ). أعد ضبطها إلى ${EXP2_N} rpm ثم سجّل.`,done:()=>!!T.data['100']},
   {t:'أكمل جدول (2-1)',x:'كرر عند 80% ثم 60% ثم 50% ثم 40% ثم 20%، وأعد ضبط السرعة قبل كل تسجيل. المنحنى يهبط ببطء.',done:()=>tblDone(T)},
   {t:'لماذا يهبط الجهد؟',x:'عند حمل كبير (40% أو 20%) اضغط «رد فعل المنتج» ليصبح «مُهمَلاً»: يرتفع الجهد قليلاً. الباقي سببه I<sub>a</sub>R<sub>a</sub> والفرش — انظر تفصيل الهبوط تحت العدادات (السؤالان ب و ج).',done:()=>did.ar},
   {t:'معامل تنظيم الجهد',x:'اقرأ حساب VR من جدولك (لوحة «معامل تنظيم الجهد»): نسبة صغيرة — مولد منفصل التغذية جيد التنظيم (السؤال د).'},
   {t:'أوقف المحرك',x:'افصل الحمل وأعد جهد المصدر إلى الصفر حتى يتوقف المحرك.',done:()=>Vs===0&&M0.n<1}
  ]);
  redrawT();let pt=0;
  loopOn(el,dt=>{const v=TP.v,Mx=mach(v);
   const IfA=chF('fopen')?0:If;G=armSolve(v,{n:M0.n,Isep:(chF('frev')?-1:1)*IfA*(chF('kF')?0.55:1),RL:RLohm(),noAR,noVb});
   motorStep(M0,v,dt,{on,Vs,Pg:G.E*G.Ia});
   ang=(ang+M0.n/60*360*dt/25)%360;
   const sg=[on,fm(Vs,1),Math.round(M0.n),fm(If,3),RLp,fm(G.VL,1),fm(G.IL,2),noAR,noVb].join('|');
   if(sg!==sig){sig=sg;$('#l3c').innerHTML=benchSVG({kind:'sep',on,Vs,ang,If:IfA,E:G.E,VL:G.VL,IL:G.IL,RLp:RLp==='open'?null:RLp,n:M0.n});
    $('#l3m').innerHTML=meter('السرعة n',fm(Math.round(M0.n),0)+' rpm')+meter('I<sub>f</sub> (A1)',fm(IfA,3)+' A')+meter('I<sub>L</sub> (A2)',fm(G.IL,2)+' A')+meter('V<sub>L</sub> (V)',fm(G.VL,1)+' V')+meter('R<sub>L</sub>',RLp==='open'?'∞':fm(RLohm(),1)+' Ω');
    const Enl=Mx.E(If,M0.n),Ear=Enl-G.E;
    $('#l3why').innerHTML=`<div class="facts"><div class="fact"><span>E بلا حمل (نفس n و I<sub>f</sub>)</span><b>${fm(Enl,1)} V</b></div><div class="fact"><span>− نقص E برد فعل المنتج</span><b>${fm(Ear,1)} V</b></div><div class="fact"><span>− I<sub>a</sub>R<sub>a</sub></span><b>${fm(G.Ia*v.Ra,1)} V</b></div><div class="fact"><span>− هبوط الفرش</span><b>${fm(G.vb,1)} V</b></div><div class="fact"><span>= V<sub>L</sub></span><b>${fm(G.VL,1)} V</b></div></div><p class="sub">تفصيل توضيحي من نموذج الآلة (ليس من الكتاب). في المولد منفصل التغذية \\(I_a=I_L\\).</p>`;B.math($('#l3why'));
    $('#l3w').innerHTML=warnI(G.IL,v.Irat);
    const c=T.cols.find(c=>String(c.v)===String(RLp));el.querySelectorAll('#l3t th,#l3t td').forEach(x=>x.classList.remove('cur'));if(c){const i=T.cols.indexOf(c)+2;el.querySelectorAll(`#l3t tr > :nth-child(${i})`).forEach(x=>x.classList.add('cur'))}}
   else{const g=el.querySelectorAll('#dcr1,#dcr2');if(g[0])g[0].setAttribute('transform',`rotate(${fx(ang)} 230 166)`);if(g[1])g[1].setAttribute('transform',`rotate(${fx(ang)} 580 166)`)}
   pt+=dt;if(pt>0.25){pt=0;const c=T.cols.find(c=>String(c.v)===String(RLp));const v2=TP.v,pts=tblPts(T,'IL','VL'),fr=T.free.map(f=>[f.IL,f.VL]),all=pts.concat(fr);
    $('#l3p').innerHTML=plotXY({x1:nice(Math.max(v2.Irat*1.3,...all.map(p=>p[0]),G.IL*1.05,0.1)),y1:nice(Math.max(mach(v2).E(0.3,EXP2_N)*1.12,...all.map(p=>p[1]),G.VL,1)),xl:'IL (A)',yl:'VL (V)',cid:'dcp3',aria:'منحنى الخواص الخارجية',series:[{pts,col:'--blue'},{pts:fr,col:'--muted',line:false,hollow:true}],live:on?[G.IL,G.VL]:null})}
   steps.check()});
 },
 quiz:[
  {q:'في التجربة الثانية تبقى ثابتة:',o:['مقاومة الحمل','السرعة وتيار المجال','تيار الحمل','جهد الأطراف'],c:1,e:`السرعة ${EXP2_N} rpm و I_f = 0.3 A.`},
  {q:'عند تصغير R<sub>L</sub> من 100% إلى 20% فإن:',o:['تيار الحمل يقل','تيار الحمل يزيد وجهد الأطراف يهبط قليلاً','لا يتغير شيء','الجهد يرتفع كثيراً'],c:1,e:'مقاومة أصغر ← حمل أكبر.'},
  {q:'في المولد منفصل التغذية تيار المنتج I<sub>a</sub>:',o:['= I<sub>L</sub> + I<sub>f</sub>','= I<sub>L</sub>','= I<sub>f</sub>','= صفر'],c:1,e:'المجال يُغذى من مصدر آخر.'},
  {q:'سبب الفرق بين E و V<sub>L</sub>:',o:['مقاومة الفولتميتر','الهبوط I<sub>a</sub>R<sub>a</sub> وهبوط الفرش داخل المولد','جهد المصدر','السرعة فقط'],c:1,e:'السؤال (ج).'},
  {q:'ما الذي يُضعف الفيض قليلاً عند التحميل؟',o:['المغنطة المتبقية','رد فعل المنتج','الفولتميتر','مقاومة المجال'],c:1,e:'السؤال (ب).'},
  {q:'ماذا يحدث لسرعة المحرك المدير عند تحميل المولد؟',o:['تزيد','تهبط قليلاً فنعيد ضبطها','لا تتغير أبداً','يتوقف المحرك'],c:1,e:'السؤال (أ).'},
  {q:'معامل تنظيم الجهد يُحسب من:',o:['\\(\\frac{V_{NL}-V_{FL}}{V_{FL}}\\times100\\)','\\(V_L\\times I_L\\)','\\(E/n\\)','\\(I_L/R_L\\)'],c:0,e:'قانون مضاف من خارج الكتاب.'},
  {q:'إذا كان \\(V_L=200\\) V و\\(I_L=4\\) A فإن \\(R_L\\) =',o:['800 Ω','50 Ω','0.02 Ω','204 Ω'],c:1,e:'\\(R_L=V_L/I_L\\) (قوانين ص 14).'}
 ]
});

/* ======================================================================
   Lesson 4 — التجربة الثالثة: خواص مولد التوازي (ص 17–19)
   ====================================================================== */
const T3COLS=['open',100,80,60,40];
B.lesson({
 id:'u1-l4',unit:1,order:4,pages:'17–19',
 title:'التجربة الثالثة: خواص مولد التوازي',
 summary:'مجال المولد موصل على أطراف منتجه نفسه فيبني جهده بنفسه من المغنطة المتبقية. نسجل جهد الحمل وتيار الحمل عند 1200 rpm ثم عند 1500 rpm، ونرى لماذا يهبط جهده أكثر من المولد منفصل التغذية، ومتى لا يبني الجهد أصلاً.',
 stations:[
  {intro:true},

  {st:1,short:'الغرض من التجربة',title:'الغرض من التجربة الثالثة: خواص مولد التوازي',ref:'ص 17',
   q:'لا يوجد مصدر لمجال المولد هذه المرة… فمن أين يأتي تيار المجال؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد توازي: ملف المجال موصل على أطراف المنتج، وسهم يبين أن جزءاً من تيار المولد يعود إلى مجاله" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المولد ⟦G⟧: يدور بالمحرك المدير، ويغذي مجاله بنفسه من جهد أطرافه."><circle cx="100" cy="160" r="38" fill="#F2C14E" stroke="#2C4A40" stroke-width="4"/><text x="100" y="169" text-anchor="middle" font-size="24" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text></g><path d="M100 122 V64 H300 V120 M300 200 V256 H100 V198" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="ملف المجال ⟦E1–E2⟧ موصل على أطراف المنتج مباشرة (توازي): يأخذ تياره ⟦If⟧ من جهد المولد نفسه، بلا مصدر خارجي."><path d="M190 64 V112 M190 208 V256" fill="none" stroke="#E8735A" stroke-width="3"/><path d="M190 112 q-14 8 0 16 q-14 8 0 16 q-14 8 0 16 q-14 8 0 16 q-14 8 0 16 q-14 8 0 16" fill="none" stroke="#E8735A" stroke-width="4"/></g><circle cx="190" cy="64" r="4.5" fill="#2C4A40"/><circle cx="190" cy="256" r="4.5" fill="#2C4A40"/><text x="216" y="166" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="3">f</tspan></text><g data-tip="الحمل ⟦RL⟧: يأخذ بقية تيار المولد ⟦IL⟧."><rect x="288" y="120" width="24" height="80" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/></g><text x="300" y="226" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="9" dy="3">L</tspan></text><g data-tip="التغذية الذاتية: جهد المولد يمرر تياراً في مجاله، والمجال يصنع الفيض الذي يولد الجهد — حلقة تبني الجهد بنفسها."><path d="M140 108 a54 54 0 0 1 34 -26" fill="none" stroke="#12855A" stroke-width="3"/><polygon points="182,80 170,78 176,90" fill="#12855A"/><path d="M174 236 a54 54 0 0 1 -34 -22" fill="none" stroke="#12855A" stroke-width="3"/><polygon points="134,208 136,220 146,212" fill="#12855A"/></g><text x="180" y="294" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">المولد يغذي مجاله بنفسه</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لفكرة التغذية الذاتية.<br><b>مرّر المؤشر على الملف والسهمين الأخضرين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'المولد واقف وجهده صفر. بدأ يدور، فمن أين يبدأ جهده؟',opts:[
     ['من مصدر تيار المجال',false,'لا يوجد مصدر للمجال في الشكل (3)؛ المجال على أطراف المولد نفسه.'],
     ['من المغنطة المتبقية في الأقطاب',true,'رأيتها في التجربة الأولى: جهد صغير عند \\(I_f=0\\). هذا الجهد الصغير هو الشرارة التي يبدأ منها البناء.'],
     ['لا يمكن أن يبدأ أبداً',false,'يبدأ فعلاً، بشرط وجود مغنطة متبقية وتوصيل المجال في الاتجاه الصحيح.']]}}
   ],
   body:[
    {book:String.raw`<p class="ltr" style="display:block;text-align:left">Characteristics of DC shunt generator</p><p><b>الغرض من التجربة:</b> الحصول على منحنى خواص اللاحمل أو الدائرة المفتوحة لمولد التيار المستمر ذي تغذية التوازي (العلاقة بين القوة الدافعة المتولدة وتيار المجال)، وكذلك خواص الحمل (العلاقة بين الجهد على أطراف المولد وتيار الحمل).</p>`,ref:'ص 17'},
    {title:'كيف يبني مولد التوازي جهده؟',widget:(el,B)=>{
      const S=['المغنطة المتبقية تولد جهداً صغيراً','الجهد يمرر تياراً صغيراً في ملف المجال','الفيض يقوى (إذا كان التوصيل في الاتجاه الصحيح)','الجهد يزيد فيزيد تيار المجال…','يستقر الجهد عند قيمة ثابتة'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «أدِر المولد» وتابع الحلقة.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>أدِر المولد</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>يستقر الجهد عند نقطة تقاطع منحنى المغنطة مع «خط مقاومة المجال» \(V=I_fR_f\). <b>شروط بناء الجهد:</b> وجود مغنطة متبقية، وتوصيل ملف المجال في الاتجاه الصحيح (تياره يقوي المغنطة المتبقية لا يلغيها)، ومقاومة دائرة المجال أقل من «المقاومة الحرجة»، وسرعة أعلى من «السرعة الحرجة». (من دراستك النظرية، وليست في الحقيبة.)</p>`,title:'متى يبني ومتى لا يبني؟'}
   ]},

  {st:2,short:'الأجهزة',title:'الأجهزة المستخدمة',ref:'ص 17',
   q:'قائمة هذه التجربة أقصر من سابقتها… فما الجهاز الذي اختفى، ولماذا؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سبع بطاقات للأجهزة: مصدر قدرة، مولد توازي، فولتميتر، مقياس سرعة، موحد متحكم فيه، أميتر، حمل متغير" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="مصدر قدرة: يغذي المحرك المدير ⟦0-250 V DC⟧."><rect x="266" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="281" y="60" width="48" height="32" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="305" y="81" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">DC</text><text x="305" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مصدر قدرة</text></g><g data-tip="مولد تيار مستمر توازي ⟦G⟧: مجاله على أطرافه."><rect x="180" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="219" cy="76" r="17" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="219" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><text x="219" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مولد توازي</text></g><g data-tip="فولتميتر: يقرأ جهد الحمل ⟦VL⟧ على أطراف المولد."><rect x="94" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="133" cy="76" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="133" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text><text x="133" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">فولتميتر</text></g><g data-tip="جهاز قياس السرعة: لضبط السرعة على ⟦1200⟧ ثم ⟦1500 rpm⟧."><rect x="8" y="44" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M29 90 a18 18 0 0 1 36 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="47" y1="90" x2="58" y2="77" stroke="#E8735A" stroke-width="2.5"/><text x="47" y="124" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">مقياس السرعة</text></g><g data-tip="موحد تيار مستمر متحكم فيه: مصدر مستمر يمكن ضبط جهده."><rect x="223" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="238" y="180" width="48" height="32" rx="5" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="262" y="201" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">DC</text><text x="262" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">موحد متحكم</text></g><g data-tip="أميتر: على التوالي مع الحمل، يقرأ تيار الحمل ⟦IL⟧."><rect x="137" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="176" cy="198" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="176" y="204" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text><text x="176" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">أميتر</text></g><g data-tip="حمل (مقاومة متغيرة) ⟦RL⟧."><rect x="51" y="164" width="78" height="104" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="78" y="180" width="24" height="40" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="70" y1="220" x2="109" y2="182" stroke="#2C4A40" stroke-width="2"/><text x="90" y="244" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">حمل متغير</text></g></svg>`,
   cap:'الأجهزة السبعة بترتيب قائمة الكتاب.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف دور الجهاز.</b>',
   side:[
    {predict:{q:'في التجربة الثانية كان هناك «جهازا أميتر». لماذا يكفي هنا أميتر واحد في المخطط؟',opts:[
     ['لأن تيار الحمل لا يحتاج قياساً',false,'تيار الحمل يُسجَّل في الجدولين، فأميتره باقٍ.'],
     ['لأن ملف المجال على أطراف المولد مباشرة، ولا يوجد على الرسم أميتر مجال',true,'في الشكل (3) ملف المجال موصل على المنتج مباشرة «بدون مقاومة مجال وبدون أميتر مجال»، فالأميتر الوحيد لتيار الحمل.'],
     ['لأن المولد هنا لا يعطي تياراً',false,'المولد يعطي تيار الحمل وتيار المجال معاً.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>مصدر قدرة.</li><li>مولد تيار مستمر توازي.</li><li>جهاز فولتميتر.</li><li>جهاز قياس السرعة.</li><li>موحد تيار مستمر متحكم فيه.</li><li>جهاز أميتر.</li><li>حمل (مقاومة مادية متغيرة).</li></ol>`,ref:'ص 17'},
    {watch:String.raw`<p>البند 2 مطبوع في الكتاب «مولد تيار مستمر <b>توالي</b>» والصحيح «توازي»: التجربة لمولد التوازي والمخطط يبين مجال توازي <span class="ltr">E1–E2</span>. والمحرك المُدير غير مذكور في القائمة مع أنه في المخطط.</p>`,fix:true}
   ]},

  {st:3,short:'دائرة التوصيل',title:'مخطط التوصيل — الشكل <span class="ltr">(3)</span>',ref:'ص 17',
   q:'قارن بالشكل (2): ما الذي حُذف، وما الذي تغيّر مكانه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبسط عن جهة المولد في الشكل 3: ملف المجال على الأطراف مباشرة، ثم الفولتميتر، ثم الأميتر على التوالي مع مقاومة الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="المولد ⟦G⟧: أطرافه ⟦1B1⟧ و⟦2B2⟧؛ يديره المحرك من اليسار (جهة المحرك مطابقة للشكلين 1 و2)."><circle cx="70" cy="160" r="28" fill="#F2C14E" stroke="#2C4A40" stroke-width="3.5"/><text x="70" y="168" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text><rect x="14" y="156" width="28" height="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/></g><path d="M70 132 V70 H232 M268 70 H316 V122 M316 202 V250 H70 V188" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="ملف المجال ⟦E1–E2⟧ على أطراف المنتج مباشرة — بدون مقاومة مجال وبدون أميتر مجال على الرسم. هذا هو الفرق الأساسي عن الشكل (2)."><path d="M126 70 V116 M126 204 V250" fill="none" stroke="#E8735A" stroke-width="3"/><path d="M126 116 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14" fill="none" stroke="#E8735A" stroke-width="4"/></g><text x="142" y="166" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">E1–E2</text><g data-tip="الفولتميتر ⟦V⟧: يقرأ جهد الحمل ⟦VL⟧، وهو أيضاً جهد ملف المجال ⟦Vf⟧."><path d="M200 70 V140 M200 180 V250" fill="none" stroke="#4FB3A9" stroke-width="3"/><circle cx="200" cy="160" r="18" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="3"/><text x="200" y="167" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><g fill="#2C4A40"><circle cx="126" cy="70" r="4"/><circle cx="126" cy="250" r="4"/><circle cx="200" cy="70" r="4"/><circle cx="200" cy="250" r="4"/></g><g data-tip="الأميتر ⟦A⟧: على التوالي مع الحمل، يقرأ تيار الحمل ⟦IL⟧ فقط (لا يمر فيه تيار المجال)."><circle cx="250" cy="70" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="250" y="76" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">A</text></g><g data-tip="مقاومة الحمل المتغيرة ⟦RL⟧ بالنسب ⟦100%، 80%، 60%، 40%⟧."><rect x="304" y="122" width="24" height="80" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><line x1="292" y1="198" x2="340" y2="128" stroke="#2C4A40" stroke-width="2.5"/></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لا يوجد مصدر لمجال المولد</text></svg>`,
   cap:'مبسّط عن جهة المولد في الشكل <span class="ltr">(3)</span>.<br><b>مرّر المؤشر على الملف والأجهزة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تيار المنتج \\(I_a\\) هنا يذهب إلى أين؟',opts:[
     ['إلى الحمل فقط',false,'هذا صحيح في المولد منفصل التغذية؛ أما هنا فالمجال على الأطراف ويأخذ جزءاً منه.'],
     ['إلى المجال فقط',false,'الحمل موصل ويأخذ تياره I_L الذي يقرؤه الأميتر.'],
     ['يتفرع: جزء في ملف المجال \\(I_f\\) وجزء في الحمل \\(I_L\\)',true,'\\(I_a=I_L+I_f\\) — علاقة لا يذكرها الكتاب لكنها تُقرأ من المخطط: ملف المجال والحمل فرعان على الأطراف نفسها.']]}}
   ],
   body:[
    {book:String.raw`<p><b>مخطط التوصيل — الشكل <span class="ltr">(3)</span></b></p>`+box(benchSVG({kind:'shunt',rd:false,RLp:100}),900,1),ref:'ص 17'},
    {tip:String.raw`<p>جهة المحرك مطابقة للشكلين <span class="ltr">(1)</span> و<span class="ltr">(2)</span>. جهة المولد تغذية ذاتية توازي: ملف المجال <span class="ltr">E1–E2</span> على أطراف المنتج مباشرة، ثم الفولتميتر <span class="ltr">V</span> \((V_L)\)، ثم الأميتر <span class="ltr">A</span> على التوالي \((I_L)\) ومقاومة الحمل المتغيرة \(R_L\).</p>`,title:'اقرأ المخطط'}
   ]},

  {st:4,short:'المعادلات',title:'المعادلات الخاصة بالتجربة',ref:'ص 18',
   q:'الفولتميتر يقرأ جهداً واحداً… فلماذا يكتب الكتاب له أربعة أسماء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نقطة تفرع: تيار المنتج يتفرع إلى تيار المجال وتيار الحمل، والجهد نفسه على الفرعين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="تيار المنتج ⟦Ia⟧: كل ما يخرج من المولد."><line x1="40" y1="90" x2="160" y2="90" stroke="#2C4A40" stroke-width="5"/><polygon points="152,82 168,90 152,98" fill="#2C4A40"/><text x="96" y="76" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="11" dy="4">a</tspan></text></g><circle cx="180" cy="90" r="7" fill="#2C4A40"/><g data-tip="تيار المجال ⟦If⟧: الفرع الذي يمر في ملف المجال، ويساوي ⟦VL ÷ Rf⟧."><path d="M180 90 V140" stroke="#E8735A" stroke-width="4"/><path d="M180 140 q-16 8 0 16 q-16 8 0 16 q-16 8 0 16 q-16 8 0 16" fill="none" stroke="#E8735A" stroke-width="4"/><path d="M180 204 V250" stroke="#E8735A" stroke-width="4"/><text x="150" y="128" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="4">f</tspan></text><text x="214" y="180" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="10" dy="4">f</tspan></text></g><g data-tip="تيار الحمل ⟦IL⟧: الفرع الذي يمر في الحمل، ويساوي ⟦VL ÷ RL⟧."><path d="M180 90 H300 V140" fill="none" stroke="#4FB3A9" stroke-width="4"/><rect x="288" y="140" width="24" height="64" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M300 204 V250" stroke="#4FB3A9" stroke-width="4"/><text x="250" y="76" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="4">L</tspan></text><text x="330" y="180" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="10" dy="4">L</tspan></text></g><line x1="40" y1="250" x2="300" y2="250" stroke="#2C4A40" stroke-width="4"/><g data-tip="الجهد نفسه على الفرعين: ⟦Vf = VL⟧، لأن ملف المجال والحمل موصلان على النقطتين نفسيهما."><rect x="60" y="150" width="70" height="80" fill="transparent"/><line x1="96" y1="160" x2="96" y2="226" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><text x="96" y="200" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="4">L</tspan></text></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">تيار واحد يتفرع، وجهد واحد يتكرر</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لنقطة التفرع على أطراف مولد التوازي.<br><b>مرّر المؤشر على الفرعين والسهم والجهد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<div class="eq">$$E=V_L+I_a\times R_a$$</div><div class="eq">$$V_f=V_L=I_f\times R_f=I_L\times R_L$$</div>`,ref:'ص 18'}
   ],
   body:[
    {tip:String.raw`<p>\(E\) القوة الدافعة المتولدة، \(V_L\) جهد الأطراف (= جهد ملف المجال \(V_f\) لأنه موصل عليها)، \(I_a\) تيار المنتج، \(R_a\) مقاومة المنتج، \(I_f\) و\(R_f\) تيار ومقاومة ملف المجال، \(I_L\) و\(R_L\) تيار ومقاومة الحمل. والعلاقة التي لم يذكرها الكتاب: \(I_a=I_L+I_f\). (المعادلة الأولى تهمل هبوط الفرش.)</p>`,title:'معاني الرموز'},
    {predict:{q:'من المعادلة الثانية: إذا هبط \\(V_L\\) بسبب الحمل، ماذا يحدث لتيار المجال \\(I_f\\)؟',opts:[
     ['يبقى ثابتاً',false,'هذا في المولد منفصل التغذية فقط؛ هنا \\(I_f\\) مربوط بجهد الأطراف.'],
     ['ينقص، لأن \\(I_f=V_L\\div R_f\\)',true,'\\(V_L=I_f\\times R_f\\) و\\(R_f\\) ثابتة، فنقص \\(V_L\\) يعني نقص \\(I_f\\) — ولهذا يهبط جهد مولد التوازي أكثر (السؤال v).'],
     ['يزيد ليعوض الهبوط',false,'لا يوجد في الدائرة ما يزيده؛ المعادلة تربطه بالجهد طردياً.']]}},
    {watch:String.raw`<p>المعادلة الأولى تعطي \(E\) أكبر من \(V_L\) دائماً عند التحميل: الفرق \(I_aR_a\) يضيع داخل المنتج. لا تخلط بين \(I_a\) (تيار المنتج) و\(I_L\) (قراءة الأميتر).</p>`}
   ]},

  {st:5,short:'أولاً: 1200 rpm',title:'خطوات التجربة — أولاً، وجدول <span class="ltr">(3-1)</span>',ref:'ص 18',
   q:'في الجدول نسبة \\(R_L\\) فقط… فما الذي يجب أن يبقى ثابتاً أثناء القراءات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مثبتة عند 1200 لفة في الدقيقة، ومقاومة الحمل 100 و80 و60 و40 بالمئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="السرعة ثابتة لجدول ⟦(3-1)⟧: ⟦n = 1200 rpm⟧."><rect x="40" y="40" width="280" height="80" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M220 100 a30 30 0 0 1 60 0" fill="none" stroke="#2C4A40" stroke-width="3.5"/><line x1="250" y1="100" x2="236" y2="76" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round"/><circle cx="250" cy="100" r="5" fill="#2C4A40"/><text x="130" y="88" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n = 1200 rpm</text><rect x="294" y="30" width="20" height="16" rx="3" fill="#2C4A40"/><path d="M298 30 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مقاومة الحمل ⟦RL⟧ بقيم جدول ⟦(3-1)⟧: ⟦100%، 80%، 60%، 40%⟧. عند كل قيمة نسجل ⟦IL⟧ و⟦VL⟧."><rect x="40" y="138" width="280" height="116" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g fill="#E8735A" stroke="#2C4A40" stroke-width="2"><rect x="270" y="160" width="26" height="60" rx="3"/><rect x="206" y="172" width="26" height="48" rx="3"/><rect x="142" y="184" width="26" height="36" rx="3"/><rect x="78" y="196" width="26" height="24" rx="3"/></g><g font-size="12" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="283" y="240">100%</text><text x="219" y="240">80%</text><text x="155" y="240">60%</text><text x="91" y="240">40%</text></g></g><text x="184" y="284" font-size="13" fill="#2C4A40" font-weight="700">جدول</text><text x="178" y="284" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(3-1)</text></svg>`,
   cap:'«أولاً»: السرعة <span class="ltr">1200 rpm</span>، وأربع قيم للحمل.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف القيم.</b>',
   side:[
    {predict:{q:'زدت الحمل فهبطت السرعة قليلاً تحت <span class="ltr">1200 rpm</span>. ماذا تفعل قبل التسجيل؟',opts:[
     ['أسجل كما هي، فالفرق صغير',false,'الخطوة 1 تطلب تثبيت السرعة عند قيمة الجدول، وجهد مولد التوازي حساس للسرعة.'],
     ['أرفع جهد مصدر المحرك حتى تعود السرعة إلى <span class="ltr">1200 rpm</span> ثم أسجل',true,'«ثبت السرعة n عند القيمة المطلوبة في أعلى الجدول (3-1)» — أي قبل كل قراءة.'],
     ['أغيّر الحمل مرة أخرى',false,'الحمل هو المتغير الذي تدرسه؛ السرعة هي التي يجب إعادتها.']]}}
   ],
   body:[
    {book:String.raw`<p>صل التجربة كما هو مبين في مخطط التوصيل شكل (3).</p><p><b>أولاً:</b></p><ol><li>ثبت السرعة \(n\) عند القيمة المطلوبة في أعلى الجدول (3-1).</li><li>قم بتغيير قيمة الحمل \(R_L\) ومن ثم قم بتسجيل قيم جهد الحمل \(V_L\) عن طريق جهاز الفولتميتر وتيار الحمل \(I_L\) عن طريق جهاز الأميتر وذلك حسب الجدول (3-1):</li></ol>
     <p><b>جدول (3-1)</b> — <span class="ltr">n = 1200 r.p.m</span></p>`+emptyTbl('R<sub>L</sub>%',['100%','80%','60%','40%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)']),ref:'ص 18'},
    {tip:String.raw`<p>المولد يبني جهده بنفسه بعد أن يدور، فانتظر حتى يستقر الفولتميتر قبل أول قراءة. إذا بقي الجهد صغيراً جداً فالمولد «لم يبنِ» — راجع شروط البناء في المحطة الأولى، وأخبر المدرب.</p>`,title:'قبل أول قراءة'}
   ]},

  {st:6,short:'ثانياً: 1500 rpm',title:'خطوات التجربة — ثانياً، وجدول <span class="ltr">(3-2)</span>',ref:'ص 18',
   q:'رفعنا السرعة من 1200 إلى 1500… فهل يرتفع الجهد بالنسبة نفسها فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مثبتة عند 1500 لفة في الدقيقة، ومقاومة الحمل 100 و80 و60 و40 بالمئة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="السرعة ثابتة لجدول ⟦(3-2)⟧: ⟦n = 1500 rpm⟧."><rect x="40" y="40" width="280" height="80" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M220 100 a30 30 0 0 1 60 0" fill="none" stroke="#2C4A40" stroke-width="3.5"/><line x1="250" y1="100" x2="266" y2="76" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><circle cx="250" cy="100" r="5" fill="#2C4A40"/><text x="130" y="88" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n = 1500 rpm</text><rect x="294" y="30" width="20" height="16" rx="3" fill="#2C4A40"/><path d="M298 30 v-5 a6 6 0 0 1 12 0 v5" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مقاومة الحمل ⟦RL⟧ بقيم جدول ⟦(3-2)⟧: ⟦100%، 80%، 60%، 40%⟧ — القيم نفسها لتقارن بين السرعتين."><rect x="40" y="138" width="280" height="116" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"><rect x="270" y="160" width="26" height="60" rx="3"/><rect x="206" y="172" width="26" height="48" rx="3"/><rect x="142" y="184" width="26" height="36" rx="3"/><rect x="78" y="196" width="26" height="24" rx="3"/></g><g font-size="12" fill="#2C4A40" font-family="var(--mono)" text-anchor="middle"><text x="283" y="240">100%</text><text x="219" y="240">80%</text><text x="155" y="240">60%</text><text x="91" y="240">40%</text></g></g><text x="184" y="284" font-size="13" fill="#2C4A40" font-weight="700">جدول</text><text x="178" y="284" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">(3-2)</text></svg>`,
   cap:'«ثانياً»: السرعة <span class="ltr">1500 rpm</span>، والحمل بالقيم نفسها.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف القيم.</b>',
   side:[
    {predict:{q:'عند الحمل نفسه، كيف يكون الجهد عند <span class="ltr">1500 rpm</span> مقارنة بـ <span class="ltr">1200 rpm</span>؟',opts:[
     ['أعلى بنسبة السرعة فقط (×1.25)',false,'في مولد التوازي تيار المجال نفسه يزيد مع الجهد، فيزيد الفيض أيضاً.'],
     ['أعلى بأكثر من نسبة السرعة',true,'السرعة الأعلى ترفع الجهد، والجهد الأعلى يرفع \\(I_f=V_L\\div R_f\\) فيقوى الفيض، فيرتفع الجهد أكثر.'],
     ['أقل، لأن الحمل يأخذ تياراً أكبر',false,'الحمل الأكبر يأتي من الجهد الأعلى، لكن الجهد نفسه أعلى عند السرعة الأعلى.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ثانياً:</b></p><ol><li>ثبت السرعة \(N\) عند القيمة المطلوبة في أعلى الجدول (3-2).</li><li>قم بتغيير قيمة الحمل \(R_L\) ومن ثم قم بتسجيل قيم جهد الحمل \(V_L\) عن طريق جهاز الفولتميتر وتيار الحمل \(I_L\) عن طريق جهاز الأميتر وذلك حسب الجدول (3-2):</li></ol>
     <p><b>جدول (3-2)</b> — <span class="ltr">n = 1500 r.p.m</span></p>`+emptyTbl('R<sub>L</sub>%',['100%','80%','60%','40%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)']),ref:'ص 18'},
    {tip:String.raw`<p>الكتاب يكتب السرعة هنا \(N\) وفي «أولاً» \(n\)؛ المقصود الشيء نفسه: سرعة دوران المولد.</p>`}
   ]},

  {st:7,short:'المنحنى',title:'منحنى العلاقة بين جهد الحمل وتيار الحمل',ref:'ص 19',
   q:'منحنيان على شبكة واحدة… فأيهما فوق الآخر، وأيهما يهبط أسرع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكل توضيحي: منحنيا الخواص الخارجية لمولد التوازي عند 1200 و1500 لفة في الدقيقة على الشبكة نفسها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="62" y="56" width="262" height="200" rx="6" fill="#FBF6EE"/><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="62" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,54 65,64 75,64" fill="#2C4A40"/><text x="84" y="68" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (V)</tspan></text><text x="318" y="282" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (A)</tspan></text><text x="70" y="268" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">0</text><g data-tip="المنحنى عند ⟦1500 rpm⟧: أعلى، ويهبط مع الحمل ثم يزداد هبوطه."><path d="M70.0 95.2 L102.0 99.1 L134.0 105.1 L166.0 113.1 L198.0 123.1 L230.0 135.2 L262.0 149.3 L294.0 165.5 L310.0 174.4" fill="none" stroke="transparent" stroke-width="22"/><path d="M70.0 95.2 L102.0 99.1 L134.0 105.1 L166.0 113.1 L198.0 123.1 L230.0 135.2 L262.0 149.3 L294.0 165.5 L310.0 174.4" fill="none" stroke="#E8735A" stroke-width="3.5"/></g><g data-tip="المنحنى عند ⟦1200 rpm⟧: أقل بكثير، ويهبط أسرع."><path d="M70.0 138.4 L102.0 143.6 L134.0 151.5 L166.0 162.0 L198.0 175.3 L230.0 191.2 L262.0 209.8" fill="none" stroke="transparent" stroke-width="22"/><path d="M70.0 138.4 L102.0 143.6 L134.0 151.5 L166.0 162.0 L198.0 175.3 L230.0 191.2 L262.0 209.8" fill="none" stroke="#4FB3A9" stroke-width="3.5"/></g><text x="290" y="156" text-anchor="middle" font-size="12" fill="#C2492F" font-weight="700" font-family="var(--mono)">1500</text><text x="236" y="216" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" font-family="var(--mono)">1200</text></svg>`,
   cap:'الكتاب يعطي شبكة واحدة فارغة؛ شكل المنحنيين هنا <b>توضيحي</b> بلا أرقام.<br><b>مرّر المؤشر على كل منحنى (أو المسه في الجوال) لتعرف سرعته.</b>',
   side:[
    {predict:{q:'لماذا يهبط جهد مولد التوازي مع الحمل أكثر من المولد منفصل التغذية؟ (السؤال v)',opts:[
     ['لأن مقاومة منتجه أكبر',false,'قد تكون الآلة نفسها؛ الفرق في طريقة تغذية المجال لا في المنتج.'],
     ['لأن هبوط جهد الأطراف يُنقص تيار المجال نفسه فيضعف الفيض',true,'\\(I_f=V_L\\div R_f\\): الجهد يهبط ← تيار المجال ينقص ← الفيض يضعف ← الجهد يهبط أكثر.'],
     ['لأن سرعته أقل',false,'السرعة مثبتة في كل جدول.']]}}
   ],
   body:[
    {title:'لماذا يهبط أكثر؟',widget:(el,B)=>{
      const S=['زاد الحمل','هبط V<sub>L</sub> (بسبب I<sub>a</sub>R<sub>a</sub> ورد فعل المنتج)','نقص I<sub>f</sub> = V<sub>L</sub> ÷ R<sub>f</sub>','ضعف الفيض فنقصت E','هبط V<sub>L</sub> أكثر'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «زِد الحمل» وقارن بالسلسلة نفسها في التجربة الثانية: الحلقتان الثالثة والرابعة غير موجودتين هناك.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>زِد الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>المنحنى: المحور الرأسي \(V_L\) والأفقي \(I_L\) — شبكة واحدة في الكتاب، فارسم منحنيي السرعتين عليها للمقارنة (قاعدة التقرير: المنحنيات التي تشترك في المتغير الأصلي على اللوحة نفسها). ولو زاد الحمل كثيراً لانهار جهد مولد التوازي.</p>`}
   ]},

  {st:8,short:'المطلوب',title:'المطلوب',ref:'ص 19',
   q:'كيف تحسب تيار المجال الذي يعطي الجهد المقنن، والمخطط ليس فيه أميتر مجال؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف المجال على الأطراف: تيار المجال يساوي جهد الأطراف مقسوماً على مقاومة المجال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="ملف المجال: مقاومته ⟦Rf⟧، والجهد عليه هو جهد الأطراف ⟦Vf = VL⟧."><path d="M110 70 V110" stroke="#2C4A40" stroke-width="3"/><path d="M110 110 q-18 8 0 16 q-18 8 0 16 q-18 8 0 16 q-18 8 0 16 q-18 8 0 16" fill="none" stroke="#E8735A" stroke-width="4.5"/><path d="M110 190 V230" stroke="#2C4A40" stroke-width="3"/><text x="70" y="156" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="10" dy="4">f</tspan></text></g><g data-tip="جهد الأطراف ⟦VL⟧: يقرؤه الفولتميتر، وهو نفسه الجهد على ملف المجال."><line x1="150" y1="76" x2="150" y2="224" stroke="#4FB3A9" stroke-width="3" stroke-dasharray="6 5"/><polygon points="150,70 144,82 156,82" fill="#4FB3A9"/><text x="166" y="156" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="4">L</tspan></text></g><g data-tip="من المعادلة ⟦Vf = VL = If × Rf⟧ (ص 18): ⟦If = VL ÷ Rf⟧. ضع الجهد المقنن مكان ⟦VL⟧."><rect x="196" y="110" width="140" height="94" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="266" y="148" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="11" dy="4">f</tspan><tspan dy="-4"> = </tspan>V<tspan font-size="11" dy="4">L</tspan><tspan dy="-4"> ÷ </tspan>R<tspan font-size="11" dy="4">f</tspan></text><text x="266" y="182" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">من معادلة ص 18</text></g><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600" direction="rtl">المطلوب 2: تيار المجال للجهد المقنن</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) للمطلوب 2.<br><b>مرّر المؤشر على الملف والجهد والبطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لتحسب تيار المجال اللازم للجهد المقنن من المعادلة، ماذا تحتاج أن تعرف؟',opts:[
     ['الجهد المقنن ومقاومة ملف المجال \\(R_f\\)',true,'\\(I_f=V\\div R_f\\) من \\(V_f=V_L=I_f\\times R_f\\) (ص 18).'],
     ['تيار الحمل فقط',false,'تيار الحمل لا يدخل في المعادلة \\(V_f=I_f\\times R_f\\).'],
     ['السرعة ومقاومة الحمل',false,'السرعة تؤثر على الجهد نفسه، لكن حساب \\(I_f\\) من الجهد يحتاج \\(R_f\\) فقط.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>ارسم النتائج التي حصلت عليها (الجهد المتولد مع تيار المجال).</li><li>احسب تيار المجال اللازم لتوليد الجهد المقنن على أطراف المولد.</li><li>ناقش المنحنيات التي حصلت عليها.</li></ol>`,ref:'ص 19'},
    {watch:String.raw`<p>(1) المطلوب الأول يذكر منحنى «الجهد المتولد مع تيار المجال»، والجدولان لا يحتويان قراءات لتيار المجال؛ المرسوم فعلاً منحنى \(V_L\) مع \(I_L\). يمكن حساب \(I_f=V_L\div R_f\) و\(E=V_L+I_aR_a\) من المعادلات — يحسبهما المختبر لك تحت العدادات. (2) الكتاب لا يعطي الجهد المقنن ولا \(R_f\)؛ في المختبر قيم توضيحية يستطيع المدرب تغييرها.</p>`,fix:true},
    {tip:String.raw`<p>في المطلوب 3 قارن المنحنيين: عند <span class="ltr">1500 rpm</span> يكون الجهد أعلى بكثير منه عند <span class="ltr">1200 rpm</span>، وفي الحالتين يهبط مع الحمل أسرع من المولد منفصل التغذية في التجربة الثانية.</p>`}
   ]},

  {st:9,short:'الأسئلة',title:'الأسئلة',ref:'ص 19',
   q:'شغّلت مولد توازي جديداً فلم يظهر على أطرافه جهد… أين تبحث عن السبب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع بطاقات لشروط بناء الجهد في مولد التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="38" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">شروط بناء الجهد</text><g data-tip="مغنطة متبقية: بدونها لا يوجد جهد صغير يبدأ منه البناء. لذلك يُشغَّل المولد الجديد أول مرة بتغذية منفصلة (السؤال ii)."><rect x="188" y="52" width="140" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M234 78 h48 v22 h-14 v40 h-20 v-40 h-14 z" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="258" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مغنطة متبقية</text></g><g data-tip="اتجاه توصيل ملف المجال: إذا كان عكسياً فإن تياره يلغي المغنطة المتبقية بدل أن يقويها (السؤالان iii و iv)."><rect x="32" y="52" width="140" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 100 q8 -14 16 0 q8 -14 16 0 q8 -14 16 0" fill="none" stroke="#E8735A" stroke-width="3.5"/><path d="M70 124 H132" stroke="#2C4A40" stroke-width="3"/><polygon points="140,124 128,118 128,130" fill="#2C4A40"/><text x="102" y="154" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">اتجاه التوصيل</text></g><g data-tip="مقاومة دائرة المجال: يجب أن تكون أقل من «المقاومة الحرجة»، ودائرة المجال غير مفتوحة (السؤال i)."><rect x="188" y="176" width="140" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="238" y="196" width="40" height="44" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="258" y="278" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مقاومة المجال</text></g><g data-tip="السرعة: يجب أن تكون أعلى من «السرعة الحرجة»."><rect x="32" y="176" width="140" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M76 244 a26 26 0 0 1 52 0" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="102" y1="244" x2="118" y2="224" stroke="#4FB3A9" stroke-width="3.5"/><circle cx="102" cy="244" r="4" fill="#2C4A40"/><text x="102" y="278" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">السرعة</text></g></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) يجمع أسباب عدم بناء الجهد (السؤال iv).<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف الشرط.</b>',
   side:[
    {predict:{q:'فتحت دائرة المجال والمولد يدور. هل يظهر جهد على أطرافه؟ (السؤال i)',opts:[
     ['نعم، جهده المقنن كاملاً',false,'بلا تيار مجال لا يبنى الفيض، فلا يصل الجهد إلى قيمته المعتادة.'],
     ['لا، صفر تماماً',false,'تبقى المغنطة المتبقية في الأقطاب، فيتولد جهد صغير.'],
     ['جهد صغير جداً فقط (من المغنطة المتبقية)',true,'تيار المجال صفر، فلا يبقى إلا جهد المغنطة المتبقية — جرّب «افتح دائرة المجال» في المختبر.']]}}
   ],
   body:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ul style="list-style:none;padding-inline-start:0">
     <li>i. هل ينتج مولد التوازي جهداً على أطرافه عند فتح دائرة المجال؟</li>
     <li>ii. لماذا يتم تشغيل مولد التوازي لأول مرة عند شرائه من المصنع كمولد تغذية منفصلة؟</li>
     <li>iii. ما هي العوامل التي تتحكم في قطبية المولد؟</li>
     <li>iv. ما هي الأسباب التي تمنع عملية بناء الجهد في مولد التوازي؟</li>
     <li>v. لماذا يهبط جهد مولد التوازي أكثر من جهد نفس المولد إذا تمت تغذية دائرة المجال بشكل مستقل؟</li></ul>`,ref:'ص 19'},
    {predict:{q:'لماذا يُشغَّل مولد التوازي الجديد أول مرة كمولد تغذية منفصلة؟ (السؤال ii)',opts:[
     ['لأن تغذية المجال من مصدر خارجي تمغنط الأقطاب وتترك فيها مغنطة متبقية في الاتجاه الصحيح',true,'المولد الجديد قد لا تكون فيه مغنطة متبقية كافية (أو تكون في الاتجاه غير المناسب)، فلا يبني جهده وحده.'],
     ['لأن المولد الجديد لا يتحمل التغذية الذاتية',false,'المولد مصمم للعمل توازي؛ المشكلة في المغنطة المتبقية لا في التحمل.'],
     ['لتوفير الطاقة في التشغيل الأول',false,'السبب مغناطيسي لا اقتصادي.']]}},
    {tip:String.raw`<p>لكل سؤال إجابة مقترحة (ليست من الكتاب) في الأسلوب الرسمي لهذا الدرس. وفي تبويب «المختبر» زران لفتح دائرة المجال وعكس توصيل ملفه، لترى بنفسك متى لا يبني الجهد.</p>`}
   ]},

  {recap:[
   'مولد التوازي: ملف مجاله على أطراف منتجه، فيبني جهده بنفسه بدءاً من المغنطة المتبقية (الغرض ص 17، الشكل <span class="ltr">(3)</span>).',
   'معادلات التجربة: \\(E=V_L+I_a\\times R_a\\) و\\(V_f=V_L=I_f\\times R_f=I_L\\times R_L\\) (ص 18).',
   'نسجّل \\(I_L\\) و\\(V_L\\) عند <span class="ltr">R<sub>L</sub></span> = <span class="ltr">100%</span>…<span class="ltr">40%</span> مرة عند <span class="ltr">1200 rpm</span> (جدول 3-1) ومرة عند <span class="ltr">1500 rpm</span> (جدول 3-2)، والمنحنيان على شبكة واحدة (ص 18–19).',
   'جهده يهبط مع الحمل أكثر من المنفصل التغذية لأن \\(I_f=V_L\\div R_f\\) ينقص مع الجهد (السؤال v ص 19).',
   'لا يبني الجهد إذا غابت المغنطة المتبقية، أو عُكس توصيل المجال، أو فُتحت دائرة المجال أو كبرت مقاومتها، أو قلت السرعة (السؤال iv ص 19).']}
],
 theory:[
  {h:'التجربة الثالثة: خواص مولد التوازي',ref:'ص 17',html:`<p class="ltr" style="display:block;text-align:left">Characteristics of DC shunt generator</p><p><b>الغرض من التجربة:</b> الحصول على منحنى خواص اللاحمل أو الدائرة المفتوحة لمولد التيار المستمر ذي تغذية التوازي (العلاقة بين القوة الدافعة المتولدة وتيار المجال)، وكذلك خواص الحمل (العلاقة بين الجهد على أطراف المولد وتيار الحمل).</p>`},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب: كيف يبني مولد التوازي جهده؟</b>
   <ol><li>عند الدوران تولد <b>المغنطة المتبقية</b> جهداً صغيراً على الأطراف.</li><li>هذا الجهد يمرر تياراً صغيراً في ملف المجال الموصل على الأطراف.</li><li>إذا كان اتجاه هذا التيار <b>يقوي</b> المغنطة المتبقية زاد الفيض فزاد الجهد فزاد تيار المجال… حتى يستقر الجهد عند نقطة تقاطع منحنى المغنطة مع «خط مقاومة المجال» \\(V=I_fR_f\\).</li></ol>
   <b>شروط بناء الجهد:</b> وجود مغنطة متبقية، وتوصيل ملف المجال في الاتجاه الصحيح، ومقاومة دائرة المجال أقل من «المقاومة الحرجة»، وسرعة أعلى من «السرعة الحرجة». وتيار المنتج هنا يتفرع: \\(I_a=I_L+I_f\\).
   <br><b>لماذا يهبط جهده أكثر؟</b> لأن هبوط جهد الأطراف (بسبب \\(I_aR_a\\) ورد فعل المنتج) يُنقص تيار المجال نفسه \\(I_f=V_L/R_f\\)، فينقص الفيض فيهبط الجهد أكثر.`},
  VRBLOCK,
  {h:'الأجهزة المستخدمة',ref:'ص 17',html:`<ol><li>مصدر قدرة.</li><li>مولد تيار مستمر توازي.</li><li>جهاز فولتميتر.</li><li>جهاز قياس السرعة.</li><li>موحد تيار مستمر متحكم فيه.</li><li>جهاز أميتر.</li><li>حمل (مقاومة مادية متغيرة).</li></ol>`},
  {fig:'(3)',ref:'ص 17',caption:'مخطط التوصيل: جهة المحرك مطابقة للشكلين (1) و(2). جهة المولد تغذية ذاتية توازي: ملف المجال E1–E2 على أطراف المنتج مباشرة (بدون مقاومة مجال وبدون أميتر مجال)، ثم الفولتميتر V (V<sub>L</sub>)، ثم الأميتر A على التوالي (I<sub>L</sub>) ومقاومة الحمل المتغيرة R<sub>L</sub>.',draw:()=>box(benchSVG({kind:'shunt',rd:false,RLp:100}),900,1)},
  {h:'المعادلات الخاصة بالتجربة',ref:'ص 18',html:`$$E=V_L+I_a\\times R_a$$ $$V_f=V_L=I_f\\times R_f=I_L\\times R_L$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الرموز: \\(E\\) القوة الدافعة المتولدة، \\(V_L\\) جهد الأطراف (= جهد ملف المجال \\(V_f\\) لأنه موصل عليها)، \\(I_a\\) تيار المنتج، \\(R_a\\) مقاومة المنتج، \\(I_f\\) و\\(R_f\\) تيار ومقاومة ملف المجال، \\(I_L\\) و\\(R_L\\) تيار ومقاومة الحمل. والعلاقة التي لم يذكرها الكتاب: \\(I_a=I_L+I_f\\). (المعادلة الأولى تهمل هبوط الفرش.)'},
  {h:'خطوات التجربة',ref:'ص 18',html:`<p>صل التجربة كما هو مبين في مخطط التوصيل شكل (3).</p><p><b>أولاً:</b></p><ol><li>ثبت السرعة \\(n\\) عند القيمة المطلوبة في أعلى الجدول (3-1).</li><li>قم بتغيير قيمة الحمل \\(R_L\\) ومن ثم قم بتسجيل قيم جهد الحمل \\(V_L\\) عن طريق جهاز الفولتميتر وتيار الحمل \\(I_L\\) عن طريق جهاز الأميتر وذلك حسب الجدول (3-1):</li></ol>
   <p><b>جدول (3-1)</b> — <span class="ltr">n = 1200 r.p.m</span></p>${emptyTbl('R<sub>L</sub>%',['100%','80%','60%','40%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)'])}
   <p><b>ثانياً:</b></p><ol><li>ثبت السرعة \\(N\\) عند القيمة المطلوبة في أعلى الجدول (3-2).</li><li>قم بتغيير قيمة الحمل \\(R_L\\) ومن ثم قم بتسجيل قيم جهد الحمل \\(V_L\\) عن طريق جهاز الفولتميتر وتيار الحمل \\(I_L\\) عن طريق جهاز الأميتر وذلك حسب الجدول (3-2):</li></ol>
   <p><b>جدول (3-2)</b> — <span class="ltr">n = 1500 r.p.m</span></p>${emptyTbl('R<sub>L</sub>%',['100%','80%','60%','40%'],['I<sub>L</sub> (A)','V<sub>L</sub> (v)'])}
   <p class="sub">المنحنى: المحور الرأسي <span class="ltr">V<sub>L</sub> (V)</span> والأفقي <span class="ltr">I<sub>L</sub> (A)</span> — شبكة واحدة، فيُرسم منحنيا السرعتين عليها للمقارنة.</p>`},
  {h:'المطلوب',ref:'ص 19',html:Q('1.','ارسم النتائج التي حصلت عليها (الجهد المتولد مع تيار المجال).','الجدولان لا يحتويان قراءات لتيار المجال، فالمرسوم فعلاً منحنى الخواص الخارجية \\(V_L\\) مع \\(I_L\\) عند 1200 و1500 rpm على الشبكة نفسها. لرسم \\(E\\) مع \\(I_f\\) يمكن حسابهما من المعادلات: \\(I_f=V_L/R_f\\) و\\(E=V_L+I_aR_a\\) — يحسبهما المختبر لك تحت العدادات.')+
   Q('2.','احسب تيار المجال اللازم لتوليد الجهد المقنن على أطراف المولد.',`من المعادلة \\(V_L=I_f\\times R_f\\): \\(I_f=V_{rated}/R_f\\). الحقيبة لا تعطي الجهد المقنن ولا \\(R_f\\)؛ بالأرقام التوضيحية الافتراضية للمختبر (<span class="ltr">${MD.Vrat.value} V</span> و <span class="ltr">R<sub>f</sub> = ${MD.Rsh.value} Ω</span>): \\(I_f=${MD.Vrat.value}/${MD.Rsh.value}\\approx\\) <span class="ltr">${fm(MD.Vrat.value/MD.Rsh.value,3)} A</span>. (يستطيع المدرب وضع قيم آلته في لوحة «أرقام المحاكاة».)`)+
   Q('3.','ناقش المنحنيات التي حصلت عليها.','عند 1500 rpm يكون الجهد أعلى بكثير منه عند 1200 rpm (ليس بنسبة السرعة فقط، لأن تيار المجال نفسه يزيد مع الجهد). وفي الحالتين يهبط الجهد مع زيادة الحمل أسرع من المولد منفصل التغذية، ولو زاد الحمل كثيراً لانهار الجهد.')},
  {err:'<div class="fixnote">(١) قائمة الأجهزة ص 17: «مولد تيار مستمر توالي» والصحيح «توازي» (التجربة لمولد التوازي والمخطط يبين مجال توازي E1–E2)، والمحرك المُدير غير مذكور في القائمة مع أنه في المخطط. (٢) «ثانياً» الخطوة 1 ص 18: تحيل إلى «الجدول (3-1)» والصحيح الجدول (3-2) (السرعة 1500). (٣) «وذالك» ← «وذلك». (٤) الغرض والمطلوب 1 يذكران منحنى الجهد المتولد مع تيار المجال ولا توجد له قراءات في الجداول. (٥) الكتاب لا يذكر العلاقة \\(I_a=I_L+I_f\\) ولا الجهد المقنن.</div>'},
  {h:'الأسئلة',ref:'ص 19',html:`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p>`+
   Q('i.','هل ينتج مولد التوازي جهداً على أطرافه عند فتح دائرة المجال؟','جهداً صغيراً جداً فقط: الجهد الناتج عن المغنطة المتبقية، لأن تيار المجال صفر. جرّب «افتح دائرة المجال» في المختبر.')+
   Q('ii.','لماذا يتم تشغيل مولد التوازي لأول مرة عند شرائه من المصنع كمولد تغذية منفصلة؟','لأن المولد الجديد قد لا يكون في أقطابه مغنطة متبقية كافية (أو تكون في الاتجاه غير المناسب)، فلا يبني جهده. تغذية المجال من مصدر خارجي مرة أولى تمغنط الأقطاب وتترك فيها مغنطة متبقية في الاتجاه الصحيح.')+
   Q('iii.','ما هي العوامل التي تتحكم في قطبية المولد؟','اتجاه المغنطة المتبقية، واتجاه توصيل ملف المجال بالنسبة للمنتج، واتجاه الدوران.')+
   Q('iv.','ما هي الأسباب التي تمنع عملية بناء الجهد في مولد التوازي؟','عدم وجود مغنطة متبقية؛ توصيل ملف المجال عكسياً (تياره يلغي المغنطة المتبقية)؛ مقاومة دائرة المجال أكبر من المقاومة الحرجة؛ السرعة أقل من السرعة الحرجة؛ دائرة المجال مفتوحة أو سوء تلامس الفرش؛ حمل كبير جداً (مقاومة صغيرة) عند البدء. جرّب ثلاثة منها في المختبر.')+
   Q('v.','لماذا يهبط جهد مولد التوازي أكثر من جهد نفس المولد إذا تمت تغذية دائرة المجال بشكل مستقل؟','لأن مجاله موصل على الأطراف: عندما يهبط جهد الأطراف بسبب \\(I_aR_a\\) ورد فعل المنتج ينقص تيار المجال \\(I_f=V_L/R_f\\) فينقص الفيض فتنقص \\(E\\) فيهبط الجهد أكثر. وفي التغذية المستقلة يبقى تيار المجال ثابتاً.')}
 ],
 lab:(el)=>{
  const M0={n:0,nss:0,Im:0};let on=false,Vs=0,RLp='open',ang=0,G=null,sig='',Ish=0,fopen=false,frev=false;const did={};
  const ft=f=>`n=${fm(f.n,0)}، RL=${f.RLp==='open'?'∞':f.RLp+'%'}: IL=${fm(f.IL,2)} A، VL=${fm(f.VL,1)} V`;
  const T1=loadTbl(T3COLS,ft),T2=loadTbl(T3COLS,ft);
  el.innerHTML=`<div id="l4tp"></div><div class="grid dc-lab">
   <div class="panel c12"><h2>منضدة الاختبار <small>مبنية على الشكل (3) ص 17 — الدوران في الرسم مبطأ</small></h2>
    <div class="svgbox dc-wide" id="l4c" style="max-width:900px;margin-inline:auto"></div><div class="dc-row"><span id="l4chip" class="dc-chip"></span></div><div id="l4msg" class="dc-msg"></div></div>
   <div class="panel c6"><h2>المحرك المدير <small>مصدر 0-250 V DC</small></h2>${supplyHTML('l4','جهد مصدر المحرك المدير')}
    <p class="sub">السرعة المطلوبة: <span class="ltr">1200 rpm</span> لجدول (3-1) و<span class="ltr">1500 rpm</span> لجدول (3-2). يُختار الجدول تلقائياً حسب السرعة.</p></div>
   <div class="panel c6"><h2>الحمل ودائرة المجال</h2>${rlHTML('l4',T3COLS)}
    <div class="dc-sw"><button class="btn red" id="l4fo" aria-pressed="false">افتح دائرة المجال (السؤال i)</button><button class="btn red" id="l4fr" aria-pressed="false">اعكس توصيل ملف المجال (السؤال iv)</button></div></div>
   <div class="panel c12"><h2>قراءات الأجهزة</h2><div class="dc-meters" id="l4m"></div><div id="l4calc"></div>
    <div class="dc-row"><button class="btn primary" id="l4rec">سجّل القراءة</button><button class="btn" id="l4clr">امسح الجدولين</button></div><div id="l4rmsg" class="dc-msg"></div><div id="l4w" class="dc-msg"></div></div>
   <div class="panel c6"><h2>جدول (3-1) <small>${lt('n = 1200 r.p.m')}</small></h2><div id="l4t1"></div></div>
   <div class="panel c6"><h2>جدول (3-2) <small>${lt('n = 1500 r.p.m')}</small></h2><div id="l4t2"></div></div>
   <div class="panel c7"><h2>منحنى الخواص الخارجية <small>المنحنيان على الشبكة نفسها</small></h2>${ADDCOL}<div class="svgbox" id="l4p"></div><div class="dc-leg"><span><i style="background:var(--blue)"></i>1200 rpm</span><span><i style="background:var(--live)"></i>1500 rpm</span><span><i style="background:var(--muted);border-radius:2px"></i>قراءات حرة</span></div></div>
   <div class="panel c5"><h2>معامل تنظيم الجهد <small>إضافة من خارج الكتاب</small></h2><h3 class="sm">عند 1200 rpm</h3><div id="l4vr1"></div><h3 class="sm">عند 1500 rpm</h3><div id="l4vr2"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l4tp'),TPID,tpDefs(['nref','Er','E03','Fk','Ra','Vb','kar','Rsh','Tf','RLmax','Vrat','Irat','n0','Ram','I0','tau']),()=>{[T1,T2].forEach(T=>{T.data={};T.free=[]});sig='';redrawT();steps.redraw()});
  const setVs=x=>{Vs=clamp(B.round(x,1),0,250);$('#l4vs').value=Vs;$('#l4vs-v').textContent=fm(Vs,1)+' V'};
  const setRL=x=>{RLp=x;el.querySelectorAll('[data-l4rl]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l4rl===String(x))));if(x!=='open')$('#l4rl').value=x;$('#l4rl-v').textContent=x==='open'?'مفصول':x+' %'};
  setVs(0);setRL('open');
  $('#l4vs').oninput=e=>setVs(+e.target.value);$('#l4rl').oninput=e=>setRL(+e.target.value);
  el.querySelectorAll('[data-l4d]').forEach(b=>b.onclick=()=>setVs(Vs+ +b.dataset.l4d));el.querySelectorAll('[data-l4rl]').forEach(b=>b.onclick=()=>setRL(b.dataset.l4rl==='open'?'open':+b.dataset.l4rl));
  $('#l4on').onclick=()=>{if(!on&&Vs>0.05){$('#l4msg').innerHTML=recMsg(0,'<b>أرجع جهد المصدر إلى الصفر قبل التشغيل</b>: المحرك الواقف يسحب تياراً كبيراً جداً لو وُصل على جهد مرتفع مباشرة.');return}
   on=!on;$('#l4msg').innerHTML='';$('#l4on').setAttribute('aria-pressed',String(on));$('#l4on').textContent=on?'إيقاف المصدر':'تشغيل المصدر'};
  $('#l4fo').onclick=()=>{fopen=!fopen;$('#l4fo').setAttribute('aria-pressed',String(fopen));$('#l4fo').textContent=fopen?'أغلق دائرة المجال':'افتح دائرة المجال (السؤال i)'};
  $('#l4fr').onclick=()=>{frev=!frev;$('#l4fr').setAttribute('aria-pressed',String(frev));$('#l4fr').textContent=frev?'أرجع توصيل ملف المجال':'اعكس توصيل ملف المجال (السؤال iv)'};
  const RLohm=()=>RLp==='open'?Infinity:TP.v.RLmax*RLp/100;
  const curT=()=>okN(M0.n,1200)?T1:okN(M0.n,1500)?T2:null;
  const plot=()=>{const v=TP.v,p1=tblPts(T1,'IL','VL'),p2=tblPts(T2,'IL','VL'),fr=T1.free.concat(T2.free).map(f=>[f.IL,f.VL]),all=p1.concat(p2,fr);
   $('#l4p').innerHTML=plotXY({x1:nice(Math.max(v.Irat*1.1,...all.map(p=>p[0]),G?G.IL*1.05:0,0.1)),y1:nice(Math.max(v.Vrat*1.15,...all.map(p=>p[1]),G?G.VL:0,1)),xl:'IL (A)',yl:'VL (V)',cid:'dcp4',aria:'منحنى الخواص الخارجية لمولد التوازي',series:[{pts:p1,col:'--blue'},{pts:p2,col:'--live'},{pts:fr,col:'--muted',line:false,hollow:true}],live:on&&G?[G.IL,G.VL]:null})};
  const redrawT=()=>{const T=curT(),c=T3COLS.find(c=>String(c)===String(RLp));$('#l4t1').innerHTML=tableHTML(T1,T===T1&&c!=null?String(c):null);$('#l4t2').innerHTML=tableHTML(T2,T===T2&&c!=null?String(c):null);
   $('#l4vr1').innerHTML=vrHTML(T1,TP.v.Irat);$('#l4vr2').innerHTML=vrHTML(T2,TP.v.Irat);plot()};
  $('#l4rec').onclick=()=>{const m=$('#l4rmsg');if(!on||M0.n<1){m.innerHTML=recMsg(0,'المحرك متوقف: شغّل المصدر وارفع الجهد أولاً.');return}
   if(Math.abs(M0.n-M0.nss)>1||Math.abs(G.tgt-Ish)>5e-4){m.innerHTML=recMsg(0,'انتظر حتى تستقر السرعة والجهد ثم سجّل.');return}
   const r={RLp,n:Math.round(M0.n),IL:B.round(G.IL,2),VL:B.round(G.VL,1)};const T=curT(),why=[];if(!T)why.push('السرعة ليست 1200 ولا 1500 rpm (±5)');if(fopen)why.push('دائرة المجال مفتوحة');if(frev)why.push('ملف المجال معكوس');
   const c=T3COLS.find(c=>String(c)===String(RLp));if(c==null)why.push('R<sub>L</sub> ليست من قيم الجدول');
   if(!why.length){T.data[String(c)]=r;m.innerHTML=recMsg(1,`سُجّلت في جدول ${T===T1?'(3-1)':'(3-2)'} عند ${c==='open'?'«مفصول»':c+'%'}: ${lt('I<sub>L</sub> = '+fm(r.IL,2)+' A')} و ${lt('V<sub>L</sub> = '+fm(r.VL,1)+' V')}.`)}
   else{(T||(Math.abs(M0.n-1200)<Math.abs(M0.n-1500)?T1:T2)).free.push(r);m.innerHTML=recMsg(0,`سُجّلت قراءة حرة لأن: ${why.join('، ')}.`)}redrawT()};
  $('#l4clr').onclick=()=>{[T1,T2].forEach(T=>{T.data={};T.free=[]});redrawT();$('#l4rmsg').innerHTML=''};
  const res=()=>mach(TP.v).E(0,Math.max(M0.n,0));
  const steps=stepsUI($('#l4st'),[
   {t:'شغّل المصدر وهو على الصفر',x:'الحمل «مفصول». جهد المصدر على الصفر ثم «تشغيل المصدر».',done:()=>on},
   {t:'راقب بناء الجهد',get x(){return `ارفع الجهد ببطء وراقب الفولتميتر: تحت السرعة الحرجة (نحو ${lt(fm(nCrit(TP.v,TP.v.Rsh),0)+' rpm')} بهذه الأرقام) لا يظهر إلا جهد متبقٍ صغير، وفوقها «يبني» المولد جهده بنفسه.`},done:()=>on&&!fopen&&!frev&&M0.n>nCrit(TP.v,TP.v.Rsh)+50&&G&&G.VL>3*res()+5},
   {t:'جدول (3-1): اللاحمل',x:'اضبط <span class="ltr">n = 1200 rpm</span> والحمل مفصول، وانتظر استقرار الجهد ثم سجّل (عمود «مفصول» المضاف).',done:()=>!!T1.data.open},
   {t:'أكمل جدول (3-1)',x:'اختر 100% ثم 80% ثم 60% ثم 40%، وأعد ضبط السرعة إلى 1200 rpm قبل كل تسجيل.',done:()=>tblDone(T1)},
   {t:'أكمل جدول (3-2)',x:'ارفع السرعة إلى <span class="ltr">1500 rpm</span> وكرر (مفصول ثم 100% … 40%). قارن المنحنيين.',done:()=>tblDone(T2)},
   {t:'افتح دائرة المجال (السؤال i)',x:'والمولد يدور اضغط «افتح دائرة المجال»: ينهار الجهد إلى الجهد المتبقي فقط. ثم أغلقها: يعود الجهد ليبني نفسه.',done:()=>{if(fopen&&M0.n>500&&G&&Math.abs(G.VL)<res()+2)did.fo=1;return did.fo&&!fopen}},
   {t:'اعكس ملف المجال (السؤال iv)',x:'اضغط «اعكس توصيل ملف المجال»: تيار المجال يُضعف المغنطة المتبقية فلا يبني المولد جهده حتى فوق السرعة الحرجة. ثم أرجع التوصيل.',done:()=>{if(frev&&!fopen&&M0.n>nCrit(TP.v,TP.v.Rsh)+100&&G&&Math.abs(G.VL)<res()+2)did.fr=1;return did.fr&&!frev}},
   {t:'أوقف المحرك',x:'افصل الحمل وأعد جهد المصدر إلى الصفر حتى يتوقف المحرك.',done:()=>Vs===0&&M0.n<1}
  ]);
  redrawT();let pt=0;
  loopOn(el,dt=>{const v=TP.v;
   G=armSolve(v,{n:M0.n,Ish,sig:frev!==chF('frev')?-1:1,RL:RLohm()});
   const tgt=fopen?0:G.Va/Math.max(v.Rsh,1);G.tgt=tgt;Ish+=(tgt-Ish)*(1-Math.exp(-dt/Math.max(v.Tf,0.01)));
   motorStep(M0,v,dt,{on,Vs,Pg:G.E*G.Ia});
   ang=(ang+M0.n/60*360*dt/25)%360;
   const nc=nCrit(v,v.Rsh);
   const sg=[on,fm(Vs,1),Math.round(M0.n),RLp,fm(G.VL,1),fm(G.IL,2),fopen,frev].join('|');
   if(sg!==sig){sig=sg;$('#l4c').innerHTML=benchSVG({kind:'shunt',on,Vs,ang,If:Ish,E:G.E,VL:G.VL,IL:G.IL,RLp:RLp==='open'?null:RLp,n:M0.n,fopen,frev});
    $('#l4m').innerHTML=meter('السرعة n',fm(Math.round(M0.n),0)+' rpm')+meter('V<sub>L</sub> (V)',sgn(G.VL,1)+' V')+meter('I<sub>L</sub> (A)',fm(G.IL,2)+' A')+meter('R<sub>L</sub>',RLp==='open'?'∞':fm(RLohm(),1)+' Ω');
    const If=G.VL/Math.max(v.Rsh,1),Ia=G.IL+If;
    $('#l4calc').innerHTML=`<div class="facts"><div class="fact"><span>I<sub>f</sub> = V<sub>L</sub> / R<sub>f</sub> (محسوب)</span><b>${fm(fopen?0:If,3)} A</b></div><div class="fact"><span>I<sub>a</sub> = I<sub>L</sub> + I<sub>f</sub></span><b>${fm(fopen?G.IL:Ia,2)} A</b></div><div class="fact"><span>E = V<sub>L</sub> + I<sub>a</sub>R<sub>a</sub> (معادلة ص 18)</span><b>${sgn(G.VL+(fopen?G.IL:Ia)*v.Ra,1)} V</b></div><div class="fact"><span>السرعة الحرجة (توضيح)</span><b>${fm(nc,0)} rpm</b></div></div><p class="sub">الشكل (3) بلا أميتر مجال، فتيار المجال يُحسب من معادلة الكتاب \\(V_L=I_fR_f\\) بقيمة \\(R_f\\) التوضيحية <span class="ltr">${fm(v.Rsh,0)} Ω</span>.</p>`;B.math($('#l4calc'));
    const ch=$('#l4chip');const r0=mach(v).E(0,M0.n);
    if(!on||M0.n<5){ch.className='dc-chip';ch.textContent='المولد متوقف'}
    else if(fopen){ch.className='dc-chip bad';ch.textContent='دائرة المجال مفتوحة: جهد متبقٍ فقط'}
    else if(frev&&Math.abs(G.VL)<r0+2){ch.className='dc-chip bad';ch.textContent='ملف المجال معكوس: تياره يلغي المغنطة المتبقية فلا يبني الجهد'}
    else if(M0.n<nc&&G.VL<3*r0+5){ch.className='dc-chip warn';ch.textContent='السرعة أقل من الحرجة: لا يبني الجهد'}
    else if(Math.abs(tgt-Ish)>2e-3){ch.className='dc-chip warn';ch.textContent='الجهد يتغير (يبني أو يهبط)…'}
    else{ch.className='dc-chip ok';ch.textContent='الجهد مستقر'}
    $('#l4w').innerHTML=warnI(G.IL,v.Irat);
    const T=curT(),c=T3COLS.find(c=>String(c)===String(RLp));['#l4t1','#l4t2'].forEach((id,j)=>{el.querySelectorAll(`${id} th,${id} td`).forEach(x=>x.classList.remove('cur'));if(T===(j?T2:T1)&&c!=null){const i=T3COLS.indexOf(c)+2;el.querySelectorAll(`${id} tr > :nth-child(${i})`).forEach(x=>x.classList.add('cur'))}})}
   else{const g=el.querySelectorAll('#dcr1,#dcr2');if(g[0])g[0].setAttribute('transform',`rotate(${fx(ang)} 230 166)`);if(g[1])g[1].setAttribute('transform',`rotate(${fx(ang)} 580 166)`)}
   pt+=dt;if(pt>0.25){pt=0;plot()}
   steps.check()});
 },
 quiz:[
  {q:'في مولد التوازي يوصل ملف المجال:',o:['على التوالي مع الحمل','على أطراف المنتج نفسه','من مصدر مستقل','لا يوجد ملف مجال'],c:1,e:'الشكل (3): تغذية ذاتية.'},
  {q:'من أين يبدأ مولد التوازي بناء جهده؟',o:['من المصدر الخارجي','من المغنطة المتبقية في الأقطاب','من الحمل','من الفولتميتر'],c:1,e:'توضيح الدرس.'},
  {q:'في مولد التوازي تيار المنتج:',o:['\\(I_a=I_L\\)','\\(I_a=I_L+I_f\\)','\\(I_a=I_f\\)','\\(I_a=I_L-I_f\\)'],c:1,e:'التيار يتفرع إلى الحمل وملف المجال.'},
  {q:'حسب الكتاب \\(E=\\)',o:['\\(V_L-I_aR_a\\)','\\(V_L+I_a R_a\\)','\\(I_fR_f\\)','\\(V_L/R_L\\)'],c:1,e:'ص 18.'},
  {q:'ماذا يحدث إذا فُتحت دائرة مجال مولد التوازي وهو يدور؟',o:['يرتفع الجهد','يبقى جهد صغير جداً من المغنطة المتبقية','يبقى الجهد كما هو','ينعكس الجهد'],c:1,e:'السؤال (i).'},
  {q:'أي مما يلي يمنع بناء الجهد؟',o:['سرعة أعلى من الحرجة','توصيل ملف المجال عكسياً','مقاومة مجال صغيرة','وجود مغنطة متبقية'],c:1,e:'السؤال (iv).'},
  {q:'لماذا يهبط جهد مولد التوازي مع الحمل أكثر من منفصل التغذية؟',o:['لأن سرعته أكبر','لأن هبوط جهد الأطراف يُنقص تيار المجال نفسه','لأن مقاومة المنتج أصغر','لا يهبط أكثر'],c:1,e:'السؤال (v).'},
  {q:'لماذا يُشغل مولد التوازي الجديد أول مرة بتغذية منفصلة؟',o:['لتوفير الطاقة','ليكتسب مغنطة متبقية في الاتجاه الصحيح','لاختبار العزل','لأنه لا يدور وحده'],c:1,e:'السؤال (ii).'}
 ]
});

/* ======================================================================
   Lesson 5 — التجربة الرابعة: منحنى خواص الحمل للمولد المركب (ص 20–21)
   ====================================================================== */
const T4COLS=[0,1,2,3,4,5,6,7,8,9];
const emptyT4=n=>`<p><b>جدول (4-${n})</b></p><div class="dc-tbl"><table class="tt"><tbody><tr><td>I<sub>L</sub> (A)</td><td>0</td>${'<td></td>'.repeat(9)}</tr><tr><td>V<sub>L</sub> (v)</td>${'<td></td>'.repeat(10)}</tr></tbody></table></div>`;
B.lesson({
 id:'u1-l5',unit:1,order:5,pages:'20–21',
 title:'التجربة الرابعة: منحنى خواص الحمل للمولد المركب',
 summary:'مولد مركب قصير التوازي: ملف توازي F1–F2 مع مقاومته Rfg، وملف توالي D1–D2 يمر فيه تيار الحمل. نحمّله بمصابيح واحداً بعد واحد ونرسم منحنى جهد الحمل مع تيار الحمل، ثم نعكس D1–D2 ونكرر: مرة تراكمي (الجهد شبه ثابت) ومرة تفاضلي (الجهد ينهار).',
 stations:[
  {intro:true},

  {st:1,short:'الغرض من التجربة',title:'الغرض من التجربة الرابعة: منحنى خواص الحمل للمولد المركب',ref:'ص 20',
   q:'مولد له ملفا مجال على كل قطب… فماذا يضيف الملف الثاني؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قطب مغناطيسي عليه ملفان: ملف توازي بلفات كثيرة رفيعة، وملف توالي بلفات قليلة سميكة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="قطب المولد: قطعة حديد يُلف حولها ملفا المجال، وفيضهما معاً هو فيض القطب."><path d="M130 50 H230 V90 H212 V230 H250 V262 H110 V230 H148 V90 H130 Z" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="ملف التوازي ⟦F1–F2⟧: لفات كثيرة من سلك رفيع، موصل على أطراف المنتج (مع مقاومة ضبط ⟦Rfg⟧)، ويصنع معظم الفيض."><rect x="138" y="96" width="84" height="64" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#FBF6EE" stroke-width="1.2"><line x1="142" y1="104" x2="218" y2="104"/><line x1="142" y1="112" x2="218" y2="112"/><line x1="142" y1="120" x2="218" y2="120"/><line x1="142" y1="128" x2="218" y2="128"/><line x1="142" y1="136" x2="218" y2="136"/><line x1="142" y1="144" x2="218" y2="144"/><line x1="142" y1="152" x2="218" y2="152"/></g></g><g data-tip="ملف التوالي ⟦D1–D2⟧: لفات قليلة من سلك سميك يمر فيه تيار الحمل ⟦IL⟧، ففيضه يكبر مع الحمل."><rect x="138" y="168" width="84" height="54" rx="8" fill="#2C4A40"/><g stroke="#F2C14E" stroke-width="5"><line x1="144" y1="182" x2="216" y2="182"/><line x1="144" y1="196" x2="216" y2="196"/><line x1="144" y1="210" x2="216" y2="210"/></g></g><text x="292" y="132" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ملف التوازي</text><text x="292" y="150" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">F1–F2</text><text x="68" y="196" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ملف التوالي</text><text x="68" y="214" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">D1–D2</text><line x1="226" y1="128" x2="256" y2="128" stroke="#2C4A40" stroke-width="2"/><line x1="134" y1="196" x2="104" y2="196" stroke="#2C4A40" stroke-width="2"/><text x="180" y="298" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ملفان على القطب نفسه</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لقطب في المولد المركب.<br><b>مرّر المؤشر على القطب والملفين (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'الغرض يقول «المولد المركب بأنواعه». ما الذي يصنع الفرق بين نوعيه في هذه التجربة؟',opts:[
     ['سرعة الدوران',false,'السرعة تُضبط عند القيمة نفسها (السرعة المقننة) في الحالتين.'],
     ['اتجاه توصيل ملف التوالي D1–D2',true,'الخطوات تطلب بعد الجدول الأول: «اعكس أطراف ملفات التوالي للمولد (D1-D2)» ثم إعادة التجربة وتحديد نوع المولد في الحالتين (ص 21).'],
     ['عدد المصابيح',false,'المصابيح هي الحمل الذي نغيّره في كل حالة، لا ما يحدد النوع.']]}}
   ],
   body:[
    {book:String.raw`<p class="ltr" style="display:block;text-align:left">Load characteristics of compound generator</p><p><b>الغرض من التجربة:</b> رسم منحنى الخواص الخارجية للمولد المركب بأنواعه وهو العلاقة بين تيار الحمل وجهد الحمل عند ثبات سرعة الدوران، وكذلك حساب معامل تنظيم الجهد.</p>`,ref:'ص 20'},
    {tip:String.raw`<ul><li>إذا كان فيض ملف التوالي <b>يساعد</b> فيض التوازي: <b>مركب تراكمي</b> — زيادة الحمل تزيد الفيض فتعوض الهبوط، فيبقى الجهد شبه ثابت (أو يرتفع قليلاً إذا كان التعويض زائداً).</li><li>إذا كان فيضه <b>يعاكس</b> فيض التوازي: <b>مركب تفاضلي</b> — زيادة الحمل تُضعف الفيض فيهبط الجهد بسرعة.</li></ul><p>الكتاب لا يسمي النوعين؛ هذان اسماهما في دراستك النظرية.</p>`,title:'نوعا المولد المركب'},
    {add:String.raw`<p>القانون المعتاد لمعامل تنظيم الجهد (لا تعطيه الحقيبة):</p><div class="eq">$$VR\%=\frac{V_{NL}-V_{FL}}{V_{FL}}\times 100$$</div><p>\(V_{NL}\) الجهد بلا حمل (المفتاح S مفتوح)، و\(V_{FL}\) الجهد عند تيار الحمل المقنن.</p>`,title:'معامل تنظيم الجهد'}
   ]},

  {st:2,short:'دائرة التوصيل',title:'مخطط التوصيل — الشكل <span class="ltr">(4)</span>',ref:'ص 20',
   q:'هذا المخطط مختلف عن الأشكال الثلاثة السابقة… فما الأجزاء الجديدة فيه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مبسط عن الشكل 4: المحرك بمقاومة بدء ومقاومة مجال يدير المولد المركب، وملف التوازي مع مقاومته على المنتج، ثم ملف التوالي، ثم المفتاح S والمصابيح" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="خطا المصدر المستمر ⟦+⟧ و⟦−⟧ والمفتاح ثنائي القطب: يفصل الخطين معاً عن المحرك."><line x1="20" y1="34" x2="140" y2="34" stroke="#2C4A40" stroke-width="3"/><line x1="20" y1="48" x2="140" y2="48" stroke="#2C4A40" stroke-width="3"/><rect x="40" y="56" width="40" height="24" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M48 76 L58 62 M64 76 L74 62" stroke="#2C4A40" stroke-width="2.5"/></g><path d="M60 80 V88 H44 V96 M60 88 H98 V96 M44 114 V140 L54 156 M98 114 V140 L88 156" fill="none" stroke="#2C4A40" stroke-width="2"/><g data-tip="مقاومة البدء ⟦Rst⟧: على التوالي مع منتج المحرك، تحد من تيار البدء ثم تُخرج تدريجياً."><rect x="22" y="96" width="44" height="18" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="44" y="130" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Rst</text></g><g data-tip="مقاومة تنظيم مجال المحرك ⟦Rfm⟧: بها تُضبط سرعة المحرك أولاً حتى تصل إلى السرعة المقننة للمولد."><rect x="76" y="96" width="44" height="18" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="98" y="130" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Rfm</text></g><g data-tip="المحرك ⟦M⟧ (توازي): يدير المولد المركب، ومعه أميترا تيار المنتج ⟦Iam⟧ والمجال ⟦Ifm⟧."><circle cx="70" cy="176" r="26" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="70" y="184" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">M</text></g><g data-tip="العمود ومقياس السرعة: ينقل الحركة إلى المولد ويقرأ سرعته."><rect x="96" y="172" width="44" height="8" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="المولد المركب ⟦G⟧: منتجه ⟦B1–B2⟧."><circle cx="166" cy="176" r="26" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="166" y="184" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)">G</text></g><path d="M166 150 V70 H208 M166 202 V280 H336" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="ملف التوازي ⟦F1–F2⟧ مع مقاومة مجال المولد ⟦Rfg⟧ وأميتره ⟦Ifg⟧، على أطراف المنتج مباشرة قبل ملف التوالي (مركب قصير التوازي)."><path d="M196 70 V120" stroke="#E8735A" stroke-width="2.5"/><path d="M196 120 q-12 6 0 12 q-12 6 0 12 q-12 6 0 12 q-12 6 0 12" fill="none" stroke="#E8735A" stroke-width="3.5"/><rect x="188" y="176" width="16" height="44" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M196 168 V176 M196 220 V280" stroke="#E8735A" stroke-width="2.5"/><text x="216" y="146" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">F1–F2</text><text x="212" y="204" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Rfg</text></g><circle cx="196" cy="70" r="3.5" fill="#2C4A40"/><circle cx="196" cy="280" r="3.5" fill="#2C4A40"/><g data-tip="ملف التوالي ⟦D1–D2⟧: يمر فيه تيار الحمل كله. عكس طرفيه يغيّر نوع المولد المركب."><path d="M208 70 q6 -12 12 0 q6 -12 12 0 q6 -12 12 0" fill="none" stroke="#2C4A40" stroke-width="5"/><text x="226" y="94" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)">D1–D2</text></g><path d="M244 70 H262" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="الفولتميتر ⟦VL⟧: على أطراف الخرج بعد ملف التوالي."><path d="M256 70 V150 M256 186 V280" stroke="#4FB3A9" stroke-width="2.5"/><circle cx="256" cy="168" r="15" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="2.5"/><text x="256" y="173" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)">V</text></g><circle cx="256" cy="70" r="3.5" fill="#2C4A40"/><circle cx="256" cy="280" r="3.5" fill="#2C4A40"/><g data-tip="المفتاح ⟦S⟧: مفتوح عند ضبط السرعة والجهد (المولد بدون حمل)، ثم يُغلق لتحميل المولد."><circle cx="266" cy="70" r="3" fill="#2C4A40"/><circle cx="290" cy="70" r="3" fill="#2C4A40"/><line x1="266" y1="70" x2="288" y2="56" stroke="#2C4A40" stroke-width="3"/><text x="278" y="48" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><path d="M290 70 H336 V280" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="الحمل: مصابيح على التوازي تُدخل واحداً تلو الآخر، ومعها أميتر تيار الحمل ⟦IL⟧. (الكتاب يرسم ثلاثة مصابيح.)"><path d="M300 70 V110 M318 70 V110 M300 130 V280 M318 130 V280" stroke="#2C4A40" stroke-width="2"/><circle cx="300" cy="120" r="9" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="318" cy="120" r="9" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="336" cy="120" r="9" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M294 114 l12 12 M306 114 l-12 12 M312 114 l12 12 M324 114 l-12 12 M330 114 l12 12 M342 114 l-12 12" stroke="#2C4A40" stroke-width="1.5"/></g></svg>`,
   cap:'مبسّط عن الشكل <span class="ltr">(4)</span>: الأصفر مقاومات الضبط، والملف البرتقالي ملف التوازي، والداكن السميك ملف التوالي.<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف اسمه ودوره.</b>',
   side:[
    {predict:{q:'ملف التوازي F1–F2 موصل على المنتج مباشرة، وملف التوالي بعده. أي تيار يمر في ملف التوالي؟',opts:[
     ['تيار المجال فقط',false,'تيار المجال يتفرع إلى ملف التوازي قبل ملف التوالي.'],
     ['تيار الحمل',true,'ملف التوالي على خط الخرج بعد نقطة التفرع، فيمر فيه تيار الحمل الذاهب إلى المصابيح.'],
     ['لا يمر فيه تيار إلا عند البدء',false,'يمر فيه تيار الحمل طوال التحميل، ويكبر مع إدخال المصابيح.']]}}
   ],
   body:[
    {book:String.raw`<p><b>مخطط التوصيل — الشكل <span class="ltr">(4)</span></b></p>`+box(fig4SVG({rd:false,RstIn:true,lamps:9}),980,1),ref:'ص 20'},
    {watch:String.raw`<p>قائمة الأجهزة من مخطط التوصيل: مصدر تيار مستمر (خطان + و −)، مفتاح ثنائي القطب، محرك توازي <span class="ltr">M</span> مع مقاومة بدء <span class="ltr">R<sub>st</sub></span> ومقاومة تنظيم مجال <span class="ltr">R<sub>fm</sub></span>، أميترا <span class="ltr">I<sub>fm</sub></span> و<span class="ltr">I<sub>am</sub></span>، مقياس سرعة، مولد مركب <span class="ltr">G</span> مع مقاومة مجال <span class="ltr">R<sub>fg</sub></span> وأميتر <span class="ltr">I<sub>fg</sub></span>، فولتميتر <span class="ltr">V<sub>L</sub></span>، مفتاح <span class="ltr">S</span>، حمل من مصابيح على التوازي، أميتر <span class="ltr">I<sub>L</sub></span>.</p>`},
    {watch:String.raw`<p>لم تذكر الحقيبة قائمة أجهزة لهذه التجربة؛ القائمة أعلاه استخرجناها من مخطط التوصيل. والكتاب يرسم ثلاثة مصابيح؛ في الرسم المعاد تسعة لأن الجدول فيه تسع قراءات بعد قراءة الصفر.</p>`,fix:true},
    {tip:String.raw`<p>مقاومة البدء \(R_{st}\) تكون «داخلة» عند تشغيل المحرك لتحد من تيار البدء (المحرك الواقف لا يولد قوة دافعة عكسية)، ثم تُخرج تدريجياً بعد أن يدور. وزيادة \(R_{fm}\) تُضعف مجال المحرك فتزيد سرعته. وزيادة \(R_{fg}\) تُنقص تيار مجال المولد فينقص جهده. توصيل ملف التوازي على المنتج مباشرة قبل ملف التوالي يسمى <b>مركب قصير التوازي</b>.</p>`,title:'ثلاث مقاومات ضبط'}
   ]},

  {st:3,short:'الخطوات وجدول (4-1)',title:'خطوات التجربة وجدول <span class="ltr">(4-1)</span>',ref:'ص 20–21',
   q:'لماذا نضبط الجهد والمفتاح S مفتوح، ثم نُدخل المصابيح واحداً بعد واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع خطوات: ضبط السرعة، ضبط الجهد والمفتاح مفتوح، إغلاق المفتاح وإدخال المصابيح، تسجيل القراءات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="ضبط السرعة: يدار المحرك حتى السرعة المقننة للمولد، بمقاومة ⟦Rfm⟧ أولاً أو بجهد وحدة القدرة إن كان متغيراً."><rect x="196" y="44" width="136" height="108" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="264" cy="70" r="14" fill="#2C4A40"/><text x="264" y="76" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">1</text><text x="264" y="112" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">السرعة المقننة</text><text x="264" y="132" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">Rfm</text></g><g data-tip="ضبط الجهد: والمفتاح ⟦S⟧ مفتوح (بدون حمل) يُضبط الجهد على أطراف المولد بالمقاومة ⟦Rfg⟧ حتى يساوي الجهد المقنن."><rect x="28" y="44" width="136" height="108" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="96" cy="70" r="14" fill="#2C4A40"/><text x="96" y="76" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">2</text><text x="96" y="112" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">الجهد المقنن</text><text x="96" y="132" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">Rfg · S</text></g><g data-tip="التحميل: يُغلق ⟦S⟧ وتُدخل اللمبات واحدة تلو الأخرى، مع إعادة ضبط السرعة عند نفس قيمتها."><rect x="196" y="168" width="136" height="108" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="264" cy="194" r="14" fill="#2C4A40"/><text x="264" y="200" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">3</text><g fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"><circle cx="240" cy="236" r="8"/><circle cx="264" cy="236" r="8"/><circle cx="288" cy="236" r="8" fill="#FBF6EE"/></g><text x="264" y="266" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">لمبة بعد لمبة</text></g><g data-tip="التسجيل: تيار الحمل وجهده عند كل تغيير في الحمل في جدول ⟦(4-1)⟧، حتى يصل تيار الحمل إلى أعلى من المقنن بنحو ⟦25%⟧."><rect x="28" y="168" width="136" height="108" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="96" cy="194" r="14" fill="#2C4A40"/><text x="96" y="200" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700">4</text><g stroke="#2C4A40" stroke-width="1.5" fill="none"><rect x="52" y="216" width="88" height="28"/><line x1="52" y1="230" x2="140" y2="230"/><line x1="74" y1="216" x2="74" y2="244"/><line x1="96" y1="216" x2="96" y2="244"/><line x1="118" y1="216" x2="118" y2="244"/></g><text x="96" y="266" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">حتى ~125% من المقنن</text></g></svg>`,
   cap:'الخطوات بالترتيب (اقرأ من اليمين): السرعة، ثم الجهد، ثم الحمل، ثم التسجيل.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ تفصيلها.</b>',
   side:[
    {predict:{q:'لماذا يُضبط الجهد المقنن والمفتاح S مفتوح؟',opts:[
     ['لأن الجهد لا يظهر إلا والمفتاح مفتوح',false,'الجهد يظهر في الحالتين، لكن قيمته تتغير مع الحمل.'],
     ['حتى تكون أول قراءة (I<sub>L</sub> = 0) هي جهد اللاحمل المضبوط، ونقيس بعدها أثر الحمل وحده',true,'الكتاب: «مع بقاء المفتاح S مفتوحاً، أي المولد بدون حمل»، وأول خلية في جدول (4-1) تيار حملها 0.'],
     ['لحماية المصابيح',false,'السبب في الكتاب أن المولد يكون «بدون حمل» عند الضبط.']]}}
   ],
   body:[
    {book:String.raw`<p>صل التجربة كما هو مبين في مخطط التوصيل شكل (4).</p>
     <p>يدار المحرك وتزداد سرعته حتى تصل قيمتها إلى السرعة المقننة للمولد، ويتم ضبط هذه السرعة أولاً عن طريق مقاومة تنظيم المجال \(R_{fm}\)، كما يمكن اللجوء إلى تغيير الجهد على طرفي تغذية المحرك في وحدة القدرة (Power supply) إذا كان هذا الجهد متغيراً. مع بقاء المفتاح S مفتوحاً، أي المولد بدون حمل.</p>
     <p>يضبط الجهد على طرفي المولد عن طريق المقاومة \(R_{fg}\) حتى يصبح مساوياً للجهد المقنن عند السرعة المضبوطة.</p>
     <p>يتم بعد ذلك تحميل المولد وذلك بغلق المفتاح S وإدخال اللمبات واحدة تلو الأخرى، مع مراعاة ضبط السرعة عند نفس قيمتها.</p>
     <p>يسجل تيار الحمل وكذلك جهده عند كل تغيير في الحمل وتسجل النتائج في جدول (4-1) إلى أن نحصل على تيار حمل أعلى بما يساوي 25% تقريباً من تيار الحمل المقنن للمولد.</p>
     <p>ارسم منحنى الخواص الخارجي للمولد من القراءات التي حصلت عليها وناقش النتائج.</p><p>احسب معامل تنظيم الجهد للمولد في هذه التجربة.</p>`+emptyT4(1),ref:'ص 20–21'},
    {tip:String.raw`<p>«أعلى بما يساوي <span class="ltr">25%</span>» يعني أن آخر قراءة يكون تيار الحمل فيها نحو <span class="ltr">125%</span> من التيار المقنن. لكل لمبة تُدخلها عمود جديد في الجدول؛ وأول عمود (<span class="ltr">I<sub>L</sub> = 0</span>) مطبوع في الكتاب.</p>`,title:'إلى متى نحمّل؟'},
    {watch:String.raw`<p>السرعة المقننة والجهد المقنن وتيار الحمل المقنن غير مذكورة رقمياً في الكتاب، وتؤخذ من لوحة بيانات المولد في مختبرك. في المختبر الافتراضي أرقام توضيحية يستطيع المدرب تغييرها.</p>`}
   ]},

  {st:4,short:'عكس ملف التوالي',title:'عكس أطراف ملف التوالي وجدول <span class="ltr">(4-2)</span>',ref:'ص 21',
   q:'نفس المولد ونفس الحمل، وقد عكسنا طرفين فقط… هل يتغير المنحنى كثيراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شكل توضيحي لمنحنيي المولد المركب: منحنى شبه أفقي عندما يساعد ملف التوالي، ومنحنى يهبط بسرعة عندما يعاكسه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="62" y="56" width="262" height="200" rx="6" fill="#FBF6EE"/><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="328,250 318,245 318,255" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="62" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,54 65,64 75,64" fill="#2C4A40"/><text x="84" y="70" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (v)</tspan></text><text x="318" y="282" text-anchor="end" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="3">L</tspan><tspan dy="-3"> (A)</tspan></text><text x="70" y="268" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">0</text><g data-tip="جهد اللاحمل المضبوط على الجهد المقنن: نقطة البداية نفسها للمنحنيين (⟦IL = 0⟧)."><circle cx="70" cy="106" r="12" fill="transparent"/><circle cx="70" cy="106" r="6" fill="#2C4A40"/></g><g data-tip="ملف التوالي يساعد ملف التوازي (المركب التراكمي): الجهد يبقى شبه ثابت مع زيادة الحمل."><path d="M70.0 106.0 L110.0 105.2 L150.0 104.6 L190.0 104.2 L230.0 104.0 L270.0 104.0 L310.0 104.2" fill="none" stroke="transparent" stroke-width="22"/><path d="M70.0 106.0 L110.0 105.2 L150.0 104.6 L190.0 104.2 L230.0 104.0 L270.0 104.0 L310.0 104.2" fill="none" stroke="#12855A" stroke-width="3.5"/></g><g data-tip="ملف التوالي يعاكس ملف التوازي (المركب التفاضلي): الجهد يهبط بسرعة مع زيادة الحمل."><path d="M70.0 106.0 L110.0 112.8 L150.0 124.0 L190.0 139.8 L230.0 160.0 L270.0 184.8 L310.0 214.0" fill="none" stroke="transparent" stroke-width="22"/><path d="M70.0 106.0 L110.0 112.8 L150.0 124.0 L190.0 139.8 L230.0 160.0 L270.0 184.8 L310.0 214.0" fill="none" stroke="#C2492F" stroke-width="3.5"/></g><text x="270" y="94" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700">يساعد</text><text x="262" y="214" text-anchor="middle" font-size="12" fill="#C2492F" font-weight="700">يعاكس</text></svg>`,
   cap:'الكتاب لا يعطي شبكة رسم لهذه التجربة؛ المنحنيان هنا <b>توضيحيان</b> بلا أرقام، وأيهما يظهر أولاً يعتمد على طريقة توصيل D1–D2 في مختبرك.<br><b>مرّر المؤشر على النقطة والمنحنيين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قبل إعادة التوصيل، ما أول ما تفعله حسب الكتاب؟',opts:[
     ['أعكس D1–D2 والمولد يدور لأوفّر الوقت',false,'تغيير التوصيلات والجهد موصول ممنوع (إرشادات الوقاية ص 3)، والكتاب يبدأ بالفصل.'],
     ['أفصل منبع الجهد عن التجربة ثم أعكس أطراف D1–D2',true,'الخطوة 1: «افصل منبع الجهد عن التجربة واعكس أطراف ملفات التوالي للمولد (D1-D2)».'],
     ['أعكس أطراف ملف التوازي F1–F2',false,'المطلوب عكس ملف التوالي D1–D2؛ عكس ملف التوازي قد يمنع المولد من بناء جهده.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>افصل منبع الجهد عن التجربة واعكس أطراف ملفات التوالي للمولد (D1-D2).</li><li>أعد خطوات التجربة مرة أخرى وسجل النتائج في جدول (4-2).</li><li>ارسم المنحنى للمولد في هذه الحالة على نفس الورقة للرسم الأول.</li><li>حدد نوع المولد في كلا الحالتين.</li><li>ناقش النتائج وسجل ملاحظاتك.</li></ol>`+emptyT4(2),ref:'ص 21'},
    {title:'اعكس ملف التوالي وشاهد الفيض',widget:(el,B)=>{
      let rev=false;
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">بدّل اتجاه توصيل <span class="ltr">D1–D2</span> وراقب سهمي الفيض على القطب ونوع المولد (شكل توضيحي بلا أرقام).</p><div class="w-row" style="margin-top:0"><span class="w-l">ملف التوالي</span><span class="mseg"><button type="button" data-v="0" style="font-family:var(--font)">فيضه يساعد</button><button type="button" data-v="1" style="font-family:var(--font)">معكوس: فيضه يعاكس</button></span></div><div data-o="svg" style="max-width:360px;margin:10px auto 0"></div><p class="sub" data-o="msg" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const c=rev?'#C2492F':'#12855A';
        o('svg').innerHTML=`<svg viewBox="0 0 360 150" role="img" aria-label="سهما الفيض على القطب" style="font-family:var(--font);width:100%;height:auto"><rect x="20" y="20" width="320" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><line x1="70" y1="60" x2="290" y2="60" stroke="#E8735A" stroke-width="10"/><polygon points="304,60 284,48 284,72" fill="#E8735A"/><text x="180" y="44" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">فيض ملف التوازي</text>${rev?`<line x1="230" y1="102" x2="140" y2="102" stroke="${c}" stroke-width="7"/><polygon points="126,102 144,92 144,112" fill="${c}"/>`:`<line x1="130" y1="102" x2="220" y2="102" stroke="${c}" stroke-width="7"/><polygon points="234,102 216,92 216,112" fill="${c}"/>`}<text x="180" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">فيض ملف التوالي (يكبر مع الحمل)</text></svg>`;
        o('msg').innerHTML=rev?'<b>مركب تفاضلي:</b> فيض التوالي يطرح من فيض التوازي، وكلما زاد الحمل ضعف الفيض الكلي أكثر، فيهبط الجهد بسرعة.':'<b>مركب تراكمي:</b> فيض التوالي يضاف إلى فيض التوازي، وزيادته مع الحمل تعوض الهبوط، فيبقى الجهد شبه ثابت.';
        el.querySelectorAll('.mseg button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v===(rev?1:0))))};
      el.querySelectorAll('.mseg button').forEach(b=>b.onclick=()=>{rev=b.dataset.v==='1';draw()});draw();
    }},
    {watch:String.raw`<p>الكتاب لا يحدد أي التوصيلين هو «الأصلي»؛ لذلك احكم على النوع من شكل المنحنى نفسه (الخطوة 4): المنحنى شبه الأفقي للتراكمي، والهابط بسرعة للتفاضلي. والمنحنيان على الورقة نفسها (الخطوة 3).</p>`}
   ]},

  {st:5,short:'الأسئلة',title:'الأسئلة',ref:'ص 21',
   q:'السرعة ثابتة وزدت المقاومة \\(R_{fg}\\)… فماذا يحدث لجهد الأطراف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سلسلة: زيادة مقاومة مجال المولد تنقص تيار ملف التوازي فينقص الفيض فينقص الجهد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مقاومة مجال المولد ⟦Rfg⟧: على التوالي مع ملف التوازي ⟦F1–F2⟧."><rect x="226" y="60" width="96" height="64" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="274" y="100" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">R<tspan font-size="12" dy="4">fg</tspan><tspan dy="-4"> ↑</tspan></text></g><g data-tip="تيار ملف التوازي ⟦Ifg⟧: ينقص عندما تزيد ⟦Rfg⟧ (جهد الأطراف مقسوماً على مقاومة دائرة المجال)."><rect x="38" y="60" width="96" height="64" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="86" y="100" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="12" dy="4">fg</tspan><tspan dy="-4"> ↓</tspan></text></g><g data-tip="الفيض ⟦Φ⟧: ينقص مع نقص تيار ملف التوازي."><rect x="226" y="190" width="96" height="64" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="274" y="230" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Φ ↓</text></g><g data-tip="جهد الأطراف ⟦VL⟧: ينقص لأن الفيض نقص والسرعة ثابتة (السؤال أ). والعكس عند نقص ⟦Rfg⟧ (السؤال ب)."><rect x="38" y="190" width="96" height="64" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="86" y="230" text-anchor="middle" font-size="18" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="12" dy="4">L</tspan><tspan dy="-4"> ↓</tspan></text></g><g stroke="#2C4A40" stroke-width="3" fill="#2C4A40"><line x1="222" y1="92" x2="146" y2="92"/><polygon points="138,92 150,85 150,99"/><path d="M86 128 V150 H274 V178" fill="none"/><polygon points="274,186 267,174 281,174"/><line x1="222" y1="222" x2="146" y2="222"/><polygon points="138,222 150,215 150,229"/></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600" direction="rtl">السؤالان أ و ب</text></svg>`,
   cap:'رسم توضيحي (ليس من الكتاب) لسلسلة السؤال (أ)؛ اقرأ من الأعلى يميناً.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'هل الهبوط في جهد المولد المركب أكبر من الهبوط في مولد التوازي؟ (السؤال د)',opts:[
     ['يعتمد على توصيل ملف التوالي: أصغر في التراكمي، وأكبر بكثير في التفاضلي',true,'في التراكمي يعوض ملف التوالي معظم الهبوط، وفي التفاضلي يزيده لأنه يُضعف الفيض. قارن منحنيي هذه التجربة بمنحنى التجربة الثالثة.'],
     ['دائماً أصغر',false,'هذا صحيح في التوصيل التراكمي فقط.'],
     ['دائماً أكبر',false,'هذا صحيح في التوصيل التفاضلي فقط.']]}}
   ],
   body:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ul style="list-style:none;padding-inline-start:0">
     <li>أ. ما هو تأثير زيادة المقاومة \(R_{fg}\) على الجهد على أطراف المولد المركب علماً بأن سرعة المولد ثابتة؟</li>
     <li>ب. ما هو تأثير نقص المقاومة \(R_{fg}\) على الجهد على أطراف المولد المركب علماً بأن سرعة المولد ثابتة؟</li>
     <li>ج. ما هو سبب نقصان الجهد على أطراف المولد عند زيادة الحمل؟</li>
     <li>د. هل الهبوط في الجهد الناتج من المولد المركب أكبر من الهبوط في الجهد في مولد التوازي؟</li></ul>`,ref:'ص 21'},
    {predict:{q:'نقصت \\(R_{fg}\\) كثيراً والسرعة ثابتة. ماذا تتوقع؟ (السؤال ب)',opts:[
     ['يهبط الجهد',false,'نقص المقاومة يزيد تيار ملف التوازي، لا ينقصه.'],
     ['يرتفع الجهد بلا حد',false,'الحديد يتشبع، فيقل أثر زيادة تيار المجال.'],
     ['يرتفع الجهد، لكن الزيادة تقل كلما اقترب الحديد من التشبع',true,'تيار ملف التوازي يزيد فيزيد الفيض فيرتفع الجهد — بحسب منحنى المغنطة الذي رسمته في التجربة الأولى.']]}},
    {tip:String.raw`<p>لكل سؤال إجابة مقترحة (ليست من الكتاب) في الأسلوب الرسمي لهذا الدرس. وفي تبويب «المختبر» تستطيع عكس <span class="ltr">D1–D2</span> وتحريك \(R_{fg}\) وإدخال المصابيح لترى النوعين بنفسك.</p>`}
   ]},

  {recap:[
   'المولد المركب: ملف توازي <span class="ltr">F1–F2</span> مع \\(R_{fg}\\) على المنتج، وملف توالي <span class="ltr">D1–D2</span> يمر فيه تيار الحمل (الغرض ص 20، الشكل <span class="ltr">(4)</span>).',
   'نضبط السرعة المقننة (\\(R_{fm}\\) أولاً) ثم الجهد المقنن بـ \\(R_{fg}\\) والمفتاح S مفتوح، ثم نُدخل المصابيح واحدة تلو الأخرى حتى نحو <span class="ltr">125%</span> من التيار المقنن — جدول (4-1) (ص 20–21).',
   'نفصل المنبع ونعكس <span class="ltr">D1–D2</span> ونعيد التجربة — جدول (4-2) — ونرسم المنحنيين على الورقة نفسها ونحدد نوع المولد في الحالتين (ص 21).',
   'ملف التوالي المساعد (تراكمي): الجهد شبه ثابت؛ والمعاكس (تفاضلي): الجهد يهبط بسرعة (السؤال د).',
   'زيادة \\(R_{fg}\\) تُنقص الجهد، ونقصها يرفعه حتى التشبع (السؤالان أ و ب ص 21).']}
],
 theory:[
  {h:'التجربة الرابعة: منحنى خواص الحمل للمولد المركب',ref:'ص 20',html:`<p class="ltr" style="display:block;text-align:left">Load characteristics of compound generator</p><p><b>الغرض من التجربة:</b> رسم منحنى الخواص الخارجية للمولد المركب بأنواعه وهو العلاقة بين تيار الحمل وجهد الحمل عند ثبات سرعة الدوران، وكذلك حساب معامل تنظيم الجهد.</p>`},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> المولد المركب له ملفا مجال على كل قطب:
   <ul><li><b>ملف التوازي F1–F2</b>: لفات كثيرة من سلك رفيع على أطراف المنتج (مع مقاومة ضبط \\(R_{fg}\\))، يصنع معظم الفيض.</li><li><b>ملف التوالي D1–D2</b>: لفات قليلة من سلك سميك يمر فيه تيار الحمل \\(I_L\\)، ففيضه يكبر مع الحمل.</li></ul>
   في الشكل (4) يوصل ملف التوازي على المنتج مباشرة قبل ملف التوالي: هذا يسمى <b>مركب قصير التوازي</b>.
   <ul><li>إذا كان فيض ملف التوالي <b>يساعد</b> فيض التوازي: <b>مركب تراكمي</b> — زيادة الحمل تزيد الفيض فتعوض الهبوط، فيبقى الجهد شبه ثابت (أو يرتفع قليلاً إذا كان التعويض زائداً).</li><li>إذا كان فيضه <b>يعاكس</b> فيض التوازي: <b>مركب تفاضلي</b> — زيادة الحمل تُضعف الفيض فيهبط الجهد بسرعة.</li></ul>
   عكس طرفي ملف التوالي D1–D2 ينقل المولد من نوع إلى الآخر — وهذا ما تطلبه التجربة.`},
  VRBLOCK,
  {h:'الأجهزة المستخدمة',ref:'ص 20',html:'<p>لم تذكر الحقيبة قائمة أجهزة لهذه التجربة. من مخطط التوصيل: مصدر تيار مستمر (خطان + و −)، مفتاح ثنائي القطب، محرك توازي M مع مقاومة بدء R<sub>st</sub> ومقاومة تنظيم مجال R<sub>fm</sub>، أميترا I<sub>fm</sub> و I<sub>am</sub>، مقياس سرعة، مولد مركب G مع مقاومة مجال R<sub>fg</sub> وأميتر I<sub>fg</sub>، فولتميتر V<sub>L</sub>، مفتاح S، حمل من مصابيح على التوازي، أميتر I<sub>L</sub>.</p>'},
  {fig:'(4)',ref:'ص 20',caption:'مخطط التوصيل: المحرك M يُغذى من خطي المصدر عبر المفتاح ثنائي القطب، منتجه عبر مقاومة البدء R<sub>st</sub> وأميتر I<sub>am</sub>، ومجاله f1–f2 عبر R<sub>fm</sub> وأميتر I<sub>fm</sub>. المولد G مركب قصير التوازي: ملف التوازي F1–F2 مع R<sub>fg</sub> وأميتر I<sub>fg</sub> على المنتج مباشرة، ثم ملف التوالي D1–D2، ثم الفولتميتر V<sub>L</sub> والمفتاح S والمصابيح وأميتر I<sub>L</sub>. (الكتاب يرسم ثلاثة مصابيح؛ هنا تسعة لأن الجدول فيه تسع قراءات بعد قراءة الصفر.)',draw:()=>box(fig4SVG({rd:false,RstIn:true,lamps:9}),980,1)},
  {h:'خطوات التجربة',ref:'ص 20–21',html:`<p>صل التجربة كما هو مبين في مخطط التوصيل شكل (4).</p>
   <p>يدار المحرك وتزداد سرعته حتى تصل قيمتها إلى السرعة المقننة للمولد، ويتم ضبط هذه السرعة أولاً عن طريق مقاومة تنظيم المجال \\(R_{fm}\\)، كما يمكن اللجوء إلى تغيير الجهد على طرفي تغذية المحرك في وحدة القدرة (Power supply) إذا كان هذا الجهد متغيراً. مع بقاء المفتاح S مفتوحاً، أي المولد بدون حمل.</p>
   <p>يضبط الجهد على طرفي المولد عن طريق المقاومة \\(R_{fg}\\) حتى يصبح مساوياً للجهد المقنن عند السرعة المضبوطة.</p>
   <p>يتم بعد ذلك تحميل المولد وذلك بغلق المفتاح S وإدخال اللمبات واحدة تلو الأخرى، مع مراعاة ضبط السرعة عند نفس قيمتها.</p>
   <p>يسجل تيار الحمل وكذلك جهده عند كل تغيير في الحمل وتسجل النتائج في جدول (4-1) إلى أن نحصل على تيار حمل أعلى بما يساوي 25% تقريباً من تيار الحمل المقنن للمولد.</p>
   <p>ارسم منحنى الخواص الخارجي للمولد من القراءات التي حصلت عليها وناقش النتائج.</p><p>احسب معامل تنظيم الجهد للمولد في هذه التجربة.</p>${emptyT4(1)}
   <ol><li>افصل منبع الجهد عن التجربة واعكس أطراف ملفات التوالي للمولد (D1-D2).</li><li>أعد خطوات التجربة مرة أخرى وسجل النتائج في جدول (4-2).</li><li>ارسم المنحنى للمولد في هذه الحالة على نفس الورقة للرسم الأول.</li><li>حدد نوع المولد في كلا الحالتين.</li><li>ناقش النتائج وسجل ملاحظاتك.</li></ol>${emptyT4(2)}
   <p class="sub">لا توجد شبكة رسم مطبوعة لهذه التجربة؛ المطلوب منحنى الخواص الخارجية: V<sub>L</sub> رأسياً و I<sub>L</sub> أفقياً للحالتين على الورقة نفسها.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> مقاومة البدء \\(R_{st}\\) تكون «داخلة» عند تشغيل المحرك لتحد من تيار البدء (المحرك الواقف لا يولد قوة دافعة عكسية)، ثم تُخرج تدريجياً بعد أن يدور. وزيادة \\(R_{fm}\\) تُضعف مجال المحرك فتزيد سرعته. وزيادة \\(R_{fg}\\) تُنقص تيار مجال المولد فينقص جهده.'},
  {err:'<div class="fixnote">(١) لا توجد قائمة أجهزة لهذه التجربة في الحقيبة. (٢) «في في جدول (4-1)» كلمة مكررة، و«عند كل تغير» ← «تغيير». (٣) السرعة المقننة والجهد المقنن وتيار الحمل المقنن غير مذكورة رقمياً؛ في المختبر أرقام توضيحية. (٤) المخطط يبين ثلاثة مصابيح فقط بينما المطلوب الوصول إلى نحو 125% من التيار المقنن وتسع قراءات؛ استعملنا تسعة مصابيح. (٥) قانون معامل تنظيم الجهد غير مذكور — أضفناه أعلاه. (٦) الكتاب لا يسمي النوعين؛ هما المركب التراكمي والمركب التفاضلي.</div>'},
  {h:'الأسئلة',ref:'ص 21',html:`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p>`+
   Q('أ.','ما هو تأثير زيادة المقاومة R<sub>fg</sub> على الجهد على أطراف المولد المركب علماً بأن سرعة المولد ثابتة؟','زيادة \\(R_{fg}\\) تُنقص تيار ملف التوازي فينقص الفيض فينقص الجهد على الأطراف (وفي حد معين لا يبني المولد جهده).')+
   Q('ب.','ما هو تأثير نقص المقاومة R<sub>fg</sub> على الجهد على أطراف المولد المركب علماً بأن سرعة المولد ثابتة؟','يزيد تيار ملف التوازي فيزيد الفيض فيرتفع الجهد، لكن الزيادة تقل كلما اقترب الحديد من التشبع.')+
   Q('ج.','ما هو سبب نقصان الجهد على أطراف المولد عند زيادة الحمل؟','الهبوط \\(I_aR_a\\) في المنتج وهبوط الفرش والهبوط في مقاومة ملف التوالي، ورد فعل المنتج، ونقص تيار ملف التوازي مع هبوط الجهد. في التراكمي يعوض ملف التوالي معظم ذلك، وفي التفاضلي يزيد ملف التوالي الهبوط لأنه يُضعف الفيض.')+
   Q('د.','هل الهبوط في الجهد الناتج من المولد المركب أكبر من الهبوط في الجهد في مولد التوازي؟','يعتمد على التوصيل: في <b>المركب التراكمي</b> الهبوط أصغر من مولد التوازي (وقد يكاد ينعدم)، وفي <b>المركب التفاضلي</b> الهبوط أكبر بكثير من مولد التوازي. قارن منحنيي هذه التجربة بمنحنى التجربة الثالثة.')}
 ],
 lab:(el)=>{
  const M0={n:0,nss:0,Im:0};let dp=false,Vs=220,RstIn=true,rfm=0,Rfg=200,Sw=false,lamps=0,rev=false,ang=0,G=null,sig='',Ish=0,Ifm=0;const did={};
  const mkT=()=>({head:'عدد المصابيح*',cols:T4COLS.map(k=>({k:String(k),v:k,label:String(k)})),rows:[{k:'IL',label:'I<sub>L</sub> (A)',dp:2},{k:'VL',label:'V<sub>L</sub> (v)',dp:1}],data:{},free:[],freeText:f=>`${f.k} مصابيح، n=${fm(f.n,0)}: IL=${fm(f.IL,2)} A، VL=${fm(f.VL,1)} V`});
  const T1=mkT(),T2=mkT();
  el.innerHTML=`<div id="l5tp"></div><div class="grid dc-lab">
   <div class="panel c12"><h2>منضدة الاختبار <small>مبنية على الشكل (4) ص 20 — الدوران في الرسم مبطأ</small></h2>
    <div class="svgbox dc-wide" id="l5c" style="max-width:980px;margin-inline:auto"></div><div id="l5msg" class="dc-msg"></div></div>
   <div class="panel c6"><h2>المحرك المدير</h2>
    <div class="dc-sw"><button class="btn" id="l5dp" aria-pressed="false">أغلق المفتاح ثنائي القطب</button><button class="btn" id="l5st" aria-pressed="true">مقاومة البدء R<sub>st</sub>: داخلة</button></div>
    ${sl('l5vs','جهد خطي المصدر (+ و −)',0,250,0.1,Vs)}${fineHTML('l5d',[-10,-1,-0.1,0.1,1,10],'V')}
    ${sl('l5fm','مقاومة تنظيم مجال المحرك R<sub>fm</sub> (تزيد السرعة)',0,100,0.1,0)}${fineHTML('l5fd',[-10,-1,-0.1,0.1,1,10],'%')}</div>
   <div class="panel c6"><h2>المولد والحمل</h2>
    ${sl('l5fg','مقاومة مجال المولد R<sub>fg</sub>',0,400,1,Rfg)}${fineHTML('l5gd',[-10,-1,1,10],'Ω')}
    <div class="dc-sw"><button class="btn" id="l5S" aria-pressed="false">أغلق المفتاح S</button><button class="btn" id="l5lm">− مصباح</button><button class="btn" id="l5lp">+ مصباح</button><button class="btn red" id="l5rev" aria-pressed="false">اعكس أطراف ملف التوالي D1–D2</button></div>
    <p class="sub" id="l5lc"></p></div>
   <div class="panel c12"><h2>قراءات الأجهزة</h2><div class="dc-meters" id="l5m"></div>
    <div class="dc-row"><button class="btn primary" id="l5rec">سجّل القراءة</button><button class="btn" id="l5clr">امسح جدول الحالة الحالية</button></div><div id="l5rmsg" class="dc-msg"></div><div id="l5w" class="dc-msg"></div></div>
   <div class="panel c6"><h2>جدول (4-1) <small>D1–D2 كما في المخطط</small></h2><div id="l5t1"></div></div>
   <div class="panel c6"><h2>جدول (4-2) <small>D1–D2 معكوس</small></h2><div id="l5t2"></div></div>
   <div class="panel c7"><h2>منحنى الخواص الخارجية <small>الحالتان على الورقة نفسها</small></h2><p class="sub">* صف «عدد المصابيح» مضاف للتوضيح؛ الكتاب يطبع صفي I<sub>L</sub> و V<sub>L</sub> فقط وأول قيمة I<sub>L</sub> = 0.</p><div class="svgbox" id="l5p"></div><div class="dc-leg"><span><i style="background:var(--blue)"></i>جدول (4-1)</span><span><i style="background:var(--live)"></i>جدول (4-2): D1–D2 معكوس</span></div></div>
   <div class="panel c5"><h2>النتائج <small>معامل التنظيم إضافة من خارج الكتاب</small></h2><h3 class="sm">جدول (4-1)</h3><div id="l5vr1"></div><h3 class="sm">جدول (4-2)</h3><div id="l5vr2"></div><div id="l5type"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5stp"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l5tp'),TPID,tpDefs(['nref','Er','E03','Fk','Ra','Vb','kar','Rsh','Tf','Rse','kse','Rfgmax','Rlamp','Vrat','Irat','nrat','n0','Ram','I0','Rst','Rfmmax','tau']),()=>{[T1,T2].forEach(T=>{T.data={};T.free=[];delete T.rfg});$('#l5fg').max=TP.v.Rfgmax;setRfg(Rfg);sig='';redrawT();steps.redraw()});
  const setVs=x=>{Vs=clamp(B.round(x,1),0,250);$('#l5vs').value=Vs;$('#l5vs-v').textContent=fm(Vs,1)+' V'};
  const setRfm=x=>{rfm=clamp(B.round(x,1),0,100)/100;$('#l5fm').value=rfm*100;$('#l5fm-v').textContent=fm(rfm*100,1)+' % = '+fm(rfm*TP.v.Rfmmax,0)+' Ω'};
  const setRfg=x=>{Rfg=clamp(Math.round(x),0,TP.v.Rfgmax);$('#l5fg').value=Rfg;$('#l5fg-v').textContent=fm(Rfg,0)+' Ω'};
  $('#l5fg').max=TP.v.Rfgmax;setVs(Vs);setRfm(0);setRfg(Rfg);
  $('#l5vs').oninput=e=>setVs(+e.target.value);$('#l5fm').oninput=e=>setRfm(+e.target.value);$('#l5fg').oninput=e=>setRfg(+e.target.value);
  el.querySelectorAll('[data-l5d]').forEach(b=>b.onclick=()=>setVs(Vs+ +b.dataset.l5d));el.querySelectorAll('[data-l5fd]').forEach(b=>b.onclick=()=>setRfm(rfm*100+ +b.dataset.l5fd));el.querySelectorAll('[data-l5gd]').forEach(b=>b.onclick=()=>setRfg(Rfg+ +b.dataset.l5gd));
  const msg=h=>{$('#l5msg').innerHTML=h};
  const lampTxt=()=>{$('#l5lc').innerHTML=`المصابيح الموصلة: <b>${lamps}</b> من 9 — المفتاح S ${Sw?'مغلق':'مفتوح'}. المطلوب الوصول إلى نحو ${lt(fm(1.25*TP.v.Irat,2)+' A')} (125% من التيار المقنن التوضيحي).`};
  $('#l5dp').onclick=()=>{if(!dp&&!RstIn&&M0.n<0.2*TP.v.n0){msg(recMsg(0,'<b>لا تبدأ والمقاومة R<sub>st</sub> مُخرجة!</b> المحرك الواقف لا يولد قوة دافعة عكسية، فيكون تيار البدء = الجهد ÷ مقاومة المنتج الصغيرة: '+lt(fm(Vs/TP.v.Ram,0)+' A')+' تقريباً. أدخل مقاومة البدء أولاً.'));return}
   dp=!dp;msg('');$('#l5dp').setAttribute('aria-pressed',String(dp));$('#l5dp').textContent=dp?'افتح المفتاح ثنائي القطب (افصل المنبع)':'أغلق المفتاح ثنائي القطب'};
  $('#l5st').onclick=()=>{RstIn=!RstIn;$('#l5st').setAttribute('aria-pressed',String(RstIn));$('#l5st').innerHTML='مقاومة البدء R<sub>st</sub>: '+(RstIn?'داخلة':'مُخرجة');
   if(!RstIn&&dp&&M0.n<0.5*M0.nss)msg(recMsg(0,'أخرجت مقاومة البدء والمحرك لم يتسارع بعد: لاحظ قفزة تيار المنتج I<sub>am</sub>. الأصح أن تنتظر حتى تقترب السرعة من قيمتها.'));else msg('')};
  $('#l5S').onclick=()=>{Sw=!Sw;$('#l5S').setAttribute('aria-pressed',String(Sw));$('#l5S').textContent=Sw?'افتح المفتاح S':'أغلق المفتاح S';lampTxt()};
  $('#l5lm').onclick=()=>{lamps=Math.max(0,lamps-1);lampTxt()};$('#l5lp').onclick=()=>{lamps=Math.min(9,lamps+1);lampTxt()};
  $('#l5rev').onclick=()=>{if(dp){msg(recMsg(0,'<b>افصل منبع الجهد أولاً</b> (افتح المفتاح ثنائي القطب): الخطوة 1 «افصل منبع الجهد عن التجربة واعكس أطراف ملفات التوالي». لا تغيّر التوصيلات والجهد موصول (إرشادات الوقاية ص 3).'));return}
   rev=!rev;msg('');$('#l5rev').setAttribute('aria-pressed',String(rev));$('#l5rev').textContent=rev?'أرجع أطراف ملف التوالي D1–D2':'اعكس أطراف ملف التوالي D1–D2'};
  const RL=()=>Sw&&lamps>0?TP.v.Rlamp/lamps:Infinity;
  const curT=()=>rev?T2:T1;
  const plot=()=>{const v=TP.v,p1=tblPts(T1,'IL','VL'),p2=tblPts(T2,'IL','VL'),all=p1.concat(p2);
   $('#l5p').innerHTML=plotXY({x1:nice(Math.max(v.Irat*1.35,...all.map(p=>p[0]),G?G.IL*1.05:0,0.1)),y1:nice(Math.max(v.Vrat*1.15,...all.map(p=>p[1]),G?G.VL:0,1)),xl:'IL (A)',yl:'VL (V)',cid:'dcp5',aria:'منحنى الخواص الخارجية للمولد المركب',series:[{pts:p1,col:'--blue',sort:false},{pts:p2,col:'--live',sort:false}],live:dp&&G?[G.IL,G.VL]:null})};
  const typeTxt=()=>{if(!tblDone(T1)||!tblDone(T2))return '<p class="sub" style="margin-top:10px">بعد إكمال الجدولين يظهر هنا تحديد نوع المولد في الحالتين (المطلوب 4).</p>';
   const a=T1.data['9'],b=T2.data['9'];const cum1=a.VL>=b.VL;
   return `<div class="callout" style="margin-top:12px"><b>نوع المولد (المطلوب 4):</b> عند آخر حمل كان الجهد ${lt(fm(a.VL,1)+' V')} في جدول (4-1) و ${lt(fm(b.VL,1)+' V')} في جدول (4-2). الحالة ذات الجهد شبه الثابت هي <b>المركب التراكمي</b> (ملف التوالي يساعد ملف التوازي) — هنا جدول ${cum1?'(4-1)':'(4-2)'} — والحالة التي ينهار فيها الجهد هي <b>المركب التفاضلي</b> — جدول ${cum1?'(4-2)':'(4-1)'}.</div>`};
  const redrawT=()=>{const c=String(Sw?lamps:0);$('#l5t1').innerHTML=tableHTML(T1,!rev?c:null);$('#l5t2').innerHTML=tableHTML(T2,rev?c:null);
   $('#l5vr1').innerHTML=vrHTML(T1,TP.v.Irat);$('#l5vr2').innerHTML=vrHTML(T2,TP.v.Irat);$('#l5type').innerHTML=typeTxt();plot()};
  $('#l5rec').onclick=()=>{const m=$('#l5rmsg'),v=TP.v;if(!dp||M0.n<1){m.innerHTML=recMsg(0,'المحرك متوقف: أغلق المفتاح ثنائي القطب أولاً.');return}
   if(Math.abs(M0.n-M0.nss)>1||Math.abs(G.tgt-Ish)>5e-4){m.innerHTML=recMsg(0,'انتظر حتى تستقر السرعة والجهد ثم سجّل.');return}
   const T=curT(),k=Sw?lamps:0,r={k,n:Math.round(M0.n),IL:B.round(G.IL,2),VL:B.round(G.VL,1)};const why=[];
   if(!okN(M0.n,v.nrat))why.push(`السرعة ليست السرعة المقننة ${v.nrat} rpm (اضبطها بـ R<sub>fm</sub> أو بجهد المصدر)`);
   if(k===0&&Math.abs(G.VL-v.Vrat)>1)why.push(`جهد اللاحمل ليس الجهد المقنن ${v.Vrat} V (اضبطه بـ R<sub>fg</sub>)`);
   if(k>0&&!T.data['0'])why.push('سجّل قراءة اللاحمل أولاً');
   if(k>0&&T.rfg!=null&&Math.abs(Rfg-T.rfg)>0.5)why.push('غيّرت R<sub>fg</sub> بعد ضبط جهد اللاحمل — أرجعها '+fm(T.rfg,0)+' Ω');
   if(!why.length){if(k===0)T.rfg=Rfg;T.data[String(k)]=r;m.innerHTML=recMsg(1,`سُجّلت في جدول ${rev?'(4-2)':'(4-1)'} (${k} مصابيح): ${lt('I<sub>L</sub> = '+fm(r.IL,2)+' A')} و ${lt('V<sub>L</sub> = '+fm(r.VL,1)+' V')}.`)}
   else{T.free.push(r);m.innerHTML=recMsg(0,`سُجّلت قراءة حرة (لا تدخل في المنحنى) لأن: ${why.join('، ')}.`)}redrawT()};
  $('#l5clr').onclick=()=>{const T=curT();T.data={};T.free=[];delete T.rfg;redrawT();$('#l5rmsg').innerHTML=''};
  const steps=stepsUI($('#l5stp'),[
   {t:'ابدأ ومقاومة البدء داخلة',x:'تأكد أن R<sub>st</sub> «داخلة» والمفتاح S مفتوح، ثم أغلق المفتاح ثنائي القطب: يدور المحرك وتيار بدئه محدود. (جرّب البدء وهي مُخرجة: سيمنعك المختبر.)',done:()=>dp&&RstIn&&M0.n>300},
   {t:'أخرج مقاومة البدء',x:'بعد أن تقترب السرعة من الثبات، اضغط «مقاومة البدء: مُخرجة»: ترتفع السرعة.',done:()=>dp&&!RstIn&&M0.n>0.8*M0.nss&&M0.nss>0},
   {t:'اضبط السرعة المقننة',get x(){return `والمفتاح S مفتوح (بلا حمل) اضبط السرعة على السرعة المقننة التوضيحية ${lt(TP.v.nrat+' rpm')}: أولاً بمقاومة R<sub>fm</sub> (زيادتها تزيد السرعة)، أو بجهد المصدر.`},done:()=>dp&&!Sw&&okN(M0.n,TP.v.nrat)},
   {t:'جهد اللاحمل = الجهد المقنن',get x(){return `اضبط R<sub>fg</sub> حتى يقرأ الفولتميتر ${lt(TP.v.Vrat+' V')} (±1 V) والسرعة ${lt(TP.v.nrat+' rpm')}، ثم «سجّل القراءة»: أول عمود ${lt('I<sub>L</sub> = 0')} في جدول (4-1).`},done:()=>!!T1.data['0']},
   {t:'حمّل مصباحاً بعد مصباح',get x(){return `أغلق S وأضف المصابيح واحداً تلو الآخر حتى 9، وأعد ضبط السرعة بـ R<sub>fm</sub> قبل كل تسجيل (لا تلمس R<sub>fg</sub>). ستصل إلى نحو ${lt(fm(1.25*TP.v.Irat,2)+' A')} = 125% من المقنن. لاحظ أن الجهد يكاد لا يتغير.`},done:()=>tblDone(T1)},
   {t:'افصل المنبع واعكس D1–D2',x:'افتح S، ثم افتح المفتاح ثنائي القطب (افصل منبع الجهد)، ثم اضغط «اعكس أطراف ملف التوالي». (جرّب العكس والمنبع موصول: سيمنعك المختبر.)',done:()=>rev&&!dp},
   {t:'أعد التجربة: جدول (4-2)',x:'أعد الخطوات: R<sub>st</sub> داخلة ← أغلق المفتاح ← أخرج R<sub>st</sub> ← السرعة المقننة ← جهد اللاحمل المقنن ← سجّل ← حمّل مصباحاً بعد مصباح. لاحظ كيف ينهار الجهد بسرعة الآن.',done:()=>tblDone(T2)},
   {t:'حدد نوع المولد',x:'قارن المنحنيين ومعاملي التنظيم في لوحة «النتائج»: أيهما تراكمي وأيهما تفاضلي؟ (المطلوب 4 و5).'}
  ]);
  lampTxt();redrawT();let pt=0;
  loopOn(el,dt=>{const v=TP.v,Mx=mach(v);
   G=armSolve(v,{n:M0.n,Ish,sig:1,RL:RL(),Rse:v.Rse,s:rev!==chF('serev')?-1:1});
   const tgt=chF('fopen')?0:G.Va/Math.max(v.Rsh+Rfg,1);G.tgt=tgt;Ish+=(tgt-Ish)*(1-Math.exp(-dt/Math.max(v.Tf,0.01)));
   const onM=dp&&Vs>0.05;Ifm=onM?Vs/(v.Rsh+rfm*v.Rfmmax):0;const I0f=Vs/v.Rsh;
   const phi=onM&&I0f>1e-6?Math.max(Mx.Emag(Ifm),0.05*Mx.Emag(I0f))/Math.max(Mx.Emag(I0f),1e-6):1;
   motorStep(M0,v,dt,{on:dp,Vs,Rst:RstIn?v.Rst:0,phi,Pg:G.E*G.Ia});
   ang=(ang+M0.n/60*360*dt/25)%360;
   const bright=(G.VL/Math.max(v.Vrat,1))**2;
   const sg=[dp,fm(Vs,1),Math.round(M0.n),RstIn,fm(rfm,3),Rfg,Sw,lamps,rev,fm(G.VL,1),fm(G.IL,2),fm(M0.Im,2)].join('|');
   if(sg!==sig){sig=sg;$('#l5c').innerHTML=fig4SVG({dp,Vs,RstIn,rfm,rfg:Rfg,S:Sw,lamps,rev,n:M0.n,ang,Im:M0.Im,Ifm,Ifg:Ish,VL:G.VL,IL:G.IL,bright});
    $('#l5m').innerHTML=meter('السرعة n',fm(Math.round(M0.n),0)+' rpm')+meter('I<sub>fm</sub>',fm(Ifm,3)+' A')+meter('I<sub>am</sub>',fm(M0.Im,2)+' A')+meter('I<sub>fg</sub>',fm(Ish,3)+' A')+meter('V<sub>L</sub>',sgn(G.VL,1)+' V')+meter('I<sub>L</sub>',fm(G.IL,2)+' A')+meter('I<sub>L</sub> ÷ المقنن',fm(G.IL/v.Irat*100,0)+' %');
    let w=G.IL>6?warnI(G.IL,99):G.IL>1.3*v.Irat?`<div class="callout">التيار ${lt(fm(G.IL,2)+' A')} تجاوز 130% من التيار المقنن التوضيحي ${lt(fm(v.Irat)+' A')}. يكفي الوصول إلى نحو 125%.</div>`:'';if(dp&&M0.Im>2.5*v.Irat)w+=recMsg(0,`تيار منتج المحرك ${lt(fm(M0.Im,1)+' A')} كبير جداً: هذا ما تمنعه مقاومة البدء.`);$('#l5w').innerHTML=w;
    const c=String(Sw?lamps:0);['#l5t1','#l5t2'].forEach((id,j)=>{el.querySelectorAll(`${id} th,${id} td`).forEach(x=>x.classList.remove('cur'));if((j===1)===rev){const i=+c+2;el.querySelectorAll(`${id} tr > :nth-child(${i})`).forEach(x=>x.classList.add('cur'))}})}
   else{const g=el.querySelectorAll('#dcr1,#dcr2');if(g[0])g[0].setAttribute('transform',`rotate(${fx(ang)} 260 172)`);if(g[1])g[1].setAttribute('transform',`rotate(${fx(ang)} 500 172)`)}
   pt+=dt;if(pt>0.25){pt=0;plot()}
   steps.check()});
 },
 quiz:[
  {q:'في المولد المركب يمر في ملف التوالي D1–D2:',o:['تيار المجال فقط','تيار الحمل','لا يمر تيار','تيار المحرك'],c:1,e:'الشكل (4).'},
  {q:'الشكل (4) يبين مولداً مركباً:',o:['طويل التوازي','قصير التوازي: ملف التوازي على المنتج مباشرة قبل ملف التوالي','توالي فقط','منفصل التغذية'],c:1,e:'توضيح الدرس.'},
  {q:'كيف تُضبط سرعة المحرك المدير أولاً في هذه التجربة؟',o:['بمقاومة R<sub>fg</sub>','بمقاومة تنظيم المجال R<sub>fm</sub>','بالمفتاح S','بالمصابيح'],c:1,e:'ص 20.'},
  {q:'بماذا يُضبط جهد المولد على الجهد المقنن بلا حمل؟',o:['R<sub>st</sub>','R<sub>fg</sub>','R<sub>fm</sub>','عدد المصابيح'],c:1,e:'ص 20.'},
  {q:'إلى أي حد يُحمّل المولد في الجدول (4-1)؟',o:['حتى نصف التيار المقنن','حتى نحو 125% من التيار المقنن','حتى يتوقف','حتى 300%'],c:1,e:'ص 21.'},
  {q:'قبل عكس أطراف ملف التوالي D1–D2 يجب:',o:['زيادة الحمل','فصل منبع الجهد عن التجربة','زيادة السرعة','غلق المفتاح S'],c:1,e:'ص 21، الخطوة 1.'},
  {q:'إذا كان ملف التوالي يساعد ملف التوازي فالمولد:',o:['مركب تراكمي وجهده شبه ثابت مع الحمل','مركب تفاضلي وجهده ينهار','لا يبني جهداً','منفصل التغذية'],c:0,e:'توضيح الدرس.'},
  {q:'زيادة R<sub>fg</sub> والسرعة ثابتة تجعل جهد المولد:',o:['يرتفع','ينخفض','لا يتغير','ينعكس'],c:1,e:'السؤال (أ).'}
 ]
});

})(PLCBOOK);
