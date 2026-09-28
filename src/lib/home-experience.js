import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ss, clamp01, lerp, stage, mats, M, glassMat, liquidMat, lathe, buildProduct, creamSurface, petalTexture, petalGeo, petalMat } from '@/lib/three-kit';
import { MAKING_DURATION, makingCaptions, makingStages, photos } from '@/data/home';

// The home page's motion and 3D, ported from the design: loader intro, smooth scrolling (Lenis),
// GSAP scroll animations, the rotating hero bottle, and the "making of" scene.
// The markup itself is rendered by React (src/app/page.js and src/components/home); this only animates it.
// Call it once after the page has mounted; it returns a function that undoes everything.
export function startHomeExperience() {
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };
  var lenis = null, tickFn = null, raf = 0, mkRef = null, disposed = false;
  var cleanups = [];
  function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); cleanups.push(function () { target.removeEventListener(type, fn, opts); }); }

  var IMG = {};
  Object.keys(photos).forEach(function (k) { IMG[k] = photos[k].src; });
  var DUR = MAKING_DURATION, STG = makingStages;
  var CAPS = makingCaptions.map(function (c) { return { r: c.range, ph: c.photo, l: c.label }; });
  var mk = $('#mk'), portal = $('#portal');
  var ICON_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>', ICON_PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';

  // Links marked data-go="#section" scroll smoothly (through Lenis when it is running).
  on(document, 'click', function (e) {
    var a = e.target.closest && e.target.closest('[data-go]');
    if (!a) return;
    var t = $(a.dataset.go);
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: a.dataset.go === '#top' ? 0 : -10, duration: 1.8 });
    else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  }, true);


  /* ---------- 3D ---------- */
  var state={p:0},mx=0,my=0,W={wide:true};
  function visible(el){var o={v:true},io=new IntersectionObserver(function(e){o.v=e[0].isIntersecting});io.observe(el);cleanups.push(function(){io.disconnect()});return o}
  var IM={};function loadIm(k){return new Promise(function(res){var i=new Image();i.onload=function(){res()};i.onerror=function(){res()};i.src=IMG[k];IM[k]=i;if(i.complete)res()})}

  /* the making of: deterministic function of time T, plays by itself */
  var MK={T:0,playing:false,user:false,inView:false};
  function initMaking(){
   var cv=$("#cv3"),sec=$("#making"),S=stage(cv,{shadow:true,exp:.92}),sc=S.sc,cam=S.cam;cam.fov=32;cleanups.push(function(){S.ren.dispose();try{S.ren.forceContextLoss()}catch(e){}});
   var rig=new THREE.Group();sc.add(rig);
   var key=new THREE.SpotLight(0xfff0dc,1.32,70,.5,.75,1);key.position.set(-8,14,10);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0006;key.shadow.normalBias=.03;key.shadow.radius=5;sc.add(key);sc.add(key.target);
   var fl=new THREE.PointLight(0xffe2b0,0,30);fl.position.set(0,4,5);sc.add(fl);
   var table=new THREE.Mesh(new THREE.CircleGeometry(120,64),new THREE.MeshStandardMaterial({color:0x33201a,roughness:.62,metalness:0,envMapIntensity:.12}));table.rotation.x=-Math.PI/2;table.position.y=-.02;table.receiveShadow=true;rig.add(table);var tableRef=table;
   /* bowl */
   var bowlG=new THREE.Group();rig.add(bowlG);
   var bowl=lathe([[0,-.05],[1,0],[1.7,.4],[2.3,1.55],[2.36,1.74],[2.26,1.76],[2.2,1.6],[1.6,.66],[1,.28],[0,.24]],M.ceramic);bowl.castShadow=true;bowl.receiveShadow=true;bowlG.add(bowl);
   var rim=new THREE.Mesh(new THREE.TorusGeometry(2.31,.04,16,96),M.gold);rim.rotation.x=Math.PI/2;rim.position.y=1.75;bowlG.add(rim);
   /* contents */
   var cc=document.createElement("canvas");cc.width=cc.height=512;var cx=cc.getContext("2d"),ct=new THREE.CanvasTexture(cc);ct.encoding=THREE.sRGBEncoding;
   var cont=creamSurface(ct);bowlG.add(cont);
   var BL=[["#b34a6b",3.2],["#c94b74",4.0],["#e2b23a",6.4],["#efc656",7.0],["#7b62a8",8.6],["#9a80c4",9.2],["#d6a23a",9.7],["#e8d8a8",11.6]];
   /* swirl angle table: omega(T) integrated once */
   var tab=[0],dt=.02;for(var i=1;i<=1200;i++){var T=i*dt,om=.16+2.8*ss(12.6,14.8,T)*(1-ss(17.0,17.8,T));tab.push(tab[i-1]+om*dt)}
   var A=function(T){var f=Math.min(1199,Math.max(0,T/dt)),i0=Math.floor(f);return tab[i0]+(tab[i0+1]-tab[i0])*(f-i0)};
   function paintC(T){var bm=ss(13,17,T);cx.fillStyle="rgb("+Math.round(lerp(234,244,bm))+","+Math.round(lerp(223,226,bm))+","+Math.round(lerp(205,218,bm))+")";cx.fillRect(0,0,512,512);var mixv=ss(12.4,16.8,T),a=1-ss(13,16.4,T),sw=A(T);
    BL.forEach(function(b,i){var on=ss(b[1],b[1]+.8,T);if(on<=0||a<=0)return;var ang=i*.83+sw*(i%2?1:-1)*1.1,rad=(150-i*8)*(1-.55*ss(12.6,16,T)),x=256+Math.cos(ang)*rad,y=256+Math.sin(ang)*rad,r=(70+i*6)*on;
     var g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,b[0]);g.addColorStop(1,"rgba(255,255,255,0)");cx.globalAlpha=.85*a*on;cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()});
    cx.globalAlpha=1;var w=ss(12.6,15,T);
    for(var k=0;k<3;k++){cx.strokeStyle="rgba(255,255,255,"+(.10+.2*w)+")";cx.lineWidth=9-k*2;cx.beginPath();for(var s=0;s<=60;s++){var th=s*.16+sw*(1+k*.2)+k*2,rr=8+s*(3.6-k*.3);cx.lineTo(256+Math.cos(th)*rr,256+Math.sin(th)*rr)}cx.stroke()}
    ct.needsUpdate=true}
   /* photographic petals */
   var types=[{n:60,t0:.3,t1:3.6,w:.62,h:.8,kind:"rose",cr:[["rose",760,250,120,150],["rose",900,300,120,150],["rose",830,420,110,140]]},
    {n:40,t0:3.6,t1:5.8,w:.5,h:.66,kind:"m",cr:[["marigold",430,590,110,140],["marigold",560,640,110,140],["marigold",380,470,110,140]]},
    {n:30,t0:5.8,t1:8.0,w:.34,h:.56,kind:"floret",cr:[["lavender",300,380,120,150],["lavender",600,520,120,150],["lavender",900,600,120,150]]}];
   var pets=[];types.forEach(function(ty){var mts=ty.cr.map(function(c){return petalMat(petalTexture(IM[c[0]],c[1],c[2],c[3],c[4],ty.kind))}),geo=petalGeo(ty.w,ty.h);
    for(var i=0;i<ty.n;i++){var m=new THREE.Mesh(geo,mts[i%3]);m.visible=false;m.castShadow=false;sc.add(m);var ang=Math.random()*6.283,rad=Math.sqrt(Math.random())*1.55;
     pets.push({m:m,t0:ty.t0+(i/ty.n)*(ty.t1-ty.t0)+Math.random()*.25,dur:2.4+Math.random()*1.1,x0:(Math.random()-.5)*7,z0:(Math.random()-.5)*4.5,ex:Math.cos(ang)*rad,ez:Math.sin(ang)*rad,ph:Math.random()*6.28,rx:Math.random()*6.28,ry:Math.random()*6.28,rz:Math.random()*6.28,s:.75+Math.random()*.5,dis:12.9+Math.random()*1.9+i%5*.2,amp:.35+Math.random()*.5})}});
   /* pipette + oil drops + splash */
   var pip=new THREE.Group();pip.add(new THREE.Mesh(new THREE.CylinderGeometry(.13,.06,2.4,32),glassMat(0xffffff,.28)));
   var liq=new THREE.Mesh(new THREE.CylinderGeometry(.1,.05,1.5,24),liquidMat(0xb8680c,0x5a2c02));liq.position.y=-.35;pip.add(liq);
   var bulb=new THREE.Mesh(new THREE.SphereGeometry(.3,32,32),M.rubber);bulb.scale.set(1,1.5,1);bulb.position.y=1.55;pip.add(bulb);
   var bd=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.22,32),M.gold);bd.position.y=1.2;pip.add(bd);pip.visible=false;sc.add(pip);
   var dropM=new THREE.MeshPhysicalMaterial({color:0xe0a935,roughness:.05,clearcoat:1,emissive:0x8a5a0c,emissiveIntensity:.7,envMapIntensity:1.5});
   var TS=[9.0,9.8,10.6,11.4,12.2],drops=TS.map(function(ts){var m=new THREE.Mesh(new THREE.SphereGeometry(.15,24,24),dropM);m.visible=false;sc.add(m);
    var rg=new THREE.Mesh(new THREE.RingGeometry(.9,1,64),new THREE.MeshBasicMaterial({color:0xf2d48a,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));rg.rotation.x=-Math.PI/2;rg.visible=false;sc.add(rg);
    var sp=[];for(var k=0;k<7;k++){var s=new THREE.Mesh(new THREE.SphereGeometry(.05,12,12),dropM);s.visible=false;sc.add(s);var a=k/7*6.28+Math.random();sp.push({m:s,vx:Math.cos(a)*(.8+Math.random()*.6),vz:Math.sin(a)*(.8+Math.random()*.6),vy:1.6+Math.random()*1.2})}
    return {m:m,r:rg,ts:ts,sp:sp}});
   /* whisk */
   var wh=new THREE.Group();for(var w=0;w<7;w++){var to=new THREE.Mesh(new THREE.TorusGeometry(.5,.018,10,48),M.gold);to.scale.set(1,1.7,1);to.rotation.y=w/7*Math.PI;wh.add(to)}
   var hd=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.9,20),M.gold);hd.position.y=1.5;wh.add(hd);wh.visible=false;sc.add(wh);
   /* final lotion */
   var lot=buildProduct("lot"),lh=lot.userData.h,head=lot.userData.head,ls=lot.userData.s;lot.traverse(function(m){if(m.isMesh){m.castShadow=true;m.receiveShadow=true}});rig.add(lot);lot.position.y=-20;
   var D=dust(sc,220,[10,6,6]);D.pts.material.opacity=0;
   function dust(sc,n,spread){var pos=new Float32Array(n*3),sp=[];for(var i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*spread[0];pos[i*3+1]=(Math.random()-.5)*spread[1];pos[i*3+2]=(Math.random()-.5)*spread[2];sp.push(.1+Math.random()*.3)}
    var gm=new THREE.BufferGeometry();gm.setAttribute("position",new THREE.BufferAttribute(pos,3));var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,"rgba(255,235,190,1)");gr.addColorStop(.4,"rgba(232,200,130,.5)");gr.addColorStop(1,"rgba(232,200,130,0)");x.fillStyle=gr;x.fillRect(0,0,64,64);
    var pts=new THREE.Points(gm,new THREE.PointsMaterial({size:.11,map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75}));sc.add(pts);return {pts:pts,sp:sp,pos:pos,n:n}}
   function size(){var w=sec.clientWidth,h=sec.clientHeight;S.ren.setSize(w,h,false);cam.aspect=w/h;W.mk=w>900;rig.position.x=W.mk?2.3:0;cam.fov=W.mk?32:58;cam.updateProjectionMatrix()}size();on(window,"resize",size);
   var pos3=new THREE.Vector3(),lastPaint=-9;
   function pose(T){
    var rx=rig.position.x,fill=.1+.38*ss(3,10.8,T)+.12*ss(8.6,12.4,T)+.05*ss(12.4,17,T),y=.4+fill*1.05,r=1.6+(y-.66)*(.6/.94)-.05;
    cont.position.y=y;cont.scale.set(r,1,r);
    if(Math.abs(T-lastPaint)>.03){paintC(T);lastPaint=T}
    cont.userData.relief(.05*ss(12.4,14,T)+.012,A(T)*4,.05*ss(13,15,T)*(1-ss(17.2,17.8,T)));
    var sink=ss(17.6,19.4,T);bowlG.position.y=-sink*11;var bi=.88+.12*ss(0,1.4,T);bowlG.scale.setScalar(bi);
    /* petals */
    var sw=A(T);pets.forEach(function(q){var u=(T-q.t0)/q.dur;var d=1-ss(q.dis,q.dis+1.6,T);if(u<=0||d<=.002||sink>0){q.m.visible=false;return}q.m.visible=true;
     if(u<1){var v=1-Math.pow(1-u,1.35),fl=(1-v);
      q.m.position.set(rx+lerp(q.x0,q.ex,v)+Math.sin(u*9+q.ph)*q.amp*fl,lerp(7.8,y+.06,v),lerp(q.z0,q.ez,v)+Math.cos(u*7+q.ph)*q.amp*fl*.6);
      q.m.rotation.set(q.rx+Math.sin(u*6+q.ph)*.9+u*3,q.ry+u*5,q.rz+Math.sin(u*8+q.ph)*.7);q.m.scale.setScalar(q.s)}
     else{var la=A(q.t0+q.dur),th=Math.atan2(q.ez,q.ex)+(sw-la)*1.05,rr=Math.sqrt(q.ex*q.ex+q.ez*q.ez)*(1-.35*ss(13,16,T));
      q.m.position.set(rx+Math.cos(th)*rr,y+.035-(1-d)*.05,Math.sin(th)*rr);q.m.rotation.set(-Math.PI/2+Math.sin(q.ph+T)*.06,0,th+q.ph);q.m.scale.setScalar(q.s*d)}});
    /* pipette */
    var pv=ss(8.2,8.9,T)*(1-ss(12.6,13.2,T));pip.visible=pv>.01&&sink===0;pip.position.set(rx,3.9+(1-pv)*3.2,0);pip.rotation.z=(1-pv)*.5;
    var sq=0;drops.forEach(function(d){var u=T-d.ts;var form=clamp01(u/.4),fall=clamp01((u-.4)/.5),imp=u-.9;
     if(u>0&&u<.9){d.m.visible=true;var yy=lerp(2.75,y+.1,fall*fall);d.m.position.set(rx,yy,0);var s=(.3+.7*form)*(1-.1*fall);d.m.scale.set(s,s*(1+.9*fall+.3*form),s);if(u<.4)sq=Math.max(sq,Math.sin(form*Math.PI))}else d.m.visible=false;
     var ru=imp/.9;if(imp>0&&ru<1){d.r.visible=true;d.r.position.set(rx,y+.02,0);var rs=(.25+ru*1.5)*Math.max(.5,(r-.4)/1.5);d.r.scale.set(rs,rs,1);d.r.material.opacity=(1-ru)*.9}else d.r.visible=false;
     d.sp.forEach(function(s){if(imp>0&&imp<.7){s.m.visible=true;s.m.position.set(rx+s.vx*imp*.7,y+s.vy*imp-4.9*imp*imp*.5*1.6,s.vz*imp*.7);s.m.scale.setScalar(1-imp/.7)}else s.m.visible=false})});
    bulb.scale.y=1.5*(1-.16*sq);
    /* whisk */
    var wv=ss(12.6,13.3,T)*(1-ss(17.2,17.8,T));wh.visible=wv>.01&&sink===0;var ang=T*4.4+A(T)*2;wh.position.set(rx+Math.cos(ang)*.55*wv,y+.5+(1-wv)*3.4,Math.sin(ang)*.55*wv);wh.rotation.set(Math.sin(ang)*.12,T*(4+8*ss(13,15,T)),Math.cos(ang)*.12);
    /* the lotion arrives */
    var rs2=ss(18.2,20,T),er=1-Math.pow(1-rs2,3);lot.position.y=lerp(-lh/2-8,lh/2,er);lot.rotation.y=(1-er)*-2.4+Math.sin(Math.min(T,21.5)*.55)*.14-.05;
    var hp=clamp01((T-19.7)/1.1);head.position.y=hp>=1?0:(1-easeOutBack(hp))*(3.4/ls);
    var flash=ss(20.3,20.7,T)*(1-ss(20.7,21.8,T));fl.intensity=flash*4;D.pts.material.opacity=ss(20.3,20.8,T)*.85;D.pts.position.set(rx,lh*.55,0);
    var a=D.pos;for(var i=0;i<D.n;i++){a[i*3+1]+=D.sp[i]*.004;if(a[i*3+1]>3)a[i*3+1]=-3}D.pts.geometry.attributes.position.needsUpdate=true;
    /* camera: settle, dolly into the blend, pull back for the reveal */
    var z=ss(12.8,14.4,T)*(1-ss(16.6,18.2,T)),fin=ss(17.6,19.6,T),push=ss(20.6,23,T);cam.position.set(Math.sin(T*.32)*.8*(1-z)*(1-fin),lerp(5.8,5.0,z)-fin*3.3-push*.3,lerp(12.6,8.6,z)+fin*1.2-push*1.6);
    cam.lookAt(rx*.4,.9+fin*1.0,0);key.target.position.set(rx*.4,0,0);key.target.updateMatrixWorld();
    S.ren.render(sc,cam)}
   function easeOutBack(t){var c1=1.7,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}
   return {pose:pose,vis:visible(sec),table:tableRef}}

  function initThree(){
   mats();
   var cv=$("#cv"),hero=$("#hero"),S=stage(cv),hg=buildProduct("dew"),root=new THREE.Group();root.add(hg);S.sc.add(root);var D=heroDust(S.sc);
   var hv=visible(hero);
   function hs(){var w=hero.clientWidth,h=hero.clientHeight;S.ren.setSize(w,h,false);S.cam.aspect=w/h;var f=Math.max(.6,Math.min(1.12,h/800,w/900));W.wide=w>900;root.scale.setScalar(W.wide?f:f*.6);S.cam.updateProjectionMatrix()}hs();on(window,"resize",hs);
   on(hero,"pointermove",function(e){var r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;hero.style.setProperty("--mx",(mx+.5)*100+"%");hero.style.setProperty("--my",(my+.5)*100+"%")});
   var mkObj=null;Promise.all(["rose","marigold","lavender"].map(loadIm)).then(function(){if(disposed)return;try{mkObj=initMaking();mkRef=mkObj;setupMakingControls(mkObj)}catch(e){console.error(e)}});
   var sx=0,sy=0,t0=performance.now(),last=t0;cleanups.push(function(){cancelAnimationFrame(raf);S.ren.dispose();try{S.ren.forceContextLoss()}catch(e){}});
   (function loop(){if(disposed)return;raf=requestAnimationFrame(loop);var now=performance.now(),t=(now-t0)/1000,dt=Math.min(.1,(now-last)/1000);last=now;
    if(hv.v){sx+=(mx-sx)*.05;sy+=(my-sy)*.05;var iv=window.__introP===undefined?1:window.__introP;
     hg.rotation.y=(RM?0:t*.3)+sx*1.1+state.p*Math.PI*1.6-(1-iv)*1.4;hg.rotation.x=sy*.2;hg.rotation.z=-.06+state.p*.16;
     root.position.x=W.wide?3.0:0;root.position.y=(W.wide?0:-.35)+(RM?0:Math.sin(t*1.1)*.09)+state.p*1.7-(1-iv)*1.2;S.cam.position.z=15+(1-iv)*3.5;
     var a=D.pos;for(var i=0;i<D.n;i++){a[i*3+1]+=D.sp[i]*.004;a[i*3]+=Math.sin(t*.4+i)*.0008;if(a[i*3+1]>4.6)a[i*3+1]=-4.6}
     D.pts.geometry.attributes.position.needsUpdate=true;D.pts.position.x=sx*-.6;
     S.ren.render(S.sc,S.cam)}
    if(mkObj){if(MK.playing&&mkObj.vis.v){MK.T=Math.min(DUR,MK.T+dt);if(MK.T>=DUR){MK.playing=false;syncBtn()}}
     if(mkObj.vis.v){mkObj.pose(MK.T);mkUI()}}
   })()}
  function heroDust(sc){var n=320,pos=new Float32Array(n*3),sp=[];for(var i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*16;pos[i*3+1]=(Math.random()-.5)*9;pos[i*3+2]=(Math.random()-.5)*6;sp.push(.1+Math.random()*.3)}
   var gm=new THREE.BufferGeometry();gm.setAttribute("position",new THREE.BufferAttribute(pos,3));var c=document.createElement("canvas");c.width=c.height=64;var x=c.getContext("2d"),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,"rgba(255,235,190,1)");gr.addColorStop(.4,"rgba(232,200,130,.5)");gr.addColorStop(1,"rgba(232,200,130,0)");x.fillStyle=gr;x.fillRect(0,0,64,64);
   var pts=new THREE.Points(gm,new THREE.PointsMaterial({size:.11,map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75}));sc.add(pts);return {pts:pts,sp:sp,pos:pos,n:n}}

  /* making-of controls, captions, autoplay-on-view */
  var capCur=-1,mkBars=null;
  function mkUI(){var T=MK.T,i=0;for(var k=0;k<CAPS.length;k++)if(T>=CAPS[k].r[0]&&T<CAPS[k].r[1]){i=k;break}
   if(i!==capCur){var pans=mk.querySelectorAll(".cap"),old=pans[capCur],nw=pans[i];capCur=i;
    if(old){gsap.to(old.children,{y:-30,opacity:0,duration:.45,stagger:.03,ease:"power2.in",onComplete:function(){if(old!==nw)old.classList.remove("on")}})}
    nw.classList.add("on");gsap.fromTo(nw.children,{y:50,opacity:0},{y:0,opacity:1,duration:1.2,stagger:.09,ease:"expo.out",delay:old?.3:0,overwrite:true});
    var c=CAPS[i];portal.querySelectorAll(".ph").forEach(function(e){e.classList.toggle("on",e.dataset.k===c.ph)});$("#plabel").textContent=c.ph?c.l:"";gsap.to(portal,{opacity:c.ph?1:0,scale:c.ph?1:.85,duration:1,ease:"expo.out"});
    var s=i<3?0:i<5?1:i<6?2:3;document.querySelectorAll("#stg div").forEach(function(d,j){d.classList.toggle("on",j===s)})}
   if(!mkBars)mkBars=[].slice.call(document.querySelectorAll("#stg i"));mkBars.forEach(function(b,j){b.style.setProperty("--f",clamp01((T-STG[j][1])/(STG[j][2]-STG[j][1])))})}
  function syncBtn(){var b=$("#mplay");b.innerHTML=MK.playing?ICON_PAUSE:ICON_PLAY;b.setAttribute("aria-label",MK.playing?"Pause animation":"Play animation")}
  function setupMakingControls(mkObj){
   syncBtn();
   $("#mplay").addEventListener("click",function(){if(MK.T>=DUR){MK.T=0}MK.playing=!MK.playing;MK.user=!MK.playing;syncBtn()});
   $("#mrep").addEventListener("click",function(){MK.T=0;capCur=-1;MK.playing=true;MK.user=false;syncBtn()});
   var el=$("#making");
   var mio=new IntersectionObserver(function(e){MK.inView=e[0].isIntersecting;if(MK.inView){if(!MK.user&&!RM&&MK.T<DUR){MK.playing=true}}else MK.playing=false;syncBtn()},{threshold:.55});mio.observe(el);cleanups.push(function(){mio.disconnect()});
   on(document,"visibilitychange",function(){if(document.hidden){MK.playing=false;syncBtn()}else if(MK.inView&&!MK.user&&MK.T<DUR){MK.playing=true;syncBtn()}});
   if(RM){MK.T=DUR;mkUI()}}

  /* ---------- motion ---------- */
  function words(el){if(!el.dataset.orig)el.dataset.orig=el.innerHTML;var h=el.dataset.orig.replace(/<em>(.*?)<\/em>/g,function(m,a){return a.split(" ").map(function(w){return "<em>"+w+"</em>"}).join(" ")});el.innerHTML=h.split(" ").map(function(w){return '<span style="display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .04em .16em;margin:-.04em -.04em -.16em"><span class="wi" style="display:inline-block">'+w+'</span></span>'}).join(" ")}
  function run(){
   gsap.registerPlugin(ScrollTrigger);
   var ctx=gsap.context(function(){
   var fontsP=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1800)})]):Promise.resolve();
   fontsP.then(function(){if(disposed)return;try{initThree()}catch(e){console.error(e);document.documentElement.classList.add("no-gl")}});
   if(!RM){lenis=new Lenis({lerp:.085,wheelMultiplier:.95});lenis.on("scroll",ScrollTrigger.update);tickFn=function(t){lenis.raf(t*1000)};gsap.ticker.add(tickFn);gsap.ticker.lagSmoothing(0)}
   document.querySelectorAll(".rv").forEach(words);cleanups.push(function(){document.querySelectorAll(".rv").forEach(function(h){if(h.dataset.orig)h.innerHTML=h.dataset.orig})});
   gsap.set(".hero .ln .in",{yPercent:115});gsap.set([".hero .low > *","#cv"],{opacity:0,y:30});
   if(!RM){document.querySelectorAll(".rv").forEach(function(h){gsap.set(h.querySelectorAll(".wi"),{yPercent:115});ScrollTrigger.create({trigger:h,start:"top 82%",once:true,onEnter:function(){gsap.to(h.querySelectorAll(".wi"),{yPercent:0,duration:1.4,stagger:.07,ease:"expo.out"})}})})}
   else gsap.set(".wi",{yPercent:0});
   var seen=false;try{seen=sessionStorage.getItem("velanthe-intro")==="1";sessionStorage.setItem("velanthe-intro","1")}catch(e){}
   var quick=RM||seen;
   var path=$("#ldp"),len=path.getTotalLength();gsap.set(path,{strokeDasharray:len,strokeDashoffset:len});
   window.__introP=quick?1:0;var ip={v:quick?1:0};
   var tl=gsap.timeline({delay:.15});
   tl.to(path,{strokeDashoffset:0,duration:1.6,ease:"power2.inOut"}).from("#ld .nm",{opacity:0,y:14,duration:1,ease:"expo.out"},"-=.6")
     .to("#ld",{clipPath:"inset(0 0 100% 0)",duration:1.4,ease:"expo.inOut"},"+=.2").set("#ld",{display:"none"})
     .to(ip,{v:1,duration:3,ease:"expo.out",onUpdate:function(){window.__introP=ip.v}},"-=1.1")
     .from("#hbg",{scale:1.25,duration:3.2,ease:"expo.out"},"<")
     .to(".hero .ln .in",{yPercent:0,duration:1.8,stagger:.16,ease:"expo.out"},"-=2.6")
     .to("#cv",{opacity:1,y:0,duration:2,ease:"expo.out"},"-=2.3")
     .to(".hero .low > *",{opacity:1,y:0,duration:1.4,stagger:.12,ease:"expo.out"},"-=1.6");
   if(quick){tl.progress(1);gsap.set(["#cv",".hero .low > *"],{opacity:1,y:0});gsap.set("#ld",{display:"none"});window.__introP=1}
   if(!RM){
    gsap.to("#hbg",{scale:1.16,duration:26,ease:"sine.inOut",yoyo:true,repeat:-1});
    gsap.to(state,{p:1,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(".hero h1",{yPercent:-18,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.to("#hbg",{yPercent:14,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
    gsap.fromTo("#arch",{yPercent:-8},{yPercent:8,ease:"none",scrollTrigger:{trigger:".arch",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.from(".arch",{clipPath:"inset(100% 0 0 0)",duration:1.8,ease:"expo.out",scrollTrigger:{trigger:".arch",start:"top 85%"}});
    ["#yes","#no"].forEach(function(id){document.querySelectorAll(id+" li").forEach(function(li,i){ScrollTrigger.create({trigger:li,start:"top 88%",once:true,onEnter:function(){setTimeout(function(){li.classList.add("on")},i*130)}})})});
    gsap.from(".cols li",{y:24,opacity:0,stagger:.07,duration:1.1,ease:"expo.out",scrollTrigger:{trigger:".cols",start:"top 88%"}});
    gsap.from("#ilist button",{x:-40,opacity:0,stagger:.1,duration:1.3,ease:"expo.out",scrollTrigger:{trigger:"#ilist",start:"top 85%"}});
    gsap.from(".pc",{opacity:0,stagger:.09,duration:1.2,ease:"power2.out",clearProps:"opacity",scrollTrigger:{trigger:"#pgrid",start:"top 88%"}});
    gsap.from("#iview",{y:70,opacity:0,duration:1.6,ease:"expo.out",scrollTrigger:{trigger:"#iview",start:"top 88%"}});
    gsap.from(".form,.foot,.credits",{y:40,opacity:0,duration:1.3,stagger:.15,ease:"expo.out",scrollTrigger:{trigger:".form",start:"top 92%"}});
    gsap.from("#word",{yPercent:40,opacity:0,duration:1.9,ease:"expo.out",scrollTrigger:{trigger:"#word",start:"top 96%"}})}
   else document.querySelectorAll(".cols li").forEach(function(li){li.classList.add("on")});
   fontsP.then(function(){if(!disposed)ScrollTrigger.refresh()});
   });
   cleanups.push(function(){ctx.revert();if(lenis){lenis.destroy();lenis=null}if(tickFn)gsap.ticker.remove(tickFn)});
  }
  run();

  return function stop() {
    disposed = true;
    cleanups.forEach(function (fn) { try { fn(); } catch (e) { /* already gone */ } });
    cleanups = [];
  };
}
