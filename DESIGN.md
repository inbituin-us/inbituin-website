# In Bituin — Design Languages

The site intentionally carries **two coexisting design languages**, and the
architecture supports one per future event. Both share the same brand
constants; they differ in semantics (ground, voice, type, chrome).

## Shared brand constants

Raw palette + folk emblems, defined once at `:root` in `styles/tokens.css`
and consumed by every language:

| Token | Value | Role |
| --- | --- | --- |
| `--ib-fern` | `#5E7948` | canopy green |
| `--ib-linen` | `#efebce` | abaca/linen cream |
| `--ib-khaki` / `--ib-khaki-soft` | `#d6ce93` / `#e4deb5` | warm neutrals |
| `--ib-calamansi` | `#ddd612` | the star — used in decisive, tiny amounts |
| `--ib-gold` | `#f5c842` | hover flare |
| `--ib-terracotta` | `#e16036` | ember accent |
| `--ib-espresso` | `#562c2c` | ink on paper |

Emblems over icons: the Philippine sun, the Visayan diamond `◆`, the
star/bituin. Voice is first-person-plural, lowercase-confident, unhurried.

**Brand rule:** the Constellation Map always appears on its signature LIGHT
linen-paper basemap with star pins, no matter which language hosts it. It is
one shared component (`components/ConstellationMap.tsx` + `styles/pins.css`,
`styles/popup.css`, `styles/map.css`), embedded by both the landing page and
`/map`.

---

## 1. SITE — "Midnight Canopy" (the community, site overall)

Where: `/` (landing page) and future community-level pages.

- **Scope:** `[data-theme="site"]`, tokens namespaced `--site-*`
- **Files:** `styles/site-tokens.css` (tokens), `styles/landing.css`
  (components, all classes `lp-` prefixed)
- **Ground:** near-black forest greens — `--site-night-0..3`
  (`#0b1108 → #1d2e14`); starfield over the hero
- **Voice:** linen/abaca cream (`--site-fg`, muted/dim variants)
- **Accent:** calamansi, tiny decisive amounts — eyebrows, one CTA, map pins
- **Type:** Cormorant Garamond (display, italic for Tagalog/quotes),
  DM Sans (body/UI), DM Mono (eyebrows, listings, "receipt" textures)
- **Layout:** two-column editorial blocks, square borders, generous canopy
  negative space, registration tick-marks at frame edges
- **Hero treatments:** `data-hero="centered" | "editorial" | "framed"` on
  `.lp-root` (set in `components/landing/LandingPage.tsx`); starfield toggle
  via `data-starfield`, scrim depth via `--site-hero-scrim`

## 2. THE LIVING CANVAS — flagship event (June 13)

Where: `/map` (the Constellation Map experience).

- **Scope:** global `:root` semantics in `styles/tokens.css`
  (`--ib-bg`, `--ib-fg`, aliases like `--ib-canopy`, `--ib-bituin`, …)
- **Files:** `styles/tokens.css`, `globals.css`, `page.css`, `nav.css`,
  `header.css`, `list.css`, `map.css`, `mobile-map.css`, `pins.css`,
  `popup.css`, `foot.css`, `tweaks.css`
- **Ground:** daylight fern green (`--ib-fern`); linen is the canvas;
  calamansi is the flare
- **Type:** The Seasons / Cormorant Garamond (display), Poppins (body),
  Space Mono (mono)
- **Components:** `ConstellationMapApp`, `ConstellationList`,
  `ConstellationMobileSheet`, `Nav`, `TweaksPanel`

---

## Adding a design language for a future event

1. Create `styles/<event>-tokens.css` scoped to `[data-theme="<event>"]`
   with a `--<event>-*` token namespace. Reuse the shared `--ib-*` brand
   constants; define your own semantic ground/voice/accent/type.
2. Create `styles/<event>.css` with a unique class prefix (like `lp-`) so
   nothing collides — all CSS in this app is global.
3. Import both in `app/layout.tsx`.
4. Wrap the event's pages in `<div data-theme="<event>" className="<prefix>-root">`.
5. If the event shows the Constellation Map, embed the shared
   `ConstellationMap` component as-is — only style the chrome around it
   (the map itself stays linen-paper, per the brand rule).
