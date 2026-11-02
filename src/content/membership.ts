import type { Faq } from "./types";

export const membership = {
  status: "Coming soon",
  /** Concept price from the brief. Must stay labelled as not final. */
  plannedPrice: "CHF 9.90",
  plannedInterval: "per month",
  priceNote: "Planned price. It may change before launch.",
  benefits: [
    { title: "Selected plugins", detail: "Use selected Prodify plugins while you are a member." },
    { title: "Premium sample packs", detail: "Open the Prodify Sounds packs included in the membership." },
    { title: "New sounds and updates", detail: "Get new sounds and plugin updates as they are released." },
    { title: "Future releases", detail: "Reach new plugins through the same membership." },
    { title: "Member content", detail: "Open content made only for members." },
  ],
};

export const membershipFaq: Faq[] = [
  {
    question: "Can I subscribe today?",
    answer: "No. Membership has not launched and there is no checkout yet. The waitlist is the only step for now.",
  },
  {
    question: "Is CHF 9.90 the final price?",
    answer: "No. It is the current plan and may change before launch.",
  },
  {
    question: "Which plugins and packs will be included?",
    answer: "That list is not final. We will publish it before you are asked to pay anything.",
  },
  {
    question: "Is the Prodify app part of the membership?",
    answer: "Not at the moment. The app has its own subscription, sold through the app stores.",
  },
];
