import React from 'react';
import { StylingOptions, FontChoice, MotionPreset } from '../types';
import { Type, Sparkles } from 'lucide-react';

interface Props {
  options: StylingOptions;
  onChange: (options: StylingOptions) => void;
}

const StyleControlsComponent: React.FC<Props> = ({ options, onChange }) => {
  const update = <K extends keyof StylingOptions>(key: K, value: StylingOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const FONTS: { id: FontChoice; label: string; sample: string }[] = [
    { id: 'Unbounded', label: 'Unbounded', sample: 'PHÁ CÁCH' },
    { id: 'Cinzel', label: 'Cinzel', sample: 'AVANT-GARDE' },
    { id: 'Montserrat', label: 'Montserrat', sample: 'HIP-HOP' },
    { id: 'Archivo Black', label: 'Archivo Black', sample: 'BOOMBAP' },
    { id: 'Prata', label: 'Prata', sample: 'PARIS' },
    { id: 'Epilogue', label: 'Epilogue', sample: 'MODERN' },
    { id: 'Sedgwick Ave', label: 'Sedgwick Ave', sample: 'STREET' },
    { id: 'Philosopher', label: 'Philosopher', sample: 'MYSTIC' },
    { id: 'Playfair Display', label: 'Playfair', sample: 'CINEMA' },
    { id: 'Be Vietnam Pro', label: 'Be Vietnam', sample: 'TIẾNG VIỆT' },
  ];

  const PRESETS: { id: MotionPreset; name: string; icon: string }[] = [
    { id: 'shatter-assemble', name: 'Shatter', icon: '🌪️' },
    { id: 'cross-drift', name: 'Cross Drift', icon: '🧬' },
    { id: 'card-flip-3d', name: '3D Flip', icon: '🌀' },
    { id: 'echo-ghost', name: 'Echo Ghost', icon: '💥' },
    { id: 'brutalist-giant', name: 'Brutalist', icon: '📐' },
    { id: 'elastic-spring', name: 'Elastic', icon: '🌊' },
    { id: 'hyper-velocity', name: 'Velocity', icon: '⚡' },
    { id: 'liquid-chrome', name: 'Chrome 3D', icon: '💎' },
    { id: 'film-burn', name: 'Film Fade', icon: '🎬' },
    { id: 'liquid-smoke', name: 'Smoke', icon: '🖤' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 overflow-y-auto text-xs p-4 space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
        <h2 className="font-semibold text-zinc-100 text-xs tracking-wider uppercase flex items-center space-x-1.5">
          <Sparkles size={13} className="text-emerald-400" />
          <span>Styles & Typography</span>
        </h2>
      </div>

      {/* 1. Styles (Grid 2 cột chuẩn CapCut) */}
      <div className="space-y-2">
        <label className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider block">
          Styles
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => update('motionPreset', preset.id)}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 relative ${
                options.motionPreset === preset.id
                  ? 'bg-zinc-800 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="text-base leading-none">{preset.icon}</span>
              <span className="text-[11px] font-semibold tracking-tight truncate w-full">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Fonts */}
      <div className="space-y-2 pt-2 border-t border-zinc-900">
        <label className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
          <Type size={13} />
          <span>Fonts</span>
        </label>
        <div className="space-y-1">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => update('fontFamily', font.id)}
              className={`w-full px-3 py-2 rounded-lg border text-left transition flex items-center justify-between ${
                options.fontFamily === font.id
                  ? 'bg-zinc-800 border-zinc-400 text-white shadow-sm'
                  : 'bg-zinc-900/40 border-zinc-800/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span style={{ fontFamily: `"${font.id}", sans-serif` }} className="text-xs text-zinc-100 font-medium">
                {font.label}
              </span>
              <span style={{ fontFamily: `"${font.id}", sans-serif` }} className="text-[11px] text-zinc-500 font-bold">
                {font.sample}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Typography Adjustments (Min font size 5px) */}
      <div className="space-y-3 pt-2 border-t border-zinc-900">
        <div>
          <div className="flex justify-between text-zinc-400 mb-1">
            <span>Cỡ chữ</span>
            <span className="font-mono text-zinc-200">{options.fontSize}px</span>
          </div>
          <input
            type="range"
            min={5}
            max={72}
            value={options.fontSize}
            onChange={(e) => update('fontSize', Number(e.target.value))}
            className="w-full accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-zinc-400 mb-1">
            <span>Giãn chữ</span>
            <span className="font-mono text-zinc-200">{options.letterSpacing}em</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.3}
            step={0.01}
            value={options.letterSpacing}
            onChange={(e) => update('letterSpacing', Number(e.target.value))}
            className="w-full accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Text Case Mode */}
        <div className="flex items-center space-x-1.5 pt-1">
          <span className="text-zinc-400 text-[11px] w-16">Kiểu chữ:</span>
          {(['none', 'uppercase', 'lowercase'] as const).map((c) => (
            <button
              key={c}
              onClick={() => update('textCase', c)}
              className={`flex-1 py-1 rounded text-[10px] border transition ${
                options.textCase === c
                  ? 'bg-zinc-800 border-zinc-400 text-white font-bold'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
              }`}
            >
              {c === 'none' ? 'Gốc' : c === 'uppercase' ? 'IN HOA' : 'thường'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StyleControls = React.memo(StyleControlsComponent);
