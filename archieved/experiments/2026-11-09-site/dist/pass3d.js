// Lit mesh renderer, WebGL 1. World axes: X across road, Y altitude, Z distance.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=n=>{let a=Math.sin(n*18.71+47.82)*43758.545;return a-Math.floor(a)};
const cols=['#849361','#486e58','#637b78','#8c9658'],dust=['#d1ad76','#a99264','#a29273','#bb895d'];
const pal=new Map();
function rgb(c){if(!pal.has(c))pal.set(c,[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)/255));return pal.get(c)}
// Terrain heights are fictional stage design, not surveyed terrain.
const period=56;
function gradeLine(z,i){
 const at=t=>{const a=t*2*Math.PI/period+i*.69;return (2.05+.10*i)*Math.sin(a)+.24*Math.sin(2*a-.36)};
 const z0=Math.floor(z/2)*2;return at(z0)+(at(z0+2)-at(z0))*(z-z0)/2
}
function landHeight(x,z,i){
 const a=z*2*Math.PI/period+i*.69,side=x<0?-1:1;
 const verge=Math.max(0,Math.abs(x)-(8.9+side*1.0*Math.sin(2*a)));
 const smooth=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
 const ridge=(side>0?9.2:6.5)+(side>0?4.3:3.2)*Math.cos(a+side*1.3)+1.8*Math.sin(2*a+.45*x);
 return gradeLine(z,i)+ridge*smooth(verge/10)*(1-.68*smooth((verge-10)/16))+
  .60*Math.sin(.76*x+side*a)*smooth(verge/3)
}
function mesh(lift=null){const a=[];let ox=0,oy=0,oz=0,anchored=false;
 function tri(A,B,C,col,unlit=false){if(lift){const point=p=>[p[0],p[1]+(anchored?lift(ox,oz):lift(p[0]+ox,p[2]+oz)),p[2]];A=point(A);B=point(B);C=point(C)}let u=B.map((v,i)=>v-A[i]),v=C.map((n,i)=>n-A[i]),nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],l=Math.hypot(nx,ny,nz)||1;let shade=unlit?1:clamp(.75+(-.32*nx+.54*ny+.31*nz)/l*.45,.52,1.12);let cc=rgb(col).map(x=>x*shade);for(let p of [A,B,C])a.push(p[0]+ox,p[1]+oy,p[2]+oz,...cc)}
 function quad(A,B,C,D,col,lit){tri(A,B,C,col,lit);tri(A,C,D,col,lit)}
 function box(x,y,z,w,h,d,c){let a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],e=[x-w/2,y,z+d/2],f=[x+w/2,y,z+d/2],t=p=>[p[0],p[1]+h,p[2]],A=t(a),B=t(b),E=t(e),F=t(f);quad(A,E,F,B,c);quad(b,B,F,f,c);quad(e,E,A,a,c);quad(f,F,E,e,c);quad(a,A,B,b,c)}
 function cone(x,y,z,base,top,h,n,c,turn=0){for(let i=0;i<n;i++){let p=turn+i*6.283/n,q=turn+(i+1)*6.283/n;let A=[x+base*Math.cos(p),y,z+base*Math.sin(p)],B=[x+base*Math.cos(q),y,z+base*Math.sin(q)],C=[x+top*Math.cos(q),y+h,z+top*Math.sin(q)],D=[x+top*Math.cos(p),y+h,z+top*Math.sin(p)];quad(A,D,C,B,c);if(top)tri([x,y+h,z],C,D,c)}}
 function bar(A,B,r,c){let dx=B[0]-A[0],dy=B[1]-A[1],dz=B[2]-A[2],len=Math.hypot(dx,dy,dz)||1;let ref=Math.abs(dy/len)>.9?[1,0,0]:[0,1,0],u=[dy*ref[2]-dz*ref[1],dz*ref[0]-dx*ref[2],dx*ref[1]-dy*ref[0]],lu=Math.hypot(...u);u=u.map(x=>x/lu);let v=[(dy*u[2]-dz*u[1])/len,(dz*u[0]-dx*u[2])/len,(dx*u[1]-dy*u[0])/len];const pt=(P,i)=>P.map((val,k)=>val+r*(u[k]*Math.cos(i*Math.PI/2)+v[k]*Math.sin(i*Math.PI/2)));for(let i=0;i<4;i++)quad(pt(A,i),pt(B,i),pt(B,i+1),pt(A,i+1),c)}
 function wheel(x,y,z,r,c){let n=12;for(let i=0;i<n;i++){let p=i*6.283/n,q=(i+1)*6.283/n,pt=(angle,radius,side)=>[x+side,y+radius*Math.sin(angle),z+radius*Math.cos(angle)];quad(pt(p,r,-.065),pt(q,r,-.065),pt(q,r,.065),pt(p,r,.065),c);for(let side of [-.065,.065]){quad(pt(p,r,side),pt(q,r,side),pt(q,r*.78,side),pt(p,r*.78,side),c);if(i%2===0)bar([x+side,y,z],pt(p,r*.8,side),.013,'#b7ad88')}}}
 function oval(x,y,z,r,s,c){for(let i=0;i<16;i++)tri([x,y,z],[x+r*Math.cos(i*.3927),y,z+s*Math.sin(i*.3927)],[x+r*Math.cos((i+1)*.3927),y,z+s*Math.sin((i+1)*.3927)],c,true)}
 return {a,tri,quad,box,cone,bar,wheel,oval,at(x,y,z){ox=x;oy=y;oz=z;anchored=!!(x||y||z)}};
}
function terrain(i,offset){let m=mesh((x,z)=>landHeight(x,z+offset,i)),radius=i===1?6.7:7.9;
 for(let j=0;j<14;j++){let z=j*2-14;let bend=Math.sin(z*Math.PI/14)*1.3,w=radius+Math.sin(z*Math.PI/7)*.4,br=Math.sin((z+2)*Math.PI/14)*1.3,wr=radius+Math.sin((z+2)*Math.PI/7)*.4;
 for(let x=-46;x<46;x+=1){
   let side=x<0?-1:1,steep=Math.abs(landHeight(x+1,z+offset,i)-landHeight(x,z+offset,i));
   let c=Math.abs(x)>9.5&&steep>1.13?(i===2?'#898675':'#929073'):cols[i];
   m.quad([x,-.14,z],[x,-.14,z+2],[x+1,-.14,z+2],[x+1,-.14,z],c)
 }
 m.quad([bend-w,0,z],[br-wr,0,z+2],[br+wr,0,z+2],[bend+w,0,z],dust[i]);
 for(let side of [-1,1]){let a=side*w+bend,b=side*wr+br;m.quad([a,.005,z],[b,.005,z+2],[b+side*.55,.005,z+2],[a+side*.55,.005,z],i===2?'#808b7d':'#a8976d');
 for(let n=0;n<2;n++){let ix=side*(10.7+rnd(j*32+n+side+i)*9),iz=z+2*rnd(j+3*n+i),size=.60+.9*rnd(j*18+n+i),l=n===0?'#42654c':'#537851';m.at(ix,0,iz);m.oval(.3,.01,.2,size*1.3,size*.7,'#73825e');m.cone(0,0,0,.17,.10,1.8*size,5,'#775e46');if(i===1){for(let k=0;k<7;k++){let ang=k*.9+ix,xx=Math.cos(ang),zz=Math.sin(ang);m.tri([0,size*2.15,0],[xx*size*.75-zz*.33,size*2.35,zz*size*.75+xx*.33],[xx*size*1.5,size*1.48,zz*size*1.5],l);m.tri([0,size*2.15,0],[xx*size*1.5,size*1.48,zz*size*1.5],[xx*size*.75+zz*.31,size*2.3,zz*size*.75-xx*.31],'#709067')}}else{m.cone(0,size*.65,0,size,.27*size,1.7*size,6,l);m.cone(0,size*1.45,0,size*.75,0,size*1.7,6,'#66835a',.36)}m.at(0,0,0)}
 let rx=side*(10+rnd(j+side+12)*2);m.cone(rx,0,z,.2+rnd(j+81)*.8,.17,.28+rnd(j+32)*.38,6,'#929281',j*.5)}
 for(let n=0;n<5;n++){let x=(rnd(j*41+n*2)-.5)*(w*1.9)+bend,zz=z+rnd(j*13+n)*1.7;m.tri([x,.018,zz],[x+.05,.018,zz+.08],[x+.15,.018,zz],i===2?'#827e6c':'#b09e78')}
 if(i>=2){for(let s of [-1,1]){let a=bend+s*.89,b=br+s*.89;m.quad([a-.07,.014,z],[b-.07,.014,z+2],[b+.07,.014,z+2],[a+.07,.014,z],'#947e63')}}
 }
 // Shallow banks, paddy boundaries, irregular grass tufts and rain pools.
 for(let j=0;j<58;j++){const z=-14+rnd(j+103)*28,side=j%2?1:-1,x=side*(7.85+rnd(j+71)*3)+Math.sin(z*Math.PI/14)*1.3;
 for(let h=0;h<3;h++){let X=x+h*.065,ht=.10+rnd(j+h+44)*.34;m.tri([X,0,z],[X+.055,0,z+.05],[X-.06,ht,z+.09],i===3?'#968751':'#797e50')}
 if(j%7===0){m.oval(x*.81,.022,z,.16+rnd(j)*.55,.11+rnd(j+4)*.22,i===2?'#738f8a':'#a79c77')}}
 for(let k=0;k<6;k++){let z=-14+k*4.6,side=k%2?1:-1,xx=side*(10.8+rnd(k+i)*1.4);
 if(i===0){for(let j=0;j<3;j++){m.box(xx+side*j*.86,.03+j*.15,z,1.08,.15,3.5,j%2?'#afad61':'#b9ae63');m.box(xx+side*j*.86,.18+j*.15,z+1.72,1.08,.1,.13,'#897f4e')}}
 if(i===2){let x=xx-.2;m.cone(x,0,z,1.2,.85,.6,6,'#878e85');m.cone(x+.5,.41,z+.3,.72,.30,.72,5,'#92978b')}
 if(i===3){m.box(xx,.03,z,.10,.62,.10,'#926b46');m.bar([xx,.55,z],[xx+side*.1,.58,z+2.0],.045,'#ae9065');m.box(xx+side*.1,.03,z+2,.1,.62,.1,'#926b46')}
 }
 if(i===2){for(let j=0;j<12;j++){let z=3+j*.23,bend=Math.sin(z*Math.PI/14)*1.3;m.box(bend,.024,z,15.4,.075,.21,j%3?'#a08565':'#937959')}
 for(let side of [-1,1]){for(let j=0;j<4;j++)m.box(side*7.6+.9,0,3+j*.85,.13,.72,.15,'#775c41');m.bar([side*7.6+.9,.55,3],[side*7.6+.9,.55,5.6],.055,'#ab906a')}}
 // Landmarks repeat far outside the playable area.
 if(i===0){for(let k=0;k<3;k++){m.at(15+k*1.6,0,5+k*1.3);m.box(0,0,0,1.6,1.2,2,'#ad8a5b');m.quad([-1,.98,-1.25],[-1,.98,1.25],[0,1.9,1.25],[0,1.9,-1.25],'#836744');m.quad([0,1.9,-1.25],[0,1.9,1.25],[1,.98,1.25],[1,.98,-1.25],'#b09460')}m.at(0,0,0)}
 return m}
function vista(i){let m=mesh();m.quad([-95,-8,-95],[-95,-8,-19],[95,-8,-19],[95,-8,-95],'#829984');for(let j=-7;j<=7;j++){let x=j*6;for(let l=0;l<2;l++)m.cone(x+rnd(j*2+l)*3,-2,-58-l*16,9+rnd(j+16)*7,.4+rnd(j+50)*2,4+rnd(j*2+7*l)*6,7,l?'#78958a':'#708e79',j*.7)}return m}
function person(m,x,z,bike,step=0){let sg=Math.sin(step)*.14;for(let k of [-1,1]){m.bar([x+k*.12,.61,z],[x+k*.13,.11,z+k*sg],.09,'#3d4b46');m.box(x+k*.14,.025,z+k*sg-.05,.17,.1,.27,'#503d2e')}
 m.cone(x,.56,z,.25,.2,.56,6,'#4e6958');m.cone(x,1.10,z-.05,.14,.15,.22,7,'#a57a53');m.cone(x,1.25,z-.05,.34,.035,.23,10,'#d7bd82');
 if(!bike){m.box(x,.66,z+.2,.48,.48,.32,'#a1814d');for(let k=0;k<3;k++)m.box(x,.69+k*.13,z+.2,.50,.025,.33,'#675937')}
 for(let k of [-1,1])m.bar([x+k*.2,.98,z],[x+k*.23+(bike?.13:0),.73,z-.19],.065,'#6b765b')}
function actor(i,phase=0){let m=mesh();if(i===0){m.wheel(.17,.33,-.64,.33,'#353f35');m.wheel(.17,.33,.65,.34,'#353f35');for(let [a,b] of [[[.17,.33,-.64],[.17,.97,-.38]],[[.17,.33,.65],[.17,.85,.25]],[[.17,.33,.65],[.17,.38,.08]],[[.17,.38,.08],[.17,.97,-.38]],[[.17,.85,.25],[.17,.97,-.38]]])m.bar(a,b,.035,'#526a5a');m.bar([-.14,.98,-.4],[.48,.98,-.4],.035,'#38382b');m.box(.17,.71,.53,.85,.42,.59,'#b7945b');for(let k of [-1,1])m.box(.17+k*.21,.72,.53,.04,.43,.61,'#695e42');person(m,-.40,-.02,true,phase)}
 else if(i===1)person(m,0,0,false,phase);
 else{let c=i===2?'#576c56':'#68734c';for(let x of [-.58,.58])for(let z of [-.79,.77]){m.wheel(x,.34,z,.32,'#29382f');m.box(x,.21,z,.20,.22,.26,'#575e4f')}m.box(0,.28,0,1.17,.20,2.13,'#384b3b');m.box(0,.48,-.84,1.04,.29,.81,c);m.box(0,.74,-.51,1.08,.50,.54,c);m.box(0,1.03,-.80,.92,.17,.025,'#8fb0a6');m.box(0,1.01,-.815,.037,.21,.025,c);m.box(0,1.23,-.51,1.14,.08,.66,'#536345');m.box(0,.46,-1.26,1.24,.12,.13,'#485448');for(let x of [-.4,.4])m.box(x,.60,-1.25,.18,.12,.035,'#ffe4a4');for(let j=0;j<6;j++)m.box(-.26+j*.10,.52,-1.265,.04,.16,.025,'#33463c');
 m.box(0,.50,.57,1.14,.27,1.47,c);if(i===2){for(let x of [-.27,.27])for(let z of [.25,.88]){m.box(x,.78,z,.48,.37,.53,'#ae8a57');m.box(x,.79,z,.06,.38,.54,'#72684e')}}else{m.box(0,.76,.56,1.13,.53,1.48,'#aa966c');m.box(0,1.28,.56,.85,.13,1.43,'#b9a97d');for(let z of [0,.53,1.13])m.box(0,1.29,z,.86,.14,.034,'#8a805e')}
 }return m}
function orb(){const m=mesh();m.cone(0,-.025,0,.29,.26,.09,10,'#77363a');m.cone(0,.065,0,.25,.15,.20,10,'#ff7353');m.cone(0,.26,0,.15,.04,.09,10,'#fff7bb');return m}
function parcel(){let m=mesh();m.box(0,0,0,.65,.46,.56,'#edb955');m.box(0,-.01,0,.12,.49,.57,'#755e40');m.box(0,.46,0,.66,.025,.1,'#faf1bc');return m}
const V='attribute vec3 pos,col;uniform vec3 shift;uniform float ratio,sz,pitch;varying vec3 tint;void main(){float cs=cos(pitch),sn=sin(pitch);vec3 w=vec3(pos.x,pos.y*cs+pos.z*sn,-pos.y*sn+pos.z*cs)*sz+shift;float z=21.8-.57*w.y-.82*w.z;float v=.82*w.y-.57*w.z;gl_Position=vec4(w.x*1.60/ratio,v*1.60-.10*z,1.004*z-0.81,z);float fog=smoothstep(31.,64.,z);tint=mix(col,vec3(.68,.76,.67),fog*.66);}';
const F='precision mediump float;varying vec3 tint;void main(){gl_FragColor=vec4(tint,1.0);}';
export function renderer3(canvas,i){const gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power'});if(!gl)return null;
 function shader(type,code){let s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 const program=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,V),fs=shader(gl.FRAGMENT_SHADER,F);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('3D program');gl.useProgram(program);
 const ap=gl.getAttribLocation(program,'pos'),ac=gl.getAttribLocation(program,'col'),shift=gl.getUniformLocation(program,'shift'),sz=gl.getUniformLocation(program,'sz'),ratio=gl.getUniformLocation(program,'ratio'),angle=gl.getUniformLocation(program,'pitch');let buffers=[];
 function upload(m){let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(m.a),gl.STATIC_DRAW);buffers.push(b);return [b,m.a.length/6]}
 function paint(obj,x=0,y=0,z=0,size=1,pitch=0){gl.uniform1f(angle,pitch);gl.bindBuffer(gl.ARRAY_BUFFER,obj[0]);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(ac,3,gl.FLOAT,false,24,12);gl.uniform3f(shift,x,y,z);gl.uniform1f(sz,size);gl.drawArrays(gl.TRIANGLES,0,obj[1])}
 function ring(color,r1,r2){const m=mesh();for(let j=0;j<24;j++){let a=j*Math.PI/12,b=a+Math.PI/12;const p=(t,r)=>[r*Math.cos(t),0,r*Math.sin(t)];m.quad(p(a,r1),p(b,r1),p(b,r2),p(a,r2),color,true)}return upload(m)}
 const land=[upload(terrain(i,0)),upload(terrain(i,28))],far=upload(vista(i)),vehicles=Array.from({length:i<2?6:1},(_,j)=>upload(actor(i,j*Math.PI/3))),bullet=upload(orb()),box=upload(parcel()),hit=ring('#fffbe5',.01,.16),rim=ring('#233f37',.165,.25),safe=ring('#9eeee1',.62,.66),shadow=ring('#8e8063',.001,.69),tail=ring('#fb885d',.001,.16),gold=ring('#ffed9a',.62,.68);
 gl.enableVertexAttribArray(ap);gl.enableVertexAttribArray(ac);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(.66,.77,.72,1);
 const wx=x=>(x-240)/30.3,wz=y=>(y-309)/18.8;
 let scroll=0,cam=0;
 const height=z=>gradeLine(z-scroll,i)-cam;
 const angleAt=z=>Math.atan((gradeLine(z-scroll+.6,i)-gradeLine(z-scroll-.6,i))/1.2);
 function render(s){let {time,px,py,shots,marks,inv}=s;
 scroll=time*2.5;cam=.78*gradeLine(4.8-scroll,i);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(ratio,canvas.width/canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);paint(far,0,-cam*.27,0);
 let base=Math.floor(scroll/28),t=scroll-base*28;
 for(let k=-3;k<2;k++)paint(land[((k-base)%2+2)%2],0,-cam,t+k*28);
 let x=wx(px),z=wz(py),y=height(z),ang=angleAt(z);
 paint(shadow,x+.19,height(z+.15)+.06,z+.15,i<2?.75:1.10,ang);
 paint(vehicles[Math.floor(time*7)%vehicles.length],x,y+.08,z,1.40,ang);
 for(let m of marks){let xx=wx(m.x),zz=wz(m.y),hh=height(zz);paint(gold,xx,hh+.14,zz,.75,angleAt(zz));paint(box,xx,hh+.22+Math.sin(time*5+m.x)*.07,zz,1,angleAt(zz))}
 gl.disable(gl.DEPTH_TEST);
 for(let e of s.effects||[]){let zz=wz(e.y);paint(e.color==='#ffe387'?gold:safe,wx(e.x),height(zz)+.24,zz,.24+e.age/e.span*1.4,angleAt(zz))}
 for(let o of shots){let xx=wx(o.x),zz=wz(o.y),tz=zz-o.dy*.04/18.8;paint(tail,xx-o.dx*.04/30.3,height(tz)+.24,tz,.9);paint(bullet,xx,height(zz)+.22,zz,o.r/6)}
 paint(rim,x,y+.27,z,1,ang);paint(hit,x,y+.275,z,1,ang);if(inv>0)paint(safe,x,y+.27,z,1+.1*Math.sin(time*9),ang);gl.enable(gl.DEPTH_TEST)}
 function dragTarget(px,py,dx,dy,gain){
 const aspect=canvas.width/canvas.height,z=wz(py);
 const depth=z=>21.8-.57*(height(z)+.27)-.82*z;
 const vertical=z=>1.60*(.82*(height(z)+.27)-.57*z)/depth(z);
 const u=1.60*wx(px)/(aspect*depth(z))+2*dx*gain,target=vertical(z)-2*dy*gain;
 let lo=wz(45),hi=wz(487);for(let j=0;j<18;j++){let mid=(lo+hi)/2;if(vertical(mid)>target)lo=mid;else hi=mid}
 const zz=(lo+hi)/2;return [u*aspect*depth(zz)/1.60*30.3+240,zz*18.8+309]
 }
 return {render,dragTarget,dispose(){buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext()}}}
