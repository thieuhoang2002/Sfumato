import React from 'react';
import { StylingOptions, FontChoice, MotionPreset } from '../types';
import { 
  Sliders, Type, Sparkles, AlignCenter, AlignLeft, AlignRight, 
  Layers, Film, Wand2, Eye, ShieldCheck, Flame, Zap, Radio, Tv
} from 'lucide-react';

interface Props {
  options: StylingOptions;
  onChange: (options: StylingOptions) => void;
}

export const StyleControls: React.FC<Props> = ({ options, onChange }) => {
  const update = <K extends keyof StylingOptions>(key: K, value: StylingOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const FONTS: { id: FontChoice; label: string; desc: string; sample: string }[] = [
    { id: 'Unbounded', label: 'Unbounded (Futuristic Black 900)', desc: 'Mở rộng cực dày, xu hướng MV toàn cầu • 100% Tiếng Việt', sample: 'PHÁ CÁCH' },
    { id: 'Cinzel', label: 'Cinzel (La Mã Sắc Lẹm 900)', desc: 'Quý tộc Avant-Garde thời trang • 100% Tiếng Việt', sample: 'AVANT-GARDE' },
    { id: 'Montserrat', label: 'Montserrat (Black 900 Italic)', desc: 'Tốc độ thể thao chuẩn US-UK • 100% Tiếng Việt', sample: 'HIP-HOP' },
    { id: 'Archivo Black', label: 'Archivo Black (Đanh Thép)', desc: 'Nặng ký, tương phản cực đại • 100% Tiếng Việt', sample: 'BOOMBAP' },
    { id: 'Prata', label: 'Prata (Haute Couture Paris)', desc: 'Serif thanh lịch tương phản ngút ngàn • 100% Tiếng Việt', sample: 'PARIS COUTURE' },
    { id: 'Epilogue', label: 'Epilogue (Brutalist Vát Góc)', desc: 'Cá tính độc bản, display hiện đại • 100% Tiếng Việt', sample: 'Nghệ Thuật' },
    { id: 'Sedgwick Ave', label: 'Sedgwick Ave (Graffiti)', desc: 'Vẽ tay streetwear phong trần • 100% Tiếng Việt', sample: 'Đường Phố' },
    { id: 'Philosopher', label: 'Philosopher (Huyền Ảo)', desc: 'Serif uốn lượn mềm mại huyền bí • 100% Tiếng Việt', sample: 'Khoảng Lặng' },
    { id: 'Playfair Display', label: 'Playfair Display (Điện Ảnh)', desc: 'Serif quý phái lãng mạn • 100% Tiếng Việt', sample: 'Sfumato' },
    { id: 'Be Vietnam Pro', label: 'Be Vietnam Pro (Chuẩn Mực)', desc: 'Đẳng cấp typography đương đại • 100% Tiếng Việt', sample: 'Tiếng Việt' },
  ];

  const PRESETS: { id: MotionPreset; name: string; tag: string; desc: string; icon: string }[] = [
    { 
      id: 'shatter-assemble', 
      name: 'Shatter & Assemble (Phân Rã & Hợp Nhất)', 
      tag: 'Cực Kỳ Phá Cách', 
      desc: 'Các chữ bắn văng tứ phương rồi bị lực hút cực mạnh kéo va đập hợp nhất vào tâm!',
      icon: '🌪️'
    },
    { 
      id: 'cross-drift', 
      name: 'Cross-Drift Collision (Đan Chéo Đối Kháng)', 
      tag: 'Tốc Độ Xé Gió', 
      desc: 'Từ bên trái và bên phải lao xé toạc màn đêm rồi va chạm nảy chấn động ở giữa',
      icon: '🧬'
    },
    { 
      id: 'card-flip-3d', 
      name: '3D Spatial Flip (Xòe Bài 3D & Snap)', 
      tag: 'Không Gian 3D', 
      desc: 'Chữ lật xoay 3D lộn xộn trong không trung rồi lần lượt "khóa cạch" vào hàng',
      icon: '🌀'
    },
    { 
      id: 'echo-ghost', 
      name: 'Echo Ghost Strobe (Bóng Ma Phân Thân)', 
      tag: 'Quang Sai RGB', 
      desc: 'Bắn ra 4 bóng ma đa hướng rồi giật ngược thu hồi chớp nhoáng',
      icon: '💥'
    },
    { 
      id: 'brutalist-giant', 
      name: 'Brutalist Giant (Bất Đối Xứng Cực Hạn)', 
      tag: 'Swiss Poster Art', 
      desc: 'Từ chính khổng lồ choán hết màn hình, từ phụ xếp gọn theo lưới đồ họa',
      icon: '📐'
    },
    { 
      id: 'elastic-spring', 
      name: 'Elastic Spring (Cao Su Kéo Giãn)', 
      tag: 'Vật Lý Đàn Hồi', 
      desc: 'Kéo giãn dọc tỉ lệ như dây thun đàn hồi rồi bật nảy dập dềnh',
      icon: '🌊'
    },
    { 
      id: 'hyper-velocity', 
      name: 'Hyper-Velocity Rush', 
      tag: 'Tốc độ & Rung chấn', 
      desc: 'Lao vút từ vô tận, zoom bùng nổ, phanh gấp rung chấn (Rap, Trap, EDM)',
      icon: '⚡'
    },
    { 
      id: 'liquid-chrome', 
      name: 'Liquid Chrome 3D', 
      tag: 'Tráng gương kim loại', 
      desc: 'Chữ kim loại ánh bạc lấp lánh, vệt sáng quét ngang, lơ lửng bồng bềnh',
      icon: '💎'
    },
    { 
      id: 'film-burn', 
      name: 'Vintage 16mm Film Burn', 
      tag: 'Cháy phim & Đĩa than', 
      desc: 'Vệt cháy phim cam ấm áp, rung máy cơ học 16mm hoài niệm',
      icon: '🎬'
    },
    { 
      id: 'liquid-smoke', 
      name: 'Sfumato Liquid Smoke', 
      tag: 'Loang nở như mực', 
      desc: 'Khói mờ Sfumato, chữ tan biến uyển chuyển giữa khoảng không',
      icon: '🖤'
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 overflow-y-auto text-xs p-4 space-y-6">
      <div className="flex items-center space-x-2 pb-3 border-b border-zinc-900">
        <Wand2 size={16} className="text-emerald-400" />
        <div>
          <h2 className="font-semibold text-zinc-100 text-sm">Art Direction Studio</h2>
          <p className="text-[10px] text-zinc-500">Phá cách không theo lối mòn truyền thống</p>
        </div>
      </div>

      {/* 1. Motion Preset Selection */}
      <div className="space-y-2">
        <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
          <Flame size={14} className="text-amber-400" />
          <span>10 Phong Cách Kinetic Phá Cách</span>
        </label>
        <div className="space-y-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => update('motionPreset', preset.id)}
              className={`w-full p-2.5 rounded-xl border text-left transition relative ${
                options.motionPreset === preset.id
                  ? 'bg-zinc-850 border-emerald-500/80 text-white shadow-lg ring-1 ring-emerald-500/20'
                  : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-zinc-100 flex items-center space-x-1.5">
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 border border-emerald-500/30">
                  {preset.tag}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Curated Ultra Fonts */}
      <div className="space-y-2 pt-2 border-t border-zinc-900">
        <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
          <Type size={14} className="text-indigo-400" />
          <span>Bộ Phông Đỉnh Cao (100% Chuẩn Tiếng Việt)</span>
        </label>
        <div className="space-y-1">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => update('fontFamily', font.id)}
              className={`w-full p-2 rounded-lg border text-left transition flex items-center justify-between ${
                options.fontFamily === font.id
                  ? 'bg-zinc-800 border-zinc-400 text-white shadow-sm'
                  : 'bg-zinc-900/40 border-zinc-800/70 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div>
                <div style={{ fontFamily: `"${font.id}", sans-serif` }} className="text-sm text-zinc-100 font-medium">
                  {font.label}
                </div>
                <div className="text-[9px] text-zinc-500">{font.desc}</div>
              </div>
              <div className="text-right">
                <span style={{ fontFamily: `"${font.id}", sans-serif` }} className="text-xs text-zinc-400 block font-bold">
                  {font.sample}
                </span>
                {options.fontFamily === font.id && (
                  <span className="text-emerald-400 font-mono text-[10px]">✓ Đang chọn</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cinematic Film Effects */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-900">
        <label className="text-zinc-300 font-semibold flex items-center space-x-1.5">
          <Film size={14} className="text-zinc-400" />
          <span>Hiệu Ứng Điện Ảnh (Cinematic Overlays)</span>
        </label>

        {/* Film Burn Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div>
            <div className="font-medium text-zinc-200 text-xs flex items-center space-x-1.5">
              <span>🔥 Vệt Cháy Phim (Film Burn)</span>
            </div>
            <div className="text-[10px] text-zinc-500">Chớp ánh sáng cam ấm khi chuyển câu hát</div>
          </div>
          <input
            type="checkbox"
            checked={options.filmBurnEffect}
            onChange={(e) => update('filmBurnEffect', e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Film Grain Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div>
            <div className="font-medium text-zinc-200 text-xs">Hạt Phim 35mm (Film Grain)</div>
            <div className="text-[10px] text-zinc-500">Tạo chiều sâu chất liệu nhựa phim #000000</div>
          </div>
          <input
            type="checkbox"
            checked={options.enableFilmGrain}
            onChange={(e) => update('enableFilmGrain', e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {/* CRT Scanlines Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div>
            <div className="font-medium text-zinc-200 text-xs flex items-center space-x-1">
              <Tv size={12} />
              <span>Vệt Quét CRT Scanlines</span>
            </div>
            <div className="text-[10px] text-zinc-500">Sọc ngang màn hình tivi analog retro</div>
          </div>
          <input
            type="checkbox"
            checked={options.crtScanlines}
            onChange={(e) => update('crtScanlines', e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Chromatic Aberration Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div>
            <div className="font-medium text-zinc-200 text-xs">Tách Quang Sai RGB (Chromatic)</div>
            <div className="text-[10px] text-zinc-500">Bóng đỏ/xanh cyan siêu nhẹ khi di chuyển</div>
          </div>
          <input
            type="checkbox"
            checked={options.chromaticAberration}
            onChange={(e) => update('chromaticAberration', e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Typography Basics */}
      <div className="space-y-3 pt-2 border-t border-zinc-900">
        <div>
          <div className="flex justify-between text-zinc-400 mb-1">
            <span>Cỡ Chữ (Font Size)</span>
            <span className="font-mono text-zinc-200">{options.fontSize}px</span>
          </div>
          <input
            type="range"
            min={22}
            max={64}
            value={options.fontSize}
            onChange={(e) => update('fontSize', Number(e.target.value))}
            className="w-full accent-white h-1 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-zinc-400 mb-1">
            <span>Giãn Ký Tự (Letter Spacing)</span>
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
          <span className="text-zinc-400 text-[11px] w-20">Kiểu chữ:</span>
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
