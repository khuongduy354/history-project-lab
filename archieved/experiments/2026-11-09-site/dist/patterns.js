// Choreographed arcade patterns; all time, spacing and damage are fictional.
const phases=[
 ['Mưa đầu đèo','Dải lụa qua thung','Cửa giữa mưa'],
 ['Tán rừng lay','Hai dòng suối','Vệt mưa xiên'],
 ['Qua dốc đá','Gió lùa qua khe','Mắt bão'],
 ['Đường đỏ','Hai vành mây','Mưa cuối mùa']
];
export const phase=(f)=>f<.33?0:f<.68?1:2;
export const phaseTitle=(i,f)=>phases[i][phase(f)];
export function volley(i,time,total,w,shot){
 let p=phase(time/total),v=108+13*i+10*p;
 function fan(x,y,num,arc,rot,vel=v,kind=1){for(let j=0;j<num;j++){let a=rot+(j/(num-1)-.5)*arc;shot(x,y,Math.sin(a)*vel,Math.cos(a)*vel,5.1,kind)}}
 function curtain(vel,gap,lean,spacing=40){for(let j=0;j<Math.ceil(500/spacing);j++){let x=j*spacing+12;if(Math.abs(x-gap)<42)continue;shot(x,-11,lean,vel,5.6,0)}}
 if(i===0){if(p===0){curtain(v,220+115*Math.sin(w*.61),6,50);return 1.05}if(p===1){fan(w%2?108:380,-12,6,1.4,w%2?.16:-.16);return .92}curtain(v,240+148*Math.sin(w*.52),12*Math.sin(w*.52),36);return .85}
 if(i===1){if(p===0){fan(w%2?90:390,-8,6,1.45,w%2?.17:-.17);return .76}if(p===1){fan(100,-15,5,1,.35+Math.sin(w*.4)*.18);fan(380,-15,5,1,-.35-Math.sin(w*.4)*.18);return 1.08}curtain(v,220+130*Math.sin(w*.44),w%2?46:-46,40);return .72}
 if(i===2){if(p===0){fan(105,-12,6,1.6,.18);if(w%2===0)fan(400,-22,5,1.5,-.3);return .8}if(p===1){curtain(v,235+140*Math.sin(w*.63),-22,37);return .77}fan(240+Math.sin(w*.61)*125,-13,12,2.27,Math.sin(w*.39)*.11);return .67}
 if(p===0){curtain(v,245+145*Math.sin(w*.58),Math.sin(w*.72)*22,36);return .72}
 if(p===1){fan(120,-7,8,1.9,.13+Math.sin(w*.55)*.26);fan(360,-7,8,1.9,-.13-Math.sin(w*.55)*.26);return .95}
 fan(237+Math.sin(w*.58)*126,-15,13,2.5,Math.sin(w*.44)*.14);if(w%4===0)curtain(v*.75,250+90*Math.sin(w*.58),0,77);return .66
}
