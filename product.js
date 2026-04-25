(function(){
  'use strict';
  var ADMIN_WA='6283863831670', ADMIN_TG='DedySetyadi226', ADMIN_FB='https://www.facebook.com/kyu.sei.924076';
  function $(id){return document.getElementById(id);} function safe(v){return String(v==null?'':v);} function rup(v){return typeof window.rupiah==='function'?window.rupiah(v):'Rp'+safe(v);} function find(code){var arr=Array.isArray(window.PRODUCTS)?window.PRODUCTS:[];return arr.find(function(p){return safe(p.code)===safe(code);});}
  function paramsVal(params,k){return params&&params[k]?params[k]:'';} function resolve(p){try{return new URL(p,document.baseURI).href}catch(e){return p;}}
  function openQR(p){ if(!p||p.sold) return; var m=$('qrModal'); if(!m)return; $('qrName').textContent=safe(p.code)+' • '+safe(p.name); $('qrPrice').textContent=rup(p.price); var text='Halo admin, saya mau beli akun '+safe(p.code)+' - '+safe(p.name)+' harga '+rup(p.price)+'. Saya sudah scan QRIS, berikut bukti pembayaran saya.'; $('qrWA').href='https://wa.me/'+ADMIN_WA+'?text='+encodeURIComponent(text); $('qrTG').href='https://t.me/'+ADMIN_TG; $('qrFB').href=ADMIN_FB; m.classList.add('show'); m.setAttribute('aria-hidden','false'); }
  function closeQR(){var m=$('qrModal'); if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true');}}
  window.initProduct=function(params){
    var code=paramsVal(params,'code'), p=find(code); if(!p){document.getElementById('app').innerHTML='<main class="wrap"><p>Produk tidak ditemukan.</p><a class="btn" href="#/home">Kembali</a></main>';return;}
    document.title=(p.name||'Produk')+' - Kyusei Store'; $('prodName').textContent=p.name||'Produk'; $('prodMeta').textContent=safe(p.code)+' • '+rup(p.price)+(p.sold?' • SOLD':'');
    var photos=Array.isArray(p.photos)?p.photos:[], current=0, hero=$('heroImg'), thumbs=$('thumbs');
    function setHero(i){ if(!photos.length)return; current=(i+photos.length)%photos.length; hero.src=resolve(photos[current]); hero.alt=(p.name||'Produk')+' '+(current+1); }
    setHero(0); thumbs.innerHTML=''; photos.forEach(function(src,i){var im=document.createElement('img'); im.src=resolve(src); im.alt='Foto '+(i+1); im.onclick=function(){openLight(i)}; thumbs.appendChild(im);});
    var buy=$('buyDetailBtn'); if(p.sold){buy.textContent='SOLD'; buy.disabled=true; buy.style.opacity='.55';} else buy.onclick=function(){openQR(p)};
    function renderLight(){if(!$('lbImg')||!photos.length)return; $('lbImg').src=resolve(photos[current]); $('lbCaption').textContent=(p.name||'Produk')+' • '+(current+1)+' / '+photos.length;}
    function openLight(i){if(!photos.length)return; current=i; $('lightbox').classList.add('open'); $('lightbox').setAttribute('aria-hidden','false'); renderLight();}
    function closeLight(){ $('lightbox').classList.remove('open'); $('lightbox').setAttribute('aria-hidden','true'); }
    $('openLightboxBtn').onclick=function(){openLight(current)}; $('lbClose').onclick=closeLight; $('lbPrev').onclick=function(){current=(current-1+photos.length)%photos.length;renderLight();}; $('lbNext').onclick=function(){current=(current+1)%photos.length;renderLight();}; $('lightbox').onclick=function(e){if(e.target===$('lightbox'))closeLight();};
    function openDetail(){var m=$('detailModal'), list=$('detailList'), empty=$('detailEmpty'); $('detailSub').textContent=safe(p.code)+' • '+rup(p.price)+(p.sold?' • SOLD':''); list.innerHTML=''; var det=Array.isArray(p.detail)?p.detail:[]; if(!det.length){empty.style.display='block';}else{empty.style.display='none'; det.forEach(function(t){var li=document.createElement('li');li.textContent=safe(t);list.appendChild(li);});} m.classList.add('open'); m.setAttribute('aria-hidden','false');}
    function closeDetail(){var m=$('detailModal');m.classList.remove('open');m.setAttribute('aria-hidden','true');}
    $('detailBtn').onclick=openDetail; $('detailClose').onclick=closeDetail; $('detailModal').onclick=function(e){if(e.target===$('detailModal'))closeDetail();};
    $('qrClose').onclick=closeQR; $('qrModal').onclick=function(e){if(e.target===$('qrModal'))closeQR();};
  };
})();
