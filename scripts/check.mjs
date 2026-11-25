import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const origin='https://lumenopen.com';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk('dist').filter(f=>f.endsWith('.html'));
const routes=new Map(files.map(f=>[f==='dist/404.html'?'/404.html':'/'+path.relative('dist',f).replace(/index\.html$/,''),fs.readFileSync(f,'utf8')]));
const titles=new Set();let links=0,schemas=0;
for(const [route,html] of routes){
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+' H1');
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),'duplicate title');titles.add(title);
 if(route==='/404.html'){assert(html.includes('noindex,follow'));assert(!html.includes('rel="alternate"'));assert(!html.includes('rel="canonical"'));assert(html.includes('lang="en"'));assert(html.includes('href="/en/"'));assert(html.includes('>中文<')&&html.includes('>EN<'));}
 else{assert(html.includes(route.startsWith('/en')?'aria-label="Language"':'aria-label="语言"'));assert(html.includes('>中文<')&&html.includes('>EN<'));
 assert(html.includes(`rel="canonical" href="${origin+route}"`),route+' canonical');
 for(const match of html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)){
 const target=match[2].slice(origin.length);assert(routes.has(target),'missing alternate '+target);assert(routes.get(target).includes(`href="${origin+route}"`),'nonreciprocal alternate');
 }
 const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(json['@context'],'https://schema.org');schemas++;
 assert(!JSON.stringify(json).match(/aggregateRating|reviewCount|"offers"/));
 }
 for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(!href.startsWith('/')&&!href.startsWith('#'))continue;
 const [dest,hash]=href.split('#');const target=dest||route;
 if(routes.has(target)){if(hash) assert(routes.get(target).includes(`id="${hash}"`),route+' broken anchor '+href);}
 else assert(fs.existsSync(path.join('dist',target)),'missing asset '+href);
 links++;
 }
 assert(!html.includes('mailto:'));assert(!html.includes('<form'));
}
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');const entries=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);assert.equal(entries.length,22);assert.equal(new Set(entries).size,22);
for(const url of entries)assert(routes.has(url.slice(origin.length)));
assert(fs.readFileSync('dist/robots.txt','utf8').includes('Sitemap: '+origin+'/sitemap.xml'));
const zhHome=routes.get('/');const enHome=routes.get('/en/');
for(const home of [zhHome,enHome]){assert(home.includes('v0.4.8'));assert(home.includes('desktop-v2.2.0'));assert(home.includes('npm-v0.3.0'));assert(!home.includes('v0.3.2'));assert(!home.includes('desktop-v2.1.0'));assert(!home.includes('desktop-v2.0.2'));}
assert(routes.get('/products/lumen-asr/').includes('v0.4.0')&&routes.get('/en/products/lumen-asr/').includes('v0.4.0'));
assert(!routes.get('/products/lumen-asr/').includes('尚未发布')&&!routes.get('/en/products/lumen-asr/').includes('not yet published'));
assert(routes.get('/products/lumen-navi/').includes('v0.3.0')&&routes.get('/en/products/lumen-navi/').includes('v0.3.0'));
assert(!routes.get('/products/lumen-navi/').includes('还没有可下载文件')&&!routes.get('/en/products/lumen-navi/').includes('no files to download yet'));
assert(routes.get('/products/involute/').includes('注册表上还没有')&&routes.get('/en/products/involute/').includes('not on the registry yet'));
assert(routes.get('/products/planofplan/').includes('尚未声明许可证')&&routes.get('/en/products/planofplan/').includes('no installer attached'));
assert(!routes.get('/products/ovp2/').includes('还在修复')&&!routes.get('/en/products/ovp2/').includes('still being fixed'));
assert(routes.get('/products/ovp2/').includes('desktop-v2.2.0')&&routes.get('/en/products/ovp2/').includes('desktop-v2.2.0'));
assert(zhHome.includes('2026 年 11 月 24 日'));assert(!zhHome.includes('2026 年 10 月 1 日'));
assert(enHome.includes('November 24, 2026'));assert(!enHome.includes('October 1, 2026'));
console.log(`PASS: ${files.length} HTML pages; ${schemas} JSON-LD graphs; ${links} internal links/assets; 22 sitemap URLs; metadata, reciprocal alternates, anchors and 404 exclusions.`);
