/* Kyusei Store - Android rewrite, compatible with current data.js + bot updater */
(function(){
  'use strict';

  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var SOLD_COVER = 'assets/ui/sold-cover.png';
  var currentGame = 'all';
  var query = '';
  var readyPage = 1;
  var soldPage = 1;

  function $(id){ return document.getElementById(id); }
  function safe(v){ return String(v == null ? '' : v); }
  function lower(v){ return safe(v).toLowerCase(); }
  function isSold(p){ return p && p.sold === true; }
  function money(v){ return (typeof window.rupiah === 'function') ? window.rupiah(v) : ('Rp' + safe(v)); }
  function gameLabel(g){
    g = lower(g);
    if(g === 'genshin') return 'Genshin Impact';
    if(g === 'toram') return 'Toram Online';
    if(g === 'ml') return 'Mobile Legends';
    return 'Game Account';
  }
  function products(){ return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : []; }
  function matchGame(p){ return currentGame === 'all' || lower(p.game) === currentGame; }
  function matchQuery(p){
    var q = lower(query).trim();
    if(!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(' ') : '';
    var hay = [p.code,p.name,p.game,p.price,detail].join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }
  function sortedList(){
    return products().filter(function(p){ return matchGame(p) && matchQuery(p); })
      .sort(function(a,b){
        var as = isSold(a) ? 1 : 0;
        var bs = isSold(b) ? 1 : 0;
        if(as !== bs) return as - bs;
        return safe(a.code).localeCompare(safe(b.code),'id',{numeric:true});
      });
  }
  function coverFor(p){
    if(isSold(p)) return SOLD_COVER;
    return (p.photos && p.photos[0]) ? p.photos[0] : '';
  }
  function saveLast(href, code){
    try{
      localStorage.setItem('lastProductUrl', href);
      localStorage.setItem('lastProductCode', safe(code));
    }catch(e){}
  }
  function makeCard(p, index){
    var href = '#/product?code=' + encodeURIComponent(p.code || '');
    var a = document.createElement('a');
    a.href = href;
    a.className = 'productCard ' + (isSold(p) ? 'isSold' : 'isReady');
    a.style.setProperty('--delay', (index * 35) + 'ms');
    a.addEventListener('click', function(){ saveLast(href, p.code); });

    var imgWrap = document.createElement('div');
    imgWrap.className = 'imgWrap';
    var img = document.createElement('img');
    img.src = coverFor(p);
    img.alt = p.name || 'Produk';
    img.loading = 'lazy';
    img.onerror = function(){
      if(isSold(p) && p.photos && p.photos[0] && img.src.indexOf(p.photos[0]) === -1) img.src = p.photos[0];
    };
    var badge = document.createElement('span');
    badge.className = 'badge ' + (isSold(p) ? 'soldBadge' : 'readyBadge');
    badge.textContent = isSold(p) ? 'SOLD' : 'READY';
    imgWrap.appendChild(img);
    imgWrap.appendChild(badge);

    var body = document.createElement('div');
    body.className = 'cardBody';
    var title = document.createElement('div');
    title.className = 'nameRow';
    var h3 = document.createElement('h3'); h3.textContent = p.name || '-';
    var code = document.createElement('b'); code.textContent = p.code || '-';
    title.appendChild(h3); title.appendChild(code);
    var price = document.createElement('p'); price.className = 'price'; price.textContent = money(p.price);
    var game = document.createElement('p'); game.className = 'game'; game.textContent = gameLabel(p.game);
    body.appendChild(title); body.appendChild(price); body.appendChild(game);

    a.appendChild(imgWrap); a.appendChild(body);
    return a;
  }
  function emptyBox(text){
    var d = document.createElement('div');
    d.className = 'emptyBox';
    d.innerHTML = '<b>' + text + '</b><small>Coba ganti filter atau pencarian.</small>';
    return d;
  }
  function renderSection(items, gridId, page, perPage, emptyText){
    var grid = $(gridId);
    if(!grid) return {page:1,totalPages:1};
    grid.innerHTML = '';
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));
    page = Math.min(Math.max(1,page), totalPages);
    if(!items.length){ grid.appendChild(emptyBox(emptyText)); return {page:page,totalPages:totalPages}; }
    items.slice((page-1)*perPage, page*perPage).forEach(function(p,i){ grid.appendChild(makeCard(p,i)); });
    return {page:page,totalPages:totalPages};
  }
  function renderPagination(id, infoId, page, totalPages, totalItems, perPage, onGo){
    var box = $(id), info = $(infoId);
    if(info){ info.textContent = totalItems ? ('Hal. ' + page + '/' + totalPages) : '0 item'; }
    if(!box) return;
    box.innerHTML = '';
    if(totalPages <= 1){ box.style.display = 'none'; return; }
    box.style.display = 'flex';
    function add(label,target,disabled,active){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pageBtn' + (active ? ' active' : '');
      b.textContent = label;
      b.disabled = !!disabled;
      b.addEventListener('click', function(){
        if(disabled) return;
        onGo(target);
        var main = document.querySelector('.storeMain');
        if(main) window.scrollTo({top: main.offsetTop - 8, behavior:'smooth'});
      });
      box.appendChild(b);
    }
    add('‹', page-1, page<=1, false);
    var pages = [];
    for(var i=1;i<=totalPages;i++) if(i===1 || i===totalPages || Math.abs(i-page)<=1) pages.push(i);
    var last = 0;
    pages.forEach(function(p){
      if(p-last>1){ var s=document.createElement('span'); s.className='pageDots'; s.textContent='…'; box.appendChild(s); }
      add(String(p), p, false, p===page);
      last = p;
    });
    add('›', page+1, page>=totalPages, false);
  }
  function render(){
    var all = sortedList();
    var ready = all.filter(function(p){ return !isSold(p); });
    var sold = all.filter(isSold);
    if($('statReady')) $('statReady').textContent = ready.length;
    if($('statSold')) $('statSold').textContent = sold.length;
    if($('statTotal')) $('statTotal').textContent = all.length;
    var r = renderSection(ready,'readyGrid',readyPage,READY_PER_PAGE,'Belum ada produk ready');
    readyPage = r.page;
    renderPagination('readyPagination','readyPageInfo',readyPage,r.totalPages,ready.length,READY_PER_PAGE,function(p){ readyPage=p; render(); });
    var s = renderSection(sold,'soldGrid',soldPage,SOLD_PER_PAGE,'Belum ada produk sold');
    soldPage = s.page;
    renderPagination('soldPagination','soldPageInfo',soldPage,s.totalPages,sold.length,SOLD_PER_PAGE,function(p){ soldPage=p; render(); });
    setupResume();
  }
  function initDropdown(){
    var btn=$('logoBtn'), menu=$('dropdown');
    if(!btn || !menu) return;
    function close(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function(e){
      var item = e.target.closest('.ddItem');
      if(!item) return;
      currentGame = lower(item.getAttribute('data-game') || 'all');
      readyPage = 1; soldPage = 1;
      render(); close();
    });
    document.addEventListener('click', close, {once:false});
  }
  function initSearch(){
    var input=$('catalogSearch'), clear=$('clearSearch');
    if(input) input.addEventListener('input', function(){ query=input.value || ''; readyPage=1; soldPage=1; render(); });
    if(clear) clear.addEventListener('click', function(){ if(input) input.value=''; query=''; readyPage=1; soldPage=1; render(); if(input) input.focus(); });
  }
  function setupResume(){
    var wrap=$('resumeWrap'), link=$('resumeProduct');
    if(!wrap || !link) return;
    var href='';
    try{ href = localStorage.getItem('lastProductUrl') || ''; }catch(e){}
    if(href){ link.href=href; wrap.style.display='block'; link.style.display='flex'; }
    else { wrap.style.display='none'; link.style.display='none'; }
  }
  function initWelcome(){
    var ov=$('welcomeOverlay'), btn=$('welcomeBtn');
    if(!ov || !btn) return;
    // Tidak mengubah konten welcome, hanya memastikan tombolnya bisa menutup.
    try{
      if(localStorage.getItem('kyuseiWelcomeDone') === '1') return;
    }catch(e){}
    ov.classList.add('show');
    ov.setAttribute('aria-hidden','false');
    btn.addEventListener('click', function(){
      ov.classList.remove('show');
      ov.setAttribute('aria-hidden','true');
      try{ localStorage.setItem('kyuseiWelcomeDone','1'); }catch(e){}
    });
  }
  window.initHome = function(){
    if($('siteName') && window.SITE_NAME) $('siteName').textContent = window.SITE_NAME;
    document.title = (window.SITE_NAME || 'Kyusei') + ' Store';
    currentGame='all'; query=''; readyPage=1; soldPage=1;
    initWelcome(); initDropdown(); initSearch(); render();
  };
})();
