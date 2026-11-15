/* «المنضدة الافتراضية» — شكل لوحة الـ PLC (عام حتى تصل صور لوحة الكلية).
   BENCH_LAYOUTS.plc(spec) يبني اللوحة من جدول المداخل والمخارج للدرس:
   spec={inputs:[{key,sym,desc,addr,kind,nc,color}],outputs:[{key,sym,desc,addr,kind,color}],extras:[{id,lbl,push,color}],inAddrs,outAddrs}
   الأطراف: P+ P- (مصدر 24 V) — Ixx.y و IM (مداخل الـ PLC ومشتركها) — Qxx.y و QL و QM (المخارج وتغذيتها)
            D<n>.a / D<n>.b (تلامس جهاز الدخل) — L<n>.1 / L<n>.2 (طرفا الحمل). */
(function(){
const L=window.BENCH_LAYOUTS=window.BENCH_LAYOUTS||{};
const W=1240,GAP=14,cut=(s,n)=>{s=String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s};
const LAMPC={green:'#3ad16b',red:'#ff4a3a',yellow:'#ffd23a',amber:'#ffb000',blue:'#4aa3ff',white:'#fff7d6'};
L.plc=function(spec){const mods=[];let x=20,y=20,rowH=0;
 const place=(m)=>{if(x+m.w>W-20){x=20;y+=rowH+GAP;rowH=0}m.x=x;m.y=y;x+=m.w+GAP;rowH=Math.max(rowH,m.h);mods.push(m)};
 const nl=()=>{if(x>20){x=20;y+=rowH+GAP;rowH=0}};
 /* المصدر */
 const nb=Math.min(12,Math.max(4,spec.inputs.length+2)),nz=Math.min(12,Math.max(4,spec.outputs.length+3)),bw=Math.max(nb,nz)*34+40,bridges=[];
 place({id:'psu',w:150,h:190,title:'مصدر التغذية',sub:'24 V DC',switches:[{id:'PWR',lbl:'تشغيل / إيقاف',x:100,y:92}],
  leds:[{id:'pwr',x:40,y:92,r:8,color:LAMPC.green,lbl:'POWER'}],
  terms:[{id:'P+',lbl:'+24 V',x:40,y:158,pol:'+'},{id:'P-',lbl:'0 V',x:110,y:158,pol:'-'}]});
 /* قضيبا توزيع: كل أطراف القضيب الواحد موصولة داخلياً */
 const tb=[];for(let k=0;k<nb;k++){tb.push({id:'B+'+k,lbl:'+',x:30+k*34,y:80,pol:'+',ly:-14});if(k)bridges.push(['B+0','B+'+k])}
 for(let k=0;k<nz;k++){tb.push({id:'B-'+k,lbl:'−',x:30+k*34,y:150,pol:'-',ly:-14});if(k)bridges.push(['B-0','B-'+k])}
 place({id:'bus',w:bw,h:190,title:'قضيبا التوزيع',sub:'أطراف كل قضيب موصولة ببعضها من الداخل',
  art:`<rect x="14" y="70" width="${bw-28}" height="20" rx="4" fill="#e7b3ad"/><rect x="14" y="140" width="${bw-28}" height="20" rx="4" fill="#b9bdb8"/>`,terms:tb});
 /* الـ PLC */
 const nIn=spec.inAddrs.length+1,nOut=spec.outAddrs.length+2,cols=Math.max(nIn,nOut,6),pw=Math.min(W-260,cols*58+60);
 const tIn=spec.inAddrs.map((a,i)=>({id:a,lbl:a,x:50+i*58,y:120,col:'#C9A227'})).concat([{id:'IM',lbl:'1M',x:50+spec.inAddrs.length*58,y:120,pol:'-'}]);
 const tOut=[{id:'QL',lbl:'2L+',x:50,y:250,pol:'+'},{id:'QM',lbl:'2M',x:108,y:250,pol:'-'}].concat(spec.outAddrs.map((a,i)=>({id:a,lbl:a,x:166+i*58,y:250,col:'#C9A227'})));
 place({id:'plc',w:pw,h:290,title:'الحاكم المبرمج PLC',sub:'DI / DO — 24 V DC',fill:'#e4e8e2',
  art:`<rect x="20" y="52" width="${pw-40}" height="96" rx="6" fill="#cfd6cd" stroke="#8a948c"/><rect x="20" y="180" width="${pw-40}" height="96" rx="6" fill="#cfd6cd" stroke="#8a948c"/>
   <text x="30" y="70" font-size="11" fill="#34423b" font-weight="700">المداخل</text><text x="30" y="198" font-size="11" fill="#34423b" font-weight="700">المخارج</text>`,
  switches:[{id:'RUN',lbl:'STOP / RUN',x:pw-50,y:24}],
  leds:[{id:'run',x:pw-100,y:24,r:6,color:LAMPC.green,lbl:'RUN'}].concat(spec.inAddrs.map((a,i)=>({id:'li:'+a,x:50+i*58,y:86,r:6,color:LAMPC.green}))).concat(spec.outAddrs.map((a,i)=>({id:'lq:'+a,x:166+i*58,y:216,r:6,color:LAMPC.amber}))),
  terms:tIn.map(t=>Object.assign(t,{ly:-16,col:t.col})).concat(tOut)});
 nl();
 /* أجهزة الدخل */
 spec.inputs.forEach((d,i)=>{const m={id:'dev'+i,w:128,h:178,title:cut(d.sym,14),sub:cut(d.desc,22),labels:[],leds:[],switches:[]};
  const ab=d.kind==='fault'?(d.nc?['95','96']:['97','98']):d.nc?['11','12']:['13','14'];
  m.labels.push({t:(d.nc?'N.C.':'N.O.')+' — '+d.addr,x:64,y:52,s:10,c:'#5a6660'});
  if(d.kind==='sensor'){m.leds.push({id:'dv'+i,x:64,y:92,r:9,color:LAMPC.green});m.labels.push({t:'حسّاس — يتغير مع الجهاز',x:64,y:120,s:9.5,c:'#5a6660'})}
  else m.switches.push({id:'SW'+i,lbl:d.kind==='push'?'اضغط':d.kind==='fault'?'فصل / إعادة':'مفتاح',x:64,y:88,push:d.kind==='push',color:d.color,init:!!d.init});
  m.terms=[{id:'D'+i+'.a',lbl:ab[0],x:34,y:150},{id:'D'+i+'.b',lbl:ab[1],x:94,y:150}];place(m)});
 /* عناصر تحكم بلا طرف (من المحاكاة) */
 if(spec.extras.length){const m={id:'ext',w:Math.max(150,spec.extras.length*110+20),h:178,title:'محاكاة أحداث',sub:'ليست أطرافاً للتوصيل',switches:spec.extras.map((e,i)=>({id:'X'+i,lbl:cut(e.lbl,14),x:65+i*110,y:92,push:e.push,color:e.color,init:!!e.init}))};place(m)}
 nl();
 /* الأحمال */
 spec.outputs.forEach((d,i)=>{const lamp=d.kind==='lamp',ab=lamp?['X1','X2']:['A1','A2'];
  const art=lamp?`<circle cx="64" cy="92" r="24" fill="#d7dad3" stroke="#555"/><path d="M50 78L78 106M78 78L50 106" stroke="#666" stroke-width="2"/>`
   :`<rect x="34" y="66" width="60" height="52" rx="5" fill="#d7dad3" stroke="#555"/><text x="64" y="${d.kind==='valve'?84:84}" font-size="11" text-anchor="middle" fill="#333" font-weight="700">${d.kind==='valve'?'صمام':'متمم'}</text>`;
  place({id:'ld'+i,w:128,h:178,title:cut(d.sym,14),sub:cut(d.desc,22),art,labels:[{t:d.addr,x:64,y:52,s:10,c:'#5a6660'}],
   leds:[lamp?{id:'ld'+i,x:64,y:92,r:20,color:LAMPC[d.color]||LAMPC.amber}:{id:'ld'+i,x:64,y:104,r:7,color:LAMPC.amber}],
   terms:[{id:'L'+i+'.1',lbl:ab[0],x:34,y:150},{id:'L'+i+'.2',lbl:ab[1],x:94,y:150}]})});
 nl();
 return {w:W,h:y,generic:true,modules:mods,bridges}};
L.LAMPC=LAMPC;
})();
