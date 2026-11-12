/* Unit 4 — العدد اليدوية (ص 57–74) */
(function(B){
"use strict";
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
/* =====================================================================
   helpers (local to this file)
   ===================================================================== */
const D2R=Math.PI/180;
const f1=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
/* Latin label in SVG */
const E=(x,y,s,o)=>{o=o||{};return `<text class="txt${o.m?' m':''}" x="${f1(x)}" y="${f1(y)}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||11}px${o.c?';fill:'+o.c:''}">${s}</text>`};
/* Arabic label in SVG (never put digits or Latin in it — use E() beside it) */
const AR=(x,y,s,o)=>{o=o||{};return `<text class="txt ar${o.m?' m':''}" x="${f1(x)}" y="${f1(y)}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||12}px${o.c?';fill:'+o.c:''}${o.w?';font-weight:'+o.w:''}">${s}</text>`};
const SK='stroke:var(--fg);stroke-width:1.4';
const MF='fill:var(--surface-2);'+SK;         // machine body
const MF2='fill:var(--surface);'+SK;
const RED='var(--stop)',GRN='var(--on)',BLU='var(--blue)',ORG='var(--live)';
function arrow(x1,y1,x2,y2,c,w){w=w||2.2;c=c||RED;const a=Math.atan2(y2-y1,x2-x1),h=6+w*1.6,bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=Math.sin(a)*h*0.55,py=-Math.cos(a)*h*0.55;
 return `<path d="M${f1(x1)} ${f1(y1)}L${f1(bx)} ${f1(by)}" style="stroke:${c};stroke-width:${w};fill:none;stroke-linecap:round"/><polygon points="${f1(x2)},${f1(y2)} ${f1(bx+px)},${f1(by+py)} ${f1(bx-px)},${f1(by-py)}" style="fill:${c}"/>`}
/* arc arrow: angles in degrees, screen convention (increasing = clockwise) */
function arcArrow(cx,cy,r,a0,a1,c,w){c=c||RED;w=w||2.2;const p=a=>[cx+r*Math.cos(a*D2R),cy+r*Math.sin(a*D2R)],s=p(a0),e=p(a1),cw=a1>a0?1:0,lg=Math.abs(a1-a0)>180?1:0;
 const t=a1+(cw?-1:1)*8,q=p(t),ang=Math.atan2(e[1]-q[1],e[0]-q[0]),h=6+w*1.6,bx=e[0]-h*Math.cos(ang),by=e[1]-h*Math.sin(ang),px=Math.sin(ang)*h*0.55,py=-Math.cos(ang)*h*0.55;
 return `<path d="M${f1(s[0])} ${f1(s[1])}A${r} ${r} 0 ${lg} ${cw} ${f1(e[0])} ${f1(e[1])}" style="fill:none;stroke:${c};stroke-width:${w}"/><polygon points="${f1(e[0])},${f1(e[1])} ${f1(bx+px)},${f1(by+py)} ${f1(bx-px)},${f1(by-py)}" style="fill:${c}"/>`}
/* gear outline centred on 0,0 */
function gearD(R,n,d){let s='';const p=2*Math.PI/n;for(let i=0;i<n;i++){const a=i*p;[[R-d,a],[R,a+p*0.18],[R,a+p*0.48],[R-d,a+p*0.66]].forEach(([r,t],j)=>{s+=(i===0&&j===0?'M':'L')+f1(r*Math.cos(t))+' '+f1(r*Math.sin(t))})}return s+'Z'}
/* simple person; y = feet. o.hands=[[x,y],[x,y]] absolute; o.helmet, o.goggles, o.c (shirt colour var) */
function person(x,y,o){o=o||{};const c=o.c||BLU,cs=o.cs||'var(--blue-soft)',sh=[x,y-56];let s='<g>';
 if(!o.noLegs)s+=`<path d="M${x-5} ${y-26}L${x-8} ${y}M${x+5} ${y-26}L${x+8} ${y}" style="stroke:var(--fg);stroke-width:5;stroke-linecap:round;fill:none"/>`;
 s+=`<rect x="${x-10}" y="${y-62}" width="20" height="38" rx="6" style="fill:${cs};stroke:${c};stroke-width:1.5"/>`;
 (o.hands||[[x-14,y-30],[x+14,y-30]]).forEach(h=>{s+=`<path d="M${sh[0]} ${sh[1]}L${h[0]} ${h[1]}" style="stroke:var(--fg);stroke-width:4;stroke-linecap:round"/><circle cx="${h[0]}" cy="${h[1]}" r="3.6" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/>`});
 s+=`<circle cx="${x}" cy="${y-72}" r="9" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.5"/>`;
 if(o.helmet)s+=`<path d="M${x-11} ${y-74}a11 10 0 0 1 22 0z" style="fill:${ORG};stroke:var(--fg);stroke-width:1"/>`;
 if(o.goggles)s+=`<rect x="${x-9}" y="${y-77}" width="18" height="5" rx="2" style="fill:var(--blue-ink)"/>`;
 return s+'</g>'}
const svgOpen=(w,h,lab)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${lab}">`;
const frameT=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" style="fill:none;stroke:var(--line);stroke-width:1.2"/>`;
const SIMPLE='<b>رسم مبسّط للشكل (ليس الصورة الأصلية)</b>';

/* =====================================================================
   figures — unit 4
   ===================================================================== */
/* (4-1) poster: Use the right tool */
function fig41(){let s=svgOpen(420,230,'ملصق توعوي: استعمل العدة المناسبة');
 s+=`<rect x="10" y="10" width="400" height="210" rx="10" style="fill:var(--surface-2);stroke:var(--line)"/>`;
 s+=E(210,40,"Don't Play The Fool",{fs:17})+E(210,64,'Use The Right Tool',{fs:17,c:BLU});
 s+=person(150,205,{helmet:1,hands:[[196,140],[200,170]]});
 s+=`<path d="M196 140L262 128" style="stroke:var(--fg);stroke-width:4"/><rect x="176" y="134" width="24" height="12" rx="4" transform="rotate(-10 188 140)" style="fill:${RED}"/>`;
 s+=`<rect x="262" y="132" width="70" height="40" rx="3" style="${MF}"/>`;
 [[268,112],[280,104],[288,120],[296,110]].forEach(p=>{s+=`<path d="M264 128L${p[0]} ${p[1]}" style="stroke:${ORG};stroke-width:2"/>`});
 return s+'</svg>'}

/* (4-2) adjustable wrench. o:{flip,ang,load:'fixed'|'mov'|'',pull:+1 toward you|-1 away|0,good,labels,you,crack} */
function wrenchSVG(o){o=o||{};const cx=110,cy=o.you?150:112,fl=o.flip?-1:1,ang=o.ang||0;
 let s=svgOpen(470,o.you?330:232,'مفتاح ربط فرنساوي واتجاه الشد');
 const hex=[0,1,2,3,4,5].map(i=>{const a=(30+60*i)*D2R;return f1(20.8*Math.cos(a))+','+f1(20.8*Math.sin(a))}).join(' ');
 s+=`<g transform="translate(${cx} ${cy}) rotate(${f1(ang)})"><polygon points="${hex}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><circle r="8" style="fill:var(--surface-2);stroke:var(--fg)"/></g>`;
 const fixC=o.load==='fixed'?'fill:var(--on-soft);stroke:var(--on);stroke-width:2.4':'fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5';
 const movC=o.load==='mov'?'fill:var(--stop-soft);stroke:var(--stop);stroke-width:2.4':'fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5';
 let g=`<path d="M-42 -18L24 -18L24 11L50 11L64 8L330 8A8 8 0 0 0 330 -8L64 -8L50 -24L22 -42L-14 -45L-42 -31Z" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/>`;
 g+=`<path d="M-42 -18L20 -18L20 -38L-14 -45L-42 -31Z" style="${fixC}"/>`;
 g+=`<path d="M-42 18L22 18L22 22L48 22L48 30L10 35L-22 35L-42 29Z" style="${movC}"/>`;
 g+=`<rect x="27" y="12" width="20" height="9" style="fill:var(--surface);stroke:var(--fg)"/>`+[30,34,38,42].map(x=>`<path d="M${x} 12V21" style="stroke:var(--fg)"/>`).join('');
 g+=`<circle cx="322" cy="0" r="4" style="fill:var(--surface);stroke:var(--fg)"/>`;
 if(o.crack)g+=`<path d="M8 35L13 28L9 25L15 19" style="fill:none;stroke:${RED};stroke-width:2.2"/>`;
 g+=`<rect x="262" y="-15" width="48" height="30" rx="12" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`+[272,282,292,302].map(x=>`<path d="M${x} -14V-4" style="stroke:var(--fg);stroke-width:1"/>`).join('');
 s+=`<g transform="translate(${cx} ${cy}) rotate(${f1(ang)}) scale(1 ${fl})">${g}</g>`;
 if(o.labels){const up=fl>0;
  s+=E(cx-6,up?cy-60:cy+72,'Permanent Jaw')+`<path d="M${cx-6} ${up?cy-55:cy+60}V${up?cy-44:cy+46}" style="stroke:var(--fg)"/>`;
  s+=E(cx-6,up?cy+72:cy-60,'Movable Jaw')+`<path d="M${cx-6} ${up?cy+60:cy-55}V${up?cy+36:cy-36}" style="stroke:var(--fg)"/>`;
  s+=E(cx+90,up?cy-40:cy+52,'Knurl',{a:'start'})+`<path d="M${cx+88} ${up?cy-44:cy+46}L${cx+48} ${cy+fl*16}" style="stroke:var(--fg)"/>`;
 }
 if(o.pull){const dn=o.pull>0,hx=cx+290*Math.cos(ang*D2R),hy=cy+290*Math.sin(ang*D2R);
  s+=arrow(hx,hy+(dn?20:-20),hx,hy+(dn?66:-66),o.good===false?RED:o.good?GRN:'var(--fg)',4);
  if(o.labels)s+=E(hx-14,dn?hy+58:hy-62,'Direction',{a:'end'})+E(hx-14,dn?hy+72:hy-48,'of Pull',{a:'end'});}
 if(o.you)s+=`<path d="M10 302H460" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:6 4"/>`+AR(235,322,'أنت تقف هنا عند حافة طاولة العمل',{fs:12,m:1});
 return s+'</svg>'}

/* (4-3) tool belt */
function fig43(){let s=svgOpen(380,200,'حزام عدة بجيوب');
 s+=`<path d="M20 60Q190 30 360 60L360 84Q190 54 20 84Z" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.4"/>`;
 [[60,RED],[126,ORG],[236,BLU],[296,GRN]].forEach(([x,c])=>{s+=`<path d="M${x+3} 44L${x+6} 96" style="stroke:var(--fg);stroke-width:3"/><rect x="${x-4}" y="24" width="14" height="22" rx="4" style="fill:${c}"/>`});
 [[40,100],[110,96],[220,96],[280,100]].forEach(([x,w])=>{s+=`<path d="M${x} 80L${x+4} 160Q${x+w/2-10} 172 ${x+w-24} 160L${x+w-20} 76" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.4"/>`});
 s+=`<rect x="172" y="56" width="32" height="24" rx="4" style="fill:none;stroke:var(--fg);stroke-width:2"/><circle cx="196" cy="182" r="10" style="fill:none;stroke:var(--fg);stroke-width:3"/>`;
 return s+'</svg>'}

/* belt / chain loop geometry (fig 4-4 and the nip-point lab). c1 left, c2 right, same y */
function loopGeo(c1,r1,c2,r2){const d=c2[0]-c1[0],ca=(r1-r2)/d,a=Math.acos(ca),sa=Math.sin(a);
 const P1t=[c1[0]+r1*ca,c1[1]-r1*sa],P2t=[c2[0]+r2*ca,c2[1]-r2*sa],P1b=[c1[0]+r1*ca,c1[1]+r1*sa],P2b=[c2[0]+r2*ca,c2[1]+r2*sa];
 const path=`M${f1(P1t[0])} ${f1(P1t[1])}L${f1(P2t[0])} ${f1(P2t[1])}A${r2} ${r2} 0 1 1 ${f1(P2b[0])} ${f1(P2b[1])}L${f1(P1b[0])} ${f1(P1b[1])}A${r1} ${r1} 0 0 1 ${f1(P1t[0])} ${f1(P1t[1])}`;
 return {P1t,P2t,P1b,P2b,path,a:a/D2R}}
function pulley(cx,cy,r,th,holes){let g=`<g transform="translate(${cx} ${cy}) rotate(${f1(th)})"><circle r="${r}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/><circle r="${r-7}" style="fill:none;stroke:var(--fg);stroke-width:.8"/>`;
 if(holes)for(let i=0;i<holes;i++){const a=i*360/holes*D2R;g+=`<circle cx="${f1(r*0.55*Math.cos(a))}" cy="${f1(r*0.55*Math.sin(a))}" r="${f1(r*0.14)}" style="fill:var(--surface);stroke:var(--fg)"/>`}
 else g+=`<path d="M${-r+9} 0H${r-9}M0 ${-r+9}V${r-9}" style="stroke:var(--fg);stroke-width:2"/>`;
 return g+`<circle r="${f1(Math.max(5,r*0.14))}" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/></g>`}
function sprocket(cx,cy,r,n,th){return `<g transform="translate(${cx} ${cy}) rotate(${f1(th)})"><path d="${gearD(r,n,7)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/><circle r="${f1(r*0.45)}" style="fill:none;stroke:var(--fg)"/><path d="M${f1(-r*0.45)} 0H${f1(r*0.45)}M0 ${f1(-r*0.45)}V${f1(r*0.45)}" style="stroke:var(--fg);stroke-width:1.5"/><circle r="6" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/></g>`}
const nipTag=(x,y,tx,ty)=>`<path d="M${f1(tx)} ${f1(ty)}L${f1(x)} ${f1(y)}" style="stroke:var(--fg);stroke-width:1.2"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3.2" style="fill:${RED}"/>`+E(tx,ty+(ty<y?-4:12),'NIP POINT',{fs:10.5,c:RED});

/* (4-4) three nip-point drawings */
function fig44(){let s=svgOpen(640,420,'نقاط الالتقاء: سير وبكرتان، جنزير وترس، ترس وجريدة مسننة');
 const G=loopGeo([150,95],32,[400,95],62);
 s+=pulley(150,95,32,0,0)+pulley(400,95,62,0,6)+`<path d="${G.path}" style="fill:none;stroke:var(--fg);stroke-width:5;stroke-linejoin:round"/>`;
 s+=arcArrow(400,95,80,-150,-60,'var(--fg)',2.6);
 s+=nipTag(G.P2t[0]-8,G.P2t[1]+4,320,22)+nipTag(G.P1b[0]+8,G.P1b[1]-4,240,178);
 s+=sprocket(150,320,46,14,0)+`<path d="M30 274H150A46 46 0 0 1 150 366H30" style="fill:none;stroke:var(--fg);stroke-width:6;stroke-dasharray:7 3"/>`;
 s+=`<path d="M150 320H215" style="stroke:var(--fg);stroke-width:8"/>`+arcArrow(150,320,62,-160,-80,'var(--fg)',2.6);
 s+=nipTag(120,360,70,402);
 s+=`<g transform="translate(460 300)"><path d="${gearD(46,14,8)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/><circle r="9" style="fill:var(--surface);stroke:var(--fg)"/></g>`;
 let rk='M350 372V352';for(let x=350;x<580;x+=20.6)rk+=`H${f1(x+4)}L${f1(x+7)} 346H${f1(x+13)}L${f1(x+16)} 352`;rk+='H590V372Z';
 s+=`<path d="${rk}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.3"/>`+arcArrow(460,300,62,-140,-40,'var(--fg)',2.4);
 s+=`<path d="M412 392H528" style="stroke:var(--fg);stroke-width:2.4"/><polygon points="404,392 414,387 414,397" style="fill:var(--fg)"/><polygon points="536,392 526,387 526,397" style="fill:var(--fg)"/>`;
 s+=nipTag(436,346,384,320)+nipTag(484,346,560,320);
 return s+'</svg>'}

/* (4-5) cutting hazards */
function fig45(){let s=svgOpen(600,300,'مخاطر القطع');s+=E(20,22,'TYPICAL CUTTING HAZARDS',{a:'start',fs:12,c:RED});
 s+=`<rect x="340" y="40" width="150" height="30" rx="12" style="${MF}"/><rect x="480" y="46" width="70" height="18" rx="8" style="fill:${RED};stroke:var(--fg)"/><ellipse cx="360" cy="80" rx="42" ry="8" style="${MF2}"/>`+arcArrow(360,80,54,20,150,'var(--fg)',2)+E(460,112,'Angle Grinder');
 s+=`<rect x="40" y="70" width="120" height="30" rx="4" style="${MF}"/><rect x="70" y="100" width="60" height="44" rx="4" style="${MF2}"/>`+[78,90,102,114].map(x=>`<path d="M${x} 102V142" style="stroke:var(--fg)"/>`).join('')+`<rect x="30" y="150" width="150" height="22" style="${MF}"/>`+arrow(210,161,186,161,RED,2.4)+E(100,194,'Milling Machine');
 s+=`<rect x="260" y="140" width="22" height="120" style="${MF}"/><path d="M350 130V250" style="stroke:var(--fg);stroke-width:3"/><rect x="300" y="210" width="120" height="12" style="${MF}"/><rect x="380" y="198" width="60" height="12" style="fill:${ORG};stroke:var(--fg)"/>`+arrow(364,148,364,194,RED,2.4)+E(330,278,'Band saw');
 s+=`<rect x="460" y="230" width="130" height="14" style="${MF}"/><path d="M490 230A35 35 0 0 1 560 230" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`+arcArrow(525,230,46,-160,-30,RED,2)+E(525,272,'Circular Saw');
 return s+'</svg>'}
/* (4-6) shearing */
function fig46(){let s=svgOpen(260,220,'القص');s+=`<rect x="70" y="14" width="120" height="70" style="${MF}"/><rect x="118" y="84" width="24" height="26" style="${MF}"/><path d="M110 110H150L138 132H110Z" style="fill:var(--fg)"/><rect x="40" y="140" width="190" height="8" style="${MF}"/><rect x="60" y="150" width="70" height="20" style="fill:var(--surface);stroke:var(--fg);stroke-dasharray:3 2"/>`+E(130,200,'SHEARING',{fs:13,c:RED});return s+'</svg>'}
/* (4-7) stabbing and puncture */
function fig47(){let s=svgOpen(620,260,'الاختراق والثقب');s+=frameT(8,8,296,244)+frameT(316,8,296,244);
 s+=E(156,28,'BY MOVING PARTS OF MACHINERY',{fs:10})+E(464,28,'BY FLYING OBJECTS',{fs:10});
 s+=`<rect x="30" y="80" width="100" height="26" rx="6" style="${MF}"/><rect x="30" y="80" width="22" height="90" style="${MF}"/><rect x="20" y="170" width="130" height="12" style="${MF}"/><path d="M118 106V150" style="stroke:var(--fg);stroke-width:2"/>`+arrow(142,112,142,152,RED,2)+E(80,212,'Sewing machine')+E(150,132,'needle',{fs:9,a:'start',m:1});
 s+=`<rect x="200" y="50" width="80" height="50" rx="4" style="${MF}"/><rect x="230" y="100" width="20" height="24" style="${MF2}"/><path d="M240 124V170" style="stroke:var(--fg);stroke-width:3"/><rect x="200" y="186" width="90" height="12" style="${MF}"/>`+arrow(292,150,250,150,RED,2.4)+E(245,226,'Drilling machine');
 s+=`<circle cx="390" cy="130" r="40" style="${MF2}"/><path d="M350 130A40 40 0 0 1 430 130" style="fill:none;stroke:var(--fg);stroke-width:8;opacity:.6"/>`+[[440,120],[452,132],[446,146],[462,118]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.4" style="fill:var(--fg)"/>`).join('')+arrow(434,150,478,168,RED,2.4)+E(390,202,'Grinding wheel');
 s+=`<path d="M510 70H590V96H560L548 150H526L536 96H510Z" style="${MF}"/>`+arrow(540,156,540,196,RED,2.4)+E(555,228,'Staple gun')+E(552,188,'Staple',{fs:9,a:'start',m:1});
 return s+'</svg>'}
/* (4-8) impact hazards */
function fig48(){let s=svgOpen(600,250,'مخاطر الصدم');
 s+=`<ellipse cx="90" cy="210" rx="44" ry="10" style="${MF}"/><rect x="66" y="150" width="48" height="60" style="${MF}"/><path d="M90 150L120 80L196 92" style="fill:none;stroke:var(--fg);stroke-width:12;stroke-linecap:round"/><path d="M90 150L120 80L196 92" style="fill:none;stroke:var(--surface-2);stroke-width:8;stroke-linecap:round"/>`+arcArrow(90,190,44,150,40,RED,2.2);
 s+=person(232,220,{hands:[[214,140],[250,140]]})+arrow(196,108,214,148,RED,2.6)+E(90,242,'Robot');
 s+=`<rect x="330" y="160" width="220" height="24" style="${MF}"/><rect x="340" y="184" width="200" height="30" style="${MF2}"/>`+arrow(470,150,530,150,RED,2.6)+person(572,214,{hands:[[560,170],[584,168]]})+E(440,242,'Planing machine');
 s+=E(300,20,'IMPACT HAZARDS',{fs:12,c:RED});return s+'</svg>'}
/* (4-9) entanglement a, b */
function fig49(){let s=svgOpen(620,250,'الانحشار');
 s+=`<rect x="70" y="24" width="120" height="50" rx="4" style="${MF}"/><rect x="118" y="74" width="24" height="28" style="${MF2}"/><path d="M130 102V162" style="stroke:var(--fg);stroke-width:4"/><rect x="60" y="176" width="160" height="10" style="${MF}"/><path d="M80 186L70 226M200 186L210 226M140 186V226" style="stroke:var(--fg);stroke-width:2"/>`;
 s+=`<path d="M130 120Q150 126 132 134Q112 142 132 150" style="fill:none;stroke:${RED};stroke-width:4"/><path d="M134 150Q170 156 230 150" style="stroke:var(--fg);stroke-width:9;stroke-linecap:round;fill:none"/><path d="M40 64V176" style="stroke:var(--fg);stroke-width:2"/>`+E(40,56,'Trip Device',{fs:9.5})+E(140,244,'GLOVE ENTANGLEMENT',{fs:11,c:RED});
 s+=AR(140,16,'أ',{fs:13,w:700});
 for(let i=0;i<5;i++)s+=`<circle cx="${360+i*48}" cy="190" r="20" style="${MF2}"/>`;
 s+=`<rect x="330" y="166" width="260" height="6" style="fill:var(--surface-2);stroke:var(--fg)"/>`+person(470,140,{helmet:1,cs:'var(--stop-soft)',c:RED,hands:[[430,178],[420,184]],noLegs:1});
 s+=`<path d="M420 184L398 188" style="stroke:${RED};stroke-width:5"/>`+arrow(450,212,400,212,RED,2.2)+AR(460,16,'ب',{fs:13,w:700});
 return s+'</svg>'}
/* (4-10) friction and abrasion */
function fig410(){let s=svgOpen(560,230,'مخاطر الاحتكاك والتسلخ');
 s+=`<path d="M70 120A60 60 0 0 1 190 120V170H70Z" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.4"/><circle cx="130" cy="120" r="48" style="${MF2}"/><rect x="170" y="140" width="40" height="8" style="${MF}"/>`+arcArrow(130,120,36,-60,30,RED,2.4)+arrow(240,110,182,120,RED,4)+E(130,206,'Grinding Wheel');
 s+=`<rect x="330" y="80" width="190" height="90" rx="10" style="fill:var(--on-soft);stroke:var(--fg)"/><rect x="360" y="98" width="130" height="50" rx="25" style="fill:var(--surface);stroke:var(--fg);stroke-dasharray:2 2"/>`+arrow(425,40,425,94,RED,4)+E(425,206,'Sanding Machine');
 s+=E(280,226,'FRICTION AND ABRASION HAZARDS',{fs:11,c:RED});return s+'</svg>'}
/* (4-11) crushing */
function fig411(){let s=svgOpen(620,390,'مخاطر السحق');
 s+=`<rect x="20" y="40" width="30" height="120" style="fill:var(--stop-soft);stroke:var(--fg)"/>`+[60,80,100,120,140].map(y=>`<path d="M20 ${y}H50" style="stroke:var(--fg);stroke-width:.8"/>`).join('')+`<rect x="130" y="100" width="150" height="22" style="${MF}"/>`+person(80,160,{hands:[[66,120],[94,120]]})+arrow(150,90,112,90,RED,2.4);
 s+=E(150,188,'moving part / fixed structure (wall)',{fs:9.5,m:1});
 s+=`<rect x="380" y="30" width="160" height="40" style="${MF}"/><path d="M440 70H480L460 100Z" style="fill:var(--fg)"/><path d="M410 140H510V120H475L460 134L445 120H410Z" style="${MF}"/>`+arrow(560,60,560,104,RED,2.4)+E(460,188,'moving part / fixed part of machine',{fs:9.5,m:1});
 s+=`<rect x="40" y="220" width="110" height="130" style="${MF}"/><path d="M175 210V260M195 210V260" style="stroke:var(--fg);stroke-dasharray:3 2"/><rect x="165" y="260" width="40" height="44" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`+arrow(224,262,224,302,RED,2.4)+`<path d="M20 350H300" style="stroke:var(--fg);stroke-width:2"/>`+E(185,236,'Counterweight',{fs:9.5,m:1})+E(160,374,'moving part / fixed structure (floor)',{fs:9.5,m:1});
 s+=`<rect x="390" y="230" width="150" height="10" style="${MF}"/><rect x="390" y="330" width="150" height="10" style="${MF}"/><path d="M400 240L530 330M530 240L400 330" style="stroke:var(--fg);stroke-width:5"/>`+arrow(465,204,465,226,'var(--fg)',2.4)+`<circle cx="465" cy="285" r="8" style="fill:none;stroke:${RED};stroke-width:2.4"/>`+E(465,374,'between moving parts of machine',{fs:9.5,m:1});
 s+=E(310,20,'CRUSHING HAZARDS',{fs:12,c:RED});return s+'</svg>'}
/* (4-12) machine layout */
function fig412(){let s=svgOpen(560,270,'موقع المعدات في الورشة');
 s+=`<rect x="10" y="10" width="540" height="56" style="fill:var(--surface-2);stroke:var(--line)"/>`+[40,120,200,280,360,440].map(x=>`<rect x="${x}" y="18" width="62" height="40" style="fill:var(--surface);stroke:var(--fg);stroke-width:.8"/>`).join('');
 [[50,128],[50,210]].forEach(([x,y])=>{s+=`<rect x="${x}" y="${y-10}" width="300" height="32" rx="4" style="${MF}"/><rect x="${x+20}" y="${y-32}" width="60" height="22" style="${MF2}"/><path d="M${x+40} ${y-50}V${y-32}" style="stroke:var(--fg)"/><path d="M${x+22} ${y-50}H${x+70}" style="stroke:${ORG};stroke-width:4"/>`;s+=person(x+340,y+28,{goggles:1,hands:[[x+306,y-4],[x+314,y+6]],noLegs:1})});
 s+=`<path d="M60 170H480" style="stroke:${BLU};stroke-width:1.5;stroke-dasharray:6 4"/>`+E(500,174,'aisle',{fs:10,m:1});
 s+=E(80,262,'MACHINE LAYOUT',{fs:13,c:RED});return s+'</svg>'}
/* (4-13) fixed guard */
function fig413(){let s=svgOpen(460,240,'الحاجز الثابت');
 s+=`<rect x="40" y="30" width="80" height="60" rx="6" style="${MF}"/><circle cx="80" cy="60" r="12" style="${MF2}"/><circle cx="340" cy="170" r="44" style="${MF2}"/><path d="M80 48L340 126M80 72L340 214" style="stroke:var(--fg);stroke-width:2"/>`;
 s+=`<path d="M60 36L360 110Q404 170 360 230L90 96Q50 70 60 36Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:${BLU};stroke-width:2"/>`;
 for(let i=0;i<12;i++)s+=`<path d="M${80+i*24} ${42+i*6.3}L${100+i*24} ${92+i*11}" style="stroke:${BLU};stroke-width:.8"/>`;
 s+=E(60,228,'FIXED GUARD',{fs:13,c:RED,a:'start'});return s+'</svg>'}
/* (4-14) interlocked guard — tumbler dryer */
function fig414(){let s=svgOpen(330,250,'حاجز مزود بمفتاح فصل');
 s+=`<rect x="70" y="30" width="170" height="200" rx="6" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.4"/><circle cx="155" cy="120" r="56" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><circle cx="155" cy="120" r="46" style="fill:var(--blue-soft);stroke:var(--fg)"/>`;
 s+=`<rect x="206" y="112" width="14" height="16" rx="2" style="fill:${GRN};stroke:var(--fg)"/>`;
 s+=E(250,22,'INTERLOCKED GUARD',{fs:11,c:RED})+E(248,190,'Clothes Drying',{fs:9.5,a:'start',m:1})+E(248,202,'Tumbler',{fs:9.5,a:'start',m:1});
 return s+'</svg>'}
/* (4-15) adjustable guard — band saw */
function fig415(){let s=svgOpen(470,270,'الحاجز القابل للتعديل في المنشار الشريطي');
 s+=`<rect x="80" y="20" width="60" height="230" style="${MF}"/><rect x="80" y="20" width="170" height="40" style="${MF}"/><path d="M220 60V250" style="stroke:var(--fg);stroke-width:3"/><rect x="208" y="60" width="24" height="90" style="fill:${ORG};fill-opacity:.6;stroke:var(--fg)"/>`;
 s+=`<rect x="60" y="180" width="300" height="14" style="${MF}"/><rect x="190" y="150" width="56" height="30" style="fill:var(--blue-soft);stroke:${BLU}"/><rect x="250" y="166" width="100" height="14" style="fill:var(--live-soft);stroke:var(--fg)"/>`;
 s+=arrow(312,84,238,100,RED,1.8)+E(316,82,'Adjustable blade guard',{a:'start',fs:10})+arrow(330,132,250,158,RED,1.8)+E(334,130,'Transparent guard',{a:'start',fs:10})+E(354,176,'Stock',{a:'start',fs:10})+E(150,214,'Saw table',{fs:10})+E(226,236,'Blade',{fs:10,a:'start'});
 s+=`<path d="M232 60Q262 100 236 150" style="fill:none;stroke:var(--fg);stroke-dasharray:3 2"/>`+E(262,50,'Air hose',{fs:10,a:'start'});
 return s+'</svg>'}
/* (4-16) self-adjusting guard — radial arm saw */
function fig416(){let s=svgOpen(460,250,'الحاجز ذاتي التعديل في المنشار الذراعي');
 s+=`<rect x="60" y="30" width="24" height="180" style="${MF}"/><rect x="60" y="30" width="300" height="20" style="${MF}"/><rect x="200" y="50" width="40" height="40" style="${MF2}"/><circle cx="220" cy="140" r="42" style="fill:var(--surface);stroke:var(--fg);stroke-dasharray:4 3"/>`;
 s+=`<path d="M175 140A45 45 0 0 1 265 140V150H175Z" style="fill:var(--blue-soft);stroke:${BLU};stroke-width:2"/><rect x="40" y="188" width="380" height="16" style="${MF}"/><path d="M268 150L276 170M278 150L286 170M288 150L296 170" style="stroke:var(--fg);stroke-width:2"/>`;
 s+=E(166,124,'GUARD',{a:'end',fs:10})+E(304,166,'ANTI-KICKBACK',{a:'start',fs:10})+E(304,178,'DEVICE',{a:'start',fs:10})+E(220,228,'BLADE',{fs:10})+`<rect x="250" y="66" width="36" height="10" style="${MF}"/>`+E(296,74,'HANDLE',{a:'start',fs:10});
 return s+'</svg>'}
/* (4-17) press brake with light curtain */
function fig417(){let s=svgOpen(460,260,'مكبس ثني مزود بخلية كهروضوئية');
 s+=`<rect x="70" y="30" width="300" height="80" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.4"/><rect x="80" y="130" width="280" height="80" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.4"/><rect x="110" y="110" width="220" height="10" style="${MF}"/>`;
 [70,350].forEach(x=>{s+=`<rect x="${x}" y="100" width="20" height="130" style="fill:var(--surface);stroke:var(--fg)"/>`;for(let y=108;y<226;y+=12)s+=`<circle cx="${x+10}" cy="${y}" r="2.5" style="fill:var(--fg)"/>`});
 for(let y=108;y<226;y+=24)s+=`<path d="M90 ${y}H350" style="stroke:${RED};stroke-width:1;stroke-dasharray:3 4;opacity:.7"/>`;
 s+=`<rect x="400" y="120" width="40" height="30" style="${MF2}"/><path d="M420 150V240" style="stroke:var(--fg);stroke-width:3"/>`;
 s+=E(380,22,'TRIP DEVICE',{fs:11,c:RED})+E(220,250,'Photoelectric device',{fs:10,c:BLU});
 return s+'</svg>'}
/* (4-18) pullback, (4-19) restraint — drawings of the principle (the book shows photos) */
function fig418(){let s=svgOpen(460,230,'نظام السحب للخلف');
 s+=`<rect x="40" y="20" width="160" height="40" style="${MF}"/><rect x="80" y="60" width="80" height="50" style="fill:var(--surface);stroke:var(--fg)"/><rect x="60" y="180" width="140" height="20" style="${MF}"/><circle cx="260" cy="40" r="10" style="${MF2}"/>`;
 s+=person(360,210,{hands:[[270,170],[280,176]]})+`<path d="M160 70L250 40M270 40H290L274 166" style="fill:none;stroke:${BLU};stroke-width:2"/><rect x="264" y="164" width="14" height="10" style="fill:${GRN};stroke:var(--fg)"/>`+arrow(250,196,310,196,RED,2.4);
 return s+'</svg>'}
function fig419(){let s=svgOpen(460,230,'نظام الإيقاف المحدد');
 s+=`<rect x="40" y="20" width="160" height="40" style="${MF}"/><rect x="80" y="60" width="80" height="50" style="fill:var(--surface);stroke:var(--fg)"/><rect x="60" y="180" width="140" height="20" style="${MF}"/>`;
 s+=person(380,210,{hands:[[300,170],[312,176]]})+`<rect x="440" y="140" width="12" height="70" style="${MF}"/><path d="M302 172L446 160" style="stroke:${BLU};stroke-width:2"/><rect x="294" y="166" width="14" height="10" style="fill:${GRN};stroke:var(--fg)"/>`;
 s+=`<path d="M206 140V214" style="stroke:${RED};stroke-width:2;stroke-dasharray:4 3"/><path d="M212 190H292" style="stroke:var(--fg);stroke-width:1.5;stroke-dasharray:2 3"/>`;
 return s+'</svg>'}
/* (4-20) two-hand control */
function fig420(){let s=svgOpen(460,200,'التحكم باليدين الاثنتين');
 s+=`<rect x="60" y="120" width="340" height="70" rx="6" style="${MF}"/><circle cx="110" cy="140" r="14" style="fill:${GRN};stroke:var(--fg)"/><circle cx="350" cy="140" r="14" style="fill:${GRN};stroke:var(--fg)"/>`;
 s+=person(230,140,{goggles:1,hands:[[112,136],[348,136]],noLegs:1});
 return s+'</svg>'}
/* (4-21) distance guard */
function fig421(){let s=svgOpen(460,240,'الحماية بالمسافة');
 s+=`<path d="M60 200V60L300 30V170" style="fill:none;stroke:var(--fg);stroke-width:2"/>`;for(let x=72;x<300;x+=12)s+=`<path d="M${x} ${f1(200-(x-60)*0.125)}V${f1(60-(x-60)*0.125)}" style="stroke:var(--fg);stroke-width:.6"/>`;
 s+=`<ellipse cx="180" cy="180" rx="30" ry="8" style="${MF}"/><rect x="168" y="140" width="24" height="40" style="${MF}"/><path d="M180 140L210 90L260 100" style="fill:none;stroke:var(--fg);stroke-width:10;stroke-linecap:round"/><rect x="230" y="200" width="200" height="14" style="${MF}"/><rect x="320" y="120" width="30" height="40" style="${MF2}"/>`;
 s+=E(400,234,'DISTANCE GUARD',{fs:12,c:RED});return s+'</svg>'}
/* (4-22) automatic feeding */
function fig422(){let s=svgOpen(500,220,'التزويد الأوتوماتيكي');
 s+=`<circle cx="80" cy="130" r="50" style="${MF2}"/><circle cx="80" cy="130" r="20" style="${MF}"/><path d="M80 80L200 120L330 120" style="fill:none;stroke:var(--fg);stroke-width:3"/><rect x="190" y="104" width="60" height="30" style="${MF}"/><rect x="320" y="30" width="140" height="170" style="${MF}"/><rect x="350" y="80" width="80" height="30" style="${MF2}"/>`;
 s+=arrow(200,154,300,154,BLU,2.4)+E(250,174,'feeder',{fs:10,m:1});return s+'</svg>'}
/* (4-23) a push stick, b transparent shield on grinder */
function fig423(){let s=svgOpen(600,230,'عصا الدفع وحاجز شفاف على آلة الجلخ');
 s+=`<rect x="20" y="140" width="260" height="20" style="${MF}"/><path d="M140 140A26 26 0 0 1 190 140" style="fill:var(--surface);stroke:var(--fg)"/><rect x="60" y="126" width="120" height="14" style="fill:var(--live-soft);stroke:var(--fg)"/><path d="M40 90L80 130" style="stroke:${ORG};stroke-width:7;stroke-linecap:round"/>`+E(60,80,'Push stick',{fs:11})+AR(150,210,'أ',{fs:13,w:700});
 s+=`<circle cx="430" cy="140" r="44" style="${MF2}"/><path d="M386 140A44 44 0 0 1 474 140" style="fill:none;stroke:var(--fg);stroke-width:9;opacity:.5"/><rect x="470" y="150" width="40" height="8" style="${MF}"/><rect x="480" y="60" width="62" height="60" rx="6" style="fill:var(--blue-soft);fill-opacity:.6;stroke:${RED};stroke-width:3"/>`+person(560,210,{goggles:1,hands:[[508,150],[516,156]],noLegs:1})+AR(430,210,'ب',{fs:13,w:700});
 return s+'</svg>'}

/* =====================================================================
   small UI helpers (as in the reference labs)
   ===================================================================== */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة من البداية.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let s=steps[i];while(s&&s.done&&s.done(getW())){i++;s=steps[i]}draw()}}}
const pbHTML=(id,color,cap,label)=>`<button class="pb ${color}" id="${id}" aria-label="${label}"><span class="cap">${cap}</span><small>${label}</small></button>`;
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const segHTML=(attr,items,cur,wrap)=>`<div class="seg" role="group"${wrap?' style="flex-wrap:wrap"':''}>${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const setSeg=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
/* generic «صنّف» list: items [[text, catIndex, why]], cats [labels] */
function sortBox(host,o,onAns){const ans={};
 const draw=()=>{host.innerHTML=o.items.map((it,i)=>{const a=ans[i];return `<div style="border:1px solid var(--line);border-radius:12px;padding:8px 12px;margin-top:8px;background:var(--surface)"><p style="margin:0 0 6px">${it[0]}</p><div class="seg" role="group" style="flex-wrap:wrap">${o.cats.map((c,j)=>`<button data-si="${i}" data-sc="${j}" aria-pressed="${a!=null&&a===j}"${a!=null?' disabled':''} style="${a!=null&&j===it[1]?'outline:2px solid var(--on);':''}${a!=null&&a===j&&j!==it[1]?'outline:2px solid var(--stop);':''}">${c}</button>`).join('')}</div>${a!=null?`<p class="sub" style="margin:6px 0 0"><b style="color:${a===it[1]?'var(--on)':'var(--stop)'}">${a===it[1]?'صحيح.':'ليس كذلك.'}</b> ${it[2]}</p>`:''}</div>`}).join('')+
  `<p class="sub" style="margin-top:10px">${Object.keys(ans).length===o.items.length?`أصبت <b class="ltr">${o.items.filter((it,i)=>ans[i]===it[1]).length} / ${o.items.length}</b>. `:''}<button class="btn" data-sreset>ابدأ من جديد</button></p>`};
 host.addEventListener('click',e=>{const b=e.target.closest('[data-si]');if(b&&!b.disabled){ans[+b.dataset.si]=+b.dataset.sc;draw();if(onAns)onAns(o.items.filter((it,i)=>ans[i]===it[1]).length,Object.keys(ans).length)}
  if(e.target.closest('[data-sreset]')){Object.keys(ans).forEach(k=>delete ans[k]);draw();if(onAns)onAns(0,0)}});draw()}

/* =====================================================================
   LAB u4-l1 — «اكتشف الخطر» workshop scene + wrench pull + error sort
   ===================================================================== */
const HZ=[
 {id:'file',h:1,hit:[286,224,72,24],m:[324,239],t:'مبرد بلا مقبض',x:'«لا تستعمل المبارد (Files) التي ليس لها مقابض.» (البند 12، ص 60)'},
 {id:'chisel',h:1,hit:[364,222,72,26],m:[400,238],t:'أجنة رأسها مفلطح ومشرشر',x:'«لا تستعمل أدوات الصدم (الشواكيش) ذات الرؤوس المفلطحة أو الهشة» (البند 9، ص 60)، ومن الأخطاء «استعمال أجنة برأس مفلطحة أو مشرشرة» (ص 62).'},
 {id:'hammer',h:1,hit:[438,214,72,34],m:[470,234],t:'شاكوش يده مشروخة ورأسه غير مثبت',x:'«لا تستعمل الأدوات ذات المقابض الخشبية المتشققة أو المتشظية» (البند 10، ص 60)، ومن الأخطاء «استعمال شاكوش بيد غير مثبتة جيدا في الرأس أو بها شروخ» (ص 62).'},
 {id:'hand',h:1,hit:[468,188,86,48],m:[496,212],t:'يمسك القطعة بيده وهو ينشرها',x:'«ثبت القطعة المراد العمل عليها على طاولة ذات سطح مستو ولا تمسكها في يدك وتعمل عليها.» (البند 14، ص 60) — المِلزمة بجانبه على الطاولة.'},
 {id:'grinder',h:1,hit:[642,196,158,104],m:[704,232],t:'جلخ بلا غطاء حماية والعامل بلا نظارة',x:'«يجب التأكد من وجود أغطية الحماية في أماكنها على ماكينات الجلخ قبل استعمالها مع ضرورة استخدام نظارات السلامة Safety Goggles للوقاية من الشظايا المتطايرة.» (البند 25، ص 61)'},
 {id:'hose',h:1,hit:[84,396,46,32],m:[110,410],t:'يلوي خرطوم الهواء ليوقف الهواء',x:'«لا تقم بلي (لوي) خرطوم الهواء الموصل بالعدد اليدوية من أجل إيقاف تزويد الهواء بل يجب إغلاق محبس الهواء.» (البند 22، ص 61) — المحبس على الجدار.'},
 {id:'pocket',h:1,hit:[150,382,28,44],m:[164,402],t:'مفك حاد في جيب الملابس',x:'«لا تحفظ العدد في جيبك أثناء العمل ويفضل وضعها في حقيبة خاصة…» (البند 18، ص 61)، ومن الأخطاء «وضع العدد والأدوات ذات الأحرف الحادة كالسكين بجيوب الملابس بدون جراب واقي» (ص 62).'},
 {id:'cable',h:1,hit:[222,420,132,46],m:[330,440],t:'مثقاب كهربائي عازل سلكه تالف',x:'«يجب التأكد من أن جميع العدد الكهربائية اليدوية موصولة بالأرض Grounded وأن المادة العازلة علي الأسلاك الكهربائية الخاصة بها سليمة.» (البند 19، ص 61)'},
 {id:'box',h:1,hit:[374,386,96,66],m:[420,418],t:'عدد حادة في الصندوق وحافتها إلى أعلى',x:'من الأخطاء: «وضع الأدوات والعدد ذات الأحرف الحادة أو المسننة في صندوق العدة وحافتها الحادة المتجهة إلى أعلى.» (ص 62)'},
 {id:'wham',h:1,hit:[476,372,92,88],m:[506,420],t:'يطرق بمفتاح الصواميل',x:'من الأخطاء: «استعمال مفتاح الصواميل كمطرقة» (ص 62)، و«لا تستعمل أبدا عدة غير ملائمة للعمل» (البند 2، ص 59).'},
 {id:'ext',h:1,hit:[640,378,150,40],m:[722,396],t:'ماسورة لإطالة يد مفتاح الربط',x:'«تجنب استعمال وصلات لإطالة يد مفاتيح الربط حتى لا تتعرض للإصابة.» (البند 16، ص 60)'},
 {id:'board',h:0,hit:[16,26,160,118],m:[95,85],t:'لوحة العدد على الحائط',x:'هذا صحيح: «حال الانتهاء من العمل بها يجب تنظيفها ووضعها في مكانها المعد لها (صندوق العدة) أو تثبيتها علي الحائط.» (البند 13، ص 60)'},
 {id:'tag',h:0,hit:[16,150,164,44],m:[95,172],t:'عدة تالفة عليها ملصق',x:'هذا صحيح: العدة التالفة «يتم وضع ملصق خاص» عليها «ولا يتم استعمالها» (البند 28، ص 62، والبند 5، ص 60).'},
 {id:'insul',h:0,hit:[194,34,104,118],m:[244,92],t:'مفك بمقبض معزول عند لوحة الكهرباء',x:'هذا صحيح: «للعمل في الأجهزة الكهربائية تستعمل العدد ذات المقابض المعزولة (Insulated Handles).» (البند 15، ص 60)'},
 {id:'vise',h:0,hit:[582,202,66,42],m:[614,222],t:'ملزمة تثبت القطعة',x:'هذا صحيح: تثبيت القطعة في ملزمة على طاولة مستوية هو ما يطلبه البند 14 (ص 60).'}
];
const NHZ=HZ.filter(z=>z.h).length;
function sceneSVG(){let s=svgOpen(800,470,'ورشة فيها مخالفات لتعليمات السلامة');
 s+=`<rect x="0" y="0" width="800" height="300" style="fill:var(--surface)"/><rect x="0" y="300" width="800" height="170" style="fill:var(--surface-2)"/><path d="M0 300H800" style="stroke:var(--line);stroke-width:2"/>`;
 // tool board (safe)
 s+=`<rect x="20" y="30" width="150" height="110" rx="4" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.2"/>`;
 for(let y=42;y<136;y+=14)for(let x=30;x<166;x+=14)s+=`<circle cx="${x}" cy="${y}" r="1.2" style="fill:var(--muted)"/>`;
 s+=`<path d="M42 56V120" style="stroke:var(--fg);stroke-width:4"/><rect x="30" y="46" width="24" height="11" rx="2" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
 s+=`<path d="M74 60V122" style="stroke:var(--fg);stroke-width:5"/><circle cx="74" cy="54" r="8" style="fill:none;stroke:var(--fg);stroke-width:3"/>`;
 s+=`<rect x="98" y="48" width="9" height="22" rx="3" style="fill:${BLU}"/><path d="M102.5 70V114" style="stroke:var(--fg);stroke-width:2.5"/>`;
 s+=`<path d="M130 52L146 114M146 52L130 114" style="stroke:var(--fg);stroke-width:3"/>`;
 // shelf with tagged damaged tool (safe)
 s+=`<path d="M20 186H172" style="stroke:var(--fg);stroke-width:4"/><path d="M50 180H112" style="stroke:var(--live);stroke-width:6"/><rect x="112" y="170" width="12" height="16" style="fill:var(--surface-2);stroke:var(--fg)"/><rect x="130" y="158" width="34" height="20" rx="3" style="fill:var(--stop-soft);stroke:${RED};stroke-width:1.5"/><path d="M124 176L130 168" style="stroke:var(--fg)"/><path d="M140 162L154 174M154 162L140 174" style="stroke:${RED};stroke-width:2"/>`;
 // electrical panel + insulated screwdriver (safe)
 s+=`<rect x="200" y="40" width="64" height="100" rx="3" style="${MF}"/><polygon points="236,58 222,92 234,92 226,120 246,82 234,82 242,58" style="fill:${ORG};stroke:var(--fg)"/>`;
 s+=`<circle cx="284" cy="46" r="3" style="fill:var(--fg)"/><rect x="279" y="50" width="11" height="34" rx="4" style="fill:${ORG};stroke:var(--fg)"/><path d="M284.5 84V128" style="stroke:var(--fg);stroke-width:2.5"/>`;
 // wall air outlet with valve
 s+=`<rect x="30" y="220" width="20" height="14" style="${MF}"/><path d="M28 214H52" style="stroke:${RED};stroke-width:4"/>`;
 // worker A behind the bench (holds the piece in his hand while sawing)
 s+=person(520,272,{hands:[[492,226],[548,222]],noLegs:1});
 s+=`<rect x="478" y="216" width="22" height="13" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M548 222L490 212M548 222L548 200L490 192L490 212" style="fill:none;stroke:var(--fg);stroke-width:2"/>`;
 // workbench
 s+=`<rect x="285" y="244" width="360" height="12" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.4"/><rect x="296" y="256" width="10" height="44" style="${MF}"/><rect x="624" y="256" width="10" height="44" style="${MF}"/>`;
 // file without handle
 s+=`<rect x="306" y="235" width="48" height="8" style="fill:var(--surface-2);stroke:var(--fg)"/>`+[312,318,324,330,336,342,348].map(x=>`<path d="M${x} 235L${x+3} 243" style="stroke:var(--fg);stroke-width:.8"/>`).join('')+`<polygon points="306,236 306,242 290,239" style="fill:var(--fg)"/>`;
 // chisel with mushroomed head
 s+=`<rect x="382" y="235" width="40" height="7" style="fill:var(--surface-2);stroke:var(--fg)"/><polygon points="422,235 432,238.5 422,242" style="fill:var(--fg)"/><polygon points="382,230 377,228 379,233 372,233 377,237 371,241 378,242 376,247 382,246" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
 // hammer with cracked handle, loose head
 s+=`<rect x="444" y="236" width="48" height="7" rx="2" style="fill:var(--live-soft);stroke:var(--fg)"/><path d="M452 236L456 240L452 243M464 236L468 239L464 243" style="fill:none;stroke:${RED};stroke-width:1.5"/><rect x="490" y="222" width="13" height="26" rx="2" transform="rotate(14 496 235)" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
 // vise holding a block (safe)
 s+=`<rect x="590" y="236" width="48" height="8" style="${MF}"/><rect x="594" y="212" width="10" height="24" style="${MF}"/><rect x="624" y="212" width="10" height="24" style="${MF}"/><rect x="604" y="217" width="20" height="13" style="fill:${ORG};stroke:var(--fg)"/><path d="M634 224H650M650 216V232" style="stroke:var(--fg);stroke-width:2.5"/>`;
 // bench grinder without guard; worker B without goggles
 s+=`<rect x="692" y="244" width="16" height="52" style="${MF}"/><rect x="680" y="294" width="40" height="6" style="${MF}"/><rect x="680" y="216" width="40" height="28" rx="4" style="${MF}"/><circle cx="668" cy="230" r="22" style="${MF2}"/><circle cx="732" cy="230" r="22" style="${MF2}"/>`;
 [[748,252],[754,258],[758,250],[764,260]].forEach(p=>{s+=`<path d="M742 244L${p[0]} ${p[1]}" style="stroke:${ORG};stroke-width:1.6"/>`});
 s+=person(780,300,{hands:[[756,236],[760,244]]});
 // floor: air hose kinked by worker C, screwdriver in his pocket
 s+=`<path d="M40 234V300Q44 396 106 410L126 402L116 420Q170 446 208 440" style="fill:none;stroke:var(--fg);stroke-width:5;stroke-linejoin:round"/><rect x="208" y="430" width="30" height="16" rx="3" style="${MF}"/>`;
 s+=person(150,452,{hands:[[122,404],[128,414]]});
 s+=`<rect x="156" y="414" width="13" height="10" style="fill:var(--blue-soft);stroke:${BLU}"/><path d="M162 414L168 392" style="stroke:var(--fg);stroke-width:2.2"/><polygon points="168,392 166,384 171,385" style="fill:var(--fg)"/>`;
 // drill with damaged cable
 s+=`<rect x="250" y="428" width="40" height="15" rx="4" style="${MF}"/><rect x="268" y="443" width="10" height="16" style="${MF}"/><rect x="240" y="432" width="10" height="8" style="${MF2}"/><path d="M226 436H240" style="stroke:var(--fg);stroke-width:2"/>`;
 s+=`<path d="M273 459Q300 466 320 446" style="fill:none;stroke:var(--fg);stroke-width:4"/><path d="M322 444L334 436M323 446L336 440M321 442L332 432" style="stroke:${RED};stroke-width:1.6"/><path d="M336 436Q350 400 352 340V300" style="fill:none;stroke:var(--fg);stroke-width:4"/><rect x="344" y="282" width="18" height="18" style="${MF2}"/>`;
 // toolbox with sharp edges up
 s+=`<rect x="380" y="420" width="80" height="30" rx="3" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1.4"/><path d="M380 420L372 398H452L460 420" style="fill:none;stroke:var(--fg);stroke-width:1.2"/>`;
 s+=`<polygon points="392,420 398,396 404,420" style="fill:var(--surface);stroke:var(--fg)"/><polygon points="410,420 418,392 420,420" style="fill:var(--surface);stroke:var(--fg)"/><path d="M428 420L432 410L436 420L440 410L444 420L448 410L452 420" style="fill:none;stroke:var(--fg);stroke-width:1.4"/>`;
 // worker D hammering with a wrench
 s+=person(548,456,{hands:[[518,408],[524,404]]});
 s+=`<path d="M520 406L500 428" style="stroke:var(--fg);stroke-width:5"/><circle cx="498" cy="431" r="7" style="fill:none;stroke:var(--fg);stroke-width:3"/><rect x="492" y="438" width="6" height="16" style="${MF}"/><path d="M482 436L488 440M480 446L488 446M484 456L490 450" style="stroke:${RED};stroke-width:1.6"/>`;
 // pipe + flange, wrench with extension pipe, worker E
 s+=`<rect x="600" y="420" width="110" height="20" style="${MF}"/><rect x="650" y="406" width="12" height="48" style="${MF}"/><rect x="651" y="400" width="10" height="8" style="${MF2}"/><path d="M656 402L706 396" style="stroke:var(--fg);stroke-width:5"/><path d="M700 396L784 388" style="stroke:var(--fg);stroke-width:10;stroke-linecap:round"/><path d="M700 396L784 388" style="stroke:var(--surface);stroke-width:6;stroke-linecap:round"/>`;
 s+=person(770,458,{hands:[[766,392],[778,394]]});
 s+=`<g id="hzMk"></g>`;
 HZ.forEach(z=>{s+=`<rect data-h="${z.id}" x="${z.hit[0]}" y="${z.hit[1]}" width="${z.hit[2]}" height="${z.hit[3]}" style="fill:var(--fg);fill-opacity:0;cursor:pointer"><title>${z.t}</title></rect>`});
 return s+'</svg>'}

function hazardLab(el){
 const st={found:{},safe:{},all:false,hint:null},w={found:0,safe:0,wGood:0,wBad:0,sorted:0};
 el.innerHTML=`<div class="grid">
  <div class="panel c12"><h2>نشاط: اكتشف الخطر في الورشة <small>مبني على تعليمات وإرشادات السلامة والأخطاء الشائعة ص 59–63</small></h2>
   <p class="sub">في هذه الورشة <b class="ltr">${NHZ}</b> مخالفات لتعليمات السلامة في الكتاب، وفيها أيضاً أشياء صحيحة. اضغط على أي شيء في الصورة تظنه مخالفة.</p>
   <div class="wrap-in" style="align-items:center;padding-top:0"><div class="reads" style="margin-inline-start:0"><div class="read"><span>المخالفات التي وجدتها</span><b id="hzN">0 / ${NHZ}</b></div><div class="read"><span>أشياء صحيحة تعرفت عليها</span><b id="hzS">0</b></div></div>
    <button class="btn" id="hzHint">تلميح</button><button class="btn" id="hzAll">اعرض كل المخالفات</button><button class="btn" id="hzRs">ابدأ من جديد</button></div>
   <div class="svgbox" id="hzv" style="max-width:820px;margin-inline:auto">${sceneSVG()}</div>
   <div class="callout" id="hzMsg">اضغط على شيء في الصورة.</div></div>
  <div class="panel c7"><h2>ما وجدته</h2><ol id="hzList" style="padding-inline-start:22px;margin:6px 0"></ol><p class="sub" id="hzEmpty">لم تجد شيئاً بعد.</p></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
  <div class="panel c12"><h2>مفتاح الربط واتجاه الشد <small>مبني على الشكل (4-2) والبند 17 ص 60</small></h2>
   <p class="sub">«ثبت مفتاح الربط ذو الفكين الثابت والمتحرك – (Movable Jaw Wrench) وامسك يده جيدا واسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر حتي يكون الضغط على الجزء الثابت من المفتاح وليس الجزء المتحرك الذي من الممكن أن ينكسر ويسبب إصابة.» الرسم من فوق: أنت تقف أسفل الرسم.</p>
   <div class="wrap-in" style="align-items:flex-end"><div><div class="sub">وضع المفتاح على الصامولة</div>${segHTML('wf',[[0,'الفك الثابت بعيد عنك (كما في الشكل)'],[1,'المفتاح مقلوب: الفك الثابت قريب منك']],0,1)}</div>
    <div class="pbs">${pbHTML('wPull','green','↓','اسحب المقبض نحوك')}${pbHTML('wPush','black','↑','ادفع المقبض بعيداً عنك')}</div></div>
   <div class="svgbox" id="wv" style="max-width:520px;margin-inline:auto"></div>
   <div class="legend"><span><i style="background:var(--on)"></i>الفك الذي يقع عليه الضغط (الثابت)</span><span><i style="background:var(--stop)"></i>الضغط على الفك المتحرك</span></div>
   <div class="callout" id="wMsg">اختر وضع المفتاح، ثم اسحب أو ادفع المقبض.</div></div>
  <div class="panel c12"><h2>نشاط: صنّف الخطأ <small>الأخطاء في استعمال العدد اليدوية ص 62</small></h2><p class="sub">كل خطأ مما يلي ذكره الكتاب مثالاً على نوع من الأنواع الأربعة. اختر نوعه.</p><div id="srt"></div></div>
 </div>`;
 const $=s=>el.querySelector(s);
 const gs=stepsUI($('#gs'),[
  {t:'ابحث عن ثلاث مخالفات',x:'اضغط على ما تراه مخالفاً لتعليمات السلامة في الصورة.',done:w=>w.found>=3},
  {t:'تعرّف على شيء صحيح',x:'في الورشة أشياء صحيحة أيضاً (مثل مكان حفظ العدد). اضغط على واحد منها.',done:w=>w.safe>=1},
  {t:'أكمل المخالفات',x:`ابحث عن بقية المخالفات حتى تصل إلى ${NHZ}. استعمل «تلميح» إذا احتجت.`,done:w=>w.found>=NHZ},
  {t:'اسحب المفتاح بالطريقة الصحيحة',x:'في لوحة مفتاح الربط: المفتاح كما في الشكل، ثم «اسحب المقبض نحوك».',done:w=>w.wGood},
  {t:'جرّب الطريقة الخاطئة',x:'ادفع المقبض بعيداً عنك، أو اقلب المفتاح واسحب: على أي فك يقع الضغط الآن؟',done:w=>w.wBad},
  {t:'صنّف الأخطاء',x:'في نشاط «صنّف الخطأ» أجب عن ستة أخطاء على الأقل إجابة صحيحة.',done:w=>w.sorted>=6}
 ],()=>w);
 function marks(){let s='';
  HZ.forEach((z,i)=>{const f=st.found[z.id]||st.safe[z.id],show=f||(st.all&&z.h);if(!show)return;const c=z.h?RED:GRN,n=z.h?HZ.filter(q=>q.h).indexOf(z)+1:'';
   s+=`<circle cx="${z.m[0]}" cy="${z.m[1]}" r="22" style="fill:none;stroke:${c};stroke-width:3${f?'':';stroke-dasharray:5 4'}"/><circle cx="${z.m[0]+19}" cy="${z.m[1]-19}" r="9" style="fill:${c}"/>`+(z.h?E(z.m[0]+19,z.m[1]-15.5,n,{fs:10,c:'var(--surface)'}):`<path d="M${z.m[0]+15} ${z.m[1]-19}l3 3l5 -6" style="fill:none;stroke:var(--surface);stroke-width:2"/>`)});
  if(st.hint&&!st.found[st.hint]){const z=HZ.find(q=>q.id===st.hint);s+=`<circle cx="${z.m[0]}" cy="${z.m[1]}" r="18" style="fill:none;stroke:${ORG};stroke-width:3"><animate attributeName="r" values="14;30;14" dur="1.2s" repeatCount="indefinite"/></circle>`}
  $('#hzMk').innerHTML=s;
  const L=HZ.filter(z=>st.found[z.id]||st.safe[z.id]||(st.all&&z.h));
  $('#hzList').innerHTML=L.map(z=>`<li style="margin:6px 0;${z.h?'':'list-style:none;margin-inline-start:-18px'}"><b style="color:${z.h?'var(--stop)':'var(--on)'}">${z.h?'':'✓ '}${z.t}</b>${!st.found[z.id]&&!st.safe[z.id]?' <span class="sub">(لم تجده بنفسك)</span>':''}<br><span class="sub">${z.x}</span></li>`).join('');
  $('#hzEmpty').style.display=L.length?'none':'';
  w.found=Object.keys(st.found).length;w.safe=Object.keys(st.safe).length;
  $('#hzN').textContent=w.found+' / '+NHZ;$('#hzS').textContent=w.safe;gs.check()}
 $('#hzv').addEventListener('click',e=>{const r=e.target.closest('[data-h]');if(!r)return;const z=HZ.find(q=>q.id===r.dataset.h);
  if(z.h){const was=st.found[z.id];st.found[z.id]=1;if(st.hint===z.id)st.hint=null;$('#hzMsg').innerHTML=`<b style="color:var(--stop)">${was?'وجدتها من قبل':'مخالفة'}: ${z.t}.</b> ${z.x}`+(Object.keys(st.found).length===NHZ?' <b>ممتاز، وجدت كل المخالفات.</b>':'')}
  else{st.safe[z.id]=1;$('#hzMsg').innerHTML=`<b style="color:var(--on)">ليست مخالفة: ${z.t}.</b> ${z.x}`}
  marks()});
 $('#hzHint').addEventListener('click',()=>{const z=HZ.find(q=>q.h&&!st.found[q.id]);st.hint=z?z.id:null;$('#hzMsg').innerHTML=z?'انظر إلى الدائرة البرتقالية المتحركة: فيها مخالفة لم تجدها بعد.':'وجدت كل المخالفات.';marks()});
 $('#hzAll').addEventListener('click',()=>{st.all=true;$('#hzMsg').innerHTML='الدوائر المتقطعة = مخالفات لم تجدها بنفسك. اقرأ سبب كل واحدة في القائمة.';marks()});
 $('#hzRs').addEventListener('click',()=>{st.found={};st.safe={};st.all=false;st.hint=null;$('#hzMsg').innerHTML='اضغط على شيء في الصورة.';marks()});
 marks();
 /* wrench */
 let flip=0,anim=null;
 const wDraw=(ang,res)=>{$('#wv').innerHTML=wrenchSVG({flip,ang,labels:1,you:1,load:res?res.load:'',crack:res&&res.load==='mov',pull:res?res.dir:(flip?0:1),good:res?res.good:undefined})};
 wDraw(0,null);
 el.querySelectorAll('[data-wf]').forEach(b=>b.addEventListener('click',()=>{flip=+b.dataset.wf;setSeg(el,'wf',flip);anim=null;wDraw(0,null);$('#wMsg').innerHTML=flip?'المفتاح الآن مقلوب: الفك الثابت في جهتك والفك المتحرك بعيد عنك. اسحب أو ادفع وانظر على أي فك يقع الضغط.':'المفتاح كما في الشكل (4-2): الفك الثابت بعيد عنك والفك المتحرك في جهتك.'}));
 function act(dir){const toward=dir>0,fixedLoaded=(toward===!flip);
  const res={dir,load:fixedLoaded?'fixed':'mov',good:fixedLoaded&&toward?true:fixedLoaded?null:false};
  if(res.good===true){w.wGood=1}else if(res.good===false){w.wBad=1}
  const t0=performance.now(),target=dir*14;anim=t0;
  const step=now=>{if(anim!==t0||!document.body.contains(el))return;const p=Math.min(1,(now-t0)/600);wDraw(target*p,p>=1?res:{dir,load:'',good:undefined});if(p<1)requestAnimationFrame(step);else{
   $('#wMsg').innerHTML=res.good===true?'<b style="color:var(--on)">صحيح.</b> سحبت المقبض نحوك والفك الثابت بعيد عنك (كما في الشكل 4-2)، فوقع الضغط على الجزء الثابت من المفتاح.':
    res.good===false?`<b style="color:var(--stop)">خطأ.</b> ${toward?'المفتاح مقلوب، فصار السحب نحوك':'دفعت المقبض بعيداً عنك، و'}يقع الضغط الآن على الفك المتحرك «الذي من الممكن أن ينكسر ويسبب إصابة» (ص 60). ${toward?'اقلب المفتاح ليصير كما في الشكل.':'اسحب المقبض نحوك.'}`:
    '<b style="color:var(--live)">الضغط هنا على الفك الثابت، لكنك تدفع المقبض بعيداً عنك.</b> والكتاب يقول: «اسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر». الأفضل: ضع المفتاح كما في الشكل (4-2) واسحب نحوك.';gs.check()}};
  requestAnimationFrame(step)}
 $('#wPull').addEventListener('click',()=>act(1));$('#wPush').addEventListener('click',()=>act(-1));
 /* sort */
 const C=['عدد غير مناسبة للعمل','عدد تالفة','استعمال غير صحيح','وضع العدد في أماكن غير مأمونة'];
 const I=[['استعمال سكين كمفك',0],['استعمال منشار للقطع وسلاحه غير مسنون',1],['إلقاء العدد على الأرض أو على أسطح عالية معرضة للسقوط',3],['جذب السكين في اتجاه الشخص أثناء قطع بعض المواد',2],['استعمال المبرد كرافعة',0],['استعمال أجنة برأس مفلطحة أو مشرشرة',1],['تقطيع مسامير أو أسلاك معدنية بمنشار للخشب',2],['وضع السكين في جيب الملابس بدون جراب واقي',3],['استعمال أجنة في فك الصواميل',0],['استعمال شاكوش بيد غير مثبتة جيدا في الرأس أو بها شروخ',1],['وضع العدد الحادة في صندوق العدة وحافتها الحادة إلى أعلى',3],['استعمال مفتاح الصواميل كمطرقة',0]];
 sortBox($('#srt'),{cats:C,items:I.map(([t,c])=>[t,c,`في الكتاب تحت «${C[c]}» (ص 62).`])},(ok)=>{w.sorted=ok;gs.check()});
}

/* =====================================================================
   LAB u4-l2 — moving belts / chains / gears / rollers: nip points
   ===================================================================== */
const nrm=(x,y)=>{const l=Math.hypot(x,y)||1;return [x/l,y/l]};
/* wedge (danger zone) between an incoming strand (from T along u) and a wheel surface (centre c, radius r, side s) */
function wedge(T,u,c,r,s,L){const a0=Math.atan2(T[1]-c[1],T[0]-c[0]),a2=a0+s*(L/r),P=[c[0]+r*Math.cos(a2),c[1]+r*Math.sin(a2)],Q=[T[0]+u[0]*L,T[1]+u[1]*L];
 const m=[(T[0]*0.6+P[0]+Q[0])/2.6,(T[1]*0.6+P[1]+Q[1])/2.6];return {T,poly:[T,Q,P],m,out:nrm(m[0]-T[0],m[1]-T[1])}}
function wedge2(T,c1,r1,s1,c2,r2,s2,L){const a1=Math.atan2(T[1]-c1[1],T[0]-c1[0])+s1*L/r1,a2=Math.atan2(T[1]-c2[1],T[0]-c2[0])+s2*L/r2,P=[c1[0]+r1*Math.cos(a1),c1[1]+r1*Math.sin(a1)],Q=[c2[0]+r2*Math.cos(a2),c2[1]+r2*Math.sin(a2)];
 const m=[(T[0]*0.6+P[0]+Q[0])/2.6,(T[1]*0.6+P[1]+Q[1])/2.6];return {T,poly:[T,P,Q],m,out:nrm(m[0]-T[0],m[1]-T[1])}}
const MECH={
 belt:{name:'سير وبكرتان',fig:'الشكل (4-4) ص 63',build(){const c1=[160,170],r1=42,c2=[440,170],r2=78,G=loopGeo(c1,r1,c2,r2);
   const u=(a,b)=>nrm(b[0]-a[0],b[1]-a[1]);
   return {G,c1,r1,c2,r2,nips:[
    Object.assign(wedge(G.P2t,u(G.P2t,G.P1t),c2,r2,-1,54),{id:'a',inRun:d=>d>0}),
    Object.assign(wedge(G.P1b,u(G.P1b,G.P2b),c1,r1,-1,54),{id:'b',inRun:d=>d>0}),
    Object.assign(wedge(G.P1t,u(G.P1t,G.P2t),c1,r1,1,54),{id:'c',inRun:d=>d<0}),
    Object.assign(wedge(G.P2b,u(G.P2b,G.P1b),c2,r2,1,54),{id:'d',inRun:d=>d<0})]}},
  moving(g,th){return pulley(g.c1[0],g.c1[1],g.r1,th,0)+pulley(g.c2[0],g.c2[1],g.r2,th*g.r1/g.r2,6)+`<path d="${g.G.path}" style="fill:none;stroke:var(--fg);stroke-width:7;stroke-linejoin:round"/><path d="${g.G.path}" style="fill:none;stroke:var(--surface);stroke-width:3;stroke-dasharray:10 14;stroke-dashoffset:${f1(-th*D2R*g.r1)}"/>`},
  arrow(g,d){return arcArrow(g.c2[0],g.c2[1],g.r2+16,d>0?-40:40,d>0?40:-40,'var(--blue)',2.4)},
  guard:'<path d="M100 92H520V258H100Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:2.5"/>'},
 chain:{name:'جنزير وترس',fig:'الشكل (4-4) ص 63',build(){const g=MECH.belt.build();g.r1=50;g.r2=70;g.G=loopGeo(g.c1,50,g.c2,70);const G=g.G,u=(a,b)=>nrm(b[0]-a[0],b[1]-a[1]);
   g.nips=[Object.assign(wedge(G.P2t,u(G.P2t,G.P1t),g.c2,70,-1,54),{id:'a',inRun:d=>d>0}),Object.assign(wedge(G.P1b,u(G.P1b,G.P2b),g.c1,50,-1,54),{id:'b',inRun:d=>d>0}),Object.assign(wedge(G.P1t,u(G.P1t,G.P2t),g.c1,50,1,54),{id:'c',inRun:d=>d<0}),Object.assign(wedge(G.P2b,u(G.P2b,G.P1b),g.c2,70,1,54),{id:'d',inRun:d=>d<0})];return g},
  moving(g,th){return sprocket(g.c1[0],g.c1[1],g.r1,16,th)+sprocket(g.c2[0],g.c2[1],g.r2,22,th*g.r1/g.r2)+`<path d="${g.G.path}" style="fill:none;stroke:var(--fg);stroke-width:8;stroke-dasharray:8 3;stroke-dashoffset:${f1(-th*D2R*g.r1)}"/>`},
  arrow(g,d){return arcArrow(g.c2[0],g.c2[1],g.r2+16,d>0?-40:40,d>0?40:-40,'var(--blue)',2.4)},
  guard:'<path d="M98 92H522V258H98Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:2.5"/>'},
 rack:{name:'ترس وجريدة مسننة',fig:'الشكل (4-4) ص 63',build(){const c=[320,140],R=70;
   return {c,R,nips:[Object.assign(wedge([344,205],[1,0],c,R,-1,48),{id:'r',inRun:d=>d>0}),Object.assign(wedge([296,205],[-1,0],c,R,1,48),{id:'l',inRun:d=>d<0})]}},
  moving(g,th){const pitch=2*Math.PI*64/20,sh=((-th*D2R*64)%pitch+pitch)%pitch;let rk=`M${f1(20+sh-pitch*2)} 232V214`;for(let x=20+sh-pitch*2;x<640;x+=pitch)rk+=`H${f1(x+pitch*0.18)}L${f1(x+pitch*0.3)} 203H${f1(x+pitch*0.62)}L${f1(x+pitch*0.74)} 214`;rk+=`H660V232Z`;
   return `<g transform="translate(${g.c[0]} ${g.c[1]}) rotate(${f1(th+4.5)})"><path d="${gearD(g.R,20,10)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/><circle r="${g.R*0.4}" style="fill:none;stroke:var(--fg)"/><path d="M${-g.R*0.4} 0H${g.R*0.4}" style="stroke:var(--fg);stroke-width:2"/><circle r="8" style="fill:var(--surface);stroke:var(--fg)"/></g><path d="${rk}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/><path d="M0 232H640" style="stroke:var(--fg)"/>`},
  guard:'<path d="M220 40H420V244H220Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:2.5"/>'},
 gears:{name:'ترسان متعشقان',fig:'إضافة توضيحية (ليست شكلاً في الكتاب)',build(){const c1=[230,170],c2=[380,170],R=80,T1=[305,142.2],T2=[305,197.8];
   return {c1,c2,R,nips:[Object.assign(wedge2(T1,c1,R,-1,c2,R,1,40),{id:'t',inRun:d=>d>0}),Object.assign(wedge2(T2,c1,R,1,c2,R,-1,40),{id:'b',inRun:d=>d<0})]}},
  moving(g,th){const gg=(c,a)=>`<g transform="translate(${c[0]} ${c[1]}) rotate(${f1(a)})"><path d="${gearD(g.R,20,10)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/><circle r="${g.R*0.42}" style="fill:none;stroke:var(--fg)"/><path d="M${-g.R*0.42} 0H${g.R*0.42}M0 ${-g.R*0.42}V${g.R*0.42}" style="stroke:var(--fg);stroke-width:2"/><circle r="8" style="fill:var(--surface);stroke:var(--fg)"/></g>`;
   return gg(g.c1,th)+gg(g.c2,-th+9-4.5)},
  arrow(g,d){return arcArrow(g.c1[0],g.c1[1],g.R+14,d>0?-150:-60,d>0?-60:-150,'var(--blue)',2.4)},
  guard:'<path d="M130 70H480V270H130Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:2.5"/>'},
 rolls:{name:'بكرتا درفلة متقابلتان',fig:'الشكل (4-9-ب) ص 66',build(){const c1=[320,112],c2=[320,236],r=60,T=[320,174];
   return {c1,c2,r,nips:[Object.assign(wedge2(T,c1,r,1,c2,r,-1,80),{id:'l',inRun:d=>d>0}),Object.assign(wedge2(T,c1,r,-1,c2,r,1,80),{id:'r',inRun:d=>d<0})]}},
  moving(g,th){const rl=(c,a)=>{let s=`<g transform="translate(${c[0]} ${c[1]}) rotate(${f1(a)})"><circle r="${g.r}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>`;for(let i=0;i<8;i++){const q=i*45*D2R;s+=`<path d="M${f1(g.r*0.3*Math.cos(q))} ${f1(g.r*0.3*Math.sin(q))}L${f1(g.r*0.92*Math.cos(q))} ${f1(g.r*0.92*Math.sin(q))}" style="stroke:var(--fg);stroke-width:1.2"/>`}return s+`<circle r="9" style="fill:var(--surface);stroke:var(--fg)"/></g>`};
   return `<path d="M120 174H520" style="stroke:var(--live);stroke-width:3"/>`+rl(g.c1,-th)+rl(g.c2,th)},
  arrow(g,d){return arcArrow(g.c2[0],g.c2[1],g.r+14,d>0?160:20,d>0?20:160,'var(--blue)',2.4)},
  guard:'<path d="M230 36H410V312H230Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:2.5"/>'}
};
/* rack arrow depends on direction: pinion turns cw (d>0) or ccw */
MECH.rack.arrow=(g,d)=>arcArrow(g.c[0],g.c[1],g.R+16,d>0?-130:-50,d>0?-50:-130,'var(--blue)',2.4)+arrow(d>0?600:540,256,d>0?540:600,256,'var(--blue)',2.4);

function nipLab(el){
 const MODES=[['belt','سير وبكرتان (4-4)'],['chain','جنزير وترس (4-4)'],['rack','ترس وجريدة مسننة (4-4)'],['rolls','بكرتا درفلة (4-9-ب)'],['gears','ترسان متعشقان']];
 let mode='belt',g=MECH.belt.build(),dir=1,run=false,guard=false,zones=true,tool='find',spd=1,th=0,cloth=null;
 const found={};const w={run:0,beltN:0,revN:0,clothIn:0,blocked:0,modes:{}};
 el.innerHTML=`<div class="grid">
  <div class="panel c12"><h2>مختبر نقاط الالتقاء <small>مبني على الشكلين (4-4) ص 63 و(4-9) ص 66</small></h2>
   <p class="sub">«نقاط الالتقاء بين الأجزاء الدوارة بالمعدات والآلات (In-Running Nip Points)» من مصادر الخطر (ص 63). شغّل الآلة واعكس اتجاهها، وابحث عن المكان الذي تلتقي فيه الأجزاء فتسحب ما يقترب منها إلى الداخل.</p>
   <div class="wrap-in" style="align-items:flex-start"><div><div class="sub">الآلة</div>${segHTML('nm',MODES,mode,1)}</div></div>
   <div class="wrap-in" style="align-items:flex-end">
    <div class="pbs">${swHTML('nRun','تشغيل','الآلة تدور',0)}${swHTML('nGrd','الحاجز','الحاجز الثابت (4-13)',0)}${swHTML('nZn','المناطق','أظهر مناطق الخطر',1)}</div>
    <div><div class="sub">اتجاه الدوران</div>${segHTML('nd',[[1,'⟳ مع عقارب الساعة'],[-1,'⟲ عكس عقارب الساعة']],1)}</div>
    <div><div class="sub">السرعة (للعرض فقط)</div>${segHTML('ns',[[0.5,'بطيئة'],[1,'متوسطة'],[2,'سريعة']],1)}</div>
    <div><div class="sub">ماذا تفعل عند الضغط على علامة ؟</div>${segHTML('nt',[['find','أحدّد: هل هي نقطة التقاء؟'],['cloth','أقرّب كُمّاً فضفاضاً']],tool,1)}</div></div>
   <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0"><div class="read"><span>الآلة</span><b id="nName"></b></div><div class="read"><span>نقاط الالتقاء التي حددتها (لهذا الاتجاه)</span><b id="nF"></b></div><div class="read"><span>الحالة</span><em class="mode-chip" id="nSt">متوقفة</em></div></div></div>
   <div class="svgbox" style="max-width:660px;margin-inline:auto"><svg viewBox="0 0 640 330" role="img" aria-label="آلة متحركة ونقاط الالتقاء"><g id="nMv"></g><g id="nOv"></g><g id="nCl"></g><g id="nHit"></g></svg></div>
   <div class="legend"><span><i style="background:var(--stop)"></i>منطقة خطر: نقطة التقاء داخلة (تسحب إلى الداخل)</span><span><i style="background:var(--muted)"></i>تتباعد الأجزاء هنا (في هذا الاتجاه)</span><span><i style="background:var(--blue)"></i>اتجاه الحركة / الحاجز</span></div>
   <div class="callout" id="nMsg">شغّل الآلة، ثم اضغط على علامات ؟ لتعرف أين نقاط الالتقاء.</div>
   <p class="sub"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> نقطة الالتقاء الداخلة هي الجهة التي يتجه فيها جزءان أحدهما نحو الآخر (السير نحو البكرة، أو سنا ترسين، أو بكرتان متقابلتان)؛ فإذا عكست اتجاه الدوران انتقلت إلى الجهة الأخرى. لهذا يرسم الكتاب في الترس والجريدة المسننة نقطتين، لأن الجريدة تتحرك ذهاباً وإياباً.</p></div>
  <div class="panel c7"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
  <div class="panel c5">${tries(['شغّل السير والبكرتين، ثم حدّد نقطتي الالتقاء.','اعكس الاتجاه: أين صارت نقاط الالتقاء؟','اختر «أقرّب كُمّاً فضفاضاً» واضغط على نقطة التقاء داخلة والآلة تدور.','ركّب الحاجز الثابت وأعد المحاولة.','قارن بكرتي الدرفلة بالشكل (4-9-ب): من أي جهة يُسحب الكم؟'])}</div>
  <div class="panel c12"><h2>نشاط: ما نوع الإصابة؟ <small>أنواع الإصابات الشائعة عند التعامل مع المعدات ص 64–67</small></h2><p class="sub">لكل موقف مما يلي اختر نوع الإصابة الذي يذكره الكتاب له.</p><div id="srt"></div></div>
 </div>`;
 const $=s=>el.querySelector(s);
 const key=()=>mode+(dir>0?'+':'-');
 const inList=()=>g.nips.filter(n=>n.inRun(dir));
 const gs=stepsUI($('#gs'),[
  {t:'شغّل الآلة',x:'اضغط «تشغيل». السير يدور مع البكرتين.',done:w=>w.run},
  {t:'حدّد نقطتي الالتقاء',x:'وأنت في وضع «أحدّد»، اضغط على علامتي ؟ اللتين يدخل عندهما السير على البكرة.',done:w=>w.beltN>=2},
  {t:'اعكس الاتجاه',x:'اختر «عكس عقارب الساعة» وحدّد نقطة التقاء جديدة: لقد انتقلت إلى الجهة الأخرى.',done:w=>w.revN>=1},
  {t:'الانحشار',x:'اختر «أقرّب كُمّاً فضفاضاً» واضغط على نقطة التقاء داخلة والآلة تدور (الشكل 4-9).',done:w=>w.clothIn},
  {t:'الحاجز الثابت',x:'شغّل «الحاجز» وأعد المحاولة: الحاجز يمنع وصول الكم إلى الأجزاء الدوارة.',done:w=>w.blocked},
  {t:'آلات أخرى',x:'حدّد نقاط الالتقاء في ثلاث آلات مختلفة على الأقل.',done:w=>Object.keys(w.modes).length>=3}
 ],()=>w);
 function status(){const F=found[key()]||{};const n=inList().filter(q=>F[q.id]).length;$('#nF').textContent=n+' / '+inList().length;$('#nName').textContent=MECH[mode].name;
  const c=$('#nSt');c.textContent=run?(guard?'تدور (عليها حاجز)':'تدور'):'متوقفة';c.className='mode-chip '+(run?(guard?'run':'warn'):'')}
 function overlay(){let s='';const F=found[key()]||{};
  if(zones)g.nips.forEach(n=>{const on=n.inRun(dir);s+=`<polygon points="${n.poly.map(p=>f1(p[0])+','+f1(p[1])).join(' ')}" style="fill:${on?'var(--stop-soft)':'none'};stroke:${on?RED:'var(--muted)'};stroke-width:${on?2:1.2};stroke-dasharray:${on?'none':'4 3'};opacity:${on?0.9:0.8}"/>`});
  s+=MECH[mode].arrow(g,dir);
  if(guard)s+=MECH[mode].guard+E(560,40,'FIXED GUARD',{fs:11,c:BLU});
  g.nips.forEach(n=>{const done=F[n.id]&&n.inRun(dir);s+=`<circle cx="${f1(n.m[0])}" cy="${f1(n.m[1])}" r="12" style="fill:${done?RED:'var(--surface)'};stroke:${done?RED:'var(--fg)'};stroke-width:1.6"/>`+(done?E(n.m[0],n.m[1]+4,'NIP',{fs:8,c:'var(--surface)'}):E(n.m[0],n.m[1]+4.5,'?',{fs:13}))});
  $('#nOv').innerHTML=s;
  $('#nHit').innerHTML=g.nips.map(n=>`<circle data-nn="${n.id}" cx="${f1(n.m[0])}" cy="${f1(n.m[1])}" r="20" style="fill:var(--fg);fill-opacity:0;cursor:pointer"/>`).join('');
  status()}
 function setMode(m){mode=m;g=MECH[m].build();cloth=null;$('#nCl').innerHTML='';setSeg(el,'nm',m);overlay();$('#nMsg').innerHTML=`<b>${MECH[m].name}</b> — ${MECH[m].fig}.`+(m==='gears'?' (ليست في الشكل (4-4)؛ أضفناها لأن التروس من الأجزاء الدوارة الشائعة.)':'')}
 el.querySelectorAll('[data-nm]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.nm)));
 el.querySelectorAll('[data-nd]').forEach(b=>b.addEventListener('click',()=>{dir=+b.dataset.nd;setSeg(el,'nd',dir);cloth=null;$('#nCl').innerHTML='';overlay();$('#nMsg').innerHTML='عكست الاتجاه: المناطق الحمراء انتقلت. نقطة الالتقاء الداخلة هي حيث يتجه الجزءان أحدهما نحو الآخر.'}));
 el.querySelectorAll('[data-ns]').forEach(b=>b.addEventListener('click',()=>{spd=+b.dataset.ns;setSeg(el,'ns',spd)}));
 el.querySelectorAll('[data-nt]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.nt;setSeg(el,'nt',tool)}));
 $('#nRun').addEventListener('click',e=>{run=!run;e.currentTarget.setAttribute('aria-pressed',run);if(run)w.run=1;status();gs.check()});
 $('#nGrd').addEventListener('click',e=>{guard=!guard;e.currentTarget.setAttribute('aria-pressed',guard);cloth=null;$('#nCl').innerHTML='';overlay()});
 $('#nZn').addEventListener('click',e=>{zones=!zones;e.currentTarget.setAttribute('aria-pressed',zones);overlay()});
 $('#nHit').addEventListener('click',e=>{const c=e.target.closest('[data-nn]');if(!c)return;const n=g.nips.find(q=>q.id===c.dataset.nn),isIn=n.inRun(dir);
  if(tool==='find'){
   if(isIn){(found[key()]=found[key()]||{})[n.id]=1;w.modes[mode]=1;if(mode==='belt')w.beltN=Math.max(w.beltN,Object.keys(found['belt+']||{}).length,Object.keys(found['belt-']||{}).length);if(dir<0)w.revN=1;
    $('#nMsg').innerHTML='<b style="color:var(--stop)">نعم، هذه نقطة التقاء (NIP POINT).</b> هنا يتجه الجزءان أحدهما نحو الآخر، فأي شيء يقترب (يد، كم، قفاز، شعر) يُسحب إلى الداخل.'}
   else $('#nMsg').innerHTML='<b>ليست نقطة التقاء داخلة في هذا الاتجاه.</b> هنا يبتعد الجزءان أحدهما عن الآخر، فلا يُسحب ما يقترب. لكن اعكس الاتجاه وانظر: تصير هي نقطة الالتقاء.';
   overlay();gs.check();return}
  // cloth
  const kind=guard?'guard':!run?'stop':isIn?'in':'out';cloth={n,t:0,kind};
  if(kind==='in')w.clothIn=1;if(kind==='guard')w.blocked=1;
  $('#nMsg').innerHTML=kind==='in'?'<b style="color:var(--stop)">سُحب الكم إلى داخل نقطة الالتقاء.</b> هذا هو الانحشار: «انحشار جزء من الملابس الفضفاضة أو الشعر الطويل في أجزاء المعدة الدوارة» (ص 65، الشكل 4-9).':
   kind==='out'?'هنا تتباعد الأجزاء فدُفع الكم إلى الخارج. لكن الجهة المقابلة نقطة التقاء، والاتجاه قد يُعكس — لا تقترب من الأجزاء الدوارة.':
   kind==='guard'?'<b style="color:var(--on)">الحاجز الثابت منع وصول الكم.</b> الحاجز الثابت «لا تسمح» فتحاته «بوصول أي جزء من أجزاء الجسم للأجزاء الدوارة بالمعدة» (ص 68).':
   'الآلة متوقفة الآن فلم يُسحب الكم. شغّلها وأعد المحاولة لترى ما يحدث.';
  gs.check()});
 function clothSVG(){if(!cloth)return '';const n=cloth.n,p=Math.min(1,cloth.t/1.4),o=n.out,T=n.T;let S=[n.m[0]+o[0]*90,n.m[1]+o[1]*90],Ee=[n.m[0]+o[0]*14,n.m[1]+o[1]*14];
  if(cloth.kind==='in'){const q=Math.min(1,p*1.6);Ee=[Ee[0]+(T[0]-Ee[0])*q,Ee[1]+(T[1]-Ee[1])*q];S=[S[0]-o[0]*70*p,S[1]-o[1]*70*p]}
  if(cloth.kind==='out'){S=[S[0]+o[0]*50*p,S[1]+o[1]*50*p];Ee=[Ee[0]+o[0]*50*p,Ee[1]+o[1]*50*p]}
  if(cloth.kind==='guard'){S=[n.m[0]+o[0]*120,n.m[1]+o[1]*120];Ee=[n.m[0]+o[0]*(70-10*Math.sin(p*Math.PI)),n.m[1]+o[1]*(70-10*Math.sin(p*Math.PI))]}
  const k=10,px=-o[1],py=o[0];let d='';for(let i=0;i<=k;i++){const t=i/k,x=S[0]+(Ee[0]-S[0])*t,y=S[1]+(Ee[1]-S[1])*t,a=5*Math.sin(i*1.3+cloth.t*8);d+=(i?'L':'M')+f1(x+px*a)+' '+f1(y+py*a)}
  return `<path d="${d}" style="fill:none;stroke:${cloth.kind==='in'&&p>0.5?RED:ORG};stroke-width:9;stroke-linecap:round;stroke-linejoin:round;opacity:.9"/>`}
 setMode('belt');
 loopOn(el,dt=>{if(run)th+=dir*spd*80*dt;$('#nMv').innerHTML=MECH[mode].moving(g,th);if(cloth){cloth.t+=dt;$('#nCl').innerHTML=clothSVG()}});
 const C=['القطع','القص','الاختراق والثقب','الصدمات','الانحشار','الاحتكاك والتسلخ','السحق','المقذوفات'];
 const I=[['قرص الصاروخ (Angle Grinder) أو المنشار الدائري',0,'«مثال على المعدات التي من الممكن أن تسبب حوادث القطع هي المناشير بأنواعها وماكينات تشكيل المعادن، الفريزة والصاروخ» (ص 64، الشكل 4-5).'],
  ['جزء من الجسم يقع بين طاولة ماكينة تشكيل المعادن وسلاحها',1,'(ص 64، الشكل 4-6).'],
  ['دبابيس تتطاير من دباسة كبيرة، أو بنطة مثقاب تثقب اليد',2,'(ص 64–65، الشكل 4-7).'],
  ['ذراع روبوت يتحرك فيصطدم بعامل',3,'«تتسبب فيها المعدات المتحركة التي قد تصطدم بالعاملين… الأيدي المتحركة لأجهزة الروبوت» (ص 65، الشكل 4-8).'],
  ['قفاز يلتف حول عمود مثقاب دوار',4,'(ص 65–66، الشكل 4-9-أ).'],
  ['ملامسة اليد لسطح عجلة الجلخ أو أسطوانة الصنفرة الدوارة',5,'(ص 66، الشكل 4-10).'],
  ['يد بين ثقل الموازنة النازل وأرضية المصنع',6,'«بين جزء متحرك بالمعدة وبين جدار أو الأرضية مثل الثقل والأرضية» (ص 66–67، الشكل 4-11).'],
  ['انفجار عجلة الجلخ، أو انطلاق الطاقة الكامنة في اليايات',7,'(ص 67).'],
  ['جزء من الجسم بين ذراعي الرافعة المقصية',6,'«بين جزأين متحركين للمعدة مثل الرافعة المقص» (ص 66).'],
  ['شظايا تتطاير من عجلة جلخ منكسرة فتخترق الجسم',2,'«من الممكن حدوث اختراق لأي مكان بجسم الشخص بواسطة المواد المتطايرة مثل الشظايا المتطايرة من عجلة الجلخ» (ص 64).']];
 sortBox($('#srt'),{cats:C,items:I});
}

/* =====================================================================
   LAB u4-l3 — press with safeguarding devices + grinding-wheel gaps
   ===================================================================== */
const PMODES=[['none','بلا حماية'],['interlock','حاجز بمفتاح فصل (4-14)'],['curtain','خلية كهروضوئية (4-17)'],['twohand','التحكم باليدين (4-20)'],['pullback','السحب للخلف (4-18)'],['restraint','الإيقاف المحدد (4-19)']];
const PLIM={zone:70,beam:58,guard:55,restr:45};
function pressSVG(s){const pos=s.pos,p=s.hand,y0=86+pos*105,tip=440-p*2.4,arm=!(s.mode==='twohand'&&s.hl&&s.hr);let v=svgOpen(470,350,'مكبس عليه وسائل حماية');
 // frame (side view of a C-frame press)
 v+=`<path d="M30 330V24H300V84H96V262H330V330Z" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>`;
 v+=`<rect x="170" y="${f1(y0)}" width="100" height="55" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><rect x="205" y="${f1(y0+55)}" width="30" height="20" style="fill:var(--fg)"/><path d="M220 84V${f1(y0)}" style="stroke:var(--fg);stroke-width:8"/>`;
 v+=`<path d="M165 262V282M275 262V282" style="stroke:var(--fg)"/><path d="M165 262H205L220 276L235 262H275" style="fill:none;stroke:var(--fg);stroke-width:2"/>`;
 // danger zone
 v+=`<rect x="165" y="230" width="112" height="32" style="fill:var(--stop-soft);opacity:${s.zoneOn?0.9:0.35}"/>`;
 // light curtain
 if(s.mode==='curtain'){const cut=p>PLIM.beam||chF('lcMis');v+=`<rect x="294" y="96" width="10" height="170" style="fill:var(--surface);stroke:var(--fg)"/>`;for(let y=104;y<262;y+=12)v+=`<path d="M299 ${y}V${y+6}" style="stroke:${cut&&(y>220||chF('lcMis'))?RED:GRN};stroke-width:3"/>`;v+=`<path d="M299 104V262" style="stroke:${cut?RED:GRN};stroke-width:1.2;stroke-dasharray:3 3"/>`+E(310,104,'light curtain',{fs:10,a:'start',c:cut?RED:GRN})}
 // interlocked guard
 if(s.mode==='interlock'){const gy=s.guard?96:30;v+=`<rect x="294" y="${gy}" width="10" height="166" style="fill:var(--blue-soft);fill-opacity:.7;stroke:var(--blue);stroke-width:2"/><rect x="284" y="${s.guard?84:18}" width="30" height="12" style="fill:${s.guard?GRN:RED};stroke:var(--fg)"/>`+E(330,s.guard?80:14,s.guard?'guard closed':'guard open',{fs:10,a:'start',c:s.guard?GRN:RED})}
 // two-hand station
 if(s.mode==='twohand'){v+=`<rect x="380" y="150" width="80" height="22" rx="4" style="${MF}"/><path d="M420 172V330" style="stroke:var(--fg);stroke-width:4"/>`;[[396,s.hl],[444,s.hr]].forEach(([x,on])=>{v+=`<circle cx="${x}" cy="150" r="9" style="fill:${on?GRN:'var(--surface)'};stroke:var(--fg);stroke-width:1.5"/>`+(on?`<ellipse cx="${x}" cy="140" rx="10" ry="7" style="fill:var(--surface);stroke:var(--fg)"/>`:'')})}
 // hand / arm (enters from the right)
 const hy=246;
 if(arm)v+=`<path d="M470 ${hy}H${f1(tip+14)}" style="stroke:var(--fg);stroke-width:16;stroke-linecap:round"/><path d="M470 ${hy}H${f1(tip+14)}" style="stroke:var(--surface);stroke-width:12;stroke-linecap:round"/><ellipse cx="${f1(tip+8)}" cy="${hy}" rx="12" ry="8" style="fill:${s.hurt?'var(--stop-soft)':'var(--surface)'};stroke:${s.hurt?RED:'var(--fg)'};stroke-width:1.6"/>`;
 if(s.mode==='pullback')v+=`<path d="M${f1(tip+30)} ${hy}L330 40L220 60" style="fill:none;stroke:var(--blue);stroke-width:2"/><rect x="${f1(tip+26)}" y="${hy-9}" width="8" height="18" style="fill:${GRN}"/><circle cx="330" cy="40" r="6" style="${MF2}"/>`;
 if(s.mode==='restraint')v+=`<path d="M${f1(tip+30)} ${hy}L462 ${hy-30}" style="fill:none;stroke:var(--blue);stroke-width:2"/><rect x="${f1(tip+26)}" y="${hy-9}" width="8" height="18" style="fill:${GRN}"/><rect x="456" y="${hy-60}" width="12" height="80" style="${MF}"/>`;
 if(s.flash)v+=`<rect x="0" y="0" width="470" height="350" style="fill:var(--stop);opacity:${f1(s.flash*0.35)}"/>`;
 v+=E(220,300,'die',{fs:10,m:1})+E(220,y0+30,'ram',{fs:10,m:1});
 return v+'</svg>'}
function pressLab(el){
 let mode='none',pos=0,phase='idle',hand=0,guard=true,hl=false,hr=false,flash=0,hurt=false,strokes=0,inj=0,stops=0,msg='';
 const w={inj:0,refGuard:0,stopGuard:0,stopCurtain:0,twoStroke:0,stopTwo:0,pulled:0,restrained:0};
 el.innerHTML=`<div class="grid">
  <div class="panel c12"><h2>مختبر المكبس ووسائل الحماية <small>مبني على الحواجز والأجهزة ص 69–72 والأشكال (4-14) و(4-17) إلى (4-20)</small></h2>
   <p class="sub">مكبس ينزل سلاحه على القالب (منطقة السحق في الشكل 4-11). اختر وسيلة الحماية، ثم حرّك يد العامل وشغّل المكبس، وانظر متى يتوقف.</p>
   <div class="wrap-in" style="align-items:flex-start"><div><div class="sub">وسيلة الحماية</div>${segHTML('pm',PMODES,mode,1)}</div></div>
   <div class="wrap-in" style="align-items:flex-end" id="pCtl"></div>
   <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0"><div class="read"><span>المكبس</span><em class="mode-chip" id="pSt">جاهز</em></div><div class="read"><span>أشواط كاملة</span><b id="pN">0</b></div><div class="read"><span>إيقاف بسبب الحماية</span><b id="pS">0</b></div><div class="read"><span>إصابات</span><b id="pI">0</b></div></div></div></div>
  <div class="panel c7"><h2>المكبس <small>منظر جانبي — رسم توضيحي</small></h2><div class="svgbox" id="pv" style="max-width:520px;margin-inline:auto"></div>
   <div class="legend"><span><i style="background:var(--stop-soft);border:1px solid var(--stop)"></i>منطقة الخطر تحت السلاح</span><span><i style="background:var(--blue)"></i>حاجز / واير</span><span><i style="background:var(--on)"></i>الحماية تسمح</span></div>
   <div class="callout" id="pMsg">اختر «بلا حماية» أولاً لترى لماذا نحتاج الحماية.</div></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
  <div class="panel c12" id="grd"></div>
 </div>`;
 const $=s=>el.querySelector(s);
 const say=h=>{msg=h;$('#pMsg').innerHTML=h};
 const gs=stepsUI($('#gs'),[
  {t:'بلا حماية',x:'اختر «بلا حماية»، حرّك يد العامل إلى آخر المنزلق (تحت السلاح)، ثم «تشغيل شوط».',done:w=>w.inj},
  {t:'الحاجز بمفتاح فصل: الحاجز مفتوح',x:'اختر «حاجز بمفتاح فصل»، افتح الحاجز، ثم حاول التشغيل.',done:w=>w.refGuard},
  {t:'افتح الحاجز أثناء النزول',x:'أغلق الحاجز وشغّل، ثم افتحه والسلاح ينزل.',done:w=>w.stopGuard},
  {t:'الخلية الكهروضوئية',x:'اختر «خلية كهروضوئية»، شغّل، ثم أدخل اليد في الشعاع أثناء النزول.',done:w=>w.stopCurtain},
  {t:'التحكم باليدين',x:'اختر «التحكم باليدين»: ضع اليدين على الزرين معاً ليعمل شوط كامل.',done:w=>w.twoStroke},
  {t:'ارفع يداً عن زرها',x:'شغّل بالزرين ثم ارفع يداً واحدة والسلاح ينزل.',done:w=>w.stopTwo},
  {t:'السحب للخلف',x:'اختر «السحب للخلف»، ضع اليد تحت السلاح ثم شغّل.',done:w=>w.pulled},
  {t:'الإيقاف المحدد',x:'اختر «الإيقاف المحدد» وحاول أن تصل باليد إلى القالب.',done:w=>w.restrained}
 ],()=>w);
 const maxHand=()=>mode==='restraint'?PLIM.restr:mode==='interlock'&&guard?PLIM.guard:100;
 function ctl(){let h='';
  if(mode==='twohand')h=`<div class="pbs">${swHTML('pL','اليسرى','اليد اليسرى على زرها',hl)}${swHTML('pR','اليمنى','اليد اليمنى على زرها',hr)}</div><p class="sub" style="max-width:340px">لا يعمل المكبس إلا والزرّان مضغوطان معاً. اليد التي ليست على زرها تُرسم داخلة إلى القالب.</p>`;
  else h=`<label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:220px">موضع يد العامل: <b id="pHV" style="color:var(--fg)"></b><input type="range" id="pH" min="0" max="100" step="1" value="${hand}" style="accent-color:var(--blue);width:100%"></label>
   <div class="pbs">${pbHTML('pGo','green','▶','تشغيل شوط')}${mode==='interlock'?swHTML('pG','الحاجز','الحاجز مغلق',guard):''}</div>`;
  h+=`<button class="btn" id="pRs">تصفير العدادات</button>`;
  $('#pCtl').innerHTML=h;
  if(mode==='twohand'){$('#pL').addEventListener('click',e=>{hl=!hl;e.currentTarget.setAttribute('aria-pressed',hl);two()});$('#pR').addEventListener('click',e=>{hr=!hr;e.currentTarget.setAttribute('aria-pressed',hr);two()})}
  else{$('#pH').addEventListener('input',e=>{let v=+e.target.value;
    if(mode==='pullback'&&phase==='down'&&v>hand){v=hand;say('أثناء نزول السلاح يسحب الواير اليد إلى الخلف، فلا تستطيع إدخالها.')}
    const mx=maxHand();if(v>mx){v=mx;if(mode==='restraint'){w.restrained=1;say('<b style="color:var(--on)">لا تصل اليد إلى القالب:</b> «طول الواير لا يسمح بأي حال من الأحوال بوصول أيدي العامل لنقطة الخطر، ويتم استخدام معدات مساعدة لوضع الشغلة في مكان التشغيل» (ص 71).');gs.check()}else say('الحاجز مغلق فلا تصل اليد إلى منطقة الخطر. افتحه أولاً.')}
    hand=v;e.target.value=v;hv()});
   $('#pGo').addEventListener('click',start);
   if(mode==='interlock')$('#pG').addEventListener('click',e=>{if(guard){guard=false;if(phase==='down'&&!chF('ilByp')){stop('stopGuard','<b style="color:var(--on)">توقف المكبس فوراً:</b> «في حالة فتح باب المعدة أو رفع الحاجز يقوم المفتاح بإيقاف المعدة على الفور ولا تعمل مرة أخرى إلا بإعادة الحاجز لوضعه الأصلي» (ص 69).')}else say(chF('ilByp')?'الحاجز مفتوح.':'الحاجز مفتوح: يمكن الآن وضع الشغلة باليد، لكن المكبس لا يعمل.')}
     else{if(hand>PLIM.guard){say('أخرج يدك من منطقة العمل أولاً حتى يُغلق الحاجز.');return}guard=true;say('الحاجز مغلق: يمكن تشغيل المكبس.')}
     e.currentTarget.setAttribute('aria-pressed',guard);const x=$('#pH');if(x)x.max=100})}
  $('#pRs').addEventListener('click',()=>{strokes=0;inj=0;stops=0;read()});hv()}
 const hv=()=>{const b=$('#pHV');if(b)b.textContent=hand<20?'بعيدة عن المكبس':hand<PLIM.beam?'تقترب من المكبس':hand<PLIM.zone?'عند حافة القالب':'تحت السلاح (منطقة الخطر)'};
 function stop(flag,h){phase='stopped';stops++;if(flag)w[flag]=1;say(h);read();gs.check()}
 function start(){if(phase==='down'||phase==='up')return;
  if(mode==='interlock'&&!guard&&!chF('ilByp')){w.refGuard=1;say('<b>لا يعمل المكبس والحاجز مفتوح.</b> أعد الحاجز لوضعه الأصلي أولاً.');gs.check();return}
  if(mode==='curtain'&&hand>PLIM.beam&&!chF('lcByp')){say('<b>لا يعمل المكبس:</b> اليد تقطع الشعاع الضوئي.');return}
  if(mode==='curtain'&&chF('lcMis')){say('<b>لا يعمل المكبس:</b> مستقبل الخلية لا يستقبل الشعاع (مؤشراته حمراء).');return}
  hurt=false;phase='down';say(mode==='none'?'السلاح ينزل… لا شيء يمنعه.':'السلاح ينزل…')}
 function two(){const hr2=hr||chF('tie');if(hl&&hr2){if(phase==='idle'||phase==='stopped'){hurt=false;phase='down';say(hr?'الزران مضغوطان معاً: السلاح ينزل، واليدان بعيدتان عن القالب.':'السلاح ينزل…')}}
  else if(phase==='down')stop('stopTwo','<b style="color:var(--on)">توقف المكبس:</b> رُفعت يد عن زرها. «لا يتم تشغيل المعدة إلا بواسطة الضغط على مفتاحين اثنين لضمان عدم إدخال العامل ليديه في منطقة الخطر» (ص 72).');
  hand=(hl&&hr)?0:85;draw()}
 function read(){$('#pN').textContent=strokes;$('#pS').textContent=stops;$('#pI').textContent=inj;const c=$('#pSt');
  c.textContent=phase==='down'?'ينزل':phase==='up'?'يصعد':phase==='stopped'?'متوقف (الحماية)':'جاهز';c.className='mode-chip '+(phase==='down'?'warn':phase==='stopped'?'run':phase==='up'?'slow':'')}
 function draw(){$('#pv').innerHTML=pressSVG({mode,pos,hand,guard,hl,hr,flash,hurt,zoneOn:hand>=PLIM.zone})}
 el.querySelectorAll('[data-pm]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.pm;setSeg(el,'pm',mode);phase=pos>0?'up':'idle';hurt=false;hl=hr=false;guard=true;
  if(mode==='twohand')hand=85;else hand=Math.min(hand,maxHand());ctl();read();
  say({none:'بلا حماية: لا شيء يمنع السلاح من النزول ويدك تحته.',interlock:'«الحاجز المزود بمفتاح فصل (Interlock)» (ص 69): افتح الحاجز وأغلقه وجرّب.',curtain:'«الخلية الكهروضوئية»: «في حالة قطع هذا الشعاع بواسطة أي جزء من أجزاء الجسم تتوقف المعدة على الفور» (ص 70).',twohand:'«نظام التحكم بواسطة اليدين الإثنين» (ص 72): ضع اليدين على الزرين.',pullback:'«نظام السحب للخلف» (ص 71): الواير مربوط بيد العامل وبنظام تشغيل المكبس.',restraint:'«نظام الإيقاف المحدد» (ص 71): الواير قصير لا يسمح بالوصول إلى نقطة الخطر.'}[mode])}));
 ctl();read();
 loopOn(el,dt=>{const v=0.9;
  if(phase==='down'){
   if(mode==='curtain'&&hand>PLIM.beam&&!chF('lcByp')){stop('stopCurtain','<b style="color:var(--on)">توقف المكبس على الفور:</b> قطعت اليد الشعاع الضوئي (الشكل 4-17).');}
   else{pos+=v*dt;
    if(mode==='pullback'&&hand>(chF('pbLong')?78:25)){hand=Math.max(chF('pbLong')?78:25,hand-150*dt);const x=$('#pH');if(x)x.value=hand;hv();if(!w.pulled){w.pulled=1;say('<b style="color:var(--on)">سُحبت يد العامل إلى الخلف:</b> «عند بدء نزول الجزء المسبب للخطر يتم سحب أيدي العامل للخلف لإبعادها من مركز الخطر» (ص 71).');gs.check()}}
    if(hand>=PLIM.zone&&pos>=0.74&&!hurt){hurt=true;inj++;flash=1;phase='up';if(mode==='none'){w.inj=1}say('<b style="color:var(--stop)">إصابة سحق!</b> نزل السلاح على اليد لأن لا شيء يوقفه. هذا ما تمنعه حواجز الحماية وأجهزتها.');gs.check()}
    if(pos>=1){pos=1;phase='up';strokes++;if(mode==='twohand')w.twoStroke=1;gs.check()}}
   read()}
  else if(phase==='up'){pos-=v*dt;if(pos<=0){pos=0;phase='idle';read()}}
  if(flash>0)flash=Math.max(0,flash-dt*1.5);
  draw()});
 grinderPanel($('#grd'));
}

/* grinding-wheel gaps (ص 73): work rest ≤ 1/8 in (3 mm), upper adjustable guard ≤ 1/4 in (6 mm) */
function grinderPanel(host){
 let g1=5,g2=10,wear=0,cracked=false,rung=null,spin=false,ang=0;const chk={fix:0,speed:0,vis:0,goggles:0,guards:0};
 host.innerHTML=`<h2>فحص حجر الجلخ قبل التشغيل <small>البنود في آخر «الوسائل المختلفة الأخرى» ص 73 والبند 25 ص 61</small></h2>
  <p class="sub">«يجب ألا تزيد المسافة بين الجزء الذى يتم تثبيت الشغلة عليه وبين حجر الجلخ عن 1/8 بوصة (3 مم)» و«يجب ألا تزيد المسافة بين الحاجز العلوى المتحرك وبين حجر الجلخ عن ¼ بوصة (6 مم)» (ص 73). اضبط المسافتين، وأكمل الفحص، ثم شغّل.</p>
  <div class="grid" style="margin-top:6px">
   <div class="c7"><div class="svgbox" id="gv" style="max-width:480px;margin-inline:auto"></div><p class="sub" style="text-align:center">المسافات مكبّرة في الرسم حتى تُرى.</p></div>
   <div class="c5">
    <label class="sub" style="display:flex;flex-direction:column;gap:2px">المسافة بين مسند الشغلة والحجر: <b id="g1V" class="ltr" style="color:var(--fg)"></b><input type="range" id="g1" min="0.5" max="12" step="0.5" value="${g1}" style="accent-color:var(--blue);width:100%"></label>
    <label class="sub" style="display:flex;flex-direction:column;gap:2px;margin-top:8px">المسافة بين الحاجز العلوي المتحرك والحجر: <b id="g2V" class="ltr" style="color:var(--fg)"></b><input type="range" id="g2" min="0.5" max="15" step="0.5" value="${g2}" style="accent-color:var(--blue);width:100%"></label>
    <label class="sub" style="display:flex;flex-direction:column;gap:2px;margin-top:8px">تآكل الحجر بعد الاستعمال: <b id="gwV" class="ltr" style="color:var(--fg)"></b><input type="range" id="gw" min="0" max="8" step="0.5" value="0" style="accent-color:var(--live);width:100%"></label>
    <div class="sub" style="margin-top:10px">قائمة الفحص:</div>
    <div id="gChk" style="display:grid;gap:6px;margin-top:4px"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn" id="gRing">فحص الحلقة: انقر الحجر</button><button class="btn" id="gNew">ركّب حجراً آخر</button><button class="btn primary" id="gGo">شغّل الجلخ</button></div>
   </div></div>
  <div class="callout" id="gMsg">اضبط المسافتين ثم أكمل قائمة الفحص.</div>
  <p class="sub"><b>إضافة من خارج الكتاب (فحص الحلقة Ring Test):</b> يُعلَّق الحجر وهو جاف ويُنقر بخفة بأداة غير معدنية (مثل مقبض مفك خشبي). الحجر السليم يُصدر رنيناً واضحاً، والحجر المشروخ يُصدر صوتاً مكتوماً فلا يُركَّب.</p>`;
 const $=s=>host.querySelector(s);
 const CH=[['fix','الحجر مثبت جيداً قبل السماح بالعمل عليه (ص 73)'],['speed','الحجر يلائم الموتور: لهما نفس سرعة الدوران (ص 73)'],['vis','فحص ظاهري: لا شروخ ولا تآكل (ص 61، 73)'],['guards','أغطية الحماية في أماكنها (ص 61)'],['goggles','نظارات السلامة Safety Goggles (ص 61)']];
 $('#gChk').innerHTML=CH.map(([k,l])=>`<label style="display:flex;gap:8px;align-items:flex-start;font-size:14px"><input type="checkbox" data-gk="${k}" style="margin-top:4px;accent-color:var(--on)"> <span>${l}</span></label>`).join('');
 host.querySelectorAll('[data-gk]').forEach(c=>c.addEventListener('change',()=>{chk[c.dataset.gk]=c.checked?1:0;spin=false}));
 const ok1=()=>g1<=3,ok2=()=>g2<=6;
 function svg(){const cx=190,cy=150,R0=80,S=3,R=R0-wear*S,Rh=R0+50,a=ang;let s=svgOpen(420,300,'حجر جلخ ومسند الشغلة والحاجز العلوي');
  s+=`<path d="M${cx-Rh} ${cy}A${Rh} ${Rh} 0 0 1 ${f1(cx+Rh*Math.cos(-40*D2R))} ${f1(cy+Rh*Math.sin(-40*D2R))}" style="fill:none;stroke:var(--fg);stroke-width:8"/><path d="M${cx-Rh} ${cy}V${cy+140}" style="stroke:var(--fg);stroke-width:8"/>`;
  s+=`<g transform="rotate(${f1(a)} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${f1(R)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>`+[0,60,120].map(q=>`<path d="M${f1(cx+R*0.3*Math.cos(q*D2R))} ${f1(cy+R*0.3*Math.sin(q*D2R))}L${f1(cx+R*0.9*Math.cos(q*D2R))} ${f1(cy+R*0.9*Math.sin(q*D2R))}" style="stroke:var(--muted);stroke-width:1"/>`).join('')+(cracked?`<path d="M${cx+20} ${cy-R*0.9}l-6 14l8 10l-4 16" style="fill:none;stroke:var(--fg);stroke-width:1;opacity:.35"/>`:'')+`</g><circle cx="${cx}" cy="${cy}" r="14" style="fill:var(--surface);stroke:var(--fg)"/>`;
  // tongue guard (upper adjustable guard) at -40°
  const ta=-40*D2R,ti=R+g2*S,to=Rh;s+=`<path d="M${f1(cx+ti*Math.cos(ta))} ${f1(cy+ti*Math.sin(ta))}L${f1(cx+(to+4)*Math.cos(ta))} ${f1(cy+(to+4)*Math.sin(ta))}" style="stroke:${ok2()?GRN:RED};stroke-width:8;stroke-linecap:round"/>`;
  s+=`<path d="M${f1(cx+R*Math.cos(ta))} ${f1(cy+R*Math.sin(ta))}L${f1(cx+ti*Math.cos(ta))} ${f1(cy+ti*Math.sin(ta))}" style="stroke:${ok2()?GRN:RED};stroke-width:1.5;stroke-dasharray:2 2"/>`+E(cx+(to+12)*Math.cos(ta)+6,cy+(to+12)*Math.sin(ta)-6,g2.toFixed(1)+' mm',{fs:12,a:'start',c:ok2()?GRN:RED});
  // work rest at centre height
  const rx=cx+R+g1*S;s+=`<rect x="${f1(rx)}" y="${cy}" width="90" height="10" style="fill:${ok1()?'var(--on-soft)':'var(--stop-soft)'};stroke:${ok1()?GRN:RED};stroke-width:1.8"/><path d="M${f1(rx+80)} ${cy+10}V${cy+120}" style="stroke:var(--fg);stroke-width:5"/>`;
  s+=`<path d="M${f1(cx+R)} ${cy+22}H${f1(rx)}" style="stroke:${ok1()?GRN:RED};stroke-width:1.5"/>`+E(rx+46,cy+34,g1.toFixed(1)+' mm',{fs:12,c:ok1()?GRN:RED});
  if(!ok1())s+=`<rect x="${f1(cx+R+2)}" y="${cy-16}" width="${f1(Math.max(8,g1*S+18))}" height="14" rx="3" transform="rotate(25 ${f1(cx+R+8)} ${cy-6})" style="fill:${ORG};stroke:var(--fg)"/>`;
  s+=E(rx+46,cy-8,'work rest',{fs:10,m:1})+E(cx+(to+10)*Math.cos(ta)+6,cy+(to+10)*Math.sin(ta)+14,'tongue guard',{fs:10,a:'start',m:1});
  return s+'</svg>'}
 function draw(){$('#gv').innerHTML=svg();$('#g1V').textContent=g1.toFixed(1)+' mm '+(ok1()?'✓':'✗ > 3 mm');$('#g2V').textContent=g2.toFixed(1)+' mm '+(ok2()?'✓':'✗ > 6 mm');$('#gwV').textContent=wear.toFixed(1)+' mm'}
 $('#g1').addEventListener('input',e=>{g1=+e.target.value;spin=false;draw();$('#gMsg').innerHTML=ok1()?'مسافة المسند مقبولة (لا تزيد عن 3 مم).':'<b style="color:var(--stop)">المسافة أكبر من 3 مم:</b> قد تنحشر الشغلة بين المسند والحجر (البرتقالي في الرسم).'});
 $('#g2').addEventListener('input',e=>{g2=+e.target.value;spin=false;draw();$('#gMsg').innerHTML=ok2()?'مسافة الحاجز العلوي مقبولة (لا تزيد عن 6 مم).':'<b style="color:var(--stop)">المسافة أكبر من 6 مم.</b> قرّب الحاجز العلوي المتحرك من الحجر.'});
 $('#gw').addEventListener('input',e=>{const nw=+e.target.value,d=nw-wear;wear=nw;g1=Math.min(12,Math.max(0.5,g1+d));g2=Math.min(15,Math.max(0.5,g2+d));$('#g1').value=g1;$('#g2').value=g2;spin=false;draw();
  $('#gMsg').innerHTML=d>0?'كلما تآكل الحجر صغر قطره فزادت المسافتان، والمسند والحاجز في مكانهما. لذلك يُعاد ضبطهما.':'رجعنا التآكل.'});
 $('#gRing').addEventListener('click',()=>{rung=cracked?'dull':'ring';$('#gMsg').innerHTML=cracked?'<b style="color:var(--stop)">صوت مكتوم.</b> في الحجر شرخ لا يُرى بالعين: لا يُركَّب. اضغط «ركّب حجراً آخر».':'<b style="color:var(--on)">رنين واضح.</b> الحجر سليم في فحص الحلقة.'});
 $('#gNew').addEventListener('click',()=>{cracked=!cracked&&Math.random()<0.5?true:false;rung=null;wear=0;$('#gw').value=0;spin=false;draw();$('#gMsg').innerHTML='ركّبت حجراً آخر. أعد فحص الحلقة واضبط المسافتين.'});
 $('#gGo').addEventListener('click',()=>{const miss=[];if(!ok1())miss.push('مسافة المسند أكبر من 3 مم');if(!ok2())miss.push('مسافة الحاجز العلوي أكبر من 6 مم');CH.forEach(([k,l])=>{if(!chk[k])miss.push(l.replace(/ \(.*\)$/,''))});
  if(rung==null)miss.push('فحص الحلقة (Ring Test)');else if(rung==='dull')miss.push('الحجر مشروخ — غيّره');
  if(miss.length){spin=false;$('#gMsg').innerHTML='<b style="color:var(--stop)">لا تشغّل بعد.</b> ينقص: '+miss.join('، ')+'.'}
  else{spin=true;$('#gMsg').innerHTML='<b style="color:var(--on)">الفحص مكتمل:</b> المسافتان ضمن الحد، والحجر سليم ومثبت، والأغطية في مكانها، والنظارة على العينين. الجلخ يعمل الآن.'}});
 cracked=Math.random()<0.5;draw();
 loopOn(host,dt=>{if(spin){ang+=dt*400;$('#gv').innerHTML=svg()}});
}

/* =====================================================================
   LESSONS
   ===================================================================== */
const fig=(n,ref,caption,draw,mw)=>({fig:'('+n+')',ref,caption,draw:()=>box(draw(),mw||560)});
const OK='<b>إجابة مقترحة (ليست من الكتاب):</b> ';
const qd=(q,a)=>`<details style="margin:8px 0;border:1px solid var(--line);border-radius:10px;padding:8px 12px"><summary style="cursor:pointer">${q}</summary><div style="margin-top:8px">${OK}${a}</div></details>`;

/* ---------------- u4-l1 ---------------- */
B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'57–63',
 title:'تعليمات العدد اليدوية وأخطاؤها',
 summary:'لماذا يحتاج من يستعمل العدد اليدوية إلى تدريب، وتعليمات السلامة عند استعمالها، والأخطاء الشائعة التي تسبب الإصابات، وقواعد السلامة الأربع.',
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
})())/*DCML-END*/,(window.SFA=window.SFA||(function(){
/* رسومات المحطات في مقرر السلامة الصناعية: خلفية الرسم فاتحة في الوضعين، فنثبّت ألوان الوضع الفاتح داخل الرسم،
   ونضمّن أشكال الدرس نفسها (دوال الشكل في ملف الوحدة) بدل إعادة رسمها. نسخة مطابقة في أول درس من كل ملف وحدة. */
const PAL='--fg:#14231c;--muted:#5a6b62;--surface:#ffffff;--surface-2:#e8f0ec;--line:#cfdcd5;--blue:#12855A;--blue-ink:#0d6b47;--blue-soft:#dcf1e6;--live:#d9801a;--live-soft:#fbe8cf;--on:#1d9460;--on-soft:#d7f0e3;--stop:#c8372d;--stop-soft:#f8dcd9;--wire:#a6b5be;--ink-dim:#c3ced5;--lamp-off:#dfe5e9';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const art=(aria,body,bg)=>`<svg viewBox="0 0 360 320" role="img" aria-label="${esc(aria)}" style="font-family:var(--font);${PAL}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg||'#DDEFE6'}"/>${body}</svg>`;
const hot=(x,y,w,h,tip)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="transparent" data-tip="${esc(tip)}"/>`;
/* يضمّن شكلاً من أشكال الدرس: crop = الجزء المعروض منه [x,y,w,h]، dest = مكانه في الرسم [x,y,w,h] */
const emb=(svg,crop,dest)=>String(svg).replace(/^\s*<svg[^>]*>/,`<svg x="${dest[0]}" y="${dest[1]}" width="${dest[2]}" height="${dest[3]}" viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMid meet">`);
/* نص عربي في الرسم: كل مقطع لاتيني أو رقمي في tspan مستقل باتجاه LTR */
const ar=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" direction="rtl" font-size="${o.fs||13}" font-weight="${o.w||600}" fill="${o.c||'#14231c'}" style="font-family:var(--font)">${String(t).replace(/([A-Za-z0-9][A-Za-z0-9.,%°+\-–/() ]*[A-Za-z0-9%°)]|[A-Za-z0-9])/g,'<tspan direction="ltr" unicode-bidi="bidi-override">$1</tspan>')}</text>`};
const la=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" direction="ltr" font-size="${o.fs||11}" font-weight="${o.w||600}" fill="${o.c||'#14231c'}" style="font-family:var(--mono)">${t}</text>`};
/* شكل الكتاب داخل نص المحطة (بألوان الموقع، يعمل في الوضع الداكن) */
const fig=(svg,cap,mw)=>`<figure style="margin:12px auto 4px;max-width:${mw||560}px"><div class="svgbox" style="margin:0">${svg}</div><figcaption style="text-align:center;margin-top:6px;font-size:13px;color:var(--muted);line-height:1.7">${cap}</figcaption></figure>`;
/* سهم مستقيم، وشخص بسيط (قدماه عند y) — لملفات الوحدات التي ليس فيها دوال رسم مماثلة */
const arr=(x1,y1,x2,y2,c,w)=>{c=c||'var(--stop)';w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),h=6+w*1.6,bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=Math.sin(a)*h*.55,py=-Math.cos(a)*h*.55,f=v=>v.toFixed(1);
 return `<path d="M${f(x1)} ${f(y1)}L${f(bx)} ${f(by)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/><polygon points="${f(x2)},${f(y2)} ${f(bx+px)},${f(by+py)} ${f(bx-px)},${f(by-py)}" fill="${c}"/>`};
const man=(x,y,o)=>{o=o||{};const c=o.c||'var(--blue)';return `<g><path d="M${x-5} ${y-26}L${x-8} ${y}M${x+5} ${y-26}L${x+8} ${y}" stroke="var(--fg)" stroke-width="5" stroke-linecap="round"/><rect x="${x-10}" y="${y-62}" width="20" height="38" rx="6" fill="${o.cs||'var(--blue-soft)'}" stroke="${c}" stroke-width="1.5"/>${(o.hands||[[x-14,y-30],[x+14,y-30]]).map(h=>`<path d="M${x} ${y-56}L${h[0]} ${h[1]}" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/>`).join('')}<circle cx="${x}" cy="${y-72}" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>${o.helmet?`<path d="M${x-11} ${y-74}a11 10 0 0 1 22 0z" fill="var(--live)" stroke="var(--fg)"/>`:''}</g>`};
return {PAL,esc,art,hot,emb,ar,la,fig,arr,man};
})()),{intro:true}),
{st:1,short:'أهداف الوحدة',title:'الوحدة الرابعة: العدد اليدوية — الهدف العام والأهداف التفصيلية',ref:'ص 57–58',
   q:'عدة بسيطة مثل المفك أو المفتاح… كيف تسبب إصابة؟ وما الذي ستتعلمه حتى لا يحدث ذلك لك؟',
   art:SFA.art('ثلاثة أجزاء للوحدة: العدد اليدوية، ومخاطر الآلات، وحواجز الحماية',
    `<g transform="translate(272 150) rotate(32)"><rect x="-7" y="-8" width="14" height="86" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><path d="M-20 -26A22 22 0 1 0 20 -26L10 -14H-10Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4" stroke-linejoin="round"/></g>`+
    `<g transform="translate(180 138)"><path d="${gearD(40,12,9)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><circle r="13" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g>`+arrow(212,84,192,104,RED,2.6)+
    `<path d="M88 98L122 110V140Q122 170 88 186Q54 170 54 140V110Z" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="3" stroke-linejoin="round"/><path d="M72 142L84 154L106 128" fill="none" stroke="var(--blue)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`+
    SFA.ar(180,62,'الوحدة الرابعة: العدد اليدوية',{fs:17,w:700})+SFA.ar(276,236,'التعليمات',{fs:14.5})+SFA.ar(276,254,'والأخطاء',{fs:14.5})+SFA.ar(180,236,'المخاطر',{fs:14.5})+SFA.ar(180,254,'والإصابات',{fs:14.5})+SFA.ar(86,236,'الحواجز',{fs:14.5})+
    SFA.hot(226,90,96,170,'العدد اليدوية: تعليمات السلامة عند استعمالها، والأخطاء الشائعة، وقواعد السلامة الأربع — الدرس الأول.')+
    SFA.hot(134,86,92,174,'الآلات والمعدات: مصادر الخطر فيها (نقاط التشغيل ونقاط الالتقاء) وأنواع الإصابات — الدرس الثاني. السهم الأحمر يشير إلى منطقة خطر عند الترس.')+
    SFA.hot(40,90,92,170,'حواجز الحماية: وسائل تمنع وصول الجسم إلى منطقة الخطر في الآلة — الدرس الثالث.')),
   cap:'الوحدة في ثلاثة دروس.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف ما يخصه من الوحدة.</b>',
   side:[
    {predict:{q:'أي هدف من أهداف الوحدة يخص الحماية حول الآلات نفسها؟',opts:[
     ['أن يذكر القواعد العامة في استخدام العدد والأدوات',false,'هذا عن العدد اليدوية نفسها وطريقة استعمالها، لا عن الحماية حول الآلات.'],
     ['أن يصف أنواع الإصابات الشائعة',false,'هذا يصف الإصابة بعد وقوعها، أما الحماية فتمنع الوصول إلى الخطر.'],
     ['أن يعدد أنواع الحواجز المستخدمة للحماية حول المعدات',true,'الهدف الخامس (ص 58): الحواجز هي وسيلة الحماية حول المعدات، وهي موضوع الدرس الثالث.']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد العامة لسلامة استخدام العدد والأدوات وإرشادات السلامة الصناعية.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يقوم المتدرب بحصر الأخطاء العامة عند استخدام العدد والأدوات.</li><li>أن يذكر المتدرب القواعد العامة في استخدام العدد والأدوات.</li><li>أن يقوم المتدرب بحصر مخاطر العدد والأدوات.</li><li>أن يصف المتدرب أنواع الإصابات الشائعة عند استخدام العدد والأدوات.</li><li>أن يعدد المتدرب أنواع الحواجز المستخدمة للحماية حول المعدات.</li></ol>`,ref:'ص 58'},
    {tip:`<p>الأهداف الخمسة موزعة على دروس الوحدة الثلاثة: الأخطاء والقواعد في الدرس الأول، والمخاطر والإصابات في الدرس الثاني، والحواجز في الدرس الثالث. «حصر» الأخطاء أو المخاطر معناه أن تستطيع أن تعدّها وتذكرها كلها.</p>`,title:'كيف تقرأ الأهداف؟'},
    {title:'مختبر مصغّر: كل هدف في أي درس؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل هدف اضغط الدرس الذي يحققه، ثم اقرأ السبب.',cats:['تعليمات العدد وأخطاؤها','مخاطر الآلات والإصابات','حواجز الحماية'],items:[
 ['حصر الأخطاء العامة عند استخدام العدد والأدوات.',0,'الأخطاء في استعمال العدد اليدوية هي البند 4-3 (ص 62) في الدرس الأول.'],
 ['ذكر القواعد العامة في استخدام العدد والأدوات.',0,'قواعد السلامة الأربع (4-4، ص 63) في آخر الدرس الأول.'],
 ['حصر مخاطر العدد والأدوات.',1,'مخاطر المعدات والآلات ومصادرها (4-5، ص 63) في الدرس الثاني.'],
 ['وصف أنواع الإصابات الشائعة.',1,'أنواع الإصابات الثمانية (4-6، ص 64–67) في الدرس الثاني.'],
 ['تعداد أنواع الحواجز المستخدمة للحماية حول المعدات.',2,'حواجز الحماية بالمعدات (4-7، ص 67–73) في الدرس الثالث.']]})}
   ]},

  {st:2,short:'المقدمة',title:'4-1 المقدمة <span class="ltr">(Hand and Power Tools)</span>',ref:'ص 59',
   q:'العدد اليدوية في كل ورشة وكل بيت… فلماذا تشترط المواصفات تدريب من يستعملها؟',
   art:SFA.art('عامل يستعمل عدة يدوية وحوله خطران: الجروح والصعقة الكهربائية',
    person(180,276,{helmet:1,hands:[[150,212],[212,206]]})+`<path d="M212 206L230 240" stroke="var(--fg)" stroke-width="3.5" stroke-linecap="round"/><rect x="204" y="200" width="16" height="12" rx="3" transform="rotate(62 212 206)" fill="var(--live)" stroke="var(--fg)"/>`+
    `<circle cx="78" cy="124" r="40" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2.5"/><path d="M56 140L96 102L104 110L70 146Z" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M62 146L52 158" stroke="var(--fg)" stroke-width="6" stroke-linecap="round"/><path d="M92 128q6 10 0 14q-6-4 0-14z" fill="var(--stop)"/>`+
    `<circle cx="282" cy="124" r="40" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2.5"/><polygon points="290,94 266,128 280,128 272,156 298,118 284,118" fill="var(--live)" stroke="var(--fg)" stroke-width="1.5" stroke-linejoin="round"/>`+
    `<rect x="148" y="40" width="64" height="46" rx="6" fill="var(--surface)" stroke="var(--blue)" stroke-width="2.4"/>`+SFA.la(180,62,'OSHA',{fs:14,w:700,c:'var(--blue-ink)'})+`<path d="M160 72H200M160 78H192" stroke="var(--muted)" stroke-width="2"/>`+
    SFA.ar(78,186,'الجروح',{fs:14.5})+SFA.ar(282,186,'الصعقة',{fs:14.5})+SFA.ar(282,204,'الكهربائية',{fs:14.5})+
    SFA.hot(38,84,80,80,'الجروح: من أكثر إصابات العدد اليدوية، مثل جرح السكين أو حافة الأداة الحادة.')+
    SFA.hot(242,84,80,80,'الصعقة الكهربائية: من العدد الكهربائية اليدوية التالفة العزل أو غير الموصولة بالأرض.')+
    SFA.hot(146,38,68,50,'الأوشا ⟦OSHA⟧: الإدارة الأمريكية للسلامة والصحة المهنية. مواصفاتها تشدد على تدريب من يستعمل العدد اليدوية.')),
   cap:'خطران يذكرهما الكتاب، ومواصفات تطلب التدريب.<br><b>مرّر المؤشر على الدائرتين وعلى المستند (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا تشدد مواصفات الأوشا على تدريب من يستعمل العدد اليدوية؟',opts:[
     ['لأن العاملين يتعرضون لمخاطر مثل الجروح أو الصعقة الكهربائية',true,'هذا نص الكتاب (ص 59): التدريب على «الطرق السليمة والآمنة» يقلل هذه المخاطر.'],
     ['لأن العدد اليدوية غالية الثمن',false,'الكتاب لا يتحدث عن الثمن، بل عن المخاطر على العاملين.'],
     ['لأن العدد اليدوية نادرة في أماكن العمل',false,'بالعكس: «من الصعب أن يخلو أي مكان عمل من هذه المعدات».']]}}
   ],
   body:[
    {book:`<p>تعتبر العدد اليدوية جزءاً أساسياً في حياتنا العملية، حيث من الصعب أن يخلو أي مكان عمل من هذه المعدات التي تساعدنا في تسهيل كثير من العمليات.</p>
     <p>ويتعرض العاملون الذين يستخدمون المعدات والعدد اليدوية لكثير من المخاطر مثل الجروح أو الصعقة الكهربائية.</p>
     <p>لذلك تشدد مواصفات الأوشا الخاصة باستعمال العدد اليدوية على ضرورة تدريب العاملين الذين تتطلب مهامهم اليومية استعمال العدد اليدوية على الطرق السليمة والآمنة لاستخدام هذه العدد.</p>`,ref:'ص 59'},
    {add:`<p><b>الأوشا</b> <span class="ltr">(OSHA)</span> اختصار لاسم الإدارة الأمريكية للسلامة والصحة المهنية، وهي تصدر مواصفات وقواعد للسلامة في أماكن العمل، ويرجع إليها الكتاب في أكثر من موضع.</p>`,title:'ما الأوشا؟'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['يكاد لا يخلو مكان عمل من العدد اليدوية.',true,'«من الصعب أن يخلو أي مكان عمل من هذه المعدات» (ص 59).'],
 ['العدد اليدوية بسيطة فلا تحتاج إلى تدريب.',false,'المواصفات «تشدد… على ضرورة تدريب العاملين» على الطرق السليمة والآمنة (ص 59).'],
 ['الصعقة الكهربائية من مخاطر العدد اليدوية التي يذكرها الكتاب.',true,'«لكثير من المخاطر مثل الجروح أو الصعقة الكهربائية» (ص 59).']]})}
   ]},

  {st:3,short:'تعليمات السلامة',title:'4-2 تعليمات وإرشادات السلامة',ref:'ص 59–62',
   q:'مفتاح الربط على الصامولة: هل تسحبه نحوك أم تدفعه بعيداً؟ ولماذا يفرق ذلك؟',
   art:SFA.art('مفتاح ربط على صامولة، والشد نحو الشخص حتى يقع الضغط على الفك الثابت',
    SFA.emb(wrenchSVG({pull:1,load:'fixed',good:true}),[0,40,470,180],[6,92,348,133])+
    SFA.ar(180,62,'اسحب المقبض نحوك',{fs:15,w:700})+SFA.ar(84,94,'الفك الثابت',{fs:14,c:'var(--on)'})+SFA.ar(84,214,'الفك المتحرك',{fs:14})+SFA.ar(300,254,'اتجاه الشد',{fs:14,c:'var(--on)'})+
    SFA.hot(50,100,72,34,'الفك الثابت ⟦Permanent Jaw⟧: جزء من جسم المفتاح نفسه، قوي. نريد أن يقع عليه ضغط الشد.')+
    SFA.hot(50,150,72,40,'الفك المتحرك ⟦Movable Jaw⟧: يتحرك بالحلزون ليضبط الفتحة، وهو الجزء الأضعف «الذي من الممكن أن ينكسر ويسبب إصابة».')+
    SFA.hot(108,132,52,26,'الحلزون المحزز ⟦Knurl⟧: تديره بإصبعك فيتحرك الفك المتحرك ويضبط فتحة المفتاح على الصامولة.')+
    SFA.hot(276,170,52,74,'اتجاه الشد ⟦Direction of Pull⟧: نحوك. بهذا الوضع يقع الضغط على الفك الثابت (البند 17).')),
   cap:'المفتاح كما في الشكل <span class="ltr">(4-2)</span>.<br><b>مرّر المؤشر على الفكين والحلزون والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تريد إيقاف الهواء عن عدة تعمل بالهواء المضغوط. ماذا تفعل؟',opts:[
     ['تلوي الخرطوم بيدك حتى يتوقف الهواء',false,'هذا ممنوع صراحة: «لا تقم بلي (لوي) خرطوم الهواء… من أجل إيقاف تزويد الهواء» (البند 22).'],
     ['تغلق محبس الهواء',true,'«بل يجب إغلاق محبس الهواء» (البند 22، ص 61).'],
     ['تفصل الخرطوم من العدة وهو مضغوط',false,'الخرطوم المضغوط قد ينفلت ويصيب العامل؛ لذلك يجب أن يكون «مربوطاً جيداً» (البند 21).']]}}
   ],
   body:[
    {book:`<ol><li>يجب اتباع تعليمات السلامة التالية عند استعمال العدد اليدوية</li>
     <li>لا تستعمل أبدا عدة غير ملائمة للعمل، يجب الحصول على العدة الملائمة. (الشكل 4-1)</li>
     <li>لا تستعمل أبدا عدة بديلة مؤقتة كأن تكون مصممة لغرض آخر.</li>
     <li>تأكد أن المعدة ذات الحجم المناسب الصحيح لأداء العمل بأمان.</li></ol>`,ref:'ص 59'},
    {html:SFA.fig(fig41(),'الشكل <span class="ltr">(4-1)</span> ص 59 — رسم مبسّط (ليس الصورة الأصلية): ملصق توعوي لعامل يستعمل أداة في غير موضعها فتتطاير منها شرارة.',420)},
    {book:`<ol start="5"><li>يجب إبعاد أية عدد أو معدات تالفة أو غير سليمة وعدم استعمالها مطلقاً ووضع لافتة عليها تفيد بذلك حتى لا يستعملها شخص آخر عن طريق الخطأ وتتسبب في إصابته.</li>
     <li>يجب فحص العدد اليدوية قبل استخدامها والتأكد من أنها سليمة.</li>
     <li>لا تستعمل مفاتيح الربط التي تكون فكوكها مشوهة أو بالية.</li>
     <li>لا تستعمل أدوات القطع ذات الشفرات أو النقاط الضعيفة.</li>
     <li>لا تستعمل أدوات الصدم (الشواكيش) ذات الرؤوس المفلطحة أو الهشة.</li>
     <li>لا تستعمل الأدوات ذات المقابض الخشبية المتشققة أو المتشظية.</li>
     <li>احفظ سطوح ومقابض العدد نظيفة من الزيت لمنع انزلاقها عند الاستعمال.</li>
     <li>لا تستعمل المبارد (<span class="ltr">Files</span>) التي ليس لها مقابض.</li>
     <li>احفظ العدد في حالة نظيفة وحال الانتهاء من العمل بها يجب تنظيفها ووضعها في مكانها المعد لها (صندوق العدة) أو تثبيتها على الحائط.</li>
     <li>ثبت القطعة المراد العمل عليها على طاولة ذات سطح مستو ولا تمسكها في يدك وتعمل عليها.</li>
     <li>للعمل في الأجهزة الكهربائية تستعمل العدد ذات المقابض المعزولة (<span class="ltr">Insulated Handles</span>).</li>
     <li>تجنب استعمال وصلات لإطالة يد مفاتيح الربط حتى لا تتعرض للإصابة.</li>
     <li>ثبت مفتاح الربط ذو الفكين الثابت والمتحرك – (<span class="ltr">Movable Jaw Wrench</span>) وامسك يده جيدا واسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر حتى يكون الضغط على الجزء الثابت من المفتاح وليس الجزء المتحرك الذي من الممكن أن ينكسر ويسبب إصابة. (الشكل 4-2)</li></ol>`,ref:'ص 60'},
    {html:SFA.fig(wrenchSVG({labels:1,pull:1}),'الشكل <span class="ltr">(4-2)</span> ص 60 — رسم مبسّط: الفك الثابت <span class="ltr">(Permanent Jaw)</span> في الأعلى، والفك المتحرك <span class="ltr">(Movable Jaw)</span> في الأسفل، والحلزون <span class="ltr">(Knurl)</span>، واتجاه الشد <span class="ltr">(Direction of Pull)</span> نحو الشخص.',470)},
    {tip:`<p>في الشكل <span class="ltr">(4-2)</span> يقع الفك المتحرك في جهة الشد. فإذا سحبت المقبض نحوك والمفتاح بهذا الوضع ضغطت الصامولةُ على الفك الثابت المتصل بجسم المفتاح، وهو الأقوى. أما إذا دفعت المقبض بعيداً عنك (أو قلبت المفتاح) فيقع الضغط على الفك المتحرك فقد ينكسر، وتنفلت يدك إلى الأمام فتصطدم بما أمامها.</p>`,title:'لماذا السحب نحوك؟'},
    {title:'مختبر مصغّر: على أي فك يقع الضغط؟',widget:(el,B)=>DCML.lab(el,B,{
     predict:{q:'المفتاح كما في الشكل <span class="ltr">(4-2)</span>، لكنك دفعت المقبض بعيداً عنك. على أي فك يقع الضغط؟',opts:[
      ['على الفك الثابت',false,'الفك الثابت يتحمل الضغط عندما تسحب نحوك والمفتاح كما في الشكل، لا عندما تدفع.'],
      ['على الفك المتحرك، وقد ينكسر',true,'عكس اتجاه الحركة يعكس الفك الذي يتحمل الضغط؛ لذلك يقول الكتاب «اسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر».'],
      ['لا يقع ضغط على أي فك',false,'الصامولة تقاوم الدوران دائماً فتضغط على أحد الفكين.']]},
     ins:[{k:'flip',l:'وضع المفتاح على الصامولة',seg:[[0,'كما في الشكل (4-2)'],[1,'مقلوب']],v:0},{k:'dir',l:'حركة يدك',seg:[[1,'اسحب نحوك ↓'],[-1,'ادفع بعيداً ↑']],v:1}],
     calc:(s)=>{const toward=s.dir>0,fixed=(toward===!s.flip),good=fixed&&toward?true:fixed?null:false;
      return {pic:wrenchSVG({flip:s.flip,pull:s.dir,load:fixed?'fixed':'mov',good,labels:1,you:1,crack:!fixed}),
       msg:good===true?'<b>صحيح:</b> تسحب نحوك والضغط على الفك الثابت (الأخضر). هذا ما يطلبه البند 17.':fixed?'الضغط على الفك الثابت، لكنك تدفع بعيداً عنك: إذا انفلت المفتاح اندفعت يدك إلى الأمام. الأفضل أن تقلب المفتاح وتسحب نحوك.':'<b>خطر:</b> الضغط على الفك المتحرك (الأحمر)، «الذي من الممكن أن ينكسر ويسبب إصابة». اقلب المفتاح أو اعكس الحركة.',cls:good===true?'':fixed?'warn':'bad'}}})},
    {book:`<ol start="18"><li>لا تحفظ العدد في جيبك أثناء العمل ويفضل وضعها في حقيبة خاصة (الشكل 4-3) مع تغطية أطراف العدد ذات الأطراف الحادة حتى لا تتسبب في حدوث جروح.</li>
     <li>يجب التأكد من أن جميع العدد الكهربائية اليدوية موصولة بالأرض <span class="ltr">Grounded</span> وأن المادة العازلة على الأسلاك الكهربائية الخاصة بها سليمة.</li>
     <li>يجب التأكد من أن جميع العدد الكهربائية اليدوية مزودة بمفتاح تشغيل وإيقاف (<span class="ltr">On / Off Switch</span>) قبل العمل بها.</li>
     <li>يجب التأكد من أن خرطوم الهواء المضغوط الموصل بالعدد اليدوية التي تعمل بالهواء مربوط جيدا وذلك قبل استخدام هذه العدد حتى لا ينفلت خرطوم الهواء ويتسبب في إصابة العامل الذي يستعمل المعدة.</li>
     <li>لا تقم بلي (لوي) خرطوم الهواء الموصل بالعدد اليدوية من أجل إيقاف تزويد الهواء بل يجب إغلاق محبس الهواء.</li>
     <li>لا تقذف العدد إلى أعلى أو إلى أسفل ويفضل استخدام حقيبة خاصة وحبل لرفع العدد أو إنزالها في حالة العمل بأماكن عالية.</li>
     <li>لا تستعمل الأدوات الكهربائية اليدوية في الأماكن الخطرة (الأماكن الموجود بها أبخرة للمواد القابلة للاشتعال) ما لم تكن هذه المعدات مصممة للعمل في هذه الأماكن.</li>
     <li>يجب فحص حجر الجلخ في ماكينات الجلخ والتأكد من عدم وجود شروخ به وأنه غير متآكل، كذلك يجب التأكد من وجود أغطية الحماية في أماكنها على ماكينات الجلخ قبل استعمالها مع ضرورة استخدام نظارات السلامة <span class="ltr">Safety Goggles</span> للوقاية من الشظايا المتطايرة.</li>
     <li>يجب التأكد من وجود أغطية الحماية على جميع العدد التي بها أجزاء دوارة قبل استعمالها.</li></ol>`,ref:'ص 61'},
    {html:SFA.fig(fig43(),'الشكل <span class="ltr">(4-3)</span> ص 61 — رسم مبسّط: حزام عدة يُلبس على الوسط، بجيوب فيها مفكات وزرادية ومفتاح.',380)},
    {book:`<ol start="27"><li>بلغ رئيسك المباشر فوراً عن أية تلفيات أو تشوهات في العدد اليدوية حتى يتم إبعادها حتى لا تتسبب في حدوث إصابات.</li>
     <li>يتم وضع ملصق خاص على العدد والأدوات غير الصالحة ولا يتم استعمالها، وإذا كان بالإمكان إصلاحها يتم هذا الإصلاح وبعدها يتم إزالة الملصق أما إذا لم يكن من الممكن إصلاحها يتم إبعادها نهائيا من العمل.</li></ol>`,ref:'ص 62'},
    {watch:`<p>البند الأول في القائمة جملة تمهيدية وليس تعليمة، فالتعليمات الفعلية <span class="ltr">27</span> بنداً. لا تحتاج إلى حفظ أرقامها؛ المهم أن تعرف كل تعليمة ولماذا وُضعت.</p>`},
    {title:'مختبر مصغّر: ماذا تفعل في هذا الموقف؟',widget:(el,B)=>DCML.cases(el,B,{intro:'لكل موقف اختر التصرف الذي تطلبه تعليمات الكتاب.',cases:[
     {q:'وجدت شاكوشاً مقبضه الخشبي متشقق.',opts:[['تلفّه بشريط لاصق وتستعمله',false,'«لا تستعمل الأدوات ذات المقابض الخشبية المتشققة» (البند 10).'],['تبعده وتضع عليه ملصقاً وتبلغ رئيسك',true,'البنود 5 و27 و28: يُبعد ويوضع عليه ملصق، ويُصلح إن أمكن وإلا يُبعد نهائياً.'],['تعيده إلى الصندوق ليستعمله غيرك',false,'هذا ما يمنعه البند 5: «حتى لا يستعملها شخص آخر عن طريق الخطأ».']]},
     {q:'تعمل فوق سقالة وتحتاج مفكاً من زميلك على الأرض.',opts:[['يقذفه إليك وتلتقطه',false,'«لا تقذف العدد إلى أعلى أو إلى أسفل» (البند 23).'],['ترفعه بحقيبة خاصة وحبل',true,'«ويفضل استخدام حقيبة خاصة وحبل لرفع العدد أو إنزالها في حالة العمل بأماكن عالية» (البند 23).'],['تنزل وتضعه في جيبك',false,'«لا تحفظ العدد في جيبك أثناء العمل» (البند 18).']]},
     {q:'تريد استعمال مثقاب كهربائي عادي في مخزن فيه أبخرة مذيبات قابلة للاشتعال.',opts:[['تستعمله بسرعة ثم تخرج',false,'الشرارة في المثقاب العادي قد تشعل الأبخرة.'],['لا تستعمله ما لم يكن مصمماً للعمل في هذه الأماكن',true,'البند 24: «ما لم تكن هذه المعدات مصممة للعمل في هذه الأماكن».'],['تستعمله إذا كان سلكه سليماً',false,'سلامة السلك شرط عام (البند 19)، لكنها لا تكفي في مكان فيه أبخرة قابلة للاشتعال.']]},
     {q:'قبل تشغيل آلة الجلخ.',opts:[['تفحص الحجر من الشروخ والتآكل، وتتأكد من أغطية الحماية، وتلبس نظارة السلامة',true,'البند 25 (ص 61) يجمع الثلاثة.'],['تكفي النظارة لأنها تحمي العين',false,'البند 25 يطلب أيضاً فحص الحجر والتأكد من الأغطية.'],['تنزع الغطاء لترى الحجر جيداً',false,'«يجب التأكد من وجود أغطية الحماية في أماكنها» (البند 25).']]}]})}
   ]},

  {st:4,short:'أخطاء الاستعمال',title:'4-3 بعض الأخطاء في استعمال العدد اليدوية والتي تتسبب في وقوع إصابات',ref:'ص 62',
   q:'مفتاح الصواميل في يدك والمطرقة بعيدة… لماذا يُعد الطرق بالمفتاح خطأ قد يصيبك؟',
   art:SFA.art('أربعة أنواع من الأخطاء في استعمال العدد اليدوية',
    [[32,62],[186,62],[32,176],[186,176]].map(([x,y])=>`<rect x="${x}" y="${y}" width="142" height="104" rx="14" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`).join('')+
    '<g transform="translate(154 0)">'+`<rect x="44" y="128" width="70" height="10" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="1.5"/><path d="M80 128V112" stroke="var(--fg)" stroke-width="3"/><g transform="translate(108 92) rotate(40)"><rect x="-5" y="-4" width="10" height="44" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M-13 -16A14 14 0 1 0 13 -16L7 -8H-7Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/></g>`+arcArrow(110,120,30,-150,-110,RED,2)+'</g>'+'<g transform="translate(-154 0)">'+`<rect x="210" y="104" width="80" height="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><polygon points="290,104 304,110 290,116" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><path d="M210 98L204 102L210 106L202 110L210 114L204 118L210 122" fill="var(--surface-2)" stroke="var(--stop)" stroke-width="2.4" stroke-linejoin="round"/>`+'</g>'+'<g transform="translate(154 0)">'+`<circle cx="140" cy="200" r="13" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><rect x="130" y="214" width="20" height="30" rx="6" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.6"/><path d="M50 226H86" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/><path d="M86 222L112 226L86 230Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+arrow(92,240,124,240,RED,2.2)+'</g>'+'<g transform="translate(-154 0)">'+`<rect x="214" y="222" width="86" height="34" rx="4" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="1.6"/><polygon points="228,222 234,196 240,222" fill="var(--surface)" stroke="var(--stop)" stroke-width="1.8"/><polygon points="250,222 258,192 262,222" fill="var(--surface)" stroke="var(--stop)" stroke-width="1.8"/><polygon points="274,222 280,200 286,222" fill="var(--surface)" stroke="var(--stop)" stroke-width="1.8"/>`+'</g>'+SFA.ar(257,158,'عدة غير مناسبة',{fs:14})+SFA.ar(103,158,'عدة تالفة',{fs:14})+SFA.ar(257,272,'استعمال غير صحيح',{fs:14})+SFA.ar(103,272,'مكان غير مأمون',{fs:14})+
    SFA.hot(186,62,142,104,'استعمال عدد غير مناسبة للعمل: مثل استعمال مفتاح الصواميل كمطرقة. المفتاح ليس مصمماً للطرق فقد ينكسر أو ينزلق.')+
    SFA.hot(32,62,142,104,'استعمال عدد يدوية تالفة: مثل أجنة رأسها مفلطح ومشرشر (الحافة الحمراء)؛ قد تتطاير منها شظايا عند الطرق.')+
    SFA.hot(186,176,142,104,'استعمال غير صحيح: مثل جذب السكين في اتجاه الشخص أثناء القطع (السهم الأحمر نحو الجسم).')+
    SFA.hot(32,176,142,104,'عدم وضع العدد في أماكن مأمونة: مثل وضع العدد ذات الأحرف الحادة في صندوق العدة وحافتها الحادة إلى أعلى.')),
   cap:'أنواع الأخطاء الأربعة في الكتاب، ومثال من كل نوع.<br><b>مرّر المؤشر على كل مربع (أو المسه في الجوال) لتقرأ المثال.</b>',
   side:[
    {predict:{q:'وضع سكين في جيب الملابس بدون جراب واقٍ: من أي نوع من الأخطاء؟',opts:[
     ['استعمال عدد يدوية تالفة',false,'السكين قد تكون سليمة؛ الخطأ في مكان حفظها.'],
     ['استعمال غير صحيح للعدد',false,'الاستعمال غير الصحيح يكون أثناء العمل بها (مثل جذب السكين نحوك).'],
     ['عدم وضع العدد والآلات في أماكن مأمونة',true,'ورد بنصه تحت النوع الرابع (ص 62).']]}}
   ],
   body:[
    {book:`<ol>
     <li><b>استعمال آلات أو عدد غير مناسبة للعمل مثل:</b><ul><li>استعمال المبرد كرافعة.</li><li>استعمال مفتاح الصواميل كمطرقة.</li><li>استعمال أجنة في فك الصواميل.</li><li>استعمال سكين كمفك.</li></ul></li>
     <li><b>استعمال عدد يدوية تالفة مثل:</b><ul><li>استعمال أجنة برأس مفلطحة أو مشرشرة.</li><li>استعمال شاكوش بيد غير مثبتة جيدا في الرأس أو بها شروخ.</li><li>استعمال منشار للقطع وسلاحه غير مسنون.</li></ul></li>
     <li><b>استعمال غير صحيح للعدد والآلات اليدوية مثل:</b><ul><li>تقطيع مسامير أو أسلاك معدنية بمنشار للخشب.</li><li>جذب السكين في اتجاه الشخص أثناء قطع بعض المواد.</li></ul></li>
     <li><b>عدم وضع العدد والآلات في أماكن مأمونة:</b><ul><li>إلقاء العدد والآلات اليدوية على الأرض أو أسطح عالية معرضة للسقوط.</li><li>وضع العدد والأدوات ذات الأحرف الحادة كالسكين بجيوب الملابس بدون جراب واقي.</li><li>وضع الأدوات والعدد ذات الأحرف الحادة أو المسننة في صندوق العدة وحافتها الحادة المتجهة إلى أعلى.</li></ul></li></ol>`,ref:'ص 62'},
    {tip:`<p>اسأل نفسك أربعة أسئلة عن أي خطأ: هل العدة <b>مناسبة</b> لهذا العمل؟ هل هي <b>سليمة</b>؟ هل <b>أستعملها</b> بالطريقة الصحيحة؟ هل <b>أحفظها</b> في مكان مأمون؟ كل سؤال يقابل نوعاً من الأخطاء الأربعة.</p>`,title:'أربعة أسئلة تكشف الخطأ'},
    {title:'مختبر مصغّر: صنّف الخطأ',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل خطأ اضغط نوعه، ثم اقرأ السبب.',cats:['غير مناسبة','تالفة','استعمال غير صحيح','مكان غير مأمون'],items:[
 ['استعمال المبرد كرافعة.',0,'المبرد ليس رافعة: عدة غير مناسبة للعمل (ص 62).'],
 ['منشار سلاحه غير مسنون.',1,'«استعمال منشار للقطع وسلاحه غير مسنون» من العدد التالفة (ص 62).'],
 ['تقطيع أسلاك معدنية بمنشار للخشب.',2,'المنشار قد يكون سليماً لكنه يُستعمل في غير ما صُمم له: استعمال غير صحيح (ص 62).'],
 ['ترك العدد على حافة سطح عالٍ معرض للسقوط.',3,'«إلقاء العدد… على الأرض أو أسطح عالية معرضة للسقوط» (ص 62).'],
 ['استعمال سكين كمفك.',0,'ورد تحت «عدد غير مناسبة للعمل» (ص 62).'],
 ['شاكوش رأسه غير مثبت جيداً في اليد.',1,'«شاكوش بيد غير مثبتة جيدا في الرأس أو بها شروخ» (ص 62).'],
 ['جذب السكين نحو الجسم أثناء القطع.',2,'«جذب السكين في اتجاه الشخص أثناء قطع بعض المواد» (ص 62).']]})}
   ]},

  {st:5,short:'قواعد السلامة الأربع',title:'4-4 قواعد السلامة لاستخدام العدد اليدوية',ref:'ص 63',
   q:'أربع قواعد فقط تجمع كل ما سبق… هل تستطيع أن تربط كل قاعدة بالخطأ الذي تمنعه؟',
   art:SFA.art('قواعد السلامة الأربع لاستخدام العدد اليدوية',
    `<path d="M180 160L180 52A108 108 0 0 1 288 160Z" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><path d="M180 160L288 160A108 108 0 0 1 180 268Z" fill="var(--on-soft)" stroke="var(--fg)" stroke-width="2"/><path d="M180 160L180 268A108 108 0 0 1 72 160Z" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="2"/><path d="M180 160L72 160A108 108 0 0 1 180 52Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+
    `<circle cx="180" cy="160" r="26" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M168 160L177 169L193 150" fill="none" stroke="var(--on)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`+
    SFA.ar(226,112,'المناسبة',{fs:15,w:700})+SFA.ar(226,130,'حجماً ونوعاً',{fs:12.5,w:500})+SFA.ar(230,212,'بحالة جيدة',{fs:15,w:700})+SFA.ar(132,212,'بالطريقة',{fs:15,w:700})+SFA.ar(132,230,'السليمة',{fs:15,w:700})+SFA.ar(134,112,'التخزين',{fs:15,w:700})+SFA.ar(134,130,'نظيفة وجيدة',{fs:12.5,w:500})+
    SFA.hot(184,56,102,100,'«يجب استعمال العدة المناسبة من حيث الحجم والنوع لأداء العمل» — تمنع خطأ «عدد غير مناسبة».')+
    SFA.hot(184,164,102,100,'«يجب أن تكون المعدة بحالة جيدة ولا توجد بها أية تلفيات» — تمنع خطأ «عدد تالفة».')+
    SFA.hot(74,164,102,100,'«استعمل المعدة بالطريقة السليمة» — تمنع خطأ «الاستعمال غير الصحيح».')+
    SFA.hot(74,56,102,100,'«يجب تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة» — تمنع خطأ «أماكن غير مأمونة».')),
   cap:'القواعد الأربع حلقة واحدة.<br><b>مرّر المؤشر على كل ربع (أو المسه في الجوال) لتقرأ القاعدة والخطأ الذي تمنعه.</b>',
   side:[
    {predict:{q:'شاكوش سليم ومناسب، لكن العامل يتركه بعد العمل ملقى على الأرض. أي قاعدة خالفها؟',opts:[
     ['تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة',true,'القاعدة الرابعة (ص 63)؛ والخطأ المقابل «إلقاء العدد… على الأرض» (ص 62).'],
     ['استعمال العدة المناسبة من حيث الحجم والنوع',false,'الشاكوش مناسب للطرق؛ المخالفة بعد انتهاء العمل.'],
     ['أن تكون المعدة بحالة جيدة',false,'الشاكوش سليم؛ المخالفة في حفظه.']]}}
   ],
   body:[
    {book:`<ul><li>يجب استعمال العدة المناسبة من حيث الحجم والنوع لأداء العمل.</li><li>يجب أن تكون المعدة بحالة جيدة ولا توجد بها أية تلفيات.</li><li>استعمل المعدة بالطريقة السليمة.</li><li>يجب تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة.</li></ul>`,ref:'ص 63'},
    {tip:`<p>القواعد الأربع تقابل أنواع الأخطاء الأربعة في <span class="ltr">4-3</span>: العدة المناسبة ← ضد «عدد غير مناسبة»، والحالة الجيدة ← ضد «عدد تالفة»، والطريقة السليمة ← ضد «استعمال غير صحيح»، والتخزين ← ضد «أماكن غير مأمونة».</p>`,title:'قاعدة لكل خطأ'},
    {title:'مختبر مصغّر: أي قاعدة تمنع هذا الخطأ؟',widget:(el,B)=>DCML.cases(el,B,{intro:'لكل خطأ اختر القاعدة التي لو اتُّبعت لما وقع.',cases:[
     {q:'استعمال أجنة في فك الصواميل.',opts:[['استعمل المعدة بالطريقة السليمة',false,'الأجنة نفسها ليست عدة فك الصواميل أصلاً؛ المشكلة في اختيار العدة.'],['استعمال العدة المناسبة من حيث الحجم والنوع',true,'لفك الصواميل عدة مناسبة هي مفتاح الربط بالحجم الصحيح.'],['تخزين المعدة بحالة نظيفة',false,'التخزين لا علاقة له بهذا الخطأ.']]},
     {q:'أجنة برأس مفلطحة ومشرشرة.',opts:[['أن تكون المعدة بحالة جيدة ولا توجد بها أية تلفيات',true,'الرأس المشرشر تلف؛ القاعدة الثانية (ص 63).'],['استعمال العدة المناسبة',false,'الأجنة قد تكون مناسبة للعمل، لكنها تالفة.'],['تخزين المعدة',false,'الخطأ في حالة العدة لا في مكانها.']]},
     {q:'عدد حادة في صندوق العدة وحافتها إلى أعلى.',opts:[['استعمل المعدة بالطريقة السليمة',false,'الخطأ ليس أثناء الاستعمال.'],['أن تكون المعدة بحالة جيدة',false,'العدد سليمة؛ المشكلة في طريقة وضعها.'],['تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة',true,'التخزين الجيد يعني أن تُحفظ بحيث لا تجرح من يمد يده إلى الصندوق.']]}]})}
   ]},

  {recap:[
   'العاملون بالعدد اليدوية معرضون لمخاطر مثل الجروح أو الصعقة الكهربائية؛ لذلك تشترط مواصفات الأوشا تدريبهم (ص 59).',
   'من أهم التعليمات: العدة الملائمة بالحجم الصحيح، وفحصها قبل الاستعمال، وإبعاد التالفة بملصق، والمقابض المعزولة للكهرباء، وإغلاق محبس الهواء بدل لي الخرطوم (ص 59–62).',
   'اسحب مفتاح الربط نحوك حتى يقع الضغط على الفك الثابت لا المتحرك — الشكل (4-2).',
   'الأخطاء أربعة أنواع: عدد غير مناسبة، وعدد تالفة، واستعمال غير صحيح، وأماكن غير مأمونة (ص 62).',
   'وقواعد السلامة أربع تقابلها: المناسبة حجماً ونوعاً، وبحالة جيدة، وبالطريقة السليمة، والتخزين النظيف (ص 63).']}
],
 theory:[
  {h:'الوحدة الرابعة: العدد اليدوية — الهدف العام والأهداف التفصيلية',ref:'ص 57–58',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد العامة لسلامة استخدام العدد والأدوات وإرشادات السلامة الصناعية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يقوم المتدرب بحصر الأخطاء العامة عند استخدام العدد والأدوات.</li><li>أن يذكر المتدرب القواعد العامة في استخدام العدد والأدوات.</li><li>أن يقوم المتدرب بحصر مخاطر العدد والأدوات.</li><li>أن يصف المتدرب أنواع الإصابات الشائعة عند استخدام العدد والأدوات.</li><li>أن يعدد المتدرب أنواع الحواجز المستخدمة للحماية حول المعدات.</li></ol>`},
  {h:'4-1 المقدمة (Hand and Power Tools)',ref:'ص 59',html:`<p>تعتبر العدد اليدوية جزءاً أساسياً في حياتنا العملية، حيث من الصعب أن يخلو أي مكان عمل من هذه المعدات التي تساعدنا في تسهيل كثير من العمليات.</p>
   <p>ويتعرض العاملون الذين يستخدمون المعدات والعدد اليدوية لكثير من المخاطر مثل <b>الجروح</b> أو <b>الصعقة الكهربائية</b>.</p>
   <p>لذلك تشدد مواصفات <b>الأوشا</b> الخاصة باستعمال العدد اليدوية على ضرورة <b>تدريب العاملين</b> الذين تتطلب مهامهم اليومية استعمال العدد اليدوية على الطرق السليمة والآمنة لاستخدام هذه العدد.</p>`},
  {h:'4-2 تعليمات وإرشادات السلامة',ref:'ص 59–62',html:`<ol><li>يجب اتباع تعليمات السلامة التالية عند استعمال العدد اليدوية</li>
   <li>لا تستعمل أبدا عدة غير ملائمة للعمل، يجب الحصول على العدة الملائمة. (الشكل 4-1)</li>
   <li>لا تستعمل أبدا عدة بديلة مؤقتة كأن تكون مصممة لغرض آخر.</li>
   <li>تأكد أن المعدة ذات الحجم المناسب الصحيح لأداء العمل بأمان.</li></ol>`},
  fig('4-1','ص 59',SIMPLE+' — ملصق توعوي: عامل يستعمل أداة في غير موضعها فتتطاير منها شرارة، وعليه عبارة «Don’t Play The Fool / Use The Right Tool».',fig41,420),
  {html:`<ol start="5"><li>يجب إبعاد أية عدد أو معدات تالفة أو غير سليمة وعدم استعمالها مطلقاً ووضع لافتة عليها تفيد بذلك حتى لا يستعملها شخص آخر عن طريق الخطأ وتتسبب في إصابته. <span class="ref">ص 60</span></li>
   <li>يجب فحص العدد اليدوية قبل استخدامها والتأكد من أنها سليمة.</li>
   <li>لا تستعمل مفاتيح الربط التي تكون فكوكها مشوهة أو بالية.</li>
   <li>لا تستعمل أدوات القطع ذات الشفرات أو النقاط الضعيفة.</li>
   <li>لا تستعمل أدوات الصدم (الشواكيش) ذات الرؤوس المفلطحة أو الهشة.</li>
   <li>لا تستعمل الأدوات ذات المقابض الخشبية المتشققة أو المتشظية.</li>
   <li>احفظ سطوح ومقابض العدد نظيفة من الزيت لمنع انزلاقها عند الاستعمال.</li>
   <li>لا تستعمل المبارد (<span class="ltr">Files</span>) التي ليس لها مقابض.</li>
   <li>احفظ العدد في حالة نظيفة وحال الانتهاء من العمل بها يجب تنظيفها ووضعها في مكانها المعد لها (صندوق العدة) أو تثبيتها على الحائط.</li>
   <li>ثبت القطعة المراد العمل عليها على طاولة ذات سطح مستو ولا تمسكها في يدك وتعمل عليها.</li>
   <li>للعمل في الأجهزة الكهربائية تستعمل العدد ذات المقابض المعزولة (<span class="ltr">Insulated Handles</span>).</li>
   <li>تجنب استعمال وصلات لإطالة يد مفاتيح الربط حتى لا تتعرض للإصابة.</li>
   <li>ثبت مفتاح الربط ذو الفكين الثابت والمتحرك – (<span class="ltr">Movable Jaw Wrench</span>) وامسك يده جيدا واسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر حتى يكون الضغط على الجزء الثابت من المفتاح وليس الجزء المتحرك الذي من الممكن أن ينكسر ويسبب إصابة. (الشكل 4-2)</li></ol>`},
  fig('4-2','ص 60',SIMPLE+' — مفتاح ربط فرنساوي على صامولة: الفك الثابت (Permanent Jaw) في الأعلى، والفك المتحرك (Movable Jaw) في الأسفل، والحلزون المحزز لضبط الفتحة (Knurl)، والسهم اتجاه الشد (Direction of Pull) نحو الشخص.',()=>wrenchSVG({labels:1,pull:1}),470),
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في الشكل (4-2) يقع الفك المتحرك في جهة الشد. فإذا سحبت المقبض نحوك والمفتاح بهذا الوضع وقع الضغط على الفك الثابت المتصل بجسم المفتاح. جرّب الوضعين في تبويب «المختبر» وانظر على أي فك يقع الضغط.'},
  {html:`<ol start="18"><li>لا تحفظ العدد في جيبك أثناء العمل ويفضل وضعها في حقيبة خاصة (الشكل 4-3) مع تغطية أطراف العدد ذات الأطراف الحادة حتى لا تتسبب في حدوث جروح. <span class="ref">ص 61</span></li></ol>`},
  fig('4-3','ص 61',SIMPLE+' — حزام عدة جلدي يُلبس على الوسط، بجيوب فيها مفكات وزرادية ومفتاح.',fig43,380),
  {html:`<ol start="19"><li>يجب التأكد من أن جميع العدد الكهربائية اليدوية موصولة بالأرض <span class="ltr">Grounded</span> وأن المادة العازلة على الأسلاك الكهربائية الخاصة بها سليمة.</li>
   <li>يجب التأكد من أن جميع العدد الكهربائية اليدوية مزودة بمفتاح تشغيل وإيقاف (<span class="ltr">On / Off Switch</span>) قبل العمل بها.</li>
   <li>يجب التأكد من أن خرطوم الهواء المضغوط الموصل بالعدد اليدوية التي تعمل بالهواء مربوط جيدا وذلك قبل استخدام هذه العدد حتى لا ينفلت خرطوم الهواء ويتسبب في إصابة العامل الذي يستعمل المعدة.</li>
   <li>لا تقم بلي (لوي) خرطوم الهواء الموصل بالعدد اليدوية من أجل إيقاف تزويد الهواء بل يجب إغلاق محبس الهواء.</li>
   <li>لا تقذف العدد إلى أعلى أو إلى أسفل ويفضل استخدام حقيبة خاصة وحبل لرفع العدد أو إنزالها في حالة العمل بأماكن عالية.</li>
   <li>لا تستعمل الأدوات الكهربائية اليدوية في الأماكن الخطرة (الأماكن الموجود بها أبخرة للمواد القابلة للاشتعال) ما لم تكن هذه المعدات مصممة للعمل في هذه الأماكن.</li>
   <li>يجب فحص حجر الجلخ في ماكينات الجلخ والتأكد من عدم وجود شروخ به وأنه غير متآكل، كذلك يجب التأكد من وجود أغطية الحماية في أماكنها على ماكينات الجلخ قبل استعمالها مع ضرورة استخدام نظارات السلامة <span class="ltr">Safety Goggles</span> للوقاية من الشظايا المتطايرة.</li>
   <li>يجب التأكد من وجود أغطية الحماية على جميع العدد التي بها أجزاء دوارة قبل استعمالها.</li>
   <li>بلغ رئيسك المباشر فوراً عن أية تلفيات أو تشوهات في العدد اليدوية حتى يتم إبعادها حتى لا تتسبب في حدوث إصابات. <span class="ref">ص 62</span></li>
   <li>يتم وضع ملصق خاص على العدد والأدوات غير الصالحة ولا يتم استعمالها، وإذا كان بالإمكان إصلاحها يتم هذا الإصلاح وبعدها يتم إزالة الملصق أما إذا لم يكن من الممكن إصلاحها يتم إبعادها نهائيا من العمل.</li></ol>`},
  {h:'4-3 بعض الأخطاء في استعمال العدد اليدوية والتي تتسبب في وقوع إصابات',ref:'ص 62',html:`<ol>
   <li><b>استعمال آلات أو عدد غير مناسبة للعمل مثل:</b><ul><li>استعمال المبرد كرافعة.</li><li>استعمال مفتاح الصواميل كمطرقة.</li><li>استعمال أجنة في فك الصواميل.</li><li>استعمال سكين كمفك.</li></ul></li>
   <li><b>استعمال عدد يدوية تالفة مثل:</b><ul><li>استعمال أجنة برأس مفلطحة أو مشرشرة.</li><li>استعمال شاكوش بيد غير مثبتة جيدا في الرأس أو بها شروخ.</li><li>استعمال منشار للقطع وسلاحه غير مسنون.</li></ul></li>
   <li><b>استعمال غير صحيح للعدد والآلات اليدوية مثل:</b><ul><li>تقطيع مسامير أو أسلاك معدنية بمنشار للخشب.</li><li>جذب السكين في اتجاه الشخص أثناء قطع بعض المواد.</li></ul></li>
   <li><b>عدم وضع العدد والآلات في أماكن مأمونة:</b><ul><li>إلقاء العدد والآلات اليدوية على الأرض أو أسطح عالية معرضة للسقوط.</li><li>وضع العدد والأدوات ذات الأحرف الحادة كالسكين بجيوب الملابس بدون جراب واقي.</li><li>وضع الأدوات والعدد ذات الأحرف الحادة أو المسننة في صندوق العدة وحافتها الحادة المتجهة إلى أعلى.</li></ul></li></ol>`},
  {h:'4-4 قواعد السلامة لاستخدام العدد اليدوية',ref:'ص 63',html:`<ul><li>يجب استعمال العدة المناسبة من حيث <b>الحجم والنوع</b> لأداء العمل.</li><li>يجب أن تكون المعدة <b>بحالة جيدة</b> ولا توجد بها أية تلفيات.</li><li>استعمل المعدة <b>بالطريقة السليمة</b>.</li><li>يجب <b>تخزين</b> المعدة بعد الاستعمال بحالة نظيفة وجيدة.</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> القواعد الأربع تقابل أنواع الأخطاء الأربعة في 4-3: العدة المناسبة ← ضد «عدد غير مناسبة»، والحالة الجيدة ← ضد «عدد تالفة»، والطريقة السليمة ← ضد «استعمال غير صحيح»، والتخزين ← ضد «أماكن غير مأمونة». في «المختبر» نشاط تبحث فيه عن المخالفات في صورة ورشة، ونشاط تصنّف فيه الأخطاء.'}
 ],
 lab:(el)=>hazardLab(el),
 quiz:[
  {q:'لماذا تشدد مواصفات الأوشا على تدريب من يستعمل العدد اليدوية؟',o:['لأن العدد اليدوية غالية الثمن','لأن العاملين يتعرضون لمخاطر مثل الجروح أو الصعقة الكهربائية','لأن العدد اليدوية لا تحتاج صيانة','لأن الأوشا تمنع العدد الكهربائية'],c:1,e:'«ويتعرض العاملون الذين يستخدمون المعدات والعدد اليدوية لكثير من المخاطر مثل الجروح أو الصعقة الكهربائية» (ص 59).'},
  {q:'عامل يريد إيقاف الهواء عن عدة هوائية. ما الصحيح؟',o:['يلوي الخرطوم بيده','يفصل الخرطوم وهو مضغوط','يغلق محبس الهواء','يضغط على الخرطوم بقدمه'],c:2,e:'«لا تقم بلي (لوي) خرطوم الهواء… بل يجب إغلاق محبس الهواء» (البند 22، ص 61).'},
  {q:'كيف تشد مفتاح الربط ذا الفكين الثابت والمتحرك؟',o:['تدفع اليد بعيداً عنك ليقع الضغط على الفك المتحرك','تسحب اليد في اتجاهك ليقع الضغط على الجزء الثابت','تضع ماسورة على يده لتطيلها','تطرق على يده بالشاكوش'],c:1,e:'«اسحب اليد في اتجاهك أفضل من الضغط على اليد في الاتجاه الآخر حتى يكون الضغط على الجزء الثابت من المفتاح» (البند 17، ص 60).'},
  {q:'«استعمال مفتاح الصواميل كمطرقة» من أي أنواع الأخطاء؟',o:['استعمال عدد غير مناسبة للعمل','استعمال عدد تالفة','عدم وضع العدد في أماكن مأمونة','ليس خطأً'],c:0,e:'ورد تحت «استعمال آلات أو عدد غير مناسبة للعمل» (ص 62).'},
  {q:'ماذا تفعل بعدة يدوية تالفة؟',o:['تستعملها بحذر','تتركها في صندوق العدة','تُبعدها وتضع عليها ملصقاً حتى تُصلح أو تُبعد نهائياً','تعطيها لزميل'],c:2,e:'البندان 5 و28 (ص 60 و62): تُبعد ويوضع عليها ملصق، وتُصلح إن أمكن وإلا تُبعد نهائياً.'},
  {q:'أي مما يلي من قواعد السلامة الأربع لاستخدام العدد اليدوية؟',o:['استعمال أي عدة متوفرة','تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة','حمل العدد في الجيب','إطالة يد المفتاح بماسورة'],c:1,e:'«يجب تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة» (ص 63).'}
 ]
});

/* ---------------- u4-l2 ---------------- */
B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'63–67',
 title:'مخاطر الآلات وأنواع الإصابات',
 summary:'أنواع المخاطر بالآلات ومصادرها (نقاط التشغيل ونقاط الالتقاء)، وأنواع الإصابات الثمانية الشائعة عند التعامل مع المعدات.',
 stations:[
  {intro:true},
{st:1,short:'مخاطر الآلات',title:'4-5 مخاطر المعدات والآلات <span class="ltr">(Machine Hazards)</span>',ref:'ص 63',
   q:'الآلة متوقفة وأنت تصلحها… فهل انتهى خطرها؟',
   art:SFA.art('آلة مفتوحة الغطاء وعامل يجري لها صيانة',
    `<rect x="70" y="150" width="150" height="110" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><rect x="70" y="258" width="150" height="12" fill="var(--fg)"/>`+
    `<g transform="translate(118 196)"><path d="${gearD(30,12,7)}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle r="9" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/></g><g transform="translate(172 214)"><path d="${gearD(20,10,6)}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle r="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/></g>`+
    `<path d="M70 150L40 104L170 104L220 150" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2.4" stroke-linejoin="round"/><circle cx="146" cy="202" r="8" fill="var(--stop)" opacity=".85"/>`+
    person(278,272,{helmet:1,hands:[[236,206],[246,214]]})+`<path d="M238 208L196 200" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/>`+
    SFA.ar(180,62,'الخطر أثناء الصيانة والإصلاح',{fs:16,w:700})+SFA.ar(76,96,'الغطاء مرفوع',{fs:13.5})+
    SFA.hot(84,166,124,84,'الأجزاء الدوارة مكشوفة بعد رفع الغطاء. النقطة الحمراء: موضع يلتقي فيه الترسان، وهو من مصادر الخطر في البند التالي.')+
    SFA.hot(36,96,186,52,'غطاء الحماية مرفوع للصيانة؛ لذلك يركز الكتاب على «ضرورة توفير وسائل الحماية اللازمة لوقاية العاملين».')+
    SFA.hot(236,170,80,110,'عامل صيانة: يقترب من الأجزاء الخطرة أكثر من المشغّل العادي.')),
   cap:'المخاطر أثناء أعمال الصيانة والإصلاح.<br><b>مرّر المؤشر على الترسين والغطاء والعامل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'على أي أعمال يركز هذا الجزء من الوحدة عند الحديث عن مخاطر الآلات؟',opts:[
     ['أعمال الصيانة والإصلاح بالمعدات والآلات',true,'«نوضح في هذا الجزء المخاطر المحتمل حدوثها أثناء أعمال الصيانة والإصلاح» (ص 63).'],
     ['نقل الآلات من مصنع إلى آخر',false,'لا يتناول الكتاب النقل هنا.'],
     ['شراء الآلات واختيارها',false,'الكتاب يتحدث عن المخاطر ووسائل الحماية، لا عن الشراء.']]}}
   ],
   body:[
    {book:`<p>نوضح في هذا الجزء المخاطر المحتمل حدوثها أثناء أعمال الصيانة والإصلاح بالمعدات والآلات المختلفة. وتركز على ضرورة توفير وسائل الحماية اللازمة لوقاية العاملين من مخاطر الآلات المختلفة.</p>`,ref:'ص 63'},
    {tip:`<p>الجزء القادم كله يسير بترتيب واحد: أولاً <b>أنواع</b> المخاطر، ثم <b>مصادرها</b> في الآلة، ثم <b>الإصابات</b> التي تسببها، وفي الدرس التالي <b>وسائل الحماية</b> منها.</p>`,title:'خريطة هذا الجزء'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['يتناول هذا الجزء المخاطر أثناء أعمال الصيانة والإصلاح.',true,'(ص 63).'],
 ['يكتفي الكتاب بوصف المخاطر دون الحديث عن الحماية منها.',false,'«وتركز على ضرورة توفير وسائل الحماية اللازمة لوقاية العاملين» (ص 63).']]})}
   ]},

  {st:2,short:'أنواع المخاطر',title:'4-5-1 أنواع المخاطر المحتملة بالآلات والمعدات',ref:'ص 63',
   q:'الآلة نفسها، ومكانها، وطريقة العمل حولها… أيها مصدر الخطر؟',
   art:SFA.art('ثلاثة أنواع من مخاطر الآلات: المعدة نفسها، وموقعها، ونظام العمل المصاحب',
    `<g transform="translate(270 150)"><circle r="40" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="${gearD(40,20,7)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle r="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g>`+arcArrow(270,150,52,-150,-60,RED,2.4)+
    `<rect x="140" y="128" width="40" height="56" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2" transform="rotate(-8 160 184)"/><rect x="184" y="128" width="40" height="56" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2" transform="rotate(6 204 184)"/><path d="M134 186H232" stroke="var(--fg)" stroke-width="3"/>`+
    person(72,214,{hands:[[52,152],[92,152]]})+`<rect x="48" y="128" width="48" height="26" rx="3" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="1.8"/>`+arrow(100,140,130,140,'var(--blue)',2.2)+
    SFA.ar(270,232,'المعدة نفسها',{fs:14})+SFA.ar(183,232,'موقع المعدة',{fs:14})+SFA.ar(80,246,'نظام العمل',{fs:14})+SFA.ar(80,264,'المصاحب',{fs:14})+
    SFA.hot(220,98,104,108,'مخاطر تتعلق بالمعدة نفسها: مثل القص والتسلخات وانبعاث مواد خطرة. السهم الأحمر: دوران القرص المسنن.')+
    SFA.hot(132,118,104,74,'مخاطر تتعلق بموقع المعدة: آلتان متقاربتان جداً وغير ثابتتين («مدى ثبات المعدة أو قربها من المعدات الأخرى»).')+
    SFA.hot(36,118,80,104,'مخاطر تتعلق بنظام العمل المصاحب: عامل يحمل المادة الخام بيديه ليزوّد بها المعدة (التحميل اليدوي).')),
   cap:'ثلاثة أنواع للمخاطر في الكتاب.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف النوع.</b>',
   side:[
    {predict:{q:'آلتان ثقيلتان وُضعتا متلاصقتين على أرضية غير مستوية. من أي أنواع المخاطر هذا؟',opts:[
     ['مخاطر تتعلق بالمعدة نفسها',false,'الآلتان قد تكونان سليمتين؛ المشكلة في مكانهما.'],
     ['مخاطر تتعلق بنظام العمل المصاحب',false,'نظام العمل مثل التحميل اليدوي، لا مكان الآلة.'],
     ['مخاطر تتعلق بموقع المعدة',true,'«مدى ثبات المعدة أو قربها من المعدات الأخرى» (ص 63).']]}}
   ],
   body:[
    {book:`<ul><li>مخاطر تتعلق بالمعدة نفسها مثل مخاطر القص والتسلخات وانبعاث مواد خطرة.</li><li>مخاطر تتعلق بموقع المعدة، على سبيل المثال مدى ثبات المعدة أو قربها من المعدات الأخرى.</li><li>مخاطر تتعلق بنظام العمل المصاحب للمعدة مثل أعمال التحميل اليدوي لتزويد المعدة بالمواد الخام.</li></ul>`,ref:'ص 63'},
    {title:'مختبر مصغّر: صنّف الخطر',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل موقف اضغط نوع الخطر.',cats:['المعدة نفسها','موقع المعدة','نظام العمل المصاحب'],items:[
 ['آلة يخرج منها غبار أو أبخرة ضارة أثناء التشغيل.',0,'«انبعاث مواد خطرة» من مخاطر المعدة نفسها (ص 63).'],
 ['عامل يرفع لفائف المادة الخام بيديه ليغذي بها الآلة طوال اليوم.',2,'«أعمال التحميل اليدوي لتزويد المعدة بالمواد الخام» (ص 63).'],
 ['مخرطة مثبتة تثبيتاً ضعيفاً فتهتز وتتحرك أثناء العمل.',1,'«مدى ثبات المعدة» من مخاطر الموقع (ص 63).'],
 ['سلاح آلة القص مكشوف.',0,'«مخاطر القص» من مخاطر المعدة نفسها (ص 63).'],
 ['آلتان متقاربتان لا يمر بينهما العامل إلا بصعوبة.',1,'«قربها من المعدات الأخرى» (ص 63).']]})}
   ]},

  {st:3,short:'مصادر الخطر',title:'4-5-2 مصادر الخطر بالمعدات والآلات',ref:'ص 63',
   q:'السير يدور على البكرة… أين بالضبط يمكن أن يُسحب إصبعك؟',
   art:SFA.art('سير يلف بكرتين، ونقطتا الالتقاء حيث يدخل السير على البكرة',
    SFA.emb(fig44(),[100,8,380,182],[10,76,340,163])+
    SFA.ar(180,60,'نقطة الالتقاء: حيث يدخل السير على البكرة',{fs:14.5,w:700})+SFA.ar(180,268,'السهم: اتجاه الدوران',{fs:13})+
    SFA.hot(258,74,84,46,'نقطة الالتقاء ⟦NIP POINT⟧ الأولى: السير يدخل على البكرة الكبيرة من أعلاها. الجزءان يتحركان نحو بعضهما فيسحبان ما يقترب إلى الداخل.')+
    SFA.hot(170,200,100,46,'نقطة الالتقاء الثانية: السير يدخل على البكرة الصغيرة من أسفلها.')+
    SFA.hot(300,110,48,90,'سهم الدوران: البكرة الكبيرة تدور مع عقارب الساعة. لو انعكس الدوران انتقلت نقاط الالتقاء إلى الجهة الأخرى.')),
   cap:'الجزء العلوي من الشكل <span class="ltr">(4-4)</span>.<br><b>مرّر المؤشر على العلامتين والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'سير يلف بكرتين. أين تقع نقطة الالتقاء؟',opts:[
     ['في منتصف السير بين البكرتين',false,'هناك يتحرك السير وحده في خط مستقيم، ولا يلتقي بجزء آخر.'],
     ['حيث يخرج السير من البكرة',false,'عند الخروج يبتعد الجزءان عن بعضهما فيدفعان ما بينهما إلى الخارج.'],
     ['حيث يدخل السير على البكرة',true,'هناك يتجه السير والبكرة نحو بعضهما فيسحبان أي شيء إلى الداخل — الشكل (4-4).']]}}
   ],
   body:[
    {book:`<ol><li>نقاط التشغيل <span class="ltr">Point of Operation</span></li><li>نقاط الالتقاء بين الأجزاء الدوارة بالمعدات والآلات (الشكل 4-4) <span class="ltr">In-Running Nip Points</span></li></ol>`,ref:'ص 63'},
    {html:SFA.fig(fig44(),'الشكل <span class="ltr">(4-4)</span> ص 63 — رسم مبسّط: نقاط الالتقاء <span class="ltr">(NIP POINT)</span>: سير وبكرتان، وجنزير وترس، وترس وجريدة مسننة.',600)},
    {tip:`<p><b>نقطة التشغيل</b> هي المكان الذي تعمل فيه الآلة على الشغلة (حيث تقطع أو تثقب أو تكبس). <b>نقطة الالتقاء الداخلة</b> هي المكان الذي يتجه فيه جزءان متحركان أحدهما نحو الآخر، مثل السير وهو يدخل على البكرة، أو أسنان الترس وهي تدخل في أسنان الجريدة. أي شيء يقترب منها (إصبع، قفاز، كم، شعر) يُسحب إلى الداخل.</p>`,title:'نقطة التشغيل ونقطة الالتقاء'},
    {title:'مختبر مصغّر: اعكس الدوران وتابع نقطة الالتقاء',widget:(el,B)=>{const g=MECH.belt.build();DCML.lab(el,B,{
     predict:{q:'لو انعكس اتجاه دوران البكرتين، ماذا يحدث لنقاط الالتقاء؟',opts:[
      ['تختفي، لأن السير يتحرك إلى الخلف',false,'الحركة لا تتوقف، فالخطر لا يختفي.'],
      ['تنتقل إلى الجهة الأخرى من كل بكرة',true,'صار السير يدخل على البكرة من الجهة الأخرى، فنقطة الالتقاء تتبع جهة الدخول.'],
      ['تبقى في مكانها نفسه',false,'نقطة الالتقاء حيث «يدخل» السير؛ وعكس الدوران يغير مكان الدخول.']]},
     ins:[{k:'d',l:'اتجاه الدوران',seg:[[1,'مع عقارب الساعة (كما في الشكل)'],[-1,'عكس عقارب الساعة']],v:1}],
     calc:(s)=>{let v=`<svg viewBox="90 60 460 230" role="img" aria-label="سير وبكرتان ونقاط الالتقاء" style="font-family:var(--font)">`+MECH.belt.moving(g,0)+MECH.belt.arrow(g,s.d);
      g.nips.forEach(n=>{const on=n.inRun(s.d);v+=`<polygon points="${n.poly.map(p=>p.map(f1).join(',')).join(' ')}" style="fill:${on?'var(--stop)':'var(--on)'};fill-opacity:${on?0.55:0.18};stroke:${on?'var(--stop)':'var(--on)'};stroke-width:1.5"/>`});
      return {pic:v+'</svg>',msg:`المناطق <b style="color:var(--stop)">الحمراء</b> نقاط التقاء داخلة (السير يدخل على البكرة)، و<b style="color:var(--on)">الخضراء</b> حيث يخرج السير. ${s.d>0?'هذا وضع الشكل <span class="ltr">(4-4)</span>: أعلى البكرة الكبيرة وأسفل الصغيرة.':'بعد عكس الدوران انتقلت المناطق الحمراء إلى أسفل البكرة الكبيرة وأعلى الصغيرة.'}`}}})}}
   ]},

  {st:4,short:'أنواع الإصابات',title:'4-6 أنواع الإصابات الشائعة عند التعامل مع المعدات',ref:'ص 64–67',
   q:'ثماني إصابات مختلفة… هل تعرف الفرق بين القطع والقص، وبين الانحشار والسحق؟',
   art:SFA.art('ثمانية أنواع من الإصابات الشائعة عند التعامل مع المعدات',
    `<g transform="translate(180 164)"><path d="${gearD(44,14,9)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><circle r="14" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g>`+
    [['أ','القطع',272,74],['ب','القص',300,128],['ج','الاختراق',300,190],['د','الصدمات',268,246],['هـ','الانحشار',92,246],['و','الاحتكاك',60,190],['ز','السحق',60,128],['ح','المقذوفات',88,74]].map(([h,t,x,y])=>`<rect x="${x-46}" y="${y-17}" width="92" height="30" rx="15" fill="var(--surface)" stroke="var(--stop)" stroke-width="1.8"/>`+SFA.ar(x,y+4,h+'- '+t,{fs:13.5})).join('')+
    SFA.hot(226,57,92,30,'أ- القطع: بالمناشير والفريزة والصاروخ.')+SFA.hot(254,111,92,30,'ب- القص: جزء من الجسم بين طاولة المعدة وسلاحها، أو في المكابس.')+SFA.hot(254,173,92,30,'ج- الاختراق والثقب: بالمواد المتطايرة أو بالمثقاب.')+SFA.hot(222,229,92,30,'د- الصدمات: معدات متحركة تصطدم بالعاملين، مثل ذراع الروبوت.')+
    SFA.hot(46,229,92,30,'هـ- الانحشار: ملابس فضفاضة أو شعر طويل في الأجزاء الدوارة.')+SFA.hot(14,173,92,30,'و- الاحتكاك والتسلخ: ملامسة جزء دوار خشن مثل عجلة الجلخ.')+SFA.hot(14,111,92,30,'ز- السحق: جزء من الجسم بين جزء ثابت ومتحرك، أو جزأين متحركين، أو جزء متحرك وجدار أو أرضية.')+SFA.hot(42,57,92,30,'ح- المقذوفات وتطاير الشرر: أجزاء تنطلق من المعدة عند انفجار داخلها، أو طاقة كامنة في السست واليايات.')),
   cap:'الأنواع الثمانية بترتيب الكتاب.<br><b>مرّر المؤشر على كل نوع (أو المسه في الجوال) لتقرأ تعريفه المختصر.</b>',
   side:[
    {predict:{q:'كم نوعاً من الإصابات الشائعة عند التعامل مع المعدات يذكر الكتاب؟',opts:[
     ['أربعة',false,'الأربعة هي أنواع الأخطاء في استعمال العدد اليدوية (4-3)، لا الإصابات.'],
     ['ثمانية',true,'من «أ- القطع» إلى «ح- المقذوفات وتطاير الشرر» (ص 64–67).'],
     ['ثلاثة',false,'الثلاثة هي أنواع المخاطر المحتملة (4-5-1).']]}}
   ],
   body:[
    {book:`<p><b>4-6 أنواع الإصابات الشائعة عند التعامل مع المعدات:</b></p><p>أ- القطع <span class="ltr">Cutting</span> · ب- القص <span class="ltr">Shearing</span> · ج- الاختراق والثقب <span class="ltr">Stabbing and Puncturing</span> · د- الصدمات <span class="ltr">Impact</span> · هـ- الانحشار <span class="ltr">Entanglement</span> · و- الاحتكاك والتسلخ <span class="ltr">Friction and Abrasion</span> · ز- السحق <span class="ltr">Crushing</span> · ح- المقذوفات وتطاير الشرر <span class="ltr">Projectiles and Energy Release</span></p>`,ref:'ص 64–67'},
    {tip:`<p>العنوان في الكتاب تتبعه ثمانية عناوين فرعية، ولكل منها محطة بعد هذه. انتبه لأزواج متشابهة: <b>القطع</b> بحافة حادة تتحرك (منشار) و<b>القص</b> بين سلاح وطاولة؛ و<b>الانحشار</b> التفاف شيء حول جزء دوار و<b>السحق</b> انضغاط الجسم بين جزأين.</p>`,title:'كيف تفرّق بينها؟'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الانحشار والسحق اسمان لإصابة واحدة.',false,'الانحشار التفاف الملابس أو الشعر على جزء دوار (ص 65)، والسحق انضغاط جزء من الجسم بين جزأين (ص 66).'],
 ['المثقاب يمكن أن يسبب ثقباً في اليد.',true,'«يمكن للمثقاب أن يتسبب في حدوث ثقب للأيدي» (ص 64).'],
 ['عجلة الجلخ تظهر في أكثر من نوع من الإصابات.',true,'في الاختراق (شظاياها)، والاحتكاك والتسلخ، والمقذوفات (انفجارها) — ص 64–67.']]})}
   ]},

  {st:5,short:'أ- القطع',title:'أ- القطع <span class="ltr">(Cutting)</span>',ref:'ص 64',
   q:'نصل المنشار يدور بسرعة… أين تكون يدك أقرب إلى الخطر؟',
   art:SFA.art('منشار دائري يخرج نصله من الطاولة، ويد تدفع قطعة خشب نحوه',
    `<g transform="translate(180 196)"><path d="${gearD(62,28,7)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle r="14" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g>`+arcArrow(180,196,80,-160,-100,'var(--fg)',2.4)+
    `<rect x="40" y="196" width="280" height="70" fill="var(--surface)" stroke="var(--fg)" stroke-width="2.4"/><path d="M118 196A62 62 0 0 1 242 196" fill="var(--stop)" opacity=".18"/>`+
    `<rect x="240" y="170" width="70" height="26" rx="2" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="2"/><ellipse cx="296" cy="160" rx="18" ry="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M310 156H344" stroke="var(--fg)" stroke-width="14" stroke-linecap="round"/><path d="M310 156H344" stroke="var(--surface)" stroke-width="10" stroke-linecap="round"/>`+arrow(268,212,236,212,'var(--blue)',2.4)+
    SFA.ar(180,70,'المنشار الدائري',{fs:16,w:700})+SFA.ar(110,240,'الطاولة',{fs:14})+SFA.ar(180,120,'النصل',{fs:14})+
    SFA.hot(120,130,122,66,'النصل المسنن ⟦Blade⟧ يدور بسرعة؛ أي جزء من الجسم يلمس أسنانه يُجرح أو يُقطع.')+
    SFA.hot(118,170,124,30,'منطقة الخطر (الأحمر الخفيف): حول الجزء البارز من النصل فوق الطاولة.')+
    SFA.hot(240,144,104,54,'يد تدفع قطعة الخشب نحو النصل (السهم). كلما اقتربت القطعة من نهايتها اقتربت اليد من النصل.')),
   cap:'من آلات القطع في الشكل <span class="ltr">(4-5)</span>.<br><b>مرّر المؤشر على النصل ومنطقة الخطر واليد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي من هذه الآلات يذكرها الكتاب مثالاً على حوادث القطع؟',opts:[
     ['المكابس',false,'المكابس ذُكرت في «القص» و«السحق».'],
     ['الرافعة المقصية',false,'ذُكرت في «السحق».'],
     ['الفريزة والصاروخ',true,'«المناشير بأنواعها وماكينات تشكيل المعادن، الفريزة والصاروخ» (ص 64).']]}}
   ],
   body:[
    {book:`<p>مثال على المعدات التي من الممكن أن تسبب حوادث القطع هي المناشير بأنواعها وماكينات تشكيل المعادن، الفريزة والصاروخ (الشكل 4-5).</p>`,ref:'ص 64'},
    {html:SFA.fig(fig45(),'الشكل <span class="ltr">(4-5)</span> ص 64 — رسم مبسّط: «TYPICAL CUTTING HAZARDS»: الصاروخ <span class="ltr">(Angle Grinder)</span>، والفريزة <span class="ltr">(Milling Machine)</span>، والمنشار الشريطي <span class="ltr">(Band saw)</span>، والمنشار الدائري <span class="ltr">(Circular Saw)</span>.',560)},
    {add:`<p><b>الصاروخ</b> اسم شائع في ورشنا لآلة الجلخ اليدوية ذات القرص <span class="ltr">(Angle Grinder)</span>، و<b>الفريزة</b> آلة تفريز فيها سكين أسطوانية دوارة متعددة الأسنان <span class="ltr">(Milling Machine)</span>.</p>`,title:'أسماء الآلات'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['المنشار الشريطي من أمثلة الشكل (4-5) على مخاطر القطع.',true,'«Band saw» في الشكل (4-5) ص 64.'],
 ['خطر القطع لا يكون إلا في المناشير.',false,'يذكر الكتاب أيضاً ماكينات تشكيل المعادن والفريزة والصاروخ (ص 64).']]})}
   ]},

  {st:6,short:'ب- القص',title:'ب- القص <span class="ltr">(Shearing)</span>',ref:'ص 64',
   q:'السلاح ينزل على الطاولة… وأصابعك تثبت اللوح تحته؟',
   art:SFA.art('سلاح ينزل على لوح فوق طاولة، وأصابع قريبة من خط القص',
    `<rect x="96" y="62" width="168" height="62" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><path d="M150 124H230V150L150 166Z" fill="var(--fg)"/>`+arrow(270,100,270,150,RED,3)+
    `<rect x="60" y="206" width="240" height="34" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><rect x="80" y="196" width="230" height="10" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="1.6"/>`+
    `<path d="M150 176V206" stroke="var(--stop)" stroke-width="2" stroke-dasharray="5 4"/><ellipse cx="164" cy="192" rx="22" ry="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M186 190H240" stroke="var(--fg)" stroke-width="12" stroke-linecap="round"/><path d="M186 190H240" stroke="var(--surface)" stroke-width="8" stroke-linecap="round"/>`+
    SFA.ar(180,282,'خط القص بين السلاح والطاولة',{fs:14,c:'var(--stop)'})+SFA.ar(180,98,'جسم الآلة',{fs:14})+
    SFA.hot(146,120,90,50,'السلاح: حافة حادة تنزل على حافة الطاولة فتقص ما بينهما.')+SFA.hot(60,198,250,44,'الطاولة واللوح (الشغلة) عليها.')+SFA.hot(138,176,104,26,'أصابع تمسك اللوح قرب خط القص: «في حالة وقوعه بين طاولة المعدة والسلاح».')),
   cap:'فكرة الشكل <span class="ltr">(4-6)</span>.<br><b>مرّر المؤشر على السلاح والطاولة والأصابع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى تسبب ماكينة تشكيل المعادن قص جزء من الجسم؟',opts:[
     ['إذا وقع الجزء بين طاولة المعدة والسلاح الخاص بها',true,'هذا نص الكتاب (ص 64).'],
     ['إذا لمس الجزء جسم الآلة من الخارج',false,'القص يحتاج حافتين تلتقيان: السلاح والطاولة.'],
     ['إذا اقترب الشعر من الآلة',false,'الشعر الطويل خطره الانحشار في الأجزاء الدوارة.']]}}
   ],
   body:[
    {book:`<p>من الممكن أن تسبب ماكينة تشكيل المعادن قص أي جزء من أجزاء جسم الإنسان في حالة وقوعه بين طاولة المعدة والسلاح الخاص بها، كذلك المكابس (الشكل 4-6).</p>`,ref:'ص 64'},
    {html:SFA.fig(fig46(),'الشكل <span class="ltr">(4-6)</span> ص 64 — رسم مبسّط: سلاح ينزل على لوح فوق طاولة <span class="ltr">(SHEARING)</span>.',260)},
    {tip:`<p>القص يشبه المقص: حافتان تمر إحداهما بجانب الأخرى. لذلك لا تكفي الحذر بالنظر؛ المطلوب أن لا تصل اليد أصلاً إلى ما بين السلاح والطاولة، وهذا ما تفعله الحواجز والأجهزة في الدرس التالي.</p>`,title:'فكرة القص'},
    {title:'مختبر مصغّر: أين القص؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'عامل يقص لوحاً معدنياً بآلة قص، وأصابعه تثبت اللوح. أين الخطر؟',opts:[['بين السلاح والطاولة',true,'«بين طاولة المعدة والسلاح الخاص بها» (ص 64).'],['عند مفتاح التشغيل',false,'المفتاح ليس منطقة قص.'],['في أرجل الآلة',false,'لا حافة قاطعة هناك.']]}]})}
   ]},

  {st:7,short:'ج- الاختراق والثقب',title:'ج- الاختراق والثقب <span class="ltr">(Stabbing and Puncturing)</span>',ref:'ص 64–65',
   q:'شظية صغيرة من حجر الجلخ… كيف تصبح مثل الرصاصة؟',
   art:SFA.art('اختراق بجسم متطاير من حجر جلخ، وثقب ببنطة مثقاب',
    `<circle cx="104" cy="168" r="46" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><path d="M58 168A46 46 0 0 1 150 168" fill="none" stroke="var(--fg)" stroke-width="8" opacity=".55"/><path d="M104 168L136 140L128 128" fill="none" stroke="var(--stop)" stroke-width="2.4"/>`+
    [[160,124],[176,140],[168,108],[188,120]].map(([x,y])=>`<polygon points="${x},${y} ${x+8},${y-3} ${x+5},${y+5}" fill="var(--fg)"/>`).join('')+arrow(152,132,206,104,RED,2.4)+
    `<rect x="236" y="70" width="64" height="40" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><rect x="258" y="110" width="20" height="22" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M268 132V196" stroke="var(--fg)" stroke-width="5"/><path d="M262 140L274 148M262 156L274 164M262 172L274 180" stroke="var(--surface)" stroke-width="2"/><polygon points="263,196 273,196 268,206" fill="var(--fg)"/>`+arrow(300,150,300,190,RED,2.4)+
    `<ellipse cx="268" cy="222" rx="30" ry="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+
    SFA.ar(104,246,'جسم متطاير',{fs:14})+SFA.ar(268,262,'جزء متحرك',{fs:14})+
    SFA.hot(56,120,96,96,'حجر الجلخ: إذا انكسر وهو يدور تطايرت شظاياه بسرعة كبيرة (الخط الأحمر: شرخ).')+SFA.hot(150,96,62,52,'الشظايا المتطايرة تخترق الجسم — «بواسطة المواد المتطايرة».')+SFA.hot(232,66,74,146,'المثقاب: البنطة الدوارة تنزل (السهم) ويمكنها «أن تتسبب في حدوث ثقب للأيدي».')),
   cap:'خانتا الشكل <span class="ltr">(4-7)</span>: بالأجسام المتطايرة، وبالأجزاء المتحركة.<br><b>مرّر المؤشر على الحجر والشظايا والمثقاب (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي مما يلي من «المواد المتطايرة» التي يذكرها الكتاب؟',opts:[
     ['بنطة المثقاب',false,'البنطة جزء متحرك من الآلة، لا تتطاير.'],
     ['الدبابيس المتطايرة من الدباسات الكبيرة',true,'«أو الدبابيس المتطايرة من الدباسات الكبيرة المستخدمة بالمصانع» (ص 64).'],
     ['إبرة ماكينة الخياطة',false,'الإبرة في خانة «الأجزاء المتحركة» في الشكل (4-7).']]}}
   ],
   body:[
    {book:`<p>من الممكن حدوث اختراق لأي مكان بجسم الشخص بواسطة المواد المتطايرة مثل الشظايا المتطايرة من عجلة الجلخ في حالة انكسارها أو الدبابيس المتطايرة من الدباسات الكبيرة المستخدمة بالمصانع، كذلك يمكن للمثقاب أن يتسبب في حدوث ثقب للأيدي (الشكل 4-7).</p>`,ref:'ص 64–65'},
    {html:SFA.fig(fig47(),'الشكل <span class="ltr">(4-7)</span> ص 65 — رسم مبسّط: يمين: بالأجسام المتطايرة <span class="ltr">(Grinding wheel, Staple gun)</span>. يسار: بالأجزاء المتحركة (إبرة ماكينة الخياطة، وبنطة المثقاب).',600)},
    {title:'مختبر مصغّر: متطاير أم متحرك؟',widget:(el,B)=>DCML.sort(el,B,{intro:'الشكل (4-7) خانتان. ضع كل مصدر في خانته.',cats:['جسم متطاير','جزء متحرك من الآلة'],items:[
 ['شظايا عجلة جلخ انكسرت.',0,'الخانة اليمنى في الشكل: «BY FLYING OBJECTS».'],
 ['بنطة المثقاب.',1,'الخانة اليسرى: «BY MOVING PARTS OF MACHINERY».'],
 ['دبوس خرج من دباسة كبيرة.',0,'«الدبابيس المتطايرة من الدباسات الكبيرة» (ص 64).'],
 ['إبرة ماكينة الخياطة.',1,'تتحرك صعوداً وهبوطاً — الخانة اليسرى في الشكل (4-7).']]})}
   ]},

  {st:8,short:'د- الصدمات',title:'د- الصدمات <span class="ltr">(Impact)</span>',ref:'ص 65',
   q:'ذراع الروبوت يتحرك وحده… هل يراك وأنت تقف في طريقه؟',
   art:SFA.art('ذراع روبوت يدور فيصطدم بعامل يقف في مداه',
    `<ellipse cx="110" cy="250" rx="46" ry="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><rect x="86" y="190" width="48" height="60" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M110 190L150 110L232 124" fill="none" stroke="var(--fg)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 190L150 110L232 124" fill="none" stroke="var(--surface-2)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="110" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M232 116L246 112M232 132L246 136" stroke="var(--fg)" stroke-width="4"/>`+
    arcArrow(110,190,128,-62,-10,RED,2.6)+`<path d="M110 190L236 190A126 126 0 0 0 166 76Z" fill="var(--stop)" opacity=".1"/>`+person(268,262,{hands:[[244,196],[292,196]]})+
    SFA.ar(110,288,'الروبوت',{fs:14})+SFA.ar(270,288,'العامل',{fs:14})+SFA.ar(180,62,'مدى حركة الذراع',{fs:14.5,c:'var(--stop)'})+
    SFA.hot(80,96,170,160,'ذراع الروبوت ⟦Robot⟧: يتحرك بسرعة وقوة حسب برنامجه، ولا يتوقف لأن أحداً في طريقه.')+SFA.hot(236,170,66,110,'عامل يقف داخل مدى حركة الذراع (المنطقة الحمراء الخفيفة) فيُصدم.')),
   cap:'المشهد الأيسر من الشكل <span class="ltr">(4-8)</span>.<br><b>مرّر المؤشر على الذراع والعامل (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما المثال الذي يذكره الكتاب للصدمات؟',opts:[
     ['الشعر الطويل في الأجزاء الدوارة',false,'هذا الانحشار.'],
     ['الأيدي المتحركة لأجهزة الروبوت',true,'«وعلى سبيل المثال الأيدي المتحركة لأجهزة الروبوت» (ص 65).'],
     ['عجلة الصنفرة',false,'هذه في الاحتكاك والتسلخ.']]}}
   ],
   body:[
    {book:`<p>تتسبب فيها المعدات المتحركة التي قد تصطدم بالعاملين وتسبب إصابات بليغة لهم (الشكل 4-8)، وعلى سبيل المثال الأيدي المتحركة لأجهزة الروبوت، أو انحشار جزء من جسم الإنسان بين أجزاء متحركة من المعدة وجزء ثابت.</p>`,ref:'ص 65'},
    {html:SFA.fig(fig48(),'الشكل <span class="ltr">(4-8)</span> ص 65 — رسم مبسّط: «IMPACT HAZARDS»: ذراع روبوت <span class="ltr">(Robot)</span> يدور فيصطدم بعامل، وطاولة آلة تسوية <span class="ltr">(Planing machine)</span> تتحرك أفقياً نحو عامل.',560)},
    {tip:`<p>لذلك تُحاط الروبوتات الصناعية بسياج يبعد العامل عن مدى حركتها، وتكون لوحة التشغيل خارجه — وهذه «الحماية بالموقع والمسافة» في الدرس التالي (الشكل <span class="ltr">4-21</span>).</p>`,title:'وكيف نحمي العامل؟'},
    {title:'مختبر مصغّر: أين تقف؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'تريد مراقبة روبوت يعمل في خلية إنتاج. أين تقف؟',opts:[['داخل مدى حركة ذراعه لترى أفضل',false,'المعدات المتحركة «قد تصطدم بالعاملين وتسبب إصابات بليغة» (ص 65).'],['خارج مدى حركة الذراع، خلف الحاجز',true,'خارج المدى لا يمكن أن تصل إليك الذراع.'],['بجانب قاعدته لأنها ثابتة',false,'القاعدة ثابتة لكن الذراع تدور حولها، فأنت داخل مداها.']]}]})}
   ]},

  {st:9,short:'هـ- الانحشار',title:'هـ- الانحشار <span class="ltr">(Entanglement)</span>',ref:'ص 65–66',
   q:'كمّ قميصك واسع قليلاً… فما المشكلة قرب عمود يدور؟',
   art:SFA.art('كم فضفاض يلتف حول عمود دوار',
    `<rect x="40" y="132" width="280" height="22" rx="11" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><path d="M60 132V154M300 132V154" stroke="var(--fg)" stroke-width="2"/>`+arcArrow(110,143,30,-160,-30,'var(--fg)',2.2)+
    `<path d="M206 126Q224 140 206 160Q190 172 214 176Q236 182 224 160" fill="none" stroke="var(--stop)" stroke-width="7" stroke-linecap="round"/><path d="M222 176L262 236" stroke="var(--fg)" stroke-width="22" stroke-linecap="round"/><path d="M222 176L262 236" stroke="var(--stop-soft)" stroke-width="18" stroke-linecap="round"/><path d="M262 236L292 282" stroke="var(--fg)" stroke-width="16" stroke-linecap="round"/><path d="M262 236L292 282" stroke="var(--surface)" stroke-width="12" stroke-linecap="round"/>`+arrow(290,230,242,176,RED,2.4)+
    SFA.ar(140,96,'عمود يدور',{fs:15})+SFA.ar(110,236,'الكم يُسحب',{fs:15,c:'var(--stop)'})+SFA.ar(110,256,'ويلتف حول العمود',{fs:15,c:'var(--stop)'})+
    SFA.hot(40,126,160,34,'عمود دوار مكشوف: حتى السطح الأملس يلف حوله القماش أو الشعر.')+SFA.hot(190,120,60,66,'الكم الفضفاض التف حول العمود (الأحمر)، فالعمود يسحب الذراع معه (السهم).')),
   cap:'فكرة الشكل <span class="ltr">(4-9)</span>.<br><b>مرّر المؤشر على العمود والكم (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما الذي يسبب الانحشار حسب الكتاب؟',opts:[
     ['الملابس الفضفاضة أو الشعر الطويل في الأجزاء الدوارة',true,'«عند انحشار جزء من الملابس الفضفاضة أو الشعر الطويل في أجزاء المعدة الدوارة» (ص 65).'],
     ['الشظايا المتطايرة',false,'هذه الاختراق والثقب.'],
     ['الجدار والأرضية',false,'هذه من حالات السحق.']]}}
   ],
   body:[
    {book:`<p>يحدث ذلك عند انحشار جزء من الملابس الفضفاضة أو الشعر الطويل في أجزاء المعدة الدوارة مما يسبب إصابات عديدة (الشكل 4-9 أ وب).</p>`,ref:'ص 65'},
    {html:SFA.fig(fig49(),'الشكل <span class="ltr">(4-9)</span> ص 66 — رسم مبسّط: (أ) «GLOVE ENTANGLEMENT»: قفاز يلتف حول عمود مثقاب دوار، وبجانبه جهاز إيقاف <span class="ltr">(Trip Device)</span>. (ب) عامل ينحني فوق آلة بكرات فتسحب البكرات كمّه ويده.',600)},
    {add:`<p>لذلك يُطلب في الورش عادة: كمّ مزرّر أو مشمّر، وشعر طويل مربوط ومغطى، ونزع الخواتم والساعات، وعدم لبس القفاز عند العمل قرب جزء دوار مثل بنطة المثقاب (كما في الشكل <span class="ltr">(4-9)</span>-أ).</p>`,title:'ماذا تلبس قرب الأجزاء الدوارة؟'},
    {title:'مختبر مصغّر: من المعرض للانحشار؟',widget:(el,B)=>DCML.tf(el,B,{intro:'هل الحالة معرّضة للانحشار؟ اضغط «صح» إن كانت معرّضة.',items:[
 ['عامل بقفاز قماشي يمسح الزيت عن بنطة مثقاب وهي تدور.',true,'هذا مشهد الشكل (4-9)-أ: القفاز يلتف حول العمود.'],
 ['عامل شعره طويل ومكشوف يميل فوق آلة بكرات دوارة.',true,'«الشعر الطويل في أجزاء المعدة الدوارة» (ص 65).'],
 ['عامل يلبس ثياب عمل ضيقة وكمّاه مزرّران، والآلة متوقفة ومفصولة.',false,'لا أجزاء دوارة تعمل، ولا ملابس فضفاضة.']]})}
   ]},

  {st:10,short:'و- الاحتكاك والتسلخ',title:'و- الاحتكاك والتسلخ <span class="ltr">(Friction and Abrasion)</span>',ref:'ص 66',
   q:'عجلة الجلخ لا تقطع مثل المنشار… فكيف تجرح الجلد؟',
   art:SFA.art('إصبع يلمس سطح عجلة جلخ خشنة تدور',
    `<path d="M76 176A88 88 0 0 1 252 176" fill="none" stroke="var(--fg)" stroke-width="12" opacity=".5"/><circle cx="164" cy="176" r="76" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/>`+
    Array.from({length:60},(_,i)=>{const a=i*2.4,r=20+(i*37%52);return `<circle cx="${(164+r*Math.cos(a)).toFixed(1)}" cy="${(176+r*Math.sin(a)).toFixed(1)}" r="1.6" fill="var(--muted)"/>`}).join('')+
    `<circle cx="164" cy="176" r="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+arcArrow(164,176,92,-20,40,'var(--fg)',2.4)+
    `<ellipse cx="252" cy="200" rx="18" ry="11" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2"/><path d="M268 202H330" stroke="var(--fg)" stroke-width="18" stroke-linecap="round"/><path d="M268 202H330" stroke="var(--surface)" stroke-width="14" stroke-linecap="round"/>`+
    SFA.ar(164,72,'سطح خشن يدور',{fs:15})+SFA.ar(290,248,'تسلخ الجلد',{fs:15,c:'var(--stop)'})+
    SFA.hot(88,100,152,152,'عجلة الجلخ ⟦Grinding Wheel⟧: سطحها خشن من حبيبات صلبة، وتدور بسرعة كبيرة.')+SFA.hot(232,186,100,32,'الإصبع لمس السطح الدوار: الاحتكاك يزيل طبقة الجلد (تسلخ).')),
   cap:'فكرة الشكل <span class="ltr">(4-10)</span>.<br><b>مرّر المؤشر على العجلة والإصبع (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما الذي يسبب الاحتكاك والتسلخ؟',opts:[
     ['ملامسة جزء دوار خشن مثل عجلة الجلخ أو الصنفرة',true,'(ص 66).'],
     ['سلاح ينزل على طاولة',false,'هذا القص.'],
     ['انفجار داخل المعدة',false,'هذه المقذوفات.']]}}
   ],
   body:[
    {book:`<p>عند ملامسة أي جزء من أجزاء الجسم لأي جزء دوار خشن مثل عجلة الجلخ أو الصنفرة يحدث نتيجة لهذا الاحتكاك تسلخات بالجلد (الشكل 4-10).</p>`,ref:'ص 66'},
    {html:SFA.fig(fig410(),'الشكل <span class="ltr">(4-10)</span> ص 66 — رسم مبسّط: «FRICTION AND ABRASION HAZARDS»: حجر جلخ <span class="ltr">(Grinding Wheel)</span> وآلة صنفرة أسطوانية <span class="ltr">(Sanding Machine)</span>.',540)},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['آلة الصنفرة الأسطوانية يمكن أن تسبب تسلخ الجلد.',true,'«مثل عجلة الجلخ أو الصنفرة» (ص 66)، وهي في الشكل (4-10).'],
 ['التسلخ يحتاج سطحاً حاداً مثل نصل المنشار.',false,'يكفي «جزء دوار خشن»؛ الحافة الحادة خطرها القطع.']]})}
   ]},

  {st:11,short:'ز- السحق',title:'ز- السحق <span class="ltr">(Crushing)</span>',ref:'ص 66–67',
   q:'الرافعة المقصية تنزل ببطء… فلماذا هي خطيرة على يد بين ذراعيها؟',
   art:SFA.art('رافعة مقصية تنزل، ويد بين ذراعيها',
    `<rect x="80" y="96" width="200" height="16" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><rect x="80" y="250" width="200" height="16" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/>`+
    `<path d="M96 112L264 250M264 112L96 250" stroke="var(--fg)" stroke-width="7" stroke-linecap="round"/><circle cx="180" cy="181" r="7" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+arrow(300,80,300,130,'var(--fg)',2.6)+
    `<path d="M222 160H316" stroke="var(--fg)" stroke-width="16" stroke-linecap="round"/><path d="M222 160H316" stroke="var(--surface)" stroke-width="12" stroke-linecap="round"/><ellipse cx="214" cy="160" rx="13" ry="9" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2"/>`+arrow(196,132,206,150,RED,2.2)+arrow(196,190,206,172,RED,2.2)+
    SFA.ar(180,72,'جزآن متحركان',{fs:15})+SFA.ar(180,292,'الرافعة المقصية',{fs:15})+
    SFA.hot(80,92,200,22,'الطاولة العلوية تنزل (السهم الأسود).')+SFA.hot(100,116,160,130,'ذراعا الرافعة يتقاطعان مثل المقص؛ وعند النزول تضيق الزاوية بينهما.')+SFA.hot(198,146,40,30,'يد بين الذراعين: كلما نزلت الطاولة ضاقت المسافة فتُسحق (السهمان الأحمران).')),
   cap:'المشهد الرابع من الشكل <span class="ltr">(4-11)</span>: «بين جزأين متحركين».<br><b>مرّر المؤشر على الطاولة والذراعين واليد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ثقل موازنة ينزل نحو الأرضية وقدم عامل تحته. أي حالة سحق هذه؟',opts:[
     ['بين جزء ثابت وآخر متحرك بالمعدة',false,'الأرضية ليست جزءاً من المعدة.'],
     ['بين جزء متحرك بالمعدة وبين جدار أو الأرضية',true,'«مثل الثقل والأرضية» (ص 66–67).'],
     ['بين جزأين متحركين',false,'الأرضية لا تتحرك.']]}}
   ],
   body:[
    {book:`<p>يحدث ذلك عندما ينحشر جزء من أجزاء الجسم بين جزء ثابت وآخر متحرك بالمعدة مثل المكابس، أو بين جزأين متحركين للمعدة مثل الرافعة المقص، أو بين جزء متحرك بالمعدة وبين جدار أو الأرضية مثل الثقل والأرضية (الشكل 4-11).</p>`,ref:'ص 66–67'},
    {html:SFA.fig(fig411(),'الشكل <span class="ltr">(4-11)</span> ص 67 — رسم مبسّط: «CRUSHING HAZARDS»: بين جزء متحرك وجدار، وبين سنبك مكبس الثني وقالبه، وبين ثقل الموازنة <span class="ltr">(Counterweight)</span> والأرضية، وبين ذراعي الرافعة المقصية.',580)},
    {title:'مختبر مصغّر: صنّف حالة السحق',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مشهد من الشكل (4-11) اضغط الحالة.',cats:['ثابت ومتحرك بالمعدة','جزآن متحركان','متحرك وجدار أو أرضية'],items:[
 ['سنبك مكبس الثني ينزل على قالبه.',0,'«بين جزء ثابت وآخر متحرك بالمعدة مثل المكابس» (ص 66).'],
 ['طاولة آلة تسوية تتحرك نحو الجدار وعامل بينهما.',2,'«Between moving part of machine and fixed structure (wall)» في الشكل (4-11).'],
 ['ذراعا الرافعة المقصية.',1,'«بين جزأين متحركين للمعدة مثل الرافعة المقص» (ص 66).'],
 ['ثقل الموازنة ينزل نحو الأرضية.',2,'«مثل الثقل والأرضية» (ص 67).']]})}
   ]},

  {st:12,short:'ح- المقذوفات',title:'ح- المقذوفات وتطاير الشرر <span class="ltr">(Projectiles and Energy Release)</span>',ref:'ص 67',
   q:'الياي المضغوط ساكن في مكانه… فهل فيه خطر؟',
   art:SFA.art('عجلة جلخ تنفجر فتتطاير أجزاؤها، ويايّ مضغوط ينطلق',
    `<g transform="translate(118 168)">${[0,72,144,216,288].map((a,i)=>{const d=12+i%2*6,r=a*Math.PI/180;return `<path transform="translate(${(d*Math.cos(r+0.6)).toFixed(1)} ${(d*Math.sin(r+0.6)).toFixed(1)})" d="M0 0L${(54*Math.cos(r)).toFixed(1)} ${(54*Math.sin(r)).toFixed(1)}A54 54 0 0 1 ${(54*Math.cos(r+1.15)).toFixed(1)} ${(54*Math.sin(r+1.15)).toFixed(1)}Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`}).join('')}</g>`+
    [[-60,1],[10,1],[80,1],[150,1],[220,1]].map(([a])=>{const r=a*Math.PI/180;return arrow(118+70*Math.cos(r),168+70*Math.sin(r),118+100*Math.cos(r),168+100*Math.sin(r),RED,2.4)}).join('')+
    `<rect x="236" y="196" width="80" height="14" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M248 196${[...Array(8)].map((_,i)=>`L${i%2?240:296} ${190-i*10}`).join('')}" fill="none" stroke="var(--fg)" stroke-width="3"/>`+arrow(268,112,268,78,RED,2.6)+
    SFA.ar(118,288,'انفجار عجلة الجلخ',{fs:14.5})+SFA.ar(276,240,'طاقة كامنة',{fs:14.5})+SFA.ar(276,258,'في الياي',{fs:14.5})+
    SFA.hot(50,100,136,136,'عجلة الجلخ انفجرت: أجزاؤها تنطلق «على شكل مقذوفات» في كل اتجاه (الأسهم الحمراء).')+SFA.hot(232,104,90,110,'ياي (سستة) مضغوط: يخزن طاقة، فإذا انفلت انطلق هو أو ما يضغطه بقوة.')),
   cap:'مثالا الكتاب للمقذوفات.<br><b>مرّر المؤشر على العجلة والياي (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'أي مثالين يذكرهما الكتاب للمقذوفات وتطاير الشرر؟',opts:[
     ['المنشار الدائري والفريزة',false,'هذان من أمثلة القطع.'],
     ['الروبوت وآلة التسوية',false,'هذان من أمثلة الصدمات.'],
     ['انفجار عجلة الجلخ، والطاقة الكامنة في السست واليايات',true,'(ص 67).']]}}
   ],
   body:[
    {book:`<p>في حالة حدوث انفجار داخل المعدة يتسبب في انبعاث أجزاء من المعدة إلى الخارج على شكل مقذوفات مما قد يسبب مخاطر كبيرة، وعلى سبيل المثال في حالة انفجار عجلة الجلخ، كذلك يمكن أن تنبعث بعض الطاقة الكامنة في السست واليايات.</p>`,ref:'ص 67'},
    {tip:`<p>«الطاقة الكامنة» طاقة مخزنة لا تُرى: الياي المضغوط أو المشدود، أو جزء مرفوع قد يسقط. لذلك يجب تفريغها (فك الضغط أو تثبيت الجزء) قبل الصيانة، حتى لو كانت الآلة متوقفة.</p>`,title:'الخطر الذي لا يتحرك'},
    {title:'مختبر مصغّر: صنّف الإصابات الثماني',widget:(el,B)=>DCML.sort(el,B,{intro:'مراجعة للمحطات كلها: لكل مشهد اضغط نوع الإصابة.',cats:['القطع','القص','الاختراق','الصدمات','الانحشار','الاحتكاك','السحق','المقذوفات'],items:[
 ['يد تقترب من نصل منشار شريطي.',0,'المناشير بأنواعها: قطع (ص 64).'],
 ['أصابع بين سلاح ماكينة تشكيل المعادن وطاولتها.',1,'قص (ص 64).'],
 ['دبوس انطلق من دباسة كبيرة.',2,'اختراق بالمواد المتطايرة (ص 64).'],
 ['طاولة آلة التسوية تصدم عاملاً يقف بجانبها.',3,'الشكل (4-8): صدمات.'],
 ['قفاز يلتف حول عمود مثقاب.',4,'الشكل (4-9)-أ: انحشار.'],
 ['ساعد يلمس أسطوانة آلة صنفرة دوارة.',5,'احتكاك وتسلخ (ص 66).'],
 ['يد بين ذراعي رافعة مقصية تنزل.',6,'سحق بين جزأين متحركين (ص 66).'],
 ['ياي مضغوط انفلت أثناء فك غطاء.',7,'الطاقة الكامنة في السست واليايات (ص 67).']]})}
   ]},

  {recap:[
   'مخاطر الآلات ثلاثة أنواع: تتعلق بالمعدة نفسها، وبموقعها، وبنظام العمل المصاحب لها (ص 63).',
   'مصدرا الخطر: نقاط التشغيل، ونقاط الالتقاء بين الأجزاء الدوارة حيث يدخل جزء على آخر — الشكل (4-4).',
   'الإصابات ثمانية: القطع، والقص، والاختراق والثقب، والصدمات، والانحشار، والاحتكاك والتسلخ، والسحق، والمقذوفات (ص 64–67).',
   'السحق بين ثابت ومتحرك، أو بين متحركين، أو بين متحرك وجدار أو أرضية — الشكل (4-11).']}
],
 theory:[
  {h:'4-5 مخاطر المعدات والآلات (Machine Hazards)',ref:'ص 63',html:`<p>نوضح في هذا الجزء المخاطر المحتمل حدوثها أثناء أعمال الصيانة والإصلاح بالمعدات والآلات المختلفة. وتركز على ضرورة توفير وسائل الحماية اللازمة لوقاية العاملين من مخاطر الآلات المختلفة.</p>`},
  {h:'4-5-1 أنواع المخاطر المحتملة بالآلات والمعدات',ref:'ص 63',html:`<ul><li>مخاطر تتعلق <b>بالمعدة نفسها</b> مثل مخاطر القص والتسلخات وانبعاث مواد خطرة.</li><li>مخاطر تتعلق <b>بموقع المعدة</b>، على سبيل المثال مدى ثبات المعدة أو قربها من المعدات الأخرى.</li><li>مخاطر تتعلق <b>بنظام العمل المصاحب للمعدة</b> مثل أعمال التحميل اليدوي لتزويد المعدة بالمواد الخام.</li></ul>`},
  {h:'4-5-2 مصادر الخطر بالمعدات والآلات',ref:'ص 63',html:`<ol><li>نقاط التشغيل <span class="ltr">Point of Operation</span></li><li>نقاط الالتقاء بين الأجزاء الدوارة بالمعدات والآلات <span class="ltr">In-Running Nip Points</span> (الشكل 4-4)</li></ol>`},
  fig('4-4','ص 63',SIMPLE+' — نقاط الالتقاء (NIP POINT): أعلى: سير يلف بكرتين، وسهم الدوران مع عقارب الساعة. أسفل اليسار: جنزير على ترس. أسفل اليمين: ترس وجريدة مسننة تتحرك ذهاباً وإياباً.',fig44,600),
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «نقطة الالتقاء الداخلة» هي المكان الذي يتجه فيه جزءان متحركان أحدهما نحو الآخر، مثل السير وهو يدخل على البكرة. أي شيء يقترب منها (إصبع، قفاز، كم، شعر) يُسحب إلى الداخل. لذلك وضع الكتاب العلامة في الشكل (4-4) حيث يدخل السير على كل بكرة، لا حيث يخرج منها. في «المختبر» شغّل الآلة واعكس اتجاهها لترى أين تنتقل.'},
  {h:'4-6 أنواع الإصابات الشائعة عند التعامل مع المعدات',ref:'ص 64–67'},
  {h:'أ- القطع (Cutting)',ref:'ص 64',html:'<p>مثال على المعدات التي من الممكن أن تسبب حوادث القطع هي <b>المناشير بأنواعها</b> وماكينات تشكيل المعادن، <b>الفريزة والصاروخ</b> (الشكل 4-5).</p>'},
  fig('4-5','ص 64',SIMPLE+' — «TYPICAL CUTTING HAZARDS»: الصاروخ (Angle Grinder)، والفريزة (Milling Machine)، والمنشار الشريطي (Band saw)، والمنشار الدائري (Circular Saw)، والأسهم تدل على الحركة ومنطقة الخطر.',fig45,560),
  {h:'ب- القص (Shearing)',ref:'ص 64',html:'<p>من الممكن أن تسبب ماكينة تشكيل المعادن قص أي جزء من أجزاء جسم الإنسان في حالة وقوعه <b>بين طاولة المعدة والسلاح الخاص بها</b>، كذلك المكابس (الشكل 4-6).</p>'},
  fig('4-6','ص 64',SIMPLE+' — سلاح ينزل على لوح فوق طاولة (SHEARING).',fig46,260),
  {h:'ج- الاختراق والثقب (Stabbing and Puncturing)',ref:'ص 64–65',html:'<p>من الممكن حدوث اختراق لأي مكان بجسم الشخص بواسطة <b>المواد المتطايرة</b> مثل الشظايا المتطايرة من عجلة الجلخ في حالة انكسارها أو الدبابيس المتطايرة من الدباسات الكبيرة المستخدمة بالمصانع، كذلك يمكن <b>للمثقاب</b> أن يتسبب في حدوث ثقب للأيدي (الشكل 4-7).</p>'},
  fig('4-7','ص 65',SIMPLE+' — يمين: بالأجسام المتطايرة (حجر الجلخ Grinding wheel، والدباسة Staple gun). يسار: بالأجزاء المتحركة (إبرة ماكينة الخياطة، وبنطة المثقاب).',fig47,600),
  {h:'د- الصدمات (Impact)',ref:'ص 65',html:'<p>تتسبب فيها <b>المعدات المتحركة</b> التي قد تصطدم بالعاملين وتسبب إصابات بليغة لهم (الشكل 4-8)، وعلى سبيل المثال <b>الأيدي المتحركة لأجهزة الروبوت</b>، أو انحشار جزء من جسم الإنسان بين أجزاء متحركة من المعدة وجزء ثابت.</p>'},
  fig('4-8','ص 65',SIMPLE+' — «IMPACT HAZARDS»: ذراع روبوت (Robot) يدور فيصطدم بعامل، وطاولة آلة تسوية (Planing machine) تتحرك أفقياً نحو عامل.',fig48,560),
  {h:'هـ- الانحشار (Entanglement)',ref:'ص 65',html:'<p>يحدث ذلك عند انحشار جزء من <b>الملابس الفضفاضة أو الشعر الطويل</b> في أجزاء المعدة الدوارة مما يسبب إصابات عديدة (الشكل 4-9 أ وب).</p>'},
  fig('4-9','ص 66',SIMPLE+' — (أ) «GLOVE ENTANGLEMENT»: قفاز يلتف حول عمود مثقاب دوار، وبجانبه جهاز إيقاف (Trip Device). (ب) عامل ينحني فوق آلة بكرات فتسحب البكرات كمّه ويده.',fig49,600),
  {h:'و- الاحتكاك والتسلخ (Friction and Abrasion)',ref:'ص 66',html:'<p>عند ملامسة أي جزء من أجزاء الجسم لأي جزء دوار خشن مثل <b>عجلة الجلخ أو الصنفرة</b> يحدث نتيجة لهذا الاحتكاك تسلخات بالجلد (الشكل 4-10).</p>'},
  fig('4-10','ص 66',SIMPLE+' — «FRICTION AND ABRASION HAZARDS»: حجر جلخ (Grinding Wheel) وآلة صنفرة أسطوانية (Sanding Machine)، والسهم يشير إلى السطح الخشن الدوار.',fig410,540),
  {h:'ز- السحق (Crushing)',ref:'ص 66–67',html:'<p>يحدث ذلك عندما ينحشر جزء من أجزاء الجسم <b>بين جزء ثابت وآخر متحرك</b> بالمعدة مثل المكابس، أو <b>بين جزأين متحركين</b> للمعدة مثل الرافعة المقص، أو <b>بين جزء متحرك بالمعدة وبين جدار أو الأرضية</b> مثل الثقل والأرضية (الشكل 4-11).</p>'},
  fig('4-11','ص 67',SIMPLE+' — «CRUSHING HAZARDS»: بين جزء متحرك وجدار، وبين سنبك مكبس الثني وقالبه، وبين ثقل الموازنة (Counterweight) والأرضية، وبين ذراعي الرافعة المقصية.',fig411,580),
  {h:'ح- المقذوفات وتطاير الشرر (Projectiles and Energy Release)',ref:'ص 67',html:'<p>في حالة حدوث انفجار داخل المعدة يتسبب في انبعاث أجزاء من المعدة إلى الخارج على شكل مقذوفات مما قد يسبب مخاطر كبيرة، وعلى سبيل المثال في حالة <b>انفجار عجلة الجلخ</b>، كذلك يمكن أن تنبعث بعض <b>الطاقة الكامنة في السست واليايات</b>.</p>'}
 ],
 lab:(el)=>nipLab(el),
 quiz:[
  {q:'ما مصدرا الخطر بالمعدات والآلات في الكتاب؟',o:['الضوضاء والحرارة','نقاط التشغيل ونقاط الالتقاء بين الأجزاء الدوارة','الإضاءة والتهوية','الكهرباء والماء'],c:1,e:'«1- نقاط التشغيل Point of Operation، 2- نقاط الالتقاء بين الأجزاء الدوارة… In-Running Nip Points» (ص 63).'},
  {q:'في سير يلف بكرتين، أين تقع نقطة الالتقاء؟',o:['حيث يخرج السير من البكرة','حيث يدخل السير على البكرة','في منتصف السير بين البكرتين','في محور البكرة'],c:1,e:'في الشكل (4-4) العلامة NIP POINT عند دخول السير على كل بكرة؛ هناك يتجه السير والبكرة أحدهما نحو الآخر.'},
  {q:'«مدى ثبات المعدة أو قربها من المعدات الأخرى» من أي أنواع المخاطر؟',o:['مخاطر تتعلق بالمعدة نفسها','مخاطر تتعلق بموقع المعدة','مخاطر تتعلق بنظام العمل المصاحب','ليست من المخاطر'],c:1,e:'(ص 63).'},
  {q:'قفاز يلتف حول عمود مثقاب دوار. ما نوع هذه الإصابة؟',o:['القطع','الصدمات','الانحشار','السحق'],c:2,e:'الانحشار: «انحشار جزء من الملابس الفضفاضة أو الشعر الطويل في أجزاء المعدة الدوارة» (الشكل 4-9-أ).'},
  {q:'يد بين ذراعي رافعة مقصية تنزل. ما نوع الإصابة؟',o:['السحق','الاحتكاك والتسلخ','الاختراق والثقب','المقذوفات'],c:0,e:'السحق: «بين جزأين متحركين للمعدة مثل الرافعة المقص» (ص 66).'},
  {q:'انفجار عجلة الجلخ وتطاير أجزائها يُصنَّف تحت:',o:['القص','المقذوفات وتطاير الشرر','الصدمات','الانحشار'],c:1,e:'«في حالة انفجار عجلة الجلخ… على شكل مقذوفات» (ص 67).'}
 ]
});

/* ---------------- u4-l3 ---------------- */
B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'67–74',
 title:'حواجز الحماية وأجهزتها',
 summary:'موقع المعدة، ووسائل الحماية الخمس: الحواجز (الثابت، والمزود بمفتاح فصل، والقابل للتعديل، وذاتي التعديل)، والأجهزة (الخلية الكهروضوئية، والسحب للخلف، والإيقاف المحدد، والتحكم باليدين)، والمسافة، والتزويد الأوتوماتيكي، وضوابط حجر الجلخ. ومعها أسئلة الوحدة.',
 stations:[
  {intro:true},
{st:1,short:'حواجز الحماية',title:'4-7 حواجز الحماية بالمعدات <span class="ltr">(Machine Safeguards)</span>',ref:'ص 67',
   q:'لا يوجد حاجز واحد يصلح لكل آلة… فما الذي يحدد نوع الحماية المناسب؟',
   art:SFA.art('آلة عليها حاجز، وحولها العوامل الخمسة التي تحدد نوع الحماية',
    `<rect x="120" y="128" width="120" height="86" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><g transform="translate(180 170)"><path d="${gearD(26,10,6)}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g><path d="M112 120H248V222H112Z" fill="var(--blue-soft)" fill-opacity=".55" stroke="var(--blue)" stroke-width="3"/>`+
    [['نوع العمليات',180,74],['حجم وشكل الشغلة',282,112],['طريق التعامل',290,234],['موقع المعدة',70,234],['نوع المواد',78,112]].map(([t,x,y])=>`<rect x="${x-58}" y="${y-17}" width="116" height="30" rx="15" fill="var(--surface)" stroke="var(--blue)" stroke-width="1.8"/>`+SFA.ar(x,y+4,t,{fs:13})).join('')+
    SFA.ar(180,272,'الحاجز المناسب يختلف من آلة لأخرى',{fs:13.5,c:'var(--blue-ink)'})+
    SFA.hot(122,57,116,30,'نوع العمليات: قطع أو كبس أو ثني أو لف… لكل عملية خطرها.')+SFA.hot(224,95,116,30,'حجم وشكل الشغلة: قطعة صغيرة تحتاج أن تقترب اليد أكثر من القطعة الكبيرة.')+SFA.hot(232,217,116,30,'طريق التعامل والمناولة: كيف تُدخل الشغلة وتُخرج — باليد أو آلياً.')+SFA.hot(12,217,116,30,'موقع المعدة: مكانها في الورشة وما حولها.')+SFA.hot(20,95,116,30,'نوع المواد المستخدمة: معادن أو خشب أو غيرها.')+SFA.hot(112,120,136,102,'الحاجز (الأزرق): يمنع وصول الجسم إلى الأجزاء الخطرة.')),
   cap:'العوامل التي يذكرها الكتاب.<br><b>مرّر المؤشر على كل عامل وعلى الحاجز (أو المسها في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'أي مما يلي ليس من العوامل التي تحدد أنسب أنواع الحماية في الكتاب؟',opts:[
     ['حجم وشكل الشغلة',false,'من العوامل المذكورة (ص 67).'],
     ['لون الآلة',true,'لا يذكره الكتاب؛ العوامل: نوع العمليات، حجم وشكل الشغلة، طريق التعامل والمناولة، موقع المعدة، نوع المواد.'],
     ['نوع المواد المستخدمة',false,'من العوامل المذكورة (ص 67).']]}}
   ],
   body:[
    {book:`<p>توجد طرق عديدة لتوفير وسائل الوقاية من المخاطر المحتملة من المعدات، حيث تحدد عوامل كثيرة أنسب أنواع الحماية اللازمة ومن هذه العوامل: نوع العمليات، حجم وشكل الشغلة، طريق التعامل والمناولة، موقع المعدة، نوع المواد المستخدمة.</p>`,ref:'ص 67'},
    {title:'مختبر مصغّر: أي عامل يغيّر الحماية هنا؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'مكبس واحد يكبس أحياناً قطعاً كبيرة، وأحياناً قطعاً صغيرة جداً تحتاج أن تقترب الأصابع من القالب.',opts:[['نوع المواد المستخدمة',false,'المادة واحدة؛ الذي تغير مقاس القطعة.'],['حجم وشكل الشغلة',true,'القطعة الصغيرة تقرّب اليد من منطقة الخطر، فقد تحتاج وسيلة أخرى.'],['موقع المعدة',false,'المكبس في مكانه نفسه.']]},
     {q:'آلة كانت تُغذّى باليد، ثم رُكّبت لها وحدة تغذية آلية.',opts:[['طريق التعامل والمناولة',true,'تغيرت طريقة إدخال الشغلة، فتغير قرب العامل من الخطر.'],['نوع العمليات',false,'العملية نفسها لم تتغير.'],['حجم الشغلة',false,'الشغلة نفسها.']]}]})}
   ]},

  {st:2,short:'موقع المعدة',title:'4-7-1 موقع المعدة <span class="ltr">(Machine Layout)</span>',ref:'ص 67–68',
   q:'آلتان ممتازتان وُضعتا متلاصقتين في ركن مظلم… هل الموقع جزء من الحماية؟',
   art:SFA.art('منظر علوي لورشة: مسافة آمنة بين آلتين، وإضاءة موضعية، وممر للصيانة',
    `<rect x="70" y="92" width="96" height="60" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><rect x="194" y="92" width="96" height="60" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/>`+
    `<path d="M172 122H188" stroke="var(--blue)" stroke-width="2"/>`+arrow(180,122,168,122,'var(--blue)',1.6)+arrow(180,122,192,122,'var(--blue)',1.6)+
    `<path d="M60 196H300" stroke="var(--blue)" stroke-width="2.4" stroke-dasharray="8 6"/>`+arrow(270,214,310,214,'var(--blue)',2.2)+
    [118,242].map(x=>`<circle cx="${x}" cy="78" r="9" fill="var(--live)" stroke="var(--fg)" stroke-width="1.5"/>`+[-30,0,30].map(a=>`<path d="M${x} 90L${x+Math.sin(a*Math.PI/180)*18} ${90+Math.cos(a*Math.PI/180)*14}" stroke="var(--live)" stroke-width="2"/>`).join('')).join('')+
    `<circle cx="118" cy="168" r="10" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><circle cx="242" cy="168" r="10" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+
    SFA.ar(180,58,'منظر من أعلى',{fs:14.5,w:700})+SFA.ar(180,236,'ممر آمن للتشغيل والصيانة',{fs:13.5,c:'var(--blue-ink)'})+SFA.ar(118,128,'آلة',{fs:13})+SFA.ar(242,128,'آلة',{fs:13})+
    SFA.hot(160,104,40,36,'مسافة آمنة بين المعدات المختلفة.')+SFA.hot(100,62,160,34,'إضاءة موضعية فوق كل آلة، مع الإضاءة الجيدة للموقع.')+SFA.hot(56,184,256,38,'ممر أمام الآلات: لتسهيل التشغيل والإشراف والصيانة والتنظيف، والدخول الآمن للصيانة.')+SFA.hot(100,154,160,28,'مكان العامل أمام كل آلة.')),
   cap:'ما يأخذه الموقع الآمن في الاعتبار.<br><b>مرّر المؤشر على المسافة والإضاءة والممر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يطلب الكتاب ترك مسافات آمنة بين المعدات وأمامها وخلفها؟',opts:[
     ['لتوفير الكهرباء',false,'المسافة لا علاقة لها بالكهرباء.'],
     ['لتسهيل طرق التشغيل والإشراف والصيانة والتنظيف',true,'هذا نص الكتاب (ص 67–68).'],
     ['لتبدو الورشة أكبر',false,'السبب سلامة العمل لا المظهر.']]}}
   ],
   body:[
    {book:`<p>الطريقة التي يتم وضع المعدة بها في الموقع يقلل إلى حد كبير من الحوادث (الشكل 4-12)، حيث الموقع الآمن سوف يأخذ في الاعتبار ما يأتي:</p><ul><li>ترك مسافات آمنة بين المعدات المختلفة وأمام وخلف المعدة نفسها لتسهيل طرق التشغيل، الإشراف، الصيانة والتنظيف.</li><li>الإضاءة الجيدة بالموقع، كذلك الإضاءة الموضعية بالمعدة نفسها تساعد كثيرا في تقليل الحوادث.</li><li>الدخول الآمن لإجراء أعمال الصيانة.</li></ul>`,ref:'ص 67–68'},
    {html:SFA.fig(fig412(),'الشكل <span class="ltr">(4-12)</span> ص 68 — رسم مبسّط: «MACHINE LAYOUT»: مخرطتان متوازيتان بينهما ممر، وفوق كل آلة إضاءة موضعية.',540)},
    {title:'مختبر مصغّر: رتّب الورشة',widget:(el,B)=>DCML.lab(el,B,{intro:'شغّل الشروط الثلاثة التي يذكرها الكتاب وانظر كيف يتغير المخطط.',
     ins:[{k:'gap',l:'مسافة آمنة بين الآلتين',sw:true,v:0,on:'✓ مسافة آمنة بين الآلتين',off:'الآلتان متلاصقتان'},{k:'lit',l:'',sw:true,v:0,on:'✓ إضاءة جيدة وموضعية',off:'الإضاءة ضعيفة'},{k:'acc',l:'',sw:true,v:0,on:'✓ ممر ودخول آمن للصيانة',off:'لا ممر للصيانة'}],
     calc:(s)=>{const g=s.gap?40:4,x1=180-g/2-110,x2=180+g/2;let v=`<svg viewBox="0 0 360 230" role="img" aria-label="مخطط الورشة" style="font-family:var(--font)"><rect x="4" y="4" width="352" height="222" rx="10" style="fill:${s.lit?'var(--surface)':'var(--surface-2)'};stroke:var(--line)"/>`;
      if(!s.lit)v+=`<rect x="4" y="4" width="352" height="222" rx="10" style="fill:var(--fg);opacity:.18"/>`;
      v+=`<rect x="${x1}" y="60" width="110" height="64" rx="6" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.8"/><rect x="${x2}" y="60" width="110" height="64" rx="6" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.8"/>`;
      if(s.lit)[x1+55,x2+55].forEach(x=>{v+=`<circle cx="${x}" cy="40" r="8" style="fill:var(--live)"/>`});
      if(s.acc)v+=`<path d="M20 160H340" style="stroke:var(--blue);stroke-width:3;stroke-dasharray:9 6"/>`;else v+=`<rect x="10" y="140" width="340" height="40" style="fill:var(--live-soft);stroke:var(--fg)"/>`;
      v+=`<circle cx="${x1+55}" cy="140" r="9" style="fill:var(--blue-soft);stroke:var(--blue)"/><circle cx="${x2+55}" cy="140" r="9" style="fill:var(--blue-soft);stroke:var(--blue)"/></svg>`;
      const n=s.gap+s.lit+s.acc;return {pic:v,msg:n===3?'<b>موقع آمن:</b> مسافات آمنة، وإضاءة جيدة وموضعية، ودخول آمن للصيانة — كما يطلب الكتاب (ص 67–68).':`ينقص ${3-n} من شروط الموقع الآمن: ${[!s.gap&&'المسافات الآمنة',!s.lit&&'الإضاءة',!s.acc&&'الدخول الآمن للصيانة (المستطيل البرتقالي صناديق تسد الممر)'].filter(Boolean).join('، ')}.`,cls:n===3?'':'warn'}}})}
   ]},

  {st:3,short:'وسائل الحماية',title:'4-7-2 وسائل الحماية للمعدات والآلات',ref:'ص 68',
   q:'غطاء، وشعاع ضوء، وسياج، ووحدة تغذية، وعصا خشبية… ما الذي يجمعها؟',
   art:SFA.art('خمس وسائل لحماية العامل من الآلة',
    `<g transform="translate(180 164)"><path d="${gearD(34,12,8)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle r="11" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/></g>`+
    [['1','الحواجز',180,70],['2','الأجهزة',292,128],['3','الموقع والمسافة',262,250],['4','التزويد الأوتوماتيكي',98,250],['5','وسائل أخرى',68,128]].map(([n,t,x,y])=>`<rect x="${x-64}" y="${y-18}" width="128" height="32" rx="16" fill="var(--surface)" stroke="var(--blue)" stroke-width="2"/>`+SFA.ar(x,y+4,n+'- '+t,{fs:13})).join('')+
    SFA.hot(116,52,128,32,'الحواجز ⟦Guards⟧: ثابتة، أو بمفتاح فصل، أو قابلة للتعديل، أو ذاتية التعديل.')+SFA.hot(228,110,128,32,'الأجهزة ⟦Devices⟧: الخلية الكهروضوئية، والسحب للخلف، والإيقاف المحدد، والتحكم باليدين.')+SFA.hot(198,232,128,32,'الحماية بالموقع والمسافة ⟦Location/Distance⟧: حاجز يُبعد العامل عن المعدة.')+SFA.hot(34,232,128,32,'تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية ⟦Feeding and Ejection Methods⟧.')+SFA.hot(4,110,128,32,'طرق الحماية المختلفة ⟦Miscellaneous⟧: حواجز متحركة شفافة أو معدات مساعدة مثل عصا الدفع.')),
   cap:'الوسائل الخمس بترتيب الكتاب، ولكل منها محطة بعد هذه.<br><b>مرّر المؤشر على كل وسيلة (أو المسها في الجوال) لتعرف ما تشمله.</b>',
   side:[
    {predict:{q:'سياج شبكي حول روبوت، ولوحة تشغيله خارج السياج. أي وسيلة حماية هذه؟',opts:[
     ['الأجهزة',false,'الأجهزة توقف الآلة أو تبعد اليد عند الخطر؛ السياج لا يفعل ذلك.'],
     ['الحماية بالموقع والمسافة',true,'«يتم إحاطة المعدة بواسطة حاجز يبعد العامل عنها، كذلك تكون لوحة التشغيل بعيدة عنها» (ص 72).'],
     ['التزويد الأوتوماتيكي',false,'التزويد عن طريقة إدخال المواد الخام.']]}}
   ],
   body:[
    {book:`<ol><li>الحواجز <span class="ltr">Guards</span></li><li>الأجهزة <span class="ltr">Devices</span></li><li>الحماية بالموقع والمسافة <span class="ltr">Location/Distance</span></li><li>تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية <span class="ltr">Feeding and Ejection Methods</span></li><li>طرق الحماية المختلفة والمتعددة <span class="ltr">Miscellaneous</span>.</li></ol>`,ref:'ص 68'},
    {watch:`<p>في البند 4 (ص 68) كُتب المصطلح «<span class="ltr">Potential Feeding and Ejection .Methods</span>»؛ كلمة <span class="ltr">Potential</span> زائدة والنقطة قبل <span class="ltr">Methods</span> خطأ طباعي، والمصطلح «<span class="ltr">Feeding and Ejection Methods</span>» (طرق التغذية والإخراج)، فكتبناه هنا مصححاً.</p>`,fix:1},
    {title:'مختبر مصغّر: أي وسيلة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مثال اضغط وسيلة الحماية التي ينتمي إليها.',cats:['الحواجز','الأجهزة','الموقع والمسافة','التزويد الأوتوماتيكي','وسائل أخرى'],items:[
 ['غطاء شبكي مثبت فوق السير والبكرتين.',0,'الحاجز الثابت — الشكل (4-13).'],
 ['شعاع ضوئي أمام منطقة الخطر يوقف المكبس إذا قُطع.',1,'الخلية الكهروضوئية — الشكل (4-17).'],
 ['شريط معدني يدخل المكبس من لفة عبر وحدة تغذية.',3,'الشكل (4-22).'],
 ['عصا دفع لإدخال قطعة الخشب إلى المنشار.',4,'«معدات مساعدة» — الشكل (4-23)-أ.'],
 ['مفتاحان متباعدان يجب الضغط عليهما معاً.',1,'التحكم باليدين — الشكل (4-20).']]})}
   ]},

  {st:4,short:'1- الحواجز',title:'1- الحواجز <span class="ltr">(Guards)</span>',ref:'ص 68–70',
   q:'غطاء يُفتح بمفك عادي… هل يكفي ليكون حاجزاً ثابتاً؟',
   art:SFA.art('حاجز ثابت شبكي يغطي سيراً وبكرتين',
    SFA.emb(fig413(),[30,20,420,196],[14,74,332,150])+
    SFA.ar(180,60,'الحاجز الثابت',{fs:16,w:700})+SFA.ar(58,152,'المحرك',{fs:13.5})+SFA.ar(264,268,'فتحات صغيرة للتهوية',{fs:13.5,c:'var(--blue-ink)'})+
    SFA.hot(18,80,76,80,'المحرك وبكرته الصغيرة.')+SFA.hot(80,104,240,140,'الغطاء الشبكي الثابت يغطي السير والبكرتين بالكامل؛ فتحاته للتهوية «لا تسمح بوصول أي جزء من أجزاء الجسم» إلى الأجزاء الدوارة.')+SFA.hot(250,180,80,70,'البكرة الكبيرة تحت الغطاء.')),
   cap:'فكرة الشكل <span class="ltr">(4-13)</span>.<br><b>مرّر المؤشر على المحرك والغطاء والبكرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يحدث في الحاجز المزود بمفتاح فصل إذا فُتح باب المعدة أثناء التشغيل؟',opts:[
     ['تكمل المعدة دورتها ثم تتوقف',false,'الكتاب يقول «على الفور».'],
     ['يرن جرس تحذير فقط',false,'المفتاح يوقف المعدة نفسها.'],
     ['تتوقف المعدة على الفور ولا تعمل إلا بإعادة الحاجز',true,'(ص 69).']]}}
   ],
   body:[
    {book:`<p><b>أ- الحواجز الثابتة:</b> جزء ثابت يتم تثبيته فوق الأجزاء الدوارة والخطرة بالمعدة وعادة ما يكون به فتحات منتظمة للتهوية ولكن مساحة هذه الفتحات لا تسمح بوصول أي جزء من أجزاء الجسم للأجزاء الدوارة بالمعدة. يتم تثبيت هذا الحاجز بواسطة معدات يدوية خاصة بحيث لا يستطيع أي شخص فكه إلا بواسطة نفس المعدة (الشكل 4-13). يكون مزود بطريقة تسمح بتزييت المعدة بدون إزالة الحاجز.</p>`,ref:'ص 68–69'},
    {html:SFA.fig(fig413(),'الشكل <span class="ltr">(4-13)</span> ص 69 — رسم مبسّط: «FIXED GUARD»: محرك وبكرة يربطهما سير، مغطاة بالكامل بغطاء شبكي.',460)},
    {book:`<p><b>ب- الحاجز المزود بمفتاح فصل (<span class="ltr">Interlock</span>):</b> في حالة فتح باب المعدة أو رفع الحاجز يقوم المفتاح بإيقاف المعدة على الفور ولا تعمل مرة أخرى إلا بإعادة الحاجز لوضعه الأصلي (الشكل 4-14).</p>`,ref:'ص 69'},
    {html:SFA.fig(fig414(),'الشكل <span class="ltr">(4-14)</span> ص 69 — رسم مبسّط: «INTERLOCKED GUARD»: مجفف ملابس دوار <span class="ltr">(Clothes Drying Tumbler)</span> على حافة بابه مفتاح فصل.',330)},
    {title:'مختبر مصغّر: الحاجز المزود بمفتاح فصل',widget:(el,B)=>DCML.lab(el,B,{intro:'افتح الباب وأغلقه، واضغط التشغيل، وانظر متى يدور الحوض.',
     ins:[{k:'door',l:'الباب',seg:[[1,'مغلق'],[0,'مفتوح']],v:1},{k:'run',l:'زر التشغيل',seg:[[0,'إيقاف'],[1,'تشغيل']],v:0}],
     calc:(s)=>{const on=s.door&&s.run;let v=`<svg viewBox="0 0 300 220" role="img" aria-label="مجفف بباب عليه مفتاح فصل" style="font-family:var(--font)"><rect x="70" y="14" width="160" height="192" rx="8" style="fill:var(--on-soft);stroke:var(--fg);stroke-width:1.6"/><circle cx="150" cy="104" r="56" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/>`;
      v+=on?arcArrow(150,104,36,-150,60,'var(--blue)',3):`<path d="M130 104H170" style="stroke:var(--muted);stroke-width:3"/>`;
      v+=s.door?`<circle cx="150" cy="104" r="56" style="fill:var(--blue-soft);fill-opacity:.5;stroke:var(--blue);stroke-width:4"/>`:`<path d="M94 104A56 56 0 0 1 60 60" style="fill:none;stroke:var(--blue);stroke-width:4"/><ellipse cx="44" cy="104" rx="16" ry="56" style="fill:var(--blue-soft);fill-opacity:.5;stroke:var(--blue);stroke-width:3"/>`;
      v+=`<rect x="200" y="96" width="14" height="16" rx="2" style="fill:${s.door?'var(--on)':'var(--stop)'};stroke:var(--fg)"/>`+E(150,196,on?'RUN':'STOP',{fs:12,c:on?GRN:RED})+'</svg>';
      return {pic:v,msg:on?'الباب مغلق والتشغيل مضغوط: الحوض يدور.':!s.door&&s.run?'<b>الباب مفتوح:</b> «يقوم المفتاح بإيقاف المعدة على الفور»، ولا تعمل حتى يُعاد الحاجز لوضعه الأصلي — مهما ضغطت التشغيل.':!s.door?'الباب مفتوح والمفتاح يمنع التشغيل. أغلقه ثم شغّل.':'الباب مغلق والمعدة متوقفة. اضغط «تشغيل».',cls:!s.door&&s.run?'warn':''}}})},
    {book:`<p><b>ج- الحاجز القابل للتعديل (<span class="ltr">Adjustable Guard</span>):</b> يمكن للعامل القيام بتعديل وضع الحاجز بحيث يغطي منطقة الخطر، مثال على ذلك المنشار الرأسي <span class="ltr">Band Saw</span> (الشكل 4-15).</p>`,ref:'ص 70'},
    {html:SFA.fig(fig415(),'الشكل <span class="ltr">(4-15)</span> ص 70 — رسم مبسّط: منشار شريطي: الواقي القابل للتعديل حول النصل <span class="ltr">(Adjustable blade guard)</span>، وواقٍ شفاف <span class="ltr">(Transparent guard)</span>.',470)},
    {book:`<p><b>د- الحاجز ذاتي التعديل (<span class="ltr">Self-Adjusting Guard</span>):</b> هذا النوع من الحواجز يعدل نفسه بنفسه حسب حجم الشغلة بحيث يغطي منطقة الخطر على الدوام (الشكل 4-16).</p>`,ref:'ص 70'},
    {html:SFA.fig(fig416(),'الشكل <span class="ltr">(4-16)</span> ص 70 — رسم مبسّط: منشار ذراعي: الواقي حول النصل <span class="ltr">(GUARD)</span>، وجهاز منع الارتداد <span class="ltr">(ANTI-KICKBACK DEVICE)</span>، والنصل <span class="ltr">(BLADE)</span>.',460)},
    {tip:`<p>الفرق بين (ج) و(د): في الحاجز <b>القابل للتعديل</b> يضبطه <b>العامل</b> بيده على ارتفاع الشغلة قبل العمل؛ أما <b>ذاتي التعديل</b> فيرتفع وحده عندما تدفعه الشغلة ويعود عندما تخرج.</p>`,title:'من يعدّل الحاجز؟'},
    {title:'مختبر مصغّر: أي حاجز؟',widget:(el,B)=>DCML.sort(el,B,{cats:['ثابت','بمفتاح فصل','قابل للتعديل','ذاتي التعديل'],items:[
 ['غطاء لا يُفك إلا بعدة خاصة، وفيه طريقة للتزييت دون إزالته.',0,'وصف الحاجز الثابت (ص 68–69).'],
 ['عند رفع الغطاء تتوقف الآلة فوراً.',1,'الحاجز المزود بمفتاح فصل Interlock (ص 69).'],
 ['العامل يخفض واقي نصل المنشار الشريطي حتى يقارب سطح الخشب.',2,'الحاجز القابل للتعديل — Band Saw (ص 70).'],
 ['واقٍ يرتفع وحده بقدر سماكة الشغلة التي تدخل تحته.',3,'«يعدل نفسه بنفسه حسب حجم الشغلة» (ص 70).']]})}
   ]},

  {st:5,short:'2- الأجهزة',title:'2- الأجهزة <span class="ltr">(Devices)</span>',ref:'ص 70–72',
   q:'لا حاجز أمام المكبس… فكيف يتوقف قبل أن يصل إلى يدك؟',
   art:SFA.art('مكبس أمام منطقة عمله شعاع ضوئي يوقفه إذا قُطع',
    SFA.emb(pressSVG({mode:'curtain',pos:0,hand:30,guard:true}),[20,14,440,326],[22,56,316,236])+
    SFA.ar(180,52,'الخلية الكهروضوئية',{fs:15,w:700})+SFA.ar(272,300,'الشعاع الضوئي',{fs:13.5,c:'var(--on)'})+
    SFA.hot(120,110,90,80,'السلاح ⟦ram⟧: الجزء الذي ينزل فيكبس الشغلة على القالب.')+SFA.hot(118,192,80,50,'منطقة الخطر (الأحمر الخفيف) فوق القالب ⟦die⟧.')+SFA.hot(196,108,28,120,'عمود الخلية الكهروضوئية: شعاع ضوئي «بالقرب من منطقة الخطر»؛ إذا قطعه أي جزء من الجسم توقفت المعدة على الفور.')+SFA.hot(250,200,90,40,'يد العامل خارج الشعاع: المكبس يعمل.')),
   cap:'فكرة الشكل <span class="ltr">(4-17)</span>.<br><b>مرّر المؤشر على السلاح ومنطقة الخطر والشعاع واليد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في أي نظام يكون طول الواير لا يسمح أبداً بوصول اليد إلى نقطة الخطر؟',opts:[
     ['نظام السحب للخلف',false,'هنا تدخل اليد والسلاح في الأعلى، وتُسحب عند بدء النزول.'],
     ['التحكم باليدين',false,'لا واير فيه؛ اليدان على مفتاحين.'],
     ['نظام الإيقاف المحدد',true,'«طول الواير لا يسمح بأي حال من الأحوال بوصول أيدي العامل لنقطة الخطر» (ص 71).']]}}
   ],
   body:[
    {book:`<p><b>أ- الخلية الكهروضوئية (<span class="ltr">Photoelectric Cell</span>):</b> وجود شعاع ضوئي بالقرب من منطقة الخطر وفي حالة قطع هذا الشعاع بواسطة أي جزء من أجزاء الجسم تتوقف المعدة على الفور (المقص الكهربائي للورق) (الشكل 4-17).</p>`,ref:'ص 70–71'},
    {html:SFA.fig(fig417(),'الشكل <span class="ltr">(4-17)</span> ص 71 — رسم مبسّط: مكبس ثني على جانبيه مرسل ومستقبل الشعاع الضوئي <span class="ltr">(Photoelectric device)</span>.',460)},
    {book:`<p><b>ب- نظام السحب للخلف (<span class="ltr">Pullback System</span>):</b> يتم ربط أيدي العامل بواسطة واير ويكون الواير مربوط بنظام تشغيل المعدة بحيث عندما يكون الجزء المسبب للخطر في الوضع العلوي يمكن للعامل إدخال يديه وإجراء التعديل المطلوب، وعند بدء نزول الجزء المسبب للخطر يتم سحب أيدي العامل للخلف لإبعادها من مركز الخطر (الشكل 4-18).</p>
     <p><b>ج- نظام الإيقاف المحدد (<span class="ltr">Restraint System</span>):</b> في هذا النوع من أنواع الحماية يتم ربط أيدي العامل بواسطة واير بحيث يكون طول الواير لا يسمح بأي حال من الأحوال بوصول أيدي العامل لنقطة الخطر، ويتم استخدام معدات مساعدة لوضع الشغلة في مكان التشغيل (الشكل 4-19).</p>`,ref:'ص 71'},
    {html:`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${SFA.fig(fig418(),'الشكل <span class="ltr">(4-18)</span> ص 71 — رسم توضيحي للفكرة: نظام السحب للخلف.',460)}${SFA.fig(fig419(),'الشكل <span class="ltr">(4-19)</span> ص 71 — رسم توضيحي للفكرة: نظام الإيقاف المحدد (الخط الأحمر المتقطع أبعد ما تصل إليه اليد).',460)}</div>`},
    {book:`<p><b>د- نظام التحكم بواسطة اليدين الاثنتين (<span class="ltr">Two Hand Control</span>):</b> لا يتم تشغيل المعدة إلا بواسطة الضغط على مفتاحين اثنين لضمان عدم إدخال العامل ليديه في منطقة الخطر (الشكل 4-20).</p>`,ref:'ص 72'},
    {html:SFA.fig(fig420(),'الشكل <span class="ltr">(4-20)</span> ص 72 — رسم مبسّط: عامل يضغط بيديه في وقت واحد على زرين متباعدين.',460)},
    {title:'مختبر مصغّر: جرّب الأجهزة الأربعة على المكبس',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الجهاز، ثم حاول إدخال اليد، ثم شغّل المكبس. الرسم من مختبر الدرس.',
     ins:[{k:'m',l:'الجهاز',seg:[['curtain','الخلية الكهروضوئية'],['pullback','السحب للخلف'],['restraint','الإيقاف المحدد'],['twohand','التحكم باليدين']],v:'curtain'},
      {k:'h',l:'يد العامل',seg:[[0,'خارج المكبس'],[1,'يحاول إدخالها تحت السلاح']],v:0},{k:'go',l:'المكبس',seg:[[0,'السلاح في الأعلى'],[1,'شغّل: ابدأ الشوط']],v:0}],
     calc:(s)=>{let hand=s.h?85:10,pos=0,hl=false,hr=false,msg='',cls='';
      if(s.m==='curtain'){if(s.go&&s.h){msg='<b>لا ينزل السلاح:</b> اليد تقطع الشعاع الضوئي، «وفي حالة قطع هذا الشعاع… تتوقف المعدة على الفور».'}else if(s.go){pos=1;msg='الشعاع سليم فالسلاح ينزل، واليد خارج منطقة الخطر.'}else msg=s.h?'اليد تحت السلاح والشعاع مقطوع (الأحمر): المكبس لن يعمل.':'الشعاع سليم (الأخضر).'}
      if(s.m==='pullback'){if(s.go){pos=1;hand=Math.min(hand,25);msg=s.h?'<b>سُحبت اليد للخلف:</b> «عند بدء نزول الجزء المسبب للخطر يتم سحب أيدي العامل للخلف».':'السلاح ينزل واليد بعيدة.'}else msg=s.h?'السلاح في الوضع العلوي، فيُسمح لليد بالدخول لإجراء التعديل.':'الواير (الأزرق) يربط المعصم بنظام تشغيل المكبس.'}
      if(s.m==='restraint'){hand=Math.min(hand,45);pos=s.go?1:0;msg=s.h?'<b>لا تصل اليد:</b> طول الواير «لا يسمح بأي حال من الأحوال بوصول أيدي العامل لنقطة الخطر»؛ تُستعمل معدات مساعدة لوضع الشغلة.':s.go?'السلاح ينزل واليد مربوطة بعيداً عنه.':'الواير مربوط بحامل ثابت.'}
      if(s.m==='twohand'){if(s.h){hl=true;hr=false;msg=s.go?'<b>لا يعمل المكبس:</b> يد واحدة على زرها والأخرى تحت السلاح؛ يلزم الضغط على المفتاحين معاً.':'رفع العامل يداً عن زرها.'}else{hl=hr=true;pos=s.go?1:0;msg=s.go?'المفتاحان مضغوطان معاً: السلاح ينزل واليدان على الزرين بعيداً عن الخطر.':'اليدان على الزرين.'}}
      return {pic:pressSVG({mode:s.m,pos,hand,guard:true,hl,hr,zoneOn:hand>=PLIM.zone}),msg,cls}}})}
   ]},

  {st:6,short:'3- الموقع والمسافة',title:'3- الحماية بالموقع والمسافة <span class="ltr">(Safeguarding by Location/Distance)</span>',ref:'ص 72',
   q:'إذا لم تستطع أن تصل إلى الآلة أصلاً… هل تحتاج إلى حاجز عليها؟',
   art:SFA.art('روبوت صناعي داخل سياج، ولوحة التشغيل خارجه',
    `<path d="M70 250V110L290 90V230Z" fill="none" stroke="var(--fg)" stroke-width="2.4"/>`+[...Array(11)].map((_,i)=>`<path d="M${84+i*20} ${249-i*1.8}V${108-i*1.8}" stroke="var(--muted)" stroke-width="1"/>`).join('')+
    `<ellipse cx="180" cy="214" rx="32" ry="9" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><rect x="166" y="170" width="28" height="44" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M180 170L210 126L254 140" fill="none" stroke="var(--fg)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`+
    `<rect x="300" y="160" width="34" height="46" rx="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="317" cy="176" r="5" fill="var(--on)"/><circle cx="317" cy="194" r="5" fill="var(--stop)"/>`+person(318,290,{hands:[[306,214],[328,214]]}).replace('<g>','<g transform="translate(0 0)">')+
    SFA.ar(180,70,'السياج يبعد العامل',{fs:15,w:700})+SFA.ar(110,274,'حاجز حول المعدة',{fs:13.5})+
    SFA.hot(66,88,228,166,'حاجز (سياج شبكي) يحيط بالمعدة فيبعد العامل عنها.')+SFA.hot(296,156,42,54,'لوحة التشغيل خارج الحاجز: يشغّل العامل المعدة وهو بعيد عنها.')),
   cap:'فكرة الشكل <span class="ltr">(4-21)</span>.<br><b>مرّر المؤشر على السياج ولوحة التشغيل (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'أين تكون لوحة التشغيل في الحماية بالموقع والمسافة؟',opts:[
     ['داخل الحاجز بجانب المعدة',false,'هذا يجبر العامل على الدخول إلى منطقة الخطر.'],
     ['بعيدة عن المعدة خارج الحاجز',true,'«كذلك تكون لوحة التشغيل بعيدة عنها خارج الحاجز» (ص 72).'],
     ['فوق المعدة',false,'لا يذكر الكتاب ذلك.']]}}
   ],
   body:[
    {book:`<p>يتم إحاطة المعدة بواسطة حاجز يبعد العامل عنها، كذلك تكون لوحة التشغيل بعيدة عنها خارج الحاجز (الشكل 4-21).</p>`,ref:'ص 72'},
    {html:SFA.fig(fig421(),'الشكل <span class="ltr">(4-21)</span> ص 72 — رسم مبسّط: «DISTANCE GUARD»: روبوت صناعي يعمل داخل سياج شبكي.',460)},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['في الحماية بالمسافة يقف العامل بجانب الروبوت ليراقبه عن قرب.',false,'الحاجز «يبعد العامل عنها» (ص 72).'],
 ['الحماية بالمسافة تناسب الآلات التي تتحرك في مدى واسع مثل الروبوت.',true,'كما في الشكل (4-21)؛ ومر بنا أن ذراع الروبوت من أمثلة الصدمات (4-8).']]})}
   ]},

  {st:7,short:'4- التزويد الأوتوماتيكي',title:'4- التزويد الأوتوماتيكي <span class="ltr">(Automatic Feeding)</span>',ref:'ص 72',
   q:'من يضع القطعة تحت السلاح: يدك أم الآلة؟',
   art:SFA.art('شريط معدني يدخل المكبس من لفة عبر وحدة تغذية آلية',
    SFA.emb(fig422(),[20,40,460,170],[14,86,332,128])+SFA.ar(180,66,'الآلة تغذي نفسها',{fs:15.5,w:700})+SFA.ar(86,250,'لفة المادة',{fs:13.5})+SFA.ar(200,250,'وحدة التغذية',{fs:13.5})+SFA.ar(300,250,'المكبس',{fs:13.5})+
    SFA.hot(30,104,90,110,'لفة المادة الخام (شريط معدني ملفوف).')+SFA.hot(150,120,110,90,'وحدة التغذية ⟦feeder⟧ تدفع الشريط إلى المكبس آلياً.')+SFA.hot(262,92,84,120,'المكبس: لا يحتاج العامل إلى إدخال يده تحت السلاح.')),
   cap:'فكرة الشكل <span class="ltr">(4-22)</span>.<br><b>مرّر المؤشر على اللفة ووحدة التغذية والمكبس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يقلل التزويد الأوتوماتيكي من تعرض العامل للمخاطر؟',opts:[
     ['لأن الآلة تعمل أبطأ',false,'السرعة ليست السبب.'],
     ['لأن العامل لا يحتاج إلى إدخال يده في منطقة الخطر لتزويد المعدة',true,'تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية «يقلل من تعرض العامل للمخاطر» (ص 72).'],
     ['لأن المادة الخام تصبح أخف',false,'وزن المادة لا يتغير.']]}}
   ],
   body:[
    {book:`<p>تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية يقلل من تعرض العامل للمخاطر (الشكل 4-22).</p>`,ref:'ص 72'},
    {html:SFA.fig(fig422(),'الشكل <span class="ltr">(4-22)</span> ص 72 — رسم مبسّط: مكبس يدخل إليه شريط معدني من لفة عبر وحدة تغذية آلية.',500)},
    {tip:`<p>تذكّر «مخاطر تتعلق بنظام العمل المصاحب للمعدة مثل أعمال التحميل اليدوي» (ص 63): التزويد الأوتوماتيكي يعالج هذا النوع نفسه.</p>`,title:'ربط مع ما سبق'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['التزويد الأوتوماتيكي يعالج خطر التحميل اليدوي لتزويد المعدة بالمواد الخام.',true,'التحميل اليدوي من مخاطر نظام العمل المصاحب (ص 63).'],
 ['مع التزويد الأوتوماتيكي يمكن إزالة كل الحواجز.',false,'الكتاب يقول إنه «يقلل» التعرض، لا أنه يلغي الحاجة إلى الحماية.']]})}
   ]},

  {st:8,short:'5- وسائل أخرى',title:'5- الوسائل المختلفة الأخرى <span class="ltr">(Miscellaneous Methods)</span>',ref:'ص 73',
   q:'قطعة خشب صغيرة تقترب من نهاية المنشار… بماذا تدفعها إذا لم تكن بيدك؟',
   art:SFA.art('منشار طاولة تُدفع فيه قطعة الخشب بعصا دفع',
    SFA.emb(fig423(),[0,60,300,170],[14,92,332,188])+SFA.ar(180,70,'عصا الدفع تبعد اليد',{fs:15.5,w:700})+
    SFA.hot(130,140,206,56,'منشار الطاولة: النصل يخرج من الطاولة.')+SFA.hot(56,96,80,70,'عصا الدفع ⟦Push stick⟧: «معدة مساعدة» تدفع بها القطعة فتبقى يدك بعيدة عن النصل.')),
   cap:'الجزء (أ) من الشكل <span class="ltr">(4-23)</span>.<br><b>مرّر المؤشر على المنشار والعصا (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ماذا يستخدم الكتاب في «الوسائل المختلفة الأخرى»؟',opts:[
     ['حواجز متحركة شفافة أو معدات مساعدة',true,'(ص 73) — الشكل (4-23 أ وب).'],
     ['شعاعاً ضوئياً',false,'هذا من الأجهزة.'],
     ['سياجاً حول الآلة',false,'هذا الحماية بالموقع والمسافة.']]}}
   ],
   body:[
    {book:`<p>يتم استخدام حواجز متحركة شفافة أو معدات مساعدة لمنع التعرض للمواقع الخطرة بالمعدة (الشكل 4-23 أ وب).</p>`,ref:'ص 73'},
    {html:SFA.fig(fig423(),'الشكل <span class="ltr">(4-23)</span> ص 73 — رسم مبسّط: (أ) منشار طاولة تُدفع فيه قطعة الخشب بعصا دفع <span class="ltr">(Push stick)</span>. (ب) حاجز شفاف مثبت على آلة الجلخ.',580)},
    {watch:`<p>تعليق الشكل الثاني في ص 73 مكتوب «شكل 20-4-ب»، والصواب «الشكل <span class="ltr">4-23</span>-ب» كما في الإحالة في النص.</p>`,fix:1},
    {title:'مختبر مصغّر: اختر الوسيلة',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'تنظر إلى الشغلة على آلة الجلخ وتخشى الشرر والشظايا.',opts:[['حاجز شفاف مثبت على الآلة',true,'الشكل (4-23)-ب: ترى من خلاله وهو يحميك.'],['تقرّب وجهك لترى أفضل',false,'هذا يعرّضك للشظايا المتطايرة.'],['تنزع الغطاء',false,'الأغطية يجب أن تكون في أماكنها (البند 25، ص 61).']]},
     {q:'تقطع شريحة خشب ضيقة على منشار الطاولة.',opts:[['تدفعها بأصابعك حتى النهاية',false,'في آخر القطع تقترب الأصابع من النصل.'],['تستعمل عصا الدفع',true,'«معدات مساعدة لمنع التعرض للمواقع الخطرة» — الشكل (4-23)-أ.']]}]})}
   ]},

  {st:9,short:'ضوابط حجر الجلخ',title:'ضوابط حجر الجلخ',ref:'ص 73',
   q:'كم يجب أن تكون المسافة بين المسند والحجر؟ ولماذا تتغير مع الاستعمال؟',
   art:SFA.art('حجر جلخ ومسند الشغلة والحاجز العلوي المتحرك، والمسافتان المسموحتان',
    `<path d="M80 176A100 100 0 0 1 247 102" fill="none" stroke="var(--fg)" stroke-width="10"/><path d="M80 176V276" stroke="var(--fg)" stroke-width="10"/>`+
    `<circle cx="168" cy="176" r="76" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><circle cx="168" cy="176" r="14" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+
    `<path d="M237 122L262 100" stroke="var(--on)" stroke-width="9" stroke-linecap="round"/><rect x="250" y="176" width="86" height="12" fill="var(--on-soft)" stroke="var(--on)" stroke-width="2"/><path d="M324 188V272" stroke="var(--fg)" stroke-width="6"/>`+
    `<path d="M244 196H250" stroke="var(--stop)" stroke-width="2"/>`+SFA.ar(262,216,'3 مم',{fs:15,c:'var(--stop)'})+SFA.ar(286,104,'6 مم',{fs:15,c:'var(--stop)'})+
    SFA.ar(180,62,'لا تزيد المسافتان عن',{fs:15,w:700})+SFA.ar(292,166,'مسند الشغلة',{fs:13})+SFA.ar(168,282,'حجر الجلخ',{fs:13.5})+
    SFA.hot(92,100,152,152,'حجر الجلخ: يُثبت جيداً، ويلائم الموتور في سرعة الدوران، ويُفحص من الشروخ ظاهرياً وبفحص الحلقة.')+SFA.hot(244,170,96,30,'مسند الشغلة: المسافة بينه وبين الحجر لا تزيد عن 1/8 بوصة (3 مم).')+SFA.hot(228,86,72,44,'الحاجز العلوي المتحرك: المسافة بينه وبين الحجر لا تزيد عن ¼ بوصة (6 مم).')),
   cap:'المسافتان مكبّرتان في الرسم حتى تُريا.<br><b>مرّر المؤشر على الحجر والمسند والحاجز (أو المسها في الجوال) لتعرف الضابط.</b>',
   side:[
    {predict:{q:'ما الحد الأقصى للمسافة بين مسند الشغلة وحجر الجلخ؟',opts:[
     ['¼ بوصة (6 مم)',false,'هذه مسافة الحاجز العلوي المتحرك.'],
     ['1/8 بوصة (3 مم)',true,'(ص 73).'],
     ['½ بوصة',false,'لا يذكرها الكتاب، وهي كبيرة جداً.']]}}
   ],
   body:[
    {book:`<ul><li>يجب ألا تزيد المسافة بين الجزء الذي يتم تثبيت الشغلة عليه وبين حجر الجلخ عن 1/8 بوصة (3 مم).</li><li>يجب ألا تزيد المسافة بين الحاجز العلوي المتحرك وبين حجر الجلخ عن ¼ بوصة (6 مم).</li><li>يجب تثبيت حجر الجلخ جيداً على الطاولة قبل السماح بالعمل عليها.</li><li>يجب التأكد من ملاءمة حجر الجلخ مع الموتور بحيث يكون الاثنان لهما نفس سرعة الدوران.</li><li>يجب إجراء الفحص بصفة مستمرة للتأكد من عدم وجود شروخ بحجر الجلخ ويتم ذلك بالفحص الظاهري كذلك بفحص الحلقة <span class="ltr">Ring Test</span>.</li></ul>`,ref:'ص 73'},
    {watch:`<p>هذه الضوابط جاءت في الكتاب بلا عنوان في آخر «الوسائل المختلفة الأخرى»، فوضعنا لها عنواناً. وفي ص 73 كُتب الكسر «8/1 بوصة» في اتجاه معكوس، والمقصود <span class="ltr">1/8</span> بوصة (نحو <span class="ltr">3</span> مم) كما يدل الرقم بين القوسين.</p>`,fix:1},
    {tip:`<p>إذا كانت مسافة المسند كبيرة قد تنحشر الشغلة بين المسند والحجر وتُسحب معها اليد. ومع الاستعمال <b>يتآكل الحجر</b> فيصغر قطره وتزيد المسافتان والمسند والحاجز في مكانهما؛ لذلك يُعاد ضبطهما.</p>`,title:'لماذا المسافة الصغيرة؟'},
    {title:'مختبر مصغّر: اضبط المسافتين',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك المنزلقين. الأرقام هنا أرقام تختارها أنت؛ والحدّان (3 مم و6 مم) من الكتاب.',
     ins:[{k:'a',l:'المسافة بين مسند الشغلة والحجر',min:0.5,max:12,step:0.5,v:5,u:'mm',dp:1},{k:'b',l:'المسافة بين الحاجز العلوي المتحرك والحجر',min:0.5,max:15,step:0.5,v:10,u:'mm',dp:1}],
     calc:(s,P,B)=>{const ok1=s.a<=3,ok2=s.b<=6,cx=150,cy=120,R=70,k=4;let v=`<svg viewBox="0 0 330 230" role="img" aria-label="حجر الجلخ والمسافتان" style="font-family:var(--font)"><circle cx="${cx}" cy="${cy}" r="${R}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/><circle cx="${cx}" cy="${cy}" r="10" style="fill:var(--surface);stroke:var(--fg)"/>`;
      const rx=cx+R+s.a*k;v+=`<rect x="${f1(rx)}" y="${cy}" width="80" height="10" style="fill:${ok1?'var(--on-soft)':'var(--stop-soft)'};stroke:${ok1?GRN:RED};stroke-width:1.8"/><path d="M${cx+R} ${cy+20}H${f1(rx)}" style="stroke:${ok1?GRN:RED};stroke-width:1.5"/>`;
      const ta=-40*Math.PI/180,ti=R+s.b*k;v+=`<path d="M${f1(cx+ti*Math.cos(ta))} ${f1(cy+ti*Math.sin(ta))}L${f1(cx+(ti+40)*Math.cos(ta))} ${f1(cy+(ti+40)*Math.sin(ta))}" style="stroke:${ok2?GRN:RED};stroke-width:8;stroke-linecap:round"/>`;
      if(!ok1)v+=`<rect x="${f1(cx+R+2)}" y="${cy-14}" width="${f1(Math.max(10,s.a*k+14))}" height="12" rx="3" transform="rotate(25 ${f1(cx+R+8)} ${cy-6})" style="fill:var(--live);stroke:var(--fg)"/>`;
      v+=E(rx+40,cy+36,'work rest',{fs:10,m:1})+'</svg>';
      return {pic:v,facts:[['المسند',DCML.fm(B,s.a,1)+' mm '+(ok1?'✓':'✗'),ok1?'hi':'bad'],['الحاجز العلوي',DCML.fm(B,s.b,1)+' mm '+(ok2?'✓':'✗'),ok2?'hi':'bad']],
       msg:ok1&&ok2?'<b>المسافتان ضمن الحد:</b> المسند لا يزيد عن 3 مم، والحاجز العلوي لا يزيد عن 6 مم.':[!ok1&&'مسافة المسند أكبر من 3 مم: قد تنحشر الشغلة بين المسند والحجر (البرتقالي في الرسم).',!ok2&&'مسافة الحاجز العلوي أكبر من 6 مم: قرّبه من الحجر.'].filter(Boolean).join(' '),cls:ok1&&ok2?'':'bad'}}})}
   ]},

  {st:10,short:'أسئلة الوحدة',title:'أسئلة الوحدة الرابعة',ref:'ص 74',
   q:'هل تستطيع أن تجيب عن أسئلة الكتاب دون أن ترجع إلى المحطات؟',
   art:SFA.art('ورقة أسئلة الوحدة الرابعة',
    `<rect x="110" y="62" width="140" height="200" rx="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="2.4"/><rect x="150" y="52" width="60" height="22" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+
    [96,124,152,180,208,236].map(y=>`<circle cx="232" cy="${y}" r="5" fill="var(--blue)"/><path d="M128 ${y}H218" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/>`).join('')+SFA.ar(180,292,'أسئلة مقالية',{fs:15,w:700})),
   cap:'الأسئلة في الكتاب مقالية فقط.',
   side:[
    {predict:{q:'السؤال السادس: ما العوامل التي تحدد أنسب أنواع حواجز الحماية؟ أي إجابة كاملة؟',opts:[
     ['نوع العمليات، حجم وشكل الشغلة، طريق التعامل والمناولة، موقع المعدة، نوع المواد',true,'العوامل الخمسة في ص 67.'],
     ['الحواجز والأجهزة والمسافة والتزويد والوسائل الأخرى',false,'هذه وسائل الحماية نفسها (ص 68)، لا العوامل التي تختار بينها.'],
     ['القطع والقص والسحق',false,'هذه أنواع إصابات.']]}}
   ],
   body:[
    {html:'<p>اضغط على السؤال لترى إجابة مقترحة.</p>'+qd('السؤال الأول – اذكر أربعة من تعليمات وإرشادات السلامة عند استخدام العدد اليدوية؟','(من ص 59–62) لا تستعمل أبداً عدة غير ملائمة للعمل؛ يجب فحص العدد اليدوية قبل استخدامها والتأكد من أنها سليمة؛ لا تستعمل المبارد التي ليس لها مقابض؛ للعمل في الأجهزة الكهربائية تستعمل العدد ذات المقابض المعزولة؛ لا تقم بلي خرطوم الهواء لإيقاف الهواء بل أغلق المحبس. (يكفي أربعة.)')+
   qd('السؤال الثاني – اذكر أربعة من الأخطاء في استعمال العدد اليدوية؟','(ص 62) استعمال آلات أو عدد غير مناسبة للعمل (مثل استعمال مفتاح الصواميل كمطرقة)؛ استعمال عدد يدوية تالفة (مثل أجنة برأس مفلطحة)؛ الاستعمال غير الصحيح (مثل جذب السكين في اتجاه الشخص)؛ عدم وضع العدد في أماكن مأمونة (مثل وضع السكين في الجيب بلا جراب).')+
   qd('السؤال الثالث – ما قواعد السلامة لاستخدام العدد اليدوية؟','(ص 63) استعمال العدة المناسبة من حيث الحجم والنوع؛ أن تكون المعدة بحالة جيدة بلا تلفيات؛ استعمال المعدة بالطريقة السليمة؛ تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة.')+
   qd('السؤال الرابع – اذكر مخاطر المعدات والآلات؟','(ص 63) أنواعها: مخاطر تتعلق بالمعدة نفسها (القص والتسلخات وانبعاث مواد خطرة)، ومخاطر تتعلق بموقع المعدة (ثباتها وقربها من المعدات الأخرى)، ومخاطر تتعلق بنظام العمل المصاحب (التحميل اليدوي). ومصادرها: نقاط التشغيل، ونقاط الالتقاء بين الأجزاء الدوارة.')+
   qd('السؤال الخامس – اذكر ثلاثة من أنواع الإصابات عند التعامل مع المعدات مع ذكر بعض هذه المعدات؟','(ص 64–67) القطع: المناشير والفريزة والصاروخ؛ القص: ماكينة تشكيل المعادن والمكابس؛ الاختراق والثقب: عجلة الجلخ المنكسرة والدباسات الكبيرة والمثقاب؛ الصدمات: أذرع الروبوت؛ الانحشار: الأجزاء الدوارة مع الملابس الفضفاضة؛ الاحتكاك والتسلخ: عجلة الجلخ والصنفرة؛ السحق: المكابس والرافعة المقصية. (يكفي ثلاثة.)')+
   qd('السؤال السادس – اذكر العوامل التي تحدد أنسب أنواع حواجز الحماية للمعدة؟','(ص 67) نوع العمليات، حجم وشكل الشغلة، طريقة التعامل والمناولة، موقع المعدة، نوع المواد المستخدمة.')+
   qd('السؤال السابع – اشرح وسيلة الحماية المستخدمة في المعدات والآلات والتي تستخدم','<span class="fixnote">السؤال مبتور في الكتاب (ص 74)، ينتهي عند «والتي تستخدم» بلا تكملة، فلا نعرف الوسيلة المقصودة.</span> إن كان المقصود مثلاً الوسيلة التي تستخدم الشعاع الضوئي: الخلية الكهروضوئية — شعاع ضوئي قرب منطقة الخطر، إذا قطعه أي جزء من الجسم تتوقف المعدة على الفور (ص 70). ويمكن للمدرب أن يكمل السؤال بأي وسيلة من وسائل الحماية الخمس (ص 68).')},
    {tip:`<p>حاول أن تكتب إجابتك أولاً ثم افتح الإجابة المقترحة. الإجابات المقترحة ليست من الكتاب، وعليها رقم الصفحة التي تجد فيها الإجابة.</p>`,title:'كيف تستفيد من الأسئلة؟'}
   ]},

  {recap:[
   'يحدد نوع الحماية: نوع العمليات، وحجم وشكل الشغلة، وطريق التعامل والمناولة، وموقع المعدة، ونوع المواد (ص 67).',
   'الموقع الآمن: مسافات آمنة، وإضاءة جيدة وموضعية، ودخول آمن للصيانة — الشكل (4-12).',
   'وسائل الحماية خمس: الحواجز (ثابت، بمفتاح فصل، قابل للتعديل، ذاتي التعديل)، والأجهزة (الخلية الكهروضوئية، السحب للخلف، الإيقاف المحدد، التحكم باليدين)، والموقع والمسافة، والتزويد الأوتوماتيكي، ووسائل أخرى (ص 68–73).',
   'حجر الجلخ: المسند لا يبعد أكثر من 3 مم، والحاجز العلوي لا يبعد أكثر من 6 مم، مع التثبيت وملاءمة السرعة وفحص الحلقة (ص 73).']}
],
 theory:[
  {h:'4-7 حواجز الحماية بالمعدات (Machine Safeguards)',ref:'ص 67',html:`<p>توجد طرق عديدة لتوفير وسائل الوقاية من المخاطر المحتملة من المعدات، حيث تحدد عوامل كثيرة أنسب أنواع الحماية اللازمة ومن هذه العوامل: <b>نوع العمليات، حجم وشكل الشغلة، طريق التعامل والمناولة، موقع المعدة، نوع المواد المستخدمة</b>.</p>`},
  {h:'4-7-1 موقع المعدة (Machine Layout)',ref:'ص 67–68',html:`<p>الطريقة التي يتم وضع المعدة بها في الموقع يقلل إلى حد كبير من الحوادث (الشكل 4-12)، حيث الموقع الآمن سوف يأخذ في الاعتبار ما يأتي:</p><ul><li>ترك مسافات آمنة بين المعدات المختلفة وأمام وخلف المعدة نفسها لتسهيل طرق التشغيل، الإشراف، الصيانة والتنظيف.</li><li>الإضاءة الجيدة بالموقع، كذلك الإضاءة الموضعية بالمعدة نفسها تساعد كثيرا في تقليل الحوادث.</li><li>الدخول الآمن لإجراء أعمال الصيانة.</li></ul>`},
  fig('4-12','ص 68',SIMPLE+' — «MACHINE LAYOUT»: مخرطتان متوازيتان بينهما ممر، عند كل منهما عامل بنظارة واقية، وفوق كل آلة إضاءة موضعية، وخلفهما رفوف تخزين.',fig412,540),
  {h:'4-7-2 وسائل الحماية للمعدات والآلات',ref:'ص 68',html:`<ol><li>الحواجز <span class="ltr">Guards</span></li><li>الأجهزة <span class="ltr">Devices</span></li><li>الحماية بالموقع والمسافة <span class="ltr">Location/Distance</span></li><li>تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية <span class="ltr">Feeding and Ejection Methods</span></li><li>طرق الحماية المختلفة والمتعددة <span class="ltr">Miscellaneous</span>.</li></ol>`},
  {err:'<span class="fixnote">في البند 4 (ص 68) كُتب المصطلح «Potential Feeding and Ejection .Methods»؛ كلمة Potential زائدة والنقطة قبل Methods خطأ طباعي، والمصطلح «Feeding and Ejection Methods» (طرق التغذية والإخراج)، فكتبناه هنا مصححاً.</span>'},
  {h:'1- الحواجز (Guards)',ref:'ص 68–70',html:`<p><b>أ- الحواجز الثابتة:</b> جزء ثابت يتم تثبيته فوق الأجزاء الدوارة والخطرة بالمعدة وعادة ما يكون به فتحات منتظمة للتهوية ولكن مساحة هذه الفتحات لا تسمح بوصول أي جزء من أجزاء الجسم للأجزاء الدوارة بالمعدة. يتم تثبيت هذا الحاجز بواسطة معدات يدوية خاصة بحيث لا يستطيع أي شخص فكه إلا بواسطة نفس المعدة (الشكل 4-13). يكون مزود بطريقة تسمح بتزييت المعدة بدون إزالة الحاجز.</p>`},
  fig('4-13','ص 69',SIMPLE+' — «FIXED GUARD»: محرك وبكرة يربطهما سير، والسير والبكرتان مغطاة بالكامل بغطاء شبكي مثبت على الآلة.',fig413,460),
  {html:`<p><b>ب- الحاجز المزود بمفتاح فصل (<span class="ltr">Interlock</span>):</b> في حالة فتح باب المعدة أو رفع الحاجز يقوم المفتاح بإيقاف المعدة على الفور ولا تعمل مرة أخرى إلا بإعادة الحاجز لوضعه الأصلي (الشكل 4-14).</p>`},
  fig('4-14','ص 69',SIMPLE+' — «INTERLOCKED GUARD»: مجفف ملابس دوار (Clothes Drying Tumbler) على حافة بابه مفتاح فصل.',fig414,330),
  {html:`<p><b>ج- الحاجز القابل للتعديل (<span class="ltr">Adjustable Guard</span>):</b> يمكن للعامل القيام بتعديل وضع الحاجز بحيث يغطي منطقة الخطر، مثال على ذلك المنشار الرأسي <span class="ltr">Band Saw</span> (الشكل 4-15).</p>`},
  fig('4-15','ص 70',SIMPLE+' — منشار شريطي: الواقي القابل للتعديل حول النصل (Adjustable blade guard)، وخرطوم هواء (Air hose)، وواقٍ شفاف (Transparent guard)، وقطعة الخشب (Stock)، والنصل (Blade)، والطاولة (Saw table). المصدر في الكتاب: Concepts and Techniques of Machine Safeguarding, OSHA.',fig415,470),
  {html:`<p><b>د- الحاجز ذاتي التعديل (<span class="ltr">Self-Adjusting Guard</span>):</b> هذا النوع من الحواجز يعدل نفسه بنفسه حسب حجم الشغلة بحيث يغطي منطقة الخطر على الدوام (الشكل 4-16).</p>`},
  fig('4-16','ص 70',SIMPLE+' — منشار ذراعي: المقبض (HANDLE)، والواقي حول النصل (GUARD)، وجهاز منع الارتداد (ANTI-KICKBACK DEVICE)، والنصل (BLADE).',fig416,460),
  {h:'2- الأجهزة (Devices)',ref:'ص 70–72',html:`<p><b>أ- الخلية الكهروضوئية (<span class="ltr">Photoelectric Cell</span>):</b> وجود شعاع ضوئي بالقرب من منطقة الخطر وفي حالة قطع هذا الشعاع بواسطة أي جزء من أجزاء الجسم تتوقف المعدة على الفور (المقص الكهربائي للورق) (الشكل 4-17).</p>`},
  fig('4-17','ص 71',SIMPLE+' — مكبس ثني (TRIP DEVICE) على جانبيه عمودان: مرسل ومستقبل الشعاع الضوئي (Photoelectric device) أمام منطقة العمل.',fig417,460),
  {html:`<p><b>ب- نظام السحب للخلف (<span class="ltr">Pullback System</span>):</b> يتم ربط أيدي العامل بواسطة واير ويكون الواير مربوط بنظام تشغيل المعدة بحيث عندما يكون الجزء المسبب للخطر في الوضع العلوي يمكن للعامل إدخال يديه وإجراء التعديل المطلوب، وعند بدء نزول الجزء المسبب للخطر يتم سحب أيدي العامل للخلف لإبعادها من مركز الخطر (الشكل 4-18).</p>`},
  fig('4-18','ص 71','<b>رسم توضيحي للفكرة</b> — في الكتاب ثلاث صور فوتوغرافية لعمال أمام مكابس وفي معاصمهم أساور متصلة بأسلاك.',fig418,460),
  {html:`<p><b>ج- نظام الإيقاف المحدد (<span class="ltr">Restraint System</span>):</b> في هذا النوع من أنواع الحماية يتم ربط أيدي العامل بواسطة واير بحيث يكون طول الواير لا يسمح بأي حال من الأحوال بوصول أيدي العامل لنقطة الخطر، ويتم استخدام معدات مساعدة لوضع الشغلة في مكان التشغيل (الشكل 4-19).</p>`},
  fig('4-19','ص 71','<b>رسم توضيحي للفكرة</b> — في الكتاب صورة صغيرة لعامل يداه مربوطتان يعمل على مكبس بأدوات يدوية. الخط الأحمر المتقطع = أبعد ما تصل إليه اليد.',fig419,460),
  {html:`<p><b>د- نظام التحكم بواسطة اليدين الاثنتين (<span class="ltr">Two Hand Control</span>):</b> لا يتم تشغيل المعدة إلا بواسطة الضغط على مفتاحين اثنين لضمان عدم إدخال العامل ليديه في منطقة الخطر (الشكل 4-20).</p>`},
  fig('4-20','ص 72','<b>رسم مبسّط</b> — في الكتاب صورة لعامل بنظارة يضغط بيديه في وقت واحد على زرين متباعدين على جسم الآلة.',fig420,460),
  {h:'3- الحماية بالموقع والمسافة (Safeguarding by Location/Distance)',ref:'ص 72',html:'<p>يتم إحاطة المعدة بواسطة حاجز يبعد العامل عنها، كذلك تكون لوحة التشغيل بعيدة عنها خارج الحاجز (الشكل 4-21).</p>'},
  fig('4-21','ص 72',SIMPLE+' — «DISTANCE GUARD»: روبوت صناعي يعمل داخل سياج شبكي، وأمامه خط تغذية القطع.',fig421,460),
  {h:'4- التزويد الأوتوماتيكي (Automatic Feeding)',ref:'ص 72',html:'<p>تزويد المعدة بالمواد الخام بطريقة أوتوماتيكية يقلل من تعرض العامل للمخاطر (الشكل 4-22).</p>'},
  fig('4-22','ص 72',SIMPLE+' — مكبس يدخل إليه شريط معدني من لفة عبر وحدة تغذية آلية، فلا يحتاج العامل إلى إدخال يده.',fig422,500),
  {h:'5- الوسائل المختلفة الأخرى (Miscellaneous Methods)',ref:'ص 73',html:'<p>يتم استخدام حواجز متحركة شفافة أو معدات مساعدة لمنع التعرض للمواقع الخطرة بالمعدة (الشكل 4-23 أ وب).</p>'},
  fig('4-23','ص 73',SIMPLE+' — (أ) منشار طاولة تُدفع فيه قطعة الخشب بعصا دفع (Push stick). (ب) عامل بنظارة ينظر إلى حجر جلخ عبر حاجز شفاف مثبت على الآلة.',fig423,580),
  {err:'<span class="fixnote">تعليق الشكل الثاني في ص 73 مكتوب «شكل 20-4-ب»، والصواب «الشكل 4-23-ب» كما في الإحالة في النص.</span>'},
  {h:'ضوابط حجر الجلخ',ref:'ص 73',html:`<ul><li>يجب ألا تزيد المسافة بين الجزء الذي يتم تثبيت الشغلة عليه وبين حجر الجلخ عن <b>1/8 بوصة (3 مم)</b>.</li><li>يجب ألا تزيد المسافة بين الحاجز العلوي المتحرك وبين حجر الجلخ عن <b>¼ بوصة (6 مم)</b>.</li><li>يجب تثبيت حجر الجلخ جيداً على الطاولة قبل السماح بالعمل عليها.</li><li>يجب التأكد من ملاءمة حجر الجلخ مع الموتور بحيث يكون الاثنان لهما نفس سرعة الدوران.</li><li>يجب إجراء الفحص بصفة مستمرة للتأكد من عدم وجود شروخ بحجر الجلخ ويتم ذلك بالفحص الظاهري كذلك بفحص الحلقة <span class="ltr">Ring Test</span>.</li></ul>`},
  {err:'<span class="fixnote">في ص 73 كُتب الكسر «8/1 بوصة» بالأرقام العربية في اتجاه معكوس، والمقصود 1/8 بوصة (نحو 3 مم) كما يدل الرقم بين القوسين. وهذه الضوابط جاءت في الكتاب بلا عنوان تحت «الوسائل المختلفة الأخرى»، فوضعنا لها عنواناً.</span>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في «المختبر» مكبس تجرّب عليه الحاجز المزود بمفتاح فصل والخلية الكهروضوئية والتحكم باليدين والسحب للخلف والإيقاف المحدد، وحجر جلخ تضبط فيه المسافتين (3 مم و6 مم) قبل التشغيل.'},
  {h:'أسئلة الوحدة الرابعة',ref:'ص 74',html:`<p>الأسئلة في الكتاب مقالية فقط. اضغط على السؤال لترى إجابة مقترحة.</p>`+
   qd('السؤال الأول – اذكر أربعة من تعليمات وإرشادات السلامة عند استخدام العدد اليدوية؟','(من ص 59–62) لا تستعمل أبداً عدة غير ملائمة للعمل؛ يجب فحص العدد اليدوية قبل استخدامها والتأكد من أنها سليمة؛ لا تستعمل المبارد التي ليس لها مقابض؛ للعمل في الأجهزة الكهربائية تستعمل العدد ذات المقابض المعزولة؛ لا تقم بلي خرطوم الهواء لإيقاف الهواء بل أغلق المحبس. (يكفي أربعة.)')+
   qd('السؤال الثاني – اذكر أربعة من الأخطاء في استعمال العدد اليدوية؟','(ص 62) استعمال آلات أو عدد غير مناسبة للعمل (مثل استعمال مفتاح الصواميل كمطرقة)؛ استعمال عدد يدوية تالفة (مثل أجنة برأس مفلطحة)؛ الاستعمال غير الصحيح (مثل جذب السكين في اتجاه الشخص)؛ عدم وضع العدد في أماكن مأمونة (مثل وضع السكين في الجيب بلا جراب).')+
   qd('السؤال الثالث – ما قواعد السلامة لاستخدام العدد اليدوية؟','(ص 63) استعمال العدة المناسبة من حيث الحجم والنوع؛ أن تكون المعدة بحالة جيدة بلا تلفيات؛ استعمال المعدة بالطريقة السليمة؛ تخزين المعدة بعد الاستعمال بحالة نظيفة وجيدة.')+
   qd('السؤال الرابع – اذكر مخاطر المعدات والآلات؟','(ص 63) أنواعها: مخاطر تتعلق بالمعدة نفسها (القص والتسلخات وانبعاث مواد خطرة)، ومخاطر تتعلق بموقع المعدة (ثباتها وقربها من المعدات الأخرى)، ومخاطر تتعلق بنظام العمل المصاحب (التحميل اليدوي). ومصادرها: نقاط التشغيل، ونقاط الالتقاء بين الأجزاء الدوارة.')+
   qd('السؤال الخامس – اذكر ثلاثة من أنواع الإصابات عند التعامل مع المعدات مع ذكر بعض هذه المعدات؟','(ص 64–67) القطع: المناشير والفريزة والصاروخ؛ القص: ماكينة تشكيل المعادن والمكابس؛ الاختراق والثقب: عجلة الجلخ المنكسرة والدباسات الكبيرة والمثقاب؛ الصدمات: أذرع الروبوت؛ الانحشار: الأجزاء الدوارة مع الملابس الفضفاضة؛ الاحتكاك والتسلخ: عجلة الجلخ والصنفرة؛ السحق: المكابس والرافعة المقصية. (يكفي ثلاثة.)')+
   qd('السؤال السادس – اذكر العوامل التي تحدد أنسب أنواع حواجز الحماية للمعدة؟','(ص 67) نوع العمليات، حجم وشكل الشغلة، طريقة التعامل والمناولة، موقع المعدة، نوع المواد المستخدمة.')+
   qd('السؤال السابع – اشرح وسيلة الحماية المستخدمة في المعدات والآلات والتي تستخدم','<span class="fixnote">السؤال مبتور في الكتاب (ص 74)، ينتهي عند «والتي تستخدم» بلا تكملة، فلا نعرف الوسيلة المقصودة.</span> إن كان المقصود مثلاً الوسيلة التي تستخدم الشعاع الضوئي: الخلية الكهروضوئية — شعاع ضوئي قرب منطقة الخطر، إذا قطعه أي جزء من الجسم تتوقف المعدة على الفور (ص 70). ويمكن للمدرب أن يكمل السؤال بأي وسيلة من وسائل الحماية الخمس (ص 68).')},
 ],
 lab:(el)=>pressLab(el),
 quiz:[
  {q:'ما الذي يحدث في الحاجز المزود بمفتاح فصل (Interlock) إذا فُتح الباب أثناء التشغيل؟',o:['تستمر المعدة حتى نهاية الشوط','تتوقف المعدة على الفور ولا تعمل إلا بإعادة الحاجز','يرتفع صوت إنذار فقط','تبطئ المعدة'],c:1,e:'«يقوم المفتاح بإيقاف المعدة على الفور ولا تعمل مرة أخرى إلا بإعادة الحاجز لوضعه الأصلي» (ص 69).'},
  {q:'ما الحد الأقصى للمسافة بين مسند الشغلة وحجر الجلخ؟',o:['1/8 بوصة (3 مم)','¼ بوصة (6 مم)','½ بوصة','1 بوصة'],c:0,e:'«يجب ألا تزيد المسافة بين الجزء الذي يتم تثبيت الشغلة عليه وبين حجر الجلخ عن 1/8 بوصة (3 مم)» (ص 73).'},
  {q:'ما الحد الأقصى للمسافة بين الحاجز العلوي المتحرك وحجر الجلخ؟',o:['1 مم','3 مم','6 مم','12 مم'],c:2,e:'«عن ¼ بوصة (6 مم)» (ص 73).'},
  {q:'في أي نظام يكون طول الواير لا يسمح أبداً بوصول اليد إلى نقطة الخطر؟',o:['نظام السحب للخلف','نظام الإيقاف المحدد','التحكم باليدين','الخلية الكهروضوئية'],c:1,e:'نظام الإيقاف المحدد Restraint System (ص 71).'},
  {q:'لماذا يُشغَّل بعض المعدات بالضغط على مفتاحين اثنين؟',o:['لزيادة السرعة','لضمان عدم إدخال العامل يديه في منطقة الخطر','لتوفير الكهرباء','لأن الزر الواحد يتلف بسرعة'],c:1,e:'«لضمان عدم إدخال العامل ليديه في منطقة الخطر» (ص 72).'},
  {q:'أي حاجز يعدل نفسه حسب حجم الشغلة؟',o:['الحاجز الثابت','الحاجز القابل للتعديل','الحاجز ذاتي التعديل','الحاجز المزود بمفتاح فصل'],c:2,e:'«هذا النوع من الحواجز يعدل نفسه بنفسه حسب حجم الشغلة» (ص 70، الشكل 4-16).'}
 ]
});
})(PLCBOOK);
