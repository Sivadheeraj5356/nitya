(function(){
function wrap(x,text,maxW){var words=text.split(/\s+/),lines=[],line='';for(var i=0;i<words.length;i++){var t=line?line+' '+words[i]:words[i];if(x.measureText(t).width>maxW&&line){lines.push(line);line=words[i];}else line=t;}if(line)lines.push(line);return lines;}
function draw(v){
 var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;
 var x=c.getContext('2d'),cx=W/2,y=118;
 x.fillStyle='#F7F2E8';x.fillRect(0,0,W,H);
 x.strokeStyle='#E3D9C4';x.lineWidth=3;x.strokeRect(28,28,W-56,H-56);
 x.textAlign='center';
 x.fillStyle='#A63A22';x.fillRect(cx-40,y,80,3);y+=52;
 x.fillStyle='#6B6255';x.font='500 26px Inter, sans-serif';
 x.fillText('BHAGAVAD GITA  '+v.c+'.'+v.v,cx,y);y+=72;
 x.fillStyle='#221E1A';x.font='44px "Tiro Devanagari Sanskrit", serif';
 v.sa.split('\n').forEach(function(ln){x.fillText(ln,cx,y);y+=62;});
 y+=16;
 x.fillStyle='#6B6255';x.font='italic 26px Fraunces, serif';
 wrap(x,v.tl.replace(/\n/g,' '),860).forEach(function(ln){x.fillText(ln,cx,y);y+=38;});
 y+=42;
 x.fillStyle='#221E1A';x.font='30px Inter, sans-serif';
 wrap(x,v.en,840).forEach(function(ln){x.fillText(ln,cx,y);y+=44;});
 x.fillStyle='#A63A22';x.font='600 32px Fraunces, serif';
 x.fillText('Nitya',cx,H-96);
 x.fillStyle='#6B6255';x.font='24px Inter, sans-serif';
 x.fillText('sivadheeraj5356.github.io/nitya',cx,H-58);
 return c;
}
function share(v){
 var done=function(){var c=draw(v);c.toBlob(function(b){
  var f;try{f=new File([b],'gita-'+v.c+'-'+v.v+'.png',{type:'image/png'});}catch(e){f=null;}
  if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Bhagavad Gita '+v.c+'-'+v.v+'.png'}).catch(function(){});}
  else{var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gita-'+v.c+'-'+v.v+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href);},4000);}
 },'image/png');};
 if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('44px "Tiro Devanagari Sanskrit"'),document.fonts.load('italic 26px Fraunces'),document.fonts.load('30px Inter')]).then(done).catch(done);}else done();
}
window.NITYA_SHARE_DRAW=draw;document.addEventListener('click',function(e){var b=e.target.closest('[data-share]');if(b&&window.NITYA_VERSE)share(window.NITYA_VERSE);});
})();