/** Operator and contact details match the app's published imprint (docs/impressum.html). */
export const site = {
  name: "Prodify",
  description:
    "Creative audio plugins and sounds made to bring more character, movement and energy to your productions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "prodify@gmx.net",
  operator: "Eric Huber",
  location: "Zurich, Switzerland",
  /** Add entries once official profiles exist. The footer renders only what is listed here. */
  social: [] as { label: string; href: string }[],
};

export const primaryNav = [
  { href: "/plugins", label: "Plugins" },
  { href: "/sounds", label: "Sounds" },
  { href: "/membership", label: "Membership" },
  { href: "/app", label: "App" },
] as const;

export const legalNav = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/imprint", label: "Imprint" },
  { href: "/legal/licensing", label: "Licensing" },
] as const;
