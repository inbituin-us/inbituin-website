import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In Bituin",
    short_name: "In Bituin",
    description: "Constellations of Filipino Creativity. Handcrafted · Heartfelt · Alive.",
    start_url: "/map",
    scope: "/",
    display: "standalone",
    background_color: "#0f1538",
    theme_color: "#0f1538",
    icons: [
      {
        src: "/assets/philippine-sun.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/philippine-sun.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
