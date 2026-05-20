"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import ConstellationList from "@/components/ConstellationList";
import {
  ConstellationMobileSheet,
  ConstellationMobileTopChrome,
} from "@/components/ConstellationMobileSheet";
import TweaksPanel from "@/components/TweaksPanel";
import { PARTNERS } from "@/data/partners";

const ConstellationMap = dynamic(() => import("@/components/ConstellationMap"), { ssr: false });

interface Tweaks {
  tileStyle: string;
  pinStyle: string;
  compactList: boolean;
}

export default function ConstellationMapApp() {
  const partners = PARTNERS;

  const [activeId, setActiveId] = useState<string>(partners[0].id);
  const [mobileActiveId, setMobileActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [locateRequest, setLocateRequest] = useState(0);
  const [tweaks, setTweaks] = useState<Tweaks>({
    tileStyle: "canopy",
    pinStyle: "star",
    compactList: true,
  });

  const setTweak = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  const types = useMemo(() => {
    const counts: Record<string, number> = {};
    partners.forEach((p) => {
      counts[p.type] = (counts[p.type] ?? 0) + 1;
    });
    return ["All", ...Object.keys(counts).sort()].map((k) => ({
      key: k,
      count: k === "All" ? partners.length : counts[k],
    }));
  }, [partners]);

  const filtered = useMemo(
    () => (filter === "All" ? partners : partners.filter((p) => p.type === filter)),
    [filter, partners]
  );

  const mobileActive = mobileActiveId
    ? partners.find((partner) => partner.id === mobileActiveId) ?? null
    : null;
  const mobileSheetHeight = mobileActive ? 440 : mobileExpanded ? 694 : 360;
  const mobileClassName =
    "mobile-map-screen" +
    (mobileExpanded && !mobileActive ? " is-expanded" : "") +
    (mobileActive ? " is-detail" : "");

  return (
    <div className="page">
      <div className={mobileClassName}>
        <ConstellationMap
          partners={partners}
          activeId={mobileActiveId}
          setActiveId={setMobileActiveId}
          hoverId={null}
          tileKey="canopy"
          pinStyle="star"
          mobileMode
          sheetHeight={mobileSheetHeight}
          locateRequest={locateRequest}
        />

        <ConstellationMobileTopChrome types={types} filter={filter} onFilter={setFilter} />

        <button
          className="mob-locate"
          aria-label="Recenter map"
          onClick={() => setLocateRequest((count) => count + 1)}
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>

        <ConstellationMobileSheet
          partners={partners}
          filtered={filtered}
          active={mobileActive}
          expanded={mobileExpanded}
          onToggleExpanded={() => setMobileExpanded((expanded) => !expanded)}
          onSelect={(id) => {
            setMobileExpanded(false);
            setMobileActiveId(id);
          }}
          onClose={() => setMobileActiveId(null)}
        />
      </div>

      <div className="desktop-map-page">
        <div className="ticks" aria-hidden="true">
          <span className="h tl-h" />
          <span className="v tl-v" />
          <span className="h tr-h" />
          <span className="v tr-v" />
          <span className="h bl-h" />
          <span className="v bl-v" />
          <span className="h br-h" />
          <span className="v br-v" />
        </div>

        <Nav />

        <header className="header">
          <h1 className="header__title">
            <span>Constellation</span>
            <span className="header__title-mark">✦</span>
            <em>Map</em>
          </h1>
          <p className="header__intro">
            In celebration of <strong>In Bituin: The Living Canvas</strong>, we&apos;ve gathered a
            small constellation of Filipino-owned spots across NYC — restaurants, cafés, bakeries,
            record shops — each holding an exclusive perk for our community. Bop between the gallery
            and the after-party, gather your friends, and bring the celebration{" "}
            <em>beyond the canvas.</em>
          </p>
          <div className="header__meta">
            <span className="meta-pip">
              <span className="meta-pip__dot" />
              <span>
                <strong>{partners.length}</strong> spots
              </span>
            </span>
            <span className="meta-pip">
              <span className="meta-pip__dot" />
              <span>Jun 13, 2026</span>
            </span>
          </div>
        </header>

        <section className="atlas">
          <ConstellationList
            partners={partners}
            filtered={filtered}
            activeId={activeId}
            compact={tweaks.compactList}
            filter={filter}
            types={types}
            onFilter={setFilter}
            onHover={setHoverId}
            onLeave={() => setHoverId(null)}
            onClick={setActiveId}
          />

          <ConstellationMap
            partners={partners}
            activeId={activeId}
            setActiveId={setActiveId}
            hoverId={hoverId}
            tileKey={tweaks.tileStyle}
            pinStyle={tweaks.pinStyle}
          />
        </section>

        <section className="foot-cue">
          <div className="cue">
            <span className="cue__num">01</span>
            <div>
              <h3 className="cue__title">Drop in.</h3>
              <p className="cue__body">
                Pick a star, get directions, mention <em>In Bituin</em> at the counter. Each spot
                has set aside something small for us — that&apos;s the whole point.
              </p>
            </div>
          </div>
          <div className="cue">
            <span className="cue__num">02</span>
            <div>
              <h3 className="cue__title">Collect your stars.</h3>
              <p className="cue__body">
                Check in at any three spots between Jun 12 and Jun 27, and we&apos;ll pull you into
                the raffle at the gallery close.
              </p>
            </div>
          </div>
          <div className="cue">
            <span className="cue__num">03</span>
            <div>
              <h3 className="cue__title">Bring the constellation home.</h3>
              <p className="cue__body">
                Tag <em>@inbituin</em> from any of these spots — we&apos;ll repost the brightest
                ones across the weekend.
              </p>
            </div>
          </div>
        </section>

        <TweaksPanel
          tileStyle={tweaks.tileStyle}
          pinStyle={tweaks.pinStyle}
          compactList={tweaks.compactList}
          onTileStyle={(v) => setTweak("tileStyle", v)}
          onPinStyle={(v) => setTweak("pinStyle", v)}
          onCompactList={(v) => setTweak("compactList", v)}
        />
      </div>
    </div>
  );
}
