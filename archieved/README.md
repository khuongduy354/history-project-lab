# Ý tưởng và experiment cũ

[← Ý tưởng hiện tại: bullet hell mật mã](../README.md)

Thư mục được đặt đúng tên **`archieved`** theo yêu cầu của chủ dự án. Nội dung ở đây giữ lại quá trình thử nghiệm, **không phải hướng sản phẩm hiện tại** và không tự tạo việc cần tiếp tục.

## Hồ sơ cũ đã có trong repo

[Snapshot hồ sơ ngày 08/11/2026](2026-11-08-project-record/README.md), kèm đính chính về demo 3D ngày 12/11/2026. Tám file được chuyển nguyên nội dung; các link tương đối giữa chúng vẫn nằm cùng thư mục:

- [Concept FMV/map/QR/top-down cũ](2026-11-08-project-record/CONCEPT.md)
- [Các quyết định tại thời điểm cũ](2026-11-08-project-record/DECISIONS.md)
- [Nhật ký experiment](2026-11-08-project-record/EXPERIMENTS.md)
- [Kiểm kê asset/demo](2026-11-08-project-record/ASSETS.md)
- [Nguồn và giới hạn kiểm chứng](2026-11-08-project-record/SOURCES.md)
- [Danh sách bước tiếp theo cũ](2026-11-08-project-record/NEXT_STEPS.md), chỉ để lưu hồ sơ, không phải backlog hiện tại
- [Bản dữ liệu snapshot](2026-11-08-project-record/project-record.json)

Các câu như “chưa chốt hướng”, lựa chọn engine hoặc ngày snapshot trong các file trên chỉ mô tả thời điểm cũ. Quyết định mới ở [hồ sơ bullet hell](../docs/bullet-hell/README.md) thay thế chúng. Trạng thái riêng tư tại lúc tạo repo cũng không mô tả quyền truy cập hiện tại.

## Source và asset của experiment đã được đồng bộ

[Site v12 và source Godot/VFX](experiments/2026-11-09-site/README.md): giữ nguyên web đã host, art, export, ZIP/patch download và source Godot đã giải nén. Xem [kết quả kiểm tra mới](experiments/2026-11-09-site/VALIDATION.md) và [manifest SHA-256](experiments/2026-11-09-site/provenance.json).

## Experiment được ghi nhận sau snapshot

Các liên kết dưới đây được khôi phục từ hội thoại ngày 09/11/2026. Số liệu test trong các hội thoại cũ vẫn là báo cáo ở thời điểm đó; kết quả kiểm tra mới được ghi riêng ở VALIDATION.md, không suy rộng thành nghiệm thu toàn bộ game.

| Experiment cũ | Ghi nhận và giới hạn |
| --- | --- |
| [Chở gạo qua đèo](https://dien-bien-phu-khi-chua-biet-ket-qua.duy205365.chatgpt.site/cho-gao.html) | Experiment chở lương thực, né đạn và VFX khi đạn xuất hiện; không phải game crypto đã chốt. Godot source/VFX nay có trong `experiments/2026-11-09-site/godot/ham-rong/`. |
| [Cây nhánh Điện Biên Phủ](https://dien-bien-phu-khi-chua-biet-ket-qua.duy205365.chatgpt.site/chien-dich.html#cay-nhanh) | Experiment cây ngang, hover/chạm để xem thông tin và nhảy vào cảnh; không phải đặc tả của game bullet hell. |
| [Mockup Điện Biên Phủ trước đó](https://dien-bien-phu-ban-do-lich-su.duy205365.chatgpt.site) | Mockup HTML/CSS/SVG riêng; bản đồ minh họa, không phải bản đồ lịch sử chính xác. |

Nguồn: [báo cáo demo ngày 09/11](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=24724381-89ee-5a41-bc7e-442082381ee4), [báo cáo cây ngang](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=0cec12c6-bfa8-5b48-893c-50f61a17287b), [trạng thái chưa đồng bộ repo ngày 11/11](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=aadbddca-b238-5669-8222-d86a5e81ff57).

## Bảo toàn lịch sử và đường dẫn

- Nội dung snapshot được giữ nguyên, không xóa ý tưởng/feedback cũ.
- [Các đường dẫn gốc tại commit trước khi sắp xếp](https://github.com/khuongduy354/history-project-lab/tree/c583b969248ec3c060f6866a5b38fa2275daa743) vẫn xem được qua Git history. Các file được chuyển không còn ở đường dẫn gốc trên nhánh `main`; dùng mục lục archive ở trên cho đường dẫn mới.
- Việc tìm source 3D cũ và sao chép video inspiration từng bị hủy vẫn giữ trạng thái hủy. Không khởi động lại chỉ vì có tên trong archive.
- Không giả lập file source còn thiếu hoặc gọi các link demo là đã được sao lưu vào repo.
