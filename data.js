/* =========================================================
   Kyusei - Product Data (CLEANED for NEW ASSETS STRUCTURE)
   - Asset mapping based on user list:
     assets/ui/logo.jpg
     assets/ui/top.jpg
     assets/ui/welcome.png
     assets/qris/qris.jpg
     assets/products/genshin/A001/1.jpg.. etc
     assets/products/ml/B001/1.jpg
     assets/products/toram/C001/1.jpg..9.jpg
   ========================================================= */

var SITE_NAME = "Kyusei";

/**
 * PRODUCT schema (dipakai oleh home/product/pay):
 * {
 *   code: "A001",
 *   name: "Nama Produk",
 *   game: "genshin" | "ml" | "toram",
 *   price: number,
 *   sold?: boolean,
 *   photos: string[],
 *   detail?: string[],
 *   qris?: string   // optional: path QRIS khusus produk, default = assets/qris/qris.jpg
 * }
 */
var PRODUCTS = [
  {
    "code": "B002",
    "name": "J",
    "game": "ml",
    "price": 1,
    "sold": false,
    "photos": [
      "assets/products/ml/B002/1.jpg"
    ],
    "detail": [
      "Anjai"
    ]
  }
];

// =========================
// Helper
// =========================
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
