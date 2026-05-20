"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Partner } from "@/data/partners";
import { popupHTML } from "@/components/popupHTML";

const TILE_PRESETS: Record<string, { url: string; attribution: string; filter: string }> = {
  canopy: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter: "hue-rotate(240deg) saturate(0.55) brightness(0.75)",
  },
  void: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter: "hue-rotate(230deg) saturate(0.4) brightness(0.5) contrast(1.1)",
  },
  paper: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter: "hue-rotate(210deg) saturate(0.5) brightness(0.9)",
  },
};

function starIconHTML(num: string, active: boolean): string {
  const cls = "star-pin" + (active ? " star-pin--active" : "");
  return `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <path class="star-halo" d="
          M 0 -44 L 6 -10 L 30 -30 L 10 -6 L 44 0 L 10 6
          L 30 30 L 6 10 L 0 44 L -6 10 L -30 30 L -10 6
          L -44 0 L -10 -6 L -30 -30 L -6 -10 Z"/>
        <path class="star-shape" d="
          M 0 -22 L 5 -5 L 22 0 L 5 5 L 0 22 L -5 5 L -22 0 L -5 -5 Z"/>
        <text class="star-num" x="0" y="0.5">${num}</text>
      </svg>
    </div>`;
}

function sunIconHTML(num: string, active: boolean): string {
  const cls = "star-pin sun-pin" + (active ? " star-pin--active" : "");
  const rays: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    rays.push(`<rect class="star-shape" x="-1.4" y="-30" width="2.8" height="14" transform="rotate(${a})"/>`);
  }
  return `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <circle class="star-halo" cx="0" cy="0" r="38"/>
        <g>${rays.join("")}</g>
        <circle class="star-shape" cx="0" cy="0" r="11"/>
        <text class="star-num" x="0" y="0.5">${num}</text>
      </svg>
    </div>`;
}

function pinIconHTML(num: string, active: boolean): string {
  const cls = "star-pin pin-pin" + (active ? " star-pin--active" : "");
  return `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <circle class="star-halo" cx="0" cy="-4" r="36"/>
        <path class="star-shape" d="M 0 26 C -22 6 -22 -22 0 -22 C 22 -22 22 6 0 26 Z"/>
        <circle cx="0" cy="-4" r="6" fill="#16180c"/>
      </svg>
    </div>`;
}

const PIN_RENDERERS: Record<string, (num: string, active: boolean) => string> = {
  star: starIconHTML,
  sun: sunIconHTML,
  classic: pinIconHTML,
};

interface ConstellationMapProps {
  partners: Partner[];
  activeId: string;
  setActiveId: (id: string) => void;
  hoverId: string | null;
  tileKey: string;
  pinStyle: string;
}

export default function ConstellationMap({
  partners,
  activeId,
  setActiveId,
  hoverId,
  tileKey,
  pinStyle,
}: ConstellationMapProps) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !mapEl.current) return;

    const map = L.map(mapEl.current, {
      center: [40.718, -73.965],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    mapRef.current = map;

    const preset = TILE_PRESETS[tileKey] ?? TILE_PRESETS.canopy;
    const tl = L.tileLayer(preset.url, {
      maxZoom: 20,
      subdomains: "abcd",
      attribution: preset.attribution,
    }).addTo(map);
    tileRef.current = tl;

    const pane = map.getPanes().tilePane;
    if (pane) pane.style.filter = preset.filter;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layer when style changes
  useEffect(() => {
    if (!mapRef.current) return;
    const preset = TILE_PRESETS[tileKey] ?? TILE_PRESETS.canopy;
    if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
    const tl = L.tileLayer(preset.url, {
      maxZoom: 20,
      subdomains: "abcd",
      attribution: preset.attribution,
    }).addTo(mapRef.current);
    tileRef.current = tl;
    const pane = mapRef.current.getPanes().tilePane;
    if (pane) pane.style.filter = preset.filter;
  }, [tileKey]);

  // Rebuild markers when partners or pin style changes
  useEffect(() => {
    if (!mapRef.current) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const render = PIN_RENDERERS[pinStyle] ?? PIN_RENDERERS.star;

    partners.forEach((p, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      const icon = L.divIcon({
        html: render(num, false),
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const m = L.marker([p.lat, p.lng], { icon, riseOnHover: true }).addTo(mapRef.current!);

      m.bindPopup(popupHTML(p, idx), {
        offset: L.point(0, -10),
        closeButton: true,
        autoPan: true,
        autoPanPadding: L.point(60, 80),
        maxWidth: 420,
      });

      m.on("click", () => setActiveId(p.id));
      markersRef.current[p.id] = m;
    });
  }, [partners, pinStyle, setActiveId]);

  // Hover highlight
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      const pin = el.querySelector<HTMLElement>(".star-pin");
      if (!pin) return;
      if (id === hoverId && id !== activeId) {
        pin.style.transform = "scale(1.18)";
        const shape = pin.querySelector<SVGPathElement>(".star-shape");
        shape?.setAttribute("fill", "var(--ib-fg-display)");
      } else if (id !== activeId) {
        pin.style.transform = "";
        const shape = pin.querySelector<SVGPathElement>(".star-shape");
        shape?.removeAttribute("fill");
      }
    });
  }, [hoverId, activeId]);

  // Active selection — fly + open popup + swap icon
  useEffect(() => {
    if (!mapRef.current) return;
    const render = PIN_RENDERERS[pinStyle] ?? PIN_RENDERERS.star;

    partners.forEach((p, idx) => {
      const m = markersRef.current[p.id];
      if (!m) return;
      const isActive = p.id === activeId;
      const num = String(idx + 1).padStart(2, "0");
      const icon = L.divIcon({
        html: render(num, isActive),
        className: "",
        iconSize: isActive ? [56, 56] : [36, 36],
        iconAnchor: isActive ? [28, 28] : [18, 18],
      });
      m.setIcon(icon);

      if (isActive) {
        const map = mapRef.current!;
        const targetZoom = Math.max(map.getZoom(), 14);
        const px = map.project([p.lat, p.lng], targetZoom);
        const adjusted = map.unproject(px.subtract([0, 90]), targetZoom);
        map.flyTo(adjusted, targetZoom, { duration: 0.55, easeLinearity: 0.12 });
        setTimeout(() => m.openPopup(), 480);
      }
    });
  }, [activeId, partners, pinStyle]);

  return (
    <div className="map-wrap">
      <div id="map" ref={mapEl} />
      <div className="map-tint" aria-hidden="true" />

      <div className="map-corner map-corner--br">
        <div className="map-corner__row" style={{ justifyContent: "flex-end" } as React.CSSProperties}>
          <span className="map-corner__label">Plate</span>
          <span className="map-corner__val">004 / 2026</span>
          <span className="map-corner__bar" />
        </div>
      </div>

      <div className="map-attr">
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">
          OpenStreetMap
        </a>
        {" · "}
        <a href="https://carto.com/attributions" target="_blank" rel="noopener">
          CARTO
        </a>
        {" · "}Leaflet
      </div>
    </div>
  );
}
