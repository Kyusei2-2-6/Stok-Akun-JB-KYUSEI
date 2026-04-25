(function(){
  'use strict';
  var READY_PER_PAGE = 4;
  var SOLD_PER_PAGE = 6;
  var SOLD_COVER = 'assets/ui/sold-cover.png';
  var ADMIN_WA = '6283863831670';
  var ADMIN_TG = 'DedySetyadi226';
  var ADMIN_FB = 'https://www.facebook.com/kyu.sei.924076';
  var state = { q:'', game:'all', sort:'code', readyPage:1, soldPage:1 };

  function $(id){ return document.getElementById(id); }
  function safe(v){ return String(v == null ? '' : v); }
  function low(v){ return safe(v).toLowerCase(); }
  function rup(v){ return typeof window.rupiah === 'function' ? window.rupiah(v) : 'Rp' + safe(v); }
  function list(){ return Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : []; }
  function sold(p){ return p && p.sold === true; }
  function gameName(g){ g=low(g); if(g==='genshin')return 'Genshin Impact'; if(g==='toram')return 'Toram Online'; if(g==='ml')return 'Mobile Legends'; return 'Game Account'; }
  function match(p){
    if(state.game !== 'all' && low(p.game) !== state.game) return false;
    var q = low(state.q).trim();
    if(!q) return true;
    var detail = Array.isArray(p.detail) ? p.detail.join(' ') : '';
    return [p.code,p.name,p.game,p.price,detail].join(' ').toLowerCase().indexOf(q) !== -1;
  }
  function sortItems(items){
    return items.sort(function(a,b){
      if(state.sort === 'cheap') return Number(a.price||0)-Number(b.price||0);
      if(state.sort === 'expensive') return Number(b.price||0)-Number(a.price||0);
      if(state.sort === 'name') return safe(a.name).localeCompare(safe(b.name),'id');
      return safe(a.code).localeCompare(safe(b.code),'id',{numeric:true});
    });
  }
  function cover(p){ return sold(p) ? SOLD_COVER : ((p.photos && p.photos[0]) ? p.photos[0] : 'assets/ui/bg-grid.jpg'); }
  function detailLink(p){ return '#/product?code=' + encodeURIComponent(p.code || ''); }
  function openQR(p){
    if(!p || sold(p)) return;
    var m=$('qrModal'); if(!m) return;
    $('qrName').textContent = safe(p.code) + ' • ' + safe(p.name);
    $('qrPrice').textContent = rup(p.price);
    var text = 'Halo admin, saya mau beli akun ' + safe(p.code) + ' - ' + safe(p.name) + ' harga ' + rup(p.price) + '. Saya sudah scan QRIS, berikut bukti pembayaran saya.';
    $('qrWA').href = 'https://wa.me/' + ADMIN_WA + '?text=' + encodeURIComponent(text);
    $('qrTG').href = 'https://t.me/' + ADMIN_TG;
    $('qrFB').href = ADMIN_FB;
    m.classList.add('show'); m.setAttribute('aria-hidden','false');
  }
  function closeQR(){ var m=$('qrModal'); if(m){ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); } }
  function makeCard(p,i){
    var a=document.createElement('a');
    a.href=detailLink(p);
    a.className='productCard ' + (sold(p)?'isSold':'isReady');
    a.style.setProperty('--delay',(i*35)+'ms');
    var img=document.createElement('img'); img.src=cover(p); img.alt=p.name||'Produk'; img.loading='lazy';
    img.onerror=function(){ if(sold(p) && p.photos && p.photos[0]) img.src=p.photos[0]; };
    var top=document.createElement('div'); top.className='cardImg'; top.appendChild(img);
    var badge=document.createElement('span'); badge.className='badge '+(sold(p)?'soldBadge':'readyBadge'); badge.textContent=sold(p)?'SOLD':'READY'; top.appendChild(badge);
    var body=document.createElement('div'); body.className='cardBody';
    body.innerHTML='<div class="nameRow"><h3></h3><b></b></div><p class="price"></p><p class="game"></p>';
    body.querySelector('h3').textContent = p.name || '-';
    body.querySelector('b').textContent = p.code || '-';
    body.querySelector('.price').textContent = rup(p.price);
    body.querySelector('.game').textContent = gameName(p.game);
    if(!sold(p)){
      var buy=document.createElement('button'); buy.type='button'; buy.className='buyBtn'; buy.innerHTML='☎'; buy.setAttribute('aria-label','Beli '+(p.name||''));
      buy.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); openQR(p); });
      body.appendChild(buy);
    }
    a.appendChild(top); a.appendChild(body);
    return a;
  }
  function empty(text){ var d=document.createElement('div'); d.className='emptyBox'; d.textContent=text; return d; }
  function renderGrid(items,id,page,per,emptyText){
    var g=$(id); if(!g) return {page:1,totalPages:1,total:items.length};
    g.innerHTML='';
    var totalPages=Math.max(1,Math.ceil(items.length/per)); page=Math.min(Math.max(1,page),totalPages);
    if(!items.length){ g.appendChild(empty(emptyText)); return {page:page,totalPages:totalPages,total:0}; }
    items.slice((page-1)*per,page*per).forEach(function(p,i){ g.appendChild(makeCard(p,i)); });
    return {page:page,totalPages:totalPages,total:items.length};
  }
  function renderPager(id,infoId,page,totalPages,total,onGo){
    var p=$(id), info=$(infoId); if(info) info.textContent = total ? ('Hal. '+page+'/'+totalPages) : '0 item';
    if(!p) return; p.innerHTML='';
    if(totalPages<=1){ p.style.display='none'; return; }
    p.style.display='flex';
    function add(txt,target,active,disabled){ var b=document.createElement('button'); b.type='button'; b.className='pageBtn'+(active?' active':''); b.textContent=txt; b.disabled=!!disabled; b.onclick=function(){ if(disabled)return; onGo(target); }; p.appendChild(b); }
    add('‹',page-1,false,page<=1);
    for(var i=1;i<=totalPages;i++){ if(i===1||i===totalPages||Math.abs(i-page)<=1) add(String(i),i,i===page,false); else if(i===page-2||i===page+2){ var s=document.createElement('span'); s.className='dots'; s.textContent='…'; p.appendChild(s); } }
    add('›',page+1,false,page>=totalPages);
  }
  function render(){
    var all=sortItems(list().filter(match));
    var ready=all.filter(function(p){return !sold(p);});
    var solds=all.filter(sold);
    if($('statReady')) $('statReady').textContent=ready.length;
    if($('statSold')) $('statSold').textContent=solds.length;
    if($('statTotal')) $('statTotal').textContent=all.length;
    var r=renderGrid(ready,'readyGrid',state.readyPage,READY_PER_PAGE,'Belum ada produk ready.'); state.readyPage=r.page;
    renderPager('readyPagination','readyPageInfo',state.readyPage,r.totalPages,ready.length,function(n){ state.readyPage=n; render(); });
    var s=renderGrid(solds,'soldGrid',state.soldPage,SOLD_PER_PAGE,'Belum ada produk sold.'); state.soldPage=s.page;
    renderPager('soldPagination','soldPageInfo',state.soldPage,s.totalPages,solds.length,function(n){ state.soldPage=n; render(); });
  }
  function welcome(){
    var ov=$('welcomeOverlay'); if(!ov) return;
    var done=false; try{ done=sessionStorage.getItem('kyuseiWelcomeSeen')==='1'; }catch(e){}
    if(!done){ ov.classList.add('show'); ov.setAttribute('aria-hidden','false'); }
    function close(){ ov.classList.remove('show'); ov.setAttribute('aria-hidden','true'); try{ sessionStorage.setItem('kyuseiWelcomeSeen','1'); }catch(e){} }
    ['welcomeBtn','welcomeClose'].forEach(function(id){ var b=$(id); if(b) b.onclick=close; });
  }
  function bind(){
    var inp=$('catalogSearch'), clear=$('clearSearch'), gf=$('gameFilter'), sf=$('sortFilter'), qc=$('qrClose'), qm=$('qrModal');
    if(inp) inp.oninput=function(){ state.q=inp.value; state.readyPage=1; state.soldPage=1; render(); };
    if(clear) clear.onclick=function(){ state.q=''; if(inp)inp.value=''; state.readyPage=1; state.soldPage=1; render(); };
    if(gf) gf.onchange=function(){ state.game=gf.value; state.readyPage=1; state.soldPage=1; render(); };
    if(sf) sf.onchange=function(){ state.sort=sf.value; render(); };
    if(qc) qc.onclick=closeQR;
    if(qm) qm.addEventListener('click',function(e){ if(e.target===qm) closeQR(); });
  }
  window.initHome=function(){ if($('siteName') && window.SITE_NAME) $('siteName').textContent=window.SITE_NAME; state={q:'',game:'all',sort:'code',readyPage:1,soldPage:1}; bind(); welcome(); render(); };
})();
