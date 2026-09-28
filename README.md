# Sfumato (スラマート)
> *"Nghệ thuật không nằm ở sự phô trương màu sắc, mà ở nhịp thở tinh tế của từng nét chữ giữa khoảng không tĩnh lặng."*

**Sfumato** là công cụ chuyên biệt dành cho nghệ sĩ độc lập, nhạc sĩ, producer và creators: Tạo video kinetic typography lyrics **nền đen tuyệt đối (`#000000`)**, chuyển động bứt phá đạt chuẩn Art Direction Studio, khớp nhịp từng mili-giây, đảm bảo $100\%$ không lỗi font tiếng Việt và nằm gọn trong vùng an toàn (Safe Zone) của TikTok, Reels, Shorts.

Workflow 1-Click: Thả video vào CapCut/Premiere $\rightarrow$ Chọn hòa trộn **"Làm sáng" (Screen)** $\rightarrow$ Toàn bộ nền đen tan biến, chữ nghệ thuật đè mượt mà lên bất kỳ khung hình nào của bạn!

---

## 🌟 Tính Năng Nổi Bật

- **Nền đen tuyệt đối `#000000` 60fps**: Xuất file WebM/MP4 chuẩn công nghiệp, tối ưu hoàn hảo cho chế độ hòa trộn Screen/Làm sáng.
- **10 Phong Cách Kinetic Bứt Phá (The Art Direction Suite)**:
  - 🌪️ `Shatter & Assemble`: Ký tự bắn văng tứ phương rồi bị lực hút cực mạnh kéo giật về tâm va đập hợp nhất.
  - 🧬 `Cross-Drift Collision`: Đan chéo đối kháng 2 luồng chữ lao vào nhau xé toạc màn đêm.
  - 🌀 `3D Spatial Flip`: Xòe bài 3D trong không gian rồi khóa cạch vào tọa độ.
  - 💥 `Echo Ghost Strobe`: Bóng ma quang sai RGB 4 hướng thu hồi chớp nhoáng.
  - 📐 `Brutalist Giant`: Bố cục bất đối xứng cực hạn, từ chính phóng to $2.0\times$ chiếm trọn khung hình.
  - 🌊 `Elastic Spring`: Kéo giãn cao su đàn hồi và nhịp thở vật lý.
  - ⚡ `Hyper-Velocity Rush`: Lao vút từ vô tận, zoom bùng nổ, phanh gấp rung chấn.
  - 💎 `Liquid Chrome 3D`: Tráng gương kim loại ánh bạc lấp lánh, lơ lửng bồng bềnh 3D.
  - 🎬 `Vintage 16mm Film Burn`: Vệt cháy phim cam ấm áp kết hợp rung cơ học máy quay đĩa than.
  - 🖤 `Sfumato Liquid Smoke`: Khói mờ hư ảo loang nở uyển chuyển như giọt mực.
- **100% Chuẩn Dấu Tiếng Việt (Zero Font Crash)**:
  - Tích hợp tập font Display & Editorial quốc tế đã xác thực hỗ trợ tiếng Việt đầy đủ: *Unbounded Black 900*, *Cinzel 900*, *Montserrat Italic 900*, *Archivo Black*, *Prata*, *Epilogue*, *Sedgwick Ave (Graffiti)*, *Philosopher*, *Playfair Display*, *Be Vietnam Pro*.
- **Động cơ khớp nhịp Tap-to-Sync (`Space` Bar)**:
  - Gõ phím `Space` theo nhịp hát để tự động tạo ô lời và nối đuôi liền mạch (*Seamless Chain*), không bị khoảng trống đen.
  - Tinh chỉnh mili-giây từng mốc bắt đầu/kết thúc (+0.1s, -0.1s).
- **Bộ Lưới Safe Zone Đa Tỉ Lệ**:
  - Mô phỏng chính xác vị trí nút Like, Comment, Share, Avatar và thanh caption của TikTok/Reels cho các tỉ lệ: **9:16**, **1:1**, **16:9**.
- **Tùy Chọn Âm Thanh Linh Hoạt Khi Xuất Video**:
  - Xuất video có âm thanh đồng bộ đầy đủ để đăng trực tiếp.
  - Xuất video câm (Mute) để thả vào timeline CapCut/Premiere mà không bị trùng lặp nhạc gốc.

---

## 🛠️ Techstack Vắn Tắt

- **Frontend**: React 19, TypeScript, Vite 6, TailwindCSS 3
- **Animation & Physics Engine**: Framer Motion 12 (Spring physics, Stagger, 3D Transforms)
- **Audio Processing**: HTML5 Web Audio API, MediaStream Recording
- **Typography Engine**: Google Fonts Vietnamese Subsets (WebFont Loader)
- **Rendering & Video Export**: HTML5 Canvas Stream Capture + MediaRecorder API (VP9/Opus 60fps)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### Bước 1: Clone kho mã nguồn
```bash
git clone https://github.com/your-username/sfumato.git
cd sfumato
```

### Bước 2: Cài đặt dependencies
Yêu cầu Node.js $\ge$ 18.x (Đã kiểm nghiệm mượt mà trên Node v24.x):
```bash
npm install
```

### Bước 3: Khởi động server phát triển (Dev)
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại: **`http://localhost:5173/`**

### Bước 4: Đóng gói bản Production
```bash
npm run build
```
Thư mục xuất bản tĩnh sẽ nằm tại `dist/`.

---

## 🌐 Danh Sách Cổng Chạy (Port Mapping)

| Dịch vụ | Cổng (Port) | Giao thức | URL Mặc Định |
| :--- | :--- | :--- | :--- |
| **Vite Dev Server** | `5173` | HTTP | `http://localhost:5173` |
| **Vite Preview** | `4173` | HTTP | `http://localhost:4173` |

---

## 📬 Liên Hệ & Giấy Phép

- **Tác giả**: Sfumato Open-Source Initiative
- **Triết lý**: Human-First Typography & Zero-Compromise Aesthetics
- **Giấy phép**: MIT License
