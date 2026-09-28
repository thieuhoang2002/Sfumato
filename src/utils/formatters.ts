export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00.0';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}

export function parseLyricsText(text: string) {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  return lines.map((line, idx) => ({
    id: `line-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    text: line,
    startTime: 0,
    endTime: 0,
    synced: false,
    words: line.split(/\s+/).map((word, wIdx) => ({
      id: `w-${idx}-${wIdx}`,
      text: word,
      startTime: 0,
      endTime: 0
    }))
  }));
}
