import { useId } from "react";

/** Vector redraw of mobile/assets/Logo_new/Prodify_Logo_Transparent_4K.png. */
export const markPath =
  "M105 157H1190C1543 157 1828 452 1828 805C1828 1158 1543 1452 1190 1452H685V1090H1165C1317 1090 1415 965 1415 812C1415 660 1317 537 1165 537H527V1272L105 1770Z";

export function Mark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="100 150 1735 1625" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ff5b01" />
          <stop offset="1" stopColor="#fe4301" />
        </linearGradient>
      </defs>
      <path d={markPath} fill={`url(#${id})`} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[22px] w-auto" />
      <span translate="no" className="font-display text-[1.3125rem] font-bold leading-none tracking-[-0.03em] text-brand">
        Prodify
      </span>
    </span>
  );
}
