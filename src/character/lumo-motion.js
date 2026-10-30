/* Ruhige Ganzkörper-Choreografie; reine lokale Mathematik, ohne Geräteaktionen. */
(function(){'use strict';window.LumoMotionFactory=function(){
 var fields=['x','y','lean','head','yaw','left','right','leftY','rightY','leftX','rightX','rotation','scale'];
 function neutral(){return {x:0,y:0,lean:0,head:0,yaw:0,left:0,right:0,leftY:0,rightY:0,leftX:0,rightX:0,rotation:0,scale:1};}
 function copy(p){var out={};for(var i=0;i<fields.length;i++)out[fields[i]]=p[fields[i]];return out;}
 function ease(v){return v*v*v*(v*(v*6-15)+10);}function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
 function frame(at,values){var p=neutral();for(var k in values)p[k]=values[k];return {at:at,pose:p};}
 var clips={
  sway:{seconds:13,keys:[frame(0,{}),frame(.25,{x:-30,y:-3,lean:.075,head:.045,yaw:-.22}),frame(.5,{y:4,head:-.025}),frame(.75,{x:30,y:-3,lean:-.075,head:-.045,yaw:.22}),frame(1,{})]},
  glide:{seconds:15,keys:[frame(0,{}),frame(.28,{x:-28,y:-12,lean:.06,head:.03,left:.06,right:-.04}),frame(.53,{x:-4,y:-17,lean:.025,yaw:.18}),frame(.78,{x:28,y:-7,lean:-.06,head:-.05}),frame(1,{})]},
  groove:{seconds:14,keys:[frame(0,{}),frame(.22,{x:-24,y:9,lean:.10,head:.08,yaw:-.18}),frame(.48,{y:-8,lean:.04,head:-.045}),frame(.73,{x:24,y:7,lean:-.10,head:-.08,yaw:.18}),frame(1,{})]},
  salute:{seconds:13,keys:[frame(0,{}),frame(.3,{x:-20,y:-4,lean:.055,head:-.07,yaw:.18,right:-.18,rightY:-19,rightX:10}),frame(.65,{x:20,y:3,lean:-.055,head:.055,right:-.10,rightY:-14,rightX:16}),frame(1,{})]},
  observe:{seconds:16,keys:[frame(0,{}),frame(.25,{head:-.06,yaw:-.35,lean:.025,x:-4}),frame(.65,{head:.06,yaw:.35,lean:-.025,x:4}),frame(1,{})]},
  drift:{seconds:18,keys:[frame(0,{}),frame(.32,{x:10,y:-10,head:.035,lean:.025}),frame(.7,{x:-9,y:-3,head:-.035,lean:-.025}),frame(1,{})]},
  bow:{seconds:11,keys:[frame(0,{}),frame(.35,{y:8,lean:.065,head:.12,yaw:-.12,left:.04,right:-.04}),frame(.7,{y:-3,head:-.035}),frame(1,{})]},
  spin:{seconds:9,keys:[frame(0,{}),frame(.15,{y:-5,scale:.94,left:.05,right:-.05}),frame(.5,{y:-18,scale:.72,rotation:Math.PI,left:.12,right:-.12}),frame(.85,{y:-5,scale:.94,rotation:Math.PI*2,left:.05,right:-.05}),frame(1,{rotation:Math.PI*2})]},
  rocket:{seconds:11,keys:[frame(0,{}),frame(.24,{lean:-.035,head:-.06,yaw:.25,right:-.16,rightX:18,rightY:-15}),frame(.52,{lean:.025,head:-.10,yaw:.3,right:-.12,rightX:14,rightY:-12}),frame(.79,{head:-.045,yaw:.18}),frame(1,{})]}
 };
 var pose=neutral(),clip='rest',elapsed=0,duration=5,baseTurn=0,from=null,to=null,bag=[],lastStyle='',completed=0,musicCount=0,idleCount=0,specialCount=0,lastMode='',lastAttention=false,restNext=false,fx=0,intensity=1;
 function shuffled(items){var a=items.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),v=a[i];a[i]=a[j];a[j]=v;}if(a[0]===lastStyle&&a.length>1){var v=a[0];a[0]=a[1];a[1]=v;}return a;}
 function start(name,seconds){clip=name;elapsed=0;duration=seconds||(clips[name]?clips[name].seconds:5);baseTurn=Math.round(pose.rotation/(Math.PI*2))*Math.PI*2;from=null;to=null;}
 function settle(){from=copy(pose);to=neutral();to.rotation=Math.round(pose.rotation/(Math.PI*2))*Math.PI*2;clip='settle';elapsed=0;duration=Math.max(2.2,Math.abs(to.rotation-from.rotation)*2);fx=0;}
 function choose(input){var music=input.mode==='dance';if(restNext){restNext=false;start('rest',music?1.5+Math.random():4+Math.random()*3);return;}
  var music=input.mode==='dance',spacious=input.spacious&&input.mood!==0;
  if(music){musicCount++;if(spacious&&musicCount%3===0){start(specialCount++%2===0?'spin':'rocket');restNext=true;return;}}
  else{idleCount++;if(spacious&&input.mood===2&&idleCount%5===0){start(specialCount++%2===0?'spin':'rocket');restNext=true;return;}}
  if(!bag.length)bag=shuffled(music?['sway','glide','groove','salute']:['observe','drift','bow']);var next=bag.shift();lastStyle=next;start(next);restNext=true;
 }
 function interpolate(a,b,u){var out={},e=ease(u);for(var i=0;i<fields.length;i++){var key=fields[i];out[key]=a[key]+(b[key]-a[key])*e;}return out;}
 function update(dt,input){dt=clamp(dt,0,.15);var mode=input.mode||'idle',blocked=input.reduced||input.attention||['sleep','drowsy','thinking','alert','offline'].indexOf(mode)>=0;
  if(mode!==lastMode||(input.attention&&!lastAttention)){bag=[];restNext=false;settle();lastMode=mode;}lastAttention=!!input.attention;
  if(blocked&&clip!=='settle'&&clip!=='rest')settle();var amplify=clip!=='settle';elapsed+=dt;
  if(clip==='settle'){pose=interpolate(from,to,clamp(elapsed/duration,0,1));if(elapsed>=duration){baseTurn=to.rotation;start('rest',blocked?1:mode==='dance'?.35:2.5);}}
  else if(clip==='rest'){pose=neutral();pose.rotation=baseTurn;if(elapsed>=duration){if(blocked)start('rest',6);else choose(input);}}
  else{var def=clips[clip],u=clamp(elapsed/duration,0,1),keys=def.keys,a=keys[0],b=keys[keys.length-1];for(var i=1;i<keys.length;i++)if(u<=keys[i].at){a=keys[i-1];b=keys[i];break;}pose=interpolate(a.pose,b.pose,(u-a.at)/(b.at-a.at));pose.rotation+=baseTurn;if(clip==='spin')pose.rotation=baseTurn+Math.PI*2*ease(u);
   if(elapsed>=duration){completed++;baseTurn=pose.rotation;choose(input);}
  }
  var target=input.reduced?0:clamp(input.energy||1,.4,1.05);intensity+=(target-intensity)*(1-Math.exp(-dt*1.4));if(amplify)for(var i=0;i<fields.length;i++){var key=fields[i];if(key!=='rotation'&&key!=='scale')pose[key]*=intensity;}
  fx=!blocked&&clip==='rocket'?clamp((elapsed/duration-.28)/.55,0,1):0;
  return pose;
 }
 return {update:update,inspect:function(){return {clip:clip,elapsed:elapsed,duration:duration,pose:copy(pose),rocket:fx,completed:completed};}};
};}());
