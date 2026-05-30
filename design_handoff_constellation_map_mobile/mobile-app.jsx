/* Constellation Map — Mobile. Phone-shaped view of the same partner roster. */

const { useState, useEffect, useRef, useMemo } = React;

/* 4-point bituin star — same shape as the desktop version */
function starIconHTML(num, active) {
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

/* ---------- Map (mobile) ---------- */
function MobileMap({ partners, activeId, setActiveId, paddingBottom }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Init
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(mapEl.current, {
      center: [40.7180, -73.9650],
      zoom: 11.5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20, subdomains: "abcd",
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Re-flow when sheet height changes (so leaflet recalculates size)
  useEffect(() => {
    if (!mapRef.current) return;
    const t = setTimeout(() => mapRef.current.invalidateSize(), 320);
    return () => clearTimeout(t);
  }, [paddingBottom]);

  // Build markers
  useEffect(() => {
    if (!mapRef.current) return;
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    partners.forEach((p, idx) => {
      const icon = L.divIcon({
        html: starIconHTML(String(idx + 1).padStart(2, "0"), false),
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const m = L.marker([p.lat, p.lng], { icon, riseOnHover: true }).addTo(mapRef.current);
      m.on("click", () => setActiveId(p.id));
      markersRef.current[p.id] = m;
    });
  }, [partners, setActiveId]);

  // Active marker swap + smooth pan offset so star sits above the sheet
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    partners.forEach((p, idx) => {
      const m = markersRef.current[p.id];
      if (!m) return;
      const isActive = p.id === activeId;
      m.setIcon(L.divIcon({
        html: starIconHTML(String(idx + 1).padStart(2, "0"), isActive),
        className: "",
        iconSize: isActive ? [52, 52] : [32, 32],
        iconAnchor: isActive ? [26, 26] : [16, 16],
      }));
      if (isActive) {
        const targetZoom = Math.max(map.getZoom(), 13);
        const px = map.project([p.lat, p.lng], targetZoom);
        // Offset so the marker sits in the upper third (sheet covers lower 440px)
        const offsetY = -((paddingBottom / 2) - 60);
        const adjusted = map.unproject(px.subtract([0, -offsetY]), targetZoom);
        map.flyTo(adjusted, targetZoom, { duration: 0.55, easeLinearity: 0.12 });
      }
    });
  }, [activeId, partners, paddingBottom]);

  return (
    <React.Fragment>
      <div className="mob-map" ref={mapEl}></div>
      <div className="mob-tint" aria-hidden="true"></div>
    </React.Fragment>
  );
}

/* ---------- List sheet content ---------- */
function ListSheet({ partners, activeId, onSelect, filterCount, totalCount }) {
  return (
    <React.Fragment>
      <div className="mob-list__head">
        <div className="mob-list__count">
          <em>{String(filterCount).padStart(2, "0")}</em> stars
        </div>
        <div className="mob-list__hint">Tap to fly</div>
      </div>
      <div className="mob-list__scroll">
        {partners.map((p, i) => {
          const realIdx = window.PARTNERS.findIndex(x => x.id === p.id);
          return (
            <button
              key={p.id}
              className={"mob-card" + (activeId === p.id ? " mob-card--active" : "")}
              onClick={() => onSelect(p.id)}
            >
              <span className="mob-card__num">{String(realIdx + 1).padStart(2, "0")}</span>
              <span className="mob-card__body">
                <span className="mob-card__name">{p.name}</span>
                <span className="mob-card__meta">
                  <span className="mob-card__type">{p.type}</span>
                  <span className="mob-card__sep">·</span>
                  <span className="mob-card__loc">{p.neighborhood}</span>
                </span>
              </span>
              <span className="mob-card__chev">›</span>
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
}

/* ---------- Detail card ---------- */
function DetailSheet({ p, idx, onClose }) {
  const directionsURL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(p.address);
  return (
    <div className="mob-detail">
      <div className="mob-detail__cover" style={{ background: p.cover }}>
        <span className="mob-detail__type">{p.type}</span>
        <button className="mob-detail__close" onClick={onClose} aria-label="Close">✕</button>
        <span className="mob-detail__num">★ Bituin No. {String(idx + 1).padStart(2, "0")}</span>
      </div>
      <div className="mob-detail__body">
        <h3 className="mob-detail__name">{p.name}</h3>
        <p className="mob-detail__loc">
          <span className="mob-detail__loc-mark">◆</span>
          <span>{p.address}</span>
        </p>
        <div className="mob-detail__perk">
          <div className="mob-detail__perk-eyebrow">Independence Day exclusive</div>
          <div className="mob-detail__perk-head">{p.perkLong}</div>
          <div className="mob-detail__perk-period">{p.start} → {p.end}</div>
        </div>
        <p className="mob-detail__desc">{p.desc}</p>
        <div className="mob-detail__actions">
          <a className="mob-detail__cta" href={directionsURL} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-7.58 8-13a8 8 0 10-16 0c0 5.42 8 13 8 13z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- The phone screen ---------- */
function MobileScreen() {
  const partners = window.PARTNERS;
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const types = useMemo(() => {
    const counts = {};
    partners.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
    return ["All", ...Object.keys(counts).sort()].map(k =>
      ({ key: k, count: k === "All" ? partners.length : counts[k] }));
  }, [partners]);

  const filtered = useMemo(
    () => filter === "All" ? partners : partners.filter(p => p.type === filter),
    [filter, partners]
  );

  const active = activeId ? partners.find(p => p.id === activeId) : null;
  const activeIdx = active ? partners.findIndex(p => p.id === active.id) : -1;

  // Sheet height — used by map to offset its pan target
  const sheetHeight = active ? 440 : (expanded ? null : 360);

  const cls = "mob-screen"
    + (expanded && !active ? " is-expanded" : "")
    + (active ? " is-detail" : "");

  return (
    <div className={cls}>
      {/* Map (full-bleed behind everything) */}
      <MobileMap
        partners={partners}
        activeId={activeId}
        setActiveId={setActiveId}
        paddingBottom={sheetHeight || 360}
      />

      {/* Top — brand + title */}
      <div className="mob-top">
        <div className="mob-top__row">
          <img className="mob-top__mark" src="assets/philippine-sun.png" alt="" />
          <span className="mob-top__brand">In Bituin</span>
          <button className="mob-top__rsvp">RSVP</button>
        </div>
        <div className="mob-top__title">
          <h1>Constellation</h1>
          <span className="mob-top__mark-spark">✦</span>
          <em>Map</em>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mob-chips">
        {types.map(t => (
          <button
            key={t.key}
            className={"mob-chip" + (filter === t.key ? " mob-chip--on" : "")}
            onClick={() => setFilter(t.key)}
          >
            {t.key} <span className="mob-chip__num">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Locate button */}
      <button className="mob-locate" aria-label="Recenter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
      </button>

      {/* Bottom sheet */}
      <div className="mob-sheet">
        <div className="mob-sheet__handle" onClick={() => !active && setExpanded(e => !e)}></div>
        {active
          ? <DetailSheet p={active} idx={activeIdx} onClose={() => setActiveId(null)} />
          : <ListSheet
              partners={filtered}
              activeId={activeId}
              onSelect={(id) => { setActiveId(id); setExpanded(false); }}
              filterCount={filtered.length}
              totalCount={partners.length}
            />
        }
      </div>
    </div>
  );
}

/* ---------- Stage that scales the phone to fit the viewport ---------- */
function PhoneStage({ children, width = 402, height = 874 }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const padding = 40;
      const sx = (window.innerWidth - padding) / width;
      const sy = (window.innerHeight - padding) / height;
      setScale(Math.min(1, sx, sy));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [width, height]);
  return (
    <div className="mob-host">
      <div style={{ width: width * scale, height: height * scale }}>
        <div className="mob-host__stage" style={{
          width, height,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Outer host: phone frame on a dark stage ---------- */
function App() {
  return (
    <PhoneStage width={402} height={874}>
      <IOSDevice dark={true} width={402} height={874}>
        <MobileScreen />
      </IOSDevice>
    </PhoneStage>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
