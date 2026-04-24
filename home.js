/* Kyusei Store - simple clean mobile UI */
(function(){
  "use strict";

  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var SOLD_COVER = "assets/ui/sold-cover.png";
  var WA_URL = "https://wa.me/6283863831670";
  var FB_URL = "https://www.facebook.com/kyu.sei.924076";
  var TG_URL = "https://t.me/DedySetyadi226";

  var game = "all";
  var sort = "code";
  var query = "";
  var readyPage = 1;
  var soldPage = 1;
  var modalProduct = null;

  function $(id){ return document.getElementById(id); }
  function text(v){ return String(v == null ? "" : v); }
  function lower(v){ return text(v).toLowerCase(); }
  function isSold(p){ return p && p.sold === true; }

  window.rupiah = window.rupiah || function(n){
    n = Number(n || 0);
    return "Rp" + n.toLocaleString("id-ID");
  };

  function gameLabel(g){
    g = lower(g);
    if(g === "genshin") return "Genshin Impact";
    if(g === "toram") return "Toram Online";
    if(g === "ml") return "Mobile Legends";
    return "Game Account";
  }

  function allProducts(){ return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : []; }

  function filteredProducts(){
    var q = lower(query).trim();
    var arr = allProducts().filter(function(p){
      if(game !== "all" && lower(p.game) !== game) return false;
      if(!q) return true;
      var detail = Array.isArray(p.detail) ? p.detail.join(" ") : "";
      var hay = [p.code,p.name,p.game,p.price,detail].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    arr.sort(function(a,b){
      if(sort === "cheap") return Number(a.price||0) - Number(b.price||0);
      if(sort === "expensive") return Number(b.price||0) - Number(a.price||0);
      if(sort === "new") return allProducts().indexOf(b) - allProducts().indexOf(a);
      return text(a.code).localeCompare(text(b.code), "id", {numeric:true});
    });
    return arr;
  }

  function imgFor(p){
    if(isSold(p)) return SOLD_COVER;
    return p.photos && p.photos.length ? p.photos[0] : "";
  }

  function makeCard(p, idx){
    var card = document.createElement("article");
    card.className = "kyCard " + (isSold(p) ? "sold" : "ready");
    card.style.setProperty("--delay", (idx * 35) + "ms");

    var href = "#/product?code=" + encodeURIComponent(p.code || "");
    var img = imgFor(p);
    var status = isSold(p) ? "SOLD" : "READY";

    card.innerHTML =
      "<a class='kyCardLink' href='" + href + "'>" +
        "<div class='kyCardImg'><img loading='lazy' alt='' src='" + img + "'><span>" + status + "</span></div>" +
        "<div class='kyCardBody'>" +
          "<div class='kyNameRow'><h3></h3><b></b></div>" +
          "<p class='kyPrice'></p>" +
          "<small></small>" +
        "</div>" +
      "</a>" +
      (!isSold(p) ? "<button class='buyBtn' type='button'>Beli</button>" : "");

    var imgEl = card.querySelector("img");
    imgEl.onerror = function(){
      if(isSold(p) && p.photos && p.photos.length) imgEl.src = p.photos[0];
    };
    card.querySelector("h3").textContent = p.name || "Produk";
    card.querySelector("b").textContent = p.code || "-";
    card.querySelector(".kyPrice").textContent = rupiah(p.price);
    card.querySelector("small").textContent = gameLabel(p.game);

    var buy = card.querySelector(".buyBtn");
    if(buy){ buy.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); openQR(p); }); }

    return card;
  }

  function emptyBox(msg){
    var div = document.createElement("div");
    div.className = "emptyBox";
    div.innerHTML = "<b>" + msg + "</b><small>Coba reset pencarian atau ganti filter.</small>";
    return div;
  }

  function renderGrid(items, gridId, page, perPage, emptyMsg){
    var grid = $(gridId);
    if(!grid) return {page:1,totalPages:1};
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));
    page = Math.min(Math.max(1, page), totalPages);
    grid.innerHTML = "";
    if(!items.length){ grid.appendChild(emptyBox(emptyMsg)); return {page:page,totalPages:totalPages}; }
    items.slice((page-1)*perPage, page*perPage).forEach(function(p,i){ grid.appendChild(makeCard(p,i)); });
    return {page:page,totalPages:totalPages};
  }

  function renderPager(boxId, infoId, page, totalPages, go){
    var box = $(boxId), info = $(infoId);
    if(info) info.textContent = page + "/" + totalPages;
    if(!box) return;
    box.innerHTML = "";
    if(totalPages <= 1){ box.style.display = "none"; return; }
    box.style.display = "flex";

    function add(label,target,disabled,active){
      var b = document.createElement("button");
      b.className = "pageBtn" + (active ? " active" : "");
      b.type = "button"; b.textContent = label; b.disabled = !!disabled;
      b.addEventListener("click", function(){ if(!disabled){ go(target); } });
      box.appendChild(b);
    }
    add("‹", page-1, page<=1, false);
    for(var i=1;i<=totalPages;i++){
      if(i===1 || i===totalPages || Math.abs(i-page)<=1) add(String(i), i, false, i===page);
      else if(i===page-2 || i===page+2){ var s=document.createElement("span"); s.className="dots"; s.textContent="…"; box.appendChild(s); }
    }
    add("›", page+1, page>=totalPages, false);
  }

  function render(){
    var products = filteredProducts();
    var ready = products.filter(function(p){ return !isSold(p); });
    var sold = products.filter(isSold);
    var raw = allProducts();

    if($("statReady")) $("statReady").textContent = raw.filter(function(p){return !isSold(p);}).length;
    if($("statSold")) $("statSold").textContent = raw.filter(isSold).length;
    if($("statTotal")) $("statTotal").textContent = raw.length;

    var r = renderGrid(ready,"readyGrid",readyPage,READY_PER_PAGE,"Belum ada produk ready");
    readyPage = r.page;
    renderPager("readyPagination","readyPageInfo",readyPage,r.totalPages,function(p){ readyPage=p; render(); scrollToSection("readyGrid"); });

    var s = renderGrid(sold,"soldGrid",soldPage,SOLD_PER_PAGE,"Belum ada produk sold");
    soldPage = s.page;
    renderPager("soldPagination","soldPageInfo",soldPage,s.totalPages,function(p){ soldPage=p; render(); scrollToSection("soldGrid"); });
  }

  function scrollToSection(id){
    var el = $(id);
    if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function msgFor(p){
    return "Halo admin, saya mau beli akun " + (p.code || "-") + " - " + (p.name || "Produk") + " harga " + rupiah(p.price) + ". Saya sudah bayar, ini bukti pembayarannya.";
  }

  function openQR(p){
    modalProduct = p;
    if($("qrProduct")) $("qrProduct").textContent = (p.code || "-") + " • " + (p.name || "Produk");
    if($("qrPrice")) $("qrPrice").textContent = rupiah(p.price);
    var modal = $("qrModal");
    if(modal){ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); }
  }
  function closeQR(){
    var modal = $("qrModal");
    if(modal){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
  }
  window.openKyuseiQR = openQR;

  function initModal(){
    var close = $("qrClose"), modal = $("qrModal"), wa = $("qrWA"), tg = $("qrTG"), fb = $("qrFB");
    if(close) close.onclick = closeQR;
    if(modal) modal.addEventListener("click", function(e){ if(e.target === modal) closeQR(); });
    if(wa) wa.onclick = function(){ if(modalProduct) window.open(WA_URL + "?text=" + encodeURIComponent(msgFor(modalProduct)), "_blank"); };
    if(tg) tg.onclick = function(){ window.open(TG_URL, "_blank"); };
    if(fb) fb.onclick = function(){ window.open(FB_URL, "_blank"); };
  }

  function initControls(){
    var search = $("catalogSearch"), clear = $("clearSearch"), gameSel = $("gameFilter"), sortSel = $("sortSelect");
    if(search) search.addEventListener("input", function(){ query = search.value || ""; readyPage=1; soldPage=1; render(); });
    if(clear) clear.addEventListener("click", function(){ if(search) search.value=""; query=""; game="all"; sort="code"; if(gameSel) gameSel.value="all"; if(sortSel) sortSel.value="code"; readyPage=1; soldPage=1; render(); });
    if(gameSel) gameSel.addEventListener("change", function(){ game=lower(gameSel.value||"all"); readyPage=1; soldPage=1; render(); });
    if(sortSel) sortSel.addEventListener("change", function(){ sort=sortSel.value||"code"; readyPage=1; soldPage=1; render(); });
  }

  window.initHome = function(){
    if($("siteName") && window.SITE_NAME) $("siteName").textContent = window.SITE_NAME;
    document.title = (window.SITE_NAME || "Kyusei") + " Store";
    game="all"; sort="code"; query=""; readyPage=1; soldPage=1;
    initControls();
    initModal();
    render();
  };
})();
