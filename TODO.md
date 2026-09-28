# 📋 TODO — Danh sách công việc dự án Sfumato

> File quản lý công việc và tiến độ vi mô của Sfumato (スラマート) — IDE & Terminal Lyric Video Studio.

---

## 🚦 Trạng thái hiện tại
- **Phiên bản hiện hành**: `v0.2.0 (IDE & Terminal Studio Release)`
- **Tình trạng Build**: `PASS` (`npm run build` không phát sinh lỗi TypeScript/Vite)
- **Tình trạng Server Dev**: Đang chạy tại `http://localhost:5173/`

---

## ✅ ĐÃ HOÀN THÀNH (Done - v0.2.0)

### 1. Kiến trúc & Nền tảng IDE/Terminal
- [x] Nâng cấp dự án sang React 19 + TypeScript + Vite + TailwindCSS v3.
- [x] Tái cấu trúc pipeline render: Chuyển toàn bộ sang Canvas 2D thuần (`src/utils/kineticRenderer.ts`), loại bỏ hoàn toàn lag giật của React DOM preview.
- [x] Bộ phân tích cú pháp mã nguồn (`src/utils/codeLayout.ts`) hỗ trợ 7 ngôn ngữ: TypeScript/JavaScript, Python, C/C++, Rust, HTML/CSS, Shell, Markdown.
- [x] Thiết lập 6 theme lập trình viên kinh điển (`src/utils/themePresets.ts`): Tokyo Night, VS Code Dark+, Dracula, Monokai, Cyberpunk Neon, Minimal Monochrome.
- [x] Hệ thống font Monospace tối ưu cho lập trình: *JetBrains Mono*, *Fira Code*, *Source Code Pro*.

### 2. Quản lý Dữ liệu & Lyrics Bền Vững
- [x] Data Schema cho `LyricLine` (id, text, startTime, endTime).
- [x] Tap-to-Sync: Gõ phím `Space` theo nhịp bài hát để đồng bộ thời gian thực.
- [x] Seamless Duration: Tự động kéo dài thời lượng câu hát cho đến câu kế tiếp.
- [x] **Auto-save LocalStorage**: Tự động lưu nội dung lyrics vào `localStorage` (`sfumato_lyrics_autosave`), khôi phục nguyên vẹn khi tải lại trang.
- [x] **Cảnh báo F5/Tắt trang**: Kích hoạt sự kiện `beforeunload` khi có dữ liệu lyrics nhằm chống mất bài.
- [x] **Quản lý Audio**: Bổ sung tính năng Đổi file nhạc hoặc Xóa file nhạc linh hoạt.

### 3. Canvas 2D & Hiệu ứng Chuyển động Code
- [x] Canvas chuẩn dọc 9:16 (Preview co giãn thông minh, Render 1080x1920 60fps).
- [x] Nền đen `#000000` tuyệt đối tối ưu 1-click Screen blend trên CapCut, Premiere, TikTok.
- [x] Thành phần IDE Editor hoàn chỉnh trên Canvas:
  - File Tab Bar với icon file và tên file (`lyrics.ts`, `song.py`...).
  - Line Numbers Gutter với số dòng căn chỉnh chuẩn xác.
  - Active Line Indicator & highlight nền dòng đang phát.
  - Hiệu ứng gõ máy chữ (Typewriter animation) tính toán theo tiến trình câu hát.
  - Con trỏ mã nguồn nhấp nháy (Blinking Caret Cursor).
  - Timestamps code comment (e.g. `// [00:15.200]`).
- [x] Bật/Tắt lưới TikTok Safe Zone để căn chỉnh bố cục an toàn.

### 4. Xuất Video (Video Export Engine)
- [x] Tự động phát hiện codec: Ưu tiên MP4 (`video/mp4;codecs=avc1`), fallback WebM (`video/webm;codecs=vp9,opus`).
- [x] Tích hợp Web Audio API muxing âm thanh bài hát gốc vào video xuất.
- [x] Tích hợp thư viện `fix-webm-duration` sửa triệt để lỗi video WebM chỉ phát được 3 giây.
- [x] Cảnh báo người dùng không ẩn tab/chuyển tab trong quá trình render video.
- [x] Bổ sung nút **"Làm lại (Re-render)"** và **"Tải lại video"** trong Export Modal.

---

## ⏳ CẦN LÀM TIẾP THEO (In Progress & Backlog)

### Ưu tiên cao (High Priority - v0.3.0 - v0.4.0)
- [ ] **Interactive Waveform Timeline (v0.3.0)**:
  - [ ] Tích hợp `wavesurfer.js` để hiển thị biểu đồ sóng âm thanh trực quan ở chân màn hình.
  - [ ] Cho phép kéo-thả mốc thời gian `startTime` và `endTime` trực tiếp trên sóng âm.
- [ ] **Terminal CLI Log Mode (v0.4.0)**:
  - [ ] Chế độ mô phỏng cửa sổ terminal console dòng lệnh Linux/macOS với tiền tố `$` hoặc `>`, log execution `[INFO]`, `[SUCCESS]`, progress bar ASCII `[=====>  ] 80%`.
- [ ] **Custom Theme Builder (v0.4.0)**:
  - [ ] Cho phép người dùng tự do cấu hình bảng màu syntax (keyword, string, comment, cursor, background).
  - [ ] Bật/tắt Font Ligatures (`=>`, `===`, `!=`).

### Ưu tiên trung bình (Medium Priority - v0.5.0 - v1.0.0)
- [ ] **Word-level Typewriter Sync (v0.5.0)**:
  - [ ] Gán timestamp chi tiết tới từng từ (word-level timestamps) để con trỏ code gõ theo từng âm tiết của ca khúc.
  - [ ] Thử nghiệm Whisper AI Speech-to-Text để tự động phân tách từ (Forced Alignment).
- [ ] **WebCodecs Native MP4 GPU Encoder (v1.0.0)**:
  - [ ] Sử dụng WebCodecs API (`VideoEncoder`, `AudioEncoder`) và `mp4-muxer` để xuất MP4 native tốc độ siêu nhanh (faster-than-realtime).

### Ưu tiên dài hạn (Long Term - v1.5.0+)
- [ ] **Tauri Desktop Standalone App**: Đóng gói ứng dụng desktop cho Windows/macOS.
- [ ] **Community Themes & Templates Cloud**: Thư viện chia sẻ theme và lyrics template.

---

## 🐞 Bọ cần theo dõi (Bug Tracker)
*Xem chi tiết lịch sử sửa lỗi và giải pháp tại `FIXBUG_TODO.md`.*

| ID | Vấn đề | Mức độ | Trạng thái |
| :--- | :--- | :--- | :--- |
| `BUG-001` | Mất Canvas Preview do Flexbox collapse | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-002` | Lyrics tự tắt sau 3 giây gây khoảng trống đen | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-003` | Lỗi vỡ font tiếng Việt có dấu | Trung bình | 🟢 Đã sửa |
| `BUG-004` | Xuất video không có âm thanh đi kèm | Cao | 🟢 Đã sửa |
| `BUG-005` | Xuất hiện các chữ phụ rác (metadata) trên video | Trung bình | 🟢 Đã sửa |
| `BUG-007` | Xuất video bị nhân đôi thời lượng & đơ hiệu ứng | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-008` | Canvas preview bị lag do requestAnimationFrame & state loop | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-009` | Video WebM xuất ra bị dừng sau 3 giây dù file 24 giây | Nghiêm trọng | 🟢 Đã sửa |
| `BUG-010` | Lỗi video khi người dùng ẩn tab trong lúc render | Cao | 🟢 Đã khắc phục (Banner cảnh báo) |
| `BUG-011` | Mất dữ liệu lyrics khi người dùng vô tình F5/tắt trang | Cao | 🟢 Đã khắc phục (LocalStorage + BeforeUnload) |
