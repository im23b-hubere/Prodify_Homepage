"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useRef } from "react";
import { markPath } from "@/components/brand";

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const heatStops = ["#1a1a1a", "#4a2a1c", "#8c3a18", "#d14a12", "#ff3d00"];

/** The app's heatmap ramp, indexed by a 0 to 1 level. */
export function heat(level: number): string {
  const index = Math.round(clamp(level) * (heatStops.length - 1));
  return heatStops[index] ?? "#1a1a1a";
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const angle = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function arc(cx: number, cy: number, radius: number, from: number, to: number) {
  const start = polar(cx, cy, radius, from);
  const end = polar(cx, cy, radius, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)}A${radius} ${radius} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/** Vertical drag and keyboard behaviour shared by knobs and faders. */
function useSliderControl(value: number, onChange: ((next: number) => void) | undefined, travel: number, reset: number) {
  const drag = useRef<{ y: number; value: number } | null>(null);

  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    if (!onChange) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { y: event.clientY, value };
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (!drag.current || !onChange) return;
    const scale = event.shiftKey ? 0.25 : 1;
    onChange(clamp(drag.current.value + ((drag.current.y - event.clientY) / travel) * scale));
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (!onChange) return;
    const steps: Record<string, number> = {
      ArrowUp: value + 0.02,
      ArrowRight: value + 0.02,
      ArrowDown: value - 0.02,
      ArrowLeft: value - 0.02,
      PageUp: value + 0.1,
      PageDown: value - 0.1,
      Home: 0,
      End: 1,
    };
    const next = steps[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(clamp(next));
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown, onDoubleClick: () => onChange?.(reset) };
}

type KnobProps = {
  cx: number;
  cy: number;
  r: number;
  value: number;
  label: string;
  display: string;
  onChange?: (next: number) => void;
  defaultValue?: number;
  major?: boolean;
};

const KNOB_FROM = -135;
const KNOB_SWEEP = 270;

export function Knob({ cx, cy, r, value, label, display, onChange, defaultValue = 0.5, major = false }: KnobProps) {
  const handlers = useSliderControl(value, onChange, 190, defaultValue);
  const angle = KNOB_FROM + value * KNOB_SWEEP;
  const ring = r + (major ? 16 : 7);
  const stroke = major ? 5 : 3;
  const pointerOuter = polar(cx, cy, r - (major ? 10 : 6), angle);
  const pointerInner = polar(cx, cy, r * (major ? 0.74 : 0.46), angle);

  const interactiveProps = onChange
    ? {
        ...handlers,
        role: "slider",
        tabIndex: 0,
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": Math.round(value * 100),
        "aria-valuetext": display,
        className: "pl-knob",
      }
    : {};

  return (
    <g {...interactiveProps}>
      <circle cx={cx} cy={cy} r={ring + 8} fill="transparent" />
      {major
        ? Array.from({ length: 41 }, (_, index) => {
            const tickAngle = KNOB_FROM + (index / 40) * KNOB_SWEEP;
            const outer = polar(cx, cy, ring + 15, tickAngle);
            const inner = polar(cx, cy, ring + (index % 10 === 0 ? 8 : 11), tickAngle);
            const lit = index / 40 <= value;
            return (
              <line
                key={index}
                x1={outer.x.toFixed(2)}
                y1={outer.y.toFixed(2)}
                x2={inner.x.toFixed(2)}
                y2={inner.y.toFixed(2)}
                stroke={lit ? heat(0.25 + (index / 40) * 0.75) : "#2e2e2e"}
                strokeWidth={1.5}
              />
            );
          })
        : null}
      <path d={arc(cx, cy, ring, KNOB_FROM, KNOB_FROM + KNOB_SWEEP)} fill="none" stroke="#262626" strokeWidth={stroke} strokeLinecap="round" />
      {value > 0.005 ? (
        <path d={arc(cx, cy, ring, KNOB_FROM, angle)} fill="none" stroke="#ff3d00" strokeWidth={stroke} strokeLinecap="round" />
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="url(#pl-knob-face)" stroke="#333" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r - (major ? 7 : 3)} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={1} />
      {major ? (
        <>
          <circle cx={cx} cy={cy} r={r * 0.66} fill="#0d0d0d" stroke="#2a2a2a" />
          <text x={cx} y={cy + r * 0.13} textAnchor="middle" className="pl-readout" style={{ fontSize: r * 0.36 }}>
            {display}
          </text>
        </>
      ) : null}
      <line
        x1={pointerInner.x.toFixed(2)}
        y1={pointerInner.y.toFixed(2)}
        x2={pointerOuter.x.toFixed(2)}
        y2={pointerOuter.y.toFixed(2)}
        stroke="#fff"
        strokeWidth={major ? 4 : 2.5}
        strokeLinecap="round"
      />
      <circle className="pl-focus" cx={cx} cy={cy} r={ring + 6} fill="none" stroke="#ff3d00" strokeWidth={1.5} strokeDasharray="3 4" />
      <text x={cx} y={cy + ring + (major ? 46 : 22)} textAnchor="middle" className="pl-label">
        {label}
      </text>
      {major ? null : (
        <text x={cx} y={cy + ring + 40} textAnchor="middle" className="pl-value">
          {display}
        </text>
      )}
    </g>
  );
}

type FaderProps = {
  x: number;
  y: number;
  height: number;
  value: number;
  label: string;
  display: string;
  onChange?: (next: number) => void;
};

export function Fader({ x, y, height, value, label, display, onChange }: FaderProps) {
  const handlers = useSliderControl(value, onChange, height, value);
  const capY = y + (1 - value) * height;
  const interactiveProps = onChange
    ? {
        ...handlers,
        role: "slider",
        tabIndex: 0,
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": Math.round(value * 100),
        "aria-valuetext": display,
        className: "pl-knob",
      }
    : {};

  return (
    <g {...interactiveProps}>
      <rect x={x - 26} y={y - 16} width={52} height={height + 32} fill="transparent" />
      {Array.from({ length: 11 }, (_, index) => (
        <line key={index} x1={x - 20} x2={x - 12} y1={y + (index / 10) * height} y2={y + (index / 10) * height} stroke="#2e2e2e" />
      ))}
      <rect x={x - 2} y={y} width={4} height={height} rx={2} fill="#262626" />
      <rect x={x - 2} y={capY} width={4} height={y + height - capY} rx={2} fill="#ff3d00" />
      <rect x={x - 17} y={capY - 11} width={34} height={22} rx={4} fill="url(#pl-knob-face)" stroke="#3a3a3a" />
      <line x1={x - 10} x2={x + 10} y1={capY} y2={capY} stroke="#fff" strokeWidth={2} />
      <rect className="pl-focus" x={x - 22} y={capY - 16} width={44} height={32} rx={6} fill="none" stroke="#ff3d00" strokeWidth={1.5} />
      <text x={x} y={y + height + 38} textAnchor="middle" className="pl-label">
        {label}
      </text>
      <text x={x} y={y + height + 57} textAnchor="middle" className="pl-value">
        {display}
      </text>
    </g>
  );
}

export function Meter({ x, y, height, level, label }: { x: number; y: number; height: number; level: number; label: string }) {
  const segments = Math.floor(height / 6);
  return (
    <g aria-hidden="true">
      {[0, 11].map((offset, channel) =>
        Array.from({ length: segments }, (_, index) => {
          const position = index / (segments - 1);
          const channelLevel = level * (channel === 0 ? 1 : 0.94);
          return (
            <rect
              key={`${channel}-${index}`}
              x={x + offset}
              y={y + height - (index + 1) * 6}
              width={8}
              height={4}
              fill={position <= channelLevel ? heat(0.25 + position * 0.75) : "#1a1a1a"}
            />
          );
        }),
      )}
      <text x={x + 9.5} y={y + height + 20} textAnchor="middle" className="pl-label">
        {label}
      </text>
    </g>
  );
}

export function Chip({
  x,
  y,
  width,
  label,
  active,
  onClick,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const props = onClick
    ? {
        role: "button",
        tabIndex: 0,
        "aria-pressed": Boolean(active),
        className: "pl-control",
        onClick,
        onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        },
      }
    : {};
  return (
    <g {...props}>
      <rect className="pl-chip" x={x} y={y} width={width} height={30} rx={6} fill={active ? "#ff3d00" : "#161616"} stroke={active ? "#ff3d00" : "#2e2e2e"} />
      <rect className="pl-focus" x={x - 3} y={y - 3} width={width + 6} height={36} rx={8} fill="none" stroke="#fff" strokeWidth={1.5} />
      <text x={x + width / 2} y={y + 19.5} textAnchor="middle" className="pl-label" style={{ fill: active ? "#0a0a0a" : "#d4d4d4", letterSpacing: "0.02em", fontWeight: 700 }}>
        {label}
      </text>
    </g>
  );
}

export function Defs() {
  return (
    <defs>
      <radialGradient id="pl-knob-face" cx="0.4" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#2a2a2a" />
        <stop offset="1" stopColor="#131313" />
      </radialGradient>
      <linearGradient id="pl-case" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#171717" />
        <stop offset="1" stopColor="#101010" />
      </linearGradient>
    </defs>
  );
}

export function Case({ width, height }: { width: number; height: number }) {
  return (
    <>
      <rect width={width} height={height} rx={16} fill="url(#pl-case)" />
      <rect x={0.5} y={0.5} width={width - 1} height={height - 1} rx={15.5} fill="none" stroke="#2e2e2e" />
    </>
  );
}

/** Title strip every plugin shares, the way a real product family would. */
export function TitleBar({ width, name, preset, compact = false }: { width: number; name: string; preset: string; compact?: boolean }) {
  const mid = width / 2;
  return (
    <g aria-hidden="true">
      <line x1={0} x2={width} y1={47.5} y2={47.5} stroke="#242424" />
      <g transform="translate(18 15) scale(0.0105)">
        <path d={markPath} transform="translate(-100 -150)" fill="#ff5b01" />
      </g>
      <text x={46} y={30} className="pl-name">
        {name}
      </text>
      {compact ? (
        <text x={width - 18} y={29} textAnchor="end" className="pl-label" style={{ letterSpacing: "0.02em" }}>
          {preset}
        </text>
      ) : (
        <>
          <rect x={mid - 150} y={10} width={300} height={28} rx={6} fill="#0c0c0c" stroke="#262626" />
          <path d={`M${mid - 134} 24l5 -5m-5 5l5 5`} stroke="#8f8f8f" strokeWidth={1.4} fill="none" />
          <path d={`M${mid + 134} 24l-5 -5m5 5l-5 5`} stroke="#8f8f8f" strokeWidth={1.4} fill="none" />
          <text x={mid} y={29} textAnchor="middle" className="pl-label" style={{ fill: "#d4d4d4", letterSpacing: "0.02em", fontSize: 12 }}>
            {preset}
          </text>
          <text x={width - 120} y={29} className="pl-label">A / B</text>
          <circle cx={width - 62} cy={24} r={3} fill="#ff3d00" />
          <text x={width - 52} y={29} className="pl-label">ON</text>
        </>
      )}
    </g>
  );
}
