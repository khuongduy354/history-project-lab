# Chở gạo qua đèo · Godot
Mở project.godot bằng Godot 4.4.1, bấm F5. Đây là bản vận tải né đạn thay thế bản phi cơ ở cùng URL. Không có địch hoặc cơ chế bắn của người chơi. 4 chuyến đưa gạo 1954–1975, 12 sức bền, hồi tối đa 3 qua trạm. Nguồn ở art/convoy/sources.json và trang mở game. Địa danh / niên đại có nguồn; đạn, bao hàng, thời gian và điểm là thiết kế arcade.

VFX kế thừa từ khuongduy354/nmltspaceshooter (d8fcf7820271e5ce6c46329e758d45c93cf51520): vùng texture muzzle gốc dùng bởi vfx/Muzzle.tscn, trail, hit particles, shader lóe trắng, sprite nổ và ShakeCamera. Mỗi cụm hướng đạn được báo vị trí 0,28 giây rồi nhả đạn và chớp cùng một sự kiện. Không vẽ vật phát đạn. Hiệu ứng nổ Super Pixel Effects: Will Tice / unTied Games, license kèm assets/VFX/Explosions. Art xe thồ, người gùi, xe tải và mặt đường dùng chung với bản vận tải 2D.

Xuất web: cài Godot 4.4.1 và export templates, chạy:
```sh
godot --headless --editor --import
godot --headless --fixed-fps 60 --script res://tests/combat_smoke.gd
mkdir -p build
godot --headless --export-release Web build/index.html
python3 web/package.py build /absolute/path/to/site/dist
```
Cần Pillow khi đóng gói. Host dist qua HTTPS và mở ham-rong.html; đường dẫn cũ được giữ để các liên kết đã gửi vẫn hoạt động.
