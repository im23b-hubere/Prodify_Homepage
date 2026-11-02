/**
 * Generates the synthetic clips that exercise the comparison player until real
 * demos exist. Each pair is the same pattern at two pitches. Nothing here has
 * been through a Prodify plugin, and the site labels the clips as placeholders.
 *
 * Run: npm run audio:placeholder
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 22050;
const BPM = 124;
const BARS = 2;
const STEPS = 16 * BARS;
const stepLength = 60 / BPM / 4;
const length = Math.round(STEPS * stepLength * SAMPLE_RATE);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio", "placeholder");

function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32 - 0.5;
  };
}

function addHit(buffer, startStep, render) {
  const start = Math.round(startStep * stepLength * SAMPLE_RATE);
  for (let i = start; i < buffer.length; i += 1) {
    const value = render((i - start) / SAMPLE_RATE);
    if (value === null) break;
    buffer[i] += value;
  }
}

const kick = (pitch) => (t) => {
  if (t > 0.34) return null;
  const frequency = (46 + 120 * Math.exp(-t * 34)) * pitch;
  return Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 8.5) * 0.9;
};

const hat = (random) => (t) => {
  if (t > 0.05) return null;
  return random() * Math.exp(-t * 95) * 0.3;
};

const tone = (frequency, decay, level) => (t) => {
  if (t > 0.6) return null;
  return Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * decay) * level;
};

const patterns = {
  drums(pitch, buffer) {
    const random = createRandom(7);
    for (let step = 0; step < STEPS; step += 4) addHit(buffer, step, kick(pitch));
    for (let step = 2; step < STEPS; step += 4) addHit(buffer, step, hat(random));
  },
  vocal(pitch, buffer) {
    [0, 3, 6, 10, 16, 19, 22, 26].forEach((step, index) => {
      const note = [220, 247, 196, 165][index % 4] * pitch;
      addHit(buffer, step, tone(note, 5, 0.42));
      addHit(buffer, step, tone(note * 2, 9, 0.16));
    });
  },
  fx(pitch, buffer) {
    for (let step = 0; step < STEPS; step += 1) {
      if (step % 3 === 0 || step % 8 === 7) {
        addHit(buffer, step, tone((300 + step * 38) * pitch, 16, 0.36));
      }
    }
  },
};

function toWav(samples) {
  const dataSize = samples.length * 2;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => wav.writeInt16LE(Math.round(sample * 32767), 44 + index * 2));
  return wav;
}

/** Normalises peak level so neither clip is simply louder than the other. */
function normalise(samples) {
  const peak = samples.reduce((max, value) => Math.max(max, Math.abs(value)), 0) || 1;
  return samples.map((value) => (value / peak) * 0.8);
}

mkdirSync(outDir, { recursive: true });
for (const [name, render] of Object.entries(patterns)) {
  for (const [side, pitch] of [["a", 1], ["b", 1.5]]) {
    const samples = new Float32Array(length);
    render(pitch, samples);
    writeFileSync(join(outDir, `${name}-${side}.wav`), toWav(normalise(samples)));
  }
}
console.log(`Wrote ${Object.keys(patterns).length * 2} clips to ${outDir}`);
