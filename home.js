/* =========================================================
   Kyusei Store - HOME MOBILE PRO
   Aman untuk bot Telegram: tidak mengubah format data.js.
   Logic:
   - READY dan SOLD dipisah jadi section berbeda
   - READY pagination sendiri, SOLD pagination sendiri
   - Sold card pakai cover assets/ui/sold-cover.png
   - Saat diklik tetap masuk detail asli product.js dan foto asli tetap muncul
   ========================================================= */
(function () {
  "use strict";

  var READY_PER_PAGE = 6;
  var SOLD_PER_PAGE = 8;
  var SOLD_COVER = "assets/ui/sold-cover.png";
  var currentGame = "all";
  var query = "";
  var readyPage = 1;
  var soldPage = 1;

  function $(id) { return document.getElementById(id); }
  function txt(v) { return String(v == null ? "" : v); }
  function low(v) { return txt(v).toLowerCase(); }
  function sold(p) { return p && p.sold === true; }

  function gameLabel(game) {
    game = low(game);
    if (game === "genshin") return "Genshin Impact";
    if (game === "toram") return "Toram Online";
    if (game === "ml") return "Mobile Legends";
    return "Game Account";
  }

  function matchGame(p) {
    return currentGame === "all" || low(p.game) === currentGame;
  }

  function matchQuery(p) {
    var q = low(query).trim();
    if (!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(" ") : "";
    var hay = [p.code, p.name, p.game, p.price, detail].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function list() {
    var src = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    return src.filter(function (p) { return matchGame(p) && matchQuery(p); })
      .sort(function (a, b) { return txt(a.code).localeCompare(txt(b.code), "id", { numeric: true }); });
  }

  function saveLast(href) {
    try { localStorage.setItem("lastProductUrl", href); } catch (e) {}
  }

  function coverFor(p) {
    if (sold(p)) return SOLD_COVER;
    return (p.photos && p.photos.length) ? p.photos[0] : "";
  }

  function makeCard(p) {
    var href = "#/product?code=" + encodeURIComponent(p.code);
    var a = document.createElement("a");
    a.className = "productCard " + (sold(p) ? "isSold" : "isReady");
    a.href = href;
    a.addEventListener("click", function () { saveLast(href); });

    var imgWrap = document.createElement("div");
    imgWrap.className = "imgWrap";

    var img = document.createElement("img");
    img.src = coverFor(p);
    img.alt = p.name || "Produk";
    img.loading = "lazy";
    img.onerror = function () {
      // Kalau assets/ui/sold-cover.png belum kamu upload, fallback ke foto asli.
      if (sold(p) && p.photos && p.photos.length) img.src = p.photos[0];
    };

    var badge = document.createElement("span");
    badge.className = "badge " + (sold(p) ? "soldBadge" : "readyBadge");
    badge.textContent = sold(p) ? "SOLD" : "READY";

    imgWrap.appendChild(img);
    imgWrap.appendChild(badge);

    var body = document.createElement("div");
    body.className = "cardBody";
    body.innerHTML =
      "<div class='nameRow'><h3></h3><b></b></div>" +
      "<p class='price'></p>" +
      "<p class='game'></p>";
    body.querySelector("h3").textContent = p.name || "-";
    body.querySelector("b").textContent = p.code || "-";
    body.querySelector(".price").textContent = (typeof rupiah === "function") ? rupiah(p.price) : txt(p.price);
    body.querySelector(".game").textContent = gameLabel(p.game);

    a.appendChild(imgWrap);
    a.appendChild(body);
    return a;
  }

  function emptyBox(text) {
    var div = document.createElement("div");
    div.className = "emptyBox";
    div.innerHTML = "<b>" + text + "</b><small>Coba reset pencarian atau ganti filter game.</small>";
    return div;
  }

  function renderPagination(boxId, infoId, page, totalPages, onGo) {
    var box = $(boxId);
    var info = $(infoId);
    if (info) info.textContent = page + "/" + totalPages;
    if (!box) return;
    box.innerHTML = "";

    if (totalPages <= 1) {
      box.style.display = "none";
      return;
    }
    box.style.display = "flex";

    function btn(label, target, disabled, active) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pageBtn" + (active ? " active" : "");
      b.textContent = label;
      b.disabled = !!disabled;
      b.addEventListener("click", function () {
        if (disabled) return;
        onGo(target);
        window.scrollTo({ top: Math.max(0, document.querySelector(".mainMobile").offsetTop - 8), behavior: "smooth" });
      });
      box.appendChild(b);
    }

    btn("‹", page - 1, page <= 1, false);

    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    }
    var last = 0;
    pages.forEach(function (p) {
      if (p - last > 1) {
        var dots = document.createElement("span");
        dots.className = "pageDots";
        dots.textContent = "…";
        box.appendChild(dots);
      }
      btn(String(p), p, false, p === page);
      last = p;
    });

    btn("›", page + 1, page >= totalPages, false);
  }

  function renderSection(items, gridId, page, perPage, emptyText) {
    var grid = $(gridId);
    if (!grid) return { totalPages: 1 };
    grid.innerHTML = "";
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));
    page = Math.min(Math.max(1, page), totalPages);

    if (!items.length) {
      grid.appendChild(emptyBox(emptyText));
      return { totalPages: totalPages, page: page };
    }

    items.slice((page - 1) * perPage, page * perPage).forEach(function (p, i) {
      var card = makeCard(p);
      card.style.setProperty("--delay", (i * 35) + "ms");
      grid.appendChild(card);
    });
    return { totalPages: totalPages, page: page };
  }

  function render() {
    var all = list();
    var ready = all.filter(function (p) { return !sold(p); });
    var solds = all.filter(sold);

    if ($("statReady")) $("statReady").textContent = ready.length;
    if ($("statSold")) $("statSold").textContent = solds.length;
    if ($("statTotal")) $("statTotal").textContent = all.length;

    var r = renderSection(ready, "readyGrid", readyPage, READY_PER_PAGE, "Belum ada produk ready");
    readyPage = r.page;
    renderPagination("readyPagination", "readyPageInfo", readyPage, r.totalPages, function (p) { readyPage = p; render(); });

    var s = renderSection(solds, "soldGrid", soldPage, SOLD_PER_PAGE, "Belum ada produk sold");
    soldPage = s.page;
    renderPagination("soldPagination", "soldPageInfo", soldPage, s.totalPages, function (p) { soldPage = p; render(); });
  }

  function initDropdown() {
    var btn = $("logoBtn");
    var menu = $("dropdown");
    if (!btn || !menu) return;
    function close() { menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
      menu.setAttribute("aria-hidden", menu.classList.contains("open") ? "false" : "true");
    });
    menu.addEventListener("click", function (e) {
      var item = e.target.closest(".ddItem");
      if (!item) return;
      currentGame = low(item.getAttribute("data-game") || "all");
      readyPage = 1;
      soldPage = 1;
      render();
      close();
    });
    document.addEventListener("click", close);
  }

  function initSearch() {
    var input = $("catalogSearch");
    var clear = $("clearSearch");
    if (!input) return;
    input.addEventListener("input", function () {
      query = input.value || "";
      readyPage = 1;
      soldPage = 1;
      render();
    });
    if (clear) clear.addEventListener("click", function () {
      input.value = "";
      query = "";
      readyPage = 1;
      soldPage = 1;
      render();
      input.focus();
    });
  }

  window.initHome = function () {
    if ($("siteName") && window.SITE_NAME) $("siteName").textContent = window.SITE_NAME;
    document.title = (window.SITE_NAME || "Kyusei") + " Store";
    currentGame = "all";
    query = "";
    readyPage = 1;
    soldPage = 1;
    initDropdown();
    initSearch();
    render();
  };
})();
