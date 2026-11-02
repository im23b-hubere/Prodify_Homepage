"use client";

import { Play, Square } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { soundCategories } from "@/content/sounds";
import type { SoundCategory, SoundPack } from "@/content/types";
import { claimAudio, releaseAudio } from "@/lib/audio-bus";
import { PackArt } from "./pack-art";
import { OfferTag } from "./ui";

export function PreviewButton({ pack }: { pack: SoundPack }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const stop = useCallback(() => {
    audio.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => () => {
    audio.current?.pause();
    releaseAudio(stop);
  }, [stop]);

  if (!pack.previewSrc) {
    return (
      <span className="grid size-11 shrink-0 place-items-center text-[#5c5c5c]" title="Preview available at release">
        <Play className="size-4" aria-hidden="true" />
        <span className="sr-only">No preview yet for {pack.name}</span>
      </span>
    );
  }

  const toggle = async () => {
    if (playing) {
      stop();
      return;
    }
    audio.current ??= new Audio(pack.previewSrc ?? undefined);
    audio.current.onended = () => setPlaying(false);
    audio.current.currentTime = 0;
    claimAudio(stop);
    try {
      await audio.current.play();
      setFailed(false);
      setPlaying(true);
    } catch {
      setFailed(true);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-label={failed ? `Preview of ${pack.name} failed, try again` : `${playing ? "Stop" : "Play"} preview of ${pack.name}`}
      className="grid size-11 shrink-0 place-items-center rounded-control border border-line-strong text-fg hover:border-fg-muted"
    >
      {playing ? <Square className="size-4" fill="currentColor" aria-hidden="true" /> : <Play className="size-4" fill="currentColor" aria-hidden="true" />}
    </button>
  );
}

export function SoundCrate({ packs, filterable = false }: { packs: SoundPack[]; filterable?: boolean }) {
  const [filter, setFilter] = useState<SoundCategory | "All">("All");
  const visible = filter === "All" ? packs : packs.filter((pack) => pack.category === filter);
  const [activeSlug, setActiveSlug] = useState(packs[0]?.slug);
  const active = visible.find((pack) => pack.slug === activeSlug) ?? visible[0];

  return (
    <div>
      {filterable ? (
        <div role="group" aria-label="Filter by category" className="mb-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {(["All", ...soundCategories] as const).map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              className={`min-h-11 shrink-0 rounded-control border px-4 text-sm font-medium transition-colors duration-150 ${
                filter === category ? "border-fg text-fg" : "border-line-strong text-fg-muted hover:text-fg"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-5 lg:block">
          {active ? (
            <div className="sticky top-24">
              <PackArt pack={active} className="rounded-panel" />
              <p className="mt-4 max-w-sm text-fg-soft">{active.description}</p>
            </div>
          ) : null}
        </div>

        <ul className="border-t border-line lg:col-span-7">
          {visible.map((pack) => (
            <li
              key={pack.slug}
              onPointerEnter={() => setActiveSlug(pack.slug)}
              onFocusCapture={() => setActiveSlug(pack.slug)}
              className="group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 border-b border-line py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_7rem_8.5rem_auto] lg:grid-cols-[minmax(0,1fr)_6rem_8rem_auto] lg:py-5"
            >
              <PackArt pack={pack} className="rounded-md lg:hidden" />
              <div className="min-w-0">
                <Link href={`/sounds/${pack.slug}`} className="block truncate font-display text-xl font-bold tracking-[-0.02em] text-fg transition-colors duration-150 group-hover:text-brand sm:text-2xl lg:text-3xl">
                  {pack.name}
                </Link>
                <p className="mt-0.5 text-sm text-fg-muted sm:hidden">{pack.category}</p>
              </div>
              <span className="hidden text-sm text-fg-muted sm:block">{pack.category}</span>
              <span className="hidden sm:block">
                <OfferTag offer={pack.offer} />
              </span>
              <PreviewButton pack={pack} />
            </li>
          ))}
          {visible.length === 0 ? (
            <li className="border-b border-line py-10">
              <p className="text-fg">No {filter} packs yet.</p>
              <button type="button" onClick={() => setFilter("All")} className="text-link mt-2 text-sm">
                Show all packs
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
