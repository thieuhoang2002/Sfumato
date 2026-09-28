import React, { useMemo, useRef, useState, useEffect } from 'react';
import { LyricLine, StylingOptions, AspectRatio } from '../types';
import { THEMES } from '../utils/themePresets';
import { formatAllCodeLines, FormattedCodeLine } from '../utils/codeLayout';

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  options: StylingOptions;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

const VIRTUAL_DIMS: Record<AspectRatio, { width: number; height: number }> = {
  '9:16': { width: 360, height: 640 },
  '1:1': { width: 540, height: 540 },
  '16:9': { width: 640, height: 360 },
};

export const KineticCanvas: React.FC<Props> = ({
  lyrics,
  currentTime,
  options,
  canvasRef: externalCanvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalCanvasRef = useRef<HTMLDivElement>(null);
  const activeCanvasRef = externalCanvasRef || internalCanvasRef;
  const [scale, setScale] = useState(1);
  const [cursorVisible, setCursorVisible] = useState(true);

  const virtualDims = VIRTUAL_DIMS[options.aspectRatio];
  const theme = THEMES[options.theme] || THEMES['vscode-dark'];

  // Blinking cursor timer (530ms standard terminal blink)
  useEffect(() => {
    const timer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(timer);
  }, []);

  // Tự động scale vừa khít khung preview mà vẫn giữ đúng tỷ lệ virtual
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pad = 16;
      const maxW = Math.max(80, rect.width - pad);
      const maxH = Math.max(80, rect.height - pad);
      const s = Math.min(maxW / virtualDims.width, maxH / virtualDims.height);
      setScale(Math.max(0.1, s));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [virtualDims]);

  // Độ rộng có thể chứa code (sau khi trừ đi lề và cột số dòng/timestamp)
  const maxCharsPerLine = useMemo(() => {
    let gutterW = 16; // padding
    if (options.showLineNumbers) gutterW += 28;
    if (options.showTimestamps) gutterW += 68;
    const availableW = virtualDims.width - gutterW - 20; // 20px padding right
    const approxCharW = options.fontSize * 0.60;
    return Math.max(16, Math.floor(availableW / approxCharW));
  }, [virtualDims.width, options.showLineNumbers, options.showTimestamps, options.fontSize]);

  // Định dạng và ngắt dòng code chuẩn hóa
  const codeLines: FormattedCodeLine[] = useMemo(() => {
    return formatAllCodeLines(lyrics, options.language, maxCharsPerLine);
  }, [lyrics, options.language, maxCharsPerLine]);

  // Tìm vị trí dòng active
  const activeIndex = useMemo(() => {
    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[i];
      const nextLine = codeLines[i + 1];
      const effectiveEnd = nextLine ? nextLine.startTime : (line.endTime > line.startTime ? line.endTime : line.startTime + 8);
      if (currentTime >= line.startTime && currentTime < effectiveEnd) {
        return i;
      }
    }
    return -1;
  }, [codeLines, currentTime]);

  const activeLine = activeIndex >= 0 ? codeLines[activeIndex] : null;

  // Tính số ký tự typewriter đang gõ của câu active
  const typedLength = useMemo(() => {
    if (!activeLine || !options.typewriterEffect) return activeLine ? activeLine.totalTextLength : 0;
    const duration = Math.max(0.6, (activeLine.endTime - activeLine.startTime) * 0.7);
    const elapsed = Math.max(0, currentTime - activeLine.startTime);
    const progress = Math.min(1, elapsed / duration);
    return Math.floor(activeLine.totalTextLength * progress);
  }, [activeLine, currentTime, options.typewriterEffect]);

  // Icon ngôn ngữ ở tab
  const langBadge = useMemo(() => {
    switch (options.language) {
      case 'typescript':
        return { label: 'TS', color: '#3178c6' };
      case 'python':
        return { label: 'PY', color: '#3572A5' };
      case 'bash':
        return { label: '>_', color: '#4ade80' };
      default:
        return { label: '#', color: '#a855f7' };
    }
  }, [options.language]);

  // Ký tự con trỏ
  const cursorChar = useMemo(() => {
    switch (options.cursorStyle) {
      case 'line':
        return '|';
      case 'underscore':
        return '_';
      case 'block':
      default:
        return '▋';
    }
  }, [options.cursorStyle]);

  // Tính toán chiều cao từng dòng code và độ cuộn màn hình
  const singleLineH = options.fontSize * (options.lineHeight || 1.6);
  
  // Vị trí Y tích lũy của từng dòng code
  const linePositions = useMemo(() => {
    const pos: { top: number; height: number }[] = [];
    let currentY = 0;
    codeLines.forEach((line) => {
      const h = line.sublines.length * singleLineH + 6; // 6px padding
      pos.push({ top: currentY, height: h });
      currentY += h + 4; // 4px margin between lines
    });
    return pos;
  }, [codeLines, singleLineH]);

  const scrollOffset = useMemo(() => {
    if (activeIndex === -1 || !linePositions[activeIndex]) return 0;
    const activePos = linePositions[activeIndex];
    const windowCenter = virtualDims.height * 0.36;
    return Math.max(0, activePos.top - windowCenter);
  }, [activeIndex, linePositions, virtualDims.height]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full p-2 overflow-hidden select-none"
      style={{ backgroundColor: theme.appBg }}
    >
      {/* Box kích thước chiếm chỗ */}
      <div
        style={{
          width: `${virtualDims.width * scale}px`,
          height: `${virtualDims.height * scale}px`,
        }}
        className="relative flex items-center justify-center shrink-0"
      >
        {/* Khung IDE Window chuẩn Virtual Pixel */}
        <div
          ref={activeCanvasRef}
          id="sfumato-render-canvas"
          className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col shrink-0 border"
          style={{
            width: `${virtualDims.width}px`,
            height: `${virtualDims.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            backgroundColor: theme.bg,
            borderColor: theme.titleBarBorder,
            fontFamily: `"${options.fontFamily}", JetBrains Mono, Fira Code, monospace`,
          }}
        >
          {/* 1. IDE TITLE BAR & TABS */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b select-none shrink-0"
            style={{
              backgroundColor: theme.titleBarBg,
              borderColor: theme.titleBarBorder,
            }}
          >
            {/* Left: macOS Window Traffic Lights */}
            <div className="flex items-center space-x-1.5 w-16">
              {options.showMacDots && (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-sm" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-sm" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-sm" />
                </>
              )}
            </div>

            {/* Center: File Tab */}
            <div
              className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-medium border shadow-sm"
              style={{
                backgroundColor: theme.tabActiveBg,
                borderColor: theme.titleBarBorder,
                color: theme.titleBarText,
              }}
            >
              <span
                className="text-[9px] font-black px-1 rounded"
                style={{ backgroundColor: `${langBadge.color}25`, color: langBadge.color }}
              >
                {langBadge.label}
              </span>
              <span>{options.fileName || 'lyrics.ts'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 opacity-60" />
            </div>

            {/* Right: Git Branch */}
            <div
              className="text-[10px] font-mono opacity-60 flex items-center justify-end space-x-1 w-16"
              style={{ color: theme.titleBarText }}
            >
              <span>main*</span>
            </div>
          </div>

          {/* 2. BREADCRUMB BAR */}
          {options.showBreadcrumb && (
            <div
              className="flex items-center space-x-1.5 px-4 py-1 text-[10px] font-mono border-b opacity-50 shrink-0"
              style={{
                borderColor: theme.titleBarBorder,
                color: theme.titleBarText,
                backgroundColor: theme.bg,
              }}
            >
              <span>sfumato</span>
              <span>&gt;</span>
              <span>tracks</span>
              <span>&gt;</span>
              <span className="font-semibold text-white/80">{options.fileName || 'lyrics.ts'}</span>
            </div>
          )}

          {/* 3. CODE EDITOR BODY (Lines + Gutter + Content) */}
          <div className="relative flex-1 overflow-hidden p-3 pt-4">
            {/* Khung trượt mượt mà theo vị trí active line */}
            <div
              className="transition-transform duration-500 ease-out flex flex-col"
              style={{
                transform: `translateY(-${scrollOffset}px)`,
              }}
            >
              {codeLines.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 text-xs font-mono opacity-40 text-center"
                  style={{ color: theme.gutterText }}
                >
                  <p>// [00:00.0] Chờ âm thanh & Lời bài hát...</p>
                  <p>// Gõ lời bài hát bên trái để bắt đầu</p>
                </div>
              ) : (
                codeLines.map((line, idx) => {
                  const isActive = idx === activeIndex;
                  const isPast = activeIndex > -1 && idx < activeIndex;

                  // Tính toán text hiển thị cho từng subline khi typewriter
                  let remainingTyped = isActive && options.typewriterEffect ? typedLength : 9999;

                  return (
                    <div
                      key={line.id}
                      className={`relative flex items-start transition-all duration-300 rounded-lg px-2 py-1 my-0.5 ${
                        isActive ? 'shadow-sm' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? theme.activeLineBg : 'transparent',
                        borderLeft: isActive ? `3px solid ${theme.activeLineBorder}` : '3px solid transparent',
                      }}
                    >
                      {/* Cột 1: Số thứ tự dòng */}
                      {options.showLineNumbers && (
                        <span
                          className="w-7 shrink-0 text-right pr-2 text-[11px] font-mono select-none"
                          style={{
                            color: isActive ? theme.gutterActiveText : theme.gutterText,
                            fontWeight: isActive ? 700 : 400,
                            lineHeight: `${singleLineH}px`,
                          }}
                        >
                          {line.lineNumStr}
                        </span>
                      )}

                      {/* Cột 2: Timestamp thời gian */}
                      {options.showTimestamps && (
                        <span
                          className="shrink-0 pr-2.5 text-[10px] font-mono select-none"
                          style={{
                            color: isActive ? theme.activeTimestampColor : theme.timestampColor,
                            opacity: isActive ? 1 : 0.45,
                            fontWeight: isActive ? 600 : 400,
                            lineHeight: `${singleLineH}px`,
                          }}
                        >
                          {line.timestampStr}
                        </span>
                      )}

                      {/* Cột 3: Khối Sublines của Code / Lyrics */}
                      <div
                        className="flex-1 font-mono transition-opacity duration-300 flex flex-col"
                        style={{
                          fontSize: `${options.fontSize}px`,
                          lineHeight: `${singleLineH}px`,
                          opacity: isActive ? 1 : isPast ? 0.35 : 0.22,
                        }}
                      >
                        {line.sublines.map((sub, sIdx) => {
                          // Độ dài subline này
                          const subLen = sub.text.length;
                          let subTextToShow = sub.text;
                          let showCursorHere = false;

                          if (isActive && options.typewriterEffect) {
                            if (remainingTyped <= 0) {
                              subTextToShow = '';
                            } else if (remainingTyped < subLen) {
                              subTextToShow = sub.text.substring(0, remainingTyped);
                              showCursorHere = true;
                              remainingTyped = 0;
                            } else {
                              subTextToShow = sub.text;
                              remainingTyped -= subLen;
                              if (sub.isLast && remainingTyped >= 0) {
                                showCursorHere = true;
                              }
                            }
                          } else if (isActive && sub.isLast) {
                            showCursorHere = true;
                          }

                          return (
                            <div key={sIdx} className="whitespace-pre flex items-center">
                              {/* Dòng đầu: Prefix (yield ", print(", etc.) */}
                              {sub.isFirst ? (
                                <span
                                  className="font-semibold select-none shrink-0"
                                  style={{ color: theme.keywordColor }}
                                >
                                  {line.prefix}
                                </span>
                              ) : (
                                /* Các dòng sau: khoảng thụt lề thụt vào đúng vị trí sau prefix */
                                <span className="select-none shrink-0 opacity-0">
                                  {line.prefix}
                                </span>
                              )}

                              {/* Nội dung lời bài hát */}
                              <span
                                style={{
                                  color: isActive ? theme.stringColor : theme.inactiveStringColor,
                                  fontWeight: isActive ? 600 : 400,
                                  textShadow: isActive ? `0 0 16px ${theme.glowColor}` : 'none',
                                }}
                              >
                                {subTextToShow}
                              </span>

                              {/* Con trỏ nhấp nháy */}
                              {showCursorHere && (
                                <span
                                  className="inline-block ml-0.5 font-bold"
                                  style={{
                                    color: theme.cursorColor,
                                    opacity: cursorVisible ? 1 : 0,
                                    textShadow: `0 0 8px ${theme.cursorColor}`,
                                  }}
                                >
                                  {cursorChar}
                                </span>
                              )}

                              {/* Dòng cuối: Suffix (";, "), etc.) */}
                              {sub.isLast && (
                                <span
                                  className="font-semibold select-none shrink-0 ml-0.5"
                                  style={{ color: theme.punctuationColor }}
                                >
                                  {line.suffix}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 4. IDE STATUS BAR ĐÁY */}
          <div
            className="flex items-center justify-between px-3 py-1 border-t text-[10px] font-mono select-none shrink-0"
            style={{
              backgroundColor: theme.titleBarBg,
              borderColor: theme.titleBarBorder,
              color: theme.titleBarText,
            }}
          >
            <div className="flex items-center space-x-2">
              <span
                className="px-1.5 py-0.2 rounded text-[9px] font-semibold text-white"
                style={{ backgroundColor: theme.badgeBg }}
              >
                TERMINAL
              </span>
              <span className="opacity-75">
                Ln {activeIndex >= 0 ? activeIndex + 1 : 1}, Col {typedLength + 1}
              </span>
            </div>

            <div className="flex items-center space-x-3 opacity-75">
              <span>UTF-8</span>
              <span className="uppercase">{options.language}</span>
            </div>
          </div>

          {/* CRT Scanline Effect Overlay (Tùy chọn phong cách cổ điển) */}
          {options.crtScanlines && (
            <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-20 z-20" />
          )}
        </div>
      </div>
    </div>
  );
};
