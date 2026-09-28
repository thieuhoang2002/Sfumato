# 🐛 FIXBUG_TODO — Nhật ký Sửa lỗi & Giải pháp Kỹ thuật

> Tài liệu ghi lại chi tiết các lỗi đã phát sinh trong quá trình phát triển Sfumato, phân tích nguyên nhân gốc rễ (Root Cause Analysis), cách khắc phục và bài học kinh nghiệm nhằm ngăn ngừa tái diễn.

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
  // Tìm câu lyrics tiếp theo trong mảng đã sắp xếp theo thời gian
  const nextLine = lyrics[index + 1];
  // Thời điểm kết thúc thực tế được kéo dài tới tận lúc câu sau bắt đầu
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
  - Một số font chữ dạng Display/Artistic chỉ hỗ trợ bảng mã tiếng Anh cơ bản (ASCII).
- **Giải pháp xử lý (Resolution)**:
  - Rà soát toàn bộ bộ sưu tập font trong `types.ts`, loại bỏ các font không hỗ trợ tiếng Việt.
  - Xây dựng danh sách 10 font chuẩn hóa 100% tiếng Việt:
    1. *Unbounded* (Modern Cyber / Display)
    2. *Cinzel Decorative* (Cổ điển / Điện ảnh)
    3. *Montserrat Black 900* (Mạnh mẽ / Brutalism)
    4. *Archivo Black* (Đậm nét / Khối hộp)
    5. *Prata* (Sang trọng / Editorial)
    6. *Epilogue* (Góc cạnh / Thiết kế)
    7. *Sedgwick Ave* (Streetwear / Graffiti)
    8. *Philosopher* (Mềm mại / Lãng mạn)
    9. *Playfair Display* (Quý phái / Tạp chí)
    10. *Be Vietnam Pro* (Chuẩn mực tiếng Việt / Tối giản)
  - Cập nhật URL Google Fonts trong `index.html` kèm cờ `&subset=vietnamese` và `display=swap`.
- **Bài học kinh nghiệm**: Với các dự án hướng tới người dùng Việt Nam, bắt buộc phải kiểm tra bộ ký tự kiểm thử đầy đủ: `ĂẮẰẲẴẶÂẤẦẨẪẬĐÊẾỀỂỄỆÔỐỒỔỖỘƠỚỜỞỠỢƯỨỪỬỮỰỲÝỶỸỴ` trước khi đưa font vào sản phẩm.

---

### 🔴 BUG-004: Xuất video WebM không có âm thanh (Muxing Missing)

- **Triệu chứng**: File video `.webm` xuất ra từ công cụ chỉ có hình ảnh chuyển động chữ, khi mở trên trình phát video thì hoàn toàn câm lặng không có tiếng nhạc.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - `MediaRecorder` ban đầu chỉ nhận luồng stream lấy từ thẻ `<canvas>`: `canvas.captureStream(60)`.
  - Luồng stream của Canvas chỉ chứa duy nhất `video track`, hoàn toàn không có `audio track`.
- **Giải pháp xử lý (Resolution)**:
  - Sử dụng Web Audio API để trích xuất âm thanh từ thẻ `<audio>` và trộn vào stream của video:
  ```typescript
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sourceNode = audioCtx.createMediaElementSource(audioElement);
  const destNode = audioCtx.createMediaStreamDestination();
  sourceNode.connect(destNode);
  sourceNode.connect(audioCtx.destination); // Vẫn phát ra loa để nghe

  // Kết hợp video track từ canvas và audio track từ audio destination
  const canvasStream = canvas.captureStream(60);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...destNode.stream.getAudioTracks()
  ]);

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: 'video/webm;codecs=vp9,opus',
    audioBitsPerSecond: 128000
  });
  ```
  - Bổ sung tùy chọn Switch trong modal xuất video: Cho phép người dùng chủ động chọn **"Kèm âm thanh bài hát"** hoặc **"Chỉ xuất chữ (Không tiếng)"** tùy mục đích dựng phim.
- **Bài học kinh nghiệm**: `HTMLCanvasElement.captureStream()` là thuần thị giác. Mọi nhu cầu xuất video có tiếng đều phải kết hợp `AudioContext.createMediaStreamDestination()`.

---

### 🟡 BUG-005: Xuất hiện các chữ phụ rác (Metadata Text Overlays)

- **Triệu chứng**: Trên màn hình Canvas xuất hiện các dòng chữ nhỏ như `SFUMATO // KINETIC STUDIO`, `ROLL 16MM // TAKE 04`, `EDITORIAL KINETIC // VERSE 01` làm rối khung hình và không thể dùng làm video lyrics sạch để overlay lên CapCut.
- **Nguyên nhân gốc rễ (Root Cause)**:
  - Trong thiết kế ban đầu, lập trình viên thêm các chi tiết giả lập khung máy quay (Camera UI HUD) để trông có vẻ "nghệ thuật".
  - Tuy nhiên, trong thực tế dựng video, các chi tiết này làm người dùng mất tập trung và phá hỏng ý đồ hình ảnh của video gốc bên dưới CapCut.
- **Giải pháp xử lý (Resolution)**:
  - Dọn dẹp triệt để toàn bộ các thẻ chữ phụ, watermark và nhãn dán kỹ thuật trong `CanvasPreview.tsx`.
  - Khung Canvas được trả về trạng thái thuần khiết 100%: Nền đen `#000000` và duy nhất câu lyrics của người dùng hiển thị ở trung tâm.
- **Bài học kinh nghiệm**: Lắng nghe phản hồi thực tế của người dùng. Một công cụ tiện ích (utility tool) phục vụ quy trình làm việc (workflow) cần ưu tiên sự tinh gọn và độ sạch của sản phẩm đầu ra hơn là sự trang trí rườm rà không cần thiết.

---

## 🔮 Danh sách vấn đề đang theo dõi (Pending / Known Issues)

### 1. Giới hạn WebM trên iOS Safari
- **Hiện tượng**: Safari trên iPhone/iPad có thể không phát được file `.webm` trực tiếp trong ứng dụng Ảnh (Photos), người dùng cần mở qua VLC hoặc gửi qua máy tính.
- **Kế hoạch xử lý**: Sẽ tích hợp chuyển đổi sang định dạng `.mp4` (H.264) bằng WebCodecs trong Phase 3.

### 2. Trình duyệt Firefox giới hạn FPS Canvas capture
- **Hiện tượng**: Trên một số phiên bản Firefox cũ, `canvas.captureStream(60)` có thể bị giới hạn xuống 30fps do chính sách tiết kiệm pin.
- **Kế hoạch xử lý**: Đề xuất người dùng sử dụng trình duyệt nhân Chromium (Google Chrome, Microsoft Edge, Brave) để đạt chất lượng 60fps tốt nhất.
