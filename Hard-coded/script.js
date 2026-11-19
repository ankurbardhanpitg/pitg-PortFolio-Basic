/**
 * ProcessIT Global — Hard-coded / script.js
 * ----------------------------------------
 * LEARNING / REFERENCE for designers and beginners.
 *
 * What this file does NOT do:
 *   It does NOT create mega-menu links, the portfolio-map SVG,
 *   KPI stats, carousel cards, insights rows, footer columns,
 *   or portfolio DETAIL page content.
 *   All of that content is already written in home.html
 *   (#vh = home, #vp > section.page = detail pages).
 *
 * What this file DOES (behaviour / events only):
 *   1) Open / close the Portfolio mega-menu and mobile nav
 *   2) Smooth-scroll "Explore categories" and Insights
 *   3) Rotate the portfolio carousel (.p0 / .p1 / .p2 / .p3)
 *   4) Slide the case-studies carousel
 *   5) Filter the insights feed by category tab
 *   6) Open the search modal and filter the hard-coded result list
 *   7) Tiny press feedback on portfolio-map label pills
 *   8) Hash routing: #what / #track / … shows that hard-coded detail page;
 *      empty hash shows the home view again
 *
 * Tip for beginners:
 *   Change text, colours, or add a slide in home.html / style.css.
 *   Only edit this file when you need different click / keyboard behaviour.
 */

(function () {
  /* ============================================================
     HELPERS
     ============================================================ */

  /** Shorthand: document.getElementById("foo") → $("foo") */
  function $(id) {
    return document.getElementById(id);
  }

  /** Escape text before putting it into HTML (keeps counter / search safe). */
  function E(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /** Turn 9 into "09" for counters like "09 / 10". */
  function pad(n) {
    return ("0" + n).slice(-2);
  }

  /* ============================================================
     1) HEADER — mega-menu + mobile burger
     HTML: #ddb button, #mega panel, #bgr burger, #gnav nav
     CSS:  .mega.open shows the panel; .gh-nav.open shows mobile nav
     ============================================================ */
  (function initHeader() {
    var ddb = $("ddb");
    var mega = $("mega");
    var nav = $("gnav");
    var bgr = $("bgr");
    if (!ddb || !mega || !nav || !bgr) return;

    /** Open or close the Portfolio mega-menu. */
    function menu(open) {
      mega.classList.toggle("open", open);
      ddb.setAttribute("aria-expanded", open ? "true" : "false");
    }

    // Click Portfolio → toggle mega-menu
    ddb.addEventListener("click", function (e) {
      e.stopPropagation();
      menu(!mega.classList.contains("open"));
    });

    // Click anywhere else → close mega-menu
    document.addEventListener("click", function (e) {
      if (!mega.contains(e.target) && !ddb.contains(e.target)) {
        menu(false);
      }
    });

    // Burger button → show / hide mobile nav
    bgr.addEventListener("click", function () {
      nav.classList.toggle("open");
    });

    // Insights nav link → go home (if on a detail page), then scroll to #insights
    var lnkIns = $("lnk-ins");
    if (lnkIns) {
      lnkIns.addEventListener("click", function (e) {
        e.preventDefault();
        nav.classList.remove("open");
        menu(false);
        var scrollToInsights = function () {
          var el = $("insights");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        };
        // If a portfolio hash is open, clear it first so #vh becomes visible
        if (location.hash.slice(1)) {
          location.hash = "";
          setTimeout(scrollToInsights, 120);
        } else {
          scrollToInsights();
        }
      });
    }

    // Esc closes the mega-menu (also used by search / routing below)
    window.__pitgCloseMenu = function () {
      menu(false);
      nav.classList.remove("open");
    };
  })();

  /* ============================================================
     2) HERO CTA — "Explore categories" scrolls to #slides
     ============================================================ */
  (function initHeroCta() {
    var go = $("go");
    var slides = $("slides");
    if (!go || !slides) return;
    go.addEventListener("click", function () {
      slides.scrollIntoView({ behavior: "smooth" });
    });
  })();

  /* ============================================================
     3) PORTFOLIO-MAP — short press feedback on label pills
     HTML already has the SVG + <animateMotion> dots.
     We only add .is-active for a brief CSS scale pulse.
     ============================================================ */
  (function initPortfolioMapPress() {
    var hv = $("hv");
    if (!hv) return;
    var links = hv.querySelectorAll("a[data-page], a[href^='#']");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        link.classList.add("is-active");
        window.setTimeout(function () {
          link.classList.remove("is-active");
        }, 280);
      });
    });
  })();

  /* ============================================================
     4) PORTFOLIO CAROUSEL (#slides / #stg)
     Cards and dots are hard-coded in home.html.
     JS only toggles position classes and updates the counter.
     ============================================================ */
  (function initPortfolioCarousel() {
    var stgEl = $("stg");
    var dtsEl = $("dts");
    var cnt = $("cnt");
    var pv = $("pv");
    var nv = $("nv");
    var csec = $("slides");
    if (!stgEl || !dtsEl || !cnt || !pv || !nv || !csec) return;

    // Titles match the order of hard-coded <article class="sl"> cards
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

    var sls = [].slice.call(stgEl.querySelectorAll(".sl"));
    var dts = [].slice.call(dtsEl.querySelectorAll(".dt"));
    var L = sls.length;
    if (!L || L !== dts.length) return;

    var cur = 0;       // index of the centre card
    var tm = 0;        // autoplay timer id
    var swiped = false; // ignore click right after a swipe
    var FLIP = 90000;  // auto-advance every 90 seconds

    /**
     * rot(n) — put slide n in the centre.
     *   d === 0     → .p0 centre
     *   d === 1     → .p1 next (right)
     *   d === L - 1 → .p2 previous (left)
     *   else        → .p3 hidden
     */
    function rot(n) {
      cur = ((n % L) + L) % L;

      sls.forEach(function (s, i) {
        var d = ((i - cur) % L + L) % L;
        s.className =
          "sl " + (d === 0 ? "p0" : d === 1 ? "p1" : d === L - 1 ? "p2" : "p3");
        var go = s.querySelector(".go");
        if (go) go.tabIndex = d === 0 ? 0 : -1;
        s.setAttribute("aria-hidden", d === 0 ? "false" : "true");
      });

      dts.forEach(function (t, i) {
        t.classList.toggle("on", i === cur);
        t.setAttribute("aria-selected", i === cur ? "true" : "false");
      });

      cnt.innerHTML =
        "<b>" +
        pad(cur + 1) +
        "</b> / " +
        pad(L) +
        " &nbsp;&middot;&nbsp; " +
        E(TITLES[cur] || "");
    }

    /** Restart autoplay (respects prefers-reduced-motion). */
    function auto() {
      clearInterval(tm);
      if (
        window.matchMedia &&
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      tm = setInterval(function () {
        // Pause while the tab is hidden OR a detail page is open (#vh hidden)
        var vh = $("vh");
        if (!document.hidden && (!vh || !vh.hidden)) rot(cur + 1);
      }, FLIP);
    }

    // Click a side card → bring it to the centre
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

    // Dots + arrows
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

    // Swipe / drag on the stage
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

    // Keyboard when the stage is focused
    stgEl.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        rot(cur + 1);
        auto();
      } else if (e.key === "ArrowLeft") {
        rot(cur - 1);
        auto();
      }
    });

    // Pause autoplay while the user explores
    csec.addEventListener("mouseenter", function () {
      clearInterval(tm);
    });
    csec.addEventListener("mouseleave", auto);
    csec.addEventListener("focusin", function () {
      clearInterval(tm);
    });

    rot(0);
    auto();
  })();

  /* ============================================================
     5) CASE-STUDIES CAROUSEL (#cc)
     Slides are hard-coded. JS only moves #cctr with translateX.
     ============================================================ */
  (function initCaseStudies() {
    var tr = $("cctr");
    var cnt = $("cccnt");
    var prev = $("ccp");
    var next = $("ccn");
    var root = $("cc");
    if (!tr || !cnt || !prev || !next || !root) return;

    var n = tr.children.length;
    var i = 0;

    function go(k) {
      i = ((k % n) + n) % n;
      tr.style.transform = "translateX(-" + i * 100 + "%)";
      cnt.innerHTML = "<b>" + pad(i + 1) + "</b> / " + pad(n);
    }

    prev.addEventListener("click", function () {
      go(i - 1);
    });
    next.addEventListener("click", function () {
      go(i + 1);
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
    });

    // Swipe on the viewport
    var sx = null;
    var vp = root.querySelector(".cc-vp");
    if (vp) {
      vp.addEventListener("pointerdown", function (e) {
        sx = e.clientX;
      });
      vp.addEventListener("pointerup", function (e) {
        if (sx == null) return;
        var d = e.clientX - sx;
        sx = null;
        if (Math.abs(d) > 55) go(i + (d < 0 ? 1 : -1));
      });
    }

    go(0);
  })();

  /* ============================================================
     6) INSIGHTS FILTER TABS
     Rows are hard-coded. Clicking a tab hides non-matching rows.
     ============================================================ */
  (function initInsightsFilter() {
    var feed = $("feed");
    if (!feed) return;
    var buttons = [].slice.call(feed.querySelectorAll(".gh-fh button"));
    var rows = [].slice.call(feed.querySelectorAll(".gh-row"));

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.toggle("on", b === btn);
        });
        var label = btn.getAttribute("data-l") || "";
        rows.forEach(function (row) {
          // Empty data-l on the "All" button → show every row
          row.hidden = !!label && row.getAttribute("data-l") !== label;
        });
      });
    });
  })();

  /* ============================================================
     7) SEARCH MODAL
     Result <a> tags are hard-coded in #sr.
     JS only opens/closes the modal, filters by typing, and
     moves the .sel highlight with arrow keys.
     ============================================================ */
  (function initSearch() {
    var srch = $("srch");
    var si = $("si");
    var sr = $("sr");
    var sb = $("sb");
    if (!srch || !si || !sr || !sb) return;

    // Snapshot of every hard-coded result link (including headings around them)
    var allLinks = [].slice.call(sr.querySelectorAll("a[data-t]"));
    var headings = [].slice.call(sr.querySelectorAll("h6"));
    var ssel = 0;
    var visible = [];

    function openS() {
      srch.classList.add("open");
      si.value = "";
      srun();
      setTimeout(function () {
        si.focus();
      }, 30);
    }

    function closeS() {
      srch.classList.remove("open");
    }
    // So hash routing can close the modal when a link is followed
    window.__pitgCloseSearch = closeS;

    /** Filter hard-coded links; hide ones that do not match the query. */
    function srun() {
      var q = si.value.trim().toLowerCase();
      visible = [];

      allLinks.forEach(function (a) {
        var hay =
          (a.getAttribute("data-t") || "") +
          " " +
          (a.getAttribute("data-s") || "") +
          " " +
          (a.getAttribute("data-tag") || "");
        var show = !q || hay.toLowerCase().indexOf(q) > -1;
        a.hidden = !show;
        a.classList.remove("sel");
        if (show) visible.push(a);
      });

      // Hide a group heading if every link under that group is hidden
      headings.forEach(function (h) {
        var group = h.textContent.trim();
        var any = visible.some(function (a) {
          return a.getAttribute("data-g") === group;
        });
        h.hidden = !any;
      });

      // Cap highlight list to first 10 visible matches (same as live site)
      if (visible.length > 10) {
        visible.slice(10).forEach(function (a) {
          a.hidden = true;
        });
        visible = visible.slice(0, 10);
        // Re-check headings after capping
        headings.forEach(function (h) {
          var group = h.textContent.trim();
          var any = visible.some(function (a) {
            return a.getAttribute("data-g") === group;
          });
          h.hidden = !any;
        });
      }

      ssel = 0;
      if (visible[0]) visible[0].classList.add("sel");

      // Show a friendly empty state if nothing matched
      var none = sr.querySelector(".none");
      if (!visible.length) {
        if (!none) {
          none = document.createElement("div");
          none.className = "none";
          none.textContent = "No matches. Try another word.";
          sr.appendChild(none);
        }
        none.hidden = false;
      } else if (none) {
        none.hidden = true;
      }
    }

    function moveSel(dir) {
      if (!visible.length) return;
      visible[ssel].classList.remove("sel");
      ssel = Math.max(0, Math.min(visible.length - 1, ssel + dir));
      visible[ssel].classList.add("sel");
    }

    sb.addEventListener("click", openS);

    // Click the dark backdrop to close
    srch.addEventListener("click", function (e) {
      if (e.target === srch) closeS();
    });

    si.addEventListener("input", srun);

    // Choosing a result closes the modal (browser still follows the href)
    sr.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) closeS();
    });

    // Global keyboard shortcuts
    addEventListener("keydown", function (e) {
      var tag = e.target && e.target.tagName;
      var typing = tag === "INPUT" || tag === "TEXTAREA";

      if (srch.classList.contains("open")) {
        if (e.key === "Escape") {
          closeS();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          moveSel(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          moveSel(-1);
        } else if (e.key === "Enter" && visible[ssel]) {
          e.preventDefault();
          var href = visible[ssel].getAttribute("href") || "#";
          closeS();
          if (href === "#") {
            location.hash = "";
            window.scrollTo(0, 0);
          } else {
            location.hash = href.slice(1);
          }
        }
        return;
      }

      // Open search with "/" or Cmd|Ctrl+K
      if (
        !typing &&
        (e.key === "/" ||
          ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"))
      ) {
        e.preventDefault();
        openS();
      } else if (e.key === "Escape" && window.__pitgCloseMenu) {
        window.__pitgCloseMenu();
      }
    });
  })();

  /* ============================================================
     8) HASH ROUTING — home (#vh) vs portfolio detail pages (#vp)
     HTML already has every detail page as:
       <section class="page" data-key="what" hidden>…</section>
     JS only shows / hides them. It does NOT build the page content.

     Examples:
       home.html          → home view
       home.html#what     → "What PITG does" detail page
       home.html#track    → "Track record" detail page
       Click crumb "ProcessIT Global" (href="#") → back to home
     ============================================================ */
  (function initHashRouting() {
    var vh = $("vh");
    var vp = $("vp");
    if (!vh || !vp) return;

    var pages = [].slice.call(vp.querySelectorAll("section.page[data-key]"));
    if (!pages.length) return;

    // Quick lookup: "what" → that <section class="page">
    var BYK = {};
    pages.forEach(function (el) {
      BYK[el.getAttribute("data-key")] = el;
    });

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

    var active = null; // currently visible detail section

    /* ---- Scroll reveal: add .in to .b blocks when they enter view ---- */
    var io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
      );
    }

    function reveal(root) {
      [].slice.call(root.querySelectorAll(".b")).forEach(function (block) {
        if (block.classList.contains("in")) return;
        if (io) io.observe(block);
        else block.classList.add("in");
      });
    }

    /* ---- TOC buttons: smooth-scroll to headings; spy highlights .cur ---- */
    function wireToc(pageEl) {
      var toc = pageEl.querySelector(".toc");
      if (!toc || toc.hasAttribute("hidden")) return;

      [].slice.call(toc.querySelectorAll("button[data-t]")).forEach(function (btn) {
        if (btn.getAttribute("data-wired") === "1") return;
        btn.setAttribute("data-wired", "1");
        btn.addEventListener("click", function () {
          var el = document.getElementById(btn.getAttribute("data-t"));
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function tocSpy() {
      if (!active || vp.hidden) return;
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

    /** Show one hard-coded detail page and hide the home view. */
    function showPage(page) {
      pages.forEach(function (el) {
        el.hidden = el !== page;
      });
      active = page;

      // Copy accent CSS vars onto #vp (cards / sidebar use --a / --t)
      vp.style.cssText = page.getAttribute("style") || "";

      vh.hidden = true;
      vp.hidden = false;

      document.title =
        (TITLES[page.getAttribute("data-key")] || "Portfolio") +
        " | ProcessIT Global";

      var side = page.querySelector("details.side");
      if (side && innerWidth > 980) side.open = true;

      wireToc(page);
      reveal(page);
    }

    /** Restore the home view and hide every detail page. */
    function showHome() {
      pages.forEach(function (el) {
        el.hidden = true;
      });
      active = null;
      vp.hidden = true;
      vh.hidden = false;
      vp.style.cssText = "";
      document.title = "ProcessIT Global | IAM-first cybersecurity";
    }

    /**
     * Read location.hash and switch views.
     *   #what / #features / … → detail page
     *   empty / unknown       → home
     */
    function route() {
      if (window.__pitgCloseMenu) window.__pitgCloseMenu();
      if (window.__pitgCloseSearch) window.__pitgCloseSearch();

      var key = location.hash.slice(1);
      var page = BYK[key];
      if (page) showPage(page);
      else showHome();
      window.scrollTo(0, 0);
    }

    window.addEventListener("hashchange", route);
    window.addEventListener("scroll", tocSpy, { passive: true });

    // First paint: honour a deep link like home.html#what
    route();
  })();
})();
