import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyricLine, StylingOptions } from '../types';
import { SafeZoneOverlay } from './SafeZoneOverlay';

interface Props {
  lyrics: LyricLine[];
  currentTime: number;
  options: StylingOptions;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export const KineticCanvas: React.FC<Props> = ({
  lyrics,
  currentTime,
  options,
  canvasRef
}) => {
  // Tìm câu hiện tại đang phát: kéo dài cho tới khi ô lyrics kế tiếp xuất hiện
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

  // Phân tích câu thành danh sách từ và xác định Hero Word
  const analyzedWords = useMemo(() => {
    if (!currentLine) return [];
    const rawWords = currentLine.text.trim().split(/\s+/).filter(Boolean);
    if (rawWords.length === 0) return [];

    let maxLen = 0;
    let heroIndex = Math.floor(rawWords.length / 2);
    rawWords.forEach((w, idx) => {
      const clean = w.replace(/[.,?!…—]/g, '');
      if (clean.length > maxLen) {
        maxLen = clean.length;
        heroIndex = idx;
      }
    });

    return rawWords.map((word, idx) => ({
      id: `w-${currentLine.id}-${idx}`,
      text: options.textCase === 'uppercase' 
        ? word.toUpperCase() 
        : options.textCase === 'lowercase' 
        ? word.toLowerCase() 
        : word,
      isHero: idx === heroIndex && rawWords.length > 1,
    }));
  }, [currentLine, options.textCase]);

  // Aspect ratio class cố định kích thước vững chắc, không bao giờ co giãn theo nội dung chữ
  const aspectClass = useMemo(() => {
    switch (options.aspectRatio) {
      case '9:16':
        return 'h-[min(580px,calc(100%-2rem))] aspect-[9/16] w-auto shrink-0';
      case '1:1':
        return 'h-[min(500px,calc(100%-2rem))] aspect-square w-auto shrink-0';
      case '16:9':
        return 'w-[min(720px,calc(100%-2rem))] aspect-[16/9] h-auto shrink-0';
    }
  }, [options.aspectRatio]);

  // Base font style
  const fontStyle = useMemo(() => {
    return {
      fontFamily: `"${options.fontFamily}", sans-serif`,
      letterSpacing: `${options.letterSpacing}em`,
      lineHeight: options.lineHeight,
      color: options.textColor,
      textShadow: options.glowEffect 
        ? `0 0 ${options.glowIntensity * 28}px rgba(255,255,255,${options.glowIntensity * 0.75})` 
        : 'none',
      fontWeight: options.fontWeight,
    };
  }, [options]);

  // Tốc độ chuyển động động học (0.4x - 2.5x)
  const speed = Math.max(0.3, options.motionSpeed || 1.0);

  return (
    <div className="relative flex items-center justify-center w-full h-full p-4 overflow-hidden select-none">
      {/* Studio Black Canvas Box - Khóa cứng kích thước tuyệt đối */}
      <div 
        ref={canvasRef}
        id="sfumato-render-canvas"
        className={`relative ${aspectClass} bg-black overflow-hidden rounded-2xl shadow-2xl border border-zinc-800/80 flex items-center justify-center`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Safe Zone Simulation */}
        <SafeZoneOverlay aspectRatio={options.aspectRatio} show={options.showSafeZone} />

        {/* Trung Tâm: CHỈ DUY NHẤT LỜI BÀI HÁT (LYRICS) NGHỆ THUẬT */}
        <div 
          className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center overflow-hidden"
          style={{ 
            textAlign: options.alignment,
            paddingTop: options.aspectRatio === '9:16' ? '11.46%' : '1.5rem',
            paddingBottom: options.aspectRatio === '9:16' ? '14.58%' : '1.5rem',
            paddingLeft: options.aspectRatio === '9:16' ? '5.56%' : '1.5rem',
            paddingRight: options.aspectRatio === '9:16' ? '5.56%' : '1.5rem',
          }}
        >
          <AnimatePresence mode="wait">
            {currentLine ? (
              <motion.div
                key={currentLine.id}
                className="w-full flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 / speed } }}
              >
                {/* 🌟 PRESET 1: SHATTER & ASSEMBLE (Tụ lại tâm -> Rung từ trường nhấp nhô xuyên suốt) */}
                {options.motionPreset === 'shatter-assemble' && (
                  <motion.div 
                    animate={{
                      y: [-2.5, 2.5, -2.5],
                      rotate: [-0.5, 0.5, -0.5],
                    }}
                    transition={{
                      duration: 3.2 / speed,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex flex-wrap justify-center items-center gap-x-3.5 gap-y-2.5 max-w-[95%]"
                  >
                    {analyzedWords.map((word, wIdx) => {
                      const angle = (wIdx / analyzedWords.length) * Math.PI * 2;
                      const initialX = Math.cos(angle) * 160 + (wIdx % 2 === 0 ? -30 : 30);
                      const initialY = Math.sin(angle) * 130 + (wIdx % 3 === 0 ? -40 : 40);
                      const initialRotate = (wIdx % 2 === 0 ? -1 : 1) * (25 + wIdx * 8);

                      return (
                        <motion.span
                          key={word.id}
                          initial={{
                            opacity: 0,
                            x: initialX,
                            y: initialY,
                            scale: 2.2,
                            rotate: initialRotate,
                            filter: 'blur(12px)',
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            y: [0, (wIdx % 2 === 0 ? -2.5 : 2.5), 0],
                            scale: [1, 1.04, 1],
                            rotate: [0, (wIdx % 2 === 0 ? -1 : 1), 0],
                            filter: 'blur(0px)',
                          }}
                          exit={{
                            opacity: 0,
                            scale: 2.5,
                            filter: 'blur(16px)',
                            transition: { duration: 0.25 / speed },
                          }}
                          transition={{
                            opacity: { duration: 0.3 / speed },
                            x: { type: 'spring', damping: 13, stiffness: 340 * speed, delay: (wIdx * 0.04) / speed },
                            y: { repeat: Infinity, duration: 2.2 / speed, ease: 'easeInOut' },
                            scale: { repeat: Infinity, duration: 2.5 / speed, ease: 'easeInOut' },
                            rotate: { repeat: Infinity, duration: 2.4 / speed, ease: 'easeInOut' },
                          }}
                          className="inline-block font-black tracking-tight"
                          style={{
                            ...fontStyle,
                            fontSize: `${options.fontSize * 1.15}px`,
                          }}
                        >
                          {word.text}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                )}

                {/* 🌟 PRESET 2: CROSS-DRIFT COLLISION (Lao vào nhau -> Sóng trôi dạt đối kháng) */}
                {options.motionPreset === 'cross-drift' && (
                  <motion.div 
                    animate={{
                      x: [-4, 4, -4],
                    }}
                    transition={{
                      duration: 2.6 / speed,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-[95%]"
                  >
                    {analyzedWords.map((word, wIdx) => {
                      const isLeft = wIdx % 2 === 0;
                      return (
                        <motion.span
                          key={word.id}
                          initial={{
                            opacity: 0,
                            x: isLeft ? -220 : 220,
                            scaleX: 1.8,
                            filter: 'blur(10px)',
                          }}
                          animate={{
                            opacity: 1,
                            x: isLeft ? [0, -5, 0, 3, 0] : [0, 5, 0, -3, 0],
                            scaleX: [1, 1.05, 0.98, 1],
                            filter: 'blur(0px)',
                          }}
                          exit={{
                            opacity: 0,
                            x: isLeft ? 150 : -150,
                            transition: { duration: 0.2 / speed }
                          }}
                          transition={{
                            opacity: { duration: 0.25 / speed },
                            filter: { duration: 0.3 / speed },
                            x: { repeat: Infinity, duration: 2.4 / speed, ease: 'easeInOut' },
                            scaleX: { repeat: Infinity, duration: 2.0 / speed, ease: 'easeInOut' },
                          }}
                          className="inline-block font-extrabold tracking-tight"
                          style={{
                            ...fontStyle,
                            fontSize: `${options.fontSize * 1.15}px`,
                          }}
                        >
                          {word.text}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                )}

                {/* 🌟 PRESET 3: 3D SPATIAL CARD FLIP (Xòe bài 3D -> Lơ lửng góc 3D xuyên suốt) */}
                {options.motionPreset === 'card-flip-3d' && (
                  <motion.div 
                    animate={{
                      rotateX: [-5, 5, -5],
                      rotateY: [-4, 4, -4],
                    }}
                    transition={{
                      duration: 3.4 / speed,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-[95%]"
                    style={{ perspective: '1200px' }}
                  >
                    {analyzedWords.map((word, wIdx) => (
                      <motion.span
                        key={word.id}
                        initial={{
                          opacity: 0,
                          rotateX: 85,
                          rotateY: (wIdx % 2 === 0 ? -1 : 1) * 45,
                          z: 180,
                          scale: 0.6,
                        }}
                        animate={{
                          opacity: 1,
                          rotateX: [0, -6, 6, 0],
                          rotateY: 0,
                          z: [0, 15, -10, 0],
                          scale: [1, 1.02, 0.98, 1],
                        }}
                        exit={{
                          opacity: 0,
                          rotateX: -80,
                          transition: { duration: 0.25 / speed }
                        }}
                        transition={{
                          opacity: { duration: 0.3 / speed },
                          rotateX: { repeat: Infinity, duration: 3.0 / speed, ease: 'easeInOut' },
                          z: { repeat: Infinity, duration: 2.8 / speed, ease: 'easeInOut' },
                          scale: { repeat: Infinity, duration: 2.6 / speed, ease: 'easeInOut' },
                        }}
                        className="inline-block font-black"
                        style={{
                          ...fontStyle,
                          fontSize: `${options.fontSize * 1.15}px`,
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        {word.text}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* 🌟 PRESET 4: ECHO GHOST STROBE (Quang sai RGB chớp nháy liên tục) */}
                {options.motionPreset === 'echo-ghost' && (
                  <motion.div 
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2.0 / speed,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-[95%]"
                  >
                    {analyzedWords.map((word, wIdx) => (
                      <motion.span
                        key={word.id}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.2 / speed } }}
                        transition={{ duration: 0.35 / speed, delay: (wIdx * 0.05) / speed }}
                        className="relative inline-block font-black"
                        style={{
                          ...fontStyle,
                          fontSize: `${options.fontSize * 1.2}px`,
                        }}
                      >
                        {/* 2 Echo ghost trails chớp nháy liên tục */}
                        <motion.span
                          animate={{ 
                            x: [-8, 4, -8], 
                            y: [-3, 3, -3], 
                            opacity: [0.2, 0.65, 0.2] 
                          }}
                          transition={{ 
                            duration: 1.4 / speed, 
                            repeat: Infinity, 
                            ease: 'easeInOut',
                            delay: (wIdx * 0.05) / speed 
                          }}
                          className="absolute inset-0 text-cyan-400 select-none pointer-events-none mix-blend-screen"
                        >
                          {word.text}
                        </motion.span>
                        <motion.span
                          animate={{ 
                            x: [8, -4, 8], 
                            y: [3, -3, 3], 
                            opacity: [0.2, 0.65, 0.2] 
                          }}
                          transition={{ 
                            duration: 1.4 / speed, 
                            repeat: Infinity, 
                            ease: 'easeInOut',
                            delay: (wIdx * 0.05) / speed 
                          }}
                          className="absolute inset-0 text-red-500 select-none pointer-events-none mix-blend-screen"
                        >
                          {word.text}
                        </motion.span>
                        <span className="relative z-10">{word.text}</span>
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* 🌟 PRESET 5: BRUTALIST GIANT (Chữ khổng lồ co giãn nhịp thở mạnh mẽ) */}
                {options.motionPreset === 'brutalist-giant' && (
                  <div className="flex flex-col items-center justify-center max-w-[95%] space-y-2">
                    {/* Hero Giant Word */}
                    {analyzedWords.filter(w => w.isHero).map((hero) => (
                      <motion.div
                        key={hero.id}
                        initial={{ scale: 0.5, y: 30, opacity: 0, rotate: -4 }}
                        animate={{ 
                          scale: [1, 1.04, 0.98, 1], 
                          y: 0, 
                          opacity: 1, 
                          rotate: [-2, -0.5, -3, -2] 
                        }}
                        exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.2 / speed } }}
                        transition={{ 
                          scale: { repeat: Infinity, duration: 2.2 / speed, ease: 'easeInOut' },
                          rotate: { repeat: Infinity, duration: 2.6 / speed, ease: 'easeInOut' },
                          opacity: { duration: 0.3 / speed },
                          y: { type: 'spring', damping: 13, stiffness: 320 * speed }
                        }}
                        className="font-black uppercase tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.45)] leading-none"
                        style={{
                          ...fontStyle,
                          fontSize: `${options.fontSize * 2.0}px`,
                        }}
                      >
                        {hero.text}
                      </motion.div>
                    ))}

                    {/* Secondary Words Row */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ 
                        opacity: [0.8, 1, 0.8], 
                        y: [-2, 2, -2] 
                      }}
                      transition={{ 
                        opacity: { repeat: Infinity, duration: 2.0 / speed, ease: 'easeInOut' },
                        y: { repeat: Infinity, duration: 2.2 / speed, ease: 'easeInOut' }
                      }}
                      className="flex flex-wrap justify-center gap-x-2 text-zinc-300 font-semibold uppercase tracking-wider"
                      style={{
                        ...fontStyle,
                        fontSize: `${options.fontSize * 0.85}px`,
                      }}
                    >
                      {analyzedWords.filter(w => !w.isHero).map(w => (
                        <span key={w.id}>{w.text}</span>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* 🌟 PRESET 6: ELASTIC SPRING (Nhịp nảy đàn hồi liên tục) */}
                {options.motionPreset === 'elastic-spring' && (
                  <motion.div
                    initial={{ scaleY: 2.3, scaleX: 0.5, opacity: 0, y: 40 }}
                    animate={{
                      scaleY: [1, 1.07, 0.95, 1],
                      scaleX: [1, 0.95, 1.05, 1],
                      opacity: 1,
                      y: [0, -3, 2, 0],
                    }}
                    exit={{ scaleY: 0.4, scaleX: 1.8, opacity: 0, transition: { duration: 0.2 / speed } }}
                    transition={{
                      opacity: { duration: 0.25 / speed },
                      scaleY: { repeat: Infinity, duration: 1.6 / speed, ease: 'easeInOut' },
                      scaleX: { repeat: Infinity, duration: 1.6 / speed, ease: 'easeInOut' },
                      y: { repeat: Infinity, duration: 1.8 / speed, ease: 'easeInOut' },
                    }}
                    className="max-w-[92%] font-black leading-tight select-none"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize * 1.2}px`,
                    }}
                  >
                    {currentLine.text}
                  </motion.div>
                )}

                {/* PRESET 7: HYPER-VELOCITY (Rung chấn động cơ xe đua liên hồi) */}
                {options.motionPreset === 'hyper-velocity' && (
                  <motion.div
                    initial={{ scale: 3.4, opacity: 0, filter: 'blur(16px)', y: -20 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: 'blur(0px)',
                      x: [-1.5, 2, -1.8, 1.2, 0],
                      y: [1, -1.5, 1.2, -0.8, 0],
                    }}
                    exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 / speed } }}
                    transition={{
                      opacity: { duration: 0.2 / speed },
                      scale: { duration: 0.3 / speed },
                      filter: { duration: 0.25 / speed },
                      x: { repeat: Infinity, duration: 0.15 / speed, ease: 'linear' },
                      y: { repeat: Infinity, duration: 0.15 / speed, ease: 'linear' },
                    }}
                    className="max-w-[95%] font-black leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize * 1.2}px`,
                    }}
                  >
                    <span className="relative z-10">{currentLine.text}</span>
                  </motion.div>
                )}

                {/* PRESET 8: LIQUID CHROME 3D (Lơ lửng bồng bềnh ánh kim) */}
                {options.motionPreset === 'liquid-chrome' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 30 }}
                    animate={{
                      opacity: 1,
                      y: [-7, 7, -7],
                      scale: [1, 1.03, 1],
                      rotateX: [-5, 5, -5],
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 / speed } }}
                    transition={{
                      opacity: { duration: 0.4 / speed },
                      y: { repeat: Infinity, duration: 3.4 / speed, ease: 'easeInOut' },
                      scale: { repeat: Infinity, duration: 3.6 / speed, ease: 'easeInOut' },
                      rotateX: { repeat: Infinity, duration: 3.8 / speed, ease: 'easeInOut' },
                    }}
                    className="max-w-[92%] font-extrabold leading-tight select-none"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize * 1.15}px`,
                    }}
                  >
                    <span className="inline-block text-chrome-shine drop-shadow-[0_4px_16px_rgba(255,255,255,0.35)]">
                      {currentLine.text}
                    </span>
                  </motion.div>
                )}

                {/* PRESET 9: VINTAGE FILM FADE (Rung nhẹ máy quay cầm tay 16mm) */}
                {options.motionPreset === 'film-burn' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.018, 0.99, 1],
                      x: [-1.2, 1.4, -0.8, 1.2, 0],
                      y: [0.8, -1.2, 0.6, -0.6, 0],
                      filter: 'blur(0px)',
                    }}
                    exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.3 / speed } }}
                    transition={{
                      opacity: { duration: 0.3 / speed },
                      filter: { duration: 0.35 / speed },
                      scale: { repeat: Infinity, duration: 1.8 / speed, ease: 'easeInOut' },
                      x: { repeat: Infinity, duration: 1.4 / speed, ease: 'easeInOut' },
                      y: { repeat: Infinity, duration: 1.5 / speed, ease: 'easeInOut' },
                    }}
                    className="max-w-[90%] leading-relaxed tracking-wider select-none"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize}px`,
                      color: '#fef3c7',
                      textShadow: '0 0 16px rgba(251, 146, 60, 0.5)',
                    }}
                  >
                    <div>{currentLine.text}</div>
                  </motion.div>
                )}

                {/* PRESET 10: LIQUID SMOKE (Khói sương bồng bềnh uốn lượn) */}
                {options.motionPreset === 'liquid-smoke' && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(28px)', scale: 0.92 }}
                    animate={{
                      opacity: [0.85, 1, 0.85],
                      filter: ['blur(0px)', 'blur(1.2px)', 'blur(0px)'],
                      scale: [1, 1.03, 0.98, 1],
                      y: [-6, 5, -6],
                    }}
                    exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05, transition: { duration: 0.3 / speed } }}
                    transition={{
                      opacity: { repeat: Infinity, duration: 3.5 / speed, ease: 'easeInOut' },
                      filter: { repeat: Infinity, duration: 4.0 / speed, ease: 'easeInOut' },
                      scale: { repeat: Infinity, duration: 3.8 / speed, ease: 'easeInOut' },
                      y: { repeat: Infinity, duration: 4.2 / speed, ease: 'easeInOut' },
                    }}
                    className="max-w-[92%] leading-relaxed select-none"
                    style={{ ...fontStyle, fontSize: `${options.fontSize}px` }}
                  >
                    {currentLine.text}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                className="text-zinc-600 text-xs font-mono tracking-widest uppercase flex flex-col items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-zinc-600 animate-ping" />
                <span>[ Chờ âm thanh & Lời bài hát ]</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
