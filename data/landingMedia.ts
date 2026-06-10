/*
 * Landing page media slots.
 *
 * Drop files into public/media/ and point each slot at them
 * (e.g. heroVideo: "/media/hero.mp4"). A slot left as null renders a
 * styled placeholder. Files ending in .mp4 / .webm / .mov render as a
 * muted looping video; anything else renders as an image.
 */

export interface MediaSource {
  src: string | null;
  /** Placeholder label + alt text once media is loaded. */
  label: string;
  /** Optional still shown instantly while a video buffers. */
  poster?: string;
}

export const landingMedia = {
  /** Full-bleed hero background — muted loop (1440×1080, CRF 28, audio stripped). */
  heroVideo: {
    src: "/media/hero.mp4",
    label: "In Bituin sizzle reel",
    poster: "/media/hero-poster.jpg",
  } as MediaSource,

  /** In Bituin wordmark / logo — transparent PNG or SVG. Falls back to a text wordmark while null. */
  heroLogo: {
    src: null,
    label: "In Bituin wordmark",
  } as MediaSource,

  /** "What is In Bituin" — horizontal community photo beside the copy. */
  aboutPhoto: {
    src: "/media/about-family.jpg",
    label: "The In Bituin constellation gathered after a show",
  } as MediaSource,

  /** "What we do" trio — portrait 3:4 frames, left to right. */
  doMedia: [
    { src: "/media/do-fashion.jpg", label: "A Filipinas jersey on the runway" },
    { src: "/media/do-openmic.jpg", label: "A singer at the open mic" },
    { src: "/media/do-party.jpg", label: "Dancing at the after party" },
  ] as MediaSource[],

  /** "What's next" event poster — letter ratio (17:22). */
  nextPoster: {
    src: "/media/poster-living-canvas.jpg",
    label:
      "The Living Canvas — Saturday June 13, 2026, 11am–5pm at Hello Market, 46 Market St, New York",
  } as MediaSource,
};
