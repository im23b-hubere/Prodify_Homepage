/**
 * Facts here come from the app source: mobile/store/STORE_METADATA.en-US.md,
 * docs/premium-entitlements.md and GLOSSARY.md. Update them together.
 */
export const prodifyApp = {
  tagline: "Build your studio consistency.",
  summary:
    "Prodify helps music producers stay consistent in the studio. Time your sessions, protect your streak and watch your skills grow.",
  access: "A subscription unlocks the whole app. There is no free tier.",
  /** Set when the public listings are live. Until then the page says the release is close. */
  appStoreUrl: null as string | null,
  playStoreUrl: null as string | null,
  releaseNote: "Launching soon",
  features: [
    { title: "Sessions", detail: "Track every session with type, duration, mood and notes." },
    { title: "Streaks and weekly goals", detail: "Set a weekly session target and protect your streak." },
    { title: "Stats", detail: "Follow performance trends, your activity heatmap and personal records." },
    { title: "Skill tree", detail: "Put session time on the areas and focuses you trained and watch them level up." },
    { title: "Friends and challenges", detail: "Pick a buddy, follow the activity feed and challenge your friends." },
    { title: "Forecast and weekly review", detail: "See if the week is on track, then get a Sunday review for the next one." },
  ],
  sessionTypes: [
    "Production",
    "Beat Making",
    "Mixing",
    "Mastering",
    "Mix & Master",
    "Sound Design",
    "Recording",
    "Songwriting",
    "Arrangement",
    "Vocal Production",
    "Learning",
  ],
  screens: {
    sessionTypes: { src: "/app/session-types.webp", alt: "New Session screen listing session types such as Production, Beat Making, Mixing and Mastering." },
    sessionLogged: { src: "/app/session-logged.webp", alt: "Session logged screen showing a 32 minute Mastering session and a 17 day streak." },
    stats: { src: "/app/stats.webp", alt: "Your stats screen showing 14 of 7 sessions this week and studio activity." },
    skillTree: { src: "/app/skill-tree.webp", alt: "Skill tree screen with areas and focuses connected as a glowing branching map." },
    friends: { src: "/app/friends.webp", alt: "Friends screen with a challenge request and a weekly ranking." },
    ranks: { src: "/app/ranks.webp", alt: "Your rank screen showing the climb to the Hall of Sound rank." },
  },
  films: [
    { src: "/app/demo_01.mp4", poster: "/app/session-focus.webp", title: "Log a session" },
    { src: "/app/demo_02.mp4", poster: "/app/skill-tree.webp", title: "Follow your stats and skill tree" },
    { src: "/app/demo_03.mp4", poster: "/app/friends.webp", title: "Compare with friends" },
  ],
};
