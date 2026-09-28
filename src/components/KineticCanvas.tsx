import React, { useRef, useEffect, useMemo } from 'react';
import { LyricLine, StylingOptions } from '../types';
import { renderKineticFrame, getCanvasDimensions } from '../utils/kineticRenderer';

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  options: StylingOptions;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}

export const KineticCanvas: React.FC<Props> = ({
  lyrics,
  currentTime,
  options,
  canvasRef: externalCanvasRef,
  className = '',
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeCanvasRef = externalCanvasRef || internalCanvasRef;

  // Tìm câu hiện tại đang phát
  const currentLine = useMemo(() => {
    const sorted = [...lyrics].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);
    for (let i = 0; i < sorted.length; i++) {
      const line = sorted[i];
      const nextLine = sorted[i + 1];
      const effectiveEnd = nextLine ? nextLine.startTime : (line.endTime > line.startTime ? line.endTime : line.startTime + 10);
      if (currentTime >= line.startTime && currentTime < effectiveEnd) {
        return line;
      }
    }
    return null;
  }, [lyrics, currentTime]);

  // Dùng độ phân giải Preview Retina tối ưu (540x960) siêu mượt, loại bỏ lag GPU
  const dims = getCanvasDimensions(options.aspectRatio, true);

  // Vẽ chuẩn xác 100% bằng canvas engine chung
  useEffect(() => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderKineticFrame(
      ctx,
      dims.width,
      dims.height,
      currentLine,
      currentTime,
      options,
      options.showSafeZone
    );
  }, [currentLine, currentTime, options, dims, activeCanvasRef]);

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
      {/* 1080p Master Canvas - Hiển thị tỷ lệ thu phóng chuẩn 100% theo GPU */}
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
