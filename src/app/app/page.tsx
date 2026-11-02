import type { Metadata } from "next";
import { AppFilm } from "@/components/app-film";
import { Phone } from "@/components/phone";
import { DefinitionRows } from "@/components/ui";
import { prodifyApp } from "@/content/app";

export const metadata: Metadata = {
  title: "App",
  description: "The Prodify app helps music producers stay consistent: studio sessions, streaks, stats, a skill tree and friends.",
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  const { screens } = prodifyApp;
  const stores = [
    { href: prodifyApp.appStoreUrl, label: "App Store" },
    { href: prodifyApp.playStoreUrl, label: "Google Play" },
  ].filter((store): store is { href: string; label: string } => Boolean(store.href));

  return (
    <>
      <section className="shell grid items-center gap-8 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-8">
        <div className="lg:col-span-7">
          <h1 className="type-hero">{prodifyApp.tagline}</h1>
          <p className="type-lead mt-6 max-w-xl">{prodifyApp.summary}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg-soft">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
            {prodifyApp.releaseNote}
          </p>
          {stores.length > 0 ? (
            <p className="mt-3 flex gap-6">
              {stores.map((store) => (
                <a key={store.label} href={store.href} className="text-link font-medium">
                  {store.label}
                </a>
              ))}
            </p>
          ) : null}
        </div>
        <Phone src={screens.skillTree.src} alt={screens.skillTree.alt} sizes="(min-width: 1024px) 38vw, 90vw" priority className="mx-auto w-full max-w-md lg:col-span-5" />
      </section>

      <section aria-labelledby="features-title" className="shell grid gap-10 border-t border-line py-20 lg:grid-cols-12">
        <h2 id="features-title" className="type-title lg:col-span-4">
          What the app does
        </h2>
        <div className="lg:col-span-8">
          <DefinitionRows items={prodifyApp.features} />
        </div>
      </section>

      <section aria-labelledby="films-title" className="border-t border-line py-20">
        <div className="shell">
          <h2 id="films-title" className="type-title mb-10">
            See it in use
          </h2>
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
            {prodifyApp.films.map((film) => (
              <div key={film.src} className="w-[72vw] shrink-0 snap-center sm:w-auto">
                <AppFilm {...film} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="types-title" className="shell border-t border-line py-20">
        <h2 id="types-title" className="type-title mb-8">
          Eleven kinds of session
        </h2>
        <p className="font-display text-[clamp(1.75rem,4.2vw,4rem)] font-bold leading-[1.14] tracking-[-0.03em] text-fg-muted">
          {prodifyApp.sessionTypes.join(", ")}.
        </p>
      </section>

      <section aria-label="Access" className="border-t border-line bg-surface">
        <p className="shell py-10 text-lg text-fg">{prodifyApp.access}</p>
      </section>
    </>
  );
}
