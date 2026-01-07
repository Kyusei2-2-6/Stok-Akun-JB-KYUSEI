/* =========================
   Kyusei - index.js (FINAL)
   - SOLD selalu di belakang
   - Resume produk & pembayaran (BOTTOM BAR)
     * Bar otomatis muncul kalau salah satu tersedia
     * Auto-hide: scroll turun sembunyi, scroll naik muncul
   - Dropdown filter game
   - Music disc play/pause + resume lintas halaman
   - Welcome overlay: animasi exit saat klik "Masuk"
========================= */

(function () {
  "use strict";

  // --------------------------
  // SAFE DOM GETTERS
  // --------------------------
  function $(id) { return document.getElementById(id); }

  // --------------------------
  // SET TITLE / BRAND
  // --------------------------
  document.title = SITE_NAME;
  var siteNameEl = $("siteName");
  if (siteNameEl) siteNameEl.textContent = SITE_NAME;

  // --------------------------
  // DOM NODES
  // --------------------------
  var grid = $("grid");

  // resume (bottom bar)
  var resumeWrap = $("resumeWrap");
  var resumeProduct = $("resumeProduct");
  var resumePay = $("resumePay");

  // dropdown
  var logoBtn = $("logoBtn");
  var dropdown = $("dropdown");

  // audio
  var bgm = $("bgm");
  var disc = $("musicDisc");

  // welcome overlay
  var overlay = $("welcomeOverlay");
  var welcomeBtn = $("welcomeBtn");

  // --------------------------
  // RESUME LINKS (ANTI RESET)
  // --------------------------
  function setResumeLink(el, key) {
    if (!el) return false;
    var url = null;
    try { url = localStorage.getItem(key); } catch (e) {}
    if (!url) return false;
    el.style.display = "flex";
    el.href = url;
    return true;
  }

  var hasProduct = setResumeLink(resumeProduct, "lastProductUrl");
  var hasPay = setResumeLink(resumePay, "lastPayUrl");

  // bar hanya muncul kalau ada minimal 1 resume
  function updateResumeBar() {
    if (!resumeWrap) return;
    if (hasProduct || hasPay) {
      resumeWrap.style.display = "flex";
    } else {
      resumeWrap.style.display = "none";
    }
  }

  updateResumeBar();

  // --------------------------
  // AUTO HIDE RESUME BAR
  // --------------------------
  function initResumeAutoHide() {
    if (!resumeWrap) return;
    // kalau bar tidak tampil, skip
    if (resumeWrap.style.display === "none") return;

    var lastY = window.scrollY || 0;
    var ticking = false;

    function update() {
      ticking = false;

      var y = window.scrollY || 0;
      var delta = Math.abs(y - lastY);
      if (delta < 8) return;

      // dekat atas: selalu tampil
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

  // --------------------------
  // SORT SOLD LAST
  // --------------------------
  function sortSoldLast(list) {
    return list.slice().sort(function (a, b) {
      return (a.sold === true) - (b.sold === true);
    });
  }

  // --------------------------
  // STAGGER ANIMATION DELAY
  // --------------------------
  function applyStagger() {
    var cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty("--d", (i * 45) + "ms");
    }
  }

  // --------------------------
  // RENDER GRID
  // --------------------------
  function render(products) {
    if (!grid) return;

    grid.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var cover = (p.photos && p.photos.length) ? p.photos[0] : "";

      var a = document.createElement("a");
      a.className = "card";
      a.href = "product.html?code=" + encodeURIComponent(p.code);

      // simpan produk terakhir saat diklik
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

      // SOLD inline
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

  // --------------------------
  // FILTER
  // --------------------------
  var currentGame = "all";

  function applyFilter() {
    var list = [];

    if (currentGame === "all") {
      list = PRODUCTS.slice();
    } else {
      for (var i = 0; i < PRODUCTS.length; i++) {
        var g = (PRODUCTS[i].game || "").toLowerCase();
        if (g === currentGame) list.push(PRODUCTS[i]);
      }
    }

    render(sortSoldLast(list));
  }

  // pertama render
  applyFilter();

  // --------------------------
  // DROPDOWN MENU
  // --------------------------
  function openMenu() {
    if (!dropdown || !logoBtn) return;
    dropdown.classList.add("open");
    dropdown.setAttribute("aria-hidden", "false");
    logoBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!dropdown || !logoBtn) return;
    dropdown.classList.remove("open");
    dropdown.setAttribute("aria-hidden", "true");
    logoBtn.setAttribute("aria-expanded", "false");
  }

  if (logoBtn && dropdown) {
    logoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains("open")) closeMenu();
      else openMenu();
    });

    dropdown.addEventListener("click", function (e) {
      var item = e.target.closest(".ddItem");
      if (!item) return;

      currentGame = (item.getAttribute("data-game") || "all").toLowerCase();
      applyFilter();
      closeMenu();
    });

    document.addEventListener("click", closeMenu);

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // --------------------------
  // MUSIC DISC (PLAY/PAUSE) + RESUME
  // --------------------------
  function initMusic() {
    if (!bgm || !disc) return;

    bgm.volume = 0.2;
    bgm.load();

    // resume kalau sebelumnya nyala
    if (localStorage.getItem("bgm_playing") === "1") {
      bgm.play().then(function () {
        disc.classList.add("playing");
      }).catch(function () {
        disc.classList.remove("playing");
      });
    }

    bgm.addEventListener("play", function () {
      try { localStorage.setItem("bgm_playing", "1"); } catch (e) {}
      disc.classList.add("playing");
    });

    bgm.addEventListener("pause", function () {
      try { localStorage.setItem("bgm_playing", "0"); } catch (e) {}
      disc.classList.remove("playing");
    });

    disc.addEventListener("click", function () {
      if (bgm.paused) {
        bgm.play().catch(function () {
          alert("Audio tidak bisa diputar. Pastikan file ada di ./assets/bgm.mp3");
        });
      } else {
        bgm.pause();
      }
    });
  }

  // --------------------------
  // WELCOME OVERLAY (ANIMATED EXIT) + AUTO MUSIC
  // --------------------------
  function initWelcome() {
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

    // tampilkan kalau belum pernah klik (per tab session)
    if (!sessionStorage.getItem("welcome_seen")) {
      showWelcome();
    } else {
      hideWelcome();
    }

    async function startMusicAfterGesture() {
      if (!bgm) return;
      try {
        bgm.volume = 0.2;
        await bgm.play();
        localStorage.setItem("bgm_playing", "1");
      } catch (e) {
        console.log("Music blocked:", e);
      }
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
      if (!sessionStorage.getItem("welcome_seen")) {
        showWelcome();
      }
    });
  }

  // --------------------------
  // BOOT
  // --------------------------
  document.addEventListener("DOMContentLoaded", function () {
    initMusic();
    initWelcome();
    initResumeAutoHide();
  });

})();
