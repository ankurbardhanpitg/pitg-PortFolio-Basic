/**
 * ProcessIT Global — About-Pitg/about-pitg.js
 * About PITG home segment (#about). Markup lives in home.html
 * (source: About-Pitg/about-pitg.html); styles in about-pitg.css.
 * Exposes window.PITGAboutPitg.init for the home chrome boot sequence.
 */
(function (w) {
  function init() {
    var about = document.getElementById("about");
    if (!about) return;
  }

  w.PITGAboutPitg = w.PITGAboutPitg || {};
  w.PITGAboutPitg.init = init;
})(window);
