/* «المنضدة الافتراضية» — شكل لوحة التمديدات (عام حتى تصل صور لوحة الكلية).
   BENCH_LAYOUTS.inst(spec): لوحة تغذية (L1 L2 N PE بقضبان) + الأجزاء spec.parts بالترتيب.
   الأطراف: L1.k L2.k N.k PE.k (k=0..3، كل قضيب موصول من الداخل) — <id>.<طرف> لكل جزء. */
(function(){
const L=window.BENCH_LAYOUTS=window.BENCH_LAYOUTS||{};
const W=1240,GAP=14,cut=(s,n)=>{s=String(s||'').replace(/<[^>]+>/g,'').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const COL={L1:'#7a5230',L2:'#222',L3:'#888',N:'#2457b5',PE:'#3a9a4a',P:'#c8382e',M:'#222'},G='#C9A227';
const T=(id,lbl,x,y,o)=>Object.assign({id,lbl,x,y,col:G},o||{});
const PART={
 sw:p=>({w:128,h:178,sub:'مفتاح مفرد',switches:[{id:'SW:'+p.id,lbl:'تشغيل / إطفاء',x:64,y:86}],terms:[T(p.id+'.L','L',34,150),T(p.id+'.1','1',94,150)]}),
 sw2:p=>({w:170,h:178,sub:'مفتاح مزدوج',switches:[{id:'SW:'+p.id+':1',lbl:'الذراع 1',x:50,y:86},{id:'SW:'+p.id+':2',lbl:'الذراع 2',x:120,y:86}],terms:[T(p.id+'.L','L',30,150),T(p.id+'.1','1',85,150),T(p.id+'.2','2',140,150)]}),
 tw:p=>({w:150,h:178,sub:'مفتاح ذو اتجاهين',switches:[{id:'SW:'+p.id,lbl:'الوضع 1 / 2',x:75,y:86}],terms:[T(p.id+'.C','C',30,150),T(p.id+'.1','1',75,150),T(p.id+'.2','2',120,150)]}),
 im:p=>({w:170,h:214,sub:'مفتاح وسطي',switches:[{id:'SW:'+p.id,lbl:'مستقيم / متصالب',x:85,y:80}],labels:[{t:'مستقيم: 1–3 و 2–4',x:85,y:128,s:9.5,c:'#5a6660'}],terms:[T(p.id+'.1','1',40,150),T(p.id+'.2','2',130,150),T(p.id+'.3','3',40,186,{ly:16}),T(p.id+'.4','4',130,186,{ly:16})]}),
 pb:p=>({w:128,h:178,sub:'ضاغط',switches:[{id:'SW:'+p.id,lbl:'اضغط',x:64,y:84,push:true,color:p.color||'black'}],terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 lamp:p=>({w:128,h:178,sub:'مصباح '+p.v+' V',art:`<circle cx="64" cy="84" r="24" fill="#d7dad3" stroke="#555"/><path d="M50 70L78 98M78 70L50 98" stroke="#666" stroke-width="2"/>`,
  leds:[{id:'ld:'+p.id,x:64,y:84,r:20,color:'#ffd23a'}],terms:[T(p.id+'.L','L',30,150),T(p.id+'.N','N',p.pe?64:98,150)].concat(p.pe?[T(p.id+'.PE','PE',98,150,{col:COL.PE})]:[])}),
 jb:p=>({w:170,h:178,sub:'كل مجموعة موصولة داخلياً',art:['a','b','c'].map((k,j)=>`<rect x="${14+j*50}" y="84" width="44" height="78" rx="6" fill="#d7dad3" stroke="#888"/>`).join(''),
  terms:['a','b','c'].flatMap((k,j)=>[0,1,2].map(n=>T(p.id+'.'+k+n,n?'':k,36+j*50,102+n*26,{ly:-14,col:'#8a8f93'}))),bridges:['a','b','c'].flatMap(k=>[[p.id+'.'+k+'0',p.id+'.'+k+'1'],[p.id+'.'+k+'0',p.id+'.'+k+'2']])}),
 bal:p=>({w:128,h:178,sub:'الملف الخانق',art:`<path d="M30 90q8-16 16 0t16 0t16 0t16 0" fill="none" stroke="#555" stroke-width="3"/>`,terms:[T(p.id+'.1','1',30,150),T(p.id+'.2','2',98,150)]}),
 st:p=>({w:128,h:178,sub:'البادئ',art:`<circle cx="64" cy="88" r="18" fill="#e8e0f0" stroke="#555"/>`,leds:[{id:'ld:'+p.id,x:64,y:88,r:8,color:'#c38bff'}],terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 tube:p=>({w:260,h:178,sub:'أنبوبة الفلورسنت (فتيلة في كل طرف)',art:`<rect x="30" y="74" width="200" height="26" rx="13" fill="#eef" stroke="#555"/>`,leds:[{id:'ld:'+p.id,x:130,y:87,r:10,color:'#e8f4ff'}],
  terms:[T(p.id+'.a1','a1',30,140),T(p.id+'.a2','a2',70,140),T(p.id+'.b1','b1',190,140),T(p.id+'.b2','b2',230,140)]}),
 meter:p=>({w:170,h:178,sub:'العداد (أطرافه كما في الكتاب)',art:`<rect x="30" y="58" width="110" height="56" rx="6" fill="#f4f1e6" stroke="#555"/><circle cx="85" cy="100" r="9" fill="#bbb" stroke="#555"/>`,
  leds:[{id:'ld:'+p.id,x:85,y:100,r:7,color:'#ff9a3a'}],terms:[T(p.id+'.R','يمين',140,150),T(p.id+'.M','وسط',85,150),T(p.id+'.F','يسار',30,150)]}),
 fuse:p=>({w:128,h:178,sub:'مصهر'+(p.A?' '+p.A+' A':''),leds:p.A?[{id:'tr:'+p.id,x:104,y:60,r:5,color:'#ff4a3a'}]:[],art:`<rect x="44" y="74" width="40" height="22" rx="4" fill="#eee" stroke="#555"/>`,terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 bell:p=>({w:128,h:178,sub:'جرس '+p.v+' V',art:`<path d="M44 96a20 20 0 0 1 40 0z" fill="#d7dad3" stroke="#555"/>`,leds:[{id:'ld:'+p.id,x:64,y:84,r:8,color:'#ffb000'}],terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 xf:p=>({w:170,h:178,sub:'محول الجرس '+p.vp+'/'+p.vs+' V',art:`<rect x="60" y="62" width="50" height="60" rx="4" fill="#d7dad3" stroke="#555"/>`,terms:[T(p.id+'.P1','P1',30,72),T(p.id+'.P2','P2',30,128),T(p.id+'.S1','S1',140,72),T(p.id+'.S2','S2',140,128)]}),
 ks:p=>({w:170,h:178,sub:'مفتاح صدمة التيار',leds:[{id:'ld:'+p.id,x:85,y:70,r:7,color:'#ffb000',lbl:'التلامس 1–2'}],terms:[T(p.id+'.A1','A1',30,110),T(p.id+'.A2','A2',30,150),T(p.id+'.1','1',140,110),T(p.id+'.2','2',140,150)]}),
 qs3:p=>({w:200,h:200,sub:'مفتاح رئيسي '+(p.n?'4':'3')+' أقطاب',switches:[{id:'SW:'+p.id,lbl:'تشغيل / فصل',x:100,y:100}],
  terms:(p.n?['L1','L2','L3','N']:['L1','L2','L3']).flatMap((c,k,a)=>[T(p.id+'.'+c+'i',c,30+k*(140/(a.length-1)),62),T(p.id+'.'+c+'o',c,30+k*(140/(a.length-1)),170,{ly:16})])}),
 mcb:p=>({w:110,h:200,sub:'قاطع '+p.A+' A',switches:[{id:'SW:'+p.id,lbl:'',x:55,y:104,init:p.init}],leds:[{id:'tr:'+p.id,x:90,y:104,r:5,color:'#ff4a3a'}],terms:[T(p.id+'.i','دخل',55,72),T(p.id+'.o','خرج',55,170,{ly:16})]}),
 mcb3:p=>({w:170,h:200,sub:'قاطع 3 أقطاب '+p.A+' A',switches:[{id:'SW:'+p.id,lbl:'',x:85,y:104,init:p.init}],leds:[{id:'tr:'+p.id,x:150,y:104,r:5,color:'#ff4a3a'}],terms:[1,2,3].flatMap(k=>[T(p.id+'.'+k+'i',''+k,30+(k-1)*55,62),T(p.id+'.'+k+'o',''+k,30+(k-1)*55,170,{ly:16})])}),
 fuse3:p=>({w:170,h:200,sub:'مصاهر '+p.A+' A',art:[0,1,2].map(k=>`<rect x="${20+k*55}" y="94" width="20" height="36" rx="4" fill="#eee" stroke="#555"/>`).join(''),leds:[{id:'tr:'+p.id,x:150,y:140,r:5,color:'#ff4a3a'}],terms:[1,2,3].flatMap(k=>[T(p.id+'.'+k+'i',''+k,30+(k-1)*55,62),T(p.id+'.'+k+'o',''+k,30+(k-1)*55,170,{ly:16})])}),
 bus:p=>{const cs=p.conds||['L1','L2','L3','N','PE'];return {w:220,h:cs.length*30+50,sub:'قضبان التوزيع (كل قضيب موصول من الداخل)',art:cs.map((c,i)=>`<rect x="40" y="${42+i*30}" width="170" height="14" rx="4" fill="${COL[c]}" opacity=".25"/>`).join(''),
  labels:cs.map((c,i)=>({t:c,x:24,y:53+i*30,s:11,b:1,c:COL[c]})),terms:cs.flatMap((c,i)=>[0,1,2,3,4].map(k=>T(p.id+'.'+c+k,'',56+k*36,49+i*30,{col:COL[c],ly:0}))),bridges:cs.flatMap(c=>[1,2,3,4].map(k=>[p.id+'.'+c+'0',p.id+'.'+c+k]))}},
 mot3:p=>({w:170,h:200,sub:'محرك ثلاثي الأوجه '+p.P+' kW',switches:p.ctl?[{id:'SW:'+p.id,lbl:'تشغيل',x:34,y:92}]:[],art:`<circle cx="105" cy="96" r="26" fill="#5c6b73" stroke="#333"/><text x="105" y="101" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">M 3~</text>`,leds:[{id:'ld:'+p.id,x:140,y:62,r:6,color:'#3ad16b',lbl:'يدور'}],
  terms:['U','V','W','PE'].map((c,k)=>T(p.id+'.'+c,c,25+k*40,170,{col:c==='PE'?COL.PE:G}))}),
 heat:p=>({w:150,h:200,sub:(p.three?'حمل ثلاثي ':'')+p.P+' kW',switches:p.ctl?[{id:'SW:'+p.id,lbl:'تشغيل الحمل',x:75,y:80}]:[],art:p.ctl?'':`<path d="M40 90h70" stroke="#c8382e" stroke-width="6" stroke-dasharray="6 4"/>`,leds:[{id:'ld:'+p.id,x:75,y:126,r:7,color:'#ff7a3a'}],
  terms:(p.three?['U','V','W']:['L','N']).concat(p.pe?['PE']:[]).map((c,k,a)=>T(p.id+'.'+c,c,25+k*(100/(a.length-1)),170,{col:c==='PE'?COL.PE:G}))}),
 sock:p=>({w:150,h:200,sub:'مقبس — جهاز '+p.P+' kW',art:`<rect x="45" y="56" width="60" height="44" rx="8" fill="#eee" stroke="#555"/><circle cx="62" cy="78" r="5" fill="#555"/><circle cx="88" cy="78" r="5" fill="#555"/>`,switches:[{id:'SW:'+p.id,lbl:'شغّل الجهاز',x:75,y:126}],leds:[{id:'ld:'+p.id,x:125,y:62,r:6,color:'#3ad16b'}],
  terms:['L','N','PE'].map((c,k)=>T(p.id+'.'+c,c,25+k*50,180,{col:c==='PE'?COL.PE:G,ly:-14}))}),
 dcm:p=>({w:200,h:200,sub:'محرك تيار مستمر توازٍ',art:`<circle cx="100" cy="92" r="28" fill="#5c6b73" stroke="#333"/><text x="100" y="97" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">M =</text>`,leds:[{id:'ld:'+p.id,x:170,y:62,r:6,color:'#3ad16b',lbl:'يدور'}],
  terms:[T(p.id+'.A1','A1',30,170),T(p.id+'.A2','A2',75,170),T(p.id+'.E1','E1',125,170),T(p.id+'.E2','E2',170,170)]}),
 rh:p=>({w:150,h:200,sub:p.sub||('0–'+p.max+' Ω'),knobs:[{id:'K:'+p.id,lbl:p.klbl||'المقاومة',x:75,y:96,min:0,max:p.max,init:p.init!=null?p.init:p.max,unit:'Ω',step:p.step||1}],terms:[T(p.id+'.1','1',35,170),T(p.id+'.2','2',115,170)]}),
 im3:p=>({w:200,h:220,sub:'محرك حثي — لوحة الأطراف',art:`<circle cx="182" cy="135" r="13" fill="#5c6b73"/><text x="182" y="139" font-size="9" text-anchor="middle" fill="#fff">M3~</text>`,leds:[{id:'ld:'+p.id,x:30,y:44,r:6,color:'#3ad16b',lbl:'يدور'}],
  terms:[['U1','V1','W1'],['W2','U2','V2']].flatMap((r,ri)=>r.map((c,k)=>T(p.id+'.'+c,c,45+k*55,100+ri*70)))}),
 yd:p=>({w:230,h:220,sub:'مفتاح نجمة / مثلث يدوي',knobs:[{id:'K:'+p.id,lbl:'0 — Y — Δ',x:200,y:60,min:0,max:2,init:0,step:1,unit:'',r:20}],
  terms:['L1','L2','L3'].map((c,k)=>T(p.id+'.'+c,c,30+k*50,62)).concat(['U1','V1','W1','U2','V2','W2'].map((c,k)=>T(p.id+'.'+c,c,25+k*36,180,{ly:16})))}),
 rs3:p=>({w:190,h:210,sub:'مقاومات بدء + مفتاح تقصير',switches:[{id:'SW:'+p.id,lbl:'تقصير المقاومات',x:95,y:110}],art:[0,1,2].map(k=>`<rect x="${25+k*55}" y="70" width="18" height="24" rx="2" fill="#d9b26f" stroke="#7a5a1f"/>`).join(''),
  terms:[1,2,3].flatMap(k=>[T(p.id+'.'+k+'i',''+k,34+(k-1)*55,56),T(p.id+'.'+k+'o',''+k,34+(k-1)*55,176,{ly:16})])}),
 wrm:p=>({w:220,h:220,sub:'محرك حلقات انزلاق',leds:[{id:'ld:'+p.id,x:30,y:44,r:6,color:'#3ad16b',lbl:'يدور'}],terms:['U','V','W'].map((c,k)=>T(p.id+'.'+c,c,45+k*60,100)).concat(['K','L','M'].map((c,k)=>T(p.id+'.'+c,c,45+k*60,170)))}),
 rst:p=>({w:200,h:200,sub:'بادئ العضو الدوار (مقاومات بنجمة)',knobs:[{id:'K:'+p.id,lbl:'الذراع 1 — 4',x:150,y:90,min:1,max:4,init:1,step:1,unit:''}],terms:['K','L','M'].map((c,k)=>T(p.id+'.'+c,c,30+k*45,170))}),
 tmr:p=>({w:190,h:178,sub:'مزمن الإضاءة',leds:[{id:'ld:'+p.id,x:95,y:70,r:7,color:'#ffb000',lbl:'التلامس 2–3'}],terms:[T(p.id+'.1','1',30,110),T(p.id+'.2','2',30,150),T(p.id+'.3','3',160,110),T(p.id+'.7','7',160,150)]})
};
L.inst=function(spec){const mods=[],bridges=[];let x=20,y=20,rowH=0;
 const place=m=>{if(x+m.w>W-20){x=20;y+=rowH+GAP;rowH=0}m.x=x;m.y=y;x+=m.w+GAP;rowH=Math.max(rowH,m.h);mods.push(m);(m.bridges||[]).forEach(b=>bridges.push(b))};
 /* لوحة التغذية */
 const conds=spec.dc?['P','M']:(spec.conds||['L1','L2','N','PE']),nk=4,bw=nk*34+90;const tb=[];
 conds.forEach((c,ci)=>{for(let k=0;k<nk;k++){tb.push({id:c+'.'+k,lbl:k?'':c,x:70+k*34,y:62+ci*34,col:COL[c],ly:k?-14:0});if(k)bridges.push([c+'.0',c+'.'+k])}});
 tb.forEach(t=>{if(!t.ly){t.ly=4;t.lbl='';}});
 place({id:'sup',w:bw+120,h:Math.max(200,conds.length*34+64),title:'لوحة التغذية',sub:spec.dc?'تيار مستمر '+(spec.vdc||220)+' V':(spec.vph===220?'380 / 220 V — 60 Hz':'127 / 220 V — 60 Hz'),fill:'#efe8e0',
  labels:conds.map((c,ci)=>({t:c==='P'?'+':c==='M'?'−':c,x:40,y:66+ci*34,s:12,b:1,c:COL[c]})),
  art:conds.map((c,ci)=>`<rect x="58" y="${54+ci*34}" width="${nk*34}" height="16" rx="4" fill="${COL[c]}" opacity=".25"/>`).join(''),
  switches:[{id:'QS',lbl:'القاطع الرئيسي',x:bw+60,y:96}],leds:[{id:'qs',x:bw+60,y:56,r:7,color:'#ff4a3a'}],terms:tb});
 spec.parts.forEach(p=>{const m=PART[p.kind](p);m.id='p_'+p.id;m.title=cut(p.lbl||p.id,16);place(m)});
 if(x>20)y+=rowH+GAP;
 return {w:W,h:y,generic:true,modules:mods,bridges}};
})();
