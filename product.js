
// ===== Ripple helper (non-breaking) =====
(function(){
  try{
    if(window.__kyuseiRipple) return;
    window.__kyuseiRipple = function(root){
      root = root || document;
      var sel = ".btn, button, .chip, .card, .topbar__btn, .resumeChip";
      var nodes = root.querySelectorAll(sel);
      nodes.forEach(function(el){
        if(el.classList.contains("ripple")) return;
        el.classList.add("ripple");
        el.addEventListener("pointerdown", function(ev){
          var r = el.getBoundingClientRect();
          var x = ev.clientX - r.left;
          var y = ev.clientY - r.top;
          el.style.setProperty("--rx", x+"px");
          el.style.setProperty("--ry", y+"px");
          el.classList.remove("isRippling");
          // force reflow
          void el.offsetWidth;
          el.classList.add("isRippling");
          setTimeout(function(){ el.classList.remove("isRippling"); }, 650);
        }, {passive:true});
      });
    };
  }catch(e){}
})();

/* =========================================================
   Kyusei - product.js (DETAILED + HARDENED)
   IMPORTANT:
   - Works with NEW assets path from data.js
   - Route: #/product?code=A001
   - Web showcase-only (tanpa flow beli/pembayaran)
   ========================================================= */

(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function resolveAssetUrl(path) {
    if (typeof KYUSEI !== "undefined" && KYUSEI.img) return KYUSEI.img(path, 1000);
    try { return new URL(path, document.baseURI).href; }
    catch (e) { return path; }
  }

  function findProductByCode(code) {
    if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) return null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (String(PRODUCTS[i].code) === String(code)) return PRODUCTS[i];
    }
    return null;
  }

  function setText(el, txt) { if (el) el.textContent = txt; }

  function showNotFound(code) {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML =
      "<div class='wrap' style='padding:16px'>" +
      "Produk tidak ditemukan (" + (code || "-") + "). " +
      "<a href='#/home'>Kembali</a>" +
      "</div>";
  }

  // Exposed init for router
  window.initProduct = function (params) {
    // ---- 1) Read code from router params
    var code = params ? params.get("code") : "";

    // AUTO LOAD products dari API kalau belum ada
    if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) {
      if (typeof KYUSEI !== "undefined" && KYUSEI.loadProducts && !window.__productLoadedOnce) {
        window.__productLoadedOnce = true;
        return KYUSEI.loadProducts().then(function(){ window.__productLoadedOnce = false; window.initProduct(params); });
      }
    }
    if (!code) return showNotFound(code);

    // ---- 2) Find product in PRODUCTS
    var product = findProductByCode(code);
    if (!product) return showNotFound(code);

    // ---- 3) DOM targets (must exist in pages/product.html)
    var prodName = $("prodName");
    var prodMeta = $("prodMeta");
    var heroImg = $("heroImg");
    var thumbs = $("thumbs");

    // Web ini hanya showcase (tidak ada flow beli/pembayaran)
    var buyBtn = null;
    var buyBtn2 = null;

    // lightbox nodes
    var lightbox = $("lightbox");
    var lbImg = $("lbImg");
    var lbCaption = $("lbCaption");
    var lbPrev = $("lbPrev");
    var lbNext = $("lbNext");
    var lbClose = $("lbClose");

    // detail modal nodes
    var detailBtn = $("detailBtn");
    var detailModal = $("detailModal");
    var detailClose = $("detailClose");
    var detailSub = $("detailSub");
    var detailList = $("detailList");
    var detailEmpty = $("detailEmpty");

    // ---- 4) Save last product url (for resume)
    var productUrl = "#/product?code=" + encodeURIComponent(product.code);
    try {
      localStorage.setItem("lastProductUrl", productUrl);
      localStorage.setItem("lastProductCode", String(product.code));
    } catch (e) {}

    // ---- 5) Set page title & meta
    document.title = (product.name || "Produk") + " - " + (typeof SITE_NAME !== "undefined" ? SITE_NAME : "Store");

    setText(prodName, product.name || "Produk");

    var photoCount = (product.photos && product.photos.length) ? product.photos.length : 0;
    setText(prodMeta, String(product.code) + " • " + rupiah(product.price) + " • " + photoCount + " foto");

    // ---- 6) SOLD logic
    var isSold = (product.sold === true);
    var hero = document.querySelector(".hero");
    if (isSold) {
      if (hero) hero.classList.add("sold");
      if (prodMeta) prodMeta.textContent = (prodMeta.textContent || "") + " • SOLD ❌";
    }

    // ---- 7) (Pay/beli dihapus)

    // ---- 8) Images / hero + thumbs
    var photos = Array.isArray(product.photos) ? product.photos : [];
    var current = 0;

    function setHero(idx) {
      if (!heroImg) return;
      if (!photos.length) {
        heroImg.removeAttribute("src");
        heroImg.alt = "Tidak ada foto";
        return;
      }
      current = (idx + photos.length) % photos.length;
      heroImg.src = resolveAssetUrl(photos[current]);
      heroImg.alt = (product.name || "Produk") + " " + (current + 1);
    }

    setHero(0);

    if (thumbs) thumbs.innerHTML = "";
    for (var i = 0; i < photos.length; i++) {
      (function (src, index) {
        if (!thumbs) return;
        var img = document.createElement("img");
        img.src = resolveAssetUrl(src);
        img.alt = (product.name || "Produk") + " " + (index + 1);
        if (isSold) img.classList.add("soldThumb");

        img.addEventListener("click", function () {
          setHero(index);
          openLightbox(index);
        });

        thumbs.appendChild(img);
      })(photos[i], i);
    }

    // ---- 9) Lightbox
    if (isSold && lightbox) lightbox.classList.add("sold");

    function renderLightbox() {
      if (!photos.length || !lbImg) return;
      lbImg.src = resolveAssetUrl(photos[current]);
      if (lbCaption) lbCaption.textContent =
        (product.name || "Produk") + " • " + (current + 1) + " / " + photos.length;
    }

    function openLightbox(idx) {
      if (!photos.length || !lightbox) return;
      current = idx;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      renderLightbox();
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    }

    function prev() {
      if (!photos.length) return;
      current = (current - 1 + photos.length) % photos.length;
      renderLightbox();
    }

    function next() {
      if (!photos.length) return;
      current = (current + 1) % photos.length;
      renderLightbox();
    }

    // cleanup old handlers by cloning nodes (simple safe method)
    function resetNode(id) {
      var n = $(id);
      if (!n || !n.parentNode) return n;
      var clone = n.cloneNode(true);
      n.parentNode.replaceChild(clone, n);
      return clone;
    }

    // Because SPA can open product page multiple times, we reset clickable nodes
    lbPrev = resetNode("lbPrev");
    lbNext = resetNode("lbNext");
    lbClose = resetNode("lbClose");

    var openLightboxBtn = resetNode("openLightboxBtn");

    if (lbPrev) lbPrev.addEventListener("click", prev);
    if (lbNext) lbNext.addEventListener("click", next);
    if (lbClose) lbClose.addEventListener("click", closeLightbox);

    if (openLightboxBtn) openLightboxBtn.addEventListener("click", function () {
      if (!photos.length) return;
      openLightbox(current);
    });

    if (lightbox) {
      // click outside to close
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // keyboard
    window.onkeydown = function (e) {
      if (!lightbox || !lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    // swipe
    var startX = 0;
    if (lbImg) {
      lbImg.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      lbImg.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
        startX = 0;
      }, { passive: true });
    }

    // ---- 10) Detail modal
    function openDetail() {
      if (!detailModal) return;

      if (detailSub) {
        detailSub.textContent =
          String(product.code) + " • " + rupiah(product.price) + (isSold ? " • SOLD ❌" : "");
      }

      var details = product.detail || [];
      if (detailList) detailList.innerHTML = "";

      if (!Array.isArray(details) || details.length === 0) {
        if (detailEmpty) detailEmpty.style.display = "block";
      } else {
        if (detailEmpty) detailEmpty.style.display = "none";
        for (var j = 0; j < details.length; j++) {
          if (!detailList) break;
          var li = document.createElement("li");
          li.textContent = String(details[j]);
          detailList.appendChild(li);
        }
      }

      detailModal.classList.add("open");
      detailModal.setAttribute("aria-hidden", "false");
    }

    function closeDetail() {
      if (!detailModal) return;
      detailModal.classList.remove("open");
      detailModal.setAttribute("aria-hidden", "true");
    }

    detailBtn = resetNode("detailBtn");
    detailClose = resetNode("detailClose");

    if (detailBtn) detailBtn.addEventListener("click", openDetail);
    if (detailClose) detailClose.addEventListener("click", closeDetail);

    if (detailModal) {
      detailModal.addEventListener("click", function (e) {
        if (e.target === detailModal) closeDetail();
      });
    }
    try{ if(window.__kyuseiRipple) window.__kyuseiRipple(document); }catch(e){}
  };
})();
