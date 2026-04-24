(function(){
  'use strict';
  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var SOLD_COVER = 'assets/ui/sold-cover.png';
  var SOCIAL = {
    wa: 'https://wa.me/6283863831670',
    fb: 'https://www.facebook.com/kyu.sei.924076',
    tg: 'https://t.me/DedySetyadi226'
  };
  var currentGame = 'all', query = '', readyPage = 1, soldPage = 1;
  function $(id){ return document.getElementById(id); }
  function safe(v){ return String(v == null ? '' : v); }
  function low(v){ return safe(v).toLowerCase(); }
  function arr(){ return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : []; }
  function isSold(p){ return p && p.sold === true; }
  function rupiah(v){ return typeof window.rupiah === 'function' ? window.rupiah(v) : 'Rp' + safe(v); }
  function labelGame(g){ g=low(g); if(g==='genshin') return 'Genshin Impact'; if(g==='toram') return 'Toram Online'; if(g==='ml') return 'Mobile Legends'; return 'Game Account'; }
  function matchGame(p){ return currentGame === 'all' || low(p.game) === currentGame; }
  function matchQuery(p){
    var q = low(query).trim(); if(!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(' ') : '';
    return low([p.code,p.name,p.game,p.price,detail].join(' ')).indexOf(q) !== -1;
  }
  function list(){ return arr().filter(function(p){ return matchGame(p) && matchQuery(p); }).sort(function(a,b){ return safe(a.code).localeCompare(safe(b.code),'id',{numeric:true}); }); }
  function imgOf(p){ return isSold(p) ? SOLD_COVER : ((p.photos && p.photos[0]) ? p.photos[0] : 'assets/ui/top.png'); }
  function card(p,i){
    var a=document.createElement('a');
    a.className='productCard ' + (isSold(p)?'isSold':'isReady');
    a.href='#/product?code=' + encodeURIComponent(p.code || '');
    a.style.setProperty('--d', (i*42)+'ms');
    var img=document.createElement('img'); img.src=imgOf(p); img.alt=p.name || 'Produk'; img.loading='lazy';
    img.onerror=function(){ img.src='assets/ui/top.png'; };
    var pic=document.createElement('div'); pic.className='pic';
    var badge=document.createElement('span'); badge.className='badge ' + (isSold(p)?'soldBadge':'readyBadge'); badge.textContent=isSold(p)?'SOLD':'READY';
    pic.appendChild(img); pic.appendChild(badge);
    var body=document.createElement('div'); body.className='cardBody';
    body.innerHTML = '<div class="nameRow"><h3></h3><b></b></div><p class="price"></p><p class="game"></p>';
    body.querySelector('h3').textContent = p.name || '-';
    body.querySelector('b').textContent = p.code || '-';
    body.querySelector('.price').textContent = rupiah(p.price);
    body.querySelector('.game').textContent = labelGame(p.game);
    a.appendChild(pic); a.appendChild(body);
    return a;
  }
  function renderGrid(items,id,page,per,empty){
    var el=$(id); if(!el) return {page:1,pages:1}; el.innerHTML='';
    var pages=Math.max(1,Math.ceil(items.length/per)); page=Math.min(Math.max(1,page),pages);
    if(!items.length){ var d=document.createElement('div'); d.className='emptyBox'; d.innerHTML='<b>'+empty+'</b><small>Coba ubah pencarian/filter.</small>'; el.appendChild(d); return {page:page,pages:pages}; }
    items.slice((page-1)*per,page*per).forEach(function(p,i){ el.appendChild(card(p,i)); });
    return {page:page,pages:pages};
  }
  function pager(id,infoId,page,pages,count,go){
    var box=$(id), info=$(infoId); if(info) info.textContent = count ? ('Hal. '+page+'/'+pages) : '0 item';
    if(!box) return; box.innerHTML=''; if(pages<=1){ box.style.display='none'; return; } box.style.display='flex';
    function btn(t,target,dis,act){ var b=document.createElement('button'); b.type='button'; b.className='pageBtn'+(act?' active':''); b.textContent=t; b.disabled=!!dis; b.onclick=function(){ if(dis) return; go(target); setTimeout(function(){ box.scrollIntoView({behavior:'smooth',block:'center'}); },30); }; box.appendChild(b); }
    btn('‹',page-1,page<=1,false);
    var nums=[]; for(var i=1;i<=pages;i++){ if(i===1||i===pages||Math.abs(i-page)<=1) nums.push(i); }
    var last=0; nums.forEach(function(n){ if(n-last>1){ var s=document.createElement('span'); s.className='dots'; s.textContent='…'; box.appendChild(s); } btn(String(n),n,false,n===page); last=n; });
    btn('›',page+1,page>=pages,false);
  }
  function render(){
    var all=list(), ready=all.filter(function(p){return !isSold(p)}), sold=all.filter(isSold);
    if($('statReady')) $('statReady').textContent=ready.length; if($('statSold')) $('statSold').textContent=sold.length; if($('statTotal')) $('statTotal').textContent=all.length;
    var r=renderGrid(ready,'readyGrid',readyPage,READY_PER_PAGE,'Belum ada produk ready'); readyPage=r.page; pager('readyPagination','readyPageInfo',readyPage,r.pages,ready.length,function(p){readyPage=p;render();});
    var s=renderGrid(sold,'soldGrid',soldPage,SOLD_PER_PAGE,'Belum ada produk sold'); soldPage=s.page; pager('soldPagination','soldPageInfo',soldPage,s.pages,sold.length,function(p){soldPage=p;render();});
  }
  function initDropdown(){ var btn=$('logoBtn'), menu=$('dropdown'); if(!btn||!menu) return; function close(){menu.classList.remove('open');} btn.onclick=function(e){e.stopPropagation(); menu.classList.toggle('open');}; menu.onclick=function(e){ var it=e.target.closest('.ddItem'); if(!it)return; currentGame=low(it.dataset.game||'all'); readyPage=1; soldPage=1; render(); close(); }; document.addEventListener('click',close); }
  function initSearch(){ var i=$('catalogSearch'), c=$('clearSearch'); if(i) i.oninput=function(){query=i.value; readyPage=1; soldPage=1; render();}; if(c) c.onclick=function(){ if(i)i.value=''; query=''; readyPage=1; soldPage=1; render(); }; }
  function initWelcome(){ var ov=$('welcomeOverlay'), btn=$('welcomeBtn'); if(!ov||!btn)return; try{ if(localStorage.getItem('kyuseiWelcomeDone')==='1') return; }catch(e){} ov.classList.add('show'); btn.onclick=function(){ ov.classList.remove('show'); try{localStorage.setItem('kyuseiWelcomeDone','1')}catch(e){} }; }
  window.initHome=function(){ if($('siteName') && window.SITE_NAME) $('siteName').textContent=window.SITE_NAME; document.title=(window.SITE_NAME||'Kyusei')+' Store'; currentGame='all'; query=''; readyPage=1; soldPage=1; initWelcome(); initDropdown(); initSearch(); render(); };
})();
