/* =========================================================
   Kyusei Store - home.js (PRO GRID + PAGINATION)
   Aman untuk sistem bot Telegram: tidak mengubah data.js.
   Fitur:
   - READY selalu di atas, SOLD di bawah
   - Separator READY / SOLD
   - Pagination 8 item per halaman
   - Search nama/kode/detail
   - Filter game tetap pakai dropdown logo
   - Statistik kecil: ready, sold, total
   ========================================================= */
(function () {
  "use strict";

  var ITEMS_PER_PAGE = 8;
  var currentGame = "all";
  var currentPage = 1;
  var currentQuery = "";
  var currentList = [];

  function $(id) { return document.getElementById(id); }

  function safeText(value) {
    return String(value == null ? "" : value);
  }

  function lower(value) {
    return safeText(value).toLowerCase();
  }

  function showFatal(grid, msg) {
    if (!grid) return;
    grid.innerHTML = "";
    var box = document.createElement("div");
    box.className = "catalogEmpty catalogFatal";
    box.innerHTML =
      "<b>Data katalog gagal dimuat.</b>" +
      "<small>" + msg + "</small>" +
      "<small>Biasanya karena <code>data.js</code> error, koma kurang, atau path foto salah.</small>";
    grid.appendChild(box);
  }

  function isSold(p) {
    return p && p.sold === true;
  }

  function sortProducts(list) {
    return list.slice().sort(function (a, b) {
      if (isSold(a) !== isSold(b)) return isSold(a) ? 1 : -1;
      return safeText(a.code).localeCompare(safeText(b.code), "id", { numeric: true });
    });
  }

  function matchGame(p) {
    if (currentGame === "all") return true;
    return lower(p.game) === currentGame;
  }

  function matchSearch(p) {
    var q = lower(currentQuery).trim();
    if (!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(" ") : "";
    var haystack = [p.code, p.name, p.game, p.price, detail].map(safeText).join(" ").toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  function buildFilteredList() {
    var src = Array.isArray(PRODUCTS) ? PRODUCTS : [];
    var out = [];
    for (var i = 0; i < src.length; i++) {
      if (matchGame(src[i]) && matchSearch(src[i])) out.push(src[i]);
    }
    return sortProducts(out);
  }

  function getStats(list) {
    var ready = 0, sold = 0;
    for (var i = 0; i < list.length; i++) isSold(list[i]) ? sold++ : ready++;
    return { ready: ready, sold: sold, total: list.length };
  }

  function gameLabel(game) {
    if (game === "genshin") return "Genshin Impact";
    if (game === "toram") return "Toram Online";
    if (game === "ml") return "Mobile Legends";
    return "Semua Game";
  }

  function setStats(list) {
    var stats = getStats(list);
    var totalEl = $("statTotal");
    var readyEl = $("statReady");
    var soldEl = $("statSold");
    var labelEl = $("activeFilterLabel");
    if (totalEl) totalEl.textContent = stats.total;
    if (readyEl) readyEl.textContent = stats.ready;
    if (soldEl) soldEl.textContent = stats.sold;
    if (labelEl) labelEl.textContent = gameLabel(currentGame);
  }

  function saveLastProduct(href) {
    if (!href) return;
    try { localStorage.setItem("lastProductUrl", href); } catch (e) {}
  }

  function createSectionTitle(kind, count) {
    var div = document.createElement("div");
    div.className = "sectionDivider " + (kind === "sold" ? "sectionDivider--sold" : "sectionDivider--ready");
    var label = kind === "sold" ? "Produk Terjual" : "Ready Stock";
    var icon = kind === "sold" ? "✕" : "✓";
    div.innerHTML =
      "<span class='sectionDivider__line'></span>" +
      "<span class='sectionDivider__badge'><b>" + icon + "</b> " + label + " <small>" + count + "</small></span>" +
      "<span class='sectionDivider__line'></span>";
    return div;
  }

  function createCard(p) {
    var cover = (p.photos && p.photos.length) ? p.photos[0] : "";
    var href = "#/product?code=" + encodeURIComponent(p.code);

    var a = document.createElement("a");
    a.className = "card productCard" + (isSold(p) ? " sold" : " ready");
    a.href = href;
    a.addEventListener("click", function () { saveLastProduct(href); });

    var imgWrap = document.createElement("div");
    imgWrap.className = "productCard__imgWrap";

    var img = document.createElement("img");
    img.src = cover;
    img.alt = p.name || "Produk";
    img.loading = "lazy";

    var status = document.createElement("span");
    status.className = "statusPill " + (isSold(p) ? "statusPill--sold" : "statusPill--ready");
    status.textContent = isSold(p) ? "SOLD" : "READY";

    imgWrap.appendChild(img);
    imgWrap.appendChild(status);

    var meta = document.createElement("div");
    meta.className = "meta productCard__meta";

    var top = document.createElement("div");
    top.className = "productCard__top";

    var nm = document.createElement("p");
    nm.className = "name";
    nm.textContent = p.name || "-";

    var code = document.createElement("span");
    code.className = "codePill";
    code.textContent = p.code || "-";

    var pr = document.createElement("p");
    pr.className = "price";
    pr.textContent = rupiah(p.price);

    var game = document.createElement("p");
    game.className = "gameText";
    game.textContent = gameLabel(lower(p.game));

    top.appendChild(nm);
    top.appendChild(code);
    meta.appendChild(top);
    meta.appendChild(pr);
    meta.appendChild(game);

    a.appendChild(imgWrap);
    a.appendChild(meta);
    return a;
  }

  function renderEmpty(grid) {
    grid.innerHTML = "";
    var box = document.createElement("div");
    box.className = "catalogEmpty";
    box.innerHTML =
      "<b>Produk tidak ditemukan</b>" +
      "<small>Coba ganti filter game atau hapus pencarian.</small>";
    grid.appendChild(box);
  }

  function applyStagger(root) {
    var cards = (root || document).querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) cards[i].style.setProperty("--d", (i * 45) + "ms");
  }

  function renderGrid() {
    var grid = $("grid");
    if (!grid) return;

    currentList = buildFilteredList();
    setStats(currentList);

    var totalPages = Math.max(1, Math.ceil(currentList.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    if (!currentList.length) {
      renderEmpty(grid);
      renderPagination(totalPages);
      return;
    }

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var pageItems = currentList.slice(start, start + ITEMS_PER_PAGE);
    var allStats = getStats(currentList);
    var pageReady = pageItems.filter(function (p) { return !isSold(p); });
    var pageSold = pageItems.filter(function (p) { return isSold(p); });

    grid.innerHTML = "";

    if (pageReady.length) {
      grid.appendChild(createSectionTitle("ready", allStats.ready));
      for (var i = 0; i < pageReady.length; i++) grid.appendChild(createCard(pageReady[i]));
    }

    if (pageSold.length) {
      grid.appendChild(createSectionTitle("sold", allStats.sold));
      for (var j = 0; j < pageSold.length; j++) grid.appendChild(createCard(pageSold[j]));
    }

    renderPagination(totalPages);
    applyStagger(grid);
  }

  function renderPagination(totalPages) {
    var box = $("pagination");
    var info = $("pageInfo");
    if (!box) return;

    box.innerHTML = "";
    if (info) info.textContent = "Halaman " + currentPage + " dari " + totalPages;

    if (totalPages <= 1) {
      box.style.display = "none";
      return;
    }
    box.style.display = "flex";

    function addBtn(label, page, disabled, active) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pageBtn" + (active ? " active" : "");
      btn.textContent = label;
      btn.disabled = !!disabled;
      btn.addEventListener("click", function () {
        if (disabled || currentPage === page) return;
        currentPage = page;
        renderGrid();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      box.appendChild(btn);
    }

    addBtn("‹", currentPage - 1, currentPage <= 1, false);

    var pages = [];
    for (var p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pages.push(p);
    }

    var last = 0;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i] - last > 1) {
        var dot = document.createElement("span");
        dot.className = "pageDots";
        dot.textContent = "…";
        box.appendChild(dot);
      }
      addBtn(String(pages[i]), pages[i], false, pages[i] === currentPage);
      last = pages[i];
    }

    addBtn("›", currentPage + 1, currentPage >= totalPages, false);
  }

  function isValidResumeUrl(url) {
    return !!(url && typeof url === "string" && url.indexOf("#/product?code=") === 0);
  }

  function initResume() {
    var resumeWrap = $("resumeWrap");
    var resumeProduct = $("resumeProduct");
    if (!resumeWrap || !resumeProduct) return;

    resumeWrap.style.display = "none";
    resumeProduct.style.display = "none";
    resumeProduct.removeAttribute("href");

    var url = "";
    try { url = localStorage.getItem("lastProductUrl") || ""; } catch (e) {}
    if (!isValidResumeUrl(url)) return;

    resumeProduct.href = url;
    resumeProduct.style.display = "flex";
    resumeWrap.style.display = "flex";

    var lastY = window.scrollY || 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY || 0;
      if (y > 60 && y > lastY) resumeWrap.classList.add("isHidden");
      else resumeWrap.classList.remove("isHidden");
      lastY = y;
    }, { passive: true });
  }

  function initDropdown() {
    var logoBtn = $("logoBtn");
    var dropdown = $("dropdown");
    if (!logoBtn || !dropdown) return;

    function openMenu() {
      dropdown.classList.add("open");
      dropdown.setAttribute("aria-hidden", "false");
      logoBtn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      dropdown.classList.remove("open");
      dropdown.setAttribute("aria-hidden", "true");
      logoBtn.setAttribute("aria-expanded", "false");
    }

    logoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.contains("open") ? closeMenu() : openMenu();
    });

    dropdown.addEventListener("click", function (e) {
      var item = e.target.closest(".ddItem");
      if (!item) return;
      currentGame = lower(item.getAttribute("data-game") || "all");
      currentPage = 1;
      renderGrid();
      closeMenu();
    });

    document.addEventListener("click", closeMenu);
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  function initSearch() {
    var input = $("catalogSearch");
    var clear = $("clearSearch");
    if (!input) return;

    input.addEventListener("input", function () {
      currentQuery = input.value || "";
      currentPage = 1;
      renderGrid();
    });

    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        currentQuery = "";
        currentPage = 1;
        renderGrid();
        input.focus();
      });
    }
  }

  function initWelcome() {
    var overlay = $("welcomeOverlay");
    var welcomeBtn = $("welcomeBtn");
    if (!overlay || !welcomeBtn) return;
    var card = overlay.querySelector(".welcome-card");

    function hideWelcome() {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
    }

    if (!sessionStorage.getItem("welcome_seen")) {
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
    } else hideWelcome();

    function startMusicAfterGesture() {
      if (!window.__kyuseiMusic) return;
      window.__kyuseiMusic.play().catch(function () {});
    }

    function closeWelcomeAnimated() {
      if (welcomeBtn.disabled) return;
      welcomeBtn.disabled = true;
      sessionStorage.setItem("welcome_seen", "1");
      var dur = 420;
      if (card && card.animate) {
        card.animate([
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(-40px) scale(.96)" }
        ], { duration: dur, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" });
      }
      if (overlay.animate) overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, fill: "forwards" });
      setTimeout(function () { hideWelcome(); startMusicAfterGesture(); }, dur);
    }

    welcomeBtn.addEventListener("click", closeWelcomeAnimated);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeWelcomeAnimated(); });
  }

  window.initHome = function () {
    var grid = $("grid");
    if (typeof SITE_NAME === "undefined") return showFatal(grid, "SITE_NAME tidak terbaca.");
    if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) return showFatal(grid, "PRODUCTS tidak terbaca / bukan array.");
    if (typeof rupiah !== "function") return showFatal(grid, "Fungsi rupiah() tidak terbaca.");

    var siteNameEl = $("siteName");
    if (siteNameEl) siteNameEl.textContent = SITE_NAME;
    document.title = SITE_NAME;

    currentGame = "all";
    currentPage = 1;
    currentQuery = "";

    initDropdown();
    initSearch();
    initWelcome();
    initResume();
    renderGrid();

    if (window.__kyuseiMusic) window.__kyuseiMusic.rebind();
  };
})();
