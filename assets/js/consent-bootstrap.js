(function () {
  "use strict";

  var config = window.goodstuffTrackingConfig || {};
  var cookieName = config.cookieName || "gsd_consent_v1";
  var match = document.cookie.match(new RegExp("(?:^|;\\s*)" + cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
  var choice = match ? decodeURIComponent(match[1]) : "unset";
  var accepted = choice === "accepted";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var consentDefaults = {
    analytics_storage: accepted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  };

  if (choice === "unset") consentDefaults.wait_for_update = 500;
  window.gtag("consent", "default", consentDefaults);
  window.gtag("set", "ads_data_redaction", true);

  window.dataLayer.push({
    event: "gsd_consent_bootstrap",
    analytics_consent: accepted ? "granted" : "denied",
    consent_choice: choice,
    consent_version: String(config.consentVersion || "1"),
    ga4_measurement_id: config.ga4MeasurementId || "",
    clarity_project_id: config.clarityProjectId || ""
  });

  var loadVendors = function () {
    var firstScript = document.getElementsByTagName("script")[0];
    var ga4Id = String(config.ga4MeasurementId || "");
    if (/^G-[A-Z0-9]+$/.test(ga4Id)) {
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id);
    firstScript.parentNode.insertBefore(gaScript, firstScript);
    window.gtag("js", new Date());
    var host = String(location.hostname || "").toLowerCase().replace(/\.$/, "");
    var gaConfig = { send_page_view: true };
    // Let GA use a valid first-party domain only on a real DNS hostname.
    if (host && host !== "localhost" && !/^\d+(?:\.\d+){3}$/.test(host)) {
      gaConfig.cookie_domain = host.replace(/^www\./, "");
    }
    if (location.protocol === "https:") gaConfig.cookie_flags = "SameSite=Lax;Secure";
      window.gtag("config", ga4Id, gaConfig);
    }

    var clarityId = String(config.clarityProjectId || "");
    if (/^[a-z0-9]+$/i.test(clarityId)) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: accepted ? "granted" : "denied"
    });
    var clarityScript = document.createElement("script");
    clarityScript.async = true;
    clarityScript.src = "https://www.clarity.ms/tag/" + encodeURIComponent(clarityId);
      firstScript.parentNode.insertBefore(clarityScript, firstScript);
    }
  };
  var deferVendors = function () { window.setTimeout(loadVendors, 1500); };
  if (document.readyState === "complete") deferVendors();
  else window.addEventListener("load", deferVendors, { once: true });
})();
