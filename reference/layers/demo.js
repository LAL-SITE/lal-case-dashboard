/* ===== DEMO EDITION (hosted): everything calculates; nothing saves, downloads or leaves the page. Locked features show a preview. ===== */
(function(){
 // ---- runs only at its official address ----
 const H=location.hostname||'';
 const OK=/(^|\.)tiiny\.(site|io|co|host)$/i.test(H)||/legalauthoritylab/i.test(H)||H==='localhost'||H==='127.0.0.1';
 if(!OK){document.documentElement.innerHTML='<body style="font:16px Lato,Arial,sans-serif;background:#F7F5F0;color:#0D0D0D;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px"><div style="max-width:440px;background:#fff;border-radius:14px;padding:26px;border-top:8px solid #FF1F8E"><h2 style="margin:0 0 8px">This demo runs at its official link only</h2><p>The Laia Support App demo can’t be copied or opened from a saved file.</p><p><a href="https://legalauthoritylab.blog/book/" style="color:#FF1F8E;font-weight:900">Book a call with Legal Authority Lab</a></p></div></body>';throw new Error('demo host lock');}

 window.LAIA_DEMO=true;
 const STAMP='DEMO EDITION · NOT LICENSED · FICTIONAL DEMO DATA · Legal Authority Lab';
 const BOOK='https://legalauthoritylab.blog/book/';

 // ---- preview modal ----
 function modal(title,body,extra){const r=$('#modalRoot');r.innerHTML=`<div class="modal-bg" id="dmbg"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="dmt" style="max-width:760px;max-height:88vh;display:flex;flex-direction:column"><div class="pill sole" style="align-self:flex-start;margin-bottom:8px">Demo version — not functioning here</div><h3 id="dmt">${esc(title)}</h3><div style="overflow:auto;min-height:0">${body}</div>${extra||''}<div class="row" style="margin-top:14px"><a class="btn pink" href="${BOOK}" target="_blank" rel="noopener">Get the licensed version</a><button class="btn" type="button" id="dmClose">Close</button></div></div></div>`;
  $('#dmClose').onclick=()=>{r.innerHTML='';if(window._dmUrl){URL.revokeObjectURL(window._dmUrl);window._dmUrl=null;}};$('#dmbg').onclick=e=>{if(e.target.id==='dmbg')$('#dmClose').click();};}
 window.demoPreview=modal;
 const WHY={json:'In the licensed version the whole case — every tab, scenario and version — saves as one case file in the client’s folder and reopens exactly where you left off.',
  save:'In the licensed version clients save to your firm’s app and to the client file, with version history you can restore.',
  open:'In the licensed version you open any saved case file, or launch the app from a client’s project and it arrives already filled in.',
  newclient:'In the licensed version you add a client with a link to the client’s folder (Dropbox, SharePoint, OneDrive). The app reads the disclosure in that folder and fills in the case.',
  ai:'In the licensed version this step runs through your AI assistant, using the documents and the case file you give it. In the demo it shows what would happen.'};

 // ---- downloads become previews ----
 saveFile=async function(filename,data){const blob=data instanceof Blob?data:new Blob([data]);const ext=(filename.split('.').pop()||'').toLowerCase();
  if(ext==='pdf'){const u=URL.createObjectURL(new Blob([blob],{type:'application/pdf'}));window._dmUrl=u;
   modal(filename,`<p class="note" style="margin:0 0 8px">Preview only. In the licensed version this saves as an editable file to your client folder.</p><iframe src="${u}#toolbar=0&navpanes=0" title="Preview" style="width:100%;height:58vh;border:1px solid var(--line);border-radius:6px;background:#fff"></iframe>`);return false;}
  if(ext==='docx'&&window.JSZip){try{const z=await JSZip.loadAsync(blob);const xml=await z.file('word/document.xml').async('string');
    const paras=xml.split(/<\/w:p>/).map(p=>(p.match(/<w:t[^>]*>([^<]*)<\/w:t>/g)||[]).map(t=>t.replace(/<[^>]+>/g,'')).join('')).filter(t=>t.trim()).slice(0,80);
    const txt=paras.map(p=>`<p style="margin:0 0 6px">${esc(p.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'"))}</p>`).join('');
    modal(filename,`<p class="note" style="margin:0 0 8px">Preview of the first page${paras.length>=80?'s':''}. In the licensed version this downloads as an editable Word document for attorney review.</p><div class="demoDoc" style="position:relative;background:#fff;color:#000;font:14px 'Times New Roman',serif;padding:22px 26px;border:1px solid var(--line);border-radius:6px;user-select:none;-webkit-user-select:none"><div aria-hidden="true" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font:900 54px Lato,Arial;color:rgba(255,31,142,.13);transform:rotate(-24deg)">DEMO</div>${txt}</div>`);return false;}catch(e){}}
  const what=ext==='json'?WHY.json:ext==='xlsx'?'In the licensed version the ED chart downloads as a working Excel file with formulas.':'In the licensed version this downloads to your client folder.';
  modal(filename,`<p>${esc(what)}</p>`);return false;};

 // ---- AI steps become previews ----
 const stub={json:async(prompt)=>{modal('AI step',`<p>${esc(WHY.ai)}</p><p class="note">What it was asked to do:</p><div style="background:var(--surface2);border-radius:8px;padding:10px 12px;font-size:12.5px;max-height:30vh;overflow:auto">${esc(String(prompt).slice(0,900))}${String(prompt).length>900?'…':''}</div>`);throw {message:'demo',demo:true};},limits:async()=>null};
 stub.text=stub.json;
 window.claude=window.claude||{};window.claude.use=async n=>n==='sample'?stub:null;

 // ---- blocked actions show what they would do ----
 const BLOCK={'newclient':['New client',WHY.newclient],'new':['New client',WHY.newclient],'open':['Open a case file',WHY.open],'json-import':['Open a case file',WHY.open],'faimp-open':['Open a file',WHY.open],
  'json-export':['Save case file',WHY.json],'save':['Save client',WHY.save],'saveas':['Save as',WHY.save],'lsave':['Save client',WHY.save],'lsaveas':['Save as',WHY.save],'ldup':['Duplicate client',WHY.save],'profsave':['Save firm profile','In the licensed version your firm name, attorney block and preferences are saved once and fill every draft.']};
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;
  if(b.dataset.act==='go'&&b.dataset.sec==='newclient'){e.preventDefault();e.stopImmediatePropagation();modal('New client',`<p>${esc(WHY.newclient)}</p>`);return;}
  const x=BLOCK[b.dataset.act];if(x){e.preventDefault();e.stopImmediatePropagation();modal(x[0],`<p>${esc(x[1])}</p>`);}},true);
 const goD=go;go=function(s){if(s==='newclient'){modal('New client',`<p>${esc(WHY.newclient)}</p>`);return;}return goD(s);};
 writeCases=function(){return true;};
 const imp=document.getElementById('importFile');if(imp)imp.disabled=true;
 document.addEventListener('change',e=>{if(e.target&&e.target.type==='file'){e.stopImmediatePropagation();e.target.value='';modal('Read a file',`<p>${esc(WHY.ai)}</p><p>In the licensed version the app reads the affidavit, statement or intake form you drop here and fills the review table for you to approve.</p>`);}},true);
 document.addEventListener('drop',e=>{if(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length){e.preventDefault();e.stopImmediatePropagation();modal('Read a file',`<p>${esc(WHY.ai)}</p>`);}},true);

 // ---- stamp PDFs, Word, Excel (previews carry the stamp) ----
 const SP0=SafePDF;SafePDF=function(o){const d=SP0(o);let done=false;function stamp(){if(done)return;done=true;try{const n=d.getNumberOfPages();for(let i=1;i<=n;i++){d.setPage(i);const w=d.internal.pageSize.getWidth(),h=d.internal.pageSize.getHeight();d.setFontSize(9);d.setTextColor(255,31,142);d.text(STAMP,w/2,14,{align:'center'});d.text(STAMP,w/2,h-6,{align:'center'});d.setTextColor(0,0,0);}}catch(e){}}
  ['save','output'].forEach(fn=>{const f=d[fn];if(typeof f==='function')d[fn]=function(){stamp();return f.apply(d,arguments);};});return d;};
 const BD0=buildDocx;buildDocx=function(body,hdr,foot,title){const f=Array.isArray(foot)?foot.slice():(foot?[foot]:[]);f.unshift({t:STAMP,b:true});return BD0(body,STAMP+(hdr?' · '+hdr:''),f,title);};

 // ---- neutral AI wording on screen ----
 const RX=[[/Ask Claude/g,'Ask AI'],[/Claude[’']s\b/g,'the AI assistant’s'],[/\bwith Claude\b/g,'with your AI assistant'],[/\bClaude\b/g,'the AI assistant']];
 function neutral(root){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(n.nodeValue.indexOf('Claude')>=0){let v=n.nodeValue;RX.forEach(([a,b])=>v=v.replace(a,b));n.nodeValue=v;}}
  root.querySelectorAll&&root.querySelectorAll('[title*="Claude"],[placeholder*="Claude"],[aria-label*="Claude"]').forEach(el=>['title','placeholder','aria-label'].forEach(a=>{const v=el.getAttribute(a);if(v&&v.includes('Claude')){let x=v;RX.forEach(([p,q])=>x=x.replace(p,q));el.setAttribute(a,x);}}));}
 new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(nd=>{if(nd.nodeType===1)neutral(nd);else if(nd.nodeType===3&&nd.nodeValue.includes('Claude'))neutral(nd.parentNode);});}).observe(document.body,{childList:true,subtree:true});

 // ---- names fixed ----
 const LOCK=/^(parties\.[AB]\.name|children\.\d+\.name|meta\.(caseNo|caseNumber|caption|clientName))$/;
 function lockFields(){document.querySelectorAll('[data-p]').forEach(n=>{if(LOCK.test(n.dataset.p)){n.readOnly=true;n.title='Names are fixed in the demo';n.style.background='var(--line2)';}});}
 const rD=render;render=function(){rD.apply(this,arguments);try{lockFields();neutral(document.body);}catch(e){}};

 try{const pb=document.querySelector('.privbar span');if(pb)pb.textContent='Demo: nothing you type is stored or sent anywhere. Reload to start over.';}catch(e){}
 // ---- copy deterrents ----
 const css=document.createElement('style');
 css.textContent=`[data-act="newclient"],[data-act="open"],[data-act="json-import"],[data-act="json-export"]{opacity:.55}
 #demoBand{background:#FF1F8E;color:#fff;font:900 14px Lato,Arial,sans-serif;text-align:center;padding:8px 12px;letter-spacing:.3px}#demoBand a{color:#fff;text-decoration:underline}
 main,aside.rail,.modal{-webkit-user-select:none;user-select:none}main input,main textarea,main select{-webkit-user-select:text;user-select:text}
 @media print{body>*{display:none!important}body::after{content:'The demo edition does not print. Book a call at legalauthoritylab.blog/book.';display:block;font:16px Arial;padding:40px}}`;
 document.head.appendChild(css);
 document.body.insertAdjacentHTML('afterbegin',`<div id="demoBand">DEMO · two fictional families · change any number and watch everything update · saving, downloads and AI steps show a preview · <a href="${BOOK}" target="_blank" rel="noopener">Get the licensed version</a></div>`);
 document.addEventListener('contextmenu',e=>{if(!e.target.closest('input,textarea'))e.preventDefault();});
 document.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&['s','p','u'].includes(k)){e.preventDefault();toast('The demo edition doesn’t save, print or show source.');}},true);
 document.addEventListener('dragstart',e=>e.preventDefault());

 // ---- product guide opens with the demo launchers ----
 const gD=RENDER.guide;RENDER.guide=function(){return `<div class="panel" style="border-left:6px solid var(--pink)"><h3 class="sub" style="margin-top:0">Try it on a demo family</h3><p style="margin:0 0 10px">Both cases are fictional and fully editable. Change incomes, overnights, assets — every tab updates. Reload the page to start over.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pink" type="button" data-act="demoCase">▶ Demo 1 · Rivera — our client pays, ED, FA</button><button class="btn teal" type="button" data-act="demoCase2">▶ Demo 2 · Johnson — self-employed payer, alimony, retro</button></div></div>`+gD();};
 // ---- open on the product guide ----
 document.title='Laia Support App · Demo';
 try{if(!location.hash||location.hash==='#home')go('guide');else render();}catch(e){console.error(e);}
})();
