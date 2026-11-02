import Link from "next/link";
import { Phone } from "@/components/phone";
import { prodifyApp } from "@/content/app";

export function AppSection() {
  const { screens } = prodifyApp;
  return (
    <section aria-labelledby="app-title" className="shell overflow-hidden py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="app-title" className="type-display">
            {prodifyApp.tagline}
          </h2>
          <p className="type-lead mt-6 max-w-md">
            Plugins shape the track. The Prodify app keeps you in the studio: time your sessions, protect your streak and watch your skills grow.
          </p>
          <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-fg">
            {prodifyApp.features.slice(0, 4).map((feature) => (
              <li key={feature.title}>{feature.title.replace(" and weekly goals", "")}</li>
            ))}
            <li>Friends</li>
            <li>Challenges</li>
          </ul>
          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-fg-soft">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              {prodifyApp.releaseNote}. Subscription app.
            </span>
            <Link href="/app" className="text-link font-medium">
              See the app
            </Link>
          </p>
        </div>

        <div className="relative -mx-4 grid grid-cols-[1fr_1.22fr_1fr] items-center gap-0 sm:mx-0 lg:col-span-7">
          <Phone src={screens.sessionTypes.src} alt={screens.sessionTypes.alt} sizes="(min-width: 1024px) 22vw, 32vw" className="translate-y-10" />
          <Phone src={screens.skillTree.src} alt={screens.skillTree.alt} sizes="(min-width: 1024px) 28vw, 40vw" />
          <Phone src={screens.friends.src} alt={screens.friends.alt} sizes="(min-width: 1024px) 22vw, 32vw" className="-translate-y-10" />
        </div>
      </div>
    </section>
  );
}
