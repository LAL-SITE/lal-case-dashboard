// ===== v3.3b: disco trackers that read the client folder (Scan & update) · firm-format certificate of compliance auto-filled from what we have · Boards tab (mediation / hearing / trial prep) · retro periods from saved scenarios =====
(function(){
 const ours=()=>clientKey()||'B', opp=()=>ours()==='A'?'B':'A';
 const RQ='Pay stubs|Statement';
 // ---------- Rule 12.285 items, firm format master wording ----------
 const COC2=[
  {id:'faS',short:'Short Form Financial Affidavit',t:'Short Form Financial Affidavit - Florida Family Law Rules of Procedure Form 12.902(b)',fa:1},
  {id:'faL',short:'Long Form Financial Affidavit',t:'Long Form Financial Affidavit - Florida Family Law Rules of Procedure Form 12.902(c)',fa:1},
  {id:'tax',short:'Tax returns (3 years) / W-2, 1099, K-1',t:'All complete personal (1040) federal tax, gift tax, and intangible personal property tax returns for the past three years; or Transcript of tax return as provided by IRS form 4506-T; or IRS forms W-2, 1099, and K-1 for the past year because the income tax return for the past year has not been prepared.',years:3},
  {id:'pay',short:'Pay stubs (6 months)',t:'Pay stubs or other evidence of earned income for the 6 months before the compliance with the disclosure requirements for initial or supplemental proceedings.',months:6},
  {id:'incst',short:'Statement of income source',t:'A statement identifying the amount and source of all income received from any source during the 6 months preceding the compliance with these disclosure requirements for initial or supplemental proceedings, if not reflected on the pay stubs produced.',noList:1},
  {id:'loan',short:'Loan applications / financial statements (24 months)',t:'All loan applications and financial statements, credit reports, or any other form of financial disclosure, including financial aid forms, prepared for any purpose or used for any purpose within the 24 months preceding the compliance with these disclosure requirements for initial or supplemental proceedings.'},
  {id:'deed',short:'Deeds, notes owed to the party, leases received',t:'All deeds to real estate in which I presently own or owned in the past 3 years. All promissory notes or other documents evidencing money owed to me or my spouse at any time within the last 24 months. All leases, whether in my name individually, in my name jointly with any other person or entity, in my name as trustee or guardian for a party or a minor or adult dependent child of both parties, or in someone else’s name on my behalf wherein either party (A) is receiving or has received payments at any time within the last 3 years, or (B) owns or owned an interest.'},
  {id:'bank',short:'Bank statements (12 months)',t:'All periodic statements for the last 12 months for all checking accounts, and for the last 12 months for all savings accounts, money market funds, certificates of deposit, and all other accounts, regardless of whether the account has been closed, whether in my name individually, in my name jointly with any other person or entity, in my name as trustee or guardian for a party or a minor or adult dependent child of both parties, or in someone else’s name on my behalf; and for all accounts that have check-writing privileges, copies of canceled checks and registers, whether written or electronically maintained.',months:12},
  {id:'brok',short:'Brokerage statements (12 months)',t:'All brokerage account statements for the last 12 months, in either party’s name, individually or jointly with any person or entity, or as a trustee or guardian for a party or a minor or adult dependent child of both parties or in someone else’s name on my behalf; and for all accounts that have check-writing privileges, copies of canceled checks and registers, whether written or electronically maintained.',months:12},
  {id:'ret',short:'Retirement statements (12 months)',t:'Most recent statements for the past 12 months for any pension, profit sharing, deferred compensation, or retirement plan (for example, IRA, 401(k), 403(b), SEP, KEOGH, etc.) and summary plan descriptions for any such plan in which I am a participant or an alternate payee receiving payments.',months:12},
  {id:'crypto',short:'Virtual currency',t:'The most recent statement for any virtual currency transactions in which either party participated within the last 12 months or holds an interest in, either individually, jointly with any other person or entity, as trustee or guardian for a party or minor or adult dependent child of both parties, or in someone else’s name on my behalf, and a listing of all current holdings of virtual currency.'},
  {id:'ins',short:'Life insurance; health & dental cards',t:'The declarations page, the last periodic statement, the statements for the past 12 months, and the certificate for all life insurance policies insuring the party’s life or the life of the party’s spouse, whether group insurance or otherwise, and all current health and dental insurance cards covering either of the parties and/or their dependent children.'},
  {id:'corp',short:'Business / trust returns (3 years)',t:'Corporate, partnership, and trust tax returns for the last 3 tax years in which I have an ownership or interest.',years:3},
  {id:'debt',short:'Credit cards, debts, leases owed (24 months)',t:'All credit card and charge account statements and other records showing my (our) indebtedness as of the filing of this action and for the prior 24 months preceding compliance with these disclosure requirements for initial or supplemental proceedings. All promissory notes I owe or owed within the past 24 months, whether paid or not. All lease agreements I owe, either in my name individually, jointly with any other person or entity, in my name as trustee or guardian for a party or a minor or adult dependent child of both parties, or in someone else’s name on my behalf.',months:24},
  {id:'pre',short:'Premarital / marital agreements',t:'All written premarital or marital agreements between the parties to this case, and all affidavits and declarations of non-paternity or judgments of disestablishment of paternity for any minor or dependent children born or conceived during the marriage.'},
  {id:'modag',short:'Agreements since the order (modification)',t:'If a modification proceeding, all written agreements entered into between the parties at any time since the order to be modified was entered.'},
  {id:'uneq',short:'Unequal distribution / nonmarital claims',t:'All documents relating to claims for unequal distribution of marital property, enhancement or appreciation in nonmarital property, or nonmarital status of an asset or debt.'},
  {id:'orders',short:'Support orders',t:'Any court orders directing a party to pay or receive spousal or child support.'}];
 const MK=['Produced','Will Be Produced','Not Applicable'];

 // ---------- classify a file from its name and folder ----------
 const RULES=[['faL',/financial affidavit|12\.902|\bfa\b/],['corp',/1120|1065|1041|k-?1 partnership|business (tax )?return|partnership return|corporate return|trust return/],['tax',/1040|tax return|4506|transcript|\bw-?2\b|1099|\bk-?1\b|schedule c/],['pay',/pay ?stub|paystub|earnings statement|payroll|pay statement/],
  ['loan',/loan app|credit report|financial statement|fafsa|mortgage app/],['crypto',/crypto|coinbase|bitcoin|virtual currency|wallet|kraken/],['ret',/401 ?k|\b401\b|403 ?b|\b403\b|\bira\b|pension|retirement|\bsep\b|keogh|\btsp\b|deferred comp|457/],
  ['brok',/brokerage|schwab|etrade|e\*trade|robinhood|investment acc|merrill|vanguard/],['debt',/visa|mastercard|amex|american express|discover card|credit card|charge account|mortgage statement|auto loan|car loan|student loan|loan statement|heloc|promissory note|lease (i|we) owe|car lease|apartment lease/],
  ['deed',/\bdeed\b|warranty deed|quitclaim|note receivable|lease.*(income|tenant|rental)|rental lease/],['bank',/checking|savings|money market|\bcd\b|bank statement|credit union|bank of america|chase|wells fargo|truist|regions/],
  ['ins',/insurance|declarations page|policy|dental card|health card|life ins/],['pre',/prenup|premarital|postnup|marital agreement|non-?paternity|disestablish/],['modag',/agreement since|modification agreement/],['uneq',/nonmarital|non-marital|tracing|inheritance|gift letter|premarital funds/],['orders',/support order|order .*support|final judgment|income deduction|\bido\b/]];
 const MON={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
 function dates(s){const out=[];let m;const re1=/(20\d\d)[-_.](\d{1,2})(?:[-_.](\d{1,2}))?/g;while((m=re1.exec(s)))out.push([+m[1],+m[2]]);
  const re2=/\b(\d{1,2})[-_.](\d{1,2})[-_.](20\d\d|\d\d)\b/g;while((m=re2.exec(s)))out.push([+(m[3].length===2?'20'+m[3]:m[3]),+m[1]]);
  const re3=/\b(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\.? ?(20\d\d)\b/gi;while((m=re3.exec(s)))out.push([+m[2],MON[m[1].toLowerCase()]]);
  return out.filter(([y,mo])=>y>2000&&mo>=1&&mo<=12);}
 function years(s){return [...new Set((s.match(/\b20\d\d\b/g)||[]).map(Number))];}
 function partyOf(path){const p=path.toLowerCase();const nm=k=>{const n=(S.parties[k].name||'').toLowerCase().split(/\s+/).filter(x=>x.length>2);return n;};
  const o=ours(),q=opp();const has=k=>nm(k).some(w=>p.includes(w))&&!(nm(k==='A'?'B':'A').filter(w=>!nm(k).includes(w)).some(w=>p.includes(w)));
  if(/our client|\bclient\b|^client|\/client/.test(p))return o;if(/opposing|\bop\b|\bop disco|other party|\boc\b/.test(p))return q;
  if(/joint/.test(p))return 'both';
  const ra=/petitioner|\bpet\b|\bwife\b|\bw's\b/.test(p),rb=/respondent|\bresp\b|\bhusband\b|\bh's\b/.test(p);
  if(has('A')&&!has('B'))return 'A';if(has('B')&&!has('A'))return 'B';if(ra&&!rb)return 'A';if(rb&&!ra)return 'B';return '?';}
 function classify(path){const p=path.toLowerCase().replace(/[_]+/g,' ');const nm=path.split('/').pop();let item='';
  for(const [id,re] of RULES)if(re.test(p)){item=id;break;}
  if(item==='faL'&&/short form|12\.902\(b\)|902b/.test(p))item='faS';
  if(/appraisal|valuation|cma/.test(p)&&!item)item='other';
  const l4=(p.match(/(?:ending|acct|account|x|\*{2,}|…)\s*#?\s*(\d{4})\b/)||[])[1]||'';
  return {path,name:nm,item:item||'?',party:partyOf(path),last4:l4,dates:dates(nm),years:years(nm)};}

 // ---------- model ----------
 function D(){S.disco=S.disco||{files:[],ov:{A:{},B:{}},scannedAt:''};S.disco.ov=S.disco.ov||{A:{},B:{}};S.disco.ov.A=S.disco.ov.A||{};S.disco.ov.B=S.disco.ov.B||{};return S.disco;}
 function filesFor(k){return D().files.filter(f=>f.party===k||f.party==='both');}
 function ym(d){return d[0]*12+d[1]-1;}
 const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const ymS=v=>MN[v%12]+' '+Math.floor(v/12);
 function cover(it,F){const now=new Date();const cur=now.getFullYear()*12+now.getMonth();
  if(it.months){const groups={};F.forEach(f=>{const g=f.last4||f.name.replace(/\d|[-_.()]/g,'').slice(0,18);(groups[g]=groups[g]||new Set());f.dates.forEach(d=>groups[g].add(ym(d)));});
   const res=Object.entries(groups).map(([g,s])=>{const a=[...s].sort((x,y)=>x-y);const need=it.months;const inWin=a.filter(v=>v>cur-need-1);const last=a.length?a[a.length-1]:null;
    return {g,first:a[0],last,have:inWin.length,need,short:inWin.length<need-1,fwd:last!==null&&last<cur-1?last+1:null};});return res;}
  if(it.years){const ys=new Set();F.forEach(f=>f.years.forEach(y=>ys.add(y)));const need=it.years;const y0=now.getFullYear()-1;const have=[...ys].filter(y=>y>=y0-need+1&&y<=y0);
   return [{g:'years',years:[...ys].sort(),have:have.length,need,short:have.length<need&&!(it.id==='tax'&&F.some(f=>/w-?2|1099|k-?1/i.test(f.name))&&have.includes(y0))}];}
  return [];}
 function autoMarker(k,it,F){const iss=issuesOf().map(x=>x[0]);const p=S.parties[k];
  if(it.id==='faS')return 'Not Applicable';
  if(it.id==='faL')return F.length||((S.ed.docs||[]).some(d=>d.role===(k==='A'?'faP':'faR')))?'Produced':'Will Be Produced';
  if(it.id==='incst'){const prod=x=>filesFor(k).some(f=>f.item===x);return prod('pay')||prod('tax')?'Produced':'Will Be Produced';}
  if(F.length)return 'Produced';
  if(it.id==='modag')return iss.includes('mod')?'Will Be Produced':'Not Applicable';
  if(it.id==='orders')return iss.includes('mod')?'Will Be Produced':'Not Applicable';
  if(it.id==='crypto')return (S.ed.items||[]).some(x=>/crypto|virtual|bitcoin/i.test((x.cat||'')+' '+(x.name||'')))?'Will Be Produced':'Not Applicable';
  if(it.id==='corp')return p.selfEmployed||num(p.seIncome)||num(p.k1Income)||(S.ed.items||[]).some(x=>x.cat==='business'&&x.title===(k==='A'?'P':'R'))?'Will Be Produced':'Not Applicable';
  if(it.id==='uneq')return (S.ed.items||[]).some(x=>(x.premarital||has(x.nm))&&(x.title===(k==='A'?'P':'R')||!['P','R'].includes(x.title)))?'Will Be Produced':'Not Applicable';
  if(it.id==='pre')return 'Not Applicable';
  return 'Will Be Produced';}
 function model(k){return COC2.map(it=>{const F=filesFor(k).filter(f=>f.item===it.id);const ov=D().ov[k][it.id];const auto=autoMarker(k,it,F);const mk=ov||auto;const cv=cover(it,F);
  return {...it,files:F,auto,mk,ov:!!ov,cover:cv,isShort:cv.some(c=>c.short)};});}
 function owed(k){return model(k).filter(x=>x.mk==='Will Be Produced');}
 function produced(k){return model(k).filter(x=>x.mk==='Produced');}
 function fline(f){const nm=f.name.replace(/\.[a-z0-9]+$/i,'').replace(/\s*\(demo\)\s*/i,' ').trim();return nm;}
 function covTxt(c){if(c.g==='years')return c.years.length?`Years: ${c.years.join(', ')}${c.short?` — ${c.have} of ${c.need} needed`:''}`:'';
  return `${c.g.length===4?'…'+c.g:esc(c.g)}: ${c.first!=null?ymS(c.first)+' – '+ymS(c.last):'no dates in file names'}${c.short?` — ${c.have} of ${c.need} months`:''}`;}

 // ---------- scanning ----------
 async function ingest(list,src){const d=D();const seen=new Set(d.files.map(f=>f.path));let n=0;
  list.forEach(p=>{if(/\.(ds_store|ini|tmp)$|~\$|\/\./i.test(p))return;if(seen.has(p))return;d.files.push({...classify(p),src,addedAt:new Date().toISOString()});n++;});
  d.scannedAt=new Date().toISOString();touch();render();toast(n?`${n} new file${n===1?'':'s'} found — tracker and certificate updated`:'No new files — tracker is current');}
 function regPaths(){return (S.ed.docs||[]).map(x=>{const r=x.role==='faP'?'Petitioner/':x.role==='faR'?'Respondent/':'';return r+(x.fileName||x.label||'document');});}
 const DEMO_FILES={'2026-DR-DEMO-01':['Our client - Respondent Marcus Rivera/Respondent FA - Marcus Rivera (DEMO).pdf','Our client - Respondent Marcus Rivera/W-2 2025 - Marcus Rivera (DEMO).pdf','Our client - Respondent Marcus Rivera/Pay stub - Marcus Rivera 10-15-2026 (DEMO).pdf','Our client - Respondent Marcus Rivera/401k statement - acct ending 7781 (DEMO).pdf','Our client - Respondent Marcus Rivera/Visa statement - acct ending 2208 (DEMO).pdf','Opposing party - Petitioner Elena Rivera/Petitioner FA - Elena Rivera (DEMO).pdf','Opposing party - Petitioner Elena Rivera/W-2 2025 - Elena Rivera (DEMO).pdf','Opposing party - Petitioner Elena Rivera/Pay stub - Elena Rivera 10-17-2026 (DEMO).pdf','Opposing party - Petitioner Elena Rivera/403b statement - acct ending 5520 (DEMO).pdf','Joint/Joint checking statement - acct ending 4417 (DEMO).pdf','Joint/Joint savings statement - acct ending 0932 (DEMO).pdf','Joint/Mortgage statement - Demo Home Lending (DEMO).pdf','Joint/Auto loan statement - Highlander acct ending 3091 (DEMO).pdf','Joint/Deed - marital residence Winter Park (DEMO).pdf','Joint/Appraisal summary - marital residence (DEMO).pdf'],
  '2026-DR-DEMO-02':(()=>{const a=['Our client - Petitioner Tasha Johnson/Petitioner FA - Tasha Johnson (DEMO).pdf','Our client - Petitioner Tasha Johnson/1040 2023 - Tasha Johnson (DEMO).pdf','Our client - Petitioner Tasha Johnson/1040 2024 - Tasha Johnson (DEMO).pdf','Our client - Petitioner Tasha Johnson/1040 2025 - Tasha Johnson (DEMO).pdf','Our client - Petitioner Tasha Johnson/Health insurance card - children (DEMO).pdf','Opposing party - Respondent Derek Johnson/1040 with Schedule C 2025 - Derek Johnson (DEMO).pdf','Opposing party - Respondent Derek Johnson/Business checking statement acct ending 6610 2026-03 (DEMO).pdf','Opposing party - Respondent Derek Johnson/Business checking statement acct ending 6610 2026-04 (DEMO).pdf','Opposing party - Respondent Derek Johnson/Amex statement acct ending 1005 2026-08 (DEMO).pdf'];
   for(let m=4;m<=9;m++)a.push(`Our client - Petitioner Tasha Johnson/Pay stub - Tasha Johnson 2026-${String(m).padStart(2,'0')}-15 (DEMO).pdf`);
   for(let m=10;m<=21;m++){const y=2025+Math.floor((m-1)/12),mo=((m-1)%12)+1;a.push(`Our client - Petitioner Tasha Johnson/Chase checking statement acct ending 2231 ${y}-${String(mo).padStart(2,'0')} (DEMO).pdf`);}
   return a;})()};
 const demoKey=()=>DEMO_FILES[S.meta.caseNo]?S.meta.caseNo:null;
 function pickFolder(){let inp=document.getElementById('discoPick');if(!inp){inp=document.createElement('input');inp.type='file';inp.id='discoPick';inp.multiple=true;inp.setAttribute('webkitdirectory','');inp.hidden=true;document.body.appendChild(inp);
   inp.addEventListener('change',()=>{const L=[...inp.files].map(f=>f.webkitRelativePath||f.name);inp.value='';ingest(L,'folder');});}inp.click();}
 async function scan(){const L=regPaths();const dk=demoKey();if(dk){await ingest(DEMO_FILES[dk].concat(L),'demo folder');return;}
  if(L.length)await ingest(L,'register');
  if(window.LAIA_DEMO){demoPreview&&demoPreview('Scan the client folder','<p>In the licensed version the app reads the client’s folder and sorts every file into the tracker.</p>');return;}
  pickFolder();}
 async function aiClassify(){const sm=await sampleNS();const U=D().files.filter(f=>f.item==='?'||f.party==='?');
  if(!U.length){toast('Nothing left to sort');return;}if(!sm){toast('AI sorting runs when the app is opened from your AI workspace. Sort the rest with the menus.');return;}
  try{const out=await sm.json(`Sort these Florida family-law discovery file paths. For each return {"i":index,"item":one of ${JSON.stringify(COC2.map(x=>x.id).concat(['other']))},"party":"A" (Petitioner ${pn('A')}) or "B" (Respondent ${pn('B')}) or "both"}. Reply ONLY JSON {"rows":[...]}. Files: ${JSON.stringify(U.map((f,i)=>[i,f.path]))}`,{modelTier:'quick'});
   (out.rows||[]).forEach(r=>{const f=U[r.i];if(!f)return;if(f.item==='?'&&r.item)f.item=r.item;if(f.party==='?'&&r.party)f.party=r.party;});touch();render();toast('Sorted');}catch(e){if(!(e&&e.demo))toast('AI sorting didn’t finish');}}

 // ---------- tracker page ----------
 function trk(k){const g=uGate();if(g)return g;const isO=k===ours();const M=model(k);const P=M.filter(x=>x.mk==='Produced'),W=M.filter(x=>x.mk==='Will Be Produced'),NA=M.filter(x=>x.mk==='Not Applicable'),SH=M.filter(x=>x.isShort&&x.mk==='Produced');
  const un=D().files.filter(f=>f.item==='?'||f.party==='?');let G=[];try{G=gaps().filter(x=>x.from===k||x.from==='both');}catch(e){}
  const pct=Math.round(P.length/Math.max(1,M.length-NA.length)*100);
  return `<h1 class="sec">${isO?'Client':'OP'} disco — ${esc(pnr(k))}</h1><p class="lede">${isO?'What our client has produced and still owes':'What the other side has produced and still owes us'}, read from the client folder and sorted into the Rule 12.285 items. Scan again whenever new discovery comes in.</p>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn pink" type="button" data-act="dscan">⟳ Scan & update from client folder</button><button class="btn" type="button" data-act="dai">✦ Sort the rest with AI</button><button class="btn ghost" type="button" data-act="go" data-sec="${isO?'cdresp':'odreq'}">${isO?'Certificate of compliance →':'Requests & deficiency letter →'}</button><span class="note">${D().scannedAt?'Last scan '+new Date(D().scannedAt).toLocaleString():'Not scanned yet'} · ${D().files.length} files</span></div>
  <div class="edsum" style="margin-bottom:10px"><div><span>Produced</span><b>${P.length}</b></div><div><span>Will be produced</span><b>${W.length}</b></div><div><span>Short coverage</span><b>${SH.length}</b></div><div class="hl"><span>Gaps to request</span><b>${G.length}</b></div></div>
  <div class="bar2" title="${pct}% of applicable items produced"><i class="b" style="width:${pct}%"></i></div>
  <div class="panel"><div class="tablewrap"><table class="cmp"><thead><tr><th>Rule 12.285 item</th><th style="text-align:left">Status</th><th style="text-align:left">In the file</th></tr></thead><tbody>
  ${M.map(x=>`<tr><td style="text-align:left;white-space:normal;min-width:200px"><b>${esc(x.short)}</b>${x.isShort&&x.mk==='Produced'?' <span class="pill sole">short</span>':''}</td>
  <td style="text-align:left"><select data-dmk="${k}:${x.id}" aria-label="Status for ${esc(x.short)}"><option value="">Auto: ${esc(x.auto)}</option>${MK.map(m=>`<option ${x.ov&&x.mk===m?'selected':''}>${m}</option>`).join('')}</select></td>
  <td style="text-align:left;white-space:normal">${x.files.length?`<ul style="margin:0;padding-left:16px">${x.files.map(f=>`<li>${esc(fline(f))}${f.party==='both'?' <span class="note">(joint)</span>':''}</li>`).join('')}</ul>${x.cover.map(c=>`<div class="note">${covTxt(c)}</div>`).join('')}`:'<span class="note">—</span>'}</td></tr>`).join('')}
  </tbody></table></div></div>
  ${un.length?`<div class="panel review"><h3 class="sub" style="margin-top:0">Needs sorting — ${un.length}</h3><div class="tablewrap"><table class="cmp"><thead><tr><th>File</th><th style="text-align:left">Item</th><th style="text-align:left">Whose</th></tr></thead><tbody>${D().files.map((f,i)=>[f,i]).filter(([f])=>f.item==='?'||f.party==='?').map(([f,i])=>`<tr><td style="text-align:left;white-space:normal">${esc(f.path)}</td><td style="text-align:left"><select data-dfi="${i}:item"><option value="?">—</option>${COC2.map(c=>`<option value="${c.id}" ${f.item===c.id?'selected':''}>${esc(c.short)}</option>`).join('')}<option value="other" ${f.item==='other'?'selected':''}>Not a 12.285 item</option></select></td><td style="text-align:left"><select data-dfi="${i}:party"><option value="?">—</option><option value="A" ${f.party==='A'?'selected':''}>${esc(pn('A'))}</option><option value="B" ${f.party==='B'?'selected':''}>${esc(pn('B'))}</option><option value="both" ${f.party==='both'?'selected':''}>Joint</option></select></td></tr>`).join('')}</tbody></table></div></div>`:''}
  <p class="note">Auto status follows the firm certificate rules: anything with a file is Produced, anything still to come is Will Be Produced, and Not Applicable only where the case shows the item doesn’t apply. Change any status with the menu; the certificate follows. Working tracker for attorney review.</p>`;}

 // ---------- certificate of compliance (firm format master) ----------
 async function cocDocx(k){const M=model(k);
  let x=dCaption('CERTIFICATE OF COMPLIANCE WITH MANDATORY DISCLOSURE')+wP(wR(`I, ${pn(k)}, certify that I have complied with the mandatory disclosure required by Florida Family Law Rule 12.285 as follows:`),{after:160,jc:'both'})+wP(wR('FOR INITIAL, SUPPLEMENTAL, AND PERMANENT FINANCIAL RELIEF:',{b:true}),{after:160});
  M.forEach(it=>{x+=wP([wR(`(${it.mk}) `,{b:true}),wR(it.t)],{after:100,jc:'both'});
   if(it.mk==='Produced'&&!it.fa&&!it.noList&&it.files.length){x+=wP(wR('The following were produced:'),{after:60,ind:[720,0]});
    it.files.forEach(f=>{x+=wP(wR(fline(f)),{after:40,ind:[1080,0]});});
    it.cover.filter(c=>c.fwd!=null&&c.g!=='years').forEach(c=>{x+=wP(wR(`Statements from ${MN[c.fwd%12].replace('Sep','September').replace('Jan','January').replace('Feb','February').replace('Mar','March').replace('Apr','April').replace('Jun','June').replace('Jul','July').replace('Aug','August').replace('Oct','October').replace('Nov','November').replace('Dec','December')} ${Math.floor(c.fwd/12)} forward will be produced.`),{after:60,ind:[1080,0]});});}});
  x+=wP(wR('I understand that I am swearing or affirming under oath to the accuracy of my compliance with the mandatory disclosure requirements of Fla. Fam. L. R. P. 12.285 and that, unless otherwise indicated with specificity, this disclosure is complete. I further understand that the punishment for knowingly making a false statement or incomplete disclosure includes fines and/or imprisonment.'),{before:200,after:200,jc:'both'});
  x+=wP(wR('__________________________________'),{before:480})+wP(wR(pn(k)));
  x+=dNote('Auto-filled from the disco tracker. Confirm each marker and each listed document against the production before the client signs. Lines are drawn from file names — conform institution, account ending and period.');
  const blob=await buildDocx(x,'',dFoot('Certificate of Compliance with Mandatory Disclosure'),'Certificate of Compliance');
  if(blob)await saveFile(`${fileBase()} ${role(k)} Certificate of Compliance - Attorney Review Draft.docx`,blob);}
 function cocPreview(k){const M=model(k);return `<div class="faprev" style="max-width:820px"><p class="ttl">CERTIFICATE OF COMPLIANCE WITH MANDATORY DISCLOSURE</p><p>I, ${esc(pn(k))}, certify that I have complied with the mandatory disclosure required by Florida Family Law Rule 12.285 as follows:</p><p class="h2">FOR INITIAL, SUPPLEMENTAL, AND PERMANENT FINANCIAL RELIEF:</p>
  ${M.map(it=>`<p><b>(${esc(it.mk)})</b> ${esc(it.short)}</p>${it.mk==='Produced'&&!it.fa&&!it.noList&&it.files.length?`<p style="margin-left:24px">The following were produced:</p>${it.files.map(f=>`<p style="margin-left:48px">${esc(fline(f))}</p>`).join('')}${it.cover.filter(c=>c.fwd!=null&&c.g!=='years').map(c=>`<p style="margin-left:48px">Statements from ${ymS(c.fwd)} forward will be produced.</p>`).join('')}`:''}`).join('')}
  <p class="note">Preview uses short item names; the Word draft carries the full format-master wording and ends with the party’s signature.</p></div>`;}
 window.DISCO={model,owed,produced,trk,cocDocx,cocPreview,scan};

 // ---------- boards ----------
 const BT=TABS31.find(x=>x[0]==='case');if(BT)BT[2]=BT[2].filter(x=>x[0]!=='boards');
 if(!TABS31.some(x=>x[0]==='boards')){const j=TABS31.findIndex(x=>x[0]==='cdisc');TABS31.splice(j<0?TABS31.length:j,0,['boards','Boards',[['bmed','Mediation prep'],['bhear','Hearing prep'],['btrial','Trial prep']]]);}
 Object.assign(SEC_TIER,{bmed:'ultra',bhear:'ultra',btrial:'ultra'});
 function B(kind){S.boards=S.boards||{};S.boards[kind]=S.boards[kind]||{};return S.boards[kind];}
 const firmMode=()=>/family matters/i.test(firmName()||'');
 const SKILL=k=>({med:firmMode()?'fmlg-mediation-board':'your firm’s mediation board skill',hear:firmMode()?'fmlg-trial-board (hearing board)':'your firm’s hearing board skill',trial:firmMode()?'fmlg-trial-board':'your firm’s trial board skill'})[k];
 const FIELDS={med:[['when','Session date & time'],['fmt','Format & mediator’s join details'],['who','Mediator · fee split'],['oc','Opposing counsel'],['floor','Client floor (non-negotiables)','ta'],['frame','Working frame — opener / middle ground per issue','ta'],['check','Before-the-session checklist (one per line)','ta']],
  hear:[['when','Hearing date & time'],['judge','Judge / GM'],['type','Hearing on (motion / relief)'],['oc','Opposing counsel'],['scope','Scope decision & bottom line','ta'],['wit','Witnesses — ours then theirs (one per line)','ta'],['order','Governing order requirements (one per line)','ta']],
  trial:[['when','Trial date & time'],['judge','Judge / GM'],['oc','Opposing counsel'],['goals','Client goals — one per line; end a line with [not pled] if the relief isn’t in the pleadings','ta'],['wit','Witnesses — ours then theirs (one per line)','ta'],['order','Trial order requirements (one per line)','ta'],['mines','Landmines — bad fact | our answer (one per line)','ta']]};
 const lines=v=>String(v||'').split(/\n/).map(s=>s.trim()).filter(Boolean);
 function boardModel(kind){const b=B(kind);const k=ours(),o=opp();const iss=issuesOf();const e=EDC||edCompute();let G=[];try{G=gaps();}catch(x){}
  const sc=[{name:'Current inputs',v:R.final,p:R.payer}].concat((S.scenarios||[]).map(s=>{let r={};try{r=calcFor(s);}catch(x){}return {name:s.name,v:r.final,p:r.payer};}));
  const exh=D().files.filter(f=>f.item!=='?'&&f.item!=='other');
  const goals=lines(b.goals).map(g=>({g:g.replace(/\[not pled\]/i,'').trim(),np:/\[not pled\]/i.test(g)}));
  return {b,k,o,iss,e,G,sc,exh,goals,ow:owed(o),owO:owed(k)};}
 function boardHTML(kind){const m=boardModel(kind),b=m.b;const title={med:'Mediation Board',hear:'Hearing Board',trial:'Trial Board'}[kind];const cap=S.meta.caption||`${pn('A')} v. ${pn('B')}`;
  const E=t=>esc(t);const tabs=[];const T=(id,l,h)=>tabs.push([id,l,h]);
  const banner=kind==='med'?'Attorney work product · Confidential mediation communication — §§ 44.401–44.406, Fla. Stat. · Internal — not for filing or service.':'Attorney work product · Privileged · NOT FILED · Nothing on this board is cleared for filing or service.';
  const cards=(arr)=>`<div class="cards">${arr.map(([l,v])=>`<div class="card"><span>${E(l)}</span><b>${v}</b></div>`).join('')}</div>`;
  const ck=(id,txt)=>`<label class="ck"><input type="checkbox" data-ck="${E(id)}"> ${E(txt)}</label>`;
  const csTab=`<h2>Child support</h2>${cards([['Guideline now',fmc(R.final)+'/mo'],['Paid by',R.payer?E(pn(R.payer)):'—'],['Overnights',`${fm(R.ovA,1)} / ${fm(R.ovB,1)}`]])}<table><tr><th>Scenario</th><th>Support</th><th>Paid by</th></tr>${m.sc.map(s=>`<tr><td>${E(s.name)}</td><td class="n">${fmc(s.v)}</td><td>${s.p?E(pn(s.p)):'—'}</td></tr>`).join('')}</table><p class="warn">Estimates — § 61.30 requires attorney verification; the filing instrument is the guidelines worksheet. Gross-up applies only when each parent has 73+ overnights.</p>`;
  const edTab=(m.e&&m.e.rows&&m.e.rows.length)?`<h2>Equitable distribution</h2><table><tr><th>Item</th><th>Value</th><th>Note</th></tr>${m.e.rows.map(r=>`<tr><td>${E(itemLabel(r.it))}</td><td class="n">${fmc(r.val&&r.val.v!=null?r.val.v:num(r.it.valDoc||r.it.valP||r.it.valR))}</td><td>${E(r.it.source||'')}${r.val&&r.val.conflict?' · values disputed':''}</td></tr>`).join('')}</table><p class="warn">Values from the case file — not discovery-verified where marked. Characterization is the attorney’s call; the board never classifies property.</p>`:'';
  const alTab=(R.alAmt||(S.aa&&S.aa.enabled))?`<h2>Alimony</h2>${cards([['Working amount',fmc(R.alAmt||0)+'/mo']])}<p class="warn">Numbers only. § 61.08 figures are ceilings that require statute verification.</p>`:'';
  const discoTab=`<h2>Discovery</h2><h3>Still owed by ${E(pn(m.o))}</h3><ul>${m.ow.map(x=>`<li>${E(x.short)}</li>`).join('')||'<li>Nothing open.</li>'}</ul><h3>Still owed by our client</h3><ul>${m.owO.map(x=>`<li>${E(x.short)}</li>`).join('')||'<li>Nothing open.</li>'}</ul><h3>Gaps</h3><ul>${m.G.slice(0,25).map(g=>`<li>${E(g.area)} — ${E(g.item)}: ${E(g.gap)}</li>`).join('')}</ul>`;
  if(kind==='med'){
   T('session',S.children.length?'Children & Session':'Session & Posture',`${cards([['Session',E(b.when||'UNVERIFIED')],['Mediator',E(b.who||'—')],['Client',E(pnr(m.k))],['Opposing counsel',E(b.oc||'—')]])}${b.fmt?`<p><b>Join:</b> ${E(b.fmt)}</p>`:''}${S.children.length?`<h3>Children</h3><ul>${S.children.map(c=>`<li>${E((c.name||'Child').split(/\s+/).map(w=>w[0]).join('.'))}.${c.dob?' · DOB on file':''}</li>`).join('')}</ul>`:''}<h3>Issues</h3><ul>${m.iss.map(x=>`<li>${E(x[1])}</li>`).join('')}</ul>${b.floor?`<div class="floor"><b>Client floor</b><br>${E(b.floor).replace(/\n/g,'<br>')}</div>`:'<div class="floor"><b>Client floor</b> — attorney to set before the session.</div>'}${b.frame?`<h3>Working frame</h3><p>${E(b.frame).replace(/\n/g,'<br>')}</p>`:''}<h3>Before the session</h3>${(lines(b.check).length?lines(b.check):['Client prepped on process and confidentiality','Authority limits confirmed with client','Updated financial affidavit served','Proposed parenting plan and worksheet ready']).map((t,i)=>ck('chk'+i,t)).join('')}`);
   T('notes','Session Notes',`<p class="note">Add breakout notes during the session.</p><textarea data-keep="notes" rows="10" style="width:100%"></textarea>`);
   if(edTab)T('ed','Equitable Distribution',edTab);
   T('cs','Child Support',csTab);if(alTab)T('al','Alimony',alTab);T('disco','Discovery',discoTab);}
  else{const isT=kind==='trial';
   T('snap','Snapshot & Scope',`${cards([[isT?'Trial':'Hearing',E(b.when||'UNVERIFIED')],['Case',E(cap)+(S.meta.caseNo?' · '+E(S.meta.caseNo):'')],['Judge / GM',E(b.judge||'UNVERIFIED')],['Bottom line',E((b.scope||'').split('\n')[0]||'Attorney to set')]])}${!isT&&b.type?`<p><b>Hearing on:</b> ${E(b.type)}</p>`:''}${b.scope?`<h3>Scope</h3><p>${E(b.scope).replace(/\n/g,'<br>')}</p>`:''}${isT&&m.goals.some(g=>g.np)?`<div class="flag"><b>RED FLAG — relief sought that is not pled:</b><ul>${m.goals.filter(g=>g.np).map(g=>`<li>${E(g.g)}</li>`).join('')}</ul>Amend or address before trial.</div>`:''}`);
   T('comp','Compliance',`<table><tr><th>Requirement</th><th>Status</th></tr>${(lines(b.order).length?lines(b.order):['Witness and exhibit lists filed','Exhibits exchanged','Proposed parenting plan and worksheets','Mediation completed / impasse filed','Current financial affidavits','Hard copies for the court','Redaction — Rules 2.420 / 2.425','Interpreter','Court reporter','Outstanding orders']).map((t,i)=>`<tr><td>${E(t)}</td><td>${ck('c'+i,'done')}</td></tr>`).join('')}</table><p class="warn">Check the assigned judge’s procedures live before the hearing.</p>`);
   T('wit','Witnesses',`<ul>${lines(b.wit).map(w=>`<li>${E(w)}</li>`).join('')||'<li>Add witnesses on the prep page.</li>'}</ul><p class="warn">No child witness without an attorney decision and a prior order (Rule 12.407).</p>`);
   T('exh','Evidence & Exhibits',`<table><tr><th>Document</th><th>Whose</th><th>Item</th></tr>${m.exh.map(f=>`<tr><td>${E(fline(f))}</td><td>${f.party==='both'?'Joint':E(pn(f.party))}</td><td>${E((COC2.find(c=>c.id===f.item)||{short:''}).short)}</td></tr>`).join('')||'<tr><td colspan="3">Scan the client folder on the disco tabs to list exhibits.</td></tr>'}</table>`);
   if(isT)T('factors','Factor Matrix',`<table><tr><th>Goal</th><th>Pled?</th><th>Proof</th></tr>${m.goals.map(g=>`<tr><td>${E(g.g)}</td><td>${g.np?'<b class="bad">NO</b>':'Yes'}</td><td></td></tr>`).join('')||'<tr><td colspan="3">Add client goals on the prep page.</td></tr>'}</table>${lines(b.mines).length?`<h3>Landmines</h3><ul>${lines(b.mines).map(l=>{const [a,c]=l.split('|');return `<li><b>${E(a)}</b>${c?' — '+E(c):''}</li>`;}).join('')}</ul>`:''}`);
   T('nums','Numbers',csTab+(alTab||'')+(edTab||''));
   T('law','Case Law',`<p class="warn">Authority comes only from the matter’s filed documents and the firm reference library — never memory or web search. Every citation requires attorney verification. Run the full board build to fill this tab.</p>`);
   T('punch','Punch List',`${[...m.goals.filter(g=>g.np).map(g=>'Relief not pled: '+g.g),...m.ow.map(x=>'Missing from '+pn(m.o)+': '+x.short),'Save board to the matter root','Log time'].map((t,i)=>ck('p'+i,t)).join('')}`);
   T('day','Day-Of',['Orders and notices (stamped)','Exhibit sets — redacted and pre-marked','Filed witness & exhibit lists, both sides','Reports and transcripts','Proof of service','Outlines','Client arrival and check-in','Court reporter'].map((t,i)=>ck('d'+i,t)).join(''));}
  const key='laia-board-'+kind+'-'+(S.meta.caseNo||'case');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(pn(m.k).split(' ').pop())} ${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:ital,wght@0,600;1,500&display=swap" rel="stylesheet">
<style>:root{--pink:#FF1F8E;--orange:#FF6B00;--lime:#C8D400;--teal:#00B5B8;--ink:#0D0D0D;--paper:#F7F5F0;--card:#fff;--line:#DDDDDD;--muted:#666}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#F7F5F0;--paper:#0D0D0D;--card:#1A1A1A;--line:#333;--muted:#aaa}}
body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.5 Lato,Arial,sans-serif}.bar{display:grid;grid-template-columns:repeat(4,1fr);height:6px}.bar i:nth-child(1){background:var(--pink)}.bar i:nth-child(2){background:var(--orange)}.bar i:nth-child(3){background:var(--lime)}.bar i:nth-child(4){background:var(--teal)}
.mast{background:#0D0D0D;color:#F7F5F0;padding:16px 20px}.mast h1{margin:0;font-size:24px;font-weight:900}.mast p{margin:2px 0 0;font-family:'Playfair Display',serif;font-style:italic;color:#ccc}.ban{background:var(--orange);color:#0D0D0D;font-weight:900;font-size:12.5px;padding:6px 20px}
nav{display:flex;gap:4px;flex-wrap:wrap;padding:8px 16px;background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0}nav button{border:0;background:none;font:900 13.5px Lato;padding:8px 10px;border-bottom:3px solid transparent;cursor:pointer;color:inherit}nav button.on{border-color:var(--pink)}
main{max-width:1100px;margin:0 auto;padding:18px 16px 50px}section{display:none}section.on{display:block}h2{font-size:22px;margin:4px 0 10px}h3{font-family:'Playfair Display',serif;font-weight:600;margin:16px 0 6px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:0 0 12px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column}.card span{font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.card b{font-size:17px}
table{width:100%;border-collapse:collapse;background:var(--card);margin:6px 0 12px}th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{font-size:11px;letter-spacing:.06em;text-transform:uppercase}td.n{text-align:right;font-variant-numeric:tabular-nums}
.warn{font-size:13px;border-left:4px solid var(--orange);padding:6px 10px;background:rgba(255,107,0,.08)}.flag{border-left:6px solid var(--pink);background:rgba(255,31,142,.1);padding:10px 12px;font-weight:700;margin:10px 0}.bad{color:var(--pink)}.floor{border:2px solid var(--pink);border-radius:10px;padding:10px 12px;margin:10px 0}
.ck{display:block;padding:4px 0}.note{color:var(--muted);font-size:13px}footer{font-size:12px;color:var(--muted);padding:14px 20px;border-top:1px solid var(--line)}
@media print{nav{display:none}section{display:block!important;page-break-after:always}}</style></head><body>
<div class="ban">${E(banner)}</div><div class="mast"><h1>${E(cap)} — ${title}</h1><p>${E(pnr(m.k))} · ${E(S.meta.caseNo||'')} · Built ${E(usd(today()))} from the Laia case file</p></div><div class="bar"><i></i><i></i><i></i><i></i></div>
<nav>${tabs.map(([id,l],i)=>`<button type="button" data-t="${id}" class="${i?'':'on'}">${E(l)}</button>`).join('')}<button type="button" onclick="window.print()">Print all</button></nav>
<main>${tabs.map(([id,l,h],i)=>`<section id="t-${id}" class="${i?'':'on'}">${h}</section>`).join('')}</main>
<footer>Sources: Laia case file for ${E(cap)} (built ${E(usd(today()))}); disco tracker scan ${E(D().scannedAt?new Date(D().scannedAt).toLocaleDateString():'not run')}. AI-assisted working board — attorney verification required. Nothing here is cleared for filing, service or transmission outside the firm. Checkboxes save in this browser only and do not sync between people.</footer><div class="bar"><i></i><i></i><i></i><i></i></div>
<script>(function(){var K=${JSON.stringify(key)};var st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
document.querySelectorAll('nav button[data-t]').forEach(function(b){b.onclick=function(){document.querySelectorAll('nav button').forEach(function(x){x.classList.remove('on')});document.querySelectorAll('section').forEach(function(s){s.classList.remove('on')});b.classList.add('on');document.getElementById('t-'+b.dataset.t).classList.add('on')}});
document.querySelectorAll('[data-ck]').forEach(function(c){c.checked=!!st[c.dataset.ck];c.onchange=function(){st[c.dataset.ck]=c.checked;try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}});
document.querySelectorAll('[data-keep]').forEach(function(t){t.value=st['t_'+t.dataset.keep]||'';t.oninput=function(){st['t_'+t.dataset.keep]=t.value;try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}});})();<\/script></body></html>`;}
 let boardShown={},boardManual={};
 document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.dataset&&d.dataset.bman)boardManual[d.dataset.bman]=d.open;},true);
 function boardPage(kind){const g=uGate();if(g)return g;const b=B(kind);const L={med:['Mediation prep','Built to the mediation board standard: session & posture, client floor, ED, child support, alimony and discovery — from this case file.'],hear:['Hearing prep','Built to the hearing board standard: snapshot & scope, compliance, witnesses, exhibits, numbers, case law, punch list and day-of.'],trial:['Trial prep','Built to the trial board standard: client goals worked back to pleadings and proof, with a red flag on any relief that was never pled.']}[kind];
  const filled=FIELDS[kind].filter(([id])=>has(b[id])).length;
  return `<h1 class="sec">${L[0]}</h1><p class="lede">${L[1]}</p>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn pink" type="button" data-act="bgen" data-k="${kind}">${boardShown[kind]?'⟳ Regenerate':'Generate now'}</button><button class="btn" type="button" data-act="bfull" data-k="${kind}">✦ Full build with ${esc(SKILL(kind))}</button>${boardShown[kind]?`<button class="btn" type="button" data-act="bdl" data-k="${kind}">Download board (.html)</button>`:''}<span class="note">Builds straight from the case file. Anything it can’t find is marked UNVERIFIED.</span></div>
  <details class="panel" data-bman="${kind}" ${boardManual[kind]?'open':''}><summary style="cursor:pointer;font-weight:900">Enter details manually${filled?` <span class="pill shared">${filled} filled</span>`:' <span class="note" style="font-weight:400">(optional)</span>'}</summary>
  <div class="grid2" style="margin-top:12px">${FIELDS[kind].map(([id,l,t])=>`<div class="fld" ${t?'style="grid-column:1/-1"':''}><label for="bf-${kind}-${id}">${esc(l)}</label>${t?`<textarea id="bf-${kind}-${id}" data-bf="${kind}:${id}" rows="4">${esc(b[id]||'')}</textarea>`:`<input id="bf-${kind}-${id}" type="text" data-bf="${kind}:${id}" value="${esc(b[id]||'')}">`}</div>`).join('')}</div>
  <div style="margin-top:10px"><button class="btn pink sm" type="button" data-act="bgen" data-k="${kind}">Generate with these details</button></div></details>
  ${boardShown[kind]?`<div class="panel" style="padding:0;overflow:hidden"><iframe title="${esc(L[0])} board preview" sandbox="allow-scripts" style="width:100%;height:78vh;border:0;display:block" srcdoc="${esc(boardHTML(kind))}"></iframe></div>`:''}
  <p class="note">The in-app board is built from the case file. The full build runs the firm skill in the client’s project — it rescans the matter folder, email and case channel, adds examination outlines and library case law, and saves the dated board to the matter root. Nothing on a board is cleared for filing.</p>`;}
 async function bFull(kind){const label={med:'mediation board',hear:'hearing board',trial:'trial board'}[kind];
  const prompt=`Run ${SKILL(kind)} for ${S.meta.caption||(pn('A')+' v. '+pn('B'))}${S.meta.caseNo?' (Case No. '+S.meta.caseNo+')':''}. Build the ${label} per the skill and firm rules, starting from the attached Laia case file and board prep notes. Our client: ${pnr(ours())}.`;
  try{await navigator.clipboard.writeText(prompt);}catch(e){}
  if(window.LAIA_DEMO){demoPreview('Full board build',`<p>In the licensed version this hands the case to your AI assistant with the firm’s board skill. It rescans the matter folder, email and case channel, then builds and saves the dated board.</p><p class="note">What it would be asked:</p><div style="background:var(--surface2);border-radius:8px;padding:10px 12px;font-size:12.5px">${esc(prompt)}</div>`);return;}
  await saveFile(`${fileBase()} ${label} build packet.json`,JSON.stringify({kind,prompt,boardPrep:B(kind),caseFile:S},null,1));
  toast('Prompt copied and packet saved — paste it in the client’s project with the packet attached.');}

 // ---------- retro from saved scenarios ----------
 const scR=RENDER.scenarios;RENDER.scenarios=function(){const h=scR.apply(this,arguments);if(!(S.scenarios||[]).length||EDN_RANK[edition()]<EDN_RANK.ultra)return h;
  return h+`<div class="panel" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><b>Retro by year?</b><span class="note">Save one scenario per year (2024 income, 2025 income…), then send them to Charts & summaries.</span><button class="btn" type="button" data-act="sc2retro">Use saved scenarios as retro periods →</button></div>`;};
 function sc2retro(){S.retro=S.retro||{};S.retro.periods=S.retro.periods||[];const have=new Set(S.retro.periods.map(p=>p.sc));
  (S.scenarios||[]).forEach(sc=>{if(have.has(sc.id))return;const y=(String(sc.name||'').match(/20\d\d/)||[])[0];S.retro.periods.push({label:sc.name||'',start:y?y+'-01-01':'',end:y?y+'-12-31':'',sc:sc.id,cs:'',al:''});});
  S.meta.issues=S.meta.issues||{};if(Object.keys(S.meta.issues).length)S.meta.issues.retro=true;touch();go('retrocs');toast('Periods added — set any dates that aren’t a calendar year');}

 // ---------- wire ----------
 Object.assign(RENDER,{cdtrk:()=>trk(ours()),odtrk:()=>trk(opp()),bmed:()=>boardPage('med'),bhear:()=>boardPage('hear'),btrial:()=>boardPage('trial'),boards:()=>boardPage('med')});
 const goB=go;go=function(s){if(s==='boards')s='bmed';return goB(s);};
 const sa=suiteAct;suiteAct=async function(a,b){switch(a){
  case 'dscan':await scan();return true;case 'dai':await aiClassify();return true;
  case 'ucoc3':await cocDocx(b.dataset.k);return true;
  case 'bgen':boardShown[b.dataset.k]=true;render();setTimeout(()=>{const f=document.querySelector('#main iframe');if(f)f.scrollIntoView({block:'start'});},60);return true;
  case 'bdl':await saveFile(`${new Date().toISOString().slice(0,10)} ${pn(ours()).split(' ').pop()} ${({med:'Mediation',hear:'Hearing',trial:'Trial'})[b.dataset.k]} Board.html`,new Blob([boardHTML(b.dataset.k)],{type:'text/html'}));return true;
  case 'bfull':await bFull(b.dataset.k);return true;case 'sc2retro':sc2retro();return true;}
  return sa(a,b);};
 document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset)return;
  if(t.dataset.dmk){const [k,id]=t.dataset.dmk.split(':');if(t.value)D().ov[k][id]=t.value;else delete D().ov[k][id];touch();render();}
  if(t.dataset.dfi){const [i,f]=t.dataset.dfi.split(':');const x=D().files[+i];if(x){x[f]=t.value;touch();render();}}
  if(t.dataset.bf){const [k,f]=t.dataset.bf.split(':');B(k)[f]=t.value;touch();}});
 try{render();}catch(e){console.error(e);}
})();
