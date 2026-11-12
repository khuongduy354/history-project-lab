const cache=new Map();
function load(url){if(!cache.has(url)){const im=new Image();im.src=url;cache.set(url,im.decode().then(()=>im))}return cache.get(url)}
export async function painted(canvas,i){
 const [terrain,actor,lane]=await Promise.all([load('art/pass-'+i+'.webp'),load('art/unit-'+i+'.webp'),load('art/lane-'+i+'.webp')]);const c=canvas.getContext('2d',{alpha:false});
 const W=480,H=510;const vign=c.createRadialGradient(W/2,H*.5,70,W/2,H*.51,360);vign.addColorStop(0,'#1b282600');vign.addColorStop(1,'#13282052');
 function circle(x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 return {render({time,px,py,shots,marks,inv,effects=[],tilt=0,focus=false,preview=false}){
 c.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 const scroll=time*40+99,base=Math.floor(scroll/H),off=scroll%H;
 for(let j=-1;j<=0;j++){let y=off+j*H;c.save();c.translate(0,y);if(Math.abs(base-j)%2){c.translate(0,H);c.scale(1,-1)}c.drawImage(preview?terrain:lane,0,0,W,H+.5);c.restore()}
 c.fillStyle='rgba(17,30,27,.13)';c.fillRect(0,0,W,H);c.fillStyle=vign;c.fillRect(0,0,W,H);
 for(let k=0;k<12;k++){const x=(k*91+Math.sin(time*.8+k)*10)%W,y=(k*97+time*28)%(H+10);circle(x,y,k%2?.9:1.35,'#fff5c065')}
 let sh=preview?106:i>=2?65:60,sw=sh*actor.width/actor.height;c.save();c.translate(px,py);c.rotate(tilt*.105);c.fillStyle='#16221e70';c.beginPath();c.ellipse(3,5,sw*.44,sh*.45,-.1,0,Math.PI*2);c.fill();c.drawImage(actor,-sw/2,-sh/2+Math.sin(time*11)*.68,sw,sh);c.restore();
 for(let m of marks){let pulse=Math.sin(time*5+m.x)*1.4;c.strokeStyle='#fff4a7';c.lineWidth=1.5;c.beginPath();c.arc(m.x,m.y,11+pulse,0,Math.PI*2);c.stroke();c.fillStyle='#76522f';c.fillRect(m.x-6,m.y-5,12,11);c.fillStyle='#ffcf60';c.fillRect(m.x-5,m.y-6,10,9);c.fillStyle='#fff5b4';c.fillRect(m.x-1,m.y-6,2,10)}
 for(let o of shots){const a=Math.atan2(o.dy,o.dx),tail=o.r*2.9;c.save();c.translate(o.x,o.y);c.rotate(a);c.fillStyle=o.kind?'#ad402e':'#a94141';c.beginPath();c.moveTo(-tail,0);c.quadraticCurveTo(-o.r,-o.r*.64,1,-o.r*.5);c.lineTo(1,o.r*.6);c.closePath();c.fill();circle(0,0,o.r+1.15,'#511f29');circle(0,0,o.r,o.kind?'#ff9c4f':'#f06770');circle(0,0,o.r*.52,'#fff1cf');c.restore()}
 for(let p of effects){let t=p.age/p.span;c.globalAlpha=1-t;c.strokeStyle=p.color;c.lineWidth=1.5;c.beginPath();c.arc(p.x,p.y,p.size*(.2+t),0,Math.PI*2);c.stroke();for(let k=0;k<6;k++){let a=k*Math.PI/3+p.x*.1;circle(p.x+Math.cos(a)*t*p.size,p.y+Math.sin(a)*t*p.size,1.8,p.color)}c.globalAlpha=1}
 if(!preview){circle(px,py,5.1,'#193e36');circle(px,py,3.1,'#fffcda');if(inv>0||focus){c.strokeStyle=inv?'#c8fff0':'#f0f5b9';c.lineWidth=1.6;c.beginPath();c.arc(px,py,inv?19:10.5,0,Math.PI*2);c.stroke()}}
 },dispose(){}}
}
