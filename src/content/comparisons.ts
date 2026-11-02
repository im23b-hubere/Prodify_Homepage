import type { Comparison } from "./types";

const placeholderNote =
  "Demo placeholder. Both clips are synthetic test signals, the same pattern at two pitches. No Prodify plugin processed them.";

/** To go live: point src at real renders and set kind to "demo". The placeholder notice then disappears. */
export const comparisons: Comparison[] = [
  {
    id: "juice",
    label: "Drums",
    sourceName: "JUICE",
    kind: "placeholder",
    note: placeholderNote,
    before: { src: "/audio/placeholder/drums-a.wav", label: "Before" },
    after: { src: "/audio/placeholder/drums-b.wav", label: "After" },
  },
  {
    id: "vox",
    label: "Vocals",
    sourceName: "VOX",
    kind: "placeholder",
    note: placeholderNote,
    before: { src: "/audio/placeholder/vocal-a.wav", label: "Before" },
    after: { src: "/audio/placeholder/vocal-b.wav", label: "After" },
  },
  {
    id: "candy",
    label: "Loop",
    sourceName: "CANDY",
    kind: "placeholder",
    note: placeholderNote,
    before: { src: "/audio/placeholder/fx-a.wav", label: "Before" },
    after: { src: "/audio/placeholder/fx-b.wav", label: "After" },
  },
];

export function getComparison(id: string): Comparison | undefined {
  return comparisons.find((comparison) => comparison.id === id);
}
