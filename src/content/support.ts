import type { Faq } from "./types";

export const installSteps = [
  { title: "Download", detail: "You will get the installer for your system from your Prodify account or download link." },
  { title: "Install", detail: "Run the installer and keep the default plugin folders unless your setup needs others." },
  { title: "Rescan", detail: "Open your DAW and rescan plugins if it does not find the new plugin by itself." },
];

export const supportFaq: { group: string; items: Faq[] }[] = [
  {
    group: "Plugins and sounds",
    items: [
      {
        question: "Are any plugins available yet?",
        answer: "Not yet. JUICE is in development and the other plugins are still concepts. Each product page shows its current status.",
      },
      {
        question: "Why are some specifications empty?",
        answer: "We only publish formats and requirements once they are tested. Until then the page shows them as confirmed before release.",
      },
      {
        question: "Where do I find installation guides?",
        answer: "Each plugin gets its own guide at release. The outline on this page shows the general process.",
      },
    ],
  },
  {
    group: "The Prodify app",
    items: [
      {
        question: "How do I manage or cancel my subscription?",
        answer:
          "On iPhone, open Settings > Apple ID > Subscriptions. You can also use Restore Purchases on the Prodify paywall.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "In the app, open Profile > Settings > Delete account. Deletion is permanent and removes your sessions, streaks and friendships.",
      },
    ],
  },
];
