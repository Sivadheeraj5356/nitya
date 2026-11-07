(function(){
  // reveal on scroll
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12}) : null;
  document.querySelectorAll('.reveal').forEach(function(el){ io ? io.observe(el) : el.classList.add('in'); });

  // verse search filter (gita chapter pages + index)
  var s = document.querySelector('[data-search]');
  if (s){
    s.addEventListener('input', function(){
      var q = s.value.trim().toLowerCase();
      document.querySelectorAll('[data-vrow]').forEach(function(r){
        r.style.display = (!q || r.textContent.toLowerCase().indexOf(q) > -1) ? '' : 'none';
      });
    });
  }

  // EN / HI toggle on verse pages
  document.querySelectorAll('[data-lang]').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('[data-lang]').forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      var lang = btn.getAttribute('data-lang');
      document.querySelectorAll('[data-mean]').forEach(function(m){
        m.style.display = m.getAttribute('data-mean') === lang ? '' : 'none';
      });
    });
  });

  // mala
  var ring = document.getElementById('malaRing');
  if (ring){
    var NS = 'http://www.w3.org/2000/svg';
    var svg = ring.querySelector('svg');
    var countEl = document.getElementById('malaCount');
    var roundEl = document.getElementById('malaRound');
    var todayEl = document.getElementById('malaToday');
    var mantraEl = document.getElementById('malaMantra');
    var beads = [];
    var R = 46, CX = 50, CY = 50;
    for (var i = 0; i < 108; i++){
      var a = (i / 108) * Math.PI * 2 - Math.PI / 2;
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', CX + R * Math.cos(a));
      c.setAttribute('cy', CY + R * Math.sin(a));
      c.setAttribute('r', i % 27 === 0 ? 1.45 : 1.05);
      c.setAttribute('fill', 'var(--line-2)');
      c.setAttribute('data-i', i);
      svg.appendChild(c);
      beads.push(c);
    }
    function dayKey(){ return new Date().toISOString().slice(0,10); }
    var state = { count: 0, rounds: 0, today: 0, mantra: 'ॐ नमः शिवाय' };
    try {
      var saved = JSON.parse(localStorage.getItem('nitya-mala') || 'null');
      if (saved){ state.rounds = saved.rounds || 0; state.mantra = saved.mantra || state.mantra; if (saved.day === dayKey()) state.today = saved.today || 0; }
    } catch(e){}
    function paint(){
      countEl.textContent = state.count;
      roundEl.textContent = state.rounds;
      todayEl.textContent = state.today;
      mantraEl.textContent = state.mantra;
      beads.forEach(function(b, i){ b.setAttribute('fill', i < state.count ? 'var(--accent)' : 'var(--line-2)'); });
    }
    function save(){ try { localStorage.setItem('nitya-mala', JSON.stringify({rounds: state.rounds, today: state.today, day: dayKey(), mantra: state.mantra})); } catch(e){} }
    function tap(){
      state.count++; state.today++;
      if (state.count >= 108){ state.count = 0; state.rounds++; }
      paint(); save();
      if (navigator.vibrate){ try { navigator.vibrate(state.count === 0 ? [40,60,40] : 12); } catch(e){} }
      ring.style.transform = 'scale(.985)';
      setTimeout(function(){ ring.style.transform = ''; }, 90);
    }
    ring.addEventListener('click', tap);
    document.addEventListener('keydown', function(e){ if (e.code === 'Space' && !e.repeat && document.getElementById('malaRing')){ e.preventDefault(); tap(); } });
    document.getElementById('malaReset').addEventListener('click', function(){ state.count = 0; state.rounds = 0; paint(); save(); });
    document.querySelectorAll('[data-mantra]').forEach(function(chip){
      chip.addEventListener('click', function(){
        document.querySelectorAll('[data-mantra]').forEach(function(c){ c.classList.remove('on'); });
        chip.classList.add('on');
        state.mantra = chip.getAttribute('data-mantra'); paint(); save();
      });
    });
    ring.style.transition = 'transform .12s';
    paint();
  }
})();
// PWA
if ('serviceWorker' in navigator){
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
  // when a new service worker takes over (e.g. after a site update), reload once so the fresh page shows
  var _swr=false;
  navigator.serviceWorker.addEventListener('controllerchange', function(){
    if(_swr) return; _swr=true;
    try{ if(sessionStorage.getItem('nitya-swr')) return; sessionStorage.setItem('nitya-swr','1'); }catch(e){}
    location.reload();
  });
}
// voice: recitation audio + speech
(function(){
  var PLAY='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var PAUSE='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>';
  var cur = null, curBtn = null;
  function stopCur(){
    if (cur){ cur.pause(); cur = null; }
    if (curBtn){ curBtn.classList.remove('playing'); var i = curBtn.querySelector('.lic'); if (i) i.innerHTML = PLAY; curBtn = null; }
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-listen]');
    if (b){
      if (curBtn === b){ stopCur(); return; }
      stopCur();
      var a = new Audio(b.getAttribute('data-listen'));
      a.preload = 'auto';
      cur = a; curBtn = b;
      b.classList.add('playing');
      var ic = b.querySelector('.lic'); if (ic) ic.innerHTML = PAUSE;
      a.addEventListener('ended', stopCur);
      a.addEventListener('error', stopCur);
      a.play().catch(stopCur);
      return;
    }
    var s = e.target.closest('[data-speak]');
    if (s){
      stopCur();
      if (!('speechSynthesis' in window)) return;
      if (s.classList.contains('playing')){ speechSynthesis.cancel(); s.classList.remove('playing'); var i2 = s.querySelector('.lic'); if (i2) i2.innerHTML = PLAY; return; }
      speechSynthesis.cancel();
      document.querySelectorAll('[data-speak].playing').forEach(function(x){ x.classList.remove('playing'); var xi = x.querySelector('.lic'); if (xi) xi.innerHTML = PLAY; });
      var u = new SpeechSynthesisUtterance(s.getAttribute('data-speak'));
      u.lang = 'hi-IN'; u.rate = .82;
      var vs = speechSynthesis.getVoices();
      var v = vs.find(function(x){ return x.lang && x.lang.toLowerCase().indexOf('hi') === 0; }) || vs.find(function(x){ return x.lang && x.lang.toLowerCase().indexOf('sa') === 0; });
      if (v) u.voice = v;
      s.classList.add('playing');
      var ic2 = s.querySelector('.lic'); if (ic2) ic2.innerHTML = PAUSE;
      u.onend = u.onerror = function(){ s.classList.remove('playing'); if (ic2) ic2.innerHTML = PLAY; };
      speechSynthesis.speak(u);
    }
  });
})();
