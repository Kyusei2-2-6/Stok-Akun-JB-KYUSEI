/* =========================================================
   Kyusei - Product Data (RAPIH VERSION)
   - File asli tidak diubah
   - Copy file ini sebagai data.rapih.js / data-v2.js
   ========================================================= */

var SITE_NAME = "Kyusei";

/*
  TEMPLATE PRODUK BARU (copy ini kalau mau nambah produk)
  -------------------------------------------------------
  {
    code: "X001",                         // wajib, unik
    name: "Nama produk",                  // wajib
    game: "genshin" | "toram" | "ml" | "ff", // wajib
    price: 50000,                         // wajib (number)
    sold: true,                           // opsional
    photos: [ "path1", "path2" ],          // wajib (minimal 1)
    detail: [ "baris 1", "baris 2" ]       // opsional tapi disarankan
  }
*/

var PRODUCTS = [
  // ======================================================
  // GENSHIN IMPACT
  // ======================================================
  {
    code: "A001",
    name: "Flins,Navia",
    game: "genshin",
    price: 50000,
    photos: [
      "assets/product/GI/A001-3/A001.jpg",
      "assets/product/GI/A001-3/A002.jpg",
      "assets/product/GI/A001-3/A003.jpg"
    ],
    detail: [
      "🌐 Server: Asia",
      "🔰 AR: 45",
      "⭐ Karakter 5★: Mona, Diluc, Navia, Flins",
      "⚔️ Weapon 5★: A Thousand Floating Dreams, Skyward",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Set (30/12)",
      "📝 Note Akun:",
      "- Pity limit 10 off",
      "- Pity WP 13 off"
    ]
  },

  {
    code: "A002",
    name: "Durin, Diluc, Keqing, Furina",
    game: "genshin",
    price: 75000,
    sold: true,
    photos: [
      "assets/product/GI/A004-8/A004.jpg",
      "assets/product/GI/A004-8/A005.jpg",
      "assets/product/GI/A004-8/A006.jpg",
      "assets/product/GI/A004-8/A007.jpg",
      "assets/product/GI/A004-8/A008.jpg"
    ],
    detail: [
      "🌐 Server: Asia",
      "🔰 AR: 35",
      "⭐ Karakter 5★: Durin, Diluc, Keqing, Furina",
      "⚔️ Weapon 5★: Wolf's Gravestone",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Unset",
      "📝 Note Akun:",
      "- Pity limit -",
      "- Pity WP -",
      "- Low explore"
    ]
  },

  {
    code: "A003",
    name: "STARTER NEFER",
    game: "genshin",
    price: 50000,
    sold: true,
    photos: [
      "assets/product/GI/A009/A009.jpg"
    ],
    detail: [
      "🌐 Server: Asia",
      "🔰 AR: 5",
      "⭐ Karakter 5★: Nefer",
      "⚔️ Weapon 5★: ",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Unset",
      "📝 Note Akun:",
      "- Pity limit -",
      "- Pity WP -"
    ]
  },

   {
    code: "A004",
    name: "STARTER COLUMBINA",
    game: "genshin",
    price: 50000,
    photos: [
      "assets/product/GI/A010-11/A010.jpg",
      "assets/product/GI/A010-11/A011.jpg"
    ],
    detail: [
      "🌐 Server: Asia",
      "🔰 AR: 5",
      "⭐ Karakter 5★: Columbina",
      "⚔️ Weapon 5★: ",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Unset",
      "📝 Note Akun:",
      "- Pity limit -",
      "- Pity WP -"
    ]
  },

   {
    code: "A004",
    name: "STARTER COLUMBINA",
    game: "genshin",
    price: 50000,
    photos: [
      "assets/product/GI/A010-11/A012.jpg",
      "assets/product/GI/A010-11/A013.jpg"
    ],
    detail: [
      "🌐 Server: Asia",
      "🔰 AR: 5",
      "⭐ Karakter 5★: Columbina",
      "⚔️ Weapon 5★: ",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Unset",
      "📝 Note Akun:",
      "- Pity limit -",
      "- Pity WP -"
    ]
  },

  // ======================================================
  // MOBILE LEGENDS
  // ======================================================
  {
    code: "Inden",
    name: "Sempak Gusion",
    game: "ml",
    price: 10000000000000,
    sold: true,
    photos: [
      "assets/product/ML/Inden.png"
    ],
    detail: [
      "Sempak kebanggaan pro pler"
    ]
  },

  // ======================================================
  // TORAM ONLINE
  // ======================================================
  {
    code: "B001",
    name: "AKUN TORAM 2 CAP",
    game: "toram",
    price: 35000,
    photos: [
      "assets/product/TO/B001-9/B001.jpg",
      "assets/product/TO/B001-9/B002.jpg",
      "assets/product/TO/B001-9/B003.jpg",
      "assets/product/TO/B001-9/B004.jpg",
      "assets/product/TO/B001-9/B005.jpg",
      "assets/product/TO/B001-9/B006.jpg",
      "assets/product/TO/B001-9/B007.jpg",
      "assets/product/TO/B001-9/B008.jpg",
      "assets/product/TO/B001-9/B009.jpg"
    ],
    detail: [
      "Akun 2 cap",
      "Build DPS Dual-sword & BS Vit"
    ]
  }
];

// =========================================================
// Helper
// =========================================================
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num))
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}




