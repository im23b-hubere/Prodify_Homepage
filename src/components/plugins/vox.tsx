"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useRef, useState } from "react";
import { Case, clamp, Defs, Fader, heat, TitleBar } from "./kit";

type Params = { x: number; y: number; chop: number; spread: number; mix: number };
type Controls = Params & { set: (patch: Partial<Params>) => void; interactive: boolean };

const RESTING: Params = { x: 0.64, y: 0.68, chop: 0.34, spread: 0.58, mix: 0.76 };

const phrase = [
  { start: 0.02, length: 0.13, note: 7, level: 0.75 },
  { start: 0.16, length: 0.07, note: 9, level: 0.5 },
  { start: 0.25, length: 0.17, note: 12, level: 1 },
  { start: 0.45, length: 0.08, note: 10, level: 0.5 },
  { start: 0.54, length: 0.09, note: 7, level: 0.75 },
  { start: 0.66, length: 0.2, note: 5, level: 1 },
  { start: 0.88, length: 0.1, note: 3, level: 0.5 },
];

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const pct = (value: number) => `${Math.round(value * 100)}%`;
const semitones = (y: number) => Math.round((y - 0.5) * 12);

function Pad({ controls, x, y, size }: { controls: Controls; x: number; y: number; size: number }) {
  const { set, interactive } = controls;
  const area = useRef<SVGRectElement>(null);
  const active = useRef(false);
  const puckX = x + controls.x * size;
  const puckY = y + (1 - controls.y) * size;

  const move = (event: PointerEvent<SVGGElement>) => {
    const box = area.current?.getBoundingClientRect();
    if (!box) return;
    set({ x: clamp((event.clientX - box.left) / box.width), y: clamp(1 - (event.clientY - box.top) / box.height) });
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const moves: Record<string, Partial<Params>> = {
      ArrowLeft: { x: clamp(controls.x - 0.02) },
      ArrowRight: { x: clamp(controls.x + 0.02) },
      ArrowUp: { y: clamp(controls.y + 0.02) },
      ArrowDown: { y: clamp(controls.y - 0.02) },
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    set(next);
  };
  const props = interactive
    ? {
        role: "slider",
        tabIndex: 0,
        "aria-label": "Formant and shift pad",
        "aria-valuenow": Math.round(controls.x * 100),
        "aria-valuetext": `Formant ${pct(controls.x)}, shift ${semitones(controls.y)} semitones`,
        className: "pl-knob",
        onKeyDown,
        onPointerDown: (event: PointerEvent<SVGGElement>) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          active.current = true;
          move(event);
        },
        onPointerMove: (event: PointerEvent<SVGGElement>) => {
          if (active.current) move(event);
        },
        onPointerUp: () => {
          active.current = false;
        },
      }
    : {};

  const dots = 15;
  return (
    <g {...props}>
      <rect ref={area} x={x} y={y} width={size} height={size} rx={8} fill="#0b0b0b" stroke="#222" />
      {Array.from({ length: dots * dots }, (_, index) => {
        const column = index % dots;
        const row = Math.floor(index / dots);
        const dotX = x + ((column + 0.5) / dots) * size;
        const dotY = y + ((row + 0.5) / dots) * size;
        const distance = Math.hypot(dotX - puckX, dotY - puckY) / size;
        return <circle key={index} cx={dotX} cy={dotY} r={1.6} fill={distance > 0.42 ? "#2a2a2a" : heat(1.05 - distance * 2.4)} />;
      })}
      <line x1={x} x2={x + size} y1={puckY} y2={puckY} stroke="#ff3d00" strokeOpacity={0.45} />
      <line x1={puckX} x2={puckX} y1={y} y2={y + size} stroke="#ff3d00" strokeOpacity={0.45} />
      {[46, 32, 18].map((radius, index) => (
        <rect
          key={radius}
          x={puckX - radius}
          y={puckY - radius}
          width={radius * 2}
          height={radius * 2}
          rx={3}
          transform={`rotate(-28 ${puckX} ${puckY})`}
          fill="none"
          stroke="#ff3d00"
          strokeWidth={1.5}
          strokeOpacity={0.3 + index * 0.3}
        />
      ))}
      <circle cx={puckX} cy={puckY} r={5} fill="#fff" />
      <rect className="pl-focus" x={x - 3} y={y - 3} width={size + 6} height={size + 6} rx={10} fill="none" stroke="#ff3d00" strokeWidth={1.5} />
      <text x={x + 12} y={y + size - 12} className="pl-label">FORMANT</text>
      <text x={x + size - 12} y={y + 22} textAnchor="end" className="pl-label">SHIFT</text>
    </g>
  );
}

function PitchView({ shift, chop, x, y, width, height }: { shift: number; chop: number; x: number; y: number; width: number; height: number }) {
  const keys = 24;
  const row = height / keys;
  const gridX = x + 46;
  const gridWidth = width - 46;
  const slices = Math.round(1 + chop * 6);
  const noteY = (note: number) => y + height - (note + 3) * row;
  return (
    <g aria-hidden="true">
      <rect x={x} y={y} width={width} height={height} rx={8} fill="#0b0b0b" stroke="#222" />
      {Array.from({ length: keys }, (_, index) => {
        const name = noteNames[(index + 9) % 12] ?? "";
        const black = name.includes("#");
        const rowY = y + height - (index + 1) * row;
        return (
          <g key={index}>
            <rect x={gridX} y={rowY} width={gridWidth - 1} height={row} fill={black ? "#0f0f0f" : "#0b0b0b"} />
            <rect x={x + 1} y={rowY + 0.5} width={45} height={row - 1} fill={black ? "#141414" : "#1c1c1c"} />
          </g>
        );
      })}
      {[0.25, 0.5, 0.75].map((beat) => (
        <line key={beat} x1={gridX + beat * gridWidth} x2={gridX + beat * gridWidth} y1={y} y2={y + height} stroke="#222" />
      ))}
      {phrase.map((note) => {
        const noteX = gridX + note.start * gridWidth;
        const noteWidth = note.length * gridWidth;
        const sliceWidth = noteWidth / slices;
        return Array.from({ length: slices }, (_, index) => (
          <rect
            key={`${note.start}-${index}`}
            x={noteX + index * sliceWidth}
            y={noteY(note.note + shift) - row * 0.5}
            width={Math.max(2, sliceWidth - (slices > 1 ? 3 : 0))}
            height={row * 1.8}
            rx={3}
            fill={heat(note.level)}
          />
        ));
      })}
      <path
        d={phrase
          .map((note, index) => {
            const startX = gridX + note.start * gridWidth;
            const endX = startX + note.length * gridWidth;
            const noteCenter = noteY(note.note + shift) + row * 0.4;
            return `${index === 0 ? "M" : "L"}${startX.toFixed(1)} ${(noteCenter + 4).toFixed(1)}Q${((startX + endX) / 2).toFixed(1)} ${(noteCenter - 7).toFixed(1)} ${endX.toFixed(1)} ${noteCenter.toFixed(1)}`;
          })
          .join("")}
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
      />
    </g>
  );
}

function Wide({ controls }: { controls: Controls }) {
  const { chop, spread, mix, set, interactive } = controls;
  return (
    <svg viewBox="0 0 1200 500" className="instrument" role="group" aria-label="VOX plugin interface concept">
      <Defs />
      <Case width={1200} height={500} />
      <TitleBar width={1200} name="VOX" preset="Phone booth choir" />
      <Pad controls={controls} x={24} y={68} size={408} />
      <PitchView shift={semitones(controls.y)} chop={chop} x={452} y={68} width={490} height={408} />
      <line x1={964} x2={964} y1={48} y2={500} stroke="#222" />
      <Fader x={1020} y={84} height={302} value={chop} label="CHOP" display={pct(chop)} onChange={interactive ? (next) => set({ chop: next }) : undefined} />
      <Fader x={1092} y={84} height={302} value={spread} label="SPREAD" display={pct(spread)} onChange={interactive ? (next) => set({ spread: next }) : undefined} />
      <Fader x={1158} y={84} height={302} value={mix} label="MIX" display={pct(mix)} onChange={interactive ? (next) => set({ mix: next }) : undefined} />
    </svg>
  );
}

function Tall({ controls }: { controls: Controls }) {
  const { chop, spread, mix, set, interactive } = controls;
  return (
    <svg viewBox="0 0 360 640" className="instrument" role="group" aria-label="VOX plugin interface concept">
      <Defs />
      <Case width={360} height={640} />
      <TitleBar width={360} name="VOX" preset="Phone booth choir" compact />
      <Pad controls={controls} x={14} y={62} size={230} />
      <g transform="translate(0 0)">
        <Fader x={302} y={80} height={146} value={mix} label="MIX" display={pct(mix)} onChange={interactive ? (next) => set({ mix: next }) : undefined} />
      </g>
      <PitchView shift={semitones(controls.y)} chop={chop} x={14} y={306} width={332} height={200} />
      <rect x={14} y={530} width={332} height={1} fill="#222" />
      <g>
        <text x={14} y={562} className="pl-label">CHOP</text>
        <text x={346} y={562} textAnchor="end" className="pl-value">{pct(chop)}</text>
        <rect x={14} y={574} width={332} height={4} rx={2} fill="#262626" />
        <rect x={14} y={574} width={332 * chop} height={4} rx={2} fill="#ff3d00" />
        <text x={14} y={606} className="pl-label">SPREAD</text>
        <text x={346} y={606} textAnchor="end" className="pl-value">{pct(spread)}</text>
        <rect x={14} y={618} width={332} height={4} rx={2} fill="#262626" />
        <rect x={14} y={618} width={332 * spread} height={4} rx={2} fill="#ff3d00" />
      </g>
    </svg>
  );
}

export function VoxInterface({ interactive = true, layout = "responsive" }: { interactive?: boolean; layout?: "responsive" | "wide" }) {
  const [params, setParams] = useState(RESTING);
  const controls: Controls = { ...params, interactive, set: (patch) => setParams((current) => ({ ...current, ...patch })) };
  if (layout === "wide") return <Wide controls={controls} />;
  return (
    <>
      <div className="hidden md:block">
        <Wide controls={controls} />
      </div>
      <div className="md:hidden">
        <Tall controls={controls} />
      </div>
    </>
  );
}
