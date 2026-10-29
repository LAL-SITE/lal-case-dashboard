// Verifies the golden values against a built HTML file (v3.3 reference today, the v4 build later).
// Usage: node tests/check-reference.js [path-to-html]   (needs: npm i -D playwright)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const html=path.resolve(process.argv[2]||'reference/current/laia-support-app-v3.3.html');
const rnd=x=>x==null||!isFinite(x)?x:Math.round(x*100)/100;
(async()=>{const b=await chromium.launch();let fail=0;
 for(const f of fs.readdirSync('tests/fixtures').filter(x=>x.endsWith('.case.json'))){
  const name=f.replace('.case.json','');const exp=JSON.parse(fs.readFileSync(`tests/expected/${name}.expected.json`));
  const p=await b.newPage();await p.goto('file://'+html);await p.waitForTimeout(800);
  await p.setInputFiles('#importFile',path.resolve('tests/fixtures',f));await p.waitForTimeout(800);
  const got=await p.evaluate(()=>{const r=R;return {final:r.final,payer:r.payer,netA:r.A.net,netB:r.B.net,scen:(S.scenarios||[]).map(sc=>calcFor(sc).final),eq:(EDC||edCompute()).amt};});
  const checks=[['child support',rnd(got.final),exp.childSupport.final],['payer',got.payer,exp.childSupport.payer],['net A',rnd(got.netA),exp.childSupport.netA],['net B',rnd(got.netB),exp.childSupport.netB],['equalizer',rnd(got.eq),exp.ed.keys.amt],...exp.scenarios.map((s,i)=>['scenario '+s.name,rnd(got.scen[i]),s.final])];
  for(const [l,g,e] of checks){const ok=g===e;if(!ok)fail++;console.log(`${ok?'PASS':'FAIL'}  ${name}  ${l}: got ${g}, expected ${e}`);}
  await p.close();}
 await b.close();console.log(fail?`${fail} FAILED`:'All golden values match.');process.exit(fail?1:0);})();
