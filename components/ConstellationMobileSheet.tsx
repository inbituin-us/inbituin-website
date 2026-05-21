import { useRef } from "react";
import type { Partner } from "@/data/partners";

interface TypeCount {
  key: string;
  count: number;
}

interface MobileTopChromeProps {
  types: TypeCount[];
  filter: string;
  onFilter: (type: string) => void;
}

export function ConstellationMobileTopChrome({
  types,
  filter,
  onFilter,
}: MobileTopChromeProps) {
  return (
    <>
      <div className="mob-top">
        <div className="mob-top__row">
          <img className="mob-top__mark" src="/assets/philippine-sun.png" alt="" />
          <span className="mob-top__brand">In Bituin</span>
          <a className="mob-top__rsvp" href="#">
            RSVP
          </a>
        </div>
        <div className="mob-top__title">
          <h1>Constellation</h1>
          <span className="mob-top__spark" aria-hidden="true">
            ✦
          </span>
          <em>Map</em>
        </div>
      </div>

      <div className="mob-chips" aria-label="Filter businesses">
        {types.map((type) => (
          <button
            key={type.key}
            className={"mob-chip" + (filter === type.key ? " mob-chip--on" : "")}
            onClick={() => onFilter(type.key)}
            type="button"
          >
            {type.key} <span className="mob-chip__num">{type.count}</span>
          </button>
        ))}
      </div>
    </>
  );
}

interface MobileSheetProps {
  partners: Partner[];
  filtered: Partner[];
  active: Partner | null;
  sheetLevel: "peek" | "collapsed" | "expanded";
  onToggleExpanded: () => void;
  onExpandUp: () => void;
  onCollapseDown: () => void;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function ConstellationMobileSheet({
  partners,
  filtered,
  active,
  sheetLevel,
  onToggleExpanded,
  onExpandUp,
  onCollapseDown,
  onSelect,
  onClose,
}: MobileSheetProps) {
  const touchStartY = useRef<number | null>(null);
  const activeIndex = active ? partners.findIndex((partner) => partner.id === active.id) : -1;
  const handleLabel =
    sheetLevel === "expanded" ? "Collapse business list" : "Expand business list";

  const onTouchEnd = (y: number) => {
    if (touchStartY.current === null || active) return;
    const delta = y - touchStartY.current;
    touchStartY.current = null;

    if (delta < -28) {
      onExpandUp();
    } else if (delta > 28) {
      onCollapseDown();
    }
  };

  return (
    <div className="mob-sheet" aria-label={active ? `${active.name} details` : "Business list"}>
      <button
        className="mob-sheet__handle"
        aria-label={handleLabel}
        disabled={Boolean(active)}
        onClick={onToggleExpanded}
        onTouchStart={(event) => {
          touchStartY.current = event.changedTouches[0]?.clientY ?? null;
        }}
        onTouchEnd={(event) => {
          onTouchEnd(event.changedTouches[0]?.clientY ?? 0);
        }}
        type="button"
      />
      {active ? (
        <MobileDetail partner={active} index={activeIndex} onClose={onClose} />
      ) : (
        <MobileList
          partners={partners}
          filtered={filtered}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

interface MobileListProps {
  partners: Partner[];
  filtered: Partner[];
  onSelect: (id: string) => void;
}

function MobileList({ partners, filtered, onSelect }: MobileListProps) {
  return (
    <>
      <div className="mob-list__head">
        <div className="mob-list__count">
          <em>{String(filtered.length).padStart(2, "0")}</em> stars
        </div>
        <div className="mob-list__hint">Tap to fly</div>
      </div>
      <div className="mob-list__scroll">
        {filtered.map((partner) => {
          const index = partners.findIndex((item) => item.id === partner.id);
          return (
            <button
              key={partner.id}
              className="mob-card"
              onClick={() => onSelect(partner.id)}
              type="button"
            >
              <span className="mob-card__num">{String(index + 1).padStart(2, "0")}</span>
              <span className="mob-card__body">
                <span className="mob-card__name">{partner.name}</span>
                <span className="mob-card__meta">
                  <span className="mob-card__type">{partner.type}</span>
                  <span className="mob-card__sep">·</span>
                  <span className="mob-card__loc">{partner.neighborhood}</span>
                </span>
              </span>
              <span className="mob-card__chev" aria-hidden="true">
                ›
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

interface MobileDetailProps {
  partner: Partner;
  index: number;
  onClose: () => void;
}

function MobileDetail({ partner, index, onClose }: MobileDetailProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    partner.address,
  )}`;

  return (
    <div className="mob-detail">
      <div className="mob-detail__cover" style={{ background: partner.cover }}>
        <span className="mob-detail__type">{partner.type}</span>
        <button
          className="mob-detail__close"
          onClick={onClose}
          aria-label="Close details"
          type="button"
        >
          ✕
        </button>
        <span className="mob-detail__num">
          ★ Bituin No. {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mob-detail__body">
        <h2 className="mob-detail__name">{partner.name}</h2>
        <p className="mob-detail__loc">
          <span className="mob-detail__loc-mark" aria-hidden="true">
            ◆
          </span>
          <span>{partner.address}</span>
        </p>
        <div className="mob-detail__perk">
          <div className="mob-detail__perk-eyebrow">Independence Day exclusive</div>
          <div className="mob-detail__perk-head">{partner.perkLong}</div>
          <div className="mob-detail__perk-period">
            {partner.start} → {partner.end}
          </div>
        </div>
        <p className="mob-detail__desc">{partner.desc}</p>
        <a className="mob-detail__cta" href={mapsUrl} target="_blank" rel="noopener">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-7.58 8-13a8 8 0 1 0-16 0c0 5.42 8 13 8 13z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Directions
        </a>
      </div>
    </div>
  );
}
