import type { Offer, SoundCategory, SoundPack } from "./types";

export const soundCategories: SoundCategory[] = ["Drums", "Vocals", "FX", "Loops", "One-Shots", "Presets"];

const concept: Offer = { release: "concept", pricing: { kind: "tbd" }, actionUrl: null };

/** Provisional concepts. Pack names and contents change when real packs are finished. */
export const soundPacks: SoundPack[] = [
  {
    slug: "concrete-kicks",
    name: "Concrete Kicks",
    category: "Drums",
    description: "Short, heavy kicks and tops for tech house and techno.",
    contents: ["Kicks", "Claps", "Hats", "Percussion"],
    motif: "echo",
    seed: 3,
    previewSrc: null,
    offer: concept,
  },
  {
    slug: "breath-control",
    name: "Breath Control",
    category: "Vocals",
    description: "Dry phrases, breaths and spoken fragments, ready to cut up.",
    contents: ["Phrases", "Words", "Breaths"],
    motif: "bars",
    seed: 11,
    previewSrc: null,
    offer: concept,
  },
  {
    slug: "after-hours-fx",
    name: "After Hours FX",
    category: "FX",
    description: "Risers, downlifters and impacts for dark, slow transitions.",
    contents: ["Risers", "Downlifters", "Impacts", "Atmospheres"],
    motif: "sweep",
    seed: 5,
    previewSrc: null,
    offer: concept,
  },
  {
    slug: "groove-stock",
    name: "Groove Stock",
    category: "Loops",
    description: "Top loops and percussion grooves that sit on a house swing.",
    contents: ["Top loops", "Percussion loops", "Bass loops"],
    motif: "ring",
    seed: 8,
    previewSrc: null,
    offer: concept,
  },
  {
    slug: "single-hit",
    name: "Single Hit",
    category: "One-Shots",
    description: "Stabs, chords and tonal hits, each tuned and trimmed.",
    contents: ["Stabs", "Chords", "Tonal hits"],
    motif: "impulse",
    seed: 2,
    previewSrc: null,
    offer: concept,
  },
  {
    slug: "init-patch",
    name: "Init Patch",
    category: "Presets",
    description: "Synth presets for melodic techno and progressive house.",
    contents: ["Basses", "Leads", "Pads"],
    motif: "grid",
    seed: 13,
    previewSrc: null,
    offer: concept,
  },
];

export function getSoundPack(slug: string): SoundPack | undefined {
  return soundPacks.find((pack) => pack.slug === slug);
}
