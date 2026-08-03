var SITE_NAME = "Kyusei";
var PRODUCTS = [
  {
    "code": "A002",
    "name": "ACC mid game",
    "game": "genshin",
    "price": 75000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "B001",
    "name": "SEMPAK GUSION",
    "game": "ml",
    "price": 100000000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "C001",
    "name": "2 CAP TORAM",
    "game": "toram",
    "price": 30000,
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
      "2 Cap",
      "Dps DS",
      "BS VIT"
    ]
  },
  {
    "code": "A001",
    "name": "Flins & navia",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A003",
    "name": "Starter Zibai",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A004",
    "name": "Starter Zibai",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A005",
    "name": "Starter Colombina",
    "game": "genshin",
    "price": 60000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A006",
    "name": "Starter Colombina",
    "game": "genshin",
    "price": 60000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A007",
    "name": "Starter Zibai",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A008",
    "name": "Starter Zibai",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A009",
    "name": "Starter Neuvillette",
    "game": "genshin",
    "price": 60000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A011",
    "name": "Starter Klee",
    "game": "genshin",
    "price": 150000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A010",
    "name": "Akun End game Cakep",
    "game": "genshin",
    "price": 175000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "B007",
    "name": "Stater skirk",
    "game": "genshin",
    "price": 60000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A012",
    "name": "AKUN END GAME",
    "game": "genshin",
    "price": 175000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "B009",
    "name": "Stater chasca",
    "game": "genshin",
    "price": 50000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A013",
    "name": "Akun End game",
    "game": "genshin",
    "price": 450000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A014",
    "name": "Starter Chasca",
    "game": "genshin",
    "price": 85000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A015",
    "name": "Starter Nicole",
    "game": "genshin",
    "price": 75000,
    "sold": true,
    "photos": [],
    "detail": []
  },
  {
    "code": "A016",
    "name": "END GAME",
    "game": "genshin",
    "price": 200000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A016/1.jpg",
      "assets/products/genshin/A016/2.jpg"
    ],
    "detail": [
      "🌐 Server: Asia",
      "🔰 AR: 55",
      "⭐ Karakter 5★: 8",
      "⚔️ Weapon 5★: 2",
      "👤 Username: unset",
      "🎂 Birthdate (BD):unset",
      "📝 Note: ladang primo masi banyak 😎"
    ]
  },
  {
    "code": "A017",
    "name": "END GAME",
    "game": "genshin",
    "price": 300000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A017/1.jpg",
      "assets/products/genshin/A017/2.jpg"
    ],
    "detail": [
      "🌐 Server: Asia",
      "🔰 AR:  56",
      "⭐ Karakter 5★: 12",
      "⚔️ Weapon 5★: 4",
      "👤 Username: unset",
      "🎂 Birthdate (BD): set (2/2)",
      "📝 Note: meta + ladang masi banyak 😎"
    ]
  }
];
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
