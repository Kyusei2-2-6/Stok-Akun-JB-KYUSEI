var SITE_NAME = "Kyusei";
var PRODUCTS = [
  {
    "code": "A002",
    "name": "ACC mid game",
    "game": "genshin",
    "price": 75000,
    "sold": true,
    "photos": [
      "assets/products/genshin/A002/1.jpg",
      "assets/products/genshin/A002/2.jpg",
      "assets/products/genshin/A002/3.jpg",
      "assets/products/genshin/A002/4.jpg",
      "assets/products/genshin/A002/5.jpg"
    ],
    "detail": [
      "Isi detail A002 di sini"
    ]
  },
  {
    "code": "A004",
    "name": "Genshin A004",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A004/1.jpg",
      "assets/products/genshin/A004/2.jpg"
    ],
    "detail": [
      "Isi detail A004 di sini"
    ]
  },
  {
    "code": "A005",
    "name": "Genshin A005",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A005/1.jpg",
      "assets/products/genshin/A005/2.jpg"
    ],
    "detail": [
      "Isi detail A005 di sini"
    ]
  },
  {
    "code": "B001",
    "name": "SEMPAK GUSION",
    "game": "ml",
    "price": 100000000,
    "sold": true,
    "photos": [
      "assets/products/ml/B001/1.png"
    ],
    "detail": [
      "Isi detail B001 di sini"
    ]
  },
  {
    "code": "C001",
    "name": "2 CAP TORAM",
    "game": "toram",
    "price": 0,
    "sold": false,
    "photos": [
      "assets/products/toram/C001/1.jpg",
      "assets/products/toram/C001/2.jpg",
      "assets/products/toram/C001/3.jpg",
      "assets/products/toram/C001/4.jpg",
      "assets/products/toram/C001/5.jpg",
      "assets/products/toram/C001/6.jpg",
      "assets/products/toram/C001/7.jpg",
      "assets/products/toram/C001/8.jpg",
      "assets/products/toram/C001/9.jpg"
    ],
    "detail": [
      "Isi detail C001 di sini"
    ]
  },
  {
    "code": "A001",
    "name": "Flins & navia",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A001/1.jpg",
      "assets/products/genshin/A001/2.jpg",
      "assets/products/genshin/A001/3.jpg",
      "assets/products/genshin/A001/4.jpg",
      "assets/products/genshin/A001/5.jpg",
      "assets/products/genshin/A001/6.jpg",
      "assets/products/genshin/A001/7.jpg"
    ],
    "detail": [
      "Ã°ÂÂÂ Server: Asia",
      "Ã°ÂÂÂ° AR: 45 (Hold)",
      "Ã¢Â­Â Karakter 5Ã¢ÂÂ: Navia,Flins,Mona,Diluc",
      "Ã¢ÂÂÃ¯Â¸Â Weapon 5Ã¢ÂÂ: A thousand floating dreams, Skyward Spine",
      "Ã°ÂÂÂ¤ Username: Unset",
      "Ã°ÂÂÂ Birthdate (BD): Set (30/12)",
      "Ã°ÂÂÂ Note: Baru Ce Gmail fresh"
    ]
  },
  {
    "code": "A003",
    "name": "Starter Zibai",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A003/1.jpg",
      "assets/products/genshin/A003/2.jpg",
      "assets/products/genshin/A003/3.jpg",
      "assets/products/genshin/A003/4.jpg"
    ],
    "detail": [
      "🌐 Server: Asia",
      "🔰 AR: 8",
      "⭐ Karakter 5★: Zibai, Mizuki",
      "⚔️ Weapon 5★: -",
      "👤 Username: Unset",
      "🎂 Birthdate (BD): Unset",
      "📝 Note: Gmail belum ke set"
    ]
  }
];
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
