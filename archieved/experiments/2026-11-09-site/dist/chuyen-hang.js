export const stages=[
 {date:'1954',title:'Xe thồ lên Điện Biên',vehicle:'Xe đạp thồ',intro:'Ở Tây Bắc, dân công gia cố xe đạp để đẩy hàng tới mặt trận. Chặng đường của bạn bắt đầu bên đoàn xe thồ.',after:'Chiếc xe đạp thồ gắn với việc huy động dân công cho chiến dịch Điện Biên Phủ. Đây là chặng thời chống Pháp ở Tây Bắc; chưa phải đường Trường Sơn của Đoàn 559.',src:['BIKE']},
 {date:'1959',title:'Những gánh đầu tiên',vehicle:'Người gùi hàng',intro:'Năm năm sau, một tuyến chi viện khác được mở. Những chuyến đầu băng Trường Sơn bằng sức người.',after:'Đoàn 559 ra đời tháng 5/1959. Bảo tàng Lịch sử quốc gia ghi chuyến hàng đầu vượt Trường Sơn ngày 13/8 và được bàn giao trong tháng 8. Tư liệu giai đoạn đầu nói tới gùi thồ; không coi mọi chuyến đều là xe đạp.',src:['559','ROAD']},
 {date:'1961–1964',title:'Khi đường có tiếng động cơ',vehicle:'Xe tải',intro:'Mạng vận tải phát triển về phía Tây Trường Sơn. Chuyến này đổi gánh trên vai lấy một thùng xe.',after:'Trong giai đoạn 1961–1964, tuyến mở rộng và bắt đầu tổ chức vận chuyển cơ giới. Đó là quá trình phát triển nhiều phương thức vận tải, không phải một ngày mọi người đồng loạt đổi xe.',src:['ROAD','559']},
 {date:'Xuân 1975',title:'Chuyến hàng cuối mùa',vehicle:'Đoàn xe tải',intro:'Đợt vận chuyển cuối trong lượt chơi diễn ra khi tuyến chi viện đã phục vụ nhiều chiến dịch. Giữ xe qua những loạt dày nhất để về bến.',after:'Bộ đội Trường Sơn tham gia bảo đảm vận chuyển cho các chiến dịch giai đoạn 1971–1975, trong đó có mùa xuân 1975. Kết quả chạy xe chỉ là kết quả lượt chơi; lịch sử không phụ thuộc số lượt va chạm.',src:['SPR']}
];

import {runRoad} from './road.js';
const sources=await fetch('archive.json').then(r=>{if(!r.ok)throw Error('Tư liệu');return r.json()}).catch(()=>null);
const root=document.querySelector('#play');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cites(ids){return '<details class="evidence"><summary>Sử liệu · '+ids.length+' nguồn</summary><ul>'+ids.map(k=>{const v=sources[k];return '<li><a href="'+escape(v.url)+'" target="_blank" rel="noopener">'+escape(v.publisher)+' ↗</a><br>'+escape(v.title)+'<div class="smalltxt">'+escape(v.locator)+'</div></li>'}).join('')+'</ul></details>'}
if(sources)runRoad(root,stages,cites);else root.textContent='Không tải được tư liệu. Vui lòng tải lại trang.';
