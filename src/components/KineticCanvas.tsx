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
          className="relative z-10 w-full h-full px-6 py-12 flex flex-col justify-center items-center text-center overflow-hidden"
          style={{ textAlign: options.alignment }}
        >
          <AnimatePresence mode="wait">
            {currentLine ? (
              <motion.div
                key={currentLine.id}
                className="w-full flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                {/* 🌟 PRESET 1: SHATTER & ASSEMBLE (Tách rời tản mác 4 phương -> Hút xoáy hợp nhất va đập) */}
                {options.motionPreset === 'shatter-assemble' && (
                  <div className="flex flex-wrap justify-center items-center gap-x-3.5 gap-y-2.5 max-w-[95%]">
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
                            y: 0,
                            scale: 1,
                            rotate: 0,
                            filter: 'blur(0px)',
                          }}
                          exit={{
                            opacity: 0,
                            scale: 2.5,
                            filter: 'blur(16px)',
                            transition: { duration: 0.25 },
                          }}
                          transition={{
                            type: 'spring',
                            damping: 13,
                            stiffness: 340,
                            mass: 0.7,
                            delay: wIdx * 0.04,
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
                  </div>
                )}

                {/* 🌟 PRESET 2: CROSS-DRIFT COLLISION (Đan chéo đối kháng 2 bên lao vào nhau xé gió) */}
                {options.motionPreset === 'cross-drift' && (
                  <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-[95%]">
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
                            x: 0,
                            scaleX: 1,
                            filter: 'blur(0px)',
                          }}
                          exit={{
                            opacity: 0,
                            x: isLeft ? 150 : -150,
                            transition: { duration: 0.2 }
                          }}
                          transition={{
                            type: 'spring',
                            damping: 15,
                            stiffness: 360,
                            delay: wIdx * 0.05,
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
                  </div>
                )}

                {/* 🌟 PRESET 3: 3D SPATIAL CARD FLIP (Xòe bài 3D trong không gian -> Khóa cạch vào vị trí) */}
                {options.motionPreset === 'card-flip-3d' && (
                  <div 
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
                          rotateX: 0,
                          rotateY: 0,
                          z: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          rotateX: -80,
                          transition: { duration: 0.25 }
                        }}
                        transition={{
                          type: 'spring',
                          damping: 14,
                          stiffness: 280,
                          delay: wIdx * 0.06,
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
                  </div>
                )}

                {/* 🌟 PRESET 4: ECHO GHOST STROBE (Bóng ma phân thân 4 hướng -> Thu hồi chớp nhoáng) */}
                {options.motionPreset === 'echo-ghost' && (
                  <div className="relative flex flex-wrap justify-center items-center gap-x-3 gap-y-2 max-w-[95%]">
                    {analyzedWords.map((word, wIdx) => (
                      <motion.span
                        key={word.id}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.35, delay: wIdx * 0.05 }}
                        className="relative inline-block font-black"
                        style={{
                          ...fontStyle,
                          fontSize: `${options.fontSize * 1.2}px`,
                        }}
                      >
                        {/* 4 Echo ghost trails */}
                        <motion.span
                          initial={{ x: -16, y: -12, opacity: 0.6 }}
                          animate={{ x: 0, y: 0, opacity: 0 }}
                          transition={{ duration: 0.5, delay: wIdx * 0.05 + 0.1 }}
                          className="absolute inset-0 text-cyan-400 select-none pointer-events-none mix-blend-screen"
                        >
                          {word.text}
                        </motion.span>
                        <motion.span
                          initial={{ x: 16, y: 12, opacity: 0.6 }}
                          animate={{ x: 0, y: 0, opacity: 0 }}
                          transition={{ duration: 0.5, delay: wIdx * 0.05 + 0.1 }}
                          className="absolute inset-0 text-red-500 select-none pointer-events-none mix-blend-screen"
                        >
                          {word.text}
                        </motion.span>
                        <span className="relative z-10">{word.text}</span>
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* 🌟 PRESET 5: BRUTALIST GIANT ASYMMETRY (Bố cục bất đối xứng cực hạn - Swiss Style) */}
                {options.motionPreset === 'brutalist-giant' && (
                  <div className="flex flex-col items-center justify-center max-w-[95%] space-y-2">
                    {/* Hero Giant Word */}
                    {analyzedWords.filter(w => w.isHero).map((hero) => (
                      <motion.div
                        key={hero.id}
                        initial={{ scale: 0.5, y: 30, opacity: 0, rotate: -4 }}
                        animate={{ scale: 1, y: 0, opacity: 1, rotate: -2 }}
                        exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', damping: 13, stiffness: 320 }}
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
                      animate={{ opacity: 0.85, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
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

                {/* 🌟 PRESET 6: ELASTIC SPRING (Co giãn dây cao su đàn hồi & nhịp thở vật lý) */}
                {options.motionPreset === 'elastic-spring' && (
                  <motion.div
                    initial={{ scaleY: 2.3, scaleX: 0.5, opacity: 0, y: 40 }}
                    animate={{
                      scaleY: 1,
                      scaleX: 1,
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        damping: 10,
                        stiffness: 280,
                        mass: 0.9,
                      }
                    }}
                    exit={{ scaleY: 0.4, scaleX: 1.8, opacity: 0, transition: { duration: 0.2 } }}
                    className="max-w-[92%] font-black leading-tight select-none"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize * 1.2}px`,
                    }}
                  >
                    {currentLine.text}
                  </motion.div>
                )}

                {/* PRESET 7: HYPER-VELOCITY RUSH */}
                {options.motionPreset === 'hyper-velocity' && (
                  <motion.div
                    initial={{ scale: 3.4, opacity: 0, filter: 'blur(16px)', y: -20 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: 'blur(0px)',
                      y: 0,
                      transition: {
                        type: 'spring',
                        damping: 14,
                        stiffness: 320,
                        mass: 0.8,
                      }
                    }}
                    exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }}
                    className="max-w-[95%] font-black leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    style={{
                      ...fontStyle,
                      fontSize: `${options.fontSize * 1.2}px`,
                    }}
                  >
                    <div className="relative">
                      {options.chromaticAberration && (
                        <>
                          <span className="absolute -left-1 top-0 text-red-500 opacity-60 mix-blend-screen select-none pointer-events-none">
                            {currentLine.text}
                          </span>
                          <span className="absolute -right-1 top-0 text-cyan-400 opacity-60 mix-blend-screen select-none pointer-events-none">
                            {currentLine.text}
                          </span>
                        </>
                      )}
                      <span className="relative z-10">{currentLine.text}</span>
                    </div>
                  </motion.div>
                )}

                {/* PRESET 8: LIQUID CHROME (Tráng gương kim loại bạc 3D) */}
                {options.motionPreset === 'liquid-chrome' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    className="max-w-[92%] font-extrabold animate-float leading-tight select-none"
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

                {/* PRESET 9: VINTAGE 16MM FILM BURN */}
                {options.motionPreset === 'film-burn' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
                    animate={{
                      opacity: 1,
                      scale: [1.02, 0.99, 1.01, 1],
                      x: [-1.5, 1.5, -0.5, 0],
                      filter: 'blur(0px)',
                      transition: { duration: 0.6, ease: 'easeOut' }
                    }}
                    exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.3 } }}
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

                {/* PRESET 10: LIQUID SMOKE (Khói mờ Sfumato) */}
                {options.motionPreset === 'liquid-smoke' && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(28px)', scale: 0.92, letterSpacing: '0.22em' }}
                    animate={{
                      opacity: 1,
                      filter: 'blur(0px)',
                      scale: 1,
                      letterSpacing: `${options.letterSpacing}em`,
                      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
                    }}
                    exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
                    className="max-w-[92%] leading-relaxed select-none animate-pulse-subtle"
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
