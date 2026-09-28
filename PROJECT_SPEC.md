# PROJECT SPECIFICATION (PRD) — SFUMATO
> **Tài liệu Đặc tả Yêu cầu Sản phẩm (Product Requirements Document)**  
> *Phiên bản: 1.0.0 | Cập nhật lần cuối: 28/09/2026 | Trạng thái: Active MVP*

---

## 1. Bối Cảnh Ra Đời & Nỗi Đau Thị Trường (Problem & Pain Points)

### 1.1. Bối cảnh
Nhu cầu làm video lyrics ngắn (Short-form video lyrics) trên TikTok, Instagram Reels và YouTube Shorts đang bùng nổ mạnh mẽ trong cộng đồng nghệ sĩ indie, bedroom producers và content creators. Video lời bài hát trên nền đen đè lên video cảnh quay (bằng chế độ hòa trộn Screen/Làm sáng) là phong cách thẩm mỹ thống trị hiện nay vì vừa tôn vinh âm nhạc, vừa giữ được chất thơ điện ảnh.

### 1.2. Nỗi đau thị trường (The Pain Points)
1. **Lỗi chính tả và "vỡ font" tiếng Việt**:
   - Các công cụ AI auto-caption (như CapCut, AutoCap) thường xuyên nghe sai teencode, rap vần đôi, tiếng lóng, và đặc biệt là sai dấu thanh tiếng Việt.
   - Khi chọn các font nghệ thuật lạ, hầu hết ứng dụng bị lỗi thiếu ký tự tiếng Việt (`ă, â, ê, ô, ơ, ư, ừ, ự...`), khiến các chữ có dấu bị giật về font mặc định (Arial/Times New Roman), làm hỏng toàn bộ thẩm mỹ tác phẩm.
2. **Animation sáo mòn, đại trà, thiếu chất nghệ**:
   - Các template hiện có trên thị trường chỉ quanh quẩn vài hiệu ứng cơ bản: chữ trượt từ dưới lên, mờ dần, hoặc đổi màu karaoke kiểu truyền thống. Người xem lướt qua là nhận ra ngay template đại trà rẻ tiền.
   - Để có được kinetic typography đẳng cấp (như MV của A24, Billie Eilish, Travis Scott), nghệ sĩ phải mở After Effects với hàng chục layer keyframe phức tạp, tốn hàng giờ đồng hồ cho 30 giây video.
3. **Chữ bị che bởi giao diện TikTok/Reels**:
   - Rất nhiều video lyrics làm xong đăng lên bị nút Like, Comment, Avatar hoặc thanh tiến trình che mất chữ quan trọng do không canh trước Safe Zone.

---

## 2. Đối Tượng Người Dùng Mục Tiêu (User Personas)

| Persona | Đặc điểm | Nhu cầu chính |
| :--- | :--- | :--- |
| **Bedroom Artist / Rapper** | Tự thu âm tại nhà, ra bài thường xuyên, không có ngân sách thuê designer dựng lyric video. | Cần công cụ tạo video lyrics nền đen cực ngầu chỉ trong 3 phút để đăng TikTok teaser bài mới. |
| **Short-form Video Creator** | Thích làm video tâm trạng (mood/aesthetic), POV, daily vlog lồng nhạc Việt. | Cần font chữ độc lạ, không đại trà, xuất video nền đen để 1-click hòa trộn vào CapCut. |
| **Motion Designer / Editor** | Dựng MV cho nghệ sĩ, cần tiết kiệm thời gian gõ nhịp thủ công trong After Effects / Premiere. | Cần công cụ bắt nhịp nhanh (Tap-to-sync) với độ chính xác đến từng mili-giây, xuất file 60fps. |

---

## 3. Các Luồng Người Dùng Chính (User Flows)

### Flow 1: Khởi tạo và Bắt nhịp Lời bài hát (Create & Tap-to-Sync Flow)
```
[1. Tải file âm thanh (MP3/WAV)]
       │
       ▼
[2. Nhập văn bản lời bài hát chuẩn tiếng Việt (Dán hoặc gõ)]
       │
       ▼
[3. Bật chế độ "Tap-to-Sync" & Phát nhạc]
       │
       ▼
[4. Nhấn phím Space theo nhịp hát]
       ├──> Tự động tạo ô lyrics mới tại đúng thời điểm currentTime
       └──> Tự động kéo dài mốc kết thúc câu trước đó (Seamless Chain)
       │
       ▼
[5. Tinh chỉnh mili-giây hoặc click đúp sửa lời nếu cần]
```

### Flow 2: Định hình Thẩm mỹ Art Direction (Styling & Motion Flow)
```
[1. Chọn tỉ lệ khung hình (9:16 dọc / 1:1 vuông / 16:9 ngang)]
       │
       ▼
[2. Chọn Phong cách Kinetic (Shatter & Assemble, Cross-Drift, 3D Flip, Liquid Chrome...)]
       │
       ▼
[3. Chọn Phông chữ Display (Unbounded, Cinzel, Montserrat 900, Archivo, Prata...)]
       │
       ▼
[4. Tùy biến chất liệu (Vệt cháy phim Film Burn, Hạt phim 35mm, Tách quang sai RGB)]
       │
       ▼
[5. Bật Safe Zone để kiểm tra độ an toàn trước giao diện TikTok]
```

### Flow 3: Kết xuất Video & Đưa vào CapCut (Export & Integration Flow)
```
[1. Bấm "Xuất Video (CapCut Ready)"]
       │
       ▼
[2. Chọn Có âm thanh (đăng ngay) HOẶC Video câm (hòa trộn CapCut)]
       │
       ▼
[3. Bấm "Bắt Đầu Kết Xuất" -> Render Canvas 60fps -> Tải file .webm]
       │
       ▼
[4. Thả file vào CapCut -> Chọn hòa trộn: "Làm sáng" (Screen)]
       │
       ▼
[Nền đen #000000 biến mất 100%, chữ nghệ thuật nổi bật trên video!]
```

---

## 4. Triết Lý Thiết Kế UI/UX (Design Principles)

- **Màu sắc chủ đạo**: Nền đen tuyệt đối `#000000` (Pure Canvas Black), kết hợp với bảng xám than chì `#18181b`, điểm xuyết màu xanh ngọc lục bảo `#10b981` cho các tín hiệu thành công và cam hổ phách `#f59e0b` cho hiệu ứng cháy phim.
- **Tone giọng & Văn phong**: Tinh giản, hiện đại, đậm chất nghệ thuật studio, mang âm hưởng triết lý *Sfumato* (sự uyển chuyển không biên giới).
- **Trọng tâm giao diện**: Khung Canvas xem trước video luôn là **trung tâm số 1 (Hero Component)**, 2 bảng điều khiển bên cạnh có thể thu gọn linh hoạt để mở rộng không gian sáng tác.
- **Sạch sẽ tuyệt đối trên Canvas**: Loại bỏ mọi chữ rác, watermark, nhãn mác không liên quan đến lời bài hát trên màn hình video.

---

## 5. Ranh Giới Dự Án (Scope Boundaries)

### Trong phạm vi MVP (In-Scope - Hiện tại):
- [x] Canvas hiển thị thời gian thực nền đen `#000000` với 3 tỉ lệ chuẩn (9:16, 1:1, 16:9).
- [x] Động cơ Tap-to-Sync bằng phím `Space` tự động sinh ô lời và nối chuỗi liền mạch.
- [x] 10 phong cách kinetic chuyển động đột phá (Shatter & Assemble, Cross-Drift, 3D Card Flip, Liquid Chrome, Hyper-Velocity...).
- [x] 10 bộ font Display quốc tế hỗ trợ $100\%$ tiếng Việt không lỗi font.
- [x] Hiệu ứng điện ảnh: Vệt cháy phim (Film Burn), Hạt phim nhựa 35mm (Film Grain), Quét CRT Scanlines, Tách quang sai Chromatic Aberration.
- [x] Inline Edit (sửa trực tiếp), Xóa từng câu, Xóa tất cả, Nối liền các câu (Seamless).
- [x] Render xuất file WebM 60fps chất lượng cao (tùy chọn kèm nhạc hoặc video câm).

### Ngoài phạm vi MVP (Out-of-Scope - Dành cho các Phase tiếp theo):
- [ ] Tích hợp mô hình AI CTC Phoneme Forced Alignment (Tự động nhận diện âm vị bắt nhịp bằng AI không cần gõ Space).
- [ ] Đóng gói ứng dụng desktop đa nền tảng (.exe Windows, .dmg macOS) qua Tauri (Rust).
- [ ] Kho lưu trữ và chia sẻ preset cộng đồng qua Cloud.
- [ ] Trình chỉnh sửa keyframe đồ thị Bezier chuyên sâu cho từng ký tự.
