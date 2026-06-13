"use client";

import { useCallback } from "react";
import type { MediaSource } from "@/data/landingMedia";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i;

interface MediaSlotProps {
  media: MediaSource;
  className?: string;
  contain?: boolean;
}

export default function MediaSlot({ media, className, contain }: MediaSlotProps) {
  // React leaves the `muted` attribute out of server-rendered markup, so
  // mobile Safari/Chrome judge the video unmuted and refuse to autoplay.
  // Force the property before kicking playback, and retry on first touch
  // for Low Power Mode / data-saver, where autoplay needs a gesture.
  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    const play = () => {
      el.play().catch(() => {});
    };
    play();
    window.addEventListener("touchend", play, { once: true, passive: true });
  }, []);

  const classes = [
    "lp-slot",
    contain ? "lp-slot--contain" : null,
    media.src ? null : "lp-slot--empty",
    className ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  if (!media.src) {
    return (
      <div className={classes}>
        <span>{media.label}</span>
      </div>
    );
  }

  if (VIDEO_EXTENSIONS.test(media.src)) {
    return (
      <div className={classes}>
        <video
          ref={attachVideo}
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={media.label}
        />
      </div>
    );
  }

  return (
    <div className={classes}>
      <img src={media.src} alt={media.label} />
    </div>
  );
}
