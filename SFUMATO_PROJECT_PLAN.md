# Sfumato (スラマート) — Project Master Plan
> *"Nơi âm nhạc biến thành từng dòng code sống động — IDE Code Editor & Terminal Lyric Video Studio."*

**Sfumato** là công cụ studio web hiện đại dành cho lập trình viên, content creator và bedroom artists: Tạo video lyrics phong cách **IDE Code Editor & Terminal (9:16 dọc, 60fps, nền đen `#000000`)** với hiệu ứng gõ máy chữ (Typewriter animation), phân tích cú pháp đa ngôn ngữ (Syntax Highlighting), timestamps dòng code và con trỏ nhấp nháy, tối ưu 1-click hòa trộn **Screen blend** trên CapCut, Premiere, TikTok.

---

## 1. Triết lý Thiết kế: "The Developer Aesthetic Canvas"

* **Tại sao lại là *Sfumato*?**  
  Trong hội họa thời Phục Hưng, *Sfumato* (bắt nguồn từ tiếng Ý: *fumo* - làn khói) là kỹ thuật chuyển tiếp êm ả không góc cạnh thô ráp. Trong Sfumato Studio v0.2.0+, đây là sự chuyển giao nhịp nhàng giữa từng phím gõ mã nguồn và giai điệu âm nhạc.
* **Thẩm mỹ Lập trình viên (Developer & Terminal Aesthetic):**  
  Không hiệu ứng giật cục rẻ tiền, không font chữ khó đọc. Lời ca được trình bày như một đoạn mã nguồn tuyệt tác trong Visual Studio Code, Tokyo Night hay Dracula với số dòng (line numbers), thẻ file tab (`lyrics.ts`, `song.py`), con trỏ nhấp nháy chân thực và hiệu ứng typewriter ăn khớp theo từng nhịp hát.
* **Workflow 1-Click vào CapCut / TikTok:**  
  Video xuất ra với nền đen tinh khiết 1080x1920 60fps. Khi đưa vào CapCut/Premiere, chỉ cần chọn chế độ hòa trộn **"Làm sáng" (Screen)**, toàn bộ nền đen tan biến, để lại giao diện IDE code đè mượt mà lên bất kỳ thước phim nào.

---

## 2. Các Trụ cột Tính năng Cốt lõi

```
+-----------------------------------------------------------------------+
|                       SFUMATO v0.2.0 ARCHITECTURE                     |
|                                                                       |
|  [ 1. Input & Persistence ]  -->  [ 2. Fluid Tap-to-Sync ]            |
|  - Giữ nguyên 100% tiếng Việt     - Gõ phím Space theo nhịp phách     |
|  - Auto-save LocalStorage         - Seamless duration (nối liên tục)  |
|  - Cảnh báo F5 / BeforeUnload     - Đổi/Xóa audio linh hoạt           |
|                                                                       |
|                 |                                 |                   |
|                 v                                 v                   |
|                                                                       |
|  [ 3. IDE Code Engine (Canvas) ] --> [ 4. 60fps Screen-Ready Export ] |
|  - 6 Theme lập trình kinh điển    - MP4 / WebM 1080x1920 60fps        |
|  - 7 Ngôn ngữ cú pháp (TS, PY...)  - Muxing âm thanh gốc Web Audio     |
|  - Typewriter & Line Numbers      - fix-webm-duration vá metadata     |
|  - Lưới Safe Zone TikTok 9:16     - Cảnh báo chống đóng băng tab      |
+-----------------------------------------------------------------------+
```

### 2.1. Quản lý Lyrics & Chống Mất Dữ Liệu
* Dán văn bản lời bài hát thô, tự động tách dòng.
* Tự động lưu tức thì vào `localStorage` (`sfumato_lyrics_autosave`).
* Cảnh báo `beforeunload` khi có dữ liệu chưa xuất, loại bỏ hoàn toàn rủi ro mất bài khi vô tình F5 hoặc tắt trình duyệt.

### 2.2. Khớp Nhịp Thông Minh (Tap-to-Sync Engine)
* Nhấn phím `Space` khi nhạc chạy để bắt nhịp từng câu hát.
* Cơ chế **Seamless Duration**: Tự động kéo dài thời lượng câu trước đến khi câu kế tiếp xuất hiện, giữ màn hình code luôn liền mạch không bị khoảng đen ngắt quãng.
* Quản lý tệp âm thanh: Hỗ trợ Đổi bài hát mới hoặc Xóa bài hát bất cứ lúc nào.

### 2.3. Bố Cục IDE & Bộ Chuyển Động Typewriter
* **Top File Tab Bar**: Thẻ tệp giả lập IDE với icon ngôn ngữ và tên tệp (`lyrics.ts`, `song.py`, `track.rs`...).
* **Line Numbers Gutter**: Cột số dòng thanh lịch, chuẩn mực.
* **Active Line Indicator**: Highlight dòng mã nguồn đang cất lời hát.
* **Typewriter Animation**: Từng ký tự xuất hiện mượt mà theo tiến trình thời gian thực.
* **Blinking Caret Cursor**: Con trỏ phím nhấp nháy ở cuối ký tự đang gõ.
* **Syntax Highlighting**: Nhận diện từ khóa (`const`, `function`, `def`, `return`...), chuỗi ký tự (`"string"`), chú thích (`// comment`), số và biến.
* **6 Theme Lập Trình Viên**: Tokyo Night, VS Code Dark+, Dracula, Monokai, Cyberpunk Neon, Minimal Monochrome.
* **Font Monospace**: JetBrains Mono, Fira Code, Source Code Pro (100% hỗ trợ tiếng Việt có dấu).

### 2.4. Xuất Video Chuẩn Phòng Thu (Export Engine)
* Tỷ lệ dọc chuẩn **9:16 (1080x1920)** ở tần số quét cao **60fps**.
* Nền đen tuyệt đối `#000000` sẵn sàng 1-click Screen blend trên CapCut/Premiere.
* Tự động ưu tiên codec MP4 (`video/mp4;codecs=avc1`), fallback WebM (`video/webm;codecs=vp9,opus`).
* Tích hợp `fix-webm-duration` sửa triệt để lỗi video WebM bị cắt sau 3 giây.
* Banner cảnh báo giữ tab hoạt động để chống trình duyệt tiết kiệm pin làm đóng băng frame.
* Nút **"Làm lại (Re-render)"** và **"Tải lại video"** cho phép xuất liên tục linh hoạt.

---

## 3. Lộ Trình Phát Triển

| Phiên bản | Mục tiêu chính | Trạng thái |
| :--- | :--- | :--- |
| **v0.2.0** | IDE & Terminal Core Studio, Canvas 2D Typewriter, 6 Themes, MP4/WebM 60fps, LocalStorage | 🟢 Hoàn thành |
| **v0.3.0** | Interactive Waveform Editor (Wavesurfer.js), timeline kéo thả trực quan | 🟡 Kế hoạch Q4/2024 - Q1/2025 |
| **v0.4.0** | Terminal CLI Log Mode, Custom Syntax Theme Builder, Font Ligatures | 🟡 Dự kiến Q1/2025 |
| **v0.5.0** | Word-by-word Typewriter Sync, Whisper forced alignment | 🔵 Dự kiến Q2/2025 |
| **v1.0.0** | WebCodecs GPU Native MP4 encoding, faster-than-realtime export | 🔵 Dự kiến Q2/2025 |
| **v1.5.0** | Desktop App (Tauri v2), Community Preset Hub | 🟣 Ý tưởng tương lai |
