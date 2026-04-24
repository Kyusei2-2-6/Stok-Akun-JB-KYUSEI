(function(){
  'use strict';
  var WA='https://wa.me/6283863831670';
  var FB='https://www.facebook.com/kyu.sei.924076';
  var TG='https://t.me/DedySetyadi226';
  function $(id){return document.getElementById(id)}
  function safe(v){return String(v==null?'':v)}
  function money(v){return typeof window.rupiah==='function'?window.rupiah(v):'Rp'+safe(v)}
  function get(params,k){return safe(params && params[k]).trim()}
  function find(code){var a=Array.isArray(window.PRODUCTS)?window.PRODUCTS:[]; return a.find(function(p){return safe(p.code)===safe(code)})}
  function game(g){g=safe(g).toLowerCase(); if(g==='genshin')return'Genshin Impact'; if(g==='toram')return'Toram Online'; if(g==='ml')return'Mobile Legends'; return 'Game Account'}
  function rawMsg(p){return 'Halo admin, saya mau beli akun '+safe(p.code)+' - '+safe(p.name)+' harga '+money(p.price)+'. Saya sudah bayar, ini bukti pembayarannya.';}
  function msg(p){return encodeURIComponent(rawMsg(p));}
  function notFound(code){var app=$('app'); if(app) app.innerHTML='<main class="wrap detailMain"><a class="backBtn" href="#/home">‹ Kembali</a><div class="emptyBox"><b>Produk tidak ditemukan</b><small>'+safe(code)+'</small></div></main>';}
  function openBuy(p){ if(!p || p.sold) return; var m=$('buyModal'); if(!m)return; if($('modalProduct'))$('modalProduct').textContent=safe(p.code)+' • '+safe(p.name); if($('modalPrice'))$('modalPrice').textContent=money(p.price); if($('modalWA'))$('modalWA').href=WA+'?text='+msg(p); if($('modalTG'))$('modalTG').href=TG; if($('modalFB'))$('modalFB').href=FB; m.classList.add('open'); m.setAttribute('aria-hidden','false'); }
  function closeBuy(){ var m=$('buyModal'); if(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')}}
  window.initProduct=function(params){
    var code=get(params,'code'), p=find(code); if(!p) return notFound(code);
    document.title=(p.name||'Produk')+' - Kyusei Store';
    var photos=Array.isArray(p.photos)?p.photos:[], cur=0;
    var hero=$('heroImg'), thumbs=$('thumbs'), title=$('prodName'), meta=$('prodMeta'), price=$('prodPrice'), status=$('prodStatus'), detail=$('detailList');
    if(title) title.textContent=p.name||'-'; if(meta) meta.textContent=(p.code||'-')+' • '+game(p.game); if(price) price.textContent=money(p.price); if(status){status.textContent=p.sold?'SOLD':'READY'; status.className='detailStatus '+(p.sold?'sold':'ready');}
    function set(i){ if(!photos.length) return; cur=(i+photos.length)%photos.length; if(hero){hero.src=photos[cur]; hero.alt=(p.name||'Produk')+' '+(cur+1);} var n=$('photoCount'); if(n)n.textContent=(cur+1)+' / '+photos.length; }
    set(0);
    if(thumbs){thumbs.innerHTML=''; photos.forEach(function(src,i){var im=document.createElement('img'); im.src=src; im.alt='Foto '+(i+1); im.loading='lazy'; im.onclick=function(){set(i)}; thumbs.appendChild(im);});}
    if(detail){detail.innerHTML=''; (Array.isArray(p.detail)?p.detail:[]).forEach(function(t){var li=document.createElement('li'); li.textContent=t; detail.appendChild(li);}); if(!detail.children.length){var li=document.createElement('li'); li.textContent='Detail belum diisi.'; detail.appendChild(li);} }
    var wa=$('waBtn'), tg=$('tgBtn'), fb=$('fbBtn'); if(wa)wa.href=WA+'?text='+msg(p); if(tg)tg.href=TG; if(fb)fb.href=FB;
    var buy=$('buyBtn'); if(buy){ buy.disabled=!!p.sold; buy.textContent=p.sold?'Sudah Terjual':'Beli Sekarang'; buy.onclick=function(){openBuy(p)}; }
    var close=$('closeBuyModal'), modal=$('buyModal'); if(close)close.onclick=closeBuy; if(modal)modal.onclick=function(e){if(e.target===modal)closeBuy()};
  };
})();
