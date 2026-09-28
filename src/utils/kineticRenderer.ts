import { LyricLine, StylingOptions } from '../types';
import { THEMES } from './themePresets';
import { formatAllCodeLines, FormattedCodeLine } from './codeLayout';

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
 * Render 1080p / 720p IDE Code Editor Canvas Frame for Video Export
 * 100% WYSIWYG match with the DOM preview
 */
export function renderKineticFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lyricsList: LyricLine[],
  time: number,
  options: StylingOptions,
  showSafeZone: boolean = false
) {
  const theme = THEMES[options.theme] || THEMES['vscode-dark'];
  const virtualWidth = options.aspectRatio === '9:16' ? 360 : options.aspectRatio === '1:1' ? 540 : 640;
  const virtualHeight = options.aspectRatio === '9:16' ? 640 : options.aspectRatio === '1:1' ? 540 : 360;
  const scale = width / virtualWidth;

  // 1. Fill Canvas Background
  ctx.save();
  ctx.fillStyle = theme.appBg;
  ctx.fillRect(0, 0, width, height);

  // 2. Safe Zone Overlay (nếu được bật)
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

  // 3. Khung IDE Window
  const winW = width;
  const winH = height;
  const winX = 0;
  const winY = 0;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(winX, winY, winW, winH);

  // 4. TITLE BAR (macOS Traffic Lights + Tab + Git)
  const titleBarH = Math.round(42 * scale);
  ctx.fillStyle = theme.titleBarBg;
  ctx.fillRect(winX, winY, winW, titleBarH);
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(winX, winY + titleBarH);
  ctx.lineTo(winX + winW, winY + titleBarH);
  ctx.stroke();

  // Traffic Lights 🔴 🟡 🟢
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

  // Center Tab
  const tabW = Math.round(150 * scale);
  const tabH = Math.round(26 * scale);
  const tabX = winX + (winW - tabW) / 2;
  const tabY = winY + (titleBarH - tabH) / 2;

  ctx.fillStyle = theme.tabActiveBg;
  ctx.beginPath();
  roundRect(ctx, tabX, tabY, tabW, tabH, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.stroke();

  // Tab Badge & Text
  let langLabel = 'TS';
  let langColor = '#3178c6';
  if (options.language === 'python') {
    langLabel = 'PY';
    langColor = '#3572A5';
  } else if (options.language === 'bash') {
    langLabel = '>_';
    langColor = '#4ade80';
  } else if (options.language === 'plain') {
    langLabel = '#';
    langColor = '#a855f7';
  }

  const badgeW = 20 * scale;
  const badgeH = 14 * scale;
  const badgeX = tabX + 8 * scale;
  const badgeY = tabY + (tabH - badgeH) / 2;
  ctx.fillStyle = `${langColor}33`;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 3 * scale);
  ctx.fill();

  ctx.fillStyle = langColor;
  ctx.font = `900 ${Math.round(8 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(langLabel, badgeX + badgeW / 2, badgeY + badgeH / 2);

  ctx.fillStyle = theme.titleBarText;
  ctx.font = `500 ${Math.round(11 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(options.fileName || 'lyrics.ts', badgeX + badgeW + 6 * scale, tabY + tabH / 2);

  // Right Git
  ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
  ctx.font = `400 ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('main*', winX + winW - 16 * scale, winY + titleBarH / 2);

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

    ctx.fillStyle = 'rgba(200, 200, 200, 0.45)';
    ctx.font = `400 ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`sfumato > tracks > ${options.fileName || 'lyrics.ts'}`, winX + 16 * scale, bodyStartY + breadcrumbH / 2);

    bodyStartY += breadcrumbH;
  }

  // 6. STATUS BAR
  const statusH = Math.round(28 * scale);
  const statusY = winY + winH - statusH;
  ctx.fillStyle = theme.titleBarBg;
  ctx.fillRect(winX, statusY, winW, statusH);
  ctx.strokeStyle = theme.titleBarBorder;
  ctx.beginPath();
  ctx.moveTo(winX, statusY);
  ctx.lineTo(winX + winW, statusY);
  ctx.stroke();

  // 7. FORMAT CODE LINES WITH EXACT SAME WORD WRAP
  let gutterW = 16;
  if (options.showLineNumbers) gutterW += 28;
  if (options.showTimestamps) gutterW += 68;
  const availableW = virtualWidth - gutterW - 20;
  const approxCharW = options.fontSize * 0.60;
  const maxCharsPerLine = Math.max(16, Math.floor(availableW / approxCharW));

  const codeLines: FormattedCodeLine[] = formatAllCodeLines(lyricsList, options.language, maxCharsPerLine);

  // Tìm vị trí dòng active
  let activeIndex = -1;
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    const nextLine = codeLines[i + 1];
    const effectiveEnd = nextLine ? nextLine.startTime : (line.endTime > line.startTime ? line.endTime : line.startTime + 8);
    if (time >= line.startTime && time < effectiveEnd) {
      activeIndex = i;
      break;
    }
  }

  const activeLine = activeIndex >= 0 ? codeLines[activeIndex] : null;

  // Typewriter progress
  let typedLength = activeLine ? activeLine.totalTextLength : 0;
  if (activeLine && options.typewriterEffect) {
    const duration = Math.max(0.6, (activeLine.endTime - activeLine.startTime) * 0.7);
    const elapsed = Math.max(0, time - activeLine.startTime);
    const progress = Math.min(1, elapsed / duration);
    typedLength = Math.floor(activeLine.totalTextLength * progress);
  }

  // Status Bar Contents
  const sbBadgeW = Math.round(62 * scale);
  const sbBadgeH = Math.round(16 * scale);
  ctx.fillStyle = theme.badgeBg;
  roundRect(ctx, winX + 12 * scale, statusY + (statusH - sbBadgeH) / 2, sbBadgeW, sbBadgeH, 3 * scale);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.round(8.5 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TERMINAL', winX + 12 * scale + sbBadgeW / 2, statusY + statusH / 2);

  ctx.fillStyle = 'rgba(200, 200, 200, 0.75)';
  ctx.font = `400 ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(`Ln ${activeIndex >= 0 ? activeIndex + 1 : 1}, Col ${typedLength + 1}`, winX + 12 * scale + sbBadgeW + 10 * scale, statusY + statusH / 2);

  ctx.textAlign = 'right';
  ctx.fillText(`UTF-8   ${options.language.toUpperCase()}`, winX + winW - 16 * scale, statusY + statusH / 2);

  // 8. CODE EDITOR BODY (Lines + Gutter + Content)
  const fontSizePx = Math.round(options.fontSize * scale);
  const singleLineH = Math.round(fontSizePx * (options.lineHeight || 1.6));
  const editorBodyH = statusY - bodyStartY;

  // Tính toán vị trí Y tích lũy của từng dòng code
  const linePositions: { top: number; height: number }[] = [];
  let currentYPos = 0;
  codeLines.forEach((line) => {
    const h = line.sublines.length * singleLineH + 6 * scale;
    linePositions.push({ top: currentYPos, height: h });
    currentYPos += h + 4 * scale;
  });

  let scrollOffset = 0;
  if (activeIndex >= 0 && linePositions[activeIndex]) {
    const activePos = linePositions[activeIndex];
    const windowCenter = (virtualHeight * 0.36) * scale;
    scrollOffset = Math.max(0, activePos.top - windowCenter);
  }

  // Clip editor body
  ctx.save();
  ctx.beginPath();
  ctx.rect(winX, bodyStartY, winW, editorBodyH);
  ctx.clip();

  const contentStartY = bodyStartY + 16 * scale - scrollOffset;

  codeLines.forEach((line, idx) => {
    const isActive = idx === activeIndex;
    const isPast = activeIndex > -1 && idx < activeIndex;
    const pos = linePositions[idx];
    const lineY = contentStartY + (pos ? pos.top : idx * singleLineH);
    const lineH = pos ? pos.height : line.sublines.length * singleLineH + 6 * scale;

    // Culling: Bỏ qua nếu dòng nằm ngoài màn hình
    if (lineY + lineH < bodyStartY || lineY > statusY) return;

    // Active line highlight box
    if (isActive) {
      ctx.fillStyle = theme.activeLineBg;
      roundRect(ctx, winX + 8 * scale, lineY, winW - 16 * scale, lineH, 8 * scale);
      ctx.fill();

      ctx.fillStyle = theme.activeLineBorder;
      ctx.fillRect(winX + 8 * scale, lineY, 3.5 * scale, lineH);
    }

    let cursorX = winX + 16 * scale;

    // Cột 1: Line number
    if (options.showLineNumbers) {
      ctx.fillStyle = isActive ? theme.gutterActiveText : theme.gutterText;
      ctx.font = `${isActive ? '700' : '400'} ${Math.round(11 * scale)}px "${options.fontFamily}", monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.lineNumStr, cursorX + 22 * scale, lineY + 3 * scale + singleLineH / 2);
      cursorX += 30 * scale;
    }

    // Cột 2: Timestamp
    if (options.showTimestamps) {
      ctx.fillStyle = isActive ? theme.activeTimestampColor : theme.timestampColor;
      ctx.globalAlpha = isActive ? 1 : 0.45;
      ctx.font = `${isActive ? '600' : '400'} ${Math.round(10 * scale)}px "${options.fontFamily}", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.timestampStr, cursorX, lineY + 3 * scale + singleLineH / 2);
      ctx.globalAlpha = 1;
      cursorX += 66 * scale;
    }

    // Cột 3: Khối Sublines
    let remainingTyped = isActive && options.typewriterEffect ? typedLength : 9999;
    const codeStartX = cursorX;

    line.sublines.forEach((sub, sIdx) => {
      const subY = lineY + 3 * scale + sIdx * singleLineH;
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

      ctx.font = `${isActive ? '600' : '400'} ${fontSizePx}px "${options.fontFamily}", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = isActive ? 1 : isPast ? 0.35 : 0.22;

      let curX = codeStartX;

      // 1. Prefix
      if (sub.isFirst) {
        ctx.fillStyle = theme.keywordColor;
        ctx.fillText(line.prefix, curX, subY + singleLineH / 2);
      }
      // Measure prefix width so sublines align identically
      const prefixW = ctx.measureText(line.prefix).width;
      curX += prefixW;

      // 2. Lyrics Text
      ctx.fillStyle = isActive ? theme.stringColor : theme.inactiveStringColor;
      if (isActive) {
        ctx.shadowColor = theme.glowColor;
        ctx.shadowBlur = Math.round(14 * scale);
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillText(subTextToShow, curX, subY + singleLineH / 2);
      const textW = ctx.measureText(subTextToShow).width;
      curX += textW;
      ctx.shadowBlur = 0;

      // 3. Cursor
      if (showCursorHere) {
        const cursorChar = options.cursorStyle === 'line' ? '|' : options.cursorStyle === 'underscore' ? '_' : '▋';
        ctx.fillStyle = theme.cursorColor;
        ctx.fillText(cursorChar, curX + 2 * scale, subY + singleLineH / 2);
        curX += ctx.measureText(cursorChar).width;
      }

      // 4. Suffix
      if (sub.isLast) {
        ctx.fillStyle = theme.punctuationColor;
        ctx.fillText(line.suffix, curX + 2 * scale, subY + singleLineH / 2);
      }

      ctx.globalAlpha = 1;
    });
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
