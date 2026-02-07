/* =========================================================
   Kyusei - api.js
   - Load PRODUCTS dari Cloudflare Worker API (/products)
   - Cache sekali (biar cepat + hemat)
   ========================================================= */

(function () {
  "use strict";

  var _cachePromise = null;

  function getBase() {
    return (window.KYUSEI_API_BASE || "").replace(/\/+$/,"");
  }

  async function fetchProducts() {
    var base = getBase();
    if (!base) throw new Error("KYUSEI_API_BASE belum di-set (cek config.js).");

    var url = base + "/products";
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("API /products error: " + res.status);

    var j = await res.json();
    if (!j || j.ok !== true || !Array.isArray(j.products)) {
      throw new Error("Format API tidak sesuai.");
    }

    window.PRODUCTS = j.products;
    return j.products;
  }

  window.loadProductsOnce = function () {
    // kalau PRODUCTS lokal sudah ada, tetap coba pakai yang API kalau base ada
    if (_cachePromise) return _cachePromise;
    _cachePromise = fetchProducts().catch(function (e) {
      // fallback: kalau ada PRODUCTS lokal, tetap lanjut (dev/offline)
      if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) return PRODUCTS;
      throw e;
    });
    return _cachePromise;
  };
})();
