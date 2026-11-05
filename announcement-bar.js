
(function () {
  "use strict";

  const config = {
    message: "🦃 Win a Manatee Kayak Adventure for Two!",
    buttonText: "Enter Free",
    url: "https://ventureoutdoorsflorida.com/turkey-day-giveaway",

    start: "2026-11-10T10:00:00-05:00",
    end: "2026-11-28T00:00:00-05:00",

    backgroundColor: "#17658A",
    textColor: "#ffffff",

    excludedPaths: [
      "/turkey-day-giveaway",
      "/turkey-day-giveaway-rules",
      "/turkey-day-giveaway-thank-you"
    ],

    storageKey: "vo-turkey-day-2026-dismissed"
  };

  const params = new URLSearchParams(window.location.search);
  const preview = params.get("vo_bar_preview") === "1";

  const now = Date.now();

  if (!preview && (
    now < Date.parse(config.start) ||
    now >= Date.parse(config.end)
  )) return;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (config.excludedPaths.includes(path)) return;

  if (!preview) {
    try {
      if (sessionStorage.getItem(config.storageKey) === "1") return;
    } catch (e) {}
  }

  if (document.getElementById("vo-announcement-bar")) return;

  const header = document.querySelector("header.fixed");

  if (!document.body || !header) {
    console.warn("[VO] Announcement bar: body or header unavailable.");
    return;
  }

  const style = document.createElement("style");
  style.id = "vo-announcement-styles";

  style.textContent = `
    #vo-announcement-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      min-height: 42px;
      box-sizing: border-box;
      background: ${config.backgroundColor};
      color: ${config.textColor};
      z-index: 50;
      font-family: inherit;
    }

    #vo-announcement-bar * {
      box-sizing: border-box;
    }

    #vo-announcement-bar .vo-bar-content {
      min-height: 42px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 8px 44px 8px 16px;
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
      line-height: 1.4;
    }

    #vo-announcement-bar .vo-bar-button {
      display: inline-block;
      background: #ffffff;
      color: #174d43;
      padding: 6px 14px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    #vo-announcement-bar .vo-bar-button:hover {
      background: #e7f1ed;
    }

    #vo-announcement-bar .vo-bar-close {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      background: transparent;
      color: #ffffff;
      border: 0;
      padding: 6px;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
    }

    #vo-announcement-bar .vo-bar-button:focus-visible,
    #vo-announcement-bar .vo-bar-close:focus-visible {
      outline: 2px solid white;
      outline-offset: 3px;
    }

    @keyframes vo-header-offset {
      from {
        transform: translateY(var(--vo-bar-height));
      }

      to {
        transform: translateY(0px);
      }
    }

    @supports (animation-timeline: scroll(root block)) {
      header.fixed.vo-announcement-header {
        top: 0 !important;
        animation-name: vo-header-offset;
        animation-duration: 1s;
        animation-timing-function: linear;
        animation-fill-mode: both;
        animation-timeline: scroll(root block);
        animation-range: 0px var(--vo-bar-height);
      }
    }

    @media (max-width: 600px) {
      #vo-announcement-bar .vo-bar-content {
        padding: 8px 40px 8px 12px;
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

  const bar = document.createElement("div");
  bar.id = "vo-announcement-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Giveaway announcement");

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

  content.append(message, button);
  bar.append(content, close);

  document.body.appendChild(bar);

  // Match the header offset to the actual announcement height.
  function updateHeight() {
    const height = bar.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      "--vo-bar-height",
      height + "px"
    );
  }

  updateHeight();

  const resizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(updateHeight)
    : null;

  if (resizeObserver) resizeObserver.observe(bar);

  const supportsScrollTimeline =
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline: scroll(root block)");

  // Fallback for browsers without CSS scroll-driven animations.
  let scrollScheduled = false;

  function updateFallbackHeader() {
    if (!bar.isConnected) return;

    const remaining = Math.max(
      0,
      bar.getBoundingClientRect().bottom
    );

    header.style.top = remaining + "px";
  }

  function onScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(function () {
      updateFallbackHeader();
      scrollScheduled = false;
    });
  }

  if (supportsScrollTimeline) {
    header.classList.add("vo-announcement-header");
  } else {
    updateFallbackHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFallbackHeader);
  }

  close.addEventListener("click", function () {
    bar.remove();

    if (resizeObserver) resizeObserver.disconnect();

    header.classList.remove("vo-announcement-header");

    if (!supportsScrollTimeline) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFallbackHeader);
    }

    header.style.top = "";
    header.style.transform = "";

    document.documentElement.style.removeProperty("--vo-bar-height");
    style.remove();

    if (!preview) {
      try {
        sessionStorage.setItem(config.storageKey, "1");
      } catch (e) {}
    }
  });

  console.log("[VO] Turkey Day Giveaway announcement bar initialized.");
})();
