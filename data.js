var SITE_NAME = "Kyusei";

/*
  game: "genshin" | "toram" | "ml" | "ff"
  detail: optional (array string)
*/
var PRODUCTS = [
  {
    code: "A001",
    name: "Flins,Navia",
    game: "genshin",
    price: 50000,
    photos: [
      "assets/product/A001.jpg",
      "assets/product/A002.jpg",
      "assets/product/A003.jpg"
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
    code: "Inden",
    name: "Sempak Gusion",
    game: "ml",
    price: 100000000000,
    sold: true,
    photos: [
      "assets/product/Inden.png"
    ],
    detail: [
      "Sempak kebanggaan pro pler"
    ]
  }
];

function rupiah(n){
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num))
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}







