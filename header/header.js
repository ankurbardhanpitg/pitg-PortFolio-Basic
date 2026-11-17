/**
 * ProcessIT Global — header/header.js
 * Mega-menu, mobile nav, Insights deep-link.
 * Expects globals from script.js: $, E, GR, BYK, TZ, st, DOT
 * Exposes window.PITGHeader.menu / closeNav for the router.
 */
(function (w) {
  function mlink(p) {
    return '<a href="#' + p.k + '" style="' + st(p) + '"><i>' + DOT + '</i><span><b>' + E(p.t) + "</b><small>" + E(TZ[p.k] || "") + "</small></span></a>";
  }

  function init() {
    var megaEl = $("mega");
    if (!megaEl) return;
    megaEl.innerHTML = GR.map(function (g) {
      return '<div class="mg"><h5>' + g[0] + "</h5>" + g[1].map(function (k) { return mlink(BYK[k]); }).join("") + "</div>";
    }).join("");

    var ddb = $("ddb"), mega = $("mega"), nav = $("gnav");

    function menu(o) {
      mega.classList.toggle("open", o);
      ddb.setAttribute("aria-expanded", o);
    }

    ddb.onclick = function (e) {
      e.stopPropagation();
      menu(!mega.classList.contains("open"));
    };
    document.addEventListener("click", function (e) {
      if (!mega.contains(e.target) && !ddb.contains(e.target)) menu(false);
    });
    $("bgr").onclick = function () {
      nav.classList.toggle("open");
    };

    function goInsights(e) {
      e.preventDefault();
      nav.classList.remove("open");
      menu(false);
      var f = function () {
        var el = $("insights");
        el && el.scrollIntoView({ behavior: "smooth" });
      };
      if (location.hash.slice(1)) {
        location.hash = "";
        setTimeout(f, 120);
      } else f();
    }
    $("lnk-ins").onclick = goInsights;

    w.PITGHeader = {
      init: init,
      menu: menu,
      closeNav: function () { nav.classList.remove("open"); }
    };
  }

  w.PITGHeader = w.PITGHeader || {};
  w.PITGHeader.init = init;
})(window);
