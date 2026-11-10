/* Unit 1 (part B) — دوائر كهربائية-2: التوازي والسماحية، الرنين المتوازي، التوالي-التوازي، قوانين كيرشوف،
   ثم الفصل الثالث: القدرة في دوائر التيار المتردد (ص 42–74).
   Lessons u1-l8 … u1-l14. (u1-l1 … u1-l7 are in u1.js; the unit itself is declared in course.js.) */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const RD=B.round;
/* number with the given decimals but without trailing zeros (as the book prints 6, 0.2, 13.5 …) */
const f1=(x,d)=>{let v=RD(+x,d==null?2:d);if(v===0)v=0;return fm(v)};
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c2u1b-css'))return;const s=document.createElement('style');s.id='c2u1b-css';s.textContent=`
.cb-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:8px;min-width:0;flex:1 1 200px}
.cb-sl .cb-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.cb-sl .cb-h b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.cb-sl .cb-in{display:flex;gap:8px;align-items:center}
.cb-sl input[type=range]{flex:1;min-width:0;accent-color:var(--blue);direction:ltr;margin:4px 0}
.cb-sl input[type=number],.cb-ni input{width:92px;font:600 14px var(--mono);direction:ltr;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.cb-ni{display:flex;flex-direction:column;gap:2px;font-size:12.5px;min-width:0}
.cb-ni input{width:100%;box-sizing:border-box}
.cb-row{display:flex;gap:8px 12px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cb-row .sub{margin:0}
.cb-sls{display:flex;gap:2px 16px;flex-wrap:wrap}
.cb-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.cb-chip.ok{background:var(--on-soft);color:var(--on)}.cb-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.cb-chip.warn{background:var(--stop-soft);color:var(--stop)}.cb-chip.hot{background:var(--live-soft);color:var(--live)}
.cb-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.cb-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.cb-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0;overflow-x:auto}
.cb-zg{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px}
.cb-zc{border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:var(--surface-2);min-width:0}
.cb-zc h4{margin:0 0 6px;font-size:13.5px;display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;align-items:center}
.cb-zc h4 small{font:600 12.5px var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
.cb-in3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.cb-in2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.cb-mono{font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
.cb-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.cb-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:5px}
.cb-tbl{overflow-x:auto;position:relative}
.cb-tbl table.tt td,.cb-tbl table.tt th{padding:5px 7px}
.cb-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;align-items:end}
.cb-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.cb-try{margin:6px 0 0;padding-inline-start:20px}
.cb-lab .seg{flex-wrap:wrap;max-width:100%}
.cb-lab .seg button{white-space:nowrap}
.cb-dial{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.cb-bar{height:12px;border-radius:6px;background:var(--surface-2);overflow:hidden;margin-top:4px;border:1px solid var(--line)}
.cb-bar i{display:block;height:100%;transition:width .15s}
.cb-mat{overflow-x:auto;margin-top:6px}
.svgbox.cb-wide svg{min-width:540px}
`;document.head.appendChild(s)})();

/* ---------- complex numbers ---------- */
const Cx=(re,im)=>({re:+re,im:+(im||0)});
const cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im),csub=(a,b)=>Cx(a.re-b.re,a.im-b.im),
  cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im||1e-300;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},
  cabs=a=>Math.hypot(a.re,a.im),cang=a=>Math.atan2(a.im,a.re)/D,cpol=(m,deg)=>Cx(m*Math.cos(deg*D),m*Math.sin(deg*D)),
  cinv=a=>cdiv(Cx(1),a),cpar=(a,b)=>cdiv(cmul(a,b),cadd(a,b)),csc=(a,k)=>Cx(a.re*k,a.im*k);
/* TeX: polar and rectangular forms */
const PZ=(m,a,dm,da)=>`${f1(m,dm==null?2:dm)}\\angle ${f1(a,da==null?1:da)}^\\circ`;
const PZc=(z,dm,da)=>PZ(cabs(z),cang(z),dm,da);
const RZ=(z,d)=>{d=d==null?2:d;const r=f1(z.re,d),i=f1(Math.abs(z.im),d);return Math.abs(RD(z.re,d))===0&&RD(z.im,d)!==0?`${z.im<0?'-':''}j${i}`:`${r} ${z.im<0?'-':'+'} j${i}`};
/* plain text (inside .ltr spans) */
const PT=(z,dm,da)=>`${f1(cabs(z),dm==null?2:dm)}∠${f1(cang(z),da==null?1:da)}°`;
const RT=(z,d)=>{d=d==null?2:d;return `${f1(z.re,d)} ${z.im<0?'−':'+'} j${f1(Math.abs(z.im),d)}`};
const nat=z=>{const a=cang(z);return Math.abs(a)<0.05?'مادي بحت':a>0?'مادي - حثي':'مادي - سعوي'};   // nature of an impedance

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${typeof s.x==='function'?s.x():s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
/* range + number box kept in sync. onChange(value) */
const nsl=(id,label,min,max,step,val,unit)=>`<label class="cb-sl"><span class="cb-h"><span>${label}</span><b>${unit||''}</b></span><span class="cb-in"><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"><input type="number" id="${id}-n" min="${min}" max="${max}" step="any" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></span></label>`;
function nslBind(el,id,fn){const r=el.querySelector('#'+id),n=el.querySelector('#'+id+'-n');
  r.addEventListener('input',()=>{n.value=r.value;fn(+r.value)});
  n.addEventListener('input',()=>{const v=parseFloat(n.value);if(!isFinite(v))return;r.value=v;fn(v)});
  n.addEventListener('change',()=>{let v=parseFloat(n.value);if(!isFinite(v))v=+r.value;v=clamp(v,+n.min,+n.max);n.value=v;r.value=v;fn(v)});
  return v=>{r.value=v;n.value=v}}
const ni=(id,label,val,step)=>`<label class="cb-ni"><span>${label}</span><input type="number" id="${id}" value="${val}" step="${step||'any'}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="cb-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const legend=items=>`<div class="cb-leg">${items.map(([c,l])=>`<span><i style="background:var(${c})"></i>${l}</span>`).join('')}</div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4">​</tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="cb-q"><summary>${n}: ${q}</summary><div class="cb-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}

/* ---------- schematic drawing ---------- */
const stk=c=>`stroke="var(${c||'--fg'})" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const wire=(pts,c,dash)=>`<path ${stk(c)}${dash?` stroke-dasharray="${dash}"`:''} d="M${pts.map(p=>fx(p[0])+' '+fx(p[1])).join('L')}"/>`;
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.2" fill="var(--fg)"/>`;
/* component between two points. t: W wire, R resistor, L coil, C capacitor, Z box, V ac source, I current source.
   o:{l: label, l2: second line, side:1|-1 (above/right or below/left), c: colour var, b: body length, lc: label class} */
function comp(t,x1,y1,x2,y2,o){o=o||{};const c=o.c||'--fg';
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
  const b=Math.min(len-4,o.b||({V:36,I:36,C:12,Z:56,R:44,L:44}[t]||40));
  const cx=(x1+x2)/2,cy=(y1+y2)/2,ax=cx-ux*b/2,ay=cy-uy*b/2,bx=cx+ux*b/2,by=cy+uy*b/2;
  const P=(u,v)=>`${fx(cx+ux*u+nx*v)} ${fx(cy+uy*u+ny*v)}`;
  let s=t==='W'?`<path ${stk(c)} d="M${fx(x1)} ${fx(y1)}L${fx(x2)} ${fx(y2)}"/>`:`<path ${stk(c)} d="M${fx(x1)} ${fx(y1)}L${fx(ax)} ${fx(ay)}M${fx(bx)} ${fx(by)}L${fx(x2)} ${fx(y2)}"/>`;
  if(t==='R'){let d=`M${P(-b/2,0)}`;const n=6;for(let i=0;i<n;i++)d+=`L${P(-b/2+b/n*(i+0.5),(i%2?-1:1)*6)}`;d+=`L${P(b/2,0)}`;s+=`<path ${stk(c)} d="${d}"/>`}
  else if(t==='L'){const n=4,r=b/n/2;let d=`M${P(-b/2,0)}`;for(let i=1;i<=n;i++)d+=`A${fx(r)} ${fx(r)} 0 0 1 ${P(-b/2+b/n*i,0)}`;s+=`<path ${stk(c)} d="${d}"/>`}
  else if(t==='C'){s+=`<path ${stk(c)} d="M${P(-b/2,0)}L${P(-3.5,0)}M${P(3.5,0)}L${P(b/2,0)}"/><path stroke="var(${c})" stroke-width="3" d="M${P(-3.5,-12)}L${P(-3.5,12)}M${P(3.5,-12)}L${P(3.5,12)}"/>`}
  else if(t==='Z'){const h=11;s+=`<path stroke="var(${c})" stroke-width="1.8" fill="var(--surface)" d="M${P(-b/2,-h)}L${P(b/2,-h)}L${P(b/2,h)}L${P(-b/2,h)}Z"/>`}
  else if(t==='V'){const r=b/2;s+=`<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${r}" fill="var(--surface)" ${stk(c)}/><path ${stk(c)} d="M${fx(cx-10)} ${fx(cy)}Q${fx(cx-5)} ${fx(cy-10)} ${fx(cx)} ${fx(cy)}T${fx(cx+10)} ${fx(cy)}"/>`}
  else if(t==='I'){const r=b/2;s+=`<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${r}" fill="var(--surface)" ${stk(c)}/>`+(o.rev?arrow(cx+ux*10,cy+uy*10,cx-ux*10,cy-uy*10,c,1.8):arrow(cx-ux*10,cy-uy*10,cx+ux*10,cy+uy*10,c,1.8))}
  if(o.l!=null){const horiz=Math.abs(dx)>=Math.abs(dy),side=o.side||1,rr=(t==='V'||t==='I')?b/2+6:(t==='Z'?16:15);let lx,ly,an;
    if(horiz){lx=cx;ly=side>0?cy-rr-(o.l2!=null?14:0):cy+rr+12;an='middle'}
    else{lx=side>0?cx+rr:cx-rr;ly=cy+(o.l2!=null?-3:4);an=side>0?'start':'end'}
    s+=S.t(fx(lx),fx(ly),o.l,o.lc||'',an);if(o.l2!=null)s+=S.t(fx(lx),fx(ly+14),o.l2,'m',an);}
  if(o.in){s+=S.t(fx(cx),fx(cy+4),o.in,'','middle')}
  return s}
/* current arrow on a wire: dir r|l|u|d */
function cur(x,y,dir,lab,o){o=o||{};const L=o.L||22,v={r:[1,0],l:[-1,0],u:[0,-1],d:[0,1]}[dir];
  let s=arrow(x-v[0]*L/2,y-v[1]*L/2,x+v[0]*L/2,y+v[1]*L/2,o.c||'--stop',1.8);
  if(lab)s+=v[1]===0?S.t(x,y-(o.below?-16:8),lab,o.lc||'','middle'):S.t(x+(o.left?-7:7),y+4,lab,o.lc||'',o.left?'end':'start');return s}
/* clockwise mesh arrow */
function loopArrow(cx,cy,r,lab,col){col=col||'--blue';const a1=150*D,a2=(150+285)*D;const p1=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)],p2=[cx+r*Math.cos(a2),cy+r*Math.sin(a2)];
  const t=[-Math.sin(a2),Math.cos(a2)],h=9;const b=[p2[0]-t[0]*h,p2[1]-t[1]*h],n=[-t[1]*h*0.45,t[0]*h*0.45];
  return `<path d="M${fx(p1[0])} ${fx(p1[1])}A${r} ${r} 0 1 1 ${fx(p2[0])} ${fx(p2[1])}" fill="none" stroke="var(${col})" stroke-width="2"/><path d="M${fx(p2[0]+t[0]*2)} ${fx(p2[1]+t[1]*2)}L${fx(b[0]+n[0])} ${fx(b[1]+n[1])}L${fx(b[0]-n[0])} ${fx(b[1]-n[1])}Z" fill="var(${col})"/>`+(lab?S.t(cx,cy+5,lab,'b'):'')}
const svgO=(w,h,aria)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${aria||'دائرة'}">`;

/* ---------- phasor / triangle diagram ----------
   items:[{z, lab, col, g (scale group), from (start point, same group units), dash, w, line (no head)}]
   o:{w,h,pad,axes,arcs:[{a1,a2,r,lab}],note,eq (same scale for all groups)} */
function phasorSVG(items,o){o=o||{};const W=o.w||360,H=o.h||280,pad=o.pad==null?34:o.pad;
  const gmax={};items.forEach(it=>{const g=o.eq?'a':(it.g||'a');const tip=it.from?cadd(it.from,it.z):it.z;gmax[g]=Math.max(gmax[g]||0,cabs(it.z),cabs(tip),it.from?cabs(it.from):0)});
  const nz=(z,g)=>{const m=gmax[o.eq?'a':(g||'a')]||1;return Cx(z.re/m,z.im/m)};
  const segs=items.map(it=>{const a=it.from?nz(it.from,it.g):Cx(0);return {it,a,b:cadd(a,nz(it.z,it.g))}});
  let x0=0,x1=0,y0=0,y1=0;segs.forEach(s=>[s.a,s.b].forEach(p=>{x0=Math.min(x0,p.re);x1=Math.max(x1,p.re);y0=Math.min(y0,p.im);y1=Math.max(y1,p.im)}));
  const sc=Math.min((W-2*pad)/Math.max(x1-x0,0.05),(H-2*pad)/Math.max(y1-y0,0.05));
  const ox=pad+((W-2*pad)-(x1-x0)*sc)/2-x0*sc,oy=pad+((H-2*pad)-(y1-y0)*sc)/2+y1*sc;
  const M=p=>[ox+p.re*sc,oy-p.im*sc];
  let s=svgO(W,H,o.aria||'مخطط اتجاهي');
  if(o.axes!==false){s+=`<path d="M8 ${fx(oy)}H${W-8}M${fx(ox)} 8V${H-8}" stroke="var(--line)" stroke-width="1.2"/>`+S.t(W-10,fx(oy-6),o.xl||'','m','end')+S.t(fx(ox+6),16,o.yl||'j','m','start')}
  (o.arcs||[]).forEach(a=>{if(Math.abs(a.a2-a.a1)<0.5)return;const r=a.r||34,p1=[ox+r*Math.cos(a.a1*D),oy-r*Math.sin(a.a1*D)],p2=[ox+r*Math.cos(a.a2*D),oy-r*Math.sin(a.a2*D)],sw=a.a2>a.a1?0:1,lg=Math.abs(a.a2-a.a1)>180?1:0,am=(a.a1+a.a2)/2,m=[ox+(r+12)*Math.cos(am*D),oy-(r+12)*Math.sin(am*D)];
    s+=`<path d="M${fx(p1[0])} ${fx(p1[1])}A${r} ${r} 0 ${lg} ${sw} ${fx(p2[0])} ${fx(p2[1])}" fill="none" stroke="var(${a.col||'--muted'})" stroke-width="1.4"/>`+S.t(fx(m[0]),fx(m[1]+4),a.lab||'','m',Math.cos(am*D)>0.3?'start':Math.cos(am*D)<-0.3?'end':'middle')});
  segs.forEach(({it,a,b})=>{const p=M(a),q=M(b);const col=it.col||'--fg';
    s+=it.line?`<path d="M${fx(p[0])} ${fx(p[1])}L${fx(q[0])} ${fx(q[1])}" stroke="var(${col})" stroke-width="${it.w||1.4}" ${it.dash?`stroke-dasharray="${it.dash}"`:''}/>`:arrow(p[0],p[1],q[0],q[1],col,it.w||2.6,it.dash);
    if(it.lab){const dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy)||1;let tx,ty;
      if(it.mid){tx=(p[0]+q[0])/2+(-dy/L)*(it.mid*12);ty=(p[1]+q[1])/2+(dx/L)*(it.mid*12)+4}else{tx=q[0]+dx/L*10;ty=q[1]+dy/L*10+4}
      const an=it.anchor||((tx-(it.mid?(p[0]+q[0])/2:q[0]))>3?'start':(tx-(it.mid?(p[0]+q[0])/2:q[0]))<-3?'end':'middle');
      s+=`<text class="txt" x="${fx(tx)}" y="${fx(ty)}" text-anchor="${an}" style="fill:var(${it.lcol||col})">${it.lab}</text>`}});
  if(o.note)s+=arT(W-8,H-8,o.note,{a:'start',fs:11,col:'--muted'});
  return s+'</svg>'}

/* ---------- SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xf,yf,xl,yl,series:[{pts,col,w,dash}],under(X,Y),extra(X,Y)} ---------- */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||48,R=14,T=16,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);o.X=X;o.Y=Y;
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1.1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  const cid='cbc'+Math.random().toString(36).slice(2,8);s+=`<defs><clipPath id="${cid}"><rect x="${L}" y="${T-2}" width="${W-L-R}" height="${H-T-Bm+4}"/></clipPath></defs>`;
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path clip-path="url(#${cid})" d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-(o.y1-o.y0),o.y1+(o.y1-o.y0))))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.2}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const niceMax=t=>{t=Math.max(t,1e-9);const e=Math.pow(10,Math.floor(Math.log10(t)));return [1,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*e).find(v=>v>=t*0.999)};


/* ======================================================================
   Shared circuit figures for parallel circuits and current division
   ====================================================================== */
/* parallel circuit: o={src, srcType:'V'|'I', srcTop (label above the top wire), it (total-current label), br:[{t,l,l2,i,c}], sp, first} */
function parFig(o){const n=o.br.length,sp=o.sp||118,x0=o.x0||120,top=50,bot=190,xs=o.br.map((_,i)=>x0+(o.first||100)+i*sp),W=xs[n-1]+(o.wr||110);
  let s=svgO(W,bot+16,o.aria||'دائرة توازي');
  s+=wire([[x0,top],[xs[n-1],top]])+wire([[x0,bot],[xs[n-1],bot]]);
  s+=comp(o.srcType||'V',x0,bot,x0,top,{l:o.srcTop?null:o.src,side:-1});
  if(o.srcTop)s+=S.t(x0+8,top-12,o.src,'','start');
  if(o.srcIn)s+=S.t(x0-26,(top+bot)/2+4,o.srcIn,'','end');
  xs.forEach((x,i)=>{const b=o.br[i];if(b.parts){const y0=top+38,h=(bot-y0)/b.parts.length;s+=wire([[x,top],[x,y0]],b.c);b.parts.forEach((p,j)=>{s+=comp(p.t,x,y0+h*j,x,y0+h*(j+1),{l:p.l,l2:p.l2,side:1,c:b.c,b:Math.min(38,h-12)})})}else s+=comp(b.t,x,top,x,bot,{l:b.l,l2:b.l2,c:b.c,side:1});if(b.i)s+=cur(x,top+24,'d',b.i);if(i<n-1)s+=dot(x,top)+dot(x,bot)});
  if(o.it)s+=cur(x0+(o.first||100)/2,top,'r',o.it,{L:20});
  return s+'</svg>'}
/* current divider: o={iin, top:[{t,l}], bot:[{t,l}], i1, i2} */
function divFig(o){const xL=150,xR=o.xR||430,yT=45,yB=165,ym=105,W=xR+70;
  let s=svgO(W,yB+34,o.aria||'تفرع التيار في فرعين');
  s+=wire([[6,ym],[xL,ym]])+wire([[xR,ym],[W-6,ym]])+wire([[xL,yT],[xL,yB]])+wire([[xR,yT],[xR,yB]])+dot(xL,ym)+dot(xR,ym);
  const rail=(els,y,side)=>{const n=els.length,x1=xL+46,x2=xR-24,seg=(x2-x1)/n;let r=wire([[xL,y],[x1,y]])+wire([[x2,y],[xR,y]]);els.forEach((e,i)=>{r+=comp(e.t,x1+seg*i,y,x1+seg*(i+1),y,{l:e.l,l2:e.l2,side,c:e.c})});return r};
  s+=rail(o.top,yT,1)+rail(o.bot,yB,-1);
  s+=arrow(60,ym,96,ym,'--stop',1.8)+S.t(8,ym-10,o.iin||'','','start');
  if(o.i1)s+=cur(xL+24,yT,'r',o.i1,{L:18});if(o.i2)s+=cur(xL+24,yB,'r',o.i2,{L:18,below:true});
  return s+'</svg>'}
/* admittance (or impedance) diagram: G then each susceptance head-to-tail, then the total */
function admFig(G,Bs,o){o=o||{};const its=[{z:Cx(G,0),lab:o.gl||f1(G,2),col:'--fg',mid:1,anchor:'middle'}];let acc=Cx(G,0);
  Bs.forEach(b=>{its.push({z:Cx(0,b.v),from:acc,lab:b.l,col:b.col||'--muted',dash:'5 4',w:2,mid:-1});acc=cadd(acc,Cx(0,b.v))});
  its.push({z:acc,lab:o.tl,col:'--stop',w:2.8,mid:1});
  return phasorSVG(its,{w:o.w||320,h:o.h||230,eq:true,arcs:[{a1:0,a2:cang(acc),r:40,lab:o.al||f1(cang(acc),1)+'°'}],aria:o.aria||'شكل السماحية',yl:'j'})}

/* ---- الشكل (1-31) ---- */
function fig131(){let s=svgO(720,215,'الشكل 1-31 دائرة التوازي والدائرة المكافئة');
  const top=50,bot=190,x0=110;const xs=[200,290,430];
  s+=wire([[x0,top],[290,top]])+wire([[290,top],[430,top]],'--fg','3 5')+wire([[x0,bot],[290,bot]])+wire([[290,bot],[430,bot]],'--fg','3 5');
  s+=comp('V',x0,bot,x0,top,{l:'V',side:-1})+cur(155,top,'r',sb('I','T'));
  [['1',200],['2',290],['N',430]].forEach(([k,x],i)=>{s+=comp('Z',x,top,x,bot,{l:sb('Z',k)})+cur(x,top+24,'d',sb('I',k));if(i<2)s+=dot(x,top)+dot(x,bot)});
  s+=S.t(365,125,'. . .','','middle');
  s+=`<path d="M490 20V200" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  s+=wire([[560,top],[660,top],[660,bot],[560,bot]])+comp('V',560,bot,560,top,{l:'V',side:-1})+cur(610,top,'r',sb('I','T'))+comp('Z',660,top,660,bot,{l:sb('Z','T')});
  return s+'</svg>'}

/* ======================================================================
   Lesson 8 — parallel circuits, admittance, current divider (ص 42–48)
   ====================================================================== */
/* worked examples 1-2-7 … 1-2-9: one procedure with the book's rounding (2 dp for Y, 1 dp for angles and Z_T) */
function parSteps(g,parts){const V=g.V,th=g.th;const G=parts.R?RD(1/g.R,2):0,BL=parts.L?RD(1/g.XL,2):0,BC=parts.C?RD(1/g.XC,2):0;
  const Bt=RD(BC-BL,2),Y=RD(Math.hypot(G,Bt),2),ya=RD(Math.atan2(Bt,G)/D,1),Z=RD(1/Y,1),It=RD(Y*V,2);
  const terms=[],nums=[];if(parts.R){terms.push('\\frac{1}{R}');nums.push(`\\frac{1}{${g.R}}`)}if(parts.L){terms.push('\\frac{1}{jX_L}');nums.push(`\\frac{1}{j${g.XL}}`)}if(parts.C){terms.push('\\frac{1}{-jX_C}');nums.push(`\\frac{1}{-j${g.XC}}`)}
  const yr=RZ(Cx(G,Bt),2);
  const st=[
   {t:'السماحية المكافئة: نجمع سماحيات الفروع (المعادلة 1-38)',f:`Y_T = ${terms.join(' + ')} = ${nums.join(' + ')}`},
   {f:`Y_T = ${yr}\\ \\text{S} = ${PZ(Y,ya,2,1)}\\ \\text{S}`,final:true},
   {t:'المعاوقة المكافئة:',f:`Z_T = \\frac{1}{Y_T} = \\frac{1}{${PZ(Y,ya,2,1)}} = ${PZ(Z,-ya,1,1)}\\ \\Omega`,final:true},
   {t:'التيار الكلي:',f:`I_T = \\frac{V}{Z_T} = Y_T\\,V = ${PZ(Y,ya,2,1)}\\times ${PZ(V,th,2,1)} = ${PZ(It,ya+th,2,1)}\\ \\text{A}`,final:true}];
  if(parts.R)st.push({t:'تيار المقاومة (بنفس طور الجهد):',f:`I_R = \\frac{V}{R} = \\frac{${PZ(V,th,2,1)}}{${g.R}} = ${PZ(RD(V/g.R,1),th,1,1)}\\ \\text{A}`});
  if(parts.L)st.push({t:'تيار الملف (متأخر 90°):',f:`I_L = \\frac{V}{jX_L} = \\frac{${PZ(V,th,2,1)}}{${PZ(g.XL,90,2,0)}} = ${PZ(RD(V/g.XL,1),th-90,1,1)}\\ \\text{A}`});
  if(parts.C)st.push({t:'تيار المكثف (متقدم 90°):',f:`I_C = \\frac{V}{-jX_C} = \\frac{${PZ(V,th,2,1)}}{${PZ(g.XC,-90,2,0)}} = ${PZ(RD(V/g.XC,1),th+90,1,1)}\\ \\text{A}`});
  if(parts.R&&parts.L&&parts.C){const r=(m,a)=>Cx(RD(m*Math.cos(a*D),1),RD(m*Math.sin(a*D),1));const a=r(RD(V/g.R,1),th),b=r(RD(V/g.XL,1),th-90),c=r(RD(V/g.XC,1),th+90),sum=cadd(cadd(a,b),c);
    st.push({t:'نتحقق أن مجموع تيارات الفروع يساوي التيار الكلي (قانون كيرشوف للتيار):',f:`I_T = I_R + I_L + I_C = (${RZ(a,1)}) + (${RZ(b,1)}) + (${RZ(c,1)}) = ${RZ(sum,1)}\\ \\text{A}`,final:true},
     {t:'<b>توضيح للمتدرب (ليس من الكتاب):</b> بالصورة القطبية',f:`${RZ(sum,1)} = ${PZc(sum,2,1)}\\ \\text{A}\\ \\approx I_T`});}
  st.push({t:Bt<0?'التيار الكلي يتأخر عن الجهد: الحمل مادي - حثي.':Bt>0?'التيار الكلي يتقدم على الجهد: الحمل مادي - سعوي.':'التيار الكلي بنفس طور الجهد: الحمل مادي بحت.'});
  return st}
const G127=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:30},{id:'th',label:'زاوية الجهد',sym:'\\theta_v',unit:'°',value:0},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:5,min:0.01},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:2,min:0.01}];
const G128=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:20},{id:'th',label:'زاوية الجهد',sym:'\\theta_v',unit:'°',value:30},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:3.33,min:0.01},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:2.5,min:0.01}];
const G129=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'th',label:'زاوية الجهد',sym:'\\theta_v',unit:'°',value:53.1},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:4,min:0.01},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:5,min:0.01},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:3.33,min:0.01}];
/* example 1-2-10 — current divider with the book's rounding */
function divSteps(g){const It=cpol(g.I,g.th);const Z1=Cx(g.R,g.XL),Zc=Cx(0,-g.XC),Ss=cadd(Z1,Zc);
  const sm=RD(cabs(Ss),2),sa=RD(cang(Ss),1),z1m=RD(cabs(Z1),2),z1a=RD(cang(Z1),1);
  const n1m=RD(g.XC*g.I,2),n1a=RD(-90+g.th,1),i1m=RD(n1m/sm,2),i1a=RD(n1a-sa,1);
  const n2m=RD(z1m*g.I,2),n2a=RD(z1a+g.th,1),i2m=RD(n2m/sm,2),i2a=RD(n2a-sa,1);
  const chk=cadd(cpol(i1m,i1a),cpol(i2m,i2a));
  return [
   {t:'تيار الفرع الأول (R و L): المعاوقة «في الطرف الآخر» هي معاوقة المكثف (المعادلة 1-40)',f:`I_{RL} = \\frac{(-jX_C)\\,I_T}{(R + jX_L) + (-jX_C)} = \\frac{(${PZ(g.XC,-90,2,0)})(${PZ(g.I,g.th,2,1)})}{${f1(g.R)} + j${f1(g.XL)} - j${f1(g.XC)}}`},
   {f:`I_{RL} = \\frac{${PZ(n1m,n1a,2,1)}}{${PZ(sm,sa,2,1)}} = ${PZ(i1m,i1a,2,1)}\\ \\text{A}`,final:true},
   {t:'تيار المكثف: المعاوقة «في الطرف الآخر» هي \\(R + jX_L\\)',f:`I_C = \\frac{(R + jX_L)\\,I_T}{(R + jX_L) + (-jX_C)} = \\frac{(${PZ(z1m,z1a,2,1)})(${PZ(g.I,g.th,2,1)})}{${PZ(sm,sa,2,1)}}`},
   {f:`I_C = \\frac{${PZ(n2m,n2a,2,1)}}{${PZ(sm,sa,2,1)}} = ${PZ(i2m,i2a,2,1)}\\ \\text{A}`,final:true},
   {t:'<b>توضيح للمتدرب (ليس من الكتاب):</b> نتحقق بقانون كيرشوف للتيار: مجموع تياري الفرعين يساوي التيار الداخل',f:`I_{RL} + I_C = ${RZ(chk,2)} = ${PZc(chk,2,1)}\\ \\text{A} \\approx I_T`},
   (i1m>g.I||i2m>g.I)?{t:'<b>توضيح للمتدرب (ليس من الكتاب):</b> تيار كل فرع هنا أكبر من التيار الكلي، لأن الفرع الحثي والفرع السعوي يلغي كل منهما جزءاً من تيار الآخر (قريب من حالة الرنين).'}:null
  ].filter(Boolean)}
const G1210=[{id:'I',label:'التيار الكلي الداخل',sym:'I_T',unit:'A',value:10},{id:'th',label:'زاوية التيار',sym:'\\theta',unit:'°',value:30},{id:'R',label:'مقاومة الفرع الأول',sym:'R',unit:'Ω',value:2},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:7},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:3}];

/* phasor figure of a parallel circuit: V and the branch currents, summed head-to-tail */
function parPhasor(V,th,cs,o){o=o||{};const its=V?[{z:cpol(V,th),lab:'V',col:'--fg',g:'V',w:2.2}]:[];let acc=Cx(0);
  cs.forEach(c=>{its.push({z:c.z,from:o.chain&&acc.re!==0||o.chain&&acc.im!==0?acc:null,lab:c.lab,col:c.col,g:'I',mid:o.chain?-1:0});if(o.chain)acc=cadd(acc,c.z)});
  const tot=cs.reduce((a,c)=>cadd(a,c.z),Cx(0));
  if(o.chain)its.push({z:tot,lab:sb('I','T'),col:'--stop',g:'I',w:3,mid:1});
  else if(cs.length===2){its.push({z:tot,lab:sb('I','T'),col:'--stop',g:'I',w:3});its.push({z:cs[1].z,from:cs[0].z,line:1,dash:'4 4',col:'--muted',g:'I'},{z:cs[0].z,from:cs[1].z,line:1,dash:'4 4',col:'--muted',g:'I'})}
  return phasorSVG(its,{w:o.w||340,h:o.h||270,arcs:o.arcs,aria:o.aria||'الشكل المطاور للتيارات والجهد',note:'V و I بمقياسين مختلفين'})}

B.lesson({
 id:'u1-l8',unit:1,order:8,pages:'42–48',
 title:'دوائر التوازي والسماحية وقانون توزيع التيار',
 summary:'في دائرة التوازي يتعرض كل فرع للجهد نفسه ويتوزع التيار بين الفروع. نجمع السماحيات (Y = 1/Z) بدل المعاوقات، ونرسم شكل السماحية والشكل المطاور للتيارات، ثم نحسب تيار كل فرع من فرعين بقانون توزيع التيار. مع الأمثلة (1-2-7) إلى (1-2-10).',
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

  {st:1,short:'التوصيل على التوازي',title:'التوصيل على التوازي',ref:'ص 42–43',
   q:'عندما تشغّل في البيت مصباحاً ومروحة وثلاجة معاً: هل يأخذ كل جهاز جهد المصدر كاملاً، أم يتقاسمونه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة توازي: مصدر جهد وفروع Z1 و Z2 و ZN بين السلكين العلوي والسفلي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M55 142.0 L55 90 L300 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M55 178.0 L55 230 L300 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مصدر الجهد ⟦V⟧: كل فرع موصول بين طرفيه مباشرة، فلكل الفروع الجهد ⟦V⟧ نفسه."><circle cx="55" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M45 160.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="55" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V</text><rect x="29" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر: يتوزع على الفروع ثم يجتمع ويعود."><line x1="77.0" y1="78.0" x2="109.0" y2="78.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="117.0,78.0 109.0,82.8 109.0,73.2" fill="#12855A"/><text x="97" y="70" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="73" y="54" width="50" height="30" rx="6" fill="transparent"/></g><path d="M130 90 L130 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M130 182.0 L130 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="119" y="138.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="130" cy="90" r="4.5" fill="#2C4A40"/><circle cx="130" cy="230" r="4.5" fill="#2C4A40"/><text x="148" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="109.0" y1="130.0" x2="109.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="109.0,158.0 104.8,151.0 113.2,151.0" fill="#12855A"/><text x="107" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><path d="M205 90 L205 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 182.0 L205 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="194" y="138.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="205" cy="90" r="4.5" fill="#2C4A40"/><circle cx="205" cy="230" r="4.5" fill="#2C4A40"/><text x="223" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="184.0" y1="130.0" x2="184.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="184.0,158.0 179.8,151.0 188.2,151.0" fill="#12855A"/><text x="182" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><g data-tip="الفرع الأخير ⟦ZN⟧: قد يكون في الدائرة أي عدد ⟦N⟧ من الفروع، والنقاط بين الفرعين تعني «وفروع أخرى»."><path d="M300 90 L300 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M300 182.0 L300 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="289" y="138.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="318" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">N</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="279.0" y1="130.0" x2="279.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="279.0,158.0 274.8,151.0 283.2,151.0" fill="#12855A"/><text x="277" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">N</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="270" y="98" width="62" height="124" rx="6" fill="transparent"/></g><circle cx="252" cy="160" r="3" fill="#2C4A40"/><circle cx="260" cy="160" r="3" fill="#2C4A40"/><circle cx="268" cy="160" r="3" fill="#2C4A40"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">كل الفروع بين السلكين نفسيهما</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan> = I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan> + I<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan> + ⋯ + I<tspan font-size="10" dy="4">N</tspan><tspan dy="-4">&#8203;</tspan></text></svg>`,
   cap:'دائرة التوازي كما في الشكل <span class="ltr">(1-31)</span>: كل فرع موصول بين السلكين العلوي والسفلي مباشرة.<br><b>مرّر المؤشر على المصدر وسهم التيار الكلي والفرع الأخير (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في دائرة التوازي، ما الكمية الواحدة المشتركة بين كل الفروع؟',opts:[
     ['التيار',false,'التيار يتفرع: لكل فرع تياره، ومجموعها هو التيار الكلي.'],
     ['الجهد',true,'نص الكتاب: المعاوقات «خاضعة لنفس الجهد المؤثر بين أطرافها».'],
     ['المعاوقة',false,String.raw`لكل فرع معاوقته الخاصة \(Z_1, Z_2, \ldots\)؛ المشترك هو الجهد.`]]}}
   ],
   body:[
    {book:String.raw`<p>يبين الشكل <span class="ltr">1-31</span> دائرة توازي وهي تتكون من مصدر جهد ومن معاوقات <b>خاضعة لنفس الجهد</b> المؤثر بين أطرافها. ونستطيع تمثيل هذه المعاوقات بمعاوقة مكافئة \(Z_T\).</p>
     <p>وباستعمال قانون كيرشوف للتيار</p>$$I_T = I_1 + I_2 + \cdots + I_N$$<p>وقانون أوم</p>$$I_x=\frac{V}{Z_x}\ ,\qquad I_T=\frac{V}{Z_T}$$<p>حيث \(x = 1, 2, \ldots, N\)، نستنتج</p>
     <div class="eq">$$\frac{1}{Z_T}=\frac{1}{Z_1}+\frac{1}{Z_2}+\cdots+\frac{1}{Z_N}$$<span class="eqno">(1-37)</span></div>`,ref:'ص 42–43'},
    {tip:String.raw`<p>من أين جاءت (1-37)؟ نعوّض قانون أوم في قانون كيرشوف: \(\frac{V}{Z_T}=\frac{V}{Z_1}+\frac{V}{Z_2}+\cdots\)، ثم نقسم الطرفين على \(V\) لأنه واحد في كل الفروع.</p>
     <p>والتيارات هنا <b>متجهات</b> (أعداد مركبة): نجمعها جمعاً اتجاهياً، لا بجمع أطوالها فقط.</p>`,title:'خطوة واحدة من كيرشوف إلى (1-37)'},
    {add:String.raw`<p>أجهزة البيت كلها موصلة على التوازي: لذلك يعمل كل جهاز على جهد المصدر نفسه، وإطفاء جهاز لا يطفئ غيره. ولو وُصلت على التوالي لتقاسمت الجهد، ولانطفأت كلها إذا انقطع أحدها.</p>`,title:'التوازي في بيتك'},
    {watch:String.raw`<p>في التيار المستمر تكون المقاومة المكافئة لمقاومات على التوازي أصغر من أصغرها دائماً. أما مع الملف والمكثف معاً فقد تخرج المعاوقة المكافئة <b>أكبر</b> من كل فرع؛ سترى ذلك في المثال <span class="ltr">(1-2-12)</span> في الدرس القادم.</p>`},
    {watch:String.raw`<p>في الشكل <span class="ltr">(1-31)</span> في الكتاب كُتبت المعاوقة في الدائرة المكافئة \(Z_1\)، والصحيح \(Z_T\).</p>`,fix:true},
    {title:'مختبر مصغّر: ماذا يحدث في دائرة التوازي؟',widget:(el,B)=>DCML.cases(el,B,{intro:'موقفان من دائرة توازي مثل الشكل <span class="ltr">(1-31)</span>.',cases:[
     {q:'فصلت أحد الفروع (أطفأت جهازاً). ماذا يحدث للجهد على الفروع الباقية؟',opts:[
      ['يزيد لأن الحمل قلّ',false,'كل فرع موصول بين السلكين مباشرة، فجهده جهد المصدر نفسه.'],
      ['يبقى جهد المصدر نفسه',true,'المعاوقات «خاضعة لنفس الجهد المؤثر بين أطرافها»، ولا علاقة لذلك بعدد الفروع.'],
      ['ينقطع عنها التيار',false,'هذا يحدث في التوالي، لا في التوازي.']]},
     {q:'أضفت فرعاً جديداً. ماذا يحدث لتيار كل فرع من الفروع القديمة؟',opts:[
      ['لا يتغير',true,String.raw`\(I_x=V/Z_x\)، والجهد ومعاوقة الفرع لم يتغيرا. الذي يتغير هو التيار الكلي.`],
      ['يقل لأن الفرع الجديد يأخذ جزءاً منه',false,'الفرع الجديد يأخذ تياره من المصدر، لا من الفروع الأخرى.'],
      ['يتضاعف',false,'لا سبب لذلك؛ الجهد على الفرع ثابت.']]}]})}
   ]},

  {st:2,short:'السماحية المركبة',title:'السماحية المركبة <span class="ltr">Y</span>',ref:'ص 43',
   q:'إذا كان جمع المقلوبات في (1-37) متعباً، فلماذا لا نتعامل مع المقلوب نفسه من البداية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مستوى السماحية: الموصلية G أفقياً لليمين، والتقبلية السعوية لأعلى، والتقبلية الحثية لأسفل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M100 175 L320 175" fill="none" stroke="#8A9A93" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 280 L120 55" fill="none" stroke="#8A9A93" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><text x="326" y="180" text-anchor="start" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">G</text><text x="130" y="61" text-anchor="start" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">jB</text><g data-tip="الموصلية ⟦G⟧: الجزء الحقيقي من السماحية، وهي مقلوب المقاومة، وموجبة دائماً."><line x1="120.0" y1="175.0" x2="259.0" y2="175.0" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><polygon points="270.0,175.0 259.0,181.6 259.0,168.4" fill="#2C4A40"/><text x="200" y="199" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الموصلية G</text><rect x="120" y="161" width="160" height="46" rx="6" fill="transparent"/></g><g data-tip="تقبلية سعوية ⟦+jB⟧: يعطيها المكثف، وهي موجبة فتتجه لأعلى."><line x1="120.0" y1="175.0" x2="120.0" y2="86.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="120.0,75.0 126.6,86.0 113.4,86.0" fill="#4FB3A9"/><text x="180" y="105" text-anchor="middle" font-size="13" fill="#1F7A72" font-weight="700" direction="rtl">تقبلية سعوية</text><text x="180" y="123" text-anchor="middle" font-size="13" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">+jB</text><rect x="110" y="65" width="110" height="110" rx="6" fill="transparent"/></g><g data-tip="تقبلية حثية ⟦−jB⟧: يعطيها الملف، وهي سالبة فتتجه لأسفل."><line x1="120.0" y1="175.0" x2="120.0" y2="249.0" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="120.0,260.0 113.4,249.0 126.6,249.0" fill="#E8735A"/><text x="178" y="237" text-anchor="middle" font-size="13" fill="#B5523C" font-weight="700" direction="rtl">تقبلية حثية</text><text x="178" y="255" text-anchor="middle" font-size="13" fill="#B5523C" font-weight="700" direction="ltr" font-family="var(--mono)">−jB</text><rect x="110" y="179" width="110" height="90" rx="6" fill="transparent"/></g><text x="200" y="36" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Y = 1/Z = G + jB</text></svg>`,
   cap:'السماحية لها جزء حقيقي (الموصلية) وجزء تخيلي (التقبلية) قد يكون موجباً أو سالباً.<br><b>مرّر المؤشر على الأسهم الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`ملف وحده ممانعته \(X_L\): ما إشارة التقبلية التي يعطيها؟`,opts:[
     ['موجبة',false,String.raw`الموجبة هي التقبلية السعوية (المكثف).`],
     ['صفر',false,String.raw`الصفر للمقاومة وحدها؛ الملف له تقبلية.`],
     ['سالبة',true,String.raw`\(Y=\frac{1}{jX_L}=-j\frac{1}{X_L}\)، والكتاب يقول: التقبلية «سالبة (تقبلية حثية)».`]]}}
   ],
   body:[
    {book:String.raw`<p>وهنا يستحسن استعمال <b>السماحيات المركبة</b> \(Y\) عوضاً عن المعاوقات \(Z\)، حيث \(Y = 1/Z\)، وبهذا نكتب المعادلة <span class="ltr">1-37</span> كما يلي</p>
     <div class="eq">$$Y_T = Y_1 + Y_2 + \cdots + Y_N$$<span class="eqno">(1-38)</span></div>
     <p>ووحدة السماحية هي <b>Siemens</b> (ورمزها <span class="ltr">S</span>) أما شكلها العام فهو</p>
     <div class="eq">$$Y_T = G_T + j\,B_T$$<span class="eqno">(1-39)</span></div>
     <p>والجزء الحقيقي \(G_T\) يسمى <b>الموصلية</b> (مقلوب المقاومة) وهي موجبة، أما الجزء التخيلي \(B_T\) فيسمى <b>التقبلية</b> ويمكن أن تكون موجبة (تقبلية سعوية) أو سالبة (تقبلية حثية).</p>`,ref:'ص 43'},
    {title:'اختر العنصر وتابع إشارة سماحيته',widget:(el,B)=>{
      const D={R:[String.raw`المعاوقة \(Z=R\)`,String.raw`السماحية \(Y=\frac{1}{R}\)`,'جزء حقيقي فقط','موصلية \\(G\\) موجبة، ولا تقبلية'],
               L:[String.raw`المعاوقة \(Z=jX_L\)`,String.raw`السماحية \(Y=\frac{1}{jX_L}\)`,String.raw`لأن \(\frac{1}{j}=-j\)`,String.raw`\(Y=-j\frac{1}{X_L}\): تقبلية حثية سالبة`],
               C:[String.raw`المعاوقة \(Z=-jX_C\)`,String.raw`السماحية \(Y=\frac{1}{-jX_C}\)`,String.raw`لأن \(\frac{1}{-j}=+j\)`,String.raw`\(Y=+j\frac{1}{X_C}\): تقبلية سعوية موجبة`]};
      let k='R',tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=D[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">العنصر:</span><span class="mseg">${[['R','مقاومة'],['L','ملف'],['C','مكثف']].map(([v,l])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
         <div class="chain" style="margin-top:12px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        B.math(el);
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {tip:String.raw`<p>لاحظ أن الإشارات <b>معكوسة</b> عن المعاوقة: الملف يعطي \(+j\) في المعاوقة و\(-j\) في السماحية، والمكثف بالعكس. والسبب أن \(\frac{1}{j}=-j\).</p>
     <p>وفائدة السماحية: في التوازي نجمع السماحيات جمعاً مباشراً (1-38)، كما نجمع المعاوقات في التوالي. ثم إن احتجنا المعاوقة أخذنا المقلوب مرة واحدة في النهاية: \(Z_T=1/Y_T\).</p>`,title:'لماذا انعكست الإشارة؟'},
    {add:String.raw`<p>في بعض الكتب القديمة وعلى بعض أجهزة القياس تُكتب وحدة الموصلية والسماحية <span class="ltr">mho</span> (كلمة <span class="ltr">ohm</span> معكوسة) ورمزها <span class="ltr">℧</span>، وهي نفسها السيمنز <span class="ltr">S</span>.</p>`,title:'وحدة بأسماء أخرى'}
   ]},

  {st:3,short:'مثال <span class="ltr">(1-2-7)</span>',title:'مثال <span class="ltr">(1-2-7)</span>: مقاومة وملف على التوازي',ref:'ص 43–44',
   q:'مقاومة وملف على التوازي: هل يتقدم التيار الكلي على الجهد أم يتأخر عنه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-32: مقاومة 5 أوم وملف 2 أوم على التوازي مع مصدر 30 فولت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M62 142.0 L62 90 L275 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M62 178.0 L62 230 L275 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦30∠0° V⟧: جهد الفرعين معاً."><circle cx="62" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M52 160.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="62" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">30∠0° V</text><rect x="36" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر، وهو مجموع تيارات الفروع (جمعاً اتجاهياً)."><line x1="84.0" y1="78.0" x2="116.0" y2="78.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="124.0,78.0 116.0,82.8 116.0,73.2" fill="#12855A"/><text x="104" y="70" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="80" y="54" width="50" height="30" rx="6" fill="transparent"/></g><g data-tip="مقاومة ⟦5 Ω⟧: تيارها ⟦IR⟧ في طور الجهد نفسه."><path d="M170 90 L170 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170 182.0 L170 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170 138.0 L177 145.33333333333334 L163 152.66666666666666 L177 160.0 L163 167.33333333333334 L177 174.66666666666666 L170 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="170" cy="90" r="4.5" fill="#2C4A40"/><circle cx="170" cy="230" r="4.5" fill="#2C4A40"/><text x="189" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R</text><text x="189" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><line x1="149.0" y1="130.0" x2="149.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="149.0,158.0 144.8,151.0 153.2,151.0" fill="#12855A"/><text x="147" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">R</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="140" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="ملف ممانعته ⟦XL = 2 Ω⟧: تياره ⟦IL⟧ يتأخر عن الجهد بزاوية ⟦90°⟧."><path d="M275 90 L275 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 182.0 L275 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 138.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="294" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><text x="294" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2 Ω</text><line x1="254.0" y1="130.0" x2="254.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="254.0,158.0 249.8,151.0 258.2,151.0" fill="#12855A"/><text x="252" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="245" y="98" width="62" height="124" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-32)</span>: مقاومة <span class="ltr">5 Ω</span> وملف <span class="ltr">2 Ω</span> على التوازي.<br><b>مرّر المؤشر على المصدر والفرعين وسهم التيار الكلي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قبل الحل: التيار الكلي في هذه الدائرة…',opts:[
     ['يتأخر عن الجهد',true,'الحمل مادي - حثي، والكتاب يقول في آخر الحل: «التيار الكلي يتأخر عن الجهد».'],
     ['يتقدم على الجهد',false,'التقدم يحدث مع المكثف؛ هنا ملف.'],
     ['في طور الجهد نفسه',false,'هذا لو كانت الدائرة مقاومة فقط؛ الملف يسحب تياراً متأخراً بزاوية <span class="ltr">90°</span>.']]}}
   ],
   body:[
    {book:String.raw`<p>في دائرة التوازي الموضحة في الشكل <span class="ltr">1-32</span>، احسب السماحية المكافئة وارسم شكلها، ثم احسب التيار الكلي وارسم الشكل المطاور للتيارات والجهد المؤثر.</p>
     <p><b>الحل:</b></p>$$Y_T=\frac{1}{R}+\frac{1}{jX_L}=\frac{1}{5}+\frac{1}{j2}=0.2-j0.5\ \text{S}=0.54\angle -68.2^\circ\ \text{S}$$
     $$Z_T=\frac{1}{Y_T}=\frac{1}{0.54\angle -68.2^\circ}=1.9\angle 68.2^\circ\ \Omega$$
     <p>ويبين الشكل <span class="ltr">1-33a</span> شكل السماحية.</p>
     $$I_T=\frac{V}{Z_T}=Y_T\,V=0.54\angle -68.2^\circ\times 30\angle 0^\circ=16.2\angle -68.2^\circ\ \text{A}$$
     $$I_R=\frac{V}{R}=\frac{30\angle 0^\circ}{5}=6\angle 0^\circ\ \text{A}\qquad I_L=\frac{V}{jX_L}=\frac{30\angle 0^\circ}{2\angle 90^\circ}=15\angle -90^\circ\ \text{A}$$
     <p>ويوضح الشكل <span class="ltr">1-33b</span> الشكل المطاور للتيارات والجهد المؤثر. وكما نرى فإن التيار الكلي <b>يتأخر</b> عن الجهد وذلك لأن الحمل مادي - حثي.</p>`,ref:'ص 43–44'},
    {html:`<div class="cb-figs"><figure>${box(admFig(0.2,[{v:-0.5,l:'−j0.5'}],{tl:sb('Y','T')+' = 0.54',gl:'0.20'}),300)}الشكل <span class="ltr">(1-33a)</span></figure><figure>${box(parPhasor(30,0,[{z:cpol(6,0),lab:sb('I','R'),col:'--muted'},{z:cpol(15,-90),lab:sb('I','L'),col:'--live'}],{arcs:[{a1:0,a2:-68.2,r:44,lab:'−68.2°'}]}),320)}الشكل <span class="ltr">(1-33b)</span></figure></div>`},
    {tip:String.raw`<p>اقرأ الشكل المطاور هكذا: \(I_R=6\ \text{A}\) على اتجاه الجهد نفسه، و\(I_L=15\ \text{A}\) لأسفل (متأخر <span class="ltr">90°</span>). ولأنهما متعامدان فطول المحصلة \(\sqrt{6^2+15^2}\approx 16.2\ \text{A}\)، وهو التيار الكلي نفسه.</p>
     <p>ولاحظ أن زاوية \(I_T\) هي زاوية \(Y_T\) نفسها (<span class="ltr">−68.2°</span>) لأن زاوية الجهد صفر.</p>`,title:'تحقق من الرسم'},
    {watch:String.raw`<p>\(\frac{1}{j2}\) ليست \(+j0.5\): بما أن \(\frac{1}{j}=-j\) فإن \(\frac{1}{j2}=-j0.5\). الخطأ في هذه الإشارة يقلب الحمل من حثي إلى سعوي.</p>`},
    {title:'مختبر مصغّر: أثر إشارة <span class="ltr">1/(j2)</span>',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام المثال: <span class="ltr">R = 5 Ω</span> و<span class="ltr">X<sub>L</sub> = 2 Ω</span> و<span class="ltr">V = 30∠0° V</span>. اختر قيمة \\(\\frac{1}{j2}\\) وشاهد ماذا يحدث للنتيجة.',
 predict:{q:String.raw`كم تساوي \(\frac{1}{j2}\)؟`,opts:[
  [String.raw`\(+j0.5\)`,false,String.raw`\(\frac1j=-j\)، فالإشارة سالبة.`],
  [String.raw`\(-j0.5\)`,true,String.raw`\(\frac{1}{j2}=\frac{1}{j}\times\frac12=-j0.5\)، وهي تقبلية حثية.`],
  [String.raw`\(0.5\)`,false,'الملف لا يعطي موصلية حقيقية.']]},
 ins:[{k:'s',l:'قيمة <span class="ltr">1/(j2)</span> المستعملة',seg:[[-1,'<span class="ltr">−j0.5</span> (الصحيحة)'],[1,'<span class="ltr">+j0.5</span> (خطأ)']],v:-1}],
 calc:(s,P,B)=>{const Y=Cx(0.2,0.5*s.s),Z=cdiv(Cx(1,0),Y),I=cmul(Y,Cx(30,0)),ok=s.s<0;
  return {facts:[['Y<sub>T</sub>',`0.2 ${ok?'−':'+'} j0.5 S`],['Y<sub>T</sub> قطبياً (S)',PT(Y,2,1)],['Z<sub>T</sub> (Ω)',PT(Z,1,1)],['I<sub>T</sub> (A)',PT(I,1,1),ok?'hi':'bad']],
   msg:ok?'مطابق للكتاب: التيار متأخر <span class="ltr">68.2°</span>، والحمل مادي - حثي كما يجب لمقاومة مع ملف.':'الإشارة الخاطئة قلبت الحمل إلى سعوي (التيار متقدم)، مع أن الدائرة فيها ملف لا مكثف.',cls:ok?'':'bad'}}})}
   ]},

  {st:4,short:'مثال <span class="ltr">(1-2-8)</span>',title:'مثال <span class="ltr">(1-2-8)</span>: مقاومة ومكثف على التوازي',ref:'ص 44–45',
   q:'استبدلنا الملف بمكثف، وجعلنا زاوية الجهد <span class="ltr">30°</span>: إلى أين يتجه التيار الكلي الآن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-34: مقاومة 3.33 أوم ومكثف 2.5 أوم على التوازي مع مصدر 20 فولت بزاوية 30 درجة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M62 142.0 L62 90 L275 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M62 178.0 L62 230 L275 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦20∠30° V⟧: زاويته ليست صفراً، فكل الزوايا تقاس من المحور الأفقي."><circle cx="62" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M52 160.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="62" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">20∠30° V</text><rect x="36" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر، وهو مجموع تيارات الفروع (جمعاً اتجاهياً)."><line x1="84.0" y1="78.0" x2="116.0" y2="78.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="124.0,78.0 116.0,82.8 116.0,73.2" fill="#12855A"/><text x="104" y="70" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="80" y="54" width="50" height="30" rx="6" fill="transparent"/></g><g data-tip="مقاومة ⟦3.33 Ω⟧: تيارها ⟦IR⟧ في طور الجهد نفسه (زاويته ⟦30°⟧)."><path d="M170 90 L170 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170 182.0 L170 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M170 138.0 L177 145.33333333333334 L163 152.66666666666666 L177 160.0 L163 167.33333333333334 L177 174.66666666666666 L170 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="170" cy="90" r="4.5" fill="#2C4A40"/><circle cx="170" cy="230" r="4.5" fill="#2C4A40"/><text x="189" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R</text><text x="189" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">3.33 Ω</text><line x1="149.0" y1="130.0" x2="149.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="149.0,158.0 144.8,151.0 153.2,151.0" fill="#12855A"/><text x="147" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">R</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="140" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="مكثف ممانعته ⟦XC = 2.5 Ω⟧: تياره ⟦IC⟧ يتقدم على الجهد بزاوية ⟦90°⟧."><path d="M275 90 L275 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 182.0 L275 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 138.0 L275 155.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 165.0 L275 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="263" y1="155.0" x2="287" y2="155.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="263" y1="165.0" x2="287" y2="165.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="294" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><text x="294" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2.5 Ω</text><line x1="254.0" y1="130.0" x2="254.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="254.0,158.0 249.8,151.0 258.2,151.0" fill="#12855A"/><text x="252" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="245" y="98" width="62" height="124" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-34)</span>: مقاومة <span class="ltr">3.33 Ω</span> ومكثف <span class="ltr">2.5 Ω</span> على التوازي.<br><b>مرّر المؤشر على المصدر والفرعين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`التيار الكلي هنا \(I_T=10\angle 83.1^\circ\ \text{A}\) والجهد عند <span class="ltr">30°</span>. بكم يتقدم التيار على الجهد؟`,opts:[
     ['بزاوية <span class="ltr">83.1°</span>',false,'<span class="ltr">83.1°</span> زاوية التيار مقيسة من المحور الأفقي، لا من الجهد.'],
     ['بزاوية <span class="ltr">53.1°</span>',true,String.raw`الفرق بين الزاويتين: \(83.1^\circ-30^\circ=53.1^\circ\)، وهي زاوية \(Y_T\).`],
     ['بزاوية <span class="ltr">30°</span>',false,'<span class="ltr">30°</span> زاوية الجهد نفسه من المحور الأفقي.']]}}
   ],
   body:[
    {book:String.raw`<p>ارسم شكل السماحية والشكل المطاور للتيارات والجهد المؤثر لدائرة التوازي الموضحة في الشكل <span class="ltr">1-34</span>.</p>
     <p><b>الحل:</b></p>$$Y_T=\frac{1}{R}+\frac{1}{-jX_C}=\frac{1}{3.33}+\frac{1}{-j2.5}=0.3+j0.4\ \text{S}=0.5\angle 53.1^\circ\ \text{S}$$
     $$Z_T=\frac{1}{Y_T}=\frac{1}{0.5\angle 53.1^\circ}=2\angle -53.1^\circ\ \Omega$$
     $$I_T=Y_T\,V=0.5\angle 53.1^\circ\times 20\angle 30^\circ=10\angle 83.1^\circ\ \text{A}$$
     $$I_R=\frac{20\angle 30^\circ}{3.33}=6\angle 30^\circ\ \text{A}\qquad I_C=\frac{V}{-jX_C}=\frac{20\angle 30^\circ}{2.5\angle -90^\circ}=8\angle 120^\circ\ \text{A}$$
     <p>ويوضح الشكل <span class="ltr">1-35b</span> الشكل المطاور للتيارات والجهد المؤثر، ونلاحظ أن التيار <b>يتقدم</b> على الجهد.</p>`,ref:'ص 44–45'},
    {html:`<div class="cb-figs"><figure>${box(admFig(0.3,[{v:0.4,l:'j0.4'}],{tl:sb('Y','T')+' = 0.5',gl:'0.30'}),300)}الشكل <span class="ltr">(1-35a)</span></figure><figure>${box(parPhasor(20,30,[{z:cpol(6,30),lab:sb('I','R'),col:'--muted'},{z:cpol(8,120),lab:sb('I','C'),col:'--on'}],{arcs:[{a1:0,a2:30,r:40,lab:'30°'},{a1:0,a2:83.1,r:62,lab:'83.1°'}]}),320)}الشكل <span class="ltr">(1-35b)</span></figure></div>`},
    {tip:String.raw`<p>عند الضرب بالصورة القطبية <b>تُجمع الزوايا</b>: \(53.1^\circ+30^\circ=83.1^\circ\). وعند القسمة <b>تُطرح</b>: \(30^\circ-(-90^\circ)=120^\circ\) لتيار المكثف.</p>
     <p>و\(I_R\) في اتجاه الجهد نفسه (<span class="ltr">30°</span>)، و\(I_C\) متقدم عليه <span class="ltr">90°</span> تماماً (<span class="ltr">120°</span>).</p>`,title:'حساب الزوايا'},
    {watch:String.raw`<p>حين لا تكون زاوية الجهد صفراً، فإن «يتقدم» و«يتأخر» تُقاس بين التيار والجهد، لا بين التيار والمحور الأفقي.</p>`},
    {title:'مختبر مصغّر: زاوية الجهد وزاوية التيار',widget:(el,B)=>DCML.lab(el,B,{intro:'\\(Y_T=0.5\\angle53.1^\\circ\\ \\text{S}\\) من حل المثال. اختر زاوية الجهد: <span class="ltr">30°</span> كما في الكتاب، أو <span class="ltr">0°</span> للمقارنة.',
 predict:{q:'لو كانت زاوية الجهد <span class="ltr">0°</span> بدلاً من <span class="ltr">30°</span>، بكم يتقدم التيار على الجهد؟',opts:[
  ['بزاوية <span class="ltr">83.1°</span>',false,'هذه زاوية التيار في الكتاب حين كانت زاوية الجهد <span class="ltr">30°</span>.'],
  ['بزاوية <span class="ltr">53.1°</span> أيضاً',true,'التقدم تحدده زاوية \\(Y_T\\) وحدها؛ زاوية الجهد تدير الكل معاً.'],
  ['لا يتقدم',false,'الحمل سعوي في الحالتين.']]},
 ins:[{k:'a',l:'زاوية الجهد',seg:[[30,'30° (الكتاب)'],[0,'<span class="ltr">0°</span>']],v:30}],
 calc:(s,P,B)=>{const ai=53.1+s.a;
  return {facts:[['زاوية V',s.a+'°'],['زاوية I<sub>T</sub> (<span class="ltr">53.1°</span> + زاوية V)',DCML.fm(B,ai,1)+'°'],['تقدم التيار على الجهد','53.1°','hi']],
   msg:s.a===30?'كما في الكتاب: \\(I_T=10\\angle83.1^\\circ\\ \\text{A}\\)، والتقدم <span class="ltr">83.1° − 30° = 53.1°</span>.':'الآن زاوية التيار <span class="ltr">53.1°</span> من المحور الأفقي، وهي نفسها مقدار التقدم.'}}})}
   ]},

  {st:5,short:'مثال <span class="ltr">(1-2-9)</span>',title:'مثال <span class="ltr">(1-2-9)</span>: مقاومة وملف ومكثف على التوازي',ref:'ص 46–47',
   q:'ملف ومكثف في دائرة واحدة على التوازي: أيهما «يغلب» ويحدد طبيعة الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-36: ثلاثة فروع على التوازي: مقاومة 4 أوم وملف 5 أوم ومكثف 3.33 أوم مع مصدر 50 فولت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M52 142.0 L52 90 L295 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M52 178.0 L52 230 L295 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦50∠53.1° V⟧."><circle cx="52" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M42 160.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="52" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">50∠53.1° V</text><rect x="26" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ = ⟦IR + IL + IC⟧ (جمعاً اتجاهياً)."><line x1="74.0" y1="78.0" x2="106.0" y2="78.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="114.0,78.0 106.0,82.8 106.0,73.2" fill="#12855A"/><text x="94" y="70" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="70" y="54" width="50" height="30" rx="6" fill="transparent"/></g><g data-tip="مقاومة ⟦R = 4 Ω⟧."><path d="M125 90 L125 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M125 182.0 L125 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M125 138.0 L132 145.33333333333334 L118 152.66666666666666 L132 160.0 L118 167.33333333333334 L132 174.66666666666666 L125 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="125" cy="90" r="4.5" fill="#2C4A40"/><circle cx="125" cy="230" r="4.5" fill="#2C4A40"/><text x="144" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R</text><text x="144" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">4 Ω</text><line x1="104.0" y1="130.0" x2="104.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="104.0,158.0 99.8,151.0 108.2,151.0" fill="#12855A"/><text x="102" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">R</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="ملف ممانعته ⟦XL = 5 Ω⟧."><path d="M210 90 L210 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 182.0 L210 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 138.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="210" cy="90" r="4.5" fill="#2C4A40"/><circle cx="210" cy="230" r="4.5" fill="#2C4A40"/><text x="229" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><text x="229" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><line x1="189.0" y1="130.0" x2="189.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="189.0,158.0 184.8,151.0 193.2,151.0" fill="#12855A"/><text x="187" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="180" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="مكثف ممانعته ⟦XC = 3.33 Ω⟧."><path d="M295 90 L295 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 182.0 L295 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 138.0 L295 155.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 165.0 L295 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="283" y1="155.0" x2="307" y2="155.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="283" y1="165.0" x2="307" y2="165.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="314" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><text x="314" y="171.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">3.33 Ω</text><line x1="274.0" y1="130.0" x2="274.0" y2="151.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="274.0,158.0 269.8,151.0 278.2,151.0" fill="#12855A"/><text x="272" y="178.0" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="265" y="98" width="62" height="124" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-36)</span>: ثلاثة فروع على التوازي.<br><b>مرّر المؤشر على الفروع والمصدر وسهم التيار الكلي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`تقبلية الملف هنا \(-j0.2\) وتقبلية المكثف \(+j0.3\). فالحمل الكلي…`,opts:[
     ['مادي - حثي',false,String.raw`مقدار تقبلية المكثف (0.3) أكبر من الملف (0.2).`],
     ['مادي بحت',false,String.raw`كان سيصير مادياً بحتاً لو تساوت التقبليتان فقط.`],
     ['مادي - سعوي',true,String.raw`المجموع \(+j0.1\) موجب، والكتاب يقول: «الحمل الكلي مادي - سعوي».`]]}}
   ],
   body:[
    {book:String.raw`<p>في دائرة التوازي الموضحة في الشكل <span class="ltr">1-36</span> احسب السماحية المكافئة \(Y_T\) والتيار الكلي \(I_T\) وبين أن مجموع التيارات \(I_R\) و\(I_L\) و\(I_C\) يساوي \(I_T\)، ثم ارسم شكل السماحية والشكل المطاور.</p>
     <p><b>الحل:</b></p>$$Y_T=Y_R+Y_L+Y_C=\frac{1}{4}+\frac{1}{j5}+\frac{1}{-j3.33}=0.25+j0.1\ \text{S}=0.27\angle 21.8^\circ\ \text{S}$$
     $$Z_T=\frac{1}{Y_T}=3.7\angle -21.8^\circ\ \Omega\qquad I_T=Y_T\,V=0.27\angle 21.8^\circ\times 50\angle 53.1^\circ=13.5\angle 74.9^\circ\ \text{A}$$
     $$I_R=\frac{50\angle 53.1^\circ}{4}=12.5\angle 53.1^\circ\qquad I_L=\frac{50\angle 53.1^\circ}{5\angle 90^\circ}=10\angle -36.9^\circ\qquad I_C=\frac{50\angle 53.1^\circ}{3.33\angle -90^\circ}=15\angle 143.1^\circ\ \text{A}$$
     $$I_T=I_R+I_L+I_C=(7.5+j10)+(8-j6)+(-12+j9)=3.5+j13\ \text{A}$$
     <p>ويبين الشكل <span class="ltr">1-37a</span> شكل السماحية، كما يبين الشكل <span class="ltr">1-37b</span> الشكل المطاور. وكما نرى فإن التيار الكلي يتقدم على الجهد المؤثر، مما يدل على أن الحمل الكلي <b>مادي - سعوي</b>.</p>`,ref:'ص 46–47'},
    {title:'شغّل الفروع وأطفئها',widget:(el,B)=>{
      /* أرقام الكتاب: G = 1/4 = 0.25، تقبلية الملف −0.2، تقبلية المكثف +0.3، والجهد 50∠<span class="ltr">53.1°</span> V */
      const br=[{k:'R',n:'المقاومة <span class="ltr">4 Ω</span>',g:0.25,b:0},{k:'L',n:'الملف <span class="ltr">5 Ω</span>',g:0,b:-0.2},{k:'C',n:'المكثف <span class="ltr">3.33 Ω</span>',g:0,b:0.3}],on={R:1,L:1,C:1};
      const f=(x,d)=>(Math.round(x*10**d)/10**d).toString().replace(/^-0$/,'0');
      el.innerHTML=`<div class="w-row" style="margin-top:0">${br.map(x=>`<label style="display:inline-flex;gap:6px;align-items:center;font-size:14px"><input type="checkbox" data-k="${x.k}" checked>${x.n}</label>`).join('')}</div><div data-o style="margin-top:10px"></div>`;
      const o=el.querySelector('[data-o]');
      const draw=()=>{const s=br.filter(x=>on[x.k]);
        if(!s.length){o.innerHTML='<p class="sub" style="margin:0">اختر فرعاً واحداً على الأقل.</p>';return}
        const G=s.reduce((a,x)=>a+x.g,0),Bt=s.reduce((a,x)=>a+x.b,0),Y=Math.hypot(G,Bt),ang=Math.atan2(Bt,G)*180/Math.PI;
        const nat=Math.abs(Bt)<1e-9?['مادي بحت: التيار في طور الجهد','ok']:Bt>0?(G?['مادي - سعوي: التيار يتقدم على الجهد','ld']:['سعوي بحت: التيار يتقدم <span class="ltr">90°</span>','ld']):(G?['مادي - حثي: التيار يتأخر عن الجهد','hot']:['حثي بحت: التيار يتأخر <span class="ltr">90°</span>','hot']);
        o.innerHTML=`<p style="margin:0 0 6px">\\(Y_T=${f(G,2)}${Bt<0?'-':'+'}j${f(Math.abs(Bt),2)}\\ \\text{S}=${f(Y,2)}\\angle ${f(ang,1)}^\\circ\\ \\text{S}\\)</p>
         <p style="margin:0 0 6px">\\(I_T=Y_T\\,V=${f(Y*50,2)}\\angle ${f(ang+53.1,1)}^\\circ\\ \\text{A}\\)</p><span class="cb-chip ${nat[1]}">${nat[0]}</span>`;B.math(o)};
      el.querySelectorAll('[data-k]').forEach(c=>c.onchange=()=>{on[c.dataset.k]=c.checked?1:0;draw()});draw();
    }},
    {html:`<div class="cb-figs"><figure>${box(admFig(0.25,[{v:0.3,l:'+j0.3',col:'--on'},{v:-0.2,l:'−j0.2',col:'--live'}],{tl:sb('Y','T')+' = 0.27',gl:'0.25'}),300)}الشكل <span class="ltr">(1-37a)</span></figure><figure>${box(parPhasor(50,53.1,[{z:cpol(12.5,53.1),lab:sb('I','R'),col:'--muted'},{z:cpol(10,-36.9),lab:sb('I','L'),col:'--live'},{z:cpol(15,143.1),lab:sb('I','C'),col:'--on'}],{chain:true}),320)}الشكل <span class="ltr">(1-37b)</span></figure></div>`},
    {tip:String.raw`<p>\(3.5+j13\) طوله \(\sqrt{3.5^2+13^2}\approx 13.46\ \text{A}\) وزاويته <span class="ltr">74.9°</span>: هو التيار الكلي \(13.5\angle 74.9^\circ\ \text{A}\) نفسه (الفرق من التقريب).</p>
     <p>وفي التقبلية: \(+j0.3\) من المكثف و\(-j0.2\) من الملف، فالمجموع \(+j0.1\). المكثف يلغي تأثير الملف ويزيد عليه، فيصير الحمل سعوياً.</p>`,title:'تحقق من الجمع'},
    {watch:String.raw`<p>في الشكل <span class="ltr">(1-37a)</span> في الكتاب كُتب الضلع الأفقي «5»، والصحيح <b>0.25</b> (الموصلية \(1/4\)).</p>`,fix:true}
   ]},

  {st:6,short:'قانون توزيع التيار',title:'قانون توزيع التيار',ref:'ص 47',
   q:'التيار عند مفترق طريقين: هل يذهب أكثره في الطريق الأسهل أم الأصعب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط توزيع التيار: التيار الكلي يدخل عقدة ويتفرع في معاوقتين Z1 و Z2" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M25 160.0 L95 160.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L335 160.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 160.0 L95 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 160.0 L95 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L275 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L275 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="95" cy="160.0" r="4.5" fill="#2C4A40"/><circle cx="275" cy="160.0" r="4.5" fill="#2C4A40"/><g data-tip="التيار الكلي ⟦IT⟧ يدخل العقدة ثم يتفرع."><line x1="30.0" y1="146.0" x2="62.0" y2="146.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="70.0,146.0 62.0,150.8 62.0,141.2" fill="#12855A"/><text x="48" y="184.0" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="22" y="128.0" width="60" height="64" rx="6" fill="transparent"/></g><g data-tip="الفرع الأول ⟦Z1⟧ وتياره ⟦I1 = Z2·IT/(Z1+Z2)⟧: في البسط معاوقة الفرع الآخر."><path d="M95 105 L163.0 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M207.0 105 L275 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="163.0" y="94" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="185.0" y="85" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="101.0" y1="93.0" x2="118.0" y2="93.0" stroke="#12855A" stroke-width="2.4" stroke-linecap="round"/><polygon points="125.0,93.0 118.0,97.2 118.0,88.8" fill="#12855A"/><text x="99" y="85" text-anchor="start" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="77" width="180" height="56" rx="6" fill="transparent"/></g><g data-tip="الفرع الثاني ⟦Z2⟧ وتياره ⟦I2 = Z1·IT/(Z1+Z2)⟧."><path d="M95 215 L163.0 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M207.0 215 L275 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="163.0" y="204" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="185.0" y="247" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="101.0" y1="229.0" x2="118.0" y2="229.0" stroke="#12855A" stroke-width="2.4" stroke-linecap="round"/><polygon points="125.0,229.0 118.0,233.2 118.0,224.8" fill="#12855A"/><text x="99" y="245" text-anchor="start" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="187" width="180" height="56" rx="6" fill="transparent"/></g><text x="180" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">التيار يتفرع عند العقدة</text><text x="180" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan> + I<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan> = I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text></svg>`,
   cap:'التيار الكلي يدخل العقدة ويتفرع في معاوقتين على التوازي.<br><b>مرّر المؤشر على سهم التيار الداخل وعلى كل فرع (أو المسه في الجوال) لتعرف قانون تياره.</b>',
   side:[
    {predict:{q:String.raw`أي صيغة تعطي التيار \(I_1\) في الفرع \(Z_1\)؟`,opts:[
     [String.raw`\(I_1=\frac{Z_1\,I_T}{Z_1+Z_2}\)`,false,String.raw`في البسط معاوقة الفرع <b>الآخر</b>، لا معاوقة الفرع نفسه.`],
     [String.raw`\(I_1=\frac{Z_2\,I_T}{Z_1+Z_2}\)`,true,'هذه المعادلة (1-40): المعاوقة في الطرف الآخر ÷ مجموع المعاوقتين × التيار الكلي.'],
     [String.raw`\(I_1=\frac{I_T}{2}\)`,false,'التيار لا يتقاسم بالتساوي إلا إذا تساوت المعاوقتان.']]}}
   ],
   body:[
    {book:String.raw`<p>في حالة وجود عقدة (تفرع) في الدائرة فإن التيار يتوزع في المعاوقتين \(Z_1\) و\(Z_2\) على التوازي حسب القانونين</p>
     <div class="eq">$$I_1=\frac{Z_2\,I_T}{Z_1+Z_2}\ ,\qquad I_2=\frac{Z_1\,I_T}{Z_1+Z_2}$$<span class="eqno">(1-40)</span></div>
     <p>أي أن: \(I_1\) = (المعاوقة في الطرف الآخر ÷ مجموع المعاوقتين) × \(I_T\)، حيث \(I_T\) هو التيار الكلي الذي يتفرع في المعاوقتين.</p>`,ref:'ص 47'},
    {tip:String.raw`<p>لماذا «المعاوقة في الطرف الآخر»؟ لأن التيار يفضّل الطريق الأسهل: إذا كبرت \(Z_2\) ذهب معظم التيار في \(Z_1\)، فكِبَر \(Z_2\) يكبّر \(I_1\). لذلك تظهر \(Z_2\) في بسط \(I_1\).</p>
     <p>والقانون يأتي من أن الجهد واحد على الفرعين: \(V=I_T\,\frac{Z_1Z_2}{Z_1+Z_2}\)، ثم \(I_1=\frac{V}{Z_1}\).</p>`,title:'الطريق الأسهل'},
    {watch:String.raw`<p>هذا القانون لفرعين فقط. إذا كان هناك ثلاثة فروع أو أكثر فاحسب الجهد أولاً من السماحية الكلية \(V=I_T/Y_T\)، ثم تيار كل فرع \(I_x=V/Z_x\).</p>
     <p>وفي التيار المتردد \(Z_1+Z_2\) جمع <b>مركب</b>: لا تجمع المقادير وحدها.</p>`},
    {title:'مختبر مصغّر: إلى أين يذهب التيار؟',widget:(el,B)=>DCML.lab(el,B,{intro:'لتبقى الفكرة واضحة، الفرعان هنا مقاومتان فقط، والتيار الكلي <span class="ltr">10 A</span>. قيم المقاومتين <b>أرقام تختارها أنت</b>.',
 predict:{q:'رفعت \\(Z_2\\) إلى ضعفها. ماذا يحدث للتيار \\(I_1\\) في الفرع الأول؟',opts:[
  ['يقل',false,'\\(Z_2\\) في بسط \\(I_1\\): كلما كبرت ذهب تيار أكثر في الفرع الأول.'],
  ['يزيد',true,'التيار يفضّل الطريق الأسهل؛ صار الفرع الثاني أصعب.'],
  ['لا يتغير',false,'التوزيع يعتمد على النسبة بين المعاوقتين.']]},
 ins:[{k:'a',l:'Z<sub>1</sub>',u:'Ω',min:1,max:10,step:1,v:2,dp:0},{k:'b',l:'Z<sub>2</sub>',u:'Ω',min:1,max:10,step:1,v:3,dp:0}],
 calc:(s,P,B)=>{const I1=s.b*10/(s.a+s.b),I2=s.a*10/(s.a+s.b);
  return {facts:[['<span class="ltr">I<sub>1</sub> = Z<sub>2</sub> I<sub>T</sub> ÷ (Z<sub>1</sub> + Z<sub>2</sub>)</span>',DCML.fm(B,I1,2)+' A','hi'],['<span class="ltr">I<sub>2</sub> = Z<sub>1</sub> I<sub>T</sub> ÷ (Z<sub>1</sub> + Z<sub>2</sub>)</span>',DCML.fm(B,I2,2)+' A']],
   bars:[{l:'I<sub>1</sub>',v:I1,max:10,u:'A',dp:2,col:'--blue'},{l:'I<sub>2</sub>',v:I2,max:10,u:'A',dp:2,col:'--live'}],
   msg:s.a===s.b?'المعاوقتان متساويتان، فيتقاسمان التيار بالتساوي.':`الفرع ذو المعاوقة الأصغر (${s.a<s.b?'الأول':'الثاني'}) يأخذ التيار الأكبر. وفي المتردد يبقى القانون نفسه لكن بجمع مركب.`}}})}
   ]},

  {st:7,short:'مثال <span class="ltr">(1-2-10)</span>',title:'مثال <span class="ltr">(1-2-10)</span>: توزيع التيار بين فرع حثي وفرع سعوي',ref:'ص 48',
   q:'هل يمكن أن يكون تيار أحد الفرعين أكبر من التيار الكلي الداخل إليهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-38: التيار 10 أمبير يتفرع إلى مقاومة 2 أوم مع ملف 7 أوم، ومكثف 3 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M25 160.0 L95 160.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L335 160.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 160.0 L95 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 160.0 L95 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L275 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M275 160.0 L275 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="95" cy="160.0" r="4.5" fill="#2C4A40"/><circle cx="275" cy="160.0" r="4.5" fill="#2C4A40"/><g data-tip="التيار الكلي ⟦IT = 10∠30° A⟧ (معطى في المثال)."><line x1="30.0" y1="146.0" x2="62.0" y2="146.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="70.0,146.0 62.0,150.8 62.0,141.2" fill="#12855A"/><text x="48" y="184.0" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">10∠30° A</text><rect x="22" y="128.0" width="60" height="64" rx="6" fill="transparent"/></g><g data-tip="الفرع العلوي: مقاومة ⟦2 Ω⟧ على التوالي مع ملف ⟦7 Ω⟧، أي ⟦2 + j7 Ω⟧."><path d="M95 105 L133.0 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M177.0 105 L193.0 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M237.0 105 L275 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M133.0 105 L140.33333333333334 112 L147.66666666666666 98 L155.0 112 L162.33333333333334 98 L169.66666666666666 112 L177.0 105" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="155.0" y="85" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2 Ω</text><path d="M193.0 105 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="215.0" y="85" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">7 Ω</text><line x1="101.0" y1="93.0" x2="118.0" y2="93.0" stroke="#12855A" stroke-width="2.4" stroke-linecap="round"/><polygon points="125.0,93.0 118.0,97.2 118.0,88.8" fill="#12855A"/><text x="99" y="85" text-anchor="start" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">RL</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="77" width="180" height="56" rx="6" fill="transparent"/></g><g data-tip="الفرع السفلي: مكثف ⟦3 Ω⟧، أي ⟦−j3 Ω⟧."><path d="M95 215 L163.0 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M207.0 215 L275 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M163.0 215 L180.0 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M190.0 215 L207.0 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="180.0" y1="203" x2="180.0" y2="227" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="190.0" y1="203" x2="190.0" y2="227" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="185.0" y="247" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">3 Ω</text><line x1="101.0" y1="229.0" x2="118.0" y2="229.0" stroke="#12855A" stroke-width="2.4" stroke-linecap="round"/><polygon points="125.0,229.0 118.0,233.2 118.0,224.8" fill="#12855A"/><text x="99" y="245" text-anchor="start" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="187" width="180" height="56" rx="6" fill="transparent"/></g><text x="180" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R + jX<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan>  ‖  −jX<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(1-38)</span>: التيار الكلي يتفرع إلى فرع (مقاومة وملف) وفرع (مكثف).<br><b>مرّر المؤشر على الفرعين وعلى سهم التيار الداخل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`التيار الداخل <span class="ltr">10 A</span>. هل يمكن أن يمر في المكثف تيار أكبر من <span class="ltr">10 A</span>؟`,opts:[
     ['لا، تيار الفرع جزء من التيار الكلي دائماً',false,'هذا صحيح في التيار المستمر فقط. في المتردد التيارات متجهات قد يلغي بعضها بعضاً.'],
     ['نعم، لأن المكثف يولد تياراً من نفسه',false,'المكثف لا يولد تياراً؛ لكن تياره وتيار الفرع الحثي في اتجاهين متعاكسين تقريباً.'],
     ['نعم، لأن تياري الفرعين متعاكسان تقريباً فيلغي كل منهما جزءاً من الآخر',true,String.raw`الحل يعطي \(I_C=16.29\ \text{A}\) أكبر من <span class="ltr">10 A</span>.`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب التيار في كل فرع في الشكل <span class="ltr">1-38</span>، وذلك باستعمال قانون توزيع التيار.</p>
     <p><b>الحل:</b></p>$$I_{RL}=\frac{-jX_C\,I_T}{(R+jX_L)-jX_C}=\frac{3\angle -90^\circ\times 10\angle 30^\circ}{2+j7-j3}=\frac{30\angle -60^\circ}{4.47\angle 63.4^\circ}=6.71\angle -123.4^\circ\ \text{A}$$
     $$I_C=\frac{(R+jX_L)\,I_T}{(R+jX_L)-jX_C}=\frac{(2+j7)\,10\angle 30^\circ}{4.47\angle 63.4^\circ}=\frac{7.28\angle 74.1^\circ\times 10\angle 30^\circ}{4.47\angle 63.4^\circ}=16.29\angle 40.7^\circ\ \text{A}$$`,ref:'ص 48'},
    {tip:String.raw`<p>المقام \((R+jX_L)-jX_C=2+j7-j3=2+j4\): التقبلية الحثية والسعوية تُطرحان. ولأن \(7\) و\(3\) متقاربتان نسبياً صار المقام صغيراً (<span class="ltr">4.47</span>)، فكبرت التيارات.</p>
     <p>تحقق: \(6.71\angle -123.4^\circ+16.29\angle 40.7^\circ=10\angle 30^\circ\ \text{A}\)، أي التيار الكلي نفسه. والفرعان شبه متعاكسين (الفرق بين زاويتيهما <span class="ltr">164.1°</span>).</p>`,title:'لماذا صار تيار المكثف كبيراً؟'},
    {add:String.raw`<p>هذا التيار «الدائر» بين الملف والمكثف هو بداية فكرة <b>رنين التوازي</b> (الدرس القادم): عند الرنين يصبح التياران متساويين تقريباً ومتعاكسين، فيدور تيار كبير داخل الفرعين بينما التيار الداخل إليهما صغير.</p>`},
    {watch:String.raw`<p>عند تطبيق (1-40) هنا: في بسط \(I_{RL}\) معاوقة المكثف \(-jX_C\) (الفرع الآخر)، وفي بسط \(I_C\) معاوقة الفرع الحثي \(R+jX_L\).</p>`},
    {title:'مختبر مصغّر: قرّب X<sub>C</sub> من X<sub>L</sub>',widget:(el,B)=>DCML.lab(el,B,{intro:'\\(R=2\\ \\Omega\\) و \\(X_L=7\\ \\Omega\\) و \\(I_T=10\\angle30^\\circ\\ \\text{A}\\) من المثال. قيمة \\(X_C\\) في الكتاب <span class="ltr">3 Ω</span>، والقيم الأخرى <b>أرقام تختارها أنت</b>.',
 predict:{q:'لو كانت \\(X_C=7\\ \\Omega\\) (مساوية لـ \\(X_L\\))، كيف يصير تيار المكثف؟',opts:[
  ['أصغر من <span class="ltr">10 A</span>',false,'المقام يصير \\(2+j0=2\\) فقط، فيكبر التيار.'],
  ['أكبر بكثير من <span class="ltr">16.29 A</span>',true,'\\(I_C=\\frac{7.28\\times10}{2}\\approx36\\ \\text{A}\\): تيار كبير يدور بين الفرعين (فكرة رنين التوازي).'],
  ['صفر',false,'المكثف ما زال في الدائرة، ويمر فيه تيار.']]},
 ins:[{k:'x',l:'X<sub>C</sub>',u:'Ω',min:1,max:12,step:1,v:3,dp:0}],
 calc:(s,P,B)=>{const Zrl=Cx(2,7),Zc=Cx(0,-s.x),It=cpol(10,30),den=cadd(Zrl,Zc),Irl=cdiv(cmul(Zc,It),den),Ic=cdiv(cmul(Zrl,It),den);
  return {facts:[['المقام <span class="ltr">2 + j(7 − X<sub>C</sub>)</span> (Ω)',PT(den,2,1)],['I<sub>RL</sub> (A)',PT(Irl,2,1)],['I<sub>C</sub> (A)',PT(Ic,2,1),'hi']],
   bars:[{l:'التيار الكلي',v:10,max:40,u:'A',dp:0,col:'--blue'},{l:'I<sub>RL</sub>',v:cabs(Irl),max:40,u:'A',dp:2,col:'--live'},{l:'I<sub>C</sub>',v:cabs(Ic),max:40,u:'A',dp:2,col:cabs(Ic)>10?'--stop':'--on'}],
   msg:s.x===3?'في حل الكتاب: \\(I_{RL}=6.71\\angle{-}123.4^\\circ\\) و \\(I_C=16.29\\angle40.7^\\circ\\ \\text{A}\\) (الفرق الصغير عن البطاقات من تقريب الكتاب للأرقام الوسيطة).':s.x===7?'المقام أصغر ما يمكن (<span class="ltr">2 Ω</span>)، فالتيار الدائر بين الفرعين أكبر ما يمكن.':'كلما اقتربت \\(X_C\\) من \\(X_L\\) صغر المقام وكبر التياران.'}}})}
   ]},

  {recap:[
   String.raw`في التوازي كل الفروع لها الجهد نفسه، والتيار الكلي مجموع تيارات الفروع، و\(\frac{1}{Z_T}=\frac{1}{Z_1}+\frac{1}{Z_2}+\cdots\) (1-37).`,
   String.raw`السماحية \(Y=1/Z\) بوحدة السيمنز، وفي التوازي \(Y_T=Y_1+Y_2+\cdots\) (1-38).`,
   String.raw`\(Y_T=G_T+jB_T\) (1-39): الموصلية \(G\) موجبة، والتقبلية موجبة للمكثف (سعوية) وسالبة للملف (حثية).`,
   String.raw`قانون توزيع التيار لفرعين: \(I_1=\frac{Z_2\,I_T}{Z_1+Z_2}\) و\(I_2=\frac{Z_1\,I_T}{Z_1+Z_2}\) (1-40).`,
   String.raw`في المتردد قد يكون تيار فرع أكبر من التيار الكلي، كما في المثال <span class="ltr">(1-2-10)</span>.`]}
],
 theory:[
  {h:'التوصيل على التوازي',ref:'ص 42–43',html:`<p>يبين الشكل 1-31 دائرة توازي وهي تتكون من مصدر جهد ومن معاوقات <b>خاضعة لنفس الجهد</b> المؤثر بين أطرافها. ونستطيع تمثيل هذه المعاوقات بمعاوقة مكافئة \\(Z_T\\).</p>
   <p>وباستعمال قانون كيرشوف للتيار</p>$$I_T = I_1 + I_2 + \\cdots + I_N$$<p>وقانون أوم</p>$$I_x=\\frac{V}{Z_x}\\ ,\\qquad I_T=\\frac{V}{Z_T}$$<p>حيث \\(x = 1, 2, \\ldots, N\\)، نستنتج</p>
   $$\\frac{1}{Z_T}=\\frac{1}{Z_1}+\\frac{1}{Z_2}+\\cdots+\\frac{1}{Z_N} \\qquad (1\\text{-}37)$$`},
  {fig:'(1-31)',ref:'ص 43',caption:'دائرة التوازي (يساراً) والدائرة المكافئة لها (يميناً): الفروع \\(Z_1, Z_2, \\ldots, Z_N\\) كلها بين السلكين نفسيهما، فلها الجهد V نفسه.',draw:()=>box(fig131(),680)},
  {h:'السماحية المركبة',ref:'ص 43',html:`<p>وهنا يستحسن استعمال <b>السماحيات المركبة</b> \\(Y\\) عوضاً عن المعاوقات \\(Z\\)، حيث \\(Y = 1/Z\\)، وبهذا نكتب المعادلة 1-37 كما يلي</p>
   $$Y_T = Y_1 + Y_2 + \\cdots + Y_N \\qquad (1\\text{-}38)$$
   <p>ووحدة السماحية هي <b>Siemens</b> (ورمزها <span class="ltr">S</span>) أما شكلها العام فهو</p>
   $$Y_T = G_T + j\\,B_T \\qquad (1\\text{-}39)$$
   <p>والجزء الحقيقي \\(G_T\\) يسمى <b>الموصلية</b> (مقلوب المقاومة) وهي موجبة، أما الجزء التخيلي \\(B_T\\) فيسمى <b>التقبلية</b> ويمكن أن تكون موجبة (تقبلية سعوية) أو سالبة (تقبلية حثية).</p>`},
  {note:`<b>توضيح للمتدرب (ليس من الكتاب) — سماحية كل عنصر:</b><div class="cb-tbl"><table class="tt"><thead><tr><th>العنصر</th><th>المعاوقة Z</th><th>السماحية Y = 1/Z</th><th>نوعها</th></tr></thead><tbody>
   <tr><td>مقاومة</td><td>\\(R\\)</td><td>\\(\\frac{1}{R}\\)</td><td>موصلية G موجبة</td></tr>
   <tr><td>ملف</td><td>\\(jX_L\\)</td><td>\\(\\frac{1}{jX_L} = -j\\frac{1}{X_L}\\)</td><td>تقبلية حثية (سالبة)</td></tr>
   <tr><td>مكثف</td><td>\\(-jX_C\\)</td><td>\\(\\frac{1}{-jX_C} = +j\\frac{1}{X_C}\\)</td><td>تقبلية سعوية (موجبة)</td></tr></tbody></table></div>
   لاحظ أن الإشارات معكوسة عن المعاوقة: الملف يعطي \\(+j\\) في المعاوقة و\\(-j\\) في السماحية. السبب أن \\(\\frac{1}{j} = -j\\).`},
  {h:'مثال (1-2-7)',ref:'ص 43–44',html:`<p>في دائرة التوازي الموضحة في الشكل 1-32، احسب السماحية المكافئة وارسم شكلها، ثم احسب التيار الكلي وارسم الشكل المطاور للتيارات والجهد المؤثر.</p>`},
  {fig:'(1-32)',ref:'ص 43',caption:'مقاومة 5 Ω وملف 2 Ω على التوازي مع مصدر 30∠0° V.',draw:()=>box(parFig({src:'30∠0° V',it:sb('I','T'),br:[{t:'R',l:'R = 5 Ω',i:sb('I','R')},{t:'L',l:sb('X','L')+' = 2 Ω',i:sb('I','L')}]}),420)},
  {html:`<p><b>الحل:</b></p>$$Y_T=\\frac{1}{R}+\\frac{1}{jX_L}=\\frac{1}{5}+\\frac{1}{j2}=0.2-j0.5\\ \\text{S}=0.54\\angle -68.2^\\circ\\ \\text{S}$$
   $$Z_T=\\frac{1}{Y_T}=\\frac{1}{0.54\\angle -68.2^\\circ}=1.9\\angle 68.2^\\circ\\ \\Omega$$
   <p>ويبين الشكل 1-33a شكل السماحية.</p>
   $$I_T=\\frac{V}{Z_T}=Y_T\\,V=0.54\\angle -68.2^\\circ\\times 30\\angle 0^\\circ=16.2\\angle -68.2^\\circ\\ \\text{A}$$
   $$I_R=\\frac{V}{R}=\\frac{30\\angle 0^\\circ}{5}=6\\angle 0^\\circ\\ \\text{A}\\qquad I_L=\\frac{V}{jX_L}=\\frac{30\\angle 0^\\circ}{2\\angle 90^\\circ}=15\\angle -90^\\circ\\ \\text{A}$$
   <p>ويوضح الشكل 1-33b الشكل المطاور للتيارات والجهد المؤثر. وكما نرى فإن التيار الكلي <b>يتأخر</b> عن الجهد وذلك لأن الحمل مادي - حثي.</p>`},
  {fig:'(1-33)',ref:'ص 44',caption:'(a) شكل السماحية: \\(G = 0.20\\)، \\(-j0.5\\)، والوتر \\(Y_T = 0.54\\angle -68.2^\\circ\\). (b) الشكل المطاور: \\(I_T = I_R + I_L\\) يتأخر عن V بـ 68.2°.',draw:()=>`<div class="cb-figs"><figure>${box(admFig(0.2,[{v:-0.5,l:'−j0.5'}],{tl:sb('Y','T')+' = 0.54',gl:'0.20'}),300)}(a)</figure><figure>${box(parPhasor(30,0,[{z:cpol(6,0),lab:sb('I','R'),col:'--muted'},{z:cpol(15,-90),lab:sb('I','L'),col:'--live'}],{arcs:[{a1:0,a2:-68.2,r:44,lab:'−68.2°'}]}),320)}(b)</figure></div>`},
  {h:'مثال (1-2-8)',ref:'ص 44–45',html:`<p>ارسم شكل السماحية والشكل المطاور للتيارات والجهد المؤثر لدائرة التوازي الموضحة في الشكل 1-34.</p>`},
  {fig:'(1-34)',ref:'ص 45',caption:'مقاومة 3.33 Ω ومكثف 2.5 Ω على التوازي مع مصدر 20∠30° V.',draw:()=>box(parFig({src:'20∠30° V',it:sb('I','T'),br:[{t:'R',l:'R = 3.33 Ω',i:sb('I','R')},{t:'C',l:sb('X','C')+' = 2.5 Ω',i:sb('I','C')}]}),420)},
  {html:`<p><b>الحل:</b></p>$$Y_T=\\frac{1}{R}+\\frac{1}{-jX_C}=\\frac{1}{3.33}+\\frac{1}{-j2.5}=0.3+j0.4\\ \\text{S}=0.5\\angle 53.1^\\circ\\ \\text{S}$$
   $$Z_T=\\frac{1}{Y_T}=\\frac{1}{0.5\\angle 53.1^\\circ}=2\\angle -53.1^\\circ\\ \\Omega$$
   $$I_T=Y_T\\,V=0.5\\angle 53.1^\\circ\\times 20\\angle 30^\\circ=10\\angle 83.1^\\circ\\ \\text{A}$$
   $$I_R=\\frac{20\\angle 30^\\circ}{3.33}=6\\angle 30^\\circ\\ \\text{A}\\qquad I_C=\\frac{V}{-jX_C}=\\frac{20\\angle 30^\\circ}{2.5\\angle -90^\\circ}=8\\angle 120^\\circ\\ \\text{A}$$
   <p>ويوضح الشكل 1-35b الشكل المطاور للتيارات والجهد المؤثر، ونلاحظ أن التيار <b>يتقدم</b> على الجهد.</p>`},
  {fig:'(1-35)',ref:'ص 45',caption:'(a) شكل السماحية: \\(0.30 + j0.4\\)، والوتر \\(0.5\\angle 53.1^\\circ\\). (b) الشكل المطاور: V بزاوية 30°، و\\(I_C\\) عند 120°، و\\(I_T\\) عند 83.1°.',draw:()=>`<div class="cb-figs"><figure>${box(admFig(0.3,[{v:0.4,l:'j0.4'}],{tl:sb('Y','T')+' = 0.5',gl:'0.30'}),300)}(a)</figure><figure>${box(parPhasor(20,30,[{z:cpol(6,30),lab:sb('I','R'),col:'--muted'},{z:cpol(8,120),lab:sb('I','C'),col:'--on'}],{arcs:[{a1:0,a2:30,r:40,lab:'30°'},{a1:0,a2:83.1,r:62,lab:'83.1°'}]}),320)}(b)</figure></div>`},
  {h:'مثال (1-2-9)',ref:'ص 46–47',html:`<p>في دائرة التوازي الموضحة في الشكل 1-36 احسب السماحية المكافئة \\(Y_T\\) والتيار الكلي \\(I_T\\) وبين أن مجموع التيارات \\(I_R\\) و\\(I_L\\) و\\(I_C\\) يساوي \\(I_T\\)، ثم ارسم شكل السماحية والشكل المطاور.</p>`},
  {fig:'(1-36)',ref:'ص 46',caption:'ثلاثة فروع على التوازي: R = 4 Ω و X<sub>L</sub> = 5 Ω و X<sub>C</sub> = 3.33 Ω، مع مصدر 50∠53.1° V.',draw:()=>box(parFig({src:'50∠53.1° V',it:sb('I','T'),br:[{t:'R',l:'R = 4 Ω',i:sb('I','R')},{t:'L',l:sb('X','L')+' = 5 Ω',i:sb('I','L')},{t:'C',l:sb('X','C')+' = 3.33 Ω',i:sb('I','C')}]}),540)},
  {html:`<p><b>الحل:</b></p>$$Y_T=Y_R+Y_L+Y_C=\\frac{1}{4}+\\frac{1}{j5}+\\frac{1}{-j3.33}=0.25+j0.1\\ \\text{S}=0.27\\angle 21.8^\\circ\\ \\text{S}$$
   $$Z_T=\\frac{1}{Y_T}=3.7\\angle -21.8^\\circ\\ \\Omega\\qquad I_T=Y_T\\,V=0.27\\angle 21.8^\\circ\\times 50\\angle 53.1^\\circ=13.5\\angle 74.9^\\circ\\ \\text{A}$$
   $$I_R=\\frac{50\\angle 53.1^\\circ}{4}=12.5\\angle 53.1^\\circ\\qquad I_L=\\frac{50\\angle 53.1^\\circ}{5\\angle 90^\\circ}=10\\angle -36.9^\\circ\\qquad I_C=\\frac{50\\angle 53.1^\\circ}{3.33\\angle -90^\\circ}=15\\angle 143.1^\\circ\\ \\text{A}$$
   $$I_T=I_R+I_L+I_C=(7.5+j10)+(8-j6)+(-12+j9)=3.5+j13\\ \\text{A}$$
   <p>ويبين الشكل 1-37a شكل السماحية، كما يبين الشكل 1-37b الشكل المطاور. وكما نرى فإن التيار الكلي يتقدم على الجهد المؤثر، مما يدل على أن الحمل الكلي <b>مادي - سعوي</b>.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> \\(3.5 + j13 = 13.46\\angle 74.9^\\circ\\) A، وهو التيار الكلي نفسه \\(13.5\\angle 74.9^\\circ\\) (الفرق من التقريب). وفي التقبلية: \\(+j0.3\\) من المكثف و\\(-j0.2\\) من الملف، فالمجموع \\(+j0.1\\): المكثف «يغلب» الملف فيصير الحمل سعوياً.'},
  {fig:'(1-37)',ref:'ص 47',caption:'(a) شكل السماحية: الضلع الأفقي 0.25، ثم \\(+j0.3\\) صعوداً و\\(-j0.2\\) نزولاً، والوتر \\(0.27\\angle 21.8^\\circ\\). (b) المخطط الاتجاهي: \\(I_R\\) و\\(I_L\\) و\\(I_C\\) مجموعة رأساً لذيل لتعطي \\(I_T\\).',draw:()=>`<div class="cb-figs"><figure>${box(admFig(0.25,[{v:0.3,l:'+j0.3',col:'--on'},{v:-0.2,l:'−j0.2',col:'--live'}],{tl:sb('Y','T')+' = 0.27',gl:'0.25'}),300)}(a)</figure><figure>${box(parPhasor(50,53.1,[{z:cpol(12.5,53.1),lab:sb('I','R'),col:'--muted'},{z:cpol(10,-36.9),lab:sb('I','L'),col:'--live'},{z:cpol(15,143.1),lab:sb('I','C'),col:'--on'}],{chain:true}),320)}(b)</figure></div>`},
  {h:'قانون توزيع التيار',ref:'ص 47',html:`<p>في حالة وجود عقدة (تفرع) في الدائرة فإن التيار يتوزع في المعاوقتين \\(Z_1\\) و\\(Z_2\\) على التوازي حسب القانونين</p>
   $$I_1=\\frac{Z_2\\,I_T}{Z_1+Z_2}\\ ,\\qquad I_2=\\frac{Z_1\\,I_T}{Z_1+Z_2} \\qquad (1\\text{-}40)$$
   <p>أي أن: \\(I_1\\) = (المعاوقة في الطرف الآخر ÷ مجموع المعاوقتين) × \\(I_T\\)، حيث \\(I_T\\) هو التيار الكلي الذي يتفرع في المعاوقتين.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لماذا «المعاوقة في الطرف الآخر»؟ لأن التيار يفضّل الطريق الأسهل: إذا كانت \\(Z_2\\) كبيرة ذهب معظم التيار في \\(Z_1\\). مثال بالأرقام: \\(Z_1 = 1\\ \\Omega\\) و\\(Z_2 = 3\\ \\Omega\\) و\\(I_T = 4\\) A تعطي \\(I_1 = \\frac{3}{4}\\times 4 = 3\\) A و\\(I_2 = 1\\) A. والقانون لفرعين فقط؛ لأكثر من فرعين نستعمل السماحيات.'},
  {h:'مثال (1-2-10)',ref:'ص 48',html:`<p>احسب التيار في كل فرع في الشكل 1-38، وذلك باستعمال قانون توزيع التيار.</p>`},
  {fig:'(1-38)',ref:'ص 48',caption:'التيار \\(I_T = 10\\angle 30^\\circ\\) A يتفرع إلى فرع علوي (R = 2 Ω مع X<sub>L</sub> = 7 Ω) وفرع سفلي (X<sub>C</sub> = 3 Ω).',draw:()=>box(divFig({iin:'IT = 10∠30° A',top:[{t:'R',l:'2 Ω'},{t:'L',l:'7 Ω'}],bot:[{t:'C',l:'3 Ω'}],i1:sb('I','RL'),i2:sb('I','C')}),500)},
  {html:`<p><b>الحل:</b></p>$$I_{RL}=\\frac{-jX_C\\,I_T}{(R+jX_L)-jX_C}=\\frac{3\\angle -90^\\circ\\times 10\\angle 30^\\circ}{2+j7-j3}=\\frac{30\\angle -60^\\circ}{4.47\\angle 63.4^\\circ}=6.71\\angle -123.4^\\circ\\ \\text{A}$$
   $$I_C=\\frac{(R+jX_L)\\,I_T}{(R+jX_L)-jX_C}=\\frac{(2+j7)\\,10\\angle 30^\\circ}{4.47\\angle 63.4^\\circ}=\\frac{7.28\\angle 74.1^\\circ\\times 10\\angle 30^\\circ}{4.47\\angle 63.4^\\circ}=16.29\\angle 40.7^\\circ\\ \\text{A}$$`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لاحظ أن تيار المكثف (16.29 A) أكبر من التيار الكلي (10 A)! هذا ممكن في التيار المتردد: تيار الفرع الحثي وتيار الفرع السعوي متعاكسان تقريباً فيلغي كل منهما جزءاً من الآخر، والمجموع الاتجاهي \\(6.71\\angle -123.4^\\circ + 16.29\\angle 40.7^\\circ = 10\\angle 30^\\circ\\) A. جرّب ذلك في المختبر.'},
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب:</b><ol><li>الشكل 1-31 (ص 43): المعاوقة في الدائرة المكافئة مكتوبة \\(Z_1\\)، والصحيح \\(Z_T\\) (صححناها في الرسم).</li><li>الشكل 1-37a (ص 47): الضلع الأفقي مكتوب «5»، والصحيح <b>0.25</b> (الموصلية \\(1/4\\)) (صححناها في الرسم).</li><li>ص 47: «مجموع المقاومات» في شرح قانون توزيع التيار، والمقصود مجموع <b>المعاوقتين</b> \\(Z_1 + Z_2\\).</li></ol></div>'}
 ],
 lab:(el)=>{
  const PRE={e7:{V:30,th:0,R:5,XL:2,XC:2.5,on:{R:1,L:1,C:0}},e8:{V:20,th:30,R:3.33,XL:2,XC:2.5,on:{R:1,L:0,C:1}},e9:{V:50,th:53.1,R:4,XL:5,XC:3.33,on:{R:1,L:1,C:1}}};
  const DPRE={e10:{I:10,th:30,z1:[2,7,0],z2:[0,0,3]},p6a:{I:8,th:40,z1:[4,7,0],z2:[9,0,10]},p6b:{I:5,th:20,z1:[20,0,0],z2:[0,10,30]}};
  let mode='par';const P=JSON.parse(JSON.stringify(PRE.e7));let Dv=JSON.parse(JSON.stringify(DPRE.e10));const did={};let pre='e7',dpre='e10';
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c12"><h2>نوع التجربة <small>مبنية على الأشكال (1-31) و(1-32) و(1-34) و(1-36) و(1-38)</small></h2>${segHTML('md',[['par','دائرة توازي: مصدر جهد وفروع R و L و C'],['div','قانون توزيع التيار: تيار يتفرع في فرعين']],mode)}</div>
   <div id="l8par" class="c12" style="display:contents">
   <div class="panel c5"><h2>ابنِ الدائرة</h2>
    <div class="cb-row"><span class="sub">أرقام الكتاب:</span>${segHTML('pr',[['e7','مثال 1-2-7'],['e8','مثال 1-2-8'],['e9','مثال 1-2-9']],pre)}</div>
    <div class="cb-sls">${nsl('l8V','جهد المصدر V',0,100,0.1,P.V,'V')}${nsl('l8th','زاوية الجهد θ<sub>v</sub>',-180,180,0.1,P.th,'°')}</div>
    <div class="cb-zg">
     <div class="cb-zc"><h4>${swHTML('l8onR','R','فرع المقاومة',1)}</h4>${nsl('l8R','R',0.1,20,0.01,P.R,'Ω')}</div>
     <div class="cb-zc"><h4>${swHTML('l8onL','L','فرع الملف',1)}</h4>${nsl('l8XL','X<sub>L</sub>',0.1,20,0.01,P.XL,'Ω')}</div>
     <div class="cb-zc"><h4>${swHTML('l8onC','C','فرع المكثف',0)}</h4>${nsl('l8XC','X<sub>C</sub>',0.1,20,0.01,P.XC,'Ω')}</div></div></div>
   <div class="panel c7"><h2>الدائرة والقراءات <small>الأميترات تقرأ القيم الفعالة</small></h2><div class="svgbox cb-wide" id="l8c"></div>
    <div class="facts">${fact('Y<sub>T</sub> = G<sub>T</sub> + jB<sub>T</sub>','l8y')}${fact('Y<sub>T</sub> قطبياً','l8yp')}${fact('Z<sub>T</sub> = 1/Y<sub>T</sub>','l8z')}${fact('I<sub>T</sub>','l8it')}</div>
    <div class="cb-row"><span id="l8chip" class="cb-chip"></span></div></div>
   <div class="panel c6"><h2>شكل السماحية <small>مثل الأشكال 1-33a و1-35a و1-37a</small></h2><div class="svgbox" id="l8a" style="max-width:340px;margin-inline:auto"></div></div>
   <div class="panel c6"><h2>الشكل المطاور <small>التيارات مجموعة رأساً لذيل = قانون كيرشوف للتيار</small></h2><div class="svgbox" id="l8p" style="max-width:360px;margin-inline:auto"></div>${legend([['--fg','V'],['--muted','I<sub>R</sub>'],['--live','I<sub>L</sub>'],['--on','I<sub>C</sub>'],['--stop','I<sub>T</sub>']])}</div>
   </div>
   <div id="l8div" class="c12" style="display:none">
   <div class="grid">
   <div class="panel c5"><h2>الفرعان <small>المعادلة (1-40)</small></h2>
    <div class="cb-row"><span class="sub">أرقام الكتاب:</span>${segHTML('dp',[['e10','مثال 1-2-10'],['p6a','مسألة 6 (a)'],['p6b','مسألة 6 (b)']],dpre)}</div>
    <div class="cb-sls">${nsl('l8I','التيار الداخل I<sub>T</sub>',0,20,0.1,Dv.I,'A')}${nsl('l8ith','زاويته',-180,180,0.1,Dv.th,'°')}</div>
    <div class="cb-zg"><div class="cb-zc"><h4>الفرع العلوي Z<sub>1</sub> <small id="l8z1"></small></h4><div class="cb-in3">${ni('l8a1','R (Ω)',2)}${ni('l8b1','X<sub>L</sub> (Ω)',7)}${ni('l8c1','X<sub>C</sub> (Ω)',0)}</div></div>
     <div class="cb-zc"><h4>الفرع السفلي Z<sub>2</sub> <small id="l8z2"></small></h4><div class="cb-in3">${ni('l8a2','R (Ω)',0)}${ni('l8b2','X<sub>L</sub> (Ω)',0)}${ni('l8c2','X<sub>C</sub> (Ω)',3)}</div></div></div>
    <p class="sub">اكتب 0 لعنصر غير موجود في الفرع.</p></div>
   <div class="panel c7"><h2>التيار يتوزع</h2><div class="svgbox cb-wide" id="l8dc"></div>
    <div class="facts">${fact('I<sub>1</sub> = Z<sub>2</sub>I<sub>T</sub>/(Z<sub>1</sub>+Z<sub>2</sub>)','l8i1')}${fact('I<sub>2</sub> = Z<sub>1</sub>I<sub>T</sub>/(Z<sub>1</sub>+Z<sub>2</sub>)','l8i2')}${fact('تحقق: I<sub>1</sub> + I<sub>2</sub>','l8sum')}</div><div class="cb-row"><span id="l8dchip" class="cb-chip"></span></div></div>
   <div class="panel c12"><h2>الشكل المطاور للتيارات <small>متوازي الأضلاع: I<sub>1</sub> + I<sub>2</sub> = I<sub>T</sub></small></h2><div class="svgbox" id="l8dp" style="max-width:380px;margin-inline:auto"></div></div>
   </div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l8st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const setV=nslBind(el,'l8V',v=>{P.V=v;draw()}),setTh=nslBind(el,'l8th',v=>{P.th=v;draw()}),setR=nslBind(el,'l8R',v=>{P.R=v;draw()}),setXL=nslBind(el,'l8XL',v=>{P.XL=v;draw()}),setXC=nslBind(el,'l8XC',v=>{P.XC=v;draw()});
  const setI=nslBind(el,'l8I',v=>{Dv.I=v;draw()}),setIth=nslBind(el,'l8ith',v=>{Dv.th=v;draw()});
  ['R','L','C'].forEach(k=>{$('#l8on'+k).onclick=()=>{P.on[k]=P.on[k]?0:1;if(!P.on.R&&!P.on.L&&!P.on.C)P.on[k]=1;draw()}});
  const zin=()=>{const g=id=>{const v=parseFloat($('#'+id).value);return isFinite(v)?Math.max(0,v):0};Dv.z1=[g('l8a1'),g('l8b1'),g('l8c1')];Dv.z2=[g('l8a2'),g('l8b2'),g('l8c2')];draw()};
  ['l8a1','l8b1','l8c1','l8a2','l8b2','l8c2'].forEach(id=>$('#'+id).addEventListener('input',zin));
  const loadP=k=>{pre=k;Object.assign(P,JSON.parse(JSON.stringify(PRE[k])));setV(P.V);setTh(P.th);setR(P.R);setXL(P.XL);setXC(P.XC);did[k]=1;draw()};
  const loadD=k=>{dpre=k;Dv=JSON.parse(JSON.stringify(DPRE[k]));setI(Dv.I);setIth(Dv.th);['a','b','c'].forEach((c,i)=>{$('#l8'+c+'1').value=Dv.z1[i];$('#l8'+c+'2').value=Dv.z2[i]});did[k]=1;draw()};
  segBind(el,'pr',loadP);segBind(el,'dp',loadD);
  segBind(el,'md',v=>{mode=v;$('#l8par').style.display=v==='par'?'contents':'none';$('#l8div').style.display=v==='div'?'':'none';draw()});
  let S8={};
  function draw(){
   if(mode==='par'){
    ['R','L','C'].forEach(k=>$('#l8on'+k).setAttribute('aria-pressed',P.on[k]?'true':'false'));
    const V=cpol(P.V,P.th),G=P.on.R?1/P.R:0,BL=P.on.L?1/P.XL:0,BC=P.on.C?1/P.XC:0,Y=Cx(G,BC-BL);
    /* عطل مخفي: القيم الفعلية للفروع (للتيارات فقط؛ السماحية المحسوبة بالقيم المكتوبة). خارج وضع التحدي هي نفسها */
    const Ga=chF('ropen')?0:G,BLa=chF('lsh')?BL/0.6:BL,BCa=chF('copen')?0:chF('cdry')?BC/2:BC;
    const IR=csc(V,Ga),IL=cmul(V,Cx(0,-BLa)),IC=cmul(V,Cx(0,BCa)),IT=cmul(V,Cx(Ga,BCa-BLa));S8={Y,IT,G,BL,BC};
    const br=[];if(P.on.R)br.push({t:'R',l:'R = '+f1(P.R)+' Ω',l2:'IR = '+PT(IR),i:sb('I','R'),c:'--muted'});if(P.on.L)br.push({t:'L',l:'XL = '+f1(P.XL)+' Ω',l2:'IL = '+PT(IL),i:sb('I','L'),c:'--live'});if(P.on.C)br.push({t:'C',l:'XC = '+f1(P.XC)+' Ω',l2:'IC = '+PT(IC),i:sb('I','C'),c:'--on'});
    $('#l8c').innerHTML=parFig({src:PT(V,2,1)+' V',it:'IT = '+PT(IT),br,first:120,sp:150,wr:140});
    $('#l8y').textContent=RT(Y,3)+' S';$('#l8yp').textContent=PT(Y,3,1)+' S';$('#l8z').textContent=cabs(Y)<1e-9?'∞':PT(cinv(Y),2,1)+' Ω';$('#l8it').textContent=PT(IT,2,1)+' A';
    const ch=$('#l8chip'),a=cang(Y);if(Math.abs(Y.im)<1e-3*Math.max(cabs(Y),1e-9)||Math.abs(Y.im)<5e-4){ch.className='cb-chip ok';ch.textContent='B_T = 0: التيار الكلي بنفس طور الجهد (مادي بحت)'}else if(Y.im<0){ch.className='cb-chip hot';ch.textContent='B_T سالبة: التيار الكلي يتأخر بـ '+f1(-a,1)+'° — الحمل مادي - حثي'}else{ch.className='cb-chip ld';ch.textContent='B_T موجبة: التيار الكلي يتقدم بـ '+f1(a,1)+'° — الحمل مادي - سعوي'}
    const Bs=[];if(P.on.C)Bs.push({v:BC,l:'+j'+f1(BC,3),col:'--on'});if(P.on.L)Bs.push({v:-BL,l:'−j'+f1(BL,3),col:'--live'});
    $('#l8a').innerHTML=admFig(G,Bs,{tl:'YT = '+f1(cabs(Y),3),gl:'G = '+f1(G,3)});
    const cs=[];if(P.on.R)cs.push({z:IR,lab:sb('I','R'),col:'--muted'});if(P.on.L)cs.push({z:IL,lab:sb('I','L'),col:'--live'});if(P.on.C)cs.push({z:IC,lab:sb('I','C'),col:'--on'});
    $('#l8p').innerHTML=parPhasor(P.V,P.th,cs,{chain:cs.length>1,arcs:[{a1:0,a2:P.th,r:34,lab:'θv'}]});
   }else{
    const It=cpol(Dv.I,Dv.th),Z1=Cx(Dv.z1[0],Dv.z1[1]-Dv.z1[2]),Z2=Cx(Dv.z2[0],Dv.z2[1]-Dv.z2[2]),Sm=cadd(Z1,Z2);
    $('#l8z1').textContent=RT(Z1,2)+' Ω';$('#l8z2').textContent=RT(Z2,2)+' Ω';
    const ch=$('#l8dchip');
    if(cabs(Sm)<1e-6){ch.className='cb-chip warn';ch.textContent='Z1 + Z2 = 0: لا يمكن تطبيق القانون (رنين تام بين الفرعين)';['#l8i1','#l8i2','#l8sum'].forEach(k=>$(k).textContent='∞');S8={};return}
    const I1=cdiv(cmul(Z2,It),Sm),I2=cdiv(cmul(Z1,It),Sm),sum=cadd(I1,I2);S8={I1,I2,It,Z1,Z2};
    const parts=(z,i)=>{const r=[];if(z[0]>0)r.push({t:'R',l:f1(z[0])+' Ω'});if(z[1]>0)r.push({t:'L',l:f1(z[1])+' Ω'});if(z[2]>0)r.push({t:'C',l:f1(z[2])+' Ω'});if(!r.length)r.push({t:'W',l:'0 Ω'});return r};
    $('#l8dc').innerHTML=divFig({iin:'IT = '+PT(It),top:parts(Dv.z1),bot:parts(Dv.z2),i1:'I1 = '+PT(I1),i2:'I2 = '+PT(I2),xR:470});
    $('#l8i1').textContent=PT(I1,2,1)+' A';$('#l8i2').textContent=PT(I2,2,1)+' A';$('#l8sum').textContent=PT(sum,2,1)+' A';
    const big=cabs(I1)>Dv.I*1.001||cabs(I2)>Dv.I*1.001;ch.className='cb-chip '+(big?'hot':'ok');ch.textContent=big?'تيار فرع أكبر من التيار الكلي: الفرعان يلغي كل منهما جزءاً من تيار الآخر':'كل فرع يأخذ جزءاً من التيار الكلي';
    $('#l8dp').innerHTML=parPhasor(0,0,[{z:I1,lab:sb('I','1'),col:'--live'},{z:I2,lab:sb('I','2'),col:'--on'}],{});
   }
   steps.check()}
  const steps=stepsUI($('#l8st'),[
   {t:'مثال (1-2-7)',x:'اختر «مثال 1-2-7»: اقرأ \\(Y_T = 0.2 - j0.5 = 0.54\\angle -68.2^\\circ\\) S و\\(I_T = 16.2\\angle -68.2^\\circ\\) A. التيار الكلي يتأخر: الحمل مادي - حثي.',done:()=>mode==='par'&&did.e7&&P.on.R&&P.on.L&&!P.on.C},
   {t:'حمل مادي بحت',x:'أطفئ فرع الملف (واترك المكثف مطفأً): يبقى \\(I_T = I_R\\) بنفس طور الجهد، وشكل السماحية خط أفقي فقط.',done:()=>mode==='par'&&P.on.R&&!P.on.L&&!P.on.C},
   {t:'مثال (1-2-9): التيار يتقدم',x:'اختر «مثال 1-2-9»: الفروع الثلاثة تعمل، \\(Y_T = 0.25 + j0.1\\) S، والتيارات الثلاثة مجموعة رأساً لذيل تعطي \\(I_T = 13.5\\angle 74.9^\\circ\\) A يتقدم على V.',done:()=>mode==='par'&&did.e9&&P.on.L&&P.on.C},
   {t:'اجعل التقبلية صفراً',x:'والملف والمكثف يعملان، حرّك \\(X_L\\) أو \\(X_C\\) حتى يتساويا: يلغي \\(I_L\\) و\\(I_C\\) أحدهما الآخر، فيصير \\(B_T = 0\\) والتيار الكلي أصغر ما يمكن وبنفس طور الجهد.',done:()=>mode==='par'&&P.on.L&&P.on.C&&Math.abs(1/P.XC-1/P.XL)<0.004},
   {t:'قانون توزيع التيار',x:'اختر «قانون توزيع التيار» ثم «مثال 1-2-10»: \\(I_{RL} = 6.71\\angle -123.4^\\circ\\) و\\(I_C = 16.29\\angle 40.7^\\circ\\) A، وتيار المكثف أكبر من التيار الكلي 10 A.',done:()=>mode==='div'&&did.e10&&S8.I2&&Math.abs(cabs(S8.I2)-16.29)<0.05},
   {t:'فرعان متساويان',x:'اكتب في الفرعين القيم نفسها (مثلاً R = 4 في الاثنين والباقي 0): يتوزع التيار نصفين متساويين \\(I_1 = I_2 = I_T/2\\).',done:()=>mode==='div'&&S8.Z1&&cabs(csub(S8.Z1,S8.Z2))<1e-6&&cabs(S8.Z1)>0}
  ]);
  draw();
 },
 examples:[
  {title:'مثال (1-2-7)',ref:'ص 43–44',q:'<p>في دائرة التوازي الموضحة في الشكل 1-32 (مقاومة 5 Ω وملف 2 Ω مع مصدر \\(30\\angle 0^\\circ\\) V)، احسب السماحية المكافئة، ثم احسب التيار الكلي وتيار كل فرع.</p>',given:G127,solve:g=>parSteps(g,{R:1,L:1})},
  {title:'مثال (1-2-8)',ref:'ص 44–45',q:'<p>دائرة التوازي في الشكل 1-34: مقاومة 3.33 Ω ومكثف 2.5 Ω مع مصدر \\(20\\angle 30^\\circ\\) V. احسب السماحية والمعاوقة والتيارات.</p>',given:G128,solve:g=>parSteps(g,{R:1,C:1})},
  {title:'مثال (1-2-9)',ref:'ص 46–47',q:'<p>في دائرة التوازي الموضحة في الشكل 1-36 احسب السماحية المكافئة \\(Y_T\\) والتيار الكلي \\(I_T\\) وبين أن مجموع التيارات \\(I_R\\) و\\(I_L\\) و\\(I_C\\) يساوي \\(I_T\\).</p>',given:G129,solve:g=>parSteps(g,{R:1,L:1,C:1})},
  {title:'مثال (1-2-10)',ref:'ص 48',q:'<p>احسب التيار في كل فرع في الشكل 1-38، وذلك باستعمال قانون توزيع التيار.</p>',given:G1210,solve:g=>divSteps(g)}
 ],
 quiz:[
  {q:'في دائرة التوازي، أي كمية واحدة لجميع الفروع؟',o:['التيار','الجهد','المعاوقة','القدرة'],c:1,e:'ص 42: معاوقات «خاضعة لنفس الجهد المؤثر بين أطرافها».'},
  {q:'السماحية Y هي:',o:['مجموع المعاوقات','مقلوب المعاوقة 1/Z','الجهد على التيار','المقاومة ناقص الممانعة'],c:1,e:'ص 43: \\(Y = 1/Z\\)، ووحدتها Siemens.'},
  {q:'الجزء التخيلي B<sub>T</sub> من السماحية يسمى:',o:['الموصلية','التقبلية','الممانعة','المعاوقة'],c:1,e:'ص 43: الجزء الحقيقي G موصلية، والتخيلي B تقبلية.'},
  {q:'إذا كانت التقبلية الكلية سالبة فالحمل:',o:['مادي - سعوي','مادي - حثي','مادي بحت','لا يمكن معرفته'],c:1,e:'ص 43: التقبلية السالبة حثية، والتيار الكلي يتأخر عن الجهد.'},
  {q:'مقاومة 5 Ω وملف 2 Ω على التوازي. السماحية المكافئة:',o:['5 + j2 S','0.2 − j0.5 S','0.2 + j0.5 S','7 S'],c:1,e:'مثال (1-2-7): \\(1/5 + 1/(j2) = 0.2 - j0.5\\) S.'},
  {q:'حسب قانون توزيع التيار، التيار في Z<sub>1</sub> يساوي:',o:['\\(\\frac{Z_1 I_T}{Z_1+Z_2}\\)','\\(\\frac{Z_2 I_T}{Z_1+Z_2}\\)','\\(\\frac{I_T}{Z_1}\\)','\\(I_T (Z_1+Z_2)\\)'],c:1,e:'المعادلة (1-40): المعاوقة في الطرف الآخر على مجموع المعاوقتين.'},
  {q:'في مثال (1-2-10) كان تيار المكثف 16.29 A والتيار الكلي 10 A فقط. لماذا؟',o:['خطأ في الحساب','لأن تياري الفرعين متعاكسان تقريباً فيلغي كل منهما جزءاً من الآخر','لأن المكثف يولد تياراً','لأن الجهد زاد'],c:1,e:'الجمع اتجاهي (بالمتجهات) وليس جمعاً عادياً للمقادير.'},
  {q:'في دائرة توازي فيها R و L و C، متى يكون التيار الكلي بنفس طور الجهد؟',o:['عندما R = X<sub>L</sub>','عندما X<sub>L</sub> = X<sub>C</sub> فتصير التقبلية صفراً','عندما يُفصل R','لا يحدث أبداً'],c:1,e:'\\(B_T = 1/X_C - 1/X_L = 0\\) فتبقى الموصلية فقط.'}
 ]
});

/* ======================================================================
   Lesson 9 — parallel resonance, the tank circuit (ص 48–50)
   ====================================================================== */
function fig139(){return parFig({srcType:'I',src:'I',br:[{t:'R',l:sb('R','s')},{parts:[{t:'R',l:sb('R','L')},{t:'L',l:sb('X','L')}]},{t:'C',l:sb('X','C')}],first:90,sp:110,wr:80,aria:'الشكل 1-39 دائرة الرنين المتوازي'})}
function fig140(){return parFig({srcType:'I',src:'I',br:[{t:'R',l:sb('R','s')},{t:'R',l:sb('R','p')},{t:'L',l:sb('X','p')},{t:'C',l:sb('X','C')}],first:90,sp:95,wr:80,aria:'الشكل 1-40 بعد تحويل فرع R-L إلى توازي'})}
function fig141(){return parFig({srcType:'I',src:'80∠0° mA',br:[{t:'R',l:'450 Ω'},{parts:[{t:'R',l:'2 Ω'},{t:'L',l:'30 Ω'}]},{t:'C',l:sb('X','C')}],first:100,sp:115,wr:80,aria:'الشكل 1-41'})}
function tankSteps(g){const XLc=g.XL,RL=g.RL,s2=RL*RL+XLc*XLc;
  const XCx=RD(s2/XLc,2),XC=RD(XCx,0),Rp=RD(s2/RL,1),Zt=RD(g.Rs*Rp/(g.Rs+Rp),1),V=RD(g.I/1000*Zt,1);
  const zl=Math.hypot(RL,XLc),za=RD(Math.atan2(XLc,RL)/D,0),IL=RD(V/zl,2),IC=RD(V/XC,2);
  const w=2*PI*g.f,L=RD(XLc/w*1000,2),C=RD(1/(w*XC)*1000,6);
  return [
   {t:'أ) عند حدوث الرنين نستعمل المعادلة 1-41:',f:`X_C = \\frac{R_L^2 + X_L^2}{X_L} = \\frac{${f1(RL)}^2 + ${f1(XLc)}^2}{${f1(XLc)}} = ${f1(XCx,2)} \\approx ${f1(XC,0)}\\ \\Omega`,final:true},
   {t:'ب) عند حدوث الرنين تكون المعاوقة الكلية (المكثف و\\(X_p\\) يلغي أحدهما الآخر، فيبقى \\(R_s\\) و\\(R_p\\) على التوازي):',f:`R_p = \\frac{R_L^2 + X_L^2}{R_L} = \\frac{${f1(RL)}^2 + ${f1(XLc)}^2}{${f1(RL)}} = ${f1(Rp,1)}\\ \\Omega`},
   {f:`Z_T = \\frac{R_s\\,R_p}{R_s + R_p} = \\frac{${f1(g.Rs)}\\times ${f1(Rp,1)}}{${f1(g.Rs)} + ${f1(Rp,1)}} = ${f1(Zt,1)}\\ \\Omega`,final:true},
   {t:'ج) الجهد بين طرفي المكثف (وهو جهد كل الفروع):',f:`V = I\\,Z_T = ${f1(g.I)}\\times 10^{-3}\\angle 0 \\times ${f1(Zt,1)}\\angle 0 = ${f1(V,1)}\\angle 0\\ \\text{V}`},
   {t:'وبذلك',f:`I_L = \\frac{V}{R_L + jX_L} = \\frac{${f1(V,1)}\\angle 0}{${f1(RL)} + j${f1(XLc)}} = ${PZ(IL,-za,2,0)}\\ \\text{A}`,final:true},
   {f:`I_C = \\frac{V}{-jX_C} = \\frac{${f1(V,1)}\\angle 0}{${PZ(XC,-90,0,0)}} = ${PZ(IC,90,2,0)}\\ \\text{A}`,final:true},
   {t:'د) قيمتا L و C عند تردد الرنين:',f:`L = \\frac{X_L}{2\\pi f_p} = \\frac{${f1(XLc)}}{2\\pi\\times ${f1(g.f,0)}} = ${f1(L,2)}\\ \\text{mH}`,final:true},
   {f:`C = \\frac{1}{2\\pi f_p X_C} = \\frac{1}{2\\pi\\times ${f1(g.f,0)}\\times ${f1(XC,0)}} = ${f1(C,6)}\\ \\text{mF} = ${f1(C*1000,3)}\\ \\mu\\text{F}`,final:true},
   {t:`<b>توضيح للمتدرب (ليس من الكتاب):</b> تيار المكثف (${lt(f1(IC,2)+' A')}) أكبر من تيار المصدر (${lt(f1(g.I/1000,3)+' A')}) بنحو ${lt(f1(IC/(g.I/1000),1))} مرة: الطاقة تتأرجح بين الملف والمكثف داخل «الخزان»، والمصدر يعوض المفقود في المقاومات فقط.`}
  ]}
const G1211=[{id:'I',label:'تيار المصدر',sym:'I',unit:'mA',value:80,min:0},{id:'Rs',label:'مقاومة المصدر',sym:'R_s',unit:'Ω',value:450,min:0.01},{id:'RL',label:'مقاومة الملف',sym:'R_L',unit:'Ω',value:2,min:0.01},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:30,min:0.01},{id:'f',label:'تردد الرنين',sym:'f_p',unit:'Hz',value:20000,min:1}];

B.lesson({
 id:'u1-l9',unit:1,order:9,pages:'48–50',
 title:'الرنين في دوائر التوازي (دائرة الخزان)',
 summary:'ملف حقيقي (له مقاومة R_L) على التوازي مع مكثف، يغذيهما مصدر تيار. نحوّل فرع الملف من توالٍ إلى توازٍ (R_p و X_p)، فيحدث الرنين عندما X_C = X_p، ونحصل على تردد الرنين f_p الذي يعتمد على R_L ولا يعتمد على مقاومة المصدر. مع المثال (1-2-11).',
 stations:[
  {intro:true},

  {st:1,short:'دائرة الخزان',title:'الرنين في دوائر التوازي: دائرة الخزان',ref:'ص 48',
   q:'ملف ومكثف على التوازي يتبادلان الطاقة… لماذا سُمّيت هذه الدائرة «خزاناً»، ولماذا نغذيها بمصدر تيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-39: مصدر تيار ومقاومته الداخلية، وفرع ملف له مقاومة، ومكثف، كلها على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M52 142.0 L52 90 L295 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M52 178.0 L52 230 L295 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مصدر تيار ⟦I⟧ (السهم داخل الدائرة): يعطي تياراً ثابتاً، ويتغير الجهد بين طرفيه حسب الدائرة."><circle cx="52" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="52.0" y1="170.0" x2="52.0" y2="156.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="52.0,149.0 56.2,156.0 47.8,156.0" fill="#2C4A40"/><text x="52" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I</text><rect x="26" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="⟦Rs⟧: المقاومة الداخلية لمصدر التيار، مرسومة على التوازي معه."><path d="M125 90 L125 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M125 182.0 L125 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M125 138.0 L132 145.33333333333334 L118 152.66666666666666 L132 160.0 L118 167.33333333333334 L132 174.66666666666666 L125 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="125" cy="90" r="4.5" fill="#2C4A40"/><circle cx="125" cy="230" r="4.5" fill="#2C4A40"/><text x="143" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="95" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="الملف الحقيقي: ممانعته ⟦XL⟧ ومعها ⟦RL⟧ مقاومة سلك الملف نفسه (المقاومة الداخلية للملف)، على التوالي."><path d="M210 90 L210 110.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 154.0 L210 166.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 210.0 L210 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 110.0 L217 117.33333333333333 L203 124.66666666666667 L217 132.0 L203 139.33333333333334 L217 146.66666666666666 L210 154.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 166.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="210" cy="90" r="4.5" fill="#2C4A40"/><circle cx="210" cy="230" r="4.5" fill="#2C4A40"/><text x="228" y="137.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><text x="228" y="193.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="180" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="المكثف وممانعته ⟦XC⟧."><path d="M295 90 L295 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 182.0 L295 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 138.0 L295 155.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 165.0 L295 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="283" y1="155.0" x2="307" y2="155.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="283" y1="165.0" x2="307" y2="165.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="313" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="265" y="98" width="62" height="124" rx="6" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">دائرة الخزان</text><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الملف والمكثف يتبادلان الطاقة</text></svg>`,
   cap:'دائرة الرنين المتوازي كما في الشكل <span class="ltr">(1-39)</span>.<br><b>مرّر المؤشر على المصدر والفروع الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يُفضَّل أن توصل دائرة الخزان بمصدر تيار لا بمصدر جهد؟',opts:[
     ['لأن مصدر التيار أرخص',false,'الكتاب لا يتحدث عن الثمن.'],
     ['لأنها تستخدم عادة مع عناصر إلكترونية تحتاج إلى تيار ثابت مثل الترانزستور',true,'هذا نص الكتاب في ص 48.'],
     ['لأن مصدر الجهد لا يعمل مع المكثف',false,'مصدر الجهد يعمل مع المكثف، كما في دوائر رنين التوالي.']]}}
   ],
   body:[
    {book:String.raw`<p>دائرة الرنين الموصلة على التوازي تأخذ عادة الشكل الموضح في الشكل <span class="ltr">1-39</span> حيث \(R_L\) هي المقاومة الداخلية للملف و\(R_s\) المقاومة الداخلية لمصدر التيار. هذه الدائرة عادة ما تسمى <b>بدائرة الخزان</b> نسبة إلى اختزان الطاقة بواسطة الملف والمكثف.</p>
     <p>بما أن دائرة الخزان هذه تستخدم عادة مع عناصر إلكترونية تحتاج إلى تيار ثابت مثل الترانزستور، لذا يستحسن أن توصل <b>بمصدر للتيار</b> وليس بمصدر للجهد كما هو الحال في دوائر الرنين الموصلة على التوالي.</p>`,ref:'ص 48'},
    {tip:String.raw`<p>الملف يخزن الطاقة في مجاله المغناطيسي، والمكثف يخزنها في مجاله الكهربائي، وتنتقل الطاقة بينهما ذهاباً وإياباً. لذلك سميت «خزاناً».</p>
     <p>ومصدر التيار يعطي تياراً ثابتاً مهما تغيرت الدائرة، فالذي يتغير هو الجهد بين طرفيه: \(V=I\,Z_T\). وعند الرنين تكون \(Z_T\) كبيرة، فيكون <b>الجهد</b> كبيراً.</p>`,title:'الخزان والمصدر'},
    {watch:String.raw`<p>\(R_L\) ليست مقاومة نضيفها إلى الدائرة؛ هي مقاومة سلك الملف نفسه. كل ملف حقيقي له مقاومة، ولهذا رُسمت على التوالي مع \(X_L\) داخل الفرع نفسه.</p>`},
    {add:String.raw`<p>دوائر الخزان تستعمل في أجهزة الاستقبال (الراديو) لاختيار محطة واحدة من بين محطات كثيرة، وفي المذبذبات التي تولد إشارات بتردد معين.</p>`,title:'أين تجدها؟'},
    {title:'تحقق سريع: دائرة الخزان',widget:(el,B)=>DCML.tf(el,B,{items:[
     [String.raw`\(R_L\) في دائرة الخزان مقاومة سلك الملف نفسه، وليست مقاومة مضافة.`,true,'كل ملف حقيقي له مقاومة، لذلك رُسمت على التوالي مع \\(X_L\\) في الفرع نفسه.'],
     ['يُفضَّل أن تغذى دائرة الخزان بمصدر جهد.',false,'الكتاب: تغذى عادة بمصدر تيار، لأنها تستعمل مع عناصر إلكترونية تحتاج تياراً ثابتاً مثل الترانزستور.'],
     ['في دائرة الخزان يتبادل الملف والمكثف الطاقة ذهاباً وإياباً.',true,'الملف يخزنها في مجاله المغناطيسي والمكثف في مجاله الكهربائي؛ ومن هنا جاء اسم «الخزان».'],
     ['مع مصدر تيار ثابت، الذي يتغير بتغير الدائرة هو الجهد بين طرفي المصدر.',true,'\\(V=I\\,Z_T\\)، والتيار ثابت.']]})}
   ]},

  {st:2,short:'تحويل R-L',title:'تحويل فرع <span class="ltr">R-L</span> من التوالي إلى التوازي',ref:'ص 48–49',
   q:'هل يمكن أن نستبدل ملفاً ومقاومته على التوالي بمقاومة وملف على التوازي دون أن تشعر بقية الدائرة بالفرق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تحويل فرع مقاومة وملف على التوالي إلى مقاومة وملف على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="قبل التحويل: ⟦RL⟧ و⟦XL⟧ على التوالي في فرع واحد: ⟦Z = RL + jXL⟧."><path d="M95 80 L95 106.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 150.0 L95 170.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 214.0 L95 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 106.0 L102 113.33333333333333 L88 120.66666666666667 L102 128.0 L88 135.33333333333334 L102 142.66666666666666 L95 150.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M95 170.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M70 80 L120 80" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M70 240 L120 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="95" cy="80" r="4.5" fill="#2C4A40"/><circle cx="95" cy="240" r="4.5" fill="#2C4A40"/><text x="115" y="133" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><text x="115" y="197" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="60" y="75" width="90" height="170" rx="6" fill="transparent"/></g><text x="95" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">توالٍ</text><line x1="160.0" y1="160.0" x2="186.0" y2="160.0" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="196.0,160.0 186.0,166.0 186.0,154.0" fill="#2C4A40"/><text x="178" y="145" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">=</text><g data-tip="بعد التحويل: ⟦Rp⟧ و⟦Xp⟧ على التوازي، ولهما السماحية نفسها ⟦1/Rp − j/Xp⟧، فلا تشعر الدائرة بالفرق."><path d="M215 80 L335 80" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M215 240 L335 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M240 80 L240 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M240 182.0 L240 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M240 138.0 L247 145.33333333333334 L233 152.66666666666666 L247 160.0 L233 167.33333333333334 L247 174.66666666666666 L240 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M310 80 L310 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M310 182.0 L310 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M310 138.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="240" cy="80" r="4.5" fill="#2C4A40"/><circle cx="240" cy="240" r="4.5" fill="#2C4A40"/><circle cx="310" cy="80" r="4.5" fill="#2C4A40"/><circle cx="310" cy="240" r="4.5" fill="#2C4A40"/><text x="256" y="165" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan></text><text x="326" y="165" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="210" y="75" width="140" height="170" rx="6" fill="transparent"/></g><text x="275" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">توازٍ</text><text x="180" y="46" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Y = 1/R<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan> − j(1/X<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan>)</text></svg>`,
   cap:'الفرع الحقيقي (يميناً) والفرع المكافئ له بعد التحويل (يساراً).<br><b>مرّر المؤشر على كل فرع (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:String.raw`في المثال القادم \(R_L=2\ \Omega\) و\(X_L=30\ \Omega\). كيف تكون \(R_p\) بعد التحويل؟`,opts:[
     [String.raw`قريبة من <span class="ltr">2 Ω</span>`,false,String.raw`\(R_p=\frac{R_L^2+X_L^2}{R_L}\) والمقام صغير، فتكبر كثيراً.`],
     [String.raw`أصغر من <span class="ltr">2 Ω</span>`,false,'العكس: البسط كبير والمقام صغير.'],
     [String.raw`أكبر منها بكثير: <span class="ltr">452 Ω</span>`,true,String.raw`\(\frac{2^2+30^2}{2}=452\ \Omega\) كما في حل المثال <span class="ltr">(1-2-11)</span>.`]]}}
   ],
   body:[
    {book:String.raw`<p>في البداية سنقوم باستبدال الفرع الذي يحتوي على توالي R-L بفرع آخر يحتوي على توازي R-L كما يلي:</p>
     $$Z_{R-L}=R_L+jX_L\qquad Y_{R-L}=\frac{1}{Z_{R-L}}=\frac{1}{R_L+jX_L}$$
     $$Y_{R-L}=\frac{1}{R_L+jX_L}\times\frac{R_L-jX_L}{R_L-jX_L}=\frac{1}{R_p}-j\frac{1}{X_p}$$
     <p>حيث</p>$$R_p=\frac{R_L^2+X_L^2}{R_L}\qquad X_p=\frac{R_L^2+X_L^2}{X_L}$$
     <p>بالتالي يصبح شكل دائرة الرنين المتوازي كما هو موضح في الشكل <span class="ltr">1-40</span>.</p>`,ref:'ص 48–49'},
    {tip:String.raw`<p>الضرب في \((R_L-jX_L)\) فوق وتحت يجعل المقام عدداً حقيقياً: \((R_L+jX_L)(R_L-jX_L)=R_L^2+X_L^2\). فتصبح</p>
     $$Y_{R-L}=\frac{R_L}{R_L^2+X_L^2}-j\frac{X_L}{R_L^2+X_L^2}$$
     <p>الجزء الحقيقي مقلوب \(R_p\)، والجزء التخيلي مقلوب \(X_p\). وفي التوازي نجمع السماحيات، فهذا يعني مقاومة \(R_p\) وملفاً \(X_p\) على التوازي.</p>`,title:'من أين جاءت \\(R_p\\) و \\(X_p\\)؟'},
    {tip:String.raw`<p>بأرقام المثال القادم: \(R_p=452\ \Omega\) (أكبر بكثير من <span class="ltr">2 Ω</span>)، و\(X_p=\frac{904}{30}\approx 30.13\ \Omega\) (قريبة جداً من <span class="ltr">30 Ω</span>). المقاومة الصغيرة على التوالي تصبح مقاومة كبيرة على التوازي.</p>`,title:'بالأرقام'},
    {watch:String.raw`<p>\(X_p\) ليست \(X_L\): تقتربان فقط عندما تكون \(R_L\) صغيرة جداً مقارنة بـ\(X_L\). وكذلك \(R_p\) ليست \(R_L\).</p>`},
    {title:'مختبر مصغّر: حوّل الفرع بنفسك',widget:(el,B)=>DCML.lab(el,B,{intro:'\\(X_L=30\\ \\Omega\\) من المثال القادم. قيمة \\(R_L\\) في الكتاب <span class="ltr">2 Ω</span>، والقيم الأخرى <b>أرقام تختارها أنت</b>.',
 predict:{q:'لو كانت مقاومة الملف <span class="ltr">1 Ω</span> بدلاً من <span class="ltr">2 Ω</span>، ماذا يحدث للمقاومة المكافئة \\(R_p\\)؟',opts:[
  ['تقل إلى النصف تقريباً',false,'\\(R_L\\) في المقام: كلما صغرت كبرت \\(R_p\\).'],
  ['تتضاعف تقريباً',true,'\\(R_p=\\frac{1+900}{1}=901\\ \\Omega\\) بدلاً من <span class="ltr">452 Ω</span>.'],
  ['لا تتغير',false,'\\(R_p\\) تعتمد على \\(R_L\\) مباشرة.']]},
 ins:[{k:'r',l:'مقاومة الملف R<sub>L</sub>',u:'Ω',min:1,max:10,step:1,v:2,dp:0}],
 calc:(s,P,B)=>{const n=s.r*s.r+900,Rp=n/s.r,Xp=n/30;
  return {facts:[['<span class="ltr">R<sub>L</sub><sup>2</sup> + X<sub>L</sub><sup>2</sup></span>',DCML.fm(B,n,0)],['<span class="ltr">R<sub>p</sub> = (R<sub>L</sub><sup>2</sup> + X<sub>L</sub><sup>2</sup>) ÷ R<sub>L</sub></span>',DCML.fm(B,Rp,1)+' Ω','hi'],['<span class="ltr">X<sub>p</sub> = (R<sub>L</sub><sup>2</sup> + X<sub>L</sub><sup>2</sup>) ÷ X<sub>L</sub></span>',DCML.fm(B,Xp,2)+' Ω','hi']],
   msg:s.r===2?'أرقام المثال: \\(R_p=452\\ \\Omega\\) و \\(X_p\\approx30.13\\ \\Omega\\).':'المقاومة الصغيرة على التوالي تصير مقاومة كبيرة على التوازي، و\\(X_p\\) تبقى قريبة من \\(X_L\\) ما دامت \\(R_L\\) صغيرة.'}}})}
   ]},

  {st:3,short:'عند حدوث الرنين',title:'عند حدوث الرنين: تردد الرنين <span class="ltr">f<sub>p</sub></span>',ref:'ص 49',
   q:'عند الرنين يلغي الملف والمكثف أحدهما الآخر… فماذا يبقى من الدائرة، وهل تؤثر مقاومة المصدر في تردد الرنين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-40: أربعة فروع على التوازي Rs و Rp و Xp و XC، والملف والمكثف داخل إطار يدل على تساويهما عند الرنين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M48 142.0 L48 90 L285 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 178.0 L48 230 L285 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مصدر تيار ⟦I⟧ (السهم داخل الدائرة): يعطي تياراً ثابتاً، ويتغير الجهد بين طرفيه حسب الدائرة."><circle cx="48" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="48.0" y1="170.0" x2="48.0" y2="156.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="48.0,149.0 52.2,156.0 43.8,156.0" fill="#2C4A40"/><text x="48" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I</text><rect x="22" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><path d="M105 90 L105 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M105 182.0 L105 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M105 138.0 L112 145.33333333333334 L98 152.66666666666666 L112 160.0 L98 167.33333333333334 L112 174.66666666666666 L105 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="105" cy="90" r="4.5" fill="#2C4A40"/><circle cx="105" cy="230" r="4.5" fill="#2C4A40"/><text x="123" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text><g data-tip="⟦Rp⟧: الجزء المادي من فرع الملف بعد التحويل."><path d="M165 90 L165 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M165 182.0 L165 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M165 138.0 L172 145.33333333333334 L158 152.66666666666666 L172 160.0 L158 167.33333333333334 L172 174.66666666666666 L165 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="165" cy="90" r="4.5" fill="#2C4A40"/><circle cx="165" cy="230" r="4.5" fill="#2C4A40"/><text x="183" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">R<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="135" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="⟦Xp⟧: الجزء الحثي من فرع الملف بعد التحويل."><path d="M225 90 L225 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M225 182.0 L225 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M225 138.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="225" cy="90" r="4.5" fill="#2C4A40"/><circle cx="225" cy="230" r="4.5" fill="#2C4A40"/><text x="243" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="195" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="⟦XC⟧: المكثف."><path d="M285 90 L285 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M285 182.0 L285 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M285 138.0 L285 155.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M285 165.0 L285 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="273" y1="155.0" x2="297" y2="155.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="273" y1="165.0" x2="297" y2="165.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="303" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="255" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="عند الرنين ⟦XC = Xp⟧: تيار الملف وتيار المكثف متساويان ومتعاكسان فيلغي كل منهما الآخر بالنسبة للمصدر، ويبقى ⟦Rs⟧ و⟦Rp⟧ فقط."><rect x="200" y="62" width="120" height="196" rx="14" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="6 5"/><text x="260" y="282" text-anchor="middle" font-size="13" fill="#B5523C" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan> = X<tspan font-size="10" dy="4">p</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="200" y="60" width="120" height="232" rx="6" fill="transparent"/></g><text x="140" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">بعد التحويل</text></svg>`,
   cap:'الدائرة بعد التحويل كما في الشكل <span class="ltr">(1-40)</span>: أربعة فروع على التوازي.<br><b>مرّر المؤشر على الفروع والإطار المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`هل تؤثر مقاومة المصدر \(R_s\) في تردد الرنين \(f_p\)؟`,opts:[
     ['نعم، كلما كبرت قلّ التردد',false,String.raw`\(R_s\) لا تظهر في المعادلة (1-42) أصلاً.`],
     ['لا، ليس لها تأثير',true,String.raw`نص الكتاب: «مقاومة المصدر \(R_s\) ليس لها تأثير على تردد الرنين».`],
     ['نعم، كلما كبرت زاد التردد',false,String.raw`\(R_s\) مقاومة فقط، والرنين شرطه تساوي \(X_C\) و\(X_p\).`]]}}
   ],
   body:[
    {book:String.raw`<div class="eq">$$X_C=X_p\ \Rightarrow\ X_C=\frac{R_L^2+X_L^2}{X_L}$$<span class="eqno">(1-41)</span></div>
     <p>وبعد بعض الخطوات البسيطة نحصل على تردد الرنين</p>
     <div class="eq">$$f_p=\frac{1}{2\pi L}\sqrt{\frac{L}{C}-R_L^2}$$<span class="eqno">(1-42)</span></div>
     <p>ويلاحظ أن هذا التردد <b>يعتمد على قيمة المقاومة \(R_L\)</b>، ويلاحظ كذلك أن مقاومة المصدر \(R_s\) <b>ليس لها تأثير</b> على تردد الرنين.</p>`,ref:'ص 49'},
    {tip:String.raw`<p>نعوّض \(X_C=\frac{1}{\omega C}\) و\(X_L=\omega L\) في (1-41): \(\frac{1}{\omega C}=\frac{R_L^2+\omega^2L^2}{\omega L}\). نضرب الطرفين في \(\omega L\): \(\frac{L}{C}=R_L^2+\omega^2L^2\)، إذن \(\omega=\frac{1}{L}\sqrt{\frac{L}{C}-R_L^2}\)، ثم نقسم على \(2\pi\).</p>
     <p>وإذا كانت \(R_L=0\) نعود إلى قانون رنين التوالي \(f=\frac{1}{2\pi\sqrt{LC}}\).</p>`,title:'«الخطوات البسيطة»'},
    {title:'غيّر مقاومة الملف وراقب تردد الرنين',widget:(el,B)=>{
      /* L و C من حل المثال (1-2-11): L = 0.24 mH و C = 0.000265 mF = 0.265 µF */
      const Lh=0.24e-3,Cf=0.265e-6,lim=Math.sqrt(Lh/Cf);
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">بقيم المثال التالي: <span class="ltr">L = 0.24 mH</span> و <span class="ltr">C = 0.265 µF</span>. الوضع الابتدائي <span class="ltr">R<sub>L</sub> = 2 Ω</span> كما في المثال.</p>
       <div class="cb-sl"><div class="cb-h"><span>مقاومة الملف R<sub>L</sub></span><b data-o="r"></b></div><div class="cb-in"><input type="range" min="0" max="40" step="0.5" value="2" aria-label="مقاومة الملف"></div></div>
       <div class="cb-row"><span class="cb-chip" data-o="f"></span></div><p class="sub" data-o="x" style="margin:6px 0 0"></p>`;
      const r=el.querySelector('input'),o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const R=+r.value,q=Lh/Cf-R*R;o('r').textContent=R+' Ω';
        if(q<=0){o('f').className='cb-chip warn';o('f').innerHTML='لا يحدث رنين: الجذر سالب';o('x').innerHTML=`\\(R_L^2\\ge\\frac{L}{C}\\): مقاومة الملف كبيرة (أكبر من <span class="ltr">${lim.toFixed(1)} Ω</span> هنا) فلا يوجد تردد يتساوى عنده \\(X_C\\) و\\(X_p\\).`}
        else{const f=Math.sqrt(q)/(2*Math.PI*Lh);o('f').className='cb-chip ok';o('f').innerHTML=`<span class="ltr">f<sub>p</sub> ≈ ${Math.round(f)} Hz</span>`;
          o('x').innerHTML=R===0?'هذا هو تردد رنين التوالي \\(\\frac{1}{2\\pi\\sqrt{LC}}\\) نفسه.':'كلما زادت \\(R_L\\) نقص تردد الرنين قليلاً.'}
        B.math(o('x'))};
      r.oninput=draw;draw();
    }},
    {watch:String.raw`<p>إذا كانت \(R_L^2\) أكبر من \(\frac{L}{C}\) يصبح ما تحت الجذر سالباً: لا يحدث رنين أصلاً. لذلك تحتاج دائرة الخزان ملفاً مقاومته صغيرة.</p>`}
   ]},

  {st:4,short:'مثال <span class="ltr">(1-2-11)</span>',title:'مثال <span class="ltr">(1-2-11)</span>: حسابات دائرة الخزان عند الرنين',ref:'ص 49–50',
   q:'المصدر يعطي <span class="ltr">80 mA</span> فقط… فكم يكون التيار الدائر بين الملف والمكثف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-41: مصدر تيار 80 مللي أمبير، ومقاومة 450 أوم، وملف 30 أوم مقاومته 2 أوم، ومكثف" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M52 142.0 L52 90 L290 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M52 178.0 L52 230 L290 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مصدر تيار ⟦80∠0° mA⟧ أي ⟦0.08 A⟧."><circle cx="52" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="52.0" y1="170.0" x2="52.0" y2="156.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="52.0,149.0 56.2,156.0 47.8,156.0" fill="#2C4A40"/><text x="52" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">80∠0° mA</text><rect x="26" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="مقاومة المصدر الداخلية ⟦Rs = 450 Ω⟧."><path d="M120 90 L120 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 182.0 L120 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 138.0 L127 145.33333333333334 L113 152.66666666666666 L127 160.0 L113 167.33333333333334 L127 174.66666666666666 L120 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="120" cy="90" r="4.5" fill="#2C4A40"/><circle cx="120" cy="230" r="4.5" fill="#2C4A40"/><text x="139" y="156.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">450 Ω</text><rect x="90" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="الملف: ممانعته ⟦30 Ω⟧ ومقاومته ⟦2 Ω⟧ على التوالي."><path d="M205 90 L205 110.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 154.0 L205 166.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 210.0 L205 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 110.0 L212 117.33333333333333 L198 124.66666666666667 L212 132.0 L198 139.33333333333334 L212 146.66666666666666 L205 154.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 166.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="205" cy="90" r="4.5" fill="#2C4A40"/><circle cx="205" cy="230" r="4.5" fill="#2C4A40"/><text x="223" y="137.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2 Ω</text><text x="223" y="193.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">30 Ω</text><rect x="175" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="المكثف: ممانعته ⟦XC⟧ هي المطلوب الأول في المثال."><path d="M290 90 L290 138.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 182.0 L290 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 138.0 L290 155.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 165.0 L290 182.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="278" y1="155.0" x2="302" y2="155.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="278" y1="165.0" x2="302" y2="165.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="308" y="165.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="260" y="98" width="62" height="124" rx="6" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">المطلوب عند الرنين</text></svg>`,
   cap:'الشكل <span class="ltr">(1-41)</span>: مصدر تيار ومقاومته <span class="ltr">450 Ω</span>، وملف <span class="ltr">30 Ω</span> مقاومته <span class="ltr">2 Ω</span>، ومكثف.<br><b>مرّر المؤشر على المصدر والفروع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`عند الرنين، كم تقريباً \(X_C\)؟`,opts:[
     [String.raw`<span class="ltr">30 Ω</span> تقريباً`,true,String.raw`من (1-41): \(X_C=\frac{2^2+30^2}{30}\approx 30\ \Omega\).`],
     [String.raw`<span class="ltr">2 Ω</span>`,false,'هذه مقاومة الملف، لا ممانعة المكثف.'],
     [String.raw`<span class="ltr">452 Ω</span>`,false,String.raw`هذه \(R_p\)، لا \(X_C\).`]]}}
   ],
   body:[
    {book:String.raw`<p>من الدائرة الموضحة في الشكل <span class="ltr">1-41</span> أوجد ما يلي:</p><ol><li>قيمة \(X_C\) عند حدوث الرنين.</li><li>المعاوقة الكلية \(Z_T\) عند حدوث الرنين.</li><li>التيارات \(I_C\) و\(I_L\) عند حدوث الرنين.</li><li>إذا كان تردد الرنين هو <span class="ltr">20000 Hz</span> أوجد قيمة L و C عند حدوث الرنين.</li></ol>
     <p><b>الحل:</b></p>
     $$X_C=\frac{R_L^2+X_L^2}{X_L}=\frac{2^2+30^2}{30}\approx 30\ \Omega$$
     $$R_p=\frac{R_L^2+X_L^2}{R_L}=\frac{2^2+30^2}{2}=452\ \Omega\qquad Z_T=\frac{R_s R_p}{R_s+R_p}=\frac{450\times 452}{450+452}=225.5\ \Omega$$
     $$V=I\,Z_T=80\times 10^{-3}\angle 0\times 225.5\angle 0=18\angle 0\ \text{V}$$
     $$I_L=\frac{V}{R_L+jX_L}=\frac{18\angle 0}{2+j30}=0.6\angle -86^\circ\ \text{A}\qquad I_C=\frac{V}{-jX_C}=\frac{18\angle 0}{30\angle -90^\circ}=0.6\angle 90^\circ\ \text{A}$$
     $$L=\frac{X_L}{2\pi f_p}=\frac{30}{2\pi\times 20000}=0.24\ \text{mH}\qquad C=\frac{1}{2\pi f_p X_C}=\frac{1}{2\pi\times 20000\times 30}=0.000265\ \text{mF}$$`,ref:'ص 49–50'},
    {tip:String.raw`<p>عند الرنين يلغي الملف \(X_p\) والمكثف \(X_C\) أحدهما الآخر، فلا يبقى بالنسبة للمصدر إلا \(R_s\) و\(R_p\) على التوازي. لذلك \(Z_T\) عدد حقيقي (<span class="ltr">225.5 Ω</span>) والجهد في طور التيار.</p>
     <p>وتيار الملف وتيار المكثف (<span class="ltr">0.6 A</span> لكل منهما) أكبر من تيار المصدر (<span class="ltr">0.08 A</span>) بنحو <span class="ltr">7.5</span> مرات، وهما متعاكسان تقريباً: هذه هي الطاقة المتأرجحة داخل الخزان.</p>`,title:'ماذا تعني النتائج؟'},
    {tip:String.raw`<p>\(0.000265\ \text{mF}=0.265\ \mu\text{F}\). والقيمة الأدق \(X_C=30.13\ \Omega\)، والحل يستعمل التقريب <span class="ltr">30 Ω</span>.</p>`,title:'تحويل الوحدة'},
    {watch:String.raw`<p>كُتب تردد الرنين في نص المثال في الكتاب «20.000 Hz» بنقطة تفصل الآلاف، والمقصود <span class="ltr">20000 Hz</span> (عشرون ألف هيرتز) كما يظهر في الحل.</p>`,fix:true},
    {title:'مختبر مصغّر: دور مقاومة المصدر R<sub>s</sub>',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام المثال عند الرنين: \\(I=80\\ \\text{mA}\\) و \\(R_s=450\\ \\Omega\\) و \\(R_p=452\\ \\Omega\\) و \\(X_C\\approx30\\ \\Omega\\). أزل \\(R_s\\) لتقارن (حالة للمقارنة ليست في الكتاب).',
 predict:{q:'لو لم تكن للمصدر مقاومة \\(R_s\\) (مصدر تيار مثالي)، كيف يصير الجهد على الدائرة؟',opts:[
  ['يبقى <span class="ltr">18 V</span>',false,'\\(Z_T\\) تتغير: لا يبقى على التوازي إلا \\(R_p\\).'],
  ['يقرب من الضعف',true,'\\(Z_T=R_p=452\\ \\Omega\\) بدلاً من <span class="ltr">225.5 Ω</span>، فالجهد \\(0.08\\times452\\approx36\\ \\text{V}\\).'],
  ['يصير صفراً',false,'التيار ما زال يمر في \\(R_p\\).']]},
 ins:[{k:'rs',l:'R<sub>s</sub>',sw:true,v:1,on:'R<sub>s</sub> = 450 Ω موصولة (الكتاب)',off:'R<sub>s</sub> غير موصولة (للمقارنة)'}],
 calc:(s,P,B)=>{const Zt=s.rs?450*452/(450+452):452,V=0.08*Zt,IL=V/Math.hypot(2,30),IC=V/30;
  return {facts:[['Z<sub>T</sub>',DCML.fm(B,Zt,1)+' Ω'],['<span class="ltr">V = I Z<sub>T</sub></span>',DCML.fm(B,V,1)+' V','hi'],['I<sub>L</sub>',DCML.fm(B,IL,2)+' A'],['I<sub>C</sub>',DCML.fm(B,IC,2)+' A']],
   bars:[{l:'تيار المصدر',v:0.08,max:1.4,u:'A',dp:2,col:'--blue'},{l:'تيار الملف',v:IL,max:1.4,u:'A',dp:2,col:'--live'},{l:'تيار المكثف',v:IC,max:1.4,u:'A',dp:2,col:'--on'}],
   msg:s.rs?'كما في حل الكتاب: \\(Z_T=225.5\\ \\Omega\\) و \\(V=18\\ \\text{V}\\) و \\(I_L\\approx I_C=0.6\\ \\text{A}\\).':'بلا \\(R_s\\) يتضاعف الجهد تقريباً ويتضاعف التيار الدائر في الخزان. أما تردد الرنين فلا يتغير، لأن \\(R_s\\) لا تظهر في <span class="ltr">(1-42)</span>.'}}})}
   ]},

  {recap:[
   String.raw`دائرة الخزان: ملف حقيقي (\(R_L\) مع \(X_L\)) على التوازي مع مكثف، وتغذى بمصدر تيار لأنها تستعمل مع عناصر إلكترونية تحتاج تياراً ثابتاً (ص 48).`,
   String.raw`فرع \(R_L+jX_L\) يكافئ \(R_p\) و\(X_p\) على التوازي: \(R_p=\frac{R_L^2+X_L^2}{R_L}\) و\(X_p=\frac{R_L^2+X_L^2}{X_L}\).`,
   String.raw`شرط الرنين \(X_C=X_p=\frac{R_L^2+X_L^2}{X_L}\) (1-41).`,
   String.raw`تردد الرنين \(f_p=\frac{1}{2\pi L}\sqrt{\frac{L}{C}-R_L^2}\) (1-42): يعتمد على \(R_L\) ولا يتأثر بـ\(R_s\).`,
   String.raw`عند الرنين \(Z_T=\frac{R_sR_p}{R_s+R_p}\)، وتيارا الملف والمكثف أكبر من تيار المصدر بكثير، كما في المثال <span class="ltr">(1-2-11)</span>.`]}
],
 theory:[
  {h:'دائرة الخزان',ref:'ص 48',html:`<p>دائرة الرنين الموصلة على التوازي تأخذ عادة الشكل الموضح في الشكل 1-39 حيث \\(R_L\\) هي المقاومة الداخلية للملف و\\(R_s\\) المقاومة الداخلية لمصدر التيار. هذه الدائرة عادة ما تسمى <b>بدائرة الخزان</b> نسبة إلى اختزان الطاقة بواسطة الملف والمكثف.</p>
   <p>بما أن دائرة الخزان هذه تستخدم عادة مع عناصر إلكترونية تحتاج إلى تيار ثابت مثل الترانزستور، لذا يستحسن أن توصل <b>بمصدر للتيار</b> وليس بمصدر للجهد كما هو الحال في دوائر الرنين الموصلة على التوالي.</p>`},
  {fig:'(1-39)',ref:'ص 48',caption:'مصدر تيار I (السهم داخل الدائرة) ومقاومته الداخلية R<sub>s</sub>، وفرع الملف (R<sub>L</sub> على التوالي مع X<sub>L</sub>)، والمكثف X<sub>C</sub>.',draw:()=>box(fig139(),460)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> مصدر التيار يعطي تياراً ثابتاً مهما تغيرت الدائرة، فالجهد بين طرفيه هو الذي يتغير: \\(V = I\\,Z_T\\). لذلك عند الرنين (حيث تكون \\(Z_T\\) أكبر ما يمكن تقريباً) يكون <b>الجهد</b> أكبر ما يمكن.'},
  {h:'تحويل فرع R-L من التوالي إلى التوازي',ref:'ص 48–49',html:`<p>في البداية سنقوم باستبدال الفرع الذي يحتوي على توالي R-L بفرع آخر يحتوي على توازي R-L كما يلي:</p>
   $$Z_{R-L}=R_L+jX_L\\qquad Y_{R-L}=\\frac{1}{Z_{R-L}}=\\frac{1}{R_L+jX_L}$$
   $$Y_{R-L}=\\frac{1}{R_L+jX_L}\\times\\frac{R_L-jX_L}{R_L-jX_L}=\\frac{1}{R_p}-j\\frac{1}{X_p}$$
   <p>حيث</p>$$R_p=\\frac{R_L^2+X_L^2}{R_L}\\qquad X_p=\\frac{R_L^2+X_L^2}{X_L}$$
   <p>بالتالي يصبح شكل دائرة الرنين المتوازي كما هو موضح في الشكل 1-40.</p>`},
  {fig:'(1-40)',ref:'ص 49',caption:'بعد التحويل: أربعة فروع على التوازي R<sub>s</sub> و R<sub>p</sub> و X<sub>p</sub> (ملف) و X<sub>C</sub> (مكثف).',draw:()=>box(fig140(),500)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> الضرب في \\((R_L - jX_L)\\) فوق وتحت يجعل المقام عدداً حقيقياً: \\((R_L+jX_L)(R_L-jX_L) = R_L^2 + X_L^2\\). فتصبح \\(Y_{R-L} = \\frac{R_L}{R_L^2+X_L^2} - j\\frac{X_L}{R_L^2+X_L^2}\\)، ومقلوب كل جزء هو \\(R_p\\) و\\(X_p\\). مثال: \\(R_L = 2\\) و\\(X_L = 30\\) تعطي \\(R_p = 452\\ \\Omega\\) (أكبر بكثير من 2) و\\(X_p = 30.13\\ \\Omega\\) (قريبة جداً من 30).'},
  {h:'عند حدوث الرنين',ref:'ص 49',html:`$$X_C=X_p\\ \\Rightarrow\\ X_C=\\frac{R_L^2+X_L^2}{X_L} \\qquad (1\\text{-}41)$$
   <p>وبعد بعض الخطوات البسيطة نحصل على تردد الرنين</p>
   $$f_p=\\frac{1}{2\\pi L}\\sqrt{\\frac{L}{C}-R_L^2} \\qquad (1\\text{-}42)$$
   <p>ويلاحظ أن هذا التردد <b>يعتمد على قيمة المقاومة \\(R_L\\)</b>، ويلاحظ كذلك أن مقاومة المصدر \\(R_s\\) <b>ليس لها تأثير</b> على تردد الرنين.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب) — «الخطوات البسيطة»:</b> نعوض \\(X_C = \\frac{1}{\\omega C}\\) و\\(X_L = \\omega L\\) في (1-41): \\(\\frac{1}{\\omega C} = \\frac{R_L^2 + \\omega^2 L^2}{\\omega L}\\)، نضرب الطرفين في \\(\\omega L\\): \\(\\frac{L}{C} = R_L^2 + \\omega^2 L^2\\)، إذن \\(\\omega = \\frac{1}{L}\\sqrt{\\frac{L}{C} - R_L^2}\\) ثم نقسم على \\(2\\pi\\). وإذا كانت \\(R_L = 0\\) نعود إلى قانون رنين التوالي \\(f = \\frac{1}{2\\pi\\sqrt{LC}}\\). وإذا كانت \\(R_L^2 > L/C\\) فلا يحدث رنين أصلاً (الجذر سالب).'},
  {h:'مثال (1-2-11)',ref:'ص 49–50',html:`<p>من الدائرة الموضحة في الشكل 1-41 أوجد ما يلي:</p><ol><li>قيمة \\(X_C\\) عند حدوث الرنين.</li><li>المعاوقة الكلية \\(Z_T\\) عند حدوث الرنين.</li><li>التيارات \\(I_C\\) و\\(I_L\\) عند حدوث الرنين.</li><li>إذا كان تردد الرنين هو <span class="ltr">20000 Hz</span> أوجد قيمة L و C عند حدوث الرنين.</li></ol>`},
  {fig:'(1-41)',ref:'ص 50',caption:'مصدر تيار 80∠0° mA، ومقاومة 450 Ω (مقاومة المصدر)، وملف 30 Ω مقاومته 2 Ω، ومكثف X<sub>C</sub>.',draw:()=>box(fig141(),480)},
  {html:`<p><b>الحل:</b></p>
   $$X_C=\\frac{R_L^2+X_L^2}{X_L}=\\frac{2^2+30^2}{30}\\approx 30\\ \\Omega$$
   $$R_p=\\frac{R_L^2+X_L^2}{R_L}=\\frac{2^2+30^2}{2}=452\\ \\Omega\\qquad Z_T=\\frac{R_s R_p}{R_s+R_p}=\\frac{450\\times 452}{450+452}=225.5\\ \\Omega$$
   $$V=I\\,Z_T=80\\times 10^{-3}\\angle 0\\times 225.5\\angle 0=18\\angle 0\\ \\text{V}$$
   $$I_L=\\frac{V}{R_L+jX_L}=\\frac{18\\angle 0}{2+j30}=0.6\\angle -86^\\circ\\ \\text{A}\\qquad I_C=\\frac{V}{-jX_C}=\\frac{18\\angle 0}{30\\angle -90^\\circ}=0.6\\angle 90^\\circ\\ \\text{A}$$
   $$L=\\frac{X_L}{2\\pi f_p}=\\frac{30}{2\\pi\\times 20000}=0.24\\ \\text{mH}\\qquad C=\\frac{1}{2\\pi f_p X_C}=\\frac{1}{2\\pi\\times 20000\\times 30}=0.000265\\ \\text{mF}$$`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> \\(0.000265\\) mF \\(= 0.265\\ \\mu\\)F. والقيمة الدقيقة \\(X_C = 30.13\\ \\Omega\\)، والحل يستعمل التقريب 30. ولاحظ أن تيار الملف وتيار المكثف (0.6 A لكل منهما) أكبر من تيار المصدر (0.08 A) بنحو 7.5 مرات، وهما متعاكسان تقريباً (−86° و+90°) فيلغي كل منهما الآخر تقريباً: هذه هي الطاقة المتأرجحة داخل الخزان.'},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> كُتب تردد الرنين في نص المثال (ص 50) «20.000 Hz» بنقطة فاصلة للآلاف، والمقصود <span class="ltr">20000 Hz</span> (عشرون ألف هيرتز) كما يظهر في الحل.</span>'}
 ],
 lab:(el)=>{
  const P={I:80,Rs:450,rsOn:1,RL:2,L:0.24,C:0.265,f:20};const did={};let ph=0;
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c5"><h2>دائرة الخزان <small>مبنية على الشكلين (1-39) و(1-41)</small></h2>
    <div class="cb-row"><button class="btn" id="l9ex">أرقام مثال 1-2-11</button><button class="btn primary" id="l9fp">اضبط f على f<sub>p</sub></button></div>
    <div class="cb-sls">${nsl('l9f','تردد المصدر f',1,80,0.01,P.f,'kHz')}${nsl('l9I','تيار المصدر I',1,200,1,P.I,'mA')}</div>
    <div class="cb-row">${swHTML('l9rs','R<sub>s</sub>','مقاومة المصدر موصولة',1)}</div>
    ${nsl('l9Rs','مقاومة المصدر R<sub>s</sub>',50,5000,1,P.Rs,'Ω')}
    <div class="cb-sls">${nsl('l9RL','مقاومة الملف R<sub>L</sub>',0,20,0.1,P.RL,'Ω')}${nsl('l9L','محاثة الملف L',0.05,1,0.001,P.L,'mH')}${nsl('l9C','سعة المكثف C',0.05,1,0.001,P.C,'µF')}</div></div>
   <div class="panel c7"><h2>القراءات <small>القيم الفعالة</small></h2><div class="svgbox cb-wide" id="l9c"></div>
    <div class="facts">${fact('f<sub>p</sub> من (1-42)','l9ffp')}${fact(lt('X<sub>L</sub> / X<sub>C</sub>'),'l9x')}${fact(lt('R<sub>p</sub> / X<sub>p</sub>'),'l9rp')}${fact('Z<sub>T</sub> = V / I','l9z')}${fact('V (جهد الخزان)','l9v')}${fact(lt('I<sub>L</sub> / I<sub>C</sub>'),'l9ilc')}</div>
    <div class="cb-row"><span id="l9chip" class="cb-chip"></span></div></div>
   <div class="panel c7"><h2>منحنى الاستجابة: مقدار المعاوقة الكلية مع التردد <small>الخط المتقطع = f<sub>p</sub> من المعادلة (1-42)، والنقطة = ترددك الآن</small></h2><div class="svgbox" id="l9plot"></div></div>
   <div class="panel c5"><h2>الشكل المطاور <small>V والتيارات</small></h2><div class="svgbox" id="l9ph" style="max-width:320px;margin-inline:auto"></div>${legend([['--fg','V'],['--muted','I<sub>Rs</sub>'],['--live','I<sub>L</sub>'],['--on','I<sub>C</sub>'],['--stop','I (المصدر)']])}
    <h3 class="sm">الطاقة في الخزان <small>(العرض مبطأ جداً)</small></h3>
    <div class="sub">طاقة مغناطيسية في الملف ½Li²</div><div class="cb-bar"><i id="l9wl" style="background:var(--live)"></i></div>
    <div class="sub" style="margin-top:6px">طاقة كهربائية في المكثف ½Cv²</div><div class="cb-bar"><i id="l9wc" style="background:var(--on)"></i></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l9st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const setF=nslBind(el,'l9f',v=>{P.f=v;draw()}),setI=nslBind(el,'l9I',v=>{P.I=v;draw()}),setRs=nslBind(el,'l9Rs',v=>{P.Rs=v;draw()}),setRL=nslBind(el,'l9RL',v=>{P.RL=v;draw()}),setL=nslBind(el,'l9L',v=>{P.L=v;draw()}),setC=nslBind(el,'l9C',v=>{P.C=v;draw()});
  $('#l9rs').onclick=()=>{P.rsOn=P.rsOn?0:1;$('#l9rs').setAttribute('aria-pressed',P.rsOn?'true':'false');did.rs=1;draw()};
  $('#l9ex').onclick=()=>{Object.assign(P,{I:80,Rs:450,rsOn:1,RL:2,L:0.24,C:0.265});setI(80);setRs(450);setRL(2);setL(0.24);setC(0.265);$('#l9rs').setAttribute('aria-pressed','true');did.ex=1;draw()};
  const fpOf=()=>{const L=P.L*1e-3,C=P.C*1e-6,r=L/C-P.RL*P.RL;return r>0?Math.sqrt(r)/(2*PI*L):NaN};
  $('#l9fp').onclick=()=>{const fp=fpOf();if(isFinite(fp)){P.f=RD(fp/1000,2);setF(P.f);draw()}};
  /* عطل مخفي: القيم الفعلية للخزان (مقاومة الملف، سعة المكثف، فرع مفتوح). الحسابات المعروضة (fp و XL و XC) بالقيم المكتوبة. خارج وضع التحدي لا فرق */
  const solve=fk=>{const w=2*PI*fk*1000,ZL=Cx(P.RL+(chF('rcoil')?10:0),w*P.L*1e-3),Yc=chF('copen')?Cx(0):Cx(0,w*P.C*(chF('cdry')?0.5:1)*1e-6),lo=chF('lopen');let Y=cadd(lo?Cx(0):cinv(ZL),Yc);if(P.rsOn)Y=cadd(Y,Cx(1/P.Rs));const I=Cx(P.I/1000);const V=cdiv(I,Y);return {w,ZL,Y,V,IL:lo?Cx(0):cdiv(V,ZL),IC:cmul(V,Yc),IRs:P.rsOn?csc(V,1/P.Rs):Cx(0),Z:cinv(Y)}};
  let R9={};
  function draw(){const fp=fpOf(),r=solve(P.f);R9={r,fp};
   const XL=r.w*P.L*1e-3,XC=1/(r.w*P.C*1e-6),s2=P.RL*P.RL+XL*XL;
   $('#l9ffp').textContent=isFinite(fp)?f1(fp/1000,3)+' kHz':'لا رنين (RL² > L/C)';
   $('#l9x').textContent=f1(XL,2)+' / '+f1(XC,2)+' Ω';$('#l9rp').textContent=(P.RL>0?f1(s2/P.RL,1):'∞')+' / '+f1(s2/XL,2)+' Ω';
   $('#l9z').textContent=PT(r.Z,1,1)+' Ω';$('#l9v').textContent=PT(r.V,2,1)+' V';$('#l9ilc').textContent=f1(cabs(r.IL),3)+' / '+f1(cabs(r.IC),3)+' A';
   const atRes=isFinite(fp)&&Math.abs(P.f*1000-fp)/fp<0.0015;const ch=$('#l9chip');
   if(atRes){ch.className='cb-chip ok';ch.textContent='رنين: I_C أكبر من تيار المصدر بـ '+f1(cabs(r.IC)/(P.I/1000),1)+' مرة'}else if(r.Z.im>0){ch.className='cb-chip hot';ch.textContent='تحت تردد الرنين: الخزان يتصرف كحمل حثي (X_C > X_p)'}else{ch.className='cb-chip ld';ch.textContent='فوق تردد الرنين: الخزان يتصرف كحمل سعوي (X_C < X_p)'}
   const brL=[{t:'R',l:'RL='+f1(P.RL,1)},{t:'L',l:'XL='+f1(XL,1)}];const br=[];if(P.rsOn)br.push({t:'R',l:'Rs='+f1(P.Rs,0)+' Ω',l2:PT(r.IRs,3,0)+' A'});
   br.push({parts:brL,c:'--live'},{t:'C',l:'XC='+f1(XC,1)+' Ω',l2:PT(r.IC,3,0)+' A',c:'--on'});
   $('#l9c').innerHTML=parFig({srcType:'I',src:f1(P.I,0)+' mA',br,first:100,sp:125,wr:120}).replace('</svg>',S.t(10,215,'V = '+PT(r.V,2,1)+' V','b','start')+S.t(250,215,'IL = '+PT(r.IL,3,0)+' A','','start')+'</svg>').replace(/viewBox="0 0 (\d+) 206"/,'viewBox="0 0 $1 222"');
   // response curve
   const f0=1/(2*PI*Math.sqrt(P.L*1e-3*P.C*1e-6))/1000,x0=0.4*f0,x1=1.8*f0;const pts=[];let zm=0;
   for(let i=0;i<=300;i++){const fk=x0+(x1-x0)*i/300,z=cabs(solve(fk).Z);zm=Math.max(zm,z);pts.push([fk,z])}
   const ym=niceMax(zm*1.08);const zc=cabs(r.Z);
   $('#l9plot').innerHTML=plotSVG({w:620,h:250,x0,x1,y0:0,y1:ym,xt:[0,0.25,0.5,0.75,1].map(k=>x0+(x1-x0)*k),xf:v=>f1(v,1),yt:[0,ym/4,ym/2,3*ym/4,ym],yf:v=>f1(v,0),xl:'f (kHz)',yl:'|ZT| (Ω)',series:[{pts,col:'--blue'}],
    extra:(X,Y)=>(isFinite(fp)&&fp/1000>x0&&fp/1000<x1?`<path d="M${fx(X(fp/1000))} 16V222" stroke="var(--stop)" stroke-dasharray="5 4"/>`+S.t(fx(X(fp/1000)+4),30,'fp','b','start'):'')+(P.f>=x0&&P.f<=x1?`<circle cx="${fx(X(P.f))}" cy="${fx(Y(zc))}" r="5" fill="var(--live)"/>`:''),aria:'منحنى المعاوقة مع التردد'});
   $('#l9ph').innerHTML=phasorSVG([{z:r.V,lab:'V',g:'V',col:'--fg'},{z:r.IL,lab:sb('I','L'),g:'I',col:'--live'},{z:r.IC,lab:sb('I','C'),g:'I',col:'--on'},{z:r.IRs,lab:'',g:'I',col:'--muted'},{z:Cx(P.I/1000),lab:'I',g:'I',col:'--stop',w:3}].filter(x=>cabs(x.z)>1e-9),{w:320,h:260,note:'V و I بمقياسين مختلفين'});
   steps.check()}
  const steps=stepsUI($('#l9st'),[
   {t:'أرقام المثال (1-2-11)',x:'اضغط «أرقام مثال 1-2-11» (L = 0.24 mH و C = 0.265 µF من نتيجة المثال).',done:()=>did.ex},
   {t:'ابحث عن الرنين',x:'حرّك التردد حتى تصل قمة المنحنى عند الخط المتقطع f<sub>p</sub> (قريب من 20 kHz)، أو اضغط «اضبط f على f<sub>p</sub>»: الجهد يصبح نحو 18 V بنفس طور تيار المصدر، و\\(Z_T\\) مادية نحو 225 Ω.',done:()=>R9.fp&&Math.abs(P.f*1000-R9.fp)/R9.fp<0.0015&&P.RL===2&&P.rsOn&&P.Rs===450},
   {t:'تضخيم التيار',x:'عند الرنين قارن: I<sub>L</sub> ≈ I<sub>C</sub> ≈ 0.6 A بينما تيار المصدر 0.08 A فقط. في الشكل المطاور سهما I<sub>L</sub> و I<sub>C</sub> متعاكسان تقريباً، وأشرطة الطاقة تتبادل بين الملف والمكثف.'},
   {t:'مقاومة المصدر لا تغيّر f<sub>p</sub>',x:'غيّر R<sub>s</sub> أو افصلها ثم اضغط «اضبط f على f<sub>p</sub>»: الخط المتقطع لا يتحرك (ص 49)، لكن ارتفاع القمة يتغير.',done:()=>(did.rs||P.Rs!==450)&&R9.fp&&Math.abs(P.f*1000-R9.fp)/R9.fp<0.0015},
   {t:'مقاومة الملف تغيّر f<sub>p</sub>',x:'ارفع R<sub>L</sub> إلى 8 Ω أو أكثر: ينزل f<sub>p</sub> قليلاً وتنخفض القمة وتتسع. أعد الضبط على الرنين.',done:()=>P.RL>=8&&R9.fp&&Math.abs(P.f*1000-R9.fp)/R9.fp<0.0015}
  ]);
  draw();
  loopOn(el,dt=>{ph+=dt*2*PI*0.5;const r=R9.r;if(!r)return;const L=P.L*1e-3,C=P.C*1e-6;const il=Math.SQRT2*cabs(r.IL)*Math.sin(ph+cang(r.IL)*D),vc=Math.SQRT2*cabs(r.V)*Math.sin(ph+cang(r.V)*D);
   const wl=0.5*L*il*il,wc=0.5*C*vc*vc,wm=Math.max(L*cabs(r.IL)**2,C*cabs(r.V)**2,1e-30);$('#l9wl').style.width=fx(100*wl/wm)+'%';$('#l9wc').style.width=fx(100*wc/wm)+'%'});
 },
 examples:[
  {title:'مثال (1-2-11)',ref:'ص 49–50',q:'<p>من الدائرة الموضحة في الشكل 1-41 أوجد: قيمة \\(X_C\\) عند حدوث الرنين، والمعاوقة الكلية \\(Z_T\\) عند الرنين، والتيارين \\(I_C\\) و\\(I_L\\) عند الرنين، وإذا كان تردد الرنين <span class="ltr">20000 Hz</span> أوجد قيمة L و C.</p>',given:G1211,solve:g=>tankSteps(g),
   note:'الحل يقرّب \\(X_C\\) إلى أقرب عدد صحيح (30.13 ≈ 30) ويكمل به، والجهد إلى منزلة عشرية واحدة (18.04 ≈ 18) كما في الحل المطبوع.'}
 ],
 quiz:[
  {q:'لماذا تسمى دائرة الرنين المتوازي «دائرة الخزان»؟',o:['لأنها تخزن الشحنة في البطارية','لاختزان الطاقة بواسطة الملف والمكثف','لأنها كبيرة الحجم','لأنها تحتاج مصدر جهد كبير'],c:1,e:'ص 48.'},
  {q:'يستحسن أن توصل دائرة الخزان بـ:',o:['مصدر جهد','مصدر تيار','بطارية','مقاومة فقط'],c:1,e:'ص 48: لأنها تستخدم مع عناصر إلكترونية تحتاج تياراً ثابتاً مثل الترانزستور.'},
  {q:'عند تحويل فرع R<sub>L</sub> + jX<sub>L</sub> إلى توازٍ فإن R<sub>p</sub> تساوي:',o:['\\(R_L + X_L\\)','\\(\\frac{R_L^2+X_L^2}{R_L}\\)','\\(\\frac{R_L^2+X_L^2}{X_L}\\)','\\(\\frac{R_L X_L}{R_L+X_L}\\)'],c:1,e:'ص 49.'},
  {q:'شرط الرنين في دائرة الخزان (المعادلة 1-41):',o:['X<sub>C</sub> = X<sub>L</sub> دائماً','X<sub>C</sub> = X<sub>p</sub>','R<sub>s</sub> = R<sub>p</sub>','R<sub>L</sub> = 0'],c:1,e:'\\(X_C = X_p = \\frac{R_L^2+X_L^2}{X_L}\\).'},
  {q:'أي مما يلي لا يؤثر على تردد الرنين f<sub>p</sub>؟',o:['L','C','R<sub>L</sub>','R<sub>s</sub> مقاومة المصدر'],c:3,e:'ص 49: مقاومة المصدر ليس لها تأثير على تردد الرنين.'},
  {q:'في المثال (1-2-11): R<sub>L</sub> = 2 Ω و X<sub>L</sub> = 30 Ω. قيمة R<sub>p</sub>:',o:['32 Ω','452 Ω','30 Ω','225.5 Ω'],c:1,e:'\\((4 + 900)/2 = 452\\ \\Omega\\).'},
  {q:'عند الرنين في المثال كان تيار المكثف 0.6 A وتيار المصدر 0.08 A. هذا يعني:',o:['خطأ في الحساب','الطاقة تتأرجح بين الملف والمكثف وتياراهما يلغي أحدهما الآخر تقريباً','المكثف يولد طاقة فعالة','المصدر يعطي 0.6 A'],c:1,e:'I<sub>L</sub> = 0.6∠−86° و I<sub>C</sub> = 0.6∠90° متعاكسان تقريباً.'}
 ]
});

/* ======================================================================
   Ladder schematic: source on the left, items placed left→right along the top wire
   items: {s:'ser',t,l,w}  {s:'sh',t|parts,l,i}  {s:'hp',up:[{t,l}],dn:[{t,l}],w,iu,id}  {s:'cur',lab}  {s:'node',lab}
   the last vertical item closes the circuit; o.v: {lab} voltage marks on the last vertical
   ====================================================================== */
function ladder(o){const top=o.top||64,bot=o.bot||210,x0=o.x0||110;let px=x0,s='',lastV=x0;const vx=[];
  const W=(a,b)=>wire([[a,top],[b,top]]);
  const vert=(x,it)=>{let r='';if(it.parts){const y0=top+34,h=(bot-y0)/it.parts.length;r+=wire([[x,top],[x,y0]]);it.parts.forEach((p,j)=>{r+=comp(p.t,x,y0+h*j,x,y0+h*(j+1),{l:p.l,side:1,c:it.c,b:Math.min(40,h-12)})})}else r+=comp(it.t,x,top,x,bot,{l:it.l,l2:it.l2,side:it.side||1,c:it.c,in:it.in,b:it.b});if(it.i)r+=cur(x,top+20,'d',it.i,{left:it.ileft});return r};
  (o.items||[]).forEach((it,k)=>{
   if(it.s==='ser'){const w=it.w||92,a=px+(it.gap==null?14:it.gap);s+=W(px,a)+comp(it.t,a,top,a+w,top,{l:it.l,l2:it.l2,c:it.c,in:it.in,b:it.b});px=a+w}
   else if(it.s==='cur'){s+=W(px,px+44)+cur(px+22,top,'r',it.lab);px+=44}
   else if(it.s==='node'){s+=dot(px,top)+(it.lab?S.t(px,top-10,it.lab,'','middle'):'');if(it.vm)s+=`<path d="M${px} ${top+8}V${bot-8}" stroke="var(--blue)" stroke-dasharray="4 4"/>`+S.t(px+6,top+22,'+','','start')+S.t(px+6,(top+bot)/2+4,it.vm,'b','start')+S.t(px+6,bot-10,'−','','start')+dot(px,bot)}
   else if(it.s==='hp'){const w=it.w||210,x1=px+16,x2=x1+w,yu=top-30,yd=top+30;s+=W(px,x1)+wire([[x1,yu],[x1,yd]])+wire([[x2,yu],[x2,yd]])+dot(x1,top)+dot(x2,top);
     const rail=(els,y,side)=>{const n=els.length,a=x1+18,b=x2-18,sg=(b-a)/n;let r=wire([[x1,y],[a,y]])+wire([[b,y],[x2,y]]);els.forEach((e,i)=>{r+=comp(e.t,a+sg*i,y,a+sg*(i+1),y,{l:e.l,side,c:e.c})});return r};
     s+=rail(it.up,yu,1)+rail(it.dn,yd,-1);px=x2}
   else{const x=px+(it.gap==null?40:it.gap);s+=W(px,x);vx.push(x);s+=vert(x,it);lastV=x;px=x}});
  vx.forEach((x,i)=>{if(i<vx.length-1)s+=dot(x,top)+dot(x,bot)});
  s+=wire([[x0,bot],[lastV,bot]]);
  s+=comp(o.srcType||'V',x0,bot,x0,top,{l:o.src,side:-1});
  if(o.it)s+=cur(x0+(o.itx||26),top,'r',o.it,{L:18});
  if(o.v){const x=lastV;s+=S.t(x-14,top+26,'+','','middle')+S.t(x-14,bot-12,'−','','middle')+S.t(x-16,(top+bot)/2+4,o.v,'b','end')}
  if(o.loops)o.loops.forEach(l=>{s+=loopArrow(l.x,l.y,l.r||22,l.lab,'--blue')});
  const Wd=lastV+(o.wr||110);return svgO(Wd,bot+(o.hb||16),o.aria||'دائرة')+s+'</svg>'}
const fig146=o=>ladder(Object.assign({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'R',l:'2 Ω',w:70},{s:'ser',t:'L',l:'3 Ω',w:70,gap:0},{s:'node',lab:'a'},{s:'sh',parts:[{t:'R',l:'9 Ω'},{t:'C',l:'7 Ω'}],i:sb('I','1'),gap:0},{s:'cur',lab:sb('I','2')},{s:'ser',t:'L',l:'5 Ω',w:70,gap:0},{s:'sh',t:'R',l:'6 Ω',gap:24}]},o||{}));

/* ======================================================================
   Lesson 10 — series-parallel circuits (ص 51–55)
   ====================================================================== */
function sp12(g){const X2=-g.XL*g.XC/(g.XL-g.XC);const Z2a=X2<0?-90:90,ZT=Cx(g.R,X2),zt=RD(cabs(ZT),2),za=RD(cang(ZT),1),It=RD(g.V/zt,2),ia=RD(-za,1);
  const dd=g.XL-g.XC,IL=RD(g.XC*It/Math.abs(dd),2),ila=RD(-90+ia-(dd>0?90:-90),1);
  return [
   {t:'أ) نعيد رسم الدائرة كما في الشكل 1-43، حيث',f:`Z_1 = R = ${f1(g.R)}\\ \\Omega`},
   {f:`Z_2 = \\frac{(jX_L)(-jX_C)}{(jX_L) + (-jX_C)} = \\frac{(${PZ(g.XL,90,2,0)})(${PZ(g.XC,-90,2,0)})}{j${f1(g.XL)} - j${f1(g.XC)}} = ${X2<0?'-':''}j${f1(Math.abs(X2),2)}\\ \\Omega = ${PZ(Math.abs(X2),Z2a,2,0)}\\ \\Omega`},
   {f:`Z_T = Z_1 + Z_2 = ${RZ(ZT,2)}\\ \\Omega = ${PZ(zt,za,2,1)}\\ \\Omega`,final:true},
   {t:X2<0?'نستنتج أن الحمل مادي - سعوي.':'نستنتج أن الحمل مادي - حثي.'},
   {t:'ب) التيار الكلي:',f:`I_T = \\frac{V}{Z_T} = \\frac{${PZ(g.V,0,2,0)}}{${PZ(zt,za,2,1)}} = ${PZ(It,ia,2,1)}\\ \\text{A}`,final:true},
   {t:'ج) لحساب التيار في الملف نستعمل قانون توزيع التيار:',f:`I_L = \\frac{(-jX_C)\\,I_T}{(-jX_C) + (jX_L)} = \\frac{(${PZ(g.XC,-90,2,0)})(${PZ(It,ia,2,1)})}{${PZ(Math.abs(dd),dd>0?90:-90,2,0)}} = ${PZ(IL,ila,2,1)}\\ \\text{A}`,final:true},
   {t:'د) الجهد بين طرفي المقاومة:',f:`V_R = R\\,I_T = ${f1(g.R)}\\times ${PZ(It,ia,2,1)} = ${PZ(RD(g.R*It,2),ia,2,1)}\\ \\text{V}`,final:true},
   {t:'هـ) الجهد بين طرفي المكثف (وهو جهد مجموعة التوازي):',f:`V_C = Z_2\\,I_T = ${PZ(Math.abs(X2),Z2a,2,0)}\\times ${PZ(It,ia,2,1)} = ${PZ(RD(Math.abs(X2)*It,2),Z2a+ia,2,1)}\\ \\text{V}`,final:true}]}
const G1212=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:100},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:2},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:4,min:0.01},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:6,min:0.01}];
function sp13(g){const z3l=Cx(g.R3,g.XL),m3=RD(cabs(z3l),2),a3=RD(cang(z3l),1),nm=RD(g.R2*m3,2),den=Cx(g.R2+g.R3,g.XL),dm=RD(cabs(den),2),da=RD(cang(den),1);
  const z2m=RD(nm/dm,2),z2a=RD(a3-da,1),Z2=Cx(RD(z2m*Math.cos(z2a*D),2),RD(z2m*Math.sin(z2a*D),2));const sum=Cx(RD(g.R1+Z2.re,2),RD(Z2.im-g.XC,2)),sm=RD(cabs(sum),2),sa=RD(cang(sum),1);
  const vn=RD(g.XC*g.V,2),vc=RD(vn/sm,2),vca=RD(-90-sa,1),it=RD(vc/g.XC,2),ita=RD(vca+90,1);
  return [
   {t:'أ) نعيد رسم الدائرة كما في الشكل 1-45، حيث',f:`Z_1 = R_1 = ${f1(g.R1)}\\ \\Omega`},
   {f:`Z_2 = \\frac{R_2(R_3 + jX_L)}{R_2 + (R_3 + jX_L)} = \\frac{${f1(g.R2)}(${f1(g.R3)} + j${f1(g.XL)})}{${f1(g.R2)} + (${f1(g.R3)} + j${f1(g.XL)})} = \\frac{${PZ(nm,a3,2,1)}}{${PZ(dm,da,2,1)}} = ${PZ(z2m,z2a,2,1)}\\ \\Omega = ${RZ(Z2,2)}\\ \\Omega`},
   {f:`Z_3 = -jX_C = -j${f1(g.XC)}\\ \\Omega`},
   {t:'وباستعمال قانون توزيع الجهد نحسب الجهد',f:`V_C = \\frac{Z_3\\,V}{Z_1 + Z_2 + Z_3} = \\frac{(${PZ(g.XC,-90,2,0)})(${PZ(g.V,0,2,0)})}{(${f1(g.R1)}) + (${RZ(Z2,2)}) + (-j${f1(g.XC)})} = \\frac{${PZ(vn,-90,2,0)}}{${PZ(sm,sa,2,1)}}`},
   {f:`V_C = ${PZ(vc,vca,2,1)}\\ \\text{V}`,final:true},
   {t:'ب) التيار الكلي هو تيار المكثف نفسه (المكثف على التوالي مع المصدر):',f:`I_T = \\frac{V_C}{-jX_C} = \\frac{${PZ(vc,vca,2,1)}}{${PZ(g.XC,-90,2,0)}} = ${PZ(it,ita,2,1)}\\ \\text{A}`,final:true}]}
const G1213=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:8},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:8,min:0.01},{id:'R3',label:'المقاومة الثالثة',sym:'R_3',unit:'Ω',value:6},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:5},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:5,min:0.01}];
function sp14(g,book){const Z1=Cx(g.R1,g.X1),Z2=Cx(g.R2,-g.XC),Z3=Cx(g.R3,g.XL);
  const p=z=>[RD(cabs(z),2),RD(cang(z),1)];const [m1,a1]=p(Z1),[m2,a2]=p(Z2),[m3,a3]=p(Z3);
  const nm=RD(m2*m3,2),na=RD(a2+a3,1),S23=cadd(Z2,Z3),[sm,sa]=p(S23),tm=RD(nm/sm,2),ta=RD(na-sa,1);
  const T1=Cx(RD(tm*Math.cos(ta*D),2),RD(tm*Math.sin(ta*D),2)),ZT=Cx(RD(g.R1+T1.re,2),RD(g.X1+T1.im,2)),[zm,za]=p(ZT);
  const It=RD(g.V/zm,2),ia=RD(-za,1);const m3b=RD(m3,1),i1n=RD(m3b*It,3),i1na=RD(a3+ia,1),I1=RD(i1n/sm,2),i1a=RD(i1na-sa,1);
  const itR=Cx(RD(It*Math.cos(ia*D),2),RD(It*Math.sin(ia*D),2)),i1R=Cx(RD(I1*Math.cos(i1a*D),2),RD(I1*Math.sin(i1a*D),2)),I2=csub(itR,i1R);
  const ex2=cdiv(cmul(Z2,cpol(It,ia)),S23);
  return [
   {t:'نعيد رسم الدائرة كما في الشكلين 1-47، حيث:',f:`Z_1 = ${RZ(Z1,2)} = ${PZ(m1,a1,2,1)}\\ \\Omega\\quad Z_2 = ${RZ(Z2,2)} = ${PZ(m2,a2,2,1)}\\ \\Omega\\quad Z_3 = ${RZ(Z3,2)} = ${PZ(m3,a3,2,1)}\\ \\Omega`},
   {f:`Z_{T1} = \\frac{Z_2 Z_3}{Z_2 + Z_3} = \\frac{(${PZ(m2,a2,2,1)})(${PZ(m3,a3,2,1)})}{(${RZ(Z2,2)}) + (${RZ(Z3,2)})} = \\frac{${PZ(nm,na,2,1)}}{${PZ(sm,sa,2,1)}} = ${PZ(tm,ta,2,1)} = ${RZ(T1,2)}\\ \\Omega`},
   {t:'أ) المعاوقة المكافئة:',f:`Z_T = Z_1 + Z_{T1} = ${RZ(Z1,2)} + ${RZ(T1,2)} = ${RZ(ZT,2)}\\ \\Omega = ${PZ(zm,za,2,1)}\\ \\Omega`,final:true},
   book?{t:'ب) التيار الكلي — هكذا طُبع في الكتاب:',f:`I_T = \\frac{V}{Z_T} = \\frac{100\\angle 0^\\circ}{8.7\\angle 27^\\circ} = 14.3\\angle -27^\\circ\\ \\text{A}`,final:true}:{t:'ب) التيار الكلي:',f:`I_T = \\frac{V}{Z_T} = \\frac{${PZ(g.V,0,2,0)}}{${PZ(zm,za,2,1)}} = ${PZ(It,ia,2,1)}\\ \\text{A}`,final:true},
   book?{t:`<b>ملاحظة على الكتاب:</b> المقام 8.75 لا 8.7، و\\(100 \\div 8.75 = ${f1(It,2)}\\) لا 14.3. والكتاب نفسه يستعمل \\(I_T = ${PZ(It,ia,2,1)}\\) A في الخطوة التالية، فنكمل بها.`}:null,
   {t:'ج) نستعمل قانون توزيع التيار لحساب التيار \\(I_1\\):',f:`I_1 = \\frac{Z_3\\,I_T}{Z_2 + Z_3} = \\frac{(${PZ(m3b,a3,1,1)})(${PZ(It,ia,2,1)})}{(${RZ(Z2,2)}) + (${RZ(Z3,2)})} = \\frac{${PZ(i1n,i1na,3,1)}}{${PZ(sm,sa,2,1)}} = ${PZ(I1,i1a,1,1)}\\ \\text{A}`,final:true},
   book?{t:'د) نستعمل قانون كيرشوف للتيار لحساب التيار \\(I_2\\) — هكذا طُبع في الكتاب:',f:`I_2 = I_T - I_1 = (10.69 - j5.71) - (5.52 + j2.05) = 9.25\\angle -56^\\circ\\ \\text{A}`,final:true}:
     {t:'د) نستعمل قانون كيرشوف للتيار لحساب التيار \\(I_2\\):',f:`I_2 = I_T - I_1 = (${RZ(itR,2)}) - (${RZ(i1R,2)}) = ${RZ(I2,2)} = ${PZc(I2,2,1)}\\ \\text{A}`,final:true},
   book?{t:`<b>ملاحظة على الكتاب:</b> \\(11.43\\angle -27^\\circ\\) بالصورة المتعامدة هي \\(${RZ(itR,2)}\\) وليست \\(10.69 - j5.71\\)، كما أن \\((10.69 - 5.52) - j(5.71 + 2.05) = 5.17 - j7.76 = 9.32\\angle -56.3^\\circ\\) لا 9.25. الصحيح: \\(I_2 = ${PZc(I2,2,1)}\\) A. قارن بالحل المصحح أدناه.`}:
     {t:'<b>تحقق (ليس من الكتاب):</b> بقانون توزيع التيار مباشرة',f:`I_2 = \\frac{Z_2\\,I_T}{Z_2 + Z_3} = ${PZc(ex2,2,1)}\\ \\text{A}`}
  ].filter(Boolean)}
const G1214=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:100},{id:'R1',label:'مقاومة الخط',sym:'R_1',unit:'Ω',value:2},{id:'X1',label:'ممانعة ملف الخط',sym:'X_{L1}',unit:'Ω',value:3},{id:'R2',label:'مقاومة الفرع المادي-السعوي',sym:'R_2',unit:'Ω',value:9},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:7},{id:'XL',label:'ممانعة ملف الفرع الأيمن',sym:'X_{L2}',unit:'Ω',value:5},{id:'R3',label:'مقاومة الفرع الأيمن',sym:'R_3',unit:'Ω',value:6}];

B.lesson({
 id:'u1-l10',unit:1,order:10,pages:'51–55',
 title:'دوائر التوالي - التوازي',
 summary:'دوائر فيها فروع على التوالي وأخرى على التوازي. نختصرها خطوة خطوة: نحسب معاوقة كل مجموعة توازي، ثم نجمعها مع ما على التوالي، ثم نرجع لحساب التيارات والجهود بقانوني توزيع التيار والجهد. مع الأمثلة (1-2-12) و(1-2-13) و(1-2-14).',
 stations:[
  {intro:true},

  {st:1,short:'التوالي - التوازي',title:'التوصيل على التوالي - التوازي',ref:'ص 51',
   q:'دائرة فيها عناصر على التوالي وأخرى على التوازي: من أين نبدأ تبسيطها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة توالي-توازي: معاوقة Z1 على التوالي مع مجموعة توازي من Z2 و Z3 داخل إطار متقطع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M45 95 L45 147.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 183.0 L45 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="45" cy="165.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 165.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="45" y="261" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V</text><path d="M45 95 L85 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M85 95 L103.0 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M147.0 95 L165 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="103.0" y="84" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M165 95 L300 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 235 L300 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦Z1⟧ على التوالي: يمر فيه التيار الكلي كله."><text x="125" y="77" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="100" y="59" width="50" height="50" rx="6" fill="transparent"/></g><g data-tip="⟦Z2⟧ و⟦Z3⟧ على التوازي: لهما الجهد نفسه، ونختصرهما أولاً إلى معاوقة واحدة ⟦Z2Z3/(Z2+Z3)⟧."><path d="M210 95 L210 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 187.0 L210 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="199" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M295 95 L295 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 187.0 L295 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="284" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="210" cy="95" r="4.5" fill="#2C4A40"/><circle cx="210" cy="235" r="4.5" fill="#2C4A40"/><text x="228" y="170" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><text x="313" y="170" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="185" y="109" width="150" height="112" rx="12" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="6 5"/><rect x="185" y="95" width="150" height="140" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر."><line x1="58.0" y1="81.0" x2="86.0" y2="81.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="94.0,81.0 86.0,85.8 86.0,76.2" fill="#12855A"/><text x="76" y="73" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="54" y="57" width="46" height="32" rx="6" fill="transparent"/></g><text x="180" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">اختصر مجموعة التوازي أولاً</text><text x="180" y="284" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan> = Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan> + Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan>Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan>/(Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan> + Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan>)</text></svg>`,
   cap:'دائرة توالي - توازي عامة: معاوقة على التوالي مع مجموعة توازي.<br><b>مرّر المؤشر على المعاوقات والإطار المتقطع وسهم التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة المرسومة، ما أول خطوة لحساب المعاوقة المكافئة؟',opts:[
     [String.raw`نجمع \(Z_1+Z_2+Z_3\)`,false,String.raw`\(Z_2\) و\(Z_3\) ليستا على التوالي مع \(Z_1\)؛ هما على التوازي فيما بينهما.`],
     [String.raw`نختصر \(Z_2\) و\(Z_3\) (التوازي) إلى معاوقة واحدة، ثم نجمعها مع \(Z_1\)`,true,String.raw`بعد الاختصار تصبح الدائرة توالياً بسيطاً: \(Z_T=Z_1+\frac{Z_2Z_3}{Z_2+Z_3}\).`],
     [String.raw`نحسب التيار في \(Z_3\) أولاً`,false,'تيارات الفروع تأتي في الآخر، بعد معرفة التيار الكلي.']]}}
   ],
   body:[
    {book:String.raw`<p>كثير من الدوائر الكهربائية لا تحتوي على عناصر مربوطة على التوالي فقط أو على التوازي فقط، وإنما تتكون من فروع بعضها على التوالي وبعضها على التوازي. وتبين الأمثلة التالية الخطوات المستعملة لتحليل مثل هذه الدوائر.</p>`,ref:'ص 51'},
    {tip:String.raw`<ol style="margin:0"><li>سمِّ كل مجموعة عناصر على التوالي معاوقة واحدة (\(Z_1\)، \(Z_2\) …) وأعد رسم الدائرة.</li><li>احسب معاوقة كل مجموعة توازي: \(\frac{Z_aZ_b}{Z_a+Z_b}\).</li><li>اجمع المعاوقات التي على التوالي فتحصل على \(Z_T\)، ثم \(I_T=V/Z_T\).</li><li>ارجع إلى الدائرة الأصلية: قانون توزيع التيار للفروع، وقانون أوم أو قانون توزيع الجهد للجهود.</li></ol>`,title:'الطريقة التي تتكرر في الأمثلة الثلاثة'},
    {watch:String.raw`<p>كل الجمع والقسمة هنا بالأعداد المركبة: الجمع والطرح بالصورة المتعامدة، والضرب والقسمة بالصورة القطبية. لا تجمع مقادير المعاوقات وحدها.</p>`},
    {add:String.raw`<p>أغلب الدوائر الحقيقية من هذا النوع: سلك التغذية الطويل (مقاومة وحثية على التوالي) يغذي عدة أحمال موصلة على التوازي في نهايته.</p>`,title:'في الواقع'},
    {title:'مختبر مصغّر: رتّب خطوات التحليل',widget:(el,B)=>DCML.order(el,B,{intro:'هذه خطوات تحليل دائرة توالي - توازي كما تسير في أمثلة هذا الدرس. اضغطها بالترتيب.',steps:[
     ['أعد رسم الدائرة وسمِّ كل مجموعة معاوقة واحدة (\\(Z_1\\)، \\(Z_2\\)، …)','نبدأ بإعادة الرسم كما يفعل الكتاب في كل مثال.'],
     ['اختصر كل مجموعة توازي: \\(\\frac{Z_aZ_b}{Z_a+Z_b}\\)','لا نستطيع الجمع قبل أن تصير الدائرة توالياً بسيطاً.'],
     ['اجمع المعاوقات التي على التوالي فتحصل على \\(Z_T\\)','تحتاج المجموعات المختصرة أولاً.'],
     ['احسب التيار الكلي \\(I_T=V/Z_T\\)','تحتاج \\(Z_T\\) أولاً.'],
     ['ارجع إلى الفروع: توزيع التيار، أو كيرشوف، أو قانون أوم للجهود','تيارات الفروع تأتي بعد معرفة التيار الكلي.']],done:'هذا هو المسار في الأمثلة <span class="ltr">(1-2-12)</span> و<span class="ltr">(1-2-14)</span>.'})}
   ]},

  {st:2,short:'مثال <span class="ltr">(1-2-12)</span>',title:'مثال <span class="ltr">(1-2-12)</span>: مقاومة على التوالي مع ملف ومكثف على التوازي',ref:'ص 51–52',
   q:'ملف <span class="ltr">6 Ω</span> ومكثف <span class="ltr">4 Ω</span> على التوازي: هل تكون معاوقتهما معاً أصغر من كل منهما كما في المقاومات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-42: مقاومة 2 أوم على التوالي مع مكثف 4 أوم وملف 6 أوم على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M45 95 L45 147.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 183.0 L45 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦100∠0° V⟧."><circle cx="45" cy="165.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 165.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="45" y="261" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">100∠0° V</text><rect x="21" y="141.0" width="48" height="48" rx="6" fill="transparent"/></g><path d="M45 95 L85 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M85 95 L103.0 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M147.0 95 L165 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M103.0 95 L110.33333333333333 102 L117.66666666666667 88 L125.0 102 L132.33333333333334 88 L139.66666666666666 102 L147.0 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M165 95 L300 95" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 235 L300 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مقاومة ⟦R = 2 Ω⟧ على التوالي: ⟦Z1 = 2 Ω⟧."><text x="125" y="77" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2 Ω</text><rect x="100" y="59" width="50" height="50" rx="6" fill="transparent"/></g><g data-tip="مجموعة التوازي: مكثف ⟦4 Ω⟧ وملف ⟦6 Ω⟧، ومعاوقتهما معاً ⟦Z2 = −j12 Ω⟧."><path d="M210 95 L210 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 187.0 L210 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 143.0 L210 160.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210 170.0 L210 187.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="198" y1="160.0" x2="222" y2="160.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="198" y1="170.0" x2="222" y2="170.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><path d="M295 95 L295 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 187.0 L295 235" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M295 143.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="210" cy="95" r="4.5" fill="#2C4A40"/><circle cx="210" cy="235" r="4.5" fill="#2C4A40"/><text x="228" y="170" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">4 Ω</text><text x="313" y="170" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">6 Ω</text><line x1="275.0" y1="140.0" x2="275.0" y2="163.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="275.0,170.0 270.8,163.0 279.2,163.0" fill="#12855A"/><text x="271" y="190" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="185" y="95" width="150" height="140" rx="6" fill="transparent"/></g><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر."><line x1="58.0" y1="81.0" x2="86.0" y2="81.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="94.0,81.0 86.0,85.8 86.0,76.2" fill="#12855A"/><text x="76" y="73" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="54" y="57" width="46" height="32" rx="6" fill="transparent"/></g><text x="228" y="152" text-anchor="start" font-size="11" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><text x="313" y="152" text-anchor="start" font-size="11" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(1-42)</span>: مقاومة <span class="ltr">2 Ω</span> على التوالي مع مكثف <span class="ltr">4 Ω</span> وملف <span class="ltr">6 Ω</span> على التوازي.<br><b>مرّر المؤشر على المصدر والمقاومة ومجموعة التوازي وسهم التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`ما معاوقة الملف \(j6\) والمكثف \(-j4\) على التوازي؟`,opts:[
     [String.raw`\(-j12\ \Omega\)`,true,String.raw`\(\frac{(j6)(-j4)}{j6-j4}=\frac{24}{j2}=-j12\ \Omega\): أكبر من الاثنين، وسعوية.`],
     [String.raw`\(j2.4\ \Omega\)`,false,String.raw`هذا لو عاملناهما كمقاومتين \(\frac{6\times4}{6+4}\)؛ لكن المقام \(j6-j4=j2\) صغير.`],
     [String.raw`\(j2\ \Omega\)`,false,'هذا المقام فقط، لا المعاوقة.']]}}
   ],
   body:[
    {book:String.raw`<p>في الدائرة الموضحة في الشكل <span class="ltr">1-42</span>، احسب ما يلي: أ- المعاوقة المكافئة \(Z_T\)؛ ب- التيار الكلي \(I_T\)؛ ج- التيار في الملف \(I_L\)؛ د- الجهد بين طرفي المقاومة \(V_R\)؛ هـ- الجهد بين طرفي المكثف \(V_C\).</p>
     <p><b>الحل:</b> أ- لتسهيل حساب المعاوقة المكافئة أعد رسم الدائرة كما في الشكل <span class="ltr">1-43</span>، حيث</p>
     $$Z_1=R=2\ \Omega\qquad Z_2=\frac{(jX_L)(-jX_C)}{(jX_L)+(-jX_C)}=\frac{(6\angle 90^\circ)(4\angle -90^\circ)}{j6-j4}=-j12\ \Omega=12\angle -90^\circ\ \Omega$$
     $$Z_T=Z_1+Z_2=2-j12\ \Omega=12.17\angle -80.5^\circ\ \Omega$$<p>نستنتج أن الحمل مادي - سعوي.</p>
     $$\text{ب- }\ I_T=\frac{V}{Z_T}=\frac{100\angle 0^\circ}{12.17\angle -80.5^\circ}=8.22\angle 80.5^\circ\ \text{A}$$
     <p>ج- لحساب التيار في الملف نستعمل قانون توزيع التيار:</p>
     $$I_L=\frac{(-jX_C)\,I_T}{(-jX_C)+(jX_L)}=\frac{(4\angle -90^\circ)(8.22\angle 80.5^\circ)}{2\angle 90^\circ}=16.44\angle -99.5^\circ\ \text{A}$$
     $$\text{د- }\ V_R=R\,I_T=2\times 8.22\angle 80.5^\circ=16.44\angle 80.5^\circ\ \text{V}\qquad \text{هـ- }\ V_C=Z_2 I_T=12\angle -90^\circ\times 8.22\angle 80.5^\circ=98.64\angle -9.5^\circ\ \text{V}$$`,ref:'ص 51–52'},
    {html:`<figure style="margin:0;text-align:center;font-size:13px;color:var(--muted)">${box(ladder({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:44},{s:'sh',t:'Z',l:sb('Z','2'),gap:60}]}),360)}الشكل <span class="ltr">(1-43)</span>: الدائرة بعد إعادة الرسم</figure>`},
    {tip:String.raw`<p>تيار الملف (<span class="ltr">16.44 A</span>) ضعف التيار الكلي تقريباً: مجموعة التوازي (ملف مع مكثف) قريبة من رنين التوازي، فمعاوقتها كبيرة (<span class="ltr">12 Ω</span>) ويدور تيار كبير بين الملف والمكثف.</p>
     <p>و\(V_C\) هو جهد مجموعة التوازي كلها (المكثف والملف معاً)، لأنهما على التوازي فلهما الجهد نفسه.</p>`,title:'لاحظ'},
    {watch:String.raw`<p>المقام في قانون توزيع التيار هنا \((-j4)+(j6)=j2\) أي \(2\angle 90^\circ\)، لا <span class="ltr">10</span>. الخطأ في جمع \(j\) و\(-j\) أكثر الأخطاء شيوعاً في هذه المسائل.</p>`},
    {title:'مختبر مصغّر: ملف ومكثف على التوازي',widget:(el,B)=>DCML.lab(el,B,{intro:'\\(X_L=6\\ \\Omega\\) و \\(R=2\\ \\Omega\\) والمصدر \\(100\\angle0^\\circ\\ \\text{V}\\) من المثال. قيمة \\(X_C\\) في الكتاب <span class="ltr">4 Ω</span>، والقيم الأخرى <b>أرقام تختارها أنت</b>.',
 predict:{q:'لو كانت \\(X_C=3\\ \\Omega\\) بدلاً من <span class="ltr">4 Ω</span>، كم تصير معاوقة مجموعة التوازي \\(Z_2\\)؟',opts:[
  ['\\(-j12\\ \\Omega\\) كما هي',false,'المقام \\(j(6-X_C)\\) يتغير مع \\(X_C\\).'],
  ['\\(-j6\\ \\Omega\\)',true,'\\(\\frac{(j6)(-j3)}{j6-j3}=\\frac{18}{j3}=-j6\\ \\Omega\\).'],
  ['\\(j2\\ \\Omega\\)',false,'المكثف ما زال أصغر ممانعة، فالمجموعة سعوية (إشارة سالبة).']]},
 ins:[{k:'c',l:'X<sub>C</sub>',seg:[[2,'<span class="ltr">2 Ω</span>'],[3,'<span class="ltr">3 Ω</span>'],[4,'4 Ω (الكتاب)'],[5,'<span class="ltr">5 Ω</span>'],[6,'<span class="ltr">6 Ω</span>'],[8,'<span class="ltr">8 Ω</span>']],v:4}],
 calc:(s,P,B)=>{if(s.c===6)return {facts:[['Z<sub>2</sub>','∞','bad'],['I<sub>T</sub>','0 A']],msg:'\\(X_C=X_L\\): المقام \\(j6-j6=0\\)، فمعاوقة المجموعة لانهائية ولا يدخلها تيار من المصدر (هذه فكرة رنين التوازي التي درستها).',cls:'warn'};
  const x2=-6*s.c/(6-s.c),Zt=Cx(2,x2),It=cdiv(Cx(100,0),Zt);
  return {facts:[['<span class="ltr">Z<sub>2</sub> = 6X<sub>C</sub> ÷ j(6 − X<sub>C</sub>)</span>',(x2<0?'−j':'j')+DCML.fm(B,Math.abs(x2),2)+' Ω','hi'],['<span class="ltr">Z<sub>T</sub> = 2 + Z<sub>2</sub> (Ω)</span>',PT(Zt,2,1)],['I<sub>T</sub> (A)',PT(It,2,1)]],
   msg:(s.c===4?'أرقام الكتاب: \\(Z_2=-j12\\) و \\(Z_T=12.17\\angle{-}80.5^\\circ\\ \\Omega\\). ':'')+(Math.abs(x2)>6?'معاوقة المجموعة أكبر من الملف والمكثف كليهما.':Math.abs(x2)>s.c&&x2<0?'معاوقة المجموعة أكبر من ممانعة المكثف.':'')+(x2<0?' المجموعة سعوية لأن \\(X_C<X_L\\).':' المجموعة حثية لأن \\(X_C>X_L\\).')}}})}
   ]},

  {st:3,short:'مثال <span class="ltr">(1-2-13)</span>',title:'مثال <span class="ltr">(1-2-13)</span>: قانون توزيع الجهد في دائرة توالي - توازي',ref:'ص 52–53',
   q:'بعد اختصار مجموعة التوازي، تصبح الدائرة ثلاث معاوقات على التوالي… فكيف نحسب جهد واحدة منها مباشرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-44: مقاومة 8 أوم، ثم مجموعة توازي، ثم مكثف 5 أوم على الضلع الأيمن وعليه الجهد VC" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M38 110 L38 164.5" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 200.5 L38 255" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦50∠0° V⟧."><circle cx="38" cy="182.5" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M28 182.5 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="38" y="281" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">50∠0° V</text><rect x="14" y="158.5" width="48" height="48" rx="6" fill="transparent"/></g><path d="M38 110 L68 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M68 110 L71 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M115 110 L118 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M71.0 110 L78.33333333333333 117 L85.66666666666667 103 L93.0 117 L100.33333333333333 103 L107.66666666666666 117 L115.0 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="93" y="140" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">8 Ω</text><path d="M118 110 L140 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="140" cy="110" r="4.5" fill="#2C4A40"/><g data-tip="مجموعة التوازي ⟦Z2⟧: ⟦R2 = 8 Ω⟧ في الفرع العلوي، وملف ⟦5 Ω⟧ مع ⟦R3 = 6 Ω⟧ في الفرع السفلي."><path d="M140 110 L140 70 L180 70" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M180 70 L188 70" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M232 70 L240 70" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M188.0 70 L195.33333333333334 77 L202.66666666666666 63 L210.0 77 L217.33333333333334 63 L224.66666666666666 77 L232.0 70" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M240 70 L275 70 L275 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="210" y="52" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">8 Ω</text><path d="M140 110 L140 140 L158 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M158 140 L158 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M202 140 L202 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M158 140 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M202 140 L210 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M254 140 L262 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M210.0 140 L217.33333333333334 147 L224.66666666666666 133 L232.0 147 L239.33333333333334 133 L246.66666666666666 147 L254.0 140" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M262 140 L275 140 L275 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="180" y="166" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><text x="232" y="166" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">6 Ω</text><rect x="135" y="40" width="145" height="130" rx="6" fill="transparent"/></g><circle cx="275" cy="110" r="4.5" fill="#2C4A40"/><path d="M275 110 L320 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المكثف ⟦XC = 5 Ω⟧ على الضلع الأيمن، والجهد ⟦VC⟧ بين طرفيه هو المطلوب."><path d="M320 110 L320 178" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M320 222 L320 255" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M320 178 L320 195" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M320 205 L320 222" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="308" y1="195" x2="332" y2="195" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="308" y1="205" x2="332" y2="205" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="338" y="205" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><text x="304" y="170" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">+</text><text x="304" y="240" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">−</text><text x="296" y="205" text-anchor="end" font-size="12" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="285" y="160" width="75" height="90" rx="6" fill="transparent"/></g><path d="M38 255 L320 255" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر."><line x1="46.0" y1="96.0" x2="74.0" y2="96.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="82.0,96.0 74.0,100.8 74.0,91.2" fill="#12855A"/><text x="64" y="88" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="42" y="72" width="46" height="32" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-44)</span>: مقاومة، ثم مجموعة توازي، ثم مكثف على الضلع الأيمن.<br><b>مرّر المؤشر على المصدر ومجموعة التوازي والمكثف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`بعد إعادة الرسم صارت \(Z_1\) و\(Z_2\) و\(Z_3\) على التوالي. ما القانون الأسرع لحساب \(V_C\) (جهد \(Z_3\))؟`,opts:[
     ['قانون توزيع التيار',false,'توزيع التيار للفروع المتوازية؛ هنا المعاوقات الثلاث على التوالي.'],
     ['قانون توزيع الجهد',true,String.raw`\(V_C=\frac{Z_3\,V}{Z_1+Z_2+Z_3}\)، وهكذا طلب الكتاب.`],
     ['قانون كيرشوف للتيار وحده',false,'كيرشوف للتيار وحده لا يعطي جهداً.']]}}
   ],
   body:[
    {book:String.raw`<p>في الدائرة الموضحة في الشكل <span class="ltr">1-44</span>، احسب ما يلي: أ- الجهد بين طرفي المكثف \(V_C\) باستعمال قانون توزيع الجهد. ب- التيار الكلي \(I_T\).</p>
     <p><b>الحل:</b> أ- لتسهيل حساب الجهد \(V_C\) أعد رسم الدائرة كما في الشكل <span class="ltr">1-45</span>، حيث</p>
     $$Z_1=R_1=8\ \Omega\qquad Z_2=\frac{R_2(R_3+jX_L)}{R_2+(R_3+jX_L)}=\frac{8(6+j5)}{8+(6+j5)}=\frac{62.48\angle 39.8^\circ}{14.87\angle 19.7^\circ}=4.2\angle 20.1^\circ=3.94+j1.44\ \Omega$$
     $$Z_3=-jX_C=-j5\ \Omega$$<p>وباستعمال قانون توزيع الجهد نحسب الجهد</p>
     $$V_C=\frac{Z_3\,V}{Z_1+Z_2+Z_3}=\frac{(5\angle -90^\circ)(50\angle 0^\circ)}{(8)+(3.94+j1.44)+(-j5)}=\frac{250\angle -90^\circ}{12.46\angle -16.6^\circ}=20.06\angle -73.4^\circ\ \text{V}$$
     $$\text{ب- }\ I_T=\frac{V_C}{-jX_C}=\frac{20.06\angle -73.4^\circ}{5\angle -90^\circ}=4.01\angle 16.6^\circ\ \text{A}$$`,ref:'ص 52–53'},
    {html:`<figure style="margin:0;text-align:center;font-size:13px;color:var(--muted)">${box(ladder({src:'50∠0° V',it:sb('I','T'),v:sb('V','C'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:40},{s:'ser',t:'Z',l:sb('Z','2'),gap:20},{s:'sh',t:'Z',l:sb('Z','3'),gap:50}]}),450)}الشكل <span class="ltr">(1-45)</span>: الدائرة بعد إعادة الرسم</figure>`},
    {tip:String.raw`<p>لماذا \(I_T=\frac{V_C}{-jX_C}\)؟ لأن المكثف \(Z_3\) على التوالي مع بقية الدائرة، فيمر فيه التيار الكلي كله. فإذا عرفنا جهده عرفنا التيار الكلي بقانون أوم.</p>
     <p>وتحقق: \(Z_T=12.46\angle -16.6^\circ\) و\(\frac{50}{12.46}=4.01\ \text{A}\)، والزاوية \(0-(-16.6^\circ)=16.6^\circ\). النتيجة نفسها.</p>`,title:'خطوة (ب)'},
    {watch:String.raw`<p>في \(Z_2\) تُجمع \(R_3\) مع الملف أولاً (فرع واحد على التوالي: \(6+j5\))، ثم يُحسب التوازي مع \(R_2\). لا تجعل الملف وحده على التوازي مع \(R_2\).</p>`},
    {title:'مختبر مصغّر: أي المعاوقات الثلاث تأخذ أكبر جهد؟',widget:(el,B)=>DCML.lab(el,B,{intro:'من حل المثال: \\(Z_1=8\\)، \\(Z_2=3.94+j1.44\\)، \\(Z_3=-j5\\ \\Omega\\)، والمجموع \\(12.46\\angle{-}16.6^\\circ\\ \\Omega\\)، والمصدر \\(50\\angle0^\\circ\\ \\text{V}\\). اختر \\(Z_X\\) في قانون توزيع الجهد.',
 predict:{q:'أي المعاوقات الثلاث يكون جهدها أكبر؟',opts:[
  ['\\(Z_3\\) (المكثف)، لأن جهده هو المطلوب في المثال',false,'المطلوب في المثال لا يعني أنه الأكبر؛ الجهد يتناسب مع مقدار المعاوقة.'],
  ['\\(Z_1\\)',true,'مقدارها <span class="ltr">8 Ω</span> هو الأكبر بين الثلاث، فتأخذ أكبر جزء من الجهد.'],
  ['تتساوى الجهود الثلاثة',false,'المعاوقات مختلفة المقادير، فجهودها مختلفة.']]},
 ins:[{k:'x',l:'Z<sub>X</sub>',seg:[[1,'<span class="ltr">Z<sub>1</sub> = 8</span>'],[2,'<span class="ltr">Z<sub>2</sub> = 3.94 + j1.44</span>'],[3,'<span class="ltr">Z<sub>3</sub> = −j5</span> (المكثف)']],v:3}],
 calc:(s,P,B)=>{const Z=[null,Cx(8,0),Cx(3.94,1.44),Cx(0,-5)],T=cpol(12.46,-16.6),V=cdiv(cmul(Z[s.x],Cx(50,0)),T);
  const all=[1,2,3].map(k=>cabs(cdiv(cmul(Z[k],Cx(50,0)),T)));
  return {facts:[['Z<sub>X</sub> (Ω)',PT(Z[s.x],2,1)],['<span class="ltr">V<sub>X</sub> = Z<sub>X</sub> V ÷ Z<sub>T</sub> (V)</span>',PT(V,2,1),'hi']],
   bars:[1,2,3].map(k=>({l:'جهد Z<sub>'+k+'</sub>',v:all[k-1],max:50,u:'V',dp:2,col:k===s.x?'--blue':'--line'})),
   msg:s.x===3?'كما في حل الكتاب: \\(V_C=20.06\\angle{-}73.4^\\circ\\ \\text{V}\\). ومجموع الأطوال الثلاثة أكبر من <span class="ltr">50 V</span> لأن الجمع الصحيح اتجاهي.':'الجهد على هذه المعاوقة غير مطلوب في الكتاب؛ حسبناه بالقانون نفسه للمقارنة.'}}})}
   ]},

  {st:4,short:'مثال <span class="ltr">(1-2-14)</span>',title:'مثال <span class="ltr">(1-2-14)</span>: فرع مادي - سعوي وفرع مادي - حثي',ref:'ص 53–55',
   q:'بعد معرفة التيار الكلي: هل نحتاج قانون توزيع التيار للفرعين معاً، أم يكفي فرع واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-46: مقاومة 2 أوم وملف 3 أوم حتى العقدة a، ثم فرع رأسي 9 أوم ومكثف 7 أوم، وفرع ملف 5 أوم ومقاومة 6 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M38 90 L38 152.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 188.0 L38 250" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦100∠0° V⟧."><circle cx="38" cy="170.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M28 170.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="38" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">100∠0° V</text><rect x="14" y="146.0" width="48" height="48" rx="6" fill="transparent"/></g><path d="M38 90 L60 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="على الخط: مقاومة ⟦2 Ω⟧ وملف ⟦3 Ω⟧ على التوالي: ⟦Z1 = 2 + j3 Ω⟧، ويمر فيهما ⟦IT⟧ كله."><path d="M60 90 L62 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M106 90 L108 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M62.0 90 L69.33333333333333 97 L76.66666666666667 83 L84.0 97 L91.33333333333333 83 L98.66666666666666 97 L106.0 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M108 90 L112 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M156 90 L160 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M112 90 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="84" y="72" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2 Ω</text><text x="134" y="72" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">3 Ω</text><rect x="58" y="56" width="104" height="48" rx="6" fill="transparent"/></g><path d="M160 90 L185 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="185" cy="90" r="4.5" fill="#2C4A40"/><text x="185" y="78" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">a</text><g data-tip="الفرع الرأسي: مقاومة ⟦9 Ω⟧ ومكثف ⟦7 Ω⟧: ⟦Z2 = 9 − j7 Ω⟧ (مادي - سعوي)، وتياره ⟦I1⟧."><path d="M185 90 L185 113" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M185 113.0 L192 120.33333333333333 L178 127.66666666666667 L192 135.0 L178 142.33333333333334 L192 149.66666666666666 L185 157.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M185 157 L185 183" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M185 183 L185 200" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M185 210 L185 227" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="173" y1="200" x2="197" y2="200" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="173" y1="210" x2="197" y2="210" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><path d="M185 227 L185 250" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="200" y="140" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">9 Ω</text><text x="200" y="210" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">7 Ω</text><line x1="168.0" y1="150.0" x2="168.0" y2="173.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="168.0,180.0 163.8,173.0 172.2,173.0" fill="#12855A"/><text x="164" y="198" text-anchor="end" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="150" y="95" width="85" height="150" rx="6" fill="transparent"/></g><g data-tip="الفرع الآخر: ملف ⟦5 Ω⟧ ثم مقاومة ⟦6 Ω⟧: ⟦Z3 = 6 + j5 Ω⟧ (مادي - حثي)، وتياره ⟦I2⟧."><path d="M185 90 L223 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M267 90 L300 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M223 90 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="245" y="72" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><line x1="205.0" y1="104.0" x2="222.0" y2="104.0" stroke="#12855A" stroke-width="2.4" stroke-linecap="round"/><polygon points="229.0,104.0 222.0,108.2 222.0,99.8" fill="#12855A"/><text x="217" y="124" text-anchor="middle" font-size="11.5" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><path d="M300 90 L300 148.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M300 192.0 L300 250" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M300 148.0 L307 155.33333333333334 L293 162.66666666666666 L307 170.0 L293 177.33333333333334 L307 184.66666666666666 L300 192.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="316" y="175" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">6 Ω</text><rect x="190" y="56" width="160" height="190" rx="6" fill="transparent"/></g><path d="M38 250 L300 250" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="185" cy="250" r="4.5" fill="#2C4A40"/><g data-tip="التيار الكلي ⟦IT⟧ الخارج من المصدر."><line x1="44.0" y1="50.0" x2="72.0" y2="50.0" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="80.0,50.0 72.0,54.8 72.0,45.2" fill="#12855A"/><text x="62" y="42" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="40" y="26" width="46" height="32" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-46)</span>: <span class="ltr">Z<sub>1</sub></span> على الخط، ثم فرعان من العقدة a.<br><b>مرّر المؤشر على الخط والفرعين والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`عرفنا \(I_T\) و\(I_1\). كيف نجد \(I_2\) بأقصر طريق؟`,opts:[
     [String.raw`\(I_2=I_T+I_1\)`,false,String.raw`التيار الداخل للعقدة \(I_T\) يساوي مجموع الخارج \(I_1+I_2\)، فنطرح لا نجمع.`],
     [String.raw`\(I_2=I_T\)`,false,String.raw`جزء من \(I_T\) يذهب في \(I_1\).`],
     [String.raw`\(I_2=I_T-I_1\) (قانون كيرشوف للتيار)`,true,'وهكذا فعل الكتاب في الخطوة (د).']]}}
   ],
   body:[
    {book:String.raw`<p>في الدائرة الموضحة في الشكل <span class="ltr">1-46</span>، احسب ما يلي: أ- المعاوقة المكافئة \(Z_T\)؛ ب- التيار الكلي \(I_T\)؛ ج- التيار في المعاوقة المادية - السعوية \(I_1\)؛ د- التيار في المعاوقة المادية - الحثية \(I_2\).</p>
     <p><b>الحل:</b> نعيد رسم الدائرة كما في الشكلين <span class="ltr">1-47</span>، حيث:</p>
     $$Z_1=2+j3=3.61\angle 56.3^\circ\ \Omega\quad Z_2=9-j7=11.4\angle -37.9^\circ\ \Omega\quad Z_3=6+j5=7.81\angle 39.8^\circ\ \Omega$$
     $$Z_{T1}=\frac{Z_2 Z_3}{Z_2+Z_3}=\frac{(11.4\angle -37.9^\circ)(7.81\angle 39.8^\circ)}{(9-j7)+(6+j5)}=\frac{89.03\angle 1.9^\circ}{15.13\angle -7.6^\circ}=5.88\angle 9.5^\circ=5.8+j0.97\ \Omega$$
     $$\text{أ- }\ Z_T=Z_1+Z_{T1}=2+j3+5.8+j0.97=7.8+j3.97\ \Omega=8.75\angle 27^\circ\ \Omega$$
     $$\text{ب- }\ I_T=\frac{V}{Z_T}=\frac{100\angle 0^\circ}{8.75\angle 27^\circ}=11.43\angle -27^\circ\ \text{A}$$
     <p>ج- نستعمل قانون توزيع التيار لحساب التيار \(I_1\):</p>
     $$I_1=\frac{Z_3\,I_T}{Z_2+Z_3}=\frac{(7.8\angle 39.8^\circ)(11.43\angle -27^\circ)}{(9-j7)+(6+j5)}=\frac{89.154\angle 12.8^\circ}{15.13\angle -7.6^\circ}=5.9\angle 20.4^\circ\ \text{A}$$
     <p>د- نستعمل قانون كيرشوف للتيار لحساب التيار \(I_2\):</p>
     $$I_2=I_T-I_1=(10.18-j5.19)-(5.52+j2.05)=4.66-j7.24=8.61\angle -57.2^\circ\ \text{A}$$
     <p class="sub">الخطوتان (ب) و(د) هنا مصححتان؛ انظر «انتبه» أدناه.</p>`,ref:'ص 53–55'},
    {watch:String.raw`<p><b>ملاحظات على الكتاب:</b></p><ol><li>في الخطوة (ب) طُبع \(I_T=\frac{100\angle 0^\circ}{8.7\angle 27^\circ}=14.3\angle -27^\circ\ \text{A}\). والصحيح المقام <span class="ltr">8.75</span> والناتج <b>\(11.43\angle -27^\circ\ \text{A}\)</b>، والكتاب نفسه يستعمل <span class="ltr">11.43</span> في الخطوة التالية.</li>
     <li>في الخطوة (د) طُبع \(I_2=(10.69-j5.71)-(5.52+j2.05)=9.25\angle -56^\circ\ \text{A}\). لكن \(11.43\angle -27^\circ=10.18-j5.19\)، والناتج الصحيح <b>\(I_2\approx 8.6\angle -57.3^\circ\ \text{A}\)</b>.</li>
     <li>الخطوة (ج) صحيحة: \(I_1=5.9\angle 20.4^\circ\ \text{A}\). والحلان (كما في الكتاب / المصحح) في تبويب «الأمثلة المحلولة».</li></ol>`,fix:true},
    {tip:String.raw`<p>يمكنك التحقق من \(I_2\) بطريق آخر: قانون توزيع التيار للفرع الثاني \(I_2=\frac{Z_2\,I_T}{Z_2+Z_3}\) يعطي القيمة نفسها تقريباً \(8.6\angle -57.3^\circ\ \text{A}\). عندما تعطيك طريقتان النتيجة نفسها تطمئن إلى صحة الحل.</p>`,title:'تحقق بطريقتين'},
    {add:String.raw`<p>هذه الدائرة نفسها تعود في المسألة <span class="ltr">7</span> من مسائل الفصل الثاني (تحل بقوانين كيرشوف)، وفي المسألة <span class="ltr">3</span> من مسائل الفصل الثالث (القدرة المفاعلة في الملفين).</p>`},
    {title:'مختبر مصغّر: تحقق من قانون كيرشوف للتيار',widget:(el,B)=>DCML.lab(el,B,{intro:'من الحل المصحح: \\(I_T=11.43\\angle{-}27^\\circ\\)، \\(I_1=5.9\\angle20.4^\\circ\\)، \\(I_2=8.61\\angle{-}57.2^\\circ\\ \\text{A}\\). اجمع تياري الفرعين رأساً بذيل.',
 predict:{q:'هل \\(|I_1|+|I_2|\\) يساوي \\(|I_T|\\)؟',opts:[
  ['نعم، <span class="ltr">11.43 A</span>',false,'<span class="ltr">5.9 + 8.61 = 14.51</span>؛ الأطوال لا تُجمع جمعاً عادياً.'],
  ['لا؛ المتجهان هما اللذان يُجمعان: \\(I_1+I_2=I_T\\)',true,'بين التيارين زاوية <span class="ltr">77.6°</span>، فمجموعهما الاتجاهي أقصر من مجموع طوليهما.'],
  ['لا، لأن قانون كيرشوف لا يصح في التيار المتردد',false,'يصح بالمتجهات، كما في الخطوة (د).']]},
 ins:[{k:'m',l:'ما تراه في الرسم',seg:[['v','جمع اتجاهي'],['a','أطوال فقط']],v:'v'}],
 calc:(s,P,B)=>{const I1=cpol(5.9,20.4),I2=cpol(8.61,-57.2),S=cadd(I1,I2),f1=v=>(+v).toFixed(1),sc=14,ox=20,oy=70;
  const X=z=>ox+z.re*sc,Y=z=>oy-z.im*sc;
  const arr=(p,q,col,lab,dx,dy)=>{const x1=X(p),y1=Y(p),x2=X(q),y2=Y(q),a=Math.atan2(y2-y1,x2-x1),h=10;return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="var(${col})" stroke-width="3"/><polygon points="${f1(x2)},${f1(y2)} ${f1(x2-h*Math.cos(a-0.4))},${f1(y2-h*Math.sin(a-0.4))} ${f1(x2-h*Math.cos(a+0.4))},${f1(y2-h*Math.sin(a+0.4))}" fill="var(${col})"/><text x="${f1((x1+x2)/2+dx)}" y="${f1((y1+y2)/2+dy)}" font-size="12" font-weight="700" fill="var(${col})" text-anchor="middle">${lab}</text>`};
  const O=Cx(0,0);let g;
  if(s.m==='v')g=arr(O,I1,'--blue','I1',-4,-10)+arr(I1,S,'--live','I2',16,0)+arr(O,S,'--on','IT',-8,18);
  else g=arr(O,Cx(5.9,0),'--blue','I1',0,-8)+arr(Cx(5.9,0),Cx(14.51,0),'--live','I2',0,-8)+`<line x1="${f1(X(Cx(11.43,0)))}" y1="${oy-26}" x2="${f1(X(Cx(11.43,0)))}" y2="${oy+26}" stroke="var(--on)" stroke-width="2" stroke-dasharray="4 3"/><text x="${f1(X(Cx(11.43,0)))}" y="${oy+40}" font-size="11" fill="var(--on)" text-anchor="middle">|IT|</text>`;
  const pic=`<svg viewBox="0 0 240 170" role="img" aria-label="جمع تياري الفرعين" style="font-family:var(--font);max-width:320px;display:block;margin-inline:auto" direction="ltr"><line x1="${ox}" y1="${oy}" x2="236" y2="${oy}" stroke="var(--muted)" stroke-dasharray="3 4"/>${g}</svg>`;
  return s.m==='v'?{pic,facts:[['<span class="ltr">I<sub>1</sub> + I<sub>2</sub> (A)</span>',PT(S,2,1),'hi'],['I<sub>T</sub> (A)','11.43∠-27°']],msg:'المجموع الاتجاهي يعطي التيار الكلي (الفرق الصغير من التقريب). لذلك \\(I_2=I_T-I_1\\) بالمتجهات.'}
   :{pic,facts:[['<span class="ltr">5.9 + 8.61</span>','14.51 A','bad'],['|I<sub>T</sub>|','11.43 A']],msg:'جمع الأطوال يتجاوز التيار الكلي: هذا ليس قانون كيرشوف.',cls:'bad'}}})}
   ]},

  {recap:[
   String.raw`في دوائر التوالي - التوازي نسمي كل مجموعة معاوقة واحدة، ونختصر مجموعات التوازي أولاً بالقانون \(\frac{Z_aZ_b}{Z_a+Z_b}\)، ثم نجمع ما على التوالي (ص 51).`,
   String.raw`ثم \(I_T=V/Z_T\)، ونرجع للفروع بقانون توزيع التيار (1-40) وللجهود بقانون أوم أو بقانون توزيع الجهد.`,
   String.raw`ملف ومكثف على التوازي قد تكون معاوقتهما أكبر من كل منهما: \(-j12\ \Omega\) في المثال <span class="ltr">(1-2-12)</span>.`,
   String.raw`قانون كيرشوف للتيار يعطي تيار الفرع الثاني مباشرة: \(I_2=I_T-I_1\)، كما في المثال <span class="ltr">(1-2-14)</span>.`]}
],
 theory:[
  {h:'التوصيل على التوالي - التوازي',ref:'ص 51',html:`<p>كثير من الدوائر الكهربائية لا تحتوي على عناصر مربوطة على التوالي فقط أو على التوازي فقط، وإنما تتكون من فروع بعضها على التوالي وبعضها على التوازي. وتبين الأمثلة التالية الخطوات المستعملة لتحليل مثل هذه الدوائر.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب) — الطريقة في كل الأمثلة:</b><ol style="margin:4px 0 0"><li>سمِّ كل مجموعة عناصر على التوالي معاوقة واحدة (Z<sub>1</sub>، Z<sub>2</sub> …) وأعد رسم الدائرة.</li><li>احسب معاوقة كل مجموعة توازي: \\(\\frac{Z_a Z_b}{Z_a + Z_b}\\).</li><li>اجمع المعاوقات التي على التوالي فتحصل على \\(Z_T\\)، ثم \\(I_T = V/Z_T\\).</li><li>ارجع إلى الدائرة الأصلية: قانون توزيع التيار للفروع، وقانون أوم أو توزيع الجهد للجهود.</li></ol>'},
  {h:'مثال (1-2-12)',ref:'ص 51–52',html:`<p>في الدائرة الموضحة في الشكل 1-42، احسب ما يلي: أ- المعاوقة المكافئة \\(Z_T\\)؛ ب- التيار الكلي \\(I_T\\)؛ ج- التيار في الملف \\(I_L\\)؛ د- الجهد بين طرفي المقاومة \\(V_R\\)؛ هـ- الجهد بين طرفي المكثف \\(V_C\\).</p>`},
  {fig:'(1-42)',ref:'ص 51',caption:'مقاومة 2 Ω على التوالي مع مجموعة توازي من فرعين: مكثف 4 Ω وملف 6 Ω.',draw:()=>box(ladder({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'R',l:'R = 2 Ω',gap:44},{s:'sh',t:'C',l:sb('X','C')+' = 4 Ω'},{s:'sh',t:'L',l:sb('X','L')+' = 6 Ω',i:sb('I','L'),gap:120}]}),470)},
  {html:`<p><b>الحل:</b> أ- لتسهيل حساب المعاوقة المكافئة أعد رسم الدائرة كما في الشكل 1-43، حيث</p>
   $$Z_1=R=2\\ \\Omega\\qquad Z_2=\\frac{(jX_L)(-jX_C)}{(jX_L)+(-jX_C)}=\\frac{(6\\angle 90^\\circ)(4\\angle -90^\\circ)}{j6-j4}=-j12\\ \\Omega=12\\angle -90^\\circ\\ \\Omega$$
   $$Z_T=Z_1+Z_2=2-j12\\ \\Omega=12.17\\angle -80.5^\\circ\\ \\Omega$$<p>نستنتج أن الحمل مادي - سعوي.</p>`},
  {fig:'(1-43)',ref:'ص 52',caption:'الدائرة بعد إعادة الرسم: Z<sub>1</sub> على التوالي مع Z<sub>2</sub>.',draw:()=>box(ladder({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:44},{s:'sh',t:'Z',l:sb('Z','2'),gap:60}]}),360)},
  {html:`$$\\text{ب- }\\ I_T=\\frac{V}{Z_T}=\\frac{100\\angle 0^\\circ}{12.17\\angle -80.5^\\circ}=8.22\\angle 80.5^\\circ\\ \\text{A}$$
   <p>ج- لحساب التيار في الملف نستعمل قانون توزيع التيار:</p>
   $$I_L=\\frac{(-jX_C)\\,I_T}{(-jX_C)+(jX_L)}=\\frac{(4\\angle -90^\\circ)(8.22\\angle 80.5^\\circ)}{2\\angle 90^\\circ}=16.44\\angle -99.5^\\circ\\ \\text{A}$$
   $$\\text{د- }\\ V_R=R\\,I_T=2\\times 8.22\\angle 80.5^\\circ=16.44\\angle 80.5^\\circ\\ \\text{V}\\qquad \\text{هـ- }\\ V_C=Z_2 I_T=12\\angle -90^\\circ\\times 8.22\\angle 80.5^\\circ=98.64\\angle -9.5^\\circ\\ \\text{V}$$`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> تيار الملف (16.44 A) ضعف التيار الكلي تقريباً: مجموعة التوازي (ملف 6 Ω مع مكثف 4 Ω) قريبة من رنين التوازي، فمعاوقتها كبيرة (12 Ω) والتيار يدور بين الملف والمكثف. لو كانت \\(X_L = X_C\\) لصارت معاوقتها لا نهائية والتيار الكلي صفراً. جرّب ذلك في المختبر.'},
  {h:'مثال (1-2-13)',ref:'ص 52–53',html:`<p>في الدائرة الموضحة في الشكل 1-44، احسب ما يلي: أ- الجهد بين طرفي المكثف \\(V_C\\) باستعمال قانون توزيع الجهد. ب- التيار الكلي \\(I_T\\).</p>`},
  {fig:'(1-44)',ref:'ص 52',caption:'R<sub>1</sub> = 8 Ω على التوالي مع مجموعة توازي (R<sub>2</sub> = 8 Ω في الفرع العلوي، والملف 5 Ω مع R<sub>3</sub> = 6 Ω في الفرع السفلي)، ثم المكثف 5 Ω على الضلع الأيمن وعليه V<sub>C</sub>.',draw:()=>box(ladder({src:'50∠0° V',it:sb('I','T'),v:sb('V','C'),items:[{s:'ser',t:'R',l:sb('R','1')+' = 8 Ω',gap:40,w:84},{s:'hp',up:[{t:'R',l:sb('R','2')+' = 8 Ω'}],dn:[{t:'L',l:sb('X','L')+' = 5 Ω'},{t:'R',l:sb('R','3')+' = 6 Ω'}],w:220},{s:'sh',t:'C',l:sb('X','C')+' = 5 Ω',gap:50}]}),560)},
  {html:`<p><b>الحل:</b> أ- لتسهيل حساب الجهد \\(V_C\\) أعد رسم الدائرة كما في الشكل 1-45، حيث</p>`},
  {fig:'(1-45)',ref:'ص 53',caption:'Z<sub>1</sub> ثم Z<sub>2</sub> على الخط العلوي، و Z<sub>3</sub> على الضلع الأيمن وعليه V<sub>C</sub>.',draw:()=>box(ladder({src:'50∠0° V',it:sb('I','T'),v:sb('V','C'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:40},{s:'ser',t:'Z',l:sb('Z','2'),gap:20},{s:'sh',t:'Z',l:sb('Z','3'),gap:50}]}),450)},
  {html:`$$Z_1=R_1=8\\ \\Omega\\qquad Z_2=\\frac{R_2(R_3+jX_L)}{R_2+(R_3+jX_L)}=\\frac{8(6+j5)}{8+(6+j5)}=\\frac{62.48\\angle 39.8^\\circ}{14.87\\angle 19.7^\\circ}=4.2\\angle 20.1^\\circ=3.94+j1.44\\ \\Omega$$
   $$Z_3=-jX_C=-j5\\ \\Omega$$<p>وباستعمال قانون توزيع الجهد نحسب الجهد</p>
   $$V_C=\\frac{Z_3\\,V}{Z_1+Z_2+Z_3}=\\frac{(5\\angle -90^\\circ)(50\\angle 0^\\circ)}{(8)+(3.94+j1.44)+(-j5)}=\\frac{250\\angle -90^\\circ}{12.46\\angle -16.6^\\circ}=20.06\\angle -73.4^\\circ\\ \\text{V}$$
   $$\\text{ب- }\\ I_T=\\frac{V_C}{-jX_C}=\\frac{20.06\\angle -73.4^\\circ}{5\\angle -90^\\circ}=4.01\\angle 16.6^\\circ\\ \\text{A}$$`},
  {h:'مثال (1-2-14)',ref:'ص 53–55',html:`<p>في الدائرة الموضحة في الشكل 1-46، احسب ما يلي: أ- المعاوقة المكافئة \\(Z_T\\)؛ ب- التيار الكلي \\(I_T\\)؛ ج- التيار في المعاوقة المادية - السعوية \\(I_1\\)؛ د- التيار في المعاوقة المادية - الحثية \\(I_2\\).</p>`},
  {fig:'(1-46)',ref:'ص 54',caption:'مقاومة 2 Ω وملف 3 Ω على الخط حتى العقدة a؛ ومنها فرع رأسي (9 Ω و مكثف 7 Ω) تياره I<sub>1</sub>، وفرع (ملف 5 Ω ثم مقاومة 6 Ω) تياره I<sub>2</sub>.',draw:()=>box(fig146(),520)},
  {html:`<p><b>الحل:</b> نعيد رسم الدائرة كما في الشكلين 1-47، حيث:</p>
   $$Z_1=2+j3=3.61\\angle 56.3^\\circ\\ \\Omega\\quad Z_2=9-j7=11.4\\angle -37.9^\\circ\\ \\Omega\\quad Z_3=6+j5=7.81\\angle 39.8^\\circ\\ \\Omega$$`},
  {fig:'(1-47)',ref:'ص 54',caption:'(a) Z<sub>1</sub> على التوالي مع فرعين متوازيين Z<sub>2</sub> (تياره I<sub>1</sub>) و Z<sub>3</sub> (تياره I<sub>2</sub>). (b) Z<sub>1</sub> على التوالي مع Z<sub>T1</sub>.',draw:()=>`<div class="cb-figs"><figure>${box(ladder({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:44},{s:'sh',t:'Z',l:sb('Z','2'),i:sb('I','1'),gap:30},{s:'sh',t:'Z',l:sb('Z','3'),i:sb('I','2'),gap:96}],wr:60}),380)}(a)</figure><figure>${box(ladder({src:'100∠0° V',it:sb('I','T'),items:[{s:'ser',t:'Z',l:sb('Z','1'),gap:44},{s:'sh',t:'Z',l:sb('Z','T1'),gap:40}],wr:70}),330)}(b)</figure></div>`},
  {html:`$$Z_{T1}=\\frac{Z_2 Z_3}{Z_2+Z_3}=\\frac{(11.4\\angle -37.9^\\circ)(7.81\\angle 39.8^\\circ)}{(9-j7)+(6+j5)}=\\frac{89.03\\angle 1.9^\\circ}{15.13\\angle -7.6^\\circ}=5.88\\angle 9.5^\\circ=5.8+j0.97\\ \\Omega$$
   $$\\text{أ- }\\ Z_T=Z_1+Z_{T1}=2+j3+5.8+j0.97=7.8+j3.97\\ \\Omega=8.75\\angle 27^\\circ\\ \\Omega$$
   $$\\text{ب- }\\ I_T=\\frac{V}{Z_T}=\\frac{100\\angle 0^\\circ}{8.75\\angle 27^\\circ}=11.43\\angle -27^\\circ\\ \\text{A}$$
   <p>ج- نستعمل قانون توزيع التيار لحساب التيار \\(I_1\\):</p>
   $$I_1=\\frac{Z_3\\,I_T}{Z_2+Z_3}=\\frac{(7.8\\angle 39.8^\\circ)(11.43\\angle -27^\\circ)}{(9-j7)+(6+j5)}=\\frac{89.154\\angle 12.8^\\circ}{15.13\\angle -7.6^\\circ}=5.9\\angle 20.4^\\circ\\ \\text{A}$$
   <p>د- نستعمل قانون كيرشوف للتيار لحساب التيار \\(I_2\\):</p>
   $$I_2=I_T-I_1=(10.18-j5.19)-(5.52+j2.05)=4.66-j7.24=8.61\\angle -57.2^\\circ\\ \\text{A}$$
   <p class="sub fixnote">الخطوتان (ب) و(د) هنا مصححتان؛ انظر الملاحظات أدناه وتبويب «الأمثلة المحلولة» (كما في الكتاب / المصحح).</p>`},
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب — مثال (1-2-14) ص 54–55:</b><ol><li>في الخطوة (ب) طُبع \\(I_T = \\frac{100\\angle 0^\\circ}{8.7\\angle 27^\\circ} = 14.3\\angle -27^\\circ\\) A. والصحيح المقام 8.75 والناتج <b>\\(11.43\\angle -27^\\circ\\) A</b> (والكتاب نفسه يستعمل 11.43 في الخطوة التالية).</li><li>في الخطوة (د) طُبع \\(I_2 = (10.69 - j5.71) - (5.52 + j2.05) = 9.25\\angle -56^\\circ\\) A. لكن \\(11.43\\angle -27^\\circ = 10.18 - j5.19\\)، والناتج الصحيح <b>\\(I_2 \\approx 8.6\\angle -57.3^\\circ\\) A</b> (تحقق: \\(Z_2 I_T/(Z_2+Z_3)\\) يعطي القيمة نفسها).</li><li>الخطوة (ج) صحيحة: \\(I_1 = 5.9\\angle 20.4^\\circ\\) A.</li></ol></div>'}
 ],
 lab:(el)=>{
  const PRE={e12:{V:100,th:0,Z:[[2,0,0],[0,0,4],[0,6,0],[0,0,0]]},e13:{V:50,th:0,Z:[[8,0,0],[8,0,0],[6,5,0],[0,0,5]]},e14:{V:100,th:0,Z:[[2,3,0],[9,0,7],[6,5,0],[0,0,0]]}};
  let P=JSON.parse(JSON.stringify(PRE.e12));const did={};const NM=['a','b','c','d'];
  const card=(k,t,sub)=>`<div class="cb-zc"><h4>${t} <small id="l10z${k}"></small></h4><div class="cb-in3">${ni('l10'+k+'0','R',0)}${ni('l10'+k+'1','X<sub>L</sub>',0)}${ni('l10'+k+'2','X<sub>C</sub>',0)}</div><div class="sub" style="margin:4px 0 0">${sub}</div></div>`;
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c12"><h2>دائرة توالي - توازي عامة <small>Z<sub>a</sub> ثم (Z<sub>b</sub> ∥ Z<sub>c</sub>) ثم Z<sub>d</sub> — تغطي الأشكال (1-42) و(1-44) و(1-46)</small></h2>
    <div class="cb-row"><span class="sub">أرقام الكتاب:</span>${segHTML('pr',[['e12','مثال 1-2-12'],['e13','مثال 1-2-13'],['e14','مثال 1-2-14']],'e12')}</div>
    <div class="cb-sls">${nsl('l10V','جهد المصدر V',0,200,0.5,P.V,'V')}${nsl('l10th','زاويته',-180,180,0.1,P.th,'°')}</div>
    <div class="cb-zg">${card('a','Z<sub>a</sub> (على التوالي أولاً)','اكتب 0 لعنصر غير موجود.')}${card('b','Z<sub>b</sub> (الفرع العلوي)','')}${card('c','Z<sub>c</sub> (الفرع السفلي)','')}${card('d','Z<sub>d</sub> (الضلع الأيمن)','كلها 0 = سلك.')}</div></div>
   <div class="panel c7"><h2>الدائرة والقراءات</h2><div class="svgbox cb-wide" id="l10c"></div>
    <h3 class="sm">الاختصار خطوة خطوة</h3><div id="l10red" class="cb-mat"></div><div class="cb-row"><span id="l10chip" class="cb-chip"></span></div></div>
   <div class="panel c5"><h2>التيارات والجهود</h2><div class="facts">${fact('I<sub>T</sub>','l10it')}${fact('I<sub>b</sub>','l10ib')}${fact('I<sub>c</sub>','l10ic')}${fact('V<sub>a</sub>','l10va')}${fact('V<sub>bc</sub> (جهد مجموعة التوازي)','l10vbc')}${fact('V<sub>d</sub>','l10vd')}</div>
    <h3 class="sm">قانون كيرشوف للجهد: V<sub>a</sub> + V<sub>bc</sub> + V<sub>d</sub> = V</h3><div class="svgbox" id="l10pv" style="max-width:330px;margin-inline:auto"></div>
    <h3 class="sm">قانون كيرشوف للتيار: I<sub>b</sub> + I<sub>c</sub> = I<sub>T</sub></h3><div class="svgbox" id="l10pi" style="max-width:330px;margin-inline:auto"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l10st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const setV=nslBind(el,'l10V',v=>{P.V=v;draw()}),setTh=nslBind(el,'l10th',v=>{P.th=v;draw()});
  const fill=()=>NM.forEach((k,i)=>[0,1,2].forEach(j=>{$('#l10'+k+j).value=P.Z[i][j]}));
  NM.forEach((k,i)=>[0,1,2].forEach(j=>$('#l10'+k+j).addEventListener('input',e=>{const v=parseFloat(e.target.value);P.Z[i][j]=isFinite(v)?Math.max(0,v):0;draw()})));
  segBind(el,'pr',k=>{P=JSON.parse(JSON.stringify(PRE[k]));fill();setV(P.V);setTh(P.th);did[k]=1;draw()});
  let R10={};
  const lbl=z=>RT(z,2);
  function draw(){const Z=P.Z.map(a=>Cx(a[0],a[1]-a[2])),[Za,Zb,Zc,Zd]=Z,V=cpol(P.V,P.th);NM.forEach((k,i)=>{$('#l10z'+k).textContent=lbl(Z[i])+' Ω'});
   /* عطل مخفي: وصلة رخوة على التوالي، أو فرع مفتوح/مقصور في مجموعة التوازي (للتيارات والجهود فقط). خارج وضع التحدي لا فرق */
   const ZaA=chF('aloose')?cadd(Za,Cx(4)):Za,chX=chF('bopen')||chF('copen')||chF('cshort');
   const sbc=cadd(Zb,Zc),res=!chX&&cabs(sbc)<1e-9;let Zbc,ZT,IT,Ib,Ic,Vbc;
   if(res){IT=Cx(0);Vbc=V;Ib=cabs(Zb)>1e-12?cdiv(V,Zb):Cx(0);Ic=csub(Cx(0),Ib);Zbc=null}
   else if(chX){const Zg=chF('cshort')?Cx(0):chF('bopen')?Zc:Zb;ZT=cadd(cadd(ZaA,Zg),Zd);IT=cabs(ZT)<1e-9?Cx(0):cdiv(V,ZT);Vbc=cmul(IT,Zg);Ib=chF('copen')?IT:Cx(0);Ic=chF('copen')?Cx(0):IT;Zbc=cdiv(cmul(Zb,Zc),cabs(sbc)<1e-9?Cx(1e-9):sbc);ZT=cadd(cadd(Za,Zbc),Zd)}
   else{Zbc=cdiv(cmul(Zb,Zc),sbc);ZT=cadd(cadd(Za,Zbc),Zd);if(cabs(ZT)<1e-9){$('#l10chip').className='cb-chip warn';$('#l10chip').textContent='Z_T = 0: دائرة قصر على المصدر! غيّر القيم.';return}
    const ZTa=chF('aloose')?cadd(cadd(ZaA,Zbc),Zd):ZT;IT=cdiv(V,ZTa);Ib=cdiv(cmul(Zc,IT),sbc);Ic=cdiv(cmul(Zb,IT),sbc);Vbc=cmul(IT,Zbc)}
   const Va=cmul(IT,ZaA),Vd=cmul(IT,Zd);R10={IT,Ib,Ic,res,Zb,Zc};
   const zl=(i,nm)=>{const a=P.Z[i],r=[];if(a[0]>0)r.push({t:'R',l:f1(a[0])+'Ω'});if(a[1]>0)r.push({t:'L',l:f1(a[1])+'Ω'});if(a[2]>0)r.push({t:'C',l:f1(a[2])+'Ω'});return r};
   const za=zl(0),zb=zl(1),zc=zl(2),zd=zl(3);const items=[];
   if(za.length)za.forEach((e,i)=>items.push({s:'ser',t:e.t,l:e.l,w:62,gap:i?0:44}));else items.push({s:'ser',t:'W',w:40,gap:44});
   items.push({s:'hp',up:zb.length?zb:[{t:'W'}],dn:zc.length?zc:[{t:'W'}],w:Math.max(150,Math.max(zb.length,zc.length)*70+40)});
   if(zd.length)items.push(zd.length===1?{s:'sh',t:zd[0].t,l:zd[0].l,gap:50}:{s:'sh',parts:zd,gap:50});else items.push({s:'sh',t:'W',gap:40});
   $('#l10c').innerHTML=ladder({src:PT(V,1,1)+' V',it:sb('I','T'),items,wr:80}).replace('</svg>',`<g>${S.t(140,250,'IT = '+PT(IT,2,1)+' A','b','start')}${S.t(140,266,'Ib = '+PT(Ib,2,1)+'  Ic = '+PT(Ic,2,1)+' A','','start')}</g></svg>`).replace(/viewBox="0 0 (\d+) (\d+)"/,(m,w)=>`viewBox="0 0 ${Math.max(+w,420)} 276"`);
   $('#l10red').innerHTML=`<div class="ex-f">${B.tex(res?`Z_b + Z_c = 0 \\Rightarrow Z_{bc} = \\infty`:`Z_{bc} = \\frac{Z_b Z_c}{Z_b + Z_c} = ${RZ(Zbc,2)}\\ \\Omega`,true)}</div>${res?'':`<div class="ex-f">${B.tex(`Z_T = Z_a + Z_{bc} + Z_d = ${RZ(ZT,2)} = ${PZc(ZT,2,1)}\\ \\Omega`,true)}</div>`}`;
   const ch=$('#l10chip');if(res){ch.className='cb-chip warn';ch.textContent='رنين في مجموعة التوازي: معاوقتها لا نهائية، I_T = 0 والتيار يدور بين الفرعين فقط'}else{const a=cang(ZT);ch.className='cb-chip '+(Math.abs(a)<0.05?'ok':a>0?'hot':'ld');ch.textContent='الحمل الكلي '+nat(ZT)+' ('+f1(a,1)+'°)'}
   $('#l10it').textContent=PT(IT,2,1)+' A';$('#l10ib').textContent=PT(Ib,2,1)+' A';$('#l10ic').textContent=PT(Ic,2,1)+' A';$('#l10va').textContent=PT(Va,2,1)+' V';$('#l10vbc').textContent=PT(Vbc,2,1)+' V';$('#l10vd').textContent=PT(Vd,2,1)+' V';
   const its=[{z:V,lab:'V',col:'--stop',w:3}];let acc=Cx(0);[[Va,'Va','--muted'],[Vbc,'Vbc','--on'],[Vd,'Vd','--live']].forEach(([z,l,c])=>{if(cabs(z)>1e-9){its.push({z,from:cabs(acc)>1e-12?acc:null,lab:l,col:c,mid:-1});acc=cadd(acc,z)}});
   $('#l10pv').innerHTML=phasorSVG(its,{w:330,h:240,eq:true});
   $('#l10pi').innerHTML=phasorSVG([{z:Ib,lab:'Ib',col:'--live'},{z:Ic,from:cabs(Ib)>1e-12?Ib:null,lab:'Ic',col:'--on',mid:-1},{z:IT,lab:'IT',col:'--stop',w:3}].filter(x=>cabs(x.z)>1e-9),{w:330,h:220,eq:true});
   steps.check()}
  const steps=stepsUI($('#l10st'),[
   {t:'مثال (1-2-12)',x:'اختر «مثال 1-2-12»: \\(Z_{bc} = -j12\\) و\\(Z_T = 2 - j12 = 12.17\\angle -80.5^\\circ\\) و\\(I_T = 8.22\\angle 80.5^\\circ\\) A، وتيار الملف \\(I_c = 16.44\\angle -99.5^\\circ\\) A.',done:()=>did.e12&&Math.abs(cabs(R10.IT)-8.22)<0.01},
   {t:'رنين مجموعة التوازي',x:'في المثال نفسه اجعل \\(X_L\\) في \\(Z_c\\) يساوي 4 (مثل المكثف): تصير معاوقة مجموعة التوازي لا نهائية، فلا يمر تيار من المصدر، بينما يدور تيار كبير بين الملف والمكثف.',done:()=>R10.res&&cabs(R10.Ib)>0},
   {t:'مثال (1-2-13)',x:'اختر «مثال 1-2-13»: الجهد على المكثف في الضلع الأيمن هو \\(V_d = 20.06\\angle -73.4^\\circ\\) V والتيار الكلي \\(4.01\\angle 16.6^\\circ\\) A. لاحظ في مخطط الجهود أن الجهود الثلاثة مجموعة رأساً لذيل تعطي V.',done:()=>did.e13&&Math.abs(cabs(R10.IT)-4.01)<0.01},
   {t:'مثال (1-2-14) وخطأ الكتاب',x:'اختر «مثال 1-2-14»: التيار الكلي \\(11.43\\angle -27^\\circ\\) A (وليس 14.3 كما طُبع في الكتاب)، و\\(I_b = I_1 = 5.9\\angle 20.4^\\circ\\) و\\(I_c = I_2 = 8.6\\angle -57.3^\\circ\\) A.',done:()=>did.e14&&Math.abs(cabs(R10.IT)-11.43)<0.02},
   {t:'فرعان متماثلان',x:'اجعل \\(Z_b\\) و\\(Z_c\\) متساويتين: ينقسم التيار الكلي نصفين متساويين.',done:()=>!R10.res&&cabs(csub(R10.Zb,R10.Zc))<1e-9&&cabs(R10.Zb)>0}
  ]);
  fill();draw();
 },
 examples:[
  {title:'مثال (1-2-12)',ref:'ص 51–52',q:'<p>في الدائرة الموضحة في الشكل 1-42 (مقاومة 2 Ω على التوالي مع مكثف 4 Ω وملف 6 Ω على التوازي، والمصدر \\(100\\angle 0^\\circ\\) V)، احسب: أ- \\(Z_T\\)؛ ب- \\(I_T\\)؛ ج- \\(I_L\\)؛ د- \\(V_R\\)؛ هـ- \\(V_C\\).</p>',given:G1212,solve:g=>sp12(g)},
  {title:'مثال (1-2-13)',ref:'ص 52–53',q:'<p>في الدائرة الموضحة في الشكل 1-44، احسب: أ- الجهد بين طرفي المكثف \\(V_C\\) باستعمال قانون توزيع الجهد. ب- التيار الكلي \\(I_T\\).</p>',given:G1213,solve:g=>sp13(g)},
  {title:'مثال (1-2-14) — الحل كما في الكتاب',ref:'ص 53–55',q:'<p>في الدائرة الموضحة في الشكل 1-46، احسب: أ- المعاوقة المكافئة \\(Z_T\\)؛ ب- التيار الكلي \\(I_T\\)؛ ج- التيار في المعاوقة المادية - السعوية \\(I_1\\)؛ د- التيار في المعاوقة المادية - الحثية \\(I_2\\).</p>',given:G1214,solve:(g,B,isBook)=>sp14(g,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة السطرين (ب) و(د) كما طُبعا (14.3 A و 9.25∠−56° A). إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة. قارن بالحل المصحح أدناه.'},
  {title:'مثال (1-2-14) — الحل المصحح',ref:'ص 53–55',q:'<p>نفس المثال بقسمة صحيحة في الخطوة (ب) وتحويل صحيح إلى الصورة المتعامدة في الخطوة (د). (حساب مصحح — ليس من الكتاب.)</p>',given:G1214,solve:g=>sp14(g,false),
   note:'<span class="fixnote">الفرق عن الكتاب: \\(I_T = 11.43\\angle -27^\\circ\\) A بدل 14.3، و\\(I_2 \\approx 8.6\\angle -57.3^\\circ\\) A بدل \\(9.25\\angle -56^\\circ\\). باقي النتائج كما في الكتاب.</span>'}
 ],
 quiz:[
  {q:'أول خطوة في تحليل دائرة توالي - توازي:',o:['حساب القدرة','إعادة رسم الدائرة بتسمية كل مجموعة معاوقة واحدة','قياس الجهد','حذف المكثفات'],c:1,e:'الكتاب يعيد الرسم في كل مثال (الأشكال 1-43 و1-45 و1-47).'},
  {q:'ملف 6 Ω ومكثف 4 Ω على التوازي. معاوقتهما المكافئة:',o:['j2 Ω','−j12 Ω','j10 Ω','2.4 Ω'],c:1,e:'مثال (1-2-12): \\(\\frac{(j6)(-j4)}{j6 - j4} = \\frac{24}{j2} = -j12\\ \\Omega\\).'},
  {q:'في مثال (1-2-12) كان \\(Z_T = 2 - j12\\ \\Omega\\). الحمل:',o:['مادي - حثي','مادي - سعوي','مادي بحت','حثي بحت'],c:1,e:'الجزء التخيلي سالب.'},
  {q:'لحساب الجهد على عنصر من عناصر على التوالي مباشرة نستعمل:',o:['قانون توزيع التيار','قانون توزيع الجهد','قانون السماحية','تردد الرنين'],c:1,e:'مثال (1-2-13): \\(V_C = \\frac{Z_3 V}{Z_1 + Z_2 + Z_3}\\).'},
  {q:'في مثال (1-2-14): \\(Z_T = 8.75\\angle 27^\\circ\\) و\\(V = 100\\angle 0^\\circ\\). التيار الكلي الصحيح:',o:['14.3∠−27° A','11.43∠−27° A','8.75∠27° A','11.43∠27° A'],c:1,e:'\\(100/8.75 = 11.43\\)، والزاوية \\(0 - 27 = -27^\\circ\\). الرقم 14.3 خطأ مطبعي في الكتاب.'},
  {q:'إذا عرفنا \\(I_T\\) و\\(I_1\\) في عقدة لها فرعان، فإن \\(I_2\\):',o:['\\(I_T + I_1\\)','\\(I_T - I_1\\) بالمتجهات','\\(I_1 - I_T\\)','\\(I_T \\times I_1\\)'],c:1,e:'قانون كيرشوف للتيار (مثال 1-2-14، د).'},
  {q:'لماذا نحوّل التيارات إلى الصورة المتعامدة (a + jb) قبل طرحها؟',o:['لأن الطرح والجمع يكونان بالأجزاء الحقيقية والتخيلية','لأن الصورة القطبية خطأ','لتصغير الأرقام','لا داعي لذلك'],c:0,e:'الجمع والطرح بالصورة المتعامدة، والضرب والقسمة بالقطبية.'}
 ]
});

/* ======================================================================
   Lesson 11 — Kirchhoff's laws, mesh method with determinants + chapter-2 problems (ص 55–62)
   ====================================================================== */
/* two-mesh circuit: o={src,src2 (second line), tl,bl (loop-1 elements on top/bottom wire), mid, right (elements or {parts}), it,i1,i2, nodes:[[x,y,lab]], loops:[l1,l2], ids} */
function meshFig(o){const x0=o.x0||110,xm=o.xm||300,xr=o.xr||470,top=60,bot=210,W=xr+(o.wr||120);let s=svgO(W,bot+36,o.aria||'دائرة بحلقتين');
  const vert=(x,it)=>{if(!it)return wire([[x,top],[x,bot]]);if(it.parts){const h=(bot-top)/it.parts.length;let r='';it.parts.forEach((p,j)=>{r+=comp(p.t,x,top+h*j,x,top+h*(j+1),{l:p.l,l2:p.l2,side:1,c:p.c,b:Math.min(40,h-14)})});return r}return comp(it.t,x,top,x,bot,{l:it.l,l2:it.l2,side:1,c:it.c})};
  s+=o.tl?comp(o.tl.t,x0,top,xm,top,{l:o.tl.l,l2:o.tl.l2,c:o.tl.c}):wire([[x0,top],[xm,top]]);
  s+=o.bl?comp(o.bl.t,x0,bot,xm,bot,{l:o.bl.l,side:-1,c:o.bl.c}):wire([[x0,bot],[xm,bot]]);
  s+=wire([[xm,top],[xr,top]])+wire([[xm,bot],[xr,bot]])+vert(xm,o.mid)+vert(xr,o.right)+dot(xm,top)+dot(xm,bot);
  s+=comp(o.srcT||'V',x0,bot,x0,top,{l:o.src,l2:o.src2,side:-1});
  if(o.it)s+=cur(x0+(o.itx||32),top,'r',o.it,{L:18});if(o.i1)s+=cur(xm,top+22,'d',o.i1,{left:true});if(o.i2)s+=cur(xr,top+22,'d',o.i2,{left:true});
  (o.nodes||[]).forEach(([x,y,l])=>{s+=S.t(x,y,l,'b','middle')});
  const cy=(top+bot)/2;if(o.loops){s+=(o.anim?`<circle id="${o.anim}1" cx="${(x0+xm)/2+(o.lo1||0)}" cy="${cy}" r="30" fill="none" stroke="var(--blue)" stroke-width="3" stroke-dasharray="7 9" opacity=".55"/><circle id="${o.anim}2" cx="${(xm+xr)/2+(o.lo2||0)}" cy="${cy}" r="30" fill="none" stroke="var(--blue)" stroke-width="3" stroke-dasharray="7 9" opacity=".55"/>`:'')+loopArrow((x0+xm)/2+(o.lo1||0),cy,22,o.loops[0])+loopArrow((xm+xr)/2+(o.lo2||0),cy,22,o.loops[1])}
  return s+'</svg>'}
const fig148=()=>meshFig({src:'E, f',tl:{t:'Z',l:sb('Z','1')},bl:{t:'Z',l:sb('Z','4')},mid:{t:'Z',l:sb('Z','2')},right:{t:'Z',l:sb('Z','3')},nodes:[[110,48,'a'],[300,48,'b'],[470,48,'d'],[300,232,'c'],[470,232,'e']],loops:[sb('i','1'),sb('i','2')],lo1:-10,lo2:-26,aria:'الشكل 1-48'});
const fig149=()=>meshFig({src:'V = 110 V',src2:'f = 60 Hz',it:sb('i','T'),bl:{t:'Z',l:sb('Z','3')+' = 20 Ω∠0°'},mid:{t:'Z',l:sb('Z','1')+' = 10 Ω∠30°'},right:{t:'Z',l:sb('Z','2')+' = 20 Ω∠−20°'},i1:sb('i','1'),i2:sb('i','2'),nodes:[[300,48,'a'],[300,232,'b']],loops:[sb('i','I'),sb('i','II')],lo1:-20,lo2:-30,wr:150,aria:'الشكل 1-49'});
/* chapter-2 problem figures */
const figP1=()=>ladder({src:'220 sin(377t+53.1°) V',x0:190,items:[{s:'ser',t:'R',l:'30 Ω',w:76,gap:30},{s:'ser',t:'L',l:'0.3H',w:76,gap:0},{s:'ser',t:'C',l:'5 µF',w:60,gap:0},{s:'ser',t:'L',l:'0.1H',w:76,gap:0},{s:'sh',t:'R',l:'20 Ω',gap:30}],wr:80,aria:'الشكل 1 من مسائل الفصل الثاني'});
const figP2=()=>ladder({src:'50∠0° V',items:[{s:'ser',t:'R',l:'8 Ω',w:76,gap:20},{s:'node',vm:sb('V','1')},{s:'ser',t:'L',l:'17 Ω',w:80,gap:34},{s:'node',vm:sb('V','2')},{s:'ser',t:'R',l:'12 Ω',w:76,gap:34},{s:'sh',t:'C',l:'15 Ω',gap:40}],wr:80,aria:'الشكل 2 من مسائل الفصل الثاني'});
const figP3=()=>parFig({src:'V',br:[{t:'R',l:'3 Ω'},{t:'L',l:'5 mH'},{t:'C',l:'900 µF'},{t:'C',l:'1100 µF'}],first:90,sp:110,wr:100,aria:'الشكل 3 من مسائل الفصل الثاني'}).replace('</svg>',arrow(140,50,176,50,'--stop',1.8)+S.t(124,36,'10 sin(377t−53.1°) A','','start')+'</svg>');
const figP4a=()=>divFig({iin:'8∠40° A',top:[{t:'R',l:'4 Ω'},{t:'L',l:'7 Ω'}],bot:[{t:'R',l:'9 Ω'},{t:'C',l:'10 Ω'}]});
const figP4b=()=>divFig({iin:'5∠20° A',top:[{t:'R',l:'20 Ω'}],bot:[{t:'L',l:'10 Ω'},{t:'C',l:'30 Ω'}]});
const figP5=()=>fig146({loops:[{x:187,y:150,lab:'I'},{x:345,y:150,lab:'II'}]});
function figP6(){let s=svgO(560,260,'الشكل 6 من مسائل الفصل الثاني');const xl=140,xm=320,xr=480,yc=40,ym=110,yb=230;
  s+=wire([[xl,yc],[xl,ym]])+comp('C',xl,yc,xr,yc,{l:'55 Ω'})+wire([[xr,yc],[xr,yb]])+comp('R',xl,ym,xm,ym,{l:'45 Ω'})+comp('R',xm,ym,xr,ym,{l:'65 Ω'})+comp('L',xm,ym,xm,yb,{l:'85 Ω',side:1});
  s+=comp('V',xl,yb,xl,ym,{l:'50∠0° V',side:-1})+wire([[xl,yb],[xr,yb]])+dot(xl,ym)+dot(xm,ym)+dot(xr,ym)+dot(xm,yb);
  s+=S.t(xm-12,ym+26,'+','','end')+S.t(xm-12,(ym+yb)/2+4,sb('V','L'),'b','end')+S.t(xm-12,yb-8,'−','','end')+cur(225,yb,'l',sb('I','1'),{below:true});return s+'</svg>'}

/* ---- solvers ---- */
const SQ2=Math.SQRT2;
function meshSolve(ZL,ZM,ZR,E1,E2){const Z11=cadd(ZL,ZM),Z22=cadd(ZM,ZR),det=csub(cmul(Z11,Z22),cmul(ZM,ZM)),D1=cadd(cmul(E1,Z22),cmul(ZM,E2)),D2=cadd(cmul(Z11,E2),cmul(ZM,E1));
  const Ia=cdiv(D1,det),Ib=cdiv(D2,det);return {Z11,Z22,det,D1,D2,Ia,Ib,Im:csub(Ia,Ib)}}
function mesh15(g,book){const Z1=cpol(g.m1,g.a1),Z2=cpol(g.m2,g.a2),Z3=cpol(g.m3,g.a3);
  const r2=z=>Cx(RD(z.re,2),RD(z.im,2));const Z11=r2(cadd(Z1,Z3)),Z22=r2(cadd(Z1,Z2)),m11=RD(cabs(Z11),2),a11=RD(cang(Z11),2),m22=RD(cabs(Z22),2),a22=Math.sign(cang(Z22))*RD(RD(Math.abs(cang(Z22)),3),2);
  const pm=RD(m11*m22,2),pa=RD(a11+a22,2),sqm=RD(g.m1*g.m1,2),sqa=RD(2*g.a1,2);const dR=r2(csub(cpol(pm,pa),cpol(sqm,sqa))),dm=RD(cabs(dR),2),daC=RD(cang(dR),2),da=book?0.2:daC;
  const d1m=RD(g.V*m22,2),d1a=a22,d2m=RD(g.V*g.m1,2),d2a=g.a1;
  const Iam=RD(d1m/dm,2),Iaa=RD(d1a-da,2),Ibm=RD(d2m/dm,3),Iba=RD(d2a-da,2);
  const ia=r2(cpol(Iam,Iaa)),ib=r2(cpol(Ibm,Iba)),i1=csub(ia,ib);
  return [
   {t:'نبدأ ببناء مصفوفة المعاوقات وهي مصفوفة مربعة (2×2) متماثلة حول قطرها:',f:`[Z] = \\begin{bmatrix} (Z_1 + Z_3) & (-Z_1) \\\\ (-Z_1) & (Z_1 + Z_2) \\end{bmatrix}`},
   {t:'مكونات القطر:',f:`(Z_1 + Z_3) = (${PZ(g.m1,g.a1,2,2)}) + (${PZ(g.m3,g.a3,2,2)}) = ${RZ(Z11,2)} = ${PZ(m11,a11,2,2)}\\ \\Omega`},
   {f:`(Z_1 + Z_2) = (${PZ(g.m1,g.a1,2,2)}) + (${PZ(g.m2,g.a2,2,2)}) = ${RZ(Z22,2)} = ${PZ(m22,a22,2,2)}\\ \\Omega`},
   {t:'النظام الكامل للمعادلات \\([Z][I] = [V]\\):',f:`\\begin{bmatrix} ${PZ(m11,a11,2,2)} & -${PZ(g.m1,g.a1,2,2)} \\\\ -${PZ(g.m1,g.a1,2,2)} & ${PZ(m22,a22,2,2)} \\end{bmatrix}\\begin{bmatrix} I_I \\\\ I_{II} \\end{bmatrix} = \\begin{bmatrix} ${PZ(g.V,0,2,0)} \\\\ 0\\angle 0^\\circ \\end{bmatrix}`},
   {t:'المحددة الرئيسة للمصفوفة:',f:`|Z| = (${PZ(m11,a11,2,2)})(${PZ(m22,a22,2,2)}) - (-${PZ(g.m1,g.a1,2,2)})(-${PZ(g.m1,g.a1,2,2)}) = ${PZ(pm,pa,2,2)} - ${PZ(sqm,sqa,2,2)}`},
   {f:`|Z| = ${RZ(dR,2)} = ${PZ(dm,da,2,2)}`,final:true},
   book?{t:`<b>ملاحظة على الكتاب:</b> الجزء التخيلي سالب (\\(-j${f1(Math.abs(dR.im),2)}\\)) فالزاوية \\(${f1(daC,2)}^\\circ\\) وليست \\(+0.2^\\circ\\) كما طُبع. نكمل بقيمة الكتاب لنصل إلى نتائجه المطبوعة؛ قارن بالحل المصحح أدناه.`}:null,
   {t:'المحددتان الفرعيتان (نستبدل العمود x بمتجه الجهود):',f:`|Z|_1 = \\begin{vmatrix} ${PZ(g.V,0,2,0)} & -${PZ(g.m1,g.a1,2,2)} \\\\ 0\\angle 0^\\circ & ${PZ(m22,a22,2,2)} \\end{vmatrix} = ${PZ(d1m,d1a,2,2)}`},
   {f:`|Z|_2 = \\begin{vmatrix} ${PZ(m11,a11,2,2)} & ${PZ(g.V,0,2,0)} \\\\ -${PZ(g.m1,g.a1,2,2)} & 0\\angle 0^\\circ \\end{vmatrix} = ${PZ(d2m,d2a,2,2)}`},
   {t:'التياران الدواران:',f:`I_I = \\frac{|Z|_1}{|Z|} = \\frac{${PZ(d1m,d1a,2,2)}}{${PZ(dm,da,2,2)}} = ${PZ(Iam,Iaa,2,2)}\\ \\text{A}`,final:true},
   {f:`I_{II} = \\frac{|Z|_2}{|Z|} = \\frac{${PZ(d2m,d2a,2,2)}}{${PZ(dm,da,2,2)}} = ${PZ(Ibm,Iba,3,2)}\\ \\text{A}`,final:true},
   {t:'التيار في الفرع ab (يمر فيه التياران متعاكسين):',f:`I_1 = I_I - I_{II} = (${PZ(Iam,Iaa,2,2)}) - (${PZ(Ibm,Iba,3,2)}) = ${RZ(i1,2)} = ${PZc(i1,2,1)}\\ \\text{A}`,final:true}
  ].filter(Boolean)}
const G1215=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:110},{id:'m1',label:'مقدار Z₁ (الفرع ab)',sym:'|Z_1|',unit:'Ω',value:10},{id:'a1',label:'زاوية Z₁',sym:'\\theta_1',unit:'°',value:30},{id:'m2',label:'مقدار Z₂ (الضلع الأيمن)',sym:'|Z_2|',unit:'Ω',value:20},{id:'a2',label:'زاوية Z₂',sym:'\\theta_2',unit:'°',value:-20},{id:'m3',label:'مقدار Z₃ (الخط السفلي)',sym:'|Z_3|',unit:'Ω',value:20},{id:'a3',label:'زاوية Z₃',sym:'\\theta_3',unit:'°',value:0}];

/* chapter-2 problems: exact calculation, shown to 2 decimals */
function pr1(g,cosv){const I=cpol(g.Im/SQ2,g.thi),thv=cosv?g.thv+90:g.thv,V=cpol(g.Vm/SQ2,thv),Z=cdiv(V,I);
  return [cosv?{t:'نكتب الجهد بدالة الجيب: \\(\\cos x = \\sin(x + 90^\\circ)\\)',f:`v(t) = ${f1(g.Vm)}\\cos(${f1(g.w,0)}t ${g.thv<0?'-':'+'} ${f1(Math.abs(g.thv))}^\\circ) = ${f1(g.Vm)}\\sin(${f1(g.w,0)}t + ${f1(thv)}^\\circ)\\ \\text{V}`}:null,
   {t:'التيار المطاور (القيمة الفعالة = القيمة العظمى ÷ √2):',f:`I = \\frac{${f1(g.Im)}}{\\sqrt2}\\angle ${f1(g.thi)}^\\circ = ${PZc(I,2,1)}\\ \\text{A}`,final:true},
   {t:'الجهد المطاور:',f:`V = \\frac{${f1(g.Vm)}}{\\sqrt2}\\angle ${f1(thv)}^\\circ = ${PZc(V,2,1)}\\ \\text{V}`,final:true},
   {t:'المعاوقة المركبة (قانون أوم 1-25):',f:`Z = \\frac{V}{I} = \\frac{${PZc(V,2,1)}}{${PZc(I,2,1)}} = ${PZc(Z,2,1)} = ${RZ(Z,2)}\\ \\Omega`,final:true},
   Z.re<0?{t:'<b>تنبيه:</b> الجزء الحقيقي سالب، أي أن «الحمل» لا يستهلك قدرة فعالة بل يعطيها (الزاوية بين الجهد والتيار أكبر من 90°). هذا لا يحدث في حمل مكون من R و L و C فقط؛ الأرقام كما طُبعت في المسألة.'}:
    {t:Z.im>0?`الحمل مادي - حثي: الجهد يتقدم على التيار بـ ${lt(f1(cang(Z),1)+'°')}. لو كانت \\(\\omega = ${f1(g.w,0)}\\) فإن \\(L = X/\\omega = ${f1(Z.im/g.w*1000,2)}\\) mH.`:Z.im<0?'الحمل مادي - سعوي: التيار يتقدم على الجهد.':'الحمل مادي بحت.'}].filter(Boolean)}
const GP1=[{id:'Im',label:'القيمة العظمى للتيار',sym:'I_m',unit:'A',value:6},{id:'thi',label:'زاوية التيار',sym:'\\theta_i',unit:'°',value:30},{id:'Vm',label:'القيمة العظمى للجهد',sym:'V_m',unit:'V',value:220},{id:'thv',label:'زاوية الجهد',sym:'\\theta_v',unit:'°',value:60},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377}];
const GP2=[{id:'Im',label:'القيمة العظمى للتيار (sin)',sym:'I_m',unit:'A',value:10},{id:'thi',label:'زاوية التيار',sym:'\\theta_i',unit:'°',value:0},{id:'Vm',label:'القيمة العظمى للجهد (cos)',sym:'V_m',unit:'V',value:380},{id:'thv',label:'زاوية الجهد داخل cos',sym:'\\theta',unit:'°',value:60},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377}];
function pr3calc(g){const w=g.w,XL1=w*g.L1,XC=1/(w*g.C*1e-6),XL2=w*g.L2,R=g.R1+g.R2,X=XL1+XL2-XC,Z=Cx(R,X),V=cpol(g.Vm/SQ2,g.th),I=cdiv(V,Z);return {XL1,XC,XL2,R,X,Z,V,I}}
function pr3(g){const r=pr3calc(g),I=r.I,v=(z,n)=>`${n} = ${PZc(cmul(I,z),2,1)}\\ \\text{V}`;
  return [{t:'الممانعات عند \\(\\omega = '+f1(g.w,0)+'\\) rad/s:',f:`X_{L1} = \\omega L_1 = ${f1(r.XL1,2)}\\ \\Omega,\\quad X_C = \\frac{1}{\\omega C} = ${f1(r.XC,2)}\\ \\Omega,\\quad X_{L2} = ${f1(r.XL2,2)}\\ \\Omega`},
   {t:'المعاوقة المكافئة (توالي = جمع):',f:`Z_T = (${f1(g.R1)} + ${f1(g.R2)}) + j(${f1(r.XL1,2)} + ${f1(r.XL2,2)} - ${f1(r.XC,2)}) = ${RZ(r.Z,2)} = ${PZc(r.Z,2,1)}\\ \\Omega`,final:true},
   {t:r.X<0?'الحمل مادي - سعوي (المكثف يغلب الملفين).':'الحمل مادي - حثي.'},
   {t:'الجهد المطاور (قيمة فعالة) والتيار:',f:`V = \\frac{${f1(g.Vm)}}{\\sqrt2}\\angle ${f1(g.th)}^\\circ = ${PZc(r.V,2,1)}\\ \\text{V},\\qquad I = \\frac{V}{Z_T} = ${PZc(I,3,1)}\\ \\text{A}`,final:true},
   {t:'الجهد على كل عنصر \\(V_x = I\\,Z_x\\):',f:`${v(Cx(g.R1),'V_{R1}')},\\quad ${v(Cx(0,r.XL1),'V_{L1}')},\\quad ${v(Cx(0,-r.XC),'V_C')}`},
   {f:`${v(Cx(0,r.XL2),'V_{L2}')},\\quad ${v(Cx(g.R2),'V_{R2}')}`,final:true},
   {t:'للتحقق: مجموع الجهود (بالمتجهات) يساوي جهد المصدر، والجهد على المكثف أكبر من جهد المصدر لأن الملفين يلغيان جزءاً منه.'}]}
const GP3=[{id:'Vm',label:'القيمة العظمى للجهد',sym:'V_m',unit:'V',value:220},{id:'th',label:'زاوية الجهد',sym:'\\theta',unit:'°',value:53.1},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:30},{id:'L1',label:'الملف الأول',sym:'L_1',unit:'H',value:0.3},{id:'C',label:'المكثف',sym:'C',unit:'µF',value:5,min:0.001},{id:'L2',label:'الملف الثاني',sym:'L_2',unit:'H',value:0.1},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:20}];
function pr4(g){const V=Cx(g.V),ZT=Cx(g.R1+g.R2,g.XL-g.XC),Z1=Cx(g.R2,g.XL-g.XC),Z2=Cx(g.R2,-g.XC),V1=cdiv(cmul(Z1,V),ZT),V2=cdiv(cmul(Z2,V),ZT);
  return [{t:'المعاوقة الكلية (كل العناصر على التوالي):',f:`Z_T = ${f1(g.R1)} + j${f1(g.XL)} + ${f1(g.R2)} - j${f1(g.XC)} = ${RZ(ZT,2)} = ${PZc(ZT,2,2)}\\ \\Omega`},
   {t:'\\(V_1\\) هو الجهد على ما بعد المقاومة الأولى (الملف + المقاومة الثانية + المكثف):',f:`V_1 = \\frac{(j${f1(g.XL)} + ${f1(g.R2)} - j${f1(g.XC)})\\,V}{Z_T} = \\frac{(${PZc(Z1,2,2)})(${PZ(g.V,0,2,0)})}{${PZc(ZT,2,2)}} = ${PZc(V1,2,2)}\\ \\text{V}`,final:true},
   {t:'\\(V_2\\) هو الجهد على المقاومة الثانية والمكثف:',f:`V_2 = \\frac{(${f1(g.R2)} - j${f1(g.XC)})\\,V}{Z_T} = \\frac{(${PZc(Z2,2,2)})(${PZ(g.V,0,2,0)})}{${PZc(ZT,2,2)}} = ${PZc(V2,2,2)}\\ \\text{V}`,final:true}]}
const GP4=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:8},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:17},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:12},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:15}];
function pr5(g){const w=g.w,YR=1/g.R,BL=1/(w*g.L*1e-3),BC1=w*g.C1*1e-6,BC2=w*g.C2*1e-6,Y=Cx(YR,BC1+BC2-BL),I=cpol(g.Im/SQ2,g.th),V=cdiv(I,Y);
  return [{t:'سماحية كل فرع:',f:`\\frac{1}{R} = ${f1(YR,4)},\\quad \\frac{1}{jX_L} = -j${f1(BL,4)},\\quad j\\omega C_1 = j${f1(BC1,4)},\\quad j\\omega C_2 = j${f1(BC2,4)}\\ \\text{S}`},
   {t:'السماحية المكافئة (المعادلة 1-38):',f:`Y_T = ${RZ(Y,4)} = ${PZc(Y,4,2)}\\ \\text{S}`,final:true},
   {t:Y.im>0?'التقبلية موجبة: الحمل مادي - سعوي.':'التقبلية سالبة: الحمل مادي - حثي.'},
   {t:'تيار المصدر المطاور (قيمة فعالة):',f:`I = \\frac{${f1(g.Im)}}{\\sqrt2}\\angle ${f1(g.th)}^\\circ = ${PZc(I,3,1)}\\ \\text{A}`},
   {t:'الجهد المؤثر:',f:`V = \\frac{I}{Y_T} = \\frac{${PZc(I,3,1)}}{${PZc(Y,4,2)}} = ${PZc(V,2,2)}\\ \\text{V}`,final:true},
   {t:'تيارات الفروع \\(I_x = V\\,Y_x\\):',f:`I_R = ${PZc(csc(V,YR),2,1)},\\ I_L = ${PZc(cmul(V,Cx(0,-BL)),2,1)},\\ I_{C1} = ${PZc(cmul(V,Cx(0,BC1)),2,1)},\\ I_{C2} = ${PZc(cmul(V,Cx(0,BC2)),2,1)}\\ \\text{A}`,final:true}]}
const GP5=[{id:'Im',label:'القيمة العظمى لتيار المصدر',sym:'I_m',unit:'A',value:10},{id:'th',label:'زاويته',sym:'\\theta',unit:'°',value:-53.1},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:3,min:0.001},{id:'L',label:'الملف',sym:'L',unit:'mH',value:5,min:0.001},{id:'C1',label:'المكثف الأول',sym:'C_1',unit:'µF',value:900},{id:'C2',label:'المكثف الثاني',sym:'C_2',unit:'µF',value:1100}];
function pr6(g){const It=cpol(g.I,g.th),Z1=Cx(g.R1,g.X1),Z2=Cx(g.R2,g.X2),S2=cadd(Z1,Z2),I1=cdiv(cmul(Z2,It),S2),I2=cdiv(cmul(Z1,It),S2);
  return [{t:'معاوقتا الفرعين:',f:`Z_1 = ${RZ(Z1,2)} = ${PZc(Z1,2,1)}\\ \\Omega,\\quad Z_2 = ${RZ(Z2,2)} = ${PZc(Z2,2,1)}\\ \\Omega,\\quad Z_1 + Z_2 = ${PZc(S2,2,1)}\\ \\Omega`},
   {t:'تيار الفرع العلوي (المعادلة 1-40):',f:`I_1 = \\frac{Z_2\\,I_T}{Z_1 + Z_2} = \\frac{(${PZc(Z2,2,1)})(${PZ(g.I,g.th,2,1)})}{${PZc(S2,2,1)}} = ${PZc(I1,2,1)}\\ \\text{A}`,final:true},
   {t:'تيار الفرع السفلي:',f:`I_2 = \\frac{Z_1\\,I_T}{Z_1 + Z_2} = \\frac{(${PZc(Z1,2,1)})(${PZ(g.I,g.th,2,1)})}{${PZc(S2,2,1)}} = ${PZc(I2,2,1)}\\ \\text{A}`,final:true},
   {t:'تحقق:',f:`I_1 + I_2 = ${PZc(cadd(I1,I2),2,1)}\\ \\text{A} = I_T`}]}
const GP6a=[{id:'I',label:'التيار الداخل',sym:'I_T',unit:'A',value:8},{id:'th',label:'زاويته',sym:'\\theta',unit:'°',value:40},{id:'R1',label:'مقاومة الفرع العلوي',sym:'R_1',unit:'Ω',value:4},{id:'X1',label:'ممانعة الفرع العلوي (+ حثية، − سعوية)',sym:'X_1',unit:'Ω',value:7},{id:'R2',label:'مقاومة الفرع السفلي',sym:'R_2',unit:'Ω',value:9},{id:'X2',label:'ممانعة الفرع السفلي (+ حثية، − سعوية)',sym:'X_2',unit:'Ω',value:-10}];
const GP6b=[{id:'I',label:'التيار الداخل',sym:'I_T',unit:'A',value:5},{id:'th',label:'زاويته',sym:'\\theta',unit:'°',value:20},{id:'R1',label:'مقاومة الفرع العلوي',sym:'R_1',unit:'Ω',value:20},{id:'X1',label:'ممانعة الفرع العلوي (+ حثية، − سعوية)',sym:'X_1',unit:'Ω',value:0},{id:'R2',label:'مقاومة الفرع السفلي',sym:'R_2',unit:'Ω',value:0},{id:'X2',label:'ممانعة الفرع السفلي: 10 − 30',sym:'X_2',unit:'Ω',value:-20}];
function pr7(g){const ZL=Cx(g.R1,g.X1),ZM=Cx(g.R2,-g.XC),ZR=Cx(g.R3,g.XL),r=meshSolve(ZL,ZM,ZR,Cx(g.V),Cx(0));
  return [{t:'التياران الدواران I (يسار) و II (يمين) مع عقارب الساعة. مصفوفة المعاوقات:',f:`[Z] = \\begin{bmatrix} ${RZ(r.Z11,2)} & -(${RZ(ZM,2)}) \\\\ -(${RZ(ZM,2)}) & ${RZ(r.Z22,2)} \\end{bmatrix},\\quad [V] = \\begin{bmatrix} ${f1(g.V)} \\\\ 0 \\end{bmatrix}`},
   {t:'المحددة الرئيسة:',f:`|Z| = (${RZ(r.Z11,2)})(${RZ(r.Z22,2)}) - (${RZ(ZM,2)})^2 = ${RZ(r.det,2)} = ${PZc(r.det,2,2)}`},
   {t:'المحددتان الفرعيتان:',f:`|Z|_1 = ${f1(g.V)}\\,(${RZ(r.Z22,2)}) = ${PZc(r.D1,2,2)},\\qquad |Z|_2 = ${f1(g.V)}\\,(${RZ(ZM,2)}) = ${PZc(r.D2,2,2)}`},
   {t:'التيارات:',f:`I_T = I_I = ${PZc(r.Ia,2,1)}\\ \\text{A},\\qquad I_2 = I_{II} = ${PZc(r.Ib,2,1)}\\ \\text{A}`,final:true},
   {f:`I_1 = I_I - I_{II} = ${PZc(r.Im,2,1)}\\ \\text{A}`,final:true},
   {t:'هي نفسها نتائج المثال (1-2-14) المصححة: الطريقتان تعطيان النتيجة نفسها.'}]}
const GP7=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:100},{id:'R1',label:'مقاومة الخط',sym:'R',unit:'Ω',value:2},{id:'X1',label:'ملف الخط',sym:'X_{L}',unit:'Ω',value:3},{id:'R2',label:'مقاومة الفرع الأوسط',sym:'R_m',unit:'Ω',value:9},{id:'XC',label:'مكثف الفرع الأوسط',sym:'X_C',unit:'Ω',value:7},{id:'XL',label:'ملف الفرع الأيمن',sym:'X_{L2}',unit:'Ω',value:5},{id:'R3',label:'مقاومة الضلع الأيمن',sym:'R_3',unit:'Ω',value:6}];
function pr8calc(g){const V=Cx(g.V),ZC=Cx(0,-g.XC),Zp=cpar(Cx(0,g.XL),Cx(g.R2)),Zs=cadd(Cx(g.R1),Zp),IC=cdiv(V,ZC),Is=cdiv(V,Zs),VL=cmul(Is,Zp),It=cadd(IC,Is);return {Zp,Zs,IC,Is,VL,It}}
function pr8(g){const r=pr8calc(g);
  return [{t:'نقرأ الرسم: الضلع الأيمن متصل بالخط السفلي مباشرة، فالمكثف (55 Ω) موصول بين طرفي المصدر، والملف (85 Ω) والمقاومة (65 Ω) على التوازي بين العقدة الوسطى والخط السفلي.'},
   {t:'معاوقة الملف مع المقاومة 65 Ω على التوازي:',f:`Z_p = \\frac{(j${f1(g.XL)})(${f1(g.R2)})}{${f1(g.R2)} + j${f1(g.XL)}} = ${RZ(r.Zp,2)} = ${PZc(r.Zp,2,1)}\\ \\Omega`},
   {t:'معاوقة الفرع المار بالمقاومة 45 Ω:',f:`Z_s = ${f1(g.R1)} + Z_p = ${RZ(r.Zs,2)} = ${PZc(r.Zs,2,1)}\\ \\Omega,\\qquad I_{45} = \\frac{V}{Z_s} = ${PZc(r.Is,3,1)}\\ \\text{A}`},
   {t:'جهد الملف:',f:`V_L = I_{45}\\,Z_p = ${PZc(r.VL,2,1)}\\ \\text{V}`,final:true},
   {t:'تيار المكثف:',f:`I_C = \\frac{V}{-j${f1(g.XC)}} = ${PZc(r.IC,3,1)}\\ \\text{A}`},
   {t:'\\(I_1\\) على الخط السفلي بين الملف والمصدر هو تيار المصدر الكلي:',f:`I_1 = I_C + I_{45} = ${PZc(r.It,3,1)}\\ \\text{A}`,final:true}]}
const GP8=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'R1',label:'المقاومة الأفقية الأولى',sym:'R_1',unit:'Ω',value:45},{id:'XL',label:'ممانعة الملف',sym:'X_L',unit:'Ω',value:85},{id:'R2',label:'المقاومة الأفقية الثانية',sym:'R_2',unit:'Ω',value:65},{id:'XC',label:'ممانعة المكثف',sym:'X_C',unit:'Ω',value:55,min:0.01}];
const gv=G=>Object.fromEntries(G.map(x=>[x.id,x.value]));
/* problem block in the theory tab: statement + redrawn figure + suggested answer */
const PB=(n,q,fig,ans,ref)=>({html:`<p><b>${n}</b> ${q}</p>${fig||''}<details class="cb-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div class="cb-ans">${ans}</div></details>`});

B.lesson({
 id:'u1-l11',unit:1,order:11,pages:'55–62',
 title:'قوانين كيرشوف وطريقة الحلقة المغلقة (المصفوفات والمحددات) + مسائل الفصل الثاني',
 summary:'نكتب قانون كيرشوف للجهد لكل حلقة مغلقة بتيار دوار خاص بها، فنحصل على نظام معادلات [Z][I] = [V] نحله بالمحددات (طريقة كرامر). مع المثال (1-2-15) ومسائل الفصل الثاني الثماني بإجابات مقترحة.',
 stations:[
  {intro:true},

  {st:1,short:'طريقة الحلقة المغلقة',title:'قوانين كيرشوف في دوائر التيار المتردد: طريقة الحلقة المغلقة',ref:'ص 55–56',
   q:'فرع مشترك بين حلقتين، ولكل حلقة تيارها الدوار: أي تيار يمر في هذا الفرع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-48: دائرة بحلقتين، فيها تياران دواران i1 و i2 مع عقارب الساعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M45 85 L45 147.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 183.0 L45 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="مصدر الجهد المتردد ⟦E⟧ بتردد ⟦f⟧."><circle cx="45" cy="165.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 165.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="49" y="271" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">E, f</text><rect x="21" y="141.0" width="48" height="48" rx="6" fill="transparent"/></g><g data-tip="⟦Z1⟧ بين ⟦a⟧ و⟦b⟧: يمر فيها ⟦i1⟧ فقط."><path d="M45 85 L95.5 85" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M139.5 85 L190 85" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="95.5" y="74" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="117.5" y="67" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="87.5" y="51" width="60" height="50" rx="6" fill="transparent"/></g><path d="M190 85 L315 85" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦Z4⟧ على الخط السفلي: يمر فيها ⟦i1⟧ فقط."><path d="M45 245 L95.5 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M139.5 245 L190 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="95.5" y="234" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="117.5" y="225" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">4</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="87.5" y="229" width="60" height="50" rx="6" fill="transparent"/></g><path d="M190 245 L315 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦Z2⟧ الفرع المشترك بين الحلقتين ⟦b–c⟧: يمر فيها ⟦i1 − i2⟧."><path d="M190 85 L190 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M190 187.0 L190 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="179" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="173" y="185.0" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="115" y="105" width="90" height="120" rx="6" fill="transparent"/></g><g data-tip="⟦Z3⟧ على الضلع الأيمن ⟦d–e⟧: يمر فيها ⟦i2⟧ فقط."><path d="M315 85 L315 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M315 187.0 L315 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="304" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="298" y="185.0" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="235" y="105" width="95" height="120" rx="6" fill="transparent"/></g><circle cx="190" cy="85" r="4.5" fill="#2C4A40"/><circle cx="190" cy="245" r="4.5" fill="#2C4A40"/><text x="45" y="74" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">a</text><text x="190" y="74" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">b</text><text x="315" y="74" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">d</text><text x="178" y="262" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">c</text><text x="328" y="262" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">e</text><g data-tip="التيار الدوار ⟦i1⟧ للحلقة ⟦abc⟧ (الدائرة رقم 1)، مع عقارب الساعة."><path d="M102.9 143.2 A24 24 0 1 1 133.7 157.6" fill="none" stroke="#3B6FB6" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><polygon points="126.2,160.3 132.2,153.4 135.2,161.7" fill="#3B6FB6"/><text x="125.5" y="140.0" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">i<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="93.5" y="105.0" width="64" height="60" rx="6" fill="transparent"/></g><g data-tip="التيار الدوار ⟦i2⟧ للحلقة ⟦bdec⟧ (الدائرة رقم 2)، مع عقارب الساعة."><path d="M219.9 143.2 A24 24 0 1 1 250.7 157.6" fill="none" stroke="#3B6FB6" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><polygon points="243.2,160.3 249.2,153.4 252.2,161.7" fill="#3B6FB6"/><text x="242.5" y="140.0" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">i<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="210.5" y="105.0" width="64" height="60" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-48)</span>: دائرة بحلقتين، لكل حلقة تيار دوار مع عقارب الساعة.<br><b>مرّر المؤشر على المعاوقات الأربع والسهمين الدائريين والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`ما التيار المار في المعاوقة المشتركة \(Z_2\)؟`,opts:[
     [String.raw`\(i_1+i_2\)`,false,String.raw`التياران يمران في \(Z_2\) باتجاهين متعاكسين (كلاهما مع عقارب الساعة في حلقته)، فيُطرحان.`],
     [String.raw`\(i_1-i_2\)`,true,String.raw`نص الكتاب: «أما المعاوقة \(Z_2\) فيمر فيها التيار \(i_1-i_2\)».`],
     [String.raw`\(i_2\) فقط`,false,String.raw`\(i_2\) وحده يمر في \(Z_3\)؛ أما \(Z_2\) فمشتركة بين الحلقتين.`]]}}
   ],
   body:[
    {book:String.raw`<p>لحل مسائل التيار المتردد نستخدم جميع قوانين التيار المستمر بما فيها قوانين كيرشوف للتيار وللجهد شريطة أن نستعمل <b>المعاوقة المركبة</b> مكان المقاومة وأن نعبر عن التيار والجهد عن طريق <b>متجهات</b>. وفيما يلي نشرح إحدى الطرق المستخدمة وهي <b>طريقة الحلقة المغلقة</b> <span class="ltr">(Closed Loop (Mesh) Method)</span>.</p>
     <p>تعتمد طريقة الحلقة المغلقة على قانوني كيرشوف للتيارات والجهود، حيث يُرتَّب قانون كيرشوف في نظام معادلات خطية على طريقة المصفوفات، ونجعل تياراً دواراً لكل دائرة كهربائية مغلقة.</p>`,ref:'ص 55'},
    {book:String.raw`<p>من شكل (1-48) يمكن اعتبار التيار الدوار \(i_1\) هو التيار الخاص بالدائرة المغلقة abc (الدائرة رقم 1)، والتيار \(i_2\) هو التيار الخاص بالدائرة المغلقة bdec (الدائرة رقم 2). ويكون التيار المار في كل من المعاوقتين \(Z_1\) و\(Z_4\) هو \(i_1\)، والتيار المار في \(Z_3\) هو \(i_2\)، أما المعاوقة \(Z_2\) فيمر فيها التيار \(i_1 - i_2\). ويمكن كتابة قوانين كيرشوف كالتالي:</p>
     <p>بالنسبة للدائرة abc (رقم 1):</p>
     <div class="eq">$$E = i_1(Z_1+Z_4)+(i_1-i_2)Z_2\ \Rightarrow\ E = i_1(Z_1+Z_4+Z_2)-i_2 Z_2$$<span class="eqno">(1)</span></div>
     <p>بالنسبة للدائرة bdec (رقم 2):</p>
     <div class="eq">$$0 = i_2 Z_3-(i_1-i_2)Z_2\ \Rightarrow\ 0 = -i_1 Z_2+i_2(Z_2+Z_3)$$<span class="eqno">(2)</span></div>
     <p>ويمكن ترتيب المعادلتين 1 و2 على صورة نظام معادلات خطية من الدرجة الأولى:</p>
     $$\begin{bmatrix} (Z_1+Z_4+Z_2) & -Z_2 \\ -Z_2 & (Z_2+Z_3) \end{bmatrix}\begin{bmatrix} i_1 \\ i_2 \end{bmatrix}=\begin{bmatrix} E \\ 0 \end{bmatrix}$$`,ref:'ص 55–56'},
    {tip:String.raw`<p>نمشي حول الحلقة 1 مع اتجاه \(i_1\): جهد المصدر \(E\) = مجموع هبوط الجهد على معاوقات الحلقة. في \(Z_1\) و\(Z_4\) الهبوط \(i_1Z_1\) و\(i_1Z_4\)، وفي \(Z_2\) الهبوط \((i_1-i_2)Z_2\) لأن التيار الحقيقي فيها هو الفرق.</p>
     <p>والحلقة 2 ليس فيها مصدر، فالطرف الأيسر صفر.</p>`,title:'كيف كُتبت المعادلة (1)؟'},
    {watch:String.raw`<p>التيار الدوار ليس دائماً تيار فرع حقيقي: هو تيار حقيقي فقط في الفروع التي لا يشاركه فيها تيار آخر (\(Z_1\) و\(Z_4\) للحلقة 1). أما في الفرع المشترك فالتيار الحقيقي هو المحصلة \(i_1-i_2\).</p>`},
    {title:'مختبر مصغّر: أي تيار يمر في هذه المعاوقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'في الشكل <span class="ltr">(1-48)</span>: لكل معاوقة اضغط التيار الذي يمر فيها.',cats:['i<sub>1</sub>','i<sub>2</sub>','i<sub>1</sub> − i<sub>2</sub>'],items:[
     ['\\(Z_1\\)',0,'\\(Z_1\\) في الحلقة abc وحدها.'],
     ['\\(Z_2\\)',2,'مشتركة بين الحلقتين، والتياران يمران فيها باتجاهين متعاكسين.'],
     ['\\(Z_3\\)',1,'\\(Z_3\\) في الحلقة bdec وحدها.'],
     ['\\(Z_4\\)',0,'الكتاب: «التيار المار في كل من المعاوقتين \\(Z_1\\) و\\(Z_4\\) هو \\(i_1\\)».']]})}
   ]},

  {st:2,short:'ملاحظات على النظام',title:'ملاحظات على نظام المعادلات <span class="ltr">[Z][I] = [V]</span>',ref:'ص 56–57',
   q:'هل يمكن أن نكتب مصفوفة المعاوقات مباشرة من الرسم، دون أن نكتب معادلات كيرشوف كل مرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مصفوفة المعاوقات 2 في 2: عنصرا القطر مجموع معاوقات كل حلقة، والعنصران الآخران سالب المعاوقة المشتركة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="50" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">[Z] [I] = [V]</text><g data-tip="عنصر القطر ⟦Z11⟧: مجموع معاوقات الحلقة رقم 1 كلها، وهو موجب."><rect x="60" y="90" width="112" height="72" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="116.0" y="131.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan>+Z<tspan font-size="10" dy="4">4</tspan><tspan dy="-4">&#8203;</tspan>+Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="60" y="90" width="112" height="72" rx="6" fill="transparent"/></g><g data-tip="عنصر القطر ⟦Z22⟧: مجموع معاوقات الحلقة رقم 2 كلها، وهو موجب."><rect x="180" y="170" width="112" height="72" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="236.0" y="211.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan>+Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="180" y="170" width="112" height="72" rx="6" fill="transparent"/></g><g data-tip="خارج القطر ⟦Z12⟧: سالب المعاوقة المشتركة بين الحلقتين 1 و2."><rect x="180" y="90" width="112" height="72" rx="10" fill="#F4B9A8" stroke="#2C4A40" stroke-width="2.5"/><text x="236.0" y="131.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">−Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="180" y="90" width="112" height="72" rx="6" fill="transparent"/></g><g data-tip="خارج القطر ⟦Z21 = Z12⟧: المصفوفة متماثلة حول قطرها."><rect x="60" y="170" width="112" height="72" rx="10" fill="#F4B9A8" stroke="#2C4A40" stroke-width="2.5"/><text x="116.0" y="211.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">−Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="60" y="170" width="112" height="72" rx="6" fill="transparent"/></g><path d="M52 86 h-8 v160 h8" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M300 86 h8 v160 h-8" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="116.0" y="272" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">1</text><text x="236.0" y="272" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">2</text><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">القطر موجب وخارجه سالب</text></svg>`,
   cap:'مصفوفة المعاوقات لدائرة الشكل <span class="ltr">(1-48)</span>: القطر بالأصفر وخارجه بالأحمر الفاتح.<br><b>مرّر المؤشر على خلايا المصفوفة (أو المسها في الجوال) لتعرف قاعدة كل خلية.</b>',
   side:[
    {predict:{q:'العنصر خارج القطر في مصفوفة المعاوقات هو…',opts:[
     ['مجموع معاوقات الحلقة',false,'هذا عنصر القطر.'],
     ['صفر دائماً',false,'يكون صفراً فقط إذا لم يكن بين الحلقتين معاوقة مشتركة.'],
     ['سالب المعاوقة المشتركة بين الحلقتين',true,String.raw`نص الكتاب: المكونات خارج القطر سالبة، و\(Z_{mn}\) هي المعاوقة المشتركة بين الدائرتين m و n.`]]}}
   ],
   body:[
    {book:String.raw`<ol><li>يمكن التعبير عن هذا النظام بأنه نظام المعادلات الخطية لقانون أوم لدوائر التيار المتردد على الصورة \([Z][I]=[V]\) حيث تسمى \([Z]\) <b>مصفوفة المعاوقات</b> و\([I]\) <b>متجه التيارات</b> و\([V]\) <b>متجه الجهود</b>.</li>
     <li>يكون متجه التيارات \([I]\) في الغالب هو المجهول، وهو يمثل التيارات الدوارة في الدائرة المكونة من k من الدوائر المغلقة.</li>
     <li>مصفوفة المعاوقات مربعة ومتماثلة (k × k)، ومكونات القطر فقط موجبة أما باقي المكونات فسالبة. ومكونات القطر \(Z_{11}, Z_{22}, \ldots, Z_{kk}\) هي مجموع معاوقات الدائرة المغلقة رقم 1 و2 … حتى k: \(Z_{11}=(Z_1+Z_4+Z_2)\) و\(Z_{22}=(Z_2+Z_3)\) حيث k = 2 هنا. أما المكونات خارج القطر \(Z_{mn}\) فهي سالب المعاوقة المشتركة بين الدائرتين m و n، و\(Z_{nm}=Z_{mn}\).</li>
     <li>متجه الجهود \([V]\) مكون من \(V_1, V_2, \ldots, V_k\) حيث \(V_x\) مجموع مصادر الجهد في الدائرة رقم x، والاتجاه الموجب للجهد \(V_x\) هو اتجاه سريان التيار \(i_x\).</li>
     <li>الحل العام \([I]=[Z]^{-1}[V]\). ومن طرق الحل طريقة <b>المحددات</b>:
      <ul><li>نحسب المحددة الرئيسة \(|Z|\) للمصفوفة.</li><li>نحسب المحددة رقم x \(|Z|_x\) بعد استبدال العمود رقم x بمتجه الجهود \([V]\).</li><li>نحسب التيار رقم x: \(i_x=\frac{|Z|_x}{|Z|}\).</li><li>نحسب تيار كل جزء من الدائرة، مع مراعاة الأجزاء التي يسري فيها أكثر من تيار (نأخذ محصلتها).</li></ul></li></ol>`,ref:'ص 56–57'},
    {tip:String.raw`<p>$$\begin{vmatrix} a & b \\ c & d \end{vmatrix}=a\,d-b\,c$$ حاصل ضرب القطر الرئيس ناقص حاصل ضرب القطر الآخر. ومع الأعداد المركبة: الضرب بالصورة القطبية، والطرح بالصورة المتعامدة.</p>
     <p>لدائرة بحلقتين: \(i_1=\frac{|Z|_1}{|Z|}\) حيث \(|Z|_1\) محددة المصفوفة بعد وضع \([V]\) مكان العمود الأول، و\(i_2=\frac{|Z|_2}{|Z|}\) بعد وضعه مكان العمود الثاني.</p>`,title:'محددة مصفوفة 2×2'},
    {watch:String.raw`<p>إشارة الجهد في \([V]\): يكون جهد المصدر موجباً إذا كان يدفع التيار في اتجاه التيار الدوار للحلقة، وسالباً إذا كان يعاكسه. خطأ هذه الإشارة يقلب اتجاه كل التيارات.</p>`},
    {add:String.raw`<p>عدد المعادلات = عدد الحلقات. دائرة بثلاث حلقات تعطي مصفوفة 3×3 بالقواعد نفسها؛ وهنا تظهر فائدة الطريقة: تكتب المصفوفة من الرسم مباشرة، ثم تحلها بالآلة الحاسبة أو بالحاسب.</p>`},
    {title:'تحقق سريع: مصفوفة المعاوقات',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب ملاحظات الكتاب (ص <span class="ltr">56–57</span>).',items:[
     ['عناصر القطر في مصفوفة المعاوقات موجبة، وكل منها مجموع معاوقات حلقة.',true,'مثل \\(Z_{11}=Z_1+Z_4+Z_2\\).'],
     ['\\(Z_{12}\\) لا تساوي \\(Z_{21}\\) في العادة.',false,'المصفوفة متماثلة: \\(Z_{nm}=Z_{mn}\\).'],
     ['في طريقة المحددات نضع متجه الجهود مكان العمود x لنحسب \\(|Z|_x\\).',true,'ثم \\(i_x=|Z|_x/|Z|\\).'],
     ['الاتجاه الموجب لجهد المصدر في الحلقة x هو اتجاه سريان التيار الدوار \\(i_x\\).',true,'هذا نص الملاحظة 4.']]})}
   ]},

  {st:3,short:'مثال <span class="ltr">(1-2-15)</span>',title:'مثال <span class="ltr">(1-2-15)</span>: التيار في الفرع ab بطريقة الحلقة المغلقة',ref:'ص 58–60',
   q:'المطلوب تيار فرع واحد مشترك بين حلقتين: هل يكفي أن نحسب أحد التيارين الدوارين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-49: مصدر 110 فولت، و Z1 في الفرع ab، و Z2 على الضلع الأيمن، و Z3 على الخط السفلي الأيسر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M45 85 L45 147.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 183.0 L45 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦110 V⟧ بتردد ⟦60 Hz⟧."><circle cx="45" cy="165.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 165.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="49" y="271" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">110 V</text><text x="49" y="287" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">60 Hz</text><rect x="21" y="141.0" width="48" height="48" rx="6" fill="transparent"/></g><path d="M45 85 L190 85" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M190 85 L315 85" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦Z3 = 20 Ω∠0°⟧ على الخط السفلي الأيسر: يمر فيها ⟦iI⟧ فقط."><path d="M45 245 L95.5 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M139.5 245 L190 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="95.5" y="234" width="44" height="22" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="117.5" y="225" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan> = 20∠0°</text><rect x="87.5" y="229" width="60" height="50" rx="6" fill="transparent"/></g><path d="M190 245 L315 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦Z1 = 10 Ω∠30°⟧ في الفرع ⟦ab⟧ المشترك: تياره ⟦i1 = iI − iII⟧، وهو المطلوب."><path d="M190 85 L190 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M190 187.0 L190 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="179" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="173" y="185.0" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><text x="173" y="201.0" text-anchor="end" font-size="11" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">10∠30°</text><rect x="115" y="105" width="90" height="120" rx="6" fill="transparent"/></g><g data-tip="⟦Z2 = 20 Ω∠−20°⟧ على الضلع الأيمن: يمر فيها ⟦iII⟧ فقط."><path d="M315 85 L315 143.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M315 187.0 L315 245" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><rect x="304" y="143.0" width="22" height="44" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="298" y="185.0" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><text x="298" y="201.0" text-anchor="end" font-size="11" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">20∠−20°</text><rect x="235" y="105" width="95" height="120" rx="6" fill="transparent"/></g><circle cx="190" cy="85" r="4.5" fill="#2C4A40"/><circle cx="190" cy="245" r="4.5" fill="#2C4A40"/><text x="190" y="74" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">a</text><text x="178" y="262" text-anchor="middle" font-size="13" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">b</text><g data-tip="التيار الدوار ⟦iI⟧ للحلقة اليسرى."><path d="M102.9 143.2 A24 24 0 1 1 133.7 157.6" fill="none" stroke="#3B6FB6" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><polygon points="126.2,160.3 132.2,153.4 135.2,161.7" fill="#3B6FB6"/><text x="125.5" y="140.0" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">i<tspan font-size="10" dy="4">I</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="93.5" y="105.0" width="64" height="60" rx="6" fill="transparent"/></g><g data-tip="التيار الدوار ⟦iII⟧ للحلقة اليمنى."><path d="M219.9 143.2 A24 24 0 1 1 250.7 157.6" fill="none" stroke="#3B6FB6" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><polygon points="243.2,160.3 249.2,153.4 252.2,161.7" fill="#3B6FB6"/><text x="242.5" y="140.0" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">i<tspan font-size="10" dy="4">II</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="210.5" y="105.0" width="64" height="60" rx="6" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(1-49)</span>: الفرع ab في الوسط مشترك بين الحلقتين.<br><b>مرّر المؤشر على المعاوقات الثلاث والسهمين الدائريين والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`ما العنصر خارج القطر في مصفوفة هذا المثال؟`,opts:[
     [String.raw`\(-Z_1\)`,true,String.raw`\(Z_1\) هي المعاوقة المشتركة بين الحلقتين (الفرع ab)، فخارج القطر \(-Z_1\).`],
     [String.raw`\(-Z_3\)`,false,String.raw`\(Z_3\) في الحلقة اليسرى وحدها.`],
     [String.raw`\(Z_1+Z_2\)`,false,'هذا عنصر القطر الثاني (مجموع معاوقات الحلقة اليمنى).']]}}
   ],
   body:[
    {book:String.raw`<p>في الدائرة المبينة بشكل (1-49) احسب التيار في الفرع ab بطريقة الحلقة المغلقة (ماكسويل).</p>
     <p><b>الحل:</b> الدائرة تتكون من دائرتين مغلقتين، فنفترض تيارين دوارين \(i_I\) و\(i_{II}\).</p>
     $$[Z]=\begin{bmatrix} (Z_1+Z_3) & (-Z_1) \\ (-Z_1) & (Z_1+Z_2) \end{bmatrix}$$
     $$(Z_1+Z_3)=(10\angle 30^\circ)+(20\angle 0^\circ)=28.66+j5=29.09\angle 9.9^\circ\ \Omega$$
     $$(Z_1+Z_2)=(10\angle 30^\circ)+(20\angle -20^\circ)=27.45-j1.84=27.51\angle -3.84^\circ\ \Omega$$
     $$\begin{bmatrix} 29.09\angle 9.9^\circ & -10\angle 30^\circ \\ -10\angle 30^\circ & 27.51\angle -3.84^\circ \end{bmatrix}\begin{bmatrix} i_I \\ i_{II} \end{bmatrix}=\begin{bmatrix} 110\angle 0^\circ \\ 0\angle 0^\circ \end{bmatrix}$$
     $$|Z|=(29.09\angle 9.9^\circ)(27.51\angle -3.84^\circ)-(-10\angle 30^\circ)(-10\angle 30^\circ)$$$$|Z|=800.27\angle 6.06^\circ-100\angle 60^\circ=745.8-j2.12=745.8\angle -0.16^\circ$$
     $$|Z|_1=(110\angle 0^\circ)(27.51\angle -3.84^\circ)-0=3026.1\angle -3.84^\circ$$$$|Z|_2=-(110\angle 0^\circ)(-10\angle 30^\circ)-0=1100\angle 30^\circ$$
     $$i_I=\frac{|Z|_1}{|Z|}=4.06\angle -3.68^\circ\ \text{A}\qquad i_{II}=\frac{|Z|_2}{|Z|}=1.475\angle 30.16^\circ\ \text{A}$$
     $$i_1=i_I-i_{II}=2.77-j1.00=2.94\angle -19.9^\circ\ \text{A}$$
     <p class="sub">زاوية المحددة الرئيسة وما بعدها هنا مصححة؛ انظر «انتبه» أدناه.</p>`,ref:'ص 58–60'},
    {watch:String.raw`<p><b>ملاحظات على الكتاب:</b></p><ol><li>\(745.8-j2.12\) زاويته <b>\(-0.16^\circ\)</b> (سالبة لأن الجزء التخيلي سالب)، وطُبعت \(+0.2^\circ\). لذلك خرجت في الكتاب \(i_I=4.06\angle -4.04^\circ\) و\(i_{II}=1.475\angle 29.8^\circ\) و\(i_1=2.95\angle -20.2^\circ\ \text{A}\). المقدار (<span class="ltr">2.95 A</span> تقريباً) لا يتأثر عملياً؛ الخطأ في الزوايا.</li>
     <li>كُتب \(|Z|\) (رمز المحددة) للمصفوفة نفسها في أحد الأسطر، والمقصود \([Z]\).</li>
     <li>الحلان (كما في الكتاب / المصحح) في تبويب «الأمثلة المحلولة».</li></ol>`,fix:true},
    {tip:String.raw`<p>\(|Z|_2\): نضع \([V]\) مكان العمود الثاني فتصبح المصفوفة \(\begin{bmatrix} 29.09\angle 9.9^\circ & 110\angle 0^\circ \\ -10\angle 30^\circ & 0 \end{bmatrix}\)، ومحددتها \(0-(110\angle 0^\circ)(-10\angle 30^\circ)=1100\angle 30^\circ\).</p>
     <p>والفرع ab هو الفرع المشترك، فتياره محصلة التيارين الدوارين: \(i_1=i_I-i_{II}\). لذلك نحتاج التيارين كليهما.</p>`,title:'من أين جاءت \\(|Z|_2\\) و \\(i_1\\)؟'},
    {title:'مختبر مصغّر: رتّب خطوات الحل بالمحددات',widget:(el,B)=>DCML.order(el,B,{intro:'خطوات حل المثال <span class="ltr">(1-2-15)</span>. اضغطها بالترتيب.',steps:[
     ['اكتب مصفوفة المعاوقات: القطر \\(Z_1+Z_3\\) و \\(Z_1+Z_2\\)، وخارجه \\(-Z_1\\)','كل الحسابات التالية تحتاج المصفوفة.'],
     ['احسب المحددة الرئيسة \\(|Z|\\)','تحتاج المصفوفة أولاً.'],
     ['احسب \\(|Z|_1\\) و \\(|Z|_2\\) بوضع متجه الجهود مكان العمود','تأتي بعد المحددة الرئيسة في ترتيب الكتاب.'],
     ['اقسم: \\(i_I=|Z|_1/|Z|\\) و \\(i_{II}=|Z|_2/|Z|\\)','تحتاج المحددات الثلاث أولاً.'],
     ['تيار الفرع المشترك ab: \\(i_1=i_I-i_{II}\\)','هذه الخطوة الأخيرة: تحتاج التيارين الدوارين.']],done:'\\(i_1\\approx2.94\\angle{-}19.9^\\circ\\ \\text{A}\\) بعد تصحيح زاوية المحددة.'})}
   ]},

  {st:4,short:'مسائل الفصل الثاني',title:'مسائل الفصل الثاني',ref:'ص 61–62',
   q:'ثماني مسائل تراجع الفصل كله. هل تعرف الأداة المناسبة لكل منها قبل أن تبدأ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خريطة لمسائل الفصل الثاني: كل مجموعة مسائل والقانون الذي تحتاجه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أي أداة لأي مسألة؟</text><g data-tip="المسألتان 1 و2: حوّل ⟦i(t)⟧ و⟦v(t)⟧ إلى مطاورين ثم ⟦Z = V/I⟧."><rect x="40" y="66" width="280" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="66" width="58" height="40" rx="10" fill="#2C4A40"/><text x="291" y="91" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1 – 2</text><text x="200" y="83" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">المطاور والمعاوقة</text><text x="150" y="99" text-anchor="middle" font-size="11.5" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">Z = V/I</text><rect x="40" y="66" width="280" height="40" rx="6" fill="transparent"/></g><g data-tip="المسألة 3 دائرة توالٍ، والمسألة 4 بقانون توزيع الجهد."><rect x="40" y="114" width="280" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="114" width="58" height="40" rx="10" fill="#2C4A40"/><text x="291" y="139" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">3 – 4</text><text x="200" y="131" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">التوالي وتوزيع الجهد</text><text x="150" y="147" text-anchor="middle" font-size="11.5" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">x</tspan><tspan dy="-4">&#8203;</tspan> = Z<tspan font-size="10" dy="4">x</tspan><tspan dy="-4">&#8203;</tspan>V/Z<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="40" y="114" width="280" height="40" rx="6" fill="transparent"/></g><g data-tip="المسألة 5: أربعة فروع على التوازي، فاجمع السماحيات."><rect x="40" y="162" width="280" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="162" width="58" height="40" rx="10" fill="#2C4A40"/><text x="291" y="187" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">5</text><text x="200" y="179" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">السماحية</text><text x="150" y="195" text-anchor="middle" font-size="11.5" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">Y<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan> = ΣY</text><rect x="40" y="162" width="280" height="40" rx="6" fill="transparent"/></g><g data-tip="المسألة 6: فرعان في كل دائرة، فاستعمل (1-40)."><rect x="40" y="210" width="280" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="210" width="58" height="40" rx="10" fill="#2C4A40"/><text x="291" y="235" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">6</text><text x="200" y="227" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">توزيع التيار</text><text x="150" y="243" text-anchor="middle" font-size="11.5" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan> = Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan>I<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan>/(Z<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan>+Z<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan>)</text><rect x="40" y="210" width="280" height="40" rx="6" fill="transparent"/></g><g data-tip="المسألة 7 بطريقة الحلقة المغلقة، والمسألة 8 تحتاج قراءة دقيقة للرسم."><rect x="40" y="258" width="280" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="258" width="58" height="40" rx="10" fill="#2C4A40"/><text x="291" y="283" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">7 – 8</text><text x="200" y="275" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">قوانين كيرشوف</text><text x="150" y="291" text-anchor="middle" font-size="11.5" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">[Z][I] = [V]</text><rect x="40" y="258" width="280" height="40" rx="6" fill="transparent"/></g></svg>`,
   cap:'المسائل الثماني والقانون الذي تحتاجه كل مجموعة.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف لأي مسألة هي.</b>',
   side:[
    {predict:{q:String.raw`المسألة 2: الجهد \(v(t)=380\cos(377t+60^\circ)\) والتيار بالجيب. ما أول خطوة؟`,opts:[
     ['نأخذ الزاوية <span class="ltr">60°</span> كما هي',false,'الجهد بجيب التمام والتيار بالجيب: لا تُقارن زاويتاهما مباشرة.'],
     [String.raw`نحوّل جيب التمام إلى جيب: \(\cos(x)=\sin(x+90^\circ)\)`,true,String.raw`فيصبح \(380\sin(377t+150^\circ)\)، ثم نكمل كالمسألة 1.`],
     ['نجعل زاوية الجهد صفراً',false,'نغير الصيغة لا نحذف الزاوية.']]}}
   ],
   body:[
    {book:'<ol>'+['إذا كان التيار المار في حمل معين \\(i(t)=6\\sin(377t+30^\\circ)\\) A، وكان الجهد بين طرفيه \\(v(t)=220\\sin(377t+60^\\circ)\\) V، أوجد التيار المطاور والجهد المطاور وكذلك المعاوقة المركبة للحمل، ثم ارسم الشكل المطاور.','أعد المسألة 1 إذا كان التيار \\(i(t)=10\\sin(377t)\\) A، وكان الجهد \\(v(t)=380\\cos(377t+60^\\circ)\\) V.','احسب المعاوقة المكافئة للدائرة المبينة في الشكل 1 وارسم شكلها، ثم احسب التيار المار في الدائرة والجهد بين طرفي كل عنصر، وارسم الشكل المطاور للتيار والجهود.','احسب الجهدين \\(V_1\\) و\\(V_2\\) في الدائرة المبينة في الشكل 2، وذلك باستعمال قانون توزيع الجهد.','احسب السماحية المكافئة للدائرة المبينة في الشكل 3 وارسم شكلها، ثم احسب الجهد المؤثر وارسم الشكل المطاور للتيارات والجهد المؤثر.','احسب التيار في كل فرع من الدائرتين a و b المبينتين في الشكل 4 باستعمال قانون توزيع التيار.','استعمل قوانين كيرشوف لحساب التيارات في الدائرة المبينة في الشكل 5.','في الدائرة الموضحة في الشكل 6، احسب التيار \\(I_1\\) والجهد \\(V_L\\).'].map(q=>'<li>'+q+'</li>').join('')+'</ol>',ref:'ص 61–62'},
    {tip:String.raw`<p>الكتاب لا يطبع إجابات للمسائل. حاول بنفسك أولاً، ثم افتح الإجابة المقترحة تحت الأشكال. الحل خطوة بخطوة بأرقام قابلة للتغيير في تبويب «الأمثلة المحلولة».</p>`},
    {html:'<div class="cb-figs">'+[[box(figP1(),620),'الشكل 1 (المسألة 3)'],[box(figP2(),560),'الشكل 2 (المسألة 4)'],[box(figP3(),560),'الشكل 3 (المسألة 5)'],[`<div class="cb-figs"><figure>${box(figP4a(),440)}(a)</figure><figure>${box(figP4b(),440)}(b)</figure></div>`,'الشكل 4 (المسألة 6)'],[box(figP5(),540),'الشكل 5 (المسألة 7)'],[box(figP6(),480),'الشكل 6 (المسألة 8)']].map(([f,c])=>'<figure>'+f+'<figcaption>'+c+'</figcaption></figure>').join('')+'</div>'},
    {tip:(()=>[['1',`\\(I = 4.24\\angle 30^\\circ\\) A، \\(V = 155.56\\angle 60^\\circ\\) V، \\(Z = V/I = 36.67\\angle 30^\\circ = 31.75 + j18.33\\ \\Omega\\): حمل مادي - حثي، والجهد يتقدم على التيار بـ 30°.`],['2',`نكتب الجهد بالجيب: \\(380\\cos(377t+60^\\circ)=380\\sin(377t+150^\\circ)\\). إذن \\(I = 7.07\\angle 0^\\circ\\) A و\\(V = 268.7\\angle 150^\\circ\\) V و\\(Z = 38\\angle 150^\\circ = -32.91 + j19\\ \\Omega\\). الجزء الحقيقي سالب: الزاوية بين الجهد والتيار أكبر من 90°، أي أن هذا «الحمل» يعطي قدرة فعالة ولا يستهلكها — لا يمكن أن يتكون من R و L و C فقط. <span class="fixnote">(قد يكون المقصود في الكتاب أرقاماً أخرى؛ هذا حل المسألة كما طُبعت.)</span>`],['3',(()=>{const r=pr3calc(gv(GP3));return `\\(X_{L1}=113.1\\)، \\(X_C=${f1(r.XC,1)}\\)، \\(X_{L2}=37.7\\ \\Omega\\)؛ \\(Z_T=${RZ(r.Z,1)}=${PZc(r.Z,1,1)}\\ \\Omega\\) (مادي - سعوي). \\(V=${PZc(r.V,2,1)}\\) V (قيمة فعالة)، \\(I=${PZc(r.I,3,1)}\\) A. الجهود: \\(V_{30\\Omega}=${PZc(csc(r.I,30),2,1)}\\)، \\(V_{0.3H}=${PZc(cmul(r.I,Cx(0,r.XL1)),2,1)}\\)، \\(V_C=${PZc(cmul(r.I,Cx(0,-r.XC)),2,1)}\\)، \\(V_{0.1H}=${PZc(cmul(r.I,Cx(0,r.XL2)),2,1)}\\)، \\(V_{20\\Omega}=${PZc(csc(r.I,20),2,1)}\\) V.`})()],['4','\\(Z_T = 8 + j17 + 12 - j15 = 20 + j2 = 20.1\\angle 5.71^\\circ\\ \\Omega\\). \\(V_1 = \\frac{(12+j2)\\,50}{20+j2} = 30.27\\angle 3.75^\\circ\\) V، و\\(V_2 = \\frac{(12-j15)\\,50}{20+j2} = 47.79\\angle -57.05^\\circ\\) V.'],['5',(()=>{const g=gv(GP5),w=377,BL=1/(w*0.005),BC=w*0.002,Y=Cx(1/3,BC-BL),V=cdiv(cpol(10/SQ2,-53.1),Y);return `\\(X_L = 1.885\\ \\Omega\\)، \\(X_{C1} = 2.947\\ \\Omega\\)، \\(X_{C2} = 2.411\\ \\Omega\\). \\(Y_T = 0.333 - j0.531 + j0.339 + j0.415 = ${RZ(Y,3)} = ${PZc(Y,3,1)}\\) S (مادي - سعوي). تيار المصدر \\(7.07\\angle -53.1^\\circ\\) A، والجهد \\(V = I/Y_T = ${PZc(V,2,1)}\\) V.`})()],['6',(()=>{const f=(I,th,Z1,Z2)=>{const It=cpol(I,th),S2=cadd(Z1,Z2);return [cdiv(cmul(Z2,It),S2),cdiv(cmul(Z1,It),S2)]};const a=f(8,40,Cx(4,7),Cx(9,-10)),b=f(5,20,Cx(20,0),Cx(0,-20));return `(a) \\(I_1 = \\frac{(9-j10)\\,8\\angle 40^\\circ}{13-j3} = ${PZc(a[0],2,1)}\\) A، \\(I_2 = \\frac{(4+j7)\\,8\\angle 40^\\circ}{13-j3} = ${PZc(a[1],2,1)}\\) A. (b) الفرع السفلي \\(j10 - j30 = -j20\\ \\Omega\\): \\(I_{20\\Omega} = ${PZc(b[0],2,1)}\\) A، \\(I_{LC} = ${PZc(b[1],2,1)}\\) A.`})()],['7',(()=>{const r=meshSolve(Cx(2,3),Cx(9,-7),Cx(6,5),Cx(100),Cx(0));return `\\(Z_{11} = (2+j3)+(9-j7) = 11 - j4\\)، \\(Z_{22} = (9-j7)+(6+j5) = 15 - j2\\)، والمشتركة \\(9 - j7\\). \\(|Z| = ${RZ(r.det,1)}\\)، فنحصل على \\(I_T = I_I = ${PZc(r.Ia,2,1)}\\) A، \\(I_2 = I_{II} = ${PZc(r.Ib,2,1)}\\) A، \\(I_1 = I_I - I_{II} = ${PZc(r.Im,2,1)}\\) A — وهي نتائج المثال (1-2-14) المصححة.`})()],['8',(()=>{const r=pr8calc(gv(GP8));return `الضلع الأيمن موصول بالخط السفلي، فالمكثف 55 Ω بين طرفي المصدر مباشرة، والملف 85 Ω والمقاومة 65 Ω على التوازي: \\(Z_p = ${PZc(r.Zp,2,1)}\\ \\Omega\\). تيار المقاومة 45 Ω: \\(${PZc(r.Is,3,1)}\\) A، ومنه \\(V_L = ${PZc(r.VL,2,1)}\\) V. تيار المكثف \\(${PZc(r.IC,3,1)}\\) A. و\\(I_1\\) على الخط السفلي بين الملف والمصدر هو تيار المصدر: \\(I_1 = ${PZc(r.It,3,1)}\\) A. (افترضنا من الرسم أن سهم \\(I_1\\) يقع بين قدم الملف والمصدر.)`})()]].map(([n,a])=>`<details class="cb-q"><summary>المسألة ${n}</summary><div class="cb-ans">${a}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>في الشكل 1 (المسألة 3) كُتبت سعة المكثف «5 µC» والمقصود <b>5 µF</b> (صححناها في الرسم). وفي المسألة 2 كُتب «أعد المسألة <span class="ltr">1-2-1</span>» والمقصود المسألة 1.</p>`,fix:true},
    {title:'مختبر مصغّر: ما الأداة لكل مسألة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مسألة اضغط الأداة التي يطلبها نص الكتاب (أو الأنسب لها).',cats:['توزيع الجهد','توزيع التيار','كيرشوف (الحلقة المغلقة)','السماحية المكافئة'],items:[
     ['المسألة 4: الجهدان \\(V_1\\) و \\(V_2\\)',0,'النص: «وذلك باستعمال قانون توزيع الجهد».'],
     ['المسألة 6: التيار في كل فرع من الدائرتين a و b',1,'النص: «باستعمال قانون توزيع التيار».'],
     ['المسألة 7: التيارات في دائرة الشكل 5',2,'النص: «استعمل قوانين كيرشوف».'],
     ['المسألة 5: الجهد المؤثر في دائرة توازي',3,'النص: «احسب السماحية المكافئة… ثم احسب الجهد المؤثر».']]})}
   ]},

  {recap:[
   String.raw`في التيار المتردد نستعمل قوانين كيرشوف نفسها، بالمعاوقات المركبة والمتجهات بدل المقاومات والأعداد العادية (ص 55).`,
   String.raw`طريقة الحلقة المغلقة: تيار دوار لكل حلقة، والفرع المشترك يمر فيه الفرق \(i_1-i_2\)، كما في المعادلتين (1) و(2).`,
   String.raw`\([Z][I]=[V]\): القطر مجموع معاوقات الحلقة (موجب)، وخارجه سالب المعاوقة المشتركة، والمصفوفة متماثلة (ص 56–57).`,
   String.raw`بالمحددات: \(i_x=\frac{|Z|_x}{|Z|}\)، و\(|Z|_x\) بعد وضع \([V]\) مكان العمود x.`,
   String.raw`في المثال <span class="ltr">(1-2-15)</span>: \(i_1=i_I-i_{II}\approx 2.94\angle -19.9^\circ\ \text{A}\) (بعد تصحيح زاوية المحددة).`]}
],
 theory:[
  {h:'قوانين كيرشوف في دوائر التيار المتردد',ref:'ص 55',html:`<p>لحل مسائل التيار المتردد نستخدم جميع قوانين التيار المستمر بما فيها قوانين كيرشوف للتيار وللجهد شريطة أن نستعمل <b>المعاوقة المركبة</b> مكان المقاومة وأن نعبر عن التيار والجهد عن طريق <b>متجهات</b>. وفيما يلي نشرح إحدى الطرق المستخدمة وهي <b>طريقة الحلقة المغلقة</b> <span class="ltr">(Closed Loop (Mesh) Method)</span>.</p>
   <p>تعتمد طريقة الحلقة المغلقة على قانوني كيرشوف للتيارات والجهود، حيث يُرتَّب قانون كيرشوف في نظام معادلات خطية على طريقة المصفوفات، ونجعل تياراً دواراً لكل دائرة كهربائية مغلقة.</p>`},
  {fig:'(1-48)',ref:'ص 55',caption:'دائرة بحلقتين: المصدر E (تردده f)، و Z<sub>1</sub> بين a و b، و Z<sub>4</sub> على الخط السفلي، و Z<sub>2</sub> الفرع المشترك b–c، و Z<sub>3</sub> على الضلع الأيمن d–e. التياران الدواران i<sub>1</sub> و i<sub>2</sub> مع عقارب الساعة.',draw:()=>box(fig148(),560)},
  {html:`<p>من شكل (1-48) يمكن اعتبار التيار الدوار \\(i_1\\) هو التيار الخاص بالدائرة المغلقة abc (الدائرة رقم 1)، والتيار \\(i_2\\) هو التيار الخاص بالدائرة المغلقة bdec (الدائرة رقم 2). ويكون التيار المار في كل من المعاوقتين \\(Z_1\\) و\\(Z_4\\) هو \\(i_1\\)، والتيار المار في \\(Z_3\\) هو \\(i_2\\)، أما المعاوقة \\(Z_2\\) فيمر فيها التيار \\(i_1 - i_2\\). ويمكن كتابة قوانين كيرشوف كالتالي:</p>
   <p>بالنسبة للدائرة abc (رقم 1) <span class="ref">ص 56</span>:</p>
   $$E = i_1(Z_1+Z_4)+(i_1-i_2)Z_2\\ \\Rightarrow\\ E = i_1(Z_1+Z_4+Z_2)-i_2 Z_2 \\qquad (1)$$
   <p>بالنسبة للدائرة bdec (رقم 2):</p>
   $$0 = i_2 Z_3-(i_1-i_2)Z_2\\ \\Rightarrow\\ 0 = -i_1 Z_2+i_2(Z_2+Z_3) \\qquad (2)$$
   <p>ويمكن ترتيب المعادلتين 1 و2 على صورة نظام معادلات خطية من الدرجة الأولى:</p>
   $$\\begin{bmatrix} (Z_1+Z_4+Z_2) & -Z_2 \\\\ -Z_2 & (Z_2+Z_3) \\end{bmatrix}\\begin{bmatrix} i_1 \\\\ i_2 \\end{bmatrix}=\\begin{bmatrix} E \\\\ 0 \\end{bmatrix}$$`},
  {h:'ملاحظات على نظام المعادلات',ref:'ص 56–57',html:`<ol><li>يمكن التعبير عن هذا النظام بأنه نظام المعادلات الخطية لقانون أوم لدوائر التيار المتردد على الصورة \\([Z][I]=[V]\\) حيث تسمى \\([Z]\\) <b>مصفوفة المعاوقات</b> و\\([I]\\) <b>متجه التيارات</b> و\\([V]\\) <b>متجه الجهود</b>.</li>
   <li>يكون متجه التيارات \\([I]\\) في الغالب هو المجهول، وهو يمثل التيارات الدوارة في الدائرة المكونة من k من الدوائر المغلقة.</li>
   <li>مصفوفة المعاوقات مربعة ومتماثلة (k × k)، ومكونات القطر فقط موجبة أما باقي المكونات فسالبة. ومكونات القطر \\(Z_{11}, Z_{22}, \\ldots, Z_{kk}\\) هي مجموع معاوقات الدائرة المغلقة رقم 1 و2 … حتى k: \\(Z_{11}=(Z_1+Z_4+Z_2)\\) و\\(Z_{22}=(Z_2+Z_3)\\) حيث k = 2 هنا. أما المكونات خارج القطر \\(Z_{mn}\\) فهي سالب المعاوقة المشتركة بين الدائرتين m و n، و\\(Z_{nm}=Z_{mn}\\).</li>
   <li>متجه الجهود \\([V]\\) مكون من \\(V_1, V_2, \\ldots, V_k\\) حيث \\(V_x\\) مجموع مصادر الجهد في الدائرة رقم x، والاتجاه الموجب للجهد \\(V_x\\) هو اتجاه سريان التيار \\(i_x\\).</li>
   <li>الحل العام \\([I]=[Z]^{-1}[V]\\). ومن طرق الحل طريقة <b>المحددات</b>:
    <ul><li>نحسب المحددة الرئيسة \\(|Z|\\) للمصفوفة.</li><li>نحسب المحددة رقم x \\(|Z|_x\\) بعد استبدال العمود رقم x بمتجه الجهود \\([V]\\).</li><li>نحسب التيار رقم x: \\(i_x=\\frac{|Z|_x}{|Z|}\\).</li><li>نحسب تيار كل جزء من الدائرة، مع مراعاة الأجزاء التي يسري فيها أكثر من تيار (نأخذ محصلتها).</li></ul></li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب) — محددة مصفوفة 2×2:</b> \\(\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = a\\,d - b\\,c\\) (حاصل ضرب القطر الرئيس ناقص حاصل ضرب القطر الآخر). مع الأعداد المركبة: الضرب بالصورة القطبية والطرح بالصورة المتعامدة.'},
  {h:'مثال (1-2-15)',ref:'ص 58–60',html:`<p>في الدائرة المبينة بشكل (1-49) احسب التيار في الفرع ab بطريقة الحلقة المغلقة (ماكسويل).</p>`},
  {fig:'(1-49)',ref:'ص 58',caption:'المصدر 110 V بتردد 60 Hz، و Z<sub>1</sub> = 10 Ω∠30° في الفرع ab، و Z<sub>2</sub> = 20 Ω∠−20° على الضلع الأيمن، و Z<sub>3</sub> = 20 Ω∠0° على الخط السفلي الأيسر.',draw:()=>box(fig149(),600)},
  {html:`<p><b>الحل:</b> الدائرة تتكون من دائرتين مغلقتين، فنفترض تيارين دوارين \\(i_I\\) و\\(i_{II}\\).</p>
   $$[Z]=\\begin{bmatrix} (Z_1+Z_3) & (-Z_1) \\\\ (-Z_1) & (Z_1+Z_2) \\end{bmatrix}$$
   $$(Z_1+Z_3)=(10\\angle 30^\\circ)+(20\\angle 0^\\circ)=28.66+j5=29.09\\angle 9.9^\\circ\\ \\Omega$$
   $$(Z_1+Z_2)=(10\\angle 30^\\circ)+(20\\angle -20^\\circ)=27.45-j1.84=27.51\\angle -3.84^\\circ\\ \\Omega$$
   $$\\begin{bmatrix} 29.09\\angle 9.9^\\circ & -10\\angle 30^\\circ \\\\ -10\\angle 30^\\circ & 27.51\\angle -3.84^\\circ \\end{bmatrix}\\begin{bmatrix} i_I \\\\ i_{II} \\end{bmatrix}=\\begin{bmatrix} 110\\angle 0^\\circ \\\\ 0\\angle 0^\\circ \\end{bmatrix}$$
   $$|Z|=(29.09\\angle 9.9^\\circ)(27.51\\angle -3.84^\\circ)-(-10\\angle 30^\\circ)(-10\\angle 30^\\circ)$$$$|Z|=800.27\\angle 6.06^\\circ-100\\angle 60^\\circ=745.8-j2.12=745.8\\angle -0.16^\\circ$$
   $$|Z|_1=(110\\angle 0^\\circ)(27.51\\angle -3.84^\\circ)-0=3026.1\\angle -3.84^\\circ$$$$|Z|_2=-(110\\angle 0^\\circ)(-10\\angle 30^\\circ)-0=1100\\angle 30^\\circ$$
   $$i_I=\\frac{|Z|_1}{|Z|}=4.06\\angle -3.68^\\circ\\ \\text{A}\\qquad i_{II}=\\frac{|Z|_2}{|Z|}=1.475\\angle 30.16^\\circ\\ \\text{A}$$
   $$i_1=i_I-i_{II}=2.77-j1.00=2.94\\angle -19.9^\\circ\\ \\text{A}$$
   <p class="sub fixnote">زاوية المحددة الرئيسة وما بعدها هنا مصححة؛ الكتاب طبع \\(745.8\\angle 0.2^\\circ\\) فخرجت عنده \\(i_I = 4.06\\angle -4.04^\\circ\\) و\\(i_{II} = 1.475\\angle 29.8^\\circ\\) و\\(i_1 = 2.95\\angle -20.2^\\circ\\) A. الحلان (كما في الكتاب / المصحح) في «الأمثلة المحلولة».</p>`},
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب — مثال (1-2-15) ص 59–60:</b><ol><li>\\(745.8 - j2.12\\) زاويته <b>\\(-0.16^\\circ\\)</b> (سالبة لأن الجزء التخيلي سالب)، وطُبعت \\(+0.2^\\circ\\). لذلك تختلف زوايا التيارات قليلاً: الصحيح \\(i_I = 4.06\\angle -3.68^\\circ\\) و\\(i_{II} = 1.475\\angle 30.16^\\circ\\) و\\(i_1 = 2.94\\angle -19.9^\\circ\\) A. المقدار (2.95 A تقريباً) لا يتأثر عملياً؛ الخطأ في الزوايا.</li><li>كُتب \\(|Z|\\) (رمز المحددة) للمصفوفة نفسها في سطر «∴»، والمقصود \\([Z]\\).</li></ol></div>'},
  {h:'مسائل الفصل الثاني',ref:'ص 61–62',html:'<p>لا يطبع الكتاب إجابات للمسائل. تحت كل مسألة إجابة مقترحة، وحل خطوة بخطوة بأرقام قابلة للتغيير في «الأمثلة المحلولة».</p>'},
  PB('1-','إذا كان التيار المار في حمل معين \\(i(t)=6\\sin(377t+30^\\circ)\\) A، وكان الجهد بين طرفيه \\(v(t)=220\\sin(377t+60^\\circ)\\) V، أوجد التيار المطاور والجهد المطاور وكذلك المعاوقة المركبة للحمل، ثم ارسم الشكل المطاور.',
   box(phasorSVG([{z:cpol(220/SQ2,60),lab:'V',g:'V'},{z:cpol(6/SQ2,30),lab:'I',col:'--stop',g:'I'}],{w:300,h:200,arcs:[{a1:30,a2:60,r:50,lab:'30°'}],note:'V و I بمقياسين مختلفين'}),300),
   `\\(I = 4.24\\angle 30^\\circ\\) A، \\(V = 155.56\\angle 60^\\circ\\) V، \\(Z = V/I = 36.67\\angle 30^\\circ = 31.75 + j18.33\\ \\Omega\\): حمل مادي - حثي، والجهد يتقدم على التيار بـ 30° (الرسم أعلاه).`),
  PB('2-','أعد المسألة 1 إذا كان التيار \\(i(t)=10\\sin(377t)\\) A، وكان الجهد \\(v(t)=380\\cos(377t+60^\\circ)\\) V.','',
   `نكتب الجهد بالجيب: \\(380\\cos(377t+60^\\circ)=380\\sin(377t+150^\\circ)\\). إذن \\(I = 7.07\\angle 0^\\circ\\) A و\\(V = 268.7\\angle 150^\\circ\\) V و\\(Z = 38\\angle 150^\\circ = -32.91 + j19\\ \\Omega\\). الجزء الحقيقي سالب: الزاوية بين الجهد والتيار أكبر من 90°، أي أن هذا «الحمل» يعطي قدرة فعالة ولا يستهلكها — لا يمكن أن يتكون من R و L و C فقط. <span class="fixnote">(قد يكون المقصود في الكتاب أرقاماً أخرى؛ هذا حل المسألة كما طُبعت.)</span>`),
  PB('3-','احسب المعاوقة المكافئة للدائرة المبينة في الشكل 1 وارسم شكلها، ثم احسب التيار المار في الدائرة والجهد بين طرفي كل عنصر، وارسم الشكل المطاور للتيار والجهود.',box(figP1(),620),
   (()=>{const r=pr3calc(gv(GP3));return `\\(X_{L1}=113.1\\)، \\(X_C=${f1(r.XC,1)}\\)، \\(X_{L2}=37.7\\ \\Omega\\)؛ \\(Z_T=${RZ(r.Z,1)}=${PZc(r.Z,1,1)}\\ \\Omega\\) (مادي - سعوي). \\(V=${PZc(r.V,2,1)}\\) V (قيمة فعالة)، \\(I=${PZc(r.I,3,1)}\\) A. الجهود: \\(V_{30\\Omega}=${PZc(csc(r.I,30),2,1)}\\)، \\(V_{0.3H}=${PZc(cmul(r.I,Cx(0,r.XL1)),2,1)}\\)، \\(V_C=${PZc(cmul(r.I,Cx(0,-r.XC)),2,1)}\\)، \\(V_{0.1H}=${PZc(cmul(r.I,Cx(0,r.XL2)),2,1)}\\)، \\(V_{20\\Omega}=${PZc(csc(r.I,20),2,1)}\\) V.`})()),
  PB('4-','احسب الجهدين \\(V_1\\) و\\(V_2\\) في الدائرة المبينة في الشكل 2، وذلك باستعمال قانون توزيع الجهد.',box(figP2(),560),
   '\\(Z_T = 8 + j17 + 12 - j15 = 20 + j2 = 20.1\\angle 5.71^\\circ\\ \\Omega\\). \\(V_1 = \\frac{(12+j2)\\,50}{20+j2} = 30.27\\angle 3.75^\\circ\\) V، و\\(V_2 = \\frac{(12-j15)\\,50}{20+j2} = 47.79\\angle -57.05^\\circ\\) V.'),
  PB('5-','احسب السماحية المكافئة للدائرة المبينة في الشكل 3 وارسم شكلها، ثم احسب الجهد المؤثر وارسم الشكل المطاور للتيارات والجهد المؤثر.',box(figP3(),560),
   (()=>{const g=gv(GP5),w=377,BL=1/(w*0.005),BC=w*0.002,Y=Cx(1/3,BC-BL),V=cdiv(cpol(10/SQ2,-53.1),Y);return `\\(X_L = 1.885\\ \\Omega\\)، \\(X_{C1} = 2.947\\ \\Omega\\)، \\(X_{C2} = 2.411\\ \\Omega\\). \\(Y_T = 0.333 - j0.531 + j0.339 + j0.415 = ${RZ(Y,3)} = ${PZc(Y,3,1)}\\) S (مادي - سعوي). تيار المصدر \\(7.07\\angle -53.1^\\circ\\) A، والجهد \\(V = I/Y_T = ${PZc(V,2,1)}\\) V.`})()),
  PB('6-','احسب التيار في كل فرع من الدائرتين a و b المبينتين في الشكل 4 باستعمال قانون توزيع التيار.',`<div class="cb-figs"><figure>${box(figP4a(),440)}(a)</figure><figure>${box(figP4b(),440)}(b)</figure></div>`,
   (()=>{const f=(I,th,Z1,Z2)=>{const It=cpol(I,th),S2=cadd(Z1,Z2);return [cdiv(cmul(Z2,It),S2),cdiv(cmul(Z1,It),S2)]};const a=f(8,40,Cx(4,7),Cx(9,-10)),b=f(5,20,Cx(20,0),Cx(0,-20));return `(a) \\(I_1 = \\frac{(9-j10)\\,8\\angle 40^\\circ}{13-j3} = ${PZc(a[0],2,1)}\\) A، \\(I_2 = \\frac{(4+j7)\\,8\\angle 40^\\circ}{13-j3} = ${PZc(a[1],2,1)}\\) A. (b) الفرع السفلي \\(j10 - j30 = -j20\\ \\Omega\\): \\(I_{20\\Omega} = ${PZc(b[0],2,1)}\\) A، \\(I_{LC} = ${PZc(b[1],2,1)}\\) A.`})()),
  PB('7-','استعمل قوانين كيرشوف لحساب التيارات في الدائرة المبينة في الشكل 5.',box(figP5(),540),
   (()=>{const r=meshSolve(Cx(2,3),Cx(9,-7),Cx(6,5),Cx(100),Cx(0));return `\\(Z_{11} = (2+j3)+(9-j7) = 11 - j4\\)، \\(Z_{22} = (9-j7)+(6+j5) = 15 - j2\\)، والمشتركة \\(9 - j7\\). \\(|Z| = ${RZ(r.det,1)}\\)، فنحصل على \\(I_T = I_I = ${PZc(r.Ia,2,1)}\\) A، \\(I_2 = I_{II} = ${PZc(r.Ib,2,1)}\\) A، \\(I_1 = I_I - I_{II} = ${PZc(r.Im,2,1)}\\) A — وهي نتائج المثال (1-2-14) المصححة.`})()),
  PB('8-','في الدائرة الموضحة في الشكل 6، احسب التيار \\(I_1\\) والجهد \\(V_L\\).',box(figP6(),480),
   (()=>{const r=pr8calc(gv(GP8));return `الضلع الأيمن موصول بالخط السفلي، فالمكثف 55 Ω بين طرفي المصدر مباشرة، والملف 85 Ω والمقاومة 65 Ω على التوازي: \\(Z_p = ${PZc(r.Zp,2,1)}\\ \\Omega\\). تيار المقاومة 45 Ω: \\(${PZc(r.Is,3,1)}\\) A، ومنه \\(V_L = ${PZc(r.VL,2,1)}\\) V. تيار المكثف \\(${PZc(r.IC,3,1)}\\) A. و\\(I_1\\) على الخط السفلي بين الملف والمصدر هو تيار المصدر: \\(I_1 = ${PZc(r.It,3,1)}\\) A. (افترضنا من الرسم أن سهم \\(I_1\\) يقع بين قدم الملف والمصدر.)`})()),
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب — المسائل:</b> في الشكل 1 (ص 61) كُتبت سعة المكثف «5 µC» والمقصود <b>5 µF</b> (صححناها في الرسم). وفي المسألة 2 كُتب «أعد المسألة 1-2-1» والمقصود المسألة 1 أعلاه.</span>'}
 ],
 lab:(el)=>{
  const PRE={e15:{mode:'pol',E1:[110,0],E2:[0,0],ZL:[20,0],ZM:[10,30],ZR:[20,-20]},p7:{mode:'rec',E1:[100,0],E2:[0,0],ZL:[2,3],ZM:[9,-7],ZR:[6,5]}};
  let P=JSON.parse(JSON.stringify(PRE.e15));const did={};let t=0;
  const zc=(k,t1,sub)=>`<div class="cb-zc"><h4>${t1} <small id="l11v${k}"></small></h4><div class="cb-in2">${ni('l11'+k+'0','<span class="l11a">المقدار</span>',0)}${ni('l11'+k+'1','<span class="l11b">الزاوية °</span>',0)}</div><div class="sub" style="margin:4px 0 0">${sub}</div></div>`;
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c12"><h2>حلّال الحلقتين <small>مبني على الشكلين (1-48) و(1-49)</small></h2>
    <div class="cb-row"><span class="sub">أرقام الكتاب:</span>${segHTML('pr',[['e15','مثال 1-2-15'],['p7','مسألة 7 (الشكل 5)']],'e15')}<span class="sub">طريقة الإدخال:</span>${segHTML('im',[['pol','قطبي: مقدار∠زاوية'],['rec','متعامد: R و X']],P.mode)}</div>
    <div class="cb-zg">${zc('E1','المصدر E<sub>1</sub> (الحلقة I)','V')}${zc('ZL','Z الحلقة I وحدها','الخط الأيسر')}${zc('ZM','Z المشتركة','الفرع الأوسط ab')}${zc('ZR','Z الحلقة II وحدها','الضلع الأيمن')}${zc('E2','مصدر ثانٍ E<sub>2</sub> في الضلع الأيمن','موجب في اتجاه التيار II')}</div></div>
   <div class="panel c7"><h2>الدائرة <small>التياران الدواران يتذبذبان (العرض مبطأ جداً)</small></h2><div class="svgbox cb-wide" id="l11c"></div>
    <div class="facts">${fact('I<sub>I</sub> (الحلقة اليسرى)','l11ia')}${fact('I<sub>II</sub> (الحلقة اليمنى)','l11ib')}${fact('الفرع المشترك I<sub>I</sub> − I<sub>II</sub>','l11im')}</div>
    <div id="l11kvl" class="sub" style="margin-top:8px"></div></div>
   <div class="panel c5"><h2>المصفوفة والمحددات</h2><div id="l11m" class="cb-mat"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l11st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);const K=['E1','ZL','ZM','ZR','E2'];
  const fill=()=>{K.forEach(k=>{$('#l11'+k+'0').value=P[k][0];$('#l11'+k+'1').value=P[k][1]});el.querySelectorAll('.l11a').forEach(x=>x.textContent=P.mode==='pol'?'المقدار':'الحقيقي R');el.querySelectorAll('.l11b').forEach(x=>x.textContent=P.mode==='pol'?'الزاوية °':'التخيلي X')};
  K.forEach(k=>[0,1].forEach(j=>$('#l11'+k+j).addEventListener('input',e=>{const v=parseFloat(e.target.value);P[k][j]=isFinite(v)?v:0;draw()})));
  const zOf=k=>P.mode==='pol'?cpol(P[k][0],P[k][1]):Cx(P[k][0],P[k][1]);
  segBind(el,'pr',k=>{P=JSON.parse(JSON.stringify(PRE[k]));segSet(el,'im',P.mode);fill();did[k]=1;draw()});
  segBind(el,'im',m=>{if(m===P.mode)return;K.forEach(k=>{const z=zOf(k);P[k]=m==='pol'?[RD(cabs(z),3),RD(cang(z),2)]:[RD(z.re,3),RD(z.im,3)]});P.mode=m;fill();draw()});
  let R11={};
  function draw(){const E1=zOf('E1'),E2=zOf('E2'),ZL=zOf('ZL'),ZM=zOf('ZM'),ZR=zOf('ZR');K.forEach(k=>{const z=zOf(k);$('#l11v'+k).textContent=P.mode==='pol'?RT(z,2):PT(z,2,1)});
   const r=meshSolve(ZL,ZM,ZR,E1,E2);R11={r,E2};
   if(cabs(r.det)<1e-9){$('#l11m').innerHTML='<div class="callout err">المحددة الرئيسة = 0: لا يوجد حل وحيد. غيّر القيم.</div>';return}
   const ztx=z=>PT(z,2,1);const right=cabs(E2)>1e-9?{parts:[{t:'V',l:'E2 = '+PT(E2,1,1)},{t:'Z',l:'ZR = '+ztx(ZR)}]}:{t:'Z',l:'ZR = '+ztx(ZR)};
   $('#l11c').innerHTML=meshFig({src:'E1 = '+PT(E1,1,1),x0:130,xm:320,xr:560,bl:{t:'Z',l:'ZL = '+ztx(ZL)},mid:{t:'Z',l:'ZM = '+ztx(ZM)},right,loops:['I','II'],lo1:0,lo2:30,anim:'l11a',wr:170});
   $('#l11ia').textContent=PT(r.Ia,3,2)+' A';$('#l11ib').textContent=PT(r.Ib,3,2)+' A';$('#l11im').textContent=PT(r.Im,3,2)+' A';
   const k1=csub(csub(E1,cmul(r.Ia,ZL)),cmul(r.Im,ZM)),k2=csub(cadd(E2,cmul(r.Im,ZM)),cmul(r.Ib,ZR));
   $('#l11kvl').innerHTML=`تحقق بقانون كيرشوف للجهد: الحلقة I: ${lt('E1 − I_I·ZL − (I_I−I_II)·ZM = '+f1(cabs(k1),4))} — الحلقة II: ${lt('E2 + (I_I−I_II)·ZM − I_II·ZR = '+f1(cabs(k2),4))} (صفر = صحيح).`;
   const T=z=>PZc(z,2,2);
   $('#l11m').innerHTML=[`[Z] = \\begin{bmatrix} ${T(r.Z11)} & -(${T(ZM)}) \\\\ -(${T(ZM)}) & ${T(r.Z22)} \\end{bmatrix}`,`[V] = \\begin{bmatrix} ${T(E1)} \\\\ ${T(E2)} \\end{bmatrix}`,`|Z| = Z_{11}Z_{22} - Z_M^2 = ${T(r.det)}`,`|Z|_1 = ${T(r.D1)}\\qquad |Z|_2 = ${T(r.D2)}`,`I_I = \\frac{|Z|_1}{|Z|} = ${PZc(r.Ia,3,2)}\\ \\text{A}`,`I_{II} = \\frac{|Z|_2}{|Z|} = ${PZc(r.Ib,3,2)}\\ \\text{A}`].map(x=>`<div class="ex-f">${B.tex(x,true)}</div>`).join('')+'<p class="sub">المصفوفة متماثلة: العنصران خارج القطر متساويان وكلاهما سالب المعاوقة المشتركة.</p>';
   steps.check()}
  const steps=stepsUI($('#l11st'),[
   {t:'مثال (1-2-15)',x:'اختر «مثال 1-2-15»: \\(|Z| = 745.8\\angle -0.16^\\circ\\) و\\(I_I = 4.06\\angle -3.68^\\circ\\) A و\\(I_{II} = 1.475\\angle 30.16^\\circ\\) A، وتيار الفرع ab \\(= 2.95\\) A (الزوايا هنا مصححة؛ الكتاب طبع 0.2° للمحددة).',done:()=>did.e15&&R11.r&&Math.abs(cabs(R11.r.Im)-2.95)<0.01},
   {t:'المصفوفة متماثلة',x:'انظر إلى [Z]: القطر = مجموع معاوقات كل حلقة، وخارج القطر = سالب المعاوقة المشتركة، وهما متساويان (ص 57).'},
   {t:'المسألة 7',x:'اختر «مسألة 7»: يعطي الحلّال \\(I_I = 11.42\\angle -27^\\circ\\) A (الكتاب 11.43 لأنه قرّب \\(Z_T\\) إلى 8.75) و\\(I_{II} = 8.6\\angle -57.3^\\circ\\) A، وهي نتائج المثال (1-2-14) نفسها بطريقة توالي - توازي.',done:()=>did.p7&&R11.r&&Math.abs(cabs(R11.r.Ia)-11.43)<0.02},
   {t:'مصدر ثانٍ',x:'اكتب مقداراً لـ E<sub>2</sub> (مثلاً 50 V): يصير الطرف الثاني من [V] غير صفري، ويتغير التياران معاً.',done:()=>R11.E2&&cabs(R11.E2)>0.5},
   {t:'التحقق بكيرشوف',x:'غيّر أي قيمة ولاحظ أن مجموع الجهود في كل حلقة يبقى صفراً: هذا هو قانون كيرشوف للجهد الذي بنينا عليه المعادلات.'}
  ]);
  fill();draw();
  loopOn(el,dt=>{t+=dt;const r=R11.r;if(!r)return;const mx=Math.max(cabs(r.Ia),cabs(r.Ib),1e-9);
   [['1',r.Ia],['2',r.Ib]].forEach(([k,I])=>{const c=$('#l11a'+k);if(c){const v=cabs(I)/mx;c.style.strokeDashoffset=fx(-60*v*Math.sin(2*PI*0.25*t+cang(I)*D)*3)}})});
 },
 examples:[
  {title:'مثال (1-2-15) — الحل كما في الكتاب',ref:'ص 58–60',q:'<p>في الدائرة المبينة بشكل (1-49) احسب التيار في الفرع ab بطريقة الحلقة المغلقة (ماكسويل).</p>',given:G1215,solve:(g,B,isBook)=>mesh15(g,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة زاوية المحددة الرئيسة كما طُبعت (+0.2°) فتخرج زوايا التيارات كما في الكتاب (−4.04° و 29.8° و −20.2°). إذا غيّرت أي رقم تحسب الحاسبة الزاوية الصحيحة. قارن بالحل المصحح أدناه.'},
  {title:'مثال (1-2-15) — الحل المصحح',ref:'ص 58–60',q:'<p>نفس المثال بزاوية صحيحة للمحددة الرئيسة \\(-0.16^\\circ\\). (حساب مصحح — ليس من الكتاب.)</p>',given:G1215,solve:g=>mesh15(g,false),note:'<span class="fixnote">الفرق عن الكتاب في الزوايا فقط: \\(i_I = 4.06\\angle -3.68^\\circ\\)، \\(i_{II} = 1.475\\angle 30.16^\\circ\\)، \\(i_1 = 2.94\\angle -19.9^\\circ\\) A.</span>'},
  {title:'مسألة 1 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 61',q:'<p>\\(i(t)=6\\sin(377t+30^\\circ)\\) A و\\(v(t)=220\\sin(377t+60^\\circ)\\) V. أوجد التيار والجهد المطاورين والمعاوقة المركبة.</p>',given:GP1,solve:g=>pr1(g,false)},
  {title:'مسألة 2 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 61',q:'<p>\\(i(t)=10\\sin(377t)\\) A و\\(v(t)=380\\cos(377t+60^\\circ)\\) V.</p>',given:GP2,solve:g=>pr1(g,true)},
  {title:'مسألة 3 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 61',q:'<p>دائرة التوالي في الشكل 1: احسب المعاوقة المكافئة والتيار والجهد بين طرفي كل عنصر.</p>',given:GP3,solve:g=>pr3(g)},
  {title:'مسألة 4 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 61',q:'<p>احسب \\(V_1\\) و\\(V_2\\) في الشكل 2 باستعمال قانون توزيع الجهد.</p>',given:GP4,solve:g=>pr4(g)},
  {title:'مسألة 5 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 61–62',q:'<p>احسب السماحية المكافئة للدائرة في الشكل 3 والجهد المؤثر وتيارات الفروع.</p>',given:GP5,solve:g=>pr5(g)},
  {title:'مسألة 6 (a) (إجابة مقترحة — ليست من الكتاب)',ref:'ص 62',q:'<p>الشكل 4 (a): \\(8\\angle 40^\\circ\\) A يتفرع في \\(4 + j7\\) و\\(9 - j10\\ \\Omega\\).</p>',given:GP6a,solve:g=>pr6(g)},
  {title:'مسألة 6 (b) (إجابة مقترحة — ليست من الكتاب)',ref:'ص 62',q:'<p>الشكل 4 (b): \\(5\\angle 20^\\circ\\) A يتفرع في 20 Ω و\\(j10 - j30\\ \\Omega\\).</p>',given:GP6b,solve:g=>pr6(g)},
  {title:'مسألة 7 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 62',q:'<p>استعمل قوانين كيرشوف (طريقة الحلقة المغلقة) لحساب التيارات في الشكل 5.</p>',given:GP7,solve:g=>pr7(g)},
  {title:'مسألة 8 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 62',q:'<p>في الشكل 6 احسب التيار \\(I_1\\) والجهد \\(V_L\\).</p>',given:GP8,solve:g=>pr8(g)}
 ],
 quiz:[
  {q:'لتطبيق قوانين كيرشوف في التيار المتردد يجب:',o:['استعمال القيم العظمى فقط','استعمال المعاوقة المركبة والتعبير عن التيار والجهد بمتجهات','إهمال المكثفات','استعمال المقاومات فقط'],c:1,e:'ص 55.'},
  {q:'في طريقة الحلقة المغلقة، التيار في الفرع المشترك بين حلقتين يساوي:',o:['i<sub>1</sub> + i<sub>2</sub>','i<sub>1</sub> − i<sub>2</sub> (محصلتهما)','i<sub>1</sub> فقط','صفر'],c:1,e:'ص 55: المعاوقة Z<sub>2</sub> يمر فيها التيار \\(i_1 - i_2\\).'},
  {q:'عناصر قطر مصفوفة المعاوقات:',o:['سالبة','مجموع معاوقات كل حلقة مغلقة','المعاوقات المشتركة','الجهود'],c:1,e:'ص 56–57.'},
  {q:'العنصر Z<sub>12</sub> خارج القطر يساوي:',o:['مجموع معاوقات الحلقة 1','سالب المعاوقة المشتركة بين الحلقتين','صفر دائماً','جهد المصدر'],c:1,e:'ص 57، و\\(Z_{21} = Z_{12}\\).'},
  {q:'محددة المصفوفة \\(\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}\\):',o:['a + d','a d − b c','a b − c d','a d + b c'],c:1,e:'حاصل ضرب القطر الرئيس ناقص حاصل ضرب القطر الآخر.'},
  {q:'لحساب \\(|Z|_1\\) نستبدل في المصفوفة:',o:['الصف الأول بمتجه الجهود','العمود الأول بمتجه الجهود','العمود الثاني بالتيارات','لا شيء'],c:1,e:'ص 57: \\(i_x = |Z|_x/|Z|\\).'},
  {q:'في مثال (1-2-15): \\(|Z| = 745.8 - j2.12\\). زاويتها:',o:['+0.2°','−0.16°','0°','−2.12°'],c:1,e:'الجزء التخيلي سالب فالزاوية سالبة: \\(\\tan^{-1}(-2.12/745.8) = -0.16^\\circ\\). الكتاب طبع +0.2°.'},
  {q:'الاتجاه الموجب لجهد المصدر في متجه الجهود [V] هو:',o:['عكس التيار الدوار','اتجاه سريان التيار الدوار للحلقة','دائماً لأعلى','لا يهم'],c:1,e:'ص 57.'}
 ]
});

/* ======================================================================
   Lesson 12 — instantaneous, active, apparent, reactive power; power factor (ص 63–67)
   ====================================================================== */
/* figures 1-50 … 1-52 (current taken as reference, like the book's drawings) */
function powFig(kind){const N=240,pts=(f)=>{const a=[];for(let k=0;k<=N;k++){const x=2*PI*k/N;a.push([x,f(x)])}return a};
  const ser=[];let ext='';
  if(kind==='R'){ser.push({pts:pts(x=>1-Math.cos(2*x)),col:'--live',w:2.6});ext=(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(1))}H${fx(X(2*PI))}" stroke="var(--blue)" stroke-dasharray="6 5"/>`+S.t(fx(X(2*PI)-4),fx(Y(1)-6),'VI','b','end')+S.t(fx(X(0)+4),fx(Y(2)-6),'2VI','','start')+S.t(fx(X(PI/2)),fx(Y(2)+16),'pR','','middle')}
  else{const s=kind==='L'?1:-1;ser.push({pts:pts(x=>s*Math.sin(2*x)),col:'--live',w:2.6},{pts:pts(x=>0.6*Math.sin(x)),col:'--stop',w:1.6,dash:'6 4'},{pts:pts(x=>s*0.6*Math.cos(x)),col:'--blue',w:1.6,dash:'2 4'});
    ext=(X,Y)=>S.t(fx(X(PI/4)),fx(Y(s>0?1:-1)+(s>0?-6:16)),kind==='L'?'pL':'pC','','middle')+S.t(fx(X(PI/2)+4),fx(Y(0.6)-6),'i','','start')+S.t(fx(X(0)+6),fx(Y(s*0.6)+(s>0?-6:16)),'v','b','start')}
  return plotSVG({w:520,h:220,x0:0,x1:2*PI,y0:kind==='R'?-0.2:-1.25,y1:kind==='R'?2.3:1.25,xt:[0,PI,2*PI],xf:v=>v===0?'0':v<4?'π':'2π',yt:[],xl:'α',series:ser,extra:ext,aria:'القدرة اللحظية'})}

B.lesson({
 id:'u1-l12',unit:1,order:12,pages:'63–67',
 title:'القدرة اللحظية والفعالة والظاهرية والمفاعلة ومعامل القدرة',
 summary:'القدرة اللحظية p = v·i تتذبذب بضعف التردد حول قيمة متوسطة هي القدرة الفعالة P = VI cosθ (بالواط). القدرة الظاهرية S = VI (بالفولت أمبير)، ومعامل القدرة cosθ = P/S، والقدرة المفاعلة Q = VI sinθ (بالفار) يستعيرها الملف ويولدها المكثف.',
 stations:[
  {intro:true},

  {st:1,short:'القدرة اللحظية',title:'الفصل الثالث — مقدمة: القدرة اللحظية',ref:'ص 63',
   q:'القدرة = الجهد × التيار في كل لحظة… فماذا يعني أن تصبح القدرة سالبة في بعض اللحظات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنيات الجهد والتيار والقدرة اللحظية، والقدرة موجبة في مساحات خضراء وسالبة في مساحات برتقالية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M50 280 L50 60" fill="none" stroke="#8A9A93" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><line x1="50.0" y1="170.0" x2="326.0" y2="170.0" stroke="#8A9A93" stroke-width="2" stroke-linecap="round"/><polygon points="334.0,170.0 326.0,174.8 326.0,165.2" fill="#8A9A93"/><text x="334" y="160" text-anchor="start" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">α</text><text x="58" y="188" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">0</text><text x="185.0" y="188" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">π</text><text x="320" y="188" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">2π</text><g data-tip="المساحة الخضراء: لحظات تكون فيها إشارتا الجهد والتيار متساويتين، فالقدرة موجبة: الحمل يأخذ الطاقة من المصدر."><path d="M50.0 170.0 L50.0 170.0 L51.1 168.4 L52.2 166.7 L53.4 165.0 L54.5 163.3 L55.6 161.6 L56.8 159.8 L57.9 158.0 L59.0 156.2 L60.1 154.3 L61.2 152.5 L62.4 150.7 L63.5 148.8 L64.6 147.0 L65.8 145.2 L66.9 143.4 L68.0 141.7 L69.1 140.0 L70.2 138.3 L71.4 136.6 L72.5 135.0 L73.6 133.4 L74.8 131.9 L75.9 130.5 L77.0 129.1 L78.1 127.8 L79.2 126.5 L80.4 125.3 L81.5 124.2 L82.6 123.1 L83.8 122.2 L84.9 121.3 L86.0 120.5 L87.1 119.8 L88.2 119.2 L89.4 118.7 L90.5 118.3 L91.6 117.9 L92.8 117.7 L93.9 117.5 L95.0 117.5 L96.1 117.5 L97.2 117.7 L98.4 117.9 L99.5 118.3 L100.6 118.7 L101.8 119.2 L102.9 119.8 L104.0 120.5 L105.1 121.3 L106.2 122.2 L107.4 123.1 L108.5 124.2 L109.6 125.3 L110.8 126.5 L111.9 127.8 L113.0 129.1 L114.1 130.5 L115.2 131.9 L116.4 133.4 L117.5 135.0 L118.6 136.6 L119.8 138.3 L120.9 140.0 L122.0 141.7 L123.1 143.4 L124.2 145.2 L125.4 147.0 L126.5 148.8 L127.6 150.7 L128.8 152.5 L129.9 154.3 L131.0 156.2 L132.1 158.0 L133.2 159.8 L134.4 161.6 L135.5 163.3 L136.6 165.0 L137.8 166.7 L138.9 168.4 L140.0 170.0 L141.1 170.0 L142.2 170.0 L143.4 170.0 L144.5 170.0 L145.6 170.0 L146.8 170.0 L147.9 170.0 L149.0 170.0 L150.1 170.0 L151.2 170.0 L152.4 170.0 L153.5 170.0 L154.6 170.0 L155.8 170.0 L156.9 170.0 L158.0 170.0 L159.1 170.0 L160.2 170.0 L161.4 170.0 L162.5 170.0 L163.6 170.0 L164.8 170.0 L165.9 170.0 L167.0 170.0 L168.1 170.0 L169.2 170.0 L170.4 170.0 L171.5 170.0 L172.6 170.0 L173.8 170.0 L174.9 170.0 L176.0 170.0 L177.1 170.0 L178.2 170.0 L179.4 170.0 L180.5 170.0 L181.6 170.0 L182.8 170.0 L183.9 170.0 L185.0 170.0 L186.1 168.4 L187.2 166.7 L188.4 165.0 L189.5 163.3 L190.6 161.6 L191.8 159.8 L192.9 158.0 L194.0 156.2 L195.1 154.3 L196.2 152.5 L197.4 150.7 L198.5 148.8 L199.6 147.0 L200.8 145.2 L201.9 143.4 L203.0 141.7 L204.1 140.0 L205.2 138.3 L206.4 136.6 L207.5 135.0 L208.6 133.4 L209.8 131.9 L210.9 130.5 L212.0 129.1 L213.1 127.8 L214.2 126.5 L215.4 125.3 L216.5 124.2 L217.6 123.1 L218.8 122.2 L219.9 121.3 L221.0 120.5 L222.1 119.8 L223.2 119.2 L224.4 118.7 L225.5 118.3 L226.6 117.9 L227.8 117.7 L228.9 117.5 L230.0 117.5 L231.1 117.5 L232.2 117.7 L233.4 117.9 L234.5 118.3 L235.6 118.7 L236.8 119.2 L237.9 119.8 L239.0 120.5 L240.1 121.3 L241.2 122.2 L242.4 123.1 L243.5 124.2 L244.6 125.3 L245.8 126.5 L246.9 127.8 L248.0 129.1 L249.1 130.5 L250.2 131.9 L251.4 133.4 L252.5 135.0 L253.6 136.6 L254.8 138.3 L255.9 140.0 L257.0 141.7 L258.1 143.4 L259.2 145.2 L260.4 147.0 L261.5 148.8 L262.6 150.7 L263.8 152.5 L264.9 154.3 L266.0 156.2 L267.1 158.0 L268.2 159.8 L269.4 161.6 L270.5 163.3 L271.6 165.0 L272.8 166.7 L273.9 168.4 L275.0 170.0 L276.1 170.0 L277.2 170.0 L278.4 170.0 L279.5 170.0 L280.6 170.0 L281.8 170.0 L282.9 170.0 L284.0 170.0 L285.1 170.0 L286.2 170.0 L287.4 170.0 L288.5 170.0 L289.6 170.0 L290.8 170.0 L291.9 170.0 L293.0 170.0 L294.1 170.0 L295.2 170.0 L296.4 170.0 L297.5 170.0 L298.6 170.0 L299.8 170.0 L300.9 170.0 L302.0 170.0 L303.1 170.0 L304.2 170.0 L305.4 170.0 L306.5 170.0 L307.6 170.0 L308.8 170.0 L309.9 170.0 L311.0 170.0 L312.1 170.0 L313.2 170.0 L314.4 170.0 L315.5 170.0 L316.6 170.0 L317.8 170.0 L318.9 170.0 L320.0 170.0 L320.0 170.0 Z" fill="#9ED9B8" stroke="none"/></g><g data-tip="المساحة البرتقالية: إشارتا الجهد والتيار مختلفتان، فالقدرة سالبة: «الحمل» يعيد طاقة إلى المصدر."><path d="M50.0 170.0 L50.0 170.0 L51.1 170.0 L52.2 170.0 L53.4 170.0 L54.5 170.0 L55.6 170.0 L56.8 170.0 L57.9 170.0 L59.0 170.0 L60.1 170.0 L61.2 170.0 L62.4 170.0 L63.5 170.0 L64.6 170.0 L65.8 170.0 L66.9 170.0 L68.0 170.0 L69.1 170.0 L70.2 170.0 L71.4 170.0 L72.5 170.0 L73.6 170.0 L74.8 170.0 L75.9 170.0 L77.0 170.0 L78.1 170.0 L79.2 170.0 L80.4 170.0 L81.5 170.0 L82.6 170.0 L83.8 170.0 L84.9 170.0 L86.0 170.0 L87.1 170.0 L88.2 170.0 L89.4 170.0 L90.5 170.0 L91.6 170.0 L92.8 170.0 L93.9 170.0 L95.0 170.0 L96.1 170.0 L97.2 170.0 L98.4 170.0 L99.5 170.0 L100.6 170.0 L101.8 170.0 L102.9 170.0 L104.0 170.0 L105.1 170.0 L106.2 170.0 L107.4 170.0 L108.5 170.0 L109.6 170.0 L110.8 170.0 L111.9 170.0 L113.0 170.0 L114.1 170.0 L115.2 170.0 L116.4 170.0 L117.5 170.0 L118.6 170.0 L119.8 170.0 L120.9 170.0 L122.0 170.0 L123.1 170.0 L124.2 170.0 L125.4 170.0 L126.5 170.0 L127.6 170.0 L128.8 170.0 L129.9 170.0 L131.0 170.0 L132.1 170.0 L133.2 170.0 L134.4 170.0 L135.5 170.0 L136.6 170.0 L137.8 170.0 L138.9 170.0 L140.0 170.0 L141.1 171.6 L142.2 173.1 L143.4 174.5 L144.5 175.9 L145.6 177.2 L146.8 178.5 L147.9 179.7 L149.0 180.8 L150.1 181.9 L151.2 182.8 L152.4 183.7 L153.5 184.5 L154.6 185.2 L155.8 185.8 L156.9 186.3 L158.0 186.7 L159.1 187.1 L160.2 187.3 L161.4 187.5 L162.5 187.5 L163.6 187.5 L164.8 187.3 L165.9 187.1 L167.0 186.7 L168.1 186.3 L169.2 185.8 L170.4 185.2 L171.5 184.5 L172.6 183.7 L173.8 182.8 L174.9 181.9 L176.0 180.8 L177.1 179.7 L178.2 178.5 L179.4 177.2 L180.5 175.9 L181.6 174.5 L182.8 173.1 L183.9 171.6 L185.0 170.0 L186.1 170.0 L187.2 170.0 L188.4 170.0 L189.5 170.0 L190.6 170.0 L191.8 170.0 L192.9 170.0 L194.0 170.0 L195.1 170.0 L196.2 170.0 L197.4 170.0 L198.5 170.0 L199.6 170.0 L200.8 170.0 L201.9 170.0 L203.0 170.0 L204.1 170.0 L205.2 170.0 L206.4 170.0 L207.5 170.0 L208.6 170.0 L209.8 170.0 L210.9 170.0 L212.0 170.0 L213.1 170.0 L214.2 170.0 L215.4 170.0 L216.5 170.0 L217.6 170.0 L218.8 170.0 L219.9 170.0 L221.0 170.0 L222.1 170.0 L223.2 170.0 L224.4 170.0 L225.5 170.0 L226.6 170.0 L227.8 170.0 L228.9 170.0 L230.0 170.0 L231.1 170.0 L232.2 170.0 L233.4 170.0 L234.5 170.0 L235.6 170.0 L236.8 170.0 L237.9 170.0 L239.0 170.0 L240.1 170.0 L241.2 170.0 L242.4 170.0 L243.5 170.0 L244.6 170.0 L245.8 170.0 L246.9 170.0 L248.0 170.0 L249.1 170.0 L250.2 170.0 L251.4 170.0 L252.5 170.0 L253.6 170.0 L254.8 170.0 L255.9 170.0 L257.0 170.0 L258.1 170.0 L259.2 170.0 L260.4 170.0 L261.5 170.0 L262.6 170.0 L263.8 170.0 L264.9 170.0 L266.0 170.0 L267.1 170.0 L268.2 170.0 L269.4 170.0 L270.5 170.0 L271.6 170.0 L272.8 170.0 L273.9 170.0 L275.0 170.0 L276.1 171.6 L277.2 173.1 L278.4 174.5 L279.5 175.9 L280.6 177.2 L281.8 178.5 L282.9 179.7 L284.0 180.8 L285.1 181.9 L286.2 182.8 L287.4 183.7 L288.5 184.5 L289.6 185.2 L290.8 185.8 L291.9 186.3 L293.0 186.7 L294.1 187.1 L295.2 187.3 L296.4 187.5 L297.5 187.5 L298.6 187.5 L299.8 187.3 L300.9 187.1 L302.0 186.7 L303.1 186.3 L304.2 185.8 L305.4 185.2 L306.5 184.5 L307.6 183.7 L308.8 182.8 L309.9 181.9 L311.0 180.8 L312.1 179.7 L313.2 178.5 L314.4 177.2 L315.5 175.9 L316.6 174.5 L317.8 173.1 L318.9 171.6 L320.0 170.0 L320.0 170.0 Z" fill="#F4B9A8" stroke="none"/></g><path d="M50.0 100.7 L52.2 98.7 L54.5 96.9 L56.8 95.3 L59.0 93.9 L61.2 92.7 L63.5 91.7 L65.8 91.0 L68.0 90.4 L70.2 90.1 L72.5 90.0 L74.8 90.1 L77.0 90.4 L79.2 91.0 L81.5 91.7 L83.8 92.7 L86.0 93.9 L88.2 95.3 L90.5 96.9 L92.8 98.7 L95.0 100.7 L97.2 102.9 L99.5 105.3 L101.8 107.8 L104.0 110.5 L106.2 113.4 L108.5 116.5 L110.8 119.7 L113.0 123.0 L115.3 126.4 L117.5 130.0 L119.7 133.7 L122.0 137.5 L124.2 141.3 L126.5 145.3 L128.8 149.3 L131.0 153.4 L133.2 157.5 L135.5 161.6 L137.8 165.8 L140.0 170.0 L142.2 174.2 L144.5 178.4 L146.8 182.5 L149.0 186.6 L151.2 190.7 L153.5 194.7 L155.8 198.7 L158.0 202.5 L160.2 206.3 L162.5 210.0 L164.8 213.6 L167.0 217.0 L169.2 220.3 L171.5 223.5 L173.8 226.6 L176.0 229.5 L178.2 232.2 L180.5 234.7 L182.8 237.1 L185.0 239.3 L187.2 241.3 L189.5 243.1 L191.8 244.7 L194.0 246.1 L196.2 247.3 L198.5 248.3 L200.8 249.0 L203.0 249.6 L205.2 249.9 L207.5 250.0 L209.8 249.9 L212.0 249.6 L214.2 249.0 L216.5 248.3 L218.8 247.3 L221.0 246.1 L223.2 244.7 L225.5 243.1 L227.8 241.3 L230.0 239.3 L232.2 237.1 L234.5 234.7 L236.8 232.2 L239.0 229.5 L241.2 226.6 L243.5 223.5 L245.8 220.3 L248.0 217.0 L250.3 213.6 L252.5 210.0 L254.8 206.3 L257.0 202.5 L259.2 198.7 L261.5 194.7 L263.8 190.7 L266.0 186.6 L268.2 182.5 L270.5 178.4 L272.8 174.2 L275.0 170.0 L277.2 165.8 L279.5 161.6 L281.8 157.5 L284.0 153.4 L286.2 149.3 L288.5 145.3 L290.8 141.3 L293.0 137.5 L295.2 133.7 L297.5 130.0 L299.8 126.4 L302.0 123.0 L304.2 119.7 L306.5 116.5 L308.8 113.4 L311.0 110.5 L313.2 107.8 L315.5 105.3 L317.8 102.9 L320.0 100.7" fill="none" stroke="#3B6FB6" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="6 4"/><path d="M50.0 170.0 L52.2 167.1 L54.5 164.3 L56.8 161.4 L59.0 158.6 L61.2 155.8 L63.5 153.0 L65.8 150.3 L68.0 147.6 L70.2 145.0 L72.5 142.5 L74.8 140.0 L77.0 137.7 L79.2 135.4 L81.5 133.2 L83.8 131.1 L86.0 129.1 L88.2 127.3 L90.5 125.5 L92.8 123.9 L95.0 122.4 L97.2 121.0 L99.5 119.8 L101.8 118.7 L104.0 117.7 L106.2 116.9 L108.5 116.2 L110.8 115.7 L113.0 115.3 L115.3 115.1 L117.5 115.0 L119.7 115.1 L122.0 115.3 L124.2 115.7 L126.5 116.2 L128.8 116.9 L131.0 117.7 L133.2 118.7 L135.5 119.8 L137.8 121.0 L140.0 122.4 L142.2 123.9 L144.5 125.5 L146.8 127.3 L149.0 129.1 L151.2 131.1 L153.5 133.2 L155.8 135.4 L158.0 137.7 L160.2 140.0 L162.5 142.5 L164.8 145.0 L167.0 147.6 L169.2 150.3 L171.5 153.0 L173.8 155.8 L176.0 158.6 L178.2 161.4 L180.5 164.3 L182.8 167.1 L185.0 170.0 L187.2 172.9 L189.5 175.7 L191.8 178.6 L194.0 181.4 L196.2 184.2 L198.5 187.0 L200.8 189.7 L203.0 192.4 L205.2 195.0 L207.5 197.5 L209.8 200.0 L212.0 202.3 L214.2 204.6 L216.5 206.8 L218.8 208.9 L221.0 210.9 L223.2 212.7 L225.5 214.5 L227.8 216.1 L230.0 217.6 L232.2 219.0 L234.5 220.2 L236.8 221.3 L239.0 222.3 L241.2 223.1 L243.5 223.8 L245.8 224.3 L248.0 224.7 L250.3 224.9 L252.5 225.0 L254.8 224.9 L257.0 224.7 L259.2 224.3 L261.5 223.8 L263.8 223.1 L266.0 222.3 L268.2 221.3 L270.5 220.2 L272.8 219.0 L275.0 217.6 L277.2 216.1 L279.5 214.5 L281.8 212.7 L284.0 210.9 L286.2 208.9 L288.5 206.8 L290.8 204.6 L293.0 202.3 L295.2 200.0 L297.5 197.5 L299.8 195.0 L302.0 192.4 L304.2 189.7 L306.5 187.0 L308.8 184.2 L311.0 181.4 L313.2 178.6 L315.5 175.7 L317.8 172.9 L320.0 170.0" fill="none" stroke="#8A9A93" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="3 4"/><g data-tip="القدرة اللحظية ⟦p = v·i⟧: تتذبذب بضعف تردد الجهد، أي دورتان لكل دورة من الجهد."><path d="M50.0 170.0 L52.2 166.7 L54.5 163.3 L56.8 159.8 L59.0 156.2 L61.2 152.5 L63.5 148.8 L65.8 145.2 L68.0 141.7 L70.2 138.3 L72.5 135.0 L74.8 131.9 L77.0 129.1 L79.2 126.5 L81.5 124.2 L83.8 122.2 L86.0 120.5 L88.2 119.2 L90.5 118.3 L92.8 117.7 L95.0 117.5 L97.2 117.7 L99.5 118.3 L101.8 119.2 L104.0 120.5 L106.2 122.2 L108.5 124.2 L110.8 126.5 L113.0 129.1 L115.3 131.9 L117.5 135.0 L119.7 138.3 L122.0 141.7 L124.2 145.2 L126.5 148.8 L128.8 152.5 L131.0 156.2 L133.2 159.8 L135.5 163.3 L137.8 166.7 L140.0 170.0 L142.2 173.1 L144.5 175.9 L146.8 178.5 L149.0 180.8 L151.2 182.8 L153.5 184.5 L155.8 185.8 L158.0 186.7 L160.2 187.3 L162.5 187.5 L164.8 187.3 L167.0 186.7 L169.2 185.8 L171.5 184.5 L173.8 182.8 L176.0 180.8 L178.2 178.5 L180.5 175.9 L182.8 173.1 L185.0 170.0 L187.2 166.7 L189.5 163.3 L191.8 159.8 L194.0 156.2 L196.2 152.5 L198.5 148.8 L200.8 145.2 L203.0 141.7 L205.2 138.3 L207.5 135.0 L209.8 131.9 L212.0 129.1 L214.2 126.5 L216.5 124.2 L218.8 122.2 L221.0 120.5 L223.2 119.2 L225.5 118.3 L227.8 117.7 L230.0 117.5 L232.2 117.7 L234.5 118.3 L236.8 119.2 L239.0 120.5 L241.2 122.2 L243.5 124.2 L245.8 126.5 L248.0 129.1 L250.3 131.9 L252.5 135.0 L254.8 138.3 L257.0 141.7 L259.2 145.2 L261.5 148.8 L263.8 152.5 L266.0 156.2 L268.2 159.8 L270.5 163.3 L272.8 166.7 L275.0 170.0 L277.2 173.1 L279.5 175.9 L281.8 178.5 L284.0 180.8 L286.2 182.8 L288.5 184.5 L290.8 185.8 L293.0 186.7 L295.2 187.3 L297.5 187.5 L299.8 187.3 L302.0 186.7 L304.2 185.8 L306.5 184.5 L308.8 182.8 L311.0 180.8 L313.2 178.5 L315.5 175.9 L317.8 173.1 L320.0 170.0" fill="none" stroke="#2C4A40" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g><g data-tip="القيمة المتوسطة للقدرة اللحظية (الخط المتقطع): هي القدرة الفعالة ⟦P = VI cosθ⟧."><path d="M50 152.5 L320 152.5" fill="none" stroke="#12855A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="7 5"/><text x="306" y="145.5" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">P</text><rect x="50" y="142.5" width="290" height="20" rx="6" fill="transparent"/></g><path d="M70 262 h22" fill="none" stroke="#3B6FB6" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="6 4"/><text x="100" y="266" text-anchor="start" font-size="13" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">v</text><path d="M140 262 h22" fill="none" stroke="#8A9A93" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="3 4"/><text x="170" y="266" text-anchor="start" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">i</text><path d="M210 262 h22" fill="none" stroke="#2C4A40" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><text x="240" y="266" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">p</text><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">القدرة في كل لحظة</text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">p(t) = v(t) · i(t)</text></svg>`,
   cap:'رسم توضيحي (دون أرقام) لحمل مادي - حثي: المنحنى الغامق هو القدرة اللحظية.<br><b>مرّر المؤشر على المنحنى الغامق والمساحتين الملونتين والخط المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'إذا كانت القدرة اللحظية سالبة في لحظة ما، فهذا يعني أن…',opts:[
     ['الحمل يستهلك قدرة أكبر',false,'الاستهلاك يكون عندما تكون القدرة موجبة.'],
     ['الحمل يصبح مصدراً للقدرة في تلك اللحظة',true,'نص الكتاب: «إذا اختلفت الإشارتان فإن القدرة تكون سالبة، وهنا يصبح الحمل مصدراً للقدرة».'],
     ['الدائرة مفتوحة',false,'لو كانت مفتوحة لكان التيار صفراً والقدرة صفراً، لا سالبة.']]}}
   ],
   body:[
    {book:String.raw`<p>عندما نغذي حملاً معاوقته \(Z = Z\angle\theta\) بالجهد \(v(t)=V_m\sin\omega t=V\sqrt2\sin\omega t\) فإن التيار \(i(t)=I_m\sin(\omega t-\theta)=I\sqrt2\sin(\omega t-\theta)\) سيمر في هذا الحمل. وفي اللحظة t فإن القدرة الداخلة في الحمل هي</p>
     <div class="eq">$$p(t)=v(t)\,i(t)$$<span class="eqno">(1-43)</span></div>
     <p>وتسمى <b>القدرة اللحظية</b> للحمل. وتكون هذه القدرة <b>موجبة</b> عندما تكون إشارة التيار تساوي إشارة الجهد، وفي هذه الحالة نقول إن الحمل يستهلك تلك القدرة. أما إذا اختلفت الإشارتان فإن القدرة تكون <b>سالبة</b>، وهنا يصبح «الحمل» مصدراً للقدرة.</p>
     <p>وبتعويض قيمتي الجهد والتيار نجد أن:</p>
     <div class="eq">$$p(t)=VI\cos\theta-VI\cos\theta\cos2\omega t+VI\sin\theta\sin2\omega t$$<span class="eqno">(1-44)</span></div>
     <p>وكما نلاحظ فإن القدرة اللحظية تتركب من ثلاثة أجزاء: جزء ثابت ويمثل القيمة المتوسطة، وجزءان يتذبذبان بتردد يساوي <b>ضعف</b> تردد الجهد (والتيار). أما الشغل الكهربائي الذي يبذل في الحمل بين الفترتين الزمنيتين \(t_1\) و\(t_2\) فهو</p>
     <div class="eq">$$W=\int_{t_1}^{t_2}p(t)\,dt$$<span class="eqno">(1-45)</span></div><p>ووحدته الجول (Joule ورمزه J).</p>`,ref:'ص 63'},
    {tip:String.raw`<ul style="margin:0"><li>\(VI\cos\theta\): جزء <b>ثابت</b> لا يتغير مع الزمن، وهو متوسط القدرة (المحطة التالية).</li><li>\(VI\cos\theta\cos2\omega t\) و\(VI\sin\theta\sin2\omega t\): جزءان <b>يتذبذبان</b> بالتردد \(2\omega\)، ومتوسط كل منهما على الدورة صفر.</li></ul>
     <p>لماذا ضعف التردد؟ لأن حاصل ضرب جيبين بالتردد نفسه يعطي حداً بضعف التردد؛ مثل \(\sin^2\omega t=\frac{1-\cos2\omega t}{2}\).</p>`,title:'أجزاء (1-44) الثلاثة'},
    {watch:String.raw`<p>إشارة الحد الأخير في (1-44): إذا كان الجهد هو المرجع كما كُتب (\(v=V\sqrt2\sin\omega t\)) فالحد الأخير إشارته <b>سالبة</b>. أما إذا أخذنا <b>التيار</b> مرجعاً (\(i=I\sqrt2\sin\omega t\) و\(v=V\sqrt2\sin(\omega t+\theta)\)) فالمعادلة صحيحة كما طُبعت، وعلى هذا الأساس رُسم الشكلان <span class="ltr">(1-51)</span> و<span class="ltr">(1-52)</span>. القيمة المتوسطة \(VI\cos\theta\) لا تتأثر بالاختيار، وفي المختبر مفتاح «المرجع» لترى الفرق.</p>`,fix:true},
    {add:String.raw`<p>عداد الكهرباء في البيت يقيس <b>الشغل</b> (1-45) لا القدرة: يجمع القدرة على مدى الزمن، ولذلك تُكتب الفاتورة بالكيلوواط ساعة <span class="ltr">kWh</span>، وهي وحدة طاقة مثل الجول.</p>`,title:'الشغل في فاتورة الكهرباء'},
    {title:'مختبر مصغّر: متى تصير القدرة اللحظية سالبة؟',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`اختر زاوية المعاوقة \(\theta\)، ثم حرّك الزمن. البرتقالي الجهد، والأخضر التيار، والأحمر \(p=v\,i\) <span class="ltr">(1-43)</span>. القيم نسبة من القيم العظمى؛ و<span class="ltr">30°</span> و<span class="ltr">60°</span> <b>أرقام تختارها أنت</b>.`,
 predict:{q:'في ملف نقي (<span class="ltr">θ = 90°</span>)، كم من زمن الدورة تكون القدرة اللحظية سالبة؟',opts:[
  ['لا تكون سالبة أبداً',false,'هذا في المقاومة فقط (<span class="ltr">θ = 0</span>).'],
  ['نصف الزمن',true,'المعادلة <span class="ltr">(1-53)</span>: \\(p_L=VI\\sin2\\omega t\\)، موجبة نصف الوقت وسالبة نصفه، فيعيد الملف كل ما أخذه.'],
  ['طوال الدورة',false,'لو كانت سالبة دائماً لكان الملف مصدراً للقدرة، وهو لا يولّد شيئاً.']]},
 ins:[{k:'th',l:'زاوية المعاوقة θ',seg:[[0,'0° (مقاومة)'],[30,'<span class="ltr">30°</span>'],[60,'<span class="ltr">60°</span>'],[90,'90° (ملف)']],v:60},{k:'a',l:'الزمن ωt',min:0,max:360,step:5,v:120,fmt:v=>v+'°'}],
 calc:(s,P,B)=>{const D=Math.PI/180,v=x=>Math.sin(x*D),i=x=>Math.sin((x-s.th)*D),p=x=>v(x)*i(x);let neg=0;for(let k=0;k<360;k++)if(p(k+0.5)<0)neg++;
  const pv=p(s.a),z=Math.abs(pv)<1e-9;
  return {facts:[['إشارة v',v(s.a)>1e-9?'+':v(s.a)<-1e-9?'−':'0'],['إشارة i',i(s.a)>1e-9?'+':i(s.a)<-1e-9?'−':'0'],['<span class="ltr">p ÷ (Vm Im)</span>',DCML.fm(B,z?0:pv,3),z?'':pv>0?'hi':'bad'],['زمن p السالبة',DCML.fm(B,neg/3.6,0)+'%']],
   plot:{xr:[0,360],yr:[-1.1,1.1],xt:[0,90,180,270,360],yt:[-1,0,1],xl:'ωt (°)',yl:'',curves:[{f:v,col:'--live',w:1.8},{f:i,col:'--on',w:1.8},{f:p,col:'--stop',w:3}],cur:[s.a,z?0:pv]},
   msg:z?'القدرة صفر في هذه اللحظة.':pv>0?'الإشارتان متساويتان: القدرة موجبة والحمل يستهلك (يأخذ من المصدر).':'الإشارتان مختلفتان: القدرة سالبة، والحمل يعيد طاقة إلى المصدر في هذه اللحظة.',cls:z||pv>0?'':'warn'}}})}
   ]},

  {st:2,short:'القدرة الفعالة',title:'القدرة الفعالة <span class="ltr">P</span>',ref:'ص 64',
   q:'القدرة اللحظية تصعد وتنزل باستمرار… فأي رقم واحد يعبر عن القدرة التي يستهلكها الحمل فعلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-50: القدرة اللحظية في مقاومة: بين الصفر و 2VI وقيمتها المتوسطة VI" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M50 250 L50 60" fill="none" stroke="#8A9A93" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><line x1="50.0" y1="240.0" x2="326.0" y2="240.0" stroke="#8A9A93" stroke-width="2" stroke-linecap="round"/><polygon points="334.0,240.0 326.0,244.8 326.0,235.2" fill="#8A9A93"/><text x="334" y="230" text-anchor="start" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">α</text><text x="58" y="258" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">0</text><text x="185.0" y="258" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">π</text><text x="320" y="258" text-anchor="middle" font-size="12" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">2π</text><g data-tip="القدرة اللحظية في المقاومة ⟦pR = VI − VI cos2ωt⟧: موجبة في كل لحظة، ولا تنزل تحت الصفر."><path d="M50.0 240.0 L52.2 239.6 L54.5 238.3 L56.8 236.1 L59.0 233.1 L61.2 229.3 L63.5 224.7 L65.8 219.5 L68.0 213.5 L70.2 207.0 L72.5 200.0 L74.8 192.5 L77.0 184.7 L79.2 176.6 L81.5 168.4 L83.8 160.0 L86.0 151.6 L88.2 143.4 L90.5 135.3 L92.8 127.5 L95.0 120.0 L97.2 113.0 L99.5 106.5 L101.8 100.5 L104.0 95.3 L106.2 90.7 L108.5 86.9 L110.8 83.9 L113.0 81.7 L115.3 80.4 L117.5 80.0 L119.7 80.4 L122.0 81.7 L124.2 83.9 L126.5 86.9 L128.8 90.7 L131.0 95.3 L133.2 100.5 L135.5 106.5 L137.8 113.0 L140.0 120.0 L142.2 127.5 L144.5 135.3 L146.8 143.4 L149.0 151.6 L151.2 160.0 L153.5 168.4 L155.8 176.6 L158.0 184.7 L160.2 192.5 L162.5 200.0 L164.8 207.0 L167.0 213.5 L169.2 219.5 L171.5 224.7 L173.8 229.3 L176.0 233.1 L178.2 236.1 L180.5 238.3 L182.8 239.6 L185.0 240.0 L187.2 239.6 L189.5 238.3 L191.8 236.1 L194.0 233.1 L196.2 229.3 L198.5 224.7 L200.8 219.5 L203.0 213.5 L205.2 207.0 L207.5 200.0 L209.8 192.5 L212.0 184.7 L214.2 176.6 L216.5 168.4 L218.8 160.0 L221.0 151.6 L223.2 143.4 L225.5 135.3 L227.8 127.5 L230.0 120.0 L232.2 113.0 L234.5 106.5 L236.8 100.5 L239.0 95.3 L241.2 90.7 L243.5 86.9 L245.8 83.9 L248.0 81.7 L250.3 80.4 L252.5 80.0 L254.8 80.4 L257.0 81.7 L259.2 83.9 L261.5 86.9 L263.8 90.7 L266.0 95.3 L268.2 100.5 L270.5 106.5 L272.8 113.0 L275.0 120.0 L277.2 127.5 L279.5 135.3 L281.8 143.4 L284.0 151.6 L286.2 160.0 L288.5 168.4 L290.8 176.6 L293.0 184.7 L295.2 192.5 L297.5 200.0 L299.8 207.0 L302.0 213.5 L304.2 219.5 L306.5 224.7 L308.8 229.3 L311.0 233.1 L313.2 236.1 L315.5 238.3 L317.8 239.6 L320.0 240.0" fill="none" stroke="#2C4A40" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></g><g data-tip="القيمة المتوسطة ⟦VI⟧ (الخط المتقطع): هي القدرة الفعالة ⟦P = VI = RI²⟧."><line x1="50" y1="160" x2="320" y2="160" stroke="#12855A" stroke-width="2.5" stroke-dasharray="7 5"/><text x="44" y="164" text-anchor="end" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">VI</text><rect x="20" y="148" width="300" height="24" rx="6" fill="transparent"/></g><g data-tip="القيمة العظمى ⟦2VI⟧: ضعف القيمة المتوسطة."><line x1="50" y1="80" x2="117.5" y2="80" stroke="#8A9A93" stroke-width="1.6" stroke-dasharray="4 4"/><text x="44" y="84" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2VI</text><rect x="10" y="68" width="107.5" height="24" rx="6" fill="transparent"/></g><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مقاومة: القدرة لا تكون سالبة أبداً</text></svg>`,
   cap:'القدرة اللحظية في مقاومة كما في الشكل <span class="ltr">(1-50)</span>.<br><b>مرّر المؤشر على المنحنى والخطين المتقطعين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في مقاومة، القدرة اللحظية تتذبذب بين \(0\) و\(2VI\). كم قيمتها المتوسطة؟`,opts:[
     [String.raw`\(2VI\)`,false,'هذه القيمة العظمى، لا المتوسطة.'],
     [String.raw`صفر`,false,'المتوسط صفر للملف والمكثف، أما المقاومة فقدرتها موجبة دائماً.'],
     [String.raw`\(VI\)`,true,String.raw`المعادلة (1-48): \(P=VI=RI^2=\frac{V^2}{R}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>نلاحظ أن القيمة المتوسطة للقدرة اللحظية هي</p><div class="eq">$$P=\frac{1}{T}\int_0^T p(t)\,dt=VI\cos\theta$$<span class="eqno">(1-46)</span></div>
     <p>ونسميها <b>القدرة الفعالة أو الحقيقية</b> للحمل، وهي القدرة التي يستهلكها الحمل فعلياً (التي تتحول إلى حرارة في مقاومة مثلاً)، ووحدتها <b>الواط</b> (Watt ورمزه W).</p>
     <p>ففي حالة حمل مادي مقاومته R فإن الجهد والتيار لهما نفس الطور وتكون الزاوية θ = 0 وبهذا فإن القدرة اللحظية تصبح</p>
     <div class="eq">$$p_R(t)=VI-VI\cos2\omega t$$<span class="eqno">(1-47)</span></div>
     <p>وهي مبينة في الشكل <span class="ltr">1-50</span>. نلاحظ أن هذه القدرة <b>موجبة في كل لحظة</b> وهي متذبذبة حول قيمتها المتوسطة</p>
     <div class="eq">$$P=VI=RI^2=\frac{V^2}{R}$$<span class="eqno">(1-48)</span></div>
     <p>بتردد 2f حيث f هو تردد الجهد (والتيار). وهذا يعني أن الحمل المادي يستهلك كل القدرة التي تأتيه من المصدر. أما الشغل الكهربائي المستهلك في المقاومة خلال دورة تيار كاملة فهو</p>
     <div class="eq">$$W_R=\int_0^T p_R(t)\,dt=VIT=RI^2T=\frac{V^2}{R}T$$<span class="eqno">(1-49)</span></div>
     <p>أما في حالة حمل حثي (سعوي) فإن الجهد يتقدم (يتأخر) على التيار بزاوية θ = <span class="ltr">90°</span> وبهذا فإن القدرة الفعالة تساوي <b>الصفر</b>، وعليه فإن كلاً من الحمل الحثي والحمل السعوي لا يستهلكان أي قدرة فعلياً وإنما <b>يستعيرانها</b> كما سنرى فيما بعد.</p>`,ref:'ص 64'},
    {tip:String.raw`<p>عوّض \(\theta=0\) في (1-44): \(\cos0=1\) و\(\sin0=0\)، فيبقى \(VI-VI\cos2\omega t\)، وهي (1-47). والحد \(VI\cos2\omega t\) يتذبذب بين \(+VI\) و\(-VI\)، فتتذبذب \(p_R\) بين \(0\) و\(2VI\).</p>
     <p>وعوّض \(\theta=90^\circ\) في (1-46): \(\cos90^\circ=0\)، فالقدرة الفعالة صفر للملف والمكثف.</p>`,title:'من (1-44) إلى (1-47)'},
    {add:String.raw`<p>سخان الماء والمكواة والفرن الكهربائي أحمال مادية تقريباً: كل ما تأخذه من المصدر يتحول إلى حرارة، ولذلك يكتب عليها رقم واحد بالواط.</p>`,title:'أحمال مادية من حولك'},
    {watch:String.raw`<p>القدرة اللحظية في المقاومة تتذبذب بتردد <b>2f</b> لا f: في كل دورة جهد تكمل القدرة دورتين (قمتين).</p>`},
    {title:'مختبر مصغّر: P = VI cos θ',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر زاوية المعاوقة \\(\\theta\\) وراقب كم يبقى من \\(VI\\) قدرةً فعالة. الزاوية <b>رقم تختاره أنت</b>.',
 predict:{q:'في ملف نقي (<span class="ltr">θ = 90°</span>) كم تكون القدرة الفعالة؟',opts:[
  ['\\(VI\\)',false,'هذا في المقاومة (<span class="ltr">θ = 0</span>).'],
  ['صفر',true,'\\(\\cos90^\\circ=0\\): الملف «يستعير» القدرة ولا يستهلكها (ص 64).'],
  ['نصف \\(VI\\)',false,'هذا عند <span class="ltr">θ = 60°</span>.']]},
 ins:[{k:'th',l:'زاوية المعاوقة θ',min:0,max:90,step:5,v:30,fmt:v=>v+'°'}],
 tp:{id:'u1-l12',defs:[{k:'V',label:'الجهد الفعال للمصدر V',unit:'V',value:220,min:1,max:100000},{k:'I',label:'التيار الفعال في الحمل I',unit:'A',value:5,min:0.01,max:10000},{k:'f',label:'التردد f',unit:'Hz',value:60,min:1,max:1000}]},
 calc:(s,v,B)=>{const VI=v.V*v.I,c=Math.cos(s.th*Math.PI/180),Pw=VI*c;
  return {facts:[['V',DCML.fm(B,v.V,0)+' V'],['I',DCML.fm(B,v.I,2)+' A'],['cos θ',DCML.fm(B,c,3)],['<span class="ltr">P = VI cos θ</span>',DCML.fm(B,Pw,0)+' W','hi']],
   bars:[{l:'VI',v:VI,max:VI,u:'VA',dp:0,col:'--line'},{l:'P',v:Pw,max:VI,u:'W',dp:0,col:'--on'}],
   msg:s.th===0?'مقاومة: \\(P=VI\\) <span class="ltr">(1-48)</span>، تستهلك كل ما يأتيها.':s.th===90?'ملف (أو مكثف): \\(P=0\\)، لا يستهلك شيئاً.':'كلما كبرت الزاوية قلّ الجزء المستهلك فعلياً.'}}})}
   ]},

  {st:3,short:'الظاهرية ومعامل القدرة',title:'القدرة الظاهرية <span class="ltr">S</span> ومعامل القدرة',ref:'ص 65',
   q:'محوّل يتحمل تياراً معيناً عند جهد معين… هل كل ما يمر فيه يتحول إلى قدرة مستهلكة فعلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقياس معامل القدرة من صفر للملف أو المكثف إلى واحد للمقاومة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="50" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="rtl">معامل القدرة</text><text x="180" y="76" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">cosθ = P / S</text><rect x="60" y="156" width="240" height="28" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g data-tip="⟦cosθ = 0⟧: حمل حثي بحت (ملف) أو سعوي بحت (مكثف): لا يستهلك شيئاً من القدرة الظاهرية فعلياً."><circle cx="60" cy="170" r="9" fill="#E8735A"/><text x="60" y="212" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">0</text><text x="68" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">ملف أو مكثف</text><rect x="30" y="150" width="80" height="100" rx="6" fill="transparent"/></g><g data-tip="⟦cosθ = 1⟧: حمل مادي (مقاومة)، ⟦θ = 0⟧: كل القدرة الظاهرية تُستهلك فعلياً (تتحول إلى حرارة)."><circle cx="300" cy="170" r="9" fill="#12855A"/><text x="300" y="212" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">1</text><text x="292" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">مقاومة</text><rect x="260" y="150" width="80" height="100" rx="6" fill="transparent"/></g><text x="180" y="138" text-anchor="middle" font-size="12.5" fill="#12855A" font-weight="700" direction="rtl">كلما اقترب من الواحد كان أحسن</text><g data-tip="القدرة الظاهرية ⟦S = VI⟧ بالفولت أمبير ⟦VA⟧، والفعالة ⟦P = S cosθ⟧ بالواط ⟦W⟧."><rect x="80" y="250" width="200" height="42" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P = S cosθ</text><rect x="80" y="250" width="200" height="42" rx="6" fill="transparent"/></g></svg>`,
   cap:'معامل القدرة بين الصفر (ملف أو مكثف) والواحد (مقاومة).<br><b>مرّر المؤشر على طرفي المقياس وعلى البطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما معامل القدرة لحمل على شكل مقاومة فقط؟',opts:[
     ['صفر',false,'الصفر للملف أو المكثف وحده.'],
     ['واحد',true,String.raw`\(\theta=0\) و\(\cos0=1\): كل القدرة الظاهرية تُستهلك فعلياً.`],
     ['0.5',false,'المقاومة لا تستعير شيئاً، فكل قدرتها فعالة.']]}}
   ],
   body:[
    {book:String.raw`<p>القدرة الظاهرية S في حمل معاوقته Z هي حاصل ضرب القيمة الفعالة للتيار المار في هذا الحمل والقيمة الفعالة للجهد بين طرفيه، ووحدتها <b>الفولت أمبير (VA)</b>، أي</p>
     <div class="eq">$$S=VI=ZI^2=\frac{V^2}{Z}$$<span class="eqno">(1-50)</span></div>
     <p>ورغم أنها ليست هي القدرة المستهلكة فعلياً في كل الحالات إلا أنها مهمة في تحديد القدرة القصوى (المتوفرة عند تيار وجهد معينين) لعدد من الأجهزة كالمحولات مثلاً. ومن المعادلتين <span class="ltr">1-46</span> و<span class="ltr">1-50</span> نرى أن</p>
     <div class="eq">$$P=S\cos\theta$$<span class="eqno">(1-51)</span></div><p>ونسمي النسبة</p><div class="eq">$$\cos\theta=\frac{P}{S}$$<span class="eqno">(1-52)</span></div>
     <p><b>معامل القدرة</b>، لأنه يعطي نسبة القدرة المتوفرة التي تستهلك فعلياً من طرف الحمل. فبالنسبة للحمل الذي على شكل مقاومة فإن θ = 0، وبهذا فإن كل القدرة الظاهرية الداخلة في المقاومة ستستهلك فعلياً. أما بالنسبة لحمل حثي أو سعوي فإن cosθ = 0 ولن يستهلك هذا النوع من الأحمال أي جزء من القدرة الظاهرية فعلياً.</p>
     <p>وكلما كان معامل القدرة قريباً من الواحد، كلما كان استعمال القدرة المتوفرة أحسن. وفي الحالات التي يكون فيها هذا المعامل صغيراً، نلجأ إلى <b>تحسينه</b> أي الرفع من قيمته.</p>`,ref:'ص 65'},
    {tip:String.raw`<p>القدرة الظاهرية \(S=VI\) هي ما يجب أن يتحمله المصدر والأسلاك (الجهد والتيار معاً). أما ما يتحول فعلاً إلى حرارة أو شغل فهو الجزء \(P=S\cos\theta\) فقط.</p>
     <p>فمعامل القدرة يجيب عن سؤال: «من كل ما يمر في الأسلاك، كم نسبة ما يُستفاد منه فعلاً؟»</p>`,title:'معنى المعامل'},
    {add:String.raw`<p>لهذا تُكتب قدرة المحولات والمولدات على لوحاتها بالفولت أمبير (<span class="ltr">kVA</span>) لا بالواط: لأن ما يحدد تسخين ملفاتها هو التيار والجهد، أياً كان معامل قدرة الحمل الذي تغذيه. أما طريقة تحسين معامل القدرة فلم يشرحها الكتاب؛ تجدها في الدرس التالي تحت «إضافة من خارج الكتاب».</p>`,title:'لماذا VA على لوحة المحول؟'},
    {watch:String.raw`<p>لا تخلط بين الوحدات: القدرة الفعالة بالواط <span class="ltr">W</span>، والظاهرية بالفولت أمبير <span class="ltr">VA</span>، والمفاعلة (المحطة التالية) بالفار <span class="ltr">VAR</span>.</p>`},
    {title:'تحقق سريع: القدرة الظاهرية ومعامل القدرة',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['وحدة القدرة الظاهرية الفولت أمبير (VA).',true,'المعادلة <span class="ltr">(1-50)</span>.'],
     ['القدرة الظاهرية هي دائماً القدرة المستهلكة فعلياً.',false,'الكتاب: «ليست هي القدرة المستهلكة فعلياً في كل الحالات»؛ المستهلكة \\(P=S\\cos\\theta\\).'],
     ['القدرة الظاهرية مهمة لتحديد القدرة القصوى لأجهزة كالمحولات.',true,'نص الكتاب في ص 65.'],
     ['كلما اقترب معامل القدرة من الواحد كان استعمال القدرة المتوفرة أحسن.',true,'وعندما يكون صغيراً نلجأ إلى تحسينه.'],
     ['معامل القدرة لملف نقي يساوي واحداً.',false,'\\(\\cos90^\\circ=0\\): الملف لا يستهلك أي جزء من القدرة الظاهرية.']]})}
   ]},

  {st:4,short:'القدرة المفاعلة',title:'القدرة غير الفعالة (المفاعلة) <span class="ltr">Q</span>',ref:'ص 65–67',
   q:'الملف والمكثف لا يستهلكان قدرة… فلماذا يسحبان تياراً من المصدر أصلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المصدر يعطي الطاقة للملف والمكثف ثم يستردها: سهم أخضر ذهاباً وسهم برتقالي إياباً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">طاقة تُستعار ثم تُعاد</text><g data-tip="المصدر: يعطي الطاقة ثم يستردها كل ربع دورة."><rect x="30" y="120" width="80" height="80" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="70" cy="160" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M60 160 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><rect x="30" y="120" width="80" height="80" rx="6" fill="transparent"/></g><text x="70" y="222" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المصدر</text><g data-tip="الملف: يخزن الطاقة في مجاله المغناطيسي ثم يعيدها. قدرته المفاعلة ⟦QL⟧ موجبة: نقول إنه «يستهلك» القدرة المفاعلة."><rect x="240" y="62" width="90" height="74" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M263 99 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0 a5.5 5.5 0 0 1 11.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="285" y="128" text-anchor="middle" font-size="12" fill="#B5523C" font-weight="700" direction="ltr" font-family="var(--mono)">Q<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan> > 0</text><rect x="240" y="62" width="90" height="74" rx="6" fill="transparent"/></g><g data-tip="المكثف: يخزن الطاقة في مجاله الكهروستاتيكي ثم يعيدها. قدرته المفاعلة ⟦QC⟧ سالبة: نقول إنه «يولد» القدرة المفاعلة."><rect x="240" y="186" width="90" height="74" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M263 215 L280 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 215 L307 215" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="280" y1="203" x2="280" y2="227" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="290" y1="203" x2="290" y2="227" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="285" y="252" text-anchor="middle" font-size="12" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">Q<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan> < 0</text><rect x="240" y="186" width="90" height="74" rx="6" fill="transparent"/></g><line x1="118.0" y1="130.0" x2="224.3" y2="102.0" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="232.0,100.0 225.5,106.7 223.0,97.4" fill="#12855A"/><line x1="232.0" y1="116.0" x2="125.7" y2="144.0" stroke="#E8735A" stroke-width="2.6" stroke-linecap="round"/><polygon points="118.0,146.0 124.5,139.3 127.0,148.6" fill="#E8735A"/><line x1="118.0" y1="199.0" x2="224.1" y2="218.6" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="232.0,220.0 223.3,223.3 225.0,213.8" fill="#12855A"/><line x1="232.0" y1="236.0" x2="125.9" y2="216.4" stroke="#E8735A" stroke-width="2.6" stroke-linecap="round"/><polygon points="118.0,215.0 126.7,211.7 125.0,221.2" fill="#E8735A"/><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P = 0</text></svg>`,
   cap:'الملف والمكثف يستعيران الطاقة من المصدر ثم يعيدانها، فلا يستهلكان شيئاً في المتوسط.<br><b>مرّر المؤشر على المصدر والملف والمكثف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`ما إشارة القدرة المفاعلة \(Q_C\) للمكثف؟`,opts:[
     ['موجبة',false,String.raw`الموجبة \(Q_L\) للملف.`],
     ['صفر',false,'الصفر هو قدرته الفعالة، لا المفاعلة.'],
     ['سالبة',true,String.raw`المعادلة (1-57): \(Q_C=-VI\)، ولهذا نقول إن المكثف «يولد» القدرة المفاعلة.`]]}}
   ],
   body:[
    {book:String.raw`<p>في حالة حمل حثي (ملف) نعوض الزاوية θ بـ <span class="ltr">90°</span> في المعادلة <span class="ltr">1-44</span>، وبهذا تصبح القدرة اللحظية</p>
     <div class="eq">$$p_L(t)=VI\sin2\omega t$$<span class="eqno">(1-53)</span></div>
     <p>وكما نرى فإنها متذبذبة بتردد يساوي ضعف تردد التيار وبقيمة قصوى تساوي القدرة الظاهرية، كما أن قيمتها المتوسطة معدومة. ويبين الشكل <span class="ltr">1-51</span> القدرة \(p_L\) وموجات الجهد والتيار في الحمل الحثي. وهنا فإن الحمل يستعير القدرة الظاهرية VI من المصدر (\(p_L\) موجبة) عندما تتساوى إشارة الجهد مع إشارة التيار، وعندئذ فإن الملف يحول طاقة المصدر إلى <b>طاقة مغناطيسية</b> تتخزن في مجاله المغناطيسي. وعندما تختلف الإشارتان فإن الطاقة المغناطيسية تتحول إلى طاقة كهربائية وترجع إلى المصدر. وهكذا فلن يستهلك الملف أي قدرة.</p>`,ref:'ص 65–66'},
    {html:`<figure style="margin:0;text-align:center;font-size:13px;color:var(--muted)">${box(powFig('L'),520)}الشكل <span class="ltr">(1-51)</span>: القدرة اللحظية والجهد والتيار في ملف</figure>`},
    {book:String.raw`<p>وفي حالة حمل سعوي (مكثف) فإننا نعوض الزاوية θ بـ <span class="ltr">−90°</span> في المعادلة <span class="ltr">1-44</span>، وهكذا تصبح القدرة اللحظية</p>
     <div class="eq">$$p_C(t)=-VI\sin2\omega t$$<span class="eqno">(1-54)</span></div>
     <p>وهي كذلك متذبذبة بضعف التردد، قيمتها القصوى تساوي القدرة الظاهرية، وقيمتها المتوسطة معدومة. ويبين الشكل <span class="ltr">1-52</span> القدرة \(p_C\) وموجات الجهد والتيار. وهنا كذلك يستعير الحمل القدرة الظاهرية VI من المصدر (\(p_C\) موجبة) عندما تتساوى إشارتا الجهد والتيار، فيخزن المكثف طاقة المصدر في <b>مجاله الكهروستاتيكي</b>، وعندما تختلف الإشارتان تسترجع الطاقة المخزنة إلى المصدر. وهكذا فلن يستهلك المكثف أي قدرة.</p>`,ref:'ص 66'},
    {html:`<figure style="margin:0;text-align:center;font-size:13px;color:var(--muted)">${box(powFig('C'),520)}الشكل <span class="ltr">(1-52)</span>: القدرة اللحظية والجهد والتيار في مكثف</figure>`},
    {book:String.raw`<p>وعلى العموم نعرف <b>القدرة غير الفعالة أو المفاعلة Q</b> في أي حمل معاوقته \(Z = Z\angle\theta\) بالمعادلة</p>
     <div class="eq">$$Q=VI\sin\theta$$<span class="eqno">(1-55)</span></div>
     <p>ووحدتها <b>الفولت-أمبير مفاعل</b> (volt-ampere reactive ورمزه VAR)، وهي نسبة القدرة الظاهرية التي تستعار من طرف الحمل لإحداث مجال مغناطيسي (ملف) أو مجال كهروستاتيكي (مكثف). ففي ملف ممانعته \(X_L\):</p>
     <div class="eq">$$Q_L=VI=X_L I^2=\frac{V^2}{X_L}$$<span class="eqno">(1-56)</span></div>
     <p>وكما نرى فإنها موجبة، ولهذا نقول أن الملف «يستهلك» القدرة المفاعلة. وفي مكثف ممانعته \(X_C\):</p>
     <div class="eq">$$Q_C=-VI=-X_C I^2=-\frac{V^2}{X_C}$$<span class="eqno">(1-57)</span></div>
     <p>وهي سالبة، ولهذا السبب نقول إن المكثف «يولد» القدرة المفاعلة.</p>`,ref:'ص 67'},
    {title:'تابع الطاقة خلال ربع دورة بعد ربع',widget:(el,B)=>{
      const D={L:['إشارتا v و i متساويتان','القدرة p موجبة','الملف يخزن الطاقة في مجاله المغناطيسي','الإشارتان مختلفتان','p سالبة: الطاقة ترجع إلى المصدر','المتوسط صفر: لا استهلاك'],
               C:['إشارتا v و i متساويتان','القدرة p موجبة','المكثف يخزن الطاقة في مجاله الكهروستاتيكي','الإشارتان مختلفتان','p سالبة: الطاقة تسترجع إلى المصدر','المتوسط صفر: لا استهلاك'],
               R:['إشارتا v و i متساويتان دائماً','القدرة p موجبة في كل لحظة','الطاقة تتحول إلى حرارة ولا ترجع','المتوسط VI: كل القدرة مستهلكة']};
      let k='L',tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=D[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الحمل:</span><span class="mseg">${[['R','مقاومة'],['L','ملف'],['C','مكثف']].map(([v,l])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
         <div class="chain" style="margin-top:12px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {tip:String.raw`<div class="cb-tbl"><table class="tt"><thead><tr><th>القدرة</th><th>القانون</th><th>الوحدة</th><th>معناها</th></tr></thead><tbody>
     <tr><td>اللحظية p</td><td>\(v\cdot i\)</td><td>W</td><td>قيمة القدرة في كل لحظة</td></tr><tr><td>الفعالة P</td><td>\(VI\cos\theta\)</td><td>W</td><td>ما يتحول فعلاً إلى حرارة أو شغل</td></tr>
     <tr><td>الظاهرية S</td><td>\(VI\)</td><td>VA</td><td>ما يجب أن يتحمله المصدر والأسلاك</td></tr><tr><td>المفاعلة Q</td><td>\(VI\sin\theta\)</td><td>VAR</td><td>ما يُستعار ويُعاد (+ للملف، − للمكثف)</td></tr></tbody></table></div>`,title:'أنواع القدرة الأربعة في جدول'},
    {watch:String.raw`<p>«يستهلك» و«يولد» للقدرة المفاعلة كلمتان اصطلاحيتان (لذلك وضعهما الكتاب بين علامتي تنصيص): لا الملف يستهلك طاقة فعلاً، ولا المكثف ينتجها من العدم. المعنى أن إشارتيهما متعاكستان، فإذا اجتمعا ألغى أحدهما جزءاً من الآخر.</p>`}
   ]},

  {recap:[
   String.raw`القدرة اللحظية \(p(t)=v(t)\,i(t)\) (1-43): موجبة إذا تساوت إشارتا الجهد والتيار، وسالبة إذا اختلفتا، وتتذبذب بضعف التردد (1-44).`,
   String.raw`القدرة الفعالة متوسط القدرة اللحظية \(P=VI\cos\theta\) (1-46) بالواط، وفي المقاومة \(P=VI=RI^2=V^2/R\) (1-48).`,
   String.raw`القدرة الظاهرية \(S=VI\) (1-50) بالفولت أمبير، و\(P=S\cos\theta\) (1-51)، ومعامل القدرة \(\cos\theta=P/S\) (1-52).`,
   String.raw`القدرة المفاعلة \(Q=VI\sin\theta\) (1-55) بالفار: \(Q_L=X_LI^2\) موجبة (1-56)، و\(Q_C=-X_CI^2\) سالبة (1-57).`,
   String.raw`الملف والمكثف لا يستهلكان قدرة فعالة: يستعيران الطاقة ثم يعيدانها، كما في (1-53) و(1-54).`]}
],
 theory:[
  {h:'الفصل الثالث: القدرة الكهربائية للتيار المتردد — مقدمة',ref:'ص 63',html:`<p>عندما نغذي حملاً معاوقته \\(Z = Z\\angle\\theta\\) بالجهد \\(v(t)=V_m\\sin\\omega t=V\\sqrt2\\sin\\omega t\\) فإن التيار \\(i(t)=I_m\\sin(\\omega t-\\theta)=I\\sqrt2\\sin(\\omega t-\\theta)\\) سيمر في هذا الحمل. وفي اللحظة t فإن القدرة الداخلة في الحمل هي</p>
   $$p(t)=v(t)\\,i(t) \\qquad 1\\text{-}43$$
   <p>وتسمى <b>القدرة اللحظية</b> للحمل. وتكون هذه القدرة <b>موجبة</b> عندما تكون إشارة التيار تساوي إشارة الجهد، وفي هذه الحالة نقول إن الحمل يستهلك تلك القدرة. أما إذا اختلفت الإشارتان فإن القدرة تكون <b>سالبة</b>، وهنا يصبح «الحمل» مصدراً للقدرة.</p>
   <p>وبتعويض قيمتي الجهد والتيار نجد أن:</p>
   $$p(t)=VI\\cos\\theta-VI\\cos\\theta\\cos2\\omega t+VI\\sin\\theta\\sin2\\omega t \\qquad 1\\text{-}44$$
   <p>وكما نلاحظ فإن القدرة اللحظية تتركب من ثلاثة أجزاء: جزء ثابت ويمثل القيمة المتوسطة، وجزءان يتذبذبان بتردد يساوي <b>ضعف</b> تردد الجهد (والتيار). أما الشغل الكهربائي الذي يبذل في الحمل بين الفترتين الزمنيتين \\(t_1\\) و\\(t_2\\) فهو</p>
   $$W=\\int_{t_1}^{t_2}p(t)\\,dt \\qquad 1\\text{-}45$$<p>ووحدته الجول (Joule ورمزه J).</p>`},
  {err:'<span class="fixnote"><b>ملاحظة على الكتاب — إشارة الحد الأخير في 1-44 (ص 63):</b> إذا كان الجهد هو المرجع كما كُتب (\\(v = V\\sqrt2\\sin\\omega t\\) و\\(i = I\\sqrt2\\sin(\\omega t-\\theta)\\)) فالحد الأخير إشارته <b>سالبة</b>: \\(p(t)=VI\\cos\\theta-VI\\cos\\theta\\cos2\\omega t\\,\\mathbf{-}\\,VI\\sin\\theta\\sin2\\omega t\\). أما إذا أخذنا <b>التيار</b> مرجعاً (\\(i = I\\sqrt2\\sin\\omega t\\) و\\(v = V\\sqrt2\\sin(\\omega t+\\theta)\\)) فالمعادلة 1-44 صحيحة كما طُبعت، وعلى هذا الأساس رُسم الشكلان 1-51 و1-52 وكُتبت المعادلتان 1-53 و1-54. القيمة المتوسطة \\(VI\\cos\\theta\\) لا تتأثر بالاختيار. في المختبر مفتاح «المرجع: التيار / الجهد» لترى الفرق.</span>'},
  {h:'القدرة الفعالة',ref:'ص 64',html:`<p>نلاحظ أن القيمة المتوسطة للقدرة اللحظية هي</p>$$P=\\frac{1}{T}\\int_0^T p(t)\\,dt=VI\\cos\\theta \\qquad 1\\text{-}46$$
   <p>ونسميها <b>القدرة الفعالة أو الحقيقية</b> للحمل، وهي القدرة التي يستهلكها الحمل فعلياً (التي تتحول إلى حرارة في مقاومة مثلاً)، ووحدتها <b>الواط</b> (Watt ورمزه W).</p>
   <p>ففي حالة حمل مادي مقاومته R فإن الجهد والتيار لهما نفس الطور وتكون الزاوية θ = 0 وبهذا فإن القدرة اللحظية تصبح</p>
   $$p_R(t)=VI-VI\\cos2\\omega t \\qquad 1\\text{-}47$$
   <p>وهي مبينة في الشكل 1-50. نلاحظ أن هذه القدرة <b>موجبة في كل لحظة</b> وهي متذبذبة حول قيمتها المتوسطة</p>
   $$P=VI=RI^2=\\frac{V^2}{R} \\qquad 1\\text{-}48$$
   <p>بتردد 2f حيث f هو تردد الجهد (والتيار). وهذا يعني أن الحمل المادي يستهلك كل القدرة التي تأتيه من المصدر. أما الشغل الكهربائي المستهلك في المقاومة خلال دورة تيار كاملة فهو</p>
   $$W_R=\\int_0^T p_R(t)\\,dt=VIT=RI^2T=\\frac{V^2}{R}T \\qquad 1\\text{-}49$$`},
  {fig:'(1-50)',ref:'ص 64',caption:'القدرة اللحظية في مقاومة: تبدأ من الصفر وتصل إلى 2VI ولا تنزل تحت الصفر، وقيمتها المتوسطة VI (الخط المتقطع). تكمل دورتين في كل دورة للجهد.',draw:()=>box(powFig('R'),520)},
  {html:`<p>أما في حالة حمل حثي (سعوي) فإن الجهد يتقدم (يتأخر) على التيار بزاوية θ = 90° وبهذا فإن القدرة الفعالة تساوي <b>الصفر</b>، وعليه فإن كلاً من الحمل الحثي والحمل السعوي لا يستهلكان أي قدرة فعلياً وإنما <b>يستعيرانها</b> كما سنرى فيما بعد.</p>`},
  {h:'القدرة الظاهرية ومعامل القدرة',ref:'ص 65',html:`<p>القدرة الظاهرية S في حمل معاوقته Z هي حاصل ضرب القيمة الفعالة للتيار المار في هذا الحمل والقيمة الفعالة للجهد بين طرفيه، ووحدتها <b>الفولت أمبير (VA)</b>، أي</p>
   $$S=VI=ZI^2=\\frac{V^2}{Z} \\qquad 1\\text{-}50$$
   <p>ورغم أنها ليست هي القدرة المستهلكة فعلياً في كل الحالات إلا أنها مهمة في تحديد القدرة القصوى (المتوفرة عند تيار وجهد معينين) لعدد من الأجهزة كالمحولات مثلاً. ومن المعادلتين 1-46 و1-50 نرى أن</p>
   $$P=S\\cos\\theta \\qquad 1\\text{-}51$$<p>ونسمي النسبة</p>$$\\cos\\theta=\\frac{P}{S} \\qquad 1\\text{-}52$$
   <p><b>معامل القدرة</b>، لأنه يعطي نسبة القدرة المتوفرة التي تستهلك فعلياً من طرف الحمل. فبالنسبة للحمل الذي على شكل مقاومة فإن θ = 0، وبهذا فإن كل القدرة الظاهرية الداخلة في المقاومة ستستهلك فعلياً. أما بالنسبة لحمل حثي أو سعوي فإن cosθ = 0 ولن يستهلك هذا النوع من الأحمال أي جزء من القدرة الظاهرية فعلياً.</p>
   <p>وكلما كان معامل القدرة قريباً من الواحد، كلما كان استعمال القدرة المتوفرة أحسن. وفي الحالات التي يكون فيها هذا المعامل صغيراً، نلجأ إلى <b>تحسينه</b> أي الرفع من قيمته.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> مثال: محول مكتوب عليه <span class="ltr">10 kVA</span>. إذا غذّى حملاً معامل قدرته 1 أعطى <span class="ltr">10 kW</span>، وإذا كان معامل القدرة 0.6 أعطى <span class="ltr">6 kW</span> فقط مع أن تياره هو الحد الأقصى نفسه. الكتاب لا يشرح طريقة تحسين معامل القدرة؛ تجدها في الدرس التالي تحت عنوان «إضافة من خارج الكتاب».'},
  {h:'القدرة غير الفعالة (المفاعلة)',ref:'ص 65–67',html:`<p>في حالة حمل حثي (ملف) نعوض الزاوية θ بـ 90° في المعادلة 1-44، وبهذا تصبح القدرة اللحظية</p>
   $$p_L(t)=VI\\sin2\\omega t \\qquad 1\\text{-}53$$
   <p>وكما نرى فإنها متذبذبة بتردد يساوي ضعف تردد التيار وبقيمة قصوى تساوي القدرة الظاهرية، كما أن قيمتها المتوسطة معدومة. ويبين الشكل 1-51 القدرة \\(p_L\\) وموجات الجهد والتيار في الحمل الحثي. وهنا فإن الحمل يستعير القدرة الظاهرية VI من المصدر (\\(p_L\\) موجبة) عندما تتساوى إشارة الجهد مع إشارة التيار، وعندئذ فإن الملف يحول طاقة المصدر إلى <b>طاقة مغناطيسية</b> تتخزن في مجاله المغناطيسي. وعندما تختلف الإشارتان فإن الطاقة المغناطيسية تتحول إلى طاقة كهربائية وترجع إلى المصدر. وهكذا فلن يستهلك الملف أي قدرة.</p>`},
  {fig:'(1-51)',ref:'ص 66',caption:'القدرة اللحظية والجهد والتيار في ملف: \\(p_L\\) (المتصل) تتبدل إشارتها كل ربع دورة، والجهد v يتقدم على التيار i بـ 90°.',draw:()=>box(powFig('L'),520)},
  {html:`<p>وفي حالة حمل سعوي (مكثف) فإننا نعوض الزاوية θ بـ −90° في المعادلة 1-44، وهكذا تصبح القدرة اللحظية</p>
   $$p_C(t)=-VI\\sin2\\omega t \\qquad 1\\text{-}54$$
   <p>وهي كذلك متذبذبة بضعف التردد، قيمتها القصوى تساوي القدرة الظاهرية، وقيمتها المتوسطة معدومة. ويبين الشكل 1-52 القدرة \\(p_C\\) وموجات الجهد والتيار. وهنا كذلك يستعير الحمل القدرة الظاهرية VI من المصدر (\\(p_C\\) موجبة) عندما تتساوى إشارتا الجهد والتيار، فيخزن المكثف طاقة المصدر في <b>مجاله الكهروستاتيكي</b>، وعندما تختلف الإشارتان تسترجع الطاقة المخزنة إلى المصدر. وهكذا فلن يستهلك المكثف أي قدرة.</p>`},
  {fig:'(1-52)',ref:'ص 66',caption:'القدرة اللحظية والجهد والتيار في مكثف: \\(p_C = -VI\\sin2\\omega t\\)، والجهد يتأخر عن التيار بـ 90°.',draw:()=>box(powFig('C'),520)},
  {html:`<p>وعلى العموم نعرف <b>القدرة غير الفعالة أو المفاعلة Q</b> في أي حمل معاوقته \\(Z = Z\\angle\\theta\\) بالمعادلة <span class="ref">ص 67</span></p>
   $$Q=VI\\sin\\theta \\qquad 1\\text{-}55$$
   <p>ووحدتها <b>الفولت-أمبير مفاعل</b> (volt-ampere reactive ورمزه VAR)، وهي نسبة القدرة الظاهرية التي تستعار من طرف الحمل لإحداث مجال مغناطيسي (ملف) أو مجال كهروستاتيكي (مكثف). ففي ملف ممانعته \\(X_L\\):</p>
   $$Q_L=VI=X_L I^2=\\frac{V^2}{X_L} \\qquad 1\\text{-}56$$
   <p>وكما نرى فإنها موجبة، ولهذا نقول أن الملف «يستهلك» القدرة المفاعلة. وفي مكثف ممانعته \\(X_C\\):</p>
   $$Q_C=-VI=-X_C I^2=-\\frac{V^2}{X_C} \\qquad 1\\text{-}57$$
   <p>وهي سالبة، ولهذا السبب نقول إن المكثف «يولد» القدرة المفاعلة.</p>`},
  {note:`<b>توضيح للمتدرب (ليس من الكتاب) — ملخص:</b><div class="cb-tbl"><table class="tt"><thead><tr><th>القدرة</th><th>القانون</th><th>الوحدة</th><th>معناها</th></tr></thead><tbody>
   <tr><td>اللحظية p</td><td>\\(v\\cdot i\\)</td><td>W</td><td>قيمة القدرة في كل لحظة</td></tr><tr><td>الفعالة P</td><td>\\(VI\\cos\\theta\\)</td><td>W</td><td>ما يتحول فعلاً إلى حرارة أو شغل</td></tr>
   <tr><td>الظاهرية S</td><td>\\(VI\\)</td><td>VA</td><td>ما يجب أن يتحمله المصدر والأسلاك</td></tr><tr><td>المفاعلة Q</td><td>\\(VI\\sin\\theta\\)</td><td>VAR</td><td>ما يُستعار ويُعاد (+ للملف، − للمكثف)</td></tr></tbody></table></div>`}
 ],
 lab:(el)=>{
  let type='R',th=0,ref='i',play=1,al=0;const did={};
  el.innerHTML=`<div id="l12tp"></div><div class="grid cb-lab">
   <div class="panel c5"><h2>الحمل <small>مبنية على الأشكال (1-50) و(1-51) و(1-52) والمعادلات 1-43 إلى 1-57</small></h2>
    <div class="cb-row">${segHTML('ty',[['R','مقاومة (θ = 0)'],['L','ملف (θ = 90°)'],['C','مكثف (θ = −90°)'],['G','حمل عام']],type)}</div>
    <div id="l12g">${nsl('l12th','زاوية الحمل θ (تقدم الجهد على التيار)',-90,90,0.5,th,'°')}</div>
    <div class="cb-row"><span class="sub">المرجع:</span>${segHTML('rf',[['i','التيار (كما في الأشكال 1-51 و1-52)'],['v','الجهد (كما في نص 1-43)']],ref)}</div>
    <div class="cb-row"><button class="btn primary" id="l12pl">⏸ إيقاف</button><span class="sub">العرض مبطأ جداً.</span></div>
    <div class="facts">${fact('V (فعالة)','l12V')}${fact('I (فعالة)','l12I')}${fact('P = VI cosθ','l12P')}${fact('Q = VI sinθ','l12Q')}${fact('S = VI','l12S')}${fact('معامل القدرة cosθ','l12pf')}${fact('الشغل في دورة W = P·T','l12W')}</div></div>
   <div class="panel c7"><h2>الجهد والتيار والقدرة اللحظية</h2><div class="svgbox" id="l12w"></div>${legend([['--blue','v'],['--stop','i'],['--live','p = v·i'],['--fg','P (المتوسط)']])}
    <div class="ex-f" id="l12eq"></div>
    <div class="cb-row"><span id="l12chip" class="cb-chip"></span></div>
    <div class="facts">${fact('v الآن','l12vn')}${fact('i الآن','l12in')}${fact('p الآن','l12pn')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l12st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l12tp'),'u1-l12',[{k:'V',label:'الجهد الفعال للمصدر V',unit:'V',value:220,min:1,max:100000},{k:'I',label:'التيار الفعال في الحمل I',unit:'A',value:5,min:0.01,max:10000},{k:'f',label:'التردد f',unit:'Hz',value:60,min:1,max:1000}],()=>draw());
  const setTh=nslBind(el,'l12th',v=>{th=v;draw()});
  segBind(el,'ty',v=>{type=v;th=v==='R'?0:v==='L'?90:v==='C'?-90:th;setTh(th);$('#l12g').style.display=v==='G'?'':'none';did[v]=1;draw()});
  segBind(el,'rf',v=>{ref=v;did['ref'+v]=1;draw()});
  $('#l12pl').onclick=()=>{play=!play;$('#l12pl').textContent=play?'⏸ إيقاف':'▶ تشغيل'};
  $('#l12g').style.display='none';
  const unit=(x,u)=>{const a=Math.abs(x);if(chOn())return f1(x,2)+' '+u;   /* وضع التحدي: بلا بادئات (k و M) لتُقرأ القراءة رقماً واحداً */
   return a>=1e6?f1(x/1e6,3)+' M'+u:a>=1e3?f1(x/1e3,3)+' k'+u:f1(x,2)+' '+u};
  const sig=()=>{const V=TP.v.V,I=TP.v.I,t=th*D;return ref==='i'?{v:a=>V*SQ2*Math.sin(a+t),i:a=>I*SQ2*Math.sin(a)}:{v:a=>V*SQ2*Math.sin(a),i:a=>I*SQ2*Math.sin(a-t)}};
  function draw(){const V=TP.v.V,I=TP.v.I,c=Math.cos(th*D),s=Math.sin(th*D),Sx=V*I,P=Sx*c,Qx=Sx*s;
   $('#l12V').textContent=unit(V,'V');$('#l12I').textContent=unit(I,'A');$('#l12P').textContent=unit(Math.abs(P)<1e-9*Sx?0:P,'W');$('#l12Q').textContent=unit(Math.abs(Qx)<1e-9*Sx?0:Qx,'VAR');$('#l12S').textContent=unit(Sx,'VA');
   $('#l12pf').textContent=f1(c,3)+(Math.abs(s)<1e-9?'':s>0?' (متأخر)':' (متقدم)');$('#l12W').textContent=unit(P/TP.v.f,'J');
   const sgn=ref==='i'?'+':'-';$('#l12eq').innerHTML=B.tex(`p(t) = \\underbrace{${f1(P,1)}}_{VI\\cos\\theta} - ${f1(P,1)}\\cos2\\omega t ${sgn} ${f1(Qx,1)}\\sin2\\omega t\\ \\ \\text{W}`,true);
   const ch=$('#l12chip');ch.className='cb-chip '+(Math.abs(s)<1e-6?'ok':s>0?'hot':'ld');ch.textContent=Math.abs(s)<1e-6?'Q = 0: كل القدرة الظاهرية تُستهلك فعلياً':Math.abs(c)<1e-6?(s>0?'P = 0: الملف يستعير القدرة ويعيدها (Q موجبة)':'P = 0: المكثف يستعير القدرة ويعيدها (Q سالبة)'):(s>0?'حمل مادي - حثي: Q موجبة':'حمل مادي - سعوي: Q سالبة');
   render();steps.check()}
  function render(){const g=sig(),V=TP.v.V,I=TP.v.I,Vm=V*SQ2,Im=I*SQ2,VI=V*I,N=300,pv=[],pi=[],pp=[];
   for(let k=0;k<=N;k++){const a=4*PI*k/N;pv.push([a,g.v(a)/Vm]);pi.push([a,0.8*g.i(a)/Im]);pp.push([a,g.v(a)*g.i(a)/VI])}
   const P=Math.cos(th*D),pa=g.v(al)*g.i(al);
   const under=(X,Y)=>{let pos='',neg='';for(let k=0;k<N;k++){const a=pp[k],b=pp[k+1];const poly=(y0,y1)=>`M${fx(X(a[0]))} ${fx(Y(0))}L${fx(X(a[0]))} ${fx(Y(y0))}L${fx(X(b[0]))} ${fx(Y(y1))}L${fx(X(b[0]))} ${fx(Y(0))}Z`;if(a[1]>=0&&b[1]>=0)pos+=poly(a[1],b[1]);else if(a[1]<=0&&b[1]<=0)neg+=poly(a[1],b[1])}
     return `<path d="${pos}" fill="var(--live)" opacity=".18"/><path d="${neg}" fill="var(--stop)" opacity=".22"/>`};
   $('#l12w').innerHTML=plotSVG({w:640,h:280,x0:0,x1:4*PI,y0:-1.15,y1:2.1,xt:[0,PI,2*PI,3*PI,4*PI],xf:v=>['0','π','2π','3π','4π'][Math.round(v/PI)],yt:[-1,0,1,2],yf:v=>v===0?'0':v+' VI',xl:'α = ωt',series:[{pts:pv,col:'--blue',w:1.6,dash:'6 4'},{pts:pi,col:'--stop',w:1.6,dash:'2 4'},{pts:pp,col:'--live',w:2.6}],under,
    extra:(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(P))}H${fx(X(4*PI))}" stroke="var(--fg)" stroke-width="2" stroke-dasharray="8 5"/>`+S.t(fx(X(4*PI)-4),fx(Y(P)-6),'P','','end')+`<path d="M${fx(X(al))} 16V242" stroke="var(--fg)" stroke-width="1.2"/><circle cx="${fx(X(al))}" cy="${fx(Y(pa/VI))}" r="5" fill="var(--live)"/>`,aria:'الجهد والتيار والقدرة اللحظية'});
   $('#l12vn').textContent=f1(g.v(al),1)+' V';$('#l12in').textContent=f1(g.i(al),2)+' A';$('#l12pn').textContent=(pa>=0?'':'')+f1(pa,0)+' W '+(pa>1e-9*VI?'← للحمل':pa<-1e-9*VI?'← للمصدر':'')}
  const steps=stepsUI($('#l12st'),[
   {t:'مقاومة',x:'اختر «مقاومة»: منحنى القدرة لا ينزل تحت الصفر ويتذبذب بضعف التردد بين 0 و 2VI حول المتوسط P = VI = S (الشكل 1-50). معامل القدرة 1.',done:()=>did.R&&type==='R'},
   {t:'ملف',x:'اختر «ملف»: نصف الوقت p موجبة (الملف يخزن طاقة مغناطيسية) ونصفه سالبة (يعيدها). المتوسط P = 0 والقدرة المفاعلة Q = +VI.',done:()=>did.L&&type==='L'},
   {t:'مكثف',x:'اختر «مكثف»: نفس الشكل لكن معكوس (\\(p_C = -VI\\sin2\\omega t\\))، و Q = −VI: المكثف «يولد» قدرة مفاعلة.',done:()=>did.C&&type==='C'},
   {t:'معامل قدرة 0.5',x:'اختر «حمل عام» واجعل θ = 60°: P = S/2، والمساحة الحمراء (القدرة الراجعة) أصغر من البرتقالية.',done:()=>type==='G'&&Math.abs(th-60)<0.3},
   {t:'غيّر المرجع',x:'بدّل المرجع إلى «الجهد»: تنزاح الموجات كلها، وتنقلب إشارة الحد الأخير في المعادلة (هذا هو خطأ الإشارة في 1-44)، لكن P و Q و S لا تتغير.',done:()=>did.refv&&ref==='v'}
  ]);
  draw();
  loopOn(el,dt=>{if(play){al=(al+dt*PI*0.5)%(4*PI);render()}steps.check()});
 },
 quiz:[
  {q:'القدرة اللحظية p(t) تساوي:',o:['V·I','v(t)·i(t)','VI cosθ','VI sinθ'],c:1,e:'المعادلة 1-43.'},
  {q:'بأي تردد تتذبذب القدرة اللحظية؟',o:['f','ضعف تردد الجهد 2f','نصف التردد','لا تتذبذب'],c:1,e:'ص 63.'},
  {q:'القدرة الفعالة P تساوي:',o:['VI','VI cosθ','VI sinθ','V/I'],c:1,e:'المعادلة 1-46، ووحدتها الواط.'},
  {q:'وحدة القدرة الظاهرية:',o:['W','VAR','VA','J'],c:2,e:'المعادلة 1-50.'},
  {q:'حمل جهده 220 V وتياره 5 A ومعامل قدرته 0.8. قدرته الفعالة:',o:['1100 W','880 W','660 W','275 W'],c:1,e:'\\(220\\times5\\times0.8 = 880\\) W.'},
  {q:'القدرة الفعالة في ملف نقي:',o:['VI','صفر','VI/2','2VI'],c:1,e:'θ = 90° فإن cosθ = 0: الملف يستعير القدرة ولا يستهلكها.'},
  {q:'إشارة القدرة المفاعلة للمكثف:',o:['موجبة: «يستهلك»','سالبة: «يولد»','صفر','تعتمد على الجهد'],c:1,e:'المعادلة 1-57: \\(Q_C = -VI\\).'},
  {q:'متى تكون القدرة اللحظية سالبة؟',o:['عندما تختلف إشارتا الجهد والتيار','عندما يتساويان','دائماً في المقاومة','لا تكون سالبة أبداً'],c:0,e:'ص 63: يصبح «الحمل» مصدراً للقدرة في تلك اللحظات.'}
 ]
});

/* ======================================================================
   Lesson 13 — power triangle, totals for multi-element circuits (ص 67–71) + power-factor correction (addition)
   ====================================================================== */
function triFig(P,Q,o){o=o||{};const its=[{z:Cx(P,0),lab:o.pl||'P',col:'--fg',mid:Q>=0?-1:1,anchor:'middle'},{z:Cx(0,Q),from:Cx(P,0),lab:o.ql||'Q',col:Q>=0?'--live':'--on',mid:o.qin?1:-1,anchor:o.qin?'end':undefined},{z:Cx(P,Q),lab:o.sl||'S',col:'--stop',w:3,mid:Q>=0?1:-1}];
  return phasorSVG(its,{w:o.w||300,h:o.h||200,eq:true,axes:false,arcs:[{a1:0,a2:Math.atan2(Q,P)/D,r:42,lab:o.al||'θ'}],aria:o.aria||'مثلث القدرة'})}
const fig154=()=>ladder({src:'',items:[{s:'ser',t:'Z',l:'1',l2:null,in:'',w:110,gap:40,b:70},{s:'sh',t:'Z',in:'2',l:'100 W',l2:'+80 VAR',gap:50},{s:'sh',t:'Z',in:'3',l:'300 W',l2:'−250 VAR',gap:130}],wr:110,aria:'الشكل 1-54'}).replace('</svg>',S.t(205,104,'200 W','','middle')+S.t(205,118,'0 VAR','m','middle')+'</svg>');
const fig156=()=>parFig({src:'50∠0° V',br:[{parts:[{t:'R',l:sb('R','1')+' = 4 Ω'},{t:'L',l:sb('X','L1')+' = 3 Ω'}],i:sb('I','1')},{parts:[{t:'R',l:sb('R','2')+' = 5 Ω'},{t:'C',l:sb('X','C2')+' = 8 Ω'}],i:sb('I','2')},{parts:[{t:'L',l:sb('X','L3')+' = 10 Ω'},{t:'C',l:sb('X','C3')+' = 6 Ω'}],i:sb('I','3')}],first:90,sp:140,wr:130,aria:'الشكل 1-56'});
function pq131(g){const PT_=g.P1+g.P2+g.P3,QT=g.Q1+g.Q2+g.Q3,ST=RD(Math.hypot(PT_,QT),0),pf=RD(PT_/ST,2),th=RD(Math.acos(Math.min(1,PT_/ST))/D,1);
  const nat=q=>q>0?'مادي - حثي':q<0?'مادي - سعوي':'مادي';
  return [{t:'القدرة الفعالة الكلية:',f:`P_T = P_1 + P_2 + P_3 = ${f1(g.P1)} + ${f1(g.P2)} + ${f1(g.P3)}`,v:PT_,unit:'W',dp:0,final:true},
   {t:'القدرة المفاعلة الكلية:',f:`Q_T = Q_1 + Q_2 + Q_3 = ${f1(g.Q1)} + (${f1(g.Q2)}) + (${f1(g.Q3)})`,v:QT,unit:'VAR',dp:0,final:true},
   {t:QT<0?'نستنتج أن الحمل الكلي مادي - سعوي.':QT>0?'نستنتج أن الحمل الكلي مادي - حثي.':'الحمل الكلي مادي بحت.'},
   {t:'القدرة الظاهرية الكلية (المعادلة 1-58):',f:`S_T = \\sqrt{P_T^2 + Q_T^2} = \\sqrt{(${f1(PT_)})^2 + (${f1(QT)})^2}`,v:ST,unit:'VA',dp:0,final:true},
   {t:'معامل القدرة الكلي:',f:`\\cos\\theta_T = \\frac{P_T}{S_T} = \\frac{${f1(PT_)}}{${f1(ST)}}`,v:pf,dp:2,final:true},
   {t:`ويتقدم التيار الكلي على الجهد المؤثر بالزاوية:`.replace('يتقدم',QT>0?'يتأخر':'يتقدم').replace('على',QT>0?'عن':'على'),f:`\\theta_T = \\cos^{-1}\\left(\\frac{${f1(PT_)}}{${f1(ST)}}\\right)`,v:th,unit:'°',dp:1,final:true},
   {t:`طبيعة الأحمال: الحمل 1 ${nat(g.Q1)}، الحمل 2 ${nat(g.Q2)}، الحمل 3 ${nat(g.Q3)}.`},
   {t:`<b>توضيح (ليس من الكتاب):</b> مجموع القدرات الظاهرية للأحمال ${lt(f1(Math.hypot(g.P1,g.Q1)+Math.hypot(g.P2,g.Q2)+Math.hypot(g.P3,g.Q3),1)+' VA')} أكبر من ${lt(f1(ST)+' VA')}: القدرات الظاهرية لا تُجمع جمعاً عادياً.`}]}
const G131=[1,2,3].flatMap(k=>[{id:'P'+k,label:'القدرة الفعالة للحمل '+k,sym:'P_'+k,unit:'W',value:[200,100,300][k-1]},{id:'Q'+k,label:'القدرة المفاعلة للحمل '+k,sym:'Q_'+k,unit:'VAR',value:[0,80,-250][k-1]}]);
function pq132(g,book){const V=g.V;const br=[{R:g.R1,X:g.XL1,n:1,xs:'X_{L1}'},{R:g.R2,X:-g.XC2,n:2,xs:'X_{C2}'},{R:0,X:g.XL3-g.XC3,n:3}];const out=[];let PTs=0,QTs=0;
  br.forEach(b=>{const Z=Cx(b.R,b.X),zm=RD(cabs(Z),2),za=RD(cang(Z),b.n===2?0:1),Im=RD(V/zm,b.n===3?1:1),ia=RD(-za,1);
   let P=RD(b.R*Im*Im+1e-9,0),Pc=RD(b.R*Im*Im+1e-9,1),Qv=RD(b.X*Im*Im,0),S=RD(V*Im,0);if(b.n===2&&book){P=141;Pc=140.5}else if(b.n===2){P=Pc}
   const pf=RD(S?Pc/S:0,2);PTs+=P;QTs+=Qv;
   out.push({t:`<b>الفرع ${b.n}:</b>`,f:`I_${b.n} = \\frac{V}{Z_${b.n}} = \\frac{${PZ(V,0,2,0)}}{${RZ(Z,2)}} = \\frac{${PZ(V,0,2,0)}}{${PZ(zm,za,2,1)}} = ${PZ(Im,ia,2,1)}\\ \\text{A}`},
    {f:`P_${b.n} = R_${b.n} I_${b.n}^2 = ${f1(b.R)}\\times ${f1(Im,2)}^2 = ${f1(P,1)}\\ \\text{W},\\quad Q_${b.n} = ${b.n===3?'(X_{L3} - X_{C3})':b.X<0?'-X_{C2}':'X_{L1}'}\\,I_${b.n}^2 = ${f1(Qv,0)}\\ \\text{VAR}`},
    {f:`S_${b.n} = V I_${b.n} = ${f1(V)}\\times ${f1(Im,2)} = ${f1(S,0)}\\ \\text{VA},\\quad \\cos\\theta_${b.n} = \\frac{P_${b.n}}{S_${b.n}} = \\frac{${f1(Pc,1)}}{${f1(S,0)}} = ${f1(pf,2)}`,final:true});
   if(b.n===2&&book)out.push({t:'<b>ملاحظة على الكتاب:</b> \\(5\\times5.3^2 = 140.45\\) W؛ طُبعت 141 في سطر \\(P_2\\) ثم 140.5 في سطر معامل القدرة. الفرق لا يغيّر النتائج النهائية بعد التقريب.'})});
  const ST=RD(Math.hypot(PTs,QTs),book?0:1),pfT=RD(PTs/ST,2);
  out.push({t:'ب) <b>القدرات الكلية:</b>',f:`P_T = P_1 + P_2 + P_3 = ${f1(PTs,1)}\\ \\text{W},\\qquad Q_T = Q_1 + Q_2 + Q_3 = ${f1(QTs,0)}\\ \\text{VAR}`,final:true},
   {f:`S_T = \\sqrt{P_T^2 + Q_T^2} = \\sqrt{(${f1(PTs,1)})^2 + (${f1(QTs,0)})^2} = ${f1(ST,1)}\\ \\text{VA}`,final:true},
   {f:`\\cos\\theta_T = \\frac{P_T}{S_T} = \\frac{${f1(PTs,1)}}{${f1(ST,1)}} = ${f1(pfT,2)}`,final:true},
   {t:QTs>0?'القدرة المفاعلة الكلية موجبة: الحمل الكلي مادي - حثي ومعامل القدرة متأخر.':'القدرة المفاعلة الكلية سالبة: الحمل الكلي مادي - سعوي.'});
  return out}
const G132=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'R1',label:'مقاومة الفرع 1',sym:'R_1',unit:'Ω',value:4},{id:'XL1',label:'ملف الفرع 1',sym:'X_{L1}',unit:'Ω',value:3},{id:'R2',label:'مقاومة الفرع 2',sym:'R_2',unit:'Ω',value:5},{id:'XC2',label:'مكثف الفرع 2',sym:'X_{C2}',unit:'Ω',value:8},{id:'XL3',label:'ملف الفرع 3',sym:'X_{L3}',unit:'Ω',value:10},{id:'XC3',label:'مكثف الفرع 3',sym:'X_{C3}',unit:'Ω',value:6}];
function pfcSteps(g){const t1=g.Q/g.P,pf1=g.P/Math.hypot(g.P,g.Q),t2=Math.tan(Math.acos(Math.min(1,g.pf))),Qn=g.P*t2,Qc=g.Q-Qn,w=2*PI*g.f,C=Qc/(w*g.V*g.V)*1e6,I1=Math.hypot(g.P,g.Q)/g.V,I2=Math.hypot(g.P,Qn)/g.V;
  return [{t:'معامل القدرة الحالي:',f:`\\cos\\theta_1 = \\frac{P}{\\sqrt{P^2+Q^2}} = \\frac{${f1(g.P)}}{${f1(Math.hypot(g.P,g.Q),1)}} = ${f1(pf1,3)},\\qquad \\tan\\theta_1 = \\frac{Q}{P} = ${f1(t1,4)}`},
   {t:'القدرة المفاعلة المسموحة عند معامل القدرة المطلوب:',f:`\\tan\\theta_2 = \\tan(\\cos^{-1}${f1(g.pf,3)}) = ${f1(t2,4)},\\qquad Q_2 = P\\tan\\theta_2 = ${f1(Qn,1)}\\ \\text{VAR}`},
   {t:'القدرة المفاعلة التي يجب أن يولدها المكثف:',f:`Q_C = P(\\tan\\theta_1 - \\tan\\theta_2) = ${f1(g.Q)} - ${f1(Qn,1)} = ${f1(Qc,1)}\\ \\text{VAR}`,final:true},
   {t:'سعة المكثف الموصول على التوازي مع الحمل (من \\(Q_C = V^2/X_C = \\omega C V^2\\)):',f:`C = \\frac{Q_C}{\\omega V^2} = \\frac{${f1(Qc,1)}}{2\\pi\\times${f1(g.f)}\\times ${f1(g.V)}^2} = ${f1(C,1)}\\ \\mu\\text{F}`,final:true},
   {t:'التيار المسحوب من المصدر قبل التحسين وبعده (القدرة الفعالة نفسها):',f:`I_1 = \\frac{S_1}{V} = ${f1(I1,2)}\\ \\text{A}\\ \\longrightarrow\\ I_2 = \\frac{S_2}{V} = ${f1(I2,2)}\\ \\text{A}`,final:true}].concat(Qc<0?[{t:'Q_C سالبة: معامل القدرة الحالي أعلى من المطلوب، أو الحمل سعوي أصلاً؛ لا حاجة لمكثف.'}]:[])}
const GPFC=[{id:'P',label:'القدرة الفعالة للحمل',sym:'P',unit:'W',value:541,min:0.01},{id:'Q',label:'القدرة المفاعلة للحمل',sym:'Q',unit:'VAR',value:700},{id:'pf',label:'معامل القدرة المطلوب',sym:'\\cos\\theta_2',unit:'',value:0.95,min:0.01,max:1},{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50,min:0.01},{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60,min:0.01}];

B.lesson({
 id:'u1-l13',unit:1,order:13,pages:'67–71',
 title:'مثلث القدرة وحساب القدرات الكلية لدائرة متعددة العناصر',
 summary:'مثلث قائم قاعدته القدرة الفعالة P وارتفاعه القدرة المفاعلة Q ووتره القدرة الظاهرية S. في دائرة من عدة عناصر نجمع P وحدها و Q وحدها ثم نحسب S_T = √(P_T² + Q_T²) — لا نجمع القدرات الظاهرية. مع المثالين (1-3-1) و(1-3-2)، وإضافة من خارج الكتاب عن تحسين معامل القدرة.',
 stations:[
  {intro:true},

  {st:1,short:'مثلث القدرة',title:'مثلث القدرة وحساب القدرات الكلية',ref:'ص 67–68',
   q:'ثلاث قدرات P و Q و S… هل يمكن أن نرسمها في شكل واحد يربطها كلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-53: مثلث القدرة لحمل مادي حثي في الأعلى، والضلع Q لأعلى، ولحمل مادي سعوي في الأسفل، والضلع Q لأسفل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="القدرة الفعالة ⟦P⟧: القاعدة الأفقية للمثلث."><path d="M70 130 L250 130" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="160.0" y="150" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P</text><rect x="70" y="118" width="180" height="24" rx="6" fill="transparent"/></g><g data-tip="⟦QL⟧ لأعلى: قدرة مفاعلة موجبة، والحمل مادي - حثي."><path d="M250 130 L250 60" fill="none" stroke="#B5523C" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="260" y="100.0" text-anchor="start" font-size="14" fill="#B5523C" font-weight="700" direction="ltr" font-family="var(--mono)">Q<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="240" y="60" width="50" height="70" rx="6" fill="transparent"/></g><g data-tip="القدرة الظاهرية ⟦S⟧: الوتر، و⟦S² = P² + Q²⟧."><path d="M70 130 L250 60" fill="none" stroke="#C8473A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="146.0" y="87.0" text-anchor="middle" font-size="14" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">S</text><rect x="90" y="60" width="140" height="70" rx="6" fill="transparent"/></g><g data-tip="الزاوية ⟦θ⟧ بين ⟦P⟧ و⟦S⟧، ومعامل القدرة ⟦cosθ = P/S⟧."><path d="M104 130 A34 34 0 0 0 101.7 117.7" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><text x="116" y="122" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">θ</text><rect x="70" y="100" width="60" height="30" rx="6" fill="transparent"/></g><text x="35" y="110" text-anchor="middle" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">(a)</text><g data-tip="القدرة الفعالة ⟦P⟧: القاعدة الأفقية للمثلث."><path d="M70 190 L250 190" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="160.0" y="180" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">P</text><rect x="70" y="178" width="180" height="24" rx="6" fill="transparent"/></g><g data-tip="⟦QC⟧ لأسفل: قدرة مفاعلة سالبة، والحمل مادي - سعوي."><path d="M250 190 L250 260" fill="none" stroke="#1F7A72" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="260" y="230.0" text-anchor="start" font-size="14" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">Q<tspan font-size="10" dy="4">C</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="240" y="190" width="50" height="70" rx="6" fill="transparent"/></g><g data-tip="القدرة الظاهرية ⟦S⟧: الوتر، و⟦S² = P² + Q²⟧."><path d="M70 190 L250 260" fill="none" stroke="#C8473A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="146.0" y="241.0" text-anchor="middle" font-size="14" fill="#C8473A" font-weight="700" direction="ltr" font-family="var(--mono)">S</text><rect x="90" y="190" width="140" height="70" rx="6" fill="transparent"/></g><g data-tip="الزاوية ⟦θ⟧ بين ⟦P⟧ و⟦S⟧، ومعامل القدرة ⟦cosθ = P/S⟧."><path d="M104 190 A34 34 0 0 1 101.7 202.3" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><text x="116" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">θ</text><rect x="70" y="190" width="60" height="30" rx="6" fill="transparent"/></g><text x="35" y="215" text-anchor="middle" font-size="13" fill="#8A9A93" font-weight="700" direction="ltr" font-family="var(--mono)">(b)</text><text x="180" y="300" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">S² = P² + Q²</text><text x="180" y="42" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">مثلث القدرة</text></svg>`,
   cap:'مثلثا القدرة كما في الشكل <span class="ltr">(1-53)</span>: (a) حمل مادي - حثي، (b) حمل مادي - سعوي.<br><b>مرّر المؤشر على أضلاع المثلثين والزاويتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`حمل فيه مقاومة وملف ومكثف، وتساوت \(Q_L\) و\(Q_C\) بالمقدار. ماذا يصبح الحمل؟`,opts:[
     ['مادياً بحتاً',true,String.raw`نص الكتاب: «إذا تساوت \(Q_L\) و\(Q_C\) فإن الحمل يصبح مادياً بحتاً»؛ المثلث يصبح خطاً أفقياً و\(S=P\).`],
     ['مادياً - حثياً',false,String.raw`يكون حثياً إذا كانت \(Q_L\) أكبر.`],
     ['مادياً - سعوياً',false,String.raw`يكون سعوياً إذا كانت \(Q_C\) أكبر بالمقدار.`]]}}
   ],
   body:[
    {book:String.raw`<p>نستطيع تمثيل العلاقة بين أنواع القدرة الثلاثة باستعمال <b>مثلث القدرة</b>. فلو رسمنا مثلثاً قائماً تساوي قاعدته القدرة الفعالة، ويساوي ارتفاعه القدرة غير الفعالة، فإن الوتر سيساوي القدرة الظاهرية وذلك حسب المعادلات <span class="ltr">1-46</span> و<span class="ltr">1-50</span> و<span class="ltr">1-55</span>.</p>
     <p>ويبين الشكلان <span class="ltr">1-53a</span> و<span class="ltr">1-53b</span> مثلثي القدرة في حالة حمل مادي - حثي وفي حالة حمل مادي - سعوي. وإذا كان الحمل يحتوي على مقاومة وملف ومكثف فإن القدرة غير الفعالة Q تساوي مجموع \(Q_L\) و\(Q_C\). فإذا كانت الأولى أكبر فإن Q تكون موجبة ويظهر الحمل كأنه مادي - حثي، وإذا كان العكس فإن الحمل يظهر كأنه مادي - سعوي. أما إذا تساوت \(Q_L\) و\(Q_C\) (بالمقدار) فإن الحمل يصبح مادياً بحتاً.</p>
     <p>ونستطيع استعمال العلاقة</p><div class="eq">$$S^2=P^2+Q^2$$<span class="eqno">(1-58)</span></div><p>لحساب إحدى القدرات عندما تكون القدرتان الأخريان معلومتين.</p>
     <p>في دائرة كهربائية مكونة من عدة عناصر نحسب القدرات الكلية ومعامل القدرة الكلي حسب الطريقة الآتية:</p>
     <ul><li>تساوي القدرة الفعالة الكلية \(P_T\) مجموع القدرات الفعالة لكل عنصر؛</li><li>تساوي القدرة المفاعلة الكلية \(Q_T\) مجموع القدرات المفاعلة لكل عنصر؛</li><li>تعطى القدرة الظاهرية الكلية بالمعادلة $$S_T=\sqrt{P_T^2+Q_T^2}$$ نلاحظ هنا أن القدرة الظاهرية الكلية <b>لا تساوي</b> مجموع القدرات الظاهرية لكل عنصر، فلننتبه لهذا.</li><li>معامل القدرة الكلي هو \(\cos\theta_T=\frac{P_T}{S_T}\).</li></ul>`,ref:'ص 67–68'},
    {tip:String.raw`<p>من (1-46) و(1-55): \(P=S\cos\theta\) و\(Q=S\sin\theta\)، أي ضلعا مثلث قائم وتره \(S\) وزاويته \(\theta\). ومن فيثاغورس: \(S^2=P^2+Q^2\).</p>
     <p>و\(Q\) تُجمع <b>بإشارتها</b>: موجبة للملف وسالبة للمكثف، لذلك قد يلغي بعضها بعضاً.</p>`,title:'لماذا مثلث؟'},
    {watch:String.raw`<p>لا تجمع القدرات الظاهرية: \(S_T\neq S_1+S_2+\cdots\). اجمع \(P\) وحدها و\(Q\) وحدها (بإشاراتها)، ثم احسب \(S_T\) من (1-58). سترى الفرق بالأرقام في المثال التالي.</p>`},
    {title:'مختبر مصغّر: ارسم مثلث القدرة',widget:(el,B)=>DCML.lab(el,B,{intro:'\\(P=600\\ \\text{W}\\) من مثال <span class="ltr">(1-3-1)</span>، و\\(Q_L=80\\) و\\(|Q_C|=250\\ \\text{VAR}\\) القيمتان الابتدائيتان منه؛ غيّرهما (<b>أرقام تختارها أنت</b>) وشاهد المثلث.',
 predict:{q:'إذا تساوت \\(Q_L\\) و\\(|Q_C|\\)، كم تكون القدرة الظاهرية؟',opts:[
  ['\\(S=P\\)',true,'\\(Q=0\\) فيصير المثلث خطاً أفقياً، والحمل مادي بحت.'],
  ['\\(S=P+Q_L+|Q_C|\\)',false,'القدرات لا تجمع جمعاً عادياً، والقدرتان المفاعلتان متعاكستان.'],
  ['\\(S=0\\)',false,'تبقى القدرة الفعالة.']]},
 ins:[{k:'l',l:'Q<sub>L</sub> (الملف)',u:'VAR',min:0,max:400,step:10,v:80,dp:0},{k:'c',l:'|Q<sub>C</sub>| (المكثف)',u:'VAR',min:0,max:400,step:10,v:250,dp:0}],
 calc:(s,P,B)=>{const Q=s.l-s.c,S=Math.hypot(600,Q),pf=600/S,th=Math.atan2(Q,600)*180/Math.PI,f1=v=>(+v).toFixed(1);
  const k=0.42,x0=20,y0=110,x1=x0+600*k,y1=y0-Q*k;
  const pic=`<svg viewBox="0 0 360 ${Q<0?300:240}" role="img" aria-label="مثلث القدرة" style="font-family:var(--font);max-width:380px;display:block;margin-inline:auto" direction="ltr"><g transform="translate(0,${Q<0?0:60})"><line x1="${x0}" y1="${y0}" x2="${f1(x1)}" y2="${y0}" stroke="var(--on)" stroke-width="3.5"/><text x="${f1((x0+x1)/2)}" y="${y0+(Q<0?-8:18)}" text-anchor="middle" font-size="12" fill="var(--on)" font-weight="700">P = 600 W</text>${Math.abs(Q)>0?`<line x1="${f1(x1)}" y1="${y0}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="var(${Q>0?'--live':'--blue'})" stroke-width="3.5"/><text x="${f1(x1+6)}" y="${f1((y0+y1)/2+4)}" font-size="12" fill="var(${Q>0?'--live':'--blue'})" font-weight="700">Q = ${DCML.fm(B,Q,0)}</text>`:''}<line x1="${x0}" y1="${y0}" x2="${f1(x1)}" y2="${f1(y1)}" stroke="var(--stop)" stroke-width="3"/><text x="${f1((x0+x1)/2-10)}" y="${f1((y0+y1)/2+(Q<0?16:-8))}" text-anchor="middle" font-size="12" fill="var(--stop)" font-weight="700">S = ${DCML.fm(B,S,0)} VA</text></g></svg>`;
  return {pic,facts:[['<span class="ltr">Q<sub>T</sub> = Q<sub>L</sub> + Q<sub>C</sub></span>',DCML.fm(B,Q,0)+' VAR'],['<span class="ltr">S = √(P² + Q²) (1-58)</span>',DCML.fm(B,S,0)+' VA','hi'],['cos θ<sub>T</sub>',DCML.fm(B,pf,2)],['θ<sub>T</sub>',DCML.fm(B,th,1)+'°']],
   msg:Q>0?'\\(Q\\) موجبة: الحمل يظهر مادياً - حثياً (المثلث فوق القاعدة).':Q<0?'\\(Q\\) سالبة: الحمل يظهر مادياً - سعوياً (المثلث تحت القاعدة).':'تساوت \\(Q_L\\) و\\(|Q_C|\\): الحمل مادي بحت و\\(S=P\\).'}}})}
   ]},

  {st:2,short:'مثال <span class="ltr">(1-3-1)</span>',title:'مثال <span class="ltr">(1-3-1)</span>: القدرات الكلية لثلاثة أحمال',ref:'ص 68–69',
   q:'حمل يستعير قدرة مفاعلة وآخر «يولدها»: ماذا يحدث عندما يجتمعان في دائرة واحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-54: ثلاثة أحمال: الحمل 1 على الخط 200 واط، والحملان 2 و3 على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M45 100 L45 152" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 188 L45 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="45" cy="170" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 170 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 100 L82 100" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="الحمل ⟦1⟧: ⟦200 W⟧ و⟦0 VAR⟧: حمل مادي (مقاومة)."><rect x="82" y="74" width="96" height="52" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="130" cy="88" r="10" fill="#2C4A40"/><text x="130" y="92" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1</text><text x="130" y="109" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">200 W</text><text x="130" y="122" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">0 VAR</text></g><path d="M178 100 L320 100" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 240 L320 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M215 100 L215 136" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M215 204 L215 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="الحمل ⟦2⟧: ⟦100 W⟧ و⟦+80 VAR⟧: ⟦Q⟧ موجبة، فهو مادي - حثي."><rect x="177" y="136" width="76" height="68" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="215" cy="152" r="10" fill="#2C4A40"/><text x="215" y="156" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">2</text><text x="215" y="176" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">100 W</text><text x="215" y="192" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">+80 VAR</text></g><path d="M310 100 L310 136" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M310 204 L310 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="الحمل ⟦3⟧: ⟦300 W⟧ و⟦−250 VAR⟧: ⟦Q⟧ سالبة، فهو مادي - سعوي."><rect x="272" y="136" width="76" height="68" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="310" cy="152" r="10" fill="#2C4A40"/><text x="310" y="156" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">3</text><text x="310" y="176" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">300 W</text><text x="310" y="192" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">−250 VAR</text></g><circle cx="215" cy="100" r="4.5" fill="#2C4A40"/><circle cx="215" cy="240" r="4.5" fill="#2C4A40"/><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ثلاثة أحمال وقدراتها</text></svg>`,
   cap:'الشكل <span class="ltr">(1-54)</span>: ثلاثة أحمال، كل منها بقدرته الفعالة والمفاعلة.<br><b>مرّر المؤشر على كل حمل (أو المسه في الجوال) لتعرف طبيعته.</b>',
   side:[
    {predict:{q:String.raw`\(Q_T=0+80-250\). فالحمل الكلي…`,opts:[
     ['مادي - حثي',false,String.raw`\(Q_T=-170\ \text{VAR}\) سالبة.`],
     ['مادي - سعوي',true,String.raw`\(Q_T\) سالبة، والكتاب يقول: «نستنتج أن الحمل الكلي مادي - سعوي».`],
     ['مادي بحت',false,String.raw`\(+80\) و\(-250\) لا يلغي أحدهما الآخر تماماً.`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب القدرات الفعالة والمفاعلة والظاهرية الكلية وكذلك معامل القدرة الكلي للدائرة المبينة في الشكل <span class="ltr">1-54</span>، ثم ارسم مثلث القدرة وبين طبيعة كل حمل من الأحمال الثلاثة.</p>
     <p><b>الحل:</b></p>$$P_T=P_1+P_2+P_3=200+100+300=600\ \text{W}$$$$Q_T=Q_1+Q_2+Q_3=0+80-250=-170\ \text{VAR}$$
     <p>نستنتج أن الحمل الكلي مادي - سعوي.</p>$$S_T=\sqrt{P_T^2+Q_T^2}=\sqrt{(600)^2+(-170)^2}=624\ \text{VA}\qquad \cos\theta_T=\frac{P_T}{S_T}=\frac{600}{624}=0.96$$
     <p>ويتقدم التيار الكلي على الجهد المؤثر بالزاوية \(\theta_T=15.9^\circ\). ويبين الشكل <span class="ltr">1-55</span> مثلث القدرة. طبيعة الأحمال: الحمل 1: مادي، الحمل 2: مادي - حثي، الحمل 3: مادي - سعوي.</p>`,ref:'ص 68–69'},
    {html:`<figure style="margin:0;text-align:center;font-size:13px;color:var(--muted)">${box(triFig(600,-170,{pl:'600 W',ql:'−170 VAR',sl:'624 VA',al:'−15.9°',w:340,h:180}),340)}الشكل <span class="ltr">(1-55)</span>: مثلث القدرة للمثال</figure>`},
    {title:'شغّل الأحمال وأطفئها',widget:(el,B)=>{
      /* أرقام الكتاب في الشكل <span class="ltr">1-54</span> */
      const Ld=[{n:'الحمل 1',p:200,q:0},{n:'الحمل 2',p:100,q:80},{n:'الحمل 3',p:300,q:-250}],on=[1,1,1];
      const r=(x,d)=>Math.round(x*10**d)/10**d;
      el.innerHTML=`<div class="w-row" style="margin-top:0">${Ld.map((x,i)=>`<label style="display:inline-flex;gap:6px;align-items:center;font-size:14px"><input type="checkbox" data-i="${i}" checked>${x.n}</label>`).join('')}</div><div data-o style="margin-top:10px"></div>`;
      const o=el.querySelector('[data-o]');
      const draw=()=>{const s=Ld.filter((_,i)=>on[i]);if(!s.length){o.innerHTML='<p class="sub" style="margin:0">اختر حملاً واحداً على الأقل.</p>';return}
        const P=s.reduce((a,x)=>a+x.p,0),Q=s.reduce((a,x)=>a+x.q,0),S=Math.hypot(P,Q),sumS=s.reduce((a,x)=>a+Math.hypot(x.p,x.q),0);
        const nat=Q>0?['مادي - حثي','hot']:Q<0?['مادي - سعوي','ld']:['مادي بحت','ok'];
        o.innerHTML=`<p style="margin:0 0 4px">\\(P_T=${P}\\ \\text{W}\\)، \\(Q_T=${Q}\\ \\text{VAR}\\)، \\(S_T=\\sqrt{P_T^2+Q_T^2}=${r(S,1)}\\ \\text{VA}\\)، \\(\\cos\\theta_T=${r(P/S,2)}\\)</p>
         <p style="margin:0 0 6px">مجموع القدرات الظاهرية للأحمال المختارة \\(=${r(sumS,1)}\\ \\text{VA}\\)${Math.abs(sumS-S)>0.05?' (أكبر من \\(S_T\\))':' (يساوي \\(S_T\\) هنا لأن Q كلها بإشارة واحدة أو صفر)'}</p><span class="cb-chip ${nat[1]}">الحمل الكلي: ${nat[0]}</span>`;B.math(o)};
      el.querySelectorAll('[data-i]').forEach(c=>c.onchange=()=>{on[+c.dataset.i]=c.checked?1:0;draw()});draw();
    }},
    {tip:String.raw`<p>لو جمعنا القدرات الظاهرية للأحمال الثلاثة لحصلنا على \(200+128.1+390.5=718.6\ \text{VA}\)، وهذا أكبر من <span class="ltr">624 VA</span>: السبب أن Q الحمل 2 (\(+80\)) وQ الحمل 3 (\(-250\)) يلغي بعضهما بعضاً جزئياً.</p>
     <p>والزاوية بدقة أكبر \(\tan^{-1}(170/600)=15.8^\circ\)؛ الحل حسبها من \(\cos^{-1}(600/624)\) بعد تقريب <span class="ltr">624</span>.</p>`,title:'لماذا لا نجمع S؟'},
    {watch:String.raw`<p>«يتقدم التيار الكلي على الجهد» لأن الحمل الكلي سعوي (\(Q_T\) سالبة)، ولذلك رُسم الضلع \(Q\) في مثلث الشكل <span class="ltr">(1-55)</span> لأسفل.</p>`}
   ]},

  {st:3,short:'مثال <span class="ltr">(1-3-2)</span>',title:'مثال <span class="ltr">(1-3-2)</span>: قدرات كل فرع والقدرات الكلية',ref:'ص 69–71',
   q:'فرع فيه ملف ومكثف فقط، بلا مقاومة: كم قدرته الفعالة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 1-56: مصدر 50 فولت وثلاثة فروع على التوازي: 4 أوم مع ملف 3 أوم، 5 أوم مع مكثف 8 أوم، ملف 10 أوم مع مكثف 6 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M50 142.0 L50 90 L290 90" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 178.0 L50 230 L290 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="المصدر ⟦50∠0° V⟧: جهد الفروع الثلاثة."><circle cx="50" cy="160.0" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M40 160.0 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="50" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">50∠0° V</text><rect x="24" y="134.0" width="52" height="52" rx="6" fill="transparent"/></g><g data-tip="الفرع 1: ⟦R1 = 4 Ω⟧ مع ملف ⟦XL1 = 3 Ω⟧: ⟦Z1 = 4 + j3⟧ (مادي - حثي)، وتياره ⟦I1⟧."><path d="M120 90 L120 110.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 154.0 L120 166.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 210.0 L120 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 110.0 L127 117.33333333333333 L113 124.66666666666667 L127 132.0 L113 139.33333333333334 L127 146.66666666666666 L120 154.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 166.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="120" cy="90" r="4.5" fill="#2C4A40"/><circle cx="120" cy="230" r="4.5" fill="#2C4A40"/><text x="138" y="137.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">4 Ω</text><text x="138" y="193.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">3 Ω</text><rect x="90" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="الفرع 2: ⟦R2 = 5 Ω⟧ مع مكثف ⟦XC2 = 8 Ω⟧: ⟦Z2 = 5 − j8⟧ (مادي - سعوي)، وتياره ⟦I2⟧."><path d="M205 90 L205 110.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 154.0 L205 166.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 210.0 L205 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 110.0 L212 117.33333333333333 L198 124.66666666666667 L212 132.0 L198 139.33333333333334 L212 146.66666666666666 L205 154.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 166.0 L205 183.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M205 193.0 L205 210.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="193" y1="183.0" x2="217" y2="183.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="193" y1="193.0" x2="217" y2="193.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><circle cx="205" cy="90" r="4.5" fill="#2C4A40"/><circle cx="205" cy="230" r="4.5" fill="#2C4A40"/><text x="223" y="137.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">5 Ω</text><text x="223" y="193.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">8 Ω</text><rect x="175" y="98" width="62" height="124" rx="6" fill="transparent"/></g><g data-tip="الفرع 3: ملف ⟦10 Ω⟧ مع مكثف ⟦6 Ω⟧: ⟦Z3 = j10 − j6 = j4⟧ (حثي بحت، لا مقاومة فيه)، وتياره ⟦I3⟧."><path d="M290 90 L290 110.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 154.0 L290 166.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 210.0 L290 230" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 110.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0 a5.5 5.5 0 0 1 0 11.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 166.0 L290 183.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M290 193.0 L290 210.0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="278" y1="183.0" x2="302" y2="183.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><line x1="278" y1="193.0" x2="302" y2="193.0" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="308" y="137.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">10 Ω</text><text x="308" y="193.0" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">6 Ω</text><rect x="260" y="98" width="62" height="124" rx="6" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ثلاثة فروع على التوازي</text></svg>`,
   cap:'الشكل <span class="ltr">(1-56)</span>: ثلاثة فروع على التوازي مع مصدر <span class="ltr">50 V</span>.<br><b>مرّر المؤشر على كل فرع والمصدر (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'القدرة الفعالة للفرع الثالث (ملف 10 Ω ومكثف 6 Ω):',opts:[
     ['625 W',false,String.raw`<span class="ltr">625</span> هي قدرته المفاعلة بالفار، لا الفعالة.`],
     ['صفر',true,String.raw`لا مقاومة في الفرع، و\(P=RI^2\)؛ لذلك \(P_3=0\) و\(\cos\theta_3=0\).`],
     ['400 W',false,'هذه قدرة الفرع الأول.']]}}
   ],
   body:[
    {book:String.raw`<p>أ- احسب القدرات الفعالة والمفاعلة والظاهرية وكذلك معامل القدرة لكل فرع من فروع الدائرة المبينة في الشكل <span class="ltr">1-56</span>.<br>ب- احسب القدرات الفعالة والمفاعلة والظاهرية الكلية وكذلك معامل القدرة الكلي للدائرة.</p>
     <p><b>الحل:</b></p><div class="cb-tbl"><table class="tt"><thead><tr><th>الفرع</th><th>التيار</th><th>P (W)</th><th>Q (VAR)</th><th>S (VA)</th><th>cosθ</th></tr></thead><tbody>
     <tr><td>1: \(4 + j3 = 5\angle 36.9^\circ\)</td><td>\(10\angle -36.9^\circ\)</td><td>\(4\times10^2 = 400\)</td><td>\(3\times10^2 = 300\)</td><td>\(50\times10 = 500\)</td><td>0.8</td></tr>
     <tr><td>2: \(5 - j8 = 9.43\angle -58^\circ\)</td><td>\(5.3\angle 58^\circ\)</td><td>\(5\times5.3^2 = 141\)</td><td>\(-8\times5.3^2 = -225\)</td><td>\(50\times5.3 = 265\)</td><td>\(140.5/265 = 0.53\)</td></tr>
     <tr><td>3: \(j10 - j6 = 4\angle 90^\circ\)</td><td>\(12.5\angle -90^\circ\)</td><td>0</td><td>\((10-6)\,12.5^2 = 625\)</td><td>\(50\times12.5 = 625\)</td><td>0</td></tr></tbody></table></div>
     $$P_T=400+141=541\ \text{W}\quad Q_T=300-225+625=700\ \text{VAR}$$$$S_T=\sqrt{(541)^2+(700)^2}=885\ \text{VA}\quad \cos\theta_T=\frac{541}{885}=0.61$$`,ref:'ص 69–71'},
    {tip:String.raw`<p>في كل فرع: التيار \(I=V/Z\)، ثم \(P=RI^2\) (المقاومة فقط) و\(Q=XI^2\) (الملف موجب والمكثف سالب) و\(S=VI\).</p>
     <p>الفرع الثالث: \(Q_3=(10-6)\times12.5^2\) لأن الملف والمكثف في الفرع نفسه يمر فيهما التيار نفسه، فقدرتاهما \(+10I^2\) و\(-6I^2\).</p>`,title:'الطريقة في كل فرع'},
    {watch:String.raw`<p>\(5\times5.3^2=140.45\ \text{W}\)؛ طُبعت في الكتاب <b>141</b> في سطر \(P_2\) ثم <b>140.5</b> في سطر معامل القدرة، و\(P_T=541\) مبنية على 141. بالقيمة 140.5: \(P_T=540.5\ \text{W}\) و\(S_T=884.4\ \text{VA}\) و\(\cos\theta_T=0.61\) — النتائج النهائية لا تتغير بعد التقريب.</p>`,fix:true},
    {add:String.raw`<p>ذكر الكتاب (ص 65) أننا «نلجأ إلى تحسين» معامل القدرة عندما يكون صغيراً، دون أن يشرح الطريقة:</p>
     <p><b>لماذا؟</b> الحمل نفسه (القدرة الفعالة نفسها) بمعامل قدرة منخفض يسحب تياراً أكبر: \(I=\frac{P}{V\cos\theta}\). والتيار الأكبر يعني مفاقيد أكبر في الأسلاك \(RI^2\) وهبوط جهد أكبر، ويشغل جزءاً أكبر من قدرة المحولات والمولدات.</p>
     <p><b>كيف؟</b> أغلب الأحمال (المحركات والمحولات) مادية - حثية، أي Q موجبة. نوصل <b>مكثفاً على التوازي</b> مع الحمل؛ المكثف «يولد» قدرة مفاعلة سالبة (1-57) فتقل \(Q_T\) ويقصر ارتفاع مثلث القدرة، بينما تبقى P كما هي.</p>
     $$Q_C=P\,(\tan\theta_1-\tan\theta_2)\qquad C=\frac{Q_C}{2\pi f\,V^2}$$
     <p>حيث \(\theta_1\) زاوية الحمل قبل التحسين و\(\theta_2\) الزاوية المطلوبة. جرّب ذلك على أرقام هذا المثال في المختبر وفي «الأمثلة المحلولة». وانتبه: مكثف أكبر من اللازم يجعل الحمل الكلي سعوياً، وهذا غير مرغوب أيضاً.</p>`,title:'تحسين معامل القدرة'},
    {title:'مختبر مصغّر: هل S<sub>T</sub> مجموع S الفروع؟',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام جدول الحل: الفرع 1 (400 W، 300 VAR، 500 VA)، الفرع 2 (141 W، −225 VAR، 265 VA)، الفرع 3 (0 W، 625 VAR، 625 VA). أدخل الفروع في الحساب.',
 predict:{q:'مع الفروع الثلاثة: هل \\(S_T=500+265+625=1390\\ \\text{VA}\\)؟',opts:[
  ['نعم',false,'القدرات الظاهرية لا تُجمع؛ الكتاب ينبه: «لا تساوي مجموع القدرات الظاهرية لكل عنصر».'],
  ['لا، \\(S_T=885\\ \\text{VA}\\)',true,'\\(S_T=\\sqrt{541^2+700^2}=885\\ \\text{VA}\\).'],
  ['لا، \\(S_T=1166\\ \\text{VA}\\)',false,'هذا جمع P و Q جمعاً عادياً؛ الصحيح بالجذر.']]},
 ins:[{k:'a',l:'',sw:true,v:1,on:'الفرع 1: داخل',off:'الفرع 1: خارج'},{k:'b',l:'',sw:true,v:1,on:'الفرع 2: داخل',off:'الفرع 2: خارج'},{k:'c',l:'',sw:true,v:1,on:'الفرع 3: داخل',off:'الفرع 3: خارج'}],
 calc:(s,P,B)=>{const F=[[400,300,500],[141,-225,265],[0,625,625]],on=[s.a,s.b,s.c];let p=0,q=0,ss=0;F.forEach((f,i)=>{if(on[i]){p+=f[0];q+=f[1];ss+=f[2]}});const S=Math.hypot(p,q);
  return {facts:[['P<sub>T</sub>',DCML.fm(B,p,0)+' W'],['Q<sub>T</sub>',DCML.fm(B,q,0)+' VAR'],['<span class="ltr">S<sub>T</sub> = √(P<sub>T</sub>² + Q<sub>T</sub>²)</span>',DCML.fm(B,S,0)+' VA','hi'],['cos θ<sub>T</sub>',S?DCML.fm(B,p/S,2):'—']],
   bars:[{l:'مجموع S الفروع (خطأ)',v:ss,max:1400,u:'VA',dp:0,col:'--stop'},{l:'S<sub>T</sub> الصحيحة',v:S,max:1400,u:'VA',dp:0,col:'--on'}],
   msg:s.a&&s.b&&s.c?'كما في حل الكتاب: \\(P_T=541\\) و\\(Q_T=700\\) و\\(S_T=885\\ \\text{VA}\\) و\\(\\cos\\theta_T=0.61\\).':'الفرق بين العمودين يكبر حين تختلف إشارات Q للفروع.'}}})}
   ]},

  {recap:[
   String.raw`مثلث القدرة: القاعدة P والارتفاع Q والوتر S، و\(S^2=P^2+Q^2\) (1-58).`,
   String.raw`Q موجبة: الحمل مادي - حثي (Q لأعلى)، وسالبة: مادي - سعوي (Q لأسفل)، وإذا تساوت \(Q_L\) و\(Q_C\) بالمقدار صار الحمل مادياً بحتاً (ص 67).`,
   String.raw`القدرات الكلية: \(P_T=\sum P\) و\(Q_T=\sum Q\) بإشاراتها، ثم \(S_T=\sqrt{P_T^2+Q_T^2}\) و\(\cos\theta_T=P_T/S_T\) — ولا نجمع القدرات الظاهرية.`,
   String.raw`في كل فرع: \(P=RI^2\) و\(Q=XI^2\) و\(S=VI\)، كما في المثال <span class="ltr">(1-3-2)</span>.`]}
],
 theory:[
  {h:'مثلث القدرة',ref:'ص 67',html:`<p>نستطيع تمثيل العلاقة بين أنواع القدرة الثلاثة باستعمال <b>مثلث القدرة</b>. فلو رسمنا مثلثاً قائماً تساوي قاعدته القدرة الفعالة، ويساوي ارتفاعه القدرة غير الفعالة، فإن الوتر سيساوي القدرة الظاهرية وذلك حسب المعادلات 1-46 و1-50 و1-55.</p>
   <p>ويبين الشكلان 1-53a و1-53b مثلثي القدرة في حالة حمل مادي - حثي وفي حالة حمل مادي - سعوي. وإذا كان الحمل يحتوي على مقاومة وملف ومكثف فإن القدرة غير الفعالة Q تساوي مجموع \\(Q_L\\) و\\(Q_C\\). فإذا كانت الأولى أكبر فإن Q تكون موجبة ويظهر الحمل كأنه مادي - حثي، وإذا كان العكس فإن الحمل يظهر كأنه مادي - سعوي. أما إذا تساوت \\(Q_L\\) و\\(Q_C\\) (بالمقدار) فإن الحمل يصبح مادياً بحتاً.</p>`},
  {fig:'(1-53)',ref:'ص 68',caption:'مثلث القدرة في حمل مادي - حثي (a): \\(Q_L\\) لأعلى، وفي حمل مادي - سعوي (b): \\(Q_C\\) لأسفل. الزاوية θ بين P و S.',draw:()=>`<div class="cb-figs"><figure>${box(triFig(4,3,{ql:sb('Q','L')}),280)}(a)</figure><figure>${box(triFig(4,-3,{ql:sb('Q','C')}),280)}(b)</figure></div>`},
  {html:`<p>ونستطيع استعمال العلاقة</p>$$S^2=P^2+Q^2 \\qquad 1\\text{-}58$$<p>لحساب إحدى القدرات عندما تكون القدرتان الأخريان معلومتين.</p>
   <p>في دائرة كهربائية مكونة من عدة عناصر نحسب القدرات الكلية ومعامل القدرة الكلي حسب الطريقة الآتية:</p>
   <ul><li>تساوي القدرة الفعالة الكلية \\(P_T\\) مجموع القدرات الفعالة لكل عنصر؛</li><li>تساوي القدرة المفاعلة الكلية \\(Q_T\\) مجموع القدرات المفاعلة لكل عنصر (بإشاراتها)؛</li><li>تعطى القدرة الظاهرية الكلية بالمعادلة $$S_T=\\sqrt{P_T^2+Q_T^2}$$ نلاحظ هنا أن القدرة الظاهرية الكلية <b>لا تساوي</b> مجموع القدرات الظاهرية لكل عنصر، فلننتبه لهذا.</li><li>معامل القدرة الكلي هو \\(\\cos\\theta_T=\\frac{P_T}{S_T}\\).</li></ul>`},
  {h:'مثال (1-3-1)',ref:'ص 68–69',html:`<p>احسب القدرات الفعالة والمفاعلة والظاهرية الكلية وكذلك معامل القدرة الكلي للدائرة المبينة في الشكل 1-54، ثم ارسم مثلث القدرة وبين طبيعة كل حمل من الأحمال الثلاثة.</p>`},
  {fig:'(1-54)',ref:'ص 68',caption:'ثلاثة أحمال: الحمل 1 (200 W، 0 VAR) على الخط، والحملان 2 (100 W، +80 VAR) و3 (300 W، −250 VAR) على التوازي.',draw:()=>box(fig154(),480)},
  {html:`<p><b>الحل:</b></p>$$P_T=P_1+P_2+P_3=200+100+300=600\\ \\text{W}$$$$Q_T=Q_1+Q_2+Q_3=0+80-250=-170\\ \\text{VAR}$$
   <p>نستنتج أن الحمل الكلي مادي - سعوي.</p>$$S_T=\\sqrt{P_T^2+Q_T^2}=\\sqrt{(600)^2+(-170)^2}=624\\ \\text{VA}\\qquad \\cos\\theta_T=\\frac{P_T}{S_T}=\\frac{600}{624}=0.96$$
   <p>ويتقدم التيار الكلي على الجهد المؤثر بالزاوية \\(\\theta_T=15.9^\\circ\\). ويبين الشكل 1-55 مثلث القدرة. طبيعة الأحمال: الحمل 1: مادي، الحمل 2: مادي - حثي، الحمل 3: مادي - سعوي.</p>`},
  {fig:'(1-55)',ref:'ص 69',caption:'مثلث القدرة للمثال (1-3-1): 600 W، −170 VAR، 624 VA، والزاوية −15.9°.',draw:()=>box(triFig(600,-170,{pl:'600 W',ql:'−170 VAR',sl:'624 VA',al:'−15.9°',w:340,h:180,qin:1}),340)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لو جمعنا القدرات الظاهرية للأحمال الثلاثة لحصلنا على \\(200 + 128.1 + 390.5 = 718.6\\) VA، وهذا أكبر من 624 VA. السبب أن Q الحمل 2 (+80) وQ الحمل 3 (−250) يلغي بعضهما بعضاً جزئياً. والزاوية بدقة أكبر \\(\\tan^{-1}(170/600) = 15.8^\\circ\\)؛ الحل حسبها من \\(\\cos^{-1}(600/624)\\) بعد تقريب 624.'},
  {h:'مثال (1-3-2)',ref:'ص 69–71',html:`<p>أ- احسب القدرات الفعالة والمفاعلة والظاهرية وكذلك معامل القدرة لكل فرع من فروع الدائرة المبينة في الشكل 1-56.<br>ب- احسب القدرات الفعالة والمفاعلة والظاهرية الكلية وكذلك معامل القدرة الكلي للدائرة.</p>`},
  {fig:'(1-56)',ref:'ص 70',caption:'مصدر 50∠0° V وثلاثة فروع على التوازي: (4 Ω + ملف 3 Ω)، (5 Ω + مكثف 8 Ω)، (ملف 10 Ω + مكثف 6 Ω).',draw:()=>box(fig156(),600)},
  {html:`<p><b>الحل:</b></p><div class="cb-tbl"><table class="tt"><thead><tr><th>الفرع</th><th>التيار</th><th>P (W)</th><th>Q (VAR)</th><th>S (VA)</th><th>cosθ</th></tr></thead><tbody>
   <tr><td>1: \\(4 + j3 = 5\\angle 36.9^\\circ\\)</td><td>\\(10\\angle -36.9^\\circ\\)</td><td>\\(4\\times10^2 = 400\\)</td><td>\\(3\\times10^2 = 300\\)</td><td>\\(50\\times10 = 500\\)</td><td>0.8</td></tr>
   <tr><td>2: \\(5 - j8 = 9.43\\angle -58^\\circ\\)</td><td>\\(5.3\\angle 58^\\circ\\)</td><td>\\(5\\times5.3^2 = 141\\)</td><td>\\(-8\\times5.3^2 = -225\\)</td><td>\\(50\\times5.3 = 265\\)</td><td>\\(140.5/265 = 0.53\\)</td></tr>
   <tr><td>3: \\(j10 - j6 = 4\\angle 90^\\circ\\)</td><td>\\(12.5\\angle -90^\\circ\\)</td><td>0</td><td>\\((10-6)\\,12.5^2 = 625\\)</td><td>\\(50\\times12.5 = 625\\)</td><td>0</td></tr></tbody></table></div>
   $$P_T=400+141=541\\ \\text{W}\\quad Q_T=300-225+625=700\\ \\text{VAR}$$$$S_T=\\sqrt{(541)^2+(700)^2}=885\\ \\text{VA}\\quad \\cos\\theta_T=\\frac{541}{885}=0.61$$`},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب — مثال (1-3-2) ص 70–71:</b> \\(5\\times5.3^2 = 140.45\\) W؛ طُبعت <b>141</b> في سطر \\(P_2\\) ثم <b>140.5</b> في سطر معامل القدرة، و\\(P_T = 541\\) مبنية على 141. بالقيمة 140.5: \\(P_T = 540.5\\) W و\\(S_T = 884.4\\) VA و\\(\\cos\\theta_T = 0.61\\) — النتائج النهائية لا تتغير بعد التقريب. الحلان (كما في الكتاب / المصحح) في «الأمثلة المحلولة».</span>'},
  {h:'تحسين معامل القدرة — إضافة من خارج الكتاب',html:`<div class="callout"><p><b>«إضافة من خارج الكتاب»</b> — ذكر الكتاب (ص 65) أننا «نلجأ إلى تحسينه» عندما يكون معامل القدرة صغيراً، لكنه لم يشرح الطريقة. هذه الفقرة ليست من الكتاب.</p>
   <p><b>لماذا نحسّنه؟</b> الحمل نفسه (القدرة الفعالة P نفسها) بمعامل قدرة منخفض يسحب تياراً أكبر: \\(I = \\frac{P}{V\\cos\\theta}\\). التيار الأكبر يعني مفاقيد أكبر في الأسلاك \\((RI^2)\\) وهبوط جهد أكبر، ويشغل جزءاً أكبر من قدرة المحولات والمولدات (VA)، ولهذا تفرض شركات الكهرباء حداً أدنى لمعامل القدرة للمصانع.</p>
   <p><b>كيف؟</b> أغلب الأحمال (المحركات، المحولات، مصابيح الفلورسنت) مادية - حثية، أي Q موجبة. نوصل <b>مكثفاً على التوازي</b> مع الحمل؛ المكثف «يولد» قدرة مفاعلة سالبة \\(Q_C\\) (المعادلة 1-57) فتقل \\(Q_T\\) ويقصر ارتفاع مثلث القدرة، بينما تبقى P كما هي وجهد الحمل كما هو.</p>
   $$Q_C = P\\,(\\tan\\theta_1-\\tan\\theta_2)\\qquad\\quad C=\\frac{Q_C}{\\omega V^2}=\\frac{Q_C}{2\\pi f\\,V^2}$$
   <p>حيث \\(\\theta_1\\) زاوية الحمل قبل التحسين و\\(\\theta_2\\) الزاوية المطلوبة. <b>مثال توضيحي</b> على أرقام المثال (1-3-2) (P = 541 W و Q = 700 VAR و V = 50 V)، مع افتراض <span class="ltr">f = 60 Hz</span> (لا يذكره الكتاب): لرفع معامل القدرة من 0.61 إلى 0.95 نحتاج \\(Q_C = 541(1.294-0.329) = 522\\) VAR تقريباً، أي \\(C \\approx 554\\ \\mu\\)F، وينزل تيار المصدر من 17.7 A إلى 11.4 A. الحساب خطوة بخطوة في «الأمثلة المحلولة»، وجرّبه في المختبر.</p>
   <p class="sub">انتبه: مكثف أكبر من اللازم يجعل الحمل الكلي سعوياً (معامل قدرة متقدم)، وهذا غير مرغوب أيضاً.</p></div>`}
 ],
 lab:(el)=>{
  const PRE={e131:{V:null,loads:[{n:'1',P:200,Q:0,on:1},{n:'2',P:100,Q:80,on:1},{n:'3',P:300,Q:-250,on:1}]},
   e132:{V:50,loads:[{n:'1',P:400,Q:300,on:1},{n:'2',P:140.45,Q:-224.72,on:1},{n:'3',P:0,Q:625,on:1}]}};
  let pre='e132',L=JSON.parse(JSON.stringify(PRE.e132.loads)),V=50,f=60,Qc=0,tgt=0.95;const did={};
  el.innerHTML=`<div id="l13tp"></div><div class="grid cb-lab">
   <div class="panel c6"><h2>الأحمال <small>مبنية على الشكلين (1-54) و(1-56)</small></h2>
    <div class="cb-row"><span class="sub">أرقام الكتاب:</span>${segHTML('pr',[['e131','مثال 1-3-1'],['e132','مثال 1-3-2']],pre)}</div>
    <div id="l13L" class="cb-zg"></div><p class="sub">Q موجبة = حمل حثي (ملف)، Q سالبة = حمل سعوي (مكثف).</p></div>
   <div class="panel c6"><h2>مثلث القدرة <small>الأحمال مرسومة رأساً لذيل، والأحمر = المجموع S<sub>T</sub></small></h2><div class="svgbox" id="l13t" style="max-width:440px;margin-inline:auto"></div>
    ${legend([['--live','أحمال حثية'],['--on','أحمال سعوية / المكثف'],['--muted','أحمال مادية'],['--stop','S<sub>T</sub>']])}
    <div class="facts">${fact('P<sub>T</sub>','l13P')}${fact('Q<sub>T</sub>','l13Q')}${fact('S<sub>T</sub> = √(P² + Q²)','l13S')}${fact('مجموع S للأحمال','l13Ss')}${fact('cosθ<sub>T</sub>','l13pf')}${fact('تيار المصدر I = S<sub>T</sub>/V','l13I')}</div></div>
   <div class="panel c12"><h2>تحسين معامل القدرة بمكثف على التوازي <small>إضافة من خارج الكتاب</small></h2>
    <div class="cb-sls">${nsl('l13qc','القدرة المفاعلة للمكثف Q<sub>C</sub> (تولد −Q<sub>C</sub>)',0,1200,1,0,'VAR')}${nsl('l13tg','معامل القدرة المطلوب',0.7,1,0.01,tgt,'')}</div>
    <div class="cb-row"><button class="btn primary" id="l13calc">احسب Q<sub>C</sub> اللازم وضعه</button><span class="sub">التردد:</span>${segHTML('f',[[50,'50 Hz'],[60,'60 Hz']],f)}<span class="sub" id="l13vn"></span></div>
    <div class="facts">${fact('سعة المكثف C = Q<sub>C</sub>/(ωV²)','l13C')}${fact('تيار المصدر قبل المكثف','l13I0')}${fact('تيار المصدر الآن','l13I1')}</div>
    <div class="cb-row"><span id="l13chip" class="cb-chip"></span></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l13st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l13tp'),'u1-l13',[{k:'V',label:'جهد المصدر للمثال 1-3-1 (لا يذكره الكتاب)',unit:'V',value:220,min:1,max:100000}],()=>{if(pre==='e131'){V=TP.v.V;draw()}});
  const setQc=nslBind(el,'l13qc',v=>{Qc=v;draw()});nslBind(el,'l13tg',v=>{tgt=v;draw()});
  segBind(el,'f',v=>{f=+v;draw()});
  const rows=()=>{$('#l13L').innerHTML=L.map((l,i)=>`<div class="cb-zc"><h4><label><input type="checkbox" data-on="${i}" ${l.on?'checked':''}> ${pre==='e132'?'الفرع':'الحمل'} ${l.n}</label></h4><div class="cb-in2">${ni('l13p'+i,'P (W)',l.P)}${ni('l13q'+i,'Q (VAR)',l.Q)}</div></div>`).join('');
   L.forEach((l,i)=>{$('#l13p'+i).addEventListener('input',e=>{const v=parseFloat(e.target.value);l.P=isFinite(v)?Math.max(0,v):0;draw()});$('#l13q'+i).addEventListener('input',e=>{const v=parseFloat(e.target.value);l.Q=isFinite(v)?v:0;draw()})});
   el.querySelectorAll('[data-on]').forEach(c=>c.addEventListener('change',()=>{L[+c.dataset.on].on=c.checked?1:0;draw()}))};
  segBind(el,'pr',k=>{pre=k;L=JSON.parse(JSON.stringify(PRE[k].loads));V=PRE[k].V||TP.v.V;Qc=0;setQc(0);rows();did[k]=1;draw()});
  $('#l13calc').onclick=()=>{const P=L.reduce((a,l)=>a+(l.on?l.P:0),0),Q=L.reduce((a,l)=>a+(l.on?l.Q:0),0);const need=Q-P*Math.tan(Math.acos(tgt));Qc=Math.max(0,RD(need,0));setQc(Qc);draw()};
  let R13={};
  /* عطل مخفي: فرع الحمل 3 لا يعمل، أو المكثف لا يعطي قدرته المفاعلة كاملة (للقراءات فقط). خارج وضع التحدي لا فرق */
  function draw(){const on=L.filter((l,i)=>l.on&&!(i===2&&chF('lopen')));const QcA=chF('cfuse')?0:chF('chalf')?Qc/2:Qc;const P=on.reduce((a,l)=>a+l.P,0),Q0=on.reduce((a,l)=>a+l.Q,0),Q=Q0-QcA,S=Math.hypot(P,Q),S0=Math.hypot(P,Q0),Ss=on.reduce((a,l)=>a+Math.hypot(l.P,l.Q),0),pf=S>0?P/S:1;R13={P,Q,pf};
   $('#l13vn').textContent='جهد المصدر V = '+f1(V,1)+' V'+(pre==='e131'?' (توضيحي)':' (من المثال)');
   $('#l13P').textContent=f1(P,1)+' W';$('#l13Q').textContent=f1(Q,1)+' VAR';$('#l13S').textContent=f1(S,1)+' VA';$('#l13Ss').textContent=f1(Ss+(QcA>0?QcA:0),1)+' VA';
   $('#l13pf').textContent=f1(pf,3)+(Math.abs(Q)<1e-6?'':Q>0?' متأخر':' متقدم');$('#l13I').textContent=f1(S/V,2)+' A';
   $('#l13C').textContent=f1(Qc/(2*PI*f*V*V)*1e6,1)+' µF';$('#l13I0').textContent=f1(S0/V,2)+' A';$('#l13I1').textContent=f1(S/V,2)+' A';
   const ch=$('#l13chip');if(Qc<=0){ch.className='cb-chip';ch.textContent='بلا مكثف'}else if(Q<-1e-6){ch.className='cb-chip warn';ch.textContent='مكثف أكبر من اللازم: صار الحمل الكلي سعوياً (معامل قدرة متقدم)'}else{ch.className='cb-chip ok';ch.textContent='المكثف خفّض Q_T والتيار، و P لم تتغير'}
   const its=[];let acc=Cx(0);on.forEach(l=>{const z=Cx(l.P,l.Q);if(cabs(z)<1e-9)return;its.push({z,from:cabs(acc)>1e-9?acc:null,lab:l.n,col:l.Q>0?'--live':l.Q<0?'--on':'--muted',w:2.2,mid:-1});acc=cadd(acc,z)});
   if(QcA>0){its.push({z:Cx(0,-QcA),from:cabs(acc)>1e-9?acc:null,lab:'QC',col:'--on',dash:'6 4',w:2.2,mid:-1});acc=cadd(acc,Cx(0,-QcA))}
   if(cabs(acc)>1e-9)its.push({z:acc,lab:'ST',col:'--stop',w:3.2,mid:1});
   $('#l13t').innerHTML=its.length?phasorSVG(its,{w:440,h:300,eq:true,arcs:[{a1:0,a2:cang(acc),r:46,lab:f1(cang(acc),1)+'°',col:'--stop'}],xl:'P',yl:'Q'}):'';
   steps.check()}
  const steps=stepsUI($('#l13st'),[
   {t:'مثال (1-3-1)',x:'اختر «مثال 1-3-1»: \\(P_T = 600\\) W و\\(Q_T = -170\\) VAR و\\(S_T = 624\\) VA ومعامل القدرة 0.96 متقدم (الحمل الكلي مادي - سعوي).',done:()=>did.e131&&Math.abs(R13.P-600)<1e-6&&Math.abs(R13.Q+170)<1e-6},
   {t:'لا نجمع S',x:'قارن «مجموع S للأحمال» (718.6 VA) مع \\(S_T\\) (624 VA): في الرسم، الخط الأحمر المباشر أقصر من الطريق المتعرج عبر الأحمال.'},
   {t:'مثال (1-3-2)',x:'اختر «مثال 1-3-2»: \\(P_T ≈ 540.5\\) W و\\(Q_T ≈ 700\\) VAR ومعامل القدرة 0.61 متأخر — منخفض.',done:()=>did.e132&&Math.abs(R13.P-540.45)<0.01},
   {t:'حسّن معامل القدرة',x:'في مثال 1-3-2 اضغط «احسب Q<sub>C</sub> اللازم» أو حرّك مؤشر المكثف حتى يصير معامل القدرة 0.95 متأخراً أو أكثر: لاحظ أن P لم تتغير وأن تيار المصدر نزل.',done:()=>Qc>0&&R13.Q>=-1e-6&&R13.pf>=0.95},
   {t:'مكثف أكبر من اللازم',x:'زد Q<sub>C</sub> حتى تصير \\(Q_T\\) سالبة: صار الحمل سعوياً ومعامل القدرة متقدماً، ويرجع التيار للزيادة.',done:()=>Qc>0&&R13.Q<-1}
  ]);
  rows();draw();
 },
 examples:[
  {title:'مثال (1-3-1)',ref:'ص 68–69',q:'<p>احسب القدرات الفعالة والمفاعلة والظاهرية الكلية وكذلك معامل القدرة الكلي للدائرة المبينة في الشكل 1-54، ثم بين طبيعة كل حمل من الأحمال الثلاثة.</p>',given:G131,solve:g=>pq131(g),note:'الزاوية محسوبة من \\(\\cos^{-1}(P_T/S_T)\\) بعد تقريب \\(S_T\\) كما في الحل؛ القيمة الأدق \\(\\tan^{-1}(|Q_T|/P_T) = 15.8^\\circ\\).'},
  {title:'مثال (1-3-2) — الحل كما في الكتاب',ref:'ص 69–71',q:'<p>أ- احسب القدرات الفعالة والمفاعلة والظاهرية ومعامل القدرة لكل فرع من فروع الدائرة المبينة في الشكل 1-56. ب- احسب القدرات الكلية ومعامل القدرة الكلي.</p>',given:G132,solve:(g,B,isBook)=>pq132(g,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة \\(P_2 = 141\\) W كما طُبعت ثم 140.5 في معامل القدرة. إذا غيّرت أي رقم تحسب الحاسبة بقيمة واحدة. قارن بالحل المصحح أدناه.'},
  {title:'مثال (1-3-2) — الحل المصحح',ref:'ص 69–71',q:'<p>نفس المثال بقيمة واحدة \\(P_2 = 140.5\\) W في كل السطور. (حساب مصحح — ليس من الكتاب.)</p>',given:G132,solve:g=>pq132(g,false),note:'\\(P_T = 540.5\\) W و\\(S_T = 884.4\\) VA و\\(\\cos\\theta_T = 0.61\\): النتيجة النهائية كما في الكتاب.'},
  {title:'تحسين معامل القدرة — إضافة من خارج الكتاب',ref:'ليس من الكتاب',q:'<p>حمل قدرته الفعالة P وقدرته المفاعلة Q (أرقام المثال 1-3-2)، يغذيه مصدر جهده V. احسب القدرة المفاعلة وسعة المكثف الموصول على التوازي اللازمين لرفع معامل القدرة إلى القيمة المطلوبة. (التردد 60 Hz افتراض؛ الكتاب لا يذكره.)</p>',given:GPFC,solve:g=>pfcSteps(g)}
 ],
 quiz:[
  {q:'في مثلث القدرة، الوتر هو:',o:['القدرة الفعالة P','القدرة المفاعلة Q','القدرة الظاهرية S','معامل القدرة'],c:2,e:'ص 67.'},
  {q:'العلاقة بين القدرات الثلاث:',o:['S = P + Q','S² = P² + Q²','P = S + Q','Q = P·S'],c:1,e:'المعادلة 1-58.'},
  {q:'حمل P = 300 W و Q = 400 VAR. قدرته الظاهرية:',o:['700 VA','500 VA','100 VA','120000 VA'],c:1,e:'\\(\\sqrt{300^2 + 400^2} = 500\\) VA.'},
  {q:'في دائرة من عدة أحمال، القدرة الظاهرية الكلية:',o:['مجموع S لكل الأحمال','\\(\\sqrt{P_T^2 + Q_T^2}\\)','مجموع P فقط','مجموع Q فقط'],c:1,e:'ص 68: «لا تساوي مجموع القدرات الظاهرية لكل عنصر».'},
  {q:'إذا كانت Q<sub>T</sub> سالبة فإن الحمل الكلي:',o:['مادي - حثي','مادي - سعوي','مادي بحت','لا يستهلك قدرة'],c:1,e:'مثال (1-3-1): \\(Q_T = -170\\) VAR.'},
  {q:'فرع فيه ملف 10 Ω ومكثف 6 Ω على التوالي وتياره 12.5 A. قدرته المفاعلة:',o:['625 VAR','−625 VAR','1562.5 VAR','0'],c:0,e:'مثال (1-3-2): \\((10 - 6)\\times12.5^2 = 625\\) VAR.'},
  {q:'(إضافة من خارج الكتاب) لتحسين معامل قدرة حمل حثي نوصل:',o:['ملفاً على التوالي','مكثفاً على التوازي مع الحمل','مقاومة على التوازي','لا شيء'],c:1,e:'المكثف يولد قدرة مفاعلة سالبة فتقل \\(Q_T\\) ولا تتغير P.'},
  {q:'(إضافة من خارج الكتاب) بعد تحسين معامل القدرة، تيار المصدر لنفس الحمل:',o:['يزيد','يقل','لا يتغير','يصبح صفراً'],c:1,e:'\\(I = P/(V\\cos\\theta)\\): كلما زاد cosθ قل التيار.'}
 ]
});

/* ======================================================================
   Lesson 14 — measuring active power with a wattmeter (ص 72–73) + chapter-3 problems (ص 74)
   ====================================================================== */
/* الشكلان 1-57 و 1-58: m = 1 (PC before CC) or 2 (PC after CC) */
function wattFig(m,o){o=o||{};const top=70,bot=210,xs=70,xl=520,xc1=250,xc2=340,xp=m===1?215:375;let s=svgO(620,250,m===1?'الطريقة الأولى لتوصيل الواتميتر':'الطريقة الثانية لتوصيل الواتميتر');
  s+=`<rect x="185" y="30" width="220" height="200" rx="8" fill="none" stroke="var(--muted)" stroke-dasharray="6 5"/>`+arT(295,22,'الواتميتر',{fs:13});
  s+=wire([[xs,top],[xc1,top]])+comp('L',xc1,top,xc2,top,{l:'CC',c:o.cc?'--live':'--fg'})+wire([[xc2,top],[xl,top]])+wire([[xs,bot],[xl,bot]]);
  s+=comp('L',xp,top,xp,bot,{l:'PC',side:m===1?-1:1,c:o.pc?'--blue':'--fg'})+dot(xp,top)+dot(xp,bot);
  s+=comp('Z',xl,top,xl,bot,{b:90})+arT(xl+18,(top+bot)/2-4,'الحمل',{a:'start',fs:13});
  s+=`<circle cx="${xs}" cy="${top}" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/><circle cx="${xs}" cy="${bot}" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`+arT(xs+30,(top+bot)/2+5,'المصدر',{a:'start',fs:13});
  if(o.vals)s+=o.vals;return s+'</svg>'}
const figC1=()=>parFig({src:'200 V',it:'i',br:[{t:'Z',l:sb('Z','1'),i:sb('i','1')},{t:'Z',l:sb('Z','2'),i:sb('i','2')}],first:90,sp:120,wr:90,aria:'شكل المسألة 1 من مسائل الفصل الثالث'});
function wmSteps(g){const P=RD(g.V*g.I*g.pf,1),Pi=RD(g.Ri*g.I*g.I,1),Pv=RD(g.V*g.V/g.Rv,1);
  return [{t:'القدرة الحقيقية التي يستهلكها الحمل:',f:`P = VI\\cos\\theta = ${f1(g.V)}\\times ${f1(g.I)}\\times ${f1(g.pf)}`,v:P,unit:'W',dp:1,final:true},
   {t:'<b>حسب الطريقة الأولى</b> (ملف الجهد قبل ملف التيار): القدرة المستهلكة في ملف التيار',f:`P_i = R_i I^2 = ${f1(g.Ri)}\\times ${f1(g.I)}^2`,v:Pi,unit:'W',dp:1},
   {t:'القدرة التي يقيسها الجهاز:',f:`P_T = P + P_i = ${f1(P,1)} + ${f1(Pi,1)}`,v:RD(P+Pi,1),unit:'W',dp:1,final:true},
   {t:'<b>حسب الطريقة الثانية</b> (ملف الجهد بعد ملف التيار): القدرة المستهلكة في ملف الجهد',f:`P_v = \\frac{V^2}{R_v} = \\frac{${f1(g.V)}^2}{${f1(g.Rv)}}`,v:Pv,unit:'W',dp:1},
   {t:'القدرة التي يقيسها الجهاز:',f:`P_T = P + P_v = ${f1(P,1)} + ${f1(Pv,1)}`,v:RD(P+Pv,1),unit:'W',dp:1,final:true},
   {t:`<b>توضيح (ليس من الكتاب):</b> الخطأ في الطريقة الأولى ${lt(f1(Pi/P*100,2)+'%')} وفي الثانية ${lt(f1(Pv/P*100,2)+'%')}؛ فالطريقة ${Pi<Pv?'الأولى':'الثانية'} أدق لهذا الحمل. الطريقتان تتساويان عندما \\(R_i I^2 = V^2/R_v\\) أي عند \\(I = V/\\sqrt{R_i R_v} = ${f1(g.V/Math.sqrt(g.Ri*g.Rv),2)}\\) A.`}]}
const GWM=[{id:'V',label:'جهد الحمل',sym:'V',unit:'V',value:220},{id:'I',label:'تيار الحمل',sym:'I',unit:'A',value:3},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8,min:0,max:1},{id:'Rv',label:'مقاومة ملف الجهد',sym:'R_v',unit:'Ω',value:2000,min:0.01},{id:'Ri',label:'مقاومة ملف التيار',sym:'R_i',unit:'Ω',value:3}];
function cpr1(g){const V=Cx(g.V),Z1=Cx(g.R1,g.X1),Z2=Cx(g.R2,g.X2),I1=cdiv(V,Z1),I2=cdiv(V,Z2),I=cadd(I1,I2),P=g.R1*cabs(I1)**2+g.R2*cabs(I2)**2,Q=g.X1*cabs(I1)**2+g.X2*cabs(I2)**2,S=Math.hypot(P,Q);
  return [{t:'تيار كل معاوقة (الجهد نفسه على الاثنتين):',f:`I_1 = \\frac{${f1(g.V)}}{${RZ(Z1,2)}} = ${PZc(I1,2,2)}\\ \\text{A},\\qquad I_2 = \\frac{${f1(g.V)}}{${RZ(Z2,2)}} = ${PZc(I2,2,2)}\\ \\text{A}`},
   {t:'التيار الكلي:',f:`I = I_1 + I_2 = ${RZ(I,2)} = ${PZc(I,2,2)}\\ \\text{A}`,final:true},
   {t:'القدرة الفعالة الكلية (مجموع \\(R\\,I^2\\)):',f:`P_T = ${f1(g.R1)}\\times${f1(cabs(I1),2)}^2 + ${f1(g.R2)}\\times${f1(cabs(I2),2)}^2`,v:P,unit:'W',dp:1,final:true},
   {t:'القدرة المفاعلة الكلية (مجموع \\(X\\,I^2\\) بإشاراتها):',f:`Q_T = (${f1(g.X1)})\\times${f1(cabs(I1),2)}^2 + (${f1(g.X2)})\\times${f1(cabs(I2),2)}^2`,v:Q,unit:'VAR',dp:1,final:true},
   {t:'القدرة الظاهرية الكلية:',f:`S_T = \\sqrt{P_T^2 + Q_T^2} = V\\,I`,v:S,unit:'VA',dp:1,final:true},
   {t:'معامل القدرة:',f:`\\cos\\theta_T = \\frac{P_T}{S_T}`,v:P/S,dp:3,final:true},{t:Q<0?'Q سالبة: معامل القدرة متقدم (الحمل الكلي مادي - سعوي).':'Q موجبة: معامل القدرة متأخر.'}]}
const GC1=[{id:'V',label:'الجهد',sym:'V',unit:'V',value:200},{id:'R1',label:'الجزء الحقيقي لـ Z₁',sym:'R_1',unit:'Ω',value:6},{id:'X1',label:'الجزء التخيلي لـ Z₁',sym:'X_1',unit:'Ω',value:-8},{id:'R2',label:'الجزء الحقيقي لـ Z₂',sym:'R_2',unit:'Ω',value:8},{id:'X2',label:'الجزء التخيلي لـ Z₂',sym:'X_2',unit:'Ω',value:6}];
function cpr2(g){const r=pr3calc(g),I=cabs(r.I),P=r.R*I*I,Q=r.X*I*I,S=Math.hypot(P,Q);
  return [{t:'من حل المسألة 3 في الفصل الثاني:',f:`Z_T = ${RZ(r.Z,2)}\\ \\Omega,\\qquad I = \\frac{V}{|Z_T|} = \\frac{${f1(g.Vm/SQ2,2)}}{${f1(cabs(r.Z),2)}} = ${f1(I,4)}\\ \\text{A}`},
   {t:'القدرة الفعالة (في المقاومتين فقط):',f:`P = (R_1 + R_2)\\,I^2 = ${f1(r.R)}\\times ${f1(I,4)}^2`,v:P,unit:'W',dp:2,final:true},
   {t:'القدرة المفاعلة (الملفان موجبة والمكثف سالبة):',f:`Q = (X_{L1} + X_{L2} - X_C)\\,I^2 = (${f1(r.X,2)})\\times ${f1(I,4)}^2`,v:Q,unit:'VAR',dp:2,final:true},
   {t:'القدرة الظاهرية التي يوفرها المصدر:',f:`S = V\\,I = \\sqrt{P^2 + Q^2}`,v:S,unit:'VA',dp:2,final:true},
   {t:'معامل القدرة الكلي:',f:`\\cos\\theta = \\frac{P}{S}`,v:P/S,dp:3,final:true},{t:Q<0?'متقدم (الحمل مادي - سعوي).':'متأخر.'}]}
function cpr3(g){const r=meshSolve(Cx(g.R1,g.X1),Cx(g.R2,-g.XC),Cx(g.R3,g.XL),Cx(g.V),Cx(0)),It=cabs(r.Ia),I2=cabs(r.Ib),Q1=g.X1*It*It,Q2=g.XL*I2*I2;
  return [{t:'من حل المثال (1-2-14) المصحح (أو المسألة 7 في الفصل الثاني):',f:`I_T = ${PZc(r.Ia,2,1)}\\ \\text{A},\\qquad I_2 = ${PZc(r.Ib,2,1)}\\ \\text{A}`},
   {t:'الملف الأول (على الخط الرئيسي) يمر فيه \\(I_T\\):',f:`Q_{L1} = X_{L1}\\,I_T^2 = ${f1(g.X1)}\\times ${f1(It,2)}^2`,v:Q1,unit:'VAR',dp:1,final:true},
   {t:'الملف الثاني (في الفرع الأيمن) يمر فيه \\(I_2\\):',f:`Q_{L2} = X_{L2}\\,I_2^2 = ${f1(g.XL)}\\times ${f1(I2,2)}^2`,v:Q2,unit:'VAR',dp:1,final:true},
   {t:'مجموع ما يستهلكه الملفان:',f:`Q_{L1} + Q_{L2}`,v:Q1+Q2,unit:'VAR',dp:1,final:true},
   {t:'(السؤال يقول «ملف» بالمفرد والدائرة فيها ملفان، لذلك أعطينا الاثنين.)'}]}

B.lesson({
 id:'u1-l14',unit:1,order:14,pages:'72–74',
 title:'قياس القدرة الفعالة بالواتميتر + مسائل الفصل الثالث',
 summary:'الواتميتر فيه ملف تيار يوصل على التوالي مع الحمل وملف جهد يوصل على التوازي. للتوصيل طريقتان: كل منهما تضيف إلى القراءة مفقود أحد الملفين، فنختار الطريقة الأولى للأحمال الصغيرة والثانية للأحمال الكبيرة. مع المثال (1-3-3) ومسائل الفصل الثالث.',
 stations:[
  {intro:true},

  {st:1,short:'الواتميتر',title:'استخدام الواتميتر لقياس القدرة الفعالة',ref:'ص 72–73',
   q:'جهاز يقيس القدرة يحتاج أن «يعرف» التيار والجهد معاً… فكيف يوصل في الدائرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الواتميتر بالطريقة الأولى: ملف التيار CC على التوالي مع الحمل، وملف الجهد PC متصل قبله من جهة المصدر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M45 110 L45 157" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 193 L45 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="45" cy="175" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M35 175 q5 -11 10 0 t10 0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="45" y="268" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">المصدر</text><path d="M45 110 L150 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="ملف التيار ⟦CC⟧: يوصل على التوالي مع الحمل، فيمر فيه تيار الحمل. مقاومته صغيرة."><path d="M150 110 a6.0 6.0 0 0 1 12.0 0 a6.0 6.0 0 0 1 12.0 0 a6.0 6.0 0 0 1 12.0 0 a6.0 6.0 0 0 1 12.0 0 a6.0 6.0 0 0 1 12.0 0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><text x="180" y="94" text-anchor="middle" font-size="13" fill="#B5523C" font-weight="700" direction="ltr" font-family="var(--mono)">CC</text><rect x="145" y="76" width="70" height="48" rx="6" fill="transparent"/></g><path d="M210 110 L305 110" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="ملف الجهد ⟦PC⟧: يوصل على التوازي، فيمر فيه تيار يتناسب مع الجهد. مقاومته كبيرة. في الطريقة الأولى يتصل قبل ⟦CC⟧ من جهة المصدر."><circle cx="120" cy="110" r="4.5" fill="#2C4A40"/><path d="M120 110 L120 145" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 145 a6.0 6.0 0 0 1 0 12.0 a6.0 6.0 0 0 1 0 12.0 a6.0 6.0 0 0 1 0 12.0 a6.0 6.0 0 0 1 0 12.0 a6.0 6.0 0 0 1 0 12.0" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 205 L120 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="120" cy="240" r="4.5" fill="#2C4A40"/><text x="104" y="180" text-anchor="end" font-size="13" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">PC</text><rect x="85" y="110" width="60" height="130" rx="6" fill="transparent"/></g><g data-tip="الحمل: القدرة التي يستهلكها هي المطلوب قياسها."><rect x="285" y="145" width="40" height="60" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="305" y="268" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الحمل</text><rect x="280" y="140" width="50" height="70" rx="6" fill="transparent"/></g><path d="M305 110 L305 145" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M305 205 L305 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M45 240 L305 240" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="الإطار المتقطع: جهاز الواتميتر نفسه، وفيه الملفان معاً."><rect x="92" y="72" width="132" height="152" rx="12" fill="none" stroke="#8A9A93" stroke-width="2" stroke-dasharray="6 5"/><text x="158" y="64" text-anchor="middle" font-size="13" fill="#8A9A93" font-weight="700" direction="rtl">الواتميتر</text><rect x="92" y="50" width="132" height="30" rx="6" fill="transparent"/></g><text x="180" y="36" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">الطريقة الأولى</text></svg>`,
   cap:'الواتميتر موصول بالطريقة الأولى كما في الشكل <span class="ltr">(1-57)</span>.<br><b>مرّر المؤشر على الملفين والحمل والإطار المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كيف يوصل ملف التيار (CC) في الواتميتر؟',opts:[
     ['على التوازي مع الحمل',false,'على التوازي يوصل ملف الجهد (PC).'],
     ['على التوالي مع الحمل',true,'نص الكتاب: «نوصل ملف التيار (CC) على التوالي مع الحمل»، فيمر فيه تيار الحمل.'],
     ['لا يوصل بالحمل',false,'ملف التيار يجب أن يمر فيه تيار الحمل.']]}}
   ],
   body:[
    {book:String.raw`<p>هناك عدة أنواع من الواتميترات، وهي تحتوي على ملفات للتيار وملفات للجهد، وتعتمد قراءتها على زاوية الطور بينهما. ومن بين الأجهزة المستعملة نذكر <b>الواتميتر الكهروديناميكي</b> و<b>الواتميتر الحثي</b>.</p>
     <p>ويحتوي جهاز الواتميتر على ملفين: يغذى الملف الأول بتيار الحمل ويعرف هذا الملف <b>بملف التيار</b> (CC)، أما الملف الآخر والمعروف <b>بملف الجهد</b> (PC) فإنه يغذى بتيار يتناسب مع الجهد بين طرفي الحمل.</p>
     <p>وهناك طريقتان لتوصيل جهاز الواتميتر لقياس القدرة التي يستهلكها حمل معين:</p>
     <p><b>الطريقة الأولى</b> (الشكل 1-57): نوصل ملف التيار (CC) على التوالي مع الحمل، أما ملف الجهد (PC) فإنه يوصل عبر ملف التيار والحمل معاً. وهنا فإن القدرة المقاسة أكبر من القدرة التي يستهلكها الحمل لأننا نقيس كذلك القدرة المفقودة في ملف التيار.</p>
     <p><b>الطريقة الثانية</b> (الشكل 1-58): نوصل ملف الجهد PC عبر أطراف الحمل فقط، وهنا فإن التيار المار في ملف التيار CC يساوي مجموع التيار المار في الحمل والتيار المار في ملف الجهد، وعلى ذلك فإن القدرة المقاسة تساوي مجموع القدرة الحقيقية والقدرة المستهلكة في ملف الجهد.</p>`,ref:'ص 72'},
    {title:'بدّل طريقة التوصيل وراقب ما يُضاف إلى القراءة',widget:(el,B)=>{
      const T={1:['ملف الجهد PC قبل ملف التيار CC (جهة المصدر)','PC يقيس جهد الحمل + هبوط الجهد على CC','تُضاف إلى القراءة قدرة ملف التيار: \\(P_i=R_iI^2\\)','أدق مع الحمل الصغير (تيار صغير)'],
               2:['ملف الجهد PC بعد ملف التيار CC (جهة الحمل)','CC يمر فيه تيار الحمل + تيار PC','تُضاف إلى القراءة قدرة ملف الجهد: \\(P_v=\\frac{V^2}{R_v}\\)','أدق مع الحمل الكبير (تيار كبير)']};
      let m=1,tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=T[m];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">طريقة التوصيل:</span><span class="mseg">${[[1,'الأولى'],[2,'الثانية']].map(([v,l])=>`<button type="button" data-m="${v}" aria-pressed="${v===m}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
         <div style="margin-top:10px">${box(wattFig(m),520)}</div><p class="sub" style="text-align:center;margin:0">الشكل <span class="ltr">(1-5${m===1?7:8})</span></p>
         <div class="chain" style="margin-top:10px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        B.math(el);
        el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=+b.dataset.m;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {book:String.raw`<p>وتعتمد طريقة توصيل الواتميتر على نوع الحمل المراد قياسه. فعندما يكون الحمل <b>صغيراً</b> يستحسن استعمال <b>الطريقة الأولى</b> لأن في هذه الحالة يكون هبوط الجهد عبر ملف التيار (ذي المقاومة الصغيرة) صغيراً يمكن إهماله. أما إذا كان الحمل <b>كبيراً</b>، فمن الأفضل استعمال <b>الطريقة الثانية</b> لأن قيمة التيار المار في ملف الجهد (ذي المقاومة الكبيرة) صغيرة في هذه الحالة.</p>
     <p>وتزود كثير من الواتميترات بملفات خاصة لتعويض الخطأ الناتج عن فقد القدرة في أحد ملفي الجهاز.</p>`,ref:'ص 73'},
    {tip:String.raw`<p>خطأ الطريقة الأولى \(R_iI^2\) يكبر مع مربع التيار، وخطأ الطريقة الثانية \(V^2/R_v\) ثابت تقريباً لأن الجهد ثابت. لذلك مع التيار الصغير (حمل صغير) تكون الأولى أدق، ومع التيار الكبير (حمل كبير) تكون الثانية أدق. وتتساوى الطريقتان عندما \(R_iI^2=V^2/R_v\). شاهد المنحنى في المختبر.</p>`,title:'لماذا الأولى للحمل الصغير؟'},
    {watch:String.raw`<p>«حمل صغير» هنا يعني تياراً صغيراً (قدرة صغيرة)، لا حجماً صغيراً. والخطأ في الطريقتين يجعل القراءة <b>أكبر</b> من القدرة الحقيقية دائماً، لا أصغر.</p>`}
   ]},

  {st:2,short:'مثال <span class="ltr">(1-3-3)</span>',title:'مثال <span class="ltr">(1-3-3)</span>: قراءة الواتميتر بالطريقتين',ref:'ص 73',
   q:'حمل قدرته الحقيقية معروفة: كم سيزيد عليها الواتميتر في كل طريقة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أشرطة: القدرة الحقيقية 528 واط، وقراءة الطريقة الأولى 555 واط، والثانية 552.2 واط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">القراءة أكبر من القدرة الحقيقية</text><g data-tip="القدرة التي يستهلكها الحمل فعلاً: ⟦P = VI cosθ = 528 W⟧."><text x="330" y="86" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">القدرة الحقيقية</text><rect x="87.1" y="94" width="242.9" height="26" rx="6" fill="#12855A"/><text x="81.11999999999998" y="113" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">528 W</text><rect x="20" y="72" width="320" height="52" rx="6" fill="transparent"/></g><g data-tip="الطريقة الأولى تضيف قدرة ملف التيار ⟦Pi = Ri I² = 27 W⟧."><text x="330" y="154" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">قراءة الطريقة الأولى</text><rect x="74.7" y="162" width="255.3" height="26" rx="6" fill="#E8735A"/><text x="68.69999999999999" y="181" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">555 W</text><rect x="20" y="140" width="320" height="52" rx="6" fill="transparent"/></g><g data-tip="الطريقة الثانية تضيف قدرة ملف الجهد ⟦Pv = V²/Rv = 24.2 W⟧."><text x="330" y="222" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">قراءة الطريقة الثانية</text><rect x="76.0" y="230" width="254.0" height="26" rx="6" fill="#4FB3A9"/><text x="69.98799999999997" y="249" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">552.2 W</text><rect x="20" y="208" width="320" height="52" rx="6" fill="transparent"/></g></svg>`,
   cap:'القدرة الحقيقية وقراءتا الواتميتر بالطريقتين (أرقام المثال).<br><b>مرّر المؤشر على كل شريط (أو المسه في الجوال) لتعرف من أين جاء.</b>',
   side:[
    {predict:{q:'في هذا المثال، أي الطريقتين أقرب إلى القدرة الحقيقية 528 W؟',opts:[
     ['الطريقة الأولى',false,String.raw`تضيف <span class="ltr">27 W</span>، وهو أكبر من خطأ الثانية.`],
     ['متساويتان',false,String.raw`الخطآن مختلفان: <span class="ltr">27 W</span> و<span class="ltr">24.2 W</span>.`],
     ['الطريقة الثانية',true,String.raw`تضيف <span class="ltr">24.2 W</span> فقط، فقراءتها <span class="ltr">552.2 W</span>.`]]}}
   ],
   body:[
    {book:String.raw`<p>إذا كانت القيمة الفعالة للجهد بين طرفي حمل <span class="ltr">V = 220 V</span>، وكانت القيمة الفعالة للتيار المار فيه <span class="ltr">I = 3 A</span>، وكان معامل قدرته <span class="ltr">cosθ = 0.8</span>، احسب القدرة التي يقيسها واتميتر حسب الطريقتين، علماً أن مقاومة ملف الجهد للجهاز <span class="ltr">R<sub>v</sub> = 2000 Ω</span>، ومقاومة ملف التيار <span class="ltr">R<sub>i</sub> = 3 Ω</span>.</p>
     <p><b>الحل:</b></p>$$P=VI\cos\theta=220\times3\times0.8=528\ \text{W}$$
     <p>حسب الطريقة الأولى: القدرة المستهلكة في ملف التيار \(P_i=R_iI^2=3\times3^2=27\) W، والقدرة التي يقيسها الجهاز \(P_T=P+P_i=528+27=555\) W.</p>
     <p>حسب الطريقة الثانية: القدرة المستهلكة في ملف الجهد \(P_v=\frac{V^2}{R_v}=\frac{220^2}{2000}=24.2\) W، والقدرة التي يقيسها الجهاز \(P_T=P+P_v=528+24.2=552.2\) W.</p>`,ref:'ص 73'},
    {tip:String.raw`<p>الخطأ النسبي: الطريقة الأولى \(\frac{27}{528}\approx 5.1\%\)، والثانية \(\frac{24.2}{528}\approx 4.6\%\). الفرق صغير هنا لأن الخطأين متقاربان؛ ولو كان تيار الحمل أكبر لكبر خطأ الطريقة الأولى بسرعة (مع مربع التيار)، بينما يبقى خطأ الثانية <span class="ltr">24.2 W</span> ما دام الجهد <span class="ltr">220 V</span>.</p>`,title:'كم الخطأ؟'},
    {watch:String.raw`<p>في الطريقة الثانية نستعمل جهد الحمل \(V\) في \(P_v=V^2/R_v\)، لأن ملف الجهد موصول على طرفي الحمل مباشرة. وفي الطريقة الأولى نستعمل تيار الحمل \(I\) في \(P_i=R_iI^2\).</p>`},
    {title:'مختبر مصغّر: حمل صغير أم كبير؟',widget:(el,B)=>DCML.lab(el,B,{intro:'أرقام المثال: <span class="ltr">V = 220 V</span> و<span class="ltr">cosθ = 0.8</span> و<span class="ltr">R<sub>i</sub> = 3 Ω</span> و<span class="ltr">R<sub>v</sub> = 2000 Ω</span>. التيار في الكتاب <span class="ltr">3 A</span>؛ غيّره (<b>أرقام تختارها أنت</b>) وقارن خطأ الطريقتين.',
 predict:{q:'لو كان تيار الحمل <span class="ltr">1 A</span> فقط (حمل صغير)، أي الطريقتين أدق؟',opts:[
  ['الطريقة الأولى',true,'خطؤها \\(R_iI^2=3\\times1^2=3\\ \\text{W}\\) فقط، أما الثانية فتضيف <span class="ltr">24.2 W</span> دائماً. هذا ما يقوله الكتاب: للحمل الصغير الطريقة الأولى.'],
  ['الطريقة الثانية',false,'خطؤها \\(V^2/R_v=24.2\\ \\text{W}\\) لا يقل مع التيار.'],
  ['متساويتان',false,'الخطآن متساويان فقط عند تيار قريب من <span class="ltr">2.84 A</span>.']]},
 ins:[{k:'I',l:'تيار الحمل I',u:'A',min:0.5,max:6,step:0.5,v:3,dp:1}],
 calc:(s,P,B)=>{const Pt=220*s.I*0.8,e1=3*s.I*s.I,e2=220*220/2000;
  return {facts:[['P الحقيقية = <span class="ltr">220 × I × 0.8</span>',DCML.fm(B,Pt,1)+' W'],['قراءة الأولى (+ R<sub>i</sub>I²)',DCML.fm(B,Pt+e1,1)+' W',e1<e2?'hi':''],['قراءة الثانية (+ V²/R<sub>v</sub>)',DCML.fm(B,Pt+e2,1)+' W',e2<e1?'hi':'']],
   bars:[{l:'خطأ الطريقة الأولى',v:e1,max:110,u:'W',dp:1,col:'--live'},{l:'خطأ الطريقة الثانية',v:e2,max:110,u:'W',dp:1,col:'--blue'}],
   msg:(s.I===3?'أرقام الكتاب: <span class="ltr">555 W</span> و<span class="ltr">552.2 W</span>. ':'')+(e1<e2?'الطريقة الأولى أدق هنا (حمل صغير).':e1>e2?'الطريقة الثانية أدق هنا (حمل كبير).':'الخطآن متساويان تقريباً.')}}})}
   ]},

  {st:3,short:'مسائل الفصل الثالث',title:'مسائل الفصل الثالث',ref:'ص 74',
   q:'ثلاث مسائل على القدرة: هل تعرف لكل منها من أين تبدأ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خريطة مسائل الفصل الثالث الثلاث وما تحتاجه كل مسألة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="44" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">مسائل الفصل الثالث</text><g data-tip="المسألة 1: احسب تيار كل فرع، ثم ⟦P = RI²⟧ و⟦Q = XI²⟧ لكل فرع واجمعها."><rect x="40" y="76" width="280" height="54" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="76" width="58" height="54" rx="10" fill="#2C4A40"/><text x="291" y="109" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1</text><text x="150" y="98" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">معاوقتان على التوازي</text><text x="150" y="118" text-anchor="middle" font-size="12" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan>, Q<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan>, S<tspan font-size="10" dy="4">T</tspan><tspan dy="-4">&#8203;</tspan></text><rect x="40" y="76" width="280" height="54" rx="6" fill="transparent"/></g><g data-tip="المسألة 2: دائرة المسألة 3 من الفصل الثاني؛ تيارها واحد في كل العناصر."><rect x="40" y="144" width="280" height="54" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="144" width="58" height="54" rx="10" fill="#2C4A40"/><text x="291" y="177" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">2</text><text x="150" y="166" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">دائرة الشكل 1 (الفصل الثاني)</text><text x="150" y="186" text-anchor="middle" font-size="12" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">P, Q, S, cosθ</text><rect x="40" y="144" width="280" height="54" rx="6" fill="transparent"/></g><g data-tip="المسألة 3: دائرة المثال ⟦(1-2-14)⟧؛ فيها ملفان ⟦3 Ω⟧ و⟦5 Ω⟧."><rect x="40" y="212" width="280" height="54" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="262" y="212" width="58" height="54" rx="10" fill="#2C4A40"/><text x="291" y="245" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">3</text><text x="150" y="234" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">القدرة المفاعلة للملف</text><text x="150" y="254" text-anchor="middle" font-size="12" fill="#1F7A72" font-weight="700" direction="ltr" font-family="var(--mono)">Q = X<tspan font-size="10" dy="4">L</tspan><tspan dy="-4">&#8203;</tspan>I²</text><rect x="40" y="212" width="280" height="54" rx="6" fill="transparent"/></g></svg>`,
   cap:'المسائل الثلاث وما تحتاجه كل منها.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف كيف تبدأ.</b>',
   side:[
    {predict:{q:String.raw`المسألة 1: لحساب \(Q_T\) لفرعين على التوازي…`,opts:[
     [String.raw`نجمع \(Q\) كل فرع بإشارتها`,true,String.raw`\(Q_T=Q_1+Q_2\): المكثف في \(Z_1\) يعطي Q سالبة، والملف في \(Z_2\) يعطي Q موجبة.`],
     [String.raw`نحسب \(\sqrt{Q_1^2+Q_2^2}\)`,false,'الجذر للقدرة الظاهرية الكلية من P و Q، لا لجمع Q.'],
     [String.raw`نجمع مقادير \(Q\) دون إشارات`,false,'الإشارة تحدد الحثي من السعوي، ويلغي بعضها بعضاً.']]}}
   ],
   body:[
    {book:'<ol>'+['في الدائرة المبينة بالشكل التالي، معاوقتان على التوازي، حيث أن \\(Z_1 = 6 - j8\\ \\Omega\\) و\\(Z_2 = 8 + j6\\ \\Omega\\)، وكان الجهد المطبق عليهما <span class="ltr">V = 200 V</span>، احسب كلاً من التيار الكلي، والقدرة الفعالة الكلية، والقدرة المفاعلة الكلية، والقدرة الظاهرية الكلية، ومعامل القدرة.','احسب القدرات الفعالة والمفاعلة والظاهرية التي يوفرها مصدر الدائرة المبينة في الشكل الذي أمامك، ثم احسب معامل القدرة الكلي للدائرة.','احسب القدرة غير الفعالة التي يستهلكها ملف الدائرة المبينة في الشكل المبين أمامك.'].map(q=>'<li>'+q+'</li>').join('')+'</ol>',ref:'ص 74'},
    {tip:String.raw`<p>الكتاب لا يطبع إجابات للمسائل. حاول بنفسك أولاً، ثم افتح الإجابة المقترحة تحت الأشكال. الحل خطوة بخطوة بأرقام قابلة للتغيير في تبويب «الأمثلة المحلولة».</p>`},
    {html:'<div class="cb-figs">'+[[box(figC1(),400),'شكل المسألة 1'],[box(figP1(),620),'شكل المسألة 2'],[box(figP5(),540),'شكل المسألة 3']].map(([f,c])=>'<figure>'+f+'<figcaption>'+c+'</figcaption></figure>').join('')+'</div>'},
    {tip:(()=>[['1','\\(I_1 = \\frac{200}{6-j8} = 20\\angle 53.13^\\circ\\) A، \\(I_2 = \\frac{200}{8+j6} = 20\\angle -36.87^\\circ\\) A، \\(I = I_1 + I_2 = 28 + j4 = 28.28\\angle 8.13^\\circ\\) A. \\(P_T = 6\\times20^2 + 8\\times20^2 = 5600\\) W، \\(Q_T = -8\\times20^2 + 6\\times20^2 = -800\\) VAR، \\(S_T = 5657\\) VA، ومعامل القدرة 0.99 متقدم.'],['2',(()=>{const g=gv(GP3),r=pr3calc(g),I=cabs(r.I);return `من المسألة 3 في الفصل الثاني: \\(Z_T = ${RZ(r.Z,1)}\\ \\Omega\\) و\\(I = ${f1(I,3)}\\) A. \\(P = 50\\,I^2 = ${f1(r.R*I*I,2)}\\) W، \\(Q = (${f1(r.X,1)})\\,I^2 = ${f1(r.X*I*I,1)}\\) VAR، \\(S = VI = ${f1(g.Vm/SQ2*I,1)}\\) VA، ومعامل القدرة \\(${f1(r.R/cabs(r.Z),3)}\\) متقدم: معظم ما يعطيه المصدر قدرة مفاعلة.`})()],['3',(()=>{const r=meshSolve(Cx(2,3),Cx(9,-7),Cx(6,5),Cx(100),Cx(0)),a=cabs(r.Ia),b=cabs(r.Ib);return `من المثال (1-2-14) المصحح: \\(I_T = ${f1(a,2)}\\) A و\\(I_2 = ${f1(b,2)}\\) A. الملف 3 Ω: \\(Q = 3\\times${f1(a,2)}^2 = ${f1(3*a*a,1)}\\) VAR، والملف 5 Ω: \\(Q = 5\\times${f1(b,2)}^2 = ${f1(5*b*b,1)}\\) VAR، ومجموعهما \\(${f1(3*a*a+5*b*b,1)}\\) VAR. (السؤال يقول «ملف» بالمفرد والدائرة فيها ملفان.)`})()]].map(([n,a])=>`<details class="cb-q"><summary>المسألة ${n}</summary><div class="cb-ans">${a}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>في شكل المسألة 2 كُتبت سعة المكثف «5 µC» والمقصود <b>5 µF</b> (صححناها في الرسم). والمسألة 3 تسأل عن «ملف» بالمفرد مع وجود ملفين (<span class="ltr">3 Ω</span> و<span class="ltr">5 Ω</span>) في الدائرة؛ الإجابة المقترحة تعطي كلاً منهما ومجموعهما.</p>`,fix:true},
    {title:'مختبر مصغّر: ما إشارة Q؟',widget:(el,B)=>DCML.sort(el,B,{intro:'عناصر من مسائل الفصل. صنّف القدرة المفاعلة لكل منها.',cats:['Q موجبة','Q سالبة','Q = 0'],items:[
     ['المسألة 1: \\(Z_1=6-j8\\ \\Omega\\)',1,'الجزء التخيلي سالب (سعوي): \\(Q_1=-8\\times20^2=-3200\\ \\text{VAR}\\).'],
     ['المسألة 1: \\(Z_2=8+j6\\ \\Omega\\)',0,'الجزء التخيلي موجب (حثي): \\(Q_2=6\\times20^2=2400\\ \\text{VAR}\\).'],
     ['مقاومة وحدها في أي فرع',2,'المقاومة لا تستعير قدرة: \\(\\theta=0\\) و\\(\\sin0=0\\).'],
     ['المسألة 3: ملف الدائرة',0,'المعادلة <span class="ltr">(1-56)</span>: الملف «يستهلك» القدرة المفاعلة، فهي موجبة.']]})}
   ]},

  {recap:[
   String.raw`الواتميتر فيه ملف تيار CC على التوالي مع الحمل (مقاومته صغيرة)، وملف جهد PC على التوازي (مقاومته كبيرة) (ص 72).`,
   String.raw`الطريقة الأولى تضيف إلى القراءة \(P_i=R_iI^2\) وتناسب الحمل الصغير، والثانية تضيف \(P_v=V^2/R_v\) وتناسب الحمل الكبير (ص 73).`,
   String.raw`القراءة في الطريقتين أكبر من القدرة الحقيقية \(P=VI\cos\theta\) (1-46).`,
   String.raw`في المثال <span class="ltr">(1-3-3)</span>: <span class="ltr">528 W</span> حقيقية، و<span class="ltr">555 W</span> بالطريقة الأولى، و<span class="ltr">552.2 W</span> بالثانية.`]}
],
 theory:[
  {h:'استخدام الواتميتر لقياس القدرة الفعالة',ref:'ص 72',html:`<p>هناك عدة أنواع من الواتميترات، وهي تحتوي على ملفات للتيار وملفات للجهد، وتعتمد قراءتها على زاوية الطور بينهما. ومن بين الأجهزة المستعملة نذكر <b>الواتميتر الكهروديناميكي</b> و<b>الواتميتر الحثي</b>.</p>
   <p>ويحتوي جهاز الواتميتر على ملفين: يغذى الملف الأول بتيار الحمل ويعرف هذا الملف <b>بملف التيار</b> (CC)، أما الملف الآخر والمعروف <b>بملف الجهد</b> (PC) فإنه يغذى بتيار يتناسب مع الجهد بين طرفي الحمل.</p>
   <p>وهناك طريقتان لتوصيل جهاز الواتميتر لقياس القدرة التي يستهلكها حمل معين:</p>
   <p><b>الطريقة الأولى</b> (الشكل 1-57): نوصل ملف التيار (CC) على التوالي مع الحمل، أما ملف الجهد (PC) فإنه يوصل عبر ملف التيار والحمل معاً. وهنا فإن القدرة المقاسة أكبر من القدرة التي يستهلكها الحمل لأننا نقيس كذلك القدرة المفقودة في ملف التيار.</p>
   <p><b>الطريقة الثانية</b> (الشكل 1-58): نوصل ملف الجهد PC عبر أطراف الحمل فقط، وهنا فإن التيار المار في ملف التيار CC يساوي مجموع التيار المار في الحمل والتيار المار في ملف الجهد، وعلى ذلك فإن القدرة المقاسة تساوي مجموع القدرة الحقيقية والقدرة المستهلكة في ملف الجهد.</p>`},
  {fig:'(1-57)',ref:'ص 72',caption:'الطريقة الأولى لتوصيل الواتميتر: ملف الجهد PC متصل قبل ملف التيار CC (من جهة المصدر).',draw:()=>box(wattFig(1),520)},
  {fig:'(1-58)',ref:'ص 72',caption:'الطريقة الثانية لتوصيل الواتميتر: ملف الجهد PC متصل بعد ملف التيار CC (من جهة الحمل).',draw:()=>box(wattFig(2),520)},
  {html:`<p>وتعتمد طريقة توصيل الواتميتر على نوع الحمل المراد قياسه. فعندما يكون الحمل <b>صغيراً</b> يستحسن استعمال <b>الطريقة الأولى</b> لأن في هذه الحالة يكون هبوط الجهد عبر ملف التيار (ذي المقاومة الصغيرة) صغيراً يمكن إهماله. أما إذا كان الحمل <b>كبيراً</b>، فمن الأفضل استعمال <b>الطريقة الثانية</b> لأن قيمة التيار المار في ملف الجهد (ذي المقاومة الكبيرة) صغيرة في هذه الحالة. <span class="ref">ص 73</span></p>
   <p>وتزود كثير من الواتميترات بملفات خاصة لتعويض الخطأ الناتج عن فقد القدرة في أحد ملفي الجهاز.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> خطأ الطريقة الأولى \\(R_i I^2\\) يكبر مع مربع التيار، وخطأ الطريقة الثانية \\(V^2/R_v\\) ثابت تقريباً لأن الجهد ثابت. لذلك مع التيار الصغير (حمل صغير) تكون الأولى أدق، ومع التيار الكبير (حمل كبير) تكون الثانية أدق. الحد الفاصل عندما يتساوى الخطآن: \\(I = V/\\sqrt{R_i R_v}\\). شاهد المنحنى في المختبر.'},
  {h:'مثال (1-3-3)',ref:'ص 73',html:`<p>إذا كانت القيمة الفعالة للجهد بين طرفي حمل <span class="ltr">V = 220 V</span>، وكانت القيمة الفعالة للتيار المار فيه <span class="ltr">I = 3 A</span>، وكان معامل قدرته <span class="ltr">cosθ = 0.8</span>، احسب القدرة التي يقيسها واتميتر حسب الطريقتين، علماً أن مقاومة ملف الجهد للجهاز <span class="ltr">R<sub>v</sub> = 2000 Ω</span>، ومقاومة ملف التيار <span class="ltr">R<sub>i</sub> = 3 Ω</span>.</p>
   <p><b>الحل:</b></p>$$P=VI\\cos\\theta=220\\times3\\times0.8=528\\ \\text{W}$$
   <p>حسب الطريقة الأولى: القدرة المستهلكة في ملف التيار \\(P_i=R_iI^2=3\\times3^2=27\\) W، والقدرة التي يقيسها الجهاز \\(P_T=P+P_i=528+27=555\\) W.</p>
   <p>حسب الطريقة الثانية: القدرة المستهلكة في ملف الجهد \\(P_v=\\frac{V^2}{R_v}=\\frac{220^2}{2000}=24.2\\) W، والقدرة التي يقيسها الجهاز \\(P_T=P+P_v=528+24.2=552.2\\) W.</p>`},
  {h:'مسائل الفصل الثالث',ref:'ص 74',html:'<p>لا يطبع الكتاب إجابات للمسائل. الحل خطوة بخطوة بأرقام قابلة للتغيير في «الأمثلة المحلولة».</p>'},
  PB('1-','في الدائرة المبينة بالشكل التالي، معاوقتان على التوازي، حيث أن \\(Z_1 = 6 - j8\\ \\Omega\\) و\\(Z_2 = 8 + j6\\ \\Omega\\)، وكان الجهد المطبق عليهما <span class="ltr">V = 200 V</span>، احسب كلاً من التيار الكلي، والقدرة الفعالة الكلية، والقدرة المفاعلة الكلية، والقدرة الظاهرية الكلية، ومعامل القدرة.',box(figC1(),400),
   '\\(I_1 = \\frac{200}{6-j8} = 20\\angle 53.13^\\circ\\) A، \\(I_2 = \\frac{200}{8+j6} = 20\\angle -36.87^\\circ\\) A، \\(I = I_1 + I_2 = 28 + j4 = 28.28\\angle 8.13^\\circ\\) A. \\(P_T = 6\\times20^2 + 8\\times20^2 = 5600\\) W، \\(Q_T = -8\\times20^2 + 6\\times20^2 = -800\\) VAR، \\(S_T = 5657\\) VA، ومعامل القدرة 0.99 متقدم.'),
  PB('2-','احسب القدرات الفعالة والمفاعلة والظاهرية التي يوفرها مصدر الدائرة المبينة في الشكل الذي أمامك، ثم احسب معامل القدرة الكلي للدائرة.',box(figP1(),620),
   (()=>{const g=gv(GP3),r=pr3calc(g),I=cabs(r.I);return `من المسألة 3 في الفصل الثاني: \\(Z_T = ${RZ(r.Z,1)}\\ \\Omega\\) و\\(I = ${f1(I,3)}\\) A. \\(P = 50\\,I^2 = ${f1(r.R*I*I,2)}\\) W، \\(Q = (${f1(r.X,1)})\\,I^2 = ${f1(r.X*I*I,1)}\\) VAR، \\(S = VI = ${f1(g.Vm/SQ2*I,1)}\\) VA، ومعامل القدرة \\(${f1(r.R/cabs(r.Z),3)}\\) متقدم: معظم ما يعطيه المصدر قدرة مفاعلة.`})()),
  PB('3-','احسب القدرة غير الفعالة التي يستهلكها ملف الدائرة المبينة في الشكل المبين أمامك.',box(figP5(),540),
   (()=>{const r=meshSolve(Cx(2,3),Cx(9,-7),Cx(6,5),Cx(100),Cx(0)),a=cabs(r.Ia),b=cabs(r.Ib);return `من المثال (1-2-14) المصحح: \\(I_T = ${f1(a,2)}\\) A و\\(I_2 = ${f1(b,2)}\\) A. الملف 3 Ω: \\(Q = 3\\times${f1(a,2)}^2 = ${f1(3*a*a,1)}\\) VAR، والملف 5 Ω: \\(Q = 5\\times${f1(b,2)}^2 = ${f1(5*b*b,1)}\\) VAR، ومجموعهما \\(${f1(3*a*a+5*b*b,1)}\\) VAR. (السؤال يقول «ملف» بالمفرد والدائرة فيها ملفان.)`})()),
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب — المسائل (ص 74):</b> في شكل المسألة 2 كُتبت سعة المكثف «5 µC» والمقصود <b>5 µF</b> (صححناها في الرسم). والمسألة 3 تسأل عن «ملف» بالمفرد مع وجود ملفين (3 Ω و5 Ω) في الدائرة.</span>'}
 ],
 lab:(el)=>{
  const P={m:1,V:220,I:3,pf:0.8,Ri:3,Rv:2000};let needle=0;
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c7"><h2>توصيل الواتميتر <small>مبنية على الشكلين (1-57) و(1-58) والمثال (1-3-3)</small></h2>
    <div class="cb-row">${segHTML('m',[[1,'الطريقة الأولى: PC قبل CC'],[2,'الطريقة الثانية: PC بعد CC']],P.m)}<button class="btn" id="l14ex">أرقام مثال 1-3-3</button></div>
    <div class="svgbox cb-wide" id="l14c"></div>
    <div class="cb-sls">${nsl('l14V','جهد الحمل V',10,500,1,P.V,'V')}${nsl('l14I','تيار الحمل I',0.1,10,0.1,P.I,'A')}${nsl('l14pf','معامل قدرة الحمل cosθ',0,1,0.01,P.pf,'')}${nsl('l14Ri','مقاومة ملف التيار R<sub>i</sub>',0.1,10,0.1,P.Ri,'Ω')}${nsl('l14Rv','مقاومة ملف الجهد R<sub>v</sub>',200,20000,10,P.Rv,'Ω')}</div></div>
   <div class="panel c5"><h2>قراءة الجهاز</h2><div class="svgbox" id="l14d" style="max-width:300px;margin-inline:auto"></div>
    <div class="facts">${fact('القدرة الحقيقية P = VI cosθ','l14P')}${fact('قراءة الطريقة الأولى P + R<sub>i</sub>I²','l14m1')}${fact('قراءة الطريقة الثانية P + V²/R<sub>v</sub>','l14m2')}</div>
    <div class="cb-row"><span id="l14chip" class="cb-chip"></span></div></div>
   <div class="panel c12"><h2>أي طريقة أدق؟ <small>الخطأ (W) مع تيار الحمل عند الجهد الحالي — النقطة = حملك الآن</small></h2><div class="svgbox" id="l14g"></div>${legend([['--live','خطأ الطريقة الأولى R<sub>i</sub>I²'],['--blue','خطأ الطريقة الثانية V²/R<sub>v</sub>']])}</div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l14st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const setters={};[['V','l14V'],['I','l14I'],['pf','l14pf'],['Ri','l14Ri'],['Rv','l14Rv']].forEach(([k,id])=>{setters[k]=nslBind(el,id,v=>{P[k]=v;draw()})});
  segBind(el,'m',v=>{P.m=+v;draw()});
  $('#l14ex').onclick=()=>{Object.assign(P,{V:220,I:3,pf:0.8,Ri:3,Rv:2000});Object.keys(setters).forEach(k=>setters[k](P[k]));draw()};
  let R14={};
  /* عطل مخفي: ملف التيار معكوس، أو ملف الجهد مفتوح، أو مقاومة مدى ملف الجهد زادت (لمؤشر الجهاز فقط). خارج وضع التحدي لا فرق */
  function draw(){const Pt=P.V*P.I*P.pf,e1=P.Ri*P.I*P.I,e2=P.V*P.V/P.Rv,m1=Pt+e1,m2=Pt+e2,rd0=P.m===1?m1:m2,rd=chF('pcopen')?0:chF('ccrev')?-rd0:chF('vcrng')?rd0*0.8:rd0;R14={Pt,m1,m2,rd,e1,e2};
   $('#l14P').textContent=f1(Pt,1)+' W';$('#l14m1').textContent=f1(m1,1)+' W ('+(Pt>0?'+'+f1(e1/Pt*100,2)+'%':'—')+')';$('#l14m2').textContent=f1(m2,1)+' W ('+(Pt>0?'+'+f1(e2/Pt*100,2)+'%':'—')+')';
   const best=e1<e2?1:2,ch=$('#l14chip');ch.className='cb-chip '+(best===P.m?'ok':'hot');ch.textContent=(best===1?'الطريقة الأولى أدق لهذا الحمل (حمل صغير)':'الطريقة الثانية أدق لهذا الحمل (حمل كبير)')+(best===P.m?' — اخترتها':' — جرّب تغيير الطريقة');
   $('#l14c').innerHTML=wattFig(P.m,{cc:1,pc:1}).replace('</svg>',S.t(520,240,'I = '+f1(P.I,1)+' A','','middle')+S.t(538,166,'V = '+f1(P.V,0)+' V','b','start')+'</svg>').replace('viewBox="0 0 620 250"','viewBox="0 0 640 250"');
   const Imax=10,ex=P.V/Math.sqrt(P.Ri*P.Rv),pts1=[],pts2=[];for(let k=0;k<=100;k++){const i=Imax*k/100;pts1.push([i,P.Ri*i*i]);pts2.push([i,e2])}
   const ym=niceMax(Math.max(e2*2,P.Ri*Imax*Imax*0.25,1));
   $('#l14g').innerHTML=plotSVG({w:700,h:240,x0:0,x1:Imax,y0:0,y1:ym,xt:[0,2,4,6,8,10],yt:[0,ym/4,ym/2,3*ym/4,ym],yf:v=>f1(v,1),xl:'I (A)',yl:'error (W)',series:[{pts:pts1,col:'--live'},{pts:pts2,col:'--blue'}],
    extra:(X,Y)=>(ex<Imax?`<path d="M${fx(X(ex))} 16V202" stroke="var(--muted)" stroke-dasharray="4 4"/>`+S.t(fx(X(ex)+4),30,'I = '+f1(ex,2)+' A','m','start'):'')+`<circle cx="${fx(X(P.I))}" cy="${fx(Y(Math.min(ym,P.m===1?e1:e2)))}" r="6" fill="var(--stop)"/>`,aria:'الخطأ مع التيار'});
   steps.check()}
  const dial=()=>{const sc=niceMax(Math.max(R14.m1,R14.m2,1)*1.15),a=PI*(1-clamp(needle/sc,0,1)),cx=150,cy=140,r=110;let s=svgO(300,170,'مؤشر الواتميتر')+`<path d="M${cx-r} ${cy}A${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="var(--line)" stroke-width="10"/>`;
   for(let k=0;k<=5;k++){const b=PI*(1-k/5);s+=`<path d="M${fx(cx+(r-14)*Math.cos(b))} ${fx(cy-(r-14)*Math.sin(b))}L${fx(cx+(r+4)*Math.cos(b))} ${fx(cy-(r+4)*Math.sin(b))}" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(fx(cx+(r-30)*Math.cos(b)),fx(cy-(r-30)*Math.sin(b)+4),f1(sc*k/5,0),'m','middle')}
   s+=`<path d="M${cx} ${cy}L${fx(cx+(r-8)*Math.cos(a))} ${fx(cy-(r-8)*Math.sin(a))}" stroke="var(--stop)" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/>`+S.t(cx,cy+24,f1(needle,1)+' W','b','middle');return s+'</svg>'};
  const steps=stepsUI($('#l14st'),[
   {t:'الطريقة الأولى',x:'بأرقام مثال (1-3-3) والطريقة الأولى: يقرأ الجهاز \\(528 + 27 = 555\\) W، أي يضيف مفقود ملف التيار.',done:()=>P.m===1&&P.V===220&&P.I===3&&P.pf===0.8&&P.Ri===3&&P.Rv===2000},
   {t:'الطريقة الثانية',x:'بدّل إلى الطريقة الثانية: \\(528 + 24.2 = 552.2\\) W، أي يضيف مفقود ملف الجهد.',done:()=>P.m===2&&P.V===220&&P.I===3&&P.Rv===2000},
   {t:'حمل صغير',x:'خفّض تيار الحمل إلى 1 A أو أقل واختر الطريقة الأدق: الأولى (هبوط الجهد على ملف التيار صغير).',done:()=>P.I<=1&&P.m===1},
   {t:'حمل كبير',x:'ارفع تيار الحمل إلى 6 A أو أكثر واختر الطريقة الأدق: الثانية (تيار ملف الجهد صغير مقارنة بتيار الحمل).',done:()=>P.I>=6&&P.m===2},
   {t:'حمل حثي بحت',x:'اجعل معامل القدرة 0: القدرة الحقيقية صفر، لكن الجهاز لا يزال يقرأ مفقود أحد ملفيه.',done:()=>P.pf<=0.005}
  ]);
  draw();
  loopOn(el,dt=>{const tg=R14.rd||0;needle+=(tg-needle)*(1-Math.exp(-dt*4));$('#l14d').innerHTML=dial();steps.check()});
 },
 examples:[
  {title:'مثال (1-3-3)',ref:'ص 73',q:'<p>جهد حمل 220 V وتياره 3 A ومعامل قدرته 0.8. احسب القدرة التي يقيسها واتميتر حسب الطريقتين، علماً أن مقاومة ملف الجهد 2000 Ω ومقاومة ملف التيار 3 Ω.</p>',given:GWM,solve:g=>wmSteps(g)},
  {title:'مسألة 1 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 74',q:'<p>معاوقتان على التوازي \\(Z_1 = 6 - j8\\) و\\(Z_2 = 8 + j6\\ \\Omega\\) على جهد 200 V. احسب التيار الكلي والقدرات الكلية ومعامل القدرة.</p>',given:GC1,solve:g=>cpr1(g)},
  {title:'مسألة 2 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 74',q:'<p>احسب القدرات التي يوفرها مصدر دائرة التوالي (220 sin(377t+53.1°) V؛ 30 Ω، 0.3 H، 5 µF، 0.1 H، 20 Ω) ومعامل القدرة الكلي.</p>',given:GP3,solve:g=>cpr2(g)},
  {title:'مسألة 3 (إجابة مقترحة — ليست من الكتاب)',ref:'ص 74',q:'<p>احسب القدرة غير الفعالة التي يستهلكها ملف (ملفا) الدائرة: مصدر 100∠0° V، 2 Ω + ملف 3 Ω، فرع 9 Ω + مكثف 7 Ω، فرع ملف 5 Ω + 6 Ω.</p>',given:GP7.map(x=>x.id==='X1'?Object.assign({},x,{label:'ملف الخط (3 Ω)'}):x),solve:g=>cpr3(g)}
 ],
 quiz:[
  {q:'ملف التيار في الواتميتر يوصل:',o:['على التوازي مع الحمل','على التوالي مع الحمل','بين المصدر والأرض','لا يوصل'],c:1,e:'ص 72.'},
  {q:'ملف الجهد يغذى بتيار:',o:['يساوي تيار الحمل','يتناسب مع الجهد بين طرفي الحمل','صفر','يساوي تيار المصدر دائماً'],c:1,e:'ص 72.'},
  {q:'في الطريقة الأولى (PC قبل CC) تكون القراءة:',o:['أقل من الحقيقية','الحقيقية + مفقود ملف التيار','الحقيقية + مفقود ملف الجهد','الحقيقية تماماً'],c:1,e:'ص 72 ومثال (1-3-3): 528 + 27 = 555 W.'},
  {q:'في الطريقة الثانية (PC بعد CC) تكون القراءة:',o:['الحقيقية + V²/R<sub>v</sub>','الحقيقية + R<sub>i</sub>I²','الحقيقية − V²/R<sub>v</sub>','صفر'],c:0,e:'مثال (1-3-3): 528 + 24.2 = 552.2 W.'},
  {q:'لقياس قدرة حمل صغير يستحسن:',o:['الطريقة الأولى','الطريقة الثانية','لا فرق','عدم القياس'],c:0,e:'ص 73: هبوط الجهد على ملف التيار صغير يمكن إهماله.'},
  {q:'لقياس قدرة حمل كبير يستحسن:',o:['الطريقة الأولى','الطريقة الثانية','لا فرق','توصيل ملفين للتيار'],c:1,e:'ص 73: تيار ملف الجهد (ذي المقاومة الكبيرة) صغير.'},
  {q:'حمل 220 V و 3 A ومعامل قدرته 0.8. قدرته الحقيقية:',o:['660 W','528 W','555 W','24.2 W'],c:1,e:'\\(220\\times3\\times0.8 = 528\\) W.'}
 ]
});

})(PLCBOOK);
