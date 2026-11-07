(function(){
  var SPEECH_LANG = {dev:'hi-IN',roman:'hi-IN',te:'te-IN',ta:'ta-IN',kn:'kn-IN',ml:'ml-IN',gu:'gu-IN',bn:'bn-IN'};
  function currentScript(){
    var b = document.querySelector('[data-script].on');
    return b ? b.getAttribute('data-script') : 'dev';
  }
  document.querySelectorAll('[data-script]').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('[data-script]').forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      var s = btn.getAttribute('data-script');
      document.querySelectorAll('[data-script-text]').forEach(function(el){
        if (el.getAttribute('data-script-text') === 'iast-view'){
          el.style.display = (s === 'roman') ? 'none' : '';
        } else {
          el.style.display = (el.getAttribute('data-script-text') === s) ? '' : 'none';
        }
      });
    });
  });
  var PLAY='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
  var PAUSE='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>';
  if (!('speechSynthesis' in window)) return;
  var queue = [];
  function pickVoice(lang){
    var vs = speechSynthesis.getVoices();
    var pre = lang.split('-')[0].toLowerCase();
    return vs.find(function(x){ return x.lang && x.lang.toLowerCase().indexOf(pre) === 0; })
        || vs.find(function(x){ return x.lang && x.lang.toLowerCase().indexOf('hi') === 0; });
  }
  function stopAll(){
    queue = [];
    speechSynthesis.cancel();
    document.querySelectorAll('.listen-btn.playing').forEach(function(x){
      x.classList.remove('playing'); var i = x.querySelector('.lic'); if (i) i.innerHTML = PLAY;
    });
  }
  function speakNext(){
    var item = queue.shift();
    if (!item){ stopAll(); return; }
    var u = new SpeechSynthesisUtterance(item.text);
    u.lang = item.lang; u.rate = .82;
    var v = pickVoice(item.lang);
    if (v) u.voice = v;
    u.onend = function(){ speakNext(); };
    u.onerror = function(){ speakNext(); };
    speechSynthesis.speak(u);
  }
  function verseText(card){
    var s = currentScript();
    var el = card.querySelector('[data-script-text="' + s + '"]');
    var lang = SPEECH_LANG[s] || 'hi-IN';
    if (!el || s === 'roman'){
      el = card.querySelector('[data-script-text="dev"]');
      lang = 'hi-IN';
    }
    return { text: el ? el.textContent.replace(/\s+/g,' ').trim() : '', lang: lang };
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-speak-verse]');
    if (b){
      if (b.classList.contains('playing')){ stopAll(); return; }
      stopAll();
      var card = b.closest('.vcard-verse');
      var item = verseText(card);
      if (!item.text) return;
      queue = [item];
      b.classList.add('playing');
      var ic = b.querySelector('.lic'); if (ic) ic.innerHTML = PAUSE;
      speakNext();
      return;
    }
    var a = e.target.closest('[data-speak-all]');
    if (a){
      if (a.classList.contains('playing')){ stopAll(); return; }
      stopAll();
      queue = [];
      document.querySelectorAll('.vcard-verse').forEach(function(card){
        var item = verseText(card);
        if (item.text) queue.push(item);
      });
      if (!queue.length) return;
      a.classList.add('playing');
      var ic2 = a.querySelector('.lic'); if (ic2) ic2.innerHTML = PAUSE;
      speakNext();
    }
  });
})();