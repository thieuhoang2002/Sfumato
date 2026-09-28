# 🚢 DEPLOY_GUIDE — Cẩm nang Triển khai Dự án Sfumato

> Hướng dẫn chi tiết cách build, đóng gói và triển khai ứng dụng Sfumato lên các nền tảng Cloud (Vercel, Netlify, Cloudflare Pages) hoặc máy chủ riêng (Docker + Nginx).

---

## 🏛️ 1. Bản chất Kiến trúc Triển khai (Deployment Nature)

Sfumato là ứng dụng **Single Page Application (SPA)** thuần Client-Side:
- **Build Output**: Tệp tĩnh HTML/CSS/JavaScript trong thư mục `dist/`.
- **Backend / Database**: Không yêu cầu backend server hay cơ sở dữ liệu ở giai đoạn MVP (mọi tác vụ xử lý audio, canvas, motion và encode video đều diễn ra ngay trên trình duyệt người dùng nhờ Web APIs).
- **Yêu cầu quan trọng nhất**: **Bắt buộc phải chạy trên giao thức HTTPS** (hoặc `localhost`) để trình duyệt cấp quyền truy cập các Web APIs cao cấp như `AudioContext`, `MediaStream`, `captureStream()` và `MediaRecorder`.

---

## ☁️ 2. Triển khai lên Vercel (Khuyến nghị số 1)

Vercel là nền tảng tối ưu nhất cho các dự án xây dựng bằng Vite.

### Cách 1: Kết nối trực tiếp qua GitHub Dashboard (Đơn giản nhất)
1. Đẩy mã nguồn dự án lên GitHub.
2. Truy cập [vercel.com](https://vercel.com) $\rightarrow$ Nhấn **"Add New Project"** $\rightarrow$ Chọn repository `Sfumato`.
3. Vercel sẽ tự động phát hiện Framework Preset là **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Nhấn **"Deploy"** và chờ 30-45 giây.

### Cách 2: Cấu hình SPA Rewrite (`vercel.json`)
Để tránh lỗi 404 khi người dùng tải lại trang trên đường dẫn con:
Tạo file `vercel.json` tại thư mục gốc của dự án:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

---

## 🌐 3. Triển khai lên Netlify

### Cách 1: Qua giao diện Netlify Dashboard
1. Truy cập [netlify.com](https://netlify.com) $\rightarrow$ **"Add new site"** $\rightarrow$ **"Import an existing project"**.
2. Thiết lập thông số:
   - **Base directory**: để trống (thư mục gốc).
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Cách 2: Sử dụng file cấu hình `netlify.toml`
Tạo file `netlify.toml` ở thư mục gốc:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐳 4. Triển khai Bằng Docker & Nginx (Tự lưu trữ - Self-hosted)

Phù hợp khi triển khai trên máy chủ VPS riêng (Ubuntu, Debian) hoặc hạ tầng Kubernetes/Docker Swarm.

### File `Dockerfile` (Multi-stage build siêu nhẹ ~25MB):
```dockerfile
# Stage 1: Build source code bằng Node.js Alpine
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Stage 2: Serve file tĩnh bằng Nginx Alpine
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### File cấu hình `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Cache tài nguyên tĩnh (fonts, images, js, css)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Lệnh chạy Docker Container:
```bash
# Build Docker image
docker build -t sfumato-app:latest .

# Khởi chạy container trên port 8080
docker run -d -p 8080:80 --name sfumato sfumato-app:latest
```
Truy cập ứng dụng tại `http://localhost:8080`.

---

## 🩺 5. Quy trình Kiểm tra sau Triển khai (Post-Deployment Health Checks)

Sau khi deploy thành công, kỹ sư cần thực hiện checklist 5 bước sau để xác nhận ứng dụng hoạt động hoàn hảo:

1. **Kiểm tra HTTPS**: Xác nhận biểu tượng ổ khóa bảo mật trên thanh địa chỉ URL của trình duyệt. Nếu không có HTTPS, Web Audio API có thể bị khóa trên một số trình duyệt.
2. **Kiểm tra nạp Font chữ tiếng Việt**:
   - Mở công cụ DevTools (F12) $\rightarrow$ Tab Network $\rightarrow$ Lọc `font`.
   - Xác nhận các gói font từ Google Fonts (`fonts.gstatic.com`) trả về mã HTTP `200 OK`.
   - Gõ thử chuỗi ký tự kiểm thử: `"Hát lời nguyện ước gửi gió bay vào màn đêm"` và kiểm tra không bị lỗi ký tự.
3. **Kiểm tra Import Audio**:
   - Tải lên 1 file nhạc `.mp3` mẫu.
   - Nhấn Play và xác nhận sóng âm/thời gian chạy mượt mà, âm thanh phát rõ qua loa.
4. **Kiểm tra Gõ phím Space đồng bộ (Tap-to-Sync)**:
   - Thử nghiệm gõ phím `Space` khi nhạc đang chạy để đảm bảo timestamp được gán chuẩn xác.
5. **Kiểm tra Xuất Video (Export Test)**:
   - Nhấn **Export Video**, chọn độ phân giải 1080x1920 (9:16), bật tùy chọn **Kèm âm thanh bài hát**.
   - Kiểm tra thanh tiến trình chạy từ 0% đến 100%.
   - Mở file `.webm` vừa tải về trên Chrome/VLC: Kiểm tra chuyển động kinetic đạt 60fps mượt mà và nhạc nền phát đúng nhịp.

---

## ⚠️ 6. Xử lý Sự cố Thường gặp (Troubleshooting)

| Sự cố | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **Bấm Export không chạy hoặc treo ở 0%** | Trình duyệt không hỗ trợ `video/webm;codecs=vp9` hoặc RAM bị đầy | Khuyến nghị người dùng dùng Chrome/Edge, đóng bớt các tab nặng khác |
| **Không nghe thấy tiếng khi xuất video** | Trình duyệt chặn autoplay của AudioContext trước khi có tương tác người dùng | Đảm bảo người dùng đã nhấn nút Play hoặc thao tác trên trang trước khi xuất |
| **Lỗi 404 khi F5 tải lại trang trên đường dẫn con** | Nginx/Hosting chưa cấu hình SPA rewrite | Bổ sung file `vercel.json`, `netlify.toml` hoặc chỉ thị `try_files $uri /index.html` trong Nginx |
| **Âm thanh bị rè hoặc giật khi render** | CPU máy người dùng bị quá tải khi vừa vẽ Canvas 60fps vừa muxing | Tối ưu hóa lại vòng lặp render, giảm độ phân giải xem trước nếu cần |
