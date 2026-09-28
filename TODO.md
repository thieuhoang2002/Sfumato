# 📋 TODO — Danh sách công việc dự án Sfumato

> File quản lý công việc và tiến độ vi mô của Sfumato. Các task được phân loại chi tiết theo trạng thái, độ ưu tiên và module.

---

## 🚦 Trạng thái hiện tại
- **Phiên bản hiện hành**: `v1.0.0 (MVP Release)`
- **Tình trạng Build**: `PASS` (`npm run build` không phát sinh lỗi TypeScript/Vite)
- **Tình trạng Server Dev**: Đang chạy tại `http://localhost:5173/`

---

## ✅ ĐÃ HOÀN THÀNH (Done - Phase 1 MVP)

### 1. Kiến trúc & Nền tảng (Infrastructure)
- [x] Khởi tạo dự án Vite 6 + React 19 + TypeScript + TailwindCSS v3.
- [x] Thiết lập cấu trúc thư mục chuẩn: `components/`, `types/`, `styles/`, `assets/`.
- [x] Cài đặt `lucide-react` làm thư viện icon vector giao diện.
- [x] Tích hợp `framer-motion` (v12) làm engine tính toán chuyển động chữ.

### 2. Quản lý Dữ liệu & Lyrics (Lyrics & Data Management)
- [x] Tạo Data Schema cho `LyricLine` (id, text, startTime, endTime).
- [x] Xây dựng cơ chế Import lời bài hát từ văn bản thô (Auto split theo dòng).
- [x] Xây dựng cơ chế gõ phím `Space` để đồng bộ thời gian thực (Tap-to-Sync).
- [x] Thêm/Sửa/Xóa từng dòng lyrics trực tiếp trên danh sách.
- [x] Tính năng "Kéo dài liên tục" (Seamless duration): Câu trước hiển thị liên tục cho tới khi câu sau xuất hiện (`effectiveEnd = nextLine ? nextLine.startTime : endTime`).
- [x] Nút "Nối liền các câu (Seamless)" để tự động dọn dẹp các khoảng hở thời gian.

### 3. Canvas & Motion Presets Phá cách (Animation Engine)
- [x] Xây dựng Canvas Preview tỷ lệ chuẩn dọc 9:16 (540x960 trên màn hình, render 1080x1920).
- [x] Nền đen tuyệt đối `#000000` chuyên dụng cho hòa trộn CapCut Screen Blend Mode.
- [x] Xây dựng bộ 10 Motion Presets phá cách:
  - [x] `shatter-assemble`: Chữ tách rời từ 4 góc và bay tụ lại giữa tâm.
  - [x] `cross-drift`: Các chữ xen kẽ trượt nghịch hướng và va chạm trung tâm.
  - [x] `spatial-flip`: Lật 3D chiều không gian trục X/Y với chiều sâu phối cảnh `perspective(1000px)`.
  - [x] `liquid-chrome`: Gradient bạc ánh kim lượn sóng động.
  - [x] `editorial-spread`: Phong cách tạp chí thời trang, letter-spacing giãn nở rộng.
  - [x] `glitch-cyber`: Hiệu ứng RGB split, rung giật gián đoạn kiểu Cyberpunk.
  - [x] `brutalist-block`: Khối nền vàng chữ đen tương phản cao phong cách Brutalism.
  - [x] `elastic-bounce`: Nảy đàn hồi vật lý sống động.
  - [x] `neon-flicker`: Đèn Neon chớp nháy màu Cyan rực sáng.
  - [x] `smoke-dissolve`: Hòa tan vào làn khói mờ ảo.

### 4. Typography & Safe Zone (Design Polish)
- [x] Tuyển chọn và tích hợp 10 Google Fonts hỗ trợ 100% tiếng Việt có dấu (`&subset=vietnamese`).
- [x] Kiểm tra hiển thị dấu thanh tiếng Việt (ắ, ặ, ề, ỗ, ỹ...) trên toàn bộ 10 font: không bị lỗi fallback sang Arial.
- [x] Bật/Tắt hiển thị lưới TikTok Safe Zone (Header, Right Actions, Bottom Metadata) để đảm bảo chữ không bị che.
- [x] Loại bỏ hoàn toàn các watermark, chữ kỹ thuật nhỏ rác (`ROLL 16MM`, `EDITORIAL KINETIC`...) theo yêu cầu người dùng để khung hình sạch 100%.

### 5. Xuất Video (Video Export Engine)
- [x] Tích hợp `canvas.captureStream(60)` và `MediaRecorder` cho video 60fps mượt mà.
- [x] Tích hợp Web Audio API (`AudioContext`, `MediaStreamAudioDestinationNode`) để muxing trực tiếp nhạc gốc vào video khi xuất.
- [x] Toggle bật/tắt xuất kèm âm thanh trong Export Modal.
- [x] Progress bar hiển thị tiến độ render theo % thời gian thực và tự động tải file `.webm`.

---

## ⏳ CẦN LÀM TIẾP THEO (In Progress & Backlog)

### Ưu tiên cao (High Priority - Dự kiến v1.1.0 - v1.2.0)
- [ ] **Interactive Waveform Timeline**:
  - [ ] Tích hợp `wavesurfer.js` để hiển thị biểu đồ sóng âm thanh trực quan.
  - [ ] Hiển thị các khối lyric bar trên timeline và cho phép kéo-thả để chỉnh `startTime`/`endTime`.
- [ ] **Bổ sung định dạng xuất MP4 (H.264)**:
  - [ ] Tích hợp WebCodecs API hoặc `@ffmpeg/ffmpeg` (Wasm) để chuyển đổi từ WebM sang MP4 trực tiếp trên client.
  - [ ] Thêm tùy chọn chọn bitrate video (10Mbps, 20Mbps, 50Mbps).
- [ ] **Lưu & Tải Dự án (Project Serialization)**:
  - [ ] Export file cấu hình dự án `.sfumato` (dạng JSON chứa lyrics, timestamps, audio file dạng Base64 hoặc ObjectURL).
  - [ ] Import lại file `.sfumato` để tiếp tục chỉnh sửa bất kỳ lúc nào.

### Ưu tiên trung bình (Medium Priority - v1.3.0 - v1.5.0)
- [ ] **Word-level Karaoke Animation**:
  - [ ] Hỗ trợ tách timestamp theo từng từ để tạo hiệu ứng chữ nhảy từng chữ một theo giọng ca sĩ (Word-by-word reveal).
- [ ] **Custom Motion Editor**:
  - [ ] Bổ sung thanh trượt điều chỉnh: Cường độ rung lắc, Thời gian delay giữa các ký tự, Bán kính phân rã.
- [ ] **Multi-color Lyrics Support**:
  - [ ] Cho phép tô màu riêng cho từ khóa nổi bật trong câu hát (Highlight keyword).

### Ưu tiên thấp (Nice to have - v2.0.0+)
- [ ] **Tauri Desktop Build**:
  - [ ] Thiết lập cấu hình Tauri v2 cho Windows (.exe / .msi) và macOS (.dmg).
- [ ] **Hiệu ứng Hạt & Nền (Particles & Dust)**:
  - [ ] Bổ sung hiệu ứng bụi phim cổ điển (Dust & Scratches) nhẹ trên nền đen.
  - [ ] Hiệu ứng lóa sáng (Anamorphic Lens Flare).

---

## 🐞 Bọ cần theo dõi (Bug Tracker)
*Xem chi tiết lịch sử sửa lỗi và các ca khó tại `FIXBUG_TODO.md`.*

| ID | Vấn đề | Mức độ | Trạng thái |
| :--- | :--- | :--- | :--- |
| `BUG-001` | Mất Canvas Preview do Panel Phải bung 100% | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-002` | Câu lyrics biến mất sau 3 giây, màn hình đen ngòm | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-003` | Lỗi vỡ font tiếng Việt có dấu do thiếu subset | Trung bình | 🟢 Đã sửa |
| `BUG-004` | Xuất video không có âm thanh đi kèm | Cao | 🟢 Đã sửa |
| `BUG-005` | Xuất hiện các chữ phụ rác (metadata) trên video | Trung bình | 🟢 Đã sửa |
| `BUG-006` | Trình duyệt Safari iOS chưa hỗ trợ ghi `video/webm` | Đang theo dõi | 🟡 Chờ giải pháp MP4 |
