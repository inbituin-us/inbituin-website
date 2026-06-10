import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import { loadPartners } from "@/data/loadPartners";

export const metadata: Metadata = {
  title: "In Bituin — Constellations of Filipino Creativity",
  description:
    "In Bituin is a gathering of Filipino artists, musicians, poets and storytellers shining together — a constellation across the city.",
};

export default function Home() {
  const partners = loadPartners();
  return <LandingPage partners={partners} />;
}
