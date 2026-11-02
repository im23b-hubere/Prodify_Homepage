"use client";

import { useEffect, useMemo, useState } from "react";
import { Case, Chip, clamp, Defs, Knob, Meter, TitleBar } from "./kit";

type Mode = "Tape" | "Tube" | "Clip";
const modes: Mode[] = ["Tape", "Tube", "Clip"];

type Params = { juice: number; punch: number; body: number; mix: number; mode: Mode };
type Controls = Params & { set: (patch: Partial<Params>) => void; interactive: boolean };

const RESTING: Params = { juice: 0.64, punch: 0.72, body: 0.46, mix: 0.82, mode: "Tube" };

function saturate(value: number, amount: number, mode: Mode) {
  if (amount <= 0) return value;
  const gain = 1 + amount * 3.4;
  if (mode === "Clip") return Math.min(0.84, value * gain * 0.62);
  if (mode === "Tape") return Math.tanh(value * gain * 0.8) * 0.9;
  return Math.tanh(value * gain) * 0.82;
}

/** Drawn with a formula for the concept display. This is not audio analysis. */
function drawBars({ juice, punch, body, mix, mode }: Params, count: number, width: number, height: number) {
  const center = height / 2;
  const step = width / count;
  let dry = "";
  let wet = "";
  let peak = 0;
  for (let index = 0; index < count; index += 1) {
    const phase = ((index / count) * 4) % 1;
    const attack = Math.exp(-phase * 30);
    const tail = Math.exp(-phase * 5.4);
    const ripple = Math.abs(Math.sin(index * 0.73) * 0.5 + Math.sin(index * 0.19) * 0.5);
    const source = tail * (0.42 + 0.58 * ripple) * 0.56 + attack * 0.1;
    const shaped = source * (1 + juice * (punch * 2 * attack + body * 1.2 * (1 - attack)));
    const processed = saturate(shaped, juice * 0.8, mode);
    const blended = source + (processed - source) * mix;
    peak = Math.max(peak, blended);
    const x = (index * step).toFixed(1);
    const dryHeight = Math.max(1, source * center * 0.95);
    const wetHeight = Math.max(1, blended * center * 0.95);
    dry += `M${x} ${(center - dryHeight).toFixed(1)}V${(center + dryHeight).toFixed(1)}`;
    wet += `M${x} ${(center - wetHeight).toFixed(1)}V${(center + wetHeight).toFixed(1)}`;
  }
  return { dry, wet, peak };
}

function Display({ params, x, y, width, height, bars, barWidth }: { params: Params; x: number; y: number; width: number; height: number; bars: number; barWidth: number }) {
  const inner = height - 28;
  const { dry, wet, peak } = useMemo(() => drawBars(params, bars, width - 8, inner), [params, bars, width, inner]);
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect width={width} height={height} rx={8} fill="#0b0b0b" stroke="#222" />
      {[0.25, 0.5, 0.75].map((line) => (
        <line key={line} x1={1} x2={width - 1} y1={line * inner} y2={line * inner} stroke={line === 0.5 ? "#2a2a2a" : "#191919"} />
      ))}
      {[1, 2, 3].map((beat) => (
        <line key={beat} x1={(beat / 4) * width} x2={(beat / 4) * width} y1={0} y2={inner} stroke="#191919" />
      ))}
      <g transform="translate(5 0)">
        <path d={wet} stroke="#ff3d00" strokeWidth={barWidth} />
        <path d={dry} stroke="#5a5a5a" strokeWidth={barWidth} />
      </g>
      <line x1={0} x2={width} y1={inner} y2={inner} stroke="#222" />
      {["1", "2", "3", "4"].map((beat, index) => (
        <text key={beat} x={(index / 4) * width + 10} y={height - 9} className="pl-label">
          {beat}
        </text>
      ))}
      <rect x={width - 118} y={10} width={9} height={9} fill="#5a5a5a" />
      <text x={width - 104} y={19} className="pl-label">DRY</text>
      <rect x={width - 66} y={10} width={9} height={9} fill="#ff3d00" />
      <text x={width - 52} y={19} className="pl-label">JUICE</text>
      <text x={12} y={22} className="pl-value" style={{ fontSize: 15 }}>
        {`${(peak * 100).toFixed(0)}%`}
      </text>
      <text x={50} y={22} className="pl-label">PEAK</text>
    </g>
  );
}

const pct = (value: number) => `${Math.round(value * 100)}%`;

function Wide({ controls }: { controls: Controls }) {
  const { juice, punch, body, mix, mode, set, interactive } = controls;
  const bind = (key: "juice" | "punch" | "body" | "mix") => (interactive ? (next: number) => set({ [key]: next }) : undefined);
  const output = clamp(0.5 + juice * 0.42);
  return (
    <svg viewBox="0 0 1320 520" className="instrument" role="group" aria-label="JUICE plugin interface concept">
      <Defs />
      <Case width={1320} height={520} />
      <TitleBar width={1320} name="JUICE" preset="Tight room kick" />
      <Meter x={30} y={72} height={372} level={0.66} label="IN" />
      <Display params={controls} x={76} y={68} width={760} height={286} bars={190} barWidth={2.4} />

      <Knob cx={148} cy={420} r={27} value={punch} defaultValue={RESTING.punch} label="PUNCH" display={pct(punch)} onChange={bind("punch")} />
      <Knob cx={288} cy={420} r={27} value={body} defaultValue={RESTING.body} label="BODY" display={pct(body)} onChange={bind("body")} />
      <Knob cx={428} cy={420} r={27} value={mix} defaultValue={RESTING.mix} label="MIX" display={pct(mix)} onChange={bind("mix")} />

      <text x={540} y={392} className="pl-label">CHARACTER</text>
      {modes.map((name, index) => (
        <Chip key={name} x={540 + index * 100} y={408} width={92} label={name} active={mode === name} onClick={interactive ? () => set({ mode: name }) : undefined} />
      ))}
      <text x={540} y={466} className="pl-label" style={{ letterSpacing: "0.02em" }}>
        2x oversampling
      </text>

      <line x1={866} x2={866} y1={48} y2={520} stroke="#222" />
      <Knob cx={1082} cy={252} r={122} major value={juice} defaultValue={RESTING.juice} label="JUICE" display={pct(juice)} onChange={bind("juice")} />
      <Meter x={1272} y={72} height={372} level={output} label="OUT" />
    </svg>
  );
}

function Tall({ controls }: { controls: Controls }) {
  const { juice, punch, body, mix, mode, set, interactive } = controls;
  const bind = (key: "juice" | "punch" | "body" | "mix") => (interactive ? (next: number) => set({ [key]: next }) : undefined);
  return (
    <svg viewBox="0 0 360 690" className="instrument" role="group" aria-label="JUICE plugin interface concept">
      <Defs />
      <Case width={360} height={690} />
      <TitleBar width={360} name="JUICE" preset="Tight room kick" compact />
      <Display params={controls} x={14} y={62} width={332} height={158} bars={72} barWidth={2.6} />
      <Knob cx={180} cy={348} r={66} major value={juice} defaultValue={RESTING.juice} label="JUICE" display={pct(juice)} onChange={bind("juice")} />
      <Knob cx={70} cy={530} r={20} value={punch} defaultValue={RESTING.punch} label="PUNCH" display={pct(punch)} onChange={bind("punch")} />
      <Knob cx={180} cy={530} r={20} value={body} defaultValue={RESTING.body} label="BODY" display={pct(body)} onChange={bind("body")} />
      <Knob cx={290} cy={530} r={20} value={mix} defaultValue={RESTING.mix} label="MIX" display={pct(mix)} onChange={bind("mix")} />
      {modes.map((name, index) => (
        <Chip key={name} x={14 + index * 114} y={644} width={104} label={name} active={mode === name} onClick={interactive ? () => set({ mode: name }) : undefined} />
      ))}
    </svg>
  );
}

function Close({ controls }: { controls: Controls }) {
  const { juice, set, interactive } = controls;
  return (
    <svg viewBox="0 0 540 520" className="instrument" role="group" aria-label="JUICE macro control concept">
      <Defs />
      <Case width={540} height={520} />
      <TitleBar width={540} name="JUICE" preset="Tight room kick" compact />
      <Meter x={28} y={76} height={392} level={0.66} label="IN" />
      <Knob cx={270} cy={262} r={132} major value={juice} defaultValue={RESTING.juice} label="JUICE" display={pct(juice)} onChange={interactive ? (next) => set({ juice: next }) : undefined} />
      <Meter x={493} y={76} height={392} level={clamp(0.5 + juice * 0.42)} label="OUT" />
    </svg>
  );
}

export function JuiceInterface({
  interactive = true,
  sweepOnLoad = false,
  layout = "responsive",
}: {
  interactive?: boolean;
  sweepOnLoad?: boolean;
  layout?: "responsive" | "wide" | "close";
}) {
  // The sweep starts from the server-rendered value, so the page never flashes.
  const [params, setParams] = useState<Params>(sweepOnLoad ? { ...RESTING, juice: 0.16 } : RESTING);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!sweepOnLoad || touched) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setParams((current) => ({ ...current, juice: RESTING.juice }));
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = clamp((now - start - 250) / 1400);
      const eased = 1 - Math.pow(1 - progress, 4);
      setParams((current) => ({ ...current, juice: 0.16 + (RESTING.juice - 0.16) * eased }));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [sweepOnLoad, touched]);

  const controls: Controls = {
    ...params,
    interactive,
    set: (patch) => {
      setTouched(true);
      setParams((current) => ({ ...current, ...patch }));
    },
  };

  if (layout === "wide") return <Wide controls={controls} />;
  if (layout === "close") return <Close controls={controls} />;
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
