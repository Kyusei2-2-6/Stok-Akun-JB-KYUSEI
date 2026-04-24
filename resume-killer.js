/* Kyusei Store - hapus tombol Lanjutkan produk terakhir */
(function () {
  "use strict";

  function killResume() {
    try {
      localStorage.removeItem("lastProductUrl");
      localStorage.removeItem("lastProductCode");
    } catch (e) {}

    var selectors = [
      "#resumeWrap",
      "#resumeProduct",
      ".resumeWrap",
      ".resumeBottom",
      ".resumeChip"
    ];

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.remove();
      });
    });

    document.querySelectorAll("a, div, button").forEach(function (el) {
      var t = (el.textContent || "").toLowerCase();
      if (t.includes("lanjutkan") && t.includes("produk terakhir")) {
        el.remove();
      }
    });
  }

  killResume();
  document.addEventListener("DOMContentLoaded", killResume);
  window.addEventListener("hashchange", killResume);
  setInterval(killResume, 500);
})();
