/**
 * ProcessIT Global — footer/footer.js
 * Builds footer link columns from GR (mirrors mega-menu groups).
 * Expects globals from script.js: $, E, GR, BYK
 */
(function (w) {
  function init() {
    var fcols = $("fcols");
    if (!fcols) return;
    fcols.innerHTML = GR.map(function (g) {
      return '<div class="fcol"><h5>' + g[0] + "</h5>" + g[1].map(function (k) {
        return '<a href="#' + k + '">' + E(BYK[k].t) + "</a>";
      }).join("") + (g[0] === "Company" ? '<a href="https://www.processitglobal.com" target="_blank" rel="noopener">www.processitglobal.com</a>' : "") + "</div>";
    }).join("");
  }

  w.PITGFooter = w.PITGFooter || {};
  w.PITGFooter.init = init;
})(window);
