import { AudioCompare } from "@/components/audio-compare";
import { AppSection } from "@/components/home/app-section";
import { Hero } from "@/components/home/hero";
import { MembershipTeaser } from "@/components/home/membership-teaser";
import { PluginRack } from "@/components/home/plugin-rack";
import { SoundCrate } from "@/components/sound-crate";
import { comparisons } from "@/content/comparisons";
import { soundPacks } from "@/content/sounds";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PluginRack />

      <section id="hear" aria-labelledby="hear-title" className="relative z-10 border-t border-line bg-bg py-20 sm:py-28">
        <div className="shell">
          <h2 id="hear-title" className="type-title mb-8">
            Hear the difference.
          </h2>
          <AudioCompare comparisons={comparisons} />
        </div>
      </section>

      <MembershipTeaser />

      <section aria-labelledby="sounds-title" className="shell py-24 sm:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id="sounds-title" className="type-display max-w-3xl">
            Prodify Sounds
          </h2>
          <div className="max-w-sm">
            <p className="text-fg-soft">Drums, vocals, FX, loops, one-shots and presets. These are the packs we are planning.</p>
            <Link href="/sounds" className="text-link mt-2 inline-block font-medium">
              Browse all sounds
            </Link>
          </div>
        </div>
        <SoundCrate packs={soundPacks} />
      </section>

      <div className="border-t border-line">
        <AppSection />
      </div>
    </>
  );
}
