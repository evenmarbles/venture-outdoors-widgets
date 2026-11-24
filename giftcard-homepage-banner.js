/**
 * Venture Outdoors | Holiday Gift Card Homepage Banner
 * Version 1.0.0 (2026-11-24)
 *
 * Shows the gift card banner (HTML block id "vo-giftcard-homepage"
 * in Gondola) from Nov 28, 2026 12:00 AM ET until
 * Dec 25, 2026 12:00 AM ET, and hides it at all other times.
 * Preview any time: add ?vo_giftcard_preview=1 to the page URL.
 * Same pattern as tour-giveaway.js.
 */

(function () {
  "use strict";

  const VERSION = "1.0.0";
  const BANNER_ID = "vo-giftcard-homepage";

  const START = Date.parse("2026-11-28T00:00:00-05:00");
  const END = Date.parse("2026-12-25T00:00:00-05:00");

  function isPreview() {
    return new URLSearchParams(window.location.search)
      .get("vo_giftcard_preview") === "1";
  }

  function isActive() {
    const now = Date.now();
    return isPreview() || (now >= START && now < END);
  }

  function updateBanner() {
    const banner = document.getElementById(BANNER_ID);

    if (!banner) return;

    const display = isActive() ? "block" : "none";

    // Only touch the style when it changes, so the observer
    // below doesn't keep firing on our own edits.
    if (banner.style.display !== display) {
      banner.style.display = display;
    }
  }

  function initialize() {
    updateBanner();

    // Recheck periodically while the page remains open.
    setInterval(updateBanner, 30000);

    // Gondola renders page content after load.
    const observer = new MutationObserver(updateBanner);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.info(
      "[Venture Outdoors] Gift Card Banner v" +
      VERSION + " initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
