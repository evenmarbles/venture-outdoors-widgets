(function () {
  "use strict";

  // VENTURE OUTDOORS - ANNOUNCEMENT BAR
  // Update the configuration for future promotions.

  const config = {
    message: "🦃 Win a Manatee Kayak Adventure for Two!",
    buttonText: "Enter Free",
    url: "https://ventureoutdoorsflorida.com/turkey-day-giveaway",

    start: "2026-11-10T10:00:00-05:00",
    end: "2026-11-28T00:00:00-05:00",

    backgroundColor: "#174d43",
    textColor: "#ffffff",

    excludedPaths: [
      "/turkey-day-giveaway",
      "/turkey-day-giveaway-rules",
      "/turkey-day-giveaway-thank-you"
    ],

    storageKey: "vo-turkey-day-2026-dismissed"
  };

  function init() {
    if (document.getElementById("vo-announcement-bar")) {
      return;
    }

    // Check preview mode and promotion dates.
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("vo_bar_preview") === "1";
    const now = Date.now();

    if (!preview &&
        (now < Date.parse(config.start) ||
         now >= Date.parse(config.end))) {
      return;
    }

    // Exclude giveaway-related pages.
    const path = window.location.pathname.replace(/\/+$/, "") || "/";

    if (config.excludedPaths.includes(path)) {
      return;
    }

    // Respect dismissal during the browser session.
    if (!preview) {
      try {
        if (sessionStorage.getItem(config.storageKey) === "1") {
          return;
        }
      } catch (e) {
        // Continue if session storage is unavailable.
      }
    }

    // Inject CSS.
    if (!document.getElementById("vo-announcement-styles")) {
      const style = document.createElement("style");
      style.id = "vo-announcement-styles";

      style.textContent = `
        #vo-announcement-bar {
          position: relative;
          width: 100%;
          box-sizing: border-box;
          background: ${config.backgroundColor};
          color: ${config.textColor};
          font-family: inherit;
          z-index: 10;
        }

        #vo-announcement-bar * {
          box-sizing: border-box;
        }

        #vo-announcement-bar .vo-bar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 44px 10px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          text-align: center;
        }

        #vo-announcement-bar .vo-bar-message {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }

        #vo-announcement-bar .vo-bar-button {
          display: inline-block;
          padding: 6px 14px;
          background: #ffffff;
          color: #174d43;
          border-radius: 4px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        #vo-announcement-bar .vo-bar-button:hover {
          background: #e7f1ed;
        }

        #vo-announcement-bar .vo-bar-button:focus-visible,
        #vo-announcement-bar .vo-bar-close:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }

        #vo-announcement-bar .vo-bar-close {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: #ffffff;
          border: 0;
          padding: 6px;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          #vo-announcement-bar .vo-bar-content {
            padding: 10px 40px 10px 12px;
            gap: 8px;
          }

          #vo-announcement-bar .vo-bar-message {
            font-size: 12px;
          }

          #vo-announcement-bar .vo-bar-button {
            font-size: 12px;
            padding: 5px 10px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    // Create the announcement bar.
    const bar = document.createElement("div");
    bar.id = "vo-announcement-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Website announcement");

    const content = document.createElement("div");
    content.className = "vo-bar-content";

    const message = document.createElement("span");
    message.className = "vo-bar-message";
    message.textContent = config.message;

    const button = document.createElement("a");
    button.className = "vo-bar-button";
    button.href = config.url;
    button.textContent = config.buttonText;

    const close = document.createElement("button");
    close.className = "vo-bar-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Dismiss announcement");

    close.addEventListener("click", function () {
      bar.remove();

      if (!preview) {
        try {
          sessionStorage.setItem(config.storageKey, "1");
        } catch (e) {
          // Ignore storage errors.
        }
      }
    });

    content.append(message, button);
    bar.append(content, close);

    
    // Insert the announcement bar at the top of the page.
    document.body.prepend(bar);

    // Gondola uses a fixed navigation header.
    // Offset it only while the announcement bar is visible.
    const header = document.querySelector("header.fixed");

    function updateHeaderPosition() {
      if (!header || !header.isConnected) return;

      const rect = bar.getBoundingClientRect();

      // As the bar scrolls away, gradually reduce the offset.
      const remainingHeight = bar.isConnected
        ? Math.max(0, rect.bottom)
        : 0;

      header.style.top = remainingHeight + "px";
    }

    // Keep the announcement bar above Gondola's header.
    bar.style.zIndex = "50";

    // Update the fixed header as the visitor scrolls.
    let scrollScheduled = false;

    function onScroll() {
      if (scrollScheduled) return;

      scrollScheduled = true;

      requestAnimationFrame(function () {
        updateHeaderPosition();
        scrollScheduled = false;
      });
    }

    window.addEventListener("scroll", onScroll, {
      passive: true
    });

    // Handle responsive layout changes.
    window.addEventListener("resize", updateHeaderPosition);

    // Restore the header when the announcement is dismissed.
    close.addEventListener("click", function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeaderPosition);

      if (header) {
        header.style.top = "0px";
      }
    });

    // Set the correct initial position.
    updateHeaderPosition();
  }

  // Initialize once the document is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
