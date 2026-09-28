/**
 * High-precision Audio Clock interpolator
 * Provides smooth, microsecond-accurate 60fps/120fps timestamps synchronized to HTML5 audio.
 * Eliminates browser audio buffer quantization jitter and stuttering.
 */

let lastAudioTime = -1;
let lastPerfTime = performance.now();

export function getSmoothAudioTime(audio: HTMLAudioElement): number {
  if (audio.paused) {
    lastAudioTime = audio.currentTime;
    lastPerfTime = performance.now();
    return audio.currentTime;
  }
  const currentAudio = audio.currentTime;
  const now = performance.now();

  // If browser audio element updated its time
  if (Math.abs(currentAudio - lastAudioTime) > 0.001) {
    lastAudioTime = currentAudio;
    lastPerfTime = now;
    return currentAudio;
  }

  // Smooth sub-millisecond interpolation between audio decoder ticks
  const dt = (now - lastPerfTime) / 1000;
  // Cap at 120ms to prevent drift in case audio stalls
  return currentAudio + Math.min(dt, 0.12);
}

export function resetAudioClock(time: number = 0) {
  lastAudioTime = time;
  lastPerfTime = performance.now();
}
