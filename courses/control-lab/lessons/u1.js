/* Unit 1 — أساسيات برنامج MATLAB (ص 3–8)
   Lesson u1-l1 = التجربة الأولى: شرح استخدام برنامج MATLAB (with the book's تمهيد ص 3 and the unit cover ص 4).
   Lab: an in-page mini MATLAB console that understands exactly the book's commands
   (row-vector polynomials, roots, tf / Tf, step, rlocus, clf, clc) with a figure window, plus a small Simulink
   page (Step → Transfer Fcn → Scope) that is built, simulated and shown on the Scope.
   No illustrative physical numbers here: everything comes from the book or from MATLAB/Simulink defaults,
   so this lab has no «قيم المدرب» panel. */
(function(B){
const {S}=B;
const PI=Math.PI;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('cl1-css'))return;const s=document.createElement('style');s.id='cl1-css';s.textContent=`
.cl-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.cl-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.cl-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
pre.cl-code{direction:ltr;text-align:left;font-family:var(--mono);font-size:13.5px;background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin:8px 0;overflow-x:auto;white-space:pre}
.cl-con{direction:ltr;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:10px;font-family:var(--mono);font-size:13px;min-width:0}
.cl-out{height:300px;overflow:auto;padding:8px 10px;line-height:1.45}
.cl-out .ln{white-space:pre;min-height:1.2em}
.cl-out .ln.cmd{color:var(--blue-ink);font-weight:600}
.cl-out .ln.err{color:var(--stop);white-space:pre-wrap}
.cl-out .ln.note{direction:rtl;text-align:right;white-space:normal;font-family:var(--font);font-size:13px;color:var(--fg);background:var(--live-soft);border-radius:8px;padding:4px 10px;margin:4px 0}
.cl-out .ln.hint{direction:rtl;text-align:right;white-space:normal;font-family:var(--font);font-size:13px;color:var(--muted)}
.cl-inrow{display:flex;align-items:center;gap:6px;border-top:1px solid var(--line);padding:6px 8px}
.cl-inrow b{color:var(--muted)}
.cl-inrow input{flex:1;min-width:0;font:inherit;font-size:14px;border:0;background:transparent;color:var(--fg);outline:none;padding:4px 0}
.cl-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.cl-chips .btn{font-family:var(--mono);direction:ltr;padding:4px 9px;font-size:12.5px}
.cl-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cl-row .sub{margin:0}
.cl-fig{background:var(--surface);border:1px solid var(--line);border-radius:10px;margin-top:10px;overflow:hidden}
.cl-fig .bar{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:12px;color:var(--muted);background:var(--surface-2);padding:4px 10px;direction:ltr}
.cl-ws{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px;direction:ltr}
.cl-ws th,.cl-ws td{border-bottom:1px solid var(--line);padding:4px 6px;text-align:left;font-family:var(--mono)}
.cl-ws th{font-family:var(--font);color:var(--muted);font-weight:600}
.cl-lib{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.cl-lib div{border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--surface-2);min-width:120px}
.cl-lib small{display:block;color:var(--muted);font-family:var(--mono);direction:ltr;text-align:left}
.cl-lib .btn{margin-top:4px;font-family:var(--mono);direction:ltr}
.cl-lib .btn[disabled]{opacity:.5;cursor:default}
.cl-par{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:10px}
.cl-par label{display:flex;flex-direction:column;gap:2px;font-size:13px}
.cl-par label span{color:var(--muted)}
.cl-par input{font-family:var(--mono);direction:ltr;font-size:14px;padding:5px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg);min-width:0}
.cl-scope{background:var(--lcd);border-radius:10px;padding:4px;margin-top:10px}
.cl-try{margin:6px 0 0;padding-inline-start:20px}
.cl-slk svg .blk{cursor:pointer}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local copies, as in the other courses) ---------- */
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب دوالاً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let m=false;while(i<steps.length&&steps[i].done&&steps[i].done()){i++;m=true}if(m)draw()},redraw:draw};}
const Q=(n,q,ans)=>`<details class="cl-q"><summary>${n}: ${q}</summary><div class="cl-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const code=s=>`<pre class="cl-code">${esc(s)}</pre>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
function arrow(x1,y1,x2,y2,col,w){w=w||2;const a=Math.atan2(y2-y1,x2-x1),h=9;const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}

/* ---------- complex numbers & polynomials ---------- */
const C=(re,im)=>({re,im:im||0}),cadd=(a,b)=>C(a.re+b.re,a.im+b.im),csub=(a,b)=>C(a.re-b.re,a.im-b.im),cmul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im||1e-300;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},cabs=a=>Math.hypot(a.re,a.im);
function peval(a,z){let r=C(a[0]);for(let i=1;i<a.length;i++)r=cadd(cmul(r,z),C(a[i]));return r}
const strip0=c=>{c=c.slice();while(c.length>1&&c[0]===0)c.shift();return c};
/* roots of a real polynomial (highest power first), MATLAB order: roots at zero first, then by decreasing size */
function proots(c0){
  let c=c0.map(Number);while(c.length&&c[0]===0)c.shift();
  const out=[];let nz=0;while(c.length>1&&c[c.length-1]===0){c.pop();nz++}
  const n=c.length-1;let z=[];
  if(n===1)z=[C(-c[1]/c[0])];
  else if(n===2){const a=c[0],b=c[1],cc=c[2],D=b*b-4*a*cc;
    if(Math.abs(D)<=1e-14*Math.max(b*b,Math.abs(4*a*cc),1e-300))z=[C(-b/(2*a)),C(-b/(2*a))];
    else if(D>0){const q=-0.5*(b+Math.sign(b||1)*Math.sqrt(D));z=[C(q/a),C(cc/q)]}
    else z=[C(-b/(2*a),Math.sqrt(-D)/(2*a)),C(-b/(2*a),-Math.sqrt(-D)/(2*a))]}
  else if(n>2){const a=c.map(v=>v/c[0]);const R=1+Math.max(...a.slice(1).map(Math.abs));
    z=Array.from({length:n},(_,k)=>C(0.6*R*Math.cos(2*PI*k/n+0.4),0.6*R*Math.sin(2*PI*k/n+0.4)));
    for(let it=0;it<3000;it++){let mx=0;for(let i=0;i<n;i++){let den=C(1);for(let j=0;j<n;j++)if(j!==i){let df=csub(z[i],z[j]);if(cabs(df)<1e-300)df=C(1e-12,1e-12);den=cmul(den,df)}
      const d=cdiv(peval(a,z[i]),den);z[i]=csub(z[i],d);mx=Math.max(mx,cabs(d))}if(mx<1e-16*R)break}}
  const cl=z.map(r=>{let re=r.re,im=r.im;const m=Math.max(1,Math.abs(re),Math.abs(im));if(Math.abs(im)<1e-8*m)im=0;
    if(Math.abs(re-Math.round(re))<1e-9*m)re=Math.round(re);if(Math.abs(im-Math.round(im))<1e-9*m)im=Math.round(im);return C(re,im)});
  /* force exact conjugate pairs */
  cl.forEach(r=>{if(r.im>0){const k=cl.findIndex(q=>q!==r&&q.im<0&&Math.abs(q.re-r.re)<1e-6*Math.max(1,Math.abs(r.re))&&Math.abs(q.im+r.im)<1e-6*Math.max(1,r.im));if(k>=0){const re=(r.re+cl[k].re)/2,im=(r.im-cl[k].im)/2;r.re=re;r.im=im;cl[k].re=re;cl[k].im=-im}}});
  cl.sort((p,q)=>(cabs(q)-cabs(p))||(q.im-p.im));
  for(let i=0;i<nz;i++)out.push(C(0,0));
  return out.concat(cl)}
const pad=(c,N)=>{const r=c.slice();while(r.length<N)r.unshift(0);return r};

/* ---------- MATLAB-style text formatting ---------- */
const isInt=v=>Math.abs(v-Math.round(v))<1e-9*Math.max(1,Math.abs(v));
const f4=v=>{const s=(Math.abs(v)<5e-5?0:v).toFixed(4);return s==='-0.0000'?'0.0000':s};
function fmtRow(v){if(!v.length)return '     []';const allI=v.every(isInt);return v.map(x=>allI?String(Math.round(x)).padStart(6):f4(x).padStart(10)).join('')}
function fmtCol(z){const allI=z.every(r=>r.im===0&&isInt(r.re));
  const re=z.map(r=>allI?String(Math.round(r.re)):f4(r.re));const w=Math.max(...re.map(s=>s.length));
  return z.map((r,i)=>'   '+re[i].padStart(w)+(r.im!==0?(r.im>0?' + ':' - ')+f4(Math.abs(r.im))+'i':'')).join('\n')}
const gnum=v=>{if(isInt(v))return String(Math.round(v));return String(+v.toPrecision(5))};
function polyStr(c){c=strip0(c);const N=c.length-1;let s='';c.forEach((a,i)=>{if(a===0)return;const p=N-i,neg=a<0,m=Math.abs(a);
  const coef=(m===1&&p>0)?'':gnum(m)+(p>0?' ':'');const term=coef+(p>1?'s^'+p:p===1?'s':'');
  s+=s?(neg?' - ':' + ')+term:(neg?'-':'')+term});return s||'0'}
function tfText(n,d){const a=polyStr(n),b=polyStr(d),L=Math.max(a.length,b.length);const cen=s=>' '.repeat(Math.floor((L-s.length)/2))+s;
  return ` \n  ${cen(a)}\n  ${'-'.repeat(L)}\n  ${cen(b)}\n \nContinuous-time transfer function.`}

/* ---------- linear simulation of n(s)/d(s) (controllable canonical form, RK4) ---------- */
function simTF(n,d,tEnd,uf){d=strip0(d);n=strip0(n);
  if(d.length===1&&d[0]===0)throw new Error('den0');
  if(n.length>d.length)throw new Error('improper');
  const N=d.length-1;const pts=[];
  if(N===0){const g=n[0]/d[0];for(let k=0;k<=400;k++){const t=tEnd*k/400;pts.push([t,g*uf(t)])}return pts}
  const a=d.map(v=>v/d[0]),b=pad(n,N+1).map(v=>v/d[0]),b0=b[0];
  const Cc=[];for(let i=0;i<N;i++)Cc.push(b[N-i]-a[N-i]*b0);
  const lam=Math.max(1e-6,...proots(d).map(cabs));
  let h=Math.min(tEnd/4000,0.4/lam);let steps=Math.ceil(tEnd/h);if(steps>200000){steps=200000}h=tEnd/steps;
  const f=(x,u)=>{const r=new Array(N);for(let i=0;i<N-1;i++)r[i]=x[i+1];let s=u;for(let i=0;i<N;i++)s-=a[N-i]*x[i];r[N-1]=s;return r};
  let x=new Array(N).fill(0);const every=Math.max(1,Math.floor(steps/800));
  const out=(x,u)=>{let y=b0*u;for(let i=0;i<N;i++)y+=Cc[i]*x[i];return y};
  pts.push([0,out(x,uf(0))]);
  for(let k=0;k<steps;k++){const t=k*h,u1=uf(t),u2=uf(t+h/2),u3=uf(t+h);
    const k1=f(x,u1),x2=x.map((v,i)=>v+h/2*k1[i]),k2=f(x2,u2),x3=x.map((v,i)=>v+h/2*k2[i]),k3=f(x3,u2),x4=x.map((v,i)=>v+h*k3[i]),k4=f(x4,u3);
    x=x.map((v,i)=>v+h/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));
    if(!x.every(isFinite))break;
    if((k+1)%every===0||k===steps-1)pts.push([t+h,out(x,u3)])}
  return pts}
/* MATLAB-like automatic final time for step() */
function niceUp(v){const e=Math.pow(10,Math.floor(Math.log10(v)));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*e>=v*0.9999)return k*e;return 10*e}
function stepTime(d){const p=proots(strip0(d));const st=p.filter(r=>r.re<-1e-9);const marg=p.some(r=>r.re>=-1e-9);
  if(!st.length)return 10;const s=Math.min(...st.map(r=>-r.re));let t=6/s;if(marg)t=clamp(t,5,20);return niceUp(clamp(t,0.05,1e5))}

/* ---------- root locus: roots of d(s) + K n(s) for K from 0 up ---------- */
function perms(n){if(n===1)return [[0]];const r=[];perms(n-1).forEach(p=>{for(let i=0;i<=p.length;i++){const q=p.slice();q.splice(i,0,n-1);r.push(q)}});return r}
function rlocusData(n,d){d=strip0(d);n=strip0(n);const N=d.length,nn=pad(n,N);
  const poles=proots(d),zeros=proots(n);const m=poles.length;const br=poles.map(p=>[p]);if(!m)return {poles,zeros,br};
  const P=m<=6?perms(m):null;let prev=poles.slice();
  for(let i=0;i<=700;i++){const K=Math.pow(10,-4+i*(10/700));const c=d.map((v,j)=>v+K*nn[j]);if(Math.abs(c[0])<1e-12*Math.abs(d[0]))continue;
    const r=proots(c);if(r.length!==m)continue;let best=null;
    if(P){let bc=Infinity;P.forEach(p=>{let s=0;for(let j=0;j<m;j++)s+=cabs(csub(prev[j],r[p[j]]));if(s<bc){bc=s;best=p}})}
    else{const used=new Set();best=prev.map(q=>{let bj=-1,bd=Infinity;r.forEach((z,j)=>{if(used.has(j))return;const dd=cabs(csub(q,z));if(dd<bd){bd=dd;bj=j}});used.add(bj);return bj})}
    prev=best.map(j=>r[j]);prev.forEach((z,j)=>br[j].push(z))}
  return {poles,zeros,br}}

/* ---------- plotting (a MATLAB-like figure) ---------- */
function niceTicks(a,b,n){if(!(b>a)){b=a+1}const raw=(b-a)/(n||5),e=Math.pow(10,Math.floor(Math.log10(raw)));let st=e;for(const k of [1,2,2.5,5,10])if(k*e>=raw*0.999){st=k*e;break}
  const t=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+st*1e-9;v+=st)t.push(Math.abs(v)<st*1e-9?0:+v.toPrecision(10));return {t,st}}
const tickS=v=>String(+(+v).toPrecision(6));
function figSVG(o){const W=o.w||560,H=o.h||330,L=58,R=16,T=34,Bm=46;const pw=W-L-R,ph=H-T-Bm;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*pw,Y=y=>T+ph-(y-o.y0)/(o.y1-o.y0)*ph;const cid='clc'+Math.random().toString(36).slice(2,8);
  let s=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1"/>`;
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${T+ph}" stroke="var(--line)" stroke-dasharray="2 3"/>`+S.t(fx(X(v)),T+ph+15,tickS(v),'m')});
  (o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${L+pw}" stroke="var(--line)" stroke-dasharray="2 3"/>`+S.t(L-5,fx(Y(v)+4),tickS(v),'m','end')});
  if(o.title)s+=S.t(L+pw/2,T-12,o.title,'');
  if(o.xl)s+=S.t(L+pw/2,H-8,o.xl,'m');
  if(o.yl)s+=`<text class="txt m" x="14" y="${T+ph/2}" text-anchor="middle" transform="rotate(-90 14 ${T+ph/2})">${o.yl}</text>`;
  s+=`<defs><clipPath id="${cid}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs><g clip-path="url(#${cid})">`;
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;const lim=1e6;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(clamp(X(p[0]),-lim,lim))+' '+fx(clamp(Y(p[1]),-lim,lim))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.over)s+=o.over(X,Y);
  s+='</g>';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||o.title||'رسم'}">${s}</svg>`}
function stepFig(n,d,o){o=o||{};const tEnd=o.tEnd||stepTime(d);const ts=o.ts||0,fv=o.fv==null?1:o.fv;
  const pts=simTF(n,d,tEnd,t=>t>=ts?fv:0);const ys=pts.map(p=>p[1]).filter(isFinite);let y0=Math.min(0,...ys),y1=Math.max(0,...ys);if(y1-y0<1e-9){y1=y0+1}
  const pad=(y1-y0)*0.08;const yt=niceTicks(y0-(y0<0?pad:0),y1+pad,5);const yy0=Math.min(yt.t[0],y0),yy1=Math.max(yt.t[yt.t.length-1],y1+pad);const xt=niceTicks(0,tEnd,6);
  return figSVG({w:o.w,h:o.h,x0:0,x1:tEnd,y0:yy0,y1:yy1,xt:xt.t,yt:niceTicks(yy0,yy1,5).t,title:o.title||'Step Response',xl:'Time (seconds)',yl:'Amplitude',
    series:[{pts,col:o.col||'--blue',w:2}].concat(o.extra||[]),aria:o.aria||'الاستجابة للخطوة',over:o.over})}
const BRC=['--blue','--on','--stop','--live','--blue-ink','--muted'];
function rlocusFig(n,d,o){o=o||{};const r=rlocusData(n,d);const all=r.poles.concat(r.zeros);const Rm=1.7*Math.max(1,...all.map(cabs));
  const pts=[];r.br.forEach(b=>b.forEach(z=>{if(cabs(z)<=Rm)pts.push(z)}));all.forEach(z=>pts.push(z));
  let xa=Math.min(...pts.map(z=>z.re)),xb=Math.max(...pts.map(z=>z.re)),ym=Math.max(...pts.map(z=>Math.abs(z.im)));
  if(xb-xa<1e-6){xa-=1;xb+=1}const px=(xb-xa)*0.04;xa-=px;xb+=px;if(xb<0&&xb>-(xb-xa)*0.25)xb=0;
  if(ym<1e-6)ym=1;else ym*=1.2;
  const xt=niceTicks(xa,xb,6),yt=niceTicks(-ym,ym,8);const x0=Math.min(xt.t[0],xa),x1=Math.max(xt.t[xt.t.length-1],xb);
  const y1=Math.max(yt.t[yt.t.length-1],ym);const yt2=niceTicks(-y1,y1,8);
  return figSVG({w:o.w,h:o.h,x0,x1,y0:-y1,y1:y1,xt:xt.t,yt:yt2.t,title:'Root Locus',xl:'Real Axis',yl:'Imaginary Axis',aria:'المحل الهندسي للجذور: الأقطاب × والأصفار ○',
    under:(X,Y)=>`<path d="M${X(x0)} ${fx(Y(0))}H${X(x1)}" stroke="var(--muted)" stroke-dasharray="4 4"/>${x0<0&&x1>0?`<path d="M${fx(X(0))} ${Y(y1)}V${Y(-y1)}" stroke="var(--muted)" stroke-dasharray="4 4"/>`:''}`,
    series:r.br.map((b,i)=>({pts:b.map(z=>[z.re,z.im]),col:BRC[i%BRC.length],w:2})),
    over:(X,Y)=>r.poles.map((p,i)=>{const x=X(p.re),y=Y(p.im),c=BRC[i%BRC.length];return `<path d="M${fx(x-6)} ${fx(y-6)}L${fx(x+6)} ${fx(y+6)}M${fx(x+6)} ${fx(y-6)}L${fx(x-6)} ${fx(y+6)}" stroke="var(${c})" stroke-width="2.2"/>`}).join('')+
      r.zeros.map(z=>`<circle cx="${fx(X(z.re))}" cy="${fx(Y(z.im))}" r="6" fill="none" stroke="var(--fg)" stroke-width="2"/>`).join('')})}

/* ---------- Simulink drawing ---------- */
function slkSVG(o){o=o||{};const has=o.has||{step:1,tf:1,scope:1},wired=o.wired!==false,num=o.num||'1',den=o.den||'s+1',run=!!o.run;
  let s='';const blk=(x,y,w,h,inner,name,id)=>`<g class="blk" data-blk="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>${inner}${S.t(x+w/2,y+h+16,name,'m')}</g>`;
  if(has.step)s+=blk(30,70,64,56,`<path d="M40 112H58V84H84" stroke="var(--fg)" stroke-width="2" fill="none"/>`,'Step','step');
  if(has.tf){const fs=Math.max(9,Math.min(14,190/Math.max(num.length,den.length,6)));s+=blk(200,58,200,80,`<text class="txt" x="300" y="90" font-size="${fs}">${esc(num)}</text><path d="M214 98H386" stroke="var(--fg)" stroke-width="1.4"/><text class="txt" x="300" y="120" font-size="${fs}">${esc(den)}</text>`,'Transfer Fcn','tf')}
  if(has.scope)s+=blk(500,70,64,56,`<rect x="510" y="80" width="44" height="30" fill="var(--lcd)" stroke="var(--fg)"/><path d="M512 104 C522 104 524 86 532 86 S542 96 552 92" stroke="var(--lcd-ink)" stroke-width="1.6" fill="none"/>`,'Scope','scope');
  if(wired&&has.step&&has.tf)s+=arrow(94,98,200,98,'--fg',1.6);
  if(wired&&has.tf&&has.scope)s+=arrow(400,98,500,98,'--fg',1.6);
  if(run)s+=S.t(320,22,'Simulation running…','b');
  if(!has.step&&!has.tf&&!has.scope)s+=`<rect x="10" y="10" width="580" height="140" rx="8" fill="none" stroke="var(--line)" stroke-dasharray="6 6"/>`+arT(300,86,'صفحة جديدة فارغة: أضف الكتل من المكتبة أعلاه',{col:'--muted'});
  return `<svg viewBox="0 0 600 160" role="img" aria-label="مخطط Simulink: Step ثم Transfer Fcn ثم Scope">${s}</svg>`}

/* ---------- the book's numbers ---------- */
const NB=[1,2,1],DB=[1,4,2,1];

/* ======================================================================
   Lesson u1-l1
   ====================================================================== */
B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'3–8',
 title:'التجربة الأولى: شرح استخدام برنامج MATLAB',
 summary:'ندخل كثيرات الحدود في MATLAB على هيئة صفوف من المعاملات، ونكتب دالة التحويل، ونحسب أصفارها وأقطابها بالأمر roots، ونرسمها بالأمر rlocus، ونرسم الاستجابة للخطوة بالأمر step، ثم نبني المخطط نفسه في Simulink ونشغّله ونقرأ النتيجة على Scope.',
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

  {st:1,short:'تمهيد',title:'تمهيد: ماذا ستتعلم من هذه التجارب؟',ref:'ص 3',
   q:'حقيبة عملية فيها عشر تجارب… ما الذي يُنتظر أن تتعلمه منها، وعلى أي أجهزة تُجرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات لوحدات الحقيبة الثلاث وعدد تجارب كل وحدة، والأولى مظللة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الوحدة الأولى (ص ⟦4⟧): تجربة واحدة هي هذا الدرس، عن برنامج ⟦MATLAB⟧ و⟦Simulink⟧."><rect x="48" y="36" width="264" height="58" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="290" cy="65" r="13" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="290" y="70" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="200" y="61" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة الأولى</text><text x="200" y="81" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">أساسيات <tspan direction="ltr" unicode-bidi="embed">MATLAB</tspan></text><rect x="62" y="52" width="70" height="26" rx="13" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="97" y="70" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">تجربة واحدة</text></g><g data-tip="الوحدة الثانية (ص ⟦9⟧): استجابة النظام الحراري ومحرك التيار المستمر ونظام الإضاءة لإشارة الخطوة."><rect x="48" y="104" width="264" height="58" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="290" cy="133" r="13" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="290" y="138" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="200" y="129" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة الثانية</text><text x="200" y="149" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">أنظمة ذات دائرة مفتوحة</text><rect x="62" y="120" width="70" height="26" rx="13" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="97" y="138" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">3</tspan> تجارب</text></g><g data-tip="الوحدة الثالثة (ص ⟦21⟧): الحاكمات ⟦P⟧ و⟦I⟧ و⟦PI⟧ و⟦PID⟧ والتحكم الرقمي في السرعة والإضاءة."><rect x="48" y="172" width="264" height="58" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="290" cy="201" r="13" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="290" y="206" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3</text><text x="200" y="197" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة الثالثة</text><text x="200" y="217" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">أنظمة ذات دائرة مغلقة</text><rect x="62" y="188" width="70" height="26" rx="13" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="97" y="206" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">6</tspan> تجارب</text></g><text x="180" y="262" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="rtl">عشر تجارب</text><g data-tip="مختبر ⟦Com3Lab⟧ من شركة ⟦Leybold⟧ الألمانية: كرت إلكتروني عليه لوحات التجارب، وأجهزة القياس فيه تظهر على شاشة الحاسب."><text x="180" y="288" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">على مختبر <tspan direction="ltr" unicode-bidi="embed">Com3Lab</tspan> من شركة <tspan direction="ltr" unicode-bidi="embed">Leybold</tspan></text></g></svg>`,
   cap:'الحقيبة ثلاث وحدات فيها عشر تجارب، وهذا الدرس هو تجربة الوحدة الأولى (البطاقة الصفراء).<br><b>مرّر المؤشر على البطاقات وعلى اسم المختبر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب التمهيد، أي من هذه <b>ليس</b> مما يتعلمه المتدرب من تجارب الحقيبة؟',opts:[
     ['خصائص التحكم في الحلقة المفتوحة والمغلقة',false,'هذا أول ما ذكره التمهيد في ص 3.'],
     ['تأثير الحاكمات بأنواعها المختلفة على الوحدة المحكومة',false,'ذكره التمهيد، وهو موضوع الوحدة الثالثة.'],
     ['لف المحركات الكهربائية وصيانتها',true,'التمهيد يذكر: الحلقة المفتوحة والمغلقة، ونظم الرتبة الأولى، وتأثير الحاكمات، واستخدام برنامج Matlab في أنظمة التحكم. لف المحركات ليس منها.'],
     ['استخدام برنامج Matlab في أنظمة التحكم',false,'ذكره التمهيد، وهو موضوع هذا الدرس.']]}}
   ],
   body:[
    {book:String.raw`<p>الحمد لله رب العالمين، والصلاة والسلام على سيدنا محمد وآله وصحبه، أما بعد، فهذا هو الكتاب الخاص بالمنهج العملي لمقرر: "تقنية التحكم الآلي" نقدمه لأبنائنا متدربي الكليات التقنية التابعة للمؤسسة العامة للتعليم الفني والتدريب المهني، تخصص "الآلات الكهربائية"، حيث لا يخفى على أحد ما للجانب التطبيقي من أهمية في عملية التحصيل العملي وترسيخ المفاهيم لدى المتدرب.</p>
     <p>يتعلم المتدرب من هذه التجارب خصائص التحكم في الحلقة المفتوحة والمغلقة وكذلك كما يتعلم المتدرب خصائص نظم الرتبة الأولى. كما يتعلم تأثير الحاكمات بأنواعها المختلفة على الوحدة المحكومة. كما يتعلم المتدرب استخدام برنامج <span class="ltr">Matlab</span> في أنظمة التحكم.</p>
     <p>وقد تم وضع عشر تجارب مبينة في الفهرس.</p>
     <p>وقد روعي عند إعداد هذه التجارب المختبرات والأجهزة المتوفرة لدينا وهي: مختبر <span class="ltr">Com3Lab</span> من شركة <span class="ltr">Leybold</span> الألمانية. هذا المختبر متوفر في كثير من الكليات التقنية في المملكة. وقد سارعنا بترجمة ملفاته وحررنا مختبرات تتناسب مع محتوياته. نأمل إن شاء الله أن نكون قد وفقنا في ذلك. ورغم المجهودات التي بذلت فهذه المختبرات تعتبر كقاعدة يمكن تطويرها.</p>`,ref:'ص 3'},
    {tip:String.raw`<p>الحقيبة <b>دليل عملي</b>: تخبرك ماذا توصّل وماذا تسجل، لكنها لا تشرح النظرية. لذلك ستجد في كل محطة شرحاً قصيراً منا بكلمات بسيطة، عليه وسم «توضيح للمتدرب»، ونص الكتاب نفسه عليه وسم «نص الكتاب». وفي كل درس «مختبر» افتراضي تجري فيه التجربة بنفسك.</p>`},
    {add:String.raw`<p><span class="ltr">Com3Lab</span> كرت إلكتروني عليه عدة «لوحات» (حراري، سرعة، إضاءة، حاكمات)، والأجهزة (المولد، الملتيميتر، راسم الذبذبات) أجهزة افتراضية تظهر على شاشة الحاسب ونوصل أسلاكها على صورة اللوحة. ستستعمله من الوحدة الثانية.</p>`,title:'ما هو Com3Lab؟'},
    {title:'تحقق سريع: ماذا قال التمهيد؟',widget:(el,B)=>DCML.tf(el,B,{intro:'هذه المحطة نص تمهيدي لا شيء فيه للتجريب. احكم على كل عبارة بحسب نص الكتاب (ص 3).',items:[
 ['تجارب الحقيبة عشر تجارب مبينة في الفهرس.',true,'نص الكتاب: «وقد تم وضع عشر تجارب مبينة في الفهرس».'],
 ['أُعدّت التجارب على مختبر Com3Lab من شركة Leybold الألمانية.',true,'هذا هو المختبر المتوفر في كثير من الكليات التقنية في المملكة، كما يذكر التمهيد.'],
 ['الحقيبة لا تتناول برنامج Matlab.',false,'التمهيد يقول: «كما يتعلم المتدرب استخدام برنامج Matlab في أنظمة التحكم»، وهو موضوع هذه التجربة.'],
 ['يرى معدّو الحقيبة أن هذه المختبرات نهائية ولا تحتاج تطويراً.',false,'نص الكتاب: «فهذه المختبرات تعتبر كقاعدة يمكن تطويرها».']]})}
   ]},

  {st:2,short:'الهدف من التجربة',title:'الوحدة الأولى — الهدف من التجربة',ref:'ص 4–5',
   q:'برنامجان في تجربة واحدة: ما الفرق بين أن تكتب أمراً وأن ترسم مخططاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نافذتان: نافذة أوامر MATLAB ونافذة مخطط Simulink" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦MATLAB⟧: برنامج حسابات؛ تكتب الأمر بعد العلامة ⟦&gt;&gt;⟧ فينفذه فوراً."><rect x="190" y="62" width="130" height="140" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="190" y="62" width="130" height="24" rx="8" fill="#2C4A40"/><text x="255" y="79" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">MATLAB</text><text x="198" y="108" text-anchor="start" font-size="10.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">&gt;&gt; p=[1 3 1];</text><text x="198" y="130" text-anchor="start" font-size="10.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">&gt;&gt; roots(p)</text><text x="198" y="152" text-anchor="start" font-size="10.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">&gt;&gt; step(n,d)</text><rect x="198" y="168" width="8" height="14" fill="#4FB3A9"/></g><g data-tip="⟦Simulink⟧: جزء من ⟦MATLAB⟧ نرسم فيه النظام صناديق موصولة بأسهم ثم نشغله."><rect x="40" y="62" width="130" height="140" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="40" y="62" width="130" height="24" rx="8" fill="#2C4A40"/><text x="105" y="79" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">SIMULINK</text><rect x="52" y="124" width="26" height="26" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="92" y="120" width="36" height="34" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="142" y="124" width="20" height="26" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><line x1="78" y1="137" x2="81.0" y2="137.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M92.0 137.0 L81.0 142.5 L81.0 131.5 Z" fill="#2C4A40"/><line x1="128" y1="137" x2="131.0" y2="137.0" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><path d="M142.0 137.0 L131.0 142.5 L131.0 131.5 Z" fill="#2C4A40"/></g><text x="255" y="228" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">أساسيات <tspan direction="ltr" unicode-bidi="embed">MATLAB</tspan></text><text x="105" y="228" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">أساسيات <tspan direction="ltr" unicode-bidi="embed">SIMULINK</tspan></text><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">هدف التجربة: التدرب على البرنامجين</text></svg>`,
   cap:'التجربة تدربك على برنامجين: نافذة أوامر تكتب فيها، ونافذة مخطط ترسم فيها.<br><b>مرّر المؤشر على كل نافذة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تريد أن تمثّل نظاماً على شكل صناديق موصولة بأسهم ثم تشغّله. أي البرنامجين تستعمل؟',opts:[
     ['<span class="ltr">Simulink</span>',true,'Simulink يمثل النظم برسوم جاهزة (كتل) نربطها ببعضها ثم نشغلها، كما في ص 7.'],
     ['نافذة أوامر <span class="ltr">MATLAB</span> فقط',false,'نافذة الأوامر نكتب فيها أوامر نصية مثل roots و step، لا نرسم فيها صناديق.'],
     ['لا يمكن ذلك بالحاسب',false,'يمكن: هذا بالضبط ما يفعله Simulink.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الوحدة الأولى: أساسيات برنامج <span class="ltr">MATLAB</span></b></p>`,ref:'ص 4'},
    {book:String.raw`<p><b>الهدف من التجربة:</b></p><p>أن يتدرب المتدرب من خلال هذه التجربة على:</p><ul><li>أساسيات برنامج ماتلاب <span class="ltr">MATLAB</span>.</li><li>أساسيات برنامج <span class="ltr">SIMULINK</span>.</li></ul>`,ref:'ص 5'},
    {tip:String.raw`<p><span class="ltr">MATLAB</span> برنامج حسابات: تكتب فيه أمراً في «نافذة الأوامر» بعد العلامة <span class="ltr">&gt;&gt;</span> فينفذه فوراً. و<span class="ltr">Simulink</span> جزء منه نرسم فيه النظام على شكل «صناديق» موصولة بأسهم ثم نشغله.</p>`},
    {title:'مختبر مصغّر: أين تنفّذ هذا العمل؟',widget:(el,B)=>{const L=DCML.lt;DCML.sort(el,B,{intro:'لكل عمل اختر المكان الذي تنفذه فيه: نافذة الأوامر (تكتب) أم Simulink (ترسم وتوصل).',cats:['نافذة أوامر MATLAB','Simulink'],items:[
 [`تكتب ${L('roots(d)')} بعد العلامة ${L('&gt;&gt;')} فيطبع الجذور.`,0,'أمر نصي يُكتب في نافذة الأوامر (ص 6).'],
 [`تسحب كتلة ${L('Step')} وتصلها بسهم إلى كتلة ${L('Transfer Fcn')}.`,1,'ربط الرسوم الجاهزة ببعضها هو عمل Simulink (ص 7).'],
 [`تكتب ${L('step(n,d)')} فيظهر منحنى الاستجابة.`,0,'أمر نصي في نافذة الأوامر (ص 7)، وهو غير كتلة Step في Simulink.'],
 [`تنقر ${L('Simulation')} ثم ${L('Start')}.`,1,'هكذا تشغّل المحاكاة في Simulink (ص 8).'],
 [`تكتب ${L('p=[1 3 1];')} لإدخال كثيرة حدود.`,0,'إدخال صف المعاملات أمر نصي (ص 5).'],
 [`تنقر مرتين على أيقونة ${L('Scope')} لترى النتيجة.`,1,'جهاز العرض Scope كتلة في مخطط Simulink (ص 8).']]})}}
   ]},

  {st:3,short:'الأجهزة',title:'الأجهزة ومكونات التجربة',ref:'ص 5',
   q:'هذه التجربة لا تحتاج أسلاكاً ولا لوحات… فماذا تحتاج إذن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهاز حاسب على شاشته البرنامجان وصندوق أدوات التحكم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="70" y="50" width="220" height="160" rx="12" fill="#2C4A40"/><rect x="82" y="62" width="196" height="136" rx="4" fill="#FBF6EE"/><rect x="95" y="78" width="170" height="28" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="97" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">MATLAB</text><rect x="95" y="116" width="170" height="28" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="135" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Simulink</text><g data-tip="صندوق أدوات التحكم: فيه الأوامر ⟦tf⟧ و⟦roots⟧ و⟦step⟧ و⟦rlocus⟧. اسمه الرسمي ⟦Control System Toolbox⟧."><rect x="95" y="154" width="170" height="28" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="173" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Control Tool Box</text></g><path d="M160 210 L152 236 H208 L200 210 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="118" y="236" width="124" height="10" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="274" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">جهاز حاسب</text><text x="180" y="298" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">عليه <tspan direction="ltr" unicode-bidi="embed">MATLAB</tspan> و <tspan direction="ltr" unicode-bidi="embed">Simulink</tspan></text></svg>`,
   cap:'حاسب واحد عليه البرنامجان وصندوق أدوات التحكم.<br><b>مرّر المؤشر على الشريحة الصفراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'من أين تأتي الأوامر <span class="ltr">tf</span> و<span class="ltr">step</span> و<span class="ltr">rlocus</span> التي ستستعملها؟',opts:[
     ['من برنامج الرسم في نظام التشغيل',false,'هذه أوامر داخل MATLAB، لا علاقة لها ببرامج نظام التشغيل.'],
     ['من الملف الذي يشمل الأدوات الرياضية: <span class="ltr">Control Tool Box</span>',true,'الكتاب في ص 5 يذكر أن البرنامج يجب أن يحتوي هذا الملف الذي يشمل الأدوات الرياضية للحسابات والرسومات.'],
     ['من الإنترنت عند كل استعمال',false,'الأدوات مثبتة مع البرنامج في صندوق الأدوات.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأجهزة ومكونات التجربة:</b></p><ul><li>جهاز حاسب.</li><li>برنامج <span class="ltr">MATLAB</span> و <span class="ltr">Simulink</span> محتوياً على الملف الذي يشمل الأدوات الرياضية التي يمكن استعمالها في الحسابات والرسومات وهو <span class="ltr">Control Tool Box</span>.</li></ul>`,ref:'ص 5'},
    {tip:String.raw`<p>الأوامر <span class="ltr">tf</span> و<span class="ltr">step</span> و<span class="ltr">rlocus</span> تأتي من صندوق أدوات التحكم، واسمه الرسمي <span class="ltr">Control System Toolbox</span> (وفي الكتاب <span class="ltr">Control Tool Box</span>). إذا لم يكن مثبتاً فلن يعرف البرنامج هذه الأوامر.</p>`},
    {title:'تحقق سريع: ماذا تحتاج التجربة؟',widget:(el,B)=>DCML.tf(el,B,{intro:'قائمة أجهزة قصيرة: احكم على كل عبارة بحسب نص الكتاب (ص 5).',items:[
 ['تحتاج هذه التجربة لوحة Com3Lab وأسلاك توصيل.',false,'الأجهزة في ص 5 جهاز حاسب وبرنامج MATLAB وSimulink فقط؛ لوحة Com3Lab تبدأ من الوحدة الثانية.'],
 ['يجب أن يحتوي البرنامج على Control Tool Box.',true,'نص الكتاب: «محتوياً على الملف الذي يشمل الأدوات الرياضية… وهو Control Tool Box».'],
 ['الأوامر tf وroots وstep تعمل في أي نسخة من MATLAB حتى بلا صندوق أدوات التحكم.',false,'roots أمر أساسي، لكن tf وstep وrlocus من صندوق أدوات التحكم؛ بدونه لا يعرفها البرنامج.']]})}
   ]},

  {st:4,short:'دالة التحويل',title:'خطوات إجراء التجربة: تعريف دالة التحويل',ref:'ص 5',
   q:'كيف نصف نظاماً كاملاً (محركاً أو فرناً) بسطر رياضي واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صندوق دالة التحويل: الدخل يدخل والخرج يخرج، والدالة بسط فوق مقام" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="70" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">دالة التحويل</text><line x1="24" y1="160" x2="77.0" y2="160.0" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M88.0 160.0 L77.0 165.5 L77.0 154.5 Z" fill="#2C4A40"/><line x1="272" y1="160" x2="325.0" y2="160.0" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M336.0 160.0 L325.0 165.5 L325.0 154.5 Z" fill="#2C4A40"/><text x="56" y="146" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">الدخل</text><text x="304" y="146" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">الخرج</text><rect x="90" y="100" width="182" height="120" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="140" y="167" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G(s) =</text><g data-tip="البسط ⟦n(s)⟧: كثيرة حدود في ⟦s⟧ تُكتب فوق الخط."><text x="222" y="148" text-anchor="middle" font-size="17" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">n(s)</text><rect x="192" y="126" width="62" height="30" fill="transparent"/></g><line x1="190" y1="160" x2="254" y2="160" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="المقام ⟦d(s)⟧: كثيرة حدود في ⟦s⟧ تُكتب تحت الخط."><text x="222" y="188" text-anchor="middle" font-size="17" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">d(s)</text><rect x="192" y="166" width="62" height="30" fill="transparent"/></g><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">دالة التحويل = بسط ÷ مقام</text><text x="180" y="288" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">وكلاهما كثيرة حدود في <tspan direction="ltr" unicode-bidi="embed">s</tspan></text></svg>`,
   cap:'دالة التحويل صندوق يربط الخرج بالدخل، وتُكتب بسطاً فوق مقام.<br><b>مرّر المؤشر على <span class="ltr">n(s)</span> و <span class="ltr">d(s)</span> (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'في \\(G(s)=\\frac{n(s)}{d(s)}\\)، ماذا يمثل \\(d(s)\\)؟',opts:[
     ['بسط دالة التحويل',false,'البسط هو \\(n(s)\\)، الذي يُكتب فوق الخط.'],
     ['زمن التجربة',false,'\\(d(s)\\) كثيرة حدود في \\(s\\)، لا زمن.'],
     ['مقام دالة التحويل، وهو كثيرة حدود في \\(s\\)',true,'نص الكتاب في ص 5: \\(d(s)\\) يمثل مقام دالة التحويل، وكلاهما يمثل كثيرات الحدود في \\(s\\).']]}}
   ],
   body:[
    {book:String.raw`<p>بعد تشغيل برنامج ماتلاب نعرف دالة التحويل كما يلي:</p>$$G(s)=\frac{n(s)}{d(s)}$$<p>حيث إن: \(n(s)\) يمثل بسط دالة التحويل. و \(d(s)\) يمثل مقام دالة التحويل وكلاهما يمثل كثيرات الحدود في \(s\) <span class="ltr">(Polynomial in s)</span>.</p>`,ref:'ص 5'},
    {tip:String.raw`<p>دالة التحويل «وصفة» تربط خرج النظام بدخله. المتغير \(s\) رمز رياضي يمثل التغير مع الزمن: \(s\) في المقام يعني أن النظام «يتأخر» ولا يستجيب فوراً. يكفي الآن أن تعرف أن النظام كله يُكتب بكثيرتي حدود: واحدة فوق (البسط) وواحدة تحت (المقام).</p>`},
    {title:'مختبر مصغّر: بسط أم مقام؟',widget:(el,B)=>DCML.sort(el,B,{intro:'من دوال الكتاب نفسها: لكل جزء اختر هل هو البسط \\(n(s)\\) أم المقام \\(d(s)\\).',cats:['البسط n(s)','المقام d(s)'],items:[
 ['في \\(G(s)=\\frac{s^2+2s+1}{s^3+4s^2+2s+1}\\) (ص 6): الجزء \\(s^2+2s+1\\)',0,'هو فوق الخط، فهو البسط \\(n(s)\\)، وصفّه n=[1 2 1].'],
 ['في الدالة نفسها: الجزء \\(s^3+4s^2+2s+1\\)',1,'تحت الخط، فهو المقام \\(d(s)\\)، وصفّه d=[1 4 2 1].'],
 ['في السؤال الأول \\(G(s)=\\frac{s+1}{s(s+2)(s+3)}\\): الجزء \\(s(s+2)(s+3)\\)',1,'تحت الخط: مقام، ونضرب أقواسه قبل إدخاله.'],
 ['في السؤال الثاني \\(G(s)=\\frac{2}{s(s+1)(s+2)}\\): الرقم \\(2\\)',0,'فوق الخط: بسط، وهو كثيرة حدود من الدرجة صفر.'],
 ['الجزء الذي نحسب منه الأقطاب بالأمر roots',1,'الأقطاب جذور المقام: roots(d) (ص 6).'],
 ['الجزء الذي نحسب منه الأصفار بالأمر roots',0,'الأصفار جذور البسط: roots(n) (ص 6).']]})}
   ]},

  {st:5,short:'إدخال كثيرة الحدود',title:'خطوات إجراء التجربة: إدخال كثيرة الحدود',ref:'ص 5–6',
   q:'البرنامج لا يفهم «s تربيع»… فكيف نكتب له كثيرة الحدود؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حدود كثيرة الحدود تنزل بالترتيب إلى خانات الصف، ومعامل s تربيع صفر مظلل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="62" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">p(s) = s³ + 3s + 1</text><rect x="44" y="86" width="62" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="75" y="107" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1·s³</text><rect x="51" y="170" width="48" height="44" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="75" y="199" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><line x1="75" y1="120" x2="75.0" y2="155.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M75.0 166.0 L69.5 155.0 L80.5 155.0 Z" fill="#2C4A40"/><g data-tip="معامل ⟦s²⟧ هنا يساوي صفراً، ومع ذلك يجب كتابته في الصف؛ وإلا فهم البرنامج كثيرة حدود أخرى."><rect x="114" y="86" width="62" height="32" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="145" y="107" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">0·s²</text><rect x="121" y="170" width="48" height="44" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="145" y="199" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text></g><line x1="145" y1="120" x2="145.0" y2="155.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M145.0 166.0 L139.5 155.0 L150.5 155.0 Z" fill="#2C4A40"/><rect x="184" y="86" width="62" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="215" y="107" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">3·s</text><rect x="191" y="170" width="48" height="44" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="215" y="199" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">3</text><line x1="215" y1="120" x2="215.0" y2="155.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M215.0 166.0 L209.5 155.0 L220.5 155.0 Z" fill="#2C4A40"/><rect x="254" y="86" width="62" height="32" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="285" y="107" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><rect x="261" y="170" width="48" height="44" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="285" y="199" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><line x1="285" y1="120" x2="285.0" y2="155.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M285.0 166.0 L279.5 155.0 L290.5 155.0 Z" fill="#2C4A40"/><g data-tip="الأمر في ⟦MATLAB⟧: المعاملات بين قوسين مربعين وبينها مسافات. والفاصلة المنقوطة ⟦;⟧ تمنع إعادة طباعة الصف على الشاشة."><text x="180" y="246" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">» p=[1 0 3 1];</text><rect x="90" y="228" width="180" height="26" fill="transparent"/></g><text x="180" y="280" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">من أعلى قوة إلى الثابت، والصفر يُكتب</text></svg>`,
   cap:'كل حد من كثيرة الحدود ينزل بمعامله إلى خانته في الصف، بالترتيب من أعلى قوة.<br><b>مرّر المؤشر على الخانة الصفراء وعلى الأمر (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'كيف تُدخل \\(p(s)=s^3+3s+1\\) في <span class="ltr">MATLAB</span>؟',opts:[
     ['<span class="ltr">p=[1 3 1];</span>',false,'هذا صف كثيرة الحدود \\(s^2+3s+1\\)؛ نقص معامل \\(s^2\\) فتغيرت كثيرة الحدود.'],
     ['<span class="ltr">p=[1 3 0 1];</span>',false,'الصفر في مكان خاطئ: هذا يعني \\(s^3+3s^2+1\\).'],
     ['<span class="ltr">p=[1 0 3 1];</span>',true,'معامل \\(s^2\\) يساوي صفراً ويجب كتابته، كما في ص 6.']]}}
   ],
   body:[
    {book:String.raw`<p>يتم إدخال كثيرة الحدود بإدخال معاملاتها على هيئة صف:</p><p>أدخل كثيرة الحدود التالية:</p>$$p(s)=s^2+3s+1$$<p>معاملات \(p(s)\) هي: 1 ، 3 ، 1 فندخلها في <span class="ltr">MATLAB</span> كالتالي:</p><pre class="cl-code">» p=[1 3 1];</pre>`,ref:'ص 5'},
    {book:String.raw`<p>يجب إدخال جميع المعاملات حتى التي تساوي صفراً.</p><p><b>مثال:</b> أدخل كثيرة الحدود التالية: \(p(s)=s^3+3s+1\)</p><p>معامل \(s^2\) هنا يساوي صفراً، ومن ثم ندخل المعاملات كالتالي:</p><pre class="cl-code">» p=[1 0 3 1];</pre><p><b>مثال:</b> أدخل دالة التحويل التالية:</p>$$G(s)=\frac{s^2+2s+1}{s^3+4s^2+2s+1}$$<p>فندخلهما في صورة صفين كالتالي:</p><pre class="cl-code">»n=[1 2 1];
»d=[1 4 2 1];</pre>`,ref:'ص 6'},
    {title:'من كثيرة الحدود إلى الصف',widget:(el,B)=>{
      const P=[['p','s²+3s+1',[1,3,1]],['p','s³+3s+1',[1,0,3,1]],['n','s²+2s+1',[1,2,1]],['d','s³+4s²+2s+1',[1,4,2,1]]];let k=1;
      const pw=n=>n===0?'الثابت':n===1?'s':'s<sup>'+n+'</sup>';
      const draw=()=>{const [v,lab,c]=P[k],N=c.length-1;
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">اختر من أمثلة الكتاب:</span><span class="mseg" style="flex-wrap:wrap">${P.map((p,i)=>`<button type="button" data-k="${i}" aria-pressed="${i===k}">${p[0]}(s) = ${p[1]}</button>`).join('')}</span></div>
         <div class="tablebox" style="max-width:460px;margin-top:10px"><table class="tt" style="direction:ltr"><thead><tr>${c.map((x,i)=>`<th>${pw(N-i)}</th>`).join('')}</tr></thead><tbody><tr>${c.map(x=>`<td style="font-family:var(--mono);font-size:16px${x===0?';background:var(--live-soft);font-weight:700':''}">${x}</td>`).join('')}</tr></tbody></table></div>
         <pre class="cl-code">» ${v}=[${c.join(' ')}];</pre><p class="sub">${c.includes(0)?'الخانة المظللة: حد غير مكتوب في كثيرة الحدود، فمعامله صفر ويُكتب في الصف.':'كل القوى موجودة، فلا يوجد صفر في الصف.'}</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});};
      draw();
    }},
    {tip:String.raw`<p>المعاملات تُكتب من <b>أعلى قوة إلى الثابت</b>. الفاصلة المنقوطة <span class="ltr">;</span> في آخر الأمر تمنع البرنامج من إعادة طباعة الصف على الشاشة؛ جرّب الأمر بدونها في المختبر وانظر الفرق. والعلامة » في الكتاب هي علامة الانتظار في نافذة الأوامر (تظهر في البرنامج هكذا <span class="ltr">&gt;&gt;</span>)، لا تكتبها أنت.</p>`}
   ]},

  {st:6,short:'كتابة الدالة tf',title:'خطوات إجراء التجربة: كتابة دالة التحويل',ref:'ص 6',
   q:'أدخلنا البسط والمقام صفين منفصلين… فكيف نجمعهما في دالة واحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نافذة الأوامر: الأمر tf(n,d) وتحته الدالة مطبوعة بسطاً فوق مقام" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="30" y="46" width="300" height="200" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="30" y="46" width="300" height="24" rx="8" fill="#2C4A40"/><text x="180" y="63" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Command Window</text><g data-tip="اكتب الأمر بحرف صغير ⟦tf⟧؛ البرنامج يفرّق بين الحرف الكبير والصغير."><text x="48" y="96" text-anchor="start" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">» tf(n,d)</text><rect x="44" y="80" width="130" height="24" fill="transparent"/></g><g data-tip="ما يطبعه ⟦MATLAB⟧ بعد الأمر: البسط فوق والمقام تحت."><text x="48" y="124" text-anchor="start" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">ans =</text><text x="180" y="152" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">s^2 + 2 s + 1</text><line x1="80" y1="164" x2="280" y2="164" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><text x="180" y="186" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">s^3 + 4 s^2 + 2 s + 1</text><text x="180" y="226" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Continuous-time transfer function.</text><rect x="44" y="110" width="272" height="124" fill="transparent"/></g><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أمر واحد يجمع البسط والمقام في دالة</text></svg>`,
   cap:'الأمر <span class="ltr">tf(n,d)</span> يطبع الدالة بسطاً فوق مقام.<br><b>مرّر المؤشر على الأمر وعلى الناتج (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'كتبت في <span class="ltr">MATLAB</span> الحقيقي <span class="ltr">Tf(n,d)</span> بحرف <span class="ltr">T</span> كبير. ماذا يحدث؟',opts:[
     ['تظهر رسالة خطأ: الدالة غير معروفة',true,'MATLAB يفرّق بين الحرف الكبير والصغير، والأمر الصحيح tf بحرفين صغيرين.'],
     ['يعمل الأمر مثل tf تماماً',false,'لا: البرنامج يعدّ Tf اسماً آخر غير tf.'],
     ['يطبع البسط فقط',false,'لا يُنفَّذ الأمر أصلاً، لأن البرنامج لا يعرف Tf.']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن كتابة الدالة في ماتلاب وذلك بكتابة الأمر التالي:</p><pre class="cl-code">»tf(n,d)</pre>`,ref:'ص 6'},
    {watch:String.raw`<p>طُبع الأمر في الكتاب <span class="ltr">Tf(n,d)</span> بحرف <span class="ltr">T</span> كبير. <span class="ltr">MATLAB</span> يفرّق بين الحرف الكبير والصغير، والصحيح <span class="ltr">tf(n,d)</span>؛ لو كتبت <span class="ltr">Tf</span> في البرنامج الحقيقي لظهرت رسالة خطأ (الدالة غير معروفة). في المختبر الافتراضي نقبل الكتابتين ونذكّرك بالصحيح.</p>`,fix:true},
    {tip:String.raw`<p>بعد الأمر يطبع <span class="ltr">MATLAB</span> الدالة هكذا:</p>`+'<pre class="cl-code">'+esc('ans ='+tfText(NB,DB))+'</pre>'+String.raw`<p>البسط \(s^2+2s+1\) فوق الخط، والمقام \(s^3+4s^2+2s+1\) تحته، وهي نفس الدالة التي أدخلنا صفيها \(n\) و \(d\).</p>`,title:'ماذا يظهر على الشاشة؟'},
    {title:'مختبر مصغّر: ماذا يطبع tf؟',widget:(el,B)=>{const L=DCML.lt;DCML.cases(el,B,{intro:'موقفان مع الصفين من مثال ص 6: '+L('n=[1 2 1];')+' و '+L('d=[1 4 2 1];'),cases:[
 {q:'كتبت '+L('tf(n,d)')+'. ماذا يُطبع فوق الخط؟',opts:[
  [L('s^3 + 4 s^2 + 2 s + 1'),false,'هذا المقام d، ويُطبع تحت الخط.'],
  [L('s^2 + 2 s + 1'),true,'الصف الأول في tf هو البسط، فيُطبع فوق الخط.'],
  [L('1 2 1'),false,'tf لا يطبع الصف كما هو، بل كثيرة الحدود بالمتغير s.']]},
 {q:'كتبت '+L('tf(d,n)')+' بدل '+L('tf(n,d)')+'. ماذا يحدث؟',opts:[
  ['تُطبع الدالة نفسها، فالترتيب لا يهم',false,'الترتيب مهم: الصف الأول بسط والثاني مقام.'],
  ['رسالة خطأ',false,'الأمر مكتوب صحيحاً فيُنفَّذ، لكنه يعطي دالة أخرى.'],
  ['تُطبع دالة مقلوبة: المقام فوق والبسط تحت',true,'tf يأخذ البسط أولاً ثم المقام، فتبديل الصفين يقلب الدالة.']]}]})}}
   ]},

  {st:7,short:'أصفار الدالة',title:'لحساب أصفار الدالة',ref:'ص 6',
   q:'متى تصبح دالة التحويل صفراً؟ وكيف يجيبك البرنامج بأمر واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الأمر roots(n) يعطي صفراً مزدوجاً عند سالب واحد على المحور الحقيقي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="40" y="40" width="280" height="62" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="60" y="64" text-anchor="start" font-size="14" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">» roots(n)</text><text x="60" y="88" text-anchor="start" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">ans =  -1   -1</text><line x1="40" y1="190" x2="317.0" y2="190.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M328.0 190.0 L317.0 195.5 L317.0 184.5 Z" fill="#2C4A40"/><line x1="280" y1="180" x2="280" y2="200" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="280" y="218" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0</text><line x1="200" y1="183" x2="200" y2="197" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><g data-tip="صفر مزدوج: الجذر ⟦−1⟧ مكرر مرتين، لأن ⟦s² + 2s + 1 = (s + 1)²⟧."><circle cx="200" cy="190" r="9" fill="#FBF6EE" stroke="#12855A" stroke-width="3"/><circle cx="200" cy="190" r="15" fill="none" stroke="#12855A" stroke-width="3"/><text x="200" y="226" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">-1</text><rect x="180" y="170" width="40" height="64" fill="transparent"/></g><text x="318" y="180" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Re</text><text x="200" y="156" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="rtl">صفر مزدوج</text><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(s) = s² + 2s + 1</text><text x="180" y="290" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">الصفر: قيمة <tspan direction="ltr" unicode-bidi="embed">s</tspan> التي تجعل البسط صفراً</text></svg>`,
   cap:'الأمر <span class="ltr">roots(n)</span> يعطي جذري البسط، وهما متساويان: صفر مزدوج.<br><b>مرّر المؤشر على الصفر المزدوج (أو المسه في الجوال) لتعرف لماذا تكرر.</b>',
   side:[
    {predict:{q:'لماذا ظهر الجذر <span class="ltr">−1</span> مرتين في ناتج <span class="ltr">roots(n)</span>؟',opts:[
     ['لأن البرنامج يكرر كل جواب مرتين',false,'لا: roots يطبع كل جذر مرة واحدة؛ التكرار هنا من كثيرة الحدود نفسها.'],
     ['لأن \\(s^2+2s+1=(s+1)^2\\)، فالجذر \\(-1\\) مكرر',true,'كثيرة الحدود من الدرجة الثانية لها جذران، وهنا الجذران متساويان.'],
     ['لأن البسط والمقام لهما الجذر نفسه',false,'جذور المقام مختلفة (انظر المحطة التالية).']]}}
   ],
   body:[
    {book:String.raw`<p><b>لحساب أصفار الدالة:</b></p><pre class="cl-code">»roots(n)</pre><p>تسجل الإجابة على الشاشة كما يلي:</p><pre class="cl-code">ans =

   -1
   -1</pre>`,ref:'ص 6'},
    {tip:String.raw`<p><b>الأصفار</b> جذور البسط: قيم \(s\) التي تجعل الدالة صفراً. البسط هنا \(n(s)=s^2+2s+1\)، وهو من الدرجة الثانية فله جذران، وكلاهما \(-1\).</p>`},
    {title:'مختبر مصغّر: اختر البسط واقرأ أصفاره',widget:(el,B)=>{
 const NS=[[[1,2,1],'s^2+2s+1','مثال ص 6'],[[1,1],'s+1','السؤال الأول'],[[2],'2','السؤال الثاني']];
 const R=z=>{const f=v=>{const a=Math.abs(v)<1e-12?0:v;return Number.isInteger(a)?String(a):a.toFixed(4)};return z.im?f(z.re)+(z.im>0?' + ':' - ')+f(Math.abs(z.im))+'i':f(z.re)};
 const plane=(zs,ps)=>{const W=320,H=150,X=v=>20+(v+4)*(W-40)/5,Y=v=>H/2-v*(H/2-18);let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="المستوى المركب" style="font-family:var(--font)" direction="ltr"><rect x="20" y="10" width="${X(0)-20}" height="${H-20}" fill="var(--on-soft)"/><path d="M14 ${Y(0)}H${W-8}M${X(0)} 8V${H-8}" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let k=-4;k<=1;k++)s+=`<path d="M${X(k)} ${Y(0)-4}V${Y(0)+4}" stroke="var(--fg)"/><text x="${X(k)}" y="${Y(0)+17}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${k}</text>`;
  zs.forEach((z,i)=>{s+=`<circle cx="${X(z.re)+(i%2)*0}" cy="${Y(z.im)}" r="${7+i*3}" fill="none" stroke="var(--on)" stroke-width="2.4"/>`});
  (ps||[]).forEach(z=>{const x=X(z.re),y=Y(Math.max(-1,Math.min(1,z.im)));s+=`<path d="M${x-6} ${y-6}L${x+6} ${y+6}M${x-6} ${y+6}L${x+6} ${y-6}" stroke="var(--stop)" stroke-width="2.6"/>`});
  return s+`<text x="${W-10}" y="${H-8}" text-anchor="end" font-size="11" fill="var(--muted)">Real →</text></svg>`};
 DCML.lab(el,B,{intro:'اختر بسطاً من دوال الكتاب، وشاهد ما يطبعه '+DCML.lt('roots(n)')+' وأين تقع الأصفار (○) على المستوى المركب.',
  predict:{q:'في السؤال الثاني البسط '+DCML.lt('n=[2];')+'. كم صفراً للدالة؟',opts:[
   ['صفر واحد يساوي 2',false,'الرقم 2 ثابت لا يصبح صفراً أبداً، فلا توجد قيمة \\(s\\) تجعله صفراً.'],
   ['لا أصفار، ويطبع roots صفاً فارغاً []',true,'عدد الأصفار = درجة البسط، والدرجة هنا صفر.'],
   ['صفران',false,'الصفران كانا لبسط مثال ص 6 \\(s^2+2s+1\\) لأنه من الدرجة الثانية.']]},
  ins:[{k:'k',l:'البسط n(s)',seg:NS.map((x,i)=>[i,DCML.lt('n=['+x[0].join(' ')+']')+' — '+x[2]]),v:0}],
  calc:(s)=>{const [c,txt]=NS[s.k],z=proots(c);
   return {pic:plane(z),facts:[['n(s)',txt],['درجة البسط',String(c.length-1)],['عدد الأصفار',String(z.length),'hi']],
    msg:code('>> roots(n)\nans =\n'+(z.length?z.map(v=>'   '+R(v)).join('\n'):'     []'))+(z.length===2?'الجذر \\(-1\\) مكرر: \\(s^2+2s+1=(s+1)^2\\)، لذلك رسمنا دائرتين حوله.':z.length?'صفر واحد عند \\(s=-1\\).':'كثيرة الحدود ثابت، فلا أصفار.')}}})}}
   ]},

  {st:8,short:'أقطاب الدالة',title:'لحساب أقطاب الدالة',ref:'ص 6',
   q:'الأقطاب أهم من الأصفار في التحكم… فماذا تخبرنا أرقامها عن سلوك النظام؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المستوى المركب: ثلاثة أقطاب كلها في الجهة اليسرى المظللة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="48" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">» roots(d)</text><g data-tip="الجهة اليسرى من المحور التخيلي: الجزء الحقيقي فيها سالب. إذا وقعت كل الأقطاب فيها فالنظام مستقر وتهدأ استجابته."><rect x="40" y="66" width="260" height="206" rx="10" fill="#CFE6DB" opacity="0.75"/></g><line x1="34" y1="170" x2="323.0" y2="170.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M334.0 170.0 L323.0 175.5 L323.0 164.5 Z" fill="#2C4A40"/><line x1="300" y1="276" x2="300.0" y2="73.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M300.0 62.0 L305.5 73.0 L294.5 73.0 Z" fill="#2C4A40"/><text x="326" y="160" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Re</text><text x="314" y="72" text-anchor="start" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">Im</text><g data-tip="قطب حقيقي عند ⟦−3.5115⟧."><line x1="74.3" y1="162" x2="90.3" y2="178" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="74.3" y1="178" x2="90.3" y2="162" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><text x="82.3" y="196" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">-3.5115</text><rect x="52.3" y="156" width="60" height="46" fill="transparent"/></g><g data-tip="قطبان مركّبان مترافقان ⟦−0.2442 ± 0.4745i⟧: يعنيان استجابة فيها تأرجح بسيط، وجزؤهما الحقيقي الصغير يعني هدوءاً بطيئاً. الحرف ⟦i⟧ هو الجزء التخيلي."><line x1="276.9" y1="100.3" x2="292.9" y2="116.3" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="276.9" y1="116.3" x2="292.9" y2="100.3" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="276.9" y1="223.7" x2="292.9" y2="239.7" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="276.9" y1="239.7" x2="292.9" y2="223.7" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><text x="196" y="96.3" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">-0.2442 + 0.4745i</text><text x="196" y="255.7" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">-0.2442 - 0.4745i</text><rect x="120" y="90" width="180" height="170" fill="transparent"/></g><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الأقطاب: جذور المقام</text></svg>`,
   cap:'الأقطاب الثلاثة على المستوى المركب: قطب حقيقي وقطبان مركّبان مترافقان، وكلها في الجهة اليسرى.<br><b>مرّر المؤشر على الأقطاب وعلى المنطقة المظللة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الجزء الحقيقي لكل الأقطاب سالب (<span class="ltr">−3.5115</span> و <span class="ltr">−0.2442</span>). ماذا يعني ذلك؟',opts:[
     ['النظام غير مستقر ويزيد خرجه بلا حد',false,'العكس: الجزء الحقيقي السالب لكل الأقطاب يعني استقراراً.'],
     ['لا يعني شيئاً، المهم الجزء التخيلي فقط',false,'الجزء الحقيقي هو الذي يحدد الاستقرار وسرعة الهدوء.'],
     ['النظام مستقر وتهدأ استجابته',true,'إذا كان الجزء الحقيقي لكل الأقطاب سالباً فالنظام مستقر.']]}}
   ],
   body:[
    {book:String.raw`<p><b>لحساب أقطاب الدالة:</b></p><pre class="cl-code">»roots(d)</pre><p>تسجل الإجابة على الشاشة كما يلي:</p><pre class="cl-code">ans=
   -3.5115
   -0.2442 + 0.4745i
   -0.2442 - 0.4745i</pre>`,ref:'ص 6'},
    {tip:String.raw`<p><b>الأقطاب</b> جذور المقام: قيم \(s\) التي تجعل المقام صفراً. والمقام \(s^3+4s^2+2s+1\) من الدرجة الثالثة فله ثلاثة أقطاب.</p>
     <p>الأقطاب هي الأهم في التحكم: إذا كان الجزء الحقيقي لكل الأقطاب سالباً (كما هنا: <span class="ltr">−3.5115</span> و <span class="ltr">−0.2442</span>) فالنظام <b>مستقر</b> وتهدأ استجابته. القطبان المركّبان <span class="ltr">−0.2442 ± 0.4745i</span> يعنيان استجابة فيها تأرجح بسيط، وجزؤهما الحقيقي الصغير يعني أن الهدوء بطيء. الحرف <span class="ltr">i</span> هو الجزء التخيلي \(\sqrt{-1}\).</p>`},
    {title:'مختبر مصغّر: اختر المقام واقرأ أقطابه',widget:(el,B)=>{
 const DS=[[[1,4,2,1],'s^3+4s^2+2s+1','مثال ص 6'],[[1,5,6,0],'s(s+2)(s+3)','السؤال الأول'],[[1,3,2,0],'s(s+1)(s+2)','السؤال الثاني']];
 const R=z=>{const f=v=>{const a=Math.abs(v)<1e-12?0:v;return Number.isInteger(a)?String(a):a.toFixed(4)};return z.im?f(z.re)+(z.im>0?' + ':' - ')+f(Math.abs(z.im))+'i':f(z.re)};
 const plane=ps=>{const W=320,H=150,X=v=>20+(v+4)*(W-40)/5,Y=v=>H/2-v*(H/2-18);let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="المستوى المركب: الأقطاب ×" style="font-family:var(--font)" direction="ltr"><rect x="20" y="10" width="${X(0)-20}" height="${H-20}" fill="var(--on-soft)"/><path d="M14 ${Y(0)}H${W-8}M${X(0)} 8V${H-8}" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let k=-4;k<=1;k++)s+=`<path d="M${X(k)} ${Y(0)-4}V${Y(0)+4}" stroke="var(--fg)"/><text x="${X(k)}" y="${Y(0)+17}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${k}</text>`;
  ps.forEach(z=>{const x=X(z.re),y=Y(z.im);s+=`<path d="M${x-7} ${y-7}L${x+7} ${y+7}M${x-7} ${y+7}L${x+7} ${y-7}" stroke="var(--stop)" stroke-width="2.8"/>`});
  return s+`<text x="${W-10}" y="${H-8}" text-anchor="end" font-size="11" fill="var(--muted)">Real →</text><text x="${X(0)-5}" y="22" text-anchor="end" font-size="11" fill="var(--muted)">Imag</text></svg>`};
 DCML.lab(el,B,{intro:'اختر مقاماً من دوال الكتاب، وشاهد ما يطبعه '+DCML.lt('roots(d)')+' وأين تقع الأقطاب (×). المنطقة الخضراء = الجهة اليسرى (الجزء الحقيقي سالب).',
  predict:{q:'في السؤال الأول المقام \\(s(s+2)(s+3)\\). أي قطب تعرفه دون أي حساب؟',opts:[
   ['\\(s=2\\)',false,'العامل \\((s+2)\\) يصبح صفراً عند \\(s=-2\\) لا \\(+2\\).'],
   ['\\(s=0\\)',true,'العامل \\(s\\) وحده يصبح صفراً عند \\(s=0\\)، فهو قطب على محور التخيلي نفسه.'],
   ['\\(s=1\\)',false,'لا يوجد عامل \\((s-1)\\) في المقام.']]},
  ins:[{k:'k',l:'المقام d(s)',seg:DS.map((x,i)=>[i,DCML.lt('d=['+x[0].join(' ')+']')+' — '+x[2]]),v:0}],
  calc:(s)=>{const [c,txt]=DS[s.k],p=proots(c),z0=p.some(v=>Math.abs(v.re)<1e-9&&Math.abs(v.im)<1e-9);
   return {pic:plane(p),facts:[['d(s)',txt],['عدد الأقطاب',String(p.length),'hi']],cls:z0?'warn':'',
    msg:code('>> roots(d)\nans =\n'+p.map(v=>'   '+R(v)).join('\n'))+(z0?'أحد الأقطاب عند \\(s=0\\) (لا هو يمين ولا يسار): يعمل مثل «مجمّع»، فيبقى خرج الاستجابة للخطوة يزيد ولا يستقر (المحطة 12).':'كل الأقطاب جزؤها الحقيقي سالب (في الجهة اليسرى)، فالنظام مستقر وتهدأ استجابته.')}}})}}
   ]},

  {st:9,short:'رسم الأصفار والأقطاب',title:'رسم الأصفار والأقطاب — الشكل <span class="ltr">(1-1)</span>',ref:'ص 6–7',
   q:'الأرقام وحدها لا تكفي… كيف نرى الأصفار والأقطاب على رسم واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نافذة Root Locus: ثلاثة أقطاب وصفر مزدوج وفروع تخرج من الأقطاب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="30" y="36" width="300" height="214" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="30" y="36" width="300" height="24" rx="8" fill="#2C4A40"/><text x="180" y="53" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Root Locus</text><rect x="60" y="70" width="255" height="150" fill="#FFFFFF" stroke="#2C4A40" stroke-width="1.5"/><line x1="60" y1="145" x2="315" y2="145" stroke="#8A9A94" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 4"/><text x="60.0" y="234" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">-6</text><text x="145.0" y="234" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">-4</text><text x="230.0" y="234" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">-2</text><text x="315.0" y="234" text-anchor="middle" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0</text><text x="56" y="74.0" text-anchor="end" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0.8</text><text x="56" y="149.0" text-anchor="end" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0</text><text x="56" y="224.0" text-anchor="end" font-size="10" fill="#2C4A40" font-family="var(--mono)" direction="ltr">-0.8</text><g data-tip="فرع يبدأ من القطب ⟦−3.5115⟧ ويتجه يساراً مبتعداً."><line x1="165.8" y1="145" x2="61" y2="145" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><rect x="60" y="138" width="110" height="14" fill="transparent"/></g><g data-tip="فرعان يبدآن من القطبين المركّبين وينتهيان عند الصفر المزدوج ⟦−1⟧."><path d="M304.6 100.5 C298 90 288 88 282 103 C277 116 273.5 132 272.5 145" fill="none" stroke="#12855A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M304.6 189.5 C298 200 288 202 282 187 C277 174 273.5 158 272.5 145" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="268" y="86" width="40" height="118" fill="transparent"/></g><g data-tip="القطب (×): جذر من جذور المقام، ومنه يبدأ فرع."><line x1="158.8" y1="138" x2="172.8" y2="152" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round"/><line x1="158.8" y1="152" x2="172.8" y2="138" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round"/><line x1="297.6" y1="93.5" x2="311.6" y2="107.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><line x1="297.6" y1="107.5" x2="311.6" y2="93.5" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><line x1="297.6" y1="182.5" x2="311.6" y2="196.5" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="297.6" y1="196.5" x2="311.6" y2="182.5" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/></g><g data-tip="الصفر (○): جذر البسط، وهنا مزدوج عند ⟦−1⟧؛ عنده تنتهي الفروع."><circle cx="272.5" cy="145" r="7" fill="#FFFFFF" stroke="#2C4A40" stroke-width="3"/></g><text x="180" y="282" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">» rlocus(n,d)</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-1)</span>: الأقطاب ×، والصفر المزدوج ○، والفروع الملونة.<br><b>مرّر المؤشر على العلامات والفروع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل <span class="ltr">(1-1)</span>، من أين تبدأ الفروع الملونة وإلى أين تتجه؟',opts:[
     ['تبدأ من الأصفار وتنتهي عند الأقطاب',false,'العكس: كل فرع يبدأ من قطب.'],
     ['تبدأ من الأقطاب (×)، وتنتهي عند صفر (○) أو تبتعد',true,'فرعان ينتهيان عند الصفر المزدوج −1، والثالث يبتعد يساراً.'],
     ['كلها خطوط مستقيمة على المحور الحقيقي',false,'فرعا القطبين المركّبين منحنيان، وفرع واحد فقط على المحور الحقيقي.']]}}
   ],
   body:[
    {book:String.raw`<p>لرسم جذور البسط التي تمثل الأصفار وجذور المقام التي تمثل الأقطاب (شكل <span class="ltr">1-1</span>):</p><pre class="cl-code">»rlocus(n,d)</pre><div class="svgbox" style="max-width:600px;margin-inline:auto">`+rlocusFig(NB,DB)+String.raw`</div><p class="sub">شكل <span class="ltr">1-1</span>: أصفار وأقطاب الدالة</p>`,ref:'ص 6–7'},
    {tip:String.raw`<p>الأمر <span class="ltr">rlocus</span> يرسم أكثر من الأصفار والأقطاب: يرسم «المحل الهندسي للجذور»، أي أين تتحرك أقطاب النظام إذا أغلقنا عليه حلقة تحكم وكبّرنا الكسب \(K\) من الصفر. كل فرع يبدأ من قطب (×) وينتهي عند صفر (○) أو يذهب بعيداً. سترى أثر الكسب على الحلقة المغلقة في الوحدة الثالثة.</p>`},
    {watch:String.raw`<p>الأمر <span class="ltr">rlocus</span> يرسم المحل الهندسي للجذور كاملاً، والأصفار والأقطاب علامات عليه فقط. لرسم الأصفار والأقطاب وحدها يوجد أمر آخر هو <span class="ltr">pzmap(n,d)</span> (غير مذكور في الكتاب).</p>`},
    {watch:String.raw`<p>عنوان الشكل <span class="ltr">(1-1)</span> في الكتاب «أصفار وأقطاب الدالة»، لكن الأمر <span class="ltr">rlocus</span> الذي رسمه يرسم المحل الهندسي للجذور كاملاً، لا الأصفار والأقطاب وحدها.</p>`,fix:true},
    {title:'مختبر مصغّر: كبّر الكسب وتابع الأقطاب على الفروع',widget:(el,B)=>{
 const RL=rlocusData(NB,DB),X0=-6,X1=0.5;
 const curves=RL.br.map(b=>({pts:b.filter(z=>z.re>=X0&&z.re<=X1&&Math.abs(z.im)<=1.4).map(z=>[z.re,z.im]),col:'--muted',w:2}));
 const f=v=>(Math.abs(v)<5e-5?0:v).toFixed(3);
 DCML.lab(el,B,{intro:'الأمر '+DCML.lt('rlocus(n,d)')+' يرسم أين تتحرك أقطاب الحلقة المغلقة كلما كبر الكسب \\(K\\) من الصفر. حرّك \\(K\\) (رقم تختاره أنت) وتابع النقاط البرتقالية على الفروع الرمادية لدالة ص 6.',
  predict:{q:'نكبّر \\(K\\) كثيراً. إلى أين يتجه القطبان المركّبان؟',opts:[
   ['إلى الجهة اليمنى فيصبح النظام غير مستقر',false,'فروع هذه الدالة كلها في الجهة اليسرى من المستوى.'],
   ['لا يتحركان، فالأقطاب ثابتة',false,'الأقطاب ثابتة للدالة وحدها (\\(K=0\\))، أما مع الحلقة المغلقة فتتحرك مع \\(K\\)، وهذا ما يرسمه rlocus.'],
   ['نحو الصفر المزدوج عند \\(-1\\)',true,'كل فرع يبدأ من قطب وينتهي عند صفر أو يبتعد: القطبان المركّبان ينتهيان عند الصفرين \\(-1\\)، والقطب الحقيقي يبتعد يساراً.']]},
  ins:[{k:'g',l:'الكسب K (أرقام تختارها أنت)',min:-2,max:2,step:0.01,v:-2,fmt:v=>{const K=Math.pow(10,v);return K<0.1?K.toFixed(3):K<10?K.toFixed(2):K.toFixed(0)}}],
  calc:(s)=>{const K=Math.pow(10,s.g),nn=[0].concat(NB),c=DB.map((v,j)=>v+K*nn[j]),p=proots(c);
   const dots=RL.poles.map(z=>[z.re,z.im,'--stop']).concat(p.filter(z=>z.re>=X0).map(z=>[z.re,z.im,'--live']));
   const out=p.filter(z=>z.re<X0);
   return {plot:{xr:[X0,X1],yr:[-1.4,1.4],xl:'Real',yl:'Imag',curves,dots:[[-1,0,'--on']].concat(dots),xt:[-6,-5,-4,-3,-2,-1,0],yt:[-1,0,1],fx:v=>String(v),fy:v=>String(v)},
    facts:[['عدد الأقطاب في الجهة اليسرى',p.filter(z=>z.re<0).length+' / 3','hi']],
    msg:code('poles =\n'+p.map(z=>'   '+f(z.re)+(z.im?(z.im>0?' + ':' - ')+f(Math.abs(z.im))+'i':'')).join('\n'))+'الأحمر = أقطاب الدالة وحدها عند \\(K=0\\)، والنقطة الخضراء عند \\(-1\\) = الصفر المزدوج، والخطوط الرمادية = الفروع، والبرتقالي = أقطاب الحلقة المغلقة عند هذا الكسب، وهي جذور \\(d(s)+K\\,n(s)\\).'+(out.length?' القطب الحقيقي خرج من حدود الرسم إلى اليسار (انظر قيمته فوق).':'')+' كل الأقطاب في الجهة اليسرى: الحلقة مستقرة لكل قيم الكسب هنا.'}}})}}
   ]},

  {st:10,short:'المسح والاستجابة للخطوة',title:'المسح، والاستجابة للخطوة',ref:'ص 7',
   q:'امتلأت الشاشة بالأوامر والرسوم… كيف تبدأ من جديد، ثم ترى كيف يتصرف النظام مع الزمن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات: clf لمسح الرسم، clc لمسح نافذة الأوامر، step لرسم الاستجابة للخطوة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="⟦clf⟧: يمسح الرسم من نافذة الشكل، وتبقى الأوامر والمتغيرات."><rect x="236" y="64" width="98" height="170" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="250" y="84" width="70" height="62" rx="4" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2"/><path d="M256 136 C270 136 276 100 314 98" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/><line x1="275" y1="105" x2="295" y2="125" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><line x1="275" y1="125" x2="295" y2="105" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><text x="285" y="196" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">clf</text><text x="285" y="220" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">مسح الرسم</text></g><g data-tip="⟦clc⟧: يمسح ما كُتب في نافذة الأوامر، والمتغيرات ⟦n⟧ و⟦d⟧ تبقى محفوظة."><rect x="131" y="64" width="98" height="170" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="146" y="84" width="72" height="62" rx="4" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2"/><line x1="154" y1="98" x2="206" y2="98" stroke="#B9C4BF" stroke-width="3" stroke-linecap="round"/><line x1="154" y1="110" x2="206" y2="110" stroke="#B9C4BF" stroke-width="3" stroke-linecap="round"/><line x1="154" y1="122" x2="206" y2="122" stroke="#B9C4BF" stroke-width="3" stroke-linecap="round"/><text x="156" y="140" text-anchor="start" font-size="10" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">&gt;&gt;</text><text x="180" y="196" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">clc</text><text x="180" y="220" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">مسح الشاشة</text></g><g data-tip="⟦step(n,d)⟧: يرسم خرج النظام (المتصل) عندما يقفز الدخل (المتقطع) فجأة إلى قيمة ثابتة ويبقى عليها."><rect x="26" y="64" width="98" height="170" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="42" y="84" width="72" height="62" rx="4" fill="#FFFFFF" stroke="#2C4A40" stroke-width="2"/><path d="M48 138 H58 V100 H108" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3"/><path d="M48 138 H58 C66 138 72 104 108 104" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="75" y="196" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">step(n,d)</text><text x="75" y="220" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">الاستجابة للخطوة</text></g><text x="180" y="272" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أمران للمسح، وأمر للرسم</text></svg>`,
   cap:'ثلاثة أوامر بترتيب الكتاب: <span class="ltr">clf</span> و <span class="ltr">clc</span> للمسح، و <span class="ltr">step</span> للرسم.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف ماذا يفعل الأمر.</b>',
   side:[
    {predict:{q:'تريد إزالة الرسم من نافذة الشكل فقط، مع إبقاء ما كتبته في نافذة الأوامر. أي أمر تستعمل؟',opts:[
     ['<span class="ltr">clc</span>',false,'clc يمسح نافذة الأوامر، لا الرسم.'],
     ['<span class="ltr">step(n,d)</span>',false,'هذا يرسم استجابة جديدة، لا يمسح.'],
     ['<span class="ltr">clf</span>',true,'الكتاب في ص 7: لمسح الرسم من الشاشة نستعمل الأمر clf.']]}}
   ],
   body:[
    {book:String.raw`<p>لمسح الرسم من الشاشة نستعمل الأمر:</p><pre class="cl-code">»clf</pre><p>لمسح البرنامج من الشاشة نستعمل الأمر:</p><pre class="cl-code">»clc</pre><p>لرسم استجابة النظام لإشارة الخطوة نستعمل الأمر:</p><pre class="cl-code">»step(n,d)</pre>`,ref:'ص 7'},
    {tip:String.raw`<p><b>إشارة الخطوة</b> دخل يقفز فجأة من 0 إلى 1 عند \(t=0\) ويبقى ثابتاً، مثل أن تضغط مفتاح التشغيل. الاستجابة للخطوة تخبرنا: إلى أي قيمة يصل الخرج، وبأي سرعة، وهل يتجاوزها ثم يرجع. القيمة النهائية هنا \(G(0)=\frac{1}{1}=1\) (نضع \(s=0\)). والاستجابة بطيئة لأن قطبين جزؤهما الحقيقي صغير <span class="ltr">(−0.2442)</span>.</p><div class="svgbox" style="max-width:600px;margin-inline:auto">`+stepFig(NB,DB)+String.raw`</div><p class="sub">ناتج الأمر <span class="ltr">step(n,d)</span> للدالة السابقة (الكتاب لا يعرض هذا الرسم).</p>`,title:'ماذا يرسم step؟'},
    {watch:String.raw`<p><span class="ltr">clc</span> يمسح الكتابة من نافذة الأوامر فقط؛ المتغيرات <span class="ltr">n</span> و <span class="ltr">d</span> تبقى محفوظة، فتستطيع كتابة <span class="ltr">step(n,d)</span> بعده مباشرة.</p>`},
    {title:'مختبر مصغّر: أي أمر تكتب؟',widget:(el,B)=>{const L=DCML.lt;DCML.sort(el,B,{intro:'لكل موقف اختر الأمر الذي يحققه من أوامر ص 7.',cats:['clf','clc','step(n,d)'],items:[
 ['تريد إزالة الرسم من نافذة الشكل.',0,'«لمسح الرسم من الشاشة نستعمل الأمر clf».'],
 ['امتلأت نافذة الأوامر بالكتابة وتريد مسحها.',1,'«لمسح البرنامج من الشاشة نستعمل الأمر clc».'],
 ['تريد أن ترى كيف يتصرف النظام مع الزمن عند إشارة الخطوة.',2,'«لرسم استجابة النظام لإشارة الخطوة نستعمل الأمر step(n,d)».'],
 ['مسحت نافذة الأوامر، وتريد الآن رسم الاستجابة دون إعادة إدخال '+L('n')+' و '+L('d')+'.',2,'clc يمسح الكتابة فقط، والمتغيرات تبقى محفوظة، فتكتب step(n,d) مباشرة.']]})}}
   ]},

  {st:11,short:'استعمال SIMULINK',title:'استعمال <span class="ltr">SIMULINK</span>',ref:'ص 7–8',
   q:'بدل كتابة الأوامر… هل يمكن أن نرسم النظام صناديق ونشغّله كأنه دائرة حقيقية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط Simulink: Step ثم Transfer Fcn ثم Scope، وفوقها أسماء مجموعاتها، وأعلاها قائمة التشغيل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="لتشغيل المحاكاة: ⟦Simulation⟧ ثم ⟦Start⟧ (في الإصدارات الحديثة زر ⟦Run⟧)."><rect x="90" y="36" width="180" height="28" rx="8" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="55" text-anchor="middle" font-size="12.5" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">Simulation ▸ Start</text></g><g data-tip="⟦Step⟧ من مجموعة ⟦Sources⟧ (المصادر): يعطي إشارة الخطوة."><rect x="26" y="124" width="60" height="52" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M36 166 H52 V136 H78" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="56.0" y="194" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Step</text><rect x="22.0" y="90" width="68" height="20" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="56.0" y="104" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">Sources</text></g><g data-tip="⟦Transfer Fcn⟧ من مجموعة ⟦Linear⟧ (في الإصدارات الحديثة ⟦Continuous⟧): نكتب فيه البسط والمقام."><rect x="128" y="124" width="104" height="52" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="144" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(s)</text><line x1="156" y1="150" x2="204" y2="150" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><text x="180" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">d(s)</text><text x="180.0" y="194" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Transfer Fcn</text><rect x="146.0" y="90" width="68" height="20" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="180.0" y="104" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">Linear</text></g><g data-tip="⟦Scope⟧ من مجموعة ⟦Sinks⟧ (أجهزة العرض): ننقر عليه مرتين فتظهر الاستجابة."><rect x="274" y="124" width="60" height="52" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="282" y="132" width="44" height="34" rx="3" fill="#1F3A33"/><path d="M286 160 C296 160 300 140 322 140" fill="none" stroke="#F2C14E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="304.0" y="194" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Scope</text><rect x="270.0" y="90" width="68" height="20" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="1.5"/><text x="304.0" y="104" text-anchor="middle" font-size="10.5" fill="#2C4A40" font-weight="600" font-family="var(--mono)" direction="ltr">Sinks</text></g><line x1="86" y1="150" x2="117.0" y2="150.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M128.0 150.0 L117.0 155.5 L117.0 144.5 Z" fill="#2C4A40"/><line x1="232" y1="150" x2="263.0" y2="150.0" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M274.0 150.0 L263.0 155.5 L263.0 144.5 Z" fill="#2C4A40"/><text x="180" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">انقر مرتين على <tspan direction="ltr" unicode-bidi="embed">Scope</tspan> لترى الاستجابة</text><text x="180" y="272" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">ابنِ المخطط ← شغّل ← اعرض</text></svg>`,
   cap:'أبسط مخطط: مصدر خطوة ← دالة التحويل ← جهاز العرض، وفوق كل كتلة اسم مجموعتها في المكتبة.<br><b>مرّر المؤشر على الكتل وعلى القائمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بنيت المخطط وشغّلت المحاكاة. كيف ترى النتيجة؟',opts:[
     ['تظهر تلقائياً في نافذة الأوامر',false,'النتيجة لا تُطبع في نافذة الأوامر.'],
     ['ننقر مرتين على أيقونة جهاز العرض <span class="ltr">Scope</span>',true,'نص الكتاب في ص 8: للحصول على النتائج ننقر مرتين على أيقونة جهاز العرض Scope فتظهر الاستجابة.'],
     ['نكتب الأمر <span class="ltr">clf</span>',false,'clf يمسح الرسم، لا يعرضه.']]}}
   ],
   body:[
    {book:String.raw`<p><b>استعمال <span class="ltr">SIMULINK</span></b> يسهل تمثيل النظم بالرجوع إلى رسوم جاهزة وربطها ببعضها ثم تشغيلها.</p><p>لرسم مخطط باستعمال <span class="ltr">Simulink</span> نقوم بما يلي:</p><ul><li>فتح <span class="ltr">Simulink</span></li><li>التعرف على نوافذ <span class="ltr">Simulink</span></li><li>التعرف على العناصر الأساسية التي سنستخدمها مثل <span class="ltr">Sources</span> و <span class="ltr">Sinks</span> و <span class="ltr">Linear</span></li><li>فتح صفحة جديدة لتمثيل النظام المراد دراسته والاستعانة بالمدرب لبناء المخطط</li><li>لتشغيل المحاكاة ننقر على <span class="ltr">Simulation</span> ثم <span class="ltr">Start</span></li><li>للحصول على النتائج ننقر مرتين على أيقونة جهاز العرض <span class="ltr">Scope</span> فتظهر الاستجابة.</li></ul>`,ref:'ص 7–8'},
    {tip:String.raw`<div class="svgbox" style="max-width:600px;margin-inline:auto">`+slkSVG({num:'s^2+2s+1',den:'s^3+4s^2+2s+1'})+String.raw`</div><p>الكتلة <span class="ltr">Step</span> من مجموعة <span class="ltr">Sources</span> (المصادر)، والكتلة <span class="ltr">Scope</span> من <span class="ltr">Sinks</span> (أجهزة العرض)، والكتلة <span class="ltr">Transfer Fcn</span> من <span class="ltr">Linear</span> (في الإصدارات الحديثة اسمها <span class="ltr">Continuous</span>). الكتاب لا يضم صورة لنوافذ <span class="ltr">Simulink</span> ولا لمخطط، فهذا الرسم منا.</p>`,title:'المخطط لدالة الكتاب'},
    {watch:String.raw`<p>كتلة <span class="ltr">Step</span> في <span class="ltr">Simulink</span> تقفز عند الزمن <span class="ltr">1 s</span> (القيمة الافتراضية)، وزمن المحاكاة الافتراضي <span class="ltr">10 s</span>؛ أما الأمر <span class="ltr">step</span> في نافذة الأوامر فيبدأ القفزة عند الصفر ويختار الزمن وحده. غيّر <span class="ltr">Stop time</span> إذا لم تكتمل الاستجابة.</p>`},
    {title:'مختبر مصغّر: رتّب خطوات Simulink',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي يذكره الكتاب (ص 7–8).',steps:[
 ['فتح Simulink','لا يمكن عمل شيء قبل فتح البرنامج.'],
 ['التعرف على نوافذ Simulink','نتعرف على النوافذ قبل أن نختار منها العناصر.'],
 ['التعرف على العناصر الأساسية مثل Sources و Sinks و Linear','العناصر نحتاجها لبناء المخطط، فنتعرف عليها قبله.'],
 ['فتح صفحة جديدة وبناء المخطط بمساعدة المدرب','نبني المخطط قبل أن نشغّله.'],
 ['تشغيل المحاكاة: Simulation ثم Start','لا نتائج قبل التشغيل.'],
 ['النقر مرتين على أيقونة Scope لرؤية الاستجابة','هذه آخر خطوة: نرى النتيجة بعد التشغيل.']],
 done:'هذا ترتيب الكتاب. لاحظ أن رؤية النتيجة تأتي بعد التشغيل، والتشغيل بعد بناء المخطط.'})}
   ]},

  {st:12,short:'أسئلة ومناقشة',title:'أسئلة ومناقشة',ref:'ص 8',
   q:'دالتان جديدتان مقامهما أقواس مضروبة… كيف تدخلهما في البرنامج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان للدالتين في أسئلة التجربة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="36" y="40" width="288" height="92" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="302" cy="64" r="13" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="302" y="69" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="110" y="92" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G(s) =</text><text x="214" y="78" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">s + 1</text><g data-tip="المقام مكتوب أقواساً مضروبة؛ اضربها أولاً لتحصل على المعاملات، ولا تنس أن الثابت صفر."><line x1="150" y1="88" x2="278" y2="88" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="214" y="112" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">s(s+2)(s+3)</text><rect x="148" y="92" width="132" height="28" fill="transparent"/></g><rect x="36" y="150" width="288" height="92" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="302" cy="174" r="13" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="302" y="179" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="110" y="202" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G(s) =</text><text x="214" y="188" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><g data-tip="المقام مكتوب أقواساً مضروبة؛ اضربها أولاً لتحصل على المعاملات، ولا تنس أن الثابت صفر."><line x1="150" y1="198" x2="278" y2="198" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="214" y="222" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">s(s+1)(s+2)</text><rect x="148" y="202" width="132" height="28" fill="transparent"/></g><text x="180" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الأصفار والأقطاب بـ <tspan direction="ltr" unicode-bidi="embed">MATLAB</tspan></text><text x="180" y="294" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">والاستجابة للخطوة بـ <tspan direction="ltr" unicode-bidi="embed">Simulink</tspan></text></svg>`,
   cap:'دالتا أسئلة التجربة كما في ص 8.<br><b>مرّر المؤشر على المقام (أو المسه في الجوال) لتعرف أول خطوة في الحل.</b>',
   side:[
    {predict:{q:'في الدالة الأولى المقام \\(s(s+2)(s+3)=s^3+5s^2+6s\\). ما صف المقام الصحيح؟',opts:[
     ['<span class="ltr">d=[1 5 6];</span>',false,'نقص معامل الثابت (صفر)، فصار الصف لكثيرة حدود أخرى هي \\(s^2+5s+6\\).'],
     ['<span class="ltr">d=[0 6 5 1];</span>',false,'الترتيب معكوس: الصف يبدأ من أعلى قوة.'],
     ['<span class="ltr">d=[1 5 6 0];</span>',true,'الثابت صفر ويجب كتابته، والترتيب من أعلى قوة إلى الثابت.']]}}
   ],
   body:[
    {book:String.raw`<p>لدينا دالة التحويل التالية:</p>$$1)\;\; G(s)=\frac{s+1}{s(s+2)(s+3)} \qquad\qquad 2)\;\; G(s)=\frac{2}{s(s+1)(s+2)}$$<ul><li>أوجد الأصفار والأقطاب باستخدام برنامج <span class="ltr">MATLAB</span> لكل دالة.</li><li>ارسم الاستجابة الزمنية لإشارة الخطوة للدالتين باستخدام <span class="ltr">Simulink</span></li></ul>`,ref:'ص 8'},
    {title:'مختبر مصغّر: صفّا الدالة الثانية',widget:(el,B)=>{const L=DCML.lt;DCML.cases(el,B,{intro:'الدالة الثانية في الأسئلة: \\(G(s)=\\frac{2}{s(s+1)(s+2)}\\)، ومقامها بعد الضرب \\(s^3+3s^2+2s\\).',cases:[
 {q:'ما صف البسط؟',opts:[
  [L('n=[2 0];'),false,'هذا يعني \\(2s\\)، أي كثيرة حدود أخرى.'],
  [L('n=[1 2];'),false,'هذا يعني \\(s+2\\).'],
  [L('n=[2];'),true,'البسط ثابت واحد، فالصف عنصر واحد.']]},
 {q:'ما صف المقام؟',opts:[
  [L('d=[1 3 2 0];'),true,'الثابت صفر ويجب كتابته، والترتيب من أعلى قوة.'],
  [L('d=[1 3 2];'),false,'نقص الصفر الأخير فصار الصف لـ \\(s^2+3s+2\\).'],
  [L('d=[0 2 3 1];'),false,'الترتيب معكوس: الصف يبدأ من أعلى قوة.']]}]})}},
    {tip:String.raw`<details class="cl-q"><summary>1: أوجد الأصفار والأقطاب باستخدام برنامج MATLAB لكل دالة.</summary><div class="cl-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نضرب أقواس المقام أولاً لأن <span class="ltr">MATLAB</span> يحتاج المعاملات: \(s(s+2)(s+3)=s^3+5s^2+6s\) و \(s(s+1)(s+2)=s^3+3s^2+2s\) (معامل الثابت صفر ويجب كتابته).<pre class="cl-code">n=[1 1];  d=[1 5 6 0];
roots(n)   →  -1
roots(d)   →  0 , -3 , -2</pre><pre class="cl-code">n=[2];    d=[1 3 2 0];
roots(n)   →  []   (لا توجد أصفار)
roots(d)   →  0 , -2 , -1</pre></div></details><details class="cl-q"><summary>2: ارسم الاستجابة الزمنية لإشارة الخطوة للدالتين باستخدام Simulink.</summary><div class="cl-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> نضع في كتلة <span class="ltr">Transfer Fcn</span> البسط والمقام السابقين ونشغّل. في الدالتين قطب عند الصفر (العامل \(s\) في المقام) وهو يعمل مثل «مجمّع»: يبقى الخرج يزيد ولا يستقر، وبعد زوال البداية يصبح خطاً مستقيماً صاعداً. ميله في الدالة الأولى \(\frac{1}{2\times 3}=\frac{1}{6}\) لكل ثانية، وفي الثانية \(\frac{2}{1\times 2}=1\) لكل ثانية. جرّب ذلك في المختبر (في نافذة الأوامر وفي <span class="ltr">Simulink</span>).</div></details>`,title:'إجابات مقترحة — افتحها بعد أن تحاول'},
    {watch:String.raw`<p>في الدالة الثانية البسط رقم واحد فقط: <span class="ltr">n=[2];</span>، فلا توجد أصفار، ويطبع <span class="ltr">roots(n)</span> صفاً فارغاً <span class="ltr">[]</span>.</p>`}
   ]},

  {recap:[
   String.raw`دالة التحويل \(G(s)=\frac{n(s)}{d(s)}\): بسط ومقام، وكلاهما كثيرة حدود في \(s\) (ص 5).`,
   String.raw`ندخل كثيرة الحدود صفاً من المعاملات من أعلى قوة إلى الثابت، ونكتب حتى المعاملات الصفرية: <span class="ltr">p=[1 0 3 1];</span> (ص 5–6).`,
   String.raw`<span class="ltr">tf(n,d)</span> يكتب الدالة، و<span class="ltr">roots(n)</span> يعطي الأصفار، و<span class="ltr">roots(d)</span> يعطي الأقطاب، و<span class="ltr">rlocus(n,d)</span> يرسمها — الشكل <span class="ltr">(1-1)</span> (ص 6–7).`,
   String.raw`<span class="ltr">clf</span> يمسح الرسم، و<span class="ltr">clc</span> يمسح الشاشة، و<span class="ltr">step(n,d)</span> يرسم الاستجابة لإشارة الخطوة (ص 7).`,
   String.raw`في <span class="ltr">Simulink</span> نبني المخطط من <span class="ltr">Sources</span> و<span class="ltr">Linear</span> و<span class="ltr">Sinks</span>، ونشغّله بـ <span class="ltr">Simulation</span> ثم <span class="ltr">Start</span>، ونرى النتيجة بالنقر مرتين على <span class="ltr">Scope</span> (ص 7–8).`]}
],
 theory:[
  {h:'تمهيد',ref:'ص 3',html:`<p>هذا هو الكتاب الخاص بالمنهج العملي لمقرر «تقنية التحكم الآلي»، لمتدربي الكليات التقنية تخصص «الآلات الكهربائية»، لما للجانب التطبيقي من أهمية في التحصيل العملي وترسيخ المفاهيم لدى المتدرب.</p>
   <p>يتعلم المتدرب من هذه التجارب خصائص التحكم في الحلقة المفتوحة والمغلقة، وخصائص نظم الرتبة الأولى، وتأثير الحاكمات بأنواعها المختلفة على الوحدة المحكومة، واستخدام برنامج ${lt('Matlab')} في أنظمة التحكم. وقد وُضعت عشر تجارب مبينة في الفهرس.</p>
   <p>وقد روعي عند إعداد هذه التجارب المختبرات والأجهزة المتوفرة، وهي مختبر ${lt('Com3Lab')} من شركة ${lt('Leybold')} الألمانية، المتوفر في كثير من الكليات التقنية في المملكة؛ وقد تُرجمت ملفاته وحُررت مختبرات تتناسب مع محتوياته، وهي قاعدة يمكن تطويرها.</p>`},
  {note:ADD+'الحقيبة دليل عملي فقط: لا تشرح النظرية. لذلك أضفنا في كل درس شرحاً قصيراً بكلمات بسيطة، وكل إضافة مكتوب عليها «توضيح للمتدرب — ليس من الكتاب». وفي كل درس «مختبر» افتراضي تجري فيه التجربة بنفسك.'},
  {h:'الوحدة الأولى: أساسيات برنامج MATLAB',ref:'ص 4–5',html:`<p><b>الهدف من التجربة:</b> أن يتدرب المتدرب من خلال هذه التجربة على:</p><ul><li>أساسيات برنامج ماتلاب ${lt('MATLAB')}.</li><li>أساسيات برنامج ${lt('SIMULINK')}.</li></ul>
   <p><b>الأجهزة ومكونات التجربة:</b></p><ul><li>جهاز حاسب.</li><li>برنامج ${lt('MATLAB')} و ${lt('Simulink')} محتوياً على الملف الذي يشمل الأدوات الرياضية التي يمكن استعمالها في الحسابات والرسومات وهو ${lt('Control Tool Box')}.</li></ul>`},
  {note:ADD+`${lt('MATLAB')} برنامج حسابات: تكتب فيه أمراً في «نافذة الأوامر» بعد العلامة ${lt('&gt;&gt;')} فينفذه فوراً. و${lt('Simulink')} جزء منه نرسم فيه النظام على شكل «صناديق» موصولة بأسهم ثم نشغله. والأوامر ${lt('tf')} و${lt('step')} و${lt('rlocus')} تأتي من صندوق أدوات التحكم (اسمه الرسمي ${lt('Control System Toolbox')}).`},
  {h:'تعريف دالة التحويل',ref:'ص 5',html:`<p>بعد تشغيل برنامج ماتلاب نعرف دالة التحويل كما يلي:</p>$$G(s)=\\frac{n(s)}{d(s)}$$<p>حيث إن: \\(n(s)\\) يمثل بسط دالة التحويل، و \\(d(s)\\) يمثل مقام دالة التحويل، وكلاهما يمثل كثيرات الحدود في \\(s\\) ${lt('(Polynomial in s)')}.</p>`},
  {note:ADD+'دالة التحويل «وصفة» تربط خرج النظام بدخله. المتغير \\(s\\) رمز رياضي يمثل التغير مع الزمن: \\(s\\) في المقام يعني أن النظام «يتأخر» ولا يستجيب فوراً. يكفي الآن أن تعرف أن النظام كله يُكتب بكثيرتي حدود: واحدة فوق (البسط) وواحدة تحت (المقام).'},
  {h:'إدخال كثيرة الحدود',ref:'ص 5–6',html:`<p>يتم إدخال كثيرة الحدود بإدخال معاملاتها على هيئة صف. أدخل كثيرة الحدود التالية:</p>$$p(s)=s^2+3s+1$$<p>معاملات \\(p(s)\\) هي: 1 ، 3 ، 1 فندخلها في ${lt('MATLAB')} كالتالي:</p>${code('» p=[1 3 1];')}
   <p>يجب إدخال جميع المعاملات حتى التي تساوي صفراً.</p><p><b>مثال:</b> أدخل كثيرة الحدود التالية: \\(p(s)=s^3+3s+1\\). معامل \\(s^2\\) هنا يساوي صفراً، ومن ثم ندخل المعاملات كالتالي:</p>${code('» p=[1 0 3 1];')}
   <p><b>مثال:</b> أدخل دالة التحويل التالية:</p>$$G(s)=\\frac{s^2+2s+1}{s^3+4s^2+2s+1}$$<p>فندخلهما في صورة صفين كالتالي:</p>${code('» n=[1 2 1];\n» d=[1 4 2 1];')}`},
  {note:ADD+`المعاملات تُكتب من <b>أعلى قوة إلى الثابت</b>. الفاصلة المنقوطة ${lt(';')} في آخر الأمر تمنع البرنامج من إعادة طباعة الصف على الشاشة؛ جرّب الأمر بدونها في المختبر وانظر الفرق. والعلامة » في الكتاب هي علامة الانتظار في نافذة الأوامر (تظهر في البرنامج هكذا ${lt('&gt;&gt;')})، لا تكتبها أنت.`},
  {h:'كتابة دالة التحويل',ref:'ص 6',html:`<p>يمكن كتابة الدالة في ماتلاب وذلك بكتابة الأمر التالي:</p>${code('»tf(n,d)')}<p>فيظهر على الشاشة:</p>${code('ans ='+tfText(NB,DB))}`},
  {err:`<div class="fixnote">طُبع الأمر في الكتاب ${lt('Tf(n,d)')} بحرف ${lt('T')} كبير. ${lt('MATLAB')} يفرّق بين الحرف الكبير والصغير، والصحيح ${lt('tf(n,d)')}؛ لو كتبت ${lt('Tf')} في البرنامج الحقيقي لظهرت رسالة خطأ (الدالة غير معروفة). في المختبر الافتراضي نقبل الكتابتين ونذكّرك بالصحيح.</div>`},
  {h:'حساب الأصفار والأقطاب',ref:'ص 6',html:`<p><b>لحساب أصفار الدالة:</b></p>${code('»roots(n)')}<p>تسجل الإجابة على الشاشة كما يلي:</p>${code('ans =\n\n   -1\n   -1')}
   <p><b>لحساب أقطاب الدالة:</b></p>${code('»roots(d)')}<p>تسجل الإجابة على الشاشة كما يلي:</p>${code('ans =\n   -3.5115\n   -0.2442 + 0.4745i\n   -0.2442 - 0.4745i')}`},
  {note:ADD+`<b>الأصفار</b> جذور البسط: قيم \\(s\\) التي تجعل الدالة صفراً. <b>الأقطاب</b> جذور المقام: قيم \\(s\\) التي تجعل المقام صفراً. الأقطاب هي الأهم في التحكم: إذا كان الجزء الحقيقي لكل الأقطاب سالباً (كما هنا: ${lt('−3.5115')} و ${lt('−0.2442')}) فالنظام <b>مستقر</b> وتهدأ استجابته. القطبان المركّبان ${lt('−0.2442 ± 0.4745i')} يعنيان استجابة فيها تأرجح بسيط، وجزؤهما الحقيقي الصغير يعني أن الهدوء بطيء. الحرف ${lt('i')} هو الجزء التخيلي \\(\\sqrt{-1}\\).`},
  {h:'رسم الأصفار والأقطاب',ref:'ص 6–7',html:`<p>لرسم جذور البسط التي تمثل الأصفار وجذور المقام التي تمثل الأقطاب (شكل ${lt('1-1')}):</p>${code('»rlocus(n,d)')}`},
  {fig:'(1-1)',ref:'ص 7',caption:'أصفار وأقطاب الدالة — ناتج الأمر <span class="ltr">rlocus(n,d)</span> للدالة السابقة، مرسوم بالحساب: الأقطاب ×، والصفر المزدوج ○ عند <span class="ltr">−1</span>.',draw:()=>`<div class="svgbox" style="max-width:600px;margin-inline:auto">${rlocusFig(NB,DB)}</div>`},
  {note:ADD+`الأمر ${lt('rlocus')} يرسم أكثر من الأصفار والأقطاب: يرسم «المحل الهندسي للجذور»، أي أين تتحرك أقطاب النظام إذا أغلقنا عليه حلقة تحكم وكبّرنا الكسب \\(K\\) من الصفر. كل فرع يبدأ من قطب (×) وينتهي عند صفر (○) أو يذهب بعيداً. لرسم الأصفار والأقطاب وحدها يوجد أمر آخر هو ${lt('pzmap(n,d)')} (غير مذكور في الكتاب). سترى أثر الكسب على الحلقة المغلقة في الوحدة الثالثة.`},
  {h:'المسح، والاستجابة للخطوة',ref:'ص 7',html:`<p>لمسح الرسم من الشاشة نستعمل الأمر:</p>${code('»clf')}<p>لمسح البرنامج من الشاشة نستعمل الأمر:</p>${code('»clc')}<p>لرسم استجابة النظام لإشارة الخطوة نستعمل الأمر:</p>${code('»step(n,d)')}`},
  {fig:'',caption:'ناتج الأمر <span class="ltr">step(n,d)</span> للدالة السابقة (توضيح للمتدرب — الكتاب لا يعرض الرسم).',draw:()=>`<div class="svgbox" style="max-width:600px;margin-inline:auto">${stepFig(NB,DB)}</div>`},
  {note:ADD+`<b>إشارة الخطوة</b> دخل يقفز فجأة من 0 إلى 1 عند \\(t=0\\) ويبقى ثابتاً، مثل أن تضغط مفتاح التشغيل. الاستجابة للخطوة تخبرنا: إلى أي قيمة يصل الخرج، وبأي سرعة، وهل يتجاوزها ثم يرجع. القيمة النهائية هنا \\(G(0)=\\frac{1}{1}=1\\) (نضع \\(s=0\\)). والاستجابة بطيئة لأن قطبين جزؤهما الحقيقي صغير ${lt('(−0.2442)')}.`},
  {h:'استعمال SIMULINK',ref:'ص 7–8',html:`<p>استعمال ${lt('SIMULINK')} يسهل تمثيل النظم بالرجوع إلى رسوم جاهزة وربطها ببعضها ثم تشغيلها. لرسم مخطط باستعمال ${lt('Simulink')} نقوم بما يلي:</p><ul><li>فتح ${lt('Simulink')}.</li><li>التعرف على نوافذ ${lt('Simulink')}.</li><li>التعرف على العناصر الأساسية التي سنستخدمها مثل ${lt('Sources')} و ${lt('Sinks')} و ${lt('Linear')}.</li><li>فتح صفحة جديدة لتمثيل النظام المراد دراسته والاستعانة بالمدرب لبناء المخطط.</li><li>لتشغيل المحاكاة ننقر على ${lt('Simulation')} ثم ${lt('Start')}.</li><li>للحصول على النتائج ننقر مرتين على أيقونة جهاز العرض ${lt('Scope')} فتظهر الاستجابة.</li></ul>`},
  {fig:'',caption:'أبسط مخطط: مصدر خطوة ← دالة التحويل ← جهاز العرض (توضيح للمتدرب — الكتاب لا يضم صورة لنوافذ Simulink ولا لمخطط).',draw:()=>`<div class="svgbox" style="max-width:600px;margin-inline:auto">${slkSVG({num:'s^2+2s+1',den:'s^3+4s^2+2s+1'})}</div>`},
  {note:ADD+`الكتلة ${lt('Step')} من مجموعة ${lt('Sources')} (المصادر)، والكتلة ${lt('Scope')} من ${lt('Sinks')} (أجهزة العرض)، والكتلة ${lt('Transfer Fcn')} من ${lt('Linear')} (في الإصدارات الحديثة اسمها ${lt('Continuous')}). انتبه: كتلة ${lt('Step')} في ${lt('Simulink')} تقفز عند الزمن ${lt('1 s')} (القيمة الافتراضية)، وزمن المحاكاة الافتراضي ${lt('10 s')}؛ أما الأمر ${lt('step')} في نافذة الأوامر فيبدأ القفزة عند الصفر ويختار الزمن وحده. غيّر ${lt('Stop time')} إذا لم تكتمل الاستجابة.`},
  {h:'أسئلة ومناقشة',ref:'ص 8',html:`<p>لدينا دالتا التحويل التاليتان:</p>$$1)\\;\\; G(s)=\\frac{s+1}{s(s+2)(s+3)} \\qquad\\qquad 2)\\;\\; G(s)=\\frac{2}{s(s+1)(s+2)}$$`+
   Q('1','أوجد الأصفار والأقطاب باستخدام برنامج MATLAB لكل دالة.',`نضرب أقواس المقام أولاً لأن ${lt('MATLAB')} يحتاج المعاملات: \\(s(s+2)(s+3)=s^3+5s^2+6s\\) و \\(s(s+1)(s+2)=s^3+3s^2+2s\\) (معامل الثابت صفر ويجب كتابته).${code('n=[1 1];  d=[1 5 6 0];\nroots(n)   →  -1\nroots(d)   →  0 , -3 , -2')}${code('n=[2];    d=[1 3 2 0];\nroots(n)   →  []   (لا توجد أصفار)\nroots(d)   →  0 , -2 , -1')}`)+
   Q('2','ارسم الاستجابة الزمنية لإشارة الخطوة للدالتين باستخدام Simulink.',`نضع في كتلة ${lt('Transfer Fcn')} البسط والمقام السابقين ونشغّل. في الدالتين قطب عند الصفر (العامل \\(s\\) في المقام) وهو يعمل مثل «مجمّع»: يبقى الخرج يزيد ولا يستقر، وبعد زوال البداية يصبح خطاً مستقيماً صاعداً. ميله في الدالة الأولى \\(\\frac{1}{2\\times 3}=\\frac{1}{6}\\) لكل ثانية، وفي الثانية \\(\\frac{2}{1\\times 2}=1\\) لكل ثانية. جرّب ذلك في المختبر (في نافذة الأوامر وفي ${lt('Simulink')}).`)},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>ص 5: «على هيئة صف» طُبعت «عل هيئة صف».</li><li>ص 6: الأمر ${lt('Tf(n,d)')} — الصحيح ${lt('tf(n,d)')} بحرف صغير (انظر أعلاه).</li><li>الشكل ${lt('(1-1)')} عنوانه «أصفار وأقطاب الدالة»، لكن الأمر ${lt('rlocus')} يرسم المحل الهندسي للجذور كاملاً، والأصفار والأقطاب علامات عليه فقط.</li><li>اسم صندوق الأدوات الرسمي ${lt('Control System Toolbox')}، وفي الكتاب ${lt('Control Tool Box')}.</li></ol></div>`}
 ],
 lab:(el)=>{
  const ws={};const did={};const hist=[];let hi=0;let fig=null;
  const BOOKCMD=['p=[1 3 1];','p=[1 0 3 1];','n=[1 2 1];','d=[1 4 2 1];','Tf(n,d)','tf(n,d)','roots(n)','roots(d)','rlocus(n,d)','clf','clc','step(n,d)'];
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>نافذة الأوامر <small class="ltr">Command Window</small></h2>
    <p class="sub">اكتب الأمر واضغط <b>Enter</b> (أو «نفّذ»). أزرار الأوامر تضع أمر الكتاب في السطر لتنفذه أنت.</p>
    <div class="cl-con"><div class="cl-out" id="clout" aria-live="polite"></div><div class="cl-inrow"><b>&gt;&gt;</b><input id="clin" type="text" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="سطر الأوامر"><button class="btn primary" id="clgo">نفّذ</button></div></div>
    <div class="cl-chips" id="clchips">${BOOKCMD.map(c=>`<button class="btn" data-cmd="${esc(c)}">${esc(c)}</button>`).join('')}<button class="btn" data-cmd="help">help</button></div></div>
   <div class="panel c5"><h2>نافذة الرسم <small class="ltr">Figure 1</small></h2>
    <div class="cl-fig"><div class="bar"><span>Figure 1</span><span id="clfigt">—</span></div><div class="svgbox" id="clfig" style="margin:0"></div></div>
    <h3 class="sm" style="margin-top:12px">المتغيرات المحفوظة <small class="ltr">Workspace</small></h3><div id="clws"></div></div>
   <div class="panel c12 cl-slk"><h2>Simulink <small>بناء المخطط وتشغيله (ص 7–8)</small></h2>
    <p class="sub">١) أضف الكتل من المكتبة. ٢) صِل الخطوط. ٣) اكتب معاملات كتلة <span class="ltr">Transfer Fcn</span>. ٤) شغّل <span class="ltr">Simulation ▸ Start</span>. ٥) انقر مرتين على <span class="ltr">Scope</span>.</p>
    <div class="cl-lib" id="sllib"></div>
    <div class="svgbox" id="slcv" style="max-width:640px;margin-inline:auto"></div>
    <div class="cl-row"><button class="btn" id="slwire">وصّل الخطوط</button><button class="btn primary" id="slrun"><span class="ltr">Simulation ▸ Start</span></button><button class="btn" id="slopen">افتح Scope (بدل النقر المزدوج)</button><button class="btn" id="slnew">صفحة جديدة</button></div>
    <div class="cl-par" id="slpar"></div><div id="slmsg"></div><div id="slscope"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="clst"></ol></div></div>`;
  const $=s=>el.querySelector(s);const out=$('#clout'),inp=$('#clin');
  const line=(t,c)=>{const d=document.createElement('div');d.className='ln'+(c?' '+c:'');if(c==='note'||c==='hint')d.innerHTML=t;else d.textContent=t;out.appendChild(d)};
  const scroll=()=>{out.scrollTop=out.scrollHeight};
  line('                  < M A T L A B > — نسخة مصغرة للتدريب','hint');line('اكتب <b class="ltr">help</b> لترى الأوامر المدعومة.','hint');line('');
  /* ---- figure window ---- */
  const drawFig=()=>{const h=$('#clfig');if(!fig){h.innerHTML=`<svg viewBox="0 0 560 330" role="img" aria-label="نافذة رسم فارغة"><rect x="58" y="34" width="486" height="250" fill="var(--surface)" stroke="var(--line)"/>${arT(300,165,'نافذة الرسم فارغة: نفّذ step أو rlocus',{col:'--muted'})}</svg>`;$('#clfigt').textContent='—';return}
    try{h.innerHTML=fig.kind==='step'?stepFig(fig.n,fig.d):rlocusFig(fig.n,fig.d);$('#clfigt').textContent=fig.kind+'('+fig.lbl+')'}catch(e){h.innerHTML='';$('#clfigt').textContent='—'}};
  const drawWS=()=>{const k=Object.keys(ws);$('#clws').innerHTML=k.length?`<table class="cl-ws"><thead><tr><th>الاسم</th><th>القيمة</th></tr></thead><tbody>${k.map(n=>{const v=ws[n];const val=v.t==='vec'?'['+v.v.map(gnum).join(' ')+']':v.t==='cvec'?v.v.length+'×1 (جذور)':'tf: '+polyStr(v.n)+' / '+polyStr(v.d);return `<tr><td>${esc(n)}</td><td>${esc(val)}</td></tr>`}).join('')}</tbody></table>`:'<p class="sub">لا توجد متغيرات بعد.</p>'};
  /* ---- interpreter ---- */
  const Err=m=>{const e=new Error(m);e.ml=1;return e};
  const splitTop=(s,chars)=>{const r=[];let dep=0,cur='';for(const ch of s){if(ch==='['||ch==='(')dep++;if(ch===']'||ch===')')dep--;if(dep===0&&chars.includes(ch)){r.push([cur,ch]);cur=''}else cur+=ch}r.push([cur,'']);return r};
  const num=s=>{s=s.trim();if(!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s))throw Err(`Error: Invalid expression. «${s}» ليس رقماً.`);return +s};
  const asVec=(v,nm)=>{if(!v||v.t!=='vec')throw Err(`Error: «${nm}» يجب أن يكون صفاً من المعاملات مثل [1 2 1].`);return v.v};
  const notes=[];
  function ev(s){s=s.trim();if(!s)throw Err('Error: Invalid expression.');
    if(/^\[.*\]$/.test(s)){const inner=s.slice(1,-1).trim();if(!inner)return {t:'vec',v:[]};if(/;/.test(inner))throw Err('Error: هذه النسخة المصغرة تقبل الصفوف فقط (بدون ; داخل القوسين).');
      return {t:'vec',v:inner.split(/[\s,]+/).filter(Boolean).map(num)}}
    if(/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s))return {t:'vec',v:[+s]};
    let m=s.match(/^([A-Za-z]\w*)\s*\((.*)\)$/);
    if(m){const f=m[1];const args=m[2].trim()?splitTop(m[2],',').map(a=>a[0]):[];const A=()=>args.map(ev);
      if(ws[f]&&!['roots','tf','step','rlocus'].includes(f))throw Err(`Error: «${f}» متغير وليس دالة.`);
      if(f==='roots'){if(args.length!==1)throw Err('Error using roots: اكتب roots(p) بمتغير واحد.');const p=asVec(A()[0],args[0]);if(!p.length)return {t:'cvec',v:[]};
        const nz=p.some(x=>x!==0);if(!nz)return {t:'cvec',v:[]};return {t:'cvec',v:proots(p)}}
      if(f==='tf'||f==='Tf'){if(f==='Tf')notes.push(`كتبتَ <b class="ltr">Tf</b> كما في الكتاب. في MATLAB الحقيقي يجب أن تكتب <b class="ltr">tf</b> بحرف صغير، وإلا ظهر الخطأ <span class="ltr">Undefined function 'Tf'</span>. نفّذناه هنا لتكمل التجربة.`);
        if(args.length!==2)throw Err(`Error using ${f}: اكتب ${f}(n,d) — البسط ثم المقام.`);const a=A();const n=asVec(a[0],args[0]),d=asVec(a[1],args[1]);
        if(!d.some(x=>x!==0))throw Err('Error using tf: المقام لا يمكن أن يكون صفراً.');did.tf=1;return {t:'tf',n:n.slice(),d:d.slice()}}
      if(f==='step'||f==='rlocus'){const a=A();let n,d,lbl=args.join(',');
        if(a.length===1&&a[0].t==='tf'){n=a[0].n;d=a[0].d}else if(a.length===2){n=asVec(a[0],args[0]);d=asVec(a[1],args[1])}else throw Err(`Error using ${f}: اكتب ${f}(n,d) أو ${f}(G).`);
        if(!d.some(x=>x!==0))throw Err(`Error using ${f}: المقام صفر.`);if(strip0(n).length>strip0(d).length)throw Err(`Error using ${f}: لا يمكن محاكاة دالة درجة بسطها أكبر من درجة مقامها (improper).`);
        if(f==='rlocus'&&!n.some(x=>x!==0))throw Err('Error using rlocus: البسط صفر.');
        fig={kind:f,n:n.slice(),d:d.slice(),lbl};drawFig();did[f]=1;did[f+'Book']=did[f+'Book']||(eqv(n,NB)&&eqv(d,DB));if(f==='step'&&did.clfAfterRl)did.stepAfterClf=1;return null}
      if(['clc','clf','help'].includes(f))throw Err(`Error: الأمر ${f} يُكتب وحده بدون أقواس.`);
      if(f.toLowerCase()!==f&&['roots','step','rlocus','clc','clf'].includes(f.toLowerCase()))throw Err(`Undefined function '${f}'.\nMATLAB يفرّق بين الحرف الكبير والصغير: اكتب ${f.toLowerCase()}`);
      throw Err(`Undefined function or variable '${f}'.\nهذه النسخة المصغرة تفهم أوامر الكتاب فقط: roots ، tf ، step ، rlocus ، clf ، clc`)}
    m=s.match(/^[A-Za-z]\w*$/);
    if(m){if(ws[s])return ws[s];throw Err(`Undefined function or variable '${s}'.`)}
    throw Err('Error: Invalid expression. تأكد من الأقواس والمسافات.')}
  const eqv=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>x===b[i]);
  const show=(name,v)=>{if(!v)return;if(v.t==='vec'){line(name+' =');line('');line(fmtRow(v.v));line('')}else if(v.t==='cvec'){line(name+' =');line('');line(v.v.length?fmtCol(v.v):'     []');line('')}else{line(name+' =');tfText(v.n,v.d).split('\n').forEach(l=>line(l));line('')}};
  function run(src){let s=src.trim().replace(/^(»|>>)\s*/,'');line('>> '+s,'cmd');if(!s){scroll();return}hist.push(s);hi=hist.length;
    const parts=splitTop(s,';,').filter(p=>p[0].trim());
    for(const [st,sep] of parts){const t=st.trim();notes.length=0;
      try{
        if(t==='clc'){out.innerHTML='';did.clc=1;continue}
        if(t==='clf'){fig=null;drawFig();did.clf=1;if(did.rlocus)did.clfAfterRl=1;continue}
        if(t==='help'){line('الأوامر المدعومة في هذه النافذة (أوامر الكتاب ص 5–7):','hint');['p=[1 3 1]      صف معاملات كثيرة حدود','tf(n,d)        دالة التحويل (والكتاب يكتبها Tf)','roots(p)       جذور كثيرة الحدود','rlocus(n,d)    رسم الأصفار والأقطاب والمحل الهندسي','step(n,d)      رسم الاستجابة للخطوة','clf            مسح الرسم','clc            مسح نافذة الأوامر','G=tf(n,d) ثم step(G) أو rlocus(G)'].forEach(x=>line('  '+x));continue}
        const am=t.match(/^([A-Za-z]\w*)\s*=(?!=)\s*(.+)$/);
        if(am){const nm=am[1];if(['roots','tf','Tf','step','rlocus','clc','clf','help'].includes(nm))throw Err(`Error: لا تستعمل اسم الأمر ${nm} اسماً لمتغير.`);
          const v=ev(am[2]);notes.forEach(n=>line(n,'note'));if(!v)throw Err('Error: هذا الأمر يرسم فقط ولا يعطي قيمة تحفظ في متغير هنا.');ws[nm]=v;did['set_'+nm]=1;if(sep!==';')show(nm,v)}
        else{const v=ev(t);notes.forEach(n=>line(n,'note'));if(v){ws.ans=v;if(sep!==';')show('ans',v);if(v.t==='cvec'){const arg=(t.match(/^roots\s*\((.*)\)$/)||[])[1];const p=arg?ev(arg).v:null;
            if(p){if(eqv(p,NB))did.rootsN=1;if(eqv(p,DB))did.rootsD=1;if(eqv(p,[1,5,6,0]))did.q1=1;if(eqv(p,[1,3,2,0]))did.q2=1}}}}
      }catch(e){if(e.ml)e.message.split('\n').forEach((l,i)=>line(l,i?'hint':'err'));else{line('Error: تعذّر التنفيذ.','err');console.error(e)}}}
    drawWS();scroll();check()}
  $('#clgo').onclick=()=>{run(inp.value);inp.value='';inp.focus()};
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run(inp.value);inp.value=''}
    else if(e.key==='ArrowUp'){if(hi>0){hi--;inp.value=hist[hi]}e.preventDefault()}else if(e.key==='ArrowDown'){if(hi<hist.length-1){hi++;inp.value=hist[hi]}else{hi=hist.length;inp.value=''}e.preventDefault()}});
  $('#clchips').addEventListener('click',e=>{const b=e.target.closest('[data-cmd]');if(!b)return;inp.value=b.dataset.cmd;inp.focus()});
  drawFig();drawWS();
  /* ---- Simulink ---- */
  const sl={has:{},wired:false,num:'[1]',den:'[1 1]',ts:1,fv:1,stop:10,ran:null,open:false};
  const LIB=[['Sources','step','Step'],['Linear','tf','Transfer Fcn'],['Sinks','scope','Scope']];
  const parsePar=(s)=>{s=String(s).trim();if(/^[A-Za-z]\w*$/.test(s)){if(!ws[s])throw Err(`المتغير «${s}» غير موجود في نافذة الأوامر. عرّفه أولاً (مثلاً ${s}=[1 2 1];) أو اكتب الأرقام بين قوسين.`);if(ws[s].t!=='vec')throw Err(`«${s}» ليس صف معاملات.`);return ws[s].v}
    return ev(s.startsWith('[')?s:'['+s+']').v};
  const tfLbl=()=>{const f=s=>{s=String(s).trim();if(/^[A-Za-z]\w*$/.test(s))return s+'(s)';try{return polyStr(parsePar(s)).replace(/ /g,'')}catch(e){return '?'}};return [f(sl.num),f(sl.den)]};
  const slDraw=()=>{$('#sllib').innerHTML=LIB.map(([g,k,nm])=>`<div><small>${g}</small><button class="btn" data-add="${k}" ${sl.has[k]?'disabled':''}>${nm}${sl.has[k]?' ✓':' +'}</button></div>`).join('');
    const [a,b]=tfLbl();$('#slcv').innerHTML=slkSVG({has:sl.has,wired:sl.wired,num:a,den:b});
    $('#slpar').innerHTML=(sl.has.step?`<label><span>Step — Step time</span><input data-sp="ts" value="${sl.ts}"></label><label><span>Step — Final value</span><input data-sp="fv" value="${sl.fv}"></label>`:'')+
      (sl.has.tf?`<label><span>Transfer Fcn — Numerator coefficients</span><input data-sp="num" value="${esc(sl.num)}"></label><label><span>Transfer Fcn — Denominator coefficients</span><input data-sp="den" value="${esc(sl.den)}"></label>`:'')+
      `<label><span>Simulation — Stop time</span><input data-sp="stop" value="${sl.stop}"></label>`;
    $('#slpar').querySelectorAll('[data-sp]').forEach(i=>i.onchange=()=>{const k=i.dataset.sp;sl[k]=(k==='num'||k==='den')?i.value:i.value;sl.ran=null;sl.open=false;$('#slscope').innerHTML='';slDraw();msg('')});
    $('#slcv').querySelectorAll('[data-blk="scope"]').forEach(g=>g.addEventListener('dblclick',openScope))};
  const msg=(h,bad)=>{$('#slmsg').innerHTML=h?`<div class="callout${bad?' err':''}">${h}</div>`:''};
  el.querySelector('#sllib').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;sl.has[b.dataset.add]=1;slDraw();check()});
  $('#slwire').onclick=()=>{if(!(sl.has.step&&sl.has.tf&&sl.has.scope)){msg('أضف الكتل الثلاث أولاً: <span class="ltr">Step</span> و <span class="ltr">Transfer Fcn</span> و <span class="ltr">Scope</span>.',1);return}sl.wired=true;msg('');slDraw();check()};
  $('#slnew').onclick=()=>{sl.has={};sl.wired=false;sl.ran=null;sl.open=false;$('#slscope').innerHTML='';msg('');slDraw()};
  $('#slrun').onclick=()=>{if(!(sl.has.step&&sl.has.tf&&sl.has.scope&&sl.wired)){msg('المخطط غير مكتمل: أضف الكتل الثلاث ثم «وصّل الخطوط».',1);return}
    try{const n=parsePar(sl.num),d=parsePar(sl.den);const ts=+sl.ts,fv=+sl.fv,stop=+sl.stop;if(![ts,fv,stop].every(isFinite)||stop<=0)throw Err('أرقام Step time و Final value و Stop time غير صحيحة.');
      if(!d.some(x=>x!==0))throw Err('المقام صفر.');if(strip0(n).length>strip0(d).length)throw Err('درجة البسط أكبر من درجة المقام: لا يمكن محاكاتها.');
      sl.ran={n,d,ts,fv,stop};did.slRun=1;did.slBook=eqv(n,NB)&&eqv(d,DB);did.slQ=eqv(d,[1,5,6,0])||eqv(d,[1,3,2,0]);sl.open=false;$('#slscope').innerHTML='';
      msg('انتهت المحاكاة. للحصول على النتائج انقر مرتين على أيقونة <span class="ltr">Scope</span> (أو الزر «افتح Scope»).');check()}catch(e){msg(e.ml?esc(e.message).replace(/\n/g,'<br>'):'تعذّرت المحاكاة.',1)}};
  function openScope(){if(!sl.ran){msg('شغّل المحاكاة أولاً: <span class="ltr">Simulation ▸ Start</span>.',1);return}const r=sl.ran;sl.open=true;did.slScope=1;
    let svg='';try{const pts=simTF(r.n,r.d,r.stop,t=>t>=r.ts?r.fv:0);const ys=pts.map(p=>p[1]).filter(isFinite);const y0=Math.min(0,...ys),y1=Math.max(r.fv,...ys)*1.05||1;
      const W=560,H=260,L=48,T=16,pw=W-L-24,ph=H-T-34;const X=t=>L+t/r.stop*pw,Y=y=>T+ph-(y-y0)/(y1-y0||1)*ph;
      let g='';niceTicks(0,r.stop,8).t.forEach(v=>{g+=`<path d="M${fx(X(v))} ${T}V${T+ph}" stroke="var(--con1)"/><text class="txt" style="fill:var(--con-ink)" x="${fx(X(v))}" y="${T+ph+16}" font-size="11">${tickS(v)}</text>`});
      niceTicks(y0,y1,5).t.forEach(v=>{g+=`<path d="M${L} ${fx(Y(v))}H${L+pw}" stroke="var(--con1)"/><text class="txt" style="fill:var(--con-ink)" x="${L-5}" y="${fx(Y(v)+4)}" text-anchor="end" font-size="11">${tickS(v)}</text>`});
      const cid='slsc'+Math.random().toString(36).slice(2,7);
      svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="شاشة Scope: الاستجابة للخطوة"><rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="var(--lcd)" stroke="var(--con-dim)"/>${g}<defs><clipPath id="${cid}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs><g clip-path="url(#${cid})"><path d="${pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(clamp(Y(p[1]),-1e5,1e5))).join('')}" fill="none" stroke="var(--lcd-ink)" stroke-width="2"/></g><text class="txt" style="fill:var(--con-ink)" x="${L+pw}" y="${H-4}" text-anchor="end" font-size="11">Time (s)</text></svg>`}catch(e){svg=''}
    $('#slscope').innerHTML=`<div class="cl-fig"><div class="bar"><span>Scope</span><span>0 – ${tickS(r.stop)} s</span></div><div class="cl-scope"><div style="max-width:620px;margin-inline:auto">${svg}</div></div></div><p class="sub">القفزة عند <span class="ltr">t = ${tickS(r.ts)} s</span> بارتفاع <span class="ltr">${tickS(r.fv)}</span>. ${stepTime(r.d)>r.stop-r.ts?'الاستجابة لم تكتمل بعد: كبّر <span class="ltr">Stop time</span> وأعد التشغيل.':''}</p>`;check()}
  $('#slopen').onclick=openScope;
  slDraw();
  /* ---- guided steps ---- */
  const steps=stepsUI($('#clst'),[
   {t:'أدخل كثيرة الحدود',x:'اكتب <span class="ltr">p=[1 3 1];</span> ثم <span class="ltr">p=[1 0 3 1];</span> (ص 5–6). جرّب كتابة أحدهما مرة بدون الفاصلة المنقوطة لترى الصف يُطبع.',done:()=>ws.p&&eqv(ws.p.v,[1,0,3,1])},
   {t:'أدخل البسط والمقام',x:'اكتب <span class="ltr">n=[1 2 1];</span> و <span class="ltr">d=[1 4 2 1];</span> (ص 6).',done:()=>ws.n&&ws.d&&eqv(ws.n.v,NB)&&eqv(ws.d.v,DB)},
   {t:'اكتب دالة التحويل',x:'نفّذ <span class="ltr">tf(n,d)</span>. جرّب أيضاً <span class="ltr">Tf(n,d)</span> كما طُبع في الكتاب واقرأ الملاحظة.',done:()=>!!did.tf},
   {t:'الأصفار والأقطاب',x:'نفّذ <span class="ltr">roots(n)</span> ثم <span class="ltr">roots(d)</span> وقارن الناتج بالكتاب: <span class="ltr">−1 ، −1</span> و <span class="ltr">−3.5115 ، −0.2442 ± 0.4745i</span>.',done:()=>did.rootsN&&did.rootsD},
   {t:'ارسم الأصفار والأقطاب',x:'نفّذ <span class="ltr">rlocus(n,d)</span> وقارن الرسم بالشكل <span class="ltr">(1-1)</span>: الأقطاب × والصفر المزدوج ○ عند <span class="ltr">−1</span>.',done:()=>!!did.rlocusBook},
   {t:'امسح الرسم وارسم الاستجابة للخطوة',x:'نفّذ <span class="ltr">clf</span> ثم <span class="ltr">step(n,d)</span>. لاحظ أن الخرج يصل ببطء إلى 1.',done:()=>!!did.stepAfterClf},
   {t:'امسح نافذة الأوامر',x:'نفّذ <span class="ltr">clc</span>: تُمسح الكتابة وتبقى المتغيرات محفوظة (انظر جدول <span class="ltr">Workspace</span>).',done:()=>!!did.clc},
   {t:'الدالة نفسها في Simulink',x:'أضف <span class="ltr">Step</span> و <span class="ltr">Transfer Fcn</span> و <span class="ltr">Scope</span>، ثم «وصّل الخطوط»، واكتب في خانتي البسط والمقام <span class="ltr">n</span> و <span class="ltr">d</span> (أو الأرقام)، ثم <span class="ltr">Start</span>، ثم انقر مرتين على <span class="ltr">Scope</span>. الخرج يقفز عند 1 ثانية، وزمن 10 ثوانٍ لا يكفي ليستقر: جرّب <span class="ltr">Stop time = 30</span>.',done:()=>did.slBook&&did.slScope},
   {t:'أسئلة ص 8',x:'أوجد أقطاب الدالتين: <span class="ltr">roots([1 5 6 0])</span> و <span class="ltr">roots([1 3 2 0])</span> (اضرب أقواس المقام أولاً)، ثم ارسم استجابتهما في <span class="ltr">Simulink</span>: الخرج لا يستقر بل يصعد باستمرار.',done:()=>did.q1&&did.q2&&did.slQ&&did.slScope}]);
  function check(){steps.check()}
 },
 quiz:[
  {q:'كيف تُدخل كثيرة الحدود \\(p(s)=s^3+3s+1\\) في MATLAB؟',o:['p=[1 3 1]','p=[1 0 3 1]','p=[1 3 0 1]','p=[3 1]'],c:1,e:'يجب إدخال جميع المعاملات حتى التي تساوي صفراً (معامل s² صفر) — ص 6.'},
  {q:'الأمر الصحيح في MATLAB لكتابة دالة التحويل من البسط n والمقام d:',o:['Tf(n,d)','tf(n,d)','TF(d,n)','tf(d,n)'],c:1,e:'MATLAB يفرّق بين الحرف الكبير والصغير؛ الكتاب طبع Tf والصحيح tf، والبسط أولاً.'},
  {q:'أصفار دالة التحويل هي:',o:['جذور المقام','جذور البسط','معاملات البسط','قيمة الدالة عند s = 0'],c:1,e:'roots(n) يعطي الأصفار، و roots(d) يعطي الأقطاب — ص 6.'},
  {q:'ناتج roots(d) للمقام d=[1 4 2 1] هو:',o:['−1 و −1','−3.5115 و −0.2442 ± 0.4745i','1 و 4 و 2','0 و −2 و −3'],c:1,e:'كما في ص 6؛ الأقطاب كلها جزؤها الحقيقي سالب فالنظام مستقر.'},
  {q:'الأمر clc:',o:['يمسح الرسم','يمسح نافذة الأوامر','يحذف المتغيرات','يرسم الاستجابة'],c:1,e:'clf لمسح الرسم، و clc لمسح «البرنامج» من الشاشة — ص 7. المتغيرات تبقى محفوظة.'},
  {q:'في Simulink كيف نرى النتيجة بعد تشغيل المحاكاة؟',o:['ننقر على Sources','ننقر مرتين على أيقونة Scope','نكتب clc','نغلق المخطط'],c:1,e:'ص 8: للحصول على النتائج ننقر مرتين على أيقونة جهاز العرض Scope.'},
  {q:'لإدخال مقام الدالة \\(G(s)=\\frac{2}{s(s+1)(s+2)}\\) نكتب:',o:['d=[1 3 2]','d=[1 3 2 0]','d=[0 1 2]','d=[2 1 2]'],c:1,e:'s(s+1)(s+2) = s³+3s²+2s، والثابت صفر يجب كتابته.'},
  {q:'إلى أي قيمة تستقر استجابة الخطوة للدالة \\(\\frac{s^2+2s+1}{s^3+4s^2+2s+1}\\)؟',o:['0','1','4','لا تستقر'],c:1,e:'القيمة النهائية = G(0) = 1/1 = 1 (توضيح للمتدرب — ليس من الكتاب). جرّبها بالأمر step(n,d).'}
 ]
});
})(PLCBOOK);
