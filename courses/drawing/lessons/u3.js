/* Unit 3 — الدوائر الخطية والتنفيذية للتوصيلات المنزلية (ص 61–80)
   Lessons u3-l1 … u3-l7.
   ONE wiring engine drives every executive drawing in this unit:
   - a figure spec = supply lines (buses) + wires (polylines) + elements (switch contacts, lamps, bell, starter …);
   - solve() builds a graph (nodes = wire ends), finds every simple path L → N that passes through a load,
     and colours wires: 'flow' (current), 'live' (connected to the phase, no current), '' (dead);
   - the same spec gives the static figure (theory), the live board (lab: press switches) and the drawn
     step-by-step example (each wire/element carries s = the drawing step).
   Logic only, no numbers (coordinator decision) — except the staircase-timer delay (B.params, trainer value). */
(function(B){
const lt=s=>`<span class="ltr">${s}</span>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const K=(x,y)=>x+','+y;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());
const LAMP='#ffd36b',LAMPS='#c99512';

/* ---------- styles used only by this file (CSS variables only, real lamp colours literal) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('d3u3-css'))return;const s=document.createElement('style');s.id='d3u3-css';s.textContent=`
.d3-svg{color:var(--fg)}
.d3-lab #d3x svg{min-width:460px}
.d3 .nwg{color:var(--blue)}
.d3 .nwg .w{stroke:var(--blue);stroke-width:2.8}
.d3 .nwg rect[stroke="var(--muted)"]{stroke:var(--blue)}
.d3-hit{fill:transparent;cursor:pointer}
.d3-hit:hover{fill:var(--blue-soft);fill-opacity:.55}
.d3-ctl{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin-top:12px}
.d3-ctl .sw small{white-space:normal;max-width:120px;text-align:center}
.d3-pb{min-width:92px;user-select:none;-webkit-user-select:none;touch-action:none;padding:8px 14px;border-radius:999px}
.d3-pb[aria-pressed="true"]{background:var(--blue);color:#fff;border-color:var(--blue)}
.d3-path{margin-top:12px;font-size:14.5px;line-height:1.9;background:var(--surface-2);border-radius:10px;padding:8px 12px}
.d3-loads{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:10px;justify-content:center}
.d3-load{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--muted)}
.d3-load svg{width:34px;height:34px;flex:none}
.d3-load.on{color:var(--fg);font-weight:700}
.d3-sel{margin:2px 0 12px}
.d3-sel .seg{flex-wrap:wrap;max-width:100%}
.d3-sel .seg button{white-space:nowrap}
.d3-tbar{height:8px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin-top:6px;border:1px solid var(--line)}
.d3-tbar i{display:block;height:100%;background:var(--live)}
@keyframes d3ring{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
.d3-ringing{animation:d3ring .16s linear infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes d3spin{to{transform:rotate(360deg)}}
.d3-spin{animation:d3spin 1.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
@media (prefers-reduced-motion:reduce){.d3-ringing,.d3-spin{animation:none}}
.d3-ord{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.d3-ord button{font:inherit;font-size:14px;text-align:start;padding:7px 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--fg);cursor:pointer;line-height:1.6}
.d3-ord button.ok{border-color:var(--on);background:var(--on-soft)}
.d3-ord button.no{border-color:var(--stop);background:var(--stop-soft)}
.d3-ord ol{margin:8px 0 0;padding-inline-start:22px}
.d3-ord ol li{margin:4px 0;padding:5px 10px;border-radius:9px;background:var(--on-soft);border:1px solid var(--on);line-height:1.6}
.d3-q{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:10px;background:var(--surface)}
.d3-q p{margin:0 0 8px;line-height:1.75}
.d3-q .d3-row{display:flex;flex-wrap:wrap;gap:8px}
.d3-q .d3-row button{font:inherit;font-size:14px;padding:5px 14px;border-radius:9px;border:1px solid var(--line);background:var(--surface);color:var(--fg);cursor:pointer}
.d3-q .d3-row button.ok{border-color:var(--on);background:var(--on-soft)}
.d3-q .d3-row button.no{border-color:var(--stop);background:var(--stop-soft)}
.d3-fb{margin-top:8px;font-size:14px;line-height:1.75}
.d3-fb:empty{display:none}
.d3-tbl{overflow-x:auto;margin-top:8px}
table.d3t{border-collapse:collapse;width:100%;font-size:13.5px;min-width:560px}
table.d3t th,table.d3t td{border:1px solid var(--line);padding:5px 7px;text-align:center;vertical-align:middle}
table.d3t th{background:var(--surface-2)}
table.d3t td.diff{background:var(--stop-soft)}
table.d3t tr.on td{background:var(--on-soft)}
table.d3t tr.on td.diff{background:var(--stop-soft)}
.d3-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:12px;align-items:start}
@media (max-width:700px){.d3-pair{grid-template-columns:minmax(0,1fr)}}
.d3-key{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:var(--muted);margin-top:6px}
.d3-key i{display:inline-block;width:22px;height:0;border-top:3px solid var(--wire);vertical-align:middle;margin-inline-end:4px}
.d3-key i.f{border-top:3px dashed var(--live)}
.d3-key i.l{border-top-color:var(--live)}
`;document.head.appendChild(s)})();

/* ================= drawing primitives (executive diagrams) ================= */
const term=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.3" fill="var(--surface)" stroke="currentColor" stroke-width="1.4"/>`;
const fdot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.4" fill="currentColor"/>`;
const hdot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.9" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>`;
const tL=(x,y,s,a,fs,c)=>`<text class="txt${c?' '+c:''}" x="${x}" y="${y}" text-anchor="${a||'middle'}"${fs?` font-size="${fs}"`:''}>${s}</text>`;
/* Arabic SVG text (direction rtl): a = side where the text starts as seen on screen ('start' = text grows to the right of x) */
const tA=(x,y,s,a,fs)=>`<text class="txt ar" x="${x}" y="${y}" text-anchor="${a==='start'?'end':a==='end'?'start':'middle'}" font-size="${fs||12}">${s}</text>`;
const pth=pts=>'M'+pts.map(p=>p[0]+' '+p[1]).join('L');
const DASH={n:'10 4 2 4',pe:'12 5',d:'7 4'};
const wire=(pts,cls,st)=>`<path class="w ${cls||''}" d="${pth(pts)}"${st&&DASH[st]?` stroke-dasharray="${DASH[st]}"`:''}/>`;
const ddbox=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="9 3 2 3"/>`;
const xmark=(x,y,r,col,sw)=>`<path d="M${x-r} ${y-r}L${x+r} ${y+r}M${x+r} ${y-r}L${x-r} ${y+r}" stroke="${col||'currentColor'}" stroke-width="${sw||1.8}" fill="none"/>`;
const rays=(x,y,r)=>{let d='';for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,c=Math.cos(a),s=Math.sin(a);d+=`M${(x+c*(r+2)).toFixed(1)} ${(y+s*(r+2)).toFixed(1)}L${(x+c*(r+7)).toFixed(1)} ${(y+s*(r+7)).toFixed(1)}`}return `<path d="${d}" stroke="${LAMPS}" stroke-width="1.6"/>`};
const halo=(x,y,r,dim)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${LAMP}" opacity="${dim?0.42:0.92}"/>`+(dim?'':rays(x,y,r));
const SK='stroke="currentColor" stroke-width="1.6" fill="none"';
/* manual actuator «T» (or push «[») with dashed link to the blade */
function act(kind,x,y,toX,right){const s=right?-1:1;
 const g=kind==='P'?`<path d="M${x+6*s} ${y-6}H${x}V${y+6}H${x+6*s}" ${SK}/>`:`<path d="M${x} ${y-6}V${y+6}M${x} ${y}H${x+6*s}" ${SK}/>`;
 return g+`<path d="M${x+6*s} ${y}H${toX}" stroke="currentColor" stroke-width="1.1" stroke-dasharray="3 2" fill="none"/>`;}

const R0={c:()=>'',on:()=>false};
/* element types: edges(e,S) → graph edges ; draw(e,S,R,o) → svg */
function swDraw(e,on,R,o,kind,stKey){const x=e.x,y1=e.y1,y2=e.y2,dir=e.actR?-1:1;
 const tx=on?x:x+11*dir,ty=on?y1+4:y1+7,ym=(y1+y2)/2+2,bx=x+(tx-x)*((y2-ym)/(y2-y1));
 let s=`<path class="w ${R.c(e.id)}" d="M${x} ${y2-3.3}L${tx} ${ty}"/>`;
 s+=act(kind,x-26*dir,ym,bx,dir<0)+term(x,y1)+term(x,y2);
 if(e.lab)s+=tL(x-26*dir,y1-7,e.lab,'middle',11,'m');
 if(o.live)s+=`<rect class="d3-hit" ${stKey}="${e.id}" x="${Math.min(x-34*dir,x+16*dir)}" y="${y1-8}" width="50" height="${y2-y1+16}" rx="6"/>`;
 return s;}
const EL={
 sw:{edges:(e,S)=>S.sw[e.id]||chF('weld:'+e.id)?[{a:K(e.x,e.y1),b:K(e.x,e.y2),key:e.id}]:[],draw:(e,S,R,o)=>swDraw(e,!!S.sw[e.id],R,o,'T','data-sw')},
 pb:{edges:(e,S)=>S.pb[e.id]||chF('weld:'+e.id)?[{a:K(e.x,e.y1),b:K(e.x,e.y2),key:e.id}]:[],draw:(e,S,R,o)=>swDraw(e,!!S.pb[e.id],R,o,'P','data-pb')},
 tw:{edges:(e,S)=>chF('twx:'+e.id)&&S.pos[e.id]?[{a:K(e.x-e.d,e.yt),b:K(e.x+e.d,e.yt),key:e.id}]:[{a:K(e.x,e.yb),b:K(e.x+(S.pos[e.id]?e.d:-e.d),e.yt),key:e.id}],
  draw(e,S,R,o){const p=S.pos[e.id]?1:-1,tx=e.x+p*(e.d-2),ty=e.yt+4,ym=(e.yt+e.yb)/2+3;
   let s=`<path class="w ${R.c(e.id)}" d="M${e.x} ${e.yb-3.3}L${tx} ${ty}"/>`;
   s+=act('T',e.x-e.d-20,ym,e.x+(tx-e.x)*((e.yb-ym)/(e.yb-e.yt)),false)+term(e.x-e.d,e.yt)+term(e.x+e.d,e.yt)+term(e.x,e.yb);
   if(e.lab)s+=tL(e.x-e.d-20,e.yt-8,e.lab,'middle',11,'m');
   if(o.live)s+=`<rect class="d3-hit" data-sw="${e.id}" x="${e.x-e.d-28}" y="${e.yt-9}" width="${2*e.d+40}" height="${e.yb-e.yt+18}" rx="6"/>`;return s}},
 im:{edges(e,S){const a1=K(e.x-e.d,e.yt),a2=K(e.x+e.d,e.yt),b1=K(e.x-e.d,e.yb),b2=K(e.x+e.d,e.yb);
   if(chF('imx:'+e.id)&&!S.pos[e.id])return [{a:a1,b:a2,key:e.id+':1'},{a:b1,b:b2,key:e.id+':2'}];
   return S.pos[e.id]?[{a:a1,b:b2,key:e.id+':1'},{a:a2,b:b1,key:e.id+':2'}]:[{a:a1,b:b1,key:e.id+':1'},{a:a2,b:b2,key:e.id+':2'}]},
  draw(e,S,R,o){const x1=e.x-e.d,x2=e.x+e.d,c=S.pos[e.id];
   let s=c?`<path class="w ${R.c(e.id+':1')}" d="M${x1} ${e.yt}L${x2} ${e.yb}"/><path class="w ${R.c(e.id+':2')}" d="M${x2} ${e.yt}L${x1} ${e.yb}"/>`
          :`<path class="w ${R.c(e.id+':1')}" d="M${x1} ${e.yt}V${e.yb}"/><path class="w ${R.c(e.id+':2')}" d="M${x2} ${e.yt}V${e.yb}"/>`;
   s+=act('T',x1-20,(e.yt+e.yb)/2,x1,false)+term(x1,e.yt)+term(x2,e.yt)+term(x1,e.yb)+term(x2,e.yb);
   if(e.lab)s+=tL(x1-20,e.yt-8,e.lab,'middle',11,'m');
   if(o.live)s+=`<rect class="d3-hit" data-sw="${e.id}" x="${x1-28}" y="${e.yt-9}" width="${2*e.d+40}" height="${e.yb-e.yt+18}" rx="6"/>`;return s}},
 lamp:{edges:e=>[{a:K(...e.a),b:K(...e.b),key:e.id,load:1}],
  draw(e,S,R){const [ax,ay]=e.a,[bx,by]=e.b,mx=(ax+bx)/2,my=(ay+by)/2,L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,r=7,c=R.c(e.id),on=c==='flow';
   return (on?halo(mx,my,11,e.dim):'')+`<path class="w ${c}" d="M${ax} ${ay}L${mx-ux*r} ${my-uy*r}M${mx+ux*r} ${my+uy*r}L${bx} ${by}"/>`+xmark(mx,my,5.5,on?LAMPS:null,2)+term(ax,ay)+term(bx,by)+(e.lab?tL(mx+(uy?14:0),my+(uy?4:-12),e.lab,uy?'start':'middle',11,'m'):'')}},
 bell:{edges:e=>[{a:K(e.x-e.d,e.y),b:K(e.x+e.d,e.y),key:e.id,load:1}],
  draw(e,S,R){const c=R.c(e.id),on=c==='flow',x=e.x,y=e.y,yb=y-11;
   let s=`<path class="w ${c}" d="M${x-e.d} ${y}V${yb}M${x+e.d} ${y}V${yb}"/>`;
   s+=`<g${on?' class="d3-ringing"':''}><path d="M${x-15} ${yb}H${x+15}" ${SK}/><path d="M${x-12} ${yb}A12 12 0 0 1 ${x+12} ${yb}Z" fill="${on?LAMP:'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/></g>`;
   if(on)s+=`<path d="M${x+19} ${yb-14}a10 10 0 0 1 0 12M${x+24} ${yb-18}a15 15 0 0 1 0 20M${x-19} ${yb-14}a10 10 0 0 0 0 12M${x-24} ${yb-18}a15 15 0 0 0 0 20" stroke="${LAMPS}" stroke-width="1.6" fill="none"/>`;
   return s+term(x-e.d,y)+term(x+e.d,y)}},
 fuse:{edges:e=>[{a:K(e.x,e.y1),b:K(e.x,e.y2),key:e.id}],
  draw(e,S,R){const ym=(e.y1+e.y2)/2;return `<path class="w ${R.c(e.id)}" d="M${e.x} ${e.y1}V${e.y2}"/><rect x="${e.x-5}" y="${ym-10}" width="10" height="20" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/><path class="w ${R.c(e.id)}" d="M${e.x} ${ym-10}V${ym+10}"/>`}},
 meter:{edges:e=>[{a:K(e.x,e.y),b:K(e.x-18,e.y),key:e.id}],
  draw(e,S,R){const x=e.x,y=e.y,c=R.c(e.id),on=c==='flow';
   let s=`<path d="M${x-30} ${y-8}V${y-56}A30 16 0 0 1 ${x+30} ${y-56}V${y-8}Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>`;
   s+=tL(x,y-56,'k','middle',15);
   s+=`<rect x="${x-17}" y="${y-48}" width="34" height="16" rx="3" fill="var(--surface-2)" stroke="currentColor" stroke-width="1"/><g${on?' class="d3-spin"':''}><ellipse cx="${x}" cy="${y-40}" rx="12" ry="5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M${x} ${y-40}L${x+11} ${y-40}" stroke="var(--stop)" stroke-width="2.2"/></g>`;
   s+=`<path class="w ${c}" d="M${x} ${y}V${y-18}H${x-18}V${y}"/><path d="M${x+18} ${y}V${y-14}" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/>`;
   return s+term(x-18,y)+term(x,y)+term(x+18,y)}},
 xf:{edges:e=>[{a:K(e.x-e.d,e.yb),b:K(e.x+e.d,e.yb),key:e.id+':P',load:1}],
  src:(e,S,flow)=>flow.has(e.id+':P')?[K(e.x-e.d,e.yt),K(e.x+e.d,e.yt)]:null,
  draw(e,S,R){const x=e.x,cp=R.c(e.id+':P'),on=cp==='flow',cs=on?'flow':'',ytB=e.yt+9,ybB=e.yb-16;
   let s=`<path class="w ${cp}" d="M${x-e.d} ${e.yb}V${ybB+7}M${x+e.d} ${e.yb}V${ybB+7}"/><path class="w ${cs}" d="M${x-e.d} ${e.yt}V${ytB}M${x+e.d} ${e.yt}V${ytB}"/>`;
   s+=`<rect x="${x-22}" y="${ybB}" width="44" height="7" fill="currentColor"/><rect x="${x-22}" y="${ytB}" width="44" height="7" fill="currentColor"/>`;
   for(let i=0;i<4;i++){const yy=ytB+11+i*((ybB-ytB-15)/3);s+=`<path d="M${x-22} ${yy.toFixed(1)}H${x+22}" stroke="currentColor" stroke-width="1"/>`}
   s+=tA(x+30,ybB+7,'ابتدائي','start',10.5)+tA(x+30,ytB+7,'ثانوي','start',10.5);
   return s+term(x-e.d,e.yt)+term(x+e.d,e.yt)+term(x-e.d,e.yb)+term(x+e.d,e.yb)}},
 bal:{edges:e=>[{a:K(...e.a),b:K(...e.b),key:e.id,load:1}],
  draw(e,S,R){const [ax,ay]=e.a,[bx]=e.b,mx=(ax+bx)/2,c=R.c(e.id);return `<path class="w ${c}" d="M${ax} ${ay}H${mx-11}M${mx+11} ${ay}H${bx}"/><rect x="${mx-11}" y="${ay-4}" width="22" height="8" fill="currentColor"/>`+fdot(ax,ay)+fdot(bx,ay)}},
 fl:{edges(e,S){const E=[{a:K(e.x0,e.yT),b:K(e.x0,e.yB),key:e.id+':L'},{a:K(e.x1,e.yT),b:K(e.x1,e.yB),key:e.id+':R'}];if(S.ph==='lit')E.push({a:K(e.x0,e.yB),b:K(e.x1,e.yB),key:e.id+':T',load:1});return E},
  draw(e,S,R){const {x0,x1,yT,yB}=e,lit=R.c(e.id+':T')==='flow',tx0=x0+7,tx1=x1-7,ty0=yT+4,ty1=yB-4,h=ty1-ty0;
   let s=lit?`<rect x="${tx0-7}" y="${ty0-7}" width="${tx1-tx0+14}" height="${h+14}" rx="${(h+14)/2}" fill="#d9f0ff" opacity=".95"/>`:'';
   s+=`<rect x="${tx0}" y="${ty0}" width="${tx1-tx0}" height="${h}" rx="${h/2}" fill="${lit?'#f3fbff':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`;
   const fil=(x,sd,key)=>{const c=R.c(key),hot=c==='flow',xi=x+sd*9;let z=`M${x} ${yT}V${ty0+3}H${xi}`;const n=4,st=(ty1-ty0-6)/n;for(let i=0;i<n;i++)z+=`L${xi+sd*4} ${(ty0+3+st*(i+0.5)).toFixed(1)}L${xi} ${(ty0+3+st*(i+1)).toFixed(1)}`;z+=`H${x}V${yB}`;
    return `<path class="w ${c}" d="${z}"/>`+(hot?`<path d="${z}" stroke="#f08a24" stroke-width="2.4" fill="none" opacity=".85"/>`:'')};
   s+=fil(x0,1,e.id+':L')+fil(x1,-1,e.id+':R')+xmark((x0+x1)/2,(yT+yB)/2,4.5,lit?'#3a8fd0':null,1.6);
   return s+term(x0,yT)+term(x0,yB)+term(x1,yT)+term(x1,yB)}},
 st:{edges:(e,S)=>(S.ph==='glow'||S.ph==='pre')?[{a:K(e.x-e.d,e.y),b:K(e.x+e.d,e.y),key:e.id}]:[],
  draw(e,S,R){const x=e.x,y=e.y,c=R.c(e.id),glow=S.ph==='glow'&&c==='flow',cl=S.ph==='pre';
   let s=`<path class="w ${c}" d="M${x-e.d} ${y}H${x-10}M${x+10} ${y}H${x+e.d}"/>`;
   s+=`<circle cx="${x}" cy="${y}" r="10" fill="${glow?'#ffb4a2':'var(--surface)'}" stroke="currentColor" stroke-width="1.5"/>`;
   s+=`<path d="M${x-10} ${y}H${x-6}V${y+4}M${x+10} ${y}H${x+5}V${y-5}" ${SK}/><path d="M${x-6} ${y+4}Q${x-2} ${y-(cl?4:1)} ${cl?x+4:x+1} ${cl?y-5:y-7}" stroke="${cl?'#f08a24':'currentColor'}" stroke-width="1.6" fill="none"/>`;
   return s}},
 imp:{edges(e,S){const E=[{a:K(e.xc,e.y1),b:K(e.xc,e.y2),key:e.id+':K',load:1}];if(S.imp||chF('weld:'+e.id))E.push({a:K(e.xk,e.y1),b:K(e.xk,e.y2),key:e.id+':C'});return E},
  draw(e,S,R){const ck=R.c(e.id+':K'),cc=R.c(e.id+':C'),ym=(e.y1+e.y2)/2,on=!!S.imp,tx=on?e.xk:e.xk+11,ty=on?e.y1+4:e.y1+8;
   let s=`<path class="w ${ck}" d="M${e.xc} ${e.y1}V${ym-12}M${e.xc} ${ym+12}V${e.y2}"/><rect x="${e.xc-8}" y="${ym-12}" width="16" height="24" fill="${ck==='flow'?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`;
   s+=`<path class="w ${cc}" d="M${e.xk} ${e.y2-3.3}L${tx} ${ty}"/><path d="M${e.xc+8} ${ym}H${(e.xk+tx)/2}" stroke="currentColor" stroke-width="1.1" stroke-dasharray="3 2" fill="none"/>`;
   s+=tL(e.xc-12,e.y1+4,'A1','end',10.5)+tL(e.xc-12,e.y2+4,'A2','end',10.5)+tL(e.xk+8,e.y1+4,'1','start',10.5)+tL(e.xk+8,e.y2+4,'2','start',10.5);
   return s+term(e.xc,e.y1)+term(e.xc,e.y2)+term(e.xk,e.y1)+term(e.xk,e.y2)}},
 tmr:{pos(e,n){let i=[3,4,5,6].indexOf(n);if(i>=0)return [e.x+16,e.y+18+i*e.rs];i=[2,1,8,7].indexOf(n);return [e.x+e.w-16,e.y+18+i*e.rs]},
  edges(e,S){const p=n=>K(...EL.tmr.pos(e,n));const E=[{a:p(1),b:p(7),key:e.id+':K',load:1}];if(S.tim>0)E.push({a:p(2),b:p(3),key:e.id+':C'});return E},
  draw(e,S,R,o){const P=n=>EL.tmr.pos(e,n),ck=R.c(e.id+':K'),cc=R.c(e.id+':C'),run=S.tim>0;
   let s=`<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/>`;
   const [x3,y3]=P(3),[x2]=P(2),[x1,y1]=P(1),[,y7]=P(7),xm=(x3+x2)/2,xc=x1-22;
   s+=`<g opacity=".8"><path class="w ${cc}" d="M${x3} ${y3}H${xm-10}M${xm+10} ${y3}H${x2}"/><path class="w ${cc}" d="M${xm-10} ${y3}L${run?xm+9:xm+7} ${run?y3:y3-8}"/>`;
   s+=`<path class="w ${ck}" d="M${x1} ${y1}H${xc}V${y1+6}M${xc} ${y7-6}V${y7}H${x1}"/><rect x="${xc-6}" y="${y1+6}" width="12" height="${y7-y1-12}" fill="${ck==='flow'?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.3"/><path d="M${xc-6} ${(y1+y7)/2}H${xm}V${y3+2}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2" fill="none"/></g>`;
   [3,4,5,6].forEach(n=>{const [x,y]=P(n);s+=fdot(x,y)+tL(x+8,y+4,String(n),'start',11)});
   [2,1,8,7].forEach(n=>{const [x,y]=P(n);s+=fdot(x,y)+tL(x-8,y+4,String(n),'end',11)});
   if(run&&S.T){const f=Math.max(0,Math.min(1,S.tim/S.T));s+=`<rect x="${e.x+8}" y="${e.y+e.h-12}" width="${e.w-16}" height="6" rx="3" fill="var(--surface-2)" stroke="var(--line)"/><rect x="${e.x+8}" y="${e.y+e.h-12}" width="${((e.w-16)*f).toFixed(1)}" height="6" rx="3" fill="var(--live)"/>`}
   return s}},
 gnd:{draw:e=>{const [x,y]=e.p;return fdot(x,y)+`<path d="M${x} ${y}V${y+6}M${x-8} ${y+6}H${x+8}M${x-5} ${y+10}H${x+5}M${x-2} ${y+14}H${x+2}" ${SK}/>`}}
};

/* ================= wiring solver ================= */
function busXs(b){return [b.x0,...(b.tap||[]).slice().sort((p,q)=>p-q),b.x1]}
function edgesOf(sp,S){const E=[];
 sp.bus.forEach((b,i)=>{const xs=busXs(b);for(let j=0;j<xs.length-1;j++)E.push({a:K(xs[j],b.y),b:K(xs[j+1],b.y),key:'b'+i+'_'+j})});
 sp.wires.forEach((w,i)=>{const p=w.p,q=p[p.length-1];E.push({a:K(p[0][0],p[0][1]),b:K(q[0],q[1]),key:'w'+i})});
 sp.els.forEach(e=>{const d=EL[e.t];if(d.edges)d.edges(e,S).forEach(x=>E.push(x))});
 return chOn()?E.filter(e=>!chF('cut:'+e.key)):E;}
/* Current paths. 1) wires + closed contacts merge nodes into «nets» (equal potential);
   2) on the graph nets–loads, a load carries current iff it lies on a simple path between the source nets
      (biconnected component of the virtual edge t–s, Tarjan); a load with both ends on one net carries none;
   3) inside a net, a conductor carries current iff removing it separates the current's entry/exit points. */
function solve(sp,S){const E=edgesOf(sp,S),adj={};E.forEach((e,i)=>{(adj[e.a]=adj[e.a]||[]).push(i);(adj[e.b]=adj[e.b]||[]).push(i)});
 const par={},fd=x=>{if(par[x]===undefined)par[x]=x;while(par[x]!==x){par[x]=par[par[x]];x=par[x]}return x};
 Object.keys(adj).forEach(n=>par[n]=n);E.forEach(e=>{if(!e.load){const ra=fd(e.a),rb=fd(e.b);if(ra!==rb)par[ra]=rb}});
 const flow=new Set(),live=new Set();
 const run=(s,t)=>{const q=[s];live.add(s);while(q.length){const u=q.pop();for(const i of adj[u]||[]){const e=E[i];if(e.load)continue;const v=e.a===u?e.b:e.a;if(!live.has(v)){live.add(v);q.push(v)}}};
  const ns=fd(s),nt=fd(t);if(ns===nt)return;
  const L=E.map((e,i)=>e.load&&fd(e.a)!==fd(e.b)?i:-1).filter(i=>i>=0),ad={},VI=-1;
  const add=(n,i)=>(ad[n]=ad[n]||[]).push(i);L.forEach(i=>{add(fd(E[i].a),i);add(fd(E[i].b),i)});add(nt,VI);add(ns,VI);
  const other=(i,u)=>i===VI?(u===ns?nt:ns):(fd(E[i].a)===u?fd(E[i].b):fd(E[i].a));
  const disc={},low={},st=[];let time=0,found=null;
  const dfs=(u,pe)=>{disc[u]=low[u]=++time;for(const i of ad[u]||[]){if(i===pe)continue;const v=other(i,u);
    if(disc[v]==null){st.push(i);dfs(v,i);low[u]=Math.min(low[u],low[v]);if(low[v]>=disc[u]){const c=[];let j;do{j=st.pop();c.push(j)}while(j!==i);if(c.includes(VI))found=c}}
    else if(disc[v]<disc[u]){st.push(i);low[u]=Math.min(low[u],disc[v])}}};
  dfs(ns,null);if(!found)return;const fl=found.filter(i=>i!==VI);if(!fl.length)return;
  const termN={};const tp=n=>{(termN[fd(n)]=termN[fd(n)]||new Set()).add(n)};tp(s);tp(t);
  fl.forEach(i=>{flow.add(E[i].key);tp(E[i].a);tp(E[i].b)});
  E.forEach((e,ei)=>{if(e.load)return;const T=termN[fd(e.a)];if(!T||T.size<2)return;
   const seen=new Set([e.a]),q=[e.a];while(q.length){const u=q.pop();for(const i of adj[u]||[]){if(i===ei||E[i].load)continue;const v=E[i].a===u?E[i].b:E[i].a;if(!seen.has(v)){seen.add(v);q.push(v)}}}
   let k=0;T.forEach(n=>{if(seen.has(n))k++});if(k>0&&k<T.size)flow.add(e.key)});
};
 const src=sp.src.map(n=>{const b=sp.bus.find(x=>x.n===n);return K(b.x0,b.y)});if(chF('swap'))src.reverse();
 run(src[0],src[1]);
 sp.els.forEach(e=>{const d=EL[e.t];if(d.src){const pr=d.src(e,S,flow);if(pr)run(pr[0],pr[1])}});
 const cls={};E.forEach(e=>{cls[e.key]=flow.has(e.key)?'flow':(live.has(e.a)&&live.has(e.b))?'live':''});
 return {c:k=>cls[k]||'',on:k=>flow.has(k),flow};}

/* executive drawing: o.R (colours), o.live (clickable), o.upto (draw only steps ≤ upto, newest in blue) */
function exec(sp,S,o){o=o||{};const R=o.R||R0,up=o.upto==null?1e9:o.upto,vis=x=>(x.s||0)<=up,nw=x=>o.upto!=null&&o.upto>0&&(x.s||0)===o.upto,g=(x,h)=>nw(x)?`<g class="nwg">${h}</g>`:h;
 let s=`<svg class="d3-svg" viewBox="0 0 ${sp.W} ${sp.H}" role="img" aria-label="${o.aria||'الدائرة التنفيذية'}">`;
 const deg={},inc=k=>deg[k]=(deg[k]||0)+1;
 (sp.boxes||[]).forEach(b=>{const x={s:b[4]};if(vis(x))s+=g(x,ddbox(b[0],b[1],b[2],b[3]))});
 sp.bus.forEach((b,i)=>{if(!vis(b))return;const xs=busXs(b);let h='';for(let j=0;j<xs.length-1;j++){h+=wire([[xs[j],b.y],[xs[j+1],b.y]],R.c('b'+i+'_'+j),b.st);inc(K(xs[j],b.y));inc(K(xs[j+1],b.y))}
  s+=g(b,h+tL(b.x0-6,b.y+4,b.n,'end',12.5))});
 sp.wires.forEach((w,i)=>{if(!vis(w))return;const p=w.p,q=p[p.length-1];s+=g(w,wire(p,R.c('w'+i),w.st));inc(K(p[0][0],p[0][1]));inc(K(q[0],q[1]))});
 sp.els.forEach(e=>{if(vis(e))s+=g(e,EL[e.t].draw(e,S,R,o))});
 const busY=new Set(sp.bus.map(b=>b.y));
 Object.keys(deg).forEach(k=>{if(deg[k]>=3){const [x,y]=k.split(',').map(Number);s+=(sp.holAll||(sp.hol&&!busY.has(y)))?hdot(x,y):fdot(x,y)}});
 (sp.mk||[]).forEach(m=>{if(vis({s:m[2]}))s+=hdot(m[0],m[1])});
 (sp.txt||[]).forEach(t=>{if(vis({s:t[5]}))s+=t[4]?tA(t[0],t[1],t[2],t[3],t[6]):tL(t[0],t[1],t[2],t[3],t[6])});
 return s+'</svg>';}
const IDLE=()=>({sw:{},pos:{},pb:{},ph:'off',imp:false,tim:0,T:1});
const xBox=(sp,h,max)=>`<div class="svgbox d3" style="margin-inline:auto;max-width:${max||sp.W}px">${h}</div>`;
const xFig=sp=>xBox(sp,exec(sp,IDLE()));

/* ================= single-line («الخطية») symbols ================= */
const Lx={
 src:(x,y)=>`<rect x="${x-30}" y="${y-13}" width="60" height="26" fill="var(--surface)" ${SK.replace(' fill="none"','')}/><path d="M${x-30} ${y+13}L${x+30} ${y-13}" ${SK}/>`,
 jn:(x,y)=>`<circle cx="${x}" cy="${y}" r="6" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>`,
 l:(...p)=>`<path d="${pth(p)}" ${SK}/>`,
 tk:(x,y,n,dir)=>{let d='';for(let i=0;i<n;i++){const o=(i-(n-1)/2)*5;d+=dir==='h'?`M${x+o-3} ${y+6}L${x+o+3} ${y-6}`:`M${x-6} ${y+o+3}L${x+6} ${y+o-3}`}return `<path d="${d}" ${SK}/>`},
 tn:(x,y,num,dir)=>Lx.tk(x,y,1,dir)+(dir==='h'?tL(x,y-10,num,'middle',12):tL(x-10,y+4,num,'end',12)),
 x:(x,y,lit,dim)=>(lit?halo(x,y,12,dim):'')+xmark(x,y,8,lit?LAMPS:null,2),
 xo:(x,y,lit)=>(lit?halo(x,y,13):'')+`<circle cx="${x}" cy="${y}" r="9" fill="${lit?LAMP:'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`+xmark(x,y,6.3,null,1.6),
 cir:(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>`,
 fl:(x1,y1,x2,y2,fx,fy)=>`<path d="M${x1} ${y1}L${x2} ${y2}L${x2+fx} ${y2+fy}" ${SK}/>`,
 sw1:(x,y)=>Lx.cir(x,y)+Lx.fl(x+3.5,y-3.5,x+15,y-15,5,5),
 sw2:(x,y)=>Lx.cir(x,y)+Lx.fl(x+3.5,y-3.5,x+15,y-15,5,5)+Lx.fl(x-3.5,y-3.5,x-15,y-15,-5,5),
 tw:(x,y)=>Lx.cir(x,y)+Lx.fl(x+3.5,y-3.5,x+15,y-15,5,5)+Lx.fl(x-3.5,y+3.5,x-15,y+15,-5,-5),
 im:(x,y)=>Lx.cir(x,y)+Lx.fl(x+3.5,y-3.5,x+15,y-15,5,5)+Lx.fl(x-3.5,y-3.5,x-15,y-15,-5,5)+Lx.fl(x-3.5,y+3.5,x-15,y+15,-5,-5)+Lx.fl(x+3.5,y+3.5,x+15,y+15,5,-5),
 pb:(x,y,on)=>`<circle cx="${x}" cy="${y}" r="7" fill="${on?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="2.6" fill="currentColor"/>`,
 bell:(x,y,on)=>`<g${on?' class="d3-ringing"':''}><path d="M${x-13} ${y}H${x+13}" ${SK}/><path d="M${x-10} ${y}A10 10 0 0 1 ${x+10} ${y}Z" fill="${on?LAMP:'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/></g>`,
 tr:(x,y)=>`<circle cx="${x}" cy="${y-5}" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="${x}" cy="${y+5}" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/>`,
 flu:(x,y,lit)=>(lit?`<rect x="${x-36}" y="${y-14}" width="72" height="28" rx="14" fill="#d9f0ff"/>`:'')+`<rect x="${x-30}" y="${y-8}" width="60" height="16" rx="8" fill="${lit?'#f3fbff':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`+tL(x-13,y+4,'20W','middle',9)+xmark(x+12,y,4,null,1.5),
 mt:(x,y)=>`<path d="M${x-12} ${y+15}V${y-5}A12 10 0 0 1 ${x+12} ${y-5}V${y+15}Z" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>`+tL(x,y+9,'k','middle',13),
 tm:(x,y,on)=>`<rect x="${x-10}" y="${y-15}" width="20" height="30" fill="${on?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`+tL(x,y+5,'T','middle',13),
 ip:(x,y,on)=>`<rect x="${x-18}" y="${y-12}" width="36" height="24" fill="${on?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/><path d="M${x-11} ${y-5}H${x-1}V${y+5}H${x+11}" ${SK}/>`,
 fu:(x,y)=>`<rect x="${x-4}" y="${y-9}" width="8" height="18" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/>`
};
const linSvg=(W,H,inner,aria)=>`<svg class="d3-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria||'الدائرة الخطية'}">${inner}</svg>`;
const volt=(x,y,v,ar)=>ar?tL(x-14,y,v,'middle',13)+tA(x+16,y,'فولت','middle',13):tL(x,y,v,'middle',13);
const LIN={
 f31:(on,v)=>linSvg(220,232,volt(110,16,'220',1)+Lx.src(110,40)+Lx.l([110,53],[110,118])+Lx.tk(110,86,2,'v')+Lx.jn(110,124)+Lx.l([116,124],[176,124])+Lx.tk(146,124,2,'h')+Lx.x(186,124,on('E1'))+Lx.l([110,130],[110,196])+Lx.tk(110,163,2,'v')+Lx.sw1(110,201)),
 f32:on=>linSvg(260,232,volt(130,16,'220',1)+Lx.src(130,40)+Lx.l([130,53],[130,118])+Lx.tk(130,86,2,'v')+Lx.jn(130,124)+Lx.l([124,124],[58,124])+Lx.tk(92,124,2,'h')+Lx.x(48,124,on('E1'))+Lx.l([136,124],[202,124])+Lx.tk(168,124,2,'h')+Lx.x(212,124,on('E2'))+Lx.l([130,130],[130,196])+Lx.tk(130,163,3,'v')+Lx.sw2(130,201)),
 f33:on=>linSvg(260,220,Lx.src(130,28)+Lx.l([130,41],[130,106])+Lx.tk(130,74,3,'v')+Lx.jn(130,112)+Lx.l([124,112],[58,112])+Lx.tk(92,112,3,'h')+Lx.x(48,112,on('E1'))+Lx.l([136,112],[202,112])+Lx.tk(168,112,3,'h')+Lx.x(212,112,on('E2'))+Lx.l([130,118],[130,184])+Lx.tk(130,151,3,'v')+Lx.sw1(130,189)),
 f34:on=>linSvg(300,216,Lx.src(150,28)+Lx.l([150,41],[150,104])+Lx.jn(150,110)
  +Lx.l([144,110],[62,110],[62,74])+Lx.tk(100,110,2,'h')+Lx.xo(62,65,on('E1'))
  +Lx.l([154,106],[164,96],[236,96],[236,74])+Lx.tk(204,96,2,'h')+Lx.xo(236,65,on('E2'))
  +Lx.l([156,110],[262,110])+Lx.tk(232,110,2,'h')+Lx.xo(271,110,on('E3'))
  +Lx.l([146,114],[136,124],[70,124],[70,181])+Lx.tn(70,152,'3','v')+Lx.tw(70,186)
  +Lx.l([150,116],[150,181])+Lx.tn(150,148,'4','v')+Lx.im(150,186)
  +Lx.l([154,114],[164,124],[230,124],[230,181])+Lx.tn(230,152,'3','v')+Lx.tw(230,186)),
 f35:on=>linSvg(240,222,Lx.src(100,28)+Lx.l([100,41],[100,104])+Lx.tk(100,72,2,'v')+Lx.jn(100,110)+Lx.l([106,110],[170,110],[170,80])+Lx.tk(138,110,2,'h')+Lx.flu(170,72,on('FL:T'))+Lx.l([100,116],[100,182])+Lx.tk(100,149,2,'v')+Lx.sw1(100,187)),
 f36:on=>linSvg(260,222,Lx.src(130,28)+Lx.l([130,41],[130,104])+Lx.fu(130,58)+Lx.tk(130,84,2,'v')+Lx.jn(130,110)+Lx.l([124,110],[50,110],[50,86])+Lx.tn(88,110,'3','h')+Lx.mt(50,70)+Lx.l([136,110],[212,110],[212,92])+Lx.tk(176,110,2,'h')+Lx.xo(212,83,on('E1'))+Lx.l([130,116],[130,182])+Lx.tk(130,149,2,'v')+Lx.sw1(130,187)),
 f37:(on,v)=>linSvg(240,222,(v?tL(120,12,v,'middle',13):'')+Lx.src(120,32)+Lx.l([120,45],[120,104])+Lx.tk(120,74,2,'v')+Lx.jn(120,110)+Lx.l([126,110],[190,110],[190,82])+Lx.tk(158,110,2,'h')+Lx.bell(190,80,on('H1'))+Lx.l([114,110],[60,110],[60,176])+Lx.tk(60,143,2,'v')+Lx.pb(60,184,on('P1'))),
 f38:on=>linSvg(240,222,Lx.src(120,28)+Lx.l([120,41],[120,104])+Lx.tk(120,72,2,'v')+Lx.jn(120,110)+Lx.l([126,110],[190,110],[190,102])+Lx.tk(158,110,2,'h')+Lx.tr(190,90)+Lx.l([190,78],[190,64])+Lx.bell(190,62,on('H1'))+Lx.l([120,116],[120,176])+Lx.tk(120,146,2,'v')+Lx.pb(120,184,on('P1'))),
 f39:on=>linSvg(300,240,Lx.src(150,28)+Lx.l([150,41],[150,114])+Lx.tk(150,76,2,'v')+Lx.jn(150,120)
  +Lx.l([145,116],[135,106],[84,106],[84,82])+Lx.tk(108,106,2,'h')+Lx.xo(84,73,on('E1'))
  +Lx.l([155,116],[165,106],[216,106],[216,82])+Lx.tk(192,106,2,'h')+Lx.xo(216,73,on('E3'))
  +Lx.l([144,120],[58,120])+Lx.tk(100,120,2,'h')+Lx.xo(49,120,on('E2'))
  +Lx.l([156,120],[242,120])+Lx.tk(200,120,2,'h')+Lx.xo(251,120,on('E4'))
  +Lx.l([145,124],[135,134],[84,134],[84,180])+Lx.tk(84,158,2,'v')+Lx.pb(84,187,on('P1'))
  +Lx.l([150,126],[150,180])+Lx.tk(150,154,2,'v')+Lx.pb(150,187,on('P2'))+Lx.l([150,194],[150,207])+Lx.pb(150,214,on('P3'))
  +Lx.l([155,124],[165,134],[216,134],[216,174])+Lx.tn(216,154,'4','v')+Lx.ip(216,186,on('KS:K'))),
 f310:on=>linSvg(300,230,Lx.src(150,28)+Lx.l([150,41],[150,104])+Lx.tk(150,72,2,'v')+Lx.jn(150,110)
  +Lx.l([144,110],[30,110],[30,72])+Lx.tn(30,92,'3','v')+Lx.tm(30,57,on('TM:K')||on('TM:C'))
  +Lx.l([105,110],[105,90])+Lx.tk(105,100,2,'v')+Lx.xo(105,81,on('E1'))
  +Lx.l([195,110],[195,90])+Lx.tk(195,100,2,'v')+Lx.xo(195,81,on('E2'))
  +Lx.l([156,110],[270,110],[270,72])+Lx.tk(270,92,2,'v')+Lx.xo(270,63,on('E3'))
  +Lx.l([145,115],[135,125],[84,125],[84,176])+Lx.tk(84,152,2,'v')+Lx.pb(84,184,on('P1'))
  +Lx.l([150,116],[150,190])+Lx.tk(150,160,2,'v')+Lx.pb(150,198,on('P2'))
  +Lx.l([155,115],[165,125],[216,125],[216,176])+Lx.tk(216,152,2,'v')+Lx.pb(216,184,on('P3'))),
 f313:(on,dim)=>linSvg(260,226,volt(130,14,'220',1)+Lx.src(130,38)+Lx.l([130,51],[130,112])+Lx.tn(130,82,'3','v')+Lx.jn(130,118)+Lx.l([124,118],[56,118],[56,134])+Lx.tn(90,118,'3','h')+Lx.x(56,143,on('E1'),dim)+Lx.l([136,118],[204,118],[204,134])+Lx.tn(170,118,'3','h')+Lx.x(204,143,on('E2'),dim)+Lx.l([130,124],[130,186])+Lx.tk(130,155,2,'v')+Lx.sw1(130,191)),
 f314:on=>linSvg(300,230,tL(50,14,'220v','middle',13)+Lx.src(50,36)+Lx.l([50,49],[50,120],[114,120])+Lx.tn(84,120,'3','h')+Lx.jn(120,120)+Lx.l([120,114],[120,80])+Lx.tn(120,98,'3','v')+Lx.xo(120,71,on('E1'))+Lx.l([120,126],[120,180])+Lx.tn(120,153,'3','v')+Lx.tw(120,186)+Lx.l([126,120],[224,120])+Lx.tn(175,120,'5','h')+Lx.jn(230,120)+Lx.l([230,114],[230,80])+Lx.tn(230,98,'3','v')+Lx.xo(230,71,on('E2'))+Lx.l([230,126],[230,180])+Lx.tn(230,153,'3','v')+Lx.tw(230,186))
};
const lFig=(fn,max,...a)=>`<div class="svgbox d3" style="margin-inline:auto;max-width:${max||260}px">${fn(()=>false,...a)}</div>`;

/* ================= figure specs (executive diagrams) ================= */
const F={};
F.f31={W:380,H:285,
 bus:[{n:'L1',y:30,x0:50,x1:360,tap:[175]},{n:'L2',y:55,x0:50,x1:360,tap:[215]}],src:['L1','L2'],
 boxes:[[150,88,85,62,1],[262,88,60,62,2],[140,192,100,76,1]],
 els:[{t:'sw',id:'S1',x:175,y1:212,y2:248,s:1,lab:'S1'},{t:'lamp',id:'E1',a:[292,103],b:[292,135],s:2,lab:'E1'}],
 wires:[{p:[[175,30],[175,212]],s:3},{p:[[175,248],[195,248],[195,135],[292,135]],s:4},{p:[[215,55],[215,103],[292,103]],s:5}]};
F.f32={W:440,H:300,holAll:1,
 bus:[{n:'L1',y:30,x0:50,x1:420,tap:[225]},{n:'L2',y:55,x0:50,x1:420,tap:[245]}],src:['L1','L2'],
 boxes:[[185,85,90,65,1],[55,85,60,65,2],[345,85,60,65,2],[170,192,120,80,1]],
 els:[{t:'sw',id:'S1',x:210,y1:212,y2:250,s:1,lab:'S1'},{t:'sw',id:'S2',x:250,y1:212,y2:250,actR:1,s:1,lab:'S2'},{t:'lamp',id:'E1',a:[85,100],b:[85,135],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[375,100],b:[375,135],s:2,lab:'E2'}],
 wires:[{p:[[210,250],[250,250]],s:1},{p:[[225,30],[225,178],[160,178],[160,285],[210,285],[210,250]],s:3},
  {p:[[210,212],[210,135],[85,135]],s:4},{p:[[250,212],[250,135],[375,135]],s:5},
  {p:[[245,55],[245,100]],s:6},{p:[[245,100],[85,100]],s:6},{p:[[245,100],[375,100]],s:6}]};
F.f33={W:440,H:290,holAll:1,
 bus:[{n:'L1',y:25,x0:50,x1:420,tap:[205]},{n:'N',y:45,x0:50,x1:420,tap:[240],st:'n'},{n:'PE',y:65,x0:50,x1:420,tap:[262],st:'pe'}],src:['L1','N'],
 boxes:[[185,85,95,70,1],[45,85,75,70,2],[350,85,75,70,2],[170,190,100,80,1]],
 els:[{t:'sw',id:'S1',x:205,y1:210,y2:245,s:1,lab:'S1'},{t:'lamp',id:'E1',a:[70,100],b:[70,138],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[400,100],b:[400,138],s:2,lab:'E2'},{t:'gnd',p:[97,118],s:2},{t:'gnd',p:[375,118],s:2}],
 wires:[{p:[[205,25],[205,210]],s:3},
  {p:[[205,245],[225,245],[225,138]],s:4},{p:[[225,138],[70,138]],s:4},{p:[[225,138],[400,138]],s:4},
  {p:[[240,45],[240,100]],st:'n',s:5},{p:[[240,100],[70,100]],st:'n',s:5},{p:[[240,100],[400,100]],st:'n',s:5},
  {p:[[262,65],[262,118]],st:'pe',s:6},{p:[[262,118],[97,118]],st:'pe',s:6},{p:[[262,118],[375,118]],st:'pe',s:6}]};
F.f34={W:540,H:372,holAll:1,
 bus:[{n:'L1',y:25,x0:45,x1:525,tap:[240]},{n:'N',y:45,x0:45,x1:525,tap:[270],st:'n'}],src:['L1','N'],
 boxes:[[215,58,90,95,1],[40,75,80,40,2],[400,75,80,40,2],[400,130,80,40,2],[72,250,92,78,1],[215,250,82,78,1],[352,250,92,78,1]],
 els:[{t:'lamp',id:'E1',a:[55,95],b:[105,95],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[415,95],b:[465,95],s:2,lab:'E2'},{t:'lamp',id:'E3',a:[415,150],b:[465,150],s:2,lab:'E3'},
  {t:'tw',id:'A',x:117,yt:268,yb:305,d:12,s:1,lab:'S1'},{t:'im',id:'B',x:260,yt:268,yb:305,d:12,s:1,lab:'S2'},{t:'tw',id:'C',x:402,yt:268,yb:305,d:12,s:1,lab:'S3'}],
 wires:[{p:[[240,25],[240,175],[25,175],[25,350],[117,350],[117,305]],s:3},
  {p:[[105,268],[105,232],[248,232],[248,268]],s:4},{p:[[129,268],[129,242],[272,242],[272,268]],s:4},
  {p:[[248,305],[248,336],[302,336],[302,236],[414,236],[414,268]],s:5},{p:[[272,305],[272,322],[330,322],[330,246],[390,246],[390,268]],s:5},
  {p:[[402,305],[402,350],[505,350],[505,190],[250,190],[250,135]],s:6},
  {p:[[250,135],[35,135],[35,95],[55,95]],s:7},{p:[[250,135],[395,135]],s:7},{p:[[395,135],[395,95],[415,95]],s:7},{p:[[395,135],[395,150],[415,150]],s:7},
  {p:[[270,45],[270,72]],st:'n',s:8},{p:[[270,72],[105,72],[105,95]],st:'n',s:8},{p:[[270,72],[480,72],[480,95]],st:'n',s:8},{p:[[480,95],[465,95]],st:'n',s:8},{p:[[480,95],[480,150],[465,150]],st:'n',s:8}]};
F.f35={W:480,H:285,
 bus:[{n:'L1',y:25,x0:45,x1:465,tap:[175]},{n:'N',y:45,x0:45,x1:465,tap:[210],st:'n'}],src:['L1','N'],
 boxes:[[150,85,80,70,1],[140,190,95,78,1],[262,62,205,118,2]],
 els:[{t:'sw',id:'S1',x:175,y1:208,y2:243,s:1,lab:'S1'},{t:'fl',id:'FL',x0:300,x1:430,yT:112,yB:140,s:2},{t:'st',id:'ST',x:365,y:85,d:18,s:2},{t:'bal',id:'BL',a:[322,160],b:[372,160],s:2}],
 wires:[{p:[[300,112],[300,85],[347,85]],s:2},{p:[[383,85],[430,85],[430,112]],s:2},
  {p:[[175,25],[175,208]],s:3},{p:[[175,243],[195,243],[195,160],[322,160]],s:4},{p:[[372,160],[430,160],[430,140]],s:4},
  {p:[[210,45],[210,140],[300,140]],st:'n',s:5}],
 txt:[[365,64,'البادئ','middle',1,2,10.5],[347,176,'الملف الخانق','middle',1,2,10.5],[365,104,'الأنبوبة','middle',1,2,10.5]]};
F.f36={W:440,H:300,hol:1,
 bus:[{n:'L1',y:25,x0:45,x1:425,tap:[200]},{n:'N',y:45,x0:45,x1:425,tap:[262],st:'d'}],src:['L1','N'],
 boxes:[[170,100,110,60,1],[160,200,90,72,1],[318,80,82,40,2]],
 els:[{t:'fuse',id:'F1',x:200,y1:58,y2:88,s:1},{t:'meter',id:'MT',x:70,y:160,s:2},{t:'sw',id:'S1',x:200,y1:215,y2:250,s:1,lab:'S1'},{t:'lamp',id:'E1',a:[333,100],b:[385,100],s:2,lab:'E1'}],
 wires:[{p:[[200,25],[200,58]],s:3},{p:[[200,88],[200,125]],s:3},{p:[[200,125],[200,215]],s:3},{p:[[88,160],[88,125],[200,125]],s:4},
  {p:[[200,250],[200,282],[230,282],[230,185],[70,185],[70,160]],s:5},{p:[[52,160],[52,198],[410,198],[410,100],[385,100]],s:6},
  {p:[[262,45],[262,140],[310,140],[310,100],[333,100]],st:'d',s:7}],
 txt:[[70,94,'العداد','middle',1,2,11]]};
F.f37={W:400,H:290,hol:1,
 bus:[{n:'L1',y:25,x0:45,x1:385,tap:[180]},{n:'N',y:45,x0:45,x1:385,tap:[215],st:'d'}],src:['L1','N'],
 boxes:[[160,85,80,70,1],[60,200,90,72,1]],
 els:[{t:'pb',id:'P1',x:105,y1:215,y2:250,s:1,lab:'P1'},{t:'bell',id:'H1',x:330,y:125,d:12,s:2}],
 wires:[{p:[[180,25],[180,170],[105,170],[105,215]],s:3},{p:[[105,250],[130,250],[130,185],[342,185],[342,125]],s:4},{p:[[215,45],[215,140],[318,140],[318,125]],st:'d',s:5}],
 txt:[[330,82,'الجرس','middle',1,2,11]]};
F.f38={W:420,H:300,
 bus:[{n:'L1',y:25,x0:45,x1:405,tap:[180]},{n:'N',y:45,x0:45,x1:405,tap:[228],st:'d'}],src:['L1','N'],
 boxes:[[160,85,95,85,1],[140,205,90,72,1]],
 els:[{t:'pb',id:'P1',x:180,y1:222,y2:256,s:1,lab:'P1'},{t:'xf',id:'T1',x:330,yt:125,yb:185,d:12,s:2},{t:'bell',id:'H1',x:330,y:105,d:12,s:2}],
 wires:[{p:[[180,25],[180,222]],s:3},{p:[[180,256],[180,285],[205,285],[205,200],[342,200],[342,185]],s:4},{p:[[228,45],[228,185],[318,185]],st:'d',s:5},
  {p:[[318,125],[318,105]],s:6},{p:[[342,125],[342,105]],s:6}],
 mk:[[180,108,3],[205,150,4]],txt:[[330,64,'الجرس','middle',1,2,11]]};
F.f39={W:540,H:450,hol:1,
 bus:[{n:'L1',y:25,x0:45,x1:525,tap:[220]},{n:'L2',y:45,x0:45,x1:525,tap:[330]}],src:['L1','L2'],
 boxes:[[200,52,180,165,1],[75,72,80,40,2],[20,118,45,92,2],[395,72,80,40,2],[478,118,45,92,2],[55,290,85,72,1],[178,290,85,72,1],[178,368,85,72,1],[385,250,110,95,1]],
 els:[{t:'lamp',id:'E1',a:[90,92],b:[140,92],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[42,140],b:[42,188],s:2},{t:'lamp',id:'E3',a:[410,92],b:[460,92],s:2,lab:'E3'},{t:'lamp',id:'E4',a:[500,140],b:[500,188],s:2},
  {t:'pb',id:'P1',x:97,y1:305,y2:340,s:1,lab:'P1'},{t:'pb',id:'P2',x:220,y1:305,y2:340,s:1,lab:'P2'},{t:'pb',id:'P3',x:220,y1:383,y2:418,s:1,lab:'P3'},
  {t:'imp',id:'KS',xc:410,xk:460,y1:265,y2:325,s:1}],
 wires:[{p:[[220,25],[220,175]],s:3},{p:[[220,175],[97,175],[97,305]],s:3},{p:[[220,175],[220,305]],s:3},{p:[[220,305],[168,305],[168,383],[220,383]],s:3},
  {p:[[97,340],[150,340],[150,205],[290,205]],s:4},{p:[[220,340],[290,340]],s:4},{p:[[220,418],[290,418],[290,340]],s:4},{p:[[290,340],[290,205]],s:4},
  {p:[[290,205],[355,205],[355,340],[410,340],[410,325]],s:5},{p:[[410,265],[410,240],[365,240],[365,60]],s:5},
  {p:[[330,45],[330,60]],s:6},{p:[[330,60],[365,60]],s:6},{p:[[365,60],[475,60]],s:6},{p:[[475,60],[475,92],[460,92]],s:6},{p:[[475,60],[530,60],[530,200],[500,200],[500,188]],s:6},
  {p:[[330,60],[60,60]],s:6},{p:[[60,60],[60,92],[90,92]],s:6},{p:[[60,60],[12,60],[12,200],[42,200],[42,188]],s:6},
  {p:[[460,325],[460,358],[375,358],[375,175],[220,175]],s:7},{p:[[460,265],[460,150],[300,150],[300,130]],s:7},
  {p:[[300,130],[160,130]],s:8},{p:[[160,130],[160,92],[140,92]],s:8},{p:[[160,130],[42,130],[42,140]],s:8},
  {p:[[300,130],[390,130]],s:8},{p:[[390,130],[390,92],[410,92]],s:8},{p:[[390,130],[500,130],[500,140]],s:8}],
 txt:[[440,244,'مفتاح صدمة التيار','middle',1,1,10.5]]};
F.f310={W:540,H:445,
 bus:[{n:'L1',y:25,x0:45,x1:525,tap:[262]},{n:'L2',y:45,x0:45,x1:525,tap:[318]}],src:['L1','L2'],
 boxes:[[235,150,110,122,1],[130,190,75,36,2],[380,190,75,36,2],[460,140,75,36,2],[80,300,85,70,1],[215,355,85,70,1],[390,300,85,70,1]],
 els:[{t:'tmr',id:'TM',x:25,y:62,w:120,h:100,rs:21,s:1},
  {t:'lamp',id:'E1',a:[145,208],b:[190,208],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[395,208],b:[440,208],s:2,lab:'E2'},{t:'lamp',id:'E3',a:[475,158],b:[520,158],s:2,lab:'E3'},
  {t:'pb',id:'P1',x:125,y1:315,y2:350,s:1,lab:'P1'},{t:'pb',id:'P2',x:262,y1:370,y2:405,s:1,lab:'P2'},{t:'pb',id:'P3',x:430,y1:315,y2:350,s:1,lab:'P3'}],
 wires:[{p:[[129,80],[160,80],[160,101]],s:3},{p:[[129,101],[160,101]],s:3},{p:[[160,101],[160,165],[262,165]],s:3},{p:[[262,25],[262,165]],s:3},
  {p:[[41,80],[12,80],[12,180],[290,180],[290,195]],s:4},{p:[[290,195],[190,195],[190,208]],s:4},{p:[[290,195],[380,195]],s:4},{p:[[380,195],[380,208],[395,208]],s:4},{p:[[380,195],[380,158],[475,158]],s:4},
  {p:[[318,45],[318,235]],s:5},{p:[[318,235],[120,235],[120,208],[145,208]],s:5},{p:[[318,235],[340,235]],s:5},{p:[[340,235],[455,235]],s:5},{p:[[455,235],[455,208],[440,208]],s:5},{p:[[455,235],[530,235],[530,158],[520,158]],s:5},
  {p:[[129,143],[100,143],[100,262],[262,262]],s:6},{p:[[262,262],[262,285]],s:6},{p:[[262,285],[125,285],[125,315]],s:6},{p:[[262,285],[262,370]],s:6},{p:[[262,285],[430,285],[430,315]],s:6},
  {p:[[125,350],[125,425],[262,425]],s:7},{p:[[262,405],[262,425]],s:7},{p:[[262,425],[340,425]],s:7},{p:[[430,350],[430,425],[340,425]],s:7},{p:[[340,425],[340,235]],s:7}],
 mk:[[262,165,3],[262,262,6]],txt:[[85,56,'المزمن','middle',1,1,11]]};
/* exercises (suggested solutions — not from the book) */
F.x1a=Object.assign({},F.f33);
F.x1b={W:440,H:290,holAll:1,bus:F.f33.bus,src:['L1','N'],boxes:F.f33.boxes,
 els:[{t:'sw',id:'S1',x:205,y1:210,y2:245,s:1,lab:'S1'},{t:'lamp',id:'E1',a:[70,100],b:[70,138],s:2,lab:'E1',dim:1},{t:'lamp',id:'E2',a:[400,100],b:[400,138],s:2,lab:'E2',dim:1},{t:'gnd',p:[97,118],s:2},{t:'gnd',p:[375,118],s:2}],
 wires:[{p:[[205,25],[205,210]],s:3},{p:[[205,245],[225,245],[225,138],[70,138]],s:4},{p:[[70,100],[400,100]],s:5},
  {p:[[240,45],[240,150],[400,150],[400,138]],st:'n',s:6},
  {p:[[262,65],[262,118]],st:'pe',s:7},{p:[[262,118],[97,118]],st:'pe',s:7},{p:[[262,118],[375,118]],st:'pe',s:7}]};
F.x2={W:520,H:330,holAll:1,
 bus:[{n:'L1',y:25,x0:45,x1:505,tap:[140]},{n:'N',y:45,x0:45,x1:505,tap:[190],st:'n'},{n:'PE',y:65,x0:45,x1:505,tap:[230],st:'pe'}],src:['L1','N'],
 boxes:[[118,90,132,125,1],[330,90,90,125,1],[20,100,70,80,2],[440,100,70,80,2],[115,232,100,72,1],[325,232,100,72,1]],
 els:[{t:'lamp',id:'E1',a:[45,120],b:[45,160],s:2,lab:'E1'},{t:'lamp',id:'E2',a:[485,120],b:[485,160],s:2,lab:'E2'},{t:'gnd',p:[68,140],s:2},{t:'gnd',p:[462,140],s:2},
  {t:'tw',id:'A',x:165,yt:250,yb:285,d:12,s:1,lab:'S1'},{t:'tw',id:'C',x:375,yt:250,yb:285,d:12,s:1,lab:'S2'}],
 wires:[{p:[[140,25],[140,312],[165,312],[165,285]],s:3},
  {p:[[153,250],[153,200],[363,200],[363,250]],s:4},{p:[[177,250],[177,208],[387,208],[387,250]],s:4},
  {p:[[375,285],[375,315],[410,315],[410,180]],s:5},{p:[[410,180],[485,180],[485,160]],s:5},{p:[[410,180],[45,180],[45,160]],s:5},
  {p:[[190,45],[190,120]],st:'n',s:6},{p:[[190,120],[45,120]],st:'n',s:6},{p:[[190,120],[485,120]],st:'n',s:6},
  {p:[[230,65],[230,140]],st:'pe',s:7},{p:[[230,140],[68,140]],st:'pe',s:7},{p:[[230,140],[462,140]],st:'pe',s:7}]};

if(typeof process!=='undefined'&&process.env&&process.env.U3TEST){B.U3F=F;B.U3EL=EL;B.U3solve=solve}
/* ================= live boards (lab) ================= */
function stepsUI(host,steps){let i=0;
 const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${B.ltrU(s.t)}</h4><p>${B.ltrU(typeof s.x==='function'?s.x():s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
  (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب ترتيباً آخر للمفاتيح، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
 host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
 return {check(){let m=0,moved=false;while(m++<steps.length){const s=steps[i];if(s&&s.done&&s.done()){i++;moved=true}else break}if(moved)draw()},redraw:draw};}
/* small icons for the «what is on» row */
const ICON={
 lamp:on=>`<svg viewBox="0 0 34 34">${on?halo(17,15,10):''}<circle cx="17" cy="15" r="9" fill="${on?LAMP:'var(--lamp-off)'}" stroke="currentColor" stroke-width="1.4"/><path d="M13 24h8v5h-8z" fill="var(--surface-2)" stroke="currentColor" stroke-width="1.2"/></svg>`,
 tube:on=>`<svg viewBox="0 0 34 34"><rect x="2" y="12" width="30" height="10" rx="5" fill="${on?'#d9f0ff':'var(--lamp-off)'}" stroke="currentColor" stroke-width="1.4"/>${on?'<path d="M4 8h26M4 26h26" stroke="#7cc0f0" stroke-width="2"/>':''}</svg>`,
 bell:on=>`<svg viewBox="0 0 34 34"><g${on?' class="d3-ringing"':''}><path d="M7 24h20M10 24a7 9 0 0 1 14 0z" fill="${on?LAMP:'var(--lamp-off)'}" stroke="currentColor" stroke-width="1.4"/><circle cx="17" cy="27" r="2" fill="currentColor"/></g>${on?`<path d="M28 10a7 7 0 0 1 0 10M6 10a7 7 0 0 0 0 10" stroke="${LAMPS}" stroke-width="1.6" fill="none"/>`:''}</svg>`,
 meter:on=>`<svg viewBox="0 0 34 34"><rect x="6" y="4" width="22" height="26" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1.4"/><g${on?' class="d3-spin"':''}><ellipse cx="17" cy="19" rx="8" ry="3.5" fill="none" stroke="currentColor"/><path d="M17 19h8" stroke="var(--stop)" stroke-width="2"/></g></svg>`,
 relay:on=>`<svg viewBox="0 0 34 34"><rect x="5" y="7" width="24" height="20" rx="3" fill="${on?'var(--blue-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.4"/><path d="M10 21h6v-8h8" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`
};
function board(el,boards,opt){opt=opt||{};let bi=0,cur,S,R,raf=0,steps,TP=null;
 el.innerHTML=`<div class="d3 d3-lab">${boards.length>1?`<div class="d3-sel"><div class="seg" role="group" aria-label="اختر الدائرة">${boards.map((b,i)=>`<button data-bd="${i}" aria-pressed="${i===0}">${b.name}</button>`).join('')}</div></div>`:''}<div class="d3-body"></div></div>`;
 const body=el.querySelector('.d3-body');
 const ctlHTML=c=>c.k==='pb'?`<button class="btn d3-pb pb" data-p="${c.id}" aria-pressed="false">${c.lab}</button>`
  :`<button class="sw" data-c="${c.id}" aria-pressed="false"><span class="knob"></span><b>${c.b||c.id}</b><small>${c.lab}</small></button>`;
 const compute=()=>{for(let k=0;k<4;k++){R=solve(cur.sp,S);if(!(cur.logic&&cur.logic(S,R)))break}};
 const paint=()=>{compute();
  body.querySelector('#d3x').innerHTML=exec(cur.sp,S,{R,live:true});
  body.querySelector('#d3l').innerHTML=cur.lin(R.on);
  body.querySelector('#d3o').innerHTML=cur.loads.map(l=>{const on=R.on(l.k);return `<span class="d3-load${on?' on':''}">${ICON[l.t](on)}${l.n}: ${on?(l.on||'يعمل'):(l.off||'لا يعمل')}</span>`}).join('');
  body.querySelector('#d3p').innerHTML=B.ltrU(cur.say(S,R));
  body.querySelectorAll('[data-c]').forEach(b=>{const c=cur.ctl.find(x=>x.id===b.dataset.c);const v=c.k==='sw'?!!S.sw[c.id]:!!S.pos[c.id];b.setAttribute('aria-pressed',String(v));const sm=b.querySelector('small');if(sm&&c.k!=='sw')sm.textContent=c.lab+' — '+(v?'الوضع 2':'الوضع 1')});
  body.querySelectorAll('[data-p]').forEach(b=>b.setAttribute('aria-pressed',String(!!S.pb[b.dataset.p])));
  steps&&steps.check();};
 const operate=id=>{const c=cur.ctl.find(x=>x.id===id);if(!c||c.k==='pb')return;if(c.k==='sw')S.sw[id]=!S.sw[id];else S.pos[id]=S.pos[id]?0:1;S.n++;S.cnt[id]=(S.cnt[id]||0)+1;paint()};
 const press=(id,v)=>{if(!!S.pb[id]===!!v)return;S.pb[id]=v?1:0;if(v){S.n++;S.cnt[id]=(S.cnt[id]||0)+1}paint()};
 const load=i=>{bi=i;cur=boards[i];S=Object.assign({sw:{},pos:{},pb:{},n:0,cnt:{},ph:'off',imp:false,tim:0,T:1},cur.init?cur.init():{});
  el.querySelectorAll('[data-bd]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.bd===i)));
  body.innerHTML=`${cur.tp?'<div id="d3tp"></div>':''}<div class="grid">
   <div class="panel c7"><h2>الدائرة التنفيذية <span class="ref">مبنية على الشكل ${cur.fig} ${cur.ref}</span></h2><div class="svgbox d3" id="d3x" style="max-width:${cur.sp.W}px;margin-inline:auto"></div>
    <div class="d3-key"><span><i class="l"></i>موصول بالطور ولا يمر تيار</span><span><i class="f"></i>يمر تيار (مسار التيار)</span><span><i></i>بلا جهد</span></div>
    <p class="sub">${cur.hint||'اضغط على المفتاح في الرسم نفسه، أو استعمل الأزرار تحته.'}</p><div class="d3-ctl">${cur.ctl.map(ctlHTML).join('')}</div></div>
   <div class="panel c5"><h2>الدائرة الخطية</h2><div class="svgbox d3" id="d3l" style="max-width:${cur.linW||260}px;margin-inline:auto"></div><div class="d3-loads" id="d3o"></div><div class="d3-path" id="d3p"></div>${cur.extra||''}</div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="d3s"></ol></div></div>`;
  if(cur.tp){TP=B.params(body.querySelector('#d3tp'),cur.tp.id,cur.tp.defs,()=>{cur.tp.apply&&cur.tp.apply(S,TP);steps&&steps.redraw();paint()});cur.tp.apply&&cur.tp.apply(S,TP)}
  steps=stepsUI(body.querySelector('#d3s'),cur.steps(S,()=>TP));paint();};
 /* events (delegated) */
 el.addEventListener('click',e=>{const bd=e.target.closest('[data-bd]');if(bd){load(+bd.dataset.bd);return}
  const c=e.target.closest('[data-c]')||e.target.closest('[data-sw]');if(c){operate(c.dataset.c||c.getAttribute('data-sw'))}});
 const pDown=e=>{const p=e.target.closest('[data-p]')||e.target.closest('[data-pb]');if(!p)return;e.preventDefault();const id=p.dataset.p||p.getAttribute('data-pb');press(id,1);
  const up=()=>{press(id,0);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)};
 el.addEventListener('pointerdown',pDown);
 el.addEventListener('keydown',e=>{const p=e.target.closest('[data-p]');if(p&&(e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press(p.dataset.p,1)}});
 el.addEventListener('keyup',e=>{const p=e.target.closest('[data-p]');if(p&&(e.key===' '||e.key==='Enter')){e.preventDefault();press(p.dataset.p,0)}});
 let last=performance.now();
 const loop=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.1,Math.max(0,(now-last)/1000));last=now;if(cur&&cur.tick){try{if(cur.tick(S,dt,R))paint()}catch(err){console.error(err)}}raf=requestAnimationFrame(loop)};
 const chB=boards.findIndex((b,i)=>chF('bd'+i));load(chB>=0?chB:(opt.start||0));raf=requestAnimationFrame(loop);}

/* ---------- board definitions ---------- */
const cntOf=(S,id)=>S.cnt[id]||0;
const BD={};
BD.f31={name:'مصباح بمفتاح مفرد (3-1)',fig:'(3-1) ب',ref:'ص 65–66',sp:F.f31,lin:on=>LIN.f31(on),linW:220,
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],loads:[{k:'E1',n:'المصباح',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'المفتاح مغلق، فيسري التيار: <b>L1 ← المفتاح ← المصباح ← L2</b>، ويضيء المصباح.':'المفتاح مفتوح: السلك من L1 إلى طرف المفتاح العلوي متصل بالطور (لونه برتقالي)، لكن الدائرة مقطوعة عند المفتاح فلا يمر تيار، والمصباح مطفأ.',
 steps:S=>[{t:'شغّل المفتاح S1',x:'اضغط على المفتاح في الدائرة التنفيذية أو على زر S1. لاحظ مسار التيار المتحرك.',done:()=>S.sw.S1},
  {t:'تتبّع المسار سلكاً سلكاً',x:'التيار يخرج من L1، ينزل إلى طرف المفتاح العلوي، يعبر المفتاح، يصعد إلى علبة التفريع ثم إلى المصباح، ويرجع من المصباح إلى L2. قارن ذلك بالدائرة الخطية: الشرطتان على كل خط = سلكان.'},
  {t:'افصل المفتاح',x:'أطفئ S1. لاحظ أن السلك بين L1 والمفتاح يبقى متصلاً بالطور (برتقالياً)، أما ما بعد المفتاح والمصباح فبلا جهد.',done:()=>!S.sw.S1&&cntOf(S,'S1')>=2}]};
BD.f32={name:'مفتاح مزدوج (3-2)',fig:'(3-2) ب',ref:'ص 66',sp:F.f32,lin:on=>LIN.f32(on),
 ctl:[{id:'S1',k:'sw',lab:'الذراع الأولى (المصباح 1)'},{id:'S2',k:'sw',lab:'الذراع الثانية (المصباح 2)'}],
 loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>{const a=R.on('E1'),b=R.on('E2');if(!a&&!b)return 'الذراعان مفتوحتان: الطرف المشترك للمفتاح موصول بـ L1 (برتقالي)، ولا يمر تيار في أي مصباح.';
  return 'يسري التيار من <b>L1 ← الطرف المشترك</b>'+(a?' ← <b>الذراع الأولى ← المصباح 1</b>':'')+(b?(a?'، ومن المشترك أيضاً':'')+' ← <b>الذراع الثانية ← المصباح 2</b>':'')+'، ثم يرجع إلى <b>L2</b> عبر العقدة المشتركة في علبة التفريع. كل ذراع تتحكم بمصباح واحد.'},
 steps:S=>[{t:'شغّل الذراع الأولى فقط',x:'اضغط S1. يضيء المصباح 1 وحده.',done:()=>S.sw.S1&&!S.sw.S2},
  {t:'شغّل الذراع الثانية أيضاً',x:'اضغط S2. يضيء المصباح 2 أيضاً، ولكل مصباح مساره من الطرف المشترك.',done:()=>S.sw.S1&&S.sw.S2},
  {t:'افصل الذراع الأولى',x:'أطفئ S1: ينطفئ المصباح 1 ويبقى 2 مضيئاً. هذا هو عمل المفتاح المزدوج: مفتاحان في علبة واحدة يشتركان في سلك التغذية.',done:()=>!S.sw.S1&&S.sw.S2},
  {t:'لاحظ عدد الأسلاك',x:'بين علبة التفريع والمفتاح ثلاثة أسلاك (التغذية المشتركة وخرجا الذراعين)، ولذلك رسم الكتاب ثلاث شُرَط على هذا الخط في الدائرة الخطية.'}]};
BD.f33={name:'مصباحان على التوازي (3-3)',fig:'(3-3) ب',ref:'ص 67',sp:F.f33,lin:on=>LIN.f33(on),
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'يسري التيار: <b>L1 ← المفتاح ← العقدة السفلى في علبة التفريع</b>، ثم يتفرع إلى <b>المصباحين معاً</b> (على التوازي) ويرجع كل منهما إلى <b>N</b>. سلك الحماية <b>PE</b> لا يمر فيه تيار في التشغيل العادي؛ وظيفته تأريض جسم الكشاف.':'المفتاح مفتوح: المصباحان مطفآن معاً، لأن مفتاحاً واحداً يتحكم في خطهما المشترك.',
 steps:S=>[{t:'شغّل المفتاح',x:'اضغط S1. يضيء المصباحان معاً.',done:()=>S.sw.S1},
  {t:'انظر إلى سلك الحماية PE',x:'السلك المتقطع PE لا يتلوّن أبداً: لا يمر فيه تيار ما دام لا يوجد عطل. هو موصول بأجسام الكشافات (رمز الأرضي).'},
  {t:'أطفئ المفتاح',x:'المصباحان ينطفئان معاً.',done:()=>!S.sw.S1&&cntOf(S,'S1')>=2}]};
BD.f34={name:'دائرة السلم من ثلاثة أماكن (3-4)',fig:'(3-4) ب',ref:'ص 68',sp:F.f34,lin:on=>LIN.f34(on),linW:300,
 ctl:[{id:'A',k:'tw',b:'S1',lab:'مفتاح ذو اتجاهين'},{id:'B',k:'im',b:'S2',lab:'مفتاح وسطي'},{id:'C',k:'tw',b:'S3',lab:'مفتاح ذو اتجاهين'}],
 loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E3',n:'المصباح 3',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'يسري التيار: <b>L1 ← S1 ← أحد السلكين المسافرين ← S2 ← أحد السلكين المسافرين ← S3 ← العقدة في علبة التفريع ← المصابيح الثلاثة ← N</b>. غيّر وضع أي مفتاح من الثلاثة فينقطع المسار.':'المسار مقطوع: التيار يصل من L1 إلى أحد السلكين المسافرين لكنه لا يجد طريقاً متصلاً حتى المصابيح. غيّر وضع أي مفتاح من الثلاثة فتضيء.',
 steps:S=>[{t:'أشعل المصابيح من المفتاح الأول',x:'غيّر وضع S1 (المفتاح ذو الاتجاهين الأيسر). تتبّع المسار: يمر في سلك مسافر واحد من كل زوج.',done:()=>!!S.pos.A&&cntOf(S,'A')>=1},
  {t:'أطفئها من المفتاح الأوسط',x:'غيّر وضع S2 (المفتاح الوسطي): يقلب توصيل السلكين المسافرين (من مستقيم إلى متصالب) فينقطع المسار.',done:()=>cntOf(S,'B')>=1},
  {t:'أشعلها من المفتاح الأخير',x:'غيّر وضع S3: تضيء المصابيح من جديد.',done:()=>cntOf(S,'C')>=1},
  {t:'جرّب أي مفتاح',x:'كل ضغطة على أي مفتاح من الثلاثة تقلب الحالة: مضيء ← مطفأ ← مضيء. لهذا تُسمّى «دائرة السلم»: تُشغّل الإنارة من كل طابق.'}]};
BD.f35={name:'مصباح فلورسنت (3-5)',fig:'(3-5) ب',ref:'ص 69',sp:F.f35,lin:on=>LIN.f35(on),linW:240,
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],
 loads:[{k:'FL:T',n:'الأنبوبة',t:'tube',on:'مضيئة',off:'مطفأة'}],
 hint:'اضغط على المفتاح، ثم راقب البادئ والفتيلتين: يحدث كل شيء في ثوانٍ قليلة.',
 tick(S,dt){const want=!!S.sw.S1;if(!want){if(S.ph!=='off'){S.ph='off';S.pt=0;return true}return false}
  S.pt=(S.pt||0)+dt;const prev=S.ph;if(S.ph==='off'){S.ph='glow';S.pt=0}else if(S.ph==='glow'&&S.pt>1.0&&!chF('stdead')){S.ph='pre';S.pt=0}else if(S.ph==='pre'&&S.pt>1.6&&!chF('stweld')){S.ph='lit';S.pt=0;S.litOnce=1}return S.ph!==prev},
 say:(S,R)=>({off:'المفتاح مفتوح: لا يمر تيار.',
  glow:'<b>١- المفتاح أُغلق:</b> يصل الجهد عبر <b>الملف الخانق</b> والفتيلتين إلى <b>البادئ</b>، فيتوهج الغاز فيه ويسخّن شريحته ثنائية المعدن.',
  pre:'<b>٢- البادئ أغلق تلامسه:</b> يمر التيار <b>L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N</b> فتسخن الفتيلتان.',
  lit:'<b>٣- البادئ فتح تلامسه:</b> انقطاع التيار فجأة في الملف الخانق يولّد دفعة جهد عالية تُشعل الغاز في الأنبوبة، فيمر التيار الآن <b>عبر الأنبوبة</b>: L1 ← المفتاح ← الملف الخانق ← الأنبوبة ← N. ويبقى الخانق في الدائرة ليحدّ التيار.'}[S.ph]),
 steps:S=>[{t:'أغلق المفتاح',x:'اضغط S1 وراقب: البادئ يتوهج أولاً.',done:()=>S.ph!=='off'},
  {t:'راقب تسخين الفتيلتين',x:'عندما يغلق البادئ تلامسه يتلوّن مسار الفتيلتين ويسري التيار عبرهما.',done:()=>S.ph==='pre'||S.ph==='lit'},
  {t:'تضيء الأنبوبة',x:'يفتح البادئ، فتضيء الأنبوبة، ويخرج البادئ من المسار.',done:()=>S.ph==='lit'},
  {t:'أطفئ المصباح',x:'افتح S1: ينقطع التيار عن الدائرة كلها.',done:()=>S.ph==='off'&&S.litOnce}]};
BD.f36={name:'مصباح مع عداد (3-6)',fig:'(3-6) ب',ref:'ص 70',sp:F.f36,lin:on=>LIN.f36(on),
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],loads:[{k:'E1',n:'المصباح',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'MT',n:'قرص العداد',t:'meter',on:'يدور',off:'واقف'}],
 say:(S,R)=>R.on('E1')?'يسري التيار كما في الرسم: <b>L1 ← المصهر ← العقدة ← المفتاح ← الطرف الأوسط للعداد ← الطرف الأيسر للعداد ← المصباح ← N</b>. تيار المصباح يمر في العداد فيدور قرصه.':'المفتاح مفتوح: لا يمر تيار في المصباح ولا في العداد، فقرص العداد واقف.',
 steps:S=>[{t:'أغلق المفتاح',x:'اضغط S1: يضيء المصباح ويدور قرص العداد.',done:()=>S.sw.S1},
  {t:'تتبّع مسار التيار في العداد',x:'التيار يدخل العداد من طرفه الأوسط ويخرج من طرفه الأيسر إلى المصباح. الطرف الأيمن موصول بالطور قبل المفتاح (اقرأ الملاحظة في الشرح عن هذا التوصيل).'},
  {t:'افتح المفتاح',x:'يقف قرص العداد: لا يسجّل العداد طاقة إلا عندما يمر تيار.',done:()=>!S.sw.S1&&cntOf(S,'S1')>=2}]};
BD.f37={name:'جرس 127 فولت (3-7)',fig:'(3-7) ب',ref:'ص 71',sp:F.f37,lin:on=>LIN.f37(on),linW:240,
 ctl:[{id:'P1',k:'pb',lab:'اضغط مع الإمساك'}],loads:[{k:'H1',n:'الجرس',t:'bell',on:'يرن',off:'صامت'}],
 hint:'الضاغط يرجع وحده: اضغط مع الإمساك (بالفأرة أو بإصبعك) على الضاغط في الرسم أو على الزر.',
 say:(S,R)=>R.on('H1')?'الضاغط مضغوط: يسري التيار <b>L1 ← الضاغط ← الجرس ← N</b> فيرن الجرس.':'الضاغط حر: يرجع تلامسه مفتوحاً وحده، فينقطع التيار ويسكت الجرس.',
 steps:S=>[{t:'اضغط الضاغط مع الإمساك',x:'يرن الجرس ما دمت ضاغطاً.',done:()=>S.pb.P1},
  {t:'اترك الضاغط',x:'يسكت الجرس فوراً: الضاغط لا يبقى مغلقاً مثل المفتاح العادي.',done:()=>!S.pb.P1&&cntOf(S,'P1')>=1},
  {t:'قارن بالمفتاح',x:'في الرسم رمز التشغيل بالضغط «[» بدل رمز التشغيل اليدوي «T» الذي رأيته في المفاتيح.'}]};
BD.f38={name:'جرس بمحول (3-8)',fig:'(3-8) ب',ref:'ص 72',sp:F.f38,lin:on=>LIN.f38(on),linW:240,
 ctl:[{id:'P1',k:'pb',lab:'اضغط مع الإمساك'}],loads:[{k:'H1',n:'الجرس',t:'bell',on:'يرن',off:'صامت'}],
 hint:'اضغط مع الإمساك على الضاغط، وراقب جانبي المحول.',
 say:(S,R)=>R.on('H1')?'الضاغط مضغوط: يسري التيار في <b>الملف الابتدائي</b>: L1 ← الضاغط ← الابتدائي ← N. فيتولد في <b>الملف الثانوي</b> جهد منخفض يغذّي الجرس: الثانوي ← الجرس ← الثانوي. الجرس غير موصول بالشبكة مباشرة.':'الضاغط حر: لا يمر تيار في الابتدائي، فلا جهد على الثانوي، والجرس صامت.',
 steps:S=>[{t:'اضغط الضاغط مع الإمساك',x:'لاحظ أن مسار التيار في دائرتين منفصلتين: دائرة الابتدائي (من الشبكة) ودائرة الثانوي (إلى الجرس).',done:()=>S.pb.P1},
  {t:'اترك الضاغط',x:'تنطفئ الدائرتان معاً.',done:()=>!S.pb.P1&&cntOf(S,'P1')>=1},
  {t:'أين الضاغط؟',x:'الضاغط في جانب الابتدائي (على L1) في هذا الرسم. لاحظ أن الجرس نفسه لا يتصل بأي سلك من L1 أو N.'}]};
BD.f39={name:'مفتاح صدمة التيار (3-9)',fig:'(3-9) ب',ref:'ص 73–74',sp:F.f39,lin:on=>LIN.f39(on),linW:300,
 ctl:[{id:'P1',k:'pb',lab:'الضاغط 1'},{id:'P2',k:'pb',lab:'الضاغط 2'},{id:'P3',k:'pb',lab:'الضاغط 3'}],
 loads:[{k:'E1',n:'المصابيح',t:'lamp',on:'مضيئة',off:'مطفأة'},{k:'KS:K',n:'ملف المفتاح',t:'relay',on:'عليه نبضة',off:'بلا تيار'}],
 hint:'اضغط أي ضاغط ثم اتركه: كل ضغطة تعطي ملف مفتاح صدمة التيار نبضة واحدة.',
 logic(S,R){const k=R.on('KS:K');if(k&&!S.kPrev){S.imp=!S.imp;S.kPrev=true;S.flips=(S.flips||0)+1;return true}S.kPrev=k;return false},
 say:(S,R)=>(R.on('KS:K')?'<b>نبضة:</b> الضاغط مضغوط فيمر تيار صغير: <b>L1 ← الضاغط ← الملف (A2–A1) ← L2</b>. ':'')+(S.imp?'التلامس <b>1–2</b> مغلق ويبقى مغلقاً بعد ترك الضاغط: <b>L1 ← التلامس 2–1 ← المصابيح الأربعة ← L2</b>.':'التلامس <b>1–2</b> مفتوح: المصابيح مطفأة. الضغطة التالية تغلقه.'),
 steps:S=>[{t:'اضغط أي ضاغط واتركه',x:'تضيء المصابيح وتبقى مضيئة بعد ترك الضاغط.',done:()=>S.imp&&!S.pb.P1&&!S.pb.P2&&!S.pb.P3},
  {t:'اضغط ضاغطاً آخر',x:'من مكان آخر: ضغطة واحدة تطفئ المصابيح.',done:()=>!S.imp&&(S.flips||0)>=2&&!S.pb.P1&&!S.pb.P2&&!S.pb.P3},
  {t:'لاحظ الدائرتين',x:'الضواغط تحمل تيار الملف فقط (دائرة التحكم)، أما تيار المصابيح فيمر في التلامس 1–2 (دائرة القدرة). لهذا يمكن وضع ضواغط كثيرة على التوازي في أماكن مختلفة.'}]};
BD.f310={name:'مزمن الإضاءة (3-10)',fig:'(3-10) ب',ref:'ص 74–75',sp:F.f310,lin:on=>LIN.f310(on),linW:300,
 ctl:[{id:'P1',k:'pb',lab:'الضاغط 1'},{id:'P2',k:'pb',lab:'الضاغط 2'},{id:'P3',k:'pb',lab:'الضاغط 3'}],
 loads:[{k:'E1',n:'المصابيح',t:'lamp',on:'مضيئة',off:'مطفأة'},{k:'TM:K',n:'دخل المزمن (7)',t:'relay',on:'عليه إشارة',off:'بلا إشارة'}],
 hint:'اضغط أي ضاغط ثم اتركه، وانتظر: تنطفئ المصابيح وحدها بعد انتهاء الزمن.',
 extra:'<div id="d3rem" class="sub" style="margin-top:8px"></div>',
 tp:{id:'u3-l5',defs:[{k:'T',label:'زمن بقاء الإنارة بعد آخر ضغطة',unit:'s',value:20,min:2,max:600,step:1}],apply:(S,TP)=>{S.T=TP.v.T;if(S.tim>S.T)S.tim=S.T}},
 logic(S,R){if(R.on('TM:K')){const was=S.tim>0;S.tim=S.T;S.starts=(S.starts||0)+(S.kPrev?0:1);if(S.kPrev&&was)S.restarted=1;S.kPrev=true;return !was}S.kPrev=false;return false},
 tick(S,dt){const el=document.getElementById('d3rem');if(el)el.innerHTML=S.tim>0?`الوقت المتبقي قبل الإطفاء: <b class="ltr">${Math.ceil(S.tim)} s</b> <span class="d3-tbar" style="display:block"><i style="width:${(100*S.tim/S.T).toFixed(1)}%"></i></span>`:'المزمن لا يعدّ الآن.';
  if(S.tim>0&&!(S.pb.P1||S.pb.P2||S.pb.P3)){S.tim=Math.max(0,S.tim-dt);if(S.tim===0){S.offs=(S.offs||0)+1;return true}}
  S.fr=(S.fr||0)+1;return S.fr%6===0&&S.tim>0},
 say:(S,R)=>(R.on('TM:K')?'<b>ضغطة:</b> الضاغط يصل الطرف <b>7</b> للمزمن بـ <b>L2</b>، فيبدأ المزمن العدّ من أوله. ':'')+(S.tim>0?'تلامس المزمن الداخلي بين الطرفين <b>2</b> و<b>3</b> مغلق: <b>L1 ← الطرفان 1 و2 ← 3 ← المصابيح ← L2</b>. تنطفئ المصابيح وحدها عند انتهاء الزمن.':'الزمن انتهى أو لم يبدأ: الطرف 3 بلا جهد، والمصابيح مطفأة.'),
 steps:(S,TPf)=>[{t:'اضغط أي ضاغط واتركه',x:'تضيء المصابيح ويبدأ العدّ التنازلي.',done:()=>S.tim>0&&!S.pb.P1&&!S.pb.P2&&!S.pb.P3},
  {t:'انتظر انتهاء الزمن',x:()=>`لا تضغط شيئاً: تنطفئ المصابيح وحدها بعد <span class="ltr">${(TPf()&&TPf().v.T)||20} s</span> من آخر ضغطة.`,done:()=>(S.offs||0)>=1&&S.tim===0},
  {t:'أعد التشغيل من مكان آخر',x:'اضغط ضاغطاً آخر، ثم اضغط مرة ثانية قبل انتهاء الزمن: يبدأ العدّ من أوله.',done:()=>(S.starts||0)>=3},
  {t:'قارن بمفتاح صدمة التيار',x:'في مفتاح صدمة التيار تبقى المصابيح مضيئة حتى ضغطة جديدة؛ في المزمن تنطفئ وحدها. الإنارة لا تُنسى مضاءة في الممرات.'}]};
/* exercises */
BD.x1a={name:'تمرين 1 — القراءة الأولى (توازٍ)',fig:'(3-13)',ref:'ص 79',sp:F.x1a,lin:on=>LIN.f313(on),
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'حل مقترح (ليس من الكتاب) — توازٍ: <b>L1 ← المفتاح ← العقدة ← كل مصباح ← N</b>. كل مصباح على الجهد الكامل.':'المفتاح مفتوح: المصباحان مطفآن.',
 steps:S=>[{t:'أغلق المفتاح',x:'المصباحان يضيئان بإضاءة كاملة: كل منهما بين الخط المُشغَّل وN.',done:()=>S.sw.S1},{t:'قارن بالقراءة الثانية',x:'اختر «القراءة الثانية (توالٍ)» من الأعلى وقارن الإضاءة.'}]};
BD.x1b={name:'تمرين 1 — القراءة الثانية (توالٍ)',fig:'(3-13)',ref:'ص 79',sp:F.x1b,lin:on=>LIN.f313(on,1),
 ctl:[{id:'S1',k:'sw',lab:'المفتاح المفرد'}],loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'ضوء خافت',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'ضوء خافت',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'حل مقترح (ليس من الكتاب) — توالٍ: <b>L1 ← المفتاح ← المصباح 1 ← المصباح 2 ← N</b>. التيار نفسه يمر في المصباحين، والجهد يتقاسمانه، فيضيئان بضوء خافت.':'المفتاح مفتوح: المصباحان مطفآن.',
 steps:S=>[{t:'أغلق المفتاح',x:'يضيء المصباحان بضوء خافت: كلاهما في مسار واحد.',done:()=>S.sw.S1},{t:'لاحظ',x:'في التوالي إذا تلف مصباح انطفأ الآخر، لأن المسار واحد. وفي الخطية (3-13) لكل مصباح ثلاثة موصلات، وهذا أقرب إلى قراءة التوازي.'}]};
BD.x2={name:'تمرين 2',fig:'(3-14)',ref:'ص 79',sp:F.x2,lin:on=>LIN.f314(on),linW:300,
 ctl:[{id:'A',k:'tw',b:'S1',lab:'المفتاح ذو الاتجاهين 1'},{id:'C',k:'tw',b:'S2',lab:'المفتاح ذو الاتجاهين 2'}],
 loads:[{k:'E1',n:'المصباح 1',t:'lamp',on:'مضيء',off:'مطفأ'},{k:'E2',n:'المصباح 2',t:'lamp',on:'مضيء',off:'مطفأ'}],
 say:(S,R)=>R.on('E1')?'حل مقترح (ليس من الكتاب): <b>L1 ← المشترك في S1 ← سلك مسافر ← S2 ← العقدة في العلبة 2 ← المصباحان ← N</b>. بين العلبتين خمسة أسلاك: مسافران، والخط المُشغَّل، وN، وPE.':'المسار مقطوع: المفتاحان على سلكين مسافرين مختلفين. غيّر وضع أي منهما.',
 steps:S=>[{t:'أشعل من المكان الأول',x:'غيّر وضع S1.',done:()=>cntOf(S,'A')>=1&&(S.pos.A?1:0)!==(S.pos.C?1:0)},{t:'أطفئ من المكان الثاني',x:'غيّر وضع S2.',done:()=>cntOf(S,'C')>=1&&(S.pos.A?1:0)===(S.pos.C?1:0)},{t:'عُدّ الأسلاك',x:'عُدّ الأسلاك بين علبتي التفريع: خمسة، كما في الرقم 5 على الخطية.'}]};
BD.x3=Object.assign({},BD.f35,{name:'تمرين 3',fig:'(3-15)',ref:'ص 80'});
BD.x4=Object.assign({},BD.f37,{name:'تمرين 4',fig:'(3-16)',ref:'ص 80',lin:on=>LIN.f37(on,'220v')});

/* ================= drawn examples (step by step) ================= */
function drawEx(o){return {title:o.title,ref:o.ref,q:o.q,note:o.note,solve:()=>{const out=(o.pre||[]).map(t=>({t}));
 o.steps.forEach((t,k)=>out.push({t:`<p>${t}</p>`+xBox(o.sp,exec(o.sp,IDLE(),{upto:k,aria:'الرسم حتى هذه الخطوة'}))}));
 if(o.post)out.push({t:o.post});out[out.length-1].final=true;return out}}}
const linStep=(txt,fn,max,...a)=>`<p>${txt}</p>`+lFig(fn,max,...a);

/* ================= the floor plan (3-11) and distribution board (3-12) ================= */
function plan311(){const W=560,H=380;let s=`<svg class="d3-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط التركيبات لوحدة سكنية — إعادة رسم مبسطة">`;
 const wall=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="currentColor" stroke-width="5" stroke-linecap="square"/>`;
 const door=(x,y,r,a0,a1,sx,sy)=>`<path d="M${x} ${y}l${sx*r} 0M${x} ${y}A${r} ${r} 0 0 ${a0} ${x+(a1==='v'?0:sx*r)} ${y+(a1==='v'?sy*r:0)}" stroke="var(--muted)" stroke-width="1" fill="none"/>`;
 /* outer walls with door gaps */
 s+=wall(20,20,540,20)+wall(20,20,20,360)+wall(20,360,540,360)+wall(540,20,540,360);
 s+=wall(20,170,120,170)+wall(160,170,300,170)+wall(340,170,540,170);
 s+=wall(220,20,220,90)+wall(220,130,220,170);
 s+=wall(220,170,220,250)+wall(220,290,220,360)+wall(390,170,390,250)+wall(390,290,390,360);
 s+=`<path d="M300 20H340" stroke="var(--surface)" stroke-width="7"/>`;
 s+=door(120,170,40,0,'v',1,-1)+door(300,170,40,1,'v',1,1)+door(220,90,40,1,'h',1,1)+door(220,250,40,0,'h',-1,1)+door(390,250,40,1,'h',1,1)+door(300,20,40,0,'v',1,1);
 /* windows */
 [[60,360,120,360],[260,360,330,360],[430,360,500,360],[20,60,20,120],[540,220,540,300]].forEach(w=>{s+=`<path d="M${w[0]} ${w[1]}L${w[2]} ${w[3]}" stroke="var(--surface)" stroke-width="3"/><path d="M${w[0]} ${w[1]}L${w[2]} ${w[3]}" stroke="var(--muted)" stroke-width="1"/>`});
 s+=tA(120,40,'غرفة أكل','middle',13)+tA(380,46,'بهو','middle',13)+tA(120,200,'غرفة جلوس','middle',13)+tA(305,200,'غرفة الوالدين','middle',13)+tA(465,200,'غرفة الطفل','middle',13);
 const lamp=(x,y)=>xmark(x,y,6,null,1.8)+fdot(x,y+14);
 const sw=(x,y,n)=>Lx.sw1(x,y)+(n?tL(x+16,y+12,n,'start',10,'m'):'');
 const sock=(x,y)=>`<path d="M${x-7} ${y}A7 7 0 0 1 ${x+7} ${y}M${x} ${y-7}V${y-12}" ${SK}/>`;
 const cab=(x,y,t,rot)=>`<text class="txt m" x="${x}" y="${y}" text-anchor="middle" font-size="9.5"${rot?` transform="rotate(-90 ${x} ${y})"`:''}>${t}</text>`;
 /* dining */
 s+=lamp(120,90)+Lx.l([120,104],[200,130])+sw(200,135,'3')+Lx.l([120,104],[60,150])+sw(60,155,'3')+Lx.l([120,104],[120,250])+cab(112,140,'mo H07 V-R Cu 2,5²',1);
 s+=sock(80,32)+sock(170,32)+Lx.l([80,26],[170,26])+cab(125,48,'mo · H07 V-R Cu 2,5² · 3')+sock(32,130);
 /* living */
 s+=fdot(120,250)+lamp(120,262)+Lx.l([120,250],[200,232])+sw(200,236,'3')+Lx.l([120,250],[300,250]);
 s+=cab(165,246,'mo H07 V-R Cu 2,5²');
 [220,260,300].forEach(y=>{s+=xmark(36,y,5,null,1.5)+`<path d="M28 ${y-8}a8 8 0 0 1 16 0" stroke="currentColor" fill="none"/>`});
 s+=Lx.l([36,214],[36,306])+tA(60,330,'قضيب تيار مع ثلاثة مصابيح متنقلة','start',9.5)+sock(100,352)+sock(180,352);
 /* parents */
 s+=fdot(300,250)+lamp(300,262)+Lx.l([300,250],[250,190])+sw(250,194,'3')+Lx.l([300,250],[465,250])+sock(240,352)+sock(370,300)+cab(350,246,'mo H07 V-R Cu 2,5²');
 /* child */
 s+=fdot(465,250)+lamp(465,262)+Lx.l([465,250],[430,195])+sw(430,199,'4')+sock(528,230)+sock(528,300)+sock(450,352);
 /* incoming lines to the board */
 s+=Lx.l([520,170],[520,60])+tL(512,120,'3','end',11)+tL(530,120,'3','start',11)+Lx.l([510,170],[510,60]);
 /* north arrow */
 s+=`<circle cx="500" cy="80" r="14" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M490 92L510 68" stroke="currentColor" stroke-width="1.2"/><path d="M500 60l-5 12h10z" fill="currentColor"/>`+tL(518,66,'N','start',12);
 return s+'</svg>';}
const C312=[
 {kind:'motor',dev:'fuse',A:'20A',n:'4',cab:'NYM Cu 2.5²',m:'m',P:'2.2 Kw',name:'محرك ثلاثي الأوجه',txt:{load:'محرك ثلاثي الأوجه 2.2 Kw',prot:'٣ مصاهر معدلها 20 أمبير',cond:'خط نحاسي مغلف 2.5 mm² (فوق الحائط أو البياض)'}},
 {kind:'lamp',dev:'cb',A:'10A',n:'3',cab:'H07 V-R Cu 2.5²',m:'m°',P:'1000w',name:'مصابيح',txt:{load:'دائرة مصابيح كهربائية',prot:'مفتاح وقاية موصلات 10 أمبير',cond:'نحاسية معزولة 2.5 mm² في ماسورة تحت البياض'}},
 {kind:'socket',dev:'cb',A:'20A',n:'3',cab:'H07 V-R Cu 2.5²',m:'m°',P:'3.3 Kw',name:'مقابس',txt:{load:'دائرة مقابس كهربائية',prot:'مفتاح وقاية موصلات 20 أمبير',cond:'نفس تركيبات الدائرة الثانية'}},
 {kind:'ac',dev:'cb',A:'20A',n:'3',cab:'H07 V-R Cu 4²',m:'',P:'4.5 Kw',name:'مكيف هواء',txt:{load:'جهاز تكييف للهواء 4.5 kW',prot:'مفتاح وقاية موصلات 20 أمبير',cond:'«ونفس الدائرة الثانية»'}},
 {kind:'oven',dev:'cb',A:'35A',n:'4',cab:'H07 V-R Cu 6²',m:'',P:'7.5Kw',name:'فرن كهربائي',txt:{load:'فرن كهربائي قدرته الكلية 7.5 kW',prot:'ثلاثة مفاتيح وقاية موصلات معدلها 35 أمبير',cond:'نحاسية معزولة 6.5 mm² تحت البياض (داخل الحائط)'}},
 {kind:'heater',dev:'cb',A:'20A',n:'3',cab:'H07 V-R Cu 4²',m:'',P:'4 Kw',name:'سخان كهربائي',txt:{load:'سخان كهربائي 4 kW',prot:'ثلاثة مفاتيح وقاية موصلات معدلها 20 أمبير',cond:'نحاسية معزولة داخل الحائط (بلا مقطع)'}}];
function board312(st,live){const W=660,H=345,xs=[70,170,270,370,470,570];st=st||{main:false,cb:[1,1,1,1,1,1],trip:[0,0,0,0,0,0],use:[0,0,0,0,0,0],blown:false};
 const en=i=>st.main&&st.cb[i]&&!(i===0&&st.blown),run=i=>en(i)&&st.use[i],any=xs.some((_,i)=>run(i));
 const cF=any?'flow':live?'live':'',cB=any?'flow':st.main&&live?'live':'';
 let s=`<svg class="d3-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط التوزيع للوحدة السكنية">`;
 s+=tL(20,50,'220/127v','start',12)+tL(20,84,'3/N ~ 60Hz','start',12)+wire([[20,64],[120,64]],cF)+Lx.tn(100,64,'4','h');
 s+=`<rect x="120" y="34" width="56" height="64" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/><rect x="120" y="34" width="56" height="12" fill="var(--surface-2)" stroke="currentColor" stroke-width="1.2"/>`+tL(148,66,'KWh','middle',12)+tL(148,88,'3~','middle',13);
 s+=`<g${any?' class="d3-spin"':''}><path d="M142 40h12" stroke="var(--stop)" stroke-width="2"/></g>`;
 s+=wire([[176,64],[300,64],[300,84]],cF)+Lx.tn(238,64,'4','h');
 /* main switch */
 const mOn=st.main;s+=`<path class="w ${cF}" d="M300 84V86"/><path class="w ${cB}" d="M300 114${mOn?'V86':'L286 90'}"/>`+term(300,86)+term(300,114)+`<path d="M266 104h8l4 -6" ${SK}/><path d="M278 100H${mOn?298:292}" stroke="currentColor" stroke-dasharray="3 2" fill="none"/>`+wire([[300,114],[300,132]],cB);
 s+=tA(258,96,'المفتاح الرئيس','end',10.5);
 if(live)s+=`<rect class="d3-hit" data-q="main" x="252" y="80" width="64" height="40" rx="6"/>`;
 s+=`<path class="w ${cB}" d="M20 132H640" style="stroke-width:5"/>`+tA(640,124,'قضيب التوزيع','end',10.5);
 xs.forEach((x,i)=>{const c=C312[i],cd=run(i)?'flow':en(i)&&live?'live':'',cu=st.main&&live?(any&&run(i)?'flow':'live'):'';
  s+=wire([[x,132],[x,152]],cu);
  if(c.dev==='fuse'){s+=`<path class="w ${cu}" d="M${x} 152V160"/><rect x="${x-5}" y="160" width="10" height="22" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/><path d="M${x-9} 186L${x+9} 156" stroke="currentColor" stroke-width="1.2"/>`+(st.blown?xmark(x,171,8,'var(--stop)',2.4):`<path class="w ${cd}" d="M${x} 160V182"/>`)+`<path class="w ${cd}" d="M${x} 182V188"/>`}
  else{const cl=st.cb[i];s+=`<path class="w ${cu}" d="M${x} 152V156"/>`+term(x,156)+term(x,186)+`<path class="w ${cd}" d="M${x} 186${cl?'V158':`L${x+12} 162`}"/><path d="M${x-22} 176V166H${x-15}V176" stroke="${st.trip[i]?'var(--stop)':'currentColor'}" stroke-width="1.4" fill="none"/><path d="M${x-15} 171H${cl?x-1:x+5}" stroke="currentColor" stroke-dasharray="3 2" fill="none"/>`;
   if(st.trip[i])s+=tA(x+14,150,'فصل','start',10);}
  s+=tL(x-26,166,c.A,'end',11.5)+wire([[x,188],[x,256]],cd)+Lx.tn(x,228,c.n,'h');
  s+=`<text class="txt m" x="${x+14}" y="250" text-anchor="start" font-size="10" transform="rotate(-90 ${x+14} 250)">${c.cab}</text>`+(c.m?tL(x-10,252,c.m,'end',11,'m'):'');
  const y=272,on=run(i);
  if(c.kind==='motor')s+=`<circle cx="${x}" cy="${y}" r="14" fill="${on?'var(--on-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/>`+tL(x,y-1,'M','middle',11)+tL(x,y+10,'3~','middle',9)+(on?`<g class="d3-spin"><path d="M${x} ${y-19}a19 19 0 0 1 16 9" stroke="var(--on)" stroke-width="2" fill="none"/></g>`:'');
  else if(c.kind==='lamp')s+=(on?halo(x,y,11):'')+xmark(x,y,9,on?LAMPS:null,2.2);
  else if(c.kind==='socket')s+=`<path d="M${x-12} ${y-8}H${x+12}M${x-10} ${y+6}A10 10 0 0 1 ${x+10} ${y+6}" stroke="${on?'var(--on)':'currentColor'}" stroke-width="2" fill="none"/>`;
  else if(c.kind==='ac'){s+=`<rect x="${x-13}" y="${y-14}" width="26" height="26" fill="${on?'var(--on-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/><path d="M${x-13} ${y-8}H${x+13}M${x-6.5} ${y-14}V${y-8}M${x} ${y-14}V${y-8}M${x+6.5} ${y-14}V${y-8}" stroke="currentColor" stroke-width="1"/>`+tL(x,y+9,'*','middle',15)}
  else if(c.kind==='oven')s+=`<rect x="${x-13}" y="${y-14}" width="26" height="26" fill="${on?'var(--on-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/><circle cx="${x}" cy="${y-5}" r="2" fill="currentColor"/><circle cx="${x-5}" cy="${y+4}" r="2" fill="currentColor"/><circle cx="${x+5}" cy="${y+4}" r="2" fill="currentColor"/>`;
  else s+=`<circle cx="${x}" cy="${y-2}" r="11" fill="${on?'var(--on-soft)':'var(--surface)'}" stroke="currentColor" stroke-width="1.6"/><circle cx="${x}" cy="${y-2}" r="3.5" fill="currentColor"/><path d="M${x} ${y+9}V${y+20}M${x-5} ${y+15}H${x+5}" ${SK}/>`;
  s+=tL(x,y+38,c.P,'middle',11.5)+tL(x,y+54,String(i+1),'middle',11.5,'b');
  if(live)s+=`<rect class="d3-hit" data-q="cb${i}" x="${x-30}" y="148" width="50" height="44" rx="6"/><rect class="d3-hit" data-q="use${i}" x="${x-22}" y="${y-22}" width="44" height="44" rx="8"/>`;
 });
 return s+'</svg>';}

/* ================= theory widgets ================= */
function orderWidget(el,items,intro){const n=items.length;let got=[],order=items.map((t,i)=>i).sort(()=>Math.random()-0.5);
 const draw=(bad)=>{el.innerHTML=`<div class="d3"><p class="sub">${intro}</p><div class="d3-ord">${order.filter(i=>!got.includes(i)).map(i=>`<button data-o="${i}" class="${bad===i?'no':''}">${items[i]}</button>`).join('')}</div>${got.length?`<div class="d3-ord"><ol>${got.map(i=>`<li>${items[i]}</li>`).join('')}</ol></div>`:''}<div class="d3-fb">${got.length===n?'<b>أحسنت.</b> هذا ترتيب الكتاب للخطوات السبع (ص 64). <button class="btn" data-r>أعد النشاط</button>':bad!=null?'ليست هذه الخطوة التالية. فكّر: ماذا نحتاج قبلها؟':''}</div></div>`};
 el.addEventListener('click',e=>{const b=e.target.closest('[data-o]');if(b){const i=+b.dataset.o;if(i===got.length){got.push(i);draw()}else draw(i)}if(e.target.closest('[data-r]')){got=[];order.sort(()=>Math.random()-0.5);draw()}});draw();}
function mcqWidget(el,qs){el.innerHTML=`<div class="d3">${qs.map((q,k)=>`<div class="d3-q" data-k="${k}"><p>${q.q}</p>${q.fig||''}<div class="d3-row">${q.o.map((o,j)=>`<button data-j="${j}">${o}</button>`).join('')}</div><div class="d3-fb"></div></div>`).join('')}</div>`;
 el.addEventListener('click',e=>{const b=e.target.closest('[data-j]');if(!b)return;const box=b.closest('[data-k]'),q=qs[+box.dataset.k],j=+b.dataset.j;box.querySelectorAll('[data-j]').forEach(x=>x.classList.remove('ok','no'));b.classList.add(j===q.c?'ok':'no');box.querySelector('.d3-fb').innerHTML=(j===q.c?'<b>صحيح.</b> ':'<b>ليس هذا.</b> ')+q.e;B.math&&B.math(box)});}

/* legend of the single-line symbols used in this unit (drawn from the book's figures) */
function legendSvg(){const W=560,H=250,cells=[
 ['src','المصدر / لوحة التوزيع'],['jn','علبة تفريع'],['tk','شرطتان = سلكان'],['tn','شرطة + رقم = عدد الأسلاك'],
 ['x','مصباح'],['xo','مصباح (رسم آخر)'],['sw1','مفتاح مفرد'],['sw2','مفتاح مزدوج'],
 ['tw','مفتاح ذو اتجاهين'],['im','مفتاح وسطي'],['pb','ضاغط'],['bell','جرس']];
 let s=`<svg class="d3-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="رموز الدائرة الخطية في هذه الوحدة">`;
 cells.forEach((c,i)=>{const cx=70+(i%4)*140,cy=40+Math.floor(i/4)*80;let g='';
  if(c[0]==='src')g=Lx.src(cx,cy);else if(c[0]==='jn')g=Lx.l([cx-30,cy],[cx-6,cy])+Lx.jn(cx,cy)+Lx.l([cx+6,cy],[cx+30,cy]);
  else if(c[0]==='tk')g=Lx.l([cx-30,cy],[cx+30,cy])+Lx.tk(cx,cy,2,'h');else if(c[0]==='tn')g=Lx.l([cx-30,cy],[cx+30,cy])+Lx.tn(cx,cy,'3','h');
  else if(c[0]==='x')g=Lx.x(cx,cy);else if(c[0]==='xo')g=Lx.xo(cx,cy);else if(c[0]==='bell')g=Lx.bell(cx,cy+6);else if(c[0]==='pb')g=Lx.pb(cx,cy);
  else g=Lx[c[0]](cx,cy+(c[0]==='sw1'||c[0]==='sw2'?6:0));
  s+=g+tA(cx,cy+34,c[1],'middle',11.5)});
 return s+'</svg>';}

/* ============================== LESSON 1 ============================== */
B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'61–66',
 title:'خطوات رسم مخطط بيان التوصيلات، والدائرة الخطية والتنفيذية',
 summary:'كيف يُجهَّز مخطط التوصيلات الكهربائية للمبنى في سبع خطوات، والفرق بين الدائرة الخطية (المفهوم العام) والدائرة التنفيذية (كل سلك على حدة)، مع أول مثال: مصباح بمفتاح مفرد.',
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
})())/*DCML-END*/,
(window.U3ST=window.U3ST||(function(){
/* أدوات محطات الوحدة الثالثة (الرسم الفني): تعيد استعمال محرك الرسم في هذا الملف (exec / solve / LIN / F / BD).
   art: رسم المحطة 360×320 بألوان ثابتة فاتحة (خلفية الرسم فاتحة في الوضعين)؛ fit: يضع رسم الكتاب داخل الرسم مع مناطق data-tip؛
   mini: مختبر مصغّر على الدائرة التنفيذية (مفاتيح/ضواغط أو مراحل)؛ ticks: الشُّرَط في الخطية ↔ الأسلاك في التنفيذية؛
   find: «اضغط على …» فوق رسم الكتاب. */
const PAL='--fg:#2C4A40;--wire:#2C4A40;--surface:#FBF6EE;--surface-2:#EDE3D2;--muted:#5E6F66;--line:#CDBFA8;--blue:#2F6FB0;--blue-soft:#D3E4F4;--live:#C8701E;--on:#12855A;--on-soft:#D4EEDD;--stop:#C0392B;--stop-soft:#F6D8D2;--lamp-off:#E9E1D2;color:#2C4A40';
const strip=s=>String(s).replace(/^\s*<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const dims=s=>{const m=/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s);return [+m[1],+m[2]]};
const esc=s=>String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;');
const N0=()=>false;
/* fit(svg, [x,y,w,h], {vb:[x,y,w,h] منطقة من الرسم, hot:[[x,y,w,h,tip]…], extra: svg بوحدات الرسم}) */
function fit(svg,box,o){o=o||{};const [W,H]=dims(svg),v=o.vb||[0,0,W,H],k=Math.min(box[2]/v[2],box[3]/v[3]),ox=box[0]+(box[2]-v[2]*k)/2-v[0]*k,oy=box[1]+(box[3]-v[3]*k)/2-v[1]*k;
 return `<g class="d3-svg" transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${k.toFixed(4)})">${strip(svg)}${o.extra||''}${(o.hot||[]).map(r=>`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="5" fill="transparent" data-tip="${esc(r[4])}"/>`).join('')}</g>`}
function art(aria,bg,inner){return `<svg viewBox="0 0 360 320" role="img" aria-label="${esc(aria)}" style="font-family:var(--font);${PAL}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg||'#DDEFE6'}"/>${inner}</svg>`}
/* نص عربي في الرسم (وسط) */
const at=(x,y,s,fs,bold,fill)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs||13}" fill="${fill||'#2C4A40'}"${bold?' font-weight="700"':''} direction="rtl">${s}</text>`;
const lin=(fn,...a)=>fn(N0,...a);
const litExec=(sp,set)=>{const S=Object.assign(IDLE(),set||{});return exec(sp,S,{R:solve(sp,S)})};

const css=`.u3m .u3m-x{max-width:var(--mw,520px);margin:10px auto 0}
.u3m .u3m-pb{touch-action:none;user-select:none;-webkit-user-select:none}
.u3m .u3m-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:10px;align-items:center;margin-top:10px}
@media (max-width:640px){.u3m .u3m-pair{grid-template-columns:minmax(0,1fr)}}
.u3m .u3m-pair .svgbox{margin:0 auto}
.u3m rect.u3h{fill:transparent;cursor:pointer;stroke:none}
.u3m rect.u3h:hover{fill:var(--blue-soft);fill-opacity:.55}
.u3m rect.u3h.ok{fill:var(--on-soft);fill-opacity:.75;stroke:var(--on);stroke-width:2}
.u3m rect.u3h.no{fill:var(--stop-soft);fill-opacity:.75}
.u3m .u3m-cap{font-size:12.5px;color:var(--muted);text-align:center;margin-top:4px}
.u3m .d3-key{justify-content:center}`;
function prep(el,B){if(!document.getElementById('dcml-css')){try{DCML.tf(document.createElement('div'),B,{items:[]})}catch(e){}}
 if(!document.getElementById('u3st-css')){const s=document.createElement('style');s.id='u3st-css';s.textContent=css;document.head.appendChild(s)}
 el.classList.add('ml','u3m')}
const fin=(x,B)=>{try{B.math(x)}catch(e){}};
const pd=o=>o?`<div class="ml-pd"><div class="ml-q"><span class="ml-tag">توقّع أولاً</span>${o.q}</div><div class="ml-pool">${o.opts.map((x,j)=>`<button type="button" class="ml-b" data-pj="${j}">${x[0]}</button>`).join('')}</div><div class="ml-fb" data-pfb hidden></div></div>`:'';
function pdWire(el,B,o,body){if(!o)return;const bs=[...el.querySelectorAll('[data-pj]')],fb=el.querySelector('[data-pfb]');
 bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.pj,op=o.opts[j],ok=!!op[1],right=o.opts.find(x=>x[1]);
  bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(o.opts[+x.dataset.pj][1]?'ok':x===b?'no':'dim')});
  fb.className='ml-fb'+(ok?'':' warn');fb.innerHTML=B.ltrU(`<b>${ok?'توقّعك صحيح.':'ليس هذا.'}</b> ${op[2]||''}${!ok&&right[2]?'<br>'+right[2]:''}<br><b>الآن جرّب بنفسك في الأسفل وتأكد.</b> <button type="button" class="ml-b" data-pr style="min-height:34px;padding:3px 10px">غيّر توقّعك</button>`);fb.hidden=false;fin(fb,B);body.classList.remove('ml-lock');
  fb.querySelector('[data-pr]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true}})}

/* ---- mini: o={bd | boards:[{name,bd,…}], predict, intro, after}; bd = لوحة من BD (sp, ctl, loads, say, logic) أو {sp, loads, states:[[اسم, S=>{…}, نص]]} ---- */
function mini(el,B,o){prep(el,B);const bds=o.boards||[{bd:o.bd}];let cur,S,R;
 el.innerHTML=(o.intro?`<p class="ml-in">${o.intro}</p>`:'')+pd(o.predict)+`<div class="ml-body${o.predict?' ml-lock':''}">${bds.length>1?`<div class="ml-seg">${bds.map((b,i)=>`<button type="button" class="ml-b" data-bd="${i}">${b.name}</button>`).join('')}</div>`:''}<div class="svgbox d3 u3m-x" data-x></div><div class="d3-key"><span><i class="l"></i>موصول بالطور ولا يمر تيار</span><span><i class="f"></i>يمر تيار</span><span><i></i>بلا جهد</span></div><div class="ml-seg" data-ctl></div><div class="d3-loads" data-ld></div><div class="ml-fb" data-say></div>${o.after?`<div class="ml-why">${o.after}</div>`:''}</div>`;
 const body=el.querySelector('.ml-body'),X=el.querySelector('[data-x]'),C=el.querySelector('[data-ctl]'),LD=el.querySelector('[data-ld]'),SY=el.querySelector('[data-say]');
 const fresh=()=>({sw:{},pos:{},pb:{},n:0,cnt:{},ph:'off',imp:false,tim:0,T:1,st:0});
 const compute=()=>{for(let k=0;k<4;k++){R=solve(cur.sp,S);if(!(cur.logic&&cur.logic(S,R)))break}};
 const ctlH=c=>`<button type="button" class="ml-b${c.k==='pb'?' u3m-pb':''}" ${c.k==='pb'?'data-p':'data-c'}="${c.id}" aria-pressed="false">${c.k==='pb'?'اضغط مع الإمساك: ':''}<span class="ltr">${c.b||c.id}</span> — ${c.lab}</button>`;
 const paint=()=>{compute();X.style.setProperty('--mw',(cur.mw||cur.sp.W)+'px');X.innerHTML=exec(cur.sp,S,{R,live:!cur.states});
  LD.innerHTML=(cur.loads||[]).map(l=>{const on=R.on(l.k);return `<span class="d3-load${on?' on':''}">${ICON[l.t](on)}${l.n}: ${on?(l.on||'يعمل'):(l.off||'لا يعمل')}</span>`}).join('');
  SY.innerHTML=B.ltrU(cur.states?cur.states[S.st][2]:cur.say(S,R));fin(SY,B);
  C.querySelectorAll('[data-c]').forEach(b=>{const c=cur.ctl.find(x=>x.id===b.dataset.c),v=c.k==='sw'?!!S.sw[c.id]:!!S.pos[c.id];b.setAttribute('aria-pressed',String(v));if(c.k!=='sw')b.innerHTML=`<span class="ltr">${c.b||c.id}</span> — ${c.lab}: ${v?'الوضع 2':'الوضع 1'}`});
  C.querySelectorAll('[data-p]').forEach(b=>b.setAttribute('aria-pressed',String(!!S.pb[b.dataset.p])));
  C.querySelectorAll('[data-st]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.st===S.st)))};
 const setSt=j=>{S=fresh();S.st=j;cur.states[j][1](S)};
 const load=i=>{const b=bds[i];cur=Object.assign({},b.bd||{},b);delete cur.bd;S=fresh();
  el.querySelectorAll('[data-bd]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.bd===i)));
  C.innerHTML=cur.states?cur.states.map((s,j)=>`<button type="button" class="ml-b" data-st="${j}">${s[0]}</button>`).join(''):(cur.ctl||[]).map(ctlH).join('');
  if(cur.states)setSt(0);paint()};
 el.addEventListener('click',e=>{const t=e.target;const bd=t.closest('[data-bd]');if(bd){load(+bd.dataset.bd);return}
  const st=t.closest('[data-st]');if(st&&cur.states){setSt(+st.dataset.st);paint();return}
  const c=t.closest('[data-c]')||t.closest('[data-sw]');if(c&&!cur.states){const id=c.dataset.c||c.getAttribute('data-sw'),d=(cur.ctl||[]).find(x=>x.id===id);if(!d||d.k==='pb')return;
   if(d.k==='sw')S.sw[id]=!S.sw[id];else S.pos[id]=S.pos[id]?0:1;S.n++;S.cnt[id]=(S.cnt[id]||0)+1;paint()}});
 const press=(id,v)=>{if(!!S.pb[id]===!!v)return;S.pb[id]=v?1:0;if(v){S.n++;S.cnt[id]=(S.cnt[id]||0)+1}paint()};
 el.addEventListener('pointerdown',e=>{if(!cur||cur.states)return;const p=e.target.closest('[data-p]')||e.target.closest('[data-pb]');if(!p)return;e.preventDefault();const id=p.dataset.p||p.getAttribute('data-pb');press(id,1);
  const up=()=>{press(id,0);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)});
 el.addEventListener('keydown',e=>{const p=e.target.closest('[data-p]');if(p&&(e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press(p.dataset.p,1)}});
 el.addEventListener('keyup',e=>{const p=e.target.closest('[data-p]');if(p&&(e.key===' '||e.key==='Enter')){e.preventDefault();press(p.dataset.p,0)}});
 pdWire(el,B,o.predict,body);load(0);}

/* ---- ticks: o={intro, sp, lin (svg), linW, segs:[{t, n, w:[أرقام الأسلاك في sp.wires], why}], opts} ---- */
function ticks(el,B,o){prep(el,B);let hl=[];const opts=o.opts||[1,2,3,4];
 el.innerHTML=(o.intro?`<p class="ml-in">${o.intro}</p>`:'')+`<div class="u3m-pair"><div><div class="svgbox d3" style="max-width:${o.linW||240}px">${o.lin}</div><div class="u3m-cap">الدائرة الخطية</div></div><div><div class="svgbox d3" data-x style="max-width:${o.sp.W}px"></div><div class="u3m-cap">الدائرة التنفيذية — الأسلاك الملوّنة = جواب آخر سؤال</div></div></div>`
  +o.segs.map((s,i)=>`<div class="ml-it" data-i="${i}"><p>${s.t}</p><div class="ml-row">${opts.map(n=>`<button type="button" class="ml-b" data-n="${n}">${n}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('')+`<div class="ml-score" hidden></div>`;
 const X=el.querySelector('[data-x]');const draw=()=>{const set=new Set(hl.map(i=>'w'+i));X.innerHTML=exec(o.sp,IDLE(),{R:{c:k=>set.has(k)?'flow':'',on:N0}})};
 const done={};
 el.querySelectorAll('.ml-it').forEach(box=>{const i=+box.dataset.i,s=o.segs[i],w=box.querySelector('.ml-why'),bs=[...box.querySelectorAll('[data-n]')];
  bs.forEach(b=>b.onclick=()=>{const ok=+b.dataset.n===s.n;bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(+x.dataset.n===s.n?'ok':x===b?'no':'dim')});
   hl=s.w;draw();w.innerHTML=B.ltrU(`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${s.why} <button type="button" class="ml-b" data-show style="min-height:34px;padding:3px 10px">أرني هذه الأسلاك</button>`);w.hidden=false;fin(w,B);
   w.querySelector('[data-show]').onclick=()=>{hl=s.w;draw();X.scrollIntoView({block:'nearest',behavior:'smooth'})};done[i]=ok;
   if(Object.keys(done).length===o.segs.length){const sc=el.querySelector('.ml-score'),k=Object.values(done).filter(Boolean).length;sc.innerHTML=`أصبت <span class="ltr">${k} / ${o.segs.length}</span>. <button type="button" class="ml-b" data-rs>أعد النشاط</button>`;sc.hidden=false;sc.querySelector('[data-rs]').onclick=()=>ticks(el,B,o)}})});
 draw();}

/* ---- find: o={intro, svg, mw, reg:{k:[x,y,w,h,اسم]}, asks:[[k, 'اضغط على …', السبب]]} — المناطق بوحدات الرسم، الأصغر بعد الأكبر ---- */
function find(el,B,o){prep(el,B);let qi=0,miss=0;const keys=Object.keys(o.reg);
 const svg=o.svg.replace(/<\/svg>\s*$/,keys.map(k=>{const r=o.reg[k];return `<rect class="u3h" data-k="${k}" x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="6"><title>${r[4].replace(/<[^>]+>/g,'')}</title></rect>`}).join('')+'</svg>');
 el.innerHTML=(o.intro?`<p class="ml-in">${o.intro}</p>`:'')+`<div class="ml-fb" data-q></div><div class="svgbox d3" style="max-width:${o.mw||520}px;margin:10px auto 0">${svg}</div><div class="ml-fb" data-fb hidden></div>`;
 const Q=el.querySelector('[data-q]'),FB=el.querySelector('[data-fb]');
 const ask=()=>{el.querySelectorAll('rect.u3h').forEach(r=>r.classList.remove('ok','no'));if(qi>=o.asks.length){Q.innerHTML=`<b>أنهيت الأسئلة.</b> أخطأت ${miss?`<span class="ltr">${miss}</span> مرة`:'صفر مرة'}. <button type="button" class="ml-b" data-rs>أعد النشاط</button>`;Q.querySelector('[data-rs]').onclick=()=>{qi=0;miss=0;FB.hidden=true;ask()};return}
  Q.innerHTML=B.ltrU(`<b>السؤال <span class="ltr">${qi+1} / ${o.asks.length}</span>:</b> ${o.asks[qi][1]}`)};
 el.addEventListener('click',e=>{const r=e.target.closest('rect.u3h');if(!r||qi>=o.asks.length)return;const k=r.dataset.k,a=o.asks[qi];
  el.querySelectorAll('rect.u3h.no').forEach(x=>x.classList.remove('no'));
  if(k===a[0]){r.classList.add('ok');FB.className='ml-fb';FB.innerHTML=B.ltrU(`<b>صحيح.</b> ${a[2]||''} <button type="button" class="ml-b" data-nx style="min-height:34px;padding:3px 10px">${qi+1<o.asks.length?'السؤال التالي':'إنهاء'}</button>`);FB.hidden=false;fin(FB,B);FB.querySelector('[data-nx]').onclick=()=>{qi++;FB.hidden=true;ask()}}
  else{miss++;r.classList.add('no');FB.className='ml-fb bad';FB.innerHTML=B.ltrU(`<b>ليس هذا.</b> ضغطت على: ${o.reg[k][4]}. حاول مرة أخرى.`);FB.hidden=false}});
 ask();}

return {art,fit,at,lin,litExec,mini,ticks,find,N0};
})())
/*U3END*/,{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثالثة: الدوائر الخطية والتنفيذية للتوصيلات المنزلية',ref:'ص 61–62',
   q:'ماذا ستستطيع أن تفعل عندما تنهي هذه الوحدة؟',
   art:U3ST.art('هدفا الوحدة: توصيلات الإضاءة والتجهيزات المنزلية، ولوحات التوزيع المنزلية','#E4EEDC',
    U3ST.at(180,58,'الهدف العام',15,1)+U3ST.at(180,80,'رسم الدوائر الخطية والتنفيذية',13)+U3ST.at(180,98,'للتوصيلات المنزلية',13)
    +`<g data-tip="الهدف التفصيلي الأول: قراءة ورسم توصيلات الإضاءة والتجهيزات المنزلية — مثل مصباح بمفتاح، ودائرة السلم، والجرس. هذه دروس الوحدة من الأول إلى الخامس."><rect x="190" y="116" width="130" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="255" cy="160" r="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M243 148L267 172M267 148L243 172" stroke="#2C4A40" stroke-width="2.5"/><rect x="246" y="182" width="18" height="10" rx="2" fill="#2C4A40"/></g>`
    +U3ST.at(255,214,'توصيلات الإضاءة',13,1)+U3ST.at(255,232,'والتجهيزات المنزلية',12)+U3ST.at(255,252,'قراءة ورسم',11.5,0,'#5E6F66')
    +`<g data-tip="الهدف التفصيلي الثاني: قراءة ورسم لوحات التوزيع الكهربائية المنزلية — العداد والمفتاح الرئيس وقضيب التوزيع وجهاز حماية لكل دائرة. هذا درس لوحات التوزيع."><rect x="40" y="116" width="130" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="80" y="134" width="50" height="62" rx="4" fill="#9CC5D9" stroke="#2C4A40" stroke-width="2.5"/><path d="M86 148H124" stroke="#2C4A40" stroke-width="4"/><path d="M92 152V170M105 152V170M118 152V170" stroke="#2C4A40" stroke-width="2.2"/><rect x="88" y="170" width="8" height="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><rect x="101" y="170" width="8" height="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><rect x="114" y="170" width="8" height="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/></g>`
    +U3ST.at(105,214,'لوحات التوزيع',13,1)+U3ST.at(105,232,'الكهربائية المنزلية',12)+U3ST.at(105,252,'قراءة ورسم',11.5,0,'#5E6F66')),
   cap:'للوحدة هدف عام وهدفان تفصيليان.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف أين تدرسه في الوحدة.</b>',
   side:[
    {predict:{q:'أي هذه الرسوم ستتعلم قراءته ورسمه في هذه الوحدة؟',opts:[
     ['رسم ميكانيكي لأجزاء محرك',false,'هذا ليس من أهداف الوحدة؛ الوحدة عن التوصيلات المنزلية.'],
     ['رسم معماري لواجهة المبنى',false,'المسقط الأفقي للمبنى أساس لمخطط التوصيلات، لكن رسم الواجهة ليس هدفاً للوحدة.'],
     ['توصيلات الإضاءة والتجهيزات المنزلية، ولوحات التوزيع المنزلية',true,'هذان هما الهدفان التفصيليان للوحدة (ص 62).']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> القدرة على رسم الدوائر الخطية والتنفيذية للتوصيلات المنزلية.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من قراءة ورسم توصيلات الإضاءة والتجهيزات المنزلية.</li><li>أن يتمكن المتدرب من قراءة ورسم لوحات التوزيع الكهربائية المنزلية.</li></ol>`,ref:'ص 62'},
    {tip:String.raw`<p>كلمتان تتكرران في كل الوحدة:</p><ul><li><b>الدائرة الخطية:</b> رسم مختصر للدائرة بخط واحد لكل مسار.</li><li><b>الدائرة التنفيذية:</b> رسم كل سلك على حدة كما يُنفَّذ.</li></ul><p>الدروس من الأول إلى الخامس للهدف الأول (دوائر الإنارة والأجراس)، والدرس السادس للهدف الثاني (لوحة التوزيع)، والسابع تمارين.</p>`,title:'خريطة الوحدة'},
    {title:'تحقق سريع: لأي هدف هذا العمل؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل عمل اختر الهدف التفصيلي الذي يخدمه.',cats:['الهدف ١: توصيلات الإضاءة والتجهيزات','الهدف ٢: لوحات التوزيع'],items:[
 ['رسم الدائرة التنفيذية لمصباح بمفتاح مفرد.',0,'توصيلة إضاءة منزلية — الهدف الأول.'],
 ['قراءة جهاز الحماية ومقطع الموصل لكل دائرة في لوحة الوحدة السكنية.',1,'هذا من مخطط لوحة التوزيع — الهدف الثاني.'],
 ['رسم دائرة جرس يعمل بضاغط.',0,'الجرس من التجهيزات المنزلية — الهدف الأول.'],
 ['معرفة موضع العداد والمفتاح الرئيس قبل قضيب التوزيع.',1,'هذه أجزاء لوحة التوزيع المنزلية — الهدف الثاني.']]})}
   ]},

  {st:2,short:'المقدمة',title:'٣-١ المقدمة',ref:'ص 63',
   q:'لماذا لا يُترك توصيل الأسلاك داخل المبنى لاجتهاد كل فني؟',
   art:U3ST.art('التوصيل الخاطئ قد يسبب حريقاً أو إصابة، ولذلك يُسجَّل كل شيء في مخطط بيان التوصيلات','#F7DCC8',
    `<g data-tip="التوصيل الخاطئ للأسلاك داخل المباني قد يسبب حدوث حريق أو إصابات للإنسان؛ ولهذا وُضعت تعليمات التركيب والشروط التفصيلية لتركيب الأسلاك."><rect x="46" y="84" width="96" height="120" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="72" y="104" width="44" height="44" rx="8" fill="#EDE3D2" stroke="#2C4A40" stroke-width="2"/><circle cx="86" cy="126" r="4" fill="#2C4A40"/><circle cx="102" cy="126" r="4" fill="#2C4A40"/><path d="M94 196C78 186 80 170 90 160C90 170 98 172 98 164C108 172 110 188 94 196Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g>`
    +U3ST.at(94,226,'توصيل خاطئ',13,1)+U3ST.at(94,244,'حريق أو إصابة',12)
    +`<g data-tip="المواصفات القياسية الفنية: وضعت الجهات المعنية على أساسها تعليمات طريقة التركيب الكهربائية والشروط التفصيلية لتركيب الأسلاك داخل المباني."><path d="M150 140H192" stroke="#2C4A40" stroke-width="3"/><path d="M192 140l-10 -6v12z" fill="#2C4A40"/></g>`
    +U3ST.at(172,124,'تعليمات',11.5)
    +`<g data-tip="مخطط بيان التوصيلات: رسم تخطيطي واحد يُعمل عند إقامة منشأة جديدة، ويُسجَّل فيه أحمال الإضاءة الكهربائية والقدرة وطريقة إنشاء لوحة التوزيع، ورسم شبكة تركيب الأسلاك داخل المبنى."><rect x="200" y="62" width="120" height="170" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M200 86H320" stroke="#2C4A40" stroke-width="1.6"/>`
    +[[112,'أحمال الإضاءة'],[146,'القدرة'],[180,'لوحة التوزيع'],[214,'شبكة الأسلاك']].map(r=>`<circle cx="306" cy="${r[0]-4}" r="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/>`).join('')+`</g>`
    +U3ST.at(260,79,'مخطط بيان التوصيلات',11.5,1)+U3ST.at(250,112,'أحمال الإضاءة',12)+U3ST.at(250,146,'القدرة',12)+U3ST.at(250,180,'لوحة التوزيع',12)+U3ST.at(250,214,'شبكة الأسلاك',12)
    +U3ST.at(180,280,'كل ذلك في رسم تخطيطي واحد',14,1)),
   cap:'من الخطر إلى التنظيم: تعليمات للتركيب، ومخطط واحد يجمع كل البيانات.<br><b>مرّر المؤشر على الأجزاء الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند إقامة منشأة جديدة، أين تُسجَّل أحمال الإضاءة والقدرة وطريقة إنشاء لوحة التوزيع وشبكة الأسلاك؟',opts:[
     ['في رسم تخطيطي واحد هو مخطط بيان التوصيلات',true,'«ويتم إدخال ما سبق ذكره في رسم تخطيطي واحد» (ص 63).'],
     ['في رسم منفصل لكل بند منها',false,'الكتاب يجمعها كلها في رسم تخطيطي واحد.'],
     ['لا تُسجَّل؛ يركّبها الفني في الموقع مباشرة',false,'التوصيل الخاطئ قد يسبب حريقاً أو إصابات، ولذلك يُعمل مخطط بيان التوصيلات قبل التنفيذ.']]}}
   ],
   body:[
    {book:String.raw`<p>نظراً لأن توصيل الأسلاك الخاطئ داخل المباني قد يسبب حدوث حريق أو إصابات للإنسان، فقد وضعت تعليمات عديدة لطريقة التركيب الكهربائية بواسطة الجهات المعنية طبقاً للمواصفات القياسية الفنية للأجهزة الكهربائية، وأيضاً وضعت الشروط التفصيلية لتركيب الأسلاك داخل المباني. وفي حالة إقامة منشآت جديدة، يتم عمل مخطط بيان التوصيلات، حيث يسجل بهذا الرسم التخطيطي أحمال الإضاءة الكهربائية والقدرة وطريقة إنشاء لوحة التوزيع، ويوضع رسم لشبكة تركيب الأسلاك داخل المبنى. ويتم إدخال ما سبق ذكره في رسم تخطيطي واحد.</p>`,ref:'ص 63'},
    {tip:String.raw`<p>الفكرة في سطرين: <b>الخطأ في التوصيل خطر</b>، فوُضعت له تعليمات وشروط. و<b>قبل البناء</b> نرسم «مخطط بيان التوصيلات» الذي يجمع: ماذا سنشغّل (أحمال الإضاءة والقدرة)، ومن أين نغذيه (لوحة التوزيع)، وكيف تمر الأسلاك (شبكة التركيب).</p>`,title:'الفكرة'},
    {add:String.raw`<p>بعد سنوات من البناء، الفني الذي يأتي لإصلاح عطل أو لإضافة مقبس يعود إلى هذا المخطط ليعرف مسار الأسلاك والدائرة التي يتبعها كل جهاز، بدل أن يخمّن أو يكسر الجدران بحثاً عنها.</p>`,title:'لماذا يبقى المخطط مهماً بعد البناء؟'},
    {title:'تحقق سريع: ماذا يقول النص؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب (ص 63).',items:[
 ['التوصيل الخاطئ للأسلاك داخل المباني قد يسبب حريقاً أو إصابات للإنسان.',true,'هذا أول ما يذكره النص، وهو سبب وضع التعليمات.'],
 ['تعليمات طريقة التركيب يضعها كل مقاول بنفسه.',false,'وضعتها الجهات المعنية طبقاً للمواصفات القياسية الفنية للأجهزة الكهربائية.'],
 ['مخطط بيان التوصيلات يُسجَّل فيه أحمال الإضاءة والقدرة وطريقة إنشاء لوحة التوزيع.',true,'ويوضع فيه أيضاً رسم لشبكة تركيب الأسلاك داخل المبنى.'],
 ['لكل بند من بنود المخطط رسم مستقل.',false,'«ويتم إدخال ما سبق ذكره في رسم تخطيطي واحد».']]})}
   ]},

  {st:3,short:'الإضاءة والتجهيزات',title:'٣-٢ توصيلات الإضاءة والتجهيزات المنزلية',ref:'ص 63',
   q:'المصباح والغسالة كلاهما يعمل بالكهرباء… فلماذا يقسم الكتاب توصيلات المنزل إلى قسمين؟',
   art:U3ST.art('مبنى من ثلاثة أدوار يدخله خط رئيس يوزَّع إلى كل الوحدات، وفي الوحدة توصيلات للإنارة وتوصيلات لمآخذ التيار','#DCE9F2',
    `<path d="M70 70H290V262H70Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 134H290M70 198H290M180 70V262" stroke="#2C4A40" stroke-width="1.6"/>`
    +`<g data-tip="الخط الرئيس: يُركَّب من خارج المبنى إلى داخله عند إنشاء المبنى."><path d="M20 248H120" stroke="#C8701E" stroke-width="5"/><path d="M28 238l-8 10 8 10" fill="none" stroke="#C8701E" stroke-width="3"/></g>`
    +`<g data-tip="توزيع الخط الرئيس: يوزَّع إلى جميع الوحدات السكنية في جميع الأدوار."><path d="M120 248V96" stroke="#C8701E" stroke-width="5"/>${[96,160,224].map(y=>`<path d="M88 ${y}H214" stroke="#C8701E" stroke-width="3.5"/>`).join('')}</g>`
    +`<g data-tip="القسم (أ): توصيلات لغرض الإنارة — المصابيح ومفاتيحها."><circle cx="236" cy="96" r="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><path d="M226 86L246 106M246 86L226 106" stroke="#2C4A40" stroke-width="2"/></g>`
    +`<g data-tip="القسم (ب): توصيلات لأغراض التشغيل والإدارة للأحمال الأخرى — تبريد وتكييف وتدفئة وأفران وغسالات وتسخين مياه… ولذلك تُعمل توصيلات خاصة لمآخذ التيار (البرايز)."><rect x="250" y="148" width="30" height="30" rx="5" fill="#EDE3D2" stroke="#2C4A40" stroke-width="2"/><circle cx="260" cy="163" r="3" fill="#2C4A40"/><circle cx="270" cy="163" r="3" fill="#2C4A40"/></g>`
    +U3ST.at(236,124,'أ- الإنارة',12,1)+U3ST.at(236,191,'ب- الأحمال الأخرى',10.5,1)+U3ST.at(58,276,'خط رئيس',12,1)+U3ST.at(180,288,'من خارج المبنى إلى كل الوحدات في كل الأدوار',12.5)),
   cap:'خط رئيس واحد يوزَّع على الوحدات، وفي كل وحدة قسمان من التوصيلات.<br><b>مرّر المؤشر على الخط البرتقالي والمصباح والمقبس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تريد تشغيل غسالة في المطبخ. على أي قسم من التوصيلات تعتمد؟',opts:[
     ['على توصيلات الإنارة',false,'الإنارة قسم مستقل للمصابيح.'],
     ['لا تحتاج توصيلاً خاصاً',false,'الكتاب: «يؤخذ في الاعتبار عمل توصيلات خاصة لمآخذ التيار (البرايز) لتشغيل أي جهاز من الأجهزة السابقة».'],
     ['على توصيلات التشغيل والإدارة للأحمال الأخرى، عبر مأخذ تيار (بريزة)',true,'الغسالات مذكورة صراحة في القسم (ب) (ص 63).']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن تقسيم التوصيلات الكهربائية داخل المنازل إلى قسمين:</p><p>أ- لغرض الإنارة.</p><p>ب- لأغراض التشغيل والإدارة للأحمال الأخرى مثل أجهزة التبريد والتكييف والتدفئة والأفران الكهربائية والغسالات وأجهزة التنظيف وإعداد الطعام والحياكة وأجهزة تسخين المياه وخلافه.</p><p>ولذلك عند إعداد التركيبات داخل المنازل يؤخذ في الاعتبار عمل توصيلات خاصة لمآخذ التيار (البرايز) لتشغيل أي جهاز من الأجهزة السابقة. ويراعى عند إنشاء المباني تركيب خط رئيس من خارج المبنى إلى داخله، على أن يوزع هذا الخط الرئيس إلى جميع الوحدات السكنية في جميع الأدوار.</p>`,ref:'ص 63'},
    {tip:String.raw`<p>القسم (أ) ينتهي عند <b>مصباح</b> يشغّله مفتاح. القسم (ب) ينتهي عند <b>مأخذ تيار</b> يُوصل فيه الجهاز. وكلاهما يتغذى في النهاية من <b>الخط الرئيس</b> الذي يدخل المبنى ويتوزع على الأدوار.</p>`,title:'قسمان ومصدر واحد'},
    {title:'مختبر مصغّر: إلى أي قسم ينتمي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر القسم المناسب لكل حمل، بحسب تقسيم الكتاب.',cats:['أ- الإنارة','ب- تشغيل الأحمال الأخرى'],items:[
 ['مصابيح غرفة الجلوس.',0,'المصابيح من القسم (أ): لغرض الإنارة.'],
 ['سخان المياه في دورة المياه.',1,'«أجهزة تسخين المياه» مذكورة في القسم (ب).'],
 ['جهاز التكييف.',1,'«التبريد والتكييف» من القسم (ب)، ويحتاج توصيلاً خاصاً لمأخذ التيار.'],
 ['الفرن الكهربائي.',1,'«الأفران الكهربائية» من القسم (ب).'],
 ['مصباح الممر.',0,'إنارة — القسم (أ).']]})}
   ]},

  {st:4,short:'خطوات المخطط',title:'٣-٣ خطوات رسم مخطط بيان التوصيلات الكهربائية',ref:'ص 64',
   q:'هل يمكنك أن تختار مقطع الكابل قبل أن تعرف مكان المقابس ولوحة التوزيع؟',
   art:U3ST.art('مسقط أفقي عليه مواضع المقابس والمفاتيح ولوحة التوزيع والدوائر الفرعية، مرقّمة بخطوات المخطط السبع','#E4EEDC',
    `<g data-tip="الخطوة ١: تجهيز رسم المسقط الأفقي للمبنى — هو الورقة التي سنرسم عليها كل شيء."><path d="M50 60H310V250H50Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="4"/><path d="M190 60V150M190 190V250M50 160H130M160 160H190" stroke="#2C4A40" stroke-width="3"/></g>`
    +`<g data-tip="الخطوة ٢: تحديد مواضع المقابس (إضاءة أو مأخذ التيار) والنوع والكمية — بناءً على الأجهزة المطلوبة وشدة الإضاءة ومساحة الغرف."><circle cx="110" cy="105" r="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M103 98L117 112M117 98L103 112" stroke="#2C4A40" stroke-width="1.8"/><path d="M240 250a10 10 0 0 1 20 0" fill="none" stroke="#2C4A40" stroke-width="2.4"/></g>`
    +`<g data-tip="الخطوة ٣: تحديد مواضع المفاتيح في أنسب الأماكن، وتُركَّب المفاتيح على مستوى واحد معاً."><circle cx="176" cy="172" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M179 169L190 158l4 4" fill="none" stroke="#2C4A40" stroke-width="2"/></g>`
    +`<g data-tip="الخطوة ٤: تحديد موضع لوحة التوزيع — بناءً على مواضع المقابس ومركز الأحمال ولوحات التوزيع الفرعية والزيادة المحسوبة للحمل."><rect x="280" y="88" width="22" height="34" fill="#9CC5D9" stroke="#2C4A40" stroke-width="2"/><path d="M280 122L302 88" stroke="#2C4A40" stroke-width="1.6"/></g>`
    +`<g data-tip="الخطوة ٦: تحديد عدد الدوائر الفرعية — حسب استخدام القوابس وعدد الغرف والسعة المسموح بها للدائرة الواحدة، ومن وجهة نظر الأمان."><path d="M280 105H140" stroke="#C8701E" stroke-width="2.6" fill="none"/><path d="M291 122V232H260" stroke="#4FB3A9" stroke-width="2.6" fill="none"/></g>`
    +`<g data-tip="الخطوة ٧: تحديد مساحة مقطع الكابل — يُختار الكابل بحيث يتحمل التيار المطلوب للحمل الذي يغذيه بأمان."><circle cx="90" cy="214" r="18" fill="#C8701E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="90" cy="214" r="9" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/></g>`
    +[[62,72,'1'],[124,92,'2'],[228,240,'5'],[168,190,'3'],[316,104,'4'],[214,98,'6'],[118,214,'7']].map(b=>`<circle cx="${b[0]}" cy="${b[1]}" r="10" fill="#2C4A40"/><text x="${b[0]}" y="${b[1]+4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">${b[2]}</text>`).join('')
    +U3ST.at(180,286,'سبع خطوات من المسقط إلى مقطع الكابل',13,1)),
   cap:'كل رقم في الرسم خطوة من خطوات المخطط؛ الخطوة ٥ (أماكن المقابس) عند المقبس السفلي.<br><b>مرّر المؤشر على العناصر (أو المسها في الجوال) لتقرأ الخطوة التي تخصها.</b>',
   side:[
    {predict:{q:'ما الخطوة الأخيرة في تجهيز مخطط بيان التوصيلات؟',opts:[
     ['تجهيز رسم المسقط الأفقي',false,'هذه الخطوة الأولى: لا يمكن أن نحدد أي موضع قبل وجود المسقط.'],
     ['تحديد مساحة مقطع الكابل',true,'الخطوة السابعة (ص 64): الكابل يُختار حسب التيار المطلوب للحمل، والحمل لا يُعرف قبل المواضع والدوائر.'],
     ['تحديد موضع لوحة التوزيع',false,'هذه الخطوة الرابعة، وتعتمد على مواضع المقابس ومركز الأحمال.']]}}
   ],
   body:[
    {book:String.raw`<p>يتم تجهيز مخطط بيان التوصيلات طبقاً للخطوات الآتية:</p><ol><li>تجهيز رسم المسقط الأفقي للمبنى.</li><li>تحديد مواضع المقابس (إضاءة أو مأخذ التيار) والنوع والكمية المطلوبة، ويمكن حساب مواضع المقابس بناء على أنواع الأجهزة الكهربائية المطلوبة، وشدة الإضاءة ومساحة الغرف.</li><li>تحديد مواضع المفاتيح: يتم تحديد مواضع المفاتيح على أساس دراسة أنسب الأماكن لموضع المفاتيح. كما يتم تركيب المفاتيح على مستوى واحد معاً.</li><li>تحديد موضع لوحة التوزيع: ويتم ذلك بناء على دراسة مواضع المقابس ومركز الأحمال ولوحات التوزيع الفرعية والزيادة المحسوبة للحمل.</li><li>تحديد أماكن المقابس: ويتم تحديدها بناء على دراسة المسافة إلى مسار التوزيع، وأية صعوبات في التثبيت والصيانة أو أية ظروف أخرى.</li><li>تحديد عدد الدوائر الفرعية: يتم تحديد عدد الدوائر الفرعية تبعاً لدراسة استخدام القوابس وعدد الغرف الموجودة بها قوابس، ومن وجهة النظر المناسبة والسعة المسموح بها للدائرة الفرعية الواحدة الموجودة في المواصفات القياسية الفنية للأجهزة الكهربائية، ومن وجهة النظر المتعلقة بالأمان.</li><li>تحديد مساحة مقطع الكابل: ويتم اختيار الكابل بحيث يتحمل التيار المطلوب للحمل الذي يغذيه بأمان.</li></ol>`,ref:'ص 64'},
    {watch:String.raw`<p>البندان ٢ و٥ متقاربان جداً («تحديد مواضع المقابس» و«تحديد أماكن المقابس»): الثاني يضيف أسباب اختيار المكان (المسافة إلى مسار التوزيع وصعوبات التثبيت والصيانة). والكتاب يستعمل «المقابس» و«القوابس» بمعنى واحد.</p>`,fix:true},
    {tip:String.raw`<p>اقرأ الخطوات على ثلاث مراحل:</p><ul><li><b>الورقة:</b> المسقط الأفقي (١).</li><li><b>المواضع:</b> المقابس والمفاتيح ولوحة التوزيع وأماكن المقابس النهائية (٢–٥).</li><li><b>الحساب:</b> عدد الدوائر الفرعية ثم مقطع الكابل (٦–٧) — لأن الكابل يُختار حسب حمل دائرته.</li></ul>`,title:'ثلاث مراحل'},
    {title:'مختبر مصغّر: رتّب الخطوات السبع',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي يذكره الكتاب (ص 64). إذا أخطأت ستعرف السبب.',steps:[
 ['تجهيز رسم المسقط الأفقي للمبنى','كل المواضع تُرسم على المسقط؛ فهو أولاً.'],
 ['تحديد مواضع المقابس والنوع والكمية','نحتاج أولاً أن نعرف ماذا سنشغّل وأين.'],
 ['تحديد مواضع المفاتيح','المفاتيح تتبع المقابس (الإضاءة) التي تشغّلها.'],
 ['تحديد موضع لوحة التوزيع','يعتمد على مواضع المقابس ومركز الأحمال، فيأتي بعدها.'],
 ['تحديد أماكن المقابس (المسافة إلى مسار التوزيع وصعوبات التثبيت)','يحتاج مسار التوزيع، أي بعد تحديد موضع اللوحة.'],
 ['تحديد عدد الدوائر الفرعية','يُحسب بعد معرفة المقابس والغرف واللوحة.'],
 ['تحديد مساحة مقطع الكابل','الكابل يُختار حسب التيار المطلوب لحمل دائرته، فهو آخر خطوة.']],done:'هذا ترتيب الكتاب للخطوات السبع.'})}
   ]},

  {st:5,short:'الرموز في الرسم',title:'٣-٤ الدوائر الكهربائية الخطية والتنفيذية للإنارة',ref:'ص 64',
   q:'هل يهمّ الرسام الكهربائي شكل المفتاح ولونه وحجمه حين يرسمه؟',
   art:U3ST.art('المصباح والمفتاح الحقيقيان يتحولان في الرسم إلى رمزين يبينان التوصيل فقط','#E8E2F2',
    `<g data-tip="المصباح كما تراه: له زجاج وقاعدة وحجم ولون. هذه التفاصيل لا تظهر في الرسم الكهربائي."><circle cx="86" cy="104" r="30" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><rect x="72" y="134" width="28" height="22" rx="3" fill="#B9C3BE" stroke="#2C4A40" stroke-width="2.2"/><path d="M76 142H96M76 149H96" stroke="#2C4A40" stroke-width="1.5"/></g>`
    +`<g data-tip="المفتاح كما تراه: لوحة على الجدار بزر. شكله وأبعاده لا تهمنا في الرسم."><rect x="58" y="190" width="56" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="74" y="206" width="24" height="38" rx="4" fill="#EDE3D2" stroke="#2C4A40" stroke-width="2"/><path d="M78 226H94" stroke="#2C4A40" stroke-width="2"/></g>`
    +`<path d="M134 120H200M134 224H200" stroke="#2C4A40" stroke-width="2.5"/><path d="M200 120l-10 -6v12zM200 224l-10 -6v12z" fill="#2C4A40"/>`
    +U3ST.fit(`<svg viewBox="0 0 30 30">${Lx.x(15,15)}</svg>`,[236,90,60,60],{hot:[[0,0,30,30,'رمز المصباح: علامة ⟦×⟧. يعطي مدلولاً واضحاً للجهاز من الناحية التوصيلية: له طرفان يوصل بينهما في الدائرة.']]})
    +U3ST.fit(`<svg viewBox="0 0 32 32">${Lx.sw1(9,25)}</svg>`,[236,194,60,60],{hot:[[0,0,32,32,'رمز المفتاح المفرد في الدائرة الخطية: دائرة صغيرة يخرج منها خط مائل ينتهي بشرطة قصيرة.']]})
    +U3ST.at(86,66,'الجهاز',13,1)+U3ST.at(266,66,'الرمز',13,1)+U3ST.at(180,292,'الرمز يبين التوصيل، لا الشكل ولا الأبعاد',13,1)),
   cap:'في الرسم الكهربائي نهتم بكيف يُوصل الجهاز في الدائرة، لا بشكله.<br><b>مرّر المؤشر على الجهازين والرمزين (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'رسمتَ مصباحاً في دائرة بعلامة ×. ماذا يعرف قارئ الرسم من هذا الرمز؟',opts:[
     ['حجم المصباح ولون زجاجه',false,'الرموز لا تتعرض للشكل وتفاصيل المكونات أو الأبعاد.'],
     ['أن هنا مصباحاً، وكيف يُوصل في الدائرة',true,'الرموز «تعطي مدلولاً واضحاً… من حيث خواصها من الناحية التوصيلية» (ص 64).'],
     ['طريقة تثبيت المصباح في السقف',false,'التكوين والفعل الميكانيكي ليسا مما تبينه الرموز.']]}}
   ],
   body:[
    {book:String.raw`<p>توجد الرموز والمصطلحات الكهربائية المستخدمة في رسم الدوائر الكهربائية في الوحدة الثانية، وهي تعطي مدلولاً واضحاً للآلات والأجهزة والمعدات والتركيبات الكهربائية من حيث خواصها من الناحية التوصيلية دون التعرض لشكلها وتفاصيل مكوناتها أو أبعادها أو التكوين والفعل الميكانيكي بها، بل يكون كل تفكيرنا ودراستنا من حيث توصيلها في الدائرة وكل ما يتعلق بها كهربائياً. وسوف نقوم بتعريف كلٍ من الدائرة الخطية والدائرة التنفيذية على النحو التالي:</p>`,ref:'ص 64'},
    {watch:String.raw`<p>يحيل النص إلى «الملحق» لرموز الرسم، ولا يوجد ملحق في الحقيبة؛ الرموز في الوحدة الثانية (ص 46–60)، فكتبناها كذلك.</p>`,fix:true},
    {tip:String.raw`<p>الرمز يجيب عن سؤال واحد: <b>ما هذا العنصر، وأين يُوصل؟</b> أما «كم حجمه؟ ما لونه؟ كيف يُثبَّت؟» فليست من عمل الرمز. لذلك يرسم كل رسامي الكهرباء المصباح بالعلامة نفسها مهما اختلف شكله.</p>`,title:'سؤال الرمز'},
    {title:'تحقق سريع: ماذا يبين الرمز؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب.',items:[
 ['رمز المفتاح في الدائرة يبين أبعاده الحقيقية.',false,'الرموز لا تتعرض لشكل الجهاز وأبعاده.'],
 ['الرمز يعطي مدلولاً واضحاً للجهاز من الناحية التوصيلية.',true,'هذا نص الكتاب (ص 64).'],
 ['الفعل الميكانيكي داخل المفتاح يُرسم في الرمز بالتفصيل.',false,'الرموز لا تتعرض «للتكوين والفعل الميكانيكي».'],
 ['دراستنا للرموز من حيث توصيلها في الدائرة وكل ما يتعلق بها كهربائياً.',true,'«بل يكون كل تفكيرنا ودراستنا من حيث توصيلها في الدائرة».']]})}
   ]},

  {st:6,short:'الدائرة الخطية',title:'٣-٤-١ الدائرة الكهربائية الخطية',ref:'ص 65',
   q:'كيف ترسم دائرة فيها سلكان بخط واحد فقط؟',
   art:U3ST.art('الدائرة الخطية (3-1) أ: مصدر وعلبة تفريع ومصباح ومفتاح مفرد، وعلى كل خط شرطتان','#DDEFE6',
    U3ST.fit(U3ST.lin(LIN.f31),[30,40,300,250],{vb:[0,0,240,232],
     extra:tA(76,44,'المصدر','end',13)+tA(186,152,'مصباح','middle',12)+tA(150,206,'مفتاح مفرد','start',12)+tA(78,128,'علبة تفريع','end',12),
     hot:[[80,26,60,28,'المصدر / لوحة التوزيع: مستطيل يقطعه قطر مائل. منه تبدأ الدائرة، وفوقه جهدها ⟦220⟧ فولت.'],[98,75,24,22,'شرطتان مائلتان على الخط = سلكان في هذا المسار.'],[100,114,20,20,'علبة التفريع: دائرة صغيرة مفرغة. فيها تتفرع الأسلاك إلى المصباح والمفتاح.'],[134,114,24,20,'شرطتان = سلكان بين علبة التفريع والمصباح.'],[172,110,28,28,'المصباح: علامة ⟦×⟧ في نهاية الخط.'],[98,152,24,22,'شرطتان = سلكان بين علبة التفريع والمفتاح.'],[100,180,34,32,'المفتاح المفرد: دائرة صغيرة يخرج منها خط مائل بعلم.']]})),
   cap:'الشكل <span class="ltr">(3-1)</span> أ — الدائرة الخطية لمصباح بمفتاح مفرد.<br><b>مرّر المؤشر على الرموز والشُّرَط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة الخطية رُسم خط واحد بين علبة التفريع والمصباح وعليه شرطتان. كم سلكاً سيركّب الفني بينهما؟',opts:[
     ['سلكاً واحداً، لأن الخط واحد',false,'في الخطية الخط الواحد يمثل المسار كله مهما كان عدد أسلاكه.'],
     ['سلكين، لأن الشرطتين تدلان على عدد الأسلاك',true,'عدد الشُّرَط = عدد الأسلاك في المسار؛ والتنفيذية (3-1) ب فيها سلكان بين العلبة والمصباح.'],
     ['أربعة أسلاك: سلكان لكل شرطة',false,'كل شرطة تمثل سلكاً واحداً.']]}}
   ],
   body:[
    {book:String.raw`<p>هي الدائرة التي تحتوي على المفهوم العام للدائرة الكهربائية ومكوناتها دون التعرض للتفاصيل.</p>`,ref:'ص 65'},
    {tip:String.raw`<ul><li>كل مسار يُرسم <b>بخط واحد</b> مهما كان عدد أسلاكه.</li><li>عدد الأسلاك يُبيَّن <b>بشُرَط مائلة صغيرة</b> تقطع الخط: شرطتان = سلكان، ثلاث = ثلاثة؛ أو شرطة واحدة بجانبها رقم.</li><li>المصدر (لوحة التوزيع) مستطيل يقطعه قطر مائل، وعلبة التفريع دائرة صغيرة مفرغة.</li></ul><p>هي «خريطة» سريعة: تقول ماذا في الدائرة وأين، ولا تقول أين يذهب كل سلك.</p>`,title:'كيف تقرأ الدائرة الخطية؟'},
    {title:'مختبر مصغّر: خطية أم تنفيذية؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر نوع الدائرة التي ينطبق عليها.',cats:['الدائرة الخطية','الدائرة التنفيذية'],items:[
 ['يُرسم المسار بخط واحد، وعدد أسلاكه بالشُّرَط.',0,'هذا أسلوب الخطية: المفهوم العام دون التفاصيل.'],
 ['يُرسم كل سلك على حدة من المصدر إلى طرف العنصر.',1,'التنفيذية «توضح جميع التوصيلات الخاصة في الدائرة».'],
 ['تعطي المفهوم العام للدائرة ومكوناتها.',0,'هذا نص تعريف الخطية (ص 65).'],
 ['تبين أي سلك يصل إلى الطرف العلوي للمفتاح.',1,'هذا تفصيل لا يظهر إلا في التنفيذية.'],
 ['يظهر فيها الخطان L1 وL2 منفصلين.',1,'في الخطية يُرسم المصدر مستطيلاً واحداً؛ الخطوط المنفصلة من التنفيذية.']]})}
   ]},

  {st:7,short:'الدائرة التنفيذية',title:'٣-٤-٢ الدائرة الكهربائية التنفيذية',ref:'ص 65',
   q:'الفني الذي سيمدّ الأسلاك فعلاً… أي الرسمين يحتاج؟',
   art:U3ST.art('الدائرة التنفيذية (3-1) ب: الخطان L1 وL2 وعلبة التفريع وعلبة المصباح وعلبة المفتاح وثلاثة أسلاك','#DDEFE6',
    U3ST.fit(exec(F.f31,IDLE()),[14,40,332,250],{vb:[20,10,350,275],
     hot:[[45,23,320,14,'الخط ⟦L1⟧: أحد خطي التغذية.'],[45,48,320,14,'الخط ⟦L2⟧: خط التغذية الثاني.'],[150,88,85,62,'علبة التفريع: مستطيل بخط «شرطة-نقطة». تمر فيها الأسلاك وتتفرع.'],[262,88,60,62,'علبة المصباح: فيها المصباح ⟦×⟧ بين طرفين صغيرين مفرغين.'],[140,192,100,76,'علبة المفتاح: فيها المفتاح المفرد بطرفيه ونصله المفتوح.'],[139,221,22,24,'رمز التشغيل اليدوي ⟦T⟧: يدل على أن المفتاح يُشغَّل باليد، والخط المتقطع يربطه بالنصل.'],[168,23,14,14,'نقطة توصيل على ⟦L1⟧: منها يأخذ السلك الأول تغذيته.']]})),
   cap:'الشكل <span class="ltr">(3-1)</span> ب — الدائرة التنفيذية للدائرة نفسها.<br><b>مرّر المؤشر على الخطوط والعلب ورمز T (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة التنفيذية، كيف تُرسم علبة التفريع وعلب المفاتيح والمصابيح؟',opts:[
     ['مستطيلات بخط «شرطة-نقطة»',true,'هذا اصطلاح رسوم الوحدة: العلب مستطيلات بخط شرطة-نقطة، والأسلاك تدخلها وتخرج منها.'],
     ['دوائر صغيرة مفرغة',false,'الدائرة الصغيرة المفرغة هي علبة التفريع في الدائرة الخطية، أو طرف عنصر في التنفيذية.'],
     ['لا تُرسم العلب أبداً',false,'في التنفيذية تُرسم العلب ليعرف الفني أين تلتقي الأسلاك.']]}}
   ],
   body:[
    {book:String.raw`<p>هي الدائرة التي توضح جميع التوصيلات الخاصة في الدائرة مع المصدر والمفاتيح ومصابيح الإنارة.</p>`,ref:'ص 65'},
    {tip:String.raw`<ul><li>يُرسم <b>كل سلك على حدة</b>، من نقطة على خط التغذية إلى طرف العنصر.</li><li>العلب مستطيلات بخط «شرطة-نقطة»، ونقاط التوصيل على الخطوط نقاط أو دوائر صغيرة، وأطراف العناصر دوائر صغيرة مفرغة.</li><li>الخطية تقول «ماذا وأين»، والتنفيذية تقول «كيف يوصل كل سلك» — وهي التي ينفّذ منها الفني.</li></ul>`,title:'كيف تقرأ الدائرة التنفيذية؟'},
    {title:'مختبر مصغّر: اعثر عليه في الرسم',widget:(el,B)=>U3ST.find(el,B,{intro:'اقرأ السؤال ثم اضغط على الجزء المطلوب في الدائرة التنفيذية (3-1) ب.',svg:exec(F.f31,IDLE()),mw:380,
     reg:{l1:[45,23,320,14,'الخط L1'],l2:[45,48,320,14,'الخط L2'],jb:[150,88,85,62,'علبة التفريع'],lb:[262,88,60,62,'علبة المصباح'],sb:[140,192,100,76,'علبة المفتاح'],tt:[139,221,22,24,'رمز التشغيل اليدوي T'],tap:[168,23,14,14,'نقطة التوصيل على L1'],tap2:[208,48,14,14,'نقطة التوصيل على L2']},
     asks:[['jb','اضغط على <b>علبة التفريع</b>.','مستطيل شرطة-نقطة في الوسط تحت الخطين؛ تمر فيه الأسلاك الثلاثة.'],
      ['sb','اضغط على <b>علبة المفتاح</b>.','في الأسفل تحت علبة التفريع، وفيها طرفا المفتاح ونصله.'],
      ['tt','اضغط على <b>رمز التشغيل اليدوي «T»</b>.','على يسار المفتاح، ويتصل بالنصل بخط متقطع.'],
      ['tap','اضغط على <b>النقطة التي يأخذ منها السلك الأول تغذيته من L1</b>.','من هذه النقطة ينزل السلك مستقيماً إلى الطرف العلوي للمفتاح.'],
      ['l2','اضغط على <b>الخط L2</b>.','الخط الثاني من الأعلى؛ ومنه سلك ينزل إلى الطرف العلوي للمصباح.']]})}
   ]},

  {st:8,short:'المثال ١: مصباح بمفتاح',title:'أمثلة على رسم الدوائر الخطية والتنفيذية للإنارة — ١. مصباح بمفتاح مفرد',ref:'ص 65–66',
   q:'أغلقتَ المفتاح: من أين يخرج التيار، وبأي ترتيب يمر حتى يرجع؟',
   art:U3ST.art('الدائرة التنفيذية (3-1) ب والمفتاح مغلق: يمر التيار من L1 إلى المفتاح ثم المصباح ثم L2','#F3E3C8',
    U3ST.fit(U3ST.litExec(F.f31,{sw:{S1:1}}),[14,40,332,250],{vb:[20,10,350,275],
     hot:[[168,36,14,176,'السلك الأول: من ⟦L1⟧ ينزل مستقيماً ويمر في علبة التفريع (بلا توصيل) إلى الطرف العلوي للمفتاح.'],[160,206,30,46,'المفتاح ⟦S1⟧ مغلق: يصل طرفه العلوي بطرفه السفلي.'],[188,132,108,120,'السلك الثاني: من الطرف السفلي للمفتاح يصعد إلى علبة التفريع ثم إلى أحد طرفي المصباح.'],[278,99,28,40,'المصباح ⟦E1⟧ مضيء: التيار يمر فيه.'],[208,58,90,50,'السلك الثالث: من ⟦L2⟧ إلى علبة التفريع ثم إلى الطرف الآخر للمصباح — طريق رجوع التيار.']]})),
   cap:'الشكل <span class="ltr">(3-1)</span> ب والمفتاح مغلق: الخط المتحرك هو مسار التيار.<br><b>مرّر المؤشر على الأسلاك الثلاثة والمفتاح (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'في الشكل (3-1) ب، المفتاح يقطع أي خط؟',opts:[
     ['الخط L2',false,'L2 ينزل إلى المصباح مباشرة عبر علبة التفريع، دون أن يمر بالمفتاح.'],
     ['الخط L1',true,'السلك من L1 ينزل إلى الطرف العلوي للمفتاح؛ فالمفتاح على L1 فقط.'],
     ['الخطين معاً',false,'المفتاح المفرد له طرفان فقط، ويقطع خطاً واحداً.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أمثلة على رسم الدوائر الخطية والتنفيذية للإنارة:</b></p><p>١. الشكل (3-1) يبين الدائرة الخطية والتنفيذية لتشغيل مصباح كهربائي بمفتاح مفرد 220 فولت.</p>`,ref:'ص 65'},
    {tip:String.raw`<p>اقرأ الشكل <span class="ltr">(3-1)</span> ب سلكاً سلكاً:</p><ol><li>من <b>L1</b> ينزل سلك مستقيم يمر في علبة التفريع (بلا توصيل) إلى الطرف العلوي للمفتاح.</li><li>من الطرف السفلي للمفتاح يصعد سلك إلى علبة التفريع ثم إلى أحد طرفي المصباح.</li><li>من <b>L2</b> ينزل سلك إلى علبة التفريع ثم إلى الطرف الآخر للمصباح.</li></ol><p>أي: <b>L1 ← المفتاح ← المصباح ← L2</b>. وبين كل علبتين سلكان، وهذا ما تقوله الشرطتان على كل خط في الخطية <span class="ltr">(3-1)</span> أ.</p>`,title:'ثلاثة أسلاك فقط'},
    {title:'مختبر مصغّر: شغّل المفتاح وتتبّع التيار',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f31,intro:'اضغط على المفتاح في الرسم أو على الزر تحته. البرتقالي الثابت = موصول بالطور بلا تيار، والمتحرك = يمر تيار.',
     predict:{q:'المفتاح مفتوح. أي جزء من الأسلاك يبقى موصولاً بالطور (عليه جهد)؟',opts:[
      ['لا شيء: كل الأسلاك بلا جهد',false,'السلك من L1 حتى الطرف العلوي للمفتاح يبقى متصلاً بالطور حتى لو كان المفتاح مفتوحاً.'],
      ['السلك من L1 حتى الطرف العلوي للمفتاح',true,'المفتاح يقطع الدائرة بعده؛ ما قبله يبقى عليه جهد الطور.'],
      ['كل الأسلاك حتى المصباح',false,'ما بعد المفتاح المفتوح لا يتصل بـ L1.']]}})},
    {title:'مختبر مصغّر: رتّب مسار التيار',widget:(el,B)=>DCML.order(el,B,{intro:'المفتاح مغلق. اضغط أجزاء المسار بالترتيب الذي يمر به التيار، من L1 حتى يرجع إلى L2.',steps:[
 ['نقطة التوصيل على L1','التيار يبدأ من خط التغذية L1.'],
 ['السلك النازل إلى الطرف العلوي للمفتاح','بعد L1 مباشرة يأتي السلك إلى المفتاح، لا إلى المصباح.'],
 ['المفتاح S1 (مغلق)','المفتاح بين سلك L1 وسلك المصباح.'],
 ['السلك الصاعد من المفتاح إلى علبة التفريع ثم إلى المصباح','بعد المفتاح يصعد السلك إلى العلبة ثم إلى المصباح.'],
 ['المصباح E1','الحمل في نهاية سلك المفتاح.'],
 ['السلك من المصباح إلى L2','طريق الرجوع: من الطرف الآخر للمصباح إلى L2.']],done:'L1 ← المفتاح ← المصباح ← L2.'})}
   ]},

  {recap:[
   'مخطط بيان التوصيلات رسم تخطيطي واحد يجمع أحمال الإضاءة والقدرة وطريقة إنشاء لوحة التوزيع وشبكة الأسلاك (ص 63).',
   'التوصيلات المنزلية قسمان: لغرض الإنارة، ولتشغيل الأحمال الأخرى عبر مآخذ التيار؛ والخط الرئيس يوزَّع على كل الوحدات (ص 63).',
   'يُجهَّز المخطط في سبع خطوات: من المسقط الأفقي حتى مساحة مقطع الكابل (ص 64).',
   'الدائرة الخطية: المفهوم العام بخط واحد وشُرَط لعدد الأسلاك؛ والتنفيذية: كل سلك على حدة (ص 65).',
   'في الشكل (3-1): L1 ← المفتاح ← المصباح ← L2، والمفتاح على L1 فقط (ص 65–66).']}
],
 theory:[
  {h:'الوحدة الثالثة: الدوائر الخطية والتنفيذية للتوصيلات المنزلية',ref:'ص 61–62',html:'<p><b>الهدف العام للوحدة:</b> القدرة على رسم الدوائر الخطية والتنفيذية للتوصيلات المنزلية.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من قراءة ورسم توصيلات الإضاءة والتجهيزات المنزلية.</li><li>أن يتمكن المتدرب من قراءة ورسم لوحات التوزيع الكهربائية المنزلية.</li></ol>'},
  {h:'٣-١ المقدمة',ref:'ص 63',html:'<p>نظراً لأن توصيل الأسلاك الخاطئ داخل المباني قد يسبب حدوث حريق أو إصابات للإنسان، فقد وضعت تعليمات عديدة لطريقة التركيب الكهربائية بواسطة الجهات المعنية طبقاً للمواصفات القياسية الفنية للأجهزة الكهربائية، وأيضاً وضعت الشروط التفصيلية لتركيب الأسلاك داخل المباني. وفي حالة إقامة منشآت جديدة، يتم عمل مخطط بيان التوصيلات، حيث يسجل بهذا الرسم التخطيطي أحمال الإضاءة الكهربائية والقدرة وطريقة إنشاء لوحة التوزيع، ويوضع رسم لشبكة تركيب الأسلاك داخل المبنى. ويتم إدخال ما سبق ذكره في رسم تخطيطي واحد.</p>'},
  {h:'٣-٢ توصيلات الإضاءة والتجهيزات المنزلية',ref:'ص 63',html:'<p>يمكن تقسيم التوصيلات الكهربائية داخل المنازل إلى قسمين:</p><ol type="a"><li>أ- لغرض الإنارة.</li><li>ب- لأغراض التشغيل والإدارة للأحمال الأخرى مثل أجهزة التبريد والتكييف والتدفئة والأفران الكهربائية والغسالات وأجهزة التنظيف وإعداد الطعام والحياكة وأجهزة تسخين المياه وخلافه.</li></ol><p>ولذلك عند إعداد التركيبات داخل المنازل يؤخذ في الاعتبار عمل توصيلات خاصة لمآخذ التيار (البرايز) لتشغيل أي جهاز من الأجهزة السابقة. ويراعى عند إنشاء المباني تركيب خط رئيس من خارج المبنى إلى داخله، على أن يوزع هذا الخط الرئيس إلى جميع الوحدات السكنية في جميع الأدوار.</p>'},
  {h:'٣-٣ خطوات رسم مخطط بيان التوصيلات الكهربائية',ref:'ص 64',html:'<p>يتم تجهيز مخطط بيان التوصيلات طبقاً للخطوات الآتية:</p><ol><li>تجهيز رسم المسقط الأفقي للمبنى.</li><li>تحديد مواضع المقابس (إضاءة أو مأخذ التيار) والنوع والكمية المطلوبة، ويمكن حساب مواضع المقابس بناء على أنواع الأجهزة الكهربائية المطلوبة، وشدة الإضاءة ومساحة الغرف.</li><li>تحديد مواضع المفاتيح: يتم تحديد مواضع المفاتيح على أساس دراسة أنسب الأماكن لموضع المفاتيح. كما يتم تركيب المفاتيح على مستوى واحد معاً.</li><li>تحديد موضع لوحة التوزيع: ويتم ذلك بناء على دراسة مواضع المقابس ومركز الأحمال ولوحات التوزيع الفرعية والزيادة المحسوبة للحمل.</li><li>تحديد أماكن المقابس: ويتم تحديدها بناء على دراسة المسافة إلى مسار التوزيع، وأية صعوبات في التثبيت والصيانة أو أية ظروف أخرى.</li><li>تحديد عدد الدوائر الفرعية: يتم تحديد عدد الدوائر الفرعية تبعاً لدراسة استخدام القوابس وعدد الغرف الموجودة بها قوابس، ومن وجهة النظر المناسبة والسعة المسموح بها للدائرة الفرعية الواحدة الموجودة في المواصفات القياسية الفنية للأجهزة الكهربائية، ومن وجهة النظر المتعلقة بالأمان.</li><li>تحديد مساحة مقطع الكابل: ويتم اختيار الكابل بحيث يتحمل التيار المطلوب للحمل الذي يغذيه بأمان.</li></ol>'},
  {err:'البندان ٢ و٥ متقاربان جداً («تحديد مواضع المقابس» و«تحديد أماكن المقابس»): الثاني يضيف أسباب اختيار المكان (المسافة إلى مسار التوزيع وصعوبات التثبيت والصيانة). والكتاب يستعمل «المقابس» و«القوابس» بمعنى واحد.'},
  {h:'نشاط: رتّب الخطوات',ref:'ص 64',widget:el=>orderWidget(el,['تجهيز رسم المسقط الأفقي للمبنى','تحديد مواضع المقابس والنوع والكمية','تحديد مواضع المفاتيح','تحديد موضع لوحة التوزيع','تحديد أماكن المقابس','تحديد عدد الدوائر الفرعية','تحديد مساحة مقطع الكابل'],'اضغط الخطوات بالترتيب الصحيح، من الأولى إلى السابعة.')},
  {h:'٣-٤ الدوائر الكهربائية الخطية والتنفيذية للإنارة',ref:'ص 64',html:'<p>توجد الرموز والمصطلحات الكهربائية المستخدمة في رسم الدوائر الكهربائية في الوحدة الثانية، وهي تعطي مدلولاً واضحاً للآلات والأجهزة والمعدات والتركيبات الكهربائية من حيث خواصها من الناحية التوصيلية دون التعرض لشكلها وتفاصيل مكوناتها أو أبعادها أو التكوين والفعل الميكانيكي بها، بل يكون كل تفكيرنا ودراستنا من حيث توصيلها في الدائرة وكل ما يتعلق بها كهربائياً. وسوف نقوم بتعريف كلٍ من الدائرة الخطية والدائرة التنفيذية على النحو التالي:</p>'},
  {err:'يحيل النص إلى «الملحق» لرموز الرسم، ولا يوجد ملحق في الحقيبة؛ الرموز في الوحدة الثانية (ص 46–60)، فكتبناها كذلك.'},
  {h:'٣-٤-١ الدائرة الكهربائية الخطية',ref:'ص 65',html:'<p>هي الدائرة التي تحتوي على المفهوم العام للدائرة الكهربائية ومكوناتها دون التعرض للتفاصيل.</p>'},
  {h:'٣-٤-٢ الدائرة الكهربائية التنفيذية',ref:'ص 65',html:'<p>هي الدائرة التي توضح جميع التوصيلات الخاصة في الدائرة مع المصدر والمفاتيح ومصابيح الإنارة.</p>'},
  {note:ADD+'كيف تقرأ رسوم هذه الوحدة؟<ul><li><b>في الدائرة الخطية</b> يُرسم كل مسار بخط واحد مهما كان عدد أسلاكه، ويُبيَّن عدد الأسلاك بشُرَط مائلة صغيرة تقطع الخط: شرطتان = سلكان، ثلاث = ثلاثة؛ أو شرطة واحدة بجانبها رقم. المصدر (لوحة التوزيع) مستطيل يقطعه قطر مائل، وعلبة التفريع دائرة صغيرة مفرغة.</li><li><b>في الدائرة التنفيذية</b> يُرسم كل سلك على حدة. العلب مستطيلات بخط «شرطة-نقطة»، ونقاط التوصيل على الخطوط نقاط أو دوائر صغيرة، وأطراف العناصر دوائر صغيرة مفرغة.</li></ul>'},
  {fig:'(بلا رقم)',caption:'رموز الدائرة الخطية المستعملة في رسوم هذه الوحدة، مجمّعة من أشكالها (توضيح للمتدرب — ليس من الكتاب).',ref:'ص 65–80',draw:()=>`<div class="svgbox d3" style="max-width:560px;margin-inline:auto">${legendSvg()}</div>`},
  {h:'أمثلة على رسم الدوائر الخطية والتنفيذية للإنارة',ref:'ص 65',html:'<p>١. الشكل (3-1) يبين الدائرة الخطية والتنفيذية لتشغيل مصباح كهربائي بمفتاح مفرد 220 فولت.</p>'},
  {fig:'(3-1) أ',ref:'ص 65',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f31,220)},
  {fig:'(3-1) ب',ref:'ص 65–66',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f31)},
  {note:ADD+'اقرأ الشكل (3-1) ب سلكاً سلكاً: من <b>L1</b> ينزل سلك مستقيم يمر في علبة التفريع (بلا توصيل) إلى الطرف العلوي للمفتاح؛ ومن الطرف السفلي للمفتاح يصعد سلك إلى علبة التفريع ثم إلى أحد طرفي المصباح؛ ومن <b>L2</b> ينزل سلك إلى علبة التفريع ثم إلى الطرف الآخر للمصباح. أي: <b>L1 ← المفتاح ← المصباح ← L2</b>، والمفتاح على <b>L1</b> فقط. وبين كل علبتين سلكان، وهذا ما تقوله الشرطتان على كل خط في الدائرة الخطية (3-1) أ.'},
  {err:'كُتب في السطر «مفتاح مفرد فولت٢٢٠» والمقصود «بمفتاح مفرد 220 فولت»، فكتبناه كذلك. وترقيم المقدمة مطبوع ملتصقاً «٣- ١١المقدمة» والمقصود «٣-١ المقدمة».'}
 ],
 lab:(el)=>board(el,[BD.f31]),
 examples:[drawEx({title:'رسم الدائرة التنفيذية (3-1) ب من الدائرة الخطية',ref:'ص 65–66',
  q:'<p>حوّل الدائرة الخطية (3-1) أ (مصباح بمفتاح مفرد 220 فولت) إلى الدائرة التنفيذية، سلكاً سلكاً.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب؛ الرسم النهائي هو الشكل (3-1) ب.</p>',
  pre:[linStep('نقرأ الدائرة الخطية: مصدر، علبة تفريع، مصباح، ومفتاح مفرد. على كل خط شرطتان، أي سلكان بين كل عنصرين.',LIN.f31,220)],
  sp:F.f31,steps:['نرسم خطي التغذية <b>L1</b> و<b>L2</b> أفقيين في أعلى الرسم.',
   'نرسم علبة التفريع (مستطيل بخط شرطة-نقطة)، وتحتها علبة المفتاح وفيها المفتاح المفرد: طرفان ونصل مفتوح ورمز التشغيل اليدوي «T».',
   'نرسم علبة المصباح على يمين علبة التفريع، وفيها المصباح (×) بين طرفين.',
   'السلك الأول: من نقطة على <b>L1</b> ينزل مستقيماً عبر علبة التفريع (بلا توصيل) إلى الطرف العلوي للمفتاح.',
   'السلك الثاني: من الطرف السفلي للمفتاح يصعد إلى علبة التفريع ثم ينعطف إلى الطرف السفلي للمصباح.',
   'السلك الثالث: من نقطة على <b>L2</b> ينزل إلى علبة التفريع ثم إلى الطرف العلوي للمصباح. اكتمل الرسم: L1 ← المفتاح ← المصباح ← L2.']})],
 quiz:[
  {q:'ما الدائرة الخطية؟',o:['الدائرة التي تحتوي على المفهوم العام للدائرة الكهربائية ومكوناتها دون التعرض للتفاصيل','الدائرة التي توضح جميع التوصيلات الخاصة مع المصدر والمفاتيح والمصابيح','رسم المسقط الأفقي للمبنى','لوحة التوزيع وحدها'],c:0,e:'هذا تعريف الكتاب (ص 65). أما توضيح كل التوصيلات فهو الدائرة التنفيذية.'},
  {q:'ما الدائرة التنفيذية؟',o:['دائرة بخط واحد لكل مسار','الدائرة التي توضح جميع التوصيلات الخاصة في الدائرة مع المصدر والمفاتيح ومصابيح الإنارة','جدول الأحمال','رمز علبة التفريع'],c:1,e:'في التنفيذية يُرسم كل سلك على حدة (ص 65).'},
  {q:'ما الخطوة الأولى في تجهيز مخطط بيان التوصيلات؟',o:['تحديد مساحة مقطع الكابل','تحديد موضع لوحة التوزيع','تجهيز رسم المسقط الأفقي للمبنى','تحديد عدد الدوائر الفرعية'],c:2,e:'الخطوات السبع تبدأ بالمسقط الأفقي وتنتهي بمقطع الكابل (ص 64).'},
  {q:'على أي أساس يُختار مقطع الكابل؟',o:['بحيث يتحمل التيار المطلوب للحمل الذي يغذيه بأمان','حسب لون العزل','حسب طول الغرفة فقط','حسب عدد المفاتيح'],c:0,e:'نص الخطوة السابعة (ص 64).'},
  {q:'شرطتان مائلتان على خط في الدائرة الخطية (3-1) أ تعنيان:',o:['مصباحين','سلكين في هذا المسار','مفتاحين','مصهرين'],c:1,e:'عدد الشُّرَط = عدد الأسلاك في المسار؛ والتنفيذية (3-1) ب فيها سلكان بين كل علبتين.'},
  {q:'في الشكل (3-1) ب يقع المفتاح على:',o:['الخط L1','الخط L2','بين المصباح وL2','لا يتصل بأي خط'],c:0,e:'السلك من L1 ينزل إلى المفتاح، والمصباح يتصل بـ L2 مباشرة.'}]
});

/* ============================== LESSON 2 ============================== */
const TICKQ=[
 {q:'في الشكل (3-2) أ، كم سلكاً على الخط بين علبة التفريع والمفتاح المزدوج؟',o:['سلكان','ثلاثة','أربعة'],c:1,e:'ثلاث شُرَط: سلك التغذية المشترك من L1، وخرج الذراع الأولى، وخرج الذراع الثانية — وهي الأسلاك الثلاثة الصاعدة من المفتاح في (3-2) ب.'},
 {q:'في الشكل (3-3) أ، كم سلكاً بين علبة التفريع وكل مصباح؟',o:['سلكان','ثلاثة','أربعة'],c:1,e:'الخط المُشغَّل وN وسلك الحماية PE — كما في (3-3) ب.'},
 {q:'في الشكل (3-2) أ، كم سلكاً بين علبة التفريع وكل مصباح؟',o:['سلك واحد','سلكان','ثلاثة'],c:1,e:'خرج الذراع والخط L2.'}];
B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'65–67',
 title:'مصباح بمفتاح مفرد، ومفتاح مزدوج، ومصباحان على التوازي',
 summary:'ثلاث دوائر إنارة أساسية بخطيتها وتنفيذيتها: مصباح بمفتاح مفرد (3-1)، ومصباحان بمفتاح مزدوج (3-2)، ومصباحان على التوازي بمفتاح مفرد مع موصل الحماية (3-3).',
 stations:[
  {intro:true},

  {st:1,short:'مصباح بمفتاح مفرد',title:'١. مصباح بمفتاح مفرد',ref:'ص 65–66',
   q:'الشرطتان على الخط في الخطية… أين تجدهما في التنفيذية؟',
   art:U3ST.art('الدائرة الخطية (3-1) أ والمصباح مضيء، وعلى كل خط شرطتان تعنيان سلكين','#DDEFE6',
    U3ST.fit(LIN.f31(k=>k==='E1'),[30,36,300,256],{vb:[0,0,240,232],
     extra:tA(76,44,'المصدر','end',13)+tA(150,206,'مفتاح مفرد','start',12)+tA(186,152,'مصباح','middle',12),
     hot:[[98,75,24,22,'شرطتان بين المصدر وعلبة التفريع: سلكا التغذية ⟦L1⟧ و⟦L2⟧.'],[134,114,24,20,'شرطتان بين العلبة والمصباح: سلك المفتاح الصاعد إلى المصباح، وسلك ⟦L2⟧.'],[98,152,24,22,'شرطتان بين العلبة والمفتاح: سلك ⟦L1⟧ النازل إلى المفتاح، والسلك الراجع من المفتاح.'],[100,114,20,20,'علبة التفريع: تلتقي فيها المسارات الثلاثة.'],[100,180,34,32,'المفتاح المفرد: يقطع ⟦L1⟧ فقط.']]})),
   cap:'الشكل <span class="ltr">(3-1)</span> أ — ثلاثة خطوط، على كل منها شرطتان.<br><b>مرّر المؤشر على الشُّرَط (أو المسها في الجوال) لتعرف أي سلكين تمثل.</b>',
   side:[
    {predict:{q:'في الشكل (3-1) ثلاثة خطوط على كل منها شرطتان. كم سلكاً مختلفاً في الدائرة التنفيذية كلها؟',opts:[
     ['ستة أسلاك: سلكان لكل خط',false,'السلك الواحد قد يمر في أكثر من خط؛ سلك L1 مثلاً يمر من المصدر عبر العلبة إلى المفتاح.'],
     ['ثلاثة أسلاك',true,'سلك من L1 إلى المفتاح، وسلك من المفتاح إلى المصباح، وسلك من L2 إلى المصباح — كل منها يمر في خطين من الخطية.'],
     ['سلكان فقط',false,'سلكان لا يكفيان: نحتاج سلكاً قبل المفتاح وسلكاً بعده وسلك الرجوع.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-1) يبين الدائرة الخطية والتنفيذية لتشغيل مصباح كهربائي بمفتاح مفرد 220 فولت.</p>`,ref:'ص 65–66'},
    {tip:String.raw`<p>شرحنا هذه الدائرة في الدرس السابق. الجديد هنا: <b>اقرأ الشُّرَط</b>. كل خط في الخطية يمثل «طريقاً» بين علبتين، والشرطتان تقولان إن في هذا الطريق سلكين. والسلك الواحد قد يمر في طريقين: سلك <span class="ltr">L1</span> يدخل علبة التفريع من المصدر ويخرج منها إلى المفتاح.</p>`,title:'الشُّرَط = عدد الأسلاك في الطريق'},
    {title:'مختبر مصغّر: من الشُّرَط إلى الأسلاك',widget:(el,B)=>U3ST.ticks(el,B,{intro:'لكل خط في الخطية (3-1) أ اختر عدد الأسلاك، ثم انظر الأسلاك نفسها ملوّنة في التنفيذية.',sp:F.f31,lin:U3ST.lin(LIN.f31),linW:220,segs:[
 {t:'الخط من <b>المصدر</b> إلى <b>علبة التفريع</b>: كم سلكاً؟',n:2,w:[0,2],why:'سلك L1 (يكمل إلى المفتاح) وسلك L2 (يكمل إلى المصباح).'},
 {t:'الخط من <b>علبة التفريع</b> إلى <b>المصباح</b>: كم سلكاً؟',n:2,w:[1,2],why:'السلك الآتي من المفتاح، وسلك L2.'},
 {t:'الخط من <b>علبة التفريع</b> إلى <b>المفتاح</b>: كم سلكاً؟',n:2,w:[0,1],why:'سلك L1 النازل إلى الطرف العلوي، والسلك الصاعد من الطرف السفلي.'}]})}
   ]},

  {st:2,short:'مفتاح مزدوج',title:'٢. مصباحان بمفتاح مزدوج',ref:'ص 66',
   q:'مفتاح واحد في علبة واحدة… كيف يتحكم في مصباحين كلٌّ على حدة؟',
   art:U3ST.art('الدائرة الخطية (3-2) أ: مصدر وعلبة تفريع ومصباحان ومفتاح مزدوج عليه ثلاث شُرَط','#E8E2F2',
    U3ST.fit(U3ST.lin(LIN.f32),[24,40,312,250],{vb:[10,0,240,232],
     extra:tA(48,150,'مصباح ١','middle',12)+tA(212,150,'مصباح ٢','middle',12)+tA(152,214,'مفتاح مزدوج','start',12),
     hot:[[100,27,60,26,'المصدر / لوحة التوزيع ⟦220⟧ فولت.'],[120,114,20,20,'علبة التفريع.'],[36,112,24,24,'المصباح ١: يتحكم فيه الذراع الأول.'],[200,112,24,24,'المصباح ٢: يتحكم فيه الذراع الثاني.'],[80,114,24,20,'شرطتان: سلكان إلى المصباح ١.'],[156,114,24,20,'شرطتان: سلكان إلى المصباح ٢.'],[116,151,28,24,'ثلاث شُرَط = ثلاثة أسلاك: التغذية المشتركة من ⟦L1⟧، وخرج الذراع الأول، وخرج الذراع الثاني.'],[110,180,40,30,'رمز المفتاح المزدوج: دائرة صغيرة يخرج منها خطان مائلان بعلمين — ذراعان في علبة واحدة.']]})),
   cap:'الشكل <span class="ltr">(3-2)</span> أ — لاحظ الشُّرَط الثلاث على خط المفتاح.<br><b>مرّر المؤشر على الرموز والشُّرَط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا على خط المفتاح المزدوج ثلاث شُرَط لا شرطتان؟',opts:[
     ['لأن فيه موصل حماية',false,'لا يوجد موصل حماية في هذه الدائرة؛ خطا التغذية L1 وL2 فقط.'],
     ['خطأ في رسم الكتاب',false,'الشُّرَط الثلاث صحيحة هنا، والتنفيذية فيها ثلاثة أسلاك بين العلبة والمفتاح.'],
     ['لأن الأسلاك: تغذية مشتركة + خرج الذراع الأول + خرج الذراع الثاني',true,'ثلاثة أسلاك تصعد من المفتاح إلى علبة التفريع في (3-2) ب.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-2) يبين الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مزدوج.</p>`,ref:'ص 66'},
    {tip:String.raw`<p>المفتاح المزدوج <b>مفتاحان في علبة واحدة</b> لهما طرف تغذية مشترك. في <span class="ltr">(3-2)</span> ب: من <b>L1</b> سلك إلى الطرف المشترك؛ ومن خرج الذراع الأول سلك إلى المصباح ١، ومن خرج الذراع الثاني سلك إلى المصباح ٢؛ و<b>L2</b> ينزل إلى عقدة في علبة التفريع تغذي الطرف الآخر للمصباحين معاً.</p>`,title:'ذراعان وتغذية واحدة'},
    {title:'مختبر مصغّر: ذراعان ومصباحان',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f32,intro:'اضغط على أي ذراع في الرسم أو على الأزرار تحته، وراقب أي مصباح يضيء.',
     predict:{q:'المصباحان مطفآن. شغّلت الذراع الثاني S2 وحده. ماذا يحدث؟',opts:[
      ['يضيء المصباحان معاً',false,'كل ذراع له سلك خرج مستقل إلى مصباح واحد.'],
      ['يضيء المصباح ٢ وحده',true,'الذراع الثاني يصل التغذية المشتركة بسلك المصباح ٢ فقط.'],
      ['لا يضيء شيء حتى تشغّل الذراع الأول',false,'الذراعان مستقلان؛ يشتركان في سلك التغذية فقط.']]}})},
    {title:'مختبر مصغّر: عُدّ الأسلاك في كل خط',widget:(el,B)=>U3ST.ticks(el,B,{sp:F.f32,lin:U3ST.lin(LIN.f32),linW:260,segs:[
 {t:'من <b>المصدر</b> إلى <b>علبة التفريع</b>: كم سلكاً؟',n:2,w:[1,4],why:'سلك L1 (يكمل إلى المشترك في المفتاح) وسلك L2 (يكمل إلى عقدة المصباحين).'},
 {t:'من <b>علبة التفريع</b> إلى <b>المصباح ١</b>: كم سلكاً؟',n:2,w:[2,5],why:'خرج الذراع الأول، وفرع L2.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المصباح ٢</b>: كم سلكاً؟',n:2,w:[3,6],why:'خرج الذراع الثاني، وفرع L2.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المفتاح المزدوج</b>: كم سلكاً؟',n:3,w:[1,2,3],why:'التغذية المشتركة من L1 وخرجا الذراعين — لذلك ثلاث شُرَط.'}]})}
   ]},

  {st:3,short:'مصباحان على التوازي',title:'٣. مصباحان على التوازي بمفتاح مفرد',ref:'ص 67',
   q:'مفتاح واحد ومصباحان يضيئان معاً… وما هذا الخط الثالث PE؟',
   art:U3ST.art('الدائرة الخطية (3-3) أ: مصدر وعلبة تفريع ومصباحان ومفتاح مفرد، وعلى الخطوط ثلاث شُرَط','#DCE9F2',
    U3ST.fit(U3ST.lin(LIN.f33),[24,40,312,250],{vb:[10,0,240,220],
     extra:tA(48,140,'مصباح ١','middle',12)+tA(212,140,'مصباح ٢','middle',12)+tA(150,204,'مفتاح مفرد','start',12),
     hot:[[100,15,60,26,'المصدر / لوحة التوزيع.'],[116,62,28,24,'ثلاث شُرَط: ⟦L1⟧ و⟦N⟧ و⟦PE⟧ تدخل علبة التفريع.'],[120,102,20,20,'علبة التفريع: فيها ثلاث عقد — للخط المُشغَّل ولـ ⟦N⟧ ولـ ⟦PE⟧.'],[78,102,28,20,'ثلاث شُرَط إلى المصباح ١: الخط المُشغَّل و⟦N⟧ و⟦PE⟧.'],[154,102,28,20,'ثلاث شُرَط إلى المصباح ٢.'],[116,139,28,24,'ثلاث شُرَط على خط المفتاح كما رسمها الكتاب، مع أن التنفيذية تُدخل إلى المفتاح سلكين فقط — انظر «انتبه».'],[120,168,32,30,'المفتاح المفرد: يتحكم في المصباحين معاً.']]})),
   cap:'الشكل <span class="ltr">(3-3)</span> أ — ثلاث شُرَط على كل خط.<br><b>مرّر المؤشر على الشُّرَط والعلبة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أغلقت المفتاح في الدائرة (3-3). ماذا يحدث؟',opts:[
     ['يضيء المصباح ١ فقط',false,'خرج المفتاح يذهب إلى عقدة في علبة التفريع تغذي المصباحين معاً.'],
     ['يضيء المصباحان بضوء خافت',false,'الضوء الخافت يكون في التوالي؛ هنا كل مصباح بين الخط المُشغَّل وN مباشرة.'],
     ['يضيء المصباحان معاً، كلٌّ بإضاءته الكاملة',true,'المصباحان على التوازي على الخط المُشغَّل نفسه، ولكل منهما رجوعه إلى N.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-3) يبين الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مفرد (على التوازي).</p>`,ref:'ص 67'},
    {tip:String.raw`<p>في <span class="ltr">(3-3)</span> ب ثلاثة خطوط تغذية، لكلٍّ نمط رسم:</p><ul><li><b>L1</b> خط متصل.</li><li><b>N</b> (المحايد) خط «شرطة-نقطة».</li><li><b>PE</b> (موصل الحماية) خط متقطع.</li></ul><p>خرج المفتاح يذهب إلى عقدة تغذي المصباحين معاً، وN يغذي طرفهما الآخر — فهما على التوازي. وPE يُوصل بجسم كل كشاف (رمز الأرضي).</p>`,title:'ثلاثة خطوط بثلاثة أنماط'},
    {watch:String.raw`<p>في الشكل <span class="ltr">(3-3)</span> أ ثلاث شُرَط على الخط الذاهب إلى المفتاح المفرد، بينما الدائرة التنفيذية <span class="ltr">(3-3)</span> ب تُدخل إلى المفتاح سلكين فقط (L1 والخرج). الأدق شرطتان على خط المفتاح.</p>`,fix:true},
    {add:String.raw`<p>موصل الحماية <b>PE</b> لا يمر فيه تيار في التشغيل العادي. فائدته عند العطل: لو لمس سلك الطور جسم الكشاف المعدني، يجد التيار طريقاً إلى الأرض عبر PE بدل أن يمر في جسم من يلمس الكشاف، ويفصل جهاز الحماية الدائرة.</p>`,title:'لماذا موصل الحماية؟'},
    {title:'مختبر مصغّر: الشُّرَط والأسلاك في (3-3)',widget:(el,B)=>U3ST.ticks(el,B,{intro:'اختر عدد الأسلاك كما تدل عليه الشُّرَط في الخطية، ثم قارن بالتنفيذية.',sp:F.f33,lin:U3ST.lin(LIN.f33),linW:260,segs:[
 {t:'من <b>المصدر</b> إلى <b>علبة التفريع</b>: كم سلكاً؟',n:3,w:[0,4,7],why:'L1 وN وPE.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المصباح ١</b>: كم سلكاً؟',n:3,w:[2,5,8],why:'الخط المُشغَّل من المفتاح، وN، وPE إلى جسم الكشاف.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المصباح ٢</b>: كم سلكاً؟',n:3,w:[3,6,9],why:'مثل المصباح ١ تماماً — لذلك هما على التوازي.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المفتاح</b>: كم شرطة رسم الكتاب؟',n:3,w:[0,1],why:'الكتاب رسم ثلاث شُرَط، لكن الأسلاك الملوّنة في التنفيذية اثنان فقط: L1 النازل وخرج المفتاح. هذا ما تشرحه ملاحظة «انتبه».'}]})},
    {title:'تحقق سريع: أنماط الخطوط',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['في الشكل (3-3) ب يُرسم الموصل N بخط «شرطة-نقطة».',true,'L1 متصل، وN شرطة-نقطة، وPE متقطع.'],
 ['موصل الحماية PE يوصل إلى المفتاح.',false,'يوصل إلى جسم كل كشاف عند رمز الأرضي.'],
 ['المفتاح المفرد هنا يتحكم في المصباحين معاً.',true,'خرجه يغذي عقدة المصباحين.']]})}
   ]},

  {recap:[
   'عدد الشُّرَط على خط في الدائرة الخطية = عدد الأسلاك في هذا الطريق؛ والسلك الواحد قد يمر في طريقين (ص 65–67).',
   'الشكل (3-1): ثلاثة أسلاك، والمفتاح على L1.',
   'الشكل (3-2): المفتاح المزدوج ذراعان بطرف تغذية مشترك، كل ذراع لمصباح؛ وعلى خطه ثلاث شُرَط.',
   'الشكل (3-3): مصباحان على التوازي بمفتاح واحد؛ L1 متصل وN شرطة-نقطة وPE متقطع، وPE إلى جسم الكشاف.']}
],
 theory:[
  {h:'١. مصباح بمفتاح مفرد',ref:'ص 65–66',html:'<p>الشكل (3-1) يبين الدائرة الخطية والتنفيذية لتشغيل مصباح كهربائي بمفتاح مفرد 220 فولت (شرحناه في الدرس السابق):</p>'},
  {fig:'(3-1) أ',ref:'ص 65',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f31,220)},
  {fig:'(3-1) ب',ref:'ص 65–66',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f31)},
  {h:'٢. مصباحان بمفتاح مزدوج',ref:'ص 66',html:'<p>الشكل (3-2) يبين الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مزدوج.</p>'},
  {fig:'(3-2) أ',ref:'ص 66',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f32,260)},
  {fig:'(3-2) ب',ref:'ص 66',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f32)},
  {note:ADD+'المفتاح المزدوج مفتاحان في علبة واحدة لهما طرف تغذية مشترك. في (3-2) ب: من <b>L1</b> سلك إلى الطرف المشترك للمفتاح؛ ومن خرج الذراع الأولى سلك إلى المصباح 1، ومن خرج الذراع الثانية سلك إلى المصباح 2؛ و<b>L2</b> ينزل إلى عقدة في علبة التفريع تغذي الطرف الآخر للمصباحين معاً. لذلك على خط المفتاح في الخطية ثلاث شُرَط (تغذية + خرجان)، ورمز المفتاح المزدوج في الخطية خطان مائلان بعلمين.'},
  {h:'٣. مصباحان على التوازي بمفتاح مفرد',ref:'ص 67',html:'<p>الشكل (3-3) يبين الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مفرد (على التوازي).</p>'},
  {fig:'(3-3) أ',ref:'ص 67',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f33,260)},
  {fig:'(3-3) ب',ref:'ص 67',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f33)},
  {note:ADD+'في (3-3) ب ثلاثة خطوط تغذية رُسم كلٌّ منها بنمط مختلف: <b>L1</b> خط متصل، و<b>N</b> (المحايد) خط شرطة-نقطة، و<b>PE</b> (موصل الحماية) خط متقطع. خرج المفتاح يذهب إلى عقدة في علبة التفريع تغذي المصباحين معاً، وN يغذي طرفهما الآخر — فالمصباحان على التوازي ويعملان معاً. وموصل الحماية PE يُوصل بجسم كل كشاف (رمز الأرضي) ولا يمر فيه تيار إلا عند عطل.'},
  {err:'في الشكل (3-3) أ ثلاث شُرَط على الخط الذاهب إلى المفتاح المفرد، بينما الدائرة التنفيذية (3-3) ب تُدخل إلى المفتاح سلكين فقط (L1 والخرج). الأدق شرطتان على خط المفتاح.'},
  {h:'نشاط: عُدّ الشُّرَط',ref:'ص 65–67',widget:el=>mcqWidget(el,TICKQ)}
 ],
 lab:(el)=>board(el,[BD.f31,BD.f32,BD.f33]),
 examples:[
  drawEx({title:'رسم الدائرة التنفيذية (3-2) ب خطوة بخطوة',ref:'ص 66',q:'<p>ارسم الدائرة التنفيذية لتشغيل مصباحين عن طريق مفتاح مزدوج كما في الدائرة الخطية (3-2) أ.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: مصباحان، كل منهما بسلكين، ومفتاح مزدوج بثلاثة أسلاك.',LIN.f32,260)],sp:F.f32,
   steps:['نرسم خطي التغذية <b>L1</b> و<b>L2</b>.','نرسم علبة التفريع، وعلبة المفتاح المزدوج تحتها: طرف سفلي مشترك موصول داخلياً بالطرف السفلي الآخر، وذراعان، وطرفان علويان.','نرسم علبتي المصباحين على جانبي علبة التفريع.',
    'من <b>L1</b> سلك ينزل ويلتف إلى الطرف المشترك للمفتاح.','من خرج الذراع الأولى سلك يصعد إلى علبة التفريع ثم يساراً إلى المصباح 1.','من خرج الذراع الثانية سلك يصعد إلى علبة التفريع ثم يميناً إلى المصباح 2.','من <b>L2</b> سلك إلى عقدة في علبة التفريع، ومنها إلى الطرف الآخر لكلا المصباحين.']}),
  drawEx({title:'رسم الدائرة التنفيذية (3-3) ب خطوة بخطوة',ref:'ص 67',q:'<p>ارسم الدائرة التنفيذية لتشغيل مصباحين على التوازي بمفتاح مفرد مع موصل الحماية، كما في الدائرة الخطية (3-3) أ.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   sp:F.f33,steps:['نرسم ثلاثة خطوط: <b>L1</b> متصل، و<b>N</b> شرطة-نقطة، و<b>PE</b> متقطع.','نرسم علبة التفريع وعلبة المفتاح المفرد.','نرسم علبتي الكشافين، وفي كل منهما المصباح ورمز الأرضي لجسم الكشاف.',
    'من <b>L1</b> سلك مستقيم إلى الطرف العلوي للمفتاح.','من الطرف السفلي للمفتاح سلك إلى العقدة السفلى في علبة التفريع، ومنها إلى طرف كلا المصباحين.','من <b>N</b> سلك إلى العقدة العليا، ومنها إلى الطرف الآخر لكلا المصباحين.','من <b>PE</b> سلك إلى العقدة الوسطى، ومنها إلى رمز الأرضي في كل كشاف.']})],
 quiz:[
  {q:'المفتاح المزدوج في الشكل (3-2) يتحكم في:',o:['مصباح واحد من مكانين','مصباحين، كل ذراع بمصباح','ثلاثة مصابيح من ثلاثة أماكن','جرس'],c:1,e:'ذراعان في علبة واحدة بطرف تغذية مشترك.'},
  {q:'لماذا ثلاث شُرَط على خط المفتاح المزدوج في (3-2) أ؟',o:['لأن فيه موصل حماية','لأن الأسلاك: تغذية مشتركة + خرج الذراع الأولى + خرج الذراع الثانية','لأن المصباحين على التوالي','خطأ في الرسم'],c:1,e:'ثلاثة أسلاك تصعد من المفتاح إلى علبة التفريع في (3-2) ب.'},
  {q:'في الشكل (3-3) ب يُرسم الموصل N بخط:',o:['متصل','شرطة-نقطة','متقطع (شرطات)','مزدوج'],c:1,e:'L1 متصل، N شرطة-نقطة، PE متقطع.'},
  {q:'إلى أين يوصل موصل الحماية PE في الشكل (3-3) ب؟',o:['إلى المفتاح','إلى جسم كل كشاف (رمز الأرضي)','إلى L1','لا يوصل'],c:1,e:'يُؤرَّض جسم الكشاف، ولا يمر فيه تيار في التشغيل العادي.'},
  {q:'إذا أغلقنا المفتاح في (3-3):',o:['يضيء المصباح 1 فقط','يضيء المصباحان معاً','يضيء المصباحان بضوء خافت','لا يضيء شيء'],c:1,e:'المصباحان على التوازي على الخط المُشغَّل نفسه.'},
  {q:'كم سلكاً بين علبة التفريع وكل كشاف في (3-3)؟',o:['واحد','اثنان','ثلاثة','أربعة'],c:2,e:'الخط المُشغَّل وN وPE.'}]
});

/* ============================== LESSON 3 ============================== */
B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'68–70',
 title:'دائرة السلم من ثلاثة أماكن، ومصباح الفلورسنت، والعداد',
 summary:'ثلاثة مصابيح تُشغَّل من ثلاثة أماكن بمفتاحين ذوي اتجاهين ومفتاح وسطي (3-4)، ومصباح فلورسنت ببادئ وملف خانق (3-5)، ومصباح بمفتاح مفرد مع عداد كهربائي (3-6).',
 stations:[
  {intro:true},

  {st:1,short:'دائرة السلم',title:'٤. دائرة السلم ثلاثة طوابق',ref:'ص 68',
   q:'كيف تُطفئ إنارة الدرج من الطابق الثالث وقد أشعلتها من الطابق الأول؟',
   art:U3ST.art('الدائرة الخطية (3-4) أ: ثلاثة مصابيح، ومفتاحان ذوا اتجاهين على خطيهما الرقم 3، ومفتاح وسطي على خطه الرقم 4','#E4EEDC',
    U3ST.fit(U3ST.lin(LIN.f34),[20,40,320,240],{vb:[20,0,280,216],
     hot:[[120,15,60,26,'المصدر / لوحة التوزيع.'],[140,100,20,20,'علبة التفريع في المركز.'],[50,53,24,24,'مصباح: رُسم هنا ⟦⊗⟧ (دائرة بداخلها ×).'],[224,53,24,24,'مصباح ⟦⊗⟧.'],[259,98,24,24,'مصباح ⟦⊗⟧ ثالث.'],[52,168,36,36,'مفتاح ذو اتجاهين: خطان مائلان بعلمين في اتجاهين متعاكسين. له طرف مشترك يتصل بأحد طرفين آخرين.'],[56,140,28,24,'شرطة بجانبها الرقم ⟦3⟧ = ثلاثة أسلاك.'],[132,168,36,36,'مفتاح وسطي: أربعة خطوط مائلة بأعلام. يصل السلكين القادمين بالخارجين مستقيمين أو متصالبين.'],[134,136,28,24,'الرقم ⟦4⟧ = أربعة أسلاك: سلكان مسافران داخلان وسلكان خارجان.'],[212,168,36,36,'مفتاح ذو اتجاهين ثانٍ.'],[216,140,28,24,'الرقم ⟦3⟧ = ثلاثة أسلاك.']]})
    +U3ST.at(84,290,'ذو اتجاهين',12,1)+U3ST.at(180,290,'وسطي',12,1)+U3ST.at(276,290,'ذو اتجاهين',12,1)),
   cap:'الشكل <span class="ltr">(3-4)</span> أ — ثلاثة مفاتيح من نوعين.<br><b>مرّر المؤشر على المفاتيح والأرقام (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'المصابيح مضيئة. غيّر أحدهم وضع المفتاح الوسطي فقط. ماذا يحدث؟',opts:[
     ['تنطفئ المصابيح',true,'المفتاح الوسطي يقلب توصيل السلكين المسافرين (مستقيم ↔ متصالب) فينقطع المسار. أي مفتاح من الثلاثة يقلب الحالة.'],
     ['تبقى مضيئة لأن الوسطي لا يقطع الدائرة',false,'الوسطي في مسار التيار بين المفتاحين ذوي الاتجاهين.'],
     ['يحدث قصر في الدائرة',false,'الوسطي يبدّل بين السلكين المسافرين فقط، ولا يصل L1 بـ N.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-4) يوضح الدائرة الخطية والتنفيذية لتشغيل ثلاثة مصابيح من ثلاثة أماكن (دائرة السلم ثلاثة طوابق) يدوياً.</p>`,ref:'ص 68'},
    {tip:String.raw`<ul><li><b>المفتاح ذو الاتجاهين</b> (في الطرفين): له طرف مشترك يتصل دائماً بأحد طرفين آخرين.</li><li><b>المفتاح الوسطي</b> (في الوسط): له أربعة أطراف، يصل السلكين القادمين بالسلكين الخارجين مستقيمين أو متصالبين.</li></ul><p>بين المفاتيح سلكان «مسافران». المسار: <b>L1 ← المفتاح الأول ← مسافر ← الوسطي ← مسافر ← المفتاح الأخير ← المصابيح الثلاثة (على التوازي) ← N</b>.</p>`,title:'نوعان من المفاتيح'},
    {add:String.raw`<p>هذه الدائرة نفسها تُستعمل في الممرات الطويلة وغرف النوم الكبيرة: مفتاح عند كل باب. ولو زاد عدد الأماكن إلى أربعة، يُضاف مفتاح وسطي آخر بين المفتاحين ذوي الاتجاهين.</p>`,title:'أين تراها؟'},
    {title:'مختبر مصغّر: ثلاثة طوابق',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f34,intro:'غيّر وضع أي مفتاح من الثلاثة (في الرسم أو بالأزرار)، وتتبّع السلكين المسافرين.',
     predict:{q:'كل المفاتيح في الوضع 1 والمصابيح مطفأة. كم مفتاحاً يكفي أن تغيّر لتضيء؟',opts:[
      ['الثلاثة معاً',false,'تغيير الثلاثة يقلب الحالة ثلاث مرات فتضيء — لكن مفتاح واحد يكفي.'],
      ['مفتاح واحد، أيّها كان',true,'كل تغيير لأي مفتاح يقلب الحالة: مطفأ ← مضيء.'],
      ['المفتاح الوسطي فقط',false,'أي مفتاح من الثلاثة يقلب الحالة، لا الوسطي وحده.']]}})}
   ]},

  {st:2,short:'مصباح فلورسنت',title:'٥. مصباح فلورسنت بمفتاح مفرد',ref:'ص 69',
   q:'كشاف الفلورسنت فيه أنبوبة وبادئ وملف خانق… فأيها يمر فيه التيار، ومتى؟',
   art:U3ST.art('الدائرة الخطية (3-5) أ: مصدر وعلبة تفريع وكشاف فلورسنت 20W ومفتاح مفرد','#DCE9F2',
    U3ST.fit(U3ST.lin(LIN.f35),[24,40,312,240],{vb:[20,0,210,222],
     extra:tA(170,48,'كشاف فلورسنت','middle',12)+tA(118,204,'مفتاح مفرد','start',12),
     hot:[[70,15,60,26,'المصدر / لوحة التوزيع.'],[88,62,24,20,'شرطتان = سلكان.'],[90,100,20,20,'علبة التفريع.'],[138,60,64,24,'رمز مصباح الفلورسنت: مستطيل مستدير الطرفين فيه ⟦20W⟧ وعلامة ⟦×⟧.'],[126,100,24,20,'شرطتان إلى الكشاف.'],[88,139,24,20,'شرطتان إلى المفتاح.'],[90,166,32,30,'المفتاح المفرد.']]})),
   cap:'الشكل <span class="ltr">(3-5)</span> أ — الكشاف في الخطية رمز واحد.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة التنفيذية (3-5) ب، أين يقع الملف الخانق؟',opts:[
     ['بين الطرفين العلويين للفتيلتين',false,'هذا مكان البادئ.'],
     ['على الخط N',false,'N يذهب إلى الطرف السفلي للفتيلة اليسرى مباشرة.'],
     ['على الخط الآتي من المفتاح إلى الفتيلة اليمنى',true,'المسار: المفتاح ← الملف الخانق ← الفتيلة اليمنى (ص 69).']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-5) يبين دائرة لتشغيل مصباح فلورسانت (20 وات) عن طريق مفتاح مفرد.</p>`,ref:'ص 69'},
    {tip:String.raw`<p>كشاف الفلورسنت في <span class="ltr">(3-5)</span> ب فيه: <b>الأنبوبة</b> ولها فتيلتان، لكل فتيلة طرفان؛ و<b>البادئ</b> موصول بين الطرفين العلويين للفتيلتين؛ و<b>الملف الخانق</b> على الخط الآتي من المفتاح. المسار: <b>L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N</b>.</p>`,title:'ما داخل الكشاف؟'},
    {add:String.raw`<p>الكتاب لا يشرح عمل الكشاف. ما يحدث عند التشغيل: يتوهج الغاز في البادئ فيسخن شريحته ثنائية المعدن فتغلق تلامسه، فيمر التيار في الفتيلتين فتسخنان؛ ثم يفتح البادئ، فيولّد الملف الخانق دفعة جهد عالية تُشعل الغاز في الأنبوبة، ثم يبقى الخانق في الدائرة ليحدّ التيار المار فيها.</p>`,title:'كيف يضيء الكشاف؟'},
    {title:'مختبر مصغّر: مراحل التشغيل',widget:(el,B)=>U3ST.mini(el,B,{bd:{sp:F.f35,loads:BD.f35.loads,states:[
      ['المفتاح مفتوح',S=>{},BD.f35.say({ph:'off'})],
      ['١- البادئ يتوهج',S=>{S.sw.S1=1;S.ph='glow'},BD.f35.say({ph:'glow'})],
      ['٢- تسخين الفتيلتين',S=>{S.sw.S1=1;S.ph='pre'},BD.f35.say({ph:'pre'})],
      ['٣- الأنبوبة مضيئة',S=>{S.sw.S1=1;S.ph='lit'},BD.f35.say({ph:'lit'})]]},
     intro:'اضغط المراحل بالترتيب وراقب مسار التيار في الرسم (شرح المراحل إضافة من خارج الكتاب).',
     predict:{q:'بعد أن تضيء الأنبوبة، أي عنصر يخرج من مسار التيار؟',opts:[
      ['الملف الخانق',false,'الخانق يبقى في الدائرة ليحدّ التيار المار في الأنبوبة.'],
      ['البادئ',true,'البادئ يفتح تلامسه، فيمر التيار عبر الأنبوبة نفسها لا عبر البادئ.'],
      ['المفتاح',false,'المفتاح يبقى مغلقاً ما دام الكشاف يعمل.']]}})}
   ]},

  {st:3,short:'العداد',title:'٦. مصباح بمفتاح مفرد مع عداد كهربائي',ref:'ص 70',
   q:'لماذا يدور قرص العداد عندما يضيء المصباح ويقف عندما ينطفئ؟',
   art:U3ST.art('الدائرة الخطية (3-6) أ: مصدر عليه مصهر، وعلبة تفريع، وعداد على خطه الرقم 3، ومصباح، ومفتاح مفرد','#F3E3C8',
    U3ST.fit(U3ST.lin(LIN.f36),[24,40,312,240],{vb:[10,0,240,222],
     extra:tA(50,104,'العداد','middle',12)+tA(150,204,'مفتاح مفرد','start',12),
     hot:[[100,15,60,26,'المصدر / لوحة التوزيع.'],[123,47,14,22,'المصهر: مستطيل صغير يمر الخط في وسطه.'],[118,74,24,20,'شرطتان = سلكان.'],[120,100,20,20,'علبة التفريع.'],[76,92,24,26,'شرطة بجانبها ⟦3⟧ = ثلاثة أسلاك إلى العداد.'],[36,52,28,36,'رمز العداد: مستطيل بقمة مقوسة فيه الحرف ⟦k⟧.'],[200,71,24,24,'المصباح ⟦⊗⟧.'],[118,139,24,20,'شرطتان إلى المفتاح.'],[120,166,32,30,'المفتاح المفرد.']]})),
   cap:'الشكل <span class="ltr">(3-6)</span> أ — المصهر على خط التغذية، والعداد بثلاثة أسلاك.<br><b>مرّر المؤشر على الرموز والأرقام (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كم سلكاً بين علبة التفريع والعداد في الشكل (3-6)؟',opts:[
     ['سلكان',false,'على خط العداد شرطة واحدة بجانبها الرقم 3.'],
     ['ثلاثة',true,'الرقم 3: والتنفيذية فيها ثلاثة أطراف للعداد، لكل طرف سلك.'],
     ['أربعة',false,'الرقم المكتوب 3.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-6) يوضح الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مفرد مع عداد كهربائي.</p>`,ref:'ص 70'},
    {watch:String.raw`<p>النص يقول «مصباحين» بينما الشكلان <span class="ltr">(3-6)</span> أ و<span class="ltr">(3-6)</span> ب فيهما مصباح واحد. وتوصيل العداد في <span class="ltr">(3-6)</span> ب غير معتاد: العداد عادة يُركَّب في بداية التغذية قبل المصهر ولوحة التوزيع، فيدخله L وN ويخرج منه L وN إلى المنشأة كلها؛ أما هنا فخرج المفتاح يدخل العداد، ولا يصل N إلى العداد، وأطرافه بلا تسميات. رسمناه كما في الكتاب: يقيس العداد تيار هذا المصباح فقط.</p>`,fix:true},
    {tip:String.raw`<p>في <span class="ltr">(3-6)</span> ب كما رُسم: <b>L1 ← المصهر ← العقدة ← المفتاح ← الطرف الأوسط للعداد ← الطرف الأيسر للعداد ← المصباح ← N</b>، والطرف الأيمن للعداد موصول بالعقدة (L1 بعد المصهر). فتيار المصباح كله يمر في العداد، ولذلك يدور قرصه ما دام المصباح مضيئاً.</p>`,title:'مسار التيار عبر العداد'},
    {title:'مختبر مصغّر: المصباح والعداد',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f36,intro:'أغلق المفتاح وافتحه، وراقب قرص العداد.',
     predict:{q:'المفتاح مفتوح والمصباح مطفأ. هل يدور قرص العداد؟',opts:[
      ['نعم، لأن العداد موصول بـ L1 دائماً',false,'الطرف الأيمن موصول بـ L1، لكن لا يمر تيار في العداد ما دام المصباح لا يعمل.'],
      ['لا، يقف القرص',true,'العداد لا يسجّل إلا عندما يمر تيار الحمل فيه.'],
      ['يدور ببطء',false,'لا تيار = لا دوران.']]}})},
    {title:'مختبر مصغّر: الشُّرَط والأسلاك في (3-6)',widget:(el,B)=>U3ST.ticks(el,B,{sp:F.f36,lin:U3ST.lin(LIN.f36),linW:260,segs:[
 {t:'من <b>المصدر</b> إلى <b>علبة التفريع</b> (عبر المصهر): كم سلكاً؟',n:2,w:[0,1,6],why:'L1 (يمر بالمصهر) وN.'},
 {t:'من <b>علبة التفريع</b> إلى <b>العداد</b>: كم سلكاً؟',n:3,w:[3,4,5],why:'لكل طرف من أطراف العداد الثلاثة سلك.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المصباح</b>: كم سلكاً؟',n:2,w:[5,6],why:'السلك من الطرف الأيسر للعداد، وN.'},
 {t:'من <b>علبة التفريع</b> إلى <b>المفتاح</b>: كم سلكاً؟',n:2,w:[2,4],why:'L1 النازل إلى المفتاح، وخرج المفتاح الذاهب إلى العداد.'}]})}
   ]},

  {recap:[
   'دائرة السلم (3-4): مفتاحان ذوا اتجاهين (3 أسلاك) ومفتاح وسطي (4 أسلاك)، وتغيير أي مفتاح يقلب حالة المصابيح (ص 68).',
   'الفلورسنت (3-5): L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N (ص 69).',
   'العداد (3-6): مصهر على التغذية، وثلاثة أسلاك إلى العداد، وتيار المصباح يمر فيه فيدور قرصه (ص 70).',
   'النص يقول «مصباحين» في المثال 6 والشكل فيه مصباح واحد، وتوصيل العداد فيه غير المعتاد.']}
],
 theory:[
  {h:'٤. دائرة السلم ثلاثة طوابق',ref:'ص 68',html:'<p>الشكل (3-4) يوضح الدائرة الخطية والتنفيذية لتشغيل ثلاثة مصابيح من ثلاثة أماكن (دائرة السلم ثلاثة طوابق) يدوياً.</p>'},
  {fig:'(3-4) أ',ref:'ص 68',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f34,300)},
  {fig:'(3-4) ب',ref:'ص 68',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f34)},
  {note:ADD+'في دائرة السلم نوعان من المفاتيح:<ul><li><b>المفتاح ذو الاتجاهين</b> (في الطرفين): له طرف مشترك يتصل دائماً بأحد طرفين آخرين، حسب وضعه.</li><li><b>المفتاح الوسطي</b> (في الوسط): له أربعة أطراف، يصل السلكين القادمين بالسلكين الخارجين إما مستقيمين وإما متصالبين.</li></ul>بين المفاتيح سلكان «مسافران». التيار يمر من <b>L1</b> إلى المشترك في المفتاح الأول، ثم في أحد المسافرين إلى المفتاح الوسطي، ثم في أحد المسافرين إلى المفتاح الأخير، ومن مشتركه إلى المصابيح الثلاثة (على التوازي) ثم إلى <b>N</b>. تغيير وضع أي مفتاح يقطع المسار أو يكمله. لذلك على خطَّي المفتاحين ذوي الاتجاهين في الخطية الرقم 3، وعلى خط المفتاح الوسطي الرقم 4. وفي الخطية رُسمت المصابيح هنا ⊗.'},
  {h:'٥. مصباح فلورسنت بمفتاح مفرد',ref:'ص 69',html:'<p>الشكل (3-5) يبين دائرة لتشغيل مصباح فلورسانت (20 وات) عن طريق مفتاح مفرد.</p>'},
  {fig:'(3-5) أ',ref:'ص 69',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f35,240)},
  {fig:'(3-5) ب',ref:'ص 69',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f35)},
  {note:ADD+'كشاف الفلورسنت في (3-5) ب فيه: <b>الأنبوبة</b> ولها فتيلتان، لكل فتيلة طرفان؛ و<b>البادئ</b> موصول بين الطرفين العلويين للفتيلتين؛ و<b>الملف الخانق</b> على الخط الآتي من المفتاح. المسار: <b>L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى ← (البادئ) ← الفتيلة اليسرى ← N</b>. عند التشغيل يغلق البادئ تلامسه فتسخن الفتيلتان، ثم يفتحه، فيولّد الملف الخانق دفعة جهد تُشعل الأنبوبة، ثم يحدّ التيار المار فيها. الكتاب لا يشرح هذا العمل؛ شاهده في المختبر.'},
  {h:'٦. مصباح بمفتاح مفرد مع عداد كهربائي',ref:'ص 70',html:'<p>الشكل (3-6) يوضح الدائرة الخطية والتنفيذية لتشغيل مصباحين عن طريق مفتاح مفرد مع عداد كهربائي.</p>'},
  {fig:'(3-6) أ',ref:'ص 70',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f36,260)},
  {fig:'(3-6) ب',ref:'ص 70',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f36)},
  {note:ADD+'في (3-6) أ رمز العداد مستطيل بقمة مقوسة وفيه الحرف k، وعلى خطه الرقم 3 (ثلاثة أسلاك)، ورمز المصهر مستطيل صغير على خط التغذية. وفي (3-6) ب كما رُسم: <b>L1 ← المصهر ← العقدة ← المفتاح ← الطرف الأوسط للعداد ← الطرف الأيسر للعداد ← المصباح ← N</b>، والطرف الأيمن للعداد موصول بالعقدة (L1 بعد المصهر).'},
  {err:'النص يقول «مصباحين» بينما الشكلان (3-6) أ و(3-6) ب فيهما مصباح واحد. وتوصيل العداد في (3-6) ب غير معتاد: العداد عادة يُركَّب في بداية التغذية قبل المصهر ولوحة التوزيع، فيدخله L وN ويخرج منه L وN إلى المنشأة كلها؛ أما هنا فخرج المفتاح يدخل العداد، ولا يصل N إلى العداد، وأطرافه بلا تسميات. رسمناه في الشرح والمختبر كما في الكتاب: يقيس العداد تيار هذا المصباح فقط.'}
 ],
 lab:(el)=>board(el,[BD.f34,BD.f35,BD.f36]),
 examples:[
  drawEx({title:'رسم دائرة السلم (3-4) ب خطوة بخطوة',ref:'ص 68',q:'<p>ارسم الدائرة التنفيذية لتشغيل ثلاثة مصابيح من ثلاثة أماكن (مفتاح ذو اتجاهين + مفتاح وسطي + مفتاح ذو اتجاهين) كما في الخطية (3-4) أ.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: ثلاثة مصابيح، ومفتاحان ذوا اتجاهين (3 أسلاك لكل منهما)، ومفتاح وسطي (4 أسلاك).',LIN.f34,300)],sp:F.f34,
   steps:['نرسم <b>L1</b> و<b>N</b>.','نرسم علبة التفريع، وثلاث علب مفاتيح في الأسفل: ذو اتجاهين، وسطي، ذو اتجاهين.','نرسم علب المصابيح الثلاثة.',
    'من <b>L1</b> سلك ينزل ويلتف إلى الطرف المشترك للمفتاح الأول.','سلكان مسافران من الطرفين العلويين للمفتاح الأول إلى الطرفين العلويين للمفتاح الوسطي.','سلكان مسافران من الطرفين السفليين للمفتاح الوسطي إلى الطرفين العلويين للمفتاح الأخير.',
    'من المشترك في المفتاح الأخير سلك يصعد إلى عقدة في علبة التفريع (الخط المُشغَّل).','من هذه العقدة إلى طرف كل مصباح من الثلاثة.','من <b>N</b> إلى عقدة في علبة التفريع، ومنها إلى الطرف الآخر للمصابيح الثلاثة.']}),
  drawEx({title:'رسم دائرة الفلورسنت (3-5) ب خطوة بخطوة',ref:'ص 69',q:'<p>ارسم الدائرة التنفيذية لمصباح فلورسنت 20 W بمفتاح مفرد، وتتبّع مسار التيار عبر الملف الخانق والفتيلتين.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: مصدر، علبة تفريع، كشاف فلورسنت 20W، ومفتاح مفرد؛ سلكان على كل خط.',LIN.f35,240)],sp:F.f35,
   steps:['نرسم <b>L1</b> و<b>N</b>.','نرسم علبة التفريع وعلبة المفتاح المفرد.','نرسم علبة الكشاف: الأنبوبة بفتيلتيها، والبادئ بين الطرفين العلويين للفتيلتين، والملف الخانق تحت الأنبوبة.',
    'من <b>L1</b> سلك إلى الطرف العلوي للمفتاح.','من الطرف السفلي للمفتاح سلك إلى علبة التفريع ثم إلى الملف الخانق، ومن الخانق إلى الطرف السفلي للفتيلة اليمنى.','من <b>N</b> سلك إلى علبة التفريع ثم إلى الطرف السفلي للفتيلة اليسرى. المسار: L1 ← المفتاح ← الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N.']})],
 quiz:[
  {q:'ما المفاتيح المستعملة في دائرة السلم من ثلاثة أماكن (3-4)؟',o:['ثلاثة مفاتيح مفردة','مفتاحان ذوا اتجاهين ومفتاح وسطي','مفتاح مزدوج ومفتاح مفرد','ثلاثة ضواغط'],c:1,e:'ذو اتجاهين في كل طرف، والوسطي بينهما.'},
  {q:'الرقم 4 على خط المفتاح الوسطي في (3-4) أ يعني:',o:['أربعة مصابيح','أربعة أسلاك','الطابق الرابع','4 أمبير'],c:1,e:'سلكان مسافران داخلان وسلكان خارجان.'},
  {q:'إذا كانت المصابيح مضيئة في دائرة السلم وغيّرنا وضع المفتاح الوسطي:',o:['تبقى مضيئة','تنطفئ','يضيء مصباح واحد','يحدث قصر'],c:1,e:'أي مفتاح من الثلاثة يقلب الحالة.'},
  {q:'في دائرة الفلورسنت (3-5) ب، أين الملف الخانق؟',o:['بين الطرفين العلويين للفتيلتين','على الخط الآتي من المفتاح إلى الفتيلة اليمنى','على الخط N','داخل البادئ'],c:1,e:'الخانق في مسار التيار دائماً؛ أما البادئ فبين الطرفين العلويين.'},
  {q:'ما وظيفة البادئ في كشاف الفلورسنت؟ (توضيح للمتدرب)',o:['يغلق دائرة الفتيلتين لتسخنا ثم يفتحها فتشتعل الأنبوبة','يحدّ تيار الأنبوبة','يقيس الطاقة','يؤرّض الكشاف'],c:0,e:'وتحديد التيار عمل الملف الخانق.'},
  {q:'ما الذي يختلف بين نص المثال (3-6) والشكل؟',o:['النص يقول مصباحين والشكل فيه مصباح واحد','الشكل بلا مفتاح','النص لا يذكر العداد','لا اختلاف'],c:0,e:'لاحظ أيضاً أن توصيل العداد في الشكل غير معتاد.'}]
});

/* ============================== LESSON 4 ============================== */
B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'71–72',
 title:'الأجراس: جرس 127 فولت وجرس الجهد المنخفض',
 summary:'تشغيل جرس كهربائي بضاغط مباشرة على الشبكة (3-7)، وتشغيل جرس على جهد منخفض 12 أو 24 فولت عبر محول الجرس (3-8).',
 stations:[
  {intro:true},

  {st:1,short:'جرس 127 فولت',title:'٧. جرس كهربائي 127 فولت',ref:'ص 71',
   q:'لماذا يسكت الجرس وحده عندما ترفع إصبعك، بينما يبقى المصباح مضيئاً بعد أن تترك المفتاح؟',
   art:U3ST.art('الدائرة الخطية (3-7) أ: مصدر وعلبة تفريع وجرس وضاغط','#F7DCC8',
    U3ST.fit(U3ST.lin(LIN.f37),[24,40,312,240],{vb:[20,0,210,222],
     extra:tA(190,56,'الجرس','middle',12)+tA(76,206,'الضاغط','start',12),
     hot:[[90,19,60,26,'المصدر / لوحة التوزيع.'],[108,64,24,20,'شرطتان = سلكان.'],[110,100,20,20,'علبة التفريع.'],[146,100,24,20,'شرطتان إلى الجرس.'],[176,64,28,20,'رمز الجرس: نصف دائرة فوق خط.'],[48,133,24,20,'شرطتان إلى الضاغط.'],[48,172,24,24,'رمز الضاغط (زر الجرس): دائرة بداخلها نقطة ⟦⊙⟧.']]})),
   cap:'الشكل <span class="ltr">(3-7)</span> أ — رمزان جديدان: الجرس والضاغط.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'رمز الضاغط في الدائرة الخطية هو:',opts:[
     ['دائرة بداخلها ×',false,'هذا رمز المصباح ⊗.'],
     ['نصف دائرة فوق خط',false,'هذا رمز الجرس.'],
     ['دائرة بداخلها نقطة ⊙',true,'هكذا رُسم الضاغط في (3-7) أ.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-7) يوضح الدائرة الخطية لدائرة تشغيل جرس كهربائي 127 فولت.</p>`,ref:'ص 71'},
    {watch:String.raw`<p>النص في المثالين ٧ و٨ يقول «يوضح الدائرة الخطية» فقط، بينما كل شكل فيه الدائرة الخطية (أ) والتنفيذية (ب).</p>`,fix:true},
    {tip:String.raw`<p>في التنفيذية يُرسم الضاغط مثل المفتاح، لكن برمز التشغيل بالضغط «[» بدل رمز التشغيل اليدوي «T»: <b>يغلق ما دام مضغوطاً ويرجع مفتوحاً وحده</b>. المسار: <b>L1 ← الضاغط ← الجرس ← N</b>.</p>`,title:'الضاغط ليس مفتاحاً عادياً'},
    {title:'مختبر مصغّر: اضغط الجرس',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f37,intro:'اضغط مع الإمساك على الضاغط في الرسم أو على الزر، ثم اتركه.',
     predict:{q:'ضغطت الضاغط ثم رفعت إصبعك. ماذا يحدث؟',opts:[
      ['يبقى الجرس يرن حتى ضغطة ثانية',false,'هذا عمل المفتاح أو مفتاح صدمة التيار، لا الضاغط.'],
      ['يسكت الجرس فوراً',true,'الضاغط يرجع مفتوحاً وحده فينقطع التيار.'],
      ['يرن بعد أن ترفع إصبعك فقط',false,'الجرس يرن ما دام الضاغط مضغوطاً.']]}})},
    {title:'مختبر مصغّر: الشُّرَط والأسلاك في (3-7)',widget:(el,B)=>U3ST.ticks(el,B,{sp:F.f37,lin:U3ST.lin(LIN.f37),linW:240,segs:[
 {t:'من <b>المصدر</b> إلى <b>علبة التفريع</b>: كم سلكاً؟',n:2,w:[0,2],why:'L1 وN.'},
 {t:'من <b>علبة التفريع</b> إلى <b>الجرس</b>: كم سلكاً؟',n:2,w:[1,2],why:'السلك الآتي من الضاغط، وN.'},
 {t:'من <b>علبة التفريع</b> إلى <b>الضاغط</b>: كم سلكاً؟',n:2,w:[0,1],why:'L1 النازل إلى الضاغط، والسلك الراجع منه إلى الجرس.'}]})}
   ]},

  {st:2,short:'جرس بجهد منخفض',title:'٨. جرس بجهد منخفض 12 أو 24 فولت',ref:'ص 72',
   q:'الجرس يعمل على 12 أو 24 فولت والشبكة أعلى من ذلك… فمن أين يأتي جهده؟',
   art:U3ST.art('الدائرة الخطية (3-8) أ: مصدر وعلبة تفريع ومحول الجرس وفوقه الجرس، وضاغط','#E8E2F2',
    U3ST.fit(U3ST.lin(LIN.f38),[24,40,312,240],{vb:[20,0,210,222],
     extra:tA(166,64,'الجرس','end',12)+tA(166,94,'المحول','end',12)+tA(136,206,'الضاغط','start',12),
     hot:[[90,15,60,26,'المصدر / لوحة التوزيع.'],[110,100,20,20,'علبة التفريع.'],[146,100,24,20,'شرطتان إلى المحول.'],[180,76,20,28,'محول الجرس: دائرتان متداخلتان. يخفض الجهد ليعمل الجرس على ⟦12⟧ أو ⟦24⟧ فولت.'],[176,48,28,18,'الجرس: نصف دائرة فوق خط.'],[108,136,24,20,'شرطتان إلى الضاغط.'],[108,172,24,24,'الضاغط ⟦⊙⟧.']]})),
   cap:'الشكل <span class="ltr">(3-8)</span> أ — المحول بين علبة التفريع والجرس.<br><b>مرّر المؤشر على المحول والرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في (3-8) ب، هل الجرس موصول بالخط L1 أو N مباشرة؟',opts:[
     ['نعم، بـ L1',false,'L1 يذهب إلى الضاغط ثم إلى الملف الابتدائي.'],
     ['لا، يتصل بطرفي الملف الثانوي فقط',true,'دائرة الثانوي والجرس منفصلة عن الشبكة.'],
     ['نعم، بالخطين معاً',false,'الخطان L1 وN يصلان إلى الملف الابتدائي فقط.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-8) يوضح الدائرة الخطية لدائرة تشغيل جرس كهربائي يعمل على جهد منخفض 12 أو 24 فولت.</p>`,ref:'ص 72'},
    {tip:String.raw`<p>في <span class="ltr">(3-8)</span> ب الضاغط على جانب <b>الملف الابتدائي</b>: <b>L1 ← الضاغط ← الابتدائي ← N</b>. وطرفا <b>الملف الثانوي</b> موصولان مباشرة بطرفي الجرس. عند الضغط يتولد في الثانوي جهد منخفض يشغّل الجرس. والكتاب لا يكتب على الشكل جهد الابتدائي ولا الثانوي.</p>`,title:'دائرتان منفصلتان'},
    {add:String.raw`<p>فائدة الجهد المنخفض: أسلاك الجرس والضاغط عند باب البيت أكثر عرضة للمس والرطوبة، فإذا كانت على جهد منخفض قلّ خطر الصدمة.</p>`,title:'لماذا جهد منخفض؟'},
    {title:'مختبر مصغّر: الابتدائي والثانوي',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f38,intro:'اضغط مع الإمساك على الضاغط، وراقب جانبي المحول.',
     predict:{q:'ضغطت الضاغط. في أي دائرة يمر تيار؟',opts:[
      ['في دائرة الابتدائي فقط',false,'الابتدائي يولّد جهداً في الثانوي، فيمر تيار في الجرس أيضاً.'],
      ['في الدائرتين: الابتدائي من الشبكة، والثانوي إلى الجرس',true,'دائرتان منفصلتان تعملان معاً ما دام الضاغط مضغوطاً.'],
      ['في الثانوي فقط',false,'الثانوي لا يعمل إلا إذا مر تيار في الابتدائي.']]}})},
    {title:'تحقق سريع: محول الجرس',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الضاغط في (3-8) ب موصول على جانب الملف الابتدائي.',true,'L1 ← الضاغط ← الابتدائي ← N.'],
 ['وظيفة محول الجرس رفع الجهد.',false,'يخفضه ليعمل الجرس على 12 أو 24 فولت.'],
 ['الكتاب يكتب جهد الملف الثانوي على الشكل.',false,'لا يكتب جهد الابتدائي ولا الثانوي على الشكل.']]})}
   ]},

  {recap:[
   'الضاغط ⊙ يغلق ما دام مضغوطاً ويرجع مفتوحاً وحده، ورمزه في التنفيذية «[» بدل «T» (ص 71).',
   'جرس (3-7): L1 ← الضاغط ← الجرس ← N، وسلكان على كل خط.',
   'جرس بجهد منخفض (3-8): الضاغط على جانب الابتدائي، والجرس على الثانوي ومنفصل عن الشبكة، ويعمل على 12 أو 24 فولت (ص 72).']}
],
 theory:[
  {h:'٧. جرس كهربائي 127 فولت',ref:'ص 71',html:'<p>الشكل (3-7) يوضح الدائرة الخطية لدائرة تشغيل جرس كهربائي 127 فولت.</p>'},
  {fig:'(3-7) أ',ref:'ص 71',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f37,240)},
  {fig:'(3-7) ب',ref:'ص 71',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f37)},
  {note:ADD+'رمز الضاغط في الخطية دائرة بداخلها نقطة (⊙)، ورمز الجرس نصف دائرة فوق خط. وفي التنفيذية يُرسم الضاغط مثل المفتاح لكن برمز التشغيل بالضغط «[» بدل «T»: يغلق ما دام مضغوطاً ويرجع مفتوحاً وحده. المسار: <b>L1 ← الضاغط ← الجرس ← N</b>.'},
  {h:'٨. جرس بجهد منخفض 12 أو 24 فولت',ref:'ص 72',html:'<p>الشكل (3-8) يوضح الدائرة الخطية لدائرة تشغيل جرس كهربائي يعمل على جهد منخفض 12 أو 24 فولت.</p>'},
  {fig:'(3-8) أ',ref:'ص 72',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f38,240)},
  {fig:'(3-8) ب',ref:'ص 72',caption:'الدائرة التنفيذية.',draw:()=>xFig(F.f38)},
  {note:ADD+'محول الجرس رمزه في الخطية دائرتان متداخلتان. في (3-8) ب الضاغط على جانب <b>الملف الابتدائي</b>: L1 ← الضاغط ← الابتدائي ← N؛ وطرفا <b>الملف الثانوي</b> موصولان مباشرة بطرفي الجرس. فعند الضغط يتولد في الثانوي جهد منخفض يشغّل الجرس، والجرس نفسه ليس موصولاً بالشبكة. والكتاب لا يكتب على الشكل جهد الابتدائي ولا الثانوي.'},
  {err:'النص في المثالين ٧ و٨ يقول «يوضح الدائرة الخطية» فقط، بينما كل شكل فيه الدائرة الخطية (أ) والتنفيذية (ب).'}
 ],
 lab:(el)=>board(el,[BD.f37,BD.f38]),
 examples:[
  drawEx({title:'رسم دائرة الجرس (3-7) ب من الخطية',ref:'ص 71',q:'<p>ارسم الدائرة التنفيذية لجرس كهربائي يُشغَّل بضاغط، كما في الخطية (3-7) أ.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: الجرس على يمين علبة التفريع، والضاغط ⊙ تحتها على اليسار، وسلكان على كل خط.',LIN.f37,240)],sp:F.f37,
   steps:['نرسم <b>L1</b> و<b>N</b>.','نرسم علبة التفريع، وعلبة الضاغط تحتها على اليسار: طرفان ونصل ورمز الضغط «[».','نرسم الجرس بطرفيه.','من <b>L1</b> سلك إلى علبة التفريع ثم إلى الطرف العلوي للضاغط.','من الطرف السفلي للضاغط سلك يصعد ويمر في علبة التفريع إلى الطرف الأيمن للجرس.','من <b>N</b> سلك إلى علبة التفريع ثم إلى الطرف الأيسر للجرس.']}),
  drawEx({title:'رسم دائرة الجرس بمحول (3-8) ب من الخطية',ref:'ص 72',q:'<p>ارسم الدائرة التنفيذية لجرس يعمل على جهد منخفض عبر محول الجرس، كما في الخطية (3-8) أ.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: المحول (دائرتان متداخلتان) بين علبة التفريع والجرس، والضاغط تحت العلبة.',LIN.f38,240)],sp:F.f38,
   steps:['نرسم <b>L1</b> و<b>N</b>.','نرسم علبة التفريع وعلبة الضاغط تحتها.','نرسم محول الجرس (الابتدائي في الأسفل والثانوي في الأعلى) والجرس فوقه.','من <b>L1</b> سلك إلى العقدة العليا في علبة التفريع ثم إلى الطرف العلوي للضاغط.','من الطرف السفلي للضاغط سلك إلى العقدة السفلى ثم إلى أحد طرفي الابتدائي.','من <b>N</b> سلك إلى الطرف الآخر للابتدائي.','طرفا الثانوي إلى طرفي الجرس مباشرة.']})],
 quiz:[
  {q:'رمز الضاغط (زر الجرس) في الدائرة الخطية هو:',o:['دائرة بداخلها نقطة ⊙','دائرة بداخلها ×','نصف دائرة فوق خط','مستطيل بقطر مائل'],c:0,e:'نصف الدائرة فوق خط هو الجرس، والمستطيل بالقطر هو المصدر.'},
  {q:'متى يرن الجرس في الدائرة (3-7)؟',o:['دائماً','ما دام الضاغط مضغوطاً','بعد ترك الضاغط','عند فصل N'],c:1,e:'الضاغط يرجع مفتوحاً وحده.'},
  {q:'ما وظيفة محول الجرس في (3-8)؟',o:['يرفع الجهد','يخفض الجهد ليعمل الجرس على 12 أو 24 فولت','يقيس التيار','يحمي من القصر'],c:1,e:'الجرس يعمل على جهد منخفض.'},
  {q:'في (3-8) ب، الضاغط موصول على:',o:['جانب الملف الابتدائي','جانب الملف الثانوي','بين الجرس والثانوي','N فقط'],c:0,e:'L1 ← الضاغط ← الابتدائي ← N.'},
  {q:'هل الجرس في (3-8) ب موصول بـ L1 أو N مباشرة؟',o:['نعم بـ L1','نعم بـ N','لا، يتصل بطرفي الثانوي فقط','بالاثنين'],c:2,e:'دائرة الثانوي منفصلة عن الشبكة.'}]
});

/* ============================== LESSON 5 ============================== */
B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'73–75',
 title:'مفتاح صدمة التيار ومزمن الإضاءة',
 summary:'إنارة ممر طويل أو مدخل عمارة من عدة أماكن بالضواغط: بمفتاح صدمة التيار (كل ضغطة تقلب الحالة) (3-9)، وبمزمن يطفئ الإنارة بعد وقت محدد (3-10).',
 stations:[
  {intro:true},

  {st:1,short:'مفتاح صدمة التيار',title:'٩. مفتاح صدمة التيار',ref:'ص 73–74',
   q:'ثلاثة ضواغط في ممر طويل… كيف تُشعل الإنارة بضغطة وتطفئها بضغطة من أي مكان؟',
   art:U3ST.art('الدائرة الخطية (3-9) أ: أربعة مصابيح وثلاثة ضواغط ومفتاح صدمة التيار على خطه الرقم 4','#DDEFE6',
    U3ST.fit(U3ST.lin(LIN.f39),[20,40,320,250],{vb:[20,0,260,240],
     hot:[[120,15,60,26,'المصدر / لوحة التوزيع.'],[140,110,20,20,'علبة التفريع في المركز.'],[72,61,24,24,'مصباح ⟦⊗⟧ — أربعة مصابيح على التوازي.'],[204,61,24,24,'مصباح ⟦⊗⟧.'],[37,108,24,24,'مصباح ⟦⊗⟧.'],[239,108,24,24,'مصباح ⟦⊗⟧.'],[74,177,20,20,'ضاغط ⟦⊙⟧.'],[140,177,20,20,'ضاغط ⟦⊙⟧.'],[140,204,20,20,'ضاغط ⟦⊙⟧ ثالث تحت الثاني.'],[196,172,40,28,'مفتاح صدمة التيار: مستطيل بداخله شكل «درجة».'],[202,142,28,24,'الرقم ⟦4⟧ = أربعة أسلاك إلى مفتاح صدمة التيار.']]})),
   cap:'الشكل <span class="ltr">(3-9)</span> أ — الضواغط الثلاثة ومفتاح صدمة التيار.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في (3-9) ب، تيار المصابيح الأربعة يمر في:',opts:[
     ['الضواغط',false,'الضواغط تحمل تيار ملف المفتاح فقط (دائرة التحكم).'],
     ['تلامس المفتاح 1–2',true,'دائرة القدرة: L1 ← التلامس 1–2 ← المصابيح ← L2.'],
     ['ملف المفتاح A1–A2',false,'الملف في دائرة التحكم، ويعطيه الضاغط نبضة قصيرة.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-9) يوضح الدائرة الخطية لدائرة لتشغيل مفتاح صدمة تيار يشغل مجموعة إنارة لممر طويل أو مدخل عمارة يمكن التشغيل من ثلاثة أماكن بواسطة الضواغط.</p>`,ref:'ص 73–74'},
    {watch:String.raw`<p>النص في المثالين ٩ و١٠ يقول «يوضح الدائرة الخطية» فقط، بينما كل شكل فيه الخطية والتنفيذية. وتسمية الشكل <span class="ltr">(3-9)</span> ب مطبوعة أعلى ص 74 لا تحته.</p>`,fix:true},
    {tip:String.raw`<p>في التنفيذية لمفتاح صدمة التيار <b>ملف</b> (طرفاه <span class="ltr">A1</span> و<span class="ltr">A2</span>) و<b>تلامس</b> (طرفاه <span class="ltr">1</span> و<span class="ltr">2</span>). في الشكل دائرتان:</p><ul><li><b>دائرة التحكم:</b> L1 ← الضواغط الثلاثة (على التوازي) ← الملف ← L2.</li><li><b>دائرة القدرة:</b> L1 ← التلامس 1–2 ← المصابيح الأربعة (على التوازي) ← L2.</li></ul>`,title:'دائرتان في رسم واحد'},
    {add:String.raw`<p>الكتاب لا يشرح عمل هذا المفتاح: مع كل نبضة في ملفه يغيّر حالة تلامسه ويبقى عليها — ضغطة تُشعل وضغطة تُطفئ، من أي ضاغط. ولأن الضواغط تحمل تيار الملف الصغير فقط، يمكن وضع ضواغط كثيرة على التوازي في أماكن مختلفة.</p>`,title:'كيف يعمل؟'},
    {title:'مختبر مصغّر: ضغطة تُشعل وضغطة تُطفئ',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.f39,intro:'اضغط أي ضاغط ثم اتركه، ثم اضغط ضاغطاً آخر.',
     predict:{q:'المصابيح مطفأة. ضغطت الضاغط 1 ثم تركته، ثم ضغطت الضاغط 3 ثم تركته. ما حالة المصابيح الآن؟',opts:[
      ['مضيئة',false,'الضغطة الأولى أشعلت والثانية أطفأت.'],
      ['مطفأة',true,'كل ضغطة تقلب حالة التلامس: مطفأ ← مضيء ← مطفأ، من أي ضاغط.'],
      ['مضيئة ما دمت ضاغطاً فقط',false,'التلامس يبقى على حالته بعد ترك الضاغط.']]}})},
    {title:'مختبر مصغّر: تحكم أم قدرة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل جزء من الشكل (3-9) ب اختر الدائرة التي ينتمي إليها.',cats:['دائرة التحكم','دائرة القدرة'],items:[
 ['الضواغط الثلاثة.',0,'تعطي الملف نبضة عند الضغط.'],
 ['التلامس 1–2.',1,'يمر فيه تيار المصابيح.'],
 ['الملف A1–A2.',0,'يتغذى من الضواغط.'],
 ['المصابيح الأربعة.',1,'هي الحمل في دائرة القدرة.']]})}
   ]},

  {st:2,short:'مزمن الإضاءة',title:'١٠. مزمن الإضاءة',ref:'ص 74–75',
   q:'من يطفئ إنارة الدرج إذا نسيها السكان مضاءة؟',
   art:U3ST.art('الدائرة الخطية (3-10) أ: مزمن T على خطه الرقم 3، وثلاثة مصابيح، وثلاثة ضواغط','#F3E3C8',
    U3ST.fit(U3ST.lin(LIN.f310),[16,40,328,240],{vb:[0,10,300,215],
     hot:[[120,15,60,26,'المصدر / لوحة التوزيع.'],[140,100,20,20,'علبة التفريع.'],[18,40,24,34,'المزمن: مستطيل صغير قائم فيه الحرف ⟦T⟧.'],[16,80,28,24,'الرقم ⟦3⟧ = ثلاثة أسلاك إلى المزمن.'],[93,69,24,24,'مصباح ⟦⊗⟧.'],[183,69,24,24,'مصباح ⟦⊗⟧.'],[258,51,24,24,'مصباح ⟦⊗⟧.'],[74,174,20,20,'ضاغط ⟦⊙⟧.'],[140,188,20,20,'ضاغط ⟦⊙⟧.'],[206,174,20,20,'ضاغط ⟦⊙⟧.']]})),
   cap:'الشكل <span class="ltr">(3-10)</span> أ — المزمن T والضواغط والمصابيح.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي يميّز دائرة المزمن عن دائرة مفتاح صدمة التيار؟',opts:[
     ['المزمن يحتاج مفتاحاً وسطياً',false,'لا مفاتيح وسطية هنا؛ التشغيل بالضواغط.'],
     ['المزمن لا يعمل بالضواغط',false,'يعمل بالضواغط من أكثر من مكان.'],
     ['الإنارة تنطفئ وحدها بعد وقت محدد',true,'«…وتطفئ الإنارة بعد وقت محدد» (ص 74).']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-10) يوضح الدائرة الخطية لدائرة لتشغيل دائرة مزمن يشغل مجموعة إنارة لممر طويل أو مدخل عمارة يمكن التشغيل من أكثر من مكان بواسطة الضواغط وتطفئ الإنارة بعد وقت محدد.</p>`,ref:'ص 74–75'},
    {tip:String.raw`<p>للمزمن في <span class="ltr">(3-10)</span> ب ثمانية أطراف، المستعمل منها <span class="ltr">1</span> و<span class="ltr">2</span> و<span class="ltr">3</span> و<span class="ltr">7</span> فقط:</p><ul><li>الطرفان <b>1 و2</b> موصولان معاً بـ <b>L1</b>.</li><li>الطرف <b>3</b> يغذي المصابيح الثلاثة (وطرفها الآخر على <b>L2</b>).</li><li>الطرف <b>7</b> يذهب إلى الضواغط الثلاثة، وأطرافها الأخرى على <b>L2</b>.</li></ul><p>فالضغطة تصل الطرف 7 بـ L2 فيبدأ المزمن، ويصل الطرف 3 بـ L1 حتى ينتهي الوقت.</p>`,title:'أطراف المزمن'},
    {watch:String.raw`<p>ما يُرسم داخل المزمن في الرسوم التفاعلية (ملف وتلامس) تفسير لعمله؛ الكتاب يرسم المزمن صندوقاً بأطرافه فقط، ولا يذكر زمن الإطفاء.</p>`},
    {title:'مختبر مصغّر: مراحل المزمن',widget:(el,B)=>U3ST.mini(el,B,{bd:{sp:F.f310,loads:BD.f310.loads,states:[
      ['قبل الضغط',S=>{},'المزمن لا يعدّ: الطرف <b>3</b> بلا جهد، والمصابيح مطفأة.'],
      ['أثناء الضغط',S=>{S.pb.P1=1;S.tim=1;S.T=1},'<b>ضغطة:</b> الضاغط يصل الطرف <b>7</b> بـ <b>L2</b> فيبدأ المزمن، ويُغلق تلامسه الداخلي بين <b>2</b> و<b>3</b>: L1 ← الطرفان 1 و2 ← 3 ← المصابيح ← L2.'],
      ['بعد ترك الضاغط (الزمن يعدّ)',S=>{S.tim=0.55;S.T=1},'تُرك الضاغط، والمصابيح ما زالت مضيئة لأن المزمن يعدّ (الشريط أسفل المزمن). أي ضغطة جديدة تعيد العدّ من أوله.'],
      ['انتهى الزمن',S=>{},'انتهى الوقت المحدد: فتح المزمن تلامسه، فانطفأت المصابيح وحدها دون أن يضغط أحد شيئاً.']]},
     intro:'اضغط المراحل بالترتيب، وقارن مسار التيار في كل مرحلة.',
     predict:{q:'ضغطت الضاغط وتركته. متى تنطفئ المصابيح؟',opts:[
      ['فور ترك الضاغط',false,'هذا عمل الضاغط وحده مع الجرس؛ المزمن يُبقي الإنارة.'],
      ['بعد انتهاء الوقت المحدد، وحدها',true,'المزمن يُبقي الطرف 3 موصولاً بـ L1 حتى ينتهي الوقت.'],
      ['عند الضغطة التالية فقط',false,'هذا عمل مفتاح صدمة التيار.']]}})},
    {title:'مختبر مصغّر: صدمة التيار أم المزمن؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر الجهاز الذي ينطبق عليه.',cats:['مفتاح صدمة التيار','مزمن الإضاءة'],items:[
 ['الإنارة تبقى مضيئة حتى ضغطة جديدة.',0,'كل نبضة تقلب حالة التلامس ويبقى عليها.'],
 ['الإنارة تنطفئ وحدها بعد وقت محدد.',1,'نص الكتاب عن المزمن (ص 74).'],
 ['له ثمانية أطراف، المستعمل منها 1 و2 و3 و7.',1,'كما في الشكل (3-10) ب.'],
 ['له ملف A1–A2 وتلامس 1–2.',0,'كما في الشكل (3-9) ب.']]})}
   ]},

  {recap:[
   'مفتاح صدمة التيار (3-9): الضواغط على التوازي تعطي الملف A1–A2 نبضة، والتلامس 1–2 يغذي المصابيح الأربعة؛ ضغطة تُشعل وضغطة تُطفئ (ص 73–74).',
   'دائرة التحكم (الضواغط والملف) منفصلة عن دائرة القدرة (التلامس والمصابيح).',
   'المزمن (3-10): الطرفان 1 و2 على L1، والطرف 3 للمصابيح، والطرف 7 للضواغط؛ والإنارة تنطفئ وحدها بعد وقت محدد (ص 74–75).']}
],
 theory:[
  {h:'٩. مفتاح صدمة التيار',ref:'ص 73–74',html:'<p>الشكل (3-9) يوضح الدائرة الخطية لدائرة لتشغيل مفتاح صدمة تيار يشغل مجموعة إنارة لممر طويل أو مدخل عمارة يمكن التشغيل من ثلاثة أماكن بواسطة الضواغط.</p>'},
  {fig:'(3-9) أ',ref:'ص 73',caption:'يوضح الدائرة الخطية.',draw:()=>lFig(LIN.f39,300)},
  {fig:'(3-9) ب',ref:'ص 73–74',caption:'يوضح الدائرة التنفيذية.',draw:()=>xFig(F.f39)},
  {note:ADD+'رمز مفتاح صدمة التيار في الخطية مستطيل بداخله شكل «درجة»، وعلى خطه الرقم 4. في التنفيذية له <b>ملف</b> (طرفاه A1 وA2) و<b>تلامس</b> (طرفاه 1 و2). في الشكل دائرتان:<ul><li><b>دائرة التحكم:</b> L1 ← الضواغط الثلاثة (على التوازي) ← الملف ← L2. الضغطة تعطي الملف نبضة قصيرة.</li><li><b>دائرة القدرة:</b> L1 ← التلامس 1–2 ← المصابيح الأربعة (على التوازي) ← L2.</li></ul>مع كل نبضة يغيّر المفتاح حالة تلامسه ويبقى عليها: ضغطة تُشعل وضغطة تُطفئ، من أي ضاغط. الكتاب لا يشرح عمل هذا المفتاح.'},
  {h:'١٠. مزمن الإضاءة',ref:'ص 74–75',html:'<p>الشكل (3-10) يوضح الدائرة الخطية لدائرة لتشغيل دائرة مزمن يشغل مجموعة إنارة لممر طويل أو مدخل عمارة يمكن التشغيل من أكثر من مكان بواسطة الضواغط وتطفئ الإنارة بعد وقت محدد.</p>'},
  {fig:'(3-10) أ',ref:'ص 74',caption:'يوضح الدائرة الخطية.',draw:()=>lFig(LIN.f310,300)},
  {fig:'(3-10) ب',ref:'ص 75',caption:'يوضح الدائرة التنفيذية.',draw:()=>xFig(F.f310)},
  {note:ADD+'للمزمن في (3-10) ب ثمانية أطراف، المستعمل منها 1 و2 و3 و7 فقط. من الرسم: الطرفان <b>1 و2</b> موصولان معاً بـ <b>L1</b>؛ والطرف <b>3</b> يغذي المصابيح الثلاثة (وطرفها الآخر على <b>L2</b>)؛ والطرف <b>7</b> يذهب إلى الضواغط الثلاثة، وأطرافها الأخرى على <b>L2</b>. فالضغطة تصل الطرف 7 بـ L2 فيبدأ المزمن، ويصل الطرف 3 بـ L1 حتى ينتهي الوقت. ما رسمناه داخل المزمن (ملف وتلامس) تفسير لهذا العمل؛ الكتاب يرسم المزمن صندوقاً بأطرافه فقط، ولا يذكر زمن الإطفاء.'},
  {err:'النص في المثالين ٩ و١٠ يقول «يوضح الدائرة الخطية» فقط، بينما كل شكل فيه الخطية والتنفيذية. وتسمية الشكل (3-9) ب مطبوعة أعلى ص 74 لا تحته.'}
 ],
 lab:(el)=>board(el,[BD.f39,BD.f310]),
 examples:[
  drawEx({title:'رسم دائرة مفتاح صدمة التيار (3-9) ب',ref:'ص 73–74',q:'<p>ارسم الدائرة التنفيذية لمفتاح صدمة تيار يشغل أربعة مصابيح من ثلاثة أماكن بالضواغط، وميّز دائرة التحكم من دائرة القدرة.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: أربعة مصابيح، وثلاثة ضواغط، ومفتاح صدمة التيار (4 أسلاك).',LIN.f39,300)],sp:F.f39,
   steps:['نرسم <b>L1</b> و<b>L2</b>.','نرسم علبة التفريع، وعلب الضواغط الثلاثة، وعلبة مفتاح صدمة التيار (الملف A1–A2 والتلامس 1–2).','نرسم علب المصابيح الأربعة.',
    'دائرة التحكم (1): من <b>L1</b> إلى الطرف العلوي لكل ضاغط.','دائرة التحكم (2): الأطراف السفلية للضواغط تُجمع في عقدة واحدة.','دائرة التحكم (3): من العقدة إلى A2، ومن A1 إلى <b>L2</b>.',
    'نوصل <b>L2</b> إلى الطرف الأول لكل مصباح.','دائرة القدرة: من <b>L1</b> إلى الطرف 2 للتلامس، ومن الطرف 1 إلى عقدة المصابيح في علبة التفريع.','من هذه العقدة إلى الطرف الآخر لكل مصباح.']}),
  drawEx({title:'رسم دائرة مزمن الإضاءة (3-10) ب',ref:'ص 75',q:'<p>ارسم الدائرة التنفيذية لمزمن يشغل ثلاثة مصابيح من ثلاثة أماكن بالضواغط ويطفئها بعد وقت محدد.</p><p class="sub">ترتيب الخطوات توضيح للمتدرب — ليس من الكتاب.</p>',
   pre:[linStep('من الخطية: المزمن T (3 أسلاك)، وثلاثة مصابيح، وثلاثة ضواغط.',LIN.f310,300)],sp:F.f310,
   steps:['نرسم <b>L1</b> و<b>L2</b>.','نرسم المزمن بأطرافه الثمانية، وعلبة التفريع، وعلب الضواغط الثلاثة.','نرسم علب المصابيح الثلاثة.',
    'نصل الطرفين 1 و2 معاً ونوصلهما بـ <b>L1</b> عبر علبة التفريع.','من الطرف 3 سلك إلى عقدة في علبة التفريع، ومنها إلى طرف كل مصباح.','من <b>L2</b> إلى الطرف الآخر لكل مصباح.','من الطرف 7 سلك إلى علبة التفريع، ومنها إلى الطرف العلوي لكل ضاغط.','الأطراف السفلية للضواغط ترجع كلها إلى <b>L2</b>.']})],
 quiz:[
  {q:'ماذا يفعل مفتاح صدمة التيار عند كل ضغطة على أي ضاغط؟',o:['يُشعل الإنارة لمدة محددة','يغيّر حالة تلامسه: يُشعل إن كانت مطفأة ويُطفئ إن كانت مضيئة','يرن','يفصل القاطع'],c:1,e:'الحالة تبقى حتى الضغطة التالية.'},
  {q:'في (3-9) ب، تيار المصابيح يمر في:',o:['الضواغط','ملف المفتاح A1–A2','تلامس المفتاح 1–2','المزمن'],c:2,e:'الضواغط تحمل تيار الملف فقط.'},
  {q:'كيف وُصلت الضواغط الثلاثة في (3-9)؟',o:['على التوالي','على التوازي','كل ضاغط بمصباح','لا تتصل بـ L1'],c:1,e:'أي ضاغط منها يعطي الملف نبضة.'},
  {q:'ما الذي يميّز دائرة المزمن (3-10)؟',o:['الإنارة تنطفئ وحدها بعد وقت محدد','تحتاج مفتاحاً وسطياً','تعمل بلا ضواغط','الإنارة لا تنطفئ أبداً'],c:0,e:'هذا نص الكتاب (ص 74).'},
  {q:'أي أطراف المزمن مستعملة في الشكل (3-10) ب؟',o:['1 و2 و3 و7','3 و4 و5 و6','كل الأطراف','2 و8 فقط'],c:0,e:'الأطراف 4 و5 و6 و8 غير موصولة.'},
  {q:'إلى أين يذهب الطرف 7 للمزمن في (3-10) ب؟',o:['إلى المصابيح','إلى الضواغط','إلى L1 مباشرة','غير موصول'],c:1,e:'والطرف 3 هو الذي يغذي المصابيح.'}]
});

/* ============================== LESSON 6 ============================== */
const T312=()=>{const rows=C312.map((c,i)=>{const t=c.txt;const dProt=i===0||i>=4,dCond=i>=3;return `<tr><td>${i+1}</td><td>${t.load}</td><td class="ltr">${c.P}</td><td>${t.prot}</td><td class="${dProt?'diff':''}"><span class="ltr">${c.A}</span> — ${c.dev==='fuse'?'مصهر':'قاطع'}</td><td>${t.cond}</td><td class="${dCond?'diff':''}"><span class="ltr">${c.cab}</span>${c.m?` <span class="ltr">${c.m}</span>`:''}</td><td>${c.n}</td></tr>`}).join('');
 return `<div class="d3-tbl"><table class="d3t"><thead><tr><th>الدائرة</th><th>الحمل (النص)</th><th>القدرة في الشكل</th><th>الحماية (النص)</th><th>الحماية في الشكل</th><th>الموصل (النص)</th><th>الموصل في الشكل</th><th>عدد الموصلات في الشكل</th></tr></thead><tbody>${rows}</tbody></table></div>`};
function lab312(el){const st={main:false,cb:[1,1,1,1,1,1],trip:[0,0,0,0,0,0],use:[0,0,0,0,0,0],blown:false,n:0,trips:0,blows:0,msg:''};
 const en=i=>st.main&&st.cb[i]&&!(i===0&&st.blown)&&!chF('cbo'+i),run=i=>en(i)&&st.use[i];
 /* عطل مخفي (وضع التحدي فقط): قصر داخل حمل الدائرة i ⇐ يفصل قاطعها كلما اشتغل الحمل */
 const chSC=()=>{for(let i=1;i<6;i++)if(chF('sc'+i)&&st.main&&st.cb[i]&&!(i===0&&st.blown)&&st.use[i]){st.cb[i]=0;st.trip[i]=1;st.msg=`فصل قاطع الدائرة ${i+1}.`}};
 el.innerHTML=`<div class="d3"><div class="grid"><div class="panel c12"><h2>لوحة التوزيع للوحدة السكنية <span class="ref">مبنية على الشكل (3-12) ص 78</span></h2>
  <div class="svgbox d3" id="b312" style="max-width:660px;margin-inline:auto"></div>
  <div class="d3-key"><span><i class="l"></i>موصول بالتغذية ولا يمر تيار</span><span><i class="f"></i>يمر تيار</span><span><i></i>بلا جهد</span></div>
  <p class="sub">اضغط على المفتاح الرئيس أو على قاطع أي دائرة في الرسم لتفصله أو توصله، واضغط على رمز الحمل لتشغيله أو إيقافه. أو استعمل الجدول تحت الرسم.</p>
  <div class="d3-ctl"><button class="sw" data-q="main" aria-pressed="false"><span class="knob"></span><b>Q0</b><small>المفتاح الرئيس</small></button>
   <label class="sub">أحدث قصراً في الدائرة <select id="fsel">${C312.map((c,i)=>`<option value="${i}">${i+1} — ${c.name}</option>`).join('')}</select></label><button class="btn warn" id="fbtn">قصر في الدائرة</button></div>
  <div class="d3-path" id="b312p"></div></div>
  <div class="panel c12"><h2>الدوائر الست</h2><div class="d3-tbl" id="b312t"></div></div>
  <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="b312s"></ol></div></div></div>`;
 const $=s=>el.querySelector(s);
 const steps=stepsUI($('#b312s'),[
  {t:'شغّل المفتاح الرئيس',x:'يصبح قضيب التوزيع موصولاً بالتغذية (برتقالياً)، ولا يمر تيار لأن الأحمال كلها متوقفة.',done:()=>st.main},
  {t:'شغّل المصابيح (الدائرة 2)',x:'اضغط رمز المصباح × أو زر «تشغيل الحمل» في الجدول. يمر التيار من التغذية عبر العداد والمفتاح الرئيس والقاطع 10A إلى المصابيح، ويدور العداد.',done:()=>run(1)},
  {t:'افصل قاطع الدائرة 2 وحده',x:'تنطفئ المصابيح وحدها، وتبقى بقية الدوائر موصولة: لكل دائرة جهاز حمايتها.',done:()=>st.main&&!st.cb[1]},
  {t:'أحدث قصراً في دائرة المقابس (3)',x:'أعد توصيل القاطع 2، ثم اختر الدائرة 3 واضغط «قصر في الدائرة». يفصل قاطعها وحده.',done:()=>st.trip[2]},
  {t:'أعد توصيل القاطع بعد إزالة العطل',x:'اضغط على القاطع 3 ليرجع.',done:()=>st.cb[2]&&!st.trip[2]&&st.trips>0},
  {t:'جرّب الدائرة 1 (المحرك)',x:'شغّل المحرك ثم أحدث قصراً في الدائرة 1: المصهر يحترق ولا يرجع بالضغط؛ يجب استبداله.',done:()=>st.blows>0},
  {t:'افصل المفتاح الرئيس',x:'تنقطع التغذية عن الدوائر الست معاً.',done:()=>!st.main&&st.n>6}]);
 const paint=()=>{$('#b312').innerHTML=board312(st,true);
  $('[data-q="main"]').setAttribute('aria-pressed',String(st.main));
  $('#b312t').innerHTML=`<table class="d3t"><thead><tr><th>الدائرة</th><th>الحمل</th><th>جهاز الحماية</th><th>تشغيل الحمل</th><th>الحالة</th></tr></thead><tbody>${C312.map((c,i)=>`<tr class="${run(i)?'on':''}"><td>${i+1}</td><td>${c.name}</td><td>${c.dev==='fuse'?(st.blown?'<button class="btn" data-q="fix">استبدل المصهر</button>':`مصهر <span class="ltr">${c.A}</span> — سليم`):`<button class="sw" data-q="cb${i}" aria-pressed="${!!st.cb[i]}"><span class="knob"></span><b>${c.A}</b><small>${st.trip[i]?'فصل بسبب عطل':st.cb[i]?'موصول':'مفصول'}</small></button>`}</td><td><button class="sw" data-q="use${i}" aria-pressed="${!!st.use[i]}"><span class="knob"></span><small>${st.use[i]?'يعمل':'متوقف'}</small></button></td><td>${run(i)?'يمر تيار':en(i)?'موصول بالتغذية':'بلا جهد'}</td></tr>`).join('')}</tbody></table>`;
  const on=C312.map((c,i)=>run(i)?c.name:null).filter(Boolean);
  $('#b312p').innerHTML=(st.msg?`<b>${st.msg}</b><br>`:'')+(!st.main?'المفتاح الرئيس مفصول: الخط من التغذية حتى المفتاح الرئيس موصول (والعداد قبله)، وكل ما بعده بلا جهد.':on.length?'يمر التيار: <b>التغذية ← العداد ← المفتاح الرئيس ← قضيب التوزيع ←</b> '+on.join('، ')+'. ويدور العداد.':'قضيب التوزيع موصول بالتغذية، لكن لا يعمل أي حمل، فلا يمر تيار ولا يدور العداد.');
  steps.check()};
 const act=q=>{st.msg='';if(q==='main')st.main=!st.main;else if(q==='fix'){st.blown=false;st.msg='استُبدل المصهر.'}
  else if(q.startsWith('cb')){const i=+q.slice(2);if(i===0){if(st.blown){st.blown=false;st.msg='استُبدل المصهر.'}else st.msg='الدائرة 1 محمية بمصهر، لا يُفصل ويوصل مثل القاطع.'}else{if(st.trip[i]){st.trip[i]=0;st.cb[i]=1}else st.cb[i]=st.cb[i]?0:1}}
  else if(q.startsWith('use')){const i=+q.slice(3);st.use[i]=st.use[i]?0:1}
  st.n++;chSC();paint()};
 el.addEventListener('click',e=>{const t=e.target.closest('[data-q]');if(t){act(t.dataset.q||t.getAttribute('data-q'));return}
  if(e.target.closest('#fbtn')){const i=+$('#fsel').value;if(!en(i)){st.msg=`الدائرة ${i+1} بلا جهد الآن، فلا يمر تيار قصر.`}else if(i===0){st.blown=true;st.blows++;st.msg='قصر في الدائرة 1: احترق المصهر وفصل الدائرة وحدها.'}else{st.cb[i]=0;st.trip[i]=1;st.trips++;st.msg=`قصر في الدائرة ${i+1}: فصل قاطعها وحده، وبقيت الدوائر الأخرى تعمل.`}st.n++;paint()}});
 paint();}
B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'76–78',
 title:'لوحات التوزيع المنزلية',
 summary:'مخطط التركيبات لوحدة سكنية على مسقط الأرضية (3-11)، وتقسيمها إلى ست دوائر كهربائية، ومخطط لوحة توزيعها (3-12): العداد، والمفتاح الرئيس، وقضيب التوزيع، وجهاز حماية لكل دائرة.',
 stations:[
  {intro:true},

  {st:1,short:'مخطط التركيبات',title:'٣-٥ لوحات التوزيع المنزلية — مخطط التركيبات',ref:'ص 76',
   q:'المهندس المعماري رسم مواضع المصابيح والمقابس… فمن أين يعرف الفني نوع الموصل وطريق تمديده؟',
   art:U3ST.art('مسقط مبسط لوحدة سكنية من أربع غرف وبهو، في كل غرفة مصباح ومفتاح ومقابس','#E4EEDC',
    `<path d="M40 60H320V262H40Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="4"/><path d="M150 60V150M40 150H320M130 150V262M232 150V262" stroke="#2C4A40" stroke-width="3"/>`
    +[[95,105],[85,206],[181,206],[276,206]].map(p=>`<g data-tip="مصباح في السقف: علامة ⟦×⟧ موصولة بنقطة تفرع. في الشكل (3-11) مصباح في كل غرفة."><circle cx="${p[0]}" cy="${p[1]}" r="11" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M${p[0]-7} ${p[1]-7}l14 14m0 -14l-14 14" stroke="#2C4A40" stroke-width="2"/></g>`).join('')
    +[[140,138],[120,168],[222,168],[310,168]].map(p=>`<g data-tip="مفتاح بجوار الباب؛ والرقم بجانب الشرطة على خطه في الكتاب = عدد الموصلات (3، أو 4 لمفتاح غرفة الطفل)."><circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M${p[0]+3} ${p[1]-3}l9 -9l3 3" fill="none" stroke="#2C4A40" stroke-width="2"/></g>`).join('')
    +[[70,62],[120,62],[60,260],[180,260],[300,260]].map(p=>`<g data-tip="مقبس (مأخذ تيار) على الجدار: قوس صغير بساق."><path d="M${p[0]-8} ${p[1]+(p[1]<100?10:-2)}a8 8 0 0 1 16 0" fill="none" stroke="#C8701E" stroke-width="2.6"/></g>`).join('')
    +`<g data-tip="خطوط الموصلات: يُكتب عليها نوع الموصل ومقطعه، مثل ⟦H07 V-R Cu 2,5²⟧ (موصل نحاسي معزول مقطعه ⟦2.5 mm²⟧) — وهذا ما لا تبينه مخططات الأرضية المعمارية عادة."><path d="M95 116V196M96 206H170M192 206H265" stroke="#4FB3A9" stroke-width="2.6" fill="none"/></g>`
    +U3ST.at(95,84,'غرفة أكل',12,1)+U3ST.at(236,108,'بهو',13,1)+U3ST.at(85,240,'جلوس',12,1)+U3ST.at(181,240,'الوالدين',12,1)+U3ST.at(276,240,'الطفل',12,1)
    +U3ST.at(180,294,'المواضع + طرق التمديد + الدوائر',13,1)),
   cap:'مسقط مبسط للفكرة؛ الشكل <span class="ltr">(3-11)</span> نفسه في المختبر المصغّر تحت.<br><b>مرّر المؤشر على المصابيح والمفاتيح والمقابس والخط الأخضر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يجب أن يُضاف إلى مخطط التركيبات مخطط آخر؟',opts:[
     ['لأن مخططات الأرضية غالباً لا تبين إلا مواضع الأجهزة والمفاتيح والمقابس، ونحتاج طرق تمديد الموصلات وأنواعها وتوزيعها على الدوائر',true,'هذا نص الكتاب (ص 76).'],
     ['لتحديد ألوان الجدران',false,'لا علاقة للمخطط الكهربائي بالألوان.'],
     ['لحساب مساحة الغرف فقط',false,'المساحة من المسقط المعماري؛ المطلوب بيانات التنفيذ الكهربائي.']]}}
   ],
   body:[
    {book:String.raw`<p>إن مسار الخطوط وطرق تمديدها لا تحظى عادة بأهمية كبيرة لدى المهندسين المعماريين ومقاولي البناء، وغالباً لا ترسم في مخططات الأرضية إلا مواضع الأجهزة والمفاتيح والمقابس ومآخذ التيار في الجدران والأسقف، لذا يجب أن يضاف إلى مخطط التركيبات مخطط يمكن أن تستخرج منه البيانات الضرورية للتنفيذ، مثل طرق تمديد الموصلات وأنواعها والتوزيع على الدوائر الكهربائية المختلفة.</p><p>والشكل (3-11) يوضح مخطط التركيبات الكهربائية في مخطط الأرضية لوحدة سكنية لأسرة صغيرة مكونة من أربع غرف؛ غرفة جلوس وغرفة طعام وغرفة طفل وغرفة للوالدين.</p>`,ref:'ص 76'},
    {watch:String.raw`<p>الإحالة في الكتاب «الشكل (٢- ٧)» صحيحها <span class="ltr">(3-11)</span>، فكتبناها كذلك.</p>`,fix:true},
    {tip:String.raw`<p>على الشكل <span class="ltr">(3-11)</span>: × مصباح في سقف كل غرفة، ورمز المفتاح بجوار الأبواب، والقوس الصغير مقبس على الجدار، والرقم بجوار الشرطة عدد الموصلات. والكتابة على الخطوط نوع الموصل ومقطعه، مثل <span class="ltr">H07 V-R Cu 2,5²</span>. والكتاب لا يشرح الاختصارات <span class="ltr">mo</span> و<span class="ltr">m°</span> و<span class="ltr">H07 V-R</span> و<span class="ltr">NYM</span>.</p>`,title:'كيف تقرأ مخطط التركيبات؟'},
    {title:'مختبر مصغّر: اقرأ المسقط (3-11)',widget:(el,B)=>U3ST.find(el,B,{intro:'هذا إعادة رسم مبسطة للشكل (3-11) (الشكل في الكتاب ممسوح بدقة منخفضة ومواضع الرموز تقريبية). اقرأ السؤال ثم اضغط على المطلوب.',svg:plan311(),mw:560,
     reg:{din:[104,72,32,30,'مصباح غرفة الأكل'],cab:[102,106,18,92,'كتابة نوع الموصل على خط غرفة الأكل'],swd:[188,118,30,32,'مفتاح غرفة الأكل'],liv:[106,246,28,30,'مصباح غرفة الجلوس'],rail:[22,206,28,106,'قضيب تيار مع ثلاثة مصابيح متنقلة'],par:[286,246,28,30,'مصباح غرفة الوالدين'],chl:[451,246,28,30,'مصباح غرفة الطفل'],swc:[418,180,32,32,'مفتاح غرفة الطفل'],sock:[514,214,24,28,'مقبس في غرفة الطفل'],north:[482,58,40,42,'رمز اتجاه الشمال'],feed:[502,104,28,62,'الخطان الصاعدان إلى خارج الشقة']},
     asks:[['din','اضغط على <b>مصباح السقف في غرفة الأكل</b>.','علامة × في وسط الغرفة، تحتها نقطة التفرع.'],
      ['swc','اضغط على <b>مفتاح غرفة الطفل</b> (على خطه الرقم 4).','الرقم بجانب الشرطة عدد الموصلات.'],
      ['rail','اضغط على <b>قضيب التيار مع ثلاثة مصابيح متنقلة</b> في غرفة الجلوس.','ثلاثة مصابيح على خط رأسي على الجدار الأيسر.'],
      ['cab','اضغط على <b>الكتابة التي تبين نوع الموصل ومقطعه</b> على خط غرفة الأكل.','«mo H07 V-R Cu 2,5²» — موصل نحاسي معزول مقطعه 2.5 mm².'],
      ['north','اضغط على <b>رمز اتجاه الشمال</b>.','دائرة يقطعها خط، وسهم بجانبه الحرف N.']]})}
   ]},

  {st:2,short:'الدوائر الست',title:'الخط الرئيس وتقسيم الوحدة السكنية إلى ست دوائر',ref:'ص 76–77',
   q:'لماذا لا تُغذّى كل أجهزة الشقة من دائرة واحدة؟',
   art:U3ST.art('لوحة التوزيع في الوسط تتفرع منها ست دوائر: محرك، مصابيح، مقابس، مكيف، فرن، سخان','#DCE9F2',
    `<g data-tip="لوحة التوزيع للوحدة السكنية: منها تخرج الدوائر الست، ولكل دائرة جهاز حمايتها."><rect x="150" y="122" width="60" height="76" rx="6" fill="#9CC5D9" stroke="#2C4A40" stroke-width="2.5"/><path d="M158 140H202" stroke="#2C4A40" stroke-width="4"/></g>`
    +[[70,80,'1','الدائرة الأولى: محرك ثلاثي الأوجه ⟦2.2 Kw⟧، خط نحاسي مغلف (موصل فوق الحائط أو البياض) ⟦2.5 mm²⟧، ٣ مصاهر معدلها ٢٠ أمبير.','M'],
      [180,62,'2','الدائرة الثانية: مصابيح كهربائية، موصلات نحاسية معزولة ⟦2.5 mm²⟧ في ماسورة تركيبات تحت البياض، مفتاح وقاية موصلات معدله ١٠ أمبير.','x'],
      [290,80,'3','الدائرة الثالثة: مقابس كهربائية، نفس تركيبات الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.','s'],
      [290,240,'4','الدائرة الرابعة: جهاز تكييف للهواء ⟦4.5 kW⟧ ونفس الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.','a'],
      [180,258,'5','الدائرة الخامسة: فرن كهربائي قدرته الكلية ⟦7.5 kW⟧، موصلات نحاسية معزولة ⟦6.5 mm²⟧ تحت البياض (داخل الحائط)، ثلاثة مفاتيح وقاية موصلات معدلها ٣٥ أمبير.','o'],
      [70,240,'6','الدائرة السادسة: سخان كهربائي ⟦4 kW⟧، موصلات نحاسية معزولة داخل الحائط، ثلاثة مفاتيح وقاية موصلات معدلها ٢٠ أمبير.','h']].map(c=>{const [x,y,n,t,k]=c;
      const ic=k==='M'?`<circle cx="${x}" cy="${y}" r="18" fill="#D4EEDD" stroke="#2C4A40" stroke-width="2.2"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">M</text>`
       :k==='x'?`<circle cx="${x}" cy="${y}" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><path d="M${x-10} ${y-10}l20 20m0 -20l-20 20" stroke="#2C4A40" stroke-width="2.2"/>`
       :k==='s'?`<rect x="${x-18}" y="${y-18}" width="36" height="36" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><circle cx="${x-6}" cy="${y}" r="3.5" fill="#2C4A40"/><circle cx="${x+6}" cy="${y}" r="3.5" fill="#2C4A40"/>`
       :k==='a'?`<rect x="${x-20}" y="${y-16}" width="40" height="32" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><path d="M${x-14} ${y+6}H${x+14}M${x-14} ${y+11}H${x+14}" stroke="#2C4A40" stroke-width="1.6"/><text x="${x}" y="${y+2}" text-anchor="middle" font-size="16" fill="#2F6FB0">*</text>`
       :k==='o'?`<rect x="${x-18}" y="${y-18}" width="36" height="36" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><circle cx="${x}" cy="${y-7}" r="4" fill="#E8735A"/><circle cx="${x-7}" cy="${y+6}" r="4" fill="#E8735A"/><circle cx="${x+7}" cy="${y+6}" r="4" fill="#E8735A"/>`
       :`<rect x="${x-14}" y="${y-20}" width="28" height="40" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><path d="M${x-6} ${y+4}h12" stroke="#C0392B" stroke-width="3"/>`;
      return `<path d="M180 160L${x} ${y}" stroke="#C8701E" stroke-width="2.4" stroke-dasharray="5 4"/><g data-tip="${t}">${ic}</g><circle cx="${x+(x<180?-22:x>180?22:24)}" cy="${y-16}" r="9" fill="#2C4A40"/><text x="${x+(x<180?-22:x>180?22:24)}" y="${y-12}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#FBF6EE">${n}</text>`}).join('')
    +`<rect x="150" y="122" width="60" height="76" rx="6" fill="#9CC5D9" stroke="#2C4A40" stroke-width="2.5" pointer-events="none"/><path d="M158 140H202" stroke="#2C4A40" stroke-width="4"/>`+U3ST.at(180,172,'اللوحة',12,1)),
   cap:'ست دوائر، لكل منها حمل وموصل وجهاز حماية.<br><b>مرّر المؤشر على كل جهاز (أو المسه في الجوال) لتقرأ بيانات دائرته من الكتاب.</b>',
   side:[
    {predict:{q:'ما الذي يجب معرفته قبل تصميم لوحة التوزيع للوحدة السكنية؟',opts:[
     ['كل التجهيزات الكهربائية المطلوبة داخلها والأجهزة المستخدمة',true,'«…يجب معرفة كل التجهيزات الكهربائية المطلوبة داخلها وكذلك الأجهزة الكهربائية المستخدمة» (ص 77)، ثم تُقسم الوحدة إلى دوائر.'],
     ['عدد الأبواب والنوافذ',false,'هذا من المسقط المعماري، ولا يحدد الدوائر.'],
     ['لون الكابلات فقط',false,'اللون لا يحدد عدد الدوائر ولا أجهزة حمايتها.']]}}
   ],
   body:[
    {book:String.raw`<p>ويراعى تركيب خط رئيس من خارج المبنى إلى داخله سواء أكان الخط الرئيس خارج المبنى سلكاً هوائياً أو كابلاً مدفوناً تحت الأرض على أن يوزع هذا الخط الرئيس إلى جميع الوحدات السكنية في جميع الأدوار.</p><p>ولتصميم لوحة التوزيع الخاصة بالوحدة السكنية يجب معرفة كل التجهيزات الكهربائية المطلوبة داخلها وكذلك الأجهزة الكهربائية المستخدمة، ويتم بعد ذلك تقسيم الوحدة السكنية إلى عدد من الدوائر الكهربائية اللازمة (كل دائرة كهربائية على عدد من المصابيح والمقابس والأجهزة).</p><p>في الوحدة السكنية المبينة في شكل (3-11) تم تقسيمها إلى ست دوائر كهربائية وبياناتها كالتالي:</p><ul><li><b>الدائرة الأولى:</b> دائرة محرك ثلاثي الأوجه <span class="ltr">2.2 Kw</span>، خط نحاسي مغلف (موصل فوق الحائط أو البياض) <span class="ltr">2.5 mm²</span>، ٣ مصاهر معدلها ٢٠ أمبير.</li><li><b>الدائرة الثانية:</b> دائرة مصابيح كهربائية، موصلات نحاسية معزولة <span class="ltr">2.5 mm²</span> في ماسورة تركيبات تحت البياض، مفتاح وقاية موصلات معدله ١٠ أمبير.</li><li><b>الدائرة الثالثة:</b> دائرة مقابس كهربائية نفس تركيبات الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.</li><li><b>الدائرة الرابعة:</b> دائرة جهاز تكييف للهواء <span class="ltr">4.5 kW</span> ونفس الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.</li><li><b>الدائرة الخامسة:</b> دائرة فرن كهربائي قدرته الكهربائية الكلية <span class="ltr">7.5 kW</span>، موصلات نحاسية معزولة <span class="ltr">6.5 mm²</span> في ماسورة تركيبات تحت البياض (داخل الحائط)، ثلاثة مفاتيح وقاية موصلات معدلها ٣٥ أمبير.</li><li><b>الدائرة السادسة:</b> دائرة سخان كهربائي <span class="ltr">4 kW</span>، موصلات نحاسية معزولة داخل الحائط، ثلاثة مفاتيح وقاية موصلات معدلها ٢٠ أمبير.</li></ul>`,ref:'ص 76–77'},
    {tip:String.raw`<p>كل دائرة لها <b>حملها</b> و<b>موصلها</b> و<b>جهاز حمايتها</b>. لذلك إذا حدث عطل في دائرة فصل جهاز حمايتها وحدها، وبقيت الدوائر الأخرى تعمل. لاحظ أن الأحمال الكبيرة (الفرن) لها أكبر معدل حماية وأكبر مقطع موصل.</p>`,title:'لماذا دوائر منفصلة؟'},
    {title:'مختبر مصغّر: جهاز الحماية لكل دائرة',widget:(el,B)=>DCML.sort(el,B,{intro:'بحسب نص الكتاب (ص 77)، ما جهاز الحماية لكل دائرة؟',cats:['مصاهر','مفتاح (مفاتيح) وقاية موصلات'],items:[
 ['الدائرة الأولى: المحرك ثلاثي الأوجه.',0,'«٣ مصاهر معدلها ٢٠ أمبير».'],
 ['الدائرة الثانية: المصابيح.',1,'«مفتاح وقاية موصلات معدله ١٠ أمبير».'],
 ['الدائرة الخامسة: الفرن.',1,'«ثلاثة مفاتيح وقاية موصلات معدلها ٣٥ أمبير».'],
 ['الدائرة السادسة: السخان.',1,'«ثلاثة مفاتيح وقاية موصلات معدلها ٢٠ أمبير».']]})},
    {title:'تحقق سريع: أرقام الدوائر',widget:(el,B)=>DCML.cases(el,B,{cases:[
 {q:'ما معدل مفتاح وقاية دائرة المصابيح؟',opts:[['20 أمبير',false,'هذا معدل دائرة المقابس.'],['10 أمبير',true,'الدائرة الثانية: ١٠ أمبير.'],['35 أمبير',false,'هذا للفرن.']]},
 {q:'أي دائرة لها أكبر مقطع موصل في النص؟',opts:[['الخامسة (الفرن) 6.5 mm²',true,'أكبر حمل (7.5 kW) يحتاج أكبر مقطع.'],['الأولى (المحرك) 2.5 mm²',false,'2.5 mm² هو مقطع الدوائر 1 و2 و3.'],['السادسة (السخان)',false,'النص لا يذكر مقطعاً للسادسة.']]}]})}
   ]},

  {st:3,short:'مخطط لوحة التوزيع',title:'مخطط التوزيع للوحدة السكنية — الشكل (3-12)',ref:'ص 77–78',
   q:'من أين يدخل التيار إلى الشقة، وبأي ترتيب يمر قبل أن يصل إلى أي دائرة؟',
   art:U3ST.art('التغذية ثم العداد ثم المفتاح الرئيس ثم قضيب التوزيع ومنه ست دوائر','#F3E3C8',
    `<g data-tip="التغذية: ثلاثية الأوجه بموصل محايد ⟦3/N ~ 60Hz⟧ بجهد ⟦220/127v⟧، وعلى خطها شرطة بجانبها ⟦4⟧ = أربعة موصلات."><path d="M180 30V62" stroke="#C8701E" stroke-width="4"/><path d="M172 44l16 -8" stroke="#2C4A40" stroke-width="2"/></g>`
    +`<text x="196" y="40" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">220/127v</text><text x="196" y="56" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">3/N ~ 60Hz</text>`
    +`<g data-tip="العداد ⟦KWh 3~⟧: يقيس الطاقة التي تستهلكها الوحدة كلها. يأتي مباشرة بعد التغذية."><rect x="154" y="62" width="52" height="46" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><rect x="154" y="62" width="52" height="11" fill="#EDE3D2" stroke="#2C4A40" stroke-width="1.6"/><text x="180" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" font-family="var(--mono)">KWh</text></g>`
    +`<g data-tip="المفتاح الرئيس: يفصل الوحدة كلها عن التغذية. يأتي بعد العداد وقبل قضيب التوزيع."><path d="M180 108V122M180 150V160" stroke="#C8701E" stroke-width="4"/><path d="M180 150L166 126" stroke="#2C4A40" stroke-width="3.5"/><circle cx="180" cy="122" r="3.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="150" r="3.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g>`
    +`<g data-tip="قضيب التوزيع: الخط السميك الأفقي؛ تتفرع منه الدوائر الست."><path d="M50 166H310" stroke="#2C4A40" stroke-width="7"/></g>`
    +[0,1,2,3,4,5].map(i=>{const x=60+i*48,P=['20A','10A','20A','20A','35A','20A'][i],L=['محرك','مصابيح','مقابس','مكيف','فرن','سخان'][i];
      return `<g data-tip="الدائرة ${i+1} (${L}): جهاز حمايتها ${i===0?'مصهر':'قاطع (مفتاح وقاية موصلات)'} معدله ⟦${P}⟧ في الشكل، ثم موصلاتها، ثم رمز الحمل وقدرته ورقم الدائرة."><path d="M${x} 166V186M${x} 212V250" stroke="#2C4A40" stroke-width="2.4"/>${i===0?`<path d="M${x} 186V212" stroke="#2C4A40" stroke-width="2.4"/><rect x="${x-5}" y="188" width="10" height="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/>`:`<path d="M${x} 212L${x+11} 190" stroke="#2C4A40" stroke-width="2.4"/><circle cx="${x}" cy="186" r="2.6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="${x}" cy="212" r="2.6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/>`}<circle cx="${x}" cy="262" r="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="${x}" y="266.5" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">${i+1}</text></g>`
       +`<text x="${x-6}" y="232" text-anchor="end" font-size="10" fill="#2C4A40" font-family="var(--mono)">${P}</text>`}).join('')
    +U3ST.at(118,92,'العداد',12,1)+U3ST.at(128,142,'المفتاح الرئيس',11.5,1)+U3ST.at(180,298,'قضيب التوزيع ومنه ست دوائر',13,1)),
   cap:'ترتيب اللوحة من التغذية إلى الدوائر (رسم مبسط للشكل <span class="ltr">(3-12)</span>).<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'ماذا يأتي مباشرة بعد العداد في الشكل (3-12)؟',opts:[
     ['قضيب التوزيع',false,'القضيب بعد المفتاح الرئيس.'],
     ['قاطع دائرة المصابيح',false,'قواطع الدوائر تتفرع من القضيب.'],
     ['المفتاح الرئيس',true,'التغذية ← العداد ← المفتاح الرئيس ← قضيب التوزيع ← الدوائر الست.']]}}
   ],
   body:[
    {book:String.raw`<p>ويبين الشكل (3-12) لوحة التوزيع الخاصة بالوحدة السكنية. ويمكن أن يحتوي مخطط التوزيع على بيانات أخرى، مثل الأطوال الكلية للدوائر الكهربائية، والغرف التي تتغذى من هذه الدوائر....إلخ.</p>`,ref:'ص 77'},
    {watch:String.raw`<p>الإحالة في الكتاب «الشكل (٢- ١٢)» صحيحها <span class="ltr">(3-12)</span>، وكُتب «ستة دوائر» والصحيح «ست دوائر»، فكتبناهما كذلك.</p>`,fix:true},
    {tip:String.raw`<p>اقرأ الشكل <span class="ltr">(3-12)</span> من اليسار: التغذية <span class="ltr">3/N ~ 60Hz</span> بجهد <span class="ltr">220/127v</span> وأربعة موصلات، ثم <b>العداد</b> <span class="ltr">KWh 3~</span>، ثم <b>المفتاح الرئيس</b>، ثم <b>قضيب التوزيع</b> (الخط السميك)، ومنه ست دوائر. لكل دائرة جهاز حمايتها مكتوب بجانبه معدله، ثم عدد موصلاتها ونوعها ومقطعها، ثم رمز الحمل وقدرته ورقم الدائرة.</p>`,title:'من اليسار إلى اليمين'},
    {title:'مختبر مصغّر: اقرأ المخطط (3-12)',widget:(el,B)=>U3ST.find(el,B,{intro:'اقرأ السؤال ثم اضغط على الجزء المطلوب في مخطط التوزيع.',svg:board312(null,false),mw:660,
     reg:{bus:[20,124,620,16,'قضيب التوزيع'],sup:[16,36,98,56,'التغذية وبياناتها'],kwh:[118,32,60,68,'العداد'],ms:[252,80,64,42,'المفتاح الرئيس'],f1:[50,150,40,42,'مصهر الدائرة 1'],c2:[150,150,40,42,'قاطع الدائرة 2'],c5:[450,150,40,42,'قاطع الدائرة 5'],m1:[50,252,40,40,'رمز المحرك'],l2:[150,252,40,40,'رمز المصابيح'],o5:[450,252,40,40,'رمز الفرن']},
     asks:[['kwh','اضغط على <b>العداد</b>.','مستطيل مكتوب فيه KWh و3~، بعد التغذية مباشرة.'],
      ['ms','اضغط على <b>المفتاح الرئيس</b>.','بعد العداد وقبل قضيب التوزيع.'],
      ['bus','اضغط على <b>قضيب التوزيع</b>.','الخط السميك الذي تتفرع منه الدوائر الست.'],
      ['f1','اضغط على <b>جهاز حماية دائرة المحرك</b>.','مصهر 20A — الدائرة الوحيدة المحمية بمصهر.'],
      ['c5','اضغط على <b>جهاز حماية دائرة الفرن</b>.','قاطع 35A — أكبر معدل في اللوحة.']]})},
    {title:'نشاط قراءة: النص مقابل الشكل',widget:(el,B)=>{el.innerHTML='<p class="sub" style="margin:0 0 6px">بيانات كل دائرة من النص (ص 77) بجانب ما كُتب في الشكل (3-12). الخانات الملوّنة فيها اختلاف — اقرأ «انتبه» تحت الجدول.</p>'+T312()}},
    {watch:String.raw`<p>بين النص والشكل <span class="ltr">(3-12)</span> فروق: الدائرة الخامسة في النص <span class="ltr">6.5 mm²</span> وفي الشكل <span class="ltr">Cu 6²</span> (والمقاس القياسي <span class="ltr">6 mm²</span>)؛ الدائرة الرابعة في النص «نفس الدائرة الثانية» (أي <span class="ltr">2.5 mm²</span>) وفي الشكل <span class="ltr">Cu 4²</span>؛ الدائرة السادسة بلا مقطع في النص وفي الشكل <span class="ltr">Cu 4²</span>؛ الدائرة الأولى «٣ مصاهر» والشكل يرسم مصهراً واحداً بجانبه 3، والدائرتان الخامسة والسادسة «ثلاثة مفاتيح وقاية» والشكل يرسم قاطعاً واحداً لكل منهما — وهذا مقبول في الرسم أحادي الخط. والقدرتان <span class="ltr">1000w</span> و<span class="ltr">3.3 Kw</span> للدائرتين 2 و3 في الشكل فقط.</p>`,fix:true}
   ]},

  {recap:[
   'مخططات الأرضية لا تبين غالباً إلا المواضع، فيُضاف مخطط يبين طرق تمديد الموصلات وأنواعها والتوزيع على الدوائر (ص 76).',
   'لتصميم لوحة الوحدة نعرف كل التجهيزات والأجهزة، ثم نقسم الوحدة إلى دوائر؛ والوحدة في (3-11) ست دوائر (ص 77).',
   'لكل دائرة حمل وموصل وجهاز حماية: مصاهر 20 A للمحرك، وقواطع 10 A للمصابيح و35 A للفرن… (ص 77).',
   'مخطط التوزيع (3-12): التغذية ← العداد ← المفتاح الرئيس ← قضيب التوزيع ← الدوائر الست (ص 78).']}
],
 theory:[
  {h:'٣-٥ لوحات التوزيع المنزلية',ref:'ص 76',html:'<p>إن مسار الخطوط وطرق تمديدها لا تحظى عادة بأهمية كبيرة لدى المهندسين المعماريين ومقاولي البناء، وغالباً لا ترسم في مخططات الأرضية إلا مواضع الأجهزة والمفاتيح والمقابس ومآخذ التيار في الجدران والأسقف، لذا يجب أن يضاف إلى مخطط التركيبات مخطط يمكن أن تستخرج منه البيانات الضرورية للتنفيذ، مثل طرق تمديد الموصلات وأنواعها والتوزيع على الدوائر الكهربائية المختلفة.</p><p>والشكل (3-11) يوضح مخطط التركيبات الكهربائية في مخطط الأرضية لوحدة سكنية لأسرة صغيرة مكونة من أربع غرف؛ غرفة جلوس وغرفة طعام وغرفة طفل وغرفة للوالدين.</p>'},
  {fig:'(3-11)',ref:'ص 76',caption:'مخطط التركيبات لوحدة سكنية في مخطط الأرضية للمبنى (إعادة رسم مبسطة: الشكل في الكتاب ممسوح بدقة منخفضة، ومواضع الرموز تقريبية).',draw:()=>`<div class="svgbox d3" style="max-width:560px;margin-inline:auto">${plan311()}</div>`},
  {note:ADD+'على الشكل: × مصباح في سقف كل غرفة، ورمز المفتاح بجوار الأبواب، والقوس الصغير مقبس على الجدار، والرقم بجوار الشرطة عدد الموصلات. والكتابة على الخطوط نوع الموصل ومقطعه، مثل <span class="ltr">H07 V-R Cu 2,5²</span> (موصل نحاسي معزول مقطعه <span class="ltr">2.5 mm²</span>). والكتاب لا يشرح الاختصارات <span class="ltr">mo</span> و<span class="ltr">m°</span> و<span class="ltr">H07 V-R</span> و<span class="ltr">NYM</span>؛ ومن مقارنة النص بالشكل (3-12) يظهر أن <span class="ltr">m</span> تقابل الموصل «فوق الحائط أو البياض» (الدائرة الأولى) وأن <span class="ltr">m°</span> تقابل «في ماسورة تركيبات تحت البياض» (الدائرتان 2 و3).'},
  {html:'<p>ويراعى تركيب خط رئيس من خارج المبنى إلى داخله سواء أكان الخط الرئيس خارج المبنى سلكاً هوائياً أو كابلاً مدفوناً تحت الأرض على أن يوزع هذا الخط الرئيس إلى جميع الوحدات السكنية في جميع الأدوار.</p><p>ولتصميم لوحة التوزيع الخاصة بالوحدة السكنية يجب معرفة كل التجهيزات الكهربائية المطلوبة داخلها وكذلك الأجهزة الكهربائية المستخدمة، ويتم بعد ذلك تقسيم الوحدة السكنية إلى عدد من الدوائر الكهربائية اللازمة (كل دائرة كهربائية على عدد من المصابيح والمقابس والأجهزة).</p>'},
  {h:'الدوائر الست للوحدة السكنية',ref:'ص 77',html:'<p>في الوحدة السكنية المبينة في شكل (3-11) تم تقسيمها إلى ست دوائر كهربائية وبياناتها كالتالي:</p><ul><li><b>الدائرة الأولى:</b> دائرة محرك ثلاثي الأوجه <span class="ltr">2.2 Kw</span>، خط نحاسي مغلف (موصل فوق الحائط أو البياض) <span class="ltr">2.5 mm²</span>، ٣ مصاهر معدلها ٢٠ أمبير.</li><li><b>الدائرة الثانية:</b> دائرة مصابيح كهربائية، موصلات نحاسية معزولة <span class="ltr">2.5 mm²</span> في ماسورة تركيبات تحت البياض، مفتاح وقاية موصلات معدله ١٠ أمبير.</li><li><b>الدائرة الثالثة:</b> دائرة مقابس كهربائية نفس تركيبات الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.</li><li><b>الدائرة الرابعة:</b> دائرة جهاز تكييف للهواء <span class="ltr">4.5 kW</span> ونفس الدائرة الثانية، مفتاح وقاية موصلات معدله ٢٠ أمبير.</li><li><b>الدائرة الخامسة:</b> دائرة فرن كهربائي قدرته الكهربائية الكلية <span class="ltr">7.5 kW</span>، موصلات نحاسية معزولة <span class="ltr">6.5 mm²</span> في ماسورة تركيبات تحت البياض (داخل الحائط)، ثلاثة مفاتيح وقاية موصلات معدلها ٣٥ أمبير.</li><li><b>الدائرة السادسة:</b> دائرة سخان كهربائي <span class="ltr">4 kW</span>، موصلات نحاسية معزولة داخل الحائط، ثلاثة مفاتيح وقاية موصلات معدلها ٢٠ أمبير.</li></ul><p>ويبين الشكل (3-12) لوحة التوزيع الخاصة بالوحدة السكنية. ويمكن أن يحتوي مخطط التوزيع على بيانات أخرى، مثل الأطوال الكلية للدوائر الكهربائية، والغرف التي تتغذى من هذه الدوائر....إلخ.</p>'},
  {fig:'(3-12)',ref:'ص 78',caption:'مخطط التوزيع (لوحدة توزيع) لوحة سكنية.',draw:()=>`<div class="svgbox d3" style="max-width:660px;margin-inline:auto">${board312(null,false)}</div>`},
  {note:ADD+'اقرأ الشكل (3-12) من اليسار: التغذية ثلاثية الأوجه بموصل محايد <span class="ltr">3/N ~ 60Hz</span> بجهد <span class="ltr">220/127v</span> وأربعة موصلات، ثم <b>العداد</b> <span class="ltr">KWh 3~</span>، ثم <b>المفتاح الرئيس</b>، ثم <b>قضيب التوزيع</b> (الخط السميك)، ومنه ست دوائر. لكل دائرة جهاز حمايتها (مصهر للدائرة 1، وقاطع آلي لكل من الدوائر 2–6) مكتوب بجانبه معدله، ثم عدد موصلاتها ونوعها ومقطعها، ثم رمز الحمل وقدرته ورقم الدائرة.'},
  {h:'نشاط قراءة: طابق النص مع الشكل',ref:'ص 77–78',html:'<p>الجدول يضع بيانات كل دائرة من النص (ص 77) بجانب ما كُتب في الشكل (3-12). الخانات الملوّنة فيها اختلاف بين النص والشكل — اقرأ الملاحظة تحت الجدول.</p>'},
  {widget:el=>{el.innerHTML=T312()}},
  {err:'الإحالتان «الشكل (٢- ٧)» و«الشكل (٢- ١٢)» في ص 76–77 صحيحهما (3-11) و(3-12)، فكتبناهما كذلك؛ وكُتب «ستة دوائر» والصحيح «ست دوائر». وبين النص والشكل (3-12) فروق: الدائرة الخامسة في النص <span class="ltr">6.5 mm²</span> وفي الشكل <span class="ltr">Cu 6²</span> (والمقاس القياسي <span class="ltr">6 mm²</span>)؛ الدائرة الرابعة في النص «نفس الدائرة الثانية» (أي <span class="ltr">2.5 mm²</span>) وفي الشكل <span class="ltr">Cu 4²</span>؛ الدائرة السادسة بلا مقطع في النص وفي الشكل <span class="ltr">Cu 4²</span>؛ الدائرة الأولى «٣ مصاهر» والشكل يرسم مصهراً واحداً بجانبه 3، والدائرتان الخامسة والسادسة «ثلاثة مفاتيح وقاية» والشكل يرسم قاطعاً واحداً لكل منهما — وهذا مقبول في الرسم أحادي الخط الذي يمثل الأوجه الثلاثة برمز واحد. والقدرتان <span class="ltr">1000w</span> و<span class="ltr">3.3 Kw</span> للدائرتين 2 و3 في الشكل فقط.'},
  {h:'نشاط: اقرأ المخطط',ref:'ص 78',widget:el=>mcqWidget(el,[
   {q:'ما جهاز الحماية للدائرة 1 (المحرك) في الشكل (3-12)؟',o:['قاطع 10A','مصهر 20A','قاطع 35A'],c:1,e:'مستطيل صغير يقطعه خط مائل بجانبه 20A.'},
   {q:'أي دائرة لها أكبر معدل حماية؟',o:['الدائرة 3 (المقابس)','الدائرة 5 (الفرن)','الدائرة 2 (المصابيح)'],c:1,e:'35A للفرن 7.5 kW.'},
   {q:'ماذا يأتي مباشرة بعد العداد في الشكل (3-12)؟',o:['قضيب التوزيع','المفتاح الرئيس','قاطع المصابيح'],c:1,e:'التغذية ← العداد ← المفتاح الرئيس ← قضيب التوزيع.'},
   {q:'كم موصلاً للدائرة 5 في الشكل؟',o:['3','4','6'],c:1,e:'شرطة بجانبها 4: الفرن ثلاثي الأوجه.'}])}
 ],
 lab:(el)=>lab312(el),
 quiz:[
  {q:'لماذا يُضاف مخطط إلى مخطط التركيبات في مخططات الأرضية؟',o:['لأن مخططات الأرضية لا تبين غالباً إلا مواضع الأجهزة والمفاتيح والمقابس، ونحتاج طرق تمديد الموصلات وأنواعها والتوزيع على الدوائر','لتحديد ألوان الجدران','لحساب مساحة الغرف','لا حاجة له'],c:0,e:'ص 76.'},
  {q:'إلى كم دائرة قُسّمت الوحدة السكنية في الشكل (3-11)؟',o:['أربع','خمس','ست','ثماني'],c:2,e:'ست دوائر (ص 77).'},
  {q:'ما الذي يجب معرفته لتصميم لوحة توزيع الوحدة السكنية؟',o:['لون الكابلات فقط','كل التجهيزات الكهربائية المطلوبة داخلها والأجهزة المستخدمة','عدد الأبواب','اتجاه الشمال'],c:1,e:'ثم تُقسم الوحدة إلى دوائر.'},
  {q:'ما معدل مفتاح وقاية دائرة المصابيح؟',o:['10 أمبير','20 أمبير','35 أمبير','2.5 أمبير'],c:0,e:'الدائرة الثانية: 10 أمبير.'},
  {q:'إذا حدث قصر في دائرة المقابس (3):',o:['يفصل المفتاح الرئيس كل الوحدة','يفصل قاطع الدائرة 3 وحده','يحترق مصهر المحرك','لا يحدث شيء'],c:1,e:'لكل دائرة جهاز حمايتها، فتبقى الدوائر الأخرى تعمل.'},
  {q:'الخط السميك الأفقي في الشكل (3-12) هو:',o:['العداد','قضيب التوزيع','الأرضي','كابل المحرك'],c:1,e:'تتفرع منه الدوائر الست.'}]
});

/* ============================== LESSON 7 ============================== */
B.lesson({
 id:'u3-l7',unit:3,order:7,pages:'79–80',
 title:'تمارين الوحدة الثالثة',
 summary:'أربعة تمارين: ارسم الدائرة التنفيذية (والخطية) من دائرة خطية معطاة — مصباحان بمفتاح مفرد، ودائرة طرف سلم بمصباحين، ومصباح فلورسنت، وجرس بضاغط. مع حلول مقترحة مرسومة خطوة بخطوة.',
 stations:[
  {intro:true},

  {st:1,short:'التمرين ١',title:'٣-٦ تمارين — التمرين (١)',ref:'ص 79',
   q:'النص يقول «على التوالي» والرسم يشبه التوازي… فأيهما ترسم؟',
   art:U3ST.art('الدائرة الخطية (3-13): مصدر 220 فولت وعلبة تفريع ومصباحان على خط كل منهما الرقم 3 ومفتاح مفرد','#F7DCC8',
    U3ST.fit(U3ST.lin(LIN.f313),[24,40,312,244],{vb:[10,0,240,226],
     extra:tA(56,176,'مصباح ١','middle',12)+tA(204,176,'مصباح ٢','middle',12),
     hot:[[100,25,60,26,'المصدر / لوحة التوزيع ⟦220⟧ فولت.'],[114,70,28,24,'شرطة بجانبها ⟦3⟧ = ثلاثة موصلات من المصدر.'],[120,108,20,20,'علبة التفريع.'],[76,100,28,26,'⟦3⟧ = ثلاثة موصلات إلى المصباح ١.'],[156,100,28,26,'⟦3⟧ = ثلاثة موصلات إلى المصباح ٢.'],[44,131,24,24,'المصباح ١.'],[192,131,24,24,'المصباح ٢.'],[118,145,24,20,'شرطتان = سلكان إلى المفتاح.'],[120,170,32,30,'المفتاح المفرد.']]})),
   cap:'الشكل <span class="ltr">(3-13)</span> — الدائرة الخطية المعطاة في التمرين.<br><b>مرّر المؤشر على الأرقام والرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لكل مصباح في الشكل (3-13) ثلاثة موصلات من علبة التفريع. بأي دائرة سبق أن رأيت هذا؟',opts:[
     ['الشكل (3-3): مصباحان على التوازي مع موصل الحماية',true,'هناك أيضاً ثلاثة موصلات لكل مصباح: الخط المُشغَّل وN وPE.'],
     ['الشكل (3-2): المفتاح المزدوج',false,'هناك سلكان لكل مصباح.'],
     ['الشكل (3-4): دائرة السلم',false,'هناك سلكان لكل مصباح، و3 و4 للمفاتيح.']]}}
   ],
   body:[
    {book:String.raw`<p>المطلوب رسم الدائرة التنفيذية لدائرة تشغيل مصباحين عن طريق مفتاح مفرد (على التوالي) وعمل التوصيلات اللازمة حسب ما هو موضح في الدائرة الخطية في الشكل (3-13).</p>`,ref:'ص 79'},
    {watch:String.raw`<p>نص التمرين يقول «على التوالي» (مطبوعة «على التوالٍ»)، بينما الدائرة الخطية <span class="ltr">(3-13)</span> مرسومة مثل دائرة التوازي <span class="ltr">(3-3)</span>: مصباحان على جانبي علبة التفريع، ولكلٍّ منهما ثلاثة موصلات. لم نختر قراءة واحدة: في المختبر المصغّر تحت حلّان مقترحان — القراءة الأولى (توازٍ، حسب الشكل) والقراءة الثانية (توالٍ، حسب النص).</p>`,fix:true},
    {title:'مختبر مصغّر: قارن القراءتين (حل مقترح — ليس من الكتاب)',widget:(el,B)=>U3ST.mini(el,B,{boards:[{name:'القراءة الأولى (توازٍ)',bd:BD.x1a},{name:'القراءة الثانية (توالٍ)',bd:BD.x1b}],intro:'اختر القراءة، ثم أغلق المفتاح وقارن الإضاءة ومسار التيار.',
     predict:{q:'في قراءة التوالي، أغلقت المفتاح. كيف يضيء المصباحان؟',opts:[
      ['كلٌّ بإضاءته الكاملة',false,'هذا في التوازي، حيث كل مصباح بين الخط المُشغَّل وN.'],
      ['بضوء خافت',true,'في التوالي يمر التيار نفسه في المصباحين ويتقاسمان الجهد.'],
      ['يضيء المصباح ١ فقط',false,'في التوالي المسار واحد: يضيئان معاً أو ينطفئان معاً.']]}})},
    {tip:String.raw`<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p><b>القراءة الأولى (توازٍ):</b> مثل الشكل <span class="ltr">(3-3)</span> ب: L1 ← المفتاح ← عقدة في علبة التفريع ← المصباحان كلٌّ إلى N، وPE إلى جسمي الكشافين. يضيء المصباحان بالجهد الكامل.</p><p><b>القراءة الثانية (توالٍ):</b> L1 ← المفتاح ← المصباح ١ ← (وصلة عبر علبة التفريع) ← المصباح ٢ ← N، وPE إلى جسمي الكشافين. يتقاسم المصباحان الجهد فيضيئان بضوء خافت، وإذا تلف أحدهما انطفأ الآخر.</p></div></details>`,title:'الحل المقترح'}
   ]},

  {st:2,short:'التمرين ٢',title:'التمرين (٢)',ref:'ص 79',
   q:'مصباح يُشعل من أسفل الدرج ويُطفأ من أعلاه… كم سلكاً بين العلبتين؟',
   art:U3ST.art('الدائرة الخطية (3-14): علبتا تفريع، تحت كل منهما مفتاح ذو اتجاهين وفوقها مصباح، وبينهما الرقم 5','#E4EEDC',
    U3ST.fit(U3ST.lin(LIN.f314),[20,40,320,240],{vb:[10,0,270,225],
     hot:[[20,23,60,26,'المصدر / لوحة التوزيع ⟦220v⟧.'],[70,102,28,26,'⟦3⟧ = ثلاثة موصلات من المصدر.'],[110,110,20,20,'علبة التفريع الأولى.'],[220,110,20,20,'علبة التفريع الثانية.'],[161,102,28,26,'⟦5⟧ = خمسة موصلات بين العلبتين.'],[108,59,24,24,'مصباح ⟦⊗⟧ فوق العلبة الأولى.'],[218,59,24,24,'مصباح ⟦⊗⟧ فوق العلبة الثانية.'],[102,168,36,36,'مفتاح ذو اتجاهين.'],[212,168,36,36,'مفتاح ذو اتجاهين.'],[104,141,28,24,'⟦3⟧ = ثلاثة موصلات إلى المفتاح.'],[214,141,28,24,'⟦3⟧ = ثلاثة موصلات إلى المفتاح.']]})),
   cap:'الشكل <span class="ltr">(3-14)</span> — الدائرة الخطية المعطاة.<br><b>مرّر المؤشر على الأرقام والرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الرقم 5 على الخط بين علبتي التفريع يعني:',opts:[
     ['خمسة مصابيح',false,'في الشكل مصباحان فقط.'],
     ['5 أمبير',false,'الرقم بجانب الشرطة عدد الموصلات، لا التيار.'],
     ['خمسة أسلاك: مسافران والخط المُشغَّل وN وPE',true,'هذا ما يحتاجه الحل المقترح.']]}}
   ],
   body:[
    {book:String.raw`<p>المطلوب رسم الدائرة التنفيذية لدائرة تشغيل مصباح من مكانين مختلفين (دائرة طرف سلم) يدوياً وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-14).</p>`,ref:'ص 79'},
    {watch:String.raw`<p>الإحالة في النص «الشكل (٢- ١٤)» صحيحها <span class="ltr">(3-14)</span>. والنص يقول «مصباح» بينما الشكل <span class="ltr">(3-14)</span> فيه مصباحان (⊗) — رسمنا الحل بمصباحين حسب الشكل، يعملان معاً.</p>`,fix:true},
    {title:'مختبر مصغّر: من مكانين (حل مقترح — ليس من الكتاب)',widget:(el,B)=>U3ST.mini(el,B,{bd:BD.x2,intro:'غيّر وضع أي مفتاح من المفتاحين وتتبّع السلكين المسافرين.',
     predict:{q:'المصباحان مضيئان. غيّرت وضع المفتاح الثاني. ماذا يحدث؟',opts:[
      ['ينطفئان',true,'المفتاحان صارا على سلكين مسافرين مختلفين فانقطع المسار.'],
      ['يبقيان مضيئين',false,'أي مفتاح من الاثنين يقلب الحالة.'],
      ['ينطفئ المصباح ٢ فقط',false,'المصباحان على الخط المُشغَّل نفسه، فيعملان معاً.']]}})},
    {tip:String.raw`<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>مفتاحان ذوا اتجاهين، واحد تحت كل علبة تفريع. L1 ← المشترك في المفتاح الأول ← سلكان مسافران ← المفتاح الثاني ← من مشتركه إلى عقدة في العلبة الثانية ← المصباح ٢، ومنها عبر العلبة الأولى إلى المصباح ١؛ وN وPE إلى المصباحين. بين العلبتين خمسة أسلاك (مسافران + الخط المُشغَّل + N + PE)، وهو الرقم 5 على الخطية؛ وثلاثة أسلاك إلى كل مفتاح وكل مصباح.</p></div></details>`,title:'الحل المقترح'}
   ]},

  {st:3,short:'التمرين ٣',title:'التمرين (٣)',ref:'ص 80',
   q:'هذا الشكل رأيته من قبل… فهل تستطيع رسم تنفيذيته من الذاكرة؟',
   art:U3ST.art('الدائرة الخطية (3-15): مصدر وعلبة تفريع وكشاف فلورسنت 20W ومفتاح مفرد','#DCE9F2',
    U3ST.fit(U3ST.lin(LIN.f35),[24,40,312,240],{vb:[20,0,210,222],
     extra:tA(170,48,'كشاف فلورسنت','middle',12)+tA(118,204,'مفتاح مفرد','start',12),
     hot:[[70,15,60,26,'المصدر / لوحة التوزيع.'],[90,100,20,20,'علبة التفريع.'],[138,60,64,24,'مصباح فلورسنت ⟦20W⟧.'],[88,62,24,20,'شرطتان = سلكان.'],[126,100,24,20,'شرطتان = سلكان.'],[88,139,24,20,'شرطتان = سلكان.'],[90,166,32,30,'المفتاح المفرد.']]})),
   cap:'الشكل <span class="ltr">(3-15)</span> — مطابق للشكل <span class="ltr">(3-5)</span> أ.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'التمرين (٣) مطابق لأي مثال في الوحدة؟',opts:[
     ['العداد (3-6)',false,'لا عداد في الشكل (3-15).'],
     ['مصباح فلورسنت بمفتاح مفرد (3-5)',true,'الخطية نفسها: المصدر والعلبة والكشاف 20W والمفتاح.'],
     ['الجرس (3-7)',false,'لا جرس في الشكل.']]}}
   ],
   body:[
    {book:String.raw`<p>المطلوب رسم الدائرة الخطية والدائرة التنفيذية لتشغيل مصباح فلورسانت (20 وات) عن طريق مفتاح مفرد وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-15).</p>`,ref:'ص 80'},
    {watch:String.raw`<p>الإحالة في النص «الشكل (٢- ١٥)» صحيحها <span class="ltr">(3-15)</span>. وهذا التمرين مطابق للمثال الخامس والشكل <span class="ltr">(3-5)</span>، ويطلب رسم الدائرة الخطية مع أنها معطاة.</p>`,fix:true},
    {title:'مختبر مصغّر: ارسمها بالترتيب (حل مقترح — ليس من الكتاب)',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات رسم الدائرة التنفيذية بالترتيب، من خطي التغذية حتى آخر سلك.',steps:[
 ['نرسم L1 وN','خطا التغذية أولاً، فكل سلك يبدأ منهما.'],
 ['نرسم علبة التفريع وعلبة المفتاح','العلب قبل الأسلاك، لنعرف أين تمر.'],
 ['نرسم علبة الكشاف: الأنبوبة بفتيلتيها، والبادئ، والملف الخانق','عناصر الكشاف قبل توصيلها.'],
 ['من L1 سلك إلى الطرف العلوي للمفتاح','أول سلك من الطور إلى المفتاح.'],
 ['من الطرف السفلي للمفتاح إلى الملف الخانق، ومنه إلى الفتيلة اليمنى','خرج المفتاح يمر في الخانق أولاً.'],
 ['من N إلى الفتيلة اليسرى','آخر سلك: طريق الرجوع.']],done:'L1 ← المفتاح ← الخانق ← الفتيلة اليمنى ← البادئ ← الفتيلة اليسرى ← N.'})},
    {tip:String.raw`<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>الخطية كما في الشكل، والتنفيذية مثل الشكل <span class="ltr">(3-5)</span> ب: L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى، والبادئ بين الطرفين العلويين للفتيلتين، والفتيلة اليسرى ← N.</p></div></details>`,title:'الحل المقترح'}
   ]},

  {st:4,short:'التمرين ٤',title:'التمرين (٤)',ref:'ص 80',
   q:'ثلاثة أسلاك فقط تكفي لجرس بضاغط… فإلى أين يذهب كل منها؟',
   art:U3ST.art('الدائرة الخطية (3-16): مصدر 220v وعلبة تفريع وجرس وضاغط','#F3E3C8',
    U3ST.fit(LIN.f37(U3ST.N0,'220v'),[24,40,312,240],{vb:[20,0,210,222],
     extra:tA(190,56,'الجرس','middle',12)+tA(76,206,'الضاغط','start',12),
     hot:[[90,19,60,26,'المصدر / لوحة التوزيع ⟦220v⟧.'],[110,100,20,20,'علبة التفريع.'],[176,64,28,20,'الجرس.'],[48,172,24,24,'الضاغط ⟦⊙⟧.'],[108,64,24,20,'شرطتان = سلكان.'],[146,100,24,20,'شرطتان = سلكان.'],[48,133,24,20,'شرطتان = سلكان.']]})),
   cap:'الشكل <span class="ltr">(3-16)</span> — مثل <span class="ltr">(3-7)</span> أ مع كتابة <span class="ltr">220v</span>.<br><b>مرّر المؤشر على الرموز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الدائرة التنفيذية لهذا التمرين، الضاغط يُوصل على:',opts:[
     ['الخط N',false,'الضاغط (مثل المفتاح) يُوصل على الطور L1 في رسوم الوحدة.'],
     ['الخط L1',true,'L1 ← الضاغط ← الجرس ← N، كما في (3-7) ب.'],
     ['بين الجرس وN',false,'الجرس يرجع إلى N مباشرة.']]}}
   ],
   body:[
    {book:String.raw`<p>المطلوب رسم الدائرة الخطية والتنفيذية لتشغيل جرس عن طريق ضاغط تشغيل وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-16).</p>`,ref:'ص 80'},
    {title:'مختبر مصغّر: صِل الأسلاك الثلاثة (حل مقترح — ليس من الكتاب)',widget:(el,B)=>DCML.cases(el,B,{intro:'لكل سلك اختر الطرف الذي يذهب إليه، كما في الشكل (3-7) ب.',cases:[
 {q:'السلك الآتي من <b>L1</b> عبر علبة التفريع يذهب إلى:',opts:[['الطرف الأيسر للجرس',false,'لو وصلنا L1 بالجرس مباشرة لرنّ دائماً.'],['الطرف العلوي للضاغط',true,'الضاغط أول ما يقابله الطور.'],['N',false,'هذا قصر بين الخطين.']]},
 {q:'السلك من <b>الطرف السفلي للضاغط</b> يذهب إلى:',opts:[['أحد طرفي الجرس',true,'خرج الضاغط يغذي الجرس.'],['L1 مرة أخرى',false,'هذا يجعل الضاغط بلا فائدة.'],['N',false,'هذا قصر عند الضغط.']]},
 {q:'السلك من <b>N</b> عبر علبة التفريع يذهب إلى:',opts:[['الطرف العلوي للضاغط',false,'الضاغط على L1.'],['الطرف الآخر للجرس',true,'طريق الرجوع: الجرس ← N.'],['لا حاجة إليه',false,'بدون N لا يكتمل المسار.']]}]})},
    {tip:String.raw`<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>مثل الشكل <span class="ltr">(3-7)</span> ب: L1 ← علبة التفريع ← الطرف العلوي للضاغط؛ الطرف السفلي للضاغط ← الجرس؛ N ← الطرف الآخر للجرس. سلكان على كل خط.</p></div></details>`,title:'الحل المقترح'}
   ]},

  {recap:[
   'التمرين (١): النص «على التوالي» والخطية (3-13) كالتوازي — حلّان مقترحان: توازٍ (إضاءة كاملة) وتوالٍ (ضوء خافت) (ص 79).',
   'التمرين (٢): دائرة طرف سلم بمفتاحين ذوي اتجاهين، وبين العلبتين خمسة أسلاك (الرقم 5) (ص 79).',
   'التمرين (٣): مطابق لمثال الفلورسنت (3-5): L1 ← المفتاح ← الخانق ← الفتيلتان والبادئ ← N (ص 80).',
   'التمرين (٤): L1 ← الضاغط ← الجرس ← N، سلكان على كل خط (ص 80).']}
],
 theory:[
  {h:'٣-٦ تمارين',ref:'ص 79–80',html:'<p>الكتاب لا يقدم حلولاً لهذه التمارين. الحلول في تبويب «الأمثلة المحلولة» <b>حلول مقترحة (ليست من الكتاب)</b> تُرسم خطوة بخطوة، ويمكنك تجربة كل حل في «المختبر».</p>'},
  {h:'التمرين (١)',ref:'ص 79',html:'<p>المطلوب رسم الدائرة التنفيذية لدائرة تشغيل مصباحين عن طريق مفتاح مفرد (على التوالي) وعمل التوصيلات اللازمة حسب ما هو موضح في الدائرة الخطية في الشكل (3-13).</p>'},
  {fig:'(3-13)',ref:'ص 79',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f313,260)},
  {err:'<span class="fixnote">نص التمرين يقول «على التوالي» (مطبوعة «على التوالٍ»)، بينما الدائرة الخطية (3-13) مرسومة مثل دائرة التوازي (3-3): مصباحان على جانبي علبة التفريع، ولكلٍّ منهما ثلاثة موصلات. لم نختر قراءة واحدة: في الأمثلة المحلولة والمختبر حلّان مقترحان — القراءة الأولى (توازٍ، حسب الشكل) والقراءة الثانية (توالٍ، حسب النص).</span>'},
  {html:'<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p><b>القراءة الأولى (توازٍ):</b> مثل الشكل (3-3) ب: L1 ← المفتاح ← عقدة في علبة التفريع ← المصباحان كلٌّ إلى N، وPE إلى جسمي الكشافين. يضيء المصباحان بالجهد الكامل.</p><p><b>القراءة الثانية (توالٍ):</b> L1 ← المفتاح ← المصباح 1 ← (وصلة عبر علبة التفريع) ← المصباح 2 ← N، وPE إلى جسمي الكشافين. يتقاسم المصباحان الجهد فيضيئان بضوء خافت، وإذا تلف أحدهما انطفأ الآخر.</p></div></details>'},
  {h:'التمرين (٢)',ref:'ص 79',html:'<p>المطلوب رسم الدائرة التنفيذية لدائرة تشغيل مصباح من مكانين مختلفين (دائرة طرف سلم) يدوياً وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-14).</p>'},
  {fig:'(3-14)',ref:'ص 79',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f314,300)},
  {err:'الإحالة في النص «الشكل (٢- ١٤)» صحيحها (3-14). والنص يقول «مصباح» بينما الشكل (3-14) فيه مصباحان (⊗) — رسمنا الحل بمصباحين حسب الشكل، يعملان معاً.'},
  {html:'<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>مفتاحان ذوا اتجاهين، واحد تحت كل علبة تفريع. L1 ← المشترك في المفتاح الأول ← سلكان مسافران ← المفتاح الثاني ← من مشتركه إلى عقدة في العلبة الثانية ← المصباح 2، ومنها عبر العلبة الأولى إلى المصباح 1؛ وN وPE إلى المصباحين. بين العلبتين خمسة أسلاك (مسافران + الخط المُشغَّل + N + PE)، وهو الرقم 5 على الخطية؛ وثلاثة أسلاك إلى كل مفتاح وكل مصباح.</p></div></details>'},
  {h:'التمرين (٣)',ref:'ص 80',html:'<p>المطلوب رسم الدائرة الخطية والدائرة التنفيذية لتشغيل مصباح فلورسانت (20 وات) عن طريق مفتاح مفرد وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-15).</p>'},
  {fig:'(3-15)',ref:'ص 80',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f35,240)},
  {err:'الإحالة في النص «الشكل (٢- ١٥)» صحيحها (3-15). وهذا التمرين مطابق للمثال الخامس والشكل (3-5)، ويطلب رسم الدائرة الخطية مع أنها معطاة.'},
  {html:'<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>الخطية كما في الشكل، والتنفيذية مثل الشكل (3-5) ب: L1 ← المفتاح ← الملف الخانق ← الفتيلة اليمنى، والبادئ بين الطرفين العلويين للفتيلتين، والفتيلة اليسرى ← N.</p></div></details>'},
  {h:'التمرين (٤)',ref:'ص 80',html:'<p>المطلوب رسم الدائرة الخطية والتنفيذية لتشغيل جرس عن طريق ضاغط تشغيل وعمل التوصيلات اللازمة للدائرة الخطية المبينة في الشكل (3-16).</p>'},
  {fig:'(3-16)',ref:'ص 80',caption:'الدائرة الخطية.',draw:()=>lFig(LIN.f37,240,'220v')},
  {html:'<details class="cl-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div><p>مثل الشكل (3-7) ب: L1 ← علبة التفريع ← الطرف العلوي للضاغط؛ الطرف السفلي للضاغط ← الجرس؛ N ← الطرف الآخر للجرس. سلكان على كل خط.</p></div></details>'}
 ],
 lab:(el)=>board(el,[BD.x1a,BD.x1b,BD.x2,BD.x3,BD.x4]),
 examples:[
  drawEx({title:'التمرين (١) — حل مقترح (ليس من الكتاب): القراءة الأولى (توازٍ)',ref:'ص 79',q:'<p>الدائرة التنفيذية لمصباحين بمفتاح مفرد حسب الخطية (3-13)، على قراءة التوازي (كما يوحي الشكل).</p>',
   pre:[linStep('الخطية المعطاة (3-13): ثلاثة موصلات إلى علبة التفريع وإلى كل مصباح، وسلكان إلى المفتاح.',LIN.f313,260)],sp:F.x1a,
   steps:['نرسم <b>L1</b> و<b>N</b> و<b>PE</b>.','علبة التفريع وعلبة المفتاح المفرد.','علبتا المصباحين ورمز الأرضي لجسم كل كشاف.','من <b>L1</b> إلى الطرف العلوي للمفتاح.','من الطرف السفلي للمفتاح إلى عقدة في علبة التفريع، ومنها إلى المصباحين.','من <b>N</b> إلى الطرف الآخر لكلا المصباحين.','من <b>PE</b> إلى جسمي الكشافين.']}),
  drawEx({title:'التمرين (١) — حل مقترح (ليس من الكتاب): القراءة الثانية (توالٍ)',ref:'ص 79',q:'<p>الدائرة التنفيذية لمصباحين بمفتاح مفرد «على التوالي» كما في نص التمرين.</p>',
   sp:F.x1b,steps:['نرسم <b>L1</b> و<b>N</b> و<b>PE</b>.','علبة التفريع وعلبة المفتاح المفرد.','علبتا المصباحين ورمز الأرضي.','من <b>L1</b> إلى الطرف العلوي للمفتاح.','من الطرف السفلي للمفتاح إلى طرف المصباح 1 فقط.','وصلة التوالي: من الطرف الآخر للمصباح 1 عبر علبة التفريع إلى طرف المصباح 2.','من الطرف الآخر للمصباح 2 إلى <b>N</b>.','من <b>PE</b> إلى جسمي الكشافين.']}),
  drawEx({title:'التمرين (٢) — حل مقترح (ليس من الكتاب)',ref:'ص 79',q:'<p>الدائرة التنفيذية لدائرة طرف سلم (تشغيل من مكانين) حسب الخطية (3-14).</p>',
   pre:[linStep('الخطية المعطاة (3-14): علبتا تفريع، تحت كل منهما مفتاح ذو اتجاهين (3 أسلاك) وفوقها مصباح (3 أسلاك)، وبينهما 5 أسلاك.',LIN.f314,300)],sp:F.x2,
   steps:['نرسم <b>L1</b> و<b>N</b> و<b>PE</b>.','علبتا التفريع، وتحت كل منهما علبة مفتاح ذي اتجاهين.','علبتا المصباحين ورمز الأرضي.','من <b>L1</b> إلى الطرف المشترك للمفتاح الأول.','السلكان المسافران بين المفتاحين (يمران في العلبتين).','من مشترك المفتاح الثاني إلى عقدة في العلبة الثانية، ومنها إلى المصباح 2، وعبر العلبة الأولى إلى المصباح 1.','من <b>N</b> إلى الطرف الآخر للمصباحين.','من <b>PE</b> إلى جسمي الكشافين. عُدّ الأسلاك بين العلبتين: خمسة.']}),
  drawEx({title:'التمرين (٣) — حل مقترح (ليس من الكتاب)',ref:'ص 80',q:'<p>الدائرة الخطية والتنفيذية لمصباح فلورسنت 20 W بمفتاح مفرد حسب (3-15).</p>',
   pre:[linStep('الدائرة الخطية (3-15): المصدر، وعلبة التفريع، والكشاف 20W بسلكين، والمفتاح المفرد بسلكين.',LIN.f35,240)],sp:F.f35,
   steps:['نرسم <b>L1</b> و<b>N</b>.','علبة التفريع وعلبة المفتاح.','علبة الكشاف: الأنبوبة بفتيلتيها، والبادئ، والملف الخانق.','من <b>L1</b> إلى الطرف العلوي للمفتاح.','من الطرف السفلي للمفتاح إلى الملف الخانق، ومنه إلى الفتيلة اليمنى.','من <b>N</b> إلى الفتيلة اليسرى.']}),
  drawEx({title:'التمرين (٤) — حل مقترح (ليس من الكتاب)',ref:'ص 80',q:'<p>الدائرة الخطية والتنفيذية لتشغيل جرس عن طريق ضاغط حسب (3-16).</p>',
   pre:[linStep('الدائرة الخطية (3-16): المصدر 220v، وعلبة التفريع، والجرس بسلكين، والضاغط بسلكين.',LIN.f37,240,'220v')],sp:F.f37,
   steps:['نرسم <b>L1</b> و<b>N</b>.','علبة التفريع وعلبة الضاغط.','الجرس بطرفيه.','من <b>L1</b> إلى الطرف العلوي للضاغط.','من الطرف السفلي للضاغط إلى أحد طرفي الجرس.','من <b>N</b> إلى الطرف الآخر للجرس.']})],
 quiz:[
  {q:'في الخطية (3-14)، الرقم 5 على الخط بين علبتي التفريع يعني:',o:['خمسة مصابيح','خمسة أسلاك: مسافران والخط المُشغَّل وN وPE','5 أمبير','الطابق الخامس'],c:1,e:'هذا ما يحتاجه الحل المقترح.'},
  {q:'ما المفتاح المناسب لتشغيل مصباح من مكانين (دائرة طرف سلم)؟',o:['مفتاحان مفردان','مفتاحان ذوا اتجاهين','مفتاح مزدوج','ضاغط واحد'],c:1,e:'ولثلاثة أماكن يُضاف مفتاح وسطي.'},
  {q:'لماذا في التمرين (١) قراءتان؟',o:['لأن النص يقول «على التوالي» والدائرة الخطية مرسومة كالتوازي','لأن المفتاح مزدوج','لأن الكتاب أعطى حلين','لا يوجد سبب'],c:0,e:'انظر الملاحظة في الشرح.'},
  {q:'في توصيل المصباحين على التوالي:',o:['يضيء كل منهما بالجهد الكامل','يتقاسمان الجهد فيضيئان بضوء خافت','لا يحتاجان مفتاحاً','يحتاجان مفتاحاً وسطياً'],c:1,e:'التيار نفسه يمر فيهما.'},
  {q:'التمرين (٣) مطابق لأي مثال في الكتاب؟',o:['مصباح فلورسنت بمفتاح مفرد (3-5)','العداد (3-6)','الجرس (3-7)','المزمن (3-10)'],c:0,e:'نفس الخطية (3-5) أ.'}]
});

})(PLCBOOK);
