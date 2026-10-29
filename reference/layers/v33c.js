// ===== v3.3c: slimmer sticky header — two short rows (brand + actions, tabs) and a one-line case strip; privacy note scrolls away; file actions in one menu =====
(function(){
 const css=document.createElement('style');
 css.textContent=`
 header.top .topbar{padding:6px 20px;gap:8px 14px;flex-wrap:nowrap}
 header.top .brand img{height:30px!important;padding:1px}
 header.top .brand .bt span{display:none}
 header.top .brand .bt b{font-size:15.5px}
 header.top .result{padding:3px 10px;gap:6px}
 header.top .result .amt{font-size:16px}
 header.top .result .mode{font-size:10px}
 header.top .result .who{font-size:13px}
 header.top .actions{gap:6px;flex-wrap:nowrap}
 header.top .actions .btn{padding:5px 10px;font-size:12.5px}
 header.top .actions > [data-act="json-import"],#hdrSaveJson{display:none!important}
 nav.tabs{padding:0 14px}
 nav.tabs .tab{padding:7px 11px 6px;font-size:13px}
 .casebar{padding:4px 20px 5px!important}
 .ovs{gap:4px 12px}
 .ovs-client{font-size:14px}
 .ovs-meta{font-size:12px}
 body:not(.sec-overview) .casebar .ovs-iss{display:none}
 .casebar .ovs-iss{flex-basis:auto}
 #saveBar{display:none!important}
 .casebar .dirty{cursor:pointer;text-decoration:underline dotted}
 .privbar{position:static}
 .filemenu .pop{min-width:270px}
 .pt td .h{display:none!important}
 .hinfo{display:inline-block;margin-left:5px;width:15px;height:15px;border-radius:50%;border:1px solid var(--muted);color:var(--muted);font:700 10px/13px var(--body);text-align:center;cursor:help;vertical-align:1px}
 .fabar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 12px;padding:8px 12px;border-radius:8px;background:var(--surface2);border:1px solid var(--line);font-size:13px}
 @media (max-width:980px){header.top .topbar{flex-wrap:wrap}header.top .actions{flex-wrap:wrap}}
 @media (max-width:760px){header.top .result{order:3;width:100%}}`;
 document.head.appendChild(css);

 // privacy note leaves the sticky header and scrolls with the page
 function movePriv(){const pb=document.querySelector('header.top .privbar');const h=document.querySelector('header.top');if(pb&&h)h.after(pb);}
 movePriv();

 // one File menu for open / save
 const acts=document.querySelector('header.top .actions');
 if(acts&&!document.getElementById('fileMenu')){
  const pdf=acts.querySelector('.menu');
  const m=document.createElement('div');m.className='menu filemenu';m.id='fileMenu';
  m.innerHTML=`<button class="btn" type="button" id="fileBtn" aria-haspopup="true" aria-expanded="false">File ▾</button><div class="pop" id="filePop" hidden>
   <button type="button" data-act="go" data-sec="saved">Save client<small>Save this client and its versions in the app</small></button>
   <button type="button" data-act="json-export">Save .json<small>Case file for the matter folder</small></button>
   <button type="button" data-act="json-import">Open .json…<small>Reopen a case file you saved earlier</small></button>
   <button type="button" data-act="go" data-sec="saved">Versions<small>See and restore earlier versions</small></button></div>`;
  acts.insertBefore(m,pdf||null);
  const pdfBtn=pdf&&pdf.querySelector('[data-act="pdfmenu"]');if(pdfBtn)pdfBtn.textContent='Download ▾';
  const pop=m.querySelector('#filePop'),btn=m.querySelector('#fileBtn');
  btn.addEventListener('click',e=>{e.stopPropagation();pop.hidden=!pop.hidden;btn.setAttribute('aria-expanded',String(!pop.hidden));const pp=document.getElementById('pdfPop');if(pp)pp.hidden=true;});
  pop.addEventListener('click',()=>{pop.hidden=true;btn.setAttribute('aria-expanded','false');});
  document.addEventListener('click',e=>{if(!e.target.closest('#fileMenu')){pop.hidden=true;btn.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){pop.hidden=true;const pp=document.getElementById('pdfPop');if(pp)pp.hidden=true;}});
 }

 // "Not saved" in the case strip opens Save; issue chips show only on the overview
 document.addEventListener('click',e=>{const d=e.target.closest&&e.target.closest('.casebar .dirty');if(d){e.preventDefault();go('saved');}});
 let faAll=false;
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act="fashow"]');if(b){e.preventDefault();e.stopImmediatePropagation();faAll=!faAll;render();}},true);
 function tidy(){
  // one way to move: drop the repeated "Jump to" list
  const nav=document.querySelector('nav.nav');if(nav){const h=[...nav.querySelectorAll('h4')].find(x=>/jump to/i.test(x.textContent));if(h){let n=h.nextSibling;while(n){const nx=n.nextSibling;n.remove();n=nx;}h.remove();}}
  // field help becomes an info mark
  document.querySelectorAll('#main .pt td .h').forEach(h=>{const td=h.parentElement;if(td&&!td.querySelector('.hinfo')){const t=h.textContent.trim();if(!t)return;const i=document.createElement('span');i.className='hinfo';i.textContent='i';i.title=t;i.setAttribute('aria-label',t);i.tabIndex=0;h.before(i);}});
  // ED chart: one set of export buttons
  if(sec==='edchart'){[...document.querySelectorAll('#main button')].filter(b=>/^⬇/.test(b.textContent.trim())&&['ed-xlsx','ed-pdf'].includes(b.dataset.act)).forEach(b=>b.hidden=true);}
  // FA Section II: filled lines first
  if(sec==='fa2'){const rows=[...document.querySelectorAll('#main table.fat tr')].filter(r=>r.querySelector('input.m'));let shown=0;
   rows.forEach(r=>{const v=r.querySelector('input.m');const est=r.querySelector('.estc input');const filled=num(v.value)!==0||(est&&est.checked)||v===document.activeElement;r.hidden=!faAll&&!filled;if(filled)shown++;});
   document.querySelectorAll('#main table.fat').forEach(t=>{const any=[...t.querySelectorAll('tr')].some(r=>r.querySelector('input.m')&&!r.hidden);t.closest('.panel')&&(t.closest('.panel').hidden=false);t.hidden=!faAll&&!any;});
   const m=document.querySelector('#main .lede')||document.querySelector('#main h1');if(m&&!document.querySelector('.fabar'))m.insertAdjacentHTML('afterend',`<div class="fabar"><b>${faAll?`All ${rows.length} lines`:`${shown} filled line${shown===1?'':'s'}`}</b><span class="note">${faAll?'Empty lines included.':'Empty lines are hidden.'}</span><button class="btn sm" type="button" data-act="fashow">${faAll?'Show filled lines only':`Show all ${rows.length} lines`}</button></div>`);}
 }
 const rC=render;render=function(){rC.apply(this,arguments);try{document.body.className=document.body.className.replace(/\bsec-\S+/g,'').trim()+' sec-'+String(sec).replace(/[^\w-]/g,'');movePriv();tidy();
  const d=document.querySelector('.casebar .dirty');if(d){d.title='Not saved yet — click to save this client';d.setAttribute('role','button');d.tabIndex=0;}
  const h=document.querySelector('header.top');if(h)document.documentElement.style.setProperty('--hdr',h.offsetHeight+'px');}catch(e){}};
 try{render();}catch(e){console.error(e);}
})();
