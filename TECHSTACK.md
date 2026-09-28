# TECHNICAL STANDARDS (TECHSTACK.md) — SFUMATO
> **Quy chuẩn Kiến trúc Kỹ thuật & Chuẩn Mã Nguồn**  
> *Phiên bản: 1.0.0 | Ngôn ngữ chính: TypeScript / React 19 / Vite*

---

## 1. Danh Sách Công Nghệ & Lý Do Lựa Chọn

| Hạng mục | Công nghệ | Phiên bản | Lý do lựa chọn |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `19.0.0` | Thư viện giao diện chuẩn công nghiệp, hiệu năng Virtual DOM xuất sắc, hệ sinh thái đồ sộ. |
| **Language** | TypeScript | `~5.7.2` | Định kiểu tĩnh nghiêm ngặt, triệt tiêu lỗi runtime, tự động gợi ý kiểu dữ liệu cho animation variants. |
| **Build Tool** | Vite | `^6.1.0` | Thời gian khởi động dev server siêu tốc (<1s), Hot Module Replacement (HMR) tức thì. |
| **Motion Physics Engine**| Framer Motion | `^12.4.7` | Thư viện kinetic animation số 1 thế giới, hỗ trợ Spring physics, Stagger children, 3D transforms, AnimatePresence. |
| **Styling & Design System**| TailwindCSS | `^3.4.17` | Utility-first CSS, biên dịch CSS siêu nhẹ, linh hoạt tùy biến màu `#000000` và responsive layout. |
| **Iconography** | Lucide React | `^0.475.0` | Bộ icon SVG tối giản, sắc nét, đồng bộ phong cách tối giản hiện đại. |
| **Audio Processing** | Web Audio API | Trình duyệt gốc | Độ trễ mili-giây cực thấp, hỗ trợ giải mã waveform và tạo MediaStreamDestination để muxing audio. |
| **Video Recording Engine**| HTML5 Canvas + MediaRecorder API | Trình duyệt gốc | Render offline/realtime 60fps mượt mà, xuất video WebM/VP9 không cần cài đặt phần mềm bên ngoài. |

---

## 2. Cấu Trúc Dữ Liệu & Kiểu TypeScript (Data Schema)

Toàn bộ dữ liệu của một bài hát và trạng thái visual được quản lý chặt chẽ trong `src/types/index.ts`:

```typescript
// 1. Tỉ lệ khung hình
export type AspectRatio = '9:16' | '1:1' | '16:9';

// 2. Danh mục 10 Phong cách Kinetic Bứt Phá
export type MotionPreset = 
  | 'shatter-assemble'   // Phân rã tản mác 4 phương -> Hút xoáy hợp nhất
  | 'cross-drift'        // Đan chéo đối kháng 2 bên lao vào nhau xé gió
  | 'card-flip-3d'       // Xòe bài 3D trong không gian -> Khóa snap
  | 'echo-ghost'         // Bóng ma phân thân 4 hướng -> Thu hồi chớp nhoáng
  | 'brutalist-giant'    // Bất đối xứng cực hạn: Từ chính khổng lồ
  | 'elastic-spring'     // Co giãn dây cao su đàn hồi & nhịp thở vật lý
  | 'hyper-velocity'     // Lao vút từ vô tận, zoom bùng nổ, phanh gấp
  | 'liquid-chrome'      // Tráng gương kim loại ánh bạc lấp lánh 3D
  | 'film-burn'          // Vintage 16mm: Vệt cháy phim cam ấm áp
  | 'liquid-smoke';      // Khói mờ Sfumato loang nở như giọt mực

// 3. Danh mục 10 Font chữ Display chuẩn 100% Tiếng Việt
export type FontChoice = 
  | 'Unbounded'          // Futuristic Neo-Grotesk cực dày mở rộng
  | 'Cinzel'             // La Mã quý tộc, sắc lẹm 900
  | 'Montserrat'         // Black 900 Italic thể thao tốc độ
  | 'Archivo Black'      // Nặng ký, đanh thép
  | 'Prata'              // Haute Couture Paris tương phản cao
  | 'Epilogue'           // Brutalist Display vát góc cá tính
  | 'Sedgwick Ave'       // Graffiti / Nét cọ đường phố
  | 'Philosopher'        // Serif huyền ảo uốn lượn
  | 'Playfair Display'   // Serif quý phái lãng mạn điện ảnh
  | 'Be Vietnam Pro';    // Chuẩn mực đương đại quốc tế

// 4. Mô hình dữ liệu từng dòng Lyrics
export interface LyricLine {
  id: string;            // Định danh duy nhất: `line-${timestamp}-${random}`
  text: string;          // Nội dung câu tiếng Việt có dấu
  startTime: number;     // Mốc bắt đầu (tính bằng giây, độ chính xác 0.01s)
  endTime: number;       // Mốc kết thúc (tự động kéo dài tới startTime câu kế)
  words?: LyricWord[];   // Danh sách các từ tách riêng (phục vụ kinetic)
  synced: boolean;       // Trạng thái đã đặt nhịp hay chưa
}

// 5. Cấu hình thẩm mỹ toàn cục (Global Styling State)
export interface StylingOptions {
  fontFamily: FontChoice;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textColor: string;
  glowEffect: boolean;
  glowIntensity: number;
  lineHeight: number;
  alignment: 'center' | 'left' | 'right';
  motionPreset: MotionPreset;
  aspectRatio: AspectRatio;
  showSafeZone: boolean;
  
  // Hiệu ứng điện ảnh
  enableFilmGrain: boolean;
  filmBurnEffect: boolean;
  chromeReflect: boolean;
  cameraShake: boolean;
  crtScanlines: boolean;
  heroWordAccent: 'scale' | 'outline' | 'badge' | 'none';
  chromaticAberration: boolean;
  textCase: 'none' | 'uppercase' | 'lowercase';
}
```

---

## 3. Cấu Trúc Thư Mục Mã Nguồn (Folder Structure)

```
Sfumato/
├── index.html                   # HTML template nạp toàn bộ Google Fonts Vietnamese Subsets
├── package.json                 # Định nghĩa dependencies và npm scripts
├── tsconfig.json                # Cấu hình TypeScript compiler
├── vite.config.ts               # Cấu hình bundler Vite & plugin React
├── tailwind.config.js           # Cấu hình bảng màu (#000000, canvas) và phông chữ
├── postcss.config.js            # PostCSS pipeline (Tailwind & Autoprefixer)
│
├── src/
│   ├── main.tsx                 # Điểm khởi đầu ứng dụng React
│   ├── App.tsx                  # Controller trung tâm kết nối toàn bộ 3-column layout
│   ├── index.css                # CSS toàn cục, custom scrollbars, keyframe animations
│   │
│   ├── types/
│   │   └── index.ts             # Định nghĩa toàn bộ interfaces & types
│   │
│   ├── utils/
│   │   └── formatters.ts        # Helper format thời gian (00:00.0) và parser lyrics
│   │
│   └── components/
│       ├── Header.tsx           # Thanh điều hướng trên cùng, đổi tỉ lệ, đổi preset, nút xuất
│       ├── KineticCanvas.tsx    # Khung canvas đen trung tâm, chứa 10 engine chuyển động
│       ├── LyricsEditor.tsx     # Bảng quản lý lời bài hát, inline edit, delete, tap-sync
│       ├── StyleControls.tsx    # Bảng tinh chỉnh font, preset, hiệu ứng phim ảnh
│       ├── SafeZoneOverlay.tsx  # Lớp lưới mô phỏng giao diện TikTok/Reels/Shorts
│       ├── WaveformTimeline.tsx # Thanh tiến trình âm thanh, play/pause, seekbar
│       └── ExportModal.tsx      # Bộ kết xuất video 60fps kèm/không kèm audio track
│
└── dist/                        # Thư mục sau khi build production (HTML, CSS, JS tĩnh)
```

---

## 4. Quy Chuẩn Viết Code (Coding Conventions)

1. **Quy tắc đặt tên (Naming Conventions)**:
   - Components: `PascalCase` (ví dụ: `KineticCanvas.tsx`, `LyricsEditor.tsx`).
   - Hooks & Utilities: `camelCase` (ví dụ: `formatTime`, `parseLyricsText`).
   - Types & Interfaces: `PascalCase` (ví dụ: `LyricLine`, `StylingOptions`).
   - Constant Constants: `UPPER_SNAKE_CASE` (ví dụ: `SAMPLE_LYRICS`, `PRESETS`).
2. **Quy tắc Bố Cục (Layout Architecture)**:
   - Luôn sử dụng mô hình 3 cột vững chãi: 
     - Cột trái (`w-80 flex-shrink-0`)
     - Cột giữa (`flex-1 min-w-0`) — đảm bảo Canvas không bao giờ bị đè bẹp.
     - Cột phải (`w-80 flex-shrink-0`)
3. **Quy tắc Animation trong Kinetic Typography**:
   - Sử dụng Spring physics (`type: 'spring', damping, stiffness`) thay cho easing tuyến tính (`linear`) để tạo độ nảy tự nhiên như vật lý thực.
   - Khi sử dụng AnimatePresence, luôn đặt `mode="wait"` để câu trước tan biến hoàn toàn trước khi câu sau xuất hiện, tránh xung đột chữ đè lên nhau.
4. **Quy tắc Quản lý Dấu Tiếng Việt**:
   - Mọi URL Google Fonts phải đính kèm tham số `&subset=vietnamese`.
   - Không tự ý thêm font Latin đơn thuần vào hệ thống mà chưa qua kiểm tra hiển thị tiếng Việt.
