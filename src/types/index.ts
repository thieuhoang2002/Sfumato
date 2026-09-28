export type AspectRatio = '9:16' | '1:1' | '16:9';

export type EditorTheme = 
  | 'vscode-dark'     // VS Code Dark+ chuẩn mực lập trình viên
  | 'tokyo-night'     // Tokyo Night neon Cyberpunk
  | 'dracula'         // Dracula Pro tím vàng
  | 'matrix'          // Matrix Hacker xanh lá phosphor
  | 'monokai'         // Monokai Pro cổ điển
  | 'cyberpunk';      // Cyberpunk Amber vàng cam 2077

export type CodeLanguage = 
  | 'typescript'      // yield "..." / const line = "..."
  | 'python'          // print("...") / yield "..."
  | 'bash'            // [00:14] $ echo "..."
  | 'plain';          // [00:14] "..."

export type MonospaceFont = 
  | 'JetBrains Mono'
  | 'Fira Code'
  | 'Be Vietnam Pro'
  | 'Courier New';

export type CursorStyle = 'block' | 'line' | 'underscore';

export interface LyricWord {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  isHero?: boolean;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: LyricWord[];
  synced: boolean;
}

export interface StylingOptions {
  theme: EditorTheme;
  language: CodeLanguage;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  aspectRatio: AspectRatio;
  showLineNumbers: boolean;
  showTimestamps: boolean;
  showMacDots: boolean;
  showBreadcrumb: boolean;
  typewriterEffect: boolean;
  cursorStyle: CursorStyle;
  crtScanlines: boolean;
  fileName: string;
  showSafeZone: boolean;

  // Backwards compatibility / helpers
  fontWeight?: number;
  textColor?: string;
  glowEffect?: boolean;
}
