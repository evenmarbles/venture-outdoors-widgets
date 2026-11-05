
/**
 * Venture Outdoors | Turkey Day Giveaway
 * Landing Page Controller
 * Version 1.0.0
 */

(function () {
  "use strict";

  const START = Date.parse("2026-11-10T10:00:00-05:00");
  const END = Date.parse("2026-11-28T00:00:00-05:00");

  const ID = (id) => document.getElementById(id);

  const params = new URLSearchParams(location.search);

  const allowedPreview = [
    "upcoming",
    "open",
    "closed",
    "winner"
  ];

  const preview = allowedPreview.includes(
    params.get("vo_giveaway_state")
  )
    ? params.get("vo_giveaway_state")
    : null;

  function realState() {
    const now = Date.now();

    if (now < START) return "upcoming";
    if (now < END) return "open";

    const config = ID("vo-giveaway-winner-config");

    return config &&
      config.dataset.published === "true" &&
      (config.dataset.winnerName || "").trim()
        ? "winner"
        : "closed";
  }

  function show(el, yes) {
    if (!el) return;

    const target = yes ? "block" : "none";

    if (el.style.display !== target) {
      el.style.display = target;
    }
  }

  function render() {
    const state = preview || realState();

    // Section 1: Introduction
    const intro = ID("vo-giveaway-intro-status");

    const messages = {
      upcoming:
        "Our Turkey Day Giveaway opens November 10, 2026. Come back for your chance to win!",
      open:
        "Enter now through November 27, 2026, for your chance to win!",
      closed:
        "Our Turkey Day Giveaway has ended. Thank you to everyone who entered!",
      winner:
        "Our Turkey Day Giveaway has ended. Congratulations to our winner!"
    };

    if (
      intro &&
      intro.textContent.trim() !== messages[state]
    ) {
      intro.textContent = messages[state];
    }

    // Section 2: How to Enter
    show(
      ID("vo-giveaway-how-to-enter"),
      state === "upcoming" || state === "open"
    );

    show(
      ID("vo-giveaway-opening-date"),
      state === "upcoming"
    );

    // Section 3: Entry area
    show(
      ID("vo-giveaway-coming-soon"),
      state === "upcoming"
    );

    show(
      ID("vo-giveaway-closed"),
      state === "closed"
    );

    show(
      ID("vo-giveaway-winner"),
      state === "winner"
    );

    show(
      ID("vo-giveaway-form-panel"),
      state === "open"
    );

    // Winner announcement details
    const cfg = ID("vo-giveaway-winner-config");

    if (cfg && state === "winner") {
      const name = ID("vo-winner-name");

      if (name) {
        name.textContent =
          (cfg.dataset.winnerName || "").trim() ||
          "Preview Winner";
      }

      const loc = ID("vo-winner-location");

      if (loc) {
        loc.textContent =
          (cfg.dataset.winnerLocation || "").trim();

        loc.hidden = !loc.textContent;
      }

      const date = ID("vo-winner-date");

      if (date) {
        const d =
          (cfg.dataset.announcementDate || "").trim();

        date.textContent = d
          ? "Winner announced " + d
          : "";

        date.hidden = !d;
      }
    }

    // Preview mode affects appearance only.
    // It never changes the official entry window.
    const submit = ID("sib-form")?.querySelector(
      'button[type="submit"]'
    );

    if (submit) {
      const permitted =
        Date.now() >= START &&
        Date.now() < END;

      if (submit.disabled !== !permitted) {
        submit.disabled = !permitted;
      }

      if (!permitted) {
        submit.title = "Entries are not currently open";
      } else {
        submit.removeAttribute("title");
      }
    }

    // Keep the hero CTA pointing to Section 3.
    document.querySelectorAll(
      'a[href="#sib-form-container"]'
    ).forEach((a) => {
      a.setAttribute(
        "href",
        "#vo-giveaway-entry-area"
      );
    });
  }

  function initialize() {
    render();

    // Automatically update as campaign dates change.
    setInterval(render, 15000);

    console.info(
      "[Venture Outdoors] Giveaway Landing v1.0.0 initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();
