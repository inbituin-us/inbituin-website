"use client";

import { useEffect, useState } from "react";
import { RSVP_URL } from "@/data/links";

type NavSection = "about" | "do" | "next" | "map";

interface SiteNavProps {
  active?: NavSection;
}

/**
 * The unified site nav (Midnight Canopy language), shared by the landing
 * page and every event page. data-theme="site" on the element itself makes
 * the --site-* tokens resolve no matter which design language hosts it.
 */
export default function SiteNav({ active }: SiteNavProps) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = (href: string, key: NavSection, label: string) => (
    <a
      className={"lp-nav__link" + (active === key ? " is-active" : "")}
      href={href}
    >
      {label}
    </a>
  );

  return (
    <header className={"lp-nav" + (stuck ? " is-stuck" : "")} data-theme="site">
      <div className="lp-nav__inner">
        <a className="lp-nav__brand" href="/" aria-label="In Bituin home">
          <img src="/media/logo-in-bituin-lockup.png" alt="In Bituin" />
        </a>
        <nav className="lp-nav__links" aria-label="Primary">
          {link("/#about", "about", "About")}
          {link("/#do", "do", "What We Do")}
          {link("/#next", "next", "What's Next")}
        </nav>
        <div className="lp-nav__actions">
          <a
            className={"lp-nav__map" + (active === "map" ? " is-active" : "")}
            href="/map"
            aria-label="The Constellation Map"
          >
            <span className="lp-nav__map-star" aria-hidden="true">✦</span>
            <span className="lp-nav__map-label">The Constellation Map</span>
            <span className="lp-nav__map-label--short">Map</span>
          </a>
          <a
            className="lp-nav__rsvp"
            href={RSVP_URL}
            target="_blank"
            rel="noopener"
          >
            RSVP
          </a>
        </div>
      </div>
    </header>
  );
}
