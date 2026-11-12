# Site experiment · bản đã xuất bản v12

[← Kho experiment](../../README.md) · [Hướng bullet hell mật mã hiện tại](../../../docs/bullet-hell/README.md)

Source được lấy từ đúng bản đã host, commit `37841e04616ef3c3d54776fbe75879d1b13ac8e8`. [Trang đang host](https://dien-bien-phu-khi-chua-biet-ket-qua.duy205365.chatgpt.site) giữ nguyên, không được triển khai lại trong lần đồng bộ này.

## Nội dung

- `dist/`: trang và asset đã xuất bản, giữ nguyên cấu trúc để link tương đối hoạt động; có prototype vận tải 2D/3D, Godot convoy/VFX và cây nhánh Điện Biên Phủ.
- `godot/ham-rong/`: 69 file source được giải nén nguyên vẹn từ [source.zip](dist/ham-rong/source.zip), bao gồm test, VFX, art/audio và giấy phép kèm theo.
- `art-notes/`: prompt/scene của experiment.
- [provenance.json](provenance.json): nguồn, SHA-256, kích thước từng file đã sao chép và phần metadata hosting không mang sang.

Đây là prototype vận tải/né đạn, **không có bằng chứng cơ chế nhặt nội dung mã hóa và decrypt đã triển khai**. Các bối cảnh, lựa chọn và số liệu của demo cũ không tự trở thành yêu cầu của game cuối. Source cũ trước ngày 08/11 vẫn không được khôi phục; đây là source prototype xuất bản ngày 09/11, không mở lại việc phục hồi đã hủy.

## Chạy lại

Từ thư mục này:

```sh
python3 -m http.server 8080 --directory dist
```

Mở `http://localhost:8080/`. Các trang liên quan: `van-tai.html`, `van-tai-3d.html`, `cho-gao.html` và `chien-dich.html`. `localhost` phục vụ kiểm tra; hosting công khai cần HTTPS để chạy bản Godot. Không có script deploy hoặc dịch vụ mới được tạo.

Để chỉnh bản Godot, xem [README của source](godot/ham-rong/README.md). Bản source khai báo Godot 4.4.1; giữ nguyên các thông tin credit/license khi dùng lại. Đọc [kết quả kiểm tra lần đồng bộ](VALIDATION.md) để phân biệt kiểm tra mới với báo cáo cũ.
