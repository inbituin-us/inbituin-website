"use client";

import { useState } from "react";

interface TweaksPanelProps {
  tileStyle: string;
  pinStyle: string;
  compactList: boolean;
  onTileStyle: (v: string) => void;
  onPinStyle: (v: string) => void;
  onCompactList: (v: boolean) => void;
}

const TILE_OPTIONS = [
  { value: "canopy", label: "Canopy" },
  { value: "void", label: "Void" },
  { value: "paper", label: "Paper" },
];

const PIN_OPTIONS = [
  { value: "star", label: "Bituin star" },
  { value: "sun", label: "Phil. sun" },
  { value: "classic", label: "Teardrop" },
];

interface SegmentedRadioProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function SegmentedRadio({ value, options, onChange }: SegmentedRadioProps) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div className="twk-seg" role="radiogroup">
      <div
        className="twk-seg-thumb"
        style={{
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`,
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function TweaksPanel({
  tileStyle,
  pinStyle,
  compactList,
  onTileStyle,
  onPinStyle,
  onCompactList,
}: TweaksPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="tweaks-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle tweaks"
        title="Tweaks"
      >
        ⚙
      </button>

      {open && (
        <div className="twk-panel">
          <div className="twk-hd">
            <b>Tweaks</b>
            <button className="twk-x" onClick={() => setOpen(false)} aria-label="Close tweaks">
              ✕
            </button>
          </div>
          <div className="twk-body">
            <div className="twk-sect">Map</div>

            <div className="twk-row">
              <div className="twk-lbl">
                <span>Map style</span>
              </div>
              <SegmentedRadio value={tileStyle} options={TILE_OPTIONS} onChange={onTileStyle} />
            </div>

            <div className="twk-row">
              <div className="twk-lbl">
                <span>Pin style</span>
              </div>
              <SegmentedRadio value={pinStyle} options={PIN_OPTIONS} onChange={onPinStyle} />
            </div>

            <div className="twk-sect">List</div>

            <div className="twk-row twk-row-h">
              <div className="twk-lbl">
                <span>Compact list</span>
              </div>
              <button
                type="button"
                className="twk-toggle"
                data-on={compactList ? "1" : "0"}
                role="switch"
                aria-checked={compactList}
                onClick={() => onCompactList(!compactList)}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
