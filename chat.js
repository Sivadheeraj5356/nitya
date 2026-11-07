(function(){
var CFG=window.NITYA_ASK||{deity:'krishna',name:'Krishna',texts:'the Bhagavad Gita',img:'../images/krishna.jpg',pre:'../'};
var EP='https://nitya-ask.sivadheeraj5356.workers.dev/ask';
var LANGS=[['auto','Auto (match my question)'],['en','English'],['hi','हिन्दी'],['ta','தமிழ்'],['te','తెలుగు'],['kn','ಕನ್ನಡ'],['ml','മലയാളം'],['bn','বাংলা'],['mr','मराठी'],['gu','ગુજરાતી'],['pa','ਪੰਜਾਬੀ'],['or','ଓଡ଼ିଆ'],['as','অসমীয়া'],['ur','اردو'],['sa','संस्कृतम्']];
var SPEECH={en:'en-IN',hi:'hi-IN',ta:'ta-IN',te:'te-IN',kn:'kn-IN',ml:'ml-IN',bn:'bn-IN',mr:'mr-IN',gu:'gu-IN',pa:'pa-IN',or:'or-IN',as:'as-IN',ur:'ur-IN',sa:'sa-IN'};
var thread=document.getElementById('thread'),form=document.getElementById('askform'),q=document.getElementById('askq'),chips=document.getElementById('chips'),langSel=document.getElementById('langsel'),mic=document.getElementById('micbtn'),spk=document.getElementById('spkbtn');
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function clean(t){return t.replace(/\*\*/g,'').replace(/\*/g,'').replace(/\x60/g,'').replace(/^#+\s*/gm,'').replace(/__/g,'').replace(/^\s*[-•]\s+/gm,'');}
function add(role,text){var d=document.createElement('div');d.className='msg '+role;
 if(role==='guide'){d.innerHTML='<img class="avatar" src="'+CFG.img+'" alt=""><div class="bubble">'+esc(clean(text)).split(/\n\s*\n/).map(function(p){return '<p>'+p.replace(/\n/g,'<br>')+'</p>';}).join('')+'</div>';}
 else{d.innerHTML='<div class="bubble">'+esc(text)+'</div>';}
 thread.appendChild(d);thread.scrollTop=thread.scrollHeight;return d;}
function T(k){return (window.NITYA_T&&NITYA_T(k))||null;}
function greetText(){var g=T('chat.greet')||'Namaste. I am {name}. Speak freely, dear one - what weighs on your heart today?';return g.split('{name}').join(CFG.name);}
var greetEl=add('guide',greetText());
var speakOn=false;
var FEM=['female','heera','swara','neerja','aarohi','lekha','kalpana','pallavi','shruti','sapna','sobhana','tanishaa','dhwani','aditi','veena','meera','samantha','zira','ananya','rani'];
var MAL=['male','ravi','prabhat','madhur','hemant','mohan','gagan','midhun','bashkar','manohar','niranjan','valluvar','arjun','rishi','kabir','bala'];
function pickVoice(code,g){
 var vs=speechSynthesis.getVoices();if(!vs.length)return null;
 var pool=vs.filter(function(x){return x.lang===code;});
 if(!pool.length)pool=vs.filter(function(x){return x.lang&&x.lang.slice(0,2)===code.slice(0,2);});
 if(!pool.length)return null;
 var hints=g==='f'?FEM:MAL,opp=g==='f'?MAL:FEM;
 for(var i=0;i<hints.length;i++){var h=hints[i];
  var v=pool.find(function(x){return x.name.toLowerCase().indexOf(h)>-1;});
  if(v&&v.name.toLowerCase().indexOf('female')>-1&&g!=='f')continue;
  if(v)return{voice:v,hinted:true};}
 var neutral=pool.find(function(x){var n=x.name.toLowerCase();return opp.every(function(h2){return h2.length<4||n.indexOf(h2)===-1;});});
 return{voice:neutral||pool[0],hinted:false};
}
function speak(text){
 if(!speakOn||!('speechSynthesis' in window))return;
 try{speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(clean(text).replace(/\(.*?\)/g,''));
  var code=SPEECH[langSel.value]||'en-IN';
  u.lang=code;
  var pk=pickVoice(code,CFG.gender||'m');
  if(pk&&pk.voice){u.voice=pk.voice;if(!pk.hinted)u.pitch=(CFG.gender==='f')?1.15:0.85;}
  else{u.pitch=(CFG.gender==='f')?1.15:0.85;}
  u.rate=0.95;speechSynthesis.speak(u);}catch(e){}
}
var fineEl=document.getElementById('chatfine');
function fineText(){var f=T('chat.fine');if(f&&fineEl)fineEl.textContent=f.split('{name}').join(CFG.name).split('{texts}').join(CFG.texts);}
function phText(){if(q.hasAttribute('data-i18n-ph'))return;var p=T('chat.ph_god');if(p)q.setAttribute('placeholder',p.split('{name}').join(CFG.name));}
function syncLangSel(){var sl=window.NITYA_LANG?NITYA_LANG():'en';if(sl!=='en'&&langSel.querySelector('option[value="'+sl+'"]'))langSel.value=sl;}
var langrow=document.querySelector('.langrow');
var vnote=document.createElement('div');vnote.id='voicenote';vnote.className='voice-note';
if(langrow&&langrow.parentNode)langrow.parentNode.insertBefore(vnote,langrow.nextSibling);
function checkVoice(){if(!('speechSynthesis' in window)){vnote.textContent='';return;}
 var code=SPEECH[langSel.value]||'en-IN';
 var vs=speechSynthesis.getVoices();
 var pool=vs.filter(function(x){return x.lang===code;});
 if(!pool.length)pool=vs.filter(function(x){return x.lang&&x.lang.slice(0,2)===code.slice(0,2);});
 if(!pool.length){var nm=(window.NITYA_NATIVE?NITYA_NATIVE(langSel.value):langSel.value);var s=T('chat.novoice')||'Your device has no {lang} voice - replies will be read in English (India).';vnote.textContent=s.split('{lang}').join(nm);}
 else{vnote.textContent='';}}
if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=checkVoice;}
langSel.addEventListener('change',checkVoice);
function applyLang(){fineText();phText();syncLangSel();checkVoice();
 if(greetEl&&thread.children.length===1){var bb=greetEl.querySelector('.bubble');if(bb)bb.innerHTML=esc(clean(greetText()));}}
window.addEventListener('nitya:lang',applyLang);
applyLang();
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