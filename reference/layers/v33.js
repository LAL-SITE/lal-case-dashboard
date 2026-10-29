// ===== v3.3 (Office Hours 10/29): Product guide first · Client disco / OP disco tabs with assessments · Retro tab (only when in play) with charts & summaries · Create boards =====
(function(){
 // ---------- tabs ----------
 const gi=TABS31.findIndex(x=>x[0]==='guide');
 if(gi>0){const g=TABS31.splice(gi,1)[0];TABS31.unshift(g);}
 const di=TABS31.findIndex(x=>x[0]==='disc');
 if(di>=0)TABS31.splice(di,1);
 const at=()=>{const i=TABS31.findIndex(x=>x[0]==='draft');return i>=0?i+1:TABS31.length;};
 if(!TABS31.some(x=>x[0]==='cdisc'))TABS31.splice(at(),0,
  ['cdisc','Client disco',[['cdtrk','Tracker'],['cdasm','Assessments'],['cdresp','Responses & compliance']]],
  ['odisc','OP disco',[['odtrk','Tracker'],['odasm','Assessments'],['odreq','Requests & follow-up']]]);
 const RETRO_TAB=['retro','Retro',[['retro','Retroactive calculator'],['retrocs','Charts & summaries']]];
 const cs=TABS31.find(x=>x[0]==='case');
 Object.assign(SEC_TIER,{cdtrk:'ultra',cdasm:'ultra',cdresp:'ultra',odtrk:'ultra',odasm:'ultra',odreq:'ultra',retrocs:'ultra'});

 window.retroInPlay=function(){try{return issuesOf().some(x=>x[0]==='retro')||has(S.retro&&S.retro.start)||has(S.memo&&S.memo.retroStart)||((S.retro&&S.retro.periods)||[]).length>0;}catch(e){return false;}};
 function syncRetroTab(){const i=TABS31.findIndex(x=>x[0]==='retro');const want=retroInPlay()||sec==='retro'||sec==='retrocs';
  if(want&&i<0){const j=TABS31.findIndex(x=>x[0]==='cdisc');TABS31.splice(j<0?TABS31.length:j,0,RETRO_TAB);}
  else if(!want&&i>=0)TABS31.splice(i,1);}
 const ALIAS={dinc:'cdasm',dgap:'cdasm',dreq:'odreq',dcoc:'cdresp'};
 const goV33=go;go=function(s){if(ALIAS[s]){if(s==='dinc')ASM[ours()]='inc';if(s==='dgap')ASM[ours()]='gap';s=ALIAS[s];}return goV33(s);};
 const renderV33=render;render=function(){try{syncRetroTab();}catch(e){}return renderV33.apply(this,arguments);};

 // ---------- helpers ----------
 const ours=()=>clientKey()||'B';
 const opp=()=>ours()==='A'?'B':'A';
 const T=k=>k==='A'?'P':'R';
 const ASM={};
 function coc(k){S.coc=S.coc||{};S.coc[k]=S.coc[k]||{};return S.coc[k];}
 function faInFile(k){return (S.ed.docs||[]).some(d=>d.role===(k==='A'?'faP':'faR'))||((faModel(k).inc||[]).some(x=>x.v>0));}

 function trkCard(k){const done=coc(k);const total=COC_ITEMS.length;const served=COC_ITEMS.filter((t,i)=>done[i]).length;
  let G=[];try{G=gaps().filter(x=>x.from===k||x.from==='both');}catch(e){}
  const pct=total?Math.round(served/total*100):0;const isOurs=k===ours();
  return `<div class="edsum" style="margin-bottom:14px"><div><span>Disclosure served</span><b>${served}/${total}</b></div><div><span>Still owed</span><b>${total-served}</b></div><div><span>Gaps to request</span><b>${G.length}</b></div><div class="hl"><span>${isOurs?'Our client':'Opposing party'}</span><b style="font-size:15px">${esc(pnr(k))}</b></div></div>
  <div class="bar2" title="${pct}% served"><i class="b" style="width:${pct}%"></i></div>
  <div class="panel"><h3 class="sub" style="margin-top:0">Rule 12.285 mandatory disclosure — ${isOurs?'what we have served':'what they have served us'}</h3>
  ${COC_ITEMS.map((t,i)=>`<label class="chk" style="margin:6px 0"><input type="checkbox" data-coc3="${k}:${i}" ${done[i]?'checked':''}> <span>${esc(t)}</span></label>`).join('')}
  <p class="note" style="margin:10px 0 0">Item wording is summarized — conform to the current Rule 12.285 and Form 12.932 before relying on it.</p></div>
  <div class="panel"><h3 class="sub" style="margin-top:0">Documents in the file</h3>${docList(k)}</div>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pink" type="button" data-act="go" data-sec="${isOurs?'cdasm':'odasm'}">Run assessments →</button><button class="btn" type="button" data-act="go" data-sec="eddocs">Add documents</button></div>`;}
 function docList(k){const D=(S.ed.docs||[]).filter(d=>d.role===(k==='A'?'faP':'faR')||d.role==='md');
  if(!D.length)return '<p class="note" style="margin:0">Nothing in the register yet. Add affidavits and statements on Equitable distribution → Documents & import.</p>';
  return `<div class="tablewrap"><table class="cmp"><thead><tr><th>Document</th><th style="text-align:left">Type</th><th style="text-align:left">Status</th></tr></thead><tbody>${D.map(d=>`<tr><td style="white-space:normal">${esc(d.label||d.fileName||'Document')}</td><td style="text-align:left">${esc(d.role==='md'?((MD_TYPES.find(x=>x[0]===d.mdType)||['','Disclosure'])[1]):roleLabel(d.role))}</td><td style="text-align:left">${d.importedAt?'Imported':'In register'}</td></tr>`).join('')}</tbody></table></div><p class="note">Statements without a party tag show on both trackers.</p>`;}

 // ---------- assessments ----------
 const ASMS=[['inc','Income analysis'],['gap','Gap assessment'],['famd','FA ↔ mandatory disclosure cross-check'],['fafa','FA ↔ other party’s FA'],['csin','Child support inputs check']];
 function aInc(k){return {title:'Income analysis — '+pnr(k),cols:['Item','Figure','Review'],rows:incRows(k).map(([a,b,c])=>[a,String(b).replace(/<[^>]+>/g,''),c]),info:true,note:'Imputation needs § 61.30(2)(b) findings. Statutory references require attorney verification.'};}
 function aGap(k){let G=[];try{G=gaps().filter(x=>x.from===k||x.from==='both');}catch(e){}
  return {title:'Gap assessment — '+pnr(k),cols:['Area','Item','Gap','Ask for'],rows:G.map(x=>[x.area,x.item,x.gap,x.ask]),empty:'No gaps found from what is in the file.'};}
 function edRows(){try{return (EDC||edCompute()).rows||[];}catch(e){return [];}}
 function aFamd(k){const t=T(k),me=k==='A'?'listedP':'listedR',other=k==='A'?'listedR':'listedP',fv=k==='A'?'valP':'valR';const rows=[];
  if(!faInFile(k))rows.push(['Financial affidavit','—','No financial affidavit for this party is in the file.','Serve or request Form 12.902(b)/(c).']);
  edRows().forEach(r=>{const it=r.it;const nm=itemLabel(it);const fa=num(it[fv]),doc=num(it.valDoc);const mine=it.title===t||!['P','R'].includes(it.title);
   if(has(it.valDoc)&&it[me]!=='Yes'&&mine)rows.push(['Missing from FA',nm,'A statement was produced but the item is not on this party’s affidavit.','Amend the FA or explain the omission.']);
   if(it[me]==='Yes'&&!has(it.valDoc)&&!['furniture','vehicle','home','business','jewelry','collect','tools','firearms'].includes(it.cat))rows.push(['No statement',nm,'Listed on the FA, but no statement or document supports the value.','Produce the most recent statement.']);
   if(it[me]==='Yes'&&has(it.valDoc)&&has(it[fv])){const d=Math.abs(fa-doc);if(d>500&&d/Math.max(1,Math.abs(doc))>0.1)rows.push(['Value differs',nm,`FA says ${fmc(fa)}; the statement shows ${fmc(doc)} (off by ${fmc(d)}).`,'Reconcile the date of valuation or amend the FA.']);}
  });
  const inc=incRows(k).find(x=>/financial affidavit/i.test(x[0]));if(inc&&/Differs/.test(inc[2]))rows.push(['Income',pn(k),inc[2],'Match FA lines 1–16 to the pay stubs and W-2s.']);
  const owed=window.DISCO?DISCO.owed(k):[];if(owed.length)rows.push(['Mandatory disclosure',pn(k),`${owed.length} Rule 12.285 item${owed.length===1?'':'s'} still to be produced: ${owed.map(x=>x.short).join('; ')}.`,'See the tracker.']);
  return {title:'FA ↔ mandatory disclosure cross-check — '+pnr(k),cols:['Check','Item','Finding','Next step'],rows,empty:'The affidavit and the disclosure in the file line up.'};}
 function aFafa(k){const o=k==='A'?'B':'A',me=k==='A'?'listedP':'listedR',ot=k==='A'?'listedR':'listedP',fv=k==='A'?'valP':'valR',ov=k==='A'?'valR':'valP';const rows=[];
  edRows().forEach(r=>{const it=r.it,nm=itemLabel(it);
   if(it[ot]==='Yes'&&it[me]!=='Yes')rows.push([nm,'—',fmc(num(it[ov])),`Only on ${pn(o)}’s affidavit.`]);
   else if(it[me]==='Yes'&&it[ot]!=='Yes')rows.push([nm,fmc(num(it[fv])),'—',`Only on ${pn(k)}’s affidavit.`]);
   else if(it[me]==='Yes'&&it[ot]==='Yes'&&Math.abs(num(it[fv])-num(it[ov]))>500)rows.push([nm,fmc(num(it[fv])),fmc(num(it[ov])),'Values disagree.']);});
  return {title:`FA comparison — ${pn(k)} vs. ${pn(o)}`,cols:['Item',pn(k),pn(o),'Finding'],rows,empty:'Both affidavits list the same items at matching values (or no Section III is in the file yet).'};}
 function aCsin(k){const p=S.parties[k];const rows=[];
  if(!has(p.source))rows.push(['Income source','Not recorded','Note pay stubs, W-2 or tax return as the source.']);
  if(!(p.wages||[]).length&&!num(p.seIncome))rows.push(['Wages','None entered','Confirm whether the party is employed or income should be imputed.']);
  if(num(p.healthChild)&&!(S.ed.docs||[]).some(d=>/insur/i.test(d.label||'')))rows.push(['Children’s health insurance',fmc(num(p.healthChild)),'Premium entered but no insurer statement in the file.']);
  const care=k==='A'?num(S.costs.careA):num(S.costs.careB);if(care)rows.push(['Child care',fmc(care),'Confirm with provider invoices (12 months).']);
  if(!rows.length)rows.push(['Inputs','Complete','Nothing missing from the child support inputs for this party.']);
  return {title:'Child support inputs check — '+pnr(k),cols:['Input','Value','Review'],rows};}
 const AFN={inc:aInc,gap:aGap,famd:aFamd,fafa:aFafa,csin:aCsin};
 function tbl(a){if(!a.rows.length)return `<p class="note" style="margin:0">${esc(a.empty||'Nothing to report.')}</p>`;
  return `<div class="tablewrap"><table class="cmp"><thead><tr>${a.cols.map((c,i)=>`<th style="${i?'text-align:left':''}">${esc(c)}</th>`).join('')}</tr></thead><tbody>${a.rows.map(r=>`<tr>${r.map(c=>`<td style="text-align:left;white-space:normal">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
 function asmPage(k){const g=uGate();if(g)return g;const isOurs=k===ours();const cur=ASM[k]||'all';
  const list=cur==='all'?ASMS.map(x=>x[0]):[cur];
  return `<h1 class="sec">${isOurs?'Client':'Opposing party'} assessments — ${esc(pnr(k))}</h1>
  <p class="lede">One click per check. Each runs on what is in the file right now — the ED inventory, both affidavits, the income entries and the disclosure tracker.</p>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ${cur==='all'?'primary':''}" type="button" data-act="asm" data-k="${k}" data-a="all">Run all</button>${ASMS.map(([id,l])=>`<button class="btn ${cur===id?'pink':''}" type="button" data-act="asm" data-k="${k}" data-a="${id}">${esc(l)}</button>`).join('')}</div>
  ${list.map(id=>{const a=AFN[id](k);return `<div class="panel"><h3 class="sub" style="margin-top:0">${esc(a.title)} <span class="pill ${a.rows.length&&!a.info?'sole':'shared'}">${a.rows.length} ${a.info?'line':'finding'}${a.rows.length===1?'':'s'}</span></h3>${tbl(a)}${a.note?`<p class="note" style="margin:8px 0 0">${esc(a.note)}</p>`:''}</div>`;}).join('')}
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pink" type="button" data-act="asmdocx" data-k="${k}">Download assessment memo (.docx)</button><button class="btn" type="button" data-act="asmai" data-k="${k}">✦ Deeper AI review</button><button class="btn ghost" type="button" data-act="go" data-sec="${isOurs?'cdresp':'odreq'}">${isOurs?'Responses & compliance →':'Turn findings into requests →'}</button></div>
  <div id="asmAI"></div>
  <p class="note">Working analysis for attorney review. Not legal advice; nothing is cleared for filing.</p>`;}
 async function asmDocx(k){const list=(ASM[k]&&ASM[k]!=='all')?[ASM[k]]:ASMS.map(x=>x[0]);
  let x=dCaption('DISCOVERY ASSESSMENT MEMO — '+pnr(k).toUpperCase())+dPara(`Prepared ${usd(today())} from the case file as it stands. Our client: ${pnr(ours())}.`,{note:'Internal work product. Verify every finding against the source documents.'});
  list.forEach(id=>{const a=AFN[id](k);x+=wP(wR(a.title,{b:true}),{before:200,after:80});
   x+=a.rows.length?wTbl([a.cols.map(c=>({t:c,b:true}))].concat(a.rows.map(r=>r.map(c=>({t:String(c)})))),a.cols.map(()=>Math.floor(9360/a.cols.length)),{head:true,sz:18}):dPara(a.empty||'Nothing to report.');});
  const blob=await buildDocx(x,usd(today()),dFoot('Discovery assessment memo'),'Discovery Assessment Memo');
  if(blob)await saveFile(`${fileBase()} ${role(k)} Discovery Assessment Memo - Attorney Review Draft.docx`,blob);}
 async function asmAI(k){const sm=await sampleNS();const box=$('#asmAI');
  if(!sm){toast('The deeper AI review runs when the app is opened from your AI workspace.');return;}
  if(box)box.innerHTML='<div class="panel">Reviewing…</div>';
  const snap=ASMS.map(([id])=>AFN[id](k)).map(a=>({title:a.title,rows:a.rows}));
  try{const out=await sm.json(`You are assisting a Florida family-law attorney. Review these discovery assessments for ${role(k)} (${k===ours()?'our client':'the opposing party'}) and return ONLY JSON {"priorities":[{"issue":string,"why":string,"next":string}]} with at most 8 priorities, most important first. Do not cite case law. Assessments: ${JSON.stringify(snap).slice(0,12000)}`,{modelTier:'quick'});
   const P=(out&&out.priorities)||[];if(box)box.innerHTML=`<div class="panel gai"><h3 class="sub" style="margin-top:0">✦ AI priorities</h3><ol style="margin:0;padding-left:20px">${P.map(p=>`<li><b>${esc(p.issue)}</b> — ${esc(p.why)} <span class="note">Next: ${esc(p.next)}</span></li>`).join('')}</ol><p class="note">AI-assisted. Attorney to verify.</p></div>`;}
  catch(e){if(box)box.innerHTML='';toast('The AI review didn’t finish. Try again.');}}

 // ---------- client responses & OP requests ----------
 function secCdResp(){const g=uGate();if(g)return g;const k=ours();const M=gaps().filter(x=>x.from===k||x.from==='both');const W=window.DISCO?DISCO.owed(k):[];
  return `<h1 class="sec">Responses & compliance — ${esc(pnr(k))}</h1><p class="lede">The certificate of compliance fills itself from the client folder scan, in the firm format: (Produced), (Will Be Produced) or (Not Applicable), with the documents listed under each item produced.</p>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pink" type="button" data-act="ucoc3" data-k="${k}">Certificate of compliance (.docx)</button><button class="btn" type="button" data-act="dscan">⟳ Scan & update</button><button class="btn" type="button" data-act="go" data-sec="cdtrk">Change a status</button><button class="btn" type="button" data-act="ureqpack">Discovery drafting packet (.json)</button></div>
  ${window.DISCO?DISCO.cocPreview(k):''}
  <div class="panel"><h3 class="sub" style="margin-top:0">Still to produce — ${W.length}</h3><ul style="margin:0;padding-left:20px">${W.map(x=>`<li>${esc(x.short)}</li>`).join('')||'<li>Nothing open.</li>'}</ul>
  <h3 class="sub">Gaps the other side will ask about — ${M.length}</h3><ol style="margin:0;padding-left:22px">${M.map(x=>`<li>${esc(x.ask)} <span class="note">(${esc(x.area)})</span></li>`).join('')||'<li>Nothing open.</li>'}</ol></div>
  <p class="note">Written responses and objections are drafted on the firm template with the Discovery Responses skill. Working draft for attorney review; the client signs the certificate.</p>`;}
 function secOdReq(){const g=uGate();if(g)return g;const o=opp();const G=gaps().filter(x=>x.from===o||x.from==='both');const owed=(window.DISCO?DISCO.owed(o):[]).map(x=>x.t);
  return `<h1 class="sec">Requests & follow-up — ${esc(pnr(o))}</h1><p class="lede">Targeted requests built from the gap assessment, and a deficiency letter for mandatory disclosure they have not produced.</p>
  <div class="panel"><h3 class="sub" style="margin-top:0">Request for production — ${G.length} requests</h3><ol style="margin:0;padding-left:22px">${G.map(x=>`<li>${esc(x.ask)}</li>`).join('')||'<li>No gaps found.</li>'}</ol>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn pink" type="button" data-act="ureqdocx">Request for production (.docx)</button><button class="btn" type="button" data-act="advdocx" data-k="rfa">Requests for admission (.docx)</button><button class="btn" type="button" data-act="advdocx" data-k="rog">Interrogatories (.docx)</button><button class="btn" type="button" data-act="advdocx" data-k="sub">Subpoena to employer (.docx)</button></div></div>
  <div class="panel"><h3 class="sub" style="margin-top:0">Mandatory disclosure not yet produced — ${owed.length}</h3><ul style="margin:0;padding-left:20px">${(window.DISCO?DISCO.owed(o):[]).map(x=>`<li>${esc(x.short)}</li>`).join('')||'<li>Everything applicable is produced.</li>'}</ul>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn pink" type="button" data-act="deflet" ${owed.length?'':'disabled'}>Deficiency / good-faith letter (.docx)</button><button class="btn" type="button" data-act="go" data-sec="odtrk">Open the OP tracker</button></div></div>
  <p class="note">Working drafts for attorney review. Confirm rule citations and deadlines before sending.</p>`;}
 async function defLetter(){const o=opp(),k=ours();const owed=(window.DISCO?DISCO.owed(o):[]).map(x=>x.t);
  let x=wP(wR(usd(today())),{after:240})+wP(wR('RE: '+(S.meta.caption||`${pn('A')} v. ${pn('B')}`)+(S.meta.caseNo?' — Case No. '+S.meta.caseNo:''),{b:true}),{after:240})+dPara('Dear Counsel:')+dPara(`Our records show that ${pnr(o)} has not yet served the following mandatory disclosure under Florida Family Law Rule of Procedure 12.285:`,{note:'Confirm the service date of the petition/answer and the 45-day deadline before sending.'});
  owed.forEach((t,i)=>{x+=wP([wR(`${i+1}. `,{b:true}),wR(t)],{after:80,ind:[360,360]});});
  x+=dPara('Please serve these items within ten (10) days of this letter. This letter is our good-faith attempt to resolve the matter without court intervention; if the items are not received, we will move to compel.',{note:'Adjust the deadline and the motion language to the judge’s procedures.'})+dPara('Sincerely,')+wP(wR('_________________________________'),{before:480})+wP(wR('Attorney for '+role(k)));
  const blob=await buildDocx(x,usd(today()),dFoot('Mandatory disclosure deficiency letter'),'Deficiency Letter');
  if(blob)await saveFile(`${fileBase()} Mandatory Disclosure Deficiency Letter to ${role(o)} - Attorney Review Draft.docx`,blob);}

 // ---------- retro: charts & summaries by period ----------
 function periods(){S.retro=S.retro||{};S.retro.periods=S.retro.periods||[];return S.retro.periods;}
 function perAmt(p){if(p.sc&&p.sc!=='manual'){const sc=(S.scenarios||[]).find(x=>x.id===p.sc);if(sc)try{return calcFor(sc).final;}catch(e){}}if(p.sc==='current')return R.final;return num(p.cs);}
 function months(a,b){if(!a||!b)return 0;const d1=new Date(a+'T00:00:00'),d2=new Date(b+'T00:00:00');return Math.max(0,(d2.getFullYear()-d1.getFullYear())*12+(d2.getMonth()-d1.getMonth())+1);}
 function perModel(){const P=periods().map(p=>{const m=months(p.start,p.end);const cs=perAmt(p);const al=num(p.al);return {...p,m,cs,al,due:(cs+al)*m};});const total=P.reduce((s,p)=>s+p.due,0);const paid=num(S.retro.paidAll);return {P,total,paid,owed:Math.max(0,total-paid)};}
 function perChart(P){if(!P.length)return '';const W=640,H=40+P.length*34,left=170,max=Math.max(1,...P.map(p=>p.due));
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Accrued support by period" style="width:100%;height:auto">${P.map((p,i)=>{const y=20+i*34,w=(W-left-110)*p.due/max;return `<text x="0" y="${y+14}" font-size="12" fill="currentColor">${esc((p.label||p.start||'Period').slice(0,24))}</text><rect x="${left}" y="${y}" width="${Math.max(2,w)}" height="20" rx="4" fill="${['#FF1F8E','#FF6B00','#C8D400','#00B5B8'][i%4]}"/><text x="${left+w+8}" y="${y+14}" font-size="12" fill="currentColor">${esc(fmc(p.due))}</text>`;}).join('')}</svg>`;}
 function secRetroCS(){if(EDN_RANK[edition()]<EDN_RANK.ultra)return lockHTML('ultra');const M=perModel();
  const opts=`<option value="manual">Enter amount</option><option value="current">Current inputs (${fm(R.final)})</option>`+(S.scenarios||[]).map(sc=>{let f='';try{f=fm(calcFor(sc).final);}catch(e){}return `<option value="${esc(sc.id)}">${esc(sc.name||'Scenario')} (${f})</option>`;}).join('');
  return `<h1 class="sec">Charts & summaries</h1><p class="lede">Build retro one period at a time — 2023 at one income, 2024 at another — from saved scenarios. Fix a year and every total updates; nothing gets retyped.</p>
  <style>table.rp{min-width:1000px}table.rp input[type=date]{min-width:150px;max-width:none}table.rp input.m{min-width:100px;max-width:none}table.rp td.nm input{min-width:110px}</style><div class="panel"><div class="tablewrap"><table class="cmp rp"><thead><tr><th>Label</th><th>From</th><th>Through</th><th>Child support from</th><th>CS / mo</th><th>Alimony / mo</th><th>Months</th><th>Accrued</th><th></th></tr></thead><tbody>
  ${M.P.map((p,i)=>`<tr><td class="nm"><input type="text" data-rp="${i}:label" value="${esc(p.label||'')}" placeholder="e.g. 2024"></td><td><input type="date" data-rp="${i}:start" value="${esc(p.start||'')}"></td><td><input type="date" data-rp="${i}:end" value="${esc(p.end||'')}"></td><td><select data-rp="${i}:sc">${opts.replace(`value="${esc(p.sc||'manual')}"`,`value="${esc(p.sc||'manual')}" selected`)}</select></td><td>${(p.sc||'manual')==='manual'?`<input type="text" class="m" data-rp="${i}:cs" value="${esc(p.cs||'')}">`:fm(p.cs)}</td><td><input type="text" class="m" data-rp="${i}:al" value="${esc(p.al||'')}"></td><td>${p.m}</td><td>${fmc(p.due)}</td><td><button class="x" type="button" data-act="rpdel" data-i="${i}" aria-label="Remove period">×</button></td></tr>`).join('')}
  </tbody></table></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:flex-end"><button class="btn" type="button" data-act="rpadd">＋ Add period</button><div class="fld" style="max-width:220px"><label>Paid or credited, all periods ($)</label><input type="text" class="m" data-rpp="1" value="${esc(S.retro.paidAll||'')}"></div></div></div>
  <div class="sctiles"><div><span>Accrued</span><b>${fmc(M.total)}</b></div><div><span>Paid / credited</span><b>${fmc(M.paid)}</b></div><div class="hl"><span>Retroactive owed</span><b>${fmc(M.owed)}</b></div></div>
  <div class="panel chart">${perChart(M.P)||'<p class="note" style="margin:0">Add a period to see the chart.</p>'}</div>
  <div class="panel" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pink" type="button" data-act="rcsdocx">Draft charts & summaries (.docx)</button><button class="btn" type="button" data-act="rcsnotice">Notice of charts & summaries (.docx)</button><button class="btn ghost" type="button" data-act="go" data-sec="scenarios">Save a scenario per year →</button></div>
  <p class="note">Working calculations for attorney review. Confirm the start date and credits under § 61.30(17) and the notice requirements for summaries under § 90.956 — statutory references require attorney verification.</p>`;}
 async function rcsDocx(){const M=perModel();if(!M.P.length){toast('Add a period first');return;}
  let x=dCaption('SUMMARY OF RETROACTIVE SUPPORT BY PERIOD')+dPara(`Prepared from the support calculations for each period below. Payor: ${pnr(R.payer||'B')}.`,{note:'Attach the guidelines worksheet for each period as backup.'});
  x+=wTbl([[{t:'Period',b:true},{t:'From',b:true},{t:'Through',b:true},{t:'CS / mo',b:true,jc:'right'},{t:'Alimony / mo',b:true,jc:'right'},{t:'Months',b:true,jc:'right'},{t:'Accrued',b:true,jc:'right'}]].concat(M.P.map(p=>[p.label||'',p.start||'',p.end||'',{t:fmc(p.cs),jc:'right'},{t:fmc(p.al),jc:'right'},{t:String(p.m),jc:'right'},{t:fmc(p.due),jc:'right'}])),[1600,1300,1300,1300,1300,900,1660],{head:true,sz:18});
  x+=dPara(`Total accrued ${fmc(M.total)}, less ${fmc(M.paid)} paid or credited, leaves ${fmc(M.owed)}.`);
  const blob=await buildDocx(x,usd(today()),dFoot('Charts and summaries — retroactive support'),'Charts and Summaries');
  if(blob)await saveFile(`${fileBase()} Retroactive Support Charts and Summaries - Attorney Review Draft.docx`,blob);}
 async function rcsNotice(){const k=ours();
  let x=dCaption(`${role(k).toUpperCase()}’S NOTICE OF INTENT TO USE SUMMARIES`)+dPara(`${pnr(k)}, by and through undersigned counsel, gives notice of intent to offer at the hearing or trial in this matter summaries of the voluminous financial records listed below, and states that the underlying records are available for examination and copying at the office of undersigned counsel at a reasonable time.`,{note:'Confirm the evidence-code section, timing and the judge’s procedures before serving. Attach or describe each summary.'});
  ['Summary of retroactive child support by period','Child support guidelines worksheets for each period','Summary of payments made and credits claimed'].forEach((t,i)=>{x+=wP([wR(`${i+1}. `,{b:true}),wR(t)],{after:80,ind:[360,360]});});
  x+=dSign().replace(/STATE OF FLORIDA[\s\S]*$/,'');
  const blob=await buildDocx(x,usd(today()),dFoot('Notice of intent to use summaries'),'Notice of Intent to Use Summaries');
  if(blob)await saveFile(`${fileBase()} Notice of Intent to Use Summaries - Attorney Review Draft.docx`,blob);}

 // ---------- wire up ----------
 Object.assign(RENDER,{cdtrk:()=>{const g=uGate();return g||`<h1 class="sec">Client disco — tracker</h1><p class="lede">Everything our client owes and has served, in one place.</p>`+trkCard(ours());},
  odtrk:()=>{const g=uGate();return g||`<h1 class="sec">OP disco — tracker</h1><p class="lede">What the other side has served us and what is still missing.</p>`+trkCard(opp());},
  cdasm:()=>asmPage(ours()),odasm:()=>asmPage(opp()),cdresp:secCdResp,odreq:secOdReq,retrocs:secRetroCS});
 const saV33=suiteAct;suiteAct=async function(a,b){switch(a){
  case 'asm':ASM[b.dataset.k]=b.dataset.a;render();return true;
  case 'asmdocx':await asmDocx(b.dataset.k);return true;
  case 'asmai':await asmAI(b.dataset.k);return true;
  case 'deflet':await defLetter();return true;
  case 'rpadd':periods().push({label:'',start:'',end:'',sc:'manual',cs:'',al:''});touch();render();return true;
  case 'rpdel':periods().splice(+b.dataset.i,1);touch();render();return true;
  case 'rcsdocx':await rcsDocx();return true;
  case 'rcsnotice':await rcsNotice();return true;}
  return saV33(a,b);};
 document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset)return;
  if(t.dataset.rp){const [i,f]=t.dataset.rp.split(':');const p=periods()[+i];if(p){p[f]=t.value;touch();render();}}
  if(t.dataset.rpp){S.retro.paidAll=t.value;touch();render();}});
 try{render();}catch(e){console.error(e);}
})();
