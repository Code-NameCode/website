(function () {
  "use strict";

  window.goodstuffTrackingConfig = Object.freeze({
    consentVersion: "1",
    cookieName: "gsd_consent_v1",
    consentMaxAgeSeconds: 15552000,

    // Add the business-owned public IDs after the GA4 and Clarity
    // properties have been created. Tracking remains safely inactive while
    // these values are blank.
    ga4MeasurementId: "G-GK6GRLG54F",
    clarityProjectId: "yamfms9iti"
  });
})();
