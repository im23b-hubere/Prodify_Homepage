# Prodify website: product context

Prodify is growing from a producer productivity app into a music production brand: audio plugins, sounds, a membership and the existing app. This site's commercial focus is plugins, sounds and membership. The app is the supporting product.

**Audience.** Music producers worldwide, starting with tech house, house, techno, minimal, melodic techno and progressive house.

**Personality.** Premium, modern, technical, minimal, experimental without chaos. Built by producers.

**Voice.** Follow the app's studio voice (`GLOSSARY.md` in the app repo): English, short, factual. Session, Streak, Area, Focus. No coach slogans, no emoji.

## Truth rules

These bind every page, and `src/lib/content.test.ts` enforces most of them.

- Nothing is presented as purchasable until it can really be bought. A CTA needs `release: "available"` and a real `actionUrl`.
- Formats, OS support and system requirements stay `null` until tested. The UI shows "Confirmed before release".
- Audio marked `kind: "placeholder"` always shows its notice. Real demos must be rendered through the shipping plugin.
- No fake testimonials, user counts, awards or reviews.
- CHF 9.90 is a concept price and must stay labelled as not final.
- App claims must match the store metadata and entitlement docs. The app is subscription-only and has no free tier.
- The waitlist never implies an address was saved unless the webhook accepted it.
