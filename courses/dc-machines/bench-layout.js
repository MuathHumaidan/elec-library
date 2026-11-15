/* «المنضدة الافتراضية» — شكل المنضدة فقط (المواضع والأسماء والرسم)، بلا كهرباء ولا خطوات.
   الشكل الحالي عام: منضدة آلات تيار مستمر بالترتيب المعتاد وبأسماء أطراف الكتاب (الشكل 1، ص 10).
   لمطابقة منضدة الكلية: يُستبدل هذا الملف وحده (نفس معرّفات الأطراف والمقابض والأجهزة)، والتجربة لا تتغير.
   المعرّفات التي تعتمد عليها التجارب: P1+ P1- V1 S1 · P2+ P2- V2 S2 · V+ V- V · A+ A- A · N · M.1B1 M.2B2 M.E1 M.E2 · G.1B1 G.2B2 G.E1 G.E2 */
(function(B){
const mach=(lbl,sub)=>`<g transform="translate(70 150)">
  <rect x="0" y="20" width="250" height="150" rx="20" fill="#6E7F86" stroke="#3b474c" stroke-width="2"/>
  ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${18+i*28}" y="14" width="12" height="162" rx="4" fill="#5d6c72"/>`).join('')}
  <rect x="250" y="80" width="70" height="30" fill="#9aa5a9" stroke="#3b474c"/>
  <text x="125" y="102" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${lbl}</text>
  <text x="125" y="128" font-size="12" fill="#e8eef0" text-anchor="middle">${sub}</text></g>`;
const plate=(x)=>`<rect x="${x}" y="48" width="300" height="72" rx="8" fill="#20262a" stroke="#0d1012"/>
  <text x="${x+75}" y="64" font-size="11" fill="#cfd6d9" text-anchor="middle">المنتج</text><text x="${x+225}" y="64" font-size="11" fill="#cfd6d9" text-anchor="middle">المجال</text>`;
window.BENCH_LAYOUTS=window.BENCH_LAYOUTS||{};
window.BENCH_LAYOUTS['dc-generic']={
 w:1200,h:690,generic:true,bg:'#D7DBD2',
 draw:()=>`<rect x="0" y="270" width="1200" height="420" fill="#C9CEC4"/>
   <rect x="410" y="525" width="380" height="20" fill="#8f9a9e" stroke="#4b565a"/>
   <rect x="578" y="508" width="44" height="54" rx="8" fill="#B4793C" stroke="#5a3a18" stroke-width="2"/>
   <text x="600" y="582" font-size="12" fill="#33403a" text-anchor="middle">قارنة (العمود مشترك)</text>
   <path d="M600 508V172H1095" stroke="#7c8680" stroke-width="2" stroke-dasharray="6 5" fill="none"/>
   <text x="610" y="300" font-size="11" fill="#4b5a52">إلى مقياس السرعة</text>`,
 modules:[
  {id:'psu1',x:20,y:20,w:280,h:230,title:'مصدر جهد مستمر متحكم فيه',sub:'0 – 250 V DC',
   knobs:[{id:'V1',lbl:'ضبط الجهد',x:85,y:110,max:250,unit:'V',step:1}],
   switches:[{id:'S1',lbl:'تشغيل / إيقاف',x:210,y:100}],
      terms:[{id:'P1+',lbl:'+',x:95,y:200,pol:'+',ly:-16},{id:'P1-',lbl:'−',x:185,y:200,pol:'-',ly:-16}]},
  {id:'psu2',x:320,y:20,w:280,h:230,title:'مصدر تيار مستمر متحكم فيه',sub:'0 – 240 V / 0 – 6 A',
   knobs:[{id:'V2',lbl:'ضبط الخرج',x:85,y:110,max:240,unit:'V',step:1}],
   switches:[{id:'S2',lbl:'تشغيل / إيقاف',x:210,y:100}],
      terms:[{id:'P2+',lbl:'+',x:95,y:200,pol:'+',ly:-16},{id:'P2-',lbl:'−',x:185,y:200,pol:'-',ly:-16}]},
  {id:'vm',x:620,y:20,w:180,h:230,title:'فولتميتر',sub:'DC',
   meters:[{id:'V',name:'الفولتميتر',x:15,y:44,w:150,h:96,unit:'V',ranges:[60,300,600]}],
   terms:[{id:'V+',lbl:'+',x:55,y:205,pol:'+',ly:-16},{id:'V-',lbl:'−',x:125,y:205,pol:'-',ly:-16}]},
  {id:'am',x:815,y:20,w:180,h:230,title:'أميتر',sub:'DC',
   meters:[{id:'A',name:'الأميتر',x:15,y:44,w:150,h:96,unit:'A',ranges:[0.5,1,5]}],
   terms:[{id:'A+',lbl:'+',x:55,y:205,pol:'+',ly:-16},{id:'A-',lbl:'−',x:125,y:205,pol:'-',ly:-16}]},
  {id:'tacho',x:1010,y:20,w:170,h:150,title:'مقياس السرعة',sub:'Tachometer',
   meters:[{id:'N',kind:'digital',x:10,y:50,w:150,h:50,unit:'rpm',dp:0}],
   labels:[{t:'مركّب على عمود الآلتين',x:85,y:130,s:10}]},
  {id:'mot',x:20,y:290,w:490,h:380,title:'المحرك المُدير M (توازي)',sub:'آلة تيار مستمر',art:mach('M','Motor')+plate(95),
   terms:[{id:'M.1B1',lbl:'1B1',x:140,y:100,col:'#C9A227'},{id:'M.2B2',lbl:'2B2',x:200,y:100,col:'#C9A227'},
          {id:'M.E1',lbl:'E1',x:290,y:100,col:'#C9A227'},{id:'M.E2',lbl:'E2',x:350,y:100,col:'#C9A227'}]},
  {id:'gen',x:690,y:290,w:490,h:380,title:'المولد G',sub:'آلة تيار مستمر — مجاله يُغذّى تغذية منفصلة',art:`<g transform="translate(490 0) scale(-1 1)">${mach('','')}</g><text x="295" y="255" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">G</text><text x="295" y="280" font-size="12" fill="#e8eef0" text-anchor="middle">Generator</text>`+plate(95),
   terms:[{id:'G.1B1',lbl:'1B1',x:140,y:100,col:'#C9A227'},{id:'G.2B2',lbl:'2B2',x:200,y:100,col:'#C9A227'},
          {id:'G.E1',lbl:'E1',x:290,y:100,col:'#C9A227'},{id:'G.E2',lbl:'E2',x:350,y:100,col:'#C9A227'}]}
 ]};
})(PLCBOOK);
