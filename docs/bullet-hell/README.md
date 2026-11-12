# Bullet hell · Thu nội dung và giải mã

[← Trang chính](../../README.md) · [Ý tưởng và experiment cũ](../../archieved/README.md)

## Phần đã chốt

Chủ dự án mô tả:

> nó sẽ kiểu bullet hell né đạn để nhặt nội dung và cần decrypt nó

- **Thể loại:** bullet hell, người chơi né đạn.
- **Hoạt động gắn với việc né đạn:** nhặt nội dung.
- **Hoạt động tiếp theo:** giải mã (decrypt) nội dung đã nhặt.
- **Chủ đề:** mật mã thời chiến, theo lời làm rõ “crypto thời chiến”.

Đây là concept cuối, thay thế các hướng cũ trong `archieved/`. Việc chọn concept không có nghĩa game đã được viết hoặc đã có bản chạy trong repo.

## Prototype hiện có

[Trang prototype bullet hell vận tải](https://dien-bien-phu-khi-chua-biet-ket-qua.duy205365.chatgpt.site) đã được host; đây là cơ sở thử nghiệm né đạn/vận tải, không phải bằng chứng phần crypto/decrypt đã triển khai. [Source và asset của bản đã host](../../archieved/experiments/2026-11-09-site/README.md) đã đồng bộ vào archive, bao gồm web 2D/3D, Godot, VFX, test và cây nhánh. Có thể dùng lại phần phù hợp khi triển khai concept cuối; không coi mọi chi tiết của prototype cũ là yêu cầu đã chốt.

## Chưa tự chốt thay chủ dự án

Engine/nền tảng; góc nhìn và phong cách hình ảnh; thời kỳ, địa điểm và nhân vật cụ thể; loại mật mã; cách điều khiển; số màn; điều kiện thắng/thua; giao diện giải mã; có cần nhặt đủ nội dung hay không; cách kết quả giải mã tác động tới màn chơi; deadline và phạm vi bản nộp.

Không tự chuyển thành game phi cơ, game bắn địch, trắc nghiệm lịch sử hoặc cây lựa chọn FMV. Các demo chở lương thực/cây nhánh trước đây chỉ là experiment được lưu trữ, không áp đặt thiết kế lên concept này.

## Gợi ý cũ chưa phải yêu cầu đã duyệt

Trong lần brainstorm, trợ lý từng đề xuất nhặt các cụm ký tự, ghim mảnh đã nhặt lên màn hình, giải mã sau đợt đạn và dùng nội dung giải được để chọn điểm đến. Ví dụ “bến đò/nhà ga”, khóa dịch `+3`, chở gạo, không có nút giải tự động và không bắt buộc nhặt đủ mảnh đều là **ví dụ/gợi ý của trợ lý**, chưa được chủ dự án xác nhận là đặc tả.

Không đưa các ví dụ đó vào danh sách tính năng bắt buộc hoặc mô tả chúng như sự kiện lịch sử. Các chi tiết về thuật toán/mật mã lịch sử cần đọc và kiểm chứng nguồn gốc trước khi sử dụng.

## Nguồn quyết định

1. [09/11/2026: chủ dự án đưa tài liệu và chốt chủ đề để brainstorm sản phẩm](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=926696a9-7ecd-4f2a-83ff-c51b4304ed54).
2. [09/11/2026: làm rõ “crypto thời chiến”](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=80d49a38-b7ab-4517-9bbb-038bbb4efbb6).
3. [09/11/2026: mô tả trực tiếp bullet hell, nhặt nội dung và decrypt](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=f1b6bd99-7408-4c0e-adf5-048c8719302a).
4. [Phần minh họa của trợ lý, giữ riêng với quyết định của người dùng](https://chatgpt.com/c/6ad4910b-45e0-83ec-ae89-c05080f085e7?messageId=3b348c46-a644-5f66-b749-b1e4846cac5b).
5. Ngày 12/11/2026, chủ dự án xác nhận trong cuộc trao đổi cập nhật repo rằng ý tưởng cuối là bullet hell và yêu cầu chuyển ý tưởng/experiment cũ vào thư mục tên đúng là `archieved`.

[Tài liệu Google Docs chủ dự án đã cung cấp](https://docs.google.com/document/d/1F7wP0veP24-B8pHkzsXf-e1vFaXISziBDwwrEw2TluU/edit?tab=t.z36imvx75ewv#heading=h.6pt5t5c4x7gi). Nội dung tài liệu chưa được đọc lại trong lần sắp xếp này; liên kết không được dùng để khẳng định một sự kiện hay kỹ thuật lịch sử cụ thể. Liên kết hội thoại/tài liệu có thể yêu cầu quyền truy cập của chủ sở hữu; không thay đổi quyền chia sẻ.

## Bước tiếp theo của hồ sơ

- Đọc và đối chiếu nguồn sử học/mật mã trước khi viết nội dung màn chơi.
- Phân biệt rõ chi tiết lịch sử có nguồn với tình huống/cơ chế dựng để chơi.
- Chỉ ghi nhận một bản triển khai khi source/build thật đã có trong repo và được kiểm tra; không lấy trạng thái của demo cũ làm bằng chứng game mới đã hoàn thành.
