import React, { useState } from 'react';
import { X, Download, Film, CheckCircle, AlertCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { LyricLine, StylingOptions } from '../types';
import { formatTime } from '../utils/formatters';
import { renderKineticFrame } from '../utils/kineticRenderer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lyrics: LyricLine[];
  options: StylingOptions;
  duration: number;
  audioUrl?: string | null;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lyrics,
  options,
  duration,
  audioUrl,
}) => {
  const [fps, setFps] = useState<30 | 60>(60);
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderCurrentSec, setRenderCurrentSec] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const startExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportedUrl(null);

    // Đảm bảo font chữ đã được nạp hoàn chỉnh vào document
    try {
      await document.fonts.ready;
    } catch {
      // Bỏ qua nếu môi trường không hỗ trợ font API
    }

    // Kích thước xuất
    let width = 1080;
    let height = 1920;
    if (options.aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (options.aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    if (resolution === '720p') {
      width = Math.round(width * (720 / 1080));
      height = Math.round(height * (720 / 1080));
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const stream = canvas.captureStream(fps);

    // Chuẩn bị audio track nếu bật kèm nhạc
    let audioElement: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let audioSource: MediaElementAudioSourceNode | null = null;

    if (includeAudio && audioUrl) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioElement = new Audio(audioUrl);
        audioElement.crossOrigin = 'anonymous';
        audioElement.currentTime = 0;

        audioSource = audioCtx.createMediaElementSource(audioElement);
        const dest = audioCtx.createMediaStreamDestination();
        audioSource.connect(dest);

        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) {
          stream.addTrack(audioTrack);
        }
      } catch (err) {
        console.warn('Could not attach audio track:', err);
      }
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
      videoBitsPerSecond: 12000000, // 12 Mbps
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setIsExporting(false);
      setProgress(100);

      if (audioElement) {
        audioElement.pause();
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };

    mediaRecorder.start();
    if (audioElement) {
      audioElement.play().catch(() => {});
    }

    // Chuẩn xác 100% thời gian: dùng requestAnimationFrame đồng bộ theo Audio/Wall-clock
    const totalDuration = Math.max(duration, 5);
    const startExportTime = performance.now();
    let animFrameId: number;
    let isTerminated = false;

    const renderLoop = () => {
      if (isTerminated) return;

      // Tính thời gian hiện tại chính xác tuyệt đối theo Audio Element (hoặc clock nếu câm)
      let currentTime = 0;
      if (audioElement && includeAudio) {
        currentTime = audioElement.currentTime;
      } else {
        currentTime = (performance.now() - startExportTime) / 1000;
      }

      const pct = Math.min(99, Math.round((currentTime / totalDuration) * 100));
      setProgress(pct);
      setRenderCurrentSec(currentTime);

      // 1. Tìm câu lyric hiện tại: kéo dài tới khi câu kế tiếp xuất hiện
      const sorted = [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);
      let current: LyricLine | null = null;
      for (let i = 0; i < sorted.length; i++) {
        const l = sorted[i];
        const nextLine = sorted[i + 1];
        const effectiveEnd = nextLine ? nextLine.startTime : (l.endTime > l.startTime ? l.endTime : l.startTime + 10);
        if (currentTime >= l.startTime && currentTime < effectiveEnd) {
          current = l;
          break;
        }
      }

      // 2. Vẽ frame chuẩn xác 100% bằng engine thống nhất renderKineticFrame
      renderKineticFrame(ctx, width, height, sorted, currentTime, options, false);

      // 4. Kiểm tra điều kiện kết thúc chính xác đúng 100% thời lượng bài hát
      const hasEnded = audioElement && includeAudio 
        ? (audioElement.ended || currentTime >= totalDuration)
        : (currentTime >= totalDuration);

      if (!hasEnded) {
        animFrameId = requestAnimationFrame(renderLoop);
      } else {
        isTerminated = true;
        cancelAnimationFrame(animFrameId);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }
    };

    // Bắt đầu vòng lặp render đồng bộ
    animFrameId = requestAnimationFrame(renderLoop);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center space-x-2">
            <Film size={18} className="text-white" />
            <h3 className="font-semibold text-zinc-100">Xuất Video Nền Đen 60fps</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Audio Option Notice */}
        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {includeAudio && audioUrl ? (
                <Volume2 size={16} className="text-emerald-400" />
              ) : (
                <VolumeX size={16} className="text-zinc-500" />
              )}
              <span className="font-semibold text-zinc-200">Kèm âm thanh bài hát vào video</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeAudio && !!audioUrl}
                disabled={!audioUrl || isExporting}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-disabled:opacity-40"></div>
            </label>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {audioUrl ? (
              includeAudio ? (
                <span className="text-emerald-400/90">
                  ✓ <b>Có âm thanh:</b> Video xuất ra sẽ lồng sẵn nhạc/vocal đầy đủ, sẵn sàng để xem ngay hoặc đăng trực tiếp lên mạng xã hội.
                </span>
              ) : (
                <span className="text-zinc-400">
                  ○ <b>Không có âm thanh (Câm):</b> Chỉ xuất video chữ nền đen để bạn đưa vào CapCut hòa trộn mà không bị trùng lặp với track nhạc gốc.
                </span>
              )
            ) : (
              <span className="text-amber-400/80">
                ⚠ Bạn chưa tải file nhạc lên. Video xuất ra sẽ là video câm (chỉ có chữ chuyển động).
              </span>
            )}
          </p>
        </div>

        {/* Export Resolution & FPS */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-zinc-400 mb-1.5 block">Độ phân giải</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as any)}
              disabled={isExporting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="1080p">1080p (Full HD Sắc nét)</option>
              <option value="720p">720p (Nhanh nhẹ)</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 mb-1.5 block">Tốc độ khung hình (FPS)</label>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value) as any)}
              disabled={isExporting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="60">60 FPS (Siêu mượt chuẩn Kinetic)</option>
              <option value="30">30 FPS (Tiết kiệm dung lượng)</option>
            </select>
          </div>
        </div>

        {/* Progress or Actions */}
        {isExporting ? (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  Đang kết xuất {includeAudio && audioUrl ? 'video & nhạc' : 'video'}:{' '}
                  <b className="text-white font-mono">{formatTime(renderCurrentSec)}</b> / {formatTime(Math.max(duration, 5))}
                </span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : exportedUrl ? (
          <div className="flex flex-col space-y-3 pt-2">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>
                Kết xuất hoàn tất ({includeAudio && audioUrl ? 'Có âm thanh' : 'Video câm / Mute'})!
              </span>
            </div>

            <a
              href={exportedUrl}
              download={`sfumato_lyrics_black_${options.aspectRatio.replace(':', 'x')}_60fps.webm`}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <Download size={14} />
              <span>Tải Video Nền Đen Về Máy</span>
            </a>
          </div>
        ) : (
          <button
            onClick={startExport}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <Film size={14} />
            <span>Bắt Đầu Kết Xuất Video</span>
          </button>
        )}
      </div>
    </div>
  );
};
