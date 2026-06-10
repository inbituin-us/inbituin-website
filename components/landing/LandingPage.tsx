"use client";

import { useEffect } from "react";
import SiteNav from "@/components/SiteNav";
import Starfield from "@/components/landing/Starfield";
import MediaSlot from "@/components/landing/MediaSlot";
import LandingMapSection from "@/components/landing/LandingMapSection";
import { landingMedia } from "@/data/landingMedia";
import { RSVP_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/data/links";
import type { Partner } from "@/data/partners";

/** Hero treatment: "centered" | "editorial" | "framed" (see styles/landing.css). */
const HERO_TREATMENT = "centered";
const STARFIELD = "on";

interface LandingPageProps {
  partners: Partner[];
}

export default function LandingPage({ partners }: LandingPageProps) {
  // Reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="lp-root"
      data-theme="site"
      data-hero={HERO_TREATMENT}
      data-starfield={STARFIELD}
    >
      {/* ══════════════ NAV ══════════════ */}
      <SiteNav />

      {/* ══════════════ HERO ══════════════ */}
      <section className="lp-hero" id="top">
        <div className="lp-hero__media">
          <MediaSlot media={landingMedia.heroVideo} />
        </div>
        <div className="lp-hero__scrim" />
        <div className="lp-hero__glow" />
        <Starfield />

        <div className="lp-hero__frame" />
        <div className="lp-ticks" aria-hidden="true">
          <span className="h tl-h" /><span className="v tl-v" />
          <span className="h tr-h" /><span className="v tr-v" />
          <span className="h bl-h" /><span className="v bl-v" />
          <span className="h br-h" /><span className="v br-v" />
        </div>

        <div className="lp-hero__inner">
          <p className="lp-eyebrow">Constellations of Filipino Creativity</p>
          <div className="lp-hero__rule" />
          <div className="lp-hero__logo">
            {landingMedia.heroLogo.src ? (
              <MediaSlot media={landingMedia.heroLogo} contain />
            ) : (
              <h1 className="lp-hero__wordmark">In Bituin</h1>
            )}
          </div>
          <p className="lp-hero__tagline">
            A constellation of Filipino creatives — artists, storytellers,
            and dreamers. Gathering to be seen, heard and celebrated.
          </p>
          <a className="lp-hero__cta" href={RSVP_URL} target="_blank" rel="noopener">
            <span className="dot" />
            Event: The Living Canvas
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="lp-hero__scroll" aria-hidden="true">Scroll</div>
      </section>

      {/* ══════════════ WHAT IS IN BITUIN ══════════════ */}
      <section className="lp-section lp-section--ground" id="about">
        <div className="lp-pattern" />
        <div className="lp-section__inner">
          <div className="lp-about">
            <div className="lp-about__head lp-reveal">
              <p className="lp-eyebrow">In Bituin</p>
              <h2 className="lp-display lp-about__title">Who we are</h2>
              <div className="lp-about__photo">
                <MediaSlot media={landingMedia.aboutPhoto} />
              </div>
            </div>
            <div className="lp-about__body lp-reveal">
              <p className="lp-about__lead">
                Bituin <span className="lp-gloss">(bi-tyu-in)</span> is
                derived from the Tagalog language of the Philippines and
                translates to star.
              </p>
              <p className="lp-copy">
                Our constellation starts with the foundation of{" "}
                <em>kapwa</em>. The heart of our work is a deep commitment to
                community building.
              </p>
              <p className="lp-copy">
                As creatives, we are empowered by the theme of Bituin.
              </p>
              <p className="lp-copy">
                We honor our ancestors&apos; journeys and survival,
                acknowledge their sacrifices, and step into a new standard
                for future generations: one where creative dreams are not
                only possible, but celebrated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHAT WE DO ══════════════ */}
      <section className="lp-section lp-section--elevated" id="do">
        <div className="lp-section__inner">
          <div className="lp-do">
            <div className="lp-do__media lp-reveal">
              {landingMedia.doMedia.map((media, i) => (
                <MediaSlot key={i} media={media} />
              ))}
            </div>
            <div className="lp-do__copy lp-reveal">
              <p className="lp-eyebrow">What we do</p>
              <h2 className="lp-display lp-do__title">
                We hold space, and we let it shine.
              </h2>
              <p className="lp-copy">
                A constellation of Filipino creatives — artists,
                storytellers, and dreamers — gathering to be seen, heard and
                celebrated.
              </p>
              <div className="lp-do__looks">
                <p className="lp-do__looks-label">It looks like</p>
                <ul className="lp-do__list">
                  <li>A poet finding their voice at the open mic</li>
                  <li>An artist&apos;s first piece displayed in public</li>
                  <li>A conversation turning into a creative partnership</li>
                  <li>Someone realizing they&apos;re not alone in their dreams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHAT'S NEXT ══════════════ */}
      <section className="lp-section lp-section--ground" id="next">
        <div className="lp-pattern" />
        <div className="lp-section__inner">
          <div className="lp-next">
            <div className="lp-next__copy lp-reveal">
              <p className="lp-eyebrow">What&apos;s next</p>
              <h2 className="lp-display lp-next__title">The Living Canvas</h2>
              <p className="lp-about__lead">
                This June, as we mark Philippine Independence, we not only
                celebrate our freedom — we celebrate the ground beneath it.
                The land that shaped each of us. The homeland we carry in our
                blood, transcending borders and the thousands of miles
                between them.
              </p>
              <p className="lp-copy">
                We invite artists and guests alike to reflect on how our
                personal and collective ancestry, land, and history are
                embedded within us, across distance and time.
              </p>
              <a className="lp-next__cta" href={RSVP_URL} target="_blank" rel="noopener">
                RSVP — The Living Canvas
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="lp-next__poster lp-reveal">
              <MediaSlot media={landingMedia.nextPoster} />
              <p className="lp-next__poster-cap">
                June 13 · 11am–5pm · Hello Market, 46 Market St, NYC
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CONSTELLATION MAP ══════════════ */}
      <LandingMapSection partners={partners} />

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="lp-footer">
        <div className="lp-pattern" />
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-footer__brand-mark">
              <img src="/assets/graphics/04-LockUp-Star-White.png" alt="" />
              <span className="lp-footer__brand-name">In Bituin</span>
            </div>
            <p className="lp-footer__tag">Handcrafted · Heartfelt · Alive</p>
          </div>
          <div className="lp-footer__col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#do">What We Do</a></li>
              <li><a href="#next">What&apos;s Next</a></li>
              <li><a href="/map">The Constellation Map</a></li>
            </ul>
          </div>
          <div className="lp-footer__col">
            <h4>Join Us</h4>
            <ul>
              <li>
                <a href={RSVP_URL} target="_blank" rel="noopener">
                  RSVP — The Living Canvas
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="lp-footer__bar">
          <p className="lp-footer__copy">
            © 2026 In Bituin · Constellations of Filipino Creativity
          </p>
          <div className="lp-footer__social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
