import type { Metadata, Viewport } from "next";
import "@/styles/leaflet.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/page.css";
import "@/styles/header.css";
import "@/styles/list.css";
import "@/styles/map.css";
import "@/styles/mobile-map.css";
import "@/styles/pins.css";
import "@/styles/popup.css";
import "@/styles/foot.css";
import "@/styles/tweaks.css";
import "@/styles/entrance.css";
import "@/styles/site-tokens.css";
import "@/styles/landing.css";

const STAR_ICON = "/assets/graphics/04-LockUp-Star-White.png";

export const metadata: Metadata = {
  title: "In Bituin",
  description:
    "In Bituin is a gathering of Filipino artists, musicians, poets and storytellers shining together — a constellation across the city.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: STAR_ICON, type: "image/png" },
    ],
    apple: [
      { url: STAR_ICON, type: "image/png" },
    ],
    shortcut: STAR_ICON,
  },
  appleWebApp: {
    capable: true,
    title: "In Bituin",
    statusBarStyle: "black-translucent",
    startupImage: STAR_ICON,
  },
};

export const viewport: Viewport = {
  themeColor: "#5e7948",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
