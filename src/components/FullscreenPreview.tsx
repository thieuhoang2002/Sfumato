import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { LyricLine, StylingOptions } from '../types';
import { KineticCanvas } from './KineticCanvas';
import { formatTime } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lyrics: LyricLine[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  options: StylingOptions;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

export const FullscreenPreview: React.FC<Props> = ({
  isOpen,
  onClose,
  lyrics,
  currentTime,
  duration,
  isPlaying,
  options,
  onTogglePlay,
  onSeek,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lắng nghe phím ESC hoặc phím F
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        onClose();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key.toLowerCase() === 'f') {
        toggleNativeFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onTogglePlay, onClose]);

  // Tự động ẩn thanh điều khiển sau 3 giây không di chuột
  useEffect(() => {
    if (!isOpen) return;

    const resetControlsTimer = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    resetControlsTimer();
    window.addEventListener('mousemove', resetControlsTimer);
    return () => {
      window.removeEventListener('mousemove', resetControlsTimer);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isOpen, isPlaying]);

  // Bật / tắt Fullscreen native của trình duyệt
  const toggleNativeFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsNativeFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsNativeFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Native fullscreen not permitted:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* 1. Nút Thoát & Thông tin nhanh góc trên */}
      <div
        className={`absolute top-0 inset-x-0 p-6 flex justify-between items-center z-30 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur text-xs font-mono text-zinc-300">
            PREVIEW THỰC TẾ • {options.aspectRatio} • {options.fontFamily}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            (Bấm phím <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-300">ESC</kbd> để thoát)
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition backdrop-blur"
            title={isNativeFullscreen ? 'Thu nhỏ cửa sổ' : 'Tràn toàn màn hình máy tính (F)'}
          >
            {isNativeFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900/80 hover:bg-red-500/20 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition backdrop-blur"
            title="Đóng chế độ xem toàn màn hình (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. Khung Canvas Preview lớn nhất có thể theo tỷ lệ */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
        <KineticCanvas
          lyrics={lyrics}
          currentTime={currentTime}
          options={options}
        />
      </div>

      {/* 3. Thanh điều khiển đáy (Floating Player Controls) */}
      <div
        className={`absolute bottom-6 inset-x-0 mx-auto max-w-xl px-4 z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex flex-col space-y-2">
          {/* Progress Slider */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-zinc-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={0.05}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="flex-1 accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono text-zinc-500 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onSeek(0)}
              className="text-zinc-400 hover:text-white transition p-1.5 rounded-lg hover:bg-zinc-800"
              title="Phát lại từ đầu"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={onTogglePlay}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center space-x-2 hover:bg-zinc-200 transition shadow-lg"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-black" />}
              <span>{isPlaying ? 'Tạm dừng' : 'Phát nhạc'}</span>
            </button>

            <div className="text-[11px] font-mono text-zinc-400">
              {options.motionPreset.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
