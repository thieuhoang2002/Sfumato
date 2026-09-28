# PROJECT SPECIFICATION (PRD) — SFUMATO
> **Tài liệu Đặc tả Yêu cầu Sản phẩm (Product Requirements Document)**  
> *Phiên bản: 2.0.0 | Cập nhật lần cuối: 28/09/2026 | Trạng thái: Active v0.2.0*

---

## 1. Bối Cảnh Ra Đời & Nỗi Đau Thị Trường (Problem & Pain Points)

### 1.1. Bối cảnh
Phong cách video **Developer Aesthetic / IDE Code Editor & Terminal Lyric Video** (chữ hiển thị như code đang chạy trên VS Code / Terminal với số dòng, timestamp và con trỏ gõ chữ typewriter) đang trở thành trào lưu thẩm mỹ cực kỳ cuốn hút trên TikTok, Instagram Reels và YouTube Shorts. Khi hòa trộn dạng Screen (`#000000` làm sáng) vào các video vlog, lofi, anime hay cảnh quay đêm, lời bài hát hiển thị như một chương trình máy tính đầy chất thơ và cá tính.

### 1.2. Nỗi đau thị trường (The Pain Points)
1. **Thiếu công cụ chuyên biệt cho phong cách Code/Terminal**:
   - Để làm hiệu ứng gõ code như VS Code, người dùng phải tự tạo từng layer trong Premiere hoặc After Effects, căn chỉnh từng dấu ngoặc `yield ""`, thụt lề spaces, số dòng, màu cú pháp syntax highlighting rất tốn thời gian.
2. **Vấn đề tràn dòng (Text Overflow)**:
   - Các câu hát tiếng Việt dài thường bị tràn mép phải màn hình 9:16 trên điện thoại nếu không có thuật toán bẻ dòng chuẩn code (Safe Word Wrap with Indent).
3. **Lỗi không tương thích định dạng WebM trên Windows**:
   - Các công cụ xuất canvas thông thường tạo file WebM thiếu metadata duration khiến Windows Media Player bị đứng ở giây thứ 3 và khó hòa trộn trên các phần mềm như CapCut PC.

---

## 2. Đối Tượng Người Dùng Mục Tiêu (User Personas)

| Persona | Đặc điểm | Nhu cầu chính |
| :--- | :--- | :--- |
| **Indie Artist / Coder-Musician** | Nghệ sĩ độc lập, sinh viên công nghệ, producer yêu thích phong cách lập trình viên & terminal. | Cần tạo nhanh lyric video dạng code IDE cực ngầu để teaser bài hát trên TikTok/Reels. |
| **Short-form Content Creator** | Nhà sáng tạo nội dung POV, Lofi Chill, Coding Music, Aesthetic Vlogs. | Cần video lyrics dạng gõ code nền đen 60fps để 1-click hòa trộn (Screen Blend) vào CapCut. |
| **Motion Designer / Editor** | Cần công cụ tạo animation gõ mã nguồn đồng bộ âm nhạc nhanh chóng mà không phải dựng thủ công keyframe. | Cần xuất video MP4 1080p 60fps chuẩn xác, khớp nhịp từng mili-giây. |

---

## 3. Các Luồng Người Dùng Chính (User Flows)

### Flow 1: Khởi tạo, Bắt nhịp & Quản lý Lời bài hát (Create & Sync Flow)
```
[1. Tải file âm thanh (MP3/WAV) hoặc dùng nhịp mặc định]
       │
       ▼
[2. Nhập văn bản lời bài hát tiếng Việt]
       │
       ▼
[3. Bật "Tap-to-Sync" & Nhấn phím Space theo nhịp hát]
       ├──> Đóng dấu mốc thời gian [00:12.4] chuẩn xác
       └──> Tự động liên kết các dòng code liền mạch (Seamless Chain)
       │
       ▼
[4. Tự động lưu tiến trình vào LocalStorage (Chống mất khi F5)]
```

### Flow 2: Tùy biến Giao diện IDE Code Editor (Art Direction Flow)
```
[1. Chọn Theme IDE: VS Code Dark+, Tokyo Night, Dracula, Matrix, Monokai, Cyberpunk]
       │
       ▼
[2. Chọn Cú pháp Ngôn ngữ: TypeScript (yield), Python (print), Bash ($ echo), Plain]
       │
       ▼
[3. Tùy biến: Font Monospace (JetBrains Mono / Fira Code), Cỡ chữ, Kiểu con trỏ (▋ / | / _)]
       │
       ▼
[4. Bật/Tắt: Số dòng code, Mốc thời gian, macOS Traffic Lights, Breadcrumbs]
```

### Flow 3: Kết xuất Video & Đưa vào CapCut (Export Flow)
```
[1. Bấm "Xuất Video Terminal / IDE Code"]
       │
       ▼
[2. Chọn Định dạng: MP4 (Tương thích cao) HOẶC WebM (VP9)]
       │
       ▼
[3. Render Frame-by-Frame có Live Preview & Cảnh báo giữ nguyên tab]
       │
       ▼
[4. Xem thử video ngay trong modal & Tải file về máy]
       │
       ▼
[5. Thả file vào CapCut -> Chọn hòa trộn: "Làm sáng" (Screen)]
       │
       ▼
[Nền đen #000000 biến mất 100%, khung code lyrics hiển thị sắc nét trên video!]
```

---

## 4. Ranh Giới Sản Phẩm (Scope Boundaries)

### Trong phạm vi phiên bản hiện tại (v0.2.0):
- [x] Giao diện IDE Code Editor chuẩn tỷ lệ 9:16 dọc, 1:1 vuông, 16:9 ngang.
- [x] 6 bộ theme lập trình viên (VS Code Dark+, Tokyo Night, Dracula Pro, Matrix Hacker, Monokai Pro, Cyberpunk Amber).
- [x] Đa dạng cú pháp ngôn ngữ lập trình (TypeScript, Python, Bash, Plain text).
- [x] Hiệu ứng Typewriter đánh máy từng ký tự mượt mà kèm con trỏ terminal nhấp nháy.
- [x] Thuật toán ngắt dòng thông minh (Safe Subline Wrapping) với thụt lề 2 spaces chuẩn code.
- [x] Bắt nhịp Tap-to-Sync phím Spacebar và chỉnh sửa từng mốc thời gian.
- [x] Xuất video MP4 / WebM 60fps kèm âm thanh hoặc video câm, có màn hình xem thử trực tiếp.
- [x] Tự động lưu trữ dự án vào `localStorage` và cảnh báo khi F5/tắt trang.
- [x] Tùy chọn đổi file nhạc hoặc gỡ nhạc linh hoạt.
