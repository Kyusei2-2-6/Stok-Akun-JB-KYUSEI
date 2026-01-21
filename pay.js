var PHONE = "6283863831670"; // format 62..., tanpa +

var params = new URLSearchParams(location.search);
var code = params.get("code") || "";
var item = params.get("item") || "Produk";
var price = params.get("price") || "";

/* =========================
   HELPERS
========================= */
function rupiahSafe(n){
  if (typeof rupiah === "function") return rupiah(n);
  return "Rp" + String(Number(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function resolveAssetUrl(path) {
  try { return new URL(path, document.baseURI).href; }
  catch { return path; }
}

/* =========================
   MUSIC (BGM RESUME) - OPTIONAL
   NOTE: butuh <audio id="bgm"> dan <div id="musicDisc"> di pay.html
========================= */
document.addEventListener("DOMContentLoaded", function () {
  var bgm = document.getElementById("bgm");
  var disc = document.getElementById("musicDisc");

  if (!bgm || !disc) return;

  bgm.volume = 0.2;
  bgm.load();

  // resume kalau sebelumnya playing
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
});

/* =========================
   FIND PRODUCT (optional)
========================= */
var p = null;
if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
  for (var i=0; i<PRODUCTS.length; i++){
    if (PRODUCTS[i].code === code) { p = PRODUCTS[i]; break; }
  }
}

/* =========================
   INFO HEADER
========================= */
var info = document.getElementById("info");
if (info) {
  info.textContent = code + " • " + item + " • " + rupiahSafe(price || 0);
}

/* =========================
   LINK BACK TO PRODUCT
========================= */
var productUrl = code ? ("product.html?code=" + encodeURIComponent(code)) : "./index.html";

var productBtn = document.getElementById("productBtn");
if (productBtn) productBtn.href = productUrl;

var backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.href = productUrl;

/* =========================
   SAVE LAST STATE (resume)
========================= */
localStorage.setItem("lastProductUrl", productUrl);
localStorage.setItem("lastPayUrl", location.href);

/* =========================
   QRIS IMAGE
========================= */
var qrisPath = (p && p.qris) ? p.qris : "qris/qris.jpg";

var qrisImg = document.getElementById("qrisImg");
if (qrisImg) {
  qrisImg.src = resolveAssetUrl(qrisPath);
  qrisImg.alt = "QRIS untuk " + code;

  qrisImg.onerror = function(){
    qrisImg.alt = "QRIS tidak ditemukan: " + qrisPath;
  };
}

/* =========================
   WHATSAPP CONFIRMATION
========================= */
var text =
  "Halo kak, saya sudah bayar QRIS.\n\n" +
  "Kode: " + code + "\n" +
  "Produk: " + item + "\n" +
  "Harga: " + rupiahSafe(price || 0) + "\n\n" +
  "Saya lampirkan bukti transfer ya kak. Terima kasih 🙏";

var wa = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);

var paidBtn = document.getElementById("paidBtn");
if (paidBtn) paidBtn.href = wa;


