import { useCallback, useRef, useState } from 'react';

function createAudioContext() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function playTone(ctx: AudioContext, freq: number, type: OscillatorType, duration: number, gain = 0.3, delay = 0) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export function useSound() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = createAudioContext();
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    playTone(ctx, 523, 'sine', 0.15, 0.3, 0);
    playTone(ctx, 659, 'sine', 0.15, 0.3, 0.12);
    playTone(ctx, 784, 'sine', 0.25, 0.35, 0.24);
  }, [muted, getCtx]);

  const playWrong = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    playTone(ctx, 300, 'sawtooth', 0.1, 0.2, 0);
    playTone(ctx, 250, 'sawtooth', 0.15, 0.2, 0.1);
  }, [muted, getCtx]);

  const playWin = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const melody = [523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      playTone(ctx, freq, 'sine', 0.2, 0.4, i * 0.15);
    });
    playTone(ctx, 1047, 'sine', 0.5, 0.5, 0.7);
  }, [muted, getCtx]);

  const playClick = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    playTone(ctx, 800, 'sine', 0.05, 0.15, 0);
  }, [muted, getCtx]);

  const playFlip = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    playTone(ctx, 440, 'sine', 0.08, 0.1, 0);
  }, [muted, getCtx]);

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  return { playCorrect, playWrong, playWin, playClick, playFlip, muted, toggleMute };
}
