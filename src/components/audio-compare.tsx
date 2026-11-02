"use client";

import { LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Comparison } from "@/content/types";
import { ABPlayer, decodeClip, getPeaks, type Side } from "@/lib/ab-player";
import { claimAudio, releaseAudio } from "@/lib/audio-bus";

const BARS = 150;
type LoadState = "idle" | "loading" | "ready" | "error";

const formatTime = (seconds: number) => {
  const whole = Math.floor(seconds);
  const tenths = Math.floor((seconds - whole) * 10);
  return `0:${String(whole).padStart(2, "0")}.${tenths}`;
};

function barsPath(peaks: number[]) {
  const step = 1000 / BARS;
  return peaks
    .map((peak, index) => {
      const height = Math.max(1.5, peak * 92);
      const x = (index * step + step / 2).toFixed(1);
      return `M${x} ${(100 - height).toFixed(1)}V${(100 + height).toFixed(1)}`;
    })
    .join("");
}

/** Neutral resting shape, shown until the clip's real peaks are decoded. */
const restingPeaks = Array.from({ length: BARS }, () => 0.02);

export function AudioCompare({ comparisons, compact = false }: { comparisons: Comparison[]; compact?: boolean }) {
  const [activeId, setActiveId] = useState(comparisons[0]?.id);
  const active = comparisons.find((item) => item.id === activeId) ?? comparisons[0];
  const [side, setSide] = useState<Side>("before");
  const [state, setState] = useState<LoadState>("idle");
  const [playing, setPlaying] = useState(false);
  const [peaks, setPeaks] = useState<Record<Side, number[]> | null>(null);
  const [duration, setDuration] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [inView, setInView] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const player = useRef<ABPlayer | null>(null);
  const played = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const scrubber = useRef<HTMLDivElement>(null);
  const sideRef = useRef(side);
  const frame = useRef(0);
  const scrubbing = useRef(false);

  const paint = useCallback(() => {
    const current = player.current;
    if (!current) return;
    const ratio = current.position / current.duration;
    if (played.current) played.current.style.clipPath = `inset(0 ${(100 - ratio * 100).toFixed(2)}% 0 0)`;
    if (clock.current) clock.current.textContent = formatTime(current.position);
    scrubber.current?.setAttribute("aria-valuenow", current.position.toFixed(1));
    scrubber.current?.setAttribute("aria-valuetext", `${formatTime(current.position)} of ${formatTime(current.duration)}`);
  }, []);

  const stop = useCallback(() => {
    player.current?.pause();
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !inView) return;
    const controller = new AbortController();
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        setState("loading");
        return Promise.all([decodeClip(active.before.src, controller.signal), decodeClip(active.after.src, controller.signal)]);
      })
      .then(([before, after]) => {
        if (cancelled) return;
        player.current = new ABPlayer({ before, after }, sideRef.current);
        setPeaks({ before: getPeaks(before, BARS), after: getPeaks(after, BARS) });
        setDuration(player.current.duration);
        setState("ready");
        paint();
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(frame.current);
      releaseAudio(stop);
      player.current?.dispose();
      player.current = null;
      setPlaying(false);
    };
  }, [active, inView, attempt, paint, stop]);

  const toggle = useCallback(async () => {
    const current = player.current;
    if (!current) return;
    if (current.playing) {
      stop();
      return;
    }
    claimAudio(stop);
    await current.play();
    setPlaying(true);
    const tick = () => {
      paint();
      frame.current = requestAnimationFrame(tick);
    };
    tick();
  }, [paint, stop]);

  const choose = useCallback((next: Side) => {
    sideRef.current = next;
    setSide(next);
    player.current?.setSide(next);
  }, []);

  const seek = useCallback(
    async (seconds: number) => {
      await player.current?.seek(seconds);
      paint();
    },
    [paint],
  );

  const seekFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    void seek(ratio * duration);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement && (event.key === " " || event.key === "Enter")) return;
    const position = player.current?.position ?? 0;
    const actions: Record<string, () => void> = {
      " ": () => void toggle(),
      a: () => choose("before"),
      b: () => choose("after"),
    };
    if (event.target instanceof HTMLElement && event.target.getAttribute("role") === "slider") {
      actions.ArrowLeft = () => void seek(position - 0.5);
      actions.ArrowRight = () => void seek(position + 0.5);
      actions.Home = () => void seek(0);
      actions.End = () => void seek(duration - 0.1);
    }
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const path = useMemo(() => barsPath(peaks?.[side] ?? restingPeaks), [peaks, side]);
  if (!active) return null;

  const ready = state === "ready";
  const sideLabels: Record<Side, string> = { before: active.before.label, after: active.after.label };

  return (
    <div ref={root} onKeyDown={onKeyDown}>
      {comparisons.length > 1 ? (
        <div role="group" aria-label="Choose a demo" className="mb-8 flex flex-wrap gap-2">
          {comparisons.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === active.id}
              onClick={() => setActiveId(item.id)}
              className={`min-h-11 rounded-control border px-4 text-sm font-medium transition-colors duration-150 ${
                item.id === active.id ? "border-fg text-fg" : "border-line-strong text-fg-muted hover:text-fg"
              }`}
            >
              {item.label} <span className="text-fg-muted">with {item.sourceName}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-6">
        <LayoutGroup>
          <div role="group" aria-label="Compare before and after" className="flex gap-6 sm:gap-10">
            {(["before", "after"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={side === option}
                onClick={() => choose(option)}
                className={`relative pb-3 font-display font-bold tracking-[-0.03em] transition-colors duration-150 ${
                  compact ? "text-3xl sm:text-4xl" : "text-[2.5rem] leading-none sm:text-6xl lg:text-7xl"
                } ${side === option ? "text-fg" : "text-[#6e6e6e] hover:text-fg-muted"}`}
              >
                {sideLabels[option]}
                {side === option ? (
                  <motion.span
                    layoutId={`ab-${active.id}`}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 bottom-0 h-1 bg-brand"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </LayoutGroup>

        <button
          type="button"
          onClick={() => void toggle()}
          disabled={!ready}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-14 shrink-0 place-items-center rounded-control bg-brand text-bg transition-transform duration-150 hover:bg-brand-light active:scale-[0.97] disabled:bg-raised disabled:text-fg-muted sm:size-20"
        >
          {state === "loading" ? (
            <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
          ) : playing ? (
            <Pause className="size-6 sm:size-8" fill="currentColor" aria-hidden="true" />
          ) : (
            <Play className="size-6 sm:size-8" fill="currentColor" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        ref={scrubber}
        role="slider"
        tabIndex={0}
        aria-label="Playback position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration * 10) / 10}
        aria-valuenow={0}
        className="relative mt-8 h-36 cursor-pointer touch-none select-none sm:h-52 lg:h-64"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          scrubbing.current = true;
          seekFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (scrubbing.current) seekFromPointer(event);
        }}
        onPointerUp={() => {
          scrubbing.current = false;
        }}
      >
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
          <path d={path} stroke="#333" strokeWidth={3.4} />
        </svg>
        <div ref={played} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
            <path d={path} stroke="#ff3d00" strokeWidth={3.4} />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-6 border-t border-line pt-4 text-sm">
        <p className="tabular text-fg">
          <span ref={clock}>0:00.0</span>
          <span className="text-fg-muted"> / {formatTime(duration)}</span>
        </p>
        <p className="hidden text-fg-muted md:block">Space plays or pauses. A and B switch. Arrow keys move through the clip.</p>
      </div>

      {state === "error" ? (
        <p role="alert" className="mt-4 flex items-center gap-3 text-sm text-fg">
          The audio could not load.
          <button type="button" onClick={() => setAttempt((count) => count + 1)} className="text-link inline-flex items-center gap-1.5">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Try again
          </button>
        </p>
      ) : null}

      {active.kind === "placeholder" ? (
        <p className="mt-6 max-w-2xl border-l border-brand pl-4 text-sm text-fg-soft">{active.note}</p>
      ) : (
        <p className="mt-6 max-w-2xl text-sm text-fg-muted">{active.note}</p>
      )}
    </div>
  );
}
