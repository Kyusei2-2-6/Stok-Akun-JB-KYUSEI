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
   SOLD LOGIC (tombol beli hilang)
========================= */
if (product.sold === true) {
  buyBtn?.remove();
  buyBtn2?.remove();
  prodMeta.textContent += " • SOLD ❌";
} else {
  /* =========================
     BUY / PAY URL (hanya kalau belum sold)
  ========================= */
  const payUrl =
    `pay.html?code=${encodeURIComponent(product.code)}` +
    `&item=${encodeURIComponent(product.name)}` +
    `&price=${encodeURIComponent(String(product.price))}`;

  if (buyBtn) buyBtn.href = payUrl;
  if (buyBtn2) buyBtn2.href = payUrl;
}


