(function(root){
const brands=['paypal','google','microsoft','apple','amazon','facebook','netflix','chase','outlook','dropbox'];
function distance(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]!==b[j-1]));return d[a.length][b.length]}
function parse(raw){let s=raw.trim().replace(/\[\.\]/g,'.').replace(/^hxxps:/i,'https:').replace(/^hxxp:/i,'http:');if(/\s/.test(s)||!s)throw Error('Enter a single domain or web address without spaces.');let u;try{u=new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(s)?s:'https://'+s)}catch{throw Error('Enter a valid domain or web address, such as example.com.')}if(!['https:','http:'].includes(u.protocol)||(!u.hostname.includes('.')&&!u.hostname.includes(':'))||u.hostname.split('.').some(x=>!x||x.length>63||(!u.hostname.includes(':')&&!/^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(x))))throw Error('Enter a valid domain or HTTP/HTTPS web address.');return u}
function analyze(mode,text,sender='',expected=''){
let findings=[],score=0,hosts=[];const add=(weight,message)=>{if(!findings.includes(message)){score+=weight;findings.push(message)}};
function domain(raw){const u=parse(raw),h=u.hostname.toLowerCase();hosts.push(h);const labels=h.split('.');
if(u.protocol==='http:')add(15,'This link uses HTTP, which does not encrypt the connection. HTTPS alone would not prove legitimacy.');
if(u.username||u.password)add(35,'The link contains text before an @ sign. The actual destination is '+h+'.');
if(/^\d+\.\d+\.\d+\.\d+$/.test(h)||h.includes(':'))add(25,'The destination is an IP address rather than a named website.');
if(h.includes('xn--'))add(25,'The domain uses internationalized encoding (punycode). Check the spelling carefully for lookalike characters.');
if(labels.length>=5)add(15,'The domain has many subdomains, which can make the real destination hard to recognize.');
if((h.match(/-/g)||[]).length>=3)add(10,'The domain contains several hyphens, a pattern sometimes used in imitation websites.');
if(['bit.ly','tinyurl.com','t.co','is.gd','ow.ly'].includes(h))add(20,'This is a shortened link. Its final destination cannot be determined by this offline check.');
for(const brand of brands){const official={google:['google.com','google.co.uk'],microsoft:['microsoft.com','microsoftonline.com','live.com'],apple:['apple.com','icloud.com'],amazon:['amazon.com','amazon.co.uk'],outlook:['outlook.com','live.com']}[brand]||[brand+'.com'];if(official.some(d=>h===d||h.endsWith('.'+d)))continue;const normalized=h.replace(/0/g,'o').replace(/1/g,'l');if(labels.some(l=>l.includes(brand))||normalized.split('.').some(l=>l===brand)||labels.slice(0,-1).some(l=>l.length>=4&&distance(l,brand)<=1))add(40,'Possible '+brand+' impersonation: the hostname resembles the brand but is outside the recognized domains in this tool.');}
if(expected){const e=parse(expected).hostname;if(h!==e&&!h.endsWith('.'+e))add(30,'The domain '+h+' does not match the expected organization domain '+e+'.');}
return h}
if(mode==='domain'){domain(text)}else{
if(!text.trim())throw Error('Paste an email message to check.');
if(expected)parse(expected);
const unfolded=text.replace(/\r?\n[ \t]+/g,' ');
let from=sender.trim();if(!from){const m=unfolded.match(/^From:\s*(.+)$/im);if(m){const addr=m[1].match(/<?([a-z\d.!#$%&'*+/=?^_`{|}~-]+@[^\s<>]+)>?/i);if(addr)from=addr[1]}}
if(from){const m=from.match(/^[^\s@]+@([^\s@]+)$/);if(!m)throw Error('Enter a valid sender email address.');domain(m[1]);const reply=unfolded.match(/^Reply-To:\s*(.+)$/im);if(reply){const r=reply[1].match(/@([^\s>]+)/);if(r&&r[1].toLowerCase()!==m[1].toLowerCase())add(20,'The Reply-To domain differs from the sender domain. This can be legitimate, but deserves verification.');}}
const links=[...text.matchAll(/https?:\/\/[^\s<>"']+/gi)].map(m=>m[0].replace(/[).,;!?]+$/,''));let invalid=0;for(const link of [...new Set(links)].slice(0,50)){try{domain(link)}catch{invalid++}}if(invalid)add(10,'Some web addresses could not be parsed. Inspect them independently.');if(links.length>50)add(0,'Only the first 50 unique links were checked.');
if(/\b(urgent|immediately|within \d+ hours|act now|final warning|account.{0,20}(suspend|clos|terminat))\b/i.test(text))add(20,'The message uses urgency or threatens account restrictions to pressure you into acting.');
if(/\b(password|passcode|verification code|one.time code|social security|credit card|bank details|seed phrase)\b/i.test(text))add(25,'The message mentions sensitive credentials or financial information. Do not share them by email or through an unverified link.');
if(/\b(gift cards?|wire transfer|bitcoin|crypto(?:currency)?|payment overdue)\b/i.test(text))add(20,'The message includes a payment or money-transfer request that should be verified through a trusted channel.');
if(/\b(won|lottery|claim your prize|free money)\b/i.test(text))add(20,'The message uses prize or reward language, a common phishing lure.');
if(!from)add(0,'No sender address was provided or found. Sender domain checks could not run.');
add(0,'The pattern assessment alone does not verify sender identity. See the detailed email and live checks below.');
}
const level=score>=55?'high':score>=20?'medium':'low';return {mode,level,score:Math.min(score,100),hosts:[...new Set(hosts)],findings,next:level==='high'?'Avoid the links and do not reply with personal information. Contact the organization using its official app or a known phone number.':level==='medium'?'Pause before acting. Verify the sender or destination through an independently trusted website or contact.':'Few suspicious patterns were found. Verify unexpected requests independently; this result does not establish that the content is safe.'};}
root.PhishEngine={analyze,parse};if(typeof module!=='undefined')module.exports=root.PhishEngine;
})(typeof globalThis!=='undefined'?globalThis:this);
