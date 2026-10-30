# Thiệp cưới online Hoàng & Trang

Website tĩnh (HTML/CSS/JS thuần), không cần build, mở `index.html` là chạy.

## Sửa nội dung

Toàn bộ thông tin nằm trong [js/config.js](js/config.js): tên, bố mẹ hai bên, ngày giờ, địa điểm, chương trình, tài khoản mừng cưới, nhạc nền. Những dòng có `TODO` là chỗ cần điền.

- **Ngày âm lịch** và **thứ trong tuần** được tính tự động từ `datetime`.
- **Mã QR mừng cưới** tạo tự động qua VietQR từ `bankId` + `accountNo`. Mã ngân hàng xem tại https://api.vietqr.io/v2/banks (cột `code`).
- **Nhạc nền**: chép file vào `assets/music.mp3` rồi đặt `music: "assets/music.mp3"`.
- **Ảnh**: nằm trong `assets/images/` (đã resize từ thư mục `Photo/`). Thay ảnh bằng cách ghi đè file cùng tên.

## Lưu RSVP vào Google Sheets

Mặc định lời chúc chỉ lưu trên trình duyệt của từng khách. Để gom về một chỗ:

1. Tạo một Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Dán nội dung [google-apps-script.gs](google-apps-script.gs), lưu lại.
3. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**: *Thực thi với tư cách*: Tôi; *Người có quyền truy cập*: Bất kỳ ai.
4. Copy URL `https://script.google.com/macros/s/.../exec` vào `rsvpEndpoint` trong `js/config.js`.

## Xem thử trên máy

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Đưa lên mạng bằng GitHub Pages

Push repo lên GitHub → **Settings → Pages** → Source: *Deploy from a branch*, chọn nhánh và thư mục `/ (root)`. Thư mục `Photo/` (ảnh gốc, ~27MB) đã được bỏ qua trong `.gitignore`.
