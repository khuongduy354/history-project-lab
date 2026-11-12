# Ý tưởng và yêu cầu hiện có

## 1. Cấu trúc trải nghiệm

Người dùng mô tả trực tiếp:

> Ei t có idea này: ng chơi sẽ đưa ra lựa chọn combat. Rồi mình sẽ chỉ chiếu output, chọn sai = cook. Biết game fmv nghời đóng chọn hàng động ko, kiểu v, và chính tuyến sẽ là lịch sử thật. Ngoài ra còn nhánh secret sẽ mở ra vài thứ hay ho.

Diễn giải để làm việc:

- Vòng lặp là xem tình huống → chọn hành động → xem kết quả → tiếp tục hoặc kết thúc nhánh.
- FMV là tham chiếu cách chọn và xem kết quả; chưa đủ căn cứ để coi quay người thật là yêu cầu bắt buộc.
- Chính tuyến cần bám lịch sử thật.
- Có ý tưởng về nhánh secret, nhưng nội dung, điều kiện mở khóa và mức hư cấu chưa xác định.
- “Chọn sai = cook” thể hiện hậu quả/thất bại trong trải nghiệm. Chưa chốt cơ chế thử lại, checkpoint hay tiêu chí đúng/sai.

## 2. Nguồn là ưu tiên số một

> Quan trọng nhất là, hãy chọn nguồn data đủ chắc để mình có thể làm thành 1 chuỗi dài hành động

Yêu cầu này chưa được đáp ứng bằng một bộ tư liệu đã kiểm chứng trong lần lưu repo này. Cần nguồn đủ chi tiết để nối được bối cảnh, thời điểm, quyết định, hệ quả và thứ tự các sự kiện; không lấy tính hấp dẫn của một kịch bản làm bằng chứng lịch sử.

## 3. Hình ảnh và trình bày

| Phát biểu gốc | Ý nghĩa được giữ lại | Chưa được suy ra |
| --- | --- | --- |
| “Cũng đc, nhma mình expect top down view chuyển động ấy” | Muốn góc nhìn từ trên xuống có chuyển động | Chưa chốt góc camera hay công nghệ |
| “Có rheer 3d low poly” | 3D low-poly là hướng có thể thử | Chưa chốt engine hoặc chuyển toàn bộ sang 3D |
| “Mình thích cái demo 1 của bạn, về content okay r đấy” | Phản hồi tích cực về nội dung của demo 1 | Chưa đồng nghĩa duyệt toàn bộ thiết kế hoặc sử liệu |
| “Nhma về art thì ai quá,” | Không thích cảm giác art quá giống ảnh AI trong demo đó | Không suy ra cấm mọi công cụ AI cho mọi việc |
| “Nhma lâu lâu vẫn cần portrait ấy” | Vẫn muốn portrait xuất hiện khi cần | Chưa có tần suất hay danh sách nhân vật |
| “Bạn có thể craft/code ra portrait thay vì gen ảnh đc k” | Muốn thử tạo portrait bằng craft/code thay vì sinh ảnh | Chưa xác nhận đã có prototype portrait thành công |

## 4. Phạm vi chưa khóa

- Chủ đề/chiến dịch lịch sử cụ thể. “Chốt đbp r à” là câu hỏi, không phải quyết định chốt Điện Biên Phủ.
- Độ dài chuỗi hành động; số nhánh; số nhân vật; cách quay lại chính tuyến.
- Phân biệt nhánh sai, nhánh secret và nội dung phản thực tế.
- Định dạng bàn giao của đồ án, engine, nền tảng, thời gian và người xem mục tiêu.

## 5. Gợi ý tổ chức tiếp theo, chưa phải quyết định

Mỗi cảnh nên có ba lớp tách biệt: **sự kiện có nguồn**, **diễn giải để trình bày**, **tương tác/hư cấu của game**. Phần lịch sử mô tả bối cảnh và hệ quả ở mức giáo dục; không cần biến thiết kế game thành hướng dẫn chiến thuật áp dụng ngoài đời.

Nguồn: các phát biểu trực tiếp được lưu trong phiên trao đổi về đồ án; xem [SOURCES.md](SOURCES.md).
