# Goodstuff Designs Website — Project Discovery Document

*A full inventory and architecture read of the static redesign build. No files were changed.*

---

## 1. What this project is

A **framework-free static website** (plain HTML + one shared CSS file + four small JS files) for **Goodstuff Designs**, a South African business in Heidelberg, Gauteng, offering managed IT support, business networks, Vox ISP connectivity (resold via Voxos), Kaspersky antivirus setup, web development, managed Linux hosting, and human-controlled AI workflows. Deployed on **Vercel** via `vercel.json` (clean URLs, security headers, cache rules, 23 rewrites).

- Domain: `goodstuffdesigns.co.za`
- Language: `en-ZA`, dark-only theme (black background, emerald `#10b981` accent, Inter + JetBrains Mono)
- Content date stamp: prices "checked 2026-08-30"; blog notes dated 18–31 Aug 2026
- No build step, no package.json, no framework — intentional per README ("framework-free")

---

## 2. File inventory

### Root — HTML pages (13)
| File | Route (Vercel) | Purpose |
|---|---|---|
| `index.html` | `/` | Homepage: hero + fake terminal status card, proof band, bento grid, Vox ISP tab explorer, Kaspersky tier picker, metrics, CTA |
| `services.html` | `/services` | Interactive 5-tab "service console" (IT, Networks, Vox, AI, Kaspersky), Vox ISP pricing grid, Kaspersky price tiers, 3-step process |
| `web-development.html` | `/web-development` | Interactive "build desk": 3 project types × live mock-browser preview, layer toggles, 4-stage delivery track. Includes "Different Design Styles" section |
| `design-styles.html` | `/design-styles` | Live-iframe gallery of all 82 example pages (80 styles + 2 layouts). 10 at a time, View more / View all. Two modals: example viewer + style info |
| `portfolio.html` | `/portfolio` | Filterable grid of 9 projects + sticky "project inspector" with animated laptop preview |
| `hosting.html` | `/hosting` | 3 Linux hosting plans (R100/R200/R600) with selectable plan console + capacity meters |
| `studio.html` | `/studio` | Goodstuff-Studio desktop app product page: hero, feature grid, screenshot carousel, lightbox, CTA. Has JSON-LD SoftwareApplication |
| `contact.html` | `/contact` | 3-route selector (support/project/hosting) → prefilled mailto; direct contact grid; Clarity-masked |
| `privacy.html` | `/privacy` | POPIA-flavoured privacy policy (8 sections). Has JSON-LD WebPage |
| `cookie-policy.html` | `/cookie-policy` | Cookie table, consent-mode explanation, "change your mind". Has JSON-LD WebPage |
| `404.html` | (Vercel default) | Minimal 404, own inline styles, no footer/scripts |

Blog pages have been removed from the site. The `examples/` folder still contains the design style mockups (82 HTML files) referenced by `design-styles.html`.

### Root — content & config
- `vercel.json` — cleanUrls, no trailing slash, security headers, immutable asset cache, `/index.html → /` redirect, 23 rewrites (all pages + 14 blog slugs + pagination)
- `sitemap.xml` — 24 URLs, lastmod 2026-08-30/31
- `sitemap.md`, `robots.txt` (allows all, points to sitemap)
- `llms.txt` — AI-agent guide: key pages, machine resources, 5 "WebMCP tools", behavioural notes. Includes studio and design-styles
- `service-catalog.json` — 6 services incl. full Kaspersky price matrix
- `README.md` — project brief + "Next work" backlog
- `ANALYTICS_SETUP.md` — GA4/Clarity activation runbook (IDs now filled in), verification checklist
- `design-styles.md` — Markdown mirror of the design styles gallery

### Markdown mirrors (9 + blog + sitemap)
`index.md`, `services.md`, `web-development.md`, `portfolio.md`, `hosting.md`, `contact.md`, `privacy.md`, `cookie-policy.md`, `blog.md`, `ai-support-integrations.md`, `sitemap.md`. Served as `text/markdown` via `vercel.json` headers; each HTML page links its mirror with `<link rel="alternate" type="text/markdown">`. This is part of the site's "agent-readable" strategy.

### assets/css
- `styles.css` (2,096 lines, ~53 KB) — the **only** stylesheet, loaded by every page as `?v=consent-1`. Layers:
  1. **Cookie banner + policy/blog/article/share styles** (lines 1–473)
  2. **"Generation 1" base design system** (lines 475–1193): vars `--void/--carbon/--chalk/--fog/--signal/--trust`, fonts Source Sans 3/Sora, classes `.site-header`, `.hero` (2-col), `.card-grid`, `.split`, `.cta-band`, `.site-footer`, mobile breakpoint **860px**. Mostly superseded but still present.
  3. **"Generation 2" homepage template system** (lines 1196–2096): vars `--bg/--surface/--border/--accent-emerald`, Inter/JetBrains Mono, fixed 56px `.nav`, `.bento`, `.metrics-grid`, `.split-section`, `.cta-section`, `.footer`, mobile breakpoints **900px / 600px**, plus its own duplicate `.nav-toggle` hamburger and `prefers-reduced-motion` blocks.

### assets/js
- `tracking-config.js` (frozen config): `consentVersion: "1"`, cookie `gsd_consent_v1`, 6-month max-age, **GA4 `G-GK6GRLG54F`** and **Clarity `yamfms9iti`** (IDs are filled in, contrary to the setup doc's comment).
- `consent-bootstrap.js` — loaded **first in `<head>`** of every content page. Sets Google Consent Mode v2 defaults synchronously (analytics granted only if cookie says so; all ad fields always denied), pushes a bootstrap dataLayer event, then loads GA4 + Clarity 1.5s after window load, with ID-format validation and cookie-domain/flags hardening.
- `consent.js` — the banner **and** a lot of site behaviour:
  - Builds the cookie banner DOM dynamically (centred modal-style dialog, Accept/Reject, links to policies, live status line)
  - Cookie + localStorage persistence, vendor consent updates, Clarity session clearing, analytics-cookie wiping on reject
  - Injects **footer social links** and **"Cookie settings" footer links** into `.footer-inner` / `.footer-bottom` (so pages without hardcoded socials still get them)
  - Tags mailto/tel/contact-route links as `generate_lead`, social links as `social_click`, hosting plan link as `hosting_plan_select`; pushes events to dataLayer + gtag
  - Shows banner ~6s after load (or after a `gsd-loader-finished` event) only if no choice stored; Esc closes; reopens via footer button; exposes `window.goodstuffConsent`
- `main.js` — shared page behaviour: favicon + stylesheet fallback injection, brand href normalisation, **auto-inserts a "Services" nav link** into legacy navs, mobile nav toggle + Escape handling + `aria-current` marking, and **registers 5 WebMCP tools** (`search_services`, `list_site_pages`, `get_service_pricing`, `list_integrations`, `start_contact_enquiry`) when `document.modelContext` exists. Blog-related code removed.

### assets/img
- `favicon.svg` (also injected by main.js), `loading.svg` (not referenced anywhere I could find).

---

## 3. Shared page anatomy

Every content page follows the same skeleton (this matters for the redesign consistency rule):

1. `<head>`: charset/viewport → `tracking-config.js` → `consent-bootstrap.js` → title/description/canonical/robots/theme-color → `<link rel="alternate">` mirrors → OG/Twitter tags → JSON-LD (Organization/Service/ItemList/Article/ContactPage) → shared stylesheet → Google Fonts → **page-specific `<style>` block(s)**.
2. Skip link (except homepage, which omits it) → fixed `.nav` (brand SVG + 5 links: Services, Web Dev, Portfolio, Hosting, Contact) with `aria-current="page"` on the active link.
3. Page-specific `<main>` sections.
4. `.footer`: brand + tagline + 5 social icons (Facebook, Instagram, LinkedIn, YouTube, X) | Explore column | Contact column (email, phone) | bottom bar (© 2026 + domain).
5. Scripts: inline page script → `consent.js?v=consent-6` → `main.js?v=editorial-loader-5`, both deferred.

**Notable inconsistencies to watch during redesign** (existing, undocumented until now):
- Footer "Explore" column differs: blog pages and most pages list 6 links; `web-development.html` and `portfolio.html` **omit "Services"** from the footer list; homepage omits it too. `consent.js` inserts socials/settings on some footers while contact/services/web-dev/portfolio/homepage hardcode their own social icons with **slightly different URLs** (e.g. `instagram.com/goodstuffdesigns` vs `/goodstuffdesigns/`, `linkedin.com/company/goodstuff-designs` vs `/goodstuffdesigns/`, YouTube `@Goodstuff-Designs` vs `@goodstuffdesigns`, X `x.com/GS_Designs_za/` vs `twitter.com/goodstuffdesigns`). Two sources of truth for socials.
- Homepage has no skip link and no breadcrumbs; blog/articles do.
- Contact page footer has no "Services" link either (it's inserted dynamically by `main.js` where missing — depends on `a[href="index.html"]` being present in the group, which explains the patchwork).
- CSS carries the entire retired "Generation 1" system (~700 lines) plus duplicated `.nav-toggle` definitions — safe cleanup candidate, but every page currently works.

## 4. Design system (current, effective)

- **Palette:** black `#000`, surfaces `#0a0a0a`/`#080808`, borders `#1a1a1a` (hover `#525252`), text `#fff / #a1a1aa / #52525b`, accent emerald `#10b981` (light `#6ee7b7`), occasional amber `#f59e0b` and blue `#60a5fa` in terminal mockups.
- **Type:** Inter (body/UI), JetBrains Mono (labels, kickers, terminal, prices), uppercase letterspaced micro-labels everywhere.
- **Signature motifs:** fixed blurred 56px navbar; dot-grid background overlay; gradient-text H1s; "terminal/console" cards; pill badges with pulsing live-dot; bento grids; mono uppercase section labels; scroll progress bars (home/dev/portfolio); IntersectionObserver reveal animations, all disabled under `prefers-reduced-motion`.
- **Responsiveness:** every page has explicit mobile/tablet rules. Main breakpoints: 900px (nav collapses to animated hamburger, grids stack), 760px (blog/policy), 700px (services), 850px (web-dev), 600px (single-column metrics/plans), 540/420px (home, cookie banner). Homepage has extra "guardrail" CSS at the end preventing overflow.
- **Accessibility:** skip links, `aria-current`, `aria-pressed`/`aria-selected` tab patterns, keyboard arrow navigation on services tabs, `aria-live` regions, focus-visible outlines, reduced-motion handling throughout.

## 5. Privacy / analytics architecture (do not break)

Flow: `tracking-config.js` (IDs) → `consent-bootstrap.js` (denied-by-default Consent Mode v2, ad fields permanently denied, Advanced consent mode = cookieless pings when rejected) → GA4 + Clarity load late and only with valid IDs → `consent.js` banner writes `gsd_consent_v1` (6 months, Secure/SameSite=Lax + localStorage backup), updates vendors, wipes `_ga*/_cl*` cookies on reject. Contact page sets `data-clarity-mask="true"`; policy states Balanced masking, 14-month GA4 retention, consent version 1 (bump version to re-prompt). **Any page redesign must keep the head script order, the `data-cookie-settings` footer button, and the `consent.js`/`main.js` includes intact.**

## 6. Commercial facts encoded across the site

- Hosting: Novice R100/m (10GB), Business R200/m (150GB, "most popular"), Pro R600/m (unlimited) — all with DirectAdmin, SSL, 99% uptime.
- Kaspersky (ZAR, 1 yr, via Voxos, checked 2026-08-30): Standard 1/3/5/10 = 278/318/370/462; Plus 399/438/479/699; Premium 438/478/509/769/999 (20 devices).
- Vox: Home Fibre from R349/m; everything else quote/coverage-based.
- Web: business site from R5,000; e-commerce from R8,500.
- Contact: admin@goodstuffdesigns.co.za, +27 79 937 4801, Heidelberg GP, remote-first SA. Support route claims "<4h critical response" (homepage/flow nodes).

## 7. Observations & risks for the redesign

1. **Two CSS generations coexist** in `styles.css` (2,245 lines); new work should use the Generation-2 token set (`--bg/--surface/--border/--accent-emerald`) and eventually retire Generation 1 (~lines 475-1193) once no page needs it.
2. **Footer/nav drift partially resolved.** Social URLs in `consent.js` now match hardcoded footer URLs. Design Styles link added to all footers. Navbar/footer still authored per-page (minor formatting differences).
3. **Per-page inline `<style>` blocks are large** (homepage ~700 lines, hosting ~900 lines). Fine for a static site, but shared patterns (plan cards, consoles, tabs) are copied rather than componentised.
4. README's own backlog: placeholder contact details, unverified claims ("<4h", "50+ clients", "99.9%"), no legacy redirects yet, structured data not on every page.
5. Analytics IDs are already configured even though `ANALYTICS_SETUP.md` describes them as pending - doc is slightly stale.
6. `assets/img/loading.svg` appears unused.
7. `404.html` doesn't load consent/main scripts - intentional minimalism, but it also lacks the standard footer (per the identical-footer rule it is the one exception).
8. **Blog pages have been removed** from the site. The `examples/` folder still contains 82 design style mockups referenced by `design-styles.html`.
9. **`studio.html`** now has JSON-LD (SoftwareApplication), skip link, and is in sitemap.xml and llms.txt.
10. **`design-styles.html`** is a live-iframe gallery with two modals (example viewer + style info), mobile-responsive. 10 cards at a time with View more / View all.
11. **`body { overflow-x: hidden }`** was changed to `overflow-x: clip` + `html { overflow-x: hidden }` to fix IntersectionObserver and window scrolling (body was acting as scroll container). This was a site-wide fix.

---

*Researched: all 51 files in the project (19 HTML pages, 13 markdown files, 4 JS files, 1 CSS file of 2,096 lines, 3 images, and 7 config/content files). Document generated as the reference artefact for the redesign effort.*
---

## Update 2026-10-24 — page structure change

This document's earlier sections describe the pre-refactor site and are partially stale. Current structure:

- `web-development.html` and `hosting.html` were **merged into `websites-and-hosting.html`** (route `/websites-and-hosting`). Legacy routes permanently redirect there via `vercel.json` and `.htaccess`.
- New page: `ai.html` (route `/ai`) — AI experts positioning: workflows, integrations, AI-assisted support, AI-powered marketing, engagement process, Goodstuff-Studio band, FAQ.
- `services.html` gained a Digital Marketing section (`#marketing`) — social media marketing, Google Ads, GA4/Search Console/Tag Manager. The AI section was upgraded to the AI-experts positioning and links to `/ai`.
- Correct web prices are **R5,000 business / R8,500 e-commerce** (visible copy and JSON-LD agree).
- Location statement everywhere: based in **Heidelberg, Gauteng**, operating across **South Africa**, serving clients **internationally** via remote delivery.
- New nav (all pages): Services, Web & Hosting, AI, Portfolio, Studio, Contact. Footer Explore column: Home, Services, Websites & Hosting, AI, Design Styles, Portfolio, Studio, Contact.
- Contact form: added `marketing` topic; route prefill accepts support/project/hosting/network/security/ai/marketing.
- `robots.txt` explicitly allows Chrome-Lighthouse/PageSpeed Insights crawlers; everything is crawlable.
- `main.js` no longer double-injects the stylesheet; WebMCP data matches the new pages and anchors (`#it-support`, `#security`).
- Retired files: `web-development.html/.md`, `hosting.html/.md`, `ai-support-integrations.md`, `assets/img/loading.svg`, `studio.extracted.txt`.
- `ai.md`, `websites-and-hosting.md` added; all mirrors and llms.txt/sitemap.xml/sitemap.md/service-catalog.json updated to match.

## Update 2026-10-24 (2) — IT & Networks + Digital Marketing pages

- New `it-and-networks.html` (`/it-and-networks`): seven SEO sections with anchors `#network-administration`, `#it-support`, `#cybersecurity`, `#network-monitoring`, `#ai-operations`, `#it-infrastructure`, `#business-it`. Markdown mirror `it-and-networks.md`.
- New `digital-marketing.html` (`/digital-marketing`): four SEO sections with anchors `#measurement`, `#social-media`, `#google-ads`, `#reporting`. Markdown mirror `digital-marketing.md`.
- Both are footer-only links (nav unchanged at 6 links). Footer Explore now has 10 links on every page.
- Homepage links updated: route card 1 and the IT/marketing service cards now point at the new pages; services.html sections cross-link to the new pages.
- Vercel rewrites added for both routes; sitemap.xml now 12 URLs; llms.txt, sitemap.md, service-catalog.json, main.js WebMCP data all updated.
