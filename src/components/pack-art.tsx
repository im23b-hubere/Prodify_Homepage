import type { SoundPack } from "@/content/types";

const ramp = ["#1a1a1a", "#4a2a1c", "#8c3a18", "#d14a12", "#ff3d00"];
const color = (level: number) => ramp[Math.min(ramp.length - 1, Math.max(0, Math.round(level)))] ?? "#1a1a1a";

const round = (value: number) => Math.round(value * 10) / 10;

function random(seed: number, index: number) {
  const value = Math.sin(seed * 91.17 + index * 47.53) * 24634.6345;
  return value - Math.floor(value);
}

/** Each motif comes from the app's share cards or heatmap, drawn in the heat ramp. */
function Motif({ pack }: { pack: SoundPack }) {
  const { seed, motif } = pack;
  switch (motif) {
    case "echo":
      return (
        <g transform={`translate(292 300) rotate(-28)`}>
          {Array.from({ length: 8 }, (_, index) => {
            const half = 262 - index * 34;
            return <rect key={index} x={-half} y={-half} width={half * 2} height={half * 2} rx={4} fill="none" stroke="#ff3d00" strokeWidth={13} opacity={0.25 + index * 0.11} />;
          })}
        </g>
      );
    case "bars":
      return (
        <g>
          {Array.from({ length: 30 }, (_, index) => {
            const envelope = Math.sin((index / 29) * Math.PI);
            const height = 40 + envelope * (150 + random(seed, index) * 170);
            return <rect key={index} x={round(22 + index * 12.2)} y={round(240 - height / 2)} width={8} height={round(height)} rx={2} fill={color(1 + envelope * 3.4)} />;
          })}
        </g>
      );
    case "sweep":
      return (
        <g fill="none" strokeWidth={4}>
          {Array.from({ length: 16 }, (_, index) => (
            <path key={index} d={`M${-40 + index * 10} 400Q${120 + index * 16} ${380 - index * 6} ${440} ${index * 26}`} stroke={color(0.5 + index / 4)} />
          ))}
        </g>
      );
    case "ring":
      return (
        <g transform="translate(200 215)">
          {Array.from({ length: 32 }, (_, index) => {
            const on = index % 4 === 0 || random(seed, index) > 0.58;
            const length = on ? 62 + random(seed, index + 40) * 66 : 16;
            return (
              <rect key={index} x={-5} y={-182} width={10} height={round(length)} rx={2} fill={on ? color(index % 4 === 0 ? 4 : 2) : "#1f1f1f"} transform={`rotate(${(index / 32) * 360})`} />
            );
          })}
        </g>
      );
    case "impulse":
      return (
        <g>
          <rect x={150} y={56} width={100} height={288} fill="#ff3d00" />
          {Array.from({ length: 11 }, (_, index) => {
            const height = 230 * Math.exp(-index * 0.34);
            return <rect key={index} x={262 + index * 13} y={round(200 - height / 2)} width={8} height={round(height)} fill={color(3.4 - index * 0.32)} />;
          })}
        </g>
      );
    case "grid":
      return (
        <g>
          {Array.from({ length: 64 }, (_, index) => (
            <rect
              key={index}
              x={36 + (index % 8) * 42}
              y={36 + Math.floor(index / 8) * 42}
              width={36}
              height={36}
              rx={4}
              fill={color(random(seed, index) * 5 - 0.4)}
            />
          ))}
        </g>
      );
  }
}

export function PackArt({ pack, className = "" }: { pack: SoundPack; className?: string }) {
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={`${pack.name} artwork`} className={`block aspect-square w-full bg-[#101010] ${className}`}>
      <defs>
        <clipPath id={`art-${pack.slug}`}>
          <rect width="400" height="400" />
        </clipPath>
      </defs>
      <g clipPath={`url(#art-${pack.slug})`}>
        <Motif pack={pack} />
      </g>
    </svg>
  );
}
