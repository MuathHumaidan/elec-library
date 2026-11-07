/* circuits-1 — الوحدة الرابعة: تحليل الدوائر الكهربائية (ص 105–122)
   Lessons u4-l1 … u4-l4 (c1_c.md lessons 7–10). */
(function(B){
const {S}=B;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const nf=x=>{if(!isFinite(x))return '—';const r=B.round(x,4);return B.fmtN(Object.is(r,-0)?0:r)};
const pz=x=>x<0?`(${nf(x)})`:nf(x);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- styles (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c1u4-css'))return;const s=document.createElement('style');s.id='c1u4-css';s.textContent=`
.u4-lab .seg{flex-wrap:wrap;max-width:100%}
.u4-lab .seg button{white-space:nowrap}
.u4-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:10px;direction:ltr;font-family:var(--mono);font-size:14px}
.u4-row input{width:86px;font:inherit;font-size:14px;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg);text-align:center;direction:ltr}
.u4-row input.ok{border-color:var(--on);background:var(--on-soft)}
.u4-row input.no{border-color:var(--stop);background:var(--stop-soft)}
.u4-row .k{color:var(--muted);min-width:28px}
.u4-st{font-family:var(--font);font-size:13px;font-weight:700;direction:rtl;padding:2px 10px;border-radius:999px;background:var(--surface-2);color:var(--muted)}
.u4-st.ok{background:var(--on-soft);color:var(--on)}
.u4-st.no{background:var(--stop-soft);color:var(--stop)}
.u4-hint{font-size:13px;color:var(--stop);margin:4px 0 0;line-height:1.7}
.u4-ed{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px}
.u4-ed label{display:flex;flex-direction:column;gap:3px;font-size:12.5px;color:var(--muted);background:var(--surface-2);border-radius:10px;padding:6px 8px;min-width:0}
.u4-ed .u4-in{display:flex;gap:4px;align-items:center;direction:ltr}
.u4-ed input{width:100%;min-width:0;font:600 14px var(--mono);padding:3px 6px;border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--fg);direction:ltr}
.u4-ed em{font-style:normal;font-family:var(--mono);font-size:12px;color:var(--fg)}
.u4-ed .btn{padding:2px 7px;font-size:12px}
.u4-tbl{overflow-x:auto}
.u4-tbl table{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}
.u4-tbl th,.u4-tbl td{border-bottom:1px solid var(--line);padding:5px 6px;text-align:center}
.u4-tbl td.l{font-family:var(--mono);direction:ltr;white-space:nowrap}
.u4-tbl tr.sum td{font-weight:700;background:var(--blue-soft)}
.u4-tbl tr.all td{font-weight:700;background:var(--on-soft)}
.u4-sw{display:flex;gap:18px;flex-wrap:wrap;margin-top:10px}
.u4-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.u4-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.u4-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.u4-bk{margin:10px 0 2px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.u4-try{margin:6px 0 0;padding-inline-start:20px}
.u4-ansrow{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:8px}
.u4-ansrow label{display:flex;gap:6px;align-items:center;direction:ltr;font-family:var(--mono)}
.u4-ansrow input{width:96px;font:600 14px var(--mono);padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.u4-eqbox{margin-top:10px;padding:8px 12px;border:1px dashed var(--line);border-radius:10px;background:var(--surface-2);overflow-x:auto}
`;document.head.appendChild(s)})();

/* ---------- small UI helpers (local copies) ---------- */
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let moved=false;while(steps[i]&&steps[i].done&&steps[i].done()){i++;moved=true}if(moved)draw()},redraw:draw};}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="u4-q"><summary>${n}: ${q}</summary><div class="u4-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.2;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(10,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function zig(x1,y1,x2,y2,n,st){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,seg=len/n;let p=`M${fx(x1)} ${fx(y1)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w" ${st||''} d="${p}L${fx(x2)} ${fx(y2)}"/>`}

/* ---------- safe arithmetic expression parser (numbers, + − × ÷ ( )) ---------- */
function evalExpr(raw){let s=String(raw==null?'':raw).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.').replace(/[−–—]/g,'-').replace(/[×x*]/g,'*').replace(/[÷]/g,'/').replace(/\s+/g,'').replace(/,/g,'.');
  if(!s)return null;let i=0;
  const num=()=>{const m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(!m)throw 0;i+=m[0].length;return parseFloat(m[0])};
  const fac=()=>{if(s[i]==='-'){i++;return -fac()}if(s[i]==='+'){i++;return fac()}if(s[i]==='('){i++;const v=ex();if(s[i]!==')')throw 0;i++;return v}return num()};
  const term=()=>{let v=fac();while(s[i]==='*'||s[i]==='/'){const op=s[i++];const r=fac();v=op==='*'?v*r:v/r}return v};
  const ex=()=>{let v=term();while(s[i]==='+'||s[i]==='-'){const op=s[i++];const r=term();v=op==='+'?v+r:v-r}return v};
  try{const v=ex();return i===s.length&&isFinite(v)?v:NaN}catch(e){return NaN}}

/* ---------- linear algebra ---------- */
function solveLin(A,b){const n=b.length,M=A.map((r,i)=>r.slice().concat([b[i]]));
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(Math.abs(M[p][c])<1e-12)return null;[M[c],M[p]]=[M[p],M[c]];
    for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/M[c][c];if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}
  return M.map((r,i)=>r[n]/r[i])}
/* compare a typed row with the correct one up to a non-zero factor */
function rowCheck(u,c){if(u.some(x=>x==null))return {st:'empty'};if(u.some(x=>isNaN(x)))return {st:'bad'};
  const M0=Math.max(...c.map(Math.abs));if(!(M0>0))return {st:'no',bad:[]};
  let best=null;c.forEach((ci,i)=>{if(Math.abs(ci)<1e-12*M0||Math.abs(u[i])<1e-15)return;const s=u[i]/ci;const M=Math.max(...c.map(x=>Math.abs(s*x)));
    const bad=[];u.forEach((x,j)=>{if(Math.abs(x-s*c[j])>0.01*M+1e-9)bad.push(j)});if(!best||bad.length<best.bad.length)best={s,bad}});
  if(!best)return {st:'no',bad:c.map((x,i)=>i)};return best.bad.length?{st:'no',bad:best.bad,s:best.s}:{st:'ok',s:best.s}}

/* ======================================================================
   Circuit engine: elements on a drawing grid, solved by nodal analysis (MNA)
   element: {id,k:'R'|'E'|'J'|'W',a:[x,y],b:[x,y],v,s(label side),n(name)}
   E: + terminal at b.  J: drives current from a to b through itself.
   ====================================================================== */
const mk=(k)=>(id,a,b,v,s,n)=>({id,k,a,b,v,s:s||1,n:n||id});
const R=mk('R'),E=mk('E'),J=mk('J');let wN=0;const W=(a,b)=>({id:'w'+(wN++),k:'W',a,b});
const key=p=>p[0]+','+p[1];
const defVals=C=>{const v={};C.els.forEach(e=>{if(e.k!=='W')v[e.id]=e.v});return v};
const elOf=(C,id)=>C.els.find(e=>e.id===id);
function solveC(C,V,off){off=off||{};V=V||defVals(C);
  const par={};const f=k=>{while(par[k]!==k){par[k]=par[par[k]];k=par[k]}return k};const add=p=>{const k=key(p);if(par[k]==null)par[k]=k;return k};
  C.els.forEach(e=>{const a=add(e.a),b=add(e.b);if(e.k==='W'){par[f(a)]=f(b)}});
  const g0=f(key(C.gnd));const idx={};let n=0;Object.keys(par).forEach(k=>{const r=f(k);if(r!==g0&&idx[r]==null)idx[r]=n++});
  const vs=[];C.els.forEach(e=>{if(e.k==='E'||(e.k==='R'&&!(V[e.id]>1e-9)))vs.push(e)});
  const N=n+vs.length,A=Array.from({length:N},()=>new Array(N).fill(0)),z=new Array(N).fill(0);
  const I=p=>{const r=f(key(p));return r===g0?-1:idx[r]};
  C.els.forEach(e=>{const a=I(e.a),b=I(e.b);
    if(e.k==='R'&&V[e.id]>1e-9){const g=1/V[e.id];if(a>=0){A[a][a]+=g;if(b>=0)A[a][b]-=g}if(b>=0){A[b][b]+=g;if(a>=0)A[b][a]-=g}}
    else if(e.k==='J'&&!off[e.id]){const j=V[e.id];if(a>=0)z[a]-=j;if(b>=0)z[b]+=j}});
  vs.forEach((e,k)=>{const a=I(e.a),b=I(e.b),r=n+k;if(a>=0){A[a][r]+=1;A[r][a]-=1}if(b>=0){A[b][r]-=1;A[r][b]+=1}z[r]=(e.k==='E'&&!off[e.id])?V[e.id]:0});
  const x=solveLin(A,z);if(!x)return null;
  const volt=p=>{const i=I(p);return i<0?0:x[i]};const cur={};
  C.els.forEach(e=>{if(e.k==='R'&&V[e.id]>1e-9)cur[e.id]=(volt(e.a)-volt(e.b))/V[e.id];else if(e.k==='J')cur[e.id]=off[e.id]?0:V[e.id]});
  vs.forEach((e,k)=>{cur[e.id]=x[n+k]});
  return {volt,cur}}
/* mesh equations (all loops clockwise): rows [coef I1..In | rhs] */
function meshRows(C,V){const L=C.loops,n=L.length,A=L.map(()=>new Array(n).fill(0)),b=new Array(n).fill(0);
  const d=(k,id)=>{const t=L[k].l.find(q=>q[0]===id);return t?t[1]:0};
  L.forEach((lp,k)=>{lp.l.forEach(([id,dk])=>{const e=elOf(C,id),v=V[id];if(e.k==='R'){L.forEach((lp2,j)=>{const dj=d(j,id);if(dj)A[k][j]+=v*dk*dj})}else if(e.k==='E')b[k]+=dk*v})});
  return {A,b}}
/* current of an element (a→b) from loop currents */
const meshCur=(C,I,id)=>C.loops.reduce((s,lp,k)=>{const t=lp.l.find(q=>q[0]===id);return s+(t?t[1]*I[k]:0)},0);
/* node equations: rows [coef V1..Vn | rhs] in the form Σ(currents leaving)=0 */
function nodeBr(C,V){return C.br.map(br=>{let Rs=0,e=0,Jv=null;br.l.forEach(([id,d])=>{const el=elOf(C,id),v=V[id];if(el.k==='R')Rs+=v;else if(el.k==='E')e+=d*v;else if(el.k==='J')Jv=(Jv||0)+d*v});return {a:br.a,b:br.b,R:Rs,e,J:Jv}})}
function nodalRows(C,V){const ks=C.nodes.map(q=>q.k),n=ks.length,A=ks.map(()=>new Array(n).fill(0)),b=new Array(n).fill(0),brs=nodeBr(C,V),fixed={};
  brs.forEach(br=>{if(br.J==null&&br.R<=1e-12){if(br.b==='0'&&br.a!=='0')fixed[br.a]=-br.e;else if(br.a==='0'&&br.b!=='0')fixed[br.b]=br.e}});
  ks.forEach((k,r)=>{if(fixed[k]!=null){A[r][r]=1;b[r]=fixed[k];return}
    brs.forEach(br=>{if(br.a!==k&&br.b!==k)return;const s=br.a===k?1:-1,o=br.a===k?br.b:br.a;
      if(br.J!=null){b[r]-=s*br.J;return}if(br.R<=1e-12)return;const g=1/br.R;A[r][r]+=g;if(o!=='0')A[r][ks.indexOf(o)]-=g;b[r]-=s*br.e*g})});
  return {A,b,fixed,brs}}
/* LaTeX of the KVL / KCL equations written the way the book writes them */
function meshTex(C,V,k){const lp=C.loops[k];let t='';const d=(j,id)=>{const q=C.loops[j].l.find(z=>z[0]===id);return q?q[1]:0};
  lp.l.forEach(([id,dk])=>{const e=elOf(C,id),v=V[id];if(e.k==='E'){if(!v)return;const c=-dk*v;t+=(c<0?' - ':' + ')+nf(Math.abs(c))}
    else if(e.k==='R'){if(!(v>0))return;const oth=C.loops.map((l2,j)=>j!==k&&d(j,id)?[j,dk*d(j,id)]:null).filter(Boolean);
      t+=' + '+nf(v)+(oth.length?`(I_{${k+1}}${oth.map(([j,s])=>(s<0?' - ':' + ')+`I_{${j+1}}`).join('')})`:`I_{${k+1}}`)}});
  t=t.replace(/^ \+ /,'').replace(/^ - /,'-');return (t||'0')+' = 0'}
function nodeTex(C,V,r){const ks=C.nodes.map(q=>q.k),k=ks[r],{fixed,brs}=nodalRows(C,V);const vn=q=>q==='0'?'0':`V_{${q}}`;
  if(fixed[k]!=null)return `V_{${k}} = ${nf(fixed[k])}`;let t='';
  brs.forEach(br=>{if(br.a!==k&&br.b!==k)return;const s=br.a===k?1:-1,o=br.a===k?br.b:br.a;
    if(br.J!=null){const c=s*br.J;if(c)t+=(c<0?' - ':' + ')+nf(Math.abs(c));return}if(br.R<=1e-12)return;const c=s*br.e;
    t+=` + \\frac{V_{${k}}${o!=='0'?' - '+vn(o):(c?'':' - 0')}${c?(c<0?' - ':' + ')+nf(Math.abs(c)):''}}{${nf(br.R)}}`});
  return t.replace(/^ \+ /,'').replace(/^ - /,'-')+' = 0'}
function linTex(row,rhs,sym){let t='';row.forEach((c,j)=>{if(Math.abs(c)<1e-12)return;const a=Math.abs(c);t+=(c<0?' - ':' + ')+(Math.abs(a-1)<1e-12?'':nf(a))+`${sym}_{${j+1}}`});
  return t.replace(/^ \+ /,'').replace(/^ - /,'-')+' = '+nf(rhs)}

/* ---------- drawing ---------- */
function drawC(C,V,o){o=o||{};V=V||defVals(C);const off=o.off||{};let s='';
  const xs=[],ys=[];C.els.forEach(e=>{xs.push(e.a[0],e.b[0]);ys.push(e.a[1],e.b[1])});
  const x0=Math.min(...xs)-(o.padL||70),x1=Math.max(...xs)+(o.padR||70),y0=Math.min(...ys)-(o.padT||(o.names?48:34)),y1=Math.max(...ys)+(o.padB||(C.gnd&&o.gnd?46:30));
  const cnt={};C.els.forEach(e=>{[e.a,e.b].forEach(p=>{cnt[key(p)]=(cnt[key(p)]||0)+1})});
  const hiSt=id=>o.hi===id?'style="stroke:var(--stop);stroke-width:2.8"':'';
  C.els.forEach(e=>{const [ax,ay]=e.a,[bx,by]=e.b,L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,mx=(ax+bx)/2,my=(ay+by)/2,vert=Math.abs(ux)<0.5,sl=e.s||1,v=V[e.id],st=hiSt(e.id);
    const line=(x1,y1,x2,y2,extra)=>`<path class="w" ${extra||st} d="M${fx(x1)} ${fx(y1)}L${fx(x2)} ${fx(y2)}"/>`;
    if(e.k==='W'){s+=line(ax,ay,bx,by,' ');return}
    let lab='',unit=e.k==='R'?'Ω':e.k==='E'?'V':'A';
    if(e.k==='R'){const h=26;s+=line(ax,ay,mx-ux*h,my-uy*h)+zig(mx-ux*h,my-uy*h,mx+ux*h,my+uy*h,6,st)+line(mx+ux*h,my+uy*h,bx,by);
      if(o.pol&&o.pol.includes(e.id)){const px=vert?-sl*14:0,py=vert?0:sl*16;s+=S.t(fx(mx-ux*34+px),fx(my-uy*34+py+4),'+','b')+S.t(fx(mx+ux*34+px),fx(my+uy*34+py+4),'−','b')}}
    else if(e.k==='E'){const dir=v<0?-1:1;
      if(off[e.id]){s+=line(ax,ay,bx,by,'style="stroke:var(--muted);stroke-dasharray:5 4"')+`<rect x="${fx(mx-17)}" y="${fx(my-10)}" width="34" height="20" rx="5" fill="var(--surface)" stroke="var(--muted)"/>`+arT(mx,my+4,'قصر',{fs:11,col:'--muted'})}
      else{const g=5,nx=-uy,ny=ux;s+=line(ax,ay,mx-ux*g,my-uy*g)+line(mx+ux*g,my+uy*g,bx,by);
        const pl=(c,half,w)=>`<path d="M${fx(mx+ux*c+nx*half)} ${fx(my+uy*c+ny*half)}L${fx(mx+ux*c-nx*half)} ${fx(my+uy*c-ny*half)}" stroke="var(--fg)" stroke-width="${w}" stroke-linecap="round"/>`;
        s+=pl(g*dir,15,2.2)+pl(-g*dir,8,4.2);const px=vert?-sl*20:0,py=vert?0:sl*20;s+=S.t(fx(mx+ux*15*dir+px),fx(my+uy*15*dir+py+4),'+','b')}}
    else if(e.k==='J'){const r=15;if(off[e.id]){s+=line(ax,ay,mx-ux*r,my-uy*r)+line(mx+ux*r,my+uy*r,bx,by)+`<circle cx="${fx(mx-ux*r)}" cy="${fx(my-uy*r)}" r="3" fill="var(--fg)"/><circle cx="${fx(mx+ux*r)}" cy="${fx(my+uy*r)}" r="3" fill="var(--fg)"/>`+arT(mx+(vert?0:0),my+4,'مفتوح',{fs:11,col:'--muted'})}
      else{const dir=v<0?-1:1;s+=line(ax,ay,mx-ux*r,my-uy*r)+line(mx+ux*r,my+uy*r,bx,by)+`<circle cx="${fx(mx)}" cy="${fx(my)}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2" ${o.hi===e.id?'style="stroke:var(--stop)"':''}/>`+arrow(mx-ux*9*dir,my-uy*9*dir,mx+ux*9*dir,my+uy*9*dir,'--fg',1.8)}}
    if(!(e.k==='E'&&off[e.id])&&!(e.k==='J'&&off[e.id]))lab=`${nf(Math.abs(v))} ${unit}`;else lab=`(${nf(Math.abs(v))} ${unit})`;
    const nm=o.names?e.n:'';
    if(vert){const tx=mx+sl*(e.k==='J'?24:22),an=sl>0?'start':'end';if(nm)s+=S.t(fx(tx),fx(my-6),nm,'b',an);s+=S.t(fx(tx),fx(my+(nm?10:4)),lab,off[e.id]?'m':'',an)}
    else{const ty=my-sl*(e.k==='J'?24:18)+(sl>0?0:10);if(nm)s+=S.t(fx(mx),fx(ty-(sl>0?13:-13)),nm,'b');s+=S.t(fx(mx),fx(ty),lab,off[e.id]?'m':'')}
  });
  /* current arrows */
  (o.arrows||[]).forEach(q=>{const e=elOf(C,q.id);if(!e)return;const [ax,ay]=e.a,[bx,by]=e.b,L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,mx=(ax+bx)/2,my=(ay+by)/2,vert=Math.abs(ux)<0.5,sl=e.s||1,d=q.d<0?-1:1,h=15;
    const off2=q.far?40:24;const cx=vert?mx-sl*off2:mx,cy=vert?my:my+sl*(off2-2)+(q.far?0:0),col=q.col||'--blue';
    s+=arrow(cx-ux*h*d,cy-uy*h*d,cx+ux*h*d,cy+uy*h*d,col,2.2);
    if(q.lab){if(vert)s+=`<text class="txt b" x="${fx(cx-sl*7)}" y="${fx(cy+4)}" text-anchor="${sl>0?'end':'start'}" ${q.col?`style="fill:var(${q.col})"`:''}>${q.lab}</text>`;else s+=`<text class="txt b" x="${fx(cx)}" y="${fx(cy+sl*16+(sl>0?0:6))}" text-anchor="middle" ${q.col?`style="fill:var(${q.col})"`:''}>${q.lab}</text>`}});
  /* loop arrows */
  if(o.loops&&C.loops)C.loops.forEach((lp,k)=>{const [cx,cy]=lp.c,r=20,a0=-140*Math.PI/180,a1=a0+290*Math.PI/180;const p0=[cx+r*Math.cos(a0),cy+r*Math.sin(a0)],p1=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)];
    s+=`<path d="M${fx(p0[0])} ${fx(p0[1])}A${r} ${r} 0 1 1 ${fx(p1[0])} ${fx(p1[1])}" fill="none" stroke="var(--live)" stroke-width="2"/>`;const tx=-Math.sin(a1),ty=Math.cos(a1);
    s+=`<path d="M${fx(p1[0]+tx*7)} ${fx(p1[1]+ty*7)}L${fx(p1[0]-ty*5)} ${fx(p1[1]+tx*5)}L${fx(p1[0]+ty*5)} ${fx(p1[1]-tx*5)}Z" fill="var(--live)"/>`+`<text class="txt" x="${cx}" y="${cy+4}" text-anchor="middle" style="fill:var(--live)">${o.loopLab?o.loopLab[k]:'I'+(k+1)}</text>`});
  /* dots */
  Object.keys(cnt).forEach(k=>{if(cnt[k]>=3){const [x,y]=k.split(',');s+=`<circle class="dot" cx="${x}" cy="${y}" r="3.6"/>`}});
  (o.dots||[]).forEach(p=>{s+=`<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="3.6"/>`});
  /* ground */
  if(o.gnd&&C.gnd){const [gx,gy]=o.gndAt||C.gnd;s+=`<path class="w" d="M${gx} ${gy}V${gy+14}M${gx-13} ${gy+14}H${gx+13}M${gx-8} ${gy+19}H${gx+8}M${gx-3} ${gy+24}H${gx+3}"/>`+(o.gndLab?S.t(gx+20,gy+24,o.gndLab,'m','start'):'')}
  /* node labels */
  (o.lbl||[]).forEach(([x,y,t,dx,dy,cls])=>{s+=`<text class="txt ${cls||'b'}" x="${x+(dx||0)}" y="${y+(dy||0)}" text-anchor="middle">${t}</text>`});
  if(o.extra)s+=o.extra;
  const vb=o.vb||`${x0} ${y0} ${x1-x0} ${y1-y0}`;
  return `<svg viewBox="${vb}" role="img" aria-label="${o.aria||'دائرة كهربائية'}">${s}</svg>`}
const figBox=(svg,max)=>box(svg,max||560);

/* ======================================================================
   Circuits of the unit (book data)
   ====================================================================== */
const PRE={};
/* الشكل (4-1): B1 = 28 V، R1 = 4، R2 = 2، R3 = 1، B2 = 7 V */
PRE.f41={short:'الشكل (4-1)',name:'دائرة مثال (4-1)',ref:'ص 108',t:'mesh',
 els:[E('B1',[60,220],[60,40],28,-1),R('R1',[60,40],[240,40],4,1),R('R2',[240,40],[240,220],2,1),R('R3',[240,40],[420,40],1,1),E('B2',[420,220],[420,40],7,1),W([60,220],[240,220]),W([240,220],[420,220])],
 gnd:[240,220],loops:[{c:[150,130],l:[['B1',1],['R1',1],['R2',1]]},{c:[340,130],l:[['R3',1],['B2',-1],['R2',-1]]}],
 lbl:[[60,40,'A',-12,-8],[240,40,'B',0,-10],[420,40,'E',12,-8],[60,220,'D',-12,16],[240,220,'C',0,18],[420,220,'F',12,16]],showI:['R1','R2','R3']};
/* الشكل (4-4) */
PRE.f44={short:'الشكل (4-4)',name:'دائرة مثال (4-2) والتمرين 1',ref:'ص 110',t:'mesh',
 els:[E('E1',[60,260],[60,150],60,-1),R('R1',[60,150],[60,40],5,-1),R('R2',[60,40],[300,40],6,1),R('R3',[60,260],[300,260],1,-1),E('E2',[300,150],[300,40],40,1),R('R4',[300,150],[300,260],3,1),R('R5',[300,40],[540,40],3,1),E('E3',[540,150],[540,40],10,1),R('R6',[540,150],[540,260],4,1),R('R7',[300,260],[540,260],2,-1)],
 gnd:[300,260],loops:[{c:[180,150],l:[['E1',1],['R1',1],['R2',1],['E2',-1],['R4',1],['R3',-1]]},{c:[420,150],l:[['R4',-1],['E2',1],['R5',1],['E3',-1],['R6',1],['R7',-1]]}],showI:['R1','R4','R6']};
/* الشكل (4-10): سلّم من ثلاث حلقات */
PRE.f410={short:'الشكل (4-10) — ثلاث حلقات',name:'دائرة مثال (4-6)',ref:'ص 117',t:'mesh',
 els:[E('E1',[40,240],[40,40],10,-1),R('R1',[40,40],[200,40],6,1),R('R2',[200,40],[200,240],1,1),R('R3',[200,40],[360,40],2,1),R('R4',[360,40],[360,240],3,1),W([360,40],[520,40]),R('R5',[520,40],[520,240],10,1),W([40,240],[200,240]),W([200,240],[360,240]),E('E2',[360,240],[520,240],20,-1)],
 gnd:[200,240],loops:[{c:[120,140],l:[['E1',1],['R1',1],['R2',1]]},{c:[285,140],l:[['R2',-1],['R3',1],['R4',1]]},{c:[445,140],l:[['R4',-1],['R5',1],['E2',-1]]}],
 lbl:[[200,40,'1',0,-10],[360,40,'2',0,-10],[520,40,'a',12,-6],[520,240,'b',12,16]],showI:['R1','R2','R4','R5']};
/* الشكل (4-7) */
PRE.f47={short:'الشكل (4-7)',name:'دائرة مثال (4-3)',ref:'ص 112',t:'nodal',
 els:[E('E1',[40,230],[40,40],12,-1),R('R1',[40,40],[200,40],3,1),R('R2',[200,40],[200,230],6,1),R('R3',[200,40],[380,40],10,1),R('R4',[380,40],[380,230],12,1),W([380,40],[520,40]),J('J1',[520,230],[520,40],2,1),W([40,230],[200,230]),W([200,230],[380,230]),W([380,230],[520,230])],
 gnd:[290,230],nodes:[{k:'1',p:[200,40]},{k:'2',p:[380,40]}],
 br:[{a:'1',b:'0',l:[['R1',-1],['E1',-1]]},{a:'1',b:'0',l:[['R2',1]]},{a:'1',b:'2',l:[['R3',1]]},{a:'2',b:'0',l:[['R4',1]]},{a:'2',b:'0',l:[['J1',-1]]}],showI:['R1','R2','R3','R4']};
PRE.f47.els.push(W([200,230],[290,230]));PRE.f47.els.splice(PRE.f47.els.findIndex(e=>e.k==='W'&&e.a[0]===200&&e.b[0]===380&&e.a[1]===230),1,W([290,230],[380,230]));
/* الشكل (4-8) */
const f48els=withR2=>[E('E1',[40,230],[40,40],40,-1),W([40,40],[200,40]),R('R1',[200,40],[200,230],9,1),R('R2',[200,40],[380,40],10,1),J('J1',[380,230],[380,40],20,1)].concat(withR2?[W([380,40],[500,40]),R('R3',[500,40],[500,230],2,1),W([500,40],[620,40]),R('R4',[620,40],[620,230],5,1),W([40,230],[200,230]),W([200,230],[380,230]),W([380,230],[500,230]),W([500,230],[620,230])]:[W([380,40],[520,40]),R('R4',[520,40],[520,230],5,1),W([40,230],[200,230]),W([200,230],[380,230]),W([380,230],[520,230])]);
PRE.f48={short:'الشكل (4-8)',name:'دائرة مثال (4-4)',ref:'ص 113',t:'nodal',els:f48els(1),gnd:[380,230],nodes:[{k:'1',p:[200,40]},{k:'2',p:[380,40]}],
 br:[{a:'1',b:'0',l:[['E1',-1]]},{a:'1',b:'0',l:[['R1',1]]},{a:'1',b:'2',l:[['R2',1]]},{a:'2',b:'0',l:[['J1',-1]]},{a:'2',b:'0',l:[['R3',1]]},{a:'2',b:'0',l:[['R4',1]]}],showI:['R1','R2','R3','R4','E1']};
PRE.ex2={short:'التمرين 2 — الشكل (2)',name:'دائرة التمرين 2',ref:'ص 122',t:'nodal',els:f48els(0),gnd:[380,230],nodes:[{k:'1',p:[200,40]},{k:'2',p:[380,40]}],
 br:[{a:'1',b:'0',l:[['E1',-1]]},{a:'1',b:'0',l:[['R1',1]]},{a:'1',b:'2',l:[['R2',1]]},{a:'2',b:'0',l:[['J1',-1]]},{a:'2',b:'0',l:[['R4',1]]}],showI:['R1','R2','R4','E1']};
PRE.ex3={short:'التمرين 3 — الشكل (3)',name:'دائرة التمرين 3',ref:'ص 122',t:'nodal',
 els:[R('R1',[40,40],[40,135],4,-1),E('E1',[40,230],[40,135],40,-1),W([40,40],[200,40]),R('R2',[200,40],[200,230],5,1),R('R3',[200,40],[380,40],2,1),J('J1',[380,230],[380,40],15,1),W([380,40],[520,40]),R('R4',[520,40],[520,230],4,1),W([40,230],[200,230]),W([200,230],[380,230]),W([380,230],[520,230])],
 gnd:[380,230],nodes:[{k:'1',p:[200,40]},{k:'2',p:[380,40]}],
 br:[{a:'1',b:'0',l:[['R1',1],['E1',-1]]},{a:'1',b:'0',l:[['R2',1]]},{a:'1',b:'2',l:[['R3',1]]},{a:'2',b:'0',l:[['J1',-1]]},{a:'2',b:'0',l:[['R4',1]]}],showI:['R1','R2','R3','R4']};
PRE.ex1=Object.assign({},PRE.f44,{short:'التمرين 1 — الشكل (1)',name:'دائرة التمرين 1 (هي الشكل 4-4)',ref:'ص 122'});
/* الشكل (4-9) */
PRE.f49={short:'الشكل (4-9)',name:'دائرة مثال (4-5)',ref:'ص 115',t:'sup',
 els:[R('R1',[40,40],[40,135],3,-1),E('E1',[40,230],[40,135],18,-1),J('J1',[220,230],[220,40],3,1),R('R2',[400,40],[400,230],6,1),W([40,40],[220,40]),W([220,40],[400,40]),W([40,230],[220,230]),W([220,230],[400,230])],
 gnd:[400,230],tg:[{id:'R2',d:1,lab:'المقاومة <span class="ltr">6 Ω</span> (التيار لأسفل)',sym:'I',v:1}],showI:['R1','R2']};
PRE.f410s=Object.assign({},PRE.f410,{t:'sup',tg:[{id:'R5',d:1,lab:'المقاومة <span class="ltr">10 Ω</span> (التيار I لأسفل من a إلى b)',sym:'I',v:1}],showI:['R5','E1','E2']});
/* الشكل (4-11) */
PRE.f411={short:'الشكل (4-11)',name:'دائرة مثال (4-7)',ref:'ص 118',t:'sup',
 els:[R('R1',[60,40],[300,40],15,1),R('R2',[60,40],[60,160],30,-1),E('E1',[60,160],[60,280],120,-1),R('R3',[60,280],[300,280],15,-1),R('R4',[300,40],[300,160],40,1),E('E2',[300,280],[300,160],240,1),R('R5',[300,40],[540,40],10,1),R('R6',[540,40],[540,160],20,1),E('E3',[540,280],[540,160],60,1),R('R7',[300,280],[540,280],10,-1)],
 gnd:[300,280],lbl:[[300,40,'a',0,-12],[300,280,'b',0,22]],
 tg:[{id:'E1',d:1,lab:'بطارية <span class="ltr">120 V</span> (I<sub>1</sub> لأسفل)',sym:'I_1'},{id:'E2',d:1,lab:'بطارية <span class="ltr">240 V</span> (I<sub>2</sub> لأعلى)',sym:'I_2'},{id:'E3',d:1,lab:'بطارية <span class="ltr">60 V</span> (I<sub>3</sub> لأعلى)',sym:'I_3'}],showI:['E1','E2','E3']};

/* ======================================================================
   Worked-example book/corrected toggle (inside the examples tab)
   ====================================================================== */
const BKM={};
const bkSeg=k=>`<div class="u4-bk"><span class="sub" style="margin:0">طريقة العرض:</span><div class="seg" role="group" data-bkx="${k}"><button data-bkm="book" aria-pressed="${BKM[k]!=='fixed'}">كما في الكتاب</button><button data-bkm="fixed" aria-pressed="${BKM[k]==='fixed'}">المصحح</button></div></div>`;
if(typeof document!=='undefined'&&!window.__c1u4bk){window.__c1u4bk=1;
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-bkm]');if(!b)return;const g=b.closest('[data-bkx]');if(!g)return;BKM[g.dataset.bkx]=b.dataset.bkm;
    g.querySelectorAll('[data-bkm]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const sec=b.closest('.ex');const inp=sec&&sec.querySelector('[data-g]');if(inp)inp.dispatchEvent(new Event('input'))});
  document.addEventListener('input',e=>{const sec=e.target.closest&&e.target.closest('.ex');if(sec&&/^#?u4-/.test(location.hash.replace('#','#')))setTimeout(()=>B.math(sec),0)});}
const bkOn=(k,isBook)=>isBook&&BKM[k]!=='fixed';

/* ======================================================================
   Equation lab (mesh or nodal): the trainee writes the equations
   ====================================================================== */
function eqLab(el,cfg){const p=cfg.p;const st={pk:cfg.presets[0],vals:{},rows:{},ans:{},reveal:{},ok:[],allOk:false,did:{}};
  cfg.presets.forEach(k=>{st.vals[k]=defVals(PRE[k]);st.rows[k]=[];st.ans[k]=[]});
  el.innerHTML=`<div class="grid u4-lab">
   <div class="panel c12"><h2>اختر الدائرة <small>${cfg.based}</small></h2>${segHTML(p+'pk',cfg.presets.map(k=>[k,PRE[k].short]),st.pk)}<p class="sub" id="${p}desc"></p></div>
   <div class="panel c7"><h2 id="${p}h"></h2><div class="svgbox" id="${p}svg" style="max-width:640px;margin-inline:auto"></div><p class="sub" id="${p}leg"></p></div>
   <div class="panel c5"><h2>قيم العناصر <small>غيّر أي قيمة: تتغير الدائرة والمعادلات الصحيحة معها</small></h2><div class="u4-ed" id="${p}ed"></div><div class="im-row" style="margin-top:10px"><button class="btn" id="${p}rst">أعد أرقام الكتاب</button></div></div>
   <div class="panel c12"><h2 id="${p}eqh"></h2><p class="sub" id="${p}help"></p><div id="${p}eqs"></div>
    <div class="im-row" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="${p}show">أظهر المعادلات الصحيحة</button><button class="btn" id="${p}clr">امسح معادلاتي</button></div><div id="${p}corr"></div></div>
   <div class="panel c12"><h2>الحل</h2><div id="${p}sol"></div>${cfg.answers?`<h3 class="sm" style="margin-top:12px">إجابتك النهائية</h3><p class="sub">اكتب الناتج الذي حسبته في دفترك (يُقبل فرق تقريب حتى 1%).</p><div class="u4-ansrow" id="${p}ans"></div>`:''}</div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${p}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const C=()=>PRE[st.pk],V=()=>st.vals[st.pk];
  const isMesh=()=>C().t==='mesh';
  const sym=()=>isMesh()?'I':'V',unitU=()=>isMesh()?'A':'V';
  const n=()=>isMesh()?C().loops.length:C().nodes.length;
  const corr=()=>isMesh()?meshRows(C(),V()):nodalRows(C(),V());
  const editor=()=>{const c=C();$('#'+p+'ed').innerHTML=c.els.filter(e=>e.k!=='W').map(e=>`<label><span>${e.n} — ${e.k==='R'?'مقاومة':e.k==='E'?'بطارية':'مصدر تيار'}</span><span class="u4-in"><input type="number" step="any" ${e.k==='R'?'min="0"':''} data-v="${e.id}" value="${V()[e.id]}"><em>${e.k==='R'?'Ω':e.k==='E'?'V':'A'}</em>${e.k!=='R'?`<button class="btn" data-flip="${e.id}" title="اعكس القطبية">⇅</button>`:''}</span></label>`).join('');
    el.querySelectorAll('[data-v]').forEach(i=>i.addEventListener('input',()=>{let x=parseFloat(i.value);if(!isFinite(x))return;const e=elOf(C(),i.dataset.v);if(e.k==='R')x=Math.max(0,x);V()[i.dataset.v]=x;st.did.edit=1;st.did['edit_'+st.pk+'_'+i.dataset.v]=1;run()}));
    el.querySelectorAll('[data-flip]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.flip;V()[id]=-V()[id];el.querySelector(`[data-v="${id}"]`).value=V()[id];st.did.flip=1;st.did['flip_'+st.pk+'_'+id]=1;run()}))};
  const eqRows=()=>{const N=n(),rs=st.rows[st.pk];let h='';
    for(let r=0;r<N;r++){rs[r]=rs[r]||[];h+=`<div class="u4-row"><span class="k">(${r+1})</span>`;
      for(let j=0;j<N;j++)h+=`<input type="text" autocomplete="off" spellcheck="false" data-r="${r}" data-c="${j}" value="${rs[r][j]||''}" aria-label="معامل ${sym()}${j+1} في المعادلة ${r+1}"> <span>${sym()}<sub>${j+1}</sub></span>${j<N-1?' <span>+</span> ':''}`;
      h+=` <span>=</span> <input type="text" autocomplete="off" spellcheck="false" data-r="${r}" data-c="${N}" value="${rs[r][N]||''}" aria-label="الطرف الأيمن للمعادلة ${r+1}"> <span class="u4-st" id="${p}s${r}"></span></div><div class="u4-hint" id="${p}hn${r}"></div>`}
    $('#'+p+'eqs').innerHTML=h;
    el.querySelectorAll('[data-r]').forEach(i=>i.addEventListener('input',()=>{st.rows[st.pk][+i.dataset.r][+i.dataset.c]=i.value;run()}))};
  const ansRow=()=>{if(!cfg.answers)return;const N=n(),a=st.ans[st.pk];$('#'+p+'ans').innerHTML=Array.from({length:N},(_,j)=>`<label>${sym()}<sub>${j+1}</sub> = <input type="text" data-a="${j}" value="${a[j]||''}"> ${unitU()}</label><span class="u4-st" id="${p}a${j}"></span>`).join('');
    el.querySelectorAll('[data-a]').forEach(i=>i.addEventListener('input',()=>{st.ans[st.pk][+i.dataset.a]=i.value;run()}))};
  const hint=(r,j,N,fixedNode)=>{const s=sym();if(fixedNode)return 'هذه العقدة موصلة بعقدة الإسناد عن طريق بطارية فقط، فجهدها معروف: المعادلة V = جهد البطارية (معامل هذه العقدة 1 وباقي المعاملات 0).';
    if(isMesh()){if(j===r)return `معامل ${s}${r+1}: مجموع كل المقاومات التي يمر بها تيار الحلقة ${r+1} (موجب).`;if(j<N)return `معامل ${s}${j+1}: المقاومة المشتركة بين الحلقتين ${r+1} و ${j+1} بإشارة سالبة (التياران مع عقارب الساعة متعاكسان فيها)، وصفر إذا لم تكن بينهما مقاومة مشتركة.`;return 'الطرف الأيمن: مجموع جهود البطاريات في الحلقة: موجب إذا مرّ بها تيار الحلقة من القطب السالب إلى الموجب، وسالب إذا مرّ من الموجب إلى السالب.'}
    if(j===r)return `معامل ${s}${r+1}: مجموع 1/R لكل فرع فيه مقاومة متصل بالعقدة ${r+1} (فرع مصدر التيار لا يدخل).`;if(j<N)return `معامل ${s}${j+1}: سالب 1/R للفرع الواصل بين العقدتين ${r+1} و ${j+1}، وصفر إذا لم يكن بينهما فرع.`;
    return 'الطرف الأيمن: لكل فرع فيه بطارية E/R (موجب إذا كان قطبها الموجب نحو العقدة)، ولمصدر التيار + تياره إذا كان داخلاً إلى العقدة و − إذا كان خارجاً منها.'};
  const draw=(sol)=>{const c=C(),o={names:true,loops:isMesh(),gnd:!isMesh(),lbl:(c.lbl||[]).slice()};
    if(!isMesh())c.nodes.forEach((q,j)=>o.lbl.push([q.p[0],q.p[1],sol?`V${q.k} = ${nf(sol.volt(q.p))} V`:`V${q.k}`,0,-12]));
    if(sol)o.arrows=(c.showI||[]).map(id=>{const i=sol.cur[id];return Math.abs(i)<1e-9?null:{id,d:i>0?1:-1,lab:nf(Math.abs(i))+' A',col:'--on'}}).filter(Boolean);
    $('#'+p+'svg').innerHTML=drawC(c,V(),o)};
  const run=()=>{const c=C(),N=n(),cr=corr(),rs=st.rows[st.pk];st.ok=[];const user=[];
    for(let r=0;r<N;r++){const u=Array.from({length:N+1},(_,j)=>evalExpr((rs[r]||[])[j]));user.push(u);const ck=rowCheck(u,cr.A[r].concat([cr.b[r]]));st.ok[r]=ck.st==='ok';
      const sp=$('#'+p+'s'+r);sp.className='u4-st'+(ck.st==='ok'?' ok':ck.st==='empty'?'':' no');sp.textContent=ck.st==='ok'?'✓ صحيحة':ck.st==='empty'?'أكمل الخانات':ck.st==='bad'?'رقم غير مفهوم':'✗ تحتاج مراجعة';
      el.querySelectorAll(`[data-r="${r}"]`).forEach(i=>{const j=+i.dataset.c;i.classList.toggle('ok',ck.st==='ok');i.classList.toggle('no',ck.st==='no'&&ck.bad&&ck.bad.includes(j))});
      const fixedNode=!isMesh()&&cr.fixed&&cr.fixed[c.nodes[r].k]!=null;
      $('#'+p+'hn'+r).innerHTML=ck.st==='no'&&ck.bad&&ck.bad.length?[...new Set(ck.bad.map(j=>hint(r,j,N,fixedNode)))].map(x=>'• '+x).join('<br>'):''}
    st.allOk=st.ok.length===N&&st.ok.every(Boolean);
    const sol=solveC(c,V());
    $('#'+p+'corr').innerHTML=st.reveal[st.pk]?`<div class="u4-eqbox"><b style="font-family:var(--font)">المعادلات الصحيحة ${isMesh()?'(قانون كيرشوف للجهد، التيارات الحلقية مع عقارب الساعة)':'(قانون كيرشوف للتيار: مجموع التيارات الخارجة من العقدة = 0)'}:</b>${Array.from({length:N},(_,r)=>`<div style="margin-top:6px">(${r+1}) ${B.tex(isMesh()?meshTex(c,V(),r):nodeTex(c,V(),r))} &nbsp;⟸&nbsp; ${B.tex(linTex(cr.A[r],cr.b[r],sym()))}</div>`).join('')}</div>`:'';
    $('#'+p+'show').textContent=st.reveal[st.pk]?'أخفِ المعادلات الصحيحة':'أظهر المعادلات الصحيحة';
    // trainee solution
    let h='';const filled=user.every(u=>u.every(x=>x!=null&&!isNaN(x)));const exact=solveLin(cr.A,cr.b);
    if(filled){const us=solveLin(user.map(u=>u.slice(0,N)),user.map(u=>u[N]));
      h+=us?`<div class="callout ${st.allOk?'':'err'}"><b>حل معادلاتك:</b> ${us.map((x,j)=>lt(`${sym()}<sub>${j+1}</sub> = ${nf(x)} ${unitU()}`)).join('، ')}${st.allOk?' — معادلاتك صحيحة، وهذا هو حل الدائرة.':exact?` — يختلف عن حل الدائرة، راجع المعادلات المعلَّمة.`:''}</div>`:'<div class="callout err">معادلاتك ليس لها حل وحيد (معادلتان متناسبتان أو معاملات صفرية). راجعها.</div>'}
    else h+='<p class="sub">اكتب المعاملات في كل الخانات ليحل المختبر معادلاتك فوراً. يمكنك كتابة كسور وعمليات مثل <span class="ltr">1/3+1/6+1/10</span> أو <span class="ltr">-2</span>.</p>';
    const show=st.allOk||st.reveal[st.pk];
    if(!exact)h+='<div class="callout err">بهذه القيم ليس للدائرة حل وحيد (مثلاً مقاومات صفرية في كل الحلقة). غيّر القيم.</div>';
    else if(show&&sol){h+=`<div class="facts">${exact.map((x,j)=>`<div class="fact"><span>${isMesh()?'التيار الحلقي':'جهد العقدة'} ${sym()}<sub>${j+1}</sub></span><b>${nf(x)} ${unitU()}</b></div>`).join('')}</div>`;
      const els=c.els.filter(e=>e.k==='R'||(e.k==='E'));
      h+=`<div class="u4-tbl"><table><thead><tr><th>العنصر</th><th>القيمة</th><th>التيار</th><th>الاتجاه في الرسم</th>${'<th>الجهد عليه</th>'}</tr></thead><tbody>${els.map(e=>{const i=sol.cur[e.id],vv=e.k==='R'?Math.abs(i*V()[e.id]):Math.abs(V()[e.id]);const [ax,ay]=e.a,[bx,by]=e.b,dx=(bx-ax)*(i>=0?1:-1),dy=(by-ay)*(i>=0?1:-1);
        const dirTxt=Math.abs(i)<1e-9?'—':Math.abs(dx)>Math.abs(dy)?(dx>0?'لليمين →':'لليسار ←'):(dy>0?'لأسفل ↓':'لأعلى ↑');return `<tr><td class="l">${e.n}</td><td class="l">${nf(V()[e.id])} ${e.k==='R'?'Ω':'V'}</td><td class="l">${nf(Math.abs(i))} A</td><td>${dirTxt}</td><td class="l">${nf(vv)} V</td></tr>`}).join('')}</tbody></table></div>`;
      h+=`<p class="sub">الأسهم الخضراء على الدائرة: الاتجاه الحقيقي للتيار في الفروع. ${isMesh()?'تيار الفرع المشترك = الفرق بين التيارين الحلقيين.':'تيار كل فرع من قانون أوم: (فرق الجهد ± جهد البطارية) ÷ R.'}</p>`}
    else h+='<p class="sub">عندما تصبح معادلاتك كلها صحيحة (أو تضغط «أظهر المعادلات الصحيحة») تظهر تيارات الفروع على الدائرة.</p>';
    $('#'+p+'sol').innerHTML=h;draw(show&&exact?sol:null);
    if(cfg.answers&&exact){const a=st.ans[st.pk];st.ansOk=[];for(let j=0;j<N;j++){const x=evalExpr(a[j]),sp=$('#'+p+'a'+j);if(!sp)continue;const ok=x!=null&&!isNaN(x)&&Math.abs(x-exact[j])<=0.01*Math.abs(exact[j])+0.005;st.ansOk[j]=ok;
      sp.className='u4-st'+(x==null?'':ok?' ok':' no');sp.textContent=x==null?'':ok?'✓ صحيح':'✗ ليس هذا'}}
    steps.check()};
  const loadPreset=()=>{const c=C();$('#'+p+'h').innerHTML=`${c.name} <small>${c.short} ${c.ref}</small>`;
    $('#'+p+'desc').innerHTML=c.t==='mesh'?`${c.loops.length} حلقات: خذ كل التيارات الحلقية <b>مع عقارب الساعة</b> كما في الكتاب (الأسهم الحمراء). معادلة الحلقة k تكتب بالصورة: معامل I<sub>1</sub> … = الطرف الأيمن.`:'العقدة المرجعية (الإسناد) هي الخط السفلي برمز الأرضي، وجهدها صفر. اكتب لكل عقدة معادلة قانون كيرشوف للتيار مرتبة بالصورة: معامل V<sub>1</sub> + معامل V<sub>2</sub> = الطرف الأيمن.';
    $('#'+p+'eqh').innerHTML=isMesh()?'معادلات الحلقات — اكتبها أنت <small>قانون كيرشوف للجهد لكل مسار مغلق</small>':'معادلات العقد — اكتبها أنت <small>قانون كيرشوف للتيار عند كل عقدة ما عدا الإسناد</small>';
    $('#'+p+'help').innerHTML=isMesh()?'مثال على الصورة المطلوبة: معادلة الكتاب (a) في مثال (4-1) «14 = 3I<sub>1</sub> − I<sub>2</sub>» تكتب: <span class="ltr">3</span> ، <span class="ltr">-1</span> ، <span class="ltr">14</span>. يقبل المختبر أي مضاعف للمعادلة الصحيحة (مثلاً بعد القسمة على 2 كما فعل الكتاب).':'مثال على الصورة المطلوبة: معادلة العقدة \\(\\frac{V_1-12}{3}+\\frac{V_1}{6}+\\frac{V_1-V_2}{10}=0\\) ترتب إلى \\((\\frac13+\\frac16+\\frac1{10})V_1-\\frac1{10}V_2=\\frac{12}{3}\\)، فتكتب: <span class="ltr">1/3+1/6+1/10</span> ، <span class="ltr">-1/10</span> ، <span class="ltr">12/3</span>. يقبل المختبر أي مضاعف (مثلاً بعد الضرب في 30).';
    $('#'+p+'leg').innerHTML=isMesh()?'الأسهم الحمراء الدائرية: التيارات الحلقية المفترضة. الأسماء الزرقاء (R1، E1…) لربط الرسم بجدول القيم فقط.':'الأسماء الزرقاء (R1، E1، J1…) لربط الرسم بجدول القيم فقط. السهم داخل الدائرة: اتجاه مصدر التيار.';
    editor();eqRows();ansRow();B.math(el);run()};
  segBind(el,p+'pk',v=>{st.pk=v;st.did['seen_'+v]=1;loadPreset()});
  $('#'+p+'rst').onclick=()=>{st.vals[st.pk]=defVals(C());editor();run()};
  $('#'+p+'show').onclick=()=>{st.reveal[st.pk]=!st.reveal[st.pk];st.did['rev_'+st.pk]=1;run()};
  $('#'+p+'clr').onclick=()=>{st.rows[st.pk]=[];eqRows();run()};
  const steps=stepsUI($('#'+p+'st'),cfg.steps(st));
  loadPreset();return st}

/* ======================================================================
   Superposition lab
   ====================================================================== */
function supLab(el,cfg){const p=cfg.p;const st={pk:cfg.presets[0],vals:{},on:{},tg:{},did:{}};
  cfg.presets.forEach(k=>{st.vals[k]=defVals(PRE[k]);st.on[k]={};PRE[k].els.forEach(e=>{if(e.k==='E'||e.k==='J')st.on[k][e.id]=true});st.tg[k]=0});
  el.innerHTML=`<div class="grid u4-lab">
   <div class="panel c12"><h2>اختر الدائرة <small>${cfg.based}</small></h2>${segHTML(p+'pk',cfg.presets.map(k=>[k,PRE[k].short]),st.pk)}</div>
   <div class="panel c7"><h2 id="${p}h"></h2><div class="svgbox" id="${p}svg" style="max-width:640px;margin-inline:auto"></div><p class="sub">المصدر الخارج من الخدمة: البطارية تُستبدل بقصر (سلك)، ومصدر التيار بدائرة مفتوحة (ص 114). الأسهم الخضراء: التيار الحقيقي في الحالة المعروضة.</p></div>
   <div class="panel c5"><h2>المصادر</h2><div class="u4-sw" id="${p}sw"></div>
    <h3 class="sm" style="margin-top:14px">العنصر الذي نحسب تياره</h3><div id="${p}tg"></div>
    <div class="facts" id="${p}f"></div><div id="${p}msg"></div></div>
   <div class="panel c12"><h2>جدول التركيب <small>كل مصدر وحده ثم الجمع الجبري</small></h2><div id="${p}tbl"></div></div>
   <div class="panel c12"><details><summary style="cursor:pointer;font-weight:700">قيم العناصر (اضغط لتغييرها)</summary><div class="u4-ed" id="${p}ed"></div><div style="margin-top:10px"><button class="btn" id="${p}rst">أعد أرقام الكتاب</button></div></details></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${p}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);const C=()=>PRE[st.pk],V=()=>st.vals[st.pk],ON=()=>st.on[st.pk];
  const srcs=()=>C().els.filter(e=>e.k==='E'||e.k==='J');
  const offMap=onm=>{const o={};srcs().forEach(e=>{if(!onm[e.id])o[e.id]=true});return o};
  const unit=e=>e.k==='E'?'V':'A';
  const tgVal=(sol,t,c)=>{const e=elOf(c,t.id);const i=t.d*sol.cur[e.id];const vv=e.k==='R'?t.d*(sol.volt(e.a)-sol.volt(e.b)):null;return {i,v:vv}};
  const ui=()=>{const c=C();$('#'+p+'h').innerHTML=`${c.name} <small>${c.short} ${c.ref}</small>`;
    $('#'+p+'sw').innerHTML=srcs().map(e=>swHTML(p+'sw_'+e.id,lt(`${nf(Math.abs(V()[e.id]))} ${unit(e)}`),ON()[e.id]?'في الخدمة':(e.k==='E'?'خارج الخدمة: قصر':'خارج الخدمة: مفتوح'),ON()[e.id])).join('');
    srcs().forEach(e=>{$('#'+p+'sw_'+e.id).onclick=()=>{ON()[e.id]=!ON()[e.id];ui();run()}});
    $('#'+p+'tg').innerHTML=c.tg.length>1?segHTML(p+'tgs',c.tg.map((t,j)=>[j,t.lab]),st.tg[st.pk]):`<p class="sub" style="margin:0">${c.tg[0].lab}</p>`;
    if(c.tg.length>1)segBind(el,p+'tgs',v=>{st.tg[st.pk]=+v;run()});
    $('#'+p+'ed').innerHTML=c.els.filter(e=>e.k!=='W').map(e=>`<label><span>${e.n} — ${e.k==='R'?'مقاومة':e.k==='E'?'بطارية':'مصدر تيار'}</span><span class="u4-in"><input type="number" step="any" ${e.k==='R'?'min="0"':''} data-v="${e.id}" value="${V()[e.id]}"><em>${e.k==='R'?'Ω':unit(e)}</em></span></label>`).join('');
    el.querySelectorAll('[data-v]').forEach(i=>i.addEventListener('input',()=>{let x=parseFloat(i.value);if(!isFinite(x))return;if(elOf(C(),i.dataset.v).k==='R')x=Math.max(0,x);V()[i.dataset.v]=x;$('#'+p+'sw_'+i.dataset.v)&&($('#'+p+'sw_'+i.dataset.v).querySelector('b').innerHTML=lt(`${nf(Math.abs(x))} ${unit(elOf(C(),i.dataset.v))}`));run()}))};
  const run=()=>{const c=C(),t=c.tg[st.tg[st.pk]]||c.tg[0],te=elOf(c,t.id);const on=ON(),ss=srcs();
    const sol=solveC(c,V(),offMap(on));
    const onIds=ss.filter(e=>on[e.id]).map(e=>e.id);st.cur=onIds.slice().sort().join(',');st.did[st.pk+':'+st.cur]=1;
    const ar=sol?(c.showI||[]).map(id=>{const i=sol.cur[id];return Math.abs(i)<1e-9?null:{id,d:i>0?1:-1,lab:nf(Math.abs(i))+' A',col:'--on'}}).filter(Boolean):[];
    $('#'+p+'svg').innerHTML=drawC(c,V(),{names:true,off:offMap(on),arrows:ar,hi:t.id,lbl:c.lbl});
    const tv=sol?tgVal(sol,t,c):null;
    $('#'+p+'f').innerHTML=`<div class="fact"><span>التيار ${t.sym==='I'?'I':t.sym.replace('_','')} (بإشارة اتجاه المرجع)</span><b>${tv?nf(tv.i)+' A':'—'}</b></div>`+(te.k==='R'?`<div class="fact"><span>الجهد على العنصر</span><b>${tv?nf(tv.v)+' V':'—'}</b></div>`:'');
    $('#'+p+'msg').innerHTML=!onIds.length?'<div class="callout">كل المصادر خارج الخدمة: لا تيار في أي فرع.</div>':onIds.length===ss.length?'<div class="callout">كل المصادر في الخدمة: هذه هي الدائرة الأصلية.</div>':`<div class="callout">المصدر الفعّال الآن: ${ss.filter(e=>on[e.id]).map(e=>lt(nf(Math.abs(V()[e.id]))+' '+unit(e))).join(' و ')} فقط.</div>`;
    // table
    let rows='',si=0,sv=0;ss.forEach((e,j)=>{const o={};ss.forEach(q=>{if(q.id!==e.id)o[q.id]=true});const s1=solveC(c,V(),o);const r=s1?tgVal(s1,t,c):{i:NaN,v:NaN};si+=r.i;if(r.v!=null)sv+=r.v;
      rows+=`<tr${onIds.length===1&&onIds[0]===e.id?' style="outline:2px solid var(--blue)"':''}><td>${lt(nf(Math.abs(V()[e.id]))+' '+unit(e))} وحده</td><td class="l">${nf(r.i)} A</td>${te.k==='R'?`<td class="l">${nf(r.v)} V</td>`:''}</tr>`});
    const all=solveC(c,V(),{}),ra=all?tgVal(all,t,c):null;
    rows+=`<tr class="sum"><td>المجموع الجبري</td><td class="l">${nf(si)} A</td>${te.k==='R'?`<td class="l">${nf(sv)} V</td>`:''}</tr><tr class="all"><td>كل المصادر معاً (حل مباشر)</td><td class="l">${ra?nf(ra.i):'—'} A ${ra&&Math.abs(ra.i-si)<1e-6*Math.max(1,Math.abs(si))?'✓':''}</td>${te.k==='R'?`<td class="l">${ra?nf(ra.v):'—'} V</td>`:''}</tr>`;
    let pw='';if(te.k==='R'&&ra){const Rv=V()[te.id];let ps=0;ss.forEach(e=>{const o={};ss.forEach(q=>{if(q.id!==e.id)o[q.id]=true});const s1=solveC(c,V(),o);if(s1){const r=tgVal(s1,t,c);ps+=r.i*r.i*Rv}});
      pw=`<p class="sub"><b>توضيح للمتدرب — ليس من الكتاب:</b> التيار والجهد يُجمعان، أما القدرة فلا: مجموع قدرات الحالات المنفصلة \\(\\sum I^2R\\) = ${lt(nf(ps)+' W')} بينما القدرة الحقيقية \\(I^2R\\) = ${lt(nf(ra.i*ra.i*Rv)+' W')}. احسب القدرة من التيار الكلي بعد الجمع.</p>`}
    $('#'+p+'tbl').innerHTML=`<div class="u4-tbl"><table><thead><tr><th>الحالة</th><th>التيار في العنصر (الموجب في اتجاه المرجع)</th>${te.k==='R'?'<th>الجهد</th>':''}</tr></thead><tbody>${rows}</tbody></table></div>${cfg.tblNote?cfg.tblNote(st):''}${pw}`;B.math($('#'+p+'tbl'));
    steps.check()};
  segBind(el,p+'pk',v=>{st.pk=v;ui();run()});
  $('#'+p+'rst').onclick=()=>{st.vals[st.pk]=defVals(C());ui();run()};
  const steps=stepsUI($('#'+p+'st'),cfg.steps(st));
  ui();run();return st}

/* expose for testing */
B._c1u4={PRE,solveC,meshRows,nodalRows,solveLin,evalExpr,rowCheck,meshCur,BKM};

/* ======================================================================
   Static figures
   ====================================================================== */
const FIG={
 f41:()=>figBox(drawC(PRE.f41,null,{names:true,aria:'الشكل 4-1'}),520),
 f42:()=>figBox(drawC(PRE.f41,null,{loops:true,pol:['R1','R2','R3'],lbl:PRE.f41.lbl,aria:'الشكل 4-2'}),520),
 f43:()=>figBox(drawC(PRE.f41,null,{pol:['R1','R2','R3'],lbl:PRE.f41.lbl,arrows:[{id:'R1',d:1,lab:'I1 = 5 A'},{id:'R2',d:1,lab:'I1 − I2 = 4 A'},{id:'R3',d:1,lab:'I2 = 1 A'}],aria:'الشكل 4-3'}),520),
 f44:()=>figBox(drawC(PRE.f44,null,{loops:true,aria:'الشكل 4-4'}),600),
 f45:()=>{let s=`<svg viewBox="0 0 360 170" role="img" aria-label="الشكل 4-5"><path class="w" d="M30 60H330M180 60V150"/><circle cx="180" cy="60" r="6" fill="var(--stop)"/>`+S.t(180,44,'N','')+arrow(160,72,96,72,'--blue')+S.t(110,92,'Ia','b')+arrow(200,72,264,72,'--blue')+S.t(250,92,'Ic','b')+arrow(194,86,194,134,'--blue')+S.t(206,116,'Ib','b','start')+'</svg>';return box(s,360)},
 f46:()=>{const C={els:[R('a1',[90,40],[90,190],10,1),R('b1',[290,40],[290,115],5,1),E('b2',[290,115],[290,190],100,1),R('c1',[490,40],[490,115],5,1),E('c2',[490,190],[490,115],100,1)]};
   const ex=[[90,40,'N1'],[90,190,'N3'],[290,40,'N1'],[290,190,'N2'],[490,40,'N1'],[490,190,'N2']].map(([x,y,t])=>`<circle cx="${x}" cy="${y}" r="5" fill="var(--stop)"/>`+S.t(x-14,y+(y<100?-4:14),t,'','end')).join('')+
    S.t(90,230,'I = (V1 − V3)/10','b')+S.t(290,230,'I = (V1 − V2 + 100)/5','b')+S.t(490,230,'I = (V1 − V2 − 100)/5','b')+arT(90,252,'أ. مقاومة بين عقدتين',{fs:12})+arT(290,252,'ب. مقاومة وبطارية (الموجب نحو N2)',{fs:12})+arT(490,252,'ج. مقاومة وبطارية (الموجب نحو N1)',{fs:12});
   return box(drawC(C,null,{arrows:[{id:'a1',d:1,lab:'I'},{id:'b1',d:1,lab:'I'},{id:'c1',d:1,lab:'I'}],extra:ex,vb:'0 10 600 255',aria:'الشكل 4-6'}),600)},
 f47:()=>figBox(drawC(PRE.f47,null,{gnd:true,gndLab:'0',lbl:[[200,40,'V1 ①',0,-12],[380,40,'V2 ②',0,-12]],arrows:[{id:'R1',d:1,lab:'I1'},{id:'R2',d:-1,lab:'I2'},{id:'R3',d:1,lab:'I3'}],aria:'الشكل 4-7'}),600),
 f48:()=>figBox(drawC(PRE.f48,null,{gnd:true,lbl:[[200,40,'V1',0,-12],[380,40,'V2',0,-12]],aria:'الشكل 4-8'}),640),
 ex2:()=>figBox(drawC(PRE.ex2,null,{gnd:true,lbl:[[200,40,'V1',0,-12],[380,40,'V2',0,-12]],aria:'شكل التمرين 2'}),600),
 ex3:()=>figBox(drawC(PRE.ex3,null,{gnd:true,lbl:[[200,40,'V1',0,-12],[380,40,'V2',0,-12]],aria:'شكل التمرين 3'}),600),
 f49:(off,ar)=>figBox(drawC(PRE.f49,null,{off:off||{},pol:['R2'],arrows:ar||[],aria:'الشكل 4-9'}),460),
 f410:(off,ar,loops)=>figBox(drawC(PRE.f410,null,{off:off||{},loops:!!loops,lbl:PRE.f410.lbl,arrows:ar||[],aria:'الشكل 4-10'}),600),
 f411:(off,ar)=>figBox(drawC(PRE.f411,null,{off:off||{},lbl:PRE.f411.lbl,arrows:ar||[],aria:'الشكل 4-11'}),600)
};

/* ======================================================================
   Worked examples (calculators)
   ====================================================================== */
const G41=[{id:'B1',label:'البطارية B1',sym:'B_1',unit:'V',value:28},{id:'R1',label:'R1',sym:'R_1',unit:'Ω',value:4},{id:'R2',label:'R2 (المشتركة)',sym:'R_2',unit:'Ω',value:2},{id:'R3',label:'R3',sym:'R_3',unit:'Ω',value:1},{id:'B2',label:'البطارية B2',sym:'B_2',unit:'V',value:7}];
function solve41(g,B,isBook){const bk=bkOn('e41',isBook),R11=g.R1+g.R2,R22=g.R2+g.R3,out=[];
  out.push({t:'نفترض تيارين حلقيين I<sub>1</sub> و I<sub>2</sub> مع عقارب الساعة (الشكل 4-2). <b>الحلقة الأولى A,B,C,D,A</b> — نسير في اتجاه I<sub>1</sub> ومجموع الجهود صفر:'});
  if(bk){out.push({f:`-${pz(g.B1)} + ${pz(g.R2)}(I_1 + I_2) + ${pz(g.R1)}I_1 = 0`},{f:`-${pz(g.B1)} + ${nf(g.R2)}I_1 + ${nf(g.R2)}I_2 + ${nf(g.R1)}I_1 = 0`},{f:`-${pz(g.B1)} + ${nf(R11)}I_1 + ${nf(g.R2)}I_2 = 0`},
     {t:'بقسمة طرفي المعادلة على الرقم 2:',f:`-${nf(g.B1/2)} + ${nf(R11/2)}I_1 + I_2 = 0`},{f:`${nf(g.B1/2)} = ${nf(R11/2)}I_1 - I_2 \\qquad (a)`},
     {t:'<b>ملاحظة:</b> الأسطر الأربعة الأولى مطبوعة بإشارة <b>+</b> أمام I<sub>2</sub> (والصحيح −، لأن التيارين متعاكسان في R<sub>2</sub>)، أما المعادلة (a) فصحيحة. اختر «المصحح» لترى الأسطر الصحيحة.'})}
  else{out.push({f:`-${pz(g.B1)} + ${pz(g.R2)}(I_1 - I_2) + ${pz(g.R1)}I_1 = 0`},{f:`-${pz(g.B1)} + ${nf(R11)}I_1 - ${nf(g.R2)}I_2 = 0`});
     if(isBook)out.push({t:'بقسمة طرفي المعادلة على الرقم 2:',f:`-${nf(g.B1/2)} + ${nf(R11/2)}I_1 - I_2 = 0`},{f:`${nf(g.B1/2)} = ${nf(R11/2)}I_1 - I_2 \\qquad (a)`});
     else out.push({f:`${nf(g.B1)} = ${nf(R11)}I_1 - ${nf(g.R2)}I_2 \\qquad (a)`})}
  out.push({t:'<b>الحلقة الثانية B,E,F,C,B</b> — في اتجاه I<sub>2</sub>:',f:`-${pz(g.B2)} - ${pz(g.R2)}(I_2 - I_1) - ${pz(g.R3)}\\times I_2 = 0`},{f:`-${pz(g.B2)} - ${nf(g.R2)}I_2 + ${nf(g.R2)}I_1 - ${nf(g.R3)}I_2 = 0`},{f:`-${nf(g.B2)} = -${nf(g.R2)}I_1 + ${nf(R22)}I_2 \\qquad (b)`});
  const a1=isBook?R11/2:R11,a2=isBook?g.R2/2:g.R2,ra=isBook?g.B1/2:g.B1;
  const I1=(g.B1*R22-g.R2*g.B2)/(R11*R22-g.R2*g.R2),I2=(R11*(-g.B2)+g.R2*g.B1)/(R11*R22-g.R2*g.R2);if(!isFinite(I1)||!isFinite(I2))return [{t:'لا حل وحيد بهذه القيم.'}];
  if(bk)out.push({t:'بضرب طرفي المعادلة (a) في الرقم 3، والمعادلة (b) في الرقم 2، وبالجمع ينتج أن:'});
  else{const k=R22/a2;out.push({t:`نحذف I<sub>2</sub>: نضرب (a) في ${lt(nf(k))} ونجمعها مع (b):`,f:`${nf(k*ra)} - ${pz(g.B2)} = (${nf(k*a1)} - ${nf(g.R2)})\\,I_1 \\;\\Rightarrow\\; ${nf(k*ra-g.B2)} = ${nf(k*a1-g.R2)}\\,I_1`})}
  out.push({t:'التيار الحلقي الأول:',f:bk?'':`I_1 = \\frac{${nf(R22*ra/a2-g.B2)}}{${nf(R22*a1/a2-g.R2)}}`,v:B.round(I1,3),unit:'A',final:true});
  out.push({t:bk?'التيار الحلقي الثاني:':'من (a):',f:bk?'':`I_2 = \\frac{${nf(a1)}I_1 - ${pz(ra)}}{${nf(a2)}}`,v:B.round(I2,3),unit:'A',final:true});
  out.push({t:'تيارات الفروع (الشكل 4-3): في R<sub>1</sub> التيار I<sub>1</sub>، وفي R<sub>3</sub> التيار I<sub>2</sub>، وفي R<sub>2</sub> (لأسفل):',f:`I_{R2} = I_1 - I_2 = ${pz(B.round(I1,3))} - ${pz(B.round(I2,3))}`,v:B.round(I1-I2,3),unit:'A',final:true});
  out.push({t:'تحقق (توضيح للمتدرب — ليس من الكتاب): في الحلقة الأولى',f:`${nf(g.R1)}\\times${pz(B.round(I1,3))} + ${nf(g.R2)}\\times${pz(B.round(I1-I2,3))} = ${nf(B.round(g.R1*I1+g.R2*(I1-I2),3))}\\ \\text{V} \\;(=B_1)`});
  return out}
const G42=[{id:'E1',label:'البطارية اليسرى',sym:'',unit:'V',value:60},{id:'R1',label:'المقاومة في الفرع الأيسر',sym:'',unit:'Ω',value:5},{id:'R2',label:'أعلى يسار',sym:'',unit:'Ω',value:6},{id:'R3',label:'أسفل يسار',sym:'',unit:'Ω',value:1},{id:'E2',label:'البطارية الوسطى',sym:'',unit:'V',value:40},{id:'R4',label:'مقاومة الفرع الأوسط (المشتركة)',sym:'',unit:'Ω',value:3},{id:'R5',label:'أعلى يمين',sym:'',unit:'Ω',value:3},{id:'E3',label:'البطارية اليمنى',sym:'',unit:'V',value:10},{id:'R6',label:'المقاومة في الفرع الأيمن',sym:'',unit:'Ω',value:4},{id:'R7',label:'أسفل يمين',sym:'',unit:'Ω',value:2}];
function solve42(g){const R11=g.R1+g.R2+g.R4+g.R3,R22=g.R4+g.R5+g.R6+g.R7,b1=g.E1-g.E2,b2=g.E2-g.E3,m=g.R4,out=[];
  out.push({t:'نطبق قانون كيرشوف للجهد على مساري التيارين (مع عقارب الساعة، الشكل 4-4). <b>مسار التيار I<sub>1</sub>:</b>',f:`${nf(g.E1)} - ${pz(g.E2)} - ${nf(g.R1)}I_1 - ${nf(g.R2)}I_1 - ${nf(m)}(I_1 - I_2) - ${nf(g.R3)}\\times I_1 = 0`},
   {f:`${nf(b1)} - ${nf(g.R1)}I_1 - ${nf(g.R2)}I_1 - ${nf(m)}I_1 + ${nf(m)}I_2 - ${nf(g.R3)}\\times I_1 = 0`},{f:`${nf(b1)} = ${nf(R11)}I_1 - ${nf(m)}I_2 \\qquad (a)`},
   {t:'<b>مسار التيار I<sub>2</sub>:</b>',f:`${nf(g.E2)} - ${pz(g.E3)} - ${nf(m)}(I_2 - I_1) - ${nf(g.R5)}I_2 - ${nf(g.R6)}I_2 - ${nf(g.R7)}I_2 = 0`},
   {f:`${nf(b2)} - ${nf(m)}I_2 + ${nf(m)}I_1 - ${nf(g.R5)}I_2 - ${nf(g.R6)}I_2 - ${nf(g.R7)}I_2 = 0`},{f:`${nf(b2)} = -${nf(m)}I_1 + ${nf(R22)}I_2 \\qquad (b)`});
  if(!(m>0))return out.concat([{t:'المقاومة المشتركة صفر: كل حلقة مستقلة.'},{t:'I1',v:B.round(b1/R11,3),unit:'A',final:true},{t:'I2',v:B.round(b2/R22,3),unit:'A',final:true}]);
  const k=R11/m,s=b1+k*b2,c=k*R22-m;
  out.push({t:`بضرب طرفي المعادلة (b) في الرقم ${lt(nf(k))}، وبالجمع للمعادلتين:`,f:`${nf(b1)} = ${nf(R11)}I_1 - ${nf(m)}I_2 \\qquad (a)`},{f:`${nf(k*b2)} = -${nf(k*m)}I_1 + ${nf(k*R22)}I_2 \\qquad (b)`},{f:`${nf(s)} = ${nf(c)}I_2`});
  const I2=B.round(s/c,2);out.push({t:'التيار الحلقي الثاني:',f:`I_2 = \\frac{${nf(s)}}{${nf(c)}}`,v:I2,unit:'A',dp:2,final:true});
  const I1=B.round((b1+m*I2)/R11,3);out.push({t:'وبالتعويض عن I<sub>2</sub> في المعادلة (a):',f:`${nf(b1)} = ${nf(R11)}I_1 - ${nf(m)}(${nf(I2)}) \\;\\Rightarrow\\; I_1 = \\frac{${nf(b1)} + ${nf(m)}(${nf(I2)})}{${nf(R11)}} = \\frac{${nf(b1+m*I2)}}{${nf(R11)}}`,v:I1,unit:'A',dp:3,final:true});
  const ex=solveLin([[R11,-m],[-m,R22]],[b1,b2]);if(ex)out.push({t:'توضيح للمتدرب — ليس من الكتاب: بدون تقريب I<sub>2</sub> قبل التعويض',f:`I_1 = ${nf(B.round(ex[0],4))}\\ \\text{A},\\quad I_2 = ${nf(B.round(ex[1],4))}\\ \\text{A}`},{t:'وتيار الفرع الأوسط (المشترك) = I<sub>2</sub> − I<sub>1</sub>'+(ex[1]-ex[0]>=0?' لأعلى':' لأسفل')+' (توضيح — لا يذكره الكتاب):',v:B.round(Math.abs(ex[1]-ex[0]),3),unit:'A'});
  return out}
const G43=[{id:'E',label:'البطارية',sym:'',unit:'V',value:12},{id:'Ra',label:'المقاومة بين البطارية والعقدة 1',sym:'',unit:'Ω',value:3},{id:'Rb',label:'من العقدة 1 إلى الإسناد',sym:'',unit:'Ω',value:6},{id:'Rc',label:'بين العقدتين 1 و 2',sym:'',unit:'Ω',value:10},{id:'Rd',label:'من العقدة 2 إلى الإسناد',sym:'',unit:'Ω',value:12},{id:'J',label:'مصدر التيار (داخل إلى العقدة 2)',sym:'',unit:'A',value:2}];
function cramer2(a11,a12,r1,a21,a22,r2){const D=a11*a22-a12*a21;return {D,x:(r1*a22-a12*r2)/D,y:(a11*r2-a21*r1)/D}}
function solve43(g){const out=[{t:'قانون كيرشوف للتيار عند العقدة (1) — ثلاثة أفرع، التيار الخارج موجب:',f:`\\frac{V_1 - ${nf(g.E)}}{${nf(g.Ra)}} + \\frac{V_1 - 0}{${nf(g.Rb)}} + \\frac{V_1 - V_2}{${nf(g.Rc)}} = 0 \\qquad (a)`},
  {t:'وعند العقدة (2):',f:`\\frac{V_2 - V_1}{${nf(g.Rc)}} + \\frac{V_2 - 0}{${nf(g.Rd)}} - ${nf(g.J)} = 0 \\qquad (b)`},
  {t:'وبعد إيجاد V<sub>1</sub> يكون التيار في المقاومة '+lt(nf(g.Rb)+' Ω')+':',f:`I_2 = \\frac{V_1 - 0}{${nf(g.Rb)}}`},
  {t:'<b>إكمال الحل (توضيح للمتدرب — ليس من الكتاب، فالكتاب يتوقف هنا):</b> نرتب المعادلتين:'}];
  const a11=1/g.Ra+1/g.Rb+1/g.Rc,a12=-1/g.Rc,r1=g.E/g.Ra,a22=1/g.Rc+1/g.Rd,r2=g.J;
  out.push({f:`${nf(a11)}\\,V_1 - ${nf(-a12)}\\,V_2 = ${nf(r1)}`},{f:`-${nf(-a12)}\\,V_1 + ${nf(a22)}\\,V_2 = ${nf(r2)}`});
  const c=cramer2(a11,a12,r1,a12,a22,r2);if(!isFinite(c.x))return out.concat([{t:'لا حل وحيد بهذه القيم.'}]);
  out.push({t:'بالحل (الحذف أو المحددات):',v:B.round(c.x,3),unit:'V',f:'V_1',final:true},{f:'V_2',v:B.round(c.y,3),unit:'V',final:true},{t:'التيار في المقاومة '+lt(nf(g.Rb)+' Ω')+' (من العقدة 1 إلى الإسناد، أي لأسفل):',f:`I_2 = \\frac{${nf(B.round(c.x,3))}}{${nf(g.Rb)}}`,v:B.round(c.x/g.Rb,3),unit:'A',final:true});
  return out}
const G44=[{id:'E',label:'البطارية (العقدة 1)',sym:'',unit:'V',value:40},{id:'R9',label:'من العقدة 1 إلى الإسناد',sym:'',unit:'Ω',value:9},{id:'R10',label:'بين العقدتين',sym:'',unit:'Ω',value:10},{id:'J',label:'مصدر التيار (داخل إلى العقدة 2)',sym:'',unit:'A',value:20},{id:'Ra',label:'المقاومة الأولى من العقدة 2',sym:'',unit:'Ω',value:2},{id:'Rb',label:'المقاومة الثانية من العقدة 2',sym:'',unit:'Ω',value:5}];
function solve44(g){const k1=g.R10/g.Ra,k2=g.R10/g.Rb,c=1+k1+k2,jr=g.J*g.R10,out=[];
  out.push({t:'العقدة (1) موصلة بعقدة الإسناد عن طريق البطارية، قطبها الموجب بالعقدة (1) وطرفها السالب بالإسناد، فجهد العقدة (1) هو جهد البطارية:',f:`V_1 = ${nf(g.E)}\\ \\text{V} \\qquad (a)`},
   {t:'العقدة (2) تجمع أربعة أفرع:',f:`\\frac{V_2 - V_1}{${nf(g.R10)}} + \\frac{V_2 - 0}{${nf(g.Ra)}} + \\frac{V_2 - 0}{${nf(g.Rb)}} - ${nf(g.J)} = 0`},
   {t:`بضرب الطرفين في ${lt(nf(g.R10))}:`,f:`V_2 - V_1 + ${nf(k1)}V_2 + ${nf(k2)}V_2 - ${nf(jr)} = 0`},{f:`${nf(c)}V_2 - V_1 - ${nf(jr)} = 0 \\qquad (b)`},
   {t:'بالتعويض عن قيمة V<sub>1</sub> في المعادلة (b):',f:`${nf(c)}V_2 = ${nf(jr)} + ${pz(g.E)} \\;,\\quad ${nf(c)}V_2 = ${nf(jr+g.E)}`},
   {t:'جهد العقدة (2):',f:`V_2 = \\frac{${nf(jr+g.E)}}{${nf(c)}}`,v:B.round((jr+g.E)/c,3),unit:'V',final:true});return out}
const G45=[{id:'E',label:'البطارية',sym:'',unit:'V',value:18},{id:'R3',label:'المقاومة مع البطارية',sym:'',unit:'Ω',value:3},{id:'J',label:'مصدر التيار',sym:'',unit:'A',value:3},{id:'R6',label:'المقاومة المطلوبة',sym:'',unit:'Ω',value:6}];
function solve45(g){const Rp=g.R3*g.R6/(g.R3+g.R6),V1=g.J*Rp,I1=V1/g.R6,I2=g.E/(g.R3+g.R6),V2=I2*g.R6;
  return [{t:'<b>مصدر التيار وحده</b> (البطارية قصر، الشكل 4-9أ): يتوزع التيار بين المقاومتين المتصلتين على التوازي:',f:`R = \\frac{${nf(g.R3)}\\times ${nf(g.R6)}}{${nf(g.R3)} + ${nf(g.R6)}}`,v:B.round(Rp,3),unit:'Ω'},
   {t:'والجهد على طرفي الدائرة:',f:`V = I\\times R = ${nf(g.J)}\\times ${nf(B.round(Rp,3))}`,v:B.round(V1,3),unit:'V'},
   {t:'تيار المقاومة '+lt(nf(g.R6)+' Ω')+':',f:`I_1 = \\frac{V}{R} = \\frac{${nf(B.round(V1,3))}}{${nf(g.R6)}}`,v:B.round(I1,3),unit:'A'},
   {t:'<b>البطارية وحدها</b> (مصدر التيار مفتوح، الشكل 4-9ب):',f:`I_2 = \\frac{${nf(g.E)}}{${nf(g.R3)} + ${nf(g.R6)}}`,v:B.round(I2,3),unit:'A'},
   {t:'والجهد على طرفي المقاومة:',f:`V_2 = ${nf(B.round(I2,3))}\\times ${nf(g.R6)}`,v:B.round(V2,3),unit:'V'},
   {t:'تأثير المصدرين معاً:',f:`I = I_1 + I_2 = ${nf(B.round(I1,3))} + ${nf(B.round(I2,3))}`,v:B.round(I1+I2,3),unit:'A',final:true},
   {f:`V = ${nf(B.round(V1,3))} + ${nf(B.round(V2,3))}`,v:B.round(V1+V2,3),unit:'V',final:true}]}
const G46=[{id:'E1',label:'البطارية اليسرى',sym:'',unit:'V',value:10},{id:'R6',label:'أعلى يسار',sym:'',unit:'Ω',value:6},{id:'R1',label:'الرأسية الأولى',sym:'',unit:'Ω',value:1},{id:'R2',label:'أعلى وسط',sym:'',unit:'Ω',value:2},{id:'R3',label:'الرأسية الثانية',sym:'',unit:'Ω',value:3},{id:'R10',label:'المقاومة المطلوبة (a–b)',sym:'',unit:'Ω',value:10},{id:'E2',label:'البطارية السفلية',sym:'',unit:'V',value:20}];
function solve46(g,B,isBook){const bk=bkOn('e46',isBook),par=(a,b)=>a*b/(a+b);
  const r=par(g.R3,g.R10),r2=r+g.R2,r3=par(r2,g.R1),Rt=r3+g.R6,Is=g.E1/Rt,V1=Is*r3,Ib=V1/r2,V2=Ib*r,I1=V2/g.R10;
  const Rth=par(par(g.R6,g.R1)+g.R2,g.R3),I2=g.E2/(g.R10+Rth);const out=[];
  out.push({t:'<b>المصدر '+lt(nf(g.E1)+' V')+' وحده</b> (البطارية الأخرى قصر، الشكل 4-10أ). خطوات «تجميع المقاومات» لا يكتبها الكتاب، وهذه هي (توضيح للمتدرب — ليس من الكتاب):',f:`${nf(g.R3)}\\parallel ${nf(g.R10)} = ${nf(B.round(r,3))}\\,\\Omega,\\quad +${nf(g.R2)} = ${nf(B.round(r2,3))}\\,\\Omega,\\quad \\parallel ${nf(g.R1)} = ${nf(B.round(r3,4))}\\,\\Omega,\\quad +${nf(g.R6)} = ${nf(B.round(Rt,4))}\\,\\Omega`},
   {f:`I_s = \\frac{${nf(g.E1)}}{${nf(B.round(Rt,4))}} = ${nf(B.round(Is,4))}\\ \\text{A},\\; V_1 = ${nf(B.round(V1,4))}\\ \\text{V},\\; V_2 = ${nf(B.round(V2,4))}\\ \\text{V}`},
   {t:'التيار في '+lt(nf(g.R10)+' Ω')+' من a إلى b:',f:`I_1 = \\frac{V_2}{${nf(g.R10)}}`,v:bk?0.0636:B.round(I1,4),unit:'A',dp:4,final:true});
  out.push({t:'<b>المصدر '+lt(nf(g.E2)+' V')+' وحده</b> (البطارية الأولى قصر، الشكل 4-10ب). البطارية على التوالي مع '+lt(nf(g.R10)+' Ω')+'، والمقاومة المكافئة لباقي الدائرة (توضيح — ليس من الكتاب):',f:`R_{th} = (${nf(g.R6)}\\parallel ${nf(g.R1)} + ${nf(g.R2)})\\parallel ${nf(g.R3)} = ${nf(B.round(Rth,4))}\\,\\Omega`},
   {t:'التيار في '+lt(nf(g.R10)+' Ω')+' (من b إلى a، أي عكس اتجاه I):',f:`I_2 = \\frac{${nf(g.E2)}}{${nf(g.R10)} + ${nf(B.round(Rth,4))}}`,v:bk?1.744:B.round(I2,3),unit:'A',dp:3,final:true});
  const i1=bk?0.0636:B.round(I1,4),i2=bk?1.744:B.round(I2,3);
  out.push({t:'التيار الكلي (I<sub>2</sub> عكس اتجاه I فيُطرح):',f:`I = I_1 + I_2 = ${nf(i1)} - ${nf(i2)}`,v:bk?-1.68:B.round(i1-i2,3),unit:'A',dp:bk?2:3,final:true});
  out.push({t:(bk?'<b>ملاحظة:</b> 0.0636 و 1.744 هما المطبوعان؛ الحساب الدقيق 0.0638 و 1.745 (اختر «المصحح»). ':'')+'الإشارة السالبة: التيار الحقيقي في المقاومة من b إلى a (لأعلى).'});return out}
const G47=[{id:'E1',label:'البطارية اليسرى',sym:'',unit:'V',value:120},{id:'Ra',label:'يسار أعلى',sym:'',unit:'Ω',value:15},{id:'Rb',label:'يسار (مع البطارية)',sym:'',unit:'Ω',value:30},{id:'Rc',label:'يسار أسفل',sym:'',unit:'Ω',value:15},{id:'E2',label:'البطارية الوسطى',sym:'',unit:'V',value:240},{id:'Rm',label:'الفرع الأوسط',sym:'',unit:'Ω',value:40},{id:'E3',label:'البطارية اليمنى',sym:'',unit:'V',value:60},{id:'Rd',label:'يمين أعلى',sym:'',unit:'Ω',value:10},{id:'Re',label:'يمين (مع البطارية)',sym:'',unit:'Ω',value:20},{id:'Rf',label:'يمين أسفل',sym:'',unit:'Ω',value:10}];
const tr3=x=>Math.trunc(x*1000+(x>=0?1e-9:-1e-9))/1000;
function solve47(g){const RL=g.Ra+g.Rb+g.Rc,RM=g.Rm,RR=g.Rd+g.Re+g.Rf,par=(a,b)=>a*b/(a+b);
  const Rab=par(RR,RM),Rt=Rab+RL,I1a=g.E1/Rt,Vab=I1a*Rab,I2a=Vab/RM,I3a=Vab/RR;
  const I2b=g.E2/(RM+par(RL,RR)),I1b=I2b*RR/(RL+RR),I3b=I2b*RL/(RL+RR);
  const I3c=g.E3/(RR+par(RL,RM)),I1c=I3c*RM/(RL+RM),I2c=I3c*RL/(RL+RM);
  const T=x=>tr3(x);const out=[];
  out.push({t:'<b>أ- المصدر '+lt(nf(g.E1)+' V')+' وحده</b> (الشكل 4-11أ). المقاومة الكلية للفرع الأيمن:',f:`R' = ${nf(g.Rd)} + ${nf(g.Re)} + ${nf(g.Rf)}`,v:RR,unit:'Ω'},
   {t:'وهي على التوازي مع الفرع الأوسط:',f:`R_{ab} = \\frac{${nf(RR)}\\times ${nf(RM)}}{${nf(RR)} + ${nf(RM)}}`,v:T(Rab),unit:'Ω'},
   {t:'المقاومة الكلية:',f:`R = ${nf(T(Rab))} + ${nf(g.Ra)} + ${nf(g.Rc)} + ${nf(g.Rb)}`,v:T(Rt),unit:'Ω'},
   {f:`I_1' = \\frac{${nf(g.E1)}}{${nf(T(Rt))}}`,v:T(I1a),unit:'A'},
   {t:'فرق الجهد بين الطرفين a و b:',f:`V_{ab} = I_1'\\times R_{ab} = ${nf(T(I1a))}\\times ${nf(T(Rab))}`,v:T(Vab),unit:'V'},
   {f:`I_2' = \\frac{${nf(T(Vab))}}{${nf(RM)}}`,v:T(I2a),unit:'A'},{f:`I_3' = \\frac{${nf(T(Vab))}}{${nf(RR)}}`,v:T(I3a),unit:'A'});
  out.push({t:'<b>ب- المصدر '+lt(nf(g.E2)+' V')+' وحده</b> (الشكل 4-11ب) بالطريقة نفسها (الخطوات توضيح — الكتاب يكتب النتائج فقط):',f:`I_2'' = \\frac{${nf(g.E2)}}{${nf(RM)} + \\frac{${nf(RL)}\\times${nf(RR)}}{${nf(RL)}+${nf(RR)}}}`,v:T(I2b),unit:'A'},
   {f:`I_1'' = I_2''\\times\\frac{${nf(RR)}}{${nf(RL)}+${nf(RR)}}`,v:T(I1b),unit:'A'},{f:`I_3'' = I_2''\\times\\frac{${nf(RL)}}{${nf(RL)}+${nf(RR)}}`,v:T(I3b),unit:'A'});
  out.push({t:'<b>ج- المصدر '+lt(nf(g.E3)+' V')+' وحده</b> (الشكل 4-11ج):',f:`I_3''' = \\frac{${nf(g.E3)}}{${nf(RR)} + \\frac{${nf(RL)}\\times${nf(RM)}}{${nf(RL)}+${nf(RM)}}}`,v:T(I3c),unit:'A'},
   {f:`I_1''' = I_3'''\\times\\frac{${nf(RM)}}{${nf(RL)}+${nf(RM)}}`,v:T(I1c),unit:'A'},{f:`I_2''' = I_3'''\\times\\frac{${nf(RL)}}{${nf(RL)}+${nf(RM)}}`,v:T(I2c),unit:'A'});
  const s1=T(I1a)+T(I1b)+T(I1c),s2=T(I2a)+T(I2b)-T(I2c),s3=T(I3a)-T(I3b)+T(I3c);
  out.push({t:'<b>الجمع الجبري</b> للتيارات الجزئية في كل فرع (I<sub>2</sub>\'\'\' سالب لأنه عكس I<sub>2</sub>\' و I<sub>2</sub>\'\'؛ وفي الفرع الأيمن يُعد الموجب لأعلى فيكون I<sub>3</sub>\'\' سالباً):',f:`I_1 = ${nf(T(I1a))} + ${nf(T(I1b))} + ${nf(T(I1c))}`,v:B.round(s1,3),unit:'A',final:true},
   {f:`I_2 = ${nf(T(I2a))} + ${nf(T(I2b))} - ${nf(T(I2c))}`,v:B.round(s2,3),unit:'A',final:true},
   {f:`I_3 = ${nf(T(I3a))} - ${nf(T(I3b))} + ${nf(T(I3c))}`,v:B.round(s3,3),unit:'A',final:true},
   {t:s3<0?'قيمة I<sub>3</sub> سالبة: التيار في اتجاه الجزء الذي اعتُبر سالباً (I<sub>3</sub>\'\')، أي لأسفل في الفرع الأيمن.':'قيمة I<sub>3</sub> موجبة: التيار لأعلى في الفرع الأيمن.'});
  return out}
const GX2=[{id:'E',label:'البطارية (العقدة 1)',sym:'',unit:'V',value:40},{id:'R9',label:'من العقدة 1 إلى الإسناد',sym:'',unit:'Ω',value:9},{id:'R10',label:'بين العقدتين',sym:'',unit:'Ω',value:10},{id:'J',label:'مصدر التيار (داخل إلى العقدة 2)',sym:'',unit:'A',value:20},{id:'Rb',label:'من العقدة 2 إلى الإسناد',sym:'',unit:'Ω',value:5}];
function solveX2(g){const k=g.R10/g.Rb,c=1+k,jr=g.J*g.R10;return [
  {t:'العقدة (1) موصلة بالإسناد عن طريق البطارية فقط (بطريقة مثال 4-4):',f:`V_1 = ${nf(g.E)}\\ \\text{V}`,v:g.E,unit:'V',final:true},
  {t:'العقدة (2) تجمع ثلاثة أفرع:',f:`\\frac{V_2 - V_1}{${nf(g.R10)}} + \\frac{V_2 - 0}{${nf(g.Rb)}} - ${nf(g.J)} = 0`},
  {t:`بضرب الطرفين في ${lt(nf(g.R10))}:`,f:`V_2 - V_1 + ${nf(k)}V_2 - ${nf(jr)} = 0 \\;\\Rightarrow\\; ${nf(c)}V_2 = ${nf(jr)} + ${pz(g.E)} = ${nf(jr+g.E)}`},
  {f:`V_2 = \\frac{${nf(jr+g.E)}}{${nf(c)}}`,v:B.round((jr+g.E)/c,3),unit:'V',final:true},
  {t:'المقاومة '+lt(nf(g.R9)+' Ω')+' لا تدخل في حساب V<sub>2</sub> لأن جهد العقدة 1 تفرضه البطارية؛ تيارها '+lt(nf(B.round(g.E/g.R9,3))+' A')+'.'}]}
const GX3=[{id:'R1',label:'مقاومة فرع البطارية',sym:'',unit:'Ω',value:4},{id:'E',label:'البطارية',sym:'',unit:'V',value:40},{id:'R2',label:'من العقدة 1 إلى الإسناد',sym:'',unit:'Ω',value:5},{id:'R3',label:'بين العقدتين',sym:'',unit:'Ω',value:2},{id:'J',label:'مصدر التيار (داخل إلى العقدة 2)',sym:'',unit:'A',value:15},{id:'R4',label:'من العقدة 2 إلى الإسناد',sym:'',unit:'Ω',value:4}];
function solveX3(g){const a11=1/g.R1+1/g.R2+1/g.R3,a12=-1/g.R3,r1=g.E/g.R1,a22=1/g.R3+1/g.R4,r2=g.J;const c=cramer2(a11,a12,r1,a12,a22,r2);const out=[
  {t:'العقدة (1) — ثلاثة أفرع (بطريقة مثال 4-3):',f:`\\frac{V_1 - ${nf(g.E)}}{${nf(g.R1)}} + \\frac{V_1 - 0}{${nf(g.R2)}} + \\frac{V_1 - V_2}{${nf(g.R3)}} = 0`},
  {t:'العقدة (2) — ثلاثة أفرع:',f:`\\frac{V_2 - V_1}{${nf(g.R3)}} + \\frac{V_2 - 0}{${nf(g.R4)}} - ${nf(g.J)} = 0`},
  {t:'بالترتيب:',f:`${nf(a11)}V_1 - ${nf(-a12)}V_2 = ${nf(r1)}\\qquad -${nf(-a12)}V_1 + ${nf(a22)}V_2 = ${nf(r2)}`}];
  if(!isFinite(c.x))return out.concat([{t:'لا حل وحيد بهذه القيم.'}]);
  out.push({t:'بالمحددات:',f:`\\Delta = ${nf(a11)}\\times${nf(a22)} - (${nf(a12)})^2 = ${nf(c.D)}`},{f:'V_1',v:B.round(c.x,3),unit:'V',final:true},{f:'V_2',v:B.round(c.y,3),unit:'V',final:true});
  return out}

/* ======================================================================
   Lesson 1 — unit cover + mesh current method (ص 105–110)
   ====================================================================== */
B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'105–110',
 title:'تحليل الدوائر: طريقة تيار المسار المغلق (التحليل الحلقي)',
 summary:'مقدمة الوحدة الرابعة وأهدافها، ثم طريقة التيار الحلقي: نفترض تياراً في كل مسار مغلق ونطبق قانون كيرشوف للجهد على كل مسار، فنحصل على معادلات بعدد المسارات نحلها. مع المثالين (4-1) و(4-2) ومختبر تكتب فيه معادلات الحلقات بنفسك.',
 theory:[
  {h:'الوحدة الرابعة: تحليل الدوائر الكهربائية',ref:'ص 105–106',html:`<p><b>الهدف العام للوحدة:</b> معرفة وفهم مجموعة من القوانين والنظريات والطرق من حيث تطبيقها في تحليل الدوائر الكهربائية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من تحديد تيارات الفروع التي تتكون منها الدائرة.</li><li>أن يتمكن المتدرب من حساب الجهود عبر عناصر كل فرع.</li><li>أن يتمكن المتدرب من استخدام قانوني كيرشوف عند كل عقدة من عقد الدائرة ولكل حلقة من الحلقات التي تتكون منها الدائرة.</li><li>أن يتمكن المتدرب من تحليل الدوائر الكهربائية ومسارات التيار داخلها.</li><li>أن يعرف المتدرب بعض الطرق المبسطة لتحليل دوائر التيار المستمر.</li></ol>
   <p class="sub">دروس الوحدة: طريقة التيار الحلقي (هذا الدرس)، التحليل العقدي، نظرية التركيب، ثم تمارين الوحدة.</p>`},
  {h:'تحليل الدوائر الكهربائية',ref:'ص 107',html:`<p>من المعتاد أن تحتوي الدائرة الكهربائية على عدد كبير من العناصر الكهربائية من مقاومات ومكثفات وملفات ومصادر للجهد ومصادر للتيار وعناصر كهربائية أخرى يمكن تمثيلها بالعناصر الأساسية، ويمكن تحليل هذه الدائرة بالاعتماد على <b>قانون أوم وقانوني كيرشوف</b> (للجهد، والتيار). إلا أن الاقتصار على هذه القوانين وحدها قد يؤدي إلى خطوات حل مطولة، وهناك نظريات وأساليب مستمدة من القوانين الأساسية يمكن استخدامها لتسهيل التحليل واختصاره. وسنعرض عدداً من هذه النظريات والأساليب الرئيسة بإيجاز، ونعتمد على عدد من الأمثلة البسيطة لتوضيحها.</p>
   <p>إن الأسلوب المعتمد في تحليل الدائرة الكهربائية يعتمد على <b>تحديد تيارات الفروع</b> التي تتكون منها الدائرة، و<b>حساب الجهود عبر عناصر كل فرع</b>، ومن ثم استخدام قانون كيرشوف للتيار عند كل عقدة من عقد الدائرة وقانون كيرشوف للجهد لكل حلقة (مسار مغلق) من الحلقات التي تتكون منها الدائرة، فتتكون عدد من المعادلات الجبرية بعدد العقد وعدد الحلقات يمكن من خلال حلها إيجاد المجاهيل.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> <b>الفرع</b> جزء من الدائرة يمر فيه تيار واحد (عنصر أو أكثر على التوالي). <b>العقدة</b> نقطة يلتقي فيها أكثر من فرعين. <b>الحلقة (المسار المغلق)</b> طريق يبدأ من نقطة ويعود إليها. وتذكير بقانوني كيرشوف من الوحدة الثالثة: مجموع التيارات الداخلة إلى عقدة = مجموع الخارجة منها، ومجموع الجهود حول أي مسار مغلق = صفر.'},
  {h:'طريقة تيار المسار المغلق (التحليل الحلقي) Mesh Current Method (Loop Method)',ref:'ص 107',html:`<p>تعتمد طريقة تيار المسار المغلق (التحليل الحلقي) على <b>قانون كيرشوف للجهد</b>؛ فبدلاً من افتراض وجود تيارات فرعية فإننا <b>نحدد عدد المسارات المغلقة</b> ثم <b>نفترض وجود تيارات حلقية في كل مسار مغلق</b>، ثم بتطبيق قانون كيرشوف للجهد على كل مسار مغلق يتم الحصول على عدد من المعادلات تساوي عدد المسارات وتساوي في نفس الوقت عدد التيارات المفترضة في المسارات المغلقة، وبحل هذه المعادلات يمكن الحصول على قيم التيارات المفترضة التي تعني قيم التيارات في الأفرع. ويمكن توضيح ذلك بالأمثلة التالية.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (الخطوات باختصار):</b><ol style="margin:6px 0 0;padding-inline-start:20px"><li>ارسم تياراً حلقياً في كل «نافذة» من الدائرة، وكلها <b>مع عقارب الساعة</b> (كما في أمثلة الكتاب).</li><li>سِر في كل حلقة مع تيارها واكتب جهد كل عنصر: المقاومة غير المشتركة \\(R\\,I_1\\)، والمشتركة بين حلقتين \\(R\\,(I_1-I_2)\\) لأن التيارين فيها متعاكسان.</li><li>البطارية: إذا عبرتها من السالب إلى الموجب فهي ارتفاع في الجهد (تُكتب بإشارة −28 مثلاً في جهة «مجموع الهبوط = صفر»).</li><li>تحصل على معادلات بعدد الحلقات؛ حلها بالحذف أو التعويض.</li><li>تيار الفرع غير المشترك = تيار حلقته، وتيار الفرع المشترك = الفرق بين التيارين.</li></ol>'},
  {h:'مثال (4-1)',ref:'ص 108–109',html:'<p>احسب التيارات الحلقية I<sub>1</sub> و I<sub>2</sub> والتيارات الفرعية عبر المقاومات R<sub>1</sub> و R<sub>2</sub> و R<sub>3</sub> للدائرة الموضحة في الشكل (4-1).</p>'},
  {fig:'(4-1)',ref:'ص 108',caption:'دائرة بحلقتين: B1 = 28 V يساراً، و R1 = 4 Ω أعلى يسار، و R2 = 2 Ω في الفرع الأوسط، و R3 = 1 Ω أعلى يمين، و B2 = 7 V يميناً (الطرف الموجب لكلتا البطاريتين لأعلى).',draw:()=>FIG.f41()},
  {html:'<p><b>الحل:</b> نفترض وجود تيارات حلقية في كل حلقة للدائرة في الشكل (4-1)، فنأخذ التيارات I<sub>1</sub> و I<sub>2</sub> في الحلقتين ونعدها باتجاه عشوائي، الشكل (4-2).</p>'},
  {fig:'(4-2)',ref:'ص 108',caption:'نفس الدائرة مع تسمية العقد A و B و E (أعلى) و D و C و F (أسفل) وأقطاب الجهد على العناصر، والتياران الحلقيان I1 و I2 مع عقارب الساعة.',draw:()=>FIG.f42()},
  {html:`<p>فيما يخص <b>الحلقة الأولى A,B,C,D,A</b> وحسب قانون كيرشوف للجهد يكون مجموع الجهود في مسار التيار I<sub>1</sub> صفراً، أي أننا إذا سرنا في اتجاه التيار، الشكل (4-2)، نحصل على المعادلة التالية:</p>
   $$-28+2(I_1-I_2)+4I_1=0$$ $$-28+6I_1-2I_2=0$$ <p>بقسمة طرفي المعادلة على الرقم 2 ينتج أن: <span class="ref">ص 109</span></p> $$-14+3I_1-I_2=0$$ $$14=3I_1-I_2 \\qquad (a)$$
   <p>بتطبيق قانون كيرشوف للجهد في <b>الحلقة الثانية B,E,F,C,B</b> مسار التيار I<sub>2</sub>، الشكل (4-2)، نحصل على المعادلة التالية:</p>
   $$-7-2(I_2-I_1)-1\\times I_2=0$$ $$-7-2I_2+2I_1-I_2=0$$ $$-7=-2I_1+3I_2 \\qquad (b)$$
   <p>ومن المعادلتين (a) و (b) يمكن إيجاد تيارات الحلقتين في الشكل (4-2): بضرب طرفي المعادلة (a) في الرقم 3 وجمعها مع المعادلة (b) ينتج أن:</p>
   $$42-7=9I_1-2I_1 \\;\\Rightarrow\\; 7I_1=35$$ $$I_1=5\\ \\text{A}\\;,\\qquad I_2=3(5)-14=1\\ \\text{A}$$
   <p>الشكل (4-3) يوضح اتجاه التيارات في الأفرع للدائرة.</p>`},
  {fig:'(4-3)',ref:'ص 109',caption:'تيارات الفروع: في R1 التيار I1 = 5 A، وفي R3 التيار I2 = 1 A، وفي R2 (لأسفل) التيار I1 − I2 = 4 A.',draw:()=>FIG.f43()},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (تحقق):</b> في الحلقة الأولى \\(4\\times5+2\\times4=28\\ \\text{V}\\) = جهد B1 ✓، وفي الحلقة الثانية جهد R2 \\(=2\\times4=8\\ \\text{V}\\) = \\(1\\times1+7\\) ✓.'},
  {h:'مثال (4-2)',ref:'ص 109–110',html:'<p>من الدائرة الكهربائية الموضحة في الشكل (4-4) وباستخدام طريقة المسارات المغلقة (التحليل الحلقي) أوجد قيمة التيارات I<sub>1</sub> و I<sub>2</sub>.</p>'},
  {fig:'(4-4)',ref:'ص 110',caption:'حلقتان وثلاثة فروع رأسية: يسار 60 V ثم 5 Ω (من أسفل لأعلى) و 6 Ω أعلى و 1 Ω أسفل؛ الأوسط 40 V ثم 3 Ω (من أعلى لأسفل)؛ الأيمن 10 V ثم 4 Ω و 3 Ω أعلى و 2 Ω أسفل. موجب كل البطاريات لأعلى، و I1 و I2 مع عقارب الساعة.',draw:()=>FIG.f44()},
  {html:`<p><b>الحل:</b> بتطبيق قانون كيرشوف للجهد على مساري التيارين I<sub>1</sub> و I<sub>2</sub> للدائرة في الشكل (4-4) كالآتي: <span class="ref">ص 110</span></p>
   <p><b>مسار التيار I<sub>1</sub></b></p>$$60-40-5I_1-6I_1-3(I_1-I_2)-1\\times I_1=0$$ $$20-5I_1-6I_1-3I_1+3I_2-1\\times I_1=0$$ $$20=15I_1-3I_2 \\qquad (a)$$
   <p><b>مسار التيار I<sub>2</sub></b></p>$$40-10-3(I_2-I_1)-3I_2-4I_2-2I_2=0$$ $$30-3I_2+3I_1-3I_2-4I_2-2I_2=0$$ $$30=-3I_1+12I_2 \\qquad (b)$$
   <p>وبحل المعادلتين (a) و (b) يمكن إيجاد تيارات الحلقتين: بضرب طرفي المعادلة (b) في الرقم 5، وبالجمع للمعادلتين ينتج أن:</p>
   $$20=15I_1-3I_2 \\qquad (a)$$ $$150=-15I_1+60I_2 \\qquad (b)$$ $$170=57I_2\\;,\\qquad I_2=\\frac{170}{57}=2.98\\ \\text{A}$$
   <p>وبالتعويض عن قيمة التيار I<sub>2</sub> في أي معادلة (a) أو (b) ينتج أن:</p>$$20=15I_1-3(2.98)$$ $$I_1=\\frac{20+3(2.98)}{15}=\\frac{28.94}{15}=1.929\\ \\text{A}$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لاحظ أن البطاريتين 60 V و 40 V في الحلقة الأولى متعاكستان (نعبر الأولى من − إلى + والثانية من + إلى −)، لذلك يظهر \\(60-40\\). وتيار الفرع الأوسط المشترك \\(I_2-I_1\\approx 2.98-1.93=1.05\\ \\text{A}\\) لأعلى (لا يذكره الكتاب). وبدون تقريب I<sub>2</sub> إلى 2.98 قبل التعويض يكون \\(I_1=1.930\\ \\text{A}\\).'},
  {note:'التمرين 1 من تمارين الوحدة (ص 122) هو نفس دائرة الشكل (4-4)، وتجده مع حل مقترح في درس «تمارين الوحدة الرابعة».'},
  {err:`<b>ملاحظات على الكتاب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li><b>مثال (4-1) ص 108–109 (خطأ إشارة):</b> طُبعت معادلة الحلقة الأولى \\(-28+2(I_1+I_2)+4I_1=0\\) ثم \\(-28+6I_1+2I_2=0\\) ثم \\(-14+3I_1+I_2=0\\). والصحيح \\((I_1-I_2)\\) لأن التيارين الحلقيين (كلاهما مع عقارب الساعة) متعاكسان في R<sub>2</sub>؛ المعادلة (a) النهائية \\(14=3I_1-I_2\\) صحيحة. في تبويب «الأمثلة المحلولة» مفتاح «كما في الكتاب / المصحح» يعرض الأسطر كما طُبعت وكما يجب.</li>
   <li><b>مثال (4-1) ص 109 (طريقة الحذف):</b> يقول الكتاب «بضرب (a) في 3 و (b) في 2 وبالجمع»، وضرب (b) في 2 لا يحذف أي مجهول. الصحيح: ضرب (a) في 3 فقط ثم الجمع مع (b). النتائج \\(I_1=5\\) A و \\(I_2=1\\) A صحيحة.</li>
   <li><b>مثال (4-2) ص 110:</b> بعد «وبالتعويض عن قيمة التيار I2…» طُبع سطران منقولان من المثال (4-1): «I1 = 5A , I2 = 1A — الشكل (4-3) يوضح اتجاه التيارات…» ولا علاقة لهما بهذا المثال؛ حُذفا هنا.</li>
   <li>الهدف التفصيلي الرابع ص 106: كلمة «و» مكررة («الكهربائية و و مسارات»)؛ صُححت.</li></ol>`}
 ],
 lab:(el)=>{eqLab(el,{p:'m1',presets:['f41','f44','f410'],based:'مبنية على الأشكال (4-1) و(4-4) ص 108–110، و(4-10) ص 117 للثلاث حلقات',
  steps:st=>[
   {t:'معادلة الحلقة الأولى',x:'في الشكل (4-1) سر مع I<sub>1</sub> واكتب: معامل I<sub>1</sub> = مجموع مقاومات الحلقة، ومعامل I<sub>2</sub> = سالب المقاومة المشتركة R<sub>2</sub>، والطرف الأيمن = جهد البطارية B1. أي مضاعف مقبول (مثل معادلة الكتاب بعد القسمة على 2).',done:()=>st.pk==='f41'&&st.ok[0]},
   {t:'معادلة الحلقة الثانية',x:'اكتب معادلة الحلقة B,E,F,C,B. انتبه: تيار الحلقة الثانية يعبر B2 من الموجب إلى السالب، فالطرف الأيمن سالب. يجب أن تحصل على I<sub>1</sub> = 5 A و I<sub>2</sub> = 1 A و 4 A في R<sub>2</sub> (الشكل 4-3).',done:()=>st.pk==='f41'&&st.allOk},
   {t:'غيّر الدائرة',x:'غيّر قيمة B2 أو اضغط ⇅ لعكس قطبيتها: تصبح معادلاتك حمراء لأن الطرف الأيمن تغير. صحّحها حتى تعود صحيحة، وراقب كيف تغيرت تيارات الفروع.',done:()=>st.pk==='f41'&&(st.did['edit_f41_B2']||st.did['flip_f41_B2'])&&st.allOk},
   {t:'مثال (4-2)',x:'اختر الشكل (4-4) واكتب المعادلتين. الكتاب: (a) 20 = 15I<sub>1</sub> − 3I<sub>2</sub> و (b) 30 = −3I<sub>1</sub> + 12I<sub>2</sub>، فتحصل على I<sub>1</sub> ≈ 1.93 A و I<sub>2</sub> ≈ 2.98 A.',done:()=>st.pk==='f44'&&st.allOk},
   {t:'ثلاث حلقات',x:'اختر الشكل (4-10): ثلاث حلقات وثلاث معادلات. الحلقة الوسطى تشارك جارتيها في مقاومتين، فلها معاملان سالبان. التيار الحلقي الثالث هو تيار المقاومة 10 Ω: −1.681 A (أي 1.681 A لأعلى)، وهي نفس نتيجة مثال (4-6) بنظرية التركيب.',done:()=>st.pk==='f410'&&st.allOk}
  ]})},
 examples:[
  {title:'مثال (4-1)',ref:'ص 108–109',get q(){return `<p>احسب التيارات الحلقية I<sub>1</sub> و I<sub>2</sub> والتيارات الفرعية عبر المقاومات R<sub>1</sub> و R<sub>2</sub> و R<sub>3</sub> للدائرة الموضحة في الشكل (4-1).</p>${bkSeg('e41')}<p class="sub">«كما في الكتاب»: الأسطر كما طُبعت (بإشارة + الخاطئة أمام I<sub>2</sub>). «المصحح»: الأسطر الصحيحة. بأرقام من عندك يُعرض الحل الصحيح دائماً.</p>`},
   given:G41,solve:solve41,note:'<b>ملاحظات على الكتاب:</b> (١) طُبع \\(2(I_1+I_2)\\) والصحيح \\(2(I_1-I_2)\\)، ومعه السطران التاليان؛ المعادلة (a) صحيحة. (٢) «بضرب (a) في 3 و (b) في 2» — ضرب (b) في 2 لا يحذف مجهولاً؛ يكفي ضرب (a) في 3. النتائج 5 A و 1 A و 4 A صحيحة.'},
  {title:'مثال (4-2)',ref:'ص 109–110',q:'<p>من الدائرة الكهربائية الموضحة في الشكل (4-4) وباستخدام طريقة المسارات المغلقة (التحليل الحلقي) أوجد قيمة التيارات I<sub>1</sub> و I<sub>2</sub>.</p><p class="sub">المعطيات بترتيب الشكل (4-4)؛ موجب كل البطاريات لأعلى.</p>',
   given:G42,solve:(g)=>solve42(g),note:'بتقريب الكتاب: \\(I_2=170/57=2.98\\) ثم \\(I_1=28.94/15=1.929\\) A (بدون تقريب I<sub>2</sub> قبل التعويض: 1.930 A). حُذف من الحل السطران المنقولان خطأً من المثال (4-1) («I1 = 5A , I2 = 1A»).'}
 ],
 quiz:[
  {q:'على أي قانون تعتمد طريقة تيار المسار المغلق (التحليل الحلقي)؟',o:['قانون كيرشوف للتيار','قانون كيرشوف للجهد','قانون فارادي','قانون كولوم'],c:1,e:'ص 107: «تعتمد … على قانون كيرشوف للجهد».'},
  {q:'عدد المعادلات التي نحصل عليها في التحليل الحلقي يساوي:',o:['عدد العقد','عدد المقاومات','عدد المسارات المغلقة (التيارات الحلقية المفترضة)','عدد البطاريات'],c:2,e:'ص 107: معادلات بعدد المسارات وتساوي عدد التيارات المفترضة.'},
  {q:'مقاومة R مشتركة بين حلقتين تياراهما I<sub>1</sub> و I<sub>2</sub> وكلاهما مع عقارب الساعة. جهدها في معادلة الحلقة الأولى:',o:['R(I<sub>1</sub> + I<sub>2</sub>)','R(I<sub>1</sub> − I<sub>2</sub>)','R·I<sub>2</sub>','صفر'],c:1,e:'التياران متعاكسان في الفرع المشترك (ولهذا كان \\(2(I_1+I_2)\\) في مثال 4-1 خطأ طباعياً).'},
  {q:'في مثال (4-1): I<sub>1</sub> = 5 A و I<sub>2</sub> = 1 A. تيار المقاومة المشتركة R<sub>2</sub>:',o:['6 A','5 A','4 A','1 A'],c:2,e:'\\(I_1-I_2=4\\) A لأسفل (الشكل 4-3).'},
  {q:'إذا حصلنا على تيار حلقي بإشارة سالبة فمعنى ذلك:',o:['خطأ في الحل حتماً','أن التيار الحقيقي عكس الاتجاه المفترض','أن المقاومة سالبة','أن البطارية فارغة'],c:1,e:'الاتجاه المفترض «عشوائي» (ص 108)، والإشارة السالبة تعني أن الاتجاه الحقيقي معاكس.'},
  {q:'في معادلة الحلقة الأولى لمثال (4-2) ظهر الحد 60 − 40 لأن:',o:['البطاريتين على التوازي','تيار الحلقة يعبر 60 V من − إلى + ويعبر 40 V من + إلى −','40 V أصغر','الكتاب أخطأ'],c:1,e:'البطاريتان متعاكستان بالنسبة لاتجاه I<sub>1</sub>.'},
  {q:'في مثال (4-2) بعد الضرب والجمع حصلنا على 170 = 57I<sub>2</sub>. إذن I<sub>2</sub> ≈',o:['0.335 A','2.98 A','3.35 A','57 A'],c:1,e:'\\(170/57=2.98\\) A.'},
  {q:'دائرة فيها ثلاث «نوافذ» (حلقات). عدد التيارات الحلقية التي نفترضها:',o:['1','2','3','6'],c:2,e:'تيار لكل مسار مغلق (مثل الشكل 4-10).'}
 ]
});

/* ======================================================================
   Lesson 2 — nodal analysis (ص 111–114)
   ====================================================================== */
B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'111–114',
 title:'التحليل العقدي Node Voltage Method',
 summary:'نختار عقدة إسناد جهدها صفر، ونطبق قانون كيرشوف للتيار عند كل عقدة أخرى بكتابة تيار كل فرع من قانون أوم بدلالة جهود العقد، ثم نحل المعادلات. مع المثالين (4-3) و(4-4) ومختبر تكتب فيه معادلات العقد بنفسك.',
 theory:[
  {h:'التحليل العقدي Node Voltage Method',ref:'ص 111',html:`<p>تعرف <b>العقدة</b> في الدوائر الكهربائية بأنها نقطة تجميع أو تلاقي أكثر من فرعين. واستخدام طريقة التحليل العقدي في تحليل الدوائر الكهربائية يعني إنشاء معادلات للدائرة الكهربائية وحل هذه المعادلات التي تحتوي على جهود العقد الأساسية غير المعروفة قيمتها. وعند معرفة قيمة الجهد لكل العقد في أي دائرة كهربائية يسهل حساب قيمة التيار في كل فرع.</p>
   <p>والخطوات الأساسية لتحليل الدائرة الكهربائية باستخدام طريقة التحليل العقدي هي كالآتي:</p>
   <ul><li>حدد العقد في الدائرة الكهربائية بوضع علامة عليها ومعرفة عددها، ولنفرض أن عدد العقد n، ثم رقّم العقد، على سبيل المثال \\(N_1, N_2, N_3, \\ldots N_n\\)، ويسمى الجهد عند هذه العقد بجهود العقد \\(V_1, V_2, V_3, \\ldots V_n\\).</li>
   <li>اختر عقدة واحدة من هذه العقد واعتبرها <b>عقدة إسناد</b>، ويفضل اختيار العقدة التي يلتقي فيها أكبر عدد من الأفرع، ويكون جهد هذه العقدة صفراً.</li>
   <li>طبّق قانون كيرشوف للتيار عند كل عقدة ما عدا عقدة الإسناد؛ فعند تطبيق قانون كيرشوف للتيار عند عقدة ما نعتبر أن هذه العقدة هي <b>الأعلى جهداً</b> بالنسبة للعقد الأخرى، وبالتالي فإن <b>التيار الخارج منها يأخذ إشارة موجبة والتيار الداخل لها يأخذ إشارة سالبة</b>.</li>
   <li>على سبيل المثال، بتطبيق قانون كيرشوف للتيار (KCL) عند العقدة N في الشكل (4-5) تكون المعادلة:</li></ul>
   $$I_a+I_b+I_c=0$$`},
  {fig:'(4-5)',ref:'ص 111',caption:'عقدة N وثلاثة تيارات خارجة منها: Ia لليسار، و Ic لليمين، و Ib لأسفل.',draw:()=>FIG.f45()},
  {h:'تيار الفرع بدلالة جهود العقد',ref:'ص 112',html:'<p>ولحساب التيار المار في كل فرع متصل بالعقدة التي يطبق عليها الجهد العقدي نستخدم قانون أوم: التيار المار في الفرع يساوي فرق الجهد على هذا الفرع مقسوماً على مقاومة الفرع \\((I=V/R)\\)، والشكل (4-6) يوضح أوضاعاً مختلفة لتوصيل المقاومات مع العقدة.</p>'},
  {fig:'(4-6)',ref:'ص 112',caption:'(أ) مقاومة 10 Ω بين عقدتين: I = (V1 − V3)/10. (ب) مقاومة 5 Ω على التوالي مع بطارية 100 V موجبها نحو N2: I = (V1 − V2 + 100)/5. (ج) نفس الفرع والموجب نحو N1: I = (V1 − V2 − 100)/5.',draw:()=>FIG.f46()},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (قاعدة الإشارة):</b> التيار الخارج من عقدتك k عبر فرع فيه مقاومة R وبطارية E: \\(\\frac{V_k-V_{\\text{الأخرى}}\\pm E}{R}\\). خذ <b>+E</b> إذا كان القطب الموجب للبطارية نحو العقدة الأخرى (البطارية «تدفع» التيار خارجاً من عقدتك)، و<b>−E</b> إذا كان الموجب نحو عقدتك. ومصدر التيار: تياره يدخل كما هو (+ إذا خرج من العقدة، − إذا دخل إليها).'},
  {h:'مثال (4-3)',ref:'ص 112–113',html:'<p>يعتمد التحليل العقدي على قانون كيرشوف للتيار؛ فإذا نظرنا إلى الدائرة المبينة بالشكل (4-7) وجدنا فيها ثلاث عقد هي العقدة 1 والعقدة 2، ونشير إلى العقدة الثالثة التي يلتقي عندها أكبر عدد من الفروع بالعقدة 0. فإذا افترضنا أن جهد العقدة 1 هو V<sub>1</sub> بالنسبة للعقدة 0، وجهد العقدة 2 هو V<sub>2</sub> بالنسبة للعقدة 0، وأن V<sub>1</sub> و V<sub>2</sub> أعلى جهداً من العقدة 0، فإنه بالاستناد إلى الشكل تكون التيارات المتفرعة من العقد بحسب قانون كيرشوف كالآتي:</p>'},
  {fig:'(4-7)',ref:'ص 112',caption:'العقدة المرجعية 0 هي الخط السفلي. بطارية 12 V ثم 3 Ω إلى العقدة V1، ومنها 6 Ω إلى الإسناد و 10 Ω إلى العقدة V2، ومن V2 مقاومة 12 Ω إلى الإسناد، ومصدر تيار 2 A يغذي العقدة 2.',draw:()=>FIG.f47()},
  {html:`<p>بتطبيق قانون كيرشوف للتيار على العقدة (1)، نلاحظ أن هذه العقدة تجمع ثلاثة أفرع: الفرعان الأول والثاني بين العقدة (1) وعقدة الإسناد (0)، والفرع الثالث بين العقدة (1) والعقدة (2)، ولذلك تكون المعادلة كالتالي: <span class="ref">ص 113</span></p>
   $$\\frac{V_1-12}{3}+\\frac{V_1-0}{6}+\\frac{V_1-V_2}{10}=0 \\qquad (a)$$
   <p>وبتطبيق قانون كيرشوف للتيار على العقدة (2)، نلاحظ أن هذه العقدة تجمع أيضاً ثلاثة أفرع: الفرعان الثاني والثالث بين العقدة (2) والعقدة (0)، والفرع الأول بين العقدة (2) والعقدة (1)، ولذلك تكون المعادلة كالتالي:</p>
   $$\\frac{V_2-V_1}{10}+\\frac{V_2-0}{12}-2=0 \\qquad (b)$$
   <p>وبحل هاتين المعادلتين (a) و (b) يمكن إيجاد V<sub>1</sub> و V<sub>2</sub>، ومن ثم يمكن إيجاد قيمة التيار المار في المقاومة 6 أوم حيث يساوي:</p>$$I_2=\\frac{V_1-0}{6}$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (إكمال الحل):</b> بضرب (a) في 30: \\(18V_1-3V_2=120\\)، وبضرب (b) في 60: \\(-6V_1+11V_2=120\\). وبالحل: \\(V_1=9.333\\ \\text{V}\\) و \\(V_2=16\\ \\text{V}\\)، ومنه \\(I_2=9.333/6=1.556\\ \\text{A}\\) من العقدة 1 نحو الإسناد (لأسفل). الحاسبة في تبويب «الأمثلة المحلولة».'},
  {html:'<p>لقد حاولنا من خلال حل أمثلة بسيطة توضيح أسلوب التحليل الحلقي والتحليل العقدي، إلا أن المزايا الفعلية للطريقتين لا تظهر إلا عند التعامل مع دوائر معقدة بعض الشيء. <span class="ref">ص 113</span></p>'},
  {h:'مثال (4-4)',ref:'ص 113–114',html:'<p>من الدائرة الكهربائية الموضحة في الشكل رقم (4-8) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V<sub>1</sub> و V<sub>2</sub>.</p>'},
  {fig:'(4-8)',ref:'ص 113',caption:'بطارية 40 V موجبها نحو العقدة V1، ومن V1 مقاومة 9 Ω إلى الأرضي و 10 Ω إلى V2، ومن V2 مصدر تيار 20 A يغذيها و 2 Ω و 5 Ω إلى الأرضي.',draw:()=>FIG.f48()},
  {html:`<p><b>الحل:</b> العقدة (1) موصلة بعقدة الإسناد عن طريق البطارية 40 V، ولذلك يكون جهد العقدة (1) هو جهد البطارية، حيث قطبها الموجب موصل بالعقدة (1) وطرفها السالب موصل بعقدة الإسناد: <span class="ref">ص 114</span></p>
   $$V_1=40\\ \\text{V} \\qquad (a)$$ <p>العقدة (2) تجمع أربعة أفرع ولذلك يمكن كتابة معادلة الجهد العقدي كالتالي:</p>
   $$\\frac{V_2-V_1}{10}+\\frac{V_2-0}{2}+\\frac{V_2-0}{5}-20=0$$ $$V_2-V_1+5V_2+2V_2-200=0$$ $$8V_2-V_1-200=0 \\qquad (b)$$
   <p>بالتعويض عن قيمة V<sub>1</sub> في المعادلة (b) ينتج أن:</p>$$8V_2=200+40\\;,\\quad 8V_2=240$$ $$V_2=\\frac{240}{8}=30\\ \\text{V}$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في التحليل العقدي عدد المعادلات = عدد العقد ناقص واحد (عقدة الإسناد)، وكل عقدة موصلة بالإسناد عن طريق بطارية وحدها لا تحتاج معادلة (جهدها معروف كما في مثال 4-4). أما في التحليل الحلقي فعدد المعادلات = عدد الحلقات. اختر الطريقة التي تعطيك معادلات أقل.'},
  {note:'التمرينان 2 و 3 من تمارين الوحدة (ص 122) على هذه الطريقة، وتجدهما مع حلول مقترحة في درس «تمارين الوحدة الرابعة».'},
  {err:`<b>ملاحظات على الكتاب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>ص 111: «تكون <b>تالمعادلة</b>» والصحيح «تكون المعادلة»؛ صُححت.</li>
   <li>الشكل (4-6) ص 112، الفرع (أ): طُبع المقام «‎-0» والصحيح <b>10</b> (قيمة المقاومة): \\(I=(V_1-V_3)/10\\)؛ صُحح في الرسم.</li>
   <li>مثال (4-3) ص 112–113: الكتاب لا يكمل الحل عددياً (يتوقف عند \\(I_2=V_1/6\\))؛ أكملناه في ملاحظة «توضيح» وفي الحاسبة. وفي الشكل (4-7) رُسم سهم I<sub>2</sub> على المقاومة 6 Ω <b>لأعلى</b>، بينما الصيغة \\((V_1-0)/6\\) تعطي التيار من العقدة 1 نحو الإسناد، أي لأسفل؛ تركنا السهم كما في الشكل، والتيار الحقيقي (1.556 A) لأسفل.</li>
   <li>مثال (4-4) ص 114: طُبع \\(V_2=240/40=30\\ \\text{V}\\) والصحيح \\(240/8\\)؛ الناتج 30 V صحيح؛ صُحح.</li></ol>`}
 ],
 lab:(el)=>{eqLab(el,{p:'n2',presets:['f47','f48'],based:'مبنية على الشكلين (4-7) ص 112 و(4-8) ص 113',
  steps:st=>[
   {t:'معادلة العقدة 1',x:'في الشكل (4-7) اكتب معادلة العقدة 1 مرتبة: معامل V<sub>1</sub> = مجموع 1/R للفروع الثلاثة، ومعامل V<sub>2</sub> = −1/10، والطرف الأيمن = 12/3 (البطارية موجبها نحو العقدة). يمكنك كتابة <span class="ltr">1/3+1/6+1/10</span> كما هي.',done:()=>st.pk==='f47'&&st.ok[0]},
   {t:'معادلة العقدة 2',x:'اكتب معادلة العقدة 2: مصدر التيار 2 A داخل إلى العقدة فيظهر في الطرف الأيمن موجباً. الحل: V<sub>1</sub> = 9.333 V و V<sub>2</sub> = 16 V (هذا ما لا يكمله الكتاب).',done:()=>st.pk==='f47'&&st.allOk},
   {t:'غيّر مصدر التيار',x:'ضاعف مصدر التيار J1 إلى 4 A أو اقلب اتجاهه بالزر ⇅: الطرف الأيمن لمعادلة العقدة 2 وحده يتغير. صحّح معادلتك وراقب جهدي العقدتين.',done:()=>st.pk==='f47'&&(st.did['edit_f47_J1']||st.did['flip_f47_J1'])&&st.allOk},
   {t:'عقدة جهدها معروف',x:'اختر الشكل (4-8): العقدة 1 موصلة بالإسناد عن طريق البطارية فقط، فمعادلتها V<sub>1</sub> = 40 (اكتب 1 ، 0 ، 40). ثم اكتب معادلة العقدة 2 (الكتاب: 8V<sub>2</sub> − V<sub>1</sub> = 200) لتحصل على V<sub>2</sub> = 30 V.',done:()=>st.pk==='f48'&&st.allOk},
   {t:'لماذا لا تؤثر 9 Ω؟',x:'في الشكل (4-8) غيّر المقاومة R1 (9 Ω) إلى أي قيمة: جهدا العقدتين لا يتغيران لأن البطارية تفرض V<sub>1</sub> = 40 V؛ يتغير فقط تيار R1 وتيار البطارية في جدول الحل.',done:()=>st.pk==='f48'&&st.did['edit_f48_R1']&&st.allOk}
  ]})},
 examples:[
  {title:'مثال (4-3)',ref:'ص 112–113',q:'<p>اكتب معادلتي العقدتين للدائرة المبينة بالشكل (4-7)، ثم أوجد V<sub>1</sub> و V<sub>2</sub> والتيار المار في المقاومة 6 أوم.</p><p class="sub">الكتاب يكتب المعادلتين (a) و (b) وصيغة I<sub>2</sub> ثم يتوقف؛ إكمال الحل في الحاسبة توضيح للمتدرب — ليس من الكتاب.</p>',given:G43,solve:(g)=>solve43(g),
   note:'بأرقام الكتاب: \\(V_1=9.333\\) V، \\(V_2=16\\) V، \\(I_2=1.556\\) A (من الحساب لا من الكتاب). سهم I<sub>2</sub> في الشكل (4-7) مرسوم لأعلى، والتيار الحقيقي لأسفل.'},
  {title:'مثال (4-4)',ref:'ص 113–114',q:'<p>من الدائرة الكهربائية الموضحة في الشكل رقم (4-8) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V<sub>1</sub> و V<sub>2</sub>.</p>',given:G44,solve:(g)=>solve44(g),
   note:'السطر الأخير طُبع في الكتاب «240/40» والصحيح 240/8؛ الناتج 30 V صحيح. المقاومة 9 Ω لا تدخل في الحل لأن البطارية تفرض جهد العقدة 1.'}
 ],
 quiz:[
  {q:'العقدة في الدائرة الكهربائية هي:',o:['أي نقطة على سلك','نقطة تجميع أو تلاقي أكثر من فرعين','طرف البطارية الموجب','منتصف المقاومة'],c:1,e:'ص 111.'},
  {q:'على أي قانون يعتمد التحليل العقدي؟',o:['قانون كيرشوف للجهد','قانون كيرشوف للتيار','قانون لنز','قانون جول'],c:1,e:'ص 112: «يعتمد التحليل العقدي على قانون كيرشوف للتيار».'},
  {q:'يفضل اختيار عقدة الإسناد:',o:['العقدة التي يلتقي فيها أكبر عدد من الأفرع','أصغر عقدة','العقدة الموصلة بالبطارية الموجبة','أي عقدة جهدها أعلى'],c:0,e:'ص 111، وجهدها صفر.'},
  {q:'عند كتابة معادلة عقدة نعتبرها الأعلى جهداً، فيكون:',o:['التيار الداخل موجباً','التيار الخارج موجباً والداخل سالباً','كل التيارات موجبة','كل التيارات سالبة'],c:1,e:'ص 111.'},
  {q:'فرع فيه مقاومة 5 Ω وبطارية 100 V موجبها نحو N2. التيار من N1 إلى N2:',o:['(V1 − V2)/5','(V1 − V2 + 100)/5','(V1 − V2 − 100)/5','(V1 + V2)/5'],c:1,e:'الشكل (4-6ب).'},
  {q:'في مثال (4-4) العقدة 1 موصلة بالإسناد عبر بطارية 40 V فقط. إذن:',o:['V1 = 0','V1 = 40 V مباشرة','V1 = 20 V','نحتاج معادلة كيرشوف للعقدة 1'],c:1,e:'ص 114: جهد العقدة هو جهد البطارية.'},
  {q:'في مثال (4-4) بعد الضرب في 10: 8V<sub>2</sub> = 240. إذن V<sub>2</sub> =',o:['6 V','30 V','24 V','240 V'],c:1,e:'\\(240/8=30\\) V.'},
  {q:'دائرة فيها 4 عقد (منها الإسناد) وليس فيها عقدة جهدها معروف. عدد معادلات التحليل العقدي:',o:['4','3','2','1'],c:1,e:'معادلة لكل عقدة ما عدا الإسناد (ص 111).'}
 ]
});

/* ======================================================================
   Lesson 3 — superposition (ص 114–121)
   ====================================================================== */
const SUPQ=(t)=>`<p>${t}</p>`;
B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'114–121',
 title:'نظرية التركيب (Superposition Theorem)',
 summary:'في الدائرة ذات المصادر المتعددة: التيار في أي عنصر = مجموع التيارات الناتجة عن كل مصدر وحده، مع إخراج باقي المصادر من الخدمة (البطارية قصر ومصدر التيار دائرة مفتوحة). مع الأمثلة (4-5) و(4-6) و(4-7) ومختبر تشغّل فيه كل مصدر وتطفئه.',
 theory:[
  {h:'نظرية التركيب (Superposition Theorem)',ref:'ص 114',html:`<p>هي نظرية المصادر المتعددة المغذية للدائرة، وتستخدم هذه النظرية عندما يوجد <b>أكثر من مصدر تغذية</b> سواء كان مصدر جهد أو مصدر تيار أو كليهما معاً. وتتلخص طريقة نظرية التركيب واستخدامها ضمن تحليل الدائرة الكهربائية كما يلي:</p>
   <ul><li>إذا أردنا إيجاد قيمة التيار الكهربائي المار في عنصر ما في الدائرة فإن هذا التيار يمكن إيجاد قيمته عن طريق <b>حاصل جمع التيارات الكهربائية الناتجة من تغذية الدائرة بكل مصدر على حدة</b> ووضع جميع المصادر الأخرى خارج الخدمة.</li>
   <li>لجعل <b>مصدر الجهد</b> خارج الخدمة يستبدل بمقاومته الداخلية، وحيث إن مقاومته الداخلية أصغر ما يمكن لذلك نعمل عليه <b>قصر دائرة</b> (Short Circuit).</li>
   <li>لجعل <b>مصدر التيار</b> خارج الخدمة يستبدل بمقاومته الداخلية، حيث إنها تكون أكبر ما يمكن، لذلك نعمل عليه <b>فتح دائرة</b> (Open Circuit).</li></ul>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> «الجمع» جبري: نختار اتجاهاً مرجعياً للتيار في العنصر، وكل تيار جزئي في عكسه يُطرح. وتصلح النظرية للتيار والجهد فقط، <b>لا للقدرة</b>: القدرة تحسب من التيار الكلي بعد الجمع (\\(P=I^2R\\))، لا بجمع قدرات الحالات (سترى ذلك رقمياً في المختبر).'},
  {h:'مثال (4-5)',ref:'ص 115–116',html:'<p>احسب التيار المار والجهد عبر المقاومة 6 Ω في الدائرة الموضحة في الشكل (4-9) باستخدام نظرية التركيب.</p>'},
  {fig:'(4-9)',ref:'ص 115',caption:'ثلاثة فروع متوازية: مقاومة 3 Ω مع بطارية 18 V (الموجب لأعلى)، ومصدر تيار 3 A، ومقاومة 6 Ω عليها V (+ أعلى).',draw:()=>FIG.f49()},
  {html:'<p><b>الحل:</b> نأخذ كل مصدر على حدة، وعندئذ نستبدل المصادر غير المستخدمة بمقاومتها الداخلية، وفي الحالات المثالية، عندما لا يكون هنالك ذكر للمقاومات الداخلية، تعد مصادر الجهد دائرة قصيرة ومصادر التيار دائرة مفتوحة. لنأخذ مصدر التيار أولاً ونهمل مصدر الجهد، فتصبح الدائرة كما في الشكل (4-9أ).</p>'},
  {fig:'(4-9أ)',ref:'ص 115',caption:'مصدر التيار وحده: مكان البطارية قصر.',draw:()=>FIG.f49({E1:true},[{id:'R2',d:1,lab:'I1'}])},
  {html:`<p>يتوزع تيار المصدر 3 A بين المقاومتين 6 Ω و 3 Ω. وحيث إن المقاومتين متصلتان معاً على التوازي فإن المقاومة الكلية تساوي:</p>$$R=\\frac{3\\times6}{3+6}=2\\ \\Omega$$
   <p>ويكون الجهد على طرفي الدائرة: <span class="ref">ص 116</span></p>$$V=I\\times R=3\\times2=6\\ \\text{V}$$<p>وعلى هذا فإن تيار المقاومة 6 Ω هو:</p>$$I_1=\\frac{V}{R}=\\frac{6}{6}=1\\ \\text{A}$$
   <p>وعند إهمال مصدر التيار وأخذ مصدر الجهد فقط في الدائرة تصبح الدائرة كما هي في الشكل (4-9ب)، عندئذ يمكن حساب التيار I<sub>2</sub> في المقاومة 6 Ω.</p>`},
  {fig:'(4-9ب)',ref:'ص 116',caption:'البطارية وحدها: فرع مصدر التيار مفتوح، و V2 على المقاومة 6 Ω.',draw:()=>FIG.f49({J1:true},[{id:'R2',d:1,lab:'I2'}])},
  {html:'$$I_2=\\frac{18}{3+6}=2\\ \\text{A}$$<p>وأن الجهد على طرفي المقاومة هو:</p>$$V_2=2\\times6=12\\ \\text{V}$$<p>وهكذا فإن تأثير المصدرين في التيار والجهد للمقاومة 6 Ω يكون:</p>$$I=I_1+I_2=1+2=3\\ \\text{A}$$ $$V=6+12=18\\ \\text{V}$$'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (تحقق بالتحليل العقدي):</b> \\(\\frac{V-18}{3}+\\frac{V}{6}-3=0\\Rightarrow V=18\\ \\text{V}\\) و \\(I=18/6=3\\ \\text{A}\\) ✓.'},
  {h:'مثال (4-6)',ref:'ص 116–118',html:'<p>حل الدائرة (4-10) للحصول على التيار I باستخدام نظرية التركيب.</p>'},
  {fig:'(4-10)',ref:'ص 117',caption:'سلّم من ثلاث حلقات: بطارية 10 V يساراً، و 6 Ω ثم 1 Ω رأسية، و 2 Ω ثم 3 Ω رأسية، ثم 10 Ω بين a و b وعليها I لأسفل، وبطارية 20 V على الخط السفلي موجبها نحو b.',draw:()=>FIG.f410({},[{id:'R5',d:1,lab:'I'}],true)},
  {html:'<p>وبالرجوع لنظرية التركيب فإننا نوجد التيار الناشئ عن كل منبع على حدة (وذلك مع عدم وجود المنابع الأخرى، أي تقصر كل المنابع الأخرى)، ويكون التيار المطلوب مجموع هذه التيارات. ولحساب التيار الناشئ عن المصدر 10 V نحذف المصدر 20 V وذلك باستبداله بدائرة قصر، وفي هذه الحالة فإن الدائرة تأخذ الشكل (4-10أ). وبتجميع المقاومات نجد أن التيار I<sub>1</sub> قيمته 0.0636 A.</p>'},
  {fig:'(4-10أ)',ref:'ص 117',caption:'المصدر 10 V وحده (مكان 20 V سلك)، و I1 في 10 Ω لأسفل.',draw:()=>FIG.f410({E2:true},[{id:'R5',d:1,lab:'I1'}])},
  {html:'<p>وبعد ذلك نحذف المنبع 10 V، الدائرة الشكل (4-10ب)، ومنها نحصل على التيار I<sub>2</sub>:</p>'},
  {fig:'(4-10ب)',ref:'ص 117',caption:'المصدر 20 V وحده (مكان 10 V سلك)، و I2 في 10 Ω.',draw:()=>FIG.f410({E1:true},[{id:'R5',d:1,lab:'I2'}])},
  {html:'<p><span class="ref">ص 118</span></p>$$I_1=0.0636\\ \\text{A}\\qquad I_2=1.744\\ \\text{A}$$<p>ولذلك</p>$$I=I_1+I_2=0.0636-1.744=-1.68\\ \\text{A}$$'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (خطوات تجميع المقاومات):</b> للمصدر 10 V: \\(3\\parallel10=2.308\\)، ثم \\(+2=4.308\\)، ثم \\(\\parallel1=0.812\\)، ثم \\(+6=6.812\\ \\Omega\\)؛ تيار المصدر \\(10/6.812=1.468\\) A، وبتوزيع التيار حتى المقاومة 10 Ω: \\(I_1=0.0638\\) A لأسفل. وللمصدر 20 V: البطارية على التوالي مع 10 Ω، وباقي الدائرة \\((6\\parallel1+2)\\parallel3=1.463\\ \\Omega\\)، فيكون \\(I_2=20/11.463=1.745\\) A في عكس اتجاه I (لأن موجب البطارية نحو b). لذلك يُطرح I<sub>2</sub>، والنتيجة السالبة تعني أن التيار الحقيقي في 10 Ω نحو 1.68 A من b إلى a.'},
  {h:'مثال (4-7)',ref:'ص 118–121',html:'<p>أوجد التيار الذي يمر في كل بطارية من البطاريات الموجودة في الشكل (4-11) باستعمال طريقة التركيب.</p>'},
  {fig:'(4-11)',ref:'ص 118',caption:'ثلاثة فروع بين العقدتين a و b: الأيسر 15 Ω + 30 Ω + بطارية 120 V (الموجب لأسفل) + 15 Ω؛ الأوسط 40 Ω + بطارية 240 V (الموجب لأعلى)؛ الأيمن 10 Ω + 20 Ω + بطارية 60 V (الموجب لأعلى) + 10 Ω.',draw:()=>FIG.f411({},[{id:'E1',d:1,lab:'I1'},{id:'E2',d:1,lab:'I2'},{id:'E3',d:1,lab:'I3'}])},
  {html:'<p><b>الحل:</b> لحل هذه المسألة بطريقة التركيب نفرض وجود مصدر كهربائي واحد ونحذف المصدرين الآخرين ونحسب التيارات في الفروع المختلفة، وبعد تكرار هذه العملية لكل مصدر نقوم بجمع التيارات الناتجة في كل فرع للحصول على التيارات المطلوبة:</p><p><b>أ- المصدر الكهربائي (120 V)</b> كما في الشكل (4-11أ).</p>'},
  {fig:'(4-11أ)',ref:'ص 119',caption:'المصدر 120 V وحده: البطاريتان الأخريان قصر.',draw:()=>FIG.f411({E2:true,E3:true},[{id:'E1',d:1,lab:"I1'"},{id:'R4',d:-1,lab:"I2'"},{id:'R6',d:-1,lab:"I3'"}])},
  {html:`<p>لحساب \\(I_1'\\) نحسب المقاومة الكلية للدائرة:</p>$$R'=10+20+10=40\\ \\Omega$$<p>وهذه المقاومة متصلة مع المقاومة الأخرى (مقاومتين على التوازي ومتساويتين):</p>$$R_{ab}=\\frac{40}{2}=20\\ \\Omega$$<p>وتكون المقاومة الكلية هي:</p>$$R=20+15+15+30=80\\ \\Omega$$ $$I_1'=\\frac{120}{80}=1.5\\ \\text{A}$$
   <p>ولحساب \\(I_2'\\) نحسب فرق الجهد بين الطرفين a و b:</p>$$V_{ab}=I_1'\\times R_{ab}=1.5\\times20=30\\ \\text{V}$$ $$I_2'=\\frac{30}{40}=0.75\\ \\text{A}\\qquad I_3'=\\frac{30}{40}=0.75\\ \\text{A}$$
   <p><b>ب- المصدر الكهربائي (240 V)</b> في الشكل (4-11ب): باتباع الطريقة السابقة نفسها نحصل على:</p>$$I_1''=1.5\\ \\text{A}\\qquad I_2''=3.75\\ \\text{A}\\qquad I_3''=2.25\\ \\text{A}$$`},
  {fig:'(4-11ب)',ref:'ص 120',caption:'المصدر 240 V وحده في الفرع الأوسط.',draw:()=>FIG.f411({E1:true,E3:true},[{id:'R2',d:1,lab:"I1''"},{id:'E2',d:1,lab:"I2''"},{id:'R6',d:1,lab:"I3''"}])},
  {html:'<p><b>ج- المصدر الكهربائي (60 V)</b> كما في الشكل (4-11ج): باتباع الطريقة نفسها نحصل على:</p>$$I_1\'\'\'=0.375\\ \\text{A}\\qquad I_2\'\'\'=0.562\\ \\text{A}\\qquad I_3\'\'\'=0.937\\ \\text{A}$$'},
  {fig:'(4-11ج)',ref:'ص 120',caption:'المصدر 60 V وحده في الفرع الأيمن (المقاومتان العلويتان 15 Ω و 10 Ω كما في الشكل الأصلي).',draw:()=>FIG.f411({E1:true,E2:true},[{id:'R2',d:1,lab:"I1'''"},{id:'R4',d:1,lab:"I2'''"},{id:'E3',d:1,lab:"I3'''"}])},
  {html:`<p>وللحصول على التيارات في الفروع الثلاثة يجب جمع التيارات الجزئية الثلاثة في كل فرع <b>جمعاً جبرياً</b>:</p>
   $$I_1=I_1'+I_1''+I_1'''=1.5+1.5+0.375=3.375\\ \\text{A}$$ $$I_2=I_2'+I_2''+I_2'''=0.75+3.75-0.562=3.938\\ \\text{A}$$
   <p>يلاحظ أن \\(I_2'''\\) اعتُبر سالباً لأنه في عكس اتجاه التيارين \\(I_2'\\) و \\(I_2''\\) اللذين اعتُبرا موجبين، كما أن التيار الكلي I<sub>2</sub> في اتجاه التيارين \\(I_2'\\) و \\(I_2''\\). <span class="ref">ص 121</span></p>
   $$I_3=I_3'+I_3''+I_3'''=0.75-2.25+0.937=-0.563\\ \\text{A}$$
   <p>ولما كانت القيمة التي حصلنا عليها للتيار I<sub>3</sub> سالبة، كان معنى هذا أنه في اتجاه الجزء الذي اعتُبر سالباً وهو \\(I_3''\\).</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (تحقق بالتحليل العقدي، b = 0):</b> \\(V_a=82.5\\ \\text{V}\\)، فيكون تيار الفرع الأيسر 3.375 A لأسفل، والأوسط 3.9375 A لأعلى، والأيمن 0.5625 A لأسفل، و KCL عند a: \\(3.9375=3.375+0.5625\\) ✓. القيم الدقيقة 0.5625 و 0.9375 والكتاب كتبها بثلاثة أرقام عشرية دون تقريب (0.562 و 0.937)، والحاسبة تعيد ذلك.'},
  {err:`<b>ملاحظات على الكتاب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li><b>مثال (4-6) ص 117–118:</b> القيمتان المطبوعتان \\(I_1=0.0636\\) A و \\(I_2=1.744\\) A، والحساب الدقيق 0.0638 A و 1.745 A، فيكون \\(I=-1.681\\) A (الكتاب −1.68). في تبويب «الأمثلة المحلولة» مفتاح «كما في الكتاب / المصحح». والكتاب لا يبين خطوات «تجميع المقاومات» (أضفناها في «توضيح»).</li>
   <li>مثال (4-6): كُتب \\(I=I_1+I_2=0.0636-1.744\\): أي أن I<sub>2</sub> أُخذ سالباً لأنه عكس اتجاه I (لم يُذكر ذلك صراحة). والجملة «و منها على التيار I2» ناقصة (المقصود «ومنها نحصل على التيار I2»)؛ صُححت. وفي الشكل (4-10ب) كُتب على السهم «I1» والمقصود <b>I2</b>؛ صُحح في الرسم.</li>
   <li><b>مثال (4-7):</b> في الأشكال (4-11) و(4-11أ) و(4-11ج) رُسم سهم تيار الفرع الأيمن (I<sub>3</sub> و \\(I_3'\\) و \\(I_3'''\\)) لأسفل، بينما الجمع في ص 121 يعدّ تيار هذا الفرع موجباً <b>لأعلى</b> (\\(I_3'\\) و \\(I_3'''\\) لأعلى فعلاً و \\(I_3''\\) لأسفل). رسمنا هذه الأسهم لأعلى لتوافق الجمع، فتكون النتيجة \\(I_3=-0.563\\) A أي 0.563 A لأسفل كما يقول الكتاب. وكذلك سهم \\(I_2'''\\) لأسفل كما في الكتاب.</li>
   <li>الشكل (4-11ج) ص 120: قيمتا المقاومتين العلويتين غير مكتوبتين، وهما 15 Ω و 10 Ω كما في الشكل الأصلي؛ كُتبتا في الرسم.</li></ol>`}
 ],
 lab:(el)=>{supLab(el,{p:'s3',presets:['f49','f410s','f411'],based:'مبنية على الأشكال (4-9) ص 115 و(4-10) ص 117 و(4-11) ص 118',
  tblNote:st=>st.pk==='f411'?'<p class="sub">في الفرع الأيمن الموجب لأعلى (كما في جمع الكتاب ص 121)، فالنتيجة السالبة تعني تياراً لأسفل.</p>':st.pk==='f410s'?'<p class="sub">الموجب في 10 Ω لأسفل (من a إلى b) كما في سهم I بالشكل (4-10).</p>':'',
  steps:st=>{const only=(pk,ids)=>st.pk===pk&&st.cur===ids.slice().sort().join(',');return [
   {t:'مصدر التيار وحده',x:'في الشكل (4-9) أخرج البطارية 18 V من الخدمة (تصبح قصراً) وأبقِ مصدر التيار: التيار في المقاومة 6 Ω = 1 A والجهد 6 V، كما في الشكل (4-9أ).',done:()=>only('f49',['J1'])},
   {t:'البطارية وحدها',x:'أعد البطارية إلى الخدمة وأخرج مصدر التيار (يصبح دائرة مفتوحة): 2 A و 12 V، كما في الشكل (4-9ب).',done:()=>only('f49',['E1'])},
   {t:'المصدران معاً',x:'شغّل المصدرين: 3 A = 1 + 2 و 18 V = 6 + 12. وانظر تحت الجدول: القدرة لا تُجمع.',done:()=>only('f49',['E1','J1'])&&st.did['f49:J1']&&st.did['f49:E1']},
   {t:'الشكل (4-10)',x:'اختر الشكل (4-10) وجرّب كل بطارية وحدها: 10 V تعطي في 10 Ω نحو 0.0638 A لأسفل، و 20 V تعطي 1.745 A لأعلى (سالب)، والمجموع −1.681 A.',done:()=>st.pk==='f410s'&&st.did['f410s:E1']&&st.did['f410s:E2']},
   {t:'الشكل (4-11): 240 V وحدها',x:'اختر الشكل (4-11) واترك 240 V وحدها في الخدمة، ثم اختر العنصر «بطارية 120 V» ثم «بطارية 60 V»: I<sub>2</sub>" = 3.75 A و I<sub>1</sub>" = 1.5 A و I<sub>3</sub>" = −2.25 A (لأسفل).',done:()=>only('f411',['E2'])},
   {t:'الجمع الجبري',x:'شغّل المصادر الثلاثة: I<sub>1</sub> = 3.375 A، و I<sub>2</sub> = 3.9375 A، و I<sub>3</sub> = −0.5625 A (أي 0.5625 A لأسفل)، وهي نتائج الكتاب (بثلاثة أرقام عشرية).',done:()=>only('f411',['E1','E2','E3'])&&st.did['f411:E2']}
  ]}})},
 examples:[
  {title:'مثال (4-5)',ref:'ص 115–116',q:SUPQ('احسب التيار المار والجهد عبر المقاومة 6 Ω في الدائرة الموضحة في الشكل (4-9) باستخدام نظرية التركيب.'),given:G45,solve:(g)=>solve45(g)},
  {title:'مثال (4-6)',ref:'ص 116–118',get q(){return SUPQ('حل الدائرة (4-10) للحصول على التيار I (في المقاومة 10 Ω من a إلى b) باستخدام نظرية التركيب.')+bkSeg('e46')+'<p class="sub">«كما في الكتاب»: القيم المطبوعة 0.0636 و 1.744 و −1.68. «المصحح»: 0.0638 و 1.745 و −1.681.</p>'},given:G46,solve:solve46,
   note:'<b>ملاحظة على الكتاب:</b> الكتاب يعطي النتائج دون خطوات التجميع؛ الخطوات في الحاسبة توضيح للمتدرب. القيمتان المطبوعتان 0.0636 و 1.744 تختلفان قليلاً عن الحساب الدقيق 0.0638 و 1.745.'},
  {title:'مثال (4-7)',ref:'ص 118–121',q:SUPQ('أوجد التيار الذي يمر في كل بطارية من البطاريات الموجودة في الشكل (4-11) باستعمال طريقة التركيب.')+'<p class="sub">الاتجاهات الموجبة كما في جمع الكتاب: الفرع الأيسر لأسفل، والأوسط لأعلى، والأيمن لأعلى. التيارات الجزئية تُكتب بثلاثة أرقام عشرية دون تقريب كما في الكتاب.</p>',given:G47,solve:(g)=>solve47(g),
   note:'القيم الدقيقة: \\(I_2\'\'\'=0.5625\\)، \\(I_3\'\'\'=0.9375\\)، \\(I_2=3.9375\\)، \\(I_3=-0.5625\\) A. في الشكل (4-11) رُسم سهم I<sub>3</sub> لأسفل بينما الجمع يعدّه موجباً لأعلى (راجع ملاحظات الشرح).'}
 ],
 quiz:[
  {q:'متى نستخدم نظرية التركيب؟',o:['عندما يوجد مصدر واحد','عندما يوجد أكثر من مصدر تغذية','في دوائر التوالي فقط','عندما لا توجد مقاومات'],c:1,e:'ص 114.'},
  {q:'لجعل مصدر الجهد (البطارية) خارج الخدمة:',o:['نفتح الدائرة مكانه','نعمل عليه قصر دائرة','نضاعف جهده','نعكس قطبيته'],c:1,e:'ص 114: مقاومته الداخلية أصغر ما يمكن.'},
  {q:'لجعل مصدر التيار خارج الخدمة:',o:['نعمل عليه قصراً','نفتح الدائرة مكانه','نتركه كما هو','نضع مكانه بطارية'],c:1,e:'ص 114: مقاومته الداخلية أكبر ما يمكن.'},
  {q:'في مثال (4-5): مصدر التيار وحده يعطي 1 A في 6 Ω، والبطارية وحدها 2 A في نفس الاتجاه. التيار الكلي:',o:['1 A','2 A','3 A','−1 A'],c:2,e:'\\(I=1+2=3\\) A.'},
  {q:'في مثال (4-5) مصدر التيار 3 A وحده والمقاومتان 3 Ω و 6 Ω على التوازي. الجهد على طرفيهما:',o:['18 V','9 V','6 V','2 V'],c:2,e:'\\(R=2\\ \\Omega\\)، \\(V=3\\times2=6\\) V.'},
  {q:'تيار جزئي اتجاهه عكس الاتجاه المرجعي للعنصر:',o:['يُهمل','يُجمع موجباً','يُطرح (يؤخذ بإشارة سالبة)','يُضرب في 2'],c:2,e:'الجمع جبري (مثال 4-7: I<sub>2</sub>\'\'\' اعتبر سالباً).'},
  {q:'في مثال (4-6) كانت النتيجة I = −1.68 A. معنى الإشارة السالبة:',o:['خطأ في الحل','التيار الحقيقي عكس اتجاه السهم I','المقاومة سالبة','لا يمر تيار'],c:1,e:'التيار في 10 Ω من b إلى a.'},
  {q:'مقاومة 6 Ω يمر فيها 1 A من مصدر و 2 A من مصدر آخر في نفس الاتجاه. قدرتها الحقيقية:',o:['6 W','24 W','30 W','54 W'],c:3,e:'توضيح: القدرة من التيار الكلي \\(3^2\\times6=54\\) W، لا \\(6+24=30\\) W.'}
 ]
});

/* ======================================================================
   Lesson 4 — unit 4 exercises (ص 122)
   ====================================================================== */
B.lesson({
 id:'u4-l4',unit:4,order:4,pages:'122',
 title:'تمارين الوحدة الرابعة',
 summary:'تمارين الوحدة الثلاثة (ص 122) بأشكالها: تمرين على التحليل الحلقي وتمرينان على التحليل العقدي، مع حلول مقترحة وحاسبات، ومختبر تكتب فيه معادلاتك وإجابتك النهائية فيتحقق منها.',
 theory:[
  {h:'تمارين على الوحدة الرابعة',ref:'ص 122',html:`<p class="sub">الكتاب لا يعطي إجابات. اضغط على التمرين لترى حلاً مقترحاً بطريقة أمثلة الكتاب. الحاسبات في تبويب «الأمثلة المحلولة»، وفي «المختبر» تكتب معادلاتك وإجابتك فيتحقق منها.</p>
   <p><b>1.</b> من الدائرة الكهربائية الموضحة في الشكل رقم (1) وباستخدام طريقة المسارات المغلقة (التحليل الحلقي) أوجد قيمة التيارات I<sub>1</sub> و I<sub>2</sub>.</p>
   <figure class="fig">${FIG.f44()}<figcaption>الشكل (1) — ص 122 (مطابق للشكل 4-4).</figcaption></figure>
   ${Q('التمرين 1','الحل المقترح','الدائرة هي نفسها دائرة المثال (4-2). مع عقارب الساعة: \\(20=15I_1-3I_2\\) (a) و \\(30=-3I_1+12I_2\\) (b). بضرب (b) في 5 والجمع: \\(170=57I_2\\Rightarrow I_2=2.98\\) A، ثم \\(I_1=(20+3\\times2.98)/15=1.929\\) A (بدون تقريب: \\(I_1=1.930\\) و \\(I_2=2.982\\) A). وتيار الفرع الأوسط \\(I_2-I_1\\approx1.05\\) A لأعلى.')}
   <p style="margin-top:16px"><b>2.</b> من الدائرة الكهربائية الموضحة في الشكل رقم (2) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V<sub>1</sub> و V<sub>2</sub>.</p>
   <figure class="fig">${FIG.ex2()}<figcaption>الشكل (2) — ص 122: مثل الشكل (4-8) بدون المقاومة 2 Ω.</figcaption></figure>
   ${Q('التمرين 2','الحل المقترح','بطريقة مثال (4-4): العقدة 1 موصلة بالإسناد عن طريق البطارية فقط، فـ \\(V_1=40\\) V. العقدة 2: \\(\\frac{V_2-V_1}{10}+\\frac{V_2-0}{5}-20=0\\)، وبالضرب في 10: \\(V_2-V_1+2V_2-200=0\\Rightarrow 3V_2=240\\Rightarrow V_2=80\\) V.')}
   <p style="margin-top:16px"><b>3.</b> من الدائرة الكهربائية الموضحة في الشكل رقم (3) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V<sub>1</sub> و V<sub>2</sub>.</p>
   <figure class="fig">${FIG.ex3()}<figcaption>الشكل (3) — ص 122: فرع 4 Ω ثم بطارية 40 V (الموجب لأعلى) يتصل بالعقدة V1، ومنها 5 Ω إلى الأرضي و 2 Ω إلى V2، ومن V2 مصدر تيار 15 A يغذيها و 4 Ω إلى الأرضي.</figcaption></figure>
   ${Q('التمرين 3','الحل المقترح','بطريقة مثال (4-3): العقدة 1: \\(\\frac{V_1-40}{4}+\\frac{V_1-0}{5}+\\frac{V_1-V_2}{2}=0\\)، وبالضرب في 20: \\(19V_1-10V_2=200\\). العقدة 2: \\(\\frac{V_2-V_1}{2}+\\frac{V_2-0}{4}-15=0\\)، وبالضرب في 4: \\(-2V_1+3V_2=60\\). بالحل: \\(V_1=1200/37=32.432\\) V و \\(V_2=41.622\\) V.')}`},
  {note:'<b>طريقة الحل المقترحة:</b> الحلول بنفس خطوات أمثلة الكتاب وتقريبه: التمرين 1 مثل المثال (4-2)، والتمرين 2 مثل المثال (4-4)، والتمرين 3 مثل المثال (4-3).'}
 ],
 lab:(el)=>{eqLab(el,{p:'x4',presets:['ex1','ex2','ex3'],answers:true,based:'تحقق من إجابتك: الأشكال (1) و(2) و(3) ص 122',
  steps:st=>[
   {t:'التمرين 1',x:'اختر «التمرين 1» واكتب معادلتي الحلقتين ثم إجابتك النهائية لـ I<sub>1</sub> و I<sub>2</sub> في خانتي «إجابتك النهائية».',done:()=>st.pk==='ex1'&&st.ansOk&&st.ansOk.length===2&&st.ansOk.every(Boolean)},
   {t:'التمرين 2',x:'اختر «التمرين 2»: جهد العقدة 1 تفرضه البطارية. اكتب المعادلتين ثم إجابتك لـ V<sub>1</sub> و V<sub>2</sub>.',done:()=>st.pk==='ex2'&&st.ansOk&&st.ansOk.length===2&&st.ansOk.every(Boolean)},
   {t:'التمرين 3',x:'اختر «التمرين 3» واكتب معادلتي العقدتين ثم إجابتك لـ V<sub>1</sub> و V<sub>2</sub>.',done:()=>st.pk==='ex3'&&st.ansOk&&st.ansOk.length===2&&st.ansOk.every(Boolean)},
   {t:'تحقق من طريقتك',x:'إذا اختلفت إجابتك فاضغط «أظهر المعادلات الصحيحة» وقارن بمعادلاتك سطراً سطراً: المختبر يلوّن المعامل الخاطئ بالأحمر ويذكر السبب.'}
  ]})},
 examples:[
  {title:'التمرين 1 — حل مقترح (ليس من الكتاب)',ref:'ص 122',q:'<p>«من الدائرة الكهربائية الموضحة في الشكل رقم (1) وباستخدام طريقة المسارات المغلقة (التحليل الحلقي) أوجد قيمة التيارات I1 و I2». الشكل (1) هو الشكل (4-4).</p>',given:G42,solve:(g)=>solve42(g),note:'<b>حل مقترح (ليس من الكتاب)</b> بطريقة مثال (4-2) وتقريبه.'},
  {title:'التمرين 2 — حل مقترح (ليس من الكتاب)',ref:'ص 122',q:'<p>«من الدائرة الكهربائية الموضحة في الشكل رقم (2) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V1 و V2».</p>',given:GX2,solve:(g)=>solveX2(g),note:'<b>حل مقترح (ليس من الكتاب)</b> بطريقة مثال (4-4).'},
  {title:'التمرين 3 — حل مقترح (ليس من الكتاب)',ref:'ص 122',q:'<p>«من الدائرة الكهربائية الموضحة في الشكل رقم (3) وباستخدام طريقة التحليل العقدي أوجد قيمة جهود العقد V1 و V2».</p>',given:GX3,solve:(g)=>solveX3(g),note:'<b>حل مقترح (ليس من الكتاب)</b> بطريقة مثال (4-3).'}
 ],
 quiz:[
  {q:'في التمرين 1 (الشكل 4-4) عدد المعادلات اللازمة بالتحليل الحلقي:',o:['1','2','3','4'],c:1,e:'حلقتان ← معادلتان.'},
  {q:'في التمرين 2 جهد العقدة 1:',o:['0 V','40 V (تفرضه البطارية)','80 V','20 V'],c:1,e:'العقدة موصلة بالإسناد عبر البطارية فقط (كمثال 4-4).'},
  {q:'في التمرين 2 معادلة العقدة 2 بعد الضرب في 10: 3V<sub>2</sub> = 240. إذن V<sub>2</sub> =',o:['24 V','30 V','80 V','720 V'],c:2,e:'\\(240/3=80\\) V.'},
  {q:'في التمرين 3 الفرع (4 Ω + بطارية 40 V موجبها نحو العقدة 1). تيار هذا الفرع الخارج من العقدة 1:',o:['(V1 + 40)/4','(V1 − 40)/4','V1/4','40/4'],c:1,e:'الموجب نحو العقدة: \\((V_1-40)/4\\) (الشكل 4-6ج).'},
  {q:'مصدر تيار 15 A داخل إلى العقدة 2. يظهر في معادلة «مجموع التيارات الخارجة = 0» بالشكل:',o:['+15','−15','لا يظهر','15/R'],c:1,e:'التيار الداخل يأخذ إشارة سالبة (ص 111).'},
  {q:'أي طريقة أنسب لدائرة فيها حلقتان وعقدتان غير الإسناد؟',o:['الحلقي فقط','العقدي فقط','كلتاهما تعطي معادلتين','لا تصلح أي منهما'],c:2,e:'توضيح: عدد المعادلات متساوٍ في الطريقتين هنا.'}
 ]
});

})(PLCBOOK);
