import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackArt } from "@/components/pack-art";
import { PreviewButton } from "@/components/sound-crate";
import { buttonStyles, OfferTag } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import { getSoundPack, soundPacks } from "@/content/sounds";
import { actionLabel, canAct, formatPrice } from "@/lib/offer";
import { isWaitlistConnected } from "@/lib/waitlist";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return soundPacks.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pack = getSoundPack((await params).slug);
  if (!pack) return {};
  return {
    title: pack.name,
    description: pack.description,
    alternates: { canonical: `/sounds/${pack.slug}` },
  };
}

export default async function SoundPackPage({ params }: Props) {
  const pack = getSoundPack((await params).slug);
  if (!pack) notFound();
  const price = formatPrice(pack.offer.pricing);

  return (
    <div className="shell grid gap-10 pb-24 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-16">
      <div className="lg:col-span-6">
        <PackArt pack={pack} className="rounded-panel" />
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        <Link href="/sounds" className="text-link text-sm">
          All sounds
        </Link>
        <h1 className="type-display mt-6">{pack.name}</h1>
        <p className="mt-3 font-medium text-fg">{pack.category}</p>
        <p className="type-lead mt-6">{pack.description}</p>

        <div className="mt-8 flex items-center gap-4 border-y border-line py-4">
          <PreviewButton pack={pack} />
          <p className="text-sm text-fg-soft">{pack.previewSrc ? "Play a preview" : "Audio preview available at release"}</p>
        </div>

        <h2 className="mb-3 mt-8 font-sans text-sm font-medium text-fg-muted">Planned contents</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-fg">
          {pack.contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-10">
          <OfferTag offer={pack.offer} />
          <p className="mt-2 text-fg-soft">{price ? `Price: ${price}.` : "This is a provisional concept. The price will be announced before release."}</p>
          <div className="mt-6">
            {canAct(pack.offer) && pack.offer.actionUrl ? (
              <a href={pack.offer.actionUrl} className={buttonStyles.primary}>
                {actionLabel(pack.offer)}
              </a>
            ) : (
              <WaitlistForm interest="sounds" connected={isWaitlistConnected()} label="Tell me when it is out" stacked />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
