import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Upload, Music } from 'lucide-react';
import { formatTime } from '../utils/formatters';
import { LyricLine } from '../types';

interface Props {
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  lyrics: LyricLine[];
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onUploadAudio: (file: File) => void;
  onReset: () => void;
}

const WaveformTimelineComponent: React.FC<Props> = ({
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  lyrics,
  onTogglePlay,
  onSeek,
  onUploadAudio,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pos * duration);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadAudio(file);
    }
  };

  return (
    <div className="bg-zinc-950 border-t border-zinc-900 px-6 py-4 flex flex-col space-y-3 z-30">
      {/* Top bar with audio status & upload */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            <Upload size={13} />
            <span>{audioUrl ? 'Đổi File Nhạc / Vocal' : 'Tải File Nhạc (MP3, WAV)'}</span>
          </button>

          {audioUrl && (
            <span className="text-zinc-500 font-mono text-[11px] flex items-center space-x-1.5">
              <Music size={12} className="text-zinc-400" />
              <span>Sẵn sàng phát</span>
            </span>
          )}
        </div>

        {/* Time display */}
        <div className="font-mono text-zinc-400 text-xs">
          <span className="text-zinc-100 font-semibold">{formatTime(currentTime)}</span>
          <span className="text-zinc-600"> / {formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Timeline bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="relative h-7 bg-zinc-900/90 rounded-md cursor-pointer overflow-hidden border border-zinc-800/80 group"
      >
        {/* Waveform fake visualization bars for aesthetic */}
        <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none opacity-20">
          {Array.from({ length: 64 }).map((_, i) => {
            const height = 20 + Math.sin(i * 0.4) * 15 + Math.cos(i * 0.8) * 10;
            return (
              <div
                key={i}
                className="w-1 bg-white rounded-full transition-all"
                style={{ height: `${Math.max(15, height)}%` }}
              />
            );
          })}
        </div>

        {/* Progress fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-zinc-700/50 border-r-2 border-white pointer-events-none transition-all duration-75"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />

        {/* Lyric markers */}
        {lyrics.map((line) => {
          if (!line.synced || duration === 0) return null;
          const left = (line.startTime / duration) * 100;
          return (
            <div
              key={line.id}
              className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/80 pointer-events-none"
              style={{ left: `${left}%` }}
              title={`[${formatTime(line.startTime)}] ${line.text}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-[2px] mt-0.5" />
            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onTogglePlay}
            disabled={!audioUrl}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              audioUrl
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} className="ml-0.5" fill="black" />}
          </button>

          <button
            onClick={onReset}
            disabled={!audioUrl}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition disabled:opacity-40"
            title="Quay lại từ đầu"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Sync hint */}
        <div className="text-zinc-500 text-[11px] font-mono flex items-center space-x-1.5">
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Space</span>
          <span>để Phát / Tạm dừng hoặc Gõ nhịp Tap-to-Sync</span>
        </div>
      </div>
    </div>
  );
};

export const WaveformTimeline = React.memo(WaveformTimelineComponent);
