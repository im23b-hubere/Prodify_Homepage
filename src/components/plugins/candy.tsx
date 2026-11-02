"use client";

import { useMemo, useState } from "react";
import { Case, Chip, Defs, heat, Knob, TitleBar } from "./kit";

const lanes = ["RISER", "STUTTER", "REVERSE", "GLITCH", "TAPE STOP", "SPARKLE"];
const rates = ["1/8", "1/16", "1/32"];

type Controls = {
  cells: number[][];
  chance: number;
  spread: number;
  rate: number;
  interactive: boolean;
  setChance: (next: number) => void;
  setSpread: (next: number) => void;
  setRate: (next: number) => void;
  cycleCell: (lane: number, step: number) => void;
  generate: () => void;
};

function hash(lane: number, step: number, seed: number) {
  const value = Math.sin(lane * 12.9898 + step * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function createPattern(seed: number, laneCount: number, steps: number) {
  return Array.from({ length: laneCount }, (_, lane) =>
    Array.from({ length: steps }, (_, step) => {
      const roll = hash(lane, step, seed);
      const onBeat = step % 4 === 0 ? 0.14 : 0;
      if (roll > 0.42 + onBeat) return 0;
      return 1 + Math.floor(hash(step, lane, seed + 1) * 4);
    }),
  );
}

function Grid({ controls, x, y, cellWidth, cellHeight, steps, labelWidth }: { controls: Controls; x: number; y: number; cellWidth: number; cellHeight: number; steps: number; labelWidth: number }) {
  const { cells, chance, interactive, cycleCell } = controls;
  return (
    <g>
      {lanes.map((lane, laneIndex) => (
        <g key={lane}>
          <text x={x} y={y + laneIndex * cellHeight + cellHeight / 2 + 3} className="pl-label">
            {lane}
          </text>
          {Array.from({ length: steps }, (_, step) => {
            const level = cells[laneIndex]?.[step] ?? 0;
            const fires = level > 0 && hash(laneIndex + 3, step, 9) <= 0.2 + chance;
            return (
              <rect
                key={step}
                x={x + labelWidth + step * cellWidth + (Math.floor(step / 4) * 6)}
                y={y + laneIndex * cellHeight}
                width={cellWidth - 4}
                height={cellHeight - 4}
                rx={3}
                fill={fires ? heat(level / 4) : "#161616"}
                onClick={interactive ? () => cycleCell(laneIndex, step) : undefined}
                style={interactive ? { cursor: "pointer" } : undefined}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}

function Wide({ controls }: { controls: Controls }) {
  const { chance, spread, rate, interactive, setChance, setSpread, setRate, generate } = controls;
  return (
    <svg viewBox="0 0 1200 500" className="instrument" role="group" aria-label="CANDY plugin interface concept">
      <Defs />
      <Case width={1200} height={500} />
      <TitleBar width={1200} name="CANDY" preset="Eight bar wander" />
      <Grid controls={controls} x={24} y={72} cellWidth={44} cellHeight={56} steps={16} labelWidth={96} />
      <line x1={0} x2={958} y1={420} y2={420} stroke="#222" />
      <Chip x={24} y={442} width={120} label="Generate" active onClick={interactive ? generate : undefined} />
      <text x={168} y={461} className="pl-label" style={{ letterSpacing: "0.02em" }}>Rate</text>
      {rates.map((name, index) => (
        <Chip key={name} x={208 + index * 70} y={442} width={62} label={name} active={false} onClick={interactive ? () => setRate(index) : undefined} />
      ))}
      <rect x={208 + rate * 70} y={472} width={62} height={3} rx={1.5} fill="#ff3d00" />
      <text x={936} y={461} textAnchor="end" className="pl-label" style={{ letterSpacing: "0.02em" }}>Click a step to change it</text>
      <line x1={958} x2={958} y1={48} y2={500} stroke="#222" />
      <Knob cx={1079} cy={150} r={40} value={chance} defaultValue={0.7} label="CHANCE" display={`${Math.round(chance * 100)}%`} onChange={interactive ? setChance : undefined} />
      <Knob cx={1079} cy={344} r={40} value={spread} defaultValue={0.5} label="SPREAD" display={`${Math.round(spread * 100)}%`} onChange={interactive ? setSpread : undefined} />
    </svg>
  );
}

function Tall({ controls }: { controls: Controls }) {
  const { chance, spread, interactive, setChance, setSpread, generate } = controls;
  return (
    <svg viewBox="0 0 360 640" className="instrument" role="group" aria-label="CANDY plugin interface concept">
      <Defs />
      <Case width={360} height={640} />
      <TitleBar width={360} name="CANDY" preset="Eight bar wander" compact />
      <Grid controls={controls} x={14} y={68} cellWidth={30} cellHeight={52} steps={8} labelWidth={84} />
      <Chip x={14} y={396} width={332} label="Generate" active onClick={interactive ? generate : undefined} />
      <Knob cx={100} cy={500} r={34} value={chance} defaultValue={0.7} label="CHANCE" display={`${Math.round(chance * 100)}%`} onChange={interactive ? setChance : undefined} />
      <Knob cx={260} cy={500} r={34} value={spread} defaultValue={0.5} label="SPREAD" display={`${Math.round(spread * 100)}%`} onChange={interactive ? setSpread : undefined} />
    </svg>
  );
}

export function CandyInterface({ interactive = true, layout = "responsive" }: { interactive?: boolean; layout?: "responsive" | "wide" }) {
  const [seed, setSeed] = useState(4);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [chance, setChance] = useState(0.7);
  const [spread, setSpread] = useState(0.5);
  const [rate, setRate] = useState(1);

  const cells = useMemo(() => {
    const pattern = createPattern(seed, lanes.length, 16);
    return pattern.map((lane, laneIndex) => lane.map((level, step) => edits[`${laneIndex}:${step}`] ?? level));
  }, [seed, edits]);

  const controls: Controls = {
    cells,
    chance,
    spread,
    rate,
    interactive,
    setChance,
    setSpread,
    setRate,
    cycleCell: (lane, step) => {
      const current = cells[lane]?.[step] ?? 0;
      setEdits((previous) => ({ ...previous, [`${lane}:${step}`]: (current + 1) % 5 }));
    },
    generate: () => {
      setEdits({});
      setSeed((current) => current + 1);
    },
  };

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
