import React from 'react';
import { StylingOptions, EditorTheme, CodeLanguage, CursorStyle, AspectRatio } from '../types';
import { THEMES } from '../utils/themePresets';
import { Terminal, Code, Type, Layout, Sliders, Monitor, Sparkles } from 'lucide-react';

interface Props {
  options: StylingOptions;
  onChange: (options: StylingOptions) => void;
}

export const StyleControls: React.FC<Props> = ({ options, onChange }) => {
  const update = <K extends keyof StylingOptions>(key: K, value: StylingOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const THEME_LIST: { id: EditorTheme; name: string; icon: string; previewColor: string }[] = [
    { id: 'vscode-dark', name: 'VS Code Dark+', icon: '💻', previewColor: '#007acc' },
    { id: 'tokyo-night', name: 'Tokyo Night', icon: '🌃', previewColor: '#7aa2f7' },
    { id: 'dracula', name: 'Dracula Pro', icon: '🧛', previewColor: '#bd93f9' },
    { id: 'matrix', name: 'Matrix Hacker', icon: '⚡', previewColor: '#22c55e' },
    { id: 'monokai', name: 'Monokai Pro', icon: '🎨', previewColor: '#a6e22e' },
    { id: 'cyberpunk', name: 'Cyberpunk Amber', icon: '🔥', previewColor: '#f59e0b' },
  ];

  const LANGUAGES: { id: CodeLanguage; name: string; sample: string }[] = [
    { id: 'typescript', name: 'TypeScript', sample: 'yield "..."' },
    { id: 'python', name: 'Python', sample: 'print("...")' },
    { id: 'bash', name: 'Bash / CLI', sample: '$ echo "..."' },
    { id: 'plain', name: 'Plain Code', sample: '"..."' },
  ];

  const FONTS: { id: string; name: string }[] = [
    { id: 'JetBrains Mono', name: 'JetBrains Mono' },
    { id: 'Fira Code', name: 'Fira Code' },
    { id: 'Be Vietnam Pro', name: 'Be Vietnam Pro' },
    { id: 'Courier New', name: 'Courier New' },
  ];

  const CURSORS: { id: CursorStyle; label: string; symbol: string }[] = [
    { id: 'block', label: 'Khối', symbol: '▋' },
    { id: 'line', label: 'Gạch đứng', symbol: '|' },
    { id: 'underscore', label: 'Gạch dưới', symbol: '_' },
  ];

  const currentTheme = THEMES[options.theme] || THEMES['vscode-dark'];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6 text-zinc-300 font-sans custom-scrollbar select-none">
      {/* Title */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
        <Terminal size={18} className="text-emerald-400" />
        <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
          IDE & Terminal Studio
        </h2>
      </div>

      {/* 1. TỶ LỆ KHUNG HÌNH (Aspect Ratio) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
          <Layout size={13} className="text-indigo-400" />
          <span>Tỷ Lệ Khung Hình</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['9:16', '1:1', '16:9'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => update('aspectRatio', ratio)}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition-all text-center ${
                options.aspectRatio === ratio
                  ? 'bg-zinc-800 border-emerald-500 text-emerald-400 shadow-sm'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {ratio}
              <div className="text-[10px] opacity-60">
                {ratio === '9:16' ? 'TikTok/Reels' : ratio === '1:1' ? 'Square' : 'YouTube'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. GIAO DIỆN THEME CHÍNH */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
          <Monitor size={13} className="text-cyan-400" />
          <span>Giao Diện IDE Theme</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_LIST.map((th) => {
            const isSelected = options.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => update('theme', th.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                  isSelected
                    ? 'bg-zinc-800/90 border-white text-white shadow-lg'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                  style={{ backgroundColor: th.previewColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{th.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CÚ PHÁP NGÔN NGỮ (Code Language Syntax) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
          <Code size={13} className="text-yellow-400" />
          <span>Cú Pháp Ngôn Ngữ</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                update('language', lang.id);
                // Gợi ý tên file tương ứng
                if (lang.id === 'typescript') update('fileName', 'lyrics.ts');
                else if (lang.id === 'python') update('fileName', 'lyrics.py');
                else if (lang.id === 'bash') update('fileName', 'lyrics.sh');
                else update('fileName', 'lyrics.txt');
              }}
              className={`p-2 rounded-lg border text-left text-xs font-mono transition ${
                options.language === lang.id
                  ? 'bg-zinc-800 border-yellow-500 text-yellow-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-bold">{lang.name}</div>
              <div className="text-[10px] opacity-60 truncate">{lang.sample}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. TÊN FILE MÃ NGUỒN */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400">Tên File Hiển Thị Trên Tab</label>
        <input
          type="text"
          value={options.fileName || 'lyrics.ts'}
          onChange={(e) => update('fileName', e.target.value)}
          placeholder="lyrics.ts"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 transition"
        />
      </div>

      {/* 5. PHÔNG CHỮ & KÍCH CỠ */}
      <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
            <Type size={13} className="text-emerald-400" />
            <span>Phông Chữ Lập Trình</span>
          </label>
        </div>

        <select
          value={options.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 transition"
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Kích thước chữ:</span>
            <span className="font-mono text-white">{options.fontSize}px</span>
          </div>
          <input
            type="range"
            min={11}
            max={24}
            value={options.fontSize}
            onChange={(e) => update('fontSize', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Khoảng cách dòng:</span>
            <span className="font-mono text-white">{options.lineHeight.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={1.2}
            max={2.4}
            step={0.1}
            value={options.lineHeight}
            onChange={(e) => update('lineHeight', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 6. HIỆU ỨNG GÕ PHÍM & CON TRỎ (Cursor & Typewriter) */}
      <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
        <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
          <Sparkles size={13} className="text-pink-400" />
          <span>Hiệu Ứng Gõ Phím & Con Trỏ</span>
        </label>

        {/* Typewriter Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-300">Gõ chữ Typewriter:</span>
          <button
            onClick={() => update('typewriterEffect', !options.typewriterEffect)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              options.typewriterEffect ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                options.typewriterEffect ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Cursor Style */}
        <div className="space-y-1 pt-1">
          <span className="text-xs text-zinc-400">Kiểu con trỏ nhấp nháy:</span>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {CURSORS.map((c) => (
              <button
                key={c.id}
                onClick={() => update('cursorStyle', c.id)}
                className={`py-1 rounded text-xs font-mono border transition flex items-center justify-center space-x-1 ${
                  options.cursorStyle === c.id
                    ? 'bg-zinc-800 border-pink-400 text-pink-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span className="font-bold">{c.symbol}</span>
                <span className="text-[10px]">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. BẬT / TẮT CHI TIẾT GIAO DIỆN (Toggles) */}
      <div className="space-y-2.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
        <label className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5">
          <Sliders size={13} className="text-cyan-400" />
          <span>Chi Tiết Khung IDE</span>
        </label>

        {/* Show Line Numbers */}
        <div className="flex items-center justify-between text-xs">
          <span>Số dòng (Line numbers):</span>
          <button
            onClick={() => update('showLineNumbers', !options.showLineNumbers)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors ${
              options.showLineNumbers ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                options.showLineNumbers ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Show Timestamps */}
        <div className="flex items-center justify-between text-xs">
          <span>Mốc thời gian [00:14]:</span>
          <button
            onClick={() => update('showTimestamps', !options.showTimestamps)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors ${
              options.showTimestamps ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                options.showTimestamps ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Show Mac Window Dots */}
        <div className="flex items-center justify-between text-xs">
          <span>3 nút macOS (🔴 🟡 🟢):</span>
          <button
            onClick={() => update('showMacDots', !options.showMacDots)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors ${
              options.showMacDots ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                options.showMacDots ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Show Breadcrumb */}
        <div className="flex items-center justify-between text-xs">
          <span>Thanh Breadcrumb đường dẫn:</span>
          <button
            onClick={() => update('showBreadcrumb', !options.showBreadcrumb)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors ${
              options.showBreadcrumb ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                options.showBreadcrumb ? 'translate-x-4.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
