
/**
 * Venture Outdoors | Tour Giveaway Callout
 * Version 1.0.0
 *
 * Turkey Day Giveaway 2026
 * Nov 10, 10:00 AM EST – Nov 27, 11:59 PM EST
 */

(function () {
  "use strict";

  const VERSION = "1.0.0";
  const CALLOUT_ID = "vo-tour-giveaway";

  const START = Date.parse("2026-11-10T10:00:00-05:00");
  const END = Date.parse("2026-11-28T00:00:00-05:00");

  function isPreview() {
    return new URLSearchParams(window.location.search)
      .get("vo_giveaway_preview") === "1";
  }

  function isActive() {
    const now = Date.now();
    return isPreview() || (now >= START && now < END);
  }

  function updateCallout() {
    const callout = document.getElementById(CALLOUT_ID);

    if (!callout) return;

    callout.style.display = isActive() ? "block" : "none";
  }

  function initialize() {
    updateCallout();

    // Recheck periodically while the page remains open.
    setInterval(updateCallout, 30000);

    // Support dynamically rendered tour content.
    const observer = new MutationObserver(updateCallout);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.info(
      "[Venture Outdoors] Tour Giveaway v" +
      VERSION + " initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
