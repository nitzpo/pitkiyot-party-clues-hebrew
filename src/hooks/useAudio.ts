
import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  const playSuccess = useCallback(() => {
    playTone(523, 0.2); // C5
    setTimeout(() => playTone(659, 0.2), 100); // E5
  }, [playTone]);

  const playSkip = useCallback(() => {
    playTone(294, 0.3, 'square'); // D4
  }, [playTone]);

  const playBuzzer = useCallback(() => {
    playTone(220, 1, 'sawtooth'); // A3
  }, [playTone]);

  const playTick = useCallback(() => {
    playTone(800, 0.05, 'square');
  }, [playTone]);

  const playUrgentTick = useCallback(() => {
    playTone(1000, 0.05, 'square');
  }, [playTone]);

  const playWin = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => playTone(note, 0.3), index * 150);
    });
  }, [playTone]);

  const playButtonClick = useCallback(() => {
    playTone(600, 0.1, 'sine');
  }, [playTone]);

  return {
    playSuccess,
    playSkip,
    playBuzzer,
    playTick,
    playUrgentTick,
    playWin,
    playButtonClick
  };
};
