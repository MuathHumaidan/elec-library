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
 if(!spec.manual)place({id:'plc',w:pw,h:290,title:'الحاكم المبرمج PLC',sub:'DI / DO — 24 V DC',fill:'#e4e8e2',
  art:`<rect x="20" y="52" width="${pw-40}" height="96" rx="6" fill="#cfd6cd" stroke="#8a948c"/><rect x="20" y="180" width="${pw-40}" height="96" rx="6" fill="#cfd6cd" stroke="#8a948c"/>
   <text x="30" y="70" font-size="11" fill="#34423b" font-weight="700">المداخل</text><text x="30" y="198" font-size="11" fill="#34423b" font-weight="700">المخارج</text>`,
  switches:[{id:'RUN',lbl:'STOP / RUN',x:pw-50,y:24}],
  leds:[{id:'run',x:pw-100,y:24,r:6,color:LAMPC.green,lbl:'RUN'}].concat(spec.inAddrs.map((a,i)=>({id:'li:'+a,x:50+i*58,y:86,r:6,color:LAMPC.green}))).concat(spec.outAddrs.map((a,i)=>({id:'lq:'+a,x:166+i*58,y:216,r:6,color:LAMPC.amber}))),
  terms:tIn.map(t=>Object.assign(t,{ly:-16,col:t.col})).concat(tOut)});
 /* وحدة المداخل التناظرية والأجهزة التناظرية */
 if(spec.analog&&spec.analog.length){const A=spec.analog;
  place({id:'ai',w:Math.max(200,A.length*110+40),h:190,title:'وحدة مداخل تناظرية AI',sub:'0–10 V',fill:'#e4e8e2',
   labels:A.map((c,k)=>({t:'CH'+k+' — '+c.addr,x:70+k*110,y:62,s:10.5,b:1})),
   terms:A.flatMap((c,k)=>[{id:'AI'+k+'+',lbl:'+',x:45+k*110,y:120,pol:'+'},{id:'AI'+k+'-',lbl:'−',x:95+k*110,y:120,pol:'-'}])});
  A.forEach((c,k)=>{if(c.kind==='pot'||c.kind==='tcsim')place({id:'an'+k,w:170,h:190,title:cut(c.sym+(c.kind==='tcsim'?' — مقاومة بدل الثرموكبل':' — مقاومة متغيرة'),26),sub:c.kind==='tcsim'?'0–10 V = 0–100 °C':'تعطي 0–10 V',knobs:[{id:'AV'+k,lbl:'الجهد V',x:85,y:92,max:10,step:0.1,unit:'V',dp:1}],
     terms:[{id:'A'+k+'.+',lbl:'+',x:45,y:160,pol:'+'},{id:'A'+k+'.-',lbl:'−',x:125,y:160,pol:'-'}]});
   else place({id:'an'+k,w:150,h:190,title:cut(c.sym+' — ثرموكبل',20),sub:'نوع K داخل الغرفة',art:`<path d="M60 70V130M90 70V130" stroke="#7a5a1f" stroke-width="3"/><circle cx="75" cy="135" r="6" fill="#7a5a1f"/>`,
     terms:[{id:'A'+k+'.+',lbl:'+',x:45,y:160,pol:'+'},{id:'A'+k+'.-',lbl:'−',x:105,y:160,pol:'-'}]})})}
 nl();
 /* أجهزة الدخل */
 spec.inputs.forEach((d,i)=>{const m={id:'dev'+i,w:128,h:178,title:cut(d.sym,14),sub:cut(d.desc,22),labels:[],leds:[],switches:[]};
  const ab=d.kind==='fault'?(d.nc?['95','96']:['97','98']):d.nc?['11','12']:['13','14'];
  m.labels.push({t:(d.nc?'N.C.':'N.O.')+(d.addr?' — '+d.addr:''),x:64,y:52,s:10,c:'#5a6660'});
  if(d.kind==='co'){}
  else if(d.kind==='sensor'){m.leds.push({id:'dv'+i,x:64,y:92,r:9,color:LAMPC.green});m.labels.push({t:'حسّاس — يتغير مع الجهاز',x:64,y:120,s:9.5,c:'#5a6660'})}
  else m.switches.push({id:'SW'+i,lbl:d.kind==='push'?'اضغط':d.kind==='fault'?'فصل / إعادة':'مفتاح',x:64,y:88,push:d.kind==='push',color:d.color,init:!!d.init});
  m.terms=d.kind==='co'?[{id:'D'+i+'.c',lbl:'C',x:24,y:150},{id:'D'+i+'.x',lbl:'a',x:64,y:150},{id:'D'+i+'.y',lbl:'b',x:104,y:150}]:[{id:'D'+i+'.a',lbl:ab[0],x:34,y:150},{id:'D'+i+'.b',lbl:ab[1],x:94,y:150}];
  if(d.kind==='co'){m.labels[0].t='مفتاح تحويل C → a أو b';m.labels.push({t:'a فوق الدور، b تحته',x:64,y:120,s:9.5,c:'#5a6660'})}
  place(m)});
 /* عناصر تحكم بلا طرف (من المحاكاة) */
 if(spec.extras.length){const m={id:'ext',w:Math.max(150,spec.extras.length*110+20),h:178,title:'محاكاة أحداث',sub:'ليست أطرافاً للتوصيل',switches:spec.extras.map((e,i)=>({id:'X'+i,lbl:cut(e.lbl,14),x:65+i*110,y:92,push:e.push,color:e.color,init:!!e.init}))};place(m)}
 nl();
 /* الأحمال */
 const PW=spec.power;
 spec.outputs.forEach((d,i)=>{const lamp=d.kind==='lamp',ab=lamp?['X1','X2']:['A1','A2'];
  if(spec.relay){const aux=d.aux||[['13','14'],['23','24'],['31','32']],W2=Math.max(150,aux.length*46+30);/* تلامسات مساعدة */
   place({id:'ld'+i,w:W2,h:218,title:cut(d.sym,14),sub:cut(d.desc,26),labels:[{t:d.kind==='tof'?'مزمن تأخير فصل (5 ث)':'متمم',x:W2/2,y:52,s:10,c:'#5a6660'}],
    leds:[{id:'ld'+i,x:W2/2,y:86,r:7,color:LAMPC.amber}],
    art:aux.map((p,k)=>{const x=30+k*46;return `<path d="M${x} 140V150M${x} 168V178" stroke="#666"/>`+((d.nc||[]).includes(k)?`<path d="M${x} 150L${x+10} 168M${x} 168H${x+12}" stroke="#666"/>`:`<path d="M${x} 150L${x+10} 168" stroke="#666"/>`)+`<text x="${x+14}" y="160" font-size="9" fill="#5a6660">${(d.nc||[]).includes(k)?'NC':'NO'}</text>`}).join(''),
    terms:[{id:'L'+i+'.1',lbl:'A1',x:30,y:86},{id:'L'+i+'.2',lbl:'A2',x:W2-30,y:86}].concat(aux.flatMap((p,k)=>[{id:'R'+i+'.'+p[0],lbl:p[0],x:30+k*46,y:132,col:'#8a8f93'},{id:'R'+i+'.'+p[1],lbl:p[1],x:30+k*46,y:188,col:'#8a8f93',ly:20}]))});return}
  if(PW&&PW.cont.includes(i)){/* متمم بتلامسات رئيسة: 1-3-5 أعلى و 2-4-6 أسفل، وملفه A1/A2 */
   place({id:'ld'+i,w:170,h:250,title:cut(d.sym,14),sub:cut(d.desc,24),labels:[{t:(spec.manual?'':d.addr+' — ')+'الملف A1/A2',x:85,y:52,s:10,c:'#5a6660'}],
    art:`<rect x="20" y="138" width="130" height="70" rx="6" fill="#d7dad3" stroke="#555"/><path d="M45 160V186M85 160V186M125 160V186" stroke="#777" stroke-width="2" stroke-dasharray="3 3"/>`,
    leds:[{id:'ld'+i,x:85,y:92,r:7,color:LAMPC.amber}],
    terms:[{id:'L'+i+'.1',lbl:'A1',x:40,y:92},{id:'L'+i+'.2',lbl:'A2',x:130,y:92},
     {id:'C'+i+'.1',lbl:'1',x:45,y:150,col:'#8a8f93'},{id:'C'+i+'.3',lbl:'3',x:85,y:150,col:'#8a8f93'},{id:'C'+i+'.5',lbl:'5',x:125,y:150,col:'#8a8f93'},
     {id:'C'+i+'.2',lbl:'2',x:45,y:225,col:'#8a8f93',ly:-14},{id:'C'+i+'.4',lbl:'4',x:85,y:225,col:'#8a8f93',ly:-14},{id:'C'+i+'.6',lbl:'6',x:125,y:225,col:'#8a8f93',ly:-14}]});return}
  const art=lamp?`<circle cx="64" cy="92" r="24" fill="#d7dad3" stroke="#555"/><path d="M50 78L78 106M78 78L50 106" stroke="#666" stroke-width="2"/>`
   :`<rect x="34" y="66" width="60" height="52" rx="5" fill="#d7dad3" stroke="#555"/><text x="64" y="${d.kind==='valve'?84:84}" font-size="11" text-anchor="middle" fill="#333" font-weight="700">${d.kind==='valve'?'صمام':d.kind==='timer'?'مزمن':d.kind==='wind'?'ملف':'متمم'}</text>`;
  place({id:'ld'+i,w:128,h:178,title:cut(d.sym,14),sub:cut(d.desc,22),art,labels:[{t:spec.manual?'':d.addr,x:64,y:52,s:10,c:'#5a6660'}],
   leds:[lamp?{id:'ld'+i,x:64,y:92,r:20,color:LAMPC[d.color]||LAMPC.amber}:{id:'ld'+i,x:64,y:104,r:7,color:LAMPC.amber}],
   terms:[{id:'L'+i+'.1',lbl:ab[0],x:34,y:150},{id:'L'+i+'.2',lbl:ab[1],x:94,y:150}]})});
 nl();
 if(PW){/* دائرة القدرة */
  const G='#8a8f93';
  place({id:'qs',w:190,h:190,title:'مصدر ثلاثي الأوجه',sub:'380 V',fill:'#efe8e0',switches:[{id:'QS',lbl:'القاطع Q0',x:140,y:92}],leds:[{id:'qs',x:50,y:92,r:8,color:LAMPC.red,lbl:'جهد'}],
   terms:[{id:'L1',lbl:'L1',x:40,y:158,col:'#7a5230'},{id:'L2',lbl:'L2',x:95,y:158,col:'#222'},{id:'L3',lbl:'L3',x:150,y:158,col:'#888'}]});
  PW.ol.forEach(o=>place({id:'ol'+o,w:170,h:190,title:'الحماية الحرارية '+o,sub:'أطراف القدرة',fill:'#efe8e0',
   art:`<rect x="20" y="70" width="130" height="80" rx="6" fill="#d7dad3" stroke="#555"/>`,
   terms:[1,3,5].map((n,k)=>({id:o+'.'+n,lbl:String(n),x:45+k*40,y:80,col:G,ly:-14})).concat([2,4,6].map((n,k)=>({id:o+'.'+n,lbl:String(n),x:45+k*40,y:160,col:G,ly:-14})))}));
  (PW.res||[]).forEach(r=>place({id:'rs'+r,w:150,h:190,title:'مقاومات '+r,sub:'ثلاث مقاومات متساوية',fill:'#efe8e0',
   art:[0,1,2].map(k=>`<rect x="${35+k*40}" y="92" width="0" height="0"/><rect x="${27+k*40}" y="92" width="16" height="44" rx="2" fill="#d9b26f" stroke="#7a5a1f"/>`).join(''),
   terms:[0,1,2].map(k=>({id:r+'.'+'abc'[k]+'1',lbl:'abc'[k]+'1',x:35+k*40,y:72,col:G,ly:-14})).concat([0,1,2].map(k=>({id:r+'.'+'abc'[k]+'2',lbl:'abc'[k]+'2',x:35+k*40,y:160,col:G,ly:-14})))}));
  const mt=PW.motor,cols=Math.max(...mt.rows.map(r=>r.length));
  place({id:'mot',w:Math.max(220,cols*52+60),h:190+(mt.rows.length>2?70:0),title:mt.title,sub:'',labels:[{t:mt.sub,x:Math.max(220,cols*52+60)/2,y:178,s:9.5,c:'#4b5a52'}],fill:'#e6ece8',
   art:`<circle cx="30" cy="40" r="16" fill="#5c6b73" stroke="#333"/><text x="30" y="44" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">M</text>`,
   terms:mt.rows.flatMap((row,ri)=>row.map((t,k)=>({id:'M.'+t,lbl:t,x:40+k*52,y:84+ri*62,col:G,ly:-14})))});
  nl()}
 return {w:W,h:y,generic:true,modules:mods,bridges}};
L.LAMPC=LAMPC;
})();
