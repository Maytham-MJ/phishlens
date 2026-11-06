'use strict';
document.getElementById('currentPage').addEventListener('click',async()=>{
 const error=document.getElementById('error');error.textContent='';
 try{
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab?.url||!/^https?:\/\//i.test(tab.url))throw new Error('Open a normal HTTP or HTTPS web page, then try again.');
  document.getElementById('domainTab').click();
  document.getElementById('input').value=tab.url;
  document.getElementById('scanForm').requestSubmit();
 }catch(e){error.textContent=e.message||'Unable to read this page. Paste the address instead.';}
});

document.getElementById("openLive").addEventListener("click",e=>{try{const u=PhishEngine.parse(document.getElementById("input").value);e.currentTarget.href="https://phishlens-check.maythamlucky.chatgpt.site/?domain="+encodeURIComponent(u.hostname)}catch{e.currentTarget.href="https://phishlens-check.maythamlucky.chatgpt.site"}});
