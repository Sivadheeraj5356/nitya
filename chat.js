(function(){
var CFG=window.NITYA_ASK||{deity:'krishna',name:'Krishna',texts:'the Bhagavad Gita',img:'../images/krishna.jpg',pre:'../'};
var EP='https://nitya-ask.sivadheeraj5356.workers.dev/ask';
var LANGS=[['auto','Auto (match my question)'],['en','English'],['hi','हिन्दी'],['ta','தமிழ்'],['te','తెలుగు'],['kn','ಕನ್ನಡ'],['ml','മലയാളം'],['bn','বাংলা'],['mr','मराठी'],['gu','ગુજરાતી'],['pa','ਪੰਜਾਬੀ'],['or','ଓଡ଼ିଆ'],['as','অসমীয়া'],['ur','اردو'],['sa','संस्कृतम्']];
var SPEECH={en:'en-IN',hi:'hi-IN',ta:'ta-IN',te:'te-IN',kn:'kn-IN',ml:'ml-IN',bn:'bn-IN',mr:'mr-IN',gu:'gu-IN',pa:'pa-IN',or:'or-IN',as:'as-IN',ur:'ur-IN',sa:'sa-IN'};
var thread=document.getElementById('thread'),form=document.getElementById('askform'),q=document.getElementById('askq'),chips=document.getElementById('chips'),langSel=document.getElementById('langsel'),mic=document.getElementById('micbtn'),spk=document.getElementById('spkbtn');
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function add(role,text){var d=document.createElement('div');d.className='msg '+role;
 if(role==='guide'){d.innerHTML='<img class="avatar" src="'+CFG.img+'" alt=""><div class="bubble">'+esc(text).split(/\n\s*\n/).map(function(p){return '<p>'+p.replace(/\n/g,'<br>')+'</p>';}).join('')+'</div>';}
 else{d.innerHTML='<div class="bubble">'+esc(text)+'</div>';}
 thread.appendChild(d);thread.scrollTop=thread.scrollHeight;return d;}
add('guide','Namaste. I am a humble guide who answers only through '+CFG.texts+'. What weighs on your mind today?');
var speakOn=false;
function speak(text){
 if(!speakOn||!('speechSynthesis' in window))return;
 try{speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text.replace(/\(.*?\)/g,''));
  var code=SPEECH[langSel.value]||'en-IN';
  u.lang=code;
  var vs=speechSynthesis.getVoices(),v=vs.find(function(x){return x.lang===code;})||vs.find(function(x){return x.lang&&x.lang.slice(0,2)===code.slice(0,2);});
  if(v)u.voice=v;
  u.rate=0.95;speechSynthesis.speak(u);}catch(e){}
}
if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=function(){};}
var pending=null;
function ask(text){if(pending)return;add('user',text);
 pending=add('guide','');pending.querySelector('.bubble').innerHTML='<span class="dots"><i></i><i></i><i></i></span>';
 fetch(EP,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q:text,deity:CFG.deity,lang:langSel.value})})
 .then(function(r){return r.json();})
 .then(function(j){pending.remove();pending=null;
  if(j.answer){add('guide',j.answer);speak(j.answer);}
  else{add('guide',j.error||'The guide is quiet right now. Please try again in a little while.');}})
 .catch(function(){pending.remove();pending=null;add('guide','The connection faltered. Please try again in a moment.');});}
form.addEventListener('submit',function(e){e.preventDefault();var t=q.value.trim();if(!t)return;q.value='';ask(t);});
chips.addEventListener('click',function(e){var b=e.target.closest('button');if(b)ask(b.textContent);});
if(spk){spk.addEventListener('click',function(){speakOn=!speakOn;spk.classList.toggle('on',speakOn);spk.setAttribute('aria-pressed',speakOn);if(!speakOn&&'speechSynthesis' in window)speechSynthesis.cancel();});}
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(mic){if(!SR){mic.style.display='none';}
 else{var rec=null,listening=false;
  mic.addEventListener('click',function(){
   if(listening){try{rec.stop();}catch(e){}return;}
   rec=new SR();var code=SPEECH[langSel.value]||'en-IN';rec.lang=code==='en-IN'?'en-IN':code;rec.interimResults=true;rec.maxAlternatives=1;
   rec.onresult=function(e){var t='';for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;q.value=t;if(e.results[e.results.length-1].isFinal){var s=q.value.trim();q.value='';if(s){speakOn=true;spk&&spk.classList.add('on');ask(s);}}};
   rec.onend=function(){listening=false;mic.classList.remove('on');};
   rec.onerror=function(){listening=false;mic.classList.remove('on');};
   try{rec.start();listening=true;mic.classList.add('on');}catch(e){}
  });}}
})();