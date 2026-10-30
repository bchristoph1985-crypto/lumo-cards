/* Lumo browser character, adapted from the existing TV renderer. No network or audio. */
(function(){'use strict';window.LumoCharacter={mount:function(canvas,provider,options){
 var motion=window.LumoMotionFactory();
 var atlas=new Image(),sprites=[],loaded=false,failed=false,frames=0,raf=null,lastFrame=0,start=performance.now(),lastTick=0,destroyed=false;
 var motionClock=0,rocketProgress=0,reduced=false,flightAt=-100000,flightDirection=1,travelLift=0,travelLean=0;
 var habit=0,habitAt=0,nextHabit=8,nextBlink=3,blinkAt=-10,doubleBlink=false,micro={x:0,y:0},nextGlance=0;
  var face={browL:0,browR:0,slopeL:0,slopeR:0,lidL:1,lidR:1,jaw:0,width:19,round:0,smile:.8,cheek:.1,pupil:1,gazeX:0,gazeY:0,viseme:'rest',emotion:'friendly'},micro={x:0,y:0},nextGlance=0;
 var bodyPose={x:0,y:0,lean:0,head:0,yaw:0,left:0,right:0,leftY:0,rightY:0,leftX:0,rightX:0,rotation:0,scale:1},motionClock=0,rocketProgress=0;
 var blend={dance:0,sleep:0,drowsy:0,thinking:0,awake:1,alert:0,cheer:0,present:0,talk:0,lookX:0,lookY:0,motionWeight:1};
 function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
 function express(t,dt,story,talking){var sleep=Math.max(blend.sleep,blend.drowsy),joy=clamp(blend.cheer+blend.dance*.45+blend.awake*.3,0,1),thought=blend.thinking,alert=blend.alert,curious=habit===2?Math.sin(clamp((t-habitAt)/2,0,1)*Math.PI):0;
  if(t>nextGlance){micro={x:(Math.random()-.5)*2.6,y:(Math.random()-.5)*1.5};nextGlance=t+1.7+Math.random()*2.5;}
  var phoneme='rest',jaw=0,width=19,round=0;
  if(talking&&!reduced){var index=story.speechIndex==null?Math.floor(t*28):story.speechIndex,c=story.story.text.charAt(Math.max(0,index-1)).toLowerCase();phoneme=/[aä]/.test(c)?'a':/[eiä]/.test(c)?'e':/[oö]/.test(c)?'o':/[uü]/.test(c)?'u':/[mbp]/.test(c)?'closed':/[fvwt]/.test(c)?'thin':/[\s.,!?;:–—]/.test(c)?'pause':'mid';
   var shape={a:[23,23,.15],e:[11,29,.05],o:[27,14,1],u:[20,11,1],closed:[0,16,0],thin:[5,24,.05],pause:[0,18,0],mid:[13,21,.25]}[phoneme];jaw=shape[0]*.9;width=shape[1];round=shape[2];
  }
  face.viseme=phoneme;face.emotion=sleep>.5?'sleepy':alert>.4?'attentive':thought>.4?'thinking':joy>.4?'happy':curious>.3?'curious':'friendly';
  var targets={browL:joy*7+alert*9+thought*13+curious*12-sleep*7,browR:joy*9+alert*9-thought*4-curious*3-sleep*7,slopeL:thought*-.14+curious*.12,slopeR:thought*.14-curious*.06,lidL:1-joy*.1-sleep*.82-curious*.14,lidR:1-joy*.1-sleep*.82-thought*.17,pupil:1+alert*.1+joy*.08-sleep*.16,jaw:jaw+(talking?0:alert*7),width:talking?width:19+joy*7-thought*8-sleep*8,round:talking?round:alert*.5,smile:clamp(.7+joy*.4-thought*.6-sleep*.7,0,1),cheek:.08+joy*.4,gazeX:clamp(blend.lookX+micro.x*(1-sleep),-9,9),gazeY:clamp(blend.lookY+micro.y*(1-sleep),-6,6)};
  for(var key in targets){var rate=key==='gazeX'||key==='gazeY'?8:key==='jaw'?10:4.5;face[key]+=(targets[key]-face[key])*(1-Math.exp(-dt*rate));}
 }
 function brow(ctx,x,lift,slope,left){ctx.save();ctx.translate(x,-43-lift);ctx.rotate(slope);ctx.strokeStyle='#aaf5ff';ctx.lineWidth=4.5;ctx.lineCap='round';ctx.shadowColor='#62eaff';ctx.shadowBlur=9;ctx.beginPath();ctx.moveTo(-24,left?3:0);ctx.quadraticCurveTo(0,-10,24,left?0:3);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='rgba(235,255,255,.65)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-15,-2);ctx.quadraticCurveTo(0,-7,15,-2);ctx.stroke();ctx.restore();}
 function mouthPath(ctx,w,y,h,smile,round){ctx.beginPath();ctx.moveTo(-w,y-3*smile);ctx.bezierCurveTo(-w*.6,y-5*round,w*.6,y-5*round,w,y-3*smile);ctx.bezierCurveTo(w*.9,y+h+4*smile,-w*.9,y+h+4*smile,-w,y-3*smile);ctx.closePath();}
 function mouth(ctx){var y=57,w=face.width,h=face.jaw,smile=face.smile;ctx.save();ctx.strokeStyle='#a4f5ff';ctx.lineWidth=3.6;ctx.lineCap='round';ctx.shadowColor='#68e8ff';ctx.shadowBlur=8;
  if(h<2){ctx.beginPath();ctx.moveTo(-w,y-2*smile);ctx.quadraticCurveTo(0,y+17*smile,w,y-2*smile);ctx.stroke();}
  else{mouthPath(ctx,w,y,h,smile,face.round);ctx.fillStyle='#03141e';ctx.fill();ctx.save();ctx.clip();ctx.shadowBlur=0;
   var inner=ctx.createLinearGradient(0,y,0,y+h);inner.addColorStop(0,'#08283b');inner.addColorStop(1,'#174359');ctx.fillStyle=inner;ctx.fillRect(-w-2,y-5,w*2+4,h+15);
   if(h>9){ctx.fillStyle='rgba(218,251,255,.8)';ctx.fillRect(-w*.6,y,w*1.2,2.5);ctx.fillStyle='rgba(106,196,219,.65)';ctx.beginPath();ctx.ellipse(0,y+h*.84,w*.5,Math.max(2,h*.18),0,0,Math.PI*2);ctx.fill();}ctx.restore();mouthPath(ctx,w,y,h,smile,face.round);ctx.stroke();}
  ctx.restore();}
 function image(ctx,cell,x,y,w,h,angle){if(!loaded)return;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(angle||0);ctx.drawImage(sprites[cell],-w/2,-h/2,w,h);ctx.restore();}
 function eye(ctx,x,y,openness,look,happy){ctx.save();ctx.translate(x,y);ctx.scale(1,Math.max(.05,openness));ctx.shadowColor='#53eaff';ctx.shadowBlur=12;
  var white=ctx.createRadialGradient(-7,-10,1,0,0,32);white.addColorStop(0,'#d0fcff');white.addColorStop(.5,'#7be9f4');white.addColorStop(1,'#318ba6');ctx.fillStyle=white;ctx.beginPath();ctx.ellipse(0,0,26,happy?25:30,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,26,happy?25:30,0,0,Math.PI*2);ctx.clip();var ly=face.gazeY,pupil=face.pupil,g=ctx.createRadialGradient(look-3,ly-5,1,look,ly,23);g.addColorStop(0,'#22647e');g.addColorStop(.62,'#103449');g.addColorStop(1,'#092230');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(look,ly+1,18,25,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(141,235,250,.45)';ctx.lineWidth=1;for(var ray=0;ray<12;ray++){var a=ray*Math.PI/6;ctx.beginPath();ctx.moveTo(look+Math.cos(a)*13,ly+Math.sin(a)*18);ctx.lineTo(look+Math.cos(a)*16,ly+Math.sin(a)*22);ctx.stroke();}
  ctx.fillStyle='#020d18';ctx.beginPath();ctx.ellipse(look,ly+1,8*pupil,13*pupil,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(242,255,255,.97)';ctx.beginPath();ctx.ellipse(look-6,ly-10,6,8,-.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(207,249,255,.8)';ctx.beginPath();ctx.arc(look+8,ly+10,3,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.strokeStyle='rgba(190,248,255,.45)';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,0,26,happy?25:30,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 function draw(canvas,t,s){var ctx=canvas.getContext('2d'),w=canvas.width;ctx.clearRect(0,0,w,w);ctx.save();ctx.scale(w/500,w/500);
  var dance=blend.dance,sleep=Math.max(blend.sleep,blend.drowsy*.88),thinking=blend.thinking,wake=blend.awake,cheer=blend.cheer;
  var slow=motionClock*.48,habitLife=clamp((t-habitAt)/4,0,1),habitWave=Math.sin(habitLife*Math.PI),flight=clamp(1-(performance.now()-flightAt)/2200,0,1),p=bodyPose;
  var dx=reduced?0:Math.sin(motionClock*.35)*3+p.x,dy=reduced?0:Math.sin(slow)*5*(1-sleep*.7)+p.y;
  ctx.save();ctx.translate(250,473);ctx.scale(1,.15);var halo=ctx.createRadialGradient(0,0,1,0,0,138);halo.addColorStop(0,'rgba(84,222,251,.28)');halo.addColorStop(.8,'rgba(84,222,251,.10)');halo.addColorStop(1,'rgba(84,222,251,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,138,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(92,221,243,.45)';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,105+Math.sin(slow)*4,95,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  if(!reduced&&travelLift>.04){ctx.save();ctx.globalAlpha=travelLift*.6;ctx.strokeStyle='#90e7ef';ctx.lineWidth=2;for(var trail=0;trail<3;trail++){ctx.beginPath();var tx=250-flightDirection*(95+trail*22);ctx.moveTo(tx,365+trail*18);ctx.quadraticCurveTo(tx-flightDirection*30,375+trail*18,tx-flightDirection*60,365+trail*18);ctx.stroke();}ctx.restore();}
  ctx.save();ctx.translate(dx,dy);ctx.translate(250,270);ctx.rotate(reduced?0:p.rotation+p.lean+travelLean*.55);ctx.scale(p.scale,p.scale);ctx.translate(-250,-270);image(ctx,1,122,252,256,256,reduced?0:p.lean*.25);
  var left=reduced?0:p.left-.08*blend.present-.06*cheer+flight*.08,right=reduced?0:p.right+.06*blend.present+.06*cheer-flight*.08;
  image(ctx,2,22+p.leftX,288+p.leftY-12*blend.present-8*cheer,150,230,left);
  image(ctx,3,328+p.rightX,288+p.rightY-10*wake-8*cheer,150,230,right);
  var tilt=reduced?0:p.head+sleep*.12-thinking*.10+blend.lookX*.002+travelLean*.2-blend.present*.025,yaw=reduced?0:p.yaw+face.gazeX*.003;
  ctx.save();ctx.translate(250+yaw*8,180);ctx.rotate(tilt);ctx.scale(1-Math.abs(yaw)*.18,1);image(ctx,0,-180,-180,360,360,0);
  var since=t-blinkAt,blink=since<.24?Math.abs((since-.12)/.12):doubleBlink&&since>.35&&since<.59?Math.abs((since-.47)/.12):1;blink=Math.min(1,blink)*(1-blend.sleep*.7);
  var look=clamp(face.gazeX+thinking*Math.sin(t*1.1)*2+(habit===1?habitWave*2:0),-9,9);
  eye(ctx,-51,5,blink*face.lidL,look,dance+cheer>.5);eye(ctx,51,5,blink*face.lidR,look,dance+cheer>.5);
  brow(ctx,-51,face.browL,face.slopeL,true);brow(ctx,51,face.browR,face.slopeR,false);
  ctx.save();ctx.globalAlpha=face.cheek;for(var cheek=-1;cheek<=1;cheek+=2){var glow=ctx.createRadialGradient(cheek*86,43,1,cheek*86,43,22);glow.addColorStop(0,'#66d5ee');glow.addColorStop(1,'rgba(102,213,238,0)');ctx.fillStyle=glow;ctx.fillRect(cheek*86-22,21,44,44);}ctx.restore();
  mouth(ctx);ctx.restore();ctx.restore();if(!reduced&&rocketProgress>0&&rocketProgress<1)drawRockets(ctx,rocketProgress,dx,dy);
  if(thinking>.1){for(var i=0;i<3;i++){ctx.fillStyle='rgba(133,240,255,'+thinking*(.25+.65*(.5+.5*Math.sin(t*4-i)))+')';ctx.beginPath();ctx.arc(220+i*30,488,4,0,Math.PI*2);ctx.fill();}}
  if(blend.drowsy>.2){ctx.save();ctx.globalAlpha=blend.drowsy*.7;ctx.fillStyle='#b8d2e5';ctx.font='24px Arial';ctx.fillText('z',385,100-Math.sin(t*.7)*8);ctx.font='33px Arial';ctx.fillText('Z',415,75-Math.sin(t*.7)*8);ctx.restore();}
  if(failed){ctx.fillStyle='#80cbd9';ctx.font='18px Arial';ctx.textAlign='center';ctx.fillText('Figur wird gerade nicht angezeigt',250,250);}ctx.restore();}
 function drawRockets(ctx,progress,dx,dy){for(var i=0;i<2;i++){var u=(progress-i*.18)/.82;if(u<=0||u>=1)continue;var e=u*u*(3-2*u),x=400+dx+Math.sin(u*Math.PI)*20+i*12,y=342+dy-e*264,alpha=Math.min(1,u*8,(1-u)*8);
  ctx.save();ctx.globalAlpha=alpha;for(var trail=0;trail<5;trail++){ctx.fillStyle='rgba(142,222,239,'+(.2*(1-trail/5))+')';ctx.beginPath();ctx.arc(x-trail*1.5,y+28+trail*10,3+trail*.5,0,Math.PI*2);ctx.fill();}
  ctx.translate(x,y);ctx.rotate(.14*Math.sin(u*Math.PI));ctx.shadowColor='#91e7f4';ctx.shadowBlur=8;ctx.fillStyle='#d5edf4';ctx.beginPath();ctx.moveTo(0,-23);ctx.quadraticCurveTo(13,-13,8,12);ctx.lineTo(-8,12);ctx.quadraticCurveTo(-13,-13,0,-23);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#58b9d0';ctx.beginPath();ctx.moveTo(-8,2);ctx.lineTo(-16,16);ctx.lineTo(-7,12);ctx.moveTo(8,2);ctx.lineTo(16,16);ctx.lineTo(7,12);ctx.fill();ctx.fillStyle='#123d57';ctx.beginPath();ctx.arc(0,-5,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f2c98f';ctx.beginPath();ctx.moveTo(-5,15);ctx.quadraticCurveTo(0,36,5,15);ctx.fill();ctx.restore();
 }}

 function tick(now){raf=null;if(document.hidden||destroyed)return;var input=provider(),interval=input.reduced?200:1000/30;
 if(now-lastFrame>=interval-.5){lastFrame=now;var dt=lastTick?Math.min(.12,(now-lastTick)/1000):.033;lastTick=now;var t=(now-start)/1000;reduced=!!input.reduced;
 var state=input.thinking?'thinking':input.playing?'dance':'idle',targets={dance:input.playing?1:0,thinking:input.thinking?1:0,awake:input.greeting?1:0,present:input.talking?1:0,talk:input.talking?1:0};
 for(var k in targets)blend[k]+=(targets[k]-blend[k])*(1-Math.exp(-dt*4));blend.lookX=input.lookX||0;blend.lookY=input.lookY||0;
 if(t>nextBlink){blinkAt=t;doubleBlink=Math.random()<.2;nextBlink=t+3+Math.random()*4;}
 if(t>nextHabit){habit=Math.floor(Math.random()*4);habitAt=t;nextHabit=t+14+Math.random()*10;}
 if(reduced){micro={x:0,y:0};nextGlance=Infinity;blinkAt=-10;doubleBlink=false;blend.lookX=0;blend.lookY=0;}else if(nextGlance===Infinity)nextGlance=t+1;
 var story={story:{text:input.text||''},speechIndex:input.speechIndex||0};express(t,dt,story,!!input.talking&&!reduced);
 if(!reduced)motionClock+=dt;bodyPose=motion.update(dt,{mode:state,spacious:true,attention:!!input.thinking,reduced:reduced,mood:input.mood,energy:input.mood===0?.6:1});rocketProgress=motion.inspect().rocket;
 draw(canvas,reduced?0:t,state);frames++;}raf=requestAnimationFrame(tick);}
 function resume(){lastTick=0;if(!raf&&!document.hidden&&!destroyed)raf=requestAnimationFrame(tick);}
 function visibility(){if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=null;}else resume();}
 atlas.onload=function(){var half=atlas.naturalWidth/2;for(var i=0;i<4;i++){var c=document.createElement('canvas');c.width=i===0?360:i===1?256:150;c.height=i<2?c.width:230;c.getContext('2d').drawImage(atlas,(i%2)*half,Math.floor(i/2)*half,half,half,0,0,c.width,c.height);sprites.push(c);}loaded=true;resume();};
 atlas.onerror=function(){failed=true;resume();};atlas.src=options&&options.atlasUrl||'assets/companion-atlas.png';document.addEventListener('visibilitychange',visibility);resume();
 return {inspect:function(){return {ready:loaded,failed:failed,frames:frames,face:face.emotion,mouth:face.viseme,motion:motion.inspect().clip,reduced:reduced};},destroy:function(){destroyed=true;if(raf)cancelAnimationFrame(raf);raf=null;document.removeEventListener('visibilitychange',visibility);}};
 }};}());
