"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Partner } from "@/data/partners";
import { popupHTML } from "@/components/popupHTML";

const TILE_PRESETS: Record<
  string,
  { url: string; attribution: string; filter: string }
> = {
  canopy: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter:
      "sepia(0.45) hue-rotate(30deg) saturate(0.72) brightness(0.62) contrast(0.98)",
  },
  void: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter:
      "sepia(0.35) hue-rotate(20deg) saturate(0.55) brightness(0.46) contrast(1.08)",
  },
  paper: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>',
    filter:
      "sepia(0.18) hue-rotate(18deg) saturate(0.72) brightness(1.02) contrast(0.96)",
  },
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface PartnerMarkerLayout {
  width: number;
  height: number;
  starSize: number;
  logoWidth: number;
  logoHeight: number;
  gap: number;
}

function withPartnerLogo(
  pinHTML: string,
  logo: string | undefined,
  name: string,
  active: boolean,
  layout?: PartnerMarkerLayout,
): string {
  if (!logo) return pinHTML;

  const lowerName = name.toLowerCase();
  const logoBelow = lowerName.includes("lackawanna");
  const cls =
    "partner-marker" +
    (active ? " partner-marker--active" : "") +
    (logoBelow ? " partner-marker--logo-bottom" : "");
  const markerWidth = layout?.width ?? (active ? 76 : 60);
  const markerHeight = layout?.height ?? (active ? 106 : 77);
  const starSize = layout?.starSize ?? (active ? 72 : 52);
  const logoWidth = layout?.logoWidth ?? (active ? 34 : 26);
  const logoHeight = layout?.logoHeight ?? (active ? 22 : 16);
  const gap = layout?.gap ?? (active ? 12 : 9);
  const starTop = logoBelow ? 0 : logoHeight + gap;
  const logoTop = logoBelow ? starSize + gap : 0;
  const starLeft = (markerWidth - starSize) / 2;
  const logoLeft = (markerWidth - logoWidth) / 2;

  return `
    <div class="${cls}" style="width:${markerWidth}px;height:${markerHeight}px;position:relative;">
      <span class="partner-marker__pin" style="position:absolute;left:${starLeft}px;top:${starTop}px;width:${starSize}px;height:${starSize}px;">
        ${pinHTML}
      </span>
      <span class="partner-marker__logo" style="position:absolute;left:${logoLeft}px;top:${logoTop}px;width:${logoWidth}px;height:${logoHeight}px;display:flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;box-shadow:none;">
        <img src="${escapeAttr(logo)}" alt="${escapeAttr(name)} logo" loading="lazy" width="${logoWidth}" height="${logoHeight}" style="display:block;width:${logoWidth}px;height:${logoHeight}px;object-fit:contain;" />
      </span>
    </div>`;
}

function starIconHTML(
  num: string,
  active: boolean,
  logo?: string,
  name = "",
  layout?: PartnerMarkerLayout,
): string {
  const cls = "star-pin" + (active ? " star-pin--active" : "");
  return withPartnerLogo(
    `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <path class="star-halo" d="
          M 0 -44 L 6 -10 L 30 -30 L 10 -6 L 44 0 L 10 6
          L 30 30 L 6 10 L 0 44 L -6 10 L -30 30 L -10 6
          L -44 0 L -10 -6 L -30 -30 L -6 -10 Z"/>
        <path class="star-shape" d="
          M 0 -22 L 5 -5 L 22 0 L 5 5 L 0 22 L -5 5 L -22 0 L -5 -5 Z"/>
      </svg>
    </div>`,
    logo,
    name,
    active,
    layout,
  );
}

function sunIconHTML(
  num: string,
  active: boolean,
  logo?: string,
  name = "",
  layout?: PartnerMarkerLayout,
): string {
  const cls = "star-pin sun-pin" + (active ? " star-pin--active" : "");
  const rays: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    rays.push(
      `<rect class="star-shape" x="-1.4" y="-30" width="2.8" height="14" transform="rotate(${a})"/>`,
    );
  }
  return withPartnerLogo(
    `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <circle class="star-halo" cx="0" cy="0" r="38"/>
        <g>${rays.join("")}</g>
        <circle class="star-shape" cx="0" cy="0" r="11"/>
      </svg>
    </div>`,
    logo,
    name,
    active,
    layout,
  );
}

function pinIconHTML(
  num: string,
  active: boolean,
  logo?: string,
  name = "",
  layout?: PartnerMarkerLayout,
): string {
  const cls = "star-pin pin-pin" + (active ? " star-pin--active" : "");
  return withPartnerLogo(
    `
    <div class="${cls}" data-num="${num}">
      <svg viewBox="-50 -50 100 100" aria-hidden="true">
        <circle class="star-halo" cx="0" cy="-4" r="36"/>
        <path class="star-shape" d="M 0 26 C -22 6 -22 -22 0 -22 C 22 -22 22 6 0 26 Z"/>
        <circle cx="0" cy="-4" r="6" fill="#16180c"/>
      </svg>
    </div>`,
    logo,
    name,
    active,
    layout,
  );
}

const PIN_RENDERERS: Record<
  string,
  (
    num: string,
    active: boolean,
    logo?: string,
    name?: string,
    layout?: PartnerMarkerLayout,
  ) => string
> = {
  star: starIconHTML,
  sun: sunIconHTML,
  classic: pinIconHTML,
};

function getPartnerMarkerLayout(active: boolean, mobileMode: boolean): PartnerMarkerLayout {
  if (mobileMode) {
    return active
      ? { width: 166, height: 124, starSize: 52, logoWidth: 129, logoHeight: 57, gap: 15 }
      : { width: 134, height: 94, starSize: 32, logoWidth: 102, logoHeight: 45, gap: 13 };
  }

  return active
    ? { width: 218, height: 178, starSize: 72, logoWidth: 168, logoHeight: 84, gap: 18 }
    : { width: 180, height: 142, starSize: 52, logoWidth: 138, logoHeight: 69, gap: 16 };
}

function getPartnerMarkerAnchor(
  layout: PartnerMarkerLayout,
  name: string,
): [number, number] {
  const logoBelow = name.toLowerCase().includes("lackawanna");
  return [
    layout.width / 2,
    logoBelow
      ? layout.starSize / 2
      : layout.logoHeight + layout.gap + layout.starSize / 2,
  ];
}

interface ConstellationMapProps {
  partners: Partner[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  hoverId: string | null;
  tileKey: string;
  pinStyle: string;
  mobileMode?: boolean;
  sheetHeight?: number;
  locateRequest?: number;
}

export default function ConstellationMap({
  partners,
  activeId,
  setActiveId,
  hoverId,
  tileKey,
  pinStyle,
  mobileMode = false,
  sheetHeight = 0,
  locateRequest = 0,
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
      zoom: mobileMode ? 11.5 : 12,
      zoomSnap: mobileMode ? 0.5 : 1,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    if (!mobileMode) {
      L.control.zoom({ position: "topright" }).addTo(map);
    }
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
  }, [mobileMode]);

  useEffect(() => {
    if (!mobileMode || !mapRef.current) return;
    const timeout = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 320);
    return () => window.clearTimeout(timeout);
  }, [mobileMode, sheetHeight]);

  useEffect(() => {
    if (
      !mobileMode ||
      !locateRequest ||
      !mapRef.current ||
      !navigator.geolocation
    )
      return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapRef.current?.flyTo([coords.latitude, coords.longitude], 14, {
          duration: 0.55,
          easeLinearity: 0.12,
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  }, [mobileMode, locateRequest]);

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
      const layout = p.logo ? getPartnerMarkerLayout(false, mobileMode) : null;
      const anchor = layout ? getPartnerMarkerAnchor(layout, p.name) : null;
      const icon = L.divIcon({
        html: render(num, false, p.logo, p.name, layout ?? undefined),
        className: "",
        iconSize: layout
          ? [layout.width, layout.height]
          : mobileMode
            ? [32, 32]
            : [36, 36],
        iconAnchor: anchor
          ? anchor
          : mobileMode
            ? [16, 16]
            : [18, 18],
      });

      const m = L.marker([p.lat, p.lng], { icon, riseOnHover: true }).addTo(
        mapRef.current!,
      );

      if (!mobileMode) {
        const isMobile =
          typeof window !== "undefined" && window.innerWidth < 640;
        m.bindPopup(popupHTML(p), {
          offset: L.point(0, -10),
          closeButton: true,
          autoPan: false,
          autoPanPadding: isMobile ? L.point(12, 60) : L.point(60, 80),
          maxWidth: isMobile ? window.innerWidth - 24 : 420,
        });
      }

      m.on("click", () => setActiveId(p.id));
      markersRef.current[p.id] = m;
    });
  }, [partners, pinStyle, setActiveId, mobileMode]);

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
        shape?.setAttribute("fill", "var(--ib-calamansi)");
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
      const layout = p.logo ? getPartnerMarkerLayout(isActive, mobileMode) : null;
      const anchor = layout ? getPartnerMarkerAnchor(layout, p.name) : null;
      const icon = L.divIcon({
        html: render(num, isActive, p.logo, p.name, layout ?? undefined),
        className: "",
        iconSize: layout
          ? [layout.width, layout.height]
          : isActive
            ? mobileMode
              ? [52, 52]
              : [56, 56]
            : mobileMode
              ? [32, 32]
              : [36, 36],
        iconAnchor: anchor
          ? anchor
          : isActive
            ? mobileMode
              ? [26, 26]
              : [28, 28]
            : mobileMode
              ? [16, 16]
              : [18, 18],
      });
      m.setIcon(icon);

      if (isActive) {
        const map = mapRef.current!;
        const targetZoom = Math.max(map.getZoom(), mobileMode ? 13 : 14);
        const px = map.project([p.lat, p.lng], targetZoom);
        const yOffset = mobileMode ? Math.max(90, sheetHeight / 2 - 40) : 90;
        const adjusted = map.unproject(
          mobileMode ? px.add([0, yOffset]) : px.subtract([0, yOffset]),
          targetZoom,
        );
        map.flyTo(adjusted, targetZoom, {
          duration: 0.42,
          easeLinearity: 0.22,
        });
        if (!mobileMode) {
          m.openPopup();
        }
      }
    });
  }, [activeId, partners, pinStyle, mobileMode, sheetHeight]);

  return (
    <div className={"map-wrap" + (mobileMode ? " map-wrap--mobile" : "")}>
      <div className="map-canvas" ref={mapEl} />
      <div className="map-tint" aria-hidden="true" />

      {!mobileMode && (
        <div className="map-corner map-corner--br">
          <div
            className="map-corner__row"
            style={{ justifyContent: "flex-end" } as React.CSSProperties}
          >
            <span className="map-corner__label">June</span>
            <span className="map-corner__val">2026</span>
            <span className="map-corner__bar" />
          </div>
        </div>
      )}
    </div>
  );
}
