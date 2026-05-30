"use client";

import { useLayoutEffect, useRef } from "react";
import type { Partner } from "@/data/partners";

interface TypeCount {
  key: string;
  count: number;
}

interface ListCardProps {
  p: Partner;
  active: boolean;
  compact: boolean;
  cardRef: (node: HTMLButtonElement | null) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}

function ListCard({
  p,
  active,
  compact,
  cardRef,
  onHover,
  onLeave,
  onClick,
}: ListCardProps) {
  const showPerk = !compact || active;

  return (
    <button
      ref={cardRef}
      className={"card" + (active ? " card--active" : "")}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(p.id)}
      onClick={() => onClick(p.id)}
    >
      <span className="card__body">
        <span className="card__name">{p.name}</span>
        <span className="card__meta">
          <span className="card__type">{p.type}</span>
          <span className="card__sep">·</span>
          <span className="card__loc">{p.neighborhood}</span>
        </span>
        {showPerk && <span className="card__perk">{p.perk}</span>}
      </span>
      <span className="card__chev" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

interface ConstellationListProps {
  partners: Partner[];
  filtered: Partner[];
  activeId: string | null;
  compact: boolean;
  filter: string;
  types: TypeCount[];
  onFilter: (type: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}

export default function ConstellationList({
  partners,
  filtered,
  activeId,
  compact,
  onHover,
  onLeave,
  onClick,
}: ConstellationListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const animationRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!activeId) return;
    const activeCard = cardRefs.current[activeId];
    if (!scrollEl || !activeCard) return;

    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
    }

    const scrollRect = scrollEl.getBoundingClientRect();
    const cardRect = activeCard.getBoundingClientRect();
    const start = scrollEl.scrollTop;
    const rawTarget =
      start + cardRect.top - scrollRect.top - (scrollEl.clientHeight - activeCard.offsetHeight) / 2;
    const maxTarget = scrollEl.scrollHeight - scrollEl.clientHeight;
    const target = Math.max(0, Math.min(rawTarget, maxTarget));
    const distance = target - start;

    if (Math.abs(distance) < 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      scrollEl.scrollTop = target;
      return;
    }

    const duration = 620;
    const startedAt = window.performance.now();
    const ease = (t: number) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      scrollEl.scrollTop = start + distance * ease(elapsed);

      if (elapsed < 1) {
        animationRef.current = window.requestAnimationFrame(tick);
      }
    };

    animationRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeId, filtered]);

  return (
    <aside className={"list" + (compact ? " list--compact" : "")}>
      <div className="list__scroll" ref={scrollRef}>
        {filtered.map((p) => (
          <ListCard
            key={p.id}
            p={p}
            active={activeId === p.id}
            compact={compact}
            cardRef={(node) => {
              cardRefs.current[p.id] = node;
            }}
            onHover={onHover}
            onLeave={onLeave}
            onClick={onClick}
          />
        ))}
      </div>
    </aside>
  );
}
