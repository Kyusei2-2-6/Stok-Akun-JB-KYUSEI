/* Kyusei Mobile Pro - home.js */
(function(){
  "use strict";
  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var soldCover = "assets/ui/sold-cover.png";
  var state = { game:"all", q:"", readyPage:1, soldPage:1 };
  function $(id){ return document.getElementById(id); }
  function txt(id,v){ var e=$(id); if(e) e.textContent=String(v); }
  function safeRupiah(n){ return typeof rupiah==="function" ? rupiah(n||0) : "Rp"+Number(n||0).toLocaleString("id-ID"); }
  function gameName(g){ g=(g||"").toLowerCase(); if(g==="genshin") return "Genshin Impact"; if(g==="toram") return "Toram Online"; if(g==="ml") return "Mobile Legends"; return g || "Game"; }
  function isSold(p){ return p && p.sold===true; }
  function photo(p){ return (p && p.photos && p.photos.length) ? p.photos[0] : ""; }
  function matches(p){
    if(!p) return false;
    var g=(p.game||"").toLowerCase();
    if(state.game!=="all" && g!==state.game) return false;
    var q=(state.q||"").trim().toLowerCase();
    if(!q) return true;
    return String(p.name||"").toLowerCase().indexOf(q)>-1 || String(p.code||"").toLowerCase().indexOf(q)>-1 || gameName(g).toLowerCase().indexOf(q)>-1;
  }
  function sortByCode(list){
    return list.slice().sort(function(a,b){ return String(a.code||"").localeCompare(String(b.code||""),"id",{numeric:true}); });
  }
  function card(p, sold){
    var a=document.createElement("a");
    a.className="proCard"+(sold?" isSold":" isReady");
    a.href="#/product?code="+encodeURIComponent(p.code||"");
    a.addEventListener("click",function(){ try{ localStorage.setItem("lastProductUrl",a.getAttribute("href")); }catch(e){} });
    var image=sold ? soldCover : photo(p);
    a.innerHTML =
      '<div class="thumbWrap">'+
        '<img class="thumb" src="'+escapeAttr(image)+'" alt="'+escapeAttr(p.name||"Produk")+'" loading="lazy">'+
        '<span class="status '+(sold?'red':'green')+'">'+(sold?'SOLD':'READY')+'</span>'+ 
      '</div>'+ 
      '<div class="cardBody">'+
        '<div class="nameRow"><h3>'+escapeHtml(p.name||'-')+'</h3><span>'+escapeHtml(p.code||'-')+'</span></div>'+ 
        '<p class="price '+(sold?'soldPrice':'readyPrice')+'">'+safeRupiah(p.price)+'</p>'+ 
        '<p class="game">⌁ '+escapeHtml(gameName(p.game))+'</p>'+ 
      '</div>';
    return a;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
  function escapeAttr(s){ return escapeHtml(s).replace(/'/g,"&#39;"); }
  function renderGrid(id, list, page, per){
    var el=$(id); if(!el) return;
    el.innerHTML="";
    if(!list.length){ el.innerHTML='<div class="emptyState">Produk tidak ditemukan.</div>'; return; }
    var total=Math.max(1,Math.ceil(list.length/per));
    page=Math.min(Math.max(1,page),total);
    var start=(page-1)*per;
    list.slice(start,start+per).forEach(function(p){ el.appendChild(card(p,isSold(p))); });
  }
  function renderPager(id,totalItems,page,per,type){
    var el=$(id); if(!el) return;
    var total=Math.max(1,Math.ceil(totalItems/per));
    if(totalItems<=per){ el.innerHTML=""; return; }
    page=Math.min(Math.max(1,page),total);
    var html='<button class="pageBtn" data-type="'+type+'" data-page="'+(page-1)+'" '+(page<=1?'disabled':'')+'>‹</button>';
    var nums=[];
    for(var i=1;i<=total;i++) if(i===1||i===total||Math.abs(i-page)<=1) nums.push(i);
    var prev=0;
    nums.forEach(function(n){
      if(prev && n-prev>1) html+='<span class="dots">…</span>';
      html+='<button class="pageBtn '+(n===page?'active':'')+'" data-type="'+type+'" data-page="'+n+'">'+n+'</button>';
      prev=n;
    });
    html+='<button class="pageBtn" data-type="'+type+'" data-page="'+(page+1)+'" '+(page>=total?'disabled':'')+'>›</button>';
    html+='<small>Halaman '+page+' dari '+total+'</small>';
    el.innerHTML=html;
  }
  function render(){
    if(typeof SITE_NAME!=="undefined"){ txt("siteName",SITE_NAME); document.title=SITE_NAME; }
    if(typeof PRODUCTS==="undefined" || !Array.isArray(PRODUCTS)){ return; }
    var all=PRODUCTS.slice();
    var ready=sortByCode(all.filter(function(p){ return !isSold(p) && matches(p); }));
    var sold=sortByCode(all.filter(function(p){ return isSold(p) && matches(p); }));
    txt("statReady", all.filter(function(p){return !isSold(p);}).length);
    txt("statSold", all.filter(isSold).length);
    txt("statTotal", all.length);
    txt("readyCount", ready.length);
    txt("soldCount", sold.length);
    var rTotal=Math.max(1,Math.ceil(ready.length/READY_PER_PAGE));
    var sTotal=Math.max(1,Math.ceil(sold.length/SOLD_PER_PAGE));
    state.readyPage=Math.min(state.readyPage,rTotal);
    state.soldPage=Math.min(state.soldPage,sTotal);
    renderGrid("readyGrid",ready,state.readyPage,READY_PER_PAGE);
    renderGrid("soldGrid",sold,state.soldPage,SOLD_PER_PAGE);
    renderPager("readyPager",ready.length,state.readyPage,READY_PER_PAGE,"ready");
    renderPager("soldPager",sold.length,state.soldPage,SOLD_PER_PAGE,"sold");
  }
  function initControls(){
    var search=$("searchInput"), select=$("gameSelect");
    if(search) search.addEventListener("input",function(){ state.q=search.value||""; state.readyPage=1; state.soldPage=1; render(); });
    if(select) select.addEventListener("change",function(){ state.game=(select.value||"all").toLowerCase(); state.readyPage=1; state.soldPage=1; render(); });
    document.addEventListener("click",function(e){
      var btn=e.target.closest(".pageBtn");
      if(btn){
        var type=btn.getAttribute("data-type"); var page=parseInt(btn.getAttribute("data-page"),10)||1;
        if(type==="ready") state.readyPage=page; else state.soldPage=page;
        render();
        var target=document.querySelector(type==="ready"?".readySection":".soldSection");
        if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
        return;
      }
      var dd=e.target.closest(".ddItem");
      if(dd){
        state.game=(dd.getAttribute("data-game")||"all").toLowerCase();
        if(select) select.value=state.game;
        state.readyPage=1; state.soldPage=1; render();
        var menu=$("dropdown"), logo=$("logoBtn");
        if(menu) menu.classList.remove("open"); if(logo) logo.setAttribute("aria-expanded","false");
      }
    });
    var logo=$("logoBtn"), menu=$("dropdown");
    if(logo&&menu){
      logo.addEventListener("click",function(e){ e.stopPropagation(); menu.classList.toggle("open"); logo.setAttribute("aria-expanded",menu.classList.contains("open")?"true":"false"); });
      document.addEventListener("click",function(){ menu.classList.remove("open"); logo.setAttribute("aria-expanded","false"); });
    }
  }
  function initWelcome(){
    var overlay=$("welcomeOverlay"), btn=$("welcomeBtn"); if(!overlay||!btn) return;
    var card=overlay.querySelector(".welcome-card");
    function hide(){ overlay.classList.remove("show"); overlay.setAttribute("aria-hidden","true"); }
    function show(){ overlay.classList.add("show"); overlay.setAttribute("aria-hidden","false"); btn.disabled=false; }
    if(!sessionStorage.getItem("welcome_seen")) show(); else hide();
    function close(){ if(btn.disabled) return; btn.disabled=true; sessionStorage.setItem("welcome_seen","1"); if(card&&card.animate) card.animate([{opacity:1,transform:"translateY(0) scale(1)"},{opacity:0,transform:"translateY(-36px) scale(.96)"}],{duration:380,easing:"ease",fill:"forwards"}); setTimeout(hide,380); }
    btn.addEventListener("click",close); overlay.addEventListener("click",function(e){ if(e.target===overlay) close(); });
  }
  function initResume(){
    var wrap=$("resumeWrap"), link=$("resumeProduct"); if(!wrap||!link) return;
    wrap.style.display="none"; link.style.display="none";
    try{ var url=localStorage.getItem("lastProductUrl"); if(url && url.indexOf("#/product?code=")===0){ link.href=url; link.style.display="flex"; wrap.style.display="flex"; } }catch(e){}
  }
  window.initHome=function(){ initWelcome(); initControls(); initResume(); render(); };
})();
