# Goodstuff Designs — Design System

> **Scope:** This document describes the visual design system used across the Goodstuff Designs website (goodstuffdesigns.co.za). It is the single source of truth for colors, typography, spacing, components, and patterns. Keep it updated when the design changes.

---

## 1. Brand Identity

**Goodstuff Designs** is a South African IT business (Heidelberg, Gauteng) offering managed IT support, business networks, Vox ISP connectivity, Kaspersky security, web development, managed Linux hosting, AI workflows, and a desktop product (Goodstuff-Studio).

- **Tone:** Professional, practical, no-nonsense. Technology that works, support that stays.
- **Audience:** South African business owners and decision-makers.
- **Theme:** Dark-only. No light mode.

---

## 2. Color Palette

### Generation 2 (current, effective) — use these

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#000000` | Page background |
| `--surface` | `#0a0a0a` | Card/panel backgrounds |
| `--carbon` / `--carbon-2` | `#0a0a0a` / `#111111` | Elevated surfaces |
| `--border` | `#1a1a1a` | Default borders |
| `--border-hover` | `#52525b` | Hover/focus borders |
| `--text-primary` | `#ffffff` | Headings, primary text |
| `--text-secondary` | `#a1a1aa` | Body text, descriptions |
| `--text-tertiary` | `#52525b` | Labels, captions, metadata |
| `--accent-emerald` | `#10b981` | Primary accent (CTAs, live dots, links) |
| `--accent-emerald-light` | `#6ee7b7` | Accent text on dark backgrounds |
| `--signal` | `#60a5fa` | Secondary accent (blue, used in terminals) |
| `--trust` | `#10b981` | Trust indicators (same as emerald) |

### Semantic colors (used in terminals/mockups)
| Color | Value | Usage |
|-------|-------|-------|
| Amber | `#f59e0b` | Warnings, secondary highlights |
| Blue | `#60a5fa` | Info, links in terminal mockups |

### Generation 1 (legacy — do not use for new work)
| Token | Value |
|-------|-------|
| `--void` | `#000000` |
| `--carbon` | `#0a0a0a` |
| `--chalk` | `#ffffff` |
| `--fog` | `#a1a1aa` |
| `--signal` | `#60a5fa` |
| `--trust` | `#10b981` |
| `--line` | `#1a1a1a` |

---

## 3. Typography

### Font families
| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Inter', system-ui, sans-serif` | Body text, UI, headings |
| `--font-mono` | `'JetBrains Mono', monospace` | Labels, prices, terminal text, kickers |
| `--font-display` | `"Sora", "Segoe UI", system-ui, sans-serif` | (Legacy, Generation 1) |
| `--font-body` | `"Source Sans 3", "Segoe UI", system-ui, sans-serif` | (Legacy, Generation 1) |

### Font loading
Fonts are loaded via Google Fonts. Only `cookie-policy.html` and `privacy.html` include the `<link>` in `<head>`. All other pages should add:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type scale
| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| H1 (hero) | `clamp(38px, 5.6vw, 68px)` | 800 | Gradient text (white → grey) |
| H2 (section) | `clamp(28px, 4vw, 44px)` | 700 | Letter-spacing: -0.04em |
| H3 (card) | `16-20px` | 600-700 | Letter-spacing: -0.02em |
| Body | `15px` | 400 | Line-height: 1.6-1.7 |
| Small/caption | `12-13px` | 400-500 | Color: text-secondary |
| Micro label | `10px` | 500-600 | Mono, uppercase, letter-spacing: 0.08-0.1em |

### Text treatments
- **Gradient text:** `background: linear-gradient(180deg, #fff 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
- **Uppercase micro-labels:** `font: 10px var(--font-mono); letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-tertiary);`
- **Mono prices:** `font: 600 17px var(--font-mono); letter-spacing: -0.02em;`

---

## 4. Spacing & Layout

### Container
- Max width: `1180px` (Generation 1) / `1120px` (Generation 2, used in most pages)
- Horizontal padding: `clamp(24px, 4vw, 48px)` or `min(100% - 48px, 1120px)`
- Section vertical padding: `84-88px` (desktop), `56-64px` (mobile)

### Grid
- **Bento grid:** `repeat(3, minmax(0, 1fr))` with `12px` gap
- **Card grids:** `repeat(2-4, minmax(0, 1fr))` with `12-16px` gap
- **Track/process:** `grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr)`

### Breakpoints
| Breakpoint | Usage |
|------------|-------|
| `1120px` | Container max width |
| `960px` | 2-column grids → 1 column |
| `900px` | Nav collapses to hamburger, grids stack |
| `860px` | Legacy mobile nav (Generation 1) |
| `760px` | Blog/policy single column |
| `700px` | Services tabs stack |
| `600px` | Single-column metrics/plans, cookie banner |
| `540px` | Homepage guardrails |
| `420px` | Mobile edge cases |

### Border radius
- Cards: `14px`
- Buttons: `9px`
- Pills/badges: `999px` (fully rounded)
- Modals: `18px`
- Avatars/swatches: `6-10px`

---

## 5. Components

### Navigation
- Fixed, blurred, 56px height
- Brand SVG (28×28) + "Goodstuff Designs" text
- Links: Services, Web & Hosting, AI, Portfolio, Studio, Contact
- Active page: `aria-current="page"` with emerald underline
- Mobile: hamburger toggle (`.nav-toggle`), slide-down menu (`.nav-links.open`)
- Legacy navs get "Services" auto-inserted by `main.js`

### Footer
- 3 columns: Brand + socials, Explore (10 links, two side-by-side sub-columns via `.footer-col--explore`; collapses to one column below 640px; Explore gets the widest footer-cols share), Contact, CTA
- Social icons: Facebook, Instagram, LinkedIn, YouTube, X (32×32, border, 8px radius)
- Bottom bar: copyright + domain + privacy/cookies/sitemap/cookie-settings links
- `consent.js` injects social links and cookie settings button if missing

### Buttons
| Class | Style |
|-------|-------|
| `.btn-primary` | Emerald background, white text, rounded 9px |
| `.btn-ghost` | Transparent, border, white text, rounded 9px |
| `.cookie-button` | Dark background, border, rounded 9px |
| `.modal-close` | Dark background, border, rounded 9px, 44px min-height on mobile |

### Cards
- Dark background (`#080808`), 1px border (`#1a1a1a`), 14px radius
- Hover: `translateY(-4px)`, border-color → `#52525b`
- Featured card: spans full grid width, 340px visual height

### Badges / Pills
- `.pill-badge`: small pill with pulsing live-dot (emerald)
- `.visual-type`: absolute positioned, top-left of card visual
- `.route-tag` / `.build-tag`: mono, 10px, uppercase, tertiary color

### Modals
- Backdrop: `rgba(0,0,0,.78)` with `backdrop-filter: blur(8px)`
- Panel: centered, `min(100% - 32px, 1040px)` × `min(100% - 32px, 760px)`, 18px radius
- Mobile: bottom sheet (94dvh, 18px top radius, safe-area padding)
- Grab handle: 44×4px, centered, `#3a3a3a`
- Head: sticky, 16px 20px padding, border-bottom
- Close button: 44px min-height on mobile, icon + "Close" text (text hidden on mobile)

### Cookie banner
- Modal-style dialog, centered
- Accept/Reject buttons
- Links to privacy and cookie policy
- Live status line showing current choice
- Shows after 6s (or `gsd-loader-finished` event) if no choice stored

### Terminal/Console cards
- Dark background, monospace text
- Fake browser chrome (3 dots + URL bar)
- Used on homepage (status card) and services page (service console)

---

## 6. Motion & Animation

- **Scroll reveal:** `.reveal` / `.gs-reveal` — opacity 0 → 1, translateY 24px → 0, 0.65s ease
- **Stagger:** card grid children get `--gs-delay` (0-420ms)
- **Failsafe:** anything still hidden after 2.5s is shown
- **Reduced motion:** all animations disabled via `prefers-reduced-motion: reduce`
- **Nav elevation:** `.gs-scrolled` class toggled on scroll > 12px
- **Scroll progress bars:** homepage scroll-reveal pattern; article pages get a reading-progress bar

---

## 7. Accessibility

- Skip links on all pages except homepage
- `aria-current="page"` on active nav link
- `aria-pressed` / `aria-selected` on tab patterns
- Keyboard arrow navigation on services tabs
- `aria-live` regions for dynamic content
- `focus-visible` outlines (2px emerald)
- Reduced motion handling throughout
- Focus traps on modals (portfolio, design-styles)
- `aria-hidden="true"` on decorative elements

---

## 8. Responsive Design

- Mobile-first approach on most pages
- Breakpoints: 1120px, 960px, 900px, 860px, 760px, 700px, 600px, 540px, 420px
- Nav collapses at 900px (hamburger)
- Grids stack at 900px/760px/600px
- Modals become bottom sheets at 760px
- Touch targets: 44px minimum on mobile

---

## 9. File Structure

```
assets/
  css/
    styles.css          # Single stylesheet (2,245 lines, 2 generations)
  js/
    tracking-config.js  # Frozen analytics config (GA4 + Clarity IDs)
    consent-bootstrap.js # Consent Mode v2 defaults (first in <head>)
    consent.js          # Cookie banner, footer injection, event tagging
    main.js             # Favicon, nav, footer, WebMCP tools
    motion.js           # Scroll reveals, nav elevation
  img/
    favicon.svg         # Site favicon
    phone-number.svg    # Contact page phone graphic
  projects/             # 9 portfolio screenshots (WebP)
  studio/               # 14 Goodstuff-Studio screenshots (PNG)
examples/               # 83 design style mockups (HTML)
docs/
  DISCOVERY.md          # Architecture inventory
```

### Page map (2026-10-24)

index.html, services.html (overview incl. #marketing), it-and-networks.html (7 SEO sections: network-administration, it-support, cybersecurity, network-monitoring, ai-operations, it-infrastructure, business-it), digital-marketing.html (4 SEO sections: measurement, social-media, google-ads, reporting), websites-and-hosting.html (merged web development + hosting; legacy `/web-development` and `/hosting` 301 here), ai.html, design-styles.html, portfolio.html, studio.html, contact.html, privacy.html, cookie-policy.html, 404.html. Markdown mirror per page. Contact form posts to report.goodstuffdesigns.co.za. Footer Explore column lists 10 links (Home, Services, Websites & Hosting, AI, IT & Networks, Digital Marketing, Design Styles, Portfolio, Studio, Contact); the nav intentionally stays at 6 links.

---

## 10. Conventions

### HTML
- Every page follows the same skeleton (see DISCOVERY.md §3)
- Head script order: `tracking-config.js` → `consent-bootstrap.js` → title/meta → stylesheet → fonts → page-specific styles
- Body scripts: inline page script → `consent.js` → `main.js` → `motion.js` (all deferred)
- Use `data-clarity-mask="true"` on pages with sensitive content (contact, studio)

### CSS
- Use Generation-2 tokens (`--bg`, `--surface`, `--border`, `--accent-emerald`, `--text-primary/secondary/tertiary`, `--font-sans`, `--font-mono`)
- Inline `<style>` blocks per page for page-specific styles
- Shared patterns (cards, grids, modals) are defined in `styles.css`

### JavaScript
- No frameworks — vanilla JS only
- `main.js` and `consent.js` are shared across all pages
- Page-specific JS is inline in `<script>` blocks
- WebMCP tools registered when `document.modelContext` exists

### Images
- Portfolio: WebP format
- Studio: PNG format (should be WebP)
- SVG for icons and favicon
- Use `loading="lazy"` on below-the-fold images

### Naming
- Files: kebab-case (`websites-and-hosting.html`, `cookie-policy.html`)
- CSS classes: kebab-case (`.style-card`, `.build-grid`)
- JS variables: camelCase
- CSS variables: kebab-case with `--` prefix

---

## 11. Known Issues

1. **Generation 1 CSS** (~700 lines) is dead code but still shipped
2. **Nav/footer** are authored per-page (minor formatting differences)
3. **Social URLs** were inconsistent between `consent.js` and hardcoded footers (now fixed)
4. **`assets/img/loading.svg`** appears unused
6. **Blog pages** have been removed; `examples/` folder still contains 83 mockups
7. **No build step** — all files are hand-authored HTML/CSS/JS
8. **No automated tests** — no link checking, accessibility audits, or visual regression

---

*Last updated: 2026-10-24 (added it-and-networks, digital-marketing)*