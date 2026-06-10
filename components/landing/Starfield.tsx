"use client";

import { useEffect, useState } from "react";

interface Star {
  left: string;
  top: string;
  size: string;
  gold: boolean;
  duration: string;
  delay: string;
}

const STAR_COUNT = 70;

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  // Generated on the client only so SSR markup stays deterministic.
  useEffect(() => {
    setStars(
      Array.from({ length: STAR_COUNT }, () => ({
        left: `${(Math.random() * 100).toFixed(2)}%`,
        top: `${(Math.random() * 78).toFixed(2)}%`,
        size: `${(Math.random() * 2 + 0.6).toFixed(2)}px`,
        gold: Math.random() < 0.12,
        duration: `${(Math.random() * 4 + 2.5).toFixed(2)}s`,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
      })),
    );
  }, []);

  return (
    <div className="lp-starfield" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={"lp-star" + (star.gold ? " is-gold" : "")}
          style={
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              "--tw": star.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
