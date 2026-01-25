/* =========================================================
   Kyusei - home.js (was index.js) for HASH SPA
   - Renders grid from PRODUCTS
   - Filter dropdown
   - Resume chips
   - Welcome overlay triggers music (gesture)
   ========================================================= */

(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function showFatal(grid, msg) {
    if (!grid) return;
    grid.innerHTML = "";
    var box = document.createElement("div");
    box.style.padding = "16px";
    box.style.borderRadius = "14px";
    box.style.lineHeight = "1.5";
    box.style.background = "rgba(0,0,0,.25)";
    box.innerHTML =
      "<b>Data katalog gagal dimuat.</b><br>" +
      "<small>" + msg + "</small><br><br>" +
      "<small>Biasanya karena <code>data.js</code> error (koma kurang) atau path foto salah.</small>";
    grid.appendChild(box);
  }

  function sortSoldLast(list) {
    return list.slice().sort(function (a, b) {
      return (a.sold === true) - (b.sold === true);
    });
  }

  function applyStagger() {
    var cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty("--d", (i * 45) + "ms");
    }
  }

  function setResumeLink(el, key) {
    if (!el) return false;
    var url = null;
    try { url = localStorage.getItem(key); } catch (e) {}
    if (!url) return false;
    el.style.display = "flex";
    el.href = url;
    return true;
  }

  function initResumeAutoHide(resumeWrap) {
    if (!resumeWrap) return;
    if (resumeWrap.style.display === "none") return;

    var lastY = window.scrollY || 0;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      var delta = Math.abs(y - lastY);
      if (delta < 8) return;

      if (y < 40) {
        resumeWrap.classList.remove("isHidden");
        lastY = y;
        return;
      }

      if (y > lastY) resumeWrap.classList.add("isHidden");
      else resumeWrap.classList.remove("isHidden");

      lastY = y;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  function render(grid, products) {
    if (!grid) return;
    grid.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var cover = (p.photos && p.photos.length) ? p.photos[0] : "";

      var a = document.createElement("a");
      a.className = "card";
      a.href = "#/product?code=" + encodeURIComponent(p.code);

      (function (url) {
        a.addEventListener("click", function () {
          try { localStorage.setItem("lastProductUrl", url); } catch (e) {}
        });
      })(a.href);

      var img = document.createElement("img");
      img.src = cover;
      img.alt = p.name || "Produk";

      var meta = document.createElement("div");
      meta.className = "meta";

      var nm = document.createElement("p");
      nm.className = "name";
      nm.textContent = p.name || "-";

      if (p.sold === true) {
        var soldTxt = document.createElement("span");
        soldTxt.className = "soldInline";
        soldTxt.textContent = " SOLD ❌";
        nm.appendChild(soldTxt);
        a.classList.add("sold");
      }

      var pr = document.createElement("p");
      pr.className = "price";
      pr.textContent = rupiah(p.price) + " • " + p.code;

      meta.appendChild(nm);
      meta.appendChild(pr);

      a.appendChild(img);
      a.appendChild(meta);

      grid.appendChild(a);
    }

    applyStagger();
  }

  function initDropdown(applyFilter) {
    var logoBtn = $("logoBtn");
    var dropdown = $("dropdown");
    if (!logoBtn || !dropdown) return function () {};

    function openMenu() {
      dropdown.classList.add("open");
      dropdown.setAttribute("aria-hidden", "false");
      logoBtn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      dropdown.classList.remove("open");
      dropdown.setAttribute("aria-hidden", "true");
      logoBtn.setAttribute("aria-expanded", "false");
    }

    logoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains("open")) closeMenu();
      else openMenu();
    });

    dropdown.addEventListener("click", function (e) {
      var item = e.target.closest(".ddItem");
      if (!item) return;
      var game = (item.getAttribute("data-game") || "all").toLowerCase();
      applyFilter(game);
      closeMenu();
    });

    document.addEventListener("click", closeMenu);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    return closeMenu;
  }

  function initWelcome() {
    var overlay = $("welcomeOverlay");
    var welcomeBtn = $("welcomeBtn");
    if (!overlay || !welcomeBtn) return;

    var card = overlay.querySelector(".welcome-card");

    function showWelcome() {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
      welcomeBtn.disabled = false;
    }

    function hideWelcome() {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
    }

    if (!sessionStorage.getItem("welcome_seen")) showWelcome();
    else hideWelcome();

    function startMusicAfterGesture() {
      if (!window.__kyuseiMusic) return;
      window.__kyuseiMusic.play().catch(function () {
        // still blocked: user can click disc
      });
    }

    function closeWelcomeAnimated() {
      if (welcomeBtn.disabled) return;
      welcomeBtn.disabled = true;

      overlay.setAttribute("aria-hidden", "true");
      sessionStorage.setItem("welcome_seen", "1");

      var dur = 420;

      if (card && card.animate) {
        card.animate(
          [
            { opacity: 1, transform: "translateY(0) scale(1)" },
            { opacity: 0, transform: "translateY(-40px) scale(.96)" }
          ],
          { duration: dur, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" }
        );
      }

      if (overlay.animate) {
        overlay.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: dur, easing: "ease", fill: "forwards" }
        );
      }

      setTimeout(function () {
        hideWelcome();
        startMusicAfterGesture();
      }, dur);
    }

    welcomeBtn.addEventListener("click", closeWelcomeAnimated);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeWelcomeAnimated();
    });

    window.addEventListener("pageshow", function () {
      if (!sessionStorage.getItem("welcome_seen")) showWelcome();
    });
  }

  // Exposed init for router
  window.initHome = function () {
    var grid = $("grid");

    // guards
    if (typeof SITE_NAME === "undefined") return showFatal(grid, "SITE_NAME tidak terbaca.");
    if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) return showFatal(grid, "PRODUCTS tidak terbaca / bukan array.");
    if (typeof rupiah !== "function") return showFatal(grid, "Fungsi rupiah() tidak terbaca.");

    // title
    var siteNameEl = $("siteName");
    if (siteNameEl) siteNameEl.textContent = SITE_NAME;
    document.title = SITE_NAME;

    // resume chips
    var resumeWrap = $("resumeWrap");
    var resumeProduct = $("resumeProduct");
    var resumePay = $("resumePay");

    var hasProduct = setResumeLink(resumeProduct, "lastProductUrl");
    var hasPay = setResumeLink(resumePay, "lastPayUrl");

    if (resumeWrap) resumeWrap.style.display = (hasProduct || hasPay) ? "flex" : "none";
    initResumeAutoHide(resumeWrap);

    // filter + render
    var currentGame = "all";

    function applyFilter(game) {
      currentGame = game || currentGame || "all";
      var list = [];
      if (currentGame === "all") list = PRODUCTS.slice();
      else {
        for (var i = 0; i < PRODUCTS.length; i++) {
          var g = (PRODUCTS[i].game || "").toLowerCase();
          if (g === currentGame) list.push(PRODUCTS[i]);
        }
      }
      render(grid, sortSoldLast(list));
    }

    initDropdown(applyFilter);
    initWelcome();
    applyFilter(currentGame);

    // rebind disc (page swapped)
    if (window.__kyuseiMusic) window.__kyuseiMusic.rebind();
  };
})();
