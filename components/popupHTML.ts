import type { Partner } from "@/data/partners";

export function popupHTML(p: Partner): string {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;
  const period = [p.start, p.end].filter(Boolean).join(" / ");

  return `
    <div class="pop">
      <div class="pop__body">
        <div class="pop__title-row">
          <h3 class="pop__name">${p.name}</h3>
          <span class="pop__type">${p.type}</span>
        </div>
        <p class="pop__loc">
          <span class="pop__loc-mark">◆</span>
          <span>${p.address}</span>
        </p>
        <div class="pop__perk">
          <div class="pop__perk-headline">${p.perkLong}</div>
          ${period ? `<div class="pop__perk-period">${period}</div>` : ""}
        </div>
        <p class="pop__desc">${p.desc}</p>
        <div class="pop__actions">
          <a class="pop__action" href="${mapsUrl}" target="_blank" rel="noopener">Directions ↗</a>
        </div>
      </div>
    </div>`;
}
