var PHONE = "6283863831670"; // <-- GANTI nomor WA kamu (format 62..., tanpa +)

var params = new URLSearchParams(location.search);
var code = params.get("code") || "";
var item = params.get("item") || "Produk";
var price = params.get("price") || "";

function rupiahSafe(n){
  // kalau data.js punya rupiah(), pakai itu
  if (typeof rupiah === "function") return rupiah(n);
  return "Rp" + String(Number(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// cari produk dari PRODUCTS (kalau ada)
var p = null;
if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
  for (var i=0; i<PRODUCTS.length; i++){
    if (PRODUCTS[i].code === code) { p = PRODUCTS[i]; break; }
  }
}

// info header
var info = document.getElementById("info");
info.textContent = code + " • " + item + " • " + rupiahSafe(price || 0);

// tombol balik ke produk yang benar
var productUrl = code ? ("product.html?code=" + encodeURIComponent(code)) : "./index.html";
document.getElementById("productBtn").href = productUrl;
document.getElementById("backBtn").href = productUrl;

// simpan posisi terakhir (anti reset)
localStorage.setItem("lastProductUrl", productUrl);
localStorage.setItem("lastPayUrl", location.href);

// QRIS: ambil dari data.js kalau ada, kalau tidak fallback ke rule lama
var qrisPath = (p && p.qris) ? p.qris : ("qris/" + code + ".jpg");

var qrisImg = document.getElementById("qrisImg");
qrisImg.src = qrisPath;
qrisImg.alt = "QRIS untuk " + code;

qrisImg.onerror = function(){
  qrisImg.alt = "QRIS tidak ditemukan: " + qrisPath;
};

// WhatsApp konfirmasi
var text =
  "Halo kak, saya sudah bayar QRIS.\n\n" +
  "Kode: " + code + "\n" +
  "Produk: " + item + "\n" +
  "Harga: " + price + "\n\n" +
  "sertakan bukti transfer;";
var wa = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);

document.getElementById("paidBtn").href = wa;
