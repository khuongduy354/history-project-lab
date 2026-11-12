# Kiểm tra đồng bộ · 12/11/2026

## Đã kiểm tra mới

- File trong `dist/` và `art-notes/` khớp byte với source bản Sites v12, commit `37841e04616ef3c3d54776fbe75879d1b13ac8e8`.
- Cả 69 file trong `godot/ham-rong/` khớp nội dung ZIP gốc; ZIP không có path traversal/symlink.
- JSON parse thành công; 48 tham chiếu file trong HTML có đích tồn tại; 11 file JavaScript qua kiểm tra cú pháp Node.
- Source Godot import sạch và smoke test có sẵn qua trên **Godot 4.6.3**: 4 chuyến giao hàng, thua khi hết 12 sức bền, sự kiện spawn, tối đa 92 projectile; assert pause/resume và restart qua. Test trên bản sao riêng, không chép ngược import metadata sinh ra vào source lưu trữ.
- Trên bản web đang host: mở prototype 2D, bắt đầu, kéo nhân vật (thấy vị trí thay đổi), thấy đạn xuất hiện, pause/resume, về trạm và bắt đầu lại; mở cây nhánh, xem và đóng chi tiết một nút.
- Tám tài liệu snapshot trước khi sắp xếp được bảo toàn nguyên byte; đường dẫn nội bộ của hồ sơ và cấu trúc thư mục được kiểm tra.

## Giới hạn

- `git diff --check` toàn bộ archive báo trailing whitespace trong patch/GDScript kế thừa. Giữ nguyên byte source thay vì tự sửa bản lưu; kiểm tra whitespace cho tài liệu/JSON mới đạt.

- README source yêu cầu Godot **4.4.1**; máy kiểm tra có 4.6.3. Chưa chạy lại bằng chính xác 4.4.1 hoặc export web mới.
- Cloud Browser không truy cập được server localhost của executor (`ERR_CONNECTION_REFUSED`). Kiểm tra UI dùng bản đã host; source được sao chép nguyên byte, không sửa game.
- Trang Godot tải được nhưng báo thiếu **WebGL2 trong browser kiểm tra**. Đây là giới hạn môi trường, không phải kết luận game hỏng. Chưa xác nhận chạy Godot web hoặc 3D bằng browser này.
- Chưa chơi lại toàn bộ bốn chặng 2D bằng tay, chưa chạy toàn bộ nhánh truyện, chưa xác nhận điện thoại thật hoặc âm thanh. Native smoke không thay thế các kiểm tra này.
- Không coi các nguồn lịch sử kế thừa là đã được thẩm định lại trong lần đồng bộ.
- Không triển khai lại Sites, không tạo game crypto/decrypt mới, không cập nhật gameplay hay tích hợp thêm cơ chế.
