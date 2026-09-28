import * as THREE from 'three';

// 3D helpers for the bottle renders, materials, petals and cream surface (ported from the design).
// Browser-only: import it from client code (it uses document/canvas).

var ss=function(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
var clamp01=function(x){return Math.min(1,Math.max(0,x))};
var lerp=function(a,b,t){return a+(b-a)*t};

function labelTex(bg,ink,gold,name,sub){var c=document.createElement("canvas");c.width=1024;c.height=340;var x=c.getContext("2d");
 if(bg){x.fillStyle=bg;x.fillRect(0,0,1024,340);x.strokeStyle=gold;x.lineWidth=3;x.strokeRect(18,18,988,304)}
 x.textAlign="center";x.fillStyle=ink;x.font="500 88px 'Cormorant Garamond', Georgia, serif";
 try{x.letterSpacing="12px"}catch(e){}
 x.fillText("VELANTHE",512+6,150);x.fillStyle=gold;x.fillRect(432,182,160,2);x.fillStyle=ink;x.font="400 40px Jost, sans-serif";
 try{x.letterSpacing="6px"}catch(e){}
 x.fillText(name.toUpperCase(),512+3,258);
 var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}

function makeEnv(ren){
 var pm=new THREE.PMREMGenerator(ren),es=new THREE.Scene();es.background=new THREE.Color(0x0a0808);
 function bx(w,h,d,x,y,z,c){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);es.add(m)}
 bx(14,8,.3,-7,6,9,0xfff0dc);bx(.9,18,.3,-12,0,0,0xffffff);bx(.9,18,.3,12,0,-1,0xffe6c0);bx(18,.9,.3,0,10,2,0xffe9c8);
 bx(3,14,.3,6,2,9,0xffe2c0);bx(30,.3,30,0,-7,0,0x1c1614);bx(34,24,.3,0,0,-15,0x120e10);bx(6,10,.3,9,1,7,0x7a6a54);
 var t=pm.fromScene(es,.03).texture;pm.dispose();return t}

function mkRenderer(cv,opts){opts=opts||{};var ren=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:!!opts.keep});
 ren.setPixelRatio(opts.pr||Math.min(devicePixelRatio,2));ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=opts.exp||1.0;
 if(opts.shadow){ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap}return ren}
function stage(cv,opts){var ren=mkRenderer(cv,opts),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(28,1,.1,100);cam.position.set(0,0,15);sc.environment=makeEnv(ren);
 var k=new THREE.DirectionalLight(0xfff0dc,.9);k.position.set(4,6,8);sc.add(k);return {ren:ren,sc:sc,cam:cam}}

var M={};
function mats(){
 M.gold=new THREE.MeshStandardMaterial({color:0xcf9f2e,metalness:1,roughness:.24,envMapIntensity:1.3});
 M.goldSoft=new THREE.MeshStandardMaterial({color:0xc9a04a,metalness:1,roughness:.4,envMapIntensity:1.1});
 M.pearl=new THREE.MeshPhysicalMaterial({color:0xd6ccbf,roughness:.3,clearcoat:.7,clearcoatRoughness:.12,envMapIntensity:.8});
 M.frost=new THREE.MeshPhysicalMaterial({color:0xcfc4b6,roughness:.5,clearcoat:.35,clearcoatRoughness:.4,envMapIntensity:.7});
 M.plum=new THREE.MeshPhysicalMaterial({color:0x14060c,roughness:.28,clearcoat:.85,clearcoatRoughness:.1,envMapIntensity:1.0});
 M.black=new THREE.MeshPhysicalMaterial({color:0x0d0507,roughness:.28,clearcoat:.9,envMapIntensity:1.2});
 M.ceramic=new THREE.MeshPhysicalMaterial({color:0xcbb99b,roughness:.5,clearcoat:.28,clearcoatRoughness:.4,side:THREE.DoubleSide,envMapIntensity:.5});
 M.stone=new THREE.MeshStandardMaterial({color:0x0f070b,roughness:.32,metalness:.3,envMapIntensity:.32});
 M.rubber=new THREE.MeshPhysicalMaterial({color:0x160a0d,roughness:.5,clearcoat:.3,envMapIntensity:.6});
}
function glassMat(tint,op){return new THREE.MeshPhysicalMaterial({color:tint,transparent:true,opacity:op||.3,roughness:.03,metalness:0,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.8,depthWrite:false})}
function liquidMat(c,em){return new THREE.MeshPhysicalMaterial({color:c,roughness:.22,clearcoat:.8,clearcoatRoughness:.1,emissive:em||0x000000,emissiveIntensity:.7,envMapIntensity:.9})}

function lathe(p,m){return new THREE.Mesh(new THREE.LatheGeometry(p.map(function(a){return new THREE.Vector2(a[0],a[1])}),96),m)}
function band(r,h,y,tex,tl,transparent){var m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,80,1,true,-tl/2,tl),new THREE.MeshStandardMaterial({map:tex,roughness:.45,metalness:.05,side:THREE.DoubleSide,transparent:!!transparent,envMapIntensity:.15}));m.position.y=y;return m}
function fit(g,size){var bb=new THREE.Box3().setFromObject(g),c=bb.getCenter(new THREE.Vector3()),sz=bb.getSize(new THREE.Vector3());var w=new THREE.Group();g.position.sub(c);w.add(g);var s=size/Math.max(sz.y,sz.x*1.25);w.scale.setScalar(s);w.userData.inner=g;w.userData.h=sz.y*s;w.userData.s=s;return w}
/* glass shell + inner liquid. R = straight-wall radius, top = liquid surface height */
function glassBody(profile,R,top,tint,liq,em,op){var g=new THREE.Group();
 var shell=lathe(profile,glassMat(tint,op));shell.renderOrder=3;g.add(shell);
 var back=lathe(profile,new THREE.MeshPhysicalMaterial({color:tint,transparent:true,opacity:.55,roughness:.1,side:THREE.BackSide,envMapIntensity:.5,depthWrite:false}));back.renderOrder=1;g.add(back);
 var lr=R*.9,l=lathe([[0,.08],[lr-.12,.08],[lr,.2],[lr,top],[0,top]],liquidMat(liq,em));l.renderOrder=2;g.add(l);return g}
function shadowDisc(r,y,op){var c=document.createElement("canvas");c.width=c.height=128;var x=c.getContext("2d"),g=x.createRadialGradient(64,64,4,64,64,64);g.addColorStop(0,"rgba(0,0,0,"+(op||.55)+")");g.addColorStop(.5,"rgba(0,0,0,"+(.3*(op||.55))+")");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(0,0,128,128);
 var m=new THREE.Mesh(new THREE.PlaneGeometry(r*2,r*2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=y;return m}

/* ---------- product models ---------- */
var LT={pearl:["#efe7dc","#3a0f1c","#b8955a"],plum:[null,"#efe7dc","#d7b46a"],clear:[null,"#3a0f1c","#9a7a3e"]};
var B={
 serum:function(o){o=o||{};var g=new THREE.Group();
  var prof=[[0,0],[.92,0],[1.02,.1],[1.06,.35],[1.06,2.7],[1,2.95],[.7,3.15],[.46,3.28],[.44,3.55]];
  g.add(glassBody(prof,1.06,2.35,o.tint||0x0e0407,o.liq||0xb8680c,o.em||0x5a2c02));
  g.add(band(1.085,1.5,1.5,labelTex(LT.pearl[0],LT.pearl[1],LT.pearl[2],o.name||"Luminous Oil Serum"),Math.PI*1.2));
  var cap=new THREE.Group();
  var c=new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,.6,64),M.gold);c.position.y=3.7;cap.add(c);
  var r=new THREE.Mesh(new THREE.TorusGeometry(.5,.035,16,64),M.gold);r.rotation.x=Math.PI/2;r.position.y=3.4;cap.add(r);
  var bu=new THREE.Mesh(new THREE.SphereGeometry(.4,48,48),M.rubber);bu.scale.set(1,1.7,1);bu.position.y=4.45;cap.add(bu);
  var rod=new THREE.Mesh(new THREE.CylinderGeometry(.075,.06,3.1,24),glassMat(0xffe0b0,.55));rod.position.y=1.9;cap.add(rod);
  var rl=new THREE.Mesh(new THREE.CylinderGeometry(.06,.045,2.6,20),liquidMat(o.liq||0xb8680c,o.em||0x5a2c02));rl.position.y=1.7;cap.add(rl);
  g.add(cap);var w=fit(g,4.5);w.userData.cap=cap;w.userData.bu=bu;w.userData.tipY=.4;return w},
 jar:function(o){o=o||{};var g=new THREE.Group();
  var prof=[[0,0],[1.5,0],[1.56,.08],[1.56,1.15],[1.5,1.22]];
  g.add(glassBody(prof,1.56,.95,o.tint||0x0e0407,o.liq||0xf2e8d8,0x3a2e20,.35));
  g.add(band(1.575,.72,.62,labelTex(LT.pearl[0],LT.pearl[1],LT.pearl[2],o.name||"Barrier Repair Cream"),Math.PI*.95));
  var lid=new THREE.Group();lid.add(lathe([[0,1.22],[1.62,1.22],[1.66,1.3],[1.66,1.85],[1.58,1.95],[0,1.95]],M.gold));var rg=new THREE.Mesh(new THREE.TorusGeometry(1.64,.03,16,96),M.gold);rg.rotation.x=Math.PI/2;rg.position.y=1.24;lid.add(rg);g.add(lid);
  var w=fit(g,o.size||3.7);w.userData.lid=lid;return w},
 jar2:function(o){var g=new THREE.Group();g.add(lathe([[0,0],[1.25,0],[1.36,.12],[1.4,1.7],[1.32,1.85],[0,1.85]],M.pearl));
  g.add(band(1.412,.95,.95,labelTex("#2a0c16","#efe7dc","#d7b46a",(o&&o.name)||"Overnight Renewal Mask"),Math.PI*1.0));
  var lid=new THREE.Group();lid.add(lathe([[0,1.85],[1.42,1.85],[1.46,1.95],[1.46,2.45],[1.38,2.55],[0,2.55]],M.gold));g.add(lid);
  var w=fit(g,3.9);w.userData.lid=lid;return w},
 tube:function(o){o=o||{};var g=new THREE.Group();var mat=o.mat||M.pearl;var cap=new THREE.Mesh(new THREE.CylinderGeometry(.4,.46,.8,64),M.gold);cap.position.y=.4;g.add(cap);
  g.add(lathe([[.46,.8],[.58,.9],[.68,1.5],[.7,3.9],[.7,4.1]],mat));
  var cr=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.5,64),mat);cr.scale.z=.18;cr.position.y=4.1;g.add(cr);
  var cg=new THREE.Mesh(new THREE.BoxGeometry(1.4,.04,.13),M.gold);cg.position.y=3.85;g.add(cg);
  var L=o.dark?LT.plum:LT.clear;g.add(band(.71,1.6,2.3,labelTex(null,L[1],L[2],o.name||"Clarity Gel Cleanser"),Math.PI*1.15,true));return fit(g,4.6)},
 mist:function(o){o=o||{};var g=new THREE.Group();
  var prof=[[0,0],[.85,0],[.92,.1],[.92,2.9],[.86,3],[.42,3.12],[.42,3.3]];
  g.add(glassBody(prof,.92,2.5,o.tint||0x0e0407,o.liq||0x230510,0x0d0105,.42));
  g.add(band(.94,1.5,1.5,labelTex(LT.pearl[0],LT.pearl[1],LT.pearl[2],o.name||"Dew Essence Mist"),Math.PI*1.2));
  var n=new THREE.Mesh(new THREE.CylinderGeometry(.46,.5,.5,64),M.gold);n.position.y=3.5;g.add(n);
  var t=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.42,48),M.rubber);t.position.y=3.95;g.add(t);
  var dip=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,3,12),glassMat(0xffffff,.4));dip.position.y=1.6;g.add(dip);
  var o2=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.36,32),M.gold);o2.rotation.z=Math.PI/2;o2.position.set(.2,4.05,0);g.add(o2);return fit(g,4.5)},
 pump:function(o){o=o||{};var g=new THREE.Group();g.add(lathe([[0,0],[.62,0],[.7,.1],[.7,3.2],[.62,3.35],[0,3.35]],M.pearl));
  g.add(band(.715,1.4,1.5,labelTex(null,"#3a0f1c","#9a7a3e",o.name||"Eye Restore Cream"),Math.PI*1.1,true));
  var col=new THREE.Mesh(new THREE.CylinderGeometry(.34,.4,.42,64),M.gold);col.position.y=3.55;g.add(col);
  var st=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.55,24),M.gold);st.position.y=4;g.add(st);
  var hd=new THREE.Mesh(new THREE.CylinderGeometry(.24,.3,.32,48),M.gold);hd.position.y=4.42;g.add(hd);
  var no=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.62,24),M.gold);no.rotation.z=Math.PI/2;no.position.set(.36,4.48,0);g.add(no);return fit(g,4.7)},
 lotion:function(o){o=o||{};var g=new THREE.Group();
  g.add(lathe([[0,0],[.98,0],[1.1,.14],[1.16,.7],[1.16,2.6],[1.08,3.0],[.7,3.3],[.5,3.38],[0,3.38]],o.mat||M.frost));
  g.add(band(1.175,1.6,1.55,labelTex("#2a0c16","#efe7dc","#d7b46a",o.name||"Silk Body Lotion"),Math.PI*1.05));
  var col=new THREE.Mesh(new THREE.CylinderGeometry(.5,.56,.5,64),M.gold);col.position.y=3.62;g.add(col);
  var head=new THREE.Group();
  var st=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.7,24),M.gold);st.position.y=4.15;head.add(st);
  var hd=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.34,48),M.gold);hd.position.y=4.6;head.add(hd);
  var no=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.95,24),M.gold);no.rotation.z=Math.PI/2;no.position.set(.5,4.66,0);head.add(no);
  var tp=new THREE.Mesh(new THREE.CylinderGeometry(.115,.1,.09,24),M.black);tp.rotation.z=Math.PI/2;tp.position.set(1.0,4.66,0);head.add(tp);g.add(head);
  var w=fit(g,5.2);w.userData.head=head;w.userData.noz=new THREE.Vector3(1.0,4.6,0);return w}};
/* product catalog for renders */
var CAT={
 lum:{k:"serum",o:{name:"Luminous Oil Serum"}},
 cbr:{k:"serum",o:{name:"Brightening C Serum",tint:0x140802,liq:0xe09a14,em:0x7a4204}},
 bar:{k:"jar",o:{name:"Barrier Repair Cream"}},
 mas:{k:"jar2",o:{name:"Overnight Renewal Mask"}},
 cla:{k:"tube",o:{name:"Clarity Gel Cleanser"}},
 mil:{k:"tube",o:{name:"Soft Milk Cleanser",dark:true,plum:true}},
 dew:{k:"mist",o:{name:"Dew Essence Mist"}},
 eye:{k:"pump",o:{name:"Eye Restore Cream"}},
 lot:{k:"lotion",o:{name:"Silk Body Lotion"}}};
function buildProduct(id){var c=CAT[id],o=Object.assign({},c.o);if(id==="mil")o.mat=M.plum;return B[c.k](o)}

/* ---------- cream surface with real relief ---------- */
function discGeo(rings,segs){var pos=[],uv=[],idx=[];
 for(var i=0;i<=rings;i++)for(var j=0;j<=segs;j++){var r=i/rings,th=j/segs*Math.PI*2,x=r*Math.cos(th),z=r*Math.sin(th);pos.push(x,0,z);uv.push(x*.5+.5,z*.5+.5)}
 for(var i2=0;i2<rings;i2++)for(var j2=0;j2<segs;j2++){var a=i2*(segs+1)+j2,b=a+1,c=a+segs+1,d=c+1;idx.push(a,b,c,b,d,c)}
 var g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 var n=g.attributes.normal;if(n.getY(0)<0){g.setIndex(idx.map(function(v,i){var m=i%3;return idx[i-m+(m===1?2:m===2?1:0)]}));g.computeVertexNormals()}
 g.userData.base=new Float32Array(pos);return g}
function creamSurface(mapTex){var geo=discGeo(56,128);var m=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({map:mapTex||null,color:mapTex?0xffffff:0xf0e6d6,roughness:.34,clearcoat:.9,clearcoatRoughness:.14,envMapIntensity:.9,side:THREE.DoubleSide}));
 m.userData.relief=function(amp,sw,mound){var p=geo.attributes.position,b=geo.userData.base;for(var i=0;i<p.count;i++){var x=b[i*3],z=b[i*3+2],r=Math.sqrt(x*x+z*z),th=Math.atan2(z,x);
   var h=amp*(Math.sin(3*th-13*r+sw)*.55+Math.sin(5*th-22*r+sw*1.4)*.25)*(.35+r)*(1-r*r*.6)+mound*Math.exp(-r*r*5.5);p.setY(i,h)}
  p.needsUpdate=true;geo.computeVertexNormals()};return m}

/* ---------- petals from real photography ---------- */
function petalTexture(img,sx,sy,sw,sh,kind){var c=document.createElement("canvas");c.width=128;c.height=176;var x=c.getContext("2d");
 x.save();x.beginPath();
 if(kind==="floret"){x.moveTo(64,10);x.bezierCurveTo(100,40,96,120,64,168);x.bezierCurveTo(32,120,28,40,64,10)}
 else{x.moveTo(64,172);x.bezierCurveTo(6,140,12,50,64,6);x.bezierCurveTo(116,50,122,140,64,172)}
 x.closePath();x.clip();
 if(img&&img.complete&&img.naturalWidth)x.drawImage(img,sx,sy,sw,sh,0,0,128,176);else{x.fillStyle=kind==="rose"?"#b0466a":"#d9a43a";x.fillRect(0,0,128,176)}
 var g=x.createLinearGradient(0,0,0,176);g.addColorStop(0,"rgba(255,255,255,.10)");g.addColorStop(.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(60,10,20,.28)");x.fillStyle=g;x.fillRect(0,0,128,176);
 x.strokeStyle="rgba(255,255,255,.14)";x.lineWidth=1.2;x.beginPath();x.moveTo(64,166);x.lineTo(64,20);x.stroke();x.restore();
 var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function petalGeo(w,h){var g=new THREE.PlaneGeometry(w,h,5,8),p=g.attributes.position;for(var i=0;i<p.count;i++){var x=p.getX(i),y=p.getY(i);p.setZ(i,-(x*x)*1.5+y*y*.32+Math.abs(x)*.05)}g.computeVertexNormals();return g}
function petalMat(tex){return new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:.55,metalness:0,alphaTest:.35,transparent:false,envMapIntensity:.5})}

export { ss, clamp01, lerp, labelTex, makeEnv, mkRenderer, stage, M, mats, glassMat, liquidMat, lathe, band, fit, glassBody, shadowDisc, LT, B, CAT, buildProduct, discGeo, creamSurface, petalTexture, petalGeo, petalMat };
