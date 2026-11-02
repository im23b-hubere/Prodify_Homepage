/** The concentric squares from the app's echo share card (features/sessions/share). */
export function EchoSquares({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-470 -470 940 940" aria-hidden="true" className={className}>
      <g transform="rotate(-28)">
        {Array.from({ length: 8 }, (_, index) => {
          const half = 430 - index * 43;
          return <rect key={index} x={-half} y={-half} width={half * 2} height={half * 2} rx={6} fill="none" stroke="#ff3d00" strokeWidth={12} opacity={0.14 + index * 0.09} />;
        })}
      </g>
    </svg>
  );
}
