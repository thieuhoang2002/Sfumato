# Sfumato (スラマート)
> **Minimalist web studio for generating developer-aesthetic IDE Code Editor & Terminal lyric videos (9:16, 60fps, #000000 background) with syntax highlighting, typewriter animations & timestamps, optimized for 1-click Screen blend in CapCut, Premiere & TikTok. Built with React 19, TypeScript & Canvas 2D.**

---

### 🏷️ Topic Tags
`developer-aesthetic` • `code-editor-lyrics` • `terminal-lyrics` • `kinetic-typography` • `lyric-video-generator` • `typewriter-effect` • `vscode-theme` • `tokyo-night` • `dracula-theme` • `react19` • `typescript` • `capcut-overlay` • `tiktok-video` • `canvas-rendering` • `mediarecorder`

---

## 💡 Ý Tưởng & Triết Lý

**Sfumato** là công cụ chuyên biệt dành cho nghệ sĩ độc lập, nhạc sĩ, producer và creators muốn tạo video lyrics mang phong cách **Lập trình viên / IDE Code Editor & Hacker Terminal**:
- Hiển thị lời bài hát dưới dạng các dòng mã nguồn (`yield "lời bài hát";`, `print("...")`, `$ echo "..."`).
- Hiệu ứng máy đánh chữ (**Typewriter**) gõ từng ký tự khớp với giọng hát, đi kèm con trỏ terminal nhấp nháy (`▋`, `|`, `_`).
- Cột số dòng code (`01`, `02`) và mốc thời gian mili-giây (`[00:12.4]`) chuẩn xác.
- **Nền đen tuyệt đối (`#000000`) 60fps**: Thả video vào CapCut / Premiere / DaVinci Resolve $\rightarrow$ Chọn hòa trộn **"Làm sáng" (Screen / Blend Mode)** $\rightarrow$ Toàn bộ nền đen tan biến, khung IDE Terminal nổi bật sắc nét trên nền MV hoặc vlog của bạn!

---

## 🌟 Tính Năng Nổi Bật

### 1. 🖥️ Bộ Giao Diện IDE & Terminal Cao Cấp (6 Developer Themes)
- **VS Code Dark+**: Bảng màu chuẩn mực của trình soạn thảo mã nguồn số 1 thế giới.
- **Tokyo Night**: Sắc tím neon huyền bí của đêm Tokyo cyberpunk.
- **Dracula Pro**: Tương phản cao, huyền thoại cho giới coder.
- **Matrix Hacker**: Xanh phosphor phosphor CRT đậm chất hacker điện ảnh.
- **Monokai Pro**: Vàng kem, xanh ngọc ấm áp kinh điển của Sublime Text.
- **Cyberpunk Amber**: Cam hổ phách ấm áp cổ điển từ những năm 80s.

### 2. ⌨️ Cú Pháp Đa Ngôn Ngữ & Font Lập Trình Chuẩn
- Hỗ trợ cú pháp:
  - **TypeScript / JavaScript**: `yield "lời bài hát";`
  - **Python**: `print("lời bài hát")`
  - **Bash / CLI**: `$ echo "lời bài hát"`
  - **Plain Text**: `"lời bài hát"`
- Tích hợp font Monospace tối ưu cho lập trình: **JetBrains Mono**, **Fira Code**, **Consolas** hỗ trợ $100\%$ tiếng Việt có dấu.
- Tự động bẻ dòng thông minh (**Safe Subline Wrap**): Câu hát dài tự động xuống dòng và thụt lề 2 spaces chuẩn code, không bao giờ bị tràn mép canvas.

### 3. ⏱️ Động Cơ Bắt Nhịp Tap-to-Sync (`Space` Bar)
- Nhấn phím `Space` theo nhịp hát để tự động đóng dấu timestamp và tạo dòng code mới.
- Tính năng **Seamless Chain**: Tự động nối đuôi câu trước tới câu sau, không bị khoảng trống đen.
- Dễ dàng đổi file nhạc hoặc gỡ nhạc bất cứ lúc nào.

### 4. 🎬 Kết Xuất Video 60fps Chuẩn MP4 & WebM
- **Hỗ trợ MP4 (H.264)**: Tương thích hoàn hảo với Windows Media Player, CapCut, Premiere, iPhone/QuickTime.
- **Hỗ trợ WebM (VP9)**: Tối ưu dung lượng, độ nét tuyệt đối cho web.
- **Live Preview khi xuất**: Theo dõi trực tiếp từng frame được render ngay trong hộp thoại.
- **Trình phát xem thử tích hợp**: Cho phép xem lại toàn bộ video trước khi tải về, kèm nút "Làm Lại" linh hoạt.
- **Cảnh báo giữ tab**: Nhắc nhở người dùng không ẩn tab để bảo đảm toàn vẹn khung hình 60fps.

### 5. 💾 Tự Động Lưu Trữ & Chống Mất Dữ Liệu
- Toàn bộ lời bài hát, mốc thời gian và cài đặt giao diện được tự động lưu vào `localStorage`.
- Cảnh báo xác nhận khi người dùng F5 hoặc tắt trang (`beforeunload`), đảm bảo an toàn tuyệt đối cho dự án của bạn.

---

## 🛠️ Công Nghệ Sử Dụng (Techstack)

- **Frontend**: React 19, TypeScript, Vite 6, TailwindCSS 3
- **Canvas Rendering Engine**: HTML5 2D Canvas WYSIWYG Renderer (1080p / 720p @ 60fps)
- **Video Encoding**: MediaRecorder API + native MP4 / WebM + `fix-webm-duration`
- **Audio Engine**: Web Audio API & HTML5 Audio Element
- **Icons**: Lucide React

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/thieuhoang2002/Sfumato.git
cd Sfumato
```

### Bước 2: Cài đặt thư viện
```bash
npm install
```

### Bước 3: Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập vào: **`http://localhost:5173/`**

### Bước 4: Đóng gói bản chạy thực tế (Production Build)
```bash
npm run build
```

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**.
