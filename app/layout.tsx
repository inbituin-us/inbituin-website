import type { Metadata, Viewport } from "next";
import "@/styles/leaflet.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/page.css";
import "@/styles/nav.css";
import "@/styles/header.css";
import "@/styles/list.css";
import "@/styles/map.css";
import "@/styles/mobile-map.css";
import "@/styles/pins.css";
import "@/styles/popup.css";
import "@/styles/foot.css";
import "@/styles/tweaks.css";

export const metadata: Metadata = {
  title: "In Bituin",
  description: "The Living Canvas — a constellation of Filipino creativity grounded in kapwa.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/assets/graphics/philippine-sun-calamansi.png", type: "image/png" },
    ],
    apple: [
      { url: "/assets/graphics/philippine-sun-calamansi.png", type: "image/png" },
    ],
    shortcut: "/assets/graphics/philippine-sun-calamansi.png",
  },
  appleWebApp: {
    capable: true,
    title: "In Bituin",
    statusBarStyle: "black-translucent",
    startupImage: "/assets/graphics/philippine-sun-calamansi.png",
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
