/* =========================================================
   Kyusei - router.js (HASH SPA)
   Routes:
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
    var h = location.hash || "#/home";
    h = h.replace(/^#\/?/, "");
    var parts = h.split("?");
    var route = parts[0] || "home";
    var qs = parts[1] || "";
    var params = {};
    qs.split("&").filter(Boolean).forEach(function (kv) {
      var p = kv.split("=");
      var k = decodeURIComponent(p[0] || "");
      var v = decodeURIComponent((p[1] || "").replace(/\+/g, " "));
      if (k) params[k] = v;
    });
    return { route: route, params: params };
  }

  async function loadRoute() {
    var parsed = parseHash();
    var route = routes[parsed.route] ? parsed.route : "home";
    var page = routes[route];

    try {
      var res = await fetch(page, { cache: "no-cache" });
      var html = await res.text();
      app.innerHTML = html;

      if (route === "home" && typeof window.initHome === "function") {
        window.initHome();
      }
      if (route === "product" && typeof window.initProduct === "function") {
        window.initProduct(parsed.params);
      }
    } catch (e) {
      app.innerHTML = "<div class=\"card\"><b>Gagal muat halaman.</b><div class=\"muted\">" + String(e) + "</div></div>";
    }
  }

  window.addEventListener("hashchange", loadRoute);
  window.addEventListener("DOMContentLoaded", loadRoute);
})();
