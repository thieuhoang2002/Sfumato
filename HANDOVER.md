# 🤝 HANDOVER — Biên bản Bàn giao Ca làm việc

> **Dự án**: Sfumato (スラマート) — IDE & Terminal Lyric Video Studio  
> **Thời điểm lập biên bản**: 28/09/2026 (Phiên bản v0.2.0 - IDE/Terminal Transition)  
> **Người bàn giao**: AI Coding Assistant (Antigravity)  
> **Người tiếp nhận**: Lead Developer / Maintainer dự án Sfumato  

---

## 1. 📊 Trạng thái Hệ thống Hiện tại (Current Status)

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Nhánh Git hiện hành** | `dev` | Mã nguồn sạch, đồng bộ toàn bộ tài liệu và mã nguồn |
| **Trạng thái Build (Vite)** | 🟢 **PASS** | Lệnh `npm run build` biên dịch thành công 100% |
| **Kiểm tra kiểu dữ liệu (TypeScript)** | 🟢 **PASS** | Không có lỗi type error (`tsc -b` pass) |
| **Môi trường Dev Local** | 🟢 **ACTIVE** | Đang chạy tại `http://localhost:5173/` |
| **Trình duyệt khuyến nghị** | Google Chrome, Edge, Brave | Hỗ trợ chuẩn `captureStream(60)`, `MediaRecorder` và Web Audio |

---

## 2. 🚀 Tóm tắt các tính năng & cải tiến đã hoàn thiện trong ca này

Trong ca làm việc v0.2.0, dự án đã thực hiện bước chuyển mình mang tính chiến lược theo yêu cầu người dùng: Chuyển đổi từ mô hình typography thời trang sang **IDE Code Editor & Terminal Lyrics Generator** và giải quyết dứt điểm các bài toán hiệu năng:

1. **Chuyển dịch sang kiến trúc IDE / Terminal Lyrics (`src/utils/codeLayout.ts`, `src/utils/themePresets.ts`)**:
   - Tái cấu trúc giao diện canvas thành cửa sổ trình soạn thảo mã nguồn chân thực: Top tab bar (`lyrics.ts`, `song.py`...), Line numbers gutter, Active line highlight, Typewriter cursor blinking.
   - Hỗ trợ 7 ngôn ngữ cú pháp (TS/JS, Python, C++, Rust, HTML, Shell, Markdown) và 6 theme lập trình kinh điển (Tokyo Night, VS Code Dark+, Dracula, Monokai, Cyberpunk Neon, Minimal Monochrome).

2. **Khắc phục triệt để hiện tượng Giật Lag Preview (`src/utils/kineticRenderer.ts`)**:
   - Chuyển toàn bộ pipeline vẽ chữ từ DOM/Framer-motion sang Canvas 2D thuần.
   - Tối ưu hóa vòng lặp render, loại bỏ re-render thừa của React State trong animation loop, đảm bảo tốc độ mượt mà 60fps tuyệt đối trên preview và full screen.

3. **Khắc phục lỗi Video WebM dừng sau 3 giây (`fix-webm-duration`)**:
   - Sử dụng thư viện `fix-webm-duration` để vá bảng ghi EBML duration trong tệp WebM ngay trên RAM trước khi tải xuống, đảm bảo video dài đầy đủ theo bài hát (24s, 60s, v.v.).
   - Tự động phát hiện và ưu tiên codec MP4 (`video/mp4;codecs=avc1`) trên các trình duyệt hỗ trợ.

4. **Thêm cảnh báo giữ tab khi Render Video & Nút Làm Lại (`ExportModal.tsx`)**:
   - Thêm banner cảnh báo màu hổ phách: Nhắc nhở người dùng không ẩn tab, không chuyển cửa sổ khi đang render video để tránh tình trạng trình duyệt tiết kiệm pin làm đóng băng tiến trình.
   - Thêm nút **"Làm lại (Re-render)"** bên cạnh nút Tải video, cho phép người dùng xuất lại nhiều lần mà không bị khóa modal.

5. **Nâng cấp Audio Manager**:
   - Cho phép người dùng linh hoạt **Đổi file nhạc** hoặc **Xóa file nhạc** hiện tại để làm lại từ đầu mà không cần F5 trình duyệt.

6. **Bảo vệ dữ liệu Lyrics (Auto-save & Anti-refresh)**:
   - Tự động lưu tiến trình soạn thảo lyrics vào `localStorage` (`sfumato_lyrics_autosave`).
   - Lắng nghe sự kiện `beforeunload` để hiện cảnh báo xác nhận khi người dùng vô tình nhấn F5 hoặc đóng tab.

7. **Đồng bộ toàn diện Nhận diện & Tài liệu Dự án**:
   - Cập nhật tagline chính thức chuẩn IDE Developer-Aesthetic:
     > *"Minimalist web studio for generating developer-aesthetic IDE Code Editor & Terminal lyric videos (9:16, 60fps, #000000 background) with syntax highlighting, typewriter animations & timestamps, optimized for 1-click Screen blend in CapCut, Premiere & TikTok. Built with React 19, TypeScript & Canvas 2D."*
   - Cập nhật đồng bộ các tệp: `package.json`, `index.html`, `README.md`, `PROJECT_SPEC.md`, `TECHSTACK.md`, `ROADMAP.md`, `HANDOVER.md`.

---

## 3. 📂 Cấu trúc Module Cốt lõi (Core Architecture Map)

```
src/
├── components/
│   ├── CanvasPreview.tsx      # Khung canvas hiển thị preview và toàn màn hình
│   ├── ExportModal.tsx        # Modal xuất video MP4/WebM kèm fix-webm-duration & cảnh báo tab
│   ├── LyricsInput.tsx        # Quản lý danh sách lyrics, auto-save localStorage
│   ├── AudioSyncTimeline.tsx  # Điều khiển phát nhạc, gõ Space bắt nhịp, đổi/xóa audio
│   └── StyleControls.tsx      # Điều khiển Theme IDE, Ngôn ngữ code, Font Monospace, Cỡ chữ
├── utils/
│   ├── codeLayout.ts          # Bộ phân tích cú pháp (Syntax parser), cấu trúc dòng code
│   ├── themePresets.ts        # Bảng màu 6 theme lập trình kinh điển
│   └── kineticRenderer.ts     # Engine Canvas 2D vẽ typewriter, line numbers, cursor, tab bar
├── types/
│   └── index.ts               # Định nghĩa TypeScript cho LyricLine, CodeTheme, LanguageMode
└── App.tsx                    # Root component điều phối state toàn cục
```

---

## 4. 🧭 Các công việc cần thực hiện tiếp theo (Next Action Items)

Dành cho kỹ sư tiếp nhận phiên tiếp theo:
1. **Interactive Audio Waveform Editor**:
   - Tích hợp `wavesurfer.js` thay cho thanh trượt native `input[type="range"]` để người dùng có thể kéo thả mốc `startTime` trực quan trên sóng âm.
2. **Terminal CLI Log Mode**:
   - Thêm chế độ hiển thị giả lập terminal console chạy log lệnh bash (`$ sfumato run lyrics.sh`, `[INFO]`, progress bar).
3. **Word-by-word Typewriter**:
   - Hỗ trợ gán timestamp chi tiết tới từng từ (word-level) để con trỏ code nhảy gõ theo từng âm tiết bài hát.

---

## 5. 🛠️ Lệnh khởi động nhanh (Quick Start for Successor)

```powershell
# 1. Kiểm tra nhánh git
git status

# 2. Khởi chạy môi trường phát triển
npm run dev

# 3. Kiểm tra tính toàn vẹn của mã nguồn
npm run build
```

Mọi thắc mắc kỹ thuật vui lòng tra cứu `README.md`, `PROJECT_SPEC.md` và `TECHSTACK.md` trong thư mục gốc của dự án.
