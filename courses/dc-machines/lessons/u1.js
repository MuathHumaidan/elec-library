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
  {err:'ص 4: العنوان مطبوع «إرشادات <b>لأجراء</b> التجارب بطريقة آمنة» والصحيح «لإجراء». وفي الفهرس تبدأ الوحدة الأولى في ص 7 (صفحة غلافها)، وأهدافها في ص 8.'}
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
  {err:'(١) قائمة الأجهزة ص 10: الرقم 4 مكرر والرقم 5 مفقود — صُحح الترقيم أعلاه، و«آلتين» صُححت إلى «آلتا». (٢) الخطوة 1 ص 11: «قم بتوصل» والصحيح «بتوصيل»، وفي المرحلة الثانية «قم بتغير» والصحيح «بتغيير». (٣) جدول (1-2) ص 12: آخر سرعة مطبوعة بالأرقام الهندية «١٦٠٠» بين أرقام لاتينية؛ اعتمدنا <span class="ltr">1600 rpm</span> كما طُبعت، مع أن تدرج الجدول (300، 600، 900، 1200) يوحي بأن المقصود ربما 1500.'},
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
   E=Mx.E((rev?-1:1)*If,M0.n);if(rev&&E<-1&&If>0.25)did.revNeg=1;
   ang=(ang+M0.n/60*360*dt/25)%360;
   const sg=[on,fm(Vs,1),Math.round(M0.n),fm(If,3),rev,fm(E,1)].join('|');
   if(sg!==sig){sig=sg;$('#l2c').innerHTML=benchSVG({kind:'nl',on,Vs,ang,If,E,VL:E,n:M0.n,rev});
    $('#l2m').innerHTML=meter('السرعة n (Tacho)',fm(Math.round(M0.n),0)+' rpm')+meter('تيار المجال I<sub>f</sub> (A1)',fm(If,3)+' A')+meter('الفولتميتر V: E<sub>0</sub>',sgn(E,1)+' V')+meter('جهد مصدر المحرك',on?fm(Vs,1)+' V':'OFF');tables()}
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
  {err:`(١) <b>سرعة التجربة:</b> الخطوة الثالثة (المطبوعة برقم 2) تقول «ثبت السرعة n عند <span class="ltr">1500</span> لفة في الدقيقة»، بينما رأس جدول (2-1) يقول <span class="ltr">n = 1400 r.p.m</span>. اعتمدنا هنا <span class="ltr">${EXP2_N} rpm</span> (${N2TXT}) في الخطوات والجدول والمختبر. (٢) الخطوة الأولى تحيل إلى «الشكل (1)» والصحيح الشكل (2)، والرقم 1 مكرر في ترقيم الخطوات — صُحح الترقيم أعلاه. (٣) «قم بتوصل» ← «بتوصيل»، و«وكذالك» ← «وكذلك». (٤) الخطوة 3 تسمي الفولتميتر «V1» وهو على المخطط V (V<sub>L</sub>). (٥) الجدول مسمى تحته «شكل (2-1)» والصحيح «جدول (2-1)». (٦) في الأجهزة: «الملفات المجال» ← «ملفات المجال»، و«جهازين» ← «جهازا»، والبند 7 يجمع بندين («حمل … جهاز قياس السرعة») ففصلناهما. (٧) السؤال (د): «منفصل التعدية» ← «منفصل التغذية». (٨) الهدف يطلب حساب معامل تنظيم الجهد ولا يعطي الكتاب قانونه — أضفناه أعلاه.`},
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
   G=armSolve(v,{n:M0.n,Isep:If,RL:RLohm(),noAR,noVb});
   motorStep(M0,v,dt,{on,Vs,Pg:G.E*G.Ia});
   ang=(ang+M0.n/60*360*dt/25)%360;
   const sg=[on,fm(Vs,1),Math.round(M0.n),fm(If,3),RLp,fm(G.VL,1),fm(G.IL,2),noAR,noVb].join('|');
   if(sg!==sig){sig=sg;$('#l3c').innerHTML=benchSVG({kind:'sep',on,Vs,ang,If,E:G.E,VL:G.VL,IL:G.IL,RLp:RLp==='open'?null:RLp,n:M0.n});
    $('#l3m').innerHTML=meter('السرعة n',fm(Math.round(M0.n),0)+' rpm')+meter('I<sub>f</sub> (A1)',fm(If,3)+' A')+meter('I<sub>L</sub> (A2)',fm(G.IL,2)+' A')+meter('V<sub>L</sub> (V)',fm(G.VL,1)+' V')+meter('R<sub>L</sub>',RLp==='open'?'∞':fm(RLohm(),1)+' Ω');
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
  {err:'(١) قائمة الأجهزة ص 17: «مولد تيار مستمر توالي» والصحيح «توازي» (التجربة لمولد التوازي والمخطط يبين مجال توازي E1–E2)، والمحرك المُدير غير مذكور في القائمة مع أنه في المخطط. (٢) «ثانياً» الخطوة 1 ص 18: تحيل إلى «الجدول (3-1)» والصحيح الجدول (3-2) (السرعة 1500). (٣) «وذالك» ← «وذلك». (٤) الغرض والمطلوب 1 يذكران منحنى الجهد المتولد مع تيار المجال ولا توجد له قراءات في الجداول. (٥) الكتاب لا يذكر العلاقة \\(I_a=I_L+I_f\\) ولا الجهد المقنن.'},
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
   G=armSolve(v,{n:M0.n,Ish,sig:frev?-1:1,RL:RLohm()});
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
  {err:'(١) لا توجد قائمة أجهزة لهذه التجربة في الحقيبة. (٢) «في في جدول (4-1)» كلمة مكررة، و«عند كل تغير» ← «تغيير». (٣) السرعة المقننة والجهد المقنن وتيار الحمل المقنن غير مذكورة رقمياً؛ في المختبر أرقام توضيحية. (٤) المخطط يبين ثلاثة مصابيح فقط بينما المطلوب الوصول إلى نحو 125% من التيار المقنن وتسع قراءات؛ استعملنا تسعة مصابيح. (٥) قانون معامل تنظيم الجهد غير مذكور — أضفناه أعلاه. (٦) الكتاب لا يسمي النوعين؛ هما المركب التراكمي والمركب التفاضلي.'},
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
   G=armSolve(v,{n:M0.n,Ish,sig:1,RL:RL(),Rse:v.Rse,s:rev?-1:1});
   const tgt=G.Va/Math.max(v.Rsh+Rfg,1);G.tgt=tgt;Ish+=(tgt-Ish)*(1-Math.exp(-dt/Math.max(v.Tf,0.01)));
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
