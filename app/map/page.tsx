import type { Metadata } from "next";
import ConstellationMapApp from "@/components/ConstellationMapApp";
import { loadPartners } from "@/data/loadPartners";

export const metadata: Metadata = {
  title: "Constellation Map · In Bituin",
  description:
    "Your go-to map for the in-between moments before the gallery event, on the way to the after party, and beyond.",
};

export default function MapPage() {
  const partners = loadPartners();
  return <ConstellationMapApp partners={partners} />;
}
