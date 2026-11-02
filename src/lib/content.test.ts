import { describe, expect, it } from "vitest";
import { comparisons, getComparison } from "@/content/comparisons";
import { plugins } from "@/content/plugins";
import { soundCategories, soundPacks } from "@/content/sounds";
import type { Offer } from "@/content/types";
import { canAct, formatPrice, getOfferState, offerLabel } from "./offer";

const offers: Offer[] = [...plugins.map((plugin) => plugin.offer), ...soundPacks.map((pack) => pack.offer)];

describe("catalogue honesty", () => {
  it("never offers an action for something that is not released", () => {
    offers.filter((offer) => offer.release !== "available").forEach((offer) => expect(offer.actionUrl).toBeNull());
  });

  it("keeps a working action on anything marked available", () => {
    offers.filter((offer) => offer.release === "available").forEach((offer) => expect(offer.actionUrl).not.toBeNull());
  });

  it("gives placeholder comparisons a note that says so", () => {
    comparisons.filter((item) => item.kind === "placeholder").forEach((item) => expect(item.note).toMatch(/placeholder/i));
  });

  it("does not invent unverified technical specifications", () => {
    plugins.forEach((plugin) => plugin.specs.forEach((spec) => expect(spec.value).toBeNull()));
  });
});

describe("catalogue integrity", () => {
  it("links every plugin to a comparison", () => {
    plugins.forEach((plugin) => expect(getComparison(plugin.comparisonId)).toBeDefined());
  });

  it("uses unique slugs", () => {
    const slugs = [...plugins.map((plugin) => plugin.slug), ...soundPacks.map((pack) => pack.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers every sound category", () => {
    soundCategories.forEach((category) => expect(soundPacks.some((pack) => pack.category === category)).toBe(true));
  });
});

describe("offer states", () => {
  const base = { actionUrl: "https://example.com" };

  it("keeps the four commercial states apart", () => {
    expect(getOfferState({ ...base, release: "concept", pricing: { kind: "tbd" } })).toBe("concept");
    expect(getOfferState({ ...base, release: "in-development", pricing: { kind: "paid", amount: 49, currency: "CHF" } })).toBe("upcoming");
    expect(getOfferState({ ...base, release: "available", pricing: { kind: "free" } })).toBe("free");
    expect(getOfferState({ ...base, release: "available", pricing: { kind: "paid", amount: 49, currency: "CHF" } })).toBe("paid");
  });

  it("labels and prices them", () => {
    expect(offerLabel({ ...base, release: "in-development", pricing: { kind: "tbd" } })).toBe("In development");
    expect(formatPrice({ kind: "tbd" })).toBeNull();
    expect(formatPrice({ kind: "paid", amount: 9.9, currency: "CHF" })).toContain("9.90");
  });

  it("refuses an action without a release or a URL", () => {
    expect(canAct({ ...base, release: "in-development", pricing: { kind: "free" } })).toBe(false);
    expect(canAct({ actionUrl: null, release: "available", pricing: { kind: "free" } })).toBe(false);
    expect(canAct({ ...base, release: "available", pricing: { kind: "free" } })).toBe(true);
  });
});
