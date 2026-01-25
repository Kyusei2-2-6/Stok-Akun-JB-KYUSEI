/* =========================================================
   Kyusei - home.js (FIX RESUME + START MUSIC ON GESTURE)
   - Resume buttons aman (tidak muncul tanpa data)
   - Music DIJAMIN mulai saat user klik Welcome / tap pertama
   ========================================================= */

(function () {
  "use strict";

  function $(id){ return document.getElementById(id); }

  function isValidResumeUrl(url, kind){
    if(!url || typeof url !== "string") return false;
    if(kind === "product") return url.indexOf("#/product?code=") === 0;
    if(kind === "pay") return url.indexOf("#/pay?code=") === 0;
    return url.indexOf("#/") === 0;
  }

  function setResumeLink(el, key, kind){
    if(!el) return false;
    el.style.display = "none";
    el.removeAttribute("href");

    var url = null;
    try{ url = localStorage.getItem(key); }catch(e){}
    if(!isValidResumeUrl(url, kind)) return false;

    el.style.display = "flex";
    el.href = url;
    return true;
  }

  function renderGrid(){
    var grid = $("grid");
    if(!grid) return;
    grid.innerHTML = "";

    PRODUCTS.forEach(function(p){
      var a = document.createElement("a");
      a.className = "card";
      a.href = "#/product?code=" + encodeURIComponent(p.code);

      a.addEventListener("click", function(){
        try{ localStorage.setItem("lastProductUrl", a.href); }catch(e){}
      });

      a.innerHTML = `
        <img src="${p.photos[0] || ""}">
        <div class="meta">
          <p class="name">${p.name}</p>
          <p class="price">${rupiah(p.price)} • ${p.code}</p>
        </div>
      `;
      grid.appendChild(a);
    });
  }

  function initWelcomeAndMusic(){
    var overlay = $("welcomeOverlay");
    var btn = $("welcomeBtn");

    function startMusic(){
      if(window.__kyuseiMusic){
        window.__kyuseiMusic.play().catch(function(){});
      }
    }

    if(btn){
      btn.addEventListener("click", function(){
        sessionStorage.setItem("welcome_seen","1");
        if(overlay) overlay.style.display = "none";
        startMusic(); // <-- INI YANG PENTING
      });
    }

    // fallback: tap pertama di layar
    document.addEventListener("click", function once(){
      startMusic();
      document.removeEventListener("click", once);
    });
  }

  window.initHome = function(){
    document.title = SITE_NAME;

    // resume buttons
    var wrap = $("resumeWrap");
    var rp = $("resumeProduct");
    var ry = $("resumePay");

    if(wrap) wrap.style.display = "none";
    var hp = setResumeLink(rp, "lastProductUrl", "product");
    var hy = setResumeLink(ry, "lastPayUrl", "pay");
    if(wrap && (hp || hy)) wrap.style.display = "flex";

    renderGrid();
    initWelcomeAndMusic();

    if(window.__kyuseiMusic) window.__kyuseiMusic.rebind();
  };
})();
