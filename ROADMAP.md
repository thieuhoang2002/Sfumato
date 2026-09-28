# 🗺️ ROADMAP — Lộ trình phát triển Sfumato (スラマート)

> **Tầm nhìn sản phẩm**: Sfumato hướng tới trở thành công cụ tạo video lyrics phong cách **IDE Code Editor & Terminal Developer-Aesthetic** số 1 dành cho Content Creator, Coder & Bedroom Artists trên TikTok, Reels và Shorts — Đơn giản hóa chuyển động code After Effects thành trải nghiệm Web 1-click, nền đen `#000000` hòa trộn Screen blend mượt mà.

---

## 🧭 Tổng quan Lộ trình (Milestones Overview)

```
[Phase 1: IDE & Terminal Core Studio (v0.2.0)] (Đã hoàn thành)
       │
       ▼
[Phase 2: Visual Audio Waveform & Custom Syntax Themes (v0.3.0 - v0.4.0)] (Quý 4/2024 - Quý 1/2025)
       │
       ▼
[Phase 3: Word-by-Word Typewriter & WebCodecs MP4 Engine (v0.5.0 - v1.0.0)] (Quý 2/2025)
       │
       ▼
[Phase 4: Desktop App (Tauri v2) & Community Theme Hub (v1.5.0+)] (Quý 3/2025+)
```

---

## 🟢 Phase 1: IDE & Terminal Core Studio (ĐÃ HOÀN THÀNH - v0.2.0)

Mục tiêu: Chuyển dịch toàn diện sang kiến trúc IDE Code Editor & Terminal lyrics, tối ưu hiệu năng Canvas 2D không giật lag, độ bền bỉ dữ liệu cao.

- [x] **IDE Code Editor Layout Engine (`codeLayout.ts`)**:
  - Giả lập cấu trúc trình biên tập mã nguồn chuyên nghiệp: Top File Tab Bar (`lyrics.ts`, `song.py`...), Line Numbers Gutter, Active Line Indicator, Cursor Blinking.
  - Hỗ trợ đa cú pháp ngôn ngữ lập trình (TypeScript/JavaScript, Python, C/C++, Rust, HTML/CSS, Shell Bash, Markdown/Plain Text).
  - 6 Bộ theme lập trình viên kinh điển: Tokyo Night, VS Code Dark+, Dracula, Monokai, Cyberpunk Neon, Minimal Monochrome.
- [x] **Canvas 2D Typewriter Engine (`kineticRenderer.ts`)**:
  - Render trực tiếp trên HTML5 Canvas 2D ở 60fps không phụ thuộc DOM nặng nề, loại bỏ hoàn toàn hiện tượng drop frame / lag giật.
  - Hiệu ứng gõ máy chữ (Typewriter animation) tính toán mượt mà theo tiến trình thời gian thực của từng câu hát.
  - Tích hợp font Monospace chuẩn quốc tế: *JetBrains Mono*, *Fira Code*, *Source Code Pro*.
- [x] **Smart Sync & Audio Workflow**:
  - Gõ phím `Space` bắt nhịp thời gian thực (Tap-to-Sync).
  - Tự động kéo dài thời lượng câu hát (Seamless continuity) cho đến khi câu tiếp theo cất lên.
  - Quản lý file nhạc linh hoạt: Tải lên, Đổi bài hát, hoặc Xóa file nhạc tiện lợi.
- [x] **Data Safety & Persistence**:
  - Tự động lưu nội dung lyrics vào `localStorage` (`sfumato_lyrics_autosave`), phòng chống mất dữ liệu khi vô tình F5 hoặc tắt trình duyệt.
  - Kích hoạt cảnh báo trình duyệt `beforeunload` khi có dữ liệu lyrics chưa xuất.
- [x] **Video Export Engine (MP4 / WebM 1080x1920 60fps)**:
  - Nền đen tuyệt đối `#000000` chuyên dụng cho 1-click Screen blend trên CapCut, Premiere, DaVinci Resolve.
  - Tự động phát hiện codec trình duyệt ưu tiên MP4 (`video/mp4;codecs=avc1`), fallback WebM (`video/webm;codecs=vp9,opus`).
  - Tích hợp `fix-webm-duration` vá triệt để lỗi metadata WebM chỉ phát được 3 giây.
  - Banner cảnh báo trực quan: Nhắc nhở người dùng không ẩn tab / chuyển cửa sổ khi đang render video để tránh throttling background.
  - Nút **"Làm lại (Re-render)"** và **"Tải lại video"** cho phép xuất lại không cần tải lại trang.

---

## 🟡 Phase 2: Visual Audio Waveform & Custom Syntax (v0.3.0 - v0.4.0)

Mục tiêu: Nâng cấp trải nghiệm căn chỉnh nhịp điệu trực quan với biểu đồ sóng âm và mở rộng khả năng cá nhân hóa code.

### 1. Interactive Audio Waveform Editor (v0.3.0)
- [ ] Tích hợp `wavesurfer.js` hiển thị sóng âm trực quan ở chân màn hình thay cho thanh trượt thời gian cơ bản.
- [ ] Cho phép kéo-thả (drag-and-drop) mốc thời gian `startTime` và `endTime` của từng câu lyrics trực tiếp trên biểu đồ sóng âm.
- [ ] Tính năng Zoom-in/Zoom-out timeline để tinh chỉnh chính xác từng mili-giây (ms).

### 2. Custom Syntax Highlighting & CLI Terminal Mode (v0.4.0)
- [ ] Chế độ **Terminal Command Line Mode**: Giả lập cửa sổ dòng lệnh Linux/macOS với tiền tố `$` hoặc `>`, hiển thị dạng log execution (`[INFO]`, `[SUCCESS]`, progress bar ASCII `[=====>  ] 80%`).
- [ ] Bộ công cụ tạo theme tùy biến (Custom Theme Builder): Tự do phối màu keyword, string, comment, background theo sở thích cá nhân.
- [ ] Hỗ trợ Font Ligatures lập trình viên (`=>`, `===`, `!=`).

---

## 🔵 Phase 3: Word-by-Word Typewriter & WebCodecs Acceleration (v0.5.0 - v1.0.0)

Mục tiêu: Đạt độ chính xác gõ chữ từng từ theo giọng hát và mã hóa video tốc độ cao bằng phần cứng.

### 1. Word-level Typewriter Sync & AI Alignment (v0.5.0)
- [ ] Khả năng gán timestamp cho từng từ trong câu (Word-by-word timestamps).
- [ ] Con trỏ phím (caret cursor) nhảy chính xác theo từng âm tiết bài hát, mang lại trải nghiệm như đang xem một lập trình viên live-coding ca khúc.
- [ ] Thử nghiệm tích hợp Whisper WebAssembly để tự động phân rã âm vị (Forced Alignment).

### 2. WebCodecs API Native MP4 Encoding (v1.0.0)
- [ ] Tích hợp WebCodecs API (`VideoEncoder`, `AudioEncoder`) và `mp4-muxer` để kết xuất file `.mp4` chuẩn H.264/AAC với tốc độ render nhanh hơn thời gian thực (faster-than-realtime).
- [ ] Tùy chọn xuất ảnh động Transparent WebP/GIF và chuỗi ảnh PNG Sequence.

---

## 🟣 Phase 4: Desktop Standalone App & Community Theme Hub (v1.5.0+)

Mục tiêu: Trở thành phần mềm độc lập đa nền tảng và không gian chia sẻ sáng tạo mở.

### 1. Desktop Standalone App (Tauri v2)
- [ ] Đóng gói Sfumato bằng **Tauri 2.0** (Rust + WebView) cho Windows (.exe, .msi) và macOS (.dmg, Apple Silicon native).
- [ ] Truy cập font chữ cài sẵn trên hệ điều hành (`Local Font Access API`).
- [ ] Không giới hạn RAM trình duyệt khi xuất video trường ca (> 10 phút).

### 2. Community Theme & Preset Marketplace
- [ ] Chia sẻ và tải về các theme IDE do cộng đồng thiết kế.
- [ ] 1-Click Import lời và nhịp các ca khúc thịnh hành từ cộng đồng Sfumato Cloud.

---

## 📈 Lịch trình triển khai tóm tắt

| Phiên bản | Mục tiêu chính | Trạng thái |
| :--- | :--- | :--- |
| **v0.2.0** | IDE & Terminal Core Studio, Canvas 2D Typewriter, 6 Themes, MP4/WebM 60fps, Duration Fix, LocalStorage Persistence | 🟢 Hoàn thành |
| **v0.3.0** | Interactive Waveform Editor (Wavesurfer), timeline kéo thả trực quan | 🟡 Kế hoạch Q4/2024 - Q1/2025 |
| **v0.4.0** | Terminal CLI Log Mode, Custom Syntax Theme Builder, Font Ligatures | 🟡 Dự kiến Q1/2025 |
| **v0.5.0** | Word-by-word Typewriter Sync, Whisper forced alignment | 🔵 Dự kiến Q2/2025 |
| **v1.0.0** | WebCodecs GPU Native MP4 encoding, faster-than-realtime export | 🔵 Dự kiến Q2/2025 |
| **v1.5.0** | Desktop App (Tauri v2), Community Preset Hub | 🟣 Ý tưởng tương lai |
