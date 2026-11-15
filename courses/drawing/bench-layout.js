/* «المنضدة الافتراضية» — شكل لوحة التمديدات (عام حتى تصل صور لوحة الكلية).
   BENCH_LAYOUTS.inst(spec): لوحة تغذية (L1 L2 N PE بقضبان) + الأجزاء spec.parts بالترتيب.
   الأطراف: L1.k L2.k N.k PE.k (k=0..3، كل قضيب موصول من الداخل) — <id>.<طرف> لكل جزء. */
(function(){
const L=window.BENCH_LAYOUTS=window.BENCH_LAYOUTS||{};
const W=1240,GAP=14,cut=(s,n)=>{s=String(s||'').replace(/<[^>]+>/g,'').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const COL={L1:'#7a5230',L2:'#222',N:'#2457b5',PE:'#3a9a4a'},G='#C9A227';
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
 fuse:p=>({w:128,h:178,sub:'مصهر',art:`<rect x="44" y="74" width="40" height="22" rx="4" fill="#eee" stroke="#555"/>`,terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 bell:p=>({w:128,h:178,sub:'جرس '+p.v+' V',art:`<path d="M44 96a20 20 0 0 1 40 0z" fill="#d7dad3" stroke="#555"/>`,leds:[{id:'ld:'+p.id,x:64,y:84,r:8,color:'#ffb000'}],terms:[T(p.id+'.1','1',34,150),T(p.id+'.2','2',94,150)]}),
 xf:p=>({w:170,h:178,sub:'محول الجرس '+p.vp+'/'+p.vs+' V',art:`<rect x="60" y="62" width="50" height="60" rx="4" fill="#d7dad3" stroke="#555"/>`,terms:[T(p.id+'.P1','P1',30,72),T(p.id+'.P2','P2',30,128),T(p.id+'.S1','S1',140,72),T(p.id+'.S2','S2',140,128)]}),
 ks:p=>({w:170,h:178,sub:'مفتاح صدمة التيار',leds:[{id:'ld:'+p.id,x:85,y:70,r:7,color:'#ffb000',lbl:'التلامس 1–2'}],terms:[T(p.id+'.A1','A1',30,110),T(p.id+'.A2','A2',30,150),T(p.id+'.1','1',140,110),T(p.id+'.2','2',140,150)]}),
 tmr:p=>({w:190,h:178,sub:'مزمن الإضاءة',leds:[{id:'ld:'+p.id,x:95,y:70,r:7,color:'#ffb000',lbl:'التلامس 2–3'}],terms:[T(p.id+'.1','1',30,110),T(p.id+'.2','2',30,150),T(p.id+'.3','3',160,110),T(p.id+'.7','7',160,150)]})
};
L.inst=function(spec){const mods=[],bridges=[];let x=20,y=20,rowH=0;
 const place=m=>{if(x+m.w>W-20){x=20;y+=rowH+GAP;rowH=0}m.x=x;m.y=y;x+=m.w+GAP;rowH=Math.max(rowH,m.h);mods.push(m);(m.bridges||[]).forEach(b=>bridges.push(b))};
 /* لوحة التغذية */
 const conds=['L1','L2','N','PE'],nk=4,bw=nk*34+90;const tb=[];
 conds.forEach((c,ci)=>{for(let k=0;k<nk;k++){tb.push({id:c+'.'+k,lbl:k?'':c,x:70+k*34,y:62+ci*34,col:COL[c],ly:k?-14:0});if(k)bridges.push([c+'.0',c+'.'+k])}});
 tb.forEach(t=>{if(!t.ly){t.ly=4;t.lbl='';}});
 place({id:'sup',w:bw+120,h:200,title:'لوحة التغذية',sub:'127 / 220 V — 60 Hz',fill:'#efe8e0',
  labels:conds.map((c,ci)=>({t:c,x:40,y:66+ci*34,s:12,b:1,c:COL[c]})),
  art:conds.map((c,ci)=>`<rect x="58" y="${54+ci*34}" width="${nk*34}" height="16" rx="4" fill="${COL[c]}" opacity=".25"/>`).join(''),
  switches:[{id:'QS',lbl:'القاطع الرئيسي',x:bw+60,y:96}],leds:[{id:'qs',x:bw+60,y:56,r:7,color:'#ff4a3a'}],terms:tb});
 spec.parts.forEach(p=>{const m=PART[p.kind](p);m.id='p_'+p.id;m.title=cut(p.lbl||p.id,16);place(m)});
 if(x>20)y+=rowH+GAP;
 return {w:W,h:y,generic:true,modules:mods,bridges}};
})();
