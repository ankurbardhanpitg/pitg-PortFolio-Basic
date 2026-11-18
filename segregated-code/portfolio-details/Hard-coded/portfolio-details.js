/**
 * ProcessIT Global — Hard-coded / portfolio-details.js
 * ----------------------------------------------------
 * LEARNING / REFERENCE extract for designers and beginners.
 *
 * What this file does NOT do:
 *   It does NOT build page HTML, charts, maps, or sidebar links.
 *   All of that is already written in portfolio-details.html.
 *
 * What this file DOES:
 *   1) Read the URL hash (#arsenal, #track, …) and show that hard-coded page
 *   2) Fade content blocks in when they scroll into view (.b → .in)
 *   3) Handle "On this page" TOC button clicks (smooth scroll)
 *   4) Highlight the TOC button for the heading nearest the top (scroll spy)
 *   5) Keep the left sidebar open on wide screens
 *
 * How it connects to the other files:
 *   HTML  → <section class="page" data-key="arsenal" hidden>…</section>
 *   HTML  → <button type="button" data-t="arsenal-sec-0">…</button>
 *   CSS   → .b starts invisible; .b.in fades / slides into view
 *   JS    → removes hidden from the matching page; adds .in on scroll
 *
 * Tip for beginners:
 *   To change page text, charts, or maps, edit portfolio-details.html.
 *   To change colours or layout, edit portfolio-details.css.
 *   Default page when there is no hash: arsenal (Solutions arsenal).
 */

(function () {
  /* ---- A. Find the mount and every hard-coded page ---- */
  var vp = document.getElementById("vp");
  if (!vp) return;

  var pages = [].slice.call(vp.querySelectorAll("section.page[data-key]"));
  if (!pages.length) return;

  // Quick lookup: key → <section class="page">
  var BYK = {};
  pages.forEach(function (el) {
    BYK[el.getAttribute("data-key")] = el;
  });

  // Human titles for document.title (matches the hard-coded <h1> text)
  var TITLES = {
    what: "What PITG does",
    problem: "The problem",
    business: "Lines of business",
    functions: "Functionalities",
    features: "Key features",
    arsenal: "Solutions arsenal",
    track: "Track record",
    data: "Data security",
    bfsi: "BFSI compliance",
    ecosystem: "Ecosystem"
  };

  var active = null; // the page section currently visible

  /* ============================================================
   * B. SCROLL REVEAL
   *    When a .b block enters the viewport, add class .in so CSS
   *    can fade / slide it into view. Runs once per block.
   * ============================================================ */
  var io = null;

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target); // animate once only
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
  }

  /** Watch every .b block inside a page section. */
  function reveal(root) {
    [].slice.call(root.querySelectorAll(".b")).forEach(function (block) {
      if (block.classList.contains("in")) return; // already shown
      if (io) io.observe(block);
      else block.classList.add("in"); // no observer → show immediately
    });
  }

  /* ============================================================
   * C. TOC CLICKS + SCROLL SPY
   *    TOC buttons are hard-coded with data-t="pageKey-sec-N".
   *    Click → smooth-scroll to that heading.
   *    Scroll → add .cur to the TOC button for the nearest heading.
   * ============================================================ */

  /** Wire TOC buttons inside one page (event delegation-friendly). */
  function wireToc(pageEl) {
    var toc = pageEl.querySelector(".toc");
    if (!toc || toc.hasAttribute("hidden")) return;

    [].slice.call(toc.querySelectorAll("button[data-t]")).forEach(function (btn) {
      // Avoid stacking listeners if the user revisits the page
      if (btn.getAttribute("data-wired") === "1") return;
      btn.setAttribute("data-wired", "1");

      btn.addEventListener("click", function () {
        var el = document.getElementById(btn.getAttribute("data-t"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /**
   * Highlight the TOC button for the heading currently near the top
   * of the viewport (only looks inside the active page).
   */
  function tocSpy() {
    if (!active) return;
    var toc = active.querySelector(".toc");
    if (!toc || toc.hasAttribute("hidden")) return;

    var headings = [].slice.call(active.querySelectorAll(".b h3[id]"));
    var current = -1;

    headings.forEach(function (h, i) {
      if (h.getBoundingClientRect().top < innerHeight * 0.35) current = i;
    });

    [].slice.call(toc.querySelectorAll("button[data-t]")).forEach(function (btn, i) {
      btn.classList.toggle("cur", i === current);
    });
  }

  /* ============================================================
   * D. SHOW ONE PAGE (hash routing)
   *    Hide every section.page, then reveal the one that matches
   *    the hash. Copy that page's accent vars onto #vp for any
   *    styles that read --a / --t from the mount.
   * ============================================================ */
  function showPage(key) {
    var page = BYK[key] || BYK.arsenal;
    if (!page) return;

    pages.forEach(function (el) {
      el.hidden = el !== page;
    });

    active = page;

    // Mirror the page accent onto #vp (same idea as the dynamic extract)
    vp.style.cssText = page.getAttribute("style") || "";

    document.title =
      (TITLES[page.getAttribute("data-key")] || "Portfolio") +
      " | ProcessIT Global (extract)";

    // Desktop: keep the sidebar open; mobile uses the <summary> toggle
    var side = page.querySelector("details.side");
    if (side && innerWidth > 980) side.open = true;

    wireToc(page);
    reveal(page);
    window.scrollTo(0, 0);
  }

  /**
   * Read the URL hash and show that page.
   * Examples:
   *   portfolio-details.html#arsenal  → Solutions arsenal
   *   portfolio-details.html#track    → Track record
   *   portfolio-details.html          → defaults to arsenal
   */
  function route() {
    var key = location.hash.slice(1); // strip the leading "#"
    showPage(key);
  }

  /* ---- E. Listen for hash changes + scroll ---- */
  // Sidebar / prev-next links use href="#key" → browser fires hashchange
  window.addEventListener("hashchange", route);
  window.addEventListener("scroll", tocSpy, { passive: true });

  // First paint
  route();
})();
