# TECHNICAL STANDARDS (TECHSTACK.md) — SFUMATO
> **Quy chuẩn Kiến trúc Kỹ thuật & Chuẩn Mã Nguồn**  
> *Phiên bản: 2.0.0 | Ngôn ngữ chính: TypeScript / React 19 / Vite*

---

## 1. Danh Sách Công Nghệ & Lý Do Lựa Chọn

| Hạng mục | Công nghệ | Phiên bản | Lý do lựa chọn |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `19.0.0` | Thư viện UI chuẩn mực, hiệu năng render xuất sắc, quản lý state và DOM đồng bộ. |
| **Language** | TypeScript | `~5.7.2` | Định kiểu nghiêm ngặt, triệt tiêu lỗi runtime, tự động gợi ý props và code layout types. |
| **Build Tool** | Vite | `^6.1.0` | Khởi động server phát triển tức thì (<1s), Hot Module Replacement (HMR) cực nhanh. |
| **Styling** | TailwindCSS | `^3.4.17` | Utility-first CSS, thiết kế giao diện Dark Mode chuẩn mực cho IDE Editor và Terminal. |
| **Iconography** | Lucide React | `^0.475.0` | Bộ icon SVG tối giản, sắc nét, đồng bộ cho terminal controls và timeline. |
| **Canvas 2D Engine** | HTML5 Canvas API | Trình duyệt gốc | Render 1080p 60fps đồng bộ WYSIWYG giữa màn hình preview và file video xuất. |
| **Video Recording** | MediaRecorder API | Trình duyệt gốc | Hỗ trợ chuẩn xuất video **MP4 (H.264/AVC)** và **WebM (VP9)** mượt mà. |
| **Metadata Patching** | fix-webm-duration | `^1.0.6` | Vá siêu dữ liệu thời lượng (Duration EBML) chuẩn xác cho file WebM. |
| **Storage Persistence** | LocalStorage API | Trình duyệt gốc | Tự động lưu tiến trình lyrics và cấu hình theme, chống mất dữ liệu khi F5. |

---

## 2. Cấu Trúc Dữ Liệu & Kiểu TypeScript (Data Schema)

Toàn bộ dữ liệu được quản lý trong `src/types/index.ts` và `src/utils/codeLayout.ts`:

```typescript
// 1. Tỉ lệ khung hình
export type AspectRatio = '9:16' | '1:1' | '16:9';

// 2. Ngôn ngữ cú pháp Code Editor
export type CodeLanguage = 'typescript' | 'python' | 'bash' | 'plain';

// 3. Kiểu con trỏ Terminal
export type CursorStyle = 'block' | 'line' | 'underscore';

// 4. Danh mục 6 Theme IDE Lập trình viên
export type ThemeId = 
  | 'vscode-dark'    // VS Code Dark+
  | 'tokyo-night'    // Tokyo Night Cyberpunk
  | 'dracula'        // Dracula Pro
  | 'matrix'         // Matrix Hacker Green
  | 'monokai'        // Monokai Pro
  | 'cyberpunk';     // Cyberpunk Amber 80s

// 5. Cấu hình thẩm mỹ IDE Editor (StylingOptions)
export interface StylingOptions {
  theme: ThemeId;
  aspectRatio: AspectRatio;
  language: CodeLanguage;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  showLineNumbers: boolean;
  showTimestamps: boolean;
  showMacDots: boolean;
  showBreadcrumb: boolean;
  typewriterEffect: boolean;
  cursorStyle: CursorStyle;
  crtScanlines: boolean;
  fileName: string;
  showSafeZone: boolean;
}

// 6. Mô hình dữ liệu từng dòng Lyrics
export interface LyricLine {
  id: string;            // Định danh duy nhất: `line-${timestamp}-${random}`
  text: string;          // Nội dung câu tiếng Việt có dấu
  startTime: number;     // Mốc bắt đầu (giây, độ chính xác 0.01s)
  endTime: number;       // Mốc kết thúc (tự động nối tiếp câu kế)
  words?: LyricWord[];   // Danh sách từ
  synced: boolean;       // Trạng thái đã đặt nhịp
}
```

---

## 3. Cấu Trúc Thư Mục Mã Nguồn (Folder Structure)

```
Sfumato/
├── index.html                   # HTML template nạp Monospace Fonts (JetBrains Mono, Fira Code)
├── package.json                 # Định nghĩa dependencies và npm scripts
├── tsconfig.json                # Cấu hình TypeScript compiler
├── vite.config.ts               # Cấu hình bundler Vite & plugin React
├── tailwind.config.js           # Cấu hình TailwindCSS
├── postcss.config.js            # PostCSS pipeline
│
├── src/
│   ├── main.tsx                 # Điểm khởi đầu ứng dụng React
│   ├── App.tsx                  # Controller trung tâm kết nối 3 cột, audio & localStorage
│   ├── index.css                # CSS toàn cục, custom scrollbars
│   │
│   ├── types/
│   │   └── index.ts             # Định nghĩa toàn bộ interfaces & types
│   │
│   ├── utils/
│   │   ├── codeLayout.ts        # Thuật toán ngắt dòng thông minh (Safe Sublines) & tokens cú pháp
│   │   ├── formatters.ts        # Helper format thời gian (00:00.0) và parser lyrics
│   │   ├── kineticRenderer.ts   # Canvas 2D engine render 1080p 60fps chuẩn IDE
│   │   └── themePresets.ts      # Bảng màu 6 theme IDE lập trình viên
│   │
│   └── components/
│       ├── Header.tsx           # Thanh điều hướng trên cùng, quick theme switcher, nút xuất
│       ├── KineticCanvas.tsx    # Khung IDE Window trung tâm hiển thị code lyrics trực tiếp
│       ├── LyricsEditor.tsx     # Bảng quản lý lời bài hát, inline edit, delete, tap-sync
│       ├── StyleControls.tsx    # Bảng tinh chỉnh theme, cú pháp ngôn ngữ, font, con trỏ
│       ├── SafeZoneOverlay.tsx  # Lưới mô phỏng vùng an toàn TikTok/Reels/Shorts
│       ├── WaveformTimeline.tsx # Thanh tiến trình âm thanh, đổi/xóa file nhạc, play/pause
│       ├── ExportModal.tsx      # Bộ xuất video MP4/WebM 60fps có live preview & verification
│       └── FullscreenPreview.tsx# Chế độ xem trước toàn màn hình
│
└── dist/                        # Thư mục xuất bản tĩnh production (HTML, CSS, JS)
```

---

## 4. Quy Chuẩn Viết Code (Coding Conventions)

1. **Quy tắc Bố cục (Layout Architecture)**:
   - Mô hình 3 cột: Cột trái (Quản lý lời bài hát), Cột giữa (IDE Window Hero Canvas), Cột phải (Cài đặt Theme & Cú pháp).
2. **Quy tắc Ngắt dòng Mã nguồn (Code Layout Wrapping)**:
   - Dòng 1 hiển thị từ khóa cú pháp (`yield "`, `print("`, `$ echo "`).
   - Dòng thứ 2 trở đi thụt lề 2 dấu cách (`line.indent: '  '`), không cộng dồn prefix để bảo đảm chữ không bao giờ bị cắt khỏi lề phải canvas 9:16.
3. **Quy tắc Xuất Video (Video Export Engine)**:
   - Ưu tiên container MP4 (H.264/AVC) để bảo đảm tương thích tối đa với Windows Media Player và CapCut.
   - Luôn sử dụng đồng hồ thời gian wall-clock kết hợp AudioElement để bảo đảm thời lượng xuất video chính xác $100\%$, không bao giờ kết thúc sớm.
