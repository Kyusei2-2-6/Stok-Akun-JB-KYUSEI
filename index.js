/* =========================
   Kyusei - index.js (REWRITE)
   - tetap pakai SOURCE/path yang sama
   - SOLD selalu di belakang
   - Resume (produk & pembayaran)
   - Dropdown filter game
   - Music disc play/pause + resume lintas halaman
   - Welcome overlay + anim close (butuh CSS .closing)
========================= */

(function () {
  "use strict";

  // ---------- SAFE SET TITLE ----------
  document.title = SITE_NAME;
  var siteNameEl = document.getElementById("siteName");
  if (siteNameEl) siteNameEl.textContent = SITE_NAME;

  // ---------- DOM ----------
  var grid = document.getElementById("grid");

  // resume
  var resumeProduct = document.getElementById("resumeProduct");
  var resumePay = document.getElementById("resumePay");

  // dropdown
  var logoBtn = document.getElementById("logoBtn");
  var dropdown = document.getElementById("dropdown");

  // audio
  var bgm = document.getElementById("bgm");
  var disc = document.getElementById("musicDisc");

  // welcome
  var overlay = document.getElementById("welcomeOverlay");
  var welcomeBtn = document.getElementById("welcomeBtn");

  // ---------- HELPERS ----------
  function setResumeLink(el, key) {
    if (!el) return;
    var url = localStorage.getItem(key);
    if (!url) return;
    el.style.display = "flex";
    el.href = url;
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

  function saveLastProduct(url) {
    try {
      localStorage.setItem("lastProductUrl", url);
    } catch (e) {}
  }

  // ---------- RESUME INIT ----------
  setResumeLink(resumeProduct, "lastProductUrl");
  setResumeLink(resumePay, "lastPayUrl");

  // ---------- RENDER GRID ----------
  function render(products) {
    if (!grid) return;

    grid.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var cover = (p.photos && p.photos.length) ? p.photos[0] : "";

      var a = document.createElement("a");
      a.className = "card";
      a.href = "product.html?code=" + encodeURIComponent(p.code);

      a.addEventListener("click", (function (url) {
        return function () {
          saveLastProduct(url);
        };
      })(a.href));

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

  // ---------- FILTER ----------
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

  applyFilter();

  // ---------- DROPDOWN MENU ----------
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

  // ---------- MUSIC DISC ----------
  function initMusic() {
    if (!bgm || !disc) return;

    bgm.volume = 0.2;
    bgm.load();

    // resume dari status sebelumnya
    if (localStorage.getItem("bgm_playing") === "1") {
      bgm.play().then(function () {
        disc.classList.add("playing");
      }).catch(function () {
        disc.classList.remove("playing");
      });
    }

    bgm.addEventListener("play", function () {
      localStorage.setItem("bgm_playing", "1");
      disc.classList.add("playing");
    });

    bgm.addEventListener("pause", function () {
      localStorage.setItem("bgm_playing", "0");
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

  // ---------- WELCOME OVERLAY + ANIM CLOSE ----------
  function initWelcome() {
    if (!overlay || !welcomeBtn) return;

    function showWelcome() {
      overlay.classList.add("show");
      overlay.classList.remove("closing");
      overlay.setAttribute("aria-hidden", "false");
    }

    function hideWelcomeInstant() {
      overlay.classList.remove("show");
      overlay.classList.remove("closing");
      overlay.setAttribute("aria-hidden", "true");
    }

    async function closeWelcome() {
      if (overlay.classList.contains("closing")) return;

      // start anim close (butuh CSS .welcome-overlay.closing)
      overlay.classList.add("closing");
      overlay.setAttribute("aria-hidden", "true");
      sessionStorage.setItem("welcome_seen", "1");

      // start music after user gesture
      if (bgm) {
        try {
          bgm.volume = 0.2;
          await bgm.play();
          localStorage.setItem("bgm_playing", "1");
        } catch (e) {
          console.log("Music blocked:", e);
        }
      }

      // tunggu anim selesai
      setTimeout(function () {
        hideWelcomeInstant();
      }, 380);
    }

    if (!sessionStorage.getItem("welcome_seen")) showWelcome();
    else hideWelcomeInstant();

    welcomeBtn.addEventListener("click", closeWelcome);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeWelcome();
    });

    // HP kadang balik dari BFCache
    window.addEventListener("pageshow", function () {
      if (!sessionStorage.getItem("welcome_seen")) showWelcome();
    });
  }

  // ---------- BOOT ----------
  document.addEventListener("DOMContentLoaded", function () {
    initMusic();
    initWelcome();
  });

})();
