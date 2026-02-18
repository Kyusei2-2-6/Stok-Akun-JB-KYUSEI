var SITE_NAME = "Kyusei";
var PRODUCTS = [
  {
    "code": "A002",
    "name": "Genshin A002",
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
    "code": "A003",
    "name": "Genshin A003",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A003/1.jpg"
    ],
    "detail": [
      "Isi detail A003 di sini"
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
    "name": "Mobile Legends B001",
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
    "name": "Toram C001",
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
    "code": "B002",
    "name": "Nama : kimak",
    "game": "ml",
    "price": 10000,
    "sold": false,
    "photos": [
      "assets/products/ml/B002/1.jpg"
    ],
    "detail": [
      "harga segitu work it untuk di beli"
    ]
  },
  {
    "code": "A001",
    "name": "Flins & Navia",
    "game": "genshin",
    "price": 50000,
    "sold": false,
    "photos": [
      "assets/products/genshin/A001/1.jpg"
    ],
    "detail": [
      "ð Server: Asia",
      "ð° AR: 45 (Hold)",
      "â­ Karakter 5â: Navia,Flins,Mona,Diluc",
      "âï¸ Weapon 5â: A thousand floating dreams, Skyward Spine",
      "ð¤ Username: Unset",
      "ð Birthdate (BD): Set (30/12)",
      "ð Note: Baru Ce Gmail fresh"
    ]
  }
];
function rupiah(n) {
  var num = Number(n || 0);
  return "Rp" + String(Math.trunc(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
