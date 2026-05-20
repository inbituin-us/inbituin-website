import type { Metadata } from "next";
import "@/styles/leaflet.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/page.css";
import "@/styles/nav.css";
import "@/styles/header.css";
import "@/styles/list.css";
import "@/styles/map.css";
import "@/styles/pins.css";
import "@/styles/popup.css";
import "@/styles/foot.css";
import "@/styles/tweaks.css";

export const metadata: Metadata = {
  title: "In Bituin",
  description: "Constellations of Filipino Creativity. Handcrafted · Heartfelt · Alive.",
  icons: {
    icon: "/assets/philippine-sun.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
