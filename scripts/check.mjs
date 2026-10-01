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
 if(route==='/404.html'){assert(html.includes('noindex,follow'));assert(!html.includes('rel="alternate"'));assert(!html.includes('rel="canonical"'));}
 else{
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
console.log(`PASS: ${files.length} HTML pages; ${schemas} JSON-LD graphs; ${links} internal links/assets; 22 sitemap URLs; metadata, reciprocal alternates, anchors and 404 exclusions.`);
