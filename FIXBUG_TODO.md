# 🐛 FIXBUG_TODO — Nhật ký Sửa lỗi & Giải pháp Kỹ thuật

> Tài liệu ghi lại chi tiết các lỗi đã phát sinh trong quá trình phát triển Sfumato (スラマート) — IDE & Terminal Lyric Video Studio, phân tích nguyên nhân gốc rễ (Root Cause Analysis), cách khắc phục và bài học kinh nghiệm nhằm ngăn ngừa tái diễn.

---

## 📑 Danh mục lỗi đã xử lý

| Mã lỗi | Tiêu đề lỗi | Module bị ảnh hưởng | Mức độ | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| `BUG-001` | Mất khung hình Canvas Preview trên giao diện | `src/App.tsx`, `StyleControls.tsx` | Critical | 🟢 Đã khắc phục |
| `BUG-002` | Lyrics tự tắt sau 3 giây gây khoảng đen ngắt quãng | `CanvasPreview.tsx`, `useAudioSync.ts` | High | 🟢 Đã khắc phục |
| `BUG-003` | Lỗi vỡ font tiếng Việt có dấu (Font Fallback) | `index.html`, `types.ts` | Medium | 🟢 Đã khắc phục |
| `BUG-004` | Xuất video WebM không có âm thanh | `ExportModal.tsx` | High | 🟢 Đã khắc phục |
| `BUG-005` | Chữ phụ kỹ thuật rác (Watermark/Metadata) đè lên video | `CanvasPreview.tsx` | Medium | 🟢 Đã khắc phục |
| `BUG-007` | Xuất video bị kéo dài gấp đôi (2 phút) & mất hiệu ứng | `ExportModal.tsx` | Critical | 🟢 Đã khắc phục |
| `BUG-008` | Canvas preview bị giật lag do render loop & DOM mutation | `kineticRenderer.ts`, `CanvasPreview.tsx` | Critical | 🟢 Đã khắc phục |
| `BUG-009` | Video WebM xuất ra bị dừng sau 3 giây dù file dài 24 giây | `ExportModal.tsx` | Critical | 🟢 Đã khắc phục |
| `BUG-010` | Lỗi video khi người dùng ẩn tab / chuyển cửa sổ lúc render | `ExportModal.tsx` | High | 🟢 Đã khắc phục |
| `BUG-011` | Mất toàn bộ dữ liệu lyrics khi vô tình F5 hoặc đóng tab | `LyricsInput.tsx`, `App.tsx` | High | 🟢 Đã khắc phục |

---

## 🔍 Chi tiết từng lỗi kỹ thuật

### 🔴 BUG-001: Mất khung hình Canvas Preview (Layout Flexbox Collapse)

- **Triệu chứng**: Khi mở web tool, người dùng chỉ nhìn thấy bảng điều khiển bên trái và panel kiểu chữ bên phải, khu vực màn hình canvas xem trước ở giữa biến mất hoàn toàn.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Trong file `src/components/StyleControls.tsx`, container sử dụng class `w-full lg:w-84` và không có thuộc tính `flex-shrink-0`.
  - Trong TailwindCSS mặc định, `w-84` không phải là class có sẵn (chỉ có `w-80` hoặc `w-96`), khiến trình duyệt fallback về `width: 100%`.
  - Do cơ chế Flexbox của thẻ cha `flex flex-col lg:flex-row`, khi panel phải chiếm toàn bộ chiều ngang khả dụng, nó đã bóp nghẹt container `CanvasPreview` ở giữa về `width: 0px`.
- **Giải pháp xử lý (Resolution)**:
  - Cố định kích thước 2 panel bên trái và phải bằng `w-80 flex-shrink-0` hoặc `w-72 flex-shrink-0`.
  - Container trung tâm chứa Canvas được thiết lập `flex-1 min-w-0 flex items-center justify-center` để luôn chiếm trọn vẹn phần diện tích trung tâm còn lại và tự co giãn theo tỷ lệ màn hình.
- **Bài học kinh nghiệm**: Luôn dùng `flex-shrink-0` cho các thanh sidebar cố định chiều rộng trong bố cục Flexbox và kiểm tra tính hợp lệ của class TailwindCSS trước khi dùng.

---

### 🔴 BUG-002: Lyrics tự tắt sau 3 giây tạo khoảng đen ngắt quãng (Gap Flicker)

- **Triệu chứng**: Khi nghe nhạc, mỗi câu lyrics chỉ hiện đúng 3 giây rồi lập tức biến mất, để lại màn hình đen ngòm trong khoảng thời gian chờ đến câu hát tiếp theo.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Logic tính thời điểm kết thúc câu hát ban đầu được đặt cứng: `endTime = startTime + 3.0`.
  - Điều kiện hiển thị dòng lyrics là `currentTime >= line.startTime && currentTime <= line.endTime`.
  - Nếu câu hát sau cách câu trước 7 giây, thì 4 giây ở giữa màn hình sẽ hoàn toàn trống rỗng, làm đứt mạch cảm xúc của video kinetic.
- **Giải pháp xử lý (Resolution)**:
  - Nâng cấp logic tính thời gian hiển thị liên tục (Seamless Duration Logic):
  ```typescript
  const nextLine = lyrics[index + 1];
  const effectiveEnd = nextLine ? nextLine.startTime : (line.endTime || line.startTime + 4.0);
  const isActive = currentTime >= line.startTime && currentTime < effectiveEnd;
  ```
  - Bổ sung nút **"Nối liền các câu (Seamless)"** trong giao diện để người dùng có thể 1-click tự động chuẩn hóa toàn bộ mảng `endTime` của câu trước bằng đúng `startTime` của câu sau.
- **Bài học kinh nghiệm**: Kinetic lyrics trong video âm nhạc cần tính liên tục thị giác (Visual Continuity). Trừ phi người dùng cố tình tạo khoảng lặng, chữ phải được giữ trên màn hình cho tới câu tiếp theo.

---

### 🟡 BUG-003: Lỗi vỡ font tiếng Việt có dấu (Unicode Diacritics Fallback)

- **Triệu chứng**: Một số font chữ khi gõ tiếng Việt có dấu (như "Anh", "hát", "nguyện", "trời") thì các ký tự có dấu như `ă, â, ê, ô, ơ, ư, đ` bị nhảy về font Times New Roman hoặc Arial, gây mất thẩm mỹ nghiêm trọng.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Thẻ `<link>` gọi Google Fonts trong `index.html` chỉ nạp charset Latin cơ bản mặc định, không khai báo rõ ràng tham số `&subset=vietnamese`.
- **Giải pháp xử lý (Resolution)**:
  - Cập nhật URL Google Fonts trong `index.html` kèm cờ `&subset=vietnamese` và `display=swap`.
  - Chuyển sang các font Monospace chuẩn quốc tế hỗ trợ tuyệt đối tiếng Việt: *JetBrains Mono*, *Fira Code*, *Source Code Pro*.
- **Bài học kinh nghiệm**: Với các dự án typography tiếng Việt, luôn kiểm tra đầy đủ bảng ký tự kiểm thử Unicode có dấu trước khi đưa vào sản phẩm.

---

### 🔴 BUG-004: Xuất video WebM không có âm thanh (Muxing Missing)

- **Triệu chứng**: File video `.webm` xuất ra từ công cụ chỉ có hình ảnh chuyển động chữ, khi mở trên trình phát video thì hoàn toàn câm lặng không có tiếng nhạc.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - `canvas.captureStream(60)` chỉ chứa duy nhất `video track`, hoàn toàn không có `audio track`.
- **Giải pháp xử lý (Resolution)**:
  - Sử dụng Web Audio API (`AudioContext`, `createMediaElementSource`, `createMediaStreamDestination`) để trích xuất âm thanh từ thẻ `<audio>` và muxing vào cùng MediaStream với Canvas.
- **Bài học kinh nghiệm**: `HTMLCanvasElement.captureStream()` là thuần thị giác. Mọi nhu cầu xuất video có tiếng đều phải kết hợp `AudioContext.createMediaStreamDestination()`.

---

### 🟡 BUG-005: Xuất hiện các chữ phụ rác (Metadata Text Overlays)

- **Triệu chứng**: Trên màn hình Canvas xuất hiện các dòng chữ nhỏ như `SFUMATO // KINETIC STUDIO`, `ROLL 16MM` làm rối khung hình và không thể dùng làm video lyrics sạch để overlay lên CapCut.
- **Nguyên nhân gốc rễ (Root Cause)**: Các chi tiết trang trí giả lập viewfinder máy quay gây nhiễu thị giác người dùng.
- **Giải pháp xử lý (Resolution)**: Dọn dẹp 100% watermark và text rác. Khung Canvas chỉ giữ lại màn hình IDE editor chân thực hoặc nền đen `#000000` thuần khiết.

---

### 🔴 BUG-007: Xuất video bị kéo dài gấp đôi & mất hiệu ứng

- **Triệu chứng**: Video khi bấm xuất thì thời gian bị nhân đôi, các frame hiệu ứng bị gián đoạn.
- **Nguyên nhân gốc rễ (Root Cause)**: Vòng lặp render trong modal xuất video xung đột với `requestAnimationFrame` của preview bên ngoài và kích hoạt hai lần `MediaRecorder.ondataavailable`.
- **Giải pháp xử lý (Resolution)**: Tách riêng luồng render headless của ExportModal, tắt tạm thời render vòng lặp của preview khi quá trình export đang diễn ra.

---

### 🔴 BUG-008: Canvas preview bị giật lag do render loop & DOM mutation

- **Triệu chứng**: Khi phát nhạc và xem preview hoặc chuyển sang chế độ full-screen, hình ảnh bị giật khựng, FPS tụt xuống dưới 20fps.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Trước đây, việc đồng bộ giữa React state `currentTime` và Canvas animation loop làm kích hoạt re-render liên tục toàn bộ component cha `App.tsx` ở tần số 60Hz.
  - Việc liên tục đọc/ghi DOM element của thẻ audio gây ra hiện tượng layout thrashing.
- **Giải pháp xử lý (Resolution)**:
  - Chuyển toàn bộ logic vẽ sang Canvas 2D engine độc lập (`src/utils/kineticRenderer.ts`).
  - Sử dụng tham chiếu trực tiếp `audioRef.current.currentTime` trong hàm `requestAnimationFrame` thay vì đẩy `currentTime` liên tục qua React state.
  - Tách logic rendering ra khỏi React render cycle, đưa FPS ổn định trở lại 60fps mượt mà.
- **Bài học kinh nghiệm**: Với các ứng dụng đồ họa realtime, tuyệt đối không dùng React State để lưu trữ thời gian chạy ở tần số 60fps. Hãy dùng `useRef` hoặc render loop nội bộ của Canvas.

---

### 🔴 BUG-009: Video WebM xuất ra bị dừng sau 3 giây dù file dài 24 giây

- **Triệu chứng**: Xuất video từ bài hát dài 24 giây, file tải về báo độ dài 24 giây hoặc vô hạn, nhưng khi mở bằng Windows Media Player, QuickTime hay CapCut thì phát được 3 giây là đứng hình.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - `MediaRecorder` của trình duyệt Chrome/Chromium khi ghi luồng `captureStream()` vào container WebM không ghi trường độ dài thời gian chính xác (`EBML Duration element`) vào header của file WebM, khiến các trình phát video không nhận diện được timeline thực tế.
- **Giải pháp xử lý (Resolution)**:
  - Tích hợp thư viện `fix-webm-duration`:
  ```typescript
  import fixWebmDuration from 'fix-webm-duration';

  const rawBlob = new Blob(recordedChunks, { type: selectedMimeType });
  const durationMs = totalDuration * 1000;
  fixWebmDuration(rawBlob, durationMs, (fixedBlob) => {
    // Tải xuống file đã được chắp vá duration hoàn hảo
    const url = URL.createObjectURL(fixedBlob);
    ...
  });
  ```
  - Bổ sung cơ chế tự động nhận diện codec: Ưu tiên `video/mp4;codecs=avc1` nếu trình duyệt hỗ trợ.
- **Bài học kinh nghiệm**: WebM tạo bởi MediaRecorder luôn thiếu EBML Duration metadata. Luôn phải vá bằng `fix-webm-duration` trước khi cung cấp cho người dùng.

---

### 🟡 BUG-010: Lỗi video khi người dùng ẩn tab / chuyển cửa sổ lúc render

- **Triệu chứng**: Khi người dùng nhấn nút xuất video rồi chuyển sang lướt Facebook hoặc mở tab khác, file video xuất ra bị giật cục, thiếu khung hình hoặc dừng hẳn.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Các trình duyệt hiện đại (Chrome, Edge) có cơ chế tiết kiệm tài nguyên nghiêm ngặt: Khi một tab bị ẩn (background tab), `requestAnimationFrame` bị giảm tần số xuống 1fps hoặc tạm dừng hoàn toàn, khiến `canvas.captureStream(60)` không nhận đủ frame.
- **Giải pháp xử lý (Resolution)**:
  - Thêm banner cảnh báo màu hổ phách ngay trên giao diện Export Modal:
    > *"⚠️ Lưu ý quan trọng: Vui lòng KHÔNG chuyển tab, ẩn trình duyệt hoặc thu nhỏ cửa sổ trong suốt quá trình render để đảm bảo video không bị đứng hình hoặc lỗi khung hình!"*
- **Bài học kinh nghiệm**: Các tác vụ render Canvas realtime phụ thuộc vào `requestAnimationFrame` bắt buộc phải có cảnh báo người dùng giữ tab active.

---

### 🟡 BUG-011: Mất toàn bộ dữ liệu lyrics khi vô tình F5 hoặc đóng tab

- **Triệu chứng**: Người dùng dán lời bài hát và căn chỉnh nhịp trong 15 phút, nhưng lỡ tay nhấn F5 hoặc tắt tab là toàn bộ công sức biến mất.
- **Nguyên nhân gốc rễ (Root Cause)**: Dữ liệu lyrics ban đầu chỉ được lưu trong RAM (React state `lyrics`), khi tải lại trang toàn bộ state bị khởi tạo lại về mảng rỗng.
- **Giải pháp xử lý (Resolution)**:
  - Triển khai cơ chế auto-save vào `localStorage` với key `sfumato_lyrics_autosave` mỗi khi mảng `lyrics` thay đổi.
  - Khi khởi động ứng dụng, tự động kiểm tra và phục hồi lyrics từ `localStorage` nếu có.
  - Bổ sung listener sự kiện `window.addEventListener('beforeunload')` để hiển thị hộp thoại cảnh báo xác nhận khi người dùng cố tình rời khỏi trang.
- **Bài học kinh nghiệm**: Luôn có cơ chế persistence tự động (Local Storage / IndexedDB) cho bất kỳ dữ liệu đầu vào nào của người dùng.
