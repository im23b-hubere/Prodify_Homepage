import type { Faq, Plugin, Spec } from "./types";

const pendingSpecs: Spec[] = [
  { label: "Plugin formats", value: null },
  { label: "macOS", value: null },
  { label: "Windows", value: null },
  { label: "Compatible hosts", value: null },
  { label: "CPU and latency", value: null },
  { label: "Licence", value: null },
];

const sharedFaq: Faq[] = [
  {
    question: "Can I buy this yet?",
    answer:
      "No. It is still in development, so there is no checkout and no download. Join the waitlist to hear when it is ready.",
  },
  {
    question: "Which DAWs and formats will it support?",
    answer:
      "We publish formats and system requirements once they have been tested. Until then the specification table stays open on purpose.",
  },
];

export const plugins: Plugin[] = [
  {
    slug: "juice",
    name: "JUICE",
    category: "Drum enhancer",
    summary: "A creative drum enhancer that adds punch, character and energy to drum sounds.",
    description:
      "One large control for the sound you want, and a few small ones for how you get there. JUICE is planned for kicks, tops and full drum buses that need more impact without a long chain.",
    features: [
      { title: "One macro", detail: "Turn up punch, body and saturation together from a single control." },
      { title: "Punch and body", detail: "Shape the attack and the tail of a hit separately." },
      { title: "Character modes", detail: "Choose how the signal saturates: tape, tube or hard clip." },
      { title: "Mix control", detail: "Blend the enhanced signal back with the dry drum." },
    ],
    usage: [
      { title: "A kick that disappears in the drop", detail: "Add attack and a little body so it holds next to the bassline." },
      { title: "Thin one-shots", detail: "Give a flat sample more weight before it reaches the mix bus." },
      { title: "A full drum group", detail: "Add energy to the whole group, then pull it back with Mix." },
    ],
    specs: pendingSpecs,
    faq: [
      ...sharedFaq,
      {
        question: "Does the interface on this page work?",
        answer:
          "The controls move and the display responds, but no audio runs through it. It shows the planned design, and the final plugin may differ.",
      },
    ],
    offer: { release: "in-development", pricing: { kind: "tbd" }, actionUrl: null },
    comparisonId: "juice",
  },
  {
    slug: "vox",
    name: "VOX",
    category: "Vocal processor",
    summary: "A creative vocal processor for modern vocal effects and experimental manipulation.",
    description:
      "VOX is planned for the moment a vocal stops being a vocal and becomes part of the track. Shift it, reshape it, chop it and spread it from one screen.",
    features: [
      { title: "Formant and shift pad", detail: "Move across one surface to change pitch and character together." },
      { title: "Pitch view", detail: "See the phrase you are working on and where the notes land." },
      { title: "Chop", detail: "Cut a phrase into rhythmic pieces that follow the session tempo." },
      { title: "Spread", detail: "Widen a vocal without a separate stereo tool." },
    ],
    usage: [
      { title: "A hook from a spoken line", detail: "Pitch, chop and repeat a phrase until it works as a riff." },
      { title: "Background texture", detail: "Push the formant away from the source and sit it behind the lead." },
      { title: "One-word stabs", detail: "Turn a single word into a rhythmic element for tech house grooves." },
    ],
    specs: pendingSpecs,
    faq: sharedFaq,
    offer: { release: "concept", pricing: { kind: "tbd" }, actionUrl: null },
    comparisonId: "vox",
  },
  {
    slug: "candy",
    name: "CANDY",
    category: "Ear candy generator",
    summary: "An ear candy tool for adding movement, transitions and interesting sound details.",
    description:
      "CANDY is planned as a pattern of small events: stutters, reverses, risers and glitches that land on the grid and change each time you generate a new one.",
    features: [
      { title: "Six effect lanes", detail: "Riser, stutter, reverse, glitch, tape stop and sparkle on one grid." },
      { title: "Generate", detail: "Create a new pattern, then keep the steps you like." },
      { title: "Chance", detail: "Decide how often a step really fires." },
      { title: "Spread and rate", detail: "Set the stereo width and the speed of each event." },
    ],
    usage: [
      { title: "An eight-bar loop that feels static", detail: "Add small changes without editing automation by hand." },
      { title: "Transitions", detail: "Build a fill into the next section from a single loop." },
      { title: "Top-end detail", detail: "Scatter quiet events above the groove to keep it moving." },
    ],
    specs: pendingSpecs,
    faq: sharedFaq,
    offer: { release: "concept", pricing: { kind: "tbd" }, actionUrl: null },
    comparisonId: "candy",
  },
];

export function getPlugin(slug: string): Plugin | undefined {
  return plugins.find((plugin) => plugin.slug === slug);
}
