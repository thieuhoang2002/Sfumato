import React from 'react';
import { Sparkles, Download, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { AspectRatio, MotionPreset } from '../types';

interface Props {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  motionPreset: MotionPreset;
  onPresetChange: (preset: MotionPreset) => void;
  showSafeZone: boolean;
  onToggleSafeZone: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<Props> = ({
  aspectRatio,
  onAspectRatioChange,
  motionPreset,
  onPresetChange,
  showSafeZone,
  onToggleSafeZone,
  onOpenExport,
}) => {
  return (
    <header className="h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center font-bold text-white shadow-inner">
          <span className="text-base font-serif italic text-zinc-100">S</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-semibold tracking-wide text-zinc-100">Sfumato</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              MVP 0.1
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 hidden sm:block">
            Kinetic Lyrics • Nền đen tuyệt đối #000000 cho CapCut
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

        {/* Motion Preset Selector */}
        <select
          value={motionPreset}
          onChange={(e) => onPresetChange(e.target.value as MotionPreset)}
          className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-sans font-medium"
        >
          <option value="shatter-assemble">🌪️ Shatter & Assemble (Tách rời & Hợp nhất)</option>
          <option value="cross-drift">🧬 Cross-Drift Collision (Đan chéo xé gió)</option>
          <option value="card-flip-3d">🌀 3D Spatial Flip (Xòe bài 3D & Snap)</option>
          <option value="echo-ghost">💥 Echo Ghost Strobe (Bóng ma phân thân)</option>
          <option value="brutalist-giant">📐 Brutalist Giant (Bất đối xứng cực hạn)</option>
          <option value="elastic-spring">🌊 Elastic Spring (Cao su kéo giãn)</option>
          <option value="hyper-velocity">⚡ Hyper-Velocity Rush (Tốc độ bùng nổ)</option>
          <option value="liquid-chrome">💎 Liquid Chrome 3D (Tráng gương kim loại)</option>
          <option value="film-burn">🎬 Vintage 16mm Film Burn (Cháy phim cam ấm)</option>
          <option value="liquid-smoke">🖤 Sfumato Liquid Smoke (Khói loang)</option>
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
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center space-x-2 shadow-lg shadow-white/5 active:scale-95"
        >
          <Download size={14} />
          <span>Xuất Video (CapCut Ready)</span>
        </button>
      </div>
    </header>
  );
};
