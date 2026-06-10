import type { Partner } from "@/data/partners";

interface LandingMapSectionProps {
  partners: Partner[];
}

export default function LandingMapSection({
  partners,
}: LandingMapSectionProps) {
  return (
    <section className="lp-section lp-map-section" id="map">
      <div className="lp-pattern" />
      <div className="lp-map-section__head lp-reveal">
        <div>
          <p className="lp-eyebrow">The Constellation Map</p>
          <h2 className="lp-display lp-map-section__title">Partners.</h2>
        </div>
        <div>
          <p className="lp-map-section__intro">
            In celebration of our upcoming event,{" "}
            <strong>In Bituin: The Living Canvas</strong>, we&apos;ve
            collaborated with various Filipino-owned businesses to bring your
            connections beyond the canvas.
          </p>
          <p className="lp-map-section__meta">
            <span className="pip" /> Saturday, June 13, 2026
          </p>
        </div>
      </div>

      <div className="lp-map-section__poster lp-reveal">
        <a
          className="lp-map-poster"
          href="/map"
          aria-label="Open the interactive Constellation Map"
        >
          <img
            src="/media/constellation-map-poster.jpg"
            alt="In Bituin Constellation Map — Filipino-owned partner cafés, restaurants and bakeries across NYC and Jersey City"
          />
          <span className="lp-map-poster__veil" aria-hidden="true" />
          <span className="lp-map-poster__hint">
            Open the interactive map <span aria-hidden="true">↗</span>
          </span>
        </a>
      </div>
    </section>
  );
}
