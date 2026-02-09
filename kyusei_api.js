/* Kyusei API client (auto-load products + image proxy)
   - PRODUCTS diambil dari Worker: /products
   - Gambar lewat Worker: /i/<path>?w=...
*/
(function(){
  "use strict";

  var BASE = "https://kyusei-edit-bot.maunyolongyaaaa.workers.dev";

  function isAssetPath(p){
    return typeof p === "string" && p.indexOf("assets/") === 0;
  }

  function img(path, w){
    if (!path) return "";
    // kalau sudah http(s), biarin
    if (/^https?:\/\//i.test(path)) return path;
    if (!isAssetPath(path)) {
      try { return new URL(path, document.baseURI).href; } catch(e){ return path; }
    }
    var ww = w || 900;
    // jangan encode seluruh query, cukup path
    return BASE + "/i/" + encodeURIComponent(path) + "?w=" + ww + "&q=75";
  }

  var _loaded = false;
  var _loading = null;

  async function loadProducts(){
    if (_loaded && Array.isArray(window.PRODUCTS)) return window.PRODUCTS;
    if (_loading) return _loading;

    _loading = (async function(){
      var res = await fetch(BASE + "/products", { cache: "no-store" });
      var j = await res.json();
      if (!j || !j.ok) throw new Error((j && j.error) ? j.error : "API error");
      window.PRODUCTS = Array.isArray(j.products) ? j.products : [];
      _loaded = true;
      return window.PRODUCTS;
    })();

    return _loading;
  }

  window.KYUSEI = { BASE: BASE, img: img, loadProducts: loadProducts };
})();
