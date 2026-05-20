"use client";

import type { Partner } from "@/data/partners";

interface TypeCount {
  key: string;
  count: number;
}

interface ListCardProps {
  p: Partner;
  idx: number;
  active: boolean;
  compact: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}

function ListCard({
  p,
  idx,
  active,
  compact,
  onHover,
  onLeave,
  onClick,
}: ListCardProps) {
  return (
    <button
      className={"card" + (active ? " card--active" : "")}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(p.id)}
      onClick={() => onClick(p.id)}
    >
      <span className="card__num">{String(idx + 1).padStart(2, "0")}</span>
      <span className="card__body">
        <span className="card__name">{p.name}</span>
        <span className="card__meta">
          <span className="card__type">{p.type}</span>
          <span className="card__sep">·</span>
          <span className="card__loc">{p.neighborhood}</span>
        </span>
        {!compact && <span className="card__perk">{p.perk}</span>}
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
  activeId: string;
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
  filter,
  types,
  onFilter,
  onHover,
  onLeave,
  onClick,
}: ConstellationListProps) {
  return (
    <aside className={"list" + (compact ? " list--compact" : "")}>
      <div className="list__head">
        {/* <div className="list__title">
          <span className="list__count">
            <em>{String(filtered.length).padStart(2, "0")}</em> stars in the constellation
          </span>
          <span className="list__legend">
            <span className="list__legend-dot" />
            Selected
          </span>
        </div> */}
        <div className="list__chips">
          {types.map((t) => (
            <button
              key={t.key}
              className={"chip" + (filter === t.key ? " chip--on" : "")}
              onClick={() => onFilter(t.key)}
            >
              {t.key} <span className="chip__num">{t.count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="list__scroll">
        {filtered.map((p) => (
          <ListCard
            key={p.id}
            p={p}
            idx={partners.findIndex((x) => x.id === p.id)}
            active={activeId === p.id}
            compact={compact}
            onHover={onHover}
            onLeave={onLeave}
            onClick={onClick}
          />
        ))}
      </div>
    </aside>
  );
}
