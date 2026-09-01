/**
 * Tiny WebAudio "UI foley" kit — synthesized, zero assets.
 * Muted by default until the visitor opts in.
 */

let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(v: boolean) => void>();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isSoundEnabled() {
  return enabled;
}

export function subscribeSound(fn: (v: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (v) getCtx();
  listeners.forEach((l) => l(v));
  if (v) blip("on");
}

type Voice = "hover" | "click" | "on" | "reveal";

const VOICES: Record<Voice, { freq: number; to: number; dur: number; gain: number; type: OscillatorType }> = {
  hover: { freq: 1180, to: 1320, dur: 0.05, gain: 0.055, type: "sine" },
  click: { freq: 540, to: 220, dur: 0.11, gain: 0.12, type: "triangle" },
  on: { freq: 420, to: 880, dur: 0.16, gain: 0.1, type: "sine" },
  reveal: { freq: 300, to: 460, dur: 0.14, gain: 0.06, type: "sine" },
};

export function blip(voice: Voice = "hover") {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const cfg = VOICES[voice];
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4200;

  osc.type = cfg.type;
  osc.frequency.setValueAtTime(cfg.freq, now);
  osc.frequency.exponentialRampToValueAtTime(cfg.to, now + cfg.dur);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(cfg.gain, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + cfg.dur);

  osc.connect(filter).connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + cfg.dur + 0.02);
}
