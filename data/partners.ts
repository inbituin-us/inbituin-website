export interface Partner {
  id: string;
  name: string;
  type: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  logo?: string;
  logoPlacement?: "top" | "bottom";
  logoGapDesktop?: number;
  logoGapMobile?: number;
  mapsUrl?: string;
  perk: string;
  perkLong: string;
  start?: string | null;
  end?: string | null;
  desc: string;
  accent: string;
}
