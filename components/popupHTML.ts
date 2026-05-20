import type { Partner } from "@/data/partners";

export function popupHTML(p: Partner, idx: number): string {
  const num = String(idx + 1).padStart(2, "0");
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;

  return `
    <div class="pop">
      <div class="pop__cover" style="background: ${p.cover};">
        <span class="pop__type">${p.type}</span>
        <span class="pop__num">★ Bituin No. ${num}</span>
      </div>
      <div class="pop__body">
        <h3 class="pop__name">${p.name}</h3>
        <p class="pop__loc">
          <span class="pop__loc-mark">◆</span>
          <span>${p.address}</span>
        </p>
        <div class="pop__perk">
          <div class="pop__perk-headline">${p.perkLong}</div>
          <div class="pop__perk-period">${p.start} → ${p.end}</div>
        </div>
        <p class="pop__desc">${p.desc}</p>
        <div class="pop__actions">
          <a class="pop__action" href="${mapsUrl}" target="_blank" rel="noopener">Directions →</a>
        </div>
      </div>
    </div>`;
}
