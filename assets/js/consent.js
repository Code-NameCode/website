(fu<a href=\"https://github.com/Code-NameCode\" target=\"_blank\" rel=\"noopener\" aria-label=\"GitHub\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3\"/></svg></a>nction () {
  "use strict";

  var config = window.goodstuffTrackingConfig || {};
  var cookieName = config.cookieName || "gsd_consent_v1";
  var consentVersion = String(config.consentVersion || "1");
  var maxAge = Number(config.consentMaxAgeSeconds || 15552000);
  var lastFocusedElement = null;

  // localStorage is checked first so the banner only ever shows once per browser:
  // a saved preference survives cookie deletion/blocking. Cookies and sessionStorage
  // are read as fallbacks so a stored choice is honoured from any layer.
  function getChoice() {
    try {
      var stored = localStorage.getItem(cookieName);
      if (stored === "accepted" || stored === "rejected") return stored;
    } catch (_) {}
    var escaped = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var match = document.cookie.match(new RegExp("(?:^|;\\s*)" + escaped + "=([^;]*)"));
    var value = match ? decodeURIComponent(match[1]) : "unset";
    if (value === "unset") {
      try { value = localStorage.getItem(cookieName) || "unset"; } catch (_) {}
    }
    return value === "accepted" || value === "rejected" ? value : "unset";
  }

  function writeChoice(choice) {
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = cookieName + "=" + encodeURIComponent(choice) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax" + secure;
    try { localStorage.setItem(cookieName, choice); } catch (_) {}
  }

  function clearAnalyticsCookies() {
    var names = document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); });
    var host = String(location.hostname || "").toLowerCase().replace(/\.$/, "");
    var canSetDomain = host && host !== "localhost" && !/^\d+(?:\.\d+){3}$/.test(host);
    names.filter(function (name) {
      return /^(_ga|_gid|_gat|_clck|_clsk)/.test(name);
    }).forEach(function (name) {
      document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
      if (canSetDomain) document.cookie = name + "=; Max-Age=0; Path=/; Domain=." + host.replace(/^www\./, "") + "; SameSite=Lax";
    });
  }

  function updateVendors(choice) {
    var analyticsConsent = choice === "accepted" ? "granted" : "denied";
    window.gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
    window.gtag("consent", "update", {
      analytics_storage: analyticsConsent,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "gsd_consent_update",
      analytics_consent: analyticsConsent,
      consent_version: consentVersion
    });

    if (typeof window.clarity === "function") {
      window.clarity("consentv2", {
        ad_Storage: "denied",
        analytics_Storage: analyticsConsent
      });
      if (choice === "rejected") window.clarity("consent", false);
    }

    if (choice === "rejected") clearAnalyticsCookies();
  }

  function makeBanner() {
    var banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "cookie-title");
    banner.setAttribute("aria-describedby", "cookie-description");
    banner.hidden = true;
    banner.innerHTML = [
      '<div class="cookie-signal" aria-hidden="true"><i></i><span>Privacy control</span></div>',
      '<div class="cookie-copy">',
      '<h2 id="cookie-title">Choose how this site measures visits.</h2>',
      '<p id="cookie-description">Essential cookies keep your choice. Analytics helps us improve the site. If you reject it, Google and Microsoft may still receive limited cookieless signals.</p>',
      '<div class="cookie-policy-links"><a href="/privacy">Privacy policy</a><a href="/cookie-policy">Cookie policy</a></div>',
      '</div>',
      '<div class="cookie-actions">',
      '<button class="cookie-button cookie-button-primary" type="button" data-consent-choice="accepted">Accept analytics</button>',
      '<button class="cookie-button" type="button" data-consent-choice="rejected">Reject</button>',
      '</div>',
      '<p class="cookie-current" aria-live="polite"></p>'
    ].join("");
    document.body.appendChild(banner);
    return banner;
  }

  function showBanner(returnFocus) {
    var banner = document.querySelector("#cookie-banner");
    if (!banner) return;
    lastFocusedElement = returnFocus || document.activeElement;
    var choice = getChoice();
    var status = banner.querySelector(".cookie-current");
    status.textContent = choice === "accepted" ? "Current choice: analytics accepted" : choice === "rejected" ? "Current choice: analytics rejected" : "No choice saved yet";
    banner.hidden = false;
    requestAnimationFrame(function () {
      banner.classList.add("is-open");
      banner.querySelector("[data-consent-choice]").focus({ preventScroll: true });
    });
  }

  function hideBanner() {
    var banner = document.querySelector("#cookie-banner");
    if (!banner) return;
    banner.classList.remove("is-open");
    window.setTimeout(function () { banner.hidden = true; }, 220);
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus({ preventScroll: true });
  }

  function ensureFooterControls() {
    document.querySelectorAll(".footer-inner > div:first-child").forEach(function (brandColumn) {
      if (brandColumn.querySelector(".social-links")) return;
      var social = document.createElement("div");
      social.className = "social-links";
      social.setAttribute("aria-label", "Social media links");
      social.innerHTML = '<a href="https://github.com/Code-NameCode" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.2-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg></a><a href="https://www.facebook.com/goodstuffdesigns" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-4 0-6 2-6 6v4H5v4h3v6h4v-6h4l1-4h-5v-3c0-2 1-3 2-3Z"/></svg></a><a href="https://www.instagram.com/goodstuff.designs/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="https://www.linkedin.com/company/goodstuff-designs" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 8H1v13h4V8ZM3 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm18 11c0-4-2-6-5-6-2 0-3 1-4 2V8H8v13h4v-7c0-2 1-3 3-3s2 2 2 4v6h4v-8Z"/></svg></a><a href="https://www.youtube.com/@Goodstuff-Designs" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7c0-2-1-3-3-3H4C2 4 1 5 1 7v10c0 2 1 3 3 3h16c2 0 3-1 3-3V7ZM10 16V8l6 4-6 4Z"/></svg></a><a href="https://x.com/GS_Designs_za" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 2h4l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h6l5 6 5-6Zm-1 18h2L7 4H5l12 16Z"/></svg></a>';
      brandColumn.appendChild(social);
    });
    document.querySelectorAll(".footer-bottom").forEach(function (footer) {
      if (footer.querySelector(".footer-privacy-links")) return;
      var links = document.createElement("div");
      links.className = "footer-privacy-links";
      links.innerHTML = '<a href="/privacy">Privacy</a><a href="/cookie-policy">Cookies</a><a href="sitemap.xml">Sitemap</a><button type="button" data-cookie-settings>Cookie settings</button>';
      footer.appendChild(links);
    });
  }

  function addAnalyticsMetadata() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.dataset.analyticsEvent = "generate_lead";
      link.dataset.leadType = link.href.indexOf("Hosting") > -1 ? "hosting" : link.href.indexOf("project") > -1 || link.href.indexOf("Project") > -1 ? "project" : link.href.indexOf("Support") > -1 ? "support" : "email";
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.dataset.analyticsEvent = "generate_lead";
      link.dataset.leadType = "phone";
    });
    document.querySelectorAll('a[href*="/contact?route="]').forEach(function (link) {
      var route = new URL(link.href, location.href).searchParams.get("route");
      if (!/^(support|project|hosting)$/.test(route || "")) return;
      link.dataset.analyticsEvent = "generate_lead";
      link.dataset.leadType = route;
    });
    document.querySelectorAll(".social-links a").forEach(function (link) {
      var label = String(link.getAttribute("aria-label") || "social").toLowerCase();
      link.dataset.analyticsEvent = "social_click";
      link.dataset.socialPlatform = label;
    });
    var selectedPlan = document.querySelector("#selected-plan-link");
    if (selectedPlan) {
      selectedPlan.dataset.analyticsEvent = "hosting_plan_select";
      var shortPlanName = selectedPlan.textContent.replace(/^Choose\s+/i, "").trim();
      selectedPlan.dataset.planName = /^(Novice|Business|Pro)$/.test(shortPlanName) ? shortPlanName + " Linux Hosting" : shortPlanName;
    }
  }

  function bindMeasurement() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-analytics-event]");
      if (!target) return;
      var eventName = target.dataset.analyticsEvent;
      var payload = {};
      if (eventName === "generate_lead") payload.lead_type = target.dataset.leadType || "general";
      if (eventName === "hosting_plan_select") payload.plan_name = target.dataset.planName || "hosting";
      if (eventName === "social_click") payload.social_platform = target.dataset.socialPlatform || "social";
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, payload));
      if (typeof window.gtag === "function") window.gtag("event", eventName, payload);
    });
  }

  function init() {
    var banner = makeBanner();
    ensureFooterControls();
    addAnalyticsMetadata();
    bindMeasurement();

    banner.addEventListener("click", function (event) {
      var button = event.target.closest("[data-consent-choice]");
      if (!button) return;
      var choice = button.dataset.consentChoice;
      writeChoice(choice);
      updateVendors(choice);
      hideBanner();
    });

    document.addEventListener("click", function (event) {
      var settings = event.target.closest("[data-cookie-settings]");
      if (!settings) return;
      event.preventDefault();
      showBanner(settings);
    });

    banner.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && getChoice() !== "unset") hideBanner();
    });

    window.goodstuffConsent = Object.freeze({
      open: function () { showBanner(document.activeElement); },
      getChoice: getChoice
    });

    var storedChoice = getChoice();
    if (storedChoice === "unset") {
      var scheduled = false;
      var scheduleBanner = function () {
        if (scheduled) return;
        scheduled = true;
        window.setTimeout(function () { if (getChoice() === "unset") showBanner(); }, 6000);
      };
      window.addEventListener("gsd-loader-finished", scheduleBanner, { once: true });
      window.setTimeout(scheduleBanner, 300);
    } else updateVendors(storedChoice);
  }

  function start() {
    try {
      init();
    } catch (error) {
      window.__goodstuffConsentError = String(error && error.message ? error.message : error);
      console.error("Goodstuff consent could not initialise:", error);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
