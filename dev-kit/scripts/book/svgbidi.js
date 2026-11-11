// usage: node svgbidi.js <course> [ids...]  — in stations mode, finds SVG <text> where a "(a-b)" or "number unit" run renders reversed
const {chromium}=require('playwright');
(async()=>{const [course,...ids0]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.addInitScript(()=>localStorage.setItem('elib-style','stations'));
await p.goto(`file:///home/claude/lib/courses/${course}/index.html`);await p.waitForTimeout(400);
const ids=ids0.length?ids0:await p.evaluate(()=>[...document.querySelectorAll('a[href^="#u"]')].map(a=>a.getAttribute('href').slice(1)).filter((v,i,a)=>/^u\d+-l\d+$/.test(v)&&a.indexOf(v)===i));
const out=[];
for(const id of ids){await p.goto(`file:///home/claude/lib/courses/${course}/index.html#${id}`);await p.waitForTimeout(500);
 const r=await p.evaluate(()=>{const bad=[];document.querySelectorAll('main svg text, main svg tspan').forEach(t=>{
   const txt=t.textContent;if(!/[؀-ۿ]/.test(txt))return;if(t.querySelector&&t.querySelector('tspan'))return;
   const re=/\(\d+-\d+\)|\d+(?:\.\d+)?\s?(?:V|A|W|Ω|Hz|rpm|kW|mA|s|%)\b/g;let m;
   while((m=re.exec(txt))){const s=m[0];try{const i0=m.index;const a=t.getStartPositionOfChar(i0).x,z=t.getStartPositionOfChar(i0+s.length-1).x;if(a>z+0.5)bad.push(s+' «'+txt.slice(0,40)+'»')}catch(e){}}});return bad});
 if(r.length)out.push(id+': '+r.slice(0,4).join(' | ')+(r.length>4?` (+${r.length-4})`:''))}
console.log(out.length?out.join('\n'):'no reversed runs');await b.close()})();
