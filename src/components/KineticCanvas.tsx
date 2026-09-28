import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { LyricLine, StylingOptions } from '../types';
import { renderKineticFrame, getCanvasDimensions } from '../utils/kineticRenderer';

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying?: boolean;
  getCurrentTime?: () => number;
  options: StylingOptions;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}

const KineticCanvasComponent: React.FC<Props> = ({
  lyrics,
  currentTime,
  isPlaying = false,
  getCurrentTime,
  options,
  canvasRef: externalCanvasRef,
  className = '',
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasRef = externalCanvasRef || internalCanvasRef;

  // Dùng độ phân giải Preview Retina tối ưu (540x960) siêu mượt, loại bỏ lag GPU
  const dims = getCanvasDimensions(options.aspectRatio, true);

  // Danh sách lyrics đã sync và sắp xếp thời gian (chỉ tính lại khi lyrics thay đổi)
  const sortedLyrics = useMemo(() => {
    return [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);
  }, [lyrics]);

  // Tìm câu hiện tại đang phát tại thời điểm time
  const findActiveLine = useCallback((time: number): LyricLine | null => {
    for (let i = 0; i < sortedLyrics.length; i++) {
      const line = sortedLyrics[i];
      const nextLine = sortedLyrics[i + 1];
      const effectiveEnd = nextLine ? nextLine.startTime : (line.endTime > line.startTime ? line.endTime : line.startTime + 10);
      if (time >= line.startTime && time < effectiveEnd) {
        return line;
      }
    }
    return null;
  }, [sortedLyrics]);

  // Hàm vẽ 1 frame tại thời điểm time
  const drawFrame = useCallback((time: number) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const line = findActiveLine(time);
    renderKineticFrame(
      ctx,
      dims.width,
      dims.height,
      line,
      time,
      options,
      options.showSafeZone
    );
  }, [activeCanvasRef, dims.width, dims.height, findActiveLine, options]);

  // Vòng lặp requestAnimationFrame độc lập khi đang Play:
  // - Khi isPlaying = true: chạy vòng lặp 60fps/120fps độc lập KHÔNG phụ thuộc vào React re-render!
  // - Khi isPlaying = false: vẽ ngay lập tức tại thời điểm currentTime khi pause hoặc tua timeline
  useEffect(() => {
    if (!isPlaying) {
      drawFrame(currentTime);
      return;
    }

    let animId: number;
    const renderLoop = () => {
      const nowTime = getCurrentTime ? getCurrentTime() : currentTime;
      drawFrame(nowTime);
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTime, drawFrame, getCurrentTime]);

  // Tỷ lệ aspect CSS class cố định khung hình
  const aspectClass = useMemo(() => {
    switch (options.aspectRatio) {
      case '9:16':
        return 'h-full aspect-[9/16] w-auto max-h-full max-w-full';
      case '1:1':
        return 'h-full aspect-square w-auto max-h-full max-w-full';
      case '16:9':
        return 'w-full aspect-[16/9] h-auto max-w-full max-h-full';
    }
  }, [options.aspectRatio]);

  return (
    <div className={`relative flex items-center justify-center w-full h-full p-2 overflow-hidden select-none ${className}`}>
      {/* 540x960 Retina Master Canvas - Hiển thị tỷ lệ thu phóng chuẩn 100% theo GPU */}
      <canvas
        ref={activeCanvasRef}
        id="sfumato-render-canvas"
        width={dims.width}
        height={dims.height}
        className={`${aspectClass} object-contain rounded-2xl shadow-2xl border border-zinc-800/80 bg-black shrink-0`}
        style={{ backgroundColor: '#000000' }}
      />
    </div>
  );
};

// React.memo tối ưu: Khi đang Play, KHÔNG re-render KineticCanvas vì RAF loop tự chạy 60fps
export const KineticCanvas = React.memo(KineticCanvasComponent, (prevProps, nextProps) => {
  // Khi cả hai đều đang play: chỉ re-render nếu options, lyrics hoặc styling đổi (bỏ qua currentTime)
  if (prevProps.isPlaying && nextProps.isPlaying) {
    if (
      prevProps.options === nextProps.options &&
      prevProps.lyrics === nextProps.lyrics &&
      prevProps.className === nextProps.className
    ) {
      return true; // Skip React re-render
    }
  }

  // Khi đang pause: re-render nếu currentTime đổi (khi scrub timeline) hoặc bất kỳ prop nào đổi
  return (
    prevProps.currentTime === nextProps.currentTime &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.options === nextProps.options &&
    prevProps.lyrics === nextProps.lyrics &&
    prevProps.className === nextProps.className
  );
});
