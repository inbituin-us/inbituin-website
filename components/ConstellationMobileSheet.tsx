import { useRef, useState, type PointerEvent } from "react";
import type { Partner } from "@/data/partners";

type MobileSheetLevel = "peek" | "collapsed" | "expanded";

const RSVP_URL = "https://partiful.com/e/q0vog3c2ldApTwNfSQbL?c=8NqPm6FG";

export function ConstellationMobileTopChrome() {
  return (
    <div className="mob-top">
      <div className="mob-top__lockup">
        <span className="mob-top__mark" aria-hidden="true" />
        <div className="mob-top__copy">
          <span className="mob-top__brand">In Bituin</span>
          <div className="mob-top__title">
            <h1>The Living Canvas</h1>
          </div>
        </div>
        <a className="mob-top__rsvp" href={RSVP_URL} target="_blank" rel="noopener">
          RSVP
        </a>
      </div>
    </div>
  );
}

interface MobileSheetProps {
  partners: Partner[];
  filtered: Partner[];
  active: Partner | null;
  sheetLevel: MobileSheetLevel;
  sheetHeight: number;
  snapHeights: Record<MobileSheetLevel, number>;
  onToggleExpanded: () => void;
  onDragHeight: (height: number | null) => void;
  onSnapLevel: (level: MobileSheetLevel) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function ConstellationMobileSheet({
  partners,
  filtered,
  active,
  sheetLevel,
  sheetHeight,
  snapHeights,
  onToggleExpanded,
  onDragHeight,
  onSnapLevel,
  onSelect,
  onClose,
}: MobileSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ y: number; height: number } | null>(null);
  const draggedRef = useRef(false);
  const handleLabel =
    sheetLevel === "expanded" ? "Collapse business list" : "Expand business list";

  const snapToNearestLevel = (height: number) => {
    const levels: MobileSheetLevel[] = ["peek", "collapsed", "expanded"];
    return levels.reduce((best, level) => {
      const bestDistance = Math.abs(snapHeights[best] - height);
      const distance = Math.abs(snapHeights[level] - height);
      return distance < bestDistance ? level : best;
    }, "collapsed" as MobileSheetLevel);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current || active) return;
    const delta = dragStart.current.y - event.clientY;
    if (Math.abs(delta) <= 3) return;
    draggedRef.current = true;
    const minHeight = snapHeights.peek;
    const maxHeight = snapHeights.expanded;
    const nextHeight = Math.max(
      minHeight,
      Math.min(dragStart.current.height + delta, maxHeight),
    );
    onDragHeight(nextHeight);
  };

  const finishDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current || active) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);

    if (!draggedRef.current) {
      dragStart.current = null;
      onToggleExpanded();
      return;
    }

    const delta = dragStart.current.y - event.clientY;
    const projectedHeight = Math.max(
      snapHeights.peek,
      Math.min(dragStart.current.height + delta, snapHeights.expanded),
    );
    dragStart.current = null;
    onSnapLevel(snapToNearestLevel(projectedHeight));
  };

  return (
    <div
      className={"mob-sheet" + (isDragging ? " is-dragging" : "")}
      aria-label={active ? `${active.name} details` : "Business list"}
      style={{ height: sheetHeight }}
    >
      <button
        className="mob-sheet__handle"
        aria-label={handleLabel}
        disabled={Boolean(active)}
        onPointerDown={(event) => {
          if (active) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = { y: event.clientY, height: sheetHeight };
          draggedRef.current = false;
          setIsDragging(true);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => {
          if (!dragStart.current) return;
          event.currentTarget.releasePointerCapture(event.pointerId);
          dragStart.current = null;
          setIsDragging(false);
          onDragHeight(null);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onToggleExpanded();
        }}
        type="button"
      />
      {active ? (
        <MobileDetail partner={active} onClose={onClose} />
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
      <div className="mob-list__scroll">
        {filtered.map((partner) => (
          <button
            key={partner.id}
            className="mob-card"
            onClick={() => onSelect(partner.id)}
            type="button"
          >
            <span className="mob-card__body">
              <span className="mob-card__name">{partner.name}</span>
              <span className="mob-card__meta">
                <span className="mob-card__type">{partner.type}</span>
                <span className="mob-card__sep">·</span>
                <span className="mob-card__loc">{partner.neighborhood}</span>
              </span>
              <span className="mob-card__perk">{partner.perk}</span>
            </span>
            <span className="mob-card__chev" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

interface MobileDetailProps {
  partner: Partner;
  onClose: () => void;
}

function MobileDetail({ partner, onClose }: MobileDetailProps) {
  const mapsUrl =
    partner.mapsUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(partner.address)}`;
  const period = [partner.start, partner.end].filter(Boolean).join(" / ");

  return (
    <div className="mob-detail">
      <div className="mob-detail__body">
        <button
          className="mob-detail__close"
          onClick={onClose}
          aria-label="Close details"
          type="button"
        >
          ✕
        </button>
        <div className="mob-detail__title-row">
          <h2 className="mob-detail__name">{partner.name}</h2>
          <span className="mob-detail__type">{partner.type}</span>
        </div>
        <p className="mob-detail__loc">
          <span className="mob-detail__loc-mark" aria-hidden="true">
            ◆
          </span>
          <span>{partner.address}</span>
        </p>
        <div className="mob-detail__perk">
          <div className="mob-detail__perk-eyebrow">Living Canvas exclusive</div>
          <div className="mob-detail__perk-head">{partner.perkLong}</div>
          {period && <div className="mob-detail__perk-period">{period}</div>}
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
