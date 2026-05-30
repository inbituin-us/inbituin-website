# Handoff: Constellation Map — Mobile

## Overview

A mobile, map-first view of the *In Bituin* **Constellation Map** — a roster of Filipino-owned NYC businesses with Independence Day perks. The user lands on a full-bleed dark map dotted with star pins; a translucent bottom sheet lets them browse the list, filter by category, and tap any star to see a full detail card with the perk and directions.

Companion to the existing desktop `Constellation Map.html`. Same data, same palette, same partner roster — phone-specific UX.

## About the Design Files

The files in this bundle are **design references created in HTML**. They are prototypes showing intended look and behavior, not production code to copy directly. The HTML files run as a Babel-transpiled React 18 + Leaflet app for prototyping speed.

The task is to **recreate these designs in the target codebase's existing mobile environment** (React Native, SwiftUI, Jetpack Compose, Flutter, or a web mobile stack — whatever the project uses) using its established patterns, navigation primitives, and map library. The iOS frame in the prototype (`ios-frame.jsx`) is only there to give context for an in-browser preview; do not ship the frame — ship the screen.

## Fidelity

**High-fidelity (hifi).** All colors, typography, spacing, sheet heights, motion curves, and interaction states are final. Recreate pixel-perfectly. The only thing the developer should reinterpret is *implementation choice* — pick the most idiomatic primitive in the target stack for each pattern (e.g. `BottomSheetModal` in RN, `.sheet` in SwiftUI, etc.).

## Screen Inventory

The mobile design is **one screen** with three states of its bottom sheet:

1. **List (collapsed)** — default
2. **List (expanded)** — user dragged the handle up
3. **Detail** — user tapped a star (pin or list item)

The map + top chrome + filter chips stay on screen across all three states; only the bottom sheet swaps.

---

## Layout

### Overall

- Device target: iPhone 15 Pro size class (≈ 402 × 874 logical px). Layout uses absolute positioning over a full-screen map.
- Background of the screen: `#2e316c` (canopy), but visually covered by the Leaflet map at full bleed.
- All chrome on top of the map uses translucent dark surfaces with `backdrop-filter: blur()`.

### Z-stack (back → front)

| Layer | Element |
|---|---|
| 0 | Leaflet map (`.mob-map`) |
| 20 | Map vignette tint (`.mob-tint`) |
| 25 | Filter chips, Locate button |
| 30 | Top header (brand + title) |
| 40 | Bottom sheet (list or detail) |

### Top header (`.mob-top`)

- Position: absolute, `top: 60px` (clears iOS dynamic island / status bar), full width.
- Background: vertical gradient — `rgba(15,21,56,0.78)` at top fading to transparent at 100%.
- Two rows:
  - **Row 1**: 22 × 22 px sun mark (tinted light blue) + "In Bituin" wordmark (Cormorant Garamond 500, 18 px) + spacer + RSVP pill (right-aligned, `#90bee9` bg, dark text, 6 × 12 px, 10 px caps).
  - **Row 2** — page title: "Constellation" (Cormorant 500, 28 px, `#e8eef5`) + `✦` mark in purple `#8037ca` (18 px, drop-shadow glow) + italic "Map" (Cormorant 400 italic, 28 px, `#90bee9`).
- 6 px gap between rows. `white-space: nowrap` on both rows.

### Filter chips (`.mob-chips`)

- Position: absolute, `top: 168px`, full width, 18 px side padding, horizontal scroll (no scrollbar).
- Each chip: `padding: 8px 12px`, square corners, translucent `rgba(15,21,56,0.75)` + 10 px backdrop blur, 1 px rule border, 11 px uppercase caps with 0.18em tracking, monospace count in the trailing position.
- Selected chip: `#90bee9` background, dark `#060a22` text.
- Categories rendered: `All`, plus every unique `type` from the partner data (Restaurant, Café, Bakery, Bar, Records, Bookshop, …). Counts shown next to each.

### Map (`.mob-map`)

- Full-bleed Leaflet (or whatever map lib the target uses).
- Initial center: `[40.7180, -73.9650]`, zoom **11.5**.
- Tile source: CartoDB `dark_all` — `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`. Replace with the project's preferred dark basemap if it has one.
- **Tile filter**: `hue-rotate(210deg) saturate(0.55) brightness(0.78)` — this is what shifts the OSM dark style into the navy/purple palette. Reproduce by passing the equivalent into your map style, or apply as a CSS filter on the tile layer.
- Vignette overlay (`.mob-tint`): radial gradient `transparent 40% → rgba(15,21,56,0.6) 100%`, centered at 50%/35%.
- Controls (zoom, attribution): hidden.

### Star pins

- 4-point bituin star inside a 100×100 viewBox `divIcon`.
- Default size: 32 × 32 px, anchored center.
- Default fill: `#cfd8e3` (abaca), drop-shadow `0 0 5px rgba(207,216,227,0.45)`.
- Active size: 52 × 52 px, fill `#90bee9` (bituin blue), drop-shadow `0 0 14px rgba(144,190,233,0.85)`, with a soft 8-point halo behind that fades from `rgba(144,190,233,0.14)` to `0.32` on a 2.6s ease-in-out loop (`@keyframes twinkle`). The 2-digit index number appears centered in the star (DM Mono 9px, fill `#060a22`).
- Tapping a star sets it active, flies the map, and pushes the sheet into Detail state.

### Locate button (`.mob-locate`)

- Position: absolute, right `16px`, bottom is state-dependent (see Motion below).
- 44 × 44 px hit target, translucent `rgba(15,21,56,0.85)` + 12 px backdrop blur, 1 px strong rule border, `#90bee9` glyph (20 × 20 px crosshair icon).
- Hidden when sheet is expanded.

### Bottom sheet (`.mob-sheet`)

- Position: absolute, full width, anchored bottom.
- Background: `rgba(15,21,56,0.94)` + 24 px backdrop blur with 140% saturation. Top border `rgba(207,216,227,0.30)`. Drop shadow upward `0 -12px 40px -8px rgba(0,0,0,0.55)`.
- Height (per state) — animated with the brand `cubic-bezier(0.22, 0.61, 0.36, 1)` over 420ms:
  - **List collapsed**: `360px`
  - **List expanded**: `calc(100% - 180px)`
  - **Detail**: `440px`
- **Handle**: 38 × 4 px pill, color `rgba(207,216,227,0.30)`, padded 8px top / 6px bottom, centered. Acts as a tap target (toggles expanded ↔ collapsed in list states).

#### Sheet contents — List state

- **Header** (`.mob-list__head`): `04px 20px 14px`, flex space-between, bottom rule.
  - Left: "_06_ stars" — italic count in `#90bee9`, rest `#e8eef5` (Cormorant 500, 19 px). Count uses the *filtered* length, zero-padded to 2 digits.
  - Right: hint `"Tap to fly"` — 10 px caps tracking, `#7a8499`.
- **List body** (`.mob-list__scroll`): scrollable, 6/12/24 padding, momentum on iOS.
- **Card** (`.mob-card`):
  - Grid `32px 1fr auto`, gap 12px, padding `14px 10px`, bottom rule, transparent left-border 2px.
  - **Number** (right-aligned, DM Mono 10 px, `#7a8499` default / `#90bee9` when active). Uses index in the *full* partner roster, not the filtered list.
  - **Body**:
    - Name: Cormorant 500, 18 px, `#e8eef5`, single-line ellipsis.
    - Meta row: 11 px sans, type chip (10 px caps 700, `#90bee9`) · separator `#7a8499` · neighborhood (sans 11 px, `#a8b3c2`, ellipsis).
  - **Chevron**: `›`, 16 px, `#7a8499`.
  - Active card: background `rgba(144,190,233,0.10)`, left border `#90bee9`.
  - Tap: switch sheet to detail + set active.

#### Sheet contents — Detail state

- Replaces list while the sheet animates from 360 → 440 px.
- **Cover** (`.mob-detail__cover`): 120 px tall, background uses the partner's `cover` gradient. Bottom gradient overlay fades to `rgba(15,21,56,0.92)`.
  - Type chip top-left: same style as filter chip, `#90bee9` text.
  - Close button top-right: 30 × 30 px translucent square, `✕` glyph in `#e8eef5`. Triggers `setActiveId(null)`.
  - Bituin index bottom-left: DM Mono 10 px, `"★ Bituin No. NN"`.
- **Body** (`.mob-detail__body`): 16/20/20 padding, scrollable.
  - Name: Cormorant 500, 26 px, `#e8eef5`, tight leading.
  - Address row: ◆ glyph in `#90bee9` + address text (sans 12 px, `#a8b3c2`).
  - **Perk callout**: `#90bee9` background, dark `#060a22` text. Three lines:
    - Eyebrow "Independence Day exclusive" — 9 px, 700, 0.32em tracking, uppercase, 70% opacity.
    - Headline (`perkLong`): Cormorant 600, 20 px, tight leading.
    - Period (`start → end`): DM Mono 10 px, 75% opacity.
  - Description: sans 13 px, line-height 1.55, `#cfd8e3`.
  - **CTA row**: single full-width "Directions" button.
    - Background `#1c60a0`, text `#e8eef5`, 1 px strong rule border, padding 14 px vertical.
    - 12 px caps 700, 0.18em tracking, with leading 16 × 16 px pin icon.
    - `href` is `https://www.google.com/maps/dir/?api=1&destination=<encoded address>` — open in new tab / system maps.

---

## Interactions & Behavior

### Star tap

1. Set the partner active.
2. Compute a pan offset so the star sits roughly in the **upper third** of the visible viewport (above the 440 px sheet). Implementation: project the lat/lng to pixel space at the target zoom, subtract `(paddingBottom / 2) - 60` from Y, unproject back.
3. `flyTo(adjusted, max(currentZoom, 13))` with `duration: 0.55s`, `easeLinearity: 0.12` (cubic-bezier-style ease-out — fast in, soft settle).
4. Sheet animates from list (360 px) to detail (440 px) over 420 ms using `cubic-bezier(0.22, 0.61, 0.36, 1)`.
5. Active marker swaps `divIcon` (52 × 52 size, halo + glow + index visible).

### List item tap

- Same as star tap, but also collapses the sheet first (`setExpanded(false)`) so the map is visible while the fly animates.

### Filter chip tap

- Sets active filter; list re-filters. If the currently active partner has a type that doesn't match the new filter, the star stays selected on the map — only the list visible items change.

### Sheet handle tap

- In list states: toggles between collapsed (360 px) and expanded (`calc(100% - 180px)`).
- In detail state: disabled (the close button is the way out).

### Map drag/zoom

- Standard Leaflet behavior. No state changes.

### Sheet expansion side effects

- `paddingBottom` value (the sheet height) is passed to the map. The map calls `invalidateSize()` ~320 ms after it changes so Leaflet recomputes layout. Replicate with whatever the target map library's "container resized" call is.

---

## Motion tokens

| Use | Curve | Duration |
|---|---|---|
| Sheet height change | `cubic-bezier(0.22, 0.61, 0.36, 1)` | 420 ms |
| Map flyTo | cubic-style (easeLinearity 0.12) | 550 ms |
| Star pin hover/active scale, color | `cubic-bezier(0.22, 0.61, 0.36, 1)` | 220 ms |
| Twinkle halo | ease-in-out, loop | 2600 ms |
| Locate button repositioning | same | 420 ms |

These are exposed as `--ib-ease` and `--ib-dur-2 / 3` in `tokens.css`.

---

## State Management

- `activeId: string | null` — id of the currently selected partner. Drives marker style, map fly, and sheet mode (detail vs list).
- `filter: string` — selected category. Defaults to `"All"`.
- `expanded: boolean` — whether the list sheet is in the tall variant. Only meaningful when `activeId == null`.

No data fetching — partner roster is static in `data.js`. Replace with the project's data source.

---

## Design Tokens (palette in use)

| Token | Value | Used for |
|---|---|---|
| `--ib-narra-darkest` | `#060a22` | Deepest navy, text on yellow surfaces |
| `--ib-narra-deep` | `#0f1538` | Sunken surfaces (popup, nav, sheet) |
| `--ib-canopy` | `#2e316c` | Page ground |
| `--ib-canopy-mid` | `#1c60a0` | Elevated cards, primary CTA bg |
| `--ib-bituin` | `#90bee9` | The star — pins, eyebrows, CTAs, selected states |
| `--ib-bituin-soft` | `#7daed8` | Pressed / hover star |
| `--ib-ember` | `#8037ca` | Purple accent (only on the ✦ in the hero) |
| `--ib-abaca` | `#cfd8e3` | Primary body text on dark |
| `--ib-abaca-soft` | `#a8b3c2` | Secondary text |
| `--ib-abaca-deep` | `#7a8499` | Tertiary / hint text |
| `--ib-fg-display` | `#e8eef5` | Serif headings |
| `--ib-rule` | `rgba(207,216,227,0.16)` | Hairlines |
| `--ib-rule-strong` | `rgba(207,216,227,0.30)` | Stronger dividers, borders |

### Type

- Display: **Cormorant Garamond**, weights 400/500/600 (italics used).
- Sans: **DM Sans**, 400/500/600/700.
- Mono: **DM Mono**, 400/500.
- Eyebrow tracking: `0.32em` uppercase.
- Caps tracking: `0.18em` uppercase.

### Spacing scale (8-pt grid)

`0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192` (px). Mobile design uses 8/12/14/16/20/22 most often.

### Radii

Almost everything is square (0 or 2 px). The only round element is the sheet handle (999 px pill) and the locate button stays square at 0 radius.

---

## Assets

- `assets/philippine-sun.png` — small sun mark in the header. Inverted to light blue via a CSS filter (`brightness(0) saturate(100%) invert(82%) sepia(20%) saturate(700%) hue-rotate(178deg) brightness(98%) contrast(95%)`). If the target codebase has a vector version, use that instead and just tint to `#90bee9`.
- `assets/visayan-pattern.png` — ambient textile pattern used at 3% opacity on the host backdrop, behind the phone in the prototype. Not visible inside the phone screen itself; skip if not needed.
- Cover gradients for each partner are inline CSS strings on the data records (e.g. `linear-gradient(160deg, #c3552a, #1d2412)`). They're decorative — the production app can swap them for real partner photography when available.
- Tile source: CartoDB dark_all (free, no API key).

---

## Files in this bundle

| File | Purpose |
|---|---|
| `Constellation Map · Mobile.html` | Entry point — wires up React, Leaflet, and the app scripts |
| `mobile-app.jsx` | All React components for the mobile screen (`MobileScreen`, `MobileMap`, `ListSheet`, `DetailSheet`, `PhoneStage`) |
| `mobile-styles.css` | All mobile-specific styles |
| `tokens.css` | Brand tokens (palette, typography, spacing, motion) — shared with desktop |
| `data.js` | Partner roster (`window.PARTNERS`) — shared with desktop |
| `ios-frame.jsx` | iPhone bezel used only for in-browser preview. **Do not port.** |

To run locally: serve this folder over any static HTTP server (e.g. `python -m http.server`) and open the HTML file. Do *not* open via `file://` — Leaflet tiles need a real origin.

---

## Implementation notes

- The prototype uses Babel-in-the-browser for speed. In production, transpile properly and tree-shake.
- Leaflet works fine on the web, but if the target is native mobile, prefer MapKit (iOS), Google Maps SDK (Android), or `react-native-maps` / `MapLibre`. The star marker is a small SVG — port it as a custom annotation/marker view.
- The bottom sheet is hand-rolled. In RN, use `@gorhom/bottom-sheet`. In SwiftUI, `.sheet(isPresented:)` with `.presentationDetents([.height(360), .height(440), .large])`.
- The `transform: scale()` `PhoneStage` wrapper is preview-only. Drop it in production — the real device handles its own viewport.
- All touch targets are ≥ 44 × 44 px (filter chips are 32 px tall — bump to 40 if the target has stricter accessibility requirements).
