"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import ConstellationList from "@/components/ConstellationList";
import {
  ConstellationMobileSheet,
  ConstellationMobileTopChrome,
} from "@/components/ConstellationMobileSheet";
import TweaksPanel from "@/components/TweaksPanel";
import type { Partner } from "@/data/partners";

const ConstellationMap = dynamic(
  () => import("@/components/ConstellationMap"),
  { ssr: false },
);

interface Tweaks {
  tileStyle: string;
  pinStyle: string;
  compactList: boolean;
}

type MobileSheetLevel = "peek" | "collapsed" | "expanded";

interface ConstellationMapAppProps {
  partners: Partner[];
}

export default function ConstellationMapApp({
  partners,
}: ConstellationMapAppProps) {
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(
    null,
  );
  const [viewportHeight, setViewportHeight] = useState(874);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileActiveId, setMobileActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [mobileSheetLevel, setMobileSheetLevel] =
    useState<MobileSheetLevel>("collapsed");
  const [mobileSheetDragHeight, setMobileSheetDragHeight] = useState<number | null>(null);
  const [locateRequest, setLocateRequest] = useState(0);
  const [tweaks, setTweaks] = useState<Tweaks>({
    tileStyle: "paper",
    pinStyle: "star",
    compactList: false,
  });

  const setTweak = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => {
      setIsMobileViewport(media.matches);
      setViewportHeight(window.innerHeight || 874);
    };

    syncViewport();
    media.addEventListener("change", syncViewport);
    window.addEventListener("resize", syncViewport);

    return () => {
      media.removeEventListener("change", syncViewport);
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

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
    () =>
      filter === "All" ? partners : partners.filter((p) => p.type === filter),
    [filter, partners],
  );

  const mobileActive = mobileActiveId
    ? (partners.find((partner) => partner.id === mobileActiveId) ?? null)
    : null;
  const mobileSheetHeight = mobileActive
    ? 440
    : mobileSheetLevel === "expanded"
      ? Math.max(360, viewportHeight - 180)
      : mobileSheetLevel === "peek"
        ? 132
        : 360;
  const mobileSheetSnapHeights = {
    peek: 132,
    collapsed: 360,
    expanded: Math.max(360, viewportHeight - 180),
  };
  const effectiveMobileSheetHeight = mobileSheetDragHeight ?? mobileSheetHeight;
  const mobileClassName =
    "mobile-map-screen" +
    (mobileSheetLevel === "expanded" && !mobileActive ? " is-expanded" : "") +
    (mobileSheetLevel === "peek" && !mobileActive ? " is-peek" : "") +
    (mobileActive ? " is-detail" : "");

  const mobileScreen = (
    <div className={mobileClassName}>
      <ConstellationMap
        partners={partners}
        activeId={mobileActiveId}
        setActiveId={setMobileActiveId}
        hoverId={null}
        tileKey="paper"
        pinStyle="star"
        mobileMode
        sheetHeight={effectiveMobileSheetHeight}
        locateRequest={locateRequest}
      />

      <ConstellationMobileTopChrome />

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
        sheetLevel={mobileSheetLevel}
        sheetHeight={effectiveMobileSheetHeight}
        snapHeights={mobileSheetSnapHeights}
        onToggleExpanded={() =>
          setMobileSheetLevel((level) =>
            level === "expanded" ? "collapsed" : "expanded",
          )
        }
        onDragHeight={setMobileSheetDragHeight}
        onSnapLevel={(level) => {
          setMobileSheetDragHeight(null);
          setMobileSheetLevel(level);
        }}
        onSelect={(id) => {
          setMobileSheetLevel("collapsed");
          setMobileActiveId(id);
        }}
        onClose={() => setMobileActiveId(null)}
      />
    </div>
  );

  const desktopScreen = (
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
        <div className="header__title-row">
          <h1 className="header__title">
            <span>The Living</span>
            <em>Canvas</em>
          </h1>
          <span
            className="header__lockup"
            role="img"
            aria-label="In Bituin star lockup"
          />
        </div>
        <p className="header__intro">
          A <strong>pre-game map</strong> for guests to bop around the city -
          linking up with friends between the gallery and the after party. We
          partner with <strong>local restaurants &amp; businesses</strong> who
          offer exclusive perks to our community in exchange for foot traffic on{" "}
          <strong>Philippine Independence Day.</strong>
        </p>
        <div className="header__meta">
          <span className="meta-pip">
            <span className="meta-pip__dot" />
            <span>
              <strong>Saturday</strong> - June 13, 2026
            </span>
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

      {/* <section className="foot-cue">
        <div className="cue">
          <span className="cue__num">01</span>
          <div>
            <h3 className="cue__title">Drop in.</h3>
            <p className="cue__body">
              Pick a star, get directions, mention <em>In Bituin</em> at the counter. Each spot has
              set aside something small for us — a quiet marker of connection.
            </p>
          </div>
        </div>
        <div className="cue">
          <span className="cue__num">02</span>
          <div>
            <h3 className="cue__title">Collect your stars.</h3>
            <p className="cue__body">
              Check in at any three spots between Jun 12 and Jun 27, and we&apos;ll pull your name
              into the raffle at the gallery close.
            </p>
          </div>
        </div>
        <div className="cue">
          <span className="cue__num">03</span>
          <div>
            <h3 className="cue__title">Bring the constellation home.</h3>
            <p className="cue__body">
              Tag <em>@inbituin</em> from any of these places — we&apos;ll gather the brightest
              notes across the weekend.
            </p>
          </div>
        </div>
      </section> */}

      <TweaksPanel
        tileStyle={tweaks.tileStyle}
        pinStyle={tweaks.pinStyle}
        compactList={tweaks.compactList}
        onTileStyle={(v) => setTweak("tileStyle", v)}
        onPinStyle={(v) => setTweak("pinStyle", v)}
        onCompactList={(v) => setTweak("compactList", v)}
      />
    </div>
  );

  return (
    <div className="page">
      {isMobileViewport === null
        ? null
        : isMobileViewport
          ? mobileScreen
          : desktopScreen}
    </div>
  );
}
