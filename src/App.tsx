import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { KineticCanvas } from './components/KineticCanvas';
import { LyricsEditor } from './components/LyricsEditor';
import { StyleControls } from './components/StyleControls';
import { WaveformTimeline } from './components/WaveformTimeline';
import { ExportModal } from './components/ExportModal';
import { FullscreenPreview } from './components/FullscreenPreview';
import { Maximize2 } from 'lucide-react';
import { LyricLine, StylingOptions, AspectRatio, MotionPreset } from './types';
import { parseLyricsText } from './utils/formatters';

const DEFAULT_SAMPLE_LYRICS = `Đêm buông xuống thành phố không còn ai
Nét cọ ai vừa vẽ vết khói dài
Lời thì thầm tan biến trong hư không
Để lại khoảng lặng mênh mông...
Giữ trọn từng nét chữ của riêng mình
Sfumato - chuyển động của tâm linh.`;

export function App() {
  // Styling state (WOW Disruptive Defaults)
  const [styling, setStyling] = useState<StylingOptions>({
    fontFamily: 'Unbounded',
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.02,
    textColor: '#FFFFFF',
    glowEffect: true,
    glowIntensity: 0.45,
    lineHeight: 1.35,
    alignment: 'center',
    motionPreset: 'shatter-assemble',
    aspectRatio: '9:16',
    showSafeZone: true,
    enableFilmGrain: false,
    filmBurnEffect: false,
    chromeReflect: true,
    cameraShake: false,
    crtScanlines: false,
    heroWordAccent: 'scale',
    chromaticAberration: false,
    textCase: 'none',
  });

  // Audio & Playback state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(24); // default duration
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lyrics state
  const [lyrics, setLyrics] = useState<LyricLine[]>(() => {
    const parsed = parseLyricsText(DEFAULT_SAMPLE_LYRICS);
    return parsed.map((item, idx) => ({
      ...item,
      startTime: idx * 3.8,
      endTime: idx * 3.8 + 3.4,
      synced: true,
    }));
  });

  // Tap-to-Sync Engine state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentSyncIndex, setCurrentSyncIndex] = useState<number>(0);

  // Panel visibility toggles
  const [showLyricsPanel, setShowLyricsPanel] = useState<boolean>(true);
  const [showStylePanel, setShowStylePanel] = useState<boolean>(true);

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Fullscreen Preview state
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Initialize synth ambient audio preview if user doesn't have an audio file immediately
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsSyncing(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // 60fps smooth audio time update loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (audioRef.current && audioUrl) {
        setCurrentTime(audioRef.current.currentTime);
      } else if (!audioUrl) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      lastTime = now;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, audioUrl, duration]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = time;
    }
  };

  const handleReset = () => {
    handleSeek(0);
    if (isPlaying) togglePlay();
  };

  const handleUploadAudio = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
    }
  };

  // Stamp a specific line with the current timestamp
  const handleStampLine = (index: number, time: number) => {
    setLyrics((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          startTime: parseFloat(time.toFixed(2)),
          endTime: parseFloat((time + 3.0).toFixed(2)),
          synced: true,
        };
      }
      return next;
    });
  };

  // Create a brand new lyric line on Space or Click
  const handleAddNewLine = (time: number = currentTime) => {
    const fixedTime = parseFloat(time.toFixed(2));
    setLyrics((prev) => {
      const sorted = [...prev].sort((a, b) => a.startTime - b.startTime);
      
      // Tìm câu liền trước fixedTime và kéo dài endTime của nó tới tận fixedTime
      const prevItems = sorted.filter((l) => l.startTime < fixedTime);
      if (prevItems.length > 0) {
        const lastPrev = prevItems[prevItems.length - 1];
        lastPrev.endTime = fixedTime;
      }

      // Tìm xem có câu sau fixedTime không để đặt endTime cho câu mới
      const nextItems = sorted.filter((l) => l.startTime > fixedTime);
      const nextStartTime = nextItems.length > 0 ? nextItems[0].startTime : Math.max(fixedTime + 5.0, duration);

      const newLine: LyricLine = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        text: '',
        startTime: fixedTime,
        endTime: parseFloat(nextStartTime.toFixed(2)),
        synced: true,
        words: [],
      };

      const result = [...sorted, newLine].sort((a, b) => a.startTime - b.startTime);
      return result;
    });
  };

  // Tự động nối liền tất cả các ô lyrics hiện có (câu này nối tiếp câu kia không bị ngắt)
  const handleChainLyrics = () => {
    setLyrics((prev) => {
      const sorted = [...prev].sort((a, b) => a.startTime - b.startTime);
      return sorted.map((line, idx) => {
        const next = sorted[idx + 1];
        if (next) {
          return {
            ...line,
            endTime: next.startTime,
            synced: true,
          };
        }
        return {
          ...line,
          endTime: Math.max(line.endTime, duration > line.startTime ? parseFloat(duration.toFixed(2)) : line.startTime + 5),
          synced: true,
        };
      });
    });
  };

  // Delete a line by id
  const handleDeleteLine = (id: string) => {
    setLyrics((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit text of a line
  const handleEditLineText = (id: string, text: string) => {
    setLyrics((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            text,
            words: text.split(/\s+/).filter(Boolean).map((word, wIdx) => ({
              id: `w-${item.id}-${wIdx}`,
              text: word,
              startTime: item.startTime,
              endTime: item.endTime,
            })),
          };
        }
        return item;
      })
    );
  };

  // Clear all lyrics
  const handleClearAll = () => {
    setLyrics([]);
  };

  // Spacebar listener: Create new line OR stamp existing OR play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea or input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();

        if (isSyncing) {
          handleAddNewLine(currentTime);
        } else {
          togglePlay();
        }
      } else if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsFullscreenPreview((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSyncing, currentTime, lyrics.length, isPlaying, audioUrl]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-zinc-100 overflow-hidden font-sans select-none">
      {/* 1. Header Bar */}
      <Header
        aspectRatio={styling.aspectRatio}
        onAspectRatioChange={(ratio) => setStyling((prev) => ({ ...prev, aspectRatio: ratio }))}
        motionPreset={styling.motionPreset}
        onPresetChange={(preset) => setStyling((prev) => ({ ...prev, motionPreset: preset }))}
        showSafeZone={styling.showSafeZone}
        onToggleSafeZone={() => setStyling((prev) => ({ ...prev, showSafeZone: !prev.showSafeZone }))}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 2. Main Workspace (3-Column Rigid Studio Layout) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Lyrics Studio (320px fixed) */}
        {showLyricsPanel && (
          <aside className="w-80 flex-shrink-0 h-full border-r border-zinc-900 bg-zinc-950 flex flex-col z-20 transition-all">
            <LyricsEditor
              lyrics={lyrics}
              currentTime={currentTime}
              currentSyncIndex={currentSyncIndex}
              isSyncing={isSyncing}
              onUpdateLyrics={setLyrics}
              onSeek={handleSeek}
              onSetSyncIndex={setCurrentSyncIndex}
              onToggleSyncMode={() => {
                setIsSyncing(!isSyncing);
                if (!isPlaying) togglePlay();
              }}
              onStampLine={handleStampLine}
              onAddNewLine={handleAddNewLine}
              onDeleteLine={handleDeleteLine}
              onEditLineText={handleEditLineText}
              onClearAll={handleClearAll}
              onChainLyrics={handleChainLyrics}
            />
          </aside>
        )}

        {/* Center: Pure Black Canvas (#000000) Preview - TRỌNG TÂM CỐT LÕI */}
        <main className="flex-1 min-w-0 h-full flex flex-col bg-[#070709] relative overflow-hidden items-center justify-center p-4 z-10">
          {/* Top Quick Bar for Center Canvas */}
          <div className="absolute top-3 inset-x-4 flex justify-between items-center pointer-events-none z-30">
            <button
              onClick={() => setShowLyricsPanel(!showLyricsPanel)}
              className="pointer-events-auto px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition backdrop-blur flex items-center space-x-1"
              title="Ẩn / Hiện bảng Lyrics bên trái"
            >
              <span>{showLyricsPanel ? '◀ Thu gọn Lời' : '▶ Mở bảng Lời'}</span>
            </button>

            <div className="flex items-center space-x-2 pointer-events-auto">
              <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase bg-black/60 px-2.5 py-1 rounded-full border border-zinc-800 backdrop-blur">
                CANVAS PREVIEW • {styling.aspectRatio}
              </div>
              <button
                onClick={() => setIsFullscreenPreview(true)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition backdrop-blur flex items-center space-x-1 shadow-sm"
                title="Xem preview toàn màn hình (Phím tắt F)"
              >
                <Maximize2 size={12} className="text-emerald-400" />
                <span>Toàn màn hình (F)</span>
              </button>
            </div>

            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className="pointer-events-auto px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition backdrop-blur flex items-center space-x-1"
              title="Ẩn / Hiện bảng Thiết kế bên phải"
            >
              <span>{showStylePanel ? 'Thu gọn Thiết kế ▶' : '◀ Mở Thiết kế'}</span>
            </button>
          </div>

          {/* The Kinetic Canvas Box */}
          <KineticCanvas
            lyrics={lyrics}
            currentTime={currentTime}
            options={styling}
          />
        </main>

        {/* Right Panel: Art Direction Studio (320px fixed) */}
        {showStylePanel && (
          <aside className="w-80 flex-shrink-0 h-full border-l border-zinc-900 bg-zinc-950 flex flex-col z-20 transition-all">
            <StyleControls
              options={styling}
              onChange={setStyling}
            />
          </aside>
        )}
      </div>

      {/* 3. Bottom Timeline & Audio Player */}
      <WaveformTimeline
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        lyrics={lyrics}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onUploadAudio={handleUploadAudio}
        onReset={handleReset}
      />

      {/* 4. Export Video Modal (CapCut 1-click ready) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        lyrics={lyrics}
        options={styling}
        duration={duration}
        audioUrl={audioUrl}
      />

      {/* 5. Fullscreen Realtime Preview (Rạp chiếu phim / Điện thoại thực tế) */}
      <FullscreenPreview
        isOpen={isFullscreenPreview}
        onClose={() => setIsFullscreenPreview(false)}
        lyrics={lyrics}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        options={styling}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
      />
    </div>
  );
}

export default App;
