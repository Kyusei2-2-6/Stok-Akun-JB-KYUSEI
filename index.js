document.title = SITE_NAME;
document.getElementById("siteName").textContent = SITE_NAME;

var grid = document.getElementById("grid");

// tombol resume (anti reset)
var resumeProduct = document.getElementById("resumeProduct");
var resumePay = document.getElementById("resumePay");

var lastProductUrl = localStorage.getItem("lastProductUrl");
if (lastProductUrl && resumeProduct) {
  resumeProduct.style.display = "flex";   // lebih cocok buat resumeChip
  resumeProduct.href = lastProductUrl;
}

var lastPayUrl = localStorage.getItem("lastPayUrl");
if (lastPayUrl && resumePay) {
  resumePay.style.display = "flex";       // lebih cocok buat resumeChip
  resumePay.href = lastPayUrl;
}

/* =========================
   SORT: SOLD DI PALING BELAKANG
========================= */
function sortSoldLast(list) {
  return list.slice().sort(function (a, b) {
    return (a.sold === true) - (b.sold === true); // ready(0) dulu, sold(1) belakangan
  });
}

/* =========================
   STAGGER HELPER
========================= */
function applyStagger() {
  var cards = document.querySelectorAll(".card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.setProperty("--d", (i * 45) + "ms");
  }
}

/* =========================
   RENDER GRID
========================= */
function render(products) {
  grid.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var cover = (p.photos && p.photos.length) ? p.photos[0] : "";

    var a = document.createElement("a");
    a.className = "card";
    a.href = "product.html?code=" + encodeURIComponent(p.code);

    // simpan produk terakhir saat diklik
    a.addEventListener("click", (function (url) {
      return function () {
        localStorage.setItem("lastProductUrl", url);
      };
    })(a.href));

    var img = document.createElement("img");
    img.src = cover;
    img.alt = p.name;

    var meta = document.createElement("div");
    meta.className = "meta";

    var nm = document.createElement("p");
    nm.className = "name";
    nm.textContent = p.name;

    // SOLD inline di samping nama
    if (p.sold === true) {
      var soldTxt = document.createElement("span");
      soldTxt.className = "soldInline";
      soldTxt.textContent = " SOLD ❌";
      nm.appendChild(soldTxt);
      a.classList.add("sold"); // biar grayscale jalan
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

  // biar animasi card pasti kebagian setelah render
  applyStagger();
}

/* =========================
   FILTER + APPLY (PASTI LEWAT SORT)
========================= */
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

  // sold selalu di belakang
  render(sortSoldLast(list));
}

applyFilter();

/* =========================
   LOGO DROPDOWN MENU
========================= */
var logoBtn = document.getElementById("logoBtn");
var dropdown = document.getElementById("dropdown");

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

if (logoBtn && dropdown) {
  logoBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (dropdown.classList.contains("open")) closeMenu();
    else openMenu();
  });

  dropdown.addEventListener("click", function (e) {
    var item = e.target.closest(".ddItem");
    if (!item) return;

    currentGame = item.getAttribute("data-game") || "all";
    applyFilter();
    closeMenu();
  });

  document.addEventListener("click", function () {
    closeMenu();
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
}

/* =========================
   MUSIC DISC (PLAY/PAUSE) + RESUME LINTAS HALAMAN
========================= */
document.addEventListener("DOMContentLoaded", function () {
  var bgm = document.getElementById("bgm");
  var disc = document.getElementById("musicDisc");

  if (!bgm || !disc) return;

  bgm.volume = 0.2;
  bgm.load();

  // kalau sebelumnya user nyalain musik, coba lanjutkan
  if (localStorage.getItem("bgm_playing") === "1") {
    bgm.play().then(function () {
      disc.classList.add("playing");
    }).catch(function () {
      // autoplay bisa diblokir, normal
      disc.classList.remove("playing");
    });
  }

  // sync class playing
  bgm.addEventListener("play", function () {
    localStorage.setItem("bgm_playing", "1");
    disc.classList.add("playing");
  });

  bgm.addEventListener("pause", function () {
    localStorage.setItem("bgm_playing", "0");
    disc.classList.remove("playing");
  });

  // klik disc = toggle
  disc.addEventListener("click", function () {
    if (bgm.paused) {
      bgm.play().catch(function () {
        alert("Audio tidak bisa diputar. Pastikan file ada di ./assets/bgm.mp3");
      });
    } else {
      bgm.pause();
    }
  });
});

/* =========================
   WELCOME OVERLAY (MUNCUL TIAP BUKA WEB) + AUTO MUSIC
========================= */
document.addEventListener("DOMContentLoaded", function () {
  var overlay = document.getElementById("welcomeOverlay");
  var btn = document.getElementById("welcomeBtn");
  var bgm = document.getElementById("bgm");

  if (!overlay || !btn) return;

  if (!sessionStorage.getItem("welcome_seen")) {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
  }

  var closeWelcome = async function () {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    sessionStorage.setItem("welcome_seen", "1");

    // nyalain musik setelah klik (user gesture)
    if (bgm) {
      try {
        bgm.volume = 0.2;
        await bgm.play();
        localStorage.setItem("bgm_playing", "1");
      } catch (e) {
        console.log("Music blocked:", e);
      }
    }
  };

  btn.addEventListener("click", closeWelcome);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeWelcome();
  });

  // kalau balik dari cache (HP suka begitu), tetap pastikan welcome muncul kalau belum klik
  window.addEventListener("pageshow", function () {
    if (!sessionStorage.getItem("welcome_seen")) {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
    }
  });
});




