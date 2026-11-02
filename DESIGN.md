# Prodify website: design system

**Direction:** Industrial minimalism with working instruments. The product interface is the art. Everything around it stays quiet.

## Source of truth

Tokens in `src/app/globals.css` come from the app: `mobile/constants/theme.ts`, `fonts.ts`, `lib/heatmapStyle.ts`.

| Token | Value | Use |
|---|---|---|
| `bg` | `#0a0a0a` | Page |
| `surface` | `#141414` | Bands, inputs |
| `line` / `line-strong` | `#1f1f1f` / `#2e2e2e` | Rules, control borders |
| `fg` / `fg-soft` / `fg-muted` | `#fff` / `#d4d4d4` / `#8f8f8f` | Headings / body / secondary |
| `brand` / `brand-light` | `#ff3d00` / `#ff5a1f` | CTAs, active state, signal |
| Logo gradient | `#ff5b01` to `#fe4301` | The P mark only |
| Heat ramp | `#1a1a1a #4a2a1c #8c3a18 #d14a12 #ff3d00` | Meters, step grids, pack art |

Text on orange is `#0a0a0a`, not white as in the app: white on `#ff3d00` is 3.6:1 and ink is about 5.6:1. `#8f8f8f` replaces the app's `#888888` for slightly stronger contrast on `surface`. The app's purple secondary stays in the app.

## Type

Syne 700 for display and DM Sans 400/500/700 for text. Syne is wide, so tracking tightens as size grows and sizes stay below what a condensed face would allow. Scale classes: `type-hero`, `type-display`, `type-title`, `type-lead`, `type-name` (product names).

## Brand motifs

- **Heat ramp.** The app's activity heatmap becomes the signal language. It connects plugins, sounds and app.
- **Echo squares.** Concentric squares rotated by -28 degrees, from the app's share card. Membership and the VOX puck.
- **Instruments.** All plugin UIs are SVG, so the whole object scales as one and text stays sharp. They share `plugins/kit.tsx`, like a real product family. Each has its own geometry: JUICE is round, VOX is a pad and pitch view, CANDY is a grid.

## Components

Control radius 12px, panel radius 16px (app `radii.sm` and `radii.md`). Buttons 48px high. Press scale 0.985 (app `motion.pressScale`). Durations 140 to 220ms.

## Rules

- Orange means action, activity or signal. It is never a decorative field. The footer wordmark is the one large exception, and it closes the page.
- One authored motion moment: the JUICE knob sweep on load. Everything else answers a person's action.
- No eyebrows above headings, no icon-card grids, no gradient text, no glass, no glow. Small caps labels live only inside instruments, as they do on real hardware.
- Each homepage section has its own structure: rack, player, band, crate, phones.
- Mobile gets its own instrument layouts (`Tall`), not scaled-down desktop.
