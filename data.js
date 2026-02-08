/* =========================================================
   Kyusei - Product Data (CLEANED for NEW ASSETS STRUCTURE)
   - Asset mapping based on user list:
     assets/ui/logo.webp
     assets/ui/top.webp
     assets/ui/welcome.webp
     assets/qris/qris.webp
     assets/products/genshin/A001/1.webp.. etc
     assets/products/ml/B001/1.webp
     assets/products/toram/C001/1.webp..9.webp
   ========================================================= */

var SITE_NAME = "Kyusei";

/**
 * PRODUCT schema (dipakai oleh home/product/pay):
 * 
 */
var PRODUCTS = [
  {
    code: "A001",
    name: "Genshin A001",
    game: "genshin",
    price: 50000,
    sold: false,
    photos: [
      "assets/products/genshin/A001/1.webp",
      "assets/products/genshin/A001/2.webp",
      "assets/products/genshin/A001/3.webp"
    ],
    detail: ["Isi detail A001 di sini"]
  },
  {
    code: "A002",
    name: "Genshin A002",
    game: "genshin",
    price: 75000,
    sold: false,
    photos: [
      "assets/products/genshin/A002/1.webp",
      "assets/products/genshin/A002/2.webp",
      "assets/products/genshin/A002/3.webp",
      "assets/products/genshin/A002/4.webp",
      "assets/products/genshin/A002/5.webp"
    ],
    detail: ["Isi detail A002 di sini"]
  },
  {
    code: "A003",
    name: "Genshin A003",
    game: "genshin",
    price: 50000,
    sold: false,
    photos: ["assets/products/genshin/A003/1.webp"],
    detail: ["Isi detail A003 di sini"]
  },
  {
    code: "A004",
    name: "Genshin A004",
    game: "genshin",
    price: 50000,
    sold: false,
    photos: [
      "assets/products/genshin/A004/1.webp",
      "assets/products/genshin/A004/2.webp"
    ],
    detail: ["Isi detail A004 di sini"]
  },
  {
    code: "A005",
    name: "Genshin A005",
    game: "genshin",
    price: 50000,
    sold: false,
    photos: [
      "assets/products/genshin/A005/1.webp",
      "assets/products/genshin/A005/2.webp"
    ],
    detail: ["Isi detail A005 di sini"]
  },

  {
    code: "B001",
    name: "Mobile Legends B001",
    game: "ml",
    price: 0,
    sold: false,
    photos: ["assets/products/ml/B001/1.webp"],
    detail: ["Isi detail B001 di sini"]
  },

  {
    code: "C001",
    name: "Toram C001",
    game: "toram",
    price: 0,
    sold: false,
    photos: [
      "assets/products/toram/C001/1.webp",
      "assets/products/toram/C001/2.webp",
      "assets/products/toram/C001/3.webp",
      "assets/products/toram/C001/4.webp",
      "assets/products/toram/C001/5.webp",
      "assets/products/toram/C001/6.webp",
      "assets/products/toram/C001/7.webp",
      "assets/products/toram/C001/8.webp",
      "assets/products/toram/C001/9.webp"
    ],
    detail: ["Isi detail C001 di sini"]
  }, // ÃÂ¢ÃÂÃÂ koma wajib

  {
    code: "B002",
    game: "ml",
    name: "Metalica",
    price: 0,
    sold: false,
    photos: [
      "https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FB002%2Fmain.jpg?w=900&q=75"
    ],
    detail: [
      "Ketua guild",
      "Anjayani",
      "Ope",
      "Terkuat"
    ]
  },
  {
    code: "B003",
    name: "Muani",
    game: "ml",
    price: 0,
    sold: false,
    photos: ["https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FB003%2F1.jpg?w=900&q=75", "https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FB003%2F2.jpg?w=900&q=75"],
    detail: ["Woilah", "Cik", "Anjayani"],
  },
  {
    code: "A006",
    name: "Flins & navia",
    game: "genshin",
    price: 70000,
    sold: false,
    photos: ["https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FA006%2F1.jpg?w=900&q=75", "https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FA006%2F2.jpg?w=900&q=75", "https://kyusei-edit-bot.maunyolongyaaaa.workers.dev/i/assets%2Fproducts%2FA006%2F3.jpg?w=900&q=75"],
    detail: ["🌐 Server: Asia", "🔰 AR: 45", "⭐ Karakter 5★: Mona,Diluc,Navia,Flins", "⚔️ Weapon 5★: A thousand floating dreams, Skyward", "👤 Username: Unset", "🎂 Birthdate (BD): Set (30/12)", "📝 Note Akun:", "-Pity limit 10 off", "-Pity Wp 13 off"],
  }
];


// =========================
// Helper
// =========================
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
