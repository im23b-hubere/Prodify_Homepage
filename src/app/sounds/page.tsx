import type { Metadata } from "next";
import { SoundCrate } from "@/components/sound-crate";
import { PageIntro } from "@/components/ui";
import { soundPacks } from "@/content/sounds";

export const metadata: Metadata = {
  title: "Sounds",
  description: "Prodify Sounds: planned sample packs, drum kits, one-shots, loops, FX and presets.",
  alternates: { canonical: "/sounds" },
};

export default function SoundsPage() {
  return (
    <>
      <PageIntro title="Prodify Sounds">
        <p>Drums, vocals, FX, loops, one-shots and presets. Every pack here is a concept for now, so names and contents can change.</p>
      </PageIntro>
      <div className="shell pb-24">
        <SoundCrate packs={soundPacks} filterable />
      </div>
    </>
  );
}
