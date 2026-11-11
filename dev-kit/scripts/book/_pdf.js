const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const [c,out] of JSON.parse(process.argv[2])){await p.goto('file:///home/claude/pdfrep/'+c+'.html');await p.waitForTimeout(400);
await p.pdf({path:out,format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:'<div style="width:100%;text-align:center;font-size:8pt;color:#888"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',margin:{top:'16mm',bottom:'16mm',left:'14mm',right:'14mm'}});console.log(out)}
await b.close()})();
