import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();const assets={};const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.zip':'application/zip','.txt':'text/plain; charset=utf-8'};
for(const name of fs.readdirSync('web')){const p=path.join('web',name);if(fs.statSync(p).isFile())assets['/'+name]={type:types[path.extname(name)]||'application/octet-stream',data:fs.readFileSync(p).toString('base64')}}
const checks=fs.readFileSync('worker/checks.mjs','utf8').replace(/^export /gm,'');const worker=fs.readFileSync('worker/index.mjs','utf8').replace(/^import .*;\n/gm,'');
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});if(fs.existsSync('.openai/hosting.json'))fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');else fs.writeFileSync('dist/.openai/hosting.json','{}');fs.writeFileSync('dist/server/index.js','const assets='+JSON.stringify(assets)+';\n'+checks+'\n'+worker);console.log('Built Worker and '+Object.keys(assets).length+' embedded assets.');
