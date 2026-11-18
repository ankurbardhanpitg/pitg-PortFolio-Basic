/**
 * ProcessIT Global — Hard-coded / portfolio-slides.js
 * ---------------------------------------------------
 * LEARNING / REFERENCE extract for designers and beginners.
 *
 * What this file does NOT do:
 *   It does NOT build slide cards, charts, chips, or dots.
 *   All of that is already written in portfolio-slides.html.
 *
 * What this file DOES:
 *   1) Rotate the hard-coded cards by toggling .p0 / .p1 / .p2 / .p3
 *   2) Highlight the matching dot and update the "01 / 10 · Title" counter
 *   3) Listen for clicks, swipes, keyboard arrows, and autoplay
 *
 * How it connects to the other files:
 *   HTML  → <article class="sl" data-i="0" data-key="features">…</article>
 *   HTML  → <button class="dt" data-i="0">…</button>
 *   CSS   → .sl.p0 / .p1 / .p2 / .p3 place cards in 3D space
 *   JS    → adds / removes those position classes on user input
 *
 * Tip for beginners:
 *   To change slide text or charts, edit portfolio-slides.html — not this file.
 *   To change the 3D angle or colours, edit portfolio-slides.css.
 */

(function () {
  /* ---- A. Grab the HTML elements we will control ---- */
  var stgEl = document.getElementById("stg"); // stage with hard-coded cards
  var dtsEl = document.getElementById("dts"); // row of hard-coded dots
  var cnt = document.getElementById("cnt");   // "01 / 10 · Title" text
  var pv = document.getElementById("pv");     // previous arrow
  var nv = document.getElementById("nv");     // next arrow
  var csec = document.getElementById("slides");

  // Safety: if the HTML extract is incomplete, do nothing instead of crashing
  if (!stgEl || !dtsEl || !cnt || !pv || !nv || !csec) return;

  /* Slide titles in the same order as the hard-coded HTML cards.
     Used only to refresh the counter text — content itself lives in HTML. */
  var TITLES = [
    "Key features",
    "Functionalities",
    "Lines of business",
    "What PITG does",
    "The problem",
    "Solutions arsenal",
    "Track record",
    "Data security",
    "BFSI compliance",
    "Ecosystem"
  ];

  // Live arrays of the hard-coded DOM nodes (already in the page)
  var sls = [].slice.call(stgEl.querySelectorAll(".sl"));
  var dts = [].slice.call(dtsEl.querySelectorAll(".dt"));
  var L = sls.length;
  if (!L || L !== dts.length) return;

  /* ---- B. Carousel state ----
   * cur     = index of the card currently in the centre
   * tm      = autoplay timer id (so we can clear / restart it)
   * swiped  = true briefly after a swipe so the click is ignored
   * FLIP    = ms between auto-advances (90000 = 90 seconds)
   */
  var cur = 0;
  var tm = 0;
  var swiped = false;
  var FLIP = 90000;

  /** Turn 9 into "09" for the counter display. */
  function pad(n) {
    return ("0" + n).slice(-2);
  }

  /** Escape special characters so titles cannot break the counter HTML. */
  function E(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /**
   * rot(n) — move slide number n to the centre.
   *
   * How the 3D layout works (classes already exist in HTML/CSS):
   *   d === 0      → class p0  (centre, full size)
   *   d === 1      → class p1  (next, angled right)
   *   d === L - 1  → class p2  (previous, angled left)
   *   anything else → class p3 (hidden)
   *
   * Also updates: which Open button is tabbable, which dot is "on",
   * and the counter text ("09 / 10 · BFSI compliance").
   */
  function rot(n) {
    cur = ((n % L) + L) % L;

    sls.forEach(function (s, i) {
      var d = ((i - cur) % L + L) % L;
      s.className = "sl " + (d === 0 ? "p0" : d === 1 ? "p1" : d === L - 1 ? "p2" : "p3");
      var go = s.querySelector(".go");
      if (go) go.tabIndex = d === 0 ? 0 : -1;
      s.setAttribute("aria-hidden", d === 0 ? "false" : "true");
    });

    dts.forEach(function (t, i) {
      t.classList.toggle("on", i === cur);
      t.setAttribute("aria-selected", i === cur ? "true" : "false");
    });

    cnt.innerHTML =
      "<b>" + pad(cur + 1) + "</b> / " + pad(L) +
      " &nbsp;&middot;&nbsp; " + E(TITLES[cur] || "");
  }

  /**
   * auto() — (re)start the autoplay timer.
   * Respects prefers-reduced-motion and skips ticks while the tab is hidden.
   */
  function auto() {
    clearInterval(tm);
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tm = setInterval(function () {
      if (!document.hidden) rot(cur + 1);
    }, FLIP);
  }

  /* ---- C1. Click a side card (p1 or p2) to bring it to the centre ---- */
  sls.forEach(function (s, i) {
    s.addEventListener("click", function (e) {
      if (swiped) {
        e.preventDefault();
        return;
      }
      var d = ((i - cur) % L + L) % L;
      if (d !== 0 && (d === 1 || d === L - 1)) {
        e.preventDefault();
        rot(i);
        auto();
      }
    });
  });

  /* ---- C2. Dot buttons + prev/next arrows ---- */
  dts.forEach(function (t, i) {
    t.addEventListener("click", function () {
      rot(i);
      auto();
    });
  });
  pv.addEventListener("click", function () {
    rot(cur - 1);
    auto();
  });
  nv.addEventListener("click", function () {
    rot(cur + 1);
    auto();
  });

  /* ---- C3. Swipe / drag on the stage ---- */
  var sx = null;
  stgEl.addEventListener("pointerdown", function (e) {
    sx = e.clientX;
    swiped = false;
  });
  stgEl.addEventListener("pointerup", function (e) {
    if (sx == null) return;
    var dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 55) {
      swiped = true;
      rot(cur + (dx < 0 ? 1 : -1));
      auto();
      setTimeout(function () {
        swiped = false;
      }, 60);
    }
  });

  /* ---- C4. Keyboard when #stg is focused ---- */
  stgEl.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      rot(cur + 1);
      auto();
    } else if (e.key === "ArrowLeft") {
      rot(cur - 1);
      auto();
    }
  });

  /* ---- D. Pause autoplay while the user is exploring ---- */
  csec.addEventListener("mouseenter", function () {
    clearInterval(tm);
  });
  csec.addEventListener("mouseleave", auto);
  csec.addEventListener("focusin", function () {
    clearInterval(tm);
  });

  /* ---- E. First paint: confirm slide 0, then start autoplay ---- */
  rot(0);
  auto();
})();
