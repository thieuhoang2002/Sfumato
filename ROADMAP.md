# 🗺️ ROADMAP — Lộ trình phát triển Sfumato (スラマート)

> **Tầm nhìn sản phẩm**: Sfumato hướng tới trở thành công cụ tạo Kinetic Typography & Motion Lyric Video số 1 dành cho Content Creator trên TikTok, Reels và Shorts — Đơn giản hóa chuyển động phức tạp của After Effects thành trải nghiệm Web 1-click.

---

## 🧭 Tổng quan Lộ trình (Milestones Overview)

```
[Phase 1: MVP Core Engine] (Hoàn thành)
       │
       ▼
[Phase 2: Studio Audio & AI Enhancements] (Quý 4/2024 - Quý 1/2025)
       │
       ▼
[Phase 3: Video Export Engine & WebGL GPU] (Quý 2/2025)
       │
       ▼
[Phase 4: Desktop App (Tauri) & Community Marketplace] (Quý 3/2025+)
```

---

## 🟢 Phase 1: MVP Core Engine & Design Breakout (ĐÃ HOÀN THÀNH - v1.0.0)

Mục tiêu: Xây dựng nền tảng vững chắc, chạy mượt mà trên trình duyệt, phá bỏ rào cản lyrics thông thường.

- [x] **Core Architecture**:
  - Khởi tạo dự án React 19 + TypeScript + Vite + TailwindCSS.
  - State management phân chia rõ ràng giữa Session State và Canvas Render Tree.
- [x] **Tap-to-Sync Engine**:
  - Gõ phím `Space` để đồng bộ thời gian thực theo nhịp bài hát.
  - Tự động kéo dài thời lượng câu trước đến khi câu tiếp theo xuất hiện (`effectiveEnd = nextLine.startTime`).
  - Hỗ trợ thêm/xóa/sửa từng dòng lyrics trực tiếp trong danh sách timeline.
- [x] **10 Motion Presets Phá Cách (High Fashion / Brutalism)**:
  - `shatter-assemble` (Vỡ vụn từ 4 góc $\rightarrow$ Hút tâm).
  - `cross-drift` (Chữ xen kẽ trượt nghịch hướng $\rightarrow$ Va chạm trung tâm).
  - `spatial-flip` (Lật 3D chiều không gian trục X/Y).
  - `liquid-chrome` (Gradient ánh kim lượn sóng).
  - `editorial-spread` (Tạp chí thời trang, letter-spacing giãn nở).
  - `glitch-cyber` (Phân tách RGB, giật frame cyberpunk).
  - `brutalist-block` (Khối chữ tương phản đen vàng công nghiệp).
  - `elastic-bounce` (Đàn hồi nảy động lực học).
  - `neon-flicker` (Hiệu ứng ống đèn Neon chập chờn).
  - `smoke-dissolve` (Hòa tan vào khói sương mờ mờ).
- [x] **Typography & Safe Zone**:
  - Bộ 10 font Google Fonts hỗ trợ 100% tiếng Việt có dấu.
  - Lưới Safe Zone TikTok/Reels/Shorts bảo vệ vùng hiển thị UI.
- [x] **Canvas Export Engine**:
  - Kết xuất WebM 1080x1920 (9:16) 60fps chuẩn đen `#000000`.
  - Muxing âm thanh gốc vào video bằng Web Audio API (`MediaStreamDestination`).

---

## 🟡 Phase 2: Studio Audio & AI Sync Enhancements (v1.2.0 - v1.5.0)

Mục tiêu: Giảm 90% công sức căn chỉnh thủ công của người dùng bằng AI và hiển thị trực quan dạng sóng âm.

### 1. Audio Waveform & Visual Timeline Editor (v1.2.0)
- [ ] Tích hợp `wavesurfer.js` hiển thị sóng âm (Audio Waveform) trực quan ở chân màn hình.
- [ ] Cho phép kéo-thả (drag-and-drop) mốc thời gian `startTime` và `endTime` của từng câu lyrics trực tiếp trên sóng âm.
- [ ] Tính năng Zoom-in/Zoom-out timeline để căn chỉnh chính xác đến từng mili-giây (ms).

### 2. Auto AI Speech-to-Text & Karaoke Sync (v1.3.0)
- [ ] Tích hợp OpenAI Whisper (WebAssembly chạy local hoặc API backend) để tự động nghe file nhạc và transcribe lời bài hát.
- [ ] Tự động gán timestamp cho từng từ (Word-by-word timestamps / Forced Alignment).
- [ ] Chế độ hiệu ứng **Word-level Kinetic**: Từng từ xuất hiện theo nhịp thay vì chỉ cả câu.

### 3. Motion Customizer Panel (v1.5.0)
- [ ] Cho phép chỉnh tham số chuyển động nâng cao:
  - Thời gian gia tốc (`easeIn`, `easeOut`, `spring stiffness`, `damping`).
  - Biên độ vỡ vụn (`explosion radius`).
  - Hướng bay của chữ (Trái qua, Phải qua, Dưới lên, Trên xuống).
- [ ] Lưu tổ hợp tùy biến thành **Custom Preset** cá nhân trong `localStorage`.

---

## 🔵 Phase 3: Hardware Acceleration & MP4 Native Export (v2.0.0)

Mục tiêu: Đạt chuẩn xuất video chuyên nghiệp, tương thích tối đa với mọi thiết bị di động.

### 1. MP4 / H.264 Client-side Encoding
- [ ] Tích hợp WebAssembly FFmpeg (`@ffmpeg/ffmpeg`) hoặc WebCodecs API.
- [ ] Cho phép xuất trực tiếp định dạng `.mp4` (H.264/AAC) thay vì WebM, giúp import thẳng vào Camera Roll trên iPhone mà không cần qua ứng dụng chuyển đổi.
- [ ] Tùy chọn xuất ảnh động Transparent GIF / WebP động hoặc chuỗi ảnh PNG Sequence.

### 2. WebGL / Shader Backgrounds
- [ ] Thêm hiệu ứng hạt bụi phim cổ điển (Film Grain / Dust particles).
- [ ] Hiệu ứng ánh sáng rò rỉ (Light Leaks) và biến dạng thấu kính (Lens Distortion) bằng GLSL Shaders.
- [ ] Chế độ nền Transparent Alpha (video có kênh trong suốt WebM với codec VP9).

---

## 🟣 Phase 4: Desktop App (Tauri) & Community Marketplace (v2.5.0+)

Mục tiêu: Mở rộng hệ sinh thái ra ngoài trình duyệt web và xây dựng cộng đồng sáng tạo.

### 1. Desktop Standalone App (Windows / macOS)
- [ ] Đóng gói Sfumato bằng **Tauri 2.0** (Rust + Webview) cho dung lượng siêu nhẹ (< 15MB) và tốc độ render GPU native.
- [ ] Truy cập trực tiếp hệ thống font chữ có sẵn trên máy tính người dùng (`Local Font Access API`).
- [ ] Không bị giới hạn dung lượng RAM của trình duyệt khi render video thời lượng dài (> 5 phút).

### 2. Community Preset Sharing & Templates
- [ ] Thư viện Template trực tuyến: Người dùng có thể chia sẻ preset motion và typography đẹp mắt lên Sfumato Cloud.
- [ ] 1-Click Import bài hát trending từ TikTok / Spotify metadata.
- [ ] Hệ thống đánh giá và xếp hạng preset thịnh hành.

---

## 📈 Lịch trình triển khai tóm tắt

| Phiên bản | Mục tiêu chính | Trạng thái |
| :--- | :--- | :--- |
| **v1.0.0** | Core MVP, 10 High-Fashion Presets, Vietnamese Fonts, WebM 60fps Export | 🟢 Hoàn thành |
| **v1.2.0** | Interactive Waveform Editor (Wavesurfer), timeline kéo thả trực quan | 🟡 Kế hoạch Q1/2025 |
| **v1.5.0** | Word-by-word Kinetic, AI Whisper auto-sync | 🔵 Dự kiến Q2/2025 |
| **v2.0.0** | MP4 WebCodecs GPU encoding, WebGL Shader Shaders | 🟣 Dự kiến Q3/2025 |
| **v2.5.0** | Desktop App (Tauri v2), Community Preset Hub | ⚪ Ý tưởng tương lai |
