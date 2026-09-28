import { LyricLine, StylingOptions } from '../types';
import { THEMES } from './themePresets';
import { formatTime } from './formatters';

export function getCanvasDimensions(aspectRatio: '9:16' | '1:1' | '16:9'): { width: number; height: number } {
  switch (aspectRatio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '16:9':
      return { width: 1920, height: 1080 };
  }
}

/**
 * Render IDE Code Editor Frame for Video Export (1080p / 720p)
 * Guarantees 100% WYSIWYG match with the DOM preview
 */
export function renderKineticFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lyricsOrCurrent: LyricLine[] | LyricLine | null,
  time: number,
  options: StylingOptions,
  showSafeZone: boolean = false,
  allLyricsPassed?: LyricLine[]
) {
  // Chuẩn hóa danh sách lyrics
  let lyricsList: LyricLine[] = [];
  if (Array.isArray(lyricsOrCurrent)) {
    lyricsList = lyricsOrCurrent;
  } else if (allLyricsPassed) {
    lyricsList = allLyricsPassed;
  } else if (lyricsOrCurrent) {
    lyricsList = [lyricsOrCurrent];
  }

  const sortedLyrics = [...lyricsList].filter((l) => l.synced).sort((a, b) => a.startTime - b.startTime);

  const theme = THEMES[options.theme] || THEMES['vscode-dark'];
  const virtualWidth = options.aspectRatio === '9:16' ? 360 : options.aspectRatio === '1:1' ? 540 : 640;
  const virtualHeight = options.aspectRatio === '9:16' ? 640 : options.aspectRatio === '1:1' ? 540 : 360;
  const scale = width / virtualWidth;

  // 1. Fill Overall Canvas Background
  ctx.save();
  ctx.fillStyle = theme.appBg;
  ctx.fillRect(0, 0, width, height);

  // 2. Safe Zone Overlay (nếu bật preview)
  if (showSafeZone && options.aspectRatio === '9:16') {
    const topDanger = Math.round(height * 0.1146);
    const bottomDanger = Math.round(height * 0.1458);
    const sideMargin = Math.round(width * 0.0556);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
    ctx.fillRect(0, 0, width, topDanger);
    ctx.fillRect(0, height - bottomDanger, width, bottomDanger);
    ctx.fillRect(0, topDanger, sideMargin, height - topDanger - bottomDanger);
    ctx.fillRect(width - sideMargin, topDanger, sideMargin, height - topDanger - bottomDanger);
  }

  // 3. Tính toán kích thước và vị trí IDE Window
  const winW = width;
  const winH = height;
  const winX = 0;
  const winY = 0;

  // Background của Window
  ctx.fillStyle = theme.bg;
  ctx.fillRect(winX, winY, winW, winH);

  // 4. TITLE BAR
  const titleBarH = Math.round(42 * scale);
  ctx.fillStyle = theme.titleBarBg;
  ctx.fillRect(winX, winY, winW, titleBarH);
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(winX, winY + titleBarH);
  ctx.lineTo(winX + winW, winY + titleBarH);
  ctx.stroke();

  // macOS Traffic Lights (🔴 🟡 🟢)
  if (options.showMacDots) {
    const dotR = 5 * scale;
    const dotStartX = winX + 16 * scale;
    const dotY = winY + titleBarH / 2;
    const dotSpacing = 16 * scale;

    const colors = ['#ff5f56', '#ffbd2e', '#27c93f'];
    colors.forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(dotStartX + i * dotSpacing, dotY, dotR, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });
  }

  // Tab Title
  const tabW = Math.round(140 * scale);
  const tabH = Math.round(28 * scale);
  const tabX = winX + (winW - tabW) / 2;
  const tabY = winY + (titleBarH - tabH) / 2;

  ctx.fillStyle = theme.tabActiveBg;
  ctx.beginPath();
  roundRect(ctx, tabX, tabY, tabW, tabH, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.stroke();

  // Tab text
  ctx.fillStyle = theme.titleBarText;
  ctx.font = `500 ${Math.round(12 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(options.fileName || 'lyrics.ts', tabX + tabW / 2, tabY + tabH / 2);

  // 5. BREADCRUMB
  let bodyStartY = winY + titleBarH;
  if (options.showBreadcrumb) {
    const breadcrumbH = Math.round(26 * scale);
    ctx.fillStyle = theme.bg;
    ctx.fillRect(winX, bodyStartY, winW, breadcrumbH);
    ctx.strokeStyle = theme.titleBarBorder;
    ctx.beginPath();
    ctx.moveTo(winX, bodyStartY + breadcrumbH);
    ctx.lineTo(winX + winW, bodyStartY + breadcrumbH);
    ctx.stroke();

    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.font = `400 ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`sfumato > tracks > ${options.fileName || 'lyrics.ts'}`, winX + 16 * scale, bodyStartY + breadcrumbH / 2);

    bodyStartY += breadcrumbH;
  }

  // 6. STATUS BAR ĐÁY
  const statusH = Math.round(28 * scale);
  const statusY = winY + winH - statusH;
  ctx.fillStyle = theme.titleBarBg;
  ctx.fillRect(winX, statusY, winW, statusH);
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.beginPath();
  ctx.moveTo(winX, statusY);
  ctx.lineTo(winX + winW, statusY);
  ctx.stroke();

  // Status bar text
  ctx.fillStyle = theme.badgeBg;
  const badgeW = 60 * scale;
  const badgeH = 16 * scale;
  ctx.beginPath();
  roundRect(ctx, winX + 12 * scale, statusY + (statusH - badgeH) / 2, badgeW, badgeH, 3 * scale);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.round(9 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TERMINAL', winX + 12 * scale + badgeW / 2, statusY + statusH / 2);

  // 7. TÌM VỊ TRÍ ACTIVE LINE
  let activeIndex = -1;
  for (let i = 0; i < sortedLyrics.length; i++) {
    const l = sortedLyrics[i];
    const nextLine = sortedLyrics[i + 1];
    const effectiveEnd = nextLine ? nextLine.startTime : (l.endTime > l.startTime ? l.endTime : l.startTime + 8);
    if (time >= l.startTime && time < effectiveEnd) {
      activeIndex = i;
      break;
    }
  }

  const activeLine = activeIndex >= 0 ? sortedLyrics[activeIndex] : null;

  // Tính số ký tự typewriter đang gõ
  let typedLength = activeLine ? activeLine.text.length : 0;
  if (activeLine && options.typewriterEffect) {
    const duration = Math.max(0.6, (activeLine.endTime - activeLine.startTime) * 0.7);
    const elapsed = Math.max(0, time - activeLine.startTime);
    const progress = Math.min(1, elapsed / duration);
    typedLength = Math.floor(activeLine.text.length * progress);
  }

  // 8. CODE EDITOR LINES & SMOOTH SCROLLING
  const fontSizePx = Math.round(options.fontSize * scale);
  const lineHeightPx = Math.round(fontSizePx * (options.lineHeight || 1.6));
  const editorBodyH = statusY - bodyStartY;

  let scrollOffset = 0;
  if (activeIndex >= 0) {
    const targetY = activeIndex * lineHeightPx;
    const windowCenter = editorBodyH * 0.38;
    scrollOffset = Math.max(0, targetY - windowCenter);
  }

  // Clip editor body
  ctx.save();
  ctx.beginPath();
  ctx.rect(winX, bodyStartY, winW, editorBodyH);
  ctx.clip();

  const contentStartY = bodyStartY + 16 * scale - scrollOffset;

  sortedLyrics.forEach((line, idx) => {
    const isActive = idx === activeIndex;
    const isPast = activeIndex > -1 && idx < activeIndex;
    const lineY = contentStartY + idx * lineHeightPx;

    // Bỏ qua nếu dòng nằm ngoài màn hình
    if (lineY + lineHeightPx < bodyStartY || lineY > statusY) return;

    // Active line background
    if (isActive) {
      ctx.fillStyle = theme.activeLineBg;
      ctx.fillRect(winX, lineY, winW, lineHeightPx);

      ctx.fillStyle = theme.activeLineBorder;
      ctx.fillRect(winX, lineY, 4 * scale, lineHeightPx);
    }

    let cursorX = winX + 16 * scale;

    // Cột Line Number
    if (options.showLineNumbers) {
      const lineNumStr = (idx + 1).toString().padStart(2, '0');
      ctx.fillStyle = isActive ? theme.gutterActiveText : theme.gutterText;
      ctx.font = `${isActive ? '700' : '400'} ${Math.round(11 * scale)}px "${options.fontFamily}", monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(lineNumStr, cursorX + 22 * scale, lineY + lineHeightPx / 2);
      cursorX += 32 * scale;
    }

    // Cột Timestamp
    if (options.showTimestamps) {
      const timeStr = `[${formatTime(line.startTime)}]`;
      ctx.fillStyle = isActive ? theme.activeTimestampColor : theme.timestampColor;
      ctx.globalAlpha = isActive ? 1 : 0.45;
      ctx.font = `${isActive ? '600' : '400'} ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(timeStr, cursorX, lineY + lineHeightPx / 2);
      ctx.globalAlpha = 1;
      cursorX += 65 * scale;
    }

    // Cú pháp prefix & suffix
    let prefix = '';
    let suffix = '';
    if (options.language === 'typescript') {
      prefix = 'yield "';
      suffix = '";';
    } else if (options.language === 'python') {
      prefix = 'print("';
      suffix = '")';
    } else if (options.language === 'bash') {
      prefix = '$ echo "';
      suffix = '"';
    } else {
      prefix = '"';
      suffix = '"';
    }

    // Text lyrics
    let lineText = line.text;
    if (isActive && options.typewriterEffect) {
      lineText = line.text.substring(0, typedLength);
    }

    ctx.font = `${isActive ? '600' : '400'} ${fontSizePx}px "${options.fontFamily}", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = isActive ? 1 : isPast ? 0.35 : 0.22;

    // 1. Prefix
    ctx.fillStyle = theme.keywordColor;
    ctx.fillText(prefix, cursorX, lineY + lineHeightPx / 2);
    cursorX += ctx.measureText(prefix).width;

    // 2. String lyrics text
    ctx.fillStyle = isActive ? theme.stringColor : theme.inactiveStringColor;
    if (isActive) {
      ctx.shadowColor = theme.glowColor;
      ctx.shadowBlur = Math.round(12 * scale);
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.fillText(lineText, cursorX, lineY + lineHeightPx / 2);
    cursorX += ctx.measureText(lineText).width;
    ctx.shadowBlur = 0;

    // 3. Cursor
    if (isActive) {
      const cursorChar = options.cursorStyle === 'line' ? '|' : options.cursorStyle === 'underscore' ? '_' : '▋';
      ctx.fillStyle = theme.cursorColor;
      ctx.fillText(cursorChar, cursorX + 2 * scale, lineY + lineHeightPx / 2);
      cursorX += ctx.measureText(cursorChar).width;
    }

    // 4. Suffix
    ctx.fillStyle = theme.punctuationColor;
    ctx.fillText(suffix, cursorX, lineY + lineHeightPx / 2);

    ctx.globalAlpha = 1;
  });

  ctx.restore(); // restore clip

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
