import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AudioCompare } from "@/components/audio-compare";
import { PluginInterface } from "@/components/plugins/plugin-interface";
import { buttonStyles, DefinitionRows, FaqList, OfferTag } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import { getComparison } from "@/content/comparisons";
import { getPlugin, plugins } from "@/content/plugins";
import { site } from "@/content/site";
import { actionLabel, canAct, formatPrice } from "@/lib/offer";
import { isWaitlistConnected } from "@/lib/waitlist";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return plugins.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plugin = getPlugin((await params).slug);
  if (!plugin) return {};
  return {
    title: `${plugin.name}, ${plugin.category.toLowerCase()}`,
    description: plugin.summary,
    alternates: { canonical: `/plugins/${plugin.slug}` },
  };
}

export default async function PluginPage({ params }: Props) {
  const plugin = getPlugin((await params).slug);
  if (!plugin) notFound();

  const comparison = getComparison(plugin.comparisonId);
  const index = plugins.indexOf(plugin);
  const next = plugins[(index + 1) % plugins.length];
  const price = formatPrice(plugin.offer.pricing);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Prodify ${plugin.name}`,
    applicationCategory: "MultimediaApplication",
    description: plugin.summary,
    url: `${site.url}/plugins/${plugin.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <header className="shell pb-8 pt-12 sm:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1 className="type-name text-[clamp(5rem,17vw,15rem)]">{plugin.name}</h1>
          <div className="pb-2 lg:pb-4">
            <p className="font-medium text-fg">{plugin.category}</p>
            <OfferTag offer={plugin.offer} className="mt-1" />
          </div>
        </div>
      </header>

      <div className="shell">
        <figure>
          <div className="instrument-case">
            <PluginInterface slug={plugin.slug} />
          </div>
          <figcaption className="mt-3 text-sm text-fg-muted">Interface concept. The controls respond, but no audio runs through this display. The final plugin may differ.</figcaption>
        </figure>
      </div>

      <section aria-label="About" className="shell grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
        <p className="font-display text-[clamp(1.625rem,3vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-fg lg:col-span-7">{plugin.description}</p>
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="mb-4 font-sans text-sm font-medium text-fg-muted">What it is planned to do</h2>
          <DefinitionRows items={plugin.features} />
        </div>
      </section>

      {comparison ? (
        <section aria-labelledby="demo-title" className="border-y border-line py-20">
          <div className="shell">
            <h2 id="demo-title" className="type-title mb-8">
              Hear {plugin.name}
            </h2>
            <AudioCompare comparisons={[comparison]} compact />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="usage-title" className="shell py-20 lg:py-28">
        <h2 id="usage-title" className="type-display mb-12 max-w-3xl">
          Where it helps
        </h2>
        <div className="grid gap-px overflow-hidden rounded-panel bg-line lg:grid-cols-3">
          {plugin.usage.map((item) => (
            <div key={item.title} className="bg-bg p-6 lg:p-8">
              <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-3 text-fg-soft">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="specs-title" className="shell grid gap-12 border-t border-line py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="specs-title" className="type-title mb-8">
            Technical specifications
          </h2>
          <dl className="border-t border-line">
            {plugin.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 border-b border-line py-3.5">
                <dt className="text-fg">{spec.label}</dt>
                <dd className={spec.value ? "text-right text-fg-soft" : "text-right text-fg-muted"}>{spec.value ?? "Confirmed before release"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="type-title mb-8">Release</h2>
          <OfferTag offer={plugin.offer} />
          <p className="mt-3 text-fg-soft">{price ? `Price: ${price}.` : "The price will be announced before release."}</p>
          <div className="mt-6">
            {canAct(plugin.offer) && plugin.offer.actionUrl ? (
              <a href={plugin.offer.actionUrl} className={buttonStyles.primary}>
                {actionLabel(plugin.offer)}
              </a>
            ) : (
              <WaitlistForm interest="plugins" connected={isWaitlistConnected()} label={`Tell me about ${plugin.name}`} />
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
        <h2 id="faq-title" className="type-title lg:col-span-4">
          Questions
        </h2>
        <div className="lg:col-span-8">
          <FaqList items={plugin.faq} />
        </div>
      </section>

      {next ? (
        <nav aria-label="Next plugin" className="border-t border-line">
          <Link href={`/plugins/${next.slug}`} className="shell group flex items-end justify-between gap-6 py-12">
            <span className="text-fg-muted">Next plugin</span>
            <span className="type-name text-[clamp(3rem,9vw,8rem)] text-fg transition-colors duration-150 group-hover:text-brand">{next.name}</span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}
