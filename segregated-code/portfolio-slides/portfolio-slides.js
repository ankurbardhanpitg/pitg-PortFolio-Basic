/**
 * ProcessIT Global — portfolio-slides.js
 * --------------------------------------
 * COPIED EXTRACT for designers / reference only.
 * Source: script.js → portfolio carousel (#stg / rot / auto) plus the
 * helpers and PG[] data needed to build each slide body.
 * Live site still runs script.js; this file is not loaded from home.html.
 *
 * Big picture (read this first):
 *   1. PG[] holds the text/data for every portfolio page.
 *   2. Helper functions turn that data into HTML strings (cards, charts, chips…).
 *   3. initPortfolioSlides() puts those HTML cards into the page, then
 *      listens for clicks / swipes / keys so the carousel can rotate.
 *
 * HTML pieces this script expects (see portfolio-slides.html):
 *   #stg  — empty stage; slide cards are inserted here
 *   #dts  — empty row; one tiny dot button per slide is inserted here
 *   #cnt  — counter text like "09 / 10 · BFSI compliance"
 *   #pv   — "previous" arrow button
 *   #nv   — "next" arrow button
 *   #slides — the whole section (used to pause autoplay on hover)
 *
 * CSS classes that move the cards in 3D (see portfolio-slides.css):
 *   .sl.p0  — active card in the center (facing you)
 *   .sl.p1  — next card, angled to the right
 *   .sl.p2  — previous card, angled to the left
 *   .sl.p3  — all other cards, hidden off-stage
 */

/* ---- Theme helpers (from script.js) ----
 * PAL  = colour palette for donut charts
 * TG   = product-family short codes → [accent colour, full name]
 * CAPS = reusable chip labels for the Data security slide
 */
var PAL = ["#2F6BFF", "#12B5CB", "#7B5CFA", "#F59E2B", "#22B07D", "#F0567A"];
var TG = {
  nq: ["#2F6BFF", "OpenText NetIQ"],
  sf: ["#12B5CB", "Silverfort"],
  vt: ["#22B07D", "OpenText Voltage"],
  fo: ["#7B5CFA", "Fortify"],
  so: ["#F59E2B", "SOC platforms"]
};
var CAPS = [
  "Encryption at rest and in motion",
  "Format-preserving encryption",
  "Tokenisation",
  "Key management and rotation",
  "Masking and hashing",
  "REST API integration",
  "GDPR and Indian compliance"
];

/* ---- Page content model (PG)
 * One object per portfolio page. Fields a beginner should know:
 *   k  = short key / hash id          e.g. "bfsi"
 *   t  = title shown on the card      e.g. "BFSI compliance"
 *   s  = short subtitle under the title
 *   b  = list of "blocks" that make up the card body
 *
 * Each block is an array starting with a type name:
 *   ["kp", …]     key numbers (big stats)
 *   ["chips", …]  pill tags
 *   ["cards", …]  small content cards
 *   ["donut", …]  donut chart
 *   ["bars", …]   horizontal bar chart
 *   ["acc", …]    accordion (problem / answer)
 *   ["row", …]    two blocks side by side
 *   ["pairs", …]  mandate → solution rows
 *
 * Tip for designers: edit the text inside PG to change what a slide says.
 * You usually do not need to touch the carousel logic below.
 */
var PG = [
  {
    k: "what",
    t: "What PITG does",
    s: "Architected with a consulting lens, delivered with engineering rigour, maintained with operational discipline.",
    b: [
      ["chips", "Four verbs behind every engagement", ["Design", "Integrate", "Operationalise", "Simplify"]],
      ["kp", [
        ["40+", "IAM and IGA projects"],
        ["27+", "Implementations"],
        ["10+", "Advisory"],
        ["1M+", "Identities covered"],
        ["55+", "Professionals"],
        ["3", "Countries"]
      ]]
    ]
  },
  {
    k: "problem",
    t: "The problem",
    s: "Why standard security engines fail in production, and what PITG builds in response.",
    b: [
      ["acc", "", [
        ["Mass-market OEMs", "Vendors do not write custom code for unique networks.", "Bespoke R&D connectors, drivers and dashboards."],
        ["Legacy burden", "Air-gapped and 15+ year-old systems resist Tier-1 tools.", "An integration fabric that bridges legacy and modern."],
        ["AI threat vector", "Non-human identities leave endpoint tools exposed.", "Identity-led controls and ITDR for human and AI identities."]
      ], "Problem", "PITG answer"]
    ]
  },
  {
    k: "business",
    t: "Lines of business",
    s: "Four lines of business, one identity-led architecture.",
    b: [
      ["cards", "", [
        ["01 Human and AI-agent identity security", "IAM, IGA, PAM, MFA, ITDR. OpenText NetIQ, Silverfort."],
        ["02 Data and application security", "Encryption, tokenisation, code review. OpenText Voltage, Fortify."],
        ["03 Tier-1 managed enterprise SOC", "SIEM, SOAR, UEBA, NTA, VAPT, EDR. Splunk, ArcSight."],
        ["04 Proprietary MSME SOC", "Enterprise-grade defence for MSMEs. In-house, open-source."]
      ], 2]
    ]
  },
  {
    k: "functions",
    t: "Functionalities",
    s: "What the portfolio does in practice, and the platform behind each capability.",
    b: [
      ["cards", "", [
        ["Lifecycle and governance", "Joiner-mover-leaver, access reviews. NetIQ IDM, IGA.", "nq"],
        ["Access and SSO", "Policy-based access, hybrid estates. NetIQ Access Manager.", "nq"],
        ["Strong authentication, Zero Trust", "MFA incl. hardware TOTP tokens. Advanced Authentication, Silverfort.", "sf"],
        ["Privileged access", "Admin and shared account control. NetIQ PAM.", "nq"],
        ["AD management", "Administration and change auditing. NetIQ AD suite, Change Guardian.", "nq"],
        ["Identity threat defence", "Non-human identity, AD, ITDR. Silverfort.", "sf"],
        ["Data protection", "Encryption, tokenisation, masking. OpenText Voltage.", "vt"],
        ["Application assurance", "Code review, secure SDLC. Fortify.", "fo"],
        ["Threat monitoring", "SIEM, SOAR, UEBA, forensic logs. Splunk, ArcSight, PITG SOC.", "so"]
      ], 3]
    ]
  },
  {
    k: "features",
    t: "Key features",
    s: "What sets the PITG delivery apart.",
    b: [
      ["cards", "", [
        ["Bespoke R&D integration", "Custom connectors, drivers and dashboards where OEMs stop."],
        ["Legacy and air-gapped ready", "Bridges 15+ year-old and offline systems to Tier-1 engines."],
        ["Identity-led architecture", "Unified outcomes, not fragmented point products."],
        ["Operational lock-in", "A solidified integration layer for dependable operations."],
        ["Compliance mapped", "RBI controls mapped to audit-ready evidence."],
        ["Sovereign-cleared record", "Defence, health, finance and a state SOC delivered."]
      ], 3, 1]
    ]
  },
  {
    k: "arsenal",
    t: "Solutions arsenal",
    s: "Platforms PITG consults on, implements and operates, grouped by capability.",
    b: [
      ["bars", "Products and modules by group", [
        ["Identity and Access", 5],
        ["AD Management", 3],
        ["Identity Defence", 4],
        ["Data Security", 5],
        ["App Security", 3],
        ["Security Ops", 7]
      ], ""]
    ]
  },
  {
    k: "track",
    t: "Track record",
    s: "Delivered for sovereign, defence and regulated clients where technical entry barriers are restrictive.",
    b: [
      ["kp", [
        ["250K+", "Largest IAM programme"],
        ["1M+", "Identities covered"],
        ["34", "Named clients across 5 sectors"]
      ]],
      ["row", [
        ["donut", "IAM engagements by segment (%)", [
          ["Central and State Govt", 33],
          ["Defence and Armed Forces", 33],
          ["BFSI", 20],
          ["Utilities and PSU", 8],
          ["Smart Cities", 6]
        ]],
        ["cols", "Identities covered (thousands)", [
          ["Govt", 300],
          ["Defence", 300],
          ["BFSI", 200],
          ["Utilities", 100],
          ["PSUs", 100]
        ], "K+"]
      ]]
    ]
  },
  {
    k: "data",
    t: "Data security",
    s: "Sensitive data protected at rest and in motion across India and Southeast Asia, on OpenText Voltage.",
    b: [
      ["row", [
        ["donut", "Voltage customers by segment (%)", [
          ["Foreign Govt and Autonomous", 48.8],
          ["Smart Cities", 35],
          ["BFSI", 16.2]
        ]],
        ["chips", "Core capabilities", CAPS]
      ]]
    ]
  },
  {
    k: "bfsi",
    t: "BFSI compliance",
    s: "RBI mandates mapped to PITG solutions.",
    b: [
      ["kp", [
        ["6", "RBI mandates mapped"],
        ["ISO", "27001:2022 certified"],
        ["2-6 h", "Disclosure alignment"]
      ]],
      ["pairs", "", [
        ["Identity security (Control 19)", "", "NetIQ Identity Manager and Governance; Silverfort MFA and ITDR."],
        ["Hybrid cloud unification", "", "Single identity fabric with Zero-Trust authentication."],
        ["Data leak prevention", "", "Voltage encryption and tokenisation."],
        ["Secure SDLC", "", "Fortify code review and lifecycle mapping."],
        ["Continuous monitoring", "", "SIEM, SOAR, UEBA; 2-to-6 hour disclosure alignment."],
        ["Vendor risk management", "", "ISO 27001:2022 certified, profitable, sovereign-cleared."]
      ], "RBI mandate", "PITG solution"]
    ]
  },
  {
    k: "ecosystem",
    t: "Ecosystem",
    s: "Flexible engagement models and a strong SI partner network.",
    b: [
      ["chips", "SI partners", ["HPE", "LTI Mindtree", "Blackbox", "Tata Communications"]],
      ["cards", "Why PITG", [
        ["No vendor lock-in", "Agnostic R&D keeps workloads portable."],
        ["Frictionless audits", "One compliance library, single-pane proof."],
        ["Sovereign trust", "West Bengal State SOC, defence and finance clients."]
      ], 3, 1]
    ]
  }
];

/* ---- HTML helpers & block renderers (used by slideBody) ----
 * These functions take plain data and return HTML strings.
 * Think of them as "templates" written in JavaScript.
 */

/** Escape special characters so titles cannot break the HTML. */
function E(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** Optional section heading inside a slide body. Empty string → no heading. */
function T(t) {
  return t ? "<h3>" + E(t) + "</h3>" : "";
}

/**
 * One small content card: title + paragraph.
 * c[0] = title, c[1] = body, c[2] = optional product code (nq/sf/…)
 * num = true → show a "01 / 02 / 03" number badge
 */
function card(c, i, num) {
  var k = c[2] && TG[c[2]] ? ' style="--k:' + TG[c[2]][0] + '"' : "";
  return (
    '<div class="c"' + k + ">" +
    (num ? '<span class="n">' + ("0" + (i + 1)).slice(-2) + "</span>" : "") +
    "<h4>" + E(c[0]) + "</h4><p>" + E(c[1]) + "</p></div>"
  );
}

/**
 * R = dictionary of block renderers.
 * Key = block type name from PG (e.g. "kp", "chips").
 * Value = function that returns the HTML for that block.
 * blk() below looks up R[type] and calls it.
 */
var R = {
  /* Big number stats, e.g. "6" / "RBI mandates mapped" */
  kp: function (a) {
    return (
      '<div class="kp">' +
      a.map(function (x) {
        return "<div><strong>" + E(x[0]) + "</strong><span>" + E(x[1]) + "</span></div>";
      }).join("") +
      "</div>"
    );
  },
  /* Rounded pill tags in a row */
  chips: function (t, a) {
    return (
      T(t) +
      '<div class="ch">' +
      a.map(function (x) {
        return "<span>" + E(x) + "</span>";
      }).join("") +
      "</div>"
    );
  },
  /* Grid of content cards; n = columns (2 or 3) */
  cards: function (t, a, n, num) {
    return (
      T(t) +
      '<div class="g' + (n || 2) + '">' +
      a.map(function (c, i) {
        return card(c, i, num);
      }).join("") +
      "</div>"
    );
  },
  /* Mandate → solution pairs (left card, arrow, right card) */
  pairs: function (t, a, l1, l2) {
    return (
      T(t) +
      a.map(function (p) {
        return (
          '<div class="pr"><div class="c"><span class="n">' + l1 + "</span><h4>" + E(p[0]) + "</h4>" +
          (p[1] ? "<p>" + E(p[1]) + "</p>" : "") +
          '</div><span>\u2192</span><div class="c"><span class="n">' + l2 + "</span><h4>" + E(p[2]) + "</h4></div></div>"
        );
      }).join("")
    );
  },
  /* Expandable problem / answer accordion */
  acc: function (t, a, l1, l2) {
    return (
      T(t) +
      '<div class="how-acc">' +
      a.map(function (p) {
        return (
          '<details><summary><span class="how-k">' + E(l1) + '</span><span class="how-q">' + E(p[0]) + "</span>" +
          (p[1] ? '<span class="how-d">' + E(p[1]) + "</span>" : "") +
          '</summary><div class="how-a"><span class="how-k">' + E(l2) + "</span><p>" + E(p[2]) + "</p></div></details>"
        );
      }).join("") +
      "</div>"
    );
  },
  /* Horizontal bar chart; u = unit suffix (e.g. "" or "K") */
  bars: function (t, a, u) {
    var m = Math.max.apply(null, a.map(function (r) { return r[1]; }));
    return (
      T(t) +
      a.map(function (r) {
        return (
          '<div class="br"><span>' + E(r[0]) + '</span><div><i style="width:' + (r[1] / m * 100) + '%"></i></div><em>' +
          r[1] + u + "</em></div>"
        );
      }).join("")
    );
  },
  /* Vertical column bars */
  cols: function (t, a, u) {
    var m = Math.max.apply(null, a.map(function (r) { return r[1]; }));
    return (
      T(t) +
      '<div class="cl">' +
      a.map(function (r) {
        return (
          "<div><b>" + r[1] + u + '</b><i style="height:' + (r[1] / m * 78) + '%"></i>' +
          E(r[0]) + "</div>"
        );
      }).join("") +
      "</div>"
    );
  },
  /* SVG donut + colour legend */
  donut: function (t, a) {
    var s = a.reduce(function (x, r) { return x + r[1]; }, 0);
    var o = 0;
    var h = T(t) + '<div class="dn"><svg viewBox="0 0 42 42">';
    a.forEach(function (r, i) {
      var p = r[1] / s * 100;
      h +=
        '<circle cx="21" cy="21" r="15.9155" stroke="' + PAL[i % PAL.length] +
        '" stroke-dasharray="' + (p - 0.6) + " " + (100 - p + 0.6) +
        '" stroke-dashoffset="' + -o + '"/>';
      o += p;
    });
    h +=
      '</svg><div class="lgd">' +
      a.map(function (r, i) {
        return (
          '<div><i style="background:' + PAL[i % PAL.length] + '"></i>' +
          E(r[0]) + "<b>" + r[1] + "</b></div>"
        );
      }).join("") +
      "</div></div>";
    return h;
  },
  /* Two blocks side by side in a 2-column grid */
  row: function (a) {
    return (
      '<div class="g2">' +
      a.map(function (b) {
        return "<div>" + blk(b) + "</div>";
      }).join("") +
      "</div>"
    );
  }
};

/**
 * Dispatch one block: b[0] is the type name, the rest are arguments.
 * Example: ["kp", [["6","…"],["ISO","…"]]] → R.kp([["6","…"], …])
 */
function blk(b) {
  return R[b[0]].apply(null, b.slice(1));
}

/* ---- Per-page accents + lookup tables ----
 * NT[i] = [soft tint, strong accent] for page index i
 *         Soft tint → CSS var --t (backgrounds)
 *         Accent    → CSS var --a (top border, Open button, active dot)
 * FK    = short platform names shown under Functionality chips
 */
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
var FK = { nq: "NetIQ", sf: "Silverfort", vt: "Voltage", fo: "Fortify", so: "SOC" };

/** Turn 9 into "09" for the counter display. */
function pad(n) {
  return ("0" + n).slice(-2);
}

/** Shorthand: $("stg") === document.getElementById("stg") */
var $ = function (id) {
  return document.getElementById(id);
};

/**
 * BYK   = lookup page by key, e.g. BYK["bfsi"]
 * FEAT  = keys shown first in the carousel ("featured")
 * MORE  = all remaining pages, after featured
 * After the loop, every page also has p.i = its index in PG.
 */
var BYK = {};
var FEAT = ["features", "functions", "business"];
PG.forEach(function (p, i) {
  p.i = i;
  BYK[p.k] = p;
});
var MORE = PG.filter(function (p) {
  return FEAT.indexOf(p.k) < 0;
});

/** Accent pair for a page: [soft, strong]. */
function ac(p) {
  return NT[p.i % NT.length];
}

/**
 * Inline CSS variables for one slide/dot.
 * Example result: "--t:#ECEDFF;--a:#4048D6"
 * CSS then uses var(--a) for the blue top border and Open button.
 */
function st(p) {
  var n = ac(p);
  return "--t:" + n[0] + ";--a:" + n[1];
}

/** Return the cards list from a page's blocks (or [] if none). */
function cardsOf(k) {
  var b = BYK[k].b.filter(function (x) {
    return x[0] === "cards";
  })[0];
  return b ? b[2] : [];
}

/* ---- Slide body builders ----
 * Each slide card has a header (title + Open) plus a "body".
 * slideBody(pageKey) picks the right layout for that page.
 */

/** Find one block of a given type on a page, e.g. bk("bfsi","kp"). */
function bk(k, t) {
  return BYK[k].b.filter(function (x) {
    return x[0] === t;
  })[0];
}

/** Compact mini-card used inside feature / business grids. */
function mini(x) {
  return '<div class="mc"><b>' + E(x[0]) + "</b><p>" + E(x[1]) + "</p></div>";
}

/**
 * Build the inner HTML for one slide (everything under the title row).
 * Different pages get different layouts — that is intentional so the
 * carousel can preview charts, chips, or card grids depending on content.
 */
function slideBody(k) {
  // Key features → 3-column mini cards
  if (k === "features") {
    return '<div class="sg g-feat">' + cardsOf(k).map(mini).join("") + "</div>";
  }
  // Functionalities → chips with coloured left border + platform name
  if (k === "functions") {
    return (
      '<div class="sg g-fn">' +
      cardsOf(k).map(function (x) {
        var col = (TG[x[2]] || ["#2F6BFF"])[0];
        return (
          '<div class="fx" style="--k:' + col + '"><b>' + E(x[0]) +
          "</b><small>" + E(FK[x[2]] || "") + "</small></div>"
        );
      }).join("") +
      "</div>"
    );
  }
  // Lines of business → numbered mini cards in 2 columns
  if (k === "business") {
    return (
      '<div class="sg g-bz">' +
      cardsOf(k).map(function (x) {
        // Split "01 Human and …" into number + title
        var m = x[0].match(/^(\d+)\s+(.*)$/);
        return (
          '<div class="mc"><span class="n">' + (m ? m[1] : "") +
          "</span><b>" + E(m ? m[2] : x[0]) + "</b><p>" + E(x[1]) + "</p></div>"
        );
      }).join("") +
      "</div>"
    );
  }
  if (k === "problem") return blk(bk(k, "acc"));
  if (k === "ecosystem") {
    return (
      '<div class="pvw"><div class="sg g-feat">' +
      cardsOf(k).map(mini).join("") +
      "</div>" + blk(bk(k, "chips")) + "</div>"
    );
  }
  if (k === "what") {
    return '<div class="pvw">' + blk(bk(k, "kp")) + blk(bk(k, "chips")) + "</div>";
  }
  if (k === "arsenal") {
    return '<div class="pvw">' + blk(bk(k, "bars")) + "</div>";
  }
  if (k === "track") {
    return '<div class="pvw">' + blk(bk(k, "kp")) + blk(bk(k, "row")) + "</div>";
  }
  if (k === "data") {
    return '<div class="pvw">' + blk(bk(k, "row")) + "</div>";
  }
  // BFSI: big stats + chip list made from the mandate titles
  if (k === "bfsi") {
    return (
      '<div class="pvw">' +
      blk(bk(k, "kp")) +
      blk(["chips", "RBI mandates mapped", bk(k, "pairs")[2].map(function (x) {
        return x[0];
      })]) +
      "</div>"
    );
  }
  return "";
}

/**
 * initPortfolioSlides()
 * ---------------------
 * Main entry point. Runs once when the page loads.
 *
 * Steps, in order:
 *   A. Find the HTML mounts (#stg, #dts, #cnt). Stop if any is missing.
 *   B. Build the ordered slide list (featured pages first).
 *   C. Write one <article class="sl"> per page into #stg.
 *   D. Write one <button class="dt"> per page into #dts.
 *   E. Define rot(n)  — move a given slide to the center.
 *   F. Define auto()  — start / restart the autoplay timer.
 *   G. Wire user input: side-card click, dots, arrows, swipe, keyboard.
 *   H. Pause autoplay while the mouse is over the section.
 *   I. Show the first slide and start autoplay.
 *
 * Copied from script.js (standalone extract skips the live-site #vh check).
 */
function initPortfolioSlides() {

  /* ---- A. Grab the HTML elements we will fill / control ---- */
  var stgEl = $("stg"); // stage where cards stack
  var dtsEl = $("dts"); // row of dots under the controls
  var cnt = $("cnt");   // "09 / 10 · Title" text
  // Safety: if the HTML extract is incomplete, do nothing instead of crashing
  if (!stgEl || !dtsEl || !cnt) return;

  /* ---- B. Ordered list of slides ----
   * SL = featured pages first, then the remaining pages.
   * cur = index of the card currently in the center (starts at 0).
   * tm  = id of the autoplay timer (so we can clear / restart it).
   * swiped = true for a brief moment after a finger/mouse swipe,
   *          so a swipe does not also count as a click.
   * FLIP = how long (ms) to wait before auto-advancing. 90000 = 90 seconds.
   */
  var SL = FEAT.map(function (k) {
    return BYK[k];
  }).concat(MORE);
  var cur = 0;
  var tm = 0;
  var swiped = false;
  var FLIP = 90000;
  console.log("SL===================>", SL);

  /* ---- C. Build every slide card and put them into #stg ----
   * Each card is an <article class="sl"> with:
   *   - style="--t:…;--a:…"  → per-page accent colours (CSS variables)
   *   - .sh header row       → eyebrow + title + subtitle + Open button
   *   - slideBody(…)         → stats / charts / chips for that page
   * All cards start with class "p3" (hidden). rot(0) will reveal the first.
   */
  stgEl.innerHTML = SL.map(function (p, i) {
    return (
      '<article class="sl p3" data-i="' + i + '" style="' + st(p) +
      '" aria-roledescription="slide" aria-label="' + E(p.t) +
      '"><div class="sh"><div><span class="eb">' + E(p.t) +
      "</span><h3>" + E(p.t) + "</h3><p>" + E(p.s) +
      '</p></div><a class="go" href="#' + p.k +
      '" aria-label="Open the ' + E(p.t) + ' page" title="Open ' + E(p.t) +
      '"><span>Open</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a></div>' +
      slideBody(p.k) +
      "</article>"
    );
  }).join("");

  /* ---- D. Build one dot button per slide into #dts ----
   * The active dot gets class "on" (wider + accent colour) inside rot().
   */
  dtsEl.innerHTML = SL.map(function (p, i) {
    return (
      '<button type="button" class="dt" data-i="' + i +
      '" role="tab" aria-label="' + E(p.t) +
      '" title="' + E(p.t) +
      '" style="' + st(p) + '"></button>'
    );
  }).join("");

  // Keep live arrays of the DOM nodes we just created (easier than re-querying)
  var sls = [].slice.call(document.querySelectorAll(".sl"));
  var dts = [].slice.call(document.querySelectorAll(".dt"));

  /**
   * rot(n) — move slide number n to the center.
   *
   * How the 3D layout works:
   *   d = how far this card is from the active one (wrapping around the list)
   *   d === 0      → class p0  (center, full size)
   *   d === 1      → class p1  (next, angled right)
   *   d === L - 1  → class p2  (previous, angled left)
   *   anything else → class p3 (hidden)
   *
   * Also updates: which Open button is tabbable, which dot is "on",
   * and the counter text ("09 / 10 · BFSI compliance").
   *
   * The ((n % L) + L) % L trick keeps the index in range even for
   * negative numbers (e.g. going "previous" from slide 0 → last slide).
   */
  function rot(n) {
    var L = SL.length;
    cur = ((n % L) + L) % L;

    // Assign p0 / p1 / p2 / p3 to every card based on distance from cur
    sls.forEach(function (s, i) {
      var d = ((i - cur) % L + L) % L;
      s.className = "sl " + (d === 0 ? "p0" : d === 1 ? "p1" : d === L - 1 ? "p2" : "p3");
      // Only the center card's Open link should be reachable with Tab
      var go = s.querySelector(".go");
      go.tabIndex = d === 0 ? 0 : -1;
      s.setAttribute("aria-hidden", d === 0 ? "false" : "true");
    });

    // Highlight the matching dot
    dts.forEach(function (t, i) {
      t.classList.toggle("on", i === cur);
      t.setAttribute("aria-selected", i === cur);
    });

    // Update the "09 / 10 · Title" counter
    cnt.innerHTML =
      "<b>" + pad(cur + 1) + "</b> / " + pad(L) +
      " &nbsp;&middot;&nbsp; " + E(SL[cur].t);
  }

  /**
   * auto() — (re)start the autoplay timer.
   * Clears any previous timer first, so calling auto() after a manual
   * click always resets the countdown from zero.
   * Respects the user's "prefers-reduced-motion" setting (no autoplay then).
   * Skips ticks while the browser tab is hidden (document.hidden).
   */
  function auto() {
    clearInterval(tm);
    if (matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tm = setInterval(function () {
      if (!document.hidden) rot(cur + 1);
    }, FLIP);
  }

  /* ---- G1. Click a side card (p1 or p2) to bring it to the center ----
   * Clicking the center card itself does nothing special (Open link works).
   * If the user just finished a swipe, ignore the click (swiped flag).
   */
  sls.forEach(function (s, i) {
    s.addEventListener("click", function (e) {
      if (swiped) {
        e.preventDefault();
        return;
      }
      var L = SL.length;
      var d = ((i - cur) % L + L) % L;
      // Only react when the clicked card is the immediate neighbour
      if (d !== 0 && (d === 1 || d === L - 1)) {
        e.preventDefault();
        rot(i);
        auto(); // restart autoplay after a manual move
      }
    });
  });

  /* ---- G2. Dot buttons + prev/next arrows ----
   * Dot i  → jump straight to slide i
   * #pv    → previous (cur - 1)
   * #nv    → next     (cur + 1)
   */
  dts.forEach(function (t, i) {
    t.onclick = function () {
      rot(i);
      auto();
    };
  });
  $("pv").onclick = function () {
    rot(cur - 1);
    auto();
  };
  $("nv").onclick = function () {
    rot(cur + 1);
    auto();
  };

  /* ---- G3. Swipe / drag on the stage ----
   * pointerdown stores the start X.
   * pointerup compares end X; if the finger moved more than 55px,
   * treat it as a swipe (left = next, right = previous).
   * swiped is set true briefly so the following click event is ignored.
   */
  var sx = null; // start X of the pointer; null = no active drag
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
      // Negative dx = finger moved left → show next slide
      rot(cur + (dx < 0 ? 1 : -1));
      auto();
      setTimeout(function () {
        swiped = false;
      }, 60);
    }
  });

  /* ---- G4. Keyboard when #stg is focused (tabindex="0" in the HTML) ----
   * ArrowRight → next, ArrowLeft → previous
   */
  stgEl.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      rot(cur + 1);
      auto();
    } else if (e.key === "ArrowLeft") {
      rot(cur - 1);
      auto();
    }
  });

  /* ---- H. Pause autoplay while the user is exploring ----
   * mouseenter / focusin → stop the timer
   * mouseleave           → start it again
   */
  var csec = $("slides");
  csec.addEventListener("mouseenter", function () {
    clearInterval(tm);
  });
  csec.addEventListener("mouseleave", auto);
  csec.addEventListener("focusin", function () {
    clearInterval(tm);
  });

  /* ---- I. First paint: show slide 0, then start autoplay ---- */
  rot(0);
  auto();
}

/* Standalone boot: run as soon as this script loads.
 * On the live site the same logic runs inside script.js without this call.
 */
initPortfolioSlides();
