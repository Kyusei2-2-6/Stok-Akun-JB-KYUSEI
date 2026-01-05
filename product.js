/* =========================
   GET PRODUCT CODE
========================= */
const params = new URLSearchParams(location.search);
const code = params.get("code");

/* =========================
   FIND PRODUCT
========================= */
const product = PRODUCTS.find(p => p.code === code);

if (!product) {
  document.body.innerHTML = `
    <div style="padding:16px">
      Produk tidak ditemukan.
      <a href="./index.html">Kembali</a>
    </div>
  `;
  throw new Error("Product not found");
}

/* =========================
   HELPERS
========================= */
function resolveAssetUrl(path) {
  try { return new URL(path, document.baseURI).href; }
  catch { return path; }
}

/* =========================
   MUSIC (BGM RESUME) - OPTIONAL (aman kalau element ga ada)
   NOTE: butuh <audio id="bgm"> dan <div id="musicDisc"> di product.html
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const disc = document.getElementById("musicDisc");

  if (!bgm || !disc) return;

  bgm.volume = 0.2;
  bgm.load();

  // resume kalau sebelumnya playing
  if (localStorage.getItem("bgm_playing") === "1") {
    bgm.play().then(() => disc.classList.add("playing"))
      .catch(() => disc.classList.remove("playing"));
  }

  bgm.addEventListener("play", () => {
    localStorage.setItem("bgm_playing", "1");
    disc.classList.add("playing");
  });

  bgm.addEventListener("pause", () => {
    localStorage.setItem("bgm_playing", "0");
    disc.classList.remove("playing");
  });

  disc.addEventListener("click", async () => {
    try {
      if (bgm.paused) await bgm.play();
      else bgm.pause();
    } catch (e) {
      alert("Audio tidak bisa diputar. Pastikan file ada di ./assets/bgm.mp3");
      console.log(e);
    }
  });
});

/* =========================
   INIT PAGE
========================= */
document.title = `${product.name} - ${SITE_NAME}`;

const prodName = document.getElementById("prodName");
const prodMeta = document.getElementById("prodMeta");
const heroImg  = document.getElementById("heroImg");
const thumbs   = document.getElementById("thumbs");

const buyBtn  = document.getElementById("buyBtn");
const buyBtn2 = document.getElementById("buyBtn2");

/* simpan produk terakhir (anti reset) */
const productUrl = `product.html?code=${encodeURIComponent(product.code)}`;
localStorage.setItem("lastProductUrl", productUrl);
localStorage.setItem("lastProductCode", product.code);

prodName.textContent = product.name;
prodMeta.textContent = `${product.code} • ${rupiah(product.price)} • ${(product.photos?.length || 0)} foto`;

/* =========================
   SOLD LOGIC
========================= */
const isSold = (product.sold === true);
let payUrl = null;

/* apply class SOLD biar CSS konsisten */
const hero = document.querySelector(".hero");

if (isSold) {
  hero?.classList.add("sold");
  buyBtn?.remove();
  buyBtn2?.remove();
  prodMeta.textContent += " • SOLD ❌";
} else {
  /* =========================
     BUY / PAY URL (hanya kalau belum sold)
  ========================= */
  payUrl =
    `pay.html?code=${encodeURIComponent(product.code)}` +
    `&item=${encodeURIComponent(product.name)}` +
    `&price=${encodeURIComponent(String(product.price))}`;

  if (buyBtn) buyBtn.href = payUrl;
  if (buyBtn2) buyBtn2.href = payUrl;

  // simpan pembayaran terakhir saat tombol beli diklik
  const saveLastPay = () => {
    localStorage.setItem("lastPayUrl", payUrl);
  };
  buyBtn?.addEventListener("click", saveLastPay);
  buyBtn2?.addEventListener("click", saveLastPay);
}

/* =========================
   IMAGES
========================= */
const photos = Array.isArray(product.photos) ? product.photos : [];
let current = 0;

function setHero(idx) {
  if (!photos.length) return;
  current = (idx + photos.length) % photos.length;
  heroImg.src = resolveAssetUrl(photos[current]);
  heroImg.alt = `${product.name} ${current + 1}`;
}

if (photos.length) {
  setHero(0);
} else {
  heroImg.removeAttribute("src");
  heroImg.alt = "Tidak ada foto";
}

/* =========================
   THUMBNAILS
========================= */
thumbs.innerHTML = "";

photos.forEach((src, index) => {
  const img = document.createElement("img");
  img.src = resolveAssetUrl(src);
  img.alt = `${product.name} ${index + 1}`;

  // sold thumbnails ikut efek (CSS: .thumbs img.soldThumb)
  if (isSold) img.classList.add("soldThumb");

  img.addEventListener("click", () => {
    setHero(index);
    openLightbox(index);
  });

  thumbs.appendChild(img);
});

/* =========================
   LIGHTBOX
========================= */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const lbClose = document.getElementById("lbClose");

/* sold: lightbox ikut treatment juga (CSS: .lightbox.sold .lbImg) */
if (isSold) {
  lightbox?.classList.add("sold");
}

function renderLightbox() {
  if (!photos.length) return;
  lbImg.src = resolveAssetUrl(photos[current]);
  lbCaption.textContent = `${product.name} • ${current + 1} / ${photos.length}`;
}

function openLightbox(idx) {
  if (!photos.length) return;
  current = idx;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  renderLightbox();
}

function closeLightbox() {
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

/* =========================
   EVENTS
========================= */
lbPrev?.addEventListener("click", prev);
lbNext?.addEventListener("click", next);
lbClose?.addEventListener("click", closeLightbox);

document.getElementById("openLightboxBtn")?.addEventListener("click", () => {
  if (!photos.length) return;
  openLightbox(current);
});

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* keyboard */
window.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

/* swipe (mobile) */
let startX = 0;

lbImg?.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

lbImg?.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) {
    dx < 0 ? next() : prev();
  }
  startX = 0;
}, { passive: true });

/* =========================
   DETAIL MODAL
========================= */
const detailBtn = document.getElementById("detailBtn");
const detailModal = document.getElementById("detailModal");
const detailClose = document.getElementById("detailClose");
const detailSub = document.getElementById("detailSub");
const detailList = document.getElementById("detailList");
const detailEmpty = document.getElementById("detailEmpty");

function openDetail() {
  detailSub.textContent = `${product.code} • ${rupiah(product.price)}${isSold ? " • SOLD ❌" : ""}`;

  const details = product.detail || [];
  detailList.innerHTML = "";

  if (!Array.isArray(details) || details.length === 0) {
    detailEmpty.style.display = "block";
  } else {
    detailEmpty.style.display = "none";
    details.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      detailList.appendChild(li);
    });
  }

  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  detailModal.classList.remove("open");
  detailModal.setAttribute("aria-hidden", "true");
}

if (detailBtn && detailModal) {
  detailBtn.addEventListener("click", openDetail);
  detailClose?.addEventListener("click", closeDetail);

  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeDetail();
  });

  window.addEventListener("keydown", (e) => {
    if (!detailModal.classList.contains("open")) return;
    if (e.key === "Escape") closeDetail();
  });
}
