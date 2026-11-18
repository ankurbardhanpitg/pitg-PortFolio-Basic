/**
 * ProcessIT Global — Hard-coded / portfolio-map.js
 * ------------------------------------------------
 * LEARNING / REFERENCE extract for designers and beginners.
 *
 * What this file does NOT do:
 *   It does NOT build the map, create SVG nodes, or store page titles.
 *   All of that is already written in portfolio-map.html.
 *
 * What this file DOES:
 *   1) Find every label link inside #hv (the map mount).
 *   2) On click, add a short "press" class so CSS can pulse the pill.
 *   3) Leave the normal <a href="#pageKey"> hash navigation alone.
 *
 * How it connects to the other files:
 *   HTML  → <a href="#what" data-page="what">…</a>  (one per page)
 *   CSS   → .hv a.is-active .lb { transform: scale(1.06); }
 *   JS    → adds / removes "is-active" for ~280ms on click
 *
 * Tip for beginners:
 *   The moving coloured dots are NOT animated here.
 *   They use SVG <animateMotion> written directly in the HTML.
 */

/* Wrap everything in an IIFE (Immediately Invoked Function Expression)
   so our variables stay private and do not leak into the global scope. */
(function () {
  // 1) Find the map container. If it is missing, stop safely.
  var hv = document.getElementById("hv");
  if (!hv) return;

  // 2) Collect every hard-coded label link.
  //    "a[data-page]" means: an <a> tag that has a data-page attribute.
  //    Example in HTML: <a href="#what" data-page="what">…</a>
  var links = hv.querySelectorAll("a[data-page]");

  // 3) Attach one click listener to each link.
  links.forEach(function (link) {
    link.addEventListener("click", function (/* event */) {
      // Read which page key was clicked (e.g. "what", "problem").
      // Useful if you later want to show a panel, log analytics, etc.
      var page = link.getAttribute("data-page");

      // Visual press feedback:
      //   - add .is-active  → CSS scales the pill up
      //   - after 280ms remove it → pill returns to normal size
      // The browser still follows href="#pageKey" on its own.
      link.classList.add("is-active");
      window.setTimeout(function () {
        link.classList.remove("is-active");
      }, 280);

      // Beginner note: we do not call preventDefault().
      // That means the hash in the address bar WILL update (#what, etc.).
      // On the live site a hash router can then open that portfolio page.
      // page is available here if you need it for extra behaviour later.
      void page;
    });
  });
})();
