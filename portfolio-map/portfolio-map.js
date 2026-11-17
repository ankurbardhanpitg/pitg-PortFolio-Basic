/**
 * ProcessIT Global — portfolio-map/portfolio-map.js
 * Builds the hero SVG portfolio graph into #hv.
 * Expects globals from script.js: $, E, PG, NT, pad
 * Logo: uses window.LG if set, else reads .gh-logo img
 * Exposes window.PITGPortfolioMap.init
 */
(function (w) {
  function init() {
    var hv = $("hv");
    if (!hv) return;
    var logo = document.querySelector(".gh-logo img");
    var LG = w.LG || (logo ? logo.src : "");
    var cx = 260, cy = 230, rx = 205, ry = 172;
    var s = '<svg viewBox="0 0 520 460" role="img" aria-label="ProcessIT Global portfolio pages"><ellipse class="ring" cx="' + cx + '" cy="' + cy + '" rx="112" ry="96"/>';
    PG.forEach(function (p, i) {
      var t = (-90 + i * 36) * Math.PI / 180, x = cx + rx * Math.cos(t), y = cy + ry * Math.sin(t), sx = cx + 112 * Math.cos(t), sy = cy + 96 * Math.sin(t), n = NT[i % NT.length], k = (i % 2 ? 1 : -1) * .1, mx = (sx + x) / 2 - (y - sy) * k, my = (sy + y) / 2 + (x - sx) * k, d = "M" + sx + "," + sy + " Q" + mx + "," + my + " " + x + "," + y;
      s += '<path class="ed" d="' + d + '"/><circle r="3.4" fill="' + n[1] + '"><animateMotion dur="' + (4 + i % 4 * .9) + 's" begin="' + (i * .45) + 's" repeatCount="indefinite" path="' + d + '"/></circle>';
    });
    s += '<defs><filter id="lbsh" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#1F2328" flood-opacity=".08"/></filter></defs>';
    PG.forEach(function (p, i) {
      var t = (-90 + i * 36) * Math.PI / 180, x = cx + rx * Math.cos(t), y = cy + ry * Math.sin(t), n = NT[i % NT.length];
      var tw = Math.max(p.t.length * 7.35 + 22, 72), th = 26, lx = x - tw / 2, ly = y - th / 2;
      s += '<a href="#' + p.k + '" aria-label="' + E(p.t) + '"><g class="lb"><rect x="' + lx + '" y="' + ly + '" width="' + tw + '" height="' + th + '" rx="13" ry="13" fill="#fff" stroke="' + n[1] + '" stroke-width="1.2" filter="url(#lbsh)"/><text x="' + x + '" y="' + (y + 4.5) + '" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="12.5" font-weight="500" fill="#59636E">' + E(p.t) + "</text></g></a>";
    });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="62" fill="#fff" stroke="#DCE5F4"/><image href="' + LG + '" x="' + (cx - 44) + '" y="' + (cy - 33) + '" width="88" height="66"/></svg>';
    hv.innerHTML = s;
  }

  w.PITGPortfolioMap = w.PITGPortfolioMap || {};
  w.PITGPortfolioMap.init = init;
})(window);
