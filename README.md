# Prodify website

Marketing site for Prodify plugins, sounds, membership and the app. Next.js App Router, TypeScript, Tailwind CSS 4.

The mobile app lives in a separate repository and is read-only reference material for this project.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Check

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Where things live

| Path | Contents |
|---|---|
| `src/content/` | All product data: plugins, sounds, comparisons, membership, app facts, site details |
| `src/lib/offer.ts` | Available, free, paid and upcoming logic |
| `src/lib/ab-player.ts` | Before and after audio engine |
| `src/components/plugins/` | Plugin interfaces and the shared control kit |
| `src/app/api/waitlist/` | Waitlist endpoint |

See `PRODUCT.md` for truth rules and `DESIGN.md` for the design system.

## Common changes

**Add a plugin.** Add an entry to `src/content/plugins.ts`, a comparison to `comparisons.ts`, and an interface in `components/plugins/`, registered in `plugin-interface.tsx`. Routes, sitemap and catalogue follow from the data.

**Add real audio.** Put files in `public/audio/`, point `before.src` and `after.src` at them, and set `kind: "demo"`. Both clips should have equal length, and the placeholder notice disappears. Use compressed audio for production.

**Release a product.** Set `offer.release` to `"available"`, set `pricing`, and add a real `actionUrl`. The buy or download button appears only then.

**Add a sound preview.** Set `previewSrc` on the pack.

**Connect the waitlist.** Set `WAITLIST_WEBHOOK_URL` and rebuild. The webhook receives `{ email, interest, submittedAt }` as JSON. The page reads this value at build time for its notice, and the endpoint reads it per request.

**Go live with the app.** Set `appStoreUrl` and `playStoreUrl` in `src/content/app.ts`.

**Add social links.** Add them to `site.social` in `src/content/site.ts`.

## Placeholder audio

`npm run audio:placeholder` regenerates the synthetic test clips in `public/audio/placeholder/`. Delete them once real demos exist.
