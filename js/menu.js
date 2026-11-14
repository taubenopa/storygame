// HELLFIRE LAN - Menue: Navigation, Feuer-Logo, Vorschau-Kamerafahrt im Hintergrund, Controller im Menue
let peerMade=0,curPane='';
function go(name){
 if(curPane===name)name='';curPane=name;
 document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('on',p.id=='p-'+name));
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go==name));
 if(name=='story'||name=='host'){storyLobby=name=='story'?1:0;ul();if(!peerMade){peerMade=1;mkPeer()}}
 try{click()}catch(e){}
}
function menuInit(){
 document.querySelectorAll('#nav button').forEach(b=>{b.onclick=()=>go(b.dataset.go)});
 const nm=$('nm');try{if(localStorage.hfName)nm.value=localStorage.hfName}catch(e){}nm.oninput=()=>{try{localStorage.hfName=nm.value}catch(e){}};
 $('sv').oninput=()=>{try{ac();mst.gain.value=$('sv').value/100*1.2}catch(e){}};
 logoInit();
}

// ---------- Logo: Pixel-Schrift, aus der Feuer aufsteigt (der klassische Feuer-Effekt alter Shooter) ----------
const LG={W:150,H:52,buf:null,mask:null,img:null,g:null,pal:[]};
function logoInit(){
 const c=$('logo'),g=LG.g=c.getContext('2d'),W=LG.W,H=LG.H;LG.buf=new Uint8Array(W*H);LG.mask=new Uint8Array(W*H);LG.img=g.createImageData(W,H);
 const F={H:['1001','1001','1111','1001','1001','1001','1001'],E:['1111','1000','1000','1110','1000','1000','1111'],L:['1000','1000','1000','1000','1000','1000','1111'],
  F:['1111','1000','1000','1110','1000','1000','1000'],I:['111','010','010','010','010','010','111'],R:['1110','1001','1001','1110','1010','1001','1001'],A:['0110','1001','1001','1111','1001','1001','1001'],N:['1001','1101','1101','1011','1011','1001','1001']};
 const put=(txt,sc,y0)=>{let w=0;for(const ch of txt)w+=(F[ch][0].length+1)*sc;let a=((W-w+sc)/2)|0;for(const ch of txt){const f=F[ch];for(let j=0;j<7;j++)for(let i=0;i<f[0].length;i++)if(f[j][i]=='1')for(let q=0;q<sc;q++)for(let p=0;p<sc;p++)LG.mask[(y0+j*sc+q)*W+a+i*sc+p]=sc>1?2:1;a+=(f[0].length+1)*sc}};
 put('HELLFIRE',3,20);put('LAN',1,44);
 for(let i=0;i<37;i++){const t=i/36;LG.pal.push([Math.min(255,t*3*255)|0,Math.max(0,Math.min(255,(t*3-1)*255))|0,Math.max(0,Math.min(255,(t*3-2)*255))|0,i<3?0:Math.min(255,i*22)])}
}
function logoTick(){
 const W=LG.W,H=LG.H,b=LG.buf,m=LG.mask,d=LG.img.data;if(!b)return;
 for(let i=0;i<W*H;i++)if(m[i]==2&&Math.random()<.5)b[i]=28+(Math.random()*9|0);
 for(let y=1;y<H;y++)for(let x0=0;x0<W;x0++){const s=y*W+x0,r=(Math.random()*3)|0,t=s-W-r+1;if(t>=0)b[t]=Math.max(0,b[s]-(r&1)-(Math.random()<.35?1:0))}
 for(let i=0;i<W*H;i++){const p=LG.pal[b[i]],k=i*4,y=(i/W)|0;
  if(m[i]==2){const t=(y-20)/21;d[k]=255;d[k+1]=(225-t*150)|0;d[k+2]=(90-t*80)|0;d[k+3]=255}
  else if(m[i]==1){d[k]=227;d[k+1]=218;d[k+2]=209;d[k+3]=255}
  else{d[k]=p[0];d[k+1]=p[1];d[k+2]=p[2];d[k+3]=p[3]}}
 LG.g.putImageData(LG.img,0,0);
}

// ---------- Vorschau: Kamerafahrt durch die Karten, waehrend das Menue offen ist ----------
const ATT={maps:[0,6,7,4],k:-1,t:0,s:0,fade:1,cam:{x:2.5,y:2.5,a:0,pt:0,z:0},S:null,len:0,seg:null,
 path:{0:[[2.4,2.4],[21.6,2.4],[21.6,21.6],[2.4,21.6]],6:[[5.5,3.2],[5.5,20.8],[12,21.9],[18.5,20.8],[18.5,3.2],[12,2.1]],7:[[6,6],[18,6],[18,18],[6,18]],4:[[9.5,3],[14.5,3],[14.5,21],[9.5,21]]}};
const still=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
function attAt(s){s=((s%ATT.len)+ATT.len)%ATT.len;for(const q of ATT.seg){if(s<=q.l)return[q.a[0]+(q.b[0]-q.a[0])*s/q.l,q.a[1]+(q.b[1]-q.a[1])*s/q.l];s-=q.l}return ATT.seg[0].a}
function attSetup(){
 ATT.k=(ATT.k+1)%ATT.maps.length;const mi=ATT.maps[ATT.k];loadMap(mi);const P=ATT.path[mi];ATT.seg=P.map((a,i)=>{const b=P[(i+1)%P.length];return{a,b,l:Math.hypot(b[0]-a[0],b[1]-a[1])}});ATT.len=ATT.seg.reduce((n,q)=>n+q.l,0);ATT.t=0;ATT.s=0;ATT.fade=1;
 const T=[35,30,31,20,32,21,33,22,34],e=[];for(let k=0;k<T.length;k++)e.push({id:9000+ATT.k*20+k,t:T[k],o:ATT.len*(k+.5)/T.length,x:0,y:0,ph:k,mv:1,fl:0,dead:0});
 ATT.S={p:[],e,j:[],k:[],wv:0};const p=attAt(0),q=attAt(2);ATT.cam.x=p[0];ATT.cam.y=p[1];ATT.cam.a=Math.atan2(q[1]-p[1],q[0]-p[0]);
}
function attract(t){
 logoTick();padMenu();
 if(still&&ATT.S&&frameN>3)return;
 if(!ATT.S||ATT.t>17)attSetup();
 ATT.t+=dt;ATT.s+=dt*1.5;ATT.fade=ATT.t<.8?1-ATT.t/.8:ATT.t>16.2?(ATT.t-16.2)/.8:0;
 const c=ATT.cam,p=attAt(ATT.s),q=attAt(ATT.s+2.2);c.x=p[0];c.y=p[1];
 let da=Math.atan2(q[1]-p[1],q[0]-p[0])-c.a;da=Math.atan2(Math.sin(da),Math.cos(da));c.a+=da*Math.min(1,dt*2.2);c.pt=Math.sin(ATT.t*.5)*10;
 for(const e of ATT.S.e){e.o-=dt*.8;const a=attAt(e.o);let ex=a[0]+(12-a[0])*.14,ey=a[1]+(12-a[1])*.14;if(sol(ex,ey)){ex=a[0];ey=a[1]}e.x=ex;e.y=ey;e.ph+=dt*4}
 const sm=me,sS=S;me=c;S=ATT.S;attractOn=1;bob+=dt*5;
 try{render()}finally{attractOn=0;me=sm;S=sS}
 if(ATT.fade>0){x.fillStyle='rgba(0,0,0,'+Math.min(1,ATT.fade).toFixed(2)+')';x.fillRect(0,0,VW,VH)}
}

// ---------- Controller im Menue: Steuerkreuz/Stick auf-ab, A = auswaehlen, B = zurueck ----------
const PM={b:[],t:0};
function padMenu(){
 let g=null;try{for(const q of navigator.getGamepads())if(q&&q.connected){g=q;break}}catch(e){}if(!g)return;
 const B=i=>g.buttons[i]&&g.buttons[i].pressed?1:0,ay=g.axes[1]||0,ax=g.axes[0]||0,st=[B(12)||ay<-.6?1:0,B(13)||ay>.6?1:0,B(14)||ax<-.6?1:0,B(15)||ax>.6?1:0,B(0),B(1)],hit=i=>st[i]&&!PM.b[i];
 const L=[...document.querySelectorAll('#nav button,.pane.on button,.pane.on select,.pane.on input:not([type=file])')].filter(e=>e.offsetParent&&!e.disabled),el=document.activeElement,k=L.indexOf(el);
 if(hit(0)||hit(1)){const n=L[(k+(hit(1)?1:-1)+L.length)%L.length]||L[0];if(n){n.focus();n.scrollIntoView({block:'nearest'})}}
 if(el&&el.tagName=='SELECT'&&(hit(2)||hit(3))){el.selectedIndex=Math.max(0,Math.min(el.options.length-1,el.selectedIndex+(hit(3)?1:-1)));el.dispatchEvent(new Event('change'))}
 if(el&&el.type=='range'&&(st[2]||st[3])){el.value=+el.value+(st[3]?1:-1);el.dispatchEvent(new Event('input'))}
 if(hit(4)&&el&&k>=0&&el.click)el.click();
 if(hit(5)&&curPane)go(curPane);
 PM.b=st;
}
