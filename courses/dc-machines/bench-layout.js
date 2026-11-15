/* «المنضدة الافتراضية» — شكل المنضدات فقط (المواضع والأسماء والرسم)، بلا كهرباء ولا خطوات.
   الشكل الحالي عام: وحدات معمل الآلات بالترتيب المعتاد وبأسماء أطراف الكتاب.
   لمطابقة منضدة الكلية: يُستبدل هذا الملف وحده بنفس معرّفات الأطراف والمقابض والأجهزة، والتجارب لا تتغير.
   كل تجربة تختار وحداتها: BENCH_LAYOUTS.build({rows:[[[نوع,خيارات],…],…], machines:{left,right}}) */
(function(B){
const L=window.BENCH_LAYOUTS=window.BENCH_LAYOUTS||{};
const machBody=(lbl,sub,mirror)=>{const g=`<g transform="translate(70 150)"><rect x="0" y="20" width="250" height="150" rx="20" fill="#6E7F86" stroke="#3b474c" stroke-width="2"/>
  ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${18+i*28}" y="14" width="12" height="162" rx="4" fill="#5d6c72"/>`).join('')}
  <rect x="250" y="80" width="70" height="30" fill="#9aa5a9" stroke="#3b474c"/></g>`;
  return (mirror?`<g transform="translate(490 0) scale(-1 1)">${g}</g>`:g)+`<text x="${mirror?295:195}" y="255" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${lbl}</text><text x="${mirror?295:195}" y="280" font-size="12" fill="#e8eef0" text-anchor="middle">${sub}</text>`};
const plate=groups=>{let x=40,s='';groups.forEach(g=>{const w=g.n*60+20;s+=`<rect x="${x}" y="48" width="${w}" height="72" rx="8" fill="#20262a" stroke="#0d1012"/><text x="${x+w/2}" y="64" font-size="11" fill="#cfd6d9" text-anchor="middle" direction="rtl">${g.t}</text>`;x+=w+10});return s};
function machTerms(pre,groups){const out=[];let x=40;groups.forEach(g=>{g.ids.forEach((id,i)=>out.push({id:pre+'.'+id,lbl:id,x:x+40+i*60,y:100,col:'#C9A227'}));x+=g.n*60+20+10});return out}
const trArt=(p,s)=>`<rect x="95" y="60" width="90" height="110" rx="6" fill="#7b8a8f" stroke="#3b474c" stroke-width="2"/><rect x="118" y="80" width="44" height="70" fill="#C9CEC4"/>
  ${[0,1,2,3,4].map(i=>`<path d="M95 ${78+i*16}h-12" stroke="#b5651d" stroke-width="5"/><path d="M185 ${80+i*16}h12" stroke="#b5651d" stroke-width="5"/>`).join('')}
  <text x="70" y="196" font-size="11" fill="#33403a" text-anchor="middle" direction="rtl">ابتدائي ${p}</text><text x="210" y="196" font-size="11" fill="#33403a" text-anchor="middle" direction="rtl">ثانوي ${s}</text>
  <circle cx="12" cy="100" r="4" fill="#111"/><circle cx="268" cy="100" r="4" fill="#111"/>`;
function meter(id,title,sub,unit,ranges,ac){return {w:180,h:230,title,sub,meters:[{id,name:title+(id.length>1?' '+id:''),x:15,y:44,w:150,h:96,unit,ranges,ac}],
  terms:[{id:id+'+',lbl:ac?'*':'+',x:55,y:205,pol:ac?'':'+',col:ac?'#C9A227':undefined,ly:-16},{id:id+'-',lbl:ac?'~':'−',x:125,y:205,pol:ac?'':'-',col:ac?'#C9A227':undefined,ly:-16}]}}
const CAT={
 psu1:()=>({w:280,h:230,title:'مصدر جهد مستمر متحكم فيه',sub:'0 – 250 V DC',knobs:[{id:'V1',lbl:'ضبط الجهد',x:85,y:110,max:250,unit:'V',step:0.5}],switches:[{id:'S1',lbl:'تشغيل / إيقاف',x:210,y:100}],
   terms:[{id:'P1+',lbl:'+',x:95,y:200,pol:'+',ly:-16},{id:'P1-',lbl:'−',x:185,y:200,pol:'-',ly:-16}]}),
 psu2:()=>({w:280,h:230,title:'مصدر تيار مستمر متحكم فيه',sub:'0 – 240 V / 0 – 6 A',knobs:[{id:'V2',lbl:'ضبط الخرج',x:85,y:110,max:240,unit:'V',step:0.5}],switches:[{id:'S2',lbl:'تشغيل / إيقاف',x:210,y:100}],
   terms:[{id:'P2+',lbl:'+',x:95,y:200,pol:'+',ly:-16},{id:'P2-',lbl:'−',x:185,y:200,pol:'-',ly:-16}]}),
 vm:(o)=>meter(o.id||'V','فولتميتر',o.sub||'DC',o.unit||'V',o.ranges||[60,300,600],o.ac),
 am:(o)=>meter(o.id||'A','أميتر',o.sub||'DC',o.unit||'A',o.ranges||[0.5,1,5],o.ac),
 wm:(o)=>{const p=o.id||'W';return {w:210,h:250,title:'واتميتر',sub:'AC',meters:[{id:p,name:'الواتميتر',x:30,y:44,w:150,h:96,unit:'W',ranges:o.ranges||[100,500,1000]}],
   labels:[{t:'ملف التيار',x:60,y:212,s:10},{t:'ملف الجهد',x:150,y:212,s:10}],
   terms:[{id:p+'.I+',lbl:'I*',x:38,y:236,pol:'+',ly:-14},{id:p+'.I-',lbl:'I',x:82,y:236,ly:-14,col:'#2B2B2B'},{id:p+'.V+',lbl:'V*',x:128,y:236,pol:'+',ly:-14},{id:p+'.V-',lbl:'V',x:172,y:236,ly:-14,col:'#2B2B2B'}]}},
 tacho:()=>({w:170,h:150,title:'مقياس السرعة',sub:'Tachometer',meters:[{id:'N',kind:'digital',x:10,y:50,w:150,h:50,unit:'rpm',dp:0}],labels:[{t:'مركّب على عمود الآلة',x:85,y:130,s:10}]}),
 rl:(o)=>({w:230,h:230,title:o.title||'مقاومة الحمل RL',sub:o.sub||'مقاومة مادية متغيرة',knobs:[{id:o.k||'RL',lbl:o.klbl||'الحمل %',x:70,y:110,max:o.max||100,min:o.min!=null?o.min:10,unit:'%',step:1,init:o.init!=null?o.init:100}],
   switches:[{id:o.sw||'SL',lbl:'مفتاح الحمل',x:170,y:100}],terms:[{id:(o.p||'L')+'1',lbl:(o.p||'L')+'1',x:70,y:200,col:'#C9A227'},{id:(o.p||'L')+'2',lbl:(o.p||'L')+'2',x:160,y:200,col:'#C9A227'}]}),
 rh:(o)=>({w:200,h:230,title:o.title,sub:o.sub||'',knobs:[{id:o.k,lbl:o.klbl||'القيمة Ω',x:100,y:105,max:o.max,unit:'Ω',step:o.step||1,init:o.init||0}],
   terms:[{id:o.k+'.a',lbl:'a',x:60,y:200,col:'#C9A227'},{id:o.k+'.b',lbl:'b',x:140,y:200,col:'#C9A227'}]}),
 lamps:()=>({w:240,h:230,title:'مجموعة مصابيح',sub:'حمل اللمبات',knobs:[{id:'NL',lbl:'عدد المصابيح',x:70,y:110,max:9,unit:'',step:1}],switches:[{id:'SL',lbl:'المفتاح S',x:175,y:100}],
   terms:[{id:'L1',lbl:'L1',x:75,y:200,col:'#C9A227'},{id:'L2',lbl:'L2',x:165,y:200,col:'#C9A227'}]}),
 brake:()=>({w:230,h:230,title:'وحدة الفرملة',sub:'تحميل المحرك بعزم T',knobs:[{id:'TQ',lbl:'عزم الفرملة',x:70,y:110,max:0.5,unit:'N.m',step:0.01,dp:2}],
   meters:[{id:'TQd',kind:'digital',x:122,y:88,w:100,h:44,unit:'N.m',dp:2}],labels:[{t:'مركّبة على عمود المحرك',x:115,y:205,s:10}]}),
 vac:()=>({w:280,h:230,title:'مصدر جهد متردد متغير',sub:'Variac 0 – 260 V / 60 Hz',knobs:[{id:'VA',lbl:'ضبط الجهد',x:85,y:110,max:260,unit:'V',step:0.1}],switches:[{id:'SA',lbl:'تشغيل / إيقاف',x:210,y:100}],
   terms:[{id:'AC.L',lbl:'L',x:95,y:200,pol:'+',ly:-16},{id:'AC.N',lbl:'N',x:185,y:200,col:'#2B5FA8',ly:-16}]}),
 v3:()=>({w:330,h:230,title:'مصدر ثلاثي الأوجه متغير',sub:'0 – 400 V (جهد الخط) / 60 Hz',knobs:[{id:'V3',lbl:'جهد الخط',x:75,y:110,max:400,unit:'V',step:1}],switches:[{id:'S3',lbl:'تشغيل / إيقاف',x:250,y:100}],
   terms:[{id:'L1p',lbl:'L1',x:60,y:200,pol:'+',ly:-16},{id:'L2p',lbl:'L2',x:130,y:200,col:'#2B2B2B',ly:-16},{id:'L3p',lbl:'L3',x:200,y:200,col:'#7a7a7a',ly:-16},{id:'Np',lbl:'N',x:270,y:200,col:'#2B5FA8',ly:-16}]}),
 sw:(o)=>({w:150,h:170,title:o.title,sub:o.sub||'مفتاح',switches:[{id:o.k,lbl:'فتح / غلق',x:75,y:78}],terms:[{id:o.k+'.a',lbl:'a',x:40,y:145,col:'#C9A227'},{id:o.k+'.b',lbl:'b',x:110,y:145,col:'#C9A227'}]}),
 tr:(o)=>({w:280,h:230,title:o.title||'محول أحادي الوجه',sub:o.sub||'220 V / 110 V',art:trArt('220 V','110 V'),
   terms:[{id:o.p+'.H1',lbl:'H1',x:30,y:100,col:'#C9A227'},{id:o.p+'.H2',lbl:'H2',x:30,y:160,col:'#C9A227'},{id:o.p+'.X1',lbl:'X1',x:250,y:100,col:'#C9A227'},{id:o.p+'.X2',lbl:'X2',x:250,y:160,col:'#C9A227'}]}),
 res:(o)=>({w:200,h:170,title:o.title,sub:o.sub||'',art:`<rect x="50" y="62" width="100" height="26" rx="4" fill="#d9b26f" stroke="#7a5a1f"/>`,
   terms:[{id:o.p+'.a',lbl:'a',x:60,y:140,col:'#C9A227'},{id:o.p+'.b',lbl:'b',x:140,y:140,col:'#C9A227'}]})
};
L.build=function(spec){const W=spec.w||1200,mods=[];let y=20;const gap=16;
  (spec.rows||[]).forEach(row=>{let x=20,h=0;row.forEach(([k,o])=>{const m=Object.assign({id:k+'@'+x+'_'+y},CAT[k](o||{}));m.x=x;m.y=y;x+=m.w+gap;h=Math.max(h,m.h);mods.push(m)});y+=h+gap});
  let draw='',H=y+10;
  if(spec.machines){const top=y+10,mt=spec.machines;
    const G3=[{t:'المنتج',n:2,ids:['1B1','2B2']},{t:'مجال التوازي',n:2,ids:['E1','E2']},{t:'مجال التوالي',n:2,ids:['D1','D2']}],G2=G3.slice(0,2);
    const mk=(d,x,mirror)=>({id:'mach-'+d.p,x,y:top,w:490,h:380,title:d.title,sub:d.sub,art:machBody(d.p,d.lsub||'',mirror)+plate(d.series?G3:G2),terms:machTerms(d.p,d.series?G3:G2)});
    if(mt.left)mods.push(mk(mt.left,20,false));
    if(mt.right)mods.push(mk(mt.right,690,true));
    const sy=top+235;
    draw=`<rect x="0" y="${top-10}" width="${W}" height="400" fill="#C9CEC4"/>`+(mt.right
      ?`<rect x="410" y="${sy}" width="380" height="20" fill="#8f9a9e" stroke="#4b565a"/><rect x="578" y="${sy-17}" width="44" height="54" rx="8" fill="#B4793C" stroke="#5a3a18" stroke-width="2"/><text x="600" y="${sy+56}" font-size="12" fill="#33403a" text-anchor="middle" direction="rtl">قارنة (العمود مشترك)</text>`
      :`<rect x="410" y="${sy}" width="200" height="20" fill="#8f9a9e" stroke="#4b565a"/><rect x="610" y="${sy-40}" width="120" height="100" rx="10" fill="#4b5a62" stroke="#283035" stroke-width="2"/><text x="670" y="${sy+14}" font-size="13" fill="#fff" text-anchor="middle" direction="rtl">الفرملة</text>`);
    H=top+400}
  return {w:W,h:H,generic:true,bg:'#D7DBD2',draw:()=>draw,modules:mods}};
})(PLCBOOK);
