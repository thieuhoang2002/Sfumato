import React, { useState, useRef } from 'react';
import { X, Download, Film, CheckCircle, Volume2, VolumeX, Play } from 'lucide-react';
import { LyricLine, StylingOptions } from '../types';
import { formatTime } from '../utils/formatters';
import { renderKineticFrame } from '../utils/kineticRenderer';
import fixWebmDuration from 'fix-webm-duration';

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
  const isMp4Supported = typeof MediaRecorder !== 'undefined' && (
    MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2') ||
    MediaRecorder.isTypeSupported('video/mp4;codecs=avc1') ||
    MediaRecorder.isTypeSupported('video/mp4')
  );

  const [fps, setFps] = useState<30 | 60>(60);
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [exportFormat, setExportFormat] = useState<'mp4' | 'webm'>(() => isMp4Supported ? 'mp4' : 'webm');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderCurrentSec, setRenderCurrentSec] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [exportedFormat, setExportedFormat] = useState<'mp4' | 'webm'>('mp4');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const maxLyricTime = lyrics.length > 0
    ? Math.max(...lyrics.map((l) => (l.endTime > l.startTime ? l.endTime : l.startTime + 3.5)))
    : 0;
  const validDuration = typeof duration === 'number' && !isNaN(duration) && duration > 0 ? duration : 0;
  const totalDuration = Math.max(validDuration, maxLyricTime, 5);

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

    // Kích thước xuất video
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
    const videoTrack = stream.getVideoTracks()[0];

    // Chuẩn bị audio track nếu bật kèm nhạc
    let audioElement: HTMLAudioElement | null = null;
    let audioCtx: AudioContext | null = null;
    let audioSource: MediaElementAudioSourceNode | null = null;

    if (includeAudio && audioUrl) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        audioElement = new Audio(audioUrl);
        if (!audioUrl.startsWith('blob:')) {
          audioElement.crossOrigin = 'anonymous';
        }
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

    // Lựa chọn codec theo định dạng người dùng chọn (MP4 hoặc WebM)
    let selectedMimeType = '';
    let actualExt: 'mp4' | 'webm' = exportFormat;

    if (exportFormat === 'mp4') {
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) {
        selectedMimeType = 'video/mp4;codecs=avc1,mp4a.40.2';
      } else if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        selectedMimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        selectedMimeType = 'video/mp4';
      } else {
        // Fallback sang webm nếu trình duyệt không hỗ trợ mp4
        actualExt = 'webm';
        selectedMimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm';
      }
    } else {
      actualExt = 'webm';
      selectedMimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType || undefined,
      videoBitsPerSecond: 14000000, // 14 Mbps cho hình ảnh sắc nét
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      let finalBlob = new Blob(chunks, { type: selectedMimeType || 'video/webm' });
      if (actualExt === 'webm') {
        try {
          finalBlob = await fixWebmDuration(finalBlob, totalDuration * 1000, { logger: false });
        } catch (err) {
          console.warn('Could not patch webm duration:', err);
        }
      }
      const url = URL.createObjectURL(finalBlob);
      setExportedUrl(url);
      setExportedFormat(actualExt);
      setIsExporting(false);
      setProgress(100);

      if (audioElement) {
        audioElement.pause();
      }
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };

    mediaRecorder.start(250);
    if (audioElement) {
      audioElement.play().catch((err) => {
        console.warn('Audio play failed in export:', err);
      });
    }

    const startExportTime = performance.now();
    let animFrameId: number;
    let isTerminated = false;

    // Kích thước preview canvas
    const pW = options.aspectRatio === '9:16' ? 270 : options.aspectRatio === '1:1' ? 270 : 360;
    const pH = options.aspectRatio === '9:16' ? 480 : options.aspectRatio === '1:1' ? 270 : 202;

    const renderLoop = () => {
      if (isTerminated) return;

      const wallClockTime = (performance.now() - startExportTime) / 1000;
      let currentTime = wallClockTime;
      if (audioElement && includeAudio && !audioElement.paused && !audioElement.ended && audioElement.currentTime > 0) {
        currentTime = audioElement.currentTime;
      }

      const pct = Math.min(99, Math.round((currentTime / totalDuration) * 100));
      setProgress(pct);
      setRenderCurrentSec(currentTime);

      // 1. Sắp xếp danh sách lời bài hát đã đồng bộ
      const sorted = [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);

      // 2. Vẽ frame chuẩn xác 100% bằng engine thống nhất renderKineticFrame
      renderKineticFrame(ctx, width, height, sorted, currentTime, options, false);

      // 3. Yêu cầu track ghi nhận frame mới
      try {
        if (videoTrack && typeof (videoTrack as any).requestFrame === 'function') {
          (videoTrack as any).requestFrame();
        }
      } catch {}

      // 4. Cập nhật preview canvas đang hiển thị trong modal
      if (previewCanvasRef.current) {
        const pCtx = previewCanvasRef.current.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(canvas, 0, 0, pW, pH);
        }
      }

      // 5. Kiểm tra điều kiện kết thúc: chỉ kết thúc khi đã hoàn thành trọn vẹn totalDuration
      const hasEnded = currentTime >= totalDuration;

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
            <h3 className="font-semibold text-zinc-100">Xuất Video Terminal / IDE Code</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-zinc-500 hover:text-zinc-200 transition disabled:opacity-30"
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

        {/* Export Resolution & FPS & Format */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="text-zinc-400 mb-1.5 block">Định dạng file</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              disabled={isExporting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
            >
              {isMp4Supported && (
                <option value="mp4">MP4 (Chuẩn Windows/CapCut)</option>
              )}
              <option value="webm">WebM (VP9 Sắc nét)</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 mb-1.5 block">Độ phân giải</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as any)}
              disabled={isExporting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="1080p">1080p (Sắc nét)</option>
              <option value="720p">720p (Nhanh nhẹ)</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 mb-1.5 block">Khung hình (FPS)</label>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value) as any)}
              disabled={isExporting}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="60">60 FPS (Siêu mượt)</option>
              <option value="30">30 FPS (Nhẹ hơn)</option>
            </select>
          </div>
        </div>

        {/* Live Exporting Progress Preview */}
        {isExporting && (
          <div className="space-y-3 pt-1">
            <div className="relative rounded-xl overflow-hidden bg-black border border-zinc-800 p-2 flex flex-col items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                width={options.aspectRatio === '9:16' ? 270 : options.aspectRatio === '1:1' ? 270 : 360}
                height={options.aspectRatio === '9:16' ? 480 : options.aspectRatio === '1:1' ? 270 : 202}
                className="rounded-lg object-contain max-h-[220px] shadow-lg border border-zinc-900"
              />
              <span className="text-[10px] text-zinc-500 font-mono mt-1.5 animate-pulse">
                ● Đang ghi hình trực tiếp frame-by-frame...
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    Đang kết xuất {includeAudio && audioUrl ? 'video & nhạc' : 'video'}:{' '}
                    <b className="text-white font-mono">{formatTime(renderCurrentSec)}</b> / {formatTime(totalDuration)}
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
          </div>
        )}

        {/* Exported Result View with in-modal Video Player */}
        {!isExporting && exportedUrl ? (
          <div className="flex flex-col space-y-3 pt-1">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>
                Kết xuất hoàn tất ({totalDuration.toFixed(1)}s, định dạng {exportedFormat.toUpperCase()})!
              </span>
            </div>

            {/* Trình phát xem thử video trực tiếp ngay trong trình duyệt */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-zinc-800 p-1 flex items-center justify-center shadow-inner">
              <video
                src={exportedUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[220px] w-auto rounded-lg object-contain mx-auto"
              />
            </div>

            <div className="text-[11px] text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed">
              💡 <b>Xem thử:</b> Bạn có thể bấm Play ngay trong khung trên để xem toàn bộ video {totalDuration.toFixed(0)}s. Video chuẩn {exportedFormat.toUpperCase()} sẵn sàng để nhập vào CapCut hòa trộn (Screen) hoặc chia sẻ ngay!
            </div>

            <a
              href={exportedUrl}
              download={`sfumato_lyrics_black_${options.aspectRatio.replace(':', 'x')}_60fps.${exportedFormat}`}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <Download size={14} />
              <span>Tải Video ({exportedFormat.toUpperCase()}) Về Máy</span>
            </a>
          </div>
        ) : !isExporting && (
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
