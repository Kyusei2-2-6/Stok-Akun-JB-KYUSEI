/* =========================================================
   Kyusei - router.js (HASH SPA)
   Goal:
   - Music tetap jalan (tidak reload halaman)
   - Route:
      #/home
      #/product?code=A001
   ========================================================= */

(function () {
  "use strict";

  var app = document.getElementById("app");
  if (!app) return;

  var routes = {
    home: "./pages/home.html",
    product: "./pages/product.html"
  };

  function parseHash() {
    // default
    var h = location.hash || "#/home";
    if (h.indexOf("#/") !== 0) h = "#/home";

    var raw = h.slice(2); // remove "#/"
    var parts = raw.split("?");
    var name = (parts[0] || "home").toLowerCase();
    var qs = parts[1] || "";
    var params = new URLSearchParams(qs);
    return { name: name, params: params };
  }

  function setTitle(t) { try { document.title = t; } catch (e) {} }

  async function loadPageInner() {
    var r = parseHash();
    var file = routes[r.name] || routes.home;

    var res = await fetch(file, { cache: "no-store" });
    var html = await res.text();

    app.innerHTML = html;

    // call page init (controller)
    if (r.name === "home" && window.initHome) window.initHome();
    if (r.name === "product" && window.initProduct) window.initProduct(r.params);

    // title fallback
    if (typeof SITE_NAME !== "undefined" && r.name === "home") setTitle(SITE_NAME);
  }


async function loadPage() {
  // Elegant sweep transition (lightweight)
  try { document.body.classList.add("sweep"); } catch(e) {}
  // small delay so sweep appears before content swap
  await new Promise(function(res){ setTimeout(res, 140); });
  await loadPageInner();
  // remove sweep after animation
  setTimeout(function(){ try { document.body.classList.remove("sweep"); } catch(e) {} }, 520);
}


  window.addEventListener("hashchange", loadPage);

  // Boot
  if (!location.hash) location.hash = "#/home";
  loadPage().catch(function (e) {
    console.error(e);
    app.innerHTML = "<div class='wrap' style='padding:16px'>Gagal memuat halaman.</div>";
  });
})();
