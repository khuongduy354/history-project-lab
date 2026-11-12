// Expand by route, not only by ID: a shared ending can have different text per parent.
function campaignTree(g){
 const all=[],leaves=[];
 function visit(id,route,parent,index){
  const n=g.nodes[id],e=g.endings[id],origin=parent?.id,variant=e?.by_origin?.[origin];
  const item={id,route,parent,index,stage:n?.time?.split(' · ')[0],title:n?.title||variant?.[0]||e.title,marker:n?.marker||variant?.[0]||e.title,children:[],historic:e?.status==='Lịch sử',end:!!e};
  all.push(item);if(n)n.choices.forEach((c,i)=>{item.children.push(visit(c.next,route+String.fromCharCode(65+i),item,i))});
  if(e){item.row=leaves.length;leaves.push(item)}else item.row=(item.children[0].row+item.children.at(-1).row)/2;
  return item;
 }
 const root=visit(g.entry,'',null,null);return {root,all,leaves}
}
function routeState(g,route){let id=g.entry,log=[];for(const ch of route){const i=ch.charCodeAt(0)-65,c=g.nodes[id]?.choices[i];if(!c)return null;log.push([id,i]);id=c.next}return {id,log,selected:null,skip:log.length}}
function treeView(g,old){
 const {all,leaves}=campaignTree(g),current=old?.log.map(([,i])=>String.fromCharCode(65+i)).join('');
 const x=n=>10+n.route.length*151,y=n=>10+n.row*40,w=122,h=32;
 const width=Math.max(...all.map(x))+w+10,height=Math.max(...all.map(y))+h+10;
 const edges=all.filter(n=>n.parent).map(n=>{
   const sx=x(n.parent)+w,sy=y(n.parent)+h/2,ex=x(n),ey=y(n)+h/2,mid=(sx+ex)/2;
   return '<path data-line="'+n.route+'" d="M'+sx+' '+sy+' C'+mid+' '+sy+' '+mid+' '+ey+' '+ex+' '+ey+'"/>';
 }).join('');
 const nodes=all.map(n=>{
   const here=old?.id===n.id&&n.route===current,title=n.end?'Kết '+String(leaves.indexOf(n)+1).padStart(2,'0'):n.marker;
   return '<button type="button" class="hnode '+(n.end?(n.historic?'true-end':'alt-end'):'')+(here?' at':'')+'" data-inspect="'+n.route+'" aria-controls="branch-info" aria-pressed="false" aria-label="'+esc(title+' · '+n.title)+'" style="left:'+x(n)+'px;top:'+y(n)+'px"><span aria-hidden="true">'+(n.end?'◆':'●')+'</span>'+esc(title)+'</button>'
 }).join('');
 return '<section class="h-tree" aria-label="Cây quyết định"><h1>Cây quyết định</h1><p class="h-tip">Vuốt ngang để xem các nhánh. Chạm hoặc rê chuột vào một nút để xem chi tiết.</p><div class="h-legend"><span>● Cảnh</span><span>◆ Kết phóng tác</span><span>◆ Kết lịch sử</span></div><div class="h-scroll" aria-label="Sơ đồ từ trái sang phải"><div class="h-plane" style="width:'+width+'px;height:'+height+'px"><svg aria-hidden="true" width="'+width+'" height="'+height+'">'+edges+'</svg>'+nodes+'</div></div><section id="branch-info" aria-label="Chi tiết nút" hidden></section></section>'
}
function wireTree(g,container){
 const tree=container.querySelector('.h-tree');if(!tree)return;
 const {all}=campaignTree(g),items=new Map(all.map(n=>[n.route,n])),info=tree.querySelector('#branch-info'),buttons=[...tree.querySelectorAll('[data-inspect]')],lines=[...tree.querySelectorAll('[data-line]')];let pinned=false,active=null;
 function clear(){active=null;pinned=false;info.hidden=true;for(const b of buttons)b.setAttribute('aria-pressed','false');for(const l of lines)l.classList.remove('trace')}
 function inspect(b){if(!b)return;const n=items.get(b.dataset.inspect);if(!n||active===n.route)return;active=n.route;
  for(const node of buttons)node.setAttribute('aria-pressed',String(node===b));for(const l of lines)l.classList.toggle('trace',!!n.route&&n.route.startsWith(l.dataset.line));
  const inChoice=n.parent?g.nodes[n.parent.id].choices[n.index]:null;
  const text=n.end?(g.endings[n.id].by_origin?.[n.parent?.id]?.[1]||g.endings[n.id].closing):g.nodes[n.id].before.situation;
  info.innerHTML='<div class="h-ey"><small>'+esc(n.end?(n.historic?'KẾT LỊCH SỬ':'KẾT PHÓNG TÁC'):n.stage)+'</small><button type="button" data-hide aria-label="Đóng chi tiết">×</button></div><h2>'+esc(n.title)+'</h2>'+(inChoice?'<p class="h-via"><b>Từ:</b> '+esc(inChoice.action)+'</p>':'')+'<p>'+esc(text)+'</p><div class="h-actions"><a href="#den/'+(n.route||'goc')+'">'+(n.end?'Mở kết cục':'Chơi từ cảnh này')+' →</a>'+(inChoice?'<a href="#quyet/'+n.route+'">Xem hệ quả lựa chọn</a>':'')+'</div>';info.hidden=false
 }
 tree.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'&&!pinned)inspect(e.target.closest('[data-inspect]'))});
 tree.addEventListener('focusin',e=>{if(!pinned)inspect(e.target.closest('[data-inspect]'))});
 tree.addEventListener('click',e=>{if(e.target.closest('[data-hide]')){const a=active;clear();const b=buttons.find(b=>b.dataset.inspect===a);if(b){pinned=true;b.focus({preventScroll:true});pinned=false}return}const b=e.target.closest('[data-inspect]');if(b){inspect(b);pinned=true;if(matchMedia('(max-width:650px)').matches&&info.getBoundingClientRect().top>window.innerHeight-90)info.scrollIntoView({block:'nearest'})}});
 tree.addEventListener('keydown',e=>{if(e.key==='Escape'){clear();return}const b=e.target.closest('[data-inspect]');if(!b)return;const n=items.get(b.dataset.inspect);const next=e.key==='ArrowRight'?n.children[0]:e.key==='ArrowLeft'?n.parent:e.key==='ArrowDown'?n.parent?.children[1]:e.key==='ArrowUp'?n.parent?.children[0]:null;if(next){e.preventDefault();pinned=false;buttons.find(x=>x.dataset.inspect===next.route)?.focus()}})
}
