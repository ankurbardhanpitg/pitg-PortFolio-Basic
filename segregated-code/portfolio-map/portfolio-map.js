/**
 * ProcessIT Global — portfolio-map.js
 * -----------------------------------
 * COPIED EXTRACT for designers / reference only.
 * Source: script.js → initPortfolioMap() plus the small helpers / data it needs.
 * Live site still runs script.js; this file is not loaded from home.html.
 *
 * Renders the circular SVG into #hv:
 * - center: logo inside a white circle
 * - ring: dashed ellipse around the logo
 * - 10 nodes: dashed curved edges + animated dots + pill labels (page titles)
 * Label order matches PG[] page titles (clockwise from top).
 */

/* ---- Helpers (copied / simplified from script.js) ---- */
function E(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

var $ = function (id) {
  return document.getElementById(id);
};

/* Accent pairs per node: [soft fill unused here, stroke/dot colour] — from NT in script.js */
var NT = [
  ["#EAF1FF", "#2F6BFF"],
  ["#FFF0E8", "#E8501F"],
  ["#E8F8F1", "#169B6A"],
  ["#F1ECFF", "#6A47F0"],
  ["#FFF6DD", "#C98000"],
  ["#FFEBF0", "#D93A62"],
  ["#E3F7FA", "#0E94A6"],
  ["#EFF3E2", "#5F7F10"],
  ["#ECEDFF", "#4048D6"],
  ["#FDEDDD", "#C4650E"]
];

/* Page list used by the map (k + t only). Full content stays in script.js PG[]. */
var PG = [
  { k: "what", t: "What PITG does" },
  { k: "problem", t: "The problem" },
  { k: "business", t: "Lines of business" },
  { k: "functions", t: "Functionalities" },
  { k: "features", t: "Key features" },
  { k: "arsenal", t: "Solutions arsenal" },
  { k: "track", t: "Track record" },
  { k: "data", t: "Data security" },
  { k: "bfsi", t: "BFSI compliance" },
  { k: "ecosystem", t: "Ecosystem" }
];

/* Optional logo override (empty = use <img class="gh-logo-src"> or ../assets/logo.png) */
var LG = "";

/**
 * Builds the circular portfolio-map SVG and injects it into #hv.
 * Copied from script.js → initPortfolioMap().
 *
 * Draw order (SVG paint order = later layers sit on top):
 *   1. Dashed inner ring around the logo
 *   2. Curved spokes + animated coloured dots (one per page)
 *   3. Drop-shadow filter definition for label pills
 *   4. Label pills (rounded rect + title text), linked to #pageKey
 *   5. Center white disc + logo image (drawn last so it covers spoke starts)
 */
function initPortfolioMap() {
  // Mount point in the HTML: <div class="gh-wc hv" id="hv"></div>
  var hv = $("hv");
  if (!hv) return;

  // Resolve logo URL: optional LG override → site header logo → extract fallback
  var logo =
    document.querySelector(".gh-logo img") ||
    document.querySelector(".gh-logo-src");
  var logoSrc = LG || (logo ? logo.src : "../assets/logo.png");

  // --- Layout geometry (SVG user units; viewBox is 520 × 460) ---
  // cx, cy : center of the map (logo sits here)
  // rx, ry : outer ellipse radii where label pills are placed
  //          (rx ≠ ry → wider-than-tall ellipse, fits the window better)
  var cx = 260;
  var cy = 230;
  var rx = 205;
  var ry = 172;

  // Inner dashed ring radii (fixed; also used as the spoke start points)
  var innerRx = 112;
  var innerRy = 96;

  // Start the SVG string: root + dashed ring around the logo
  var s =
    '<svg viewBox="0 0 520 460" role="img" aria-label="ProcessIT Global portfolio pages">' +
    '<ellipse class="ring" cx="' + cx + '" cy="' + cy + '" rx="' + innerRx + '" ry="' + innerRy + '"/>';

  // --- Pass 1: spokes (dashed curves) + animated dots ---
  // 10 pages → 36° apart. Angle -90° starts at 12 o'clock, then clockwise.
  PG.forEach(function (p, i) {
    // t = angle in radians for this node
    var t = (-90 + i * 36) * Math.PI / 180;

    // Outer point (x, y): where the label pill will sit
    var x = cx + rx * Math.cos(t);
    var y = cy + ry * Math.sin(t);

    // Inner point (sx, sy): where the spoke leaves the dashed ring
    var sx = cx + innerRx * Math.cos(t);
    var sy = cy + innerRy * Math.sin(t);

    // Accent colour for this node (stroke + dot)
    var n = NT[i % NT.length];

    // Slight left/right bend so spokes are curved, not straight lines.
    // k alternates sign so neighbouring curves lean opposite ways.
    var k = (i % 2 ? 1 : -1) * 0.1;
    // Quadratic Bezier control point (mx, my), offset perpendicular to the spoke
    var mx = (sx + x) / 2 - (y - sy) * k;
    var my = (sy + y) / 2 + (x - sx) * k;

    // SVG path: Move to inner point → Quadratic curve to outer point
    var d = "M" + sx + "," + sy + " Q" + mx + "," + my + " " + x + "," + y;

    // Dashed edge (.ed styled in CSS) + a coloured dot that travels along the path
    s +=
      '<path class="ed" d="' + d + '"/>' +
      '<circle r="3.4" fill="' + n[1] + '">' +
      // Stagger start times / durations so dots do not all move in sync
      '<animateMotion dur="' + (4 + (i % 4) * 0.9) + 's" begin="' + (i * 0.45) + 's" repeatCount="indefinite" path="' + d + '"/>' +
      "</circle>";
  });

  // Soft drop-shadow filter reused by every label pill (id="lbsh")
  s +=
    '<defs><filter id="lbsh" x="-20%" y="-40%" width="140%" height="180%">' +
    '<feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#1F2328" flood-opacity=".08"/>' +
    "</filter></defs>";

  // --- Pass 2: label pills (must come after spokes so they paint on top) ---
  // Same angles as Pass 1 so each pill lines up with its spoke end.
  PG.forEach(function (p, i) {
    var t = (-90 + i * 36) * Math.PI / 180;
    var x = cx + rx * Math.cos(t);
    var y = cy + ry * Math.sin(t);
    var n = NT[i % NT.length];

    // Pill size: width grows with title length; height is fixed
    var tw = Math.max(p.t.length * 7.35 + 22, 72); // min width 72
    var th = 26;
    // Top-left of the rounded rect (centered on x, y)
    var lx = x - tw / 2;
    var ly = y - th / 2;

    // <a> wraps the pill so clicks navigate to #pageKey (hash router on live site)
    s +=
      '<a href="#' + p.k + '" aria-label="' + E(p.t) + '">' +
      '<g class="lb">' +
      '<rect x="' + lx + '" y="' + ly + '" width="' + tw + '" height="' + th + '" rx="13" ry="13" fill="#fff" stroke="' + n[1] + '" stroke-width="1.2" filter="url(#lbsh)"/>' +
      // text y offset (+4.5) optically centers the baseline inside the pill
      '<text x="' + x + '" y="' + (y + 4.5) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="12.5" font-weight="500" fill="#59636E">' +
      E(p.t) +
      "</text>" +
      "</g></a>";
  });

  // --- Center logo (drawn last so it covers the inner ends of the spokes) ---
  s +=
    '<circle cx="' + cx + '" cy="' + cy + '" r="62" fill="#fff" stroke="#DCE5F4"/>' +
    '<image href="' + logoSrc + '" x="' + (cx - 44) + '" y="' + (cy - 33) + '" width="88" height="66"/>' +
    "</svg>";

  // Replace #hv contents with the finished SVG
  hv.innerHTML = s;
}

/* Standalone boot (on the live site this is called from script.js startup) */
initPortfolioMap();
