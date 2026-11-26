const { chromium } = require('playwright');
const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:1.5});
await p.goto('file://'+path.resolve(process.argv[2]));await p.evaluate(()=>document.fonts.ready);
await p.locator('#s').screenshot({path:process.argv[3],omitBackground:true});await b.close();})();
