import { JuiceInterface } from "@/components/plugins/juice";
import { ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="shell pt-8 sm:pt-12">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 id="hero-title" className="type-hero lg:col-span-8">
          Make your sound <br className="hidden lg:block" />
          stand out.
        </h1>
        <div className="lg:col-span-4 lg:pb-2">
          <p className="type-lead max-w-md">
            Creative audio plugins and sounds made to bring more character, movement and energy to your productions.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/plugins">Explore Plugins</ButtonLink>
            <ButtonLink href="/#hear" variant="secondary">
              Hear the Difference
            </ButtonLink>
          </div>
        </div>
      </div>

      <figure className="mt-8 sm:mt-10">
        <div className="instrument-case">
          <JuiceInterface sweepOnLoad />
        </div>
        <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm text-fg-muted">
          <span>JUICE, our first plugin, is in development. Turn the controls to see how it is planned to work.</span>
          <span>Interface concept. No audio runs through this display.</span>
        </figcaption>
      </figure>
    </section>
  );
}
