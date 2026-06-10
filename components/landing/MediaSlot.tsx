import type { MediaSource } from "@/data/landingMedia";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i;

interface MediaSlotProps {
  media: MediaSource;
  className?: string;
  contain?: boolean;
}

export default function MediaSlot({ media, className, contain }: MediaSlotProps) {
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
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
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
