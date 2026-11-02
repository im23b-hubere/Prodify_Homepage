/**
 * Shared commercial model. Release state and pricing are separate so a product
 * can be upcoming with a known price, or available and free, without new types.
 */
export type ReleaseStatus = "concept" | "in-development" | "available";

export type Pricing =
  | { kind: "tbd" }
  | { kind: "free" }
  | { kind: "paid"; amount: number; currency: "CHF" | "EUR" | "USD" };

export type Offer = {
  release: ReleaseStatus;
  pricing: Pricing;
  /** Set only when a working checkout or download exists. */
  actionUrl: string | null;
  /** Shown alongside the status, for example a release window once one is real. */
  note?: string;
};

export type Faq = { question: string; answer: string };

export type Spec = {
  label: string;
  /** Null renders as "Confirmed before release". Never guess a value. */
  value: string | null;
};

export type PluginSlug = "juice" | "vox" | "candy";

export type Plugin = {
  slug: PluginSlug;
  name: string;
  category: string;
  /** One sentence, used on cards and in search results. */
  summary: string;
  description: string;
  features: { title: string; detail: string }[];
  usage: { title: string; detail: string }[];
  specs: Spec[];
  faq: Faq[];
  offer: Offer;
  comparisonId: string;
};

export type SoundCategory = "Drums" | "Vocals" | "FX" | "Loops" | "One-Shots" | "Presets";

export type SoundMotif = "echo" | "bars" | "sweep" | "ring" | "impulse" | "grid";

export type SoundPack = {
  slug: string;
  name: string;
  category: SoundCategory;
  description: string;
  contents: string[];
  motif: SoundMotif;
  /** Changes the pattern drawn for the artwork. */
  seed: number;
  /** Real audio path once a preview exists. */
  previewSrc: string | null;
  offer: Offer;
};

export type Comparison = {
  id: string;
  label: string;
  sourceName: string;
  /**
   * "placeholder": synthetic clips that test the player. The UI must say so.
   * "demo": a real before and after, rendered through the shipping plugin.
   */
  kind: "placeholder" | "demo";
  note: string;
  before: { src: string; label: string };
  after: { src: string; label: string };
};
