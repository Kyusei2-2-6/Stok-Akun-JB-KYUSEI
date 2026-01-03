document.title = SITE_NAME;
document.getElementById("siteName").textContent = SITE_NAME;

var grid = document.getElementById("grid");

// tombol resume (anti reset)
var resumeProduct = document.getElementById("resumeProduct");
var resumePay = document.getElementById("resumePay");

var lastProductUrl = localStorage.getItem("lastProductUrl");
if (lastProductUrl && resumeProduct) {
  resumeProduct.style.display = "inline-flex";
  resumeProduct.href = lastProductUrl;
}

var lastPayUrl = localStorage.getItem("lastPayUrl");
if (lastPayUrl && resumePay) {
  resumePay.style.display = "inline-flex";
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

  // ini kunci: sold selalu di belakang
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

// ===== WELCOME OVERLAY (MUNCUL TIAP BUKA WEB) + AUTO MUSIC =====
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("welcomeOverlay");
  const btn = document.getElementById("welcomeBtn");
  const bgm = document.getElementById("bgm");

  if (!overlay || !btn) return;

  // MUNCUL TIAP BUKA WEB (per tab/session)
  // sessionStorage akan hilang saat tab/browser ditutup
  if (!sessionStorage.getItem("welcome_seen")) {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
  }

  const closeWelcome = async () => {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    sessionStorage.setItem("welcome_seen", "1");

    // BONUS: nyalain musik pas klik "Masuk" (diizinkan browser karena user gesture)
    if (bgm) {
      try {
        bgm.volume = 0.2;
        await bgm.play();
        localStorage.setItem("bgm_playing", "1"); // supaya auto-resume di halaman lain
      } catch (e) {
        console.log("Music blocked:", e);
      }
    }
  };

  btn.addEventListener("click", closeWelcome);

  // klik area gelap untuk tutup juga
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeWelcome();
  });

  // kalau balik dari cache (HP suka begitu), tetap pastikan welcome muncul kalau belum klik Masuk
  window.addEventListener("pageshow", () => {
    if (!sessionStorage.getItem("welcome_seen")) {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
    }
  });
});

// ===== STAGGER ANIMATION FOR CARDS =====
document.addEventListener("DOMContentLoaded", () => {
  const applyStagger = () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
      card.style.setProperty("--d", `${i * 45}ms`); // 45ms per card
    });
  };

  // jalankan sekali saat load
  applyStagger();

  // kalau grid kamu dirender ulang oleh filter/dropdown, panggil lagi:
  // (aman walau tidak ada)
  const grid = document.getElementById("grid");
  if (grid) {
    const obs = new MutationObserver(() => applyStagger());
    obs.observe(grid, { childList: true, subtree: false });
  }
});




