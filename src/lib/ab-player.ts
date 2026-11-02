export type Side = "before" | "after";

const SWITCH_SECONDS = 0.006;

/** Decodes without an AudioContext, so nothing needs a user gesture until playback. */
export async function decodeClip(url: string, signal: AbortSignal): Promise<AudioBuffer> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Could not load ${url}`);
  const data = await response.arrayBuffer();
  const context = new OfflineAudioContext(1, 1, 44100);
  return context.decodeAudioData(data);
}

/** Reduces a clip to a bar per bucket, from 0 to 1. */
export function getPeaks(buffer: AudioBuffer, bars: number): number[] {
  const channel = buffer.getChannelData(0);
  const size = Math.floor(channel.length / bars);
  const peaks: number[] = [];
  for (let bar = 0; bar < bars; bar += 1) {
    let peak = 0;
    for (let index = bar * size; index < (bar + 1) * size; index += 1) {
      peak = Math.max(peak, Math.abs(channel[index] ?? 0));
    }
    peaks.push(peak);
  }
  const max = Math.max(...peaks, 0.001);
  return peaks.map((peak) => peak / max);
}

/**
 * Plays both clips in sync from one clock and crossfades between them, so a
 * switch stays at the same musical position with no gap or click.
 */
export class ABPlayer {
  private context: AudioContext | null = null;
  private nodes: { source: AudioBufferSourceNode; gain: GainNode }[] = [];
  private startedAt = 0;
  private offset = 0;
  private side: Side;
  readonly duration: number;

  constructor(
    private readonly buffers: Record<Side, AudioBuffer>,
    side: Side,
  ) {
    this.side = side;
    this.duration = Math.min(buffers.before.duration, buffers.after.duration);
  }

  get playing() {
    return this.nodes.length > 0;
  }

  get position() {
    if (!this.playing || !this.context) return this.offset;
    return (this.offset + Math.max(0, this.context.currentTime - this.startedAt)) % this.duration;
  }

  async play() {
    if (this.playing) return;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
    const context = this.context;
    const startAt = context.currentTime + 0.02;
    this.nodes = (["before", "after"] as const).map((side) => {
      const source = context.createBufferSource();
      source.buffer = this.buffers[side];
      source.loop = true;
      source.loopEnd = this.duration;
      const gain = context.createGain();
      gain.gain.value = side === this.side ? 1 : 0;
      source.connect(gain).connect(context.destination);
      source.start(startAt, this.offset);
      return { source, gain };
    });
    this.startedAt = startAt;
  }

  pause() {
    this.offset = this.position;
    this.stopNodes();
  }

  async seek(seconds: number) {
    const wasPlaying = this.playing;
    this.stopNodes();
    this.offset = Math.min(Math.max(seconds, 0), this.duration - 0.01);
    if (wasPlaying) await this.play();
  }

  setSide(side: Side) {
    this.side = side;
    if (!this.context || !this.playing) return;
    const now = this.context.currentTime;
    this.nodes.forEach(({ gain }, index) => {
      const target = (index === 0 ? "before" : "after") === side ? 1 : 0;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(target, now + SWITCH_SECONDS);
    });
  }

  dispose() {
    this.stopNodes();
    void this.context?.close();
    this.context = null;
  }

  private stopNodes() {
    this.nodes.forEach(({ source, gain }) => {
      source.stop();
      source.disconnect();
      gain.disconnect();
    });
    this.nodes = [];
  }
}
