import React, { useState } from 'react';
import { X, Download, Film, CheckCircle, AlertCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { LyricLine, StylingOptions } from '../types';
import { formatTime } from '../utils/formatters';

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

    // Hàm vẽ chuyển động nghệ thuật cho 10 Presets trên Canvas 2D
    const drawKineticLyrics = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      line: LyricLine,
      time: number
    ) => {
      const elapsed = Math.max(0, time - line.startTime);
      const baseFontSize = Math.round(options.fontSize * (width / 420));
      const rawWords = line.text.trim().split(/\s+/).filter(Boolean);
      if (rawWords.length === 0) return;

      const words = rawWords.map((w) => {
        if (options.textCase === 'uppercase') return w.toUpperCase();
        if (options.textCase === 'lowercase') return w.toLowerCase();
        return w;
      });

      const preset = options.motionPreset;
      const easeOutBack = (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Thiết lập phát sáng Glow
      if (options.glowEffect) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = options.glowIntensity * 25;
      } else {
        ctx.shadowBlur = 0;
      }

      // Đo độ rộng chữ và tự động co giãn nếu câu dài
      ctx.font = `${options.fontWeight} ${baseFontSize}px "${options.fontFamily}", sans-serif`;
      const spaceWidth = ctx.measureText(' ').width * 1.4;
      const wordWidths = words.map((w) => ctx.measureText(w).width);
      const totalSentenceWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * spaceWidth;

      const maxSafeWidth = width * 0.88;
      const scaleRatio = totalSentenceWidth > maxSafeWidth ? maxSafeWidth / totalSentenceWidth : 1;
      const effectiveFontSize = baseFontSize * scaleRatio;
      ctx.font = `${options.fontWeight} ${effectiveFontSize}px "${options.fontFamily}", sans-serif`;

      const finalSpaceWidth = ctx.measureText(' ').width * 1.2;
      const finalWordWidths = words.map((w) => ctx.measureText(w).width);
      const finalTotalWidth = finalWordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * finalSpaceWidth;

      let currentX = (width - finalTotalWidth) / 2;
      const centerY = height / 2;

      // 🌟 1. Shatter & Assemble (Tụ lại từ 4 góc)
      if (preset === 'shatter-assemble') {
        words.forEach((word, idx) => {
          const wWidth = finalWordWidths[idx];
          const targetWordCenterX = currentX + wWidth / 2;
          const angle = (idx / words.length) * Math.PI * 2;
          const initialDist = 320 * (width / 420);
          const initX = targetWordCenterX + Math.cos(angle) * initialDist;
          const initY = centerY + Math.sin(angle) * initialDist;
          const initRotate = (idx % 2 === 0 ? -1 : 1) * 0.45;

          const p = Math.min(1, Math.max(0, (elapsed - idx * 0.04) / 0.42));
          const ease = easeOutBack(p);

          const wordX = initX + (targetWordCenterX - initX) * ease;
          const wordY = initY + (centerY - initY) * ease;
          const wordRotate = initRotate * (1 - ease);
          const wordScale = 2.0 - 1.0 * ease;

          ctx.save();
          ctx.translate(wordX, wordY);
          ctx.rotate(wordRotate);
          ctx.scale(wordScale, wordScale);
          ctx.fillStyle = options.textColor;
          ctx.fillText(word, 0, 0);
          ctx.restore();

          currentX += wWidth + finalSpaceWidth;
        });
      }
      // 🌟 2. Cross Drift (Lao vào nhau từ 2 bên)
      else if (preset === 'cross-drift') {
        words.forEach((word, idx) => {
          const wWidth = finalWordWidths[idx];
          const targetWordCenterX = currentX + wWidth / 2;
          const isLeft = idx % 2 === 0;
          const initOffset = isLeft ? -width * 0.65 : width * 0.65;

          const p = Math.min(1, Math.max(0, (elapsed - idx * 0.05) / 0.45));
          const ease = easeOutBack(p);

          const wordX = targetWordCenterX + initOffset * (1 - ease);
          const wordScaleX = 1 + 0.8 * (1 - ease);

          ctx.save();
          ctx.translate(wordX, centerY);
          ctx.scale(wordScaleX, 1);
          ctx.fillStyle = options.textColor;
          ctx.fillText(word, 0, 0);
          ctx.restore();

          currentX += wWidth + finalSpaceWidth;
        });
      }
      // 🌟 3. 3D Spatial Flip (Lật xoay 3D)
      else if (preset === 'card-flip-3d') {
        words.forEach((word, idx) => {
          const wWidth = finalWordWidths[idx];
          const targetWordCenterX = currentX + wWidth / 2;
          const p = Math.min(1, Math.max(0, (elapsed - idx * 0.06) / 0.48));
          const ease = easeOutBack(p);
          const flipCos = Math.cos((1 - ease) * (Math.PI / 2.1));
          const wordScale = 0.6 + 0.4 * ease;

          ctx.save();
          ctx.translate(targetWordCenterX, centerY);
          ctx.scale(Math.max(0.01, flipCos * wordScale), wordScale);
          ctx.fillStyle = options.textColor;
          ctx.fillText(word, 0, 0);
          ctx.restore();

          currentX += wWidth + finalSpaceWidth;
        });
      }
      // 🌟 4. Echo Ghost (Quang sai RGB)
      else if (preset === 'echo-ghost') {
        const p = Math.min(1, elapsed / 0.35);
        const ease = easeOutCubic(p);
        const ghostOffset = (1 - ease) * 35;

        // Bóng Cyan
        ctx.save();
        ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
        ctx.fillText(line.text, width / 2 - ghostOffset, centerY - ghostOffset * 0.6);
        ctx.restore();

        // Bóng Red
        ctx.save();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.fillText(line.text, width / 2 + ghostOffset, centerY + ghostOffset * 0.6);
        ctx.restore();

        // Chữ chính
        ctx.fillStyle = options.textColor;
        ctx.fillText(line.text, width / 2, centerY);
      }
      // 🌟 5. Brutalist Giant (Hero Word to khổng lồ)
      else if (preset === 'brutalist-giant') {
        let heroIdx = Math.floor(words.length / 2);
        let maxLen = 0;
        words.forEach((w, i) => {
          if (w.length > maxLen) {
            maxLen = w.length;
            heroIdx = i;
          }
        });

        const heroWord = words[heroIdx];
        const secWords = words.filter((_, i) => i !== heroIdx).join(' ');

        const p = Math.min(1, elapsed / 0.45);
        const ease = easeOutBack(p);

        // Hero Word to khổng lồ
        ctx.save();
        const heroFontSize = effectiveFontSize * 1.9 * ease;
        ctx.font = `900 ${heroFontSize}px "${options.fontFamily}", sans-serif`;
        ctx.fillStyle = options.textColor;
        ctx.translate(width / 2, centerY - (secWords ? heroFontSize * 0.25 : 0));
        ctx.rotate(-0.035 * (1 - ease));
        ctx.fillText(heroWord, 0, 0);
        ctx.restore();

        // Secondary words
        if (secWords) {
          ctx.save();
          const secFontSize = effectiveFontSize * 0.85;
          ctx.font = `700 ${secFontSize}px "${options.fontFamily}", sans-serif`;
          ctx.fillStyle = 'rgba(212, 212, 216, 0.85)';
          ctx.fillText(secWords, width / 2, centerY + heroFontSize * 0.65);
          ctx.restore();
        }
      }
      // 🌟 6. Elastic Spring (Nảy lò xo)
      else if (preset === 'elastic-spring') {
        const scaleY = 1 + 1.2 * Math.cos(elapsed * 14) * Math.exp(-elapsed * 4.5);
        const scaleX = 1 / Math.sqrt(Math.max(0.2, scaleY));

        ctx.save();
        ctx.translate(width / 2, centerY);
        ctx.scale(scaleX, scaleY);
        ctx.fillStyle = options.textColor;
        ctx.fillText(line.text, 0, 0);
        ctx.restore();
      }
      // 🌟 7. Hyper-Velocity (Lao vút phanh gấp)
      else if (preset === 'hyper-velocity') {
        const p = Math.min(1, elapsed / 0.35);
        const ease = easeOutCubic(p);
        const scale = 2.5 - 1.5 * ease;

        ctx.save();
        ctx.translate(width / 2, centerY);
        ctx.scale(scale, scale);
        ctx.fillStyle = options.textColor;
        ctx.fillText(line.text, 0, 0);
        ctx.restore();
      }
      // 🌟 8. Liquid Chrome 3D (Ánh bạc kim loại)
      else if (preset === 'liquid-chrome') {
        const p = Math.min(1, elapsed / 0.6);
        const ease = easeOutCubic(p);
        const yOffset = (1 - ease) * 35;

        ctx.save();
        ctx.translate(width / 2, centerY - yOffset);
        const grad = ctx.createLinearGradient(-finalTotalWidth / 2, -effectiveFontSize, finalTotalWidth / 2, effectiveFontSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, '#94a3b8');
        grad.addColorStop(0.65, '#ffffff');
        grad.addColorStop(0.85, '#cbd5e1');
        grad.addColorStop(1, '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillText(line.text, 0, 0);
        ctx.restore();
      }
      // 🌟 9. Film Fade (Vàng kem cổ điển)
      else if (preset === 'film-burn') {
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 2;

        ctx.save();
        ctx.fillStyle = '#fef3c7';
        ctx.shadowColor = 'rgba(251, 146, 60, 0.6)';
        ctx.shadowBlur = 18;
        ctx.translate(width / 2 + jitterX, centerY + jitterY);
        ctx.fillText(line.text, 0, 0);
        ctx.restore();
      }
      // 🌟 10. Liquid Smoke (Khói mờ tan chảy)
      else {
        const alpha = Math.min(1, elapsed * 1.8);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = options.textColor;
        ctx.fillText(line.text, width / 2, centerY);
        ctx.restore();
      }

      ctx.restore();
    };

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

      // 1. Nền đen thuần khiết #000000
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 2. Tìm câu lyric hiện tại: kéo dài tới khi câu kế tiếp xuất hiện
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

      // 3. Vẽ hiệu ứng chuyển động tương ứng
      if (current) {
        drawKineticLyrics(ctx, width, height, current, currentTime);
      }

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
