import type { Metadata } from "next";
import ConstellationMapApp from "@/components/ConstellationMapApp";

export const metadata: Metadata = {
  title: "Constellation Map · In Bituin",
  description:
    "A constellation of Filipino-owned spots across NYC — each holding an exclusive perk for the In Bituin community.",
};

export default function MapPage() {
  return <ConstellationMapApp />;
}
