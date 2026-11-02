"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Plays only while on screen. With reduced motion it waits for a press. */
export function AppFilm({ src, poster, title }: { src: string; poster: string; title: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) userPaused.current = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !userPaused.current) void node.play().catch(() => undefined);
        else node.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const node = video.current;
    if (!node) return;
    if (node.paused) {
      userPaused.current = false;
      void node.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      node.pause();
    }
  };

  return (
    <figure className="min-w-0">
      <div className="relative aspect-[9/16] mix-blend-lighten">
        <video
          ref={video}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="size-full object-contain"
        />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-3 text-fg">
        {title}
        <button
          type="button"
          onClick={toggle}
          aria-label={`${playing ? "Pause" : "Play"} film: ${title}`}
          className="grid size-11 shrink-0 place-items-center rounded-control border border-line-strong text-fg hover:border-fg-muted"
        >
          {playing ? <Pause className="size-4" fill="currentColor" aria-hidden="true" /> : <Play className="size-4" fill="currentColor" aria-hidden="true" />}
        </button>
      </figcaption>
    </figure>
  );
}
