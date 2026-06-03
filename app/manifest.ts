import type { MetadataRoute } from "next";

const STAR_ICON = "/assets/graphics/04-LockUp-Star-White.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In Bituin",
    short_name: "In Bituin",
    description: "The Living Canvas — a constellation of Filipino creativity grounded in kapwa.",
    start_url: "/map",
    scope: "/",
    display: "standalone",
    background_color: "#5e7948",
    theme_color: "#5e7948",
    icons: [
      {
        src: STAR_ICON,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: STAR_ICON,
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
