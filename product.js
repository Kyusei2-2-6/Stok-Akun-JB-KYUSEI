(function () {
  'use strict';
  var ADMIN_WA = '6283863831670';
  var ADMIN_TG = 'DedySetyadi226';
  var ADMIN_FB = 'https://www.facebook.com/kyu.sei.924076';

  function $(id) { return document.getElementById(id); }
  function safe(v) { return String(v == null ? '' : v); }
  function list() { return Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []; }
  function rupiah(num) {
    if (typeof window.rupiah === 'function') return window.rupiah(num);
    var n = Number(num || 0);
    return 'Rp' + n.toLocaleString('id-ID');
  }
  function findProduct(code) { return list().find(function (p) { return safe(p.code) === safe(code); }); }
  function isSold(p) { return !!(p && (p.sold === true || String(p.sold).toLowerCase() === "true" || String(p.status || "").toLowerCase() === "sold")); }
  function resolve(path) { try { return new URL(path, document.baseURI).href; } catch (e) { return path; } }

  function openQR(p) {
    if (!p || isSold(p)) return;
    var modal = $('qrModal');
    if (!modal) return;
    if ($('qrProduct')) $('qrProduct').textContent = safe(p.code) + ' • ' + safe(p.name);
    if ($('qrPrice')) $('qrPrice').textContent = rupiah(p.price);
    var msg = 'Halo admin, saya mau beli akun ' + safe(p.code) + ' - ' + safe(p.name) + ' harga ' + rupiah(p.price) + '. Saya sudah scan QRIS, berikut bukti pembayaran saya.';
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

  window.initProduct = function (params) {
    var code = params && params.code ? params.code : '';
    var p = findProduct(code);
    if (!p) {
      document.getElementById('app').innerHTML = '<main class="wrap"><p>Produk tidak ditemukan.</p><a class="btn" href="#/home">Kembali</a></main>';
      return;
    }
    document.title = (p.name || 'Produk') + ' - Kyusei Store';
    if ($('prodName')) $('prodName').textContent = p.name || 'Produk';
    if ($('prodMeta')) $('prodMeta').textContent = safe(p.code) + ' • ' + rupiah(p.price) + (isSold(p) ? ' • SOLD' : '');

    try { localStorage.setItem('lastProductUrl', '#/product?code=' + encodeURIComponent(p.code)); } catch (e) {}

    var photos = Array.isArray(p.photos) ? p.photos : [];
    var current = 0;
    var hero = $('heroImg');
    var thumbs = $('thumbs');

    function setHero(i) {
      if (!photos.length || !hero) return;
      current = (i + photos.length) % photos.length;
      hero.src = resolve(photos[current]);
      hero.alt = (p.name || 'Produk') + ' ' + (current + 1);
    }
    setHero(0);

    if (thumbs) {
      thumbs.innerHTML = '';
      photos.forEach(function (src, i) {
        var im = document.createElement('img');
        im.src = resolve(src);
        im.alt = 'Foto ' + (i + 1);
        im.onclick = function () { openLight(i); };
        thumbs.appendChild(im);
      });
    }

    var buy = $('buyProductBtn');
    if (buy) {
      if (isSold(p)) {
        buy.textContent = 'SOLD';
        buy.disabled = true;
        buy.style.opacity = '.55';
      } else {
        buy.onclick = function () { openQR(p); };
      }
    }

    function renderLight() {
      if (!$('lbImg') || !photos.length) return;
      $('lbImg').src = resolve(photos[current]);
      if ($('lbCaption')) $('lbCaption').textContent = (p.name || 'Produk') + ' • ' + (current + 1) + ' / ' + photos.length;
    }
    function openLight(i) {
      if (!photos.length) return;
      current = i;
      var lightbox = $('lightbox');
      if (!lightbox) return;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      renderLight();
    }
    function closeLight() {
      var lightbox = $('lightbox');
      if (!lightbox) return;
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
    if ($('openLightboxBtn')) $('openLightboxBtn').onclick = function () { openLight(current); };
    if ($('lbClose')) $('lbClose').onclick = closeLight;
    if ($('lbPrev')) $('lbPrev').onclick = function () { current = (current - 1 + photos.length) % photos.length; renderLight(); };
    if ($('lbNext')) $('lbNext').onclick = function () { current = (current + 1) % photos.length; renderLight(); };
    if ($('lightbox')) $('lightbox').onclick = function (e) { if (e.target === $('lightbox')) closeLight(); };

    function openDetail() {
      var modal = $('detailModal');
      var detailList = $('detailList');
      var empty = $('detailEmpty');
      if (!modal || !detailList) return;
      if ($('detailSub')) $('detailSub').textContent = safe(p.code) + ' • ' + rupiah(p.price) + (isSold(p) ? ' • SOLD' : '');
      detailList.innerHTML = '';
      var det = Array.isArray(p.detail) ? p.detail : [];
      if (!det.length) {
        if (empty) empty.style.display = 'block';
      } else {
        if (empty) empty.style.display = 'none';
        det.forEach(function (t) { var li = document.createElement('li'); li.textContent = safe(t); detailList.appendChild(li); });
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    function closeDetail() { var modal = $('detailModal'); if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); } }
    if ($('detailBtn')) $('detailBtn').onclick = openDetail;
    if ($('detailClose')) $('detailClose').onclick = closeDetail;
    if ($('detailModal')) $('detailModal').onclick = function (e) { if (e.target === $('detailModal')) closeDetail(); };
    if ($('qrClose')) $('qrClose').onclick = closeQR;
    if ($('qrModal')) $('qrModal').onclick = function (e) { if (e.target === $('qrModal')) closeQR(); };
  };
})();
