import type { Offer, Pricing } from "@/content/types";

export type OfferState = "concept" | "upcoming" | "free" | "paid";

/** Maps the stored offer to one of the four states the interface must keep apart. */
export function getOfferState(offer: Offer): OfferState {
  if (offer.release === "concept") return "concept";
  if (offer.release === "in-development") return "upcoming";
  return offer.pricing.kind === "free" ? "free" : "paid";
}

const stateLabels: Record<OfferState, string> = {
  concept: "Concept",
  upcoming: "In development",
  free: "Free",
  paid: "Available",
};

export function offerLabel(offer: Offer): string {
  return stateLabels[getOfferState(offer)];
}

export function formatPrice(pricing: Pricing): string | null {
  if (pricing.kind === "free") return "Free";
  if (pricing.kind === "tbd") return null;
  return new Intl.NumberFormat("en-CH", {
    style: "currency",
    currency: pricing.currency,
    minimumFractionDigits: 2,
  }).format(pricing.amount);
}

/** A buy or download button exists only when the product is out and a real URL is set. */
export function canAct(offer: Offer): boolean {
  return offer.release === "available" && offer.actionUrl !== null;
}

export function actionLabel(offer: Offer): string {
  return offer.pricing.kind === "free" ? "Download" : "Buy now";
}
