// Verifies the golden values against a built HTML file (v3.3 reference today, the v4 build later).
// Usage: node tests/check-reference.js [path-to-html]   (needs: npm i -D playwright)
// Checks every value in tests/expected/*.expected.json. The browser clock is pinned to AS_OF because the disco
// coverage flags and the retro default end date read today's date (none of today's golden values do; future
// checks will). Any script error fails the run.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const html=path.resolve(process.argv[2]||'reference/current/laia-support-app-v3.3.html');
const AS_OF='2026-10-29T12:00:00';   // capture date of the golden values (see capturedFrom)
const rnd=x=>x==null||!isFinite(x)?x:Math.round(x*100)/100;
(async()=>{const b=await chromium.launch();let fail=0,total=0;
 for(const f of fs.readdirSync('tests/fixtures').filter(x=>x.endsWith('.case.json'))){
  const name=f.replace('.case.json','');const exp=JSON.parse(fs.readFileSync(`tests/expected/${name}.expected.json`));
  const ctx=await b.newContext({timezoneId:'America/New_York'});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.clock.setFixedTime(new Date(AS_OF));
  await p.goto('file://'+html);await p.waitForTimeout(800);
  await p.setInputFiles('#importFile',path.resolve('tests/fixtures',f));await p.waitForTimeout(800);
  // COC markers were captured after Disco › Scan & update, which loads the built-in demo folder list for the demo
  // case numbers. Read everything else first, then scan, then read the markers.
  const got=await p.evaluate(async()=>{const r=R,e=EDC||edCompute();const ours=clientKey()||'B',opp=ours==='A'?'B':'A';
   const mk=k=>DISCO.model(k).map(x=>[x.id,x.mk]);
   const out={final:r.final,payer:r.payer,netA:r.A.net,netB:r.B.net,grossA:r.A.gross,grossB:r.B.gross,ovA:r.ovA,ovB:r.ovB,alAmt:r.alAmt,
    scen:(S.scenarios||[]).map(sc=>{const x=calcFor(sc);return {name:sc.name,final:x.final,payer:x.payer};}),
    ed:{netP:e.netP,netR:e.netR,estate:e.estate,target:e.target,eq:e.eq,amt:e.amt,afterP:e.afterP,afterR:e.afterR},
    gaps:gaps().length};
   await DISCO.scan();out.coc={ours:mk(ours),opp:mk(opp)};return out;});
  const cs=exp.childSupport;
  const checks=[['child support',rnd(got.final),cs.final],['payer',got.payer,cs.payer],['net A',rnd(got.netA),cs.netA],['net B',rnd(got.netB),cs.netB],
   ['gross A',rnd(got.grossA),cs.grossA],['gross B',rnd(got.grossB),cs.grossB],['overnights A',got.ovA,cs.overnightsA],['overnights B',got.ovB,cs.overnightsB],['alimony used',rnd(got.alAmt),cs.alimonyUsed],
   ['scenario count',got.scen.length,exp.scenarios.length],
   ...exp.scenarios.flatMap((s,i)=>{const g=got.scen[i]||{};return [['scenario '+s.name+' name',g.name,s.name],['scenario '+s.name,rnd(g.final),s.final],['scenario '+s.name+' payer',g.payer,s.payer]];}),
   ...Object.entries(exp.ed.keys).map(([k,v])=>['ED '+k,rnd(got.ed[k]),v]),
   ['equalizer',rnd(got.ed.amt),exp.ed.keys.amt],
   ['disco gaps',got.gaps,exp.gaps],
   ...['ours','opp'].flatMap(side=>[['COC '+side+' item list',got.coc[side].map(x=>x[0]).join(','),exp.coc[side].map(x=>x[0]).join(',')],
     ...exp.coc[side].map(([id,m])=>['COC '+side+' '+id,(got.coc[side].find(x=>x[0]===id)||[])[1],m])]),
   ['script errors',errs.length?errs.join(' | '):0,0]];
  for(const [l,g,e] of checks){const ok=g===e;total++;if(!ok)fail++;console.log(`${ok?'PASS':'FAIL'}  ${name}  ${l}: got ${g}, expected ${e}`);}
  await ctx.close();}
 await b.close();console.log(fail?`${fail} of ${total} FAILED`:`All ${total} golden values match.`);process.exit(fail?1:0);})();
