const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector("#nav-links");

if (!document.querySelector('link[rel="icon"]')) {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href = "assets/img/favicon.svg?v=2";
  document.head.appendChild(favicon);
}

if (!document.querySelector('link[rel="manifest"]')) {
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = "manifest.json";
  document.head.appendChild(manifestLink);
}

if (!document.querySelector('link[data-gsd-style]') && !document.querySelector('link[rel="stylesheet"][href*="styles.css"]')) {
  const freshStyles = document.createElement("link");
  freshStyles.rel = "stylesheet";
  freshStyles.dataset.gsdStyle = "true";
  freshStyles.href = "assets/css/styles.css?v=loader-3";
  document.head.appendChild(freshStyles);
}

document.querySelectorAll("a.brand").forEach((brand) => {
  brand.setAttribute("href", "/");
});

// Keep the shared Services route visible on pages authored before it existed.
document.querySelectorAll("#nav-links, .footer-col").forEach((group) => {
  if (group.querySelector('a[href="services"], a[href="services.html"]')) return;
  const home = group.querySelector('a[href="/"], a[href="./"], a[href="index.html"]');
  if (!home) return;
  const serviceLink = document.createElement("a");
  serviceLink.href = "services";
  serviceLink.textContent = "Services";
  home.insertAdjacentElement("afterend", serviceLink);
});

if (links) {
  links.querySelectorAll('a[href="/"], a[href="./"], a[href="index.html"]').forEach((homeLink) => homeLink.remove());
  const here = new URL(location.href);
  const herePath = here.pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  links.querySelectorAll("a").forEach((link) => {
    const linkPath = new URL(link.href, location.href).pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
    if (linkPath === herePath && herePath !== "/" && herePath !== "/index") link.setAttribute("aria-current", "page");
  });
}

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

if (document.modelContext?.registerTool && !window.__goodstuffWebMcpRegistered) {
  window.__goodstuffWebMcpRegistered = true;
  const lifecycle = new AbortController();
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  const services = [
    {
      id: "managed-it-support",
      name: "Managed IT support",
      url: "/it-and-networks#it-support",
      summary: "Support for devices, users, email, networks, backups, access, and supplier coordination."
    },
    {
      id: "business-networks",
      name: "Business networks and fibre",
      url: "/it-and-networks#network-administration",
      summary: "Network administration: routers, switches, WiFi, VLANs and firewalls, plus Vox ISP connectivity from coverage check to installed line."
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      url: "/it-and-networks#cybersecurity",
      summary: "Vulnerability assessments, security audits, endpoint protection including Kaspersky from R278, and incident response."
    },
    {
      id: "it-infrastructure",
      name: "IT infrastructure and monitoring",
      url: "/it-and-networks#it-infrastructure",
      summary: "Server deployment, backups, cloud infrastructure, disaster recovery, and open source network monitoring with automated alerts."
    },
    {
      id: "websites-and-hosting",
      name: "Web design, development and hosting",
      url: "/websites-and-hosting",
      summary: "Business websites from R5,000, e-commerce from R8,500, custom web apps, and managed Linux hosting from R100 per month - built, hosted and supported by one team."
    },
    {
      id: "ai-workflows-integrations",
      name: "AI workflows and integrations",
      url: "/ai",
      summary: "AI experts designing human-controlled workflows, business integrations, AI-assisted support and AI-powered marketing that stay explainable and audited."
    },
    {
      id: "digital-marketing",
      name: "Digital marketing",
      url: "/digital-marketing",
      summary: "Measurement and tracking with GA4, Search Console and Tag Manager; social media marketing; Google Ads management; and reporting with cost per lead and ROI."
    }
  ];
  const pages = [
    { name: "Home", url: "/", purpose: "Overview of Goodstuff Designs and its technology services." },
    { name: "Services", url: "/services", purpose: "Service overview: managed IT, networks and fibre, Kaspersky security, digital marketing, and how an engagement runs." },
    { name: "IT and Networks", url: "/it-and-networks", purpose: "Network administration, IT support, cybersecurity, network monitoring, AI for IT operations, IT infrastructure and managed business IT services." },
    { name: "Websites and Hosting", url: "/websites-and-hosting", purpose: "Business websites, e-commerce, web applications, managed Linux hosting plans, and the design style library." },
    { name: "AI", url: "/ai", purpose: "AI experts: workflows, business integrations, AI-assisted support and AI-powered marketing, human-controlled and audited." },
    { name: "Digital Marketing", url: "/digital-marketing", purpose: "Measurement and tracking, social media marketing, Google Ads management, and reporting with cost per lead and ROI." },
    { name: "Portfolio", url: "/portfolio", purpose: "Selected websites, applications, dashboards, and business tools." },
    { name: "Design Styles", url: "/design-styles", purpose: "Eighty named visual styles shown as live working examples, plus layout archetypes." },
    { name: "Studio", url: "/studio", purpose: "Goodstuff-Studio: a desktop AI workspace for Windows with agents, projects, skills and scheduled tasks." },
    { name: "Contact", url: "/contact", purpose: "Start a support, project, hosting, network, security, AI or marketing conversation." },
    { name: "Privacy Policy", url: "/privacy", purpose: "How Goodstuff Designs processes personal information." },
    { name: "Cookie Policy", url: "/cookie-policy", purpose: "Essential and optional analytics storage, providers, and visitor controls." }
  ];
  const pricing = {
    hosting: {
      currency: "ZAR", billingTerm: "month", checked: "2026-08-30",
      options: [{ name: "Novice Linux Hosting", price: 100 }, { name: "Business Linux Hosting", price: 200 }, { name: "Pro Linux Hosting", price: 600 }]
    },
    kaspersky: {
      currency: "ZAR", billingTerm: "1 year", source: "Voxos", checked: "2026-08-30",
      options: {
        standard: { 1: 278, 3: 318, 5: 370, 10: 462 },
        plus: { 1: 399, 3: 438, 5: 479, 10: 699 },
        premium: { 1: 438, 3: 478, 5: 509, 10: 769, 20: 999 }
      },
      note: "Confirm current price, availability, compatibility, and licence terms before purchase."
    },
    "vox-isp": {
      currency: "ZAR", billingTerm: "month", source: "Voxos", checked: "2026-08-30",
      options: [{ name: "Home Fibre FTTH", priceFrom: 349 }, { name: "Business Fibre FTTB", price: "quote" }, { name: "Fixed LTE-A and 5G", price: "quote" }, { name: "Fixed wireless", price: "quote" }, { name: "Rural satellite", price: "quote" }, { name: "Uncapped VoIP", price: "quote" }],
      note: "Coverage, network operator, speed, equipment, and contract terms determine final pricing."
    }
  };
  const register = (tool) => {
    try {
      void Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
    } catch (_) {}
  };

  register({
    name: "search_services", title: "Search services",
    description: "Search Goodstuff Designs public services by a business need or keyword. Returns matching read-only catalogue entries.",
    inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1, description: "A need such as fibre, antivirus, website, hosting, network, or support." } }, required: ["query"], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: ({ query }) => {
      const terms = String(query).toLowerCase().trim().split(/\s+/).filter(Boolean);
      return services.filter((service) => {
        const haystack = `${service.name} ${service.summary}`.toLowerCase();
        return terms.every((term) => haystack.includes(term)) || terms.some((term) => haystack.includes(term));
      });
    }
  });
  register({
    name: "list_site_pages", title: "List site pages",
    description: "List the canonical public Goodstuff Designs pages and the purpose of each page. This is read-only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: () => pages
  });
  register({
    name: "get_service_pricing", title: "Get service pricing",
    description: "Get published public pricing for managed hosting, Kaspersky licences, or Vox ISP connectivity. This does not place an order or guarantee availability.",
    inputSchema: { type: "object", properties: { service: { type: "string", enum: ["hosting", "kaspersky", "vox-isp"] } }, required: ["service"], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: ({ service }) => pricing[service]
  });
  register({
    name: "list_integrations", title: "List integration areas",
    description: "List public Goodstuff Designs integration categories available for assessment. This is read-only and does not promise implementation availability.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: () => [{ category: "Communication", status: "assessment-ready" }, { category: "CRM and sales", status: "assessment-ready" }, { category: "Operations", status: "assessment-ready" }]
  });
  register({
    name: "start_contact_enquiry", title: "Start contact enquiry",
    description: "Navigate the visible page to the Goodstuff Designs contact route for support, a project, hosting, a network, security, AI, or marketing. This only opens the enquiry page; it does not send a message.",
    inputSchema: { type: "object", properties: { route: { type: "string", enum: ["support", "project", "hosting", "network", "security", "ai", "marketing"] } }, required: ["route"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute: ({ route }) => {
      const target = new URL("/contact", location.origin);
      target.searchParams.set("route", route);
      window.location.assign(target.href);
      return { status: "navigation_started", destination: `/contact?route=${route}`, messageSent: false };
    }
  });
}