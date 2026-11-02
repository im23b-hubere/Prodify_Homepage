import Link from "next/link";
import { JuiceInterface } from "@/components/plugins/juice";
import { PluginInterface } from "@/components/plugins/plugin-interface";
import { OfferTag } from "@/components/ui";
import { plugins } from "@/content/plugins";
import type { Plugin } from "@/content/types";

function Details({ plugin }: { plugin: Plugin }) {
  return (
    <div>
      <p className="font-medium text-fg">{plugin.category}</p>
      <p className="mt-2 max-w-sm text-fg-soft">{plugin.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <OfferTag offer={plugin.offer} />
        <Link href={`/plugins/${plugin.slug}`} className="text-link font-medium">
          View {plugin.name}
        </Link>
      </div>
    </div>
  );
}

/** Each unit has its own composition, so the section reads as a rack rather than a card row. */
const layouts: Record<Plugin["slug"], { text: string; ui: string; name: string }> = {
  juice: {
    text: "lg:col-span-7 lg:self-end",
    ui: "lg:col-span-5",
    name: "text-[clamp(4.5rem,13.4vw,12rem)]",
  },
  vox: {
    text: "lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:self-start",
    ui: "lg:col-span-9 lg:row-start-1",
    name: "text-[clamp(4.5rem,8vw,7.25rem)]",
  },
  candy: {
    text: "lg:col-span-12 lg:flex lg:items-end lg:justify-between lg:gap-10",
    ui: "lg:col-span-12",
    name: "text-[clamp(4.5rem,13.4vw,12rem)] lg:mb-0",
  },
};

export function PluginRack() {
  return (
    <section aria-labelledby="plugins-title" className="mt-24 sm:mt-32">
      <div className="shell pb-10 lg:pb-14">
        <h2 id="plugins-title" className="type-display max-w-4xl">
          Small plugins. One clear job each.
        </h2>
      </div>
      {plugins.map((plugin) => {
        const layout = layouts[plugin.slug];
        return (
          <article key={plugin.slug} className="rack-unit border-t border-line bg-bg">
            <div className="shell grid gap-8 py-10 lg:grid-cols-12 lg:gap-8 lg:py-12">
              <div className={layout.text}>
                <h3 className={`type-name mb-6 ${layout.name}`}>
                  <Link href={`/plugins/${plugin.slug}`} className="transition-colors duration-150 hover:text-brand">
                    {plugin.name}
                  </Link>
                </h3>
                <Details plugin={plugin} />
              </div>
              <div className={layout.ui}>
                <div className="instrument-case">
                  {plugin.slug === "juice" ? <JuiceInterface layout="close" /> : <PluginInterface slug={plugin.slug} />}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
