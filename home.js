(function () {
  'use strict';

  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var SOLD_COVER = 'assets/ui/sold-cover.png';
  var FALLBACK_COVER = 'assets/ui/top.png';
  var ADMIN_WA = '6283863831670';
  var ADMIN_TG = 'DedySetyadi226';
  var ADMIN_FB = 'https://www.facebook.com/kyu.sei.924076';
  var state = { q: '', game: 'all', sort: 'code', readyPage: 1, soldPage: 1 };

  function $(id) { return document.getElementById(id); }
  function safe(v) { return String(v == null ? '' : v); }
  function low(v) { return safe(v).toLowerCase(); }
  function list() { return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : []; }
  function isSold(p) { return !!(p && p.sold === true); }

  function rupiah(num) {
    if (typeof window.rupiah === 'function') return window.rupiah(num);
    var n = Number(num || 0);
    return 'Rp' + n.toLocaleString('id-ID');
  }

  function gameName(g) {
    g = low(g);
    if (g === 'genshin') return 'Genshin Impact';
    if (g === 'toram') return 'Toram Online';
    if (g === 'ml') return 'Mobile Legends';
    return 'Game Account';
  }

  function matches(p) {
    if (state.game !== 'all' && low(p.game) !== state.game) return false;
    var q = low(state.q).trim();
    if (!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(' ') : '';
    return [p.code, p.name, p.game, p.price, detail].join(' ').toLowerCase().indexOf(q) !== -1;
  }

  function sortItems(items) {
    return items.sort(function (a, b) {
      if (state.sort === 'cheap') return Number(a.price || 0) - Number(b.price || 0);
      if (state.sort === 'expensive') return Number(b.price || 0) - Number(a.price || 0);
      if (state.sort === 'new') return 0;
      return safe(a.code).localeCompare(safe(b.code), 'id', { numeric: true });
    });
  }

  function coverOf(p) {
    if (isSold(p)) return SOLD_COVER;
    if (p.photos && p.photos[0]) return p.photos[0];
    return FALLBACK_COVER;
  }

  function detailLink(p) {
    return '#/product?code=' + encodeURIComponent(p.code || '');
  }

  function buildMessage(p) {
    return 'Halo admin, saya mau beli akun ' + safe(p.code) + ' - ' + safe(p.name) + ' harga ' + rupiah(p.price) + '. Saya sudah scan QRIS, berikut bukti pembayaran saya.';
  }

  function openQR(p) {
    if (!p || isSold(p)) return;
    var modal = $('qrModal');
    if (!modal) return;
    if ($('qrProduct')) $('qrProduct').textContent = safe(p.code) + ' • ' + safe(p.name);
    if ($('qrPrice')) $('qrPrice').textContent = rupiah(p.price);

    var msg = buildMessage(p);
    if ($('qrWA')) $('qrWA').onclick = function () { window.open('https://wa.me/' + ADMIN_WA + '?text=' + encodeURIComponent(msg), '_blank'); };
    if ($('qrTG')) $('qrTG').onclick = function () { window.open('https://t.me/' + ADMIN_TG, '_blank'); };
    if ($('qrFB')) $('qrFB').onclick = function () { window.open(ADMIN_FB, '_blank'); };

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeQR() {
    var modal = $('qrModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function makeCard(p, i) {
    var a = document.createElement('a');
    a.href = detailLink(p);
    a.className = 'productCard ' + (isSold(p) ? 'isSold' : 'isReady');
    a.style.setProperty('--delay', (i * 35) + 'ms');

    a.addEventListener('click', function () {
      try { localStorage.setItem('lastProductUrl', a.getAttribute('href')); } catch (e) {}
    });

    var media = document.createElement('div');
    media.className = 'cardMedia';
    var img = document.createElement('img');
    img.src = coverOf(p);
    img.alt = p.name || 'Produk';
    img.loading = 'lazy';
    img.onerror = function () { img.src = FALLBACK_COVER; };
    var badge = document.createElement('span');
    badge.className = 'statusBadge';
    badge.textContent = isSold(p) ? 'SOLD' : 'READY';
    media.appendChild(img);
    media.appendChild(badge);

    var body = document.createElement('div');
    body.className = 'cardBody';
    var row = document.createElement('div');
    row.className = 'cardNameRow';
    var title = document.createElement('h3');
    title.textContent = p.name || '-';
    var code = document.createElement('b');
    code.textContent = p.code || '-';
    row.appendChild(title);
    row.appendChild(code);

    var price = document.createElement('p');
    price.className = 'cardPrice';
    price.textContent = rupiah(p.price);
    var game = document.createElement('p');
    game.className = 'cardGame';
    game.textContent = gameName(p.game);

    body.appendChild(row);
    body.appendChild(price);
    body.appendChild(game);

    if (!isSold(p)) {
      var buy = document.createElement('button');
      buy.type = 'button';
      buy.className = 'buyBtn';
      buy.setAttribute('aria-label', 'Beli ' + (p.name || 'produk'));
      buy.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openQR(p);
      });
      body.appendChild(buy);
    }

    a.appendChild(media);
    a.appendChild(body);
    return a;
  }

  function emptyBox(text) {
    var d = document.createElement('div');
    d.className = 'emptyBox';
    d.textContent = text;
    return d;
  }

  function renderGrid(items, id, page, per, emptyText) {
    var grid = $(id);
    if (!grid) return { page: 1, totalPages: 1, total: 0 };
    grid.innerHTML = '';

    var totalPages = Math.max(1, Math.ceil(items.length / per));
    page = Math.min(Math.max(1, page), totalPages);

    if (!items.length) {
      grid.appendChild(emptyBox(emptyText));
      return { page: page, totalPages: totalPages, total: 0 };
    }

    items.slice((page - 1) * per, page * per).forEach(function (p, i) {
      grid.appendChild(makeCard(p, i));
    });
    return { page: page, totalPages: totalPages, total: items.length };
  }

  function setPageInfo(id, page, totalPages, total) {
    var el = $(id);
    if (!el) return;
    el.textContent = total ? (page + '/' + totalPages) : '0/0';
  }

  function renderPager(id, page, totalPages, go) {
    var box = $(id);
    if (!box) return;
    box.innerHTML = '';
    if (totalPages <= 1) { box.style.display = 'none'; return; }
    box.style.display = 'flex';

    function add(txt, target, active, disabled) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pageBtn' + (active ? ' active' : '');
      b.textContent = txt;
      b.disabled = !!disabled;
      b.onclick = function () { if (!disabled) go(target); };
      box.appendChild(b);
    }
    add('‹', page - 1, false, page <= 1);
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) add(String(i), i, i === page, false);
      else if (i === page - 2 || i === page + 2) {
        var dots = document.createElement('span');
        dots.className = 'dots';
        dots.textContent = '…';
        box.appendChild(dots);
      }
    }
    add('›', page + 1, false, page >= totalPages);
  }

  function render() {
    var filtered = sortItems(list().filter(matches));
    var ready = filtered.filter(function (p) { return !isSold(p); });
    var solds = filtered.filter(isSold);

    if ($('statReady')) $('statReady').textContent = ready.length;
    if ($('statSold')) $('statSold').textContent = solds.length;
    if ($('statTotal')) $('statTotal').textContent = filtered.length;

    var r = renderGrid(ready, 'readyGrid', state.readyPage, READY_PER_PAGE, 'Belum ada produk ready.');
    state.readyPage = r.page;
    setPageInfo('readyPageInfo', r.page, r.totalPages, ready.length);
    renderPager('readyPagination', r.page, r.totalPages, function (n) { state.readyPage = n; render(); });

    var s = renderGrid(solds, 'soldGrid', state.soldPage, SOLD_PER_PAGE, 'Belum ada produk sold.');
    state.soldPage = s.page;
    setPageInfo('soldPageInfo', s.page, s.totalPages, solds.length);
    renderPager('soldPagination', s.page, s.totalPages, function (n) { state.soldPage = n; render(); });
  }

  function welcome() {
    var modal = $('kyWelcomeModal');
    if (!modal) return;
    var seen = false;
    try { seen = sessionStorage.getItem('kyuseiWelcomeSeen') === '1'; } catch (e) {}
    function close() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      try { sessionStorage.setItem('kyuseiWelcomeSeen', '1'); } catch (e) {}
    }
    if ($('kyWelcomeClose')) $('kyWelcomeClose').onclick = close;
    if ($('kyWelcomeEnter')) $('kyWelcomeEnter').onclick = close;
    if (!seen) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function bind() {
    var input = $('catalogSearch');
    var clear = $('clearSearch');
    var game = $('gameFilter');
    var sort = $('sortSelect');
    if (input) input.oninput = function () { state.q = input.value; state.readyPage = 1; state.soldPage = 1; render(); };
    if (clear) clear.onclick = function () { state.q = ''; if (input) input.value = ''; state.readyPage = 1; state.soldPage = 1; render(); };
    if (game) game.onchange = function () { state.game = game.value; state.readyPage = 1; state.soldPage = 1; render(); };
    if (sort) sort.onchange = function () { state.sort = sort.value; state.readyPage = 1; state.soldPage = 1; render(); };
    if ($('qrClose')) $('qrClose').onclick = closeQR;
    if ($('qrModal')) $('qrModal').onclick = function (e) { if (e.target === $('qrModal')) closeQR(); };
  }

  window.initHome = function () {
    if ($('siteName') && window.SITE_NAME) $('siteName').textContent = window.SITE_NAME;
    state = { q: '', game: 'all', sort: 'code', readyPage: 1, soldPage: 1 };
    bind();
    welcome();
    render();
  };
})();
