import Image from "next/image";

/**
 * Frames come from the app's onboarding films, which already include the device.
 * `lighten` lets their black surround sit on the page background.
 */
export function Phone({ src, alt, sizes, className = "", priority = false }: { src: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative aspect-[9/16] mix-blend-lighten ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
    </div>
  );
}
