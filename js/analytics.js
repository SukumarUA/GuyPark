/* =========================================================================
   Google Analytics 4 — Guy Park Pharmacy
   -------------------------------------------------------------------------
   SETUP: replace the MEASUREMENT_ID below with your real GA4 ID (it looks
   like "G-XXXXXXXXXX"). You'll find it at:
   https://analytics.google.com → Admin (gear icon) → Data Streams →
   click your web data stream → "Measurement ID" near the top right.

   Until you replace the placeholder, this file does nothing — no network
   calls, no console errors except a friendly warning.

   IP anonymization is enabled by default because this is a pharmacy site
   and patient-adjacent traffic deserves the extra privacy.
   ========================================================================= */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← REPLACE THIS

  // Bail out if the ID hasn't been set yet — keeps dev/staging quiet.
  if (!MEASUREMENT_ID || MEASUREMENT_ID.indexOf('XXXX') !== -1) {
    if (window.console && console.info) {
      console.info(
        '[analytics.js] GA4 not initialized — MEASUREMENT_ID is still a placeholder. ' +
        'Edit js/analytics.js to enable.'
      );
    }
    return;
  }

  // Inject the gtag.js loader
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  // Initialize the dataLayer + gtag — events queue here until gtag.js loads.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,    // less personalized tracking; safer for pharmacy
    allow_ad_personalization_signals: false
  });
})();
