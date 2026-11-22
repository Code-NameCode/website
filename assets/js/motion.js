/* Goodstuff Designs — shared motion & interactivity layer.
   Loaded on every page via <script src="assets/js/motion.js" defer>.
   Safe without JS: .gs-reveal is only ever added by this script.
   Fully disabled when the visitor prefers reduced motion. */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document.documentElement;
  doc.classList.add("gs-motion");

  /* ── Scroll reveal ──────────────────────────────────────────────
     Animates: elements already marked .reveal (pages with inline
     scripts handle those too — this is a harmless fallback), plus
     content sections and card grids on pages without their own
     reveal markup (blog, articles, contact, policy, 404). */
  const sectionTargets = () => {
    const picks = [];
    document.querySelectorAll("main section, body > section").forEach((section) => {
      if (section.closest("nav, footer, .cookie-banner")) return;
      if (section.classList.contains("reveal")) return;
      // Hero sections stay visible immediately; the page-load moment
      // is the first screen, no scrolling entrance needed there.
      if (section.querySelector("h1") && section.getBoundingClientRect().top < window.innerHeight) return;
      picks.push(section);
    });
    return picks;
  };

  const cardSelectors = [
    ".plan-card", ".blog-card", ".build-card", ".route-card", ".work-card",
    ".value-item", ".policy-section", ".faq-item", ".note-row", ".notes-row",
    ".contact-card", ".info-card", ".step", ".feature", ".service-tile"
  ];

  let revealTargets = [];
  if (!reduceMotion) {
    revealTargets = [...sectionTargets(), ...document.querySelectorAll(cardSelectors.join(","))]
      .filter((el) => !el.closest("nav, footer, .cookie-banner"))
      .filter((el, i, all) => all.indexOf(el) === i)
      .filter((el) => !el.classList.contains("reveal") && !el.classList.contains("gs-reveal"));
    revealTargets.forEach((el) => el.classList.add("gs-reveal"));
  }

  const reveal = (els) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => observer.observe(el));
  };

  if (!reduceMotion) {
    // Existing .reveal elements: make sure they become visible even if a
    // page's inline script fails to run.
    reveal(document.querySelectorAll(".reveal:not(.is-visible)"));
    reveal(revealTargets);

    // Stagger siblings inside card grids so rows cascade, not pop.
    document.querySelectorAll(".blog-grid, .plans-grid, .build-grid, .values-grid, .policy-section, .article-related .blog-grid").forEach((grid) => {
      [...grid.children].forEach((child, i) => {
        if (child.classList.contains("gs-reveal")) child.style.setProperty("--gs-delay", `${Math.min(i * 70, 420)}ms`);
      });
    });

    // Failsafe: anything still hidden after 2.5s (e.g. observer edge
    // cases) is shown, so content can never be lost.
    setTimeout(() => {
      document.querySelectorAll(".gs-reveal:not(.is-visible)").forEach((el) => el.classList.add("is-visible"));
    }, 2500);
  }

  /* ── Nav elevation on scroll ── */
  let lastScrolled = false;
  const onScrollNav = () => {
    const scrolled = window.scrollY > 12;
    if (scrolled !== lastScrolled) {
      doc.classList.toggle("gs-scrolled", scrolled);
      lastScrolled = scrolled;
    }
  };

  /* ── Reading progress bar (article pages only) ── */
  const articleBody = document.querySelector(".article-body");
  let progress = null;
  if (articleBody && !reduceMotion) {
    progress = document.createElement("div");
    progress.className = "gs-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);
  }

  /* ── Back to top ── */
  let topButton = null;
  const onScrollTop = () => {
    if (!topButton) return;
    topButton.classList.toggle("is-shown", window.scrollY > 640);
  };
  {
    topButton = document.createElement("button");
    topButton.type = "button";
    topButton.className = "gs-top";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.innerHTML = "&#8593;";
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      const brand = document.querySelector(".nav-links a, .brand, header a");
      if (brand) brand.focus({ preventScroll: true });
    });
    document.body.append(topButton);
  }

  /* ── Quiet hover lift for card-like elements ── */
  if (!reduceMotion) {
    document.querySelectorAll([
      ".plan-card", ".blog-card", ".build-card", ".route-card", ".work-card",
      ".value-item", ".info-card", ".contact-card", ".service-tile", ".faq-item"
    ].join(",")).forEach((el) => {
      if (!el.classList.contains("gs-lift") && !el.closest("nav, footer")) el.classList.add("gs-lift");
    });
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollNav();
      onScrollTop();
      if (progress && articleBody) {
        const rect = articleBody.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.5;
        const done = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
        progress.style.transform = `scaleX(${done})`;
      }
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
