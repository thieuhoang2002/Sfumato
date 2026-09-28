import React from 'react';
import { Download, ShieldCheck, Terminal } from 'lucide-react';
import { AspectRatio, EditorTheme } from '../types';

interface Props {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
  showSafeZone: boolean;
  onToggleSafeZone: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<Props> = ({
  aspectRatio,
  onAspectRatioChange,
  theme,
  onThemeChange,
  showSafeZone,
  onToggleSafeZone,
  onOpenExport,
}) => {
  return (
    <header className="h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center font-bold text-white shadow-inner">
          <Terminal size={17} className="text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-semibold tracking-wide text-zinc-100 font-mono">
              Sfumato <span className="text-emerald-400">Code</span>
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              CLI IDE 1.0
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 hidden sm:block font-mono">
            Terminal & IDE Code Lyrics Video Generator • TikTok 9:16
          </p>
        </div>
      </div>

      {/* Central Quick Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Aspect Ratio Switcher */}
        <div className="flex bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs">
          {(['9:16', '1:1', '16:9'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`px-2.5 py-1 rounded transition-all font-mono text-[11px] ${
                aspectRatio === ratio
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* IDE Theme Selector */}
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as EditorTheme)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-mono font-medium"
        >
          <option value="vscode-dark">💻 VS Code Dark+</option>
          <option value="tokyo-night">🌃 Tokyo Night</option>
          <option value="dracula">🧛 Dracula Pro</option>
          <option value="matrix">⚡ Matrix Hacker</option>
          <option value="monokai">🎨 Monokai Pro</option>
          <option value="cyberpunk">🔥 Cyberpunk Amber</option>
        </select>

        {/* Safe Zone Toggle */}
        <button
          onClick={onToggleSafeZone}
          title="Bật/Tắt Safe Zone mô phỏng TikTok/Reels"
          className={`px-3 py-1.5 rounded-lg border text-xs flex items-center space-x-1.5 transition-all ${
            showSafeZone
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck size={14} />
          <span className="hidden md:inline">Safe Zone</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenExport}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/10 active:scale-95 font-mono"
        >
          <Download size={14} />
          <span>Xuất Video (1080p)</span>
        </button>
      </div>
    </header>
  );
};
