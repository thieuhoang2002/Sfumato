import { LyricLine, StylingOptions } from '../types';

export function getCanvasDimensions(
  aspectRatio: '9:16' | '1:1' | '16:9',
  forPreview: boolean = false
): { width: number; height: number } {
  if (forPreview) {
    switch (aspectRatio) {
      case '9:16':
        return { width: 540, height: 960 };
      case '1:1':
        return { width: 540, height: 540 };
      case '16:9':
        return { width: 960, height: 540 };
    }
  }
  switch (aspectRatio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '16:9':
      return { width: 1920, height: 1080 };
  }
}

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Word wrapping function
function wrapWords(ctx: CanvasRenderingContext2D, wordsList: string[], maxW: number): string[][] {
  const result: string[][] = [];
  let currentLineWords: string[] = [];
  let currentLineWidth = 0;
  const spaceW = ctx.measureText(' ').width;

  for (const word of wordsList) {
    const wW = ctx.measureText(word).width;
    if (currentLineWords.length === 0) {
      currentLineWords.push(word);
      currentLineWidth = wW;
    } else if (currentLineWidth + spaceW + wW <= maxW) {
      currentLineWords.push(word);
      currentLineWidth += spaceW + wW;
    } else {
      result.push(currentLineWords);
      currentLineWords = [word];
      currentLineWidth = wW;
    }
  }
  if (currentLineWords.length > 0) {
    result.push(currentLineWords);
  }
  return result;
}

// Cache tính toán ngắt dòng và kích cỡ từ để loại bỏ triệt để overhead đo chữ mỗi frame 60fps
interface CachedWrapInfo {
  lines: string[][];
  wordWidths: Map<string, number>;
  spaceW: number;
}
const lineWrapCache = new Map<string, CachedWrapInfo>();

/**
 * Single source of truth renderer for Kinetic Lyrics across:
 * 1. Preview in Editor
 * 2. Fullscreen Preview (F)
 * 3. Video Export (Tải về)
 */
export function renderKineticFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  line: LyricLine | null,
  time: number,
  options: StylingOptions,
  showSafeZone: boolean = false
) {
  // 1. Pure Studio Black Background (#000000)
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 2. Safe Zone Overlay (nếu được bật - chỉ dùng cho Preview, không xuất vào video)
  if (showSafeZone) {
    drawSafeZone(ctx, width, height, options.aspectRatio);
  }

  // 3. Nếu chưa có lyrics phát
  if (!line) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(113, 113, 122, 0.6)';
    ctx.font = '500 24px monospace';
    ctx.fillText('[ CHỜ ÂM THANH & LỜI BÀI HÁT ]', width / 2, height / 2);
    ctx.restore();
    return;
  }

  // 4. Tính toán kích thước chữ và vùng an toàn chuẩn xác
  const virtualWidth = options.aspectRatio === '9:16' ? 360 : options.aspectRatio === '1:1' ? 540 : 640;
  const scaleFactor = width / virtualWidth;
  const baseFontSize = Math.round(options.fontSize * scaleFactor);

  const rawParagraphs = line.text.split('\n').map((p) => p.trim()).filter(Boolean);
  if (rawParagraphs.length === 0) return;

  const allWords = line.text.trim().split(/\s+/).filter(Boolean).map((w) => {
    if (options.textCase === 'uppercase') return w.toUpperCase();
    if (options.textCase === 'lowercase') return w.toLowerCase();
    return w;
  });

  const maxTextWidth = options.aspectRatio === '9:16' 
    ? (width - 120 * (width / 1080)) * 0.85 
    : width * 0.85;

  const fontName = options.fontFamily.includes(' ') ? `"${options.fontFamily}"` : options.fontFamily;
  ctx.font = `${options.fontWeight} ${baseFontSize}px ${fontName}, sans-serif`;
  if ('letterSpacing' in ctx && options.letterSpacing) {
    (ctx as any).letterSpacing = `${options.letterSpacing}em`;
  }

  // Tận dụng cache để không phải đo chữ lặp lại 60 lần/giây
  const cacheKey = `${line.id}_${line.text}_${baseFontSize}_${options.fontFamily}_${options.fontWeight}_${options.letterSpacing}_${options.textCase}_${Math.round(maxTextWidth)}`;
  let cachedData = lineWrapCache.get(cacheKey);

  if (!cachedData) {
    let longestWordW = 0;
    allWords.forEach((w) => {
      const wW = ctx.measureText(w).width;
      if (wW > longestWordW) longestWordW = wW;
    });

    const fontScale = longestWordW > maxTextWidth ? maxTextWidth / longestWordW : 1;
    const effectiveFontSize = Math.round(baseFontSize * fontScale);
    ctx.font = `${options.fontWeight} ${effectiveFontSize}px ${fontName}, sans-serif`;

    const lines: string[][] = [];
    rawParagraphs.forEach((para) => {
      const paraWords = para.split(/\s+/).filter(Boolean).map((w) => {
        if (options.textCase === 'uppercase') return w.toUpperCase();
        if (options.textCase === 'lowercase') return w.toLowerCase();
        return w;
      });
      const wrapped = wrapWords(ctx, paraWords, maxTextWidth);
      lines.push(...wrapped);
    });

    const wordWidths = new Map<string, number>();
    const spaceW = ctx.measureText(' ').width;
    lines.forEach((lineWords) => {
      lineWords.forEach((w) => {
        if (!wordWidths.has(w)) {
          wordWidths.set(w, ctx.measureText(w).width);
        }
      });
    });

    cachedData = { lines, wordWidths, spaceW };
    if (lineWrapCache.size > 150) lineWrapCache.clear();
    lineWrapCache.set(cacheKey, cachedData);
  }

  const lines = cachedData.lines;
  const wordWidthsMap = cachedData.wordWidths;
  const spaceW = cachedData.spaceW;

  const effectiveFontSize = baseFontSize;
  ctx.font = `${options.fontWeight} ${effectiveFontSize}px ${fontName}, sans-serif`;

  const lineHeight = effectiveFontSize * (options.lineHeight || 1.35);
  const totalBlockHeight = (lines.length - 1) * lineHeight;
  const centerY = height / 2;
  const startY = centerY - totalBlockHeight / 2;

  const elapsed = Math.max(0, time - line.startTime);
  const preset = options.motionPreset;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Hiệu ứng Glow mặc định
  if (options.glowEffect) {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowBlur = Math.round(options.glowIntensity * 28 * scaleFactor);
  } else {
    ctx.shadowBlur = 0;
  }

  // 🌟 PRESET 1: Shatter & Assemble (Tụ lại từ 4 góc)
  if (preset === 'shatter-assemble') {
    let globalWordIdx = 0;
    const totalWords = allWords.length;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      const wordWidths = lineWords.map((w) => wordWidthsMap.get(w) ?? ctx.measureText(w).width);
      const totalLineW = wordWidths.reduce((a, b) => a + b, 0) + (lineWords.length - 1) * spaceW;
      let currentX = (width - totalLineW) / 2;

      lineWords.forEach((word, wIdx) => {
        const wWidth = wordWidths[wIdx];
        const targetWordCenterX = currentX + wWidth / 2;
        const angle = (globalWordIdx / totalWords) * Math.PI * 2;
        const initialDist = 320 * scaleFactor;
        const initX = targetWordCenterX + Math.cos(angle) * initialDist;
        const initY = lineY + Math.sin(angle) * initialDist;
        const initRotate = (globalWordIdx % 2 === 0 ? -1 : 1) * 0.45;

        const p = Math.min(1, Math.max(0, (elapsed - globalWordIdx * 0.04) / 0.42));
        const ease = easeOutBack(p);

        const wordX = initX + (targetWordCenterX - initX) * ease;
        const wordY = initY + (lineY - initY) * ease;
        const wordRotate = initRotate * (1 - ease);
        const wordScale = 2.0 - 1.0 * ease;

        ctx.save();
        ctx.translate(wordX, wordY);
        ctx.rotate(wordRotate);
        ctx.scale(wordScale, wordScale);
        ctx.fillStyle = options.textColor;
        ctx.fillText(word, 0, 0);
        ctx.restore();

        currentX += wWidth + spaceW;
        globalWordIdx++;
      });
    });
  }
  // 🌟 PRESET 2: Cross Drift (Đan chéo đối kháng 2 bên)
  else if (preset === 'cross-drift') {
    let globalWordIdx = 0;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      const wordWidths = lineWords.map((w) => wordWidthsMap.get(w) ?? ctx.measureText(w).width);
      const totalLineW = wordWidths.reduce((a, b) => a + b, 0) + (lineWords.length - 1) * spaceW;
      let currentX = (width - totalLineW) / 2;

      lineWords.forEach((word, wIdx) => {
        const wWidth = wordWidths[wIdx];
        const targetWordCenterX = currentX + wWidth / 2;
        const isLeft = globalWordIdx % 2 === 0;
        const initOffset = isLeft ? -width * 0.65 : width * 0.65;

        const p = Math.min(1, Math.max(0, (elapsed - globalWordIdx * 0.05) / 0.45));
        const ease = easeOutBack(p);

        const wordX = targetWordCenterX + initOffset * (1 - ease);
        const wordScaleX = 1 + 0.8 * (1 - ease);

        ctx.save();
        ctx.translate(wordX, lineY);
        ctx.scale(wordScaleX, 1);
        ctx.fillStyle = options.textColor;
        ctx.fillText(word, 0, 0);
        ctx.restore();

        currentX += wWidth + spaceW;
        globalWordIdx++;
      });
    });
  }
  // 🌟 PRESET 3: 3D Card Flip (Lật xoay bài 3D)
  else if (preset === 'card-flip-3d') {
    let globalWordIdx = 0;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      const wordWidths = lineWords.map((w) => wordWidthsMap.get(w) ?? ctx.measureText(w).width);
      const totalLineW = wordWidths.reduce((a, b) => a + b, 0) + (lineWords.length - 1) * spaceW;
      let currentX = (width - totalLineW) / 2;

      lineWords.forEach((word, wIdx) => {
        const wWidth = wordWidths[wIdx];
        const targetWordCenterX = currentX + wWidth / 2;
        const p = Math.min(1, Math.max(0, (elapsed - globalWordIdx * 0.06) / 0.48));
        const ease = easeOutBack(p);
        const flipCos = Math.cos((1 - ease) * (Math.PI / 2.1));
        const wordScale = 0.6 + 0.4 * ease;

        ctx.save();
        ctx.translate(targetWordCenterX, lineY);
        ctx.scale(Math.max(0.01, flipCos * wordScale), wordScale);
        ctx.fillStyle = options.textColor;
        ctx.fillText(word, 0, 0);
        ctx.restore();

        currentX += wWidth + spaceW;
        globalWordIdx++;
      });
    });
  }
  // 🌟 PRESET 4: Echo Ghost (Bóng ma phân thân RGB)
  else if (preset === 'echo-ghost') {
    const p = Math.min(1, elapsed / 0.35);
    const ease = easeOutCubic(p);
    const ghostOffset = (1 - ease) * 35 * (scaleFactor / 3.0);

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      const lineText = lineWords.join(' ');

      // Bóng Cyan
      ctx.save();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.65)';
      ctx.fillText(lineText, width / 2 - ghostOffset, lineY - ghostOffset * 0.6);
      ctx.restore();

      // Bóng Red
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.65)';
      ctx.fillText(lineText, width / 2 + ghostOffset, lineY + ghostOffset * 0.6);
      ctx.restore();

      // Chữ chính
      ctx.fillStyle = options.textColor;
      ctx.fillText(lineText, width / 2, lineY);
    });
  }
  // 🌟 PRESET 5: Brutalist Giant (Từ chính khổng lồ)
  else if (preset === 'brutalist-giant') {
    let heroIdx = Math.floor(allWords.length / 2);
    let maxLen = 0;
    allWords.forEach((w, i) => {
      if (w.length > maxLen) {
        maxLen = w.length;
        heroIdx = i;
      }
    });

    const heroWord = allWords[heroIdx];
    const secWords = allWords.filter((_, i) => i !== heroIdx);

    const p = Math.min(1, elapsed / 0.45);
    const ease = easeOutBack(p);

    const heroFontSize = Math.min(
      width * 0.85 / Math.max(1, ctx.measureText(heroWord).width / effectiveFontSize),
      effectiveFontSize * 2.0
    );
    const heroY = secWords.length > 0 ? centerY - heroFontSize * 0.35 : centerY;

    ctx.save();
    ctx.font = `900 ${heroFontSize * ease}px ${fontName}, sans-serif`;
    ctx.fillStyle = options.textColor;
    ctx.translate(width / 2, heroY);
    ctx.rotate(-0.035 * (1 - ease));
    ctx.fillText(heroWord, 0, 0);
    ctx.restore();

    if (secWords.length > 0) {
      const secFontSize = effectiveFontSize * 0.85;
      ctx.font = `700 ${secFontSize}px ${fontName}, sans-serif`;
      ctx.fillStyle = 'rgba(212, 212, 216, 0.85)';
      const secLines = wrapWords(ctx, secWords, maxTextWidth);
      const secLineH = secFontSize * 1.3;
      const secStartY = heroY + heroFontSize * 0.65;

      secLines.forEach((sWords, sIdx) => {
        ctx.fillText(sWords.join(' '), width / 2, secStartY + sIdx * secLineH);
      });
    }
  }
  // 🌟 PRESET 6: Elastic Spring (Co giãn đàn hồi)
  else if (preset === 'elastic-spring') {
    const scaleY = 1 + 1.2 * Math.cos(elapsed * 14) * Math.exp(-elapsed * 4.5);
    const scaleX = 1 / Math.sqrt(Math.max(0.2, scaleY));

    ctx.save();
    ctx.translate(width / 2, centerY);
    ctx.scale(scaleX, scaleY);
    ctx.fillStyle = options.textColor;
    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight - centerY;
      ctx.fillText(lineWords.join(' '), 0, lineY);
    });
    ctx.restore();
  }
  // 🌟 PRESET 7: Hyper-Velocity (Lao vút phanh gấp)
  else if (preset === 'hyper-velocity') {
    const p = Math.min(1, elapsed / 0.35);
    const ease = easeOutCubic(p);
    const scale = 2.5 - 1.5 * ease;

    ctx.save();
    ctx.translate(width / 2, centerY);
    ctx.scale(scale, scale);

    if (options.chromaticAberration) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      lines.forEach((lineWords, lineIdx) => {
        const lineY = startY + lineIdx * lineHeight - centerY;
        ctx.fillText(lineWords.join(' '), -4 * (scaleFactor / 3.0), lineY);
      });
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
      lines.forEach((lineWords, lineIdx) => {
        const lineY = startY + lineIdx * lineHeight - centerY;
        ctx.fillText(lineWords.join(' '), 4 * (scaleFactor / 3.0), lineY);
      });
      ctx.restore();
    }

    ctx.fillStyle = options.textColor;
    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight - centerY;
      ctx.fillText(lineWords.join(' '), 0, lineY);
    });
    ctx.restore();
  }
  // 🌟 PRESET 8: Liquid Chrome (Ánh bạc kim loại 3D)
  else if (preset === 'liquid-chrome') {
    const p = Math.min(1, elapsed / 0.6);
    const ease = easeOutCubic(p);
    const yOffset = (1 - ease) * 35 * (scaleFactor / 3.0);
    const floatY = Math.sin(elapsed * 2.5) * (4 * (scaleFactor / 3.0));

    ctx.save();
    ctx.translate(width / 2, centerY - yOffset + floatY);

    const grad = ctx.createLinearGradient(-maxTextWidth / 2, -totalBlockHeight / 2, maxTextWidth / 2, totalBlockHeight / 2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#94a3b8');
    grad.addColorStop(0.65, '#ffffff');
    grad.addColorStop(0.85, '#cbd5e1');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight - centerY;
      ctx.fillText(lineWords.join(' '), 0, lineY);
    });
    ctx.restore();
  }
  // 🌟 PRESET 9: Film Fade (Vàng kem cổ điển, ấm áp, tĩnh lặng tuyệt đối)
  else if (preset === 'film-burn') {
    const p = Math.min(1, elapsed / 0.45);
    const ease = easeOutCubic(p);
    const scale = 1.04 - 0.04 * ease;
    const alpha = ease;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#fef3c7';
    ctx.shadowColor = 'rgba(251, 146, 60, 0.6)';
    ctx.shadowBlur = Math.round(16 * scaleFactor);

    ctx.translate(width / 2, centerY);
    ctx.scale(scale, scale);

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight - centerY;
      ctx.fillText(lineWords.join(' '), 0, lineY);
    });
    ctx.restore();
  }
  // 🌟 PRESET 10: Liquid Smoke (Khói mờ Sfumato)
  else {
    const alpha = Math.min(1, elapsed * 1.5);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = options.textColor;

    lines.forEach((lineWords, lineIdx) => {
      const lineY = startY + lineIdx * lineHeight;
      ctx.fillText(lineWords.join(' '), width / 2, lineY);
    });
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Vẽ khung Safe Zone TikTok 1080x1920 (960x1420 ở trung tâm)
 */
function drawSafeZone(ctx: CanvasRenderingContext2D, width: number, height: number, aspectRatio: '9:16' | '1:1' | '16:9') {
  ctx.save();

  if (aspectRatio === '9:16') {
    const topDanger = Math.round(height * 0.1146);   // 220px
    const bottomDanger = Math.round(height * 0.1458); // 280px
    const sideMargin = Math.round(width * 0.0556);    // 60px

    // 1. Mép trên
    ctx.fillStyle = 'rgba(239, 68, 68, 0.04)';
    ctx.fillRect(0, 0, width, topDanger);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, topDanger);
    ctx.lineTo(width, topDanger);
    ctx.stroke();

    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.font = '600 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('▲ Mép trên 220px', width / 2, topDanger / 2);

    // 2. Mép dưới
    const bottomY = height - bottomDanger;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.04)';
    ctx.fillRect(0, bottomY, width, bottomDanger);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, bottomY);
    ctx.lineTo(width, bottomY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillText('▼ Mép dưới 280px', width / 2, bottomY + bottomDanger / 2);

    // 3. Khung an toàn trung tâm 960 × 1420 px
    const safeW = width - sideMargin * 2;
    const safeH = height - topDanger - bottomDanger;
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.65)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.strokeRect(sideMargin, topDanger, safeW, safeH);

    // Labels
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(sideMargin + 10, topDanger + 10, 240, 32);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SAFE ZONE • 960 × 1420', sideMargin + 20, topDanger + 32);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(sideMargin + safeW - 120, topDanger + 10, 110, 32);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
    ctx.font = '500 16px monospace';
    ctx.fillText('L/R: 60px', sideMargin + safeW - 110, topDanger + 32);
  } else {
    // 1:1 hoặc 16:9
    const margin = Math.round(width * 0.08);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
  }

  ctx.restore();
}
