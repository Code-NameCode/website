// Agentic-readiness verification tests.
// Run: node tests/verify-agentic.mjs   (exits non-zero on any failure)
import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
let pass = 0, fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.error(`FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
};

// ---------- vercel.json ----------
const vercel = JSON.parse(read('vercel.json'));
const mdHeader = vercel.headers.find(h => h.source === '/(.*).md');
check('vercel.json: markdown rule has Vary: Accept, Accept-Encoding',
  !!mdHeader && mdHeader.headers.some(h => h.key === 'Vary' && h.value.includes('Accept') && h.value.includes('Accept-Encoding')));
check('vercel.json: /.well-known header rule exists', vercel.headers.some(h => h.source === '/.well-known/(.*)'));
check('vercel.json: /about rewrite exists', vercel.rewrites.some(r => r.source === '/about' && r.destination === '/about.html'));

// ---------- essential files ----------
for (const f of ['llms.txt', 'robots.txt', 'sitemap.xml', 'sitemap.md', '.well-known/ard.json', '.well-known/mcp', 'index.html', 'index.md']) {
  check(`file exists: ${f}`, existsSync(resolve(root, f)));
}

// ---------- robots.txt agent access ----------
const robots = read('robots.txt');
const uaBlockOk = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'ora-agent', 'DeepSeekBot']
  .every(ua => new RegExp(`User-agent: ${ua}\\s*\\nAllow: /`).test(robots));
check('robots.txt: major AI agents explicitly allowed', uaBlockOk);
check('robots.txt: no Disallow rules', !/Disallow/i.test(robots));
check('robots.txt: sitemap declared', robots.includes('Sitemap: https://goodstuffdesigns.co.za/sitemap.xml'));

// ---------- sitemap ----------
const urls = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
check('sitemap.xml: valid XML with >= 13 urls', urls.length >= 13);
check('sitemap.xml: all urls have lastmod', read('sitemap.xml').match(/<url><loc>[^<]+<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod><\/url>/g)?.length === urls.length);
const mdMirrors = urls.map(u => u.replace(/\/$/, '') + '.md');
const missingMd = mdMirrors.filter(u => !existsSync(resolve(root, basename(new URL(u).pathname))));
check('sitemap.xml: every url has a .md markdown mirror', missingMd.length === 0, missingMd.join(', '));

// ---------- llms.txt ----------
const llms = read('llms.txt');
check('llms.txt: has "When to use" section with specific use cases', /## When to use Goodstuff Designs/.test(llms) && llms.includes('Do not use Goodstuff Designs for'));
check('llms.txt: lists about, sitemap, mcp, service catalog', ['/about', 'sitemap.xml', '.well-known/mcp', 'service-catalog.json'].every(s => llms.includes(s)));

// ---------- .well-known ----------
const mcp = JSON.parse(read('.well-known/mcp'));
check('.well-known/mcp: valid JSON with endpoint + transport', mcp.endpoint?.url?.startsWith('https://') && mcp.endpoint.transport === 'streamable-http');
JSON.parse(read('.well-known/ard.json')); check('.well-known/ard.json: valid JSON', true);

// ---------- trust pages ----------
for (const [page, title] of [['about.html', 'About'], ['contact.html', 'Contact'], ['privacy.html', 'Privacy']]) {
  const html = read(page);
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  check(`${page}: >= 500 chars of real content`, text.length >= 500, `${text.length} chars`);
  check(`${page}: canonical + lang + og tags`, html.includes('rel="canonical"') && html.includes('<html lang=') && html.includes('og:'));
  check(`${page}: has <h1>`, /<h1[ >]/.test(html));
}

// ---------- about page specifics ----------
const about = read('about.html');
const orgLd = [...about.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(m => JSON.parse(m[1])).find(o => o['@type'] === 'Organization');
check('about.html: Organization JSON-LD with contactPoint + address',
  !!orgLd && !!orgLd.contactPoint?.email && !!orgLd.contactPoint?.telephone && orgLd.address?.['@type'] === 'PostalAddress');

// ---------- homepage metadata + JSON-LD ----------
const index = read('index.html');
check('index.html: canonical, lang, og:image, og:type all present',
  index.includes('<link rel="canonical" href="https://goodstuffdesigns.co.za/">') && index.includes('<html lang="en-ZA">')
  && index.includes('og:image" content="https://goodstuffdesigns.co.za/assets/img/og-image.png') && index.includes('og:type" content="website'));
const homeLd = [...index.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
check('index.html: valid JSON-LD blocks (Organization, WebPage, FAQPage)',
  ['Organization', 'WebPage', 'FAQPage'].every(t => homeLd.some(o => o['@type'] === t)));
const homeOrg = homeLd.find(o => o['@type'] === 'Organization');
check('index.html: Organization schema has contact fields + PostalAddress',
  !!homeOrg?.telephone && !!homeOrg?.email && homeOrg.address?.['@type'] === 'PostalAddress');
const homeText = index.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
check('index.html: >= 500 chars content without JS', homeText.length >= 500, `${homeText.length} chars`);

// ---------- footer parity ----------
const explore = '<h4>Explore</h4><a href="/">Home</a><a href="/about">About</a><a href="/services">Services</a>';
const pages = ['404.html','about.html','ai.html','contact.html','cookie-policy.html','design-styles.html','digital-marketing.html','index.html','it-and-networks.html','portfolio.html','privacy.html','services.html','studio.html','websites-and-hosting.html'];
const badFooter = pages.filter(p => !read(p).includes(explore));
check('all 14 pages share identical footer Explore column (with About)', badFooter.length === 0, badFooter.join(', '));

// ---------- 404 page ----------
const nf = read('404.html');
check('404.html: exists with noindex + resource links for agents', nf.includes('noindex') && nf.includes('sitemap.xml'));

// ---------- markdown mirrors content ----------
for (const md of ['index.md', 'about.md', 'contact.md', 'privacy.md']) {
  check(`${md}: >= 500 chars`, read(md).trim().length >= 500);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
